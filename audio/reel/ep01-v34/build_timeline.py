#!/usr/bin/env python3
"""Ep1 v3.4 STICK LOCK: the v3.3 lock's builder, applying the v3.4 beat plans (draft 8.3, the planner voice) on top of the
v3.3 timelines.

  python3 audio/reel/ep01-v34/build_timeline.py [seg ...]       (default: all six; plain python3, no venv needed)
      reads  show/episodes/ep01/production/full-v3/beat-plan-v34/<seg>.json  (the v3.4 hand-off, script-v34-notes)
             its "source" timeline (show/reel/ep01-v33/ep01-v33-<seg>.json, never edited)
             audio/ep01/v34/<seg>/lines-v34.json                           (the v3.4 takes: 8 new Mas V.O. lines)
             a restored line's own `take_file` (audio/ep01/v3/act1/lines-v3.json: v3-vo-10)
      writes show/reel/ep01-v34/ep01-v34-<seg>.json                        (the lock) + ep01-v34.manifest.json
             audio/reel/ep01-v34/lock-report.json                          (per segment: lengths, edits, deviations)
      prints a per-segment report and the pacing tool's output, v3.3 / v3.4.

What v3.4 adds (lock-v34.md §4): the coordinator's own delta over the plans (PLAN_PATCH `drop_line`: S4.02 loses Alyi's
"That is the company telling us."); the tag's Runway frames go with the duck (S7.13's 264 stay); the v3.3 tables keyed
by beat id are reset (their edits are in the v3.3 timelines).

What v3.3 adds (lock-v33.md §4): a restored line with a `take_file` comes back with that take (the v3 V.O.), placed like a
new line; the v3.2 tables keyed by beat id are reset (their edits are in the v3.2 timelines); the rules stand.

What v3.2 adds (lock-v32.md §4): a kept line's `at` retimes it (start±S on the beat's first line is a head change, so
a start-S is a J-cut that closes its gap; after:<id>+S re-places it, and every placement waits until its anchor is
placed); a kept take whose `device` changes plays its re-staged file; the v3.1 tables keyed by beat id are reset (their
edits are already in the v3.1 timelines). Picture business a plan adds with no timing keeps its est_s at the tail
(EST_HOLD: S5.11's badge, v31-18.00b's key). Guardrails §7's read floor (0.25 s + 0.05 s a character) wins over a plan's
placement where the plan would break it: PLAN_PATCH (12.02's gap before Oigneb, v31-20.07's quote), ONSCREEN_ANCHOR
(12.02's plates hand over on Oigneb's line), ONSCREEN_HOLD (S8.08's rail keeps its source read time after the J-cut),
ONSCREEN_AT (S3.02's reveals re-spaced inside the plan's 1.6 s). A J-cut line's speaker, plated in the beat it leads
into, is named from the line's start (the strip's label).

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
BP_DIR = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v34')
OUT_DIR = os.path.join(ROOT, 'show/reel/ep01-v34')
TAKES_DIR = os.path.join(ROOT, 'audio/ep01/v34')
REPORT = os.path.join(ROOT, 'audio/reel/ep01-v34/lock-report.json')
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
# beat-plan "add" / "replace" / "drop" values written as planning notes -> the on-screen text itself
ADD_TEXT = {}
ADD_SKIP = set()
DROP_TEXT = {}
CAPTION_FIX = {}
CAPTION_SUB = {'5.03': (' / she\'ll go for three. (V.O.)', ''),   # A: the prediction is cut
               'S4.02': ("CUT to Alyi's reflection in the dark window for his line, so it is his.",
                         "Then the whole row of phones lights up at once.")}
ADD_AT = {}
# draft 8.1 (calibration §3) brings back first-appearance plates with one relation word: the v3 lock's plate safety net
# (which cut plates to names) must not undo them, so it's off here
NO_SAFETY_NET = True
END_ANCHORED = {('S1.02', 'dialog_ok_click'), ('22.02', 'key_tap_soft_01')}
# 21.02: "one Nedib, the second copy un-drawn" (notes §6): the copy's pop-ups go with it
SOUND_DROP = {('21.02', 'tower_pop'): 'the cut-paper copy (the deepfake Nedib) is un-drawn, and its pops with it'}
# the v3.4 plans' sound notes, as stick SFX (the stems pass does the real ones); at < 0 counts from the beat's end
NEW_SOUNDS = {'S4.02': [{'name': 'phone_buzz_step_1', 'at': 15.8, 'gain': -26}]}   # the phones light (the delta above)
NEW_SEQ = {}
SEQ_MOVE = {}
CAST_ADD = {}
HEAD_GROW = set()
HEAD_CUT = set()
TAIL_CUT = set()
TRIM_HINTS = {}
# beats the plan grows for new picture business it gives no timing for: the beat keeps the plan's est_s, the extra at the
# tail (after the last line). The plans' explicit timings (`at`, `after`, gap_s, J-cuts) govern everywhere else.
EST_HOLD = {}
# the Runway insert's frames stay reserved (the lead): S7.13 264 (the hourglass)
EXACT_FRAMES = {('act4', 'S7.13'): 264}   # v3.4: the duck is cut, and the tag's two Runway lengths with it
# guardrails §7's read floor (0.25 s + 0.05 s a character; name cards at least 1.2 s) over a plan's placement
# the coordinator's delta over the plans (the showrunner: "don't make anything too on the nose"): S4.02 loses Alyi's
# "That is the company telling us."; the row of phones lighting up carries it, and Neleh's "Then we'll write step four
# ourselves." (S4.07) follows the phones directly. The phones light where his line began (15.8 s), after the first
# phone's clack (15.24 s), and hold 1.6 s to read; the beat ends 17.4 s (was 18.9). The push (P12) still reaches her MCU
# by "Monday" (11.7 s); after it, the clack comes 3.5 s later and the phones 0.6 s after that: no frame held over 8 s.
PLAN_PATCH = {
    ('act4', 'S4.02'): {'drop_line': {'a5-27-28': "the coordinator (the showrunner's \"don't make anything too on the nose\"): "
                                                  "the row of phones lighting up carries it"},
                        'est_s': 17.4,
                        'why': "the coordinator's delta: Alyi's \"That is the company telling us.\" is cut; the phones light up at "
                               "15.8 s (where his line began) and hold 1.6 s, and S4.07's \"Then we'll write step four ourselves.\" follows"},
}
ONSCREEN_AT = {}
ONSCREEN_HOLD = {}
ONSCREEN_ANCHOR = {}
CHARS_SET = {}
ITEM_SHIFT = {}
# B: 13.12's card loses its stat, and the card rides on into 13.13, where it is the same item
ONSCREEN_DROP_FIX = {('act2', '13.13', 'DEEPFAKES OF ME: SEEN 0'): "B: Nedib's card loses the stat (the plan drops it at 13.12); "
                                                                   "the card rides on into 13.13, so it goes there too"}
# items a new V.O. in front of them dragged along with the line they were anchored to; they belong to the shot, so they
# keep the source's times: (seg, beat) -> (on-screen texts, sound names, name ids, why)
ITEM_PIN = {
    ('act3', '22.01'): (['RAIL: NOV 6, 2023 · DEVDAY', '100,000,000 / WEEK'], ['synth:applause', 'odometer_ratchet', 'landing_thunk'], [],
                        'the V.O. plays "on his own stage under the applause for a hundred million a week" (the plan): the rail, '
                        'the counter and the applause stay at the stage\'s opening'),
    ('act1', '11.03'): (['CLOD 1 · SAME DAY'], [], ['clod'], "the lighthouse's CLOD chip stays at the split's opening, as in v3.1's "
                                                             "11.03 with this V.O."),
    ('act2', '14.01'): (['CLASS PHOTO #1 · ♥'], [], [], 'the feed opens on the photo (the plan\'s caption)'),
}
# with the clip gone the photo is the feed: it stays up to the black (it had given way to the clip at 1.8 s)
ONSCREEN_OPEN = {('act2', '14.01', 'CLASS PHOTO #1 · ♥'): 'the clip is cut; the photo is the feed until the black'}
# the dropped V.O. named her; the new one doesn't (Alyi is named since 5.05's plate)
NAME_DROP = {('act4', 'S1.02', 'alyi'): 'v3-vo-18 said "alyi set it up"; v34-vo-07 does not'}
# script-v34-notes lists no trims
TARGET_MAX = 21 * 60 + 15
TRIMS = []
APPLIED_TRIMS = [t for t in TRIMS if t['ref'] in os.environ.get('V34_TRIMS', '').split(',')]


def r3(x):
    return round(float(x) + 0.0, 3)


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


def load_takes():
    takes = {}
    for seg in SEGS:
        f = os.path.join(TAKES_DIR, seg, 'lines-v34.json')
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
            for lid, why_ in (p.get('drop_line') or {}).items():
                for l in pb['lines']:
                    if l['id'] == lid:
                        src_l = next((x for sb_ in jl(self.plan['source'])['beats'] if sb_['id'] == bid for x in sb_.get('lines', []) if x['id'] == lid), {})
                        l.clear()
                        l.update(id=lid, keep=False, why=why_, who=src_l.get('who', ''), text=src_l.get('text', ''))
            for lid, g in (p.get('line_gap') or {}).items():
                for l in pb['lines']:
                    if l['id'] == lid:
                        l['gap_s'] = g
            if 'est_s' not in p:
                self.patched.append({'beat': bid, 'what': p['why']})
                continue
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
                    l['why'] = f'{tr["ref"]} (script-v34-notes): {tr["what"]}'
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
        for k in [k for k in drop if k in DROP_TEXT and DROP_TEXT[k] is None]:
            self.note(pb['id'], f'on-screen drop "{k[:60]}" is a picture note (no stick text to drop)')
        drop = [DROP_TEXT.get(k, k) for k in drop if not (k in DROP_TEXT and DROP_TEXT[k] is None)]
        for k in list(drop):   # a drop written with a planning note: its text without the note
            if k not in texts and not any(k in t_ for t_ in texts) and strip_note(k) != k:
                drop[drop.index(k)] = strip_note(k)
        for k in list(rep):    # the same for a replace key (6.06's 'DEC 5, 2022 (rail)')
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
                continue
            for k, v in rep.items():
                v = strip_note(v)
                if t == k:
                    t = v
                    used.add(k)
                elif k in t and k != v:
                    t = t.replace(k, v)
                    used.add(k)
            if t in GLOBAL_DROP and not NO_SAFETY_NET:
                self.safety.append(f'{b["id"]}: dropped "{t}" (script-v3-notes §4)')
                if d.get('at') is not None:
                    drops_at.append((d['at'], t))
                continue
            if t in GLOBAL_REPLACE and not NO_SAFETY_NET:
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
            if a in ADD_SKIP:
                self.note(pb['id'], f'on-screen add "{a[:60]}" is a drawing note or superseded (nothing to show in the stick)')
                continue
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
            # v3.4 (13.12): a kept on-screen item that starts at the same time may own it; then it stays
            kept_at = [o.get('at') or 0.0 for o in b.get('onscreen', []) if isinstance(o, dict)]
            ats = [a for a in ats if not any(abs(a - k_) < 0.02 for k_ in kept_at)]
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

        audio_changed = bool(dropped or new or moved or vos or any(l.get('at') for l in plan_lines))
        src_lines = sorted(copy.deepcopy(sb.get('lines', [])), key=lambda l: l['t'])

        if not src_lines and not new and not moved:
            return self.build_noline(pb, b, sb, dur0, mtl, merged_sounds, vos, dropped)

        # a kept take re-staged to another device (the plan's `device`): its re-staged file, the same read
        for l in src_lines:
            r = self.takes.get(l['id'])
            if r and r.get('restaged'):
                l['audio'] = r['file']
                l['tag'] = ''
                self.note(pb['id'], f'line {l["id"]}: {(pb.get("device") or {}).get(l["id"], "re-staged")} ({r["file"]})')
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
            nx = order[k + 2] if k + 2 < len(order) else None
            if nx is not None and nx.get('_follows') == slot['id'] and '_gap_after_dropped_first' in nx:
                # v3.4 (22.01): a re-placed first line lands back in front of the line that followed it: that line keeps
                # its read gap after it (not the gap a line placed at the front in between had given it)
                nx['gap'] = nx.pop('_gap_after_dropped_first')
                nx.pop('_follows', None)
                self.note(pb['id'], f'{nx["id"]} keeps its {nx["gap"]:.2f} s gap after {slot["id"]} (re-placed in front of it)')

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

        # kept lines the plan retimes (`at`): the beat's first line at start±S is a head change (a start-S is a J-cut
        # whose gap closes: what follows keeps its gaps); a line already right after its anchor takes the new gap;
        # anything else leaves its place and waits in the queue below
        retimed = [l for l in plan_lines if l.get('keep') is True and l.get('at') and not l.get('moved_from')]
        pending = []   # (slot, spec): spec = ('start', S) | ('after', ref, gap)
        for l in retimed:
            sl = idx.get(l['id'])
            if sl is None or sl not in order:
                self.deviate(pb['id'], f'retimed line {l["id"]} is not in the beat')
                continue
            at = l['at']
            if at.startswith('start') and order[0] is sl:
                was = sl['gap']
                sl['gap'] = float(at[5:])
                sl.pop('_gap_after_dropped_first', None)
                self.note(pb['id'], f'line {l["id"]} retimed: head {was:.2f} -> {sl["gap"]:.2f} s ({at})'
                                    f'{"; a J-cut, the lines after it keep their gaps" if sl["gap"] < 0 else ""}')
                continue
            if at.startswith('after:'):
                ref, S = re.match(r'after:(.+)\+([\d.]+)$', at).groups()
                k = order.index(sl)
                if k > 0 and order[k - 1]['id'] == ref:
                    was = sl['gap']
                    sl['gap'] = float(S)
                    self.note(pb['id'], f'line {l["id"]} retimed: gap after {ref} {was:.2f} -> {float(S):.2f} s')
                    continue
            k = order.index(sl)
            if k == 0 and len(order) > 1:
                order[1]['_gap_after_dropped_first'] = order[1]['gap']
                order[1]['gap'] = sl['gap']
                order[1]['_follows'] = sl['id']   # v3.4: it keeps its read gap if the re-placed line lands back before it
            elif k + 1 < len(order):
                pass   # the line after it keeps its own gap (now after the line before)
            order.remove(sl)
            pending.append((sl, ('start', float(at[5:])) if at.startswith('start') else
                            ('after',) + tuple(re.match(r'after:(.+)\+([\d.]+)$', at).groups())))
            self.note(pb['id'], f'line {l["id"]} retimed: re-placed at {at}')

        for l in moved:
            ms = self.S[l['moved_from']]
            ml = next(x for x in ms['lines'] if x['id'] == l['id'])
            slot = {'id': l['id'], 'line': copy.deepcopy(ml), 'len': ml['dur'], 'new': True, 'moved': True,
                    'carry': [dict(sd, _off=sd['at'] - ml['t']) for sd in ms.get('sounds', []) if ml['t'] - 1.0 <= sd['at'] <= ml['t'] + ml['dur']]}
            if ml.get('tag') == 'V.O.':
                slot['vo'] = True
            at = l.get('at') or f'after:{l.get("after")}+{l.get("gap_s", 0.5)}'
            pending.append((slot, ('start', float(at[5:])) if at.startswith('start') else
                            ('after',) + tuple(re.match(r'after:(.+)\+([\d.]+)$', at).groups())))
            self.note(pb['id'], f'line {l["id"]} moved in from {l["moved_from"]} at {at}, with {len(slot["carry"])} sound(s)')
        for l in new:
            rep_of = next((d for d, n in repl.items() if n == l['id']), None)
            text = l['text'].strip()
            if l.get('restored') and l.get('take_file'):
                # v3.3: a restored line with its own take (the v3 V.O. takes on file), placed like a new line
                rows = {r_['id']: r_ for r_ in jl(l['take_file'])} if os.path.exists(os.path.join(ROOT, l['take_file'])) else {}
                r = rows.get(l['id'])
                if not r:
                    self.deviate(pb['id'], f'restored line {l["id"]} has no take in {l["take_file"]}: left out')
                    continue
                if l.get('take') and os.path.normpath(r['file']) != os.path.normpath(l['take']):
                    self.deviate(pb['id'], f'restored line {l["id"]}: the plan names {l["take"]}, the takes file {r["file"]} (used)')
                ln = take_line(r, l['id'], l.get('who', 'mas'), text, 0.0, 'V.O.' if l.get('vo') else l.get('tag', ''))
                if l.get('take_dur_s') and abs(ln['dur'] - l['take_dur_s']) > 0.6:
                    self.note(pb['id'], f'restored {l["id"]}: voiced {ln["dur"]:.2f} s (the plan\'s take_dur_s {l["take_dur_s"]} is the file)')
            elif l.get('restored'):
                v2 = self.v2lines.get(l['id'])
                if not v2:
                    self.deviate(pb['id'], f'restored line {l["id"]} is not in the v2 timelines: left out')
                    continue
                ln = copy.deepcopy(v2)
                ln.update(who=l.get('who', v2['who']), text=text, tag=l.get('tag', ''), t=0.0)
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
            if l.get('vo'):
                slot['vo'] = True
            after = l.get('after')
            spec = ('start', float(after[5:])) if isinstance(after, str) and after.startswith('start') else ('after', after, l.get('gap_s', 0.5))
            pending.append((slot, spec))
            self.note(pb['id'], f'new line {l["id"]} ({l["who"]}, {ln["dur"]:.2f} s) '
                                f'{("at " + after) if spec[0] == "start" else ("after " + str(after) + " +" + str(l.get("gap_s")))}'
                                f'{(" replacing " + rep_of) if rep_of else ""}')
        for v in vos:
            r = self.takes.get(v['id'])
            if not r:
                self.deviate(pb['id'], f'V.O. {v["id"]} has no take: left out')
                continue
            ln = take_line(r, v['id'], 'mas', v['text'], 0.0, 'V.O.')
            slot = {'id': v['id'], 'line': ln, 'len': ln['dur'], 'new': True, 'vo': True}
            at = v['at']
            pending.append((slot, ('start', float(at[5:])) if at.startswith('start') else
                            ('after',) + tuple(re.match(r'after:(.+)\+([\d.]+)$', at).groups())))
            self.note(pb['id'], f'V.O. {v["id"]} ({ln["dur"]:.2f} s) at {at}')
        # the queue: start-placed items first (by S), then whatever's anchor is placed, until nothing moves
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
        if audio_changed and pb['id'] in EST_HOLD and pb.get('est_s', 0) > end + EPS:
            self.note(pb['id'], f'+{pb["est_s"] - end:.2f} s at the tail, to the plan\'s {pb["est_s"]} s: {EST_HOLD[pb["id"]]}')
            end = pb['est_s']
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
            sb['cues'] = [f'style (v3.4): {style}']
        self.S[pb['id']] = sb
        self.note(pb['id'], f'new beat: {pb.get("frame", "")} ({sb["set"]}, {sb["room"]}, {", ".join(sb["chars"]) or "no figures"})')
        return self.build_keep(pb, [])

    # ------------------------------------------------------------------ names and cues
    def finish(self, b, pb):
        key = (self.seg, pb['id'])
        if key in CHARS_SET:
            b['chars'] = copy.deepcopy(CHARS_SET[key][0])
            self.note(pb['id'], f'chars: {CHARS_SET[key][1]}')
        if key in ITEM_SHIFT:
            texts, snds, why = ITEM_SHIFT[key]
            d_ = r3(b['reelDur'] - self.S[pb['id']]['reelDur'])
            for o in b.get('onscreen', []):
                if isinstance(o, dict) and o['text'] in texts:
                    o['at'] = r3(o['at'] + d_)
            for sd in b.get('sounds', []):
                if sd['name'] in snds:
                    sd['at'] = r3(sd['at'] + d_)
            self.note(pb['id'], f'{", ".join(texts + snds)} +{d_:.2f} s: {why}')
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
            for nid in nids:
                y = next((x for x in sb_.get('names', []) or [] if x['id'] == nid), None)
                x = next((x for x in b.get('names', []) or [] if x['id'] == nid), None)
                if x and y and abs(x['at'] - y['at']) > EPS:
                    moved_.append(f'name {nid} {x["at"]:.2f}->{y["at"]:.2f}')
                    x['at'] = y['at']
            if moved_:
                self.note(pb['id'], f'kept at the source\'s times ({why}): ' + ', '.join(moved_))
            if b.get('sounds'):
                b['sounds'].sort(key=lambda x: x['at'])
        for o in b.get('onscreen', []):
            if isinstance(o, dict) and (self.seg, pb['id'], o['text']) in ONSCREEN_OPEN and o.get('until') is not None:
                self.note(pb['id'], f'"{o["text"]}" up to the beat\'s end (was until {o["until"]}): '
                                    f'{ONSCREEN_OPEN[(self.seg, pb["id"], o["text"])]}')
                o['until'] = None
        for n in list(b.get('names', []) or []):
            why_ = NAME_DROP.get((self.seg, pb['id'], n['id']))
            if why_:
                b['names'].remove(n)
                self.note(pb['id'], f'names[]: {n["id"]} at {n["at"]} dropped ({why_})')
        for o in list(b.get('onscreen', [])):
            t_ = o['text'] if isinstance(o, dict) else o
            if (self.seg, pb['id'], t_) in ONSCREEN_DROP_FIX:
                b['onscreen'].remove(o)
                self.deviate(pb['id'], f'"{t_}" dropped: {ONSCREEN_DROP_FIX[(self.seg, pb["id"], t_)]}')
        for o in b.get('onscreen', []):
            u = ONSCREEN_HOLD.get((self.seg, pb['id'], o.get('text') if isinstance(o, dict) else None))
            if u is not None and (o.get('until') is None or o['until'] < u - EPS):
                was = o.get('until')
                o['until'] = r3(min(u, b['reelDur']))
                self.note(pb['id'], f'"{o["text"]}" held to {o["until"]:.2f} s (was {was}): the J-cut moved the sound, not the rail; '
                                    f'its source read time')
        for o in b.get('onscreen', []):
            t_ = ONSCREEN_AT.get((self.seg, pb['id'], o.get('text') if isinstance(o, dict) else None))
            if t_ is not None:
                was = o.get('at')
                o['at'] = t_
                self.note(pb['id'], f'"{o["text"]}" at {was} -> {t_:.2f} s (re-spaced inside the plan\'s length: the blank step holds)')
        for o in b.get('onscreen', []):
            a_ = ONSCREEN_ANCHOR.get((self.seg, pb['id'], o.get('text') if isinstance(o, dict) else None))
            ln = a_ and next((x for x in b.get('lines', []) if x['id'] == a_[1]), None)
            if ln:
                was = o.get(a_[0])
                o[a_[0]] = r3(ln['t'] + a_[2])
                for n in b.get('names', []):
                    if a_[0] == 'at' and n['id'] == o['text'].lower() and n['at'] == was:
                        n['at'] = o['at']
                self.note(pb['id'], f'"{o["text"]}" {a_[0]} {was} -> {o[a_[0]]:.2f} s: it hands over on {a_[1]} ({a_[2]:+.1f} s), as in the source')
        # a J-cut line's speaker, plated in the beat it leads into, is named from the line's start (the strip's label)
        for ln in b.get('lines', []):
            if ln['t'] < 0 and ln.get('tag') != 'V.O.':
                for n in b.get('names', []):
                    if n['id'] == ln['who'] and n['at'] > ln['t']:
                        self.note(pb['id'], f'names[]: {n["id"]} {n["at"]:.2f} -> {ln["t"]:.2f} s (the J-cut line leads its plate)')
                        n['at'] = ln['t']
        if pb.get('frame') and pb['action'] == 'keep' and b.get('frame') != pb['frame']:
            b['frame'] = pb['frame']
            self.note(pb['id'], 'frame from the plan')
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
            still = ' '.join([x.get('text', '') for x in b.get('lines', [])] + [o['text'] if isinstance(o, dict) else o for o in b.get('onscreen', [])])
            if l.get('keep') is False and first and first[:12] in (b.get('caption') or '') and first[:12] not in still:
                self.deviate(pb['id'], f'the caption still quotes the dropped line "{first}"')
        if pb.get('music'):
            cues = [c for c in b.get('cues', []) if not c.lower().startswith('music')]
            b['cues'] = [f'music (v3.4): {pb["music"]}'] + cues
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
                # a merged beat's names come with it: at its plate in the target (the same text), else from 0.2 s
                have = {n['id'] for n in b.get('names', [])}
                for mpb in merges.get(pb['id'], []):
                    for n in self.S[mpb['id']].get('names') or []:
                        if n['id'] in have:
                            continue
                        at = next((o['at'] for o in b.get('onscreen', []) if isinstance(o, dict)
                                   and o['text'].lower().split(' · ')[0] == n['id']), 0.2)
                        b.setdefault('names', []).append({'id': n['id'], 'at': at})
                        have.add(n['id'])
                        self.note(pb['id'], f'names[]: {n["id"]} at {at} s, from the merged {mpb["id"]} (its plate)')
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
        takes_files = sorted(set(prev) | ({os.path.relpath(os.path.join(TAKES_DIR, self.seg, 'lines-v34.json'), ROOT)}
                                          if os.path.exists(os.path.join(TAKES_DIR, self.seg, 'lines-v34.json')) else set()) |
                             ({'audio/ep01/act1/dialogue/lines-fast-v1.json'} if self.seg == 'act1' else set()) |
                             ({'audio/ep01/act3/dialogue/lines-fast-v2.json'} if self.seg == 'act3' else set()))
        return {
            'episode': 1,
            'title': src.get('title', 'ep1.0_research_preview.md'),
            'part': re.sub(r'THE BLIP, told twice', 'FIVE DAYS, told twice', (src.get('part') or self.seg)).replace(' + OUTRO placeholder', ''),
            'variant': 'stick-figure dialogue reel v3.4 LOCK · v2/v5/v3/v3.1/v3.2/v3.3 takes + the v3.4 takes · temp bed',
            'logline': f'The v3.4 stick lock of {self.seg}: the v3.4 beat plan applied to {os.path.basename(self.src_path)} '
                       f'(script draft 8.3).',
            'dateSpan': src.get('dateSpan', ''),
            'runtimeMin': round(total / 60, 2),
            'dialogueReel': True,
            'cast': {**src.get('cast', {}), **CAST_ADD.get(self.seg, {})},
            '_source': {'plan': os.path.relpath(os.path.join(BP_DIR, f'{self.seg}.json'), ROOT), 'timeline': self.src_path,
                        'takes': takes_files[0] if len(takes_files) == 1 else None, 'takes_files': takes_files,
                        'builder': 'audio/reel/ep01-v34/build_timeline.py', 'bed': f'audio/reel/ep01-v34/bed.py -> audio/reel/ep01-v34/{self.seg}-bed.wav',
                        'notes': 'show/episodes/ep01/production/full-v3/lock-v34.md', 'seconds': r3(total)},
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


MANIFEST = os.path.join(OUT_DIR, 'ep01-v34.manifest.json')
INTRO_MP4 = 'out/intro/intro-ep1-V1-1080p-flashfix.mp4'
OUTRO_MP4, OUTRO_WAV = 'out/ep01/outro/outro-b-v3.mp4', 'out/ep01/outro/outro-b-v3.wav'
SUB = {'coldopen': 'sc 1-3 · the rewind into the intro', 'act1': 'research preview · sc 5-12 · he launches, he secures the money',
       'act2': 'the regulate-me tour · sc 13-17 · he makes himself its face', 'act3': 'verified: human · sc 18-23 · he consolidates',
       'act4': 'five days, told twice · sc 24-31', 'tag': 'december · sc 32-33 · the cover'}   # v3.4: the Elgoog demo is cut


def wav_seconds(path):
    import wave
    try:
        with wave.open(os.path.join(ROOT, path)) as w:
            return w.getnframes() / w.getframerate()
    except Exception:
        return None


def write_manifest(rep):
    """the v3.4 episode manifest (the v3.3 one's pattern): cold open, the flash-fixed intro with its own sound, the 2 s
    filename card, the acts, the tag, the Orb outro B. Keyed ep01-v34-stick (no timeline has that key)."""
    outro_s = wav_seconds(OUTRO_WAV) or 10.125
    story = sum(r['seconds'] for r in rep.values())
    first = {seg: json.load(open(os.path.join(OUT_DIR, f'ep01-v34-{seg}.json')))['beats'][0]['id'] for seg in SEGS}
    ch = [{'id': 'coldopen', 'label': 'COLD OPEN', 'sub': SUB['coldopen'], 'from': 'ep01-v34-coldopen', 'acts': ['COLD OPEN']},
          {'id': 'intro', 'kind': 'video', 'label': 'INTRO', 'act': 'INTRO', 'sub': 'main title · V1 Chip Chamber Jazz (flash-fixed picture)',
           'src': INTRO_MP4, 'in': 0, 'dur': 30, 'fit': 'full',
           'audio': {'own': True, 'src': 'audio/intro-mix/intro-ep1-mix-V1-chipchamber.wav', 'gain': -3, 'tail': 0.3},
           'note': 'The flash-fixed picture (commit 2fb7161: the whip smear held on 2s); the intro\'s own audio as before (-3 dB).'},
          {'id': 'card', 'label': 'CARD', 'act': 'INTRO', 'sub': 'the filename card (2 s)', 'from': 'ep01-full-part1', 'beats': ['card.01']}]
    for seg in ('act1', 'act2', 'act3', 'act4'):
        ch.append({'id': seg, 'label': {'act1': 'ACT ONE', 'act2': 'ACT TWO', 'act3': 'ACT THREE', 'act4': 'ACT FOUR'}[seg],
                   'sub': SUB[seg], 'from': f'ep01-v34-{seg}'})
    ch.append({'id': 'tag', 'label': 'TAG', 'sub': SUB['tag'], 'from': 'ep01-v34-tag', 'acts': ['TAG']})
    ch.append({'id': 'outro', 'kind': 'video', 'label': 'OUTRO', 'act': 'CREDITS', 'sub': 'the Orb scan (B) · credits',
               'src': OUTRO_MP4, 'in': 0, 'dur': round(outro_s, 3), 'fit': 'full',
               'audio': {'own': True, 'src': OUTRO_WAV, 'gain': -1, 'tail': 0},
               'note': 'The Orb outro (B), -16.0 LUFS as mastered, -1 dB to sit with the intro (the v3 lock\'s proposal, for an ear).'})
    beds = []
    for seg in ('coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'):
        e = {'chapter': seg, 'cue': 'temp: rooms + SFX + pads per mood', 'label': f'{seg} stick bed (v3.4)',
             'src': f'audio/reel/ep01-v34/{seg}-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05}
        if seg in first:
            e['beat'] = first[seg]
        beds.append(e)
    m = {
        'kind': 'episode-manifest', 'key': 'ep01-v34-stick', 'episode': 1, 'title': 'ep1.0_research_preview.md',
        'variant': 'full-episode stick reel v3.4 LOCK · script draft 8.3 · the v3.4 beat plans on the v3.3 timelines · temp beds',
        'dateSpan': 'Nov 2022 - Dec 2023', 'runtimeMin': round((story + 30 + 2 + outro_s) / 60, 2),
        '_about': 'The Ep1 v3.4 stick lock (pass v3-lock, 2026-09-28). Chapters: the 3 s title slate, the cold open, the V1 intro '
                  '(flash-fixed picture, its own audio), the 2 s filename card, Acts One to Four and the tag '
                  '(show/reel/ep01-v34/ep01-v34-<seg>.json, built by audio/reel/ep01-v34/build_timeline.py from the v3.4 beat '
                  'plans on the v3.3 timelines), and the Orb outro B with its own sound. Sound: the mixer lays every take; one temp '
                  'bed per chapter (audio/reel/ep01-v34/bed.py). Notes: show/episodes/ep01/production/full-v3/lock-v34.md. '
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
        f = os.path.join(OUT_DIR, f'ep01-v34-{seg}.json')
        open(f, 'w').write(json.dumps(tl, indent=1, ensure_ascii=False) + '\n')
        src_total = sum(b['reelDur'] for b in S.src['beats'])
        total = sum(b['reelDur'] for b in tl['beats'])
        nl = sum(len(b['lines']) for b in tl['beats'])
        nvo = sum(1 for b in tl['beats'] for l in b['lines'] if l.get('tag') == 'V.O.')
        cross = [f"{l['id']} ({b['id']})" for b in tl['beats'] for l in b['lines'] if l['t'] + l['dur'] > b['reelDur'] + 0.01]
        pre = [f"{l['id']} ({b['id']}, {l['t']:+.2f})" for b in tl['beats'] for l in b['lines'] if l['t'] < 0]
        for tr in S.trims:
            S.dev.insert(0, {'beat': tr['beat'], 'what': f'{tr["ref"]} applied (script-v34-notes): {tr["what"]}'})
        for p_ in S.patched:
            S.dev.insert(0, p_)
        rep[seg] = {'timeline': os.path.relpath(f, ROOT), 'source': S.src_path, 'trims': [t['ref'] for t in S.trims], 'source_story_s': r3(src_total),
                    'estimate_s': S.plan.get('story_s', {}).get('estimate'), 'seconds': r3(total), 'beats': len(tl['beats']),
                    'lines': nl, 'vo': nvo, 'jcuts': pre, 'lcuts': cross, 'edits': S.edits, 'deviations': S.dev, 'safety_net': S.safety}
        m, s = divmod(total, 60)
        print(f'== {seg}: {len(tl["beats"])} beats, {nl} lines ({nvo} V.O.), {int(m)}:{s:04.1f} '
              f'(v3.3 {src_total:.1f} s, plan estimate {S.plan.get("story_s", {}).get("estimate")} s) -> {os.path.relpath(f, ROOT)}')
        for d in S.dev:
            print(f'   deviation {d["beat"]}: {d["what"]}')
        for x in S.safety:
            print(f'   safety net: {x}')
        print(f'   J-cut lines: {len(pre)}; lines running past their shot: {len(cross)}')
    json.dump(rep, open(REPORT, 'w'), indent=1, ensure_ascii=False)
    v2 = [('COLD', 'show/reel/ep01-full/ep01-coldopen-v2.json'), ('A1', 'show/reel/ep01-full/ep01-act1-v2.json'),
          ('A2', 'show/reel/ep01-full/ep01-act2-v2.json'), ('A3', 'show/reel/ep01-full/ep01-act3-v2.json'),
          ('A4', 'show/reel/ep01-act4-v5.json'), ('TAG', 'show/reel/ep01-full/ep01-tag-v2.json')]
    v3 = [(LABEL[s], f'show/reel/ep01-v33/ep01-v33-{s}.json') for s in SEGS]
    v31 = [(LABEL[s], f'show/reel/ep01-v34/ep01-v34-{s}.json') for s in SEGS if os.path.exists(os.path.join(OUT_DIR, f'ep01-v34-{s}.json'))]
    print('\n---- pacing, v3.3 lock ----')
    print(pacing(v3))
    print('---- pacing, v3.4 lock ----')
    print(pacing(v31))
    tot = sum(r['seconds'] for r in rep.values())
    print(f'story total: {int(tot // 60)}:{tot % 60:04.1f} ({tot:.1f} s)')
    if all(s in rep for s in SEGS):
        write_manifest({s: rep[s] for s in SEGS})


if __name__ == '__main__':
    main(sys.argv[1:])
