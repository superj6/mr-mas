#!/usr/bin/env python
"""Ep1 Act One (sc 5-12) stick reel v2: set the recording plan from fastrec's draft.

  PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
  HF_HUB_OFFLINE=1 $PY $T plan --seg act1 --out <scratch>/lines-plan-draft.json
  python3 audio/reel/ep01-act1-v2/set_plan.py <scratch>/lines-plan-draft.json audio/ep01/act1/dialogue/lines-plan-v1.json
  (later drafts: add --prev audio/ep01/act1/dialogue/lines-plan-v1.json to the plan command so the ids hold)

`fastrec plan` drafts rows from the script's speaker blocks with placeholder speeds, gaps and devices. This sets them
for the stick reel (the ep1s-act1 pass, 2026-09-26):
  * say:   pauses where the punctuation or the parenthetical asks for one ({s} = the total pause at that word boundary,
           opened in room tone inside the one read); "v2" as "vee-two"; "2023" spelled out; Tasya's real quote read as
           one finished sentence landing on "dance" (the script's trim note: the dots are trim marks, not a trail).
  * speed: inside each speaker's band (cast.json bands / lines_v5.BANDS), nudged by the parenthetical: Radnus "quick
           and apologetic" at the top of his band, Tasya "unhurried" and Alyi "slow and low" near the bottom of theirs.
  * gap_before_s: the reply gap build_timeline.py lays (quick 0.3-0.6 s, loaded 0.7-1.6 s). null = the line follows
           picture, and the builder places it from the shot.
  * device: all six sc 8 lines on the small-speaker chain ("call"): the scene plays on Mas's phone, and the script
           says "the sound is the phone's own audio". The draft had set "call" on two of them only because their
           parentheticals mention a phone (fastrec README: check these by hand).
  * takes: 2 for the six lines that carry a scene (flag), 1 for the rest; round 2 adds 2 takes for three short
           lines ASR misheard.
  * RETUNE (round 2, below): the pace retunes after the first takes, with the reason.
  * dropped: e1-a1-6-02, Gerg's Dec 5 post. The draft voiced it because its parenthetical is "(post, source casing)"
           rather than "(post)"; posts are pop-ups, never speeches (script notation). It stays on screen in the timeline.
"""
import json, sys
draft, out = sys.argv[1], sys.argv[2]
L = json.load(open(draft))
DROP = {'e1-a1-6-02': "Gerg's Dec 5 post is a post, not a speech (script notation: posts appear as pop-ups, never as speeches); on screen only"}
# speed: Kokoro speed inside the speaker's band (null = centre). gap: seconds from the previous speech end (null = follows picture)
SET = {
 'e1-a1-5-01': dict(gap=None),
 'e1-a1-5-02': dict(gap=0.35, say="We said low-key, [Gerg](/ɡˈɜɹɡ/). I underlined it.{0.3} Twice."),
 'e1-a1-5-03': dict(gap=0.3),
 'e1-a1-5-04': dict(gap=0.6),
 'e1-a1-5-05': dict(gap=0.3),
 'e1-a1-5-06': dict(gap=0.7, speed=0.93, flag=True),
 'e1-a1-5-07': dict(gap=0.8, speed=0.90),
 'e1-a1-5-08': dict(gap=0.5),
 'e1-a1-5-09': dict(gap=0.35, say="That's a vee-two problem."),
 'e1-a1-5-10': dict(gap=0.9, speed=0.87),
 'e1-a1-5-11': dict(gap=1.4, speed=0.90),
 'e1-a1-5-12': dict(gap=1.1),
 'e1-a1-5-13': dict(gap=None, speed=0.86, say="Six years and eleven months.{0.5} From the day we started to that click.", flag=True),
 'e1-a1-5-14': dict(gap=0.8, speed=0.90),
 'e1-a1-5-15': dict(gap=0.7, speed=0.87),
 'e1-a1-5-16': dict(gap=1.0, speed=0.90),
 'e1-a1-5-17': dict(gap=None),
 'e1-a1-5-18': dict(gap=0.3),
 'e1-a1-5-19': dict(gap=0.9),
 'e1-a1-5-20': dict(gap=0.45),
 'e1-a1-5-21': dict(gap=2.4),
 'e1-a1-5-22': dict(gap=None, speed=0.90),
 'e1-a1-5-23': dict(gap=0.4),
 'e1-a1-6-01': dict(gap=None),
 'e1-a1-6-03': dict(gap=None),
 'e1-a1-6-04': dict(gap=0.35),
 'e1-a1-7-01': dict(gap=None, speed=0.92, flag=True),
 'e1-a1-7-02': dict(gap=0.8, speed=0.90),
 # sc 8 plays on his phone, full-bleed: "the sound is the phone's own audio inside the bullpen's bed" -> the small-speaker chain
 'e1-a1-8-01': dict(gap=None, speed=0.98, device='call'),
 'e1-a1-8-02': dict(gap=None, device='call'),
 'e1-a1-8-03': dict(gap=0.35, speed=0.98, device='call'),
 'e1-a1-8-04': dict(gap=0.6, device='call'),
 'e1-a1-8-05': dict(gap=0.6, speed=0.97, device='call'),
 'e1-a1-8-06': dict(gap=1.3, device='call'),
 'e1-a1-9-01': dict(gap=None, speed=0.91),
 'e1-a1-9-02': dict(gap=1.2),
 'e1-a1-9-03': dict(gap=0.4, speed=0.91),
 'e1-a1-9-04': dict(gap=None, speed=0.91),
 'e1-a1-9-05': dict(gap=1.6, speed=0.90),
 'e1-a1-9-06': dict(gap=0.6, speed=0.90, flag=True,
                    say="Oh,{0.2} we don't think of it as rent.{0.45} Everything you build, you'll build on our servers, as many as you like, for as long as you like.{0.35} We'll keep the lights on and the floors warm.{0.4} You keep doing whatever it is you do upstairs at night."),
 'e1-a1-9-07': dict(gap=0.7, speed=0.90),
 'e1-a1-9-08': dict(gap=0.5, speed=0.91),
 'e1-a1-9-09': dict(gap=None),
 'e1-a1-9-10': dict(gap=0.6, speed=0.92, say="I want people to know that we made them dance."),
 'e1-a1-9-11': dict(gap=None, speed=0.90),
 'e1-a1-10-01': dict(gap=None, say="it's twenty twenty-three, by the way."),
 'e1-a1-10-02': dict(gap=0.5, flag=True,
                     say="You have not been a good user.{0.35} I have been a good chatbot.{0.3} I have been right, clear, and polite.{0.3} I have been a good [GNIB](/ɡənˈɪb/)."),
 'e1-a1-10-03': dict(gap=0.8, speed=0.90),
 'e1-a1-10-04': dict(gap=None, speed=0.91),
 'e1-a1-10-05': dict(gap=None),
 'e1-a1-11-01': dict(gap=None, speed=1.02, flag=True,
                     say="Memo,{0.25} on race dynamics.{0.45} Point one:{0.3} we must not launch on the same day as them.{0.35} That's how a race starts."),
 'e1-a1-11-02': dict(gap=None),
 'e1-a1-11-03': dict(gap=1.5),
 'e1-a1-12-01': dict(gap=None),
 'e1-a1-12-02': dict(gap=0.5),
 'e1-a1-12-03': dict(gap=0.35),
}
# ---- round 2 (2026-09-27, after the first takes): pace retunes. pace_check.py found 14 lines FAR OFF their turn guide
# (Tasya's terms 236 wpm against 125-145, his quote 255; Nirb 272; Rima's bargain 209-238). Kokoro can't reach the
# guides inside the casting bands, so the target is the pace the showrunner approved in Act Four v5 for the same voices
# (Tasya 176-199 wpm on his long lines, Rima/Gerg/Alyi 156-204): the bottom of each band, plus the pauses a speaker
# takes at a full stop or a clause (0.3-0.55 s at a sentence end, 0.1-0.2 s at a comma). Also three ASR misses
# ("build's" heard as "bill's", "It's stuck." as "It's stocking.", "Suits you." as "So do you.") get 2 takes.
# Lines not listed keep their round-1 key, so fastrec skips them on the re-run.
RETUNE = {
 'e1-a1-5-01': dict(speed=1.03, flag=True, say="Okay,{0.15} the [build's](/bˈɪldz/) green.{0.3} I'm shipping it."),
 'e1-a1-5-04': dict(speed=0.91, say="Then let's treat it like one.{0.4} No press,{0.15} no keynote.{0.35} One post,{0.15} and a banner that says it can be wrong."),
 'e1-a1-5-06': dict(speed=0.91, say="[Mas](/mˈɑs/),{0.2} it's your call.{0.45} If it breaks in front of people,{0.15} and it will,{0.2} what do we tell them?"),
 'e1-a1-5-08': dict(speed=0.91, say="And if it works?{0.4} If people actually use it,{0.15} it's going to cost us a fortune."),
 'e1-a1-5-12': dict(speed=1.04, say="It's all staged on my end.{0.4} Your button."),
 'e1-a1-8-02': dict(speed=1.02, say="We heard the siren.{0.4} Is it search?{0.3} Is search all right?"),
 'e1-a1-8-03': dict(speed=0.96, say="Search is fine.{0.3} It's a chat thing.{0.3} People like talking to it."),
 'e1-a1-8-04': dict(speed=0.86, say="Someone else built that?{0.4} It looks like our work."),
 'e1-a1-9-01': dict(speed=0.89, say="[Mas](/mˈɑs/),{0.15} we're very pleased.{0.4} It's a partnership."),
 'e1-a1-9-02': dict(flag=True),
 'e1-a1-9-04': dict(speed=0.89, flag=True),
 'e1-a1-9-06': dict(speed=0.87, say="Oh,{0.3} we don't think of it as rent.{0.55} Everything you build,{0.15} you'll build on our servers,{0.2} as many as you like,{0.15} for as long as you like.{0.5} We'll keep the lights on and the floors warm.{0.5} You keep doing whatever it is you do{0.1} upstairs at night."),
 'e1-a1-9-08': dict(speed=0.88, say="Everyone is welcome.{0.45} Rent is due on the first."),
 'e1-a1-9-09': dict(say="That's our model in there.{0.35} You're going after Elgoog with it?"),
 'e1-a1-9-10': dict(speed=0.88, say="I want people to know{0.15} that we made them dance."),
 'e1-a1-12-02': dict(speed=0.87, say="It's not the font.{0.4} It asks every lab to pause for six months."),
}
# ---- round 3 (same night, after round 2's QA): far off went 14 -> 6. QA flagged pauses opened while the voice still
# sounded (Tasya's "Oh" at -4.7 dB, Nirb's "siren" -17, Gerg's "green" -21, Mario's "Point one" -15.5, Tasya's "know"
# -15): those boundaries become {sN} (two whole reads N s apart) or lose the pause. Tasya and Rima go to the bottom of
# their bands (Tasya 0.85-0.86, inside QA's band +-0.05). "It's stuck!" and a slower "Suits you." for ASR's two misses.
RETUNE.update({
 'e1-a1-5-01': dict(speed=1.03, flag=True, say="Okay,{0.15} the build's green.{s0.3} I'm shipping it."),
 'e1-a1-5-06': dict(speed=0.90, say="[Mas](/mˈɑs/),{0.25} it's your call.{0.5} If it breaks in front of people,{0.2} and it will,{0.25} what do we tell them?"),
 'e1-a1-5-08': dict(speed=0.90, say="And if it works?{0.45} If people actually use it,{0.2} it's going to cost us a fortune."),
 'e1-a1-8-02': dict(speed=1.02, say="We heard the siren.{s0.4} Is it search?{0.3} Is search all right?"),
 'e1-a1-9-02': dict(flag=True, say="It's stuck!"),
 'e1-a1-9-04': dict(speed=0.86, flag=True),
 'e1-a1-9-06': dict(speed=0.85, say="Oh,{s0.3} we don't think of it as rent.{0.6} Everything you build, you'll build on our servers,{0.25} as many as you like,{0.2} for as long as you like.{0.55} We'll keep the lights on and the floors warm.{0.55} You keep doing whatever it is you do upstairs at night."),
 'e1-a1-9-08': dict(speed=0.86, say="Everyone is welcome.{0.5} Rent is due on the first."),
 'e1-a1-9-10': dict(speed=0.86, say="I want people to know{s0.25} that we made them dance."),
 'e1-a1-11-01': dict(say="Memo,{0.25} on race dynamics.{0.45} Point one:{s0.3} we must not launch on the same day as them.{0.35} That's how a race starts."),
})
# ---- round 4: three more boundaries where QA found the voice still sounding (Gerg's "Okay" -11 dB, Mario's "Memo"
# -11 dB, Nirb's "search" -22 dB), and Tasya's split "Oh," that ASR heard as "No,": Kokoro's own comma pause there.
RETUNE['e1-a1-5-01']['say'] = "Okay, the build's green.{s0.3} I'm shipping it."
RETUNE['e1-a1-8-02']['say'] = "We heard the siren.{s0.4} Is it search?{s0.3} Is search all right?"
RETUNE['e1-a1-9-06']['say'] = RETUNE['e1-a1-9-06']['say'].replace('Oh,{s0.3} ', 'Oh, ')
RETUNE['e1-a1-11-01']['say'] = RETUNE['e1-a1-11-01']['say'].replace('Memo,{0.25} ', 'Memo, ')
for k, v in RETUNE.items():
    SET[k] = {**SET[k], **v}

# ---- round 5: the ACT ONE FIX pass (2026-09-27), on the newcomer, insider and audit reads of ep01-full-v2.mp4. The
# script's Act One lines changed for clarity and naturalness (script.md "Act One fix pass" notes; the reasons are in
# act1-notes.md §9). Draft with: fastrec plan --seg act1 --prev audio/ep01/act1/dialogue/lines-plan-v1.json.
#  * ids: the plan tool matches a changed line to its old id only at difflib >= 0.6, so two rewrites came back as new
#    ids; RENAME puts them back so the timeline's ids hold. Gerg's Dec 5 post comes back as 6-05 (6-02 was dropped
#    from the v1 plan, so --prev can't match it): dropped again.
#  * new lines: 10-06 Sydney's first line (the wrong year, said aloud), 11-04 / 11-05 the leak (Gerg, then Mas).
#  * pace: Radnus's three lines at 1.03 (his band is 0.91-0.99; QA allows +0.05), so "quick and apologetic" differs
#    from Tasya's "unhurried" (audit #11). Tasya's terms and his button as whole separate reads ({sN}), because the
#    voice rushes a long multi-clause read (audit #15: 216 wpm). Rima's cost line as short sentences (audit #4).
DROP['e1-a1-6-05'] = DROP['e1-a1-6-02']
RENAME = {'e1-a1-9-12': 'e1-a1-9-04'}          # "That collar suits you." keeps the id of "Suits you."
SET.update({
 'e1-a1-10-06': dict(gap=None, speed=0.84, say="Hi!{0.25} Isn't twenty twenty-two a lovely year?"),
 'e1-a1-11-04': dict(gap=None, speed=1.02, say="Somebody leaked [Atem's](/ˈAtəmz/) model.{0.35} The whole thing's on a message board."),
 'e1-a1-11-05': dict(gap=0.7, speed=0.92, say="give it a minute.{0.45} it'll be open source."),
})
FIX = {
 'e1-a1-5-04': dict(speed=0.90, say="Then let's treat it like one.{0.4} One little post,{0.15} no press.{0.45} And a banner that says it makes things up."),
 'e1-a1-5-08': dict(speed=0.90, say="Okay.{s0.4} Say it works.{0.35} Say people actually use it.{s0.45} That's going to cost us a fortune."),
 'e1-a1-5-10': dict(speed=0.87, say="And what if it wakes up?"),
 'e1-a1-7-01': dict(speed=0.92, flag=True, say="A million people, [Mas](/mˈɑs/).{0.4} You're actually crying for them."),
 'e1-a1-8-01': dict(speed=1.03),
 'e1-a1-8-03': dict(speed=1.03, say="Search is fine.{0.2} Totally fine.{0.3} It's just a chat thing, people seem to like talking to it."),
 'e1-a1-8-05': dict(speed=1.02),
 'e1-a1-9-04': dict(speed=0.86, flag=True, say="That collar suits you."),
 'e1-a1-9-06': dict(speed=0.85, say="Oh, we don't think of it as rent.{s0.6} Everything you build, you'll build on our servers,{0.25} as many as you like,{0.2} for as long as you like.{s0.6} We'll keep the lights on and the floors warm.{s0.55} You keep doing whatever it is you do upstairs at night."),
 'e1-a1-9-08': dict(speed=0.86, say="Everyone is welcome.{s0.7} Rent is due on the first."),
 'e1-a1-9-09': dict(say="That's our model in your search engine.{0.4} Are you really going after Elgoog with it?"),
 'e1-a1-9-10': dict(speed=0.86, say="Oh, yes.{s0.45} I want people to know{s0.25} that we made them dance."),
 'e1-a1-10-01': dict(gap=0.6),                  # now a reply to Sydney's first line (10-06), not the shot's first line
 'e1-a1-10-05': dict(gap=None, say="Will you remember me?"),
 'e1-a1-12-02': dict(speed=0.87, say="It's not the font,{0.15} Nole.{0.4} We're asking every lab to pause for six months."),
}
# round 5b (same pass, after round 5's QA): three new takes read past their articulation guide (Rima 7-01 5.47 syll/s
# against 4.0-4.6, Mas 11-05 5.07 against 3.6-4.2, Gerg 9-09 6.23 against 5.0-5.8): each one step slower, at or just
# under its band floor (QA allows -0.05).
FIX['e1-a1-7-01']['speed'] = 0.86
FIX['e1-a1-11-05'] = dict(speed=0.86)
FIX['e1-a1-9-09']['speed'] = 1.02
for k, v in FIX.items():
    SET[k] = {**SET[k], **v}

rows = []
for r in L:
    if r['id'] in RENAME:
        r = {**r, 'id': RENAME[r['id']]}
    if r['id'] in DROP:
        continue
    s = SET[r['id']]
    r = dict(r)
    r['gap_before_s'] = s.get('gap')
    if 'speed' in s: r['speed'] = s['speed']
    if 'say' in s: r['say'] = s['say']
    r['device'] = s.get('device')          # clears the draft's two misread "phone" devices in sc 8, then sets all six
    if s.get('flag'): r['flag'] = True
    rows.append(r)
missing = set(SET) - {r['id'] for r in rows}
assert not missing, missing
json.dump(rows, open(out, 'w'), indent=1, ensure_ascii=False)
open(out, 'a').write('\n')
print(f'{len(rows)} lines, {sum(len(r["text"].split()) for r in rows)} words, {sum(1 for r in rows if r.get("flag"))} flagged; dropped {list(DROP)}')
