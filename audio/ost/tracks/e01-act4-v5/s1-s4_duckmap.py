"""The ducking map for the S1-S4 score (act frames 0 -> 7100), built from the takes as the locked stick timeline
places them.  No audio is read or written; this is the mixer's key.  Output: s1-s4_duckmap.json.

    audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_duckmap.py

What it holds (edit-plan-v5 §4 "Mix guides"; flow-and-continuity §3; guides, not gates):
  * windows[]   one per voiced line: its first and last sound (act frames, from lines-v5 + the timeline), its head
                breath, a category and a depth.  The score is ALREADY THINNED in its notes under these windows (no
                melodic onsets; the pedal and, in the boardroom, a clock tick hold); the duck is the second stage.
                The depth is level-aware (v4.1's lesson: where the cue is already a pedal, a full duck buries it):
                    depth = clamp(-31 LUFS - the rendered score's own level in the window, category floor, -4 dB)
                with the category's depth as the floor (the most it ducks):
                    plan    THE PLAN's read over the music box (Neleh, Mada)                 -10 dB
                    line    an invented line, on-mic or on the call                          -10 dB
                    record  a line of the public record read aloud ([V ...] tags)            -11 dB
                    laptop  the tinny "super." on their laptop (the clockwork creeps under)  -10 dB
                    vo      his V.O. (it sits inside the felt; composed to -24 LUFS-S)         -4 dB
                    room    "super." in the suite: no score plays there (D6's aftermath)       0 dB
                Without a render (levels=None) every window takes its category's depth.
  * posts[]     the silent posts on screen: -3 dB on the whole score, and the held families (strings, bass,
                synth, piano) +2 dB inside it (v4.1: a silent post must not pull the mix down)
  * holds       the duck is held across a gap under 2.5 s inside an exchange, at the shallower of the two depths,
                so it doesn't pump; each window pre-ducks 0.3 s ahead of the first sound (0.1 s ahead of the head
                breath if that is earlier), reaches depth over 0.2 s, and releases over 0.6 s from 0.1 s after the
                last sound
  * curve_db    the resulting gain, one value per act frame (0 dB = the cue as rendered)
  * no_score    the designed music-off windows: D6 (the Cancel click to the buzz, every bus muted) and the room
                alone under "super."; the dial-tone rest
The mixer multiplies the S1-S4 music bus by curve_db (and the post lifts by family).  The final amounts are for the
re-recording mix to set by ear: nothing here was heard.
"""
import importlib.util
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('s1_s4_common', os.path.join(HERE, 's1-s4_common.py'))
if 's1_s4_common' in sys.modules:
    C = sys.modules['s1_s4_common']
else:
    C = importlib.util.module_from_spec(_spec)
    sys.modules['s1_s4_common'] = C
    _spec.loader.exec_module(C)

FPS = C.FPS
F_END = 7100                             # the map runs past the felt F4's ring into S5 (6985 + ~4.6 s)
DEPTH = dict(plan=-10.0, line=-10.0, record=-11.0, laptop=-10.0, vo=-4.0, room=0.0)
PRE_S, ATT_S, REL_DELAY_S, REL_S, HOLD_S = 0.30, 0.20, 0.10, 0.60, 2.5
POST_DUCK, POST_LIFT = -3.0, 2.0
NO_SCORE = [dict(f0=C.M('S1.09', 'click'), f1=C.M('S1.11', 'buzz'), what='D6: the Cancel click to the buzz; every bus '
                                                                     'muted (the act\'s one digital silence)'),
            dict(f0=C.M('S1.11', 'buzz'), f1=C.A('S2.01'), what='the room alone: the buzz, the suggested replies, '
                                                               '"super." (no score under it; S2\'s felt re-enters on 1178)'),
            dict(f0=C.M('S4.07', 'tone1') - 5, f1=C.M('S4.08', 'ring'), what='the designed rest: the four dial tones '
                                                                           '(room tone only; the Lighthouse enters on the ring)')]


def category(l):
    if l['id'].startswith('a5-25-'):
        return 'plan'
    if l['id'] == 'a5-26-01':
        return 'room'
    if l['kind'] == 'vo' or l['mode'] == 'vo':
        return 'vo'
    if l['id'] == 'a5-27-05':
        return 'laptop'
    if l['record']:
        return 'record'
    return 'line'


TARGET_LUFS, SHALLOWEST = -31.0, -4.0


def build(levels=None):
    """levels: {line id: the rendered score's own (un-ducked) K-weighted level in that window, LUFS}"""
    wins = []
    for l in sorted(C.LN.values(), key=lambda x: x['on']):
        if l['on'] >= F_END or l['end'] <= 0:
            continue
        cat = category(l)
        head = min([b[0] for b in l['breaths'] if b[2] == 'head'] or [l['on']])
        dep = DEPTH[cat]
        lev = (levels or {}).get(l['id'])
        if lev is not None and dep < 0:
            dep = round(max(dep, min(SHALLOWEST, TARGET_LUFS - lev)), 1) if lev > -70 else 0.0
        wins.append(dict(id=l['id'], who=l['who'], text=l['text'], category=cat, depth_db=dep,
                         score_level_lufs=None if lev is None else round(lev, 1),
                         on=round(l['on'], 2), end=round(l['end'], 2), breath=round(head, 2),
                         duck_from=round(min(l['on'] - PRE_S * FPS, head - 0.1 * FPS), 2),
                         tc_on=C.tc(l['on']), shot=l['beat']))
    posts = [dict(beat=p['beat'], a=round(p['a'], 2), b=round(p['b'], 2), text=p['text'], duck_db=POST_DUCK,
                  lift_db=dict(strings=POST_LIFT, bass=POST_LIFT, synth=POST_LIFT, piano=POST_LIFT),
                  thin='the melody is already left out of the notes here')
             for p in C.POSTS if p['a'] < F_END]
    # the target: each window (bridged across short gaps at the shallower depth), with its ramps
    n = F_END + 1
    tgt = [0.0] * n

    def apply(f0, f1, d, pre_f, rel_f):
        a0, a1 = f0 - pre_f, f0 - pre_f + ATT_S * FPS
        r0, r1 = f1 + REL_DELAY_S * FPS, f1 + (REL_DELAY_S + REL_S) * FPS
        for f in range(max(0, int(a0)), min(n, int(r1) + 2)):
            if f < a1:
                v = d * max(0.0, (f - a0) / (a1 - a0))
            elif f <= r0:
                v = d
            else:
                v = d * max(0.0, 1.0 - (f - r0) / (r1 - r0))
            tgt[f] = min(tgt[f], v)

    bridges = []
    ws = [w for w in wins if w['depth_db'] < 0]
    for i, w in enumerate(ws):
        pre = w['on'] - w['duck_from']
        apply(w['on'], w['end'], w['depth_db'], pre, 0)
        if i + 1 < len(ws):
            nx = ws[i + 1]
            gap = nx['duck_from'] - w['end']
            if 0 < gap <= HOLD_S * FPS:
                d = max(w['depth_db'], nx['depth_db'])
                for f in range(int(w['end']), min(n, int(nx['on']) + 1)):
                    tgt[f] = min(tgt[f], d)
                bridges.append(dict(after=w['id'], before=nx['id'], f0=round(w['end'], 1), f1=round(nx['on'], 1),
                                    gap_s=round(gap / FPS, 2), held_db=d))
    for p in posts:
        for f in range(max(0, int(p['a'] - 6)), min(n, int(p['b']) + 1)):
            tgt[f] = min(tgt[f], POST_DUCK)
    return dict(
        schema='mrmas-duckmap/1', scope='Ep1 Act Four v5, S1-S4 + the card (act frames 0-%d)' % F_END,
        clock='act frame 0 = episode 12:31:00, 24 fps; lines placed by show/reel/ep01-act4-v5.json from '
              'audio/ep01/act4/dialogue/lines-v5.json (first sound = beat start + t, last = + dur)',
        applies_to=['render/s1-s4_noon-underscore.wav (and stems) at act 0',
                    'render/s1-s4_third-mark-underscore.wav at act 1166',
                    'render/s1-s4_procedure-underscore.wav at act 1500'],
        params=dict(pre_duck_s=PRE_S, attack_s=ATT_S, release_delay_s=REL_DELAY_S, release_s=REL_S, hold_gap_s=HOLD_S,
                    category_floor_db=DEPTH, target_lufs_under_a_line=TARGET_LUFS, shallowest_db=SHALLOWEST,
                    level_aware=levels is not None, post_duck_db=POST_DUCK, post_lift_db=POST_LIFT),
        windows=wins, bridges=bridges, posts=posts, no_score=NO_SCORE,
        curve_db=[round(v, 2) for v in tgt],
        note='Nothing here was heard. The depths follow edit-plan-v5 §4 and v4.1\'s measured lessons; the mix sets '
             'the final amounts by ear.')


def main(levels=None):
    d = build(levels)
    p = os.path.join(HERE, 's1-s4_duckmap.json')
    with open(p, 'w') as fh:
        json.dump(d, fh, indent=1)
    ducked = sum(1 for v in d['curve_db'] if v < -0.5)
    print(f'{p}: {len(d["windows"])} line windows, {len(d["bridges"])} bridges, {len(d["posts"])} posts; '
          f'{ducked} of {len(d["curve_db"])} frames ducked')
    return d


if __name__ == '__main__':
    main()
