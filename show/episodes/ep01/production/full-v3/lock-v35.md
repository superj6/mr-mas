# Ep1 v3.5: the base lock, Kokoro timing (`v3-lock`, 2026-09-28)

> **Status: v3.5 BASE LOCK (Kokoro timing), for the lead and the ElevenLabs pass** (PLAN §8, step 2). Script draft 8.4's six v3.5 beat plans ([beat-plan-v35/](beat-plan-v35/), notes [script-v35-notes.md](script-v35-notes.md)) applied as deltas on the v3.4 lock (`show/reel/ep01-v34/`; nothing there was rebuilt or edited).
>
> **All the v3.1–v3.4 rules stand:**
> - J-cut gap closing;
> - negative line `t` for pre-laps (down to −4 s; the deepest here is −1.0 s);
> - rooms leading cuts by 0.6 s;
> - the read floor;
> - S7.13's 264 Runway frames;
> - the tag's no-Runway state (the tag is unchanged).
>
> **No stick reel was rendered.** Only the render's plan was built (`episode.mjs --plan`). **Nobody watched or listened to any of this.** Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The lock** | `show/reel/ep01-v35/ep01-v35-{coldopen,act1,act2,act3,act4,tag}.json` |
| **The manifest** (key `ep01-v35-stick`; flash-fixed intro, outro B, as v3.4's) | `show/reel/ep01-v35/ep01-v35.manifest.json` |
| The builder | `audio/reel/ep01-v35/build_timeline.py` (the v3.4 builder, extended). It writes the lock, the manifest and `audio/reel/ep01-v35/lock-report.json`: every edit per beat, the deviations, and the checks (each beat against the plan's `est_s`, every line in or out, the tempo gaps). |
| The beds | `audio/reel/ep01-v35/bed.py` → `<seg>-bed.wav` + `-bed-qa.json` |
| Measurements, transcript | `audio/reel/ep01-v35/measure.py` → `measure.json`, [lock-v35-transcript.txt](lock-v35-transcript.txt) |
| The takes (the script pass's) | `audio/ep01/v35/<seg>/lines-v35.json` (33 read, Terb's cut, the reused "still a preview."), and the four restored takes from `lines-fast-v1/v2.json` |

---

## 1. Runtime and frames

| Segment | v3.4 lock | v3.5 plan (notes §2) | **v3.5 lock** | **Frames** | vs plan | vs v3.4 |
|---|---|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | **640** | 0.0 | 0.0 |
| Act One | 5:37.5 | 7:29.7 | **7:29.7** | **10,794** | 0.0 | +112.2 |
| Act Two | 3:01.2 | 3:31.4 | **3:31.4** | **5,074** | 0.0 | +30.2 |
| Act Three | 2:05.3 | 2:19.1 | **2:19.1** | **3,339** | 0.0 | +13.8 |
| Act Four | 8:27.8 | 8:02.3 | **8:03.3** | **11,600** | **+1.0** | −24.5 |
| Tag | 0:33.2 | 0:33.2 | **0:33.2** | **798** | 0.0 | 0.0 |
| **Story** | **20:11.7** | **22:22.5** | **22:23.5** | **32,245** | **+1.0** | **+131.8** |

- **The episode runs 23:05.7:** the story, the 30 s intro, the 2 s card and outro B (10.125 s). With the 3 s slate, the render plan is 33,328 frames (23:08.7). The notes estimated ≈ 23:04.6.
- **Against the plan, +1.0 s, all of it S3.00a** (§4.1). Every other beat lands within 0.005 s of its `est_s`.
- **The inner voice is 17 lines** (Act One 7, Act Two 1, Act Three 3, Act Four 5, the tag 1), 135 words (§3).
- **Seven J-cut lines,** all between −0.3 and −1.0 s. Five are inherited: 5.03 −0.5, 7.01 −0.6, 12.02 −0.5, S5.11 −0.8, S8.08 −1.0. Two are new: the war room's calls, 41.03 and 41.04, each −0.3. S3.06's inherited −0.6 is gone: the plan starts the line at 1.0 s, after the staff's beat of silence.
- **Four L-cut lines:**
  - 1.02 (the cold open, inherited);
  - S4.13: Tasya's statement runs 8.21 s into S4.13d and ends 0.39 s before its cut ("no hold after it");
  - S7.07: Terb's cut take runs 0.53 s over, as its source did;
  - S8.08 (inherited).
- **The Runway frames:** S7.13 is exactly 264 frames (Act Four frames 10426–10689). The tag has none.

## 2. Every changed beat against the notes

**127 beats the notes change or add:**
- 78 kept beats with an edit;
- 47 new `v35-*` beats;
- 21.03 and 21.04, restored from v3.3.

**Also:** 11 beats cut, S4.12 merged into S4.13, and S4.07 and S5.03 moved.

**126 of the 127 land on the plan's seconds (the notes' §3 table) within 0.005 s.** S3.00a is +1.00 s (§4.1).

**The builder's checks (`lock-report.json` → `check_failures`) are empty:**
- every plan beat is in the lock once, in the plan's order;
- every kept, new, restored, reused and cut line is present, and every dropped line is gone.

**The tempo table (notes §6):**
- All 61 named gaps (`tempo.gaps`) sit within 0.02 s of the plan: Act One 22, Act Two 10, Act Three 2, Act Four 27.
- That includes launch night's one overlap (5.04: Gerg 0.25 s over Rima).
- The war room's calls run as planned: Tasya's line starts as Gerg's ends (her tile's J-cut, 0.3 s), AUHSOJ's fragment starts 0.3 s under Tasya's last word, and the count starts 0.56 s under AUHSOJ.

**Where the lock had to decide something beyond the plan's placements:**

| Beat | v3.4 → plan → lock (s) | What the lock has |
|---|---|---|
| 5.12 | 2.58 → 4.60 → 4.60 | The wait. `USERS: 1 · 2 · 7 …` retimed to 2.5 s (the plan's `onscreen.retime`); `USERS: 0` holds until then, and the three counter rolls move with the tick. Gerg's three refresh taps at 0.5 / 1.1 / 1.7 s (the plan's sounds). |
| 7.02 | 5.00 → 5.00 → 5.00 | `INVIDIA` on the shroud 1.2–3.7 s, the macro's span (`style_leap` is in `passes`). The cue's stale "the phone's siren J-cuts in" is replaced. |
| v35-10.08 | new 1.5 | The siren (`siren_whoop_F`) 0.3 s before its end: the J-cut into 8.01 (seam 3). The stick had no siren before. |
| 8.06 / v35-13.06 | 2.5 / new 1.5 | The revolving door's pre-lap leaves 8.06 and plays 0.5 s before the end of the 2018 flashback, into the lobby (the plan's `sounds_drop` and its L 0.5 s). |
| 9.10 | 9.99 → 11.61 → 11.61 | The plan gives no caption, and the old one quoted the dropped line. The quote is now the restored line's, and the TV reads the chyron. |
| 11.01 / 11.03 | 8.79 → 8.64 / 13.59 → 17.94 | `RAIL: MAR 3, 2023` at 1.62 s, where the MAR 14 rail was. MAR 14 rolls in on the split (11.03, 0.2 s). |
| 11.04 | 8.50 → 10.50 → 10.50 | +2.0 s at the tail, after the click. The bar-exam card at 5.2 s. |
| 12.02 | 7.45 → 7.25 → 7.25 | The stamps at 0.9 / 2.1 s. The solder's two crackles go. `ZAI CORP. …` at 0.6 s, `FILED` at 0.9 s. Oigneb's plate and read-floor gap as in v3.2. |
| 13.12, 13.13 | unchanged | `DEEPFAKES OF ME: SEEN 0` back with its v3.3 times (0.0 s; 0.0–1.9 s). |
| 14.01 | 4.00 → 6.00 → 6.00 | +2.0 s at the tail. The reminder at 1.6 s, `PLEASE REG—` at 3.4 s. The stale cue about "the anchor's too-smooth murmur" is replaced. |
| 15.06–15.16 | the clone cut | The clone leaves `chars` in 15.07, 15.10, 15.13 and 15.16, and the act's cast. The chairman's plate and name are on 15.06. 15.13's gasp moves after his line (3.32 s; the plan's `after:v35-a2-0001+0.1`). |
| 21.02–21.05 | 8.01 → 10.60 → 10.60, then +4.38, +4.40 | 21.02: the copy's line 0.35 s after Nedib's, one pop 0.3 s before it, and the copy drawn from the pop.<br>21.03 and 21.04 are v3.3's beats, with their chars cut to the plan's (the second copy goes), the plan's sounds (the third iris flick goes), and the plan's frame and caption.<br>`deepfake-2` leaves every Act Three beat; three cues say "one copy" and "two NEDIBs" now. |
| 22.01 | 14.32 → 17.32 → 17.32 | The V.O. at 4.8 s. The rail, the counter, the applause, the odometer and its landing stay at the stage's opening (`ITEM_PIN`, as in v3.4), so the number lands first (4.37 s). |
| v32-S1.13 | 5.00 → 8.00 → 8.00 | +3.0 s at 1.6 s: the sentence is typed (0.6–3.2 s), deleted and retyped. The post card types from 3.2 s (4.8 s to read, as in v3.4) and posts on the click at 6.6 s, with `1:46 PM`. |
| S2.05 | 2.50 → 3.00 → 3.00 | +0.5 s at the head: the eye-light steps onto mark 3 first. |
| v31-S3.00p | 4.60 → 5.60 → 5.60 | +1.0 s at 1.0 s: the two props (0.5, 1.2 s) read before her line (now 3.0 s). |
| S1.03 | 11.75 → 9.30 → 9.30 | `DIRE · NOVIHS · DRUH` holds to 2.9 s, until the ring draws round the four. The line it read under is cut. |
| S3.05, S4.02, S8.07 | → 5.50, 9.00, 6.51 | Fitted to the plan at the tail: −0.47, −1.74 and −2.24 s. S4.02's clack at 8.4 s ("nobody picks it up"). The v3.4 delta's row of phones lighting goes with the caption. |
| S4.08 | 18.79 → 17.44 → 17.45 | The ring-in 1.5 → 1.0 s and the dial tone 1.32 → 0.81 s (§4.4). One DTMF run at the head; one ring at 0.8 s. |
| S4.13 | 5.70 → 6.25 → 6.25 | S4.12 merged at the head, on its own clock: three slate steps (0.9 / 1.2 / 1.5 s) and the door (1.95 s). Its sequence marker and the rail (0.2–1.9 s) come too. The jangle stays at 0.25 s. |
| S4.07 (moved) | 5.00 → 3.00 → 3.00 | After S4.13d, her look only. Its four dial tones go ("No speakerphone, no dial"). |
| S5.03 (moved) | 5.85 → 2.50 → 2.50 | First in the 2 AM scene. With no line left, its hearts and taps scale into 2.5 s. The rail rides the match from 49A, and marker `S5` moves here from S5.02. |
| S6.04, S6.06 | → 1.60, 2.90 | S6.04: head 0.3 → 0.2 s and tail 0.34 → 0.08 s (§4.3). S6.06: Mada's label and the dead stop at 1.35 s, its read floor. |
| S7.01 | 18.60 → 20.10 → 20.10 | +1.5 s at 7.245 s: Alyi's post, now whole, holds 1.5 s longer, and everything after it moves. |
| S7.07 | 10.88 → 8.55 → 8.55 | Terb's cut take at 0.8 s. The 0.53 s overrun of its source kept. |

## 3. The inner voice (17 lines)

Film clock (cold open 0:00, no slate). The line's start is from the lock, where the notes' §4 gives the beat's start.

| # | Film clock | Beat | Id | Line |
|---|---|---|---|---|
| 1 | 1:32.9 | 5.04 | v34-vo-01 | she's right. it will break. it goes out tonight anyway. |
| 2 | 2:40.9 | 5.11 | v3-vo-05 | i know. i still read it twice. |
| 3 | 3:15.4 | 7.01 | v34-vo-02 | mostly the bill. we can't buy that many servers. someone can. |
| 4 | 4:33.0 | v35-12.02 | **v35-vo-01** | they've stopped testing it. they're using it. |
| 5 | 5:36.0 | 9.09 | v3-vo-09 | it does. |
| 6 | 7:17.4 | v35-19.03 | **v35-vo-02** | someone gets to be in the room. |
| 7 | 7:33.3 | 11.03 | v3-vo-10 | mario used to sit where gerg sits. he left to build a careful one. |
| 8 | 9:26.0 | 13.13 | v34-vo-04 | mine's half written. |
| 9 | 12:07.4 | 18.02 | v34-vo-05 | my other company. for when it gets harder to tell. |
| 10 | 13:43.3 | 22.01 | v34-vo-06 | a year ago, forty users and a nice thread. |
| 11 | 13:57.1 | 22.02 | v3-vo-16 | thrilled is too much. enthusiastic is a lot. |
| 12 | 14:29.6 | S1.02 | v34-vo-07 | gerg's not on it. probably the budget. good. i'll ask for more compute. |
| 13 | 15:04.1 | v35-41.01 | **v35-vo-03** | the budget. i said the budget. |
| 14 | 15:19.8 | v35-41.04 | **v35-vo-04** | gerg. tasya. the money. the money. the money. |
| 15 | 15:32.2 | S2.01 | a5-26a-01 | i don't keep score. |
| 16 | 21:51.8 | S8.04 | v34-vo-11 | they had four votes. i had the landlord. the money. gerg. |
| 17 | 22:30.3 | 32.03 | v3-vo-24 | it looks calmer than me. |

- **By act:** One 7, Two 1, Three 3, Four 5, the tag 1. This is the notes' §4 exactly.
- **Gone:** v3-vo-20 (the 2 AM count) and v34-vo-09 ("gerg walked out for me.").
- **Lines 16 and 17 sit 1.0 s later** than the notes' clock, because of S3.00a.

## 4. What didn't apply as written, and what the builder adds

1. **S3.00a keeps 15.2 s** (the plan's 14.2; `FIT_SKIP`, logged as a deviation).
   - **What the plan asks for:** "the join's pre-roll 1.0 s tighter (the 11:59 wait)", with every line and the held beat kept.
   - **Why it can't:** Alyi's first word is already at 0.3 s (v3.1 trimmed the head to 0.3). The notes also mark scene 45 "weighted, untouched". So there's no pre-roll to cut, and the gaps can't give the second without making noon quick.
   - **Two ways to get the second back, for the lead:**
     - pre-lap a5-27-01 by 0.7 s under S1.05's tail (the v3.1 J-cut rule closes the gap, and the beat is exactly 14.2 s);
     - accept the +1.0 s.
2. **S4.10b's arithmetic.**
   - **The conflict:** the plan's 14.05 s adds 0.8 s for Ttemme's card landing at the head, and takes 1.0 s off the folder business. But the plan also places "Ttemme, we'd like you…" at start+0.8, which is the source's own head, so the head doesn't grow.
   - **What the lock does:** it keeps the explicit placement and reaches 14.05 s by taking 0.2 s off the business, not 1.0.
   - **The alternative** also comes to 14.05 s: the line at start+1.6 and the business −1.0 s.
3. **S6.04 (the quicker board exit).**
   - The plan's 1.6 s needs 0.36 s from a beat with 0.64 s of air.
   - The head goes 0.3 → 0.2 s and the tail 0.34 → 0.08 s, below the builder's floors.
   - Her line is the one the avalanche cuts off ("char—").
4. **S4.08.**
   - **The holds:** the plan's "−0.5 −0.5" ("shorter holds") are read as the ring-in (head) and the dial tone after the click (tail).
   - **The tones:** S4.07 moved away with its dial ("No speakerphone, no dial"), so "four dial tones pre-lapped under the cut" is one DTMF run at S4.08's head. Its first ring goes; one ring stays at 0.8 s, before Mario picks up.
5. **New in the builder (v3.5):**
   - **`overlap:<id>-S`:** a kept line starts S before that line ends (5.04).
   - **A new line at `start-S`:** a J-cut (41.03, 41.04).
   - **`overlap: true` on a line at start+S:** it is placed at exactly S, over the line before it (41.04's V.O. over AUHSOJ).
   - **New beats keep the plan's `est_s`,** its tail included. The v3.1 rule's 0.8 s hold is gone, since the v3.5 lengths are the recorded takes plus the plan's air.
   - **A changed beat is fitted to `est_s`** after its placements: tail first, then unplaced air. It touched only S3.05, S4.02, S8.07, S4.08 and S4.10b. Every other changed beat landed by its placements, or by the v3.1 rules for a beat whose audio is unchanged. (S7.07's new last line replaces an L-cut line, so the beat ends where the new line keeps the old one's 0.53 s overrun: 8.55 s, the plan's.)
   - **`restore_from`:** the v3.3 beat itself, with its lines where they were, and each checked against the plan's placement and take file.
   - **`onscreen.retime`** and **`sounds`** (seconds, or `after:` / `before:` a line; one named like an existing sound moves it).
   - **Moved beats keep their room.** The v3.4 rule would have put S5.03, his phone in the dark room, in Alyi's bullpen.
6. **`sounds_drop`:**
   - Two name sounds in the timelines: 8.06's revolving door (moved to the end of the 2018 flashback) and 12.02's two crackles.
   - The other four name J-cuts in the v3.1 and v3.2 plans that the v3.4 bed never laid (the siren, the Build's chip line, the toast pop, the tour's stamp), so the lock has nothing to take out. The bed follows the v3.5 J-cuts (§6).
7. **The read floor** (0.25 s + 0.05 s a character; name cards 1.2 s), where the lock's own placements could meet it:
   - v35-12.01: the stranger's post from 1.7 s, 2.8 s up;
   - v35-19.02: the three passages share the 13.7 s by their floors;
   - v32-S1.13: the card, 4.8 s up;
   - S6.06: Mada's label;
   - S8.06: the rail;
   - v35-41.01: the six tiles, 0.25 s apart;
   - v35-41.06: the three words stacked from 0.2 s.

   The items still under the floor are held at the plan's own lengths (§8.3).
8. **Stale text fixed:**
   - 9.10's caption;
   - cues on 7.02, 14.01, 21.02, 21.04, 21.05 and 22.01;
   - the clone left in `chars` (Act Two) and `deepfake-2` left in `chars` and `names[]` (Act Three).
9. **Sequence markers (the margin slate):**
   - New markers: `7A` the first weeks, `8A` 3 AM, `8B` Jun 2018, `10A` the window, `10B` the vision post, `11A` the waitlist, `15A` Mar 2019, `S1A` the war room, `S1B` the plane, `S4A` Alyi alone.
   - New subs: the hearing (28.05), TPOOL, the desk (S2.05).
   - Markers from cut beats move to the next kept beat: `15` to v35-27.00, `16` to v35-29.01, `S4` to S4.02, and "Sunday night" to S4.10b. S4.12's marker goes to S4.13.
   - `S5` opens at S5.03.
   - Dates corrected: `S2` now reads Sat Nov 18, and `16` reads May 18–26.
10. **Names:**
    - A plate the plan adds names its character: NOLE, LAHTNEMULB, NOTERB, TTEMME (from the cut S4.10's card), AUHSOJ, and the GERG and TASYA tiles.
    - CHATGTP's corner counter is not a plate.
    - The new V.O. names Gerg and Tasya on its words.
    - AUHSOJ is added to Act Four's cast (`AUHSOJ` · INVESTOR ON THE CALL). His take is the photographer's stock preset (af_river) on the call chain, for timing only.
    - Act Two's cast adds the 2019 room: Gerg, Alyi, Mada (MAN WITH THE SPINNER, until Act Four's plate), the Quiet Vote.
11. **`passes`:** every lock beat carries the plan's per-beat fields for the picture, shot and score passes (`scene`, `mode`, `pace`, `tempo`, `camera`, `picture`, `style`, `flashback`, `style_leap`, `style_leap_optional`). They sit under `passes` because the timeline's own `style` is the stick's render style.
    - New flashback beats are `kind: flashback`, and the first weeks and the stamps are `montage`.
    - TPOOL's tier, 7.02's macro and 11.03's optional CLOD insert are in their beats' `passes`.

## 5. The gaps between lines (the tempo)

The median gap from one line's end to the next line's start, in seconds; an overlap counts as negative. "Inside beats" is the exchanges the tempo table sets. "Act clock" takes every consecutive pair, the cuts included.

| Act | Inside beats, v3.4 → **v3.5** (pairs) | Act clock, v3.4 → **v3.5** | Spoken only (no V.O.), v3.4 → **v3.5** |
|---|---|---|---|
| Act One | 0.60 → **0.45** (44 → 51) | 0.80 → **0.65** | 0.90 → **0.80** |
| Act Two | 0.50 → **0.475** (17 → 24) | 0.86 → **0.70** | 0.90 → **0.80** |
| Act Three | 0.525 → **0.45** (10 → 11) | 1.15 → **1.10** | 1.20 → **1.15** |
| Act Four | 0.55 → **0.40** (52 → 53) | 0.90 → **0.75** | 0.81 → **0.70** |

- The cold open and the tag are unchanged: 2 pairs each, with the medians 3.05 s and 9.28 s.
- **Act Two's inside-beat median barely moves**, because its new exchanges are the 2019 room's. Alyi's two questions there wait for the marker (0.8 s, business), and Mas's gaps are 0.45 s.

## 6. The beds

This is v3.4's method: the mixer lays all 256 takes, and each chapter gets one temp bed. What changed for v3.5:
- **J-/L-cuts come from the v3.5 plans,** with the v3 plan's where a beat names none.
- **When a J-cut's sound is the next scene's**, that scene's sound moves `lead_s` earlier under the cut:
  - the gavel (14.01 → v35-27.00);
  - the stamp (v35-28.05 → v35-29.01);
  - the marker (v31-10.04 → v35-18.01);
  - the toast (v35-22.01 → 12.01; its own v3 J-cut is the same 0.4 s, so the larger lead is taken, not the sum).

  Otherwise the next scene's room leads: the first weeks, 2018, 2019, the war room, the all-hands' hush.
- **Temp pads for the new cues:** the first weeks, Jun 2018, the window, the vision post, Mar 2019, the war room, TPOOL. The Senate, the tour and the board's side continue their pads.
- **No score** (the room only) for 3 AM, the lamp, the waitlist's sting, the flight and Alyi's night.
- **TPOOL's two shots play the TPOOL room** (`bed_tpool`), not the plan's office.
- **All 7 beds built through `ops/heavy.sh`, with 0 missing SFX.**
- **The one silence** is Act Four's, 26.15–31.26 s, unchanged.

## 7. Pacing: v3.4 against v3.5

| | v3.4 lock | **v3.5 lock** |
|---|---|---|
| Shots · ASL · median shot | 223 · 5.43 s · 4.0 s | **260 · 5.17 s · 3.71 s** |
| Stays · median stay | 48 · 15.2 s | **52 · 16.6 s** |
| Entry air, median (all / spoken only) | 3.7 s / 5.2 s | **3.8 s / 3.8 s** |
| Exit air, median | 3.2 s | **2.9 s** |
| Lines · J-cuts · L-cuts | 231 · 6 · 5 | **256 · 7 · 4** |
| Mas's words · share · inner-voice lines (words) | 389 · 22.7 % · 15 (124) | **463 · 25.2 % · 17 (135)** |

## 8. Open, for a ruling or an ear

1. **S3.00a's second** (§4.1): the 0.7 s pre-lap, or accept +1.0 s.
2. **S4.10b's split** (§4.2): the head at 0.8 s with the business 0.2 s tighter (as locked), or the head at 1.6 s with the business 1.0 s tighter. Either is 14.05 s.
3. **Under the read floor at the plan's own lengths,** for the picture pass (shorter text on screen, or longer holds):
   - the first weeks' prompts and Nole's card (v35-10.01, 10.03, 10.04, 10.05: 1.8–2.8 s against 2.25–4.45 s);
   - the at-capacity page (1.5 s) and the corner counter (1.5 s; it is also on 2018's wall);
   - the vision post's passages (about 0.3 s short each);
   - "no plans to leave" (2.8 s against 4.3 s) and the 9:32 PM post (2.4 s against 4.7 s);
   - the blog post (S3.03, 5.3 s: the plan's "5.5 s reads both sentences");
   - Alyi's post in full (S7.01, 6.6 s against 9.8 s: the plan adds 1.5 s);
   - `NELEH left the call` (S6.04, 0.33 s; v3.4 had 0.59 s);
   - `MUNICH` (the last stamp, 0.7 s).
4. **Stale music strings are the plan's own:** 7.01's "…before the siren" and v32-7.03's "the siren takes over". Left as written: the siren now comes after the first weeks.
5. **For an ear** (notes §8):
   - v35-vo-04 (the count);
   - Tasya's minute (v35-a4-0004);
   - the two slow short questions in 2019;
   - MARIO's point two beside the ElevenLabs cast;
   - AUHSOJ's borrowed preset, which the ElevenLabs pass recasts.

## 9. How to rebuild

```sh
python3 audio/reel/ep01-v35/build_timeline.py                         # the lock + manifest + lock-report.json + pacing
bash ops/heavy.sh audio/.venv-casting/bin/python audio/reel/ep01-v35/bed.py   # the beds (about 30 s)
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v35/ep01-v35.manifest.json --plan
cd .. && python3 audio/reel/ep01-v35/measure.py                       # measure.json + lock-v35-transcript.txt
```
