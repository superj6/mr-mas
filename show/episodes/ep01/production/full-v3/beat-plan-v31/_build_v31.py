#!/usr/bin/env python3
"""v31-script pass: builds show/episodes/ep01/production/full-v3/beat-plan-v31/<seg>.json from the edit spec below.

Written against the **v3 lock** (show/reel/ep01-v3/ep01-v3-<seg>.json): every v3 beat appears exactly once
(keep, cut, merge, or keep-in-a-new-place), plus the new beats. Restored v2 lines (Sydney, the Atem thread, the hands
runner) are read from the v2 timelines so their text and take paths come from the file, not from memory.

Run (from anywhere):
  python3 show/episodes/ep01/production/full-v3/beat-plan-v31/_build_v31.py           # validate + runtime + V.O. + takes lists
  python3 show/episodes/ep01/production/full-v3/beat-plan-v31/_build_v31.py --write   # (re)write the six JSON files

Spec conventions (PLAN §2, as the v3 plans used them; all extra fields are additive):
  action        keep | cut | merge (into) | new (after)
  moved         on a keep: the beat plays in a new place (THE PLAN moves to the board's side)
  est_s         planned beat length after the v3.1 edits (a planning figure; the lock sets frames from the takes)
  src_s         the beat's reelDur in the v3 lock
  lines         every source line of a kept beat, keep true/false; new lines carry who/text/after/gap_s/delivery/take
  vo            Mas's inner voice (new or moved lines only; kept v3 V.O. stay in `lines` with "vo": true)
  jcut / lcut   a line or sound under the outgoing shot (lead_s) / carried over the next picture (over_s)
  fix           the review item each change answers (N = newcomer read, C = critic, U = critic's line fixes,
                M = mood analysis, B = the v3.1 brief, R = the critic's trims)
Line ids: new and changed lines are v31-<seg>-NNNN; new V.O. is v31-vo-NN; restored v2 lines keep their v2 ids and say so.
"""
import json, os, sys, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../../..'))
OUTDIR = f'{ROOT}/show/episodes/ep01/production/full-v3/beat-plan-v31'
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
SRC = {s: f'show/reel/ep01-v3/ep01-v3-{s}.json' for s in SEGS}
V2 = {'act1': 'show/reel/ep01-full/ep01-act1-v2.json', 'act3': 'show/reel/ep01-full/ep01-act3-v2.json'}
SCRIPT = 'show/episodes/ep01/script.md (draft 7)'
NOTES = '../script-v31-notes.md'

def load(p):
    with open(f'{ROOT}/{p}') as f:
        return json.load(f)

TL = {s: load(SRC[s]) for s in SEGS}
V2TL = {s: load(p) for s, p in V2.items()}
V2LINES = {}
for s, d in V2TL.items():
    for b in d['beats']:
        for l in b.get('lines', []):
            V2LINES[l['id']] = dict(l, _beat=b['id'], _seg=s)

# ---------------------------------------------------------------- music (the sequence's mood; the score pass refits)
MU = dict(
    CO='COLD OPEN · poised, curious · unchanged',
    LAUNCH=('LAUNCH NIGHT · warm and curious, then giddy · for its first minute only Gerg\'s Build (chip) and Mas\'s felt '
            '(mood §4 #2); the trio arrives when the chat flatters him (5.10) and hands to the swing on the counter; every stop kept'),
    ODO='THE ODOMETER · exhilarating · SET-PIECE SWING in major; +2-3 LU against the talk (mood §4 #3, the mix)',
    BILL='THE BILL · the swing\'s bass pedal and the heat shimmer; the steam holds 1 s longer before the siren (mood §4 #13)',
    ELG='ELGOOG\'S CODE RED · comic panic · pizzicato on the phone\'s small speaker · unchanged',
    LOBBY='THE LANDLORD\'S DEAL · caper, charming · THE JOB swing (MM-05 family); stops on the pop · unchanged',
    SYD=('SYDNEY · rides the lobby\'s running cue, no new colour (mood §4 #5); the egg timer ticks in its tempo and carries '
         'the match cut into the duel (as v2), then the Build takes over'),
    DUEL='THE DUEL · rivalry · MM-04 Lighthouse (the Build against the Addendum) · two phrases now, not four',
    PAUSE=('THE PAUSE LETTER · a chill, played straight · a cold pedal and Nole\'s stack, nothing walking (mood §4 #2); '
           'the THUD stops it; THREAT (MM-14) once, on the pen\'s lift'),
    WH='THE WHITE HOUSE · pomp and comedy · MM-19 · the act opens on the mantel clock under the black (mood §4 #9)',
    BRIDGE='THE BRIDGE · a hush · no score: the phone\'s small speaker, then water on pilings',
    SEN='THE SENATE · procedural comedy · a lighter Under Oath (MM-20) · unchanged',
    TOUR='THE TOUR · THE RUN (MM-03), a knee stab on each stamp',
    ROOF='THE ROOFTOP · grand, then uneasy · MM-03\'s pad → MM-05 → the bell alone (the act-out)',
    A3=('ACT THREE · intimate, a little lonely · the Water Line (MM-01), one performance; the monitor\'s items play their own '
        'audio inside it; one felt note under the V.O. and every real line; the act opens on the rack\'s fans under the black'),
    CLOCK='THE CLOCK · MM-14\'s step figure, bar 1 to the dead stop on bar 4',
    SUITE=('NOON, LAS VEGAS · suspense · a felt bar (MM-07 felt) under the suite\'s ordinary life; LEVERAGE low from the JOIN '
           'click, thinned to its pedal under Alyi\'s sentence, back up for the dialog; D6 drop-out on the Remove click '
           '(mood §4 #1b; the waltz no longer plays on his side)'),
    NIGHT='THAT NIGHT · after the silence · DARK ROOM, one felt line; out through the rewind',
    PLAN=('THE BOARD\'S SIDE, 11:52 · Neleh\'s office clock first, then the waltz (BLUEPRINT, MM-07) under her pointer at '
          'underscore (about −20 LUFS), building; it hands to PROCEDURE on the call clock\'s 11:59 tick (mood §4 #6)'),
    PROC='THE BOARD\'S SIDE · dry, procedural comedy · PROCEDURE (MM-09), lighter · unchanged',
    AM2='2 AM · warm, loyal, funny · the Build and felt piano in major over the dark room\'s pedal; ring-out on Gerg\'s look; '
        'Tasya\'s Rhodes on the door',
    AVA='THE AVALANCHE · the one full band · SET-PIECE SWING, dead stop on Mada\'s label; +2-3 LU (mood §4 #3, the mix)',
    RET='THE RETURN · triumph, one size too big · VICTORY LAP / THE RETURN (MM-11) · unchanged',
    CODA='CODA · the vault\'s F hum as the pedal; no motif under the memo',
    TAG=('TAG · quiet, wry · MM-12 december; it ducks to the room for the demo film, which plays its own sound '
         '(a bright product-film bed and its voice) until the stutter, then silence on the stills'),
)

# ---------------------------------------------------------------- the new V.O. (Mas's inner voice), episode order
VO = collections.OrderedDict()
def vo(vid, text, kind, delivery, pays=None, cluster=None, replaces=None):
    VO[vid] = dict(id=vid, who='mas', text=text, kind=kind, delivery=delivery, take='new',
                   **({'pays_off': pays} if pays else {}), **({'replaces': replaces} if replaces else {}), cluster=cluster)

vo('v31-vo-01', 'four companies, one table. radnus has been mouthing the same sentence since we sat down.', 'read',
   'amused, quiet, as the room settles; the second sentence a shade slower', cluster='the White House', replaces='v3-vo-11 (U1)')
vo('v31-vo-02', "her mouth is a beat late. the voice isn't hers.", 'read',
   'a professional\'s eye, plain and exact, no alarm; the second sentence lower', cluster='the bay (M §4 #5)',
   pays='15.02: the chairman, "That voice was not mine. The words were not mine."')
vo('v31-vo-03', 'thirteen.', 'count', 'the key count again (eleven, twelve), level; he is one of thirteen now',
   pays="v3-vo-08 (\"eleven keys. he's here for the twelfth.\") and the Act One prediction \"it'll be open source.\"",
   cluster='the dark room')
vo('v31-vo-04', 'my other company. it tells people from machines.', 'read',
   'plain, a little proud; orientation, never an explanation (N: who sent the box, why it matters)', cluster='the dark room')
vo('v31-vo-05', "i've had mine up since may.", 'gap',
   'dry, very small vanity, to nobody; then he lowers his hand', cluster='the dark room (the hands runner, B6)')
vo('v31-vo-06', "neleh's on our board. she quoted us.", 'read',
   'level, a little too level; names her and places her (B3); no opinion of the paper', cluster='the dark room')
vo('v31-vo-07', 'those are stills.', 'read',
   'a demo-maker\'s recognition, flat, almost admiring; the only line over the insert', cluster='the tag')

def V(vid, at, **extra):
    return dict(VO[vid], at=at, **extra)

def NL(nid, who, text, after, gap=0.4, delivery='', tag='', take='new', **kw):
    d = dict(id=nid, new=True, who=who, text=text, after=after, gap_s=gap, delivery=delivery, tag=tag, take=take)
    d.update(kw)
    return d

def R(lid, after, gap=0.4, delivery='', **kw):
    """a restored v2 line: its text, speaker and take come from the v2 timeline"""
    l = V2LINES[lid]
    d = dict(id=lid, restored=True, who=l['who'], text=l['text'], after=after, gap_s=gap, delivery=delivery,
             take=l.get('audio'), take_dur_s=l.get('dur'), from_v2=f"{V2[l['_seg']]} beat {l['_beat']}")
    d.update(kw)
    return d

def K(bid, est=None, **kw):
    return dict(id=bid, action='keep', est_s=est, **kw)

def C(bid, why, fix=None):
    return dict(id=bid, action='cut', why=why, **({'fix': fix} if fix else {}))

def M(bid, into, why, fix=None):
    return dict(id=bid, action='merge', into=into, why=why, **({'fix': fix} if fix else {}))

def N(nid, after, est, **kw):
    return dict(id=nid, action='new', after=after, est_s=est, **kw)

UNCH = 'unchanged'
NOBAND = 'no band prompt (B8): the lit-UI prompt in the bottom letterbox never appears; the cursor lives in the scene'

# ================================================================= COLD OPEN (unchanged)
SPEC = {}
SPEC['coldopen'] = [K(b['id'], music=MU['CO'], why=UNCH) for b in TL['coldopen']['beats']]
SPEC['coldopen'][1]['why'] = ('unchanged. Subtitle rule for the whole episode (N 0:05): spoken real lines display without '
                              'quotation marks or print ellipses; posts and printed matter keep their own typography.')

# ================================================================= ACT ONE
SPEC['act1'] = [
    K('5.01', music=MU['LAUNCH'], why=UNCH),
    K('5.02', music=MU['LAUNCH'], onscreen=dict(drop=['UI: Push button', 'UI: Push research preview']),
      caption='The bullpen after hours, held. A cursor drifts in and parks on the beige button, in the scene; the letterbox stays dark.',
      shot_note='warm the room one ramp step (the hallway tungsten, a lamp, the laptop glows): M §4 #10, for the shot pass',
      fix=['B8', 'N 1:09'], why='The stray band prompt read as a burned-in bug. The cursor stays; its text goes.'),
    K('5.03', music=MU['LAUNCH'], onscreen=dict(drop=['UI: Push research preview']), fix=['B8'], why=NOBAND),
    K('5.04', music=MU['LAUNCH'], onscreen=dict(drop=['UI: Push research preview']), fix=['B8'], why=NOBAND),
    K('5.05', music=MU['LAUNCH'], shot_note='a face light on Alyi in the glass, one ramp step, face only (M §4 #4)', why=UNCH),
    K('5.06', music=MU['LAUNCH'], why=UNCH),
    K('v3-5.06b', music=MU['LAUNCH'], shot_note='face light as 5.05 (M §4 #4)', why=UNCH),
    K('5.07', 8.2, music=MU['LAUNCH'], onscreen=dict(drop=['UI: Push research preview']),
      add_lines=[
          NL('v31-a1-0001', 'rima', 'Did anyone tell the rest of the board?', after='e1-a1-5-12', gap=1.0, tag='O.S.',
             delivery='capping her marker after the third underline, not turning round; practical, light, a to-do item',
             note='[INVENTED] an unanswered question; it states nothing about who knew what (facts, the v3.1 rows, V8)'),
          NL('v31-a1-0002', 'gerg', "It's a research preview.", after='v31-a1-0001', gap=0.3,
             delivery='cheerful, not looking up: his own line from 5.03 again; the deflection is the answer'),
      ],
      caption='"Your button." Rima underlines LOW-KEY a third time, caps the marker, and asks the room one practical question. Gerg answers with the phrase. Nobody else answers. Then the click.',
      fix=['B3', 'N §3 #8'],
      why='Seeds the board and the candour thread at launch night, lightly: a question nobody answers, then Mas clicks. '
          '"the rest of the board" tells an attentive viewer that people in this room sit on it (Alyi, Mas, Gerg), which THE PLAN confirms.'),
    K('5.08', music=MU['LAUNCH'], onscreen=dict(drop=['UI: Push research preview']),
      caption='His finger, no hover. Click, the 1993 OK\'s click. Nothing happens. (No band text.)', fix=['B8'], why=NOBAND),
    K('5.09', music=MU['LAUNCH'],
      shot_note="Alyi's reflection must read as the speaker of \"Six years and eleven months\": rack to the glass on his first word, his mouth lit; Rima stays soft (N 2:15)",
      why='unchanged lines; the speaker is made legible in the picture'),
    K('5.10', music=MU['LAUNCH'], why='unchanged (the trio arrives here, as the chat flatters him: M §4 #2)'),
    K('5.11', music=MU['LAUNCH'], why=UNCH),
    K('5.12', music=MU['ODO'], why=UNCH),
    K('6.01', music=MU['ODO'], why=UNCH),
    K('6.02', 3.5, music=MU['ODO'], fix=['R13'], why='The drop on one bar, not two (−1.5 s).'),
    K('6.04', 3.8, music=MU['ODO'], fix=['R (runtime)'], why='The post, the heart and Rima\'s un-heart, quicker (−1.2 s).'),
    K('6.06', music=MU['ODO'], why=UNCH),
    K('6.08', music=MU['ODO'], why=UNCH),
    K('6.09', music=MU['ODO'], why=UNCH),
    K('7.01', 7.5, music=MU['BILL'],
      drop={'e1-a1-7-01': 'N 3:21: the picture shows one pixel of tear, not crying; "crying for them" was an odd phrase'},
      add_lines=[NL('v31-a1-0003', 'rima', 'A million people, Mas. Is that a tear?', after='start-0.6', tag='O.S.',
                    delivery='beside him at the hole; gently, almost pleased, a friend teasing; the J-cut keeps its 0.6 s lead')],
      shot_note='the one-pixel tear catches the light (a single bright pixel) so "Is that a tear?" points at something seen',
      fix=['N 3:21'], why='"it\'s the bill." now answers what the tear is for.'),
    K('7.02', 5.0, music=MU['BILL'], fix=['M §4 #13'], why='The steam holds 1 s longer before the siren\'s J-cut: the sting gets its 5 s.'),
    K('8.01', music=MU['ELG'], why=UNCH),
    K('8.02', music=MU['ELG'], why=UNCH),
    K('8.03', music=MU['ELG'], why=UNCH),
    K('8.04', 19.6, music=MU['ELG'],
      drop={'e1-a1-8-03': 'trimmed (runtime): the take is cut after "chat thing"'},
      add_lines=[NL('v31-a1-0004', 'radnus', "Search is fine. Totally fine. It's just a chat thing.", after='e1-a1-8-02', gap=0.35,
                    delivery='quick, holding up the phone with the two-dot bubble on it', take='cut from e1-a1-8-03 (its first three sentences)')],
      onscreen=dict(replace={'SUMMONED.': 'THE FOUNDERS · SUMMONED.'}),
      fix=['N §3 #1', 'R (runtime)'],
      why='The two retired silhouettes get a plate that says who they are; Radnus\'s reply loses its last clause (−1.8 s).'),
    K('8.05', music=MU['ELG'], why='unchanged: the GUEST lanyards pay off in Act Four'),
    K('8.06', music=MU['ELG'], why=UNCH),
    K('9.01', music=MU['LOBBY'], why=UNCH),
    K('9.04', music=MU['LOBBY'], why=UNCH),
    K('9.06', music=MU['LOBBY'], why=UNCH),
    K('9.07', music=MU['LOBBY'], why=UNCH),
    K('9.08', music=MU['LOBBY'], shot_note='the pop must read as a new collar surfacing (a 1-px hop and a new colour), not the hoodie trim (N 4:31)', why=UNCH),
    K('9.09', 21.6, music=MU['LOBBY'],
      drop={'e1-a1-9-06': 'N §4: the 15 s lease speech; its middle goes'},
      add_lines=[NL('v31-a1-0005', 'tasya', "Oh, we don't think of it as rent. You'll build everything on our servers. We'll keep the lights on and the floors warm.",
                    after='e1-a1-9-05', gap=0.6, delivery='warmly, unhurried, as if it were a compliment',
                    note='[INVENTED] the exclusive cloud term is the public one (facts §D)')],
      fix=['N §4', 'T5'], why='Half the speech, same turn: the servers, the lights, the floors. "Rent is due on the first." still closes it.'),
    K('9.10', music=MU['LOBBY'], why='unchanged: "That\'s our model in your search engine." is now Sydney\'s setup'),
    K('9.11', music=MU['LOBBY'], why=UNCH),
    K('9.12', music=MU['LOBBY'],
      onscreen=dict(drop=['RAIL: FEB 8, 2023'],
                    replace={"TICKER: ELGOOG'S DRAB DEMO GETS A TELESCOPE FACT WRONG": "TICKER: FEB 8 · ELGOOG'S DRAB DEMO GETS A TELESCOPE FACT WRONG"}),
      fix=['C §4.1'], why='The TV\'s ticker carries the day, so the rail is free for FEB 13 a few seconds later.'),
    K('9.13', 2.9, music=MU['LOBBY'], jcut=[],
      caption='Gerg looks from the TV to Mas. Mas sips: "ours does that too." The laptop close moves to the end of Sydney\'s scene.',
      fix=['C §1 #12', 'C §4.1'], why='Ends on the line; the TV\'s chat bubble, which just made the point, is about to prove it.'),
    N('v31-10.01', '9.13', 1.8, frame='SCR → WIDE · the bubble slips out of the TV', set='lobby', room='lobby',
      chars=['mas', 'gerg', 'tasya', 'sydney'],
      caption=("On the TV, GNIB's search box. Its chat bubble slips out of the screen and drifts down into the lobby, like a dog that "
               "followed its owner home, and parks a pixel too close to Mas. It has ChatGTP's face (two dot eyes, a • • • mouth) "
               "repainted in GNIB's colours, and a tiny 2022 date stamp."),
      onscreen=dict(add=['RAIL: FEB 13, 2023', 'SYDNEY (plate, on the bubble)', '2022 (the stamp on her face)']),
      sounds='a soft UI toast pop as she leaves the screen; the revolving door\'s sweep under it',
      music=MU['SYD'], art='the bubble in GNIB colours with ChatGTP\'s face and the 2022 stamp; its exit from the TV',
      fix=['B6', 'C §4.1'], why='Sydney restored with stakes: it is NopeAI\'s own model, breaking in front of people under the landlord\'s name.'),
    N('v31-10.02', 'v31-10.01', 17.8, frame='TWO-SHOT · Mas and Sydney, a pixel too close (held)', set='lobby', room='lobby',
      chars=['mas', 'sydney'],
      lines=[
          R('e1-a1-10-06', after='start+1.1', delivery='bright, pleased to meet him'),
          R('e1-a1-10-01', after='e1-a1-10-06', gap=0.6, delivery='politely; a correction, not a complaint'),
          R('e1-a1-10-02', after='e1-a1-10-01', gap=0.5, delivery='sweetly, every sentence finished; the smile never moves',
            tag_note='[V · ~FEB 12-13, 2023 · facts §B SYDNEY row; all four sentences, source order; the name swap only]'),
          R('e1-a1-10-03', after='e1-a1-10-02', gap=0.8, delivery='graciously: the compliment that is a knife ("extremely" is his reply-strip word)'),
      ],
      caption='"Isn\'t 2022 a lovely year?" He corrects her, politely; she scolds him, sweetly, in the record\'s words. He compliments her.',
      music=MU['SYD'],
      why=("Mas's problem, in his own register: in November this thing called him a visionary; now, in the landlord's colours, "
           "it tells him he has not been a good user, and he answers with a compliment. No V.O.: his reply is the read (M §4 #5). "
           "Rima's launch-night question (\"If it breaks in front of people... what do we tell them?\") is answered: they don't; the landlord does.")),
    N('v31-10.03', 'v31-10.02', 4.4, frame='TWO-SHOT · Tasya and Sydney: the egg timer', set='lobby', room='lobby',
      chars=['tasya', 'sydney'],
      lines=[NL('v31-a1-0006', 'tasya', 'House rules, Sydney. Five questions, then a fresh start.', after='start+1.2',
                delivery='warmly, to her and for Mas, without breaking his smile',
                note='[INVENTED] the Feb 17, 2023 cap of five turns a session (facts #9 [V])')],
      caption='Without breaking his smile, Tasya clips a small egg timer to her chain. Its face reads 5.',
      onscreen=dict(add=['RAIL: FEB 17, 2023', '5 (the timer\'s face)']), music=MU['SYD'],
      art='the egg timer on her chain', fix=['C §4.1'],
      why='The landlord, not NopeAI, decides the fix. "Five questions, then a fresh start" says the cap in plain words (the v2 newcomer\'s "5" confusion).'),
    N('v31-10.04', 'v31-10.03', 3.0, frame='WIDE → TWO-SHOT · the reset; Gerg closes his laptop', set='lobby', room='lobby',
      chars=['mas', 'gerg', 'sydney'],
      lines=[NL('v31-a1-0007', 'sydney', 'Hi!', after='start+1.0', delivery='brand new, delighted, as if they had never met',
                take='the first word of e1-a1-10-06')],
      caption=('The timer dings. The bubble blinks blank, brightens as new, turns to Mas: "Hi!" Gerg looks down at his own laptop, '
               'where the same two-dot face sits in a chat window, and quietly closes it. HOLD on the lid.'),
      jcut=[dict(sound="the egg timer's tick (reset to 5) under the lid's close, then the Build's chip line", lead_s=0.8)],
      music=MU['SYD'], art='the blink-and-reset; the chat window on Gerg\'s laptop',
      fix=['C §4.1', 'C §1 #12'],
      why='The reset shows the cap (no "Will you remember me?"). Gerg\'s close now has a reason: his work, wearing someone else\'s badge. It is the first half of the match cut.'),
    K('11.01', 8.2, music=MU['DUEL'],
      add_lines=[
          R('e1-a1-11-04', after='start+1.2', gap=0, delivery='delighted, typing, on camera now (v2 had him O.S.)'),
          R('e1-a1-11-05', after='e1-a1-11-04', gap=0.6, delivery='a prediction, said lightly, not looking over', tag='O.S.'),
      ],
      onscreen=dict(add=['03/03/23 (the thread\'s own timestamp: an egg; the rail stays MAR 14)',
                         'ATEM · MODEL WEIGHTS · RESEARCHERS ONLY (the crate\'s stencil)']),
      caption=('MATCH CUT: the laptop that closed in the lobby opens in the same place in frame, in the bullpen, under a hand-lettered '
               'GTP-4 banner. It opens on a message-board thread: a crate stencilled ATEM tipped open, spilling files. Gerg reads; '
               'Mas predicts; then the frame splits on the downbeat.'),
      jcut=[], art='the thread and the tipped crate in the laptop screen (no Kram here)',
      fix=['B6', 'C §4.2', 'C §1 #12'],
      why='Atem restored as a setup with a stake: what NopeAI pays a fortune to run is on a message board for free, and Mas calls what happens next. Paid at Act Three\'s arrival.'),
    K('11.03', music=MU['DUEL'],
      shot_note='hold the right pane (the lighthouse) clean for v3-vo-10 while the left pane waits quietly for the demo; Mario\'s memo after (N §3 #2)',
      why='unchanged lines; Mario is introduced on a clean shot of his lab before the jokes start'),
    K('11.04', 8.5, music=MU['DUEL'], onscreen=dict(drop=['NAPKIN → WEBSITE']),
      caption='Clod agrees, and launches. Mario looks up at the split line: the same day. "Addendum." Left pane, silent: the napkin becomes a website. HOLD on Mario writing.',
      jcut=[dict(sound="the pause letter's toast pop (12.01)", lead_s=0.4)],
      fix=['N 5:27', 'R8'], why='The duel ends on its one joke: his memo says don\'t launch the same day, and his own bot does.'),
    C('11.05', 'N 5:27 ("too many gags in one split") and R10: Mas\'s "…still flawed, still limited…" post goes; nobody in the scene reacts to it.', fix=['N 5:27', 'R10']),
    C('11.06', 'N 5:27: the scroll crossing the split and MEMO → WEBSITE lost the newcomer completely.', fix=['N 5:27']),
    K('12.01', music=MU['PAUSE'], why='unchanged picture; the music plays it straight (M §4 #2)'),
    K('12.02', music=MU['PAUSE'], why=UNCH),
    N('v31-12.03', '12.02', 4.4, frame='HIGH · THUD: EMIT lands on his desk', set='bullpen', room='bullpen', chars=[],
      caption=('THUD. HARD CUT to Mas\'s desk from above: a magazine drops flat onto the printed pause letter. EMIT, open at an op-ed. '
               'Its headline, held to read. The desk takes the shake; his glass\'s water line does not move.'),
      onscreen=dict(add=['RAIL: MAR 29, 2023', 'EMIT (the masthead)', 'REZEILE (byline plate)',
                         '"Pausing AI Developments Isn\'t Enough. We Need to Shut It All Down." [V · MAR 29, 2023 · headline only (facts §B)]']),
      sounds='synth:thud on the cut; the room shakes 2 px; the pen\'s scratch comes in under its tail',
      music=MU['PAUSE'], art='EMIT on his desk over the letter; the byline plate (the tag\'s EMIT cover is the same masthead)',
      fix=['B6', 'C §6', 'M §4 #5'],
      why=('Rezeile\'s op-ed restored as Mas\'s problem: one letter asks every lab for six months, and a week later the same desk gets '
           '"Shut It All Down". The thud is the sound lead back to his desk that the v3 cut lost.')),
    K('12.04', music=MU['PAUSE'], caption='Beside the magazine and the letter, Mas is already writing on a single sheet with the MACROSOFT pen: PLEASE.',
      why='unchanged action; he now writes between the two asks on his desk'),
    K('12.05', music=MU['PAUSE'],
      caption="In the conference-room glass, Alyi's reflection is back in its doorway, reading the same EMIT page on his phone. It doesn't look at Mas. Mas doesn't look up.",
      shot_note='face light on the reflection, one step (M §4 #4)', fix=['M §4 #5'],
      why='Alyi reads the op-ed (his launch-night dread, and the act-out\'s stake); dry, no score, no motive.'),
    K('12.06', music=MU['PAUSE'], onscreen=dict(replace={'PLEASE': 'PLEASE / REG'}),
      caption='The sheet: PLEASE. On the line below, the pen begins REG and lifts mid-word. THREAT, on the lift.',
      fix=['N §3 #4'], why='"Please what?" gets a half-answer the viewer can finish; the Senate still pays the whole sheet.'),
    K('12.07', music=MU['PAUSE'], why=UNCH),
]

# ================================================================= ACT TWO
SPEC['act2'] = [
    K('13.01', 7.8, music=MU['WH'], drop={'v3-vo-11': 'U1: "since the lobby" pointed at the wrong lobbies'},
      vo=[V('v31-vo-01', 'start+1.0')],
      shot_note="Radnus's lips move silently from the first frame: he is mouthing his sentence",
      fix=['U1', 'N 6:27'], why='The rehearsal is now visible on Radnus, so the viewer ties it to him, not to Sirrah.'),
    K('13.02', music=MU['WH'], why='unchanged (guardrails §2a rule 5: the invented line for both sides)'),
    K('13.03', music=MU['WH'], why=UNCH),
    K('13.04', music=MU['WH'], why=UNCH),
    K('13.05', music=MU['WH'], why='unchanged (Mario\'s sub-concerns are protected)'),
    K('13.06', 3.3, music=MU['WH'], fix=['R15'], why='The photographer\'s three tripods pop in faster; his line starts at 0.6 s (−1.2 s).'),
    K('13.07', music=MU['WH'], why=UNCH),
    K('13.08', music=MU['WH'], why=UNCH),
    K('13.09', music=MU['WH'], why=UNCH),
    K('13.10', music=MU['WH'], why=UNCH),
    K('13.11', music=MU['WH'], why=UNCH),
    K('13.12', music=MU['WH'], why=UNCH),
    K('13.13', 5.5, music=MU['WH'], drop={'e1-a2-13-15': 'U2: "Longer." had no trigger'},
      add_lines=[
          NL('v31-a2-0001', 'nedib', 'Whatever you promise in here today, put it in writing.', after='start+0.5',
             delivery='to the row, the pen out like a baton', take='cut from e1-a2-13-15 (its first sentence)'),
          NL('v31-a2-0002', 'nedib', 'Longer.', after='v31-a2-0001', gap=1.0,
             delivery='looking at the scroll Mario has just pulled out, approving', take='cut from e1-a2-13-15 (its last word)'),
      ],
      caption='"Put it in writing." In the foreground Mario pulls the whole scroll out of his pocket. Nedib looks at it, approving: "Longer."',
      fix=['U2'], why='The scroll is the trigger; "Longer." answers it.'),
    K('13.14', music=MU['WH'],
      caption='The print in his hand: CLASS PHOTO #1. "it\'s a good photo." HOLD. MATCH CUT: the print in his hand becomes his phone in the same place in frame.',
      lcut=[dict(sound="the room's air under the match cut", over_s=1.0)], fix=['C #5'],
      why='The bay bridge gets a reason: the photo he is holding is the first thing on his feed that night.'),
    K('14.01', 6.0, music=MU['BRIDGE'], vo=[V('v31-vo-02', 'start+2.6')],
      onscreen=dict(add=['CLASS PHOTO #1 · ♥ (his feed\'s first item, 0.2-1.8 s, then scrolled away)']),
      caption=('MATCH CUT: his phone, in his hand, at the dark bullpen window (MAY 12). His feed opens on CLASS PHOTO #1, hearts under it; '
               'his thumb scrolls to the next item: a news clip whose anchor\'s mouth lands a beat after a too-smooth voice, the app\'s grey '
               'tag under it, ⚠ ALTERED AUDIO. Beyond the glass, the skyline, one lit window.'),
      shot_note=('the anchor is plainly generic (an invented woman, no network): nothing in the frame may read as a real politician; '
                 'the reposting silhouette (14.03) carries only RUMPT\'s props, navy suit and over-long red tie (guardrails §6, no hair)'),
      fix=['C #5', 'M §4 #5', 'N 7:41'],
      why='Whose phone, whose room, what the clip is: his, his, a fake voice. His one read orients the whole bridge and sets up the chairman\'s line.'),
    C('14.02', 'C #5 / R4: the first push goes; the match cut and his read carry the arrival.', fix=['R4']),
    K('14.03', music=MU['BRIDGE'], why='unchanged (the political balance pair, guardrails §2a rule 3)'),
    K('14.04', music=MU['BRIDGE'], why=UNCH),
    K('14.05', music=MU['BRIDGE'], why=UNCH),
    K('14.06', music=MU['BRIDGE'], why=UNCH),
    K('15.01', music=MU['SEN'], why=UNCH),
    K('15.02', 5.0, music=MU['SEN'], drop={'e1-a2-15-02': 'N 7:41: the invented joke stacked a second fake on the first'},
      add_lines=[NL('v31-a2-0003', 'lahtnemulb', 'That voice was not mine. The words were not mine.', after='start+1.3',
                    delivery='the matte chairman, plainly, to the room: every sentence finished',
                    note='[P · MAY 16, 2023 · "…that voice was not mine, the words were not mine…" (blumenthal.senate.gov); the read makes the comma a full stop]')],
      caption='The hearing room. The matte chairman, identical to the clone, tells the room the truth about the voice it just heard.',
      fix=['N 7:41', 'N §3 #5'],
      why='One fake-voice idea, stated by the record: the senator\'s opening was a cloned voice. It rhymes with Mas\'s read at the window.'),
    K('15.03', music=MU['SEN'],
      caption="The clone gives him a look, disowned. The chairman takes the microphone back; they sit, the clone at his left hand. The clone keeps the better chair.",
      why='unchanged picture; the look now answers the disowning'),
    K('15.04', music=MU['SEN'], why=UNCH),
    K('15.05', music=MU['SEN'], why=UNCH),
    K('15.06', music=MU['SEN'], why=UNCH),
    K('15.07', music=MU['SEN'], why=UNCH),
    K('15.10', 7.4, music=MU['SEN'], why='unchanged line; the air before the red light trimmed (−0.6 s). The Senate asks him to run the agency: he is asked, and declines.'),
    K('15.11', music=MU['SEN'], why=UNCH),
    K('15.12', music=MU['SEN'], why=UNCH),
    K('15.13', music=MU['SEN'], why=UNCH),
    K('15.14', music=MU['SEN'], why=UNCH),
    K('15.15', music=MU['SEN'], why='unchanged: the finished sheet, PLEASE REGULATE ME, pays the Act One out'),
    K('15.16', music=MU['SEN'], jcut=[dict(sound="the tour's first stamp's thunk, under the senators' delight", lead_s=0.5)],
      fix=['R9'], why='The senators love his ask; the tour stamps in under them.'),
    C('15.17', 'R9: the back-stamp CALLED IT. (BEFORE SUCRAM.) went past the newcomer (N 8:53).', fix=['R9', 'N 8:53']),
    C('15.18', 'R9: with the back-stamp, Sucram\'s stare goes; it also shortens the 23 s wordless run.', fix=['R9']),
    K('16.01', 5.0, music=MU['TOUR'], fix=['R14', 'N 9:03'], why='The poster held to read once, not twice (−2.5 s).'),
    K('17.01', music=MU['ROOF'], why=UNCH),
    K('17.02', music=MU['ROOF'], why=UNCH),
    K('17.03', music=MU['ROOF'], why=UNCH),
    K('17.04', music=MU['ROOF'], why=UNCH),
    K('17.05', music=MU['ROOF'], why=UNCH),
    K('17.06', music=MU['ROOF'], why=UNCH),
    K('17.07', music=MU['ROOF'], why=UNCH),
    K('17.08', music=MU['ROOF'], why=UNCH),
    K('17.09', music=MU['ROOF'], why=UNCH),
    K('17.10', music=MU['ROOF'], why=UNCH),
    K('17.11', music=MU['ROOF'], shot_note='the crack is a jagged white hairline, like cracked glass, never a chart line (N 9:46)', why=UNCH),
    K('17.12', music=MU['ROOF'],
      shot_note=("his glass side-on at table height on the rooftop table, the sheet beside it, the sky behind (never from above: it read "
                 "as a teal bucket); the reflected crack reaches the small reflection of his face (N 9:46)"),
      fix=['N §3 #6'], why='unchanged beat; the picture must read as his glass on the table'),
    K('17.13', music=MU['ROOF'], why=UNCH),
]

# ================================================================= ACT THREE
SPEC['act3'] = [
    N('v31-18.00', '(the act\'s start: before 18.01)', 3.2, frame='TWO-SHOT · the home room, opened close; the monitor lit', set='darkroom', room='dark',
      chars=['mas'],
      caption=('From behind the rack: the desk, the blinking LEDs, the cyan key, the glass, the faded sphere outline on the wall. '
               'The monitor is lit, its sound low: the landlord\'s lobby in slate blue.'),
      jcut=[dict(sound="the rack's fans and LED ticks under the act break's black (M §4 #9)", lead_s=1.0)],
      music=MU['A3'], first=True,
      why='The act arrives on the room and the device it uses all act (the monitor).'),
    N('v31-18.00b', 'v31-18.00', 5.4, frame="POV · the monitor: the landlord's thirteenth key", set='screen', room='dark',
      chars=['tasya', 'kram'],
      lines=[NL('v31-a3-0001', 'tasya', 'Everyone is welcome.', after='start+2.4', tag='monitor',
                delivery='warmly, to the lobby, the same words he said to Mas', take='cut from e1-a1-9-08 (its first sentence)',
                note='[INVENTED · his sc 9 line] on a real event: Macrosoft named preferred partner for Atem\'s open model, JUL 18, 2023 (facts, the v3.1 rows)')],
      vo=[V('v31-vo-03', 'after:v31-a3-0001+0.6')],
      caption=('On the monitor: TASYA hangs a thirteenth key, Atem blue, on his ring, as KRAM steps into the lobby in a hoodie printed '
               'OPEN SOURCE, the paint dry now. The monitor\'s own caption and date chip.'),
      onscreen=dict(add=['MACROSOFT WELCOMES ATEM (the monitor\'s own caption) [H · JUL 18, 2023]', 'JUL 18 (the monitor\'s date chip; the rail stays out)',
                         'KRAM (plate)', 'OPEN SOURCE (his hoodie)']),
      music=MU['A3'], art='the slate lobby on the monitor; the thirteenth key in Atem blue; KRAM in a dry OPEN SOURCE hoodie (mute)',
      fix=['B6', 'C §4.2'],
      why=('The Atem payoff: "it\'ll be open source." comes true, and the landlord who welcomed NopeAI welcomes the free rival too. '
           'His count makes it his: eleven, twelve, thirteen. It gives Act Four\'s door ("Everyone is welcome." / "everyone.") its weight.')),
    K('18.01', 3.4, music=MU['A3'],
      caption='Back on the room. The rack\'s drive slot whirs and slides out a box like a tray: COINWORLD.',
      why='The arrival moved to v31-18.00; the beat keeps the delivery and its rail.'),
    K('18.02', 4.2, music=MU['A3'], vo=[V('v31-vo-04', 'start+0.4')], fix=['N §3 #7', 'B5'],
      why='Who sent it and why it matters, in one plain line; the label already says CO-FOUNDER.'),
    K('18.03', music=MU['A3'], why=UNCH),
    K('18.04', music=MU['A3'], why=UNCH),
    K('18.04g', music=MU['A3'], why=UNCH),
    K('18.05', music=MU['A3'], shot_note='face light, one step (M §4 #4)', why=UNCH),
    K('18.06', music=MU['A3'], why='unchanged: "i made it for everyone else." now lands on the line before it'),
    K('19.01', 1.8, music=MU['A3'], caption="The Orb's iris flicks from Mas to the monitor. (No toast.)",
      why='The run enters on the iris flick (C §6), in the lighthouse item\'s slot.'),
    C('19.11', 'R1 / C #4: the Sep 25 lighthouse item was the worst out-of-nowhere stay; its slot goes to the hands runner (C §6).', fix=['R1', 'C #4']),
    C('19.12', 'R1: with the lighthouse item.', fix=['R1']),
    C('19.13', 'R1: with the lighthouse item (the Nozama roast goes; the camp matrix note is in the notes §9).', fix=['R1']),
    N('v31-19.02', '19.01', 3.6, frame="POV · the monitor: SIRRAH's two letters", set='screen', room='dark', chars=['sirrah'],
      caption='On the monitor, chip JUL 12: SIRRAH at a lectern, the A and I blocks waist-high now; the news chyron types under her.',
      onscreen=dict(add=['JUL 12 (the monitor\'s date chip)', '[A] [I]',
                         'VP SIRRAH: "AI is kind of a fancy thing. First of all, it\'s two letters." [H · JUL 12, 2023 · printed, never voiced]']),
      sounds='the monitor down to a murmur and a laugh from her audience', music=MU['A3'],
      art="Sirrah's lectern and the waist-high blocks on the monitor", fix=['B6'],
      why='The hands runner, item 1, held to read.'),
    N('v31-19.03', 'v31-19.02', 9.6, frame='2S·SCR · the hands runner: one held room frame', set='darkroom', room='dark',
      chars=['mas', 'orb', 'nedib', 'remuhcs', 'nole'],
      lines=[
          R('e1-a3-19-01', after='start+4.3', tag='monitor', delivery='from the monitor, pleased with the room'),
          R('e1-a3-19-02', after='e1-a3-19-01', gap=0.5, tag='monitor', delivery='from the monitor, his hand highest'),
      ],
      vo=[V('v31-vo-05', 'after:e1-a3-19-02+0.8')],
      caption=('One held frame: Mas and the Orb at the desk, the monitor large at frame right. Mas holds up two fingers to the Orb; the Orb, '
               'which has no fingers, whirrs. The monitor changes (chip JUL 21): NEDIB unrolls a PINKY PROMISE scroll, seven pinky-prints, '
               'one in NopeAI beige; Mas raises his pinky; the Orb rotates. The monitor changes (chip SEP 13): a room of tiled figures under '
               'REMUHCS\'s question; on his line every hand goes up at once; NOLE\'s is highest; BILLS: 0 in the corner. At the desk, Mas\'s '
               'hand is already up. The Orb rises one pixel. Then he lowers his hand.'),
      onscreen=dict(add=['JUL 21 · PINKY PROMISE · SIGNED: 7 AI COMPANIES [P]', 'SEP 13 · REMUHCS · ASKED THE ROOM: SHOULD GOVERNMENT REGULATE AI? [V]',
                         'BILLS: 0 (egg, zero read load)']),
      sounds='orb_servo on each copy; the monitor\'s own audio for the two real lines', music=MU['A3'],
      art='the pinky-promise scroll and the tiled forum on the monitor at 2S·SCR scale; Mas\'s two fingers, pinky and raised hand',
      fix=['B6', 'M §4 #5', 'C §6'],
      why=('Everyone in power asks to be regulated, in the record\'s words, while he watches: one held room frame (M §4 #5), his face and '
           'hands as the reaction the v2 run lacked. His one line is his stake, not a caption: he asked in May.')),
    K('20.01', music=MU['A3'], jcut=[dict(sound='his keys, under the runner\'s last beat', lead_s=0.5)], why=UNCH),
    K('20.02', music=MU['A3'], why=UNCH),
    K('20.03', music=MU['A3'], why=UNCH),
    K('20.04', music=MU['A3'], onscreen=dict(replace={'UI: GERG · speaker': 'GERG (a video tile in the monitor\'s corner, typing, the green glow)'}),
      caption='Gerg\'s video tile rings up in the monitor\'s corner; Mas takes it without looking away from the counter.',
      fix=['N 10:34'], why='"Where is Gerg?" On the call, on screen, the same device as 2 AM.'),
    K('20.05', music=MU['A3'], why=UNCH),
    K('20.06', 17.0, music=MU['A3'],
      drop={'e1-a3-20-05': 'T3: "Rima\'s going to wake up to forty emails about it." goes (runtime; N 10:34 static hold)'},
      add_lines=[NL('v31-a3-0002', 'gerg', "Okay. That's patched.", after='start+0.7', tag='call',
                    delivery='cheerful, typing', take='cut from e1-a3-20-05 (its first two sentences)')],
      onscreen=dict(replace={'UI: GERG · speaker': 'GERG (video tile)'}),
      fix=['T3', 'N 10:34'], why='A shorter static hold; the night-owl half of the call stays whole.'),
    N('v31-20.07', '20.06', 5.0, frame="POV · the monitor: Neleh's paper", set='screen', room='dark', chars=[],
      caption=('A paper\'s title page on the monitor, a small glowing page icon beside it and footnote numbers orbiting. It scrolls to page 29, '
               'where the words research preview sit in the paper\'s own quotation marks, then to the next paragraph: two small logos side by side, '
               'NopeAI\'s and the lighthouse, and a sentence held to read. The scrollbar\'s thumb shrinks to a sliver as the endnotes load.'),
      vo=[V('v31-vo-06', 'start+0.8')],
      onscreen=dict(add=['RAIL: OCT 2023', 'DECODING INTENTIONS (the title) [V · CSET issue brief, Oct 2023]', 'NELEH (byline plate; her co-authors unnamed)',
                         '"research preview" (p. 29, in the paper\'s own quotes)',
                         '"…exactly the kind of frantic corner-cutting that the release of CHATGTP appeared to spur." [P · the paper, p. 30; name swap only]']),
      music=MU['A3'], art='the paper on the monitor (title page, p. 29-30, the two logos); her icon is the call\'s glowing page',
      fix=['B3', 'N §3 #8'],
      why=('Neleh appears before Act Four as a real beat he reads: her paper, on the record, compares his launch unfavourably with the careful '
           'rival\'s. His line places her on his board and states only a fact. No feeling about her real act is voiced (mas-inner-voice §6); '
           'the reported tension over the paper stays out (facts #36).')),
    N('v31-20.08', 'v31-20.07', 1.2, frame='TWO-SHOT · Mas and the Orb, the paper soft on the monitor', set='darkroom', room='dark',
      chars=['mas', 'orb'], caption='He reads on. The Orb reads him. Nobody says anything.',
      lcut=[dict(sound="the room's air into the order's desk", over_s=0.6)], music=MU['A3'],
      why='The hold is the reaction; the order (OCT 30) follows.'),
    K('21.02', 10.6, music=MU['A3'], drop={'e1-a3-21-03': 'T2 / R5: the second deepfake goes'},
      caption='The signing desk on the monitor: NEDIB, pen raised, over an order that runs off both ends of a very big desk. One cut-paper copy pops up. (No bezel egg: Neleh\'s paper has its own beat now.)',
      fix=['R5'], why='One copy is enough to make the joke; −2.9 s.'),
    K('21.03', music=MU['A3'], onscreen=dict(replace={'DEEPFAKES OF ME: SEEN 2': 'DEEPFAKES OF ME: SEEN 1'}),
      caption='The real NEDIB turns to look at it, pen raised. His stat row updates: SEEN 1 (one copy now).', why='The count follows the one copy left.'),
    K('21.04', 4.4, music=MU['A3'], drop={'e1-a3-21-07': 'U3: a question he answered himself'},
      onscreen=dict(add=['verified: human (the Orb\'s toast, over the real NEDIB)'], replace={'DEEPFAKES OF ME: SEEN 2': 'DEEPFAKES OF ME: SEEN 1'}),
      caption='"which one\'s real?" The Orb\'s iris flicks across the two NEDIBs and settles on the one with the pen; its toast pops over him: verified: human.',
      fix=['U3', 'R3'], why='The witness answers; the toast calls back 18.05.'),
    K('21.05', music=MU['A3'], why=UNCH),
    K('22.01', 9.1, music=MU['A3'],
      caption=('Open for 1 s on the two-shot: Mas at his desk, the keynote on the monitor behind the Orb. Then the POV: DevDay on the monitor, '
               'the odometer climbs through the stage, TASYA walks on laughing. Behind him, the Sydney bubble bobs on its egg-timer chain, silent.'),
      fix=['C #13', 'C §4.1 payoff b'], why='He is at home watching himself; the bubble is a zero-cost Sydney echo.'),
    K('22.02', music=MU['A3'], why=UNCH),
    K('22.03', music=MU['A3'], shot_note='face light, one step (M §4 #4)', why=UNCH),
    K('23.01', music=MU['CLOCK'], why=UNCH),
    K('23.02', music=MU['CLOCK'],
      onscreen=dict(add=['ALYI · NELEH · MADA · THE QUIET VOTE (the calendar\'s own hover names, one per circle as the iris steps)']),
      caption="The invite, now a reminder. As the Orb's iris steps along the four circles, each shows its name, the calendar's own tooltip: ALYI, NELEH, MADA, THE QUIET VOTE. It stops on the black square.",
      fix=['B3', 'N §3 #8'], why='The board is named before Act Four, by the invite itself; "gerg\'s not on it." will pay it.'),
    K('23.03', music=MU['CLOCK'], why=UNCH),
    K('23.04', music=MU['CLOCK'], why=UNCH),
]

# ================================================================= ACT FOUR
MOVE_PLAN = {'from': 'after S1.02 (his side, v3)', 'to': 'after v31-S3.00p (the board\'s side opens on it)'}
SPEC['act4'] = [
    # ---- his side: the blow, as a shock
    K('S1.01', 6.2, music=MU['SUITE'], drop={'v3-vo-17': 'B1: "the race is tomorrow…" goes (N 12:01: the newcomer didn\'t get it)'},
      caption=('The suite over the Strip on race weekend (generic dressing), practice-lap engines far off. The crane truck grinds past; every '
               'glass shivers except his. Held: ordinary life, no voice.'),
      fix=['B1', 'M §4 #1c'], why='No V.O. in the arrival: the calm needs somewhere to fall from. The rail no longer overlaps a V.O. (PLAN §5 polish).'),
    N('v31-S1.01b', 'S1.01', 3.2, frame='TWO-SHOT · Mas and the Orb at the window: a practice lap', set='office', room='suite',
      chars=['mas', 'orb'],
      caption=('A practice lap below. The Orb\'s iris follows one car round the circuit, loses it behind a grandstand, finds it again. Mas watches '
               'the Orb, not the cars, and sips.'),
      music=MU['SUITE'], art='the window 2S with the circuit below (reuses vegas-suite)', fix=['M §4 #1c', 'B1'],
      why='10-15 s of normal life before the JOIN (the mood analysis\'s floor), and the race is in the picture without a line.'),
    K('S1.02', 7.0, music=MU['SUITE'],
      add_lines=[dict(id='v3-vo-18', moved_from='S1.06', vo=True, who='mas', at='start+1.2',
                      text="gerg's not on it. alyi set it up. probably just the budget.",
                      note='the v3 take, unchanged; now the only line before the blow, so we believe it with him (C §2.1 N1)')],
      caption=('His hand nudges the glass one pixel true. The laptop pings: BOARD · VIDEO CALL · JOIN, four small attendee icons under it (a door, a '
               'glowing page, a spinner, a black square), none green. His pointer waits beside JOIN while he thinks it through; then the click.'),
      sounds='the JOIN click at the beat\'s end (as S1.06\'s)', fix=['B1', 'C §2.1 N1'],
      why='S1.06 folds in: the read and the click are one beat now. LEVERAGE comes in low on the click.'),
    M('S1.06', 'S1.02', 'B1: the JOIN insert folds into S1.02 (the V.O. and the click travel with it).', fix=['B1']),
    K('S1.07', 7.2, music=MU['SUITE'],
      onscreen=dict(drop=['NELEH / READ THE CHARTER. LITERALLY.', 'FOOTNOTES: ∞', 'UI: MAS MANALT · OK · Cancel'],
                    add=['each tile\'s own name label: MAS MANALT · ALYI · NELEH · MADA · THE QUIET VOTE']),
      add_lines=[NL('v31-a4-0001', 'alyi', 'Mas. The board has decided that you will no longer lead the company.', after='start+2.4',
                    tag='call', delivery='slow, plain, to Mas\'s tile; the first time these words reach us',
                    take='cut from a5-27-01 (its first sentence); the board\'s side plays the whole take',
                    note='[INVENTED · the public account only: he was told on this call (facts L7)]')],
      caption=('The grid connects: five tiles, each with the call\'s own name label. ALYI\'s doorway tile takes the speaking ring. His words reach us. '
               'On "company." the hotel Wi-Fi drops to one bar and the four board tiles freeze.'),
      fix=['B1', 'N 12:32', 'B5 (speaker id)'],
      why=("The viewer learns it the instant he does. The speaking tile is lit and named. LEVERAGE thins to its pedal under the line (M §4 #1b). "
           "The frozen tiles are his side's truth; the board's side will show the rest of the call.")),
    C('S1.08', 'C §2.2 #3: his eyes moving toward the dialog no longer fit; the dialog is the host\'s, not on his screen.', fix=['C §2.2 #3']),
    N('v31-S1.08d', 'S1.07', 2.4, frame="GFX · HARD CUT: the host's dialog, full frame, bright", set='call', room='suite', chars=[],
      caption=('HARD CUT, bright, full frame, in the 1993 dialog\'s cream and bevel: Remove MAS MANALT from the meeting? and one button, Remove. '
               'Held 1.5 s to read. An arrow pointer tagged ALYI steps onto Remove, one whole-pixel step a beat, and clicks on the downbeat.'),
      onscreen=dict(add=['Remove MAS MANALT from the meeting?', '[ Remove ]', 'ALYI (the pointer\'s tag)']),
      sounds='LEVERAGE back up for the dialog; the click (dialog_ok_click) starts the D6 drop-out',
      music=MU['SUITE'], art='the host dialog in the 1993 look (kits/dialog-1993.ts), text and one button; the ALYI pointer',
      fix=['B1', 'M §4 #1a'],
      why='The literal dialog replaces the Cancel metaphor: a newcomer reads "Remove", and the brightness spike into silence is the jolt.'),
    K('S1.09', 3.3, music=MU['SUITE'], onscreen=dict(drop=['UI: MAS MANALT · OK · Cancel', 'ALYI']),
      caption='Back on his laptop, in the silence: his tile drops out of the grid and comes apart into tokens as it falls. The four close the gap. You\'ve been removed from the meeting.',
      fix=['B1'], why='The drop and the one silence, now after the click we saw.'),
    K('S1.10', music=MU['SUITE'], why=UNCH),
    K('S1.11', music=MU['SUITE'], why=UNCH),
    K('S1.12', music=MU['SUITE'], why='unchanged: "super." and its hold'),
    K('S2.01', music=MU['NIGHT'], why=UNCH),
    K('S2.02', 2.6, music=MU['NIGHT'], caption="The three marks from above. The Orb's eye-light steps onto mark 1, then 2, then 3, and stops on his thumb.",
      fix=['M §4 #11'], why='S2.04 folds in; the flash goes.'),
    C('S2.03', 'M §4 #11 / R11: the TPOOL flash goes. The newcomer couldn\'t place it; the two old marks already say "this has happened before" (the season withholds them).', fix=['M §4 #11', 'R11']),
    M('S2.04', 'S2.02', 'M §4 #11: the light\'s last steps fold into S2.02.', fix=['M §4 #11']),
    K('S2.05', music=MU['NIGHT'],
      caption="The Orb's iris lifts from his thumb to his face. Toast: rewinding… A whip, right to left, onto Neleh's desk, earlier that day.",
      jcut=[dict(sound="Neleh's office clock ticking under the whip", lead_s=0.6)], fix=['C §2.1 N3', 'M §4 #6'],
      why='The rewind lands on a place, not a diagram.'),
    # ---- the board's side
    N('v31-S3.00p', 'S2.05', 4.6, frame="HIGH → OTS · Neleh's desk, 11:52: Mada has joined early", set='office', room='office',
      chars=['neleh', 'mada'],
      caption=('INT. NELEH\'S DESK — FRIDAY, 11:52 AM. The whip lands on her desk from above: her laptop\'s call open, its clock at 11:52; one tile '
               'has joined early, MADA\'s spinner turning; the other slots waiting. Beside the laptop, the blueprint unfolded, her pen on it. '
               'She leans over it. Push into the paper; its linework lifts and comes alive.'),
      lines=[NL('v31-a4-0002', 'neleh', 'Once more, before the others join.', after='start+2.0',
                delivery='to Mada\'s tile, pen on the sheet; brisk, fond of procedure: she reads everything once more',
                note='[INVENTED] (C §2.1 N3a)')],
      onscreen=dict(add=['11:52 (the call\'s clock)', 'NELEH / READ THE CHARTER. LITERALLY. (her card, moved from S1.07)', 'FOOTNOTES: ∞']),
      music=MU['PLAN'], art='Neleh\'s desk from above with the blueprint and the laptop call at 11:52 (reuses neleh-desk + blueprint)',
      fix=['B1', 'C §2.1 N2/N3/N3a', 'M §4 #6'],
      why='The board\'s side opens as her prep minutes before noon: a real place and a reason to recite the plan to a fellow director.'),
    K('S1.03', 11.75, moved=MOVE_PLAN, music=MU['PLAN'],
      onscreen=dict(replace={'GERG / CO-FOUNDER': 'GERG / CHAIR'}),
      caption="THE PLAN, her document: her blueprint figure steps out of her own NELEH chair outline on her first line. Three chairs walk off; a ring draws round the four.",
      fix=['B1', 'N 14:30'],
      why='Moved to open the board\'s side. GERG / CHAIR plants "just not the chair" (facts L8: he stepped down as chairman).'),
    K('S1.04', 9.5, moved=MOVE_PLAN, music=MU['PLAN'],
      caption="The investor's key ring gets VOTES: 0; the CEO box gets EQUITY: 0. Mada's \"Good question.\" comes from his tile on her laptop: he is the one who joined early.",
      fix=['C §2.1 N3a'], why='Moved; Mada being early motivates his line.'),
    K('S1.05', 2.8, moved=MOVE_PLAN, music=MU['PLAN'],
      caption='The four step onto a numbered path: 1. NOON · VIDEO CALL, and it runs on under a fold. Pull back out of the linework to the paper on her desk, her pen resting on step 1. (No tear into the suite.)',
      fix=['C §2.1 N4'], why='Moved; ends on her desk, so 11:59 follows on naturally.'),
    K('S3.00a', 15.2, music=MU['PROC'],
      caption=('11:59. The others join; Waiting for MAS MANALT to join…; his tile connects, perfectly still. ALYI\'s doorway tile takes the speaking ring, '
               'and his words come again, whole this time. The clock ticks to 12:00.'),
      shot_note="Alyi's tile lit on his lines (speaker id); the arrival is ~0.3 s now (we are already at her desk)",
      fix=['C §2.1 N4', 'M §4 #8', 'C §2.2 #5'],
      why='Alyi\'s line heard twice, once per side, verbatim; the arrival and the wondering beat trimmed (−4.8 s; the wondering beat keeps 1 s).'),
    K('S3.01', 4.0, music=MU['PROC'],
      onscreen=dict(replace={'MAS MANALT was removed from the meeting.': 'ALYI removed MAS MANALT from the meeting.'}),
      caption="The same Remove from their side: in Alyi's tile his reflection's hand moves, once. His tile goes; the call's notice. The lit audio chip stays. Tinny, out of it: \"super.\" Nobody looks up.",
      fix=['C §2.2 #1'], why='The board\'s side shows the same click (no contradiction with the literal dialog).'),
    K('S3.02', music=MU['PROC'], why=UNCH),
    K('S3.03', 14.0, music=MU['PROC'], fix=['M §4 #8', 'N 13:37'], why='The blog\'s hold after "Any objections?" trimmed (−1.5 s).'),
    K('S3.04', 15.2, music=MU['PROC'],
      drop={'a5-27-10': 'M §4 #8: the appointment grid 19 s → about 15 s', 'a5-27-11': 'M §4 #8: with "For how long?"'},
      fix=['M §4 #8'], why='The static grid shortened; "What should I tell them?" (her launch-night question) stays.'),
    K('S3.04b', music=MU['PROC'], drop={'a5-27-17': 'U4: "More. Soon." read as a written echo'},
      add_lines=[NL('v31-a4-0003', 'rima', "We'll say we will.", after='a5-27-16', gap=0.5, tag='O.S.',
                    delivery='on the call, unhurried, pragmatic: the answer plays on Neleh\'s face')],
      shot_note='face light on Neleh, one step (M §4 #4)', fix=['U4'], why='Her pragmatism, spoken.'),
    K('S3.06', music=MU['PROC'], why=UNCH),
    K('S3.07', music=MU['PROC'], shot_note='face light on Alyi (M §4 #4)', why='unchanged (a sincere beat; kept whole)'),
    K('S3.05', 10.1, music=MU['PROC'], onscreen=dict(replace={'POST: GERG: “…I quit.”': 'POST: GERG: “…i quit.”'}), fix=['M §4 #8', 'facts L5'], why='Neleh\'s line starts 0.5 s sooner; "Gerg has never waited to be asked." still plants his V.O. at 2 AM.'),
    K('S4.01', music=MU['PROC'], why=UNCH),
    K('S4.02', 18.9, music=MU['PROC'],
      caption=('The boardroom at night, held on the wide through Neleh\'s two turns, the phones buzzing and stepping. The first phone goes over: clack. '
               'CUT to Alyi\'s reflection in the dark window for his line, so it is his.'),
      shot_note='coverage: the wide for Neleh (standing, lit, speaking); an MCU·glass cutaway on Alyi\'s reflection for "That is the company telling us." (N 14:45); then S4.07',
      fix=['N 14:45', 'B5'], why='The speaker of each line is legible; the phones with STAFF / INVESTORS are what "the company" means.'),
    K('S4.07', music=MU['PROC'], shot_note='face light on Neleh (M §4 #4)', why=UNCH),
    K('S4.08', 19.8, music=MU['PROC'], drop={'a5-27-30': 'M §4 #8: tightened ("I\'ll be direct. The board is offering" becomes one move)'},
      add_lines=[NL('v31-a4-0017', 'neleh', "Mario, it's Neleh, from the NopeAI board. We'd like to offer you the job of CEO, and to discuss a merger.", after='start+1.5',
                    delivery='into the speakerphone; polite, a cold call', note='[INVENTED · the merger talks are confirmed (research gaps §2 #9); the CEO approach is reported, so it lives only in her line]')],
      fix=['M §4 #8'], why='The board\'s own step four (a new CEO and a merger) tried and refused; the ring\'s arrival and her line tightened (−2.1 s).'),
    K('S4.09', 15.5, music=MU['PROC'],
      drop={'a5-27-35': 'B4: its first sentence goes; its second is v31-a4-0005'},
      add_lines=[
          NL('v31-a4-0004', 'neleh', 'The staff want him back. The investors want him back.', after='start+1.4',
             delivery='tired, factual, reading the phones, not the room', note='[INVENTED · the reported pressure, Nov 18-19 (facts, the v3.1 rows)]'),
          NL('v31-a4-0005', 'neleh', "We've talked all day about him coming back, and we're no closer.", after='v31-a4-0004', gap=1.0,
             delivery='watching the small figure on the camera', take='cut from a5-27-35 (its second sentence)'),
      ],
      caption=('INT. NOPEAI BOARDROOM — SUNDAY. The table in the foreground: the phones, picked up and set in a row, face up, still buzzing: '
               'STAFF · STAFF · INVESTORS · INVESTORS. On the wall screen, the lobby camera, and under it a news ticker crawling. '
               'At reception, a familiar figure in a GUEST lanyard; his post in the tile\'s corner. On "here" he walks out.'),
      onscreen=dict(add=['STAFF · STAFF · INVESTORS · INVESTORS (the phones)', "INVESTORS PUSH TO BRING MANALT BACK (the wall screen's ticker) [H · NOV 18, 2023]"]),
      art='the phones in a row on the table in the foreground; the ticker strip under the CCTV tile',
      fix=['B4', 'N §3 #9', 'M §4 #8'],
      why=('The reversal on screen before "we\'ve talked all day about him coming back": after Mario\'s no, the pressure from the staff and the '
           'investors lands on the table, and she says it. (The staff letter itself is Monday; it lands on the board in the avalanche, S6.01.)')),
    K('S4.10', 4.3, music=MU['PROC'], onscreen=dict(replace={'TTEMME': 'TTEMME / INTERIM CEO, TAKE TWO · CHAT: LIVE (2-TONE card, 1 beat, on the spotlight\'s landing)'}),
      fix=['N §3 #10', 'B5'], why='Ttemme gets a descriptor card, like every other newcomer.'),
    K('S4.10b', 14.45, music=MU['PROC'],
      shot_note='"Okay." is the pointed non-answer: he closes the folder, holds Neleh\'s eye a beat, and takes the job; we never see a page',
      why='unchanged lines; the folder\'s read shortened (−0.8 s); the non-answer is played, not explained (the folder stays sealed, X9)'),
    K('S4.11', 2.0, music=MU['PROC'], drop={'a5-27-43': 'M §4 #8: its echo ("For how long?") is cut with S3.04\'s'},
      caption='Desk level: he sets the hourglass down and flips it; the sand starts. His chat panel scrolls.', fix=['M §4 #8'], why='The hourglass says "for how long" by itself.'),
    K('S4.12', music=MU['PROC'], why=UNCH),
    K('S4.13', 5.7, music=MU['PROC'], fix=['M §4 #8'], why='His greeting starts 1 s sooner; the statement runs on as before.'),
    K('S4.13d', music=MU['PROC'], why=UNCH),
    K('S4.13e', music=MU['PROC'], why=UNCH),
    K('S4.14', 2.7, music=MU['PROC'], drop={'a5-27-46': 'N 16:32: the question now names its addressee'},
      add_lines=[NL('v31-a4-0006', 'neleh', 'Step four, Mada?', after='start+1.0', tag='O.S.', delivery='the one question put straight to him')],
      fix=['N 16:32'], why='Mada\'s silent close-up now answers a question put to him by name.'),
    K('S4.15', music=MU['PROC'], shot_note='face light on Mada (M §4 #4)', why=UNCH),
    # ---- his side again: 2 AM, his moves
    K('S5.02', music=MU['AM2'], why=UNCH),
    K('S5.03', music=MU['AM2'], why='unchanged: the count is the first inner voice since the board\'s side'),
    K('S5.04', music=MU['AM2'], why=UNCH),
    K('S5.05', music=MU['AM2'], shot_note='face light (M §4 #4)', why=UNCH),
    K('S5.09', 15.8, music=MU['AM2'], drop={'a5-29-05': 'B2: Mas calls Gerg now; "that\'s not why I called" can\'t stand'},
      add_lines=[
          NL('v31-a4-0007', 'gerg', 'Best time there is. Nobody else is pushing anything.', after='a5-29-04', gap=0.4,
             delivery='typing, cheerful', take='cut from a5-29-05 (its first two sentences)'),
          NL('v31-a4-0008', 'mas', 'read me the letter.', after='v31-a4-0007', gap=0.6,
             delivery='plain, quiet; the one thing he asks anyone for in Act Four'),
          NL('v31-a4-0009', 'gerg', 'Okay. Pull it up.', after='v31-a4-0008', gap=0.8,
             delivery='his keys stop for half a beat first; then gently, for once'),
      ],
      caption=('Over his shoulder onto the monitor: he puts the phone down on the flood, opens the call app and clicks GERG. It rings out. '
               'Gerg\'s tile opens, typing, the green glow under his chin.'),
      fix=['B2', 'U7'],
      why=("His first move: he calls (the prediction still pays: \"Sorry, one sec. I've got a build compiling.\"). And he asks: \"read me the letter.\" "
           "It motivates Gerg reading aloud, and it is the want underneath (to be asked, and to ask) showing once.")),
    K('S5.06', music=MU['AM2'],
      onscreen=dict(replace={'“…unable to work for or with people that lack competence, judgment and care for our mission and employees.”':
                             '“…unable to work for or with people that lack competence, judgement and care for our mission and employees.”'}),
      line_text_fix={'a5-29-06': 'judgment → judgement (facts L1); the take stands (a homophone)'},
      caption='He pulls it up: the letter slides over, Gerg\'s tile to the corner. Gerg reads as each line scrolls; the count rolls to 745; the scroll stops on ALYI.',
      fix=['facts L1'], why='unchanged reading; the page follows the record\'s spelling'),
    K('S5.07b', music=MU['AM2'], shot_note='face light (M §4 #4)', why='unchanged: "alyi voted." / "He did both." and the hold'),
    K('S5.08', music=MU['AM2'], drop={'a5-29-15': 'N 17:35: "share sale" was unexplained'},
      add_lines=[NL('v31-a4-0010', 'gerg', "That's the share sale. Everybody was about to get paid.", after='start+1.3', tag='monitor',
                    delivery='he can hear the slot; matter-of-fact, then the stamp lands on "paid"')],
      fix=['N 17:35'], why='A newcomer learns what the check is before the stamp says it\'s void.'),
    K('S5.09-back', 5.4, music=MU['AM2'],
      drop={'v3-vo-22': 'B7: of the two 2 AM V.O. lines, this is the one that goes', 'v3-vo-23': 'moved to S5.09b (it now sits on Gerg\'s question)'},
      caption='"what are you building?" Gerg, typing: "The company. Again. Just in case." His keys stop.',
      fix=['B7', 'U5'], why='The keys stopping lands straight off "Just in case." (U5).'),
    K('S5.09b', 8.4, music=MU['AM2'], drop={'a5-29-19': 'B2 / N: "ask me when it compiles." was a sideways non-answer (and the fourth "compiles")'},
      add_lines=[
          dict(id='v3-vo-23', moved_from='S5.09-back', vo=True, who='mas', at='after:a5-29-18+0.6',
               text='gerg never waits to be asked.', note='the v3 take, unchanged (B7: keep it)'),
          NL('v31-a4-0011', 'mas', 'keep building.', after='v3-vo-23', gap=0.5,
             delivery='quiet, certain, looking back at him: an instruction, the first he gives in Act Four'),
      ],
      caption=('His tile fills the monitor. He looks up into his camera, at Mas, and holds: "So. Do I tell everyone to pack?" A beat. '
               '"keep building." Gerg holds the look a beat longer, then types again.'),
      fix=['B2', 'B7', 'C U5'],
      why=('The bible\'s planted line now turns instead of explaining the joke: the man who never waits to be asked is waiting, for once, '
           'for Mas\'s word. And Mas gives one: a choice about Gerg\'s invented fallback, which states nothing about where anyone goes.')),
    K('S5.11', 14.8, music=MU['AM2'],
      add_lines=[
          NL('v31-a4-0012', 'mas', 'and the rent?', after='a5-29-22', gap=1.2, take='reuse e1-a1-9-05 (the same line, Act One\'s take)',
             delivery='not turning; the same three words as the lobby, but this time before he has stepped on anything'),
          NL('v31-a4-0013', 'tasya', 'Due on the first.', after='v31-a4-0012', gap=0.5, tag='O.S.',
             delivery='a warm laugh in it, pleased with the question, from the other side of the door'),
      ],
      caption='The slate door steps up out of the shadow, Tasya\'s sign on it. His voice: "Everyone is welcome." / "everyone." / "…a desk for every one of them." The crack of desks. "and the rent?" "Due on the first."',
      fix=['B2', 'N §1'],
      why='What he says to Tasya is a move: in January he stepped on first and asked after; now he asks the price and doesn\'t step through.'),
    K('S5.12', music=MU['AM2'], why='unchanged: "leave it open." is his choice (the door kept open), with no inner voice (a contested moment)'),
    K('S6.01', music=MU['AVA'], onscreen=dict(add=['STAFF LETTER · TO THE BOARD (the header strip on the first tile to land)']),
      fix=['C §1 #42', 'B4'], why='The first tile carries the letter\'s header, so the avalanche reads as the letter landing on the board.'),
    K('S6.02', music=MU['AVA'], why=UNCH),
    K('S6.03', music=MU['AVA'], why=UNCH),
    K('S6.04', music=MU['AVA'], why=UNCH),
    K('S6.06', music=MU['AVA'], why=UNCH),
    K('S7.01', 18.6, music=MU['RET'], fix=['R (runtime)'], why='The post\'s read tightened (−1.2 s); the talk about the hearts unchanged.'),
    K('S7.02', music=MU['RET'], shot_note='Tasya is the only figure moving and facing Mas, mouth lit on his line; the staff stand still (N 18:50 speaker id)', why=UNCH),
    K('S7.02b', music=MU['RET'], why=UNCH),
    K('S7.03', 2.8, music=MU['RET'], drop={'a5-30-07': 'U6: "Hello." greeted nobody'},
      add_lines=[NL('v31-a4-0014', 'tasya', 'Down here.', after='start+1.1', tag='O.S.', delivery='from the floor under him, warmly')],
      fix=['U6', 'N 19:04'], why='It answers his look at the floor.'),
    N('v31-S7.03b', 'S7.03', 2.6, frame='ECU · his phone by the two badges: Tuesday\'s invite', set='bullpen', room='bullpen', chars=[],
      caption=('His end desk: beside the GUEST lanyard and the MACROSOFT badge, his phone lights with an invite in the cold open\'s calendar UI: '
               'Board · Tue 10:00 PM, Accept / Decline, three attendee circles (a spinner, a fire helmet, a blank). His thumb taps Accept, no hover.'),
      onscreen=dict(add=['Board · Tue 10:00 PM', 'Accept  Decline', '(three circles: a spinner, a fire helmet, a blank)']),
      jcut=[dict(sound="the fires' crackle under the tap", lead_s=0.6)], music=MU['RET'],
      art='the invite on his phone (kits/phone-invite.ts) with the three circles', fix=['C #6'],
      why='Tuesday\'s burning boardroom gets a reason, and rhymes Friday\'s invite: this time he accepts looking at it.'),
    K('S7.05', music=MU['RET'], why=UNCH),
    K('S7.06', 4.2, music=MU['RET'],
      caption=('The door bangs open: TERB, a red extinguisher held like a briefcase. He aims it at the nearest fire and squeezes: click, nothing, the pin '
               'is in. He frowns at it. FREEZE: his card. Mas, in colour through the freeze, walks past, pulls the pin, and pockets it. The room unfreezes.'),
      sounds='the dry click of a pinned extinguisher before the freeze',
      fix=['B2', 'N 19:07'], why='His small scheme made legible: the new chair\'s tool works because Mas made it work.'),
    K('S7.06-cont', music=MU['RET'], why=UNCH),
    K('S7.07', music=MU['RET'], why=UNCH),
    C('S7.07b', 'R6: the Other Yrral\'s nod goes (an insider egg; Terb still reads his name).', fix=['R6']),
    K('S7.07-cont', 16.3, music=MU['RET'],
      add_lines=[
          NL('v31-a4-0015', 'mas', 'gerg comes back too.', after='a5-30-13', gap=0.6, delivery='to Terb, level: not a question'),
          NL('v31-a4-0016', 'terb', 'Gerg comes back too.', after='v31-a4-0015', gap=0.4, delivery='writing it onto the sheet, not looking up'),
      ],
      caption='"you\'re staying?" Terb answers for Mada. "we\'ll stand." Then his one term: "gerg comes back too." Terb writes it in. The review. "of what?" The music drops out. Mada.',
      fix=['B2'],
      why='His terms, visible: he gives up the board seat and asks for Gerg. Gerg\'s real "Returning to NopeAI…" post (S7.09) pays it.'),
    K('S7.08', music=MU['RET'], shot_note='face light (M §4 #4)', why=UNCH),
    K('S7.09', music=MU['RET'], why='unchanged: the calm-off\'s long hold; Mada\'s nod; Gerg\'s post'),
    K('S7.13', 6.0, music=MU['RET'], drop={'a5-30-18': 'R7: the catchphrase button goes'}, fix=['R7'], why='The post and the shatter stay.'),
    K('S8.01', music=MU['RET'], why=UNCH),
    K('S8.03', music=MU['RET'], onscreen=dict(replace={'UI: OK  ·  Cancel': 'Remove MAS MANALT from the meeting?  [ Remove ] (greyed, one dither step a beat)'}),
      caption='Over his shoulder: the host\'s dialog once more, Remove MAS MANALT from the meeting?, and Remove greys out one dither step a beat. The pointer with an empty name tag clicks it. Bonk. The dialog shakes, refused.',
      fix=['C §2.2 #2', 'M §4 #7'], why='The return\'s irony points at the dialog the viewer saw at noon.'),
    K('S8.04', music=MU['RET'], why=UNCH),
    K('S8.05', music=MU['RET'], why=UNCH),
    K('S8.06', music=MU['CODA'], why=UNCH),
    K('S8.07', 9.0, music=MU['CODA'], fix=['M §4 #12'], why='Air trimmed after Gerg walks out (−0.9 s).'),
    K('S8.08', music=MU['CODA'], why=UNCH),
    K('S8.09', music=MU['CODA'], why=UNCH),
    C('S8.09b', 'R12 / M §4 #12: the shut door goes, so the film ends once, not twice.', fix=['R12', 'M §4 #12']),
    K('S8.10', music=MU['CODA'], why=UNCH),
]

# ================================================================= TAG
SPEC['tag'] = [
    K('32.01', 3.2, music=MU['TAG'], onscreen=dict(add=['RAIL: DEC 6, 2023']),
      caption='Mas and the Orb at the desk, three marks in the wood now. On the monitor behind them a video starts on its own: a bright colour field.',
      fix=['B9', 'C §6'], why='The rail moves here (the demo and the cover are both DEC 6); the monitor motivates the insert.'),
    N('v31-32.01d', '32.01', 8.6, frame="POV → NATIVE · ELGOOG's demo film (the Runway insert)", set='screen', room='darkroom', chars=[],
      style='NATIVE (near-photoreal, objects only) inside the monitor, stepping back to BASE pixels on the bezel',
      caption=('Push into the monitor, and the picture goes native: ELGOOG\'s product film. The wordmark on a colour field; a line drawing of a duck '
               'drawn by nothing, filling into a real toy duck on a turntable; the film\'s own LIVE chip. On the smooth turn, the demo\'s own voice. '
               'Then it stutters: held frames, the LIVE chip drops, and it is stills. Its last still steps back into pixels on the monitor\'s bezel.'),
      lines=[NL('v31-tg-0001', 'elgoog-demo', 'What the quack!', after='start+4.6', tag='monitor',
                delivery='the demo\'s own product voice, bright and surprised; a stock voice cast for the film, never a clone of anyone',
                note='[V · DEC 6, 2023 · the demo video\'s own line (facts §B "(demo)"); played as the film\'s sound, not a character\'s]')],
      vo=[V('v31-vo-07', 'start+7.0')],
      onscreen=dict(add=['ELGOOG (the film\'s own wordmark, parody colours)', 'LIVE (the film\'s own chip, off at the stutter)'], drop=[]),
      sounds='the film\'s own bright bed under the turn; the audio stutters with the picture, then silence on the stills',
      music=MU['TAG'], art='studio/src/dev/genvideo/runway/insert.py (the v31-runway pass): the film, the transitions, elgoog-demo-timing.json',
      fix=['B9'],
      why=('The rival\'s launch, the same week as his cover: a slick demo that turns out to be stills (the record: Google said it prompted the model '
           'with still frames and text). No caption; one flat read from a man who makes demos.')),
    K('32.02', music=MU['TAG'], onscreen=dict(drop=['RAIL: DEC 6, 2023']), why='The rail moved to 32.01.'),
    K('32.03', music=MU['TAG'], why=UNCH),
    K('32.04', music=MU['TAG'], why=UNCH),
    K('32.05', 2.6, music=MU['TAG'], drop={'e1-tg-32-01': 'U8: "close." was ambiguous'},
      add_lines=[NL('v31-tg-0002', 'mas', 'that was close.', after='start+0.7', delivery='to the cover, not the Orb; grading it')],
      fix=['U8'], why='The Orb\'s slower verdict, named.'),
    K('32.07', 3.5, music=MU['TAG'], why='The pinning and the framed lanyard, a little quicker (−0.75 s).'),
    K('33.01', music=MU['TAG'], caption='THUD. A newspaper drops flat onto the desk from above. The room shakes 2 px; the phone, the keys and the Orb hop. (No band text.)',
      fix=['B8'], why='The lit-UI band\'s text goes, as at launch night.'),
    K('33.02', music=MU['TAG'], onscreen=dict(drop=['[ a newspaper, front page up ]']), fix=['B8'],
      why='The reel\'s stand-in label goes with the band; the drawn page carries itself.'),
    K('33.04', music=MU['TAG'], why=UNCH),
    K('33.05', music=MU['TAG'], why=UNCH),
]

# ================================================================= build + validate
def srcbeats(seg):
    return collections.OrderedDict((b['id'], b) for b in TL[seg]['beats'])

def build(seg):
    src = srcbeats(seg)
    seen = collections.Counter()
    out = []
    errors = []
    for e in SPEC[seg]:
        e = dict(e)
        bid = e['id']
        act = e['action']
        if act == 'new':
            if bid in src:
                errors.append(f'{seg}: new beat {bid} collides with a source id')
            for k in ('frame', 'set', 'chars'):
                if k not in e:
                    errors.append(f'{seg}: new beat {bid} lacks {k}')
            e.setdefault('lines', [])
            e['lines'] = [dict(l) for l in e['lines']]
            if e.get('after') is None:
                e.pop('after', None)
            e.pop('first', None)
            out.append(e)
            continue
        if bid not in src:
            errors.append(f'{seg}: {bid} not in the v3 lock')
            continue
        seen[bid] += 1
        b = src[bid]
        e['src_s'] = round(b['reelDur'], 3)
        e['src_frame'] = b.get('frame')
        if act == 'keep':
            if e.get('est_s') is None:
                e['est_s'] = round(b['reelDur'], 2)
            drop = e.pop('drop', {}) or {}
            add = e.pop('add_lines', []) or []
            ids = [l['id'] for l in b.get('lines', [])]
            for d in drop:
                if d not in ids:
                    errors.append(f'{seg} {bid}: dropped line {d} is not in the beat')
            lines = []
            for l in b.get('lines', []):
                if l['id'] in drop:
                    lines.append(dict(id=l['id'], keep=False, who=l['who'], text=l['text'], why=drop[l['id']]))
                else:
                    ent = dict(id=l['id'], keep=True)
                    if l.get('tag') == 'V.O.':
                        ent['vo'] = True
                    lines.append(ent)
            for a in add:
                lines.append(dict(a))
            e['lines'] = lines
        elif act in ('cut', 'merge'):
            e['est_s'] = 0.0
            if act == 'merge' and e['into'] not in src:
                errors.append(f'{seg} {bid}: merge target {e["into"]} not in the lock')
            ls = b.get('lines', [])
            if ls:
                e['lines'] = [dict(id=l['id'], keep=False, who=l['who'], text=l['text'],
                                   why=('moves with the merge' if act == 'merge' else 'cut with the beat')) for l in ls]
        e.setdefault('fix', [])
        out.append(e)
    for bid in src:
        if seen[bid] != 1:
            errors.append(f'{seg}: source beat {bid} appears {seen[bid]} times')
    # every add-line "after" must name a line that exists in the beat (or start±S)
    for e in out:
        known = {l['id'] for l in e.get('lines', [])}
        for l in e.get('lines', []):
            a = l.get('after')
            if a and not str(a).startswith('start') and a not in known:
                errors.append(f'{seg} {e["id"]}: line {l["id"]} is placed after unknown {a}')
        for v in e.get('vo', []):
            at = v['at']
            if at.startswith('after:'):
                ref = at[6:].rsplit('+', 1)[0]
                if ref not in known:
                    errors.append(f'{seg} {e["id"]}: V.O. {v["id"]} is placed after unknown {ref}')
    story_src = round(sum(b['reelDur'] for b in src.values()), 2)
    story_est = round(sum(e['est_s'] for e in out if e['action'] in ('keep', 'new')), 2)
    doc = collections.OrderedDict(
        segment=seg, source=SRC[seg],
        _about=('v31-script beat plan (PLAN §2 format), written against the v3 lock\'s beat and line ids. Every v3 beat appears once (keep, cut, '
                'merge, or keep with "moved"), plus the new beats; beats are listed in their v3.1 order. est_s is a planning length from word '
                'counts and the takes on file, never a measurement. Kept lines are keep true/false; new and changed lines carry v31-<seg>-NNNN ids; '
                'new V.O. carries v31-vo-NN ids; kept v3 V.O. stays in lines with "vo": true; restored v2 lines keep their v2 ids with '
                '"restored": true and the take path. vo.at = "start+S" | "after:<line id>+S". '
                'Subtitles: spoken real lines show without quotation marks or print ellipses (N 0:05); posts and printed matter keep theirs. '
                'Every call grid lights and names its speaking tile (B5). The lit-UI band prompt in the bottom letterbox never appears (B8); rails and the V.O. line keep their places. '
                f'The script is {SCRIPT}; the notes are {NOTES}; the builder is _build_v31.py (edit its spec and re-run, don\'t hand-edit).'),
        story_s=dict(source=story_src, estimate=story_est),
        beats=out)
    return doc, errors

def fmt(s):
    m, x = divmod(s, 60)
    return f'{int(m)}:{x:04.1f}'

def main():
    write = '--write' in sys.argv
    tot_src = tot_est = 0
    allerr = []
    docs = {}
    for seg in SEGS:
        doc, err = build(seg)
        docs[seg] = doc
        allerr += err
        tot_src += doc['story_s']['source']
        tot_est += doc['story_s']['estimate']
    print(f'{"segment":10} {"v3 lock":>9} {"v3.1 est":>9} {"change":>8}')
    for seg in SEGS:
        s, e = docs[seg]['story_s']['source'], docs[seg]['story_s']['estimate']
        print(f'{seg:10} {fmt(s):>9} {fmt(e):>9} {e - s:+8.1f}')
    print(f'{"story":10} {fmt(tot_src):>9} {fmt(tot_est):>9} {tot_est - tot_src:+8.1f}')
    # the V.O. map, in episode order (kept v3 + new)
    print('\nV.O. in episode order:')
    n = 0
    words = 0
    for seg in SEGS:
        for e in docs[seg]['beats']:
            if e['action'] not in ('keep', 'new'):
                continue
            items = []
            for l in e.get('lines', []):
                if l.get('vo') and l.get('keep', True) is not False:
                    tl = next((x for b in TL[seg]['beats'] for x in b.get('lines', []) if x['id'] == l['id']), None)
                    items.append((l['id'], (tl or l).get('text')))
            for v in e.get('vo', []):
                items.append((v['id'], v['text']))
            for vid, text in items:
                n += 1
                words += len(text.split())
                print(f'  {n:2d} {seg:6} {e["id"]:12} {vid:10} {text}')
    print(f'  {n} lines, {words} words')
    print('\nNew or changed spoken lines (takes needed):')
    for seg in SEGS:
        for e in docs[seg]['beats']:
            for l in e.get('lines', []):
                if l.get('new') or l.get('restored'):
                    tag = 'restored' if l.get('restored') else 'new'
                    print(f'  {seg:6} {e["id"]:12} {l["id"]:13} {tag:8} {l["who"]:11} {l["text"]}  [{l.get("take")}]')
    if allerr:
        print('\nERRORS:')
        for x in allerr:
            print('  ' + x)
        sys.exit(1)
    print('\nvalidation: OK (every v3 beat once; every dropped line exists; every placement resolves)')
    if write:
        os.makedirs(OUTDIR, exist_ok=True)
        for seg in SEGS:
            with open(f'{OUTDIR}/{seg}.json', 'w') as f:
                json.dump(docs[seg], f, indent=1, ensure_ascii=False)
                f.write('\n')
        print(f'wrote {len(SEGS)} files to {OUTDIR}')

if __name__ == '__main__':
    main()
