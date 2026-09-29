"""render_v5.py - render the Ep1 Act Four v5 SFX cue sheet to two stems, and measure them (nothing here is heard).

Reads   show/episodes/ep01/production/act4/sfx-v5.json     (spot_v5.py writes it)
        show/episodes/ep01/production/act4/shots-locked-v5.json + the v5 takes (only to measure against the dialogue)
Writes  out/ep01/act4/animatic/act4-sfx-v5.wav      effects bus  (48 kHz stereo 24-bit, act frame 0 = sample 0)
        out/ep01/act4/animatic/act4-rooms-v5.wav    room beds bus
        out/ep01/act4/animatic/act4-sfx-v5.qa.json  the measurements
Both stems already carry D6 (every sample zero from the Cancel click to the phone's buzz, except the click's own
first 0.25 s on the effects bus). Optional cues are left out unless --with-optional.

The mixer can take these stems as they are (sum them at unity against the dialogue at its take level, then
loudness-normalise the mix, as mix_v4.py does), or rebuild from the cue sheet.

Run it through the heavy-job gate (about 1 GB of memory, a minute or two of one core):
  cd <repo> && ops/heavy.sh audio/.venv-mix/bin/python audio/ep01/act4/sfx-v5/render_v5.py
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
import argparse
import json
import math
import os

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
ap = argparse.ArgumentParser()
ap.add_argument("--with-optional", action="store_true")
ap.add_argument("--out", default=P("out/ep01/act4/animatic"))
args = ap.parse_args()

SHEET = json.load(open(P("show/episodes/ep01/production/act4/sfx-v5.json")))
LOCK = json.load(open(P(SHEET["meta"]["lock"])))
SR, FPS = SHEET["meta"]["sample_rate"], SHEET["meta"]["fps"]
SPF = SR // FPS
TOTAL = SHEET["meta"]["act_frames"]
N = TOTAL * SPF
D6 = next(m for m in SHEET["stops"] if m["kind"] == "stop" and m["n"] == 1)
D6_S, D6_E = D6["s"] * SPF, D6["e"] * SPF

_cache = {}


def load(rel):
    if rel not in _cache:
        x, sr = sf.read(P(rel), dtype="float32", always_2d=True)
        assert sr == SR, (rel, sr)
        if x.shape[1] == 1:
            x = np.repeat(x, 2, axis=1)
        _cache[rel] = x[:, :2]
    return _cache[rel]


def db(g):
    return 10 ** (np.asarray(g, dtype=np.float64) / 20)


def todb(x):
    return 20 * np.log10(np.maximum(x, 1e-12))


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


FILTERS = {
    "laptop": lambda x: signal.sosfilt(sos("band", [250, 7000]), x, axis=0),
    "monitor": lambda x: signal.sosfilt(sos("band", [200, 6000]), x, axis=0),
    "cctv": lambda x: np.repeat(signal.sosfilt(sos("band", [180, 3800]), x.mean(axis=1), axis=0)[:, None], 2, axis=1),
}


def panv(x, p):
    """a balance, as mix_v4.py: the near channel at unity, the far one scaled by 1 - |p|"""
    if not p:
        return x
    return x * np.array([1 - max(0.0, p), 1 + min(0.0, p)], dtype=np.float32)


def fades(x, fin_n, fout_n):
    x = x.copy()
    n = len(x)
    if fin_n > 0:
        k = min(n, fin_n)
        x[:k] *= np.sin(0.5 * np.pi * np.linspace(0, 1, k, dtype=np.float32))[:, None]
    if fout_n > 0:
        k = min(n, fout_n)
        x[n - k:] *= np.cos(0.5 * np.pi * np.linspace(0, 1, k, dtype=np.float32))[:, None]
    return x


def tile(x, n, offset):
    o = int(offset) % len(x)
    reps = int(np.ceil((n + o) / len(x))) + 1
    return np.concatenate([x] * reps, axis=0)[o:o + n]


def add(bus, x, s0):
    s0 = int(round(s0))
    if s0 < 0:
        x = x[-s0:]
        s0 = 0
    if s0 >= len(bus) or len(x) == 0:
        return
    m = min(len(x), len(bus) - s0)
    bus[s0:s0 + m] += x[:m]


def ride_curve(points, s0, n):
    fr = np.array([p[0] for p in points], float) * SPF - s0
    return db(np.interp(np.arange(n), fr, [p[1] for p in points])).astype(np.float32)[:, None]


def render_cue(c):
    x = load(c["file"])
    a = int(round((c["start_s"] or 0) * SR))
    if c["loop"]:
        n = int(round((c["loop_until_frame"] - c["place_frame"]) * SPF))
        y = tile(x[a:] if a else x, max(0, n), c["loop_offset_s"] * SR)
    else:
        y = x[a:]
        if c["trim_s"]:
            y = y[:int(round(c["trim_s"] * SR))]
    y = y.astype(np.float32)
    if c["reverse"]:
        y = y[::-1].copy()
    y = fades(y, int(c["fade_in_s"] * SR), int((c["fade_out_s"] or 0) * SR))
    if c["device"]:
        y = FILTERS[c["device"]](y).astype(np.float32)
    y = panv(y, c["pan"]) * np.float32(db(c["gain_db"]))
    s0 = c["place_frame"] * SPF
    if c["ride"]:
        y = y * ride_curve(c["ride"], s0, len(y))
    return y, s0


# ================================================================================================ the effects bus
sfx = np.zeros((N, 2), np.float32)
CUE_LOG = []
click_cue = None
for c in SHEET["cues"]:
    if c["optional"] and not args.with_optional:
        CUE_LOG.append(dict(id=c["id"], skipped="optional"))
        continue
    y, s0 = render_cue(c)
    add(sfx, y, s0)
    CUE_LOG.append(dict(id=c["id"], s0=int(round(s0)), n=len(y)))
    if c["sound"] == "dialog_ok_click" and c["frame"] * SPF == D6_S:
        click_cue = (y, s0)

# ================================================================================================ the room beds
rooms = np.zeros((N, 2), np.float32)
BED_LOG = []
for b in SHEET["beds"]:
    n = (b["out_frame"] - b["in_frame"]) * SPF
    loop = None
    for L in b["layers"]:
        x = load(L["file"]).astype(np.float64)
        if L.get("lowpass_hz"):
            x = signal.sosfilt(sos("low", L["lowpass_hz"]), np.concatenate([x, x, x]), axis=0)[len(x):2 * len(x)]
        if L.get("highpass_hz"):
            x = signal.sosfilt(sos("high", L["highpass_hz"]), np.concatenate([x, x, x]), axis=0)[len(x):2 * len(x)]
        x = x * db(L["gain_db"])
        if loop is None:
            loop = x
        else:                                              # layers of different loop lengths: tile to the longest
            m = max(len(loop), len(x))
            loop = tile(loop, m, 0) + tile(x, m, 0)
    rms = float(np.sqrt(np.mean(loop ** 2)))              # per-channel mean power over the loop
    g = float(db(b["target_dbfs_rms"])) / (rms + 1e-12)
    y = (tile(loop, n, b["offset_s"] * SR) * g).astype(np.float32)
    y = fades(y, b["fade_in_f"] * SPF, b["fade_out_f"] * SPF)
    if b["ride"]:
        y = y * ride_curve(b["ride"], b["in_frame"] * SPF, n)
    if b["pan"]:
        y = panv(y, b["pan"])
    add(rooms, y, b["in_frame"] * SPF)
    BED_LOG.append(dict(id=b["id"], kind=b["kind"], gain_db=round(20 * math.log10(g), 2), loop_rms_dbfs=round(20 * math.log10(rms + 1e-12), 2)))

# ================================================================================================ D6
for bus in (sfx, rooms):
    bus[D6_S:D6_E] = 0.0
if click_cue is not None:
    y, s0 = click_cue
    keep = int(0.25 * SR)
    seg = y[:keep] * np.linspace(1, 0, min(keep, len(y)), dtype=np.float32)[:, None]
    add(sfx, seg, s0)

os.makedirs(args.out, exist_ok=True)
f_sfx, f_rooms = os.path.join(args.out, "act4-sfx-v5.wav"), os.path.join(args.out, "act4-rooms-v5.wav")
peak_sfx, peak_rooms = float(np.abs(sfx).max()), float(np.abs(rooms).max())
assert peak_sfx < 1.0 and peak_rooms < 1.0, (peak_sfx, peak_rooms)
sf.write(f_sfx, sfx, SR, subtype="PCM_24")
sf.write(f_rooms, rooms, SR, subtype="PCM_24")

# ================================================================================================ measurements (on the stems as written)
xs, _ = sf.read(f_sfx, dtype="float32", always_2d=True)
xr, _ = sf.read(f_rooms, dtype="float32", always_2d=True)
W50 = SR // 20


def lev(x, w=W50, mode="loud"):
    n = len(x) // w
    p = (x[: n * w].astype(np.float64).reshape(n, w, x.shape[1]) ** 2).mean(axis=1)
    if mode == "mono":
        m = x[: n * w, :].mean(axis=1).astype(np.float64).reshape(n, w)
        return todb(np.sqrt((m ** 2).mean(axis=1)))
    return todb(np.sqrt(p.max(axis=1)))


meter = pyln.Meter(SR)
lufs = dict(sfx=round(meter.integrated_loudness(xs.astype(np.float64)), 2), rooms=round(meter.integrated_loudness(xr.astype(np.float64)), 2),
            sfx_plus_rooms=round(meter.integrated_loudness((xs + xr).astype(np.float64)), 2))

# the dialogue, placed as the lock places it (mono, unity), only to measure against
dlg = np.zeros(N, np.float32)
for l in LOCK["lines"]:
    x, sr = sf.read(P(l["file"]), dtype="float32", always_2d=False)
    if x.ndim > 1:
        x = x.mean(axis=1)
    s0 = l["file_in"] * SPF
    m = min(len(x), N - s0)
    if s0 >= 0 and m > 0:
        dlg[s0:s0 + m] += x[:m]

# holes in the room floor (rooms + effects), outside D6, louder channel and mono
floor = xs + xr
Lf, Lm = lev(floor), lev(floor, mode="mono")
d6w = (D6_S // W50, D6_E // W50 + 1)


def holes(L, thr=-42.0, min_s=0.3):
    out, run = [], None
    for i, v in enumerate(L):
        inside = d6w[0] <= i < d6w[1]
        if v < thr and not inside:
            run = i if run is None else run
        else:
            if run is not None and (i - run) * 0.05 >= min_s:
                out.append(dict(from_frame=round(run * 0.05 * FPS, 1), to_frame=round(i * 0.05 * FPS, 1), seconds=round((i - run) * 0.05, 2),
                                min_dbfs=round(float(L[run:i].min()), 1)))
            run = None
    return out


# the beds as measured in their full-level interiors
Lr = lev(xr)
bed_meas = []
for b in SHEET["beds"]:
    a = (b["in_frame"] + b["fade_in_f"]) * SPF // W50
    e = (b["out_frame"] - b["fade_out_f"]) * SPF // W50
    if e - a < 4:
        continue
    seg = Lr[a:e]
    bed_meas.append(dict(id=b["id"], kind=b["kind"], target=b["target_dbfs_rms"], median_50ms_dbfs=round(float(np.median(seg)), 1),
                         p05_50ms_dbfs=round(float(np.percentile(seg, 5)), 1)))

# each cue against the dialogue: its first 300 ms, effects bus vs dialogue (RMS, dBFS; dialogue as mono on both channels)
hw = int(0.3 * SR)
cue_meas, loud_vs_words = [], []
for c, logc in zip(SHEET["cues"], CUE_LOG):
    if "skipped" in logc:
        continue
    a = int(round(c["frame"] * SPF)) if not c["end_anchor"] else logc["s0"]
    a = max(0, min(N - hw, a))
    s_rms = float(todb(np.sqrt(np.mean(xs[a:a + hw].astype(np.float64) ** 2, axis=0)).max()))
    s_pk = float(todb(np.abs(xs[a:a + hw]).max()))
    d_rms = float(todb(np.sqrt(np.mean(dlg[a:a + hw].astype(np.float64) ** 2))))
    row = dict(id=c["id"], sound=c["sound"], frame=c["frame"], peak_dbfs=round(s_pk, 1), rms300_dbfs=round(s_rms, 1))
    if d_rms > -32:                                    # speech (the takes' room handles sit far below this)
        row["dialogue_rms300_dbfs"] = round(d_rms, 1)
        row["under_dialogue_db"] = round(d_rms - s_rms, 1)
        if d_rms - s_rms < 6:
            loud_vs_words.append(row)
    cue_meas.append(row)

d6_rest = dict(sfx_peak_dbfs_after_click=round(float(todb(np.abs(xs[D6_S + int(0.25 * SR):D6_E]).max())), 1),
               rooms_peak_dbfs=round(float(todb(np.abs(xr[D6_S:D6_E]).max())), 1),
               click_peak_dbfs=round(float(todb(np.abs(xs[D6_S:D6_S + int(0.25 * SR)]).max())), 1),
               seconds=round((D6_E - D6_S) / SR, 3))
qa = dict(
    files=dict(sfx=os.path.relpath(f_sfx, REPO), rooms=os.path.relpath(f_rooms, REPO)),
    sheet=dict(version=SHEET["meta"]["version"], lock_sha1=SHEET["meta"]["lock_sha1"], optional_included=args.with_optional),
    seconds=round(N / SR, 3), frames=TOTAL,
    loudness_lufs=lufs,
    true_peak_note="sample peaks: sfx %.1f dBFS, rooms %.1f dBFS" % (todb(peak_sfx), todb(peak_rooms)),
    d6=d6_rest,
    holes_under_42dbfs_0p3s=dict(note="rooms + effects only, no music and no dialogue: the floor the mix sits on. The score covers most of the act "
                                      "(v4: 92.6 % audible), so the mix's own hole count is the one that decides; these list where the floor alone dips.",
                                 louder_channel=holes(Lf), mono=holes(Lm)),
    beds=bed_meas, bed_gains=BED_LOG,
    cues_within_6db_of_the_dialogue=loud_vs_words,
    cues=cue_meas,
    honesty="Measured on the written stems; nobody has listened. Numbers are spotting tools for the mixer's ear, not gates.",
)
json.dump(qa, open(os.path.join(args.out, "act4-sfx-v5.qa.json"), "w"), indent=1)
print(json.dumps({k: qa[k] for k in ("files", "loudness_lufs", "d6", "true_peak_note")}, indent=1))
print("holes (louder ch / mono):", len(qa["holes_under_42dbfs_0p3s"]["louder_channel"]), "/", len(qa["holes_under_42dbfs_0p3s"]["mono"]))
print("beds:", [(b["kind"], b["target"], b["median_50ms_dbfs"]) for b in bed_meas])
print("cues within 6 dB of the dialogue:", [(r["id"], r["sound"], r["under_dialogue_db"]) for r in loud_vs_words])
