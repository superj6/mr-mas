#!/usr/bin/env python3
"""Ep1 v3.5 BASE LOCK (Kokoro timing): the v3.4 lock's builder, applying the v3.5 beat plans (script draft 8.4, the
final version: proposal-v35 with PLAN §8's choices) on top of the v3.4 timelines.

  python3 audio/reel/ep01-v35/build_timeline.py [seg ...]       (default: all six; plain python3, no venv needed)
      reads  show/episodes/ep01/production/full-v3/beat-plan-v35/<seg>.json  (the v3.5 hand-off, script-v35-notes)
             its "source" timeline (show/reel/ep01-v34/ep01-v34-<seg>.json, never edited)
             audio/ep01/v35/<seg>/lines-v35.json                           (the v3.5 takes: 33 read, 1 cut, 1 reused)
             a restored line's own `take_file` (e1-a1-9-09, e1-a3-21-02/04/06: the fast-v1/v2 takes)
             a restored beat's `restore_from` (show/reel/ep01-v33/ep01-v33-act3.json#21.03, #21.04)
      writes show/reel/ep01-v35/ep01-v35-<seg>.json                        (the lock) + ep01-v35.manifest.json
             audio/reel/ep01-v35/lock-report.json                          (per segment: lengths, frames, edits,
                                                                            deviations, the plan checks)
      prints a per-segment report, the checks and the pacing tool's output, v3.4 / v3.5.

v3.5b (SN 00000A step 2, lock-v35.md §10): the plans add Act One's usage flash (v35-22.02, 2.0 s), Act Two's racks
(v35-30A.01-.02, 5.0 s), Act Three's launch party (v35-32A.01-.03, 10.0 s) and, in Act Four's S4.02, Neleh's re-recorded
footnote-three line (v35-a4-0009) with the restored "Then we'll write step four ourselves." (a5-27-29); S4.02's clack is
placed by the plan (after the new line), so its SOUND_AT entry is gone.

What v3.5 adds (lock-v35.md §4):
  order      the plan's beat list is the v3.5 order (every v3.4 beat once; S4.07 after S4.13d, S5.03 before S5.02 are
             `moved`). A moved beat keeps its own room (the v3.4 rule gave it its new neighbour's): S5.03 is still his
             phone in the dark room, matched from Alyi's.
  restore    a new beat with `restore_from` is that lock's beat (21.03, 21.04 from v3.3), its chars cut to the plan's
             (the second copy stays un-drawn), its sounds the plan's list, its lines where they were.
  overlap    a kept line at `overlap:<id>-S` starts S before that line ends (5.04: Gerg over Rima, 0.25 s); a new line
             with `overlap: true` at start+S is placed at exactly S, over the line before it (41.04: the V.O. over
             AUHSOJ's fragment). A new line at start-S is a J-cut (41.03, 41.04: 0.3 s).
  new beats  keep the plan's est_s (its tail is the plan's): the v3.1 rule's 0.8 s hold after the last line is gone,
             since the v3.5 est_s is built from the recorded takes (head + gaps + lines + tail).
  est_s      a beat whose audio changed is fitted to the plan's est_s after its placements: a trim takes the tail first
             (to 0.3 s; an L-cut source keeps its overrun), then the air the plan doesn't place (the largest first, to
             0.3 s); growth goes at the tail. A beat with unchanged audio keeps the v3.1 rules (GROW_AT: growth inside
             the beat, where the plan's new business is).
  sounds     a plan's `sounds` adds stick SFX (at: seconds, or after:<line>+S / before:<line>-S); one named like a
             sound the beat already has moves it (15.13's gasp). `sounds_drop` names what a seam moves away: the
             timeline sound it names goes (SOUNDS_DROP_MAP), or it was a J-cut an earlier plan named, which the bed
             never laid.
  retime     onscreen.retime {text: at} moves an item; the item it replaced holds until then, and a no-line beat's
             sounds after it move with it (5.12: the counter ticks after the wait).
  passes     the plan's per-beat fields for the art, shot and score passes (scene, mode, pace, tempo, camera, picture,
             style, flashback, style_leap, style_leap_optional) are carried into each lock beat as `passes` (the
             timeline's own `style` is the stick's render style, so the plan's tier text can't go there).
  seq        new scenes open their own sequence markers (NEW_SEQ); a merged beat's marker goes to its target.

The rules of v3.1-v3.4 stand (lock-v31..v34.md §4): J-cut gap closing; negative line `t` for pre-laps (to -4 s); the
read floor; S7.13's 264 Runway frames; the tag's no-Runway state (unchanged). The tables keyed by beat id that v3.4
used are reset (their edits are in the v3.4 timelines), except 22.01's ITEM_PIN, which the v3.5 retime needs again.

How a beat plan is applied (unchanged from v3.4; the lead's sample, audio/reel/ep01-v3-sample/build_timeline.py, is
the reference):
  cut      the beat goes (a sequence marker it carried moves to the next kept beat).
  merge    the beat folds into `into`: its sounds are laid after the target's own and fitted to the target's length
           (MERGE_HEAD: at the target's head, on their own clock).
  keep     the source beat, with the edits below.
  new      a beat after `after`, from a stand-in of the plan's set, frame, room and characters.
  A beat is a row of sounds: [head] line [gap] line [gap] ... line [tail]. Every timed thing in it is anchored to the
  nearest line start or end, or to the beat's start or end, so it moves with what it belongs to (see lock-v31.md §4).
Nothing here was watched or heard: every number is measured from the files.
"""
import copy
import json
import os
import re
import statistics as st
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
BP_DIR = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v35')
OUT_DIR = os.path.join(ROOT, 'show/reel/ep01-v35')
TAKES_DIR = os.path.join(ROOT, 'audio/ep01/v35')
REPORT = os.path.join(ROOT, 'audio/reel/ep01-v35/lock-report.json')
FPS = 24
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
LABEL = {'coldopen': 'COLD', 'act1': 'A1', 'act2': 'A2', 'act3': 'A3', 'act4': 'A4', 'tag': 'TAG'}
EPS = 1e-6
VO_GAP = 0.5          # a line that follows a start+S V.O. comes at least this long after it
VO_HOLD = 0.6         # the hold after a V.O. in a beat with no lines, when the plan sets none
NEW_BEAT_HOLD = 0.8   # the hold after a new beat's last line, when its lines run past the plan's est_s
MIN_TAIL = 0.3        # a trim never leaves less than this after the last word
FIT_TOL = 0.05        # a changed beat within this of its est_s is left as placed
STICK_STYLES = ('BASE', '1-BIT', 'EARLY-WEB16', 'GLYPH', 'LEDGER', 'TERMINAL', '2-TONE')
PASS_KEYS = ('scene', 'mode', 'pace', 'tempo', 'camera', 'picture', 'style', 'flashback', 'style_leap', 'style_leap_optional')

# script-v3-notes §4's plate safety net stays off (draft 8.1's plates carry one relation word)
NO_SAFETY_NET = True
GLOBAL_REPLACE, GLOBAL_DROP = {}, set()
ADD_TEXT = {}
ADD_SKIP = set()
KEEP_PARENS = {'text? (side project)'}   # the sticky note's own words, not a planning note
DROP_TEXT = {}
CAPTION_FIX = {}
# the source caption quotes a line the plan drops, and the plan gives no caption: (seg, beat) -> [(old, new)]
CAPTION_SUB = {('act1', '9.10'): [("On the TV: GNIB's launch, a search box with a chat bubble inside it. \"Elgoog's going to hear about this "
                                   "from a search box.\"",
                                   "On the TV: THE NEW GNIB · POWERED BY NOPEAI, CHATGTP's two-dot face in GNIB's search box. Gerg, "
                                   "plainly: \"That's our model in your search engine. Are you really going after Elgoog with it?\"")]}
PLATE_SKIP = {'CHATGTP · USERS:',   # a counter, not a plate
              'CHATGTP · GNIB · DRAB · CLOD · ATEM · LEAKED'}   # v3.5b: the usage flash's line labels, not a plate
# an item's times the plan's picture sets: (seg, beat, text) -> ({key: value}, why)
ONSCREEN_SET = {('act4', 'S1.03', 'DIRE · NOVIHS · DRUH'): ({'until': 2.9}, 'the three walk off before the ring draws round the four '
                                                                          '(2.92 s); the line they read under is cut'),
                # the read floor (guardrails §7: 0.25 s + 0.05 s a character; a name card 1.2 s) over the plan's trims
                ('act4', 'S6.06', 'MADA · LAST FIRER STANDING'): ({'at': 1.35}, 'the read floor (1.55 s): the label flips 1.55 s '
                                                                               'before the cut (scaled, it had 0.9 s)'),
                ('act4', 'S8.06', 'RAIL: NOV 22, 2023'): ({'until': 1.4}, 'the read floor (1.2 s; scaled, it had 1.1 s)')}
# the stale sound / picture cues on beats v3.5 changes (the cues are the earlier passes' notes; the captions are the plan's)
CUE_SUB = {
    ('act3', '21.02'): [('sfx: two pops (cut paper); the copies:', 'sfx: one pop (cut paper); the copy:')],
    ('act3', '21.05'): [('the copies clap, and keep clapping', 'the copy claps, and keeps clapping')],
    ('act3', '21.04'): [('flicks across the three NEDIBs (0.35 / 0.75 / 1.15 s after', 'flicks across the two NEDIBs (0.35 / 0.75 s after')],
    ('act3', '22.01'): [("the copies' clap carried over", "the copy's clap carried over")],
    ('act2', '14.01'): [("(the anchor's too-smooth murmur, no words: a made formant voice in the Act Two stem), then water on pilings",
                         "(the reminder's slide), then the gavel's knock under the last half second (the Senate, J 0.5 s)")],
    ('act1', '7.02'): [(" · the phone's siren J-cuts in under the last puff", " · under the last puff his hand finds the phone")],
}
END_ANCHORED = {('S1.02', 'dialog_ok_click'), ('22.02', 'key_tap_soft_01')}
# (seg, beat, sound name, at or None) -> why: timeline sounds the v3.5 plans' pictures take away
SOUND_DROP = {
    ('act4', 'S4.07', 'DTMF', None): 'the plan: "No speakerphone, no dial." (her look only); the tones pre-lap S4.08 now (NEW_SOUNDS)',
    ('act4', 'S4.02', 'phone_buzz_step_1', None): "the v3.4 delta's row of phones lighting: the v3.5 caption ends on the first phone "
                                                    "going over, and nobody picking it up",
    ('act4', 'S4.08', 'RING', 0.2): 'the dial tones take the head (the plan: "four dial tones pre-lapped under the cut"); one '
                                    'ring stays before Mario picks up',
}
# the plans' sounds_drop, by its words: the timeline sounds each names (None: a J-cut an earlier plan named, which the
# bed never laid, so the lock has nothing to take away; the bed follows the v3.5 plan's own J-/L-cuts)
SOUNDS_DROP_MAP = {
    "the siren's J-cut (moves to the end of the first weeks, v35-10.08)": None,
    "the NopeAI lobby's revolving door pre-lap (moves to the end of the 2018 flashback)": ['revolving_door'],
    "the Build's chip line J-cut (moves to the vision post's Publish click)": None,
    "the pause letter's toast pop J-cut (moves to the end of sc 22)": None,
    "the solder's sparks": ['synth:crackle'],
    "the tour's first stamp thunk (moves to the gavel at the end of sc 28)": None,
}
# a dropped sound that moves to a later beat: (seg, from beat, name) -> (to beat, at: < 0 counts from its end, why)
SOUND_MOVE = {('act1', '8.06', 'revolving_door'): ('v35-13.06', -0.5, "the pre-lap moves to the end of the 2018 flashback "
                                                                    "(the plan's L 0.5 s into the lobby, 9.01)")}
# the v3.5 plans' sound notes the stick had no SFX for (the stems pass does the real ones); at < 0 counts from the end
NEW_SOUNDS = {
    'v35-10.08': [{'name': 'siren_whoop_F', 'at': -0.3, 'gain': -30}],   # seam 3: the siren through his phone, J 0.3 s
    'S4.08': [{'name': 'DTMF', 'at': 0.0, 'gain': -26, 'dur': 0.6}],     # "four dial tones pre-lapped under the cut"
}
# post-build times for a sound the plan's caption places (seconds into the beat)
# (v3.5b, SN 00000A: S4.02's clack is the plan's own now, after:v35-a4-0009+0.48, with the re-recorded line and the
#  restored step-four line; its old fixed 8.4 s is gone)
SOUND_AT = {('act4', 'S6.06', 'freeze_hit_F'): (1.35, "the dead stop stays on Mada's label (moved for its read floor)")}
# new scenes' sequence markers (the reel's margin slate)
NEW_SEQ = {
    'v35-10.01': {'id': '7A', 'side': '', 'place': 'the first weeks: phones everywhere', 'time': 'Dec 2022'},
    'v35-12.01': {'id': '8A', 'side': '', 'place': 'the bullpen, dark: his laptop', 'time': 'Dec 2022 · 3 AM'},
    'v35-13.01': {'id': '8B', 'side': '', 'place': "NopeAI's first office, night (a memory)", 'time': 'Jun 2018'},
    'v35-18.01': {'id': '10A', 'side': '', 'place': 'the bullpen window', 'time': 'Feb 2023 · that evening'},
    'v35-19.01': {'id': '10B', 'side': '', 'place': 'his end desk: the vision post', 'time': 'Fri Feb 24, 2023 · night'},
    'v35-22.01': {'id': '11A', 'side': '', 'place': "the bullpen's wall TV: Elgoog's waitlist", 'time': 'Tue Mar 21, 2023'},
    'v35-28.01': {'id': '15A', 'side': '', 'place': "NopeAI's first office, by day (a memory)", 'time': 'Mar 2019'},
    'v35-28.05': {'sub': 'the hearing', 'side': '', 'place': 'Senate Judiciary: the hearing room', 'time': 'Tue May 16, 2023'},
    'v35-41.01': {'id': 'S1A', 'side': '', 'place': 'the suite: the war room', 'time': 'Fri Nov 17 · afternoon into night'},
    'v35-42.01': {'id': 'S1B', 'side': '', 'place': 'a small plane', 'time': 'Sat Nov 18 · day'},
    'v35-43.01': {'sub': 'TPOOL', 'side': '', 'place': 'TPOOL (a memory, 240p)', 'time': '2005-08'},
    'S2.05': {'sub': 'the desk', 'side': '', 'place': 'his dark room', 'time': 'Sat Nov 18 · night'},
    'v35-49A.01': {'id': 'S4A', 'side': '', 'place': 'the bullpen at night: Alyi alone', 'time': 'Mon Nov 20 · ~2:06 AM'},
    # v3.5b (SN 00000A step 2): the launch party (the flash and the racks continue their scenes' markers)
    'v35-32A.01': {'id': '19A', 'side': '', 'place': "NopeAI's bullpen, evening: the launch party", 'time': 'Mon Sep 25, 2023'},
}
SEQ_MOVE = {'S5.02': 'S5.03'}   # the 2 AM scene opens on the hearts now
SEQ_FIX = {'16': {'place': 'the regulate-me tour: the stamps, the lectern, the posts', 'time': 'May 18 - 26, 2023'},
           'S2': {'time': 'Sat Nov 18 · night'}}
MERGE_HEAD = {'S4.13'}   # S4.12's slate steps and door open S4.13 (the plan), on their own clock
CAST_ADD = {'act2': {'gerg': {'role': 'MAN WITH THE CLOUD BILL'}, 'alyi': {'role': 'MAN AT THE WHITEBOARD'},
                     'mada': {'role': 'MAN WITH THE SPINNER'},
                     'quiet-vote': {'name': 'THE QUIET VOTE', 'role': 'A CHAIR TURNED AWAY', 'blank': True}},
            'act4': {'auhsoj': {'name': 'AUHSOJ', 'role': 'INVESTOR ON THE CALL'}}}
# v3.5b (SN 00000A step 2): the racks' staff (Act Two) and the launch party's staff and Alyi (Act Three)
CAST_ADD['act2']['staff'] = {'name': 'STAFF', 'role': 'STAFF', 'known': True}
CAST_ADD['act3'] = {'staff': {'name': 'STAFF', 'role': 'STAFF', 'known': True}, 'alyi': {'role': 'MAN WITH THE TOAST'}}
# characters no longer drawn: (seg) -> {id: why}
UNDRAWN = {'act3': {'deepfake-2': 'the second copy stays un-drawn (notes §3, 21.02: one copy)'},
           'act2': {'clone': "the Senate's cloned voice is cut (SN 00000, notes §3): the clone isn't drawn at the dais"}}
CAST_DROP = {'act2': {'clone'}}
HEAD_GROW = {'S2.05'}   # "the eye-light steps onto mark 3 and his thumb" first: the added half second opens the beat
HEAD_CUT = set()
TAIL_CUT = set()
# growth inside an unchanged beat, where the plan's new business is: (seg, beat) -> (at s, why). Items and lines from
# `at` on move by the growth; an item that ends at `at` holds on (its until moves).
GROW_AT = {
    ('act4', 'v31-S3.00p'): (1.0, "the desk's two props read before her line (the plan: legible a beat each; she squares them)"),
    ('act4', 'v32-S1.13'): (1.6, 'the first sentence typed, deleted letter by letter, typed again, before the post goes up'),
    ('act4', 'S7.01'): (7.245, "Alyi's post in full, held about 1.5 s longer (the plan)"),
}
TRIM_HINTS = {'S4.08': {'head': 1.0, 'tail': 0.81},   # 12A's "shorter holds": the ring-in and the dial tone, 0.5 s each
              'S6.04': {'head': 0.2, 'tail': 0.08}}  # the quicker board exit: the avalanche takes her question ("char—")
# beats the plan trims whose air isn't there: (seg, beat) -> why (the beat keeps its length; reported as a deviation)
FIT_SKIP = {('act4', 'S3.00a'): "the plan's -1.0 s is \"the join's pre-roll (the 11:59 wait)\", but Alyi's first word is at "
                                "0.3 s (v3.1 trimmed the head to 0.3); every gap is weighted and the held beat after "
                                "\"Do you have any questions?\" stays (notes §6: weighted, untouched), so there is nothing "
                                "the plan allows to cut: the beat keeps 15.2 s (+1.0 s on est_s)"}
EST_HOLD = {}
EXACT_FRAMES = {('act4', 'S7.13'): 264}   # the Runway hourglass (the lead); the tag has no Runway frames since v3.4
PLAN_PATCH = {}
ONSCREEN_AT = {}
# an existing item re-timed by the plan's picture: (seg, beat, text prefix) -> (at, why)
ONSCREEN_AT_PREFIX = {('act4', 'v32-S1.13', 'MAS (post):'): (3.2, 'the card types from the retyped sentence on and posts on the '
                                                                  'click (6.6 s); 4.8 s to read, as in v3.4')}
ONSCREEN_HOLD = {}
ONSCREEN_ANCHOR = {}
CHARS_SET = {}
ITEM_SHIFT = {}
ONSCREEN_DROP_FIX = {}
# items the V.O.'s new start would drag along with the line they're anchored to; they belong to the shot
ITEM_PIN = {
    ('act3', '22.01'): (['RAIL: NOV 6, 2023 · DEVDAY', '100,000,000 / WEEK'], ['synth:applause', 'odometer_ratchet', 'landing_thunk'], [],
                        'the V.O. now waits for the counter to land (4.37 s) and be read: the rail, the counter, the applause, '
                        'the odometer and its landing stay at the stage\'s opening'),
}
ONSCREEN_OPEN = {}
NAME_DROP = {}
# the plan's on-screen adds, timed where its caption puts them: (seg, beat, text) -> (at, until). `at` may be
# 'line:<id>+S' (on that line's start). Everything else the plan adds is set dressing from 0.2 s.
_P1 = 'Our mission is to ensure that artificial general intelligence—AI systems that are generally smarter than humans—benefits all of humanity.'
_P2 = '…a gradual transition to a world with AGI is better than a sudden one.'
_P3 = '…perhaps the most important—and hopeful, and scary—project in human history.'
ADD_TIME = {
    ('act1', '7.02', 'INVIDIA'): (1.2, 3.7),     # style_leap: the macro from 1.2 s for 2.5 s carries the logo
    ('act1', 'v35-10.01', 'write my essay on the fall of rome. 500 words. make it sound like me'): (0.4, None),
    ('act1', 'v35-10.03', 'And it came to pass…'): (1.2, None),
    ('act1', 'v35-12.01', 'CHATGTP IS AT CAPACITY RIGHT NOW'): (0.2, 1.7),
    ('act1', 'v35-12.01', 'asked it how to say sorry to my sister. it helped.'): (1.7, None),   # its read floor, 2.75 s
    ('act1', 'v35-12.03', 'PLAYED AGAINST ITSELF TODAY: 180 YEARS'): (0.3, None),
    ('act1', 'v35-19.01', 'Planning for AGI and beyond'): (0.8, None),
    # the three passages share the 13.7 s by their read floors (7.1 / 3.8 / 4.15 s, ×0.91)
    ('act1', 'v35-19.02', _P1): (0.3, 6.76), ('act1', 'v35-19.02', _P2): (6.76, 10.22), ('act1', 'v35-19.02', _P3): (10.22, None),
    ('act1', 'v35-19.04', 'ATEM · A NEW MODEL · FOR RESEARCHERS ONLY'): (1.2, None),
    ('act1', '11.01', 'RAIL: MAR 3, 2023'): (1.617, None),   # where the MAR 14 rail was
    ('act1', '11.04', 'SIMULATED BAR EXAM · TOP 10%'): (5.2, None),   # after the click (4.76 s): the website, then the card
    ('act1', '12.02', 'ZAI CORP. · ARTICLES OF INCORPORATION · NEVADA'): (0.6, None),
    ('act1', '12.02', 'FILED'): (0.9, None),   # the first stamp
    ('act2', '14.01', 'SENATE JUDICIARY · MAY 16 · TESTIFY'): (1.6, None),
    ('act2', '14.01', 'PLEASE REG—'): (3.4, None),
    ('act2', 'v35-28.02', 'CAPPED PROFIT'): ('line:v35-a2-0003+0.2', None),
    ('act2', 'v35-28.02', '100x'): ('line:v35-a2-0005+0.1', None),
    ('act2', 'v35-28.03', 'CEO · EQUITY: 0'): ('line:v35-a2-0009+0.0', None),
    ('act2', 'v35-29.01', 'RIO DE JANEIRO'): (0.3, None), ('act2', 'v35-29.01', 'LAGOS'): (0.8, None),
    ('act2', 'v35-29.01', 'MADRID'): (1.3, None), ('act2', 'v35-29.01', 'WARSAW'): (1.8, None),
    ('act2', 'v35-29.01', 'PARIS'): (2.3, None), ('act2', 'v35-29.01', 'LONDON'): (2.8, None),
    ('act2', 'v35-29.01', 'MUNICH'): (3.3, None),   # one a beat, on the stamps
    ('act2', '17.01', 'MAS MANALT · MARIO · SIMED · NOTNIH · OIGNEB'): (1.56, None),   # with the first signer's swap
    ('act2', '17.01', '+ HUNDREDS MORE'): (3.4, None),
    ('act4', 'v32-S1.13', 'i loved my time at nopeai.'): (0.6, 3.2),   # typed, deleted letter by letter
    ('act4', 'v32-S1.13', '1:46 PM'): (6.6, None),
    ('act4', 'v35-41.01', 'GERG'): (0.3, None), ('act4', 'v35-41.01', 'TASYA · MACROSOFT'): (0.55, None),
    ('act4', 'v35-41.01', 'AUHSOJ'): (0.8, None), ('act4', 'v35-41.01', 'THE FIRST CHECK'): (1.05, None),
    ('act4', 'v35-41.01', 'FOUNDER MODE'): (1.3, None), ('act4', 'v35-41.01', 'NOR'): (1.55, None),   # tile over tile (NOR: 1.36 s)
    ('act4', 'v35-42.01', '1. GERG'): (1.0, None),
    ('act4', 'v35-43.02', 'CEO'): (1.0, None),
    ('act4', 'v31-S3.00p', 'CHATGTP launched on wednesday. today it crossed 1 million users!'): (0.5, None),
    ('act4', 'v31-S3.00p', '…frantic corner-cutting…'): (1.2, None),
    ('act4', 'S4.13', 'RAIL: NOV 19 · ~11:53 PM PT'): (0.2, 1.9),   # as in the merged S4.12
    ('act4', 'S5.03', 'RAIL: NOV 20, 2023 · ~2:06 AM PT'): (0.0, 1.6),   # it rides the match from 49A
}
TARGET_MAX = 23 * 60
TRIMS = []
APPLIED_TRIMS = []


def r3(x):
    return round(float(x) + 0.0, 3)


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


def load_takes():
    takes = {}
    for seg in SEGS:
        f = os.path.join(TAKES_DIR, seg, 'lines-v35.json')
        if os.path.exists(f):
            for r in jl(f):
                takes[r['id']] = r
    return takes


def take_line(r, lid, who, text, t, tag):
    """a take as a timeline line (the dialogue-reel line format; the sample's vo_line)"""
    a_in, a_out = r['pace']['audible_in_s'], r['pace']['audible_out_s']
    return {'id': lid, 'who': who, 'text': text, 't': r3(t), 'dur': r3(a_out - a_in), 'audio': r['file'], 'in': a_in,
            'words': [[w['w'], r3(w['t0'] - a_in), r3(w['t1'] - a_in)] for w in r['words']], 'tag': tag, 'cut': False}


def strip_note(s):
    s = ADD_TEXT.get(s, s)
    if s in KEEP_PARENS:
        return s
    for _ in range(3):   # trailing source tags "[H · …]" / "[V · …]" and planning notes "(…)", in either order
        s = re.sub(r'\s*\[(?:H|V|P|K|V/K|P✓|INVENTED)\b[^\]]*\]\s*$', '', s)
        s = re.sub(r'\s*\([^()]*\)\s*$', '', s).strip()
    return s.strip()


def note_times(s):
    """'(… 0.2-1.8 s …)' in a planning note -> (0.2, 1.8)"""
    m = re.search(r'\(([^()]*?)(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?) s', s)
    return (float(m.group(2)), float(m.group(3))) if m else None


def clean_line_text(t):
    """subtitles: spoken lines show without quotation marks or print ellipses at their ends (the plans' _about)"""
    t = t.replace('"', '').replace('“', '').replace('”', '').strip()
    t = re.sub(r'^…\s*', '', t)
    return t


def frame_of(frame):
    f = (frame or '').upper()
    for k, v in (('ECU', 'insert'), ('INSERT', 'insert'), ('POV', 'insert'), ('SCR', 'insert'), ('GFX', 'wide'), ('MCU', 'close'),
                 ('TWO-SHOT', 'medium'), ('2S', 'medium'), ('OTS', 'medium'), ('HIGH', 'wide'), ('WIDE', 'wide'), ('W ', 'wide'),
                 ('QUICK-CUT', 'medium'), ('M ', 'medium')):
        if f.startswith(k) or f' {k}' in f[:12]:
            return v
    return 'medium'


def norm_word(w):
    return re.sub(r"('s|’s)$", '', re.sub(r'[^\w\'’]', '', w.lower()))


def parse_at(at):
    """a placement -> ('start', S) | ('after', ref, gap) (overlap:<id>-S is after <id> with gap -S)"""
    if at.startswith('start'):
        return ('start', float(at[5:]))
    m = re.match(r'after:(.+)\+(-?[\d.]+)$', at)
    if m:
        return ('after', m.group(1), float(m.group(2)))
    m = re.match(r'overlap:(.+)-([\d.]+)$', at)
    if m:
        return ('after', m.group(1), -float(m.group(2)))
    raise ValueError(at)


def plate_id(text):
    """the character a plate names: its first part ('LAHTNEMULB · CHAIRMAN', 'TTEMME / INTERIM CEO, …')"""
    return re.split(r'\s+[·/]\s+', text.strip().lower())[0]


class Seg:
    """one segment: the plan, the source timeline, and the report"""

    def __init__(self, seg, takes):
        self.seg = seg
        self.plan = jl(os.path.join(BP_DIR, f'{seg}.json'))
        self.trims = []
        self.patched = []
        self.src_path = self.plan['source']
        self.src = jl(self.src_path)
        self.S = {b['id']: b for b in self.src['beats']}
        self.v33 = {}
        p33 = os.path.join(ROOT, f'show/reel/ep01-v33/ep01-v33-{seg}.json')
        if os.path.exists(p33):
            self.v33 = {b['id']: b for b in jl(p33)['beats']}
        self.takes = takes
        self.edits, self.dev, self.safety = [], [], []
        self.carry = {}   # SOUND_MOVE: sounds waiting for a later beat
        self.restored_prev = {}   # restored beat id -> its predecessor in the lock it came from
        self.cast = set((self.src.get('cast') or {}).keys()) | set(CAST_ADD.get(seg, {})) | {
            'mas', 'gerg', 'rima', 'alyi', 'mario', 'radnus', 'tasya', 'nole', 'neleh', 'mada', 'kram', 'sirrah', 'nedib', 'sydney'}

    def note(self, bid, what):
        self.edits.append({'beat': bid, 'what': what})

    def deviate(self, bid, what):
        self.dev.append({'beat': bid, 'what': what})

    # ------------------------------------------------------------------ on-screen text
    def onscreen(self, b, pb, drops_at):
        o = pb.get('onscreen') or {}
        rep, drop, add = dict(o.get('replace') or {}), list(o.get('drop') or []), list(o.get('add') or [])
        used = set()
        out = []
        texts = [it['text'] if isinstance(it, dict) else it for it in b.get('onscreen', [])]
        drop = [DROP_TEXT.get(k, k) for k in drop]
        for k in list(drop):   # a drop written with a planning note: its text without the note
            if k not in texts and not any(k in t_ for t_ in texts) and strip_note(k) != k:
                drop[drop.index(k)] = strip_note(k)
        for k in list(rep):
            if k not in texts and not any(k in t_ for t_ in texts) and strip_note(k) != k:
                rep[strip_note(k)] = rep.pop(k)
        exact = {k for k in drop if k in texts}
        for it in b.get('onscreen', []):
            d = it if isinstance(it, dict) else {'text': it, 'at': None, 'until': None}
            t = d['text']
            gone = False
            for k in drop:
                if k.startswith('side badge'):
                    continue
                if t == k:
                    gone = True
                    used.add(k)
                elif k not in exact and k in t:
                    t = t.replace(k, '').strip(' ·—–-')
                    used.add(k)
            if gone:
                if d.get('at') is not None:
                    drops_at.append((d['at'], d['text']))
                self.note(pb['id'], f'on-screen drop: "{d["text"][:70]}"')
                continue
            for k, v in rep.items():
                v = strip_note(v)
                if t == k:
                    t = v
                    used.add(k)
                elif k in t and k != v:
                    t = t.replace(k, v)
                    used.add(k)
            if t != d['text']:
                self.note(pb['id'], f'on-screen replace: "{d["text"][:50]}" -> "{t[:70]}"')
            if not t:
                continue
            if isinstance(it, dict):
                out.append(dict(d, text=t))
            else:
                out.append(t)
        for k in list(rep) + [k for k in drop if not k.startswith('side badge')]:
            if k not in used and not (k in rep and strip_note(rep[k]) == k):
                self.deviate(b['id'], f'on-screen "{k}" is not in the source beat (nothing to {"replace" if k in rep else "drop"})')
        have = {(x['text'] if isinstance(x, dict) else x) for x in out}
        v33 = self.v33.get(pb['id'], {})
        for a in add:
            if a in ADD_SKIP:
                continue
            t = strip_note(a)
            if not t:
                self.note(pb['id'], f'on-screen add "{a}" is a note for the art pass only (nothing to show in the stick)')
                continue
            if t in have:
                self.note(pb['id'], f'on-screen add "{t[:60]}" is already in the beat (kept as it was)')
                continue
            old = next((x for x in v33.get('onscreen', []) if isinstance(x, dict) and x['text'] == t), None)
            if old is not None and pb['id'] not in self.restored_prev:
                # restored text (13.12, 13.13): the v3.3 lock's own item, with its own times
                out.append({'text': t, 'at': old.get('at'), 'until': old.get('until'), '_add': True})
                self.note(pb['id'], f'on-screen add: "{t}" restored from the v3.3 lock ({old.get("at")}-{old.get("until")} s)')
                continue
            tt = note_times(a)
            spec = ADD_TIME.get((self.seg, pb['id'], t))
            if spec:
                at, until = spec
            elif tt:
                at, until = tt
            else:
                at, until = 0.2, None   # set dressing: from the shot's start
            d = {'text': t, 'at': at, 'until': until, '_add': True}
            out.append(d)
            self.note(pb['id'], f'on-screen add: "{t[:70]}"' + (f' ({at}-{until})' if spec or tt else ''))
        b['onscreen'] = out

    def drop_coincident(self, b, drops_at, bid):
        """a name reveal that starts with a dropped plate goes with it; so does a sound that starts with dropped in-world
        text, but not one that starts with a dropped device overlay (UI:, RAIL: ...)"""
        device = re.compile(r'^\s*(UI|RAIL|TICKER|BUTTON|CAPTION|LOWER THIRD)\s*:', re.I)
        for key, what in (('sounds', 'sound'), ('names', 'name reveal')):
            ats = [a for a, t in drops_at if key == 'names' or not device.match(t)]
            kept_at = [o.get('at') or 0.0 for o in b.get('onscreen', []) if isinstance(o, dict)]
            ats = [a for a in ats if not any(abs(a - k_) < 0.02 for k_ in kept_at)]
            gone = [x for x in b.get(key, []) if any(abs(x['at'] - a) < 0.02 for a in ats)]
            if gone:
                b[key] = [x for x in b[key] if x not in gone]
                self.note(bid, f'{what}(s) {", ".join(x.get("name") or x.get("id") for x in gone)} dropped with the on-screen item '
                               f'they start on')

    def resolve_adds(self, b):
        """on-screen adds timed on a line ('line:<id>+S') land on it; the rest are clamped inside the beat"""
        for o in b.get('onscreen', []):
            if not isinstance(o, dict) or not o.get('_add'):
                continue
            if isinstance(o.get('at'), str):
                m = re.match(r'line:(.+?)([+-][\d.]+)$', o['at'])
                ln = next((x for x in b.get('lines', []) if x['id'] == m.group(1)), None) if m else None
                o['at'] = r3(ln['t'] + float(m.group(2))) if ln else 0.2
            o['at'] = r3(min(o['at'], max(0.0, b['reelDur'] - 0.5)))
            if o.get('until') is not None:
                o['until'] = r3(min(o['until'], b['reelDur']))

    # ------------------------------------------------------------------ one kept beat
    def build_keep(self, pb, merged):
        sb = self.S[pb['id']]
        b = copy.deepcopy(sb)
        for k in ('realStart', 'realDur', 'real'):
            b.pop(k, None)
        if b.get('side'):
            self.note(pb['id'], f'side badge "{b["side"]}" removed')
        b['side'] = ''
        if isinstance(b.get('seq'), dict):
            b['seq']['side'] = ''
        dur0 = sb['reelDur']
        drops_at = []
        self.onscreen(b, pb, drops_at)
        self.drop_coincident(b, drops_at, pb['id'])
        for sd in list(b.get('sounds', [])):
            why = SOUND_DROP.get((self.seg, pb['id'], sd['name'], None)) or SOUND_DROP.get((self.seg, pb['id'], sd['name'], sd['at']))
            if why:
                b['sounds'].remove(sd)
                self.note(pb['id'], f'sound {sd["name"]} at {sd["at"]} dropped: {why}')
        for txt in pb.get('sounds_drop', []):
            names = SOUNDS_DROP_MAP.get(txt, 'unknown')
            if names == 'unknown':
                self.deviate(pb['id'], f'sounds_drop "{txt}": no timeline sound matched (kept everything)')
                continue
            if names is None:
                self.note(pb['id'], f'sounds_drop "{txt}": a J-cut an earlier plan named, which the bed never laid; nothing '
                                    f'in the lock to take away (the bed follows the v3.5 J-/L-cuts)')
                continue
            for sd in [x for x in b.get('sounds', []) if x['name'] in names]:
                b['sounds'].remove(sd)
                mv = SOUND_MOVE.get((self.seg, pb['id'], sd['name']))
                if mv:
                    self.carry.setdefault(mv[0], []).append((dict(sd), mv[1], f'from {pb["id"]}: {mv[2]}'))
                self.note(pb['id'], f'sound {sd["name"]} at {sd["at"]} dropped (sounds_drop: "{txt}")'
                                    + (f'; it moves to {mv[0]}' if mv else ''))

        # the plan's line entries
        plan_lines = pb.get('lines', [])
        dropped = {l['id']: l for l in plan_lines if l.get('keep') is False}
        new = [l for l in plan_lines if l.get('new') or l.get('restored')]
        moved = [l for l in plan_lines if l.get('moved_from')]
        vos = pb.get('vo', [])
        jcuts = [j for j in pb.get('jcut', []) if 'line' in j]
        listed = {l['id'] for l in plan_lines}
        for l in sb.get('lines', []):
            if l['id'] not in listed:
                self.deviate(pb['id'], f'source line {l["id"]} is not listed in the plan: kept')
        repl = {}
        for lid, l in dropped.items():
            for n in new:
                if lid in (n.get('tag') or '') or n['id'] in (l.get('why') or '') or n.get('cut_from') == lid:
                    repl[lid] = n['id']
            for v in vos:
                if v['id'] in (l.get('why') or ''):
                    repl.setdefault(lid, v['id'])
        vo_ids = {v['id'] for v in vos}

        mtl = dur0
        merged_sounds = []
        for mb in merged:
            ms = self.S[mb['id']]
            head = pb['id'] in MERGE_HEAD
            for sd in ms.get('sounds', []):
                merged_sounds.append(dict(sd, at=r3(sd['at'] if head else mtl + sd['at']), _merged=mb['id'], _mdur=ms['reelDur'],
                                          _mat=sd['at'], _head=head))
            mtl += ms['reelDur']
            self.note(pb['id'], f'{mb["id"]} merged in: {len(ms.get("sounds", []))} sound(s)'
                                + (' at the head, on their own clock (MERGE_HEAD)' if head else ''))

        audio_changed = bool(dropped or new or moved or vos or any(l.get('at') for l in plan_lines))
        src_lines = sorted(copy.deepcopy(sb.get('lines', [])), key=lambda l: l['t'])

        if not src_lines and not new and not moved:
            return self.build_noline(pb, b, sb, dur0, mtl, merged_sounds, vos, dropped)

        for l in src_lines:
            r = self.takes.get(l['id'])
            if r and r.get('restaged'):
                l['audio'] = r['file']
                l['tag'] = ''
                self.note(pb['id'], f'line {l["id"]}: re-staged ({r["file"]})')
        # ---------------------------------------------------------- the row of sounds
        slots = []
        prev_e = None
        for l in src_lines:
            s, e = l['t'], l['t'] + l['dur']
            slots.append({'id': l['id'], 'line': copy.deepcopy(l), 'gap': s if prev_e is None else s - prev_e, 'len': l['dur'],
                          'old_s': s, 'old_e': e, 'new': False})
            prev_e = max(e, prev_e) if prev_e is not None else e
        last_e = max((s['old_e'] for s in slots), default=0.0)
        end_mode = ('lcut', dur0 - slots[-1]['old_s']) if last_e > dur0 + EPS else ('tail', dur0 - last_e)

        refs = [('start', 0.0)] + [r for i, s in enumerate(slots) for r in ((('s', i), s['old_s']), (('e', i), s['old_e']))] + [('end', dur0)]

        def anchor(x):
            if x is None:
                return None
            if not slots:
                return ('start', x)
            for i, s in enumerate(slots):
                if s['old_s'] - EPS <= x <= s['old_e'] + EPS:
                    return (('s', i), x - s['old_s'])
            best = min(refs, key=lambda r: (abs(x - r[1]), r[1]))
            return (best[0], x - best[1])

        els = []
        for d in b['onscreen']:
            if isinstance(d, dict) and not d.get('_add'):
                els.append((d, 'at', anchor(d.get('at'))))
                if d.get('until') is not None:
                    els.append((d, 'until', anchor(d['until'])))
        for sd in b.get('sounds', []):
            els.append((sd, 'at', anchor(sd['at'])))
        for n in b.get('names', []):
            els.append((n, 'at', anchor(n['at'])))
        for n in b.get('speak', []):
            els.append((n, 'at', anchor(n['at'])))
        for c in b.get('chars', []):
            if isinstance(c, dict):
                for k in ('from', 'until'):
                    if c.get(k) is not None:
                        els.append((c, k, anchor(c[k])))

        # ---------------------------------------------------------- edits
        idx = {s['id']: s for s in slots}
        order = list(slots)
        for lid in dropped:
            if lid not in idx:
                self.deviate(pb['id'], f'dropped line {lid} is not in the source beat')
                continue
            s = idx[lid]
            k = order.index(s)
            if k == 0 and len(order) > 1:
                order[1]['_gap_after_dropped_first'] = order[1]['gap']
                order[1]['gap'] = s['gap']
            s['removed'] = True
            order.remove(s)
            self.note(pb['id'], f'line {lid} dropped ("{dropped[lid].get("text", "")[:50]}")')

        def insert_after(ref_id, slot, gap):
            if ref_id is None:
                slot['gap'] = gap
                order.insert(0, slot)
                return
            ref = next((s for s in order if s['id'] == ref_id), None)
            if ref is None:
                self.deviate(pb['id'], f'{slot["id"]}: its anchor {ref_id} is not in the beat; placed last')
                order.append(slot)
                return
            k = order.index(ref)
            slot['gap'] = gap
            order.insert(k + 1, slot)
            nx = order[k + 2] if k + 2 < len(order) else None
            if nx is not None and nx.get('_follows') == slot['id'] and '_gap_after_dropped_first' in nx:
                nx['gap'] = nx.pop('_gap_after_dropped_first')
                nx.pop('_follows', None)
                self.note(pb['id'], f'{nx["id"]} keeps its {nx["gap"]:.2f} s gap after {slot["id"]} (re-placed in front of it)')

        def place_start(slot, S):
            pos, t_ = [], None
            for x in order:
                s0 = x['gap'] if t_ is None else t_ + x['gap']
                pos.append((s0, s0 + x['len']))
                t_ = s0 + x['len'] if t_ is None else max(t_, s0 + x['len'])
            k = sum(1 for s0, _ in pos if s0 <= S + EPS)
            if order and '_gap_after_dropped_first' in order[0]:
                k = 0
            if k > 0 and order:
                prev_e = max(e0 for _, e0 in pos[:k])
                if slot.get('overlap'):
                    slot['gap'] = S - prev_e   # v3.5: placed at exactly S, over the line before it
                else:
                    slot['gap'] = max(S - prev_e, 0.3)
                start_new = prev_e + slot['gap']
                if k < len(order):
                    order[k]['gap'] = max(VO_GAP, pos[k][0] - (start_new + slot['len']))
                order.insert(k, slot)
                self.note(pb['id'], f'{slot["id"]} at start+{S}: after {order[k - 1]["id"]} (an earlier line), at {start_new:.2f} s'
                                    + (f', over it by {-slot["gap"]:.2f} s (overlap)' if slot['gap'] < 0 else ''))
                return
            slot['gap'] = S
            if order:
                first = order[0]
                t0 = first['gap']
                if '_gap_after_dropped_first' in first and not slot.get('vo'):
                    first['gap'] = first.pop('_gap_after_dropped_first')
                else:
                    first['gap'] = max(VO_GAP, t0 - (S + slot['len']))
            order.insert(0, slot)

        # kept lines the plan retimes (`at`)
        retimed = [l for l in plan_lines if l.get('keep') is True and l.get('at') and not l.get('moved_from')]
        explicit = set()   # air the plan places: 'head', 'before:<id>'
        pending = []
        for l in retimed:
            sl = idx.get(l['id'])
            if sl is None or sl not in order:
                self.deviate(pb['id'], f'retimed line {l["id"]} is not in the beat')
                continue
            at = l['at']
            spec = parse_at(at)
            if spec[0] == 'start' and order[0] is sl:
                was = sl['gap']
                sl['gap'] = spec[1]
                sl.pop('_gap_after_dropped_first', None)
                explicit.add('head')
                self.note(pb['id'], f'line {l["id"]} retimed: head {was:.2f} -> {sl["gap"]:.2f} s ({at})'
                                    f'{"; a J-cut, the lines after it keep their gaps" if sl["gap"] < 0 else ""}')
                continue
            if spec[0] == 'after':
                k = order.index(sl)
                if k > 0 and order[k - 1]['id'] == spec[1]:
                    was = sl['gap']
                    sl['gap'] = spec[2]
                    explicit.add(f'before:{l["id"]}')
                    self.note(pb['id'], f'line {l["id"]} retimed: gap after {spec[1]} {was:.2f} -> {spec[2]:.2f} s'
                                        + (' (an overlap)' if spec[2] < 0 else ''))
                    continue
            k = order.index(sl)
            if k == 0 and len(order) > 1:
                order[1]['_gap_after_dropped_first'] = order[1]['gap']
                order[1]['gap'] = sl['gap']
                order[1]['_follows'] = sl['id']
            order.remove(sl)
            pending.append((sl, spec))
            explicit.add('head' if spec[0] == 'start' else f'before:{l["id"]}')
            self.note(pb['id'], f'line {l["id"]} retimed: re-placed at {at}')

        for l in moved:
            ms = self.S[l['moved_from']]
            ml = next(x for x in ms['lines'] if x['id'] == l['id'])
            slot = {'id': l['id'], 'line': copy.deepcopy(ml), 'len': ml['dur'], 'new': True, 'moved': True,
                    'carry': [dict(sd, _off=sd['at'] - ml['t']) for sd in ms.get('sounds', []) if ml['t'] - 1.0 <= sd['at'] <= ml['t'] + ml['dur']]}
            if ml.get('tag') == 'V.O.':
                slot['vo'] = True
            at = l.get('at') or f'after:{l.get("after")}+{l.get("gap_s", 0.5)}'
            pending.append((slot, parse_at(at)))
            self.note(pb['id'], f'line {l["id"]} moved in from {l["moved_from"]} at {at}, with {len(slot["carry"])} sound(s)')
        for l in new:
            rep_of = next((d for d, n in repl.items() if n == l['id']), None)
            text = l['text'].strip()
            if l.get('restored') and l.get('take_file'):
                rows = {r_['id']: r_ for r_ in jl(l['take_file'])} if os.path.exists(os.path.join(ROOT, l['take_file'])) else {}
                r = rows.get(l['id'])
                if not r:
                    self.deviate(pb['id'], f'restored line {l["id"]} has no take in {l["take_file"]}: left out')
                    continue
                if l.get('take') and os.path.normpath(r['file']) != os.path.normpath(l['take']):
                    self.deviate(pb['id'], f'restored line {l["id"]}: the plan names {l["take"]}, the takes file {r["file"]} (used)')
                ln = take_line(r, l['id'], l.get('who', 'mas'), text, 0.0, 'V.O.' if l.get('vo') else l.get('tag', ''))
                if l.get('take_dur_s') and abs(ln['dur'] - (l.get('len_s') or ln['dur'])) > 0.05:
                    self.note(pb['id'], f'restored {l["id"]}: voiced {ln["dur"]:.2f} s (the plan\'s len_s {l.get("len_s")})')
            else:
                r = self.takes.get(l['id'])
                if not r:
                    self.deviate(pb['id'], f'new line {l["id"]} has no take: left out')
                    continue
                tag = 'V.O.' if l.get('vo') else (l.get('tag') if l.get('tag') is not None else (
                    self.S[pb['id']]['lines'][[x['id'] for x in sb['lines']].index(rep_of)].get('tag', '') if rep_of else ''))
                ln = take_line(r, l['id'], l['who'], text, 0.0, tag)
                if l.get('len_s') and abs(ln['dur'] - l['len_s']) > 0.02:
                    self.deviate(pb['id'], f'new line {l["id"]}: the take is {ln["dur"]:.2f} s, the plan counted {l["len_s"]} s')
            slot = {'id': l['id'], 'line': ln, 'len': ln['dur'], 'new': True}
            if l.get('vo'):
                slot['vo'] = True
            if l.get('overlap'):
                slot['overlap'] = True
            after = l.get('after')
            spec = ('start', float(after[5:])) if isinstance(after, str) and after.startswith('start') else ('after', after, l.get('gap_s', 0.5))
            explicit.add('head' if spec[0] == 'start' else f'before:{l["id"]}')
            pending.append((slot, spec))
            how = ('reused take ' + l['reuse_of']) if l.get('reuse_of') else ('cut from ' + l['cut_from']) if l.get('cut_from') else (
                'restored take' if l.get('restored') else 'new take')
            self.note(pb['id'], f'{"restored" if l.get("restored") else "new"} line {l["id"]} ({l["who"]}, {ln["dur"]:.2f} s, {how}) '
                                f'{("at " + after) if spec[0] == "start" else ("after " + str(after) + " +" + str(l.get("gap_s")))}'
                                f'{(" replacing " + rep_of) if rep_of else ""}')
        for v in vos:
            r = self.takes.get(v['id'])
            if not r:
                self.deviate(pb['id'], f'V.O. {v["id"]} has no take: left out')
                continue
            ln = take_line(r, v['id'], 'mas', v['text'], 0.0, 'V.O.')
            slot = {'id': v['id'], 'line': ln, 'len': ln['dur'], 'new': True, 'vo': True}
            pending.append((slot, parse_at(v['at'])))
            self.note(pb['id'], f'V.O. {v["id"]} ({ln["dur"]:.2f} s) at {v["at"]}')
        while pending:
            starts_ = sorted([p_ for p_ in pending if p_[1][0] == 'start'], key=lambda p_: p_[1][1])
            if starts_:
                for p_ in starts_:
                    place_start(p_[0], p_[1][1])
                    pending.remove(p_)
                continue
            ids_ = {x['id'] for x in order}
            ready = [p_ for p_ in pending if p_[1][1] in ids_]
            if not ready:
                for p_ in pending:
                    self.deviate(pb['id'], f'{p_[0]["id"]}: its anchor {p_[1][1]} never placed; put last')
                    insert_after(order[-1]['id'] if order else None, p_[0], float(p_[1][2]))
                pending = []
                break
            for p_ in ready:
                insert_after(p_[1][1], p_[0], float(p_[1][2]))
                pending.remove(p_)

        # ---------------------------------------------------------- lay out
        head0 = slots[0]['gap'] if slots else 0.0
        if not order:
            end = head0 + (end_mode[1] if end_mode[0] == 'tail' else 0.5)
            if pb.get('est_s') and abs(pb['est_s'] - end) > FIT_TOL:
                self.note(pb['id'], f'no line left: the plan\'s {pb["est_s"]} s (head {head0:.2f} + the old tail would be {end:.2f} s)')
                end = pb['est_s']
            else:
                self.note(pb['id'], f'no line left: {end:.2f} s (head {head0:.2f} + the old tail)')
            order_empty = True
        else:
            order_empty = False
        t = None
        for s in order:
            s['s'] = s['gap'] if t is None else t + s['gap']
            s['e'] = s['s'] + s['len']
            t = s['e'] if t is None else max(t, s['e'])
        last = order[-1] if order else None
        hold = pb.get('hold_after_s')
        if order_empty:
            pass
        elif not src_lines:
            # v3.5: a new beat (or a kept one that gains its first lines) is the plan's est_s, whose tail is the plan's
            est = pb.get('est_s', dur0)
            if est >= t - EPS:
                end = max(est, t + (hold or 0.0))
                self.note(pb['id'], f'the plan\'s {est} s: its tail {end - t:.2f} s after the last line')
            else:
                end = t + (hold if hold is not None else NEW_BEAT_HOLD)
                self.deviate(pb['id'], f'its lines run to {t:.2f} s, past the plan\'s {est} s: {end:.2f} s (+{NEW_BEAT_HOLD} s hold)')
        elif last.get('new') or (last['id'] != slots[-1]['id'] if slots else True):
            if hold is not None and last.get('new'):
                end = t + hold
            elif end_mode[0] == 'lcut':
                end = last['e'] - (last_e - dur0) if last.get('new') else last['s'] + end_mode[1]
            else:
                end = t + end_mode[1]
        else:
            end = last['s'] + end_mode[1] if end_mode[0] == 'lcut' else t + max(end_mode[1], hold or 0.0)
        if not audio_changed:
            end = dur0
        elif src_lines and all(l['id'] in dropped for l in src_lines) and (new or vos) and pb.get('est_s', 0) > end + EPS:
            self.note(pb['id'], f'every line replaced: the beat keeps the plan\'s {pb["est_s"]} s (computed {end:.2f} s)')
            end = pb['est_s']

        retimed_ids = {l['id'] for l in plan_lines if l.get('at')}
        for j in [j_ for j_ in jcuts if j_['line'] not in retimed_ids]:
            js = next((x for x in order if x['id'] == j['line']), None)
            if js is None:
                self.deviate(pb['id'], f'J-cut line {j["line"]} not in the beat')
                continue
            delta = js['s'] + j['lead_s']
            k = order.index(js)
            for x in order[k:]:
                x['s'] -= delta
                x['e'] -= delta
            end -= delta
            self.note(pb['id'], f'J-cut: {j["line"]} starts {j["lead_s"]} s under the outgoing shot; it and what follows move up '
                                f'{delta:.2f} s, and the beat shortens by the same')
        old_by_i = {i: s for i, s in enumerate(slots)}

        def resolve(a):
            ref, off = a
            if ref == 'start':
                return off
            if ref == 'end':
                return end + off
            kind, i = ref
            s = old_by_i[i]
            if not s.get('removed'):
                return (s['s'] if kind == 's' else s['e']) + off
            rid = repl.get(s['id'])
            rs = next((x for x in order if x['id'] == rid), None)
            if rs is not None:
                x_old = (s['old_s'] if kind == 's' else s['old_e']) + off - s['old_s']
                if rid in vo_ids or not (-EPS <= x_old <= s['len'] + EPS):
                    return x_old + s['old_s']
                return rs['s'] + map_words(s['line'], rs['line'], x_old)
            if order_empty and end < dur0 - EPS:
                # every line went and the beat is trimmed: what the lines carried scales into the shorter picture (S5.03)
                return ((s['old_s'] if kind == 's' else s['old_e']) + off) * end / dur0
            k = i - 1
            while k >= 0 and old_by_i[k].get('removed'):
                k -= 1
            p0 = old_by_i[k]['e'] + (s['old_s'] - old_by_i[k]['old_e']) if k >= 0 else s['old_s']
            return p0 + (off if kind == 's' else s['len'] + off)

        for cont, key, a in els:
            if a is not None:
                cont[key] = r3(resolve(a))
        b['lines'] = []
        for s in order:
            ln = s['line']
            ln['t'] = r3(s['s'])
            b['lines'].append(ln)
            for sd in s.get('carry', []):
                b.setdefault('sounds', []).append({k: v for k, v in sd.items() if k != '_off'} | {'at': r3(s['s'] + sd['_off'])})
        b['reelDur'] = r3(end)
        for ms in merged_sounds:
            at = ms['at'] if ms.get('_head') else (end - (ms['_mdur'] - ms['_mat']) if (pb['id'], ms['name']) in END_ANCHORED else ms['at'] * end / mtl)
            b.setdefault('sounds', []).append({k: v for k, v in ms.items() if not k.startswith('_')} | {'at': r3(at)})

        if not audio_changed:
            self.fit_unchanged(pb, b, sb)
        elif src_lines:
            self.fit_changed(pb, b, end_mode, explicit)
        self.tidy(b)
        return b

    # ------------------------------------------------------------------ fitting a beat to the plan's est_s
    def air_segments(self, b, dur):
        lines = sorted(b.get('lines', []), key=lambda l: l['t'])
        segs = [['head', 0.0, lines[0]['t']]]
        run_e = lines[0]['t'] + lines[0]['dur']
        for c in lines[1:]:
            segs.append([f'before:{c["id"]}', run_e, c['t']])
            run_e = max(run_e, c['t'] + c['dur'])
        segs.append(['tail', run_e, dur])
        return segs, run_e

    def apply_cuts(self, b, segs, cut, dur0, label):
        marks = [(a, c, cut[k]) for k, a, c in segs if cut.get(k, 0) > 0 and c > a]

        def tmap(x):
            shift = 0.0
            for a, c, k in marks:
                if x >= c:
                    shift += k
                elif x > a:
                    shift += (x - a) / (c - a) * k
                    break
                else:
                    break
            return x - shift
        for c2, k2 in self.timed(b):
            c2[k2] = r3(tmap(c2[k2]))
        for l in b.get('lines', []):
            l['t'] = r3(tmap(l['t']) if l['t'] >= 0 else l['t'])
        total = sum(cut.values())
        b['reelDur'] = r3(dur0 - total)
        return total

    def fit_changed(self, pb, b, end_mode, explicit):
        """v3.5: a beat whose audio changed is fitted to the plan's est_s after its placements"""
        est = pb.get('est_s')
        cur = b['reelDur']
        if est is None or abs(est - cur) <= FIT_TOL:
            return
        key = (self.seg, pb['id'])
        if key in FIT_SKIP:
            self.deviate(pb['id'], FIT_SKIP[key])
            return
        if est > cur:
            self.note(pb['id'], f'+{est - cur:.2f} s at the tail, to the plan\'s {est} s (placed {cur:.2f} s)')
            b['reelDur'] = r3(est)
            return
        segs, run_e = self.air_segments(b, cur)
        need = cur - est
        if end_mode[0] == 'lcut' and run_e > cur - EPS:
            # the source ran its last line over the cut: the plan's est_s keeps that overrun
            b['reelDur'] = r3(est)
            self.note(pb['id'], f'{cur:.2f} -> {est} s, to the plan: the L-cut kept (the last line runs {run_e - est:.2f} s past '
                                f'the cut, as its source did)')
            return
        cut = {k: 0.0 for k, _, _ in segs}
        floor = {'head': 0.3, 'tail': MIN_TAIL}
        for k, target in (TRIM_HINTS.get(pb['id']) or {}).items():
            seg = next((x for x in segs if x[0] == k), None)
            if seg and need > 1e-6:
                take = min(need, max(0.0, (seg[2] - seg[1]) - target))
                cut[k] += take
                need -= take
        tail = next(x for x in segs if x[0] == 'tail')
        if need > 1e-6 and 'tail' not in (TRIM_HINTS.get(pb['id']) or {}):
            take = min(need, max(0.0, (tail[2] - tail[1]) - cut['tail'] - MIN_TAIL))
            cut['tail'] += take
            need -= take
        while need > 1e-4:
            room = [(x[2] - x[1] - cut[x[0]] - floor.get(x[0], 0.3), x[0]) for x in segs
                    if x[0] not in explicit and x[0] != 'tail' and x[0] not in (TRIM_HINTS.get(pb['id']) or {})]
            room = [r for r in room if r[0] > 1e-4]
            if not room:
                break
            top, k = max(room)
            step = min(0.01, need, top)
            cut[k] += step
            need -= step
        got = self.apply_cuts(b, segs, cut, cur, 'fit')
        if need > 1e-3:
            self.deviate(pb['id'], f'trim to the plan\'s {est} s: {need:.2f} s short (the rest is air the plan places, or under '
                                   f'the floors); {b["reelDur"]:.2f} s')
        self.note(pb['id'], f'{cur:.2f} -> {b["reelDur"]:.2f} s, to the plan\'s {est} s: '
                            + ', '.join(f'{k} −{v:.2f}' for k, v in cut.items() if v > 1e-3))

    def fit_unchanged(self, pb, b, sb):
        """no audio change: the beat takes est_s. Growth goes at the head where the plan says the beat opens earlier, inside
        it where GROW_AT says, else at the tail; a trim shaves air (the plan's stated targets first, then the largest air)"""
        dur0, est = sb['reelDur'], pb.get('est_s', sb['reelDur'])
        delta = est - dur0
        if abs(delta) < 0.02:
            b['reelDur'] = dur0
            return
        key = (self.seg, pb['id'])
        if key in FIT_SKIP:
            self.deviate(pb['id'], FIT_SKIP[key])
            b['reelDur'] = dur0
            return
        if delta > 0:
            if pb['id'] in HEAD_GROW:
                self.shift_all(b, delta)
                self.note(pb['id'], f'+{delta:.2f} s at the head (the plan: the beat opens earlier)')
            elif key in GROW_AT:
                self.grow_at(b, GROW_AT[key][0], delta)
                self.note(pb['id'], f'+{delta:.2f} s at {GROW_AT[key][0]} s: {GROW_AT[key][1]}')
            else:
                self.note(pb['id'], f'+{delta:.2f} s at the tail')
            b['reelDur'] = r3(est)
            return
        lines = sorted(b.get('lines', []), key=lambda l: l['t'])
        if not lines:
            self.scale_all(b, est / dur0)
            self.note(pb['id'], f'trim {dur0:.2f} -> {est:.2f} s, timed items scaled')
            b['reelDur'] = r3(est)
            return
        segs, _ = self.air_segments(b, dur0)
        floor = {'head': 0.3, 'tail': 0.1}
        cut = {k: 0.0 for k, _, _ in segs}
        need = -delta
        for k, target in (TRIM_HINTS.get(pb['id']) or {}).items():
            seg = next((x for x in segs if x[0] == k), None)
            if seg and need > 1e-6:
                take = min(need, max(0.0, (seg[2] - seg[1]) - target))
                cut[k] += take
                need -= take
                floor[k] = min(target, seg[2] - seg[1])
        while need > 1e-4:
            room = [(x[2] - x[1] - cut[x[0]] - floor.get(x[0], 0.3), x[0]) for x in segs]
            room = [r for r in room if r[0] > 1e-4]
            if not room:
                break
            top, k = max(room)
            step = min(0.01, need, top)
            cut[k] += step
            need -= step
        if need > 1e-3:
            self.deviate(pb['id'], f'trim to {pb["est_s"]} s would cut into the lines: {need:.2f} s short')
        self.apply_cuts(b, segs, cut, dur0, 'trim')
        self.note(pb['id'], f'trim {dur0:.2f} -> {b["reelDur"]:.2f} s: ' + ', '.join(f'{k} −{v:.2f}' for k, v in cut.items() if v > 1e-3))

    def grow_at(self, b, at, delta):
        """growth inside a beat: what starts at or after `at` moves by delta; an item that ends at `at` holds on"""
        for c, k in list(self.timed(b)):
            if k in ('at', 'from') and c[k] >= at - EPS:
                c[k] = r3(c[k] + delta)
            elif k == 'until' and c[k] >= at - EPS:
                c[k] = r3(c[k] + delta)
        for l in b.get('lines', []):
            if l['t'] >= at - EPS:
                l['t'] = r3(l['t'] + delta)

    def build_noline(self, pb, b, sb, dur0, mtl, merged_sounds, vos, dropped):
        """a beat with no lines (after the plan's drops): the V.O. and the timed items on their own clock"""
        est = pb.get('est_s', dur0)
        for lid in dropped:
            self.note(pb['id'], f'line {lid} dropped ("{dropped[lid].get("text", "")[:50]}")')
        b['lines'] = []
        if merged_sounds:
            b['sounds'] = b.get('sounds', []) + [{k: v for k, v in s.items() if not k.startswith('_')} for s in merged_sounds]
        need = 0.0
        for v in vos:
            r = self.takes.get(v['id'])
            if not r:
                self.deviate(pb['id'], f'V.O. {v["id"]} has no take: left out')
                continue
            S = float(v['at'][6:]) if v['at'].startswith('start+') else 0.5
            ln = take_line(r, v['id'], 'mas', v['text'], S, 'V.O.')
            b['lines'].append(ln)
            hold = pb.get('hold_after_s')
            need = max(need, S + ln['dur'] + (hold if hold is not None else VO_HOLD))
            self.note(pb['id'], f'V.O. {v["id"]} ({ln["dur"]:.2f} s) at {v["at"]}')
        target = est if abs(est - mtl) >= 0.02 else mtl
        if need > target + EPS:
            self.note(pb['id'], f'length {need:.2f} s from the V.O. (est_s {est})')
            target = need
        key = (self.seg, pb['id'])
        if abs(target - mtl) >= 0.02 or merged_sounds:
            if target < mtl - EPS and pb['id'] in HEAD_CUT:
                self.shift_all(b, target - mtl)
                self.note(pb['id'], f'{mtl:.2f} -> {target:.2f} s, cut at the head')
            elif target < mtl - EPS and pb['id'] in TAIL_CUT:
                self.note(pb['id'], f'{mtl:.2f} -> {target:.2f} s, cut at the tail (items after the cut clamp to it)')
            elif target < mtl - EPS or (merged_sounds and not any(m.get('_head') for m in merged_sounds)):
                self.scale_all(b, target / mtl)
                self.note(pb['id'], f'{mtl:.2f} -> {target:.2f} s, timed items scaled ×{target / mtl:.2f}')
            elif pb['id'] in HEAD_GROW:
                self.shift_all(b, target - mtl)
                self.note(pb['id'], f'+{target - mtl:.2f} s at the head (the plan: the beat opens earlier)')
            elif key in GROW_AT:
                self.grow_at(b, GROW_AT[key][0], target - mtl)
                self.note(pb['id'], f'+{target - mtl:.2f} s at {GROW_AT[key][0]} s: {GROW_AT[key][1]}')
            else:
                self.note(pb['id'], f'+{target - mtl:.2f} s at the tail')
                for sd in b.get('sounds', []):
                    if (pb['id'], sd['name']) in END_ANCHORED:
                        was = sd['at']
                        sd['at'] = r3(target - (mtl - was))
                        self.note(pb['id'], f'{sd["name"]} {was:.2f} -> {sd["at"]:.2f} s: it ends the beat')
        b['reelDur'] = dur0 if abs(target - dur0) < EPS and not merged_sounds else r3(target)
        self.tidy(b)
        return b

    def timed(self, b):
        for d in b.get('onscreen', []):
            if isinstance(d, dict) and not d.get('_add'):
                if d.get('at') is not None:
                    yield d, 'at'
                if d.get('until') is not None:
                    yield d, 'until'
        for sd in b.get('sounds', []):
            yield sd, 'at'
        for n in b.get('names', []) + b.get('speak', []):
            yield n, 'at'
        for c in b.get('chars', []):
            if isinstance(c, dict):
                for k in ('from', 'until'):
                    if c.get(k) is not None:
                        yield c, k

    def shift_all(self, b, delta):
        for c, k in self.timed(b):
            c[k] = r3(c[k] + delta)
        for l in b.get('lines', []):
            l['t'] = r3(l['t'] + delta)

    def scale_all(self, b, f):
        for c, k in self.timed(b):
            c[k] = r3(c[k] * f)

    def tidy(self, b):
        d = b['reelDur']
        for c, k in self.timed(b):
            if k in ('at', 'from'):
                c[k] = r3(min(max(c[k], 0.0 if c is not None and 'name' not in c else -1.0), max(0.0, d - 0.05)))
            else:
                c[k] = r3(max(c[k], 0.0))
        for o in b.get('onscreen', []):
            if isinstance(o, dict):
                if o.get('until') is not None and o.get('at') is not None and o['until'] <= o['at']:
                    o['until'] = r3(min(d, o['at'] + 0.5))
        if b.get('sounds'):
            b['sounds'].sort(key=lambda s: s['at'])

    # ------------------------------------------------------------------ a new beat
    def build_new(self, pb, prev):
        """a new beat: a stand-in source beat of the plan's set, frame, room and characters (no lines, the plan's
        length), then the same row of sounds as a kept beat"""
        if pb.get('restore_from'):
            return self.build_restored(pb, prev)
        style = pb.get('style') or 'BASE'
        act = prev.get('act') or next((x.get('act') for x in self.src['beats'] if x.get('act')), None)
        kind = 'flashback' if pb.get('flashback') else ('montage' if str(pb.get('mode', '')).startswith('MONTAGE') and not pb.get('lines') else 'scene')
        sb = {'id': pb['id'], 'act': act, 'kind': kind, 'set': pb.get('set', 'void'),
              'style': style if style in STICK_STYLES else 'BASE',
              'shot': frame_of(pb.get('frame')), 'frame': pb.get('frame', ''), 'side': '', 'room': pb.get('room') or prev.get('room', ''),
              'chars': [re.sub(r'\s*\(.*$', '', c).strip() for c in pb.get('chars', [])], 'caption': pb.get('caption', ''),
              'lines': [], 'onscreen': [], 'reelDur': pb.get('est_s', 3.0), 'fx': [], 'cues': []}
        self.S[pb['id']] = sb
        self.note(pb['id'], f'new beat ({kind}): {pb.get("frame", "")} ({sb["set"]}, {sb["room"]}, {", ".join(sb["chars"]) or "no figures"})')
        return self.build_keep(pb, [])

    def build_restored(self, pb, prev):
        """a restored beat (restore_from: an earlier lock's beat): that beat, its chars cut to the plan's, its lines where
        they were (the plan's restored lines are checked against them), its sounds the plan's list (in finish)"""
        path, bid = pb['restore_from'].split('#')
        src_tl = jl(path)
        ids = [x['id'] for x in src_tl['beats']]
        sb = copy.deepcopy(next(x for x in src_tl['beats'] if x['id'] == bid))
        self.restored_prev[pb['id']] = ids[ids.index(bid) - 1] if ids.index(bid) else None
        keep = {re.sub(r'\s*\(.*$', '', c).strip() for c in pb.get('chars', [])}
        was = [c['id'] if isinstance(c, dict) else c for c in sb.get('chars', [])]
        sb['chars'] = [c for c in sb.get('chars', []) if (c['id'] if isinstance(c, dict) else c) in keep]
        if len(sb['chars']) != len(was):
            self.note(pb['id'], f'chars cut to the plan\'s ({", ".join(sorted(keep))}): {", ".join(x for x in was if x not in keep)} go')
        self.S[pb['id']] = sb
        pb2 = dict(pb, action='keep')
        lines = []
        for l in pb.get('lines', []):
            sl = next((x for x in sb.get('lines', []) if x['id'] == l['id']), None)
            if sl is None:
                lines.append(l)
                continue
            spec = l.get('after', '')
            if isinstance(spec, str) and spec.startswith('start') and abs(float(spec[5:]) - sl['t']) > 0.02:
                self.deviate(pb['id'], f'restored line {l["id"]}: the plan places it at {spec}, the {os.path.basename(path)} '
                                       f'beat at {sl["t"]} s (kept)')
            if l.get('take_file'):
                rows = {r_['id']: r_ for r_ in jl(l['take_file'])}
                if l['id'] in rows and os.path.normpath(rows[l['id']]['file']) != os.path.normpath(sl['audio']):
                    self.deviate(pb['id'], f'restored line {l["id"]}: the beat plays {sl["audio"]}, the take file names '
                                           f'{rows[l["id"]]["file"]}')
            lines.append({'id': l['id'], 'keep': True})
        pb2['lines'] = lines
        self.note(pb['id'], f'restored from {pb["restore_from"]} ({sb["reelDur"]:.3f} s; {len(sb.get("lines", []))} line(s) '
                            f'where they were)')
        return self.build_keep(pb2, [])

    # ------------------------------------------------------------------ the plan's sounds, and the stick's own fixes
    def plan_sounds(self, b, pb):
        ps = pb.get('sounds') or []
        if not ps:
            return
        replace_all = bool(pb.get('restore_from'))
        if replace_all:
            gone = [f'{x["name"]}@{x["at"]}' for x in b.get('sounds', [])]
            b['sounds'] = []
            self.note(pb['id'], f'sounds: the plan\'s list replaces the restored beat\'s ({", ".join(gone)})')
        lines = {l['id']: l for l in b.get('lines', [])}
        have = {}
        for x in b.get('sounds', []):
            have.setdefault(x['name'], []).append(x)
        moved_names = set()
        for sd in ps:
            at = sd['at']
            if isinstance(at, str):
                m = re.match(r'(after|before):(.+?)([+-])([\d.]+)$', at)
                ln = lines.get(m.group(2)) if m else None
                if ln is None:
                    self.deviate(pb['id'], f'sound {sd["name"]} at {at}: no such line; at 0.2 s')
                    at = 0.2
                elif m.group(1) == 'after':
                    at = ln['t'] + ln['dur'] + (float(m.group(4)) if m.group(3) == '+' else -float(m.group(4)))
                else:
                    at = ln['t'] - float(m.group(4))
            gain = sd.get('gain')
            old = have.get(sd['name'])
            if old and sd['name'] not in moved_names and not replace_all:
                # a plan sound named like one the beat has: it moves those (15.13's gasp, after his line now)
                gain = gain if gain is not None else old[0].get('gain')
                for x in old:
                    b['sounds'].remove(x)
                moved_names.add(sd['name'])
                self.note(pb['id'], f'sound {sd["name"]} {", ".join(str(x["at"]) for x in old)} -> {at:.2f} s (the plan\'s)')
            else:
                self.note(pb['id'], f'sound {sd["name"]} at {at:.2f} s (the plan\'s)')
            if gain is None:
                gain = DEFAULT_GAIN.get(sd['name'], -24)
            e = {'name': sd['name'], 'at': r3(max(0.0, at)), 'gain': gain}
            for k in ('dur', 'align', 'note'):
                if k in sd:
                    e[k] = sd[k]
            b.setdefault('sounds', []).append(e)
        b['sounds'].sort(key=lambda x: x['at'])

    def onscreen_retime(self, b, pb):
        rt = (pb.get('onscreen') or {}).get('retime') or {}
        for text, at in rt.items():
            o = next((x for x in b.get('onscreen', []) if isinstance(x, dict) and x['text'] == text), None)
            if o is None:
                self.deviate(pb['id'], f'onscreen retime "{text}": not in the beat')
                continue
            a0 = o.get('at') or 0.0
            d = at - a0
            o['at'] = r3(at)
            for x in b.get('onscreen', []):
                if isinstance(x, dict) and x is not o and x.get('until') is not None and abs(x['until'] - a0) < 0.02:
                    x['until'] = r3(at)
            moved_ = []
            if not b.get('lines'):
                for sd in b.get('sounds', []):
                    if sd['at'] >= a0 - EPS:
                        sd['at'] = r3(sd['at'] + d)
                        moved_.append(sd['name'])
            self.note(pb['id'], f'onscreen retime: "{text}" {a0} -> {at} s; the item before it holds until then'
                                + (f'; its sounds move with it ({", ".join(moved_)})' if moved_ else ''))

    # ------------------------------------------------------------------ names and cues
    def finish(self, b, pb):
        key = (self.seg, pb['id'])
        self.onscreen_retime(b, pb)
        if key in ITEM_PIN:
            texts, snds, nids, why = ITEM_PIN[key]
            sb_ = self.S[pb['id']]
            moved_ = []
            for o in b.get('onscreen', []):
                if isinstance(o, dict) and o['text'] in texts:
                    so = next((x for x in sb_.get('onscreen', []) if isinstance(x, dict) and x['text'] == o['text']), None)
                    if so and abs(so.get('at', 0) - o['at']) > EPS:
                        moved_.append(f'{o["text"]} {o["at"]:.2f}->{so["at"]:.2f}')
                        o['at'] = so['at']
            for nm in snds:
                src_ = [x for x in sb_.get('sounds', []) if x['name'] == nm]
                cur_ = [x for x in b.get('sounds', []) if x['name'] == nm]
                for x, y in zip(cur_, src_):
                    if abs(x['at'] - y['at']) > EPS:
                        moved_.append(f'{nm} {x["at"]:.2f}->{y["at"]:.2f}')
                        x['at'] = y['at']
            if moved_:
                self.note(pb['id'], f'kept at the source\'s times ({why}): ' + ', '.join(moved_))
            if b.get('sounds'):
                b['sounds'].sort(key=lambda x: x['at'])
        for (sg, bid, pre), (at, why) in ONSCREEN_AT_PREFIX.items():
            if (sg, bid) != key:
                continue
            for o in b.get('onscreen', []):
                if isinstance(o, dict) and o['text'].startswith(pre) and not o.get('_add'):
                    self.note(pb['id'], f'"{o["text"][:40]}…" at {o.get("at")} -> {at} s: {why}')
                    o['at'] = at
        # undrawn characters (the second deepfake copy)
        for cid, why in (UNDRAWN.get(self.seg) or {}).items():
            n0 = len(b.get('chars', [])) + len(b.get('names', []) or [])
            b['chars'] = [c for c in b.get('chars', []) if (c['id'] if isinstance(c, dict) else c) != cid]
            if b.get('names'):
                b['names'] = [n for n in b['names'] if n['id'] != cid]
            if len(b.get('chars', [])) + len(b.get('names', []) or []) != n0:
                self.note(pb['id'], f'{cid} removed from chars / names[]: {why}')
        # a J-cut line's speaker, plated in the beat it leads into, is named from the line's start
        for ln in b.get('lines', []):
            if ln['t'] < 0 and ln.get('tag') != 'V.O.':
                for n in b.get('names', []):
                    if n['id'] == ln['who'] and n['at'] > ln['t']:
                        self.note(pb['id'], f'names[]: {n["id"]} {n["at"]:.2f} -> {ln["t"]:.2f} s (the J-cut line leads its plate)')
                        n['at'] = ln['t']
        if pb.get('frame') and pb['action'] in ('keep',) and b.get('frame') != pb['frame']:
            b['frame'] = pb['frame']
            self.note(pb['id'], 'frame from the plan')
        if pb.get('restore_from') and pb.get('frame') and b.get('frame') != pb['frame']:
            b['frame'] = pb['frame']
            self.note(pb['id'], 'frame from the plan')
        if pb.get('caption') and b.get('caption') != pb['caption']:
            b['caption'] = pb['caption']
            self.note(pb['id'], 'caption from the plan')
        elif key in CAPTION_SUB:
            for o_, n_ in CAPTION_SUB[key]:
                if o_ in (b.get('caption') or ''):
                    b['caption'] = b['caption'].replace(o_, n_)
                    self.note(pb['id'], f'caption: the dropped line\'s quote -> the restored one\'s (the plan gives no caption)')
                else:
                    self.deviate(pb['id'], f'CAPTION_SUB: "{o_[:40]}" not in the caption')
        for (sg, bid, text), (kv, why) in ONSCREEN_SET.items():
            if (sg, bid) == key:
                for o in b.get('onscreen', []):
                    if isinstance(o, dict) and o['text'] == text:
                        self.note(pb['id'], f'"{text}" ' + ', '.join(f'{k} {o.get(k)} -> {v}' for k, v in kv.items()) + f': {why}')
                        o.update(kv)
        for l in pb.get('lines', []):
            first = re.split(r'(?<=[.?!])\s', l.get('text', '') or '')[0].strip('"… ')
            still = ' '.join([x.get('text', '') for x in b.get('lines', [])] + [o['text'] if isinstance(o, dict) else o for o in b.get('onscreen', [])])
            if l.get('keep') is False and first and first[:12] in (b.get('caption') or '') and first[:12] not in still:
                self.deviate(pb['id'], f'the caption still quotes the dropped line "{first}"')
        cues = [c for c in b.get('cues', []) if not c.lower().startswith('music')]
        for o_, n_ in CUE_SUB.get(key, []):
            for i, c in enumerate(cues):
                if o_ in c:
                    cues[i] = c.replace(o_, n_)
                    self.note(pb['id'], f'cue: "{o_[:40]}…" -> "{n_[:40]}…" (the v3.5 picture)')
        if pb.get('music'):
            b['cues'] = [f'music (v3.5): {pb["music"]}'] + cues
        else:
            b['cues'] = cues
        for ln in b.get('lines', []):
            t = clean_line_text(ln['text']) if ln.get('tag') != 'V.O.' else ln['text']
            if t != ln['text']:
                ln['text'] = t
        # sounds: the plan's, the ones a seam carries here, the stick's own notes, and the caption's placements
        self.plan_sounds(b, pb)
        for sd, at_, why in self.carry.pop(pb['id'], []):
            at = at_ if at_ >= 0 else b['reelDur'] + at_
            b.setdefault('sounds', []).append(dict(sd, at=r3(max(0.0, at))))
            self.note(pb['id'], f'sound {sd["name"]} at {at:.2f} s ({why})')
        for sd in NEW_SOUNDS.get(pb['id'], []):
            at = sd['at'] if sd['at'] >= 0 else b['reelDur'] + sd['at']
            b.setdefault('sounds', []).append(dict(sd, at=r3(max(0.0, at))))
            self.note(pb['id'], f'sound {sd["name"]} at {max(0.0, at):.2f} s (the plan\'s sound note, as a stick SFX)')
        for (sg, bid, nm), (at, why) in SOUND_AT.items():
            if (sg, bid) == key:
                for sd in b.get('sounds', []):
                    if sd['name'] == nm:
                        self.note(pb['id'], f'sound {nm} {sd["at"]:.2f} -> {at:.2f} s: {why}')
                        sd['at'] = at
        if b.get('sounds'):
            b['sounds'].sort(key=lambda x: x['at'])
        self.resolve_adds(b)
        for o in b.get('onscreen', []):
            if isinstance(o, dict):
                o.pop('_add', None)
        # a plate the plan adds names its character from that frame (NOLE, LAHTNEMULB, TTEMME, AUHSOJ)
        have = {n['id'] for n in b.get('names', [])}
        for a in (pb.get('onscreen') or {}).get('add', []):
            t = strip_note(a).strip()
            pid = plate_id(t)
            if t in PLATE_SKIP:
                continue
            if pid in self.cast and pid not in have and pid != 'mas':
                at = next((o['at'] for o in b.get('onscreen', []) if isinstance(o, dict) and o['text'] == t), 0.2)
                b.setdefault('names', []).append({'id': pid, 'at': at})
                have.add(pid)
                self.note(pb['id'], f'names[]: {pid} at {at} s (its plate)')
        # where Mas's voice names someone in the cast, the strip names them on that word
        for ln in b.get('lines', []):
            if ln.get('tag') != 'V.O.' or not ln['id'].startswith(('v3-vo', 'v31-vo', 'v35-vo')):
                continue
            for w, t0, _ in ln.get('words', []):
                k = norm_word(w)
                at = r3(max(0.0, ln['t'] + t0))
                if k not in self.cast or k == 'mas':
                    continue
                if k not in have:
                    b.setdefault('names', []).append({'id': k, 'at': at})
                    have.add(k)
                    self.note(pb['id'], f'names[]: {k} at {at:.2f} s (his voice names them)')
        # the plan's fields for the art, shot and score passes
        passes = {k: pb[k] for k in PASS_KEYS if k in pb and pb[k] not in (None, '', [], {})}
        if passes:
            b['passes'] = passes

    # ------------------------------------------------------------------ the segment
    def build(self):
        beats = self.plan['beats']
        merges = {}
        for pb in beats:
            if pb['action'] == 'merge':
                merges.setdefault(pb['into'], []).append(pb)
        out = []
        pending_seq = None
        for pb in beats:
            act = pb['action']
            if act == 'cut':
                sb = self.S[pb['id']]
                if isinstance(sb.get('seq'), dict) and (not sb['seq'].get('sub') or not pending_seq):
                    pending_seq = dict(sb['seq'], side='')
                self.note(pb['id'], f'cut: {sb["reelDur"]:.2f} s ({pb.get("why", "")[:90]})')
                for sd in sb.get('sounds', []):
                    mv = SOUND_MOVE.get((self.seg, pb['id'], sd['name']))
                    if mv:
                        self.carry.setdefault(mv[0], []).append((dict(sd), mv[1], f'from {pb["id"]}: {mv[2]}'))
                continue
            if act in ('merge', 'skip'):
                continue
            if act == 'keep':
                b = self.build_keep(pb, merges.get(pb['id'], []))
                have = {n['id'] for n in b.get('names', [])}
                for mpb in merges.get(pb['id'], []):
                    ms = self.S[mpb['id']]
                    for n in ms.get('names') or []:
                        if n['id'] in have:
                            continue
                        at = next((o['at'] for o in b.get('onscreen', []) if isinstance(o, dict)
                                   and o['text'].lower().split(' · ')[0] == n['id']), 0.2)
                        b.setdefault('names', []).append({'id': n['id'], 'at': at})
                        have.add(n['id'])
                        self.note(pb['id'], f'names[]: {n["id"]} at {at} s, from the merged {mpb["id"]} (its plate)')
                    if isinstance(ms.get('seq'), dict) and not b.get('seq'):
                        b['seq'] = dict(ms['seq'], side='')
                        self.note(pb['id'], f'sequence marker {ms["seq"].get("id") or ms["seq"].get("sub")} from the merged {mpb["id"]}')
            elif act == 'new':
                b = self.build_new(pb, out[-1] if out else {})
            else:
                raise ValueError(act)
            if pb.get('moved'):
                self.note(pb['id'], f'moved ({pb["moved"].get("from")} -> {pb["moved"].get("to")}): it keeps its room '
                                    f'({b.get("room")}; before it, {out[-1].get("room") if out else "-"})')
            if pb['id'] in NEW_SEQ and not b.get('seq'):
                b['seq'] = dict(NEW_SEQ[pb['id']])
                self.note(pb['id'], f'sequence marker {b["seq"].get("id") or b["seq"].get("sub")}: {b["seq"]["place"]}')
            if pending_seq and not b.get('seq'):
                b['seq'] = pending_seq
                self.note(pb['id'], f'sequence marker {pending_seq.get("id") or pending_seq.get("sub")} moved here from a cut beat')
            pending_seq = None
            if isinstance(b.get('seq'), dict) and b['seq'].get('id') in SEQ_FIX:
                fx = SEQ_FIX[b['seq']['id']]
                if any(b['seq'].get(k) != v for k, v in fx.items()):
                    b['seq'].update(fx)
                    self.note(pb['id'], f'sequence marker {b["seq"]["id"]}: ' + ', '.join(f'{k} "{v}"' for k, v in fx.items()))
            self.finish(b, pb)
            out.append(b)
        # a continuation beat whose shot went is no longer a continuation
        src_ids = [b['id'] for b in self.src['beats']]
        for i, b in enumerate(out):
            if b.get('cont'):
                prev_src = self.restored_prev.get(b['id']) if b['id'] in self.restored_prev else (
                    src_ids[src_ids.index(b['id']) - 1] if b['id'] in src_ids else None)
                if i == 0 or out[i - 1]['id'] != prev_src:
                    b['cont'] = False
                    self.note(b['id'], 'cont cleared (its shot before it went)')
        for a_, b_ in SEQ_MOVE.items():
            A_ = next((x for x in out if x['id'] == a_), None)
            B_ = next((x for x in out if x['id'] == b_), None)
            if A_ is not None and B_ is not None and A_.get('seq') and not B_.get('seq'):
                B_['seq'] = A_.pop('seq')
                self.note(b_, f'sequence marker {B_["seq"].get("id")} moved here from {a_} (the scene now opens here)')
        for b in out:
            F = EXACT_FRAMES.get((self.seg, b['id']))
            if F:
                if abs(b['reelDur'] * FPS - F) > 1.0:
                    self.deviate(b['id'], f'built {b["reelDur"]:.3f} s, set to {F} frames ({F / FPS:.4f} s) for the Runway insert')
                b['reelDur'] = F / FPS
                self.note(b['id'], f'exactly {F} frames (the Runway insert)')
        if self.carry:
            for bid, xs in self.carry.items():
                self.deviate(bid, f'{len(xs)} carried sound(s) never placed: beat not in the segment')
        self.beats = out
        return out

    def timeline(self):
        src = self.src
        total = sum(b['reelDur'] for b in self.beats)
        prev = src.get('_source', {}).get('takes_files', []) if isinstance(src.get('_source'), dict) else []
        extra = set()
        for pb in self.plan['beats']:
            for l in pb.get('lines', []):
                if l.get('take_file'):
                    extra.add(l['take_file'])
        mine = os.path.join(TAKES_DIR, self.seg, 'lines-v35.json')
        takes_files = sorted(set(prev) | extra | ({os.path.relpath(mine, ROOT)} if os.path.exists(mine) else set()))
        return {
            'episode': 1,
            'title': src.get('title', 'ep1.0_research_preview.md'),
            'part': PART.get(self.seg, src.get('part') or self.seg),
            'variant': 'stick-figure dialogue reel v3.5 BASE LOCK (Kokoro timing) · the v2/v5/v3/v3.1/v3.2/v3.4 takes + the v3.5 takes · temp bed',
            'logline': f'The v3.5 base lock of {self.seg}: the v3.5 beat plan applied to {os.path.basename(self.src_path)} '
                       f'(script draft 8.4, the final version).',
            'dateSpan': DATESPAN.get(self.seg, src.get('dateSpan', '')),
            'runtimeMin': round(total / 60, 2),
            'dialogueReel': True,
            'cast': {k: v for k, v in {**src.get('cast', {}), **CAST_ADD.get(self.seg, {})}.items() if k not in CAST_DROP.get(self.seg, set())},
            '_source': {'plan': os.path.relpath(os.path.join(BP_DIR, f'{self.seg}.json'), ROOT), 'timeline': self.src_path,
                        'takes': takes_files[0] if len(takes_files) == 1 else None, 'takes_files': takes_files,
                        'builder': 'audio/reel/ep01-v35/build_timeline.py', 'bed': f'audio/reel/ep01-v35/bed.py -> audio/reel/ep01-v35/{self.seg}-bed.wav',
                        'notes': 'show/episodes/ep01/production/full-v3/lock-v35.md', 'seconds': r3(total)},
            'beats': self.beats,
        }


DEFAULT_GAIN = {}   # filled in main(): a sound's median gain across the v3.4 lock
PART = {'coldopen': 'COLD OPEN · P35 sc 1-3', 'act1': 'ACT ONE · research preview · P35 sc 4-24',
        'act2': 'ACT TWO · the regulate-me tour · P35 sc 25-30A', 'act3': 'ACT THREE · verified: human · P35 sc 31-37',
        'act4': 'ACT FOUR · five days, told twice · P35 sc 38-56', 'tag': 'TAG · december · P35 sc 57-58'}
DATESPAN = {'act1': 'Nov 30, 2022 - Mar 29, 2023 (with Jun 2018)', 'act2': 'May 4 - 30, 2023 (with Mar 2019)'}


def map_words(old, new, x_old):
    """a time inside an old line -> the same word's time inside its replacement (both from their speech onset)"""
    ow, nw = old.get('words') or [], new.get('words') or []
    if not ow or not nw:
        return min(x_old, new['dur'])
    k = max((i for i, w in enumerate(ow) if w[1] <= x_old + 0.05), default=0)
    key = norm_word(ow[k][0])
    nth = sum(1 for w in ow[:k] if norm_word(w[0]) == key)
    hits = [w for w in nw if norm_word(w[0]) == key]
    if len(hits) > nth:
        return hits[nth][1] + (x_old - ow[k][1])
    return x_old / max(0.1, old['dur']) * new['dur']


MANIFEST = os.path.join(OUT_DIR, 'ep01-v35.manifest.json')
INTRO_MP4 = 'out/intro/intro-ep1-V1-1080p-flashfix.mp4'
OUTRO_MP4, OUTRO_WAV = 'out/ep01/outro/outro-b-v3.mp4', 'out/ep01/outro/outro-b-v3.wav'
SUB = {'coldopen': 'P35 sc 1-3 · the rewind into the intro', 'act1': 'research preview · P35 sc 4-24 · he launches, the world uses it, he secures the money',
       'act2': 'the regulate-me tour · P35 sc 25-30A · he makes himself its face', 'act3': 'verified: human · P35 sc 31-37 · he consolidates',
       'act4': 'five days, told twice · P35 sc 38-56', 'tag': 'december · P35 sc 57-58 · the cover'}


def wav_seconds(path):
    import wave
    try:
        with wave.open(os.path.join(ROOT, path)) as w:
            return w.getnframes() / w.getframerate()
    except Exception:
        return None


def seg_frames(beats):
    """the reel's clock: each beat ends on the frame nearest its cumulative time (bed.py / episode.ts)"""
    acc, prev = 0.0, 0
    for b in beats:
        acc += b['reelDur']
        prev = max(prev + 1, round(acc * FPS))
    return prev


def write_manifest(rep):
    """the v3.5 episode manifest (v3.4's pattern): cold open, the flash-fixed intro with its own sound, the 2 s filename
    card, the acts, the tag, the Orb outro B. Keyed ep01-v35-stick (no timeline has that key)."""
    outro_s = wav_seconds(OUTRO_WAV) or 10.125
    story = sum(r['seconds'] for r in rep.values())
    first = {seg: json.load(open(os.path.join(OUT_DIR, f'ep01-v35-{seg}.json')))['beats'][0]['id'] for seg in SEGS}
    ch = [{'id': 'coldopen', 'label': 'COLD OPEN', 'sub': SUB['coldopen'], 'from': 'ep01-v35-coldopen', 'acts': ['COLD OPEN']},
          {'id': 'intro', 'kind': 'video', 'label': 'INTRO', 'act': 'INTRO', 'sub': 'main title · V1 Chip Chamber Jazz (flash-fixed picture)',
           'src': INTRO_MP4, 'in': 0, 'dur': 30, 'fit': 'full',
           'audio': {'own': True, 'src': 'audio/intro-mix/intro-ep1-mix-V1-chipchamber.wav', 'gain': -3, 'tail': 0.3},
           'note': 'The flash-fixed picture (commit 2fb7161: the whip smear held on 2s); the intro\'s own audio as before (-3 dB).'},
          {'id': 'card', 'label': 'CARD', 'act': 'INTRO', 'sub': 'the filename card (2 s)', 'from': 'ep01-full-part1', 'beats': ['card.01']}]
    for seg in ('act1', 'act2', 'act3', 'act4'):
        ch.append({'id': seg, 'label': {'act1': 'ACT ONE', 'act2': 'ACT TWO', 'act3': 'ACT THREE', 'act4': 'ACT FOUR'}[seg],
                   'sub': SUB[seg], 'from': f'ep01-v35-{seg}'})
    ch.append({'id': 'tag', 'label': 'TAG', 'sub': SUB['tag'], 'from': 'ep01-v35-tag', 'acts': ['TAG']})
    ch.append({'id': 'outro', 'kind': 'video', 'label': 'OUTRO', 'act': 'CREDITS', 'sub': 'the Orb scan (B) · credits',
               'src': OUTRO_MP4, 'in': 0, 'dur': round(outro_s, 3), 'fit': 'full',
               'audio': {'own': True, 'src': OUTRO_WAV, 'gain': -1, 'tail': 0},
               'note': 'The Orb outro (B), -16.0 LUFS as mastered, -1 dB to sit with the intro (the v3 lock\'s proposal, for an ear).'})
    beds = []
    for seg in ('coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'):
        e = {'chapter': seg, 'cue': 'temp: rooms + SFX + pads per mood', 'label': f'{seg} stick bed (v3.5)',
             'src': f'audio/reel/ep01-v35/{seg}-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05}
        if seg in first:
            e['beat'] = first[seg]
        beds.append(e)
    m = {
        'kind': 'episode-manifest', 'key': 'ep01-v35-stick', 'episode': 1, 'title': 'ep1.0_research_preview.md',
        'variant': 'full-episode stick reel v3.5 BASE LOCK (Kokoro timing) · script draft 8.4 · the v3.5 beat plans on the v3.4 timelines · temp beds',
        'dateSpan': 'Nov 2022 - Dec 2023', 'runtimeMin': round((story + 30 + 2 + outro_s) / 60, 2),
        '_about': 'The Ep1 v3.5 base lock, Kokoro timing (pass v3-lock, 2026-09-28). Chapters: the 3 s title slate, the cold open, '
                  'the V1 intro (flash-fixed picture, its own audio), the 2 s filename card, Acts One to Four and the tag '
                  '(show/reel/ep01-v35/ep01-v35-<seg>.json, built by audio/reel/ep01-v35/build_timeline.py from the v3.5 beat '
                  'plans on the v3.4 timelines), and the Orb outro B with its own sound. Sound: the mixer lays every take; one temp '
                  'bed per chapter (audio/reel/ep01-v35/bed.py). Notes: show/episodes/ep01/production/full-v3/lock-v35.md. '
                  'Nothing here was watched or heard.',
        'titleCard': 3, 'actCards': 'margin', 'actCardSec': 4, 'known': [], 'chapters': ch, 'beds': beds,
        'mix': {'lufs': None, 'floor': -50, 'ceiling': -1, 'duck': -10, 'bedLufs': -26, 'xfade': 2.0, 'dialogueGain': -3},
    }
    open(MANIFEST, 'w').write(json.dumps(m, indent=1, ensure_ascii=False) + '\n')
    print(f'{os.path.relpath(MANIFEST, ROOT)}: {len(ch)} chapters, story {story:.1f} s + intro 30 + card 2 + outro {outro_s:.3f} '
          f'= {story + 32 + outro_s:.1f} s (plus the 3 s title slate)')


def pacing(files):
    cmd = [sys.executable, os.path.join(ROOT, 'studio/src/reel/tools/pacing.py')] + [f'{k}={v}' for k, v in files]
    return subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT).stdout


# ---------------------------------------------------------------------- the checks (lock-v35.md §2, §3)
def line_gaps(beats):
    """the gap before each line inside its beat (start minus the latest end before it; negative = an overlap), by id"""
    out = {}
    for b in beats:
        ls = sorted(b.get('lines', []), key=lambda l: l['t'])
        run_e = None
        for l in ls:
            if run_e is not None:
                out[l['id']] = r3(l['t'] - run_e)
            run_e = l['t'] + l['dur'] if run_e is None else max(run_e, l['t'] + l['dur'])
    return out


def checks(seg, S, tl):
    plan = {pb['id']: pb for pb in S.plan['beats']}
    got = {b['id']: b for b in tl['beats']}
    rows, bad = [], []
    for pb in S.plan['beats']:
        if pb['action'] in ('cut', 'merge', 'skip'):
            if pb['id'] in got:
                bad.append(f'{pb["id"]}: {pb["action"]} in the plan but in the lock')
            continue
        b = got.get(pb['id'])
        if b is None:
            bad.append(f'{pb["id"]}: in the plan, not in the lock')
            continue
        d = r3(b['reelDur'] - pb['est_s'])
        changed = pb['action'] == 'new' or pb.get('why') != 'unchanged'
        if changed or abs(d) > 0.02:
            rows.append({'beat': pb['id'], 'action': pb['action'], 'scene': pb.get('scene'), 'src_s': pb.get('src_s'),
                         'est_s': pb['est_s'], 'lock_s': r3(b['reelDur']), 'diff_s': d})
        if abs(d) > FIT_TOL and pb['id'] not in [x[1] for x in FIT_SKIP] and pb['id'] not in EXACT_ID:
            bad.append(f'{pb["id"]}: lock {b["reelDur"]:.3f} s against est_s {pb["est_s"]} ({d:+.2f})')
        # lines: every kept / new / restored line is in, every dropped one is out
        ids = {l['id'] for l in b.get('lines', [])}
        for l in pb.get('lines', []):
            if l.get('keep') is False and l['id'] in ids:
                bad.append(f'{pb["id"]}: dropped line {l["id"]} is still in')
            if (l.get('keep') is True or l.get('new') or l.get('restored')) and l['id'] not in ids:
                bad.append(f'{pb["id"]}: line {l["id"]} is missing')
    order_plan = [pb['id'] for pb in S.plan['beats'] if pb['action'] in ('keep', 'new')]
    order_lock = [b['id'] for b in tl['beats']]
    if order_plan != order_lock:
        bad.append('the beat order differs from the plan')
    # the tempo table: the gap before each named line
    gaps = line_gaps(tl['beats'])
    tempo = []
    for pb in S.plan['beats']:
        for lid, g in ((pb.get('tempo') or {}).get('gaps') or {}).items():
            m = gaps.get(lid)
            ok = m is not None and abs(m - g) <= 0.02
            tempo.append({'beat': pb['id'], 'line': lid, 'plan_s': g, 'lock_s': m, 'ok': ok})
            if not ok:
                bad.append(f'{pb["id"]}: tempo gap before {lid} {m} s, the plan {g} s')
    return rows, bad, tempo


EXACT_ID = {'S7.13'}


def median_gaps(beats):
    """the median gap between consecutive lines, (a) inside a beat, (b) on the segment clock (all consecutive lines)"""
    inner = list(line_gaps(beats).values())
    allg, t0 = [], 0.0
    spans = []
    for b in beats:
        for l in b.get('lines', []):
            spans.append((t0 + l['t'], t0 + l['t'] + l['dur'], l.get('tag') == 'V.O.'))
        t0 += b['reelDur']
    spans.sort()
    run_e = None
    for s, e, _ in spans:
        if run_e is not None:
            allg.append(s - run_e)
        run_e = e if run_e is None else max(run_e, e)
    spoken = [(s, e) for s, e, vo in spans if not vo]
    sp, run_e = [], None
    for s, e in spoken:
        if run_e is not None:
            sp.append(s - run_e)
        run_e = e if run_e is None else max(run_e, e)
    med = lambda xs: r3(st.median(xs)) if xs else None
    return {'inside_beats_s': med(inner), 'inside_beats_n': len(inner), 'segment_s': med(allg), 'segment_n': len(allg),
            'spoken_only_segment_s': med(sp)}


def main(argv):
    segs = [a for a in argv if a in SEGS] or SEGS
    takes = load_takes()
    gains = {}
    for s in SEGS:
        for b in jl(f'show/reel/ep01-v34/ep01-v34-{s}.json')['beats']:
            for sd in b.get('sounds', []):
                if sd.get('gain') is not None:
                    gains.setdefault(sd['name'], []).append(sd['gain'])
    DEFAULT_GAIN.update({k: round(st.median(v)) for k, v in gains.items()})
    os.makedirs(OUT_DIR, exist_ok=True)
    rep = json.load(open(REPORT)) if os.path.exists(REPORT) else {}
    for seg in segs:
        S = Seg(seg, takes)
        S.build()
        tl = S.timeline()
        f = os.path.join(OUT_DIR, f'ep01-v35-{seg}.json')
        open(f, 'w').write(json.dumps(tl, indent=1, ensure_ascii=False) + '\n')
        src_total = sum(b['reelDur'] for b in S.src['beats'])
        total = sum(b['reelDur'] for b in tl['beats'])
        nl = sum(len(b['lines']) for b in tl['beats'])
        nvo = sum(1 for b in tl['beats'] for l in b['lines'] if l.get('tag') == 'V.O.')
        cross = [f"{l['id']} ({b['id']})" for b in tl['beats'] for l in b['lines'] if l['t'] + l['dur'] > b['reelDur'] + 0.01]
        pre = [f"{l['id']} ({b['id']}, {l['t']:+.2f})" for b in tl['beats'] for l in b['lines'] if l['t'] < 0]
        deep = [x for x in pre if float(x.rsplit(', ', 1)[1].rstrip(')')) < -4.0]
        rows, bad, tempo = checks(seg, S, tl)
        for x in deep:
            bad.append(f'{x}: a pre-lap deeper than -4 s')
        src_med = median_gaps(S.src['beats'])
        new_med = median_gaps(tl['beats'])
        rep[seg] = {'timeline': os.path.relpath(f, ROOT), 'source': S.src_path, 'source_story_s': r3(src_total),
                    'estimate_s': S.plan.get('story_s', {}).get('estimate'), 'seconds': r3(total), 'frames': seg_frames(tl['beats']),
                    'source_frames': seg_frames(S.src['beats']), 'beats': len(tl['beats']), 'lines': nl, 'vo': nvo,
                    'vo_lines': [f"{l['id']} ({b['id']}): {l['text']}" for b in tl['beats'] for l in b['lines'] if l.get('tag') == 'V.O.'],
                    'jcuts': pre, 'lcuts': cross, 'median_gap_v34': src_med, 'median_gap_v35': new_med,
                    'beat_lengths': rows, 'tempo': tempo, 'check_failures': bad,
                    'edits': S.edits, 'deviations': S.dev, 'safety_net': S.safety}
        m, s = divmod(total, 60)
        print(f'== {seg}: {len(tl["beats"])} beats, {nl} lines ({nvo} V.O.), {int(m)}:{s:04.1f}, {rep[seg]["frames"]} frames '
              f'(v3.4 {src_total:.1f} s, plan estimate {S.plan.get("story_s", {}).get("estimate")} s) -> {os.path.relpath(f, ROOT)}')
        for d in S.dev:
            print(f'   deviation {d["beat"]}: {d["what"]}')
        for x in bad:
            print(f'   CHECK {x}')
        print(f'   J-cut lines: {len(pre)}; lines running past their shot: {len(cross)}; tempo gaps checked: {len(tempo)} '
              f'({sum(1 for x in tempo if x["ok"])} ok)')
        print(f'   median gap between lines: v3.4 {src_med}  ->  v3.5 {new_med}')
    json.dump(rep, open(REPORT, 'w'), indent=1, ensure_ascii=False)
    v34 = [(LABEL[s], f'show/reel/ep01-v34/ep01-v34-{s}.json') for s in SEGS]
    v35 = [(LABEL[s], f'show/reel/ep01-v35/ep01-v35-{s}.json') for s in SEGS if os.path.exists(os.path.join(OUT_DIR, f'ep01-v35-{s}.json'))]
    print('\n---- pacing, v3.4 lock ----')
    print(pacing(v34))
    print('---- pacing, v3.5 lock ----')
    print(pacing(v35))
    tot = sum(r['seconds'] for r in rep.values())
    vo = sum(r['vo'] for r in rep.values())
    print(f'story total: {int(tot // 60)}:{tot % 60:04.1f} ({tot:.1f} s, {sum(r["frames"] for r in rep.values())} frames); '
          f'inner voice: {vo} lines')
    if all(s in rep for s in SEGS):
        write_manifest({s: rep[s] for s in SEGS})


if __name__ == '__main__':
    main(sys.argv[1:])
