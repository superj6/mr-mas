#!/usr/bin/env python3
"""el_bed.py - the stick beds for the ElevenLabs-timed lock (track A4, pass v3-voices-el, phase 2).

  audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_bed.py [--lock v3|v31] [--tag T] [seg ...]   (T: el_lock.py's variant tag)
      --lock v31: the v3.1 lock's bed builder (audio/reel/ep01-v31/bed.py) on show/reel/ep01-v31-el/ -> audio/reel/ep01-v31-el/
      reads  show/reel/ep01-v3-el/ep01-v3-el-<seg>.json (el_lock.py), and the lock pass's bed builder and cold-open bed
      writes audio/reel/ep01-v3-el/<seg>-bed.wav (+ -bed-qa.json) and audio/reel/ep01-v3-el/beds.json (for el_lock.py --beds)

The lock pass's beds are timed to the Kokoro takes, so they are rebuilt here to the EL beat times, with the lock pass's
own recipe and nothing new:
  * Acts One to Four and the tag: audio/reel/ep01-v3/bed.py's build() (imported, never edited), with its timeline
    reader pointed at the EL timelines: the rooms leading each cut, the beats' sounds at their new times, and the temp pad
    per mood run, all laid to the new beat starts;
  * the card: the lock's own card bed, unchanged (its 2 s and the first room of Act One are the same);
  * the cold open: its sound is the v2 stem (hall, SFX and the MM-14 / MM-06 music in one file), which only lines up
    with the lock's timing; bed.py has no room or pad recipe for it. So the lock's own cold-open bed is SPLICED per beat:
    each beat's stretch of the stem, taken from the lock's beat start, is laid at the EL beat start for the EL beat's
    length, joined with 60 ms equal-power crossfades (a longer beat runs on into the stem's next moments; a shorter
    one drops its last ones). Beats of unchanged length and position are the stem sample for sample.
"""
from __future__ import annotations

import importlib.util
import json
import os
import shutil
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../../.."))
LOCK = sys.argv[sys.argv.index("--lock") + 1] if "--lock" in sys.argv else "v3"      # v3, v31 ... v34
LOCK_BEDS = os.path.join(REPO, f"audio/reel/ep01-{LOCK}")
OUT = os.path.join(REPO, f"audio/reel/ep01-{LOCK}-el")
SR = 48000
XF = 0.06

spec = importlib.util.spec_from_file_location(f"{LOCK}bed", os.path.join(LOCK_BEDS, "bed.py"))
B = importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)
TAG = ""
B.seg_timeline = lambda seg: json.load(open(os.path.join(REPO, f"show/reel/ep01-{LOCK}-el{TAG}/ep01-{LOCK}-el{TAG}-{seg}.json")))


def kokoro_timeline(seg):
    return json.load(open(os.path.join(REPO, f"show/reel/ep01-{LOCK}/ep01-{LOCK}-{seg}.json")))


def write(seg, bus, qa, total):
    pk = float(np.abs(bus).max())
    if pk > B.db(-1.0):
        bus = bus * (B.db(-1.0) / pk)
        qa["peak_trim_db"] = round(20 * np.log10(B.db(-1.0) / pk), 2)
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, f"{seg}-bed.wav")
    sf.write(out, bus, SR, subtype="PCM_16")
    qa["seconds"] = round(len(bus) / SR, 3)
    qa["chapter_seconds"] = round(total, 3)
    qa["lufs"] = round(B.A1.lufs(bus.astype("float64")), 2) if len(bus) > SR else None
    qa["peak_dbfs"] = round(20 * np.log10(float(np.abs(bus).max()) + 1e-12), 2)
    qa["built_by"] = "audio/ep01/v3-el/tools/el_bed.py"
    json.dump(qa, open(os.path.join(OUT, f"{seg}-bed-qa.json"), "w"), indent=1)
    print(f"{os.path.relpath(out, REPO)}: {qa['seconds']} s, {qa['lufs']} LUFS, peak {qa['peak_dbfs']} dBFS, "
          f"{len(qa.get('sfx', []))} sfx, missing {qa.get('sfx_missing')}")
    return os.path.relpath(out, REPO)


def bed_source_timeline():
    """the Kokoro cold-open timeline the lock's cold-open bed was built from (its qa's chapter_seconds): the current one,
    or the newest committed version of that length (the lock's bed can predate a cut)"""
    import subprocess
    want = json.load(open(os.path.join(LOCK_BEDS, "coldopen-bed-qa.json")))["chapter_seconds"]
    cur = kokoro_timeline("coldopen")
    if abs(B.clock(cur["beats"])[1] - want) < 0.01:
        return cur, "the current Kokoro cold open"
    path = f"show/reel/ep01-{LOCK}/ep01-{LOCK}-coldopen.json"
    for h in subprocess.run(["git", "log", "--format=%H", "--", path], cwd=REPO, capture_output=True, text=True).stdout.split():
        t = json.loads(subprocess.run(["git", "show", f"{h}:{path}"], cwd=REPO, capture_output=True, text=True).stdout)
        if abs(B.clock(t["beats"])[1] - want) < 0.01:
            return t, f"the Kokoro cold open at {h[:7]} (the lock's bed predates the current cut)"
    raise SystemExit("no Kokoro cold-open timeline matches the lock's cold-open bed")


def coldopen():
    src_tl, src_what = bed_source_timeline()
    K = src_tl["beats"]
    E = B.seg_timeline("coldopen")["beats"]
    ks, ktot = B.clock(K)
    es, etot = B.clock(E)
    kpos = {b["id"]: (i, ks[i]) for i, b in enumerate(K)}
    src, sr = sf.read(os.path.join(LOCK_BEDS, "coldopen-bed.wav"), always_2d=True, dtype="float32")
    assert sr == SR
    qa = {"segment": "coldopen", "layers": [], "decisions": [f"source clock: {src_what}"]}
    same = len(K) == len(E) and all(a["id"] == b["id"] for a, b in zip(K, E)) and \
        all(abs(a[0] - b[0]) < 1e-9 and abs(a[1] - b[1]) < 1e-9 for a, b in zip(ks, es))
    if same:
        shutil.copyfile(os.path.join(LOCK_BEDS, "coldopen-bed.wav"), os.path.join(OUT, "coldopen-bed.wav"))
        qa["decisions"].append("every cold-open beat keeps its length and place: the lock's own bed, unchanged")
        return write("coldopen", src, qa, etot)
    N = int((etot + 0.1) * SR)
    out = np.zeros((N, 2), "float32")
    xf = int(XF * SR)
    eids = [b["id"] for b in E]
    for j, (b, (ea, eb)) in enumerate(zip(E, es)):
        L = eb - ea
        if b["id"] not in kpos:
            qa["decisions"].append(f"{b['id']}: not in the bed's timeline: room tone only")
            continue
        i, (ka, kb) = kpos[b["id"]]
        nxt_src = K[i + 1]["id"] if i + 1 < len(K) else None
        nxt_el = eids[j + 1] if j + 1 < len(E) else None
        run_on = nxt_src is not None and nxt_src == nxt_el        # the stem's next moments still follow in the cut
        take = L if (L <= kb - ka or run_on) else (kb - ka)
        a0 = int(round(ka * SR)) - (xf // 2 if j else 0)
        n = int(round(take * SR)) + (xf // 2 if j else 0) + (xf // 2 if j + 1 < len(E) else int(0.1 * SR))
        piece = src[max(0, a0): max(0, a0) + n].copy()
        if len(piece) < n:
            piece = np.concatenate([piece, np.zeros((n - len(piece), 2), "float32")])
        if j:
            piece[:xf] *= np.sqrt(np.linspace(0, 1, xf))[:, None]
        if take < L:                                                # the next source moments were cut: fade, then hold
            fo = int(0.4 * SR)
            piece[-fo:] *= np.linspace(1, 0, fo)[:, None]
        elif j + 1 < len(E):
            piece[-xf:] *= np.sqrt(np.linspace(1, 0, xf))[:, None]
        at = int(round(ea * SR)) - (xf // 2 if j else 0)
        m = min(len(piece), N - at)
        out[at: at + m] += piece[:m]
        if take < L:                                                # the hold: room tone at -50 LUFS (bed.py's silence)
            h0 = ea + take - 0.4
            hn = int((L - take + 0.4 + (0.1 if j + 1 == len(E) else 0)) * SR)
            tone = B.loop("room_tone", hn, -50)
            tone = B.fade(tone, 0.4, 0.05)
            B.add(out, tone, h0)
        if abs(ea - ka) > 1e-6 or abs(L - (kb - ka)) > 1e-6:
            qa["decisions"].append(f"{b['id']}: the stem from {ka:.3f} s laid at {ea:.3f} s for {take:.3f} s "
                                   f"(the bed's beat {kb - ka:.3f} s, now {L:.3f} s)"
                                   + (f"; the next source beat ({nxt_src}) was cut, so it fades over 0.4 s and holds "
                                      f"{L - take:.3f} s of room tone (-50 LUFS)" if take < L else ""))
    qa["layers"].append({"music+rooms+sfx": f"audio/reel/ep01-{LOCK}/coldopen-bed.wav (the lock's cold-open bed), spliced per beat",
                         "crossfade_s": XF})
    qa["sfx"] = [["(in the v2 stem)"]]
    return write("coldopen", out, qa, etot)


def main(argv):
    global TAG, OUT
    if "--tag" in argv:
        i = argv.index("--tag")
        TAG = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
        OUT = os.path.join(REPO, f"audio/reel/ep01-{LOCK}-el{TAG}")
    if "--lock" in argv:
        i = argv.index("--lock")
        argv = argv[:i] + argv[i + 2:]
    segs = [a for a in argv if a in B.ORDER] or B.ORDER
    beds = {}
    p = os.path.join(OUT, "beds.json")
    if os.path.exists(p):
        beds = json.load(open(p))
    os.makedirs(OUT, exist_ok=True)
    for seg in segs:
        if seg == "card":
            src = f"audio/reel/ep01-{LOCK}/card-bed.wav"
            beds["card"] = {"src": src, "label": "the lock's card bed, unchanged (room tone + the bullpen leading the cut)"}
            print(f"card: the lock's own {src}")
            continue
        if seg == "coldopen":
            rel = coldopen()
            beds["coldopen"] = {"src": rel, "label": f"the {LOCK} lock's cold-open bed, spliced per beat to the EL beat times"}
            continue
        bus, qa, total = B.build(seg)
        rel = write(seg, bus, qa, total)
        beds[seg] = {"src": rel, "label": f"{seg} stick bed rebuilt on the EL timeline by the lock's bed.py (rooms leading the "
                                          "cuts, the beats' sounds, a quiet temp pad per mood run)"}
        for d in qa["decisions"]:
            print("   ", d)
    json.dump(beds, open(p, "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1:])
