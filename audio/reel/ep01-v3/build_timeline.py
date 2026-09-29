#!/usr/bin/env python3
"""Ep1 v3 STICK LOCK: one generic builder that applies a segment's beat plan to its v2 source timeline.

  python3 audio/reel/ep01-v3/build_timeline.py [seg ...]        (default: all six; plain python3, no venv needed)
      reads  show/episodes/ep01/production/full-v3/beat-plan/<seg>.json   (the hand-off contract, PLAN.md §2)
             its "source" timeline (show/reel/ep01-full/ep01-<seg>-v2.json, show/reel/ep01-act4-v5.json), never edited
             audio/ep01/v3/<seg>/lines-v3.json                            (the v3 takes: V.O. and new lines)
      writes show/reel/ep01-v3/ep01-v3-<seg>.json                         (the lock: a dialogue-reel timeline)
             audio/reel/ep01-v3/lock-report.json                          (per segment: lengths, edits, deviations)
      prints a per-segment report and the pacing tool's output (studio/src/reel/tools/pacing.py), v2 against v3.

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
BP_DIR = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan')
OUT_DIR = os.path.join(ROOT, 'show/reel/ep01-v3')
TAKES_DIR = os.path.join(ROOT, 'audio/ep01/v3')
REPORT = os.path.join(ROOT, 'audio/reel/ep01-v3/lock-report.json')
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
    'the check, legible in the wide: MACROSOFT · "multiyear, multibillion dollar" · amount: $ MULTIBILLION':
        'MACROSOFT · "multiyear, multibillion dollar" · $ MULTIBILLION',
    "the lighthouse's own sign: MISANTHROPIC": 'MISANTHROPIC',
    'LIVE · CHAT (the F spam as a small egg, no hold)': 'LIVE · CHAT:  F  F  F  F',
}
# a source caption that describes a line the plan dropped (checked in build: a caption quoting a dropped line)
CAPTION_FIX = {'S7.02b': 'Then the record: below, above, around. The floor, ceiling and walls turn slate.'}
# where an added item appears, when the plan says "moved from" or the frame fixes it (seconds into the beat)
ADD_AT = {('6.06', 'RAIL: DEC 5, 2022'): 0.15,
          ('9.01', 'MACROSOFT · "multiyear, multibillion dollar" · $ MULTIBILLION'): 2.4}   # after the check pushes the door
# sounds that end a no-line beat which the V.O. lengthens: they keep their distance from the beat's end (the plan's
# caption says "then the click" / "then taps"; the sample moved S1.06's click the same way)
END_ANCHORED = {('S1.06', 'dialog_ok_click'), ('22.02', 'key_tap_soft_01')}
# a line's sound J-cut that belongs to the NEXT scene (bed.py reads this too): the sound named is the incoming room's
JCUT_NEXT = {'9.13', '15.18', 'S4.15'}


# script-v3-notes §1.3, ranked. The lock applies them in order while the story is over TARGET_MAX (PLAN: 19:45-20:45),
# as overrides on the beat plans (the plans are the script pass's files), and logs each one.
TARGET_MAX = 20 * 60 + 45
TRIMS = [
    {'ref': 'T1', 'seg': 'act4', 'beat': 'S5.08', 'drop_line': 'a5-29-15', 'saves': 2.3,
     'what': 'S5.08: Gerg\'s "That\'ll be the share sale. Everybody\'s been waiting on that one." (the check reads itself)'},
    {'ref': 'T2', 'seg': 'act3', 'beat': '21.02', 'drop_line': None, 'saves': 2.8, 'what': '21.02: the second deepfake (not automated here)'},
]
# The lead's ruling (2026-09-27): T1 stays out (Gerg's line explains the check for a newcomer); with the J-cut gaps closed
# the story fits without a trim. V3_TRIMS=T1 re-applies it.
APPLIED_TRIMS = [t for t in TRIMS if t['ref'] in os.environ.get('V3_TRIMS', '').split(',') and t.get('drop_line')]


def r3(x):
    return round(float(x) + 0.0, 3)


def jl(p):
    return json.load(open(p if os.path.isabs(p) else os.path.join(ROOT, p)))


def load_takes():
    takes = {}
    for seg in SEGS:
        f = os.path.join(TAKES_DIR, seg, 'lines-v3.json')
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
    return re.sub(r'\s*\([^()]*\)\s*$', '', s).strip()


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
        for tr in APPLIED_TRIMS:
            if tr['seg'] != seg:
                continue
            pb = next(b for b in self.plan['beats'] if b['id'] == tr['beat'])
            for l in pb.get('lines', []):
                if l['id'] == tr['drop_line']:
                    l['keep'] = False
                    l['why'] = f'{tr["ref"]} (script-v3-notes §1.3): {tr["what"]}'
            pb['min_s'] = round(pb['src_s'] - tr['saves'], 3)
            pb['min_why'] = f'{tr["ref"]}: the plan\'s saving is {tr["saves"]} s'
            self.trims.append(tr)
        self.src_path = self.plan['source']
        self.src = jl(self.src_path)
        self.S = {b['id']: b for b in self.src['beats']}
        self.takes = takes
        self.edits, self.dev, self.safety = [], [], []
        self.cast = set((self.src.get('cast') or {}).keys()) | {'mas', 'gerg', 'rima', 'alyi', 'mario', 'radnus', 'tasya', 'nole'}

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
            at = ADD_AT.get((pb['id'], t), 0.2)   # set dressing: from the shot's start
            out.append({'text': t, 'at': r3(min(at, max(0.0, b['reelDur'] - 0.5))), 'until': None, '_add': True})
            self.note(pb['id'], f'on-screen add: "{t}"')
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

        # the plan's line entries
        plan_lines = pb.get('lines', [])
        dropped = {l['id']: l for l in plan_lines if l.get('keep') is False}
        new = [l for l in plan_lines if l.get('new')]
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
            for sd in ms.get('sounds', []):
                if any(ml['moved_from'] == mb['id'] for ml in moved):
                    continue  # the moved line brings its own sounds (below)
                merged_sounds.append(dict(sd, at=r3(mtl + sd['at']), _merged=mb['id']))
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
            """a slot at S s into the beat, before the first line (which moves only as far as it must)"""
            slot['gap'] = S
            if order:
                first = order[0]
                t0 = first['gap']
                first['gap'] = max(VO_GAP, t0 - (S + slot['len']))
            order.insert(0, slot)

        for l in moved:
            ms = self.S[l['moved_from']]
            ml = next(x for x in ms['lines'] if x['id'] == l['id'])
            slot = {'id': l['id'], 'line': copy.deepcopy(ml), 'len': ml['dur'], 'new': True, 'moved': True,
                    'carry': [dict(sd, _off=sd['at'] - ml['t']) for sd in ms.get('sounds', []) if ml['t'] - 1.0 <= sd['at'] <= ml['t'] + ml['dur']]}
            insert_after(l.get('after'), slot, l.get('gap_s', 0.5))
            self.note(pb['id'], f'line {l["id"]} moved in from {l["moved_from"]} after {l.get("after")} (+{l.get("gap_s")} s), '
                                f'with {len(slot["carry"])} sound(s)')
        for l in new:
            r = self.takes.get(l['id'])
            if not r:
                self.deviate(pb['id'], f'new line {l["id"]} has no take: left out')
                continue
            rep_of = next((d for d, n in repl.items() if n == l['id']), None)
            tag = (self.S[pb['id']]['lines'][[x['id'] for x in sb['lines']].index(rep_of)].get('tag', '') if rep_of else '')
            text = l['text'].strip()
            ln = take_line(r, l['id'], l['who'], text, 0.0, tag)
            slot = {'id': l['id'], 'line': ln, 'len': ln['dur'], 'new': True}
            after = l.get('after')
            if isinstance(after, str) and after.startswith('start+'):
                place_start(slot, float(after[6:]))
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
            at = v['at']
            if at.startswith('start+'):
                place_start(slot, float(at[6:]))
            elif at.startswith('after:'):
                ref, S = re.match(r'after:(.+)\+([\d.]+)$', at).groups()
                insert_after(ref, slot, float(S))
            elif at.startswith('before:'):
                ref, S = re.match(r'before:(.+)-([\d.]+)$', at).groups()
                tgt = next((s for s in order if s['id'] == ref), None)
                k = order.index(tgt)
                slot['gap'] = tgt['gap']
                tgt['gap'] = float(S)
                order.insert(k, slot)
            self.note(pb['id'], f'V.O. {v["id"]} ({ln["dur"]:.2f} s) at {at}')

        # ---------------------------------------------------------- lay out
        head0 = slots[0]['gap'] if slots else 0.0
        if not order:
            # every line went and nothing replaced it: the beat is its head and its tail (a trim may ask for more)
            end = head0 + (end_mode[1] if end_mode[0] == 'tail' else 0.5)
            if pb.get('min_s'):
                end = max(end, pb['min_s'])
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
            p0 = old_by_i[k]['e'] if k >= 0 else head0   # the removed line collapses onto this point
            return p0 + min(off, 0.3)

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
        for ms in merged_sounds:  # fitted into the target's length
            b.setdefault('sounds', []).append({k: v for k, v in ms.items() if k != '_merged'} | {'at': r3(ms['at'] * end / mtl)})

        if not audio_changed:
            self.fit_unchanged(pb, b, sb)
        # clamp, sort
        self.tidy(b)
        return b

    def fit_unchanged(self, pb, b, sb):
        """no audio change: the beat takes est_s, the added time at its head (arrive_s) or tail; a trim off the tail"""
        dur0, est = sb['reelDur'], pb.get('est_s', sb['reelDur'])
        delta = est - dur0
        if abs(delta) < 0.02:
            b['reelDur'] = dur0   # exact: the frame layout stays the source's
            return
        lines = b.get('lines', [])
        if delta > 0:
            at_head = pb.get('arrive_s') is not None and pb.get('hold_after_s') is None
            if at_head:
                self.shift_all(b, delta)
                self.note(pb['id'], f'arrival +{delta:.2f} s at the head (arrive_s {pb["arrive_s"]}; first line at '
                                    f'{min((l["t"] for l in lines), default=0):.2f} s)')
            else:
                self.note(pb['id'], f'hold +{delta:.2f} s at the tail'
                                    f'{(" (hold_after_s " + str(pb["hold_after_s"]) + ")") if pb.get("hold_after_s") is not None else ""}')
            b['reelDur'] = r3(est)
            return
        # a trim
        last_e = max((l['t'] + l['dur'] for l in lines), default=None)
        if last_e is None:
            self.scale_all(b, est / dur0)
            self.note(pb['id'], f'trim {dur0:.2f} -> {est:.2f} s, timed items scaled')
        elif dur0 + delta - last_e >= MIN_TAIL - EPS:
            self.note(pb['id'], f'trim {-delta:.2f} s off the tail ({dur0 - last_e:.2f} -> {est - last_e:.2f} s after the last word)')
        else:
            est = last_e + MIN_TAIL
            self.deviate(pb['id'], f'trim to {pb["est_s"]} s would cut into the last line; kept {MIN_TAIL} s after it ({est:.2f} s)')
        b['reelDur'] = r3(est)

    def build_noline(self, pb, b, sb, dur0, mtl, merged_sounds, vos, dropped):
        """a beat with no lines (after the plan's drops): the V.O. and the timed items on their own clock"""
        est = pb.get('est_s', dur0)
        for lid in dropped:
            self.note(pb['id'], f'line {lid} dropped ("{dropped[lid].get("text", "")[:50]}")')
        b['lines'] = []
        b.setdefault('sounds', [])
        b['sounds'] = b['sounds'] + [{k: v for k, v in s.items() if k != '_merged'} for s in merged_sounds]
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
            if target < mtl - EPS or merged_sounds:
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
        m = re.search(r'the (\S+?) setup', pb.get('frame', ''))
        base = self.S.get(m.group(1)) if m else None
        if base:
            b = copy.deepcopy(base)
            for k in ('realStart', 'realDur', 'real', 'seq', 'names', 'sounds', 'speak', 'shotId', 'cont'):
                b.pop(k, None)
            b['onscreen'] = []
            self.note(pb['id'], f'new beat from the {m.group(1)} setup')
        else:
            b = {'kind': 'scene', 'set': pb.get('set', 'void'), 'style': 'BASE', 'shot': 'medium', 'room': prev.get('room', ''),
                 'chars': [c.split(' ')[0] for c in pb.get('chars', [])], 'onscreen': [], 'fx': []}
            self.note(pb['id'], 'new beat from its set and characters')
        b['id'] = pb['id']
        b['act'] = prev.get('act')
        b['side'] = ''
        b['frame'] = pb.get('frame', b.get('frame', ''))
        b['caption'] = pb.get('caption', '')
        b['cues'] = []
        b['lines'] = []
        need = 0.0
        for v in pb.get('vo', []):
            r = self.takes.get(v['id'])
            if not r:
                self.deviate(pb['id'], f'V.O. {v["id"]} has no take')
                continue
            S = float(v['at'][6:]) if v['at'].startswith('start+') else 0.5
            ln = take_line(r, v['id'], 'mas', v['text'], S, 'V.O.')
            b['lines'].append(ln)
            need = max(need, S + ln['dur'] + (pb.get('hold_after_s') or NEW_BEAT_HOLD))
            self.note(pb['id'], f'V.O. {v["id"]} ({ln["dur"]:.2f} s) at {v["at"]}')
        b['reelDur'] = r3(max(need, 1.0) if need else pb.get('est_s', 3.0))
        return b

    # ------------------------------------------------------------------ names and cues
    def finish(self, b, pb):
        if pb.get('caption') and b.get('caption') != pb['caption']:
            b['caption'] = pb['caption']
            self.note(pb['id'], 'caption from the plan')
        elif pb['id'] in CAPTION_FIX:
            self.deviate(pb['id'], f'the source caption quoted a dropped line; now "{CAPTION_FIX[pb["id"]]}"')
            b['caption'] = CAPTION_FIX[pb['id']]
        for l in pb.get('lines', []):
            first = re.split(r'(?<=[.?!])\s', l.get('text', '') or '')[0].strip('"… ')
            if l.get('keep') is False and first and first[:12] in (b.get('caption') or ''):
                self.deviate(pb['id'], f'the caption still quotes the dropped line "{first}"')
        if pb.get('music'):
            cues = [c for c in b.get('cues', []) if not c.lower().startswith('music')]
            b['cues'] = [f'music (v3): {pb["music"]}'] + cues
        # where Mas's voice names someone in the cast, the strip names them on that word
        have = {n['id'] for n in b.get('names', [])}
        for ln in b.get('lines', []):
            if ln.get('tag') != 'V.O.' or not ln['id'].startswith('v3-vo'):
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
            if act == 'merge':
                continue
            if act == 'keep':
                b = self.build_keep(pb, merges.get(pb['id'], []))
            elif act == 'new':
                b = self.build_new(pb, out[-1] if out else {})
            else:
                raise ValueError(act)
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
        self.beats = out
        return out

    def timeline(self):
        src = self.src
        total = sum(b['reelDur'] for b in self.beats)
        takes_files = sorted({os.path.relpath(os.path.join(TAKES_DIR, self.seg, 'lines-v3.json'), ROOT)} |
                             ({src['_source']['takes']} if isinstance(src.get('_source'), dict) and isinstance(src['_source'].get('takes'), str) else set()))
        return {
            'episode': 1,
            'title': src.get('title', 'ep1.0_research_preview.md'),
            'part': (src.get('part') or self.seg).replace(' + OUTRO placeholder', ''),
            'variant': 'stick-figure dialogue reel v3 LOCK · v2/v5 takes + the v3 takes (Mas\'s inner voice, the new lines) · temp bed',
            'logline': f'The v3 stick lock of {self.seg}: the beat plan applied to {os.path.basename(self.src_path)} '
                       f'(arrivals, aftermaths, Mas\'s inner voice, the cuts, no pointers).',
            'dateSpan': src.get('dateSpan', ''),
            'runtimeMin': round(total / 60, 2),
            'dialogueReel': True,
            'cast': src.get('cast', {}),
            '_source': {'plan': os.path.relpath(os.path.join(BP_DIR, f'{self.seg}.json'), ROOT), 'timeline': self.src_path,
                        'takes': takes_files[0] if len(takes_files) == 1 else None, 'takes_files': takes_files,
                        'builder': 'audio/reel/ep01-v3/build_timeline.py', 'bed': f'audio/reel/ep01-v3/bed.py -> audio/reel/ep01-v3/{self.seg}-bed.wav',
                        'notes': 'show/episodes/ep01/production/full-v3/lock.md', 'seconds': r3(total)},
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


MANIFEST = os.path.join(OUT_DIR, 'ep01-v3.manifest.json')
OUTRO_MP4, OUTRO_WAV = 'out/ep01/outro/outro-b-v3.mp4', 'out/ep01/outro/outro-b-v3.wav'
SUB = {'coldopen': 'sc 1-4 · v2 takes', 'act1': 'research preview · sc 5-12 · v2 + v3 takes', 'act2': 'the regulate-me tour · sc 13-17',
       'act3': 'verified: human · sc 18-23', 'act4': 'the blip, told twice · sc 24-31 · v5 + v3 takes', 'tag': 'december · sc 32-33'}


def wav_seconds(path):
    import wave
    try:
        with wave.open(os.path.join(ROOT, path)) as w:
            return w.getnframes() / w.getframerate()
    except Exception:
        return None


def write_manifest(rep):
    """the episode manifest (the v2 manifest's pattern): cold open, the intro (the v2 file), the 2 s filename card,
    the acts, the tag, the Orb outro with its own sound. Keyed ep01-v3-stick (no timeline has that key)."""
    outro_s = wav_seconds(OUTRO_WAV) or 10.125
    story = sum(r['seconds'] for r in rep.values())
    first = {seg: json.load(open(os.path.join(OUT_DIR, f'ep01-v3-{seg}.json')))['beats'][0]['id'] for seg in SEGS}
    ch = [{'id': 'coldopen', 'label': 'COLD OPEN', 'sub': SUB['coldopen'], 'from': 'ep01-v3-coldopen', 'acts': ['COLD OPEN']},
          {'id': 'intro', 'kind': 'video', 'label': 'INTRO', 'act': 'INTRO', 'sub': 'main title · V1 Chip Chamber Jazz',
           'src': 'out/season/intro/intro-ep1-V1-1080p.mp4', 'in': 0, 'dur': 30, 'fit': 'full',
           'audio': {'own': True, 'src': 'audio/intro-mix/intro-ep1-mix-V1-chipchamber.wav', 'gain': -3, 'tail': 0.3},
           'note': 'The v2 manifest\'s intro, unchanged. The -3 dB trim is a proposal for an ear to confirm.'},
          {'id': 'card', 'label': 'CARD', 'act': 'INTRO', 'sub': 'the filename card (2 s; no disclaimer)', 'from': 'ep01-full-part1', 'beats': ['card.01']}]
    for seg in ('act1', 'act2', 'act3', 'act4'):
        ch.append({'id': seg, 'label': {'act1': 'ACT ONE', 'act2': 'ACT TWO', 'act3': 'ACT THREE', 'act4': 'ACT FOUR'}[seg],
                   'sub': SUB[seg], 'from': f'ep01-v3-{seg}'})
    ch.append({'id': 'tag', 'label': 'TAG', 'sub': SUB['tag'], 'from': 'ep01-v3-tag', 'acts': ['TAG']})
    ch.append({'id': 'outro', 'kind': 'video', 'label': 'OUTRO', 'act': 'CREDITS', 'sub': 'the Orb scan (B) · credits',
               'src': OUTRO_MP4, 'in': 0, 'dur': round(outro_s, 3), 'fit': 'full',
               'audio': {'own': True, 'src': OUTRO_WAV, 'gain': -1, 'tail': 0},
               'note': 'The v3-outro pass\'s file. Its master is -16.0 LUFS; the -1 dB trim puts it level with the intro '
                       '(-14 LUFS less 3 dB): a proposal for an ear to confirm.'})
    beds = [{'chapter': 'coldopen', 'beat': first['coldopen'], 'cue': 'MM-14 / MM-06 (v2 stem)',
             'label': 'the v2 cold-open stem (hall, plink, F4, rewind, MM-06), 0.5 s later: its timing still lines up',
             'src': 'audio/reel/ep01-v3/coldopen-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05},
            {'chapter': 'card', 'label': 'room tone (the v2 card stand-in level) + the bullpen leading the cut',
             'src': 'audio/reel/ep01-v3/card-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05}]
    for seg in ('act1', 'act2', 'act3', 'act4', 'tag'):
        beds.append({'chapter': seg, 'beat': first[seg], 'cue': 'temp: rooms + SFX + pads per mood',
                     'label': f'{seg} stick bed (rooms leading the cuts, the beats\' sounds, a quiet temp pad per mood run)',
                     'src': f'audio/reel/ep01-v3/{seg}-bed.wav', 'in': 0, 'loop': 'none', 'lufs': None, 'xfade': 0.05})
    m = {
        'kind': 'episode-manifest', 'key': 'ep01-v3-stick', 'episode': 1, 'title': 'ep1.0_research_preview.md',
        'variant': 'full-episode stick reel v3 LOCK · the v3 beat plans on the v2/v5 timelines · v2/v5 + v3 takes · temp rooms, '
                   'SFX and pads · for timing and the voice',
        'dateSpan': 'Nov 2022 - Dec 2023', 'runtimeMin': round((story + 30 + 2 + outro_s) / 60, 2),
        '_about': 'The Ep1 v3 stick lock (PLAN.md S3, pass v3-lock, 2026-09-27). Chapters: the reel\'s 3 s title slate, the cold '
                  'open, the V1 intro (the v2 file), the 2 s filename card (card.01 of ep01-full-part1: the filename alone), '
                  'Acts One to Four and the tag (show/reel/ep01-v3/ep01-v3-<seg>.json, built by audio/reel/ep01-v3/build_timeline.py '
                  'from the beat plans and the v2/v5 timelines), and the Orb outro (B) with its own sound. Sound: the mixer lays '
                  'every take; one temp bed per chapter (audio/reel/ep01-v3/bed.py): rooms leading the cuts, the beats\' sounds, '
                  'a quiet pad per mood run (the cold open keeps its v2 stem). The real score and SFX come from later passes. '
                  'Notes: show/episodes/ep01/production/full-v3/lock.md. Nothing here was watched or heard.',
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
        f = os.path.join(OUT_DIR, f'ep01-v3-{seg}.json')
        open(f, 'w').write(json.dumps(tl, indent=1, ensure_ascii=False) + '\n')
        src_total = sum(b['reelDur'] for b in S.src['beats'] if b['id'] != 'OUT.01')
        total = sum(b['reelDur'] for b in tl['beats'])
        nl = sum(len(b['lines']) for b in tl['beats'])
        nvo = sum(1 for b in tl['beats'] for l in b['lines'] if l.get('tag') == 'V.O.')
        cross = [f"{l['id']} ({b['id']})" for b in tl['beats'] for l in b['lines'] if l['t'] + l['dur'] > b['reelDur'] + 0.01]
        pre = [f"{l['id']} ({b['id']}, {l['t']:+.2f})" for b in tl['beats'] for l in b['lines'] if l['t'] < 0]
        for tr in S.trims:
            S.dev.insert(0, {'beat': tr['beat'], 'what': f'{tr["ref"]} applied (script-v3-notes §1.3, the story ran over 20:45): {tr["what"]}'})
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
    v3 = [(LABEL[s], f'show/reel/ep01-v3/ep01-v3-{s}.json') for s in SEGS if os.path.exists(os.path.join(OUT_DIR, f'ep01-v3-{s}.json'))]
    print('\n---- pacing, v2 (the v2 stick; the tag includes the 12 s outro placeholder) ----')
    print(pacing(v2))
    print('---- pacing, v3 lock ----')
    print(pacing(v3))
    tot = sum(r['seconds'] for r in rep.values())
    print(f'story total: {int(tot // 60)}:{tot % 60:04.1f} ({tot:.1f} s)')
    if all(s in rep for s in SEGS):
        write_manifest({s: rep[s] for s in SEGS})


if __name__ == '__main__':
    main(sys.argv[1:])
