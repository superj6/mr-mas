#!/usr/bin/env python3
"""Ep1 v3.1 STICK LOCK: the v3 lock's builder, extended, applying the v3.1 beat plans on top of the v3 timelines.

  python3 audio/reel/ep01-v31/build_timeline.py [seg ...]       (default: all six; plain python3, no venv needed)
      reads  show/episodes/ep01/production/full-v3/beat-plan-v31/<seg>.json  (the v3.1 hand-off, script-v31-notes)
             its "source" timeline (show/reel/ep01-v3/ep01-v3-<seg>.json, as committed: never edited, never rebuilt)
             audio/ep01/v31/<seg>/lines-v31.json                           (the v3.1 takes: V.O., new, cut, reused)
             the v2 timelines, for the restored lines' v2 takes (Sydney, the Atem thread, the hands runner)
      writes show/reel/ep01-v31/ep01-v31-<seg>.json                        (the lock) + ep01-v31.manifest.json
             audio/reel/ep01-v31/lock-report.json                          (per segment: lengths, edits, deviations)
      prints a per-segment report and the pacing tool's output, v2 / v3 / v3.1.

What v3.1 adds to the v3 rules below (lock-v31.md §4):
  restored   a v2 line comes back with its v2 take, placed like a new line (`after` + `gap_s`, or `start+S`).
  start-S    a new line at a negative start is a J-cut replacement; what followed the line it replaces keeps its gap.
  moved      a line with `moved_from` and an `at` is placed as a V.O. is; a merged beat's other sounds still come along.
  new beats  are built through the same row of sounds, from a stand-in beat of the plan's set, frame and characters;
             a beat whose source had no lines is max(est_s, its last sound + 0.8 s).
  est_s      with no audio change, growth goes at the head where the plan says the beat opens earlier (22.01), else
             at the tail; a trim shaves the largest air first (head, gaps, tail; floors 0.3 / 0.3 / 0.1 s), with the
             plan's stated targets first (TRIM_HINTS); a no-line beat scales, or cuts at its head / tail where the plan
             says so (HEAD_CUT, TAIL_CUT).
  Runway     S7.13 is 264 frames and 32.01 62, the demo beat 233 (runway.md §6, §11.5; the lead, 2026-09-27).
  subtitles  spoken lines lose their quotation marks and print ellipses at their ends (the plans' _about).

How a beat plan is applied (the lead's sample, audio/reel/ep01-v3-sample/build_timeline.py, is the reference):
  cut      the beat goes (a sequence marker it carried moves to the next kept beat).
  merge    the beat folds into `into`: its sounds are laid after the target's own, and the whole is fitted to the
           target's length; a line that moves with it (`moved_from`) is placed like a new line.
  keep     the source beat, with the edits below.
  new      a beat after `after`, drawn from the setup its frame names ("(the 5.05 setup)"), or from set/chars.
  A beat is a row of sounds: [head] line [gap] line [gap] ... line [tail]. Every timed thing in it (on-screen text, the
  beat's sounds, name reveals, silent mouths, a character's from/until) is anchored to the nearest line start or end,
  or to the beat's start or end, so it moves with what it belongs to.
    line keep:false          the line and the gap before it go (the first line's head stays the head); what was
                             anchored to it follows its replacement word by word, or the line before it.
    line new / moved         inserted after `after` (a line id) with `gap_s`, or at `start+S`; the gap that followed
                             `after` now follows the new line.
    vo at after:<id>+S       inserted after that line, S before it (the sample's shift()); the next line keeps its gap.
    vo at start+S            the V.O. starts S into the beat; the first line moves only as far as it must to follow
                             it by 0.5 s. In a beat with no lines the beat is max(est_s, S + V.O. + hold).
    vo at before:<id>-S      inserted before that line, ending S before it.
    jcut {line, lead_s}      that line starts lead_s before the cut (t = -lead_s); the lines and items after it move up by
                             the same amount and the beat shortens to match (the lead's ruling; the sample moved the line alone).
    jcut {sound}, lcut       sound only: the bed leads (or carries) the cut by lead_s / over_s (bed.py).
    hold_after_s             the hold after the last sound, where the beat's last sound is new; otherwise at least it.
    arrive_s                 with no audio change: the beat takes est_s, the added time at its head (arrive_s) or its
                             tail (hold_after_s, or neither). A trim (est_s < src_s) comes off the tail, or, in a
                             beat with no lines, scales its timed items.
    onscreen                 replace (exact text, then substring), drop (exact, then substring; "side badge: …"
                             clears the badge), add (the text, with its planning note in brackets taken off).
    caption, music           the caption replaces the source's; the mood goes first in the cues ("music (v3): …").
    names[]                  where Mas's voice names someone in the cast, the strip names them on that word.
  Side badges are cleared on every beat (PLAN: no pointers). Realtime fields (realStart, realDur, real) are dropped.
  A global plate map (script-v3-notes §4) is applied as a safety net; anything it catches is reported.
Nothing here was watched or heard: every number is measured from the files.
"""
import copy
import json
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
BP_DIR = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v31')
OUT_DIR = os.path.join(ROOT, 'show/reel/ep01-v31')
TAKES_DIR = os.path.join(ROOT, 'audio/ep01/v31')
REPORT = os.path.join(ROOT, 'audio/reel/ep01-v31/lock-report.json')
FPS = 24
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
LABEL = {'coldopen': 'COLD', 'act1': 'A1', 'act2': 'A2', 'act3': 'A3', 'act4': 'A4', 'tag': 'TAG'}
EPS = 1e-6
VO_GAP = 0.5          # a line that follows a start+S V.O. comes at least this long after it
VO_HOLD = 0.6         # the hold after a V.O. in a beat with no lines, when the plan sets none
NEW_BEAT_HOLD = 0.8   # the hold after a new beat's V.O. (the sample's 5.06b)
MIN_TAIL = 0.3        # a trim never leaves less than this after the last word

# script-v3-notes §4: the plates and rails, as a safety net under the beat plans' own onscreen edits
GLOBAL_REPLACE = {
    'GERG MOCKBRAN · CO-FOUNDER': 'GERG MOCKBRAN', 'RIMA TAMURI · CTO': 'RIMA TAMURI', 'ALYI · CHIEF SCIENTIST': 'ALYI',
    'NOLE · EARLY FUNDER': 'NOLE', 'MARIO · EX-NOPEAI · THE CAREFUL RIVAL': 'MARIO', 'OIGNEB · AI PIONEER · CITATIONS: ↑': 'OIGNEB',
    'LAHTNEMULB · OPENED WITH A CLONE': 'LAHTNEMULB', "ADELINA · MARIO'S CO-FOUNDER": 'ADELINA', 'TTEMME · RAN A STREAMING SITE': 'TTEMME',
    'RADNUS · RUNS ELGOOG · POLITELY ON FIRE': 'RADNUS · POLITELY ON FIRE', 'NOLE · EARLY FUNDER · BUILDING HIS OWN': 'NOLE · BUILDING HIS OWN',
    'RAIL: JAN 23, 2023 · ~$10B': 'RAIL: JAN 23, 2023', 'RAIL: OCT 30, 2023 · EO 14110': 'RAIL: OCT 30, 2023',
    'RAIL: TPOOL, HIS FIRST COMPANY · TWO STAFF REVOLTS': 'RAIL: TPOOL, HIS FIRST COMPANY', 'EQUITY: 0 (HE TOLD THE SENATE)': 'EQUITY: 0',
    'MACROSOFT · ~$10B IN': 'MACROSOFT · BILLIONS IN', 'NEWS ALERT': 'ELGOOG · CODE RED', 'ALYI / CO-FOUNDER': 'ALYI',
    'YRRAL (NOT THAT YRRAL)': 'THE OTHER YRRAL',
}
GLOBAL_DROP = {'RIMA TAMURI · HIS CTO', 'MARIO · RUNS THE RIVAL LAB', 'TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS',
               'NOTNIH · WORRIES FULL-TIME.', "MISANTHROPIC · MARIO'S LAB", 'NOTERB · ENFORCES THE RULEBOOK.',
               'RAIL: TESTIFIES HE HAS NO EQUITY', 'WHAT THEY DIDN\'T KNOW', 'catching up: 7 weeks', 'UI: Look at glass of water'}
# beat-plan "add" / "replace" values written as planning notes -> the on-screen text itself
ADD_TEXT = {
    "each tile's own name label: MAS MANALT · ALYI · NELEH · MADA · THE QUIET VOTE": 'MAS MANALT · ALYI · NELEH · MADA · THE QUIET VOTE',
    'Remove MAS MANALT from the meeting?  [ Remove ] (greyed, one dither step a beat)': 'Remove MAS MANALT from the meeting?  [ Remove ]',
}
# a source caption that describes a line the plan dropped (checked in build: a caption quoting a dropped line)
CAPTION_FIX = {}
# a kept caption that quotes a line the v3.1 plan changed: the same caption with the new words (the plan gave no caption)
CAPTION_SUB = {'S3.04b': ('"More. Soon."', '"We\'ll say we will."'), 'S4.14': ('"Step four?"', '"Step four, Mada?"'),
               'S7.03': ('"Hello."', '"Down here."')}
# where an added item appears, when the plan says "moved from" or the frame fixes it (seconds into the beat)
ADD_AT = {('v31-S1.08d', 'ALYI'): 1.2}   # the pointer comes in before the click
# sounds that end a no-line beat which the V.O. lengthens: they keep their distance from the beat's end (the plan's
# caption says "then the click" / "then taps"; the sample moved S1.06's click the same way)
END_ANCHORED = {('S1.02', 'dialog_ok_click'), ('S1.06', 'dialog_ok_click'), ('22.02', 'key_tap_soft_01')}
# sounds a v3.1 edit takes out of a kept beat (the plan moves the action elsewhere)
SOUND_DROP = {('S1.09', 'dialog_ok_click'): 'the Cancel click: the Remove dialog (v31-S1.08d) now has the click'}
# sounds for new beats and changed actions (the plans' `sounds` notes, as stick SFX; the A2 pass does the real ones).
# at < 0 counts from the beat's end.
NEW_SOUNDS = {
    'v31-10.01': [{'name': 'revolving_door', 'at': 0.1, 'gain': -30}, {'name': 'ui_toast_pop', 'at': 0.6, 'gain': -22}],
    'v31-10.03': [{'name': 'pen_tick_1', 'at': 0.9, 'gain': -24}],
    'v31-10.04': [{'name': 'bell_ding_F6', 'at': 0.3, 'gain': -22}],
    'v31-12.03': [{'name': 'synth:thud', 'at': 0.0, 'gain': -8}, {'name': 'synth:pen', 'at': -1.2, 'gain': -30, 'dur': 1.1}],
    'v31-S1.08d': [{'name': 'dialog_ok_click', 'at': 1.9, 'gain': -16}],
    'v31-19.03': [{'name': 'orb_servo', 'at': 0.8, 'gain': -28}, {'name': 'orb_servo', 'at': 1.9, 'gain': -28}, {'name': 'orb_servo', 'at': 3.0, 'gain': -28}],
    'S7.06': [{'name': 'extinguisher_pin', 'at': -1.4, 'gain': -20}],
    'v31-S7.03b': [{'name': 'key_tap_soft_02', 'at': -0.8, 'gain': -24}],
}
# sequence markers for the new scenes (the reel's margin slate and the bar's lower row); a marker moved to a new opener
NEW_SEQ = {'v31-10.01': {'id': '10', 'side': '', 'place': 'the NopeAI lobby: Sydney', 'time': 'Feb 13 - 17, 2023'},
           'v31-20.07': {'id': '20A', 'side': '', 'place': "his monitor: Neleh's paper", 'time': 'Oct 2023'},
           'v31-S3.00p': {'id': 'S3', 'side': '', 'place': "Neleh's desk: the board's side", 'time': 'Fri Nov 17, 2023 · 11:52 AM'}}
SEQ_MOVE = {'18.01': 'v31-18.00'}
# new speakers the source timelines' casts don't have
CAST_ADD = {'tag': {'elgoog-demo': {'name': "ELGOOG'S DEMO", 'role': 'THE DEMO FILM', 'known': True}}}
# where est_s grows a beat with unchanged audio at its head (the plan says it opens earlier)
HEAD_GROW = {'22.01'}
# no-line trims that cut at the head (the arrival moved away) or the tail (the splice point), instead of scaling
HEAD_CUT = {'18.01'}
TAIL_CUT = {'32.01'}
# the plan's stated air targets for a trim (seconds): head, tail, or the gap before a line
TRIM_HINTS = {'S3.00a': {'head': 0.3, 'before:a5-27-03': 1.0}, '13.06': {'head': 0.6}, 'S3.05': {'head': 1.6},
              'S4.13': {'head': 1.6}, 'S3.03': {'tail': 0.42}, '9.13': {'tail': 0.11}}
# frame-exact lengths (the Runway inserts: runway.md §6 and §11.5; the lead's note, 2026-09-27)
EXACT_FRAMES = {('act4', 'S7.13'): 264, ('tag', '32.01'): 62, ('tag', 'v31-32.01d'): 233}
PLAN_PATCH = {
    # S7.13: the hourglass insert fills k128-263 and was built around his line at k134-166 (runway.md §11.3); the
    # plan dropped the line as a runtime trim (R7), which the insert's fixed length makes free, so it stays
    ('act4', 'S7.13'): {'keep_line': 'a5-30-18', 'est_s': 264 / FPS,
                        'why': 'the Runway hourglass insert: 264 frames, +69 at the tail (runway.md §11.5); its line kept (R7 made free)'},
    ('tag', '32.01'): {'est_s': 62 / FPS, 'why': 'the Runway demo splices at tag frame 62 (runway.md §6)'},
    ('tag', 'v31-32.01d'): {'est_s': 233 / FPS, 'why': 'the Runway demo insert is 233 frames (runway.md §4a)'},
}
# (the J-cut sounds that belong to the NEXT scene are listed in bed.py)


# script-v31-notes §1.4, ranked: applied in order only if the story runs over about 21:10 (the lead), as overrides on
# the plans, logged. V31_TRIMS=O1,O3 applies them by hand.
TARGET_MAX = 21 * 60 + 10
TRIMS = [
    {'ref': 'O1', 'seg': 'act1', 'beat': '6.04', 'cut_beat': True, 'saves': 3.8, 'what': "6.04: Nole's Dec 3 post, whole"},
    {'ref': 'O3', 'seg': 'act1', 'beat': 'v31-10.02', 'drop_line': 'e1-a1-10-06', 'saves': 3.2, 'what': "v31-10.02: Sydney's opener"},
    {'ref': 'O4', 'seg': 'act4', 'beat': 'v31-S7.03b', 'cut_beat': True, 'saves': 2.6, 'what': "v31-S7.03b: Tuesday's invite"},
]
# The first build ran 21:13.4, over the lead's "about 21:10": O1 applies (the ranked first; it lands under 21:10).
APPLIED_TRIMS = [t for t in TRIMS if t['ref'] in os.environ.get('V31_TRIMS', 'O1').split(',')]


def r3(x):
    return round(float(x) + 0.0, 3)


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


def load_takes():
    takes = {}
    for seg in SEGS:
        f = os.path.join(TAKES_DIR, seg, 'lines-v31.json')
        if os.path.exists(f):
            for r in jl(f):
                takes[r['id']] = r
    return takes


def take_line(r, lid, who, text, t, tag):
    """a v3 take as a timeline line (the dialogue-reel line format of the v2 timelines; the sample's vo_line)"""
    a_in, a_out = r['pace']['audible_in_s'], r['pace']['audible_out_s']
    return {'id': lid, 'who': who, 'text': text, 't': r3(t), 'dur': r3(a_out - a_in), 'audio': r['file'], 'in': a_in,
            'words': [[w['w'], r3(w['t0'] - a_in), r3(w['t1'] - a_in)] for w in r['words']], 'tag': tag, 'cut': False}


def strip_note(s):
    s = ADD_TEXT.get(s, s)
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
                 ('TWO-SHOT', 'medium'), ('2S', 'medium'), ('OTS', 'medium'), ('HIGH', 'wide'), ('WIDE', 'wide')):
        if f.startswith(k) or f' {k}' in f[:12]:
            return v
    return 'medium'


def norm_word(w):
    return re.sub(r"('s|’s)$", '', re.sub(r'[^\w\'’]', '', w.lower()))


class Seg:
    """one segment: the plan, the source timeline, and the report"""

    def __init__(self, seg, takes):
        self.seg = seg
        self.plan = jl(os.path.join(BP_DIR, f'{seg}.json'))
        # the cold open's black pre-beat (below) takes 1.01's sound lead, so 1.01 keeps its own length
        if seg == 'coldopen':
            b0 = self.plan['beats'][0]
            lead = next((j['lead_s'] for j in b0.get('jcut', []) if 'sound' in j and 'black' in j['sound']), 0.0)
            if lead and abs(b0['est_s'] - b0['src_s'] - lead) < 0.02:
                b0['est_s'] = b0['src_s']
        self.trims = []
        self.patched = []
        for (pseg, bid), p in PLAN_PATCH.items():
            if pseg != seg:
                continue
            pb = next(b for b in self.plan['beats'] if b['id'] == bid)
            if p.get('keep_line'):
                for l in pb['lines']:
                    if l['id'] == p['keep_line']:
                        l.clear()
                        l.update(id=p['keep_line'], keep=True)
            was = pb.get('est_s')
            pb['est_s'] = p['est_s']
            self.patched.append({'beat': bid, 'what': f'{p["why"]}: est_s {was} -> {p["est_s"]:.3f}'
                                                       f'{" and line " + p["keep_line"] + " kept" if p.get("keep_line") else ""}'})
        for tr in APPLIED_TRIMS:
            if tr['seg'] != seg:
                continue
            pb = next(b for b in self.plan['beats'] if b['id'] == tr['beat'])
            if tr.get('cut_beat'):
                pb['action'] = 'cut' if pb['action'] == 'keep' else 'skip'
            for l in pb.get('lines', []):
                if l['id'] == tr.get('drop_line'):
                    l['keep'] = False
                    l['restored'] = False
                    l['new'] = False
                    l['why'] = f'{tr["ref"]} (script-v31-notes §1.4): {tr["what"]}'
            self.trims.append(tr)
        self.v2lines = {}
        for f in ('show/reel/ep01-full/ep01-act1-v2.json', 'show/reel/ep01-full/ep01-act3-v2.json'):
            for vb in jl(f)['beats']:
                for vl in vb.get('lines', []):
                    self.v2lines[vl['id']] = vl
        self.src_path = self.plan['source']
        self.src = jl(self.src_path)
        self.S = {b['id']: b for b in self.src['beats']}
        self.takes = takes
        self.edits, self.dev, self.safety = [], [], []
        self.cast = set((self.src.get('cast') or {}).keys()) | {'mas', 'gerg', 'rima', 'alyi', 'mario', 'radnus', 'tasya', 'nole',
                                                                  'neleh', 'mada', 'kram', 'sirrah', 'nedib', 'sydney'}

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
                continue
            for k, v in rep.items():
                v = strip_note(v)
                if t == k:
                    t = v
                    used.add(k)
                elif k in t and k != v:
                    t = t.replace(k, v)
                    used.add(k)
            if t in GLOBAL_DROP:
                self.safety.append(f'{b["id"]}: dropped "{t}" (script-v3-notes §4)')
                if d.get('at') is not None:
                    drops_at.append((d['at'], t))
                continue
            if t in GLOBAL_REPLACE:
                self.safety.append(f'{b["id"]}: "{t}" -> "{GLOBAL_REPLACE[t]}" (script-v3-notes §4)')
                t = GLOBAL_REPLACE[t]
            if not t:
                continue
            if isinstance(it, dict):
                d = dict(d, text=t)
                out.append(d)
            else:
                out.append(t)
        for k in list(rep) + [k for k in drop if not k.startswith('side badge')]:
            if k not in used and not (k in rep and strip_note(rep[k]) == k):
                self.deviate(b['id'], f'on-screen "{k}" is not in the source beat (nothing to {"replace" if k in rep else "drop"})')
        for a in add:
            t = strip_note(a)
            if not t:
                self.note(pb['id'], f'on-screen add "{a}" is a note for the art pass only (nothing to show in the stick)')
                continue
            tt = note_times(a)
            at = tt[0] if tt else ADD_AT.get((pb['id'], t), 0.2)   # set dressing: from the shot's start
            out.append({'text': t, 'at': r3(min(at, max(0.0, b['reelDur'] - 0.5))), 'until': tt[1] if tt else None, '_add': True})
            self.note(pb['id'], f'on-screen add: "{t}"' + (f' ({tt[0]}-{tt[1]} s)' if tt else ''))
        b['onscreen'] = out

    def drop_coincident(self, b, drops_at, bid):
        """a name reveal that starts with a dropped plate goes with it; so does a sound that starts with dropped in-world
        text (a stamped quote, a caller ID), but not one that starts with a dropped device overlay (UI:, RAIL: ...):
        the overlay only marked the action (33.01's THUD)"""
        device = re.compile(r'^\s*(UI|RAIL|TICKER|BUTTON|CAPTION|LOWER THIRD)\s*:', re.I)
        for key, what in (('sounds', 'sound'), ('names', 'name reveal')):
            ats = [a for a, t in drops_at if key == 'names' or not device.match(t)]
            gone = [x for x in b.get(key, []) if any(abs(x['at'] - a) < 0.02 for a in ats)]
            if gone:
                b[key] = [x for x in b[key] if x not in gone]
                self.note(bid, f'{what}(s) {", ".join(x.get("name") or x.get("id") for x in gone)} dropped with the on-screen item '
                               f'they start on')

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
            why = SOUND_DROP.get((pb['id'], sd['name']))
            if why:
                b['sounds'].remove(sd)
                self.note(pb['id'], f'sound {sd["name"]} at {sd["at"]} dropped: {why}')

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
        # a dropped line's replacement (word-mapped re-anchoring)
        repl = {}
        for lid, l in dropped.items():
            for n in new:  # the new line's tag names the old id, or the old line's why names the new id
                if lid in (n.get('tag') or '') or n['id'] in (l.get('why') or ''):
                    repl[lid] = n['id']
            for v in vos:
                if v['id'] in (l.get('why') or ''):
                    repl.setdefault(lid, v['id'])
        vo_ids = {v['id'] for v in vos}

        # merged beats: their sounds are laid after the target's own (then fitted), a moved line comes as a slot
        mtl = dur0
        merged_sounds = []
        for mb in merged:
            ms = self.S[mb['id']]
            mv = [x for x in ms.get('lines', []) if any(ml['moved_from'] == mb['id'] and ml['id'] == x['id'] for ml in moved)]
            for sd in ms.get('sounds', []):
                if any(x['t'] - 1.0 <= sd['at'] <= x['t'] + x['dur'] for x in mv):
                    continue  # a moved line brings the sounds under it (below)
                merged_sounds.append(dict(sd, at=r3(mtl + sd['at']), _merged=mb['id'], _mdur=ms['reelDur'], _mat=sd['at']))
            mtl += ms['reelDur']
            self.note(pb['id'], f'{mb["id"]} merged in ({mb.get("cut_ref", "")}): {len(ms.get("sounds", []))} sound(s), '
                                f'{len(ms.get("lines", []))} line(s) of which {sum(1 for ml in moved if ml["moved_from"] == mb["id"])} moved')

        audio_changed = bool(dropped or new or moved or vos)
        src_lines = sorted(sb.get('lines', []), key=lambda l: l['t'])

        if not src_lines and not new and not moved:
            return self.build_noline(pb, b, sb, dur0, mtl, merged_sounds, vos, dropped)

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

        # anchors for every timed element
        refs = [('start', 0.0)] + [r for i, s in enumerate(slots) for r in ((('s', i), s['old_s']), (('e', i), s['old_e']))] + [('end', dur0)]

        def anchor(x):
            if x is None:
                return None
            if not slots:
                return ('start', x)   # a beat that had no lines keeps its items on its own clock
            for i, s in enumerate(slots):
                if s['old_s'] - EPS <= x <= s['old_e'] + EPS:
                    return (('s', i), x - s['old_s'])
            best = min(refs, key=lambda r: (abs(x - r[1]), r[1]))
            return (best[0], x - best[1])

        els = []  # (container, key, anchor)
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
                order[1]['gap'] = s['gap']   # the head stays the head
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

        def place_start(slot, S):
            """a slot at S s into the beat. Before every line: the first line moves only as far as it must. After a
            line that starts earlier: it goes in after that line at S (or just after it, if that line is still speaking),
            and what follows moves only as far as it must."""
            pos, t_ = [], None
            for x in order:
                s0 = x['gap'] if t_ is None else t_ + x['gap']
                pos.append((s0, s0 + x['len']))
                t_ = s0 + x['len'] if t_ is None else max(t_, s0 + x['len'])
            k = sum(1 for s0, _ in pos if s0 <= S + EPS)
            if order and '_gap_after_dropped_first' in order[0]:
                k = 0   # the first line was dropped: this takes its place at the front (a replacement)
            if k > 0 and order:
                prev_e = max(e0 for _, e0 in pos[:k])
                slot['gap'] = max(S - prev_e, 0.3)
                start_new = prev_e + slot['gap']
                if k < len(order):
                    order[k]['gap'] = max(VO_GAP, pos[k][0] - (start_new + slot['len']))
                order.insert(k, slot)
                self.note(pb['id'], f'{slot["id"]} at start+{S}: after {order[k - 1]["id"]} (an earlier line), at {start_new:.2f} s')
                return
            slot['gap'] = S
            if order:
                first = order[0]
                t0 = first['gap']
                if '_gap_after_dropped_first' in first and not slot.get('vo'):
                    # a replacement for the first line: what followed it keeps its gap (7.01's J-cut replacement)
                    first['gap'] = first.pop('_gap_after_dropped_first')
                else:
                    first['gap'] = max(VO_GAP, t0 - (S + slot['len']))
            order.insert(0, slot)

        def place_at(slot, at):
            """V.O.-style placement: start+S, after:<id>+S, before:<id>-S"""
            if at.startswith('start'):
                place_start(slot, float(at[5:]))
            elif at.startswith('after:'):
                ref, S = re.match(r'after:(.+)\+([\d.]+)$', at).groups()
                insert_after(ref, slot, float(S))
            elif at.startswith('before:'):
                ref, S = re.match(r'before:(.+)-([\d.]+)$', at).groups()
                tgt = next((x for x in order if x['id'] == ref), None)
                k = order.index(tgt)
                slot['gap'] = tgt['gap']
                tgt['gap'] = float(S)
                order.insert(k, slot)

        for l in moved:
            ms = self.S[l['moved_from']]
            ml = next(x for x in ms['lines'] if x['id'] == l['id'])
            slot = {'id': l['id'], 'line': copy.deepcopy(ml), 'len': ml['dur'], 'new': True, 'moved': True,
                    'carry': [dict(sd, _off=sd['at'] - ml['t']) for sd in ms.get('sounds', []) if ml['t'] - 1.0 <= sd['at'] <= ml['t'] + ml['dur']]}
            if ml.get('tag') == 'V.O.':
                slot['vo'] = True
            if l.get('at'):
                place_at(slot, l['at'])
            else:
                insert_after(l.get('after'), slot, l.get('gap_s', 0.5))
            self.note(pb['id'], f'line {l["id"]} moved in from {l["moved_from"]} at {l.get("at") or ("after " + str(l.get("after")))}, '
                                f'with {len(slot["carry"])} sound(s)')
        for l in new:
            rep_of = next((d for d, n in repl.items() if n == l['id']), None)
            text = l['text'].strip()
            if l.get('restored'):
                v2 = self.v2lines.get(l['id'])
                if not v2:
                    self.deviate(pb['id'], f'restored line {l["id"]} is not in the v2 timelines: left out')
                    continue
                ln = copy.deepcopy(v2)
                ln.update(who=l.get('who', v2['who']), text=text, tag=l.get('tag', ''), t=0.0)
                ln.pop('cut', None)
                ln['cut'] = False
            else:
                r = self.takes.get(l['id'])
                if not r:
                    self.deviate(pb['id'], f'new line {l["id"]} has no take: left out')
                    continue
                tag = l.get('tag') if l.get('tag') is not None else (
                    self.S[pb['id']]['lines'][[x['id'] for x in sb['lines']].index(rep_of)].get('tag', '') if rep_of else '')
                ln = take_line(r, l['id'], l['who'], text, 0.0, tag)
            slot = {'id': l['id'], 'line': ln, 'len': ln['dur'], 'new': True}
            after = l.get('after')
            if isinstance(after, str) and after.startswith('start'):
                place_start(slot, float(after[5:]))
            else:
                insert_after(after, slot, l.get('gap_s', 0.5))
            self.note(pb['id'], f'new line {l["id"]} ({l["who"]}, {ln["dur"]:.2f} s) {("after " + after) if after else ""}'
                                f'{(" +" + str(l.get("gap_s"))) if after and not str(after).startswith("start+") else ""}'
                                f'{(" replacing " + rep_of) if rep_of else ""}')
        for v in vos:
            r = self.takes.get(v['id'])
            if not r:
                self.deviate(pb['id'], f'V.O. {v["id"]} has no take: left out')
                continue
            ln = take_line(r, v['id'], 'mas', v['text'], 0.0, 'V.O.')
            slot = {'id': v['id'], 'line': ln, 'len': ln['dur'], 'new': True, 'vo': True}
            place_at(slot, v['at'])
            self.note(pb['id'], f'V.O. {v["id"]} ({ln["dur"]:.2f} s) at {v["at"]}')

        # ---------------------------------------------------------- lay out
        head0 = slots[0]['gap'] if slots else 0.0
        if not order:
            # every line went and nothing replaced it: the beat is its head and its tail (a trim may ask for more)
            end = head0 + (end_mode[1] if end_mode[0] == 'tail' else 0.5)
            if pb.get('min_s'):
                end = max(end, pb['min_s'])
            if pb.get('est_s') and abs(pb['est_s'] - end) > 0.05:
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
            # the source beat had no lines (a new beat, or a kept one that gains lines): the plan's length, or longer
            end = max(pb.get('est_s', dur0), t + (hold if hold is not None else NEW_BEAT_HOLD))
        elif last.get('new') or (last['id'] != slots[-1]['id'] if slots else True):
            # the last sound is new (or the old last line went): the plan's hold, else the old tail rule
            if hold is not None and last.get('new'):
                end = t + hold
            elif end_mode[0] == 'lcut':
                end = last['s'] + end_mode[1]
            else:
                end = t + end_mode[1]
        else:
            end = last['s'] + end_mode[1] if end_mode[0] == 'lcut' else t + max(end_mode[1], hold or 0.0)
            if hold is not None and end_mode[0] == 'tail' and hold > end_mode[1] + EPS and audio_changed:
                self.note(pb['id'], f'hold after the last line {end_mode[1]:.2f} -> {hold:.2f} s')
        if order and dropped and not (new or vos or moved) and pb.get('est_s', 0) > end + 0.3:
            # lines dropped with nothing in their place, and the plan keeps the picture time (21.04: the Orb answers)
            self.note(pb['id'], f'lines dropped, the plan keeps {pb["est_s"]} s for the picture (computed {end:.2f} s)')
            end = pb['est_s']
        if order and pb.get('min_s') and pb['min_s'] > end + EPS:
            self.note(pb['id'], f'kept at {pb["min_s"]:.2f} s ({pb.get("min_why", "min_s")}; computed {end:.2f} s)')
            end = pb['min_s']
        if not audio_changed:
            end = dur0  # (unchanged audio: est_s rules below)
        elif src_lines and all(l['id'] in dropped for l in src_lines) and (new or vos) and pb.get('est_s', 0) > end + EPS:
            self.note(pb['id'], f'every line replaced: the beat keeps the plan\'s {pb["est_s"]} s (computed {end:.2f} s)')
            end = pb['est_s']

        # J-cuts (the lead's ruling, 2026-09-27): the line starts lead_s under the outgoing shot, and the lines and timed
        # items after it move up by the same amount, so the conversation keeps the rhythm its takes were read at; the
        # beat shortens to match (the sample moved the line alone, which left a longer pause after it)
        for j in jcuts:
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
        # re-anchor elements
        new_pos = {('s', i): None for i in range(len(slots))}
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
            # a removed line: follow its replacement word by word, else the line before it
            rid = repl.get(s['id'])
            rs = next((x for x in order if x['id'] == rid), None)
            if rs is not None:
                x_old = (s['old_s'] if kind == 's' else s['old_e']) + off - s['old_s']
                if rid in vo_ids or not (-EPS <= x_old <= s['len'] + EPS):
                    return x_old + s['old_s']   # replaced by a V.O. (or outside the old line): its own clock
                return rs['s'] + map_words(s['line'], rs['line'], x_old)
            k = i - 1
            while k >= 0 and old_by_i[k].get('removed'):
                k -= 1
            # no replacement: the dropped line's picture time keeps its place after the line before it
            p0 = old_by_i[k]['e'] + (s['old_s'] - old_by_i[k]['old_e']) if k >= 0 else s['old_s']
            return p0 + (off if kind == 's' else s['len'] + off)

        for cont, key, a in els:
            if a is not None:
                cont[key] = r3(resolve(a))
        # lines
        b['lines'] = []
        for s in order:
            ln = s['line']
            ln['t'] = r3(s['s'])
            b['lines'].append(ln)
            for sd in s.get('carry', []):
                b.setdefault('sounds', []).append({k: v for k, v in sd.items() if k != '_off'} | {'at': r3(s['s'] + sd['_off'])})
        b['reelDur'] = r3(end)
        for ms in merged_sounds:  # fitted into the target's length (or kept at its distance from the end)
            at = end - (ms['_mdur'] - ms['_mat']) if (pb['id'], ms['name']) in END_ANCHORED else ms['at'] * end / mtl
            b.setdefault('sounds', []).append({k: v for k, v in ms.items() if not k.startswith('_')} | {'at': r3(at)})

        if not audio_changed:
            self.fit_unchanged(pb, b, sb)
        # clamp, sort
        self.tidy(b)
        return b

    def fit_unchanged(self, pb, b, sb):
        """no audio change: the beat takes est_s. Growth goes at the head where the plan says the beat opens earlier,
        else at the tail; a trim shaves air (the plan's stated targets first, then the largest air), and every line
        and timed item moves with the air around it."""
        dur0, est = sb['reelDur'], pb.get('est_s', sb['reelDur'])
        delta = est - dur0
        if abs(delta) < 0.02:
            b['reelDur'] = dur0   # exact: the frame layout stays the source's
            return
        lines = sorted(b.get('lines', []), key=lambda l: l['t'])
        if delta > 0:
            if pb['id'] in HEAD_GROW:
                self.shift_all(b, delta)
                self.note(pb['id'], f'+{delta:.2f} s at the head (the plan: the beat opens earlier)')
            else:
                self.note(pb['id'], f'+{delta:.2f} s at the tail')
            b['reelDur'] = r3(est)
            return
        if not lines:
            self.scale_all(b, est / dur0)
            self.note(pb['id'], f'trim {dur0:.2f} -> {est:.2f} s, timed items scaled')
            b['reelDur'] = r3(est)
            return
        # the air: head, the gaps between lines, the tail (an L-cut line leaves no tail)
        segs = [['head', 0.0, lines[0]['t']]]
        for a, c in zip(lines, lines[1:]):
            segs.append([f'before:{c["id"]}', a['t'] + a['dur'], c['t']])
        last_e = max(l['t'] + l['dur'] for l in lines)
        segs.append(['tail', last_e, dur0])
        floor = {'head': 0.3, 'tail': 0.1}
        cut = {k: 0.0 for k, _, _ in segs}
        need = -delta
        for k, target in (TRIM_HINTS.get(pb['id']) or {}).items():
            seg = next((x for x in segs if x[0] == k), None)
            if seg and need > 1e-6:
                take = min(need, max(0.0, (seg[2] - seg[1]) - target))
                cut[k] += take
                need -= take
                floor[k] = min(target, seg[2] - seg[1])   # the plan's stated air is also its floor
        while need > 1e-4:   # the largest air first, down to its floor, 10 ms at a time
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
        # the time map: each air stretch [a, c] is compressed to [a, c - cut] (what sits in it keeps its order and
        # spacing, scaled); everything after it moves up by the cut
        marks = [(a, c, cut[k]) for k, a, c in segs if cut[k] > 0 and c > a]
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
        self.note(pb['id'], f'trim {dur0:.2f} -> {est:.2f} s: ' + ', '.join(f'{k} −{v:.2f}' for k, v in cut.items() if v > 1e-3))
        b['reelDur'] = r3(dur0 - (-delta - need))

    def build_noline(self, pb, b, sb, dur0, mtl, merged_sounds, vos, dropped):
        """a beat with no lines (after the plan's drops): the V.O. and the timed items on their own clock"""
        est = pb.get('est_s', dur0)
        for lid in dropped:
            self.note(pb['id'], f'line {lid} dropped ("{dropped[lid].get("text", "")[:50]}")')
        b['lines'] = []
        b.setdefault('sounds', [])
        b['sounds'] = b['sounds'] + [{k: v for k, v in s.items() if not k.startswith('_')} for s in merged_sounds]
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
        if abs(target - mtl) >= 0.02 or merged_sounds:
            if target < mtl - EPS and pb['id'] in HEAD_CUT:
                self.shift_all(b, target - mtl)
                self.note(pb['id'], f'{mtl:.2f} -> {target:.2f} s, cut at the head (the arrival moved away)')
            elif target < mtl - EPS and pb['id'] in TAIL_CUT:
                self.note(pb['id'], f'{mtl:.2f} -> {target:.2f} s, cut at the tail (items after the cut clamp to it)')
            elif target < mtl - EPS or merged_sounds:
                self.scale_all(b, target / mtl)
                self.note(pb['id'], f'{mtl:.2f} -> {target:.2f} s, timed items scaled ×{target / mtl:.2f}')
            elif pb.get('arrive_s') is not None and pb.get('hold_after_s') is None and not vos:
                self.shift_all(b, target - mtl)
                self.note(pb['id'], f'arrival +{target - mtl:.2f} s at the head (arrive_s {pb["arrive_s"]})')
            else:
                self.note(pb['id'], f'+{target - mtl:.2f} s at the tail')
                for sd in b.get('sounds', []):
                    if (pb['id'], sd['name']) in END_ANCHORED:
                        was = sd['at']
                        sd['at'] = r3(target - (mtl - was))
                        self.note(pb['id'], f'{sd["name"]} {was:.2f} -> {sd["at"]:.2f} s: it ends the beat ("then …" in the caption)')
        b['reelDur'] = dur0 if abs(target - dur0) < EPS and not merged_sounds else r3(target)
        self.tidy(b)
        return b

    def timed(self, b):
        for d in b.get('onscreen', []):
            if isinstance(d, dict) and not d.get('_add'):
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
                o.pop('_add', None)
                if o.get('until') is not None and o['until'] <= o['at']:
                    o['until'] = r3(min(d, o['at'] + 0.5))
        if b.get('sounds'):
            b['sounds'].sort(key=lambda s: s['at'])

    # ------------------------------------------------------------------ a new beat
    def build_new(self, pb, prev):
        """a new beat: a stand-in source beat of the plan's set, frame, room and characters (no lines, the plan's
        length), then the same row of sounds as a kept beat"""
        style = pb.get('style') or 'BASE'
        act = prev.get('act') or next((x.get('act') for x in self.src['beats'] if x.get('act')), None)
        sb = {'id': pb['id'], 'act': act, 'kind': 'scene', 'set': pb.get('set', 'void'),
              'style': style if style in ('BASE', '1-BIT', 'EARLY-WEB16', 'GLYPH', 'LEDGER', 'TERMINAL', '2-TONE') else 'BASE',
              'shot': frame_of(pb.get('frame')), 'frame': pb.get('frame', ''), 'side': '', 'room': pb.get('room') or prev.get('room', ''),
              'chars': [re.sub(r'\s*\(.*$', '', c).strip() for c in pb.get('chars', [])], 'caption': pb.get('caption', ''),
              'lines': [], 'onscreen': [], 'reelDur': pb.get('est_s', 3.0), 'fx': [], 'cues': []}
        if style not in ('BASE', '1-BIT', 'EARLY-WEB16', 'GLYPH', 'LEDGER', 'TERMINAL', '2-TONE'):
            sb['cues'] = [f'style (v3.1): {style}']
        self.S[pb['id']] = sb
        self.note(pb['id'], f'new beat: {pb.get("frame", "")} ({sb["set"]}, {sb["room"]}, {", ".join(sb["chars"]) or "no figures"})')
        return self.build_keep(pb, [])

    # ------------------------------------------------------------------ names and cues
    def finish(self, b, pb):
        if pb.get('caption') and b.get('caption') != pb['caption']:
            b['caption'] = pb['caption']
            self.note(pb['id'], 'caption from the plan')
        elif pb['id'] in CAPTION_FIX:
            self.deviate(pb['id'], f'the source caption quoted a dropped line; now "{CAPTION_FIX[pb["id"]]}"')
            b['caption'] = CAPTION_FIX[pb['id']]
        elif pb['id'] in CAPTION_SUB and CAPTION_SUB[pb['id']][0] in (b.get('caption') or ''):
            o, n = CAPTION_SUB[pb['id']]
            b['caption'] = b['caption'].replace(o, n)
            self.note(pb['id'], f'caption: {o} -> {n} (the line the plan changed)')
        for l in pb.get('lines', []):
            first = re.split(r'(?<=[.?!])\s', l.get('text', '') or '')[0].strip('"… ')
            if l.get('keep') is False and first and first[:12] in (b.get('caption') or '') and pb['id'] not in ('21.04',):
                self.deviate(pb['id'], f'the caption still quotes the dropped line "{first}"')
        if pb.get('music'):
            cues = [c for c in b.get('cues', []) if not c.lower().startswith('music')]
            b['cues'] = [f'music (v3.1): {pb["music"]}'] + cues
        for ln in b.get('lines', []):
            t = clean_line_text(ln['text']) if ln.get('tag') != 'V.O.' else ln['text']
            if t != ln['text']:
                ln['text'] = t
        for lid, fx in (pb.get('line_text_fix') or {}).items():
            m = re.match(r'\s*(\S+)\s*→\s*(\S+)', fx)
            for ln in b.get('lines', []):
                if m and ln['id'] == lid and m.group(1) in ln['text']:
                    ln['text'] = ln['text'].replace(m.group(1), m.group(2))
                    self.note(pb['id'], f'line {lid} text: {m.group(1)} → {m.group(2)} (the take stands)')
        for sd in NEW_SOUNDS.get(pb['id'], []):
            at = sd['at'] if sd['at'] >= 0 else b['reelDur'] + sd['at']
            b.setdefault('sounds', []).append(dict(sd, at=r3(max(0.0, at))))
            b['sounds'].sort(key=lambda x: x['at'])
            self.note(pb['id'], f'sound {sd["name"]} at {max(0.0, at):.2f} s (the plan\'s sound note, as a stick SFX)')
        # a plate the plan adds names its character from that frame (SYDNEY, KRAM)
        have = {n['id'] for n in b.get('names', [])}
        for a in (pb.get('onscreen') or {}).get('add', []):
            t = strip_note(a).strip().lower()
            if t in self.cast and t not in have and t != 'mas':
                at = next((o['at'] for o in b.get('onscreen', []) if isinstance(o, dict) and o['text'].lower() == t), 0.2)
                b.setdefault('names', []).append({'id': t, 'at': at})
                have.add(t)
                self.note(pb['id'], f'names[]: {t} at {at} s (its plate)')
        # where Mas's voice names someone in the cast, the strip names them on that word
        for ln in b.get('lines', []):
            if ln.get('tag') != 'V.O.' or not ln['id'].startswith(('v3-vo', 'v31-vo')):
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
                else:
                    for n in b['names']:
                        if n['id'] == k and n['at'] > at + EPS:
                            self.note(pb['id'], f'names[]: {k} {n["at"]:.2f} -> {at:.2f} s (his voice names them before the plate)')
                            n['at'] = at

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
                if isinstance(sb.get('seq'), dict) and not sb['seq'].get('sub'):
                    pending_seq = dict(sb['seq'], side='')
                self.note(pb['id'], f'cut ({pb.get("cut_ref", "")}): {sb["reelDur"]:.2f} s')
                continue
            if act in ('merge', 'skip'):
                continue
            if act == 'keep':
                b = self.build_keep(pb, merges.get(pb['id'], []))
            elif act == 'new':
                b = self.build_new(pb, out[-1] if out else {})
            else:
                raise ValueError(act)
            if pb.get('moved') and out and b.get('room') != out[-1].get('room'):
                self.note(pb['id'], f'moved ({pb["moved"].get("to", "")}): room {b.get("room")} -> {out[-1].get("room")} (the room it now plays in)')
                b['room'] = out[-1].get('room')
            if pb['id'] in NEW_SEQ and not b.get('seq'):
                b['seq'] = dict(NEW_SEQ[pb['id']])
                self.note(pb['id'], f'sequence marker {b["seq"]["id"]}: {b["seq"]["place"]}')
            if pending_seq and not b.get('seq'):
                b['seq'] = pending_seq
                self.note(pb['id'], f'sequence marker {pending_seq.get("id")} moved here from a cut beat')
            pending_seq = None
            self.finish(b, pb)
            out.append(b)
        # a continuation beat whose shot went is no longer a continuation
        src_ids = [b['id'] for b in self.src['beats']]
        for i, b in enumerate(out):
            if b.get('cont'):
                prev_src = src_ids[src_ids.index(b['id']) - 1] if b['id'] in src_ids else None
                if i == 0 or out[i - 1]['id'] != prev_src:
                    b['cont'] = False
                    self.note(b['id'], 'cont cleared (its shot before it went)')
        # the cold open's first frame: the hall is heard half a second before it is seen (1.01's sound J-cut)
        first = self.plan['beats'][0]
        lead = next((j['lead_s'] for j in first.get('jcut', []) if 'sound' in j and 'black' in j['sound']), None)
        if self.seg == 'coldopen' and lead:
            out.insert(0, {'id': '1.00', 'act': out[0].get('act', 'COLD OPEN'), 'kind': 'card', 'set': 'void', 'style': 'BASE',
                           'shot': 'wide', 'frame': 'BLACK', 'side': '', 'room': out[0].get('room', ''), 'chars': [],
                           'caption': 'Black. The hall is heard first: HVAC, a polite crowd, cutlery.', 'lines': [],
                           'onscreen': [], 'reelDur': lead, 'fx': [], 'cues': [f'sound: {first["jcut"][0]["sound"]}'],
                           'seq': out[0].pop('seq', None)})
            if out[0]['seq'] is None:
                out[0].pop('seq')
            self.note('1.00', f'new {lead} s black before 1.01: 1.01\'s sound J-cut "under black before the first frame"')
        for a_, b_ in SEQ_MOVE.items():
            A_ = next((x for x in out if x['id'] == a_), None)
            B_ = next((x for x in out if x['id'] == b_), None)
            if A_ is not None and B_ is not None and A_.get('seq') and not B_.get('seq'):
                B_['seq'] = A_.pop('seq')
                self.note(b_, f'sequence marker {B_["seq"].get("id")} moved here from {a_} (the scene now opens here)')
        # frame-exact beats (the Runway inserts)
        for b in out:
            F = EXACT_FRAMES.get((self.seg, b['id']))
            if F:
                if abs(b['reelDur'] * FPS - F) > 1.0:
                    self.deviate(b['id'], f'built {b["reelDur"]:.3f} s, set to {F} frames ({F / FPS:.4f} s) for the Runway insert')
                b['reelDur'] = F / FPS
                self.note(b['id'], f'exactly {F} frames (the Runway insert)')
        self.beats = out
        return out

    def timeline(self):
        src = self.src
        total = sum(b['reelDur'] for b in self.beats)
        prev = src.get('_source', {}).get('takes_files', []) if isinstance(src.get('_source'), dict) else []
        takes_files = sorted(set(prev) | {os.path.relpath(os.path.join(TAKES_DIR, self.seg, 'lines-v31.json'), ROOT)} |
                             ({'audio/ep01/act1/dialogue/lines-fast-v1.json'} if self.seg == 'act1' else set()) |
                             ({'audio/ep01/act3/dialogue/lines-fast-v2.json'} if self.seg == 'act3' else set()))
        return {
            'episode': 1,
            'title': src.get('title', 'ep1.0_research_preview.md'),
            'part': re.sub(r'THE BLIP, told twice', 'FIVE DAYS, told twice', (src.get('part') or self.seg)).replace(' + OUTRO placeholder', ''),
            'variant': 'stick-figure dialogue reel v3.1 LOCK · v2/v5/v3 takes + the v3.1 takes · temp bed',
            'logline': f'The v3.1 stick lock of {self.seg}: the v3.1 beat plan applied to {os.path.basename(self.src_path)} '
                       f'(script draft 7).',
            'dateSpan': src.get('dateSpan', ''),
            'runtimeMin': round(total / 60, 2),
            'dialogueReel': True,
            'cast': {**src.get('cast', {}), **CAST_ADD.get(self.seg, {})},
            '_source': {'plan': os.path.relpath(os.path.join(BP_DIR, f'{self.seg}.json'), ROOT), 'timeline': self.src_path,
                        'takes': takes_files[0] if len(takes_files) == 1 else None, 'takes_files': takes_files,
                        'builder': 'audio/reel/ep01-v31/build_timeline.py', 'bed': f'audio/reel/ep01-v31/bed.py -> audio/reel/ep01-v31/{self.seg}-bed.wav',
                        'notes': 'show/episodes/ep01/production/full-v3/lock-v31.md', 'seconds': r3(total)},
            'beats': self.beats,
        }


def map_words(old, new, x_old):
    """a time inside an old line -> the same word's time inside its replacement (both from their speech onset)"""
    ow, nw = old.get('words') or [], new.get('words') or []
    if not ow or not nw:
        return min(x_old, new['dur'])
    # the old word under x (or the nearest before it)
    k = max((i for i, w in enumerate(ow) if w[1] <= x_old + 0.05), default=0)
    key = norm_word(ow[k][0])
    # the same word in the new line, taking the n-th occurrence as in the old line
    nth = sum(1 for w in ow[:k] if norm_word(w[0]) == key)
    hits = [w for w in nw if norm_word(w[0]) == key]
    if len(hits) > nth:
        return hits[nth][1] + (x_old - ow[k][1])
    # else proportionally through the line
    return x_old / max(0.1, old['dur']) * new['dur']


MANIFEST = os.path.join(OUT_DIR, 'ep01-v31.manifest.json')
INTRO_MP4 = 'out/season/intro/intro-ep1-V1-1080p-flashfix.mp4'
OUTRO_MP4, OUTRO_WAV = 'out/ep01/outro/outro-b-v3.mp4', 'out/ep01/outro/outro-b-v3.wav'
SUB = {'coldopen': 'sc 1-3 · the rewind into the intro', 'act1': 'research preview · sc 5-12 · Sydney and Atem back',
       'act2': 'the regulate-me tour · sc 13-17', 'act3': 'verified: human · sc 18-23 · the hands runner, Neleh\'s paper',
       'act4': 'five days, told twice · sc 24-31', 'tag': 'december · sc 32-33 · the Elgoog demo'}


def wav_seconds(path):
    import wave
    try:
        with wave.open(os.path.join(ROOT, path)) as w:
            return w.getnframes() / w.getframerate()
    except Exception:
        return None


def write_manifest(rep):
    """the v3.1 episode manifest (the v3 one's pattern): cold open, the flash-fixed intro with its own sound, the 2 s
    filename card, the acts, the tag, the Orb outro. Keyed ep01-v31-stick (no timeline has that key)."""
    outro_s = wav_seconds(OUTRO_WAV) or 10.125
    story = sum(r['seconds'] for r in rep.values())
    first = {seg: json.load(open(os.path.join(OUT_DIR, f'ep01-v31-{seg}.json')))['beats'][0]['id'] for seg in SEGS}
    ch = [{'id': 'coldopen', 'label': 'COLD OPEN', 'sub': SUB['coldopen'], 'from': 'ep01-v31-coldopen', 'acts': ['COLD OPEN']},
          {'id': 'intro', 'kind': 'video', 'label': 'INTRO', 'act': 'INTRO', 'sub': 'main title · V1 Chip Chamber Jazz (flash-fixed picture)',
           'src': INTRO_MP4, 'in': 0, 'dur': 30, 'fit': 'full',
           'audio': {'own': True, 'src': 'audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav', 'gain': -3, 'tail': 0.3},
           'note': 'The flash-fixed picture (commit 2fb7161: the whip smear held on 2s); the intro\'s own audio as before (-3 dB).'},
          {'id': 'card', 'label': 'CARD', 'act': 'INTRO', 'sub': 'the filename card (2 s)', 'from': 'ep01-full-part1', 'beats': ['card.01']}]
    for seg in ('act1', 'act2', 'act3', 'act4'):
        ch.append({'id': seg, 'label': {'act1': 'ACT ONE', 'act2': 'ACT TWO', 'act3': 'ACT THREE', 'act4': 'ACT FOUR'}[seg],
                   'sub': SUB[seg], 'from': f'ep01-v31-{seg}'})
    ch.append({'id': 'tag', 'label': 'TAG', 'sub': SUB['tag'], 'from': 'ep01-v31-tag', 'acts': ['TAG']})
    ch.append({'id': 'outro', 'kind': 'video', 'label': 'OUTRO', 'act': 'CREDITS', 'sub': 'the Orb scan (B) · credits',
               'src': OUTRO_MP4, 'in': 0, 'dur': round(outro_s, 3), 'fit': 'full',
               'audio': {'own': True, 'src': OUTRO_WAV, 'gain': -1, 'tail': 0},
               'note': 'The Orb outro (B), -16.0 LUFS as mastered, -1 dB to sit with the intro (the v3 lock\'s proposal, for an ear).'})
    beds = []
    for seg in ('coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'):
        e = {'chapter': seg, 'cue': 'temp: rooms + SFX + pads per mood', 'label': f'{seg} stick bed (v3.1)',
             'src': f'audio/reel/ep01-v31/{seg}-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05}
        if seg in first:
            e['beat'] = first[seg]
        beds.append(e)
    m = {
        'kind': 'episode-manifest', 'key': 'ep01-v31-stick', 'episode': 1, 'title': 'ep1.0_research_preview.md',
        'variant': 'full-episode stick reel v3.1 LOCK · script draft 7 · the v3.1 beat plans on the v3 timelines · temp beds',
        'dateSpan': 'Nov 2022 - Dec 2023', 'runtimeMin': round((story + 30 + 2 + outro_s) / 60, 2),
        '_about': 'The Ep1 v3.1 stick lock (pass v3-lock, 2026-09-27). Chapters: the 3 s title slate, the cold open, the V1 intro '
                  '(flash-fixed picture, its own audio), the 2 s filename card, Acts One to Four and the tag '
                  '(show/reel/ep01-v31/ep01-v31-<seg>.json, built by audio/reel/ep01-v31/build_timeline.py from the v3.1 beat '
                  'plans on the v3 timelines), and the Orb outro with its own sound. Sound: the mixer lays every take; one temp '
                  'bed per chapter (audio/reel/ep01-v31/bed.py). Notes: show/episodes/ep01/production/full-v3/lock-v31.md. '
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


def main(argv):
    segs = [a for a in argv if a in SEGS] or SEGS
    takes = load_takes()
    os.makedirs(OUT_DIR, exist_ok=True)
    rep = json.load(open(REPORT)) if os.path.exists(REPORT) else {}
    for seg in segs:
        S = Seg(seg, takes)
        S.build()
        tl = S.timeline()
        f = os.path.join(OUT_DIR, f'ep01-v31-{seg}.json')
        open(f, 'w').write(json.dumps(tl, indent=1, ensure_ascii=False) + '\n')
        src_total = sum(b['reelDur'] for b in S.src['beats'])
        total = sum(b['reelDur'] for b in tl['beats'])
        nl = sum(len(b['lines']) for b in tl['beats'])
        nvo = sum(1 for b in tl['beats'] for l in b['lines'] if l.get('tag') == 'V.O.')
        cross = [f"{l['id']} ({b['id']})" for b in tl['beats'] for l in b['lines'] if l['t'] + l['dur'] > b['reelDur'] + 0.01]
        pre = [f"{l['id']} ({b['id']}, {l['t']:+.2f})" for b in tl['beats'] for l in b['lines'] if l['t'] < 0]
        for tr in S.trims:
            S.dev.insert(0, {'beat': tr['beat'], 'what': f'{tr["ref"]} applied (script-v31-notes §1.4; the story ran 21:13.4 without it, over about 21:10): {tr["what"]}'})
        for p_ in S.patched:
            S.dev.insert(0, p_)
        rep[seg] = {'timeline': os.path.relpath(f, ROOT), 'source': S.src_path, 'trims': [t['ref'] for t in S.trims], 'source_story_s': r3(src_total),
                    'estimate_s': S.plan.get('story_s', {}).get('estimate'), 'seconds': r3(total), 'beats': len(tl['beats']),
                    'lines': nl, 'vo': nvo, 'jcuts': pre, 'lcuts': cross, 'edits': S.edits, 'deviations': S.dev, 'safety_net': S.safety}
        m, s = divmod(total, 60)
        print(f'== {seg}: {len(tl["beats"])} beats, {nl} lines ({nvo} V.O.), {int(m)}:{s:04.1f} '
              f'(v2 {src_total:.1f} s, plan estimate {S.plan.get("story_s", {}).get("estimate")} s) -> {os.path.relpath(f, ROOT)}')
        for d in S.dev:
            print(f'   deviation {d["beat"]}: {d["what"]}')
        for x in S.safety:
            print(f'   safety net: {x}')
        print(f'   J-cut lines: {len(pre)}; lines running past their shot: {len(cross)}')
    json.dump(rep, open(REPORT, 'w'), indent=1, ensure_ascii=False)
    v2 = [('COLD', 'show/reel/ep01-full/ep01-coldopen-v2.json'), ('A1', 'show/reel/ep01-full/ep01-act1-v2.json'),
          ('A2', 'show/reel/ep01-full/ep01-act2-v2.json'), ('A3', 'show/reel/ep01-full/ep01-act3-v2.json'),
          ('A4', 'show/reel/ep01-act4-v5.json'), ('TAG', 'show/reel/ep01-full/ep01-tag-v2.json')]
    v3 = [(LABEL[s], f'show/reel/ep01-v3/ep01-v3-{s}.json') for s in SEGS]
    v31 = [(LABEL[s], f'show/reel/ep01-v31/ep01-v31-{s}.json') for s in SEGS if os.path.exists(os.path.join(OUT_DIR, f'ep01-v31-{s}.json'))]
    print('\n---- pacing, v3 lock (as committed) ----')
    print(pacing(v3))
    print('---- pacing, v3.1 lock ----')
    print(pacing(v31))
    tot = sum(r['seconds'] for r in rep.values())
    print(f'story total: {int(tot // 60)}:{tot % 60:04.1f} ({tot:.1f} s)')
    if all(s in rep for s in SEGS):
        write_manifest({s: rep[s] for s in SEGS})


if __name__ == '__main__':
    main(sys.argv[1:])
