"""Glyph / dread textures: sine clusters, granular clouds, spectral freeze, bit-crush sweeps,
GLYPH's digital 'handwriting', a Shepard-Risset glissando and a server-room hum.

Direct use (arrays out, stereo float32):
    y = sine_cluster('F3', width=2.0, voices=7, dur_s=12, drift_cents=15)
    y = dread('F1', dur_s=16, intensity=0.4)
    y = granular(src, dur_s=10, grain_s=(0.04, 0.15), density=30, pitch_spread=0.3, scan=(0.1, 0.6))
    y = glyph(8.0, density=2.5, seed=3)          # sparse blips / ticks / chirps / stutters on the knee's notes
    y = shepard(10.0, rising=True)               # endless rise (tension; never resolves on its own)
    y = crush(y, bits=(12, 4), rate=(24000, 3000))   # a time-varying bit-crush sweep

In a score, use the 'tex' / 'glyph' tracks of the palette (arrange.palette): one note = one texture,
a.n('tex', 'F3', t, 12.0, 0.5, kind='cluster', width=2.0) -- note.dur is the length, vel the level.

House rules (show bible + OST-BIBLE s0/s2.5/P04, binding): nothing corny; no heartbeat pulses, horror
screeches, vocoders, data bleep-bloops, glitch-stutter edits or low 'evil' growls; no Ligeti / 2001 clusters.
"The machine is polite, precise and exact.  That is the dread."  So the defaults are:
  * dread(): sub pressure on the root + THE ACHE (G and Db over the F pedal: the 9 and the b13) as pure
    slowly beating tones + dark air.  voicing='cluster' gives the older quarter-tone cluster (use rarely).
  * glyph(): polite token grains -- soft chip blips on the TOKEN set {F G Ab C Db}, kept in the score's
    register F4-Db6 (the SFX own the GLYPH grains at G6 / Db7 / F7), optionally quantised to a 16th grid.
    kinds 'tick', 'chirp', 'stutter' still exist for diegetic UI moments only.
  * for the bible's straight-16th TOKEN STREAM use patterns.tokens() (notes on the grid, 0 ms humanise).
"""
from __future__ import annotations

import numpy as np
from scipy import signal

from .core import SR, nm, midi_hz, lp, hp, bp, to_stereo, db, stable_seed

KNEE_PCS = [5, 5, 5, 5, 7, 8, 0, 5]          # F F F F G Ab C F (the main title's knee)
TOKEN_PCS = [5, 5, 7, 0, 1, 5, 7, 0, 8]      # F G C Db weighted, Ab as a rare passing token (OST-BIBLE P04)


def _pan(y, p):
    a = (p + 1) * np.pi / 4
    return np.stack([y * np.cos(a), y * np.sin(a)]) * np.sqrt(2)


def _smooth_noise(n, hz, rng):
    k = max(4, int(n * hz / SR) + 4)
    pts = rng.standard_normal(k)
    return np.interp(np.linspace(0, k - 1, n), np.arange(k), pts)


def _fades(n, fi, fo):
    e = np.ones(n)
    a, b = int(fi * SR), int(fo * SR)
    if a:
        e[:a] *= np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    if b:
        e[-b:] *= np.cos(np.linspace(0, np.pi / 2, b)) ** 2
    return e


# ------------------------------------------------------------------ sine cluster
def sine_cluster(center='F3', width=2.0, voices=7, dur_s=8.0, drift_cents=15.0, drift_hz=0.12, breathe_hz=0.07,
                 fade_in=2.0, fade_out=2.0, seed=0, pan_spread=0.8, level=1.0, quarter_tones=True, harm=0.08):
    """A slowly beating cluster of pure tones spread over `width` semitones around `center`
    (quarter-tone grid by default), each voice drifting a few cents: pressure without a chord."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    c = nm(center)
    y = np.zeros((2, n))
    for v in range(voices):
        off = -width / 2 + width * (v + rng.uniform(0.2, 0.8)) / voices
        if quarter_tones:
            off = round(off * 2) / 2
        p = c + off + drift_cents / 100 * _smooth_noise(n, drift_hz, rng)
        f = 440 * 2 ** ((p - 69) / 12)
        ph = 2 * np.pi * np.cumsum(f) / SR + rng.uniform(0, 6.28)
        w = np.sin(ph) + harm * np.sin(2 * ph + 0.4)
        amp = 0.6 + 0.4 * np.sin(2 * np.pi * breathe_hz * (1 + 0.3 * v) * t + rng.uniform(0, 6.28))
        y += _pan(w * amp, pan_spread * (2 * v / max(voices - 1, 1) - 1) * rng.uniform(0.6, 1.0))
    y *= _fades(n, fade_in, fade_out) / np.sqrt(voices) * 0.08 * level
    return y.astype(np.float32)


# ------------------------------------------------------------------ dread bed
def _ache_tones(pitches, dur_s, beat_hz, seed, level):
    """Pure, slowly beating tones (each a detuned pair) -- the Ache as glass-like pressure."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    y = np.zeros((2, n))
    for i, p in enumerate(pitches):
        f = midi_hz(p)
        for ch in range(2):
            det = 1 + (beat_hz * (1 + 0.3 * i) / f) * (1 if ch else -1) * 0.5
            w = np.sin(2 * np.pi * f * det * t + rng.uniform(0, 6.28)) + \
                np.sin(2 * np.pi * f / det * t + rng.uniform(0, 6.28))
            y[ch] += w * (0.5 + 0.5 * np.sin(2 * np.pi * 0.04 * (i + 1) * t + rng.uniform(0, 6.28))) ** 0.5
    return (y / max(len(pitches), 1) * 0.02 * level).astype(np.float32)


def dread(root='F1', dur_s=12.0, intensity=0.4, seed=0, level=1.0, fade_in=3.0, fade_out=3.0, air=True,
          voicing='ache'):
    """Low pressure for thriller scenes: a sub on the root, THE ACHE (G4 + Db5 over the root, i.e. the 9 and
    the b13 of F) as pure beating tones, dark band-passed air.  intensity (0..1) adds the C6, faster
    beating and a little crushed grit.  voicing='cluster' swaps the Ache for a quarter-tone cluster at the
    tritone; voicing='none' is sub pressure + air only.  Stays out of the dialog band (energy < 250 Hz, the Ache
    at 390-560 Hz, air > 5 kHz)."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    r = nm(root)
    sub = np.sin(2 * np.pi * midi_hz(r) * t + 0.3) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.05 * t))
    y = to_stereo(sub * 0.05)
    if voicing == 'cluster':
        y = y + sine_cluster(r + 18, width=1.5, voices=5, dur_s=dur_s, drift_cents=10 + 20 * intensity,
                             breathe_hz=0.05 + 0.2 * intensity, fade_in=0, fade_out=0, seed=seed + 1, level=0.8)
    elif voicing == 'none':
        pass                                      # sub pressure + air only
    else:
        base = r % 12
        g4 = 60 + ((base + 2 - 0) % 12) + (12 if (base + 2) % 12 < 5 else 0)      # the 9 near G4
        db5 = g4 + 6                                                                  # the b13 a tritone up
        ps = [g4, db5] + ([db5 + 11] if intensity > 0.5 else [])                     # (+C6)
        y = y + _ache_tones(ps, dur_s, 0.12 + 0.5 * intensity, seed + 1, 1.0)
    if air:
        pk = np.stack([np.cumsum(rng.standard_normal(n)), np.cumsum(rng.standard_normal(n))])
        pk = hp(pk, 20, 1)
        sweep = 350 + 250 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.03 * t + rng.uniform(0, 6)))
        a_ = bp(pk, 120, 700, 2) * (sweep / 600)[None]
        a_ = a_ / (np.sqrt(np.mean(a_ ** 2)) + 1e-9) * 0.012
        hiss = hp(rng.standard_normal((2, n)), 6000, 2) * 0.0015 * (0.5 + intensity)
        y = y + a_ + hiss
    if intensity > 0.3:
        k = (intensity - 0.3) / 0.7
        if voicing == 'cluster':
            y = y + sine_cluster(r + 25 + 12, width=1.0, voices=4, dur_s=dur_s, drift_cents=25, breathe_hz=0.3 + k,
                                 fade_in=0, fade_out=0, seed=seed + 2, level=0.6 * k)
        if intensity > 0.6:
            g = crush(y, bits=6, rate=6000) - y
            y = y + hp(g, 3000, 2) * 0.25 * (intensity - 0.6) / 0.4
    y *= _fades(n, fade_in, fade_out)[None]
    return (y * level).astype(np.float32)


# ------------------------------------------------------------------ bit-crush sweep
def crush(x, bits=8, rate=None, mix=1.0, block_s=0.02):
    """Bit depth / sample-rate reduction.  bits and rate may be (start, end) tuples for a sweep."""
    x = to_stereo(np.asarray(x, dtype=np.float64))
    n = x.shape[1]
    b0, b1 = (bits, bits) if np.isscalar(bits) else bits
    if rate is None:
        r0 = r1 = None
    else:
        r0, r1 = (rate, rate) if np.isscalar(rate) else rate
    y = np.empty_like(x)
    blk = max(64, int(block_s * SR))
    for i0 in range(0, n, blk):
        u = i0 / max(n - 1, 1)
        b = b0 + (b1 - b0) * u
        seg = x[:, i0:i0 + blk]
        if r0:
            rr = r0 * (r1 / r0) ** u
            step = SR / rr
            idx = (np.floor((np.arange(seg.shape[1]) + i0) / step) * step).astype(int) - i0
            seg = x[:, np.clip(idx + i0, 0, n - 1)]
        q = 2 ** (max(b, 1.0) - 1)
        y[:, i0:i0 + blk] = np.round(seg * q) / q
    out = x * (1 - mix) + y * mix
    return out.astype(np.float32)


# ------------------------------------------------------------------ granular
def granular(src, dur_s=8.0, grain_s=(0.03, 0.12), density=35.0, pitch_spread=0.0, pitch_shift=0.0,
             scan=(0.0, 1.0), jitter=0.03, reverse_prob=0.0, pan_spread=0.7, seed=0, level=1.0,
             fade_in=0.5, fade_out=1.0, quantize=None):
    """Granular cloud from any source array.  scan: read position moves from scan[0] to scan[1]
    (fractions of the source) over the texture; pitch_spread in semitones (random per grain);
    quantize: list of semitone offsets grains snap to (e.g. [0, 7, 12] keeps a cloud consonant)."""
    rng = np.random.default_rng(seed)
    s = to_stereo(np.asarray(src, dtype=np.float64)).mean(0)
    L = len(s)
    n = int(dur_s * SR)
    y = np.zeros((2, n))
    count = rng.poisson(density * dur_s)
    starts = np.sort(rng.uniform(0, max(dur_s - grain_s[0], 1e-3), count))
    for st in starts:
        g = rng.uniform(*grain_s)
        u = st / dur_s
        pos = (scan[0] + (scan[1] - scan[0]) * u + rng.normal(0, jitter)) * L
        semi = pitch_shift + (rng.uniform(-pitch_spread, pitch_spread) if pitch_spread else 0.0)
        if quantize:
            semi = pitch_shift + min(quantize, key=lambda q: abs(q - (semi - pitch_shift)))
        ratio = 2 ** (semi / 12)
        gl = int(g * SR)
        idx = pos + np.arange(gl) * ratio
        if rng.random() < reverse_prob:
            idx = idx[::-1]
        idx = np.clip(idx, 0, L - 1)
        grain = np.interp(idx, np.arange(L), s) * np.hanning(gl)
        a = int(st * SR)
        e = min(gl, n - a)
        if e <= 0:
            continue
        y[:, a:a + e] += _pan(grain[:e], rng.uniform(-pan_spread, pan_spread))
    rms = np.sqrt(np.mean(y ** 2)) + 1e-9
    y = y / rms * 0.03 * level
    y *= _fades(n, fade_in, fade_out)[None]
    return y.astype(np.float32)


# ------------------------------------------------------------------ spectral freeze
def freeze(src, at_s=0.2, dur_s=4.0, nfft=4096, seed=0, level=1.0, fade_in=0.3, fade_out=1.0, tilt_db=-3.0):
    """Hold the spectrum of src at at_s for dur_s with random phases ('time stops')."""
    rng = np.random.default_rng(seed)
    x = to_stereo(np.asarray(src, dtype=np.float64))
    a = int(at_s * SR)
    out = []
    hop = nfft // 4
    n = int(dur_s * SR)
    win = np.hanning(nfft)
    for ch in range(2):
        seg = x[ch, a:a + nfft]
        if len(seg) < nfft:
            seg = np.pad(seg, (0, nfft - len(seg)))
        mag = np.abs(np.fft.rfft(seg * win))
        f = np.fft.rfftfreq(nfft, 1 / SR)
        mag *= 10 ** (tilt_db / 20 * np.log2(np.maximum(f, 50) / 1000))
        y = np.zeros(n + nfft)
        for i0 in range(0, n, hop):
            ph = rng.uniform(0, 2 * np.pi, len(mag))
            fr_ = np.fft.irfft(mag * np.exp(1j * ph), nfft) * win
            y[i0:i0 + nfft] += fr_
        out.append(y[:n])
    y = np.stack(out)
    y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.04 * level
    y *= _fades(n, fade_in, fade_out)[None]
    return y.astype(np.float32)


# ------------------------------------------------------------------ GLYPH
def _blip(p, d, duty, rng):
    from .chip import pulse, stepped_env
    y = pulse(p, d + 0.01, duty=duty, max_hz=9000, tilt=-2.0)
    e = stepped_env(len(y), att=0.001, dec=d * 0.5, sus=0.3, rel=0.01, gate_s=d, steps=15, rate=60.0)
    return y * e


def _chirp(p, d, up, rng):
    n = int(d * SR)
    t = np.arange(n) / SR
    f0 = midi_hz(p)
    f = f0 * 2 ** ((1 if up else -1) * 1.5 * t / d)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2
    return y


def _tick(d, rng):
    n = max(8, int(d * SR))
    y = rng.choice([-1.0, 1.0], n) * np.exp(-np.arange(n) / (n / 3))
    return hp(y, 3000, 2)


def glyph(dur_s=8.0, density=1.5, pitches=None, register=('F4', 'Db6'), seed=0, kinds=('blip',),
          crush_bits=10, crush_rate=24000, level=1.0, stereo=0.6, fade_in=0.2, fade_out=0.5, quantize_s=None,
          octave=None):
    """GLYPH as texture: sparse, polite token grains -- soft chip blips (12.5 / 25 % duty) on the TOKEN set
    {F G Ab C Db} inside `register` (default F4-Db6, clear of the SFX grains), lightly crushed.
    quantize_s snaps every mark to a grid (pass the 16th: g.dur('1/16', t)) -- the machine is exact.
    density = marks per second (1-3 is a presence; > 6 chatters).  kinds 'tick' / 'chirp' / 'stutter'
    are banned in underscore by the OST-BIBLE (s2.5, P04); keep them for diegetic UI."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    y = np.zeros((2, n))
    pcs = pitches if pitches is not None else TOKEN_PCS
    lo, hi = nm(register[0]), nm(register[1])
    t = rng.exponential(1 / max(density, 1e-3))
    last = None
    while t < dur_s - 0.1:
        if quantize_s:
            t = round(t / quantize_s) * quantize_s
        kind = kinds[int(rng.integers(0, len(kinds)))]
        pc = pcs[int(rng.integers(0, len(pcs)))]
        pc = pc if isinstance(pc, (int, np.integer)) else nm(pc) % 12
        cands = [m for m in range(lo, hi + 1) if m % 12 == pc] or [lo + ((pc - lo) % 12)]
        p = cands[int(rng.integers(0, len(cands)))] if octave is None else 12 * (octave + 1) + pc
        if kind == 'blip':
            ev = _blip(p, rng.uniform(0.02, 0.07), [0.125, 0.25][int(rng.integers(0, 2))], rng) * 0.35
        elif kind == 'tick':
            ev = _tick(rng.uniform(0.002, 0.006), rng) * 0.25
        elif kind == 'chirp':
            ev = _chirp(p - 12, rng.uniform(0.03, 0.08), rng.random() < 0.5, rng) * 0.25
        elif kind == 'stutter' and last is not None:
            gap = rng.uniform(0.018, 0.045)
            reps = int(rng.integers(3, 7))
            L = int(gap * SR)
            ev = np.zeros(L * reps + len(last))
            for k in range(reps):
                ev[k * L:k * L + len(last)] += last * (0.8 ** k)
        else:
            ev = _blip(p, 0.03, 0.25, rng) * 0.3
        last = ev[:int(0.06 * SR)]
        a = int(t * SR)
        e = min(len(ev), n - a)
        if e > 0:
            y[:, a:a + e] += _pan(ev[:e], rng.uniform(-stereo, stereo))
        t += rng.exponential(1 / max(density, 1e-3)) + (quantize_s or 0.03)
    if crush_bits:
        y = crush(y, bits=crush_bits, rate=crush_rate)
    y *= _fades(n, fade_in, fade_out)[None]
    return (lp(y, 12000, 2) * level).astype(np.float32)


# ------------------------------------------------------------------ Shepard-Risset glissando
def shepard(dur_s=10.0, rising=True, speed=0.08, base='C2', octaves=7, level=1.0, seed=0, fade_in=1.5,
            fade_out=1.5, tone='sine'):
    """Endless glissando (speed in octaves per second).  Tension that never arrives -- cut it off on a
    hit rather than letting it 'resolve'."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    f0 = midi_hz(nm(base))
    y = np.zeros(n)
    sgn = 1 if rising else -1
    for k in range(octaves):
        pos = (k + sgn * speed * t) % octaves
        f = f0 * 2 ** pos
        amp = 0.5 - 0.5 * np.cos(2 * np.pi * pos / octaves)
        ph = 2 * np.pi * np.cumsum(f) / SR + rng.uniform(0, 6.28)
        w = np.sin(ph) if tone == 'sine' else np.sign(np.sin(ph)) * 0.5
        y += amp * w
    y = lp(y, 7000, 2)
    y = to_stereo(y / octaves * 0.3) * _fades(n, fade_in, fade_out)[None]
    return (y * level).astype(np.float32)


# ------------------------------------------------------------------ server room
def server_hum(dur_s=10.0, mains=60.0, level=1.0, seed=0, fans=0.5):
    """The data-centre cathedral: mains hum harmonics, slow beating, band-limited fan noise."""
    rng = np.random.default_rng(seed)
    n = int(dur_s * SR)
    t = np.arange(n) / SR
    h = sum((0.6 / k) * np.sin(2 * np.pi * mains * k * (1 + 0.0004 * k) * t + rng.uniform(0, 6.28)) for k in (1, 2, 3, 5))
    fan = bp(rng.standard_normal((2, n)), 180, 2400, 2) * fans * 0.3
    fan *= (1 + 0.2 * np.sin(2 * np.pi * 0.21 * t))[None]
    y = to_stereo(h * 0.05) + fan * 0.05
    return (y * _fades(n, 1.0, 1.0)[None] * level).astype(np.float32)


# ------------------------------------------------------------------ track fn (palette 'tex', 'glyph')
def tex_fn(n, rng):
    """Score adapter: note.x['kind'] picks the generator; note.dur = length; note.vel = level."""
    x = dict(n.x)
    kind = x.pop('kind', 'cluster')
    for k in list(x):
        if k.startswith('_') or k in ('pan', 'art', 'rel', 'set'):
            x.pop(k)
    lvl = db(-24 * (1 - n.vel)) * x.pop('gain_lin', 1.0)
    seed = x.pop('seed', int(rng.integers(0, 1 << 30)))
    d = n.dur
    if kind == 'cluster':
        return sine_cluster(x.pop('center', n.pitch), dur_s=d, seed=seed, level=lvl, **x)
    if kind == 'dread':
        return dread(x.pop('root', n.pitch), dur_s=d, seed=seed, level=lvl, **x)
    if kind == 'glyph':
        return glyph(d, seed=seed, level=lvl, **x)
    if kind == 'shepard':
        return shepard(d, seed=seed, level=lvl, **x)
    if kind == 'hum':
        return server_hum(d, seed=seed, level=lvl, **x)
    if kind in ('granular', 'freeze'):
        src = x.pop('src')
        arr = source(src)
        if kind == 'granular':
            return granular(arr, d, seed=seed, level=lvl, **x)
        return freeze(arr, dur_s=d, seed=seed, level=lvl, **x)
    raise KeyError(f'texture kind {kind!r}')


def source(src):
    """('set', name, pitch, vel, dur_s) -> a rendered sample; ('file', path); or an array."""
    if isinstance(src, np.ndarray):
        return src
    if src[0] == 'file':
        from .sampler import load_wav, resolve
        return load_wav(resolve(src[1]))
    if src[0] == 'set':
        from . import library
        name, pitch = src[1], src[2]
        vel = src[3] if len(src) > 3 else 0.7
        d = src[4] if len(src) > 4 else 2.0
        ss = library.get(name)
        return ss.render(nm(pitch), vel, d, np.random.default_rng(stable_seed(src)), rel_s=1.5)
    raise ValueError(src)
