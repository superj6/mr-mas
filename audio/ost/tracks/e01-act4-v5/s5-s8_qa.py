"""Act-clock QA for the S5-S8 score (Ep1 Act Four v5), after a render.  Measured, never heard.

    ../../../.venv-theme/bin/python s5-s8_qa.py          # reads render/, writes s5-s8_qa.json and prints a summary

What it checks (OST-BIBLE §6.9, flow-and-continuity §3 and §5):
  1. per cue, from the engine's own cue sheet (render/<id>.cue.json): the F-major check (rule 12, written and
     spectral), knee completion (rule 4, by pitch class, any register), the whole knee, the written third, loudness
     and true peak, the markers' onsets, the hard stops' tails, the engine's warnings;
  2. the three underscore masters laid on the ACT CLOCK (file t = 0 at each cue's act frame): every music start and
     stop (50 ms windows, the louder channel, "off" = below -60 dBFS), each off-window classed as a designed stop,
     a designed rest or UNEXPLAINED, and every run shorter than 2 s (a fragment);
  3. the handoffs: S5's pedal across S6's downbeat; S6's stop to S7's violin; S7-S8's ring into the tag;
  4. under every talk key of the ducking map: the music bus level inside the line against the 1 s either side,
     before and after the duck (the composed thin + the duck), and every melodic onset under the record (from the
     notes; there should be none).
The mix (dialogue, room, SFX) is not here: holes in the full mix are the mix pass's measure.
"""
from __future__ import annotations

import json
import os
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import importlib.util as _ilu   # noqa: E402
_sp = _ilu.spec_from_file_location('s5_s8_common', os.path.join(HERE, 's5-s8_common.py'))
C = _ilu.module_from_spec(_sp)
sys.modules['s5_s8_common'] = C
_sp.loader.exec_module(C)
D = C.load_local('s5-s8_ducking')

RENDER = os.path.join(HERE, 'render')
OUT = os.path.join(HERE, 's5-s8_qa.json')
FPS, SR = 24, 48000
CUES = [('s5-s8_s5-two-am', C.BEATS['S5.02']['f0']), ('s5-s8_s6-avalanche', C.BEATS['S6.01']['f0']),
        ('s5-s8_s7s8-the-return', C.BEATS['S7.01']['f0'])]
A0 = C.BEATS['S5.02']['f0']
OFF_DB, WIN = -60.0, 0.05
MELODIC = {'lead', 'lead2', 'arp', 'xylo', 'celesta', 'beeper', 'tri', 'woodclick', 'glock', 'vibes', 'marimba'}


def designed():
    """the designed music-off windows (act seconds): the stops and the rests the plan and the script call for"""
    B, Lend, snd, txt = C.B, C.Lend, C.snd, C.txt
    return [
        (B('S5.02'), B('S5.02') + 1.2,
         "HANDOFF: S5's pedal bows in (silent attack) under the card's felt F4, struck on 6985 by the S1-S4 cue"),
        (txt('S6.06', 'MADA'), C.B('S7.01') + 1.0 + 0.3,
         "DESIGNED STOP: dead on MADA's label; the dark room's air until the violin (S7.01 post, 391.667)"),
        (Lend('a5-30-15'), snd('S7.09', 'rubber_stamp_C') + 0.4,
         'DESIGNED STOP: "of what?" -> the stamp (Mada\'s pause, "Good question.", the long hold in the room)'),
        (snd('S7.13', 'hourglass_shatter'), txt('S8.01', 'DAYS SINCE') - 0.55,
         "DESIGNED REST: the sand's held beat (the pedal rests; the shatter's tail, the neon pre-lap)"),
        (snd('S8.03', 'alert_bonk') - 0.1, Lend('a5-30-19') + 0.2,
         'DESIGNED REST: the lobby CU and "okay." on the neon\'s F (the CU "silent like the first"; nothing under "okay.")'),
    ]


def act_bus():
    """the three underscore masters summed on the act clock; returns (x[2, n], t0 act seconds)"""
    arrs = []
    end = 0
    for cid, f0 in CUES:
        x, sr = sf.read(os.path.join(RENDER, f'{cid}-underscore.wav'), dtype='float32', always_2d=True)
        assert sr == SR, sr
        o = int(round((f0 - A0) / FPS * SR))
        arrs.append((o, x.T))
        end = max(end, o + x.shape[0])
    bus = np.zeros((2, end), np.float32)
    for o, x in arrs:
        bus[:, o:o + x.shape[1]] += x
    return bus, A0 / FPS


def win_db(x, win=WIN):
    n = int(win * SR)
    k = x.shape[1] // n
    y = x[:, :k * n].reshape(2, k, n)
    r = np.sqrt(np.mean(y.astype(np.float64) ** 2, axis=2)).max(axis=0)
    return 20 * np.log10(np.maximum(r, 1e-12))


def runs(db, t0):
    on = db > OFF_DB
    out, i = [], 0
    while i < len(on):
        j = i
        while j < len(on) and on[j] == on[i]:
            j += 1
        out.append(dict(on=bool(on[i]), a=t0 + i * WIN, b=t0 + j * WIN))
        i = j
    return out


def level(x, a, b, t0):
    i0, i1 = int((a - t0) * SR), int((b - t0) * SR)
    i0, i1 = max(0, i0), min(x.shape[1], i1)
    if i1 - i0 < 64:
        return None
    r = np.sqrt(np.mean(x[:, i0:i1].astype(np.float64) ** 2, axis=1)).max()
    return round(float(20 * np.log10(max(r, 1e-12))), 1)


def main():
    rep = dict(schema='mrmas-s5s8-qa/1', note='measured, never heard', cues={}, flow={}, handoffs={}, under_talk=[])
    # ---------------------------------------------------------------- 1. the engine's own QA, per cue
    for cid, f0 in CUES:
        cs = json.load(open(os.path.join(RENDER, f'{cid}.cue.json')))
        fm = cs['qa']['f_major']
        hits = cs.get('hit_check', [])
        rep['cues'][cid] = dict(
            file_t0_act_frame=f0, duration_s=cs['timing']['album_duration_s'],
            underscore=cs['masters']['underscore']['measured'], album=cs['masters']['album']['measured'],
            short_term_p95=cs['qa']['short_term_underscore'].get('p95'), band_2_6k_db=cs['qa']['band_2_6k_db'],
            centroid_hz=cs['qa']['centroid_hz'],
            f_major=dict(ok_written=fm['ok_written'], ok_spectral=fm['ok_spectral'],
                         windows=fm.get('windows'), fails=[dict(t0=w['t0'], t1=w['t1'],
                                                                act_f=round(f0 + w['t0'] * FPS, 1),
                                                                a_over_f=w.get('a_over_f_sieved'),
                                                                cls=w.get('a_class'), ok=w.get('ok_spectral'))
                                                           for w in fm.get('fails', [])][:20],
                         written_third=fm['written_third']['count'],
                         f_inaudible_windows=fm.get('f_inaudible_windows')),
            knee_completion=cs['qa']['knee_completion']['count'], knee_whole=cs['qa']['knee_whole'],
            hard_stops=cs['qa']['hard_stops'], silence=cs['qa']['silence'],
            markers=[dict(t=h['t'], act_f=round(f0 + h['t'] * FPS, 1), offset_ms=h['offset_ms']) for h in hits],
            motifs_found={k: len(v) for k, v in cs['qa']['motifs_found'].items()},
            balance=cs['qa']['balance'].get('balance'), chip_share=cs['qa']['balance'].get('chip_share'),
            balance_energy=cs['qa']['balance'].get('balance_energy'),
            warnings=cs['warnings'])
    # ---------------------------------------------------------------- 2. the music on the act clock
    bus, t0 = act_bus()
    db = win_db(bus)
    rr = runs(db, t0)
    des = designed()
    offs, frags = [], []
    for r in rr:
        if r['on']:
            if r['b'] - r['a'] < 2.0:
                frags.append(dict(a=round(r['a'], 3), b=round(r['b'], 3), act_f=round(r['a'] * FPS, 1),
                                  len_s=round(r['b'] - r['a'], 2)))
            continue
        if r['b'] - r['a'] < 0.3:
            continue
        cause = next((lab for a, b, lab in des if a - 0.35 <= r['a'] and r['b'] <= b + 0.35), None)
        if r['a'] >= C.ACT_S - 0.1:
            cause = 'after the act (the tail into the tag has ended)'
        offs.append(dict(a=round(r['a'], 3), b=round(r['b'], 3), act_f=[round(r['a'] * FPS, 1), round(r['b'] * FPS, 1)],
                         tc=C.tc(r['a']), len_s=round(r['b'] - r['a'], 2), cause=cause or 'UNEXPLAINED'))
    rep['flow'] = dict(threshold_dbfs=OFF_DB, window_s=WIN, runs=sum(1 for r in rr if r['on']),
                       off_windows=offs, fragments_under_2s=frags,
                       unexplained=[o for o in offs if o['cause'] == 'UNEXPLAINED'])
    # ---------------------------------------------------------------- 3. the handoffs
    rep['handoffs'] = dict(
        s6_stop_to_s7_violin=dict(stop_act_f=round(C.txt('S6.06', 'MADA') * FPS, 1),
                                  violin_act_f=round(C.txt('S7.01', 'POST: ALYI') * FPS, 1),
                                  gap_s=round(C.txt('S7.01', 'POST: ALYI') - C.txt('S6.06', 'MADA'), 3)),
        s8_into_tag=dict(level_last_2s_of_act=level(bus, C.ACT_S - 2, C.ACT_S, t0),
                         level_first_1s_after=level(bus, C.ACT_S, C.ACT_S + 1, t0),
                         level_2_3s_after=level(bus, C.ACT_S + 2, C.ACT_S + 3, t0)))
    # S5's own tail across the downbeat (its file alone)
    x5, _ = sf.read(os.path.join(RENDER, 's5-s8_s5-two-am-underscore.wav'), dtype='float32', always_2d=True)
    o = int(round((C.BEATS['S6.01']['f0'] - C.BEATS['S5.02']['f0']) / FPS * SR))
    tail = x5.T[:, o:]
    rep['handoffs']['s5_pedal_across_s6_downbeat'] = dict(
        s5_level_last_1s_before=level(x5.T, (o - SR) / SR, o / SR, 0.0),
        s5_tail_s=round(tail.shape[1] / SR, 3),
        s5_tail_first_250ms=level(tail, 0.0, 0.25, 0.0), s5_tail_250_500ms=level(tail, 0.25, 0.5, 0.0))
    # ---------------------------------------------------------------- 4. under the talk: the thin + the duck
    ks = D.keys()
    fr, g = D.curve(ks)
    gd = np.interp(np.arange(bus.shape[1]) / SR + t0, fr / FPS, g)
    ducked = bus * (10 ** (gd / 20))[None].astype(np.float32)
    notes = {}
    for cid, f0 in CUES:
        mod = C.load_local({'s5-s8_s5-two-am': 's5-s8_s5_two_am', 's5-s8_s6-avalanche': 's5-s8_s6_avalanche',
                            's5-s8_s7s8-the-return': 's5-s8_s7s8_the_return'}[cid])
        sc = mod.build()
        notes[cid] = [(n.start + f0 / FPS, n.inst, n.pitch) for n in sc.notes]
    alln = [n for v in notes.values() for n in v]
    for k in ks:
        if k['kind'] == 'post':
            continue
        a, b = k['a'], k['b']
        ins, pre, post = level(bus, a, b, t0), level(bus, a - 1.0, a - 0.25, t0), level(bus, b + 0.6, b + 1.6, t0)
        ins_d = level(ducked, a, b, t0)
        mel = [(round(t, 3), i) for t, i, _ in alln if a - 0.1 <= t <= b and i in MELODIC]
        rep['under_talk'].append(dict(id=k['id'], kind=k['kind'], act_f=[round(a * FPS, 1), round(b * FPS, 1)],
                                      music_db=ins, music_ducked_db=ins_d, before_db=pre, after_db=post,
                                      duck_db=k['depth_db'], melodic_onsets=mel[:8]))
    # an audition aid only (the mix works from the stems): the three masters on the act clock, ducked by the map
    if '--no-preview' not in sys.argv:
        from engine.export import mp3_from_array
        pv = os.path.join(RENDER, 's5-s8_chain-ducked-preview.mp3')
        mp3_from_array(ducked, pv, RENDER)
        rep['preview'] = dict(file=os.path.relpath(pv, HERE), act_frame_at_t0=A0,
                              what='the three s5-s8_ underscore masters laid at their act frames and ducked by '
                                   's5-s8_ducking-map.json; an audition aid, not a mix (no dialogue, room or SFX)')
    rec = [u for u in rep['under_talk'] if u['kind'] == 'record']
    rep['record_melodic_onsets'] = sum(len(u['melodic_onsets']) for u in rec)
    with open(OUT, 'w') as fh:
        json.dump(rep, fh, indent=1, default=float)
    # ---------------------------------------------------------------- summary
    print(f'wrote {OUT}')
    for cid, r in rep['cues'].items():
        u = r['underscore']
        fm = r['f_major']
        print(f"{cid}: {r['duration_s']} s; underscore {u['lufs']} LUFS / {u['true_peak_db']} dBTP; p95 "
              f"{r['short_term_p95']}; 2-6k {r['band_2_6k_db']} dB; F-major written {fm['ok_written']} spectral "
              f"{fm['ok_spectral']} ({len(fm['fails'])} window(s) over); written thirds {fm['written_third']}; knee "
              f"completion {r['knee_completion']}; whole knee {r['knee_whole']}; stops "
              f"{[(round(h.get('peak_dbfs', 0), 1), h.get('ok')) for h in r['hard_stops']]}; warnings {len(r['warnings'])}")
    print(f"music runs {rep['flow']['runs']}; off-windows >= 0.3 s: {len(offs)}; unexplained "
          f"{len(rep['flow']['unexplained'])}; fragments < 2 s: {len(frags)}")
    for o_ in offs:
        print(f"   off {o_['tc']} act {o_['act_f'][0]}-{o_['act_f'][1]} ({o_['len_s']} s): {o_['cause']}")
    for f_ in frags:
        print(f"   fragment act {f_['act_f']} {f_['len_s']} s")
    print('handoffs', json.dumps(rep['handoffs']))
    print(f"record melodic onsets: {rep['record_melodic_onsets']}")
    return rep


if __name__ == '__main__':
    main()
