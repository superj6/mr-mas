"""Pre-mix measurements of every input bus (no writes except qa/inputs.json)."""
import json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from mixlib import *   # noqa

V = {'V1': 'theme-V1-chipchamber', 'V2': 'theme-V2-orchestralnoir', 'V3': 'theme-V3-pixelswing',
     'V4': 'theme-V4-pianopixels'}
STEMS = {v: sorted(f[3:-4] for f in os.listdir(os.path.join(AUDIO, 'theme/stems')) if f.startswith(v + '-'))
         for v in V}

sfx = read(os.path.join(AUDIO, 'intro/sfx/intro-sfx_stem.wav'))
blip = read(os.path.join(AUDIO, 'intro/sfx/intro-blip_stem.wav'))
vo = read(os.path.join(AUDIO, 'intro/vox/intro-vox_vo.wav'))
voc = read(os.path.join(AUDIO, 'intro/vox/intro-vox_vocals.wav'))
wh = read(os.path.join(AUDIO, 'intro/vox/stems/intro-vox_chant-whisper.wav'))
sh = read(os.path.join(AUDIO, 'intro/vox/stems/intro-vox_chant-shout.wav'))
pad = read(os.path.join(AUDIO, 'intro/vox/stems/intro-vox_pad.wav'))
print('vocals == chant+pad residual dB', sample_peak_db(voc - wh - sh - pad))

W = dict(pre_vo=(0, 23), vo=(24, 91), vo1=(24, 57), pause=(58, 71), vo2=(72, 91), whisper=(285, 299),
         shout=(300, 316), hit240=(240, 246), hit300=(300, 306), hit360=(360, 366), hit420=(420, 426),
         rollcall=(480, 539), skyline=(540, 629), title=(630, 690), pad=(632, 686), ding=(705, 719))
res = {}
for v, name in V.items():
    m = read(os.path.join(AUDIO, 'theme', name + '.wav'))
    st = {s: read(os.path.join(AUDIO, f'theme/stems/{v}-{s}.wav')) for s in STEMS[v]}
    tot = sum(st.values())
    r = dict(master_lufs=round(lufs(m), 2), master_tp=round(true_peak_db(m), 2),
             stems_vs_master_resid_db=round(sample_peak_db(tot - m), 1))
    g = db(-15.5 - lufs(m))
    mt = m * g
    r['trim_db'] = round(float(todb(g)), 2)
    r['windows_music_trimmed'] = {k: round(win_loud(mt, a, b), 1) for k, (a, b) in W.items()}
    r['windows_strings_trimmed'] = {k: round(win_loud(st['strings'] * g, a, b), 1) for k, (a, b) in
                                    W.items()} if 'strings' in st else None
    # duck evidence: identical piano F5 onsets at f15 (unducked) vs f30 / f45 (inside the duck)
    pn = st['piano']
    rms = lambda x, a, b: float(todb(np.sqrt((x[:, f2n(a):f2n(b)] ** 2).mean())))
    r['duck_probe_piano_rms'] = {f'f{a}': round(rms(pn, a, a + 4), 1) for a in (0, 15, 30, 45, 60, 75)}
    # gain curve implied by music minus sub over the cold open (frame RMS)
    ns = tot - st.get('sub', 0)
    r['nonsub_frame_rms_f16_100'] = [round(rms(ns, f, f + 1), 1) for f in range(16, 100)]
    res[v] = r
    print(v, json.dumps({k: r[k] for k in ('master_lufs', 'master_tp', 'stems_vs_master_resid_db', 'trim_db')}))
    print('   music ', r['windows_music_trimmed'])
    print('   strings', r['windows_strings_trimmed'])
    print('   duck probe', r['duck_probe_piano_rms'])

bus = dict(sfx=sfx, blip=blip, vo=vo, whisper=wh, shout=sh, pad=pad)
res['buses'] = {}
for k, x in bus.items():
    res['buses'][k] = dict(lufs_i=round(lufs(x), 2), tp=round(true_peak_db(x), 2),
                           windows={w: round(win_loud(x, a, b), 1) for w, (a, b) in W.items()
                                    if np.abs(x[:, f2n(a):f2n(b)]).max() > 1e-6})
    print(k, res['buses'][k])
fr, st3 = loud_curve(vo, 3.0)
res['buses']['vo']['short_term_max'] = round(float(st3.max()), 2)
print('vo short-term max', st3.max())
json.dump(res, open(os.path.join(OUT_DIR, 'qa/inputs.json'), 'w'), indent=1)
