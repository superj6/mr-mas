"""VO stem: Mas (Kokoro stock voice am_michael), "near the singularity; unclear which side."

SCRIPT v2.1 §3.2 / §4 D1-D3:
  D1 "near the singularity;"  f24-57   (phrase 1, Kokoro speed 0.825, fit as in the vocal pass)
  D2 the semicolon pause      f58-71   (room tone only)
  D3 "unclear which side."    f72-91   "unclear" f72, "which" f81, "side" f86-91; the final "d" on f90-91;
                                        only the room tail runs past f91; no breath after.
The vocal pass's michael take hangs "side" to f94-95. This re-edit fits it by f91:
  * "unclear which" is anchored at its glottal onset (f72.07, not Kokoro's word boundary ~60 ms earlier)
    and gets a gentle 0.92x (the vocal pass used 0.88x) so the /tS/-/s/ frication starts at f84.24;
  * the frication (/tS/ + /s/) 0.61x (Rubber Band; noise compresses cleanly);
  * the "side" vowel 0.58x overall (0.70x on its CV and VC transitions, 0.55x in the middle), done in the
    WORLD parameter domain together with the F0 levelling the take already had (so the vowel gets one
    vocoder pass, not vocoder + phase vocoder);
  * the /d/ closure 0.85x.
Chain: breath layer (WORLD whisper, -24 dB), HPF 90, proximity shelf, soft top, 2:1 comp, light tanh,
split-band de-esser, 0.30 s dark-room IR at 14 % wet, a -66 dBFS dark-room tone under f22-95.
Levelled so the short-term (3 s) loudness peaks at -16.0 LUFS; true peak well under -1 dBTP.
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from ivlib import *
import pyworld as pw
import pedalboard as pb
import coldopen as co           # the vocal pass's take builder (read-only import; its __main__ is not run)
use_cache(co)

VOICE = 'am_michael'
VO_IN = 24
FP = 5.0

# output (intro-clock) targets for phrase 2, seconds
T_UNC = fs(72) + 0.003          # "unclear" acoustic (glottal) onset = f72.07
T_FRIC = 3.510                  # /tS/ burst -> /s/ (f84.24)
T_VOW = 3.610                   # "side" vowel onset (f86.64)
T_VEND = 3.762                  # vowel end / /d/ closure (f90.29)
K_CLOS = 0.85
K_TRANS = 0.70                  # vowel CV/VC transitions (25 ms / 30 ms of input)
LEVEL_STRENGTH = 0.92           # 'side' F0 pulled 92 % of the way to the phrase's own median ...
SETTLE_ST = -0.25               # ... with a -0.25 st settle: hanging, neither falling nor rising


def centroid_track(y, hop=240):
    n = len(y) // hop
    fq = np.fft.rfftfreq(1024, 1 / SR)
    out = np.zeros(n)
    win = np.hanning(hop)
    for i in range(n):
        s = np.abs(np.fft.rfft(y[i * hop:(i + 1) * hop] * win, 1024))
        out[i] = (s * fq).sum() / (s.sum() + 1e-12)
    return out


def landmarks(seg):
    """seg-local landmarks of 'which'->'side': closure release (frication onset), vowel onset, vowel end."""
    e = 20 * np.log10(rms_env(seg, 240) + 1e-12); e -= e.max()
    c = centroid_track(seg)
    t = np.arange(len(e)) * 240 / SR
    return e, c, t


def build_p2(r2):
    y2 = r2['y']
    a2 = int((r2['unc_on'] - 0.02) * SR)
    b2 = int((r2['side_end'] + 0.035) * SR)
    seg = fade(y2[a2:b2], 0.0, 0.035)
    off = a2 / SR                                   # render time of seg[0]
    e, c, t = landmarks(seg)
    side_on = r2['side_on'] - off
    # 0) acoustic onset of "unclear" (Kokoro's word boundary sits ~60 ms before the glottal onset):
    #    everything before it is render silence and is faded out, so the pause f58-71 stays clean
    i_ac = int(np.argmax((t > r2['unc_on'] - off) & (e > -30)))
    while i_ac > 0 and e[i_ac - 1] > -50:
        i_ac -= 1
    t_ac = t[i_ac]
    g_in = np.clip((np.arange(len(seg)) / SR - (t_ac - 0.012)) / 0.008, 0, 1) ** 2
    seg = seg * g_in
    # 1) frication onset: the energy dip (stop closure of /tS/) right before 'side', then the burst
    w = (t > side_on - 0.12) & (t < side_on + 0.02)
    i_dip = np.where(w)[0][np.argmin(e[w])]
    i_b = i_dip + int(np.argmax(e[i_dip:] > -45))
    t_fric = t[i_b]
    # 2) vowel onset: first frame after the frication with a low centroid and real energy
    k = i_b + 4
    while k < len(e) and not (c[k] < 2500 and e[k] > -30):
        k += 1
    t_vow = t[k]
    # 3) vowel end: the energy drop into the /d/ closure (last frame within 9 dB of the vowel's median)
    vm = np.median(e[k:k + 40])
    j = k + 10
    while j < len(e) - 1 and not (e[j] < vm - 8 and e[j + 1] < vm - 8):
        j += 1
    t_vend = t[j]
    t_end = len(seg) / SR
    L = dict(render_off=off, unclear_acoustic=t_ac + off, fric=t_fric + off, vowel=t_vow + off, vowel_end=t_vend + off, end=t_end + off,
             unc_on=r2['unc_on'], side_on=r2['side_on'])
    print('landmarks (render s):', {k_: round(v, 4) for k_, v in L.items()})

    # --- time map: seg-local input knots -> intro-clock output seconds
    t_unc = t_ac                                     # map anchor: the acoustic onset
    kA = (T_FRIC - T_UNC) / (t_fric - t_unc)
    kS = (T_VOW - T_FRIC) / (t_vow - t_fric)
    dv = t_vend - t_vow
    tr1, tr2 = 0.025, 0.030
    kV = ((T_VEND - T_VOW) - K_TRANS * (tr1 + tr2)) / (dv - tr1 - tr2)
    kin = [0.0, t_unc, t_fric, t_vow, t_vow + tr1, t_vend - tr2, t_vend, t_end]
    kout = [T_UNC - t_unc * kA, T_UNC, T_FRIC, T_VOW, T_VOW + tr1 * K_TRANS, T_VEND - tr2 * K_TRANS, T_VEND,
            T_VEND + (t_end - t_vend) * K_CLOS]
    kin, kout = np.array(kin), np.array(kout)
    ratios = dict(unclear_which=round(kA, 3), frication=round(kS, 3), vowel_overall=round((T_VEND - T_VOW) / dv, 3),
                  vowel_middle=round(kV, 3), vowel_transitions=K_TRANS, d_closure=K_CLOS)
    print('ratios (out/in):', ratios)
    def omap(ti):
        return np.interp(ti, kin, kout)

    # --- junction (crossfade) point in the /s/, between frication onset and vowel onset
    t_j = t_fric + 0.55 * (t_vow - t_fric)
    h = 0.0075

    # --- part A: Kokoro-native audio, Rubber Band piecewise-constant stretch ("unclear which" + /tS s/)
    nA = int((t_j + h + 0.01) * SR)
    A = seg[:nA]
    ts = np.arange(nA) / SR
    sf_arr = np.where(ts < t_fric, 1 / kA, 1 / kS).astype(np.float64)
    A_out = pb.time_stretch(np.ascontiguousarray(A[None, :], dtype=np.float32), SR, stretch_factor=sf_arr,
                            pitch_shift_in_semitones=0.0, high_quality=True, transient_mode='crisp',
                            preserve_formants=True)[0].astype(np.float64)

    # --- part B: WORLD analysis of the whole seg; F0 levelled on 'side'; parameters re-timed
    x = np.ascontiguousarray(seg, dtype=np.float64)
    f0, tf = pw.harvest(x, SR, f0_floor=55, f0_ceil=450, frame_period=FP)
    sp = pw.cheaptrick(x, f0, tf, SR)
    ap = pw.d4c(x, f0, tf, SR)
    ei = np.minimum((tf * SR / 240).astype(int), len(e) - 1)
    ref = (tf >= 0.02) & (tf < t_fric - 0.03) & (f0 > 0) & (e[ei] > -30)
    level = float(np.median(f0[ref]))
    vm_ = (tf >= t_vow) & (tf <= t_end) & (f0 > 0)
    tv, fv = tf[vm_], f0[vm_]
    frac = (tv - tv[0]) / max(tv[-1] - tv[0], 1e-3)
    want = level * 2 ** (SETTLE_ST * frac / 12)
    st = np.clip(LEVEL_STRENGTH * 12 * np.log2(want / fv), -7, 9)
    st = np.convolve(np.pad(st, 2, mode='edge'), np.ones(5) / 5, mode='valid')
    f1 = f0.copy()
    f1[vm_] = fv * 2 ** (st / 12)
    # the frication is unvoiced (harvest finds spurious voicing in the /s/): force it
    f1[(tf >= t_fric - 0.005) & (tf < t_vow - 0.004)] = 0.0
    pitch = dict(level_hz=round(level, 1), raw_onset_hz=round(float(fv[:3].mean()), 1),
                 raw_peak_hz=round(float(fv.max()), 1), raw_end_hz=round(float(np.median(fv[-6:])), 1),
                 out_onset_hz=round(float(f1[vm_][:3].mean()), 1), out_end_hz=round(float(np.median(f1[vm_][-6:])), 1))
    print('side pitch:', pitch)
    # output frames for part B
    tb0 = t_j - h - 0.01
    o0, o1 = omap(tb0), omap(t_end)
    to = o0 + np.arange(int((o1 - o0) / (FP / 1000)) + 2) * (FP / 1000)
    ti = np.interp(to, kout, kin)                                    # inverse map (monotone)
    idx = ti / (FP / 1000)
    i0 = np.clip(np.floor(idx).astype(int), 0, len(f0) - 1); i1 = np.clip(i0 + 1, 0, len(f0) - 1)
    wgt = (idx - np.floor(idx))
    sp_w = np.exp((1 - wgt)[:, None] * np.log(sp[i0] + 1e-16) + wgt[:, None] * np.log(sp[i1] + 1e-16))
    ap_w = np.clip((1 - wgt)[:, None] * ap[i0] + wgt[:, None] * ap[i1], 0, 1)
    near = np.where(wgt < 0.5, i0, i1)
    v0_, v1_ = f1[i0] > 0, f1[i1] > 0
    f_w = np.where(v0_ & v1_, np.exp((1 - wgt) * np.log(np.maximum(f1[i0], 1)) + wgt * np.log(np.maximum(f1[i1], 1))),
                   np.where(f1[near] > 0, f1[near], 0.0))
    B_out = pw.synthesize(np.ascontiguousarray(f_w), np.ascontiguousarray(sp_w), np.ascontiguousarray(ap_w), SR, FP)

    # --- assemble on the intro clock (absolute seconds)
    total = o1 + 0.05
    out = np.zeros(int(total * SR) + 1)
    a_start = kout[0]
    ia = int(round(a_start * SR))
    out[ia:ia + len(A_out)] += A_out[:len(out) - ia]
    ib = int(round(o0 * SR))
    xb = B_out[:len(out) - ib]
    # equal-power crossfade inside the /s/ (uncorrelated noise either side)
    j0, j1 = int(round(omap(t_j - h) * SR)), int(round(omap(t_j + h) * SR))
    gA = np.ones(len(out)); gA[j1:] = 0.0
    gA[j0:j1] = np.cos(np.linspace(0, np.pi / 2, j1 - j0))
    gB = np.zeros(len(out)); gB[j1:] = 1.0
    gB[j0:j1] = np.sin(np.linspace(0, np.pi / 2, j1 - j0))
    out *= gA
    tmp = np.zeros(len(out)); tmp[ib:ib + len(xb)] = xb
    out += tmp * gB
    out = fade(out, 0.0, 0.03)
    marks = dict(fric_s=T_FRIC, vowel_s=T_VOW, vowel_end_s=T_VEND, voice_end_s=round(float(o1), 4))
    return out, omap, off, L, ratios, pitch, marks


def main():
    v = co.VOICES['michael']
    s1, r1 = co.pick_speed(v, lambda r: r['p1_end'] - r['near_on'], co.T_P1, 0.95)
    s2, r2 = co.pick_speed(v, lambda r: r['side_on'] - r['unc_on'], co.T_P2A, 1.0, text=co.TEXT_P2)
    print('kokoro speeds', s1, s2)

    # ---- phrase 1: exactly as the vocal pass (it already meets f24-57)
    a, b = int((r1['near_on'] - 0.004) * SR), int((r1['p1_end'] + 0.06) * SR)
    L1 = r1['p1_end'] - r1['near_on'] + 0.004
    k1 = co.T_P1 / L1
    p1 = fade(stretch(r1['y'][a:b], k1), 0.002, 0.05)

    # ---- phrase 2: re-fit so the voice ends by f91
    p2, omap, off2, L, ratios, pitch, marks = build_p2(r2)

    dry = np.zeros(int(4.4 * SR))
    place_m = lambda dst, src, t: dst.__setitem__(slice(int(round(t * SR)), int(round(t * SR)) + len(src)),
                                                   dst[int(round(t * SR)):int(round(t * SR)) + len(src)] + src)
    place_m(dry, p1, fs(VO_IN))
    dry[:len(p2)] += p2[:len(dry)]

    # ---- close-mic softness (same recipe as the vocal pass)
    br = whisperize(dry)
    br = board_mono([pb.HighpassFilter(1400), pb.LowpassFilter(9000)], br)
    y = dry + br * 10 ** (-24 / 20) * (np.max(np.abs(dry)) / (np.max(np.abs(br)) + 1e-9))
    chain = [pb.HighpassFilter(90), pb.LowShelfFilter(170, 1.5, 0.7), pb.PeakFilter(3200, -2.0, 1.1),
             pb.PeakFilter(6500, -1.5, 1.5), pb.HighShelfFilter(8000, -2.5, 0.7),
             pb.Compressor(threshold_db=-22, ratio=2.0, attack_ms=8, release_ms=140)]
    y = board_mono(chain, y)
    y = saturate(y, 5.0, 0.22)
    y, de_gr = deess(y)
    y = convolve(y, ir('dark_room'), wet=0.14, dry=1.0)           # stereo, small dull room
    y = y[:, :int(4.4 * SR)]
    y = fade(y, 0.0, 0.2)

    # ---- word timings on the intro clock
    def m1(tr):
        return fs(VO_IN) + (tr - r1['near_on'] + 0.004) * k1
    words = []
    for w, s, e in r1['words']:
        if w in ('near', 'the', 'singularity'):
            # 'near' starts at its acoustic onset (the /n/ murmur); Kokoro's boundary sits ~65 ms later
            s_ = r1['near_on'] if w == 'near' else max(s, r1['near_on'])
            words.append((w, m1(s_), m1(min(e, r1['p1_end']))))
    for w, s, e in r2['words']:
        if w in ('unclear', 'which'):
            s_ = max(s, L['unclear_acoustic'])
            e_ = min(e, L['fric'])
            words.append((w, float(omap(s_ - off2)), float(omap(e_ - off2))))
    words.append(('side', marks['fric_s'], marks['voice_end_s']))
    return y, dict(words=words, s1=s1, s2=s2, k1=k1, ratios=ratios, pitch=pitch, marks=marks, deess_max_db=de_gr,
                   landmarks_render=L)


if __name__ == '__main__':
    y, info = main()
    # ---- 30.000 s stem: VO + a very low dark-room tone under f22-95 (so the two clips sit in one room)
    rt = room_tone(fs(95) - fs(22), -66.0)
    rt = fade(rt, 2 / FPS, 3 / FPS)
    vo = timeline([(y, 0.0, 1.0)])
    tone = timeline([(rt, fs(22), 1.0)])
    # level: short-term (3 s) max of the voice = -16.0 LUFS
    ts_, S = loud_curve(vo, 3.0, 0.05)
    g = 10 ** ((-16.0 - S.max()) / 20)
    vo *= g
    stem = vo + tone
    ts_, S = loud_curve(stem, 3.0, 0.05)
    stem *= 10 ** ((-16.0 - S.max()) / 20)
    save_build(stem, 'vo_stem')
    words = [dict(word=w, in_s=round(a, 3), out_s=round(b, 3), in_f=round(fr(a), 2), out_f=round(fr(b), 2),
                  in_frame=int(np.floor(fr(a))), out_frame=int(np.floor(fr(b) - 1e-6))) for w, a, b in info['words']]
    meta = dict(take='am_michael (Kokoro-82M stock voice, Apache-2.0)', kokoro_speed_p1=info['s1'],
                kokoro_speed_p2=info['s2'], stretch_p1=round(info['k1'], 3), p2_ratios_out_over_in=info['ratios'],
                side_pitch=info['pitch'], deess_max_gr_db=round(info['deess_max_db'], 2),
                landmarks_intro_s=info['marks'], words=words)
    json.dump(meta, open(os.path.join(BUILD, 'vo_meta.json'), 'w'), indent=1)
    print(json.dumps(meta, indent=1))
    print(stats(stem, 'vo'))
    print('audible span (-60 dBFS):', audible_span(stem, -60), ' (-45):', audible_span(stem, -45))
