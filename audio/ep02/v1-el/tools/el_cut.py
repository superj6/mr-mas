#!/usr/bin/env python3
"""el_cut.py - Ep2 v1: the lines the plan cuts from an existing take (no API calls). A copy of Ep1's
(audio/ep01/v3-el/tools/el_cut.py, locked: read, never edited) with Ep2's table, which it reads from the plan's own spec
(show/episodes/ep02/production/v1/beat-plan/_spec.py CUT: new id -> (source take id, first word, last word, device,
the source take's file when it isn't an Ep2 take)), so the cuts can't drift from the plans:

  e2-a1-0026  GHOST-NOLE "…billions per year…"            from e2-a1-0014's Ep2 take ("billions" … "year"), ghost tag
  e2-a1-0047  MAS (recorded) "…chaotic and shameful and upsetting…"   from e2-a1-0035's Ep2 take, phone tag
  e2-a3-0008  ALYI "Six years and eleven months."           from EP1'S OWN TAKE e1-a1-5-13 (audio/ep01/v3-el/ep01-v35/
              act1/wav/e1-a1-5-13__alyi-A.wav, its row in that folder's lines-A.json): read and copied, never edited; far tag

The cut, as Ep1's: at the middle of the pause on each side (or at most 0.35 s from the word), 12 ms fades, room-tone
handles out to 0.35 s from the take's own head, then the house level (-16 LUFS). The takes stay DRY: the ghost, phone and
far treatments are the mix's chains on the line's tag (cast.md §4). Each cut row is added to its segment's lines-A.json,
marked 'special': 'cut' (el_render.py rewrites lines-A.json without these rows, so render_v1.sh runs this after every
render).

  audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_cut.py
"""
from __future__ import annotations

import json
import os
import re
import sys

sys.dont_write_bytecode = True
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402
import elaudio as E  # noqa: E402
import el_render as R  # noqa: E402

REPO = ellib.REPO
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
BP = os.path.join(REPO, "show/episodes/ep02/production/v1/beat-plan")
OUT = os.path.join(REPO, "audio/ep02/v1-el/ep02-v1")
EP1_ROWS = {"e1-a1-5-13": os.path.join(REPO, "audio/ep01/v3-el/ep01-v35/act1/lines-A.json")}   # read only
sys.path.insert(0, BP)
import _spec as S  # noqa: E402

HANDLE, FADE = 0.35, 0.012


def jload(p):
    with open(p) as f:
        return json.load(f)


def norm(w):
    return re.sub(r"[^a-z0-9']", "", w.lower())


def plan_lines():
    """line id -> (segment, beat plan line, its beat), and each segment's line order"""
    out, order = {}, {}
    for s in SEGS:
        order[s] = []
        for b in jload(os.path.join(BP, f"{s}.json"))["beats"]:
            for ln in b.get("lines") or []:
                out[ln["id"]] = (s, ln, b)
                order[s].append(ln["id"])
    return out, order


def source_row(src):
    """the source take's row: an Ep2 take from its segment's lines-A.json, or Ep1's row (read only)"""
    if src in EP1_ROWS:
        for r in jload(EP1_ROWS[src]):
            if r["id"] == src:
                return r, "ep1"
        raise SystemExit(f"{src}: not in {EP1_ROWS[src]}")
    for s in SEGS:
        p = os.path.join(OUT, s, "lines-A.json")
        if os.path.exists(p):
            for r in jload(p):
                if r["id"] == src:
                    return r, "ep2"
    raise SystemExit(f"{src}: no Ep2 take yet (run el_render.py on its segment first)")


def word_span(W, first, last):
    """indices of the first occurrence of `first` and the next `last` after it in a take's words"""
    ws = [norm(w["w"]) for w in W]
    i0 = ws.index(norm(first))
    i1 = ws.index(norm(last), i0)
    return i0, i1


def main():
    pl, order = plan_lines()
    added = {}
    for cid, (src, first, last, dev, f) in S.CUT.items():
        seg, line, beat = pl[cid]
        r, origin = source_row(src)
        W = r["words"]
        i0, i1 = word_span(W, first, last)
        want = [norm(w) for w in R.normalise_text(line["text"]).split()]
        got = [norm(w["w"]) for w in W[i0:i1 + 1]]
        if [w for w in want if w] != [w for w in got if w]:
            raise SystemExit(f"{cid}: the source words {got} are not the line {want}")
        prev_t1 = W[i0 - 1]["t1"] if i0 > 0 else None
        next_t0 = W[i1 + 1]["t0"] if i1 + 1 < len(W) else None
        a = W[i0]["t0"] - HANDLE if prev_t1 is None else max((prev_t1 + W[i0]["t0"]) / 2, W[i0]["t0"] - HANDLE)
        e = r["pace"]["audible_out_s"] + 0.1 if next_t0 is None else min((W[i1]["t1"] + next_t0) / 2, W[i1]["t1"] + HANDLE)
        role = r["speaker_slug"]
        cand = (r.get("el") or {}).get("cand") or "A"
        who = line["who"]
        crole = R.Cast().role_of(who) or role
        take = f"{cid}__{crole}-{cand}"
        x, sr = sf.read(os.path.join(REPO, r["file"]), always_2d=True, dtype="float64")
        aa, ee = max(0.0, a), min(len(x) / sr, e)
        seg_ = x[int(aa * sr):int(ee * sr)].copy()
        k = int(FADE * sr)
        seg_[:k] *= np.linspace(0, 1, k)[:, None]
        seg_[-k:] *= np.linspace(1, 0, k)[:, None]
        tone = x[:int(0.25 * sr)].copy()
        pre = max(0.0, HANDLE - (W[i0]["t0"] - aa))
        post = max(0.0, HANDLE - (ee - W[i1]["t1"]))
        pad = lambda s_: np.concatenate([tone] * (int(s_ * sr) // len(tone) + 1))[:int(s_ * sr)]
        y = np.concatenate([pad(pre), seg_, pad(post)])[:, 0].astype(np.float32)
        y = E.normalise(y, -18.0 if r.get("kind") == "vo" else -16.0)
        outp = os.path.join(OUT, seg, "wav", take + ".wav")
        os.makedirs(os.path.dirname(outp), exist_ok=True)
        E.write24(outp, y)
        off = pre - aa
        m = E.measure(y, line["text"])
        asr_txt, _ = E.asr(y)
        words = [dict(w, t0=round(w["t0"] + off, 3), t1=round(w["t1"] + off, 3)) for w in W[i0:i1 + 1]]
        new = json.loads(json.dumps(r))
        for k_ in ("kokoro_ref", "mouth", "alt_takes"):
            new.pop(k_, None)
        new.update(id=cid, text=line["text"], scene=beat["id"], speaker_slug=crole,
                   speaker=(R.Cast().roles.get(crole) or {}).get("name") or new.get("speaker"),
                   tag=line.get("tag") or "", delivery=line.get("delivery"),
                   file=os.path.relpath(outp, REPO), file_device=None, device=None,
                   duration_s=round(len(y) / E.SR, 3), frames_24=int(round(len(y) / E.SR * 24)), voiced_span_s=m["span_s"],
                   words=words, spoken_as=" ".join(w["w"] for w in words), special="cut",
                   cut_from=f"{src} words {i0}-{i1} ({r['file']}, {a:.3f}-{e:.3f} s), 12 ms fades, room-tone handles to "
                            f"{HANDLE} s ({'Ep1' if origin == 'ep1' else 'Ep2'}'s take, read and copied; the {dev} "
                            f"treatment is the mix's chain on the tag)")
        new["pace"] = dict(new.get("pace") or {}, audible_in_s=m["audible_in_s"], audible_out_s=m["audible_out_s"],
                           words=m["words"], wpm=m["wpm"],
                           measured={k_: m[k_] for k_ in ("span_s", "wpm", "syllables", "articulation_sps", "pauses_s")},
                           longest_internal_gap_s=m["longest_internal_gap_s"])
        names = set(R.Cast().d.get("names", []))
        new["qa"] = dict(new.get("qa") or {}, asr=asr_txt, cer=E.cer(line["text"], asr_txt),
                         word_recall_nonames=E.word_recall(line["text"], asr_txt, names),
                         lufs_i=round(E.lufs(y), 2), target_lufs=-16.0, true_peak_dbtp=round(E.true_peak_db(y), 2),
                         clipped_samples=int((abs(y) >= 0.999).sum()), median_f0_hz=m["median_f0_hz"],
                         f0_range_st=m["f0_range_st"], speech_head_s=m["speech_head_s"], speech_tail_s=m["speech_tail_s"],
                         raw_tail_cut=False)
        new["el"] = dict(new.get("el") or {}, cut_from=src, chars_sent=0, reused_from=None,
                         source_episode="ep01" if origin == "ep1" else "ep02")
        new["status"] = "el"
        added.setdefault(seg, []).append(new)
        print(f"{cid:12s} {seg:8s} from {src:12s} ({origin}) {new['duration_s']:5.2f} s  lufs {new['qa']['lufs_i']:6.2f}  "
              f"asr {asr_txt!r}")
    for seg, rows in added.items():
        p = os.path.join(OUT, seg, "lines-A.json")
        L = [x for x in jload(p) if x["id"] not in {r["id"] for r in rows}]
        L += rows
        L.sort(key=lambda x: order[seg].index(x["id"]) if x["id"] in order[seg] else 10 ** 6)
        ellib.jdump(L, p)
        print(f"  {os.path.relpath(p, REPO)}: {len(L)} rows")


if __name__ == "__main__":
    main()
