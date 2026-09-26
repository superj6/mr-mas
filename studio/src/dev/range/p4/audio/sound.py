"""MR. MAS · style range · prototype 4 · THE TEMP SOUND PASS: rooms, devices and one continuous cue, then the mux.

Everything here is procedural or from the show's own SFX board (audio/sfx/wav, original work). No dialogue, no
voice of any person: the commentator, the chamber's speaker and the interpreter are WORDLESS babble made from a
pulse source through moving vowel formants (never intelligible, never modelled on anyone).

Layers, by clip (reel frames at 24 fps; style-range §7.4's sound column):
  4a  boardroom room tone; the stadium broadcast (crowd, the stadium PA, a booth murmur) band-limited through the
      TV's speaker, opening to full broadcast range on the cut (p30), back through the speaker at p150
  4b  the bullpen's day air (HVAC, a far keyboard); the launch stream's compressed room (an audience, a little
      applause) through a codec; one soft tick per chat burst; out through the wall screen's small speaker
  4c  the chamber's murmur; on the webcast cut the chamber PA through the webcast (flat, compressed) with a faint
      wordless interpretation channel doubled under it; the pixel room's bed back in full on the close (p480)
  4d  the lobby (tone, the racks' hum, the neon); the aperture in and out, one scan tone, one low open fifth on NOT
      VERIFIED, a tiny stamp; footsteps, the rope's clink
  cue the engine-rendered temp cue (cue.py) runs through all four, thinned where the devices take the air

  ../../../../../../audio/.venv-theme/bin/python sound.py --cue <scratch>/cue --picture <p4-picture.mp4> --out <p4.mp4>
"""
import os
import sys
import argparse
import subprocess
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..'))
SFX = os.path.join(ROOT, 'audio', 'sfx', 'wav')
sys.path.insert(0, os.path.join(ROOT, 'audio', 'ost'))
from engine.era import futz  # noqa: E402

SR = 48000
DUR = 30.0
N = int(DUR * SR)


def fr(f):
    return int(round(f / 24.0 * SR))


def db(x):
    return 10 ** (x / 20)


def sos_(kind, f, order=4):
    return butter(order, f, btype=kind, fs=SR, output='sos')


def hp(x, f, o=4):
    return sosfilt(sos_('highpass', f, o), x, axis=-1)


def lp(x, f, o=4):
    return sosfilt(sos_('lowpass', f, o), x, axis=-1)


def bp(x, lo, hi, o=2):
    return sosfilt(sos_('bandpass', [lo, hi], o), x, axis=-1)


def st(x):
    x = np.asarray(x, dtype=np.float64)
    return np.stack([x, x]) if x.ndim == 1 else x


def load(name):
    x, sr = sf.read(os.path.join(SFX, name + '.wav'), always_2d=True)
    assert sr == SR
    return x.T.astype(np.float64)


def loop_to(x, n):
    reps = int(np.ceil(n / x.shape[1])) + 1
    return np.tile(x, (1, reps))[:, :n]


def place(bus, x, at, gain=1.0):
    x = st(x)
    a = max(0, at)
    b = min(bus.shape[1], at + x.shape[1])
    if b > a:
        bus[:, a:b] += x[:, a - at:b - at] * gain


def env(points, n=N):
    """piecewise-linear gain envelope from [(frame, dB)] (frames in reel time)"""
    xs = [fr(f) for f, _ in points]
    ys = [db(d) for _, d in points]
    return np.interp(np.arange(n), xs, ys)


def rms_norm(x, target_db):
    r = np.sqrt(np.mean(np.square(x)) + 1e-12)
    return x * db(target_db) / r


def reverb(x, dur=1.6, decay=0.45, lo=200, hi=6000, wet=0.35, seed=1):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    irs = []
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / decay * 3)
        ir = bp(ir, lo, hi, 2)
        ir[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    x = st(x)
    y = np.stack([fftconvolve(x[c], irs[c])[:x.shape[1]] for c in range(2)])
    return x * (1 - wet) + y * wet


def pink(n, rng):
    w = rng.standard_normal(n)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    from scipy.signal import lfilter
    y = lfilter(b, a, w)
    return y / (np.std(y) + 1e-9)


# ------------------------------------------------------------------ wordless babble
VOWELS = [(800, 1200, 2500), (500, 1800, 2500), (320, 2200, 2900), (520, 900, 2400), (360, 800, 2300), (560, 1500, 2500)]


def babble(dur, f0=120.0, speed=1.0, seed=0, lively=0.12, pauses=True):
    """Wordless speech-like murmur: syllables of a pulse source through fixed vowel formants, with onsets, pitch
    contour and phrase pauses. Never words; never anyone's voice."""
    rng = np.random.default_rng(seed)
    out = np.zeros(int(dur * SR) + SR)
    t = rng.uniform(0, 0.3)
    k = 0
    phrase_left = rng.integers(4, 11)
    while t < dur:
        L = rng.uniform(0.09, 0.24) / speed
        n = int(L * SR)
        tt = np.arange(n) / SR
        # intonation: a slow declination across the phrase, a lift on stressed syllables
        f = f0 * (1 + lively * np.sin(0.7 * t + rng.uniform(0, 6))) * (1 + (0.08 if rng.random() < 0.3 else 0) * np.exp(-tt * 8))
        f = f * (1 + 0.01 * rng.standard_normal())
        ph = np.cumsum(f / SR)
        # a glottal-ish pulse with the voice's spectral tilt (low-passed) and breath mixed in: murmur, not a buzz
        src = lp((ph % 1.0) ** 3 - 0.25, 1600, 2) + 0.22 * bp(rng.standard_normal(n), 400, 5000, 1)
        # coarticulation: each syllable glides from one vowel's formants toward the next (a crossfade between the two
        # filtered versions), with a little shimmer, so it moves like speech rather than holding a buzzy vowel
        def formants(v):
            F1, F2, F3 = VOWELS[v]
            return bp(src, F1 * 0.8, F1 * 1.25, 1) * 1.0 + bp(src, F2 * 0.88, F2 * 1.12, 1) * 0.55 + bp(src, F3 * 0.92, F3 * 1.08, 1) * 0.25
        va, vb_ = rng.integers(0, len(VOWELS)), rng.integers(0, len(VOWELS))
        w = np.clip((tt / L - 0.25) / 0.6, 0, 1)
        y = formants(va) * (1 - w) + formants(vb_) * w
        y *= 1 + 0.06 * np.sin(2 * np.pi * rng.uniform(5, 8) * tt + rng.uniform(0, 6))
        e = np.minimum(1, tt / 0.018) * np.minimum(1, (L - tt) / 0.05).clip(0, 1)
        y = y * e * rng.uniform(0.55, 1.0)
        a = int(t * SR)
        out[a:a + n] += y
        if rng.random() < 0.35:  # a consonant onset: a short noise burst
            m = int(rng.uniform(0.012, 0.03) * SR)
            nb = hp(rng.standard_normal(m), rng.uniform(1800, 4000), 2) * np.linspace(1, 0, m) * 0.25
            out[a:a + m] += nb
        t += L + rng.uniform(0.005, 0.03)
        k += 1
        phrase_left -= 1
        if pauses and phrase_left <= 0:
            t += rng.uniform(0.18, 0.55)
            phrase_left = rng.integers(4, 11)
    out = out[:int(dur * SR)]
    return out / (np.std(out) + 1e-9)


def crowd(dur, seed=0, voices=18, cheers=(), roar_db=-6):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    x = np.zeros((2, n))
    for v in range(voices):
        b = babble(dur, f0=rng.uniform(100, 250), speed=rng.uniform(0.9, 1.3), seed=seed * 100 + v, lively=0.18)
        pan = rng.uniform(0.2, 0.8)
        x[0] += b * (1 - pan) * rng.uniform(0.4, 1.0)
        x[1] += b * pan * rng.uniform(0.4, 1.0)
    x /= np.sqrt(voices)
    roar = np.stack([pink(n, rng), pink(n, rng)])
    roar = bp(roar, 250, 2600, 2)
    swell = 1 + 0.25 * np.sin(np.arange(n) / SR * 2 * np.pi * 0.23 + 1) + 0.15 * np.sin(np.arange(n) / SR * 2 * np.pi * 0.61)
    roar *= swell
    # cheers: the roar rises, applause and a few whoops (pitch-bent babble, never a meme sound)
    g = np.ones(n)
    claps = np.zeros(n)
    for (t0, peak, length) in cheers:
        a = int(t0 * SR)
        tt = np.arange(n - a) / SR
        shape = np.where(tt < 0.35, tt / 0.35, np.exp(-(tt - 0.35) / length))
        g[a:] += (db(peak) - 1) * shape
        m = int((0.35 + length * 2.5) * SR)
        cl = np.zeros(m)
        k = int(m / SR * 38)
        for _ in range(k):
            p = rng.integers(0, m - 300)
            cl[p:p + 200] += rng.standard_normal(200) * np.exp(-np.arange(200) / 40) * rng.uniform(0.3, 1.0)
        cl = bp(cl, 900, 5000, 2) * np.exp(-np.arange(m) / SR / (length * 1.2))
        claps[a:a + m] += cl[:max(0, min(m, n - a))]
    x = x * g * 0.8 + roar * db(roar_db) * g + st(claps / (np.std(claps) + 1e-9) * 0.35 if np.any(claps) else claps)
    return reverb(x, dur=1.8, decay=0.6, wet=0.45, seed=seed + 7)


def blip(freq, dur=0.05, decay=0.012, shape='sine'):
    t = np.arange(int(dur * SR)) / SR
    w = np.sin(2 * np.pi * freq * t) if shape == 'sine' else 2 * np.abs(2 * ((freq * t) % 1) - 1) - 1
    return w * np.exp(-t / decay) * np.minimum(1, t / 0.002)


def footstep(seed, hard=True):
    rng = np.random.default_rng(seed)
    m = int(0.09 * SR)
    t = np.arange(m) / SR
    thump = lp(rng.standard_normal(m), 500, 2) * np.exp(-t / 0.02)
    click = hp(rng.standard_normal(m), 2200, 2) * np.exp(-t / 0.004) * (0.5 if hard else 0.2)
    return (thump * 1.4 + click)


def codec(x, band=(140, 7000), bits=10, rate=16000):
    """a stream's honest compression: band limit, a light sample-and-hold at a lower rate, a coarse quantiser, mixed
    under the band-limited signal (so it sounds like a codec, never like a broken one)"""
    y = bp(st(x), band[0], band[1], 3)
    step = SR // rate
    z = np.repeat(y[:, ::step], step, axis=1)[:, :y.shape[1]]
    q = 2 ** (bits - 1)
    z = np.round(z / (np.max(np.abs(z)) + 1e-9) * q) / q * (np.max(np.abs(z)) + 1e-9)
    z = lp(z, band[1], 4)
    m = 0.5 * (y[0] + y[1])
    y = np.stack([m, m])
    return y * 0.7 + z * 0.3


def compress(x, amount=3.0):
    pk = np.max(np.abs(x)) + 1e-9
    return np.tanh(amount * x / pk) / np.tanh(amount) * pk


# ------------------------------------------------------------------ the pass
def build(cue_dir):
    rng = np.random.default_rng(11)
    bus = {k: np.zeros((2, N)) for k in ('music', 'room', 'device', 'sfx')}

    # ---- the cue: the engine's family stems, ridden per clip (it never stops: it thins and ducks)
    stems = {}
    for fam in ('strings', 'piano', 'drums', 'chip', 'synth'):
        p = os.path.join(cue_dir, 'stems', f'range-p4-temp-cue-{fam}.flac')
        if os.path.exists(p):
            y, sr = sf.read(p, always_2d=True)
            y = y.T[:, :N]
            stems[fam] = np.pad(y, ((0, 0), (0, N - y.shape[1])))
    music = sum(stems.values())
    ride = env([(0, -1.5), (28, -1.5), (32, -4), (148, -4), (152, -1.5), (180, -1.5), (208, -1.5), (212, -3.5),
                (312, -3.5), (318, -1.5), (386, -1.5), (392, -5), (478, -5), (484, -1), (560, -1), (575, -2), (719, -1.5)])
    bus['music'] += music * ride
    # the last frames: a short natural fade so the open fifth rings into the end of the file, not a click
    tail = np.ones(N)
    tail[fr(714):] = np.linspace(1, 0.0, N - fr(714))
    bus['music'] *= tail

    # ---- the rooms (continuous; crossfaded across each clip change). Every generated layer is normalised to a -20 dBFS
    # reference over its own active span, then gain-staged here in plain dB, so the balance is readable in one place:
    # rooms about -35, the cue about -24, a device that owns the air about -24, its small-speaker version about -31
    R = -20.0
    tone = load('room_tone')
    hum = load('server_hum')
    neon = load('neon_buzz')
    typing = load('typing_soft')
    board = rms_norm(loop_to(tone, N), R) * db(-15)
    bullpen = rms_norm(hp(loop_to(tone, N), 120), R) * db(-16) + rms_norm(st(bp(pink(N, rng), 180, 900, 2)), R) * db(-21)
    bull_keys = np.zeros((2, N))
    place(bull_keys, rms_norm(typing, R) * db(-20), fr(182))
    place(bull_keys, rms_norm(typing, R) * db(-22), fr(318))
    chamber_n = rms_norm(hp(crowd(DUR, seed=4, voices=10, roar_db=-18), 150), R)
    chamber = chamber_n * db(-13)
    for k in range(4):  # paper, a chair: small and far
        m = int(0.25 * SR)
        rustle = bp(rng.standard_normal(m), 1500, 6000, 2) * np.exp(-np.arange(m) / SR / 0.08)
        place(chamber, rms_norm(st(rustle), R) * db(-22), fr(362 + k * 47))
    lobby = rms_norm(loop_to(tone, N), R) * db(-16) + rms_norm(loop_to(hum, N), R) * db(-22) + rms_norm(loop_to(neon, N), R) * db(-28)

    def gate(a, b, fade=10):
        return env([(a - fade - 1, -120), (a - fade, -120), (a, 0), (b, 0), (b + fade, -120), (b + fade + 1, -120)]) if a > 0 else env([(0, 0), (b, 0), (b + fade, -120), (b + fade + 1, -120)])
    bus['room'] += board * gate(0, 180, 5) + (bullpen + bull_keys) * gate(180, 360, 5) + chamber * gate(360, 540, 5) + lobby * gate(540, 725, 5)

    def norm_span(x, f0, f1, target=R):
        a_, b_ = fr(f0), fr(f1)
        r = np.sqrt(np.mean(np.square(x[:, a_:b_])) + 1e-12)
        return x * db(target) / r

    # ---- 4a: the broadcast (crowd + the stadium PA + a booth murmur), through the TV, then full, then the TV again
    cheers = [(0.9, 4, 0.8), (2.4, 7, 1.2), (2.9, 9, 1.6), (4.4, 5, 1.0)]
    stadium = rms_norm(crowd(7.5, seed=2, voices=24, cheers=cheers, roar_db=-3), R)
    pa = rms_norm(reverb(futz(st(babble(7.5, f0=112, speed=1.1, seed=31, lively=0.2)), 'pa'), 2.2, 0.9, wet=0.5, seed=5), R) * db(-8)
    booth = rms_norm(st(compress(bp(babble(7.5, f0=128, speed=1.25, seed=33, lively=0.25), 120, 7000, 2), 2.5)), R) * db(-10)
    broadcast = np.zeros((2, N))
    place(broadcast, stadium + pa + booth, 0)
    broadcast = norm_span(broadcast, 30, 150)
    tv = norm_span(futz(broadcast, 'tv'), 0, 30)
    full = broadcast * db(-4) * env([(0, -120), (29, -120), (30, 0), (148, 0), (150, -120), (180, -120)])
    small = tv * db(-12) * env([(0, 0), (14, 0), (15, 3), (29, 3), (30, -120), (149, -120), (150, 0), (174, 0), (184, -120)])
    # the insert (p15-29) is the same speaker, closer: a little more of its top end
    small += lp(hp(broadcast, 900, 2), 5200, 2) * db(-22) * env([(0, -120), (14, -120), (15, 0), (29, 0), (30, -120), (180, -120)])
    bus['device'] += full + small
    # his phone lighting on the table: one soft haptic buzz (a low, short, damped hum; never a ringtone)
    m = int(0.16 * SR)
    t = np.arange(m) / SR
    buzz = np.sin(2 * np.pi * 172 * t) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 31 * t))) * np.minimum(1, t / 0.01) * np.exp(-t / 0.07)
    place(bus['sfx'], st(lp(buzz, 900, 2)) * db(-30), fr(169))

    # ---- 4b: the launch stream (the room it's shot in, an audience, applause at the top), through a codec
    s_room = crowd(7.5, seed=8, voices=12, cheers=[(0.1, 6, 0.9), (4.2, 2, 0.6)], roar_db=-20)
    s_room = rms_norm(codec(reverb(s_room, 1.2, 0.35, wet=0.3, seed=9)), R)
    stream = np.zeros((2, N))
    place(stream, s_room, fr(180))
    glass = lp(norm_span(futz(stream, 'tv'), 180, 360), 3500, 2)  # on the wall screen, behind glass
    bus['device'] += stream * db(-8) * env([(180, -120), (209, -120), (210, 0), (313, 0), (315, -120), (360, -120)])
    bus['device'] += glass * db(-14) * env([(180, -6), (194, -6), (195, 0), (209, 0), (210, -120), (314, -120), (315, 0), (356, -1), (366, -120)])
    # one soft tick per chat burst (a UI tick, well under the room: never a notification 'ding')
    for f in (212, 224, 233, 254, 264, 276, 289, 300):  # b-stream.ts CHAT_TICKS
        tick = st(blip(1396.9, 0.06, 0.01) * 0.5 + blip(2093, 0.06, 0.006) * 0.2)
        place(bus['sfx'], codec(tick) * db(-30), fr(f))

    # ---- 4c: ONE speaker all through the clip (the delegate two seats down, the one we see talking): her voice
    # through the chamber's PA in the room (p360-389), through the webcast (p390-479: flat, compressed, with the
    # interpreter's channel faint under it), and in the room again on his close-up (p480-539). Phrases match the
    # picture's mouth (c-council.ts speakAt): 360-381, 384-400, 404-540
    phr = env([(359, -120), (360, 0), (380, 0), (382, -120), (383, -120), (384, 0), (399, 0), (401, -120), (403, -120), (404, 0), (540, 0)])
    voice = np.zeros(N)
    vb = babble(7.6, f0=208, speed=0.95, seed=41, lively=0.12)
    voice[fr(360):fr(360) + len(vb)] = vb[:N - fr(360)]
    voice *= phr
    pa_room = rms_norm(reverb(futz(st(voice), 'pa'), 2.6, 1.0, wet=0.5, seed=12), R)
    web = rms_norm(codec(compress(reverb(futz(st(voice), 'pa'), 2.6, 1.0, wet=0.45, seed=12), 2.2), band=(150, 6500), bits=11, rate=22050), R)
    web = rms_norm(web + chamber_n * db(-14), R) * db(-8)
    interp = np.zeros(N)
    ib = babble(3.9, f0=122, speed=1.05, seed=43, lively=0.12)
    a0 = fr(390) + int(0.7 * SR)
    interp[a0:a0 + len(ib)] = ib[:N - a0]
    ch2 = rms_norm(futz(st(interp), 'phone'), R) * db(-17)
    bus['device'] += pa_room * db(-10) * env([(359, -120), (360, 0), (389, 0), (390, -120), (479, -120), (480, -2), (540, -2), (545, -120)])
    bus['device'] += web * env([(389, -120), (390, 0), (478, 0), (480, -120)])
    bus['device'] += np.stack([ch2[0] * 0.8, ch2[1] * 1.0]) * env([(389, -120), (390, 0), (478, 0), (480, -120)])
    # while the webcast plays, the pixel room's own bed steps back (we hear the chamber only through the stream)
    bus['room'] *= env([(0, 0), (389, 0), (390, -14), (479, -14), (480, 0), (720, 0)])

    # ---- 4d: the Orb
    servo = load('orb_servo')
    stamp = load('rubber_stamp_C')
    place(bus['sfx'], servo * db(-8), fr(562))
    place(bus['sfx'], hp(servo, 600, 2)[:, :int(0.25 * SR)] * db(-18), fr(555))
    place(bus['sfx'], hp(servo, 600, 2)[:, :int(0.3 * SR)] * db(-17), fr(705))
    # the blades from inside: a short metallic slide up (in) and down (out)
    def blade(up=True):
        m = int(0.2 * SR)
        t = np.arange(m) / SR
        f = np.linspace(2200, 5200, m) if up else np.linspace(5200, 2200, m)
        ph = np.cumsum(f / SR)
        tone_ = np.sin(2 * np.pi * ph) * 0.15 + bp(rng.standard_normal(m), 2500, 7000, 2) * 0.5
        return st(tone_ * np.minimum(1, t / 0.01) * np.exp(-t / 0.08))
    place(bus['sfx'], blade(True) * db(-18), fr(570))
    place(bus['sfx'], blade(False) * db(-18), fr(660))
    place(bus['sfx'], servo[:, ::-1] * db(-12), fr(665))
    # one scan tone while the line crosses him: a soft triangle C6 gliding down a third, no bleeps
    m = int(0.9 * SR)
    t = np.arange(m) / SR
    f = np.linspace(1046.5, 830.6, m)
    sc = (2 * np.abs(2 * (np.cumsum(f / SR) % 1) - 1) - 1) * np.minimum(1, t / 0.06) * np.minimum(1, (0.9 - t) / 0.25)
    place(bus['sfx'], st(lp(sc, 3000, 2)) * db(-27), fr(584))
    # NOT VERIFIED: one low tone, the open fifth F-C (the Orb's verdict interval), soft attack, long decay
    m = int(2.2 * SR)
    t = np.arange(m) / SR
    low = (np.sin(2 * np.pi * 87.31 * t) + 0.7 * np.sin(2 * np.pi * 130.81 * t) + 0.15 * np.sin(2 * np.pi * 174.61 * t))
    low *= np.minimum(1, t / 0.04) * np.exp(-t / 0.9)
    place(bus['sfx'], st(low) * db(-15), fr(606))
    # the tiny stamp: the stamp, small (high-passed, quiet)
    place(bus['sfx'], hp(stamp, 400, 2) * db(-12), fr(641))
    # footsteps on stone: NOLE walking up (to p556) and through (from p696)
    # footsteps on the carpet: NOLE's step up to the rope and his walk through (d-iris.ts NOLE_STEPS: one per heel
    # strike of the planted walk)
    for f in (546, 549, 697, 703, 709, 715):
        place(bus['sfx'], reverb(st(footstep(f)), 0.9, 0.3, wet=0.3, seed=f) * db(-24), fr(f))
    # the rope: the far hook lets go (a small brass clink), and its brass end lands on the carpet (a soft knock)
    clink = st(blip(2790, 0.2, 0.05) * 0.6 + blip(4150, 0.2, 0.03) * 0.4)
    place(bus['sfx'], clink * db(-26), fr(693))
    place(bus['sfx'], st(lp(footstep(999, False), 1800, 2)) * db(-28), fr(699))

    mix = bus['music'] + bus['room'] + bus['device'] + bus['sfx']
    return mix, bus


def master(x, target=-16.0):
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    lufs = meter.integrated_loudness(x.T)
    y = x * db(target - lufs)
    # a gentle peak limiter: gain envelope from the peak excess (5 ms attack / 80 ms release), then a hard ceiling
    ceiling = db(-1.2)
    pk = np.max(np.abs(y), axis=0)
    need = np.minimum(1.0, ceiling / (pk + 1e-9))
    g = np.ones_like(need)
    rel = np.exp(-1 / (0.08 * SR))
    cur = 1.0
    for i in range(len(need) - 1, -1, -1):  # backward pass: look-ahead-ish attack
        cur = min(need[i], cur * rel + (1 - rel))
        g[i] = cur
    cur = 1.0
    for i in range(len(g)):
        cur = min(g[i], cur * rel + (1 - rel))
        g[i] = cur
    y = np.clip(y * g, -ceiling, ceiling)
    return y, lufs, meter.integrated_loudness(y.T)


def holes(x, thresh_db=-42, min_s=0.3):
    """flow-and-continuity §5: silent holes (under -42 dBFS for 0.3 s or more)"""
    w = int(0.05 * SR)
    m = np.sqrt(np.mean(np.square(x[:, :x.shape[1] // w * w].reshape(2, -1, w)), axis=(0, 2)) + 1e-12)
    quiet = 20 * np.log10(m) < thresh_db
    out, run = [], 0
    for i, q in enumerate(quiet):
        run = run + 1 if q else 0
        if run * 0.05 >= min_s and (i + 1 == len(quiet) or not quiet[i + 1]):
            out.append(((i - run + 1) * 0.05, (i + 1) * 0.05))
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--cue', required=True)
    ap.add_argument('--picture', required=False)
    ap.add_argument('--out', required=False)
    ap.add_argument('--wav', required=True)
    a = ap.parse_args()
    mix, bus = build(a.cue)
    y, before, after = master(mix)
    sf.write(a.wav, y.T.astype(np.float32), SR, subtype='PCM_24')
    print(f'mix {before:.1f} LUFS -> {after:.1f} LUFS, peak {20 * np.log10(np.max(np.abs(y))):.2f} dBFS; holes: {holes(y)}')
    for k, v in bus.items():
        r = np.sqrt(np.mean(np.square(v)) + 1e-12)
        print(f'  bus {k:7s} rms {20 * np.log10(r):6.1f} dBFS')
    if a.picture and a.out:
        ff = os.path.join(ROOT, 'studio', 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffmpeg')
        envv = dict(os.environ, LD_LIBRARY_PATH=os.path.dirname(ff))
        subprocess.run([ff, '-v', 'error', '-y', '-i', a.picture, '-i', a.wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                        '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', a.out], check=True, env=envv)
        print('muxed', a.out)
