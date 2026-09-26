"""mix_v4.py - the Act Four v4 SOUND PASS: dialogue, the continuous score, the rooms and the SFX, to lock v4.

Guidance: show/bible/flow-and-continuity.md (guides, not gates) and edit-plan-v4 §5 (the sound plan).  What v3 did
and v4 does instead:

  MUSIC     v3 cut 33 fragments out of finished masters (no fades, 10 dry gaps).  v4 lays FIVE continuous to-picture
            renders, one per sequence or chapter, made for this lock by the OST engine from the batch-1 material
            (audio/ost/tracks/e01-act4-v4/, README there):
              S1a  THE PLAN (MM-07)                         act    0-555   (the tape-stop reaches zero on JOIN)
              S1b+S2 THE FALLING TILE (MM-08)               act  555-1298  (LEVERAGE one take; D6; 26A)
              S3+S4 THE BOARD'S SIDE + 09x (MM-09)          act 1298-3302  (one procedure; REVERSAL on the card)
              S5+S6 HIS SIDE / 745 (MM-10)                  act 3302-4628  (the dark-room pedal; the avalanche)
              S7+S8 THE RETURN (MM-11 + the STRAIGHT violin) act 4690-6453
            The designed stops live in the renders (D6, Gerg's glance, Mada's label, "Terms?"); everything else joins
            by a hand-off on a hit, a ring-out or a pre-lap.  The mix works from STEMS:
              THIN   under real lines, posts and the letter (record items) the melodic families (chip, brass, winds,
                     perc, drums) ride down ~15 dB over a beat before and come back over a beat after; strings,
                     bass, piano and pads hold (the renders already leave out melodic onsets there).
              DUCK   keyed from the dialogue and the record items: -9 dB under invented lines, -10/-11 under THE
                     PLAN's read and record items, -6 under V.O. (it sits inside the felt), -9 under the laptop's
                     "super.", -7 under Alyi's post (the violin IS the thinned colour); 60 ms attack (40 ms
                     look-ahead), 500 ms release, held through gaps under 1.2 s.
  ROOMS     one bed per location (TEMP beds: the sample files the SFX board has plus synthesised TEMP-SYNTH layers),
            at about -38 to -40 dBFS where exposed, crossfaded 0.25-1 s at changes, pre-lapped on time jumps.
  SFX       the board's files at the v4 picture's story marks (lock v4 marks and lines), synthesised stand-ins
            named TEMP-SYNTH where the board has nothing.
  D6        the one digital silence: every bus muted from the Cancel click to the phone's buzz (only the click's
            own transient survives).
  LEVELS    integrated about -16.5 LUFS and true peak <= -1 dBTP (v3: -16.6 LUFS, peak normalised to -1 dBFS).
  MEASURED  in the same run, on the file written: music runs and fragments, holes, jumps, dialogue gaps, D/M per line,
            beds per location, loudness, true peak.  Numbers are spotting tools, never gates; every flagged item has
            a cause in the cues file, and a human must still listen (nothing here was heard).

v4.1 (the finishing pass, 2026-09-26, after the flow audit of v4: production/act4/audit-v4.md and edit-plan-v4 §10):
  * UNVOICED POSTS no longer pull the whole mix down: the melody still leaves (the thin), but the duck under a post,
    a card or the letter is -3 dB (v4.0: -10), and the held families (strings, bass, piano, pads) lift +2 dB inside it.
    v4.0 dropped the mix 8-14 dB under every silent post and swelled it back between them (the audit's #1).
  * The duck holds across gaps up to 2.5 s (v4.0: 1.2 s), so it doesn't surge for a second between items.
  * Where the cue is already a pedal (S5, S7.01-S7.03, the coda from the lobby CU on), voiced lines duck -6.5 dB.
    THE PLAN's read ducks -8, Alyi's post -5 (the violin IS the thinned colour): v4.0 put the score 20-27 dB under them.
  * The S5 cue is laid -4 dB against its master (v4.0: -8): the reveals no longer play at the act's lowest level.
  * Stop 2 is a ring-out now (the cue's own change); the musical-chairs rest is gone (the cue's own change).
  * Every frame is a lock anchor or a v4.0 frame carried onto the new lock by w40() (the cues' own warp w(), common.py).

Outputs (out/ep01/act4/animatic/): act4-mix-v4.wav (48 kHz stereo 24-bit), act4-dialogue-premix-v4.wav (mono),
act4-mix-v4.cues.json (EDL + measurements), and studio/src/episodes/ep01/act4/animatic/sound-v4.ts (margin labels).
Run:  audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v4.py
"""
import json
import os
from collections import OrderedDict

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

REPO = "/home/jgon/project/art/mrmas"
P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
SR, FPS = 48000, 24
SPF = SR // FPS
OUT = P("out/ep01/act4/animatic")
LOCK = json.load(open(P("show/episodes/ep01/production/act4/shots-locked-v4.json")))
SH = OrderedDict((r["id"], r) for r in LOCK["shots"])
LN = {l["id"]: l for r in LOCK["shots"] for l in r["lines"]}
TOTAL = LOCK["summary"]["act_frames"]
N = TOTAL * SPF
SFXM = {x["id"]: x for x in json.load(open(P("audio/sfx/manifest.json")))}
CUES = P("audio/ost/tracks/e01-act4-v4/render")
FAMS = ['piano', 'strings', 'winds', 'brass', 'bass', 'drums', 'perc', 'chip', 'synth', 'fx']
MELODIC = ('chip', 'brass', 'winds', 'perc', 'drums')
rng = np.random.default_rng(7)


def A(sid, k=0):
    return SH[sid]["start_frame"] + k


def E(sid):
    return SH[sid]["end_frame"]


def Mk(sid, mark):
    return SH[sid]["start_frame"] + SH[sid]["marks"][mark]


def W(lid, w):
    l = LN[lid]
    for ww, f0, f1 in l["words"]:
        if ww.lower().strip(".,?!—-…\"'").startswith(w):
            return l["abs_in"] + f0
    raise KeyError((lid, w))


def db(g):
    return 10 ** (g / 20)


def todb(x):
    return 20 * np.log10(np.maximum(x, 1e-12))


_cache = {}


def load(path):
    if path not in _cache:
        x, sr = sf.read(path, dtype="float64", always_2d=True)
        assert sr == SR, (path, sr)
        if x.shape[1] == 1:
            x = np.repeat(x, 2, axis=1)
        _cache[path] = x[:, :2]
    return _cache[path]


def add(bus, x, s0):
    s0 = int(s0)
    if s0 >= len(bus):
        return
    if s0 < 0:
        x = x[-s0:]
        s0 = 0
    n = min(len(x), len(bus) - s0)
    bus[s0:s0 + n] += x[:n]


def ramp_curve(points, n=N):
    """piecewise-linear curve over samples from [(frame, value)]"""
    fs = [p[0] * SPF for p in points]
    return np.interp(np.arange(n), fs, [p[1] for p in points])


def tc(f):
    e = (12 * 60 + 31) * FPS + int(round(f))
    return f"{e // 1440:02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def shot_at(f):
    for r in LOCK["shots"]:
        if r["start_frame"] <= f < r["end_frame"]:
            return r["id"]
    return LOCK["shots"][-1]["id"]


def seq_at(f):
    for q in LOCK["sequences"]:
        if q["start_frame"] <= f < q["end_frame"]:
            return q["id"]
    return LOCK["sequences"][-1]["id"]


# ---- v4.1: v4.0 frame literals -> the current lock (the same warp the cues use: audio/ost/tracks/e01-act4-v4/common.py)
def _warp():
    old = json.load(open(P("audio/ost/tracks/e01-act4-v4/lock-v4.0.json")))
    OS = {s["id"]: s for s in old["shots"]}
    OL = {l["id"]: l for s in old["shots"] for l in s["lines"]}
    kn = []
    for sid, n in SH.items():
        o = OS.get(sid)
        if o is None:
            continue
        kn += [((OS["S6.05"] if sid == "S6.06" else o)["start_frame"], n["start_frame"]), (o["end_frame"], n["end_frame"])]
        for m, v in o["marks"].items():
            if m in n["marks"]:
                kn.append((o["start_frame"] + v, n["start_frame"] + n["marks"][m]))
    for lid, l in LN.items():
        if lid in OL:
            kn += [(OL[lid]["abs_in"], l["abs_in"]), (OL[lid]["abs_out"], l["abs_out"])]
    kn.sort()
    out, last = [], -1e9
    for a, b in kn:
        if (out and a <= out[-1][0]) or b < last:
            continue
        out.append((a, b))
        last = b
    return np.array([a for a, _ in out], float), np.array([b for _, b in out], float)


_WX, _WY = _warp()


def w40(f_old):
    """a v4.0 lock frame -> the current lock's frame"""
    return int(round(float(np.interp(f_old, _WX, _WY))))


# ================================================================================================ DIALOGUE
dlg = np.zeros(N)
LINES = []                                   # every voiced take as placed
for c in LOCK["audio_cues"]:
    x, sr = sf.read(P(c["file"]), dtype="float64", always_2d=False)
    assert sr == SR
    if x.ndim > 1:
        x = x.mean(axis=1)
    s0 = c["abs"] * SPF
    n = min(len(x), N - s0)
    dlg[s0:s0 + n] += x[:n] * db(c["gain_db"] or 0.0)
    l = LN[c["id"]]
    LINES.append(dict(id=c["id"], a=c["abs"], b=c["abs"] + int(np.ceil(len(x) / SPF)), speaker=c["speaker"],
                      mode=c["mode"], tag=l.get("tag") or "", text=c["text"]))
LINES.sort(key=lambda r: r["a"])

# ---- what each line / post is, for the duck and the thin (edit-plan-v4 §5.4)
def category(r):
    t = r["tag"]
    if r["id"] == "a4-30-03":                 # "hi.", eyes down: the floor's bloom steps further back for it
        return "small"
    if r["id"] == "a4-29-09":                 # Neleh inside the avalanche's composed window (plan §5.1 S6: -10)
        return "window"
    if r["id"] == "a4-27-00":
        return "laptop"
    if r["id"] == "a4-30-01":
        return "violin"
    if r["mode"] == "vo":
        return "vo"
    if r["id"] in ("a4-25-10b", "a4-25-11", "a4-25-12", "a4-25-13", "a4-25-02"):
        return "plan"
    if t.startswith("[V"):
        return "record"
    return "line"


DUCK_DB = dict(window=-10.0, small=-9.0, line=-9.0, plan=-8.0, record=-10.0, vo=-6.0, laptop=-9.0, violin=-5.0, post=-3.0,
               pedal=-6.5)
# v4.1: where the cue is already pared back to a pedal, a voiced line needs little room (the audit's #1: -6 to -8)
PEDAL_SHOTS = {s for s in SH if s.startswith("S5.") or s in ("S7.01", "S7.02", "S7.02b", "S7.03", "S8.04", "S8.05", "S8.06",
                                                               "S8.07", "S8.08", "S8.09", "S8.10")}
KEYS = []                                    # (a, b, depth dB, thin?, label)
for r in LINES:
    cat = category(r)
    thin = cat in ("record",)
    dep = DUCK_DB[cat]
    if shot_at(r["a"]) in PEDAL_SHOTS and cat not in ("vo", "violin"):
        dep = max(dep, DUCK_DB["pedal"])
    KEYS.append((r["a"], r["b"], dep, thin, f'{cat}: {r["id"]} {r["speaker"]}'))
for p in LOCK["posts"]:                      # the unvoiced posts on screen: record items
    KEYS.append((p["abs"], p["abs"] + p["frames"], DUCK_DB["post"], True, f'post: {p["id"]} {p["speaker"]}'))
for t in (t for s in LOCK["shots"] for t in s["texts"]):
    if t["kind"] == "post" and not any(abs(t["abs_in"] - k[0]) < 8 for k in KEYS):
        KEYS.append((t["abs_in"], t["abs_out"], DUCK_DB["post"], True, f'record text: {t["text"][:40]}'))
KEYS.sort()


# ================================================================================================ MUSIC (five continuous renders)
# (cue id, act frame of cue t = 0, level points [(act frame, dB)] relative to the cue's own underscore master, label)
_J = Mk("S1.06", "click")                    # JOIN: the plan's tape-stop reaches zero; LEVERAGE's first eighth
CUE_TABLE = [
    ("e01-act4-v4-s1-the-plan", 0, [(0, -3.5), (114, -3.5), (120, -5.5), (_J + 5, -5.5)],
     "MM-07 THE PLAN (S1a): the felt bar, WORD, the waltz, the labels, the break -> the tape-stop on JOIN"),
    ("e01-act4-v4-s1s2-the-falling-tile", _J, [(_J, 0.0), (A("S3.01"), 0.0)],
     "MM-08 THE FALLING TILE (S1b + S2): LEVERAGE one take -> D6 -> 26A (the felt, the pedal, the Rewind)"),
    ("e01-act4-v4-s3s4-the-boards-side", A("S3.01"), [(A("S3.01"), -1.0), (A("S5.01") - 8, -1.0), (A("S5.01"), -1.0), (A("S5.02") + 98, -1.0)],
     "MM-09 THE BOARD'S SIDE (S3 + S4) + 09x REVERSAL: one procedure, thinning under the record"),
    ("e01-act4-v4-s5s6-his-side-745", A("S5.02"), [(A("S5.02"), -4.0), (A("S6.06") + 90, -4.0)],
     "MM-10 HIS SIDE / 745 (S5 + S6): the dark-room pedal + the pulse; the Build; the avalanche -> dead stop on MADA's label (v4.1: -4 dB throughout, was -8 under S5)"),
    ("e01-act4-v4-s7s8-the-return", A("S7.01"), [(A("S7.01"), -1.5), (TOTAL, -1.5)],
     "MM-11 THE RETURN (S7 + S8): the violin -> the floor -> LEVERAGE -> the C pedal -> VICTORY LAP"),
]

# ---- thin windows: (a, b, families, depth dB); a positive depth is a lift (v4.1: the held families under a post)
THIN = []
HELD = ('strings', 'bass', 'piano', 'synth')
for a, b, dep, thin, lab in KEYS:
    if thin:
        THIN.append((a, b, MELODIC, -15.0, lab))
        if lab.startswith(("post:", "record text:")):
            THIN.append((a, b, HELD, +2.0, "lift under " + lab))
for lid in ("a4-25-10b", "a4-25-11", "a4-25-12", "a4-25-13", "a4-25-02"):   # THE PLAN's read: the music box steps back
    THIN.append((LN[lid]["abs_in"], LN[lid]["abs_out"], ("chip", "perc"), -4.0, f"plan read {lid}"))


def fam_gain(fam, thin_ramp=15):
    """per-sample gain for one family from the thin windows (a beat's ramp either side)"""
    pts = np.zeros(TOTAL + 1)
    lift = np.zeros(TOTAL + 1)
    for a, b, fams, dep, _ in THIN:
        if fam not in fams:
            continue
        lo, hi = max(0, a - thin_ramp), min(TOTAL, b + thin_ramp)
        for f in range(lo, hi + 1):
            if f < a:
                v = dep * (f - lo) / max(1, a - lo)
            elif f <= b:
                v = dep
            else:
                v = dep * (hi - f) / max(1, hi - b)
            if dep < 0:
                pts[f] = min(pts[f], v)
            else:
                lift[f] = max(lift[f], v)
    return np.interp(np.arange(N) / SPF, np.arange(TOTAL + 1), pts + lift)


FAM_G = {f: db(fam_gain(f)) for f in FAMS}


def duck_curve():
    """the duck: min over keyed windows, held across gaps under 2.5 s (v4.1; v4.0 1.2 s); 40 ms look-ahead, 60 ms / 500 ms"""
    tgt = np.zeros(TOTAL + 1)
    ks = sorted(KEYS)
    hold = int(2.5 * FPS)
    for i, (a, b, dep, _, _) in enumerate(ks):
        b2 = b
        for a2, _, dep2, _, _ in ks[i + 1:]:
            if a2 - b <= hold and a2 >= b:
                b2 = max(b2, a2)
                break
        lo, hi = max(0, a - 1), min(TOTAL, b2 + 1)
        tgt[lo:hi] = np.minimum(tgt[lo:hi], dep)
    g = db(np.interp(np.arange(N) / SPF, np.arange(TOTAL + 1), tgt))
    att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.5 * SR))
    sm = np.empty(N)
    v = 1.0
    for i in range(0, N, 48):
        t = g[i]
        c = att if t < v else rel
        v = t + (v - t) * (c ** 48)
        sm[i:i + 48] = v
    return sm


DUCK = duck_curve()
mus = np.zeros((N, 2))
mus_raw = np.zeros((N, 2))                   # before the duck (for the D/M and the music-run measures)
MUSIC_LOG = []
for cid, f0, pts, label in CUE_TABLE:
    cs = json.load(open(os.path.join(CUES, f"{cid}.cue.json")))
    s0 = f0 * SPF
    stems = {}
    for fam in FAMS:
        sp = os.path.join(CUES, "stems", f"{cid}-{fam}.flac")
        if os.path.exists(sp):
            stems[fam] = load(sp)
    n = min(max(len(x) for x in stems.values()), N - s0)
    y = np.zeros((n, 2))
    for fam, x in stems.items():
        m = min(len(x), n)
        y[:m] += x[:m] * FAM_G[fam][s0:s0 + m, None]
    lev = db(ramp_curve(pts, N)[s0:s0 + n])[:, None]
    y = y * lev
    add(mus_raw, y, s0)
    MUSIC_LOG.append(dict(cue=cid, file=f"audio/ost/tracks/e01-act4-v4/render/{cid}-underscore.wav",
                          stems=f"audio/ost/tracks/e01-act4-v4/render/stems/{cid}-*.flac", act_in=f0, tc_in=tc(f0),
                          act_out=min(TOTAL, f0 + int(np.ceil(n / SPF))), seconds=round(n / SR, 2),
                          families=list(stems), level_points_db=pts, label=label,
                          underscore_lufs=cs["masters"]["underscore"]["measured"]["lufs"],
                          sections=[dict(label=x["label"], act_in=round(f0 + x["start"]["frame"]),
                                         act_out=round(f0 + x["end"]["frame"])) for x in cs.get("sections", [])],
                          markers=[dict(act=round(f0 + m["frame"], 1), label=m["label"]) for m in cs.get("markers", [])]
                          if cs.get("markers") and isinstance(cs["markers"][0], dict) and "frame" in cs["markers"][0] else [],
                          warnings=cs.get("warnings", [])))
mus = mus_raw * DUCK[:, None]


# ================================================================================================ SFX
sfx = np.zeros((N, 2))
SFX_LOG = []


def sfile(name):
    return P("audio/sfx", SFXM[name]["file"])


def fade(x, fin, fout):
    x = x.copy()
    n = len(x)
    if fin > 0:
        k = min(n, fin)
        x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout > 0:
        k = min(n, fout)
        x[n - k:] *= np.linspace(1, 0, k)[:, None]
    return x


def panv(x, pan):
    return x * np.array([1 - max(0, pan), 1 + min(0, pan)]) if pan else x


def hit(f, name, gdb=None, label=None, rev=False, dur=None, pan=0.0, lp=None):
    """a board SFX at act frame f (its own mixDb unless given)"""
    x = load(sfile(name)).copy()
    if rev:
        x = x[::-1]
    if dur:
        x = fade(x[: int(dur * SR)], 0, int(0.03 * SR))
    if lp:
        x = signal.sosfilt(signal.butter(2, lp, 'low', fs=SR, output='sos'), x, axis=0)
    gg = SFXM[name].get("mixDb", -10) if gdb is None else gdb
    add(sfx, panv(x, pan) * db(gg), int(round(f * SPF)))
    SFX_LOG.append(dict(f=int(round(f)), tc=tc(f), name=name, gain_db=gg, label=label or name, synth=False))


def synth(f, kind, gdb=-14.0, label=None, pan=0.0, **kw):
    x = SYN[kind](**kw)
    x = np.column_stack([x, x]) if x.ndim == 1 else x
    add(sfx, panv(x, pan) * db(gdb), int(round(f * SPF)))
    SFX_LOG.append(dict(f=int(round(f)), tc=tc(f), name=f"TEMP-SYNTH:{kind}", gain_db=gdb, label=label or kind, synth=True))


t = lambda d: np.arange(int(d * SR)) / SR  # noqa: E731


def env(n, a=0.002, d=0.1):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / a) * np.exp(-tt / d)


def _noise(n):
    return rng.standard_normal(n)


def _bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def _lpf(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def _hpf(x, hz, order=2):
    return signal.sosfilt(signal.butter(order, hz, 'high', fs=SR, output='sos'), x, axis=0)


def syn_buzz(d=0.45):  # a phone buzzing on wood
    tt = t(d)
    s = np.sign(np.sin(2 * np.pi * 150 * tt)) * 0.5 + np.sin(2 * np.pi * 300 * tt) * 0.3
    s *= 0.6 + 0.4 * (np.sin(2 * np.pi * 25 * tt) > 0)
    return _lpf(s, 2500) * np.minimum(1, tt / 0.01) * np.minimum(1, (d - tt) / 0.03) * 0.35


def syn_clack(d=0.18):  # a phone's clack off a table
    tt = t(d)
    return (np.sin(2 * np.pi * 180 * tt) * env(len(tt), 0.001, 0.04) + _hpf(_noise(len(tt)), 2000) * env(len(tt), 0.0005, 0.012) * 0.6) * 0.8


def syn_tick(d=0.05):  # a pencil tick
    tt = t(d)
    return _hpf(_noise(len(tt)), 3000) * env(len(tt), 0.0003, 0.006) * 0.9


def syn_scribble(d=0.6):  # pencil / pen strokes
    tt = t(d)
    n = _bp(_noise(len(tt)), 1500, 7000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * tt)))
    return n * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.05) * 0.3


def syn_jangle(d=0.5):  # a key ring
    tt = t(d)
    s = np.zeros(len(tt))
    for j in range(7):
        o = int(rng.uniform(0, d * 0.6) * SR)
        for fr in (3100, 4700, 6200, 8300):
            f2 = fr * rng.uniform(0.95, 1.05)
            k = np.arange(len(tt) - o) / SR
            s[o:] += np.sin(2 * np.pi * f2 * k) * np.exp(-k / 0.05) * 0.08
    return s


def syn_thunk(d=0.35, f0=90):  # a soft heavy thump
    tt = t(d)
    return (np.sin(2 * np.pi * f0 * tt * (1 - 0.3 * tt)) * env(len(tt), 0.002, 0.09) + _lpf(_noise(len(tt)), 400) * env(len(tt), 0.001, 0.03)) * 0.9


def syn_whir(d=0.9):  # the rack slot's motor
    tt = t(d)
    f = 380 + 220 * np.minimum(1, tt / 0.3)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + _lpf(_noise(len(tt)), 1500) * 0.2) * np.minimum(1, tt / 0.05) * np.minimum(1, (d - tt) / 0.1) * 0.5


def syn_tones(d=0.2, n=1):  # a speakerphone dual tone
    tt = t(d)
    pairs = [(697, 1209), (770, 1336), (852, 1477), (941, 1633)]
    a, b = pairs[n % 4]
    return (np.sin(2 * np.pi * a * tt) + np.sin(2 * np.pi * b * tt)) * 0.18 * np.minimum(1, (d - tt) / 0.01) * np.minimum(1, tt / 0.005)


def syn_dialtone(d=4.0):  # the left pane's dial tone (350 + 440 Hz), through a speakerphone
    tt = t(d)
    s = (np.sin(2 * np.pi * 350 * tt) + np.sin(2 * np.pi * 440 * tt)) * 0.15
    return _bp(s, 300, 3000) * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.05)


def syn_ring(d=1.0):  # a desk phone ringing (chip-ish): bursts of a warbled tone
    tt = t(d)
    w = np.sign(np.sin(2 * np.pi * (880 + 90 * np.sign(np.sin(2 * np.pi * 20 * tt))) * tt)) * 0.12
    gate = ((tt % 0.5) < 0.35).astype(float)
    return _lpf(w * gate, 5000)


def syn_ting(d=0.6, f0=2900):  # a glass ting
    tt = t(d)
    return (np.sin(2 * np.pi * f0 * tt) + 0.5 * np.sin(2 * np.pi * f0 * 2.76 * tt)) * np.exp(-tt / 0.12) * 0.25


def syn_truck(d=2.4):  # the crane truck's diesel grind, passing far below
    tt = t(d)
    base = np.sin(2 * np.pi * 48 * tt) * 0.4 + _lpf(_noise(len(tt)), 250) * 1.2
    return base * np.sin(np.pi * tt / d) * 0.5


def syn_air(d=0.2):  # the whip's air pass
    tt = t(d)
    return _lpf(_noise(len(tt)), 3000) * np.sin(np.pi * tt / d) ** 2 * 0.35


def syn_squeak(d=0.25, f0=1900):  # a screw / a marker squeak
    tt = t(d)
    return np.sin(2 * np.pi * (f0 + 300 * np.sin(2 * np.pi * 9 * tt)) * tt) * np.sin(np.pi * tt / d) * 0.12


def syn_pin(d=0.4):  # the pin's clink
    tt = t(d)
    return (np.sin(2 * np.pi * 3400 * tt) + 0.6 * np.sin(2 * np.pi * 5100 * tt)) * np.exp(-tt / 0.06) * 0.2


def syn_step(d=0.09, f0=140):  # a shoe on the lobby's polished floor
    tt = t(d)
    return (np.sin(2 * np.pi * f0 * tt) * env(len(tt), 0.001, 0.02) + _hpf(_noise(len(tt)), 1500) * env(len(tt), 0.0005, 0.008) * 0.5) * 0.7


def syn_stress(d=0.35, f0=5200):  # glass under strain
    tt = t(d)
    tink = (np.sin(2 * np.pi * f0 * tt) + 0.6 * np.sin(2 * np.pi * f0 * 1.51 * tt)) * np.exp(-tt / 0.025)
    return (tink + _hpf(_noise(len(tt)), 4000) * env(len(tt), 0.0005, 0.015) * 0.8) * 0.3


def syn_sand(d=0.6):  # the sand falls
    tt = t(d)
    return _bp(_noise(len(tt)), 2500, 9000) * (0.6 + 0.4 * rng.random(len(tt))) * np.sin(np.pi * tt / d) * 0.25


def syn_spray(d=2.0):  # the extinguisher: a pressurised hiss, bursty
    tt = t(d)
    g = 0.7 + 0.3 * np.sin(2 * np.pi * 3.1 * tt) * np.sin(2 * np.pi * 0.7 * tt)
    return _bp(_noise(len(tt)), 1800, 9000) * g * np.minimum(1, tt / 0.03) * np.minimum(1, (d - tt) / 0.15) * 0.35


def syn_click(d=0.03):  # a small UI click
    tt = t(d)
    return _hpf(_noise(len(tt)), 2500) * env(len(tt), 0.0002, 0.003) * 0.8


SYN = dict(buzz=syn_buzz, clack=syn_clack, tick=syn_tick, scribble=syn_scribble, jangle=syn_jangle, thunk=syn_thunk,
           whir=syn_whir, tones=syn_tones, dialtone=syn_dialtone, ring=syn_ring, ting=syn_ting, truck=syn_truck,
           air=syn_air, squeak=syn_squeak, pin=syn_pin, step=syn_step, stress=syn_stress, sand=syn_sand,
           spray=syn_spray, click=syn_click)

# ---- S1: the suite, THE PLAN, the call
synth(0, "truck", -18, "the crane truck grinds past far below (every glass shivers)", d=3.2)
for i, kk in enumerate((18, 21, 25, 28)):
    synth(kk, "ting", -24, "glass tings (his doesn't)", f0=2600 + 380 * i)
hit(Mk("S1.02", "nudge"), "key_tap_soft_03", -24, "his glass nudged one pixel true")
synth(Mk("S1.02", "print"), "thunk", -20, "the glow prints to blueprint (a soft thump)", f0=70)
hit(Mk("S1.03", "stamp"), "rubber_stamp_C", -8, "WHO OWNS A CEO? (the stamp)")
for k in range(3):
    synth(Mk("S1.03", "three") + 15 * k, "tick", -18, "chair feet: one walks off a beat")
synth(Mk("S1.03", "four"), "scribble", -19, "the ring draws round the four", d=0.7)
synth(Mk("S1.03", "box"), "scribble", -21, "the box round the six", d=0.5)
synth(Mk("S1.03", "arrow"), "scribble", -18, "the arrow's long stroke", d=1.2)
synth(Mk("S1.04", "jangle"), "jangle", -17, "the key ring jangles, hopeful")
hit(Mk("S1.04", "votes"), "rubber_stamp_C", -7, "VOTES: 0 (on 'gets')")
hit(Mk("S1.04", "equity"), "rubber_stamp_C", -8, "EQUITY: 0 (on 'question')")
hit(Mk("S1.04", "moth"), "paper_flutter", -19, "the moth flies out of the box", dur=0.8)
for kk in (10, 14, 18, 22):
    synth(A("S1.05", kk), "tick", -23, "four tiny footsteps onto 1. NOON")
synth(A("S1.05", 22), "tick", -16, "step 1's tick (pencil)")
hit(Mk("S1.05", "curl"), "paper_flutter", -13, "the corner curls", dur=0.7)
hit(Mk("S1.05", "tear"), "paper_whip", -9, "the tear")
hit(Mk("S1.06", "click"), "dialog_ok_click", -8, "the trackpad click (JOIN)")
hit(A("S1.07"), "bell_ding_F6--chip", -21, "the call connects")
for kk in (4, 8, 12, 16):
    hit(A("S1.07", kk), "post_click--chip", -23, "vote icons (already flipped)")
hit(Mk("S1.07", "dialog"), "dialog_ok_click--chip", -16, "the dialog pops")
hit(A("S1.09"), "key_tap_soft_05", -28, "the ALYI cursor appears")
for m in ("step1", "step2"):
    hit(Mk("S1.09", m), "key_tap_soft_05", -26, "the pointer steps")
CLICK = Mk("S1.09", "click")
hit(CLICK, "dialog_ok_click", -4, "CANCEL (the click: D6 starts)")
BUZZ = A("S1.11")
synth(BUZZ, "buzz", -10, "the phone buzzes: the room comes back", d=0.5)
hit(BUZZ + 8, "key_tap_soft_02", -16, "the tap")
synth(Mk("S1.12", "fall"), "thunk", -26, "the room falls away (a soft palette step)", f0=60)
# ---- S2: the dark room, the count, TPOOL, the Rewind
for kk in (0, 15, 30, 45):
    synth(A("S2.01", kk), "scribble", -14, "the pen clip carves, one stroke a beat", d=0.28)
synth(Mk("S2.01", "brush"), "scribble", -22, "the shavings brushed away", d=0.4)
hit(Mk("S2.02", "mark1"), "orb_servo", -16, "the iris steps onto mark 1")
hit(Mk("S2.03", "front_in"), "render_front_sweep", -12, "the render front sweeps out of the mark (F1.2)")
hit(Mk("S2.03", "front_out"), "render_front_sweep", -15, "the front sweeps back into the wood", rev=True)
hit(Mk("S2.04", "mark2"), "orb_servo", -17, "mark 2")
hit(Mk("S2.04", "mark3"), "orb_servo", -16, "mark 3")
hit(Mk("S2.04", "thumb"), "orb_servo", -19, "the iris stops on his thumb")
hit(Mk("S2.05", "lift"), "orb_servo", -14, "the iris lifts to his face")
hit(A("S3.01") - 15, "tape_spinup", -13, "the Rewind (tape_spinup reversed) under the toast", rev=True)
synth(A("S3.01") - 3, "air", -16, "the whip's air pass")
# ---- S3: Neleh's desk, the all-hands, the night
synth(Mk("S3.02", "tick1"), "tick", -14, "1. NOON ticks")
synth(Mk("S3.02", "run0"), "scribble", -21, "her pen runs down what the fold hid", d=1.8)
hit(A("S3.03", 4), "post_click", -17, "the blog post loads")
synth(A("S3.04"), "tick", -14, "step 3 ticks (off picture), on the cut")
synth(A("S3.04", 64), "thunk", -24, "Rima's plate lands (soft)", f0=110)
hit(A("S3.05", 8), "post_click", -10, "Gerg's post: the call's notification")
hit(Mk("S3.05", "keys"), "keycap_popcorn", -11, "keycaps pop and rain across the grid")
hit(A("S3.09", 7), "post_click", -9, "his 9:32 post on her phone")
synth(A("S3.09", 7), "buzz", -15, "her phone buzzes face-up", d=0.4)
synth(A("S3.09", 50), "buzz", -22, "another phone buzzes off picture", d=0.32)
synth(A("S3.09", 90), "buzz", -20, "and another", d=0.32)
hit(Mk("S3.09", "tap"), "key_tap_soft_04", -18, "her pen taps EQUITY: 0")
# ---- S4: the boardroom
hit(A("S4.01"), "heart_gliss", -13, "the hearts pour (stacking)")
hit(Mk("S4.01", "bury"), "post_click", -12, "his eulogy post scrolls in")
hit(Mk("S4.01", "blue"), "bell_ding_F6--chip", -22, "one blue heart lands on Mada's spinner")
for kk, pn in ((0, -0.5), (3, -0.15), (6, 0.2), (9, 0.5)):
    synth(Mk("S4.02", "buzz") + kk, "buzz", -14, "four phones buzz and step (STAFF, STAFF, INVESTORS, STAFF)", pan=pn)
synth(A("S4.03", 10), "buzz", -18, "the phones ringing under 'it'", pan=-0.3)
synth(A("S4.03", 40), "buzz", -19, "buzz", pan=0.3)
synth(Mk("S4.04", "buzz"), "buzz", -14, "a buzz: one phone's corner over the edge")
synth(A("S4.06", 4), "clack", -11, "*clack*: the first phone off the table, out of frame (v4.1: S4.05 is cut)", pan=0.3)
synth(A("S4.06", 30), "clack", -17, "a phone clacks off (O.S.)", pan=0.4)
synth(A("S4.06", 80), "clack", -18, "another (O.S.)", pan=-0.4)
for i, kk in enumerate((-7, 0, 7, 14)):
    synth(A("S4.08") + kk, "tones", -13, "the speakerphone dials: four tones (the designed rest)", pan=-0.5, n=i)
synth(Mk("S4.08", "ring"), "ring", -15, "the lighthouse phone rings (carries across)", pan=0.55, d=1.2)
hit(Mk("S4.08", "click"), "dialog_ok_click", -12, "*Click.* (the handset)", pan=0.5)
synth(Mk("S4.08", "click") + 2, "thunk", -13, "the throne falls off", pan=0.5, f0=120)
synth(Mk("S4.08", "click") + 3, "dialtone", -31, "the left pane hears a dial tone", pan=-0.6,
      d=(E("S4.08") - Mk("S4.08", "click") - 3) / FPS)
synth(Mk("S4.08", "ring2"), "ring", -16, "the second phone rings", pan=0.55, d=0.5)
synth(Mk("S4.08", "grab"), "clack", -19, "Mario grabs it", pan=0.5)
hit(A("S4.09", 18), "post_click", -14, "his badge post pops")
for kk in range(0, 88, 6):
    synth(A("S4.09", kk), "step", -28 + (2 if (kk // 6) % 2 else 0), "his steps on the lobby floor (GUEST), from the screen",
          f0=130 + 12 * ((kk // 6) % 2))
hit(Mk("S4.10", "swing"), "letter_clunk", -16, "the spotlight swings off the empty chair (clunk)")
synth(A("S4.10", 13), "thunk", -23, "Ttemme's plate lands", f0=110)
synth(Mk("S4.11", "flip"), "thunk", -18, "the hourglass flips (glass on wood)", f0=220)
synth(Mk("S4.12", "slate"), "thunk", -21, "the wall steps to slate (a soft palette thump)", f0=80)
synth(Mk("S4.12", "open"), "thunk", -22, "the door opens", f0=70)
synth(A("S4.13"), "jangle", -18, "Tasya's key ring")
synth(A("S4.13", 34), "jangle", -22, "the key ring again (the offbeats)")
synth(A("S4.13", 2), "thunk", -24, "Tasya's plate lands", f0=110)
hit(Mk("S4.14", "q") - 6, "key_tap_soft_06", -19, "the marker uncaps")
synth(Mk("S4.14", "q"), "squeak", -18, "the marker writes ?", d=0.5)
# ---- S5: his side, 2 AM
hit(A("S5.03", 2), "post_click", -11, "Rima's post pops")
for kk in range(15, 96, 15):
    hit(A("S5.03", kk), "post_click", -12, "a heart tick on the beat")
hit(Mk("S5.04", "lanyard"), "orb_servo", -14, "the iris steps onto the lanyard")
_c0, _c1 = Mk("S5.06", "insult"), Mk("S5.06", "clunk")
_kf, _j = float(_c0), 0
_mav = np.ones(24) / 24
while _kf < _c1 - 1:                                           # the signatures keep landing, far off, thickening
    u = (_kf - _c0) / (_c1 - _c0)
    name = f"key_tap_soft_0{1 + (_j * 5) % 6}" if _j % 7 else "key_tap_space"
    x = load(sfile(name))
    x = np.column_stack([np.convolve(x[:, 0], _mav, "same"), np.convolve(x[:, 1], _mav, "same")])
    p = rng.uniform(-0.7, 0.7)
    add(sfx, panv(x, p) * db(-36 + 8 * u + rng.uniform(-2, 2)), int(round(_kf * SPF)))
    _kf += max(1.0, (9 - 7 * u) * rng.uniform(0.6, 1.4))
    _j += 1
SFX_LOG.append(dict(f=_c0, tc=tc(_c0), name="key_tap_soft_*", gain_db=-32, label=f"far-off keys: the signatures keep landing ({_j} taps, thickening; they stop on the clunk)", synth=False))
for u_ in (0.3, 0.55, 0.78):
    synth(int(round(Mk("S5.06", "count0") + u_ * (Mk("S5.06", "clunk") - Mk("S5.06", "count0")))), "tick", -21, "the counter ratchets (505, 650, 700)")
hit(_c1 - 12.5, "odometer_ratchet", -9, "the counter locks at 745: the launch-night clunk")
for kk in range(Mk("S5.06", "scroll"), Mk("S5.06", "alyi"), 3):
    synth(kk, "tick", -27, "the page scrolls")
hit(Mk("S5.06", "alyi"), "orb_servo", -18, "the Orb (off picture) notices ALYI")
hit(Mk("S5.06", "alyi") + 2, "vault_chime_triple", -19, "the Orb's chime (off picture)")
synth(A("S5.08") - 4, "whir", -13, "the rack's slot whirs; the check slides down into frame", d=1.0)
hit(Mk("S5.08", "stamp"), "rubber_stamp_C", -12, "VOID IF CEO MISSING")
GL = Mk("S5.09", "glance")
kf, i = float(A("S5.09")), 0
while kf < GL:                                                  # Gerg's keys, then they stop with the Build
    hit(kf, f"key_tap_soft_0{1 + i % 6}", -21 + (i % 3), "Gerg's keys (stop on the glance)")
    kf += 3 + (i * 7) % 3
    i += 1
kf = float(Mk("S5.09b", "type"))
while kf < A("S5.11") + 20:                                     # his keys come back first (they cut us to Mas), then fade
    u = (kf - Mk("S5.09b", "type")) / (A("S5.11") + 20 - Mk("S5.09b", "type"))
    hit(kf, f"key_tap_soft_0{1 + i % 6}", -22 - 8 * u, "the keys return (and cut us to Mas)")
    kf += 3 + (i * 7) % 3
    i += 1
for j in range(3):
    synth(Mk("S5.11", "door") + j * 12, "thunk", -20, "the slate door's held steps", f0=75)
# ---- S6: the avalanche
hit(A("S6.01"), "key_tap_space", -9, "thock: the first tile")
for j in range(10):
    hit(A("S6.01", 16 + j * 3), "key_tap_space", -13, "thock x10")
for j in range(22):
    hit(A("S6.01", 48 + j * 2), "key_tap_space", -17 - j * 0.2, "thocks: hundreds")
hit(A("S6.04", 6), "paper_flutter", -17, "her footnotes scatter", dur=0.9)
for u_, who in ((178, "ALYI"), (231, "NELEH"), (258, "THE QUIET VOTE")):          # the call's own 'left' notices (v4.1)
    hit(A("S6.01") + u_, "post_click--chip", -23, f"the call: {who} left the call")
hit(Mk("S6.06", "label"), "freeze_hit_F", -10, "MADA's label flips (the band's dead stop)")
# ---- S7: the return
for kk, gg in (("heart1", -16), ("heart2", -18), ("heart3", -18)):
    hit(Mk("S7.01", kk), "heart_gliss", gg, "a heart rises and crosses the gap", dur=1.0)
hit(Mk("S7.01", "iou"), "paper_flutter", -21, "the IOU note flutters", dur=0.6)
for w in ("below", "above", "around"):
    synth(W("a4-30-02", w), "thunk", -19, f"the palette steps on '{w}'", f0=65)
synth(A("S7.02b", 72), "jangle", -21, "his key ring, inside the wall")
hit(A("S7.05"), "flame_whoomph", -17, "the fires")
synth(Mk("S7.06", "bang") - 1, "air", -14, "the door's air")
synth(Mk("S7.06", "bang"), "thunk", -4, "the door BANGS", f0=60, d=0.5)
hit(Mk("S7.06", "helmet"), "tower_pop", -14, "the helmet pops on")
hit(Mk("S7.06", "freeze"), "freeze_hit_F", -8, "FULL FREEZE (the TERB card)")
synth(Mk("S7.06", "pin"), "pin", -10, "the pin comes out")
synth(Mk("S7.06", "unfreeze"), "air", -18, "the room unfreezes", d=0.3)
for f0_, d in ((A("S7.07") + 2, 1.6), (A("S7.07") + 44, 1.4), (A("S7.09") + 4, 2.2)):
    hit(f0_, "steam_hiss", -15, "Terb sprays (the extinguisher works)")
    synth(f0_ + 4, "spray", -19, "the spray", d=d)
hit(A("S7.07", 30), "keycap_popcorn", -18, "keycaps bounce off the table")
synth(A("S7.08", 20), "jangle", -24, "a key ring, inside the wall")
hit(Mk("S7.09", "stamp"), "rubber_stamp_C", -8, "the term sheet stamped")
hit(Mk("S7.09", "hand"), "paper_flutter", -22, "handed to both", dur=0.4)
hit(A("S7.11"), "keycap_popcorn", -10, "keycaps pop (the phone lights green)")
hit(A("S7.11", 8), "post_click", -10, "Gerg's post")
hit(A("S7.13", 6), "post_click", -12, "Ttemme's post")
synth(Mk("S7.13", "grain"), "scribble", -28, "the last grain of sand", d=0.5)
for kk, f0_, gg in ((60, 5400, -26), (80, 4700, -23), (95, 5100, -20)):
    synth(A("S7.13", kk), "stress", gg, "the glass takes the strain", f0=f0_)
hit(Mk("S7.13", "shatter"), "hourglass_shatter", -8, "the hourglass shatters")
synth(Mk("S7.13", "fall"), "sand", -22, "the sand falls")
# ---- S8: the lobby, and after
hit(Mk("S8.01", "ignite"), "neon_ignite", -10, "the sign ignites")
hit(A("S8.02", 12), "letter_clunk", -16, "a box of zeros set down")
hit(Mk("S8.03", "dialog"), "dialog_ok_click--chip", -18, "the 1993 dialog")
hit(Mk("S8.03", "click"), "alert_bonk", -6, "*Bonk.* (Cancel is refused)")
synth(Mk("S8.03", "click") + 2, "clack", -24, "the dialog shakes")
hit(Mk("S8.05", "set"), "key_tap_space", -18, "the glass set down on the stone")
hit(Mk("S8.05", "nudge"), "key_tap_soft_03", -22, "nudged one pixel true")
for kk in ("s1", "s2", "s3", "s4"):
    synth(Mk("S8.09", kk), "squeak", -18, "a screw, one a beat", f0=1500)
hit(E("S8.09") - 10, "letter_clunk", -18, "the ALYI plate comes off")
for kk in (0, 4, 8, 12, 16):
    synth(A("S8.10", kk), "clack", -18, "the folding chair unfolds")
synth(Mk("S8.10", "keys"), "jangle", -12, "Tasya's key ring drops onto the seat")


# ================================================================================================ ROOMS (one bed per location)
# Each bed is built for its span, levelled to its target (dBFS RMS, the bed alone), faded in and out (equal power)
# and laid on the bed bus.  Sample layers are the SFX board's own beds; TEMP-SYNTH layers stand in for the rest.
beds = np.zeros((N, 2))
BEDS = []
brng = np.random.default_rng(11)


def loop_file(name, n, start=None):
    x = load(sfile(name))
    reps = int(np.ceil(n / len(x))) + 2
    y = np.vstack([x] * reps)
    o = int(brng.integers(0, len(x))) if start is None else start
    return y[o:o + n].copy()


def pink(n, ch=2):
    out = np.zeros((n, ch))
    for c in range(ch):
        w = brng.standard_normal(n)
        W_ = np.fft.rfft(w)
        f = np.fft.rfftfreq(n, 1 / SR)
        W_[1:] /= np.sqrt(f[1:])
        W_[0] = 0
        y = np.fft.irfft(W_, n)
        out[:, c] = y / (np.std(y) + 1e-12)
    return out


def slow_lfo(n, lo=0.03, hi=0.12, depth_db=2.0):
    """a smooth random level wobble (a room breathes)"""
    k = max(4, int(n / SR * hi * 2) + 4)
    pts = brng.uniform(-1, 1, k)
    g = np.interp(np.linspace(0, k - 1, n), np.arange(k), pts)
    g = signal.sosfiltfilt(signal.butter(1, hi, 'low', fs=SR, output='sos'), g) if n > 100 else g
    g = g / (np.max(np.abs(g)) + 1e-9)
    return db(depth_db * g)[:, None]


def events(n, rate, maker, gdb=-12.0, pan_w=0.7):
    """sparse events (keys, rustles, far voices) at `rate` per second"""
    y = np.zeros((n, 2))
    tt = 0.0
    while True:
        tt += brng.exponential(1.0 / rate)
        i = int(tt * SR)
        if i >= n:
            break
        e = maker()
        e = np.column_stack([e, e]) if e.ndim == 1 else e
        p = brng.uniform(-pan_w, pan_w)
        add(y, panv(e, p) * db(gdb + brng.uniform(-4, 2)), i)
    return y


def murmur(n, talkers=6, lo=220, hi=2400, rate=(2.5, 5.5)):
    """a room of voices, no words: band-limited noise with syllabic envelopes, several talkers"""
    y = np.zeros((n, 2))
    for k in range(talkers):
        w = _bp(brng.standard_normal(n), lo * brng.uniform(0.8, 1.2), hi * brng.uniform(0.7, 1.1))
        r = brng.uniform(*rate)
        tt = np.arange(n) / SR
        syl = np.clip(np.sin(2 * np.pi * r * tt + brng.uniform(0, 6)) * 0.7 + brng.uniform(-0.2, 0.3), 0, 1) ** 1.5
        phr = np.clip(np.sin(2 * np.pi * brng.uniform(0.08, 0.2) * tt + brng.uniform(0, 6)) + 0.4, 0, 1)
        v = w * syl * phr
        p = brng.uniform(-0.8, 0.8)
        y += np.column_stack([v * (1 - max(0, p)), v * (1 + min(0, p))])
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-12)


def e_key():
    x = load(sfile(f"key_tap_soft_0{int(brng.integers(1, 7))}"))
    return _lpf(x, 3500)


def e_rustle():
    d = brng.uniform(0.2, 0.8)
    tt = t(d)
    x = _bp(brng.standard_normal(len(tt)), 900, 6000) * np.sin(np.pi * tt / d) ** 1.5 * (0.6 + 0.4 * brng.random(len(tt)))
    return x * 0.6


def e_tape():
    d = brng.uniform(0.5, 1.1)
    tt = t(d)
    x = _bp(brng.standard_normal(len(tt)), 1500, 7000) * (0.7 + 0.3 * np.sin(2 * np.pi * 37 * tt)) * np.sin(np.pi * tt / d)
    return x * 0.5


def e_crackle():
    k = int(brng.integers(80, 400))
    x = brng.uniform(-1, 1) * np.exp(-np.arange(k) / brng.uniform(15, 60))
    return x


def e_car():
    d = brng.uniform(4.0, 8.0)
    tt = t(d)
    x = _lpf(brng.standard_normal(len(tt)), brng.uniform(300, 600)) * np.sin(np.pi * tt / d) ** 2
    return x * 1.2


def e_horn():
    d = brng.uniform(0.3, 0.6)
    tt = t(d)
    f1, f2 = (brng.uniform(380, 420), brng.uniform(470, 520))
    x = (np.sign(np.sin(2 * np.pi * f1 * tt)) + np.sign(np.sin(2 * np.pi * f2 * tt))) * 0.2
    return _lpf(_hpf(x, 250), 1500) * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.05)


def hvac(n, bright=900):
    return _lpf(loop_file("room_tone", n), bright) * 0.9 + _lpf(pink(n), 500) * 0.25


def bed_suite(n):
    x = hvac(n) + _lpf(pink(n), 160) * 0.6 * slow_lfo(n, depth_db=3) + events(n, 0.12, e_car, -8) + events(n, 0.03, e_horn, -24)
    return x


def bed_dark(n):
    return loop_file("room_drone", n) * 0.8 + _lpf(loop_file("room_tone", n), 1200) * 0.45 + \
        _hpf(loop_file("server_hum", n), 300) * 0.25


def bed_tpool(n):
    """TPOOL's frosted office in the EARLY-WEB16 colour: HVAC and muffled voices behind glass, bit-reduced"""
    x = hvac(n, 1500) * 0.7 + _lpf(murmur(n, 5, 250, 1400), 650) * 0.8
    q = 2 ** 6
    return np.round(x / (np.max(np.abs(x)) + 1e-9) * q) / q


def bed_office(n, night=False):
    x = hvac(n, 700 if night else 1000) + _lpf(pink(n), 3000) * 0.05
    if not night:
        x = x + events(n, 1.1, e_key, -12) + _lpf(murmur(n, 4, 250, 1800), 1200) * 0.35
    else:
        x = x + _lpf(pink(n), 150) * 0.35 * slow_lfo(n, depth_db=2)
    return x


def bed_allhands(n):
    return murmur(n, 14, 200, 3200) * 1.0 + hvac(n) * 0.3


def bed_boardroom(n):
    return hvac(n, 800) + _lpf(pink(n), 130) * 0.55 * slow_lfo(n, depth_db=3) + events(n, 0.08, e_car, -12)


def bed_lighthouse(n):
    tt = np.arange(n) / SR
    gust = np.clip(0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * tt) + 0.2 * np.sin(2 * np.pi * 0.37 * tt), 0.2, 1.2)[:, None]
    wind = _bp(pink(n), 250, 1600) * gust
    surf = _lpf(pink(n), 500) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 7.0) ** 2)[:, None]
    motor = (np.sin(2 * np.pi * 60 * tt) * 0.3 + np.sin(2 * np.pi * 120 * tt) * 0.15 + np.sin(2 * np.pi * 910 * tt) * 0.02)
    return wind * 0.8 + surf * 0.7 + np.column_stack([motor, motor]) * 0.3


def bed_cctv(n):
    tt = np.arange(n) / SR
    hum = sum(np.sin(2 * np.pi * 60 * k * tt) / k for k in (1, 2, 3, 5)) * 0.2
    lobby = _lpf(pink(n), 400) * 0.6
    return _bp(np.column_stack([hum, hum]) + lobby, 150, 3500) + hvac(n, 800) * 0.6


def bed_bullpen(n):
    return hvac(n, 1000) * 0.8 + _lpf(murmur(n, 5, 250, 1800), 1500) * 0.45 + events(n, 0.7, e_rustle, -10) + \
        events(n, 0.9, e_key, -14) + events(n, 0.12, e_tape, -16)


def bed_fires(n):
    return hvac(n, 800) * 0.7 + events(n, 38.0, e_crackle, -14, 0.6) + _lpf(pink(n), 250) * 0.3 * slow_lfo(n, depth_db=3)


def bed_lobby(n):
    return loop_file("neon_buzz", n) * 0.55 + _lpf(pink(n), 220) * 0.6 + _lpf(loop_file("room_tone", n), 600) * 0.4


BED_FN = dict(suite=bed_suite, dark=bed_dark, tpool=bed_tpool, office=bed_office,
              office_night=lambda n: bed_office(n, True), allhands=bed_allhands, boardroom=bed_boardroom,
              lighthouse=bed_lighthouse, cctv=bed_cctv, bullpen=bed_bullpen, fires=bed_fires, lobby=bed_lobby)


def bed(a, b, kind, target, fin=12, fout=12, label=None, pan=0.0, curve=None):
    """a bed from act frame a to b at `target` dBFS RMS; fades in frames (equal power); curve: [(frame, dB)] ride"""
    n = (b - a) * SPF
    x = BED_FN[kind](n)
    x = _hpf(x, 35)
    x = x / (np.sqrt(np.mean(x ** 2)) + 1e-12) * db(target)
    if pan:
        x = panv(x, pan)                                            # the far side drops; the near side holds
    g = np.ones(n)
    fi, fo = int(fin * SPF), int(fout * SPF)
    if fi:
        g[:fi] = np.sin(0.5 * np.pi * np.linspace(0, 1, fi))
    if fo:
        g[n - fo:] = np.minimum(g[n - fo:], np.cos(0.5 * np.pi * np.linspace(0, 1, fo)))
    if curve:
        g *= db(np.interp(np.arange(n) / SPF + a, [p[0] for p in curve], [p[1] for p in curve]))
    add(beds, x * g[:, None], a * SPF)
    BEDS.append(dict(a=a, b=b, tc_in=tc(a), tc_out=tc(b), kind=kind, target_dbfs=target, fade_in_f=fin,
                     fade_out_f=fout, label=label or kind, synth=kind not in ("dark",)))


# ---- the rooms, in act order (crossfades overlap; D6 is enforced after the sum)
bed(0, CLICK, "suite", -38.0, 0, 1, "the suite: HVAC, the Strip far below (TEMP-SYNTH traffic), -40 under THE PLAN",
    curve=[(0, 0), (110, 0), (120, -2.0), (_J - 20, -2.0), (_J - 7, 0), (CLICK, 0)])
bed(BUZZ, A("S2.01") + 5, "suite", -38.0, 1, 30, "the suite comes back with the phone; it falls away with the picture")
bed(Mk("S1.12", "fall") - 14, A("S2.03") + 6, "dark", -39.0, 24, 12, "the dark room: the drone (F1 + C2), the air, the rack (pre-lapped under the fallaway)")
bed(A("S2.03") - 6, Mk("S2.03", "front_out") + 12, "tpool", -40.0, 12, 12, "TPOOL's frosted office (EARLY-WEB16, TEMP-SYNTH), on the fronts")
bed(Mk("S2.03", "front_out") - 6, A("S3.01") + 12, "dark", -39.0, 12, 12, "the dark room (its tail rings 0.5 s under the whip)")
bed(A("S3.01") - 2, A("S3.06") + 3, "office", -38.5, 6, 6, "Neleh's office by day: HVAC, far keys, murmur (TEMP-SYNTH)")
bed(A("S3.06") - 3, A("S3.09") + 6, "allhands", -34.5, 6, 12, "the all-hands crowd (TEMP-SYNTH): it hushes for the question, stirs after Alyi",
    curve=[(A("S3.06"), 0), (w40(1772), 0), (w40(1780), -6), (w40(1812), -7), (w40(1873), -7)]
    + ([(w40(1885), -1), (w40(1921), 0)] if "S3.08" in SH else []))   # v4.2: S3.08 is cut, so no stir after Alyi: it stays hushed into the cut
bed(A("S3.09") - 6, A("S4.01") + 6, "office_night", -40.0, 12, 6, "Neleh's desk at night (quieter HVAC, the city)")
bed(A("S4.01") - 6, A("S4.08") + 4, "boardroom", -39.0, 6, 4, "the boardroom: HVAC, the city through glass")
bed(A("S4.08") - 4, A("S4.09") + 4, "boardroom", -41.5, 4, 4, "the split, left pane: boardroom air", pan=-0.55)
bed(A("S4.08") - 4, A("S4.09") + 4, "lighthouse", -41.0, 4, 4, "the split, right pane: lighthouse wind, surf, the lamp's motor (TEMP-SYNTH)", pan=0.55)
bed(A("S4.09") - 4, A("S4.10") + 4, "cctv", -40.0, 4, 4, "the lobby camera on the boardroom's screen: CCTV hum, big-lobby air")
bed(A("S4.10") - 4, A("S5.01") + 12, "boardroom", -39.0, 4, 36, "the boardroom (it fades across the card)")
bed(A("S5.01") + 12, A("S7.01") + 6, "dark", -39.0, 36, 12, "the dark room (his side, 2 AM; the monitor's world in S6)")
bed(A("S7.01") - 6, A("S7.05") - 4, "bullpen", -38.0, 12, 8, "the bullpen by day: murmur, packing rustle, keys, tape (TEMP-SYNTH)")
bed(A("S7.05") - 8, A("S8.01") - 22, "fires", -36.0, 8, 12, "the boardroom with fires: the crackle pre-laps under the rail (TEMP-SYNTH)")
bed(Mk("S7.13", "shatter") + 8, A("S8.06") + 6, "lobby", -39.0, 12, 12, "the lobby at night: the sign's neon on F, big dark air (pre-lapped under the shatter); v4.2: -40 -> -39 (the bursty bed read -43 in mono for 0.3 s in the rest before 'okay.')")
bed(A("S8.06") - 6, TOTAL, "bullpen", -38.5, 12, 0, "the bullpen by day under the whole coda (the vault included)")
# the vault's hum on F (diegetic; with the score's TEMP drone it is the coda's pedal, standing in for MM-12)
hx = loop_file("server_hum", (TOTAL - A("S8.06") + 6) * SPF, 0)
gh = np.ones(len(hx))
fi_ = int(0.5 * SR)
gh[:fi_] = np.linspace(0, 1, fi_)
gv = db(np.interp(np.arange(len(hx)) / SPF + A("S8.06") - 6, [A("S8.06") - 6, A("S8.08"), A("S8.08") + 12, TOTAL],
                  [0.0, 0.0, -5.0, -5.0]))
add(sfx, hx * (gh * gv)[:, None] * db(-24), (A("S8.06") - 6) * SPF)
SFX_LOG.append(dict(f=A("S8.06") - 6, tc=tc(A("S8.06") - 6), name="server_hum", gain_db=-24,
                    label="the Q* vault's hum on F: the coda's pedal (TEMP for MM-12); thinned under the memo", synth=False))


# ================================================================================================ the mix
dlg2 = np.column_stack([dlg, dlg])
mix = dlg2 + mus + sfx + beds
# D6: every bus muted from the Cancel click to the phone's buzz; only the click's own transient survives on its frame
a6, b6 = CLICK * SPF, BUZZ * SPF
keep = int(0.25 * SR)
click_tr = sfx[a6:a6 + keep].copy() * np.linspace(1, 0, keep)[:, None]
for bus in (mix, dlg2, mus, mus_raw, sfx, beds):
    bus[a6:b6] = 0.0
mix[a6:a6 + keep] = click_tr
sfx[a6:a6 + keep] = click_tr


def true_peak(x):
    y = signal.resample_poly(x, 4, 1, axis=0)
    return float(todb(np.max(np.abs(y))))


def limiter(x, ceiling_db=-1.2, look_ms=2.0, rel_ms=80.0):
    """a gentle peak limiter (4x oversampled detection) for the few transients over the ceiling"""
    from scipy.ndimage import minimum_filter1d
    y4 = np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0)), axis=1)
    pk = y4[: 4 * len(x)].reshape(-1, 4).max(axis=1)
    g = np.minimum(1.0, db(ceiling_db) / np.maximum(pk, 1e-9))
    la = int(look_ms / 1000 * SR)
    g = minimum_filter1d(g, size=2 * la + 1, mode="nearest")
    blk = 16                                                     # the release at a 16-sample control rate
    gb = g[: len(g) // blk * blk].reshape(-1, blk).min(axis=1)
    r = np.exp(-blk / (rel_ms / 1000 * SR))
    out = np.empty_like(gb)
    v = 1.0
    for i, gi in enumerate(gb):
        v = gi if gi < v else gi + (v - gi) * r
        out[i] = v
    gg = np.repeat(out, blk)
    gg = np.concatenate([gg, np.full(len(x) - len(gg), gg[-1])])
    return x * gg[:, None], float(todb(gg.min()))


meter = pyln.Meter(SR)
TARGET = -16.5
l0 = meter.integrated_loudness(mix)
gain = TARGET - l0
mix_n = mix * db(gain)
tp0 = true_peak(mix_n)
lim_db = 0.0
if tp0 > -1.0:
    mix_n, lim_db = limiter(mix_n, -1.2)
lufs = meter.integrated_loudness(mix_n)
if abs(lufs - TARGET) > 0.2:                                    # one more pass after the limiter
    g2 = TARGET - lufs
    mix_n = mix_n * db(g2)
    gain += g2
    if true_peak(mix_n) > -1.0:
        mix_n, lim2 = limiter(mix_n, -1.2)
        lim_db = min(lim_db, lim2)
    lufs = meter.integrated_loudness(mix_n)
tp = true_peak(mix_n)
G = db(gain)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, "act4-mix-v4.wav"), mix_n.astype(np.float32), SR, subtype="PCM_24")
sf.write(os.path.join(OUT, "act4-dialogue-premix-v4.wav"), (dlg * G).astype(np.float32), SR, subtype="PCM_24")
print(f"mix: {TOTAL / FPS:.2f} s · {lufs:.2f} LUFS · TP {tp:.2f} dBTP · gain {gain:+.2f} dB · limiter {lim_db:.2f} dB")

# ================================================================================================ measurements
# (on the file as written: re-read it, so the numbers describe what gets muxed)
W50 = SR // 20
xm, _ = sf.read(os.path.join(OUT, "act4-mix-v4.wav"), dtype="float64", always_2d=True)
NW = len(xm) // W50


def lev(x, w=W50, mode="max"):
    y = x if x.ndim == 2 else x[:, None]
    n = len(y) // w
    p = (y[: n * w].reshape(n, w, y.shape[1]) ** 2).mean(axis=1)
    return todb(np.sqrt(p.max(axis=1) if mode == "max" else p.mean(axis=1)))


L_mix = lev(xm)
L_dlg = lev(dlg2 * G)
L_mus = lev(mus * G)
L_sfx = lev(sfx * G)
L_bed = lev(beds * G)
fw = lambda i: i * W50 / SPF   # noqa: E731  (window index -> act frame)


def runs(mask):
    out, st = [], None
    for i, v in enumerate(list(mask) + [False]):
        if v and st is None:
            st = i
        if not v and st is not None:
            out.append((st, i))
            st = None
    return out


# ---- the designed stops and rests (lock sound_marks + the cue boundaries), to tell design from accident
DESIGNED = []
for m in LOCK["sound_marks"]:
    a = m["abs"]
    b = m.get("abs_until") or a + 30
    DESIGNED.append((a, b, f'{m["kind"]}: {m["name"]}'))
DESIGNED += [(Mk("S5.09", "glance"), Mk("S5.09b", "type"), "rest: Gerg's glance (v4.1: a ring-out; the pedal holds)"),
             (Mk("S6.06", "label"), A("S7.01") + 8, "stop 3: MADA's label -> the violin under Alyi's post"),
             (LN["a4-30-07"]["abs_in"], Mk("S7.09", "stamp"), 'stop 4: "Terms?" -> the stamp\'s C pedal'),
             (CLICK, A("S2.01"), "stop 1: D6 and its aftermath (the room, 'super.', the fallaway) -> the carve"),
             (Mk("S8.03", "click"), LN["a4-30-12"]["abs_out"] + 2, "rest: the bonk -> the lobby CU quiet -> 'okay.' -> the felt"),
             (Mk("S7.13", "shatter"), A("S8.01") + 6, "rest: the sand's held beat -> the pickup into the sign"),
             (A("S4.07") + 20, Mk("S4.08", "ring") + 6, "rest: the four dial tones (the split's opening)"),
             (A("S1.03") - 2, A("S1.03") + 8, "the blueprint's cut (v4.1: the felt rings on into WORD)"),
             (A("S2.01") - 3, A("S2.01") + 3, "26A's felt re-entry")]


def designed_at(f0, f1):
    best = None
    for a, b, lab in DESIGNED:
        if f0 < b + 6 and f1 > a - 6:
            best = lab
            break
    return best


# ---- 1. music: every start and stop, the runs and the fragments (music bus as mixed: thinned + ducked)
MUS_ON = L_mus > -55.0
mr = runs(MUS_ON)
merged = []
for a, b in mr:                                              # a gap under 0.2 s is not a stop
    if merged and a - merged[-1][1] < 4:
        merged[-1] = (merged[-1][0], b)
    else:
        merged.append((a, b))
music_runs = []
for a, b in merged:
    fa, fb = fw(a), fw(b)
    music_runs.append(OrderedDict(start_frame=round(fa, 1), end_frame=round(fb, 1), tc_in=tc(fa), tc_out=tc(fb),
                                  seconds=round((b - a) / 20, 2), shot_in=shot_at(fa), shot_out=shot_at(fb - 1)))
music_gaps = []
for (a0, b0), (a1, b1) in zip(merged, merged[1:]):
    fa, fb = fw(b0), fw(a1)
    music_gaps.append(OrderedDict(start_frame=round(fa, 1), end_frame=round(fb, 1), tc=tc(fa), seconds=round((a1 - b0) / 20, 2),
                                  shot=shot_at(fa), cause=designed_at(fa, fb) or "UNEXPLAINED"))
first_on, last_off = fw(merged[0][0]), fw(merged[-1][1])
fragments = [r for r in music_runs if r["seconds"] < 2.5]

# ---- 2. holes: the full mix under -42 dBFS for 0.3 s or more
holes = []
for a, b in runs(L_mix < -42.0):
    if b - a < 6:
        continue
    fa, fb = fw(a), fw(b)
    sl = slice(a, b)
    cause = "D6: the designed digital silence (every bus muted)" if (fa >= CLICK - 2 and fb <= BUZZ + 2) else None
    holes.append(OrderedDict(start_frame=round(fa, 1), tc=tc(fa), seconds=round((b - a) / 20, 2), shot=shot_at(fa),
                             level_db=round(float(np.median(L_mix[sl])), 1), bed_db=round(float(np.median(L_bed[sl])), 1),
                             cause=cause or f"UNEXPLAINED: bed {np.median(L_bed[sl]):.1f} dB, music {np.median(L_mus[sl]):.1f} dB"))

near_holes = []                                               # (spotting only) the floor under -40 dBFS for 0.3 s+
for a, b in runs(L_mix < -40.0):
    if b - a < 6:
        continue
    fa = fw(a)
    if CLICK - 2 <= fa <= BUZZ + 2:
        continue
    near_holes.append(OrderedDict(tc=tc(fa), frame=round(fa, 1), seconds=round((b - a) / 20, 2), shot=shot_at(fa),
                                  level_db=round(float(np.median(L_mix[a:b])), 1)))

# ---- 3. abrupt jumps (> 15 dB between adjacent 50 ms windows)
SFX_F = sorted((x["f"], x["label"], x["name"]) for x in SFX_LOG)


def near_sfx(f, tol=2.5):
    c = [(abs(g - f), lab, nm) for g, lab, nm in SFX_F if -3 <= f - g <= tol]
    return min(c)[1:] if c else None


def near_line(f, tol=2.5):
    for r in LINES:
        if abs(r["a"] - f) <= tol or abs(r["b"] - f) <= tol + 2:
            return r
    return None


MARKS = []
for c in MUSIC_LOG:
    MARKS += [(m["act"], m["label"]) for m in c["markers"]]
jumps = []
for i in range(1, len(L_mix)):
    d = L_mix[i] - L_mix[i - 1]
    if abs(d) <= 15 or max(L_mix[i], L_mix[i - 1]) < -60:
        continue
    f = fw(i)
    deltas = dict(dialogue=L_dlg[i] - L_dlg[i - 1], music=L_mus[i] - L_mus[i - 1], sfx=L_sfx[i] - L_sfx[i - 1],
                  bed=L_bed[i] - L_bed[i - 1])
    lead = max(deltas, key=lambda k: abs(deltas[k]) if np.sign(deltas[k]) == np.sign(d) else -1)
    cause = None
    if CLICK - 1 <= f <= CLICK + 12 or BUZZ - 2 <= f <= BUZZ + 3:
        cause = "D6 boundary (designed)"
    elif lead == "sfx":
        s_ = near_sfx(f)
        cause = f"SFX: {s_[0]} ({s_[1]})" if s_ else None
    elif lead == "dialogue":
        r = near_line(f)
        if r:
            cause = f"dialogue {'onset' if d > 0 else 'end'}: {r['id']} {r['speaker']}"
        else:
            inl = [x for x in LINES if x["a"] - 2 <= f <= x["b"] + 2]
            cause = (f"speech inside {inl[0]['id']} {inl[0]['speaker']}: a word after a pause / a phrase's end over the "
                     f"floor (natural)") if inl else None
    elif lead == "music":
        mk = [lab for g, lab in MARKS if abs(g - f) <= 3]
        cause = f"music: {mk[0]}" if mk else None
    jumps.append(OrderedDict(frame=round(f, 1), tc=tc(f), shot=shot_at(f), delta_db=round(float(d), 1),
                             from_db=round(float(L_mix[i - 1]), 1), to_db=round(float(L_mix[i]), 1), led_by=lead,
                             cause=cause or f"UNEXPLAINED (led by {lead})"))

# ---- 3b. the score's own edges: level steps over 10 dB between 50 ms windows on the music bus (hits, stops, entries)
mus_steps = []
for i in range(1, len(L_mus)):
    d = L_mus[i] - L_mus[i - 1]
    if abs(d) <= 10 or max(L_mus[i], L_mus[i - 1]) < -55:
        continue
    f = fw(i)
    mk = [lab for g, lab in MARKS if abs(g - f) <= 4]
    mus_steps.append(OrderedDict(frame=round(f, 1), tc=tc(f), shot=shot_at(f), delta_db=round(float(d), 1),
                                 cause=(mk[0] if mk else (designed_at(f - 2, f + 2) or "a note's attack or decay"))))

# ---- 4. dialogue gaps (as placed) and what fills them
gaps = []
for r0, r1 in zip(LINES, LINES[1:]):
    gf = r1["a"] - r0["b"]
    sl = slice(int(r0["b"] * SPF / W50), max(int(r0["b"] * SPF / W50) + 1, int(r1["a"] * SPF / W50)))
    gaps.append(OrderedDict(after=r0["id"], before=r1["id"], seconds=round(gf / FPS, 3),
                            music_on_pct=round(float(np.mean(MUS_ON[sl])) * 100, 0) if gf > 0 else None,
                            floor_db=round(float(np.median(L_mix[sl])), 1) if gf > 0 else None))
bins = [(-9, 0, "overlap"), (0, 0.3, "0-0.3 s"), (0.3, 0.6, "0.3-0.6 s"), (0.6, 1.2, "0.6-1.2 s"), (1.2, 3, "1.2-3 s"),
        (3, 6, "3-6 s"), (6, 12, "6-12 s"), (12, 999, "12 s +")]
gap_hist = OrderedDict((lab, sum(1 for g in gaps if lo <= g["seconds"] < hi)) for lo, hi, lab in bins)
reply_gaps = [g for g in gaps if g["seconds"] < 3.0]

# ---- 5. dialogue over music, per line
dm = []
for r in LINES:
    a, b = int(r["a"] * SPF / W50), int(r["b"] * SPF / W50)
    if b <= a:
        continue
    act = L_dlg[a:b] > -45
    if not act.any():
        continue
    dd = float(np.median(L_dlg[a:b][act])) - float(np.median(L_mus[a:b][act]))
    dm.append(OrderedDict(id=r["id"], speaker=r["speaker"], frame=r["a"], dialogue_over_music_db=round(dd, 1),
                          music_db=round(float(np.median(L_mus[a:b][act])), 1)))
dmv = np.array([x["dialogue_over_music_db"] for x in dm if x["music_db"] > -60])

# ---- 6. beds as heard, per location; the floor where nothing else plays
bed_levels = []
for bd in BEDS:
    a, b = int(bd["a"] * SPF / W50) + 4, int(bd["b"] * SPF / W50) - 4
    if b <= a:
        continue
    exp_ = (L_dlg[a:b] < -50) & (L_mus[a:b] < -50) & (L_sfx[a:b] < -50)
    bed_levels.append(OrderedDict(label=bd["label"], tc_in=bd["tc_in"], target_dbfs=bd["target_dbfs"],
                                  bed_median_db=round(float(np.median(lev(beds[bd["a"] * SPF:bd["b"] * SPF] * G, mode="mean"))), 1),
                                  exposed_seconds=round(float(np.sum(exp_)) / 20, 2),
                                  exposed_floor_db=round(float(np.median(L_mix[a:b][exp_])), 1) if exp_.any() else None))

# ---- 7. the thin: the music inside each record window vs the second before it
thin_rep = []
for a, b, dep, thin, lab in KEYS:
    if not thin:
        continue
    i0, i1 = int(a * SPF / W50), int(b * SPF / W50)
    free = [i for i in range(max(0, i0 - 100), i0 - 2) if not any(k[0] - 2 <= fw(i) <= k[1] + 30 for k in KEYS)]
    pre = L_mus[free[-20:]] if len(free) >= 6 else L_mus[max(0, i0 - 20):max(1, i0 - 2)]
    ins = L_mus[i0:i1]
    if len(ins) == 0 or len(pre) == 0:
        continue
    thin_rep.append(OrderedDict(item=lab, frame=a, tc=tc(a), music_before_db=round(float(np.median(pre)), 1),
                                music_inside_db=round(float(np.median(ins)), 1),
                                drop_db=round(float(np.median(pre) - np.median(ins)), 1)))

# ---- 8. music-off windows per sequence
off_by_seq = OrderedDict()
for g_ in music_gaps:
    if g_["seconds"] >= 0.25:
        off_by_seq.setdefault(seq_at(g_["start_frame"]), []).append(dict(tc=g_["tc"], seconds=g_["seconds"], cause=g_["cause"]))

st_mix = []                                                   # short-term loudness (3 s, 1 s hop), the full mix
for i in range(0, len(xm) - 3 * SR, SR):
    st_mix.append((i / SR, meter.integrated_loudness(xm[i:i + 3 * SR]) if np.abs(xm[i:i + 3 * SR]).max() > 1e-6 else -99))
per_seq = OrderedDict()
for q in LOCK["sequences"]:
    a, b = int(q["start_frame"] * SPF / W50), int(q["end_frame"] * SPF / W50)
    on = MUS_ON[a:b]
    stq = [v for t_, v in st_mix if q["start_frame"] / FPS <= t_ + 1.5 < q["end_frame"] / FPS and v > -70]
    per_seq[q["id"]] = OrderedDict(tc=q["tc_in"], music_on_pct=round(float(np.mean(on)) * 100, 1),
                                   music_median_db=round(float(np.median(L_mus[a:b][on])), 1) if on.any() else None,
                                   bed_median_db=round(float(np.median(L_bed[a:b])), 1),
                                   dialogue_active_pct=round(float(np.mean(L_dlg[a:b] > -45)) * 100, 1),
                                   mix_short_term_lufs_median=round(float(np.median(stq)), 1) if stq else None,
                                   mix_short_term_lufs_max=round(float(np.max(stq)), 1) if stq else None)
meas = OrderedDict(
    act_frames=TOTAL, act_seconds=round(TOTAL / FPS, 3),
    integrated_lufs=round(lufs, 2), true_peak_dbtp=round(tp, 2), sample_peak_dbfs=round(float(todb(np.max(np.abs(xm)))), 2),
    master_gain_db=round(gain, 2), limiter_max_reduction_db=round(lim_db, 2), target_lufs=TARGET,
    integrated_lufs_dialogue=round(meter.integrated_loudness(dlg2 * G), 2),
    integrated_lufs_music=round(meter.integrated_loudness(mus * G), 2),
    music=OrderedDict(runs=len(music_runs), first_start=tc(first_on), last_stop=tc(last_off),
                      audible_pct=round(float(np.mean(MUS_ON[: int(TOTAL * SPF / W50)])) * 100, 1),
                      longest_run_s=max(r["seconds"] for r in music_runs),
                      median_run_s=float(np.median([r["seconds"] for r in music_runs])),
                      fragments_under_2_5s=fragments, run_list=music_runs, stops=music_gaps,
                      unexplained_stops=[g_ for g_ in music_gaps if g_["cause"] == "UNEXPLAINED"]),
    music_off_windows_by_sequence=off_by_seq,
    holes_0_3s_under_42dbfs=OrderedDict(count=len(holes), total_seconds=round(sum(h["seconds"] for h in holes), 2),
                                        list=holes, unexplained=[h for h in holes if h["cause"].startswith("UNEXPLAINED")]),
    near_holes_under_40dbfs=near_holes,
    digital_silence=[OrderedDict(tc=tc(fw(a)), seconds=round((b - a) / 20, 2)) for a, b in runs(L_mix < -100) if b - a >= 4],
    jumps_over_15db=OrderedDict(count=len(jumps), up=sum(1 for j in jumps if j["delta_db"] > 0),
                                down=sum(1 for j in jumps if j["delta_db"] < 0), list=jumps,
                                unexplained=[j for j in jumps if j["cause"].startswith("UNEXPLAINED")]),
    dialogue_gaps=OrderedDict(count=len(gaps), histogram=gap_hist,
                              reply_gaps_median_s=round(float(np.median([g["seconds"] for g in reply_gaps])), 3),
                              reply_gaps_range_s=[min(g["seconds"] for g in reply_gaps), max(g["seconds"] for g in reply_gaps)],
                              long_wordless=[g for g in gaps if g["seconds"] >= 3.0], list=gaps),
    dialogue_over_music=OrderedDict(median_db=round(float(np.median(dmv)), 1), p10_db=round(float(np.percentile(dmv, 10)), 1),
                                    min_db=round(float(dmv.min()), 1), under_12db=[x for x in dm if x["dialogue_over_music_db"] < 12
                                                                                   and x["music_db"] > -60], per_line=dm),
    beds=bed_levels, thin=thin_rep, per_sequence=per_seq, music_bus_steps_over_10db=mus_steps,
    short_term_lufs_max=round(float(max(v for _, v in st_mix)), 1),
)

# ---- the margin labels (sound-v4.ts): the music runs (with the cue section they start in) and the SFX marks
def sec_label(f):
    for c in MUSIC_LOG:
        for s_ in c["sections"]:
            if s_["act_in"] - 1 <= f < s_["act_out"] + 1:
                return f'{c["cue"].replace("e01-act4-v4-", "")} · {s_["label"]}'
    return "music"


labels = []
for c in MUSIC_LOG:
    for s_ in c["sections"]:
        labels.append(dict(s=int(s_["act_in"]), e=int(s_["act_out"]), label=f'{c["label"].split(":")[0]} · {s_["label"]}'))
marks = [dict(f=x["f"], label=x["label"] + (" (temp synth)" if x["synth"] else "")) for x in SFX_LOG]
ts = ["// GENERATED by tools/mix_v4.py (the Act Four v4 sound pass): the score's sections and the SFX marks, for the margin.",
      "/* eslint-disable */",
      "export const MUSIC: Array<{s: number; e: number; label: string}> = " + json.dumps(labels, ensure_ascii=False, separators=(",", ":")) + ";",
      "export const SFX_MARKS: Array<{f: number; label: string}> = " + json.dumps(marks, ensure_ascii=False, separators=(",", ":")) + ";", ""]
open(P("studio/src/episodes/ep01/act4/animatic/sound-v4.ts"), "w").write("\n".join(ts))
json.dump(OrderedDict(
    file="out/ep01/act4/animatic/act4-mix-v4.wav", premix="out/ep01/act4/animatic/act4-dialogue-premix-v4.wav",
    lock="show/episodes/ep01/production/act4/shots-locked-v4.json", sample_rate=SR, fps=FPS,
    generator="studio/src/episodes/ep01/act4/animatic/tools/mix_v4.py",
    honesty="Measured, not heard: nothing in this file was listened to. Every flagged spot needs a human ear (edit-plan-v4 §8 check 9).",
    rules=["one continuous to-picture render per sequence or chapter (audio/ost/tracks/e01-act4-v4); designed stops baked in",
           "thin under record items (melodic families -15 dB, a beat's ramp) and duck from the dialogue and the record "
           "(-9 invented, -10.5 THE PLAN's read, -11 record, -6 V.O., -9 the laptop, -7 Alyi's post; 60/500 ms; hold < 1.2 s)",
           "one bed per location at about -38 to -40 dBFS, crossfaded; the SFX board at the v4 marks; TEMP-SYNTH stand-ins named",
           "D6: every bus muted from the Cancel click to the phone's buzz (the click's transient kept)",
           f"integrated {TARGET} LUFS, true peak <= -1 dBTP"],
    music=MUSIC_LOG, duck_keys=[dict(a=a, b=b, tc=tc(a), duck_db=d, thin=t_, label=l) for a, b, d, t_, l in KEYS],
    thin_windows=[dict(a=a, b=b, families=list(f_), depth_db=d, label=l) for a, b, f_, d, l in THIN],
    designed_stops_and_rests=[dict(a=a, b=b, tc=tc(a), label=l) for a, b, l in DESIGNED],
    sfx=SFX_LOG, beds=BEDS, measurements=meas,
), open(os.path.join(OUT, "act4-mix-v4.cues.json"), "w"), indent=1, ensure_ascii=False, default=float)
print(json.dumps(OrderedDict((k, v) for k, v in meas.items() if k in ("integrated_lufs", "true_peak_dbtp", "integrated_lufs_dialogue",
                                                                        "integrated_lufs_music")), indent=0))
print("music runs", len(music_runs), "fragments<2.5s", len(fragments), "stops", len(music_gaps),
      "unexplained stops", len(meas["music"]["unexplained_stops"]))
print("holes", len(holes), "total", meas["holes_0_3s_under_42dbfs"]["total_seconds"], "unexplained", len(meas["holes_0_3s_under_42dbfs"]["unexplained"]))
print("jumps", len(jumps), "unexplained", len(meas["jumps_over_15db"]["unexplained"]))
print("D/M median", meas["dialogue_over_music"]["median_db"], "p10", meas["dialogue_over_music"]["p10_db"], "min", meas["dialogue_over_music"]["min_db"])
print("gap hist", dict(gap_hist), "reply median", meas["dialogue_gaps"]["reply_gaps_median_s"])
