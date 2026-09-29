"""MR. MAS intro audio sketch: theme (roll-call re-render) + SFX board + cold-open VO + chant + title choir.

usage:  .venv-mix/bin/python scripts/mix.py V1 V2 V3 V4
Needs mix/music/theme-<V>-rollcall.wav from scripts/render_music.py (then run scripts/qa_plots.py).

Everything is placed on the 24 fps grid (1 frame = 2000 samples at 48 kHz).  Every placed event is
written to timeline.json with frame, time, file, gain and processing, so the edit (Remotion <Audio>
layers) can rebuild the same balance.
"""
from __future__ import annotations
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

import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf
from scipy import signal

AUDIO = os.path.join(REPO, 'audio')
MIX = f'{AUDIO}/mix'
SFX = f'{AUDIO}/sfx'
VOC = f'{AUDIO}/vocals'
sys.path.insert(0, f'{AUDIO}/theme')
sys.path.insert(0, f'{MIX}/scripts')
from engine.mix import comp_gain, limiter_gain, lufs, true_peak   # noqa: E402  (theme engine, read-only)
import rollcall                                                     # noqa: E402

SR, FPS, SPF = 48000, 24, 2000
N = 720 * SPF
FFDIR = os.path.join(REPO, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
STEM_TRIM = -2.5          # the SFX agent's whole-stem trim (kept so gains match its layout)

MUSIC_NAMES = {'V1': 'V1-chipchamber', 'V2': 'V2-orchestralnoir', 'V3': 'V3-pixelswing', 'V4': 'V4-pianopixels'}


def db(x):
    return 10.0 ** (x / 20.0)


def f2n(f):
    return int(round(f * SPF))


def read(path):
    x, sr = sf.read(path, always_2d=True, dtype='float64')
    assert sr == SR, (path, sr)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x.T.copy()          # [2, n]


def fade(x, fin=0.0, fout=0.0):
    x = x.copy()
    n = x.shape[1]
    for dur, is_in in ((fin, True), (fout, False)):
        k = min(n, int(round(dur * SR)))
        if k <= 0:
            continue
        w = np.sin(np.linspace(0, 1, k) * np.pi / 2) ** 2
        if is_in:
            x[:, :k] *= w
        else:
            x[:, n - k:] *= w[::-1]
    return x


def hpf(x, hz, order=2):
    sos = signal.butter(order, hz, 'hp', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=1)


def place(bus, x, start_n):
    if start_n < 0:
        x = x[:, -start_n:]
        start_n = 0
    m = min(x.shape[1], bus.shape[1] - start_n)
    if m > 0:
        bus[:, start_n:start_n + m] += x[:, :m]


def env_follow(level, att_ms, rel_ms):
    """One-pole follower on a (decimated) mono level signal."""
    a = np.exp(-1.0 / (att_ms * SR / 1000 / 16))
    r = np.exp(-1.0 / (rel_ms * SR / 1000 / 16))
    xd = level[::16]
    y = np.empty_like(xd)
    s = 0.0
    for i, v in enumerate(xd):
        c = a if v > s else r
        s = c * s + (1 - c) * v
        y[i] = s
    return np.interp(np.arange(len(level)), np.arange(len(xd)) * 16, y)


def duck_curve(key, depth_db, thr_db=-42.0, range_db=12.0, att_ms=40.0, rel_ms=260.0):
    """Gain curve (linear) that dips by up to depth_db while `key` is active."""
    m = np.abs(key).max(0)
    lvl = env_follow(m, att_ms, rel_ms)
    ldb = 20 * np.log10(lvl + 1e-9)
    amt = np.clip((ldb - thr_db) / range_db, 0, 1)
    g = db(-depth_db * amt)
    # smooth the gain itself (no zipper)
    k = int(0.02 * SR)
    return np.convolve(g, np.ones(k) / k, mode='same')


def deess(x, lo=4500.0, hi=10000.0, start_db=-12.0, slope=0.6, max_db=6.0):
    """Split-band de-esser: when the 4.5-10 kHz band approaches the full-band level (an /s/, /sh/, /ch/),
    that band is pulled down by up to max_db.  Vowels (band ~20 dB under full band) are untouched."""
    sos = signal.butter(2, [lo, hi], 'bp', fs=SR, output='sos')
    band = signal.sosfiltfilt(sos, x, axis=1)
    eb = env_follow(np.abs(band).max(0), 2.0, 60.0)
    ef = env_follow(np.abs(x).max(0), 2.0, 60.0)
    ratio = 20 * np.log10((eb + 1e-9) / (ef + 1e-9))
    gr = np.clip((ratio - start_db) * slope, 0, max_db)
    k = int(0.003 * SR)
    gr = np.convolve(gr, np.ones(k) / k, mode='same')
    return x - band * (1 - db(-gr))[None], float(gr.max())


def curve(points, n=N):
    """[(frame, dB)] -> linear gain curve."""
    fr = np.array([p[0] for p in points], float) * SPF
    g = np.array([p[1] for p in points], float)
    return db(np.interp(np.arange(n), fr, g))


def lufs_win(x, a_f, b_f):
    seg = x[:, f2n(a_f):f2n(b_f)]
    try:
        return lufs(seg)
    except Exception:
        return float('-inf')


def mp3(wav, out, kbps=256):
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    subprocess.run([f'{FFDIR}/ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a',
                    f'{kbps}k', out], check=True, env=env)


# ------------------------------------------------------------------------------------------ SFX cue list
# The SFX agent's intro layout (sfx/scripts/layout.py CUES), revised for INTRO_PIXEL_BRIEF v2.1:
#  - bar 9 is now the roll call: shockwave, odometer, fired piano, room tone, glyph dissolve, hourglass
#    and heart glissando are OUT; the neon buzz/ignite are cut at the f480 hard cut to the first portrait;
#  - one glyph blink marks portrait 8 (the unnamed GLYPH cursor).
# (id, frame, trim_dB vs the SFX layout, options)
#   options: anchor start|end|hit, cut (frame), fin/fout (s), loop, hpf (Hz), vo_duck (dB), flavor (per var)
CUES = [
    ('room_drone', 0, -4, dict(fin=1.2, cut=120, fout=0.25, loop=True, vo_duck=3,
                               why='bed; the music carries its own F1+C2 drone, so this sits under it')),
    ('server_hum', 0, -1, dict(fin=0.8, cut=120, fout=0.2, loop=True, vo_duck=4)),
    ('typing_soft', 4, -3, dict(cut=64, fout=0.3, vo_duck=6, why='kept soft: it runs under "near the singularity"')),
    ('orb_servo', 97, -1, {}),
    ('orb_scan_sweep', 100, -1, dict(why='GLYPH-masked scan glimpse f99-104')),
    ('post_click', 112, 0, {}),
    ('reverse_swell_1beat', 120, -4, dict(anchor='end', why='the theme has its own reverse cymbal f105-119')),
    ('alert_bonk', 150, -6, dict(why='under the theme\'s square-wave sting; wood knock on E, never a meme bonk')),
    ('dialog_ok_click', 165, 1, {}),
    ('render_front_sweep', 168, -1, {}),
    ('tape_start', 168, -2, {}),
    ('collar_pop_Ab4', 180, -3, {}),
    ('collar_pop_C5', 187, -3, {}),
    ('collar_pop_F5', 202, -3, {}),
    ('tape_spinup', 225, 3, {}),
    ('keycap_popcorn', 225, 2, {}),
    ('keyboard_roll', 240, -1, dict(anchor='end')),
    ('camera_shutter', 240, 3, {}),
    ('freeze_hit_F', 240, 0, dict(hpf=110, why='low end left to the score\'s timpani/808')),
    ('flame_whoomph', 285, -3, dict(hpf=60, why='sits under the whispered FEEL')),
    ('camera_shutter', 300, 2, {}),
    ('freeze_hit_Db', 300, -2, dict(hpf=110, why='shares f300 with the shouted A-G-I')),
    ('klaxon', 345, 0, {}),
    ('steam_hiss', 345, -2, {}),
    ('vault_chime_triple', 347, 0, {}),
    ('paper_flutter', 350, -2, {}),
    ('camera_shutter', 360, 3, {}),
    ('freeze_hit_Bb', 360, 0, dict(hpf=110)),
    ('paper_whip', 401, -1, {}),
    ('ceiling_burst', 405, -1, dict(hpf=50)),
    ('rocket_roar', 405, -1, dict(hpf=40)),
    ('camera_shutter', 420, 3, {}),
    ('freeze_hit_C', 420, 0, dict(hpf=110)),
    ('landing_thunk', 420, -2, dict(hpf=70)),
    ('rubber_stamp_C', 435, -1, dict(flavor={'V2': 'band'})),
    ('neon_buzz', 465, 5, dict(fin=0.1, cut=480, fout=0.03, loop=True, why='v2.1: hard cut to portrait 1 at f480')),
    ('letter_clunk', 473, -1, dict(anchor='hit')),
    ('neon_ignite', 474, 3, dict(cut=481, fout=0.04)),
    ('glyph_blink', 532.5, 1, dict(anchor='hit', why='v2.1 roll call portrait 8: the unnamed player (GLYPH cursor)')),
    ('tower_pluck_1_F4', 540, -4, dict(flavor={'V3': 'band', 'V4': 'chip'}, why='doubles the score\'s pluck')),
    ('tower_pop', 540, 1, {}),
    ('tower_pluck_2_F4', 555, -4, dict(flavor={'V3': 'band', 'V4': 'chip'})),
    ('tower_pop', 555, -1, {}),
    ('siren_whoop_F', 555, -4, {}),
    ('tower_pluck_3_F4', 570, -4, dict(flavor={'V3': 'band', 'V4': 'chip'})),
    ('tower_pop', 570, -1, {}),
    ('drip_clack', 570, 1, {}),
    ('tower_pluck_4_F4', 585, -4, dict(flavor={'V3': 'band', 'V4': 'chip'})),
    ('tower_pop', 585, -1, {}),
    ('ka_ching', 585, 1, dict(flavor={'V3': 'band'})),
    ('tower_pluck_5_G4', 600, -4, dict(flavor={'V3': 'band', 'V4': 'chip'})),
    ('tower_pop', 600, 1, {}),
    ('tower_pop', 603, -3, {}),
    ('tower_pluck_6_Ab4', 615, -4, dict(flavor={'V3': 'band', 'V4': 'chip'})),
    ('tower_pop', 615, -2, {}),
    ('plop_water', 615, 0, {}),
    ('tower_pluck_7_C5', 622, -3, dict(flavor={'V3': 'band', 'V4': 'chip'})),
    ('tower_pop', 622, 1, {}),
    ('reverse_swell_2beat', 630, -6, dict(anchor='end', why='the score has its own snare roll + cymbal swell')),
    ('whoosh_pullback', 690, -1, {}),
    ('room_drone', 690, -4, dict(fin=0.3, cut=720, fout=0.5, loop=True)),
    ('glyph_blink', 705, 3, dict(anchor='hit')),
    ('bell_ding_F6', 705, -4, dict(flavor={'V3': 'band'}, why='the score has its own glock/bell ding')),
]
REMOVED_V21 = ['shockwave_bloom f480', 'odometer_ratchet f480', 'room_tone f495 (unmuted bus)',
               'piano_fired_F4 f495', 'glyph_dissolve f499', 'hourglass_shatter f518', 'heart_gliss f525']

# ------------------------------------------------------------------------------------------ per variation
VAR = {
    'V1': dict(choir='harmony/title-pad_HYBRID_orch+jazz+chip_F.wav', chant='stone-room',
               note='chip chamber jazz; hybrid SFX; hybrid choir (orchestral + jazz group, chip voice underneath)'),
    'V2': dict(choir='harmony/title-pad_orchestral-choir_open-fifth_F.wav', chant='cathedral',
               note='orchestral noir; hybrid SFX (orchestral stamp); chamber choir open fifth; cathedral chant'),
    'V3': dict(choir='harmony/title-pad_HYBRID_jazz+chip_F9sus.wav', chant='stone-room',
               note='pixel swing; jazz-flavour plucks/ka-ching/ding; jazz quartal group + chip voice'),
    'V4': dict(choir='harmony/title-pad_piano-intimate_ooh_Fsus.wav', chant='stone-room',
               note='piano & pixels; chip plucks; intimate 4-voice "ooh" pad'),
}
VO_FILE = 'vo/mas_coldopen_michael.wav'       # vocals agent's primary take; file t=0 is f24

# balance targets (LU, measured pre-master on the summed buses)
MUSIC_GAIN = -2.0         # music master into the mix bus
SFX_BUS_TRIM = 2.5        # on top of the SFX agent's layout gains (its stem sat 8-9 LU under the music)
VO_DYN_EQ_DB = 5.0        # speech-band (1-4 kHz) dip on music + beds while the VO speaks
T_VO_OVER_BED = 10.0      # VO integrated vs bed (music+SFX) over f24-98 (first pass)
VO_TARGET_MASTER = -16.5  # then the VO is set to this loudness in the final master, same in all four files,
VO_MIN_OVER_BED = 9.0     # as long as it stays at least this far over the bed
T_SHOUT_VS_MUSIC = 1.0    # shouted A-G-I (f300-312) vs music there
T_WHISPER_OVER_BED = 1.5  # whispered FEEL/THE (f284-299) vs ducked bed
T_CHOIR_UNDER = -7.0      # title choir (f632-690) vs music there
T_SFX_BUS_UNDER = -8.0    # whole SFX bus integrated vs music bus integrated (sanity target)


def load_manifest():
    man = json.load(open(f'{SFX}/manifest.json'))
    return {r['id']: r for r in man}


def build_sfx(v, man):
    bus_main = np.zeros((2, N))
    beds = []
    events = []
    snippets = []
    for sid, fr, trim, opt in CUES:
        flav = (opt.get('flavor') or {}).get(v)
        use = f'{sid}--{flav}' if flav and f'{sid}--{flav}' in man else sid
        r, r0 = man[use], man[sid]
        x = read(f"{SFX}/{r['file']}")
        gain = r0['mixDb'] + STEM_TRIM + SFX_BUS_TRIM + trim
        if use != sid:     # match the variant's peak loudness to the default's
            gain += r0['levels']['lufsMomentaryMax'] - r['levels']['lufsMomentaryMax']
        if opt.get('loop'):
            span = (opt.get('cut', 720) - fr) / FPS + 0.3
            reps = int(np.ceil(span * SR / x.shape[1])) + 1
            x = np.tile(x, (1, reps))
        anchor = opt.get('anchor', 'start')
        t = fr / FPS
        if anchor == 'end':
            t -= x.shape[1] / SR
        elif anchor == 'hit':
            t -= float(r.get('syncOffset') or 0.0)
        if 'cut' in opt:
            x = x[:, :max(0, int(round((opt['cut'] / FPS - t) * SR)))]
        x = fade(x, opt.get('fin', 0.0), opt.get('fout', 0.0))
        if opt.get('hpf'):
            x = hpf(x, opt['hpf'])
        x = x * db(gain)
        start_n = int(round(t * SR))
        snippets.append((start_n, x, anchor))
        if opt.get('vo_duck'):
            y = np.zeros((2, N))
            place(y, x, start_n)
            beds.append((y, opt['vo_duck']))
        else:
            place(bus_main, x, start_n)
        events.append(dict(layer='sfx', id=use, frame=fr, start_frame=round(t * FPS, 3), time_s=round(t, 4),
                           file=f"sfx/{r['file']}", gain_db=round(gain, 2), anchor=anchor,
                           cut_frame=opt.get('cut'), fade_in_s=opt.get('fin'), fade_out_s=opt.get('fout'),
                           loop=bool(opt.get('loop')), hpf_hz=opt.get('hpf'), vo_duck_db=opt.get('vo_duck'),
                           flavor=flav or 'hybrid', note=opt.get('why')))
    return bus_main, beds, events, snippets


_KB = [(np.array([1.53512485958697, -2.69169618940638, 1.19839281085285]),
        np.array([1.0, -1.69065929318241, 0.73248077421585])),
       (np.array([1.0, -2.0, 1.0]), np.array([1.0, -1.99004745483398, 0.99007225036621]))]


def kweight(x):
    for b, a in _KB:
        x = signal.lfilter(b, a, x, axis=-1)
    return x


def kloud(xk):
    """BS.1770 loudness of an already K-weighted block (no gating) - fine for short event windows."""
    return float(-0.691 + 10 * np.log10(np.sum(np.mean(xk ** 2, axis=-1)) + 1e-20))


def end_fade():
    g = np.interp(np.arange(N), [0, f2n(706), f2n(719.5), N], [1, 1, 0, 0]) ** 2
    return g


def build(v, man, vo_trim=0.0):
    cfg = VAR[v]
    events = []
    # ---- music: the roll-call re-render, mastered exactly like the theme agent's masters (its glue comp +
    # limiter), so the composer's loudness arc (quiet cold open, drop, dinner, loud title) is kept as designed
    music_file = f'mix/music/theme-{MUSIC_NAMES[v]}-rollcall.wav'
    music = read(f'{AUDIO}/{music_file}')[:, :N]
    g_music = MUSIC_GAIN
    music *= db(g_music)
    events.append(dict(layer='music', id=f'theme-{MUSIC_NAMES[v]}-rollcall', frame=0, start_frame=0, time_s=0.0,
                       file=music_file, gain_db=round(g_music, 2),
                       note='theme agent\'s score + engine re-rendered by scripts/render_music.py with the v2.1 roll '
                            'call in bar 9 (no mute); music-only master at -14 LUFS / -1 dBTP'))

    # ---- SFX
    sfx_main, beds, ev, snippets = build_sfx(v, man)
    events += ev

    # ---- VO (file t=0 = f24)
    vo = np.zeros((2, N))
    vo_raw = read(f'{VOC}/{VO_FILE}')
    vo_proc, deess_max = deess(vo_raw)
    place(vo, vo_proc, f2n(24))

    # ---- chant (file t=0 = f280): separate whisper / shout stems for balance
    room = cfg['chant']
    if room == 'stone-room':
        wh_f = 'chant/feel-the-agi_stone-room_STEM-whisper_from-f280.wav'
        sh_f = 'chant/feel-the-agi_stone-room_STEM-shout_from-f280.wav'
        whisper, shout = np.zeros((2, N)), np.zeros((2, N))
        place(whisper, read(f'{VOC}/{wh_f}'), f2n(280))
        place(shout, read(f'{VOC}/{sh_f}'), f2n(280))
    else:   # cathedral: one file; split at f299.5 into whisper / shout parts for level setting
        wh_f = sh_f = 'chant/feel-the-agi_cathedral_from-f280.wav'
        full = np.zeros((2, N))
        place(full, read(f'{VOC}/{wh_f}'), f2n(280))
        xf = np.interp(np.arange(N), [0, f2n(298.5), f2n(299.5), N], [1, 1, 0, 0])
        whisper, shout = full * xf[None], full * (1 - xf)[None]

    # ---- title choir (file t=0 = f630)
    choir = np.zeros((2, N))
    place(choir, read(f"{VOC}/{cfg['choir']}"), f2n(630))

    # ---------------------------------------------------------------- balance (measured)
    look = int(0.05 * SR)                                # 50 ms look-ahead on the VO key
    vo_key = np.concatenate([vo[:, look:], np.zeros((2, look))], axis=1)
    vo_duck = duck_curve(vo_key, 1.0)                    # 0..1 shape (depth applied per bus)
    vo_amt = np.clip(-20 * np.log10(vo_duck), 0, 1)
    wh_amt = np.clip(-20 * np.log10(duck_curve(whisper, 1.0, thr_db=-48, att_ms=30, rel_ms=200)), 0, 1)
    wh_amt *= np.interp(np.arange(N), [0, f2n(282), f2n(284), f2n(299), f2n(300), N], [0, 0, 1, 1, 0, 0])
    MUSIC_VO_DUCK, MUSIC_WH_DUCK = 3.0, 4.0
    g_mus_auto = db(-MUSIC_VO_DUCK * vo_amt - MUSIC_WH_DUCK * wh_amt)
    sos_sp = signal.butter(2, [1000, 4000], 'bp', fs=SR, output='sos')
    dip = (1 - db(-VO_DYN_EQ_DB)) * vo_amt       # fraction of the speech band removed

    def speech_dip(x):
        return x - signal.sosfiltfilt(sos_sp, x, axis=1) * dip[None]
    music_d = speech_dip(music) * g_mus_auto[None]
    bed_sum = np.zeros((2, N))
    for y, depth in beds:
        bed_sum += speech_dip(y) * db(-depth * vo_amt)[None]
    sfx = sfx_main + bed_sum
    bed = music_d + sfx

    g_vo = (lufs_win(bed, 24, 98) + T_VO_OVER_BED) - lufs_win(vo, 24, 98) + vo_trim
    g_sh = (lufs_win(music_d, 300, 312) + T_SHOUT_VS_MUSIC) - lufs_win(shout, 300, 312)
    g_wh = (lufs_win(bed, 284, 299) + T_WHISPER_OVER_BED) - lufs_win(whisper, 284, 299)
    g_ch = (lufs_win(music_d, 632, 690) + T_CHOIR_UNDER) - lufs_win(choir, 632, 690)
    vo_g, wh_g, sh_g, ch_g = vo * db(g_vo), whisper * db(g_wh), shout * db(g_sh), choir * db(g_ch)

    events.append(dict(layer='vo', id='mas_coldopen_michael', frame=24, start_frame=24, time_s=1.0,
                       file=f'vocals/{VO_FILE}', gain_db=round(g_vo, 2),
                       words=[dict(word=w['word'], in_frame=w['in_f'], out_frame=w['out_f']) for w in
                              json.load(open(f'{VOC}/vo/mas_coldopen_word_timings.json'))['michael']['words']],
                       processing=f'split-band de-esser 4.5-10 kHz (max {deess_max:.1f} dB on sibilants)',
                       note='"near the singularity; unclear which side." - Kokoro am_michael (Apache-2.0 stock voice)'))
    if room == 'stone-room':
        events.append(dict(layer='chant', id='chant_whisper', frame=285, start_frame=280, time_s=round(280 / 24, 4),
                           file=f'vocals/{wh_f}', gain_db=round(g_wh, 2), note='whispered FEEL f285 / THE f292'))
        events.append(dict(layer='chant', id='chant_shout', frame=300, start_frame=280, time_s=round(280 / 24, 4),
                           file=f'vocals/{sh_f}', gain_db=round(g_sh, 2), note='shouted A-G-I f300/303/307'))
    else:
        events.append(dict(layer='chant', id='chant_cathedral', frame=285, start_frame=280,
                           time_s=round(280 / 24, 4), file=f'vocals/{wh_f}', gain_db=round(g_wh, 2),
                           gain_db_after_f299=round(g_sh, 2),
                           note='one file; gain crossfades from the whisper gain to the shout gain at f298.5-299.5'))
    events.append(dict(layer='choir', id=os.path.basename(cfg['choir'])[:-4], frame=630, start_frame=630,
                       time_s=26.25, file=f"vocals/{cfg['choir']}", gain_db=round(g_ch, 2),
                       note='under the final hit; no third (title rule)'))

    # ---------------------------------------------------------------- sum + master
    mix = music_d + sfx + vo_g + wh_g + sh_g + ch_g
    ef = end_fade()
    mix *= ef[None]
    P = int(0.25 * SR)                                     # pad so the dynamics see no edge

    def padded(fn, x, *a, **k):
        return fn(np.pad(x, ((0, 0), (P, P))), *a, **k)[P:P + x.shape[1]]
    g_comp = padded(comp_gain, mix, thresh_db=-15.0, ratio=1.5, att_ms=30.0, rel_ms=250.0)
    y0 = mix * g_comp[None]
    mk = db(-14.0 - lufs(y0))
    for _ in range(6):
        y1 = y0 * mk
        g_lim = padded(limiter_gain, y1, -1.2, look_ms=1.5, rel_ms=90.0)
        y2 = y1 * g_lim[None]
        err = -14.0 - lufs(y2)
        if abs(err) < 0.03:
            break
        mk *= db(err)
    out = y2
    tp = true_peak(out)
    if tp > db(-1.0):
        out *= db(-1.0) / tp * 0.997
    g_master = g_comp * mk * g_lim
    # ---------------------------------------------------------------- QA numbers
    parts = dict(music=music_d, sfx=sfx, vo=vo_g, chant=wh_g + sh_g, choir=ch_g)
    qa = dict(variation=v, integrated_lufs=round(lufs(out), 2), true_peak_dbtp=round(20 * np.log10(true_peak(out)), 2),
              master_makeup_db=round(20 * np.log10(mk), 2),
              limiter_gr_max_db=round(float(-20 * np.log10(g_lim.min())), 2),
              comp_gr_max_db=round(float(-20 * np.log10(g_comp.min())), 2),
              gains=dict(music=round(g_music, 2), vo=round(g_vo, 2), whisper=round(g_wh, 2), shout=round(g_sh, 2),
                         choir=round(g_ch, 2)),
              sfx_bus_vs_music_lu=round(lufs(sfx) - lufs(music_d), 2))
    # per-bar short-term loudness of the master and of each part (post master gain)
    bars = {}
    for name, x in [('master', out)] + [(k, x * g_master[None] * ef[None]) for k, x in parts.items()]:
        bars[name] = [round(lufs_win(x, 60 * k, 60 * (k + 1)), 1) if np.abs(x[:, f2n(60 * k):f2n(60 * (k + 1))]).max() > 1e-5
                      else None for k in range(12)]
    qa['bar_lufs'] = bars
    np.save(f'{MIX}/cache/{v}_parts.npy', np.stack([out] + [x * g_master[None] * ef[None] for x in parts.values()])
            .astype(np.float16))
    # windows that matter
    win = {}
    for name, a, b in [('vo_line', 24, 98), ('pause_f58_71', 58, 71), ('drop_f120_179', 120, 179),
                       ('dinner_f240_479', 240, 479), ('chant_whisper_f284_299', 284, 299),
                       ('chant_shout_f300_312', 300, 312), ('rollcall_f480_539', 480, 539),
                       ('skyline_f540_629', 540, 629), ('title_f630_689', 630, 689)]:
        win[name] = {k: round(lufs_win(x * g_master[None], a, b), 1) for k, x in parts.items()
                     if np.abs(x[:, f2n(a):f2n(b)]).max() > 1e-5}
        win[name]['master'] = round(lufs_win(out, a, b), 1)
    qa['windows_lufs'] = win
    # speech-band SNR of the VO over the bed (1-4 kHz, f24-98)
    sos = signal.butter(4, [1000, 4000], 'bp', fs=SR, output='sos')
    a, b = f2n(24), f2n(98)
    vb = signal.sosfilt(sos, (vo_g * g_master[None])[:, a:b], axis=1)
    bb = signal.sosfilt(sos, ((music_d + sfx) * g_master[None])[:, a:b], axis=1)
    qa['vo_speechband_snr_db'] = round(float(10 * np.log10(np.mean(vb ** 2) / (np.mean(bb ** 2) + 1e-20))), 1)
    # per word (vocals agent's measured word frames for this take)
    wt = json.load(open(f'{VOC}/vo/mas_coldopen_word_timings.json'))['michael']['words']
    per_word = {}
    for w in wt:
        a, b = f2n(w['in_f']), f2n(w['out_f'] + 1)
        vb = signal.sosfilt(sos, (vo_g * g_master[None])[:, a:b], axis=1)
        bb = signal.sosfilt(sos, ((music_d + sfx) * g_master[None])[:, a:b], axis=1)
        per_word[w['word']] = round(float(10 * np.log10(np.mean(vb ** 2) / (np.mean(bb ** 2) + 1e-20))), 1)
    qa['vo_speechband_snr_per_word_db'] = per_word
    # event audibility: each SFX event's loudness vs everything else, in its first 0.4 s (or last 0.4 s for
    # end-anchored swells/rolls), K-weighted, post master gain
    outk = kweight(out.astype(np.float64))
    aud = []
    for (start_n, x, anchor), e in zip(snippets, [e for e in events if e['layer'] == 'sfx']):
        L = x.shape[1]
        if anchor == 'end':
            a0, a1 = start_n + max(0, L - int(0.4 * SR)), start_n + L
        else:
            a0, a1 = start_n, start_n + min(L, int(0.4 * SR))
        a0, a1 = max(0, a0), min(N, a1)
        if a1 - a0 < 480:
            continue
        seg = np.zeros((2, a1 - a0))
        o = max(0, -start_n)
        seg[:, :] = x[:, a0 - start_n:a1 - start_n] if start_n >= 0 else x[:, a0 - start_n:a1 - start_n]
        segm = seg * g_master[None, a0:a1] * ef[None, a0:a1]
        ek = kweight(np.concatenate([np.zeros((2, 4800)), segm], axis=1))[:, 4800:]
        rest = outk[:, a0:a1] - ek
        # local: 20 ms hops where the event is within 10 dB of its own peak
        H = 960
        nh = ek.shape[1] // H
        if nh < 1:
            continue
        pe = np.sum(np.mean(ek[:, :nh * H].reshape(2, nh, H) ** 2, axis=2), axis=0)
        pr = np.sum(np.mean(rest[:, :nh * H].reshape(2, nh, H) ** 2, axis=2), axis=0)
        act = pe > pe.max() * 0.1
        loc = 10 * np.log10(pe[act].mean() / (pr[act].mean() + 1e-20))
        aud.append(dict(id=e['id'], frame=e['frame'], event_lufs=round(kloud(ek), 1),
                        rest_lufs=round(kloud(rest), 1), event_vs_rest_lu=round(kloud(ek) - kloud(rest), 1),
                        local_snr_db=round(float(loc), 1), active_ms=int(act.sum() * 20)))
    qa['sfx_event_vs_rest'] = aud
    # limiter / comp gain reduction around the hits
    gr = {}
    for f in (120, 240, 300, 360, 420, 435, 480, 510, 525, 540, 622, 630, 705):
        a, b = f2n(f - 1), f2n(f + 8)
        gr[f] = dict(limiter=round(float(-20 * np.log10(g_lim[a:b].min())), 1),
                     comp=round(float(-20 * np.log10(g_comp[a:b].min())), 1))
    qa['gain_reduction_at_hits_db'] = gr
    gl = -20 * np.log10(g_lim)
    top = []
    gtmp = gl.copy()
    for _ in range(5):
        i = int(np.argmax(gtmp))
        top.append(dict(frame=round(i / SPF, 1), limiter_gr_db=round(float(gtmp[i]), 1)))
        gtmp[max(0, i - SPF * 6):i + SPF * 6] = 0
    qa['limiter_gr_top5'] = top
    return out.astype(np.float32), events, qa


def main(vs):
    man = load_manifest()
    tl_path = f'{MIX}/timeline.json'
    tl = json.load(open(tl_path)) if os.path.exists(tl_path) else {}
    qa_path = f'{MIX}/qa/mix_qa.json'
    qa_all = json.load(open(qa_path)) if os.path.exists(qa_path) else {}
    for v in vs:
        out, events, qa = build(v, man)
        delta = VO_TARGET_MASTER - qa['windows_lufs']['vo_line']['vo']
        delta = max(delta, VO_MIN_OVER_BED - T_VO_OVER_BED)
        out, events, qa = build(v, man, vo_trim=delta)
        qa['vo_trim_second_pass_db'] = round(delta, 2)
        wav = f'{MIX}/intro-sketch-{v}.wav'
        sf.write(wav, out.T, SR, subtype='PCM_24')
        mp3(wav, wav[:-4] + '.mp3', kbps=256)
        events.sort(key=lambda e: (e['start_frame'], e['layer']))
        tl.setdefault('variations', {})[v] = dict(
            file_wav=f'mix/intro-sketch-{v}.wav', file_mp3=f'mix/intro-sketch-{v}.mp3', note=VAR[v]['note'],
            measured=dict(integrated_lufs=qa['integrated_lufs'], true_peak_dbtp=qa['true_peak_dbtp'],
                          master_makeup_db=qa['master_makeup_db'], limiter_gr_max_db=qa['limiter_gr_max_db'],
                          vo_line_lufs=qa['windows_lufs']['vo_line']['vo']),
            events=events)
        qa_all[v] = qa
        print(v, json.dumps({k: qa[k] for k in ('integrated_lufs', 'true_peak_dbtp', 'limiter_gr_max_db',
                                                 'comp_gr_max_db', 'gains', 'sfx_bus_vs_music_lu',
                                                 'vo_speechband_snr_db')}), flush=True)
    tl.update(dict(
        show='MR. MAS', piece='Intro audio sketch (30.000 s)', fps=FPS, bpm=96, frames=720, duration_s=30.0,
        sample_rate=SR, samples_per_frame=SPF,
        paths_relative_to=os.path.join(REPO, 'audio'),
        time_rule='time_s = start_frame / 24 (start_frame differs from frame for end- or hit-anchored files)',
        gain_rule='gain_db is applied to the file as-is (files are the other agents\' -14 LUFS / normalised '
                  'masters); then the whole sum goes through the master chain below (measured.master_makeup_db is '
                  'that chain\'s static make-up; add it to every gain for a no-master-bus rebuild in the edit)',
        automation=dict(
            vo_duck='sidechain from the VO (50 ms look-ahead, 40 ms attack / 260 ms release, thr -42 dBFS, 12 dB range): music -3 dB, '
                    'SFX beds by vo_duck_db (room drone 3, server hum 4, typing 6); it releases inside the semicolon '
                    'pause so the D-flat colour note speaks',
            chant_duck='music -4 dB while the whisper sounds, f282-300 only',
            end_fade='whole mix squared fade f706 -> f719.5 so the loop starts and ends in silence (as the theme)'),
        master='glue compressor (thr -15 dBFS, 1.5:1, 30/250 ms, 90 Hz sidechain HPF) + make-up + 4x-oversampled '
               'look-ahead true-peak limiter (1.5 ms, 90 ms release), iterated to -14.0 LUFS-I, ceiling -1.0 dBTP',
        bar9=dict(brief='INTRO_PIXEL_BRIEF v2.1: THE PLAYERS roll call replaces "music fired / rehired"; no mute',
                  flashes=rollcall.cue_list(), sfx_removed=REMOVED_V21),
    ))
    json.dump(tl, open(tl_path, 'w'), indent=1)
    json.dump(qa_all, open(qa_path, 'w'), indent=1)


if __name__ == '__main__':
    main(sys.argv[1:] or ['V1', 'V2', 'V3', 'V4'])
