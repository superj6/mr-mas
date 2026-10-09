#!/usr/bin/env python3
"""pron_check.py - Ep2 v1: does a take say the parody name the way the registry does? A copy of Ep1's forced-choice ASR
check (audio/ep01/v3-el/tools/pron_check.py, locked: read, never edited), with Ep2's watched names (cast.md §5) and
Ep2's cast (audio/ep02/cast-el.json).

A plain ASR read is a weak test for a parody name: the recogniser writes "OpenAI" for "NopeAI" or "ChatGPT" for
"CHATGTP" whatever it hears, because those are the words it knows. This scores the take against competing transcripts
instead: for each candidate text it asks faster-whisper (small.en, the house recogniser) for log P(text | audio) through
CTranslate2's forced alignment, and reports the margin of the best intended text over the best competitor. The
recogniser's own prior still favours the common word (the real product, the real name), so a margin near zero is read
as "look", and only a clear negative margin as a misread (takes-qa.md, the rule).

  score  --wav W [W ...] --texts "Intended text." "Competitor text." ...     (the first text is the intended one)
  lines  --lines LINES-A.json [--out names.json]                            every watched name in a lines file
  (Ep1's 'probe' (render one line per respelling) is not copied: el_qa.py retakes with the cast's respellings.)

Every Ep1 module is imported with no bytecode written; nothing under Ep1's paths is written.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys

sys.dont_write_bytecode = True
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


def encode(y48):
    """one encoder pass over a take (48 kHz array) -> (encoder output, frames)"""
    import numpy as np
    from faster_whisper.audio import pad_or_trim
    from scipy.signal import resample_poly
    m, _ = _model()
    y16 = resample_poly(np.asarray(y48, dtype=np.float64), 1, 3).astype(np.float32)
    feats = m.feature_extractor(y16)
    nf = min(feats.shape[-1], m.feature_extractor.nb_max_frames)
    return m.encode(pad_or_trim(feats[:, :nf])), nf


def forced(y48, texts, enc=None):
    """-> [(text, sum log p, n tokens)] for each candidate transcript of one take (48 kHz array). Pass enc (from
    encode()) to score many texts against one encoder pass."""
    m, tok = _model()
    enc, nf = enc or encode(y48)
    toks = [tok.encode(" " + t.strip()) for t in texts]
    res = [m.model.align(enc, tok.sot_sequence, [tt], [nf])[0] for tt in toks]
    out = []
    for t, tt, r in zip(texts, toks, res):
        p = list(r.text_token_probs)[: len(tt)]
        out.append((t, round(sum(math.log(max(x, 1e-12)) for x in p), 3), len(tt)))
    return out


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


# watched words: (pattern, intended spellings, competitors). A take's margin is the best intended minus the best
# competitor. Each competitor is the real word the parody turns (the real person or product: never to be heard), or a
# near word the respelling could slide into (cast.md §5's "check against").
WATCH = [
    (r"\bmas('s)?\b", ["Mas", "Moss"], ["Max", "Mass", "Sam"]),
    (r"\balyi\b", ["Alyi", "Al-yee"], ["Ilya", "Ali", "Eli"]),
    (r"\bnole('s)?\b", ["Nole", "Knoll"], ["Elon", "Noel", "Nolan"]),
    (r"\bnopeai\b", ["NopeAI", "Nope AI"], ["OpenAI", "Open AI"]),
    (r"\bchatgtp\b", ["ChatGTP", "Chat GTP"], ["ChatGPT", "Chat GPT"]),
    (r"\brettiwt\b", ["Rettiwt", "Rett-twit", "Ret twit", "Rhett twit"], ["Twitter", "Reddit"]),
    (r"\bminddeep\b", ["MindDeep", "Mind Deep"], ["DeepMind", "Deep Mind"]),
    (r"\baros\b", ["AROS", "Aros"], ["Sora", "arrows", "Eros"]),
    (r"\bmanalt\b", ["Manalt"], ["Altman", "Menalt", "Monalt"]),
    (r"\bekiel\b", ["Ekiel"], ["Ezekiel", "Michael", "Jan"]),
    (r"\bagi\b", ["AGI", "A.G.I."], ["AGE", "a GI"]),
]


def variants(text, pat, forms):
    out = []
    for f in forms:
        def sub(m):
            w = m.group(0)
            poss = "'s" if w.lower().endswith("'s") else ""
            return f + poss
        out.append(re.sub(pat, sub, text, flags=re.I))
    return out


def name_margins(y48, text, sentence_case=False, names=(), enc=None):
    """every watched name in a line's text -> [{word, margin, best_competitor, scores}] for one take"""
    base = R.normalise_text(text)
    if sentence_case:
        base = R.sentence_case(base, names)
    res = []
    for pat, good, bad in WATCH:
        if not re.search(pat, base, flags=re.I):
            continue
        tg, tb = variants(base, pat, good), variants(base, pat, bad)
        enc = enc or encode(y48)
        sc = forced(y48, tg + tb, enc=enc)
        g = max(sc[: len(tg)], key=lambda x: x[1])
        bb = max(sc[len(tg):], key=lambda x: x[1])
        real = sc[len(tg)]                                 # the first competitor is the real word the parody turns
        res.append(dict(word=good[0], margin=round(g[1] - bb[1], 2), best_intended=g[0], best_competitor=bb[0],
                        real=bad[0], margin_vs_real=round(g[1] - real[1], 2)))
    return res


def cmd_score(a):
    for w in a.wav:
        y = load(w)
        sc = forced(y, a.texts)
        best_other = max(s for _, s, _ in sc[1:])
        txt, _ = E.asr(y)
        print(f"{os.path.relpath(w, R.REPO)}\n  margin {sc[0][1] - best_other:+.2f} | asr: {txt}")
        for t, s, n in sc:
            print(f"    {s:8.2f}  {t}")


def cmd_lines(a):
    cast = R.Cast()
    rows = json.load(open(a.lines))
    out = []
    for r in rows:
        p = os.path.join(R.REPO, r.get("file") or "")
        if not os.path.isfile(p):
            continue
        sc = cast.roles.get(r.get("speaker_slug"), {}).get("sentence_case")
        ms = name_margins(load(p), r["text"], sc, cast.d.get("names", []))
        for m in ms:
            out.append(dict(id=r["id"], who=r.get("speaker_slug"), **m))
            print(f"{r['id']:13s} {r.get('speaker_slug', ''):14s} {m['word']:9s} margin {m['margin']:+6.2f}  "
                  f"(best competitor {m['best_competitor'][:60]!r})")
    if a.out:
        R.ellib.jdump(out, a.out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("score")
    s.add_argument("--wav", nargs="+", required=True)
    s.add_argument("--texts", nargs="+", required=True)
    q = sp.add_parser("lines")
    q.add_argument("--lines", required=True, help="an EL lines JSON (el_render's lines-A.json)")
    q.add_argument("--out", default=None)
    a = ap.parse_args()
    dict(score=cmd_score, lines=cmd_lines)[a.cmd](a)


if __name__ == "__main__":
    main()
