#!/usr/bin/env python3
"""el_cut.py - the v3.1 lines the lock cuts from an existing take, cut from the ElevenLabs take of the same source line
(track A4, v3-voices-el, v3.1; no API calls).

The v3.1 lock (audio/ep01/v31/takes.py CUT, copied below) makes eight lines by cutting an existing take at sentence
boundaries, so that the same performance is heard (Alyi's sentence told twice, Sydney's reset "Hi!", the landlord's
"Everyone is welcome." on the monitor, Nedib's two halves). The EL variant does the same with the EL takes, the same
way: at the middle of the pause (or at most 0.35 s from the word), 12 ms fades, room-tone handles out to 0.35 s from the
take's own head, then the house level per take (-16 LUFS; V.O. -18). A take with a device copy (the call chain) is cut at the same times.

  audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_cut.py [--lock v31|v32]
      v32: the v3.1 cuts still in the v3.2 lock, plus the v3.2 lock's own three (CUT_V32)
      reads  show/reel/ep01-v31/ep01-v31-<seg>.json (which segment each cut line is in, its text, its Kokoro take)
             the source EL takes: audio/ep01/v3-el/ep01-v31/<seg>/lines-A.json, else audio/ep01/v3-el/ep01/<seg>/lines-A.json
      writes audio/ep01/v3-el/ep01-v31/<seg>/wav/<id>__<role>-<cand>.wav, and adds the rows to that segment's lines-A.json
Run it after every el_render.py run on the v3.1 segments (the render rewrites lines-A.json without these rows).
"""
from __future__ import annotations

import json
import os
import re
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402
import elaudio as E  # noqa: E402
import el_render as R  # noqa: E402

REPO = ellib.REPO
SEGS = ["coldopen", "act1", "act2", "act3", "act4", "tag"]
LOCK = sys.argv[sys.argv.index("--lock") + 1] if "--lock" in sys.argv else "v31"      # v31 or v32
OUT = os.path.join(REPO, f"audio/ep01/v3-el/ep01-{LOCK}")
OLDS = [os.path.join(REPO, "audio/ep01/v3-el/ep01"), os.path.join(REPO, "audio/ep01/v3-el/ep01-v31"),
        os.path.join(REPO, "audio/ep01/v3-el/ep01-v32"), os.path.join(REPO, "audio/ep01/v3-el/ep01-v33")]   # the newest wins
# the lock's table (audio/ep01/v31/takes.py CUT): id -> (source line, first word index, last word index)
CUT = {
    "v31-a1-0007": ("e1-a1-10-06", 0, 0),     # Hi!
    "v31-a2-0001": ("e1-a2-13-15", 0, 9),     # Whatever you promise in here today, put it in writing.
    "v31-a2-0002": ("e1-a2-13-15", 10, 10),   # Longer.
    "v31-a3-0001": ("e1-a1-9-08", 0, 2),      # Everyone is welcome.
    "v31-a3-0002": ("e1-a3-20-05", 0, 2),     # Okay. That's patched.
    "v31-a4-0001": ("a5-27-01", 0, 12),       # Mas. The board has decided that you will no longer lead the company.
    "v31-a4-0005": ("a5-27-35", 7, 18),       # We've talked all day about him coming back, and we're no closer.
    "v31-a4-0007": ("a5-29-05", 0, 8),        # Best time there is. Nobody else is pushing anything.
}
# the v3.2 lock's own (audio/ep01/v32/takes.py CUT); v3.2 keeps all eight v3.1 cuts too
CUT_V32 = {
    "v32-a1-0001": ("e1-a1-5-01", 0, 3),      # Okay, the build's green.
    "v32-a1-0006": ("v31-a1-0006", 0, 2),     # House rules, Sydney.
    "v32-a2-0002": ("e1-a2-15-10", 12, 17),   # Would you come and run it?
}
# the v3.3 lock's own (audio/ep01/v33/takes.py): Tasya's last sentence, now a clip on the bullpen TV (the tv chain)
CUT_V33 = {
    "v33-a4-0002": ("v3-a4-0003", 10, 17),    # We are below them, above them, around them.
}
HANDLE, FADE = 0.35, 0.012


def jload(p):
    with open(p) as f:
        return json.load(f)


def norm(w):
    return re.sub(r"[^a-z0-9']", "", w.lower())


def main():
    where, tl = {}, {}
    for s in SEGS:
        for b in jload(os.path.join(REPO, f"show/reel/ep01-{LOCK}/ep01-{LOCK}-{s}.json"))["beats"]:
            for l in b["lines"]:
                tl[l["id"]] = (s, l)
    table = {k: v for k, v in CUT.items() if k in tl}
    if LOCK in ("v32", "v33"):
        table.update({k: v for k, v in CUT_V32.items() if k in tl})
    if LOCK == "v33":
        table.update(CUT_V33)
    src_rows = {}
    for base in OLDS[: OLDS.index(OUT) + 1]:                  # the newest render (up to this lock's) wins
        for s in SEGS:
            p = os.path.join(base, s, "lines-A.json")
            if os.path.exists(p):
                for r in jload(p):
                    src_rows[r["id"]] = r
    added = {}
    for cid, (src, i0, i1) in table.items():
        seg, line = tl[cid]
        r = src_rows[src]
        W = r["words"]
        want = [norm(w) for w in R.normalise_text(line["text"]).split()]
        got = [norm(w["w"]) for w in W[i0:i1 + 1]]
        if [w for w in want if w] != [w for w in got if w]:
            raise SystemExit(f"{cid}: the source words {got} are not the line {want}")
        prev_t1 = W[i0 - 1]["t1"] if i0 > 0 else None
        next_t0 = W[i1 + 1]["t0"] if i1 + 1 < len(W) else None
        a = W[i0]["t0"] - HANDLE if prev_t1 is None else max((prev_t1 + W[i0]["t0"]) / 2, W[i0]["t0"] - HANDLE)
        e = r["pace"]["audible_out_s"] + 0.1 if next_t0 is None else min((W[i1]["t1"] + next_t0) / 2, W[i1]["t1"] + HANDLE)
        take = f"{cid}__{r['speaker_slug']}-{r['el']['cand']}"
        files = {}
        for kind, path in (("dry", r["file"]), ("device", r.get("file_device"))):
            if not path:
                continue
            x, sr = sf.read(os.path.join(REPO, path), always_2d=True, dtype="float64")
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
            y = E.normalise(y, -18.0 if r["kind"] == "vo" else -16.0)     # the house level per take, as every other EL take
            sub = "wav" if kind == "dry" else "wav-device"
            outp = os.path.join(OUT, seg, sub, take + ("" if kind == "dry" else ".call") + ".wav")
            os.makedirs(os.path.dirname(outp), exist_ok=True)
            E.write24(outp, y)
            files[kind] = (outp, y, pre - aa)
        kref0 = R.kokoro_ref(dict(ref_audio=line.get("audio")))
        tdev = kref0.get("device")
        if tdev in ("tv", "pa") and "device" not in files:
            # the lock puts this cut on a device its source never had: the dry cut through that chain, -16 LUFS
            # (as the house re-stages: the chain on the clean take, then levelled)
            y0 = files["dry"][1]
            yd = E.normalise(E.device_chain(y0, tdev), -16.0)
            outd = os.path.join(OUT, seg, "wav-device", take + (".tv.wav" if tdev == "tv" else ".stage.wav"))
            os.makedirs(os.path.dirname(outd), exist_ok=True)
            E.write24(outd, yd)
            files["device"] = (outd, yd, files["dry"][2])
        outp, y, off = files["dry"]
        m = E.measure(y, line["text"])
        asr_txt, _ = E.asr(y)
        words = [dict(w, t0=round(w["t0"] + off, 3), t1=round(w["t1"] + off, 3)) for w in W[i0:i1 + 1]]
        kref = R.kokoro_ref(dict(ref_audio=line.get("audio")))
        new = json.loads(json.dumps(r))
        new.update(id=cid, text=line["text"], scene=line.get("id") and r.get("scene"), file=os.path.relpath(outp, REPO),
                   file_device=os.path.relpath(files["device"][0], REPO) if "device" in files else None,
                   duration_s=round(len(y) / E.SR, 3), frames_24=int(round(len(y) / E.SR * 24)), voiced_span_s=m["span_s"],
                   words=words, spoken_as=" ".join(w["w"] for w in words),
                   cut_from=f"{src} words {i0}-{i1} ({r['file']}, {a:.3f}-{e:.3f} s), 12 ms fades, room-tone handles to {HANDLE} s "
                            f"(the {LOCK} lock's CUT, applied to the EL take)")
        new["pace"] = dict(new["pace"], audible_in_s=m["audible_in_s"], audible_out_s=m["audible_out_s"], words=m["words"],
                           wpm=m["wpm"], measured={k: m[k] for k in ("span_s", "wpm", "syllables", "articulation_sps", "pauses_s")},
                           longest_internal_gap_s=m["longest_internal_gap_s"])
        new["qa"] = dict(new["qa"], asr=asr_txt, cer=E.cer(line["text"], asr_txt),
                         word_recall_nonames=E.word_recall(line["text"], asr_txt, set(R.Cast().d.get("names", []))),
                         lufs_i=round(E.lufs(y), 2), true_peak_dbtp=round(E.true_peak_db(y), 2),
                         clipped_samples=int((abs(y) >= 0.999).sum()), median_f0_hz=m["median_f0_hz"], f0_range_st=m["f0_range_st"],
                         speech_head_s=m["speech_head_s"], speech_tail_s=m["speech_tail_s"], raw_tail_cut=False)
        new["el"] = dict(new["el"], cut_from=src, chars_sent=0, reused_from=None)
        if "device" in files:
            new["device"] = tdev if tdev in ("tv", "pa") else (new.get("device") or "call")
        new["kokoro_ref"] = dict(kref, timeline_in=line.get("in"), timeline_dur=line.get("dur"))
        added.setdefault(seg, []).append(new)
        print(f"{cid:12s} {seg:8s} from {src:12s} {new['duration_s']:5.2f} s  lufs {new['qa']['lufs_i']:6.2f}  "
              f"device {'yes' if new['file_device'] else 'no '}  asr {asr_txt!r}")
    for seg, rows in added.items():
        p = os.path.join(OUT, seg, "lines-A.json")
        L = [x for x in jload(p) if x["id"] not in {r["id"] for r in rows}]
        order = [l["id"] for b in jload(os.path.join(REPO, f"show/reel/ep01-{LOCK}/ep01-{LOCK}-{seg}.json"))["beats"] for l in b["lines"]]
        L += rows
        L.sort(key=lambda x: order.index(x["id"]) if x["id"] in order else 10 ** 6)
        ellib.jdump(L, p)
        print(f"  {os.path.relpath(p, REPO)}: {len(L)} rows")


if __name__ == "__main__":
    main()
