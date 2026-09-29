"""Shared helpers for the MR. MAS vocal pass.

Everything here is synthetic: Kokoro-82M stock voices (Apache-2.0), WORLD vocoder
(pyworld, MIT) resynthesis, numpy DSP, pedalboard (GPL-3.0 tool, output unencumbered).
No recordings of real people are used anywhere.
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
import os, subprocess, functools
import numpy as np
import soundfile as sf
import soxr
import pyworld as pw
import pyloudnorm as pyln
from scipy import signal
import pedalboard as pb

SR = 48000
FPS = 24
BPM = 96
BEAT = 60.0 / BPM            # 0.625 s
FRAME = 1.0 / FPS            # 41.667 ms
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, '_work')
FFDIR = os.path.join(REPO, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
RNG = np.random.default_rng(20260925)

def f2s(frame):
    return frame / FPS

# ----------------------------------------------------------------------------- TTS
@functools.lru_cache(maxsize=1)
def _pipe():
    import torch
    torch.set_num_threads(int(os.environ.get('VOC_THREADS', '6')))
    from kokoro import KPipeline
    return KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')

@functools.lru_cache(maxsize=64)
def _voice_tensor(name):
    return _pipe().load_voice(name)

def voice_blend(weights):
    """weights: dict stock_voice -> weight. Returns a designed (blended) voice tensor."""
    tot = sum(weights.values())
    return sum(_voice_tensor(k) * (w / tot) for k, w in weights.items())

def tts(text, voice, speed=1.0, cache=True):
    """Kokoro TTS -> float64 mono at 48 kHz. voice: stock name or tensor (blend)."""
    import hashlib, torch
    key = None
    if cache:
        vkey = voice if isinstance(voice, str) else hashlib.md5(voice.numpy().tobytes()).hexdigest()[:10]
        key = os.path.join(WORK, 'tts_cache', hashlib.md5(f'{text}|{vkey}|{speed}'.encode()).hexdigest() + '.wav')
        if os.path.exists(key):
            y, _ = sf.read(key)
            return y
    parts = [a.numpy() for _, _, a in _pipe()(text, voice=voice, speed=speed)]
    y = np.concatenate(parts).astype(np.float64)
    y = soxr.resample(y, 24000, SR, quality='VHQ')
    if key:
        os.makedirs(os.path.dirname(key), exist_ok=True)
        sf.write(key, y, SR, subtype='FLOAT')
    return y

# ----------------------------------------------------------------------------- analysis
def rms_env(y, hop=240):
    n = len(y) // hop
    return np.sqrt(np.mean(y[:n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)

def active_regions(y, thr_db=-40, min_gap=0.06, hop=240):
    e = 20 * np.log10(rms_env(y, hop) / (rms_env(y, hop).max() + 1e-12))
    on = e > thr_db
    regs, i, n = [], 0, len(on)
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]:
                j += 1
            regs.append([i * hop, j * hop]); i = j
        else:
            i += 1
    out = []
    for r in regs:
        if out and (r[0] - out[-1][1]) < min_gap * SR:
            out[-1][1] = r[1]
        else:
            out.append(r)
    return [r for r in out if r[1] - r[0] > 0.03 * SR]

def trim(y, thr_db=-50, pre=0.01, post=0.03):
    r = active_regions(y, thr_db=thr_db, min_gap=0.3)
    if not r:
        return y
    a = max(0, r[0][0] - int(pre * SR)); b = min(len(y), r[-1][1] + int(post * SR))
    return y[a:b]

def world(y, fs=SR, frame_period=5.0, f0_floor=60, f0_ceil=700):
    x = np.ascontiguousarray(y, dtype=np.float64)
    f0, t = pw.harvest(x, fs, f0_floor=f0_floor, f0_ceil=f0_ceil, frame_period=frame_period)
    sp = pw.cheaptrick(x, f0, t, fs)
    ap = pw.d4c(x, f0, t, fs)
    return f0, sp, ap

def world_synth(f0, sp, ap, fs=SR, frame_period=5.0):
    return pw.synthesize(np.ascontiguousarray(f0), np.ascontiguousarray(sp),
                         np.ascontiguousarray(ap), fs, frame_period)

def whisperize(y, formant_shift=1.0):
    """WORLD resynthesis with no periodic excitation = a whisper of the same words."""
    f0, sp, ap = world(y)
    if formant_shift != 1.0:
        sp = warp_env(sp, formant_shift)
    w = world_synth(np.zeros_like(f0), sp, np.ones_like(ap))
    return w[:len(y)] if len(w) >= len(y) else np.pad(w, (0, len(y) - len(w)))

def warp_env(sp, factor):
    """Scale formant frequencies by factor (>1 = smaller vocal tract / smile)."""
    nb = sp.shape[1]
    src = np.arange(nb) / factor
    out = np.empty_like(sp)
    for i in range(sp.shape[0]):
        out[i] = np.interp(src, np.arange(nb), sp[i], right=sp[i, -1])
    return out

# ----------------------------------------------------------------------------- dsp
def to_st(y):
    return np.stack([y, y], 0) if y.ndim == 1 else y

def board(chain, y):
    y32 = np.ascontiguousarray(to_st(y) if y.ndim == 1 else y, dtype=np.float32)
    out = pb.Pedalboard(chain)(y32, SR)
    return out.astype(np.float64)

def board_mono(chain, y):
    out = pb.Pedalboard(chain)(np.ascontiguousarray(y[None, :], dtype=np.float32), SR)
    return out[0].astype(np.float64)

def stretch(y, factor_len=1.0, semis=0.0, formants=True, crisp=True):
    """Rubber Band via pedalboard. factor_len = output_len / input_len."""
    x = np.ascontiguousarray(y[None, :], dtype=np.float32)
    out = pb.time_stretch(x, SR, stretch_factor=1.0 / factor_len, pitch_shift_in_semitones=semis,
                          high_quality=True, transient_mode='crisp' if crisp else 'smooth',
                          preserve_formants=formants)
    return out[0].astype(np.float64)

def formant_shift(y, semis):
    """Shift formants only (pitch kept) with two Rubber Band passes."""
    a = stretch(y, 1.0, semis, formants=False)
    b = stretch(a, 1.0, -semis, formants=True)
    return b[:len(y)] if len(b) >= len(y) else np.pad(b, (0, len(y) - len(b)))

def saturate(y, drive_db=4.0, mix=0.35):
    g = 10 ** (drive_db / 20)
    wet = np.tanh(y * g) / np.tanh(g)
    return (1 - mix) * y + mix * wet * np.max(np.abs(y)) / max(np.max(np.abs(wet)), 1e-9)

def fade(y, fin=0.005, fout=0.02):
    y = y.copy(); n = len(y) if y.ndim == 1 else y.shape[-1]
    a = int(fin * SR); b = int(fout * SR)
    if a:
        w = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
        if y.ndim == 1: y[:a] *= w
        else: y[:, :a] *= w
    if b:
        w = np.cos(np.linspace(0, np.pi / 2, b)) ** 2
        if y.ndim == 1: y[n - b:] *= w
        else: y[:, n - b:] *= w
    return y

def pan(y, p):
    """constant-power pan, p in [-1, 1]."""
    th = (p + 1) * np.pi / 4
    return np.stack([np.cos(th) * y, np.sin(th) * y], 0)

def place(dst, src, t, gain=1.0):
    """add stereo src into stereo dst at time t (s)."""
    i = int(round(t * SR))
    src = to_st(src)
    if i < 0:
        src = src[:, -i:]; i = 0
    n = min(src.shape[1], dst.shape[1] - i)
    if n > 0:
        dst[:, i:i + n] += gain * src[:, :n]
    return dst

# ----------------------------------------------------------------------------- reverb
def make_ir(rt60=1.2, length=None, predelay=0.01, early=None, bright=0.5, width=1.0, seed=1,
            lo_rt_mul=1.2, hi_rt_mul=0.45, density=1.0):
    """Stereo synthetic room IR: filtered noise tail with band-dependent decay + early taps.
    early: list of (delay_s, gain, pan)."""
    rng = np.random.default_rng(seed)
    L = length or (rt60 * 1.3 + predelay)
    n = int(L * SR)
    t = np.arange(n) / SR
    bands = [(20, 400, rt60 * lo_rt_mul), (400, 3000, rt60), (3000, 16000, rt60 * hi_rt_mul)]
    ir = np.zeros((2, n))
    for ch in range(2):
        noise = rng.standard_normal(n)
        if density < 1.0:
            noise *= (rng.random(n) < density) / np.sqrt(density)
        acc = np.zeros(n)
        for lo, hi, rt in bands:
            sos = signal.butter(2, [lo, min(hi, SR / 2 - 100)], 'bandpass', fs=SR, output='sos')
            b = signal.sosfilt(sos, noise)
            acc += b * np.exp(-6.9078 * t / rt)
        ir[ch] = acc
    if width < 1.0:
        m = ir.mean(0); ir = m + width * (ir - m)
    tilt = signal.butter(1, 2000 + 9000 * bright, 'lowpass', fs=SR, output='sos')
    ir = signal.sosfilt(tilt, ir, axis=1)
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    pd = int(predelay * SR)
    ir = np.pad(ir, ((0, 0), (pd, 0)))
    ramp = int(0.004 * SR); ir[:, pd:pd + ramp] *= np.linspace(0, 1, ramp)
    if early:
        for d, g, p in early:
            k = int(d * SR)
            if k < ir.shape[1]:
                th = (p + 1) * np.pi / 4
                ir[0, k] += g * np.cos(th) * 2.2
                ir[1, k] += g * np.sin(th) * 2.2
    return ir

def convolve(y, ir, wet=0.2, dry=1.0):
    y = to_st(y)
    out_len = y.shape[1] + ir.shape[1] - 1
    w = np.stack([signal.fftconvolve(y[c], ir[c]) for c in range(2)], 0)
    d = np.pad(y, ((0, 0), (0, out_len - y.shape[1])))
    return dry * d + wet * w

IRS = {}
def ir(name):
    if name in IRS:
        return IRS[name]
    if name == 'dark_room':     # small untreated bedroom-office at night: ~0.3 s, dull
        r = make_ir(rt60=0.30, predelay=0.003, bright=0.15, width=0.7, seed=11, hi_rt_mul=0.35,
                    early=[(0.0041, 0.35, -0.4), (0.0067, 0.25, 0.5), (0.0098, 0.18, 0.1), (0.0131, 0.12, -0.6)])
    elif name == 'stone_room':  # stone chapel-sized room: hard early reflections, 1.5 s
        r = make_ir(rt60=1.5, predelay=0.008, bright=0.45, width=1.0, seed=23, hi_rt_mul=0.55, lo_rt_mul=1.1,
                    early=[(0.011, 0.45, -0.7), (0.017, 0.38, 0.6), (0.023, 0.32, -0.2), (0.029, 0.30, 0.8),
                           (0.036, 0.25, -0.9), (0.044, 0.22, 0.3), (0.057, 0.18, -0.4), (0.071, 0.14, 0.7)])
    elif name == 'cathedral':
        r = make_ir(rt60=3.6, predelay=0.03, bright=0.35, width=1.0, seed=37, hi_rt_mul=0.45, lo_rt_mul=1.25,
                    early=[(0.031, 0.3, -0.8), (0.047, 0.26, 0.7), (0.066, 0.22, -0.3), (0.089, 0.2, 0.9),
                           (0.112, 0.16, -0.6)])
    elif name == 'plate':       # studio plate for the jazz vocal group
        r = make_ir(rt60=1.9, predelay=0.012, bright=0.7, width=1.0, seed=41, hi_rt_mul=0.7, lo_rt_mul=0.85)
    elif name == 'hall':        # scoring stage / concert hall
        r = make_ir(rt60=2.7, predelay=0.022, bright=0.45, width=1.0, seed=53, hi_rt_mul=0.5, lo_rt_mul=1.15,
                    early=[(0.019, 0.22, -0.7), (0.027, 0.2, 0.7), (0.038, 0.16, -0.2), (0.052, 0.13, 0.5)])
    elif name == 'booth':       # tight vocal booth, almost dry
        r = make_ir(rt60=0.18, predelay=0.002, bright=0.3, width=0.5, seed=61)
    else:
        raise KeyError(name)
    IRS[name] = r
    return r

# ----------------------------------------------------------------------------- mastering
def true_peak_db(y):
    y = to_st(y)
    up = signal.resample_poly(y, 4, 1, axis=1)
    return 20 * np.log10(np.max(np.abs(up)) + 1e-12)

def lufs(y):
    m = pyln.Meter(SR)
    return m.integrated_loudness(to_st(y).T)

def tp_limit(y, ceiling_db=-1.2, look_ms=1.5):
    """Transparent true-peak limiter: 4x oversampled, linked stereo, lookahead min-hold + smoothing."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    y = to_st(y)
    up = signal.resample_poly(y, 4, 1, axis=1)
    c = 10 ** (ceiling_db / 20)
    a = np.max(np.abs(up), axis=0)
    g = np.minimum(1.0, c / (a + 1e-12))
    if g.min() >= 1.0:
        return y
    w = max(1, int(look_ms / 1000 * SR * 4))
    g = minimum_filter1d(g, size=2 * w + 1)
    g = uniform_filter1d(g, size=w + 1)
    # slow release (40 ms) so the limiter does not flutter
    r = np.exp(-1.0 / (0.040 * SR * 4))
    out = np.empty_like(g); cur = 1.0
    for i in range(len(g)):          # one-pole release, instant attack
        cur = g[i] if g[i] < cur else r * cur + (1 - r) * g[i]
        out[i] = cur
    up = up * out
    return signal.resample_poly(up, 1, 4, axis=1)[:, :y.shape[1]]

def master(y, target=-14.0, tp=-1.0):
    """Normalize to target LUFS-I; hold true peak <= tp with a transparent limiter; iterate to converge."""
    y = to_st(y).astype(np.float64)
    for _ in range(8):
        y = y * 10 ** ((target - lufs(y)) / 20)
        if true_peak_db(y) <= tp and abs(lufs(y) - target) < 0.05:
            break
        y = tp_limit(y, tp - 0.25)
    peak = true_peak_db(y)
    if peak > tp:
        y *= 10 ** ((tp - peak - 0.02) / 20)
    return y

def export(y, relpath, target=-14.0, tp=-1.0, do_master=True, mp3=True):
    """Write <ROOT>/<relpath>.wav (48 kHz / 24-bit) and .mp3 (256 kbps). Returns stats."""
    y = fade(to_st(y), 0.002, 0.005)          # guard: never start/end on a non-zero sample
    if do_master:
        y = master(y, target, tp)
    path = os.path.join(ROOT, relpath + '.wav')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, y.T, SR, subtype='PCM_24')
    if mp3:
        env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
        subprocess.run([FFDIR + '/ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-c:a', 'libmp3lame',
                        '-b:a', '256k', path[:-4] + '.mp3'], check=True, env=env)
    st = dict(file=relpath, dur=round(y.shape[1] / SR, 3), lufs=round(lufs(y), 2), tp=round(true_peak_db(y), 2))
    print(st)
    return st

def tts_words(text, voice, speed=1.0):
    """Kokoro TTS -> (48 kHz mono, [(word, start_s, end_s)]) using Kokoro's duration predictions."""
    import hashlib, json
    vkey = voice if isinstance(voice, str) else hashlib.md5(voice.numpy().tobytes()).hexdigest()[:10]
    key = os.path.join(WORK, 'tts_cache', hashlib.md5(f'W|{text}|{vkey}|{speed}'.encode()).hexdigest())
    if os.path.exists(key + '.wav'):
        y, _ = sf.read(key + '.wav')
        return y, [tuple(w) for w in json.load(open(key + '.json'))]
    ys, words, off = [], [], 0.0
    for r in _pipe()(text, voice=voice, speed=speed):
        a = r.audio.numpy().astype(np.float64)
        for t in r.tokens:
            if t.start_ts is not None:
                words.append((t.text, off + t.start_ts, off + t.end_ts))
        ys.append(a); off += len(a) / 24000
    y = soxr.resample(np.concatenate(ys), 24000, SR, quality='VHQ')
    os.makedirs(os.path.dirname(key), exist_ok=True)
    sf.write(key + '.wav', y, SR, subtype='FLOAT'); json.dump(words, open(key + '.json', 'w'))
    return y, words

def f0_track(y, fmin=55, fmax=500, hop_s=0.005):
    """pyin F0 (Hz, nan when unvoiced) on a 24 kHz copy; returns (times, f0)."""
    import librosa
    x = soxr.resample(y, SR, 24000)
    hop = int(24000 * hop_s)
    f, v, p = librosa.pyin(x, fmin=fmin, fmax=fmax, sr=24000, frame_length=1024, hop_length=hop)
    return np.arange(len(f)) * hop_s, f


def world_repitch(y, st_fn, fp=5.0):
    """Re-synthesize y with WORLD after shifting voiced F0 by st_fn(t, f0) semitones (per frame).
    (Continuously varying Rubber Band pitch arrays click at chunk boundaries; WORLD does not.)"""
    x = np.ascontiguousarray(y, dtype=np.float64)
    f0, t = pw.harvest(x, SR, f0_floor=55, f0_ceil=450, frame_period=fp)
    sp = pw.cheaptrick(x, f0, t, SR); ap = pw.d4c(x, f0, t, SR)
    st = st_fn(t, f0)
    f1 = np.where(f0 > 0, f0 * 2 ** (st / 12), 0.0)
    out = pw.synthesize(f1, sp, ap, SR, fp)
    return out[:len(y)] if len(out) >= len(y) else np.pad(out, (0, len(y) - len(out)))

def level_word(y, strength=0.8, settle_st=-0.5, ramp=0.03, t0=0.0, t1=None, clip=(-7, 7)):
    """Pull a word's F0 toward its own median (flat read), via WORLD."""
    e = 20 * np.log10(rms_env(y, 240) + 1e-9)
    t1 = t1 if t1 is not None else len(y) / SR
    def fn(t, f):
        ei = np.minimum((t * SR / 240).astype(int), len(e) - 1)
        m = (f > 0) & (e[ei] > e.max() - 28) & (t >= t0) & (t <= t1)
        if m.sum() < 6:
            return np.zeros_like(t)
        tv, fv = t[m], f[m]
        level = np.median(fv)
        frac = (tv - tv[0]) / max(tv[-1] - tv[0], 1e-3)
        want = level * 2 ** (settle_st * frac / 12)
        st = np.clip(strength * 12 * np.log2(want / fv), *clip) * np.clip((tv - tv[0]) / ramp, 0, 1)
        cur = np.interp(t, tv, st, left=st[0], right=st[-1])
        return np.convolve(cur, np.ones(5) / 5, mode='same')
    return world_repitch(y, fn)
