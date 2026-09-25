#!/usr/bin/env python3
# MR. MAS — mcoldopen: TIMING SCRATCH audio for intro frames 0-119 (5.0 s), pure synthesis (no samples, no deps).
# It is NOT the score or the sound design: it exists so the cold open's hits can be HEARD landing on the picture
# (96 BPM / 24 fps, 15 frames per beat). Every keystroke below is read from the same frame lists the picture uses
# (src/dev/mcoldopen/timeline.ts: L1_KEYS / L2_KEYS / EV) — keep them in sync if the timeline changes.
# The VO is NOT faked: each syllable of "near the singularity; unclear which side." is marked by a soft breath
# swell at its frame, so the delivery timing is audible and a real read can be dropped straight onto it.
#   python3 src/dev/mcoldopen/tools/scratch_audio.py ../out/pixel/moments/mcoldopen-scratch-audio.wav
import math, random, struct, sys, wave

SR = 48000
F0, F1 = 0, 120  # global frames covered
N = int((F1 - F0) / 24 * SR)
L = [0.0] * N
R = [0.0] * N
rng = random.Random(11)

# ---- the picture's own timing (mirror of timeline.ts)
L1_KEYS = [24, 25, 27, 28, 30, 31, 32, 34, 36, 37, 39, 40, 41, 43, 44, 46, 47, 49, 50, 52, 55]
L2_BREAK = 70
L2_KEYS = [71, 72, 74, 75, 76, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 93]
EV = dict(dot_exit=90, iris=97, scan=(99, 104), smile=107, click=112, chips=(112, 114), white=118)
# VO syllables (frame, length in frames): "near the singularity;" f24-57 / "unclear which side." f72-91
VO = [(24, 4), (29, 3), (33, 3), (37, 3), (41, 3), (45, 3), (50, 6),
      (72, 3), (75, 4), (80, 4), (85, 7)]

def at(g):
    return int(round((g - F0) / 24 * SR))

def add(g, samples, pan=0.0, gain=1.0):
    s0 = at(g)
    gl, gr = gain * math.cos((pan + 1) * math.pi / 4), gain * math.sin((pan + 1) * math.pi / 4)
    for i, v in enumerate(samples):
        j = s0 + i
        if 0 <= j < N:
            L[j] += v * gl
            R[j] += v * gr

def env(n, a, d, sus=0.0, rel=None):
    out = []
    na = max(1, int(a * SR))
    for i in range(n):
        t = i / SR
        out.append(i / na if i < na else sus + (1 - sus) * math.exp(-(t - a) / max(1e-4, d)))
    if rel:
        nr = int(rel * SR)
        for i in range(max(0, n - nr), n):
            out[i] *= (n - i) / nr
    return out

def tone(freq, dur, harm=((1, 1.0),), a=0.005, d=0.4, sus=0.0, glide=0.0, vib=0.0, rel=0.05, detune=0.0):
    n = int(dur * SR)
    e = env(n, a, d, sus, rel)
    ph = [0.0] * len(harm)
    out = []
    for i in range(n):
        t = i / SR
        f = freq * (1 + glide * math.exp(-t * 18)) * (1 + vib * math.sin(2 * math.pi * 5.2 * t))
        v = 0.0
        for k, (h, amp) in enumerate(harm):
            ph[k] += 2 * math.pi * f * h * (1 + detune * k) / SR
            v += amp * math.sin(ph[k])
        out.append(v * e[i])
    return out

def noise(dur, lp=0.2, hp=0.0, a=0.002, d=0.1, sus=0.0, rel=0.02, sweep=None, shape=None):
    n = int(dur * SR)
    e = env(n, a, d, sus, rel) if shape is None else [shape(i / n) for i in range(n)]
    y = yh = prev = 0.0
    out = []
    for i in range(n):
        x = rng.uniform(-1, 1)
        c = sweep(i / SR) if sweep else lp
        y += c * (x - y)
        v = y
        if hp:
            yh = hp * (yh + v - prev)
            prev = v
            v = yh
        out.append(v * e[i])
    return out

def pluck(freq, dur, damp=0.996):  # Karplus-Strong
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = [rng.uniform(-1, 1) for _ in range(p)]
    out = []
    for i in range(n):
        v = buf[i % p]
        nxt = buf[(i + 1) % p]
        buf[i % p] = damp * 0.5 * (v + nxt)
        out.append(v)
    return out

HZ = {'F1': 43.65, 'C2': 65.41, 'F2': 87.31, 'Db3': 138.59, 'F3': 174.61, 'F5': 698.46, 'G5': 783.99,
      'Ab5': 830.61, 'C6': 1046.50, 'F6': 1396.91}
# felt piano: soft hammer (slow-ish attack), strong fundamental, quick upper-partial decay, a little stretch
FELT = ((1, 1.0), (2.003, 0.42), (3.01, 0.16), (4.02, 0.07), (5.04, 0.03))

def felt(g, note, gain=0.22, pan=-0.1, dur=2.4, rel=0.4):
    f = HZ[note]
    add(g, tone(f, dur, FELT, a=0.012, d=0.9, rel=rel), pan=pan, gain=gain)
    add(g, tone(f, dur, ((1, 1.0),), a=0.02, d=1.8, rel=rel, detune=0.0, vib=0.0), pan=pan + 0.2, gain=gain * 0.35)  # the sustain body
    add(g, noise(0.03, lp=0.25, d=0.01), pan=pan, gain=gain * 0.12)  # felt thump

def key(g, gain=0.08, pan=-0.35, heavy=False):  # a soft low-profile key: a muted tick + a tiny bottom-out
    add(g, noise(0.025 if not heavy else 0.04, lp=0.55, hp=0.55, d=0.006 if not heavy else 0.012), pan=pan + rng.uniform(-0.05, 0.05), gain=gain * (1.6 if heavy else 1))
    add(g, tone(1900 + rng.uniform(-250, 250), 0.015, ((1, 1.0),), a=0.0005, d=0.004), pan=pan, gain=gain * 0.25)
    add(g, tone(180 + rng.uniform(-20, 20), 0.03, ((1, 1.0),), a=0.001, d=0.01), pan=pan, gain=gain * (0.5 if heavy else 0.25))

def breath(g, frames, gain=0.07, pan=0.0):  # VO placeholder: a breath-shaped swell at the syllable
    dur = frames / 24
    add(g, noise(dur, lp=0.12, hp=0.85, shape=lambda u: math.sin(math.pi * min(1, u)) ** 1.5), pan=pan, gain=gain)

# ---------------------------------------------------------------- beds: open fifth (no third) + the room
dur = (F1 - F0) / 24
add(0, tone(HZ['F1'], dur, ((1, 1.0), (2, 0.25)), a=1.2, d=99, sus=1.0, rel=0.05), gain=0.09)  # sub drone F1
add(0, tone(HZ['C2'], dur, ((1, 1.0), (2, 0.2)), a=1.4, d=99, sus=1.0, rel=0.05), gain=0.055)   # + C2
add(0, tone(120, dur, ((1, 1.0), (2, 0.3), (3, 0.15)), a=0.6, d=99, sus=1.0, rel=0.05), gain=0.012)  # server hum
add(0, noise(dur, lp=0.035, a=0.8, d=99, sus=1.0, rel=0.05), gain=0.05)  # rack fans (dark air)

# ---------------------------------------------------------------- bar 1: felt piano F5 on every beat (ducked under VO)
# the same key re-struck every beat: each strike damps the last (no phase-cancelling pile-up)
BEAT = 15 / 24
felt(0, 'F5', 0.24, dur=BEAT + 0.015, rel=0.03)
felt(15, 'F5', 0.22, dur=BEAT + 0.015, rel=0.03)
felt(30, 'F5', 0.12, dur=BEAT + 0.015, rel=0.03)  # -6 dB under the VO
felt(45, 'F5', 0.12, dur=2.2)
# ---------------------------------------------------------------- typing (same frames as the picture)
for g in L1_KEYS:
    key(g)
key(L2_BREAK, heavy=True)  # shift+enter
for g in L2_KEYS:
    key(g)
# ---------------------------------------------------------------- the pause: the low D-flat colour note
felt(60, 'Db3', 0.2, pan=0.0, dur=2.0)
# ---------------------------------------------------------------- VO placeholders (breath swells per syllable)
for g, n in VO:
    breath(g, n, gain=0.075, pan=0.05)
# ---------------------------------------------------------------- f90: the dot leaves the screen (pluck)
add(EV['dot_exit'], pluck(HZ['C6'], 0.9, 0.994), pan=-0.35, gain=0.13)
# 94: the eye snap is silent.
# ---------------------------------------------------------------- f97: the Orb's servo (two precise steps)
for k, g in enumerate((97, 98)):
    add(g, tone(1600 + 500 * k, 0.07, ((1, 1.0), (2.01, 0.4)), a=0.002, d=0.03, glide=0.25), pan=0.55, gain=0.05)
    add(g, noise(0.06, lp=0.4, hp=0.7, d=0.02), pan=0.55, gain=0.06)
# ---------------------------------------------------------------- f99-104: the scan "shhk" (peak f100), fan sweeps R->L
s0, s1 = EV['scan']
sd = (s1 - s0 + 1) / 24
sh = noise(sd + 0.1, hp=0.93, sweep=lambda t: 0.25 + 0.5 * math.exp(-t * 9),
           shape=lambda u: (min(1, u / 0.18) ** 0.6) * math.exp(-max(0, u - 0.18) * 3.2))
for i, v in enumerate(sh):
    pan = 0.6 - 1.2 * (i / len(sh))
    j = at(s0) + i
    if 0 <= j < N:
        L[j] += v * 0.3 * math.cos((pan + 1) * math.pi / 4)
        R[j] += v * 0.3 * math.sin((pan + 1) * math.pi / 4)
add(s0, tone(5200, sd, ((1, 1.0),), a=0.004, d=0.12, glide=-0.35), pan=0.4, gain=0.02)  # the lens chirp
# ---------------------------------------------------------------- f105-116: the knee run + Post
for g, nt in ((105, 'G5'), (108, 'Ab5'), (112, 'C6'), (116, 'F6')):
    felt(g, nt, 0.2, pan=-0.05, dur=1.4)
add(EV['click'], noise(0.02, lp=0.8, hp=0.5, d=0.004), pan=-0.1, gain=0.22)  # the mouse click on Post
add(EV['click'], tone(3000, 0.01, ((1, 1.0),), a=0.0002, d=0.002), pan=-0.1, gain=0.06)
# the tokens stream past the lens: a soft glassy tick per chip step, fanning outward
c0, c1 = EV['chips']
for g in range(c0 + 1, c1 + 1):
    for k in range(3):
        add(g + k / 3, tone(2600 + 500 * rng.random() + 300 * (g - c0), 0.05, ((1, 1.0), (2.7, 0.3)), a=0.001, d=0.02), pan=rng.uniform(-0.8, 0.8), gain=0.018)
# ---------------------------------------------------------------- f105-119: reverse-cymbal swell into the white (cut at f120)
sw = (F1 - 105) / 24
add(105, noise(sw, hp=0.9, sweep=lambda t: 0.3 + 0.6 * (t / sw), shape=lambda u: u ** 3.2 * (1 if u < 0.985 else (1 - u) / 0.015)), gain=0.55)

# ---------------------------------------------------------------- master: gentle soft-clip, normalise to about -3 dBFS
peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1
out = wave.open(sys.argv[1] if len(sys.argv) > 1 else 'mcoldopen-scratch-audio.wav', 'wb')
out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
k = 0.708 / peak
frames = bytearray()
for a, b in zip(L, R):
    a, b = math.tanh(a * k * 1.2) / math.tanh(1.2), math.tanh(b * k * 1.2) / math.tanh(1.2)
    frames += struct.pack('<hh', int(a * 32000), int(b * 32000))
out.writeframes(bytes(frames))
out.close()
print('wrote', N / SR, 's')
