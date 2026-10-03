# Ep1 · Act Four · Tightening changes, draft 3.1 → 3.2

*Staff writer, 2026-09-25. This is the production changelog for the tightening pass: what changed in Act Four (sc 24–31) between script draft 3.1 and 3.2, line by line for the re-record and scene by scene for the re-board and the re-lock.*
- *The script is [script.md](../../script.md#act-four--the-blip-told-twice). The reasons are in its [Revision log (tightening pass)](../../script.md#revision-log-tightening-pass), and the writer's clock and cut list are in its Writer's notes, under "Act Four, draft 3.2".*
- *The previous changelog, 3 → 3.1, is [pov-changes.md](pov-changes.md).*

**The note this answers** (the showrunner, on animatic v2): "why is there so much empty silence in the animatic? the dialogue feels slow. i like the visuals otherwise. don't lengthen things out just for the sake of it. also, we don't need to have all scenes in the form of boxes for people talking, we can have more closeup or other angle zoom variety shots."

**Read this first.**
- **Everything here is a target on the beat grid:** 96 BPM, 1 beat = 0.625 s = 15 f, 1 bar = 60 f.
  - The line targets (§2) are the spans the picture was timed to.
  - A re-take can land within ±10% of its target. Past that, the lock moves the cut by a beat and says so.
- **Re-lock as `timing-v3`.** [timing-v2.md](history/timing-v2.md), [shots-locked-v2.json](history/shots-locked-v2.json) and [chunks-v2.md](history/chunks-v2.md) describe 3.1; don't conform them.
- **v3 of the animatic needs sound.** Cut it against a temp score and SFX (§6); a dialogue-only cut will read as silent again. None of the MM tracks in `audio/ost/tracks/` is finished yet (only `_demo` and `_template` exist). Until one is, use a temp bed per family and mark it TEMP in the cue list.
- **Real lines are untouched,** word for word, with their tags. Only the placement of two of them changed (§1.3).

---

## 0. At a glance

| Sc | 3.1 printed | Lock v2 | **3.2 target** | Δ vs lock v2 |
|---|---|---|---|---|
| 24 | 12:31–12:36 · 120 f | 120 f | **12:31:00–12:34:18 · 90 f** (6 beats) | −30 f |
| 25 | 12:36–13:21 · 1080 f | 1080 f | **12:34:18–12:52:06 · 420 f** (7 bars) | −660 f |
| 26 | 13:21–14:13.5 · 1260 f | 1260 f | **12:52:06–13:10:09 · 435 f** (29 beats) | −825 f |
| 26A | 14:13.5–14:33.5 · 480 f | 480 f | **13:10:09–13:18:12 · 195 f** (13 beats) | −285 f |
| 27 | 14:33.5–16:24.5 · 2664 f | 2910 f | **13:18:12–14:29:18 · 1710 f** (114 beats) | −1200 f |
| 28 | 16:24.5–16:27.6 · 74 f | 75 f | **14:29:18–14:32:06 · 60 f** (1 bar) | −15 f |
| 29 | 16:27.6–17:59.9 · 2216 f | 2370 f | **14:32:06–15:34:03 · 1485 f** (99 beats; avalanche 15:14:03–15:34:03) | −885 f |
| 30 | 17:59.9–19:16.8 · 1845 f | 1905 f | **15:34:03–16:22:21 · 1170 f** (78 beats) | −735 f |
| 31 | 19:16.8–19:43.8 · 648 f | 690 f | **16:22:21–16:40:09 · 420 f** (28 beats) | −270 f |
| **Act** | **7:12.8** · 10387 f | **7:33.75** · 10890 f | **4:09.375 · 5985 f** (399 beats) | **−4905 f (−204.4 s)** |

Timecodes are `mm:ss:ff` at 24 fps from the episode's 12:31:00, like timing-v2's.

| Count | 3.1 (lock v2) | 3.2 |
|---|---|---|
| Cuts | 139 | **114** |
| Voiced lines in the cut | 43 dialogue + 5 V.O. | **43 dialogue + 3 V.O.** |
| Unvoiced post pop-ups | 7 | 7 (the 9:32 post moved scene) |
| New lines / changed lines / removed lines | — | **6 / 3 / 8** |
| Marked overlaps / cut-offs | 0 / 1 | **7 / 5** |
| Voiced time | 90.5 s (20% of the act) | ≈ 62 s (25%) |
| Stretches of more than 6 s with no voice | 18, ≈ 304 s | 12, ≈ 138 s, all scored or carrying their own sound (§6) |
| Median gap between lines inside an exchange | 1.14 s (all lines) | ≈ 0.5 s on the grid; **≤ 0.3 s** is the lock's target |
| Pace | 129 wpm | ≈ 175 wpm at the targets |
| Boxed portrait windows (§4.7.4) | 42 shots · 27.3%; 29 of 45 lines played in a box | **1 deliberate `[P2]` · 2.5%; 1 line in it** |
| `[MCU]` + `[CU]` · `[M]` + `[2S]` + `[OTS]` | 1.1% · 9.8% | **19.0% · 12.5%** |
| Runs of 3+ shots of one size | 7 | **0** |
| Cards | 6 | 2 (NELEH, TERB), plus 2 plates and 1 tile label |
| Quiet beats | 1 × 4 beats | 2 × 3 beats |

---

## 1. Summary of the dialogue changes

### 1.1 New (6)

| Id | Sc | Speaker | Line |
|---|---|---|---|
| `a4-25-10` | 25 | NELEH (blueprint) | Nine seats. Three left this year. Four of us vote. |
| `a4-25-11` | 25 | NELEH (blueprint) | This board controls the company. |
| `a4-25-12` | 25 | NELEH (blueprint) | The investor gets— |
| `a4-25-13` | 25 | NELEH (blueprint) | And the CEO owns— |
| `a4-27-23` | 27 | NELEH (on the call, in the two-up) | Share what? |
| `a4-27-24` | 27 | RIMA | More. Soon. |

All are [INVENTED]. THE PLAN's four lines are the board describing its own public structure (seats, votes, control, the investor's zero votes, his own testimony of zero equity), with no reasons (X9). "Three left this year" leans on the [V/K] row that 3.1's `LEFT EARLIER IN 2023` stamp used.

### 1.2 Changed (3)

| Id | Sc | Speaker | 3.1 | **3.2** |
|---|---|---|---|---|
| `a4-27-09` | 27 | ALYI (reflection) | Step four… will reveal itself. | **Step four will reveal itself.** |
| `a4-27-14` | 27 | MARIO | I've written up some thoughts. | **I've written up some thoughts—** (cut off by ADELINA) |
| `a4-29-04` | 29 | GERG | One sec. Compiling. | **One sec. Compiling—** (cut off by MAS) |

### 1.3 Removed (8), and moved

| Id | Sc | Speaker | Line | Why |
|---|---|---|---|---|
| `a4-25-01` | 25 | NELEH (blueprint) | Step four. | THE PLAN no longer shows step 4 (the no-spoiler fold). MADA's "Good question." now cuts off "And the CEO owns—" |
| `a4-26a-vo2` | 26A | MAS (V.O.) | the meeting ended early. | D4 cut. With THE PLAN shorter it would share D2's 4-bar phrase |
| `a4-29-vo1` | 29 | MAS (V.O.) | i put the phone down. | D5 and MAS'S VERSION cut. The hearts play straight, and D5 debuts in Ep2 or Ep3 |
| `a4-27-02` | 27 | RIMA | I'll hold it together. | R6: a stated trope |
| `a4-27-03` | 27 | NELEH | For how long? | Replaced by "Share what?" |
| `a4-27-11` | 27 | ALYI (reflection) | The company will tell us. | R2: the committee races the phones; it was a third question-and-answer in a row |
| `a4-27-18` | 27 | TTEMME | Chat. I'm the CEO now. | It said his card aloud; the spotlight and his stream's name bar carry it |
| `a4-27-22` | 27 | MADA | Good question. (end of pass one) | Pattern 8: twice an episode at most. Her `?` and his spinner end the pass unanswered |

Move each file and its alternates to `retired/`, and drop the row from `lines.json`.

**Moved, not re-recorded** (posts stay unvoiced pop-ups):
- `a4-26a-01`, the 9:32 post, moves from 26A to sc 27, on NELEH's phone (shot 27.10, 2 bars).
- The candor quote card (a `[GFX]`, not a line) moves from sc 26 to sc 27 (shot 27.04, 1 bar + 2 beats).

**Unchanged unvoiced posts,** with their holds re-timed in §5: `a4-27-01` "…I quit." · `a4-27-07` the eulogy · `a4-27-17` the badge · `a4-29-01` "NopeAI is nothing without its people" · `a4-30-10` Gerg's return · `a4-30-11` TTEMME's "deeply pleased". Their scratch reads stay in `optional/`.

### 1.4 Re-take, re-derive and restage

Every other voiced line is **re-taken for pace**, with the same words and the same tag, and several get a new cue (§2). `a4-27-00`, the laptop "super.", is re-derived from the new `a4-26-01` take. `a4-27-21`, "Step four?", is restaged O.S. `lines.json` status values for this pass: `new`, `changed`, `retake-pace`, `rederive`, `restaged`, `moved`, `removed`.

---

## 2. Every voiced line in 3.2, in order

The target is the audible span, trimmed. The cue is the beat inside the shot where the line starts (beat 1 = the shot's first frame); shots are listed in §5.

| # | Id | Sc | Speaker | 3.2 line | Status | v2 take → target | Shot, cue | Delivery and cue notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `a4-25-10` | 25 | NELEH (blueprint) | Nine seats. Three left this year. Four of us vote. | **NEW** | — → **≈ 3.30 s** | 25.02, beat 2 | One read. "Three" lands on DIRE's first step, "Four" on the circle. Precise, a charter read, not a list |
| 2 | `a4-25-11` | 25 | NELEH (blueprint) | This board controls the company. | **NEW** | — → **≈ 1.70 s** | 25.02, beat 8 | "controls" on the arrow's draw |
| 3 | `a4-25-12` | 25 | NELEH (blueprint) | The investor gets— | **NEW** (cut-off) | — → **≈ 0.80 s** | 25.02, beat 11 | A hard stop on "gets", no tail: the `VOTES: 0` stamp lands on the cut |
| 4 | `a4-25-13` | 25 | NELEH (blueprint) | And the CEO owns— | **NEW** (cut-off) | — → **≈ 0.90 s** | 25.02, beat 13.5 | A hard stop on "owns"; MADA cuts in |
| 5 | `a4-25-02` | 25 | MADA (blueprint) | Good question. | re-take; new cue | 1.09 s → **≈ 0.85 s** | 25.02, beat 14.6 | *(overlapping)*: starts ≈ 4 f before "owns—" ends. Same flat, courteous non-answer |
| 6 | `a4-26-01` | 26 | MAS | super. | re-take (pace) | 0.89 s → **≈ 0.60 s** | 26.09, beat 1.2 | On the `[OTS]`'s first beat; level final, no smile audible |
| 7 | `a4-26a-vo1` | 26A | MAS (V.O.) | i don't keep score. | re-take (pace) | 2.09 s → **≈ 1.50 s** | 26A.01, beat 2 | Carve shot, beat 2. Also re-take the fallback "i don't keep things." at the same pace |
| 8 | `a4-27-00` | 27 | MAS (through their laptop) | super. | re-derive | 0.89 s → **≈ 0.60 s** | 27.01, beat 1.1 | From the new `a4-26-01` take, through the same `laptop_speaker` chain, −22 LUFS |
| 9 | `a4-27-04` | 27 | RIMA | We'll share more soon. | re-take (pace) | 1.37 s → **≈ 1.10 s** | 27.05, beat 1.5 | Pleasant, unhurried in tone, not in length |
| 10 | `a4-27-23` | 27 | NELEH (on the call, in the two-up) | Share what? | **NEW** | — → **≈ 0.55 s** | starts 4 f before the cut into 27.05b; the cut lands on it | *(overlapping)*: on "soon" (≈ 6 f before `a4-27-04` ends). A light call filter (thinner than the laptop chain). Literal, polite |
| 11 | `a4-27-24` | 27 | RIMA | More. Soon. | **NEW** | — → **≈ 0.90 s** | 27.05c, beat 1.3 | Exactly the read of `a4-27-04`'s last two words; the stop between them ≤ 0.15 s |
| 12 | `a4-27-05` | 27 | TILED EMPLOYEE | Is this a coup? | re-take (pace) | 1.37 s → **≈ 0.90 s** | 27.07, beat 1.8 | Lifts on "coup?" |
| 13 | `a4-27-06` | 27 | ALYI | "You can call it this way" | re-take (pace) | 3.12 s → **≈ 2.10 s** | 27.08, beat 1.3 | [V]. Keep the weight in pitch and falling finals, not in length |
| 14 | `a4-27-08` | 27 | NELEH | The bylaws allow it. Footnote three. | re-take (pace) | 2.35 s → **≈ 2.00 s** | 27.13b, beat 1.3 | On the first buzz |
| 15 | `a4-27-09` | 27 | ALYI (reflection) | Step four will reveal itself. | **CHANGED**: was "Step four… will reveal itself." | 3.27 s → **≈ 2.10 s** | 27.14, beat 1.6 | No pause after "four"; on the second buzz |
| 16 | `a4-27-10` | 27 | ALYI (reflection) | When? | re-take; new cue | 0.61 s → **≈ 0.45 s** | 27.14, beat 4.7 | *(overlapping)*: on "itself" (≈ 4 f before `a4-27-09` ends) |
| 17 | `a4-27-12` | 27 | NELEH | The company is calling us. | re-take (pace) | 1.68 s → **≈ 1.30 s** | 27.16, beat 1.3 | Looking down at the fallen phone; dry |
| 18 | `a4-27-13` | 27 | ALYI (reflection) | That is the company telling us. | re-take (pace) | 3.70 s → **≈ 2.20 s** | 27.17, beat 1.2 | Tight on NELEH's "us" (≤ 3 f) |
| 19 | `a4-27-14` | 27 | MARIO | I've written up some thoughts— | **CHANGED**: now a cut-off (was a full stop) | 2.16 s → **≈ 1.60 s** | 27.22a, beat 1.4 | Cut on "thoughts", no tail |
| 20 | `a4-27-15` | 27 | ADELINA | In plain English: no. | re-take; new cue | 1.57 s → **≈ 1.30 s** | starts 2 f before the cut into 27.22b; the cut lands on it | *(overlapping)*: on "thoughts". Brisk, warm, final |
| 21 | `a4-27-16` | 27 | MARIO | Hi. Yes. We're very worried. How much? | re-take (pace) | 2.77 s → **≈ 2.20 s** | 27.23, beat 1.2 | On the second phone's first ring. The four stops stay, each ≤ 0.2 s |
| 22 | `a4-27-19` | 27 | TTEMME | Chat… for how long? | re-take (pace) | 1.61 s → **≈ 1.30 s** | 27.27, beat 1.5 | The "…" ≤ 0.3 s |
| 23 | `a4-27-20` | 27 | TASYA | "a new advanced AI research team" | re-take (pace) | 2.80 s → **≈ 2.10 s** | 27.29, beat 1.3 | [V], read aloud with pleasure |
| 24 | `a4-27-21` | 27 | NELEH (O.S.) | Step four? | re-take; restaged | 0.85 s → **≈ 0.65 s** | 27.30, beat 1.4 | Now O.S., over the blueprint insert; nobody answers |
| 25 | `a4-29-vo2` | 29 | MAS (V.O.) | the badge was a joke. | re-take (pace) | 2.44 s → **≈ 1.60 s** | 29.04, beat 1 | The Orb is already on the lanyard; understated, told |
| 26 | `a4-29-03` | 29 | MAS | mostly. | re-take (pace) | 0.94 s → **≈ 0.65 s** | 29.05, beat 1 | On the `[2S]` downbeat, a shade under the V.O.; level or gently falling |
| 27 | `a4-29-04` | 29 | GERG | One sec. Compiling— | **CHANGED**: now a cut-off (was "One sec. Compiling.") | 1.21 s → **≈ 0.90 s** | 29.11a, beat 1.3 | Mas cuts in on "Compil-" |
| 28 | `a4-29-05` | 29 | MAS | what are you building? | re-take; new cue | 1.97 s → **≈ 1.40 s** | starts 3 f before the cut into 29.11b; the cut lands on it | *(overlapping)*: on "Compiling" |
| 29 | `a4-29-06` | 29 | GERG | The company. Again. Just in case. | re-take (pace) | 1.98 s → **≈ 1.70 s** | 29.12, beat 1.1 | On the cut to his tile; sunny, literal |
| 30 | `a4-29-vo3` | 29 | MAS (V.O.) | gerg never waits to be asked. | re-take (pace) | 2.81 s → **≈ 2.00 s** | 29.16, beat 1 | "asked" still carries the door's first step (log its word frame) |
| 31 | `a4-29-07` | 29 | TASYA (O.S.) | Everyone is welcome. | re-take (pace) | 1.50 s → **≈ 1.20 s** | 29.16, beat 6 | At least 1 beat after the V.O.; its tail runs over the cut |
| 32 | `a4-29-08` | 29 | MAS | leave it open. | re-take; new cue | 1.52 s → **≈ 1.00 s** | 29.17, beat 1 | *(overlapping)*: on "welcome", at once |
| 33 | `a4-29-09` | 29 | NELEH | Has anyone read the char— | re-take (pace) | 1.66 s → **≈ 1.20 s** | 29.24, beat 1.5 | Cut-off kept; the tile's exit cuts it |
| 34 | `a4-30-01` | 30 | ALYI | "I deeply regret my participation in the board's actions." | re-take (pace) | 5.17 s → **≈ 3.80 s** | 30.01, beat 1.4 | [V], read from the doorway; the violin stops on the first heart, after the line |
| 35 | `a4-30-02` | 30 | TASYA | "We are below them, above them, around them." | re-take (pace) | 3.66 s → **≈ 2.90 s** | 30.03, beat 2 | [V/K]. Log the frames of "below", "above" and "around": each starts a remap step |
| 36 | `a4-30-03` | 30 | MAS | hi. | re-take (pace) | 0.71 s → **≈ 0.45 s** | 30.06, beat 1.4 | — |
| 37 | `a4-30-04` | 30 | TASYA (O.S.) | Hello. | re-take; new cue | 0.89 s → **≈ 0.60 s** | starts 2 f before the cut into 30.06b; the cut lands on it | *(overlapping)*: the tail of "hi." |
| 38 | `a4-30-05` | 30 | TERB | Which room is on fire? | re-take (pace) | 1.71 s → **≈ 1.20 s** | 30.11a, beat 1.2 | — |
| 39 | `a4-30-06` | 30 | TERB | …Ah. | re-take (pace) | 0.63 s → **≈ 0.40 s** | 30.11b, beat 2 | The "…" is the room looking around (≈ 1 beat of picture), not the read |
| 40 | `a4-30-07` | 30 | TERB (O.S.) | Terms? | re-take (pace) | 0.90 s → **≈ 0.50 s** | 30.12, beat 1.8 | — |
| 41 | `a4-30-08` | 30 | MADA | Good question. | re-take (pace) | 1.09 s → **≈ 0.85 s** | 30.13, beat 1.2 | On the tail of "Terms?" (≤ 3 f) |
| 42 | `a4-30-09` | 30 | MAS | good question. | re-take (pace) | 1.34 s → **≈ 0.90 s** | 30.14, beat 2 | **Exactly 1 beat** after MADA's line ends: the late beat is the joke, so don't close it |
| 43 | `a4-30-12` | 30 | MAS | okay. | re-take (pace) | 0.89 s → **≈ 0.60 s** | 30.23, beat 1.8 | Over the hands; no lip-sync |
| 44 | `a4-31-01` | 31 | GERG | What's in there? | re-take (pace) | 0.90 s → **≈ 0.70 s** | 31.02, beat 1.8 | — |
| 45 | `a4-31-02` | 31 | MAS | it's a preview. | re-take (pace) | 1.42 s → **≈ 1.00 s** | 31.02, beat 3 | Tight on Gerg (≤ 4 f); not looking |
| 46 | `a4-31-03` | 31 | MAS | "i love and respect alyi… i harbor zero ill will towards him." | re-take (pace) | 5.89 s → **≈ 4.30 s** | 31.03, beat 1.8 | [V]. Unhurried but not slow; the "…" ≤ 0.4 s |

---

## 3. Delivery: pace, trims and gaps

v2 measured 129 wpm overall with a median gap of 1.14 s between lines. That's the "dialogue feels slow" note. The fix is in three places: the read, the trim and the placement.

**The read.** Keep every brief in [dialogue.md](dialogue.md) §2–§5 (timbre, lane, finals, never cloned, never a sound-alike); only the pace changes.

| Voice (pack · chain) | v2 speed | **3.2 speed (a start)** | Target pace (lines of 3+ words) | Keep |
|---|---|---|---|---|
| MAS, on camera (`am_michael` · `a-michael-close`) | 0.82 | **≈ 0.95–1.0** | 140–155 wpm; one-word lines ≤ 0.65 s audible | Level or gently falling finals; the slowest in any room, never a drawl |
| MAS (V.O.) (`vo-close`) | 0.577–0.613 | **≈ 0.85–0.9** | 130–140 wpm, i.e. ×1.05–1.10 of his new on-camera read of the same words (was ×1.08–1.20) | Close, dry, told; −18 LUFS. This needs the POV owner's sign-off (the script's ruling 7) |
| ALYI (`am_onyx` · `a-onyx-cathedral`) | 0.8 | **≈ 0.92** | 135–150 wpm | The weight lives in pitch and falling finals, not length |
| NELEH (`af_aoede` · `c-aoede-precise`) | 0.95 | **≈ 1.05** | 170–190 wpm | Precise, polite; questions barely lift |
| MADA (`am_adam` · `b-adam-grey`) | 0.9 | **≈ 1.0** | "Good question." ≈ 0.85 s | Flat, courteous; one master read for both of his lines |
| RIMA (`af_heart` · `a-heart-composed`) | 0.9 | **≈ 1.0** | 160–175 wpm | "More. Soon." copies her own last two words |
| TASYA (`am_eric` · `b-eric-warm`) | 0.88 | **≈ 0.98** | 145–160 wpm | Warm; smile in the air band; no creak on finals |
| MARIO (`am_liam` · `a-liam-earnest`) | 0.95 | **≈ 1.05** | 165–175 wpm | His stops in "Hi. Yes. …" are the joke; keep them, but make each short |
| ADELINA (`af_bella` · `a-bella-warm`) | 0.95 | **≈ 1.05** | ≈ 185 wpm | Kind finality |
| TTEMME (`am_fenrir` · `d-fenrir-headset`) | 1.0 | **≈ 1.08** | — | Streamer patter |
| GERG (`am_puck` · `a-puck-quick`) | 1.15 | **≈ 1.2** | 200+ wpm | Fastest in the act |
| TERB (`am_echo` · `b-echo-brisk`) | 1.02 | **≈ 1.1** | — | Procedural, unbothered |
| TILED EMPLOYEE (`af_nova` · `a-nova-plain`) | 0.95 | **≈ 1.05** | — | Lifts on "coup?" |

Speed is only the first lever. Pick takes by span against the §2 target (±10%) as well as by the existing QA terms (ASR, lane, final contour, creak). If a pack goes brittle at the new speed, keep its v2 speed and trim the internal pauses instead (§3's trims).

**The trim.**
- **Head and tail padding goes from 30 ms / 80 ms to 20 ms / 40 ms.**
- **Cut-off lines end on the cut consonant, with no tail and no fade:** "gets—", "owns—", "thoughts—", "Compil(ing)—" and "char—". The next sound (a stamp, a line, a tile's exit) is the cut.
- **Internal pauses.** An ellipsis or a full stop inside a line is at most 0.3 s. The only exception is the memo's "…" at 0.4 s. "Step four will reveal itself." has none.

**The placement** (THE EDITOR, at the lock):
- **Inside an exchange,** a reply starts on the previous line's last syllable, or ≤ 0.3 s after it; ≤ 0.3 s is the median target. v2's median gap was 1.14 s.
- **Conversation cuts land on the turn,** frame-accurate, not rounded to the next beat. A line may L-cut ≤ 8 f across its cut ([pov-and-framing §4.7.3](../../../../bible/pov-and-framing.md#473-rules) rule 8, the v3 default). Set-pieces, holds, cards and music-bound cuts stay on the grid.
- **Marked overlaps** start where §4 says.
- **Four gaps stay open,** because they're the joke or the rule:
  - MAS's "good question." is exactly 1 beat after MADA's.
  - The V.O. keeps its clearances (§4).
  - TASYA's "Everyone is welcome." is at least 1 beat after "gerg never waits to be asked."
  - Nothing is heard in the drop-out.

**Levels** are unchanged: dialogue −16 LUFS, V.O. −18 (lifted +2 dB in the premix), and the laptop "super." −22.

---

## 4. Overlaps and cut-offs (the cue sheet)

| # | Sc · shot | Under | Over | Where the second line starts | Mix |
|---|---|---|---|---|---|
| 1 | 25 · 25.02 | NELEH "And the CEO owns—" | MADA "Good question." | ≈ 4 f before "owns" ends | Both dry; "owns" is cut by the overlap, not faded |
| 2 | 25 · 25.02 | NELEH "The investor gets—" | *(picture: the `VOTES: 0` stamp, `rubber_stamp_C`)* | on the "t" of "gets" | The stamp is the cut |
| 3 | 27 · 27.05 → 27.05b | RIMA "We'll share more soon." | NELEH (on the call, a call filter) "Share what?" | ≈ 6 f before "soon" ends | NELEH ≈ 2 dB under RIMA |
| 4 | 27 · 27.14 | ALYI "Step four will reveal itself." | NELEH "When?" | ≈ 4 f before "itself" ends | — |
| 5 | 27 · 27.22a → 27.22b | MARIO "I've written up some thoughts—" | ADELINA "In plain English: no." | on "thoughts" (≈ 3 f in) | MARIO's line has no tail |
| 6 | 27 · 27.22b → 27.23 | the click, and the throne falling | MARIO "Hi. Yes. We're very worried. How much?" | on the second phone's first ring, ≤ 4 f after the click | — |
| 7 | 29 · 29.11a → 29.11b | GERG "One sec. Compiling—" | MAS "what are you building?" | on "Compil-" | GERG's keys continue under it |
| 8 | 29 · 29.16–29.17 | TASYA (O.S.) "Everyone is welcome." | MAS "leave it open." | ≈ 4 f before "welcome" ends; the cut to 29.17 falls inside "welcome" | No music under either (tone guide R16) |
| 9 | 29 · 29.24 | NELEH "Has anyone read the char—" | *(picture: her tile leaves the frame)* | on "char" | Cut clean |
| 10 | 30 · 30.06 → 30.06b | MAS "hi." | TASYA (O.S., from the floor) "Hello." | on the tail of "hi." (≤ 2 f gap) | — |
| 11 | 30 · 30.12–30.13 | TERB (O.S.) "Terms?" | MADA "Good question." | ≤ 3 f after "Terms?" | Tight, not overlapped |

The V.O. is never overlapped and never overlaps. Its clearances (pov-and-framing §5):
- **`a4-26a-vo1`** starts ≥ 4 beats after F1.2's `(REPORTED)` rail clears, and ends ≥ 1 beat before 26A.01's cut.
- **`a4-29-vo2`** starts 1 bar after the last of Rima's posts, and ends ≥ 1 beat before "mostly.".
- **`a4-29-vo3`** runs from 29.16's first beat, and "asked" carries the door's first held step.

---

## 5. Scene-level timing targets, shot by shot

This is the re-board's beat budget, from the model the script's clock was built on. The tags and size classes are [pov-and-framing §4.7](../../../../bible/pov-and-framing.md#47-shot-variety-2026-09-25)'s. The model has no run of three shots of one size. Inside conversations the beat counts are budgets, because the cut lands on the turn (§3). "In" is the episode clock (seconds with two decimals). A line's cue is the beat inside the shot where it starts. The editor may move a line within its shot; moving a cut needs the board and a note in `timing-v3`.

**Sc 24 · the suite · 12:31.00–12:34.75 · 6 beats (3.750 s) · 2 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 24.01 | `[W]` | W | 1 bar | 12:31.00 | the suite; every glass shivers but his | — |
| 24.02 | `[ECU]` | ECU | 2 beats | 12:33.50 | the nudge; the glow turns to blueprint | — |

**Sc 25 · THE PLAN · 12:34.75–12:52.25 · 28 beats (17.500 s) · 5 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 25.01 | `[GFX·sheet]` | GFX-sheet | 1 bar | 12:34.75 | THE WORD | — |
| 25.02 | `[GFX·section/detail]` | GFX-section | 4 bars | 12:37.25 | THE DIAGRAM, voiced (section, cut-ins to detail on the key ring and the equity box) | `a4-25-10` @ 2; `a4-25-11` @ 8; `a4-25-12` @ 11; `a4-25-13` @ 13.5; `a4-25-02` @ 14.6 |
| 25.03 | `[GFX·sheet]` | GFX-sheet | 1 bar | 12:47.25 | the path; the figures step onto 1 | — |
| 25.04 | `[GFX·detail]` | GFX-detail | 2 beats | 12:49.75 | the fold curls; the tear | — |
| 25.05 | `[ECU]` | ECU | 2 beats | 12:51.00 | JOIN, the click | — |

**Sc 26 · THE FALLING TILE · 12:52.25–13:10.38 · 29 beats (18.125 s) · 10 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 26.01 | `[POV]` | screen-wide | 1 bar | 12:52.25 | the grid connects; NELEH card rides | — |
| 26.02 | `[POV·pin]` | screen-close | 2 beats | 12:54.75 | speaker view pins ALYI; … | — |
| 26.03 | `[POV]` | screen-close | 2 beats | 12:56.00 | the dialog: OK / Cancel | — |
| 26.04 | `[ECU]` | ECU | 1 beat | 12:57.25 | the eyes strip | — |
| 26.05 | `[POV]` | screen-wide | 3 beats | 12:57.88 | the arrow steps in | — |
| 26.06 | `[POV]` | screen-wide | 2 beats | 12:59.75 | click; D6; the tile falls | — |
| 26.07 | `[CU]` | CU | 3 beats | 13:01.00 | silent [CU]; +1 FIRING | — |
| 26.08 | `[ECU]` | ECU | 3 beats | 13:02.88 | the buzz; the strip; the tap | — |
| 26.09 | `[OTS]` | OTS | 3 beats | 13:04.75 | "super."; the feed freezes | `a4-26-01` @ 1.2 |
| 26.10 | `[W]` | W | 1 bar + 2 beats | 13:06.62 | F1.2 TPOOL | — |

**Sc 26A · THAT NIGHT · 13:10.38–13:18.50 · 13 beats (8.125 s) · 3 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 26A.01 | `[ECU]` | ECU | 1 bar + 2 beats | 13:10.38 | mark 3 carved | `a4-26a-vo1` @ 2 |
| 26A.02 | `[2S]` | M | 3 beats | 13:14.12 | the Orb counts | — |
| 26A.03 | `[ECU·Orb]` | ECU | 1 bar | 13:16.00 | the iris to his face; rewinding…; whip | — |

**Sc 27 · PASS ONE: THE BOARD'S SIDE · 13:18.50–14:29.75 · 114 beats (71.250 s) · 35 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 27.01 | `[SCR]` | screen-wide | 1 bar | 13:18.50 | their call; "super." from the speaker | `a4-27-00` @ 1.1 |
| 27.02 | `[MCU]` | MCU | 2 beats | 13:21.00 | NELEH turns a page | — |
| 27.03 | `[HIGH]` | ECU | 2 beats | 13:22.25 | the blueprint: step 1 ticks | — |
| 27.04 | `[GFX]` | GFX-card | 1 bar + 2 beats | 13:23.50 | the candor quote card | — |
| 27.05 | `[MCU]` | MCU | 3 beats | 13:27.25 | RIMA in her spotlight | `a4-27-04` @ 1.5 |
| 27.05b | `[SCR·2-up]` | screen-close | 1 beat | 13:29.12 | the two-up: NELEH | `a4-27-23` @ 0.7 |
| 27.05c | `[MCU]` | MCU | 3 beats | 13:29.75 | RIMA; plate | `a4-27-24` @ 1.3 |
| 27.06 | `[SCR]` | screen-wide | 1 bar | 13:31.62 | Gerg has left; "…I quit."; keycaps | — |
| 27.07 | `[W]` | W | 3 beats | 13:34.12 | the all-hands | `a4-27-05` @ 1.8 |
| 27.08 | `[MCU·door]` | MCU | 1 bar | 13:36.00 | ALYI in the doorway | `a4-27-06` @ 1.3 |
| 27.09 | `[W]` | W | 2 beats | 13:38.50 | the hand still up; the doorway empties | — |
| 27.10 | `[SCR]` | screen-close | 2 bars | 13:39.75 | the 9:32 post on NELEH's phone | — |
| 27.11 | `[HIGH]` | ECU | 2 beats | 13:44.75 | her pen taps EQUITY: 0 | — |
| 27.12 | `[SCR]` | screen-wide | 2 bars | 13:46.00 | Nov 18: the hearts; the eulogy post | — |
| 27.13 | `[2S]` | M | 1 beat | 13:51.00 | the committee placed; every phone buzzes | — |
| 27.13b | `[MCU]` | MCU | 1 bar | 13:51.62 | NELEH: bylaws | `a4-27-08` @ 1.3 |
| 27.14 | `[OTS]` | OTS | 1 bar + 1 beat | 13:54.12 | over NELEH onto the glass: step four / When? | `a4-27-09` @ 1.6; `a4-27-10` @ 4.7 |
| 27.15 | `[HIGH]` | ECU | 2 beats | 13:57.25 | the phones walk; the first tips off | — |
| 27.16 | `[MCU]` | MCU | 3 beats | 13:58.50 | NELEH: calling us | `a4-27-12` @ 1.3 |
| 27.17 | `[2S]` | M | 1 bar | 14:00.38 | the reflection between them: telling us | `a4-27-13` @ 1.2 |
| 27.18 | `[MCU·PF]` | MCU | 1 beat | 14:02.88 | NELEH's real face | — |
| 27.19 | `[HIGH]` | ECU | 2 beats | 14:03.50 | the ? on step 4 | — |
| 27.20 | `[W]` | W | 2 beats | 14:04.75 | the table; the speakerphone dials | — |
| 27.21 | `[ECU]` | ECU | 2 beats | 14:06.00 | the throne phone rings; (REPORTED) rail | — |
| 27.22a | `[MCU]` | MCU | 2 beats | 14:07.25 | MARIO: thoughts— | `a4-27-14` @ 1.4 |
| 27.22b | `[W]` | W | 1 bar + 1 beat | 14:08.50 | ADELINA takes the phone; no; the throne falls | `a4-27-15` @ 0.9 |
| 27.23 | `[MCU]` | MCU | 1 bar | 14:11.62 | MARIO: how much? | `a4-27-16` @ 1.2 |
| 27.24 | `[SCR]` | screen-close | 1 bar + 2 beats | 14:14.12 | Nov 19: the security tile; the badge post | — |
| 27.25 | `[W]` | W | 3 beats | 14:17.88 | TTEMME arrives; plate | — |
| 27.26 | `[HIGH]` | ECU | 2 beats | 14:19.75 | the hourglass flipped | — |
| 27.27 | `[LOW·desk]` | MCU | 3 beats | 14:21.00 | the hourglass big; TTEMME: for how long? | `a4-27-19` @ 1.5 |
| 27.28 | `[2S]` | M | 3 beats | 14:22.88 | the wall goes slate; a door | — |
| 27.29 | `[MCU·door]` | MCU | 1 bar | 14:24.75 | TASYA in the new door | `a4-27-20` @ 1.3 |
| 27.30 | `[HIGH]` | ECU | 2 beats | 14:27.25 | the blueprint's ?; "Step four?" | `a4-27-21` @ 1.4 |
| 27.31 | `[MCU]` | MCU | 2 beats | 14:28.50 | MADA doesn't answer | — |

**Sc 28 · the card · 14:29.75–14:32.25 · 4 beats (2.500 s) · 1 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 28.01 | `[GFX]` | GFX-card | 1 bar | 14:29.75 | WHAT THEY DIDN'T KNOW | — |

**Sc 29 · PASS TWO: HIS SIDE · 14:32.25–15:34.12 · 99 beats (61.875 s) · 31 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 29.01 | `[ECU]` | ECU | 3 beats | 14:32.25 | the home shot; HIS SIDE rail | — |
| 29.02 | `[ECU]` | ECU | 2 bars | 14:34.12 | the hearts, eight on the beat | — |
| 29.03 | `[2S]` | M | 1 bar | 14:39.12 | the Orb onto the lanyard | — |
| 29.04 | `[ECU·Orb]` | ECU | 1 bar | 14:41.62 | the iris on the lanyard; V.O. | `a4-29-vo2` @ 1 |
| 29.05 | `[MCU]` | MCU | 3 beats | 14:44.12 | "mostly."; rack to the Orb | `a4-29-03` @ 1 |
| 29.06 | `[POV]` | screen-close | 1 bar | 14:46.00 | the counter; 745 | — |
| 29.07 | `[GFX]` | GFX-card | 2 bars + 1 beat | 14:48.50 | the letter card | — |
| 29.08 | `[POV]` | screen-wide | 3 beats | 14:54.12 | the list: ALYI (REPORTED) | — |
| 29.09 | `[ECU·Orb]` | ECU | 3 beats | 14:56.00 | the iris; chime | — |
| 29.10 | `[2S]` | M | 1 bar + 1 beat | 14:57.88 | the check | — |
| 29.11a | `[POV·tile]` | screen-close | 2 beats | 15:01.00 | GERG: compiling— | `a4-29-04` @ 1.3 |
| 29.11b | `[MCU]` | MCU | 2 beats | 15:02.25 | MAS: what are you building? | `a4-29-05` @ 0.8 |
| 29.12 | `[POV·tile]` | screen-close | 3 beats | 15:03.50 | GERG: the company, again | `a4-29-06` @ 1.1 |
| 29.13 | `[MCU·PF]` | MCU | 1 beat | 15:05.38 | quiet beat: he watches | — |
| 29.14 | `[POV]` | screen-close | 1 beat | 15:06.00 | quiet beat: Gerg glances up | — |
| 29.15 | `[MCU·PF]` | MCU | 1 beat | 15:06.62 | quiet beat: he looks back | — |
| 29.16 | `[2S]` | M | 1 bar + 3 beats | 15:07.25 | D8; the door on "asked"; Tasya O.S. | `a4-29-vo3` @ 1; `a4-29-07` @ 6 |
| 29.17 | `[MCU]` | MCU | 1 bar | 15:11.62 | "leave it open."; rack to the door | `a4-29-08` @ 1 |
| 29.18 | `[POV·tile]` | screen-close | 2 beats | 15:14.12 | avalanche: one tile | — |
| 29.19 | `[POV]` | screen-wide | 2 beats | 15:15.38 | avalanche: ten | — |
| 29.20 | `[POV]` | screen-wide | 2 beats | 15:16.62 | avalanche: hundreds | — |
| 29.21 | `[MCU·PF]` | MCU | 2 beats | 15:17.88 | avalanche: Mas watching | — |
| 29.22 | `[POV]` | screen-wide | 2 beats | 15:19.12 | avalanche: the stack presses | — |
| 29.23 | `[POV·half]` | screen-close | 3 beats | 15:20.38 | avalanche: ALYI's tile resists | — |
| 29.24 | `[POV·half]` | screen-close | 3 beats | 15:22.25 | avalanche: NELEH's tile; char— | `a4-29-09` @ 1.5 |
| 29.25 | `[POV]` | screen-wide | 2 beats | 15:24.12 | avalanche: the quiet vote pushed out | — |
| 29.26 | `[POV]` | screen-wide | 2 beats | 15:25.38 | avalanche: 745 faces; one gap | — |
| 29.27 | `[ECU]` | ECU | 2 beats | 15:26.62 | avalanche: the glass, flat | — |
| 29.28 | `[MCU·PF]` | MCU | 2 beats | 15:27.88 | avalanche: Mas watching the gap | — |
| 29.29 | `[POV·half]` | screen-close | 1 bar | 15:29.12 | avalanche: MADA wedged | — |
| 29.30 | `[POV·half]` | screen-close | 1 bar | 15:31.62 | avalanche: MADA's label; the band stops | — |

**Sc 30 · THE RETURN · 15:34.12–16:22.88 · 78 beats (48.750 s) · 22 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 30.01 | `[P2] BOX` | BOX | 2 bars + 2 beats | 15:34.12 | the doorway: Alyi's post; three hearts; IOU | `a4-30-01` @ 1.4 |
| 30.03 | `[W]` | W | 2 bars + 2 beats | 15:40.38 | the landlord: the room remaps on the line | `a4-30-02` @ 2 |
| 30.06 | `[MCU·PF]` | MCU | 2 beats | 15:46.62 | MAS looks down: "hi." | `a4-30-03` @ 1.4 |
| 30.06b | `[HIGH]` | screen-close | 1 beat | 15:47.88 | the floor from above: "Hello." | `a4-30-04` @ 0.9 |
| 30.07 | `[M]` | M | 3 beats | 15:48.50 | MADA in the fires; Nov 21 rail | — |
| 30.08 | `[W]` | W | 2 beats | 15:50.38 | TERB bursts in | — |
| 30.09 | CARD (full freeze), riding the `[W]` | W | 1 bar | 15:51.62 | TERB card, full freeze; the pin pulled | — |
| 30.10 | `[ECU]` | ECU | 2 beats | 15:54.12 | the pin | — |
| 30.11a | `[MCU]` | MCU | 2 beats | 15:55.38 | TERB: which room? | `a4-30-05` @ 1.2 |
| 30.11b | `[W]` | W | 2 beats | 15:56.62 | the room looks around: …Ah. | `a4-30-06` @ 2 |
| 30.12 | `[2S]` | M | 2 beats | 15:57.88 | the calm-off: Terms? | `a4-30-07` @ 1.8 |
| 30.13 | `[OTS]` | OTS | 2 beats | 15:59.12 | over Mas onto MADA: Good question. | `a4-30-08` @ 1.2 |
| 30.14 | `[MCU]` | MCU | 3 beats | 16:00.38 | MAS: good question. (1 beat late) | `a4-30-09` @ 2 |
| 30.15 | `[2S]` | M | 1 bar | 16:02.25 | the long hold (2 beats); the stamp | — |
| 30.16 | `[POV]` | screen-close | 1 bar + 1 beat | 16:04.75 | Gerg's return post | — |
| 30.17 | `[MCU·PF]` | MCU | 1 beat | 16:07.88 | MAS reads it | — |
| 30.18 | `[HIGH]` | ECU | 2 bars | 16:08.50 | the hourglass; TTEMME's post; the shatter | — |
| 30.19 | `[LOW]` | W | 1 bar | 16:13.50 | the lobby sign from low: 0 | — |
| 30.20 | `[ECU]` | ECU | 2 beats | 16:16.00 | the box of zeros | — |
| 30.21 | `[OTS-W]` | OTS | 1 bar | 16:17.25 | over Mas onto the lobby: Cancel greys; bonk | — |
| 30.22 | `[CU]` | CU | 2 beats | 16:19.75 | the silent [CU] | — |
| 30.23 | `[ECU]` | ECU | 3 beats | 16:21.00 | the glass; "okay." | `a4-30-12` @ 1.8 |

**Sc 31 · the back wall · 16:22.88–16:40.38 · 28 beats (17.500 s) · 5 cuts**

| Shot | Tag | Size class (§4.7.3) | Length | In | What | Voiced (cue beat in the shot) |
|---|---|---|---|---|---|---|
| 31.01 | `[ECU]` | ECU | 1 bar + 3 beats | 16:22.88 | the Q* vault; the rail | — |
| 31.02 | `[MCU-2]` | MCU | 1 bar + 1 beat | 16:27.25 | the 50/50: What's in there? / preview; rack to the vault | `a4-31-01` @ 1.8; `a4-31-02` @ 3 |
| 31.03 | `[MCU]` | MCU | 2 bars | 16:30.38 | the memo | `a4-31-03` @ 1.8 |
| 31.04 | `[ECU]` | ECU | 1 bar | 16:35.38 | the screwdriver | — |
| 31.05 | `[W]` | W | 1 bar | 16:37.88 | the observer chair; the jangle | — |

**Scene targets, in short.** The cap is what the scene may grow to at the lock before the writer is asked:

| Sc | Target | Cap at the lock | What must not grow |
|---|---|---|---|
| 24 | 3.75 s | 5.0 s | — |
| 25 | 17.5 s (7 bars) | 20.0 s (+1 bar: the script's add-back 2) | The waltz's tape-stop lands on the JOIN click |
| 26 | 18.1 s | 20.0 s | The drop-out stays 5 beats; the `[CU]` stays 3 |
| 26A | 8.1 s | 9.4 s | D2's clearances |
| 27 | 71.25 s | 76 s | Read times for the card, the posts and the rails are the floor, not padding |
| 28 | 2.5 s | 2.5 s | — |
| 29 | 61.9 s | 67 s (+5 s: the avalanche's add-back 1) | Hearts stay 8 (L7); the quiet beat stays 3 beats |
| 30 | 48.75 s | 52 s | "good question." 1 beat late; the long hold 2 beats |
| 31 | 17.5 s | 19 s | The Q\* rail's read (4.3 s) |
| **Act** | **4:09.4** | **≈ 4:22** | — |

---

## 6. Sound and music: the temp-score brief

v2 had the dialogue track only, so every set-piece played as dead air. v3 is cut with sound. Everything here is also written into the script as `MUSIC:` and `SOUND:` calls. The cues are the OST bible's Act Four map ([OST-BIBLE §4.1](../../../../../audio/ost/OST-BIBLE.md#41-ep1-act-four-at-a-glance-the-spotting)), re-conformed to the new clock.

| Sc | Clock | Music (cue · in · out) | Sound |
|---|---|---|---|
| 24 | 12:31–12:35 | DARK ROOM, felt, 1 phrase (MM-07 `E01-S24`) · cut · cut, by the blueprint | The crane truck's grind and a dozen glass tings, pre-lapped a bar under sc 23's black *(build)* |
| 25 | 12:35–12:52 | BLUEPRINT waltz (MM-07 `E01-S25`), **re-conformed 18 → 7 bars**, thinned to pizzicato and celesta under NELEH's lines · out: a tape-stop on the JOIN click | `rubber_stamp_C` (the title, `VOTES: 0`); pencil strokes; `paper_flutter` (the fold); `paper_whip` (the tear) |
| 26 | 12:52–13:10 | LEVERAGE, low (MM-08 `E01-S26`), ≈ 9 s from the connect · hard stop on the Cancel click. Then no music: the drop-out, "super." and F1.2 | `dialog_ok_click` (Cancel) · **D6: digital silence, 5 beats** · `glyph_dissolve` · the phone's table buzz *(build)* brings the room back · `render_front_sweep` (F1.2) |
| 26A | 13:10–13:18 | DARK ROOM, a single felt (MM-08 `E01-S26A`), thinning to one note under the V.O. · out: the Rewind into sc 27's downbeat | Pen clip on wood, three strokes *(build)* · `orb_servo` · `tape_spinup` reversed (`rewinding…`) |
| 27 | 13:18–14:30 | PROCEDURE (MM-09 `E01-S27a–h`), **re-conformed to ≈ 71 s**: NELEH's pizzicato; **dry for 1 bar each side of the candor card and under every real line**; the pizzicato locks to the phones' buzz in the committee; Mario's quartet at the lighthouse; Tasya's Rhodes, one step, on the door | Laptop speaker "super."; a pencil tick per step *(build)*; `keycap_popcorn`; `heart_gliss` stacking; the table buzz and a phone's clack *(build)*; the speakerphone's four tones *(build)*; a throne thunk *(build)*; the hourglass flip; the key ring *(build)* |
| 28 | 14:30–14:32 | OUTS · REVERSAL (MM-09x `E01-S28`) on the downbeat | — |
| 29 | 14:32–15:14 | Mostly dry: the hearts' ticks are the rhythm. DARK ROOM, one felt line (MM-10 `E01-S29a`), from the Orb on the lanyard through "mostly."; the Build (Gerg's chip arpeggio) under his tile, **stopping when he looks up**; **no music** in the quiet beat, the D8 line or "Everyone is welcome." | Heart *tick* ×8 on the beat *(build, or `post_click`)* · `orb_servo` · `odometer_ratchet` (the counter's clunk) · the Orb's chime · the rack slot's whir *(build)* · keys (`key_tap_soft_*`) |
| 29 | 15:14–15:34 | SET-PIECE SWING (MM-10 `E01-S29b`), **re-conformed 16 → 8 bars**: the episode's one full band · **a dead stop on MADA's label** | A held *thock* per tile landing *(build)*; NELEH's footnotes scatter |
| 30 | 15:34–16:23 | MM-11 `E01-S30a–e`, re-conformed to ≈ 49 s: STRAIGHT violin under Alyi's post only, stopping dead on the first heart → room tone → Tasya's Rhodes floor after her line → silence under the calm-off's chaos → the Build restarts on Gerg's post (VICTORY LAP) → a brass stab on the sign → the flat line → the felt cadence under "okay." | `heart_gliss`, off the grid ×3 · palette-step hits on "below / above / around" · the key ring *(build)* · `flame_whoomph` (the fires) · the door bang · the freeze hit (`freeze_hit_F`) · the pin *(build)* · `steam_hiss` (the extinguisher) · `rubber_stamp_C` (the term sheet) · `hourglass_shatter` · `alert_bonk` |
| 31 | 16:23–16:40 | The vault's hum on F becomes the root (GLYPH, diegetic; MM-12 is B2, so `server_hum` pitched to F is the temp) · **none under the memo** · the key ring on the chair | The vault hum; four screws, one per beat; the chair unfolding; the jangle |

- **Not on the SFX board yet** (`audio/sfx/manifest.json`), marked *(build)* above: the crane truck and glass tings, a phone's table buzz, a phone's clack off a table, the key ring's jangle, the throne thunk, the rack slot's whir, a pencil tick, the tile *thock*, the speakerphone's tones, pen on wood and the pin.
- **MM-02 (the 1-bar D5 insert) isn't used in Ep1 any more.** Hold it for D5's debut.
- **No stings or swells under any V.O. line, and no music under any real line or card.**

---

## 7. Shots and assets

**Grammar.** 3.2 is tagged in [pov-and-framing §4.7](../../../../bible/pov-and-framing.md#47-shot-variety-2026-09-25)'s ladder and matched to [framing-v3](history/framing-v3.md) wherever a 3.1 shot survives. Framing-v3 was drawn on 3.1's 139 shots: re-map it onto these 114. Where they disagree on size or angle, framing-v3 decides; the two open differences are in §8, ruling 6.

**Measured against §4.7.4, from the beat model:**

| Measure | 3.2 | Band |
|---|---|---|
| Boxed windows | 1 shot, the doorway `[P2]` (deliberate, logged `BOX`) · 2.5% | GREEN |
| Spoken lines in a box | 1 (Alyi's post) | GREEN |
| `[MCU]` + `[CU]` | 19.0% | AMBER, a beat under 20%: about 40% of the act is the record and screens |
| `[M]` + `[2S]` + `[OTS]` | 12.5% | GREEN |
| Runs of 3+ shots of one size | 0 | GREEN |
| Faces and hands | ≈ 48% (≈ 53% counting half-frame tiles) | AMBER, as ruled for this act |

**The helpers** (§4.7.5; they're already on framing-v3's list for the engine owner) cost no new drawings: the frameless bust (`[MCU]`, `[MCU·PF]`, `[MCU-2]`, `[MCU·door]`), the `[OTS]` shoulder, the soft layer and rack, and the whip.
- Mas's silhouette serves 26.09, 30.13 and 30.21. NELEH's serves 27.14.
- The tall busts for day rooms follow framing-v3: Mas, Gerg, Tasya and Alyi (framing-v3 §6). RIMA plays in her spotlight's dark and MARIO at night, so both use the helper.

**To build, or to change, for 3.2:**
- **THE PLAN (sc 25):**
  - the new title
  - the key ring's hopeful jangle, and the `VOTES: 0` stamp landing on it
  - the moth's flight out of the empty equity box
  - the path showing only `1. NOON · VIDEO CALL`, with a folded lower edge that curls to show the neon
  - the `[GFX·detail]` cut-ins (linework at 2× coordinates, as framing-v3's `BP-SIZES`)
- **The blueprint on their table** (27.03, 27.11, 27.30, and the table in 27.13): steps 1–4, the three ticks (step 1 on the call, step 2 on the card, step 3 heard off picture), and the `?`. The table overheads are framing-v3's `HIGH-TABLE`; NELEH's hand and pen are an inserts-hands drawing.
- **MADA's tile label** (29.30): call UI, `MADA · LAST FIRER STANDING · ANSWERS GIVEN: 0`, flipping in on the downbeat. This replaces his name card.
- **Plates:** RIMA's lower third (27.05c) and TTEMME's riding the wide (27.25).
- **Shared with framing-v3's build list:** the table overheads, the floor from above (30.06b), the lobby from low (30.19), the hourglass at insert scale for the desk-level shot (27.27), the doorway jambs (27.08, 27.29), the call's two-up (27.05b), the pinned speaker view (26.02) and the half-frame tiles (29.23–29.30).

**No longer needed** (against v2 and framing-v3):
- the MAS'S VERSION matching frame and its six-fingered variant
- the Senate wallet `[ECU]`
- the shut conference-door `[ECU]`
- sc 24's close-up (the glow turns to blueprint on the hand)
- the separate frozen-feed `[POV]` in sc 26 (it's inside the `[OTS]` laptop)
- the sc 31 walk `[W]` and the sticky-note insert (the note reads in the 50/50)
- the name-card layouts for RIMA, ADELINA, TTEMME and MADA
- framing-v3's bullpen-ceiling low angle (the landlord is one wide)
- the `THE LETTER`, `THAT NIGHT`, `NOV 19 · NIGHT` and return `NOV 20` rail type-ons

**Net.** 139 cuts become 114. Framing-v3's plan on 3.1 ran to 147. The visual-event count falls with the cut shots and holds, and that pays for the helpers and the angle plates. THE EDITOR recounts at the re-board.

---

## 8. Open rulings that could change the board (defaults in brackets)

These are the script's rulings 1–9 (Writer's notes, Act Four 3.2).
1. THE PLAN's new title and the fold. [As written.]
2. THE PLAN voiced by NELEH, not by V.O. [As written.]
3. D2 at ≈ 2:45 after sc 18's D2. [Keep. If it's ruled strictly, 26A plays without `a4-26a-vo1`: 26A.01 then runs 6 beats of carving under the felt, with no length change.]
4. The candor card in pass one. [As written. The fallback puts it back in sc 26 after "super.": +2 bars there, and 26A's V.O. moves 4 bars clear, ≈ +5 s.]
5. The doorway `[P2]` as the act's one deliberate box. [As written; framing-v3's call.]
6. **Framing-v3 against 3.2.** Two differences to settle:
   - "super." is one `[OTS]` onto the freezing feed in 3.2; framing-v3 has an `[MCU]`, then the grid.
   - The landlord is one wide in 3.2, because a real line plays whole on one shot (§4.7.3 rule 8); framing-v3 splits it across three shots.

   [3.2's staging, pending the cinematographer.]
7. The V.O. pace, ×1.05–1.10 of his on-camera read, 130–140 wpm. [Adopt. If it's refused, the V.O. re-takes at v2's ratio, which adds ≈ +0.3 s a line, inside the §5 caps.]
8. Quiet beats at 3 beats. [As written.]
9. The episode's length. [A room ruling. Don't pad the act to fill it.]
