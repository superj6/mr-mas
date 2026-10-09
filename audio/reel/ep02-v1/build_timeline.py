#!/usr/bin/env python3
"""Ep2 v1 BASE LOCK (Kokoro timing): a copy of Ep1's last base-lock builder (audio/reel/ep01-v35/build_timeline.py, locked),
pointed at Ep2, with every Ep1-specific table emptied (Ep2's own fixes go in the same tables, below) and one new case: a
beat plan with NO source timeline (Ep2's first lock: every beat is `new`).

  python3 audio/reel/ep02-v1/build_timeline.py [seg ...]       (default: all six; plain python3, no venv needed)
      reads  show/episodes/ep02/production/v1/beat-plan/<seg>.json   (the script pass's hand-off, in Ep1's beat-plan
                                                                     schema: full-v3/PLAN.md §2 plus the v3.1-v3.5 fields)
             its "source" timeline if it names one (a later round's plan: the previous Ep2 lock; never edited);
             a plan with "source": null (or none) builds every beat as `new` (a keep / cut / merge beat is then an error)
             audio/ep02/v1/<seg>/lines-v1.json                        (the Kokoro takes; a line with no take is left out
                                                                     and listed as a deviation)
      writes show/reel/ep02-v1/ep02-v1-<seg>.json                     (the lock) + ep02-v1.manifest.json (key ep02-v1-stick)
             show/reel/ep02-v1/ep02-v1-card.json                      (the 2 s filename card, ep1.1_her.wav, as a stick beat)
             audio/reel/ep02-v1/lock-report.json                      (per segment: lengths, frames, edits, deviations, checks)
      prints a per-segment report, the checks and the pacing tool's output.
  Then: audio/reel/ep02-v1/bed.py (the temp bed), the stick reel (studio/src/reel/tools/episode.mjs on the manifest), and
  the EL route (show/episodes/ep02/production/v1/pipeline.md §2).

What the per-beat plan fields do (unchanged from Ep1 v3.5; Ep1's notes follow):
  passes   scene, mode, pace, tempo, camera, picture, style, flashback, style_leap, style_leap_optional are carried into
           each lock beat as `passes`. `scene` is the beat plan's scene id: the pixel lock's SCENES (the per-scene render's
           unit) come from it, so every beat should carry one.
  music    the beat's mood string becomes the cue `music (v1): <string>` (the temp bed and the mix read it).

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
CUT = 'v1'                                                     # the Ep2 cut (show/episodes/ep02/production/v1/)
BP_DIR = os.path.join(ROOT, 'show/episodes/ep02/production/v1/beat-plan')
OUT_DIR = os.path.join(ROOT, 'show/reel/ep02-v1')
TAKES_DIR = os.path.join(ROOT, 'audio/ep02/v1')                # <seg>/lines-v1.json (the Kokoro takes)
TAKES_NAME = 'lines-v1.json'
REPORT = os.path.join(ROOT, 'audio/reel/ep02-v1/lock-report.json')
KEY = 'ep02-v1'                                                # file names and the manifest key (ep02-v1-stick)
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

# ---------------------------------------------------------------------------------------------------------------------
# THE PER-BEAT FIX TABLES. Ep1's lock passes filled these with Ep1's beat ids (audio/reel/ep01-v35/build_timeline.py
# keeps them as the record); Ep2 starts with all of them EMPTY. An Ep2 lock pass that needs one adds its entry here,
# keyed (seg, beat id), with the reason beside it, exactly as Ep1 did. Their meanings are Ep1's (the comments there).
NO_SAFETY_NET = True
GLOBAL_REPLACE, GLOBAL_DROP = {}, set()
ADD_TEXT = {}
ADD_SKIP = set()
KEEP_PARENS = set()         # a parenthesis that is an item's own words, not a planning note
DROP_TEXT = {}
CAPTION_FIX = {}
CAPTION_SUB = {}            # (seg, beat) -> [(old, new)]
PLATE_SKIP = set()          # on-screen adds that are not name plates
ONSCREEN_SET = {            # (seg, beat, text) -> ({key: value}, why)
    # The Ep2 lock pass (lock-v1.md §4, 2026-10-09). Sc 14's adventure-game sentence line was up for less than its read
    # floor (P15, FIRM: 0.25 s + 0.05 s a character); the genre's own convention holds the sentence line until the next
    # command replaces it, which meets the floor and costs no time.
    ('act3', '14.02', 'Look at heatsink'): ({'until': 2.8}, 'the sentence line holds under his reply until "Pick up '
                                           'reflection" replaces it (0.8 s up against its 1.05 s read floor)'),
    ('act3', '14.02', 'Pick up reflection'): ({'until': 5.0}, 'held under his reply to the beat\'s end (0.7 s up against '
                                             'its 1.15 s read floor)'),
    ('act3', '14.03', 'Talk to reflection'): ({'until': 1.4}, 'held 0.4 s into the dialogue tree that answers it (0.7 s up '
                                             'against its 1.15 s read floor)'),
}
CUE_SUB = {}                # (seg, beat) -> [(old, new)]
END_ANCHORED = set()
SOUND_DROP = {}             # (seg, beat, name, at|None) -> why
SOUNDS_DROP_MAP = {}        # a plan's sounds_drop words -> [timeline sound names] | None
SOUND_MOVE = {}             # (seg, beat, name) -> (to beat, at, why)
NEW_SOUNDS = {}             # beat -> [{name, at, gain, dur}]
SOUND_AT = {}               # (seg, beat, name) -> (at, why)
NEW_SEQ = {}                # beat -> {id|sub, side, place, time}: a new scene's sequence marker (else the plan's `seq`)
SEQ_MOVE = {}
SEQ_FIX = {}
MERGE_HEAD = set()
CAST_ADD = {}               # seg -> {id: {name, role, known}}
UNDRAWN = {}
CAST_DROP = {}
HEAD_GROW = set()
HEAD_CUT = set()
TAIL_CUT = set()
GROW_AT = {}                # (seg, beat) -> (at s, why)
TRIM_HINTS = {}
FIT_SKIP = {}               # (seg, beat) -> why
EST_HOLD = {}
EXACT_FRAMES = {}           # (seg, beat) -> frames (a reserved length: a generated insert)
PLAN_PATCH = {}
ONSCREEN_AT = {}
ONSCREEN_AT_PREFIX = {}
ONSCREEN_HOLD = {}
ONSCREEN_ANCHOR = {}
CHARS_SET = {}
ITEM_SHIFT = {}
ONSCREEN_DROP_FIX = {}
ITEM_PIN = {}
ONSCREEN_OPEN = {}
NAME_DROP = {}
ADD_TIME = {}               # (seg, beat, text) -> (at | 'line:<id>+S', until)
# the principals the strip may name from a plate or from his voice (plus every speaker and figure the plans name)
BASE_CAST = {'mas', 'gerg', 'rima', 'alyi', 'mario', 'radnus', 'tasya', 'nole', 'neleh', 'mada', 'kram', 'sirrah', 'nedib',
             'ekiel', 'adelina', 'xel', 'rumpt'}
TARGET_MAX = 24 * 60
TRIMS = []
APPLIED_TRIMS = []


def r3(x):
    return round(float(x) + 0.0, 3)


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


TAKES_USED = {}     # line id -> the takes file it was read from (the report and each timeline's _source.takes_files)
EXTRA_TAKES = []    # --takes FILE (first: they win)


def load_takes():
    """every take row by id. Ep2's takes may be a Kokoro round (audio/ep02/v1/<seg>/lines-v1.json, Ep1's layout) or the
    voices pass's ElevenLabs takes straight away (el_render.py's lines-A.json anywhere under audio/ep02/, Mario's Kokoro
    rows among them): the first file that has an id wins, in this order: --takes files, the Kokoro round, lines-A*.json,
    any other lines*.json (auditions and caches never)."""
    import glob
    files = [os.path.abspath(f) for f in EXTRA_TAKES] + [os.path.join(TAKES_DIR, seg, TAKES_NAME) for seg in SEGS]
    files += sorted(glob.glob(os.path.join(ROOT, 'audio/ep02/**/lines-A*.json'), recursive=True))
    files += sorted(glob.glob(os.path.join(ROOT, 'audio/ep02/**/lines*.json'), recursive=True))
    takes = {}
    for f in dict.fromkeys(files):
        if not os.path.exists(f) or '/auditions/' in f or '/cache/' in f or f.endswith(('-report.json', 'manifest.json')):
            continue
        try:
            rows = jl(f)
        except ValueError:
            continue
        for r in rows if isinstance(rows, list) else []:
            if isinstance(r, dict) and r.get('id') and r.get('file') and r['id'] not in takes:
                takes[r['id']] = r
                TAKES_USED[r['id']] = os.path.relpath(f, ROOT)
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
        if s.strip() in KEEP_PARENS:
            return s.strip()
        s = re.sub(r'\s*\([^()]*\)\s*$', '', s).strip()
        # Ep2 (the lock pass, 2026-10-09): an item whose own words end in parentheses ("(FOR NOW)", "DEFLECTION
        # (LICENSED)") stops here, once its "(a-b s)" window is off; the copy stripped them too and lost five items
        if s in KEEP_PARENS:
            return s
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
        # the plan's texts whose own words end in parentheses (its _about: "listed in each file's keep_parens")
        KEEP_PARENS.update(self.plan.get('keep_parens') or [])
        self.trims = []
        self.patched = []
        self.src_path = self.plan.get('source') or None
        if self.src_path and not os.path.exists(os.path.join(ROOT, self.src_path)):
            raise SystemExit(f'{seg}: the plan\'s source {self.src_path} does not exist')
        # Ep2: no source (the first lock): an empty timeline, so every beat must be `new`
        self.src = jl(self.src_path) if self.src_path else {'beats': [], 'cast': {}, 'title': 'ep1.1_her.wav'}
        self.S = {b['id']: b for b in self.src['beats']}
        orphan = [pb['id'] for pb in self.plan['beats'] if pb['action'] in ('keep', 'cut', 'merge') and pb['id'] not in self.S]
        if orphan:
            raise SystemExit(f'{seg}: beats {orphan[:8]} are keep / cut / merge, but the source '
                             f'({self.src_path or "none: the plan names no source"}) has no such beat')
        self.v33 = {}           # (Ep1's restored-text lookup; Ep2 restores from `restore_from` only)
        self.takes = takes
        self.edits, self.dev, self.safety = [], [], []
        self.carry = {}   # SOUND_MOVE: sounds waiting for a later beat
        self.restored_prev = {}   # restored beat id -> its predecessor in the lock it came from
        who = {(l.get('who') or '').lower() for pb in self.plan['beats'] for l in pb.get('lines', []) if l.get('who')}
        figs = {re.sub(r'\s*\(.*$', '', c).strip().lower() for pb in self.plan['beats'] for c in pb.get('chars', []) if isinstance(c, str)}
        self.cast = set((self.src.get('cast') or {}).keys()) | set((self.plan.get('cast') or {}).keys()) | set(CAST_ADD.get(seg, {})) \
            | BASE_CAST | who | figs

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
            # Ep2: the plan's own kind for the item (onscreen_items is authoritative: rail, card, stat, plate, post, doc,
            # caption, lower-third, toast, ui, sign), so the pixel lock and the shot pass know a post from a sign
            kind = next((it.get('kind') for it in pb.get('onscreen_items') or [] if it.get('text') == t), None)
            if kind:
                d['kind'] = kind
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
            if l.get('sub'):
                # Ep2 (the lock QA, 2026-10-09): the subtitle as drawn when it isn't the recorded words (a cut-off:
                # "And profit—"; "…one of my favorite—" / "—things."), [text, word index | "after:<line id>"] pieces;
                # the take stays whole, the pixel lock draws the pieces (studio/src/episodes/ep02/pixel/tools/lock.py)
                ln['sub'] = copy.deepcopy(l['sub'])
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
        act = pb.get('act') or prev.get('act') or next((x.get('act') for x in self.src['beats'] if x.get('act')), None) or LABEL[self.seg]
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
                        self.deviate(pb['id'], f'the lock pass: "{text}" ' + ', '.join(f'{k} {o.get(k)} -> {v}' for k, v in kv.items())
                                     + f' ({why})')
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
                    self.note(pb['id'], f'cue: "{o_[:40]}…" -> "{n_[:40]}…" (the plan\'s picture)')
        if pb.get('music'):
            b['cues'] = [f'music ({CUT}): {pb["music"]}'] + cues
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
            if ln.get('tag') != 'V.O.':
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
                # a takes FILE (Ep1's restored lines named a lines JSON); Ep2's plans name each take's WAV in take_file,
                # which is not a takes file (el_takes.py reads every listed file as JSON), so only JSON is listed
                if l.get('take_file') and str(l['take_file']).endswith('.json'):
                    extra.add(l['take_file'])
        used = {TAKES_USED[l['id']] for b in self.beats for l in b.get('lines', []) if l['id'] in TAKES_USED}
        takes_files = sorted(set(prev) | extra | used)
        src_name = os.path.basename(self.src_path) if self.src_path else 'no source (every beat new)'
        return {
            'episode': 2,
            'title': src.get('title', 'ep1.1_her.wav'),
            'part': self.plan.get('part') or PART.get(self.seg, src.get('part') or self.seg),
            'variant': f'stick-figure dialogue reel Ep2 {CUT} BASE LOCK (Kokoro timing) · the {CUT} takes · temp bed',
            'logline': f'The Ep2 {CUT} base lock of {self.seg}: the beat plan applied to {src_name}.',
            'dateSpan': self.plan.get('dateSpan') or DATESPAN.get(self.seg, src.get('dateSpan', '')),
            'runtimeMin': round(total / 60, 2),
            'dialogueReel': True,
            'cast': {k: v for k, v in {**src.get('cast', {}), **(self.plan.get('cast') or {}), **CAST_ADD.get(self.seg, {})}.items()
                     if k not in CAST_DROP.get(self.seg, set())},
            '_source': {'plan': os.path.relpath(os.path.join(BP_DIR, f'{self.seg}.json'), ROOT), 'timeline': self.src_path,
                        'takes': takes_files[0] if len(takes_files) == 1 else None, 'takes_files': takes_files,
                        'builder': 'audio/reel/ep02-v1/build_timeline.py', 'bed': f'audio/reel/ep02-v1/bed.py -> audio/reel/ep02-v1/{self.seg}-bed.wav',
                        'notes': 'show/episodes/ep02/production/v1/pipeline.md', 'seconds': r3(total)},
            'beats': self.beats,
        }


DEFAULT_GAIN = {}   # filled in main(): a sound's median gain across Ep1's final lock (read only) and this one's plans
# the segments' names (proposal.md's scenes; a plan's own `part` / `dateSpan` wins)
PART = {'coldopen': 'COLD OPEN · sc 1', 'act1': 'ACT ONE · the séance · sc 4-7', 'act2': 'ACT TWO · her · sc 8-12',
        'act3': 'ACT THREE · leave them up · sc 13-17', 'act4': 'ACT FOUR · as a guest · sc 18-22', 'tag': 'TAG · august · sc 23'}
DATESPAN = {'coldopen': 'Feb 15 - 29, 2024', 'act1': 'Mar 5 - 19, 2024', 'act2': 'Apr 1 - May 14, 2024',
            'act3': 'May 15 - 20, 2024', 'act4': 'May 28 - Jun 19, 2024', 'tag': 'Aug 5 - 22, 2024'}


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


MANIFEST = os.path.join(OUT_DIR, f'{KEY}.manifest.json')
# the Ep2 intro variant and the Ep2 outro (show/episodes/ep02/production/v1/pipeline.md §8, §6): their own pictures and
# sound, built by their passes; until they exist the manifest names them and the stick reel shows what it has
INTRO_MP4 = 'out/ep02/v1/intro/intro-ep2-V1-1080p.mp4'
INTRO_WAV = 'audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav'
OUTRO_MP4, OUTRO_WAV = 'out/ep02/v1/outro/outro-b-ep2.mp4', 'out/ep02/v1/outro/outro-b-ep2.wav'
CARD_NAME = 'ep1.1_her.wav'
SUB = {'coldopen': 'sc 1 · the mammoth, and what came through the door', 'act1': 'the séance · sc 4-7',
       'act2': 'her · sc 8-12', 'act3': 'leave them up · sc 13-17', 'act4': 'as a guest · sc 18-22', 'tag': 'august · sc 23'}


def card_timeline():
    """the filename card as a one-beat stick timeline (the pixel card segment, studio/src/episodes/ep02/pixel/card/, draws it)"""
    return {'episode': 2, 'title': CARD_NAME, 'part': 'CARD · the filename card · 2 s',
            'variant': f'Ep2 {CUT} · the filename card as a one-beat segment', 'logline': 'The filename alone, typed on black.',
            'dateSpan': '', 'runtimeMin': 0.03, 'dialogueReel': True, 'cast': {},
            '_source': {'about': 'One beat, 2.0 s (48 f): the filename typed on black with a cursor (LEARNINGS P16 item 3).',
                        'builder': 'audio/reel/ep02-v1/build_timeline.py', 'takes': None, 'act_seconds': 2.0},
            'beats': [{'id': 'card.01', 'act': 'INTRO', 'kind': 'card', 'set': 'void', 'style': 'BASE', 'shot': 'wide',
                       'frame': 'CARD · the filename, typed on black', 'side': '', 'room': '', 'chars': [],
                       'caption': f'Black. A cursor; the filename types on quickly, {CARD_NAME}, and the cursor blinks after it.',
                       'lines': [], 'onscreen': [], 'reelDur': 2.0, 'fx': [], 'cues': [], 'sounds': [], 'passes': {'scene': 'card'}}]}


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
    """the Ep2 episode manifest (Ep1 v3.5's pattern): cold open, the Ep2 intro variant with its own sound, the 2 s
    filename card, the acts, the tag, the Orb outro B (Ep2's). Keyed ep02-v1-stick (no timeline has that key)."""
    outro_s = wav_seconds(OUTRO_WAV) or 10.125
    story = sum(r['seconds'] for r in rep.values())
    first = {seg: json.load(open(os.path.join(OUT_DIR, f'{KEY}-{seg}.json')))['beats'][0]['id'] for seg in SEGS}
    ch = [{'id': 'coldopen', 'label': 'COLD OPEN', 'sub': SUB['coldopen'], 'from': f'{KEY}-coldopen', 'acts': ['COLD OPEN']},
          {'id': 'intro', 'kind': 'video', 'label': 'INTRO', 'act': 'INTRO', 'sub': 'main title · V1 Chip Chamber Jazz · the Ep2 variant',
           'src': INTRO_MP4, 'in': 0, 'dur': 30, 'fit': 'full',
           'audio': {'own': True, 'src': INTRO_WAV, 'gain': -3, 'tail': 0.3},
           'note': "The Ep2 intro variant (show/episodes/ep02/intro-slot.md; pipeline.md §8): its own picture and its own mix "
                   "(Jeremy's \"her\"), at Ep1's -3 dB."},
          {'id': 'card', 'label': 'CARD', 'act': 'INTRO', 'sub': f'the filename card (2 s): {CARD_NAME}', 'from': f'{KEY}-card', 'beats': ['card.01']}]
    for seg in ('act1', 'act2', 'act3', 'act4'):
        ch.append({'id': seg, 'label': {'act1': 'ACT ONE', 'act2': 'ACT TWO', 'act3': 'ACT THREE', 'act4': 'ACT FOUR'}[seg],
                   'sub': SUB[seg], 'from': f'{KEY}-{seg}'})
    ch.append({'id': 'tag', 'label': 'TAG', 'sub': SUB['tag'], 'from': f'{KEY}-tag', 'acts': ['TAG']})
    ch.append({'id': 'outro', 'kind': 'video', 'label': 'OUTRO', 'act': 'CREDITS', 'sub': 'the Orb scan (B) · credits · opus 5.5',
               'src': OUTRO_MP4, 'in': 0, 'dur': round(outro_s, 3), 'fit': 'full',
               'audio': {'own': True, 'src': OUTRO_WAV, 'gain': -1, 'tail': 0},
               'note': f'The Orb outro (B), Ep2\'s: mr. mas · {CARD_NAME} / art · script · music · voices · edit: opus 5.5 / prompt: jgon.'})
    beds = []
    for seg in ('coldopen', 'card', 'act1', 'act2', 'act3', 'act4', 'tag'):
        e = {'chapter': seg, 'cue': 'temp: rooms + SFX + pads per mood', 'label': f'{seg} stick bed (Ep2 {CUT})',
             'src': f'audio/reel/ep02-v1/{seg}-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05}
        if seg in first:
            e['beat'] = first[seg]
        beds.append(e)
    m = {
        'kind': 'episode-manifest', 'key': f'{KEY}-stick', 'episode': 2, 'title': CARD_NAME,
        'variant': f'full-episode stick reel Ep2 {CUT} BASE LOCK (Kokoro timing) · the beat plans · temp beds',
        'dateSpan': 'Feb - Aug 2024', 'runtimeMin': round((story + 30 + 2 + outro_s) / 60, 2),
        '_about': f'The Ep2 {CUT} base lock, Kokoro timing. Chapters: the 3 s title slate, the cold open, the Ep2 intro variant '
                  f'(its own picture and sound), the 2 s filename card ({CARD_NAME}), Acts One to Four and the tag '
                  f'(show/reel/{KEY}/{KEY}-<seg>.json, built by audio/reel/ep02-v1/build_timeline.py from the beat plans), and '
                  'the Orb outro B with its own sound. Sound: the mixer lays every take; one temp bed per chapter '
                  '(audio/reel/ep02-v1/bed.py). Notes: show/episodes/ep02/production/v1/pipeline.md. Nothing here was watched or heard.',
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


def cut_gaps(beats):
    """the gap before each beat's FIRST line, across the cut: its start on the segment clock minus the end of the last
    line of the nearest earlier beat that has lines (the plan's tempo.across_cut), by id"""
    out, t0, prev_end = {}, 0.0, None
    for b in beats:
        ls = sorted(b.get('lines', []), key=lambda l: l['t'])
        if ls:
            if prev_end is not None:
                out[ls[0]['id']] = r3(t0 + ls[0]['t'] - prev_end)
            prev_end = max(t0 + l['t'] + l['dur'] for l in ls)
        t0 += b['reelDur']
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
        # Ep2: every on-screen item the plan lists (onscreen_items, authoritative) is in the lock beat with its exact
        # words, its window (within 0.02 s) and its kind (the lock pass, 2026-10-09: the copy's strip_note had cut the
        # items whose own words end in parentheses, and nothing checked)
        pool = [o for o in b.get('onscreen', []) if isinstance(o, dict)]
        for it in pb.get('onscreen_items') or []:
            same = [o for o in pool if o['text'] == it['text']]          # a text the plan uses twice (4A.04) pairs in order
            o = min(same, key=lambda x: abs((x.get('at') or 0.0) - it['at'])) if same else None
            if o is not None:
                pool.remove(o)
            if o is None:
                bad.append(f'{pb["id"]}: on-screen "{it["text"][:50]}" ({it.get("kind")}) is not in the lock')
                continue
            if (seg, pb['id'], it['text']) in ONSCREEN_SET:
                pass    # the lock pass set this item's window on purpose (ONSCREEN_SET, a deviation with its reason)
            elif abs((o.get('at') or 0.0) - it['at']) > 0.02 or (o.get('until') is not None and abs(o['until'] - it['until']) > 0.02):
                bad.append(f'{pb["id"]}: on-screen "{it["text"][:40]}" {o.get("at")}-{o.get("until")} s, the plan {it["at"]}-{it["until"]} s')
            if o.get('kind') != it.get('kind'):
                bad.append(f'{pb["id"]}: on-screen "{it["text"][:40]}" kind {o.get("kind")}, the plan {it.get("kind")}')
        # lines: every kept / new / restored line is in, every dropped one is out
        ids = {l['id'] for l in b.get('lines', [])}
        for l in pb.get('lines', []):
            if l.get('keep') is False and l['id'] in ids:
                bad.append(f'{pb["id"]}: dropped line {l["id"]} is still in')
            if (l.get('keep') is True or l.get('new') or l.get('restored')) and l['id'] not in ids:
                bad.append(f'{pb["id"]}: line {l["id"]} is missing')
            if l.get('sub') and l['id'] in ids:      # a cut-off's subtitle pieces (the lock QA, 2026-10-09)
                got_ = next(x for x in b['lines'] if x['id'] == l['id'])
                if got_.get('sub') != l['sub']:
                    bad.append(f'{pb["id"]}: line {l["id"]}: subtitle pieces {got_.get("sub")}, the plan {l["sub"]}')
    order_plan = [pb['id'] for pb in S.plan['beats'] if pb['action'] in ('keep', 'new')]
    order_lock = [b['id'] for b in tl['beats']]
    if order_plan != order_lock:
        bad.append('the beat order differs from the plan')
    # the tempo table: the gap before each named line. A beat's first line can carry a gap ACROSS the cut (the plan's
    # tempo.across_cut: the beat before's tail + this head, Ep2's quick exchanges that cut on the reply); that one is
    # measured on the segment clock, from the last line of the beat before (the Ep2 lock pass, 2026-10-09: the copy
    # measured only inside a beat, so every across-cut gap read None and failed)
    gaps = line_gaps(tl['beats'])
    across = cut_gaps(tl['beats'])
    tempo = []
    for pb in S.plan['beats']:
        for lid, g in ((pb.get('tempo') or {}).get('gaps') or {}).items():
            m = gaps.get(lid, across.get(lid))
            ok = m is not None and abs(m - g) <= 0.02
            tempo.append({'beat': pb['id'], 'line': lid, 'plan_s': g, 'lock_s': m, 'ok': ok})
            if not ok:
                bad.append(f'{pb["id"]}: tempo gap before {lid} {m} s, the plan {g} s')
    return rows, bad, tempo


EXACT_ID = set()   # beats whose length is reserved (EXACT_FRAMES), exempt from the est_s check


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
    global BP_DIR, OUT_DIR, REPORT, MANIFEST
    import argparse
    ap = argparse.ArgumentParser(description='the Ep2 v1 base lock (Kokoro timing): beat plans -> stick timelines')
    ap.add_argument('segs', nargs='*', help='coldopen act1 act2 act3 act4 tag (default: all six)')
    ap.add_argument('--plans', help='read the beat plans from this folder (a test; default show/episodes/ep02/production/v1/beat-plan)')
    ap.add_argument('--out', help='write the timelines, the manifest and the report here (a test; default show/reel/ep02-v1/)')
    ap.add_argument('--takes', action='append', default=[], help='a takes file read first (repeatable)')
    a = ap.parse_args(argv)
    bad = [x for x in a.segs if x not in SEGS]
    if bad:
        ap.error(f'unknown segment(s) {bad}: {" ".join(SEGS)}')
    if a.plans:
        BP_DIR = os.path.abspath(a.plans)
    if a.out:
        OUT_DIR = os.path.abspath(a.out)
        REPORT = os.path.join(OUT_DIR, 'lock-report.json')
        MANIFEST = os.path.join(OUT_DIR, f'{KEY}.manifest.json')
    EXTRA_TAKES.extend(a.takes)
    segs = a.segs or SEGS
    have = [s_ for s_ in segs if os.path.exists(os.path.join(BP_DIR, f'{s_}.json'))]
    if not have:
        raise SystemExit(f'no beat plan in {os.path.relpath(BP_DIR, ROOT)}/ for {" ".join(segs)}: the script pass writes them')
    if have != segs:
        print(f'(no beat plan yet for {" ".join(x for x in segs if x not in have)}: skipped)')
    segs = have
    takes = load_takes()
    gains = {}
    for s in SEGS:                     # a sound's usual gain: Ep1's final lock (read only), for a plan sound with none
        p = os.path.join(ROOT, f'show/reel/ep01-v35/ep01-v35-{s}.json')
        for b in (jl(p)['beats'] if os.path.exists(p) else []):
            for sd in b.get('sounds', []):
                if sd.get('gain') is not None:
                    gains.setdefault(sd['name'], []).append(sd['gain'])
    DEFAULT_GAIN.update({k: round(st.median(v)) for k, v in gains.items()})
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    rep = json.load(open(REPORT)) if os.path.exists(REPORT) else {}
    for seg in segs:
        S = Seg(seg, takes)
        S.build()
        tl = S.timeline()
        f = os.path.join(OUT_DIR, f'{KEY}-{seg}.json')
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
        noscene = [b['id'] for b in tl['beats'] if not (b.get('passes') or {}).get('scene')]
        if noscene:
            bad.append(f'beats with no scene id (the per-scene render needs one): {noscene[:10]}{"..." if len(noscene) > 10 else ""}')
        src_med = median_gaps(S.src['beats']) if S.src['beats'] else None
        new_med = median_gaps(tl['beats'])
        rep[seg] = {'timeline': os.path.relpath(f, ROOT), 'source': S.src_path, 'source_story_s': r3(src_total),
                    'estimate_s': S.plan.get('story_s', {}).get('estimate'), 'seconds': r3(total), 'frames': seg_frames(tl['beats']),
                    'source_frames': seg_frames(S.src['beats']) if S.src['beats'] else 0, 'beats': len(tl['beats']), 'lines': nl, 'vo': nvo,
                    'vo_lines': [f"{l['id']} ({b['id']}): {l['text']}" for b in tl['beats'] for l in b['lines'] if l.get('tag') == 'V.O.'],
                    'scenes': list(dict.fromkeys(str((b.get('passes') or {}).get('scene')) for b in tl['beats'])),
                    'jcuts': pre, 'lcuts': cross, 'median_gap_source': src_med, 'median_gap': new_med,
                    'beat_lengths': rows, 'tempo': tempo, 'check_failures': bad,
                    'edits': S.edits, 'deviations': S.dev, 'safety_net': S.safety}
        m, s_ = divmod(total, 60)
        print(f'== {seg}: {len(tl["beats"])} beats, {nl} lines ({nvo} V.O.), {int(m)}:{s_:04.1f}, {rep[seg]["frames"]} frames '
              f'(source {src_total:.1f} s, plan estimate {S.plan.get("story_s", {}).get("estimate")} s) -> {os.path.relpath(f, ROOT)}')
        for d in S.dev:
            print(f'   deviation {d["beat"]}: {d["what"]}')
        for x in bad:
            print(f'   CHECK {x}')
        print(f'   J-cut lines: {len(pre)}; lines running past their shot: {len(cross)}; tempo gaps checked: {len(tempo)} '
              f'({sum(1 for x in tempo if x["ok"])} ok)')
        print(f'   median gap between lines: {new_med}' + (f' (source {src_med})' if src_med else ''))
    json.dump(rep, open(REPORT, 'w'), indent=1, ensure_ascii=False)
    open(os.path.join(OUT_DIR, f'{KEY}-card.json'), 'w').write(json.dumps(card_timeline(), indent=1, ensure_ascii=False) + '\n')
    files = [(LABEL[s], os.path.relpath(os.path.join(OUT_DIR, f'{KEY}-{s}.json'), ROOT)) for s in SEGS if os.path.exists(os.path.join(OUT_DIR, f'{KEY}-{s}.json'))]
    print(f'\n---- pacing, the Ep2 {CUT} lock ----')
    print(pacing(files))
    tot = sum(r['seconds'] for r in rep.values())
    vo = sum(r['vo'] for r in rep.values())
    print(f'story total: {int(tot // 60)}:{tot % 60:04.1f} ({tot:.1f} s, {sum(r["frames"] for r in rep.values())} frames); '
          f'inner voice: {vo} lines')
    if all(s in rep for s in SEGS):
        write_manifest({s: rep[s] for s in SEGS})
    fails = sum(len(rep[s]['check_failures']) for s in segs)
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
