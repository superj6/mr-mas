# Ep2 v1: the locks (base, EL master, pixel), 2026-10-09, with the lock QA's fixes

> **Status: the v1 LOCK, EL-timed (the master, LEARNINGS R9), for the shot, score, sound and mix passes, rebuilt after the lock QA (§3.5).** Built from the six beat plans and the recorded takes, in [pipeline.md](pipeline.md)'s order: the base lock (`build_timeline.py`), the EL lock (`el_lock.py`, every segment), the takes with mouth tracks (`el_takes.py`), the pixel locks (`el_lock.sh`), then the scene modules (`scenes.py`).
>
> - **The story runs 22:54.00, 32,976 frames.** The episode with the intro, the card, the tag's hum and the outro at their planned lengths: **23:36.88, 34,005 frames** (§1).
> - **Against the plan:** every beat lands on its plan length. Every line, gap, overlap and on-screen item is where the plan put it, with the item's own kind. Where the lock's frames differ from the plans as the takes pass left them, the change is made in the plan, so a rebuild keeps it: **sc 11 and sc 13 give back 18 s** of air that the fit had tripled (§3.1), and **the lock QA gives back 8 s** of tempo the fit had stretched (§3.5).
> - **The lock QA (§3.5)**: its eleven findings are fixed: the cheer now cuts "And profit—" on the word, with its cause first; seven exchanges the script and the proposal mark quick or normal are pinned (they had stretched to 0.9–1.9 s); THE PLAN's third stamp lands on "free"; V.O. 6 waits out the post's read floor; 4B gets its beat and its aftermath; the cut-offs' subtitles read as the script draws them; the transcript carries every in-world text; the proposal's headings and the script's header match the lock; the plan's picture notes reach the shot pass; the engineer's laugh is a timed request; V.O. 9 was re-read so its count can't parse as "signed the post".
> - **Against the proposal's runtime table** (23:20 after the script review; its own margin is "±0:40 until the takes"): 26 s shorter, all of it dead air (§1).
> - **Every lock check the tools have was run (§5): 0 failures.** That includes the checks the lock pass and the lock QA added where the tools had none (§3.2, §3.5). What is left is listed as LOOK, each with its reason.
> - **The fixes pass (2026-10-10, [fixes-v1.md](fixes-v1.md)) rebuilt Act One's lock for text only, no timing:** 4.18's `…Yup` (no period, as the post has it), 4A.04's plates (only `MAS MANALT · BOARD` is a read text; the three new directors' plates are soft), 4A.01's caption and the act's cast without `omis`. The frames, the takes and the score's audio are unchanged; the score's cue sheet was re-laid for the new content hash [M].
> - **Nothing was watched or heard (R8).** Every number here is measured from the files [M]; every call is marked [J]. The ear list ([takes-qa.md](takes-qa.md) §6) gains one item, V.O. 9's count.

**Contents:** [1. Frames and runtime](#1-frames-and-runtime) · [2. Scenes: arrival and aftermath](#2-scenes-arrival-and-aftermath) · [3. Where the lock differs from the plan, and why](#3-where-the-lock-differs-from-the-plan-and-why) · [4. The plan's marks, measured in the lock](#4-the-plans-marks-measured-in-the-lock) · [5. Every lock check](#5-every-lock-check) · [6. For the next passes](#6-for-the-next-passes) · [7. How to rebuild](#7-how-to-rebuild) · [8. Files](#8-files) · [9. LEARNINGS rules checked](#9-learnings-rules-checked)

**The transcript** of the whole episode, with timecodes, is [transcript-v1.txt](transcript-v1.txt), in Ep1's format (`assembly/transcript-v35.txt`). It has 174 lines: the 173 takes plus the intro's "her". It also carries every in-world text at its first frame: the rails, cards, stats, plates, posts, documents, captions, lower thirds, the Orb's toasts, signs and UI (the lock QA added all but the first six), and the outro's credits with `viewer: verified: human`.

---

## 1. Frames and runtime

<!-- BEGIN generated:frames -->
| Segment | Frames | Runtime | Episode in → out | Shots | Lines (V.O.) | Scenes | Plan | Pixel-lock checks |
|---|---|---|---|---|---|---|---|---|
| Cold open | **1,320** | 0:55.00 | 00:00:00 → 00:55:00 | 13 | 6 (0) | 1 | 0:55.00 | 8 ok |
| Act One · the séance | **8,736** | 6:04.00 | 01:27:00 → 07:31:00 | 62 | 59 (3) | 5 | 6:04.00 | 9 ok |
| Act Two · her | **6,696** | 4:39.00 | 07:31:00 → 12:10:00 | 44 | 41 (3) | 5 | 4:39.00 | 8 ok |
| Act Three · leave them up | **7,680** | 5:20.00 | 12:10:00 → 17:30:00 | 58 | 28 (4) | 4 | 5:20.00 | 8 ok |
| Act Four · as a guest | **7,656** | 5:19.00 | 17:30:00 → 22:49:00 | 57 | 38 (3) | 4 | 5:19.00 | 8 ok |
| Tag · august | **888** | 0:37.00 | 22:49:00 → 23:26:00 | 9 | 1 (1) | 1 | 0:37.00 | 8 ok |
| **Story** | **32,976** | **22:54.00** | | 243 | 173 (14) | 20 | | |

The episode clock (MM:SS:FF): Cold open 00:00:00 · Intro 00:55:00 · ep1.1_her.wav 01:25:00 · Act One · the séance 01:27:00 · Act Two · her 07:31:00 · Act Three · leave them up 12:10:00 · Act Four · as a guest 17:30:00 · Tag · august 22:49:00 · the hum under black 23:26:00 · Outro · credits 23:26:18 · end 23:36:21 (**34,005 frames, 23:36.88**; the intro 720 f, the card 48 f, the hum 18 f, the outro 243 f at its planned length).
<!-- END generated:frames -->

**Against the plans and the proposal [M]:**

| Segment | Proposal (after the script review) | Plans as the takes pass left them | The lock pass | **After the lock QA** | Lock − proposal |
|---|---|---|---|---|---|
| Cold open | 0:56 | 0:56.00 | 0:56.00 | **0:55.00** (1,320 f) | −1 s (sc 1) |
| Act One | 6:08 | 6:08.00 | 6:08.00 | **6:04.00** (8,736 f) | −4 s (sc 4 −3, 4A −2, 4B +1) |
| Act Two | 4:53 | 4:53.00 | 4:40.00 | **4:39.00** (6,696 f) | −14 s (sc 11 −13, sc 9 −1) |
| Act Three | 5:26 | 5:26.00 | 5:21.00 | **5:20.00** (7,680 f) | −6 s (sc 13 −5, sc 17 −1) |
| Act Four | 5:20 | 5:20.00 | 5:20.00 | **5:19.00** (7,656 f) | −1 s (sc 18) |
| Tag | 0:37 | 0:37.00 | 0:37.00 | **0:37.00** (888 f) | 0 |
| **Story** | **≈ 23:20** | 23:20.00 | 23:02.00 | **22:54.00 (32,976 f)** | **−26 s** |
| **Episode** | ≈ 24:02 | — | 23:44.88 | **23:36.88 (34,005 f)** | −25 s |

- **Frames.** Every segment is a whole number of seconds, so every segment is a whole number of frames, and the base lock, the EL lock and the pixel lock agree to the frame. Beats start on the rounded running total, the stick reel's own rule, so a beat's own length can be off by up to half a frame (`lock.py`'s "decisions" line). The scene and segment totals are exact.
- **The episode clock** is `assemble.py`'s: cold open, intro 720 f, card 48 f, the acts, tag, the tag's hum under black 18 f, outro. The outro is taken at the manifest's 10.125 s (243 f) until outro B's Ep2 render exists. The proposal's 24:02 counted the intro, card and outro as 42 s; this clock counts 42.875 s, because it includes the hum gap.
- **The midpoint act-out** (Act Two's last frame) is at 12:10, 51.5 % of the episode; the proposal had 52 %. **The S3** (sc 17, the bridge) runs 15:20–17:30, 65–74 % of the episode; the proposal had 65–74 %.
- **Against Ep1:** Ep1 shipped at 23:31.58. This cut is 5 s longer. The notes put the band at about 22–23 min and say "runtime is an outcome, not a target". D-20's trims, held "if the reel runs long", aren't needed.

---

## 2. Scenes: arrival and aftermath

**Arrival** is the time from the scene's first frame to its first line's first sound; the spoken line's time is in brackets when a V.O. comes first. **Aftermath** is the time from the last line's end to the scene's last frame. Both are measured in the pixel lock's frames [M]. The marks are P3's: arrive 2–4 s on the room, longer at a jump in time; let the turn land 1.5–3 s, or 4–6 s for the biggest turns. A scene whose first story event is a picture beat (a montage, a document, a post) opens on its own `arrive` note, shown in the last column. The proposal's headings now carry the lock's lengths (the lock QA), so the column reads "same" throughout; each change from the proposal's runtime table is in `_spec.py` with its reason and in the proposal's Decisions: sc 4's +4 s at the script review (D-72), sc 20's 4 s from sc 19 for its read floors and arrivals (D-90, Act Four unchanged), sc 11's and sc 13's 18 s of tripled air (D-88, `SCENE_ADJUST`), and the lock QA's 8 s of stretched tempo and 4B's second from 4A (D-91, D-93, `SCENE_ADJUST_LQ`).

<!-- BEGIN generated:scenes -->
| Scene | Frames | Seconds | In → out | Plan · the proposal's heading | Air fit | Arrival (spoken) | Aftermath | The plan's arrival · aftermath |
|---|---|---|---|---|---|---|---|---|
| 1 The mammoth, and what came through the door | 1,320 | 55.00 | 00:00:00 → 00:55:00 | 0:55.00 · same | ×1.134 | 3.54 | 18.46 | 1.01: 2.0 s, the meadow in the wall screen, the votive tick and the rack hum under it, 2 s before Selbeep turns; 1.13: the iris on the doorway |
| 4 The Email Séance (with Move 37 and F2.3) | 4,632 | 193.00 | 01:27:00 → 04:40:00 | 3:13.00 · same | ×1.131 | 5.67 (13.12) | 4.83 | 4.01: 2.5 s, the lit table, the room colour playing, the staffers' hands joined, before his click; 4.36: the dark after the last candle, 1.5 s |
| 4A You can sit down now | 792 | 33.00 | 04:40:00 → 05:13:00 | 0:33.00 · same | ×1.68 | 2.58 | 11.96 | 4A.01: 2.0 s, the room in morning light, candles gone, Mas already standing |
| 4B The booking | 216 | 9.00 | 05:13:00 → 05:22:00 | 0:09.00 · same | ×0.991 | 1.00 | 2.25 | 4B.01: 1.0 s, the phone's glow on the nameplate (continuous from 4A) |
| 6 Chapter 1 of 6 | 1,944 | 81.00 | 05:22:00 → 06:43:00 | 1:21.00 · same | ×1.532 | 1.38 | 3.67 | 6.01: 1.4 s, enter late on the locked two-shot, the sting ending |
| 7 A tenant | 1,152 | 48.00 | 06:43:00 → 07:31:00 | 0:48.00 · same | ×1.646 | 1.50 | 6.25 (act-out 1) | 7.01: 1.5 s, the split already opening, his voice on the phone leading us down; 7.08: 1.5 s on Mas at his monitor, then the jangle |
| 8 The dark room | 1,056 | 44.00 | 07:31:00 → 08:15:00 | 0:44.00 · same | ×1.681 | 14.08 (31.46) | 7.54 | 8.01: 2.0 s, the dark room with the monitor's glow already on his face; 8.07: the Monday square lit; the June invite under it |
| 9 Backstage | 1,224 | 51.00 | 08:15:00 → 09:06:00 | 0:51.00 · same | ×1.609 | 2.38 | 1.58 | 9.01: 2.0 s, the wings in work light, road cases and cables, the count from the stage already going; 9.06: the fifth square holding its Hey. a beat longer |
| 10 THE PLAN: OMNI | 1,104 | 46.00 | 09:06:00 → 09:52:00 | 0:46.00 · same | ×1.272 | 2.00 | 7.88 | 10.01: 1.0 s, the panel's last square becomes the grid's first cell, the waltz on its downbeat; 10.07: the tear's light, a beat |
| 11 "her" | 2,352 | 98.00 | 09:52:00 → 11:30:00 | 1:38.00 · same | ×1.413 | 2.00 | 3.54 | 11.01: 2.0 s, the stage wide as Rima takes her mark and the spot finds her; 11.16: the heads turning to the wings; the blimp over the emptying house |
| 12 The empty seat | 960 | 40.00 | 11:30:00 → 12:10:00 | 0:40.00 · same | ×1.128 | 35.54 | 3.25 (the midpoint act-out) | 12.01: 2.0 s, the stage as the house lights come up full, the blimp gone, the murmur thinning; 12.05: 1.5 s, the dark room with the monitor's news already playing; 12.08: his face, 2–3 s, then the stop |
| 13 Leave them up | 744 | 31.00 | 12:10:00 → 12:41:00 | 0:31.00 · same | ×1.363 | 2.38 | 4.83 | 13.01: 2.0 s, the staffers already at the pillar, one peeling, one smoothing, the TV murmuring |
| 14 The open floor | 1,416 | 59.00 | 12:41:00 → 13:40:00 | 0:59.00 · same | ×1.631 | 29.29 | 19.79 | 14.01: 2.5 s, the spread with the band lit and the heatsinks' polish catching the light; 14.12: the plate in the box; then his hand on Alyi's door as it pivots |
| 15 Where u at? (with F2.2) | 2,400 | 100.00 | 13:40:00 → 15:20:00 | 1:40.00 · same | ×1.342 | 6.88 | 10.88 | 15.01: 2.0 s, the empty office as the carried hum stops; 15.19: the empty room 1 s after the door shuts; then the stairs and the buzz |
| 17 The NDA across the bridge (the S3) | 3,120 | 130.00 | 15:20:00 → 17:30:00 | 2:10.00 · same | ×1.943 | 17.38 | 34.21 (act-out 3) | 17.01: 4.0 s, NopeAI's front doors, the receipt already pouring out, the Forecaster arriving from the street beside it, the band in; 17.21: the grey slot under his wet thumb; the ink running |
| 18 Present | 2,280 | 95.00 | 17:30:00 → 19:05:00 | 1:35.00 · same | ×0.987 | 8.75 | 4.33 | 18.01: 2.0 s, full frame on the lighthouse with the beacon already turning; 18.03: 1.0 s, the boardroom with the TV already playing; 18.15: the reminder on his phone; he turns it over |
| 19 Every phone they sell (with F2.1 and the walled garden) | 3,216 | 134.00 | 19:05:00 → 21:19:00 | 2:14.00 · same | ×1.409 | 11.25 | 9.79 | 19.01: 2.0 s, the running keynote with the lobby half-listening; 19.07: 1.5 s, the crowd's backs and the giant screen before Mas; 19.20: the gate's lock; the fold back into his phone |
| 20 (FOR NOW) | 1,248 | 52.00 | 21:19:00 → 22:11:00 | 0:52.00 · same | ×1.03 | 11.79 | 20.58 | 20.01: 1.0 s, the thinning crowd as the quartet's pedal carries over; 20.05: 2.0 s, the lobby on its morning bed, the confetti already swept; 20.10: 2.0 s, the face-down phone; 20.13: his still face, the flyer out, and the pin falling |
| 22 One door | 912 | 38.00 | 22:11:00 → 22:49:00 | 0:38.00 · same | ×1.431 | — | — | 22.01: 2.0 s, the white and the falling pin; 22.09: 4–5 s of his back crossing the lot, the cube unchanged |
| 23 The other company | 888 | 37.00 | 22:49:00 → 23:26:00 | 0:37.00 · same | ×1.345 | 20.42 | 14.62 (the hook) | 23.01: 1.5 s, his back as he sits at the desk (sc 22's match), the monitor's glow on; 23.09: the taut string, then his face |
<!-- END generated:scenes -->

**Read against the marks [M, J]:**
- **Every scene that opens a new place on a line, arrives on the room for 2.0 s or more,** with three exceptions. All three are the proposal's own agreed arrivals, kept as agreed (R2: "build exactly it"):
  - **sc 4B, 1.00 s** (the plan's own arrival since the lock QA; it was fitted to 1.42 s): an insert, not a new place. It is his phone on the same boardroom table, lit at the end of 4A ("continuous from 4A").
  - **sc 6, 1.38 s:** "enter late on the locked two-shot, the sting ending" (proposal sc 6, *Arrival / aftermath*). The podcast sting leads it by 0.8 s under 4B's tap (seam 7), so the new room's sound has been playing for about 2.2 s before XEL speaks.
  - **sc 7, 1.50 s:** "arrive on the split already opening, his voice on the phone leading us down (1.5 s before the first line)" (proposal sc 7). The voice is the seam's sound lead, and the building is already splitting under it.

  Each arrival is the plan's exact head, to the frame. A newcomer read (R7) is the test of whether the two late entries read; the fix, if they don't, is a 0.6 s and a 0.5 s head taken from the same scene's air.
- **Aftermath.** Every talk scene holds 1.5 s or more after its last word. Sc 4B, the one exception before the lock QA (0.83 s, the click 0.08 s after his thought), now holds 2.25 s after V.O. 3: the Accept click comes 0.36 s after the thought, a beat for his decision, and the card settles for 1.92 s after it (§3.5). The biggest turns hold far longer than 4–6 s:
  - **The midpoint:** Alyi's post (12.06), Mas's own post and V.O. 6, then his face for 3.25 s before the designed stop. That is 20.0 s from the post's arrival to the act-out.
  - **The door** (sc 22): no line at all, and 4.8 s of his back crossing the lot.
  - **Act-out 3** (sc 17): 34.2 s after the driver's last line, the night and the rain.
  - **Act-out 1** (sc 7): 6.25 s, "1.5 s on Mas at his monitor, then the jangle".
- **Sc 9 (1.58 s)** is at the edge of its band: "the fifth square holding its Hey. a beat longer", then the panel unfolds into the blueprint on the waltz's downbeat (seam 11).

---

## 3. Where the lock differs from the plan, and why

### 3.1 Sc 11 and sc 13 give back 18 s of fitted air (a change to the plan, so a rebuild keeps it)

**What the takes did [M].** The beat plans fit every scene to the proposal's runtime table. Each line keeps its recorded length and each gap its tempo mark; the scene's air (beat heads, tails and wordless holds) is scaled by one factor so the scene lands on its length. In two scenes the takes run far shorter than their words-at-rate plans: CHATGTP reads her Ep2 lines at 164–246 wpm against the plan's 150, and the engineer and the staffers run at 55–70 % of their plans ([takes-qa.md](takes-qa.md) §6). So the fit tripled those scenes' air:

| Scene | Fit (air ×) | The other 18 scenes | What it did |
|---|---|---|---|
| 11 "her" (1:51) | **×3.51** | ×0.97–1.91, median ×1.43 | every head and tail of the quick exchange ×3.5: 11.06's head 2.81 s before Rima's line, 11.08's tail 4.59 s after "It's free!" (a `_build.py` WARN), so 7.1 s from "It's free!" to Rima's close once her designed one-bar hold is counted |
| 13 Leave them up (0:36) | **×3.03** | | the walk-off (13.06) 7.27 s against its 2.4 s design |

**The decision [J], made in the plan** (`beat-plan/_spec.py` `SCENE_ADJUST`, with the reason beside it; `SEG_TARGET`; `_build.py --write`). **Sc 11 → 98 s (×1.41) and sc 13 → 31 s (×1.36)**, about the episode's median breath. The time comes back to the episode; none of it moves to another scene. Why:
- **The table is an estimate.** It is "Estimates [J] … ±0:40 until the takes and the stick reel" (proposal, *Runtime per act*). Now the takes exist.
- **The showrunner's rule:** "No dead air, and never lengthen things for the sake of runtime. Runtime is an outcome, not a target" (MEM-QB, *Pacing*). Also "dialogue back and forth could also be faster paced" (SN 00000), and W17: "tighten means cutting dead time, never the talk".
- **Both scenes are marked quick** (proposal *Pace*: 11 "the engineer and CHATGTP", 13 "the staffers"). Three times their designed air between cuts makes a quick scene slack.
- **What is untouched:** every fixed hold. In sc 11 that is the 2.0 s arrival, the three laugh tails (3.0, 3.2 and 3.0 s), CHATGTP's three held steps, Rima's one-bar hold (2.5 s), the post, the 10 s blimp, Rima's held mark and the 3.0 s aftermath. In sc 13 it is the 2.4 s arrival, the upside-down flyer (6.4 s), the presser (4.4 s) and the sticker's 1.6 s. No line, gap, overlap or on-screen item changed. The words, the tempo and every keep-list beat are as they were (R4, R5: nothing on the keep list is cut).
- **Where the time comes from:** sc 13 is after the midpoint turn, where R4 says length comes out. Sc 11 is the turn scene itself, and its time comes only out of the air between the demo's cuts, never out of the turn's aftermath.

**Beat by beat** [M] (est_s, then head · tail):

| Beat | Before | After |
|---|---|---|
| 11.01 | 9.31 (2.00 · 1.40) | 8.48 (2.00 · 0.57) |
| 11.02 | 5.83 (2.00 · 1.40) | 5.00 (2.00 · 0.57) |
| 11.04 | 14.13 (1.40 · 3.00) | 13.30 (0.57 · 3.00) |
| 11.05 | 10.79 (1.75 · 3.20) | 9.75 (0.71 · 3.20) |
| 11.06 | 9.40 (2.81 · 1.40) | 6.89 (1.13 · 0.57) |
| 11.07 | 11.82 (1.40 · 3.00) | 10.99 (0.57 · 3.00) |
| 11.08 | 6.52 (1.30 · **4.59**) | 3.73 (1.30 · 1.80) |
| 11.09 | 6.03 (2.50 · 1.75) | 4.99 (2.50 · 0.71) |
| 11.15 | 9.17 (2.46 · 1.40) | 6.87 (0.99 · 0.57) |
| 13.02 | 4.87 (0.15 · 0.91) | 4.37 (0.15 · 0.41) |
| 13.05 | 4.52 (0.91 · 1.60) | 4.02 (0.41 · 1.60) |
| 13.06 | 7.27 (wordless) | 3.27 (wordless) |

**To undo it:** delete the two `SCENE_ADJUST` rows, add 13 s and 5 s back to `SEG_TARGET`'s act2 and act3, then re-run `_build.py --write` and §7. The proposal's runtime section carries the change as D-88.

### 3.2 The lock now carries what the plan says. Five faults in the copied tools, each fixed and now checked

These are not differences from the plan. They are places where the copied tools had dropped or bent the plan, found by the checks this pass added (§5):

| # | What was wrong [M] | Fix | Where |
|---|---|---|---|
| 1 | **Five on-screen items lost or cut.** Ep1's `strip_note` drops a trailing "(…)" as a planning note, so the five items whose own words end in parentheses went: `DEFLECTION (LICENSED)` → "DEFLECTION" (7.02), `(o = omni)` dropped (10.01), `232 MS (AVG 320)` → "232 MS" (10.04), **`(FOR NOW)` dropped at both of its plants** (20.09, 23.01), `verified: human (all of them)` → "verified: human" (23.04). The plans list them in `keep_parens`, and nothing read that list | the builder reads each plan's `keep_parens`; `strip_note` stops once the "(a-b s)" window is off | `audio/reel/ep02-v1/build_timeline.py` |
| 2 | **Every on-screen item's kind was lost.** The plan's `onscreen_items` (rail, card, stat, plate, post, doc, caption, lower-third, toast, ui, sign: "authoritative", says its `_about`) never reached the lock, so the pixel lock called every non-rail item a `label` and found 0 posts in the whole episode | the base lock carries each item's `kind`; `lock.py` uses it (a post is a text of kind `post`, drawn in its own UI by the shot pass) | `build_timeline.py`, `studio/src/episodes/ep02/pixel/tools/lock.py`, `types.ts` (a comment) |
| 3 | **All 13 off-screen lines came out on screen.** `lock.py` read the stick's `os` tag only for a line with no take, and every Ep2 line has a take | `os` from the take or the plan's tag: 13 lines `os`, matching the plan's 13 `os` tags | `lock.py` |
| 4 | **Every across-the-cut tempo gap failed its check** ("tempo gap … None s") in 15 beats. The builder measured gaps only inside a beat, while the plan's quick exchanges often cut on the reply (`tempo.across_cut`) | measured on the segment clock: 76 of 76 gaps as planned | `build_timeline.py` `cut_gaps` |
| 5 | **The base lock's `takes_files` listed the plans' 173 take WAVs as takes files,** which `el_takes.py` would read as JSON | only JSON takes files are listed; `el_takes.py` skips anything that isn't JSON | `build_timeline.py`, `assembly/tools/el_takes.py` |

The checks that catch these from now on: `build_timeline.py` checks every plan item's words, window (±0.02 s) and kind in the lock, and every across-cut gap. `lock_report.py` checks the scenes, every tempo gap on the segment clock, the overlaps and the frames.

### 3.3 Sc 14's sentence line holds until the next command (P15, D-89). The lock's only on-screen change

The adventure-game sentence line was up for less than its read floor (P15, FIRM: 0.25 s + 0.05 s a character). The genre's own convention holds the sentence line until the next command replaces it, which meets the floor and costs no time [J]. These are `ONSCREEN_SET` entries in the base-lock builder, keyed by beat and text, so they survive a plan rebuild; each is logged as a deviation in `lock-report.json`:

| Beat | Item | Plan | Lock | Floor |
|---|---|---|---|---|
| 14.02 | `Look at heatsink` | 0.2–1.0 s | **0.2–2.8 s**, until `Pick up reflection` replaces it | 1.05 s |
| 14.02 | `Pick up reflection` | 2.8–3.5 s | **2.8–5.0 s**, under his reply, to the beat's end | 1.15 s |
| 14.03 | `Talk to reflection` | 0.2–0.9 s | **0.2–1.4 s**, 0.4 s into the dialogue tree that answers it | 1.15 s |

**Still under its floor:** 14.01's verb band, `Look at · Talk to · Pick up · Use · Open · Pivot · Raise`, is up 63 f against a 74 f floor. It is the game's menu, lit through the whole of sc 14 (`UI LIT`), so the shot pass draws it on every shot of the scene, not only in 14.01's 2.8 s [J].

### 3.4 What the lock keeps as the plan has it, after looking again

- **8.01, the act's first image, 8.07 s wordless** (a `_build.py` WARN: over 8 s). It isn't a held frame. The dark room arrives at a 13-day jump in time (P3: longer at a jump), the notification pops at 2.19 s and holds from 2.35 s for 4.2 s, for its 38 characters (a 2.15 s floor) and the SNOOZE gag, and he swipes it away at 6.72 s. Its longest still stretch is 4.21 s [M]. Kept.
- **19.06's tail, 3.38 s** (a WARN: over 3 s). It carries the lobby's laugh at +0.3 s and Gerg, the only one not cheering, taking out his phone, then the stream's audio carrying over the cut (L 0.8 s). Kept.
- **The two late arrivals (sc 6, 7) and 4B's insert** (§2): the proposal's agreed design.
- **The read holds.** The longest still stretches in wordless beats (§4.3) are posts held to their read floors: Superalignment's post (15.10, 7.2 s), Nole's post with its condition (20.02, 7.2 s) and Mas's Jun 10 post (19.07, 6.6 s). Kept.
- **The stream's announcement in 19.04** (the lock QA): `lock.py` notes it up 31 f in 19.04 against a 42 f floor. It is the same item as 19.05's full-frame `ON STREAM`, which follows with no gap, so it reads for 84 f (3.5 s) in all. Kept.

### 3.5 The lock QA (2026-10-09): eleven findings, each fixed in the plan or the tools, then rebuilt (§7)

The lock QA read this lock against the script, the proposal and the takes and found two majors and nine minors. Every fix is in the beat plan (`beat-plan/_spec.py`, the `LQ` fix code), the tools, or the docs, so a rebuild keeps it, and each one has a check that would catch it again (§4.1, §4.4) [M unless marked]:

| # | Finding | What changed | Measured in the rebuilt lock |
|---|---|---|---|
| 1 | **major · the cheer missed "And profit—".** The `crowd_cheer` spot sat 0.83 s after her last word (19.05 +0.6 s), and its cause, the stream's `…AND LATER THIS YEAR: CHATGTP.`, appeared after both; this page said the cheer was "laid by the stems and the mix" | re-timed in the plan, not the mix: in 19.04 the announcement comes up on the wall screen behind them and the stream's own crowd roars (`stream_announce_roar`, new, manifest §8) 0.2 s before her line; the lobby's `crowd_cheer` is anchored to her line, `L:e2-a4-0021+0.15`, so it lands on "profit" and runs on across the cut; 19.05 keeps the stream full frame from its first frame, the confetti and "Upside."; her take plays whole | the cheer at 119.708 s, on "profit"'s first frame, inside her line (119.568–120.338 s); the announcement up 0.375 s before it (§4.4) |
| 2 | **major · seven marked exchanges were never pinned,** so the fit stretched them (the driver 1.92 s against the script's 0.3; Nole's fear 1.59 against 0.5; "you're early." 1.0 s after the landing and Nole 1.07 after him; Terb 1.26 s after "present."; the softer cases) | seven `XGAP` rows (1.07 → 1.08, 4.07 → 4.08, 4.22 → 4.23, 4A.02 → 4A.03, 9.01 → 9.02, 17.04 → 17.05, 18.09 → 18.10; a row can now name its own outgoing tail: the frozen wall holds 0.3 s, the driver's window comes down under the cut), 4.07's head fixed so Mas speaks 0.45 s after the landing, Terb's roll call quick; each scene gives the time back in whole seconds (`SCENE_ADJUST_LQ`: table below). Two GUIDE breaks, each logged in the plan, the script and here: Gerg answers the second THUD 0.4 s after it (1.07 → 1.08; the THUD and the coffee sit between the lines), and "present." comes after the script's own HOLD 2 BEATS (18.08 → 18.09). The script's TEMPO lines and §3 table and the proposal's Pace table are corrected to match; `lock_report.py` now checks those marks in the lock itself (`PACE_LIST`) and stops counting `free` gaps as in a mark | every exchange in its mark, the two breaks aside (table below; §4.1) |
| 3 | minor · THE PLAN's stamp 3 sat on "get it", 0.96 s after "free" | `3.`, `$0` and their `rubber_stamp_C` at `L:e2-a2-0021+2.18`, the take's own word time; the tiny crowd 0.27 s later | stamp 2 on "today" and stamp 3 on "free", each on the word's first frame |
| 4 | minor · V.O. 6 came 8.21 s after his May 14 post, under its read floor | 12.07's head 8.6 → 9.3 s. The post is **172 characters** (the plan and the script had counted 165), so its floor is 8.85 s, not 8.50; sc 12 keeps its 40 s (its other air ×1.209 → ×1.128) | "i came back." 8.93 s after the post appears |
| 5 | minor · 4B: V.O. 3 ended 0.08 s before the Accept click and the scene 0.75 s after it | V.O. 3 on the planned 1.0 s arrival (fixed), the click a beat after his thought (`E:e2-vo-03+0.4`), and a second from 4A's long tail (4A 33 s with its own give-back, 4B 9 s); the sting's J-cut (0.8 s) now comes under the card settling | 2.25 s after V.O. 3; the click 0.36 s after it, then 1.92 s to the cut |
| 6 | minor · the cut-offs' subtitles: 11.04's carried the whole line over "Thanks."; 19.04's said "And profit?" under a second, different caption item | a plan line can carry `sub` pieces (`[text, word index | "after:<line>"]`): the plan builder validates them, `build_timeline.py` carries and checks them, and `lock.py` draws them while the take plays whole. 19.04's duplicate `caption` item is gone | `subs`: "Great question! … one of my favorite—" / "Thanks." / "—things." (from "Thanks."'s end, 16 f + its hold); "And profit—" |
| 7 | minor · the transcript left out the toasts, lower thirds, plates and signs (the candidate's own words on Aug 21 among them) and the outro's `viewer: verified: human` | `lock_report.py` `SHOW_KINDS` is every in-world kind; the outro row carries the credit | transcript-v1.txt |
| 8 | minor · the proposal's headings were the pre-lock table; the sc 19 → 20 move had no decision row; the script's header said 23:18 and +2 s | the headings carry the lock's lengths; D-90 records the move (the script pass's, R2), D-91 to D-96 this pass; the script's header says 23:20 and +4 s, and points to the lock | `lock_report.py` reads the headings: "same" for every scene (§2) |
| 9 | minor · the plan's `picture` notes (the framed `GUEST` lanyard, the odometer egg, "No image of Alyi in any surface") reached only the EL master's `passes`; the op-ed egg was in no plan | `lock.py` writes each shot's `picture` (the JSON and `data.ts`, `PxShot.picture`); `scenes.py --refresh-stubs` rewrites the header of a module that is still a bare stub (its code exactly the stub's; nothing drawn is ever touched) with each shot's frames and notes; 18.14 carries `NELEH & THE QUIET VOTE` (a `sign`, an egg) and its note; 8.01 names Ep1's framed `GUEST` lanyard | every shot carries its beats' notes: 193 of 243 have one (the plan's other 50 beats have none); the 20 stubs list them |
| 10 | minor · the engineer's laugh (9.03) was a placeholder with no length | the plan's sounds take `until=` (a time spec, so a sound can stop on a take's word): `engineer_laugh_take` runs from 0.15 s to the end of Gerg's "laugh", a timed request for the sound pass (§6) | 9.03 frame 5, 3.74 s, ending on "laugh" to the frame |
| 11 | minor · V.O. 9 was sent with commas: 0.21 s after "signed", heard "Everyone who signed the post, …", so the count could parse as "signed the post" | re-read through the takes route (`el_qa.py variant`, then `render_v1.sh` and the QA): a full stop after "signed", speed 1.2 (the maximum); three reads tried, 66 credits; on the ear list ([takes-qa.md](takes-qa.md) §6) | 0.47 s after "signed", heard "Everyone who signed. The post. Everyone who signed."; 3.48 s, 138 wpm (a LOOK against 145–165: the time is in its two breaks; its articulation, 4.46 syllables a second, is quicker than the comma read's 4.29) |

**The pinned exchanges** [M], line to line on the segment clock (the landing: from the thump's onset):

| Exchange | The mark, where it is set | Before | After |
|---|---|---|---|
| 1.07 → 1.08 · Selbeep → Gerg's correction | quick (script) → a GUIDE break: Gerg answers the second THUD 0.4 s after it | 1.10 | 0.53 |
| 4.07 · the landing's thump → "you're early." | quick, Mas 0.4–0.5 (proposal Pace) | 1.00 | 0.47 |
| 4.07 → 4.08 · Mas → Nole, loud, fast, first | quick (proposal Pace) | 1.07 | 0.31 |
| 4.22 → 4.23 · "…millions of games." → Nole's fear | normal, 0.5 s (script) | 1.59 | 0.51 |
| 4A.02 → 4A.03 · the reading → "You can sit down now, Mas." | quick and dry (script) | 1.69 | 0.28 |
| 9.01 → 9.02 · "We're on in five." → the engineer | quick (proposal Pace: 9) | 0.92 | 0.32 |
| 17.04 → 17.05 · the Forecaster → the driver | quick, 0.3 s (script) | 1.92 | 0.31 |
| 18.08 · Terb's first task → his roll call | quick (script: Terb) | 0.50 | 0.25 |
| 18.09 → 18.10 · "present." → Terb's next line | quick (script: Terb) | 1.26 | 0.27 |

**The time given back** (`SCENE_ADJUST_LQ`, whole seconds, each the length nearest the scene's earlier fit of its air) [M]: sc 1 0:56 → 0:55 (×1.157 → ×1.134) · sc 4 3:16 → 3:13 (×1.146 → ×1.131) · sc 4A 0:35 → 0:33 (×1.781 → ×1.68, one of its seconds to 4B) · sc 4B 0:08 → 0:09 · sc 9 0:52 → 0:51 (×1.679 → ×1.609) · sc 17 2:11 → 2:10 (×1.912 → ×1.943) · sc 18 1:36 → 1:35 (×0.974 → ×0.987). The story is 8 s shorter; no line, keep-list beat, arrival or designed hold moved (R4, R5) [J: the fit spreads any remainder over each scene's own air]. **To undo it:** delete `SCENE_ADJUST_LQ`'s rows, give `SEG_TARGET` back its seconds (cold open +1, act1 +4, act2 +1, act3 +1, act4 +1), then `_build.py --write` and §7; the pins stay, and their time then spreads over each scene's other air.

**Not changed, and why** [J]: the script's per-shot planning lengths (`[beat] (≈ s)`) predate the takes, so `_check_script.py` still reports 148 of them off the plan's `est_s` (150 before this pass); its line and rail checks pass (173 lines, 22 rails). They are planning numbers ("the takes and the stick reel replace every number", its header), and the lock is the record.

---

## 4. The plan's marks, measured in the lock

### 4.1 Tempo (W18)

Every gap the plan marks, measured in the pixel lock on the segment clock (line onsets and ends in seconds), inside a beat and across a cut [M]. "As planned" allows one frame: a beat starts on a whole frame, so a gap across a cut can move by up to 1/24 s. A `free` gap (action between the lines) has no mark, so it is checked only against the plan, never counted as in a mark (the lock QA). Below the plan's table, the **script's and the proposal's own pace list** is measured in the lock independently of the plan's classes (`lock_report.py` `PACE_LIST`, the lock QA): it is what found the exchanges the plan had left unpinned (§3.5).

<!-- BEGIN generated:tempo -->
| Mark | Gaps | Lock (median · range, s) | In the mark | As planned (±1 frame) |
|---|---|---|---|---|
| quick (0.15–0.35 s) | 38 | 0.25 · 0.20–0.32 | 38 of 38 | 38 of 38 |
| quick-mas (0.4–0.5 s) | 12 | 0.45 · 0.42–0.47 | 12 of 12 | 12 of 12 |
| normal (0.4–0.6 s) | 16 | 0.50 · 0.40–0.60 | 16 of 16 | 16 of 16 |
| weighted (0.6–3.0 s) | 8 | 0.95 · 0.60–2.30 | 8 of 8 | 8 of 8 |
| free (no mark: action between the lines) | 9 | 0.60 · -0.55–2.60 | — (not a mark) | 9 of 9 |

**74 of 74 marked gaps are in their marks**; the 9 free gaps are checked only against the plan (to a frame).

**The script's and the proposal's own pace list** (`PACE_LIST`, measured in the lock, independent of the plan's classes):

| After | Reply | Mark | Lock (s) | Result | Where the mark is set |
|---|---|---|---|---|---|
| e2-co-0005 | e2-co-0006 | quick | 0.53 | GUIDE break: the second THUD lands 0.1 s after Selbeep's line and the coffee jumps; Gerg answers the THUD 0.4 s after it | script 1.07-1.08: quick (Gerg at 0.25 s); proposal Pace: 1 quick |
| sound 4.07:landing_thunk | e2-a1-0005 | quick-mas | 0.47 | in the mark | proposal Pace: 4 "you're early." quick; Mas 0.4-0.5 s |
| e2-a1-0005 | e2-a1-0006 | quick | 0.31 | in the mark | proposal Pace: 4 Nole's volleys quick; script 4.08: Nole loud, fast, first |
| e2-a1-0056 | e2-a1-0024 | normal | 0.51 | in the mark | script 4.20-4.24: normal for Nole's fear (0.5 s) |
| e2-a1-0032 | e2-a1-0033 | quick | 0.28 | in the mark | script 4A: the line to Mas quick and dry |
| e2-a2-0002 | e2-a2-0003 | quick | 0.32 | in the mark | proposal Pace: 9 quick (the engineer, Gerg) |
| e2-a1-0042 | e2-a1-0043 | weighted | 1.51 | in the mark | script 6.06-6.07 and proposal Pace: weighted (Mas's long answer) |
| e2-a3-0016 | e2-a3-0017 | quick | 0.30 | in the mark | script 17.04-17.06: the driver quick (0.3 s) |
| e2-a3-0017 | e2-a3-0018 | normal | 0.50 | in the mark | script 17.04-17.06: the answer normal (0.5 s) |
| e2-a4-0004 | e2-a4-0005 | quick | 0.25 | in the mark | script 18.08-18.10: quick (Terb) |
| e2-a4-0005 | e2-a4-0006 | quick-mas | 1.53 | GUIDE break: the script's own HOLD 2 BEATS on "our chief executive.": every face at the table turns to Mas before "present." | script 18.08-18.10: Mas at 0.45-0.6 s |
| e2-a4-0006 | e2-a4-0007 | quick | 0.27 | in the mark | script 18.08-18.10: quick (Terb) |
| e2-a4-0007 | e2-a4-0008 | normal | 0.60 | in the mark | script 18.08-18.10: Mas at 0.45-0.6 s |

Other replies across a cut inside a scene under 2 s that neither the list nor the plan marks: 7, each not an exchange: 4.04 -> 4.05 1.80 s (a new exchange: a staffer's eyes go to the empty chair first, and Gerg answers her look); 4.05 -> 4.06 1.17 s (not a reply: Mas puts the séance's next question to the table); 4.18 -> 4.19 1.11 s (not a reply to the ghost: Mas asks the board the question he wants answered (the concept's door)); 4.24 -> 4.25 0.92 s (not a reply: ghost 3 drifts into his eyeline and replays its own words (a device)); 9.03 -> 9.04 1.45 s (a new exchange: Mas turns to Rima (9.04's two-shot); Gerg was warning the engineer); 11.06 -> 11.07 1.12 s (the demo's next step: Rima cues the house, the engineer turns the phone's camera on it, then speaks); 15.06 -> 15.07 1.59 s (not a reply to the chant: Alyi's raised hand finds Mas in the crowd first; their exchange is quick inside 15.07).

Overlaps (a line starting before the one before it ends): e2-a2-0028 over e2-a2-0027 by 0.55 s (act2).
<!-- END generated:tempo -->

- **Mas is unhurried:** his 12 quick replies come at 0.42–0.47 s, inside W18's 0.4–0.5 s, and "you're early." 0.47 s after the landing. The others' 38 quick replies come at 0.20–0.32 s, inside 0.15–0.35 s.
- **The one line overlap is the motivated one:** the engineer's "Thanks." comes in 0.55 s over CHATGTP's "favorite" ("he asked for short"; record both whole). The proposal's other overlap, the cheer over "And profit—" (sc 19), is a sound against a line, and since the lock QA it is placed in the plan, not left to the mix: the cheer starts on "profit", inside her line, with its cause 0.375 s before it (§4.4). W18 allows one or two overlaps a scene.
- **The median gap between lines, act clock (cuts included), spoken only [M]:** Act One 1.14 s, Act Two 1.15 s, Act Three 0.60 s, Act Four 0.55 s (before the lock QA: 1.25, 1.15, 0.90, 0.60). Inside a beat: 0.30, 0.35, 0.45, 0.45 s.

### 4.2 The pacing tool (`studio/src/reel/tools/pacing.py`, run by the builder) [M]

243 shots in 22.9 min (ASL: Act One 5.9 s, Two 6.3, Three 5.5, Four 5.6). 28 stays, median 37.0 s. Of 22 talk stays of 8 s or more, the entry-air median is 4.7 s and the exit-air median 5.6 s.
- **Six stays are entered with 2 s or less before their first line.** Two are §2's agreed late entries (sc 6, 7); one is sc 11's stage at exactly 2.0 s, on the mark. One is F2.2's bonfire (15.06, 1.8 s), led in by the ping's ripple and the choir (seam 18). Two are cuts inside a scene rather than arrivals: the return from F2.2 to the present office (15.17, 1.88 s) and sc 18's split cross-cutting to Mario's pane (18.11, 0.46 s).
- **Two stays leave with 1.5 s or less after their last line,** both sc 18's split, whose panes cross-cut inside one scene (18.10 at 0.79 s, 18.14 at 0.96 s). The third before the lock QA, 4B's insert, now holds 2.25 s (§3.5).

### 4.3 Holds (P4)

Every wordless beat over 4 s, and in it the longest stretch with no sound, text or line event [M]. A long stretch here means "look again", not a failure: whether the picture moves inside it is the shot pass's to say.

<!-- BEGIN generated:holds -->
| Beat | Seconds | Events in it | Longest still stretch (s) | Frame |
|---|---|---|---|---|
| 15.10 | 8.90 | 6 | 7.20 | 2S · this office, 2023, night: Alyi at his screen (cropped by its edge), Ekiel beside him; |
| 20.02 | 7.60 | 4 | 7.20 | SPLIT · RIGHT: his lamp clicks on; his post goes up, one crop, with its condition |
| 19.07 | 9.40 | 5 | 6.60 | WIDE · ELPPA's campus: the crowd's backs and the giant screen; at the crowd's edge Mas fin |
| 12.01 | 6.09 | 1 | 5.86 | WIDE · the stage as the house lights come up full, the rig empty, Rima small on her mark → |
| 17.17 | 10.00 | 3 | 5.80 | WIDE · May 20, a new day on the bridge, traffic moving; Mas under an umbrella; the blimp d |
| 10.07 | 7.12 | 1 | 5.34 | GFX · the break: an empty speech bubble drifts in from the margin and blots out the tiny s |
| 14.04 | 5.22 | 0 | 5.22 | MCU · his own reflection mouthing can we talk? back to him |
| 22.01 | 7.44 | 3 | 4.72 | WIDE · white, room tone only; the pin falls into it; the white is sky over an empty lot; t |
| 4A.05 | 4.71 | 0 | 4.71 | WIDE · as he sits he glances at Gerg at the back; Gerg lifts the laptop an inch |
| 15.16 | 4.56 | 0 | 4.56 | WIDE → ECU · the fire's glow shrinks to one point of light |
| 4.29 | 4.50 | 0 | 4.50 | WIDE · the slide and the room in one frame: Nole finishes at the slide; nobody applauds |
| 15.08 | 6.44 | 5 | 4.29 | ECU · Alyi holds up his phone, Mas's dead app open: CHECK IN → feel the agi; he turns the  |
| 17.18 | 7.00 | 3 | 4.28 | WIDE · it rains letterhead; the receipt's ink runs in the rain |
| 8.01 | 8.07 | 6 | 4.21 | OTS · over Mas's shoulder in the dark, glass in the foreground: the notification slides do |
| 4.32 | 4.20 | 0 | 4.20 | 2S · across the room: ALYI foreground, cropped by his monitor's edge, turns and looks back |
| 15.15 | 4.83 | 2 | 4.03 | WIDE · the effigy catches |
| 13.03 | 6.40 | 2 | 4.00 | ECU → MCU · a fallen flyer; Mas picks it up and tapes it back himself, upside down |
| 14.10 | 6.00 | 6 | 3.90 | HIGH · the floor: his resignation thread stands up as one domino, in its own UI; it topple |
| 18.05 | 4.20 | 4 | 3.90 | FULL FRAME · under it, the board's same-day reply in its own statement card |
| 20.10 | 7.00 | 10 | 3.90 | ECU · Jun 19, his dark room: his phone face down on the desk, lights; his hand turns it ov |

73 wordless beats run over 4 s; the 20 with the longest stretch with no sound, text or line event are listed (all of them: assembly/lock-v1-checks.json, `holds`).
<!-- END generated:holds -->

No stretch reaches P4's "about 8 s with nothing changing". The longest (7.2 s) are post read holds (§3.4).

### 4.4 The lock QA's marks: the cut-offs, word anchors, read floors and requests

Each fix of §3.5 that a rebuild could undo has a check in `lock_report.py` (`MARKS`), measured in the pixel locks, in seconds on each act's own clock [M]:

<!-- BEGIN generated:marks -->
| Check | Result | Measured |
|---|---|---|
| the cheer cuts "And profit—" | ok | crowd_cheer at 119.708 s; her line 119.568-120.338 s, "profit" from 119.708 s |
| its cause comes first | ok | the stream's announcement up at 119.333 s, the cheer at 119.708 s |
| "Thanks." over "favorite" | ok | "Thanks." at 167.257 s; "favorite" 167.000-167.333 s; CHATGTP's line ends 167.807 s |
| the subtitles of the two cut-offs | ok | e2-a2-0027 ['Great question! Of course! Honestly, short answers are one of my favorite—', '—things.']; e2-a4-0021 ['And profit—'] |
| stamp 2. on "today" | ok | the stamp at 123.917 s, "today" from 123.917 s |
| stamp 3. on "free" | ok | the stamp at 125.083 s, "free" from 125.083 s |
| V.O. 6 after the post's read floor | ok | the post up at 265.625 s, "i came back." at 274.550 s: 8.93 s against 8.85 |
| 4B: the click a beat after his thought, 1.5 s after it | ok | V.O. 3 ends 232.720 s, the click 233.083 s, the scene ends 235.000 s |
| the engineer's laugh stops on "laugh" | ok | engineer_laugh_take 60.042 s + 3.74 s; Gerg's "laugh" ends 63.792 s |
<!-- END generated:marks -->

---

## 5. Every lock check

The results of the lock QA's rebuild (§7, 2026-10-09); the lock pass's first run had the same results except where a row says so.

| Tool | What it checks | Result [M] |
|---|---|---|
| `beat-plan/_build.py` | every scene and segment on its target; air holds (head or tail over 3 s, a wordless beat over 8 s); lines defined and used once; the V.O. map (14 lines, order, banned words, lowercase); rails as dates and the rail list; no V.O. under a rail or a toast; the tempo marks; the read floors of must-read kinds; arrivals and transitions; the cast; **the lock QA:** a line's subtitle pieces (`sub`) and a sound's `until` | **0 FAIL**; 2 WARN (8.01's 8.07 s and 19.06's 3.38 s, looked at in §3.4); **83 tempo gaps** (76 before the lock QA's seven pins), 0 outside their marks |
| `audio/reel/ep02-v1/build_timeline.py` | each beat against the plan's `est_s` (±0.05 s); every line in; the beat order; every across-cut and inside tempo gap (§3.2 #4); every on-screen item's words, window and kind (§3.2); **a line's subtitle pieces (the lock QA)**; pre-laps; scene ids | **0 check failures** in six segments; 3 deviations, all §3.3's `ONSCREEN_SET`; 0 lines past their shot, 0 J-cut lines |
| `audio/ep02/v1-el/tools/el_lock.py` (every segment, then the manifest) | each take swapped in; the gaps kept; no line silently dropped | the identity: **+0.00 s**, 0 beats changed, 0 missing takes; MARIO's 6 lines kept on their Kokoro takes; V.O. 9's new take in (§3.5 #11) |
| `assembly/tools/el_takes.py` (through `ops/heavy.sh`) | the takes with the Kokoro camera fields and mouth tracks | 173 rows: 153 mouth tracks, 14 V.O., MARIO's 6 Kokoro rows with their own tracks; 4 words phonemised from letters (`Manalt`, `séance`, `Omni`, `wo-o-ord`) |
| `assembly/tools/el_lock.sh` → `pixel/tools/lock.py` ×6 | scenes tile the segment; shots = beats; shots tile with no gap; lines on the stick's frames; every line has a take; speech inside its file; mouths carried; on-camera mouths | **8 of 8 checks ok in every segment.** "Problems": 5 speaker-label notes (`staffer` against the take's `TILED EMPLOYEE`: the STAFFER role is voiced by the carried Avery role, so the label differs and the voice is right). Decisions: 14.01's verb band (§3.3) and 19.04's announcement (§3.4) |
| `pixel/tools/scenes.py --refresh-stubs` ×6 | a stub for each new scene; a bare stub's header for the new lock (the lock QA); the `shots.ts` import block | no new scene; the 20 modules are still bare stubs, so all 20 headers were refreshed (frames, picture notes); `shots.ts` unchanged |
| `pixel/tools/build.mjs` + `render.ts check --allow-standins` ×6 (through `ops/heavy.sh`) | the renderer builds; the lock and the layouts load; marks resolve; layouts don't throw | **0 problems** in six segments; 243 of 243 shots are stand-ins, as expected until the shot pass draws |
| `render.ts scenekeys` ×6 | each scene's cache key | 20 scenes keyed, none cached |
| `assembly/tools/lock_report.py` | the frames and episode clock against every pixel lock's ep-in; scenes against their plan targets and the proposal's headings; P3's arrival and aftermath; every tempo gap against its mark; **the script's and the proposal's pace list (`PACE_LIST`) and every other reply across a cut under 2 s (`NOT_EXCHANGE`)**; overlaps; **the lock QA's marks (§4.4)**; P4's holds; writes the transcript | **0 FAIL**; 3 LOOK, all looked at in §2 (the agreed arrivals of sc 4B, 6 and 7); the pace list: 13 marked exchanges, 11 in their marks, 2 logged GUIDE breaks; 7 other replies, each with why it isn't an exchange; marks 9 of 9 |
| `beat-plan/_check_script.py` | the script against the plans: beats, lines, rails | 243 beats, 173 lines and 22 rails match; 148 per-shot planning lengths differ from the plans' `est_s` (150 before the lock QA): §3.5, *Not changed* |
| `ops/rebuild-act.sh --ep 2 <act> --dry-run` ×4 | every command and input of the per-act rebuild | every lock input present; missing only the downstream pictures, mixes, intro, outro and hum tail (the film step) |
| `audio/ost/tracks/e02-v1-<seg>/track.py --dry --el` ×6 | the score's music runs on the EL lock | every segment's runs parse, E02-01 to E02-13 in order (the cues are the score pass's) |
| the studio typecheck (`npx tsc --noEmit`, through `ops/heavy.sh`) | the scene modules, the `shots.ts` import blocks, the six `data.ts` locks, `types.ts` (`PxShot.picture`, the lock QA) | 20 errors, all in `src/dev/`: the baseline count (pipeline.md §9). None is in an Ep2 file |
| `studio/src/reel/sync.mjs`'s lint (the lock pass, from a scratch copy) | the stick timelines' schema (sets, kinds, styles, figures, lines) | no schema warning at the lock pass; **not re-run by the lock QA** [J: the fields it checks didn't change; a line's `sub` and a sound's `dur` are new values, not new kinds] |

**Not run, and why:** `measure.py` needs the stick reel's plan (`episode.mjs --plan`, a Remotion bundle); the stick reel isn't in this pass's order, and `lock_report.py` writes the transcript and the marks from the locks themselves. `bed.py` (the stick reel's temp beds) and the score's `check.py` (stems against the lock) have nothing to run on until the stems exist. The smoke test isn't needed: no shared code changed, only Ep2's copies (`git status`, §8).

---

## 6. For the next passes

**The shot pass (picture):**
- **20 stub scene modules** are waiting in `studio/src/episodes/ep02/pixel/<seg>/scenes/sc-<scene>.ts`. Each one's header lists its shots, their frames and **the plan's picture notes** (the lock QA), and `shots.ts` imports them. A layout's `f` is the frame inside its scene. Re-run `scenes.py <seg> --refresh-stubs` after a re-lock: it rewrites only a module that is still a bare stub.
- **Each shot carries the beat plan's `picture` note** (`sh.picture` in `data.ts`, `picture` in `lock/<seg>.json`; the lock QA): the eggs (the odometer in the bedrock, 7.01; the op-ed byline `NELEH & THE QUIET VOTE` on Mario's desk, 18.14, also a `sign` text), the Ep1 payoffs (the framed `GUEST` lanyard in the dark room, 8.01 and 23.x) and the constraints ("No image of Alyi in any surface", sc 14). Read it with the caption (`does`) before drawing a shot.
- **Every in-world text carries its plan kind** (`sh.texts[].kind`). Posts are texts of kind `post`: Ep2's posts carry no author prefix, so the shot pass draws each one in its own UI (W20). The default `drawTexts` still draws unknown kinds as tags, so a layout should draw its posts and docs itself.
- **13 lines are `os`** (from the plan's tags); the device lines carry their tag (`call`, `ghost`, `phone`, `podcast`, `tv`, `far`, `offmic`, `sung`, `chant`) for the face and lip calls.
- **The sung line's mouths:** "one wo-o-ord." has a letters-guess mouth track; its take carries each note's time and pitches (`notes`) for the three mouths.
- **14.01's verb band** stays lit through sc 14 (§3.3).
- **19.04's wall screen** shows the stream's `…AND LATER THIS YEAR: CHATGTP.` from 0.2 s before Haras's "And profit?" (the cheer's cause, behind the 2S), and 19.05 opens on it full frame (§3.5 #1).
- **The subtitles of the two cut-offs** are pieces (`lock.subs`, several rows with one line id): "…one of my favorite—" / "Thanks." / "—things." and "And profit—" (§3.5 #6). `subAt` already shows the latest-started piece.

**The score pass:** the music runs per segment are the `track.py --dry --el` output (§5). After the lock QA, sc 11 (98 s) runs from 141.00 s of Act Two: E02-07's demo cue to 207.33 s, its pad to 239.00 s. Every act from Act One on starts earlier on the episode clock (§1).

**The sound and mix passes** (the takes pass's handoff stands):
- the ghost, far, phone, call, podcast, TV and off-mic chains;
- MARIO's EQ and his level within about 1 dB of EKIEL;
- the crowd, delivered at −19 LUFS;
- the sung part stems.

Every take is dry: `el_lock.py` plays a device copy only for a take with a Kokoro call reference, and Ep2's takes have none. Two sound requests from the lock QA, each a spot in the lock with its time:
- **The ENGINEER's laugh (9.03), a timed request** (`engineer_laugh_take`, −22 dB): a nervous laugh **in the ENGINEER's own library voice** (his cast pick, cast.md §3.4), never an imitation of anyone and no laugh mimicry (S6), from 9.03's shot frame 5 for 3.74 s, so it stops on Gerg's word "laugh" (Act Two frames 1441–1531, episode 08:31:01–08:34:19), ducked under "Careful. The new one can hear you laugh.". It is the setup for that line, for the `[laughter]` tag that drops off the monitor, and for THE PLAN's "It can even laugh back". It is not in the takes: the sound pass asks for it through the takes route (`el_qa.py`'s checks), so it is measured like a line.
- **The cheer's cause** (`stream_announce_roar`, new, manifest §8): the keynote stream's own crowd, low on the lobby's wall screen, 0.2 s before "And profit?"; then the lobby's `crowd_cheer` on "profit" (19.04, 0.15 s into her line), running on across the cut into 19.05 under "Let me reframe that. Upside." Lay the cheer from its spot; her take plays whole under it, and the subtitle already reads "And profit—".

**The ear (R8):** the takes pass's list ([takes-qa.md](takes-qa.md) §6) and cast.md §8.5 stand. The lock adds questions for the ear: do sc 11's and sc 13's new beats leave enough room for the laughs and the walk-off (every laugh tail is the plan's own fixed length)? Do the pinned exchanges (§3.5's table) read quick, and does the THUD still land before Gerg's correction? And V.O. 9 (takes-qa.md §6 #3): three items, never "signed the post".

---

## 7. How to rebuild

```sh
python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write          # the plans (SCENE_ADJUST, SCENE_ADJUST_LQ, XGAP)
python3 audio/reel/ep02-v1/build_timeline.py                                  # the base lock + manifest + lock-report.json
audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_lock.py              # the EL master, every segment + manifest
HF_HUB_OFFLINE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/el_takes.py
bash show/episodes/ep02/production/v1/assembly/tools/el_lock.sh               # the six pixel locks (data.ts + lock/<seg>.json)
for s in coldopen act1 act2 act3 act4 tag; do python3 studio/src/episodes/ep02/pixel/tools/scenes.py $s --refresh-stubs; done
python3 show/episodes/ep02/production/v1/assembly/tools/lock_report.py --md   # the checks, transcript-v1.txt, this page's tables
python3 show/episodes/ep02/production/v1/beat-plan/_check_script.py            # the script against the plans (§5)
```

A line re-read (as V.O. 9 was, §3.5 #11) goes through the takes route first: its reading or setting in `audio/ep02/cast-el.json`, then `SEGS=<seg> STEPS=render bash ops/heavy.sh bash audio/ep02/v1-el/tools/render_v1.sh`, `el_qa.py retake --segs <seg>` with the segment's `--force` list as `render_v1.sh` has it (act3: `--force e2-a3-0014`, or EKIEL's kept read reverts to his first), `STEPS="special report"`, then the lines above.

One act alone: `ops/rebuild-act.sh --ep 2 <act> --only lock`. All of it took under a minute here (the mouth tracks about 7 s), with the load at 3–4; the lock QA's rebuild the same, with the load at 6–9.

---

## 8. Files

| What | Where |
|---|---|
| The base lock (EL-timed already; the manifest `ep02-v1-stick`; the card) | `show/reel/ep02-v1/ep02-v1-{coldopen,act1,act2,act3,act4,tag,card}.json`, `ep02-v1.manifest.json`; `audio/reel/ep02-v1/lock-report.json` |
| **The master** (EL lock; manifest `ep02-v1-el-stick`) | `show/reel/ep02-v1-el/ep02-v1-el-<seg>.json`, `ep02-v1-el.manifest.json`; `audio/ep02/v1-el/ep02-v1/el-lock-report.json` |
| The takes with mouths | `show/episodes/ep02/production/v1/assembly/el-v1/<seg>-takes.json`, `el-takes-report.json` |
| The pixel locks | `show/episodes/ep02/production/v1/lock/<seg>.json`, `studio/src/episodes/ep02/pixel/<seg>/data.ts` |
| The scene stubs | `studio/src/episodes/ep02/pixel/<seg>/scenes/sc-*.ts`, `<seg>/shots.ts` (the import block) |
| The checks and the transcript | `assembly/tools/lock_report.py` → `assembly/lock-v1-checks.json`, [transcript-v1.txt](transcript-v1.txt), this page's tables |
| **Changed** (Ep2 files only) | `beat-plan/_spec.py` (sc 11 and sc 13's `SCENE_ADJUST`, `SEG_TARGET`), `beat-plan/act2.json` and `act3.json` (regenerated); `audio/reel/ep02-v1/build_timeline.py` (§3.2 #1, 2, 4, 5; §3.3's `ONSCREEN_SET`; the on-screen check); `studio/src/episodes/ep02/pixel/tools/lock.py` (§3.2 #2, 3), `types.ts` (a comment); `assembly/tools/el_takes.py` (§3.2 #5); [proposal.md](proposal.md) (D-88, D-89 and the runtime after the lock); [pipeline.md](pipeline.md) (§10's open issue 2 closed); `audio/reel/ep02-v1/README.md` and the pixel README (a paragraph each) |
| **Changed by the lock QA** (§3.5; Ep2 files only) | `beat-plan/_spec.py` (the `LQ` rows of `XGAP` and their optional tail; `SCENE_ADJUST_LQ`, `SEG_TARGET`; 1.07, 4.07, 4B.01, 8.01, 9.03, 10.05, 11.04, 12.07, 18.08, 18.09, 18.14, 19.04, 19.05), `beat-plan/_build.py` (a line's `sub`, a sound's `until`), the six plan JSONs (regenerated); `audio/reel/ep02-v1/build_timeline.py` (carries and checks `sub`); `studio/src/episodes/ep02/pixel/tools/lock.py` (subtitle pieces, each shot's `picture`), `tools/scenes.py` (`--refresh-stubs`), `types.ts` (`PxShot.picture`), the 20 stub headers; `assembly/tools/lock_report.py` (`SHOW_KINDS`, the outro credit, `free` apart, `PACE_LIST`, `NOT_EXCHANGE`, `MARKS`); `audio/ep02/cast-el.json` (V.O. 9's reading and speed), `audio/ep02/v1-el/ep02-v1/act3/{lines-A,manifest}.json`, `qa/act3-qa.json`, `variants/` (V.O. 9's three reads); [takes-qa.md](takes-qa.md) (V.O. 9, §6, §7); [proposal.md](proposal.md) (the headings, sc 4B and 19, the Pace notes, D-90 to D-96, the runtime after the lock QA); [script-v1.md](script-v1.md) (the header, the TEMPO lines and §3, 4B, 8.01, 9.02, 12.07, 19.04–19.05, §5, §6); [manifest.md](manifest.md) (§8: the cheer's cause, the laugh); [pipeline.md](pipeline.md) (§10's note); the two READMEs |

---

## 9. LEARNINGS rules checked

- **R9** [M]: the EL-timed lock is the master, written into the canonical pixel files. Every line is in the plan the builder reads, and every line of the base lock is in the EL lock (`el_lock.py`: 0 missing, nothing dropped). The lock pass's and the lock QA's timing changes are in the plan (`SCENE_ADJUST`, `SCENE_ADJUST_LQ`, `XGAP`, the word-anchored spots and items) and the text holds in the builder's table, so a rebuild keeps them all; the cheer is placed in the plan, not the mix. No `--fixed`.
- **W18** [M]: 74 of 74 marked gaps are in their marks, and the 83 (with the 9 free ones) as planned to a frame. The script's and the proposal's own pace list, measured in the lock: 11 of 13 in their marks, and 2 GUIDE breaks, each logged with its line (Gerg after the THUD; "present." after the table's two-beat hold). Mas's quick replies come at 0.42–0.47 s, the others' at 0.20–0.32 s. There is one line overlap, the motivated one, and the cheer is the episode's second cut-off.
- **P3** [M, J]: arrivals and aftermaths per scene (§2). Three arrivals are under 2 s by the proposal's agreed design, kept and listed (GUIDE: broken on purpose by the proposal, with its reasons). Every talk scene now holds 1.5 s or more after its last word (4B: 2.25 s).
- **P4** [M]: holds over 4 s with their longest still stretch. None reaches 8 s; the 8.01 and 19.06 WARNs were looked at.
- **P15** [M]: sc 14's sentence line now meets its floor. 14.01's verb band is the scene's menu (§3.3). V.O. 6 now comes after his May 14 post's floor (172 characters, 8.85 s; the voice at 8.93 s).
- **R4, R5** [M, J]: the time came out of dead air: the lock pass's after (and at) the midpoint, the lock QA's from stretched replies, in whole seconds per scene; nothing on the keep list moved (the cheer's cut-off, a keep-list beat, is now in the lock); 4B's second came from 4A's own tail, inside Act One.
- **R2** [M]: every change went back into the proposal (D-88 to D-96, the headings, its runtime section), and the script's TEMPO lines, §3 and header now match the lock.
- **R1** [M]: no Ep1 file touched (`git status` shows no Ep1 path). Ep1's `build_timeline.py`, `lock.py` and `el_takes.py` were only read; no shared code changed, so the smoke test isn't needed.
- **W13** [M]: the cheer's cause (the stream's announcement and its roar) comes 0.375 s before the cheer.
- **W15** [M, J]: the engineer's laugh, the setup of "can hear you laugh", the `[laughter]` tag and "It can even laugh back", is a timed request in the lock; THE PLAN's numbered stamps each land on their word.
- **S6** [M]: V.O. 9's re-read is Jeremy at his own settings (library voice, a per-line reading and speed); the laugh request is for the ENGINEER's own library voice, no imitation.
- **R8:** every number is [M], every call [J]; nothing was watched or heard.
- **R10:** V.O. 9's reads and QA, the mouth tracks, the six renderer checks and the typecheck ran through `ops/heavy.sh`, one job at a time; the rest is light (seconds, under 100 MB).
- **R11:** `ops/keyscan.py` before the commit and the push.
- **R13:** this note; `audio/reel/ep02-v1/README.md` and the pixel README updated.
- **R14:** scratch only in this session's scratchpad.

Broken on purpose: none by the lock pass. **By the lock QA, two GUIDE breaks of W18's quick, each logged** (§3.5 #2): Gerg answers the second THUD 0.4 s after it, 0.5 s after Selbeep, so the THUD lands between the lines; "present." comes 1.53 s after Terb, the script's own HOLD 2 BEATS while every face turns to Mas.
