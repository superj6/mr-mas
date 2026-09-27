#!/usr/bin/env python3
"""v3-script pass: builds show/episodes/ep01/production/full-v3/beat-plan/<seg>.json from the edit spec below.

Run (from anywhere):  python3 show/episodes/ep01/production/full-v3/beat-plan/_build_beatplan.py [--write]
Without --write it only validates and prints the runtime table.

Spec conventions (documented again in each file's "_about"):
  action   keep | cut | merge (into) | new (after)
  est_s    the planned beat length after the v3 edits (a planning figure; the lock sets frames from the takes)
  src_s    the beat's reelDur in the source timeline
  arrive_s room before the beat's first line (only where the pass sets one)
  hold_after_s  hold after the beat's last line (only where the pass sets one)
  lines    every source line of a kept beat, keep true/false; new lines carry who/text/after/gap_s/delivery
  vo       Mas's inner voice: at = "start+S" | "after:<line id>+S" | "before:<line id>-S"
  jcut     a line or a sound that starts under the outgoing shot (lead_s)
  lcut     sound that carries over the next picture (over_s)
"""
import json, os, sys, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../../..'))  # the repo root
OUTDIR = f'{ROOT}/show/episodes/ep01/production/full-v3/beat-plan'
SRC = {
    'coldopen': 'show/reel/ep01-full/ep01-coldopen-v2.json',
    'act1': 'show/reel/ep01-full/ep01-act1-v2.json',
    'act2': 'show/reel/ep01-full/ep01-act2-v2.json',
    'act3': 'show/reel/ep01-full/ep01-act3-v2.json',
    'act4': 'show/reel/ep01-act4-v5.json',
    'tag': 'show/reel/ep01-full/ep01-tag-v2.json',
}
SAMPLE = 'audio/ep01/v3-sample/vo-v2 (fastrec take, from the v3 sample)'

# ---------------------------------------------------------------- the V.O. (Mas's inner voice), episode order
# kind: read | prediction | warmth | gap | count | effort | caught
VO = collections.OrderedDict()
def vo(vid, text, kind, delivery, take='new', pays=None, cluster=None):
    VO[vid] = dict(id=vid, who='mas', text=text, kind=kind, delivery=delivery, take=take,
                   **({'pays_off': pays} if pays else {}), cluster=cluster)

vo('v3-vo-01', 'gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first.', 'read',
   'close and dry, unhurried; three even reads of three people, no irony on any of them', f'v3s-01 · {SAMPLE}', cluster='1 launch night')
vo('v3-vo-02', "she'll go for three.", 'prediction', 'flat, certain, almost fond; a man who has watched her whiteboards for years',
   f'v3s-11 · {SAMPLE}', pays='5.07: Rima underlines LAUNCH: LOW-KEY a third time', cluster='1 launch night')
vo('v3-vo-03', "she's right. it will break. i don't know which part yet.", 'gap',
   'honest and quick, a little lower than his speech; then the spoken "it\'s a preview." comes out calm, and the gap is never explained',
   f'v3s-02 · {SAMPLE}', cluster='1 launch night')
vo('v3-vo-04', 'alyi asks that about everything we build. he means it every time.', 'warmth',
   'warm, plain, no smile in it; the second sentence slower', f'v3s-03 · {SAMPLE}', cluster='1 launch night')
vo('v3-vo-05', 'i know. i still read it twice.', 'gap',
   'caught out, quietly amused at himself; "twice" lands soft', f'v3s-04 · {SAMPLE}', cluster='1 launch night')
vo('v3-vo-06', 'someone noticed.', 'read', 'wonder held very still; replaces v2\'s "nobody noticed."', f'v3s-05 · {SAMPLE}', cluster='1 launch night')
vo('v3-vo-07', 'mostly the bill.', 'gap', 'a beat after "it\'s the bill."; the one-word correction he will say aloud to the Orb in Act Four ("mostly.")',
   f'v3s-06 · {SAMPLE}', cluster='1 launch night')
vo('v3-vo-08', "eleven keys. he's here for the twelfth.", 'prediction',
   'counting, not worried; inside the freeze, so it is the only sound but the room',
   pays='9.10: weeks on, Tasya\'s ring has a twelfth key, NopeAI beige', cluster='2 the lobby')
vo('v3-vo-09', 'it does.', 'gap', 'dry, pleased, very small; then aloud, business: "and the rent?"', cluster='2 the lobby')
vo('v3-vo-10', "mario used to sit where gerg sits. he left to build a careful one.", 'warmth',
   'plain, a little wistful on "used to"; "a careful one" is wry about his own lab, never a dig at Mario', cluster='3 the duel (intro line)')
vo('v3-vo-11', "four companies, one table. radnus has been rehearsing something since the lobby.", 'read',
   'amused, quiet, as the room settles; the second sentence a shade slower', cluster='4 the White House')
vo('v3-vo-12', "he's not wrong.", 'gap', 'conceding it privately, flat; then aloud the knife, sincerely: "how\'s the dancing?"', cluster='4 the White House')
vo('v3-vo-13', "i'll turn when he finishes the sentence.", 'effort',
   'a small decision about where to look, made while three heads turn; calm as a skill', cluster='4 the White House')
vo('v3-vo-14', 'i made it for everyone else.', 'caught',
   'kept take e1-a3-18-04 (unchanged); the Orb fitting the outline on the wall catches it', take='kept · e1-a3-18-04', cluster='5 the dark room')
vo('v3-vo-15', "gerg types louder when he's happy. he's been happy since november.", 'warmth',
   'over Gerg\'s keys on the speaker, near a smile; plants 2 AM, where the keys stop', pays='S5.09-back: "His keys stop."', cluster='5 the dark room')
vo('v3-vo-16', 'thrilled is too much. enthusiastic is a lot.', 'effort',
   'weighing the reply strip, precise and private: the one place in the episode where we watch him choose "super."', cluster='5 the dark room')
vo('v3-vo-17', 'the race is tomorrow. the board wants noon today.', 'read',
   'unbothered, logistical; the Strip\'s engines under it', cluster='6 Vegas, noon')
vo('v3-vo-18', "gerg's not on it. alyi set it up. probably just the budget.", 'gap',
   'he notices, and explains it away; the last four words easy and wrong. The only read in the episode he gets wrong. Then nothing inside him until "super."',
   take='new (the sample take v3s-07 holds the last two sentences; re-record whole)', cluster='6 Vegas, noon')
vo('v3-vo-19', "i don't keep score.", 'caught', 'kept take a5-26a-01 (unchanged); the carve and the Orb catch it', take='kept · a5-26a-01', cluster='6 Vegas, that night')
vo('v3-vo-20', 'four hundred and six. four hundred and seven. four hundred and six.', 'count',
   'counting the hearts on the beat, then the count slips back one; nothing else changes in the voice', f'v3s-08 · {SAMPLE}', cluster='7 2 AM')
vo('v3-vo-21', "gerg. he'll say he's compiling.", 'prediction', 'fond, certain, as the tile rings',
   f'v3s-09 · {SAMPLE}', pays='S5.09: "Sorry, one sec. I\'ve got a build compiling."', cluster='7 2 AM')
vo('v3-vo-22', "he's typing like it's launch night.", 'warmth', 'under the keys, warm; it is why he asks "what are you building?"', cluster='7 2 AM')
vo('v3-vo-23', 'gerg never waits to be asked.', 'warmth', 'quiet, certain; the board said it on Friday, and he thinks it in present tense',
   f'v3s-10 · {SAMPLE}', cluster='7 2 AM')
vo('v3-vo-24', 'it looks calmer than me.', 'caught',
   'mild and honest; the picture has just shown the cover and the face wearing the same expression', cluster='8 the tag (coda line)')


def V(vid, at, **extra):
    d = {k: v for k, v in VO[vid].items() if k != 'cluster'}
    d['at'] = at
    d.update(extra)
    return d


# ---------------------------------------------------------------- new and changed lines
NEW = {}
def nl(nid, who, text, after, gap, delivery, tag):
    NEW[nid] = dict(id=nid, new=True, who=who, text=text, after=after, gap_s=gap, delivery=delivery, tag=tag)
    return NEW[nid]

nl('v3-a2-0001', 'mas', '"…i have no equity in nopeai."', 'e1-a2-15-14', 0.5,
   'quiet, to the dais, a plain fact after the stamp; lowercase house style; no comic scoring under it',
   '[P · MAY 16, 2023 · facts L22: "I have no equity in OpenAI." Parody name swapped. It replaces RAIL: TESTIFIES HE HAS NO EQUITY]')
nl('v3-a4-0001', 'tasya', '"…we\'re extremely excited to share the news that Mas Manalt and Gerg Mockbran, together with colleagues, will be joining Macrosoft to lead a new advanced AI research team."',
   'a5-27-44', 0.6, 'reading from his phone with pleasure, unhurried, one finished sentence; the ellipsis is a print mark, not a trail',
   '[V · NOV 19, 2023 · the statement\'s second sentence (fetched from the primary source 2026-09-26); the first sentence is cut (C15). Replaces a5-27-45]')
nl('v3-a4-0002', 'tasya', "Everyone's packed. Whatever happens to this place, Mas, don't worry about us.", None, 0.0,
   'delighted, to the floor and then to Mas at his desk; unprompted, so the real line answers him, not a question',
   '[INVENTED · replaces Mas\'s "what happens to you if nopeai disappears?" (a5-30-05), which the insider read heard as an interviewer\'s question in his mouth]')
nl('v3-a4-0003', 'tasya', '"…we have all the IP rights and all the capability… We are below them, above them, around them."', None, 0.0,
   'warm, expansive; one finished read; the floor, ceiling and walls step to slate on below / above / around',
   '[V/K · NOV 20, 2023 · the Swisher podcast; re-verify before lock. Replaces a5-30-06 without its invented "Oh, we\'d be fine."]')
nl('v3-a4-0004', 'terb', 'Before this goes out, I\'m reading it once. "We have reached an agreement in principle for Mas Manalt to return to NopeAI as CEO with a new initial board of Terb (Chair), the Other Yrral, and Mada."',
   None, 0.0, 'brisk, reading from the sheet; "(Chair)" read as a word about himself without looking up; "the Other Yrral" deadpan (YUR-rul)',
   '[INVENTED lead-in + V · NOV 21, 2023 · the return announcement\'s first sentence, whole. Replaces a5-30-10 without "so nobody\'s surprised" (the insider read)]')


# ---------------------------------------------------------------- the edit spec, per segment
SPEC = collections.OrderedDict()

def K(bid, est, **kw):  # keep
    return dict(id=bid, action='keep', est_s=est, **kw)
def C(bid, why, ref=None):
    return dict(id=bid, action='cut', est_s=0.0, why=why, **({'cut_ref': ref} if ref else {}))
def M(bid, into, why, ref=None):
    return dict(id=bid, action='merge', into=into, est_s=0.0, why=why, **({'cut_ref': ref} if ref else {}))
def N(nid, after, est, **kw):
    return dict(id=nid, action='new', after=after, est_s=est, **kw)

MU = {  # the mood map (v3-plan §6), as music calls
    'co': 'COLD OPEN · poised, curious · no score under the hall; MM-14 "Freeze F4" on the freeze; MM-06 carries the rewind',
    'launch': 'LAUNCH NIGHT · warm, giddy, late-night garage band · NEW: the Build in a major colour (brushes, Rhodes, chip), low under the talk; thins to Rhodes alone under Alyi',
    'drill': 'THE ODOMETER · exhilarating · SET-PIECE SWING in major, turning on the tile (heat at the bill)',
    'bill': 'THE BILL · the swing\'s bass pedal and the heat shimmer, then the siren through his phone',
    'elgoog': 'ELGOOG\'S CODE RED · comic panic · pizzicato, the siren as a joke (on the phone\'s small speaker inside the bullpen)',
    'lobby': 'THE LANDLORD\'S DEAL · caper, charming · THE JOB swing (MM-05 family), not LEVERAGE; stops on the pop; the lobby\'s room under the terms; back on the key ring\'s jangle',
    'duel': 'THE DUEL · rivalry · MM-04 Lighthouse: the Build (chip, left pane) against the Addendum (quartet, right)',
    'pause': 'THE PAUSE LETTER · a chill · MM-17 low from the push; THREAT (MM-14) once, on the pen\'s lift',
    'wh': 'THE WHITE HOUSE · pomp and comedy · MM-19 light chamber pomp; Nedib\'s muted-trumpet Fountain Pen motif on the door',
    'bridge': 'THE BRIDGE · a hush · no score; the phone\'s tinny clip, water, the plink',
    'senate': 'THE SENATE · procedural comedy · a lighter Under Oath (MM-20, brushed); one stop, on the wallet',
    'tour': 'THE TOUR · the run · THE RUN (MM-03) with a knee stab on each stamp',
    'roof': 'THE ROOFTOP · grand, then uneasy · MM-03\'s held pad under the talk; MM-05 The More You Buy with the register; the bell alone for the act-out',
    'dark': 'THE DARK ROOM · intimate, quiet, a little lonely · the Water Line, warm (MM-01), one continuous performance; thins to one felt note under the V.O.',
    'clock': 'ACT-OUT · THE CLOCK (MM-14 step figure), one step a beat, dead stop on bar 4',
    'vegas': 'NOON, LAS VEGAS · suspense · DARK ROOM felt into BLUEPRINT (MM-07); LEVERAGE low from the connect to the Cancel click; then digital silence',
    'night': 'THAT NIGHT · after the silence · DARK ROOM, one felt line; the pedal only under the flash',
    'board': "THE BOARD'S SIDE · dry, procedural comedy · PROCEDURE (MM-09), lighter: clockwork pizzicato, the pedal and the tick under the talk",
    'twoam': '2 AM WITH GERG · warm, loyal, funny · the Build and felt piano in a major colour over the dark room\'s pedal; ring-out on Gerg\'s look; Tasya\'s Rhodes on the door',
    'aval': 'THE AVALANCHE · the one full band · SET-PIECE SWING, dead stop on Mada\'s label',
    'return': 'THE RETURN · triumph, one size too big · VICTORY LAP / THE RETURN (MM-11): the violin under Alyi, Tasya\'s Rhodes floor, LEVERAGE under the terms, a brass stab on the sign',
    'coda': 'CODA · the vault\'s F hum as the pedal; no motif under the memo (the record)',
    'tag': 'TAG · quiet, wry · MM-12 december on the Water Line\'s felt; stops once, on the thud; the chord with no third on "noted."',
}

# ================================================================ COLD OPEN
SPEC['coldopen'] = [
    K('1.01', 4.75, arrive_s=1.0, music=MU['co'],
      jcut=[{'sound': "the hall's bed (HVAC, a polite crowd) under black before the first frame", 'lead_s': 0.5}],
      why='The series\' first frame, arrived at on sound: the hall is heard half a second before it is seen. Nothing else changes; no V.O. in the cold open (mas-inner-voice §5).'),
    K('1.02', 5.58, why='unchanged'),
    K('1.03', 1.54, why='unchanged; the tent card is the world\'s own label and stays'),
    K('1.04', 2.67, why='unchanged'),
    K('2.01', 0.62, why='unchanged'),
    K('2.02', 2.50, why='unchanged'),
    K('2.03', 2.50, why='unchanged: "noted." and the sip are the cold open\'s turn'),
    K('3.01', 2.00, why='unchanged'),
    K('3.02', 3.00, why='unchanged'),
    K('4.01', 4.00, why='unchanged'),
    K('4.02', 1.50, why='unchanged; SMASH TO the intro, then the 2 s filename card (C17, episode time)'),
]

# ================================================================ ACT ONE
SPEC['act1'] = [
    K('5.01', 3.0, arrive_s=1.0, music=MU['launch'],
      jcut=[{'sound': "the bullpen's room (server hum, one buzzing tube, Gerg's keys) under the filename card's last 0.6 s", 'lead_s': 0.6}],
      why='Arrival: the bullpen\'s room tone under the button before anything happens (the sample\'s edit).'),
    K('5.02', 7.86, arrive_s=1.2, hold_after_s=1.0, music=MU['launch'],
      vo=[V('v3-vo-01', 'start+1.2')],
      caption='The bullpen after hours, held: the room and the three people in it before anyone speaks. The cursor parks on the button.',
      why='Arrival at a chapter change, and the introduction the plates did: who wants what, in his read (sample 5.02). The Build enters low, in major.'),
    K('5.03', 13.17, vo=[V('v3-vo-02', 'after:e1-a1-5-02+0.4')],
      jcut=[{'line': 'e1-a1-5-01', 'lead_s': 0.5}],
      onscreen={'replace': {'GERG MOCKBRAN · CO-FOUNDER': 'GERG MOCKBRAN'}, 'drop': [], 'add': []},
      why='J-cut: Gerg\'s first line starts under the wide. The prediction is paid in 5.07. Plate cut to the name (v3-plan §5).'),
    K('5.04', 29.16, vo=[V('v3-vo-03', 'after:e1-a1-5-06+0.5')],
      onscreen={'replace': {'RIMA TAMURI · CTO': 'RIMA TAMURI'}, 'drop': [], 'add': []},
      why='The gap: the honest thought, then "it\'s a preview." Rima\'s question is her moment that isn\'t a joke (v3-plan §5); the V.O. gives it a beat to land.'),
    K('5.05', 2.62, onscreen={'replace': {'ALYI · CHIEF SCIENTIST': 'ALYI'}, 'drop': [], 'add': []},
      why='Plate cut to the name; his line, his count and v3-vo-04 say what he is to Mas.'),
    K('5.06', 2.97, hold_after_s=0.6, why='+0.3 s: the hold on Rima after "…still a preview." (sample)'),
    N('v3-5.06b', '5.06', 6.24, frame='HOLD · MCU·glass: Alyi in the doorway, seen in the glass (the 5.05 setup), still watching the button',
      set='bullpen', chars=['alyi (reflection)'], vo=[V('v3-vo-04', 'start+0.5')], music='the Build thins to Rhodes alone',
      caption='Back on Alyi in the glass, held, while Mas thinks about him. Alyi keeps watching the button.',
      why='Warmth for Alyi before the count, and the trust Act Four breaks (sample 5.06b). No new drawing: the 5.05 setup with a slow blink loop.'),
    K('5.07', 4.50, why='Pays v3-vo-02: the third underline.'),
    K('5.08', 2.29, why='unchanged: the click'),
    K('5.09', 15.21, hold_after_s=1.5, why='Aftermath: +1.5 s after "let\'s see if anyone notices." on the two of them and the quiet button (sample).'),
    K('5.10', 14.17, why='unchanged'),
    K('5.11', 8.21, vo=[V('v3-vo-05', 'after:e1-a1-5-23+0.4')], hold_after_s=0.7,
      why='He wants to be liked, and says so only to himself (sample).'),
    K('5.12', 2.58, music=MU['drill'], why='The swing enters on the counter\'s first tick.'),
    K('6.01', 5.0, music=MU['drill'],
      lines_drop={'e1-a1-6-01': 'replaced by v3-vo-06 ("nobody noticed." -> "someone noticed.")'},
      vo=[V('v3-vo-06', 'start+1.2')], why='Present tense, in the moment: wonder, not a caught line (sample).'),
    K('6.02', 5.0, why='unchanged'),
    C('6.03', 'C5: the kitchen bar. The drill repeats; the size reads in half the time.', 'C5'),
    K('6.04', 5.0, onscreen={'replace': {'NOLE · EARLY FUNDER': 'NOLE'}, 'drop': [], 'add': []},
      why='Nole\'s post stays (Gerg hearts it, Rima un-hearts it: character business). Plate cut to the name.'),
    C('6.05', 'C5: the shaft phrase.', 'C5'),
    K('6.06', 2.3, onscreen={'replace': {}, 'drop': [], 'add': ['RAIL: DEC 5, 2022 (moved from 6.07; lands with the legible 1,000,000)']},
      caption='Far down, the odometer has punched into bedrock and stopped (6.05\'s picture, folded in). Its last wheel clicks over and settles, legible, with its date.',
      why='+0.7 s to hold the million with its date, which moves here with 6.07 cut.'),
    C('6.07', "C5: Gerg's second post insert. The odometer's 1,000,000 under DEC 5 carries the five days.", 'C5'),
    K('6.08', 3.62, why='unchanged: "Low-key." / "Very low. Basement."'),
    K('6.09', 7.5, music='the swing turns on the tile: the heat, a bass pedal under the shimmer', why='unchanged'),
    K('7.01', 10.21, music=MU['bill'], vo=[V('v3-vo-07', 'after:e1-a1-7-02+0.4')], hold_after_s=1.8,
      jcut=[{'line': 'e1-a1-7-01', 'lead_s': 0.6}],
      why='J-cut: Rima\'s voice pulls us back up to his face. The gap, held 1.8 s; plants "mostly." (S5.05).'),
    K('7.02', 4.01, hold_after_s=0.8, why='+0.8 s on the steam before the siren\'s J-cut (sample).'),
    K('8.01', 2.5, music=MU['elgoog'], onscreen={'replace': {'NEWS ALERT': 'ELGOOG · CODE RED'}, 'drop': [], 'add': []},
      why='The alert says whose alarm it is, in the world\'s own words ([V] facts #5), so Radnus\'s plate can lose "RUNS ELGOOG".'),
    K('8.02', 2.79, why='unchanged'),
    K('8.03', 3.96, onscreen={'replace': {'RADNUS · RUNS ELGOOG · POLITELY ON FIRE': 'RADNUS · POLITELY ON FIRE'}, 'drop': [], 'add': []},
      why='The gag plate stays (one per scene); the alert and the lobby say it is Elgoog.'),
    K('8.04', 21.38, why='unchanged: the founders, "It is ours. We published it.", the badges'),
    K('8.05', 2.42, why='unchanged: GUEST, the badge thread\'s first link'),
    K('8.06', 2.5, lcut=[{'sound': "the NopeAI lobby's revolving door, pre-lapped under his exit", 'over_s': 0.8}], why='unchanged (the sound-led exit was already there)'),
    K('9.01', 5.5, arrive_s=1.2, music=MU['lobby'],
      onscreen={'replace': {'RAIL: JAN 23, 2023': 'RAIL: JAN 23, 2023'}, 'drop': [],
                'add': ['the check, legible in the wide: MACROSOFT · "multiyear, multibillion dollar" · amount: $ MULTIBILLION']},
      caption='Mas walks in with his glass; through the glass doors comes a novelty check, enormous, and jams in the revolving door under NOPEAI · A NONPROFIT. It is big enough to read from here.',
      why='C6: the check arrives inside the lobby wide (9.02 and 9.03 fold in). §10: the ~$10B is gone from the rail and the check; the amount field reads the company\'s own word, MULTIBILLION.'),
    M('9.02', '9.01', 'C6: the delivery folds into the lobby wide.', 'C6'),
    M('9.03', '9.01', 'C6: the check is read in the wide; its ~$10B is replaced by $ MULTIBILLION (§10).', 'C6'),
    K('9.04', 4.0, vo=[V('v3-vo-08', 'start+0.9')],
      caption='FULL FREEZE: Tasya, already in the lobby like part of the wall, the key ring at his belt. Mas keeps moving in the freeze and pockets the pen clipped to the check.',
      why='The pen goes into the freeze (9.05 folds in, C6). His voice counts the keys: who Tasya is to him (a landlord), and a prediction the picture pays at 9.10. The card is the scene\'s one gag card.'),
    M('9.05', '9.04', 'C6: the pen goes into the freeze.', 'C6'),
    K('9.06', 7.12, onscreen={'replace': {}, 'drop': ['THE CHECK · JAMMED IN THE REVOLVING DOOR'], 'add': []},
      why='unchanged; the stick label is scaffolding'),
    K('9.07', 3.0, why='unchanged'),
    K('9.08', 1.58, onscreen={'replace': {}, 'drop': ['COLLAR #3'], 'add': []}, music='THE JOB stops on the pop',
      why='The meter label is stick scaffolding; the pop and the collar are the picture.'),
    K('9.09', 28.2, vo=[V('v3-vo-09', 'after:e1-a1-9-04+0.5')], onscreen={'replace': {}, 'drop': ['COLLAR #3'], 'add': []},
      why='The gap, inside the hold that is already his: "it does." then "and the rent?"'),
    K('9.10', 12.96, arrive_s=2.2, caption='Weeks on: the check scuffed grey on the floor; Tasya where he stood, a twelfth key on his ring in NopeAI beige. On the TV, GNIB.',
      why='+1.0 s of arrival at the time jump. The beige twelfth key pays v3-vo-08 without a word.'),
    K('9.11', 2.42, why='unchanged'),
    K('9.12', 4.92, why='unchanged'),
    K('9.13', 5.5, hold_after_s=1.4,
      jcut=[{'sound': "the Build's chip arpeggio (sc 11's left pane) under the laptop's close", 'lead_s': 0.8}],
      why='Aftermath +1.0 s on Gerg\'s closed laptop, the first half of the match cut into sc 11 (the bridge Sydney\'s tick used to be).'),
    C('10.01', 'C1: Sydney moves to Ep2 with her real line. The newcomer couldn\'t read "5 turns" or "remember me"; nobody in our story wants anything in it.', 'C1'),
    C('10.02', 'C1', 'C1'), C('10.03', 'C1', 'C1'), C('10.04', 'C1', 'C1'),
    K('11.01', 3.0, arrive_s=3.0, music=MU['duel'],
      onscreen={'replace': {'RAIL: MAR 3, 2023': 'RAIL: MAR 14, 2023'}, 'drop': [], 'add': ['GTP-4 (the demo banner)']},
      caption='MATCH CUT: Gerg\'s laptop, which closed in the lobby, opens in the bullpen, now dressed as a demo stage under a hand-lettered GTP-4 banner. Mas at his end desk behind it.',
      why='Repurposed as the duel\'s arrival (C2 cuts the crate, C1 cuts Sydney\'s tick). A match cut where two places rhyme, led by the Build.'),
    C('11.02', "C2: Kram's crate (the Atem weights leak). No stakes for anyone in the scene; Atem stays on the intro poster.", 'C2'),
    K('11.03', 11.5, vo=[V('v3-vo-10', 'start+0.8')],
      onscreen={'replace': {'MARIO · EX-NOPEAI · THE CAREFUL RIVAL': 'MARIO'}, 'drop': ['RAIL: MAR 14, 2023'], 'add': []},
      why='Mas\'s voice introduces Mario (who he is to him), so the plate is his name. The rail moved to 11.01. +1.5 s.'),
    K('11.04', 10.0, why='unchanged'),
    K('11.05', 5.0, why='C3: phrase 3 at 2 bars: the post pops, holds to read, the bullpen cheers; Mario adds a line.', cut_ref='C3'),
    K('11.06', 5.0, hold_after_s=0.6, why='C3: phrase 4 at 2 bars: the scroll crosses the split, MEMO -> WEBSITE, the empty spindle.', cut_ref='C3'),
    K('12.01', 4.29, music=MU['pause'], jcut=[{'sound': "the monitor's toast pop", 'lead_s': 0.4}], why='unchanged'),
    K('12.02', 10.67, onscreen={'replace': {'NOLE · EARLY FUNDER · BUILDING HIS OWN': 'NOLE · BUILDING HIS OWN',
                                           'OIGNEB · AI PIONEER · CITATIONS: ↑': 'OIGNEB'}, 'drop': [], 'add': []},
      why='Nole\'s BUILDING HIS OWN is the scene\'s one gag plate (the plant C4 keeps); Oigneb is his name.'),
    C('12.03', 'C4: the EMIT page (Rezeile). The newcomer didn\'t know who or what.', 'C4'),
    K('12.04', 2.5, jcut=[{'sound': "the pen's scratch, under Nole's last word", 'lead_s': 0.5}],
      caption='The push comes back out of the monitor to his own desk, from above: Mas is already writing, with the MACROSOFT pen from the check. One word: PLEASE.',
      why='Without the thud, the cut back to his desk is led by the pen\'s scratch.'),
    K('12.05', 2.5, caption="In the conference-room glass, Alyi's reflection is back in its doorway, reading the pause letter on his phone (PAUSE GIANT AI EXPERIMENTS). It doesn't look at Mas. Mas doesn't look up.",
      why='The reflection reads the public letter, the page the whole industry read that week, not the cut op-ed; it still plays dry (no score, no motive).'),
    K('12.06', 2.5, why='unchanged: THREAT once, on the lift'),
    K('12.07', 1.0, why='unchanged'),
]

# ================================================================ ACT TWO
SPEC['act2'] = [
    K('13.01', 5.5, arrive_s=3.5, music=MU['wh'], vo=[V('v3-vo-11', 'start+1.0')],
      jcut=[{'sound': "the meeting room's mantel clock and the tripods' clicks, under the act break's black", 'lead_s': 1.0}],
      why='Arrival at a chapter change (4 s of room before the first line). His read names the room and Radnus\'s want.'),
    K('13.02', 3.83, why='unchanged'),
    K('13.03', 0.62, why='Sirrah\'s card stays: DAY JOB: VICE PRESIDENT is how a newcomer learns who she is. (Two gag cards in this scene, hers and the president\'s, 45 s apart: a bend, noted.)'),
    K('13.04', 1.92, why='unchanged'),
    K('13.05', 11.0, why='unchanged: Mario\'s concerns, his one full conversation there (v3-plan §3 "not cut")'),
    K('13.06', 4.54, why='unchanged'),
    K('13.07', 3.75, why='unchanged: the one lens look'),
    K('13.08', 5.0, why='unchanged'),
    K('13.09', 16.1, vo=[V('v3-vo-12', 'after:e1-a2-13-11+0.4')],
      why='The gap: he concedes Radnus\'s point inside, then says the knife.'),
    K('13.10', 2.25, why='unchanged'),
    K('13.11', 5.3, vo=[V('v3-vo-13', 'start+0.5')],
      caption='The door opens behind the row. The president strides in; three heads turn round to him, each at its own speed. Mas\'s doesn\'t.',
      why='His small stake (where to look), in the beat the heads take to turn; Nedib\'s line follows it.'),
    K('13.12', 0.62, why='unchanged: the flash and the card'),
    K('13.13', 5.3, lines_drop={'e1-a2-13-16': 'cut: "How much longer?" (its payoffs, the pinky promise and the scroll pour, are cut: C10, C11)',
                               'e1-a2-13-17': 'cut: "Longer than that. I\'ve got a big desk."'},
      caption='In the foreground Mario\'s finger goes all the way up, and his other hand pulls the whole scroll out of his pocket.',
      why='Judgement: the built joke loses both payoffs to C10 and C11, and the insider read already marked it. "Put it in writing. Longer." stays, and Act Three\'s long order on the desk still answers it.'),
    K('13.14', 5.9, hold_after_s=1.5, lcut=[{'sound': "the photo's white decays into night; the room's air runs under the cut", 'over_s': 1.0}],
      why='Aftermath: +1.0 s on the print after "it\'s a good photo."'),
    K('14.01', 2.58, music=MU['bridge'], why='unchanged: the bridge carries the political balance pair (guardrails §2a rule 3)'),
    K('14.02', 1.25, why='unchanged'), K('14.03', 1.92, why='unchanged'), K('14.04', 1.5, why='unchanged'),
    K('14.05', 2.42, why='unchanged'), K('14.06', 1.33, why='unchanged: the voice over black is the sound-led cut into the hearing'),
    K('15.01', 4.0, music=MU['senate'], why='unchanged'),
    K('15.02', 4.0, onscreen={'replace': {'LAHTNEMULB · OPENED WITH A CLONE': 'LAHTNEMULB'}, 'drop': [], 'add': []},
      why='The picture and "Couldn\'t have said it better myself." tell the clone joke; the plate is his name.'),
    K('15.03', 2.5, why='C8: trimmed 0.5 s.', cut_ref='C8'),
    K('15.04', 0.62, why='unchanged: Sucram\'s card, the scene\'s one gag card'),
    K('15.05', 7.08, why='unchanged'),
    K('15.06', 6.62, why='unchanged'),
    K('15.07', 6.9, lines_drop={'e1-a2-15-08': 'C8: "Are you nervous, Mr. Manalt?" cut'},
      why='C8: one clear exchange: the clone takes the chairman\'s card on "tasks, not jobs", and nobody remarks on it.', cut_ref='C8'),
    C('15.08', 'C8: the hold before the "nervous" answer.', 'C8'),
    C('15.09', 'C8: "Speaking for myself, a little." The newcomer couldn\'t tell who was nervous.', 'C8'),
    K('15.10', 8.0, why='unchanged'),
    K('15.11', 6.25, why='unchanged'),
    K('15.12', 3.0, why='unchanged: the wallet; the score stops'),
    K('15.13', 3.5, onscreen={'replace': {}, 'drop': ['RAIL: TESTIFIES HE HAS NO EQUITY'], 'add': []},
      why='The fact rail goes: Mas says the real line himself in 15.14 (presented, not labelled).'),
    K('15.14', 8.55, new_lines=[NEW['v3-a2-0001']],
      why='His own testimony, voiced ([P], facts L22), after Sucram\'s stamp, so the record has the last word and nobody doubts it. It plants Act Four\'s EQUITY: 0.'),
    K('15.15', 3.29, why='unchanged'), K('15.16', 2.79, why='unchanged'), K('15.17', 1.92, why='unchanged'),
    K('15.18', 2.05, hold_after_s=0.8, jcut=[{'sound': "the tour's first stamp thunk", 'lead_s': 0.3}], why='+0.8 s on Sucram\'s stare.'),
    K('16.01', 8.0, music=MU['tour'],
      onscreen={'replace': {'"…cease operating…" — MAS MANALT, ON THE EU\'S DRAFT AI RULES': '"…cease operating…" — MAS MANALT, ON THE EU\'S AI RULES'},
                'drop': ['"blackmail"', 'NOTERB · ENFORCES THE RULEBOOK.'], 'add': []},
      caption='One held poster: the review-quote strip, EU CANCELLED; his post "…no plans to leave", UN-CANCELLED; the last date stamps itself ADDED DUE TO POPULAR DEMAND, and his one-pixel smile holds.',
      why='C7: one held beat, about 8 s. His own post carries the flip ("Mas\'s voice carrying the flip" read as his public voice: a V.O. here would sit on a contested real moment).', cut_ref='C7'),
    M('16.05', '16.01', 'C7: the smile holds inside the poster\'s last beat.', 'C7'),
    K('17.01', 6.0, music=MU['roof'], onscreen={'replace': {}, 'drop': ['NOTNIH · WORRIES FULL-TIME.'], 'add': []},
      jcut=[{'sound': 'rooftop wind under the poster\'s last stamp', 'lead_s': 0.6}],
      why='C9: phrase 1 tightened; Notnih signs unplated (Ep3 introduces him).', cut_ref='C9'),
    K('17.02', 10.38, why='unchanged: Mario\'s "It doesn\'t say what it costs." is his moment that isn\'t a joke'),
    K('17.03', 1.42, why='unchanged'), K('17.04', 0.62, why='unchanged: Nesnej\'s card'),
    K('17.05', 3.67, why='unchanged'),
    K('17.06', 3.04, onscreen={'replace': {}, 'drop': ['— COMPUTEX, MAY 29'], 'add': []},
      why='The dateline is a footnote; the scene presents the line as his, at the table (a day\'s compression, no motive).'),
    K('17.07', 0.92, why='unchanged'), K('17.08', 0.5, why='unchanged'), K('17.09', 2.21, why='unchanged'),
    K('17.10', 2.5, why='unchanged'), K('17.11', 4.42, why='unchanged'),
    K('17.12', 4.5, hold_after_s=1.0, why='+0.5 s: the reflected crack reaches him, and the bell decays.'),
    K('17.13', 0.75, why='unchanged'),
]

# ================================================================ ACT THREE
SPEC['act3'] = [
    K('18.01', 6.0, arrive_s=3.5, music=MU['dark'],
      jcut=[{'sound': "the rack's fans and LED ticks under the act break's black", 'lead_s': 1.0}],
      why='Arrival at a chapter change: the dark room\'s first scene, the empty outline on the wall, before the slot whirs.'),
    K('18.02', 3.21, why='unchanged: the label says who sent it and what he is to it'),
    K('18.03', 4.92, why='unchanged: the Orb\'s card'),
    K('18.04', 0.75, why='unchanged'), K('18.04g', 0.5, why='unchanged'), K('18.05', 2.25, why='unchanged'),
    K('18.06', 7.7, hold_after_s=1.0, vo_keep={'e1-a3-18-04': 'v3-vo-14'},
      why='"i made it for everyone else." stays (the kept take, now v3-vo-14 in the map); +1.0 s after the chime.'),
    K('19.01', 2.0, onscreen={'replace': {}, 'drop': ['catching up: 7 weeks'], 'add': []},
      why='The Orb\'s iris goes to the monitor; the signpost goes with the runner it announced (C10).'),
    C('19.02', 'C10: New Delhi and the "hopeless" quote (its fairness issue, v3-plan §10, goes with it).', 'C10'),
    C('19.03', 'C10', 'C10'), C('19.04', 'C10: the hands runner, item 2 (Sirrah\'s "two letters").', 'C10'),
    C('19.05', 'C10', 'C10'), C('19.06', 'C10', 'C10'),
    C('19.07', 'C10: item 3, the pinky promise.', 'C10'), C('19.08', 'C10', 'C10'),
    C('19.09', 'C10: item 4, the forum.', 'C10'), C('19.09b', 'C10', 'C10'), C('19.10', 'C10', 'C10'),
    K('19.11', 2.5, onscreen={'replace': {}, 'drop': ['MISANTHROPIC · MARIO\'S LAB'], 'add': ['the lighthouse\'s own sign: MISANTHROPIC']},
      why='Act One\'s split made the lighthouse Mario\'s; the building\'s own sign names the lab.'),
    K('19.12', 2.5, why='+0.7 s: Mas watching, the Orb beside him.'),
    K('19.13', 2.5, why='unchanged: the second phone, NOZAMA · UP TO $4B, the rent meter (the joke Act Four no longer retells, C14)'),
    K('20.01', 3.42, jcut=[{'sound': 'his keyboard, under the rent meter\'s first tick', 'lead_s': 0.4}], why='unchanged'),
    K('20.02', 1.58, why='unchanged'), K('20.03', 2.58, why='unchanged'),
    K('20.04', 10.25, why='unchanged: no V.O. anywhere near the real post or the edit (a credibility moment)'),
    K('20.05', 3.08, why='unchanged'),
    K('20.06', 19.1, vo=[V('v3-vo-15', 'after:e1-a3-20-09+0.6')], hold_after_s=1.5,
      why='Warmth over Gerg\'s keys, after the call\'s last line; it plants the 2 AM keys stopping. The scene still ends on Gerg and the counter.'),
    C('21.01', 'C11 (judgement): the lightning manifesto egg, a reference nobody in the room reacts to. Neleh\'s paper egg moves into 21.02\'s bezel.', 'C11'),
    K('21.02', 13.46, onscreen={'replace': {'RAIL: OCT 30, 2023 · EO 14110': 'RAIL: OCT 30, 2023'}, 'drop': [], 'add': []},
      caption='The signing desk on the monitor: NEDIB, pen raised, over an order that runs off both ends of a very big desk. In the bezel, a small paper glowing, footnotes orbiting (Neleh\'s egg).',
      why='Nedib says what the order does, so the rail keeps only the date. The long order on the desk answers his "Longer." (sc 13).'),
    K('21.03', 4.38, why='unchanged'),
    K('21.04', 5.46, why='unchanged: "which one\'s real?" / "the one with the pen."'),
    K('21.05', 2.3, lcut=[{'sound': "the copies' clapping, into DevDay's applause", 'over_s': 1.0}],
      why='The clap now L-cuts straight from the signing into DevDay (the pour is cut).'),
    C('21.06', 'C11: the scroll pour. "that one." and the MARIO scroll were unclear.', 'C11'),
    C('21.07', 'C11: the glass as a paperweight.', 'C11'),
    K('22.01', 8.08, why='unchanged'),
    K('22.02', 5.0, vo=[V('v3-vo-16', 'start+1.3')],
      caption='The desk from above: How did the keynote go? and the strip [super] [enthusiastic] [thrilled]. His thumb hovers over the strip (the one hover in the episode; at noon the phone offers only super, and he takes it at once), then taps the first.',
      why='The effort shows (mas-inner-voice §4.11): "super." chosen from three, which is why it can carry the noon call.'),
    K('22.03', 3.3, hold_after_s=1.4, why='+0.8 s: the Orb\'s iris lingers on the phone.'),
    K('23.01', 2.5, music=MU['clock'], why='unchanged'),
    K('23.02', 2.5, why='unchanged'), K('23.03', 2.5, why='unchanged'),
    K('23.04', 2.5, why='unchanged: the crane and the glass tings pre-lap under the black'),
]

# ================================================================ ACT FOUR
BADGE = {'drop_side': True}
SPEC['act4'] = [
    K('S1.01', 5.6, arrive_s=1.8, music=MU['vegas'], vo=[V('v3-vo-17', 'start+1.8')], **BADGE,
      caption='The suite over the Strip, race-weekend banners below (generic: no real series\' name, logo or livery), practice-lap engines far off. A crane truck grinds past; every glass shivers except his.',
      why='Arrival (sample, 3.5 -> 5.5 s) plus his read: why Vegas, and that the board wants noon. HIS SIDE badge gone.'),
    K('S1.02', 2.5, **BADGE, caption='His hand nudges the glass true. On the laptop: BOARD · VIDEO CALL · JOIN, and under it four small attendee icons: a door, a glowing page, a spinner, a black square. None is green.',
      why='The attendee row must read here: v3-vo-18 notices who is missing.'),
    K('S1.03', 11.75, **BADGE, why='unchanged: THE PLAN is the show\'s voice; no V.O.'),
    K('S1.04', 9.5, **BADGE, onscreen={'replace': {'MACROSOFT · ~$10B IN': 'MACROSOFT · BILLIONS IN', 'EQUITY: 0 (HE TOLD THE SENATE)': 'EQUITY: 0'}, 'drop': [], 'add': []},
      why='§10: "billions" (Neleh\'s own word) on the key ring; EQUITY: 0 alone, since Act Two now has him say it (C16 trims 0.46 s).', cut_ref='C16'),
    K('S1.05', 3.21, **BADGE, why='unchanged'),
    K('S1.06', 5.3, **BADGE, vo=[V('v3-vo-18', 'start+0.4')], hold_after_s=0.7,
      caption='His finger over JOIN while he thinks it through. Then the click; the waltz tape-stops on it.',
      why='The one read he gets wrong, just after we have seen the board\'s plan: suspense by dramatic irony (sample). Then silence inside him for the whole blow.'),
    K('S1.07', 5.5, **BADGE, why='unchanged: no V.O. from the call through "super."'),
    K('S1.08', 1.25, **BADGE, why='unchanged'),
    K('S1.09', 4.79, **BADGE, onscreen={'replace': {'ALYI / CO-FOUNDER': 'ALYI'}, 'drop': [], 'add': []},
      why='Launch night told us what Alyi is to him; the arrow\'s tag is his name.'),
    K('S1.10', 1.0, **BADGE, why='unchanged'), K('S1.11', 1.92, **BADGE, why='unchanged'),
    K('S1.12', 4.6, hold_after_s=3.0, **BADGE, why='Aftermath of the act\'s biggest turn: the frozen tiles, the room, no score (sample, 2.2 -> 4.6 s).'),
    K('S2.01', 4.12, music=MU['night'], vo_keep={'a5-26a-01': 'v3-vo-19'}, **BADGE,
      why='"i don\'t keep score." stays (the kept take, now v3-vo-19): his voice back after the silence.'),
    K('S2.02', 1.79, **BADGE, why='unchanged'),
    K('S2.03', 3.5, **BADGE, onscreen={'replace': {'RAIL: TPOOL, HIS FIRST COMPANY · TWO STAFF REVOLTS': 'RAIL: TPOOL, HIS FIRST COMPANY'}, 'drop': [], 'add': []},
      why='§10: the count leaves the rail; the two shadows at a door carry it. The shorter rail reads faster (C16 trim 0.5 s).', cut_ref='C16'),
    K('S2.04', 1.5, **BADGE, why='unchanged'),
    K('S2.05', 2.5, **BADGE, caption='The iris lifts to his face. Toast: rewinding… A whip right to left, into the same noon from the board\'s side.',
      why='No badge flip: the whip, the rewinding toast and the call\'s 11:59 say where we are, and his voice going quiet says whose side.'),
    K('S3.00a', 19.96, arrive_s=3.4, music=MU['board'], **BADGE,
      jcut=[{'sound': "Neleh's office: the clock-tick and the call's waiting tone, under the whip's tail", 'lead_s': 0.6}],
      why='+1.0 s arrival: Neleh\'s desk at 11:59, before the fifth tile connects.'),
    K('S3.01', 3.71, **BADGE, why='unchanged'), K('S3.02', 2.58, **BADGE, why='unchanged'), K('S3.03', 15.5, **BADGE, why='unchanged'),
    K('S3.04', 19.25, **BADGE, onscreen={'replace': {}, 'drop': ['RIMA TAMURI · HIS CTO'], 'add': []}, why='The repeat intro goes (insider read); we met her on launch night.'),
    K('S3.04b', 3.58, **BADGE, jcut=[{'sound': "the all-hands crowd's hush", 'lead_s': 0.8}], why='unchanged'),
    K('S3.06', 3.96, **BADGE, why='unchanged'),
    K('S3.07', 10.84, hold_after_s=1.6, **BADGE, why='+0.8 s: the doorway empties before the match cut back.'),
    K('S3.05', 10.58, **BADGE, why='unchanged: "Gerg has never waited to be asked."'),
    K('S4.01', 4.79, **BADGE, jcut=[{'sound': 'the heart gliss, stacking', 'lead_s': 0.5}], why='unchanged'),
    K('S4.02', 18.55, **BADGE, lines_add=[{'id': 'a5-27-28', 'keep': True, 'moved_from': 'S4.06', 'after': 'a5-27-23', 'gap_s': 1.6,
                                         'delivery': 'reflection, not turning, a loaded beat after the first phone goes over the edge (clack)'}],
      caption='The boardroom at night, held: four phones buzz and step toward the edge. After Neleh\'s second turn the first phone goes over: clack. Alyi\'s reflection, not turning: "That is the company telling us."',
      why='C13 with a sliver: the volley goes, and Alyi\'s one line stays so THE PLAN\'s "Not the other way round." still turns. The first phone\'s fall moves here from S4.06.'),
    C('S4.04', 'C13: "Step four will reveal itself." / "When?" / "The company will tell us." S4.02 already says the board has nothing for Monday.', 'C13'),
    M('S4.06', 'S4.02', 'C13: "That isn\'t a time, Alyi…" is cut; the clack and "That is the company telling us." move into S4.02.', 'C13'),
    K('S4.07', 5.0, hold_after_s=1.0, **BADGE, why='unchanged: Neleh\'s moment that isn\'t a joke (the blank line), held'),
    K('S4.08', 21.5, **BADGE, lines_drop={'a5-27-33': 'C14', 'a5-27-34': 'C14'},
      onscreen={'replace': {'ADELINA · MARIO\'S CO-FOUNDER': 'ADELINA'}, 'drop': ['MARIO · RUNS THE RIVAL LAB', 'NOZAMA', 'NOZAMA · UP TO $4B  ·  ELGOOG · UP TO $2B'], 'add': []},
      caption='Both calls in one held split. Neleh offers Mario the job; he has eleven pages; Adelina takes the phone: no. Click. In the left pane, Neleh and Mada listen to a dial tone.',
      why='C14: Mario\'s second call goes (sc 19 told the money joke). Mario needs no plate by now; Adelina is her name.', cut_ref='C14'),
    K('S4.09', 15.38, **BADGE, jcut=[{'sound': "the lobby camera's CCTV hum", 'lead_s': 0.5}], why='unchanged: the talks with Mas said plainly'),
    K('S4.10', 4.0, **BADGE, onscreen={'replace': {'TTEMME · RAN A STREAMING SITE': 'TTEMME'}, 'drop': [], 'add': []},
      why='The headset and LIVE · CHAT say what he did; the plate is his name.'),
    K('S4.10b', 15.25, **BADGE, why='unchanged: the sealed folder'),
    K('S4.11', 3.38, **BADGE, onscreen={'replace': {'LIVE · CHAT:  F  F  F  F': 'LIVE · CHAT (the F spam as a small egg, no hold)'}, 'drop': [], 'add': []},
      why='The F meme stays an egg; the line carries the runner.'),
    K('S4.12', 2.92, **BADGE, why='unchanged'),
    K('S4.13', 6.5, **BADGE, lines_drop={'a5-27-45': 'C15: replaced by v3-a4-0001 (the second sentence alone)'}, new_lines=[NEW['v3-a4-0001']],
      onscreen={'replace': {}, 'drop': ['TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS'], 'add': []},
      why='C15: the statement\'s first sentence goes; the second (who is joining Macrosoft) is the news. No repeat plate: we met Tasya in the lobby.', cut_ref='C15'),
    C('S4.13c', 'C15: the first sentence\'s landing on Ttemme.', 'C15'),
    K('S4.13d', 7.42, **BADGE, why='unchanged: the second sentence lands on the board'),
    K('S4.13e', 3.0, **BADGE, why='unchanged: MAS · GERG ->'),
    K('S4.14', 2.46, **BADGE, why='unchanged'),
    K('S4.15', 2.5, **BADGE, jcut=[{'sound': "the dark room's drone, under Mada's held note", 'lead_s': 1.0}],
      why='The board\'s side ends on Mada; the dark room is heard before it is seen (the door back, now sound instead of a card).'),
    C('S5.01', "C16: the WHAT THEY DIDN'T KNOW card. A pointer; his voice returning tells us we are back with him.", 'C16'),
    K('S5.02', 4.5, arrive_s=4.5, music=MU['twoam'], **BADGE, why='Arrival: the dark room at 2 AM, glass and lanyard (sample, 2.6 -> 4.5 s).'),
    K('S5.03', 5.85, vo=[V('v3-vo-20', 'start+0.6')], **BADGE, why='The rhythm carries what he won\'t say: he loses count (sample). The first inner words since the board\'s side.'),
    K('S5.04', 2.96, **BADGE, why='unchanged: "the badge was a joke."'),
    K('S5.05', 2.29, **BADGE, why='unchanged: "mostly." (planted by v3-vo-07)'),
    K('S5.09', 16.53, vo=[V('v3-vo-21', 'start+0.3')], **BADGE, why='A read the next line pays off; warmth (sample).'),
    K('S5.06', 22.79, **BADGE, why='unchanged: the letter, read by Gerg; ALYI on the page ([V], facts L4)'),
    K('S5.07b', 6.0, hold_after_s=4.2, **BADGE, why='Silence inside him after "He did both.": the held face and the room (sample, 3.5 -> 6.0 s).'),
    K('S5.08', 5.83, **BADGE, why='unchanged'),
    K('S5.09-back', 9.63, vo=[V('v3-vo-22', 'start+0.3'), V('v3-vo-23', 'after:a5-29-17+0.5')], **BADGE,
      why='Two Gerg reads bracket the exchange: the loud keys motivate "what are you building?", and the bible\'s planted line lands before his keys stop (v3-vo-15 set up what that stop means).'),
    K('S5.09b', 6.58, **BADGE, why='unchanged: Gerg\'s moment that isn\'t a joke'),
    K('S5.11', 11.38, **BADGE, why='unchanged: Tasya\'s door, his moment that isn\'t a joke; no V.O. near "leave it open." (a contested real moment)'),
    K('S5.12', 5.5, hold_after_s=4.4, **BADGE, why='Aftermath: the door ajar (sample, 2.9 -> 5.5 s).'),
    K('S6.01', 4.5, music=MU['aval'], **BADGE, jcut=[{'sound': "the first tile's thock", 'lead_s': 0.4}], why='unchanged'),
    K('S6.02', 1.5, **BADGE, why='unchanged'), K('S6.03', 1.92, **BADGE, why='unchanged'), K('S6.04', 1.96, **BADGE, why='unchanged'),
    K('S6.06', 6.25, hold_after_s=1.5, **BADGE, why='+0.5 s on the label after the dead stop.'),
    K('S7.01', 19.83, arrive_s=2.7, music=MU['return'], **BADGE,
      jcut=[{'sound': "the bullpen by day (murmur, packing tape)", 'lead_s': 0.8}],
      why='+1.5 s arrival: Monday by day, the two boxes, before the post pops. Alyi\'s regret and "He did both." get nothing inside him (mas-inner-voice §5).'),
    K('S7.02', 5.0, **BADGE, lines_drop={'a5-30-05': 'replaced: Tasya offers it unprompted (v3-a4-0002)'},
      new_lines=[dict(NEW['v3-a4-0002'], after='start+1.4')],
      why='The insider read: "an interviewer\'s question put in Mas\'s mouth". Tasya volunteers it; Mas stays at his desk.'),
    K('S7.02b', 8.58, **BADGE, lines_drop={'a5-30-06': 'replaced by v3-a4-0003 (the record alone)'},
      new_lines=[dict(NEW['v3-a4-0003'], after='start+0.3')], why='The record now answers his own "don\'t worry about us."'),
    K('S7.03', 2.62, **BADGE, why='unchanged: "Hello."'),
    K('S7.05', 2.21, **BADGE, jcut=[{'sound': "the fires' crackle", 'lead_s': 0.6}], why='unchanged'),
    K('S7.06', 2.71, **BADGE, why='unchanged: Terb\'s card; the pin'),
    K('S7.06-cont', 4.92, **BADGE, why='unchanged'),
    K('S7.07', 9.9, **BADGE, lines_drop={'a5-30-10': 'replaced by v3-a4-0004 (without "so nobody\'s surprised")'},
      new_lines=[dict(NEW['v3-a4-0004'], after='start+0.8')], why='The insider read: the explanation isn\'t needed.'),
    K('S7.07b', 1.58, **BADGE, onscreen={'replace': {'YRRAL (NOT THAT YRRAL)': 'THE OTHER YRRAL'}, 'drop': [], 'add': []},
      why='The nameplate matches what Terb reads; there is no other Yrral in Ep1.'),
    K('S7.07-cont', 13.46, **BADGE, why='unchanged'),
    K('S7.08', 3.0, hold_after_s=1.4, **BADGE, why='Aftermath: +0.9 s after "good question." into the long hold.'),
    K('S7.09', 6.0, **BADGE, why='unchanged: the long hold'),
    K('S7.13', 8.12, **BADGE, why='unchanged'),
    K('S8.01', 4.0, arrive_s=1.0, **BADGE, why='+0.7 s: the lobby at night before the sign lights.'),
    K('S8.03', 3.0, **BADGE, why='unchanged'), K('S8.04', 1.75, **BADGE, why='unchanged'),
    K('S8.05', 3.26, hold_after_s=1.5, **BADGE, why='+0.8 s after "okay."'),
    K('S8.06', 2.79, music=MU['coda'], **BADGE, why='unchanged; no Q* rail (the vault and its sticky note are enough)'),
    K('S8.07', 9.88, **BADGE, why='unchanged'),
    K('S8.08', 8.38, **BADGE, why='unchanged'), K('S8.09', 3.5, **BADGE, why='unchanged'), K('S8.09b', 2.0, **BADGE, why='unchanged'),
    K('S8.10', 5.2, hold_after_s=2.0, **BADGE, lcut=[{'sound': "the vault's F pedal, into the tag", 'over_s': 1.5}],
      why='+1.0 s on the act\'s last image.'),
]

# ================================================================ TAG
SPEC['tag'] = [
    K('32.01', 4.5, arrive_s=4.5, music=MU['tag'],
      onscreen={'replace': {}, 'drop': ['CUT LINE', 'ELGOOG DEMO: "What the quack!"', 'LATER: THE DEMO WASN\'T REAL-TIME'], 'add': []},
      caption='Mas and the Orb at the desk, three marks in the wood now. The monitor behind them runs dim with the sound off, nothing on it to read.',
      why='C12: the monitor\'s eggs go; the shot is the tag\'s arrival.', cut_ref='C12'),
    K('32.02', 3.75, why='unchanged: EMIT\'s year-end issue'),
    K('32.03', 3.8, vo=[V('v3-vo-24', 'start+1.0')], why='The cover and the face wear the same expression; he thinks the cover looks calmer. The caught line tells us the calm is something he does.'),
    K('32.04', 4.0, why='unchanged: the Orb re-scans the cover'),
    K('32.05', 2.33, why='unchanged: "close."'),
    C('32.06', 'C12: the drawer insert (CTRL, the pen, the pin, DO NOT REMOVE). One clear button, not three.', 'C12'),
    K('32.07', 4.25, why='unchanged: the cover pinned, the GUEST lanyard framed'),
    K('33.01', 2.25, onscreen={'replace': {}, 'drop': ['UI: Look at glass of water'], 'add': []}, why='C12: the glass prompt goes.', cut_ref='C12'),
    K('33.02', 4.25, why='−0.5 s: the stamp reads; THE GREY LADY\'s complaint is the Ep2 hook'),
    C('33.03', 'C12: the glass insert folds into 33.04: the flat water line sits in his frame.', 'C12'),
    K('33.04', 3.5, caption='Mas in profile, his glass at his hand in frame: everything on the desk hopped, and its water line is flat. "noted." The chord with no third.',
      why='The one button: the thud, the flat glass in the same frame, "noted."'),
    K('33.05', 1.25, why='unchanged: CUT TO BLACK on the hum, into the Orb outro (B)'),
    C('OUT.01', 'The 12 s placeholder is replaced by the Orb outro (proposal B), the v3-outro pass\'s (episode time, not story).'),
]

ORDER = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
SEGCODE = {'coldopen': 'co', 'act1': 'a1', 'act2': 'a2', 'act3': 'a3', 'act4': 'a4', 'tag': 'tg'}


def build(seg):
    src = json.load(open(f'{ROOT}/{SRC[seg]}'))
    sbeats = {b['id']: b for b in src['beats']}
    sorder = [b['id'] for b in src['beats']]
    covered = set()
    out = []
    errs = []
    for e in SPEC[seg]:
        e = dict(e)
        bid = e['id']
        if e['action'] != 'new':
            if bid not in sbeats:
                errs.append(f'{seg}: {bid} not in source')
                continue
            if bid in covered:
                errs.append(f'{seg}: {bid} twice')
            covered.add(bid)
            sb = sbeats[bid]
            e['src_s'] = round(sb.get('reelDur', 0), 3)
            e['src_frame'] = sb.get('frame')
        drop_side = e.pop('drop_side', False)
        if e['action'] == 'keep':
            sb = sbeats[bid]
            lines = []
            ldrop = e.pop('lines_drop', {})
            vkeep = e.pop('vo_keep', {})
            for l in sb.get('lines', []):
                if l['id'] in ldrop:
                    lines.append({'id': l['id'], 'keep': False, 'who': l['who'], 'text': l['text'], 'why': ldrop[l['id']]})
                else:
                    d = {'id': l['id'], 'keep': True}
                    if l['id'] in vkeep:
                        d['vo_map'] = vkeep[l['id']]
                        d['note'] = 'kept V.O. take, unchanged text: ' + l['text']
                    lines.append(d)
            for bad in set(ldrop) - {l['id'] for l in sb.get('lines', [])}:
                errs.append(f'{seg}: {bid} drops unknown line {bad}')
            for la in e.pop('lines_add', []):
                lines.append(la)
            for nlx in e.pop('new_lines', []):
                lines.append(nlx)
            e['lines'] = lines
            if drop_side and sb.get('side'):
                on = e.setdefault('onscreen', {'replace': {}, 'drop': [], 'add': []})
                on.setdefault('drop', []).append(f"side badge: {sb.get('side')}")
                on['side_badge'] = 'removed'
        elif e['action'] == 'new':
            e['lines'] = []
        out.append(e)
    # carry the music mood forward onto every kept or new beat; order keys as PLAN §2 lists them
    cur = None
    KEYORDER = ['id', 'action', 'cut_ref', 'into', 'after', 'src_s', 'est_s', 'arrive_s', 'hold_after_s', 'frame', 'set', 'chars',
                'src_frame', 'lines', 'vo', 'jcut', 'lcut', 'onscreen', 'caption', 'music', 'why']
    for i, e in enumerate(out):
        if e['action'] in ('keep', 'new'):
            if e.get('music'):
                cur = e['music']
            elif cur:
                e['music'] = cur
        out[i] = {k: e[k] for k in KEYORDER if k in e} | {k: v for k, v in e.items() if k not in KEYORDER}
    missing = [b for b in sorder if b not in covered]
    if missing:
        errs.append(f'{seg}: uncovered source beats {missing}')
    src_total = round(sum(b.get('reelDur', 0) for b in src['beats'] if not b['id'].startswith('OUT.')), 2)  # story time: the outro placeholder is episode time
    est_total = round(sum(e.get('est_s', 0) for e in out), 2)
    return out, errs, src_total, est_total


def main():
    write = '--write' in sys.argv
    allerr = []
    table = []
    vo_seen = []
    for seg in ORDER:
        beats, errs, st, et = build(seg)
        allerr += errs
        for b in beats:
            for v in b.get('vo', []):
                vo_seen.append((seg, b['id'], v['id']))
            for l in b.get('lines', []):
                if l.get('vo_map'):
                    vo_seen.append((seg, b['id'], l['vo_map']))
        cut = round(sum(b['src_s'] for b in beats if b['action'] in ('cut', 'merge')), 2)
        kept_src = round(sum(b['src_s'] for b in beats if b['action'] == 'keep'), 2)
        kept_est = round(sum(b['est_s'] for b in beats if b['action'] == 'keep'), 2)
        new_est = round(sum(b['est_s'] for b in beats if b['action'] == 'new'), 2)
        table.append((seg, st, et, cut, kept_src, kept_est, new_est))
        if write:
            os.makedirs(OUTDIR, exist_ok=True)
            doc = {
                'segment': seg,
                'source': SRC[seg],
                '_about': ('v3-script beat plan (show/episodes/ep01/production/full-v3/PLAN.md §2). Written against the source timeline\'s beat ids; '
                           'every source beat appears once (keep, cut or merge), plus the new beats. est_s is a planning length from word counts and '
                           'the takes already on file, never a measurement: the v3 lock sets frames from the takes. vo.at = "start+S" | "after:<line id>+S" | '
                           '"before:<line id>-S". Lines of kept beats are listed keep true/false; new and changed lines carry v3-<seg>-NNNN ids; '
                           'V.O. lines carry v3-vo-NN ids, and "take" says whether a sample take exists. The script is show/episodes/ep01/script.md draft 6; '
                           'the notes are ../script-v3-notes.md.'),
                'story_s': {'source': st, 'estimate': et},
                'beats': beats,
            }
            with open(f'{OUTDIR}/{seg}.json', 'w') as f:
                f.write(json.dumps(doc, indent=1, ensure_ascii=False) + '\n')
    # V.O. checks
    ids = [v for _, _, v in vo_seen]
    if sorted(ids) != sorted(VO.keys()):
        allerr.append(f'VO mismatch: placed {sorted(ids)} vs defined {list(VO.keys())}')
    if ids != list(VO.keys()):
        allerr.append(f'VO order differs from placement order: {ids}')
    for e in allerr:
        print('ERROR', e)
    tot_s = sum(t[1] for t in table); tot_e = sum(t[2] for t in table)
    print(f"{'seg':9} {'src':>8} {'est':>8} {'cut+merge':>10} {'kept src':>9} {'kept est':>9} {'new':>6} {'delta':>7}")
    for seg, st, et, cut, ks, ke, ne in table:
        print(f'{seg:9} {st:8.2f} {et:8.2f} {cut:10.2f} {ks:9.2f} {ke:9.2f} {ne:6.2f} {et-st:7.2f}')
    print(f"{'story':9} {tot_s:8.2f} {tot_e:8.2f}   ({int(tot_s//60)}:{tot_s%60:04.1f} -> {int(tot_e//60)}:{tot_e%60:04.1f})")
    words = sum(len(v['text'].split()) for v in VO.values())
    print(f'V.O.: {len(VO)} lines, {words} words')
    for vid, v in VO.items():
        print(f"  {vid} [{v['kind']}] ({v['cluster']}) {v['text']}")
    return 0 if not allerr else 1


if __name__ == '__main__':
    sys.exit(main())
