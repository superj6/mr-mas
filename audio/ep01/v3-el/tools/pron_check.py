#!/usr/bin/env python3
"""pron_check.py - does a take say the name the way the registry does? A forced-choice ASR check (track A4, v3-voices-el).

A plain ASR read is a weak test for a parody name: the recogniser writes "Microsoft" for "Macrosoft" whatever it hears,
because that is the word it knows. This scores the take against competing transcripts instead: for each candidate text
it asks faster-whisper (small.en, the house recogniser) for log P(text | audio) through CTranslate2's forced alignment
(the per-token probabilities `align` returns), and reports the margin of the intended text over the best competitor.
The recogniser's own prior still favours the common word, so a margin is read against controls: a take known to say the
intended word (a Kokoro take read from the house IPA) and one known to say the competitor.

  score  --wav W [W ...] --texts "And go to Macrosoft." "And go to Microsoft."     (the first text is the intended one)
  probe  --lines TIMELINE --id LINE --variant NAME:WORD=RESPELLING[;WORD=RESPELLING][@BUMP] ... --texts ...
         render one line in its set-A voice once per variant (a respelling of the text as sent, or a new seed with @N),
         dressed exactly as el_render dresses it, into --out; the cache is shared, so the variant chosen is free later.
         --extra "TEXT" renders a control line (a competitor said on purpose) in the same voice. --max-chars caps it.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import sys
import types

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import el_render as R  # noqa: E402
import elaudio as E  # noqa: E402

_M = None


def _model():
    global _M
    if _M is None:
        from faster_whisper import WhisperModel
        from faster_whisper.tokenizer import Tokenizer
        m = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=4)
        tok = Tokenizer(m.hf_tokenizer, m.model.is_multilingual, task="transcribe", language="en")
        _M = (m, tok)
    return _M


def forced(y48, texts):
    """-> [(text, sum log p, n tokens)] for each candidate transcript of one take (48 kHz array)"""
    import numpy as np
    from faster_whisper.audio import pad_or_trim
    from scipy.signal import resample_poly
    m, tok = _model()
    y16 = resample_poly(np.asarray(y48, dtype=np.float64), 1, 3).astype(np.float32)
    feats = m.feature_extractor(y16)
    nf = min(feats.shape[-1], m.feature_extractor.nb_max_frames)
    enc = m.encode(pad_or_trim(feats[:, :nf]))
    toks = [tok.encode(" " + t.strip()) for t in texts]
    res = [m.model.align(enc, tok.sot_sequence, [tt], [nf])[0] for tt in toks]     # the encoder output is one take
    out = []
    for t, tt, r in zip(texts, toks, res):
        p = list(r.text_token_probs)[: len(tt)]
        out.append((t, round(sum(math.log(max(x, 1e-12)) for x in p), 3), len(tt)))
    return out


def margin(y48, texts):
    sc = forced(y48, texts)
    best_other = max(s for _, s, _ in sc[1:])
    return round(sc[0][1] - best_other, 3), sc


def load(path):
    import soundfile as sf
    y, sr = sf.read(path, dtype="float32", always_2d=True)
    y = y.mean(axis=1)
    if sr != E.SR:
        from scipy.signal import resample_poly
        from math import gcd
        g = gcd(E.SR, sr)
        y = resample_poly(y.astype("float64"), E.SR // g, sr // g).astype("float32")
    return y


def cmd_score(a):
    for w in a.wav:
        y = load(w)
        mg, sc = margin(y, a.texts)
        txt, _ = E.asr(y)
        print(f"{os.path.relpath(w, R.REPO)}\n  margin {mg:+.2f} | asr: {txt}")
        for t, s, n in sc:
            print(f"    {s:8.2f}  {t}")


def cmd_probe(a):
    cast = R.Cast()
    rows = {r["id"]: r for r in R.read_rows(a.lines)}
    row = rows[a.id]
    role = cast.role_of(row["who"])
    c, rdef = cast.voice(role, "A")
    out = os.path.abspath(a.out)
    for sub in ("wav", "wav-device", "log"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    man = R.load_manifest(out)
    args = types.SimpleNamespace(redress=False, dry_run=False, budget_left=a.max_chars, target_lufs=a.target_lufs,
                                 reuse=[], retry_bad=0)
    base_rs = dict(cast.d.get("respell", {}))
    base_rl = json.loads(json.dumps(cast.d.get("respell_lines", {})))
    results = []
    variants = list(a.variant) + [f"extra{i}:" for i in range(len(a.extra))]
    for i, v in enumerate(variants):
        name, _, spec = v.partition(":")
        bump = 0
        if "@" in spec:
            spec, _, b = spec.rpartition("@")
            bump = int(b)
        ov = {}
        for kv in [x for x in spec.split(";") if "=" in x]:                  # WORD=RESPELLING;WORD=RESPELLING
            k, _, val = kv.partition("=")
            ov[k] = val
        rl = json.loads(json.dumps(base_rl))
        if ov:
            rl.setdefault(row["id"], {}).update(ov)                         # line level: over the role's spelling too
        cast.d["respell_lines"] = rl
        r = dict(row)
        if name.startswith("extra"):
            r = dict(row, id=f"{row['id']}-ctl{i}", text=a.extra[int(name[5:])])
        man["takes"].pop(f"{r['id']}__{role}-{c['cand']}", None)     # the real id, so the seed (and the cache key) is the
        rec, n = R.render_take(r, role, c, rdef, cast, out, man, args, print, bump=bump)   # episode render's
        R.save_manifest(out, man)
        src = os.path.join(R.REPO, rec["file"])
        dst = os.path.join(out, "wav", f"{r['id']}~{name}.wav")
        os.replace(src, dst)
        rec = dict(rec, file=os.path.relpath(dst, R.REPO))
        y = load(dst)
        mg, sc = margin(y, a.texts)
        results.append(dict(variant=name, sent=rec["sent"], chars=n, file=rec["file"], asr=rec["qa"]["asr"],
                            margin=mg, scores=sc, f0=rec["qa"]["median_f0_hz"], dur=rec["duration_s"]))
        print(f"{name:14s} sent {rec['sent']!r} ({n} chars) margin {mg:+.2f} | asr {rec['qa']['asr']!r}")
    cast.d["respell_lines"] = base_rl
    p = os.path.join(out, f"probe-{a.id}.json")
    R.ellib.jdump(dict(line=a.id, texts=a.texts, results=results), p)
    print("wrote", os.path.relpath(p, R.REPO))


# watched words: (pattern, intended spellings, competitors). A take's margin is the best intended minus the best competitor.
WATCH = [
    (r"\bgergs?\b|\bgerg's\b", ["Gerg", "Gurg"], ["Kirk", "Greg", "Jerg"]),
    (r"\bmacrosoft('s)?\b", ["Macrosoft"], ["Microsoft"]),
    (r"\bmanalt\b", ["Manalt"], ["Menalt", "Minolt", "Monalt"]),
    (r"\bbadge\b", ["badge"], ["batch", "band"]),
    (r"\bbadges\b", ["badges"], ["batches", "bandages"]),
    (r"\bgtp-4\b", ["GTP-4"], ["GPT-4"]),
    (r"\bnoted\b", ["Noted"], ["Note it", "Nodded"]),
]


def variants(text, pat, forms):
    import re
    out = []
    for f in forms:
        def sub(m):
            w = m.group(0)
            poss = "'s" if w.lower().endswith("'s") else ""
            return f + poss
        out.append(re.sub(pat, sub, text, flags=re.I))
    return out


def cmd_lines(a):
    import re
    cast = R.Cast()
    rows = json.load(open(a.lines))
    kok = {}
    if a.timeline:
        for b in json.load(open(a.timeline))["beats"]:
            for l in b.get("lines") or []:
                kok[l["id"]] = l.get("audio")
    res = []
    for r in rows:
        base = R.normalise_text(r["text"])
        if cast.roles.get(r["speaker_slug"], {}).get("sentence_case"):
            base = R.sentence_case(base, cast.d.get("names", []))
        for pat, good, bad in WATCH:
            if not re.search(pat, base, flags=re.I):
                continue
            tg, tb = variants(base, pat, good), variants(base, pat, bad)
            row = dict(id=r["id"], who=r["speaker_slug"], word=good[0], text=base)
            for lab, path in (("el", os.path.join(R.REPO, r["file"])), ("kokoro", os.path.join(R.REPO, kok.get(r["id"]) or ""))):
                if not os.path.isfile(path):
                    continue
                y = load(path)
                sc = forced(y, tg + tb)
                g = max(s for _, s, _ in sc[: len(tg)])
                bb = max(sc[len(tg):], key=lambda x: x[1])
                row[lab] = dict(margin=round(g - bb[1], 2), best_competitor=bb[0])
            res.append(row)
            print(f"{r['id']:13s} {r['speaker_slug']:14s} {good[0]:10s} EL {row.get('el', {}).get('margin', float('nan')):+6.2f}"
                  f"   Kokoro {row.get('kokoro', {}).get('margin', float('nan')):+6.2f}   | {base[:70]}")
    if a.out:
        R.ellib.jdump(res, a.out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("score")
    s.add_argument("--wav", nargs="+", required=True)
    s.add_argument("--texts", nargs="+", required=True)
    p = sp.add_parser("probe")
    p.add_argument("--lines", required=True)
    p.add_argument("--id", required=True)
    p.add_argument("--variant", nargs="*", default=[])
    p.add_argument("--extra", nargs="*", default=[])
    p.add_argument("--texts", nargs="+", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--max-chars", type=int, default=400)
    p.add_argument("--target-lufs", type=float, default=-16.0)
    q = sp.add_parser("lines")
    q.add_argument("--lines", required=True, help="an EL lines JSON (el_render's lines-A.json)")
    q.add_argument("--timeline", default=None, help="the Kokoro timeline, to score the lock's take of the same line too")
    q.add_argument("--out", default=None)
    a = ap.parse_args()
    dict(score=cmd_score, probe=cmd_probe, lines=cmd_lines)[a.cmd](a)


if __name__ == "__main__":
    main()
