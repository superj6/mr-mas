"""The ducking map for the S5-S8 score (Ep1 Act Four v5): where the music dips under the talk, frame-exact.

    ../../../.venv-theme/bin/python s5-s8_ducking.py         # -> s5-s8_ducking-map.json (light: no audio)

The THINNING is composed into the cues (melodic onsets are left out under the record, the pedal holds: see each cue's
docstring and s5-s8_qa.py's check).  This is the other half: a gain curve for the music bus, in act frames, for the
mix to apply on top of the three underscore masters laid at their act frames.  It follows the edit plan's mix guides
(edit-plan-v5 §4, from voice-diagnosis-v4 §4.6 and the v4.1 sound notes):

  * every placed take in lines-v5.json (as the locked stick timeline places it) and every silent post or record text
    on screen is a KEY;
  * the duck is pre-empted: it starts 250 ms before a line's first sound and reaches its depth 50 ms before it (a
    200 ms attack), holds to the line's last sound, and releases over 600 ms;
  * it HOLDS across a gap shorter than 2.5 s to the next key, at the shallower of the two depths, so it doesn't pump
    inside an exchange;
  * depths (dB, music bus): a voiced line -9; a voiced line where the cue is already a pedal -6.5 (S5, S7.01-S7.03,
    LEVERAGE thinned, the C pedal, the coda); the record (a quoted real line) -8, or -6.5 on a pedal; Neleh inside
    the avalanche's composed window -6 (her line's own delivery note); a line over the violin's decay -5; a silent
    post or record text -3 (the melody is already out; v4.1: a post must not pull the whole mix down), Alyi's post
    -2 (the violin IS the thinned colour);
  * inside a designed stop the music is already at digital zero (the cues' own mutes), so a key there changes nothing.

Numbers are guides from the plan, set by measurement, never heard; the re-recording mix sets the final amounts by ear.
"""
from __future__ import annotations

import json
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import importlib.util as _ilu   # noqa: E402
if 's5_s8_common' in sys.modules:
    C = sys.modules['s5_s8_common']
else:
    _sp = _ilu.spec_from_file_location('s5_s8_common', os.path.join(HERE, 's5-s8_common.py'))
    C = _ilu.module_from_spec(_sp)
    sys.modules['s5_s8_common'] = C
    _sp.loader.exec_module(C)

FPS = C.FPS
F_START = C.BEATS['S5.02']['f0']          # 6985
F_END = C.ACT_FRAMES                      # 12443
PRE, ATT, REL, HOLD = 0.25, 0.20, 0.60, 2.5
DEPTH = dict(line=-9.0, pedal=-6.5, record=-8.0, window=-6.0, violin=-5.0, post=-3.0, post_violin=-2.0)
OUT = os.path.join(HERE, 's5-s8_ducking-map.json')


def pedal_spans():
    """act-second spans where the cue is already pared to a pedal (a voiced line needs less room there)"""
    B, Lon, Lend, snd = C.B, C.Lon, C.Lend, C.snd
    return [(B('S5.02'), B('S6.01'), 'S5: the dark-room pedal'),
            (B('S7.01'), B('S7.05'), 'S7.01-S7.03: the violin, the floor'),
            (Lon('a5-30-10') - 0.3, Lend('a5-30-15'), 'LEVERAGE thinned to its F pedal (the reading, the terms)'),
            (snd('S7.09', 'rubber_stamp_C'), snd('S7.13', 'hourglass_shatter'), 'the C pedal'),
            (B('S8.04'), C.ACT_S + 5, 'the lobby quiet, the felt, the vault\'s F (the coda)')]


def keys():
    ped = pedal_spans()
    in_ped = lambda t: next((lab for a, b, lab in ped if a <= t < b), None)   # noqa: E731
    out = []
    for lid, L in sorted(C.LINES.items(), key=lambda kv: kv[1]['on']):
        if not (F_START / FPS - 1 <= L['on'] < F_END / FPS):
            continue
        p = in_ped(L['on'])
        if lid == 'a5-29-24':
            kind = 'window'
        elif lid in ('a5-30-01', 'a5-30-02', 'a5-30-03', 'a5-30-04'):
            kind = 'violin'
        elif L['record']:
            kind = 'record'
        else:
            kind = 'line'
        d = DEPTH[kind]
        if p and kind in ('line', 'record'):
            d = max(d, DEPTH['pedal'])
        out.append(dict(id=lid, kind=kind, who=L['who'], a=L['on'], b=L['end'], depth_db=d, pedal=p,
                        label=f'{kind}: {lid} {L["who"]}: {L["text"][:48]}'))
    # silent posts and record text on screen (the thin is composed; the duck is light)
    rec_text = ('POST:', 'RIMA:', '“…', 'ALYI (REPORTED)', 'RAIL: (REPORTED)', 'VOID IF CEO MISSING', 'PAY TO:',
                'MEMO: STAFF SHARE SALE', '~$86B')
    for x in C.TEXTS:
        if not (F_START / FPS <= x['at'] < F_END / FPS):
            continue
        if not x['text'].startswith(rec_text):
            continue
        d = DEPTH['post_violin'] if x['text'].startswith('POST: ALYI') else DEPTH['post']
        until = x['until']
        out.append(dict(id=None, kind='post', who=None, a=x['at'], b=until, depth_db=d, pedal=in_ped(x['at']),
                        label=f'post/record text: {x["text"][:48]}'))
    return sorted(out, key=lambda k: k['a'])


def curve(ks, f0=F_START, f1=F_END + 5 * FPS, step=1):
    """the target gain (dB) per act frame: min over keys, with the pre-duck / attack / hold / release shape"""
    n = f1 - f0 + 1
    fr = np.arange(n) + f0
    t = fr / FPS
    g = np.zeros(n)
    ks = sorted(ks, key=lambda k: k['a'])
    for i, k in enumerate(ks):
        a, b, d = k['a'], k['b'], k['depth_db']
        nxt = next((k2 for k2 in ks[i + 1:] if k2['a'] >= b - 1e-6), None)
        hold_to = b
        if nxt is not None and nxt['a'] - b < HOLD:
            hold_to = nxt['a']                                # held at this depth into the next key (min wins there)
            d_hold = max(d, nxt['depth_db'])
        else:
            d_hold = d
        env = np.zeros(n)
        r0 = a - PRE
        r1 = a - PRE + ATT
        m = (t >= r0) & (t < r1)
        env[m] = d * (t[m] - r0) / ATT
        m = (t >= r1) & (t <= b)
        env[m] = d
        if hold_to > b:
            m = (t > b) & (t <= hold_to)
            env[m] = d_hold
            end = hold_to
            dd = d_hold
        else:
            end = b
            dd = d
        m = (t > end) & (t < end + REL)
        env[m] = np.minimum(env[m], dd * (1 - (t[m] - end) / REL))
        g = np.minimum(g, env)
    return fr, g


def breakpoints(fr, g, tol=0.05):
    """compress a per-frame curve into [frame, dB] breakpoints (linear between them, within tol dB)"""
    pts = [(int(fr[0]), round(float(g[0]), 2))]
    i0 = 0
    for i in range(2, len(g)):
        seg = g[i0:i + 1]
        lin = np.linspace(g[i0], g[i], len(seg))
        if np.max(np.abs(seg - lin)) > tol:
            pts.append((int(fr[i - 1]), round(float(g[i - 1]), 2)))
            i0 = i - 1
    pts.append((int(fr[-1]), round(float(g[-1]), 2)))
    return pts


def main():
    ks = keys()
    fr, g = curve(ks)
    bp = breakpoints(fr, g)
    cues = [('s5-s8_s5-two-am', C.BEATS['S5.02']['f0'], C.BEATS['S6.01']['f0']),
            ('s5-s8_s6-avalanche', C.BEATS['S6.01']['f0'], C.BEATS['S7.01']['f0']),
            ('s5-s8_s7s8-the-return', C.BEATS['S7.01']['f0'], C.ACT_FRAMES)]
    doc = dict(
        schema='mrmas-duck-map/1',
        what='The music-bus duck for the Ep1 Act Four v5 score, S5-S8, in act frames (24 fps). Apply it to the three '
             's5-s8_ underscore masters laid at their act frames (file t = 0 at the frame given). The thinning is '
             'already composed into the cues; this is the mix duck on top. Guides, set from the plan, never heard.',
        clock=dict(fps=FPS, act_frame_0='episode 12:31:00', timeline='show/reel/ep01-act4-v5.json',
                   takes='audio/ep01/act4/dialogue/lines-v5.json'),
        rules=dict(pre_s=PRE, attack_s=ATT, release_s=REL, hold_gap_s=HOLD, depths_db=DEPTH,
                   pedal_spans=[dict(f0=round(a * FPS, 1), f1=round(b * FPS, 1), what=lab) for a, b, lab in pedal_spans()]),
        cues=[dict(id=c, file_t0_act_frame=a, act_frame_out=b) for c, a, b in cues],
        keys=[dict(id=k['id'], kind=k['kind'], who=k['who'], act_f_in=round(k['a'] * FPS, 2),
                   act_f_out=round(k['b'] * FPS, 2), tc_in=C.tc(k['a']), depth_db=k['depth_db'], pedal=k['pedal'],
                   label=k['label']) for k in ks],
        curve_breakpoints=[[f, d] for f, d in bp],
        summary=dict(keys=len(ks), frames_ducked=int(np.sum(g < -0.5)), frames_total=int(len(g)),
                     deepest_db=round(float(g.min()), 2), breakpoints=len(bp)),
    )
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1)
    print(f'{OUT}: {len(ks)} keys, {len(bp)} breakpoints, ducked {doc["summary"]["frames_ducked"]} of {len(g)} frames')
    return doc


if __name__ == '__main__':
    main()
