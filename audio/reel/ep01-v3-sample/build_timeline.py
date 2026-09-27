#!/usr/bin/env python3
"""Ep1 stick v3 SAMPLE: the timeline builder (show/episodes/ep01/production/stick/v3-plan.md §8).

  python3 audio/reel/ep01-v3-sample/build_timeline.py      -> show/reel/trials/ep01-v3-sample.json

About 4.5 minutes in three excerpts, each rebuilt with the v3 changes so the showrunner can judge them on screen:
  A  launch night through the bill      (Act One sc 5-7, from show/reel/ep01-full/ep01-act1-v2.json)   warm
  B  Vegas at noon through the night    (Act Four S1-S2, from show/reel/ep01-act4-v5.json)             suspense
  C  2 AM with Gerg                     (Act Four S5, from show/reel/ep01-act4-v5.json)                loyal

The v3 changes applied here (v3-plan §2):
  - arrivals (the room before the talk) and aftermaths (a hold after the turn), beat by beat below;
  - Mas's inner voice (audio/ep01/v3-sample/vo-v2/lines.json, fastrec takes), present tense, in the moment;
  - no pointers: no side badges, no WHAT THEY DIDN'T KNOW card, name plates cut to the name;
  - the cut beats C5 (the drill's kitchen bar and shaft phrase) inside excerpt A.
The sound (room, music, SFX, the takes) is audio/reel/ep01-v3-sample/mix.py, built from this timeline.
Every edit is listed in EDITS below with its reason, so a later pass can apply the same moves to the full episode.
"""
import copy
import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
A1 = json.load(open(f'{ROOT}/show/reel/ep01-full/ep01-act1-v2.json'))
A4 = json.load(open(f'{ROOT}/show/reel/ep01-act4-v5.json'))
VO = {r['id']: r for r in json.load(open(f'{ROOT}/audio/ep01/v3-sample/vo-v2/lines.json'))}
OUT = f'{ROOT}/show/reel/trials/ep01-v3-sample.json'

BEAT = {b['id']: b for b in A1['beats'] + A4['beats']}
PLATES = {  # explanatory lower-thirds cut to the name (v3-plan §5)
    'GERG MOCKBRAN · CO-FOUNDER': 'GERG MOCKBRAN',
    'RIMA TAMURI · CTO': 'RIMA TAMURI',
    'ALYI · CHIEF SCIENTIST': 'ALYI',
    'NOLE · EARLY FUNDER': 'NOLE',
}


def get(bid, new_id=None):
    b = copy.deepcopy(BEAT[bid])
    if new_id:
        b['id'] = new_id
    b['side'] = ''  # no HIS SIDE / THE BOARD'S SIDE badges: the voice tells us whose side we're on
    if isinstance(b.get('seq'), dict):
        b['seq']['side'] = ''
    on = []
    for o in b.get('onscreen', []):
        t = o['text'] if isinstance(o, dict) else o
        t = PLATES.get(t, t)
        if isinstance(o, dict):
            o['text'] = t
        else:
            o = t
        on.append(o)
    b['onscreen'] = on
    return b


def vo_line(vid, t):
    """a v3 inner-voice take as a timeline line (the dialogue-reel line format of the v2 timelines)"""
    r = VO[vid]
    a_in, a_out = r['pace']['audible_in_s'], r['pace']['audible_out_s']
    return {'id': vid, 'who': 'mas', 'text': r['text'], 't': round(t, 3), 'dur': round(a_out - a_in, 3),
            'audio': r['file'], 'in': a_in,
            'words': [[w['w'], round(w['t0'] - a_in, 3), round(w['t1'] - a_in, 3)] for w in r['words']],
            'tag': 'V.O.', 'cut': False}


def vo_len(vid):
    r = VO[vid]
    return r['pace']['audible_out_s'] - r['pace']['audible_in_s']


def shift(b, from_t, delta):
    """push every line (and timed on-screen item) at or after from_t later by delta, and lengthen the beat"""
    for l in b.get('lines', []):
        if l['t'] >= from_t - 1e-6:
            l['t'] = round(l['t'] + delta, 3)
    for o in b.get('onscreen', []):
        if isinstance(o, dict) and (o.get('at') or 0) >= from_t - 1e-6:
            o['at'] = round(o['at'] + delta, 3)
            if o.get('until') is not None:
                o['until'] = round(o['until'] + delta, 3)
    b['reelDur'] = round(b['reelDur'] + delta, 3)


def dur(b, d):
    b['reelDur'] = round(d, 3)


def slate(sid, text, sub, d=2.5, act='ACT ONE'):
    return {'id': sid, 'act': act, 'kind': 'card', 'set': 'void', 'style': 'BASE', 'shot': 'wide', 'chars': [],
            'caption': f'Reviewer slate: {text}', 'lines': [], 'onscreen': [text, sub], 'reelDur': d, 'fx': [],
            'cues': ['reviewer-only slate between excerpts (not part of the show)'], 'room': ''}


EDITS = []  # (beat, what, why) for the sample's notes


def note(bid, what, why):
    EDITS.append({'beat': bid, 'what': what, 'why': why})


beats = []

# ------------------------------------------------------------------ A: launch night (warm)
beats.append(slate('A.00', '1 / 3 · LAUNCH NIGHT', 'Act One sc 5-7 · warm'))

b = get('5.01'); dur(b, 3.0); beats.append(b)
note('5.01', '2.0 -> 3.0 s', 'arrival: the bullpen room tone under the button before anything happens')

b = get('5.02'); b['lines'] = [vo_line('v3s-01', 1.2)]; dur(b, 1.2 + vo_len('v3s-01') + 1.0)
# his voice names them: the strip and the figures switch from roles to names on each name's word
_w = {w[0].strip('.,').lower(): w[1] for w in b['lines'][0]['words']}
b['names'] = [{'id': k, 'at': round(1.2 + _w.get(k, 0.0), 3)} for k in ('gerg', 'rima', 'alyi')]
b['caption'] = 'The bullpen after hours, held: the room and the three people in it before anyone speaks.'
beats.append(b)
note('5.02', f"4.4 -> {b['reelDur']:.1f} s; V.O. v3s-01", 'arrival, and the introduction the plates did: who wants what, in his read')

b = get('5.03'); shift(b, 6.0, vo_len('v3s-11') + 0.55); b['lines'].append(vo_line('v3s-11', 6.0)); beats.append(b)
b['lines'][0]['t'] = -0.5  # J-cut: Gerg's first line starts under the wide's last half second
note('5.03', 'J-cut: "Okay, the build\'s green." starts 0.5 s under the wide', 'sound leads us into the conversation')
note('5.03', 'V.O. v3s-01b "she\'ll go for three." after Rima\'s "Twice."', 'a read that the picture pays off in 5.07 (her third underline)')

b = get('5.04')
t_mas = next(l['t'] for l in b['lines'] if l['who'] == 'mas')
shift(b, t_mas, vo_len('v3s-02') + 0.7)
b['lines'].append(vo_line('v3s-02', t_mas - 0.2))
beats.append(b)
note('5.04', 'V.O. v3s-02 between Rima\'s question and "it\'s a preview."', 'the honest thought, then the public line; the gap is never explained')

beats.append(get('5.05'))
b = get('5.06'); dur(b, b['reelDur'] + 0.3); beats.append(b)
b = get('5.05', '5.06b'); b['lines'] = [vo_line('v3s-03', 0.5)]; dur(b, 0.5 + vo_len('v3s-03') + 0.8)
b['caption'] = 'Back on Alyi in the glass, held, while Mas thinks about him. Alyi keeps watching the button.'
b['cues'] = []
beats.append(b)
note('5.06b', 'new held beat on Alyi (the 5.05 frame) with V.O. v3s-03', 'warmth for Alyi, and the trust Act Four breaks')

beats.append(get('5.07'))
beats.append(get('5.08'))
b = get('5.09'); dur(b, b['reelDur'] + 1.5); beats.append(b)
note('5.09', '+1.5 s after "let\'s see if anyone notices."', 'aftermath: the two of them and the quiet button')

beats.append(get('5.10'))
b = get('5.11'); dur(b, 5.6 + vo_len('v3s-04') + 0.7); b['lines'].append(vo_line('v3s-04', 5.6)); beats.append(b)
note('5.11', 'V.O. v3s-04 after Gerg\'s "It likes everyone…"', 'he wants to be liked, and says so only to himself')

beats.append(get('5.12'))
b = get('6.01'); b['lines'] = [vo_line('v3s-05', 1.2)]; beats.append(b)
note('6.01', 'V.O. "nobody noticed." -> "someone noticed."', 'present tense, in the moment: wonder, not a caught line')
for bid in ('6.02', '6.04', '6.06', '6.07', '6.08', '6.09'):
    beats.append(get(bid))
note('6.03, 6.05', 'cut (v3-plan C5)', 'the drill repeats; the size reads in half the time')

b = get('7.01'); dur(b, 7.3 + vo_len('v3s-06') + 1.8); b['lines'].append(vo_line('v3s-06', 7.3))
b['lines'][0]['t'] = -0.6  # J-cut: Rima's "A million people, Mas." arrives over the red glow
beats.append(b)
note('7.01', 'J-cut: Rima\'s line starts 0.6 s under the held tile', 'her voice pulls us back up to his face')
note('7.01', 'V.O. v3s-06 "mostly the bill." after "it\'s the bill.", held 1.8 s', 'the gap between what he says and what he means; plants "mostly." (S5.05)')
b = get('7.02'); dur(b, b['reelDur'] + 0.8); beats.append(b)

# ------------------------------------------------------------------ B: Vegas, noon, and the night (suspense)
beats.append(slate('B.00', '2 / 3 · NOON, LAS VEGAS', 'Act Four S1-S2 · suspense', act='ACT FOUR'))
b = get('S1.01'); dur(b, 5.5); b['caption'] += ' Race-weekend banners on the Strip below; practice-lap engines far off.'
beats.append(b)
note('S1.01', '3.5 -> 5.5 s', 'arrival: the suite, the Strip, the race weekend (answers the newcomer\'s "why Vegas?" with picture and sound)')
for bid in ('S1.02', 'S1.03', 'S1.04', 'S1.05'):
    beats.append(get(bid))
b = get('S1.06'); b['lines'] = [vo_line('v3s-07', 0.4)]; dur(b, 0.4 + vo_len('v3s-07') + 0.7)
b['caption'] = 'His finger over JOIN while he thinks it through. Then the click; the waltz tape-stops on it.'
beats.append(b)
note('S1.06', 'V.O. v3s-07 "alyi set it up. probably just the budget." before JOIN', 'the one read he gets wrong, after we have just seen the board\'s plan: suspense by dramatic irony. Then silence inside him for the whole blow')
for bid in ('S1.07', 'S1.08', 'S1.09', 'S1.10', 'S1.11'):
    beats.append(get(bid))
b = get('S1.12'); dur(b, 4.6); beats.append(b)
note('S1.12', '2.2 -> 4.6 s after "super."', 'aftermath of the act\'s biggest turn: the frozen tiles, the room, no score')
for bid in ('S2.01', 'S2.02', 'S2.03', 'S2.04', 'S2.05'):
    beats.append(get(bid))

# ------------------------------------------------------------------ C: 2 AM (loyal, warm)
beats.append(slate('C.00', '3 / 3 · 2 AM', 'Act Four S5 · warm', act='ACT FOUR'))
b = get('S5.02'); dur(b, 4.5); beats.append(b)
note('S5.01', 'cut: the WHAT THEY DIDN\'T KNOW card', 'a pointer; his voice returning tells us we are back with him')
note('S5.02', '2.6 -> 4.5 s', 'arrival: the dark room at 2 AM, glass and lanyard')
b = get('S5.03'); b['lines'] = [vo_line('v3s-08', 0.6)]; dur(b, max(b['reelDur'], 0.6 + vo_len('v3s-08') + 0.6)); beats.append(b)
note('S5.03', 'V.O. v3s-08, the hearts counted, then miscounted', 'the rhythm carries what he won\'t say: he loses count')
beats.append(get('S5.04'))
beats.append(get('S5.05'))
b = get('S5.09'); shift(b, 1.0, vo_len('v3s-09') + 0.5); b['lines'].append(vo_line('v3s-09', 0.3)); beats.append(b)
note('S5.09', 'V.O. v3s-09 "gerg. he\'ll say he\'s compiling." as the tile rings', 'a read the next line pays off; warmth')
beats.append(get('S5.06'))
b = get('S5.07b'); dur(b, 6.0); beats.append(b)
note('S5.07b', '3.5 -> 6.0 s after "He did both."', 'silence inside him: the held face and the room')
beats.append(get('S5.08'))
b = get('S5.09-back'); dur(b, 4.8 + vo_len('v3s-10') + 0.7); b['lines'].append(vo_line('v3s-10', 4.8)); beats.append(b)
note('S5.09-back', 'V.O. v3s-10 "gerg never waits to be asked." after "Just in case."', 'the bible\'s planted line, now in present tense')
beats.append(get('S5.09b'))
beats.append(get('S5.11'))
b = get('S5.12'); dur(b, 5.5); beats.append(b)
note('S5.12', '2.9 -> 5.5 s after "leave it open."', 'aftermath: the door ajar')

for b in beats:
    b.setdefault('act', 'ACT FOUR')
    b.pop('realStart', None)
    b.pop('realDur', None)
    b.pop('real', None)

total = sum(b['reelDur'] for b in beats)
ep = {
    'episode': 1,
    'title': 'Ep1 stick v3 sample',
    'part': 'sample',
    'variant': 'v3-sample',
    'logline': 'Three excerpts rebuilt with the v3 changes: arrivals and aftermaths, Mas\'s inner voice, varied music, no pointers.',
    'dateSpan': 'Nov 30, 2022 · Nov 17-20, 2023',
    'runtimeMin': round(total / 60, 2),
    'dialogueReel': True,
    'cast': {**A1.get('cast', {}), **A4.get('cast', {}),
             # the sample starts mid-episode: Mas was named in the cold open, the board and the landlord before Act Four
             **{k: {**A4.get('cast', {}).get(k, {}), 'known': True} for k in ('mas', 'neleh', 'mada', 'tasya', 'orb')}},
    '_source': 'audio/reel/ep01-v3-sample/build_timeline.py (v3-plan.md §8)',
    '_edits': EDITS,
    'beats': beats,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w').write(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
print(f'{OUT}: {len(beats)} beats, {total:.1f} s ({total / 60:.2f} min), {len(EDITS)} edits')
