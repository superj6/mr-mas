"""qa_board.py - measure the SFX board entries added for Ep1 Act Four v5 (audio/sfx/scripts/sounds_4.py).

Nobody listens, so this measures what it can on the written masters:
  * loudness and true peak (from the manifest the build wrote)
  * TONAL PEAKS: prominent spectral peaks (>= 12 dB over the local median) named by pitch; any whose pitch class is
    A natural is flagged (OST-BIBLE rule 12: no A natural over F before Ep12). Noise beds have no prominent peaks.
  * LOOP SEAMS (loop=True): the sample jump across the seam against the file's own median step, and the level of the
    last and first 50 ms (a seam click or a level step shows up here).
  * a spectrogram sheet per 24 sounds, the board's own tile renderer: audio/sfx/qa/spectro_act4v5_NN.png (+ .txt index)
Writes audio/sfx/qa/act4v5_board_qa.json.

Run (light, a few seconds):
  cd <repo> && nice -n 15 audio/.venv/bin/python audio/ep01/act4/sfx-v5/qa_board.py
"""
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

SCRIPTS = os.path.join(REPO, "audio/sfx/scripts")
sys.path.insert(0, SCRIPTS)
import registry  # noqa: E402
import sounds_1, sounds_2, sounds_3  # noqa: E402,F401
_n = len(registry.REG)
import sounds_4  # noqa: E402,F401
NEW = [e["id"] for e in registry.REG[_n:]]
import build  # noqa: E402  (its spectro_tile / png_write; importing it registers the voice lines too)
MAN = {e["id"]: e for e in json.load(open(os.path.join(REPO, "audio/sfx/manifest.json")))}
NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]


def tonal_peaks(x, sr=48000, top=6):
    """Held tones only: a Welch spectrum (2.9 Hz bins) averages noise away; a peak must stand 12 dB over the median
    of its +-40 bins and be narrow (under 4 bins at -6 dB). Named by pitch; 'overtone_of_F' marks a peak that is a
    harmonic (x3, x5, x6 ...) of a stronger F in the same file (every rich F tone has an A in its 5th partial)."""
    from scipy.signal import welch
    from scipy.ndimage import median_filter
    m = x.mean(axis=1)
    if len(m) < 16384:
        m = np.pad(m, (0, 16384 - len(m)))
    f, P = welch(m, sr, nperseg=16384, noverlap=8192)
    L = 10 * np.log10(P + 1e-20)
    prom = L - median_filter(L, size=81)
    cand = [i for i in range(2, len(f) - 2) if 40 < f[i] < 8000 and prom[i] > 12 and L[i] == L[i - 2:i + 3].max()]
    out = []
    for i in sorted(cand, key=lambda i: -L[i]):
        lo = i
        while lo > 0 and L[lo] > L[i] - 6:
            lo -= 1
        hi = i
        while hi < len(L) - 1 and L[hi] > L[i] - 6:
            hi += 1
        if hi - lo > 5:
            continue
        mm = 69 + 12 * math.log2(f[i] / 440)
        out.append(dict(hz=round(float(f[i]), 1), note=f"{NAMES[int(round(mm)) % 12]}{int(round(mm)) // 12 - 1}",
                        cents=int(round((mm - round(mm)) * 100)), prominence_db=round(float(prom[i]), 1),
                        level_db=round(float(L[i] - L.max()), 1)))
        if len(out) >= 40:
            break
    fs = [p for p in out if p["note"][0] == "F" and p["note"][1:2] != "#"]
    for p in out:
        p["overtone_of_F"] = any(abs(p["hz"] / q["hz"] - round(p["hz"] / q["hz"])) < 0.02 and round(p["hz"] / q["hz"]) >= 2
                                 and q["level_db"] >= p["level_db"] - 6 for q in fs)
    return out[:top] + [p for p in out[top:] if p["note"][0] == "A" and p["note"][1:2] != "b"]


def seam(x):
    d = np.abs(np.diff(x, axis=0)).max(axis=1)
    med = float(np.median(d)) + 1e-12
    jump = float(np.abs(x[0] - x[-1]).max())
    k = 2400
    rms = lambda y: 20 * math.log10(float(np.sqrt(np.mean(y ** 2))) + 1e-12)  # noqa: E731
    return dict(jump_over_median_step=round(jump / med, 2), last50ms_db=round(rms(x[-k:]), 1), first50ms_db=round(rms(x[:k]), 1))


rows, tiles = [], []
for sid in NEW:
    e = MAN.get(sid)
    if not e:
        rows.append(dict(id=sid, error="not in manifest (not built?)"))
        continue
    x, sr = sf.read(os.path.join(REPO, "audio/sfx", e["file"]), always_2d=True)
    r = dict(id=sid, duration=e["duration"], lufs_i=e["levels"]["lufsIntegrated"], lufs_m_max=e["levels"]["lufsMomentaryMax"],
             true_peak_db=e["levels"]["truePeakDb"], loop=e["loop"], pitch=e.get("pitch"), measured_peak=e.get("measuredPeak"))
    tp = tonal_peaks(x, sr)
    r["tonal_peaks"] = tp
    # a held A natural is flagged; an A that is only an F tone's own overtone is let pass in a one-shot, but not in a
    # loop (a bed or hum sustains it under whole scenes)
    r["a_natural_tonal"] = [p for p in tp if p["note"][0] == "A" and p["note"][1:2] != "b" and abs(p["cents"]) < 40
                            and p["level_db"] > -30 and (not p["overtone_of_F"] or e["loop"])]
    if e["loop"]:
        r["seam"] = seam(x)
    rows.append(r)
    tiles.append((sid, x))

qa_dir = os.path.join(REPO, "audio/sfx/qa")
cols = 4
for page in range(0, len(tiles), 24):
    chunk = tiles[page:page + 24]
    nrows = math.ceil(len(chunk) / cols)
    th, tw = 140 + 14, 300
    sheet = np.full((nrows * th, cols * tw + (cols - 1) * 6, 3), 18, np.uint8)
    for i, (name, y) in enumerate(chunk):
        r_, c_ = divmod(i, cols)
        tile = build.spectro_tile(y)
        sheet[r_ * th + 14:r_ * th + 14 + tile.shape[0], c_ * (tw + 6):c_ * (tw + 6) + tw] = tile
    stem = os.path.join(qa_dir, f"spectro_act4v5_{page // 24 + 1:02d}")
    build.png_write(stem + ".png", sheet)
    with open(stem + ".txt", "w") as fh:
        fh.write("\n".join(f"{i // cols},{i % cols}: {n}" for i, (n, _) in enumerate(chunk)))

flag_a = [r["id"] for r in rows if r.get("a_natural_tonal")]
bad_seams = [r["id"] for r in rows if r.get("seam") and r["seam"]["jump_over_median_step"] > 8]
summary = dict(entries=len(rows), built=sum(1 for r in rows if "error" not in r), a_natural_tonal_flags=flag_a,
               loop_seam_flags=bad_seams, sheets=sorted(f for f in os.listdir(qa_dir) if f.startswith("spectro_act4v5_")))
json.dump(dict(summary=summary, rows=rows), open(os.path.join(qa_dir, "act4v5_board_qa.json"), "w"), indent=1)
print(json.dumps(summary, indent=1))
for r in rows:
    if r.get("a_natural_tonal") or (r.get("seam") and r["seam"]["jump_over_median_step"] > 8):
        print(r["id"], r.get("a_natural_tonal"), r.get("seam"))
