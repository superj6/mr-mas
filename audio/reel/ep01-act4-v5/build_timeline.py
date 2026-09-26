#!/usr/bin/env python
"""Ep1 Act Four v5 STICK-FIGURE DIALOGUE REEL: the timeline builder.

  audio/.venv/bin/python audio/reel/ep01-act4-v5/build_timeline.py      -> show/reel/ep01-act4-v5.json

The picture is cut to the takes. Every shot of edit-plan-v5 §3.2 (draft 5.1) is one beat (a shot whose staging
changes inside it, a freeze or a cutaway, is split into beats marked "cont"), and every line is laid from the real
v5 take (audio/ep01/act4/dialogue/lines-v5.json):

  * a line's speech onset = the previous line's speech end + the plan's gap (lines-v5 placement.gap_before_s:
    quick replies 0.2-0.6 s, loaded ones 0.6-1.6 s), or the shot's lead-in when it follows picture;
  * the one designed overlap (Adelina over Mario) comes in at the take's own interrupt point;
  * shots end on their tail after the last word (or on a word, where a line crosses a cut);
  * posts, plates, rails and cards are timed for read (about 0.25 s + 0.05 s a character, more for story text).

The JSON is the "dialogueReel" format of studio/src/reel/schema.ts (DIALOGUE REELS). bed.py builds the sound from
the same JSON; report.py writes the transcript and the measurements. Nothing here is heard or watched.
"""
from __future__ import annotations

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
LINES_JSON = os.path.join(ROOT, 'audio/ep01/act4/dialogue/lines-v5.json')
OUT = os.path.join(ROOT, 'show/reel/ep01-act4-v5.json')
FPS = 24
ACT_START = 12 * 60 + 31          # the act's first frame in the episode (12:31)

LINES = {l['id']: l for l in json.load(open(LINES_JSON))}
SPEAKER = {'NELEH': 'neleh', 'MADA': 'mada', 'MAS MANALT': 'mas', 'ALYI': 'alyi', 'RIMA TAMURI': 'rima',
           'TILED EMPLOYEE': 'employee', 'GERG MOCKBRAN': 'gerg', 'MARIO': 'mario', 'ADELINA': 'adelina',
           'TTEMME': 'ttemme', 'TASYA': 'tasya', 'TERB': 'terb'}
# speech end on the file's clock where the file's own metadata can't be used as is
OUT_OVERRIDE = {'a5-27-31': 8.50}  # Mario: the voice drops -8 dB at 8.176 s (Adelina's onset) and is gone by ~8.5 s
WARN: list[str] = []


# ------------------------------------------------------------------ time expressions (resolved after lines are laid)
class T:
    def __init__(self, kind, line=None, k=None, off=0.0):
        self.kind, self.line, self.k, self.off = kind, line, k, off

    def __add__(self, o):
        return T(self.kind, self.line, self.k, self.off + o)

    def __sub__(self, o):
        return T(self.kind, self.line, self.k, self.off - o)


def ON(l, off=0.0):
    return T('on', l, None, off)


def END(l, off=0.0):
    return T('end', l, None, off)


def W(l, k, off=0.0):
    """start of word k of line l (k: index, or a word; 'word#2' = its second occurrence)"""
    return T('w0', l, k, off)


def WE(l, k, off=0.0):
    return T('w1', l, k, off)


PLACED: dict[str, dict] = {}


def _word(lid, k):
    ws = LINES[lid]['words']
    if isinstance(k, int):
        return ws[k]
    m = re.match(r'^(.*?)(?:#(\d+))?$', k)
    want, nth = m.group(1).lower(), int(m.group(2) or 1)
    hits = [w for w in ws if re.sub(r"[^\w']", '', w['w'].lower()) == want]
    if len(hits) < nth:
        raise KeyError(f'{lid}: no word {k!r} in {[w["w"] for w in ws]}')
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
    elif x.kind == 'w0':
        v = p['file_start'] + _word(x.line, x.k)['t0']
    else:
        v = p['file_start'] + _word(x.line, x.k)['t1']
    return v + x.off


# ------------------------------------------------------------------ helpers for the spec
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


GRID_HIS = [C('mas'), C('alyi'), C('neleh'), C('mada'), C('quiet-vote')]          # his laptop's call (S1)
GRID_BOARD = [C('alyi'), C('neleh'), C('mada'), C('quiet-vote')]                 # the board's call, his tile gone
MU = {  # the temp music, per sequence (margin notes; bed.py holds the plan itself)
    'plan': 'music: temp MM-07 BLUEPRINT waltz (mm07 underscore) · thins + ducks ~-10 dB under talk · tape-stop on JOIN',
    'call': 'music: temp MM-08 LEVERAGE low (mm08 underscore) · hard stop on the Cancel click',
    'd6': 'sound: the one deliberate silence (Cancel click -> phone buzz): music and room out, room tone only',
    'suite': 'sound: the suite comes back on the buzz · no score under "super."',
    'dark': 'music: temp MM-08 26A felt (mm08 underscore) · thins under the V.O.',
    'proc': 'music: temp PROCEDURE (MM-09 underscore), one performance for pass one · thins + ducks under talk',
    'card': 'music: temp 09x REVERSAL (MM-09 underscore)',
    'his5': 'music: temp DARK ROOM pedal + pulse (v4 S5 render, looped) · ducks under talk',
    'aval': 'music: temp SET-PIECE SWING (v4 S6 render) · dead stop on MADA\'s label',
    'ret': 'music: temp MM-11 THE RETURN (v4 S7/S8 render) · thins + ducks under talk',
    'stop': 'music: dead stop after "of what?" · the room holds Mada\'s pause',
    'coda': 'music: MM-11 felt settle into the vault\'s F hum (temp) · the hum alone under the memo',
}

# ------------------------------------------------------------------ THE SHOT PLAN (edit-plan-v5 §3.2, draft 5.1)
# keys: id, seq, side, kind, set, style, shot, frame, room, chars, fg, lines, lead, tail, min, end, on (in-world text:
# (text, at, until)), names ((ids, at)), sounds ((name, at, gain_db)), speak ((id, at, dur)), lx (per-line: lead,
# gap, after, jcut, overlap, tag), caption, cues, cont, fx
S1 = dict(id='S1', side='HIS SIDE', place='Las Vegas: the hotel suite', time='Fri Nov 17, 2023 · ~noon')
B = "THE BOARD'S SIDE"
H = 'HIS SIDE'
SPEC = [
    # ---------------------------------------------------------------- S1 · NOON, LAS VEGAS: THE PLAN AND THE CALL
    dict(id='S1.01', seq=S1, side=H, set='office', shot='wide', frame='WIDE · establishing', room='suite', min=3.5,
         chars=[C('mas', 0.34, 'sit'), C('orb', 0.44)],
         on=[('RAIL: NOV 17, 2023 · ~NOON PT · LAS VEGAS', 0.25, 3.2)],
         names=[('orb', 0)], cues=[MU['plan']],
         caption='The suite over the Strip. A crane truck grinds past; every glass shivers except his.'),
    dict(id='S1.02', side=H, set='screen', shot='insert', frame='INSERT · hand, glass, laptop', room='suite', min=2.5,
         on=[('BOARD · VIDEO CALL · JOIN', 0.3, None)],
         caption='He nudges the glass true. On the laptop: BOARD · VIDEO CALL · JOIN. The glow turns to blueprint.'),
    dict(id='S1.03', seq=dict(sub='THE PLAN', place='THE PLAN: the blueprint behind the button', time='noon'), side=H,
         kind='plan', set='void', shot='wide', frame='GFX · THE SHEET', room='suite',
         chars=[C('neleh', 0.88, 'point')], lines=['a5-25-01', 'a5-25-02', 'a5-25-03'], lead=1.4, tail=1.1,
         on=[('HOW TO FIRE A CEO', 0.3, None), ('MAS / CEO', 0.8, None), ('GERG / CO-FOUNDER', 0.8, None),
             ('DIRE · NOVIHS · DRUH', 0.8, END('a5-25-01', 0.8)),
             ('ALYI · NELEH · MADA · THE QUIET VOTE', W('a5-25-02', 'four'), None),
             ('NOPEAI · THE NONPROFIT', END('a5-25-02', 0.2), None),
             ('NOPEAI · THE COMPANY', END('a5-25-03', 0.5), None)],
         names=[(('mas', 'gerg'), 0.8), (('alyi', 'neleh', 'mada', 'quiet-vote'), W('a5-25-02', 'four'))],
         sounds=[('rubber_stamp_C', 0.3, -24)],
         caption="Her blueprint figure reads the board's plan. Three chairs walk off; a ring draws round the four."),
    dict(id='S1.04', side=H, kind='plan', set='void', shot='medium', frame='GFX · detail: THE ZEROS', room='suite',
         chars=[C('mada', 0.14), C('neleh', 0.86, 'point')], lines=['a5-25-04', 'a5-25-05', 'a5-25-06'], lead=0.9,
         tail=1.4,
         on=[('MACROSOFT · ~$10B IN (REPORTED)', 0.3, None), ('VOTES: 0', W('a5-25-04', 'votes'), None),
             ('CEO', ON('a5-25-05'), None), ('EQUITY: 0 (HE TOLD THE SENATE)', W('a5-25-06', 'question'), None)],
         sounds=[('rubber_stamp_C', W('a5-25-04', 'votes'), -22), ('rubber_stamp_C', W('a5-25-06', 'question'), -22)],
         caption="The investor's key ring gets VOTES: 0; the CEO box gets EQUITY: 0. The two zeros hold side by side."),
    dict(id='S1.05', side=H, kind='plan', set='void', shot='wide', frame='GFX · the path and the break', room='suite',
         min=3.2, chars=[C('alyi', 0.3), C('neleh', 0.44), C('mada', 0.58), C('quiet-vote', 0.72)],
         on=[('1. NOON · VIDEO CALL', 0.6, None)], sounds=[('paper_whip', 2.7, -20)],
         caption='The four step onto a numbered path; step 1 is NOON · VIDEO CALL. The fold curls; the sheet tears.'),
    dict(id='S1.06', side=H, set='screen', shot='insert', frame='INSERT · trackpad, JOIN', room='suite', min=1.5,
         on=[('BOARD · VIDEO CALL · JOIN', 0.0, None)], sounds=[('dialog_ok_click', 1.25, -16)],
         caption='He clicks JOIN; the waltz tape-stops to zero on the click.'),
    dict(id='S1.07', seq=dict(sub='the call', place='the board call, on his laptop', time='noon'), side=H,
         set='call', shot='wide', frame='POV · the call grid (his laptop)', room='suite', min=5.5, chars=GRID_HIS,
         on=[('NELEH / READ THE CHARTER. LITERALLY.', 0.4, 3.5), ('FOOTNOTES: ∞', 0.4, 3.5),
             ('UI: MAS MANALT · OK · Cancel', 4.6, None)],
         speak=[('alyi', 3.5, 2.0)], cues=[MU['call']],
         caption="His side: no words reach us. Alyi's tile takes the speaking ring; a dialog pops over Mas's tile."),
    dict(id='S1.08', side=H, set='office', shot='close', frame='SINGLE · ECU his eyes', room='suite', min=1.25,
         chars=[C('mas', face='calm')], speak=[('alyi', 0, 1.25)],
         caption='His pupils move one pixel toward the dialog. Nothing else moves.'),
    dict(id='S1.09', side=H, set='call', shot='wide', frame='POV · the call grid', room='suite', min=4.8,
         chars=[C('mas', until=2.4), C('alyi'), C('neleh'), C('mada'), C('quiet-vote')],
         on=[('UI: MAS MANALT · OK · Cancel', 0.0, 2.4), ('ALYI / CO-FOUNDER', 0.3, 2.5),
             ("You've been removed from the meeting.", 2.9, None)],
         sounds=[('dialog_ok_click', 2.4, -14)], cues=[MU['d6']],
         caption="An arrow tagged ALYI / CO-FOUNDER steps onto Cancel and clicks. Silence. His tile falls out."),
    dict(id='S1.10', side=H, set='office', shot='close', frame='SINGLE · CU Mas, still', room='suite', min=1.0,
         chars=[C('mas', face='smile')], caption='Mas, full frame, the one-pixel smile. Nothing changes.'),
    dict(id='S1.11', side=H, set='screen', shot='insert', frame='INSERT · his phone', room='suite', min=1.9,
         on=[('[super]  [super]  [super]', 0.5, None)], sounds=[('BUZZ', 0.3, -14)], cues=[MU['suite']],
         caption='The phone buzzes and the room comes back. Suggested replies; his thumb takes the middle one.'),
    dict(id='S1.12', side=H, set='call', shot='wide', frame='OTS · over Mas onto the laptop', room='suite',
         chars=GRID_BOARD, fg={'id': 'mas', 'side': 'left'}, lines=['a5-26-01'], lead=0.45, tail=1.05,
         caption='"super." into the laptop. The four tiles freeze on the word. The room falls away to night.'),
    # ---------------------------------------------------------------- S2 · THAT NIGHT
    dict(id='S2.01', seq=dict(id='S2', side=H, place='his dark room', time='Fri Nov 17 · that night'), side=H,
         set='darkroom', shot='close', frame='INSERT · the desk, the carve', room='dark',
         lines=['a5-26a-01'], lead=1.6, tail=0.6, lx={'a5-26a-01': dict(tag='V.O.')},
         on=[('RAIL: NOV 17 · NIGHT', 0.2, 1.4)], cues=[MU['dark']],
         caption='With the pen he pocketed from the MACROSOFT check, he carves a third mark beside two faint ones.'),
    dict(id='S2.02', side=H, set='darkroom', shot='close', frame='INSERT · the three marks, from above', room='dark',
         min=1.8, chars=[C('orb', 0.8)], caption="The Orb's eye-light steps onto mark 1. The Orb is counting."),
    dict(id='S2.03', side=H, kind='flashback', style='EARLY-WEB16', set='office', shot='wide',
         frame='FLASH · F1.2 TPOOL', room='tpool', min=4.0,
         on=[('RAIL: TPOOL, HIS FIRST COMPANY · TWO STAFF REVOLTS · (REPORTED)', 0.2, 3.8)],
         sounds=[('render_front_sweep', 0.0, -20)],
         caption='A render front out of mark 1: a frosted boardroom door, two shadows leaning together.'),
    dict(id='S2.04', side=H, set='darkroom', shot='close', frame='INSERT · the marks', room='dark', min=1.5,
         chars=[C('orb', 0.8)], sounds=[('render_front_sweep', 0.0, -24)],
         caption='The light steps to mark 2, then 3, and stops on his thumb.'),
    dict(id='S2.05', side=H, set='darkroom', shot='close', frame="SINGLE · the Orb's iris", room='dark', min=2.5,
         chars=[C('orb')], on=[('rewinding…', 0.6, None)], sounds=[('reverse_swell_1beat', 1.4, -18)],
         caption='The iris lifts to his face. Toast: rewinding… A whip right to left into pass one.'),
    # ---------------------------------------------------------------- S3 · FRIDAY, THE BOARD'S SIDE
    dict(id='S3.00a', seq=dict(id='S3', side=B, place="Neleh's desk: the board call", time='Fri Nov 17 · 11:59 AM'),
         side=B, set='call', shot='wide', frame="OTS · over Neleh onto her laptop (held, slow push)", room='office',
         fg={'id': 'neleh', 'side': 'left'}, chars=[C('alyi'), C('neleh'), C('mada'), C('quiet-vote'), C('mas', frm=1.4)],
         lines=['a5-27-01', 'a5-27-02', 'a5-27-03', 'a5-27-04'], lead=2.4, tail=0.6,
         on=[('Waiting for MAS MANALT to join…', 0.2, 1.4), ('11:59', 0.2, END('a5-27-02', 0.6)),
             ('12:00', END('a5-27-02', 0.6), None)],
         cues=[MU['proc']],
         caption="Their side: the fifth tile connects, perfectly still. Alyi tells him in plain words."),
    dict(id='S3.01', side=B, set='call', shot='wide', frame='SCREEN · her laptop, full frame', room='office',
         chars=GRID_BOARD, lines=['a5-27-05'], lx={'a5-27-05': dict(min_lead=1.2, tag='laptop')}, tail=1.4,
         on=[('MAS MANALT was removed from the meeting.', 0.3, None), ('MAS MANALT · audio', 0.6, None)],
         caption='His tile simply goes; a lit audio chip stays. Tinny, out of it: "super." Nobody looks up.'),
    dict(id='S3.02', side=B, set='boardroom', shot='insert', frame='OVERHEAD · her desk', room='office', min=2.6,
         on=[('1. NOON · VIDEO CALL  ✓', 0.2, None), ('2. BLOG POST', 0.8, None), ('3. INTERIM CEO', 1.2, None),
             ('4. ______________', 1.6, None)], sounds=[('key_tap_space', 0.2, -24)],
         caption="Her pen ticks step 1 and runs down what the fold hid; it stops on the blank step 4."),
    dict(id='S3.03', side=B, set='screen', shot='insert', frame='SCREEN · the blog, in its own UI', room='office',
         lines=['a5-27-06', 'a5-27-07', 'a5-27-08'], lx={'a5-27-06': dict(jcut=0.3)}, tail=1.9,
         on=[('NOPEAI BLOG · DRAFT', 0.0, None),
             ('…he was not consistently candid in his communications with the board…', 0.2, None),
             ('The board no longer has confidence in his ability to continue leading NopeAI.', 0.2, None),
             ('[ Post ]', 0.2, None)],
         sounds=[('post_click', END('a5-27-08', 1.35), -16)],
         caption='"Step two." She reads the post once before it goes up, asks for objections, gets none, posts.'),
    dict(id='S3.04', side=B, set='call', shot='wide', frame="OTS · over Neleh onto the grid (held)", room='office',
         fg={'id': 'neleh', 'side': 'left'}, chars=GRID_BOARD + [C('rima', frm=0.2)],
         lines=['a5-27-09', 'a5-27-10', 'a5-27-11', 'a5-27-12', 'a5-27-13', 'a5-27-14', 'a5-27-15'], lead=1.1,
         tail=0.3, on=[('RIMA TAMURI · HIS CTO', 0.4, 2.6)], names=[('rima', 0.2)],
         sounds=[('bell_ding_F6', 0.2, -26)],
         caption="A join chime; a spotlight finds Rima's tile. Step three: she is interim CEO, and told nothing more."),
    dict(id='S3.04b', side=B, set='office', shot='close', frame='SINGLE · MCU Neleh, one brow up', room='office',
         chars=[C('neleh', 0.62, face='smug')], lines=['a5-27-16', 'a5-27-17'], tail=0.9,
         sounds=[('key_tap_space', END('a5-27-17', 0.5), -26)],
         caption='"Will we?" Rima\'s "More. Soon." plays on Neleh\'s face. Pen tick: step 3.'),
    dict(id='S3.06', seq=dict(sub='the all-hands', place='the all-hands, in the bullpen', time='Friday afternoon'),
         side=B, set='bullpen', shot='wide', frame='WIDE · the all-hands, from the back', room='allhands',
         chars=[C('staff', 0.08, 'sit'), C('staff', 0.22, 'sit'), C('employee', 0.38, 'point'), C('staff', 0.54, 'sit'),
                C('staff', 0.68, 'sit'), C('alyi', 0.9)],
         lines=['a5-27-18'], lead=1.0, tail=0.5,
         caption='A match cut to the real doorway. One employee is already standing, hand up. The crowd hushes.'),
    dict(id='S3.07', side=B, set='bullpen', shot='close', frame='SINGLE · MCU Alyi in the doorway (held)',
         room='allhands', chars=[C('alyi', 0.62)], lines=['a5-27-19'], tail=1.7,
         caption="Alyi answers in the record's words, with a real pause to look at her. Then he steps back out."),
    dict(id='S3.05', seq=dict(sub='the evening', place="Neleh's desk: the board call", time='Friday evening'), side=B,
         set='call', shot='wide', frame='SCREEN · her laptop, evening', room='office_night',
         chars=GRID_BOARD + [C('rima')], lines=['a5-27-20', 'a5-27-21'], lead=2.1, tail=1.0,
         on=[('POST: GERG: “…I quit.”', 0.3, None)], sounds=[('keycap_popcorn', 0.7, -20)],
         caption="Her lamp is on. Gerg's post lands as the call's own notification; keycaps rain across the grid."),
    # ---------------------------------------------------------------- S4 · THE WEEKEND, THE BOARDROOM
    dict(id='S4.01', seq=dict(id='S4', side=B, place='the boardroom', time='Sat Nov 18 · night'), side=B,
         set='call', shot='wide', frame="SCREEN · the boardroom's wall screen", room='boardroom', min=4.8,
         chars=GRID_BOARD + [C('rima')],
         on=[('RAIL: NOV 18', 0.2, 1.6),
             ("POST: MAS: “…sorta like reading your own eulogy while you're still alive”", 0.9, None)],
         sounds=[('heart_gliss', 0.3, -20)],
         caption="Hearts pour over the call until the tiles are buried; his post scrolls across. One blue heart."),
    dict(id='S4.02', side=B, set='boardroom', shot='wide', frame='WIDE · the boardroom at night (held)',
         room='boardroom', chars=[C('neleh', 0.3), C('alyi', 0.5), C('mada', 0.7, 'sit')],
         lines=['a5-27-22', 'a5-27-23'], lead=1.3, tail=0.5,
         on=[('STAFF · STAFF · INVESTORS · STAFF', 0.3, None)],
         sounds=[('BUZZ', 0.3, -24), ('BUZZ', END('a5-27-22', 0.5), -26)],
         caption='Four phones buzz and step toward the edge. Neleh, with a marker, talks to the room in full.'),
    dict(id='S4.04', side=B, set='boardroom', shot='medium', frame="OTS · over Neleh onto the window (Alyi's reflection)",
         room='boardroom', fg={'id': 'neleh', 'side': 'left'}, chars=[C('alyi', 0.62)],
         lines=['a5-27-24', 'a5-27-25', 'a5-27-26'], tail=0.3, sounds=[('BUZZ', 0.1, -28)],
         caption="Alyi, a reflection in the dark window, not turning: step four will reveal itself."),
    dict(id='S4.06', side=B, set='boardroom', shot='medium', frame="TWO-SHOT · Neleh and Mada, Alyi's reflection between",
         room='boardroom', chars=[C('neleh', 0.22), C('alyi', 0.5), C('mada', 0.78, 'sit')],
         lines=['a5-27-27', 'a5-27-28'], tail=0.9, sounds=[('landing_thunk', END('a5-27-27', 0.35), -22)],
         caption="\"That isn't a time.\" The first phone goes off the edge: clack. She looks down at it."),
    dict(id='S4.07', side=B, set='boardroom', shot='close', frame='SINGLE · MCU Neleh (her real face)', room='boardroom',
         chars=[C('neleh', 0.6, face='worried')], lines=['a5-27-29'], lead=1.3, tail=2.1,
         sounds=[('DTMF', END('a5-27-29', 0.5), -26), ('DTMF', END('a5-27-29', 0.85), -26),
                 ('DTMF', END('a5-27-29', 1.2), -26), ('DTMF', END('a5-27-29', 1.55), -26)],
         caption='She looks at the blank line, decides, pulls the speakerphone over and dials: four tones.'),
    dict(id='S4.08', seq=dict(sub='the rival lab', place='split: the boardroom / the rival lab\'s lighthouse',
                              time='Saturday night'),
         side=B, set='lighthouse', shot='medium', fx=['split'], frame='SPLIT · both calls, one held shot',
         room='split', chars=[C('neleh'), C('mada', pose='sit'), C('mario'), C('adelina', frm=None)],
         lines=['a5-27-30', 'a5-27-31', 'a5-27-32', 'a5-27-33', 'a5-27-34'], lead=2.7, tail=1.3,
         lx={'a5-27-32': dict(overlap='a5-27-31', at_file=8.176), 'a5-27-33': dict(after=2.0)},
         on=[("MARIO · RUNS THE RIVAL LAB · (REPORTED)", 0.25, 2.65),
             ("ADELINA · MARIO'S CO-FOUNDER", ON('a5-27-32', -0.15), ON('a5-27-32', 2.2)),
             ('NOZAMA', END('a5-27-32', 0.9), None),
             ('NOZAMA · UP TO $4B  ·  ELGOOG · UP TO $2B', END('a5-27-32', 0.9), None)],
         names=[('mario', 0.25), ('adelina', ON('a5-27-32', -0.15))],
         sounds=[('RING', 0.2, -24), ('RING', 1.2, -24), ('dialog_ok_click', END('a5-27-32', 0.3), -20),
                 ('DIALTONE', END('a5-27-32', 0.5), -30), ('RING', END('a5-27-32', 0.9), -26)],
         caption="Neleh offers Mario the job. He has eleven pages; Adelina takes the phone: no. Then Nozama calls."),
    dict(id='S4.09', seq=dict(sub='Sunday', place='the boardroom (the lobby camera on its wall screen)',
                              time='Sun Nov 19 · day'),
         side=B, set='screen', shot='wide', frame='OTS · over Neleh onto the lobby camera', room='cctv',
         fg={'id': 'neleh', 'side': 'left'}, lines=['a5-27-35', 'a5-27-36', 'a5-27-37'], lead=3.2, tail=1.2,
         on=[('NOPEAI HQ · LOBBY · NOV 19', 0.2, None), ('GUEST', 0.5, None),
             ('POST: MAS: “first and last time i ever wear one of these”', 0.8, None)],
         caption='On the CCTV: a familiar figure at reception in a GUEST lanyard. On "here" he walks out.'),
    dict(id='S4.10', seq=dict(sub='Sunday night', place='the boardroom', time='Sunday night'), side=B,
         set='boardroom', shot='wide', frame='WIDE · the boardroom, now night', room='boardroom', min=4.0,
         chars=[C('neleh', 0.28), C('mada', 0.5, 'sit'), C('ttemme', 0.8, 'sit', frm=0.8)],
         on=[('TTEMME · RAN A STREAMING SITE', 1.0, 3.8), ('LIVE · CHAT', 1.0, None)], names=[('ttemme', 1.0)],
         caption="Rima's spotlight swings off her tile onto a new arrival in the CEO chair: hoodie, headset, hourglass."),
    dict(id='S4.10b', side=B, set='boardroom', shot='medium', frame='TWO-SHOT · Neleh and Ttemme across the table (held)',
         room='boardroom', chars=[C('neleh', 0.28), C('ttemme', 0.72, 'sit')],
         lines=['a5-27-38', 'a5-27-39', 'a5-27-40', 'a5-27-41', 'a5-27-42'], lead=0.8, tail=0.3,
         lx={'a5-27-42': dict(after=3.0)}, sounds=[('paper_whip', END('a5-27-41', 0.5), -22)],
         caption='"We\'d like a different one." He wants to know why. A sealed folder; he reads it turned away.'),
    dict(id='S4.11', side=B, set='boardroom', shot='close', frame='LOW · desk level, the hourglass', room='boardroom',
         chars=[C('ttemme', 0.62, 'sit')], lines=['a5-27-43'], lx={'a5-27-43': dict(min_lead=1.0)}, tail=1.0,
         on=[('LIVE · CHAT:  F  F  F  F', 1.0, None)],
         caption='He flips the hourglass; the sand starts. To his chat: "Chat… for how long?"'),
    dict(id='S4.12', seq=dict(sub='~11:53 PM', place='the boardroom', time='Sun Nov 19 · ~11:53 PM'), side=B,
         set='boardroom', shot='medium', frame='TWO-SHOT · Neleh and Mada', room='boardroom', min=2.9,
         chars=[C('neleh', 0.3), C('mada', 0.7, 'sit')], on=[('RAIL: NOV 19 · ~11:53 PM PT', 0.2, 1.9)],
         caption='The wall steps to MACROSOFT slate blue. A door that was not there appears in it, and opens.'),
    dict(id='S4.13', side=B, set='boardroom', shot='close', frame='SINGLE · MCU Tasya in the new doorway', room='boardroom',
         chars=[C('tasya', 0.62)], lines=['a5-27-44', 'a5-27-45'], lead=2.6, end=W('a5-27-45', 'Ttemme', -0.3),
         on=[('TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS', 0.2, ON('a5-27-44', 0.7))],
         names=[('tasya', 0.2)],
         caption='Tasya, delighted, phone in hand: "You\'ll want to hear our statement." He reads it whole.'),
    dict(id='S4.13c', side=B, set='boardroom', shot='medium', frame='MEDIUM · Ttemme in the CEO chair, Tasya beyond',
         room='boardroom', chars=[C('ttemme', 0.32, 'sit'), C('tasya', 0.84)], end=W('a5-27-45', 'Mas', -0.15),
         caption='The first sentence lands on the man it welcomes. Ttemme nods back, pleased and slightly lost.'),
    dict(id='S4.13d', side=B, set='boardroom', shot='medium', frame="TWO-SHOT · Neleh and Alyi's reflection",
         room='boardroom', chars=[C('neleh', 0.32), C('alyi', 0.66)], end=END('a5-27-45', 0.4),
         caption='The second sentence lands on the board: Mas and Gerg are joining Macrosoft. Her pen stops.'),
    dict(id='S4.13e', side=B, set='boardroom', shot='close', frame='SINGLE · MCU Tasya lifts the sign', room='boardroom',
         min=3.0, chars=[C('tasya', 0.62, 'point')], on=[('MAS · GERG →', 0.2, None)],
         caption='A small cartoon sign, arrow pointing out. The key ring jangles once.'),
    dict(id='S4.14', side=B, set='boardroom', shot='insert', frame='OVERHEAD · the blueprint', room='boardroom',
         lines=['a5-27-46'], lead=1.0, tail=0.7, lx={'a5-27-46': dict(tag='O.S.')},
         on=[('1. NOON · VIDEO CALL  ✓', 0.0, None), ('2. BLOG POST  ✓', 0.0, None), ('3. INTERIM CEO  ✓', 0.0, None),
             ('4. ______________', 0.0, ON('a5-27-46', 0.3)), ('4.  ?', ON('a5-27-46', 0.3), None)],
         caption='Her marker comes into frame. "Step four?" She writes one mark on it: ?'),
    dict(id='S4.15', side=B, set='boardroom', shot='close', frame='SINGLE · MCU Mada', room='boardroom', min=2.5,
         chars=[C('mada', 0.6, 'sit')], caption="Mada, arms folded, spinner turning. He doesn't answer. Pass one ends."),
    # ---------------------------------------------------------------- CARD
    dict(id='S5.01', seq=dict(id='CARD', side='', place="the act-out card", time=''), side='', kind='card',
         set='void', shot='wide', frame='CARD', room='boardroom', min=1.75,
         on=[("WHAT THEY DIDN'T KNOW", 0.0, None)], cues=[MU['card']], caption='The door back. Black, cream type.'),
    # ---------------------------------------------------------------- S5 · HIS SIDE, 2 AM
    dict(id='S5.02', seq=dict(id='S5', side=H, place='his dark room (Gerg on the monitor)', time='Mon Nov 20 · ~2:06 AM'),
         side=H, set='darkroom', shot='close', frame='INSERT · the home shot: glass and lanyard', room='dark', min=2.6,
         on=[('RAIL: NOV 20, 2023 · ~2:06 AM PT', 0.2, 2.4), ('GUEST', 0.2, None)], cues=[MU['his5']],
         caption='The glass, its water line one flat row, and the GUEST lanyard laid square beside it.'),
    dict(id='S5.03', side=H, set='screen', shot='insert', frame='INSERT · his phone and thumb', room='dark', min=4.0,
         on=[('RIMA: “NopeAI is nothing without its people”', 0.2, None),
             ('“NopeAI is nothing without its people”  ×2  ×4  ×16  …', 2.4, None)],
         sounds=[('key_tap_soft_01', 1.2, -26), ('key_tap_soft_02', 1.825, -26), ('key_tap_soft_03', 2.45, -26),
                 ('key_tap_soft_04', 3.075, -26), ('key_tap_soft_05', 3.7, -26)],
         caption="Rima's post, then the same words from everyone. He hearts every one on the beat."),
    dict(id='S5.04', side=H, set='darkroom', shot='medium', frame='TWO-SHOT · Mas and the Orb', room='dark',
         chars=[C('mas', 0.32, 'sit'), C('orb', 0.6)], lines=['a5-29-01'], lead=1.0, tail=0.5,
         sounds=[('orb_servo', 0.3, -22)], caption="The Orb's iris steps off the phone onto the lanyard. He answers the look."),
    dict(id='S5.05', side=H, set='darkroom', shot='close', frame='SINGLE · MCU Mas', room='dark',
         chars=[C('mas', 0.36, 'sit')], lines=['a5-29-02'], tail=1.0,
         caption='The Orb does not look away. The one true word. Rack to the Orb.'),
    dict(id='S5.09', side=H, set='call', shot='wide', frame='OTS · over Mas onto the monitor, Gerg\'s tile big',
         room='dark', fg={'id': 'mas', 'side': 'left'}, chars=[C('gerg', pose='sit')],
         lines=['a5-29-03', 'a5-29-04', 'a5-29-05'], lead=1.4, tail=0.5,
         sounds=[('RING', 0.2, -30), ('dialog_ok_click', 1.0, -24)],
         caption="The staff letter is already open. Gerg's tile rings; Mas clicks it. Gerg is typing, 2 AM."),
    dict(id='S5.06', side=H, set='screen', shot='medium', frame='POV · his monitor: the letter, one page, a slow scroll',
         room='dark', lines=['a5-29-06', 'a5-29-07', 'a5-29-08', 'a5-29-09', 'a5-29-10', 'a5-29-11', 'a5-29-12'],
         lead=0.8, tail=0.5,
         lx={'a5-29-06': dict(tag='monitor'), 'a5-29-07': dict(tag='monitor'), 'a5-29-09': dict(tag='monitor'),
             'a5-29-11': dict(tag='monitor'), 'a5-29-12': dict(tag='monitor'), 'a5-29-08': dict(tag='O.S.'),
             'a5-29-10': dict(tag='O.S.')},
         on=[('STAFF LETTER · TO THE BOARD', 0.1, None), ('SIGNED 505', 0.1, ON('a5-29-07')),
             ('SIGNED 650', ON('a5-29-07'), ON('a5-29-09')), ('SIGNED 700', ON('a5-29-09'), ON('a5-29-11', -0.3)),
             ('SIGNED 745 / 770', ON('a5-29-11', -0.3), None),
             ('“…unable to work for or with people that lack competence, judgment and care for our mission and employees.”',
              W('a5-29-06', 'unable', -0.1), ON('a5-29-07')),
             ('“…unless all current board members resign…”', W('a5-29-07', 'unless', -0.1), ON('a5-29-09')),
             ('“…positions for all NopeAI employees…”', W('a5-29-09', 'positions', -0.1), END('a5-29-11', 0.3)),
             ('ALYI (REPORTED)', END('a5-29-11', 0.6), None)],
         sounds=[('odometer_ratchet', ON('a5-29-11', -0.3), -22), ('bell_ding_F6', END('a5-29-11', 0.7), -28)],
         caption='Gerg reads the letter as each line scrolls up; the count rolls to 745. The scroll stops on ALYI.'),
    dict(id='S5.07b', side=H, set='darkroom', shot='close', frame="SINGLE · MCU Mas, the monitor's light", room='dark',
         chars=[C('mas', 0.36, 'sit')], lines=['a5-29-13', 'a5-29-14'], tail=0.9,
         lx={'a5-29-14': dict(tag='monitor')},
         caption='"alyi voted." / "He did both." Hold on Mas a beat: the pause is his.'),
    dict(id='S5.08', side=H, set='boardroom', shot='insert', frame='INSERT · the check', room='dark',
         lines=['a5-29-15'], lead=1.3, tail=1.4, lx={'a5-29-15': dict(tag='monitor')},
         on=[('PAY TO: NOPEAI STAFF', 0.4, None), ('~$86B VALUATION · EVIRHT', 0.6, None),
             ('MEMO: STAFF SHARE SALE', 0.8, None), ('VOID IF CEO MISSING', END('a5-29-15', 0.3), None)],
         sounds=[('SLOT', 0.0, -26), ('rubber_stamp_C', END('a5-29-15', 0.3), -18)],
         caption='A check slides out of the rack\'s slot. Gerg explains it; then the stamp: VOID IF CEO MISSING.'),
    dict(id='S5.09-back', shotId='S5.09', side=H, set='call', shot='wide', frame='OTS · back over Mas onto the monitor',
         room='dark', fg={'id': 'mas', 'side': 'left'}, chars=[C('gerg', pose='sit')],
         lines=['a5-29-16', 'a5-29-17'], lead=0.6, tail=0.6,
         caption='"what are you building?" Gerg, still typing, sunny. His keys stop after "case".'),
    dict(id='S5.09b', side=H, set='call', shot='wide', frame="POV · cut-in: Gerg's tile fills the monitor", room='dark',
         chars=[C('gerg', pose='sit', face='calm')], lines=['a5-29-18', 'a5-29-19'], lead=1.2, tail=1.1,
         lx={'a5-29-19': dict(tag='O.S.')},
         caption='His one look up, at Mas. The Build and his keys stop; the pedal holds. Then he types again.'),
    dict(id='S5.11', side=H, set='darkroom', shot='medium', frame='TWO-SHOT · the back wall; the slate door rises',
         room='dark', chars=[C('mas', 0.3, 'sit')], lines=['a5-29-20', 'a5-29-21', 'a5-29-22'], lead=1.9, tail=0.5,
         lx={'a5-29-20': dict(tag='O.S.'), 'a5-29-22': dict(tag='O.S.')},
         on=[('MAS / GERG / →', 0.9, None)],
         sounds=[('landing_thunk', 0.2, -30), ('landing_thunk', 0.5, -30), ('landing_thunk', 0.8, -30),
                 ('key_tap_space', 1.25, -24)],
         caption="A slate-blue door steps up out of the shadow, Tasya's sign taped to it. A key turns. His voice."),
    dict(id='S5.12', side=H, set='darkroom', shot='close', frame='SINGLE · MCU Mas, the door soft behind', room='dark',
         chars=[C('mas', 0.36, 'sit')], lines=['a5-29-23'], tail=1.3,
         caption='After a full offer, and a pause that belongs to the door. Rack to the door, open a crack.'),
    # ---------------------------------------------------------------- S6 · THE AVALANCHE
    dict(id='S6.01', seq=dict(id='S6', side=H, place='his monitor: the board call', time='Monday'), side=H,
         set='call', shot='wide', frame='POV · the board grid (locked)', room='dark', min=4.5,
         chars=GRID_BOARD + [C('staff', frm=0.8), C('staff', frm=1.3), C('staff', frm=1.8), C('staff', frm=2.3),
                             C('staff', frm=2.8)],
         on=[('745 / 770', 0.2, None)],
         sounds=[('landing_thunk', 0.8, -24), ('landing_thunk', 1.3, -24), ('landing_thunk', 1.8, -24),
                 ('landing_thunk', 2.3, -24), ('landing_thunk', 2.8, -24)], cues=[MU['aval']],
         caption='The grid he watched from their side. One employee tile lands; then ten; then hundreds.'),
    dict(id='S6.02', side=H, set='darkroom', shot='close', frame='SINGLE · MCU Mas watching', room='dark', min=1.5,
         chars=[C('mas', 0.36, 'sit')], caption='Mas watching, blank. Each landing steps the room\'s light.'),
    dict(id='S6.03', side=H, set='call', shot='wide', frame="POV · Alyi's tile, half frame", room='dark', min=1.9,
         chars=[C('alyi', until=1.2), C('neleh'), C('mada'), C('quiet-vote'), C('staff'), C('staff')],
         on=[('ALYI left the call', 1.2, None)],
         caption="Alyi's tile grows, resists one beat, and is shoved off the edge."),
    dict(id='S6.04', side=H, set='call', shot='wide', frame="POV · Neleh's tile, half frame", room='dark',
         chars=[C('neleh', until=None), C('mada'), C('quiet-vote'), C('staff'), C('staff'), C('staff')],
         lines=['a5-29-24'], lead=0.3, tail=0.35, lx={'a5-29-24': dict(tag='call')},
         on=[('ALYI left the call', 0.0, None), ('NELEH left the call', END('a5-29-24', 0.05), None)],
         caption='Neleh\'s tile follows, footnotes scattering. The avalanche takes the end of her question.'),
    dict(id='S6.06', side=H, set='call', shot='wide', frame='POV · the last gap: Mada', room='dark', min=5.75,
         chars=[C('quiet-vote', until=1.0), C('mada'), C('staff'), C('staff'), C('staff'), C('staff')],
         on=[('THE QUIET VOTE left the call', 1.0, None), ('MADA · LAST FIRER STANDING', 4.3, None)],
         sounds=[('freeze_hit_F', 4.3, -20)],
         caption="The black tile goes without a sound. Mada, wedged in, does not move. His label flips; dead stop."),
    # ---------------------------------------------------------------- S7 · THE RETURN
    dict(id='S7.01', seq=dict(id='S7', side=H, place='the bullpen, back wall', time='Mon Nov 20 · day'), side=H,
         set='bullpen', shot='medium', fx=['split'], frame='BOX · the two boxes (the act\'s one box, held)', room='bullpen',
         chars=[C('mas', pose='sit'), C('alyi')], lines=['a5-30-01', 'a5-30-02', 'a5-30-03', 'a5-30-04'], lead=8.2,
         tail=2.3,
         on=[('RAIL: NOV 20', 0.2, 1.4), ('GUEST  ·  MACROSOFT', 0.2, None),
             ("POST: ALYI: “I deeply regret my participation in the board's actions. I never intended to harm NopeAI…”",
              1.0, 6.8),
             ('♥  ♥  ♥', 6.9, None), ('IOU: 20% COMPUTE', END('a5-30-04', 1.0), None)],
         cues=[MU['ret']],
         caption="Alyi's regret pops up in his box; three hearts rise from Mas's and hang. They talk about the hearts."),
    dict(id='S7.02', side=H, set='bullpen', shot='wide', frame='WIDE · the bullpen, packed boxes (held)', room='bullpen',
         chars=[C('mas', 0.1, 'sit'), C('staff', 0.3), C('tasya', 0.52), C('staff', 0.72), C('staff', 0.88)],
         lines=['a5-30-05'], lead=2.0, tail=0.3,
         caption='Every desk has a packed box; everyone has a coat on. Tasya stands in the middle of the floor.'),
    dict(id='S7.02b', side=H, set='bullpen', shot='close', frame='SINGLE · MCU Tasya', room='bullpen',
         chars=[C('tasya', 0.64, face='smile')], lines=['a5-30-06'], tail=0.8,
         caption='"Oh, we\'d be fine." Then the record: below, above, around. The floor, ceiling and walls turn slate.'),
    dict(id='S7.03', side=H, set='bullpen', shot='close', frame='SINGLE · MCU Mas looking down', room='bullpen',
         chars=[C('mas', 0.36, 'sit', face='calm')], lines=['a5-30-07'], lead=1.1, tail=0.9,
         lx={'a5-30-07': dict(tag='O.S.', ignore_gap=True)},
         caption='Mas looks straight down at the slate floor. From under him, warmly: "Hello."'),
    dict(id='S7.05', seq=dict(sub='Tuesday night', place='the boardroom (small fires)', time='Tue Nov 21 · ~10 PM'),
         side=H, set='boardroom', shot='medium', frame='MEDIUM · Mada among the fires', room='fires', min=2.2,
         chars=[C('mada', 0.5, 'sit')], on=[('RAIL: NOV 21, 2023 · ~10 PM PT', 0.2, 2.0)],
         caption='Mada, perfectly still, in the only chair not burning. Nobody has mentioned the fires.'),
    dict(id='S7.06', side=H, set='boardroom', shot='wide', fx=['freeze'], frame='WIDE · the boardroom (freeze card)',
         room='fires', min=2.7, chars=[C('mas', 0.22), C('mada', 0.5, 'sit'), C('terb', 0.8, 'walk')],
         on=[('TERB / THE NEW CHAIR', 0.3, None), ('EXTINGUISHERS: 1', 0.3, None)], names=[('terb', 0.3)],
         sounds=[('landing_thunk', 0.0, -18), ('freeze_hit_F', 0.25, -20)],
         caption='The door bangs; Terb, extinguisher like a briefcase. Freeze. Mas pulls the pin and pockets it.'),
    dict(id='S7.06-cont', shotId='S7.06', cont=True, side=H, set='boardroom', shot='wide',
         frame='WIDE · the boardroom (held)', room='fires',
         chars=[C('mas', 0.22), C('mada', 0.5, 'sit'), C('terb', 0.78)], lines=['a5-30-08', 'a5-30-09'], lead=0.5,
         tail=0.6, caption='"Which room is on fire?" Everyone looks around. "…Ah."'),
    dict(id='S7.07', side=H, set='boardroom', shot='medium', frame='TWO-SHOT · the calm-off, Terb in depth (held)',
         room='fires', chars=[C('mas', 0.2, 'sit'), C('terb', 0.5), C('mada', 0.8, 'sit')], lines=['a5-30-10'],
         lead=0.8, end=W('a5-30-10', 'the', -0.12),
         caption='Terb reads the announcement once before it goes out, "(Chair)" about himself.'),
    dict(id='S7.07b', side=H, set='boardroom', shot='medium', frame='MEDIUM · THE OTHER YRRAL (cutaway)', room='fires',
         min=1.6, chars=[C('other-yrral', 0.5, 'sit')], on=[('YRRAL (NOT THAT YRRAL)', 0.1, None)],
         names=[('other-yrral', 0.1)], caption='On his name: a seated silhouette behind a nameplate. He nods once.'),
    dict(id='S7.07-cont', shotId='S7.07', cont=True, side=H, set='boardroom', shot='medium',
         frame='TWO-SHOT · the calm-off (held)', room='fires',
         chars=[C('mas', 0.2, 'sit'), C('terb', 0.5), C('mada', 0.8, 'sit')],
         lines=['a5-30-11', 'a5-30-12', 'a5-30-13', 'a5-30-14', 'a5-30-15', 'a5-30-16'], tail=0.35,
         cues=[MU['stop']],
         caption='"you\'re staying?" Terb answers for Mada. The review. "of what?" The music drops out. Mada.'),
    dict(id='S7.08', side=H, set='boardroom', shot='close', frame='SINGLE · MCU Mas', room='fires',
         chars=[C('mas', 0.36, 'sit')], lines=['a5-30-17'], tail=0.6,
         caption='One beat late, dry, needling the dodge back at him.'),
    dict(id='S7.09', side=H, set='boardroom', shot='medium', frame='TWO-SHOT · the calm-off, the long hold', room='fires',
         min=6.0, chars=[C('mas', 0.2, 'sit'), C('terb', 0.5), C('mada', 0.8, 'sit')],
         on=[('POST: GERG: “Returning to NopeAI & getting back to coding tonight.”', 2.8, None)],
         sounds=[('rubber_stamp_C', 2.2, -18), ('keycap_popcorn', 2.8, -22)],
         caption="The long hold. Mada's spinner stops; he nods. Terb stamps the sheet. Mas's phone lights: Gerg."),
    dict(id='S7.13', side=H, set='boardroom', shot='close', frame='OVERHEAD · the hourglass, his chat panel', room='fires',
         lines=['a5-30-18'], lead=5.6, tail=1.2, lx={'a5-30-18': dict(tag='O.S.')},
         on=[('LIVE · CHAT', 0.1, None),
             ('POST: TTEMME: “I am deeply pleased by this result, after ~72 very intense hours of work.”', 0.9, 5.3)],
         sounds=[('hourglass_shatter', END('a5-30-18', 0.3), -18)],
         caption="The last grain runs out. Ttemme's post holds and clears; then, to his chat. The glass shatters."),
    # ---------------------------------------------------------------- S8 · THE LOBBY, AND AFTER
    dict(id='S8.01', seq=dict(id='S8', side=H, place='the lobby', time='Tue Nov 21 · that night'), side=H,
         set='lobby', shot='wide', frame='LOW · the lobby sign', room='lobby', min=3.3, chars=[C('mas', 0.42)],
         on=[('DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0', 0.2, None)], sounds=[('neon_ignite', 0.1, -20)],
         caption='The sign lights on a brass stab. Mas at reception, no badge. A box of spare 0 plates.'),
    dict(id='S8.03', side=H, set='lobby', shot='wide', frame='OTS · over Mas onto the last dialog', room='lobby',
         min=3.0, fg={'id': 'mas', 'side': 'left'}, on=[('UI: OK  ·  Cancel', 0.2, None)],
         sounds=[('alert_bonk', 2.4, -18)],
         caption='The dialog once more; Cancel greys. An arrow with an empty tag clicks it. Bonk: refused.'),
    dict(id='S8.04', side=H, set='lobby', shot='close', frame='SINGLE · CU Mas', room='lobby', min=1.75,
         chars=[C('mas', face='smile')], caption='The firing\'s drawing again, with the lobby\'s tungsten behind him.'),
    dict(id='S8.05', side=H, set='lobby', shot='close', frame='INSERT · the glass on the stone', room='lobby',
         lines=['a5-30-19'], lead=0.7, tail=1.0, lx={'a5-30-19': dict(tag='O.S.')},
         caption='He sets the glass down and nudges it one pixel true. Over the hands: "okay."'),
    dict(id='S8.06', seq=dict(sub='the coda', place='the bullpen, back wall (coda)', time='Nov 22 → Nov 29, 2023'),
         side=H, set='vault', shot='close', frame='INSERT · the Q* vault', room='coda', min=2.8,
         on=[('RAIL: NOV 22, 2023', 0.2, 1.6), ('Q*', 0.1, None)], cues=[MU['coda']],
         caption="A squat steel vault stencilled Q*. It hums at the score's root, F."),
    dict(id='S8.07', side=H, set='vault', shot='medium', frame='TWO-SHOT · Mas and Gerg, the vault between', room='coda',
         chars=[C('mas', 0.18), C('orb', 0.3), C('gerg', 0.82)], lines=['a5-31-01', 'a5-31-02', 'a5-31-03'],
         lead=0.9, tail=5.0,
         on=[('DO NOT OPEN. DO NOT EXPLAIN.', 0.3, None),
             ('RAIL: (REPORTED) RESEARCHERS WROTE OF A BREAKTHROUGH CALLED Q*', END('a5-31-03', 1.3), END('a5-31-03', 4.9))],
         chars_until={'gerg': END('a5-31-03', 1.2)},
         caption='"Is it ready?" "it\'s a preview." Rack to the vault; Gerg walks out. Then the rail.'),
    dict(id='S8.08', seq=dict(sub='NOV 29', place='the bullpen', time='Wed Nov 29, 2023'), side=H, set='bullpen',
         shot='wide', frame='WIDE · the bullpen, the memo (slow drift)', room='coda',
         chars=[C('mas', 0.12, 'sit'), C('staff', 0.4), C('staff', 0.58), C('staff', 0.76)], lines=['a5-31-04'],
         lead=1.6, end=W('a5-31-04', 'i#3', -0.2), on=[('RAIL: NOV 29, 2023', 0.2, 1.5)],
         caption='Coats off, boxes being unpacked. He reads his memo to the staff who stayed.'),
    dict(id='S8.09', side=H, set='boardroom', shot='insert', frame='INSERT · the nameplate', room='coda',
         end=END('a5-31-04', 0.9), on=[('ALYI', 0.0, END('a5-31-04', 0.5))],
         sounds=[('key_tap_soft_01', 0.5, -26), ('key_tap_soft_03', 1.2, -26), ('key_tap_soft_05', 1.9, -26),
                 ('key_tap_soft_06', 2.6, -26)],
         caption='The second sentence lands on a prop: four screws, and the ALYI plate comes off the scorched chair.'),
    dict(id='S8.09b', side=H, set='bullpen', shot='insert', frame='INSERT · the shut door', room='coda', min=2.0,
         on=[('ALYI', 0.1, None)], caption='The conference-room door, shut, its nameplate still on.'),
    dict(id='S8.10', side=H, set='bullpen', shot='wide', frame="WIDE · the observer chair (the act's last image)",
         room='coda', min=4.2, on=[('MACROSOFT · OBSERVER (NON-VOTING)', 0.8, None)],
         sounds=[('bell_ding_F6', 3.2, -32)],
         caption='A MACROSOFT-blue folding chair unfolds itself by the window. It stays empty. A key ring drops.'),
]

CAST = {
    'mas': {'role': 'MAN AT THE DESK'},
    'orb': {'name': 'THE ORB', 'known': True},        # the cold open introduces it; it has no lines here
    'neleh': {'role': 'BLUEPRINT FIGURE'},
    'mada': {'role': 'SPINNER ICON'},
    'alyi': {'role': 'VOICE ON THE CALL'},
    'gerg': {'role': 'CO-FOUNDER'},
    'rima': {'role': 'WOMAN IN THE SPOTLIGHT'},
    'employee': {'name': 'EMPLOYEE', 'role': 'EMPLOYEE'},
    'staff': {'name': 'STAFF', 'role': 'STAFF', 'known': True},
    'mario': {'role': 'MAN AT THE LIGHTHOUSE'},
    'adelina': {'role': 'WOMAN AT THE LIGHTHOUSE'},
    'ttemme': {'role': 'MAN IN THE HOODIE'},
    'tasya': {'role': 'MAN AT THE DOOR'},
    'terb': {'role': 'MAN WITH THE EXTINGUISHER'},
    'quiet-vote': {'name': 'THE QUIET VOTE · camera off', 'role': 'BLACK TILE', 'blank': True},
    'other-yrral': {'name': 'THE OTHER YRRAL', 'role': 'SEATED MAN'},
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
        lx = sp.get('lx', {})
        last_end = None
        for j, lid in enumerate(sp.get('lines', [])):
            L = LINES[lid]
            ov = lx.get(lid, {})
            a_in = L['pace']['audible_in_s']
            a_out = OUT_OVERRIDE.get(lid, L['pace']['audible_out_s'])
            g = L['placement']['gap_before_s']
            follows = L['placement']['follows']
            if 'overlap' in ov:
                onset = PLACED[ov['overlap']]['file_start'] + ov['at_file']
            elif 'jcut' in ov:
                onset = start - ov['jcut']
            elif 'after' in ov:
                onset = prev_end + ov['after']
            elif j == 0:
                if follows == 'voice' and g is not None and prev_end is not None and not ov.get('ignore_gap'):
                    onset = max(start + ov.get('min_lead', 0.3), prev_end + g)
                    if start + ov.get('min_lead', 0.3) > prev_end + g + 0.05:
                        WARN.append(f'{lid}: gap after the cut grew to {onset - prev_end:.2f} s (plan {g})')
                else:
                    onset = start + ov.get('lead', sp.get('lead', 0.5))
            else:
                if g is None:
                    WARN.append(f'{lid}: no gap in the plan and no override; 1.0 s used')
                onset = prev_end + (g if g is not None else 1.0)
            end = onset + (a_out - a_in)
            PLACED[lid] = dict(on=onset, end=end, file_start=onset - a_in, a_in=a_in, a_out=a_out, spec=sp['id'])
            prev_end = end if prev_end is None or 'overlap' not in ov else max(prev_end, end)
            if 'overlap' in ov:
                prev_end = end
            last_end = end if last_end is None else max(last_end, end)
        if 'end' in sp:
            e = res(sp['end'], start)
        else:
            e = start + sp.get('min', 0.0)
            if last_end is not None:
                e = max(e, last_end + sp.get('tail', 0.6))
        e = q(e)
        if e <= start:
            WARN.append(f"{sp['id']}: end {e:.3f} <= start {start:.3f}")
            e = start + 1 / FPS
        beats.append(dict(sp=sp, start=start, end=e))
        t = e
    return beats


def main():
    beats = build()
    starts = [b['start'] for b in beats]

    def beat_of(tabs):
        k = 0
        for i, s in enumerate(starts):
            if s <= tabs + 1e-6:
                k = i
        return k

    out_beats = []
    lines_by_beat = {i: [] for i in range(len(beats))}
    for lid, p in PLACED.items():
        lines_by_beat[beat_of(p['on'])].append(lid)
    for i, b in enumerate(beats):
        sp, s0, e0 = b['sp'], b['start'], b['end']
        dur = e0 - s0
        chars = []
        cu = sp.get('chars_until', {})
        for c in sp.get('chars', []):
            c = dict(c)
            if c['id'] in cu:
                c['until'] = round(res(cu[c['id']], s0) - s0, 3)
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
                names.append({'id': nid, 'at': round(res(at, s0) - s0, 3)})
        sounds = [{'name': n, 'at': round(res(at, s0) - s0, 3), 'gain': gdb} for (n, at, gdb) in sp.get('sounds', [])]
        speak = [{'id': a, 'at': at, 'dur': d} for (a, at, d) in sp.get('speak', [])]
        ids_in_frame = {c['id'] for c in chars} | ({sp['fg']['id']} if sp.get('fg') else set())
        lines = []
        for lid in sorted(lines_by_beat[i], key=lambda k: PLACED[k]['on']):
            L, p = LINES[lid], PLACED[lid]
            who = SPEAKER[L['speaker']]
            ov = SPEC_LX.get(lid, {})
            tag = ov.get('tag')
            if tag is None:
                tag = '' if who in ids_in_frame else 'O.S.'
            words = [[w['w'], round(w['t0'] - p['a_in'], 3), round(w['t1'] - p['a_in'], 3)] for w in L.get('words', [])]
            lines.append({
                'id': lid, 'who': who, 'text': L['text'], 't': round(p['on'] - s0, 3), 'dur': round(p['end'] - p['on'], 3),
                'audio': L['file'], 'in': round(p['a_in'], 3), 'words': words, 'tag': tag,
                'cut': L['text'].rstrip().endswith('—'),
            })
        beat = {
            'id': sp['id'], 'act': 'ACT FOUR', 'kind': sp.get('kind', 'scene'), 'set': sp.get('set', 'void'),
            'style': sp.get('style', 'BASE'), 'shot': sp.get('shot', 'wide'), 'frame': sp.get('frame', ''),
            'side': sp.get('side', ''), 'room': sp.get('room', ''), 'chars': chars, 'caption': sp.get('caption', ''),
            'lines': lines, 'onscreen': onscreen, 'reelDur': round(dur, 6), 'fx': sp.get('fx', []),
            'realStart': round(ACT_START + s0, 3), 'realDur': round(dur, 3),
        }
        for k in ('seq', 'fg', 'shotId', 'cont'):
            if k in sp:
                beat[k] = sp[k]
        if names:
            beat['names'] = names
        if sounds:
            beat['sounds'] = sounds
        if speak:
            beat['speak'] = speak
        if sp.get('cues'):
            beat['cues'] = sp['cues']
        out_beats.append(beat)
    total = beats[-1]['end']
    doc = {
        'episode': 1,
        'title': 'ep1.0_research_preview.md',
        'part': 'ACT FOUR · THE BLIP, told twice · draft 5.1',
        'variant': 'stick-figure dialogue reel v5 · the recorded takes over a temp bed',
        'logline': 'Act Four for flow and dialogue: the v5 takes laid to the v5 shot plan, one beat per shot. '
                   'Stick figures and text cards stand in for the picture.',
        'dateSpan': 'Nov 17 - 29, 2023',
        'runtimeMin': 22,
        'dialogueReel': True,
        'cast': CAST,
        '_source': {'script': 'show/episodes/ep01/script.md ## ACT FOUR (draft 5.1)',
                    'plan': 'show/episodes/ep01/production/act4/edit-plan-v5.md §3.2 and §7',
                    'takes': 'audio/ep01/act4/dialogue/lines-v5.json',
                    'builder': 'audio/reel/ep01-act4-v5/build_timeline.py',
                    'act_seconds': round(total, 3)},
        'beats': out_beats,
    }
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    print(f'wrote {OUT}: {len(out_beats)} beats, {len(PLACED)} lines, act {int(total // 60)}:{total % 60:05.2f}')
    for w in WARN:
        print('  WARN', w)


SPEC_LX = {lid: ov for sp in SPEC for lid, ov in sp.get('lx', {}).items()}

if __name__ == '__main__':
    main()
