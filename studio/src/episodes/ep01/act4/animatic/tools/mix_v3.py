"""mix_v3.py - THE EDITOR's TEMP SOUND for the Act Four animatic v3 (timing lock v3).

v2 had the dialogue track only, so every set-piece played as dead air. v3 is cut with sound (tighten-changes §6, the
script's MUSIC:/SOUND: calls, OST-BIBLE §4.1 and §6.6):
  DIALOGUE  every voiced cue of shots-locked-v3.json at its frame (V.O. +2 dB to dialogue level; the laptop "super."
            at its delivered -22 LUFS). Posts stay unvoiced (house rule).
  MUSIC     the FINISHED OST to-picture cues (underscore mixes, TEMP), cut to the v3 picture in whole bars / beats of
            their own 96 BPM grid from each set-piece's own cut (OST §6.6: cut on the bar, hard stops baked in, no
            stretch). Dry windows are enforced: no music under a real [V] line or a card (1 bar each side of the candor
            card), under the posts the script calls dry, in the quiet beat, the D8 line, the calm-off, the memo.
            Music ducks 3 dB under dialogue (OST §6.6 rule 7: <= 3 dB), 60 ms attack / 300 ms release.
  SFX       the SFX board (audio/sfx/manifest.json) at the picture events, at the board's mixDb unless noted; the
            board's "(build)" sounds that don't exist yet are synthesised stand-ins, named TEMP-SYNTH in the cue sheet.
  BEDS      room tone per location (room_tone / room_drone / server_hum / neon_buzz) so a dry record item is room, not
            digital silence.
  D6        the drop-out (26.06b f0 -> 26.08 f0, 5 beats) is a mute of EVERY bus (OST §6.6 rule 9); only the Cancel
            click's own transient is heard on f0.
Outputs (out/ep01/act4/animatic/): act4-mix-v3.wav (48 kHz stereo 24-bit), act4-dialogue-premix-v3.wav (mono),
act4-mix-v3.cues.json (the EDL: music segments, SFX, beds, dry windows, measurements), and the margin labels
studio/src/episodes/ep01/act4/animatic/sound-v3.ts.
Run (numpy + soundfile + pyloudnorm):  audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v3.py
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
import os
from collections import OrderedDict

import numpy as np
import soundfile as sf
import pyloudnorm as pyln

P = lambda *a: os.path.join(REPO, *a)  # noqa: E731
SR, FPS = 48000, 24
SPF = SR // FPS
BEAT, BAR = 15, 60
OUT = P("out/ep01/act4/animatic")
LOCK = json.load(open(P("show/episodes/ep01/production/act4/shots-locked-v3.json")))
SH = OrderedDict((r["id"], r) for r in LOCK["shots"])
LN = {l["id"]: l for r in LOCK["shots"] for l in r["lines"]}
TOTAL = LOCK["summary"]["act_frames"]
N = TOTAL * SPF
SFXM = {x["id"]: x for x in json.load(open(P("audio/sfx/manifest.json")))}
TR = P("audio/ost/tracks")
rng = np.random.default_rng(7)


def A(sid, k=0):
    """act frame of shot-relative frame k"""
    return SH[sid]["start_frame"] + k


def E(sid):
    return SH[sid]["end_frame"]


def word(lid, w, dflt=0):
    l = LN[lid]
    for ww, f0, f1 in l["words"]:
        if ww.lower().strip(".,?—-…").startswith(w):
            return l["abs_in"] + f0
    return l["abs_in"] + dflt


_cache = {}


def load(path):
    if path not in _cache:
        x, sr = sf.read(path, dtype="float64", always_2d=True)
        assert sr == SR, (path, sr)
        if x.shape[1] == 1:
            x = np.repeat(x, 2, axis=1)
        _cache[path] = x[:, :2]
    return _cache[path]


def db(g):
    return 10 ** (g / 20)


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


def add(bus, x, s0):
    if s0 >= len(bus):
        return
    if s0 < 0:
        x = x[-s0:]
        s0 = 0
    n = min(len(x), len(bus) - s0)
    bus[s0:s0 + n] += x[:n]


# ================================================================================================ DIALOGUE
dlg = np.zeros(N)
dlg_spans = []
for c in LOCK["audio_cues"]:
    x, sr = sf.read(P(c["file"]), dtype="float64", always_2d=False)
    assert sr == SR
    if x.ndim > 1:
        x = x.mean(axis=1)
    s0 = c["abs"] * SPF
    n = min(len(x), N - s0)
    dlg[s0:s0 + n] += x[:n] * db(c["gain_db"] or 0.0)
    dlg_spans.append((c["abs"], c["abs"] + int(np.ceil(len(x) / SPF)), c["id"], c["tag"]))

# ================================================================================================ MUSIC (the EDL)
MUS = {
    "A": (f"{TR}/mm07-how-to-fire-a-ceo/render/e01-s25-the-plan-underscore.wav", "MM-07 How to Fire a CEO (E01-S24/S25)"),
    "B": (f"{TR}/e01-s26-the-falling-tile/render/e01-s26-the-falling-tile-underscore.wav", "MM-08 The Falling Tile (E01-S26/S26A)"),
    "C": (f"{TR}/mm09-the-boards-side/render/mm09-the-boards-side-underscore.wav", "MM-09 The Board's Side (E01-S27a-h, S28)"),
    "D": (f"{TR}/mm10-his-side-745/render/mm10-his-side-745-underscore.wav", "MM-10 His Side / 745 (E01-S29a/b)"),
    "E": (f"{TR}/mm11-the-return/render/mm11-the-return-underscore.wav", "MM-11 The Return (E01-S30a-e)"),
    "V": (f"{TR}/e01-s30a-the-door/render/e01-s30a-the-door-underscore.wav", "E01-S30a The Door (STRAIGHT violin)"),
}
# (act frame in, act frame out, cue, source seconds in, gain dB, fade-in frames, fade-out frames (0 = a 3 ms hard stop), label)
M = []


def seg(a, b, cue, src, label, g=0.0, fi=0, fo=0):
    M.append(dict(a=a, b=b, cue=cue, src=src, g=g, fi=fi, fo=fo, label=label))


# sc 24: DARK ROOM felt, the settle never comes; cut by the blueprint
seg(A("24.01"), A("25.01"), "A", 0.0, "MM-07 · sc 24 felt (the settle never comes)")
# sc 25: THE PLAN re-conformed 18 -> 7 bars, in whole bars of the cue's own grid
seg(A("25.01"), A("25.02"), "A", 5.0, "MM-07 · THE WORD (the Blueprint enters on beat 3)")
seg(A("25.02"), A("25.02d"), "A", 12.5, "MM-07 · the chip waltz (3 bars, thinned under NELEH)")
seg(A("25.02d"), A("25.03"), "A", 37.5, "MM-07 · the held chord ('Good question.')")
seg(A("25.03"), A("25.04"), "A", 30.0, "MM-07 · PLAN: the path")
seg(A("25.04"), A("25.05", 15), "A", 50.0 - (A("25.05", 15) - A("25.04")) / FPS, "MM-07 · BREAK: the tape-stop onto the JOIN click")
# sc 26: LEVERAGE from the connect to the Cancel click (hard stop = D6); phrase edits on the cue's beats
seg(A("26.01"), A("26.03"), "B", 0.0, "MM-08 · LEVERAGE low (the call connects)")
seg(A("26.03"), A("26.04"), "B", 10.0, "MM-08 · the 1993 dialog (1-bit F)")
seg(A("26.04"), A("26.05"), "B", 12.5, "MM-08 · the eyes strip (cluster up a semitone)")
seg(A("26.05"), A("26.06b"), "B", 15.0, "MM-08 · the arrow: Step Four, one step a beat → HARD STOP on the click")
# 26A: a single felt; the Rewind lands on sc 27's downbeat
seg(A("26A.01"), A("26A.02"), "B", 52.5, "MM-08 · 26A the carve (felt open fifth, thins under the V.O.)")
seg(A("26A.02"), A("27.01"), "B", 72.5 - (A("27.01") - A("26A.02")) / FPS, "MM-08 · the settle → THE REWIND into sc 27")
# sc 27: PROCEDURE, section by section (a NOON · b hearts · c boardroom night · d lighthouse · f Ttemme · g 11:53 · h Step four?)
seg(A("27.01"), A("27.12"), "C", 0.0, "MM-09 a · NOON: Neleh's clockwork pizzicato")
seg(A("27.12"), A("27.13"), "C", 30.0, "MM-09 b · the hearts")
seg(A("27.13"), A("27.21"), "C", 40.0, "MM-09 c · boardroom night: the pizzicato on the buzz")
seg(A("27.21"), A("27.24"), "C", 65.0, "MM-09 d · THE LIGHTHOUSE (Mario's quartet)")
seg(A("27.25"), A("27.28"), "C", 85.0, "MM-09 f · TTEMME (the spotlight)")
seg(A("27.28"), A("27.30"), "C", 95.0, "MM-09 g · 11:53 PM: Tasya's Rhodes, one step, on the door")
seg(A("27.30"), A("28.01"), "C", 105.0, "MM-09 h · 'Step four?' (thin)")
seg(A("28.01"), A("29.01") + 60, "C", 110.0, "MM-09x · OUTS: REVERSAL → the felt F4 into sc 29", fo=12)
# sc 29: mostly dry; the felt from the Orb on the lanyard through "mostly."; a Build cell at the counter; the Build under Gerg
seg(A("29.04"), A("29.06"), "D", 15.625, "MM-10 a · DARK ROOM felt (the lanyard → 'mostly.')", fo=6)
seg(A("29.06"), A("29.07"), "D", 20.625, "MM-10 a · the counter: a Build cell → the clunk (745)")
seg(A("29.11a"), A("29.13"), "D", 48.125 - (A("29.13") - A("29.11a")) / FPS, "MM-10 a · THE BUILD (Gerg compiling) → stops dead when he looks up")
# the avalanche: SET-PIECE SWING re-conformed 16 -> 8 bars (2 + 2 + 1 + 2 bars of the cue, then the dead stop on the label)
av0 = A("29.18")
seg(av0, av0 + 2 * BAR, "D", 58.75, "MM-10 b1 · SWING: the compile (the first tile)")
seg(av0 + 2 * BAR, av0 + 4 * BAR, "D", 71.25, "MM-10 b2 · Step Four; ALYI RESISTS")
seg(av0 + 4 * BAR, av0 + 5 * BAR, "D", 78.75, "MM-10 b3 · the Water Line augmented")
seg(av0 + 5 * BAR, A("29.30"), "D", 93.75 - (A("29.30") - av0 - 5 * BAR) / FPS, "MM-10 b4 · THE FULL BAND → dead stop on MADA's label")
# sc 30: the violin under the post only, stopped dead on the first heart; the floor after Tasya's line; the calm-off in
# silence; the Build restarts on Gerg's post (VICTORY LAP) → the stab on the sign → the flat line → the felt after "okay."
seg(A("30.01"), A("30.01", 99), "V", 0.0, "E01-S30a · STRAIGHT: one violin under the post (stops dead on the first heart)")
seg(A("30.03", 86), A("30.07"), "E", 24.375, "MM-11 b · THE FLOOR (Tasya's Rhodes, after her line)", fo=10)
seg(A("30.16"), A("30.19"), "E", 69.375 - (A("30.19") - A("30.16")) / FPS, "MM-11 d · GERG RETURNS: the Build restarts (VICTORY LAP)")
seg(A("30.19"), A("30.20"), "E", 69.375, "MM-11 e1 · the brass stab on the sign")
seg(A("30.20"), A("30.23"), "E", 71.875, "MM-11 e2 · one chip note; the 1993 flat line; the [CU]")
okay = LN["a4-30-12"]
seg(okay["abs_out"] + 1, okay["abs_out"] + 1 + int(2.125 * FPS), "E", 78.75, "MM-11 e3 · after 'okay.': the felt cadence", fo=8)

# ---- dry windows (music muted; its ramps sit OUTSIDE the window, never under a line)
DRY = []


def dry(a, b, why):
    DRY.append((a, b, why))


for lid in ("a4-27-06", "a4-27-20", "a4-30-02", "a4-31-03"):
    l = LN[lid]
    dry(l["abs_in"] - 2, l["abs_out"] + 4, f"real line {lid} (dry)")
dry(A("27.04") - BAR, E("27.04") + BAR, "the candor card, 1 bar each side")
dry(A("27.05"), E("27.05c"), "Rima: dry under the line")
dry(A("27.06", 10), E("27.06"), "Gerg's post (dry around the post)")
dry(A("27.10"), E("27.10"), "his 9:32 post (dry)")
dry(A("27.12", 20), E("27.12"), "his eulogy post (dry around the post)")
dry(A("27.24"), E("27.24"), "NOV 19 · the lobby camera + his post (dry)")
dry(A("26.09"), E("26.10"), "'super.' + F1.2 (no music; F1.2 silent, C39)")
dry(A("29.02"), E("29.03"), "the hearts: the ticks are the rhythm (dry)")
dry(A("29.07"), E("29.10"), "the letter card · (REPORTED) · the check (dry)")
dry(A("29.13"), E("29.17"), "the quiet beat · the D8 line · 'Everyone is welcome.' (no music, R16)")
dry(A("30.07"), E("30.15"), "the calm-off plays in silence under its own chaos")
dry(A("31.03"), TOTAL, "the memo (the record) and after: none")
D6 = LOCK["summary"]["D6"]
d6a, d6b = D6["start"], D6["end"]

mus = np.zeros((N, 2))
for m in M:
    path = MUS[m["cue"]][0]
    x = load(path)
    s0 = int(round(m["src"] * SR))
    n = (m["b"] - m["a"]) * SPF
    piece = x[s0:s0 + n] if s0 >= 0 else np.vstack([np.zeros((-s0, 2)), x[:n + s0]])
    if len(piece) < n:
        piece = np.vstack([piece, np.zeros((n - len(piece), 2))])
    piece = fade(piece * db(m["g"]), max(144, m["fi"] * SPF), max(144, m["fo"] * SPF))  # 3 ms de-click at least
    add(mus, piece, m["a"] * SPF)

# the music gain: dry windows (6 f ramps outside the window) x the duck under dialogue (-3 dB)
g = np.ones(N)
RAMP = 6 * SPF
for a, b, _ in DRY:
    s0, s1 = a * SPF, min(N, b * SPF)
    g[s0:s1] = 0
    r0 = max(0, s0 - RAMP)
    g[r0:s0] = np.minimum(g[r0:s0], np.linspace(1, 0, s0 - r0))
    r1 = min(N, s1 + RAMP)
    g[s1:r1] = np.minimum(g[s1:r1], np.linspace(0, 1, r1 - s1))
act = np.zeros(N)
for a, b, lid, _ in dlg_spans:
    act[a * SPF: b * SPF] = 1
duck = np.where(act > 0, db(-3.0), 1.0)
# the laptop "super." (-22 LUFS through a laptop speaker) is the joke of pass one: the pizzicato steps further back for it
lp = LN["a4-27-00"]
duck[lp["abs_in"] * SPF: (lp["abs_out"] + 2) * SPF] = db(-9.0)
# attack 60 ms / release 300 ms: one-pole smoothing, down fast, up slow
att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.3 * SR))
sm = np.empty(N)
v = 1.0
for i in range(0, N, 48):  # 1 ms control rate
    tgt = duck[i]
    c = att if tgt < v else rel
    v = tgt + (v - tgt) * (c ** 48)
    sm[i:i + 48] = v
mus *= (g * sm)[:, None]

# ================================================================================================ SFX + BEDS
sfx = np.zeros((N, 2))
beds = np.zeros((N, 2))
SFX_LOG = []


def sfile(name):
    return P("audio/sfx", SFXM[name]["file"])


def hit(f, name, gdb=None, label=None, rev=False, dur=None, pan=0.0):
    """a board SFX at act frame f (its own mixDb unless given)"""
    x = load(sfile(name)).copy()
    if rev:
        x = x[::-1]
    if dur:
        x = fade(x[: int(dur * SR)], 0, int(0.03 * SR))
    gg = SFXM[name].get("mixDb", -10) if gdb is None else gdb
    if pan:
        x = x * np.array([1 - max(0, pan), 1 + min(0, pan)])
    add(sfx, x * db(gg), int(f * SPF))
    SFX_LOG.append(dict(f=int(f), name=name, gain_db=gg, label=label or name, synth=False))


def synth(f, kind, gdb=-14.0, label=None, **kw):
    x = SYN[kind](**kw)
    add(sfx, np.column_stack([x, x]) * db(gdb), int(f * SPF))
    SFX_LOG.append(dict(f=int(f), name=f"TEMP-SYNTH:{kind}", gain_db=gdb, label=label or kind, synth=True))


def bed(a, b, name, gdb=None, label=None):
    x = load(sfile(name))
    n = (b - a) * SPF
    reps = int(np.ceil(n / len(x))) + 1
    y = np.vstack([x] * reps)[:n]
    y = fade(y, int(0.25 * SR), int(0.25 * SR))
    gg = SFXM[name].get("mixDb", -24) if gdb is None else gdb
    add(beds, y * db(gg), a * SPF)
    BEDS.append(dict(a=a, b=b, name=name, gain_db=gg, label=label or name))


BEDS = []
t = lambda d: np.arange(int(d * SR)) / SR  # noqa: E731


def env(n, a=0.002, d=0.1):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / a) * np.exp(-tt / d)


def _noise(n):
    return rng.standard_normal(n)


def _hp(x, c=0.9):
    y = np.empty_like(x); p = 0.0; q = 0.0
    for i in range(len(x)):
        y[i] = c * (q + x[i] - p); p = x[i]; q = y[i]
    return y


def _lp(x, c=0.1):
    y = np.empty_like(x); v = 0.0
    for i in range(len(x)):
        v += c * (x[i] - v); y[i] = v
    return y


def syn_buzz(d=0.45):  # a phone buzzing on wood: 150 Hz square-ish, 25 Hz rattle
    tt = t(d)
    s = np.sign(np.sin(2 * np.pi * 150 * tt)) * 0.5 + np.sin(2 * np.pi * 300 * tt) * 0.3
    s *= 0.6 + 0.4 * (np.sin(2 * np.pi * 25 * tt) > 0)
    return s * np.minimum(1, tt / 0.01) * np.minimum(1, (d - tt) / 0.03) * 0.35


def syn_clack(d=0.18):  # a phone's clack off a table: a dull knock + plastic click
    tt = t(d)
    return (np.sin(2 * np.pi * 180 * tt) * env(len(tt), 0.001, 0.04) + _hp(_noise(len(tt))) * env(len(tt), 0.0005, 0.012) * 0.6) * 0.8


def syn_tick(d=0.05):  # a pencil tick
    tt = t(d)
    return _hp(_noise(len(tt)), 0.97) * env(len(tt), 0.0003, 0.006) * 0.9


def syn_scribble(d=0.6):  # pencil / pen strokes on paper or wood
    tt = t(d)
    n = _hp(_noise(len(tt)), 0.8) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * tt)))
    return n * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.05) * 0.18


def syn_jangle(d=0.5):  # a key ring: high metallic partials, 7 random strikes
    tt = t(d); s = np.zeros(len(tt))
    for j in range(7):
        o = int(rng.uniform(0, d * 0.6) * SR)
        for fr in (3100, 4700, 6200, 8300):
            f2 = fr * rng.uniform(0.95, 1.05)
            k = np.arange(len(tt) - o) / SR
            s[o:] += np.sin(2 * np.pi * f2 * k) * np.exp(-k / 0.05) * 0.08
    return s


def syn_thunk(d=0.35, f0=90):  # a soft heavy thump (the throne, a palette step, a card)
    tt = t(d)
    return (np.sin(2 * np.pi * f0 * tt * (1 - 0.3 * tt)) * env(len(tt), 0.002, 0.09) + _lp(_noise(len(tt)), 0.05) * env(len(tt), 0.001, 0.03)) * 0.9


def syn_whir(d=0.9):  # the rack slot's motor
    tt = t(d)
    f = 380 + 220 * np.minimum(1, tt / 0.3)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + _lp(_noise(len(tt)), 0.2) * 0.2) * np.minimum(1, tt / 0.05) * np.minimum(1, (d - tt) / 0.1) * 0.5


def syn_tones(d=0.2, n=1):  # the speakerphone: a dual tone
    tt = t(d)
    pairs = [(697, 1209), (770, 1336), (852, 1477), (941, 1633)]
    a, b = pairs[n % 4]
    return (np.sin(2 * np.pi * a * tt) + np.sin(2 * np.pi * b * tt)) * 0.18 * np.minimum(1, (d - tt) / 0.01)


def syn_ring(d=1.0):  # a desk phone ringing (chip-ish): 2 bursts of a warbled tone
    tt = t(d)
    w = np.sign(np.sin(2 * np.pi * (880 + 90 * np.sign(np.sin(2 * np.pi * 20 * tt))) * tt)) * 0.12
    gate = ((tt % 0.5) < 0.35).astype(float)
    return w * gate


def syn_ting(d=0.6, f0=2900):  # a glass ting
    tt = t(d)
    return (np.sin(2 * np.pi * f0 * tt) + 0.5 * np.sin(2 * np.pi * f0 * 2.76 * tt)) * np.exp(-tt / 0.12) * 0.25


def syn_truck(d=2.4):  # the crane truck's diesel grind, passing
    tt = t(d)
    base = np.sin(2 * np.pi * 48 * tt) * 0.4 + _lp(_noise(len(tt)), 0.03) * 1.2
    return base * np.sin(np.pi * tt / d) * 0.5


def syn_air(d=0.2):  # the whip's air pass (never a whoosh)
    tt = t(d)
    return _lp(_noise(len(tt)), 0.25) * np.sin(np.pi * tt / d) ** 2 * 0.35


def syn_crackle(d=4.0):  # small cartoon fires
    tt = t(d); s = _lp(_noise(len(tt)), 0.05) * 0.1
    for _ in range(int(d * 22)):
        o = int(rng.uniform(0, d) * SR)
        k = min(len(tt) - o, 240)
        s[o:o + k] += rng.uniform(-1, 1) * np.exp(-np.arange(k) / 30.0) * 0.5
    return s


def syn_squeak(d=0.25, f0=1900):  # a screw / a marker squeak
    tt = t(d)
    return np.sin(2 * np.pi * (f0 + 300 * np.sin(2 * np.pi * 9 * tt)) * tt) * np.sin(np.pi * tt / d) * 0.12


def syn_pin(d=0.4):  # the pin's clink
    tt = t(d)
    return (np.sin(2 * np.pi * 3400 * tt) + 0.6 * np.sin(2 * np.pi * 5100 * tt)) * np.exp(-tt / 0.06) * 0.2


def syn_murmur(d=2.0):  # an all-hands crowd's room tone
    tt = t(d)
    return _lp(_noise(len(tt)), 0.04) * (0.7 + 0.3 * np.sin(2 * np.pi * 1.3 * tt)) * 0.5


SYN = dict(buzz=syn_buzz, clack=syn_clack, tick=syn_tick, scribble=syn_scribble, jangle=syn_jangle, thunk=syn_thunk, whir=syn_whir,
           tones=syn_tones, ring=syn_ring, ting=syn_ting, truck=syn_truck, air=syn_air, crackle=syn_crackle, squeak=syn_squeak, pin=syn_pin,
           murmur=syn_murmur)

# ---- beds (room tone per location)
bed(0, A("26.06b"), "room_tone", -28, "the suite: room tone (the Strip, the fan)")
bed(A("26.08"), A("26.10"), "room_tone", -28, "the suite: the room comes back with the phone")
bed(A("26.10", 45), A("27.01"), "room_drone", -30, "the dark room: sub drone (pre-laps under the grain of F1.2)")
bed(A("26A.01"), A("27.01"), "room_tone", -32, "the dark room: air")
bed(A("27.01"), A("27.07"), "room_tone", -30, "the board's rooms: air")
bed(A("27.09"), A("27.24"), "room_tone", -30, "the boardroom / the lighthouse: air")
bed(A("27.24"), A("27.25"), "neon_buzz", -28, "the lobby camera: CCTV hum")
bed(A("27.25"), A("28.01"), "room_tone", -30, "the boardroom: air")
bed(A("29.01"), A("30.01"), "room_drone", -32, "the dark room: sub drone")
bed(A("29.01"), A("30.01"), "room_tone", -30, "the dark room: air")
bed(A("30.01"), A("30.07"), "room_tone", -28, "the bullpen: room tone")
bed(A("30.07"), A("30.19"), "room_tone", -30, "the boardroom: air")
bed(A("30.19"), A("31.01"), "neon_buzz", -30, "the lobby: the sign's buzz")
bed(A("31.03"), TOTAL, "room_tone", -28, "the bullpen: room tone")
x = syn_murmur(d=(E("27.09") - A("27.07")) / FPS)
add(beds, np.column_stack([x, x]) * db(-24), A("27.07") * SPF)
BEDS.append(dict(a=A("27.07"), b=E("27.09"), name="TEMP-SYNTH:murmur", gain_db=-24, label="the all-hands crowd"))
x = syn_crackle(d=(A("30.19") - A("30.07")) / FPS)
add(beds, np.column_stack([x, x]) * db(-22), A("30.07") * SPF)
BEDS.append(dict(a=A("30.07"), b=A("30.19"), name="TEMP-SYNTH:crackle", gain_db=-22, label="the cartoon fires"))

# ---- the events (the board's SOUND: calls at their picture frames)
synth(A("24.01") - 6, "truck", -16, "the crane truck's grind (pre-lapped)", d=3.4)
for i, kk in enumerate((18, 21, 25, 28)):
    synth(A("24.01", kk), "ting", -22, "glass tings (his doesn't)", f0=2600 + 380 * i)
hit(A("24.02", 6), "key_tap_soft_03", -24, "the glass nudged one pixel true")
synth(A("24.02", 22), "thunk", -18, "the blueprint print thump", f0=70)
synth(A("25.01"), "scribble", -16, "pencil: the grid draws itself", d=1.1)
hit(A("25.01", 30), "rubber_stamp_C", -8, "the title stamp")
t3 = word("a4-25-10", "three", 23)
for i in range(3):
    synth(t3 + i * 15, "tick", -18, "chair feet walk off")
synth(word("a4-25-10", "four", 55), "scribble", -18, "the ring draws itself", d=0.7)
synth(A("25.02b", 8), "scribble", -16, "the arrow's long stroke", d=1.2)
synth(A("25.02c", 4), "jangle", -16, "the key ring jangles, hopeful")
hit(word("a4-25-12", "gets", 13) + 4, "rubber_stamp_C", -6, "VOTES: 0 (the stamp cuts the line)")
hit(max(A("25.02d", 46), LN["a4-25-02"]["abs_out"]), "paper_flutter", -18, "the moth", dur=0.8)
for kk in (38, 41, 44, 47):
    synth(A("25.03", kk), "tick", -22, "four tiny footsteps")
hit(A("25.04"), "paper_flutter", -12, "the fold curls", dur=0.7)
hit(A("25.04", 18), "paper_whip", -8, "the tear")
hit(A("25.05", 15), "dialog_ok_click", -8, "the trackpad click (JOIN)")
hit(A("26.01"), "bell_ding_F6--chip", -20, "the call connects")
for kk in (4, 8, 12, 16):
    hit(A("26.01", kk), "post_click--chip", -22, "vote icons")
hit(A("26.03"), "dialog_ok_click--chip", -16, "the dialog pops")
for kk in (0, 15):
    hit(A("26.05", kk), "key_tap_soft_05", -26, "the pointer steps")
hit(A("26.06"), "key_tap_soft_05", -26, "the pointer's last step")
hit(A("26.06b"), "dialog_ok_click", -4, "CANCEL (the click: D6 starts)")
synth(A("26.08"), "buzz", -10, "the phone buzzes: the room comes back", d=0.5)
hit(A("26.08", 8), "key_tap_soft_02", -16, "the tap")
hit(A("26.10", 6), "render_front_sweep", -12, "the render front (F1.2)")
for kk in (0, 15, 30, 45):
    synth(A("26A.01", kk), "scribble", -14, "pen clip on wood, one stroke a beat", d=0.28)
synth(A("26A.01", 60), "scribble", -22, "the shavings brushed away", d=0.4)
for kk in (0, 15, 30):
    hit(A("26A.02", kk), "orb_servo", -16, "the Orb counts the tally")
hit(A("26A.03", 8), "orb_servo", -14, "the iris lifts to his face")
hit(E("26A.03") - 15, "tape_spinup", -12, "the Rewind (tape_spinup reversed)", rev=True)
synth(E("26A.03") - 2, "air", -16, "the whip's air pass")
hit(A("27.02", 6), "paper_flutter", -22, "a page turns", dur=0.4)
synth(A("27.03", 4), "tick", -14, "step 1 ticks (pencil)")
synth(A("27.03", 14), "scribble", -22, "the tick runs on", d=0.6)
synth(A("27.04"), "thunk", -22, "the card lands (soft)", f0=110)
synth(A("27.05", 2), "tick", -14, "step 3 ticks (off picture)")
hit(A("27.06", 2), "post_click--chip", -14, "toast: GERG has left")
hit(A("27.06", 10), "post_click", -10, "his post pops")
hit(A("27.06", 24), "keycap_popcorn", -10, "keycaps pop")
hit(A("27.10", 2), "post_click", -8, "his 9:32 post pops on her phone")
hit(A("27.11", 8), "key_tap_soft_04", -18, "her pen taps the CEO box")
hit(A("27.12"), "heart_gliss", -12, "the hearts pour (stacking)")
hit(A("27.12", 20), "post_click", -12, "his eulogy post scrolls in")
hit(A("27.12b", 3), "bell_ding_F6--chip", -18, "one blue heart lands")
for kk, dx in ((0, 0), (2, 1), (5, 2), (7, 3)):
    synth(A("27.13", kk), "buzz", -14, "the phones buzz and step")
synth(A("27.13b", 4), "buzz", -16, "buzz")
synth(A("27.14", 2), "buzz", -18, "buzz")
synth(A("27.15", 4), "buzz", -14, "buzz: the phones walk")
synth(A("27.15", 19), "buzz", -14, "buzz: the phones walk")
synth(A("27.15", 36), "clack", -8, "Clack: the first phone off the edge")
for f in (E("27.17"), A("27.19"), A("27.19", 30)):
    synth(f, "clack", -16, "a phone clacks off (O.S.)")
hit(A("27.19", 2), "key_tap_soft_06", -18, "the marker uncaps")
synth(A("27.19", 10), "squeak", -18, "the marker squeaks: ?", d=0.5)
for i, kk in enumerate((2, 8, 14, 20)):
    synth(A("27.20", kk), "tones", -12, "the speakerphone dials, one tone a seat", n=i)
synth(A("27.20", 30), "ring", -14, "the ring (carries over the cut)", d=1.2)
cl = LN["a4-27-15"]["abs_out"] + 1
hit(cl, "dialog_ok_click", -12, "the handset click")
synth(cl + 3, "thunk", -12, "the throne falls off (thunk)", f0=120)
synth(cl + 2, "ring", -16, "the second phone rings", d=0.4)
synth(A("27.23"), "whir", -26, "the rent meters whir", d=1.6)
hit(A("27.25"), "letter_clunk", -16, "the spotlight swings (clunk)")
synth(A("27.26"), "thunk", -18, "the hourglass flips (glass on wood)", f0=220)
synth(A("27.28", 15), "thunk", -20, "the door appears (a soft palette thump)", f0=80)
synth(A("27.29"), "jangle", -18, "Tasya's key ring")
synth(A("27.29", 34), "jangle", -22, "the key ring again")
for kk in range(0, 120, 15):
    hit(A("29.02", kk), "post_click", -10, "a heart tick on the beat")
hit(A("29.03", 30), "orb_servo", -14, "the iris steps onto the lanyard")
hit(A("29.06", 30), "odometer_ratchet", -8, "the counter: the clunk at 745")
for kk in (0, 15, 30):
    hit(A("29.09", kk), "orb_servo", -18, "the iris: name → thumbnail → name")
hit(A("29.09", 30), "vault_chime_triple", -18, "the Orb's chime")
synth(A("29.10"), "whir", -12, "the rack slot whirs, the tray slides")
hit(A("29.10", 30), "rubber_stamp_C", -12, "VOID IF CEO MISSING")
kf = A("29.11a")
i = 0
while kf < A("29.14"):
    hit(kf, f"key_tap_soft_0{1 + i % 6}", -20 + (i % 3), "Gerg's keys")
    kf += 3 + (i * 7) % 3
    i += 1
kf = A("29.15")
while kf < A("29.16"):
    hit(kf, f"key_tap_soft_0{1 + i % 6}", -22, "the keys resume")
    kf += 3 + (i * 7) % 3
    i += 1
asked = word("a4-29-vo3", "asked", 44)
for j in range(3):
    synth(asked + j * 15, "thunk", -20, "the door's held step (palette thump)", f0=75)
hit(A("29.18"), "key_tap_space", -8, "thock: the first tile")
for j in range(10):
    hit(A("29.19", 2 + j * 3), "key_tap_space", -12, "thock ×10")
for j in range(14):
    hit(A("29.20", j * 2), "key_tap_space", -16, "thocks: hundreds")
hit(A("29.24", 4), "paper_flutter", -16, "her footnotes scatter", dur=0.9)
hit(A("30.01", 99), "heart_gliss", -16, "a heart rises (off the grid)", dur=1.0)
hit(A("30.01", 112), "heart_gliss", -18, "a heart rises", dur=1.0)
hit(A("30.01", 128), "heart_gliss", -18, "a heart rises", dur=1.0)
for w in ("below", "above", "around"):
    synth(word("a4-30-02", w, 20), "thunk", -18, f"the palette steps on '{w}'", f0=65)
synth(A("30.03", 110), "jangle", -20, "his key ring jangles, inside the wall")
hit(A("30.07"), "flame_whoomph", -16, "the fires")
synth(A("30.07", 43), "thunk", -4, "the door BANGS", f0=60, d=0.5)
synth(A("30.07", 42), "air", -14, "the whip's air pass")
hit(A("30.08", 20), "tower_pop", -14, "the helmet pops on")
hit(A("30.09"), "freeze_hit_F", -8, "FULL FREEZE (the card)")
synth(A("30.09", 44), "pin", -10, "the pin comes out")
synth(A("30.10", 20), "pin", -14, "pocketed")
hit(A("30.12", 4), "keycap_popcorn", -16, "keycaps bounce off the table")
hit(A("30.12", 10), "steam_hiss", -12, "Terb sprays (the extinguisher works)")
synth(A("30.12", 16), "jangle", -24, "a key ring, inside the wall")
hit(A("30.15", 30), "rubber_stamp_C", -8, "the term sheet stamped")
hit(A("30.16"), "keycap_popcorn", -10, "keycaps pop (the phone lights green)")
hit(A("30.16", 2), "post_click", -10, "Gerg's post")
hit(A("30.18", 4), "post_click", -12, "Ttemme's post")
hit(A("30.18", 105), "hourglass_shatter", -8, "the hourglass shatters (glass only)")
hit(A("30.19", 6), "neon_ignite", -10, "the sign ignites")
hit(A("30.20", 12), "letter_clunk", -16, "a box of zeros set down")
hit(A("30.21"), "dialog_ok_click--chip", -18, "the 1993 dialog")
hit(A("30.21", 52), "alert_bonk", -6, "Bonk (Cancel is disabled)")
hit(A("30.23", 4), "key_tap_space", -18, "the glass set down")
hit(A("30.23", 8), "key_tap_soft_03", -22, "nudged one pixel true")
for kk in (0, 15, 30, 45):
    synth(A("31.04", kk), "squeak", -18, "a screw, one a beat", f0=1500)
hit(A("31.04", 55), "letter_clunk", -18, "the ALYI plate comes off")
for kk in (0, 4, 8, 12, 16):
    synth(A("31.05", kk), "clack", -18, "the folding chair unfolds")
# the vault's hum on F: diegetic, the temp for MM-12's root (an SFX bus event, swelling on the line in 31.02)
hx = load(sfile("server_hum"))
n = (A("31.03") - A("31.01")) * SPF
y = fade(np.vstack([hx] * (int(np.ceil(n / len(hx))) + 1))[:n], int(0.4 * SR), int(0.3 * SR))
sw = np.ones(n)
s_on = (LN["a4-31-02"]["abs_out"] - A("31.01")) * SPF
sw[s_on:] = np.minimum(db(4), 1 + (db(4) - 1) * np.arange(n - s_on) / (0.5 * SR))
add(sfx, y * sw[:, None] * db(-18), A("31.01") * SPF)
SFX_LOG.append(dict(f=A("31.01"), name="server_hum", gain_db=-18, label="the Q* vault's hum on F (temp for MM-12; swells on the line)", synth=False))
synth(A("27.10"), "buzz", -14, "her phone buzzes face-up")
synth(A("29.07"), "thunk", -22, "the card lands (soft)", f0=110)
for kk in range(0, 15, 2):
    synth(A("29.08", kk), "tick", -26, "the list scrolls")
synth(A("29.08", 15), "tick", -18, "it stops on one name")
synth(A("30.18"), "scribble", -28, "the last grain of sand", d=0.5)
synth(A("31.05", 57), "jangle", -12, "the key ring drops onto the seat")

# ---- SUPERVISING DIRECTOR's review of v3 (review-v3.md): no dry record item may play as > 3 s of room tone alone.
# The record stays DRY (no music, OST §1 rule 10); what fills it is the world's own sound, each with a job in the story:
def syn_step(d=0.09, f0=140):  # a shoe on the lobby's polished floor (TEMP: the board has no footsteps)
    tt = t(d)
    return (np.sin(2 * np.pi * f0 * tt) * env(len(tt), 0.001, 0.02) + _hp(_noise(len(tt)), 0.6) * env(len(tt), 0.0005, 0.008) * 0.5) * 0.7


def syn_stress(d=0.35, f0=5200):  # glass under strain: a dry high tink with a short splinter tail (TEMP)
    tt = t(d)
    tink = (np.sin(2 * np.pi * f0 * tt) + 0.6 * np.sin(2 * np.pi * f0 * 1.51 * tt)) * np.exp(-tt / 0.025)
    return (tink + _hp(_noise(len(tt)), 0.9) * env(len(tt), 0.0005, 0.015) * 0.8) * 0.3


SYN.update(step=syn_step, stress=syn_stress)
# 27.04 the candor card: step 2 of the board's list ticks off picture a bar after the card lands (1 → card → 2 → 3:
# the procedure keeps its pencil pulse while the score steps out for the record)
synth(A("27.04", 60), "tick", -14, "step 2 ticks (off picture): the board ticks off its own blog post")
# 27.10 his 9:32 post: the other phones on the walnut buzz off picture as it goes round the board (plants 27.13's buzz)
synth(A("27.10", 40), "buzz", -21, "another phone on the walnut buzzes (off picture): the post goes round", d=0.32)
synth(A("27.10", 80), "buzz", -19, "and another (off picture)", d=0.32)
# 27.24 the lobby camera: the post pops like every other post; his steps in the GUEST lanyard (contacts every 6 f)
hit(A("27.24", 10), "post_click", -14, "his badge post pops (upside down)")
for kk in range(0, 88, 6):
    synth(A("27.24", kk), "step", -27 + (2 if (kk // 6) % 2 else 0), "his steps on the lobby floor (GUEST)", f0=130 + 12 * ((kk // 6) % 2))
# 29.07 the employees' letter card: the signatures keep landing, far off (many keyboards, thickening), dead stop on the cut
# into the list (29.08). It plants the avalanche's keys (29.18-29.20).
_c0, _c1 = A("29.07", 10), E("29.07")
_kf, _j = float(_c0), 0
_mav = np.ones(24) / 24  # a 0.5 ms box low-pass: far off, not close-miked
while _kf < _c1 - 1:
    u = (_kf - _c0) / (_c1 - _c0)
    name = f"key_tap_soft_0{1 + (_j * 5) % 6}" if _j % 7 else "key_tap_space"
    x = load(sfile(name))
    x = np.column_stack([np.convolve(x[:, 0], _mav, "same"), np.convolve(x[:, 1], _mav, "same")])
    p = rng.uniform(-0.7, 0.7)
    x = x * np.array([1 - max(0, p), 1 + min(0, p)])
    s0 = int(round(_kf * SPF))
    s1 = int(_c1 * SPF)
    add(sfx, x[: max(0, s1 - s0)] * db(-34 + 8 * u + rng.uniform(-2, 2)), s0)
    _kf += max(1.0, (9 - 7 * u) * rng.uniform(0.6, 1.4))
    _j += 1
SFX_LOG.append(dict(f=_c0, name="key_tap_soft_*", gain_db=-30, label=f"far-off keys: the signatures keep landing ({_j} taps, thickening; dead stop on the cut)", synth=False))
# 30.18 Ttemme's post: the glass takes the strain before it goes (hairline cracks drawn at the same frames), then the shatter
synth(A("30.18", 58), "stress", -26, "the glass: a hairline crack", f0=5400)
synth(A("30.18", 88), "stress", -23, "a second crack", f0=4700)
synth(A("30.18", 100), "stress", -20, "the crack runs", f0=5100, d=0.25)

# ================================================================================================ the mix
mix = np.column_stack([dlg, dlg]) + mus + sfx + beds
# D6: every bus muted; only the click's own transient (its first 0.25 s) survives on f0
a6, b6 = d6a * SPF, d6b * SPF
keep = int(0.25 * SR)
click = mix[a6:a6 + keep].copy()
mix[a6:b6] = 0
mix[a6:a6 + keep] = (sfx[a6:a6 + keep]) * np.linspace(1, 0, keep)[:, None]
peak = float(np.max(np.abs(mix)))
norm = 1.0
if peak > db(-1.0):
    norm = db(-1.0) / peak
    mix *= norm
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, "act4-mix-v3.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
sf.write(os.path.join(OUT, "act4-dialogue-premix-v3.wav"), (dlg * norm).astype(np.float32), SR, subtype="PCM_24")
meter = pyln.Meter(SR)
lufs = meter.integrated_loudness(mix)
lufs_d = meter.integrated_loudness(np.column_stack([dlg, dlg]) * norm)


# ================================================================================================ measurements
def active(x, thr_db=-50.0, win=SPF):
    """per-frame activity (RMS above thr) of a (N,) or (N,2) bus"""
    y = x if x.ndim == 1 else np.max(np.abs(x), axis=1)
    n = len(y) // win
    r = np.sqrt(np.mean(y[: n * win].reshape(n, win) ** 2, axis=1))
    return 20 * np.log10(np.maximum(r, 1e-9)) > thr_db


fr_d = active(dlg * norm, -45)
fr_m = active(mus * norm, -50)
fr_s = active(sfx * norm, -50)
fr_b = active(beds * norm, -55)
fr_mix = active(mix, -50)
d6f = np.zeros(TOTAL, bool)
d6f[d6a:d6b] = True


def runs(mask):
    out, cur, st = [], 0, 0
    for i, v in enumerate(list(mask) + [False]):
        if v:
            if cur == 0:
                st = i
            cur += 1
        else:
            if cur:
                out.append((cur, st))
            cur = 0
    return sorted(out, reverse=True)


def shot_at(f):
    for r in LOCK["shots"]:
        if r["start_frame"] <= f < r["end_frame"]:
            return r["id"]
    return LOCK["shots"][-1]["id"]


def tc(f):
    e = (12 * 60 + 31) * FPS + f
    return f"{e // 1440:02d}:{(e // FPS) % 60:02d}:{e % FPS:02d}"


def rows(rr, k=6):
    return [OrderedDict(frames=n, seconds=round(n / FPS, 2), start_frame=s, tc=tc(s), shot=shot_at(s), end_shot=shot_at(s + n - 1)) for n, s in rr[:k]]


no_voice = ~fr_d
no_voice_music_sfx = ~fr_d & ~fr_m & ~fr_s          # beds (room tone) don't count
silent = ~fr_mix                                   # nothing audible at all (D6 is the only designed one)
dlg_cov = float(np.mean(fr_d)) * 100
cov_music_or_sfx = float(np.mean(fr_d | fr_m | fr_s)) * 100
both = fr_d & fr_m
def rms_db(x, win=SPF):
    y = x if x.ndim == 1 else np.mean(x, axis=1)
    n = len(y) // win
    return 20 * np.log10(np.maximum(np.sqrt(np.mean(y[: n * win].reshape(n, win) ** 2, axis=1)), 1e-9))
dm = (rms_db(dlg * norm) - rms_db(mus * norm))[both]
meas = OrderedDict(
    act_frames=TOTAL, act_seconds=round(TOTAL / FPS, 3),
    integrated_lufs_mix=round(lufs, 2), integrated_lufs_dialogue=round(lufs_d, 2), normalised_db=round(20 * np.log10(norm), 2),
    dialogue_audible_pct=round(dlg_cov, 1), dialogue_music_or_sfx_pct=round(cov_music_or_sfx, 1),
    music_audible_pct=round(float(np.mean(fr_m)) * 100, 1),
    dialogue_over_music_db_median=round(float(np.median(dm)), 1) if len(dm) else None, dialogue_over_music_db_p10=round(float(np.percentile(dm, 10)), 1) if len(dm) else None,
    longest_no_voice=rows(runs(no_voice), 5),
    longest_no_voice_no_music_no_sfx=rows(runs(no_voice_music_sfx), 8),
    longest_digital_silence=rows(runs(silent), 4),
    stretches_over_6s_without_voice=len([1 for n, _ in runs(no_voice) if n > 6 * FPS]),
    stretches_over_6s_without_voice_music_sfx=len([1 for n, _ in runs(no_voice_music_sfx) if n > 6 * FPS]),
    D6=OrderedDict(start=d6a, end=d6b, seconds=round((d6b - d6a) / FPS, 3)),
)

# ---- the margin labels (sound-v3.ts): audible music parts only
labels = []
for m in M:
    a, b = m["a"], m["b"]
    cut = [(x, y) for x, y, _ in DRY if y > a and x < b]
    cur = a
    for x, y in sorted(cut):
        if x > cur:
            labels.append(dict(s=cur, e=min(x, b), label=m["label"]))
        cur = max(cur, y)
    if cur < b:
        labels.append(dict(s=cur, e=b, label=m["label"]))
marks = [dict(f=x["f"], label=x["label"] + (" (temp synth)" if x["synth"] else "")) for x in SFX_LOG]
ts = ["// GENERATED by tools/mix_v3.py (THE EDITOR's temp sound for animatic v3): the music segments and SFX marks, for the margin.",
      "/* eslint-disable */",
      "export const MUSIC: Array<{s: number; e: number; label: string}> = " + json.dumps(labels, ensure_ascii=False, separators=(",", ":")) + ";",
      "export const SFX_MARKS: Array<{f: number; label: string}> = " + json.dumps(marks, ensure_ascii=False, separators=(",", ":")) + ";", ""]
open(P("studio/src/episodes/ep01/act4/animatic/sound-v3.ts"), "w").write("\n".join(ts))
json.dump(OrderedDict(
    file="out/ep01/act4/animatic/act4-mix-v3.wav", premix="out/ep01/act4/animatic/act4-dialogue-premix-v3.wav", sample_rate=SR, fps=FPS,
    rules=["dialogue as delivered (V.O. +2 dB; laptop 'super.' -22 LUFS)", "music: finished OST underscore cues cut in whole bars/beats from each set-piece's cut",
           "no music under real lines, cards (1 bar each side of the candor card), dry posts, the quiet beat, the calm-off, the memo",
           "music ducks 3 dB under dialogue (60 ms / 300 ms)", "SFX from the board at picture events; (build) sounds synthesised, marked TEMP-SYNTH",
           "room tone beds per location", "D6: every bus muted for 5 beats after the click's transient"],
    music=[dict(m, cue_file=MUS[m["cue"]][0].replace(REPO + "/", ""), cue_title=MUS[m["cue"]][1], tc_in=tc(m["a"]), tc_out=tc(m["b"])) for m in M],
    dry=[dict(a=a, b=b, why=w, tc_in=tc(a)) for a, b, w in DRY], sfx=SFX_LOG, beds=BEDS, measurements=meas,
), open(os.path.join(OUT, "act4-mix-v3.cues.json"), "w"), indent=1, ensure_ascii=False)
print(f"mix: {TOTAL / FPS:.2f} s · {lufs:.1f} LUFS (dialogue alone {lufs_d:.1f}) · norm {20 * np.log10(norm):.2f} dB · {len(M)} music segments · {len(SFX_LOG)} SFX · {len(BEDS)} beds")
print(json.dumps(meas, indent=1)[:3000])
