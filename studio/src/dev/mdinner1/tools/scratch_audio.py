#!/usr/bin/env python3
# MR. MAS — mdinner1: TIMING SCRATCH audio for intro frames 225-359 (5.625 s), synthesised from scratch in pure
# Python (no samples, no deps). It is NOT sound design: it exists so the hits, the freezes and the gags can be
# heard landing on the 96 BPM / 24 fps grid (15 frames per beat). Real stems replace every line of this.
# Vocals (whispered "FEEL" / "THE", shouted "A-G-I!") are NOT synthesised: they are marked by soft breath swells
# at their exact frames so the timing is audible; the cue sheet is in notes/mdinner1.md.
#   python3 src/dev/mdinner1/tools/scratch_audio.py ../out/pixel/moments/mdinner1-scratch-audio.wav
import math, random, struct, sys, wave

SR = 48000
F0 = 225  # global frame of sample 0
N = int(135 / 24 * SR)
L = [0.0] * N
R = [0.0] * N
rng = random.Random(7)

def at(g):  # global frame -> sample index
    return int(round((g - F0) / 24 * SR))

def add(g, samples, pan=0.0, gain=1.0):
    s0 = at(g) if isinstance(g, (int, float)) else g
    gl, gr = gain * math.cos((pan + 1) * math.pi / 4), gain * math.sin((pan + 1) * math.pi / 4)
    for i, v in enumerate(samples):
        j = s0 + i
        if 0 <= j < N:
            L[j] += v * gl
            R[j] += v * gr

def env(n, a, d, sus=0.0, rel=None):
    """attack a s, exponential decay d s toward sus; optional release tail."""
    out = []
    na = max(1, int(a * SR))
    for i in range(n):
        t = i / SR
        if i < na:
            out.append(i / na)
        else:
            out.append(sus + (1 - sus) * math.exp(-(t - a) / max(1e-4, d)))
    if rel:
        nr = int(rel * SR)
        for i in range(max(0, n - nr), n):
            out[i] *= (n - i) / nr
    return out

def tone(freq, dur, harm=((1, 1.0),), a=0.005, d=0.4, sus=0.0, glide=0.0, vib=0.0, rel=0.05):
    n = int(dur * SR)
    e = env(n, a, d, sus, rel)
    ph = [0.0] * len(harm)
    out = []
    for i in range(n):
        t = i / SR
        f = freq * (1 + glide * math.exp(-t * 18)) * (1 + vib * math.sin(2 * math.pi * 5.2 * t))
        v = 0.0
        for k, (h, amp) in enumerate(harm):
            ph[k] += 2 * math.pi * f * h / SR
            v += amp * math.sin(ph[k])
        out.append(v * e[i])
    return out

def noise(dur, lp=0.2, hp=0.0, a=0.002, d=0.1, sus=0.0, rel=0.02, sweep=None):
    """filtered noise; lp/hp are one-pole coefficients (0..1); sweep(t)->lp overrides lp."""
    n = int(dur * SR)
    e = env(n, a, d, sus, rel)
    y = yh = 0.0
    prev = 0.0
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

HZ = {'F1': 43.65, 'F2': 87.31, 'C3': 130.81, 'Db3': 138.59, 'F3': 174.61, 'Ab3': 207.65, 'C4': 261.63, 'Db4': 277.18,
      'F4': 349.23, 'Ab4': 415.30, 'C5': 523.25, 'Eb5': 622.25, 'F5': 698.46, 'Ab2': 103.83, 'Db2': 69.30, 'Bb3': 233.08}
BRASS = ((1, 1.0), (2, 0.55), (3, 0.38), (4, 0.22), (5, 0.12), (6, 0.07))
ORGAN = ((0.5, 0.5), (1, 1.0), (2, 0.6), (4, 0.25), (3, 0.15))
AH = ((1, 1.0), (2, 0.5), (3, 0.35), (4, 0.42), (5, 0.3), (6, 0.12))  # a vowel-ish "ah" spectrum

def kick(g, gain=0.9):
    add(g, tone(55, 0.45, ((1, 1.0),), a=0.001, d=0.18, glide=1.4), gain=gain)
    add(g, noise(0.02, lp=0.6, d=0.008), gain=gain * 0.25)

def hit(g, chord, low, gain=1.0):
    """the freeze HIT: timpani + brass stab + low piano + 808 + shutter."""
    add(g, tone(HZ[low], 1.6, ((1, 1.0), (1.5, 0.3), (2.0, 0.2)), a=0.002, d=0.55, glide=0.12), gain=0.5 * gain)  # timpani
    add(g, noise(0.25, lp=0.08, d=0.08), gain=0.35 * gain)  # skin
    for k, nm in enumerate(chord):
        add(g, tone(HZ[nm], 0.9, BRASS, a=0.012, d=0.28, sus=0.08, rel=0.3), pan=(k - 1) * 0.35, gain=0.16 * gain)  # brass
    add(g, tone(HZ[low] / 2, 2.2, ((1, 1.0), (2, 0.4), (3, 0.2)), a=0.002, d=0.9), gain=0.3 * gain)  # low piano
    add(g, tone(55, 1.2, ((1, 1.0),), a=0.001, d=0.5, glide=0.5), gain=0.55 * gain)  # 808
    add(g, noise(0.05, lp=0.9, hp=0.6, d=0.012), gain=0.35 * gain)  # shutter
    add(g + 1, noise(0.04, lp=0.9, hp=0.6, d=0.01), gain=0.2 * gain)

def keytick(g, gain=0.2, pan=-0.3):
    add(g, noise(0.03, lp=0.7, hp=0.5, d=0.006), pan=pan, gain=gain)
    add(g, tone(2400 + rng.uniform(-300, 300), 0.02, ((1, 1.0),), a=0.0005, d=0.004), pan=pan, gain=gain * 0.4)

def chime(g, f, gain=0.18, pan=0.5):
    add(g, tone(f, 1.2, ((1, 1.0), (2.76, 0.4), (5.4, 0.15)), a=0.001, d=0.35), pan=pan, gain=gain)

def breath(g, dur, gain=0.12, pan=0.0):  # vocal placeholder: a breath-shaped swell at the vocal's frame
    add(g, noise(dur, a=dur * 0.35, d=dur * 0.4, lp=0.15, hp=0.9, rel=0.08), pan=pan, gain=gain)

# ---------------------------------------------------------------- 225-239 · the dinner (pickup)
add(225, tone(174.61, 0.25, ((1, 1.0), (2, 0.3)), a=0.01, d=0.2, glide=-0.35), gain=0.12)  # tape spins up to speed
kick(225, 0.7)
for i in range(16):  # mechanical-keyboard snare roll: 16ths -> 32nds, crescendo into the hit
    g = 225 + i * (15 / 16) * (1 if i < 8 else 0.9)
    keytick(g, gain=0.06 + 0.012 * i, pan=-0.35 + rng.uniform(-0.1, 0.1))
keytick(232, 0.25, pan=-0.5)  # the napkin becomes a website (a tiny UI tick)
# ---------------------------------------------------------------- 240 · GERG FREEZE: HIT on F minor
# the world is printed for ONE beat (240-254); the card holds over the live room until 285
hit(240, ['F3', 'Ab3', 'C4'], 'F2')
add(241, tone(HZ['F2'], 14 / 24, ORGAN, a=0.1, d=9, sus=0.6, rel=0.12), gain=0.05)  # held low fifth, no third: the print
add(241, tone(HZ['C3'], 14 / 24, ORGAN, a=0.1, d=9, sus=0.6, rel=0.12), gain=0.035)
# Mas's gag, foley only: the key is plucked out of the frozen air (248), pocketed as the room resumes (254)
add(248, noise(0.05, lp=0.5, hp=0.3, d=0.015), pan=0.1, gain=0.18)
add(248, tone(1760, 0.08, ((1, 1.0), (2.2, 0.3)), a=0.0005, d=0.03), pan=0.1, gain=0.06)
add(254, noise(0.18, lp=0.12, a=0.02, d=0.08), pan=0.1, gain=0.15)
# 255: the world resumes mid-motion: the kit and Gerg's keys come back in (one key short), walla under
add(255, tone(174.61, 0.12, ((1, 1.0),), a=0.005, d=0.1, glide=0.25), gain=0.08)  # a tiny tape catch
for g in (255, 262.5, 270, 277.5):
    kick(g, 0.4)
for i in range(22):
    keytick(255 + i * 1.35, gain=0.05 + 0.02 * (i % 3 == 0), pan=-0.4 + rng.uniform(-0.08, 0.08))
add(255, noise(30 / 24, a=0.15, d=1.0, lp=0.05, hp=0.97, rel=0.2), pan=0.0, gain=0.06)  # room walla, low
# ---------------------------------------------------------------- 285-299 · the cathedral wakes, ALYI rises
for k, g in enumerate(range(285, 289)):  # rack LEDs power on: a rising run of soft blips
    add(g, tone(880 * 2 ** (k / 6), 0.06, ((1, 1.0),), a=0.001, d=0.03), pan=0.6, gain=0.05)
breath(285, 0.45, 0.16, -0.1)   # VOCAL (whispered) "FEEL"
breath(292, 0.4, 0.16, 0.1)     # VOCAL (whispered) "THE"
add(285, tone(HZ['Db3'], 15 / 24 + 0.2, ORGAN, a=0.55, d=4, sus=0.9, rel=0.1), gain=0.09)  # organ swell into Db
add(285, tone(HZ['F3'], 15 / 24 + 0.2, ORGAN, a=0.6, d=4, sus=0.9, rel=0.1), gain=0.07)
add(285, tone(HZ['Ab3'], 15 / 24 + 0.2, ORGAN, a=0.65, d=4, sus=0.9, rel=0.1), gain=0.06)
chime(292, HZ['F5'], 0.1, 0.5)  # the rose window lights (glyph boot 292-293)
chime(293, HZ['C5'], 0.06, 0.5)
add(296, noise(0.7, a=0.02, d=0.22, sweep=lambda t: 0.35 * math.exp(-t * 5) + 0.03), pan=0.25, gain=0.5)  # flame whoomph
add(296, tone(70, 0.4, ((1, 1.0),), a=0.005, d=0.15, glide=0.8), pan=0.25, gain=0.3)
# ---------------------------------------------------------------- 300 · ALYI FREEZE: HIT on Db
hit(300, ['Db4', 'F4', 'Ab4'], 'Db3')
for g in (300, 303, 307):  # VOCAL (shouted) "A" - "G" - "I!": marked, not sung
    breath(g, 0.12, 0.2, 0.05)
for k, nm in enumerate(['Db3', 'F3', 'Ab3', 'C4']):  # wordless choir enters (vowel "ah"), no vibrato until it settles
    add(301, tone(HZ[nm], 40 / 24, AH, a=0.5, d=9, sus=0.85, vib=0.004, rel=0.35), pan=(k - 1.5) * 0.3, gain=0.045)
for g in (315, 316, 317):  # 6.2: his eyes open as token streams (a tiny digital shimmer)
    add(g, tone(3520 + (g - 315) * 440, 0.05, ((1, 1.0),), a=0.001, d=0.02), pan=-0.6, gain=0.03)
for g in (324, 326, 327):  # the telescoping fork: three clicks
    keytick(g, 0.16, pan=0.15)
# 315-339: the room is live again: the effigy fire crackles while he toasts a marshmallow on it
for i in range(14):
    add(315 + i * 1.8 + rng.uniform(0, 0.6), noise(0.03, lp=0.6, hp=0.4, d=0.01), pan=0.25, gain=0.07 + 0.03 * rng.random())
add(337, noise(0.06, lp=0.3, d=0.02), pan=0.0, gain=0.12)  # the bite
# ---------------------------------------------------------------- 340-344 · flame wipe through the lens-side candle
add(339, noise(0.35, a=0.12, d=0.12, sweep=lambda t: 0.04 + 0.5 * math.sin(min(1, t / 0.3) * math.pi)), pan=0.0, gain=0.38)
# ---------------------------------------------------------------- 345-359 · the vault (hand-off to mdinner2's MARIO)
SQ = ((1, 1.0), (3, 0.33), (5, 0.2), (7, 0.14))
for i, g in enumerate([345, 352.5]):  # two-tone klaxon on eighths (soft, filtered)
    add(g, tone(HZ['Bb3'] * (1 if i % 2 == 0 else 1.26), 0.28, SQ, a=0.01, d=0.2, sus=0.5, rel=0.05), pan=0.4, gain=0.05)
add(345, noise(1.2, a=0.2, d=0.8, lp=0.06, hp=0.95, rel=0.3), pan=0.45, gain=0.12)  # steam
for g, f in ((348, HZ['C5']), (352, HZ['Eb5']), (356, HZ['F5'])):  # RED-TEAMED ticks: triple chime
    chime(g, f, 0.12, 0.45)
kick(345, 0.5)

# ---------------------------------------------------------------- master: gentle soft-clip, normalise to -3 dBFS
peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1
out = wave.open(sys.argv[1] if len(sys.argv) > 1 else 'mdinner1-scratch-audio.wav', 'wb')
out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
k = 0.708 / peak
frames = bytearray()
for a, b in zip(L, R):
    a, b = math.tanh(a * k * 1.2) / math.tanh(1.2), math.tanh(b * k * 1.2) / math.tanh(1.2)
    frames += struct.pack('<hh', int(a * 32000), int(b * 32000))
out.writeframes(bytes(frames))
out.close()
print('wrote', N / SR, 's')
