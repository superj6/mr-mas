"""intro-vox shared helpers (dialogue / vocal editor pass for the 30.000 s Ep1 intro).

Builds on the vocal pass's DSP library (audio/vocals/scripts/vlib.py, read-only here): Kokoro-82M
stock voices, WORLD vocoder, pedalboard. Everything is synthetic; no recording of any real person.
Intro clock: 24 fps, f0 = 0.000 s, 720 frames = 30.000 s, 48 kHz.
"""
import os, sys, json, subprocess
VOC_SCRIPTS = '/home/jgon/project/art/mrmas/audio/vocals/scripts'
sys.path.insert(0, VOC_SCRIPTS)
import numpy as np
import soundfile as sf
import vlib
from vlib import *            # SR, FPS, fade, place, pan, convolve, ir, board, board_mono, stretch, ...

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # audio/intro-vox
BUILD = os.path.join(ROOT, '_build')

# ------------------------------------------------------------------ Kokoro render cache
# Our own cache in intro-vox/_work/tts_cache (never write into audio/vocals). Each render we need is copied
# on first use from the vocal pass's cache (same keys, so the takes are bit-identical); a miss renders
# with Kokoro and lands in our cache.
WORK_DIR = os.path.join(ROOT, '_work')
SEED_CACHES = [os.path.join(p, 'tts_cache') for p in
               ('/home/jgon/project/art/mrmas/audio/vocals/_work', os.environ.get('IV_SEED_WORK', '/nonexistent'))]
vlib.WORK = WORK_DIR
import hashlib, shutil
_orig_tts, _orig_tts_words = vlib.tts, vlib.tts_words


def _seed(names):
    os.makedirs(os.path.join(WORK_DIR, 'tts_cache'), exist_ok=True)
    for n in names:
        dst = os.path.join(WORK_DIR, 'tts_cache', n)
        if os.path.exists(dst):
            continue
        for base in SEED_CACHES:
            src = os.path.join(base, n)
            if os.path.exists(src):
                shutil.copy2(src, dst)
                break


def tts(text, voice, speed=1.0, cache=True):
    if cache and isinstance(voice, str):
        _seed([hashlib.md5(f'{text}|{voice}|{speed}'.encode()).hexdigest() + '.wav'])
    return _orig_tts(text, voice, speed, cache)


def tts_words(text, voice, speed=1.0):
    if isinstance(voice, str):
        h = hashlib.md5(f'W|{text}|{voice}|{speed}'.encode()).hexdigest()
        _seed([h + '.wav', h + '.json'])
    return _orig_tts_words(text, voice, speed)


def use_cache(*mods):
    """Point the vocal pass's modules (which bound tts/tts_words at import) at the seeding wrappers."""
    for m in mods:
        if hasattr(m, 'tts'):
            m.tts = tts
        if hasattr(m, 'tts_words'):
            m.tts_words = tts_words


vlib.tts, vlib.tts_words = tts, tts_words
N_FRAMES = 720
N30 = 30 * SR                 # exactly 1,440,000 samples


def fs(frame):
    """frame -> seconds on the intro clock"""
    return frame / FPS


def fr(t):
    return t * FPS


# ------------------------------------------------------------------ loudness (BS.1770 / EBU R128)
_M = None
def kweight(y):
    import pyloudnorm as pyln
    global _M
    if _M is None:
        _M = pyln.Meter(SR)
    x = to_st(y).T.copy()
    for f in _M._filters.values():
        x = np.stack([f.apply_filter(x[:, c]) for c in range(x.shape[1])], 1)
    return x.T


def loud_curve(y, win=3.0, hop=0.1):
    """Sliding K-weighted loudness (LUFS). win=0.4 momentary, 3.0 short-term. Returns (t_center, L)."""
    k = kweight(y)
    p = np.sum(k ** 2, 0)
    c = np.concatenate([[0.0], np.cumsum(p)])
    w, h = int(win * SR), int(hop * SR)
    starts = np.arange(0, max(1, len(p) - w + 1), h)
    ms = (c[starts + w] - c[starts]) / w
    L = -0.691 + 10 * np.log10(ms + 1e-20)
    return (starts + w / 2) / SR, L


def lufs_window(y, t0, t1):
    """Integrated (gated) loudness of y[t0:t1]."""
    seg = to_st(y)[:, int(t0 * SR):int(t1 * SR)]
    try:
        return float(lufs(seg))
    except Exception:
        return float('-inf')


def stats(y, name=''):
    y = to_st(y)
    tm, M = loud_curve(y, 0.4, 0.05)
    ts, S = loud_curve(y, 3.0, 0.1)
    act = np.where(M > -70)[0]
    d = dict(name=name,
             lufs_I=round(float(lufs(y)), 2),
             short_term_max=round(float(S.max()), 2), short_term_max_at_f=round(float(fr(ts[S.argmax()])), 1),
             momentary_max=round(float(M.max()), 2), momentary_max_at_f=round(float(fr(tm[M.argmax()])), 1),
             true_peak_dbtp=round(float(true_peak_db(y)), 2),
             sample_peak_dbfs=round(float(20 * np.log10(np.max(np.abs(y)) + 1e-12)), 2))
    return d


def audible_span(y, thr_db=-60.0):
    """(first, last) frame where the 5 ms RMS is above thr_db dBFS."""
    m = to_st(y).mean(0)
    e = 20 * np.log10(rms_env(m, 240) + 1e-12)
    on = np.where(e > thr_db)[0]
    if not len(on):
        return None
    return round(fr(on[0] * 240 / SR), 2), round(fr((on[-1] + 1) * 240 / SR), 2)


# ------------------------------------------------------------------ I/O
def write_stem(y, relpath, mp3=True):
    """Write a 30.000 s / 48 kHz / 24-bit stereo WAV (plus a 256 kbps MP3 preview)."""
    y = to_st(y)
    assert y.shape[1] == N30, (relpath, y.shape)
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, y.T, SR, subtype='PCM_24')
    if mp3:
        mp3_out(path, path[:-4] + '.mp3')
    return path


def mp3_out(src, dst, br='256k'):
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    subprocess.run([FFDIR + '/ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-c:a', 'libmp3lame',
                    '-b:a', br, dst], check=True, env=env)


def save_build(y, name):
    os.makedirs(BUILD, exist_ok=True)
    p = os.path.join(BUILD, name + '.wav')
    sf.write(p, to_st(y).T, SR, subtype='FLOAT')
    return p


def load_build(name):
    y, _ = sf.read(os.path.join(BUILD, name + '.wav'))
    return y.T


def timeline(parts):
    """parts: [(stereo array, start_seconds, gain_lin)] -> exactly 30.000 s stereo."""
    out = np.zeros((2, N30))
    for x, t, g in parts:
        place(out, x, t, g)
    return out


# ------------------------------------------------------------------ dialogue tools
def deess(y, lo=4800, hi=10000, thr_db=-30, max_db=6.0, ratio=3.0, att_ms=1.0, rel_ms=40):
    """Split-band de-esser: only the 4.8-10 kHz band is turned down, and only when it is hot
    relative to the full band (so vowels are untouched)."""
    from scipy import signal as ss
    y = to_st(y)
    sos = ss.butter(4, [lo, hi], 'bandpass', fs=SR, output='sos')
    band = ss.sosfiltfilt(sos, y, axis=1)
    rest = y - band
    env_b = np.sqrt(ss.sosfiltfilt(ss.butter(2, 200, fs=SR, output='sos'), np.mean(band ** 2, 0)).clip(1e-14))
    env_f = np.sqrt(ss.sosfiltfilt(ss.butter(2, 200, fs=SR, output='sos'), np.mean(y ** 2, 0)).clip(1e-14))
    rel = 20 * np.log10(env_b / env_f)                      # band vs full, dB
    lvl = 20 * np.log10(env_b)
    over = np.clip(np.minimum(rel + 6.0, lvl - thr_db), 0, None)  # hot sibilant AND loud enough
    gr = np.clip(over * (1 - 1 / ratio), 0, max_db)
    k = max(1, int(rel_ms / 1000 * SR))
    gr = np.convolve(gr, np.ones(k) / k, mode='same')
    g = 10 ** (-gr / 20)
    return rest + band * g[None, :], float(gr.max())


def room_tone(dur, level_db=-66.0, seed=5):
    """Dark-room tone: very low, dull pink-ish noise (the same room as the VO's IR)."""
    from scipy import signal as ss
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    x = rng.standard_normal((2, n))
    x = ss.sosfilt(ss.butter(1, 180, 'highpass', fs=SR, output='sos'), x, axis=1)
    x = ss.sosfilt(ss.butter(2, 1800, 'lowpass', fs=SR, output='sos'), x, axis=1)
    m = x.mean(0); x = m + 0.35 * (x - m)                   # mostly-mono room
    x /= np.sqrt(np.mean(x ** 2)) + 1e-12
    return x * 10 ** (level_db / 20)
