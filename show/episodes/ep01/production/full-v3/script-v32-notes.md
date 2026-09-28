# Ep1 v3.2: the agency pass notes (`v32-agency`, 2026-09-28)

> **Draft 8.1 (second round, 2026-09-28): the calibration ledger and the v3.1 audit are folded in. Every change is logged in [§10](#10-draft-81-the-calibration-ledger-and-the-v31-audit); where §10's numbers differ from §1, §2 and §6 (runtime, the voice, the takes), §10 governs.** Story ≈ 20:42.4; 11 V.O. lines.
>
> **Status: DONE, for the lead's review.** It covers script draft 8 (now 8.1), the spine and agency map ([agency-v32.md](agency-v32.md)), the six v3.2 beat plans, these notes, and six rows added to facts.md (W1–W6).
>
> **Nothing here was recorded, timed, heard or watched.**
> - Every length is planned from the v3.1 lock's measured beat lengths, the line timings on file and word counts.
> - The next lock sets the frames.
> - Nothing was committed.

**The files:**
- **The script:** [show/episodes/ep01/script.md](../../script.md), draft 8. Its revision log is at the top, above draft 7's.
- **The spine and the agency map:** [agency-v32.md](agency-v32.md) (the rise, act by act; cause and effect between scenes; every scene rated; every new move against the guardrails).
- **The beat plans** ([PLAN §2](PLAN.md#2-the-beat-plan-s1--s3-p1-p2-a1) format, plus the v3.1 plans' additive fields), written against the **v3.1 lock** (`show/reel/ep01-v31/ep01-v31-<seg>.json`): [beat-plan-v32/](beat-plan-v32/) `coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`.json. All six pass `python -m json.tool`.
- **The builder:** [beat-plan-v32/_build_v32.py](beat-plan-v32/_build_v32.py). The JSON is generated from its spec, and the run checks the spec against the v3.1 lock: every v3.1 beat appears exactly once; every dropped, retimed or moved line exists in its beat; every moved-in line was moved out of the beat it names; every new line's anchor resolves; new ids are unique. It prints the runtime, the V.O. roster and the takes list. **To change a plan, edit the spec and re-run; don't hand-edit the JSON.**
- **The facts rows:** [facts.md, "v3.2 rows"](../../facts.md) (W1–W6, appended; nothing above them edited).
- **Draft 7's plans and notes** stay beside these as history: [beat-plan-v31/](beat-plan-v31/), [script-v31-notes.md](script-v31-notes.md).

**To re-run** (it only reads the v3.1 lock and the v3.1 plans; it writes only `beat-plan-v32/*.json`):

```
python3 show/episodes/ep01/production/full-v3/beat-plan-v32/_build_v32.py           # validate + runtime + V.O. roster + takes list
python3 show/episodes/ep01/production/full-v3/beat-plan-v32/_build_v32.py --write   # rewrite the six JSON files
for f in show/episodes/ep01/production/full-v3/beat-plan-v32/*.json; do python3 -m json.tool "$f" >/dev/null && echo ok "$f"; done
```

**The plans' fields** follow the v3.1 plans (script-v31-notes, "Beat-plan fields beyond PLAN §2"), with three additions: `at` on a kept line retimes it (`start+S` or `after:<line id>+S`); `moves_to` / `moved_from` on a line that changes beats; `device` on a kept line whose take stands but whose device chain changes (DevDay's two lines: monitor → stage). Fix codes: **A0** note 0 (the lead drives the plot) · **A1–A4** the brief's direction for Acts One to Four · **P** the V.O. prune · **N1** the newcomer's "I couldn't tell what Mas wants" · **R** runtime.

---

## 1. Runtime

### 1.1 Per segment (story time; the intro, the card and the outro are episode time)

| Segment | v3.1 lock (measured) | **v3.2 estimate** | Change | What moved it |
|---|---|---|---|---|
| Cold open | 0:26.7 | **0:26.7** | 0.0 | unchanged |
| Act One | 5:37.5 | **5:35.0** | −2.4 | the call +7.2, his million post +2.3; the V.O. and its air −11.9 (5.02 −1.5, 5.03 −1.0, 5.06b −3.9, 9.09 −1.2, 11.03 −4.4) |
| Act Two | 3:21.2 | **3:14.2** | −7.1 | his proposal +4.3, "would you run it?" +2.2; the V.O. −7.1 (13.01, 13.09, 13.11, 14.01); the moved question −3.7 and −2.7 |
| Act Three | 2:25.1 | **2:22.4** | −2.7 | the surge +5.0, the switch-off +2.0, DevDay live +1.7; the V.O. −11.4 (18.00b, 18.02, 18.06, 19.03, 20.06) |
| Act Four | 8:37.7 | **8:51.2** | +13.5 | the lobby, told twice, +8.0; his post +5.0; the badge under the door +3.2; S1.12 −0.8, S5.09b −1.9 |
| Tag | 0:41.3 | **0:40.1** | −1.2 | 32.03's V.O. |
| **Story** | **21:09.6** | **21:09.7** | **+0.1** | |

- **Against the brief ("near 21:00; 19:45–21:15 is fine"): 21:09.7**, level with the v3.1 lock the lead accepted at "about 21:10". The episode runs about **21:52** with the 30 s intro, the 2 s card and the Orb outro (10.1 s).
- **What paid for what:** the new moves add **≈ +40.8 s** (five new beats: the call, the switch-off, the surge, his post, the lobby; five beats that grow: the million, the proposal, "would you run it?", DevDay, the badge). The voice-over they replace, and the air it held, return **≈ −40.8 s** across nineteen beats.
- **No arrival and no scene-edge hold was trimmed** below its v3.1 length except where the V.O. was the arrival's content (5.02 keeps 6.5 s of room; 13.01 keeps its 3.5 s chapter change).

### 1.2 If the lead wants about 21:00 (ranked by what they cost)

| # | Trim | Saves | Costs |
|---|---|---|---|
| T1 | v31-10.02: Sydney's opener, "Hi! Isn't 2022 a lovely year? 😊" (v3.1's O3) | 3.2 s | the cheery build before the scold |
| T2 | S4.13e: Tasya holding up the `MAS · GERG →` sign | 3.0 s | a comic button on the board's side; the sign still reads alone, taped to the 2 AM door |
| T3 | 14.03 + 14.04 as one shot (the lit window, the repost click inside it) | 1.5 s | one cut-in of the stepped push |
| T4 | v32-22.04: the surge (the pause post) | 5.0 s | Act Three's last move; the act would end on DevDay and "super." |
| T5 | v32-S1.13: his post after the blow | 5.0 s | his first move after the shock; the blow's aftermath would fall straight to night |

T1–T3 land at about **21:02**; with T4, about **20:57**. **Not on the list, on purpose:** the call (v32-7.03, the act's cause and effect), the lobby told twice, the proposal, the badge under the door, any arrival or aftermath hold, the told-twice lines, the conversations.

### 1.3 How the estimates were made

- A kept beat starts at its v3.1 lock length.
- Where a V.O. line goes, the lines after it move up by the line's length and its gap; the beat shortens by that much, unless the V.O. sat in a set-piece's musical bars (6.01), where the length stays.
- New lines are estimated from the takes' measured pace for that voice (Mas about 2.5 words a second, from v3-a2-0001 and e1-a2-15-07), or from the source take's word timings where a line is cut from one.
- New beats are estimated from their action and their lines.

---

## 2. Mas's inner voice: 28 lines → 12

### 2.1 Counts

- **12 lines, 83 words** (v3.1: 28 lines, 208 words). **No new line; every kept line has its take.**
- **Kinds:** gap 3 · reads that pay 3 · the board seed 1 · effort 1 · the misread 1 · caught 1 · count 1 · a professional's read 1.
- **Caught by the picture:** 2 of 12 (the budget read and "i don't keep score."), under the guide's quarter.
- **Clusters:** launch night (3, and the bill), the lobby (1), Act Two (**none**: he performs in public there), the dark room (2), the suite (1), that night (1), 2 AM (2), the tag (1).

### 2.2 The twelve, in episode order

| # | Id | Line | Beat | Kind | Why it stays |
|---|---|---|---|---|---|
| 1 | v3-vo-02 | she'll go for three. | 5.03 | read that pays | Rima's third underline pays it in 20 s: his reads are right, which is why the budget read hurts |
| 2 | v3-vo-03 | she's right. it will break. i don't know which part yet. | 5.04 | gap | makes the click a choice made knowing; aloud, "it's a preview." |
| 3 | v3-vo-05 | i know. i still read it twice. | 5.11 | gap | his want, admitted once: to be liked |
| 4 | v3-vo-07 | mostly the bill. | 7.01 | gap | the brief's "the gap"; plants "mostly." to the Orb; the call follows from it |
| 5 | v3-vo-08 | eleven keys. he's here for the twelfth. | 9.04 | read that pays | the twelfth key pays it; the landlord's want in one line |
| 6 | v31-vo-06 | neleh's on our board. she quoted us. | v31-20.07 | read | the board's one seed before Act Four; one fact, no opinion |
| 7 | v3-vo-16 | thrilled is too much. enthusiastic is a lot. | 22.02 | effort | the episode's one line where the effort shows ("super." chosen from three) |
| 8 | v3-vo-18 | gerg's not on it. alyi set it up. probably just the budget. | S1.02 | the misread | the brief's "the misread before the shock" |
| 9 | a5-26a-01 (v3-vo-19) | i don't keep score. | S2.01 | caught | the carve; the first thing we hear after the silence |
| 10 | v3-vo-20 | four hundred and six. four hundred and seven. four hundred and six. | S5.03 | count | the brief's "the lost count at 2 AM" |
| 11 | v3-vo-21 | gerg. he'll say he's compiling. | S5.09 | read that pays | his read works again after the budget, while he makes the call |
| 12 | v31-vo-07 | those are stills. | v31-32.01d | a professional's read | a demo-maker's recognition; the one word that tells a newcomer the rival's film was faked (0 s: it sits in the insert's stillness) |

**And the silence at the blow:** from the JOIN click through "super.", and on to his post, nothing inside him is heard.

### 2.3 The sixteen that go, and where each one's job went

| Id | Line | Beat | Its job now |
|---|---|---|---|
| v3-vo-01 | gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first. | 5.02 | each says what they want in their own lines within 30 s |
| v3-vo-04 | alyi asks that about everything we build. he means it every time. | v3-5.06b | the held reaction; "Six years and eleven months." says who Alyi is to him |
| v3-vo-06 | someone noticed. | 6.01 | **an action:** he announces the million himself (6.06) |
| v3-vo-09 | it does. | 9.09 | he looks down at what he's standing on, and asks the price |
| v3-vo-10 | mario used to sit where gerg sits. he left to build a careful one. | 11.03 | Mario's memo, his plate and the intro's roll call |
| v31-vo-01 | four companies, one table. radnus has been mouthing the same sentence since we sat down. | 13.01 | Radnus's lips move from the first frame (the picture); **an action:** Mas already in the best seat |
| v3-vo-12 | he's not wrong. | 13.09 | his answer, the knife, comes on the next beat |
| v3-vo-13 | i'll turn when he finishes the sentence. | 13.11 | **an action:** he doesn't turn |
| v31-vo-02 | her mouth is a beat late. the voice isn't hers. | 14.01 | the tag held to read and **his replay**; the chairman's "That voice was not mine." |
| v31-vo-03 | thirteen. | v31-18.00b | the thirteenth key and Kram's dry OPEN SOURCE paint |
| v31-vo-04 | my other company. it tells people from machines. | 18.02 | the label (PROOF YOU'RE HUMAN · CO-FOUNDER), then the scan |
| v3-vo-14 (e1-a3-18-04) | i made it for everyone else. | 18.06 | the tokens and the verdict; **an action:** "you can stay." |
| v31-vo-05 | i've had mine up since may. | v31-19.03 | **an action:** his hand is up before the room's; he lowers it himself |
| v3-vo-15 | gerg types louder when he's happy. he's been happy since november. | 20.06 | the keys running on under the call; they stop at 2 AM |
| v3-vo-23 | gerg never waits to be asked. | S5.09b | Alyi's "Gerg has never waited to be asked." (S3.05), paid by Gerg waiting; the newcomer had heard it twice |
| v3-vo-24 | it looks calmer than me. | 32.03 | the cover and his face wear the same expression; the Orb's slower verdict |

**The test used** (note 0, then mas-inner-voice §8): a thought that could be an action becomes the action; a line that tells us what we see, explains a person to us, or would work as a post goes. What stays is the gap between what he says and what he thinks, a read we can check, the one effort line, and the counts.

**For the bible owner:** mas-inner-voice §7's density (15–25 lines, 200–300 words) is superseded by note 0 (about 10–14). Not edited here.

---

## 3. Every change, and why

The beat plans carry each change with its `why` and `fix`; this is the summary.

### 3.1 Act One: he launches, it explodes, he secures the money

| Beat | Change | Why |
|---|---|---|
| 5.02 | V.O. out; the wide keeps 6.5 s of room | P |
| 5.03 | Gerg's "Okay, the build's green. I'm shipping it." → "Okay, the build's green." (v32-a1-0001, cut from the take) | A1, N1: the launch is Mas's call; Gerg still built it without being asked |
| 5.04 | unchanged; "she's right. it will break." kept | the click is a choice made knowing |
| v3-5.06b | V.O. out; 6.35 → 2.5 s | P |
| 5.08 | caption only: his call; the click is never tied to the board question | A1; guardrails §6 |
| 6.01 | "someone noticed." out | P: it becomes the post |
| 6.06 | **his post over the million**, "CHATGTP launched on wednesday. today it crossed 1 million users!" (W1); rail DEC 5 → DEC 4 | A1: the want, acted |
| 7.02 | the siren's J-cut moves; his hand finds the phone | A1 |
| **v32-7.03 (new)** | **the call**: "Mas." / "it's the bill." (Act One's take reused) / "I'll bring a pen."; the phone lights red as he lowers it | A1, A0: cause and effect; the check answers it, the pen is the promised pen |
| 8.01, 9.01, 9.04 | captions: the alert lands on the phone he hung up; the check is the answer; the pen is the one promised | A1 |
| 9.09 | "it does." out; "and the rent?" 1.2 s sooner | P |
| 11.03 | Mario's V.O. out; his memo 1.5 s into the phrase | P |
| 11.04 | LEFT pane: **GTP-4 goes out on his click** (5.08's button and click) | A1 |

### 3.2 Act Two: he makes himself the face of it

| Beat | Change | Why |
|---|---|---|
| 13.01 | V.O. out; **he's already in the seat nearest the teacher**, the others still settling; Radnus's lips move | P, A2 ("scheme small") |
| 13.09 | "he's not wrong." out; "how's the dancing?" on the next beat | P |
| 13.11 | "i'll turn when…" out; the action shows it | P |
| 14.01 | V.O. out; the tag drawn to read; **his thumb replays the clip** | P (the bay's v3.1 fix keeps its job; §3.4) |
| 15.10 | the committee asks for his ask (e1-a2-15-15, moved up); "There's talk of a new agency…" goes | A2 |
| 15.15 (moved up) | **"…i would form a new agency that licenses any effort above a certain scale of capabilities…"** (v32-a2-0001, [P], W2) over his shoulder, then the sheet slides on "licenses"; Sucram stamps it | A2: his ask is his move, in the record's words |
| 15.16 (moved up) | the sheet in the clone's hand; the senators want to sign | A2 |
| 15.11 | "Would you come and run it?" (v32-a2-0002, cut from e1-a2-15-10) → "i love my current job." → the pay | A2: the record's order; asked because he proposed it |
| 15.14 | ends on "…i have no equity in nopeai."; the tour's J-cut moves here | A2 |
| 16.01 | **his own hand stamps** `ADDED DUE TO POPULAR DEMAND` | A2: the tour is his play |

### 3.3 Act Three: he consolidates

| Beat | Change | Why |
|---|---|---|
| v31-18.00b, 18.02, 18.06 | "thirteen.", "my other company…", "i made it for everyone else." out | P |
| v31-19.03 | "i've had mine up since may." out; he lowers his hand himself | P |
| 20.06 | "gerg types louder…" out | P |
| 21.05 | the clap carries into the room | A3 |
| **v32-21.06 (new)** | **he switches the monitor off**; the clapping grows into a hall's applause | A3, A0: he stops watching |
| 22.01 | **DevDay live**, no monitor: "and today, you can build your own chatgtp." (v32-a3-0001), the odometer, the landlord's hug; the home two-shot and the bezel egg go; the two DevDay takes change device (monitor → stage) | A3 |
| 22.02 | caption: that night, home | — |
| **v32-22.04 (new)** | **the surge**: the sign-up page blurs, the rack goes red, **his post pauses the sign-ups** (W3), SIGN UP → NOTIFY ME | A3: his launch's stakes and his next move |

**Nothing links DevDay or the surge to the board.** No board member watches either; no line connects them; Mada's own product is never mentioned (research mid §4 calls that rumour unverified).

### 3.4 Act Four: the fall, and the climb back

| Beat | Change | Why |
|---|---|---|
| S1.12 | the hold after "super." 2.6 s; he picks up his phone | A4 |
| **v32-S1.13 (new)** | **his own post**, 1:46 PM: "i loved my time at nopeai. … will have more to say about what's next later. 🫡" (W4); then the fall to night (moved from S1.12) | A4: his first move after the blow, on the record |
| S4.09 | his badge post leaves the CCTV tile (it moves to his side) | A4: told twice |
| S3.05 | Alyi's "Gerg has never waited to be asked." is now the only time it's said | P |
| S4.15 | the J-cut is the CCTV hum | A4 |
| **v32-S5.00 (new)** | **the lobby, told twice**: their camera's frame steps down into colour at his shoulder; he puts the GUEST lanyard on himself, takes the photo, posts it (L13), looks up at their camera; the 2 AM rail moves after it | A4: his move, from inside |
| S5.02 | caption: the lanyard he put on in the lobby | — |
| S5.09b | "gerg never waits to be asked." out; "keep building." sooner | P |
| S5.11 | **the MACROSOFT badge slides under the door; he picks it up and doesn't wear it**; S7.01's two badges now have an origin | A4: he considers the offer with his hands |
| S7.01 | caption: the two badges' origins | — |

### 3.5 Tag

| Beat | Change | Why |
|---|---|---|
| 32.03 | "it looks calmer than me." out | P |

### 3.6 v3.1 fixes whose V.O. line is cut, and where the fix now lives

| v3.1 fix | Its V.O. line | Now carried by |
|---|---|---|
| U1 (the Radnus rehearsal pointed at the wrong lobby) | v31-vo-01 | Radnus's moving lips from the first frame, paid when he speaks; no line to misattribute |
| Mood §4 #5 / critic #18 (the bay, "out of nowhere") | v31-vo-02 | the match cut (kept), the generic anchor (kept), the chairman's real line (kept), plus the tag drawn to read and his replay |
| N §3 #7 (who sent the Orb, and why) | v31-vo-04 | the shipping label (`FROM: COINWORLD · PROOF YOU'RE HUMAN` / `SHIP TO: MAS MANALT, CO-FOUNDER`), held 3.2 s to read, then the scan |
| The Atem payoff's count | v31-vo-03 | the thirteenth key in Atem blue and the dry OPEN SOURCE paint |
| The hands runner's frame | v31-vo-05 | his hand up before the room's, lowered by him |
| C U5 (the moved Gerg line) | v3-vo-23 | Alyi's line at S3.05, paid by Gerg waiting at S5.09b |

Everything else from v3.1 stands: the shock opening, the told-twice structure and Alyi's sentence heard twice, THE PLAN on the board's side, the Remove dialog and its greyed rhyme, the reversal on screen, the restorations (Sydney, the Atem thread, the hands runner, Rezeile's op-ed, the Runway demo), the line fixes, and no band prompt.

---

## 4. New art, per segment

"Reuse" names the kit or room where one exists (`studio/src/shared/pixel/`).

**Act One**
- **v32-7.03:** a new pose, Mas at his end desk with the phone at his ear, lit red from the open tile below; the phone's contact screen (`TASYA` over a key-ring avatar); the phone lighting red as he lowers it (8.01's alert).
- **6.06:** his post card over the million (`kits/post-card.ts`, new text `masMillion`, card time `DEC 4 · 11:35 PM`).
- **11.04:** the LEFT pane gains 5.08's insert (his finger, the beige button) scaled into the pane before the napkin-to-website swap.

**Act Two**
- **13.01:** the row's blocking: Mas seated square nearest Sirrah, glass set down; Radnus and Mario still settling (pose variants).
- **14.01:** his thumb scrubbing the clip back (two drawings); the `⚠ ALTERED AUDIO` tag drawn at a readable size.
- **15.15:** reuse 15.07's OTS for his line, then 15.15's HIGH; his hand's slide timed to "licenses".
- **16.01:** his hand and a rubber stamp entering the poster GFX (in, stamp, out).

**Act Three**
- **v32-21.06:** his hand on the monitor's switch; the monitor going dark in one step.
- **22.01:** the DevDay stage full-frame without the monitor's bezel (the existing POV plate, reframed: **check it holds at full frame**); Mas speaking on stage (the existing pose). Un-draw the 1 s home two-shot at its head and the zAI rafters egg.
- **v32-22.04:** the sign-up page UI (a counter blur, never a figure; `SIGN UP` greying to `NOTIFY ME`); the rack's LEDs stepping green → amber → red (reuse the launch-night steps from 6.09); his post card (`masPause`).

**Act Four**
- **v32-S1.13:** his phone in the suite's daylight; the post card (`masLovedMyTime`, card time `NOV 17 · 1:46 PM`); the palette-step fall to night, moved from S1.12.
- **S4.09:** remove the post card from the CCTV tile.
- **v32-S5.00:** S4.09's CCTV plate full frame, stepping out of its grade (grain off, colour up) in palette steps; the reception desk at floor level by day (`rooms/lobby.ts`, the S8 lobby); a receptionist's hand sliding the lanyard; Mas putting the lanyard on (a new pose); the selfie (arm out, the phone, one white flash step); the corner camera (a small prop); the badge post card (the existing one, moved).
- **S5.11:** the MACROSOFT badge sliding under the door and across the floor (`kits/macrosoft-badge.ts`); Mas reaching down for it (a pose); the two badges side by side on the desk.

**Tag:** none.

**Shot notes:** the call must read as cartoon, never as a real backroom (guardrails §5); in S5.00 his look up at the camera is one beat with no change of expression.

---

## 5. Sound and score (for A1, A2)

**Sound:**
- v32-7.03: one ring through a phone filter; the hang-up tick; the siren's J-cut (moved from 7.02).
- 6.06: his post's send pop, on F, on the wheel's last click.
- 11.04: 5.08's click on the downbeat before "Addendum."
- 15.14: the tour's stamp J-cut, moved from 15.16.
- v32-21.06: the monitor's click-off; the clapping growing through the black glass into a hall.
- 22.01: a hall's applause bed, live (not through a small speaker).
- v32-22.04: the counter's whirr (the odometer's chip notes on F, faster); the rack's fans up a step; the post pop; the button's grey-out tick.
- v32-S1.13: thumb taps; the post pop.
- v32-S5.00: the CCTV hum, then the lobby's room by day as the grade lifts; the lanyard's clip; the phone's shutter; the post pop.
- S5.11: the badge's slide on the floor, a tick against the chair leg, set down on the wood.

**Score:**
- v32-7.03: the swing's bass pedal and shimmer hold under the call; Tasya's Rhodes gives one soft chord on "pen".
- 15.15: MM-20 thins to its low-string pedal under his real line, as under every real line.
- 22.01: no score under the stage lines (the hall plays them dry); the Water Line resumes at home (22.02).
- v32-22.04: the Water Line thins to its pedal; THE CLOCK's first step is the next bar.
- v32-S1.13: none; the suite's air, then the drone under the fall to night.
- v32-S5.00: none; one felt note on his look up.

---

## 6. For the takes: Kokoro (S2) and ElevenLabs (A4)

**Kokoro stays the primary film. ElevenLabs re-renders the whole episode, so every line below needs an EL take too** (EL's recast neutral-American Mas; EL's device chains as for Kokoro).

### 6.1 New or changed lines (7)

| Seg | Id | Who | Line | Take |
|---|---|---|---|---|
| act1 | v32-a1-0001 | Gerg | Okay, the build's green. | **cut** from e1-a1-5-01 (its first sentence, 0.00–1.15 s) |
| act1 | v32-a1-0002 | Tasya (phone) | Mas. | **new**, the phone device; warm, unhurried, expecting the call |
| act1 | v32-a1-0003 | Mas | it's the bill. | **reuse** e1-a1-7-02 (deliberately the same take) |
| act1 | v32-a1-0004 | Tasya (phone) | I'll bring a pen. | **new**, the phone device; delighted |
| act2 | v32-a2-0001 | Mas | …i would form a new agency that licenses any effort above a certain scale of capabilities… | **new** [P]; the Mas speech preset; one finished sentence ending on "capabilities", about 6 s; "licenses" is the verb |
| act2 | v32-a2-0002 | Senator (O.S.) | Would you come and run it? | **cut** from e1-a2-15-10 (its last sentence, 5.39–6.85 s) |
| act3 | v32-a3-0001 | Mas (stage) | and today, you can build your own chatgtp. | **new**, the stage device (a hall's reverb); "chatgtp" as the cast lexicon says it |

**Two device changes, no re-read:** e1-a3-22-01 ("so, how's the partnership going?") and e1-a3-22-02 ("We love you guys.") go from the monitor chain to the stage chain.

**No new V.O. takes.** All twelve kept V.O. lines have takes on file.

### 6.2 Lines no longer in the film (drop from the lock; the files stay on disk)

- **V.O. (16):** v3-vo-01, v3-vo-04, v3-vo-06, v3-vo-09, v3-vo-10, v31-vo-01, v3-vo-12, v3-vo-13, v31-vo-02, v31-vo-03, v31-vo-04, e1-a3-18-04, v31-vo-05, v3-vo-15, v3-vo-23, v3-vo-24.
- **Replaced by their cuts:** e1-a1-5-01, e1-a2-15-10.
- **Moved, the take unchanged:** e1-a2-15-15 (15.14 → 15.10).

---

## 7. Facts

**Added to facts.md ("v3.2 rows"), each read raw:**
- **W1**, Dec 4, 2022, 11:35 PM PT: his "…today it crossed 1 million users!" post [P].
- **W2**, May 16, 2023: the Senate exchange, from the TechPolicy.Press transcript, fetched raw ("Number one, I would form a new agency that licenses any effort above a certain scale of capabilities…"; "Would you be qualified…"; "I love my current job."; "You make a lot of money. Do you?") [P]. It is #61's "pull the exact sentence".
- **W3**, Nov 14, 2023, 7:10 PM PT: the pause post [P].
- **W4**, Nov 17, 2023, 1:46 PM PT: "i loved my time at openai…" [P], with its id and time.
- **W5**, Nov 21, 2023, 10:08 PM PT: "…when i decided to join msft on sun evening…" [P]. **Held, not quoted**: it grounds the badge he takes; its motive clause stays off screen.
- **W6**, Nov 30, 2022, 11:38 AM PT: the launch post [P]. **On file, not used**: its time contradicts the night staging.

**For the facts owner:** the 6.06 rail moves from `DEC 5, 2022` to `DEC 4, 2022` (his post's PT date); #4's Dec 5 row (Gerg's post) is unchanged and still true.

---

## 8. Open questions (for the lead, the guardrails owner and the facts owner)

1. **The call to the landlord (v32-7.03). Guardrails owner.** An invented private call about a real deal. It states no terms, no figures and no reason beyond his own "it's the bill.", and it plays as cartoon. **Fallback:** keep the dial and "it's the bill." and drop Tasya's reply (the pen then arrives unexplained), or cut the beat (−7.2 s; the check arrives unasked, as in v3.1).
2. **The badge he takes at the door (S5.11). Guardrails owner.** An invented action inside the five days, consistent with his own later account (W5, held). **Fallback:** the badge stays on the floor where it stopped, and S7.01's MACROSOFT badge loses its origin.
3. **His look up at the lobby camera (v32-S5.00).** One beat, no expression change. **Fallback:** no look; the post ends the beat.
4. **DevDay's paraphrase (v32-a3-0001). Facts owner.** "and today, you can build your own chatgtp." for the GPTs launch (#43).
5. **Act Three is no longer one place.** DevDay is live on its stage, and the art pass must reframe the POV plate full-frame. **The lead's call;** the fallback is v3.1's monitor staging with the new line on the monitor (the switch-off then goes too).
6. **The v3.1 lock's S7.13 keeps "Chat, we're so back."** (lock-v31 §4.2). Unchanged here.
7. **The bible owner:** mas-inner-voice §7's density table is superseded by note 0.
8. **The calibration guide** ([calibration](../../../../bible/calibration.md)) didn't exist while this pass ran; where it disagrees with draft 8, it governs.
9. **Inherited and still open** (script-v31-notes §8): the launch-night board question, "gerg comes back too.", "keep building." and "and the rent?", Neleh's paper, Shear's post, the camp matrix, the Ep2 Sydney entry; and 23, 52, 55, 56, 57.

---

## 9. What a person has to check (nobody here can watch or listen)

1. **The launch:** does it now read as his call, not Gerg's (the v3 newcomer's "he lets Gerg ship")?
2. **The call:** does it read light and cartoon, and does the check in the door read as its answer? Does the pen read as the same pen?
3. **The Senate:** does proposal → "Would you come and run it?" → "i love my current job." read as cause and effect? Does 6 s of testimony over the OTS and the HIGH hold?
4. **The bay without a voice-over:** does a newcomer still know the clip's voice is fake (the tag, the replay, then the chairman's line)?
5. **The switch-off into DevDay:** does it read as "he goes to the stage", not a jump?
6. **The surge:** does the pause post read as his choice with a cost, and not as a gag?
7. **His post after the blow:** does it read as his first move without deflating the aftermath?
8. **The lobby, told twice:** does the CCTV frame stepping into colour read as "the same minute, from his side"?
9. **The badge under the door:** considering, not deciding?
10. **The inner voice at 12:** does he still feel close? Does Act Two, with none, feel distant or right?
11. **The spine:** does a newcomer now retell the episode as his rise (each act a step he takes) rather than "a sequence of events"?
12. **The runtime:** 21:09.7 is an estimate; the lock measures it.

---

## 10. Draft 8.1: the calibration ledger and the v3.1 audit

**Inputs** (from the lead, same authorization): [calibration](../../../../bible/calibration.md) (binding guidance) and [audit-v31](audit-v31.md) (the audit of the v3.1 film). Everything draft 8 achieved stays. The builder applies 8.1 as an explicit overlay on draft 8's spec (`OV`, `NEW_OV`, `NEW81` in `_build_v32.py`), so both layers stay readable; the JSON is regenerated and passes `json.tool`. New fix codes: **C3 / C5 / C9** (calibration §3 plates, §5 the voice, §9 agency) and **AUD** (the audit's numbered fixes, B.2 out-of-the-blue list, B.3 carried list).

### 10.1 Runtime

| Segment | v3.1 lock | draft 8 | **draft 8.1** | 8.1 against 8 |
|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | 0.0 |
| Act One | 5:37.5 | 5:35.0 | **5:31.1** | −3.9 |
| Act Two | 3:21.2 | 3:14.2 | **3:13.2** | −1.0 |
| Act Three | 2:25.1 | 2:22.4 | **2:21.3** | −1.1 |
| Act Four | 8:37.7 | 8:51.2 | **8:28.8** | −22.4 |
| Tag | 0:41.3 | 0:40.1 | **0:41.3** | +1.2 |
| **Story** | **21:09.6** | **21:09.7** | **20:42.4** | **−27.3** |

- The episode runs about **21:25** (the story, the 30 s intro, the 2 s card and the 10.1 s outro).
- **Time away from Mas on the board's side:** 3:37.1 in v3.1 → **3:20.0**, now in two stretches (2:23.6, then his 8 s lobby, then 0:56.4).
- **What paid (per beat, summing to −27.2 s):**
  - recap and procedure on the board's side, −15.7 (the blog read −6.0, Rima's appointment −5.4, Sunday's first line −4.3);
  - three J-cuts that pull a line under the previous shot, −6.6 (S3.06, S5.11, S8.08);
  - Act One's rewrites, −6.8 (Gerg's line with the new arrival −1.9, Sydney's rule −2.1, Nole's J-cut with Oigneb's line −2.9);
  - the lock-card V.O. −0.6, Neleh's paper −1.0, the LEDs −1.6, the lit window −1.0;
  - back in: the key-ring insert +1.6, the fuller call +1.8, the two restored V.O. lines +2.7.
- Section 1.2's ranked trims still apply (T1–T3 would take it to about 20:35), and none is needed.

### 10.2 The inner voice: 12 → 11 lines, 77 words

| Change | Line | Why |
|---|---|---|
| cut | v3-vo-08 "eleven keys. he's here for the twelfth." (9.04) | AUD #7 and the lead: a count a newcomer can't read at that size. The ring is shown large instead (v32-9.10k), and the thirteenth key hangs large in Act Three |
| cut | v31-vo-06 "neleh's on our board. she quoted us." (v31-20.07) | C3, C5, AUD A.1 ("convert"): a caption. The byline plate `NELEH · NOPEAI BOARD` carries it |
| cut | v31-vo-07 "those are stills." (v31-32.01d) | C5 and the lead: a caption; the stutter carries the joke |
| **restored** | e1-a3-18-04 "i made it for everyone else." (18.06) | C5: the gap only the voice can do (he exempts himself from his own device a beat after its scan saw tokens). The audit keeps it |
| **restored** | v3-vo-24 "it looks calmer than me." (32.03) | C5: the picture shows the cover and his face alike; only the voice can say which one he thinks is performing. The audit keeps it as the coda |

**The eleven:** "she'll go for three." · "she's right. it will break. i don't know which part yet." · "i know. i still read it twice." · "mostly the bill." · "i made it for everyone else." · "thrilled is too much. enthusiastic is a lot." · "gerg's not on it. alyi set it up. probably just the budget." · "i don't keep score." · "four hundred and six…" · "gerg. he'll say he's compiling." · "it looks calmer than me." Kinds: gap 4, prediction the picture pays 2, the wrong read 1, count 1, caught 3 (27%, just over the guide's quarter; each is also a gap).

**Where 8.1 differs from the audit's keep list** (§A.1): the audit would cut "she'll go for three." and "gerg. he'll say he's compiling.". They stay, because calibration §5 names "a prediction the picture pays" as work only the voice does, and they're the two reads that make the budget misread hurt (mas-inner-voice §1.3). "it does." (the audit's optional keep) stays cut.

### 10.3 Plates (calibration §3: a first-appearance plate with one relation word)

| First appearance | Draft 8 | **Draft 8.1** |
|---|---|---|
| 5.03 | `GERG MOCKBRAN` | `GERG MOCKBRAN · CO-FOUNDER` |
| 5.04 | `RIMA TAMURI` | `RIMA TAMURI · CTO` |
| 5.05 | `ALYI` | `ALYI · CO-FOUNDER` |
| v32-7.03 (his phone's contact, the world carrying it) | `TASYA` | `TASYA · MACROSOFT`; the lobby card (9.04) stays `TASYA / THE LANDLORD · RUNS MACROSOFT` |
| 8.03 | `RADNUS · POLITELY ON FIRE` | `RADNUS · RUNS ELGOOG · POLITELY ON FIRE` |
| 11.03 | `MARIO` | `MARIO · EX-NOPEAI` (the relation the cut V.O. carried) |
| 12.02 | `NOLE · BUILDING HIS OWN` | `NOLE · EARLY FUNDER · BUILDING HIS OWN` (facts #62, §D) |
| 15.02 | `LAHTNEMULB` | `LAHTNEMULB · CHAIRMAN` |
| v31-18.00b | `KRAM` | `KRAM · RUNS ATEM` (facts §D) |
| v31-20.07 (the byline) | `NELEH` | `NELEH · NOPEAI BOARD` |
| S3.04 (her tile's own label) | — | `RIMA TAMURI · INTERIM CEO` |
| S4.08 | `ADELINA` | `ADELINA · CO-FOUNDER` |

The gag cards (Tasya, Sirrah, Nedib, Sucram, Nesnej, the Orb, Neleh's board-side card, Ttemme, Terb) are unchanged, and 23.02's reminder shows each board member's small avatar with the name, so Mada has a face before the blow. **`(REPORTED)`-type labels: none.** No reference is unreadable without one: the Mario offer is in Neleh's line, the investors are a news ticker [H], and the Q\* vault is a deliberate tease.

### 10.4 The calibration ledger, item by item

| § | What it asks | Draft 8.1 |
|---|---|---|
| 1 Pacing | add scene, not air; every hold changes | the holds that carried V.O. are shorter (draft 8); 8.1 cuts the static blog screen to a typing post and turns four place changes into line-led J-cuts |
| 2 Conversation | talk away from Mas earns time only by changing his situation; cut recap and procedure | every board-side exchange now changes his situation (his job, his ally, his leverage, his replacement); the read-aloud, the thank-you, the Sunday restatement and Alyi's echo go (−15.7 s) |
| 3 Pointers | world → line → plate with one relation word → 0–2 labels | §10.3; no labels |
| 4 Reference density | attach, don't cut | the Atem thread is now his prediction and a key ring you can read; the order is a tab he opens; the Tidder post comes out of the forum |
| 5 The voice | 10–14, each line only-the-voice | §10.2 |
| 9 Agency | one to three decisions per act with a visible alternative; full sentences when he asks or decides | the call is a full ask; every act's decisions are in [agency-v32 §2](agency-v32.md) |
| 10 Scope | "contested" is the firing's reasons, the staff letter's authorship, testimony, the memo | his public acts (the posts, the walk-in, the tour, DevDay) are played as moves; he still takes no action about Neleh's paper (it touches the firing's reported reasons, facts #36) |
| Diagnosis | the chain test | [agency-v32 §5](agency-v32.md): every act retold as "So Mas… / Because of that…"; one weak link (the bay's clip), kept at one shot as the balance pair |

### 10.5 The audit, item by item

| Audit | Status in draft 8.1 |
|---|---|
| #1 the inner voice narrates | done (draft 8, then §10.2) |
| #2 Act Three watches a monitor; the post has no trigger; the LEDs omen | done: DevDay live, the surge, the switch-off (draft 8); the post comes straight from the forum's raised hands and 20.02 (the LEDs) is cut (8.1); no Mas action on Neleh's paper (guardrails) |
| #3 3:40 off screen; give him the badge, then cut to their CCTV | done (8.1): the lobby moves inside the board's side, before their Sunday, and steps out into their camera |
| #4 tag → outro seam | **for the sound pass** |
| #5 "as you know" at 4:49, 6:16.7, 14:14.5, 15:46.7 | done: v32-a1-0005, v32-a1-0007, v32-a4-0001, and Neleh's Sunday first line cut |
| #6 the read-aloud device twice | done: Neleh's excuse and read cut; the post types itself; Terb keeps his |
| #7 the key count | done: both V.O. lines cut; the ring large at v32-9.10k; the thirteenth key large at v31-18.00b |
| #8 the act-out glass | picture note on 17.12 (a face on the water, no body, no ring; fallback cut 17.12, −4.5 s) |
| #9 the duplicate tagline | done (draft 8: the V.O. cut; Alyi's line is the only one) |
| #10 Alyi's 6.3 s hold | done (draft 8: 2.5 s) |
| #11 no dialogue leads a place | done: four J-cuts (12.02 Nole 0.5 s, S3.06 "Is this a coup?" 0.6 s, S5.11 Tasya 0.8 s, S8.08 the memo 1.0 s), marked in the script and the plans |
| #12 real quotes recited face to face | partly: "we made them dance" gets Gerg as a reacting listener; "You can call it this way" already lands on the employee who asked; "below them, above them, around them" keeps its optional podcast mic |
| #13 the card's softened downbeat, #14 the stale gap | **for the sound pass** |
| #15 smaller blanks | Ttemme's "a different one": kept as a gag (no public-record reason can be said in a line); "That is the company telling us.": Alyi's reflection turns to the phones; the flame: an MCU with Radnus's face; the tally marks: framed legibly at v31-18.00 |
| A.2 #4 Sydney's rule, Sirrah's catchphrase | done: "House rules, Sydney." (the timer's face reads `5 QUESTIONS`); Mario's finger goes up on "trained" |
| A.2 #6 THE PLAN's thesis line | kept on purpose: "Not the other way round." is the setup that "That is the company telling us." turns |
| A.2 #8 the clone's "Health insurance." | kept (low priority; the gasp and the card are the joke) |
| Holds: 8.04's static wide | shot note: one cut-in on the founders for "Someone else built that?" (the shot pass) |

**The 14 unintended out-of-the-blue beats (B.2), against draft 8.1:** 1 the post and the LEDs: fixed · 2 the glass: picture note · 3 the key count and Atem: fixed · 4 the tally marks: legible at v31-18.00 · 5 Ttemme: kept as a gag · 6 "the company": fixed in picture · 7 the antagonists: Neleh's plate, Mada's avatar · 8 the flame: fixed in picture · 9 the collar: the ring clinks against it · 10 Elgoog's speakers: a cut-in (shot note) · 11 Sydney: the rule trimmed · 12 the lit window: one shot, ≈ 4.8 s with the hailstone · 13 the paper → the order: he opens the next tab · 14 the count: shown on the phone.

**The 19 "carried along" places (B.3), against draft 8.1:** fixed by his move: the odometer (he posts the million), Mario's split (his click), the White House (his seat, the lens), the Senate (his proposal), the tour (his thumb, his stamp), the hands runner (he turns to his keys), the order (he opens the tab, then switches off), DevDay (live), the board's side (his lobby inside it). **Carried on purpose, each on the spine as a reaction to his move:** the code red, the GNIB launch, the bay (the balance pair), the rooftop, Atem on the monitor, Neleh's paper (guardrails), the reminder, the firing (the designed shock) and the avalanche (he never orchestrates the revolt).

### 10.6 Takes (Kokoro and EL): the complete v3.2 list

| Seg | Id | Who | Line | Take |
|---|---|---|---|---|
| act1 | v32-a1-0001 | Gerg | Okay, the build's green. | cut from e1-a1-5-01 (0.00–1.15 s) |
| act1 | v32-a1-0002 | Tasya (phone) | Mas. | new |
| act1 | v32-a1-0003 | Mas | it's the bill. we're going to need more servers. | **new (8.1)**, replacing the reuse of e1-a1-7-02 |
| act1 | v32-a1-0004 | Tasya (phone) | I'll bring a pen. | new |
| act1 | v32-a1-0005 | Gerg | Elgoog's going to hear about this from a search box. | **new (8.1)** |
| act1 | v32-a1-0006 | Tasya | House rules, Sydney. | **cut (8.1)** from v31-a1-0006 (its first sentence) |
| act1 | v32-a1-0007 | Oigneb | You signed it. Now put the iron down. | **new (8.1)** |
| act2 | v32-a2-0001 | Mas | …i would form a new agency that licenses any effort above a certain scale of capabilities… | new [P] |
| act2 | v32-a2-0002 | Senator (O.S.) | Would you come and run it? | cut from e1-a2-15-10 (5.39–6.85 s) |
| act3 | v32-a3-0001 | Mas (stage) | and today, you can build your own chatgtp. | new, the stage chain |
| act4 | v32-a4-0001 | Neleh (call) | Step three. Rima, the staff will come to you now. | **new (8.1)**, the call chain |

**Totals:** 7 new reads (Kokoro), 4 cuts from existing takes, 0 reuses; **ElevenLabs needs all 11.** Device changes with no re-read: e1-a3-22-01 and e1-a3-22-02 (monitor → stage). **No V.O. takes are needed:** the two restored lines have their takes (`e1-a3-18-04`, `v3-vo-24`).

**Dropped from the lock in 8.1** (the files stay on disk): V.O. v3-vo-08, v31-vo-06, v31-vo-07; lines e1-a1-9-09, e1-a1-12-02, v31-a1-0006 (replaced by its cut), a5-27-06, a5-27-07 (the blog read; the post is on screen instead), a5-27-09, a5-27-12, v31-a4-0004. **Back in 8.1:** e1-a3-18-04, v3-vo-24.

### 10.7 New art and picture notes added by 8.1

- **v32-9.10k:** the key ring at insert scale: eleven keys and a beige twelfth stamped `NOPEAI` (the rail `FEB 7, 2023` moves onto it).
- **9.09:** the ring's clink against the new collar (picture and SFX).
- **v31-10.03:** the egg timer's face reads `5 QUESTIONS`.
- **12.01:** the clipboard letter's own line `6 MONTHS` under its header.
- **13.02:** Mario's finger going up on "trained".
- **13.10:** an MCU of Radnus's face with the flame (replaces the ECU).
- **14.03:** the repost click inside the lit-window shot (14.04 folds in).
- **16.01:** his thumb on a phone in the poster's corner for "…no plans to leave".
- **17.12:** the reflection redrawn on the water's surface, his face only, broken by the crack (fallback: cut the shot).
- **v31-18.00:** the two faint marks framed legibly; **v31-18.00b:** the thirteenth key large.
- **v31-20.07:** the byline plate `NELEH · NOPEAI BOARD`; **v31-20.08:** he closes the paper and the next tab opens.
- **23.02:** the reminder's hover avatars (Mada's face under his spinner).
- **S3.03:** the post typing itself in its own UI; Neleh's lips moving, silent.
- **S3.04:** Rima's tile label `INTERIM CEO`.
- **S4.02:** Alyi's reflection turning to the phones.
- **v32-S5.00:** now ends by stepping *out* into the CCTV grade and onto the boardroom's wall screen (colour down, grain up), instead of stepping in.
- **S5.03:** the app's heart count on screen, 406 → 407 → 406.
- **8.04:** one cut-in on the founders for "Someone else built that?".
- **Un-draw:** 20.02 (the LEDs stopping).

### 10.8 For the sound pass (not script)

The audit's #4 (tag → outro seam), #13 (the card's downbeat), #14 (the stale gap into Sydney), the composers' check on three chord attacks (§C.2), and the four new J-cut lines (§10.5, #11). The lobby's J-cut is now from S4.08's dial tone into the lobby by day, and its L-cut the CCTV hum into S4.09; S4.15 goes back to v3.1's J-cut, the dark room's drone. Re-run the audit's measurements on the v3.2 film.

### 10.9 Open, added by 8.1

1. **"she'll go for three." and "gerg. he'll say he's compiling."**: kept against the audit's keep list (§10.2). The lead's call.
2. **The lobby inside the board's side** breaks "on their side we never see him" for 8 s. It's his public act and it's close on him; the rule it bends was about the voice. The lead's call; the fallback is draft 8's placement (the head of his side, told twice the other way round).
3. **The blog post read silently:** the board's public reason is now printed, not voiced. If the lead wants it heard, restore a5-27-07 without the "I'll read it once" excuse (+5 s).
