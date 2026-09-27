#!/usr/bin/env python3
"""Ep1 TAG (sc 32-33) + the OUTRO placeholder: the STICK-FIGURE DIALOGUE REEL timeline, v2.

  python3 audio/reel/ep01-tag-v2/build_timeline.py            -> show/reel/ep01-full/ep01-tag-v2.json
  TAG_OUT=<file> python3 audio/reel/ep01-tag-v2/build_timeline.py   (a trial build elsewhere)

What it is (the showrunner, 2026-09-26: "we should've been iterating on cheaper stick figure runs to nail down flow
and dialogue before final render"): one beat per shot of the script's TAG (show/episodes/ep01/script.md, "## TAG"),
staged from its shot directions, with the two voiced lines laid from their real takes
(audio/ep01/tag/dialogue/lines-fast-v1.json, recorded with fastrec), then a 12 s OUTRO card marked PENDING (five
outro proposals are being compared: show/production/OUTRO-PROPOSALS.md).

Timing rules (the same as Act Four's builder, audio/reel/ep01-act4-v5/build_timeline.py):
  * a line's speech onset = the beat's start + its lead (both lines follow picture: nobody speaks before them);
  * a beat with a line ends on its tail after the last word; a beat without one lasts its `dur`, which is the
    on-screen text's read time (about 0.25 s + 0.05 s a character, more for story text) or the action's own time;
  * everything is quantised to the 24 fps frame.

The JSON is the "dialogueReel" format of studio/src/reel/schema.ts (DIALOGUE REELS). tag_bed.py builds the tag's
temp sound (felt line, room, SFX, the thud, the button chord) from the SAME JSON, so rebuild both after a change.
Nothing here was watched or heard: the numbers it prints are measurements of the data.
"""
from __future__ import annotations

import json
import os
import statistics

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
LINES_JSON = os.path.join(ROOT, 'audio/ep01/tag/dialogue/lines-fast-v1.json')
OUT = os.environ.get('TAG_OUT') or os.path.join(ROOT, 'show/reel/ep01-full/ep01-tag-v2.json')
FPS = 24
TAG_START = 22 * 60 + 7          # the script's printed clock for the tag (22:07); the margin's "SCRIPT" label
BEAT = 60 / 96                   # one beat of the temp felt line (MM-01 at 96 BPM): the script's "2 beats"

LINES = {l['id']: l for l in json.load(open(LINES_JSON))}
SPEAKER = {'MAS': 'mas', 'MAS MANALT': 'mas'}


def q(x: float) -> float:
    return round(x * FPS) / FPS


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


DESK = [C('mas', 0.34, 'sit'), C('orb', 0.44)]   # the dark room's plan (sc 18): Mas at frame left, the Orb at his
                                                  # right shoulder, the monitor at frame right, the rack behind him
SCAN_AT = 0.3                                     # the fan starts across them (32.04)
TOAST_MAS = 1.0                                   # over Mas: at once
TOAST_COVER = TOAST_MAS + 0.6 + 2 * BEAT          # the fan re-sweeps the cover (~0.6 s), then 2 beats more

# ------------------------------------------------------------------ the shots (script "## TAG", sc 32-33)
# on: (text, at, until) seconds inside the beat; lines: (line id, lead s); dur: the beat's length when no line
# sets it; tail: s after the last word; sounds: (name, at, gain) for tag_bed.py, where gain is the peak dBFS of a
# one-shot or the integrated LUFS of a loop (server_hum, room_drone); "synth:*" sounds are made there; an `at` of
# 'END+x' is x s after the beat's last word.
SPEC = [
    # ---- sc 32 · INT. MAS'S DARK ROOM — NIGHT
    dict(id='32.01', set='darkroom', shot='medium', frame='TWO-SHOT · the desk, three marks in the wood',
         chars=DESK, dur=5.25,
         seq={'id': 'TAG', 'place': "Mas's dark room", 'time': 'December 2023 · night'},
         # r3: the duck's card names whose demo it is (the v2 newcomer read: "I don't know whose demo"); the script
         # already puts it on an ELGOOG desk, which the stick stage can't draw. Same beat length: the two cards get
         # 3.4 s for 62 characters (the read rule wants 3.35 s)
         on=[('CUT LINE', 0.3, 1.8),
             ('ELGOOG DEMO: "What the quack!"', 1.85, None),
             ("LATER: THE DEMO WASN'T REAL-TIME", 2.35, None)],
         caption='Mas and the Orb at the desk, three marks in the wood now. Behind them the monitor runs, sound off.',
         real='DEC 2023 · ODNOMIAR paints a CUT LINE [H], NESNEJ holds a smaller chip to it; "small yard, high '
              'fence", visual only [K]; ELGOOG\'s duck demo, DEC 6 [V]',
         cues=['music: MM-12 december (temp: MM-01 Water Line, felt stem) picks up the vault\'s F pedal',
               'sound: the dark room bed (rack fans, LED ticks), in from the bullpen\'s',
               'monitor eggs: zero read load by design; the duck\'s caption is still timed for a read']),
    dict(id='32.02', set='darkroom', shot='insert', frame='INSERT · the rack slot: the delivery (a magazine)',
         chars=[], dur=3.75,
         on=[('RAIL: DEC 6, 2023', 0.35, 2.9),
             ('EMIT · YEAR-END ISSUE', 0.8, None),
             ('CEO OF THE YEAR', 1.2, None)],
         sounds=[('tape_start', 0.0, -24)],
         caption='DELIVERY. The rack slot whirs and ejects a magazine: on the cover, Mas, calm, lit like a keynote.',
         real='DEC 6, 2023 · EMIT names Mas its CEO of the Year [V]',
         cues=['music: the felt line thins under the cover (temp: a 3 dB dip)']),
    dict(id='32.03', set='darkroom', shot='close', frame='MEDIUM CLOSE · Mas and the cover, side by side',
         chars=[C('mas', 0.44, 'sit', 'calm')], dur=2.5,
         on=[('CEO OF THE YEAR', 0.0, None)],
         caption='He holds the cover up next to his face. The cover and the face wear the same expression.'),
    dict(id='32.04', set='darkroom', shot='medium', frame="TWO-SHOT · the Orb's scan, twice",
         chars=[C('mas', 0.34, 'sit'), C('orb', 0.47)], dur=q(TOAST_COVER + 1.15),
         # r2: the cover is in this shot (the fan "sweeps them both"); its card goes up first so the second toast
         # reads as the cover's, not a repeat (the r1 frame showed two identical toasts and no cover)
         # r3: the re-sweep gets its own toast, so the cover's late "verified: human" reads as a near miss and
         # "close." (32.05) has something to answer (the v2 newcomer read: "close to what?"). Script sc 32 now
         # carries the same toast. Same beat length
         on=[('CEO OF THE YEAR', 0.0, None),
             ('verified: human', TOAST_MAS, None),
             ('re-scanning the cover…', TOAST_MAS + 0.2, TOAST_COVER),
             ('verified: human', TOAST_COVER, None)],
         sounds=[('orb_scan_sweep', SCAN_AT, -21), ('glyph_blink', TOAST_MAS, -27),
                 ('orb_scan_sweep', TOAST_MAS + 0.2, -24), ('glyph_blink', TOAST_COVER, -27)],
         caption='The scan fan sweeps both. Over Mas the toast pops at once; over the cover it re-sweeps, 2 beats late.',
         cues=['the first toast is his, the second the cover\'s (the reel stacks them; the picture puts each over its face)']),
    # r2: the cover's card stays up in his hand, so "close." lands on the object he is grading (r1's frame had
    # Mas alone, and the word had nothing on screen to answer)
    dict(id='32.05', set='darkroom', shot='close', frame='SINGLE · profile: Mas, to the cover',
         chars=[C('mas', 0.42, 'sit', 'calm')], lines=[('e1-tg-32-01', 0.7)], tail=1.0,
         on=[('CEO OF THE YEAR', 0.0, None)],
         caption='Mas, in profile, looks at the cover in his hand, not at the Orb, and grades it.'),
    dict(id='32.06', set='darkroom', shot='insert', frame='INSERT · the desk drawer',
         # r3: the stick stage draws none of the three objects, so r2's bare "CTRL" / "DO NOT REMOVE" read as two
         # unexplained words (the v2 newcomer read). A bracketed stand-in names them and where each came from, then
         # the tag's own words land last and hold (read + 1 beat = his look). 3.25 -> 4.25 s (+1.0 s, a clarity cost)
         chars=[], dur=4.25,
         on=[("[ a CTRL keycap · Macrosoft's pen · Terb's extinguisher pin ]", 0.3, None),
             ('DO NOT REMOVE', 2.5, None)],
         sounds=[('synth:drawer_open', 0.0, -24), ('synth:drawer_shut', 3.75, -22)],
         caption='The drawer, opened to put the cover away: a CTRL keycap, the check\'s pen, Terb\'s pin, its tag up.',
         real='the pocketed props: sc 5\'s keycap (Act One), the MACROSOFT check\'s pen, Terb\'s extinguisher pin (Act Four)',
         cues=['the hold on DO NOT REMOVE is his look (read + 1 beat); his hand shuts the drawer at 3.75 s',
               'the bracketed line is a reel stand-in for the three drawn objects, not in-world text',
               'staging: the cover stays in his hand (it goes on the wall next), so the drawer shuts without it']),
    dict(id='32.07', set='darkroom', shot='wide', frame='WIDE · the back wall',
         chars=[C('mas', 0.46, 'stand'), C('orb', 0.58)], dur=4.25,
         on=[('CEO OF THE YEAR', 0.55, None), ('GUEST', 1.9, None)],
         sounds=[('key_tap_soft_03', 0.5, -24), ('key_tap_soft_05', 1.85, -26)],
         caption='The back wall: he pins the cover up. Beside it he hangs a small frame, and in it the GUEST lanyard.',
         cues=['the framed GUEST lanyard answers Act Four\'s "the badge was a joke." / "mostly."']),
    # ---- sc 33 · SAME — BUTTON
    dict(id='33.01', set='darkroom', shot='wide', frame='WIDE · the thud',
         chars=[C('mas', 0.34, 'sit'), C('orb', 0.44)], dur=2.25, fx=['shake'],
         seq={'sub': 'the button', 'place': "Mas's dark room", 'time': 'late December 2023'},
         on=[('UI: Look at glass of water', 0.5, None)],
         sounds=[('synth:thud', 0.5, -8)],
         caption='THUD. A newspaper drops flat onto the desk from above. The room shakes 2 px; the phone, keys and Orb hop.',
         cues=['music: the felt line STOPS on the thud; the rack and the fans hold',
               'style: the lit-UI band lights on the thud frame (the episode\'s 2nd and last); the band does not shake',
               'the cursor is already parked on the glass']),
    # r2: the UI prompt is left off this insert (the reel types an insert's items as one block of text, so in r1
    # "Look at glass of water" read as a line of newsprint above the masthead); the stamp's hold is 4.5 s (r1 4.25)
    # so the 68-character stamp is fully typed by 1.6 s and then holds about 2.9 s: it is the next fight, and the
    # newcomer needs to read all of it
    # r3: the v2 newcomer read couldn't tell who THE GREY LADY is or what the complaint is about ("the final hook
    # and I couldn't read it"). The stick stage draws this insert as a screen, so a bracketed stand-in says it is a
    # newspaper; the stamp gains the suit's subject, COPYRIGHT (the docket's nature of suit; script sc 33 carries
    # it). The 80-character stamp is typed by about 2.0 s and then holds 2.7 s. 4.5 -> 4.75 s (+0.25 s).
    # Paper settles under it (the flow audit's #39: the thud-to-"noted." stretch had room tone only)
    dict(id='33.02', set='darkroom', shot='insert', frame='HIGH · the front page',
         chars=[], dur=4.75,
         on=[('[ a newspaper, front page up ]', 0.1, None),
             ('THE GREY LADY', 0.45, None),
             ('COMPLAINT · THE GREY LADY v. MACROSOFT & NOPEAI · COPYRIGHT · FILED DEC 27, 2023', 0.7, None)],
         sounds=[('paper_curl', 0.3, -30), ('paper_curl', 2.9, -35)],
         caption='A plain serif masthead, never blackletter. The only text under it: a clerk\'s stamp, held to read.',
         real='DEC 27, 2023 · THE GREY LADY sues MACROSOFT and NopeAI (the caption\'s own order) for copyright '
              'infringement (the docket\'s nature of suit: copyright) [V]',
         cues=['no rail: the stamp is the record', 'the room tone holds; no music; the page settles twice (paper_curl)',
               'the bracketed line is a reel stand-in for the drawn newspaper, not in-world text',
               'the lit-UI band ("Look at glass of water") stays up over this insert in the picture; the reel leaves it '
               'off here so it does not read as newsprint']),
    # r2: a bracketed stand-in, since the stick stage draws an empty insert as a blank frame (r1)
    # r3: the prompt comes back on the glass, so "Look at glass of water" and the look are one gesture (r2 lit it
    # on the thud and then showed the front page for 4.5 s, and the v2 newcomer and insider reads both found the
    # glass a cipher); the stand-in says what the drawing shows, that the thud moved everything but the water.
    # 1.75 -> 2.75 s (+1.0 s, a clarity cost)
    dict(id='33.03', set='darkroom', shot='insert', frame='INSERT · the glass (after the shake)',
         chars=[], dur=2.75,
         on=[('UI: Look at glass of water', 0.0, None),
             ('[ the water line: flat. Not a ripple. ]', 0.4, None)],
         caption='The glass, composited after the shake. Everything on the desk hopped; the water line is flat.',
         cues=['the lit-UI band\'s prompt, taken: the cut to the glass is the "look" (in the reel it is typed as the '
               'insert\'s first line, since an insert draws its items as text)',
               'the bracketed line is a reel stand-in for the drawing, not in-world text',
               'the glass\'s plants: the cold open (the host\'s glass sloshes, his does not), the midpoint crack, the '
               'Act Four home shot (one flat row)']),
    dict(id='33.04', set='darkroom', shot='close', frame='SINGLE · profile: Mas, the button',
         chars=[C('mas', 0.42, 'sit', 'calm')], lines=[('e1-tg-33-01', 0.5)], tail=2.1,
         # r3: the hum under the chord is the vault's own loop (vault_hum_F, Act Four's S8.06 pedal), not the
         # dark-room drone: the script's hook is "the Q* vault's F hum from sc 31", heard, not seen
         sounds=[('synth:button_chord', 'END+0.3', -14), ('vault_hum_F', 'END+0.3', -31)],
         caption='Mas, in profile, unmoved: the cold open\'s word again. The chord with no third lands and holds on him.',
         cues=['music: the chord with no third on the downbeat (MM-12\'s button), held on his face',
               'the Q* vault\'s F hum carries in under it and becomes its root (heard, not seen)']),
    dict(id='33.05', set='void', shot='wide', frame='BLACK · on the hum',
         chars=[], dur=1.25,
         caption='CUT TO BLACK on the hum. The hook to Ep2 is a sound only.',
         cues=['the hum rings on under black, into the outro']),
    # ---- the OUTRO slot: a placeholder until a proposal is chosen
    dict(id='OUT.01', act='CREDITS', kind='card', set='void', shot='wide', frame='CARD · OUTRO PLACEHOLDER (pending)',
         chars=[], dur=12.0,     # r2: no moth figure (a card beat draws no figures; r1's moth never showed)
         seq={'id': 'OUTRO', 'place': 'outro slot (placeholder)', 'time': '12 s · pending a choice of five proposals'},
         on=[('OUTRO · PENDING', 0.0, None),
             ('MR. MAS · ep1.0_research_preview.md', 0.4, None),
             # r3: the disclosure rows as OUTRO-PROPOSALS §1.1 words them now (it was revised after r2)
             ('pixel art and original score, rendered in code · voices: synthetic, designed from text · none cloned · '
              'AI tools: used throughout, listed in the notice', 1.2, None),
             ('A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.', 2.4, None),
             ('Full notice and sources: in the description.', 3.4, None)],
         caption='OUTRO PLACEHOLDER, 12 s: five mock-ups (7.5-11.9 s) are being compared, none chosen. No moth drawn.',
         real='placeholder text from OUTRO-PROPOSALS.md §1.1 (credits line, disclosure, terms line, pointer); '
              'legal review of the one-line terms is pending; §8 leans E (File closed, 7.5 s) but nothing is decided',
         cues=['music: MM-15 THE KNEE reprise in Ep1\'s colour (temp pad; no render yet)',
               'stinger (<= 5 s, inside the credits): the moth flutters in, settles on the last line, folds its wings',
               'replace this chapter when the showrunner picks A-E (show/production/OUTRO-PROPOSALS.md)']),
]

CAST = {
    'mas': {'role': 'MAN AT THE DESK'},
    'orb': {'name': 'THE ORB', 'known': True},
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
            a_in, a_out = L['pace']['audible_in_s'], L['pace']['audible_out_s']
            onset = lead                                   # seconds from the beat's start to the first sound
            dur = a_out - a_in
            words = [[w['w'], round(max(0.0, w['t0'] - a_in), 3), round(max(0.0, w['t1'] - a_in), 3)] for w in L['words']]
            lines.append({'id': lid, 'who': SPEAKER[L['speaker']], 'text': L['text'], 't': round(onset, 3),
                          'dur': round(dur, 3), 'audio': L['file'], 'in': round(a_in, 3), 'words': words,
                          'tag': '', 'cut': False})
            placed[lid] = dict(beat=sp['id'], on=s0 + onset, end=s0 + onset + dur, words=len(L['text'].split()))
            last_end = onset + dur
        d = q(last_end + sp.get('tail', 0.6)) if last_end is not None else q(sp['dur'])
        onscreen = []
        for (text, at, until) in sp.get('on', []):
            onscreen.append({'text': text, 'at': round(at, 3), 'until': None if until is None or until >= d else round(until, 3)})
        sounds = []
        for (name, at, gdb) in sp.get('sounds', []):
            if isinstance(at, str) and at.startswith('END'):
                at = last_end + float(at[3:] or 0)
            sounds.append({'name': name, 'at': round(at, 3), 'gain': gdb})
        beat = {
            'id': sp['id'], 'act': sp.get('act', 'TAG'), 'kind': sp.get('kind', 'scene'), 'set': sp['set'],
            'style': 'BASE', 'shot': sp['shot'], 'frame': sp['frame'], 'side': '', 'room': 'darkroom',
            'chars': sp.get('chars', []), 'caption': sp['caption'], 'lines': lines, 'onscreen': onscreen,
            'reelDur': round(d, 6), 'fx': sp.get('fx', []),
            'realStart': round(TAG_START + s0, 3), 'realDur': round(d, 3),
        }
        for k in ('seq', 'real', 'cues'):
            if sp.get(k):
                beat[k] = sp[k]
        if sounds:
            beat['sounds'] = sounds
        out.append(beat)
        t = s0 + d
    return out, placed


def main():
    beats, placed = build()
    tag = [b for b in beats if b['act'] == 'TAG']
    tag_s = sum(b['reelDur'] for b in tag)
    outro_s = sum(b['reelDur'] for b in beats if b['act'] == 'CREDITS')
    words = [p['words'] for p in placed.values()]
    ons = sorted(placed.values(), key=lambda p: p['on'])
    measure = {
        'tag_seconds': round(tag_s, 3), 'outro_seconds': round(outro_s, 3), 'total_seconds': round(tag_s + outro_s, 3),
        'beats_tag': len(tag), 'lines': len(placed), 'words': sum(words),
        'median_words_per_line': statistics.median(words) if words else 0,
        'talk_seconds': round(sum(p['end'] - p['on'] for p in placed.values()), 3),
        'gap_between_lines_s': round(ons[1]['on'] - ons[0]['end'], 3) if len(ons) > 1 else None,
        'longest_conversation_s': 0.0,
        'longest_conversation_note': 'none: Mas alone with a witness that never speaks; two one-word lines, each a button',
        'printed_clock': 'tag 22:07-22:52 (45 s); credits 22:52-23:35 (43 s) in the script',
    }
    doc = {
        'episode': 1,
        'title': 'ep1.0_research_preview.md',
        'part': 'TAG · "december" · sc 32-33 · + OUTRO placeholder',
        'variant': 'stick-figure dialogue reel v2 · the recorded takes over a temp bed',
        'logline': 'The tag for flow: what the year leaves on his desk, then the thud. Stick figures and text cards '
                   'stand in for the picture; the outro is a labelled placeholder.',
        'dateSpan': 'Dec 2023',
        'runtimeMin': 22,
        'dialogueReel': True,
        'cast': CAST,
        '_source': {'script': 'show/episodes/ep01/script.md ## TAG (sc 32-33) + ### END CREDITS (with the tag-fix '
                              'pass edits, 2026-09-27)',
                    'revision': 'r3 (tag-fix pass, 2026-09-27): clarity fixes from the v2 newcomer, insider and flow '
                                'reads; see tag-notes.md §3a',
                    'takes': 'audio/ep01/tag/dialogue/lines-fast-v1.json',
                    'builder': 'audio/reel/ep01-tag-v2/build_timeline.py',
                    'bed': 'audio/reel/ep01-tag-v2/tag_bed.py -> audio/reel/ep01-tag-v2/tag-bed.wav',
                    'notes': 'show/episodes/ep01/production/stick/tag-notes.md'},
        '_measure': measure,
        'beats': beats,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(beats)} beats, {len(placed)} lines; '
          f'tag {tag_s:.2f} s + outro {outro_s:.2f} s = {tag_s + outro_s:.2f} s')
    t = 0.0
    for b in beats:
        ln = ' · '.join(f"{l['who']}: {l['text']} @{l['t']:.2f}+{l['dur']:.2f}" for l in b['lines'])
        print(f"  {b['id']:7s} {t:6.2f} +{b['reelDur']:5.2f}  {b['frame'][:52]:52s} {ln}")
        t += b['reelDur']
    print('  measure:', json.dumps(measure))


if __name__ == '__main__':
    main()
