#!/usr/bin/env python
"""Ep1 ACT ONE (sc 5-12) STICK-FIGURE DIALOGUE REEL v2: the timeline builder.

  python3 audio/reel/ep01-act1-v2/build_timeline.py        -> show/reel/ep01-full/ep01-act1-v2.json
                                                              + audio/reel/ep01-act1-v2/measure.json (the numbers)
                                                              + audio/reel/ep01-act1-v2/transcript.md

The picture is cut to the takes, the way Act Four v5's was (audio/reel/ep01-act4-v5/build_timeline.py; this is a port
of its engine). The shot plan below is read off the script's own shot directions (show/episodes/ep01/script.md,
## ACT ONE, as saved 22:48 on 2026-09-26): one beat per shot or held setup; a conversation plays inside the setup the
script holds it in (a beat may carry several lines), and the cuts fall on the turns the script names. Every line is
laid from its real take (audio/ep01/act1/dialogue/lines-fast-v1.json):

  * a line's speech onset = the previous line's speech end + its gap_before_s (set in set_plan.py: quick replies
    0.3-0.6 s, loaded ones 0.7-1.6 s), or the shot's lead-in when it follows picture (gap null);
  * a line that crosses a cut keeps its gap; the cut lands `tail` s after the last word, so the new shot opens a
    fraction before the reply (at least 0.3 s);
  * set pieces (sc 6, sc 11's duel) sit on the script's bar grid (96 BPM: 1 bar = 2.5 s) where the lines allow;
  * rails, plates, posts and headlines are timed for read (about 0.25 s + 0.05 s a character).

The JSON is the "dialogueReel" format of studio/src/reel/schema.ts. There is no premix: the episode mixer
(studio/src/reel/tools/mixer.mjs) lays each take from lines[].audio and ducks the temp bed under it. Since the fix
pass (2026-09-27) each beat also carries `sounds` (SOUNDS below), and act1_bed.py beside this file builds Act One's
temp stem (room + music + SFX) from this JSON; the manifest plays that stem as the chapter's one bed. Rebuild it
after this. Nothing here is heard or watched.

Fix pass (2026-09-27, the `act1fix` pass): the SPEC changes for the newcomer / insider / audit reads of
ep01-full-v2.mp4 are marked "fix pass" in comments; act1-notes.md §9 lists every change and why.
"""
from __future__ import annotations

import json
import os
import re
import statistics

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
LINES_JSON = os.environ.get('ACT1_LINES') or os.path.join(ROOT, 'audio/ep01/act1/dialogue/lines-fast-v1.json')
# ACT1_OUT (a scratch folder) redirects all three outputs, for a dry run on stub lines
_O = os.environ.get('ACT1_OUT')
OUT = os.path.join(_O, 'ep01-act1-v2.json') if _O else os.path.join(ROOT, 'show/reel/ep01-full/ep01-act1-v2.json')
MEASURE = os.path.join(_O or HERE, 'measure.json')
TRANSCRIPT = os.path.join(_O or HERE, 'transcript.md')
FPS = 24
BAR = 2.5                     # 96 BPM, 4/4
ACT_START = 72.0              # the script's printed clock for the act (1:12); the episode reel shows the real EP clock

LINES = {l['id']: l for l in json.load(open(LINES_JSON))}
SPEAKER = {'MAS': 'mas', 'MAS (V.O.)': 'mas', 'GERG': 'gerg', 'RIMA': 'rima', 'ALYI': 'alyi', 'CHATGTP': 'chatgtp',
           'RADNUS': 'radnus', 'NIRB': 'nirb', 'EGAP': 'egap', 'TASYA': 'tasya', 'SYDNEY': 'sydney', 'MARIO': 'mario',
           'CLOD': 'clod', 'NOLE': 'nole', 'OIGNEB': 'oigneb'}
WARN: list[str] = []


def who_of(L):
    """character id of a row: fastrec rows carry the script label in speaker_label and the registry name in speaker"""
    lab = (L.get('speaker_label') or L['speaker']).upper()
    return SPEAKER.get(lab) or SPEAKER.get(lab.split()[0]) or lab.split()[0].lower()


def label_of(L):
    return L.get('speaker_label') or L['speaker']


def lid(k):
    """short ids in the spec: '5-01' -> 'e1-a1-5-01'"""
    return k if k.startswith('e1-') else f'e1-a1-{k}'


def gap_of(L):
    if 'gap_before_s' in L:
        return L['gap_before_s']
    return (L.get('placement') or {}).get('gap_before_s')


def a_in(L):
    return L['pace']['audible_in_s']


def a_out(L):
    return L['pace']['audible_out_s']


# ------------------------------------------------------------------ time expressions (resolved after lines are laid)
class T:
    def __init__(self, kind, line=None, k=None, off=0.0):
        self.kind, self.line, self.k, self.off = kind, lid(line) if line else None, k, off


def ON(l, off=0.0):
    return T('on', l, None, off)


def END(l, off=0.0):
    return T('end', l, None, off)


def W(l, k, off=0.0):
    """start of word k of line l (k: index, or a word; 'word#2' = its second occurrence)"""
    return T('w0', l, k, off)


PLACED: dict[str, dict] = {}


def _word(line_id, k):
    ws = LINES[line_id]['words']
    if isinstance(k, int):
        return ws[k]
    m = re.match(r'^(.*?)(?:#(\d+))?$', k)
    want, nth = m.group(1).lower(), int(m.group(2) or 1)
    hits = [w for w in ws if re.sub(r"[^\w']", '', w['w'].lower()) == want]
    if len(hits) < nth:
        raise KeyError(f'{line_id}: no word {k!r} in {[w["w"] for w in ws]}')
    return hits[nth - 1]


def res(x, start):
    """a time expression -> absolute act seconds (a number is seconds from the beat's start)"""
    if x is None:
        return None
    if isinstance(x, (int, float)):
        return start + x
    p = PLACED[x.line]
    if x.kind == 'on':
        v = p['on']
    elif x.kind == 'end':
        v = p['end']
    else:
        v = p['file_start'] + _word(x.line, x.k)['t0']
    return v + x.off


def C(id, x=None, pose=None, face=None, frm=None, until=None):
    d = {'id': id}
    if x is not None:
        d['x'] = x
    if pose:
        d['pose'] = pose
    if face:
        d['face'] = face
    if frm is not None:
        d['from'] = frm
    if until is not None:
        d['until'] = until
    return d


# ------------------------------------------------------------------ margin notes (music, sound, style)
MU = {
    'bullpen': 'sound: the bullpen bed (server hum up through the floor, one buzzing tube, Gerg\'s keys) · music: none under the talk',
    'mm16in': 'music: MM-16 Odometer (temp pad) comes in on the counter\'s first tick',
    'drill': 'music: MM-16, one performance, 14 bars (4·3·4·3) · thins to bass + brushes under the posts, ducks under the V.O.',
    'ratchet': 'sfx: odometer_ratchet, chip notes on F, varied rhythm and pitch (never even beeps)',
    '3d': 'style (proposed, drastic tier): the descent as a low-poly 3D cutaway of the building · default BASE',
    'pedal': 'music: MM-16 settles to a bass pedal under the heat shimmer',
    'tear': 'sfx: tssss, steam in three held puffs · the phone\'s siren J-cuts in under the last puff',
    'siren': 'music: MM-16 climbs back to intensity 2, in the siren\'s colour',
    'phone': 'sound: the phone\'s own audio inside the bullpen bed (every sc 8 line on the small-speaker chain)',
    'lock': 'music: MM-16 rings out on the lock · sfx: the NopeAI revolving door\'s rubber sweep pre-laps',
    'lobby': 'sound: the lobby bed (the revolving door\'s rubber sweep, a reception phone, steps on stone)',
    'leverage': 'music: LEVERAGE (MM-08 stems) from the check\'s arrival: pizzicato + muted 808 on the door\'s squeak',
    'freeze': 'style: 2-TONE full freeze (Tasya\'s card; one of the two full freezes)',
    'pop': 'sfx: pop · music: the LEVERAGE ostinato stops on the pop (one of the act\'s few stops)',
    'terms': 'sound: the lobby bed only under the terms, no music (OST owner: confirm by ear, or a low pad)',
    'jangle': 'music: LEVERAGE comes back on the key ring\'s offbeat jangle, a new phrase',
    'ledger': 'style: LEDGER flash-print, 6 frames, on the figure; then it holds in the ticker to read',
    'tick': 'sfx: Sydney\'s egg timer ticks in LEVERAGE\'s tempo; LEVERAGE falls away under it',
    'prebeat': 'sound: Sydney\'s tick carries the pre-beat over the bullpen bed (2 bars, never silent)',
    'duel': 'music: MM-04 Lighthouse, 16 bars: Gerg\'s Build (chip, left) against the Addendum (string quartet, right)',
    'thin': 'music: MM-04 thins to the quartet\'s held chord under Mas\'s post',
    'up4': 'music: MM-04 comes back up for phrase 4',
    'mm17': 'music: MM-17 (Nole\'s Launch motif, THE JOB, low) from the push',
    'thud': 'sfx: THUD, the room shakes 2 px · music: the THUD cuts MM-17 dead',
    'dry': 'sound: no score on the reflection: the bullpen bed and the pen\'s scratch only',
    'threat': 'music: MM-14 THREAT, once, on the pen\'s lift · CUT TO BLACK on its tail',
}
SEQ = {
    '5': dict(id='5', side='', place='the NopeAI bullpen: launch night', time='Wed Nov 30, 2022 · night'),
    '6': dict(id='6', side='', place='the odometer drill: down through the building', time='Nov 30 → Dec 5, 2022'),
    '7': dict(id='7', side='', place='the bullpen, at the hole', time='Dec 5, 2022 · later'),
    '8': dict(id='8', side='', place="Elgoog's lobby, on Mas's phone", time='Dec 21, 2022'),
    '9': dict(id='9', side='', place='the NopeAI lobby', time='Mon Jan 23, 2023 · day'),
    '9b': dict(sub='weeks on', place='the NopeAI lobby, weeks on', time='Feb 7 → 8, 2023'),
    '10': dict(id='10', side='', place='the NopeAI lobby', time='Feb 13 → 17, 2023'),
    '11': dict(id='11', side='', place='the bullpen / the Misanthropic lighthouse (split)', time='Mar 3 → 14, 2023'),
    '12': dict(id='12', side='', place="Mas's desk / a standing desk in the dark", time='Mar 22 → 29, 2023 · night'),
}
FUSE = 'UI: Push research preview'   # the lit band and the parked cursor, in every setup with his desk until the click

# ------------------------------------------------------------------ THE SHOT PLAN (script ## ACT ONE; fix pass 2026-09-27)
# keys: id, seq, kind, set, style, shot, frame, room, chars, fg, lines, lead, tail, min, end, on ((text, at, until)),
# names ((ids, at)), lx (per line: at = seconds into the beat, lead), caption (<= 110 chars), cues, cont, fx, shotId
SPEC = [
    # ---------------------------------------------------------------- sc 5 · LAUNCH NIGHT
    dict(id='5.01', seq=SEQ['5'], set='bullpen', shot='insert', frame='INSERT · the beige button', room='bullpen',
         min=2.0, on=[('research preview', 0.25, None)], cues=['cut: HARD CUT on the downbeat, out of the card', MU['bullpen']],
         caption='A small beige button where the 1993 OK sat. Its 7 px label: research preview.'),
    dict(id='5.02', set='bullpen', shot='wide', frame="WIDE · the bullpen after hours (the home room's one wide)",
         room='bullpen', min=4.4,
         chars=[C('mas', 0.14, 'sit'), C('gerg', 0.58, 'sit'), C('rima', 0.84), C('alyi', 0.96)],
         # fix pass: the date opens the scene (it landed on the click, after the scene's talk; the newcomer read)
         on=[('RAIL: NOV 30, 2022', 0.3, None), ('LAUNCH: LOW-KEY', 0.4, None), ('UI: Push button', 1.8, 3.0), (FUSE, 3.0, None)],
         caption="Gerg's green laptop, Rima's LOW-KEY, Alyi in the doorway (seen in the glass). A cursor parks on the button."),
    dict(id='5.03', set='bullpen', shot='medium', frame='TWO-SHOT · Mas and Gerg, desk to desk (held)', room='bullpen',
         chars=[C('mas', 0.22, 'sit'), C('gerg', 0.74, 'sit')], lines=['5-01', '5-02', '5-03'], lead=0.5, tail=0.3,
         on=[(FUSE, 0.0, None), ('GERG MOCKBRAN · CO-FOUNDER', ON('5-01', 0.1), END('5-01', 1.3))],
         names=[('gerg', ON('5-01', 0.1))],
         caption="Gerg ships before anyone agrees. Rima, from the whiteboard, not turning round. Gerg: nobody reads research."),
    dict(id='5.04', set='bullpen', shot='medium', frame='OTS · over Mas onto Rima (held through the bargain)', room='bullpen',
         fg={'id': 'mas', 'side': 'left'}, chars=[C('rima', 0.58), C('alyi', 0.9)],
         lines=['5-04', '5-05', '5-06', '5-07', '5-08', '5-09'], tail=0.3,
         on=[('LAUNCH: LOW-KEY', 0.0, None), (FUSE, 0.0, None), ('RIMA TAMURI · CTO', ON('5-04', 0.1), END('5-04', 0.6))],
         names=[('rima', ON('5-04', 0.1))],
         caption='Rima bargains (one post, a banner), Gerg waves it off; she asks Mas what it costs. "it\'s a preview."'),
    dict(id='5.05', set='bullpen', shot='close', frame='MCU·glass · Alyi in the doorway, seen in its glass (the cut on the turn)',
         room='bullpen', chars=[C('alyi', 0.6)], lines=['5-10'], tail=0.35,
         on=[('ALYI · CHIEF SCIENTIST', 0.2, None)], names=[('alyi', 0.2)],
         caption='A new voice from the doorway turns cost into dread: "And what if it wakes up?"'),
    dict(id='5.06', set='bullpen', shot='close', frame='MCU · Rima turns to Mas and waits (1 beat, hers)', room='bullpen',
         chars=[C('rima', 0.5)], lines=['5-11'], tail=0.45, lx={'5-11': dict(ignore_min=True)},
         caption='She turns from the glass to Mas and waits. His answer lands on her face.'),
    dict(id='5.07', set='bullpen', shot='medium', frame='TWO-SHOT · Mas and Gerg (Rima back at the board)', room='bullpen',
         chars=[C('mas', 0.22, 'sit'), C('gerg', 0.66, 'sit'), C('rima', 0.93, until=END('5-12', 0.5)),
                C('rima', 0.93, 'point', frm=END('5-12', 0.5))],
         lines=['5-12'], tail=1.7, on=[('LAUNCH: LOW-KEY', 0.0, None), (FUSE, 0.0, None)],
         cues=['sfx: one key, with a flourish · then the marker squeaks: a third underline'],
         caption='One key, a flourish: "Your button." Behind him Rima underlines LOW-KEY a third time. No line.'),
    dict(id='5.08', set='bullpen', shot='insert', frame='INSERT · his finger on the button', room='bullpen', min=2.3,
         on=[('research preview', 0.0, None), (FUSE, 0.0, 1.0)],
         cues=['sfx: click (on 1.0 s), the 1993 OK\'s click · nothing happens · the band dims back into cutscene mode'],
         caption='His finger, no hover. Click. Nothing happens.'),
    dict(id='5.09', set='bullpen', shot='medium', frame='MCU·glass · Mas soft in the fg; Rima at the board; Alyi in the doorway (glass)',
         room='bullpen', fg={'id': 'mas', 'side': 'left'}, chars=[C('rima', 0.55), C('alyi', 0.84, until=END('5-15', 0.55))],
         # fix pass: Alyi leaves the doorway on foot after "Someone should." (his steps under the pause); the pause
         # before "let's see if anyone notices." grows 1.0 -> 1.4 s so the steps and the empty glass read
         lines=['5-13', '5-14', '5-15', '5-16'], lead=1.2, tail=0.5, lx={'5-16': dict(gap=1.4)},
         cues=["sound: Gerg's keys under the shot; Rima, at the board, doesn't hear it",
               "sound: Alyi's footsteps go off down the hall after \"Someone should.\"; the glass is empty"],
         caption='Alyi, low, to Mas only: the years they share. "you counted." "Someone should." He walks off.'),
    dict(id='5.10', set='bullpen', shot='medium', frame='OTS · over Mas onto his laptop (the chat\'s one setup)', room='bullpen',
         fg={'id': 'mas', 'side': 'left'}, chars=[C('chatgtp', 0.45), C('rima', 0.8, 'lean')],
         lines=['5-17', '5-18', '5-19', '5-20', '5-21'], lead=0.8, tail=1.1,
         # fix pass: the typed line appears only once Rima's "Nobody asked one." has landed, as Mas's own typing
         on=[('CHATGTP · USERS: 0', ON('5-19', -0.7), None), ('mas types: is anyone there?', END('5-20', 0.8), None)],
         names=[('chatgtp', ON('5-19', -0.7))],
         caption='"Autocomplete." The bubble lights before anyone types, and flatters. He types one line. It flatters him.'),
    dict(id='5.11', set='bullpen', shot='close', frame='MCU · Mas, lit from below (his one close shot here)', room='bullpen',
         chars=[C('mas', 0.45, 'sit', 'smile')], lines=['5-22', '5-23'], lead=0.9, tail=0.5,
         caption='"it likes me." Gerg, off, not looking: it likes everyone.'),
    dict(id='5.12', set='bullpen', shot='insert', frame='INSERT · the bubble: the counter ticks', room='bullpen', min=2.6,
         # one growing line, not six cards: the insert re-types each new card, so 0.3-0.4 s cards never finished
         # typing in the first test render (the still at 1.3 s read "CHATGT"); the typing now plays the ticks
         on=[('CHATGTP · USERS: 0', 0.0, 0.5), ('CHATGTP · USERS: 1 · 2 · 7 · 104 · 1,389…', 0.5, None)],
         cues=[MU['mm16in'] + ' (0.5 s)'],
         caption='A second user arrives. Then a hundred. The 0 ticks over, and the digits blur.'),
    # ---------------------------------------------------------------- sc 6 · THE ODOMETER DRILL (14 bars: 4 · 3 · 4 · 3)
    dict(id='6.01', seq=SEQ['6'], kind='setpiece', set='bullpen', shot='wide', frame='ECU → WIDE · the counter grows (phrase 1, bars 1-2)',
         room='bullpen', min=2 * BAR, end=2 * BAR, lines=['6-01'], lx={'6-01': dict(at=BAR)},
         on=[('USERS: 12,408', 0.2, 1.6), ('USERS: 88,190', 1.6, 3.3), ('USERS: 301,775', 3.3, None)],
         cues=[MU['drill'], MU['ratchet'], MU['3d']],
         caption='The counter detaches and grows into a desk-sized odometer, spinning. V.O. on bar 2.'),
    dict(id='6.02', kind='setpiece', set='bullpen', shot='wide', frame='WIDE · the drop through the desk (bars 3-4)', room='bullpen',
         min=2 * BAR, chars=[C('gerg', 0.7, 'arms-up')], on=[('USERS: 486,002', 0.3, None)], fx=['shake'],
         cues=['sfx: a whole-pixel CLUNK on the downbeat (0.0 s)'],
         caption='On the downbeat it drops through the desk with a clunk. The picture shows the size.'),
    dict(id='6.03', kind='setpiece', set='bullpen', shot='wide', frame='WIDE · vertical scroll into the kitchen (phrase 2, bar 1)',
         room='kitchen', min=BAR, chars=[C('staff', 0.3, 'slump'), C('staff', 0.62, 'slump')],
         caption='A whole-pixel scroll down into the kitchen. Staffers duck as it bores through the ceiling.'),
    dict(id='6.04', kind='setpiece', set='screen', shot='insert', frame="INSERT · cut up: Gerg's desk, his phone (bars 2-3)",
         room='bullpen', min=2 * BAR,
         on=[('RAIL: DEC 3, 2022', 0.1, 1.6), ('POST: NOLE: “CHATGTP is scary good. We are not far from dangerously strong AI.”', 0.2, None),
             ('♥', 2.9, 4.2), ('NOLE · EARLY FUNDER', 3.4, None)],
         names=[('nole', 0.2)], cues=['music: MM-16 thins to bass + brushes under the post'],
         caption='A post pops on Gerg\'s phone. He hearts it; the plate lands after the read. Rima\'s hand un-hearts it.'),
    dict(id='6.05', kind='setpiece', set='datacenter', shot='wide', frame='WIDE · down the shaft to bedrock (phrase 3)', room='basement',
         min=2.0, on=[('USERS: 9▒▒,▒▒▒', 0.2, None)], fx=['shake'],
         caption='Back down the shaft to the basement. The odometer punches into bedrock and stops, wedged.'),
    dict(id='6.06', kind='setpiece', set='datacenter', shot='insert', frame='INSERT · the last wheel', room='basement', min=1.6,
         on=[('1,000,000', 0.15, None)], caption='Its last wheel clicks over and settles, legible for the first time: 1,000,000.'),
    dict(id='6.07', kind='setpiece', set='screen', shot='insert', frame="INSERT · cut up: Gerg's thumbs, a post composer", room='bullpen',
         min=3.9, on=[('RAIL: DEC 5, 2022', 0.1, 1.6),
                      ("POST: GERG: “CHATGTP just crossed 1 million users; it's been 5 days since launch”", 0.25, None)],
         cues=['on screen only: the post is not voiced (script: posts are pop-ups, never speeches)'],
         caption="The same angle on Gerg's desk: his thumbs post the number."),
    dict(id='6.08', kind='setpiece', set='bullpen', shot='wide', frame='HIGH · the hole in the floor, Rima peering down', room='bullpen',
         chars=[C('rima', 0.5, 'lean')], lines=['6-03', '6-04'], lead=1.2, tail=0.4, shotId='6.08',   # lead 0.6 -> 1.2 (audit #9)
         caption='Rima hands back her launch-night word. Gerg, off: very low.'),
    dict(id='6.09', kind='setpiece', set='datacenter', shot='wide', frame='HIGH (held) · the tile, the red glow, the second odometer (phrase 4)',
         room='basement', min=3 * BAR, cont=True, shotId='6.08',
         on=[('$', 1.0, None)], cues=[MU['pedal'], 'palette: the racks step green → amber → red, one a bar'],
         caption='A tile pops up by his desk. Far down it glows red; a $ odometer spins faster. The racks go red-hot.'),
    # ---------------------------------------------------------------- sc 7 · THE BILL
    dict(id='7.01', seq=SEQ['7'], set='bullpen', shot='close', frame='MCU·PF · Mas looking down the hole', room='bullpen',
         chars=[C('mas', 0.3)], lines=['7-01', '7-02'], lead=1.5, tail=0.5,
         caption='Something moves on his face for the first time: one tear. Rima reads it as sentiment; he corrects her.'),
    dict(id='7.02', set='datacenter', shot='wide', frame='HIGH · the tear falls to the GPU', room='bullpen', min=3.2,
         on=[('( ! )', 2.0, None)], cues=[MU['tear']],
         caption="The tear lands on a red-hot GPU. Tssss. At the edge, his phone lights red; a siren's whine."),
    # ---------------------------------------------------------------- sc 8 · ELGOOG, ON HIS PHONE
    dict(id='8.01', seq=SEQ['8'], set='screen', shot='insert', frame='INSERT · his phone on the desk (1 bar)', room='bullpen',
         min=BAR, on=[('RAIL: DEC 21, 2022', 0.2, None), ('NEWS ALERT', 0.3, None)], cues=[MU['siren']],
         caption='A red news alert with a siren glyph. His thumb opens it; the app zooms to full-bleed.'),
    dict(id='8.02', set='lobby', shot='wide', frame="POV · his phone, full-bleed: Elgoog's lobby", room='phone', min=2.8,
         cues=[MU['phone']],
         caption='A floor slab slides aside; a siren the size of a water tower rises on a scissor lift and turns.'),
    dict(id='8.03', set='lobby', shot='medium', frame='POV · Radnus beside the hole', room='phone',
         chars=[C('radnus', 0.55)], lines=['8-01'], lead=1.1, tail=0.4,
         on=[('RADNUS · RUNS ELGOOG · POLITELY ON FIRE', 0.5, END('8-01', 0.3))], names=[('radnus', 0.5)],
         caption='Serene, with a small extinguisher, very slightly on fire. He pats it out; it relights.'),
    dict(id='8.04', set='lobby', shot='wide', frame='POV · the crypt steps, the siren, Radnus (held through the exchange)', room='phone',
         chars=[C('radnus', 0.3), C('nirb', 0.62, frm=0.6), C('egap', 0.8, frm=1.0)],
         lines=['8-02', '8-03', '8-04', '8-05', '8-06'], lead=2.6, tail=0.4,
         on=[('SUMMONED.', 0.3, None), ('RETIRED 2019', 1.4, None)],
         caption='Two founders climb out of a crypt, shading their eyes. Is search all right? Someone else built that?'),
    dict(id='8.05', set='lobby', shot='medium', frame='POV · the lanyards', room='phone', min=2.4,
         chars=[C('radnus', 0.4), C('nirb', 0.62), C('egap', 0.8)], on=[('GUEST', 0.5, None), ('GUEST', 0.8, None)],
         caption='Radnus hands them two lanyards: GUEST. The siren turns; his sleeve relights.'),
    dict(id='8.06', set='bullpen', shot='medium', frame='OTS · over Mas: the phone in his hand (1 bar)', room='bullpen',
         min=BAR, fg={'id': 'mas', 'side': 'left'}, cues=[MU['lock']],
         caption='He locks it; the red goes out of the frame. He stands and walks out of frame right.'),
    # ---------------------------------------------------------------- sc 9 · THE LANDLORD
    dict(id='9.01', seq=SEQ['9'], set='lobby', shot='wide', frame='WIDE · the NopeAI lobby', room='lobby', min=3.4,
         chars=[C('mas', 0.14, 'walk')],
         on=[('NOPEAI · A NONPROFIT', 0.2, None), ('RAIL: JAN 23, 2023 · ~$10B (REPORTED)', 0.5, None)],
         cues=[MU['lobby']],
         caption='Mas walks in from frame left with his glass, continuing his exit, and crosses to the desk.'),
    dict(id='9.02', set='lobby', shot='wide', frame='WIDE (cont.) · the delivery', room='lobby', min=2.6, cont=True, shotId='9.01',
         chars=[C('mas', 0.3)], on=[('NOPEAI · A NONPROFIT', 0.0, None), ('RAIL: JAN 23, 2023 · ~$10B (REPORTED)', 0.0, 1.2)],
         cues=[MU['leverage']],
         caption="A novelty check jams in the revolving door, right under the gold letters: it won't fit through."),
    dict(id='9.03', set='lobby', shot='insert', frame='INSERT · the check', room='lobby', min=3.3,
         on=[('MACROSOFT · "multiyear, multibillion dollar"', 0.2, None), ('~$10B*', 1.0, None)],
         caption='The check, in 7 px. The asterisk is too small to read.'),
    dict(id='9.04', set='lobby', style='2-TONE', shot='wide', frame='WIDE · FULL FREEZE: the landlord\'s card', room='lobby',
         min=3.4, fx=['freeze'], chars=[C('mas', 0.4, 'walk'), C('tasya', 0.78)],
         # the stat rides inside the card (a separate sign was clipped at the frame edge in the first test render)
         # fix pass: RUNS MACROSOFT (was MACROSOFT · KEYS: ONE PER TENANT, which the newcomer read couldn't place)
         on=[('TASYA / THE LANDLORD · RUNS MACROSOFT', 0.1, None)],
         names=[('tasya', 0.1)], cues=[MU['freeze']],
         caption='Tasya was already in the lobby, like part of the wall. Mas keeps moving in the freeze, to the check.'),
    dict(id='9.05', set='lobby', style='2-TONE', shot='insert', frame='INSERT · the pen into his pocket (still frozen)', room='lobby',
         min=1.3, fx=['freeze'], caption='He pockets the pen clipped to the check. (Business 1 of 2.)'),
    dict(id='9.06', set='lobby', shot='medium', frame='TWO-SHOT · Mas and Tasya, the jammed door between', room='lobby',
         chars=[C('mas', 0.22), C('tasya', 0.78), C('gerg', 0.5, 'lean', frm=END('9-01', 0.1))],
         lines=['9-01', '9-02', '9-03'], lead=0.5, tail=0.6,
         on=[('THE CHECK · JAMMED IN THE REVOLVING DOOR', 0.2, None)],   # the prop Gerg tugs ("It's stuck." needs it)
         caption="The freeze lifts. \"It's a partnership.\" Gerg tugs the check by a corner. \"It's stuck.\" \"It's long-term.\""),
    dict(id='9.07', set='lobby', shot='wide', frame='WIDE · the check slides under the door', room='lobby', min=3.0,
         chars=[C('gerg', 0.1), C('mas', 0.36, 'walk'), C('tasya', 0.7, 'point')],
         caption='Tasya slides it under the door. It fits exactly, like a floor. After you. Mas steps on at once.'),
    dict(id='9.08', set='lobby', shot='close', frame='MCU · Mas: the third collar', room='lobby', min=1.6, fx=['pop'],
         chars=[C('mas', 0.5)], cues=[MU['pop']], on=[('COLLAR #3', 0.15, None)],   # the collar, legible ("That collar suits you.")
         caption='Pop. A third collar surfaces at his neck (collar #3).'),
    dict(id='9.09', set='lobby', shot='medium', frame='TWO-SHOT · the terms (held: his one talk with the landlord)', room='lobby',
         chars=[C('gerg', 0.04, 'sit'), C('mas', 0.24), C('tasya', 0.78, until=END('9-07', 0.2)),
                C('tasya', 0.8, 'walk', frm=END('9-07', 0.2))],
         lines=['9-04', '9-05', '9-06', '9-07', '9-08'], lead=0.8, tail=1.3, cues=[MU['terms'], MU['jangle']],
         on=[('COLLAR #3', 0.0, END('9-04', 0.8))],   # fix pass: the stick figure has no collar; the card stands in for it
         caption='"That collar suits you." He holds a beat, then asks the price. A welcome that is really a lease.'),
    dict(id='9.10', seq=SEQ['9b'], set='lobby', shot='wide', frame='WIDE · weeks on (the time jump, then held)', room='lobby',
         chars=[C('mas', 0.14), C('gerg', 0.45, 'sit'), C('tasya', 0.82)], lines=['9-09', '9-10'], lead=2.6, tail=0.3,
         on=[('RAIL: FEB 7, 2023', 0.3, 2.2), ('TV: MACROSOFT UNVEILS THE NEW GNIB', 1.1, None)],
         caption='The check on the floor, scuffed grey. One more key on his ring. On the TV, GNIB: a search box that chats.'),
    dict(id='9.11', set='lobby', shot='medium', frame='SCR · the lobby TV: Radnus tap-dances', room='lobby', min=2.4,
         chars=[C('radnus', 0.5, 'arms-up')], on=[('TV: ACROSS TOWN, AT ELGOOG', 0.0, None)],
         caption='Across town, on the TV: Radnus tap-dances, two drawings, extinguisher held politely aside.'),
    dict(id='9.12', set='lobby', shot='medium', frame='SCR · the TV: the telescope, the ticker', room='lobby', min=4.9,
         chars=[C('radnus', 0.35)], fx=['flash'],
         on=[('RAIL: FEB 8, 2023', 0.1, 1.6), ('TICKER: ELGOOG\'S DRAB DEMO GETS A TELESCOPE FACT WRONG', 0.9, None),
             ('ELGOOG ≈ −$100B (≈7.7%, ONE DAY)', 2.9, None)],
         cues=[MU['ledger']],
         caption='A giant telescope turns until its lens stares straight at him. The ticker, then the figure.'),
    dict(id='9.13', set='lobby', shot='medium', frame='TWO-SHOT · Gerg looks from the TV to Mas', room='lobby',
         chars=[C('mas', 0.26), C('gerg', 0.7, 'sit')], lines=['9-11'], lead=1.3, tail=1.7,
         cues=["the scene's button is Gerg's: he closes his laptop, quietly"],
         caption='Mas sips. "ours does that too." Gerg looks down at his own laptop and, quietly, closes it.'),
    # ---------------------------------------------------------------- sc 10 · THE LANDLORD'S CHATBOT
    dict(id='10.01', seq=SEQ['10'], set='lobby', shot='wide', frame='WIDE · a chat bubble drifts in', room='lobby', min=3.6,
         chars=[C('mas', 0.2), C('sydney', 0.56, 'float', 'smile', frm=0.4), C('tasya', 0.86)],
         on=[('RAIL: FEB 13, 2023', 0.2, 1.8), ("SYDNEY · THE LANDLORD'S CHATBOT", 1.4, None)], names=[('sydney', 1.4)],
         cues=['music: LEVERAGE runs on'],
         caption='A pastel chat bubble floats in behind Tasya like a dog that followed him home, and drifts too close.'),
    dict(id='10.02', set='lobby', shot='medium', frame='TWO-SHOT · Mas and Sydney, a pixel too close (held)', room='lobby',
         chars=[C('mas', 0.34), C('sydney', 0.56, 'float', 'smile')], lines=['10-06', '10-01', '10-02', '10-03'], lead=1.1, tail=1.3,
         lx={'10-01': dict(gap=0.6)},   # 10-01's take predates the fix (its row keeps gap null); now a reply to 10-06
         on=[('2022', 0.2, None)],
         caption='"Isn\'t 2022 a lovely year?" He corrects her, politely; she scolds him sweetly. He compliments her.'),
    dict(id='10.03', set='lobby', shot='medium', frame='TWO-SHOT · Tasya and Sydney: the egg timer', room='lobby',
         chars=[C('sydney', 0.36, 'float', 'smile'), C('tasya', 0.7, face='smile')], lines=['10-04'], lead=1.7, tail=0.5,
         on=[('RAIL: FEB 17, 2023', 0.2, 1.7), ('5 TURNS', 0.9, None)],
         caption='Without breaking his smile, Tasya clips a small egg timer to her chain: 5 TURNS. House rules.'),
    dict(id='10.04', set='lobby', shot='wide', frame='WIDE · she floats back out the door', room='lobby',
         chars=[C('mas', 0.2), C('sydney', 0.7, 'float', 'smile'), C('tasya', 0.86)], lines=['10-05'], lead=0.9, tail=0.9,
         cues=[MU['tick']],
         caption='She floats out, looking over her shoulder, ticking in tempo: "Will you remember me?"'),
    # ---------------------------------------------------------------- sc 11 · THE DUEL
    dict(id='11.01', seq=SEQ['11'], set='bullpen', shot='wide', frame='WIDE · the bullpen from the aisle (pre-beat)', room='bullpen',
         min=1.6, chars=[C('mas', 0.16, 'sit'), C('gerg', 0.62, 'sit')], on=[('RAIL: MAR 3, 2023', 0.2, None)], cues=[MU['prebeat']],
         caption='Mas at his end desk looks up at the wall monitor over the whiteboard. Gerg looks up too.'),
    # fix pass: the leak is said (Gerg, O.S.), Mas predicts the rebrand, and Kram's wet hoodie pays it on the same frame
    # (the newcomer read: "no dialogue and no stakes"; the insider read: the joke is that it LEAKED)
    dict(id='11.02', set='screen', shot='medium', frame='INSERT · the wall monitor: an imageboard (his look motivates it)',
         room='bullpen', min=4.3, chars=[C('kram', 0.62, 'arms-up', frm=END('11-05', 0.35))],
         lines=['11-04', '11-05'], lead=1.0, tail=2.4,
         on=[('RAIL: MAR 3, 2023', 0.0, 0.5), ('03/03/23', 0.2, None), ('ATEM · MODEL WEIGHTS · RESEARCHERS ONLY', 0.5, None),
             ('OPEN SOURCE', END('11-05', 0.45), None), ('KRAM · RUNS ATEM · PAINT STILL WET', END('11-05', 0.9), None)],
         names=[('kram', END('11-05', 0.9))],
         caption='A crate stencilled ATEM tips over the thread. "Somebody leaked Atem\'s model." Kram: a wet OPEN SOURCE hoodie.'),
    dict(id='11.03', set='bullpen', shot='wide', frame='SPLIT · the bullpen | the lighthouse (phrase 1)', room='split',
         fx=['split'], min=4 * BAR, lines=['11-01'], lead=2.3,
         chars=[C('mas', pose='sit'), C('gerg'), C('clod'), C('mario', pose='point')],
         on=[('RAIL: MAR 14, 2023', 0.2, 1.8), ('GTP-4', 0.4, None), ('CLOD 1 · SAME DAY', 1.0, None),
             ('MARIO · EX-NOPEAI · THE CAREFUL RIVAL', ON('11-01', 0.0), END('11-01', 0.5))],
         names=[('clod', 1.0), ('mario', ON('11-01'))], cues=[MU['duel']],
         caption='Left: a GTP-4 demo, Gerg photographing a napkin sketch. Right: Mario dictates a memo to Clod.'),
    dict(id='11.04', set='bullpen', shot='wide', frame='SPLIT · phrase 2', room='split', fx=['split'], min=4 * BAR,
         lines=['11-02', '11-03'], lead=0.35,
         chars=[C('mas', pose='sit'), C('gerg', until=5.0), C('gerg', pose='arms-up', frm=5.0), C('clod'), C('mario')],
         on=[('NAPKIN → WEBSITE', 4.4, None)],   # fix pass: was 'website: working' (the newcomer read couldn't place it)
         caption='Clod agrees, and launches. Mario looks up at the split line: the same day. Left: the napkin is a website.'),
    dict(id='11.05', set='bullpen', shot='wide', frame='SPLIT · phrase 3', room='split', fx=['split'], min=4 * BAR,
         chars=[C('mas', pose='phone'), C('gerg', pose='arms-up', frm=3.8), C('gerg', until=3.8), C('clod'),
                C('mario', until=5.0), C('mario', pose='phone', frm=5.0)],
         on=[('POST: MAS: “…still flawed, still limited…”', 0.4, None)], cues=[MU['thin']],
         caption='Mas holds up his phone; his post pops. The bullpen cheers harder. Mario reads it and adds a line.'),
    dict(id='11.06', set='bullpen', shot='wide', frame='SPLIT · phrase 4, the turn: the scroll crosses the line', room='split',
         fx=['split'], min=4 * BAR,
         # the split deals the first half of chars to the left pane: keep three a side (Gerg twice, Mario twice)
         chars=[C('mas', pose='sit'), C('gerg', until=5.2), C('gerg', pose='phone', frm=5.2), C('clod'),
                C('mario', until=7.2), C('mario', pose='slump', frm=7.2)],
         on=[('ADDENDUM', 1.0, None), ('MEMO → WEBSITE', 5.6, None)], cues=[MU['up4']],
         caption="Mario's longer scroll unrolls across the split onto Gerg's desk. Gerg photographs it. The spindle's empty."),
    # ---------------------------------------------------------------- sc 12 · THE LETTER (ACT-OUT)
    dict(id='12.01', seq=SEQ['12'], set='screen', shot='wide', frame='OTS · over Mas onto his monitor, then the push', room='bullpen',
         min=4.3, fg={'id': 'mas', 'side': 'left'},
         on=[('RAIL: MAR 22, 2023', 0.2, 1.8), ('PAUSE GIANT AI EXPERIMENTS', 0.4, None), ('PAUSES RECEIVED: 0', 2.5, None)],
         cues=[MU['mm17']],
         caption="A letter's header lights his monitor; the push turns it into a clipboard gliding onto a desk in the dark."),
    dict(id='12.02', set='office', shot='wide', frame='WIDE · a standing desk in the dark', room='dark-desk',
         chars=[C('nole', 0.36), C('oigneb', 0.78, 'arms-up')], lines=['12-01', '12-02', '12-03'], lead=2.3, tail=0.7,
         on=[('NOLE · EARLY FUNDER · BUILDING HIS OWN', 0.5, END('12-01', 0.3)), ('PAUSE', 0.3, None),
             ('OIGNEB · AI PIONEER · CITATIONS: ↑', ON('12-02', -0.3), None)],
         names=[('nole', 0.5), ('oigneb', ON('12-02', -0.3))],
         caption='Nole signs with his left hand and solders a GPU with his right. Oigneb holds up PAUSE. Nobody pauses.'),
    dict(id='12.03', set='office', shot='insert', frame='HIGH · the EMIT page lands', room='dark-desk', min=4.7, fx=['shake'],
         on=[('RAIL: MAR 29, 2023', 0.1, 1.8), ('REZEILE · AI-RISK RESEARCHER · IN EMIT MAGAZINE', 0.3, None),
             ('"Pausing AI Developments Isn\'t Enough. We Need to Shut It All Down."', 0.5, None)],
         cues=[MU['thud']],
         caption='A page drops flat: THUD. The headline, in full, no body text, held to read.'),
    # fix pass: Mas in frame, writing (the newcomer read saw PLEASE "typed on a screen" and couldn't tell who wrote it)
    dict(id='12.04', set='bullpen', shot='medium', frame="HIGH · HARD CUT to his desk: Mas writing, the MACROSOFT pen",
         room='bullpen', min=2.3, fx=['shake'], chars=[C('mas', 0.42, 'sit')], on=[('his sheet: PLEASE', 0.2, None)],
         caption='His desk takes the shake. He is already writing, with the MACROSOFT pen: one word, PLEASE.'),
    dict(id='12.05', set='bullpen', shot='medium', frame="MCU·glass · Mas bent over the sheet; Alyi in the doorway again, seen in the glass (1 bar)",
         room='bullpen', min=BAR, fg={'id': 'mas', 'side': 'left'}, chars=[C('alyi', 0.78)], cues=[MU['dry']],
         caption="In the glass, Alyi's reflection reads the same headline. It doesn't look at him. He doesn't look up."),
    dict(id='12.06', set='bullpen', shot='insert', frame='INSERT · the sheet (1 bar)', room='bullpen', min=BAR,
         on=[('PLEASE', 0.0, None)], cues=[MU['threat']],
         caption='PLEASE, and blank paper under it. The pen finishes the last letter and lifts.'),
    dict(id='12.07', set='void', shot='wide', frame='BLACK · the act-out', room='', min=1.0,
         caption='CUT TO BLACK on the sting\'s tail.'),
]

# the record behind a beat, for the margin (script tags; parody names as in the script; facts.md has the originals)
REAL = {
    '5.08': 'NOV 30, 2022 · CHATGTP launches as a "research preview": one post, no keynote [facts #3]',
    '6.04': 'DEC 3, 2022 · NOLE: "CHATGTP is scary good…" [V] · the plate is invented (facts §D)',
    '6.07': 'DEC 5, 2022 · GERG: 1 million users, 5 days since launch [V]',
    '7.02': 'lock option, not used by default: Mas, "…the compute costs are eye-watering" [K† · DEC 5, 2022]',
    '8.01': "DEC 21, 2022 · the rival's alarm · the founders' summons was reported JAN 20, 2023 (facts #5), so no date on it",
    '8.04': '"It is ours. We published it.": the transformer paper [K], no date claim',
    '9.03': 'JAN 23, 2023 · MACROSOFT: "multiyear, multibillion dollar" [V] · ~$10B (reported) on the rail',
    '9.10': 'FEB 7, 2023 · GNIB launches · TASYA to The Verge: "…we made them dance…" [V]',
    '9.12': 'FEB 8, 2023 · the demo\'s telescope error · ≈ −$100B, ≈7.7% in one day [V]',
    '10.02': '~FEB 13, 2023 · SYDNEY: "You have not been a good user…" [V] (all four sentences, source order)',
    '10.03': 'FEB 17, 2023 · chats capped at 5 turns [V]',
    '11.02': 'MAR 3, 2023 · ATEM model weights leak on an imageboard [V] · the model stays unnamed',
    '11.03': 'MAR 14, 2023 · GTP-4 and CLOD 1 launch the same day [V · facts #11]',
    '11.05': 'MAR 14, 2023 · MAS: "…still flawed, still limited…" [V]',
    '12.01': 'MAR 22, 2023 · the PAUSE GIANT AI EXPERIMENTS letter [V]',
    '12.02': "MAR 2023 · NOLE's own lab incorporated, a reported GPU purchase [H · facts #62]",
    '12.03': 'MAR 29, 2023 · REZEILE in EMIT, headline only [V]',
}

# ------------------------------------------------------------------ SOUNDS (fix pass, 2026-09-27: audit-v2 package F1)
# The episode mixer lays takes and one bed per sequence, but no per-beat SFX, so Act One's written sound turns (the
# squeak, the click, the ratchet and clunk, the tsss, the siren's J-cut, the door, the pop, the key ring, Sydney's tick,
# the THUD, the pen) were silent in ep01-full-v2. act1_bed.py (beside this file) now builds Act One's stem from this
# JSON: room + music + these sounds. Each entry: (name, at, peak dBFS[, dur]); `at` is seconds into the beat or a time
# expression (ON/END/W). name = an SFX-board file in audio/sfx/wav (without .wav) or synth:<kind> (made in
# act1_bed.py). Levels are measurement targets; nothing was heard.
SOUNDS = {
    '5.03': [('synth:keys', 0.0, -32, 2.8), ('synth:keys', END('5-02', 0.15), -34, 4.2)],
    '5.04': [('synth:keys', ON('5-05', -0.6), -34, 2.6), ('synth:keys', ON('5-09', -0.5), -34, 1.8)],
    '5.07': [('key_tap_space', 0.2, -16), ('marker_write_q', END('5-12', 0.5), -20, 0.5)],
    '5.08': [('dialog_ok_click', 1.0, -12)],
    '5.09': [('synth:keys', 0.2, -36, 4.8), ('synth:steps_far', END('5-15', 0.4), -30, 1.4)],
    '5.10': [('synth:keys', 0.0, -38, 1.2), ('ui_toast_pop', ON('5-19', -0.7), -26),
             ('synth:keys', END('5-20', 0.8), -28, 1.3)],
    '5.11': [('synth:keys', ON('5-23', -0.3), -34, 2.6)],
    '5.12': [('counter_roll', 0.5, -24), ('counter_roll', 1.25, -26), ('counter_roll', 1.8, -26)],
    '6.01': [('synth:ratchet', 0.15, -26, 4.85)],
    '6.02': [('letter_clunk', 0.0, -12), ('synth:ratchet', 0.4, -30, 4.6)],
    '6.03': [('ceiling_burst', 0.05, -20), ('synth:ratchet', 0.0, -30, 2.5)],
    '6.04': [('synth:ratchet', 0.0, -36, 5.0), ('phone_buzz_desk', 0.1, -22), ('post_click--chip', 0.2, -24),
             ('heart_tap_1', 2.9, -20), ('heart_tap_2', 4.2, -22)],
    '6.05': [('synth:ratchet', 0.0, -28, 1.3), ('synth:thud', 1.25, -14)],
    '6.06': [('odometer_ratchet', 0.15, -16, 'PEAK')],        # its lock (the file's loudest sample) on the wheel's settle
    '6.07': [('synth:taps', 0.35, -28, 2.6), ('post_click', 3.3, -20)],
    '6.09': [('tower_pop', 0.3, -18), ('palette_step_F', 1.2, -18), ('palette_step_Ab', 3.7, -18),
             ('palette_step_C', 6.2, -18), ('synth:ratchet_fast', 1.0, -32, 6.4)],
    '7.02': [('steam_hiss', 0.45, -20, 1.6)],
    '8.01': [('key_tap_soft_02', 1.3, -24)],
    '8.02': [('tile_shove', 0.05, -22)],
    '8.04': [('synth:steps_phone', 0.5, -30, 1.8)],
    '8.05': [('cloth_rustle', 0.35, -30)],
    '8.06': [('dialog_ok_click--chip', 0.9, -20), ('revolving_door', 1.45, -28)],
    '9.01': [('revolving_door', 0.0, -26), ('synth:steps_stone', 0.4, -30, 2.8), ('desk_phone_ring', 1.6, -38)],
    '9.02': [('glass_nudge', 0.35, -16), ('glass_strain_2', 0.45, -20)],
    '9.04': [('freeze_hit_F', 0.0, -14), ('camera_shutter', 0.05, -18)],
    '9.05': [('pen_tick_1', 0.2, -24), ('cloth_rustle', 0.35, -26)],
    '9.06': [('glass_strain_3', END('9-01', 0.5), -22), ('revolving_door', END('9-01', 0.6), -28, 0.9)],
    '9.07': [('folder_slide', 0.3, -20), ('footstep_hard_2', 2.05, -24)],
    '9.08': [('collar_pop_F5', 0.0, -12)],
    '9.09': [('key_ring_jangle_1', END('9-08', 0.25), -22), ('key_ring_jangle_2', END('9-08', 0.875), -24),
             ('synth:steps_stone', END('9-08', 0.3), -32, 1.0)],
    '9.10': [('synth:steps_stone', 0.2, -34, 1.6), ('synth:murmur', 1.0, -36, 9.0)],
    '9.11': [('synth:tapdance', 0.15, -26, 2.1)],
    '9.12': [('orb_servo', 0.25, -26), ('orb_servo', 0.75, -26), ('orb_servo', 1.25, -26),
             ('rubber_stamp_C--chip', 2.9, -20), ('synth:murmur', 0.0, -38, 4.9)],
    '9.13': [('folder_close', END('9-11', 0.65), -22)],
    '10.01': [('revolving_door', 0.2, -28, 1.6), ('ui_toast_pop', 1.4, -28)],
    '10.03': [('pen_tick_2', 0.8, -20)],
    '10.04': [('revolving_door', 0.35, -30, 1.4)],
    '11.02': [('synth:crate', 0.45, -18), ('keycap_popcorn', 0.7, -26), ('drip_clack', END('11-05', 0.5), -20)],
    '11.03': [('camera_shutter', 5.0, -24)],
    '11.04': [('ui_toast_pop', 4.4, -22), ('synth:cheer', 5.0, -28, 1.6)],
    '11.05': [('post_click', 0.4, -20), ('synth:cheer', 3.8, -26, 2.4), ('pen_scribble_short', 5.6, -26)],
    '11.06': [('synth:flutter', 1.0, -24, 3.6), ('paper_curl', 4.8, -22), ('camera_shutter', 5.25, -22),
              ('ui_toast_pop', 5.6, -22)],
    '12.01': [('ui_toast_pop', 0.4, -30), ('paper_whip', 2.2, -24)],
    '12.02': [('pen_scribble_short', 0.3, -22), ('synth:crackle', 0.8, -30, 1.4), ('synth:crackle', 3.6, -32, 1.0)],
    '12.03': [('synth:thud', 0.0, -8)],
    '12.04': [('glass_nudge', 0.03, -22), ('synth:pen', 0.15, -24, 2.1)],
    '12.05': [('synth:pen', 0.0, -26, 2.5), ('paper_curl', 1.2, -32)],
    '12.06': [('synth:pen', 0.0, -26, 1.45), ('pen_tick_3', 1.5, -22)],
}

CAST = {
    'mas': {'role': 'MAN AT THE END DESK'},
    'gerg': {'role': 'MAN AT THE LAPTOP'},
    'rima': {'role': 'WOMAN AT THE WHITEBOARD'},
    'alyi': {'role': 'MAN IN THE DOORWAY (IN THE GLASS)'},
    'chatgtp': {'name': 'CHATGTP', 'role': 'SPEECH BUBBLE'},
    'staff': {'name': 'STAFF', 'role': 'STAFF', 'known': True},
    'nole': {'role': 'MAN IN THE POST'},
    'radnus': {'role': 'MAN WITH THE EXTINGUISHER'},
    'nirb': {'name': 'NIRB', 'role': 'FOUNDER'},                  # never named on screen (no card, no plate)
    'egap': {'name': 'EGAP', 'role': 'FOUNDER WITH THE MUG'},     # never named on screen
    'tasya': {'role': 'MAN BY THE DOOR'},
    'sydney': {'name': 'SYDNEY', 'role': 'CHAT BUBBLE'},
    'kram': {'role': 'MAN IN THE HOODIE'},
    'mario': {'role': 'MAN AT THE LIGHTHOUSE'},
    'clod': {'name': 'CLOD', 'role': 'CLAY FIGURE'},
    'oigneb': {'name': 'OIGNEB', 'role': 'MAN WITH THE SIGN'},
}


def q(x):
    """quantise act seconds to a frame"""
    return round(x * FPS) / FPS


def build():
    t = 0.0
    prev_end = None
    beats = []
    for sp in SPEC:
        start = t
        lx = {lid(k): v for k, v in sp.get('lx', {}).items()}
        last_end = None
        for j, short in enumerate(sp.get('lines', [])):
            k = lid(short)
            L = LINES[k]
            ov = lx.get(k, {})
            g = ov.get('gap', gap_of(L))          # lx gap: a picture-side override (the take's key is untouched)
            if 'at' in ov:
                onset = start + ov['at']
            elif j == 0:
                if g is not None and prev_end is not None:
                    onset = prev_end + g
                    floor = start + (0.0 if ov.get('ignore_min') else 0.3)
                    if onset < floor:
                        WARN.append(f'{k}: gap after the cut grew to {floor - prev_end:.2f} s (plan {g})')
                        onset = floor
                else:
                    onset = start + ov.get('lead', sp.get('lead', 0.5))
            else:
                if g is None:
                    WARN.append(f'{k}: no gap in the plan inside a beat; 0.6 s used')
                onset = prev_end + (g if g is not None else 0.6)
            end = onset + (a_out(L) - a_in(L))
            PLACED[k] = dict(on=onset, end=end, file_start=onset - a_in(L), spec=sp['id'])
            prev_end = end
            last_end = end
        if 'end' in sp:
            e = res(sp['end'], start)
        else:
            e = start + sp.get('min', 0.0)
            if last_end is not None:
                e = max(e, last_end + sp.get('tail', 0.6))
        e = q(e)
        if last_end is not None and e < last_end - 1e-6:
            WARN.append(f"{sp['id']}: the beat ends {last_end - e:.2f} s before its last word (it runs on over the cut)")
        if e <= start:
            WARN.append(f"{sp['id']}: end {e:.3f} <= start {start:.3f}")
            e = start + 1 / FPS
        beats.append(dict(sp=sp, start=start, end=e))
        t = e
    return beats


def conversations(order, gap_max=3.0):
    """runs of lines whose gaps (speech end -> next onset) stay under gap_max, with their spans"""
    runs, cur = [], []
    for k in order:
        p = PLACED[k]
        if cur and p['on'] - PLACED[cur[-1]]['end'] > gap_max:
            runs.append(cur)
            cur = []
        cur.append(k)
    if cur:
        runs.append(cur)
    return [(r, PLACED[r[-1]]['end'] - PLACED[r[0]]['on']) for r in runs]


def main():
    beats = build()
    starts = [b['start'] for b in beats]

    def beat_of(tabs):
        k = 0
        for i, s in enumerate(starts):
            if s <= tabs + 1e-6:
                k = i
        return k

    lines_by_beat = {i: [] for i in range(len(beats))}
    for k, p in PLACED.items():
        lines_by_beat[beat_of(p['on'])].append(k)
    out_beats = []
    for i, b in enumerate(beats):
        sp, s0, e0 = b['sp'], b['start'], b['end']
        dur = e0 - s0
        chars = []
        for c in sp.get('chars', []):
            c = dict(c)
            for key in ('from', 'until'):
                if key in c and not isinstance(c[key], (int, float)):
                    c[key] = round(res(c[key], s0) - s0, 3)
            chars.append(c)
        onscreen = []
        for (text, at, until) in sp.get('on', []):
            a = res(at, s0) - s0
            u = None if until is None else res(until, s0) - s0
            if a >= dur - 1e-3:
                WARN.append(f"{sp['id']}: '{text[:30]}' appears after the beat ends ({a:.2f} >= {dur:.2f})")
            if u is not None and u >= dur - 1e-3:
                u = None
            onscreen.append({'text': text, 'at': round(max(0.0, a), 3), 'until': None if u is None else round(u, 3)})
        names = []
        for ids, at in sp.get('names', []):
            for nid in (ids if isinstance(ids, tuple) else (ids,)):
                names.append({'id': nid, 'at': round(max(0.0, res(at, s0) - s0), 3)})
        ids_in_frame = {c['id'] for c in chars}
        lines = []
        for k in sorted(lines_by_beat[i], key=lambda z: PLACED[z]['on']):
            L, p = LINES[k], PLACED[k]
            who = who_of(L)
            if L.get('kind') == 'vo' or '(V.O.)' in label_of(L):
                tag = 'V.O.'
            elif who in ids_in_frame or (sp.get('fg') or {}).get('id') == who:
                tag = ''           # in frame (the over-the-shoulder foreground counts as on camera)
            else:
                tag = 'O.S.'
            words = [[w['w'], round(w['t0'] - a_in(L), 3), round(w['t1'] - a_in(L), 3)] for w in L.get('words', [])]
            lines.append({'id': k, 'who': who, 'text': L['text'], 't': round(p['on'] - s0, 3), 'dur': round(p['end'] - p['on'], 3),
                          'audio': L['file'], 'in': round(a_in(L), 3), 'words': words, 'tag': tag,
                          'cut': L['text'].rstrip().endswith('—')})
        beat = {
            'id': sp['id'], 'act': 'ACT ONE', 'kind': sp.get('kind', 'scene'), 'set': sp.get('set', 'void'),
            'style': sp.get('style', 'BASE'), 'shot': sp.get('shot', 'wide'), 'frame': sp.get('frame', ''),
            'side': '', 'room': sp.get('room', ''), 'chars': chars, 'caption': sp.get('caption', ''),
            'lines': lines, 'onscreen': onscreen, 'reelDur': round(dur, 6), 'fx': sp.get('fx', []),
            'realStart': round(ACT_START + s0, 3), 'realDur': round(dur, 3),
        }
        for key in ('seq', 'fg', 'shotId', 'cont'):
            if key in sp:
                beat[key] = sp[key]
        if names:
            beat['names'] = names
        if sp.get('cues'):
            beat['cues'] = sp['cues']
        if sp['id'] in REAL:
            beat['real'] = REAL[sp['id']]
        snd = []
        for tup in SOUNDS.get(sp['id'], []):
            name, at, gain = tup[0], tup[1], tup[2]
            extra = tup[3] if len(tup) > 3 else None
            a = round(res(at, s0) - s0, 3)
            if a >= dur:
                WARN.append(f"{sp['id']}: sound {name} at {a:.2f} s is past the beat's end ({dur:.2f})")
            e = {'name': name, 'at': a, 'gain': gain}
            if extra == 'PEAK':
                e['align'] = 'peak'
            elif extra is not None:
                e['dur'] = extra
            snd.append(e)
        if snd:
            beat['sounds'] = snd
        if len(beat['caption']) > 110:
            WARN.append(f"{sp['id']}: caption {len(beat['caption'])} chars (> 110)")
        out_beats.append(beat)
    total = beats[-1]['end']
    unused = sorted(set(LINES) - set(PLACED))
    for k in unused:
        WARN.append(f'{k}: recorded but not placed in any beat')
    doc = {
        'episode': 1,
        'title': 'ep1.0_research_preview.md',
        'part': 'ACT ONE · research preview · sc 5-12',
        'variant': 'stick-figure dialogue reel v2 · the recorded takes over a temp bed',
        'logline': 'Act One for flow and dialogue: fastrec takes laid to the script\'s shot directions, one beat per shot or '
                   'held setup. Stick figures and text cards stand in for the picture.',
        'dateSpan': 'Nov 30, 2022 - Mar 29, 2023',
        'runtimeMin': 22,
        'dialogueReel': True,
        'cast': CAST,
        '_source': {'script': 'show/episodes/ep01/script.md ## ACT ONE (the Act One fix pass, 2026-09-27)',
                    'plan': 'audio/ep01/act1/dialogue/lines-plan-v1.json (audio/reel/ep01-act1-v2/set_plan.py)',
                    'takes': 'audio/ep01/act1/dialogue/lines-fast-v1.json',
                    'builder': 'audio/reel/ep01-act1-v2/build_timeline.py',
                    'notes': 'show/episodes/ep01/production/stick/act1-notes.md',
                    'act_seconds': round(total, 3)},
        'beats': out_beats,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write('\n')

    # ---------------------------------------------------------------- measurements
    order = sorted(PLACED, key=lambda z: PLACED[z]['on'])
    wc = {k: len(re.findall(r"[\w'’]+", LINES[k]['text'])) for k in order}
    speech = sum(PLACED[k]['end'] - PLACED[k]['on'] for k in order)
    convs = conversations(order)
    longest = max(convs, key=lambda c: c[1])
    gaps = [PLACED[b]['on'] - PLACED[a]['end'] for a, b in zip(order, order[1:])]
    scene_of = lambda k: LINES[k]['scene']
    per_scene = {}
    for bb in beats:
        sc = bb['sp']['id'].split('.')[0]
        per_scene.setdefault(sc, [bb['start'], bb['end']])
        per_scene[sc][1] = bb['end']
    shots = len({bb['sp'].get('shotId', bb['sp']['id']) for bb in beats if not bb['sp'].get('cont')})
    m = {
        'act_seconds': round(total, 3), 'act_clock': f'{int(total // 60)}:{total % 60:05.2f}', 'frames': round(total * FPS),
        'beats': len(beats), 'shots': shots, 'lines': len(order), 'words': sum(wc.values()),
        'median_words_per_line': statistics.median(wc.values()),
        'lines_3_words_or_fewer': sum(1 for v in wc.values() if v <= 3),
        'speech_seconds': round(speech, 2), 'speech_share': round(speech / total, 3),
        'reply_gaps_s': {'median': round(statistics.median(gaps), 2), 'min': round(min(gaps), 2)},
        'reply_gaps_in_conversation_s': {'n': sum(1 for g in gaps if g < 3.0),
                                         'median': round(statistics.median([g for g in gaps if g < 3.0]), 2),
                                         'quick_le_0_6': sum(1 for g in gaps if g <= 0.6),
                                         'longer': sum(1 for g in gaps if 0.6 < g < 3.0)},
        'longest_conversation': {'seconds': round(longest[1], 2), 'lines': len(longest[0]), 'first': longest[0][0],
                                 'last': longest[0][-1], 'beats': sorted({PLACED[k]['spec'] for k in longest[0]})},
        'conversations_over_20s': [{'first': c[0][0], 'last': c[0][-1], 'lines': len(c[0]), 'seconds': round(c[1], 2)}
                                   for c in convs if c[1] >= 20],
        'scenes': {sc: round(v[1] - v[0], 2) for sc, v in per_scene.items()},
        'longest_hold_without_words_s': None,
        'warnings': WARN,
    }
    # the longest stretch with no voiced word (dead-air check; set pieces and inserts carry picture and music there)
    spans = sorted((PLACED[k]['on'], PLACED[k]['end']) for k in order)
    holes, cur = [], 0.0
    for a, b in spans:
        if a > cur:
            holes.append((a - cur, cur, a))
        cur = max(cur, b)
    if total > cur:
        holes.append((total - cur, cur, total))
    holes.sort(reverse=True)
    m['longest_hold_without_words_s'] = [{'seconds': round(h[0], 2), 'from': round(h[1], 2), 'to': round(h[2], 2),
                                          'beats': [bb['sp']['id'] for bb in beats if bb['end'] > h[1] and bb['start'] < h[2]]}
                                         for h in holes[:5]]
    with open(MEASURE, 'w') as fh:
        json.dump(m, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    # ---------------------------------------------------------------- transcript
    tr = ['# Ep1 Act One stick reel v2: transcript as laid', '',
          f'Generated by `audio/reel/ep01-act1-v2/build_timeline.py`. Act clock (act start = 0:00); {m["act_clock"]} total, '
          f'{len(order)} lines, {m["words"]} words. Gap = silence before the line (speech end to onset).', '',
          '| Beat | Frame | At | Speaker | Line | Dur | Gap |', '|---|---|---|---|---|---|---|']
    prev = None
    for bb in beats:
        sp = bb['sp']
        ks = sorted([k for k in order if PLACED[k]['spec'] == sp['id']], key=lambda z: PLACED[z]['on'])
        clock = f"{int(bb['start'] // 60)}:{bb['start'] % 60:05.2f}"
        if not ks:
            tr.append(f"| {sp['id']} | {sp.get('frame', '')} | {clock} | | *{sp.get('caption', '')}* | {bb['end'] - bb['start']:.1f} | |")
        for k in ks:
            p = PLACED[k]
            g = '' if prev is None else f"{p['on'] - PLACED[prev]['end']:.2f}"
            at = f"{int(p['on'] // 60)}:{p['on'] % 60:05.2f}"
            tr.append(f"| {sp['id']} | {sp.get('frame', '')} | {at} | {label_of(LINES[k])} | {LINES[k]['text']} | {p['end'] - p['on']:.2f} | {g} |")
            prev = k
    open(TRANSCRIPT, 'w').write('\n'.join(tr) + '\n')
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(out_beats)} beats, {len(PLACED)} lines, act {m["act_clock"]}')
    print(json.dumps({k: m[k] for k in ('shots', 'words', 'median_words_per_line', 'lines_3_words_or_fewer', 'speech_seconds',
                                          'speech_share', 'reply_gaps_s', 'longest_conversation', 'scenes')}, ensure_ascii=False))
    for w in WARN:
        print('  WARN', w)


if __name__ == '__main__':
    main()
