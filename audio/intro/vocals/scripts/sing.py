"""Tiny 'singer' built from Kokoro stock-voice syllables + WORLD vocoder.

A syllable ("ah", "doo", "bah" ...) is spoken by a Kokoro stock voice, analysed with WORLD
(harvest F0, CheapTrick envelope, D4C aperiodicity), and then re-sung at any pitch/length:
 - onset consonant frames are kept as spoken (real /d/, /b/ transients),
 - the vowel is sustained by a slow random walk through its own steady frames (no frozen loop),
 - a new F0 curve is written: scoop into the note, delayed vibrato, 1/f jitter, drift, optional fall,
 - formants can be nudged per singer, breathiness raised via aperiodicity.
Chip variant: the same envelopes filter a pulse wave (vowel-vocoded 8-bit voice).
"""
import os, sys, functools
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from scipy import signal
from vlib import *

FP = 5.0                     # WORLD frame period (ms)
FS_F = 1000.0 / FP           # frames per second

SYL_TEXT = {'ah': 'ah.', 'ooh': 'ooh.', 'doo': 'doo.', 'bah': 'bah.', 'dah': 'dah.', 'mm': 'mmm.',
            'oh': 'oh.', 'dee': 'dee.', 'bee': 'bee.', 'dn': 'dun.', 'bwah': 'bwah.', 'dat': 'dat.'}

def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

NOTE = {'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'Gb': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def n2m(name):
    """'F2' -> midi. flats only."""
    p, o = name[:-1], int(name[-1])
    return 12 * (o + 1) + NOTE[p]

@functools.lru_cache(maxsize=256)
def syllable(voice, syl, speed=0.72):
    y = trim(tts(SYL_TEXT[syl], voice, speed), -50, 0.01, 0.03)
    f0, sp, ap = world(y, frame_period=FP, f0_floor=55, f0_ceil=600)
    n = len(f0)
    e = 20 * np.log10(rms_env(y, int(SR * FP / 1000)) + 1e-9)
    e = np.pad(e, (0, max(0, n - len(e))), constant_values=-120)[:n]
    voiced = f0 > 0
    steady = voiced & (e > e.max() - 9)
    # largest contiguous steady run = the vowel core
    best, cur, bs = (0, 0), None, 0
    for i in range(n + 1):
        if i < n and steady[i]:
            if cur is None: cur = i
        else:
            if cur is not None and i - cur > best[1] - best[0]:
                best = (cur, i)
            cur = None
    v0, v1 = best
    if v1 - v0 < 12:
        v0, v1 = int(n * 0.35), int(n * 0.75)
    on = int(np.argmax(e > e.max() - 35))
    return dict(f0=f0, sp=sp, ap=ap, e=e, v0=v0, v1=v1, on=on, f0med=float(np.median(f0[voiced])) if voiced.any() else 150.0)

def pink(n, rng, smooth_frames=40):
    x = rng.standard_normal(n + 4 * smooth_frames)
    b = signal.windows.hann(2 * smooth_frames + 1); b /= b.sum()
    y = np.convolve(x, b, mode='same')[2 * smooth_frames:2 * smooth_frames + n]
    return y / (np.std(y) + 1e-9)

def _interp_frames(M, idx):
    i0 = np.clip(np.floor(idx).astype(int), 0, len(M) - 1)
    i1 = np.clip(i0 + 1, 0, len(M) - 1)
    w = (idx - i0)[:, None]
    return np.exp((1 - w) * np.log(M[i0] + 1e-16) + w * np.log(M[i1] + 1e-16))

def note_frames(src, dur, consonant=True, seed=0, rel_frames=10, walk=0.6, max_onset=14):
    """Build per-frame (sp, ap) for a note of `dur` seconds and return (sp, ap, n_onset)."""
    rng = np.random.default_rng(seed)
    n = max(8, int(dur * FS_F))
    sp, ap, v0, v1 = src['sp'], src['ap'], src['v0'], src['v1']
    idx = []
    if consonant:
        k = np.arange(max(src['on'], v0 + 4 - max_onset), min(v0 + 4, v1))
        k = k[:max(0, n - 4)]
        idx.extend(k.astype(float))
    n_on = len(idx)
    n_rel = min(rel_frames, max(0, v1 - v0 - 8))
    n_sus = max(1, n - n_on - n_rel)
    lo, hi = v0 + 3, max(v0 + 4, v1 - 3 - n_rel)
    # slow random walk through the vowel core (ping-pong, jittered), starting where the onset ended
    mid = (lo + hi) / 2; span = (hi - lo) / 2
    ph = pink(n_sus, rng, 60)
    start = min(max(v0 + 4.0, lo), hi)
    walk_idx = mid + span * walk * np.tanh(ph)
    ramp = np.clip(np.arange(n_sus) / 30.0, 0, 1)
    walk_idx = (1 - ramp) * start + ramp * walk_idx
    idx.extend(walk_idx)
    if n_rel:
        idx.extend(np.linspace(hi, v1 - 1, n_rel))
    idx = np.array(idx[:n]) if len(idx) >= n else np.pad(np.array(idx), (0, n - len(idx)), mode='edge')
    return _interp_frames(sp, idx), np.clip(_interp_frames(ap, idx), 0, 1), n_on

def f0_curve(n, hz, n_on=0, scoop_cents=-40, scoop_ms=70, vib_rate=5.4, vib_cents=16, vib_delay=0.35,
             vib_rise=0.4, jitter_cents=5, drift_cents=6, fall_cents=0, fall_ms=90, seed=0, glide_from=None):
    rng = np.random.default_rng(seed + 991)
    t = np.arange(n) / FS_F
    t_n = np.clip(t - n_on / FS_F, 0, None)
    c = np.zeros(n)
    if glide_from is not None:
        c += (glide_from) * np.exp(-t_n / (scoop_ms / 1000 / 2.5))
    elif scoop_cents:
        c += scoop_cents * np.exp(-t_n / (scoop_ms / 1000 / 2.5))
    vr = vib_rate * (1 + 0.04 * pink(n, rng, 80))
    phase = 2 * np.pi * np.cumsum(vr) / FS_F + rng.uniform(0, 2 * np.pi)
    depth = vib_cents * np.clip((t_n - vib_delay) / max(vib_rise, 1e-3), 0, 1)
    c += depth * np.sin(phase)
    c += jitter_cents * pink(n, rng, 3) * 0.5 + drift_cents * pink(n, rng, 120)
    if fall_cents:
        k = int(fall_ms / FP)
        c[-k:] += fall_cents * (np.linspace(0, 1, k) ** 2)
    return hz * 2 ** (c / 1200)

def amp_env(n_samp, att, rel, dur, shape='pad', accent=0.0, swell=0.0):
    t = np.arange(n_samp) / SR
    a = np.clip(t / max(att, 1e-3), 0, 1) ** (1.5 if shape == 'pad' else 0.7)
    r_start = max(dur - rel, att)
    r = np.clip(1 - (t - r_start) / max(rel, 1e-3), 0, 1) ** 1.6
    env = a * r
    if accent:           # sforzando: extra level decaying after the attack (fp)
        env *= 1 + accent * np.exp(-np.clip(t - att, 0, None) / 0.12)
    if swell:            # crescendo through the sustain
        env *= 1 + swell * np.clip((t - att) / max(r_start - att, 1e-3), 0, 1)
    return env

def sing(voice, syl, midi, dur, *, att=0.02, rel=0.25, consonant=True, formant=1.0, breath=0.0,
         seed=0, detune_cents=0.0, shape='pad', accent=0.0, swell=0.0, speed=0.72, morph=None, **f0kw):
    """Sing one note -> mono float array (length ~dur). morph=(syl2, w0, w1): vowel glides toward syl2."""
    src = syllable(voice, syl, speed)
    sp, ap, n_on = note_frames(src, dur + 0.06, consonant=consonant, seed=seed)
    if morph:
        s2 = syllable(voice, morph[0], speed)
        sp2, ap2, _ = note_frames(s2, dur + 0.06, consonant=False, seed=seed + 5)
        sp2, ap2 = sp2[:len(sp)], ap2[:len(sp)]
        if len(sp2) < len(sp):
            sp2 = np.pad(sp2, ((0, len(sp) - len(sp2)), (0, 0)), mode='edge'); ap2 = np.pad(ap2, ((0, len(sp) - len(ap2)), (0, 0)), mode='edge')
        w = np.zeros(len(sp)); k = np.arange(len(sp) - n_on)
        w[n_on:] = morph[1] + (morph[2] - morph[1]) * np.clip(k / max(len(k) * 0.8, 1), 0, 1) ** 1.3
        # level-match the target vowel's envelope to the source vowel before mixing
        g = np.mean(np.log(sp[n_on:] + 1e-16)) - np.mean(np.log(sp2[n_on:] + 1e-16))
        sp = np.exp((1 - w[:, None]) * np.log(sp + 1e-16) + w[:, None] * (np.log(sp2 + 1e-16) + g))
        ap = (1 - w[:, None]) * ap + w[:, None] * ap2
    if formant != 1.0:
        sp = warp_env(sp, formant)
    if breath:
        ap = 1 - (1 - ap) * (1 - breath * np.linspace(0.3, 1.0, ap.shape[1])[None, :])
    hz = midi_hz(midi) * 2 ** (detune_cents / 1200)
    f0 = f0_curve(len(sp), hz, n_on=n_on, seed=seed, **f0kw)
    # consonant frames keep their own voicing decision (unvoiced stays unvoiced)
    if consonant and n_on:
        orig = src['f0'][src['on']:src['on'] + n_on]
        f0[:n_on] = np.where(orig[:n_on] > 0, f0[:n_on], 0.0)
    # spectral envelope was measured at speech F0; normalise level so high/low notes match
    y = world_synth(f0, sp, ap, frame_period=FP)
    y = y[:int((dur + 0.06) * SR)]
    t_on = n_on * FP / 1000
    env = amp_env(len(y), att + (t_on if consonant else 0), rel, len(y) / SR, shape, accent, swell)
    if consonant and n_on:
        # let the consonant through at full level
        k = int(t_on * SR)
        env[:k] = np.maximum(env[:k], np.minimum(1.0, np.arange(k) / (0.004 * SR)))   # 4 ms ramp, never a hard start
    y = y * env
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.1, t_on

# ------------------------------------------------------------------------ chip voice
def pulse(f0_samples, duty=0.25):
    """band-limited (polyBLEP) pulse wave: the chip timbre without the aliasing hash."""
    dt = f0_samples / SR
    ph = np.cumsum(dt) % 1.0
    def blep(t, dt):
        out = np.zeros_like(t)
        a = t < dt; x = t[a] / dt[a]; out[a] = x + x - x * x - 1.0
        b = t > 1.0 - dt; x = (t[b] - 1.0) / dt[b]; out[b] = x * x + x + x + 1.0
        return out
    y = np.where(ph < duty, 1.0, -1.0)
    y += blep(ph, dt)
    y -= blep((ph - duty) % 1.0, dt)
    return y - (2 * duty - 1)

def chip_sing(voice, syl, midi, dur, *, duty=0.25, att=0.008, rel=0.08, seed=0, arp=None, arp_rate=FPS,
              crush_bits=8, hold_sr=24000, vib_cents=0, vib_delay=0.25, fall_cents=0, consonant=True, **kw):
    """8-bit voice: pulse wave (optionally arpeggiated at the 24 fps frame rate) filtered by the
    syllable's WORLD envelope, then sample-and-hold + bit reduction. Pitch steps are exact (no scoop)."""
    src = syllable(voice, syl)
    sp, ap, n_on = note_frames(src, dur + 0.05, consonant=consonant, seed=seed, walk=0.3)
    n = int((dur + 0.05) * SR)
    t = np.arange(n) / SR
    if arp:
        step = np.floor(t * arp_rate).astype(int) % len(arp)
        m = np.array(arp)[step]
    else:
        m = np.full(n, float(midi))
    cents = np.zeros(n)
    if vib_cents:   # chip-style delayed vibrato (triangle)
        tri = 2 * np.abs(2 * ((t * 6.0) % 1) - 1) - 1
        cents += vib_cents * tri * (t > vib_delay)
    if fall_cents:
        k = int(0.09 * SR); cents[-k:] += fall_cents * np.linspace(0, 1, k) ** 2
    f = 440 * 2 ** ((m - 69) / 12) * 2 ** (cents / 1200)
    x = pulse(f, duty)
    # time-varying envelope filter via STFT
    nfft = 1024; hop = 240
    fr, tt, X = signal.stft(x, SR, nperseg=nfft, noverlap=nfft - hop, boundary=None, padded=True)
    fidx = np.clip((tt * FS_F).astype(int), 0, len(sp) - 1)
    spk = sp[fidx]                                          # frames x bins (world fft size)
    wb = np.linspace(0, SR / 2, sp.shape[1])
    H = np.stack([np.interp(fr, wb, np.sqrt(spk[i])) for i in range(len(fidx))], 1)
    H /= (H.max() + 1e-12)
    _, y = signal.istft(X * H, SR, nperseg=nfft, noverlap=nfft - hop, boundary=None)
    y = y[:n]
    # unvoiced consonant noise from the source envelope (keeps /d/ /b/ bite)
    if consonant and n_on:
        k = int(n_on * FP / 1000 * SR)
        y[:k] *= np.linspace(0.2, 1, k)
    # 8-bit character: sample-and-hold + quantise
    hold = max(1, int(round(SR / hold_sr)))
    y = np.repeat(y[::hold], hold)[:n]
    y = y / (np.max(np.abs(y)) + 1e-9)
    q = 2 ** (crush_bits - 1)
    y = np.round(y * q) / q
    env = amp_env(n, att, rel, n / SR, 'stab')
    y = y * env
    y = board_mono([pb.LowpassFilter(9000)], y)
    y = fade(y, 0.003, 0.01)
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.1
