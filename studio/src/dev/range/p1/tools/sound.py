"""MR. MAS - style-range Prototype 1 (THE READ, 10.C + J4 placeholder): the TEMP SOUND PASS.

Run with the OST venv (the engine and its sample libraries are imported read-only; its calibration cache is redirected
to scratch so nothing under audio/ost is written):
  ../audio/.venv-theme/bin/python src/dev/range/p1/tools/sound.py <out.wav> [<scratch dir>]

96 BPM, 4/4, house swing; bar = 60 frames (2.5 s); p = the prototype's frame.
  p0-107    bars 1-2  the Ep10 poker cue (TEMP: felted upright, walking bass, brushes, the chip lead) over the casino
                      bed. The chip lead's READ phrase lands on the hotspots (Ab C Eb F on p30/45/60/75) and completes
                      with its fifth note (G) on p90 as the band starts to slide (a soft felt slide under it). The
                      dealer draws a card off the shoe (p96) and flicks it up into the lamp (p105).
  p108-119            a designed stop: the band drops out and only the room is left while the card is held up.
  p120      bar 3     THE SNAP: the card hits the felt on the cut (the loudest transient in the clip). The chip lead and
                      the bed are gone; the cue carries on re-voiced as grand piano and a low string pad.
  p180-225  bar 4     one piano note per tell (Ab C Eb F), resolving on the phone. p240: a rest where the dealer's G
                      would be. p345: the caret stops blinking and a thin glass tone rises under the strings.
  p360      bar 7     the dealer's next card: a snap and a sub drop on the cut; the strings and the glass tone STOP
                      (a designed stop); the GLYPH family (dread texture, glass pad, shimmer). The four tells rise as
                      four glass notes (Ab C Eb F, p365-371). The machine's caret over Mas: two soft ticks, and no G.
  p406      bar 7.4   back in the room on a softer snap: the room is back at full, the band slides home under it,
                      the chip lead picks up into bar 8.
  p420      bar 8     the cue re-enters in its own timbre. p435: one cursor tick on Mas, and nothing: the lead rests.
  p458-464            the band stops; p465 the button: one Fm9 (its G on top) and the pizz F. p468 the picture goes
                      to black; the chord rings out and the room falls away under it.
No dialogue, no voice. SFX: the house's own (key_tap_soft, glyph_shimmer); the casino bed, chips, shuffle, card snaps
and the band's slide are synthesised here (TEMP: no library assets yet).
"""
import os
import shutil
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..'))
OST = os.path.join(ROOT, 'audio', 'ost')
SFX = os.path.join(ROOT, 'audio', 'sfx', 'wav')
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/p1-sound.wav'
SCR = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(OUT))

sys.path.insert(0, OST)
import engine.sampler as _smp  # noqa: E402
# read-only use of the engine: its calibration cache is copied to scratch and redirected there
_cache = os.path.join(SCR, 'ost-cache')
os.makedirs(_cache, exist_ok=True)
if os.path.exists(os.path.join(OST, 'cache', 'calib.json')) and not os.path.exists(os.path.join(_cache, 'calib.json')):
    shutil.copy(os.path.join(OST, 'cache', 'calib.json'), os.path.join(_cache, 'calib.json'))
_smp.CACHE = _cache
from engine import *  # noqa: E402,F401,F403

SR = 48000
FPS = 24
CLIP_F = 480
N = int(CLIP_F / FPS * SR)


def f2s(p):
    return p / FPS


def fs(p):
    return int(round(p / FPS * SR))


# ------------------------------------------------------------------ the music (two scores: the cue, the GLYPH family)
def music():
    g = Grid(bpm=96, meter='4/4', bars=9, swing=1.0)
    T = palette()
    T['brush'].gain_db = 10
    T['lead'].gain_db = -3
    a = Arr(g)
    # ---- bars 1-2: the band (felted upright trio + the chip lead)
    prog = progression(g, [(1, 'Fm9'), (2, 'Bbm9'), ((2, 3), 'C7#9'), (3, 'Fm9')])
    comp(a, 'felt', prog, style='charleston', kind='rootless_a', around='C4', vel=0.42, bars=(1, 3))
    walking_bass(a, 'ubass', prog, bars=(1, 3), layer='cb_pizz', vel=0.7, seed=10)
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap:   ..x...x.
        kick:  o.......
        hatf:  ..x...x.
    ''', bars=(1, 3))
    # the READ phrase: one note per hotspot, the fifth as the band starts to go
    for pitch, pos, dur in [('Ab4', (1, 3), '1b'), ('C5', (1, 4), '1b'), ('Eb5', (2, 1), '1b'), ('F5', (2, 2), '1b'), ('G5', (2, 3), '1b')]:
        a.n('lead', pitch, pos, dur, 0.5, duty=0.25, rel=0.08, sus=0.55, dec=0.12, lock=True)
    a.notes = groove(a.notes, g, 'laidback', insts=['felt', 'ubass', 'cb_pizz'], amount=0.6)
    # ---- bars 3-6: re-voiced as grand piano and a low string pad (same phrase, same tempo)
    a.ch('grand', ['F2', 'C3', 'Ab3', 'Eb4', 'G4'], (3, 1), '2b', 0.62, roll=0.012, lock=True)
    a.ch('grand', ['Ab3', 'C4', 'Eb4', 'G4'], (3, 3, 'sw'), '1.5b', 0.42, roll=0.01)
    pad = g.t(7) - g.t(3)
    for inst, ps, v in [('cb', ['F1'], 0.5), ('vc', ['F2', 'C3'], 0.5), ('vla', ['Ab3', 'C4'], 0.42)]:
        art.swell(a, inst, ps, (3, 1), pad + 0.02, 'p', 'mf', shape='s')
    # bar 4: the tells, one piano note each, resolving on the phone; bar 5.1: the rest where the dealer's G would be
    for pitch, beat, v in [('Ab4', 1, 0.58), ('C5', 2, 0.58), ('Eb5', 3, 0.6), ('F5', 4, 0.66)]:
        a.n('grand', pitch, (4, beat), '3b' if beat < 4 else '8b', v, lock=True)
    a.n('grand', 'F2', (4, 4), '8b', 0.36, lock=True)
    # ---- the pickup out of the machine's view (p412, p416) and bar 8: the cue in its own timbre
    a.n('lead', 'Eb5', f2s(409), '1/8', 0.4, duty=0.25, rel=0.06, sus=0.5, dec=0.1, lock=True)
    a.n('lead', 'F5', f2s(414), '1/8', 0.42, duty=0.25, rel=0.06, sus=0.5, dec=0.1, lock=True)
    a.n('ubass', 'C2', f2s(409), '1/4', 0.55, lock=True)
    a.n('ubass', 'E2', f2s(414), '1/4', 0.55, lock=True)
    prog8 = progression(g, [(8, 'Fm9'), (9, 'Fm9')])
    comp(a, 'felt', prog8, style='charleston', kind='rootless_a', around='C4', vel=0.44, bars=(8, 9))
    walking_bass(a, 'ubass', prog8, bars=(8, 9), layer='cb_pizz', vel=0.72, seed=11)
    Drums(a, 'brushes').play('''
        sweep: ~~~~~~~~
        tap:   ..x...x.
        kick:  o.......
        hatf:  ..x...x.
    ''', bars=(8, 9))
    for pitch, pos, dur in [('Ab4', (8, 1), '1/8'), ('C5', (8, 1.5, 'sw'), '1/8')]:
        a.n('lead', pitch, pos, dur, 0.44, duty=0.25, rel=0.08, sus=0.55, dec=0.12, lock=True)
    # the band stops before the button; nothing of bar 8's fourth beat survives but the button itself
    button = f2s(465)
    a.notes = [n for n in a.notes if not (n.start >= f2s(456) and n.start < button + 0.3)]
    a.ch('felt', ['F2', 'C3', 'Ab3', 'Eb4', 'G4'], button, '6b', 0.3, roll=0.016, lock=True)
    a.n('cb_pizz', 'F1', button, '4b', 0.46, lock=True)
    sc = Score('p1-read', g, T, a.notes,
               mutes=[(f2s(108), f2s(120)), (f2s(360), f2s(406)), (f2s(458), button)], mute_fade_ms=3.0, tail_s=1.5,
               meta=dict(id='p1-read', title='P1 temp: the read'))
    stems = render_score(sc, verbose=False)
    # ---- the GLYPH family (p360-405): dread texture, glass pad, sub pressure, straight, no swing
    g2 = Grid(bpm=96, meter='4/4', bars=9, swing=0.0)
    T2 = palette()
    b = Arr(g2)
    b.n('tex', 'F1', (7, 1), g2.bar_s(7) + 0.05, 0.5, kind='dread', voicing='none', intensity=0.35, fade_in=0.02, fade_out=0.4, lock=True)
    b.ch('glasspad', ['F5', 'C6'], (7, 1), g2.bar_s(7) - 0.1, 0.3, lock=True)
    b.n('sub', 'F1', (7, 1), 1.8, 0.62, decay=1.4, punch=2, lock=True)
    sc2 = Score('p1-glyph', g2, T2, b.notes, tail_s=0.5, meta=dict(id='p1-glyph', title='P1 temp: glyph family'))
    stems2 = render_score(sc2, verbose=False)
    return stems, stems2, g


def mix_stems(stems):
    out = np.zeros((2, N))
    fam = {}
    for k, v in stems.items():
        v = np.asarray(v)
        if v.ndim == 1:
            v = np.stack([v, v])
        n = min(N, v.shape[1])
        out[:, :n] += v[:, :n]
        fam[k] = v
    return out, fam


# ------------------------------------------------------------------ synthesised room sounds (TEMP, seeded)


def bandpass(x, lo, hi):
    from scipy.signal import butter, sosfilt
    sos = butter(2, [lo, hi], btype='band', fs=SR, output='sos')
    return sosfilt(sos, x)


def highpass(x, fc):
    from scipy.signal import butter, sosfilt
    return sosfilt(butter(2, fc, btype='high', fs=SR, output='sos'), x)


def murmur(n, seed=3):
    """a far wordless room: many voices as formant-filtered noise, slowly modulated; no words, nothing legible"""
    rng = np.random.default_rng(seed)
    out = np.zeros(n)
    t = np.arange(n) / SR
    for v in range(9):
        src = rng.standard_normal(n)
        f1 = 380 + rng.random() * 320
        f2 = 1100 + rng.random() * 900
        voice = bandpass(src, f1 * 0.8, f1 * 1.25) + 0.5 * bandpass(src, f2 * 0.85, f2 * 1.15)
        # syllabic amplitude at 3-5 Hz, phrases of 1-3 s
        syl = 0.5 + 0.5 * np.sin(2 * np.pi * (3 + rng.random() * 2) * t + rng.random() * 6)
        phr = np.clip(np.sin(2 * np.pi * (0.2 + rng.random() * 0.25) * t + rng.random() * 6), 0, 1) ** 1.5
        out += voice * syl * phr * (0.6 + rng.random() * 0.5)
    out = bandpass(out, 180, 3200)
    return out / (np.max(np.abs(out)) + 1e-9)


def clack(seed, bright=1.0):
    """one GPU 'chip' set down on a stack: a short hard click with two resonances"""
    rng = np.random.default_rng(seed)
    L = int(0.06 * SR)
    t = np.arange(L) / SR
    x = np.zeros(L)
    for f, d, g in [(2600 * bright, 0.012, 1.0), (4300 * bright, 0.008, 0.7), (7200, 0.004, 0.4), (900, 0.02, 0.25)]:
        f *= 1 + (rng.random() - 0.5) * 0.08
        x += g * np.sin(2 * np.pi * f * t) * np.exp(-t / d)
    x[:30] += rng.standard_normal(30) * 0.6
    return x / np.max(np.abs(x))


def riffle(seed=5, dur=0.55):
    """a shuffle: a riffle of card edges, fast then slowing"""
    rng = np.random.default_rng(seed)
    L = int(dur * SR)
    x = np.zeros(L + SR // 10)
    n = 46
    for i in range(n):
        u = i / n
        pos = int((u ** 1.3) * L)
        m = int(0.004 * SR)
        burst = rng.standard_normal(m) * np.exp(-np.arange(m) / (0.0012 * SR))
        x[pos:pos + m] += burst * (0.5 + 0.5 * rng.random()) * (1 - 0.4 * u)
    x = bandpass(x, 1800, 9000)
    return x / (np.max(np.abs(x)) + 1e-9)


def card_snap(seed=7):
    """the card's snap on the felt: a crack, a short paper body, a small thump"""
    rng = np.random.default_rng(seed)
    L = int(0.18 * SR)
    t = np.arange(L) / SR
    crack = highpass(rng.standard_normal(L), 1500) * np.exp(-t / 0.0035)
    body = bandpass(rng.standard_normal(L), 500, 1600) * np.exp(-t / 0.022)
    thump = np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.03)
    x = 1.0 * crack + 0.5 * body + 0.35 * thump
    return x / np.max(np.abs(x))


def felt_slide(dur=0.55, seed=31):
    """the band sliding: a felted drawer, a soft rise and fall of low-mid air, and a soft thock where it lands"""
    rng = np.random.default_rng(seed)
    L = int(dur * SR)
    t = np.arange(L) / SR
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    x = bandpass(rng.standard_normal(L), 280, 1400) * env * 0.6
    th = int(0.09 * SR)
    tt = np.arange(th) / SR
    thock = np.sin(2 * np.pi * 180 * tt) * np.exp(-tt / 0.018) + 0.3 * bandpass(rng.standard_normal(th), 600, 2200) * np.exp(-tt / 0.01)
    out = np.zeros(L + th)
    out[:L] += x
    out[L - th // 3:L - th // 3 + th] += thock * 0.8
    return out / (np.max(np.abs(out)) + 1e-9)


def flick(seed=41):
    """a card flicked up between two fingers: a tiny paper snap"""
    rng = np.random.default_rng(seed)
    L = int(0.05 * SR)
    t = np.arange(L) / SR
    x = highpass(rng.standard_normal(L), 2500) * np.exp(-t / 0.004)
    return x / np.max(np.abs(x))


def swish(dur=0.12, seed=43):
    """the card's short fall through the air before it lands (part of the snap, never a whoosh)"""
    rng = np.random.default_rng(seed)
    L = int(dur * SR)
    t = np.arange(L) / SR
    x = bandpass(rng.standard_normal(L), 1200, 6000) * (t / dur) ** 2
    return x / (np.max(np.abs(x)) + 1e-9)


def glass_note(freq, dur=0.5):
    """a soft struck-glass tone: the machine playing his phrase back"""
    L = int(dur * SR)
    t = np.arange(L) / SR
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.22) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.07)
    x *= np.minimum(1, t / 0.003)
    return x / np.max(np.abs(x))


def glass_tone(freq, dur):
    """a thin sustained glass tone that rises under the strings while the caret holds"""
    L = int(dur * SR)
    t = np.arange(L) / SR
    vib = 1 + 0.002 * np.sin(2 * np.pi * 5.2 * t)
    x = np.sin(2 * np.pi * freq * np.cumsum(vib) / SR) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    return x * (t / dur) ** 1.5


def sub_drop(dur=0.9):
    L = int(dur * SR)
    t = np.arange(L) / SR
    f = 62 - 26 * (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35) * np.minimum(1, t / 0.004)


def load(name):
    x, sr = sf.read(os.path.join(SFX, name), always_2d=True)
    assert sr == SR, (name, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x.T[:2]


def put(buf, x, at, gain, pan=0.0):
    x = np.asarray(x)
    if x.ndim == 1:
        x = np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))]) * np.sqrt(2)
    n = min(x.shape[1], buf.shape[1] - at)
    if n > 0:
        buf[:, at:at + n] += gain * x[:, :n]


def db(v):
    return 10 ** (v / 20)


def main():
    stems, stems2, g = music()
    cue, _ = mix_stems(stems)
    glyph, _ = mix_stems(stems2)
    bed = np.zeros((2, N))
    # ---- the casino bed: p0-119, then back at full on the return to the room (p406), falling away after the black
    mur = murmur(N)
    rngp = np.random.default_rng(12)
    chips = np.zeros(N)
    for _ in range(26):
        at = int(rngp.random() * N)
        for j in range(1 + int(rngp.random() * 3)):
            p = at + j * int((0.05 + rngp.random() * 0.07) * SR)
            if p + 3000 < N:
                chips[p:p + 2880] += clack(int(rngp.random() * 1e6), 0.9 + rngp.random() * 0.3) * (0.25 + rngp.random() * 0.4)
    # a steady room tone under the murmur (air handling, the far floor), so a designed stop is never a hole
    rt = np.random.default_rng(77).standard_normal(N)
    from scipy.signal import butter, sosfilt
    rt = sosfilt(butter(2, [60, 520], btype='band', fs=SR, output='sos'), rt)
    rt /= np.sqrt(np.mean(rt ** 2)) + 1e-9
    room = np.stack([mur * 0.9 + chips * 0.6 + rt * 0.16, np.roll(mur, 900) * 0.9 + np.roll(chips, 400) * 0.5 + np.roll(rt, 5000) * 0.16])
    gate = np.zeros(N)
    ramp = int(0.004 * SR)
    gate[:fs(120)] = 1
    gate[fs(120):fs(120) + ramp] = np.linspace(1, 0, ramp)
    gate[fs(406):fs(406) + ramp] = np.linspace(0, 1, ramp)
    gate[fs(406) + ramp:fs(468)] = 1
    gate[fs(468):fs(476)] = np.linspace(1, 0, fs(476) - fs(468)) ** 2
    bed += room * gate * db(-18)
    # the shuffle, early in the pre-roll (far, by the dealer), and once more on the way back
    put(bed, riffle(5), fs(6), db(-24), pan=0.35)
    put(bed, riffle(9, 0.45), fs(440), db(-27), pan=0.35)
    sfxb = np.zeros((2, N))
    # ---- the band's slide away (p90-103) and home (p406-418)
    put(sfxb, felt_slide(13 / FPS, 31), fs(90), db(-27), pan=0.0)
    put(sfxb, felt_slide(12 / FPS, 33), fs(406), db(-28), pan=0.0)
    # ---- the dealer's card: off the shoe (p96), flicked up into the lamp (p105), the fall, THE SNAP on the cut (p120)
    slide = bandpass(np.random.default_rng(21).standard_normal(int(0.2 * SR)), 2500, 8000) * np.hanning(int(0.2 * SR))
    put(sfxb, slide, fs(96), db(-22), pan=0.55)
    put(sfxb, flick(41), fs(105), db(-17), pan=0.6)
    put(sfxb, swish(0.13), fs(120) - int(0.13 * SR), db(-26), pan=0.4)
    put(sfxb, card_snap(7), fs(120), db(-2), pan=0.2)
    put(sfxb, sub_drop(0.5) * 0.6, fs(120), db(-14))
    # ---- G6 THE HOTSPOT: one soft cursor tick per hotspot (none on the Intern), and one on Mas at the end
    for p in (30, 45, 60, 75, 435):
        put(sfxb, load('key_tap_soft_02.wav'), fs(p), db(-24))
    # ---- the caret holds (p345): a thin glass tone rises under the strings and stops dead on the cut
    put(sfxb, glass_tone(1396.9, f2s(360 - 345)), fs(345), db(-33))
    # ---- p360: the dealer's next card, the sub, the shimmer (the machine's view)
    put(sfxb, swish(0.1, 44), fs(360) - int(0.1 * SR), db(-27), pan=0.3)
    put(sfxb, card_snap(8), fs(360), db(-3), pan=0.15)
    put(sfxb, sub_drop(0.9), fs(360), db(-14))
    sh = load('glyph_shimmer.wav')
    put(sfxb, sh[:, :fs(46)] * np.linspace(1, 0, fs(46)) ** 0.5, fs(360), db(-19))
    # the four tells rise: the machine plays his phrase back as glass, one note per column
    for p, f in zip((365, 367, 369, 371), (830.6, 1046.5, 1244.5, 1396.9)):
        put(sfxb, glass_note(f, 0.6), fs(p), db(-25), pan=(p - 367) / 12)
    # its caret over Mas: two soft ticks as it lights; no fifth note
    for p in (380, 390):
        put(sfxb, load('key_tap_soft_02.wav'), fs(p), db(-27), pan=-0.5)
    # ---- p406: back in the room on a softer snap
    put(sfxb, card_snap(9), fs(406), db(-9), pan=0.2)
    gl = glyph.copy()
    gw = np.zeros(N)
    gw[fs(360):fs(406)] = 1
    gw[fs(406):fs(418)] = np.linspace(1, 0, fs(418) - fs(406)) ** 1.5
    gl *= gw
    mix = cue * db(-1) + gl * db(-9) + bed + sfxb
    # a 4-frame fade at the very end so the clip never clicks
    mix[:, -fs(4):] *= np.linspace(1, 0, fs(4))
    # ---- loudness: about -16 LUFS integrated, true peak under -1 dBTP
    try:
        import pyloudnorm as pyln
        meter = pyln.Meter(SR)
        L = meter.integrated_loudness(mix.T)
        mix *= db(-15.6 - L)
    except Exception:
        mix /= np.max(np.abs(mix)) * 1.3
    # a short look-ahead limiter at -1.5 dBFS (the snaps stay sharp; the mix gets its level)
    thr = db(-1.5)
    look = int(0.0015 * SR)
    a = np.max(np.abs(mix), axis=0)
    need = np.minimum(1.0, thr / np.maximum(a, 1e-9))
    from scipy.ndimage import minimum_filter1d
    need = minimum_filter1d(need, size=2 * look + 1)
    g = np.empty_like(need)
    rel = np.exp(-1.0 / (0.06 * SR))
    cur = 1.0
    for i in range(len(need)):
        cur = need[i] if need[i] < cur else need[i] + (cur - need[i]) * rel
        g[i] = cur
    mix = mix * g
    pk = np.max(np.abs(mix))
    if pk > db(-1.2):
        mix *= db(-1.2) / pk
    sf.write(OUT, mix.T.astype(np.float32), SR, subtype='PCM_24')
    print('wrote', OUT, 'peak dB', round(20 * np.log10(np.max(np.abs(mix)) + 1e-12), 2))


if __name__ == '__main__':
    main()
