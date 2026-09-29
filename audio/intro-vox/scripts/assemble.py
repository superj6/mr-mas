"""Assemble the 30.000 s / 48 kHz intro-vox stems, set mix-ready levels, run QA, write a check preview.

Run order:  build_vo.py -> build_chant.py -> build_pad.py -> assemble.py   (see README.md)

Level plan (for a full mix mastered to -14 LUFS-I / -1 dBTP with the music bus at about -15.5 LUFS,
SCRIPT v2.1 §9.6):
  VO       short-term (3 s) max -16.0 LUFS                  dialogue level
  whisper  -21.0 LUFS integrated over f285-299              ~4 LU under the music there (HF-rich: it reads)
  shout    -15.5 LUFS integrated over f300-316              ~1 LU under the band's Db hit: a gang shout at full voice
  PAD      -19.5 LUFS integrated over f632-686              ~2 dB over the violas it doubles (~7 LU under the tutti)
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
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from ivlib import *
from qa_harmony import pcs
import pyworld as pw
from scipy.ndimage import uniform_filter1d

AUDIO = os.path.join(REPO, 'audio')
TARGET = dict(whisper=(-21.0, 285, 300), shout=(-15.5, 300, 317), pad=(-19.5, 632, 686))


def set_window_loudness(y, target, a, b):
    g = target - lufs_window(y, fs(a), fs(b))
    return y * 10 ** (g / 20), g


def clicks(y):
    m = to_st(y).mean(0)
    d = np.diff(m, 2)
    loc = np.sqrt(uniform_filter1d(d ** 2, int(0.01 * SR))) + 1e-9
    z = np.abs(d) / loc
    idx = np.where((z > 9) & (np.abs(d) > 1e-3))[0]
    groups = []
    for i in idx:
        if groups and i - groups[-1][-1] < 200:
            groups[-1].append(i)
        else:
            groups.append([i])
    return [round(fr(g[0] / SR), 2) for g in groups]


def frame_db(y, a, b):
    m = to_st(y).mean(0)
    return {f: round(float(20 * np.log10(np.sqrt(np.mean(m[int(fs(f) * SR):int(fs(f + 1) * SR)] ** 2)) + 1e-12)), 1)
            for f in range(a, b)}


def side_f0(y, meta):
    """F0 of 'unclear which' (reference) and of the 'side' vowel on the final stem."""
    m = to_st(y).mean(0)
    a, b = fs(71), fs(92)
    x = np.ascontiguousarray(m[int(a * SR):int(b * SR)])
    f0, t = pw.harvest(x, SR, f0_floor=60, f0_ceil=300, frame_period=5)
    t = t + a
    lm = meta['landmarks_intro_s']
    ref = f0[(t > fs(72.3)) & (t < lm['fric_s'] - 0.03) & (f0 > 0)]
    sv = f0[(t > lm['vowel_s'] + 0.01) & (t < lm['vowel_end_s'] - 0.01) & (f0 > 0)]
    k = max(2, len(sv) // 3)
    return dict(unclear_which_median_hz=round(float(np.median(ref)), 1),
                side_first_third_hz=round(float(np.median(sv[:k])), 1), side_last_third_hz=round(float(np.median(sv[-k:])), 1),
                side_move_st=round(float(12 * np.log2(np.median(sv[-k:]) / np.median(sv[:k]))), 2),
                side_vs_phrase_st=round(float(12 * np.log2(np.median(sv) / np.median(ref))), 2))


def music_ref():
    """V1 music for the check preview: the theme agent's current V1 stems summed (v2.1 recompose in
    progress), or its mixer's roll-call re-render if the stems are not all readable."""
    names = ['bass', 'brass', 'chip', 'drums', 'fx', 'harmon', 'perc', 'piano', 'strings', 'sub', 'winds']
    st = {}
    try:
        for n in names:
            p = f'{AUDIO}/theme/stems/V1-{n}.wav'
            if os.path.exists(p):
                y, sr = sf.read(p)
                assert sr == SR
                st[n] = np.pad(y.T, ((0, 0), (0, max(0, N30 - y.shape[0]))))[:, :N30]
        src = 'theme/stems/V1-*.wav (summed)'
    except Exception:
        st = {}
    if len(st) < 8:
        y, _ = sf.read(f'{AUDIO}/mix/music/theme-V1-chipchamber-rollcall.wav')
        st = {'all': np.pad(y.T, ((0, 0), (0, max(0, N30 - y.shape[0]))))[:, :N30]}
        src = 'mix/music/theme-V1-chipchamber-rollcall.wav'
    return st, src


def duck_curve(depth_db, a=23, b=91, att=2, rel=6, lift=(58, 71)):
    """SCRIPT §9.6 VO duck: -depth over f23-91, 2-frame attack, 6-frame release, lifted inside the pause."""
    g = np.zeros(N30)
    def ramp(f0_, f1_, v0, v1):
        i0, i1 = int(fs(f0_) * SR), int(fs(f1_) * SR)
        g[i0:i1] = np.linspace(v0, v1, i1 - i0)
    ramp(a, a + att, 0, -depth_db); g[int(fs(a + att) * SR):int(fs(lift[0]) * SR)] = -depth_db
    ramp(lift[0], lift[0] + att, -depth_db, 0); g[int(fs(lift[0] + att) * SR):int(fs(lift[1] - att) * SR)] = 0
    ramp(lift[1] - att, lift[1], 0, -depth_db); g[int(fs(lift[1]) * SR):int(fs(b + 1) * SR)] = -depth_db
    ramp(b + 1, b + 1 + rel, -depth_db, 0)
    return 10 ** (g / 20)


if __name__ == '__main__':
    meta = json.load(open(os.path.join(BUILD, 'vo_meta.json')))
    vo = load_build('vo_stem')
    wh, g_wh = set_window_loudness(load_build('chant_whisper_raw'), *TARGET['whisper'])
    sh, g_sh = set_window_loudness(load_build('chant_shout_raw'), *TARGET['shout'])
    pad, g_pad = set_window_loudness(load_build('pad_raw'), *TARGET['pad'])
    chant = wh + sh
    vocals = chant + pad
    allv = vo + vocals
    for x in (vo, wh, sh, pad, chant, vocals, allv):
        assert x.shape == (2, N30)
        assert true_peak_db(x) < -1.0, true_peak_db(x)

    files = {
        'intro-vox_vo.wav': vo,
        'intro-vox_vocals.wav': vocals,
        'stems/intro-vox_chant.wav': chant,
        'stems/intro-vox_chant-whisper.wav': wh,
        'stems/intro-vox_chant-shout.wav': sh,
        'stems/intro-vox_pad.wav': pad,
        'stems/intro-vox_all_vo+vocals.wav': allv,
    }
    for rel, x in files.items():
        write_stem(x, rel)

    # ---------------------------------------------------------------- QA
    qa = dict(format='48 kHz, stereo, 24-bit PCM WAV, exactly 1,440,000 samples (30.000 s = f0-719)', files={})
    for rel, x in files.items():
        d, sr = sf.read(os.path.join(ROOT, rel))
        info = sf.info(os.path.join(ROOT, rel))
        s = stats(x, rel)
        s.update(samples=d.shape[0], sr=sr, channels=info.channels, subtype=info.subtype,
                 audible_frames_minus60dBFS=audible_span(x, -60), clicks=clicks(x))
        qa['files'][rel] = s
    qa['vo'] = dict(
        placement='clip 1 "near the singularity;" f24-57; pause f58-71 (room tone); clip 2 "unclear which side." f72-91',
        voice_first_frame_over_minus40dBFS=audible_span(vo - 0, -40)[0],
        voice_last_frame_over_minus40dBFS=audible_span(vo, -40)[1],
        last_frame_over_minus50dBFS=audible_span(vo, -50)[1],
        pause_f58_71_max_frame_dbfs=max(frame_db(vo, 60, 72).values()),
        frame_dbfs_f84_96=frame_db(vo, 84, 97),
        loudness_line_I=round(lufs_window(vo, fs(24), fs(96)), 2),
        side_pitch=side_f0(vo, meta),
        words=meta['words'], ratios=meta['p2_ratios_out_over_in'])
    qa['chant'] = dict(gain_db=dict(whisper=round(g_wh, 2), shout=round(g_sh, 2)),
                       whisper_I_f285_299=round(lufs_window(wh, fs(285), fs(300)), 2),
                       shout_I_f300_316=round(lufs_window(sh, fs(300), fs(317)), 2),
                       whisper_frames=audible_span(wh, -60), shout_frames=audible_span(sh, -60),
                       frame_dbfs=frame_db(chant, 283, 320))
    qa['pad'] = dict(gain_db=round(g_pad, 2), I_f632_686=round(lufs_window(pad, fs(632), fs(686)), 2),
                     frames=audible_span(pad, -60), pitch_classes_f634_686=pcs(pad, 634, 686),
                     frame_dbfs_even=dict(list(frame_db(pad, 626, 710).items())[::2]))

    # ---------------------------------------------------------------- check preview over V1 (not the mix)
    st, src = music_ref()
    duck = duck_curve(6.0)
    duck_str = duck_curve(9.0)
    mus = np.zeros((2, N30))
    for n, x in st.items():
        g = duck_str if n == 'strings' else (np.ones(N30) if n == 'sub' else duck)
        mus += x * g[None, :]
    mus *= 10 ** ((-15.5 - lufs(mus)) / 20)
    prev = mus + allv
    peak = true_peak_db(prev)
    if peak > -1.0:
        prev = tp_limit(prev, -1.25)
    rel_ = {}
    for name, (a, b) in dict(vo=(24, 92), whisper=(285, 300), shout=(300, 317), pad=(632, 686)).items():
        rel_[name] = dict(music_I=round(lufs_window(mus, fs(a), fs(b)), 1))
    rel_['vo']['vox_I'] = round(lufs_window(vo, fs(24), fs(92)), 1)
    rel_['whisper']['vox_I'] = round(lufs_window(wh, fs(285), fs(300)), 1)
    rel_['shout']['vox_I'] = round(lufs_window(sh, fs(300), fs(317)), 1)
    rel_['pad']['vox_I'] = round(lufs_window(pad, fs(632), fs(686)), 1)
    strings = st.get('strings')
    if strings is not None:
        rel_['pad']['strings_stem_I_in_preview'] = round(lufs_window(strings * 10 ** ((-15.5 - lufs(sum(st.values()))) / 20), fs(632), fs(686)), 1)
    os.makedirs(os.path.join(ROOT, 'previews'), exist_ok=True)
    tmp = os.path.join(BUILD, '_preview.wav')
    sf.write(tmp, prev.T, SR, subtype='PCM_24')
    mp3_out(tmp, os.path.join(ROOT, 'previews', '_check_intro-vox_over_V1.mp3'), '192k')
    os.remove(tmp)
    qa['preview'] = dict(file='previews/_check_intro-vox_over_V1.mp3', music_source=src,
                         music='V1 stems at -15.5 LUFS-I with the §9.6 VO duck (-6 dB, strings -9, sub untouched); '
                               'no SFX; a quick listening check, NOT the mix',
                         preview_I=round(lufs(prev), 2), preview_tp=round(true_peak_db(prev), 2), windows=rel_)
    os.makedirs(os.path.join(ROOT, 'qa'), exist_ok=True)
    json.dump(qa, open(os.path.join(ROOT, 'qa', 'qa.json'), 'w'), indent=1, default=float)

    # ---------------------------------------------------------------- timing sheet for picture (typing, lip/dot)
    sheet = dict(clock='24 fps, f0 = 0.000 s; frames are floats (in_f/out_f) and the frame that contains the event (in_frame/out_frame)',
                 source='intro-vox_vo.wav (am_michael, re-fit so the voice ends by f91)',
                 clips=[dict(clip=1, text='near the singularity;', start_frame=24, end_frame=57),
                        dict(clip=2, text='unclear which side.', start_frame=72, end_frame=91)],
                 words=meta['words'],
                 side_detail=dict(frication_s_onset_f=round(fr(meta['landmarks_intro_s']['fric_s']), 2),
                                  vowel_onset_f=round(fr(meta['landmarks_intro_s']['vowel_s']), 2),
                                  vowel_end_f=round(fr(meta['landmarks_intro_s']['vowel_end_s']), 2),
                                  voice_end_f=round(fr(meta['landmarks_intro_s']['voice_end_s']), 2)),
                 typing_lead_frames='typing runs 6 (phrase 1) / 8 (phrase 2) frames ahead of these word onsets (SCRIPT D4)')
    json.dump(sheet, open(os.path.join(ROOT, 'vo_word_timings.json'), 'w'), indent=1)
    print(json.dumps({k: v for k, v in qa.items() if k != 'files'}, indent=1, default=float))
    for k, v in qa['files'].items():
        print(k, {kk: v[kk] for kk in ('samples', 'sr', 'channels', 'lufs_I', 'short_term_max', 'momentary_max',
                                        'true_peak_dbtp', 'audible_frames_minus60dBFS', 'clicks')})
