"""Does each SFX sit IN the music? Per-event loudness of the SFX stem against the music stem (post-master)
over the event's first 400 ms (or its length if shorter), for every variation. Writes qa/sfx_vs_music.json
and a loudness-timeline plot of V1's three stems (qa/V1_loudness_timeline.png)."""
import json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from mixlib import *   # noqa

VARS = {'V1': 'chipchamber', 'V2': 'orchestralnoir', 'V3': 'pixelswing', 'V4': 'pianopixels'}
spot = json.load(open(os.path.join(AUDIO, 'intro-sfx/spotting.json')))
ev = [e for e in spot['events'] if e['layer'] in ('main', 'blip') and not e['id'].startswith('co.key')
      and 'key_tap' not in (e.get('file') or '')]
import mix_intro
buses = mix_intro.bus_inputs()
res = {}
for v in VARS:
    _, st, _, _ = mix_intro.build(v, buses)      # the same post-master stems the mix is made of
    m, s, dx = st['music'], st['sfx'], st['dialogue']
    rows = []
    for e in ev:
        a = e['startFrame']
        b = min(e['endFrame'], a + 0.4 * FPS)
        if b - a < 0.05 * FPS:
            b = a + 0.05 * FPS
        ls, lm, ld = win_loud(s, a, b), win_loud(m, a, b), win_loud(dx, a, b)
        rows.append(dict(id=e['id'], frame=e['frame'], sfx=round(ls, 1), music=round(lm, 1),
                         dialogue=round(ld, 1) if ld > -90 else None, sfx_minus_music=round(ls - lm, 1)))
    dm = np.array([r['sfx_minus_music'] for r in rows])
    over = [r for r in rows if r['sfx_minus_music'] > 0]
    res[v] = dict(n=len(rows), median_sfx_minus_music=round(float(np.median(dm)), 1),
                  p10=round(float(np.percentile(dm, 10)), 1), p90=round(float(np.percentile(dm, 90)), 1),
                  above_music=[(r['id'], r['frame'], r['sfx_minus_music'], r['music']) for r in over],
                  events=rows)
    print(v, {k: res[v][k] for k in ('n', 'median_sfx_minus_music', 'p10', 'p90')})
    for r in over:
        print('   above music:', r)
json.dump(res, open(os.path.join(OUT_DIR, 'qa', 'sfx_vs_music.json'), 'w'), indent=1)

# ---- V1 timeline plot ----------------------------------------------------------------------------
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
d = os.path.join(OUT_DIR, 'stems', 'V1')
st = {k: read(os.path.join(d, f'intro-ep1-V1-stem-{k}.wav')) for k in ('music', 'sfx', 'dialogue')}
mix = read(os.path.join(OUT_DIR, 'intro-ep1-mix-V1-chipchamber.wav'))
fig, ax = plt.subplots(figsize=(16, 5), dpi=110)
for k, c in (('music', '#3b6fb6'), ('sfx', '#d9822b'), ('dialogue', '#2a9d5b')):
    fr, lo = loud_curve(st[k], 0.4, 0.5)
    ax.plot(fr, np.maximum(lo, -60), lw=0.9, color=c, label=f'{k} (momentary)')
fr, lo = loud_curve(mix, 3.0, 1.0)
ax.plot(fr, np.maximum(lo, -60), lw=1.6, color='#222', label='mix (short-term)')
for f, t in [(24, 'VO'), (120, '1993'), (240, 'GERG'), (300, 'ALYI'), (360, 'MARIO'), (420, 'NOLE'),
             (480, 'roll call'), (540, 'skyline'), (630, 'TITLE'), (705, 'ding')]:
    ax.axvline(f, color='#999', lw=0.6, ls=':')
    ax.text(f + 2, -58, t, fontsize=8, color='#555')
ax.axhline(-14, color='#b33', lw=0.6, ls='--')
ax.set_xlim(0, 720); ax.set_ylim(-60, -5)
ax.set_xlabel('frame (24 fps)'); ax.set_ylabel('LUFS')
ax.set_title('MR. MAS Ep1 intro, V1 mix: stem loudness (post-master). Mix -14.0 LUFS-I')
ax.legend(loc='upper left', fontsize=8, ncol=4)
fig.tight_layout()
fig.savefig(os.path.join(OUT_DIR, 'qa', 'V1_loudness_timeline.png'))
