#!/usr/bin/env python
"""Ep1 Act Two (sc 13-17) stick reel v2: set the recording plan from fastrec's draft.

  PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
  HF_HUB_OFFLINE=1 $PY $T plan --seg act2 --out <scratch>/plan-draft.json
  $PY audio/reel/ep01-act2-v2/set_plan.py <scratch>/plan-draft.json      -> audio/ep01/act2/dialogue/lines-plan-v2.json

`fastrec plan` drafts rows from the script's speaker blocks with placeholder speeds, gaps and devices. This sets them
for the stick reel (the ep1s-act2 pass, 2026-09-26):

  * say:   pauses where the script's punctuation or parenthetical asks for one ({s} = total pause at that word
           boundary, opened in room tone inside the one read); GTP read as letters (naming.md: products are letter
           swaps, "chat-G-T-P"); the clone's real quote recorded landing on "regulation" (the script's trim note);
           Mas's lowercase subtitles capitalised for the reader only (the text keeps house style).
  * speed: inside each speaker's band (audio/voices/cast.json bands, lines_v5.BANDS), nudged by the parenthetical
           (quick, pleasantly, quietly, stamping furiously ...).
  * gap_before_s: the reply gap the timeline builder lays (quick 0.2-0.6 s, loaded 0.7-1.2 s). null = the line
           follows picture; build_timeline.py places it from the shot.
  * takes: 2 for the lines that carry a scene (flag), 1 for the rest.
  * pace revisions: r2 (01:08, 2026-09-27) slowed 13-02, 13-08 and 13-14 after the first takes; r3 (the ep1s-act2
           pass's second session, 01:20) slowed the five lines whose takes ran far over their speaker's guide (13-11,
           13-15, 15-06, 15-12, 17-06), each to the band's floor or just under it (QA allows band -0.05), with the
           script's own comma or full stop opened a little; r4 (01:21) took three of them (13-11, 13-14, 13-17) a
           step further, made 15-03's "Don't mind me." its own read, and gave 15-09 two takes for its ASR miss.
           r5 (01:24) re-read 15-03 as three whole reads and opened 15-09's comma. Each row's plan_note says what
           changed.
  * r6, the Act Two FIXER pass (2026-09-27, from the newcomer, insider and audit reads of ep01-full-v2): three
           script lines reworded (13-02 "Any questions, …", 13-04 "Is it just the one?", 15-09 "Speaking for
           myself, a little."), 13-15's "Longer." made its own read, and the clone's three lines (15-01, 15-08, 15-13)
           re-read because cast.json's lahtnemulb-clone gained pitch_add 2.0 (the key includes the chain, so fastrec
           re-reads them by itself). The question tests behind 13-02 and 13-04 are in act2-notes.md section 10.
  * RENAME keeps the ids stable when a reworded line no longer matches its old text closely enough for
           `plan --prev` (difflib < 0.6): the draft's new id is mapped back to the line's old id. Once this plan
           is written, the next `plan --prev` matches the new text to the old id by itself.
  * `--out F` writes somewhere else (a dry run to compare); the default is the plan file above.
  * dropped: e1-a2-16-01, Mas's post "...no plans to leave" [H]: the script says nothing in sc 16 is voiced (headline
           fragments go on screen only). It stays in the timeline as an on-screen post.
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
OUT = os.path.join(ROOT, 'audio/ep01/act2/dialogue/lines-plan-v2.json')
MAS_IPA = '[Mas](/mˈɑs/)'

# id: (say, speed, gap_before_s, flag, note)
SET = {
    # ---- sc 13, the White House
    'e1-a2-13-01': ('What can be, unburdened by what has been{0.55} trained.', 0.95, None, False,
                    'the teacher; a held beat before "trained" (the script\'s ellipsis)'),
    'e1-a2-13-02': ('Any questions,{0.15} before we take the picture?', 0.95, None, False,
                    'O.S. at the blocks; opens the 2S (r2, 01:08: 0.97 -> 0.95 and a comma pause; take 1 ran 188 wpm; '
                    'r6: "Any" added in the script, since the take of "Questions, before..." fell like a statement; the '
                    'r6 test read of this say transcribed with its "?")'),
    'e1-a2-13-03': ('I have one concern.', 1.03, 0.35, False, 'finger fully up; eager, straight in'),
    'e1-a2-13-04': ('Is it just the one?', 0.93, 0.3, False,
                    'quick, dry, teasing (r6: was "Just one?", which fell on every reading tried; the inverted form '
                    'is a question in its words. 0.93, the band floor: the test read at 0.97 ran 273 wpm)'),
    'e1-a2-13-05': ('It has sub-concerns.{0.3} I\'ve grouped them by how worried we should be.', 1.04, 0.35, False,
                    'the runner; earnest, not a joke to him'),
    'e1-a2-13-06': ('Big smiles, please.{0.25} Eyes on camera one.', 1.14, None, False, 'brisk; follows picture'),
    'e1-a2-13-07': ('Camera one.{0.45} Anyone.', 1.12, None, False,
                    'back to us; the pause keeps "Anyone" its own word (casting heard "Camera 1\'s anyone")'),
    'e1-a2-13-08': ('We own camera two.', 0.88, 0.5, False, 'pleasantly, unhurried (r2, 01:08: 0.90 -> 0.88)'),
    'e1-a2-13-09': (f'Congratulations on your launch, {MAS_IPA}.{{0.2}} Really.{{0.25}} Everyone\'s using it.', 0.98,
                    None, False, 'quick and sincere, a little apologetic'),
    'e1-a2-13-10': ('Thank you.', 0.90, 0.45, False, 'plain; takes the compliment'),
    'e1-a2-13-11': ('They ask it the things they used to ask us.{0.5} And it tells them what a great question it was.',
                    0.87, 0.6, True, 'the barb dressed as a courtesy: carries the exchange (r3: 0.97 -> 0.91, pause '
                    '0.3 -> 0.45; take r2 ran 240 wpm against a 130-150 guide; r4: 0.91 -> 0.87, pause 0.5, r3 still ran '
                    '228 wpm)'),
    'e1-a2-13-12': ('How\'s the dancing?', 0.90, 0.9, True, 'the knife: sincere, never snide; a loaded beat first'),
    'e1-a2-13-13': ('We\'re being thoughtful.', 0.99, 0.35, False, 'quickly, patting at the flame'),
    'e1-a2-13-14': ('Folks,{0.15} I just want to say one thing.', 0.90, None, False,
                    'walks in mid-sentence; the comma keeps it running on (r2, 01:08: 0.99 -> 0.94 and a short comma pause; '
                    'r4: 0.94 -> 0.90, r2 ran 234 wpm; no longer pause, the script wants it to run on)'),
    'e1-a2-13-15': ('Whatever you promise in here today,{0.2} put it in writing.{s0.5} Longer.', 0.93, None, False,
                    'to the row; the OTS opens on him (r3: 0.97 -> 0.93 and a comma pause; take r2 articulated 5.43 '
                    'syll/s against a 4.2-4.8 guide; r6: "Longer." its own read, {s0.5}, since the button rode in on '
                    'the sentence at 5.41 syll/s, audit-v2 #24)'),
    'e1-a2-13-16': ('How much longer?', 1.04, 0.35, False, 'Mario, straight in'),
    'e1-a2-13-17': ('Longer than that.{0.45} I\'ve got a big desk.', 0.94, 0.4, True,
                    'the president finishes a thought (r4: 0.97 -> 0.94, pause 0.3 -> 0.45; r2 ran 212 wpm)'),
    'e1-a2-13-18': ('It\'s a good photo.', 0.90, None, False, 'O.S. over the print insert; follows picture'),
    # ---- sc 15, the Senate
    'e1-a2-15-01': ('Too often we have seen what happens when technology outpaces regulation.', 0.88, None, False,
                    'THE CLONE (gloss): perfect cadence; pre-laps over black; recorded landing on "regulation" (r6: re-read '
                    'with cast.json pitch_add 2.0 on the gloss voice, so it differs from the chairman by ear)'),
    'e1-a2-15-02': ('Couldn\'t have said it better myself.', 0.88, 0.6, False, 'the real chairman, moved'),
    'e1-a2-15-03': ('Don\'t mind me.{s0.25} It\'s a thread.{s0.25} One of forty-seven.', 1.16, None, False,
                    'low, typing, to Mas, not looking up; follows the card (r4: "me." its own read, {s}: in r2 the '
                    'pause after it was opened while the voice still sounded, a -7.3 dB dip; r5: each sentence its own '
                    'read, since r4 cut into "thread" instead and ASR heard "a threat from")'),
    'e1-a2-15-04': ('Which one am I?', 0.92, 0.5, False, 'Mas, mild'),
    'e1-a2-15-05': ('Most of them.', 1.15, 0.45, False, 'still typing'),
    'e1-a2-15-06': ('You may have had in mind the effect on jobs,{0.35} which is really my biggest nightmare in the '
                    'long term.', 0.82, None, False, 'reading from a card; follows the cut (r3: 0.87 -> 0.82, comma '
                    'pause 0.15 -> 0.35; take r2 ran 220 wpm against a 135-155 guide)'),
    'e1-a2-15-07': ('[GTP](/ʤˌitˌipˈi/) four and other systems like it are good at doing tasks,{0.2} not jobs.', 0.92,
                    0.7, True, 'the promise, on the record: carries the scene'),
    'e1-a2-15-08': ('Are you nervous, Mr. Manalt?', 0.88, 1.2, False,
                    'THE CLONE, having taken the card (gap 0.8 -> 1.2 in the timeline: the snatch plays first; r6: re-read '
                    'with pitch_add 2.0)'),
    'e1-a2-15-09': ('Speaking for myself,{0.3} a little.', 0.85, None, True,
                    'quietly, eyes on his card in the clone\'s hand; after the 1-beat hold (r6: the script line was '
                    '"I am, a little.", whose takes all heard as "littles" and whose meaning the cold newcomer missed; '
                    'the new line makes him the one who is nervous. 2 takes, picked on ASR)'),
    'e1-a2-15-10': ('Mr. Manalt.{0.35} There\'s talk of a new agency to regulate all this.{0.3} Would you come and run it?',
                    0.85, None, False, 'at the lit microphone; follows the light'),
    'e1-a2-15-11': ('I love my current job.', 0.91, 0.7, True, 'real; a considered beat, then plainly'),
    'e1-a2-15-12': ('You love it.{0.5} Do you make a lot of money doing it?', 0.80, 0.6, False,
                    'picks up his word (r3: 0.85 -> 0.80, pause 0.3 -> 0.5; take r2 ran 249 wpm and 5.41 syll/s '
                    'against 145-160 and 4.2-4.8)'),
    'e1-a2-15-13': ('Health insurance.', 0.88, None, False, 'THE CLONE reads the card; follows the gasp (r6: re-read with pitch_add 2.0)'),
    'e1-a2-15-14': ('That proves nothing.{0.45} Partially.', 1.20, None, False, 'stamping furiously'),
    'e1-a2-15-15': ('Is there anything you\'d like this committee to do?', 0.85, 0.9, False,
                    'another lit microphone (the same stock voice: CASTING has one A SENATOR)'),
    # ---- sc 17, the rooftop
    'e1-a2-17-01': ('It\'s one sentence.{0.3} It doesn\'t say what it costs.', 1.02, None, False,
                    'writing; not letting go of the pen'),
    'e1-a2-17-02': ('So I\'m adding a footnote.{0.3} A short one.', 1.03, 0.9, False,
                    'after Mas\'s hand comes out for the pen'),
    'e1-a2-17-03': ('We\'ll read it.', 0.90, 0.6, True, 'graciously, hand still out: the knife'),
    'e1-a2-17-04': ('It has an appendix.', 1.02, 0.5, False, 'not looking up'),
    'e1-a2-17-05': ('Can we help you?{0.3} This is the extinction table.', 1.03, None, False,
                    'looking up from his footnote, polite; follows the register\'s arrival'),
    'e1-a2-17-06': ('The more you buy,{0.3} the more you save.', 0.97, 0.6, True,
                    'like a gift: the turn (r3: 1.02 -> 0.97, comma pause 0.15 -> 0.3; take r2 ran 253 wpm against '
                    'a 160-176 guide)'),
}
DROP = {'e1-a2-16-01': 'a post [H]: on screen only (sc 16 is not voiced)'}
# draft id -> the line's id in this plan (r6 rewordings that `plan --prev` could not match to their old text)
RENAME = {'e1-a2-13-19': 'e1-a2-13-04', 'e1-a2-15-16': 'e1-a2-15-09'}


def main():
    draft = json.load(open(sys.argv[1]))
    draft_ids = {r['id'] for r in draft}
    for r in draft:
        if r['id'] in RENAME and RENAME[r['id']] not in draft_ids:
            r['id'] = RENAME[r['id']]
    out = []
    ids = {r['id'] for r in draft}
    missing = [k for k in SET if k not in ids]
    extra = [r['id'] for r in draft if r['id'] not in SET and r['id'] not in DROP]
    if missing or extra:
        sys.exit(f'the draft does not match this plan: missing {missing}, unplanned {extra} (re-run plan with --prev)')
    for r in draft:
        if r['id'] in DROP:
            continue
        say, speed, gap, flag, note = SET[r['id']]
        r = dict(r)
        r['say'] = say
        r['speed'] = speed
        r['gap_before_s'] = gap
        r['placement'] = {'gap_before_s': gap, 'follows': 'voice' if gap is not None else 'picture'}
        if flag:
            r['flag'] = True
        r['plan_note'] = note
        out.append(r)
    out_path = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else OUT
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w') as fh:
        json.dump(out, fh, indent=1, ensure_ascii=False)
        fh.write('\n')
    print(f'wrote {out_path}: {len(out)} lines ({sum(1 for r in out if r.get("flag"))} flagged for 2 takes), '
          f'{sum(len(r["text"].split()) for r in out)} words; dropped {list(DROP)}')


if __name__ == '__main__':
    main()
