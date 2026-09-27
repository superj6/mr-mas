#!/usr/bin/env python3
"""Ep1 COLD OPEN (sc 1-4): the STICK-FIGURE DIALOGUE REEL timeline, v2.

  python3 audio/reel/ep01-coldopen-v2/build_timeline.py          -> show/reel/ep01-full/ep01-coldopen-v2.json
  CO_OUT=<file> python3 audio/reel/ep01-coldopen-v2/build_timeline.py   (a trial build elsewhere)

Then rebuild the temp sound stem from the same JSON (it reads the beat lengths and `sounds`):
  audio/.venv-casting/bin/python audio/reel/ep01-coldopen-v2/coldopen_bed.py

What it is (the showrunner, 2026-09-26: "we should've been iterating on cheaper stick figure runs to nail down flow
and dialogue before final render"): one beat per shot of the script's COLD OPEN (show/episodes/ep01/script.md,
"## COLD OPEN", as saved 22:48 on 2026-09-26, plus the 2026-09-27 stick-reel fixes marked "Stick-reel fixes" in
sc 1-4), staged from its shot directions, with the voiced lines laid from their real takes
(audio/ep01/coldopen/dialogue/lines-fast-v1.json, recorded with fastrec).

The 2026-09-27 fixes (from the newcomer read of ep01-full-v2; coldopen-notes.md §9) change picture and sound only,
no voiced line and no beat length, so the chapter is still 724 frames and the episode clock is unchanged:
  * 3.01-3.02: the Orb's toast carries a year counter that catches on 2022 (YEAR_CATCH) and then slips past;
    coldopen_bed.py reads the '2022' item's at/until to shape the rewind's speed (the drag, then the lurch);
  * 4.01-4.02: the 1993 dialog asks 'Are you sure?'. The reel can't grey a button, so the stick stand-in strikes
    Cancel through (CANCEL_OFF; the script's picture is a 50% dither);
  * 1.03: the phone is planted, face-up and dark (caption only: an insert here draws its text, not props).

The one line that crosses cuts: the script's two MAS blocks in sc 1 ("...push the veil of ignorance back--" /
"--and the frontier of discovery forward...") are ONE sentence and ONE read ("the voice unbroken across both
cuts"), so they are one take (e1-co-1-02). It is placed once, in the MCU where it starts; the dialogue reel keeps a
line playing in the strip across the cuts (Reel.tsx, "a line that crosses a cut keeps playing"), and the episode
mixer lays the file once. The cuts are timed to the take's word timings:
  * the plink ECU is cut in on the dash: at the end of "back" (the read has its 0.44 s phrase break there), and the
    plink lands inside that break, before "and";
  * back to the MCU on "discovery", so the sentence lands on his face.

Timing rules (the same as Act Four's and the tag's builders):
  * a line's speech onset = the beat's start + its lead;
  * a beat whose last line ends inside it ends on its tail after the last word; a beat without one lasts its `dur`
    (a read time for on-screen text: about 0.25 s + 0.05 s a character, or the action's own time);
  * everything is quantised to the 24 fps frame.

The JSON is the "dialogueReel" format of studio/src/reel/schema.ts (DIALOGUE REELS). Nothing here was watched or
heard: the numbers it prints are measurements of the data.
"""
from __future__ import annotations

import json
import os
import statistics

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
LINES_JSON = os.path.join(ROOT, 'audio/ep01/coldopen/dialogue/lines-fast-v1.json')
OUT = os.environ.get('CO_OUT') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-coldopen-v2.json')
FPS = 24
CO_START = 0.0                   # the script's printed clock for the cold open (0:00); the margin's "SCRIPT" label
BEAT = 60 / 96                   # one beat at the house tempo (96 BPM): the script's "1 beat"
BAR = 4 * BEAT                   # one bar: the script's "1 bar" (2.5 s)

LINES = {l['id']: l for l in json.load(open(LINES_JSON))}
SPEAKER = {'MAS': 'mas', 'MAS MANALT': 'mas', 'PANEL HOST': 'host'}


def q(x: float) -> float:
    return round(x * FPS) / FPS


def aud(lid):
    """(audible in, audible out) of a take: the speech span inside its file."""
    p = LINES[lid]['pace']
    return p['audible_in_s'], p['audible_out_s']


def word_end(lid, word, nth=1):
    """seconds from the speech onset to the end of `word` (its nth occurrence) in a take"""
    a_in, _ = aud(lid)
    k = 0
    for w in LINES[lid]['words']:
        if w['w'].lower().strip('.,') == word:
            k += 1
            if k == nth:
                return w['t1'] - a_in
    raise KeyError((lid, word))


def word_start(lid, word, nth=1):
    a_in, _ = aud(lid)
    k = 0
    for w in LINES[lid]['words']:
        if w['w'].lower().strip('.,') == word:
            k += 1
            if k == nth:
                return w['t0'] - a_in
    raise KeyError((lid, word))


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


# the room's plan (script sc 1 PLAN:): Mas's armchair at frame left, turned three-quarters to frame right; the host's
# chair at frame right, the host never shown above the hand (so the host has no figure in any frame); the Orb at his
# right shoulder; the window upstage behind him; the camera stays downstage of the line between the chairs.
CHAIRS = [C('mas', 0.30, 'sit'), C('orb', 0.37)]

# ---- the answer's cuts, from the take's word timings (see the docstring)
HOST_LEAD = 1.0                                   # "from the wide's second second, so the first frame isn't silent"
HOST_TAIL = 0.35                                  # the wide holds past the question, then the cut to his MCU
ANS = 'e1-co-1-02'
ANS_LEAD = 0.30                                   # he starts 0.30 s into the MCU: 0.65 s after the question
MCU1 = q(ANS_LEAD + word_end(ANS, 'back'))        # cut to the ECU on the dash (end of "back")
ECU = q(ANS_LEAD + word_start(ANS, 'discovery') - MCU1)   # back to the MCU on "discovery"
ANS_REST = ANS_LEAD + (aud(ANS)[1] - aud(ANS)[0]) - MCU1 - ECU   # speech left in the second MCU
PLINK_AT = 0.10                                   # inside the phrase break: "back" ... plink ... "and"
NOTED_LEAD = 1.10                                 # he glances down, reads it, looks back up; then the word
TAP_AT = NOTED_LEAD + 0.25                        # "On the word his thumb taps Accept below frame"

# ---- the rewind's year counter (sc 3, 2026-09-27): it catches on 2022 "for about a second", then slips, faster
TOAST = 'rewinding…'
YEAR_CATCH = (0.50, 1.55)                         # inside 3.02: the counter holds 2022 (1.05 s: a 4-character read
                                                  # needs about 0.45 s, so the hold reads as a stop, not a flicker)
SLIP = [('2019', 1.55, 1.95), ('2015', 1.95, 2.32), ('2008', 2.32, 2.67), ('2001', 2.67, None)]   # faster each step
YEARS_302 = [('2023', 0.0, YEAR_CATCH[0]), ('2022', YEAR_CATCH[0], YEAR_CATCH[1])] + SLIP
# ---- the 1993 dialog (sc 4, 2026-09-27): a question it can only answer OK
ASK = 'Are you sure?'
CANCEL_OFF = 'UI: ' + ''.join(ch + '̶' for ch in 'Cancel')   # struck through = greyed out (stick stand-in)

# ------------------------------------------------------------------ the shots (script "## COLD OPEN", sc 1-4)
# on: (text, at, until) seconds inside the beat; lines: (line id, lead s); dur: the beat's length when no line sets
# it; tail: s after the last word; sounds: (name, at, gain) for coldopen_bed.py (gain = the peak dBFS of a one-shot).
SPEC = [
    # ---- sc 1 · INT. APEC CEO SUMMIT, SAN FRANCISCO — MAIN STAGE — DAY [BASE]
    dict(id='1.01', set='stage', shot='wide', frame='WIDE · the one wide: stage, banquet, the lit window',
         chars=CHAIRS, lines=[('e1-co-1-01', HOST_LEAD)], tail=HOST_TAIL,
         seq={'id': 'COLD OPEN', 'place': 'APEC CEO Summit, San Francisco · main stage',
              'time': 'Thu Nov 16, 2023 · day'},
         names=[('mas', HOST_LEAD + word_end('e1-co-1-01', 'mas'))],
         on=[('RAIL: NOV 16, 2023 · SAN FRANCISCO', 0.25, None)],
         caption="Mas in the armchair, the Orb at his shoulder; at frame right only the host's hand and a card. "
                 "Behind: the banquet's ovation, and far off one lit window.",
         real='NOV 16, 2023 · APEC CEO Summit, San Francisco [V]',
         cues=['sound: the hall (HVAC, a polite crowd), the banquet louder; no music',
               'the host: a hand and a PA voice, never a face (unnamed, never gendered)',
               "the lit window is OGAL-A-RAM's: no label, no face, a phone's glow"]),
    dict(id='1.02', set='stage', shot='close', frame="SINGLE · MCU Mas, answering; the window soft behind him",
         chars=[C('mas', 0.36, 'sit', 'calm')], lines=[(ANS, ANS_LEAD)], dur=MCU1,
         caption="Mas answers, unhurried. As he starts, a white dot, a HAILSTONE, leaves the lit window and arcs "
                 "toward us over the bay. We see it; he doesn't.",
         real='NOV 16, 2023 · the "veil of ignorance" answer, trimmed [V]',
         cues=['one sentence, one read: the take plays on across the next two cuts',
               'the hailstone crosses behind him; no pan splits the sentence']),
    dict(id='1.03', set='stage', shot='insert', frame='INSERT · the shared table from above: plink',
         chars=[], dur=ECU,
         on=[('MAS MANALT · CEO, NOPEAI', 0.0, None)],
         sounds=[('synth:plink', PLINK_AT, -4), ('synth:slosh', PLINK_AT + 0.05, -20)],
         caption="Plink: the hailstone lands in his glass and bobs, glyph noise, no letters. The host's glass "
                 "sloshes; his doesn't. His phone lies beside it, face-up and dark.",
         cues=['cut in on the dash: the plink lands in the read\'s own phrase break',
               'the tent card reads for the whole insert',
               'the phone is planted here, dark: the freeze lights it']),
    dict(id='1.04', set='stage', shot='close', frame='SINGLE · MCU Mas, the sentence lands', shotId='1.02',
         chars=[C('mas', 0.36, 'sit', 'calm')], dur=q(ANS_REST + 1.25),
         caption="Back on his face for \"discovery forward.\" Far behind him the lit window's phone clicks off; "
                 "the banquet's applause swells.",
         cues=['the same MCU setup as 1.02', 'the swell rises into the freeze and is cut by it, mid-rise']),
    # ---- sc 2 · SAME — CONTINUOUS [2-TONE FREEZE]
    dict(id='2.01', set='stage', shot='wide', style='2-TONE', frame='WIDE · the freeze', fx=['flash'],
         chars=[C('mas', 0.30, 'sit'), C('orb', 0.37)], dur=q(BEAT),
         seq={'sub': 'the freeze', 'place': 'APEC CEO Summit · main stage', 'time': 'continuous'},
         sounds=[('piano_fired_F4', 0.0, -14)],
         caption="Everything freezes into navy and cream, mid-slosh, mid-ovation. Two things stay in colour: Mas, "
                 "and his phone on the table.",
         cues=['style: 2-TONE FREEZE, a full-room pass; Mas never freezes',
               'music: MM-14 "Freeze F4", one dry piano F4, left to ring',
               'sound: the hall drops to a low filtered hum, never silence']),
    dict(id='2.02', set='screen', shot='insert', style='2-TONE', frame='INSERT · the phone: the invite',
         chars=[], dur=q(BAR),
         on=[('Board sync · Fri 12:00', 0.15, None), ('UI: Accept', 0.45, None), ('UI: Decline', 0.45, None)],
         sounds=[('synth:buzz', 0.05, -20)],
         caption="The phone lights: an invite in a generic calendar UI. Four attendee circles, no names: a doorway, "
                 "a glowing page, a spinner, a black square.",
         real='the noon call on Friday is real (facts #46) [V]; the invite itself is invented',
         cues=['held a bar to read; the buzz is the one close sound',
               "egg: none of the four circles is GERG's green laptop glow"]),
    dict(id='2.03', set='stage', shot='close', style='2-TONE', frame='SINGLE · MCU Mas: he reads it, looks up',
         chars=[C('mas', 0.36, 'sit', 'calm')], lines=[('e1-co-2-01', NOTED_LEAD)], dur=q(BAR),
         sounds=[('key_tap_soft_03', TAP_AT, -26)],
         caption="He reads it and looks back up. On \"noted.\" his thumb taps Accept below frame, eyes up. The light "
                 "on his jaw goes pale blue. He sips.",
         cues=['the hold is his; the tap plays inside it (no insert of the thumb)',
               f'jaw light white -> pale blue at {TAP_AT:.2f} s: the only sign he accepted',
               'the clock (Friday, noon) states no outcome']),
    # ---- sc 3 · SAME [BASE → 1-BIT]
    dict(id='3.01', set='stage', shot='medium', frame='TWO-SHOT · Mas and the Orb: the iris steps',
         chars=[C('mas', 0.30, 'sit'), C('orb', 0.55)], dur=q(0.8 * BAR),
         seq={'sub': 'rewinding', 'place': 'APEC CEO Summit · main stage', 'time': 'continuous'},
         on=[(TOAST, 0.95, None), ('2023', 0.95, None)],
         sounds=[('orb_servo', 0.05, -22), ('orb_servo', 0.35, -24), ('orb_servo', 0.65, -22),
                 ('glyph_blink', 0.95, -26)],
         caption="The Orb's iris steps from the phone to Mas in three drawings. A toast pops beside it, a year "
                 "under it starting to count back: 2023.",
         cues=["music: MM-06 movement I (1993 beeper tier) enters under the F4's decay",
               'the Orb, his witness, carries "how did he get here?" across the cut']),
    dict(id='3.02', set='stage', shot='wide', frame='WIDE · the room scrubs back', fx=['rewind'],
         chars=CHAIRS, dur=q(1.2 * BAR),
         on=[(TOAST, 0.0, None)] + YEARS_302,
         sounds=[('orb_servo', YEAR_CATCH[0], -24), ('orb_servo', YEAR_CATCH[1], -27)],
         caption="The room scrubs back: the ovation sits, the water climbs home, the hailstone flies back. The year "
                 "catches on 2022 for a second, then slips past, faster.",
         cues=['the counter aims at 2022 (Act One) and overshoots: sc 4\'s "too far"',
               'style: BASE -> 1-BIT in four held light steps (reel: 1-BIT end only)',
               'sound: the hall runs backward: a groan on the catch, then a lurch']),
    # ---- sc 4 · F1.1 · 1993 [1-BIT]
    dict(id='4.01', set='void', shot='wide', style='1-BIT', kind='flashback', frame='GFX · 1993: the dialog',
         chars=[], dur=4.0,
         seq={'id': 'F1.1', 'place': 'a 1-bit dialog (no computer, desk or hand)', 'time': '1993'},
         on=[('1993', 0.0, None), (ASK, 0.35, None), ('UI: OK', 0.35, None), (CANCEL_OFF, 0.35, None)],
         caption="Paper white, a 3:2 pillarbox. Alone in the middle, a 1-bit alert asks \"Are you sure?\": OK, and "
                 "Cancel greyed out (a 50% dither). No computer, no hand.",
         real='~1993 · F1.1: the card reads 1993 only',
         cues=['stand-in: Cancel struck through = greyed out (reel can\'t grey a button)',
               'style: F1.1 1-BIT, an era switch; date card top-left, 3:2 pillarbox',
               "music: MM-06's chip notes on F, uneven, stepping (never even: X3)",
               "plants the rule: he always takes the offer (paid at Act Four's noon)"]),
    dict(id='4.02', set='void', shot='wide', style='1-BIT', kind='flashback', frame='GFX · 1993: the toast',
         shotId='4.01', cont=True, chars=[], dur=1.5,
         on=[('1993', 0.0, None), (ASK, 0.0, None), ('UI: OK', 0.0, None), (CANCEL_OFF, 0.0, None),
             ('rewinding… too far', 0.1, None)],
         sounds=[('glyph_blink@1bit', 0.1, -26)],
         caption="The Orb's toast, now in 1-bit. SMASH TO the main titles.",
         cues=['the toast is the joke: its read plus a beat, then SMASH TO the intro']),
]

CAST = {
    'mas': {'role': 'MAN IN THE ARMCHAIR'},
    'orb': {'name': 'THE ORB', 'known': True},
    'host': {'name': 'PANEL HOST', 'role': 'PANEL HOST', 'known': True},
}


def build():
    t = 0.0
    out, placed = [], {}
    for sp in SPEC:
        s0 = t
        lines = []
        last_end = None
        for (lid, lead) in sp.get('lines', []):
            L = LINES[lid]
            a_in, a_out = aud(lid)
            dur = a_out - a_in
            words = [[w['w'], round(max(0.0, w['t0'] - a_in), 3), round(max(0.0, w['t1'] - a_in), 3)] for w in L['words']]
            lines.append({'id': lid, 'who': SPEAKER[L['speaker']], 'text': L['text'], 't': round(lead, 3),
                          'dur': round(dur, 3), 'audio': L['file'], 'in': round(a_in, 3), 'words': words,
                          'tag': '', 'cut': False})
            placed[lid] = dict(beat=sp['id'], on=s0 + lead, end=s0 + lead + dur, words=len(L['words']),
                               who=SPEAKER[L['speaker']], scene=L['scene'])
            last_end = lead + dur
        if 'dur' in sp:
            d = q(sp['dur'])
        else:
            d = q(last_end + sp.get('tail', 0.6))
        onscreen = [{'text': tx, 'at': round(at, 3), 'until': None if until is None or until >= d else round(until, 3)}
                    for (tx, at, until) in sp.get('on', [])]
        sounds = [{'name': n, 'at': round(at, 3), 'gain': g} for (n, at, g) in sp.get('sounds', [])]
        beat = {
            'id': sp['id'], 'act': 'COLD OPEN', 'kind': sp.get('kind', 'scene'), 'set': sp['set'],
            'style': sp.get('style', 'BASE'), 'shot': sp['shot'], 'frame': sp['frame'], 'side': '',
            'room': 'apec-stage' if sp['set'] != 'void' else 'f1.1',
            'chars': sp.get('chars', []), 'caption': sp['caption'], 'lines': lines, 'onscreen': onscreen,
            'reelDur': round(d, 6), 'fx': sp.get('fx', []),
            'realStart': round(CO_START + s0, 3), 'realDur': round(d, 3),
        }
        if sp.get('names'):
            beat['names'] = [{'id': i, 'at': round(a, 3)} for (i, a) in sp['names']]
        for k in ('seq', 'real', 'cues', 'shotId', 'cont'):
            if sp.get(k):
                beat[k] = sp[k]
        if sounds:
            beat['sounds'] = sounds
        out.append(beat)
        t = s0 + d
    return out, placed


def measure_of(beats, placed):
    total = sum(b['reelDur'] for b in beats)
    ons = sorted(placed.values(), key=lambda p: p['on'])
    words = [p['words'] for p in ons]
    gaps = [round(b['on'] - a['end'], 3) for a, b in zip(ons, ons[1:])]
    # a conversation = consecutive lines of more than one speaker with gaps under 2.5 s
    convs, cur = [], [ons[0]] if ons else []
    for a, b in zip(ons, ons[1:]):
        if b['on'] - a['end'] < 2.5:
            cur.append(b)
        else:
            convs.append(cur)
            cur = [b]
    if cur:
        convs.append(cur)
    convs = [c for c in convs if len({p['who'] for p in c}) > 1]
    longest = max(convs, key=lambda c: c[-1]['end'] - c[0]['on']) if convs else None
    scenes = {}
    for b in beats:
        sc = b['id'].split('.')[0]
        scenes[sc] = round(scenes.get(sc, 0) + b['reelDur'], 3)
    return {
        'seconds': round(total, 3), 'frames': round(total * FPS), 'beats': len(beats), 'by_scene_s': scenes,
        'lines_recorded': len(placed), 'script_speaker_blocks': 4,
        'lines_note': "the script's two MAS blocks in sc 1 are one sentence, recorded and placed as one take (e1-co-1-02)",
        'words': sum(words), 'median_words_per_line': statistics.median(words) if words else 0,
        'talk_seconds': round(sum(p['end'] - p['on'] for p in ons), 3),
        'talk_share': round(sum(p['end'] - p['on'] for p in ons) / total, 3),
        'gaps_between_lines_s': gaps,
        'longest_conversation_s': round(longest[-1]['end'] - longest[0]['on'], 3) if longest else 0.0,
        'longest_conversation': f"{longest[0]['beat']}-{longest[-1]['beat']}: the host's question and Mas's answer "
                                f"({len(longest)} turns)" if longest else None,
        'printed_clock': 'cold open 0:00-0:40 in the script (sc 1 0:20, sc 2 0:10, sc 3 0:05, sc 4 0:04 + toast)',
    }


def main():
    beats, placed = build()
    measure = measure_of(beats, placed)
    doc = {
        'episode': 1,
        'title': 'ep1.0_research_preview.md',
        'part': 'COLD OPEN · sc 1-4',
        'variant': 'stick-figure dialogue reel v2 · the recorded takes over a temp stem',
        'logline': 'The cold open for flow: the calm answer, the hailstone, the invite he accepts without looking, the '
                   'rewind to 1993. Stick figures and text cards stand in for the picture.',
        'dateSpan': 'Nov 16, 2023 · 1993',
        'runtimeMin': 22,
        'dialogueReel': True,
        'cast': CAST,
        '_source': {'script': 'show/episodes/ep01/script.md ## COLD OPEN (sc 1-4, as saved 22:48, 2026-09-26, '
                              'plus the 2026-09-27 stick-reel fixes: the year counter, "Are you sure?", the phone)',
                    'takes': 'audio/ep01/coldopen/dialogue/lines-fast-v1.json',
                    'plan': 'audio/ep01/coldopen/dialogue/lines-plan-v1.json',
                    'builder': 'audio/reel/ep01-coldopen-v2/build_timeline.py',
                    'bed': 'audio/reel/ep01-coldopen-v2/coldopen_bed.py -> audio/reel/ep01-coldopen-v2/coldopen-bed.wav',
                    'notes': 'show/episodes/ep01/production/stick/coldopen-notes.md'},
        '_measure': measure,
        'beats': beats,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(beats)} beats, {len(placed)} lines, {measure["seconds"]:.3f} s '
          f'({measure["frames"]} frames)')
    t = 0.0
    for b in beats:
        ln = ' · '.join(f"{l['who']}: {l['text'][:40]} @{l['t']:.2f}+{l['dur']:.2f}" for l in b['lines'])
        print(f"  {b['id']:5s} {t:6.2f} +{b['reelDur']:5.2f}  {b['frame'][:50]:50s} {ln}")
        t += b['reelDur']
    print('  measure:', json.dumps(measure))


if __name__ == '__main__':
    main()
