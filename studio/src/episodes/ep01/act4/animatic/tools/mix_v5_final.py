#!/usr/bin/env python
"""mix_v5_final.py - the Ep1 Act Four v5 FINAL MIX (the re-recording mixer's pass, 2026-09-27).

Nothing here was heard. Every number this script prints or writes is measured on the files it writes; a person must
listen (show/episodes/ep01/production/act4/mix-v5.md, "What needs ears").

INPUTS (all read-only; this script edits none of them)
  clock     show/reel/ep01-act4-v5.json (the approved stick timeline) and the pixel pass's lock
            show/episodes/ep01/production/act4/shots-locked-v5.json (shots, sequences, D6). Act frame 0 = 12:31:00, 24 fps.
  DIALOGUE  the 101 v5 takes (audio/ep01/act4/dialogue/lines-v5.json), each file laid at its beat's realStart - 751 s + t - in
            (the same arithmetic as the stick mix, the lock and both composers), checked against the lock's frames.
            Unity on both channels (mix_v4.py's and the SFX sheet's reference). Call, monitor and laptop voices already
            carry their small-speaker chain in the take; the mix adds the LISTENING ROOM's early reflections as a send
            (the takes say "DRY: the room's early reflection is a mix send"), a little more for devices and O.S. voices.
            The split (S4.08) leans Neleh a touch left and the lighthouse a touch right, as its two beds do.
  MUSIC     the two composers' six to-picture cues (audio/ost/tracks/e01-act4-v5/render/stems/*), each at 0 dB with its
            file t = 0 on the act frame its cue sheet gives. S1-S4 files are ducked by s1-s4_duckmap.json (per-frame
            curve; +2 dB on the held families under a silent post), S5-S8 files by s5-s8_ducking-map.json (breakpoints).
            The mixer then (1) slew-limits each curve (falls <= 60 dB/s, begun early so the depth is reached on time;
            rises <= 20 dB/s), so no step is shorter than a short ramp, and (2) tops up the duck under any line whose
            dialogue-over-music reads under the floor (12 dB; 10 dB for the V.O.), by at most 4 dB.
  EFFECTS   the SFX cue sheet show/episodes/ep01/production/act4/sfx-v5.json, rendered by its own conventions, with the
            mixer's small-speaker chains for `device` cues. Its optional cues stay off except FX048, the Rewind's reverse
            swell (OST-BIBLE §6.8 gives reverse swells to the SFX; the S2 score left it a slot).
  BEDS      the sheet's 19 room beds (one per location, crossfaded; none crosses D6). The bus comes up 1.5 dB (the master
            gain took the whole act down 2.3 dB, leaving the rooms at the bottom of the plan's -38 to -40 dBFS), and the room
            lifts 2 dB inside three designed music-off windows (the dial-tone rest, Mada's stop, the lobby rest).
  D6        act f 997 -> 1086 (the Cancel click to the phone's buzz): every bus is digital zero there except the click's
            own first 0.25 s. The suite's room carries "super." from the buzz until S2's felt re-enters on 1178.
  MASTER    one gain to -16.5 LUFS integrated (the act mixes' target since v3/v4) and a linked 4x-oversampled look-ahead
            limiter at -1.3 dBTP (the intro pipeline's ceiling, leaving room for AAC overshoot); the true-peak limit is
            -1.0 dBTP. The same gain curve is applied to every stem, so the four stems sum to the mix.

OUTPUTS (out/ep01/act4/animatic/)
  act4-mix-v5-final.wav                      48 kHz stereo 24-bit, exactly 12443 frames (act frame 0 = sample 0)
  act4-mix-v5-final-{dialogue,music,effects,beds}.flac   the stems (24-bit FLAC; they sum to the mix)
  act4-mix-v5-final-tail-music.flac          the score's ring past the act's last frame (lay at act f 12443 = the tag)
  act4-mix-v5-final.cues.json                what was laid where, every mixer decision, and the measurements
  act4-stick-v5-finalmix.mp4                 the approved stick reel (its video stream-copied) with this mix from its f 72
  act4-animatic-v5-finalmix.mp4              the pixel preview picture with this mix (only if the picture exists and is
                                              not being written)

RUN (it is a heavy job: about 3 GB of memory and a few minutes of one core; nothing else is started in parallel)
  cd <repo>
  nohup ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py > <log> 2>&1 &
  ... --no-mux      the mix, stems and measurements only
  ... --mux-only    re-mux the written mix (e.g. after the pixel pass re-renders its picture) and re-check the encodes
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
import os

for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ.setdefault(_v, "1")                  # one core: be gentle on the laptop

import argparse  # noqa: E402
import glob  # noqa: E402
import hashlib  # noqa: E402
import json  # noqa: E402
import math  # noqa: E402
import subprocess  # noqa: E402
import time  # noqa: E402
from collections import OrderedDict  # noqa: E402

import numpy as np  # noqa: E402
import pyloudnorm as pyln  # noqa: E402
import soundfile as sf  # noqa: E402
from scipy import signal  # noqa: E402
from scipy.ndimage import minimum_filter1d  # noqa: E402



def P(*a):
    return os.path.join(REPO, *a)


def rel(p):
    return os.path.relpath(p, REPO)


SR, FPS = 48000, 24
SPF = SR // FPS
W50 = SR // 20                                      # the 50 ms measuring window (as v3/v4 and both composers)
ACT0_S = 12 * 60 + 31                               # act frame 0 = episode 12:31:00

ap = argparse.ArgumentParser(description="Ep1 Act Four v5 final mix")
ap.add_argument("--out", default=P("out/ep01/act4/animatic"), help="output folder (default: the animatic folder)")
ap.add_argument("--no-mux", action="store_true", help="skip the two mp4 muxes")
ap.add_argument("--mux-only", action="store_true", help="only re-mux the written mix and re-check the encodes")
args = ap.parse_args()

OUT = args.out
BASE = "act4-mix-v5-final"
F_MIX = os.path.join(OUT, BASE + ".wav")
F_STEM = OrderedDict((k, os.path.join(OUT, f"{BASE}-{k}.flac")) for k in ("dialogue", "music", "effects", "beds"))
F_TAIL = os.path.join(OUT, f"{BASE}-tail-music.flac")
F_CUES = os.path.join(OUT, BASE + ".cues.json")
STICK_MP4 = P("out/ep01/act4/reel/ep01-act4-v5.mp4")
STICK_OUT = os.path.join(OUT, "act4-stick-v5-finalmix.mp4")
PIX_MP4 = P("out/ep01/act4/animatic/act4-animatic-v5-picture.mp4")
PIX_OUT = os.path.join(OUT, "act4-animatic-v5-finalmix.mp4")
FFDIR = P("studio/node_modules/@remotion/compositor-linux-x64-gnu")
FF, FFP = os.path.join(FFDIR, "ffmpeg"), os.path.join(FFDIR, "ffprobe")
FFENV = dict(os.environ, LD_LIBRARY_PATH=FFDIR)

LOCK_PATH = P("show/episodes/ep01/production/act4/shots-locked-v5.json")
REEL_PATH = P("show/reel/ep01-act4-v5.json")
TAKES_PATH = P("audio/ep01/act4/dialogue/lines-v5.json")
SHEET_PATH = P("show/episodes/ep01/production/act4/sfx-v5.json")
OST = P("audio/ost/tracks/e01-act4-v5")
MAP_A_PATH = os.path.join(OST, "s1-s4_duckmap.json")
MAP_B_PATH = os.path.join(OST, "s5-s8_ducking-map.json")
SHEET_A_PATH = os.path.join(OST, "s1-s4_cuesheet.json")
SHEET_B_PATH = os.path.join(OST, "s5-s8_cue-sheet.json")

TARGET_LUFS = -16.5          # the act mixes' integrated target (v3 -16.6, v4 -16.5)
CEILING_DBTP = -1.3          # the limiter's ceiling (true peak, 4x oversampled)
TP_LIMIT_DBTP = -1.0         # the limit the file must meet
HOLE_DB, HOLE_S = -42.0, 0.3
JUMP_DB = 15.0
MUSIC_ON_DB = -60.0          # the music bus counts as playing above this (louder channel, 50 ms; the composers' measure)

# ------------------------------------------------------------------------------------------------ the mixer's decisions
# the listening rooms (early reflections as a send; `send` is the wet energy against the dry take, in dB)
ROOMS = OrderedDict(
    suite=dict(taps=(9, 14, 21, 29, 38), rt=0.18, lp=6000, send=-25.0, what="the suite: carpet and glass, medium"),
    office=dict(taps=(6, 10, 15, 22), rt=0.14, lp=6000, send=-25.0, what="Neleh's office: small, furnished"),
    allhands=dict(taps=(19, 31, 44, 58, 75), rt=0.45, lp=5000, send=-19.0, what="the all-hands floor: big and full"),
    boardroom=dict(taps=(11, 17, 26, 35, 47), rt=0.25, lp=5500, send=-22.0, what="the boardroom: glass and a long table"),
    lighthouse=dict(taps=(8, 16, 24, 33), rt=0.30, lp=4500, send=-21.0, what="the lighthouse room: round stone"),
    dark=dict(taps=(5, 9, 14), rt=0.10, lp=5000, send=-28.0, what="the dark room: small and dead"),
    boxes=dict(taps=(4, 7), rt=0.06, lp=6000, send=-30.0, what="the two boxes (P2): stylised, near dry"),
    bullpen=dict(taps=(10, 17, 25, 36), rt=0.22, lp=6000, send=-23.0, what="the bullpen: open plan"),
    lobby=dict(taps=(17, 29, 43, 61, 83), rt=0.60, lp=5000, send=-19.0, what="the lobby at night: stone and glass"),
    corridor=dict(taps=(7, 14, 21, 28, 35), rt=0.30, lp=5000, send=-21.0, what="the vault corridor: hard and narrow"),
)
DEVICE_SEND_DB = 7.0         # a small speaker in a room excites the room more than a close mic hears it
OS_SEND_DB = 4.0             # an off-screen voice sits a little further into its room
OS_DRY_DB = -1.0
DX_PAN = {"a5-27-30": -0.25,                                            # the split: Neleh's pane (left)
          "a5-27-31": 0.25, "a5-27-32": 0.25, "a5-27-33": 0.25, "a5-27-34": 0.25}   # the lighthouse pane (right)
DX_TRIM_DB = {}              # per-line trims (none needed on the measurements; add here, with a reason, if an ear asks)
FX_TRIM_DB = {}              # per-cue effect trims (same)
# optional sheet cues the mix turns on. FX048: the S2 composer left a one-beat slot for "the SFX's reverse swell" at act
# 1485 (s1-s4_s2_third_mark.py), and OST-BIBLE §6.8 ("one owner per sound") gives reverse swells and tape_* to the SFX:
# the score's Rewind is a retrograde in notes, not a reversed file. The sheet had left it off in case the score owned it.
OPTIONAL_ON = {"FX048": "the Rewind's reverse swell into the whip: the SFX owns it (OST-BIBLE §6.8); the score left it a slot at 1485"}
DM_FLOOR_DB = 12.0           # dialogue over music under a voiced line (50 ms windows, the line's speech)
DM_FLOOR_VO_DB = 10.0        # his V.O. sits inside a composed felt window (edit-plan-v5 §5; the S1-S4 composer's -4 dB)
TOPUP_MAX_DB = 4.0
TOPUP_MIN_DB = 0.5           # a shortfall under half a dB is left alone (no needless gain movement)
# the rooms: the sheet sets each bed against the takes at unity; the master gain (about -2.3 dB, because v5 is far denser in
# speech than v4) then leaves them near -40.5 dBFS, the bottom of edit-plan-v5 §5's "about -38 to -40". The bus comes up:
BEDS_TRIM_DB = 1.5
# ...and inside three of the designed music-off windows the room itself holds the stop (+2 dB, 0.5 s ramps, back at
# level by the re-entry): there a decorrelated stereo bed alone reads about 3 dB low in the mono downmix and dipped under
# -42 dBFS (run 1: 0.35 s, 1.95 s and 0.3 s). After D6 and under "of what?" the trim alone keeps the floor above -41.
REST_RIDES = [(4575, 4623, 2.0, 0.5, 0.5, "the designed rest under the four dial tones"),
              (9341, 9400, 2.0, 0.5, 0.5, "the dead stop on MADA's label, to the violin"),
              (11590, 11682, 2.0, 0.5, 0.5, "the lobby rest: the CU and \"okay.\" on the neon's F, to the felt")]
SLEW_FALL_DB_S, SLEW_RISE_DB_S = 60.0, 20.0
LIFT_RAMP_S = 0.3
HELD_FAMILIES = ("strings", "bass", "synth", "piano")
# the small-speaker chains for the sheet's `device` cues (render_v5.py's band-passes, made steeper, with a speaker peak;
# no saturation: harmonics of an F-tuned cue would land on A)
DEVICE = dict(laptop=dict(hp=280, lp=6500, peak=(1200, 3.0, 1.0), mono=False, what="Neleh's laptop speaker"),
              monitor=dict(hp=200, lp=6000, peak=(1500, 2.0, 1.0), mono=False, what="Mas's monitor speaker"),
              cctv=dict(hp=180, lp=3800, peak=(1800, 2.5, 1.2), mono=True, what="the boardroom wall screen (the lobby camera)"))


# ------------------------------------------------------------------------------------------------ helpers
def db(g):
    return 10.0 ** (np.asarray(g, dtype=np.float64) / 20.0)


def todb(x):
    return 20.0 * np.log10(np.maximum(np.asarray(x, dtype=np.float64), 1e-12))


def sha(path, n=12):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()[:n]


def tc(f):
    e = int(round(ACT0_S * FPS + f))
    return f"{e // (60 * FPS):02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


def peaking(f0, gain_db, q):
    a_ = 10 ** (gain_db / 40)
    w0 = 2 * math.pi * f0 / SR
    al = math.sin(w0) / (2 * q)
    b = [1 + al * a_, -2 * math.cos(w0), 1 - al * a_]
    a = [1 + al / a_, -2 * math.cos(w0), 1 - al / a_]
    return signal.tf2sos(b, a)


def add(bus, x, s0):
    s0 = int(round(s0))
    if s0 < 0:
        x = x[-s0:]
        s0 = 0
    if s0 >= len(bus) or len(x) == 0:
        return
    m = min(len(x), len(bus) - s0)
    bus[s0:s0 + m] += x[:m]


def panv(x, p):
    """a balance, as mix_v4.py and the SFX sheet: the near channel at unity, the far one scaled by 1 - |p|"""
    if not p:
        return x
    return x * np.array([1 - max(0.0, p), 1 + min(0.0, p)], dtype=x.dtype)


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


def runs(mask):
    out, st = [], None
    for i, v in enumerate(list(mask) + [False]):
        if v and st is None:
            st = i
        if not v and st is not None:
            out.append((st, i))
            st = None
    return out


def lev(x, mode="loud"):
    """50 ms RMS in dBFS: 'loud' = the louder channel (mix_v4's measure), 'mono' = (L + R) / 2 (the lead's v3 measure)"""
    n = len(x) // W50
    out = np.empty(n)
    step = 200                                      # 10 s at a time
    for i in range(0, n, step):
        j = min(n, i + step)
        y = x[i * W50:j * W50].astype(np.float64)
        if mode == "mono":
            m = y.mean(axis=1).reshape(j - i, W50)
            out[i:j] = todb(np.sqrt((m ** 2).mean(axis=1)))
        else:
            p = (y.reshape(j - i, W50, y.shape[1]) ** 2).mean(axis=1)
            out[i:j] = todb(np.sqrt(p.max(axis=1)))
    return out


def tp_env(x, chunk=SR * 10, pad=256):
    """per-sample true-peak envelope: max over channels of |x| 4x oversampled (BS.1770 true peak), chunked"""
    n = len(x)
    out = np.empty(n, np.float32)
    for a in range(0, n, chunk):
        b = min(n, a + chunk)
        lo, hi = max(0, a - pad), min(n, b + pad)
        y = signal.resample_poly(x[lo:hi].astype(np.float64), 4, 1, axis=0)
        pk = np.abs(y).max(axis=1)[: 4 * (hi - lo)].reshape(hi - lo, 4).max(axis=1)
        out[a:b] = pk[a - lo:a - lo + (b - a)]
    return out


def true_peak_db(x):
    return float(todb(tp_env(x).max()))


def limiter_gain(x, ceiling_db, look_ms=2.0, rel_ms=60.0):
    """a linked look-ahead true-peak limiter's gain (per sample); 1.0 wherever the ceiling isn't reached"""
    pk = tp_env(x)
    g = np.minimum(1.0, db(ceiling_db) / np.maximum(pk, 1e-9)).astype(np.float32)
    if g.min() >= 1.0:
        return np.ones(len(x), np.float32), 0.0
    la = int(look_ms / 1000 * SR)
    g = minimum_filter1d(g, size=2 * la + 1, mode="nearest")
    blk = 16
    nb = len(g) // blk
    gb = g[: nb * blk].reshape(nb, blk).min(axis=1)
    r = math.exp(-blk / (rel_ms / 1000 * SR))
    outl = gb.tolist()
    v = 1.0
    for i, gi in enumerate(outl):                   # walks the whole file at a 16-sample control rate
        v = gi if gi < v else gi + (v - gi) * r
        outl[i] = v
    outb = np.array(outl, np.float32)
    gg = np.repeat(outb, blk)
    gg = np.concatenate([gg, np.full(len(x) - len(gg), gg[-1] if len(gg) else 1.0, np.float32)])
    gg = np.minimum(gg, g)                          # never above the instantaneous need
    return gg.astype(np.float32), float(todb(gg.min()))


METER = pyln.Meter(SR)


def lufs_i(x):
    y = x.astype(np.float64)
    v = METER.integrated_loudness(y)
    del y
    return float(v)


# K-weighting (BS.1770-4, 48 kHz) for the short-term / momentary / LRA measures
K1 = signal.tf2sos([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585])
K2 = signal.tf2sos([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])
KSOS = np.vstack([K1, K2])


def kblocks(x, blk_s=0.1):
    """mean square of the K-weighted signal (summed over channels) in 100 ms blocks"""
    n = len(x)
    B = int(blk_s * SR)
    nb = n // B
    zi = np.zeros((KSOS.shape[0], 2, x.shape[1]))
    ms = np.empty(nb)
    step = 100 * B
    for a in range(0, nb * B, step):
        b = min(nb * B, a + step)
        y, zi = signal.sosfilt(KSOS, x[a:b].astype(np.float64), axis=0, zi=zi)
        ms[a // B:b // B] = (y.reshape((b - a) // B, B, x.shape[1]) ** 2).mean(axis=1).sum(axis=1)
    return ms


def win_loud(ms, k):
    """loudness of each k-block window (hop one block)"""
    c = np.concatenate([[0.0], np.cumsum(ms)])
    m = (c[k:] - c[:-k]) / k
    return -0.691 + 10 * np.log10(np.maximum(m, 1e-20))


def lra(st):
    s = st[st > -70.0]
    if not len(s):
        return None
    rel_gate = -0.691 + 10 * np.log10(np.mean(10 ** ((s + 0.691) / 10))) - 20.0
    s = s[s > rel_gate]
    return float(np.percentile(s, 95) - np.percentile(s, 10))


def pics_open_by_any_process(path):
    """True if any process we can see holds `path` open (a render still writing it)"""
    real = os.path.realpath(path)
    for pid in os.listdir("/proc"):
        if not pid.isdigit():
            continue
        d = f"/proc/{pid}/fd"
        try:
            for fd in os.listdir(d):
                try:
                    if os.readlink(os.path.join(d, fd)) == real:
                        return True
                except OSError:
                    pass
        except OSError:
            pass
    return False


def ffprobe_frames(path):
    r = subprocess.run([FFP, "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=nb_frames,r_frame_rate,width,height",
                        "-of", "json", path], capture_output=True, text=True, env=FFENV)
    s = json.loads(r.stdout)["streams"][0]
    return int(s["nb_frames"]), s["r_frame_rate"], s["width"], s["height"]


# ================================================================================================ inputs and the clock
LOCK = json.load(open(LOCK_PATH))
REEL = json.load(open(REEL_PATH))
TAKES = {t["id"]: t for t in json.load(open(TAKES_PATH))}
SHEET = json.load(open(SHEET_PATH))
MAP_A = json.load(open(MAP_A_PATH))
MAP_B = json.load(open(MAP_B_PATH))
CSA = json.load(open(SHEET_A_PATH))
CSB = json.load(open(SHEET_B_PATH))
TOTAL = LOCK["summary"]["act_frames"]
N = TOTAL * SPF
SH = OrderedDict((s["id"], s) for s in LOCK["shots"])
LINES = LOCK["lines"]
LN = {l["id"]: l for l in LINES}
D6_S, D6_E = LOCK["summary"]["D6_frames"]
assert (D6_S, D6_E) == (997, 1086), (D6_S, D6_E)
assert SHEET["meta"]["act_frames"] == TOTAL and SHEET["meta"]["sample_rate"] == SR and SHEET["meta"]["fps"] == FPS
d6_sheet = next(m for m in SHEET["stops"] if m["kind"] == "stop" and m["n"] == 1)
assert (d6_sheet["s"], d6_sheet["e"]) == (D6_S, D6_E)


def shot_at(f):
    for s in LOCK["shots"]:
        if s["s"] <= f < s["e"]:
            return s["id"]
    return LOCK["shots"][-1]["id"]


def seq_at(f):
    for q in LOCK["sequences"]:
        if q["s"] <= f < q["e"]:
            return q["id"]
    return LOCK["sequences"][-1]["id"]


# every take's file start from the stick timeline (beat realStart - 751 s + t - in), checked against the lock
PLACE = {}
for b in REEL["beats"]:
    bs = b["realStart"] - float(ACT0_S)
    for l in b["lines"]:
        PLACE[l["id"]] = dict(file=l["audio"], file_s=bs + l["t"] - l["in"], on_s=bs + l["t"], end_s=bs + l["t"] + l["dur"])
CLOCK = dict(lines=len(LINES), file_differs=[], file_s_over_6ms=[], onset_frame_differs=[])
for L in LINES:
    p = PLACE[L["id"]]
    if p["file"] != L["file"]:
        CLOCK["file_differs"].append(L["id"])
    if abs(p["file_s"] - L["file_s"]) > 0.006:
        CLOCK["file_s_over_6ms"].append((L["id"], round(p["file_s"] - L["file_s"], 4)))
    if int(math.floor(p["on_s"] * FPS + 1e-6)) != L["abs_in"]:
        CLOCK["onset_frame_differs"].append((L["id"], round(p["on_s"] * FPS, 3), L["abs_in"]))
assert not CLOCK["file_differs"] and not CLOCK["file_s_over_6ms"], CLOCK
assert all(abs(a - b) <= 1.0 for _, a, b in CLOCK["onset_frame_differs"]), CLOCK

# the music: (cue id, composer group, file t = 0 on this act frame), checked against both cue sheets
MUSIC = [("s1-s4_noon", "A", 0), ("s1-s4_third-mark", "A", 1166), ("s1-s4_procedure", "A", 1500),
         ("s5-s8_s5-two-am", "B", 6985), ("s5-s8_s6-avalanche", "B", 9001), ("s5-s8_s7s8-the-return", "B", 9376)]
_t0a = {c["id"]: c["lay_at"]["act_frame"] for c in CSA["cues"]}
_t0b = {c["id"]: c["file_t0_act_frame"] for c in CSB["cues"]}
for cid, grp, t0 in MUSIC:
    assert ({**_t0a, **_t0b})[cid] == t0, (cid, t0)

MUX_ONLY = args.mux_only

_cache = {}


def load(relp):
    if relp not in _cache:
        x, sr = sf.read(P(relp), dtype="float32", always_2d=True)
        assert sr == SR, (relp, sr)
        if x.shape[1] == 1:
            x = np.repeat(x, 2, axis=1)
        _cache[relp] = x[:, :2]
    return _cache[relp]


def bed_loop(b):
    """a sheet bed's summed layers (one loop) and the gain that puts it at its RMS target (render_v5.py's convention)"""
    loop = None
    for Ly in b["layers"]:
        x = load(Ly["file"]).astype(np.float64)
        if Ly.get("lowpass_hz"):
            x = signal.sosfilt(sos("low", Ly["lowpass_hz"]), np.concatenate([x, x, x]), axis=0)[len(x):2 * len(x)]
        if Ly.get("highpass_hz"):
            x = signal.sosfilt(sos("high", Ly["highpass_hz"]), np.concatenate([x, x, x]), axis=0)[len(x):2 * len(x)]
        x = x * db(Ly["gain_db"])
        if loop is None:
            loop = x
        else:
            m = max(len(loop), len(x))
            loop = tile(loop, m, 0) + tile(x, m, 0)
    rms = float(np.sqrt(np.mean(loop ** 2)))
    return loop, float(db(b["target_dbfs_rms"])) / (rms + 1e-12)


def preroll(master_gain_db, n=72 * SPF, lap_s=0.75):
    """the stick reel's 3 s title card: silent, then the act's first bed pre-lapped over its last 0.75 s, in loop phase"""
    b = next(b_ for b_ in SHEET["beds"] if b_["in_frame"] == 0)
    loop, g = bed_loop(b)
    y = tile(loop, n, (b["offset_s"] * SR - n) % len(loop)) * g * db(master_gain_db)
    if b["pan"]:
        y = panv(y, b["pan"])
    k = int(lap_s * SR)
    y[:-k] = 0.0
    y[-k:] *= np.sin(0.5 * np.pi * np.linspace(0, 1, k))[:, None]
    return y.astype(np.float32), b["id"]

# ================================================================================================ the mix
if not MUX_ONLY:
    t_start = time.time()

    # ---------------------------------------------------------------------------------------- DIALOGUE
    def room_ir(taps, rt, lp, seed):
        r = np.random.default_rng(seed)
        n = int((max(taps) / 1000 + rt) * SR) + 1
        h = np.zeros((n, 2))
        for k, t in enumerate(taps):
            for c in range(2):
                i = int(round(t * (1 + r.uniform(-0.07, 0.07)) / 1000 * SR))
                h[i, c] += (0.8 ** k) * r.uniform(0.75, 1.0) * r.choice((-1.0, 1.0))
        i0 = int(taps[0] / 1000 * SR)
        m = n - i0
        env = 10 ** (-3 * np.arange(m) / (rt * SR))  # -60 dB over rt
        h[i0:] += r.standard_normal((m, 2)) * env[:, None] * 0.05
        h = signal.sosfilt(sos("low", lp), h, axis=0)
        h = signal.sosfilt(sos("high", 150), h, axis=0)
        return h / np.sqrt((h ** 2).sum(axis=0).mean())

    IR = {k: room_ir(v["taps"], v["rt"], v["lp"], 100 + i) for i, (k, v) in enumerate(ROOMS.items())}

    def room_for(L, t):
        r, who = t["room"], L["who"]
        if t["kind"] == "vo" or "(V.O.)" in r:
            return None                                              # the V.O. is intimate: no room
        if r.startswith("the split"):
            return "boardroom" if who == "NELEH" else "lighthouse"
        for pre, k in (("the suite", "suite"), ("Neleh's office", "office"), ("the all-hands", "allhands"),
                       ("the boardroom", "boardroom"), ("the dark room", "dark"), ("the avalanche", "dark"),
                       ("the two boxes", "boxes"), ("the bullpen", "bullpen"), ("the lobby", "lobby"),
                       ("the vault", "corridor")):
            if r.startswith(pre):
                return k
        raise KeyError((L["id"], r))

    dx = np.zeros((N, 2), np.float32)
    DX_LOG = []
    for L in LINES:
        t = TAKES[L["id"]]
        p = PLACE[L["id"]]
        x, sr = sf.read(P(p["file"]), dtype="float64", always_2d=True)
        assert sr == SR, (p["file"], sr)
        x = x.mean(axis=1)
        dev = t.get("device")
        os_ = bool(L["os"])
        g = DX_TRIM_DB.get(L["id"], 0.0) + (OS_DRY_DB if (os_ and not dev) else 0.0)
        pan = DX_PAN.get(L["id"], 0.0)
        s0 = int(round(p["file_s"] * SR))
        add(dx, panv(np.column_stack([x, x]) * db(g), pan).astype(np.float32), s0)
        room = room_for(L, t)
        send = None
        if room:
            send = ROOMS[room]["send"] + (DEVICE_SEND_DB if dev else (OS_SEND_DB if os_ else 0.0))
            h = IR[room]
            wet = np.column_stack([signal.fftconvolve(x, h[:, 0]), signal.fftconvolve(x, h[:, 1])]) * db(send + g)
            add(dx, panv(wet, pan * 0.5).astype(np.float32), s0)
        DX_LOG.append(OrderedDict(id=L["id"], who=L["who"], shot=L["shot"], text=L["text"], file=p["file"],
                                  file_act_s=round(p["file_s"], 4), sample=s0, abs_in=L["abs_in"], abs_out=L["abs_out"],
                                  tc=tc(L["abs_in"]), mode=L["mode"], device=dev, os=os_, gain_db=g, pan=pan, room=room,
                                  room_send_db=send, take_lufs=t.get("qa", {}).get("lufs_i") if isinstance(t.get("qa"), dict) else None))
    print(f"[mix] dialogue: {len(DX_LOG)} takes laid ({time.time() - t_start:.0f} s)", flush=True)

    # ---------------------------------------------------------------------------------------- MUSIC
    TAIL_F = 0
    for cid, grp, t0 in MUSIC:
        info = sf.info(os.path.join(OST, "render", f"{cid}-underscore.wav"))
        TAIL_F = max(TAIL_F, int(math.ceil(t0 + info.frames / SPF)) - TOTAL)
    TAIL_F = max(0, TAIL_F)
    NT = (TOTAL + TAIL_F) * SPF                                  # the music buses run past the act into the tag

    # the lift of the held families under S1-S4's silent posts (per frame)
    lift_f = np.zeros(TOTAL + TAIL_F + 1)
    rp = LIFT_RAMP_S * FPS
    fr = np.arange(len(lift_f), dtype=float)
    for po in MAP_A["posts"]:
        a, b = po["a"], po["b"]
        v = max(po.get("lift_db", {}).get(f, 0.0) for f in HELD_FAMILIES)
        shape = np.clip(np.minimum((fr - (a - rp)) / rp, ((b + rp) - fr) / rp), 0, 1) * v
        lift_f = np.maximum(lift_f, shape)
    LIFT_LOG = [dict(a=po["a"], b=po["b"], tc=tc(po["a"]), text=po["text"], lift_db=po.get("lift_db")) for po in MAP_A["posts"]]

    bus_raw = {"A": np.zeros((NT, 2), np.float32), "B": np.zeros((NT, 2), np.float32)}
    MUSIC_LOG = []
    for cid, grp, t0 in MUSIC:
        cj = json.load(open(os.path.join(OST, "render", f"{cid}.cue.json")))
        stems = sorted(glob.glob(os.path.join(OST, "render", "stems", f"{cid}-*.flac")))
        fams = [os.path.basename(s)[len(cid) + 1:-5] for s in stems]
        s0 = t0 * SPF
        nmax = 0
        for fam, sp in zip(fams, stems):
            x, sr = sf.read(sp, dtype="float32", always_2d=True)
            assert sr == SR, (sp, sr)
            n = min(len(x), NT - s0)
            x = x[:n]
            if grp == "A" and fam in HELD_FAMILIES and lift_f.max() > 0:
                gl = db(np.interp((s0 + np.arange(n)) / SPF, fr, lift_f)).astype(np.float32)
                x = x * gl[:, None]
            bus_raw[grp][s0:s0 + n] += x
            nmax = max(nmax, n)
            del x
        MUSIC_LOG.append(OrderedDict(
            cue=cid, group=grp, composer="S1-S4" if grp == "A" else "S5-S8", act_frame_t0=t0, tc_in=tc(t0),
            act_frame_end=round(t0 + nmax / SPF, 1), seconds=round(nmax / SR, 3), families=fams,
            underscore=rel(os.path.join(OST, "render", f"{cid}-underscore.wav")),
            underscore_sha1=sha(os.path.join(OST, "render", f"{cid}-underscore.wav")),
            master_lufs=cj["masters"]["underscore"]["measured"]["lufs"], gain_db=0.0,
            duck_map=rel(MAP_A_PATH if grp == "A" else MAP_B_PATH),
            markers=sorted([dict(act=round(t0 + m["frame"], 1), label=m["label"]) for m in cj.get("markers", [])]
                           + [dict(act=round(e["act_frame"], 1), label="(act log) " + e["what"]) for e in (json.load(open(
                               os.path.join(OST, "render", f"{cid}.act-log.json")))["events"] if os.path.exists(
                               os.path.join(OST, "render", f"{cid}.act-log.json")) else [])], key=lambda m: m["act"]),
            sfx_slots=[dict(act=round(t0 + s_["t"] * FPS, 1), sfx=s_["sfx"]) for s_ in (cj.get("sfx_slots") or [])],
            warnings=cj.get("warnings", [])))
    print(f"[mix] music: {len(MUSIC)} cues from stems; tail {TAIL_F} f past the act ({time.time() - t_start:.0f} s)", flush=True)

    # the duck curves, in dB on a 1 ms control grid
    CR = 1000
    NMS = int(math.ceil(NT / SR * CR)) + 1
    ms_f = np.arange(NMS) / CR * FPS                             # act frame of each control point
    cA = np.zeros(TOTAL + TAIL_F + 1)
    ca = np.array(MAP_A["curve_db"], float)
    cA[:min(len(ca), len(cA))] = ca[:len(cA)]
    bp = np.array(MAP_B["curve_breakpoints"], float)
    cB = np.interp(np.arange(TOTAL + TAIL_F + 1), bp[:, 0], bp[:, 1], left=0.0, right=float(bp[-1, 1]))
    curve_ms = {"A": np.interp(ms_f, np.arange(len(cA)), cA), "B": np.interp(ms_f, np.arange(len(cB)), cB)}

    def slew(c):
        y = c.tolist()
        r, f = SLEW_RISE_DB_S / CR, SLEW_FALL_DB_S / CR
        for i in range(1, len(y)):                                # rises: no faster than r
            if y[i] > y[i - 1] + r:
                y[i] = y[i - 1] + r
        for i in range(len(y) - 2, -1, -1):                       # falls: no faster than f, begun early
            if y[i] > y[i + 1] + f:
                y[i] = y[i + 1] + f
        return np.array(y)

    def apply_gain(raw, gms, out=None, chunk=SR * 20):
        out = np.empty_like(raw) if out is None else out
        grid = np.arange(len(gms)) / CR
        for a in range(0, len(raw), chunk):
            b = min(len(raw), a + chunk)
            g = db(np.interp(np.arange(a, b) / SR, grid, gms)).astype(np.float32)
            out[a:b] = raw[a:b] * g[:, None]
        return out

    def music_bus(extra_ms):
        g = {k: slew(curve_ms[k] + extra_ms) for k in ("A", "B")}
        m = apply_gain(bus_raw["A"], g["A"])
        m += apply_gain(bus_raw["B"], g["B"])
        return m, g

    def line_windows():
        """each voiced line's speech window in 50 ms windows (from the stick timeline's first and last sound)"""
        out = []
        for L in LINES:
            p = PLACE[L["id"]]
            out.append((L, int(p["on_s"] * 20), max(int(p["on_s"] * 20) + 1, int(math.ceil(p["end_s"] * 20)))))
        return out

    LW = line_windows()
    Ld_dx = lev(dx)

    def dm_table(mus):
        Lm = lev(mus[:N])
        rows = []
        for L, a, b in LW:
            act = Ld_dx[a:b] > -45.0
            if not act.any():
                continue
            d_ = float(np.median(Ld_dx[a:b][act]))
            m_ = float(np.median(Lm[a:b][act]))
            rows.append(dict(id=L["id"], who=L["who"], a=a, b=b, dialogue_db=round(d_, 1), music_db=round(m_, 1),
                             dm=round(d_ - m_, 1), vo=TAKES[L["id"]]["kind"] == "vo"))
        return rows, Lm

    extra = np.zeros(NMS)
    mus, gcur = music_bus(extra)
    dm0, _ = dm_table(mus)
    TOPUP = []
    need = []
    for r in dm0:
        floor = DM_FLOOR_VO_DB if r["vo"] else DM_FLOOR_DB
        if r["music_db"] > -60 and r["dm"] < floor - TOPUP_MIN_DB:
            need.append((r, min(TOPUP_MAX_DB, floor - r["dm"])))
    for i, (r, dep) in enumerate(need):
        a_ms = max(0, int((r["a"] * 0.05 - 0.25) * CR))            # pre-duck 0.25 s ahead of the first sound
        b_ms = int((r["b"] * 0.05 + 0.1) * CR)                      # release from 0.1 s after the last
        extra[a_ms:b_ms] = np.minimum(extra[a_ms:b_ms], -dep)
        if i + 1 < len(need) and (need[i + 1][0]["a"] - r["b"]) * 0.05 < 2.5:   # hold across a short gap (no pumping)
            c_ms = int((need[i + 1][0]["a"] * 0.05 - 0.25) * CR)
            extra[b_ms:max(b_ms, c_ms)] = np.minimum(extra[b_ms:max(b_ms, c_ms)], -min(dep, need[i + 1][1]))
        TOPUP.append(dict(id=r["id"], who=r["who"], tc=tc(r["a"] * 1.2), dm_before=r["dm"], extra_db=round(-dep, 2)))
    if TOPUP:
        del mus
        mus, gcur = music_bus(extra)
    DM, Lm_pre = dm_table(mus)
    for t_ in TOPUP:
        t_["dm_after"] = next(r["dm"] for r in DM if r["id"] == t_["id"])
    print(f"[mix] duck: {len(TOPUP)} lines topped up; D/M median {np.median([r['dm'] for r in DM if r['music_db'] > -60]):.1f} dB "
          f"({time.time() - t_start:.0f} s)", flush=True)
    tail_mus = mus[N:].copy()
    mus = mus[:N].copy()
    del bus_raw
    GAIN_CURVES = {k: v for k, v in gcur.items()}

    # ---------------------------------------------------------------------------------------- EFFECTS
    DEV_SOS = {}
    for k, d in DEVICE.items():
        DEV_SOS[k] = np.vstack([sos("high", d["hp"], 4), sos("low", d["lp"], 4), peaking(*d["peak"])])

    def device_chain(y, kind):
        d = DEVICE[kind]
        if d["mono"]:
            m = signal.sosfilt(DEV_SOS[kind], y.mean(axis=1).astype(np.float64))
            return np.repeat(m[:, None], 2, axis=1).astype(np.float32)
        return signal.sosfilt(DEV_SOS[kind], y.astype(np.float64), axis=0).astype(np.float32)

    def ride_curve(points, s0, n):
        frr = np.array([p_[0] for p_ in points], float) * SPF - s0
        return db(np.interp(np.arange(n), frr, [p_[1] for p_ in points])).astype(np.float32)[:, None]

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
            y = device_chain(y, c["device"])
        g = c["gain_db"] + FX_TRIM_DB.get(c["id"], 0.0)
        y = panv(y, c["pan"]) * np.float32(db(g))
        s0 = c["place_frame"] * SPF
        if c["ride"]:
            y = y * ride_curve(c["ride"], s0, len(y))
        return y, s0, g

    fx = np.zeros((N, 2), np.float32)
    FX_LOG = []
    click = None
    for c in SHEET["cues"]:
        if c["optional"] and c["id"] not in OPTIONAL_ON:
            FX_LOG.append(OrderedDict(id=c["id"], sound=c["sound"], frame=c["frame"], laid=False, why="optional (off by default)"))
            continue
        y, s0, g = render_cue(c)
        add(fx, y, s0)
        if c["sound"] == "dialog_ok_click" and c["frame"] == D6_S:
            click = (y, s0)
        FX_LOG.append(OrderedDict(id=c["id"], sound=c["sound"], frame=c["frame"], tc=tc(c["frame"]), sample=int(round(s0)),
                                  gain_db=g, pan=c["pan"], device=c["device"], laid=True, label=c["label"],
                                  **({"optional_turned_on": OPTIONAL_ON[c["id"]]} if c["optional"] else {})))
    assert click is not None, "the Cancel click cue at D6 is missing from the sheet"
    print(f"[mix] effects: {sum(1 for r in FX_LOG if r['laid'])} laid, {sum(1 for r in FX_LOG if not r['laid'])} off "
          f"({time.time() - t_start:.0f} s)", flush=True)

    # ---------------------------------------------------------------------------------------- BEDS
    bg = np.zeros((N, 2), np.float32)
    BED_LOG = []
    for b in SHEET["beds"]:
        n = (b["out_frame"] - b["in_frame"]) * SPF
        loop, g = bed_loop(b)
        y = (tile(loop, n, b["offset_s"] * SR) * g).astype(np.float32)
        y = fades(y, b["fade_in_f"] * SPF, b["fade_out_f"] * SPF)
        if b["ride"]:
            y = y * ride_curve(b["ride"], b["in_frame"] * SPF, n)
        if b["pan"]:
            y = panv(y, b["pan"])
        add(bg, y, b["in_frame"] * SPF)
        BED_LOG.append(OrderedDict(id=b["id"], kind=b["kind"], a=b["in_frame"], b=b["out_frame"], tc_in=tc(b["in_frame"]),
                                   target_dbfs=b["target_dbfs_rms"], loop_gain_db=round(20 * math.log10(g), 2), pan=b["pan"],
                                   fade_in_f=b["fade_in_f"], fade_out_f=b["fade_out_f"], label=b["label"]))
        del loop
    ride_f = np.full(TOTAL + 1, BEDS_TRIM_DB)
    frr = np.arange(TOTAL + 1, dtype=float)
    for f0, f1, dB_, rin, rout, _ in REST_RIDES:
        ri, ro = max(rin * FPS, 1e-6), max(rout * FPS, 1e-6)
        up = np.clip((frr - f0) / ri, 0, 1) if rin else (frr >= f0).astype(float)
        dn = np.clip((f1 - frr) / ro, 0, 1)
        ride_f = np.maximum(ride_f, BEDS_TRIM_DB + dB_ * np.minimum(up, dn))
    for a in range(0, N, SR * 20):
        b = min(N, a + SR * 20)
        bg[a:b] *= db(np.interp(np.arange(a, b) / SPF, frr, ride_f)).astype(np.float32)[:, None]
    print(f"[mix] beds: {len(BED_LOG)}, bus {BEDS_TRIM_DB:+.1f} dB, {len(REST_RIDES)} rest rides ({time.time() - t_start:.0f} s)", flush=True)

    # ---------------------------------------------------------------------------------------- D6
    a6, b6 = D6_S * SPF, D6_E * SPF
    for bus in (dx, mus, fx, bg):
        bus[a6:b6] = 0.0
    keep = int(0.25 * SR)
    cy, cs0 = click
    seg = cy[:keep] * np.linspace(1, 0, min(keep, len(cy)), dtype=np.float32)[:, None]
    add(fx, seg, cs0)

    # ---------------------------------------------------------------------------------------- MASTER
    mix = dx + mus + fx + bg
    l0 = lufs_i(mix)
    G = TARGET_LUFS - l0
    lim, lim_db = limiter_gain(mix * np.float32(db(G)), CEILING_DBTP)
    l1 = lufs_i(mix * np.float32(db(G)) * lim[:, None])
    passes = 1
    while abs(l1 - TARGET_LUFS) > 0.05 and passes < 4:
        G += TARGET_LUFS - l1
        lim, lim_db = limiter_gain(mix * np.float32(db(G)), CEILING_DBTP)
        l1 = lufs_i(mix * np.float32(db(G)) * lim[:, None])
        passes += 1
    gl = (np.float32(db(G)) * lim)[:, None]
    del mix
    STEMS = OrderedDict(dialogue=dx * gl, music=mus * gl, effects=fx * gl, beds=bg * gl)
    del dx, mus, fx, bg
    mix = STEMS["dialogue"] + STEMS["music"] + STEMS["effects"] + STEMS["beds"]
    tail_mus = tail_mus * np.float32(db(G))
    print(f"[mix] master: {l0:.2f} LUFS raw -> gain {G:+.2f} dB, limiter {lim_db:.2f} dB, {passes} pass(es) "
          f"({time.time() - t_start:.0f} s)", flush=True)

    # ---------------------------------------------------------------------------------------- write
    os.makedirs(OUT, exist_ok=True)
    assert np.abs(mix).max() < 1.0
    sf.write(F_MIX, mix, SR, subtype="PCM_24")
    for k, arr in STEMS.items():
        sf.write(F_STEM[k], arr, SR, subtype="PCM_24", format="FLAC")
    sf.write(F_TAIL, tail_mus, SR, subtype="PCM_24", format="FLAC")
    print(f"[mix] wrote {rel(F_MIX)} + 4 stems + tail ({time.time() - t_start:.0f} s)", flush=True)

    # ============================================================================================ MEASUREMENTS
    xm, _ = sf.read(F_MIX, dtype="float32", always_2d=True)     # the file as written
    assert len(xm) == N
    fhs = [sf.SoundFile(F_STEM[k]) for k in F_STEM]
    resid_pk, pos = 0.0, 0
    while pos < N:
        m_ = min(SR * 20, N - pos)
        ssum = sum(f_.read(m_, dtype="float64", always_2d=True) for f_ in fhs)
        resid_pk = max(resid_pk, float(np.abs(xm[pos:pos + m_].astype(np.float64) - ssum).max()))
        pos += m_
    for f_ in fhs:
        f_.close()
    resid = float(todb(resid_pk))
    lufs = lufs_i(xm)
    tp = true_peak_db(xm)
    sp = float(todb(np.abs(xm).max()))
    kb = kblocks(xm)
    st = win_loud(kb, 30)                                        # short-term (3 s), 0.1 s hop
    mom = win_loud(kb, 4)                                        # momentary (400 ms)
    LUF = OrderedDict(integrated_lufs=round(lufs, 2), target_lufs=TARGET_LUFS, true_peak_dbtp=round(tp, 2),
                      true_peak_limit_dbtp=TP_LIMIT_DBTP, sample_peak_dbfs=round(sp, 2), lra_lu=round(lra(st), 1),
                      short_term_max_lufs=round(float(st.max()), 1), momentary_max_lufs=round(float(mom.max()), 1),
                      master_gain_db=round(G, 2), limiter_max_reduction_db=round(lim_db, 2),
                      limiter_active_ms=round(float(np.sum(lim < 0.9999)) / SR * 1000, 1), ceiling_dbtp=CEILING_DBTP,
                      stems_lufs=OrderedDict((k, round(lufs_i(v), 2)) for k, v in STEMS.items()),
                      stems_sum_vs_mix_residual_db=round(resid, 1))
    per_seq = OrderedDict()
    for q in LOCK["sequences"]:
        a, b = q["s"] * SPF, q["e"] * SPF
        per_seq[q["id"]] = dict(tc=tc(q["s"]), seconds=round((q["e"] - q["s"]) / FPS, 1), lufs=round(lufs_i(xm[a:b]), 1))
    L_mix, L_mono = lev(xm), lev(xm, "mono")
    L = {k: lev(v) for k, v in STEMS.items()}
    NWIN = len(L_mix)

    def fw(i):
        return i * W50 / SPF                                     # window index -> act frame

    # ---- designed silences and rests (from the composers' sheets), to tell design from accident
    DESIGNED = [(D6_S, D6_E, "D6: the Cancel click's designed digital silence (every bus muted; the click's first 0.25 s kept)")]
    for ns in CSA["no_score"]:
        if ns["f0"] != D6_S:
            DESIGNED.append((ns["f0"], ns["f1"], "S1-S4 no-score window: " + ns["what"]))
    for s_ in CSB["stops"]:
        if s_["act_f_out"] is not None:
            DESIGNED.append((s_["act_f_in"], s_["act_f_out"], f"S5-S8: {s_['what']} ({s_['cause']})"))
    DESIGNED.append((0, 49, "the act opens on the suite's room and the crane truck; the felt bar enters at act f 49 (S1-S4 cue sheet)"))
    DESIGNED.sort()

    def designed_at(f0, f1, tol=6):
        for a, b, lab in DESIGNED:
            if f0 < b + tol and f1 > a - tol:
                return lab
        return None

    # ---- 1. holes: the whole mix under -42 dBFS for 0.3 s or more (louder channel, and mono)
    def holes(Lx, name):
        out = []
        for a, b in runs(Lx < HOLE_DB):
            if b - a < int(HOLE_S * 20):
                continue
            fa, fb = fw(a), fw(b)
            sl = slice(a, b)
            if fa >= D6_S - 1 and fb <= D6_E + 1:
                cause = "designed: D6, the Cancel click's digital silence (every bus muted)"
            else:
                why = designed_at(fa, fb)
                cause = (f"UNEXPLAINED: beds {np.median(L['beds'][sl]):.1f}, music {np.median(L['music'][sl]):.1f}, "
                         f"effects {np.median(L['effects'][sl]):.1f} dBFS" + (f" (inside: {why})" if why else ""))
            out.append(OrderedDict(start_frame=round(fa, 1), end_frame=round(fb, 1), tc=tc(fa), seconds=round((b - a) / 20, 2),
                                   shot=shot_at(fa), level_dbfs=round(float(np.median(Lx[sl])), 1),
                                   min_dbfs=round(float(Lx[sl].min()), 1), measure=name, cause=cause))
        return out

    HOLES = dict(louder_channel=holes(L_mix, "louder channel"), mono_downmix=holes(L_mono, "mono (L+R)/2"))
    near = [OrderedDict(tc=tc(fw(a)), frame=round(fw(a), 1), seconds=round((b - a) / 20, 2), shot=shot_at(fw(a)),
                        level_dbfs=round(float(np.median(L_mix[a:b])), 1))
            for a, b in runs(L_mix < -40.0) if b - a >= 6 and not (D6_S - 2 <= fw(a) <= D6_E + 2)]
    d6_zero_from = D6_S * SPF + keep
    d6_rest_peak = float(todb(np.abs(xm[d6_zero_from:D6_E * SPF]).max()))
    D6M = OrderedDict(frames=[D6_S, D6_E], seconds=round((D6_E - D6_S) / FPS, 3),
                      click_peak_dbfs=round(float(todb(np.abs(xm[D6_S * SPF:d6_zero_from]).max())), 1),
                      after_click_peak_dbfs=round(d6_rest_peak, 1),
                      digital_zero_seconds=round((D6_E * SPF - d6_zero_from) / SR, 3) if d6_rest_peak < -200 else 0.0,
                      digital_silences_0p2s_plus=[OrderedDict(tc=tc(fw(a)), frame=round(fw(a), 1), seconds=round((b - a) / 20, 2))
                                                  for a, b in runs(L_mix < -100) if b - a >= 4],
                      room_from_buzz_to_s2=OrderedDict(frames=[D6_E, 1178], beds_median_dbfs=round(float(np.median(
                          L["beds"][int(D6_E * SPF / W50):int(1178 * SPF / W50)])), 1),
                          music_peak_dbfs=round(float(todb(np.abs(STEMS["music"][D6_E * SPF:1178 * SPF]).max())), 1)))

    # ---- 2. abrupt level jumps (> 15 dB between adjacent 50 ms windows)
    SFX_F = sorted((r["frame"], r["label"], r["sound"]) for r in FX_LOG if r["laid"])
    MARKS = sorted((m["act"], c["cue"] + ": " + m["label"]) for c in MUSIC_LOG for m in c["markers"])
    BED_EDGES = sorted([(b_["a"], "bed in: " + b_["label"][:60]) for b_ in BED_LOG] + [(b_["b"], "bed out: " + b_["label"][:60]) for b_ in BED_LOG])
    PL = sorted((PLACE[l["id"]]["on_s"] * FPS, PLACE[l["id"]]["end_s"] * FPS, l) for l in LINES)

    def near_sfx(f, tol=3.0):
        c = [(abs(g - f), lab, nm) for g, lab, nm in SFX_F if -tol <= f - g <= tol + 1]
        return min(c)[1:] if c else None

    def near_line(f):
        for a, b, l in PL:
            if abs(a - f) <= 3 or abs(b - f) <= 4:
                return l, ("onset" if abs(a - f) <= 3 else "end")
        for a, b, l in PL:
            if a - 2 <= f <= b + 2:
                return l, "inside"
        return None, None

    def jumps(Lx, floor=-60.0):
        out = []
        for i in range(1, len(Lx)):
            d = Lx[i] - Lx[i - 1]
            if abs(d) <= JUMP_DB or max(Lx[i], Lx[i - 1]) < floor:
                continue
            f = fw(i)
            deltas = {k: L[k][i] - L[k][i - 1] for k in L}
            lead = max(deltas, key=lambda k: abs(deltas[k]) if np.sign(deltas[k]) == np.sign(d) else -1)
            cause = None
            if D6_S - 1 <= f <= D6_S + 8 or D6_E - 2 <= f <= D6_E + 3:
                cause = "D6 boundary (designed: the Cancel click / the phone's buzz)"
            elif lead == "effects":
                s_ = near_sfx(f)
                cause = f"effect: {s_[1]} ({s_[0][:70]})" if s_ else None
            elif lead == "dialogue":
                l, kind = near_line(f)
                if l is not None:
                    cause = (f"dialogue {kind}: {l['id']} {l['who']}" if kind != "inside" else
                             f"speech inside {l['id']} {l['who']}: a word after a pause over the floor (natural)")
            elif lead == "music":
                mk = [lab for g, lab in MARKS if abs(g - f) <= 4]
                dz = designed_at(f - 2, f + 2, tol=3)
                cause = f"music: {mk[0][:90]}" if mk else (f"music: {dz[:90]}" if dz else None)
            elif lead == "beds":
                be = [lab for g, lab in BED_EDGES if abs(g - f) <= 3]
                cause = be[0] if be else None
            out.append(OrderedDict(frame=round(f, 1), tc=tc(f), shot=shot_at(f), delta_db=round(float(d), 1),
                                   from_db=round(float(Lx[i - 1]), 1), to_db=round(float(Lx[i]), 1), led_by=lead,
                                   cause=cause or f"UNEXPLAINED (led by {lead})"))
        return out

    JL = jumps(L_mix)
    JM = jumps(L_mono, floor=-1e9)

    def jump_summary(J):
        by = OrderedDict()
        for j in J:
            k = ("designed (D6)" if j["cause"].startswith("D6") else "dialogue onset/end" if j["cause"].startswith("dialogue")
                 else "speech inside a line (natural)" if j["cause"].startswith("speech") else "effect hit" if j["cause"].startswith("effect")
                 else "music (a marker or a designed stop)" if j["cause"].startswith("music") else "bed edge" if j["cause"].startswith("bed")
                 else "UNEXPLAINED")
            by[k] = by.get(k, 0) + 1
        return OrderedDict(count=len(J), up=sum(1 for j in J if j["delta_db"] > 0), down=sum(1 for j in J if j["delta_db"] < 0),
                           by_cause=by, unexplained=[j for j in J if j["cause"].startswith("UNEXPLAINED")], list=J)

    # the music bus's own edges: steps over 10 dB between 50 ms windows
    mus_steps = []
    for i in range(1, NWIN):
        d = L["music"][i] - L["music"][i - 1]
        if abs(d) <= 10 or max(L["music"][i], L["music"][i - 1]) < -55:
            continue
        f = fw(i)
        mk = [lab for g, lab in MARKS if abs(g - f) <= 4]
        mus_steps.append(OrderedDict(frame=round(f, 1), tc=tc(f), shot=shot_at(f), delta_db=round(float(d), 1),
                                     cause=(mk[0][:100] if mk else (designed_at(f - 2, f + 2, 3) or "a note's attack or decay"))))

    # ---- 3. music runs and stops (the music stem as mixed: ducked, mastered)
    on = L["music"] > MUSIC_ON_DB
    mr = []
    for a, b in runs(on):
        if mr and a - mr[-1][1] < 4:                             # a gap under 0.2 s is not a stop
            mr[-1] = (mr[-1][0], b)
        else:
            mr.append((a, b))
    MRUNS = [OrderedDict(start_frame=round(fw(a), 1), end_frame=round(fw(b), 1), tc_in=tc(fw(a)), tc_out=tc(fw(b)),
                         seconds=round((b - a) / 20, 2), shot_in=shot_at(fw(a)), shot_out=shot_at(fw(b) - 1)) for a, b in mr]
    MSTOPS = []
    edges = [(0, mr[0][0])] if mr and mr[0][0] > 0 else []
    edges += [(b0, a1) for (_, b0), (a1, _) in zip(mr, mr[1:])]
    if mr and mr[-1][1] < NWIN - 1:
        edges.append((mr[-1][1], NWIN))
    for b0, a1 in edges:
        fa, fb = fw(b0), fw(a1)
        MSTOPS.append(OrderedDict(start_frame=round(fa, 1), end_frame=round(fb, 1), tc=tc(fa), seconds=round((a1 - b0) / 20, 2),
                                  shot=shot_at(fa), cause=designed_at(fa, fb) or "UNEXPLAINED"))
    frags = [r for r in MRUNS if r["seconds"] < 2.0]

    # ---- 4. dialogue over music per line, and the effects against the dialogue
    DMR = []
    for r in DM:
        DMR.append(OrderedDict(id=r["id"], who=r["who"], tc=tc(r["a"] * 1.2), dialogue_over_music_db=r["dm"],
                               music_dbfs_premaster=r["music_db"], vo=r["vo"]))
    dmv = np.array([r["dm"] for r in DM if r["music_db"] > -60])
    hw = int(0.3 * SR)
    FXD, FX_GAP = [], []
    for r in FX_LOG:                                              # each hit's first 300 ms, in 50 ms windows
        if not r["laid"]:
            continue
        i0 = int(round(r["frame"] * SPF / W50))
        i1 = min(NWIN, i0 + hw // W50)
        in_line = [l["id"] for l in LINES if PLACE[l["id"]]["on_s"] * 20 < i1 and PLACE[l["id"]]["end_s"] * 20 > i0]
        if not in_line:
            continue
        act = L["dialogue"][i0:i1] > -40.0                        # speech actually sounding under the hit
        if not act.any():
            FX_GAP.append(OrderedDict(id=r["id"], sound=r["sound"], tc=r["tc"], line=in_line[0],
                                      what="in a gap inside or beside the line: no speech sounds under the hit"))
            continue
        d_ = float(np.median(L["dialogue"][i0:i1][act]))
        s_ = float(np.median(L["effects"][i0:i1][act]))
        FXD.append(OrderedDict(id=r["id"], sound=r["sound"], tc=r["tc"], line=in_line[0], dialogue_dbfs=round(d_, 1),
                               effect_dbfs=round(s_, 1), effect_under_dialogue_db=round(d_ - s_, 1)))
    FXD.sort(key=lambda r: r["effect_under_dialogue_db"])

    # ---- 5. beds as heard where they are exposed
    BEDM = []
    for b_ in BED_LOG:
        a, b = int(b_["a"] * SPF / W50) + 4, int(b_["b"] * SPF / W50) - 4
        if b <= a:
            continue
        exp_ = (L["dialogue"][a:b] < -50) & (L["music"][a:b] < -50) & (L["effects"][a:b] < -50)
        BEDM.append(OrderedDict(id=b_["id"], kind=b_["kind"], tc_in=b_["tc_in"], target_dbfs=b_["target_dbfs"],
                                bed_median_dbfs=round(float(np.median(L["beds"][a:b])), 1),
                                exposed_seconds=round(float(np.sum(exp_)) / 20, 2),
                                exposed_floor_dbfs=round(float(np.median(L_mix[a:b][exp_])), 1) if exp_.any() else None,
                                exposed_floor_mono_dbfs=round(float(np.median(L_mono[a:b][exp_])), 1) if exp_.any() else None))

    # ---- 6. the score's own SFX slots against the SFX sheet (does each hit the composer wrote around have its effect?)
    SLOTS = []
    for c in MUSIC_LOG:
        for s_ in c["sfx_slots"]:
            best = min(SFX_F, key=lambda z: abs(z[0] - s_["act"]))
            SLOTS.append(OrderedDict(cue=c["cue"], act=s_["act"], tc=tc(s_["act"]), slot=s_["sfx"][:70],
                                     nearest_effect=best[2], nearest_frame=best[0], offset_frames=round(best[0] - s_["act"], 1)))

    # ---- 7. per sequence
    for q in LOCK["sequences"]:
        a, b = int(q["s"] * SPF / W50), int(q["e"] * SPF / W50)
        per_seq[q["id"]].update(music_on_pct=round(float(np.mean(on[a:b])) * 100, 1),
                                dialogue_active_pct=round(float(np.mean(L["dialogue"][a:b] > -45)) * 100, 1),
                                bed_median_dbfs=round(float(np.median(L["beds"][a:b])), 1),
                                music_median_dbfs=round(float(np.median(L["music"][a:b][on[a:b]])), 1) if on[a:b].any() else None,
                                short_term_max_lufs=round(float(st[int(q["s"] / FPS * 10):max(int(q["s"] / FPS * 10) + 1, int(q["e"] / FPS * 10) - 29)].max()), 1))

    MEAS = OrderedDict(
        honesty="Measured on the files written, not heard. Every flagged spot needs an ear.",
        loudness=LUF, per_sequence=per_seq, d6=D6M,
        holes_0p3s_under_42dbfs=OrderedDict(
            louder_channel=OrderedDict(count=len(HOLES["louder_channel"]), seconds=round(sum(h["seconds"] for h in HOLES["louder_channel"]), 2),
                                       unexplained=sum(1 for h in HOLES["louder_channel"] if h["cause"].startswith("UNEXPLAINED")),
                                       list=HOLES["louder_channel"]),
            mono_downmix=OrderedDict(count=len(HOLES["mono_downmix"]), seconds=round(sum(h["seconds"] for h in HOLES["mono_downmix"]), 2),
                                     unexplained=sum(1 for h in HOLES["mono_downmix"] if h["cause"].startswith("UNEXPLAINED")),
                                     list=HOLES["mono_downmix"]),
            near_holes_under_40dbfs_louder=near),
        jumps_over_15db=OrderedDict(louder_channel=jump_summary(JL), mono_downmix=jump_summary(JM)),
        music=OrderedDict(on_threshold_dbfs=MUSIC_ON_DB, runs=len(MRUNS), fragments_under_2s=frags,
                          audible_pct=round(float(np.mean(on)) * 100, 1), run_list=MRUNS, stops=MSTOPS,
                          unexplained_stops=[s_ for s_ in MSTOPS if s_["cause"] == "UNEXPLAINED"],
                          bus_steps_over_10db=mus_steps),
        dialogue_over_music=OrderedDict(floor_db=DM_FLOOR_DB, floor_vo_db=DM_FLOOR_VO_DB, median_db=round(float(np.median(dmv)), 1),
                                        p10_db=round(float(np.percentile(dmv, 10)), 1), min_db=round(float(dmv.min()), 1),
                                        topped_up=TOPUP, per_line=DMR),
        effects_against_dialogue=OrderedDict(
            method="each laid effect whose first 300 ms overlaps a line's speech window: the median of (dialogue - effects) "
                   "over the 50 ms windows where the speech sounds (louder channel)",
            on_speech=len(FXD), closest=FXD[:12], within_6db=[r for r in FXD if r["effect_under_dialogue_db"] < 6],
            in_gaps_of_lines=FX_GAP, all_on_speech=FXD),
        beds=BEDM, score_sfx_slots=SLOTS,
    )

    # ---- the cues file
    CUES = OrderedDict(
        what="Ep1 Act Four v5 final mix: what was laid where, the mixer's decisions, and the measurements",
        generator=rel(__file__), made=time.strftime("%Y-%m-%dT%H:%M:%S"), sample_rate=SR, fps=FPS, act_frames=TOTAL,
        honesty="Nothing here was heard. The numbers are measured on the written files; a person must listen (mix-v5.md).",
        inputs=OrderedDict(lock=dict(path=rel(LOCK_PATH), sha1=sha(LOCK_PATH)), timeline=dict(path=rel(REEL_PATH), sha1=sha(REEL_PATH)),
                           takes=dict(path=rel(TAKES_PATH), sha1=sha(TAKES_PATH)),
                           sfx_sheet=dict(path=rel(SHEET_PATH), sha1=sha(SHEET_PATH), lock_sha1_in_sheet=SHEET["meta"]["lock_sha1"]),
                           duck_maps=[dict(path=rel(MAP_A_PATH), sha1=sha(MAP_A_PATH)), dict(path=rel(MAP_B_PATH), sha1=sha(MAP_B_PATH))],
                           cue_sheets=[dict(path=rel(SHEET_A_PATH), sha1=sha(SHEET_A_PATH)), dict(path=rel(SHEET_B_PATH), sha1=sha(SHEET_B_PATH))]),
        clock=CLOCK,
        outputs=OrderedDict(mix=rel(F_MIX), stems={k: rel(v) for k, v in F_STEM.items()}, tail_music=rel(F_TAIL),
                            tail_frames=TAIL_F, tail_note="the score's ring past the act's last frame; lay it at act f 12443 (the tag's first frame)"),
        rules=OrderedDict(
            dialogue="every v5 take at its stick-timeline placement, unity on both channels; room early reflections as a send",
            music="six to-picture cues at 0 dB from stems; each composer's duck map on its own files; slew-limited "
                  f"(falls <= {SLEW_FALL_DB_S:.0f} dB/s, begun early; rises <= {SLEW_RISE_DB_S:.0f} dB/s); top-up to D/M "
                  f">= {DM_FLOOR_DB:.0f} dB ({DM_FLOOR_VO_DB:.0f} for the V.O.), at most {TOPUP_MAX_DB:.0f} dB",
            effects="the SFX sheet, its own conventions; its optional cues off except " + ", ".join(OPTIONAL_ON) + "; the mixer's "
                    "small-speaker chains for device cues",
            beds=f"the sheet's 19 beds at their RMS targets, faded and ridden as the sheet says; the bus {BEDS_TRIM_DB:+.1f} dB (the "
                 "master gain's compensation) and +2 dB inside three designed music-off windows",
            d6=f"act f {D6_S}-{D6_E}: every bus digital zero except the Cancel click's first 0.25 s",
            master=f"one gain to {TARGET_LUFS} LUFS integrated, a linked 4x-oversampled look-ahead limiter at {CEILING_DBTP} dBTP; "
                   "the same gain on every stem, so the stems sum to the mix"),
        rooms=OrderedDict((k, dict(taps_ms=list(v["taps"]), rt60_s=v["rt"], lowpass_hz=v["lp"], send_db=v["send"], what=v["what"]))
                          for k, v in ROOMS.items()),
        device_send_db=DEVICE_SEND_DB, os_send_db=OS_SEND_DB, os_dry_db=OS_DRY_DB,
        device_chains={k: dict(highpass_hz=v["hp"], lowpass_hz=v["lp"], peak=list(v["peak"]), mono=v["mono"], what=v["what"])
                       for k, v in DEVICE.items()},
        dialogue=DX_LOG, music=MUSIC_LOG, lifts_under_posts=LIFT_LOG, duck_topups=TOPUP,
        duck_curve_db_per_frame=OrderedDict(
            note="the music gain actually applied (after the slew and the top-ups), sampled once per act frame; group A = the "
                 "S1-S4 files, group B = the S5-S8 files",
            A=[round(float(v), 2) for v in np.interp(np.arange(TOTAL + TAIL_F + 1) / FPS * CR, np.arange(len(GAIN_CURVES["A"])), GAIN_CURVES["A"])],
            B=[round(float(v), 2) for v in np.interp(np.arange(TOTAL + TAIL_F + 1) / FPS * CR, np.arange(len(GAIN_CURVES["B"])), GAIN_CURVES["B"])]),
        effects=FX_LOG, beds=BED_LOG, beds_bus_trim_db=BEDS_TRIM_DB,
        beds_rest_rides=[dict(a=a, b=b, tc=tc(a), lift_db=d, ramp_in_s=ri, ramp_out_s=ro, what=w) for a, b, d, ri, ro, w in REST_RIDES],
        designed_stops_and_rests=[dict(a=a, b=b, tc=tc(a), what=w) for a, b, w in DESIGNED],
        master_gain_db_exact=float(G),
        measurements=MEAS,
    )
    json.dump(CUES, open(F_CUES, "w"), indent=1, ensure_ascii=False, default=float)
    print(f"[mix] measured ({time.time() - t_start:.0f} s)", flush=True)
    print(json.dumps(OrderedDict((k, LUF[k]) for k in ("integrated_lufs", "true_peak_dbtp", "lra_lu", "master_gain_db",
                                                        "limiter_max_reduction_db", "stems_lufs", "stems_sum_vs_mix_residual_db"))))
    print("holes louder/mono:", MEAS["holes_0p3s_under_42dbfs"]["louder_channel"]["count"], "/",
          MEAS["holes_0p3s_under_42dbfs"]["mono_downmix"]["count"], "unexplained:",
          MEAS["holes_0p3s_under_42dbfs"]["louder_channel"]["unexplained"], "/", MEAS["holes_0p3s_under_42dbfs"]["mono_downmix"]["unexplained"])
    print("jumps louder:", dict(MEAS["jumps_over_15db"]["louder_channel"]["by_cause"]), "mono:", dict(MEAS["jumps_over_15db"]["mono_downmix"]["by_cause"]))
    print("music runs", len(MRUNS), "stops", [(s_["tc"], s_["seconds"], s_["cause"][:40]) for s_ in MSTOPS], "fragments", len(frags))
    print("D/M median", MEAS["dialogue_over_music"]["median_db"], "p10", MEAS["dialogue_over_music"]["p10_db"], "min", MEAS["dialogue_over_music"]["min_db"],
          "topped up", len(TOPUP))
    print("effects on speech", len(FXD), "closest", [(r["id"], r["sound"], r["effect_under_dialogue_db"]) for r in FXD[:3]])
    print("D6", dict(D6M))
    import resource
    print(f"[mix] peak memory {resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6:.2f} GB; {time.time() - t_start:.0f} s", flush=True)
    del STEMS, mix, xm

# ================================================================================================ MUX
MUXLOG = OrderedDict()


def encode_mux(video, out, pre, mixp, expect_frames):
    """stream-copy the video; encode AAC-LC 256 kb/s (libfdk) from [pre-roll + the mix] piped as float32"""
    part = out + ".part"
    cmd = ["nice", "-n", "19", FF, "-hide_banner", "-loglevel", "error", "-y", "-i", video, "-f", "f32le", "-ar", str(SR), "-ac", "2",
           "-i", "pipe:0", "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "libfdk_aac", "-profile:a", "aac_low",
           "-b:a", "256k", "-metadata:s:a:0", "language=eng", "-metadata", "comment=MR. MAS Ep1 Act Four v5 final mix (mix_v5_final.py)",
           "-movflags", "+faststart", "-f", "mp4", part]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, env=FFENV)
    if pre is not None and len(pre):
        p.stdin.write(np.ascontiguousarray(pre, dtype="<f4").tobytes())
    with sf.SoundFile(mixp) as f:
        while True:
            blk = f.read(SR * 10, dtype="float32", always_2d=True)
            if not len(blk):
                break
            p.stdin.write(np.ascontiguousarray(blk, dtype="<f4").tobytes())
    p.stdin.close()
    rc = p.wait()
    assert rc == 0, f"ffmpeg failed ({rc}) for {out}"
    os.replace(part, out)
    nf = ffprobe_frames(out)
    assert nf[0] == expect_frames, (out, nf, expect_frames)
    return nf


def decoded_check(mp4, mixp, offset_samples):
    import io                                       # the bundled ffmpeg has no f32 output: a 24-bit WAV on a pipe
    r = subprocess.run(["nice", "-n", "19", FF, "-hide_banner", "-loglevel", "error", "-i", mp4, "-vn", "-ac", "2", "-ar", str(SR),
                        "-c:a", "pcm_s24le", "-f", "wav", "pipe:1"], capture_output=True, env=FFENV, check=True)
    a, _ = sf.read(io.BytesIO(r.stdout), dtype="float32", always_2d=True)
    del r
    m, _ = sf.read(mixp, dtype="float32", always_2d=True)
    act = a[offset_samples:offset_samples + len(m)]
    out = OrderedDict(decoded_samples=int(len(a)), expected_samples=int(offset_samples + len(m)))
    lags = []
    pts = [int(x) for x in np.linspace(40 * SR, len(m) - 40 * SR, 12)]
    srch = int(0.2 * SR)
    for c in pts:
        w = int(2 * SR)
        ref = m[c:c + w].mean(axis=1).astype(np.float64)
        seg = act[max(0, c - srch):c + w + srch].mean(axis=1).astype(np.float64)
        if np.sqrt(np.mean(ref ** 2)) < 1e-4 or len(seg) < len(ref):
            continue
        cc = signal.correlate(seg, ref, mode="valid", method="fft")
        k = int(np.argmax(cc))
        lag = k - (c - max(0, c - srch))
        nrm = float(cc[k] / (np.linalg.norm(ref) * np.linalg.norm(seg[k:k + w]) + 1e-12))
        lags.append(dict(tc=tc(c / SPF), lag_samples=lag, lag_ms=round(lag / SR * 1000, 3), corr=round(nrm, 3)))
    out["sync"] = lags
    out["max_abs_lag_ms"] = round(max(abs(x["lag_ms"]) for x in lags), 3) if lags else None
    out["decoded_act_lufs"] = round(lufs_i(act), 2)
    out["decoded_true_peak_dbtp"] = round(true_peak_db(act), 2)
    return out


if not args.no_mux:
    assert os.path.exists(F_MIX), "no mix to mux: run without --mux-only first"
    assert os.path.exists(F_CUES), "no cues file: run without --mux-only first"
    pre, pre_bed = preroll(json.load(open(F_CUES))["master_gain_db_exact"])
    nf, rate, w_, h_ = ffprobe_frames(STICK_MP4)
    assert nf == 72 + TOTAL, (STICK_MP4, nf)
    encode_mux(STICK_MP4, STICK_OUT, pre, F_MIX, nf)
    MUXLOG["stick"] = OrderedDict(picture=rel(STICK_MP4), picture_sha1=sha(STICK_MP4), frames=nf, size=f"{w_}x{h_}", out=rel(STICK_OUT),
                                  audio=f"72 f of pre-roll (the title card: silent, then {pre_bed}, the suite's room, pre-laps its last 0.75 s in loop phase) + the act mix from f 72",
                                  check=decoded_check(STICK_OUT, F_MIX, 72 * SPF))
    print("[mux] stick:", json.dumps(MUXLOG["stick"]["check"], default=float)[:400], flush=True)
    why = None
    if not os.path.exists(PIX_MP4):
        why = "the pixel preview picture does not exist yet"
    else:
        st1 = os.stat(PIX_MP4)
        if time.time() - st1.st_mtime < 180:
            why = "the pixel preview picture was modified in the last 3 minutes (a render may be writing it)"
        elif pics_open_by_any_process(PIX_MP4):
            why = "a process has the pixel preview picture open (a render may be writing it)"
        else:
            time.sleep(5)
            st2 = os.stat(PIX_MP4)
            if (st1.st_size, st1.st_mtime) != (st2.st_size, st2.st_mtime):
                why = "the pixel preview picture changed while being checked"
            elif ffprobe_frames(PIX_MP4)[0] != TOTAL:
                why = f"the pixel preview picture has {ffprobe_frames(PIX_MP4)[0]} frames, not {TOTAL}"
    if why is None:
        st1 = os.stat(PIX_MP4)
        nf, rate, w_, h_ = encode_mux(PIX_MP4, PIX_OUT, None, F_MIX, TOTAL)
        MUXLOG["pixel"] = OrderedDict(picture=rel(PIX_MP4), picture_sha1=sha(PIX_MP4), picture_mtime=time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(st1.st_mtime)),
                                      frames=nf, size=f"{w_}x{h_}", out=rel(PIX_OUT), audio="the act mix from f 0",
                                      check=decoded_check(PIX_OUT, F_MIX, 0))
        print("[mux] pixel:", json.dumps(MUXLOG["pixel"]["check"], default=float)[:400], flush=True)
    else:
        MUXLOG["pixel"] = OrderedDict(skipped=why)
        print("[mux] pixel skipped:", why, flush=True)
    if os.path.exists(F_CUES):
        cues = json.load(open(F_CUES), object_pairs_hook=OrderedDict)
        cues["mux"] = MUXLOG
        cues["mux"]["made"] = time.strftime("%Y-%m-%dT%H:%M:%S")
        json.dump(cues, open(F_CUES, "w"), indent=1, ensure_ascii=False, default=float)
