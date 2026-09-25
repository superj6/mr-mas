#!/usr/bin/env python3
# MR. MAS — mdinner2: TIMING SCRATCH audio for intro frames 345-479 (5.625 s), synthesised in pure Python
# (polish pass: the freezes are one beat (360-374) and two beats (420-449); the room's murmur and the founders'
# voices come back when the world runs again; the paper wipe is cut, so 396-404 is the held sub)
# (no samples, no deps). Same instrument vocabulary as mdinner1's scratch (its helpers are copied below), so the
# two spans butt together as one score. It is NOT sound design: it exists so the hits, the freezes, the gags and
# the clunk can be heard landing on the 96 BPM / 24 fps grid (15 frames per beat). Real stems replace every line.
# Vocals are not synthesised: each vocal line is a breath-shaped swell at its exact frame (see notes/mdinner2.md).
#   python3 src/dev/mdinner2/tools/scratch_audio.py ../out/pixel/moments/mdinner2-scratch-audio.wav
import math, random, struct, sys, wave

SR = 48000
F0 = 345  # global frame of sample 0
N = int(135 / 24 * SR)
L = [0.0] * N
R = [0.0] * N
rng = random.Random(11)

# ---------------------------------------------------------------- helpers (copied from mdinner1/tools/scratch_audio.py)
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

def tone(freq, dur, harm=((1, 1.0),), a=0.005, d=0.4, sus=0.0, glide=0.0, vib=0.0, rel=0.05, bend=None):
    """bend(t) -> frequency multiplier (for slides/glissandi); glide = the drum-style pitch drop."""
    n = int(dur * SR)
    e = env(n, a, d, sus, rel)
    ph = [0.0] * len(harm)
    out = []
    for i in range(n):
        t = i / SR
        f = freq * (1 + glide * math.exp(-t * 18)) * (1 + vib * math.sin(2 * math.pi * 5.2 * t)) * (bend(t) if bend else 1)
        v = 0.0
        for k, (h, amp) in enumerate(harm):
            ph[k] += 2 * math.pi * f * h / SR
            v += amp * math.sin(ph[k])
        out.append(v * e[i])
    return out

def noise(dur, lp=0.2, hp=0.0, a=0.002, d=0.1, sus=0.0, rel=0.02, sweep=None):
    n = int(dur * SR)
    e = env(n, a, d, sus, rel)
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

HZ = {'Bb1': 58.27, 'F2': 87.31, 'Bb2': 116.54, 'C3': 130.81, 'F3': 174.61, 'G3': 196.00, 'Bb3': 233.08, 'C4': 261.63,
      'Db4': 277.18, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'C5': 523.25, 'Db5': 554.37, 'Eb5': 622.25, 'E5': 659.26,
      'F5': 698.46, 'G5': 783.99, 'C6': 1046.5, 'C2': 65.41}
BRASS = ((1, 1.0), (2, 0.55), (3, 0.38), (4, 0.22), (5, 0.12), (6, 0.07))
ORGAN = ((0.5, 0.5), (1, 1.0), (2, 0.6), (4, 0.25), (3, 0.15))
STRING = ((1, 1.0), (2, 0.5), (3, 0.33), (4, 0.25), (5, 0.2), (6, 0.14), (7, 0.1))
SQ = ((1, 1.0), (3, 0.33), (5, 0.2), (7, 0.14))
FUZZ = ((1, 1.0), (2, 0.8), (3, 0.7), (4, 0.5), (5, 0.45), (6, 0.3), (7, 0.25), (9, 0.15))

def kick(g, gain=0.9):
    add(g, tone(55, 0.45, ((1, 1.0),), a=0.001, d=0.18, glide=1.4), gain=gain)
    add(g, noise(0.02, lp=0.6, d=0.008), gain=gain * 0.25)

def snare(g, gain=0.3, pan=0.0):
    add(g, noise(0.16, lp=0.55, hp=0.4, d=0.05), pan=pan, gain=gain)
    add(g, tone(190, 0.08, ((1, 1.0),), a=0.001, d=0.03, glide=0.4), pan=pan, gain=gain * 0.5)

def hit(g, chord, low, gain=1.0):
    """the freeze HIT (mdinner1's recipe): timpani + brass stab + low piano + 808 + shutter."""
    add(g, tone(HZ[low], 1.6, ((1, 1.0), (1.5, 0.3), (2.0, 0.2)), a=0.002, d=0.55, glide=0.12), gain=0.5 * gain)
    add(g, noise(0.25, lp=0.08, d=0.08), gain=0.35 * gain)
    for k, nm in enumerate(chord):
        add(g, tone(HZ[nm], 0.9, BRASS, a=0.012, d=0.28, sus=0.08, rel=0.3), pan=(k - 1) * 0.35, gain=0.16 * gain)
    add(g, tone(HZ[low] / 2, 2.2, ((1, 1.0), (2, 0.4), (3, 0.2)), a=0.002, d=0.9), gain=0.3 * gain)
    add(g, tone(55, 1.2, ((1, 1.0),), a=0.001, d=0.5, glide=0.5), gain=0.55 * gain)
    add(g, noise(0.05, lp=0.9, hp=0.6, d=0.012), gain=0.35 * gain)
    add(g + 1, noise(0.04, lp=0.9, hp=0.6, d=0.01), gain=0.2 * gain)

def keytick(g, gain=0.2, pan=-0.3, f=2400):
    add(g, noise(0.03, lp=0.7, hp=0.5, d=0.006), pan=pan, gain=gain)
    add(g, tone(f + rng.uniform(-300, 300), 0.02, ((1, 1.0),), a=0.0005, d=0.004), pan=pan, gain=gain * 0.4)

def chime(g, f, gain=0.18, pan=0.5):
    add(g, tone(f, 1.2, ((1, 1.0), (2.76, 0.4), (5.4, 0.15)), a=0.001, d=0.35), pan=pan, gain=gain)

def breath(g, dur, gain=0.12, pan=0.0):
    add(g, noise(dur, a=dur * 0.35, d=dur * 0.4, lp=0.15, hp=0.9, rel=0.08), pan=pan, gain=gain)

def paper(g, dur, gain=0.2, pan=0.0, bright=0.5):
    """paper: crinkly band-passed noise with a grain of clicks"""
    add(g, noise(dur, lp=bright, hp=0.7, a=0.01, d=dur * 0.5, sus=0.3, rel=0.05), pan=pan, gain=gain)
    for k in range(int(dur * 40)):
        if rng.random() < 0.5:
            add(g + k * 24 / 40, noise(0.006, lp=0.9, hp=0.8, d=0.002), pan=pan, gain=gain * 0.5)

def whoosh(g, dur, gain=0.35, pan0=0.0, pan1=0.0, peak=0.5):
    n = int(dur * SR)
    s = noise(dur, a=dur * peak, d=dur * 0.3, sweep=lambda t: 0.04 + 0.45 * math.sin(min(1, t / dur) * math.pi), rel=0.05)
    for i in range(n):  # pan travels across the stereo field
        p = pan0 + (pan1 - pan0) * i / n
        j = at(g) + i
        if 0 <= j < N:
            L[j] += s[i] * gain * math.cos((p + 1) * math.pi / 4)
            R[j] += s[i] * gain * math.sin((p + 1) * math.pi / 4)

def buzz(g, dur, gain=0.05, pan=0.0):
    """neon transformer hum: 120 Hz + odd harmonics, a little rattle"""
    add(g, tone(120, dur, ((1, 1.0), (3, 0.5), (5, 0.3), (7, 0.2), (9, 0.12)), a=0.01, d=9, sus=0.9, rel=0.02), pan=pan, gain=gain)
    add(g, noise(dur, lp=0.5, hp=0.9, a=0.01, d=9, sus=0.8, rel=0.02), pan=pan, gain=gain * 0.25)

# ================================================================ 345-359 · 6.4 the vault (mdinner1 plays the same cues)
for i, g in enumerate([345, 352.5]):  # two-tone klaxon on eighths (soft, filtered) — cut dead at 360
    add(g, tone(HZ['Bb3'] * (1 if i % 2 == 0 else 1.26), 0.28, SQ, a=0.01, d=0.2, sus=0.5, rel=0.05), pan=0.4, gain=0.05)
add(345, noise(1.2, a=0.2, d=0.8, lp=0.06, hp=0.95, rel=0.3), pan=0.45, gain=0.12)  # steam
for g in (345, 347, 349):  # the door's servo: one clunk per held drawing
    add(g, tone(95, 0.12, ((1, 1.0), (2, 0.4)), a=0.002, d=0.05, glide=0.3), pan=0.35, gain=0.18)
    add(g, noise(0.05, lp=0.3, d=0.02), pan=0.35, gain=0.12)
for g, f in ((348, HZ['C5']), (352, HZ['Eb5']), (356, HZ['F5'])):  # RED-TEAMED ticks: triple chime
    chime(g, f, 0.12, 0.45)
for k, (g, nm) in enumerate(((345, 'Bb3'), (348.75, 'Db4'), (352.5, 'F4'), (356.25, 'Db4'))):  # pizzicato under it
    add(g, tone(HZ[nm], 0.25, ((1, 1.0), (2, 0.3), (3, 0.1)), a=0.002, d=0.07), pan=-0.2, gain=0.1)
kick(345, 0.5)
for g in (350, 352):  # fleece, stepping over the sill
    add(g, noise(0.12, lp=0.12, hp=0.3, a=0.01, d=0.05), pan=0.35, gain=0.1)
breath(357, 0.14, 0.16, 0.35)  # VOCAL (Mario): the inhale before "well, actually—" ... the freeze cuts it off

# ================================================================ 360 · 7.1 MARIO FREEZE: HIT on Bb minor, klaxon cut dead
hit(360, ['Bb3', 'Db4', 'F4'], 'Bb2')
add(361, tone(HZ['Bb1'], 15 / 24, ORGAN, a=0.3, d=9, sus=0.6, rel=0.2), gain=0.05)  # held low fifth: one beat of stopped world
add(361, tone(HZ['F2'], 15 / 24, ORGAN, a=0.3, d=9, sus=0.6, rel=0.2), gain=0.035)
# the sighing violin glissando: F5 sinks to Db5 over a beat and a half, then holds, thin vibrato (score: it plays on
# over the running room)
add(362, tone(HZ['F5'], 1.9, STRING, a=0.25, d=9, sus=0.8, vib=0.006, rel=0.5,
              bend=lambda t: 2 ** (-(4 / 12) * min(1, max(0, (t - 0.25) / 0.9)))), pan=-0.25, gain=0.045)
for i in range(14):  # the one fine-print line: WORD COUNT racing, typewriter ticks accelerating (366 -> 374)
    t = 366 + 8 * (1 - (1 - i / 13) ** 1.6)
    keytick(t, 0.06 + 0.005 * i, pan=-0.45, f=1800)
# 375 · 7.2 the world runs again under the card: the room's murmur comes back, and Mario finally talks
add(375, noise(30 / 24, lp=0.05, hp=0.97, a=0.05, d=9, sus=0.7, rel=0.3), pan=0.1, gain=0.07)  # room walla (placeholder)
for k, g in enumerate((375, 377, 379.5, 381, 383)):  # VOCAL (Mario): "well, actually— ..." as syllable-shaped swells
    breath(g, 0.07 + 0.02 * (k % 2), 0.13, 0.45)
paper(375, 0.5, 0.18, 0.55)  # the essay drops from his hand to the cloth...
whoosh(376, 0.4, 0.14, 0.6, -0.1, peak=0.4)  # ...and races down the table toward Mas (paper rush, panning left)
whoosh(384, 0.3, 0.3, 0.6, -0.6)  # the whip left with the scroll
paper(386, 0.18, 0.2, -0.2)  # the roll bumps Mas's hands
paper(390, 0.08, 0.2, 0.0, 0.7)  # grab
paper(391, 0.17, 0.12, 0.0, 0.3)  # rolled into a tube
add(395, tone(160, 0.08, ((1, 1.0), (2, 0.5)), a=0.001, d=0.03, glide=0.6), gain=0.12)  # the tube: a papery "thup"
# 396-404: he peers up through it. Something above: a sub, felt more than heard, swelling into the crack at 405
add(396, tone(38, 9 / 24, ((1, 1.0), (2, 0.2)), a=0.25, d=9, sus=0.95, rel=0.02, bend=lambda t: 1 + 0.25 * t), gain=0.14)

# ================================================================ 405-419 · 7.4 the booster
add(405, noise(0.35, lp=0.9, hp=0.3, d=0.06), gain=0.5)  # the ceiling cracks
add(405, tone(48, 0.8, ((1, 1.0), (2, 0.3)), a=0.001, d=0.3, glide=0.8), gain=0.5)  # boom
for i in range(24):  # debris: plaster and lath raining on the cloth
    add(406 + rng.uniform(0, 12), noise(0.02, lp=0.6, hp=0.5, d=0.006), pan=rng.uniform(0.1, 0.6), gain=0.08)
# rocket roar: rising, filtered, its boom is folded into the 420 sub (it ends at 419)
add(406, noise(14 / 24, a=0.4, d=9, sus=1.0, sweep=lambda t: 0.05 + 0.25 * t, rel=0.02), pan=0.25, gain=0.45)
add(406, tone(40, 14 / 24, ((1, 1.0), (2, 0.5), (3, 0.3)), a=0.3, d=9, sus=1.0, rel=0.02, bend=lambda t: 1 + t * 0.6), pan=0.25, gain=0.22)
# fuzz-guitar pickup: a C power chord swelling up into the downbeat
for nm in ('C3', 'G3', 'C4'):
    add(414, tone(HZ[nm], 6 / 24, FUZZ, a=0.18, d=9, sus=1.0, rel=0.01), pan=0.1, gain=0.05)
add(410, noise(0.4, lp=0.1, a=0.05, d=0.2), pan=-0.3, gain=0.1)  # candles gutter in the downdraft
for i, g in enumerate((412, 413.5, 415, 416, 417.5, 418.5)):  # glasses: clinks + slosh (never Mas's)
    add(g, tone(2800 + i * 170, 0.2, ((1, 1.0), (2.4, 0.4)), a=0.001, d=0.06), pan=[-0.6, 0.5, -0.3, 0.7, 0.2, -0.5][i], gain=0.05)
    add(g, noise(0.12, lp=0.15, a=0.01, d=0.05), pan=[-0.6, 0.5, -0.3, 0.7, 0.2, -0.5][i], gain=0.05)
buzz(412, 1 / 24, 0.06, -0.1)  # the neon OPEN flickers on: on / off / on
buzz(414, 6 / 24, 0.05, -0.1)
add(415, noise(0.05, lp=0.4, d=0.02), pan=0.2, gain=0.12)  # hatch pops

# ================================================================ 420 · 8.1 NOLE FREEZE: the biggest HIT, C major (E natural)
hit(420, ['C4', 'E4', 'G4'], 'C3', gain=1.25)
add(420, tone(34, 1.8, ((1, 1.0),), a=0.001, d=0.8, glide=0.6), gain=0.55)  # the rocket's boom, folded into the sub
for nm in ('C3', 'G3', 'C4'):  # the power chord lands with it
    add(420, tone(HZ[nm], 1.4, FUZZ, a=0.005, d=0.6, sus=0.2, rel=0.4), pan=0.1, gain=0.06)
for k, nm in enumerate(('C5', 'E5', 'G5', 'C6')):  # brass fanfare figure
    add(420 + k * 2, tone(HZ[nm], 0.5, BRASS, a=0.01, d=0.2, sus=0.1, rel=0.15), pan=0.3 - k * 0.2, gain=0.08)
add(421, tone(HZ['C2'], 29 / 24, ORGAN, a=0.5, d=9, sus=0.6, rel=0.25), gain=0.05)  # held C / G / E pad: two beats of stopped world
add(421, tone(HZ['G3'], 29 / 24, ORGAN, a=0.6, d=9, sus=0.6, rel=0.25), gain=0.03)
add(421, tone(HZ['E4'], 29 / 24, ORGAN, a=0.7, d=9, sus=0.6, rel=0.25), gain=0.02)
add(422, noise(0.06, lp=0.4, d=0.02), pan=-0.6, gain=0.15)  # the card slams down
# 435 · 8.2: the stamp — a thunk tuned to C, with the rubber slap
add(435, tone(HZ['C3'], 0.35, ((1, 1.0), (2, 0.35), (3, 0.1)), a=0.001, d=0.12, glide=0.25), pan=-0.3, gain=0.4)
add(435, noise(0.06, lp=0.35, d=0.02), pan=-0.3, gain=0.3)
# 450 · 8.3: the world runs again. LEDGER on the check: a dry mechanical register tick, no bell, no "ka-ching"
add(450, noise(0.03, lp=0.8, hp=0.6, d=0.008), pan=0.25, gain=0.25)
add(450.5, tone(1200, 0.04, ((1, 1.0), (1.5, 0.5)), a=0.0005, d=0.01), pan=0.25, gain=0.08)
add(450, noise(15 / 24, lp=0.06, hp=0.95, a=0.02, d=0.5, sus=0.3, rel=0.2), pan=0.3, gain=0.12)  # the smoke rolls off the pads (hiss)
add(450, noise(29 / 24, lp=0.05, hp=0.97, a=0.05, d=9, sus=0.7, rel=0.3), pan=0.1, gain=0.06)  # room walla returns (placeholder)
for k, g in enumerate((451, 453, 455.5, 458)):  # VOCAL (Nole): pitching from the hatch, syllable-shaped swells
    breath(g, 0.08, 0.12, 0.35)
for k in range(5):  # the hull ticks as the engine bell cools
    add(452 + k * 2.6, tone(4100 - k * 150, 0.03, ((1, 1.0),), a=0.0005, d=0.008), pan=0.3, gain=0.03)
add(453, tone(3300, 0.25, ((1, 1.0), (2.3, 0.3)), a=0.001, d=0.08), pan=-0.05, gain=0.035)  # Mas lifts the glass: a tiny ring
add(457, noise(0.08, lp=0.1, a=0.02, d=0.04), pan=-0.05, gain=0.04)  # the sip (almost nothing)
add(464, tone(2900, 0.2, ((1, 1.0), (2.3, 0.3)), a=0.001, d=0.06), pan=-0.05, gain=0.035)  # and sets it down

# ================================================================ 465-479 · 8.4 the founding
buzz(465, 15 / 24, 0.045, -0.15)  # the sign hums under his hand
add(466, noise(0.03, lp=0.7, hp=0.5, d=0.01), pan=-0.15, gain=0.15)  # the N unhooks
add(468, noise(4 / 24, lp=0.4, hp=0.7, a=0.01, d=0.2, sus=0.6), pan=-0.1, gain=0.12)  # it slides along the rail
add(473, tone(HZ['F3'], 0.3, ((1, 1.0), (2.1, 0.35), (3.3, 0.15)), a=0.001, d=0.08), pan=-0.3, gain=0.35)  # CLUNK (tuned to F: home)
add(473, noise(0.05, lp=0.5, d=0.015), pan=-0.3, gain=0.25)
add(474, noise(0.02, lp=0.9, hp=0.5, d=0.006), pan=0.2, gain=0.15)  # AI: the ignition tick, then its buzz
buzz(474, 1 / 24, 0.04, 0.2)
buzz(476, 4 / 24, 0.04, 0.2)
for i, g in enumerate((472, 473.875, 475.75, 476.7, 477.6, 478.5, 479.1)):  # drum fill into bar 9 (480)
    snare(g, 0.12 + 0.03 * i, pan=(i % 2) * 0.3 - 0.15)
kick(472, 0.4)
kick(476, 0.45)

# ---------------------------------------------------------------- master: gentle soft-clip, normalise to -3 dBFS (as mdinner1)
peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1
out = wave.open(sys.argv[1] if len(sys.argv) > 1 else 'mdinner2-scratch-audio.wav', 'wb')
out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
k = 0.708 / peak
frames = bytearray()
for a, b in zip(L, R):
    a, b = math.tanh(a * k * 1.2) / math.tanh(1.2), math.tanh(b * k * 1.2) / math.tanh(1.2)
    frames += struct.pack('<hh', int(a * 32000), int(b * 32000))
out.writeframes(bytes(frames))
out.close()
print('wrote', N / SR, 's')
