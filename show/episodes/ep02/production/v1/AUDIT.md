# Ep2 v1: AUDIT of the existing plan, before we build

> **Status: written 2026-10-08 for the Ep2 v1 one-go build.** The showrunner asked for the whole of Episode 2 in one go, with no notes in between: "i want you to attempt making the entirety of episode 2 in one go now using all the learnings up to now". This audit checks the Ep2 plan on file against what Ep1 taught us, and recommends a default for every call the showrunner would normally make, decided the way their recorded notes point.
>
> - **Read with:** [LEARNINGS.md](LEARNINGS.md), the binding checklist from Ep1. Rule ids like W5 or R4 below are its rules.
> - **Changed:** nothing outside this file.
> - **Every recommendation here is a default for the v1 build,** written to be adopted as is. The flow document (LEARNINGS R2) records each one as a choice row with its source, or overturns it with a reason.

**What I read.**
- In `show/episodes/ep02/`: `outline.md`, `beats.md`, `flashbacks.md`, `gags.md`, `intro-slot.md`, `facts.md`, `open-questions.md` (all 37 items) and `script.md`. For the script I read the whole teleplay body (sc 1–23), Writer's notes §1–§10, and the dialogue pass 5 log; the earlier revision logs I only skimmed.
- **Bible and timeline:** the Ep2 row of `show/bible/ml-concepts.md`; `show/bible/motives-and-the-race.md` (all of it, §5 for Ep2); `show/timeline/flashback-map.md` §0, §2 (Ep2), §2a and §4.2; `show/timeline/season-flashbacks-overview.md` §4.
- **Production:** `show/production/season-revision-plan.md` §4; `show/production/SHOWRUNNER-NOTES.md`; every memory file listed in `MEMORY.md`.
- **For continuity:**
  - Ep1's final transcript (`show/episodes/ep01/production/full-v3/lock-v35-transcript.txt`) and the end of its script, sc 30–33;
  - `proposal-v35.md` (the understanding threads and "The season, briefly");
  - `show/bible/calibration.md` (§5 and §9 targets), `show/bible/guardrails.md` §3–§4 and `show/bible/style-range.md` §6.2.

**Contents:** [0. The short version](#0-the-short-version) · [1. The current plan](#1-the-current-plan-scene-by-scene) · [2. Conflicts with the lessons](#2-conflicts-with-the-lessons-and-the-fixes) · [3. Decisions still open](#3-open-questions-that-still-need-a-decision) · [4. What to keep](#4-what-draft-54-does-well-and-must-keep) · [5. Facts to re-verify](#5-facts-to-re-verify-before-lock) · [6. Handoff](#6-handoff)

---

## 0. The short version

1. **The plan of record is script draft 5.4 (2026-09-26), not draft 4.** The brief and every companion file (outline, beats, facts, flashbacks, gags) say "staff draft 4". The script went through five more passes the same day: conversations that play out, scene craft, and naturalness. Story runs ≈ 22:03 now, against draft 4's ≈ 17:10. The companion files are stale against it in dozens of places (§1.3). Every draft predates Ep1's v3.4–v3.5 lessons (2026-09-27 to 09-29).
2. **Mas has no plan in his head.** He has 4 V.O. lines (18 words), none of them a plan or a higher-level goal, and none in Act Three. The calibrated target is about 14–18 lines, most of them his plan (W5, W6). This is the biggest gap. §2.1 maps 12 lines to the moves they belong to.
3. **The episode happens to Mas more than he makes it happen.** Run the chain test (W1) on draft 5.4 and three of its six blocks go "and then". He watches news on three screens, and he stands outside the phone deal that was his own distribution win. §2.2 attaches each act to a move of his.
4. **Two agreed season items are missing.**
   - **The ML concept is absent.** "Learned, not programmed" via AlphaGo's Move 37 was agreed 2026-09-29, after draft 5.4, so the script has no trace of it (§2.9).
   - **Alyi's full motive flashback is a 25 s mood piece,** against an agreed 45–90 s shaped as want → obstacle → turn (§2.3).
5. **The Move 37 trigger as mapped is anachronistic.** `ml-concepts.md` says "Nole's 2016 email about MINDDEEP rises as a ghost". That email (Feb 22, 2016, "extreme mental stress") was first published with the court exhibits in Nov 2024. The Mar 5, 2024 post the séance summons doesn't contain it. Its Dec 2018 "0%" email does name DeepMind and Google, so it becomes the trigger (§2.9).
6. **Neleh's podcast, the answer Ep1 withheld on purpose, isn't in the script.** It sits in the outline, the beats and the setups file. In the script it appears only on §9's "restore if short" list. It goes in (§2.12).
7. **Story, not documentary.** About 2:10 of the episode is news Mas only watches: the RUMPT hill, the monitor, the lobby TV and the tag's seven-item run. Two [K] items also sit on rails as plain fact (`MAS'S CHIP PLAN: $5–7 TRILLION`, `EXIT PAPERS: STAY QUIET OR LOSE YOUR EQUITY`). §2.4 cuts the cards that are only documentary. It folds the hill onto his monitor and makes the tag his.
8. **What's already strong stays:**
   - the séance;
   - THE PLAN's accurate `OMNI`;
   - the spotlight eclipse;
   - the Bay Bridge and the Forecaster;
   - the walled garden;
   - the silent white room with the IOU;
   - the conversations that play out (XEL ≈ 81 s of speech, the séance ≈ 61 s);
   - the sound plan of one cue per sequence;
   - most of the matched-object seams.

   §4 is the keep list.
9. **Runtime after the fixes:** story ≈ 22:52 and runtime ≈ 23:34 (Ep1 shipped 23:31.58), [J] from word counts and the draft's own ledger (§2.14). Length goes in where the story needs it and comes out of the after-the-turn tag (R4). The 43 s credits placeholder becomes Ep1's 10 s Orb outro.

---

## 1. The current plan, scene by scene

### 1.1 Draft 5.4's running order

Timecodes are the script's (Writer's notes §1 and each header), planned from word counts at Ep1's voice paces. **Nothing in drafts 5–5.4 has been recorded or heard** [J]. "D4" is the draft-4 length the outline still describes.

| Sc | Place · date | What happens | Runs (story clock incl. intro) | Len | D4 | V.O. · flashback |
|---|---|---|---|---|---|---|
| **COLD OPEN** | | | | | | |
| 1 | NopeAI lobby · Feb 15 → 29, 2024 | SELBEEP's AROS mammoth: near-photoreal in the wall screen, pixel when it steps out. A six-fingered extra; "It understands physics." / "Directionally.". YRREP freezes his cranes ("Our first review."). The thuds are talked through ("The mammoth's on four."). The doors blow in on `YOU PROMISED!!!`, the `PAUSE` sign shows in the door glass, and DOT hangs `SUED MAS: 0`. The `WHERE IS ALYI?` flyer lands on the complaint | 0:00–1:12 | 1:12 | 0:57 | — |
| — | Intro + filename card | Five spoiler-safe changes; subtitle `back by popular demand` | 1:12–1:44 | 0:32 | — | intro line "her" |
| **ACT ONE · THE SÉANCE** | | | 1:44–7:57 | **6:13** | | |
| 2 | THE PODIUM hill · Feb 2 | RUMPT, hands only. Real fragments on the stand-up's lower third [H]; "So scary. What's it worth?"; the balloon slips loose | 1:44–2:14 | 0:30 | 0:22 | — |
| 4 | NopeAI boardroom · Mar 5 → 8 | **THE EMAIL SÉANCE.** Nole crashes in with his case ("It was supposed to be open."). OPEN → NOPE with three hands on the planchette, then the cow and the billions ghost. "You kept them." / "we keep everything.". **F2.3** (Feb 20, 2018, the goodbye all-hands, the sip), then "You sat at the back." and "Keep that too. See you in court.". **Coda (Mar 8):** Terb reads the review's finding, both halves; "So, your seat's where you left it, Mas."; OMIS's nameplate | 2:14–5:21 | 3:07 | 2:30 | V.O. 1 "i just ask the questions." · F2.3 4:22–4:38 (0:16) |
| 6 | XEL's studio · Mar 18 | Lex #419, every quoted line real. The mic grows on XEL's pauses: the "no." ladder, "i love alyi…", the $7T denial, "the mic?" / "Yes.", `PART 1 OF 6` | 5:21–7:09 | 1:48 | 1:10 | — |
| 7 | Cathedral cross-section · Mar 19 | THE HUMANIST moves into Macrosoft's basement; Tasya's welcome is the lease; "We keep a spare."; "A tenant." lands on Mas four floors up. **Act-out 1:** the key ring's jangle | 7:09–7:57 | 0:48 | 0:27 | — |
| **ACT TWO · "her"** | | | 7:57–12:22 | **4:25** | | |
| 8 | Dark room monitor · Mar → Apr | He swipes away the RULEBOOK notification (`SNOOZE`); TRAWETS's three-CEO lineup; the RUHTRA thumbnail egg | 7:57–8:06 | 0:09 | 0:17 | — |
| 9 | Demo stage, backstage · May 13 | "Before I've asked. It does that."; "is it ready?"; "it's all yours." / "It is. Enjoy the view."; "Then it freezes live, and I keep talking."; the voice panel's five hellos | 8:06–9:09 | 1:03 | 0:32 | — |
| 10 | THE PLAN · `OMNI` | Rima voices it: the three-model relay drops tone and laughter through a grate, and now one model hears, sees and talks. Steps 1–3: 232 ms, out today with a tiny RADNUS on Tuesday, free users. An empty lowercase bubble tears the sheet | 9:09–10:12 | 1:03 | 0:44 | — |
| 11 | Demo stage · May 13 | **"her" ECLIPSES THE DEMO.** The spotlight slides off Rima one step per laugh. Mas types "her"; "…Like the movie? The one where he falls for the voice?"; the blimp takes her light. "…and that's the demo."; `is it safe?` → "It's free!" | 10:12–12:06 | 1:54 | 1:29 | — |
| 12 | Front row · cont. | The empty `RESERVED: CHIEF SCIENTIST` seat; Alyi's reflection turns away. `MAY 14 · ALYI LEAVES NOPEAI`. **Midpoint act-out:** the cue stops mid-phrase | 12:06–12:22 | 0:16 | 0:16 | V.O. 2 "people come back. i did." |
| **ACT THREE · WHERE'S ALYI?** | | | 12:22–16:39 | **4:17** | | |
| 13 | Lobby · May 15 | Flyers on the pillars; "If he comes back, do we take these down…?" / "leave them up."; the bipartisan roadmap on the lobby TV won't fit through `FLOOR` ("We'll hold a forum on it.") | 12:22–12:53 | 0:31 | 0:16 | — |
| 14 | Open floor · May 15–17 | The point-and-click search (reflections, the greyed `come back`); BUKAJ in the humming chair; EKIEL's post and dominoes; the IOU into the inventory; the `SUPERALIGNMENT / SAFETY TEAM` plate unscrewed | 12:53–13:50 | 0:57 | 0:50 | — |
| 15 | Alyi's office · May 17 | TPOOL (`welcome back, mas`), "where u at?", the pin. **F2.2:** the 2022 party chant, then the 2023 effigy fire. Receipt paper noses under the door | 13:50–14:36 | 0:46 | 0:44 | F2.2 14:04–14:29 (0:25) |
| 17 | Bay Bridge · May 17–22 | **THE NDA ACROSS THE BRIDGE (the S3).** The Forecaster's terms, "take your time.", "Already did. It's the one thing I didn't need a number for."; the apology post one trim per honk; the storm with a blank letterhead; `A FAMOUS VOICE OBJECTS`. **Act-out 2:** `VOICE 5 [PAUSED]` and `ALYI · LOCATION UPDATED` | 14:36–16:39 | 2:03 | 1:53 | — |
| **ACT FOUR · THE ONE DOOR** | | | 16:39–21:23 | **4:44** | | |
| 18 | Lighthouse / boardroom split · May 28 | Lanyards drop over EKIEL and over Mas. Terb reads the committee's task: "present." / "also present."; Mario annotates the resignation; "It's that we might win."; O2.2's Golden Gate box. **No Neleh inset** | 16:39–17:58 | 1:19 | 0:39 | — |
| 19 | Lobby watch party · Jun 10 | HARAS and Gerg: "Compute. Different compute."; the cheer cuts off "And profit—". Gerg: "You ever miss being up there?" / "i was up there once. they let me hold the clicker." **F2.1**, then THE WALLED GARDEN: `GUEST`, the raised hand, IRIS 99%, "I see they let your chatbot in." / "as a guest."; the gate locks with Mas outside | 17:58–20:17 | 2:19 | 1:55 | V.O. 3 "they ask first in there." · F2.1 19:18–19:30 (0:12) |
| 20 | Lobby / zAI split · Jun 10 → 11 | The empty Faraday cage; "If they go through with it…"; caller ID `MAS`, `MISSED CALL · MAS`. Jun 11: the state suit is dropped, `(FOR NOW)` | 20:17–20:54 | 0:37 | 0:32 | — |
| 22 | ISS, the white room · Jun 19 | One door, a `NO` mat; the IOU (`NEVER DELIVERED`) under the door; Alyi's reflection faces him once; the IOU comes back and he pockets it | 20:54–21:23 | 0:29 | 0:29 | — (silent by design) |
| **TAG · AUGUST** | | | 21:23–22:35 | **1:12** | | |
| 23 | Dark room monitor · Jun 13 → Aug 22 | The fog replay ("We should have the most."); the Jul 8 platform card; the Aug 5 refiled suit; the Aug 11 "A.I.'d" claim and the Orb's fact-check; ISOLEP and the hydra; "I accept!"; the balloon tied to the podium; the string goes taut | 21:23–22:35 | 1:12 | 1:08 | V.O. 4 "just the news." |
| — | Credits (placeholder) | | 22:35–23:18 | 0:43 | — | — |

Sc 3, 5, 16 and 21 are OMITTED (numbers kept since draft 1).

### 1.2 Totals (draft 5.4, planned)
- **Story ≈ 22:03; runtime ≈ 23:18** with the intro, card and 43 s credits. That's about 1:18 past the format's 22:00 frame. Ep1 shipped at 23:31.58.
- **By act:**
  - Act One is 6:13, the only act over its flex (4:15–5:15).
  - Acts Two to Four are 4:25, 4:17 and 4:44.
  - The S3 sits at 63–71% of runtime.
- **Flashbacks:** ≈ 53 s (F2.3 0:16, F2.2 0:25, F2.1 0:12), under the 60–150 s guide.
- **Speech:** ≈ 8:58, 134 voiced lines and 1,264 words.
  - Mas has 27 lines, 157 words, median 3 words, ≈ 14% of the speech.
  - Mas share on screen is ≈ 77% (est.).
- **V.O.:** 4 lines, 18 words (§2.1).

### 1.3 The companion files are stale against the script
open-questions #33 lists the drift; it's still there. **For v1, `script.md` is the authority.** Each companion file is regenerated from the v1 script when it's written, and not patched line by line in between.

| File | Says | Script 5.4 has |
|---|---|---|
| `outline.md` | staff draft 4; story ≈ 17:10, runtime ≈ 18:25; sc 20's split closes; Nole's podcast "restored" in sc 18; THE HUMANIST's plate `MACROSOFT'S SPARE` | draft 5.4; ≈ 22:03 / 23:18; the split held open; no inset; `MACROSOFT'S NEW AI CHIEF` |
| `beats.md` | draft 4 lines at #6, #12, #13, #17, #19, #20, #22; the unsent ghost; the ELPPA memo; `KORG 5`; "I already took it." | each cut or rewritten in 5.1–5.4 |
| `facts.md` | synced to draft 4; row 12's rail; row 32's tagline; `(REPORTED)` on rails; §B missing four real lines | Terb's reading; `EX-NOPEAI.`; no on-screen labels; Lex's relationship exchange and the May 28 sentence are on screen |
| `flashbacks.md` | F2.2 dated 2022, fire first, glyph on his eyes; pin `2022` | the party (2022) first, then the fire (2023); glyph on the room; pin `2023` |
| `gags.md` | four Orb toasts; "Thank you." to Radnus; the 70 → 71 clipboard | three toasts; "as a guest."; the clipboard is cut |

---

## 2. Conflicts with the lessons, and the fixes

Each entry gives the lesson and its source, where draft 5.4 conflicts, the fix, and its cost. Costs are story seconds, [J].

### 2.1 Mas's inner voice: his plans and goals, never forecasts (W5–W8)

**The lesson.**
- SHOWRUNNER-NOTES 000: "too much just predicting what someone is going to say next, rather than useful nrration/insight into what he's thinking/planning"; "this should be thinking about higher level goals".
- Calibration §5's target: **about 14–18 lines, in every act, most of them his plan**; at most one prediction an episode. Ep1's final has 17, plus the intro line.

**Where 5.4 conflicts.**
- **Four lines, 18 words, written to the pre-v3.4 rules.** Writer's notes §2 aims for "small words and one catch… none is a negation" and cut 8 of the reel's 12.
  - "i just ask the questions." is a wink (W7 bans winks).
  - "people come back. i did." is a want; it works.
  - "they ask first in there." is a noticing that plants the want; it works.
  - "just the news." is a shrug.
- **No line states a goal behind a move,** and Act Three has none at all.
- The season plan §4 still says "keep to 5–8 lines". Calibration (2026-09-28) supersedes it.

**The fix.** Rebuild the V.O. map: about 12 lines, every act carrying at least one, most of them the goal behind a public move. Each must pass W7's test: no "plan", "long game", "all along" or thesis words, ordinary on first watch and foresight on a rewatch. **Sample lines are direction for the writer, not final words.**

| # | Where | The move on screen | The goal it voices | Sample line (direction only) | Status |
|---|---|---|---|---|---|
| 1 | sc 4, open | **New:** Mas clicks `Publish` on the Mar 5 post, and the planchette's first slide follows (§2.2) | Get the record out in Nole's own words before a court reads it | *a judge reads these next year. everyone else reads them tonight.* | new |
| 2 | sc 4, Move 37 | The stone clicks; the wall of knobs turns (§2.9) | What it means for the race: compute (Ep1's "then a lot more computers.") | *then the race is for computers.* | new |
| 3 | sc 4, coda | His nameplate clicks into its slot | The seat is a step, not the goal | *the seat was the easy part.* | new |
| 4 | sc 8, the lineup | Three cardboard CEOs, his landlord's beside him | Compute through a landlord until he can own it (Ep4's GATESTAR pays it) | *three ceos. one of us pays rent.* | new |
| 5 | sc 9 or 10 | **New:** Mas's finger circles `MON` on THE PLAN, beside the tiny RADNUS on Tuesday (§2.2) | Ship first; take the day before Elgoog's | *elgoog has tuesday. we have monday.* | new |
| 6 | sc 12 | The empty seat; the reflection turns away | His want: people come back | "people come back. i did." | **keep** |
| 7 | sc 15 | After "where u at?", before the pin drops | He wants Alyi back, in Alyi's own public words (Ep1's regret post) | *"reunite the company." his words.* | new |
| 8 | sc 18 | After "also present." | The room where it's decided; Ep1's "someone gets to be in the room." | *whoever checks the work should be in the room with it.* | new |
| 9 | sc 19 | The stream: `AND LATER THIS YEAR: CHATGTP.` | Distribution: a billion phones; the platform | *every phone they sell. they can keep the stage.* | new |
| 10 | sc 19, the garden | The bubble raises its hand and waits | The want to be asked (sets up Ep12) | "they ask first in there." | **keep** |
| 11 | sc 23 | The Orb's scan: `verified: human (all of them)` | Proof of personhood, his other company; pays Ep1's "my other company. for when it gets harder to tell." | *harder to tell. right on time.* | new |
| 12 | sc 23 | The refiled suit lands, THUD | The one caught line | "just the news." | **keep** |

- **Cut:** "i just ask the questions." (a wink; #1 and #2 replace it in the same scene).
- **Silent at the contested set (W8):**
  - the "her" post and the voice objection;
  - the exit papers and what he knew;
  - Ekiel's post and the team's plate;
  - the IOU's "never delivered";
  - Neleh's podcast (the firing's reasons);
  - Alyi's reasons for leaving;
  - Nole's motives;
  - F2.1–F2.3 (no V.O. inside a flashback);
  - the white room (the silent one-on-one).
- **Room for 2–3 more lines** if the reel finds an act where he reads as distant. Act Three is the likeliest, at sc 14's spread.
- **Cost:** ≈ +0:20. Most lines ride picture that's already running.

### 2.2 Agency: the episode is his rise, driven by his moves (W1, W9)

**The lesson.**
- SN 0: "if he is the main character he should be showing agency".
- SN 00: "it feels like watching a random sequence of events".
- Calibration §9: one to three decisions an act, each with a visible alternative, each causing the next scene.

**The chain test on 5.4,** with each act told as "So Mas… / Because of that…":

| Block | 5.4 reads | Mas's move in 5.4 | The fix |
|---|---|---|---|
| Cold open | The suit arrives; he shakes his head at a `0` plate | none | Fine for a cold open: it's the obstacle. Keep |
| Act One | The suit → the séance → his seat back → a podcast → his landlord's spare | the séance's questions (the publishing is Gerg's line, "We put some of your old emails up today.") | **He clicks `Publish` himself** at the séance's open, and Nole crashing in is the result (V.O. #1). **Sc 4 → sc 6:** his phone takes XEL's booking in Ep1's calendar UI (`Accept`, no hover), which causes the podcast scene and gives it a matched object (§2.5) |
| Act Two | The monitor → backstage → THE PLAN → the demo → the empty seat | "is it ready?"; types "her" | **He owns the Monday.** THE PLAN's step 2 (the tiny RADNUS on Tuesday) gets his circling finger and V.O. #5, so stealing Elgoog's news day is his scheme, not the paper's. "her" stays a typed post with no V.O.; its cost is Rima's light |
| Act Three | Flyers → the search → the office → the bridge | the search; "take your time."; the apology post | Mostly fine: the apology is a real decision with a visible alternative (silence). Add V.O. #7 in sc 15 so the search is plainly his want |
| Act Four | The committee → the watch party → the garden, where he's shut out → the cage → the white room | "present."; the pocketed call; the IOU under the door | **The phone deal was his distribution move, and 5.4 stages it as his exclusion.** Keep the garden and `GUEST` (they're the episode's best image of the cost), but let V.O. #9 land on the stream's cheer first, so he wins the reach and is still a guest. On the committee, he takes the lanyard from Terb's hand (invented small stakes, no claim about who chose the members) |
| Tag | Six news items on his monitor; "just the news." | none | His other company's work (the Orb's fact-check) and V.O. #11 make the tag his (§2.4) |

**The through-line needs rewriting to match.** The outline's "Mas wants to look untouchable" is a pose, not a goal. A proposed replacement:

> Back in charge, Mas turns the comeback into reach. He answers Nole's suit with Nole's own emails, takes Elgoog's news day with one word, sits on the committee that checks his own company, and puts his chatbot in every ELPPA phone. What he can't arrange is the people: the safety team leaves one by one, and Alyi, the one person he wants back, goes through a single white door.

It claims no cause for any departure (W8, W9).

**Cost:** ≈ +0:06 (the Publish click, the booking, the circled Monday).

### 2.3 Motives for every major player, Mas foremost (W10, W11)

**The lesson.**
- SN 0000: "for none of the people including mas it is never shown why"; "all key characters motivations fleshed out further… still with mas in the forefront".
- motives-and-the-race §5 and flashback-map §2a: from Ep2, one full motive flashback (45–90 s, want → obstacle → turn) for the featured player. **Ep2's is Alyi's bonfire.**

| Principal | Want | Shown in 5.4 by | Gap | Fix |
|---|---|---|---|---|
| **MAS** | In the room; the thing everyone uses; to be asked | "they ask first in there."; "i was up there once. they let me hold the clicker." | **motives §5 has no Ep2 entry for Mas, and the episode has no goal lines** | §2.1's V.O. map; §2.2's moves. F2.1 becomes a motive micro once V.O. #9 frames it (last time he was an app on their stage; this time their phones carry him). Add an Ep2 row to motives §5 at the bible sync |
| **ALYI** | That it goes well; to build the safe one, alone | F2.2: a 25 s chant and fire; reflections | **No want → obstacle → turn; under half the agreed length; the IOU's origin is never shown** | Rebuild F2.2 as his full motive flashback, spec below |
| **NOLE** | Credit and control | The séance, F2.3, the cage, the refile | His fear (being behind Elgoog) is never shown, so "billions per year" reads as greed only | The Move 37 concept (§2.9) shows the fear his Dec 2018 email names. F2.3 can echo it with one stone on the 2018 table (§2.8) |
| **MARIO** | Get there first, carefully | Recruits Ekiel; "It's that we might win." | — | Keep (his scheme is the recruiting) |
| **TASYA** | Own the building whoever wins | The Humanist's lease, "We keep a spare.", "A tenant." | — | Keep (his scheme is the hedge) |
| **GERG** | That the building never stops | "Compute. Different compute."; his one look-up | — | Keep |
| **NELEH** | That the charter means what it says | **Missing** (the inset isn't in the script) | The agreed payoff | §2.12 |
| **RIMA** | To own her demo | "It is. Enjoy the view."; "…and that's the demo." | No aftermath (§2.6) | A wordless wings beat |
| **RUMPT** | Fear as a price tag | The balloon, "We should have the most." | — | Keep, folded onto Mas's screens (§2.4) |

**F2.2, rebuilt as Alyi's full motive flashback** (≈ 50 s against 25 s; FC rule: enter on a trigger, exit on a matched object):

| Beat | When | We see | Tag |
|---|---|---|---|
| In | May 17, 2024 | TPOOL's pin ripple turns orange and becomes string lights (kept) | — |
| **Want** (~12 s) | Dec 2022 | The holiday party. A silhouette in Alyi's profile raises a hand, and the chant builds from one voice to all: "FEEL THE AGI!" The racks hum along; the glyph plays on the room, never in his eyes | [V] Atlantic, Nov 19, 2023 |
| **Obstacle** (~15 s) | 2023 | The offsite: the `UNALIGNED` effigy burns, with Alyi in the lodge door. Beyond the trees, the campus windows glow with the product's user counters climbing: the race runs the racks. Picture only, no claim | [V] effigy; month [K]; the counters are [INVENTED] staging |
| **Turn** (~15 s) | Jul 5, 2023 | He and EKIEL at a whiteboard, `SUPERALIGNMENT · 4 YEARS`. A note goes up on his door: `IOU: 20% COMPUTE`, the note Ep1 planted and sc 14 just picked up. **The flashback shows where the IOU came from** | [V→P] the Jul 5, 2023 post: 20% of compute secured to date, over four years, co-led by Sutskever and Leike |
| Out (~5 s) | → May 17, 2024 | Match on the note: the 2023 note on the door → the same door in 2024, the note gone (it's in Mas's inventory) → receipt paper noses under it | — |

- **It pays three things:** Ekiel's card (`CO-LED THE SAFETY TEAM.`), the IOU's 20%, and the white room's "one goal and one product".
- **Guards:** no firing, no vote, no memo, no reason for his leaving (W8), no family; mysticism as his rhetoric, never clinical (GR §6); a generic tech space, no religious iconography (X10).
- **Cost:** ≈ +0:25.

### 2.4 A story, not a documentary (W2)

**The lesson.**
- SN 3: "the goal is a story, not a documentary".
- SN 00: "a spine of cause and effect… not a chronicle".
- GR §4 (calibrated 2026-09-28): [K] items go on screen only once upgraded, or as a character's claim.

**Where 5.4 conflicts.**
1. **The political C-plot plays as a news reel Mas watches** (about 2:10 in all):
   - sc 2's hill: 0:30, Mas-less, uncaused, and it runs the calendar backward from the cold open's Feb 29 to Feb 2;
   - sc 8's monitor;
   - sc 13's lobby TV;
   - the tag's seven dated items, one per beat ("the rail rolls like the launch-night odometer").
2. **Two [K] items sit on rails as plain fact:**
   - `RAIL: FEB 2024 · MAS'S CHIP PLAN: $5–7 TRILLION` [K] (sc 6);
   - `RAIL: MAY 17 · EXIT PAPERS: STAY QUIET OR LOSE YOUR EQUITY` [K] (sc 17).

   `RAIL: MAY 20 · A FAMOUS VOICE OBJECTS` is [K] too, but it upgrades easily (§5).
3. **The tag's Jul 8 quote card** and its "I accept!" [H] in quotation marks are documentary devices in a tag that should be Mas's.

**The fix.**
- **Fold sc 2 onto Mas's monitor at sc 8** (≈ −0:18). It plays as a replay in its own player UI, dated `FEB 2` the way the tag's `JUN 13` replay is dated, with the reporter's question, the [H] lower third and "So scary. What's it worth?" kept. The balloon slips loose off the monitor's edge and bobs in the dark room until the tag, where 5.4 already has it bobbing at the monitor. Act One then opens on the séance: the suit's direct answer.
- **Cut the $5–7T rail.** XEL's real question carries the number [P], and Mas's real denial answers it.
- **The exit-papers rail:** upgrade it (Mas's own May 18 post admits the provision; pull it) or cut it. The Forecaster's talk-through already says the terms in a character's mouth (GR §4's preferred route). **Default: cut the rail.**
- **The tag becomes his,** in four beats:
  - the fog replay, shortened to the race line;
  - the suit landing ("just the news.");
  - the Orb's scan, with V.O. #11;
  - the hydra.

  Then the balloon button and the hook.
- **Cut from the tag:**
  - the Jul 8 quote card; the plank still tears NEDIB's scroll, as picture only, which keeps the prop parity (GR §2 rule 4) and the Ep4 setup;
  - "I accept!" as quoted text; the six-fingered fans shoulder the balloon as picture.

  ≈ −0:12, and it shortens the act after the turn (R4).
- **Political balance after the cuts** (GR §2 rule 3):
  - **RUMPT:** the balloon, "What's it worth?", "We should have the most.", the false claim the Orb checks.
  - **The other side:** the bipartisan roadmap roast, which now weighs closer to RUMPT's lighter load. ISOLEP's critique doesn't count.
  - **Default:** as balanced. Update matrix row 2 (open-questions #3).

### 2.5 Natural transitions: caused, sound-led, matched objects (W12)

The seams that fail the cause or object test (the rest pass; see §4):

| Seam | 5.4 | Problem | Fix |
|---|---|---|---|
| Intro → sc 2 | A cut to the hill, Feb 2 | No cause, no Mas, the date runs backward | Fold sc 2 into sc 8 (§2.4). Act One opens on Mas clicking `Publish`, caused by the cold open's suit |
| sc 4 → sc 6 | A podcast sting pre-lap under the nameplate | Sound-led, but no cause: why is he on XEL? | Under the nameplate's click his phone lights with XEL's invite in Ep1's calendar UI. He taps `Accept`; the sting pre-laps; the mic's hop is the first image. Cause, sound and object |
| sc 8 → sc 9 | Glow → work light; the stage manager's count | Sound-led, no cause | With RUMPT's replay on the monitor, end sc 8 on the monitor's calendar: Mas drags the launch to `MON` (V.O. #5 can sit here or on THE PLAN). The count pre-laps |
| sc 17 → sc 18 | A DREAD sting; the beacon's motor pre-laps | Ekiel's arrival at the lighthouse has no link to his exit | Ekiel climbs the lighthouse stair carrying sc 14's box, the one he walked out with (a matched object, 0 s) |
| sc 18 → sc 19 | The quartet carries on | May 28 → Jun 10, no object | The boardroom TV, still on after the Neleh inset (§2.12), becomes the lobby wall screen's keynote: a screen-to-screen match, 0 s |

### 2.6 Arrivals and aftermaths (P3)

- **Rima has no aftermath** after the blimp takes her demo. Her Ep3 exit (Sep 25) needs a plant.
  - **Fix:** in sc 12, as the front row plays, Rima walks off into the wings past Mas and hands him the clicker. The beat is wordless, with no reason claimed: it pays "it's all yours." / "It is.", and on a rewatch it reads as her first step out. ≈ +0:04.
- **Neleh's podcast needs Mas's held face after it:** no V.O., a contested moment. It's in the +0:12 of §2.12.
- **The voice pause (May 20) has no human aftermath.** Default: none. Act-out 2's greyed `Hey.` and the bonk are its aftermath, and more would linger on the contested voice beat.
- **The rest arrive and leave well:**
  - the séance enters mid-ritual with the organ pre-lapped;
  - the watch party enters on a running keynote;
  - the white room arrives on the pin and leaves at a walk.

### 2.7 Fast exchanges, unhurried Mas (W18)

5.4 predates the tempo marks: it has no pace column, and its timing assumes uniform pickups (0.4 s a line). **The fix:** a tempo table in S35 §6's format for these exchanges:

| Exchange | Pace |
|---|---|
| Nole and Gerg's volleys at the séance ("Is this a séance or a deposition?" → "It's a blog post…"; "…That was a different me." → "Same email address, though.") | Quick, 0.15–0.35 s |
| XEL's "no." ladder | Quick, but the real pauses are XEL's (the mic's rule needs them) |
| The engineer and CHATGTP | Quick, one motivated cut-off |
| Haras and Gerg ("Compute." / "Different compute.") | Quick |
| Terb and Mas ("We do." → "present."; "…which is…" → "also present.") | Quick on Terb's side; Mas at 0.4–0.5 s |
| Radnus and Mas ("as a guest.") | Mas at 0.45 s |
| Gerg and Mas at the watch party; the Forecaster's talk-through; Terb's readings | Weighted |

Expect about −0:10 against 5.4's ledger [J], as an outcome, not a target.

### 2.8 Flashbacks that show the lab before ChatGPT, in partial progress (W11)

**The lesson.** SN 00000: "are we getting any openai development flashback besides the dinner? … use another partial progress more"; "a glimpse into the process that led up to chatgpt before llms when they were less sure in their exact way to agi".

**Where 5.4 conflicts.** Only F2.3 (Feb 2018) is pre-ChatGPT lab history, and it plays as a speech in a remapped boardroom. F2.1 is 2006–08 (pre-NopeAI), and F2.2 is 2022–23.

**The fix.**
- **F2.3 in NopeAI's first office.** Set it in Ep1's own `JUN 2018` set (Ep1 sc 8B, T3 cut-paper), four months earlier: fewer racks, the arena bots on one monitor, and a whiteboard with `AGI · ?` and three crossed-out approaches. It's the lab in partial progress, unsure of its way. One Go stone sits on a desk (the matched object from §2.9; it says "Elgoog" without a caption). The Semafor account ("fallen fatally behind Google", [V]) stays off screen, so nothing is captioned.
  - Continuity: the same room as Ep1's memory 1, so the device language matches.
  - ≈ +0:05; F2.3 runs ≈ 0:21.
- **Move 37 (Mar 2016)** is the episode's second pre-ChatGPT glimpse (§2.9).
- **Flashback total after the fixes:** F2.3 ≈ 0:21, the concept ≈ 0:22 (it counts toward the cap), F2.2 ≈ 0:50 and F2.1 0:12, so **≈ 1:45**, inside the 60–150 s guide.

### 2.9 One ML concept, in depth, without lecturing (W22, W23)

**The lesson.**
- MEM-ML and ml-concepts.md, agreed 2026-09-29: Ep2 explains "learned, not programmed: a neural network is millions of knobs nudged by examples, so nobody wrote the winning move".
- It plays at the Email Séance, through AlphaGo's Move 37, in about 20–30 s.
- Someone has a reason to explain it; a pixel-language visual carries it; it's technically right; Mas's V.O. says only what it means for the race.

**Where 5.4 conflicts:** it's absent. The draft is three days older than the agreement.

**The trigger problem, verified this pass.**
- The map's trigger is "Nole's 2016 email about MINDDEEP". That is Musk's Feb 22, 2016 email ("Deepmind is causing me extreme mental stress"). It **was first published with the court exhibits on Nov 17, 2024** (Tom's Hardware; Tortoise Media), eight months after the Mar 5, 2024 post the séance summons.
- The outline's guardrail limits the ghosts to the Mar 5 post's emails, so that ghost would be an anachronism.
- **The Mar 5 post does contain Musk's late-2018 email** putting OpenAI's chance of being relevant to DeepMind/Google at "0%" without "a dramatic change in execution and resources" (CNBC, Fortune and the Washington Post, Mar 6, 2024). The same email holds the séance's third ghost, "This needs billions per year immediately or forget it.".

**The fix (spec; the writer finds the words):**

| | |
|---|---|
| **Trigger** | The third ghost (Dec 2018). Its caption adds the email's own clause about MINDDEEP/ELGOOG and "0%" [K; pull the wording]. MAS, to the planchette: "spirit, why zero?" `[INVENTED]` |
| **Why anyone explains** | Nole's fear is the reason the email exists. The planchette slides to a Go board in the Ouija board's corner, and one stone clicks down: `MAR 2016` |
| **Who explains** | GERG, literal and typing, the build-status voice he has all episode. Nole interrupts once, with the fear (an invented line on AI, credit and money only; it disputes no email) |
| **The visual** | The ghost's chevrons rearrange into a wall of tiny knobs behind the board. As the stones replay game 2, every knob ticks a hair at once; then Move 37's stone lands where no human stone would go. No players are drawn: the board only (season-flashbacks §4's guardrail) |
| **What must be said, and stay right** | Nobody wrote the move. The program is millions of adjustable numbers (the knobs), first nudged toward the moves people played in millions of positions from human games, then by playing itself. Its own estimate gave the move about 1 in 10,000 odds of a human playing it [K]. **It doesn't say "it taught itself from nothing":** that's AlphaZero, Ep11's milestone |
| **The cost to Nole** | His fear explains his "billions per year": the case he made on landing ("It was supposed to be open.") rebuts itself again, on the mechanics, not on his character |
| **Mas's V.O.** | #2 (§2.1): what it means for the race, never the mechanics |
| **Egg** | ALYI's reflection in the stone's gloss (he's on the AlphaGo paper's author list [K]) |
| **Callbacks** | Ep3's next-word prediction builds on the same knobs; Ep5's self-play; Ep11's AlphaZero; Ep12's family album |
| **Length** | ≈ 20–25 s, in Act One. THE PLAN (`OMNI`, ≈ 1:03) is in Act Two, so the two explainers sit about 5 minutes apart (W23) |
| **Accuracy review** | Required before lock (ml-concepts.md, Rules) |

**Cost:** ≈ +0:22. **For the bible owner:** ml-concepts.md and season-flashbacks §4 should change their trigger wording ("Nole's 2016 email" → "the Dec 2018 '0%' email"). The Feb 2016 email belongs in Ep3's window (Nov 2024 release) or Ep8's trial.

### 2.10 Nothing on the nose (W7)

| Line | Where | Call |
|---|---|---|
| "i just ask the questions." | sc 4 V.O. | **Cut**: a wink at the audience |
| `RAIL: … MAS'S CHIP PLAN: $5–7 TRILLION` | sc 6 | **Cut**: the rail explains the joke, and it's [K] |
| "…Like the movie? The one where he falls for the voice?" | sc 11 | Keep: the newcomer needs it, and it names no one (open question #6) |
| "It's free!" to `is it safe?` | sc 11 | Keep: THE QUESTION runner turns every return |
| "they ask first in there." | sc 19 V.O. | Keep: the raised hand earns it |
| "So, your seat's where you left it, Mas." | sc 4 coda | **Change** to pay Ep1's "we'll stand." (§2.12): *"You can sit down now, Mas."* |
| §2.1's sample lines | V.O. | The writer runs W7's three tests on each |

### 2.11 Complete numbered sequences (W15)

Every sequence 5.4 sets up is complete:
- THE PLAN's stamps `1.` to `3.` and Rima's three sentences;
- the complaint's contents page `!`, `!!`, `!!!` with pages 1–3;
- `VOICE 1` to `VOICE 5`, with five hellos;
- the four trims of the apology post;
- the four screws;
- the refiled suit's pages `!!` → `!` → `.`;
- the three ghosts;
- the DAYS SINCE counts. Checked against Ep1's Nov 21, 2023 reset: 86 on Feb 15, 100 on Feb 29, 202 on Jun 10, and `SUED`: 102 on Jun 10. All correct.

**One watch item:** `PART 1 OF 6` promises five parts nobody sees. It's a sign gag about length, not a sequence the story follows. Keep it.

**Rule for the build:** any new numbered device (Move 37's "game 2", Terb's agenda items) says every number it implies.

### 2.12 Continuity with Ep1's ending (W14, W16)

| Ep1's ending (final film) | Ep2 in 5.4 | Fix |
|---|---|---|
| Rima's launch-night "Did anyone tell the rest of the board?"; Neleh's two pages before noon; "The Ep2 podcast is restored as the answer" (SN 0000; proposal-v35) | **Not in the script.** Only §9's restore list and the outline, beats and setups file carry it | **Put it in sc 18's left pane** (≈ +0:12). As the committee sits, the boardroom TV plays a podcast player muted with its transcript running: "When CHATGTP came out November 2022, the board was not informed in advance about that. We learned about CHATGTP on RETTIWT." [V as said · Ep1 facts V8 · name swaps only]. The new board's same-day reply follows in its own statement UI [K]. Terb clicks it off: "First item." (a caused arrival into his reading). Mas's held face, no V.O. Her words only, none of her other claims; the Mar 8 halves stay together; the memo stays out |
| "And there'll be an independent review." / "of what?" / "Good question." | Terb reads the Mar 8 finding to the table, both halves | **Keep the reading.** It's the answer to "of what?", and it keeps setups-and-payoffs' "split rail" intent (both halves always together). Default: the reading, plus `MAR 8` on the rail. Belt and braces: both halves printed on Terb's sheet in frame |
| "He stays. You and Gerg don't sit on the board." / "we'll stand." | "So, your seat's where you left it, Mas." | **"You can sit down now, Mas."**: it pays "we'll stand." at 0 s |
| The new board: Terb (Chair), the Other Yrral and Mada | Terb, Mada and two unplated tiles; "neither is THE OTHER YRRAL" | Keep. naming.md makes him mute and Ep1-only. Recheck the newcomer read for "where's the third?" |
| Alyi's regret post; the three hearts; "It has been four days." / "i'm not counting today." | Alyi only in reflections; no callback to the regret or the hearts | **One callback, 0–2 s:** when TPOOL opens (sc 15), the phone's last thread with Alyi shows the three hearts, Nov 20, unanswered since. V.O. #7 ("reunite the company." his words.) picks it up. **W14:** the empty seat's chrome (sc 12) can hold Ep1's Sep 25 party toast for 1 s before the reflection turns away (reuse Ep1's art) |
| `IOU: 20% COMPUTE` taped at Alyi's door; "it flutters off in Ep2" | sc 14 | ✓ Plus F2.2's new origin (§2.3) |
| The lobby's `DAYS SINCE…: 0` and the box of spare `0` plates | DOT's ladder and the second sign | ✓ The arithmetic checks |
| The `GUEST` lanyard framed in the dark room | sc 23's wall; "as a guest." | ✓ |
| The third collar (Ep1 sc 9); "That collar suits you." | Three collars, no pop | ✓ |
| SYDNEY's `😊` | CHATGTP's `😊` | ✓ |
| Gerg: "Is it ready?" / "it's a preview." | Mas asks "is it ready?" backstage | ✓ A clean turn |
| The tag's last beat: THE GREY LADY's suit, "noted." | The cold open's suit picks up the thud; the Grey Lady never recurs | **Optional, 0 s:** sc 8's monitor shows the licensing deals stacking up with other publishers (Mar–May 2024 [K]), his answer to one newspaper's suit. A Mas move that continues Ep1's last image. Default: in, if the facts pull is quick; else skip |
| The `MACROSOFT · OBSERVER (NON-VOTING)` chair, Ep1's last Act Four image | Not mentioned | **Optional, 0 s:** on Jul 10, 2024 [K] the observer seat was given up. In the tag's dark-room wide, the blue folding chair, glimpsed through the door, folds itself and leaves. Default: skip unless the tag needs a beat |
| The intro line in the ElevenLabs film is Jeremy (voices-el §Y) | The intro's "her" line, voice unstated | Jeremy reads "her" (LEARNINGS P16, S7) |
| The Orb outro (proposal B), 10.1 s | "credits 22:35 → 23:18", a 43 s placeholder | The Orb outro, credits "art · script · music · voices · edit: opus 5.5 / prompt: jgon", ≈ 10 s; −0:33 of runtime |

### 2.13 Other conflicts found

1. **The six-fingered extra (sc 1) is against style-range §6.2.** Its H2 note: "the sixth finger goes: there's no person in a machine plate, and P29's flaws never land on a person."
   - **Fix:** cut the extra. Move the AI tell onto the mammoth: a fifth leg flickers in for two frames as it steps out. The melting chair stays.
   - ≈ −0:03.
   - The tag's six-fingered fan balloons are the machine's image of people, the deepfake chain to Ep4. The style-range owner rules on them; default: the fans keep six fingers, since they're the post's own AI images drawn as pixel cartoons, not a P29 pass.
2. **Inside or outside the bezel (open question #1)** is already decided by style-range §6.2's 2.A: near-photoreal inside the screen, converted to pixel at the bezel, silent, with the room's bed under it. Adopt it.
3. **"At a real event his surface stays blank" is over-applied** (sc 4's coda, sc 17's driver, sc 19's garden, the tag). It's the pre-calibration rule.
   - Calibration §9 and GR §4 narrow "contested" to: the firing's reasons, the staff letter, testimony and the memo. LEARNINGS W8 adds the Ep2 set.
   - Elsewhere Mas may show visible choices and small reactions. **Fix:** release the blank surface outside W8's list.
   - Keep it at the apology post (what he knew), the voice objection and Neleh's podcast.
4. **Newcomer name load** (LEARNINGS predicted note 6). About 13 name reads (cards and plates) in 22 minutes. Eggs with no hold are free.
   - **Fix:** drop TRAWETS's plate (the segment's own title card names the three CEOs, and the host is nobody's problem) and MIT KOOC's plate (the ELPPA stage and the giant key carry him). That's two fewer reads at 0 s.
5. **The intro slot's owner items** (open questions, "For other owners") still need doing for Ep2's intro build: SCRIPT §8.1 row 2 (no `TRUTHGTP`, no `KORG` boards) and §8.4 row 2 (coat hook 3).
   - Build Ep2's intro variant into `out/ep02/`.
   - Never re-render or overwrite Ep1's intro outputs (R1).
6. **The audio plan exists but has no cues yet.** The script names one cue per sequence: the séance organ, KEYNOTE REEL, the BLUEPRINT waltz, THE CLOCK, the SET-PIECE SWING, the LEVERAGE quartet, DARK ROOM, THE RUN and the cut-paper chamber tier. `audio/ost/tracks/` has no `e02-*` folders.
   - The Move 37 beat needs its colour: the séance organ thinning to a Go-board chip figure, no third.
   - F2.2's three beats need theirs: the party's giddy choir, the fire's dread, and the pledge's warm resolve.
   - S1 and S2: keep suspense a minority.

### 2.14 Runtime after the fixes [J]

| Change | Story Δ | Why it's in (not as payment) |
|---|---|---|
| V.O. map (+9 new, −1) | +0:20 | §2.1 |
| Publish click, XEL booking, circled Monday, lanyard taken | +0:06 | §2.2 |
| Move 37 concept | +0:22 | §2.9 |
| F2.2 rebuilt | +0:25 | §2.3 |
| F2.3 in the first office | +0:05 | §2.8 |
| Neleh's podcast, the reply, Mas's face | +0:12 | §2.12 |
| Rima's aftermath | +0:04 | §2.6 |
| sc 2 folded onto the monitor | −0:18 | §2.4: uncaused, Mas-less, calendar backward |
| The tag's quote card and quoted "I accept!" cut | −0:12 | §2.4: documentary devices; after the turn (R4) |
| The $5–7T and exit-papers rails cut | −0:02 | §2.4: [K] stated as fact |
| The six-fingered extra cut | −0:03 | §2.13 #1 |
| Tempo marks | −0:10 | §2.7 |
| **Net** | **≈ +0:49** | |

- **Story ≈ 22:52.** Runtime ≈ 22:52 + 0:32 (intro and card) + ≈ 0:10 (the Orb outro) **≈ 23:34**, about Ep1's 23:31.58.
- Act One lands ≈ 6:15: over its flex, but it's the anchor act and the "add, don't trade" rule protects it (R4). The ear on the reel decides.
- **Nothing on the protected list is cut to pay for anything:** XEL's late hops, Nole's "Say something ELSE.", and the rest of §9's trims all stay.

---

## 3. Open questions that still need a decision

The default is what v1 builds. "Why" points at the note it follows. **Bold** rows need the most care in the flow document.

### 3.1 From `open-questions.md`

| # | Question | Recommended default | Why |
|---|---|---|---|
| **1** | **Style moment inside or outside the bezel** | Inside; it converts at the bezel (style-range 2.A); code filler now, a video-model layer later; no person in the plate. Cut the six-fingered extra | style-range §6.2 decided it, and its H2 removes the extra's finger; SN 9 (programmatic first) |
| 2 | Posts as pop-ups, never speeches, series-wide | Yes | Ep1 final did exactly this (Alyi's regret, Gerg's post, Ttemme's); W20 |
| 3 | The roadmap's weight as the political counterweight; matrix row 2 | As written, plus the reporter's "when does it get a vote?"; update matrix row 2 (drop `0 BILLS`, THE OTHER MAS's sticker, THE FOUNDRY) | GR §2 rule 3. RUMPT's load gets lighter in §2.4, so the balance improves |
| 4 | O2.2 in the split's right pane | As placed | 0 s, beside Mas's pane |
| 5 | Nole's plate | `NOLE · FUNDED IT. LEFT IT. SUING IT.` | Ep1 plated him differently; this plate carries the new fact; it avoids NAMED IT so his case makes that claim |
| **6** | "…Like the movie? The one where he falls for the voice?" and `A FAMOUS VOICE OBJECTS` | Keep both. Decline `THE MOVIE'S VOICE OBJECTS`. The rail goes on screen only after its [K] is upgraded (§5) | Newcomer clarity without naming or pointing at the actress (GR §1, §6); GR §4 |
| 7 | The séance's wording [K] | Pull the Mar 5 post before lock: "Yup" (with or without a period), the cash-cow caption, the Dec 2018 line, the byline egg | §5 |
| 8 | The re-verify list | §5 | — |
| 9 | Tpool revolts insert | Stays parked | Ep1 showed TPOOL twice; Ep12 owns the details |
| 10 | XEL's real lines | Settled on the transcript page; a human checks the video (about 18:44–19:15) before lock | The page says it "may have errors" |
| 11 | The RULEBOOK notification out of date order | Keep, undated. With sc 2 folded in, the montage runs Feb 2 replay → Mar 13 → Apr 1, all in their own UIs | Ep8 needs the snooze plant; the rail never runs backward |
| 12 | Swap rule inside paraphrase captions | Confirm | naming rule; consistent with Ep1 |
| 13 | A Democratic Orb check (`verified: slogan`) | **Decline** | GR rule 11 lands the mirror in Ep5 (MOSWEN's `EDITED`); an invented banner in quotes risks GR §4; it's the episode's likeliest corny beat |
| **14** | Terb reads the Mar 8 finding aloud | Keep, with "You can sit down now, Mas." (§2.12) | It answers Ep1's "of what?"; reading the record to the people it concerns is a reason (tone guide R21); both halves stay together |
| 15 | Ekiel's line as a post | Keep | W20, #2 |
| 16 | Three generic off-screen voices | Keep the reporter (now on the monitor replay), the lobby TV reporter and the podcaster | Each sets up a real line; none drawn or named |
| 17 | Draft-5 invented lines at real events | Approve as worded now | None touches W8's contested set |
| **18** | **Runtime: keep the length or take back beats** | Keep; runtime is an outcome. Land ≈ 23:30 (§2.14). The only cuts are the ones with merit-based reasons in §2.4 and §2.13 | SN 00000, "Length"; R4 ("add, don't trade"); Ep1 shipped 23:31 |
| 19 | Temp voices | Ep1 v3.5's method: the ElevenLabs cast (Jeremy as Mas), MARIO on Kokoro matched in, library voices auditioned 3–4 each for the new principals; long reads recorded whole; the cut-offs recorded complete | S7; voices-el |
| 20 | The cage | 5.1/5.3's version: a threat, an empty cage, the missed call, no lamp tell at the drop | Keeps the call from reading as the drop's cause |
| 21 | THE PLAN's launch line ("in the coming weeks") | Keep; the facts owner confirms both dates | Accurate to the May 13 post |
| 22 | sc 14's two-line plate and the `MAY 17` box label | Keep; upgrade the disbanding to [V] | Widely reported on May 17 |
| 23 | The two séance gags cut | Stay cut | Insider read; the corny-toast risk |
| **24** | **Is the lead exempt from "not a few words per character"?** | **Aloud, yes** (his short lowercase lines are the character). Give him full sentences when he decides or sets terms (calibration §9), and let the V.O. carry his thinking (§2.1) | Ep1 final's shape: short aloud, a full inner voice |
| 25 | "I accept!" [H] in quotes | Moot under §2.4 (the fans play as picture). If it's restored, pull the post to [V] first | GR §3–§4 |
| 26 | Selbeep's "Our first review." | Keep | Claims nothing about YRREP's reasons |
| 27 | Rima's grant pair | Keep | Frames her as the demo's owner; pays at the eclipse and in §2.6's clicker beat |
| 28 | The Forecaster's talk-through and "take your time." | Keep 5.4's "Already did. It's the one thing I didn't need a number for." | No invented probability on a real refusal |
| 29 | Draft 5.2's invented lines | Approve | None touches W8's set |
| 30 | The Lex #419 relationship exchange | Keep whole | The one place the show says what Alyi is to Mas; that it echoes Ep1's Nov 29 memo is the point (he keeps saying it in public) |
| 31 | Terb reads the May 28 post | 5.3's version: one verbatim sentence, then his paraphrase | Less corporate prose in a comic split |
| 32 | Build checks | Build as listed, plus: Ep1's first-office set for F2.3; the Go board and knob wall; F2.2's whiteboard and the IOU's origin; sc 18's TV with the podcast player | §2.3, §2.8, §2.9, §2.12 |
| 33 | Doc drift | Regenerate the companion files from the v1 script, once, after it's written (§1.3) | One authority |
| 34, 36 | Draft 5.3 and 5.4 invented lines and restagings | Approve; F2.2's glyph stays on the room; F2.2 runs in the record's order | GR §6 (no mental-health reading for Alyi) |
| 35 | Facts that 5.3 touches | §5 | — |
| **35, last bullet** | **Mas's whereabouts on Jun 10** (the press placed him at the keynote [K]) | **Verify first.** If he was there in person: the lobby watch party stays the staff's (Haras, Gerg, the cheer), Mas watches from the back of the keynote's own crowd on his phone, and Gerg's exchange becomes a call. The garden image then reads literally (in the building, not on the stage). If not: as written | GR §4: no false staging of a real person at a real event |
| 37 | Facts that 5.4 touches | §5 | — |

### 3.2 Parked, other owners, and the outline's unresolved items

| Item | Recommended default | Why |
|---|---|---|
| W2.2 XEL "Nuclear-" / "that's what i believe." ×2 | Stays parked | The episode isn't short |
| W2.7 Klarna's "700" | Skip | A menu item, not allocated |
| The lighthouse window | Skip | Mas-less |
| An orange cuff for Ep1's maintenance hand | **Decline** | Ep1 is locked (R1); Ep2 no longer claims it's the same hands |
| Naming columns: add Ep2 to MADA and TERB; remove Ep2 from THE PACKAGE DEAL, DIRE, NEYEL, POPE SICNARF, THE OTHER MAS, THE FIRST CHECK and NUCEL | Do it in `naming.md` at the bible sync | The registry must match the episode |
| Gags tracker: CLASS PHOTO #2, NUCEL's cat, the doors meter, the RULEBOOK snooze | Update `recurring-gags.md` at the sync | — |
| Research owner: `recent.md:73` (Microsoft on Aug 5) | Correct it: Microsoft joined in the Nov 14, 2024 amended complaint | facts row 48 |
| Ep3 owner items (the `$7T` pallet, `9 FORUMS · 0 BILLS`, the committee Mas leaves, don't reuse "i love alyi…" or the May 28 reading) | Pass to Ep3; the Feb 2016 DeepMind email (Nov 2024 release) is now available to Ep3's window | open-questions "For other owners"; §2.9 |
| `ml-concepts.md` and season-flashbacks §4's Ep2 trigger | Change to the Dec 2018 "0%" email | §2.9 anachronism |
| motives-and-the-race §5: no Ep2 entry for Mas | Add one: the planner's reach (the emails, the Monday, the committee, the phones) and the want to be asked | §2.3 |

### 3.3 New decisions raised by this audit

| ID | Decision | Recommended default |
|---|---|---|
| A1 | The V.O. map | §2.1's 12 lines (9 new, 3 kept, 1 cut); room for 2–3 more after the reel |
| A2 | Mas's agency beats | Publish click (sc 4), XEL booking (sc 4 → 6), circled Monday (sc 8–10), the lanyard taken (sc 18), the distribution V.O. (sc 19) |
| A3 | The through-line | §2.2's rewrite |
| A4 | Move 37's trigger and explainer | The Dec 2018 "0%" ghost; Gerg explains; Nole's fear interrupts; ≈ 22 s |
| A5 | F2.2 as Alyi's full motive flashback | Party → fire → the Jul 2023 pledge and the IOU's origin; ≈ 50 s |
| A6 | F2.3's room | Ep1's first-office set, Feb 2018, in partial progress; one Go stone |
| A7 | The C-plot | sc 2 folded onto sc 8's monitor; the tag cut to four beats plus the balloon button and the hook; the $5–7T and exit-paper rails cut |
| A8 | Neleh's podcast | In sc 18's left pane, with the board's reply, Terb's "First item." and no V.O. |
| A9 | Ep1 callbacks | "You can sit down now, Mas."; the three hearts in sc 15; the party toast in the chrome (sc 12) |
| A10 | Rima's aftermath | The wordless clicker hand-off in sc 12 |
| A11 | The outro | The Orb outro (B), ≈ 10 s, replacing the 43 s placeholder |
| A12 | The six-fingered extra | Cut; the tell moves to the mammoth's legs |
| A13 | Optional 0 s beats | Licensing deals on sc 8's monitor: in if the facts pull is quick. Observer chair in the tag: skip |
| A14 | Name load | Drop TRAWETS's and MIT KOOC's plates |
| A15 | The blank surface | Only at W8's contested set |

---

## 4. What draft 5.4 does well, and must keep

The keep list for the version ledger (R5): nothing here is cut without a recorded reason.

**The engine and the shape.**
- **The thematic engine:** Ep2 owns the departures, Alyi is the loss, and "whose voice is it?" runs through the suit, the emails, "her", the NDAs and the faceless candidate. It's distinct from Ep3's price story.
- **A clean act shape:** the séance, "her", the search, the one door, each with a clear anchor and act-out. The A/B split point is at the midpoint.

**Set-pieces that are already scenes, not points.**
- **The séance's cross-examination,** from Nole's case through OPEN → NOPE, the ghosts that rebut him, "You kept them." / "we keep everything.", F2.3's single moving sip, "You sat at the back." and "Keep that too. See you in court." Nole never disputes a real email.
- **THE PLAN: `OMNI`.** It's accurate (the three-model relay losing tone and laughter through a grate), voiced by Rima, and enters and exits on objects (the voice panel unfolding into the grid, the tear into the stage lights).
- **"her" eclipses the demo:** the spotlight as a locked-frame meter, the three-part "one wo-o-ord.", the typed post at its own pace, and Rima's held "…and that's the demo.".
- **The Bay Bridge:**
  - the receipt from under Alyi's door;
  - the Forecaster's terms said in a character's mouth;
  - "Already did. It's the one thing I didn't need a number for.";
  - the refusal before the apology;
  - "Does honking count as disparagement?";
  - the blank-letterhead storm.
- **The walled garden:** `GUEST`, the raised hand, IRIS at 99%, "as a guest.", and the line cross on purpose at the gate.
- **The white room:** the silent one-on-one, the reflection that faces him once, the hand that doesn't knock, and the IOU back in his pocket (load-bearing for Ep11).
- **The cage split:** held open, with `MISSED CALL · MAS`, a question the show never answers.

**Craft from the 5.x passes.**
- **Conversations that play out:** XEL ≈ 81 s of speech, the séance ≈ 61 s, backstage, Gerg and Mas at the watch party, and the Forecaster.
- **Scene-shape tables** (want, obstacle, turn, cost).
- **Shot grammar:** `AXIS:` lines, base setups with listed cut-ins, locked meter frames (the mic, the spotlight), Mas in the left third, boxed portraits only in-world.
- **Sound:**
  - one continuous cue per sequence, thinning under the record;
  - five designed stops, each with a re-entry;
  - pre-laps and L-cuts across most seams;
  - the demo as one tune in three rooms, and sc 18–20 as one quartet.
- **Matched-object seams that already pass:**
  - XEL's curtain → the building split;
  - the voice panel → the drafting grid;
  - the blueprint tear → the stage lights;
  - "It's free!" as an L-cut;
  - the chair's hum;
  - the receipt under the door;
  - the phone from the garden into the cage;
  - THUD → white → the pin.

**Discipline.**
- Every invented voiced line is tagged.
- Real quotes are re-matched on primary pages: the Lex transcript, and the Mar 8 and May 28 posts via captures.
- The actress is never drawn, voiced or named. THE SLEEVE is a sleeve and a clicker.
- RUMPT is voice and hands; his [H] fragments are chyron-only.
- The Mar 8 halves stay together; the memo is out.
- Posts are pop-ups; the political pair is in the episode.

**Lines to keep.**
- "it's all yours." / "It is. Enjoy the view."
- "i was up there once. they let me hold the clicker."
- "people come back. i did."
- "they ask first in there."
- "I paid for the ceiling I just came through."
- "We keep a spare." / "A tenant."
- "present." / "also present."
- "It's that we might win."
- "Compute. Different compute."
- "Then it freezes live, and I keep talking."

**The season seeds:**
- the IOU (Ep11);
- DOT (Ep4, Ep5);
- THE SIDEWALK (Ep5);
- the RULEBOOK's `SNOOZE` (Ep8);
- the hydra (Ep3, the finale);
- the Forecaster;
- the refiled `NOLE v. MANALT ET AL.` (Ep8);
- the balloon's taut string (Ep3).

**Two levels of writing:** zero-second insider eggs (the `ALYI` byline, the `ALSET` plug, `232 MS`, tiny RADNUS on Tuesday, the Golden Gate box) that a newcomer can miss without losing the thread.

**The successor documentation:** every pass's log, its counters and how to re-run them.

---

## 5. Facts to re-verify before lock

Tags as in GR §3. On screen, [K] needs an upgrade or a character's mouth (GR §4).

### 5.1 Blocks lock (on screen as fact, or a quote)

| Item | Where | Now | Action |
|---|---|---|---|
| "her" (May 13, 2024 post) | intro line; sc 11 | [K]† | Pull the post; the intro can't lock without it |
| The May 18 apology, four trims | sc 17 | [K]† | Pull the post; confirm each trim's wording and casing |
| "Yup" (period or none); the cash-cow caption ("exactly right"); the Dec 2018 "billions per year immediately or forget it"; the post's author line (the `ALYI` egg) | sc 4 | [K] / [K]† | Open the Mar 5, 2024 post (via a capture: openai.com refuses fetches) |
| **New:** the Dec 2018 email's DeepMind/Google "0%" clause, for the Move 37 trigger | sc 4 | [V·press] (CNBC, Fortune, WaPo, Mar 6, 2024) | Same open; take the exact wording |
| `A FAMOUS VOICE OBJECTS` (May 20) | sc 17 rail | [K] | Pull NopeAI's May 19 pause post and the date of the statement |
| Nole's Jun 10 posts ("unacceptable security violation", "Faraday cage", and the condition) | sc 20 | [K]† | Pull the posts |
| The new board's reply to Neleh's podcast (May 28–29, 2024) | sc 18 (new) | [K] | Pull the statement's text and date |
| Neleh's podcast line | sc 18 (new) | [V as said] (Ep1 facts V8) | Confirm against the episode's audio or transcript |
| The exit-papers rail | sc 17 | [K] | Cut by default (§2.4); if restored, upgrade first |
| `$5–7T` chip plan | sc 6 rail | [K] | Cut (§2.4) |

### 5.2 [P] or [V] on file; open once before lock
- The Mar 8 review sentence (both halves); the Mar 5 "less open" sentence.
- The May 28 committee post (add its timeline row and the capture URL).
- The Lex #419 lines: check against the video, since the transcript says it may have errors.
- The Aug 5 docket (4:24-cv-04722): the defendant list and the caption.
- Ekiel's full May 17 sentence.
- The GPT-4o post's `232 MS (AVG 320)`, "o for omni", and "in the coming weeks", plus the date the voice reached paying users.
- The Atlantic's Nov 19, 2023 piece on the live page: the party chant (2022) and the offsite effigy (2023).
- The platform card's attribution and date (Jul 8 committee vote against the Jul 15 adoption), if the card returns.
- ISOLEP's lowercase tags against her statement.
- THE HUMANIST's title wording.

### 5.3 [K], [H] or memory, used in picture or staging
- The Forecaster's ~$2M ([V·wiki]): open TIME100 (Sep 5, 2024). He also needs a departure date for `EX-NOPEAI.`.
- The FTC 6(b) date (Jan 25, 2024) and Macrosoft–Mistral (Feb 26, 2024): memory.
- The roadmap's "$32B per year": [H]; check the text.
- The where's-Alyi meme: [K]; find a source.
- The superalignment team's disbanding (May 17): [K]; upgrade.
- RUMPT's Feb 2 fragments: [H]. If the clip is pulled to [V], he voices them again.
- RUMPT's Aug 18 and Aug 22 posts: [H] (picture only after §2.4).
- `KORG 2: NEXT QUARTER`: confirm the promised version in Jun 2024.
- **Mas's in-person attendance at WWDC, Jun 10, 2024:** [K]; it decides sc 19's staging (#35, last bullet).
- YRREP's $800M pause: [H].

### 5.4 New, from this audit's fixes
| Item | Fix | Tag now |
|---|---|---|
| Move 37: game 2, Mar 10, 2016; AlphaGo's ~1 in 10,000 prior for the move; training first on millions of positions from human games, then self-play | §2.9 | [K] |
| Alyi (Sutskever) on the AlphaGo paper's author list | §2.9 egg | [K] |
| The Feb 22, 2016 "DeepMind… extreme mental stress" email was first public on Nov 17, 2024 | §2.9 (why it's not the trigger) | [V·press] (Tom's Hardware; Tortoise Media) |
| Superalignment, Jul 5, 2023: 20% of compute secured to date, over four years, co-led by Sutskever and Leike | §2.3 F2.2's turn | [V] (facts row 28), [P] once pulled |
| The month of the 2023 offsite effigy (before or after July?) | §2.3 F2.2 order | [K]. Don't assert an order: the rail says `2023` only |
| Publisher licensing deals, Mar–May 2024 (optional) | §2.12 | [K] |
| Macrosoft's observer seat given up, Jul 10, 2024 (optional) | §2.12 | [K] |

### 5.5 What a human must check (nobody here can watch or listen; R8)
- The Lex #419 lines against the video.
- Neleh's podcast audio.
- The reel's pace against the tempo table.
- The newcomer cold read: "where's the third director?"; can a newcomer follow Move 37?; does Alyi read as a person?
- The accuracy review of the ML concept.

---

## 6. Handoff

- **What changed:** this file only. No episode file, bible or Ep1 path was edited.
- **Where things are:** this audit and [LEARNINGS.md](LEARNINGS.md) are in `show/episodes/ep02/production/v1/`. The plan it audits is `show/episodes/ep02/script.md` (draft 5.4) and its companion files.
- **How it was checked:**
  - **[M] measured:**
    - the DAYS SINCE arithmetic (86, 100, 202; `SUED` 102, all correct);
    - the script's own counters and timecodes, as printed in its Writer's notes;
    - Ep1's final V.O. count (17 plus the intro), from `lock-v35-transcript.txt`.
  - **[J] judged:** every conflict, fix and runtime estimate.
  - **Checked on the web this pass** (search results, not primary pages):
    - the Mar 5, 2024 post includes the Dec 2018 "0%… DeepMind/Google" email: [CNBC](https://www.cnbc.com/2024/03/06/openai-shares-elon-musk-emails-urging-startup-to-raise-1-billion-see-tesla-as-a-cash-cow.html), [Fortune](https://fortune.com/2024/03/06/openai-emails-show-elon-musk-backed-plans-to-become-for-profit-business/), [Washington Post](https://www.washingtonpost.com/business/2024/03/06/open-ai-musk-lawsuit-agi-profit-emails/);
    - the Feb 22, 2016 DeepMind email was released with the Nov 2024 court exhibits: [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/musks-concerns-over-google-deepmind-ai-dictatorship-revealed-in-emails-from-2016-communications-released-during-the-recent-openai-court-case), [Tortoise Media](https://www.tortoisemedia.com/2024/11/20/musks-extreme-mental-stress-revealed-in-new-openai-emails).
- **LEARNINGS rules checked here:** W1, W2, W5–W8, W10–W16, W18, W20–W23, W25, P3, P14, P16, S1–S2, S7, R1, R4, R5, R8. **None broken on purpose.**
- **Next steps, in order:**
  1. Write the flow document (R2): every scene, with §2's fixes and §3's defaults as choice rows.
  2. Write script draft 6 from it.
  3. Pull §5.1's facts.
  4. Regenerate the companion files once.
  5. Record takes; build the stick reel, then run the newcomer and insider reads, the transition table and the mood analysis (R6, R7).
  6. Then picture, score and mix.
- **Resource asks (R16; non-blocking in this run, so take the programmatic route and list them):**
  - video-model access for the 2.A mammoth's final layer (a programmatic filler first);
  - ElevenLabs credits for library-voice auditions, 3–4 each, for the new speaking principals (Selbeep, XEL, the Humanist, Bukaj, Ekiel, the Forecaster, Haras, the engineer, the driver, the reporters, the podcaster and RUMPT's stock register); Ep1's cast carries over for everyone else;
  - one human viewer for §5.5's checks.
