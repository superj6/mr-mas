#!/usr/bin/env python
"""Ep1 Act Two (sc 13-17, "the regulate-me tour") STICK-FIGURE DIALOGUE REEL v2: the timeline builder.

  python3 audio/reel/ep01-act2-v2/build_timeline.py      -> show/reel/ep01-full/ep01-act2-v2.json

Written by the ep1s-act2 pass (2026-09-26) on the model of audio/reel/ep01-act4-v5/build_timeline.py. The picture is
cut to the takes. Each shot of the script's Act Two (show/episodes/ep01/script.md, "## ACT TWO", as saved 22:48) is one
beat; a shot whose staging changes inside it (a 2-TONE freeze card, a flash-print) is split into beats marked "cont".
Every line is laid from its real fastrec take (audio/ep01/act2/dialogue/lines-fast-v2.json):

  * a line's speech onset = the previous line's speech end + its planned gap (lines-plan-v2 gap_before_s: quick
    replies 0.3-0.5 s, loaded ones 0.6-0.9 s), or the shot's lead-in when the line follows picture;
  * lx = per-line overrides in the shot plan: lead / min_lead (a shot's first line), gap (a later line: the
    picture's business sets it, e.g. the clone's card snatch), tag;
  * no overlaps (the script writes none in Act Two); the clone's quote pre-laps over black into sc 15 (written);
  * shots end on a tail after the last word (0.35-0.6 s; longer where a picture beat plays, e.g. the scroll, the
    photo), or at a word, where a line crosses a cut;
  * cards, plates, rails and posts are timed for read (about 0.25 s + 0.05 s a character).

The JSON is the "dialogueReel" format of studio/src/reel/schema.ts (DIALOGUE REELS). The episode mixer
(studio/src/reel/tools/mixer.mjs) lays the takes itself. It lays no per-beat SFX, so each beat's `sounds` and `room`
are rendered into the chapter's temp sound stem by audio/reel/ep01-act2-v2/act2_bed.py (run it after this file).
Nothing here is heard or watched.

Fixer pass (ep1s-act2fix, 2026-09-27), from the cold newcomer, insider and audit reads of ep01-full-v2 (act2-notes.md
section 10 has the list and the reasons):
  * sc 14: the phone clip carries the app's own tag, "NEWS CLIP · ⚠ ALTERED AUDIO", on Mas's phone, on the lit
    window's screen and on the repost insert, which now ends on "✓ REPOSTED" (14.04 1.25 -> 1.5 s);
  * sc 15: the chairman's new line (15-09, "Speaking for myself, a little.") on the dais two-shot, the clone still
    holding his card; the clone's takes re-read 2 st higher (cast.json pitch_add);
  * sc 16: ITEMS 1-4 are ONE held beat (16.01, 17.5 s) whose texts arrive at the stamps' times, so the stamps pile up
    instead of the poster re-typing on every item (audit-v2 #30). 16.02-16.04 are folded into it; the cut-in on his
    photo keeps its id, 16.05. The strip carries its credit line (where and why);
  * sc 17: Mas's hand is out for the pen (the point pose) in 17.02 and 17.05; the purchase order says what's bought
    (17.10 2.0 -> 2.5 s so its second line reads);
  * sounds: every beat's SFX for the stem (the plink, the gasp, the moth, the stamps' knee stabs, the register's
    roll, KA-CHING and the bell's long decay, the pens).
"""
from __future__ import annotations

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
LINES_JSON = os.path.join(ROOT, 'audio/ep01/act2/dialogue/lines-fast-v2.json')
OUT = os.path.join(ROOT, 'show/reel/ep01-full/ep01-act2-v2.json')
FPS = 24
ACT_START = 5 * 60 + 54            # the act's printed start in the episode (5:54); the played start moves with Act One

LINES = {l['id']: l for l in json.load(open(LINES_JSON))}
SPEAKER = {'SIRRAH': 'sirrah', 'MARIO': 'mario', 'PHOTOGRAPHER': 'photographer', 'TASYA': 'tasya', 'RADNUS': 'radnus',
           'MAS': 'mas', 'NEDIB': 'nedib', 'LAHTNEMULB (THE CLONE)': 'clone', 'LAHTNEMULB': 'lahtnemulb',
           'SUCRAM': 'sucram', 'A SENATOR': 'senator', 'A SENATOR (O.S.)': 'senator', 'NESNEJ': 'nesnej',
           'MAS MANALT': 'mas'}  # fastrec writes the cast registry's display name for MAS
WARN: list[str] = []


# ------------------------------------------------------------------ time expressions (resolved after lines are laid)
class T:
    def __init__(self, kind, line=None, k=None, off=0.0):
        self.kind, self.line, self.k, self.off = kind, line, k, off


def ON(l, off=0.0):
    return T('on', l, None, off)


def END(l, off=0.0):
    return T('end', l, None, off)


def W(l, k, off=0.0):
    """start of word k of line l (k: an index, or the word; 'word#2' = its second occurrence)"""
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


# ------------------------------------------------------------------ margin notes: temp music and style moments
MU = {
    'wh': 'music: MM-19 (THE PODIUM palette), light chamber pomp from the first frame · thins under the lines '
          '(temp: a B-flat chamber pad; the render has only the Fountain Pen)',
    'door': "music: NEDIB's Fountain Pen motif (muted trumpet) takes MM-19 over on the door",
    'photo': 'music: MM-19 rings out on the photo',
    'bridge': "sound: NO SCORE · the bullpen through glass, the phone's small speaker (the anchor's too-smooth murmur, "
              "no words: a made formant voice in the Act Two stem), then water on pilings",
    'senate': 'music: MM-20 Under Oath (PROCEDURE) from the first frame · thins to a pedal, ducks under every real line',
    'stop': "music: MM-20 STOPS on the wallet (the act's deliberate stop) · the room's air only",
    'back': 'music: MM-20 back on a new phrase',
    'tour': "music: MM-03 The Regulate-Me Tour (THE RUN), in on the first stamp's thunk · knee stab on every stamp",
    'roof': 'music: MM-03 rings out into a held pad under the statement (no comic scoring on the record) · holds under the talk',
    'mm05': 'music: MM-05 The More You Buy (THE JOB) in with the register · through phrase 3',
    'out': "music: score drops out · the register's bell (rung by KA-CHING) decays over rooftop wind · no sting "
           "(the act's out)",
}
STYLE = {
    'card': 'style: 2-TONE freeze, 1 beat · then the card rides the live room for the rest of its bar',
    'clone': 'style (proposed, style-range pass): THE CLONE alone through a too-clean upscale filter (AA edges, soft '
             'sheen); the chairman stays BASE; never toward photoreal · default: a 1-px highlight',
    'ledger': 'style: [LEDGER] flash-print, 6 frames · then the figure holds in the register window (BASE)',
    'lens': "style: the episode's one lens look (pupils centred, 1 beat); everywhere else his pupils sit 1 px toward the speaker",
    'glass': "style: in the water the reflected crack runs on after the sky's has stopped (whole-pixel steps) until it "
             "crosses his small reflection · fallback if the room reads it as a UI wink (L8): the plain insert",
    'flash': 'style: the flash is a white step (<= 80 %), and its freeze is the card\'s',
}

SEQ13 = dict(id='13', side='', place='The White House: a meeting room', time='Thu May 4, 2023 · day')
SEQ14 = dict(id='14', side='', place='NopeAI bullpen, the window → the bay', time='Fri May 12, 2023 · night')
SEQ15 = dict(id='15', side='', place='Senate Judiciary: the hearing room', time='Tue May 16, 2023 · day')
SEQ16 = dict(id='16', side='', place='The regulate-me tour: one poster', time='May 24 - 26, 2023')
SEQ17 = dict(id='17', side='', place='A rooftop signing table', time='Tue May 30, 2023 · day')

ROW = [C('mas', 0.2, 'sit'), C('radnus', 0.37, 'sit'), C('mario', 0.54, 'sit'), C('tasya', 0.71, 'sit')]
DAIS = [C('lahtnemulb', 0.66, 'sit'), C('clone', 0.79, 'sit')]
TABLE = [C('mas', 0.14, 'sit'), C('sucram', 0.27, 'sit')]
POSTER = 'MAS MANALT: THE REGULATE-ME TOUR'
NEDIB_CARD = [('EOJ NEDIB / THE PRESIDENT', 0.0, None), ('DEEPFAKES OF ME: SEEN 0', 0.0, None)]
SUCRAM_CARD = [('SUCRAM / CALLED IT. (BEFORE LAUNCH.)', 0.0, None), ('STAMPS: ALL · PARTIALLY: SOME', 0.0, None)]
NESNEJ_CARD = [('NESNEJ / SELLS SHOVELS. FUNDS DIGGERS.', 0.0, None), ('POCKETS: 1', 0.0, None)]
QUOTE = '"Mitigating the risk of extinction from AI should be a global priority…"'
CLIP = 'NEWS CLIP · ⚠ ALTERED AUDIO'        # the app's own tag under the anchor clip (sc 14, fixer pass)
STRIP = '"…cease operating…" — MAS MANALT, ON THE EU\'S DRAFT AI RULES'   # the review quote and its credit line
LEDGER = 'INVIDIA · $1,000,000,000,000 (INTRADAY)'


def until(items, u):
    return [(t, a, u) for (t, a, _) in items]


# ------------------------------------------------------------------ THE SHOT PLAN (script.md ## ACT TWO, as saved 22:48)
# keys: id, seq, kind, set, style, shot, frame, room, chars, fg, lines, lead, tail, min, end, on ((text, at, until)),
# names ((ids, at)), sounds ((name, at, gain_db)), lx (per line: lead, min_lead, tag), caption, cues, cont, shotId, fx
SPEC = [
    # ================================================================ sc 13 · THE WHITE HOUSE (anchor 2)
    dict(id='13.01', seq=SEQ13, set='whitehouse', shot='wide', frame='WIDE · the meeting room', room='whitehouse',
         min=3.25, chars=[C('sirrah', 0.07, 'point')] + ROW,
         on=[('RAIL: MAY 4, 2023 · THE WHITE HOUSE', 0.25, None), ('[A] [I]', 0.25, None)],
         cues=[MU['wh']],
         caption='Portraits, a long table. Blocks A and I at the head; a teacher with a pointer and a CZAR? lanyard. '
                 'The row faces her like a class.'),
    dict(id='13.02', set='whitehouse', shot='close', frame='MCU · SIRRAH at the blocks', room='whitehouse',
         chars=[C('sirrah', 0.5, 'point')], lines=['e1-a2-13-01'], lead=0.45, end=END('e1-a2-13-01', 0.2),
         caption='The pointer lands on each block in turn.'),
    dict(id='13.03', cont=True, shotId='13.02', set='whitehouse', shot='close', frame='MCU · 2-TONE freeze + card',
         room='whitehouse', fx=['freeze'], min=0.625, chars=[C('sirrah', 0.5, 'point')],
         on=[('SIRRAH / THE EXPLAINER', 0.0, None), ('DAY JOB: VICE PRESIDENT', 0.0, None)], names=[('sirrah', 0.0)],
         sounds=[('freeze_hit_F', 0.0, -20)], cues=[STYLE['card']],
         caption='The pointer lands on I: the world freezes for 1 beat under her card.'),
    dict(id='13.04', cont=True, shotId='13.02', set='whitehouse', shot='close', frame='MCU · the card rides',
         room='whitehouse', min=1.9, chars=[C('sirrah', 0.5, 'point')],
         on=[('SIRRAH / THE EXPLAINER', 0.0, None), ('DAY JOB: VICE PRESIDENT', 0.0, None)],
         caption='The room moves again; the card rides to the end of its bar.'),
    dict(id='13.05', set='whitehouse', shot='medium', frame='TWO-SHOT · RADNUS + MARIO (held; SIRRAH O.S.)',
         room='whitehouse', chars=[C('radnus', 0.36, 'sit'), C('mario', 0.64, 'point')],
         lines=['e1-a2-13-02', 'e1-a2-13-03', 'e1-a2-13-04', 'e1-a2-13-05'], lead=0.35, tail=1.35,
         sounds=[('paper_flutter', END('e1-a2-13-05', 0.25), -26)],
         caption="Radnus writes it down. Mario's finger goes fully up. On his last word the scroll in his pocket "
                 "unrolls a foot onto the floor, on its own."),
    dict(id='13.06', set='whitehouse', shot='wide', frame='WIDE · the photographer and three tripods', room='whitehouse',
         chars=[C('photographer', 0.5)] + [C('mas', 0.14, 'sit'), C('radnus', 0.3, 'sit'), C('mario', 0.7, 'sit'),
                                           C('tasya', 0.86, 'sit')],
         on=[('1', 0.2, None), ('2', 0.75, None), ('3', 1.3, None)], lines=['e1-a2-13-06'], lead=1.75, tail=0.45,
         sounds=[('landing_thunk', 0.2, -30), ('landing_thunk', 0.75, -30), ('landing_thunk', 1.3, -30)],
         caption='A White House photographer (back to us) sets a camera on a tripod. Then a second. Then a third, '
                 'taped 1, 2, 3.'),
    dict(id='13.07', set='whitehouse', shot='close', frame='MCU · a pan along the row, R→L (no cut, no zoom)',
         room='whitehouse', min=3.75,
         chars=[C('mas', 0.14, 'sit'), C('radnus', 0.38, 'sit'), C('mario', 0.62, 'sit'), C('tasya', 0.86, 'sit')],
         cues=[STYLE['lens']],
         caption='Tasya looks at camera 3; Mario at 2; Radnus at the ceiling\'s security camera. It settles on Mas: '
                 'he looks straight at us, 1 beat.'),
    dict(id='13.08', set='whitehouse', shot='wide', frame="WIDE · the photographer's wide", room='whitehouse',
         chars=[C('photographer', 0.5)] + [C('mas', 0.14, 'sit'), C('radnus', 0.3, 'sit'), C('mario', 0.7, 'sit'),
                                           C('tasya', 0.86, 'sit')],
         lines=['e1-a2-13-07', 'e1-a2-13-08'], lead=0.8, tail=0.6,
         caption='Three tripods, four people, four wrong eyelines.'),
    dict(id='13.09', set='whitehouse', shot='medium', frame='TWO-SHOT · MAS + RADNUS (held)', room='whitehouse',
         chars=[C('mas', 0.34, 'sit'), C('radnus', 0.62, 'lean')],
         lines=['e1-a2-13-09', 'e1-a2-13-10', 'e1-a2-13-11', 'e1-a2-13-12'], lead=0.6, tail=0.45,
         caption='Radnus leans across to him, a small flame on his collar he hasn\'t noticed.'),
    dict(id='13.10', set='whitehouse', shot='insert', frame="INSERT · the flame on Radnus's collar", room='whitehouse',
         chars=[C('radnus', 0.5)], lines=['e1-a2-13-13'], lx={'e1-a2-13-13': {'min_lead': 0.55, 'tag': 'O.S.'}},
         tail=0.45, sounds=[('flame_whoomph', 0.2, -26)],
         caption='The flame grows one size. His hand pats at it.'),
    dict(id='13.11', set='whitehouse', shot='wide', frame='WIDE · the door behind the row', room='whitehouse',
         chars=ROW + [C('nedib', 0.9, 'walk')], lines=['e1-a2-13-14'], lead=0.55, end=END('e1-a2-13-14', 0.2),
         cues=[MU['door']],
         caption="The door opens. A man strides in mid-sentence, aviators up, a fountain pen like a baton. Three heads "
                 "turn to him, each at its own speed. Mas's doesn't."),
    dict(id='13.12', cont=True, shotId='13.11', set='whitehouse', shot='wide', frame='WIDE · FLASH: all three cameras fire',
         room='whitehouse', fx=['flash', 'freeze'], min=0.625, chars=ROW + [C('nedib', 0.9, 'walk')], on=NEDIB_CARD,
         names=[('nedib', 0.0)], sounds=[('camera_shutter', 0.0, -14), ('freeze_hit_F', 0.02, -22)],
         cues=[STYLE['flash'], STYLE['card']],
         caption="All three cameras fire on the turned heads; the flash's freeze is the card's (1 beat)."),
    dict(id='13.13', set='whitehouse', shot='medium', frame="OTS · from behind Mario's raised finger onto NEDIB (held)",
         room='whitehouse', fg={'id': 'mario', 'side': 'left'}, chars=[C('nedib', 0.66, 'point')],
         lines=['e1-a2-13-15', 'e1-a2-13-16', 'e1-a2-13-17'], lead=0.5, tail=0.6, on=until(NEDIB_CARD, 1.9),
         caption="The card rides off. In the foreground Mario's finger goes all the way up; his other hand pulls the "
                 "scroll out of his pocket."),
    dict(id='13.14', set='whitehouse', shot='insert', frame='INSERT · the print (meter G13)', room='whitehouse',
         on=[('CLASS PHOTO #1', 0.3, None)], lines=['e1-a2-13-18'], lead=1.7, tail=1.9,
         lx={'e1-a2-13-18': {'tag': 'O.S.'}}, cues=[MU['photo']], sounds=[('camera_shutter', 0.0, -30)],
         caption='Three CEOs twisted toward a door; a president half in frame; the blocks restacked I A; and Mas, '
                 'the only one looking at the lens. A yearbook.'),

    # ================================================================ sc 14 · THE BRIDGE (4 bars; no score)
    dict(id='14.01', seq=SEQ14, set='skyline', shot='medium', frame="OTS · over Mas's shoulder at the dark window",
         room='bullpen-night', fg={'id': 'mas', 'side': 'left'}, min=2.6,
         on=[('RAIL: MAY 12, 2023', 0.25, None), (CLIP, 0.6, None)], cues=[MU['bridge']],
         caption="A clip on the phone in his hand: an invented anchor whose mouth lands a beat after a too-smooth voice; "
                 "under it the app's grey tag, ALTERED AUDIO. Beyond the glass: the skyline, one lit window."),
    dict(id='14.02', set='skyline', shot='wide', frame='WIDE · the bay (push 1 of 3)', room='bay', min=1.25,
         caption='The water, the dark skyline, the one lit window small in the middle.'),
    dict(id='14.03', set='skyline', shot='medium', frame='WIDE · the building, its lit window (push 2 of 3)', room='bay',
         min=1.9, chars=[C('silhouette', 0.5, 'phone')], on=[(CLIP, 0.3, None)],
         caption='A silhouette with a phone (flash 7\'s shape). The same clip, and its tag, on its screen; it nods on '
                 'the audio\'s beat, not the mouth\'s.'),
    dict(id='14.04', set='screen', shot='insert', frame='INSERT · a thumb on a repost arrow (push 3 of 3)', room='bay',
         min=1.5, on=[(CLIP, 0.0, None), ('UI: ↻ REPOST', 0.2, 0.7), ('✓ REPOSTED', 0.7, None)],
         sounds=[('post_click', 0.7, -18)],
         caption='A thumb presses repost, just under the ALTERED AUDIO tag. Click.'),
    dict(id='14.05', set='skyline', shot='wide', frame='WIDE · the lit window, the bay', room='bay', min=2.4,
         chars=[C('silhouette', 0.5, 'phone')], sounds=[('synth:plink', 1.0, -14), ('key_tap_soft_01', 1.9, -34)],
         caption="A single hailstone drops from the lit window into the bay. Plink (the cold open's). The phone's glow "
                 "clicks off. The silhouette doesn't move."),
    dict(id='14.06', set='void', shot='wide', frame='BLACK · the match cut on the voice', room='black',
         lines=['e1-a2-15-01'], lx={'e1-a2-15-01': {'lead': 0.35, 'tag': 'O.S.'}}, end=W('e1-a2-15-01', 'seen'),
         caption='The too-smooth voice runs on over black and becomes the hearing\'s first words.'),

    # ================================================================ sc 15 · THE SENATE (anchor 3)
    dict(id='15.01', seq=SEQ15, set='senate', shot='close', frame='MCU · the voice finds a mouth', room='senate',
         chars=[C('clone', 0.5)], on=[('RAIL: MAY 16, 2023 · SENATE JUDICIARY', 0.3, None)],
         end=END('e1-a2-15-01', 0.45), cues=[MU['senate'], STYLE['clone']],
         caption='A man at the microphone, glossy, a 1-px highlight on his hair, reading with perfect cadence.'),
    dict(id='15.02', set='senate', shot='wide', frame='WIDE · the hearing room', room='senate',
         chars=[C('gallery', 0.04)] + TABLE + [C('lahtnemulb', 0.66, 'sit'), C('clone', 0.79), C('senator', 0.93, 'sit')],
         on=[('LAHTNEMULB · OPENED WITH A CLONE', 0.3, None)], names=[(('lahtnemulb', 'clone'), 0.3)],
         lines=['e1-a2-15-02'], lx={'e1-a2-15-02': {'min_lead': 1.5}}, tail=0.5,
         caption='The dais, a gallery of identical spectators, the witness table. The matte chairman, identical to '
                 'the clone, nods along, moved.'),
    dict(id='15.03', set='senate', shot='medium', frame='TWO-SHOT · the chairman + THE CLONE', room='senate', min=3.0,
         chars=[C('lahtnemulb', 0.38), C('clone', 0.62)],
         caption='The clone gives him a look. He didn\'t. He takes the microphone back; they sit, the clone at his '
                 'left hand. The clone keeps the better chair.'),
    dict(id='15.04', set='senate', shot='medium', frame='TWO-SHOT · MAS + SUCRAM · 2-TONE freeze + card', room='senate',
         fx=['freeze'], min=0.625, chars=[C('mas', 0.36, 'sit'), C('sucram', 0.64, 'phone')], on=SUCRAM_CARD,
         names=[('sucram', 0.0)], sounds=[('freeze_hit_C', 0.0, -22)], cues=[STYLE['card']],
         caption='The witness table: Mas, and beside him a man with a binder, a stamp and a pad, already typing.'),
    dict(id='15.05', cont=True, shotId='15.04', set='senate', shot='medium', frame='TWO-SHOT · MAS + SUCRAM (held)',
         room='senate', chars=[C('mas', 0.36, 'sit'), C('sucram', 0.64, 'phone')], on=until(SUCRAM_CARD, 2.9),
         lines=['e1-a2-15-03', 'e1-a2-15-04', 'e1-a2-15-05'], lead=0.45, tail=0.5,
         sounds=[('typing_soft', 0.2, -30)], caption='Sucram types, low, to Mas, not looking up.'),
    dict(id='15.06', set='senate', shot='close', frame='MCU · the chairman, reading from a card', room='senate',
         chars=[C('lahtnemulb', 0.5, 'sit')], lines=['e1-a2-15-06'], lead=0.4, tail=0.3,
         caption='He reads it from a card.'),
    dict(id='15.07', set='senate', shot='medium', frame='OTS · from behind Mas onto the dais (held)', room='senate',
         fg={'id': 'mas', 'side': 'left'}, chars=[C('lahtnemulb', 0.6, 'sit'), C('clone', 0.76, 'sit')],
         lines=['e1-a2-15-07', 'e1-a2-15-08'], lx={'e1-a2-15-08': {'gap': 1.2}}, tail=0.45,
         caption="On Mas's last word the chairman reaches for his next card; the clone takes it out of his hand and "
                 "reads it for him. Nobody remarks on it."),
    dict(id='15.08', set='senate', shot='medium', frame='TWO-SHOT · MAS + SUCRAM · HOLD 1 BEAT', room='senate', min=1.5,
         chars=[C('mas', 0.36, 'sit'), C('sucram', 0.64, 'phone')],
         caption='Mas sips his water. The dais waits (1 beat).'),
    dict(id='15.09', set='senate', shot='medium', frame='TWO-SHOT · the dais: chairman + clone', room='senate',
         chars=[C('lahtnemulb', 0.4, 'sit', face='worried'), C('clone', 0.6, 'sit')], lines=['e1-a2-15-09'],
         lead=0.4, tail=0.45,
         caption="The chairman's eyes are on his card, in the clone's hand. The clone turns its head to him a beat "
                 "late as he answers."),
    dict(id='15.10', set='senate', shot='wide', frame='WIDE · the dais leans in; a red light', room='senate',
         chars=TABLE + DAIS, lines=['e1-a2-15-10'], lead=0.75, tail=0.4,
         caption="One microphone's red light comes on; Mas's eyeline goes to it. A senator speaks from behind it."),
    dict(id='15.11', set='senate', shot='medium', frame='TWO-SHOT · MAS + SUCRAM (held through the next question)',
         room='senate', chars=[C('mas', 0.36, 'sit'), C('sucram', 0.64, 'phone')],
         lines=['e1-a2-15-11', 'e1-a2-15-12'], tail=0.35, sounds=[('typing_soft', END('e1-a2-15-11', 0.1), -26)],
         caption='Beside him, Sucram types faster. On "money", Mas\'s hand goes to his pocket.'),
    dict(id='15.12', set='senate', shot='insert', frame='INSERT · the wallet', room='senate', min=3.0,
         on=[('HEALTH INSURANCE', 0.45, None)], cues=[MU['stop']],
         sounds=[('cloth_rustle', 0.05, -30), ('synth:moth', 1.1, -30)],
         caption='He opens his wallet: one card. A tiny moth flies out in three drawings and lands on Sucram\'s stamp pad.'),
    dict(id='15.13', set='senate', shot='wide', frame='WIDE · the wallet held up to the dais', room='senate',
         chars=[C('gallery', 0.04), C('mas', 0.14, 'point'), C('sucram', 0.27, 'sit')] + DAIS,
         on=[('RAIL: TESTIFIES HE HAS NO EQUITY', 0.5, None)], lines=['e1-a2-15-13'],
         sounds=[('synth:gasp', 0.45, -17)],
         lx={'e1-a2-15-13': {'lead': 1.7}}, tail=0.6,
         caption='Mas holds the open wallet up to the dais and says nothing. The gallery gasps: one held drawing. '
                 'The clone leans to its mic.'),
    dict(id='15.14', set='senate', shot='medium', frame='TWO-SHOT · MAS + SUCRAM', room='senate',
         chars=[C('mas', 0.36, 'sit'), C('sucram', 0.64, 'point')], lines=['e1-a2-15-14', 'e1-a2-15-15'], lead=0.45,
         lx={'e1-a2-15-15': {'gap': 0.9}},
         tail=0.35, cues=[MU['back']],
         sounds=[('rubber_stamp_C', 0.1, -20), ('rubber_stamp_C', 0.45, -20), ('rubber_stamp_C', 0.8, -20)],
         caption='Sucram stamps furiously, the moth dodging. A red light comes on at another microphone, frame right.'),
    dict(id='15.15', set='senate', shot='insert', frame='HIGH · the witness table from above', room='senate', min=3.3,
         on=[('PLEASE REGULATE ME', 0.25, None), ('CALLED IT. (BEFORE LAUNCH.)', 1.7, None)],
         sounds=[('folder_slide', 0.35, -28), ('rubber_stamp_C', 1.7, -16)],
         caption='Mas slides one signed sheet toward the dais. Sucram stamps it mid-slide. It leaves frame right.'),
    dict(id='15.16', set='senate', shot='wide', frame='WIDE · the dais (a match on action)', room='senate', min=2.8,
         chars=[C('lahtnemulb', 0.4, 'lean'), C('clone', 0.55, 'arms-up'), C('senator', 0.72, 'lean')],
         sounds=[('paper_curl', 1.0, -30)],
         caption='The sheet arrives from frame left into the clone\'s hand. The senators lean in, delighted, turn it '
                 'over to sign it, and hold its back up.'),
    dict(id='15.17', set='senate', shot='insert', frame='INSERT · the back of the sheet', room='senate', min=1.9,
         on=[('CALLED IT. (BEFORE SUCRAM.)', 0.2, None)], caption='Already stamped, in the same red.'),
    dict(id='15.18', set='senate', shot='close', frame='MCU · SUCRAM stares', room='senate', min=1.25,
         chars=[C('sucram', 0.5, face='shocked')], caption='He stares at it. CUT on the stare.'),

    # ================================================================ sc 16 · THE POSTER RUN (8 bars; not voiced)
    # ITEMS 1-4 are one held beat: the texts arrive at the stamps' times and stay, so the stamps pile up (the script's
    # "the camera holds; the stamps come to it"). The fixer pass folded the old 16.01-16.04 into it (audit-v2 #30:
    # every new beat re-typed the whole poster). Item times: 1 at 0.0, 2 at 5.0, 3 at 10.0, 4 at 15.0 (2 bars each).
    dict(id='16.01', seq=SEQ16, kind='montage', set='street', shot='insert',
         frame='GFX · the tour poster (held: ITEMS 1-4, the stamps pile up)', room='none', min=17.5,
         # the rails leave before the stack reaches the frame's lower left, where a rail is drawn (the first test render
         # had MAY 24 over the NOTERB plate and MAY 26 over ADDED DUE TO POPULAR DEMAND)
         on=[(POSTER, 0.0, None), ('RAIL: MAY 24, 2023 · LONDON', 0.5, 5.0), (STRIP, 1.4, None),
             ('EU: CANCELLED', 3.0, None),
             ('"blackmail"', 5.4, None), ('NOTERB · ENFORCES THE RULEBOOK.', 6.3, 10.0),
             ('RAIL: MAY 26, 2023', 10.2, 12.9), ('@masa · "…no plans to leave"', 10.6, 15.0), ('UN-CANCELLED', 12.9, None),
             ('ADDED DUE TO POPULAR DEMAND', 15.35, None)],
         names=[('noterb', 6.3)],
         sounds=[('rubber_stamp_C', 0.0, -18), ('synth:stab', 0.0, -20), ('paper_whip', 1.4, -22),
                 ('rubber_stamp_C', 3.0, -18), ('synth:stab', 3.0, -20),
                 ('rubber_stamp_C', 5.4, -16), ('synth:stab', 5.4, -19),
                 ('post_click', 10.6, -18), ('rubber_stamp_C', 12.9, -18), ('synth:stab', 12.9, -20),
                 ('rubber_stamp_C', 15.35, -16), ('synth:stab', 15.35, -19)],
         cues=[MU['tour']],
         caption='One concert-style poster, cities in a column, his face smiling 1 px. ITEM 1: a newsprint strip slaps on '
                 '(printed, never voiced), EU gets a red stamp. ITEM 2: a hand in a silver cuff stamps "blackmail". '
                 'ITEM 3: his post pops up; UN-CANCELLED lands over the first stamp. ITEM 4: the last date slot stamps '
                 'itself.'),
    dict(id='16.05', kind='montage', set='street', shot='close', frame="GFX·detail · the poster's photo", room='none',
         min=2.5, chars=[C('mas', 0.5, face='smile')],
         caption='Cut in on the poster\'s photo of him: the one-pixel smile, held to the bar\'s end. No blink, no line.'),

    # ================================================================ sc 17 · THE ROOFTOP SIGNING (midpoint act-out)
    dict(id='17.01', seq=SEQ17, set='skyline', shot='wide', frame='WIDE · the table under the sky (phrase 1)',
         room='rooftop', min=10.0,
         chars=[C('simed', 0.5, 'stand', frm=2.6, until=4.4), C('notnih', 0.5, 'stand', frm=4.4, until=6.9),
                C('mas', 0.42, 'stand', frm=6.9), C('mario', 0.6, 'stand', frm=8.1)],
         sounds=[('pen_scribble_short', 3.0, -30), ('pen_scribble_short', 4.9, -30), ('pen_run', 7.2, -30),
                 ('pen_scribble_short', 8.5, -30), ('pen_tick_1', 9.4, -32)],
         on=[('RAIL: MAY 30, 2023', 0.25, 3.0), (QUOTE, 0.5, None), ('NOTNIH · WORRIES FULL-TIME.', 4.5, 6.9)],
         names=[('notnih', 4.5)], cues=[MU['roof']],
         caption='One sheet on a long table; the statement types across the top. Signers in swaps: one moves a chess '
                 'piece no one can see; one in Godfather light; Mas in one stroke; Mario, who keeps the pen.'),
    dict(id='17.02', set='skyline', shot='medium', frame='TWO-SHOT · MAS + MARIO at the sheet (held)', room='rooftop',
         chars=[C('mas', 0.38, 'point'), C('mario', 0.62, 'point')],
         lines=['e1-a2-17-01', 'e1-a2-17-02', 'e1-a2-17-03', 'e1-a2-17-04'], lead=0.5, tail=0.7,
         sounds=[('pen_scribble_short', 0.2, -34), ('pen_scribble_short', 4.6, -34), ('pen_scribble_short', 8.9, -34)],
         caption='Mario writes under his name, the pen tight. Mas holds out his hand for it. Mario keeps writing.'),
    dict(id='17.03', set='skyline', shot='wide', frame='WIDE · a cash register rolls in (phrase 2)', room='rooftop',
         min=1.4, chars=[C('mas', 0.22), C('mario', 0.38, 'point'), C('nesnej', 0.8, 'arms-up')], cues=[MU['mm05']],
         sounds=[('synth:roll', 0.0, -24)],
         caption='A brass register rolls in on its own. Behind it, arms spread, a man in a leather jacket.'),
    dict(id='17.04', cont=True, shotId='17.03', set='skyline', shot='wide', frame='WIDE · 2-TONE freeze + card',
         room='rooftop', fx=['freeze'], min=0.625, chars=[C('mas', 0.22), C('mario', 0.38, 'point'),
                                                         C('nesnej', 0.8, 'arms-up')],
         on=NESNEJ_CARD, names=[('nesnej', 0.0)], sounds=[('freeze_hit_F', 0.0, -22)], cues=[STYLE['card']],
         caption='The register stops; the world freezes under his card for 1 beat.'),
    dict(id='17.05', set='skyline', shot='medium', frame='TWO-SHOT · MAS + MARIO turn to him', room='rooftop',
         chars=[C('mas', 0.38, 'point'), C('mario', 0.62, 'point')], on=until(NESNEJ_CARD, 2.3), lines=['e1-a2-17-05'],
         lead=0.75, end=END('e1-a2-17-05', 0.3),
         caption="The pen still in Mario's hand, Mas's hand still half out for it; they turn to him."),
    dict(id='17.06', set='skyline', shot='medium', frame='OTS · from behind Mario onto NESNEJ at the register',
         room='rooftop', fg={'id': 'mario', 'side': 'left'}, chars=[C('nesnej', 0.7, 'arms-up')],
         lines=['e1-a2-17-06'], tail=0.6, on=[('— COMPUTEX, MAY 29', ON('e1-a2-17-06'), None)],
         caption='To the signers, like a gift. (The real line keeps its dateline under the subtitle.)'),
    dict(id='17.07', set='skyline', shot='insert', frame='INSERT · one key (phrase 3)', room='rooftop', min=0.9,
         chars=[C('nesnej', 0.5)], sounds=[('ka_ching', 0.6, -12), ('synth:bell', 0.62, -18)],
         caption='He presses one key. KA-CHING: the register\'s bell starts its long decay (it carries the act-out).'),
    # the script's flash-print is 6 frames, but the reel schema clamps every beat to >= 0.5 s (schema.ts normBeat), so
    # the stick reel plays it at 12; written as 0.5 here so this file, report.py and the render agree
    dict(id='17.08', cont=True, shotId='17.07', style='LEDGER', set='screen', shot='insert', frame='LEDGER · flash-print',
         room='rooftop', min=0.5, on=[(LEDGER, 0.0, None)], cues=[STYLE['ledger']],
         caption='The ledger flash-prints the figure (6 frames in the script; 12 in the stick reel, its shortest beat).'),
    dict(id='17.09', cont=True, shotId='17.07', set='screen', shot='insert', frame="INSERT · the register's window",
         room='rooftop', min=2.2, on=[(LEDGER, 0.0, None)],
         # the screen set types the figure in (about 0.7 s, from the test render's stills), so 2.2 s leaves the whole
         # figure up for about 1.5 s, the script's "long enough to read (about 1.5 s)"
         caption='The figure holds in the register window to read.'),
    dict(id='17.10', set='skyline', shot='insert', frame="INSERT · the pen in Mario's hand", room='rooftop', min=2.5,
         on=[('PURCHASE ORDER', 0.25, None), ('AI CHIPS · QTY: MORE', 0.55, None)], sounds=[('paper_curl', 0.2, -32)],
         caption='The signing pen in Mario\'s hand is now, somehow, a purchase order: for AI chips, quantity "more".'),
    dict(id='17.11', set='skyline', shot='wide', frame='WIDE · the crack in the sky (phrase 4)', room='rooftop', min=4.4,
         chars=[C('mas', 0.25), C('mario', 0.45, 'point'), C('nesnej', 0.8)], cues=[MU['out']],
         caption='A hairline crack runs across the blue sky, L→R, in 12 frames. Everyone looks up: Nesnej, Mario '
                 '(who writes it down), Mas last. Then Mas alone looks down at his glass.'),
    dict(id='17.12', set='skyline', shot='close', frame="INSERT · Mas's glass (the act-out)", room='rooftop', min=4.0,
         chars=[C('mas', 0.5, face='calm')], cues=[STYLE['glass']],
         caption='The crack in the water; the water doesn\'t move. The reflected crack keeps going after the sky\'s has '
                 'stopped, until it runs across his small reflection.'),
    dict(id='17.13', set='void', shot='wide', frame='BLACK · on the bell\'s last partial', room='black', min=0.75,
         caption='CUT TO BLACK. (The recommended 11-minute split point.)'),
]

CAST = {
    # set up in Act One (the four CEOs) or the cold open (Mas): named from the chapter's first frame
    'mas': {'known': True}, 'radnus': {'known': True}, 'mario': {'known': True}, 'tasya': {'known': True},
    'sirrah': {'role': 'WOMAN WITH THE POINTER'},
    'photographer': {'name': 'PHOTOGRAPHER', 'role': 'PHOTOGRAPHER', 'known': True},
    'nedib': {'role': 'MAN AT THE DOOR'},
    'silhouette': {'name': 'THE LIT WINDOW', 'role': 'THE LIT WINDOW', 'known': True},
    'clone': {'name': 'LAHTNEMULB (THE CLONE)', 'role': 'GLOSSY MAN AT THE MIC'},
    'lahtnemulb': {'name': 'LAHTNEMULB', 'role': 'THE CHAIRMAN'},
    'senator': {'name': 'A SENATOR', 'role': 'A SENATOR', 'known': True},
    'gallery': {'name': 'GALLERY', 'role': 'GALLERY', 'known': True},
    'sucram': {'role': 'MAN WITH THE STAMP'},
    'noterb': {'name': 'NOTERB', 'role': 'A SILVER CUFF'},
    'simed': {'role': 'A SIGNER (unplated)'},
    'notnih': {'name': 'NOTNIH', 'role': 'A SIGNER'},
    'nesnej': {'role': 'MAN AT THE REGISTER'},
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
            a_out = L['pace']['audible_out_s']
            g = L['placement']['gap_before_s']
            follows = L['placement']['follows']
            if j == 0:
                if 'lead' in ov:
                    onset = start + ov['lead']
                elif follows == 'voice' and g is not None and prev_end is not None:
                    onset = max(start + ov.get('min_lead', 0.3), prev_end + g)
                    if start + ov.get('min_lead', 0.3) > prev_end + g + 0.05 and 'min_lead' not in ov:
                        WARN.append(f'{lid}: gap after the cut grew to {onset - prev_end:.2f} s (plan {g})')
                else:
                    onset = start + sp.get('lead', 0.5)
            else:
                g = ov.get('gap', g)          # the picture's gap (lx) wins over the recording plan's
                if g is None:
                    WARN.append(f'{lid}: no gap in the plan; 0.6 s used')
                onset = prev_end + (g if g is not None else 0.6)
            end = onset + (a_out - a_in)
            PLACED[lid] = dict(on=onset, end=end, file_start=onset - a_in, a_in=a_in, a_out=a_out, spec=sp['id'])
            prev_end = end
            last_end = end if last_end is None else max(last_end, end)
        if 'end' in sp:
            e = res(sp['end'], start)
        else:
            e = start + sp.get('min', 0.0)
            if last_end is not None:
                e = max(e, last_end + sp.get('tail', 0.5))
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

    lines_by_beat = {i: [] for i in range(len(beats))}
    for lid, p in PLACED.items():
        lines_by_beat[beat_of(p['on'])].append(lid)
    out_beats = []
    for i, b in enumerate(beats):
        sp, s0, e0 = b['sp'], b['start'], b['end']
        dur = e0 - s0
        chars = [dict(c) for c in sp.get('chars', [])]
        onscreen = []
        for (text, at, u) in sp.get('on', []):
            a = res(at, s0) - s0
            uu = None if u is None else res(u, s0) - s0
            if a >= dur - 1e-3:
                WARN.append(f"{sp['id']}: '{text[:30]}' appears after the beat ends ({a:.2f} >= {dur:.2f})")
            if uu is not None and uu >= dur - 1e-3:
                uu = None
            onscreen.append({'text': text, 'at': round(max(0.0, a), 3), 'until': None if uu is None else round(uu, 3)})
        names = []
        for ids, at in sp.get('names', []):
            for nid in (ids if isinstance(ids, tuple) else (ids,)):
                names.append({'id': nid, 'at': round(res(at, s0) - s0, 3)})
        sounds = [{'name': n, 'at': round(res(at, s0) - s0, 3), 'gain': gdb} for (n, at, gdb) in sp.get('sounds', [])]
        ids_in_frame = {c['id'] for c in chars} | ({sp['fg']['id']} if sp.get('fg') else set())
        lines = []
        for lid in sorted(lines_by_beat[i], key=lambda k: PLACED[k]['on']):
            L, p = LINES[lid], PLACED[lid]
            who = SPEAKER[L['speaker']]
            ov = next((s.get('lx', {}).get(lid) for s in SPEC if lid in s.get('lx', {})), None) or {}
            tag = ov.get('tag')
            if tag is None:
                tag = '' if who in ids_in_frame else 'O.S.'
            words = [[w['w'], round(w['t0'] - p['a_in'], 3), round(w['t1'] - p['a_in'], 3)] for w in L.get('words', [])]
            lines.append({
                'id': lid, 'who': who, 'text': L['text'], 't': round(p['on'] - s0, 3), 'dur': round(p['end'] - p['on'], 3),
                'audio': os.path.relpath(os.path.join(ROOT, L['file']), ROOT), 'in': round(p['a_in'], 3),
                'words': words, 'tag': tag, 'cut': L['text'].rstrip().endswith('—'),
            })
        beat = {
            'id': sp['id'], 'act': 'ACT TWO', 'kind': sp.get('kind', 'scene'), 'set': sp.get('set', 'void'),
            'style': sp.get('style', 'BASE'), 'shot': sp.get('shot', 'wide'), 'frame': sp.get('frame', ''),
            'side': '', 'room': sp.get('room', ''), 'chars': chars, 'caption': sp.get('caption', ''),
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
        if sp.get('cues'):
            beat['cues'] = sp['cues']
        out_beats.append(beat)
    total = beats[-1]['end']
    doc = {
        'episode': 1,
        'title': 'ep1.0_research_preview.md',
        'part': 'ACT TWO · the regulate-me tour · sc 13-17',
        'variant': 'stick-figure dialogue reel v2 · the recorded takes over a temp bed',
        'logline': 'Act Two for flow and dialogue: the fastrec takes laid to the script\'s shots, one beat per shot. '
                   'Stick figures and text cards stand in for the picture.',
        'dateSpan': 'May 4 - 30, 2023',
        'runtimeMin': 25,
        'dialogueReel': True,
        'cast': CAST,
        '_source': {'script': 'show/episodes/ep01/script.md ## ACT TWO (the Act Two fixer pass, 2026-09-27)',
                    'plan': 'audio/ep01/act2/dialogue/lines-plan-v2.json (audio/reel/ep01-act2-v2/set_plan.py)',
                    'takes': 'audio/ep01/act2/dialogue/lines-fast-v2.json',
                    'builder': 'audio/reel/ep01-act2-v2/build_timeline.py',
                    'notes': 'show/episodes/ep01/production/stick/act2-notes.md',
                    'act_seconds': round(total, 3)},
        'beats': out_beats,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as fh:
        json.dump(doc, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {len(out_beats)} beats, {len(PLACED)} lines, '
          f'act {int(total // 60)}:{total % 60:05.2f}')
    for w in WARN:
        print('  WARN', w)
    if '--check' in sys.argv and WARN:
        sys.exit(1)


if __name__ == '__main__':
    main()
