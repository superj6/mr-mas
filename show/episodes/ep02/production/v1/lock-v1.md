# Ep2 v1: the locks (base, EL master, pixel), 2026-10-09

> **Status: the v1 LOCK, EL-timed (the master, LEARNINGS R9), for the shot, score, sound and mix passes.** Built from the six beat plans and the takes pass's 173 recorded takes, in [pipeline.md](pipeline.md)'s order: the base lock (`build_timeline.py`), the EL lock (`el_lock.py`, every segment), the takes with mouth tracks (`el_takes.py`), the pixel locks (`el_lock.sh`), then a stub module for every scene (`scenes.py`).
>
> - **The story runs 23:02.00, 33,168 frames.** The episode with the intro, the card, the tag's hum and the outro at their planned lengths: **23:44.88, 34,197 frames** (§1).
> - **Against the plan:** every beat lands on its plan length. Every line, gap, overlap and on-screen item is where the plan put it, with the item's own kind. The one place the lock's frames differ from the plans as the takes pass left them: **sc 11 and sc 13 give back 18 s** of air that the fit had tripled. The change is made in the plan, so a rebuild keeps it (§3.1).
> - **Against the proposal's runtime table** (23:20 after the script review; its own margin is "±0:40 until the takes"): Act Two is 13 s shorter and Act Three 5 s shorter. Every other act is on the table to the frame (§1).
> - **Every lock check the tools have was run (§5): 0 failures.** That includes the checks this pass added where the tools had none; they found five faults in the copied tools, all fixed (§3.2). What is left is listed as LOOK, each with its reason.
> - **Nothing was watched or heard (R8).** Every number here is measured from the files [M]; every call is marked [J]. The takes pass's ear list ([takes-qa.md](takes-qa.md) §6) stands untouched.

**Contents:** [1. Frames and runtime](#1-frames-and-runtime) · [2. Scenes: arrival and aftermath](#2-scenes-arrival-and-aftermath) · [3. Where the lock differs from the plan, and why](#3-where-the-lock-differs-from-the-plan-and-why) · [4. The plan's marks, measured in the lock](#4-the-plans-marks-measured-in-the-lock) · [5. Every lock check](#5-every-lock-check) · [6. For the next passes](#6-for-the-next-passes) · [7. How to rebuild](#7-how-to-rebuild) · [8. Files](#8-files) · [9. LEARNINGS rules checked](#9-learnings-rules-checked)

**The transcript** of the whole episode, with timecodes, is [transcript-v1.txt](transcript-v1.txt), in Ep1's format (`assembly/transcript-v35.txt`). It has 174 lines: the 173 takes plus the intro's "her". It also carries the rails, posts, documents, cards and captions at their first frame.

---

## 1. Frames and runtime

<!-- BEGIN generated:frames -->
| Segment | Frames | Runtime | Episode in → out | Shots | Lines (V.O.) | Scenes | Plan | Pixel-lock checks |
|---|---|---|---|---|---|---|---|---|
| Cold open | **1,344** | 0:56.00 | 00:00:00 → 00:56:00 | 13 | 6 (0) | 1 | 0:56.00 | 8 ok |
| Act One · the séance | **8,832** | 6:08.00 | 01:28:00 → 07:36:00 | 62 | 59 (3) | 5 | 6:08.00 | 8 ok |
| Act Two · her | **6,720** | 4:40.00 | 07:36:00 → 12:16:00 | 44 | 41 (3) | 5 | 4:40.00 | 8 ok |
| Act Three · leave them up | **7,704** | 5:21.00 | 12:16:00 → 17:37:00 | 58 | 28 (4) | 4 | 5:21.00 | 8 ok |
| Act Four · as a guest | **7,680** | 5:20.00 | 17:37:00 → 22:57:00 | 57 | 38 (3) | 4 | 5:20.00 | 8 ok |
| Tag · august | **888** | 0:37.00 | 22:57:00 → 23:34:00 | 9 | 1 (1) | 1 | 0:37.00 | 8 ok |
| **Story** | **33,168** | **23:02.00** | | 243 | 173 (14) | 20 | | |

The episode clock (MM:SS:FF): Cold open 00:00:00 · Intro 00:56:00 · ep1.1_her.wav 01:26:00 · Act One · the séance 01:28:00 · Act Two · her 07:36:00 · Act Three · leave them up 12:16:00 · Act Four · as a guest 17:37:00 · Tag · august 22:57:00 · the hum under black 23:34:00 · Outro · credits 23:34:18 · end 23:44:21 (**34,197 frames, 23:44.88**; the intro 720 f, the card 48 f, the hum 18 f, the outro 243 f at its planned length).
<!-- END generated:frames -->

**Against the plans and the proposal [M]:**

| Segment | Proposal (after the script review) | Plans as the takes pass left them | **The lock** | Lock − proposal |
|---|---|---|---|---|
| Cold open | 0:56 | 0:56.00 | **0:56.00** (1,344 f) | 0 |
| Act One | 6:08 | 6:08.00 | **6:08.00** (8,832 f) | 0 |
| Act Two | 4:53 | 4:53.00 | **4:40.00** (6,720 f) | **−13 s** (sc 11) |
| Act Three | 5:26 | 5:26.00 | **5:21.00** (7,704 f) | **−5 s** (sc 13) |
| Act Four | 5:20 | 5:20.00 | **5:20.00** (7,680 f) | 0 |
| Tag | 0:37 | 0:37.00 | **0:37.00** (888 f) | 0 |
| **Story** | **≈ 23:20** | 23:20.00 | **23:02.00 (33,168 f)** | **−18 s** |
| **Episode** | ≈ 24:02 | — | **23:44.88 (34,197 f)** | −17 s |

- **Frames.** Every segment is a whole number of seconds, so every segment is a whole number of frames, and the base lock, the EL lock and the pixel lock agree to the frame. Beats start on the rounded running total, the stick reel's own rule, so a beat's own length can be off by up to half a frame (`lock.py`'s "decisions" line). The scene and segment totals are exact.
- **The episode clock** is `assemble.py`'s: cold open, intro 720 f, card 48 f, the acts, tag, the tag's hum under black 18 f, outro. The outro is taken at the manifest's 10.125 s (243 f) until outro B's Ep2 render exists. The proposal's 24:02 counted the intro, card and outro as 42 s; this clock counts 42.875 s, because it includes the hum gap.
- **The midpoint act-out** (Act Two's last frame) is at 12:16, 51.7 % of the episode; the proposal had 52 %. **The S3** (sc 17, the bridge) runs 15:26–17:37, 65–74 % of the episode; the proposal had 65–74 %.
- **Against Ep1:** Ep1 shipped at 23:31.58. This cut is 13 s longer. The notes put the band at about 22–23 min and say "runtime is an outcome, not a target". D-20's trims, held "if the reel runs long", aren't needed.

---

## 2. Scenes: arrival and aftermath

**Arrival** is the time from the scene's first frame to its first line's first sound; the spoken line's time is in brackets when a V.O. comes first. **Aftermath** is the time from the last line's end to the scene's last frame. Both are measured in the pixel lock's frames [M]. The marks are P3's: arrive 2–4 s on the room, longer at a jump in time; let the turn land 1.5–3 s, or 4–6 s for the biggest turns. A scene whose first story event is a picture beat (a montage, a document, a post) opens on its own `arrive` note, shown in the last column. Where a scene's plan differs from its length in the proposal's own heading, the change is either this pass's (sc 11, sc 13: §3.1) or the script pass's, recorded in `_spec.py` `SCENE_ADJUST`: sc 4 gained 4 s at the script review (D-72; the heading already says 3:16), and sc 20 took 4 s from sc 19 for its read floors and arrivals, with Act Four unchanged.

<!-- BEGIN generated:scenes -->
| Scene | Frames | Seconds | In → out | Plan · the proposal's heading | Air fit | Arrival (spoken) | Aftermath | The plan's arrival · aftermath |
|---|---|---|---|---|---|---|---|---|
| 1 The mammoth, and what came through the door | 1,344 | 56.00 | 00:00:00 → 00:56:00 | 0:56.00 · same | ×1.157 | 3.54 | 18.67 | 1.01: 2.0 s, the meadow in the wall screen, the votive tick and the rack hum under it, 2 s before Selbeep turns; 1.13: the iris on the doorway |
| 4 The Email Séance (with Move 37 and F2.3) | 4,704 | 196.00 | 01:28:00 → 04:44:00 | 3:16.00 · same | ×1.146 | 5.67 (13.17) | 4.83 | 4.01: 2.5 s, the lit table, the room colour playing, the staffers' hands joined, before his click; 4.36: the dark after the last candle, 1.5 s |
| 4A You can sit down now | 840 | 35.00 | 04:44:00 → 05:19:00 | 0:35.00 · same | ×1.781 | 2.58 | 12.46 | 4A.01: 2.0 s, the room in morning light, candles gone, Mas already standing |
| 4B The booking | 192 | 8.00 | 05:19:00 → 05:27:00 | 0:08.00 · same | ×1.425 | 1.42 | 0.83 | 4B.01: 1.0 s, the phone's glow on the nameplate (continuous from 4A) |
| 6 Chapter 1 of 6 | 1,944 | 81.00 | 05:27:00 → 06:48:00 | 1:21.00 · same | ×1.532 | 1.38 | 3.67 | 6.01: 1.4 s, enter late on the locked two-shot, the sting ending |
| 7 A tenant | 1,152 | 48.00 | 06:48:00 → 07:36:00 | 0:48.00 · same | ×1.646 | 1.50 | 6.25 (act-out 1) | 7.01: 1.5 s, the split already opening, his voice on the phone leading us down; 7.08: 1.5 s on Mas at his monitor, then the jangle |
| 8 The dark room | 1,056 | 44.00 | 07:36:00 → 08:20:00 | 0:44.00 · same | ×1.681 | 14.08 (31.46) | 7.54 | 8.01: 2.0 s, the dark room with the monitor's glow already on his face; 8.07: the Monday square lit; the June invite under it |
| 9 Backstage | 1,248 | 52.00 | 08:20:00 → 09:12:00 | 0:52.00 · same | ×1.679 | 2.38 | 1.58 | 9.01: 2.0 s, the wings in work light, road cases and cables, the count from the stage already going; 9.06: the fifth square holding its Hey. a beat longer |
| 10 THE PLAN: OMNI | 1,104 | 46.00 | 09:12:00 → 09:58:00 | 0:46.00 · same | ×1.272 | 2.00 | 7.88 | 10.01: 1.0 s, the panel's last square becomes the grid's first cell, the waltz on its downbeat; 10.07: the tear's light, a beat |
| 11 "her" | 2,352 | 98.00 | 09:58:00 → 11:36:00 | 1:38.00 · 1:51.00 | ×1.413 | 2.00 | 3.54 | 11.01: 2.0 s, the stage wide as Rima takes her mark and the spot finds her; 11.16: the heads turning to the wings; the blimp over the emptying house |
| 12 The empty seat | 960 | 40.00 | 11:36:00 → 12:16:00 | 0:40.00 · same | ×1.209 | 35.50 | 3.25 (the midpoint act-out) | 12.01: 2.0 s, the stage as the house lights come up full, the blimp gone, the murmur thinning; 12.05: 1.5 s, the dark room with the monitor's news already playing; 12.08: his face, 2–3 s, then the stop |
| 13 Leave them up | 744 | 31.00 | 12:16:00 → 12:47:00 | 0:31.00 · 0:36.00 | ×1.363 | 2.38 | 4.83 | 13.01: 2.0 s, the staffers already at the pillar, one peeling, one smoothing, the TV murmuring |
| 14 The open floor | 1,416 | 59.00 | 12:47:00 → 13:46:00 | 0:59.00 · same | ×1.631 | 29.29 | 19.79 | 14.01: 2.5 s, the spread with the band lit and the heatsinks' polish catching the light; 14.12: the plate in the box; then his hand on Alyi's door as it pivots |
| 15 Where u at? (with F2.2) | 2,400 | 100.00 | 13:46:00 → 15:26:00 | 1:40.00 · same | ×1.342 | 6.88 | 10.88 | 15.01: 2.0 s, the empty office as the carried hum stops; 15.19: the empty room 1 s after the door shuts; then the stairs and the buzz |
| 17 The NDA across the bridge (the S3) | 3,144 | 131.00 | 15:26:00 → 17:37:00 | 2:11.00 · same | ×1.912 | 17.38 | 34.08 (act-out 3) | 17.01: 4.0 s, NopeAI's front doors, the receipt already pouring out, the Forecaster arriving from the street beside it, the band in; 17.21: the grey slot under his wet thumb; the ink running |
| 18 Present | 2,304 | 96.00 | 17:37:00 → 19:13:00 | 1:36.00 · same | ×0.974 | 8.67 | 4.25 | 18.01: 2.0 s, full frame on the lighthouse with the beacon already turning; 18.03: 1.0 s, the boardroom with the TV already playing; 18.15: the reminder on his phone; he turns it over |
| 19 Every phone they sell (with F2.1 and the walled garden) | 3,216 | 134.00 | 19:13:00 → 21:27:00 | 2:14.00 · 2:18.00 | ×1.409 | 11.25 | 9.79 | 19.01: 2.0 s, the running keynote with the lobby half-listening; 19.07: 1.5 s, the crowd's backs and the giant screen before Mas; 19.20: the gate's lock; the fold back into his phone |
| 20 (FOR NOW) | 1,248 | 52.00 | 21:27:00 → 22:19:00 | 0:52.00 · 0:48.00 | ×1.03 | 11.79 | 20.58 | 20.01: 1.0 s, the thinning crowd as the quartet's pedal carries over; 20.05: 2.0 s, the lobby on its morning bed, the confetti already swept; 20.10: 2.0 s, the face-down phone; 20.13: his still face, the flyer out, and the pin falling |
| 22 One door | 912 | 38.00 | 22:19:00 → 22:57:00 | 0:38.00 · same | ×1.431 | — | — | 22.01: 2.0 s, the white and the falling pin; 22.09: 4–5 s of his back crossing the lot, the cube unchanged |
| 23 The other company | 888 | 37.00 | 22:57:00 → 23:34:00 | 0:37.00 · same | ×1.345 | 20.42 | 14.62 (the hook) | 23.01: 1.5 s, his back as he sits at the desk (sc 22's match), the monitor's glow on; 23.09: the taut string, then his face |
<!-- END generated:scenes -->

**Read against the marks [M, J]:**
- **Every scene that opens a new place on a line, arrives on the room for 2.0 s or more,** with three exceptions. All three are the proposal's own agreed arrivals, kept as agreed (R2: "build exactly it"):
  - **sc 4B, 1.42 s:** an insert, not a new place. It is his phone on the same boardroom table, lit for 2.49 s at the end of 4A ("continuous from 4A").
  - **sc 6, 1.38 s:** "enter late on the locked two-shot, the sting ending" (proposal sc 6, *Arrival / aftermath*). The podcast sting leads it by 0.8 s under 4B's tap (seam 7), so the new room's sound has been playing for about 2.2 s before XEL speaks.
  - **sc 7, 1.50 s:** "arrive on the split already opening, his voice on the phone leading us down (1.5 s before the first line)" (proposal sc 7). The voice is the seam's sound lead, and the building is already splitting under it.

  Each arrival is the plan's exact head, to the frame. A newcomer read (R7) is the test of whether the two late entries read; the fix, if they don't, is a 0.6 s and a 0.5 s head taken from the same scene's air.
- **Aftermath.** Every talk scene holds 1.5 s or more after its last word. The one exception is sc 4B (0.83 s), whose last sound is his thumb's click on Accept at 7.25 s, not a word: "he accepts" is the seam's cause, and the sting cuts in on it. The biggest turns hold far longer than 4–6 s:
  - **The midpoint:** Alyi's post (12.06), Mas's own post and V.O. 6, then his face for 3.25 s before the designed stop. That is 19.7 s from the post's arrival to the act-out.
  - **The door** (sc 22): no line at all, and 4.8 s of his back crossing the lot.
  - **Act-out 3** (sc 17): 34.1 s after the driver's last line, the night and the rain.
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

**To undo it:** delete the two `SCENE_ADJUST` rows, put back `SEG_TARGET` act2 293 and act3 326, then re-run `_build.py --write` and §7. The proposal's runtime section carries the change as D-88.

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

---

## 4. The plan's marks, measured in the lock

### 4.1 Tempo (W18)

Every gap the plan marks, measured in the pixel lock on the segment clock (line onsets and ends in seconds), inside a beat and across a cut [M]. "As planned" allows one frame: a beat starts on a whole frame, so a gap across a cut can move by up to 1/24 s.

<!-- BEGIN generated:tempo -->
| Mark | Gaps | Lock (median · range, s) | In the mark | As planned (±1 frame) |
|---|---|---|---|---|
| quick (0.15–0.35 s) | 32 | 0.25 · 0.18–0.30 | 32 of 32 | 32 of 32 |
| quick-mas (0.4–0.5 s) | 12 | 0.45 · 0.42–0.47 | 12 of 12 | 12 of 12 |
| normal (0.4–0.6 s) | 15 | 0.50 · 0.40–0.60 | 15 of 15 | 15 of 15 |
| weighted (0.6–3.0 s) | 8 | 0.95 · 0.60–2.30 | 8 of 8 | 8 of 8 |
| free (-1.0–9.0 s) | 9 | 0.60 · -0.55–2.60 | 9 of 9 | 9 of 9 |

Overlaps (a line starting before the one before it ends): e2-a2-0028 over e2-a2-0027 by 0.55 s (act2).
<!-- END generated:tempo -->

- **Mas is unhurried:** his 12 quick replies come at 0.42–0.47 s, inside W18's 0.4–0.5 s. The others' 32 quick replies come at 0.18–0.30 s, inside 0.15–0.35 s.
- **The one line overlap is the motivated one:** the engineer's "Thanks." comes in 0.55 s over CHATGTP's "favorite" ("he asked for short"; record both whole). The proposal's other overlap, the cheer over "And profit—" (sc 19), is a sound against a line, laid by the stems and the mix. W18 allows one or two overlaps a scene.
- **The median gap between lines, act clock (cuts included), spoken only [M]:** Act One 1.25 s, Act Two 1.15 s, Act Three 0.90 s, Act Four 0.60 s. Inside a beat: 0.30, 0.35, 0.45, 0.45 s.

### 4.2 The pacing tool (`studio/src/reel/tools/pacing.py`, run by the builder) [M]

243 shots in 23.0 min (ASL: Act One 5.9 s, Two 6.4, Three 5.5, Four 5.6). 28 stays, median 37.0 s. Of 22 talk stays of 8 s or more, the entry-air median is 4.7 s and the exit-air median 5.6 s.
- **Six stays are entered with 2 s or less before their first line.** Two are §2's agreed late entries (sc 6, 7); one is sc 11's stage at exactly 2.0 s, on the mark. One is F2.2's bonfire (15.06, 1.8 s), led in by the ping's ripple and the choir (seam 18). Two are cuts inside a scene rather than arrivals: the return from F2.2 to the present office (15.17, 1.88 s) and sc 18's split cross-cutting to Mario's pane (18.11, 0.49 s).
- **Three stays leave with 1.5 s or less after their last line.** Two are sc 18's split, whose panes cross-cut inside one scene (18.10 at 0.78 s, 18.14 at 0.97 s). The third is 4B's insert (§2).

### 4.3 Holds (P4)

Every wordless beat over 4 s, and in it the longest stretch with no sound, text or line event [M]. A long stretch here means "look again", not a failure: whether the picture moves inside it is the shot pass's to say.

<!-- BEGIN generated:holds -->
| Beat | Seconds | Events in it | Longest still stretch (s) | Frame |
|---|---|---|---|---|
| 15.10 | 8.90 | 6 | 7.20 | 2S · this office, 2023, night: Alyi at his screen (cropped by its edge), Ekiel beside him; |
| 20.02 | 7.60 | 4 | 7.20 | SPLIT · RIGHT: his lamp clicks on; his post goes up, one crop, with its condition |
| 19.07 | 9.40 | 5 | 6.60 | WIDE · ELPPA's campus: the crowd's backs and the giant screen; at the crowd's edge Mas fin |
| 12.01 | 6.53 | 1 | 6.29 | WIDE · the stage as the house lights come up full, the rig empty, Rima small on her mark → |
| 17.17 | 10.00 | 3 | 5.80 | WIDE · May 20, a new day on the bridge, traffic moving; Mas under an umbrella; the blimp d |
| 10.07 | 7.12 | 1 | 5.34 | GFX · the break: an empty speech bubble drifts in from the margin and blots out the tiny s |
| 14.04 | 5.22 | 0 | 5.22 | MCU · his own reflection mouthing can we talk? back to him |
| 4A.05 | 5.00 | 0 | 5.00 | WIDE · as he sits he glances at Gerg at the back; Gerg lifts the laptop an inch |
| 22.01 | 7.44 | 3 | 4.72 | WIDE · white, room tone only; the pin falls into it; the white is sky over an empty lot; t |
| 15.16 | 4.56 | 0 | 4.56 | WIDE → ECU · the fire's glow shrinks to one point of light |
| 4.29 | 4.50 | 0 | 4.50 | WIDE · the slide and the room in one frame: Nole finishes at the slide; nobody applauds |
| 15.08 | 6.44 | 5 | 4.29 | ECU · Alyi holds up his phone, Mas's dead app open: CHECK IN → feel the agi; he turns the  |
| 17.18 | 6.90 | 3 | 4.22 | WIDE · it rains letterhead; the receipt's ink runs in the rain |
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

---

## 5. Every lock check

| Tool | What it checks | Result [M] |
|---|---|---|
| `beat-plan/_build.py` | every scene and segment on its target; air holds (head or tail over 3 s, a wordless beat over 8 s); lines defined and used once; the V.O. map (14 lines, order, banned words, lowercase); rails as dates and the rail list; no V.O. under a rail or a toast; the tempo marks; the read floors of must-read kinds; arrivals and transitions; the cast | **0 FAIL**; 2 WARN (8.01's 8.07 s and 19.06's 3.38 s, looked at in §3.4); 76 tempo gaps, 0 outside their marks |
| `audio/reel/ep02-v1/build_timeline.py` | each beat against the plan's `est_s` (±0.05 s); every line in; the beat order; **every across-cut and inside tempo gap** (fixed, §3.2 #4); **every on-screen item's words, window and kind** (new, §3.2); pre-laps; scene ids | **0 check failures** in six segments; 3 deviations, all §3.3's `ONSCREEN_SET`; 0 lines past their shot, 0 J-cut lines (the plan's J-cuts are sound leads, laid by the beds and the stems) |
| `audio/ep02/v1-el/tools/el_lock.py` (every segment, then the manifest) | each take swapped in; the gaps kept; no line silently dropped | the identity, as the pipeline expects when the base lock is built on the EL takes: **+0.00 s**, 0 beats changed, 0 missing takes, 0 flags; MARIO's 6 lines kept on their Kokoro takes; manifest `ep02-v1-el-stick`, 23.74 min |
| `assembly/tools/el_takes.py` | the takes with the Kokoro camera fields and mouth tracks | 173 rows: 153 mouth tracks, 14 V.O., MARIO's 6 Kokoro rows with their own tracks; 4 words phonemised from letters (`Manalt`, `séance`, `Omni`, `wo-o-ord`) |
| `assembly/tools/el_lock.sh` → `pixel/tools/lock.py` ×6 | scenes tile the segment; shots = beats; shots tile with no gap; lines on the stick's frames; every line has a take; speech inside its file; mouths carried; on-camera mouths | **8 of 8 checks ok in every segment.** "Problems": 5 speaker-label notes (`staffer` against the take's `TILED EMPLOYEE`: the STAFFER role is voiced by the carried Avery role, so the label differs and the voice is right). One decision: 14.01's verb band (§3.3) |
| `pixel/tools/scenes.py` ×6 | a stub for each new scene; the `shots.ts` import block | 20 scene modules written (sc 1, 4, 4A, 4B, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23), none existed before |
| `pixel/tools/build.mjs` + `render.ts check --allow-standins` ×6 | the renderer builds; the lock and the layouts load; marks resolve; layouts don't throw | **0 problems** in six segments; 243 of 243 shots are stand-ins, as expected until the shot pass draws (`check` without `--allow-standins` fails, as it should) |
| `render.ts scenekeys` ×6 | each scene's cache key | 20 scenes keyed, none cached |
| `assembly/tools/lock_report.py` (new) | the frames and episode clock against every pixel lock's ep-in; scenes against their plan targets; P3's arrival and aftermath; every tempo gap against its mark; overlaps; P4's holds; writes the transcript | **0 FAIL**; 4 LOOK, all looked at in §2 (4B's arrival and aftermath; sc 6's and 7's agreed late entries) |
| `ops/rebuild-act.sh --ep 2 <act> --dry-run` ×4 | every command and input of the per-act rebuild | every lock input present; missing only the downstream pictures, mixes, intro, outro and hum tail (the film step) |
| `audio/ost/tracks/e02-v1-<seg>/track.py --dry --el` ×6 | the score's music runs on the EL lock | every segment's runs parse, E02-01 to E02-13 in order (the cues are the score pass's) |
| the studio typecheck (`npx tsc --noEmit`, through `ops/heavy.sh`) | the 20 new scene modules, the `shots.ts` import blocks, the six `data.ts` locks | 20 errors, all in `src/dev/`: the same count the pipeline pass recorded as the baseline (pipeline.md §9). None is in an Ep2 file |
| `studio/src/reel/sync.mjs`'s lint (run from a scratch copy, so nothing was written into `studio/src/reel/data/`) | the stick timelines' schema (sets, kinds, styles, figures, lines) | no schema warning; only caption-length and long-line notes for the stick reel, and media not built yet (temp beds, the intro, the outro) |

**Not run, and why:** `measure.py` needs the stick reel's plan (`episode.mjs --plan`, a Remotion bundle); the stick reel isn't in this pass's order, and `lock_report.py` writes the transcript and the marks from the locks themselves. `bed.py` (the stick reel's temp beds) and the score's `check.py` (stems against the lock) have nothing to run on until the stems exist. The smoke test isn't needed: no shared code changed, only Ep2's copies (`git status`, §8).

---

## 6. For the next passes

**The shot pass (picture):**
- **20 stub scene modules** are waiting in `studio/src/episodes/ep02/pixel/<seg>/scenes/sc-<scene>.ts`. Each one's header lists its shots and frames, and `shots.ts` imports them. A layout's `f` is the frame inside its scene.
- **Every in-world text carries its plan kind** (`sh.texts[].kind`). Posts are texts of kind `post`: Ep2's posts carry no author prefix, so the shot pass draws each one in its own UI (W20). The default `drawTexts` still draws unknown kinds as tags, so a layout should draw its posts and docs itself.
- **13 lines are `os`** (from the plan's tags); the device lines carry their tag (`call`, `ghost`, `phone`, `podcast`, `tv`, `far`, `offmic`, `sung`, `chant`) for the face and lip calls.
- **The sung line's mouths:** "one wo-o-ord." has a letters-guess mouth track; its take carries each note's time and pitches (`notes`) for the three mouths.
- **14.01's verb band** stays lit through sc 14 (§3.3).

**The score pass:** the music runs per segment are the `track.py --dry --el` output (§5). Sc 11 is now 98 s: E02-07's demo cue runs from 142.00 to 208.33 s of Act Two, and its pad from 208.33 to 240.00 s.

**The sound and mix passes** (the takes pass's handoff stands):
- the ghost, far, phone, call, podcast, TV and off-mic chains;
- MARIO's EQ and his level within about 1 dB of EKIEL;
- the crowd, delivered at −19 LUFS;
- the sung part stems.

Every take is dry: `el_lock.py` plays a device copy only for a take with a Kokoro call reference, and Ep2's takes have none. **The ENGINEER's laugh (9.03) is not in the lock** (it isn't in the beat plans). It is a separate take in his voice, with no laugh imitation, for the sound pass to ask for.

**The ear (R8):** the takes pass's list ([takes-qa.md](takes-qa.md) §6) and cast.md §8.5 stand. The lock adds one question for the ear: do sc 11's and sc 13's new beats leave enough room for the laughs and the walk-off? Every laugh tail is the plan's own fixed length.

---

## 7. How to rebuild

```sh
python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write          # the plans (sc 11/13 in SCENE_ADJUST)
python3 audio/reel/ep02-v1/build_timeline.py                                  # the base lock + manifest + lock-report.json
audio/.venv-casting/bin/python audio/ep02/v1-el/tools/el_lock.py              # the EL master, every segment + manifest
HF_HUB_OFFLINE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/el_takes.py
bash show/episodes/ep02/production/v1/assembly/tools/el_lock.sh               # the six pixel locks (data.ts + lock/<seg>.json)
for s in coldopen act1 act2 act3 act4 tag; do python3 studio/src/episodes/ep02/pixel/tools/scenes.py $s; done
python3 show/episodes/ep02/production/v1/assembly/tools/lock_report.py --md   # the checks, transcript-v1.txt, this page's tables
```

One act alone: `ops/rebuild-act.sh --ep 2 <act> --only lock`. All of it took under a minute here (the mouth tracks about 7 s), with the load at 3–4.

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

---

## 9. LEARNINGS rules checked

- **R9** [M]: the EL-timed lock is the master, written into the canonical pixel files. Every line is in the plan the builder reads, and every line of the base lock is in the EL lock (`el_lock.py`: 0 missing, nothing dropped). The lock pass's timing change is in the plan (`SCENE_ADJUST`) and its text holds are in the builder's table, so a rebuild keeps both. No `--fixed`.
- **W18** [M]: 76 of 76 marked gaps are in their marks, and as planned to a frame. Mas's quick replies come at 0.42–0.47 s, the others' at 0.18–0.30 s. There is one line overlap, the motivated one.
- **P3** [M, J]: arrivals and aftermaths per scene (§2). Three arrivals are under 2 s by the proposal's agreed design, kept and listed (GUIDE: broken on purpose by the proposal, with its reasons).
- **P4** [M]: holds over 4 s with their longest still stretch. None reaches 8 s; the 8.01 and 19.06 WARNs were looked at.
- **P15** [M]: sc 14's sentence line now meets its floor. 14.01's verb band is the scene's menu (§3.3).
- **R4, R5** [M, J]: the time came out of dead air after (and at) the midpoint; nothing on the keep list moved; no scene paid for another.
- **R2** [M]: both changes went back into the proposal (D-88, D-89, its runtime section).
- **R1** [M]: no Ep1 file touched. Ep1's `build_timeline.py`, `lock.py` and `el_takes.py` were only read.
- **R8:** every number is [M], every call [J]; nothing was watched or heard.
- **R10:** the mouth tracks, the six renderer checks and the typecheck ran through `ops/heavy.sh`, one job at a time; the rest is light (seconds, under 100 MB).
- **R11:** `ops/keyscan.py` before the commit and the push.
- **R13:** this note; `audio/reel/ep02-v1/README.md` and the pixel README updated.
- **R14:** scratch only in this session's scratchpad.

Broken on purpose: none by this pass.
