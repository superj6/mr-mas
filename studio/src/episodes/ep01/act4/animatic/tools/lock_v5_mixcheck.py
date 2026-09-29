"""lock_v5_mixcheck.py - MEASURE where every v5 take actually sits in the stick mix, against lock v5's frames (INF-LOCK5).

lock_v5.py derives each line's frames from the approved stick timeline by arithmetic (the same arithmetic bed.py used to
lay the takes into audio/reel/ep01-act4-v5/mix.wav). This tool checks the result against the AUDIO, not the arithmetic:
for every line it cross-correlates the take file (the exact wav the stick timeline names) with the mix around the place
the lock says it starts, finds the lag where the take really is, and reports the offset in milliseconds and in frames.
If the lock and the mix agree, every offset is ~0 ms and every line's first-sound frame in the mix equals the lock's
abs_in. Read-only: it writes one JSON report (default: stdout summary only).

Run (the casting venv has numpy + scipy + soundfile):
  audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/lock_v5_mixcheck.py [--json <out.json>]
Cost: reads ~1 s windows of mix.wav per line (never the whole 150 MB file), about 10-20 s on one core.
"""
from __future__ import annotations
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()

import json
import math
import os
import sys

import numpy as np
import soundfile as sf

LOCK = os.path.join(REPO, "show/episodes/ep01/production/act4/shots-locked-v5.json")
REEL = os.path.join(REPO, "show/reel/ep01-act4-v5.json")
FPS = 24
PAD_S = 0.40  # search window each side of the expected placement


def main() -> int:
    out_json = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None
    lock = json.load(open(LOCK))
    mix_rel = lock["summary"]["mix"]["path"]
    off_f = lock["summary"]["mix"]["offset_frames"]
    mix_path = os.path.join(REPO, mix_rel)
    audio_of = {l["id"]: l["audio"] for b in json.load(open(REEL))["beats"] for l in b["lines"]}
    info = sf.info(mix_path)
    SR = info.samplerate
    rows = []
    for L in lock["lines"]:
        take = os.path.join(REPO, audio_of.get(L["id"], L["file"]))
        x, sr = sf.read(take, dtype="float32", always_2d=True)
        assert sr == SR, (take, sr)
        x = x.mean(1)
        exp_s = L["file_s"] + off_f / FPS  # where the lock says the take FILE starts, on the mix's clock
        a = max(0, int(round((exp_s - PAD_S) * SR)))
        n = len(x) + int(2 * PAD_S * SR)
        win, _ = sf.read(mix_path, start=a, frames=n, dtype="float32", always_2d=True)
        win = win.mean(1)
        # cross-correlation by FFT; the lag of the best match, restricted to +-PAD_S
        m = 1 << int(math.ceil(math.log2(len(win) + len(x))))
        c = np.fft.irfft(np.fft.rfft(win, m) * np.conj(np.fft.rfft(x, m)), m)
        valid = max(1, len(win) - len(x) + 1)  # full overlaps only
        best = int(np.argmax(c[:valid]))
        got_s = (a + best) / SR
        err_ms = (got_s - exp_s) * 1000.0
        # match quality: normalised correlation at the peak (1.0 = the take alone, lower = music and room under it)
        seg = win[best: best + len(x)]
        q = float(np.dot(seg[: len(x)], x[: len(seg)]) / (np.linalg.norm(seg) * np.linalg.norm(x[: len(seg)]) + 1e-9))
        onset_s = got_s - off_f / FPS + (L["on_s"] - L["file_s"])  # the speech onset on the act clock, as measured
        onset_f = int(math.floor(onset_s * FPS + 1e-6))
        rows.append(dict(id=L["id"], shot=L["shot"], who=L["who"], err_ms=round(err_ms, 2), q=round(q, 3), lock_in=L["abs_in"], mix_in=onset_f,
                         same_frame=onset_f == L["abs_in"]))
    errs = np.array([r["err_ms"] for r in rows])
    good = [r for r in rows if r["q"] >= 0.3]
    summ = dict(lines=len(rows), max_abs_err_ms=round(float(np.max(np.abs(errs))), 2), median_abs_err_ms=round(float(np.median(np.abs(errs))), 3),
                within_1ms=int(np.sum(np.abs(errs) <= 1.0)), same_frame=sum(r["same_frame"] for r in rows),
                low_confidence=[f"{r['id']} q {r['q']} err {r['err_ms']} ms" for r in rows if r["q"] < 0.3],
                differ=[f"{r['id']} lock f{r['lock_in']} mix f{r['mix_in']} ({r['err_ms']} ms)" for r in rows if not r["same_frame"]],
                confident_lines=len(good), confident_max_abs_err_ms=round(max((abs(r["err_ms"]) for r in good), default=0.0), 2))
    print(json.dumps(summ, indent=1))
    if out_json:
        json.dump(dict(summary=summ, lines=rows, mix=mix_rel, lock=os.path.relpath(LOCK, REPO)), open(out_json, "w"), indent=1)
    return 0 if summ["same_frame"] == len(rows) else 1


if __name__ == "__main__":
    sys.exit(main())
