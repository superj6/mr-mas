#!/usr/bin/env python3
"""Ep1 ACT THREE ("verified: human", sc 18-23) STICK-FIGURE DIALOGUE REEL v2: the timeline builder.

  python3 audio/reel/ep01-act3-v2/build_timeline.py        -> show/reel/ep01-full/ep01-act3-v2.json
                                                             (+ a measurement report on stdout, and --report F.json)

Built 2026-09-27 by the ep1s-act3 pass for the full-episode stick reel (ep01-full-v2). Modelled on Act Four's
audio/reel/ep01-act4-v5/build_timeline.py, with the same rules:

  * one beat per shot or held setup, staged from the script's shot markers (show/episodes/ep01/script.md,
    ## ACT THREE); a setup that changes inside (a freeze, a pop, a look) is split into beats marked "cont";
  * every line is laid from its real fastrec take (audio/ep01/act3/dialogue/lines-fast-v2.json): a line's speech
    onset = the previous line's speech end + the gap in GAPS below (quick replies 0.3-0.6 s, loaded ones
    0.8-1.5 s), or the beat's lead-in when it follows picture; no overlaps (Act Three writes none);
  * posts, plates, chyrons, rails and cards are timed for read: about 0.25 s + 0.05 s a character after they land;
  * the act's music, sound and style moments ride in each beat's `cues` (the amber margin), and its SFX in each
    beat's `sounds` (SOUNDS below). The episode mixer (studio/src/reel/tools/mixer.mjs) lays the takes and one bed
    but no per-beat SFX, so act3_bed.py (beside this file) builds the act's temp stem from this JSON (room, LED ticks,
    MM-01, a THE CLOCK temp, the SFX), and the manifest plays that stem as the chapter's bed. Rebuild it after this.

Also writes measure.json (the numbers in the notes) and transcript.md (every beat and line as laid) beside it.
Notes: show/episodes/ep01/production/stick/act3-notes.md.

Clarity pass (ep1s-act3fix, 2026-09-27), from the newcomer, insider and audit reads of ep01-full-v2 (act3-notes §11):
attributions in the picture text (18.02 the label's FROM line, 19.02 MAS, 19.05 VP SIRRAH, 19.07 the signers, 19.11
MARIO'S LAB, 21.01 the manifesto, 21.06 MARIO'S MEMO); three line changes (18-02 -> 18-04, the V.O.; 20-06 "how's
the build?"; 21-05 "that one." -> 21-06 + 21-07, a question and, after the Orb's look, the answer); Tasya's laugh
now read inside her take (22-02); the crane/tings pre-lap under 23.04 held out (PRELAP = False) until Act Four's
premix carries the crane (audit #37, F5). No cuts.

The JSON is the "dialogueReel" format of studio/src/reel/schema.ts (DIALOGUE REELS). Nothing here is heard or
watched: every number is computed from the takes' own measurements.
"""
from __future__ import annotations

import json
import os
import re
import statistics
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
LINES_JSON = os.path.join(ROOT, 'audio/ep01/act3/dialogue/lines-fast-v2.json')
OUT = os.path.join(ROOT, 'show/reel/ep01-full/ep01-act3-v2.json')
FPS = 24
ACT_START = 10 * 60 + 13        # the act's printed start in the script (10:13); the episode reel keeps its own clock

LINES = {l['id']: l for l in json.load(open(LINES_JSON))}
SPEAKER = {'MAS MANALT': 'mas', 'GERG MOCKBRAN': 'gerg', 'NOLE': 'nole', 'REMUHCS': 'remuhcs', 'NEDIB': 'nedib',
           'DEEPFAKE NEDIB': 'deepfake', 'DEEPFAKE NEDIB #2': 'deepfake-2', 'TASYA': 'tasya'}
WARN: list[str] = []

# ------------------------------------------------------------------ the gaps (speech end -> next speech onset)
# Only lines that follow another voice are listed; a line that follows picture takes its beat's `lead`.
GAPS = {
    'e1-a3-20-03': (0.45, 'quick and flat: "i\'m editing it." with his eyes on the counter'),
    'e1-a3-20-04': (1.10, "loaded: the Orb's long look at him, one beat longer than it needs to (Gerg's keys fill it)"),
    'e1-a3-20-06': (0.55, 'he picks up the keys on the line: a small beat'),
    'e1-a3-20-07': (0.30, 'Gerg, cheerful, instant'),
    'e1-a3-20-08': (0.90, 'loaded: care, said as permission'),
    'e1-a3-20-09': (0.35, 'Gerg, cheerful, instant'),
    'e1-a3-21-02': (0.35, 'the copy pops on the full stop and carries on "as if it were the same sentence"'),
    'e1-a3-21-03': (0.55, 'a third pops up at the window, then speaks in turn'),
    'e1-a3-21-04': (0.80, 'the real NEDIB turns to look at them first'),
    'e1-a3-22-02': (0.45, "Tasya laughs straight into it: the laugh is read inside her take since the clarity pass"),
    'e1-a3-21-07': (1.75, "loaded: the Orb's iris flicks across the three NEDIBs (servo x3) and settles; then he agrees with it"),
    'e1-a3-19-02': (0.80, "Mas's hand goes up first; then Nole, on the monitor"),
}


# ------------------------------------------------------------------ time expressions (resolved after lines are laid)
class T:
    def __init__(self, kind, line=None, k=None, off=0.0):
        self.kind, self.line, self.k, self.off = kind, line, k, off

    def __add__(self, o):
        return T(self.kind, self.line, self.k, self.off + o)


def ON(l, off=0.0):
    return T('on', l, None, off)


def END(l, off=0.0):
    return T('end', l, None, off)


def W(l, k, off=0.0):
    """start of word k of line l (k: an index, or the word itself)"""
    return T('w0', l, k, off)


PLACED: dict[str, dict] = {}


def _word(lid, k):
    ws = LINES[lid]['words']
    if isinstance(k, int):
        return ws[k]
    hits = [w for w in ws if re.sub(r"[^\w']", '', w['w'].lower()) == k.lower()]
    if not hits:
        raise KeyError(f'{lid}: no word {k!r} in {[w["w"] for w in ws]}')
    return hits[0]


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


# ------------------------------------------------------------------ margin notes
MU = {
    'water': 'music: MM-01 Water Line (DARK ROOM), one performance across sc 18-22 · thins to one instrument under talk',
    'room': 'sound: the dark room bed: rack fans, LEDs ticking in straight eighths, the cyan key\'s faint buzz',
    'clock': 'music: THE CLOCK (MM-14 step figure) takes over on bar 1\'s downbeat, one step a beat (bar = 2.5 s)',
    'bed': 'temp bed in the stick reel: the MM-01 underscore render (sc 18-22), a labelled MM-14 pad (sc 23)',
}
DR = 'his dark room (the home room)'
MAS_DESK = 0.45        # Mas at the desk, frame left of centre, turned to the monitor at frame right
ORB_HOME = 0.35        # the faded outline on the wallpaper, at his right shoulder

# ------------------------------------------------------------------ THE SHOT PLAN (script.md ## ACT THREE, sc 18-23)
# keys: id, seq, set, shot, frame, kind, style, chars, fg, lines, lead, tail, min, end, on ((text, at, until)),
#       names ((ids, at)), speak ((id, at, dur)), lx (per-line: lead | after), caption, cues, cont, shotId, fx, real
SPEC = [
    # ================================================================ SC 18 · THE ORB ARRIVES (JUL 24, 2023)
    dict(id='18.01', seq=dict(id='SC18', side='', place=DR, time='Mon Jul 24, 2023 · night'),
         set='darkroom', shot='medium', frame='TWO-SHOT · the home room, opened close', min=4.4,
         chars=[C('mas', MAS_DESK, 'sit')],
         on=[('COINWORLD', 2.2, None), ('RAIL: JUL 24, 2023', 2.6, None)],
         cues=[MU['water'], MU['room'], 'sfx: the rack\'s drive slot whirs and slides a box out like a tray (~1.8 s)'],
         caption="From behind the rack: desk, LEDs, monitor, glass; a faded sphere outline on the wall. The slot slides out a box."),
    dict(id='18.02', set='darkroom', shot='close', frame='INSERT · ECU the shipping label',
    # clarity pass: the FROM line (what he co-founded, and what it's for) is new; min 2.4 -> 3.2 for two lines
         min=3.2,
         on=[("FROM: COINWORLD · PROOF YOU'RE HUMAN", 0.2, None), ('SHIP TO: MAS MANALT, CO-FOUNDER', 0.7, None)],
         caption='The box\'s label, legible as he reaches for the lid: who sent it, and to whom. His other company\'s device.',
         real='JUL 24, 2023 · COINWORLD launches THE ORB [V] (co-founded by him; tagline [INVENTED] for its stated purpose, '
              'proof of personhood; label wording to the facts owner)'),
    dict(id='18.03', set='darkroom', shot='medium', frame='TWO-SHOT · the Orb rises (three held steps)', min=4.9,
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', 0.62, frm=0.3)],
         on=[("THE ORB / IT'S SEEN THINGS. MOSTLY IRISES.", 2.2, None), ('SCANS: 1', 2.7, None)],
         names=[('orb', 2.2)],
         cues=['sfx: a servo whirrs; the sphere rises in three held steps (0.3-1.5 s); the lens swivels, dilates'],
         caption='He lifts the lid. A one-lens chrome sphere rises out of the foam to eye level. The lens finds him.'),
    dict(id='18.04', set='darkroom', shot='close', frame='SINGLE · MCU Mas, the scan', min=0.75,
         chars=[C('mas', 0.5, 'sit')],
         cues=['STYLE · GLYPH-MASKED next: 5 frames, inside the scan cone only (GLYPH use 1 of 2)'],
         caption='A thin cyan cone fans out from the lens across his face.'),
    dict(id='18.04g', cont=True, shotId='18.04', set='darkroom', shot='close', frame='SINGLE · MCU Mas, the scan',
         min=0.5, fx=['glyph-dissolve'], chars=[C('mas', 0.5, 'sit')],
         cues=['STYLE · GLYPH-MASKED (the stick reel dissolves the whole frame; the show masks only the cone)'],
         caption='Inside the cone his face is tokens: small monospace glyphs in the shape of a calm man.'),
    dict(id='18.05', cont=True, shotId='18.04', set='darkroom', shot='close', frame='SINGLE · MCU Mas, the toast',
         chars=[C('mas', 0.5, 'sit')], lines=['e1-a3-18-01'], lead=1.05, tail=0.5,
         on=[('verified: human', 0.25, None)],
         caption='By frame 6 the cone is gone. A toast pops beside the Orb.'),
    dict(id='18.06', set='darkroom', shot='medium', frame='TWO-SHOT · the Orb drifts to his shoulder (held)',
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', 0.58, until=1.0), C('orb', 0.44, frm=1.0, until='SETTLE'),
                C('orb', ORB_HOME, frm='SETTLE')],
         settle=END('e1-a3-18-04', 0.4),
         lines=['e1-a3-18-04', 'e1-a3-18-03'], lead=0.8, tail=1.5,
         lx={'e1-a3-18-04': dict(tag='V.O.'), 'e1-a3-18-03': dict(after=1.5)},
         cues=['music: the Water Line thins to one felt note under the V.O.',
               'sfx: CHIME ~0.35 s after "you can stay.": a soft two-note chip chime on F (never a startup chime)'],
         caption='It settles exactly into the faded outline on the wallpaper. It fits. It has always fitted.'),

    # ================================================================ SC 19 · THE MONITOR, RUN A (JUN 7 -> SEP 25)
    dict(id='19.01', seq=dict(id='SC19', side='', place=DR + ' · the monitor', time='catching up: Jun 7 - Sep 25, 2023'),
         set='darkroom', shot='medium', frame="TWO-SHOT · the Orb's iris flicks to the monitor", min=2.0,
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', ORB_HOME)],
         on=[('catching up: 7 weeks', 0.3, None)],
         cues=['the run: every item lands back on Mas and the Orb from its own angle; the rail rolls like the odometer, no slates'],
         caption="The Orb's iris flicks to the monitor. A toast: it is catching up."),
    # clarity pass: the speaker and the question he answered are new (min 3.6 -> 4.3)
    dict(id='19.02', set='screen', shot='insert', frame='POV · the monitor: ITEM 1, the tour poster', min=4.3,
         on=[('RAIL: JUN 7, 2023 · NEW DELHI', 0.1, None), ('MAS, ON $10M STARTUPS:', 0.4, None),
             ('"…totally hopeless to compete with us…"', 0.7, None), ('(HE LATER SAID: OUT OF CONTEXT)', 1.9, None)],
         real='JUN 7-8, 2023 · asked about competing on a $10M budget: "totally hopeless to compete with us" [V · trimmed]',
         caption='The tour poster from sc 16, one more city pasted on. A caption slides under his face; a line under it.'),
    dict(id='19.03', set='darkroom', shot='close', frame="MCU · in the monitor's glass (reflection)", min=1.8,
         chars=[C('mas', 0.5, 'sit'), C('orb', 0.38)],
         caption="His reflection sips. The Orb's reflected iris steps down to OUT OF CONTEXT, and stays there."),
    # items 2-4, THE HANDS: one held room frame with the monitor in it; full-bleed only for must-read text
    # stick stand-in for 2S·SCR: the 'screen' set is the monitor, Mas and the Orb stand at its left edge, and the
    # monitor carries only its in-world text; the people ON the monitor are left out of chars, because the reel draws
    # every figure on the room's floor, where they read as standing in his room (the first test render's stills)
    dict(id='19.04', set='screen', shot='wide', shotId='19.SCR', frame='2S·SCR · the hands runner (one held frame)',
         min=1.9, chars=[C('mas', 0.12, 'sit'), C('orb', 0.05)],
         on=[('RAIL: JUL 12, 2023', 0.1, None), ('[A]  [I]', 0.2, None)],
         sounds=[('synth:murmur', 0.1, -34)],
         cues=['sound: the monitor down to a murmur and a laugh from her audience'],
         caption='ITEM 2 on the monitor: SIRRAH at a lectern, mid-answer. The A and I blocks are waist-high now.'),
    dict(id='19.05', set='screen', shot='insert', frame='POV · the chyron, full-bleed to read', min=4.1,
         on=[('VP SIRRAH: "AI is kind of a fancy thing. First of all, it\'s two letters."', 0.15, None)],
         real='JUL 12, 2023 · the "two letters" remark [H · printed as the chyron, not voiced]',
         caption="The monitor's own news chyron types on under her."),
    dict(id='19.06', set='screen', shot='wide', shotId='19.SCR', frame='2S·SCR · the hands runner (held)', min=2.2,
         chars=[C('mas', 0.12, 'point'), C('orb', 0.05)], on=[('[A]  [I]', 0.0, None)],
         sounds=[('orb_servo', 0.9, -20), ('orb_servo', 1.25, -22), ('synth:copy', 1.55, -20)],
         cues=['sfx: the Orb whirrs, as if counting', 'music: THE COPY (MM-13) answers the hands on chip, a beat late'],
         caption='Mas holds up two fingers to the Orb. The Orb, which has no fingers, whirrs, as if counting.'),
    dict(id='19.07', set='whitehouse', shot='medium', frame='POV · ITEM 3, the pinky promise', min=2.8,
         chars=[C('nedib', 0.5, 'point')],
         on=[('RAIL: JUL 21, 2023', 0.1, None), ('PINKY PROMISE', 0.3, None), ('SIGNED: 7 AI COMPANIES', 0.6, None)],
         real='JUL 21, 2023 · seven companies sign voluntary commitments [P]',
         caption='NEDIB unrolls a scroll across a desk: seven small pinky-prints, one per company.'),
    dict(id='19.08', set='screen', shot='wide', shotId='19.SCR', frame='2S·SCR · the hands runner (held)', min=2.4,
         chars=[C('mas', 0.12, 'point'), C('orb', 0.05)],
         on=[('PINKY PROMISE', 0.0, None), ('RAIL: JUL 24, 2023 …', 1.3, None)],
         sounds=[('orb_servo', 0.75, -20), ('synth:copy', 1.1, -20)],
         caption='Mas raises his pinky to the screen; the Orb, with no pinky, rotates. The rail rolls past its own arrival.'),
    dict(id='19.09', set='senate', shot='wide', frame='POV · ITEM 4, the forum (hands down)', min=2.75,
         chars=[C('forum', 0.14, 'sit'), C('forum', 0.3, 'sit'), C('forum', 0.46, 'sit'), C('forum', 0.62, 'sit'),
                C('forum', 0.78, 'sit')],
         on=[('RAIL: SEP 13, 2023 · AI INSIGHT FORUM', 0.1, None),
             ('REMUHCS · ASKED THE ROOM: SHOULD GOVERNMENT REGULATE AI?', 0.3, None)],
         names=[('remuhcs', 0.3)],
         real='SEP 13, 2023 · the AI Insight Forum [V]',
         caption='A room of tiled seated figures, every one the same drawing, every hand still down. The plate asks.'),
    dict(id='19.09b', cont=True, shotId='19.09', set='senate', shot='wide', frame='POV · ITEM 4, the forum (hands up)',
         chars=[C('forum', 0.14, 'arms-up'), C('forum', 0.3, 'arms-up'), C('forum', 0.46, 'arms-up'),
                C('forum', 0.62, 'arms-up'), C('forum', 0.78, 'arms-up')],
         on=[('REMUHCS · ASKED THE ROOM: SHOULD GOVERNMENT REGULATE AI?', 0.0, None)],
         lines=['e1-a3-19-01'], lead=0.1, tail=0.45, lx={'e1-a3-19-01': dict(tag='monitor')},
         caption='A voice from off-screen, and on it every hand in the room goes up at once: one drawing, tiled.'),
    dict(id='19.10', set='screen', shot='wide', shotId='19.SCR', frame='2S·SCR · the hands runner (held)',
         chars=[C('mas', 0.12, 'arms-up'), C('orb', 0.05)],
         on=[('BILLS: 0', 0.6, None)], lines=['e1-a3-19-02'], tail=0.6,
         sounds=[('orb_servo', 0.35, -26), ('synth:copy', END('e1-a3-19-02', 0.1), -20)],
         lx={'e1-a3-19-02': dict(tag='monitor', min_lead=0.7)},
         cues=['plate egg under the hands (zero read load): BILLS: 0'],
         real='SEP 13, 2023 · "It\'s important for us to have a referee." [V]',
         caption="Mas raises his hand too, alone at his desk; the Orb rises one pixel. NOLE's hand is highest, holding his phone."),
    dict(id='19.11', set='lighthouse', shot='wide', frame="POV · ITEM 5, MISANTHROPIC's lighthouse", min=2.2,
         chars=[C('mario', 0.42, 'phone')], speak=[('mario', 0.1, 2.0)],
         on=[('RAIL: SEP 25, 2023', 0.1, None), ("MISANTHROPIC · MARIO'S LAB", 0.3, None)],
         cues=['egg in the bezel as the rail rolls (zero read): a ladder of hardcovers under one word, AUTHORS [H · SEP 19]'],
         caption='Mario on one phone, earnest, finger raised, mid-warning.'),
    dict(id='19.12', set='darkroom', shot='medium', frame='OTS · from behind the Orb', min=1.8,
         fg={'id': 'orb', 'side': 'left'}, chars=[C('mas', 0.55, 'sit')], speak=[('mario', 0.0, 1.8)],
         caption='Mas, lit cyan, watching the lighthouse on the monitor past him. He sips, and says nothing.'),
    dict(id='19.13', set='lighthouse', shot='wide', frame='POV · the second phone', min=2.5,
         chars=[C('mario', 0.42, 'phone')], speak=[('mario', 0.0, 2.5)],
         on=[('NOZAMA · UP TO $4B', 0.3, None)],
         cues=['sfx: the second phone rings (0.2 s); a rent meter blinks on above the lighthouse; CUT on its first tick'],
         real='SEP 25, 2023 · NOZAMA commits up to $4B to MISANTHROPIC [V]',
         caption='His second phone rings. Still warning, Mario answers it. Above the lighthouse, a rent meter starts to spin.'),

    # ================================================================ SC 20 · THE POST, AND A CALL (~SEP 26)
    dict(id='20.01', seq=dict(id='SC20', side='', place=DR, time='~Tue Sep 26, 2023 · night'),
         set='screen', shot='medium', frame="OTS · over Mas's shoulder onto the monitor (TIDDER)", min=3.4,
         fg={'id': 'mas', 'side': 'left'},
         on=[('RAIL: ~SEP 26, 2023', 0.1, None), ('TIDDER · reply', 0.2, None),
             ('Agi has been achieved internally', 0.6, None)],
         cues=['sfx: his keys (typed, not voiced; source casing)'],
         real='~SEP 26, 2023 · the TIDDER comment [V · casing per the circulated screenshot]',
         caption='A generic forum reply box on the parody site TIDDER. He types, in source casing.'),
    dict(id='20.02', set='darkroom', shot='medium', frame='TWO-SHOT · the LEDs stop', min=1.6,
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', ORB_HOME)],
         cues=["sound: the act's one quiet beat (< 2 s): the LEDs' tick drops out, the fans turn, the Water Line holds"],
         caption="The rack's LEDs, which have blinked in straight eighths all episode, stop. All of them. The Orb doesn't move."),
    dict(id='20.03', set='screen', shot='insert', frame='POV · he posts: the reply counter', min=2.6,
         on=[('Agi has been achieved internally', 0.0, None), ('wait. human-level?? internally??', 0.5, None)],
         cues=["sfx: the counter's whirr; his phone's ring pre-laps from the desk (~1.9 s)"],
         caption='He posts. A reply counter spins, a blur; the first reply is legible, held just long enough.'),
    dict(id='20.04', set='darkroom', shot='medium', shotId='20.CALL', frame='TWO-SHOT · the call (held; one cut, to the edit)',
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', ORB_HOME)],
         on=[('UI: GERG · speaker', 0.1, None)], names=[('gerg', 0.1)],
         lines=['e1-a3-20-02', 'e1-a3-20-03', 'e1-a3-20-04'], lead=1.1, tail=0.45,
         lx={'e1-a3-20-02': dict(tag='call'), 'e1-a3-20-04': dict(tag='call')},
         cues=['music: the Water Line thins under the call; the LEDs stay dark',
               "sound: Gerg's keys come down the line under the whole call"],
         caption='His phone lights GERG; he thumbs it to speaker without looking away. After his answer the Orb looks at him.'),
    dict(id='20.05', set='screen', shot='insert', frame="POV · the edit (the call's one cut)", min=3.1,
         on=[('"…just memeing, y\'all have no chill…"', 0.4, None)],
         cues=['sfx: the edit click; the comment rewrites itself in place, letter by letter'],
         real="~SEP 26, 2023 · the edit: \"…just memeing, y'all have no chill…\" [V]",
         caption='He clicks edit. Framed tight on the middle, the comment rewrites itself. Held to read.'),
    dict(id='20.06', set='darkroom', shot='medium', shotId='20.CALL', frame='TWO-SHOT · the call, continued',
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', ORB_HOME)],
         on=[('UI: GERG · speaker', 0.0, None)],
         lines=['e1-a3-20-05', 'e1-a3-20-06', 'e1-a3-20-07', 'e1-a3-20-08', 'e1-a3-20-09'], lead=0.7, tail=1.4,
         lx={k: dict(tag='call') for k in ('e1-a3-20-05', 'e1-a3-20-07', 'e1-a3-20-09')},
         cues=['sound: the LEDs resume on the cut, relieved; the counter keeps climbing, faster, soft at frame right',
               "sound: Gerg's keys keep going after the last line (the scene ends on Gerg and the world)"],
         caption='Back on the two-shot. The LEDs resume. Two night owls on the line; the counter keeps climbing anyway.'),

    # ================================================================ SC 21 · THE EO ARRIVES (OCT 30)
    dict(id='21.01', seq=dict(id='SC21', side='', place=DR + ' · the monitor', time='Oct 2023 · Mon Oct 30, 2023'),
         set='screen', shot='medium', frame='POV · the monitor: the rail rolls SEP -> OCT (two eggs)', min=3.9,
         on=[("OCT 16 · AN INVESTOR'S MANIFESTO", 0.2, None),
             ('"We are the apex predator; the lightning works for us."', 0.6, None)],
         cues=['egg (zero read): a small paper glowing on a desk, footnote numbers orbiting it, no text; it waits for Act Four'],
         real='OCT 16, 2023 · the manifesto: "We are the apex predator; the lightning works for us." [V] · '
              'OCT 2023 · NELEH\'s paper, no text [V]',
         caption="A lightning bolt in a frame crackles in the monitor's corner; beside it, a small paper glowing."),
    dict(id='21.02', set='whitehouse', shot='medium', shotId='21.DESK', frame='POV · the signing desk (held on the monitor)',
         chars=[C('nedib', 0.42, 'sit'), C('deepfake', 0.68, 'stand', 'smug', frm=END('e1-a3-21-01', 0.05)),
                C('deepfake-2', 0.86, 'lean', 'smug', frm=END('e1-a3-21-02', 0.15))],
         on=[('RAIL: OCT 30, 2023 · EO 14110', 0.1, None)],
         lines=['e1-a3-21-01', 'e1-a3-21-02', 'e1-a3-21-03'], lead=0.9, end=END('e1-a3-21-03', 0.25),
         lx={k: dict(tag='monitor') for k in ('e1-a3-21-01', 'e1-a3-21-02', 'e1-a3-21-03')},
         cues=['sfx: two pops (cut paper); the copies: scissor edges, glossier, tie a shade the wrong colour'],
         real='OCT 30, 2023 · EO 14110 signed [P] · the order\'s test-and-share rule, paraphrased [INVENTED wording]',
         caption='NEDIB, pen raised, says what the order does. Cut-paper copies pop up and add to his sentence.'),
    dict(id='21.03', cont=True, shotId='21.DESK', set='whitehouse', shot='medium',
         frame='POV · the signing desk: the real one turns',
         chars=[C('nedib', 0.42, 'sit', 'shocked'), C('deepfake', 0.68, 'stand', 'smug'),
                C('deepfake-2', 0.86, 'lean', 'smug')],
         on=[('RAIL: OCT 30, 2023 · EO 14110', 0.0, None), ('DEEPFAKES OF ME: SEEN 2', END('e1-a3-21-04', 0.25), None)],
         names=[(('deepfake', 'deepfake-2'), END('e1-a3-21-04', 0.25))],
         lines=['e1-a3-21-04'], end=END('e1-a3-21-04', 1.75), lx={'e1-a3-21-04': dict(tag='monitor')},
         real='OCT 30, 2023 · "When the hell did I say that?" [P]',
         caption='The real NEDIB turns to look at them, pen raised. His stat row updates in the corner.'),
    dict(id='21.04', set='screen', shot='wide', frame='2S·SCR · Mas, the Orb, three NEDIBs on the monitor (slow drift in)',
         chars=[C('mas', 0.12, 'sit'), C('orb', 0.05)], on=[('DEEPFAKES OF ME: SEEN 2', 0.0, None)],
         lines=['e1-a3-21-06', 'e1-a3-21-07'], lead=0.8, tail=0.55,
         cues=["Mas asks his witness; the Orb's iris flicks across the three NEDIBs (0.35 / 0.75 / 1.15 s after the question) "
               "and settles on the one with the pen; then he agrees"],
         caption="He asks the Orb. Its iris flicks across the three NEDIBs, one, two, three, and settles on the one with the pen."),
    dict(id='21.05', set='whitehouse', shot='medium', frame='POV · the real NEDIB signs', min=1.8,
         chars=[C('nedib', 0.42, 'sit'), C('deepfake', 0.68, 'stand', 'smile'), C('deepfake-2', 0.86, 'stand', 'smile')],
         cues=['sfx: the pen, in ink; the copies clap, and keep clapping'],
         caption='The real NEDIB signs, in ink. The deepfakes clap, and keep clapping.'),
    dict(id='21.06', set='darkroom', shot='wide', frame="WIDE · the scroll pours out of the bezel", min=3.4,
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', ORB_HOME)],
         on=[("MARIO'S MEMO", 2.0, None)],
         cues=["sound: the copies' clapping runs on, small, through the monitor's speaker"],
         caption="DELIVERY: the order's scroll pours out of the bezel, over the desk, across the floor, past a short one: MARIO'S MEMO."),
    dict(id='21.07', set='darkroom', shot='close', frame='INSERT · ECU the glass on the scroll', min=2.0,
         chars=[C('mas', 0.5, 'point')],
         cues=["sound: the clapping carries over the cut and becomes DevDay's applause (the L-cut into sc 22)"],
         caption='Mas lifts his glass and sets it down on the scroll like a paperweight. The scroll stops.'),

    # ================================================================ SC 22 · THE MONITOR, RUN B (NOV 6, DEVDAY)
    dict(id='22.01', seq=dict(id='SC22', side='', place=DR + ' · the monitor', time='Mon Nov 6, 2023 · DevDay'),
         set='stage', shot='wide', frame='POV · DevDay on the monitor',
         chars=[C('mas', 0.4, 'stand'), C('tasya', 0.72, 'walk', 'smile', frm=2.4)],
         on=[('RAIL: NOV 6, 2023 · DEVDAY', 0.1, None), ('100,000,000 / WEEK', 0.9, None)],
         lines=['e1-a3-22-01', 'e1-a3-22-02'], lead=3.3, tail=0.8,
         lx={'e1-a3-22-01': dict(tag='monitor'), 'e1-a3-22-02': dict(tag='monitor')},
         cues=["sound: the copies' clap carried over as the crowd's applause",
               "sfx: launch night's odometer clunks up through the stage floor (0.8 s) and settles, legible",
               "egg in the bezel (zero read): zAI's rafters; an egg cracks; a chrome creature hatches, already muzzled"],
         real='NOV 6, 2023 · DevDay: 100,000,000 a week [V] · "We love you guys." [V] · the question is ours [INVENTED]',
         caption='On the monitor, his keynote. The odometer climbs up through the floor. TASYA walks on, laughing, arms open.'),
    dict(id='22.02', set='darkroom', shot='close', frame='HIGH · the desk from above: his phone', min=3.0,
         on=[('How did the keynote go?', 0.2, None), ('UI: super', 1.1, None), ('UI: enthusiastic', 1.1, None),
             ('UI: thrilled', 1.1, None)],
         cues=['meter G04: the suggested-replies strip', 'sfx: his thumb taps [super] (~2.7 s)'],
         caption='His phone lights with a generic app prompt and a suggested-replies strip. His thumb taps the first.'),
    dict(id='22.03', set='darkroom', shot='medium', frame='TWO-SHOT · Mas and the Orb, the phone between them',
         chars=[C('mas', MAS_DESK, 'phone'), C('orb', ORB_HOME)],
         lines=['e1-a3-22-03'], lead=0.45, tail=1.3,
         caption="He says his tap under his breath. The Orb's iris lingers on the phone. No toast comes."),

    # ================================================================ SC 23 · THE CLOCK (ACT-OUT 2) · 4 bars of 2.5 s
    dict(id='23.01', seq=dict(id='SC23', side='', place=DR, time='Thu Nov 16 -> Fri Nov 17, 2023'),
         set='stage', shot='wide', frame="POV · bar 1: the cold open's frame on the monitor", min=2.5,
         chars=[C('mas', 0.4, 'sit'), C('panel-host', 0.62, 'sit')],
         on=[('RAIL: NOV 16, 2023', 0.1, None)],
         cues=[MU['clock'], "the hailstone bobs in his glass, the host's glass floods the table, the ovation across the street"],
         caption="On the monitor, the cold open's frame: the APEC stage. We've caught up."),
    dict(id='23.02', set='darkroom', shot='close', frame='HIGH · bar 2: the reminder', min=2.5,
         on=[('Board sync · Fri 12:00', 0.15, None)],
         cues=["the four attendee circles: a doorway, a glowing page, a spinner, a black square; the iris steps one a beat"],
         caption="The invite he accepted on that stage, now a reminder. The Orb's iris stops on the black square."),
    dict(id='23.03', set='darkroom', shot='medium', frame='TWO-SHOT · bar 3: the rail rolls to Friday', min=2.5,
         chars=[C('mas', MAS_DESK, 'sit'), C('orb', ORB_HOME)],
         on=[('RAIL: NOV 16, 2023 · 11:59 PM', 0.0, 1.0), ('RAIL: NOV 17, 2023', 1.0, None)],
         cues=["the pilot's one rail glance: Mas looks down at the interface itself, and back up; the reminder goes dark"],
         caption='The rail ticks past midnight. Mas looks down at the rail itself, then back up. The reminder goes dark.'),
    dict(id='23.04', set='void', shot='wide', frame='BLACK · bar 4 (ACT-OUT 2)', min=2.5,
         cues=["music: THE CLOCK's last step stops dead on the downbeat. CUT TO BLACK",
               "sfx pre-lap under the black (the script's crane grind and glass tings): HELD OUT of the stick reel until "
               "Act Four's premix carries the crane (audit #37); see PRELAP below"],
         caption='CUT TO BLACK. (In the show the next scene\'s sound pre-laps under it: a crane, then glass tings.)'),
]

# ------------------------------------------------------------------ SOUND (per beat): (name, at, peak dBFS)
# name: an SFX-board file (audio/sfx/wav/<name>.wav) or 'synth:<kind>' (made in act3_bed.py); at: seconds into the beat
# or a time expression. act3_bed.py lays these, plus the room, the LED ticks, MM-01 and THE CLOCK, into the temp stem
# audio/reel/ep01-act3-v2/act3-bed.wav, which the manifest plays as this chapter's bed (the mixer does no per-beat SFX).
# A tuple may carry a 4th item, a length in seconds, for the looped/long kinds (keys, flutter, claps, ring).
SOUNDS = {
    '18.01': [('synth:slot_whir', 0.9, -16), ('landing_thunk', 2.15, -20)],
    '18.03': [('paper_flutter', 0.05, -24), ('orb_servo', 0.3, -16), ('orb_servo', 0.7, -16), ('orb_servo', 1.1, -16),
              ('orb_servo', 1.7, -22)],
    '18.04': [('orb_scan_sweep', 0.0, -16)],
    '18.04g': [('glyph_blink', 0.0, -18)],
    '18.05': [('dialog_ok_click--chip', 0.25, -16)],
    '18.06': [('orb_servo', 0.3, -24), ('synth:chime', END('e1-a3-18-03', 0.35), -16)],
    '19.01': [('dialog_ok_click--chip', 0.3, -18)],
    '19.07': [('paper_flutter', 0.3, -22)],
    '19.09b': [('paper_whip', ON('e1-a3-19-01', 0.05), -20)],
    '19.11': [('synth:murmur', 0.1, -36, 1.9)],
    '19.13': [('synth:ring', 0.2, -18, 0.9), ('drip_clack', 2.38, -16)],
    '20.01': [('synth:keys', 0.5, -22, 2.4)],
    '20.03': [('post_click', 0.0, -16), ('odometer_ratchet', 0.3, -24), ('synth:ring', 0.7, -18, 2.4)],
    '20.04': [('key_tap_space', 0.55, -18), ('synth:call_keys', 0.8, -30, 'CALL')],
    '20.05': [('dialog_ok_click', 0.2, -14), ('keyboard_roll', 0.45, -22)],
    '21.01': [('synth:crackle', 0.2, -24, 0.9)],
    '21.02': [('tower_pop', END('e1-a3-21-01', 0.05), -16), ('tower_pop', END('e1-a3-21-02', 0.15), -16)],
    '21.03': [('post_click--chip', END('e1-a3-21-04', 0.25), -20)],
    '21.04': [('orb_servo', END('e1-a3-21-06', 0.35), -26), ('orb_servo', END('e1-a3-21-06', 0.75), -26),
              ('orb_servo', END('e1-a3-21-06', 1.15), -26)],
    '21.05': [('paper_whip', 0.2, -18), ('synth:claps', 0.8, -24, 'CLAPS')],
    '21.06': [('synth:flutter', 0.2, -22, 'SCROLL')],
    '21.07': [('synth:glass_set', 0.6, -14)],
    '22.01': [('synth:applause', 0.0, -22, 3.4), ('odometer_ratchet', 0.8, -18), ('landing_thunk', 1.55, -18)],
    '22.02': [('post_click--chip', 0.2, -20), ('key_tap_soft_01', 2.6, -14)],
    '23.02': [('post_click--chip', 0.15, -22)],
}
# The script's pre-lap under the act-out's black: Act Four's premix (audio/reel/ep01-act4-v5/mix.wav) has no crane, so a
# pre-lapped crane stopped dead at the cut, on the frame whose caption says a crane grinds past (audit-v2 #37, measured in
# the MP4). Held out until Act Four's bed.py gains the crane and tings at S1.01-S1.02 (audit F5); then set True and
# rebuild this JSON and act3_bed.py.
PRELAP = False
if PRELAP:
    SOUNDS['23.04'] = [('synth:crane', 0.0, -18, 2.5), ('synth:tings', 1.3, -22)]
# long sounds that end on a later beat's event (resolved in main): the call's keys run to the end of the call's last
# beat plus its tail; the copies' clapping runs until the L-cut into sc 22; the scroll's flutter stops on the glass
SOUND_UNTIL = {'CALL': ('20.06', None), 'CLAPS': ('22.01', 0.6), 'SCROLL': ('21.07', 0.6)}

CAST = {
    # set up in the cold open or Acts One-Two (as Act Two's builder does): named from the chapter's first frame, so the
    # chapter plays the same standalone and inside the episode reel
    'mas': {'role': 'MAN AT THE DESK', 'known': True},
    'orb': {'name': 'THE ORB', 'role': 'CHROME SPHERE'},
    'gerg': {'role': 'VOICE ON THE PHONE', 'known': True},
    'remuhcs': {'name': 'REMUHCS', 'role': 'SENATOR (O.S.)'},
    'nole': {'role': 'MAN WITH THE PHONE', 'known': True},
    'nedib': {'name': 'NEDIB', 'role': 'THE PRESIDENT', 'known': True},
    'deepfake': {'name': 'DEEPFAKE NEDIB', 'role': 'CUT-PAPER COPY'},
    'deepfake-2': {'name': 'DEEPFAKE NEDIB #2', 'role': 'CUT-PAPER COPY #2'},
    'tasya': {'role': 'MAN WITH OPEN ARMS', 'known': True},
    'sirrah': {'name': 'SIRRAH', 'role': 'WOMAN AT THE LECTERN', 'known': True},
    'mario': {'role': 'MAN AT THE LIGHTHOUSE', 'known': True},
    'forum': {'name': 'THE ROOM', 'known': True},
    'panel-host': {'name': 'PANEL HOST', 'known': True},
}


def q(x):
    """quantise act seconds to a frame"""
    return round(x * FPS) / FPS


def pace(lid):
    L = LINES[lid]
    return L['pace']['audible_in_s'], L['pace']['audible_out_s']


def build():
    t = 0.0
    prev_end = None
    beats = []
    for sp in SPEC:
        start = t
        lx = sp.get('lx', {})
        last_end = None
        for j, lid in enumerate(sp.get('lines', [])):
            a_in, a_out = pace(lid)
            ov = lx.get(lid, {})
            if 'after' in ov:
                onset = prev_end + ov['after']
            elif lid in GAPS and prev_end is not None:
                g = GAPS[lid][0]
                onset = prev_end + g
                if j == 0:
                    lead_min = start + ov.get('min_lead', 0.3)
                    if lead_min > onset + 0.05:
                        WARN.append(f'{lid}: gap after the cut grew to {lead_min - prev_end:.2f} s (plan {g})')
                    onset = max(onset, lead_min)
            elif j == 0:
                onset = start + ov.get('lead', sp.get('lead', 0.5))
            else:
                WARN.append(f'{lid}: no gap listed; 0.8 s used')
                onset = prev_end + 0.8
            end = onset + (a_out - a_in)
            PLACED[lid] = dict(on=onset, end=end, file_start=onset - a_in, a_in=a_in, a_out=a_out, spec=sp['id'])
            prev_end = end
            last_end = end
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


def conversations(gap_max):
    """runs of consecutive lines whose gaps are all <= gap_max: (first, last, seconds, lines)"""
    order = sorted(PLACED, key=lambda k: PLACED[k]['on'])
    runs, cur = [], [order[0]]
    for a, b in zip(order, order[1:]):
        if PLACED[b]['on'] - PLACED[a]['end'] <= gap_max:
            cur.append(b)
        else:
            runs.append(cur)
            cur = [b]
    runs.append(cur)
    out = [(r[0], r[-1], PLACED[r[-1]]['end'] - PLACED[r[0]]['on'], len(r)) for r in runs]
    return sorted(out, key=lambda x: -x[2])


def main():
    report_path = sys.argv[sys.argv.index('--report') + 1] if '--report' in sys.argv else None
    beats = build()
    starts = [b['start'] for b in beats]

    def beat_of(tabs):
        k = 0
        for i, s in enumerate(starts):
            if s <= tabs + 1e-6:
                k = i
        return k

    lines_by_beat = {i: [] for i in range(len(beats))}
    for lid, p in PLACED.items():
        lines_by_beat[beat_of(p['on'])].append(lid)
    out_beats = []
    for i, b in enumerate(beats):
        sp, s0, e0 = b['sp'], b['start'], b['end']
        dur = e0 - s0
        settle = res(sp['settle'], s0) - s0 if 'settle' in sp else None
        chars = []
        for c in sp.get('chars', []):
            c = dict(c)
            for k in ('from', 'until'):
                if c.get(k) == 'SETTLE':
                    c[k] = round(settle, 3)
                elif isinstance(c.get(k), T):
                    c[k] = round(res(c[k], s0) - s0, 3)
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
        speak = []
        for (a, at, d) in sp.get('speak', []):
            if at == 'LAUGH':          # Tasya's laugh: the silence before her line
                at = PLACED['e1-a3-22-02']['on'] - s0 - d - 0.05
            speak.append({'id': a, 'at': round(at, 3), 'dur': d})
        ids_in_frame = {c['id'] for c in chars} | ({sp['fg']['id']} if sp.get('fg') else set())
        lines = []
        for lid in sorted(lines_by_beat[i], key=lambda k: PLACED[k]['on']):
            L, p = LINES[lid], PLACED[lid]
            who = SPEAKER[L['speaker']]
            tag = SPEC_LX.get(lid, {}).get('tag')
            if tag is None:
                tag = '' if who in ids_in_frame else 'O.S.'
            words = [[w['w'], round(w['t0'] - p['a_in'], 3), round(w['t1'] - p['a_in'], 3)] for w in L.get('words', [])]
            lines.append({
                'id': lid, 'who': who, 'text': L['text'], 't': round(p['on'] - s0, 3), 'dur': round(p['end'] - p['on'], 3),
                'audio': L['file'], 'in': round(p['a_in'], 3), 'words': words, 'tag': tag,
                'cut': L['text'].rstrip().endswith('—'),
            })
            if p['end'] > e0 + 1e-3 and i + 1 < len(beats):
                WARN.append(f'{lid}: runs {p["end"] - e0:.2f} s past its beat ({sp["id"]}) into the next')
        beat = {
            'id': sp['id'], 'act': 'ACT THREE', 'kind': sp.get('kind', 'scene'), 'set': sp.get('set', 'void'),
            'style': sp.get('style', 'BASE'), 'shot': sp.get('shot', 'wide'), 'frame': sp.get('frame', ''),
            'side': '', 'room': 'dark', 'chars': chars, 'caption': sp.get('caption', ''),
            'lines': lines, 'onscreen': onscreen, 'reelDur': round(dur, 6), 'fx': sp.get('fx', []),
            'realStart': round(ACT_START + s0, 3), 'realDur': round(dur, 3),
        }
        for k in ('seq', 'fg', 'shotId', 'cont', 'real'):
            if k in sp:
                beat[k] = sp[k]
        if names:
            beat['names'] = names
        if speak:
            beat['speak'] = speak
        if sp.get('cues'):
            beat['cues'] = sp['cues']
        snd = []
        for tup in list(sp.get('sounds', [])) + list(SOUNDS.get(sp['id'], [])):
            name, at, gain = tup[:3]
            a = res(at, s0) - s0
            if a >= dur - 1e-3:
                WARN.append(f"{sp['id']}: sound {name} at {a:.2f} s starts after the beat ends ({dur:.2f} s)")
            item = {'name': name, 'at': round(a, 3), 'gain': gain}
            if len(tup) > 3:
                ln = tup[3]
                if isinstance(ln, str):          # runs until a later beat's event (SOUND_UNTIL)
                    bid, off = SOUND_UNTIL[ln]
                    tb = next(x for x in beats if x['sp']['id'] == bid)
                    end_abs = tb['end'] if off is None else tb['start'] + off
                    ln = end_abs - (s0 + a)
                item['dur'] = round(ln, 3)
            snd.append(item)
        if snd:
            beat['sounds'] = snd
        out_beats.append(beat)
    total = beats[-1]['end']
    doc = {
        'episode': 1,
        'title': 'ep1.0_research_preview.md',
        'part': 'ACT THREE · verified: human · sc 18-23',
        'variant': 'stick-figure dialogue reel v2 (full-episode pass) · fastrec takes over a temp bed',
        'logline': 'Act Three for flow and dialogue: the fastrec takes laid to a stick shot plan from the script, '
                   'one beat per shot or held setup. Stick figures and text cards stand in for the picture.',
        'dateSpan': 'Jul 24 - Nov 17, 2023',
        'runtimeMin': 22,
        'dialogueReel': True,
        'cast': CAST,
        '_source': {'script': 'show/episodes/ep01/script.md ## ACT THREE (sc 18-23), clarity pass 2026-09-27 (ep1s-act3fix)',
                    'plan': 'audio/ep01/act3/dialogue/lines-plan-v2.json',
                    'takes': 'audio/ep01/act3/dialogue/lines-fast-v2.json',
                    'builder': 'audio/reel/ep01-act3-v2/build_timeline.py',
                    'notes': 'show/episodes/ep01/production/stick/act3-notes.md',
                    'act_seconds': round(total, 3)},
        'beats': out_beats,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write('\n')

    # ---------------------------------------------------------------- measurements
    words = {lid: len(LINES[lid]['text'].split()) for lid in PLACED}
    speech = sum(p['end'] - p['on'] for p in PLACED.values())
    convs = conversations(2.5)
    convs_edit = conversations(4.5)       # the call's one cut (the edit insert, 3.1 s; 4.2 s between lines) counted inside the call
    gaps = []
    order = sorted(PLACED, key=lambda k: PLACED[k]['on'])
    for a, b2 in zip(order, order[1:]):
        gaps.append(PLACED[b2]['on'] - PLACED[a]['end'])
    shots = len({bt.get('shotId', bt['id']) for bt in out_beats if not bt.get('cont')} |
                {bt.get('shotId') for bt in out_beats if bt.get('shotId')})
    # the longest stretch with no speech (picture-only runs between lines, and before the first/after the last)
    silences = [PLACED[order[0]]['on']] + [g for g in gaps] + [total - PLACED[order[-1]]['end']]
    rep = {
        'act_seconds': round(total, 3), 'act_clock': f'{int(total // 60)}:{total % 60:05.2f}',
        'frames': round(total * FPS), 'beats': len(out_beats), 'setups': shots, 'lines': len(PLACED),
        'words': sum(words.values()), 'median_words_per_line': statistics.median(words.values()),
        'lines_3_words_or_fewer': sum(1 for v in words.values() if v <= 3),
        'speech_seconds': round(speech, 2), 'speech_share': round(speech / total, 3),
        'longest_conversation_gap_le_2.5s': {'from': convs[0][0], 'to': convs[0][1], 'seconds': round(convs[0][2], 2), 'lines': convs[0][3]},
        'longest_conversation_incl_edit_cut': {'from': convs_edit[0][0], 'to': convs_edit[0][1], 'seconds': round(convs_edit[0][2], 2), 'lines': convs_edit[0][3]},
        'gaps_between_lines_s': [round(g, 2) for g in gaps],
        'longest_stretch_without_speech_s': round(max(silences), 2),
        'beat_lengths_s': {bt['id']: bt['reelDur'] for bt in out_beats},
        'placed': {lid: {'beat': p['spec'], 'on': round(p['on'], 3), 'end': round(p['end'], 3)} for lid, p in PLACED.items()},
        'warnings': WARN,
    }
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(out_beats)} beats, {len(PLACED)} lines, '
          f'act {rep["act_clock"]} ({rep["frames"]} frames)')
    print(f'  words {rep["words"]}, median words/line {rep["median_words_per_line"]}, '
          f'<=3 words {rep["lines_3_words_or_fewer"]}/{len(PLACED)}, speech {speech:.1f} s ({100 * speech / total:.0f} %)')
    c = rep['longest_conversation_gap_le_2.5s']
    ce = rep['longest_conversation_incl_edit_cut']
    print(f'  longest conversation (gaps <= 2.5 s): {c["seconds"]} s, {c["lines"]} lines ({c["from"]} -> {c["to"]}); '
          f'with the edit cut inside: {ce["seconds"]} s, {ce["lines"]} lines')
    print(f'  longest stretch without speech: {rep["longest_stretch_without_speech_s"]} s')
    for w in WARN:
        print('  WARN', w)
    scenes = {}
    for bt in out_beats:
        k = bt['id'].split('.')[0]
        scenes[k] = round(scenes.get(k, 0) + bt['reelDur'], 3)
    rep['scene_seconds'] = scenes
    rep['sounds'] = sum(len(bt.get('sounds', [])) for bt in out_beats)
    for path in [os.path.join(HERE, 'measure.json')] + ([report_path] if report_path else []):
        with open(path, 'w') as fh:
            json.dump(rep, fh, indent=1)

    # a transcript: every beat on the act clock, every line as laid, with the gap before it
    def clk(s):
        return f'{int(s // 60)}:{s % 60:05.2f}'
    tx = ['# Ep1 Act Three stick reel v2: transcript as laid', '',
          f'Built by `audio/reel/ep01-act3-v2/build_timeline.py` from `{os.path.relpath(LINES_JSON, ROOT)}`. '
          f'Act {rep["act_clock"]} ({rep["frames"]} frames), {len(out_beats)} beats, {len(PLACED)} lines, {rep["words"]} words. '
          'Times are act seconds (the chapter starts at 0:00); "script" is the printed episode clock (10:13 + act time). '
          'Gap = the previous line\'s last word to this line\'s first word.', '']
    prev_end_t = None
    for bt, b in zip(out_beats, beats):
        s0 = b['start']
        head = f"**{bt['id']}** · {clk(s0)} (script {clk(ACT_START + s0)}) · {bt['reelDur']:.2f} s · {bt['frame']}"
        if bt.get('seq'):
            tx += ['', f"### SC {bt['seq']['id'][2:]} · {bt['seq']['place']} · {bt['seq']['time']}", '']
        tx.append(head + '  ')
        tx.append(f"  *{bt['caption']}*" + ('  ' if bt['lines'] or bt['onscreen'] else ''))
        for o in bt['onscreen']:
            tx.append(f"  - on screen at +{o['at']:.2f}: `{o['text']}`")
        for ln in bt['lines']:
            on = s0 + ln['t']
            gap = '' if prev_end_t is None else f' · gap {on - prev_end_t:.2f} s'
            L = LINES[ln['id']]
            tag = f" ({ln['tag']})" if ln['tag'] else ''
            tx.append(f"  - {clk(on)} **{ln['who'].upper()}{tag}**: {ln['text']} "
                      f"[{ln['dur']:.2f} s · {L['pace']['measured']['wpm']:.0f} wpm{gap}]")
            prev_end_t = on + ln['dur']
        tx.append('')
    with open(os.path.join(HERE, 'transcript.md'), 'w') as fh:
        fh.write('\n'.join(tx) + '\n')


SPEC_LX = {lid: ov for sp in SPEC for lid, ov in sp.get('lx', {}).items()}

if __name__ == '__main__':
    main()
