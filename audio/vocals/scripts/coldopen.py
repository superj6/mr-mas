"""Cold-open VO: Mas, "near the singularity; unclear which side."

Timing target (final.md §3): VO in at f24. "near the singularity;" f24-57, pause f58-71,
"unclear which side." from f72, 'side' left hanging (level pitch), then silence.

Method per voice:
 1. Kokoro renders the whole line (so the rhythm is phrase-internal, not word-stitched).
    Phrase 1 and phrase 2 are taken from two renders at different model speeds so that each
    phrase is already close to its window; the cut is at the semicolon pause (silence), so it is seamless.
 2. Rubber Band (pedalboard.time_stretch) makes the exact frame fit with a per-region stretch
    array; the F0 of "side" is levelled by WORLD re-synthesis from inside the /s/ (seamless).
 3. A WORLD-vocoder whisper of the same take is laid under at -24 dB for close-mic breath.
 4. Chain: HPF 90 Hz, proximity shelf, soft top, 2:1 comp, light tanh saturation,
    0.3 s dark-room IR. Mastered to -14 LUFS-I / -1 dBTP.
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import pedalboard as pb
import pyworld as pw
from vlib import *

TEXT = "near the singularity; unclear which side"
# phrase 2 is rendered with a continuation tail (", and then") that is cut off after 'side':
# Kokoro then gives 'side' a non-final contour (much less fall, no creak) -> the 'hanging' read.
TEXT_P2 = "near the singularity; unclear which side, and then"
VO_IN = 24                                   # frame the VO starts under black
T_P1 = f2s(58 - 24) - 0.02                   # p1 speech length (ends just before f58)
T_P2_START = f2s(72 - 24)                    # p2 onset relative to VO start (2.000 s)
T_P2A = f2s(86 - 72)                         # "unclear which" -> "side" lands on f86
T_SIDE_V = 0.34                              # 'side' vowel+d length (hangs to ~f95)

VOICES = {
    'michael': 'am_michael',
    'puck': 'am_puck',
    'echo': 'am_echo',
    'liam': 'am_liam',
    'designed': {'am_michael': 0.5, 'am_puck': 0.3, 'am_echo': 0.2},   # blended stock embeddings
}

def voice_obj(v):
    return voice_blend(v) if isinstance(v, dict) else v

def word(words, w):
    return [x for x in words if x[0] == w][0]

def audible_end(y, t0, thr_db=-42):
    seg = y[int(t0 * SR):]
    r = active_regions(seg, thr_db=thr_db, min_gap=0.15)
    return t0 + (r[0][1] / SR if r else 0.3)

def render(v, speed, text=TEXT):
    y, words = tts_words(text, voice_obj(v), speed)
    near = word(words, 'near'); sing = word(words, 'singularity')
    unc = word(words, 'unclear'); side = word(words, 'side')
    # true onset of 'near': first energy after leading silence
    r = active_regions(y, thr_db=-45)
    near_on = r[0][0] / SR
    sing_end = audible_end(y, sing[1] + 0.2) if sing[2] - sing[1] > 0.3 else sing[2]
    sing_end = min(sing_end, unc[1])
    f0, t = pw.harvest(y, SR, f0_floor=50, f0_ceil=400, frame_period=5)
    e = 20 * np.log10(rms_env(y, 240) + 1e-9); ei = np.minimum((t * SR / 240).astype(int), len(e) - 1)
    vm = (t > side[1] + 0.03) & (t < side[2]) & (f0 > 0) & (e[ei] > e.max() - 30)
    side_v = float(t[vm][0]) if vm.any() else side[1] + 0.1
    side_end = min(audible_end(y, side_v), side[2] + 0.02)
    return dict(y=y, words=words, near_on=near_on, p1_end=sing_end, unc_on=unc[1], side_on=side[1],
                side_v=side_v, side_end=side_end)

def pick_speed(v, measure, target, s0=1.0, text=TEXT, lo=0.75, hi=1.15):
    r = render(v, s0, text)
    s = s0 * measure(r) / target
    s = float(np.clip(round(s / 0.025) * 0.025, lo, hi))
    r2 = render(v, s, text)
    return s, r2

def flatten_side(seg, t_s, t_on, t_end, t_ref0=0.0, settle_st=-0.2, ramp=0.04, strength=0.85):
    """Hold 'side' level at the phrase's own pitch (median F0 of 'unclear which'): removes the accent
    peak and the final fall. WORLD re-synthesis from the middle of /s/ on (crossfade inside the
    unvoiced fricative, so the seam is inaudible); the rest of the phrase stays Kokoro-native."""
    e = 20 * np.log10(rms_env(seg, 240) + 1e-9)
    info = {}
    def fn(t, f):
        ei = np.minimum((t * SR / 240).astype(int), len(e) - 1)
        ref = (t >= t_ref0) & (t < t_s - 0.03) & (f > 0) & (e[ei] > e.max() - 30)
        m = (t >= t_on) & (t <= t_end) & (f > 0)
        if m.sum() < 8 or ref.sum() < 5:
            return np.zeros_like(t)
        level = float(np.median(f[ref]))
        tv, fv = t[m], f[m]
        frac = (tv - tv[0]) / max(tv[-1] - tv[0], 1e-3)
        want = level * 2 ** (settle_st * frac / 12)
        st = np.clip(strength * 12 * np.log2(want / fv), -6, 9) * np.clip((tv - tv[0]) / ramp, 0, 1)
        cur = np.interp(t, tv, st, left=0.0, right=st[-1])
        cur = np.convolve(cur, np.ones(5) / 5, mode='same'); cur[t < tv[0] - 0.01] = 0
        k = max(4, len(fv) // 4)
        info.update(level_hz=round(level, 1), raw_peak_hz=round(float(np.max(fv)), 1),
                    raw_end_hz=round(float(np.median(fv[-k:])), 1))
        return cur
    w = world_repitch(seg, fn)
    # crossfade original -> WORLD in the middle of /s/ (15 ms)
    c = int(((t_s + t_on) / 2) * SR); h = int(0.0075 * SR)
    g = np.zeros(len(seg)); g[c + h:] = 1.0; g[c - h:c + h] = np.sin(np.linspace(0, np.pi / 2, 2 * h)) ** 2
    return seg * (1 - g) + w * g, info

def build(name, v):
    # phrase 1 speed: fit near..singularity into T_P1
    s1, r1 = pick_speed(v, lambda r: r['p1_end'] - r['near_on'], T_P1, 0.95)
    # phrase 2 speed: fit 'unclear which' into T_P2A
    s2, r2 = pick_speed(v, lambda r: r['side_on'] - r['unc_on'], T_P2A, 1.0, text=TEXT_P2)

    # ---- phrase 1: exact fit
    a, b = int((r1['near_on'] - 0.004) * SR), int((r1['p1_end'] + 0.06) * SR)
    p1 = r1['y'][a:b]
    L1 = r1['p1_end'] - r1['near_on'] + 0.004
    p1 = stretch(p1, T_P1 / L1)
    p1 = fade(p1, 0.002, 0.05)

    # ---- phrase 2: region stretch + level 'side' (cut before the continuation words)
    y2 = r2['y']
    a2 = int((r2['unc_on'] - 0.02) * SR)
    b2 = int((r2['side_end'] + 0.035) * SR)
    seg = fade(y2[a2:b2], 0.0, 0.035)
    t_side = r2['side_on'] - a2 / SR
    t_v = r2['side_v'] - a2 / SR
    t_side_end = r2['side_end'] - a2 / SR
    seg, pinfo = flatten_side(seg, t_side, t_v, t_side_end, t_ref0=0.02)
    # stretch array (pedalboard: >1 shortens). A = 'unclear which', S = /s/, B = vowel + /d/
    # (piecewise-constant stretch only; constant pitch -> no Rubber Band chunk clicks)
    fa = (t_side - 0.02) / T_P2A
    fs_ = 1.0
    fb = (len(seg) / SR - t_v) / (T_SIDE_V + 0.035)
    ts = np.arange(len(seg)) / SR
    sf_arr = np.where(ts < t_side, fa, np.where(ts < t_v, fs_, fb)).astype(np.float64)
    x = np.ascontiguousarray(seg[None, :], dtype=np.float32)
    p2 = pb.time_stretch(x, SR, stretch_factor=sf_arr, pitch_shift_in_semitones=0.0,
                         high_quality=True, transient_mode='crisp', preserve_formants=True)[0].astype(np.float64)
    p2 = fade(p2, 0.004, 0.06)

    # ---- assemble on the VO clock (t=0 == f24)
    total = T_P2_START + len(p2) / SR + 0.05
    dry = np.zeros(int(total * SR))
    dry[:len(p1)] += p1
    i2 = int((T_P2_START - 0.02 / fa) * SR)
    dry[i2:i2 + len(p2)] += p2[:len(dry) - i2]

    # ---- close-mic softness: breath layer from a WORLD whisper of the same take
    br = whisperize(dry)
    br = board_mono([pb.HighpassFilter(1400), pb.LowpassFilter(9000)], br)
    y = dry + br * 10 ** (-24 / 20) * (np.max(np.abs(dry)) / (np.max(np.abs(br)) + 1e-9))

    chain = [pb.HighpassFilter(90), pb.LowShelfFilter(170, 1.5, 0.7), pb.PeakFilter(3200, -2.0, 1.1),
             pb.PeakFilter(6500, -1.5, 1.5), pb.HighShelfFilter(8000, -2.5, 0.7),
             pb.Compressor(threshold_db=-22, ratio=2.0, attack_ms=8, release_ms=140)]
    y = board_mono(chain, y)
    y = saturate(y, 5.0, 0.22)
    out = convolve(y, ir('dark_room'), wet=0.16, dry=1.0)
    out = out[:, :int((total + 0.45) * SR)]
    out = fade(out, 0.0, 0.25)

    # ---- word timings on the intro clock (frames), from Kokoro durations mapped through the stretches
    k1 = T_P1 / L1
    def m1(t): return (t - r1['near_on'] + 0.004) * k1
    def m2(t):
        tl = t - a2 / SR
        if tl < t_side: o = tl / fa
        elif tl < t_v: o = t_side / fa + (tl - t_side)
        else: o = t_side / fa + (t_v - t_side) + (tl - t_v) / fb
        return T_P2_START - 0.02 / fa + o
    wt = []
    for w, s, e in r1['words']:
        if w in ('near', 'the', 'singularity'):
            wt.append((w, m1(max(s, r1['near_on'])), m1(min(e, r1['p1_end']))))
    for w, s, e in r2['words']:
        if w in ('unclear', 'which', 'side'):
            wt.append((w, m2(max(s, r2['unc_on'] - 0.02)), m2(min(e, r2['side_end']))))
    words = [dict(word=w, in_s=round(VO_IN / FPS + s, 3), out_s=round(VO_IN / FPS + e, 3),
                  in_f=int(np.floor(VO_IN + s * FPS)), out_f=int(np.floor(VO_IN + e * FPS))) for w, s, e in wt]
    info = dict(take=name, voice=v, kokoro_speed_p1=s1, kokoro_speed_p2=s2, stretch_p1=round(k1, 3),
                stretch_unclear_which=round(1 / fa, 3), stretch_side_vowel=round(1 / fb, 3), side_pitch=pinfo, words=words)
    return out, info

if __name__ == '__main__':
    only = sys.argv[1:] or list(VOICES)
    allinfo = {}
    for name in only:
        out, info = build(name, VOICES[name])
        st = export(out, f'vo/mas_coldopen_{name}')
        # placed on the intro clock: file t=0 == f0, 5.0 s (f0-119) so it drops straight onto the timeline
        placed = np.zeros((2, int(5.0 * SR)))
        y, _ = sf.read(os.path.join(ROOT, st['file'] + '.wav'))
        place(placed, y.T[:, :int((5.0 - 1.0) * SR)], VO_IN / FPS)
        export(fade(placed, 0, 0.05), f'vo/placed/mas_coldopen_{name}_at-f0', do_master=False)
        info.update(lufs=st['lufs'], true_peak=st['tp'], file_dur=st['dur'])
        allinfo[name] = info
        print(json.dumps(info, indent=1, default=str))
    path = os.path.join(ROOT, 'vo', 'mas_coldopen_word_timings.json')
    old = json.load(open(path)) if os.path.exists(path) else {}
    old.update(allinfo)
    json.dump(old, open(path, 'w'), indent=1, default=str)
