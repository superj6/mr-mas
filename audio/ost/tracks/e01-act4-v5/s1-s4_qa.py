"""The light pass after s1-s4_render.py (no rendering; about a minute): measure what can be measured without ears,
build the level-aware ducking map, write the cue sheet.

    audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_qa.py

Reads   render/s1-s4_{noon,third-mark,procedure}-underscore.wav + .cue.json (the engine's own QA), and the cues'
        notes (each cue's build(), no audio).
Writes  s1-s4_qa.json          every measure below, with act frames
        s1-s4_duckmap.json     the mixer's key (s1-s4_duckmap.py), each depth set from the score's own level
        s1-s4_cuesheet.json / s1-s4_cuesheet.md   frame-exact in and out points, sections, sync points, stops
        render/s1-s4_chain-ducked-preview.mp3     the three cues laid at their act frames, ducked by the map
                                                   (an audition aid only: the mix works from the stems)

Measures (all on the music alone; OST-BIBLE s6.9, flow-and-continuity s3 and s5):
  engine   per cue: loudness and true peak, the F-major check (written thirds from the notes at every boundary; the
           sieved audio A/F traced to its stem), knee completion by pitch class, the whole knee, silence and hard
           stops, marker onsets, balance, spectrum, warnings
  chain    the three underscore masters at their act frames, un-ducked: every music-off run and every HOLE (the
           louder channel under -60 dBFS in 50 ms windows for 0.3 s or more) outside the designed no-score windows;
           every music run and any fragment under 2 s
  thin     per voiced line: the score's own level inside the line vs. the second before it, and the melodic onsets
           written inside it (from the notes), each with its reason
  duck     the ducked level under each line (the map applied)
  joins    S1's D6 (digital zero from the Cancel click), S2's re-entry, S2 -> S3 on the whip, the card, the felt F4
"""
import importlib.util
import json
import os
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, OST)
from engine import analysis   # noqa: E402
from engine.core import SR, todb   # noqa: E402
from engine.export import mp3_from_array   # noqa: E402


def load(name):
    key = name.replace('-', '_')
    if key in sys.modules:
        return sys.modules[key]
    spec = importlib.util.spec_from_file_location(key, os.path.join(HERE, name + '.py'))
    m = importlib.util.module_from_spec(spec)
    sys.modules[key] = m
    spec.loader.exec_module(m)
    return m


C = load('s1-s4_common')
DM = load('s1-s4_duckmap')
FPS = C.FPS
SPF = SR // FPS                      # 2000 samples a frame
R = os.path.join(HERE, 'render')
CUES = [('s1-s4_s1_noon', 'S1'), ('s1-s4_s2_third_mark', 'S2'), ('s1-s4_s3s4_procedure', 'S3 + S4 + card')]
MELODIC = {'s_felt', 's_lead', 'wz_box', 'wz_cel', 'p_lead', 'p_celesta', 'p_harp', 'p_tri2', 'beeper', 'vln1', 'vln2',
           'celesta', 'hn', 'felt', 'snes_piano', 'harm', 'harp', 'tpt', 'rhodes', 'door', 'svln', 'svla', 'cl',
           'marimba', 'lead'}
WHY = {  # the designed exceptions: melodic onsets written inside a voiced line, and why
    'wz_box': 'the waltz F F F: the three walk-offs are picture hits under "...stepped down this year." (box only)',
    'p_lead': 'one Blueprint note per label, the box alone under a word (the plan\'s rule: one note per label)',
    'p_tri2': 'a label note\'s 4th below (only in a gap)',
    'svla': 'the Addendum: Mario\'s quartet, thin, under his own line (edit-plan-v5: "thin under the talk")',
    'marimba': 'the Lighthouse in half notes under the split\'s talk (the beam: this room\'s clock tick)',
    'vln1': 'the clockwork creeping back under the tinny "super." (edit-plan-v5 a), or the hourglass grains',
    'vln2': 'the hourglass: one grain a beat under "Chat… for how long?" (edit-plan-v5 f)',
    'vla': 'the hourglass grain', 'felt': 'his felt', 's_felt': 'his felt'}


def rms_track(x, win=0.05):
    """louder-channel RMS in dBFS per 50 ms window"""
    n = int(win * SR)
    m = x.shape[1] // n
    y = x[:, :m * n].reshape(2, m, n)
    r = np.sqrt((y.astype(np.float64) ** 2).mean(2)).max(0)
    return 20 * np.log10(r + 1e-12)


def klev(x):
    """ungated K-weighted level (LUFS-like) of a short excerpt"""
    if x.shape[1] < 64:
        return -99.0
    p = analysis._k_power(x)
    return -99.0 if p <= 0 else 10 * np.log10(p) - 0.691


def runs(mask, t0=0.0, hop=0.05):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            out.append((t0 + i * hop, t0 + j * hop))
            i = j
        else:
            i += 1
    return out


def main():
    C.verify()
    F_END = DM.F_END
    chain = np.zeros((2, F_END * SPF), dtype=np.float32)
    cues, notes_by_cue, engine_qa = [], {}, {}
    for mod, label in CUES:
        m = load(mod)
        sc, cue = m.build()
        cid = sc.meta['id']
        x, sr = sf.read(os.path.join(R, f'{cid}-underscore.wav'), always_2d=True, dtype='float32')
        assert sr == SR
        x = x.T
        o = int(round(cue.f0 * SPF))
        n = min(x.shape[1], chain.shape[1] - o)
        chain[:, o:o + n] += x[:, :n]
        cj = json.load(open(os.path.join(R, f'{cid}.cue.json')))
        on = np.where(np.abs(x).max(0) > 10 ** (-60 / 20))[0]          # sample-exact, -60 dBFS
        first = cue.f0 + (on[0] / SPF if len(on) else 0)
        last = cue.f0 + ((on[-1] + 1) / SPF if len(on) else 0)
        fm = cj['f_major']
        engine_qa[cid] = dict(
            underscore=cj['masters']['underscore']['measured'], album=cj['masters']['album']['measured'],
            short_term=cj['qa']['short_term_underscore'], band_2_6k_db=cj['qa']['band_2_6k_db'],
            centroid_hz=cj['qa']['centroid_hz'],
            f_major=dict(ok_written=fm['ok_written'], ok_spectral=fm['ok_spectral'],
                         written_third=fm['written_third']['count'], windows=fm.get('n_windows', fm.get('windows')),
                         fails=[dict(t0=w['t0'], t1=w['t1'], act=round(cue.f0 + w['t0'] * FPS),
                                     a_over_f_sieved=w.get('a_over_f_sieved'), a_class=w.get('a_class'),
                                     a_from=w.get('a_from')) for w in fm.get('fails', [])][:12],
                         fixed_resonances=fm.get('fixed_resonances'), f_inaudible=fm.get('f_inaudible_windows')),
            knee_completion=cj['knee_completion'], knee_whole=cj['knee_whole'],
            silence=cj['qa']['silence'], hard_stops=cj['qa']['hard_stops'], vo_windows=cj['vo_windows'],
            balance=dict(piano_orch_bigband_chip=cj['qa']['balance'].get('balance'),
                         chip_share=cj['qa']['balance'].get('chip_share'),
                         energy=cj['qa']['balance'].get('balance_energy')),
            hits=[dict(label=next((l for f, l, h in cue.log if abs(cue.s(f) - hq['t']) < 0.002), ''),
                       act=round(cue.f0 + hq['t'] * FPS, 1), offset_ms=hq['offset_ms']) for hq in cj['hit_check']],
            stems_residual_db=cj['stems']['sum_vs_underscore_residual_db'], stems=cj['files']['stems'],
            warnings=cj['warnings'])
        notes_by_cue[cid] = (sc, cue)
        cues.append(dict(id=cid, label=label, module=mod + '.py', file_t0_act=cue.f0, first_sound=round(first, 1),
                         last_sound=round(last, 1), cue=cue, sc=sc, cj=cj, x_len=x.shape[1]))
    # ------------------------------------------------------------------ holes and runs (un-ducked)
    lev = rms_track(chain)
    hop = 0.05
    designed = [(w['f0'], w['f1'], w['what']) for w in DM.NO_SCORE]

    def covered(f0, f1, pad=12):
        """is [f0, f1] inside the union of the designed windows (adjacent ones join)?"""
        f = f0
        for a, b, _ in sorted(designed):
            if a - 2 <= f <= b + pad:
                f = max(f, b)
        return f + pad >= f1

    def why(f0, f1):
        return ' + '.join(w for a, b, w in designed if a < f1 and b > f0) if covered(f0, f1) else None

    in_designed = covered

    first_music = cues[0]['first_sound']
    offs = [(a * FPS, b * FPS) for a, b in runs(lev <= -60.0, 0.0, hop)]
    offs = [(a, b) for a, b in offs if b > first_music + 1 and a < cues[-1]['last_sound'] - 1]
    holes = [dict(f0=round(a, 1), f1=round(b, 1), s=round((b - a) / FPS, 2), tc=C.tc(a),
                  designed=why(a, b))
             for a, b in offs if (b - a) / FPS >= 0.3]
    undesigned = [h for h in holes if not h['designed']]
    soft = [(a * FPS, b * FPS) for a, b in runs(lev <= -50.0, 0.0, hop)]
    soft = [dict(f0=round(a, 1), f1=round(b, 1), s=round((b - a) / FPS, 2)) for a, b in soft
            if (b - a) / FPS >= 0.3 and b > first_music + 1 and a < cues[-1]['last_sound'] - 1 and not in_designed(a, b)
            and b < cues[-1]['last_sound']]
    mus = [(a * FPS, b * FPS) for a, b in runs(lev > -60.0, 0.0, hop)]
    mus = [dict(f0=round(a, 1), f1=round(b, 1), s=round((b - a) / FPS, 2)) for a, b in mus]
    frags = [r for r in mus if r['s'] < 2.0]
    # ------------------------------------------------------------------ thin: the score's own level under each line
    levels, thin = {}, []
    for l in sorted(C.LN.values(), key=lambda v: v['on']):
        if l['on'] >= F_END:
            continue
        a, b = int(l['on'] * SPF), int(l['end'] * SPF)
        Lin = klev(chain[:, a:b])
        pa = int(max(0, l['on'] - FPS) * SPF)
        Lpre = klev(chain[:, pa:a]) if a - pa > 2000 else None
        levels[l['id']] = Lin
        on_notes = []
        for cid, (sc, cue) in notes_by_cue.items():
            for n_ in sc.notes:
                fa = cue.fr(n_.start)
                if n_.inst in MELODIC and l['on'] - 1 <= fa < l['end'] and n_.vel > 0.05:
                    on_notes.append(dict(inst=n_.inst, act=round(fa, 1), pitch=int(round(n_.pitch)),
                                         why=WHY.get(n_.inst, 'CHECK')))
        thin.append(dict(id=l['id'], who=l['who'], on=round(l['on'], 1), end=round(l['end'], 1),
                         score_lufs=round(Lin, 1), before_lufs=None if Lpre is None else round(Lpre, 1),
                         melodic_onsets=on_notes))
    # ------------------------------------------------------------------ the duck map (level-aware) and its result
    dmap = DM.main(levels)
    curve = np.array(dmap['curve_db'], dtype=np.float64)
    g = 10 ** (np.interp(np.arange(chain.shape[1]) / SPF, np.arange(len(curve)), curve) / 20.0)
    ducked = (chain * g[None]).astype(np.float32)
    for t in thin:
        a, b = int(t['on'] * SPF), int(t['end'] * SPF)
        t['ducked_lufs'] = round(klev(ducked[:, a:b]), 1)
        t['duck_db'] = next(w['depth_db'] for w in dmap['windows'] if w['id'] == t['id'])
    # ------------------------------------------------------------------ joins
    def peak_db(f0, f1, x=chain):
        s0, s1 = int(f0 * SPF), int(f1 * SPF)
        return round(float(todb(np.abs(x[:, s0:s1]).max() + 1e-12)), 1)

    click, buzz, carve, whip = C.M('S1.09', 'click'), C.M('S1.11', 'buzz'), C.A('S2.01'), C.A('S3.00a')
    card, home = C.A('S5.01'), C.A('S5.02')
    joins = dict(
        d6=dict(f0=click, f1=carve, peak_dbfs=peak_db(click + 0.1, carve - 0.5), rule='< -90 dBFS (digital zero)'),
        s2_reentry=dict(first_sound=cues[1]['first_sound'], carve=carve),
        whip=dict(f=whip, level_before_lufs=round(klev(chain[:, int((whip - 12) * SPF):int(whip * SPF)]), 1),
                  level_after_lufs=round(klev(chain[:, int(whip * SPF):int((whip + 12) * SPF)]), 1)),
        card=dict(f=card, level_lufs=round(klev(chain[:, int(card * SPF):int(home * SPF)]), 1)),
        felt_f4=dict(f=home, ring_to=cues[-1]['last_sound'],
                     level_lufs_first_bar=round(klev(chain[:, int(home * SPF):int((home + 60) * SPF)]), 1)))
    # ------------------------------------------------------------------ the preview (an audition aid)
    pv = ducked[:, :int((cues[-1]['last_sound'] + 24) * SPF)]
    mp3_from_array(pv, os.path.join(R, 's1-s4_chain-ducked-preview.mp3'), R)
    # ------------------------------------------------------------------ write
    qa = dict(schema='mrmas-s1s4-qa/1', clock='act frames (24 fps; act 0 = 12:31:00)',
              engine=engine_qa, holes=dict(threshold='louder channel <= -60 dBFS, 50 ms windows, >= 0.3 s',
                                           all=holes, undesigned=undesigned, soft_under_minus50=soft),
              music_runs=mus, fragments_under_2s=frags, thin=thin, joins=joins,
              duck=dict(windows=len(dmap['windows']), bridges=len(dmap['bridges']),
                        depths=sorted({w['depth_db'] for w in dmap['windows']})),
              heard=False, note='Measured, never heard. A person must listen before any of this is called done.')
    json.dump(qa, open(os.path.join(HERE, 's1-s4_qa.json'), 'w'), indent=1, default=float)
    write_cuesheet(cues, engine_qa, dmap, qa)
    # ------------------------------------------------------------------ print
    for c in cues:
        e = engine_qa[c['id']]
        print(f"{c['id']}: act {c['first_sound']}-{c['last_sound']}  underscore {e['underscore']['lufs']} LUFS "
              f"{e['underscore']['true_peak_db']} dBTP  F-major written {e['f_major']['written_third']} "
              f"spectral_ok {e['f_major']['ok_spectral']}  knee {e['knee_completion']}  warnings {len(e['warnings'])}")
        for w in e['warnings']:
            print('   W', w[:220])
    print('holes:', len(holes), 'undesigned:', undesigned, 'soft(<-50):', soft[:6])
    print('music runs:', len(mus), 'fragments < 2 s:', frags)
    print('joins:', json.dumps(joins))
    bad = [t for t in thin if any(o['why'] == 'CHECK' for o in t['melodic_onsets'])]
    print('lines with unexplained melodic onsets:', [(t['id'], [o for o in t['melodic_onsets'] if o['why'] == 'CHECK'])
                                                      for t in bad])
    print('score under lines (un-ducked LUFS): median', np.median([t['score_lufs'] for t in thin]),
          'ducked median', np.median([t['ducked_lufs'] for t in thin]))


def write_cuesheet(cues, eqa, dmap, qa):
    rows = []
    for c in cues:
        cue, sc, cj = c['cue'], c['sc'], c['cj']
        e = eqa[c['id']]
        rows.append(dict(
            id=c['id'], sequences=c['label'], module=c['module'], family=sc.meta.get('family'), mm=sc.meta.get('mm'),
            files=dict(underscore=f"render/{c['id']}-underscore.wav", underscore_mp3=f"render/{c['id']}-underscore.mp3",
                       album=f"render/{c['id']}-album.wav", stems=[f'render/{v.split("render/")[-1]}' if 'render/' in v
                                                                   else v for v in e['stems'].values()],
                       midi=f"render/{c['id']}.mid", cue_json=f"render/{c['id']}.cue.json",
                       pianoroll=f"render/{c['id']}-pianoroll.png"),
            lay_at=dict(act_frame=cue.f0, tc=C.tc(cue.f0), gain_db=0.0,
                        note='file t = 0 goes on this act frame; every frame below is an act frame'),
            in_point=dict(act_frame=c['first_sound'], tc=C.tc(c['first_sound'])),
            out_point=dict(act_frame=c['last_sound'], tc=C.tc(c['last_sound'])),
            music_end_written=dict(act_frame=cue.f_end, tc=C.tc(cue.f_end)),
            stops=[dict(f0=round(cue.fr(a), 1), f1=round(min(cue.fr(b), cue.fr(sc.end_s)), 1),
                        what=('D6: the hard stop on the Cancel click (every stem and tail to digital zero)'
                              if abs(cue.fr(a) - C.M('S1.09', 'click')) < 1 else
                              'the exit: the Rewind cut on the whip (pass one\'s first chord lands on this frame)'
                              if abs(cue.fr(a) - C.A('S3.00a')) < 1 else 'a hard stop')) for a, b in sc.mutes],
            sections=[dict(label=lab, f0=round(cue.fr(a), 1), f1=round(cue.fr(b), 1), tc=C.tc(cue.fr(a)))
                      for lab, a, b in sc.sections],
            sync=[dict(act=round(f, 1), tc=C.tc(f), label=lab, onset_checked=h,
                       offset_ms=next((x['offset_ms'] for x in e['hits'] if abs(x['act'] - f) < 0.2), None))
                  for f, lab, h in sorted(cue.log)],
            loudness=dict(underscore=e['underscore'], album=e['album'], short_term=e['short_term']),
            motifs=sc.meta.get('motifs'), key=sc.meta.get('key'), audition=sc.meta.get('audition')))
    sheet = dict(schema='mrmas-cuesheet/1', scope='Ep1 Act Four v5, S1-S4 and the card', clock='act frames, 24 fps; '
                 'act 0 = episode 12:31:00', timeline='show/reel/ep01-act4-v5.json', takes='audio/ep01/act4/dialogue/lines-v5.json',
                 cues=rows, no_score=DM.NO_SCORE, ducking='s1-s4_duckmap.json', qa='s1-s4_qa.json', heard=False)
    json.dump(sheet, open(os.path.join(HERE, 's1-s4_cuesheet.json'), 'w'), indent=1, default=float)
    L = ['# Cue sheet · Ep1 Act Four v5 · S1–S4 and the card', '',
         'Frame-exact, on the act clock (24 fps; act frame 0 = episode 12:31:00), from the locked stick timeline '
         '`show/reel/ep01-act4-v5.json` and the takes `audio/ep01/act4/dialogue/lines-v5.json`. Generated by '
         '`s1-s4_qa.py` from the renders; the JSON twin is `s1-s4_cuesheet.json`. **Nothing here was heard.**', '',
         '| Cue | Sequences | Lay file t = 0 at | In (first sound, −60 dBFS) | Out (last sound, −60 dBFS) | Stops | Underscore |',
         '|---|---|---|---|---|---|---|']
    for r in rows:
        st = '; '.join(f"{s['f0']:.0f}: {s['what'].split(':')[0]}" for s in r['stops']) or '— (the orchestra is cut by a fader at 6985; the felt rings on)'
        u = r['loudness']['underscore']
        L.append(f"| `{r['id']}` | {r['sequences']} | act {r['lay_at']['act_frame']:.0f} ({r['lay_at']['tc']}) | "
                 f"{r['in_point']['act_frame']:.1f} ({r['in_point']['tc']}) | {r['out_point']['act_frame']:.1f} "
                 f"({r['out_point']['tc']}) | {st} | {u['lufs']} LUFS, {u['true_peak_db']} dBTP |")
    L += ['', '**Designed music-off windows** (the room carries them):', '']
    for w in DM.NO_SCORE:
        L.append(f"- act {w['f0']:.0f} → {w['f1']:.0f} ({C.tc(w['f0'])}–{C.tc(w['f1'])}): {w['what']}")
    L += ['', '**Joins:** S1 → S2 through D6 and the room (a designed stop); S2 → S3 on the whip at 1512 (the Rewind is '
          'cut where pass one\'s first chord lands); S3 → S4 inside one performance (a crossfade on the NOV 18 rail at '
          '3628); S4 → the card (the clockwork hangs on a held C; the C pickup to the REVERSAL at 6943); the card → S5 '
          '(the orchestra cuts on 6985, one felt F4 rings under S5\'s pedal).', '']
    for r in rows:
        L += [f"## `{r['id']}` · {r['sequences']}", '',
              f"{r['family']} · {r['mm']} · key: {r['key']}. Lay the file's t = 0 on act frame **{r['lay_at']['act_frame']:.0f}**. "
              f"Files: `{r['files']['underscore']}` (+ `.mp3`), the album master, {len(r['files']['stems'])} stems in "
              f"`render/stems/`, `{r['files']['midi']}`, `{r['files']['cue_json']}`, `{r['files']['pianoroll']}`.", '',
              '| Section | Act in | Act out | TC in |', '|---|---|---|---|']
        for s_ in r['sections']:
            L.append(f"| {s_['label']} | {s_['f0']:.1f} | {s_['f1']:.1f} | {s_['tc']} |")
        L += ['', '| Act frame | TC | Sync point | Onset check |', '|---|---|---|---|']
        for s_ in r['sync']:
            chk = '—' if not s_['onset_checked'] else ('no clear onset' if s_['offset_ms'] is None else f"{s_['offset_ms']:+.1f} ms")
            L.append(f"| {s_['act']:.1f} | {s_['tc']} | {s_['label']} | {chk} |")
        L.append('')
    open(os.path.join(HERE, 's1-s4_cuesheet.md'), 'w').write('\n'.join(L) + '\n')


if __name__ == '__main__':
    main()
