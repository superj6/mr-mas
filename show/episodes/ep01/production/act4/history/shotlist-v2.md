# MR. MAS · Ep1 · Act Four · THE BLIP, TOLD TWICE — shot list v2 (draft 3.1)

*Storyboard / 1st AD · board 2 · from [script.md](../../script.md#act-four--the-blip-told-twice) Act Four **draft 3.1** and [pov-changes.md](pov-changes.md) (every open ruling at its default), 2026-09-25. Machine-readable twin: [shots-v2.json](shots-v2.json) (the JSON wins if the two ever disagree). Generator: `studio/src/episodes/ep01/act4/board/tools/board_v2.py (re-run after a re-record or a ruling; don't hand-edit the outputs)`. Board 1 ([shotlist.md](shotlist.md), draft 2) is superseded.*

## Read this first

- **Length.** 10875 f = **7:33.12** · episode 12:31:00–20:04:03 · **139 shots** · 12 chunks. The printed draft-3.1 clock is 7:12.8 (10,387 f); the board runs **+20.33 s** because it is sized to the **recorded** lines (the lock's house rules) and to read time. That is **inside the 7:14 ± 0:20 band** (6:54–7:34) with 0.88 s to spare: the writer's synthetic-voice allowance case. Scenes 24–26A sit exactly on the printed clock.
- **Against board 1** (118 shots, 7:14 of draft 2): 36 shots carried unchanged, 91 carried with a change (reframe / retag / retime / reorder / split / changed), 12 new; 4 board-1 shots cut outright (27.34, 29.02, 29.09, 30.19) and the draft-3 shots 3.1 cuts are gone (the eyelines, the doorway [M], the thumb insert, Gerg-leaves). Full crosswalk below.
- **Shot-size shares vs the bible** (§4.2): faces + hands **49.6%** (AMBER; ruling 5 accepts it; 55.1% without THE PLAN) · wides **11.5%** (GREEN, target 10–15%) · [POV] + [SCR] 21.4% · [GFX] 12.8% · prop inserts with no hand 4.7%. Inside faces + hands: [M] + [2S] 9.7% (LOW vs 15–20%), the portrait family 29.2% (vs 30–35%), [CU] 1.1%, [ECU] 8.1%.
- **V.O.** 5 lines, 11.58 s; every one starts on a beat, ends ≥ 1 beat before a cut or line, and sits ≥ 1 bar from the record. **Three are new reads** (sized by estimate): `a4-26a-vo1`, `a4-29-vo1`, `a4-29-vo2`. No V.O. in sc 26, pass one or the return.
- **Assets.** 43 exist (built by the prep), 6 reuse, 5 need a new option, 3 need a check, 2 salvage, **34 new** (the close tier: Mas's [CU] + eyes, 7 hand drawings, 4 medium rigs + the Orb's, 2 medium plates, 3 expression swaps, the post-ui and cards kits, 5 insert-scale props / plates, 2 engine helpers, the piano). Parallel stages had started `cast/mas-cu.ts` and `cast/mas-medium.ts` while this board was drawn.
- **Board calls** a reviewer should look at first: 29.00 (the HIS SIDE rail on the home shot), 29.01 / 29.08 / 30.26 (+2, +2, +1 beats for read time), 27.20 (Mario in the left window), 26.04c→26.05 (the click on the cut: D6 = exactly 2½ bars). All in [Board calls](#board-calls-rulings-and-flags).

## How to read this

| shotSize | Tag | Meaning |
|---|---|---|
| **WIDE** | `[W]` | the room wide: 480x203 + the rail band, adults 70-90 px. Also any TIGHTER PLATE OF A ROOM (pov-changes: tags). A new room ≤ 1 bar; the physical gag; the set-piece scale. |
| **MEDIUM** | `[M]` | a principal's waist-up RIG and nothing else (head ≈ 32-40 px, Mas in the left third). Medium rigs: Mas, the Orb, NELEH, MADA (+ GERG as a medium tile). |
| **TWO-SHOT** | `[2S]` | two figures at medium scale under one key light (the Orb at this scale is a sphere and an iris). Medium plates: the dark-room desk, the boardroom table. |
| **PORTRAIT** | `[P]` `[P2]` | the approved 112x136 windows over the held room: MAS LEFT (x12 y24), the other RIGHT (x356 y24). In pass one everyone speaks from the right. |
| **FALLAWAY** | `[PF]` | a portrait window with the room's key stepped down behind it (resolve() with the key near zero, or one family step ≤ 2 beats). The room steps down; the face is never relit. |
| **CLOSE-UP** | `[CU]` | Mas full frame, head ≈ 140 px: ONE silent drawing, two uses (26.05a, 30.25); the backdrop carries the light. |
| **INSERT-HANDS** | `[ECU]` | Mas's hands/eyes kit: his hands, the eyes strip (480x64), MAS'S VERSION's matching frame. Counts as faces+hands. |
| **INSERT-PROP** | `[ECU]` (prop) | a prop insert: an object, with or without someone's hand (hand_in_frame). Counts as faces+hands ONLY with a hand in frame. |
| **UI-TILE-GRID** | `[POV]` `[SCR]` | his screen full-bleed / [SCR] a screen with its bezel (the world's view): grids, feeds, the monitor, the security tile. A video tile that fills ≥ half the frame counts as a face (face_frames). |
| **BLUEPRINT** | `[GFX]` | THE PLAN: full 480x270, no rail. |
| **CARD** | `[GFX]` / CARD | full-screen dated quote cards and the act-out card; NAME CARDS ride a live shot and log as the shot they ride (rides). |

- **side** (told-twice labels): **BOARD** = pass one, sc 27 (the exit; its rail names the side); **MAS** = everything else, his POV (pass two's rail ends `· HIS SIDE`).
- **vo**: the shot's `MAS (V.O.)` lines with device, frames and status. **Change** codes: **CARRY** unchanged from board 1 (content carried by v1_id; the length may differ where the recorded lines set it: compare v1_frames) · **CHANGED** same framing, different action or text · **REFRAME** same beat, a different size or framing · **RETAG** the same drawing under the correct tag · **RETIME** a new length · **REORDER** moved · **SPLIT** board 1's multi-line shot cut per line (single windows) · **NEW** a shot board 1 never had (3.1 adds, or draft 3's never-boarded shots).
- **Logging** (pov-and-framing §4.2, pov-changes §6): A [W] with a portrait window open logs as [P] only while a line is typing in it (face_frames). A name card logs as the shot it rides (rides). A prop insert without a hand isn't a face or a hand. [M] and [2S] are logged apart from [PF], [CU] and [ECU]. A video tile counts as a face only when it fills ≥ half the frame (Gerg's tile; the half-frame beats in the avalanche).
- **Sizing.** Printed bar / beat counts are kept. Dialogue shots without a printed length: lead 4 f + the recorded line(s) + gaps 8 f + HOLDs + tail 8 f (a punchline 15 f), rounded up to the beat. Posts hold their read time + 1 beat. Every cut on the act's beat grid (act frame 0 = 12:31:00). Scenes 24-26A sit exactly on 3.1's printed clock; from sc 27 the recorded lines set the length and the grid is kept.
- **Mas stays in the left third, three-quarter, at every size; the other character on the right.** Lighting notes step the ROOM down; no face is relit (ruling 7).
- BASE is the show. Tagged switches only: [BLUEPRINT] flash-print on 24.03's last beat → 25.07; [GLYPH] 20 f in 26.05 (use 2 of 2); [EARLY-WEB16] 26.11 f6 → 26.13 (F1.2); [2-TONE FREEZE] on the six Blip cards (Mas never freezes). MAS'S VERSION is a stillness flag, not a switch.
- Dropped from board 1's legend: "a 'medium' is a tighter authored plate of the same room" (a tighter plate is `[W]`; `[M]` is a principal's rig) and "the BOARD holds the left window" in pass one.

## The act at a glance

| Sc | Heading | Side | Printed 3.1 | Boarded | Frames (printed) | Δ | Shots |
|---|---|---|---|---|---|---|---|
| 24 | INT. LAS VEGAS HOTEL SUITE — DAY | MAS | 12:31–12:36 (2 bars) | 12:31:00–12:36:00 | 120 (120) | +0 f (+0.00 s) | 24.01–24.03 (3) |
| 25 | THE PLAN | MAS | 12:36–13:21 (18 bars: 3 · 7 · 5 · 3) | 12:36:00–13:21:00 | 1080 (1080) | +0 f (+0.00 s) | 25.01–25.08 (8) |
| 26 | SAME — THE FALLING TILE | MAS | 13:21–14:13.5 (21 bars: 4 · 4 · 4 · 4 · card 2 · 3) | 13:21:00–14:13:12 | 1260 (1260) | +0 f (+0.00 s) | 26.01–26.13 (18) |
| 26A | INT. MAS'S DARK ROOM — THAT NIGHT | MAS | 14:13.5–14:33.5 (8 bars) | 14:13:12–14:33:12 | 480 (480) | +0 f (+0.00 s) | 26A.01–26A.06 (6) |
| 27 | THE FIVE DAYS, PASS ONE: THE BOARD'S SIDE | BOARD | 14:33.5–16:24.5 (≈ 44½ bars) | 14:33:12–16:34:18 | 2910 (2664) | +246 f (+10.25 s) | 27.01–27.36 (45) |
| 28 | CARD · INTERNAL ACT-OUT | MAS | 16:24.5–16:27.6 (1 bar + 1 beat) | 16:34:18–16:37:21 | 75 (74) | +1 f (+0.04 s) | 28.01–28.01 (1) |
| 29 | THE FIVE DAYS, PASS TWO: HIS SIDE | MAS | 16:27.6–17:59.9 (pre-avalanche ≈ 52 s + the 16-bar avalanche) | 16:37:21–18:16:00 | 2355 (2216) | +139 f (+5.79 s) | 29.00–29.20 (28) |
| 30 | THE RETURN | MAS | 17:59.9–19:16.8 (≈ 77 s) | 18:16:00–19:35:09 | 1905 (1845) | +60 f (+2.50 s) | 30.01–30.26 (23) |
| 31 | INT. NOPEAI BULLPEN — BACK WALL — DAY | MAS | 19:16.8–19:43.8 (≈ 27 s) | 19:35:09–20:04:03 | 690 (648) | +42 f (+1.75 s) | 31.01–31.09 (7) |
| **Act** | | | 12:31–19:43.8 (7:12.8) | 12:31:00–20:04:03 | **10875** (10387) | **+488 f (+20.33 s)** | **139** |

**Shot mix:** WIDE 16 · INSERT-HANDS 9 · FALLAWAY 9 · BLUEPRINT 7 · UI-TILE-GRID 27 · CARD 9 · CLOSE-UP 2 · PORTRAIT 33 · INSERT-PROP 12 · TWO-SHOT 14 · MEDIUM 1. **Visual events** ≈ 451 (board 1: 407).

## Shot-size shares vs the bible

Time-weighted over the act's 139 cuts, logged by the §4.2 rules (a name card as the shot it rides; a `[W]` with a window typing a line as `[P]` for those frames; a video tile as a face only when it fills half the frame; a prop insert only with a hand).

| Tier | Frames | Seconds | Share | Bible target | Verdict |
|---|---|---|---|---|---|
| `[W]` wides | 1252 | 52.2 | **11.5%** | 10–15% (AMBER 15–20%, RED > 20%) | GREEN |
| **Faces + hands** (`[M]` `[2S]` `[P]` `[P2]` `[PF]` `[CU]` `[ECU]`) | 5393 | 224.7 | **49.6%** | ≥ 55% (AMBER 45–55%, RED < 45%) | AMBER |
| `[POV]` + `[SCR]` | 2325 | 96.9 | **21.4%** | 12–18% (—) | HIGH |
| `[GFX]` (THE PLAN, quote cards, the act-out card) | 1395 | 58.1 | **12.8%** | 8–10% (—) | HIGH |
| Prop inserts with no hand | 510 | 21.2 | **4.7%** | — (prop inserts without a hand are neither a face nor a hand (pov-changes §6)) | — |

| Inside faces + hands | Frames | Seconds | Share of the act | Target | |
|---|---|---|---|---|---|
| `[M]` + `[2S]` | 1050 | 43.8 | 9.7% | 15–20% | LOW |
| Portrait family `[P]` `[P2]` `[PF]` (+ name cards riding them, + a `[W]` window while it types) | 3173 | 132.2 | 29.2% | 30–35% | LOW |
| `[CU]` | 120 | 5.0 | 1.1% | ≤ 2% | IN |
| `[ECU]` hands, eyes, prop inserts with a hand | 885 | 36.9 | 8.1% | 6–9% | IN |
| Video tiles ≥ half frame (Gerg; the avalanche's half-frame beats) | 165 | 6.9 | 1.5% | — | — |
| (of which: name cards riding a face) | 120 | 5.0 | 1.1% | — | — |

- **Variants:** faces + hands without THE PLAN **55.1%** (wides 12.8%); if the glass home shot and the no-hand prop inserts were counted, 54.3%; without the video-tile faces, 48.1%.
- **Against the changelog's projection** (faces + hands ≈ 47–48%, `[W]` ≈ 13%, `[POV]` + `[SCR]` ≈ 23%, `[GFX]` ≈ 13%): the board measures 49.6% / 11.5% / 21.4% / 12.8%. The gain is the recorded dialogue: portrait shots grew with the real line lengths. Still **AMBER** (45–55%): ruling 5 accepts it; the other acts must run ≈ 58–60% faces for the episode to reach 55%.
- **`[M]` + `[2S]` is LOW (9.7%)** by design: 3.1 keeps mediums to principals in home rooms (5 rigs, 2 plates). Moving more beats into the tier would mean rigs the changelog just cut.
- **By scene** (the I-mode rule asks faces ≥ 65% and `[W]` ≤ 10% of played scenes; set-pieces may run `[W]` 50–70% with a face every 8 bars):

| Sc | Frames | Faces + hands | `[W]` |
|---|---|---|---|
| 24 | 120 | 50.0% | 50.0% |
| 25 | 1080 | 5.6% | 0.0% |
| 26 | 1260 | 33.3% | 14.3% |
| 26A | 480 | 62.5% | 0.0% |
| 27 | 2910 | 66.5% | 8.8% |
| 28 | 75 | 0.0% | 0.0% |
| 29 | 2355 | 48.4% | 0.0% |
| 30 | 1905 | 57.9% | 30.3% |
| 31 | 690 | 54.3% | 26.1% |
| 29 (pre-avalanche) | 1395 | 75.3% | 0.0% |

  Pass one (27: 66.5%) and pass two before the avalanche (75.3%) clear 65%. 26A (62.5%) is held down by the 9:32 post and the wallet (both record, no hand). Sc 30's wides are the landlord set-piece; sc 31's are the vault walk and the observer chair (each the beat's one wide).
- **Longest runs without a face:** 25.01–25.07 17.0 bars; 26.08–26.13 7.0 bars; 29.05–29.07 5.25 bars; 29.16–29.17 5.0 bars; 27.09–27.10 4.25 bars. Only THE PLAN (17 bars, the show's voice by design) exceeds the 8-bar set-piece rule.

## What changed from board 1

| Change | Shots |
|---|---|
| CARRY | 36: 24.01, 25.01, 25.02, 25.03, 25.04, 25.05, 25.06, 25.07, 26.02, 26.07, 26.09, 26.10, 27.01a, 27.02, 27.09, 27.10, 27.17, 27.21, 27.26, 27.28, 27.29, 27.31, 27.33, 28.01, 29.14, 29.15, 29.16, 29.19, 29.20, 30.04, 30.05, 30.06, 30.07, 30.12, 30.15, 30.16 |
| REORDER | 6: 24.02, 29.10, 29.10a, 29.05, 29.06, 29.11c |
| REFRAME | 30: 24.03, 26.06, 27.03, 27.08, 27.11, 27.13, 27.14b, 27.18, 27.20, 27.22, 27.23, 27.24, 27.30, 27.32, 27.36, 29.03, 29.07, 29.11, 29.12, 30.01, 30.09, 30.13, 30.14, 30.17, 30.20, 30.25, 31.01, 31.02, 31.03, 31.08 |
| CHANGED | 23: 25.08, 26.02a, 26.04, 26.08, 26A.01, 26A.02, 26A.05, 27.01, 27.04, 27.07, 27.16, 27.19, 27.35, 29.01, 29.01a, 29.04, 29.08, 29.12q, 29.17a, 30.10, 30.11, 30.22, 31.07 |
| RETIME | 16: 26.01, 26.03, 26.05, 26.05a, 26.11, 26.12, 26.13, 26A.03, 26A.04, 27.27, 29.13, 29.17, 29.18, 30.24, 30.26, 31.06 |
| NEW | 12: 26.04a, 26.04b, 26.04c, 26A.06, 27.05c, 27.07a, 27.12d, 27.15, 29.00, 29.07a, 29.12r, 30.20a |
| SPLIT | 11: 27.05, 27.05a, 27.05b, 27.12, 27.12a, 27.12b, 27.12c, 27.14, 27.14a, 29.11a, 29.11b |
| RETAG | 5: 27.06, 30.08, 30.21, 30.23, 31.09 |

**Cut** (board 1 and draft-3 shots that 3.1 removes or folds):

- `27.34` (3.1 cut (board 1 + draft 3)): the desks insert (a desk for every employee, already labelled): −3 beats; Tasya's real line lands straight on the [2S] 27.35.
- `29.02` (3.1 cut (board 1 + draft 3)): Rima's full-bleed [POV] post (−1 bar): folded into the true [ECU] 29.03, legible on the face-up phone.
- `29.13a, 29.13b, 29.13c` (3.1 cut (draft 3)): the three eyelines before 'leave it open.' (−3 beats): visible calculation at a real event.
- `30.01 [M], 30.02 [ECU]` (3.1 cut (draft 3)): the doorway [M] and the thumb-hearting [ECU] (−6 beats): the hearts rise out of his window in the [P2] 30.01.
- `30.19` (3.1 cut (board 1 + draft 3)): the new-board wide (TERB, THE OTHER YRRAL and MADA take their seats; chair_sit ×3): −1 bar.
- `31.04 [M]` (3.1 cut (draft 3)): Gerg-leaves: he looks at the note, nods and his window closes inside the [P2] 31.03; the hum is sound only.
- `27.15` (board-1 fold): board 1's laptop-on-the-chair insert: the still black tile plays in the [2S] 27.14b.
- `29.09` (board-1 fold): board 1's check-front insert (and draft 3's V.O. over it): the front reads in the delivery [2S] 29.08; the V.O. moved to the lanyard.
- `31.04, 31.05` (board-1 fold): board 1's sticky-note insert and Gerg's walk-on wide: the note reads in the vault insert 31.01, the exit plays in the [P2] 31.03.
- `30.22 walk-in` (3.1 action cut): Mas's 4-drawing lobby walk-in (he is already at the reception desk).

<details><summary>Crosswalk: every board-1 shot → board 2</summary>

| v1 | v1 framing | v1 f | → v2 | v2 shotSize | fate |
|---|---|---|---|---|---|
| 24.01 | ROOM-WIDE | 60 | 24.01 | WIDE | CARRY |
| 24.02 | INSERT | 60 | 24.02 | INSERT-HANDS | CHANGED |
| 25.01 | BLUEPRINT | 180 | 25.01 | BLUEPRINT | CARRY |
| 25.02 | BLUEPRINT | 240 | 25.02 | BLUEPRINT | CARRY |
| 25.03 | BLUEPRINT | 180 | 25.03 | BLUEPRINT | CARRY |
| 25.04 | BLUEPRINT | 180 | 25.04 | BLUEPRINT | CARRY |
| 25.05 | BLUEPRINT | 120 | 25.05 | BLUEPRINT | CARRY |
| 25.06 | BLUEPRINT | 60 | 25.06 | BLUEPRINT | CARRY |
| 25.07 | BLUEPRINT | 60 | 25.07 | BLUEPRINT | CARRY |
| 25.08 | INSERT | 60 | 25.08 | INSERT-HANDS | CHANGED |
| 26.01 | UI-TILE-GRID | 180 | 26.01 | UI-TILE-GRID | CHANGED |
| 26.02 | CARD | 60 | 26.02 | CARD | CARRY |
| 26.03 | UI-TILE-GRID | 90 | 26.03 | UI-TILE-GRID | CHANGED |
| 26.04 | UI-TILE-GRID | 150 | 26.04, 26.04b, 26.04c | UI-TILE-GRID | CHANGED |
| 26.05 | UI-TILE-GRID | 240 | 26.05 | UI-TILE-GRID | CHANGED |
| 26.06 | INSERT | 60 | 26.06 | INSERT-HANDS | CHANGED |
| 26.07 | PORTRAIT | 60 | 26.07 | PORTRAIT | CARRY |
| 26.08 | UI-TILE-GRID | 60 | 26.08 | UI-TILE-GRID | CHANGED |
| 26.09 | ROOM-WIDE | 60 | 26.09 | WIDE | CARRY |
| 26.10 | CARD | 120 | 26.10 | CARD | CARRY |
| 26.11 | UI-TILE-GRID | 60 | 26.11 | UI-TILE-GRID | CHANGED |
| 26.12 | ROOM-WIDE | 135 | 26.12 | WIDE | CHANGED |
| 26.13 | INSERT | 45 | 26.13 | INSERT-PROP | CHANGED |
| 26A.01 | INSERT | 120 | 26A.01 | INSERT-HANDS | CHANGED |
| 26A.02 | ROOM-WIDE | 60 | 26A.02 | TWO-SHOT | CHANGED |
| 26A.03 | INSERT | 165 | 26A.03 | UI-TILE-GRID | CHANGED |
| 26A.04 | INSERT | 15 | 26A.04 | INSERT-PROP | CHANGED |
| 27.01 | UI-TILE-GRID | 75 | 27.01a | UI-TILE-GRID | CARRY |
| 27.02 | UI-TILE-GRID | 60 | 27.02 | UI-TILE-GRID | CARRY |
| 27.03 | UI-TILE-GRID | 45 | 27.03 | PORTRAIT | CHANGED |
| 27.04 | CARD | 60 | 27.04 | CARD | CHANGED |
| 27.05 | TWO-PORTRAIT | 135 | 27.05, 27.05a, 27.05b | PORTRAIT | CHANGED |
| 27.06 | ROOM-WIDE | 60 | 27.06 | WIDE | CHANGED |
| 27.07 | PORTRAIT | 90 | 27.07 | PORTRAIT | CHANGED |
| 27.08 | ROOM-WIDE | 45 | 27.07a, 27.08 | PORTRAIT, WIDE | CHANGED |
| 27.09 | UI-TILE-GRID | 120 | 27.09 | UI-TILE-GRID | CARRY |
| 27.10 | UI-TILE-GRID | 135 | 27.10 | UI-TILE-GRID | CARRY |
| 27.11 | ROOM-WIDE | 60 | 27.11 | TWO-SHOT | CHANGED |
| 27.12 | TWO-PORTRAIT | 240 | 27.12, 27.12a, 27.12b, 27.12c | PORTRAIT | CHANGED |
| 27.13 | ROOM-WIDE | 60 | 27.13 | TWO-SHOT | CHANGED |
| 27.14 | TWO-PORTRAIT | 150 | 27.14, 27.14a, 27.14b | PORTRAIT, TWO-SHOT | CHANGED |
| 27.15 | INSERT | 30 | 27.14b | TWO-SHOT | CHANGED |
| 27.16 | INSERT | 60 | 27.16 | INSERT-PROP | CHANGED |
| 27.17 | ROOM-WIDE | 60 | 27.17 | WIDE | CARRY |
| 27.18 | ROOM-WIDE | 75 | 27.18 | INSERT-PROP | CHANGED |
| 27.19 | PORTRAIT | 60 | 27.19 | PORTRAIT | CHANGED |
| 27.20 | ROOM-WIDE | 30 | 27.20 | PORTRAIT | CHANGED |
| 27.21 | CARD | 60 | 27.21 | CARD | CARRY |
| 27.22 | PORTRAIT | 60 | 27.22 | PORTRAIT | CHANGED |
| 27.23 | INSERT | 30 | 27.23 | INSERT-PROP | CHANGED |
| 27.24 | ROOM-WIDE | 60 | 27.24 | PORTRAIT | CHANGED |
| 27.25 | PORTRAIT | 90 | 27.24 | PORTRAIT | CHANGED |
| 27.26 | UI-TILE-GRID | 120 | 27.26 | UI-TILE-GRID | CARRY |
| 27.27 | ROOM-WIDE | 45 | 27.27 | WIDE | CHANGED |
| 27.28 | CARD | 60 | 27.28 | CARD | CARRY |
| 27.29 | PORTRAIT | 60 | 27.29 | PORTRAIT | CARRY |
| 27.30 | INSERT | 45 | 27.30 | INSERT-PROP | CHANGED |
| 27.31 | PORTRAIT | 60 | 27.31 | PORTRAIT | CARRY |
| 27.32 | ROOM-WIDE | 75 | 27.32 | TWO-SHOT | CHANGED |
| 27.33 | PORTRAIT | 75 | 27.33 | PORTRAIT | CARRY |
| 27.34 | INSERT | 45 | — | — | CUT |
| 27.35 | INSERT | 30 | 27.35 | TWO-SHOT | CHANGED |
| 27.36 | TWO-PORTRAIT | 75 | 27.36 | TWO-SHOT | CHANGED |
| 28.01 | CARD | 75 | 28.01 | CARD | CARRY |
| 29.01 | ROOM-WIDE | 45 | 29.01 | TWO-SHOT | CHANGED |
| 29.02 | INSERT | 60 | 29.03 | INSERT-HANDS | CHANGED |
| 29.03 | INSERT | 120 | 29.03 | INSERT-HANDS | CHANGED |
| 29.04 | ROOM-WIDE | 60 | 29.04 | TWO-SHOT | CHANGED |
| 29.05 | INSERT | 75 | 29.05 | UI-TILE-GRID | CHANGED |
| 29.06 | CARD | 180 | 29.06 | CARD | CHANGED |
| 29.07 | ROOM-WIDE | 120 | 29.07, 29.07a | PORTRAIT, UI-TILE-GRID | CHANGED |
| 29.08 | ROOM-WIDE | 60 | 29.08 | TWO-SHOT | CHANGED |
| 29.09 | INSERT | 75 | 29.08 | TWO-SHOT | CHANGED |
| 29.10 | TWO-PORTRAIT | 90 | 29.10, 29.10a | PORTRAIT, TWO-SHOT | CHANGED |
| 29.11 | TWO-PORTRAIT | 150 | 29.11, 29.11a, 29.11b | PORTRAIT, UI-TILE-GRID | CHANGED |
| 29.12 | ROOM-WIDE | 75 | 29.12 | TWO-SHOT | CHANGED |
| 29.13 | PORTRAIT | 90 | 29.13 | PORTRAIT | CHANGED |
| 29.14 | UI-TILE-GRID | 240 | 29.14 | UI-TILE-GRID | CARRY |
| 29.15 | UI-TILE-GRID | 120 | 29.15 | UI-TILE-GRID | CARRY |
| 29.16 | UI-TILE-GRID | 120 | 29.16 | UI-TILE-GRID | CARRY |
| 29.17 | UI-TILE-GRID | 240 | 29.17 | UI-TILE-GRID | CHANGED |
| 29.18 | UI-TILE-GRID | 120 | 29.18 | UI-TILE-GRID | CHANGED |
| 29.19 | CARD | 60 | 29.19 | CARD | CARRY |
| 29.20 | UI-TILE-GRID | 60 | 29.20 | UI-TILE-GRID | CARRY |
| 30.01 | ROOM-WIDE | 45 | 30.01 | PORTRAIT | CHANGED |
| 30.02 | PORTRAIT | 135 | 30.01 | PORTRAIT | CHANGED |
| 30.03 | ROOM-WIDE | 90 | 30.01 | PORTRAIT | CHANGED |
| 30.04 | ROOM-WIDE | 45 | 30.04 | WIDE | CARRY |
| 30.05 | ROOM-WIDE | 120 | 30.05 | WIDE | CARRY |
| 30.06 | ROOM-WIDE | 120 | 30.06 | WIDE | CARRY |
| 30.07 | ROOM-WIDE | 120 | 30.07 | WIDE | CARRY |
| 30.08 | PORTRAIT | 120 | 30.08 | FALLAWAY | CHANGED |
| 30.09 | ROOM-WIDE | 45 | 30.09 | MEDIUM | CHANGED |
| 30.10 | ROOM-WIDE | 45 | 30.10 | WIDE | CHANGED |
| 30.11 | CARD | 90 | 30.11 | CARD | CHANGED |
| 30.12 | INSERT | 30 | 30.12 | INSERT-HANDS | CARRY |
| 30.13 | PORTRAIT | 90 | 30.13 | PORTRAIT | CHANGED |
| 30.14 | ROOM-WIDE | 120 | 30.14 | TWO-SHOT | CHANGED |
| 30.15 | PORTRAIT | 45 | 30.15 | PORTRAIT | CARRY |
| 30.16 | PORTRAIT | 60 | 30.16 | PORTRAIT | CARRY |
| 30.17 | TWO-PORTRAIT | 60 | 30.17 | TWO-SHOT | CHANGED |
| 30.18 | ROOM-WIDE | 60 | 30.17 | TWO-SHOT | CHANGED |
| 30.19 | ROOM-WIDE | 60 | — | — | CUT |
| 30.20 | INSERT | 75 | 30.20 | UI-TILE-GRID | CHANGED |
| 30.21 | INSERT | 135 | 30.21 | INSERT-PROP | CHANGED |
| 30.22 | ROOM-WIDE | 90 | 30.22 | WIDE | CHANGED |
| 30.23 | INSERT | 45 | 30.23 | INSERT-PROP | CHANGED |
| 30.24 | ROOM-WIDE | 120 | 30.24 | WIDE | CHANGED |
| 30.25 | PORTRAIT | 45 | 30.25 | CLOSE-UP | CHANGED |
| 31.01 | ROOM-WIDE | 105 | 31.01, 31.02 | INSERT-PROP, WIDE | CHANGED |
| 31.02 | ROOM-WIDE | 45 | 31.02 | WIDE | CHANGED |
| 31.03 | TWO-PORTRAIT | 75 | 31.03 | PORTRAIT | CHANGED |
| 31.04 | INSERT | 45 | 31.03 | PORTRAIT | CHANGED |
| 31.05 | ROOM-WIDE | 45 | 31.03 | PORTRAIT | CHANGED |
| 31.06 | PORTRAIT | 75 | 31.06 | PORTRAIT | CHANGED |
| 31.07 | INSERT | 90 | 31.07 | INSERT-PROP | CHANGED |
| 31.08 | ROOM-WIDE | 45 | 31.08 | INSERT-PROP | CHANGED |
| 31.09 | INSERT | 126 | 31.09 | WIDE | CHANGED |

</details>

---

## 24. INT. LAS VEGAS HOTEL SUITE — DAY · [BASE] → [BLUEPRINT] on the last beat · I · side MAS · 12:31:00–12:36:00 · 120 f (printed 12:31–12:36, 2 bars)

*his POV.*

### 24.01 · WIDE `[W]` · 60 f (1 bar) · 12:31:00–12:33:12 · MAS · C01 · CARRY

- **Change:** + the Orb at his shoulder (3.1 prints it). The act's one establishing wide. *(script: 1 bar)*
- **Room / view:** vegas-suite · wide · day
- **Characters:** MAS: room sprite seated at the desk (left third, 3/4 front), laptop open, his glass beside it; eyes level, tiny closed smile · THE ORB: at his shoulder, room scale (8-10 px sphere, iris on the laptop)
- **Action:** Downbeat: the rail types on. Below the window, the crane truck grinds along the closed street circuit in whole-pixel steps (1 px / 2 f). As it passes, the flute on the minibar, the tumbler, the ice bucket and the vase shiver in turn: 2 held drawings, 1 px, staggered 3 f apart. Mas's glass does not move a pixel. The water line stays flat.
- **Rail:** `NOV 17, 2023 · ~NOON PT · LAS VEGAS` types on at f0 (read ≥ 48 f; it persists)
- **Sound:** SFX NEW crane_truck_pass (low diesel grind, L→R), NEW glass_shiver ×4 (tiny pitched clinks, uneven, never a chord), room_tone (REUSE) · MUSIC Act-in downbeat (score to picture). Leave air for the shivers.
- **Gags / eggs:** The cup that never ripples: every glass in the suite shivers but his (F17: a crane truck, not race cars).
- **Assets:** EXISTS `room.vegas-suite` (rooms-a) · REUSE `cast.mas.desk` (cast) · SALVAGE `cast.orb.room` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 6 events
- **Notes:** No F1 or race branding anywhere: generic barriers only (trademark).
- **Crosswalk:** v1 24.01 · draft-3 lock 24.01

### 24.02 · INSERT-HANDS `[ECU]` · 30 f (2 beats) · 12:33:12–12:34:18 · MAS · C01 · REORDER

- **Change:** The nudge now comes BEFORE the call (it was the [ECU] after the [M]); the laptop's JOIN no longer reads in sc 24 (its first read is the tear, 25.08). *(script: 2 beats)*
- **Room / view:** vegas-suite · desk insert (drawDeskInsert: his glass at the right, the laptop's corner)
- **Characters:** MAS: hand only (cast.mas.hand.nudge, one drawing whose last frame is the nudge)
- **Action:** His hand and his glass. Two fingers nudge it one pixel true, back onto a spot it never left (beat 1; the glass moves 1 px, its water line stays flat). The hand lifts off the glass and settles on the trackpad at the frame's left edge (beat 2). No laptop text in frame.
- **Sound:** SFX NEW glass_set_down (the nudge: one dry tick, very soft), room_tone · MUSIC Leave air: the nudge is the joke.
- **Gags / eggs:** G02: he straightens a glass that didn't move (every other glass shivered in 24.01).
- **Assets:** EXISTS `room.vegas-suite` (rooms-a) · NEW `cast.mas.hand.nudge` (cast)
- **Logged as:** INSERT-HANDS · faces + hands 30 of 30 f · M · 2 events
- **Notes:** His ritual, not a tell at a real event: nothing on the record is near it.
- **Crosswalk:** v1 24.02 · draft-3 lock 24.02

### 24.03 · FALLAWAY `[PF]` · 30 f (2 beats) · 12:34:18–12:36:00 · MAS · C01 · REFRAME

- **Change:** Draft 3's [M] (Mas lit from below, JOIN on the laptop) becomes a [PF]: no Vegas medium plate, no Mas medium rig, no face relight. *(script: 2 beats)*
- **Room / view:** vegas-suite (held behind the window, stepped down: suitePortraitBg)
- **Characters:** MAS (left window, x12 y24): reading his screen, 3/4, eyes level; the one-pixel smile. The FACE IS NOT RELIT.
- **Action:** Beat 1: MAS, left, reading his screen. The suite behind his window steps down (resolve() with the key near zero, or one family step: <= 2 beats) until the laptop's glow is the only light left in the room. Beat 2: the WHOLE-FRAME FLASH-PRINT to blueprint rides this shot's last beat (f15-29): a palette remap, no redraw. Hard cut on the downbeat into 25.01.
- **Switch:** `f15-29: {type:'palette', to: BLUEPRINT_PRINT} (whole frame): 'the frame turns to blueprint' (kits-fx: print, not trace, pending the showrunner call)`
- **Sound:** SFX NEW blueprint_print (a soft paper-thump on the beat), room_tone (stepping down with the light) · MUSIC A stab on beat 2; THE PLAN motif enters on the cut.
- **Assets:** REUSE `cast.mas.portrait` (cast) · EXISTS `room.vegas-suite` (rooms-a) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine) · EXISTS `kit.blueprint` (kits)
- **Logged as:** FALLAWAY · faces + hands 30 of 30 f · I · 3 events
- **Notes:** Lighting note steps the ROOM down; the portrait is never relit unless W0 rules Mas's portrait a resolve() material (ruling 7 default: room only).
- **Crosswalk:** draft-3 lock 24.01a

## 25. THE PLAN · [BLUEPRINT] · P · side MAS · 12:36:00–13:21:00 · 1080 f (printed 12:36–13:21, 18 bars: 3 · 7 · 5 · 3)

*the show's voice (THE PLAN), inside his POV block; no V.O., no device, no Mas tell.*

### 25.01 · BLUEPRINT `[GFX]` · 180 f (3 bars) · 12:36:00–12:43:12 · MAS · C01 · CARRY

- **Change:** Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock). *(script: 3 bars)*
- **Room / view:** the drafting grid · full sheet
- **Action:** Beat 1: the grid draws itself in whole-pixel strokes (rows then columns, 3 held steps). Beat 2: the stamp lands, kicked 1 px on its first frame: `HOW TO FIRE A CEO WHO OWNS NOTHING.` Hold to the end of bar 3 (read ≥ 47 f; it gets 150).
- **Rail:** hidden
- **On screen:** stamp `HOW TO FIRE A CEO WHO OWNS NOTHING.` [INVENTED] title card of the device
- **Sound:** SFX rubber_stamp_C (REUSE), NEW pen_stroke_ticks (drafting-pen ticks on the grid strokes) · MUSIC THE PLAN theme, 3 bars.
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 3 events
- **Crosswalk:** v1 25.01 · draft-3 lock 25.01

### 25.02 · BLUEPRINT `[GFX]` · 240 f (4 bars) · 12:43:12–12:53:12 · MAS · C01 · CARRY

- **Change:** Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock). *(script: 4 bars)*
- **Room / view:** THE CHAIRS · elevation view
- **Action:** Bar 1: nine chair outlines draw on, three per beat, each with a nameplate: DIRE · NOVIHS · DRUH · MAS · GERG · ALYI · NELEH · MADA · THE QUIET VOTE. Bars 2-3 (the waltz): on the beat, DIRE stands up on small legs and walks politely off the grid (2-drawing walk, whole-pixel steps); then NOVIHS; then DRUH, whose outline wears a campaign sticker with no logo and no date. Where they stood, a stamp: `LEFT EARLIER IN 2023`. The waltz stops. Bar 4: four of the six remaining outlines are circled, one per beat: ALYI, NELEH, MADA, THE QUIET VOTE. Label: `THESE FOUR VOTE`. MADA's outline has bolts drawn at its feet (egg).
- **Rail:** hidden
- **On screen:** label `DIRE · NOVIHS · DRUH · MAS · GERG · ALYI · NELEH · MADA · THE QUIET VOTE` (not must-read) · stamp `LEFT EARLIER IN 2023` [V/K] three 2023 departures; exit dates not shown · label `THESE FOUR VOTE` [V]
- **Sound:** SFX NEW chair_feet_ticks (tiny chip steps, on the waltz beat), rubber_stamp_C (REUSE) · MUSIC A chip-voiced waltz in 3/4 (the knee motif, like a party game) under bars 2-3; it STOPS dead on the stamp. Compose so the three exits land on the 4/4 grid.
- **Gags / eggs:** Musical chairs folded into THE PLAN. Egg: MADA's outline is bolted to the floor (his chair never moves).
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 14 events
- **Notes:** NOVIHS: name only, no lamp click, no zAI colours (open question 19). DRUH's sticker: no party logo, no date (even-handedness).
- **Crosswalk:** v1 25.02 · draft-3 lock 25.02

### 25.03 · BLUEPRINT `[GFX]` · 180 f (3 bars) · 12:53:12–13:01:00 · MAS · C01 · CARRY

- **Change:** Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock). *(script: 3 bars)*
- **Room / view:** THE STRUCTURE · plan view
- **Action:** Cut to the plan view (the six remaining chairs as small top-view symbols). One element per beat: a box draws itself around the six: `NOPEAI · THE NONPROFIT`; a thick arrow `CONTROLS` points down into a bigger box: `NOPEAI · THE COMPANY (CAPPED PROFIT)`; a banner across the top box: `THE BOARD'S DUTY: THE MISSION. NOT THE INVESTORS.`; outside a drawn fence, a key ring the size of a steering wheel: `MACROSOFT · ~$10B IN (REPORTED) · VOTES: 0`; inside the company box, one small box `CEO`, stamped `EQUITY: 0 (HIS TESTIMONY)`. In the equity box a tiny blueprint moth opens its wings (2 drawings). Hold 2 beats on the finished sheet.
- **Rail:** hidden
- **On screen:** label `NOPEAI · THE NONPROFIT` [V] · label `CONTROLS` [V] · label `NOPEAI · THE COMPANY (CAPPED PROFIT)` [V] · label `THE BOARD'S DUTY: THE MISSION. NOT THE INVESTORS.` [V] paraphrase of the charter structure · label `MACROSOFT · ~$10B IN (REPORTED) · VOTES: 0` [V] reported · stamp `EQUITY: 0 (HIS TESTIMONY)` [V]
- **Sound:** SFX NEW pen_stroke_ticks, NEW moth_flutter (2 soft wing ticks) · MUSIC THE PLAN theme continues; a small button on the moth.
- **Gags / eggs:** The moth in the equity box (C27).
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 12 events
- **Notes:** The only numbers in THE PLAN are ~$10B (REPORTED) and EQUITY: 0. The cap stays unnumbered (the 100x cap is Ep6). Read load: ≈ 250 glyphs across 25.01-25.03 (writer-approved). Every label stays up once drawn; the banner lands by beat 4 so it holds ≥ 5 s.
- **Crosswalk:** v1 25.03 · draft-3 lock 25.03

### 25.04 · BLUEPRINT `[GFX]` · 180 f (3 bars) · 13:01:00–13:08:12 · MAS · C01 · CARRY

- **Change:** Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock). *(script: 3 bars)*
- **Room / view:** THE PLAN · the numbered path
- **Action:** Four little blueprint figures walk onto the grid from the left (2-drawing walks on 2s, whole-pixel steps): a door outline (ALYI), a figure holding a glowing paper (NELEH), a figure with a loading spinner over its head (MADA), a black square (THE QUIET VOTE). A numbered path appears under their feet: `1. NOON · VIDEO CALL ✓` · `2. BLOG POST ✓` · `3. INTERIM CEO ✓` · `4. ______________`. They tick off 1, 2 and 3 in stride (each ✓ stamps as the lead figure passes). They reach 4 and stop. The blank line is just a line.
- **Rail:** hidden
- **On screen:** label `1. NOON · VIDEO CALL ✓` · label `2. BLOG POST ✓` · label `3. INTERIM CEO ✓` · label `4. ______________`
- **Sound:** SFX NEW chair_feet_ticks (figures' steps), NEW check_tick ×3 · MUSIC The plan's march, bright; it stalls on step 4.
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 10 events
- **Crosswalk:** v1 25.04 · draft-3 lock 25.04

### 25.05 · BLUEPRINT `[GFX]` · 120 f (2 bars) · 13:08:12–13:13:12 · MAS · C01 · CARRY

- **Change:** Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock). *(script: 2 bars)*
- **Room / view:** THE PLAN · close on step 4
- **Action:** Cut closer (the same figures redrawn larger as linework, not scaled): the four at the blank line. NELEH's paper brightens one step on her line; a drafting callout (leader line + lettering) types her words. Beat. MADA's spinner turns; his callout types his. Hold.
- **Line** `a4-25-01` NELEH: "Step four." [INVENTED] · f10–30 (20 f) · RECORDED
- **Line** `a4-25-02` MADA: "Good question." [INVENTED] catchphrase · f50–77 (27 f) · RECORDED
- **Rail:** hidden
- **On screen:** callout `Step four.` (not must-read) · callout `Good question.` (not must-read)
- **Sound:** SFX voice: neleh, mada (dry) · MUSIC Music thins to a held note under the two lines.
- **Gags / eggs:** MADA's first 'Good question.' (1 of 3 + Mas's echo).
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 4 events
- **Notes:** Blueprint figures have no mouths: the callout typing IS the lip-sync (artistic simplification).
- **Crosswalk:** v1 25.05 · draft-3 lock 25.05

### 25.06 · BLUEPRINT `[GFX]` · 60 f (1 bar) · 13:13:12–13:16:00 · MAS · C01 · CARRY

- **Change:** Unchanged from board 1 (the kits-plan demo already runs this on its real 1080-frame clock). *(script: 1 bar)*
- **Room / view:** INSERT · the blank line
- **Action:** A chalk stroke starts to fill the blank (3 held drawings), squeaks, and snaps (2 drawings: the stroke breaks, a chalk crumb drops 2 px).
- **Rail:** hidden
- **Sound:** SFX NEW chalk_squeak, NEW chalk_snap · MUSIC Out on the snap.
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 3 events
- **Crosswalk:** v1 25.06 · draft-3 lock 25.06

### 25.07 · BLUEPRINT `[GFX]` · 60 f (1 bar) · 13:16:00–13:18:12 · MAS · C01 · CARRY

- **Change:** Unchanged; the tear parts onto the laptop insert of 25.08 (kits-fx). *(script: 1 bar)*
- **Room / view:** the sheet curls and tears
- **Action:** The blueprint's corner curls up (4 held drawings); Las Vegas neon bleeds through behind it (BASE colours under the curl). Beat 3: the blueprint tears along the line of step 4, left to right: a render front with a tear seam, BLUEPRINT → BASE, revealing the laptop insert we already know.
- **Rail:** hidden
- **Switch:** `{type:'front', from: BLUEPRINT, to:'BASE', t0: 30, frames: 18, tear: true} along y = step-4 line`
- **Sound:** SFX NEW paper_curl_rustle, NEW paper_tear (one clean rip), neon_buzz (REUSE, under the curl)
- **Assets:** EXISTS `kit.blueprint` (kits)
- **Logged as:** BLUEPRINT · not a face or a hand · P · 4 events
- **Notes:** The tear is the cut: in-vocabulary as a render front (PIXEL_GUIDE §2 rule 7).
- **Crosswalk:** v1 25.07 · draft-3 lock 25.07

### 25.08 · INSERT-HANDS `[ECU]` · 60 f (1 bar) · 13:18:12–13:21:00 · MAS · C01 · CHANGED

- **Change:** JOIN's first read: his hand on the trackpad; the laptop beside it reads BOARD · VIDEO CALL · JOIN, the pointer on JOIN. He clicks. *(script: 1 bar)*
- **Room / view:** vegas-suite · laptop insert (drawLaptopInsert screen:'join'), his hand on the trackpad below the screen
- **Characters:** MAS: hand only on the trackpad (cast.mas.hand.click: rest -> press, 1 frame, 1 px)
- **Action:** The tear's halves part onto the laptop, BASE again: `BOARD · VIDEO CALL · JOIN`, the pointer on JOIN (his laptop's pointer, not the lit cursor). His hand rests on the trackpad (beats 1-2). Beat 3: he clicks (the hand's press drawing + JOIN's pressed drawing, 1 frame, 1 px). Cut on the downbeat into the call.
- **On screen:** ui `BOARD · VIDEO CALL · JOIN`
- **Sound:** SFX post_click (REUSE) · MUSIC Silence, then the click.
- **Assets:** EXISTS `room.vegas-suite` (rooms-a) · NEW `cast.mas.hand.click` (cast) · EXISTS `kit.blueprint` (kits)
- **Logged as:** INSERT-HANDS · faces + hands 60 of 60 f · M · 3 events
- **Notes:** Movement 2 rule: after THE PLAN's tear the first shot is his hands: this [ECU] is it. The lit cursor is the player's and stays dark all act (pov-and-framing §1.6).
- **Crosswalk:** v1 25.08 · draft-3 lock 25.08

## 26. SAME — THE FALLING TILE · [BASE] (+[GLYPH] 20 f, [EARLY-WEB16] F1.2) · S2 · side MAS · 13:21:00–14:13:12 · 1260 f (printed 13:21–14:13.5, 21 bars: 4 · 4 · 4 · 4 · card 2 · 3)

*his POV (the FALLING TILE: his feed).*

### 26.01 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:21:00–13:23:12 · MAS · C02 · RETIME

- **Change:** 3 bars -> 1 bar (draft 3's phrase grid). The Wi-Fi egg is now the freeze-framer's proof that his feed froze. *(script: P1 bar 1)*
- **Room / view:** the board call · G5 (3 + 2)
- **Characters:** MAS tile: masPortrait in the tile, Vegas neon (day) behind him, pleasant · ALYI tile: a doorway, and he is a reflection in its glass · NELEH tile: a paper glowing on the desk behind her; footnotes ¹²³ orbit her head · MADA tile: arms folded, perfectly still, a loading spinner turning above him · THE QUIET VOTE: black tile `THE QUIET VOTE · camera off`
- **Action:** Downbeat: his laptop, full-bleed. The five-tile grid connects (MAS with Vegas neon behind him; ALYI a reflection in a doorway's glass; NELEH, a paper glowing, footnotes orbiting; MADA arms folded, perfectly still, spinner turning; THE QUIET VOTE · camera off). Beat 2: Mas's tile opens in 3 held steps. As it connects, the four small vote icons on the board's tiles are ALREADY flipped (F18). Egg (zero read load, the tell for freeze-framers): in the screen's corner the hotel Wi-Fi shows one bar of four.
- **On screen:** label `THE QUIET VOTE · camera off` · label `MAS MANALT · ALYI · NELEH · MADA` (not must-read)
- **Sound:** SFX NEW call_connect (a soft two-note chip up, not any app's sound), room_tone · MUSIC S2 set-piece enters: 4-bar phrase 1.
- **Gags / eggs:** The votes were flipped before he arrived (F18). THE QUIET VOTE: camera off. Egg: 1 bar of Wi-Fi (why his feed will freeze in 26.08).
- **Assets:** EXISTS `kit.call-grid` (kits) · EXISTS `cast.calltile` (cast) · SALVAGE `cast.mas.tile` (cast) · EXISTS `cast.alyi.portrait` (cast) · EXISTS `cast.neleh.tile` (cast) · EXISTS `cast.mada.tile` (cast) · EXISTS `cast.quietvote` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 7 events
- **Crosswalk:** v1 26.01 · draft-3 lock 26.01

### 26.02 · CARD `CARD` · 60 f (1 bar) · 13:23:12–13:26:00 · MAS · C02 · CARRY

- **Change:** Unchanged (rides the live grid; logs as the [POV] it rides). *(script: P1 bar 2)*
- **Room / view:** NELEH name card over the live grid
- **Characters:** NELEH: card portrait (paper to her chest, footnotes orbiting, level brows)
- **Action:** 1-beat freeze: the grid prints 2-tone EXCEPT Mas's tile, which stays in colour (Mas never freezes). Then the card rides over the live grid for the rest of the bar: window opens in 3 held steps (k0-2), name k3, rule k4, tagline types 2 chars/f, stat line.
- **On screen:** card `NELEH` · card `READ THE CHARTER. LITERALLY.` · card-stat `FOOTNOTES: ∞`
- **Switch:** `f0-14: 2TONE freeze print, mask = everything except Mas's tile`
- **Sound:** SFX freeze_hit_F (REUSE) · MUSIC Card hit on the downbeat.
- **Assets:** NEW `kit.cards` (kits) · EXISTS `cast.neleh.portrait` (cast)
- **Logged as:** UI-TILE-GRID (rides it) · not a face or a hand · CARD · 3 events
- **Notes:** `∞` is not in the 7 px face: a hand-pixelled stamp (kits).
- **Crosswalk:** v1 26.02 · draft-3 lock 26.02

### 26.02a · FALLAWAY `[PF]` · 60 f (1 bar) · 13:26:00–13:28:12 · MAS · C02 · CHANGED

- **Change:** Lighting note on the ROOM: the suite steps down until only the Strip's neon and the laptop's glow are left. No face relight (was 'lit from below'). *(script: P1 bar 3)*
- **Room / view:** vegas-suite (held behind the window, stepped down to the Strip's neon + the laptop glow)
- **Characters:** MAS (left): reads the icons, one pupil step per tile (4 eye darts, 1 px each, on the beat); nothing else moves
- **Action:** Beats 1-3: he reads the four flipped icons, one pupil step per tile. Beat 4: HOLD 1 BEAT.
- **Sound:** SFX room_tone (the suite: fan, the Strip, the truck far below) · MUSIC Phrase 1 closes under him.
- **Assets:** REUSE `cast.mas.portrait` (cast) · EXISTS `room.vegas-suite` (rooms-a) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine)
- **Logged as:** FALLAWAY · faces + hands 60 of 60 f · I · 5 events
- **Notes:** Tells are only drawn at [PF] or closer (§4.3 rule 1).
- **Crosswalk:** draft-3 lock 26.02a

### 26.03 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:28:12–13:31:00 · MAS · C02 · RETIME

- **Change:** 90 f -> 1 bar (phrase grid). *(script: P1 bar 4)*
- **Room / view:** the board call (his laptop, full-bleed)
- **Characters:** ALYI tile: his reflection's mouth moves (2 drawings on 2s)
- **Action:** Alyi's mouth moves, but no sound reaches Mas's tile. The dialogue box above Alyi's tile types `…` (1 char / 4 f) and stops. Hold.
- **On screen:** ui `…`
- **Sound:** SFX (no voice), NEW text_tick ×3 (the dots) · MUSIC Phrase 1 ends on the dots.
- **Gags / eggs:** He speaks; nothing arrives.
- **Assets:** EXISTS `kit.call-grid` (kits) · EXISTS `cast.alyi.portrait` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Crosswalk:** v1 26.03 · draft-3 lock 26.03

### 26.04 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:31:00–13:33:12 · MAS · C02 · CHANGED

- **Change:** Only the dialog now (the arrow's walk and the click are their own bars, 26.04b/c). *(script: P2 bar 1)*
- **Room / view:** the board call (his laptop, full-bleed)
- **Action:** Over Mas's tile a dialog pops up (3 held steps): drawn exactly like the 1993 one but in full colour, the same plain single-rule frame, no icons: `OK` · `Cancel`. Cancel is NOT greyed out. Under it the suite goes on: the laptop fan, the Strip, the truck somewhere below.
- **On screen:** ui `OK` · ui `Cancel`
- **Sound:** SFX NEW dialog_pop_chip (three uneven square-wave notes on F, never a held tone, never an OS alert: X3), room_tone (fan, Strip, truck) · MUSIC Phrase 2 begins.
- **Gags / eggs:** Cancel was greyed out in 1993. This time it works.
- **Assets:** EXISTS `kit.dialog-1993` (kits) · EXISTS `kit.call-grid` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Crosswalk:** v1 26.04 · draft-3 lock 26.04

### 26.04a · INSERT-HANDS `[ECU]` · 60 f (1 bar) · 13:33:12–13:36:00 · MAS · C02 · NEW

- **Change:** Draft 3's eyes strip (the hands/eyes ECU kit). *(script: P2 bar 2)*
- **Room / view:** Mas's eyes strip (480x64, letterboxed; the room area above and below is black) · *eyes strip (the ECU kit's eyes; counts as faces+hands)*
- **Characters:** MAS: the eyes strip only; pupils at position 0, then ONE pixel toward the dialog (position -1) on beat 3
- **Action:** The eyes strip, letterboxed. Beats 1-2: still. Beat 3: his pupils move one pixel toward the dialog. Nothing else on him moves.
- **Sound:** SFX room_tone · MUSIC Held.
- **Assets:** NEW `cast.mas.eyes` (cast)
- **Logged as:** INSERT-HANDS · faces + hands 60 of 60 f · M · 2 events
- **Notes:** He doesn't blink (§3.6).
- **Crosswalk:** draft-3 lock 26.04a

### 26.04b · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:36:00–13:38:12 · MAS · C02 · NEW

- **Change:** Split from board 1's 26.04: the arrow's walk gets its own bar. *(script: P2 bar 3)*
- **Room / view:** the board call (his laptop, full-bleed)
- **Action:** An arrow pointer steps in from the board's tiles, in whole pixels, one tile at a time (one held position per beat: NELEH's tile, MADA's, ALYI's, the dialog's edge). THE UNLIT ARROW: it belongs to whoever is trying to fire him, never to him and never to the player (the same arrow returns in 30.24).
- **Sound:** SFX room_tone (the suite goes on)
- **Assets:** EXISTS `kit.call-grid` (kits) · EXISTS `kit.dialog-1993` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 4 events
- **Crosswalk:** v1 26.04 · draft-3 lock 26.04b

### 26.04c · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:38:12–13:41:00 · MAS · C02 · NEW

- **Change:** Split from board 1's 26.04: the arrow reaches Cancel; the click lands on the NEXT downbeat (26.05 f0), so the drop-out runs exactly 2½ bars to the buzz. *(script: P2 bar 4)*
- **Room / view:** the board call (his laptop, full-bleed)
- **Action:** The arrow crosses into the dialog and settles on Cancel (beats 1-2), holds on it (beats 3-4). The world goes on underneath. The CLICK is on the downbeat that ends this bar: Cancel's pressed drawing is 26.05's first 2 frames.
- **Sound:** SFX room_tone (the suite goes on, to the last frame) · MUSIC Phrase 2 resolves on the click (26.05 f0).
- **Assets:** EXISTS `kit.call-grid` (kits) · EXISTS `kit.dialog-1993` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 2 events
- **Crosswalk:** v1 26.04 · draft-3 lock 26.04c

### 26.05 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:41:00–13:43:12 · MAS · C02 · RETIME

- **Change:** 4 bars -> 1 bar; the rail moved to the [CU]. SOUND: DROP-OUT [D6] starts on this shot's first frame (the click). *(script: P3 bar 1)*
- **Room / view:** the board call · G5 → G4
- **Characters:** MAS tile (greyed as it falls)
- **Action:** f0-1: *Click.* Cancel's pressed drawing. DROP-OUT [D6]: the fan, the Strip and the truck stop together; digital silence (no tone, no breath, no heartbeat: X3). f2: the dialog is gone. Mas's tile drops out of the grid like a puzzle piece: four drawings, straight down, a whole-pixel fall (f2 / 6 / 10 / 14), greying (CALL_GREY on the tile only). As it falls it comes apart into tokens: GLYPH dissolve, 20 frames (use 2 of 2). Beats 3-4: the four remaining tiles slide together to close the gap, in held whole-pixel steps (the G4 grid of pass one). Silent.
- **Switch:** `glyphDissolve(fb, masTile, x, y, {t: f, frames: 20, wind: [7, -1.6]})` · `{type:'palette', to: CALL_GREY, mask: masTile} while it falls`
- **Sound:** SFX dialog_ok_click (REUSE, retuned) on f0, glyph_dissolve (REUSE), (then SILENCE: the drop-out) · MUSIC Out on the click. The drop-out is the laugh. · DROP-OUT [D6] START
- **Gags / eggs:** The tile falls like a puzzle piece.
- **Assets:** EXISTS `kit.call-grid` (kits) · SALVAGE `cast.mas.tile` (cast) · EXISTS `kit.dialog-1993` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 6 events
- **Notes:** GLYPH use 2 of 2 in the episode (the Orb's scan is 1). Dark foreshadowing: a person becoming tokens.
- **Crosswalk:** v1 26.05 · draft-3 lock 26.05

### 26.05a · CLOSE-UP `[CU]` · 90 f (1 bar + 2 beats) · 13:43:12–13:47:06 · MAS · C02 · RETIME

- **Change:** 2 bars -> 1½ bars and SILENT: the V.O. is cut from sc 26. A 2-beat deadpan, then `+1 FIRING` types on on beat 3 and holds to the cut. *(script: P3 bars 2-3½ (1½ bars))*
- **Room / view:** Mas CU over the Strip's neon (drawMasCU backdrop 'strip')
- **Characters:** MAS: full frame, the FIRST of the episode's two close-ups; ONE drawing (three-quarter, the one-pixel smile, no mouths). Nothing on it changes.
- **Action:** Beats 1-2: HOLD 2 BEATS in the silence (the house deadpan). Beat 3 (f30): still in the silence, the rail types on `+1 FIRING` (meter: the firing tally). It holds with the face to the cut (4 beats).
- **Rail:** `+1 FIRING` types on at f30 (read ≥ 17 f; it persists)
- **Sound:** SFX (silence: the drop-out continues) · MUSIC None.
- **Assets:** NEW `cast.mas.cu` (cast) · EXISTS `room.vegas-suite` (rooms-a) · NEW `kit.cards` (kits)
- **Logged as:** CLOSE-UP · faces + hands 90 of 90 f · I · 2 events
- **Notes:** No V.O. here: sc 26 carries the candor card, so no caught device (§2.4); the drop-out plays clean (§5.5). The episode's one long hold stays the calm-off (30.17): this face holds only the 2-beat deadpan before the rail lands.
- **Crosswalk:** draft-3 lock 26.05a

### 26.06 · INSERT-HANDS `[ECU]` · 150 f (2 bars + 2 beats) · 13:47:06–13:53:12 · MAS · C02 · REFRAME

- **Change:** The phone ON THE DESK framed with the laptop's corner, the call's mic icon lit; the buzz brings the room back (2 beats earlier than draft 3); the thumb taps at once: the HOVER IS CUT. *(script: P3 last 1½ bars + P4 bar 1 (2½ bars))*
- **Room / view:** vegas-suite · desk insert (drawDeskInsert {phoneLit, mic:true}: the phone face-up, the laptop's corner at the left with the lit mic)
- **Characters:** MAS: hand only (cast.mas.hand.tap-strip): at rest beside the phone, then the thumb on the middle super
- **Action:** f0 (P3 bar 2½): the phone BUZZES and the room's sound comes back with it (the drop-out ends here: 150 f after the click). The suggested-replies strip lights: `[super] [super] [super]`. In the laptop's corner the call's microphone icon is still lit. f90 (P4 downbeat): his thumb taps the middle super AT ONCE, with no hover (G04: he always takes the offer). The strip's middle chip presses (1 frame, 1 px). To the cut: his tile is gone; his microphone isn't. The icon in the laptop's corner stays lit (the slip belongs to the interface: nobody muted him).
- **On screen:** ui `[super] [super] [super]`
- **Sound:** SFX NEW phone_buzz (f0), room_tone (back on the buzz: fan, Strip), NEW phone_wake, NEW text_tick (the tap) · MUSIC Phrase 4 enters on the tap, thin. · DROP-OUT [D6] END
- **Gags / eggs:** The suggested-replies runner (G04): all three say super. The lit mic is the interface's fault (§3.7).
- **Assets:** EXISTS `room.vegas-suite` (rooms-a) · NEW `cast.mas.hand.tap-strip` (cast) · CHANGED `prop.phone` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** INSERT-HANDS · faces + hands 150 of 150 f · M · 4 events
- **Notes:** No hover (pov-changes §4): he takes the strip's offer at once.
- **Crosswalk:** v1 26.06 · draft-3 lock 26.06

### 26.07 · PORTRAIT `[P]` · 60 f (1 bar) · 13:53:12–13:56:00 · MAS · C02 · CARRY

- **Change:** Unchanged. No music under the line. *(script: P4 bar 2)*
- **Room / view:** vegas-suite (held) behind the window
- **Characters:** MAS (left window): mouth rest → E/rest for 'super.', lids 0, look level; tiny closed smile after
- **Action:** Portrait opens in 3 held steps over the suite. He says it to the room. His mic is still live.
- **Line** `a4-26-01` MAS: "super." [INVENTED] usage of a real public tic · f8–30 (22 f) · RECORDED
- **Sound:** SFX voice: mas-manalt (dry) · MUSIC NO music under the line (mix note C39).
- **Gags / eggs:** His tile is gone, but his microphone isn't.
- **Assets:** REUSE `cast.mas.portrait` (cast) · EXISTS `room.vegas-suite` (rooms-a) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 26.07 · draft-3 lock 26.07

### 26.08 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 13:56:00–13:58:12 · MAS · C02 · CHANGED

- **Change:** Board it to read as FOUR STUNNED PEOPLE on first viewing: hold the whole grid still, video noise included (it's his feed that froze; pass one shows nobody looked up). *(script: P4 bar 3)*
- **Room / view:** the board call · G4 (frozen)
- **Characters:** ALYI (reflection), NELEH, MADA, THE QUIET VOTE: four HELD reaction drawings
- **Action:** The grid as HIS screen shows it: a listener's hold on four held faces. Neleh's footnotes stop mid-orbit. Mada's spinner stops. The black tile does nothing. Everything in the frame holds, the video noise included (the 1-bar Wi-Fi is still in the corner).
- **Sound:** SFX (silence; room tone only) · MUSIC Silent.
- **Gags / eggs:** They all heard 'super.' (his read; 27.01 is the truth).
- **Assets:** EXISTS `kit.call-grid` (kits) · EXISTS `cast.neleh.tile` (cast) · EXISTS `cast.mada.tile` (cast) · EXISTS `cast.alyi.portrait` (cast) · EXISTS `cast.quietvote` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Crosswalk:** v1 26.08 · draft-3 lock 26.08

### 26.09 · WIDE `[W]` · 60 f (1 bar) · 13:58:12–14:01:00 · MAS · C02 · CARRY

- **Change:** Unchanged: the first wide since sc 24. *(script: P4 bar 4)*
- **Room / view:** vegas-suite · wide · day
- **Characters:** MAS: seated at the desk, unmoved
- **Action:** Outside, the crane truck passes again. Every glass shivers (same drawings as 24.01). His doesn't.
- **Sound:** SFX NEW crane_truck_pass (R→L this time), NEW glass_shiver ×4 · MUSIC The phrase closes.
- **Gags / eggs:** Runner, second hit.
- **Assets:** EXISTS `room.vegas-suite` (rooms-a) · REUSE `cast.mas.desk` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 5 events
- **Crosswalk:** v1 26.09 · draft-3 lock 26.09

### 26.10 · CARD `[GFX]` · 120 f (2 bars) · 14:01:00–14:06:00 · MAS · C03 · CARRY

- **Change:** Unchanged. No V.O., no device, no Mas tell, no music within a bar. *(script: card 2)*
- **Room / view:** FULL-SCREEN DATED QUOTE CARD
- **Action:** Hard cut to the dated quote card: the board's blog post, real quotation marks, date line. Hold 2 bars (read ≥ 85 f).
- **Rail:** hidden
- **On screen:** quote-card `"…not consistently candid in his communications with the board…"` [V · NOV 17, 2023] · quote-card `— THE NOPEAI BOARD · BLOG POST · NOV 17, 2023`
- **Sound:** SFX NEW card_thud (soft) · MUSIC 2-bar card: a held chord, no melody.
- **Assets:** NEW `kit.cards` (kits)
- **Logged as:** CARD · not a face or a hand · CARD · 1 events
- **Notes:** The board's public wording is the only characterisation of the firing (guardrails X9 / Mas NEVER DO).
- **Crosswalk:** v1 26.10 · draft-3 lock 26.10

### 26.11 · UI-TILE-GRID `[POV]` · 30 f (2 beats) · 14:06:00–14:07:06 · MAS · C03 · RETIME

- **Change:** F1.2 is 3 bars (6 s of flashback + 1.5 s of render front): the front in takes 2 beats. *(script: P5 beats 1-2)*
- **Room / view:** the board call · G4, the greyed plate falling in the corner
- **Action:** Back on the G4 grid. In the bottom-left corner the greyed, emptied plate of Mas's tile is still falling (4 px per held step). f6: it becomes the leading edge of a render front that sweeps the frame from that corner to sixteen colours with GIF-era dither (front 18 f).
- **Switch:** `f6-29: {type:'front', from:'BASE', to:'EARLYWEB16', t0: 6, frames: 18, dir: from the plate}`
- **Sound:** SFX render_front_sweep (REUSE, very quiet) · MUSIC Music out. F1.2 is silent (C39).
- **Assets:** EXISTS `kit.call-grid` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · F · 3 events
- **Notes:** Interpretation for the director: the GLYPH dissolve eats the tile's picture; its greyed empty plate keeps falling (script: 'Mas's greyed tile, still falling in the corner').
- **Crosswalk:** v1 26.11 · draft-3 lock 26.11

### 26.12 · WIDE `[W]` · 120 f (2 bars) · 14:07:06–14:12:06 · MAS · C03 · RETIME

- **Change:** 2 bars + 1 beat -> 2 bars (F1.2 4 -> 3 bars). *(script: P5 bars 1½-3½ (2 bars))*
- **Room / view:** tpool-door · corridor (authored BASE, shown EARLYWEB16)
- **Characters:** Two silhouettes behind frosted glass (unidentifiable, no faces), leaning together: 2 held drawings, the lean is an integer row-shear
- **Action:** F1.2 · 2005–08 · TPOOL [EARLY-WEB16]. A frosted-glass boardroom door with two shadows behind it, leaning together. No sound, no whisper, and NO POV RIM: (REPORTED) material belongs to the show, never to his account. The shadows change drawing once (bar 2).
- **Rail:** `2005–08 · TPOOL · (REPORTED)` types on at f0 (read ≥ 40 f; it persists)
- **Switch:** `palette: 'EARLYWEB16' for the whole shot (the rail is `after`-layer UI and stays BASE)`
- **Sound:** SFX (silence) · MUSIC Silent.
- **Assets:** EXISTS `room.tpool-door` (rooms-a)
- **Logged as:** WIDE · not a face or a hand · F · 2 events
- **Notes:** Flashback budget: F1.2 ≈ 6.5 s in EARLY-WEB16 (26.11 f6 → 26.13 f18) of the episode's ≤ 20 s.
- **Crosswalk:** v1 26.12 · draft-3 lock 26.12

### 26.13 · INSERT-PROP `[ECU]` · 30 f (2 beats) · 14:12:06–14:13:12 · MAS · C03 · RETIME

- **Change:** 3 beats -> 2 beats. A prop close (no hand): not a face or a hand. *(script: P5 last 2 beats)*
- **Room / view:** tpool-door · close on the frosted bands → darkroom desk grain
- **Action:** Close on the glass: its horizontal frosted bands. A render front sweeps back to BASE; behind it the checker dither resolves into WOOD GRAIN, and the grain is the dark-room desk of 26A.01 (bands aligned to the grain lines). Cut on the downbeat.
- **Switch:** `{type:'front', from:'EARLYWEB16', to:'BASE', t0: 0, frames: 18}; the 'to' frame is 26A.01's first frame`
- **Sound:** SFX render_front_sweep (REUSE, quiet) · MUSIC Silent.
- **Assets:** EXISTS `room.tpool-door` (rooms-a) · CHANGED `room.darkroom` (rooms-b)
- **Logged as:** INSERT-PROP · not a face or a hand · F · 2 events
- **Notes:** 'The dither settles into wood grain' is done as a render front (in vocabulary), NOT a dither wipe (PIXEL_GUIDE §2 rule 7).
- **Crosswalk:** v1 26.13 · draft-3 lock 26.13

## 26A. INT. MAS'S DARK ROOM — THAT NIGHT · [BASE] · I · side MAS · 14:13:12–14:33:12 · 480 f (printed 14:13.5–14:33.5, 8 bars)

*his POV (the door into the exit).*

### 26A.01 · INSERT-HANDS `[ECU]` · 135 f (2 bars + 1 beat) · 14:13:12–14:19:03 · MAS · C03 · CHANGED

- **Change:** Bar 2 now ends with his thumb at rest on mark 3 ONLY (marks 1 and 2 are (REPORTED) and never touched). V.O. D2 'i don't keep score.' on bar 2. *(script: 2 bars + 1 beat)*
- **Room / view:** darkroom · desk close (drawDarkDesk {tally 2 → 3, carve 0 → 1}; the cyan key)
- **Characters:** MAS: hand only. Bar 1: the carve with the pen's steel clip (cast.mas.hand.carve). Bar 2: the brush, then the thumb at rest on mark 3 (cast.mas.hand.thumb-mark3, one drawing moved in whole pixels)
- **Action:** Bar 1: the desk under the cyan key, close: the two faint marks, the old ones we couldn't quite read. With the steel clip of the pen he pocketed from the MACROSOFT check he carves a third mark beside them, clean: 4 growth drawings on the beat, shavings curling (meter: the tally, G01). Bar 2: he brushes the shavings away with the side of his hand (2 drawings, beats 1-2), and his thumb comes to rest on the new mark, and only the new mark (beat 3; held). Marks 1 and 2 are never touched. V.O. D2 on bar 2's downbeat (a full bar clear of F1.2's (REPORTED) rail). Its text types at x 12, baseline y 198: frame the desk so y 182-203 is the desk's dark near edge, never the cyan key. Beat 9 (the extra beat): hold on the thumb at rest.
- **V.O.** `a4-26a-vo1` MAS (V.O.) `[INVENTED · VO · D2]`: *i don't keep score.* · f60–106 (46 f) · NEW READ (est. 46 f) · record the guardrails fallback 'i don't keep things.' as an alt take · caught by: the Orb's iris counts the tally, 1, 2, 3, and stops on his thumb (26A.02); the tag's drawer pays it off
- **Rail:** `NOV 17, 2023 · THAT NIGHT` types on at f0 (read ≥ 36 f; it persists)
- **Sound:** SFX NEW tally_carve (4 dry scratches, one per beat), (bar 2) a soft brush of shavings · MUSIC A low held tone (one instrument) under the V.O.; nothing swells.
- **Gags / eggs:** Meter: the firing tally, mark 3 (G01). The pocketed pen pays off. 'i don't keep score.' over the tally he just carved (D2).
- **Assets:** CHANGED `room.darkroom` (rooms-b) · NEW `cast.mas.hand.carve` (cast) · NEW `cast.mas.hand.thumb-mark3` (cast) · EXISTS `prop.pen` (kits) · EXISTS `prop.tally` (kits) · NEW `kit.vo-line` (engine)
- **Logged as:** INSERT-HANDS · faces + hands 135 of 135 f · M · 8 events
- **Notes:** Guardrail: his hand never touches marks 1 and 2 (the TPOOL ousters, (REPORTED)), in any episode. Ruling 2 default: 'score'. Under the fallback 'i don't keep things.' the 26A.02 iris steps to the pocketed pen instead; lengths unchanged.
- **Crosswalk:** v1 26A.01 · draft-3 lock 26A.01

### 26A.02 · TWO-SHOT `[2S]` · 45 f (3 beats) · 14:19:03–14:21:00 · MAS · C03 · CHANGED

- **Change:** The Orb COUNTS: its iris steps along the tally, mark 1 → 2 → 3, one per beat, and stops on his thumb. (Board 1 framed this as a room-plate crop; it is now a true [2S] on the medium rigs.) *(script: 3 beats)*
- **Room / view:** darkroom · desk medium plate (NEW: the cyan cone, the rack's LEDs, the desk edge)
- **Characters:** MAS (left third, 3/4, medium rig arm 'tally'): his thumb on mark 3; face still · THE ORB (right, medium: a sphere and an iris): iris to mark 1 (beat 1), mark 2 (beat 2), mark 3 (beat 3), stopping on his thumb
- **Action:** Mas and the Orb in the cyan cone. His thumb stays on mark 3. The Orb's iris steps along the tally, one mark per beat, 1, 2, 3, and stops on his thumb. The Orb is counting. (Its look is the only thing that ever touches marks 1 and 2.)
- **Sound:** SFX orb_servo ×3 (REUSE, tiny), server_hum (REUSE) · MUSIC The held tone ends.
- **Assets:** NEW `room.darkroom.medium` (rooms-b) · NEW `cast.mas.medium` (cast) · NEW `cast.orb.medium` (cast) · EXISTS `prop.tally` (kits)
- **Logged as:** TWO-SHOT · faces + hands 45 of 45 f · I · 4 events
- **Notes:** The buffer before the real post (26A.03). Ruling 2 fallback: the iris goes to the pocketed pen instead; same length.
- **Crosswalk:** v1 26A.02 · draft-3 lock 26A.02

### 26A.03 · UI-TILE-GRID `[POV]` · 120 f (2 bars) · 14:21:00–14:26:00 · MAS · C03 · RETIME

- **Change:** 165 f -> 2 bars (3.1). The typing is a burst; the post lands complete at f7 and holds 113 f (its read, exactly). *(script: 2 bars)*
- **Room / view:** his phone, full-bleed (the post composer)
- **Action:** His phone, full-bleed. He types in source casing (a burst of typing_soft, f0-6), and the post lands complete in its own UI (f7), which stamps it `9:32 PM PT`. Held to the cut (113 f, its read).
- **Post** `a4-26a-01` MAS: "if i start going off, the nopeai board should go after me for the full value of my shares" [V · NOV 17, 2023 · decoded 9:32 PM, zone to confirm] · f7–120 (held 113 f, needs 113)
- **On screen:** post `if i start going off, the nopeai board should go after me for the full value of my shares` [V · NOV 17, 2023 · decoded 9:32 PM, zone to confirm] · ui `9:32 PM PT` [ID] zone to confirm (open question 11)
- **Sound:** SFX typing_soft (REUSE), post_click (REUSE) · MUSIC Under it, nothing.
- **Gags / eggs:** A joke only a man with no equity can make.
- **Assets:** CHANGED `prop.phone` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 2 events
- **Notes:** Unvoiced post (house rule: posts are pop-ups, never speeches).
- **Crosswalk:** v1 26A.03 · draft-3 lock 26A.03

### 26A.04 · INSERT-PROP `[ECU]` · 60 f (1 bar) · 14:26:00–14:28:12 · MAS · C03 · RETIME

- **Change:** 1 beat -> 1 bar (3.1). A prop insert without a hand: not a face or a hand. *(script: 1 bar)*
- **Room / view:** the Senate wallet
- **Action:** The Senate wallet, open on the desk, with its one card: `HEALTH INSURANCE`. A moth flies out (3 drawings on 2s, beats 2-3). Hold.
- **On screen:** prop `HEALTH INSURANCE`
- **Sound:** SFX NEW moth_flutter
- **Gags / eggs:** Callback to sc 15.
- **Assets:** NEW `prop.wallet` (kits)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 2 events
- **Crosswalk:** v1 26A.04 · draft-3 lock 26A.04

### 26A.05 · FALLAWAY `[PF]` · 90 f (1 bar + 2 beats) · 14:28:12–14:32:06 · MAS · C03 · CHANGED

- **Change:** V.O. D4 now 'the meeting ended early.' (the door into the exit). Framing note: the V.O. band y 182-203 sits on hoodie shadow. *(script: 1½ bars)*
- **Room / view:** darkroom (held behind the window, stepped down to the cyan key and the rack's LEDs)
- **Characters:** MAS (left window): 3/4, still; framed so the hoodie's shadow fills y 182-203 under the window
- **Action:** Beat 1: MAS, left. The room steps down behind him until only the cyan key and the rack's LEDs are left. Beat 2 (f15): V.O. D4. Its text types at x 12, baseline y 198, on the hoodie's shadow (never on the cyan key). Hold to the cut.
- **V.O.** `a4-26a-vo2` MAS (V.O.) `[INVENTED · VO · D4]`: *the meeting ended early.* · f15–65 (50 f) · SCRATCH (the editor's a4-26-vo1 take of these words moves here; re-read optional) · caught by: the Orb's rewinding… (26A.06), then the exit's first shot: the board's call going on (27.01)
- **Sound:** SFX server_hum (REUSE, low) · MUSIC One instrument or none.
- **Assets:** REUSE `cast.mas.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine) · NEW `kit.vo-line` (engine)
- **Logged as:** FALLAWAY · faces + hands 90 of 90 f · I · 2 events
- **Notes:** D4: the exit's first shot catches it (27.01: the call going on without him); the Orb's rewinding… answers his face, not the line.
- **Crosswalk:** draft-3 lock 26A.05

### 26A.06 · PORTRAIT `[P]` · 30 f (2 beats) · 14:32:06–14:33:12 · MAS · C03 · NEW

- **Change:** (Draft 3's shot, never boarded.) The Orb reads him, not the line; the rail names the side 1 beat after the toast. EXIT. *(script: ½ bar)*
- **Room / view:** darkroom (held) behind the window
- **Characters:** THE ORB (right window): iris lifts from the desk to his face (2 held drawings)
- **Action:** Beat 1: THE ORB, right. Its iris lifts from the desk to his face. Toast: `rewinding…`. Beat 2 (f15): RAIL: `NOV 17 · EARLIER · THE BOARD'S SIDE` types on; it carries into 27.01. EXIT.
- **Rail:** `NOV 17 · EARLIER · THE BOARD'S SIDE` types on at f15 (read ≥ 48 f; it persists)
- **On screen:** toast `rewinding…`
- **Sound:** SFX orb_servo (REUSE), NEW toast_pop (soft), NEW rewind_chirp (a short reversed chip gliss; the Orb's)
- **Assets:** NEW `cast.orb.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits) · NEW `kit.cards` (kits)
- **Logged as:** PORTRAIT · faces + hands 30 of 30 f · I · 3 events
- **Notes:** The Orb never reacts to the V.O.: it looks at his face. `…` is not in the engine font: the post-ui/rail kit hand-pixels it (kits-fx §2).
- **Crosswalk:** draft-3 lock 26A.06

## 27. THE FIVE DAYS, PASS ONE: THE BOARD'S SIDE · [BASE] · I (the exit; the absent-Mas variant; portrait volley) · side BOARD · 14:33:12–16:34:18 · 2910 f (printed 14:33.5–16:24.5, ≈ 44½ bars)

*EXIT · THE BOARD'S SIDE (rail: NOV 17 · EARLIER · THE BOARD'S SIDE): no V.O., no Mas portrait window.*

### 27.01 · UI-TILE-GRID `[SCR]` · 90 f (1 bar + 2 beats) · 14:33:12–14:37:06 · BOARD · C04 · CHANGED

- **Change:** The caption is GONE: HOLD 1 BEAT on the call going on (NELEH turns a page), then his voice through their laptop speaker; the dialogue box types `super.` with NO portrait; nobody looks up. *(script: 1 bar + 2 beats)*
- **Room / view:** the board's call grid on a laptop, bezel in frame (the world's view) · G4
- **Characters:** NELEH tile: turns a page (2 drawings, beat 1), then reads on · MADA tile: spinner keeps turning · ALYI tile: his reflection looks at his own doorway · THE QUIET VOTE: black
- **Action:** Noon. Four tiles; the gap where his tile was has already closed. The call goes on. HOLD 1 BEAT on it going on: NELEH turns a page. f15: out of the laptop's small speaker, tinny, comes his voice. The dialogue box (top centre, NO portrait window, no name plate) types `super.` at his rate. Nobody looks up. MADA's spinner keeps turning. ALYI's reflection looks at his own doorway. THE QUIET VOTE's tile stays black. The left portrait window stays EMPTY.
- **Line** `a4-27-00` MAS: "super." [INVENTED] (the a4-26-01 take, heard on their call) · f19–41 (22 f) · DERIVED · NEW PROCESS: a4-26-01 through a small laptop-speaker filter (band-limited, boxy, under the room); no new read
- **On screen:** dialogue-box `super.`
- **Sound:** SFX call room tone (continues under the line), a4-27-00 (a4-26-01 through the laptop-speaker filter) · MUSIC Pass one's pulse enters AFTER the line: brisk, procedural.
- **Gags / eggs:** 'super.' heard from the other side: nobody looks up. (The board's pass is the true one: on his side his feed froze on one bar of Wi-Fi.)
- **Assets:** EXISTS `kit.call-grid` (kits) · EXISTS `cast.neleh.tile` (cast) · EXISTS `cast.mada.tile` (cast) · EXISTS `cast.alyi.portrait` (cast) · EXISTS `cast.quietvote` (cast) · REUSE `kit.dialogue-box-noportrait` (kits) · NEW `mix.laptop-speaker` (dialogue/mix)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 4 events
- **Notes:** This is the catch for 'the meeting ended early.' (it ended early for him). Pass one: no V.O., no devices, no Mas portrait window; he appears as posts, the security tile and this voice (§6.2).
- **Crosswalk:** draft-3 lock 27.01

### 27.01a · UI-TILE-GRID `[SCR]` · 75 f (1 bar + 1 beat) · 14:37:06–14:40:09 · BOARD · C04 · CARRY

- **Change:** Board 1's 27.01 (the toast and Gerg's post), unchanged.
- **Room / view:** the board's call grid (bezel)
- **Action:** A system toast pops (3 held steps): `GERG MOCKBRAN has left.` Then his post arrives, green-lit from below (the post UI takes his terminal-green uplight).
- **Post** `a4-27-01` GERG: "…I quit." [V · NOV 17, 2023 · fragment of a longer message; re-fetch the casing] · f30–75 (held 45 f, needs 16)
- **On screen:** toast `GERG MOCKBRAN has left.` · post `…I quit.` [V · NOV 17, 2023] re-fetch casing
- **Sound:** SFX NEW toast_pop (soft), post_click (REUSE) · MUSIC Pass one's pulse: brisk, procedural.
- **Assets:** EXISTS `kit.call-grid` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Notes:** Re-fetch the casing of '…I quit.' before lock (open question 12).
- **Crosswalk:** v1 27.01 · draft-3 lock 27.01a

### 27.02 · UI-TILE-GRID `[SCR]` · 60 f (1 bar) · 14:40:09–14:42:21 · BOARD · C04 · CARRY

- **Change:** Unchanged.
- **Room / view:** the board's call grid (bezel)
- **Action:** A second toast: `BUKAJ has left.` (text only; his plate waits for his real debut). Keycaps pop out of the bottom of the frame like popcorn and rain across the grid (whole-pixel arcs, one bounce, they settle on the tile frames).
- **On screen:** toast `BUKAJ has left.`
- **Sound:** SFX NEW toast_pop, keycap_popcorn (REUSE)
- **Gags / eggs:** Gerg's keycaps, without Gerg.
- **Assets:** EXISTS `kit.call-grid` (kits) · NEW `kit.post-ui` (kits) · REUSE `cast.gerg.keycaps` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Crosswalk:** v1 27.02 · draft-3 lock 27.02

### 27.03 · PORTRAIT `[P]` · 30 f (2 beats) · 14:42:21–14:44:03 · BOARD · C04 · REFRAME

- **Change:** Board 1's tile in Mas's old slot becomes RIMA's right-hand [P] under a hard circular spotlight (3.1: everyone speaks from the right). *(script: 2 beats)*
- **Room / view:** board grid (held) behind the window
- **Characters:** RIMA (right window): under a hard circular spotlight (it snaps on in 3 held drawings), jacket perfect, smoothing it (2 drawings)
- **Action:** RIMA TAMURI, right, under a hard circular spotlight: jacket perfect, smoothing it. The left window stays empty.
- **Sound:** SFX NEW spotlight_clunk
- **Assets:** EXISTS `cast.rima.portrait` (cast) · REUSE `kit.portrait-layout` (kits) · EXISTS `kit.call-grid` (kits)
- **Logged as:** PORTRAIT · faces + hands 30 of 30 f · I · 3 events
- **Crosswalk:** v1 27.03 · draft-3 lock 27.03

### 27.04 · CARD `CARD` · 60 f (1 bar) · 14:44:03–14:46:15 · BOARD · C04 · CHANGED

- **Change:** The card now rides RIMA's live right-hand window (board 1: the live grid); logs as the [P] it rides.
- **Room / view:** RIMA name card over her live window (the grid held behind it)
- **Characters:** RIMA: card portrait (spotlight window)
- **Action:** 1-beat freeze print (2-tone; Mas is not in frame), then the card rides her live window for the rest of the bar.
- **On screen:** card `RIMA TAMURI` · card `CEO (WEEKEND EDITION)` · card-stat `HEARTS SENT: 0` true on its date (Nov 17)
- **Sound:** SFX freeze_hit_C (REUSE)
- **Assets:** NEW `kit.cards` (kits) · EXISTS `cast.rima.portrait` (cast)
- **Logged as:** PORTRAIT (rides it) · faces + hands 60 of 60 f · CARD · 2 events
- **Notes:** gags.md still reads `HEARTS SENT: 1 (BLUE)`; the script's `0` wins (every card true on its date). Flag to the gags owner.
- **Crosswalk:** v1 27.04 · draft-3 lock 27.04

### 27.05 · PORTRAIT `[P]` · 60 f (1 bar) · 14:46:15–14:49:03 · BOARD · C04 · SPLIT

- **Change:** Board 1's two-portrait volley becomes single right-hand windows (3.1: the left window stays empty in pass one).
- **Room / view:** board grid (held) behind the window
- **Characters:** RIMA (right): pleasant, composed; spotlight on her
- **Action:** RIMA, right: 'I'll hold it together.'
- **Line** `a4-27-02` RIMA: "I'll hold it together." [INVENTED] · f4–48 (44 f) · RECORDED
- **Sound:** SFX voice: rima-tamuri, neleh
- **Gags / eggs:** 'For how long?' is echoed later by TTEMME ('Chat… for how long?').
- **Assets:** EXISTS `cast.rima.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 27.05 · draft-3 lock 27.05

### 27.05a · PORTRAIT `[P]` · 45 f (3 beats) · 14:49:03–14:51:00 · BOARD · C04 · SPLIT

- **Change:** Split from board 1's 27.05.
- **Room / view:** board grid (held) behind the window
- **Characters:** NELEH (right): brows 'query'; footnotes orbit
- **Action:** NELEH, right: 'For how long?'
- **Line** `a4-27-03` NELEH: "For how long?" [INVENTED] · f4–33 (29 f) · RECORDED
- **Sound:** SFX voice: rima-tamuri, neleh
- **Gags / eggs:** 'For how long?' is echoed later by TTEMME ('Chat… for how long?').
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 45 of 45 f · I · 2 events
- **Crosswalk:** v1 27.05 · draft-3 lock 27.05a

### 27.05b · PORTRAIT `[P]` · 60 f (1 bar) · 14:51:00–14:53:12 · BOARD · C04 · SPLIT

- **Change:** Split from board 1's 27.05.
- **Room / view:** board grid (held) behind the window
- **Characters:** RIMA (right): pleasant; smile on 'soon.'; on her last word the spotlight drifts off her in 3 held positions
- **Action:** RIMA, right (pleasant): 'We'll share more soon.'
- **Line** `a4-27-04` RIMA: "We'll share more soon." [INVENTED] catchphrase · f4–37 (33 f) · RECORDED
- **Sound:** SFX voice: rima-tamuri, neleh
- **Assets:** EXISTS `cast.rima.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 3 events
- **Crosswalk:** v1 27.05 · draft-3 lock 27.05b

### 27.05c · PORTRAIT `[P]` · 15 f (1 beat) · 14:53:12–14:54:03 · BOARD · C04 · NEW

- **Change:** NEW (3.1): NELEH listening, brow `query`, after 'We'll share more soon.' (the listener; her real face builds here). *(script: 1 beat)*
- **Room / view:** board grid (held) behind the window
- **Characters:** NELEH (right): listening, one brow up (brow 'query', the existing portrait)
- **Action:** NELEH, right, listening, one brow up. 1 beat.
- **Sound:** SFX call room tone
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 15 of 15 f · I · 1 events
- **Crosswalk:** new

### 27.06 · WIDE `[W]` · 60 f (1 bar) · 14:54:03–14:56:15 · BOARD · C04 · RETAG

- **Change:** Draft 3's [M] over the tiled heads is a [W]: a tighter plate of the bullpen, the SAME drawing (drawBullpen 'allhands').
- **Room / view:** bullpen · all-hands (door open) · a tighter [W] plate (same drawing) · *a tighter plate of a room is [W] (pov-changes: tags)*
- **Characters:** TILED EMPLOYEES: rows of employee tiles (held drawings) · ALYI: in the conference-room doorway, half cut off by its frame (room sprite clipped to the door opening)
- **Action:** INT. NOPEAI BULLPEN — ALL-HANDS. One tile's hand goes up (2 drawings). A dialogue box with a tail over that tile types the question.
- **Line** `a4-27-05` TILED EMPLOYEE: "Is this a coup?" [INVENTED] cartoon line (unquoted paraphrase of the all-hands question) · f15–48 (33 f) · RECORDED
- **Sound:** SFX room_tone (crowd hush), voice: tiled-employee
- **Assets:** EXISTS `room.bullpen` (rooms-b) · EXISTS `cast.alyi.door` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 4 events
- **Notes:** Employees are private individuals: generic, unidentifiable tiles, no names.
- **Crosswalk:** v1 27.06 · draft-3 lock 27.06

### 27.07 · PORTRAIT `[P]` · 105 f (1 bar + 3 beats) · 14:56:15–15:01:00 · BOARD · C04 · CHANGED

- **Change:** ALYI now speaks from the RIGHT window (board 1 proposed the board on the left).
- **Room / view:** bullpen all-hands (held) behind the window
- **Characters:** ALYI (right): portrait with a door jamb drawn over the window's inner third (he is always cut by a frame); eyes open, slow; mouth on the viseme set
- **Action:** He answers, slowly (the slowest voice in the cast).
- **Line** `a4-27-06` ALYI: "You can call it this way" [V · NOV 17, 2023] · f4–79 (75 f) · RECORDED
- **Sound:** SFX voice: alyi (dry; hall on a send)
- **Assets:** EXISTS `cast.alyi.portrait` (cast) · EXISTS `room.bullpen` (rooms-b) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 105 of 105 f · I · 2 events
- **Crosswalk:** v1 27.07 · draft-3 lock 27.07

### 27.07a · WIDE `[W]` · 15 f (1 beat) · 15:01:00–15:01:15 · BOARD · C04 · NEW

- **Change:** NEW (3.1): in the crowd, the one hand is still up (the same all-hands plate, handsUp). *(script: 1 beat)*
- **Room / view:** bullpen · all-hands (the same tighter [W] plate)
- **Characters:** TILED EMPLOYEES: held; the one hand still up
- **Action:** In the crowd, the one hand is still up. 1 beat.
- **Sound:** SFX room_tone (crowd hush)
- **Gags / eggs:** The hand is still up.
- **Assets:** EXISTS `room.bullpen` (rooms-b)
- **Logged as:** WIDE · not a face or a hand · I · 1 events
- **Crosswalk:** v1 27.08

### 27.08 · PORTRAIT `[P]` · 60 f (1 bar) · 15:01:15–15:04:03 · BOARD · C04 · REFRAME

- **Change:** Draft 3's [M] exit becomes a [P]: ALYI steps back out of his own door-cut window in whole-pixel steps; the window holds empty 1 beat, then closes (no Alyi medium rig). *(script: 1 bar)*
- **Room / view:** bullpen all-hands (held) behind the window
- **Characters:** ALYI (right window): steps back out of his window, 4 px per held step on 2s, until the door frame has all of him
- **Action:** Beats 1-2: ALYI steps back out of his own window, one whole-pixel step at a time, until the door frame has all of him. Beat 3: the window holds EMPTY for 1 beat. Beat 4: the window closes in 3 held steps.
- **Sound:** SFX (a single chair creak somewhere in the crowd)
- **Gags / eggs:** He leaves his own close-up.
- **Assets:** EXISTS `cast.alyi.portrait` (cast) · CHANGED `cast.alyi.window-exit` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 4 events
- **Crosswalk:** v1 27.08 · draft-3 lock 27.08

### 27.09 · UI-TILE-GRID `[SCR]` · 120 f (2 bars) · 15:04:03–15:09:03 · BOARD · C04 · CARRY

- **Change:** Unchanged (prod mode S-rep: the falling-stack kit is built).
- **Room / view:** the board's call grid (bezel) · G5 with Rima
- **Action:** `NOV 18`. A heart appears in the corner of Neleh's tile (beat 1). Then ten (beat 2). Then hundreds of red hearts pour down over the grid, each its own held sprite, stacking, until the tiles are buried (falling-stack kit).
- **Rail:** `NOV 18` types on at f0 (read ≥ 14 f; it persists)
- **Sound:** SFX heart_gliss (REUSE, layered, rising density) · MUSIC Pass one's pulse climbs with the pile.
- **Gags / eggs:** Scale by repetition (the kit the tile avalanche reuses).
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `kit.call-grid` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 4 events
- **Notes:** Photosensitivity: no flashes; saturated red passes the red-flash audit.
- **Crosswalk:** v1 27.09 · draft-3 lock 27.09

### 27.10 · UI-TILE-GRID `[SCR]` · 135 f (2 bars + 1 beat) · 15:09:03–15:14:18 · BOARD · C04 · CARRY

- **Change:** Unchanged (Mas's post as a notification band across the hearts; S-rep: the kit is built).
- **Room / view:** the board's call grid (bezel) · buried in hearts
- **Action:** Exactly one heart is BLUE. It drifts down slowly, last of all (optional egg: it drops from above Rima's tile), and lands on the only thing still sticking out of the pile: Mada's spinner. It spins with it, blue, for one beat. Then Mas's post, a notification band, scrolls across the hearts (slides in 3 steps, holds ≥ 78 f, slides out).
- **Post** `a4-27-07` MAS: "…sorta like reading your own eulogy while you're still alive" [V · NOV 18, 2023] · f15–120 (held 105 f, needs 78)
- **On screen:** post `…sorta like reading your own eulogy while you're still alive` [V · NOV 18, 2023]
- **Sound:** SFX NEW blue_heart_ping (one soft note), post_click (REUSE)
- **Gags / eggs:** Exactly one blue heart (the 💙).
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `cast.mada.tile` (cast) · NEW `kit.post-ui` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 4 events
- **Notes:** Unvoiced post.
- **Crosswalk:** v1 27.10 · draft-3 lock 27.10

### 27.11 · TWO-SHOT `[2S]` · 60 f (1 bar) · 15:14:18–15:17:06 · BOARD · C05 · REFRAME

- **Change:** The committee as a [2S] on the medium rigs (NELEH, MADA) over the boardroom-table medium plate (board 1: a room wide). *(script: 1 bar)*
- **Room / view:** boardroom · table medium plate (NEW; night, the committee after the vote)
- **Characters:** NELEH (medium rig, standing, marker in hand) · MADA (medium rig, seated, arms folded, spinner turning) · ALYI: a reflection in the dark window behind them (alyiReflection) · THE QUIET VOTE: a laptop on a chair, black tile
- **Action:** INT. NOPEAI BOARDROOM — NIGHT. The committee after the vote: NELEH, standing with a marker, and MADA, seated, spinner turning, the blueprint from THE PLAN spread on the table between them, step 4 still a blank line. ALYI a reflection in the dark window; a laptop on a chair shows the black tile. Beat 3: every phone on the table buzzes at once (2 drawings, 1 px).
- **Sound:** SFX NEW phone_buzz ×6 (table rattle)
- **Gags / eggs:** Egg: out the window, a speed-dial wheel the size of a Ferris wheel spins through the whole Valley (4 drawn spoke positions).
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.neleh.medium` (cast) · NEW `cast.mada.medium` (cast) · EXISTS `cast.alyi.portrait` (cast) · EXISTS `cast.quietvote` (cast) · EXISTS `kit.blueprint` (kits)
- **Logged as:** TWO-SHOT · faces + hands 60 of 60 f · I · 5 events
- **Notes:** Rate-(b) calibration run starts here (through 'How much?', 27.25): log agent-min separately (writer §4).
- **Crosswalk:** v1 27.11 · draft-3 lock 27.11

### 27.12 · PORTRAIT `[P]` · 75 f (1 bar + 1 beat) · 15:17:06–15:20:09 · BOARD · C05 · SPLIT

- **Change:** Board 1's two-portrait volley as single right-hand windows, cut on each line.
- **Room / view:** boardroom (held) behind the window
- **Characters:** NELEH (right): precise, brows level
- **Action:** NELEH, right: 'The bylaws allow it. Footnote three.'
- **Line** `a4-27-08` NELEH: "The bylaws allow it. Footnote three." [INVENTED] ('Footnote three.' is her catchphrase) · f4–61 (57 f) · RECORDED
- **Sound:** SFX voice: neleh, alyi
- **Gags / eggs:** 'Footnote three.' (her catchphrase).
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 75 of 75 f · I · 2 events
- **Crosswalk:** v1 27.12 · draft-3 lock 27.12

### 27.12a · PORTRAIT `[P]` · 105 f (1 bar + 3 beats) · 15:20:09–15:24:18 · BOARD · C05 · SPLIT

- **Change:** Board 1's two-portrait volley as single right-hand windows, cut on each line.
- **Room / view:** boardroom (held) behind the window
- **Characters:** ALYI (right, the REFLECTION portrait: stepped −2, a mullion across him): slow; his pauses are the joke
- **Action:** ALYI, right: 'Step four… will reveal itself.'
- **Line** `a4-27-09` ALYI: "Step four… will reveal itself." [INVENTED] · f4–83 (79 f) · RECORDED
- **Sound:** SFX voice: neleh, alyi
- **Assets:** EXISTS `cast.alyi.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 105 of 105 f · I · 2 events
- **Crosswalk:** v1 27.12 · draft-3 lock 27.12a

### 27.12b · PORTRAIT `[P]` · 30 f (2 beats) · 15:24:18–15:26:00 · BOARD · C05 · SPLIT

- **Change:** Board 1's two-portrait volley as single right-hand windows, cut on each line.
- **Room / view:** boardroom (held) behind the window
- **Characters:** NELEH (right): brows 'query'
- **Action:** NELEH, right: 'When?'
- **Line** `a4-27-10` NELEH: "When?" [INVENTED] · f4–19 (15 f) · RECORDED
- **Sound:** SFX voice: neleh, alyi
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 30 of 30 f · I · 2 events
- **Crosswalk:** v1 27.12 · draft-3 lock 27.12b

### 27.12c · PORTRAIT `[P]` · 90 f (1 bar + 2 beats) · 15:26:00–15:29:18 · BOARD · C05 · SPLIT

- **Change:** Board 1's two-portrait volley as single right-hand windows, cut on each line.
- **Room / view:** boardroom (held) behind the window
- **Characters:** ALYI (right, reflection): slow
- **Action:** ALYI, right: 'The company will tell us.'
- **Line** `a4-27-11` ALYI: "The company will tell us." [INVENTED] · f4–81 (77 f) · RECORDED
- **Sound:** SFX voice: neleh, alyi
- **Assets:** EXISTS `cast.alyi.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 90 of 90 f · I · 2 events
- **Crosswalk:** v1 27.12 · draft-3 lock 27.12c

### 27.12d · PORTRAIT `[P]` · 15 f (1 beat) · 15:29:18–15:30:09 · BOARD · C05 · NEW

- **Change:** NEW (3.1): NELEH listening, brow `query`, after ALYI's 'The company will tell us.' *(script: 1 beat)*
- **Room / view:** boardroom (held) behind the window
- **Characters:** NELEH (right): listening, one brow up (brow 'query')
- **Action:** NELEH, right, listening, one brow up. 1 beat.
- **Sound:** SFX (the room's hush)
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 15 of 15 f · I · 1 events
- **Crosswalk:** new

### 27.13 · TWO-SHOT `[2S]` · 60 f (1 bar) · 15:30:09–15:32:21 · BOARD · C05 · REFRAME

- **Change:** The phones walk in the [2S] (board 1: a room wide). *(script: 1 bar)*
- **Room / view:** boardroom · table medium plate
- **Characters:** NELEH and MADA (medium rigs), still
- **Action:** Every phone on the table buzzes again, harder, and the phones walk themselves toward the near edge: one held step each, on the beat (4 steps, 3 px each).
- **Sound:** SFX NEW phone_buzz (harder)
- **Gags / eggs:** Phones that walk.
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.neleh.medium` (cast) · NEW `cast.mada.medium` (cast)
- **Logged as:** TWO-SHOT · faces + hands 60 of 60 f · I · 4 events
- **Crosswalk:** v1 27.13 · draft-3 lock 27.13

### 27.14 · PORTRAIT `[P]` · 60 f (1 bar) · 15:32:21–15:35:09 · BOARD · C05 · SPLIT

- **Change:** Split: NELEH, right.
- **Room / view:** boardroom (held) behind the window
- **Characters:** NELEH (right)
- **Action:** NELEH, right: 'The company is calling us.'
- **Line** `a4-27-12` NELEH: "The company is calling us." [INVENTED] · f4–45 (41 f) · RECORDED
- **Sound:** SFX voice: neleh, alyi
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 27.14 · draft-3 lock 27.14

### 27.14a · PORTRAIT `[P]` · 120 f (2 bars) · 15:35:09–15:40:09 · BOARD · C05 · SPLIT

- **Change:** Split: ALYI (reflection), right.
- **Room / view:** boardroom (held) behind the window
- **Characters:** ALYI (right, reflection)
- **Action:** ALYI (reflection), right: 'That is the company telling us.'
- **Line** `a4-27-13` ALYI: "That is the company telling us." [INVENTED] · f4–93 (89 f) · RECORDED
- **Sound:** SFX voice: neleh, alyi
- **Assets:** EXISTS `cast.alyi.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 120 of 120 f · I · 2 events
- **Crosswalk:** v1 27.14 · draft-3 lock 27.14a

### 27.14b · TWO-SHOT `[2S]` · 30 f (2 beats) · 15:40:09–15:41:15 · BOARD · C05 · REFRAME

- **Change:** The reflection's flicker and the still black tile in the [2S] (board 1: end of 27.14 + the laptop insert 27.15). *(script: 2 beats)*
- **Room / view:** boardroom · table medium plate
- **Characters:** NELEH and MADA (medium rigs) · ALYI (reflection in the window): there / not there for 2 frames, then steady
- **Action:** In the window, Alyi's reflection flickers, there and not there, for two frames (drawAlyiWindow flicker 'gone'), and then steadies. The black tile on the laptop doesn't move.
- **Gags / eggs:** The stillest actor in the episode (THE QUIET VOTE).
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.neleh.medium` (cast) · NEW `cast.mada.medium` (cast) · EXISTS `cast.alyi.portrait` (cast) · EXISTS `cast.quietvote` (cast)
- **Logged as:** TWO-SHOT · faces + hands 30 of 30 f · I · 2 events
- **Crosswalk:** v1 27.14, 27.15 · draft-3 lock 27.14b

### 27.15 · FALLAWAY `[PF]` · 45 f (3 beats) · 15:41:15–15:43:12 · BOARD · C05 · NEW

- **Change:** (Draft 3's shot, never boarded.) NELEH's real face: the boardroom stepped down behind her; she looks at the blank line; HOLD 1 BEAT. It isn't a joke. *(script: 3 beats)*
- **Room / view:** boardroom (held behind the window, stepped down)
- **Characters:** NELEH (right window): looks DOWN at the blank line (her eye dart), then holds
- **Action:** NELEH, right, the boardroom stepped down behind her. She looks at the blank line (beats 1-2). HOLD 1 BEAT. It isn't a joke (her real face).
- **Sound:** SFX (room tone only) · MUSIC Nothing.
- **Assets:** EXISTS `cast.neleh.portrait` (cast) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine)
- **Logged as:** FALLAWAY · faces + hands 45 of 45 f · I · 2 events
- **Crosswalk:** draft-3 lock 27.15

### 27.16 · INSERT-PROP `[ECU]` · 60 f (1 bar) · 15:43:12–15:46:00 · BOARD · C05 · CHANGED

- **Change:** She writes `?` ONLY (no illegible word). The blueprint prop's step 4 carries `?` from here on. *(script: 1 bar)*
- **Room / view:** boardroom · table insert (drawTableInsert focus 'blueprint', the `?`-only state)
- **Characters:** NELEH: her hand with the marker (a prop insert: a hand and an object)
- **Action:** She uncaps the marker (2 drawings, beat 1) and writes one mark on the blank line: `?` (3 drawings, beats 2-3). Hold 1 beat.
- **On screen:** prop `?` (not must-read)
- **Sound:** SFX NEW marker_uncap, NEW marker_squeak (short)
- **Assets:** CHANGED `room.boardroom` (rooms-a) · NEW `cast.neleh.hand-marker` (cast) · EXISTS `kit.blueprint` (kits)
- **Logged as:** INSERT-PROP · faces + hands 60 of 60 f · M · 3 events
- **Notes:** The `?` stays on the sheet: 27.35's 'blank but for her question mark'.
- **Crosswalk:** v1 27.16 · draft-3 lock 27.16

### 27.17 · WIDE `[W]` · 60 f (1 bar) · 15:46:00–15:48:12 · BOARD · C05 · CARRY

- **Change:** Unchanged: the boardroom's one wide in this block. CUT on the first ring.
- **Room / view:** boardroom · night · wide
- **Action:** In the middle of the table, the conference speakerphone dials out on its own: four tones, one per seat, one per beat (its 4 dial LEDs light in turn). CUT on the first ring (the ring's first frame is 27.18's first frame).
- **Sound:** SFX NEW speaker_tones ×4 (chip tones, not real DTMF), NEW phone_ring_chip (starts on the cut)
- **Gags / eggs:** Nobody dials: the whole table does (F6).
- **Assets:** CHANGED `room.boardroom` (rooms-a) · EXISTS `cast.neleh.room` (cast) · EXISTS `cast.mada.room` (cast) · EXISTS `cast.quietvote` (cast) · EXISTS `cast.alyi.portrait` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 4 events
- **Crosswalk:** v1 27.17 · draft-3 lock 27.17

### 27.18 · INSERT-PROP `[ECU]` · 45 f (3 beats) · 15:48:12–15:50:09 · BOARD · C06 · REFRAME

- **Change:** The lighthouse opens CLOSE (a home room): a prop insert of the phone ringing on a paper-buried desk, the small throne on its handset (board 1: a room wide). *(script: 3 beats)*
- **Room / view:** lighthouse · desk insert (NEW plate: paper-buried desk top) + drawThroneHandset 'lg' on its cradle
- **Action:** f0 (the cut on the first ring): a phone rings on a desk buried in paper; attached to its handset, somehow, is a small throne (the handset hops 2 drawings per ring). The rail types on at f0 and persists into 27.19.
- **Rail:** `(REPORTED) · THE BOARD OFFERS MARIO THE JOB, AND A MERGER` types on at f0 (read ≥ 75 f; it persists)
- **Sound:** SFX NEW phone_ring_chip (starts on the cut), NEW lamp_hum (lighthouse) · MUSIC Pass one's pulse, in the Misanthropic colour (woodier).
- **Assets:** NEW `room.lighthouse.desk-insert` (rooms-b) · EXISTS `prop.throne-handset` (cast)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 3 events
- **Crosswalk:** v1 27.18 · draft-3 lock 27.18

### 27.19 · PORTRAIT `[P]` · 90 f (1 bar + 2 beats) · 15:50:09–15:54:03 · BOARD · C06 · CHANGED

- **Change:** MARIO's [P] (existing portrait, marioMouth) now carries the look at the throne and the finger rise (draft 3's [M] business).
- **Room / view:** lighthouse (held) behind the window: brick-red, the lamp turning in the window behind him
- **Characters:** MARIO (right): looks at the throne (beat 1), his finger rises (finger 0 → 1 → 2 on 2s, beat 2), earnest
- **Action:** MARIO, right. He looks at the throne. His finger rises. f30: 'I've written up some thoughts.'
- **Line** `a4-27-14` MARIO: "I've written up some thoughts." [INVENTED] · f30–82 (52 f) · RECORDED
- **Sound:** SFX voice: mario
- **Gags / eggs:** The raised finger (his entrance pose).
- **Assets:** REUSE `cast.mario.portrait` (cast) · CHECK `room.lighthouse` (rooms-b) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 90 of 90 f · I · 4 events
- **Crosswalk:** v1 27.19

### 27.20 · PORTRAIT `[P2]` · 30 f (2 beats) · 15:54:03–15:55:09 · BOARD · C06 · REFRAME

- **Change:** MARIO and ADELINA as a [P2], she on the RIGHT (script). She takes the phone out of his hand. *(script: 2 beats)*
- **Room / view:** lighthouse (held) behind both windows
- **Characters:** MARIO (left window, silent): the phone leaves his hand · ADELINA (right window): takes it, brisk and warm (phone to her ear, throne on)
- **Action:** Both windows up. The phone leaves Mario's window at its inner edge; it arrives at Adelina's ear in hers (adelinaPortrait phone:'ear', throne:true).
- **Assets:** REUSE `cast.mario.portrait` (cast) · EXISTS `cast.adelina.portrait` (cast) · REUSE `kit.portrait-layout` (kits) · CHECK `room.lighthouse` (rooms-b)
- **Logged as:** PORTRAIT · faces + hands 30 of 30 f · I · 2 events
- **Notes:** BOARD QUERY (default: as scripted): the only pass-one frame with a left window in use, and Mario is silent in it. Everyone still SPEAKS from the right.
- **Crosswalk:** v1 27.20 · draft-3 lock 27.20

### 27.21 · CARD `CARD` · 60 f (1 bar) · 15:55:09–15:57:21 · BOARD · C06 · CARRY

- **Change:** Unchanged; rides the live [P2] (logs as the portrait it rides).
- **Room / view:** ADELINA name card over the live room
- **Characters:** ADELINA: card portrait (glasses pushed up, phone in hand)
- **Action:** 1-beat freeze print, then the card rides the live lighthouse for the rest of the bar.
- **On screen:** card `ADELINA` · card `IN PLAIN ENGLISH:` · card-stat `TRANSLATES DOOM INTO REVENUE`
- **Sound:** SFX freeze_hit_Bb (REUSE)
- **Assets:** NEW `kit.cards` (kits) · EXISTS `cast.adelina.portrait` (cast)
- **Logged as:** PORTRAIT (rides it) · faces + hands 60 of 60 f · CARD · 2 events
- **Crosswalk:** v1 27.21 · draft-3 lock 27.21

### 27.22 · PORTRAIT `[P2]` · 60 f (1 bar) · 15:57:21–16:00:09 · BOARD · C06 · REFRAME

- **Change:** Board 1's single [P] is the scripted [P2]: ADELINA right (speaking), MARIO left (silent).
- **Room / view:** lighthouse (held) behind both windows
- **Characters:** ADELINA (right): phone to her ear, warm; the smallest pause before 'no.'
- **Action:** Into the phone.
- **Line** `a4-27-15` ADELINA: "In plain English: no." [INVENTED] catchphrase · f4–42 (38 f) · RECORDED
- **Sound:** SFX voice: adelina
- **Gags / eggs:** 'In plain English:' (once per appearance).
- **Assets:** EXISTS `cast.adelina.portrait` (cast) · REUSE `cast.mario.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 27.22 · draft-3 lock 27.22

### 27.23 · INSERT-PROP `[ECU]` · 30 f (2 beats) · 16:00:09–16:01:15 · BOARD · C06 · REFRAME

- **Change:** Draft 3's [M] click is a prop insert (drawThroneHandset throne:false) on the same desk-insert plate. *(script: 2 beats)*
- **Room / view:** lighthouse · desk insert (the handset back in its cradle)
- **Action:** *Click.* The throne falls off the handset (3 drawings, a whole-pixel drop, it lands on its side).
- **Sound:** SFX NEW handset_click, NEW tiny_throne_clatter
- **Assets:** NEW `room.lighthouse.desk-insert` (rooms-b) · EXISTS `prop.throne-handset` (cast)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 2 events
- **Crosswalk:** v1 27.23 · draft-3 lock 27.23

### 27.24 · PORTRAIT `[P]` · 120 f (2 bars) · 16:01:15–16:06:15 · BOARD · C06 · REFRAME

- **Change:** The second phone gets MARIO's own [P]: the lighthouse window in the room behind his portrait window, the two rent meters spinning there, legible (board 1: a room wide + a [P]).
- **Room / view:** lighthouse (held) behind the window; the rent meters spin in the lighthouse window, OUTSIDE the right window's footprint
- **Characters:** MARIO (right): answers the second phone immediately (phone to ear), finger half-raised, worried and quick
- **Action:** f0: the second phone on the desk rings. Behind his window, through the lighthouse window, two rent meters spin (drum counters, 3 drawings): `NOZAMA · UP TO $4B` and `ELGOOG · UP TO $2B`. f20: Mario answers this one immediately. f30: 'Hi. Yes. We're very worried. How much?' (no breath between 'worried' and 'How much?').
- **Line** `a4-27-16` MARIO: "Hi. Yes. We're very worried. How much?" [INVENTED] · f30–97 (67 f) · RECORDED
- **On screen:** prop `NOZAMA · UP TO $4B` [V · SEP 25, 2023] · prop `ELGOOG · UP TO $2B` [V · OCT 27, 2023]
- **Sound:** SFX NEW phone_ring_chip (a different pitch), NEW meter_whir, voice: mario
- **Gags / eggs:** Misanthropic roast (camp 2): warns of race dynamics while banking the rent. Fairness floor: Mario roasted.
- **Assets:** REUSE `cast.mario.portrait` (cast) · CHECK `room.lighthouse` (rooms-b) · EXISTS `prop.rent-meters` (rooms-b) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 120 of 120 f · I · 5 events
- **Notes:** CHECK (rooms-b): the meters must sit clear of the right window (x 356-468, y 24-160) to read behind his [P]. 7:00 proof cut: this shot (script §8).
- **Crosswalk:** v1 27.24, 27.25 · draft-3 lock 27.24, 27.25

### 27.26 · UI-TILE-GRID `[SCR]` · 120 f (2 bars) · 16:06:15–16:11:15 · BOARD · C06 · CARRY

- **Change:** Unchanged (Mas as public record: a small figure on a security-camera tile).
- **Room / view:** lobby · security cam (drawLobbyCam, no clock)
- **Characters:** MAS: room sprite walking in (4-drawing walk on 2s), GUEST lanyard
- **Action:** INT. NOPEAI LOBBY — DAY, from the board's side on a security-camera tile. A familiar figure walks in wearing a `GUEST` lanyard (the same design Radnus handed the founders at 3:20). His post sits upside-down in the tile's corner (authored upside-down; held ≥ 84 f).
- **Post** `a4-27-17` MAS: "first and last time i ever wear one of these" [V · NOV 19, 2023] · f30–120 (held 90 f, needs 59)
- **Rail:** `NOV 19` types on at f0 (read ≥ 14 f; it persists)
- **On screen:** post `first and last time i ever wear one of these` [V · NOV 19, 2023] · prop `GUEST` (not must-read)
- **Sound:** SFX room_tone (lobby), NEW footsteps_soft
- **Gags / eggs:** The badge (meter): pays off when it is framed in the tag and in Ep12's 'second time.'
- **Assets:** EXISTS `room.lobby` (rooms-a) · EXISTS `cast.mas.stand` (cast) · EXISTS `prop.guest-lanyard` (kits) · EXISTS `kit.call-grid` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 4 events
- **Notes:** No timestamp or CAM clock on the security tile (an invented log never sits next to a real date). Read-load risk: upside-down text. Fallback: upright for 2 beats, then flips (authored drawing, not a rotation).
- **Crosswalk:** v1 27.26 · draft-3 lock 27.26

### 27.27 · WIDE `[W]` · 60 f (1 bar) · 16:11:15–16:14:03 · BOARD · C06 · RETIME

- **Change:** 45 f -> 1 bar (3.1 prints it). *(script: 1 bar)*
- **Room / view:** boardroom · Nov 19 · wide
- **Characters:** NELEH (standing), MADA (seat R), ALYI (window reflection), THE QUIET VOTE (laptop, seat L) · TTEMME: a new arrival, hoodie, headset mic, hourglass in hand, standing behind seat C
- **Action:** The spotlight swings off Rima's empty chair (seat C) and onto TTEMME, in 3 held positions. His nameplate on seat C is a sticky note: `CEO (TEMP)`.
- **Rail:** `NOV 19 · NIGHT` types on at f0 (read ≥ 23 f; it persists)
- **On screen:** prop `CEO (TEMP)`
- **Sound:** SFX NEW spotlight_clunk ×3
- **Assets:** CHANGED `room.boardroom` (rooms-a) · EXISTS `cast.ttemme.room` (cast) · EXISTS `cast.neleh.room` (cast) · EXISTS `cast.mada.room` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 4 events
- **Notes:** 'The four board members sit around the table': ALYI stays a reflection (he is always cut by a frame).
- **Crosswalk:** v1 27.27 · draft-3 lock 27.27

### 27.28 · CARD `CARD` · 60 f (1 bar) · 16:14:03–16:16:15 · BOARD · C06 · CARRY

- **Change:** Unchanged; rides the live [W] (logs as WIDE).
- **Room / view:** TTEMME name card over the live room
- **Characters:** TTEMME: card portrait (hourglass, headset)
- **Action:** 1-beat freeze print, then the card rides the live room for the rest of the bar.
- **On screen:** card `TTEMME` · card `CEO (72 HOURS).` · card-stat `TIME LEFT: 72:00:00`
- **Sound:** SFX freeze_hit_Db (REUSE)
- **Assets:** NEW `kit.cards` (kits) · EXISTS `cast.ttemme.portrait` (cast)
- **Logged as:** WIDE (rides it) · not a face or a hand · CARD · 2 events
- **Notes:** ttemme.md's card adds 'DEEPLY PLEASED.'; the script's `CEO (72 HOURS).` wins (writer handoff).
- **Crosswalk:** v1 27.28 · draft-3 lock 27.28

### 27.29 · PORTRAIT `[P]` · 60 f (1 bar) · 16:16:15–16:19:03 · BOARD · C06 · CARRY

- **Change:** Carried.
- **Room / view:** boardroom · Nov 19 (held) behind the window
- **Characters:** TTEMME (right): to camera-chat, eyes forward; a livestream chat column scrolls up the side of his window spamming `F` (egg)
- **Line** `a4-27-18` TTEMME: "Chat. I'm the CEO now." [INVENTED] · f4–46 (42 f) · RECORDED
- **Sound:** SFX voice: ttemme
- **Gags / eggs:** Egg: the `F` chat.
- **Assets:** EXISTS `cast.ttemme.portrait` (cast) · NEW `kit.post-ui` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 3 events
- **Notes:** The livestream site is never named or styled like a real one.
- **Crosswalk:** v1 27.29 · draft-3 lock 27.29

### 27.30 · INSERT-PROP `[ECU]` · 45 f (3 beats) · 16:19:03–16:21:00 · BOARD · C06 · REFRAME

- **Change:** Draft 3's [M] flip is a prop insert (drawHourglass lg, hourglassFlipAt) on the boardroom table insert (focus 'prop'). No hand drawn: not a face or a hand. *(script: 3 beats)*
- **Room / view:** boardroom · table insert (TABLE_INSERT.prop)
- **Action:** He sets the hourglass on the table and flips it (3 drawn states: upright, mid, flipped; never a rotation). Sand begins to fall, one pixel per beat.
- **Sound:** SFX NEW glass_set_down, NEW sand_tick (one per beat, very soft)
- **Gags / eggs:** The hourglass: 72 hours (runner to Ep7).
- **Assets:** EXISTS `prop.hourglass` (kits) · CHANGED `room.boardroom` (rooms-a)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 3 events
- **Crosswalk:** v1 27.30 · draft-3 lock 27.30

### 27.31 · PORTRAIT `[P]` · 60 f (1 bar) · 16:21:00–16:23:12 · BOARD · C06 · CARRY

- **Change:** Carried.
- **Room / view:** boardroom · Nov 19 (held) behind the window
- **Characters:** TTEMME (right): eyes DOWN at the sand; the chat column keeps scrolling
- **Line** `a4-27-19` TTEMME: "Chat… for how long?" [INVENTED] · f4–43 (39 f) · RECORDED
- **Sound:** SFX voice: ttemme, sand_tick
- **Gags / eggs:** Echo of Neleh's 'For how long?'.
- **Assets:** EXISTS `cast.ttemme.portrait` (cast)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 27.31 · draft-3 lock 27.31

### 27.32 · TWO-SHOT `[2S]` · 75 f (1 bar + 1 beat) · 16:23:12–16:26:15 · BOARD · C06 · REFRAME

- **Change:** NELEH and MADA in the [2S], the wall behind them (board 1: a room wide). *(script: 1 bar + 1 beat)*
- **Room / view:** boardroom · table medium plate, the slate wall + TASYA's door behind them
- **Characters:** NELEH and MADA (medium rigs), turning to the wall · TASYA: appears in the new door (the room sprite at medium distance, arm 'sign')
- **Action:** The boardroom wall behind them changes colour by one palette step, to MACROSOFT slate blue (wall mask remap). A door appears in it that wasn't there before (tasyaDoor 1 → 2), and opens (3 → 4), one state a beat. TASYA stands in it.
- **Rail:** `NOV 19 · 11:53 PM PT` types on at f0 (read ≥ 30 f; it persists)
- **Sound:** SFX NEW wall_step (a low paper-thump), NEW door_appear, NEW key_jangle
- **Gags / eggs:** The landlord arrives through architecture (he rarely enters; he's already in the walls).
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · CHANGED `room.boardroom` (rooms-a) · NEW `cast.neleh.medium` (cast) · NEW `cast.mada.medium` (cast) · EXISTS `cast.tasya.room` (cast) · EXISTS `prop.arrow-sign` (cast)
- **Logged as:** TWO-SHOT · faces + hands 75 of 75 f · I · 5 events
- **Crosswalk:** v1 27.32 · draft-3 lock 27.32

### 27.33 · PORTRAIT `[P]` · 90 f (1 bar + 2 beats) · 16:26:15–16:30:09 · BOARD · C06 · CARRY

- **Change:** Carried (the post read aloud with pleasure).
- **Room / view:** boardroom · slate (held) behind the window
- **Characters:** TASYA (right): reads his own post aloud, with pleasure; smile at the end; key ring in frame (roll-call portrait)
- **Action:** A small post pop-up in source casing sits beside his window as he reads it.
- **Line** `a4-27-20` TASYA: "a new advanced AI research team" [V · NOV 19-20, 2023] · f6–74 (68 f) · RECORDED
- **On screen:** post `a new advanced AI research team` [V · NOV 19–20, 2023] (not must-read)
- **Sound:** SFX voice: tasya, NEW key_jangle
- **Assets:** EXISTS `cast.tasya.portrait` (cast) · NEW `kit.post-ui` (kits)
- **Logged as:** PORTRAIT · faces + hands 90 of 90 f · I · 3 events
- **Crosswalk:** v1 27.33 · draft-3 lock 27.33

### 27.35 · TWO-SHOT `[2S]` · 30 f (2 beats) · 16:30:09–16:31:15 · BOARD · C06 · CHANGED

- **Change:** Tasya's real line lands straight on this [2S] (the desks insert is cut). Step 4 is blank BUT FOR HER QUESTION MARK. *(script: 2 beats)*
- **Room / view:** boardroom · table medium plate
- **Characters:** NELEH and MADA (medium rigs): look down at the blueprint
- **Action:** NELEH and MADA look down at the blueprint. Step 4 is blank but for her question mark.
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.neleh.medium` (cast) · NEW `cast.mada.medium` (cast) · EXISTS `kit.blueprint` (kits)
- **Logged as:** TWO-SHOT · faces + hands 30 of 30 f · I · 2 events
- **Notes:** Every real line lands on a listening face within 1 beat (§4.3 rule 5): the [2S] is it.
- **Crosswalk:** v1 27.35 · draft-3 lock 27.35

### 27.36 · TWO-SHOT `[2S]` · 75 f (1 bar + 1 beat) · 16:31:15–16:34:18 · BOARD · C06 · REFRAME

- **Change:** The button as a [2S] on the medium rigs (board 1: two portraits).
- **Room / view:** boardroom · table medium plate
- **Characters:** NELEH (medium rig, left of frame): brows 'query' · MADA (medium rig, right): the smallest pause before his answer
- **Action:** NELEH: 'Step four?' MADA: 'Good question.'
- **Line** `a4-27-21` NELEH: "Step four?" [INVENTED] · f3–24 (21 f) · RECORDED
- **Line** `a4-27-22` MADA: "Good question." [INVENTED] catchphrase · f32–59 (27 f) · RECORDED
- **Sound:** SFX voice: neleh, mada (MADA master read) · MUSIC Button on 'question.'; the sting of 28 lands on the next downbeat.
- **Gags / eggs:** MADA's 'Good question.' 2 of 3.
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.neleh.medium` (cast) · NEW `cast.mada.medium` (cast)
- **Logged as:** TWO-SHOT · faces + hands 75 of 75 f · I · 3 events
- **Notes:** Punch: a full beat after Mada's line, then the act-out sting on the downbeat.
- **Crosswalk:** v1 27.36 · draft-3 lock 27.36

## 28. CARD · INTERNAL ACT-OUT · [BASE] · — · side MAS · 16:34:18–16:37:21 · 75 f (printed 16:24.5–16:27.6, 1 bar + 1 beat)

*the door back (WHAT THEY DIDN'T KNOW).*

### 28.01 · CARD `[GFX]` · 75 f (1 bar + 1 beat) · 16:34:18–16:37:21 · MAS · C06 · CARRY

- **Change:** No picture change. The door back: pass two's rail names his side. *(script: 1 bar + 1 beat)*
- **Room / view:** full-frame act-out card
- **Action:** Black, with cream type, centred. Holds 1 bar + 1 beat.
- **Rail:** hidden
- **On screen:** act-card `WHAT THEY DIDN'T KNOW`
- **Sound:** SFX (none) · MUSIC MUSIC: sting, on the downbeat.
- **Assets:** NEW `kit.cards` (kits)
- **Logged as:** CARD · not a face or a hand · CARD · 1 events
- **Notes:** Internal act-out (T). In a told-twice both passes carry a side label: 29.00's rail ends `· HIS SIDE`.
- **Crosswalk:** v1 28.01 · draft-3 lock 28.01

## 29. THE FIVE DAYS, PASS TWO: HIS SIDE · [BASE] · I + S3 · side MAS · 16:37:21–18:16:00 · 2355 f (printed 16:27.6–17:59.9, pre-avalanche ≈ 52 s + the 16-bar avalanche)

*PASS TWO · HIS SIDE (rail: … · HIS SIDE).*

### 29.00 · INSERT-PROP `[ECU]` · 30 f (2 beats) · 16:37:21–16:39:03 · MAS · C07 · NEW

- **Change:** (Draft 3's shot, never boarded.) THE HOME SHOT: the glass on the dark-room desk. The rail names HIS SIDE (board call: it types on over the home shot, so the [2S]'s V.O. has the frame to itself). *(script: 2 beats)*
- **Room / view:** darkroom · desk close (drawDarkDesk {tally:3, glass:true, lanyard:true})
- **Action:** The glass on the dark-room desk, its water line one flat row of pixels. Nothing moves. f0: the rail types on `NOV 20, 2023 · ~2:06 AM PT · HIS SIDE` (36 glyphs, 50 f to read: it finishes reading at 29.01 f20) and persists.
- **Rail:** `NOV 20, 2023 · ~2:06 AM PT · HIS SIDE` types on at f0 (read ≥ 51 f; it persists)
- **Sound:** SFX room_tone (the dark room), server_hum (REUSE) · MUSIC Pass two's pulse: the same figure as pass one, from the other side (warmer, slower).
- **Gags / eggs:** We come back through the glass (§6.3).
- **Assets:** CHANGED `room.darkroom` (rooms-b) · EXISTS `prop.guest-lanyard` (kits) · EXISTS `prop.tally` (kits) · NEW `kit.cards` (kits)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 1 events
- **Notes:** Logged as a prop insert (no hand): the ECU kit's glass, not counted as a face or a hand (strict §4.2 logging). BOARD CALL vs the script: 3.1 prints the rail after the home shot; boarded ON it (f0) so the rail and the V.O. are not two must-reads at once (§5.2).
- **Crosswalk:** draft-3 lock 29.00

### 29.01 · TWO-SHOT `[2S]` · 90 f (1 bar + 2 beats) · 16:39:03–16:42:21 · MAS · C07 · CHANGED

- **Change:** + the lanyard laid SQUARE beside the glass, and his hand rests on his phone. V.O. D5 'i put the phone down.'. +2 beats vs the script: the new read (est. 54 f) must end a beat before the hard cut (§5.1). *(1 bar + 2 beats (script: 1 bar))*
- **Room / view:** darkroom · desk medium plate (the cyan cone, the rack's LEDs; the board's four-tile grid small in the monitor's corner)
- **Characters:** MAS (left third, 3/4, medium rig arm 'phone': his hand resting on the phone, face-down) · THE ORB (medium): at his shoulder, iris on the phone
- **Action:** Mas at the desk, the Orb at his shoulder, the GUEST lanyard laid square beside the glass, three marks in the wood. His hand rests on his phone. In the monitor's corner, small, is the board's four-tile grid (the one we just watched from the other side). f15: V.O. D5. Its text types at x 12, baseline y 198, on the desk's dark near edge / his hoodie. It ends ≥ 1 beat before the cut.
- **V.O.** `a4-29-vo1` MAS (V.O.) `[INVENTED · VO · D5]`: *i put the phone down.* · f15–69 (54 f) · NEW READ (est. 54 f) · caught by: MAS'S VERSION (29.01a) shows it too still; the hard cut to the same frame (29.03) shows the phone face-up and his thumb hearting
- **Sound:** SFX room_tone, server_hum (REUSE) · MUSIC Pass two's pulse thins to one instrument under the V.O.
- **Assets:** NEW `room.darkroom.medium` (rooms-b) · NEW `cast.mas.medium` (cast) · NEW `cast.orb.medium` (cast) · EXISTS `prop.guest-lanyard` (kits) · EXISTS `prop.tally` (kits) · EXISTS `cast.calltile` (cast) · NEW `kit.vo-line` (engine)
- **Logged as:** TWO-SHOT · faces + hands 90 of 90 f · I · 2 events
- **Notes:** If the recorded read is ≤ 42 f, this shot returns to the script's 1 bar with the V.O. at f0 (the editor's call).
- **Crosswalk:** v1 29.01 · draft-3 lock 29.01

### 29.01a · INSERT-HANDS `[ECU]` · 60 f (1 bar) · 16:42:21–16:45:09 · MAS · C07 · CHANGED

- **Change:** [MAS'S VERSION]: a MATCHING FRAME of 29.03 (same size, same hand); the phone FACE-DOWN; NOTHING else in the frame moves (hold the rack's LEDs and the Orb's iris at the frame's edge); the keynote-reel piano; NO RIM; six fingers as an optional egg. HARD CUT on the downbeat. *(script: 1 bar)*
- **Room / view:** darkroom · desk close (drawDarkDesk {phone:'down'}), the SAME framing as 29.03 · *[MAS'S VERSION] (D5): a script tag, never an on-screen label*
- **Characters:** MAS: hand only, resting on the face-down phone, calm: cast.mas.hand.six (six fingers; a five-finger copy exists for the G2 A/B)
- **Action:** His hand on the phone, the phone face-down on the desk. Nothing in the frame moves: not the rack's LEDs at the frame's edge, not the Orb's iris (the stillness flag freezes every other layer for the bar). Under it, a soft keynote-reel piano (an original cue; his brand). Egg for freeze-framers: the hand has six fingers. Nothing depends on counting them. HARD CUT on the downbeat; the piano stops mid-phrase.
- **Switch:** `kit.mas-version: stillness flag (every non-hand layer frozen at f0 for the bar); NO present-day rim; no palette switch`
- **Sound:** SFX (room tone held too: the stillness is total) · MUSIC NEW keynote_reel_piano (1 bar, original, no borrowed melody), killed mid-phrase by the hard cut.
- **Gags / eggs:** Too still to be true. Egg: six fingers (A/B at G2; ruling 3 default: keep as an egg).
- **Assets:** CHANGED `room.darkroom` (rooms-b) · NEW `cast.mas.hand.six` (cast) · NEW `kit.mas-version` (engine) · NEW `score.keynote-piano` (score)
- **Logged as:** INSERT-HANDS · faces + hands 60 of 60 f · M · 2 events
- **Notes:** The correction must read on the matching-frame cut alone, without counting fingers (pov-changes §4). Ruling 3 fallback: if THE OUTSIDER marks '?', D5 is cut from the pilot: this shot and the V.O. go (−1 bar + the line), and 29.03 follows 29.01 directly.
- **Crosswalk:** draft-3 lock 29.01a

### 29.03 · INSERT-HANDS `[ECU]` · 120 f (2 bars) · 16:45:09–16:50:09 · MAS · C07 · REFRAME

- **Change:** The SAME FRAME as MAS'S VERSION, five fingers: the phone face-up and still on the desk, Rima's post legible on its screen the whole time (the full-bleed Rima [POV] is CUT into it). First Tick on the cut's downbeat; 8 identical posts, 8 taps on the beat. (Never 8 → 6: the writer.) *(script: 2 bars)*
- **Room / view:** darkroom · desk close (drawDarkDesk + phone FACE-UP with a feed painter), the same framing as 29.01a
- **Characters:** MAS: hand only (cast.mas.hand.heart-tap): five fingers, his thumb on the face-up phone
- **Action:** f0 (the cut's downbeat): his thumb taps a heart. *Tick.* On the phone's screen, a post from RIMA (avatar + name legible). The same post comes again from another avatar, word for word. *Tick.* Again. *Tick.* Eight identical posts stack up the feed, one per beat, the same words on the screen the whole time, and he hearts every one ON the beat, like a man playing a rhythm game he has already beaten.
- **Post** `a4-29-01` RIMA: "NopeAI is nothing without its people" [V · NOV 20, 2023, ~2:06 AM PT] · f0–120 (held 120 f, needs 50)
- **On screen:** post `NopeAI is nothing without its people` [V · NOV 20, 2023, ~2:06 AM PT] · ui `RIMA TAMURI`
- **Sound:** SFX NEW heart_tick ×8 (on the beat; the first on f0) · MUSIC The ticks ARE the rhythm; the score locks to them.
- **Gags / eggs:** The rhythm game. 'i put the phone down.': it is down. Face-up.
- **Assets:** CHANGED `room.darkroom` (rooms-b) · NEW `cast.mas.hand.heart-tap` (cast) · CHANGED `prop.phone` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** INSERT-HANDS · faces + hands 120 of 120 f · M · 10 events
- **Notes:** The reposting avatars are generic; handles are illegible glyph noise (private individuals). Rima's post needs 50 f; it is on screen 120 f.
- **Crosswalk:** v1 29.02, 29.03 · draft-3 lock 29.03

### 29.04 · TWO-SHOT `[2S]` · 60 f (1 bar) · 16:50:09–16:52:21 · MAS · C07 · CHANGED

- **Change:** 1 bar (was 2 beats): the iris follows the taps; on beat 3 it STEPS OFF THE PHONE ONTO THE GUEST LANYARD and holds. This bar is the clearance after the real post. *(script: 1 bar)*
- **Room / view:** darkroom · desk medium plate
- **Characters:** MAS (medium rig, arm 'phone'): still · THE ORB (medium): iris on the phone (beats 1-2), then on the GUEST lanyard (beat 3), held
- **Action:** The Orb's iris has followed every tap. On the bar's third beat it steps off the phone and onto the `GUEST` lanyard beside the glass, and stays there.
- **Sound:** SFX orb_servo (REUSE, one step) · MUSIC Out.
- **Assets:** NEW `room.darkroom.medium` (rooms-b) · NEW `cast.mas.medium` (cast) · NEW `cast.orb.medium` (cast) · EXISTS `prop.guest-lanyard` (kits)
- **Logged as:** TWO-SHOT · faces + hands 60 of 60 f · I · 2 events
- **Notes:** The Orb is on the lanyard BEFORE the V.O. (D3: it never hears the line).
- **Crosswalk:** v1 29.04 · draft-3 lock 29.04

### 29.10 · PORTRAIT `[P]` · 75 f (1 bar + 1 beat) · 16:52:21–16:56:00 · MAS · C07 · REORDER

- **Change:** The Orb's [P] now HOLDS ON THE LANYARD (it looked at the check) and comes BEFORE the letter. V.O. D3 'the badge was a joke.' plays over it, a bar clear of Rima's post; HOLD 1 BEAT after the line.
- **Room / view:** darkroom (held) behind the window; the left of frame is the dark room (the V.O. band on shadow)
- **Characters:** THE ORB (right window): iris on the lanyard, held (it does not react to the line)
- **Action:** f0: THE ORB, right, still on the lanyard. V.O. D3 (text at x 12, baseline y 198, on the dark room's shadow). After the line: HOLD 1 BEAT.
- **V.O.** `a4-29-vo2` MAS (V.O.) `[INVENTED · VO · D3]`: *the badge was a joke.* · f0–54 (54 f) · NEW READ (est. 54 f) · retire draft 2's on-mic a4-29-02 · caught by: the Orb is already on the lanyard (29.04, 29.10); he answers its look aloud: 'mostly.' (29.10a)
- **Sound:** SFX server_hum (low) · MUSIC Nothing.
- **Gags / eggs:** The Orb is already looking at what his account just shrank.
- **Assets:** NEW `cast.orb.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits) · NEW `kit.vo-line` (engine)
- **Logged as:** PORTRAIT · faces + hands 75 of 75 f · I · 1 events
- **Notes:** §4.3 rule 5 does not bite: 'mostly.' is invented, and the V.O. is never heard in the world.
- **Crosswalk:** v1 29.10 · draft-3 lock 29.10

### 29.10a · TWO-SHOT `[2S]` · 60 f (1 bar) · 16:56:00–16:58:12 · MAS · C07 · REORDER

- **Change:** 'mostly.' + HOLD 1 BEAT now comes BEFORE the letter (answers the Orb's look at the lanyard). Cut on the next downbeat to RAIL: THE LETTER.
- **Room / view:** darkroom · desk medium plate
- **Characters:** MAS (medium rig, head 'front' toward the Orb): the one true word · THE ORB (medium): on the lanyard
- **Action:** Mas, aloud, to the Orb: 'mostly.' HOLD 1 BEAT. Cut on the next downbeat.
- **Line** `a4-29-03` MAS: "mostly." [INVENTED] · f6–29 (23 f) · RECORDED · RE-TAKE RECOMMENDED (it now answers the Orb's look at the lanyard, after a 1-beat hold)
- **Sound:** SFX voice: mas-manalt (re-take recommended)
- **Gags / eggs:** The one true word (to the Orb).
- **Assets:** NEW `room.darkroom.medium` (rooms-b) · NEW `cast.mas.medium` (cast) · NEW `cast.orb.medium` (cast) · EXISTS `prop.guest-lanyard` (kits)
- **Logged as:** TWO-SHOT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 29.10 · draft-3 lock 29.10a

### 29.05 · UI-TILE-GRID `[POV]` · 75 f (1 bar + 1 beat) · 16:58:12–17:01:15 · MAS · C07 · REORDER

- **Change:** The letter now comes AFTER 'mostly.'. *(script: 1 bar + 1 beat)*
- **Room / view:** the monitor, full-bleed: the counter
- **Action:** `THE LETTER`. A counter on the monitor rolls like the odometer from launch night: 505 · 650 · 700 · 745 / 770, one stop per beat. At 745 it stops, with a *clunk* we recognise. Hold.
- **Rail:** `THE LETTER` types on at f0 (read ≥ 18 f; it persists)
- **On screen:** ui `505 · 650 · 700 · 745 / 770` [V]
- **Sound:** SFX odometer_ratchet (REUSE), the drill's clunk (REUSE whatever sc 6 locks)
- **Gags / eggs:** The odometer rhyme (sc 6).
- **Assets:** EXISTS `prop.odometer` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 5 events
- **Crosswalk:** v1 29.05 · draft-3 lock 29.05

### 29.06 · CARD `[GFX]` · 180 f (3 bars) · 17:01:15–17:09:03 · MAS · C07 · REORDER

- **Change:** Moved with the letter. *(script: 3 bars)*
- **Room / view:** FULL-SCREEN DATED QUOTE CARD (the employee letter)
- **Action:** Hard cut to the dated quote card. Hold 3 bars (read ≥ 126 f).
- **Rail:** hidden
- **On screen:** quote-card `"…unable to work for or with people that lack competence, judgment and care for our mission and employees"` [V · NOV 20, 2023] · quote-card `— THE EMPLOYEES' LETTER TO THE NOPEAI BOARD · NOV 20, 2023`
- **Sound:** SFX NEW card_thud · MUSIC 3-bar card: held, no melody.
- **Assets:** NEW `kit.cards` (kits)
- **Logged as:** CARD · not a face or a hand · CARD · 1 events
- **Crosswalk:** v1 29.06 · draft-3 lock 29.06

### 29.07 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 17:09:03–17:11:15 · MAS · C07 · REFRAME

- **Change:** The signature list full-bleed on the monitor (board 1: a medium room crop with the Orb in it); the Orb's look is its own [P] (29.07a). *(script: 1 bar)*
- **Room / view:** the monitor, full-bleed: the signature list
- **Action:** The letter's signature list, scrolling (whole-pixel). It stops for 2 beats on one name: `ALYI (REPORTED)`.
- **On screen:** ui `ALYI (REPORTED)` [K] needs a facts row (open question 5)
- **Sound:** SFX NEW text_tick (the scroll)
- **Assets:** NEW `kit.post-ui` (kits) · EXISTS `cast.calltile` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Notes:** Every other row of the list is illegible glyph noise: employees are private individuals.
- **Crosswalk:** v1 29.07 · draft-3 lock 29.07

### 29.07a · PORTRAIT `[P]` · 60 f (1 bar) · 17:11:15–17:14:03 · MAS · C07 · NEW

- **Change:** (Draft 3's shot, never boarded.) The Orb's beat: iris to the name, to Alyi's thumbnail in the monitor's corner, back to the name. Chime. *(script: 1 bar)*
- **Room / view:** darkroom (held) behind the window
- **Characters:** THE ORB (right window): iris to the name, to Alyi's mini tile, back (3 held drawings, a servo each)
- **Action:** THE ORB, right. Its iris goes to the name, then to Alyi's thumbnail in the monitor's corner, then back to the name. *Chime.*
- **Sound:** SFX orb_servo ×3 (REUSE), the Orb's two-note chip chime on F (sc 18's)
- **Gags / eggs:** The Orb's double-take (no blink).
- **Assets:** NEW `cast.orb.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 3 events
- **Notes:** No V.O. and no Mas tell on (REPORTED) material: this beat is the Orb's.
- **Crosswalk:** v1 29.07 · draft-3 lock 29.07a

### 29.08 · TWO-SHOT `[2S]` · 90 f (1 bar + 2 beats) · 17:14:03–17:17:21 · MAS · C07 · CHANGED

- **Change:** The check lands as PURE RECORD, followed directly by Gerg's tile (no V.O., no Mas look near it). Its front reads in the [2S] (the separate front insert is gone): +2 beats vs the script for the text's read time. *(1 bar + 2 beats (script: 1 bar))*
- **Room / view:** darkroom · desk medium plate (the rack's tray slot)
- **Characters:** MAS and THE ORB (medium rigs): still; neither looks at it
- **Action:** DELIVERY. The server rack's slot whirs and ejects a giant check, tray-first, across the desk between them (4 held positions on 2s, landing by f24), front up at [2S] scale: `EVIRHT · TENDER OFFER @ ~$86B VALUATION`. Beat 4 (f45): stamped across the middle in red: `VOID IF CEO MISSING` (lands kicked 1 px). Hold to the cut. (Eggs on the back, zero read load, as board 1.)
- **On screen:** prop `EVIRHT · TENDER OFFER @ ~$86B VALUATION` [V/K] re-verify before lock · stamp `VOID IF CEO MISSING` [INVENTED] prop · prop `SUPERHOST. RETURNS KEYS IN 5 DAYS. · ADMIT ONE · NOPEAI LP · 2019` eggs (not must-read)
- **Sound:** SFX NEW rack_tray_whir, paper_whip (REUSE), rubber_stamp_C (REUSE)
- **Gags / eggs:** The money chorus: the check that only clears with him.
- **Assets:** NEW `room.darkroom.medium` (rooms-b) · NEW `cast.mas.medium` (cast) · NEW `cast.orb.medium` (cast) · NEW `prop.check-evirht` (kits)
- **Logged as:** TWO-SHOT · faces + hands 90 of 90 f · I · 4 events
- **Notes:** Pure record: nothing of his (no line, no look, no hand) within a bar of it (pov-changes §4). It is also the buffer after ALYI (REPORTED). The check's front must be legible at [2S] scale (≈ 190 px of 5-px type): prop.check-evirht is drawn for this size.
- **Crosswalk:** v1 29.08, 29.09 · draft-3 lock 29.08

### 29.11 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 17:17:21–17:20:09 · MAS · C08 · REFRAME

- **Change:** Gerg's video tile full-bleed on the monitor, big enough to act in (board 1: the right window in video-tile chrome). A tile ≥ half the frame counts as a face.
- **Room / view:** the monitor, full-bleed: Gerg's video tile
- **Characters:** GERG (video tile, ≥ half frame): laptop open, typing, the green glow under his chin
- **Action:** A video tile opens on the monitor (3 held steps), big enough to act in: GERG, laptop open, typing. He is on the monitor, not in the room: 'One sec. Compiling.'
- **Line** `a4-29-04` GERG: "One sec. Compiling." [INVENTED] catchphrase · f8–38 (30 f) · RECORDED
- **Sound:** SFX NEW call_connect, typing_soft (REUSE) under Gerg, voice: gerg-mockbran, mas-manalt
- **Gags / eggs:** 'Just in case.'
- **Assets:** EXISTS `cast.gerg.portrait` (cast) · EXISTS `cast.calltile` (cast)
- **Logged as:** UI-TILE-GRID · faces + hands 60 of 60 f · I · 3 events
- **Notes:** X1: Gerg joins by video, never in the room.
- **Crosswalk:** v1 29.11 · draft-3 lock 29.11

### 29.11a · PORTRAIT `[P]` · 60 f (1 bar) · 17:20:09–17:22:21 · MAS · C08 · SPLIT

- **Change:** Split: MAS, left.
- **Room / view:** darkroom (held) behind the window
- **Characters:** MAS (left)
- **Action:** MAS, left: 'what are you building?'
- **Line** `a4-29-05` MAS: "what are you building?" [INVENTED] · f4–52 (48 f) · RECORDED
- **Sound:** SFX NEW call_connect, typing_soft (REUSE) under Gerg, voice: gerg-mockbran, mas-manalt
- **Gags / eggs:** 'Just in case.'
- **Assets:** REUSE `cast.mas.portrait` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Notes:** X1: Gerg joins by video, never in the room.
- **Crosswalk:** v1 29.11 · draft-3 lock 29.11a

### 29.11b · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 17:22:21–17:25:09 · MAS · C08 · SPLIT

- **Change:** Split: Gerg's tile.
- **Room / view:** the monitor, full-bleed: Gerg's video tile
- **Characters:** GERG (video tile): typing
- **Action:** Gerg's tile: 'The company. Again. Just in case.'
- **Line** `a4-29-06` GERG: "The company. Again. Just in case." [INVENTED] · f3–51 (48 f) · RECORDED
- **Sound:** SFX NEW call_connect, typing_soft (REUSE) under Gerg, voice: gerg-mockbran, mas-manalt
- **Gags / eggs:** 'Just in case.'
- **Assets:** EXISTS `cast.gerg.portrait` (cast) · EXISTS `cast.calltile` (cast)
- **Logged as:** UI-TILE-GRID · faces + hands 60 of 60 f · I · 2 events
- **Notes:** X1: Gerg joins by video, never in the room.
- **Crosswalk:** v1 29.11 · draft-3 lock 29.11b

### 29.12q · FALLAWAY `[PF]` · 30 f (2 beats) · 17:25:09–17:26:15 · MAS · C08 · CHANGED

- **Change:** The quiet beat is now an EXCHANGED LOOK (PF 2 · glance 1 · PF 1 = 4 beats, −1 beat overall): he watches. *(script: QUIET BEAT 1 of 3 · 2 beats)*
- **Room / view:** darkroom (fallen away: the monitor's green + his cyan only)
- **Characters:** MAS (left): watches Gerg type (eyes on the monitor)
- **Action:** QUIET BEAT (4 beats). MAS, left. The room falls away until only the monitor's green and his cyan are left. He watches Gerg type. Keycaps click.
- **Sound:** SFX typing_soft (REUSE: Gerg's keycaps through the monitor), room_tone · MUSIC None (no line, no gag, no sting).
- **Assets:** REUSE `cast.mas.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine)
- **Logged as:** FALLAWAY · faces + hands 30 of 30 f · quiet beat (q) · I · 1 events
- **Notes:** Logged q. Released by a laugh within 1 bar: Tasya's door on 'asked' (29.12).
- **Crosswalk:** draft-3 lock 29.12q

### 29.11c · UI-TILE-GRID `[POV]` · 15 f (1 beat) · 17:26:15–17:27:06 · MAS · C08 · REORDER

- **Change:** Gerg's glance moves INSIDE the quiet beat: his tile fills the frame at medium tile scale; he glances up into his camera, at Mas (his real face). *(script: QUIET BEAT 2 of 3 · 1 beat)*
- **Room / view:** Gerg's tile at medium tile scale (full-bleed)
- **Characters:** GERG (medium tile, fills the frame): glances up into his camera (expression swap), 1 beat
- **Action:** Gerg's tile fills the frame at medium tile scale. He glances up into his camera, at Mas. (His real face.)
- **Sound:** SFX (the typing stops for the beat)
- **Assets:** NEW `cast.gerg.medium-tile` (cast) · EXISTS `cast.calltile` (cast)
- **Logged as:** UI-TILE-GRID · faces + hands 15 of 15 f · quiet beat (q) · M · 1 events
- **Crosswalk:** draft-3 lock 29.11c

### 29.12r · FALLAWAY `[PF]` · 15 f (1 beat) · 17:27:06–17:27:21 · MAS · C08 · NEW

- **Change:** NEW (3.1): MAS, left, LOOKING BACK; on the monitor behind his window, Gerg is typing again. *(script: QUIET BEAT 3 of 3 · 1 beat)*
- **Room / view:** darkroom (fallen away) behind the window; the monitor (with Gerg's tile, typing) visible beyond it
- **Characters:** MAS (left): looking back (eyes to camera-right, the monitor)
- **Action:** MAS, left, looking back. On the monitor behind his window, Gerg is typing again.
- **Sound:** SFX typing_soft (resumes)
- **Assets:** REUSE `cast.mas.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine) · EXISTS `cast.gerg.portrait` (cast)
- **Logged as:** FALLAWAY · faces + hands 15 of 15 f · quiet beat (q) · I · 1 events
- **Crosswalk:** new

### 29.12 · TWO-SHOT `[2S]` · 135 f (2 bars + 1 beat) · 17:27:21–17:33:12 · MAS · C08 · REFRAME

- **Change:** Board 1's dark-room wide is a [2S] that holds the whole back wall (so no wide is needed). Out of the quiet beat: V.O. D8. RETIME: the door's FIRST held step lands on 'asked' (three held steps); Tasya ≥ 1 beat after the line; no music under either.
- **Room / view:** darkroom · desk medium plate framed to hold the back wall (drawDarkRoom blueDoor 1 → 3, key in the lock)
- **Characters:** MAS and THE ORB (medium rigs): still · the slate-blue door: steps up out of the shadow, 3 held steps, a key already in its lock
- **Action:** f0: V.O. D8 (text at x 12, baseline y 198, on the desk's shadow). f53 (on 'asked'): a slate-blue door takes its FIRST held step up out of the shadow in the back wall; steps 2 and 3 at f68 and f83. A key is already in its lock. It's the door the board watched open at 11:53, now in his wall. f90 (≥ 1 beat after the line): TASYA's voice comes warmly from the other side: 'Everyone is welcome.' Cut at once on its end.
- **Line** `a4-29-07` TASYA: "Everyone is welcome." [INVENTED] (short form of his 'Everyone is welcome. Rent is due on the first.') · f90–126 (36 f) · RECORDED
- **V.O.** `a4-29-vo3` MAS (V.O.) `[INVENTED · VO · D8]`: *gerg never waits to be asked.* · f0–74 (74 f) · SCRATCH (the editor's take; same words, no re-read) · caught by: not caught: released by Tasya's door stepping up on 'asked' (29.12)
- **Sound:** SFX NEW door_appear ×3 (wall_step on each held step), voice: tasya (O.S., through a door) · MUSIC None under either line.
- **Gags / eggs:** The landlord's door is in every room; it steps up on 'asked' (the laugh that releases the quiet beat).
- **Assets:** NEW `room.darkroom.medium` (rooms-b) · CHANGED `room.darkroom` (rooms-b) · NEW `cast.mas.medium` (cast) · NEW `cast.orb.medium` (cast) · NEW `kit.vo-line` (engine)
- **Logged as:** TWO-SHOT · faces + hands 135 of 135 f · I · 5 events
- **Notes:** X1: nobody enters Mas's room. The door stays shut; the key stays in the lock. D8 plants 'to be asked' for Ep12; its payoff shot is 30.20a.
- **Crosswalk:** v1 29.12 · draft-3 lock 29.12

### 29.13 · PORTRAIT `[P]` · 60 f (1 bar) · 17:33:12–17:36:00 · MAS · C08 · RETIME

- **Change:** 'leave it open.' AT ONCE on 'Everyone is welcome.' (the three eyelines are CUT: at a real event his surface stays blank).
- **Room / view:** darkroom (held, the blue door behind) behind the window
- **Characters:** MAS (left): level; no eye darts
- **Action:** MAS, left, at once: 'leave it open.'
- **Line** `a4-29-08` MAS: "leave it open." [INVENTED] · f4–41 (37 f) · RECORDED
- **Sound:** SFX voice: mas-manalt
- **Gags / eggs:** Arc step: 'leave it open.'
- **Assets:** REUSE `cast.mas.portrait` (cast) · CHANGED `room.darkroom` (rooms-b)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Notes:** No eyelines before it (pov-changes §4). From here the tiles fall his way, and he has stopped narrating.
- **Crosswalk:** v1 29.13 · draft-3 lock 29.13

### 29.14 · UI-TILE-GRID `[POV]` · 240 f (4 bars) · 17:36:00–17:46:00 · MAS · C09 · CARRY

- **Change:** Unchanged. *(script: S3 phrase 1)*
- **Room / view:** the monitor, full-bleed: the board grid · G4 full frame (the monitor)
- **Action:** THE TILE AVALANCHE (S3), PHRASE 1. The board's grid fills the monitor. Bar 1: at the top edge of the screen one employee tile appears, small (a face in a square). Beat: another. Bars 2-4: hundreds begin to fall, each a held drawing (scale by repetition), stacking on the grid the way puzzle pieces stack, pushing.
- **Sound:** SFX NEW tile_clack (layered, density rising; never a roar) · MUSIC S3: 16 bars. Phrase 1 builds.
- **Gags / eggs:** The heart avalanche's kit, reused: pass two answers pass one.
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `kit.call-grid` (kits)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 5 events
- **Notes:** S3: 16 bars on the falling-stack kit, full-bleed on his monitor: we watch it with him.
- **Crosswalk:** v1 29.14 · draft-3 lock 29.14

### 29.15 · UI-TILE-GRID `[POV]` · 120 f (2 bars) · 17:46:00–17:51:00 · MAS · C09 · CARRY

- **Change:** Unchanged; ALYI's tile fills half the frame for the 1 beat it resists (logged as a face for that beat). *(script: S3 phrase 2a)*
- **Room / view:** the monitor, full-bleed: the board grid · the stack presses
- **Characters:** ALYI tile (reflection)
- **Action:** PHRASE 2, bars 1-2. The stack presses on the board's row. ALYI's tile is shoved sideways, resists for one beat (1-px shudder on 2s), and slides off the edge of the screen.
- **Sound:** SFX NEW tile_scrape
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `cast.alyi.portrait` (cast)
- **Logged as:** UI-TILE-GRID · faces + hands 15 of 120 f · S-rep · 3 events
- **Crosswalk:** v1 29.15 · draft-3 lock 29.15

### 29.16 · UI-TILE-GRID `[POV]` · 120 f (2 bars) · 17:51:00–17:56:00 · MAS · C09 · CARRY

- **Change:** Unchanged. *(script: S3 phrase 2b)*
- **Room / view:** the monitor, full-bleed: the board grid · the stack presses
- **Characters:** NELEH tile: mouth moving (bust visemes), brows 'worry'
- **Action:** PHRASE 2, bars 3-4. NELEH's tile follows, her footnotes scattering like sparks. She speaks as it goes, cut off mid-word, and she's gone.
- **Line** `a4-29-09` NELEH: "Has anyone read the char—" [INVENTED] · f20–60 (40 f) · RECORDED
- **Sound:** SFX NEW tile_scrape, voice: neleh (cut hard on the dash)
- **Gags / eggs:** 'Has anyone read the char—'
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `cast.neleh.tile` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 3 events
- **Crosswalk:** v1 29.16 · draft-3 lock 29.16

### 29.17 · UI-TILE-GRID `[POV]` · 180 f (3 bars) · 17:56:00–18:03:12 · MAS · C09 · RETIME

- **Change:** 4 bars -> 3 bars: the phrase's last bar is the [PF] 29.17a. *(script: S3 phrase 3a)*
- **Room / view:** the monitor, full-bleed: the board grid · faces
- **Action:** PHRASE 3. THE QUIET VOTE's black tile is pushed out without a sound (bar 1). The employee tiles keep coming (bars 2-3). The whole screen is faces now, 745 of them, with one gap left in the bottom row (bar 4, hold).
- **Sound:** SFX (the black tile leaves in total silence: duck everything 1 beat), NEW tile_clack (thinning)
- **Gags / eggs:** The quiet vote leaves quietly. Egg for freeze-framers: exactly 745 faces.
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `cast.quietvote` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 4 events
- **Crosswalk:** v1 29.17 · draft-3 lock 29.17

### 29.17a · FALLAWAY `[PF]` · 60 f (1 bar) · 18:03:12–18:06:00 · MAS · C09 · CHANGED

- **Change:** (Draft 3's shot, never boarded.) The S3's cut to a face; lighting note on the ROOM: it steps down until the monitor's 745 faces are its only light (no face relight). *(script: S3 phrase 3b (bar 4))*
- **Room / view:** darkroom (held behind the window, stepped down to the wall of faces)
- **Characters:** MAS (left): watching the one gap
- **Action:** MAS, left, the room stepped down until the 745 small faces on the monitor are its only light, watching the one gap.
- **Sound:** SFX NEW tile_clack (thinning)
- **Assets:** REUSE `cast.mas.portrait` (cast) · CHANGED `room.darkroom` (rooms-b) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine)
- **Logged as:** FALLAWAY · faces + hands 60 of 60 f · I · 1 events
- **Notes:** Movement 4: the S3 cuts to a face at least every 8 bars (this one, and 29.15's half-frame beat).
- **Crosswalk:** draft-3 lock 29.17a

### 29.18 · UI-TILE-GRID `[POV]` · 120 f (2 bars) · 18:06:00–18:11:00 · MAS · C09 · RETIME

- **Change:** MADA is held half-frame for 1 BEAT (was 2): the press runs a beat longer; the card lands on the next downbeat (the phrase stays 4 bars). *(script: S3 phrase 4a (2 bars))*
- **Room / view:** the monitor, full-bleed: the gap
- **Characters:** MADA tile: arms folded, spinner turning, wedged in the gap
- **Action:** PHRASE 4, bars 1-2. In the gap is MADA's tile: arms folded, spinner turning, wedged in. Every tile around him presses (1-px nudges toward him on each beat). He does not move. Bar 2, beat 4 (f105): the frame holds on him, HALF-FRAME, for 1 beat (his real face; the first time Mas has watched someone else be as still as he is).
- **Sound:** SFX NEW tile_press (soft creaks on the beat)
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `cast.mada.tile` (cast)
- **Logged as:** UI-TILE-GRID · faces + hands 15 of 120 f · S-rep · 3 events
- **Crosswalk:** v1 29.18 · draft-3 lock 29.18

### 29.19 · CARD `CARD` · 60 f (1 bar) · 18:11:00–18:13:12 · MAS · C09 · CARRY

- **Change:** Lands on the next downbeat after the 1-beat hold. No line: the stat is the joke. *(script: S3 phrase 4b)*
- **Room / view:** MADA name card over the tile wall
- **Characters:** MADA: card portrait, arms folded, spinner
- **Action:** 1-beat freeze print, then the card rides the live wall. No line: the stat is the joke.
- **On screen:** card `MADA` · card `LAST FIRER STANDING` · card-stat `ANSWERS GIVEN: 0`
- **Sound:** SFX freeze_hit_F (REUSE)
- **Assets:** NEW `kit.cards` (kits) · EXISTS `cast.mada.portrait` (cast)
- **Logged as:** UI-TILE-GRID (rides it) · not a face or a hand · CARD · 2 events
- **Crosswalk:** v1 29.19 · draft-3 lock 29.19

### 29.20 · UI-TILE-GRID `[POV]` · 60 f (1 bar) · 18:13:12–18:16:00 · MAS · C09 · CARRY

- **Change:** Unchanged. *(script: S3 phrase 4c)*
- **Room / view:** the monitor, full-bleed: the gap
- **Action:** Hold. 745 faces press; the spinner turns; nothing happens. The phrase ends.
- **Sound:** SFX (tile creaks, fading) · MUSIC S3 resolves.
- **Assets:** EXISTS `kit.falling-stack` (kits) · EXISTS `cast.mada.tile` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · S-rep · 1 events
- **Crosswalk:** v1 29.20 · draft-3 lock 29.20

## 30. THE RETURN · [BASE] (+[2-TONE FREEZE] full, TERB) · I + S2 · side MAS · 18:16:00–19:35:09 · 1905 f (printed 17:59.9–19:16.8, ≈ 77 s)

*his POV; no V.O. in the return.*

### 30.01 · PORTRAIT `[P2]` · 240 f (4 bars) · 18:16:00–18:26:00 · MAS · C10 · REFRAME

- **Change:** ONE [P2]: MAS left at his end desk; ALYI right, the door frame cutting his window. The [M] and the thumb-hearting [ECU] are CUT (−6 beats vs draft 3). Three hearts rise out of Mas's window OFF the beat; the violin stops dead on the first. HOLD 2 BEATS in room tone (ruling 6 default). *(script: 4 bars)*
- **Room / view:** bullpen · back wall (held) behind both windows (drawBullpen door 'crack', iou:true)
- **Characters:** MAS (left window, x12 y24): at his end desk; his face does not change · ALYI (right window): in the gap of the conference-room door, the frame cutting his window; reads his post; then looks UP at the hearts (expression swap)
- **Action:** f0: both windows up. The first frame in the act that holds Mas and the man who fired him. MUSIC: one sad violin, played straight, UNDER THE POST ONLY. f15: ALYI reads his post from the doorway (a small post pop-up in source casing beside his window). f144 / f156 / f171 (at the post's own pace, OFF the grid, uneven): three red hearts rise out of Mas's window [V: he replied with three hearts]. The violin stops dead on the first (f144). They cross the gap and hang at the edge of Alyi's window (by ~f188). Mas's face doesn't change. f190: Alyi looks up at them (expression swap). He doesn't step out. HOLD 2 BEATS, room tone only (f190-219; his real face). f220: the yellowed note taped to the door frame at his shoulder flutters: `IOU: 20% COMPUTE` (2 drawings). Cut at f240.
- **Line** `a4-30-01` ALYI: "I deeply regret my participation in the board's actions." [V · NOV 20, 2023] · f15–140 (125 f) · RECORDED
- **Rail:** `NOV 20, 2023` types on at f0 (read ≥ 21 f; it persists)
- **On screen:** post `I deeply regret my participation in the board's actions.` [V · NOV 20, 2023] (read aloud) (not must-read) · prop `IOU: 20% COMPUTE` egg · [V] Jul 5, 2023 pledge (not must-read)
- **Sound:** SFX voice: alyi (post, read from the doorway; hall on a send), heart_gliss ×3 (REUSE: at the hearts' own pace, OFF the grid), room_tone (the 2-beat hold), paper_flutter (REUSE) · MUSIC Violin under the post only; hard stop on the first heart.
- **Gags / eggs:** Three hearts [V], his face unchanged. Egg: the IOU (flutters off in Ep2).
- **Assets:** REUSE `cast.mas.portrait` (cast) · EXISTS `cast.alyi.portrait` (cast) · NEW `cast.alyi.swap-up` (cast) · EXISTS `room.bullpen` (rooms-b) · REUSE `kit.portrait-layout` (kits) · EXISTS `kit.falling-stack` (kits) · NEW `kit.post-ui` (kits) · CHANGED `score.violin` (score)
- **Logged as:** PORTRAIT · faces + hands 240 of 240 f · I · 8 events
- **Notes:** His real act is never staged as a tell: the hearts rise at their own pace, never on the beat (§3.7). Ruling 6: if the MADA card misses its laugh at the read, the hold drops to 1 beat (−15 f).
- **Crosswalk:** v1 30.01, 30.02, 30.03 · draft-3 lock 30.01, 30.02, 30.03

### 30.04 · WIDE `[W]` · 45 f (3 beats) · 18:26:00–18:27:21 · MAS · C10 · CARRY

- **Change:** Unchanged. *(script: 3 beats)*
- **Room / view:** bullpen · walkout (every desk a packed box, everyone in coats)
- **Characters:** TASYA: in the middle of the floor, hands clasped, delighted · EMPLOYEES: coats on, boxes in arms (walkout crowd, held drawings) · MAS: at his end desk
- **Action:** INT. NOPEAI BULLPEN — CONTINUOUS.
- **Sound:** SFX room_tone (crowd, coats) · MUSIC Violin out. The landlord's theme waits for 'below'.
- **Assets:** EXISTS `room.bullpen` (rooms-b) · EXISTS `cast.tasya.room` (cast) · REUSE `cast.mas.desk` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 1 events
- **Crosswalk:** v1 30.04 · draft-3 lock 30.04

### 30.05 · WIDE `[W]` · 120 f (2 bars) · 18:27:21–18:32:21 · MAS · C10 · CARRY

- **Change:** Unchanged (S2 remap). TASYA's window open, right: logged [P] only while his line types (§4.2). *(script: S2 2 bars)*
- **Room / view:** bullpen · walkout → landlord step 1 · TASYA's window right · *[W] with TASYA's [P] window open (right)*
- **Characters:** TASYA: speaking (dialogue box with a tail), delighted
- **Action:** Tasya: 'We are below them,' — on *below*, the floor steps to MACROSOFT slate in three held palette steps, spreading out from his feet (bullpenLandlord floor 1 → 2 → 3).
- **Line** `a4-30-02` TASYA: "We are below them," [V/K · NOV 20, 2023 · re-verify before lock] · f20–53 (33 f) · RECORDED · phrase clip f0-33 of the whole take
- **Rail:** `NOV 20, 2023 · RECONSTRUCTED` types on at f0 (read ≥ 40 f; it persists)
- **Switch:** `bullpenLandlord({floor: 1..3}) on beats 1, 2, 3`
- **Sound:** SFX voice: tasya (phrase 1 of 3, placed on the grid), NEW palette_step_thump ×3 · MUSIC S2: the landlord's theme, phrase 1.
- **Assets:** EXISTS `room.bullpen` (rooms-b) · EXISTS `cast.tasya.room` (cast) · REUSE `kit.portrait-layout` (kits)
- **Logged as:** WIDE · faces + hands 33 of 120 f · S-rep · 4 events
- **Notes:** The line is recorded whole and edited into 3 phrase clips on the bar grid (timing-lock).
- **Crosswalk:** v1 30.05 · draft-3 lock 30.05

### 30.06 · WIDE `[W]` · 120 f (2 bars) · 18:32:21–18:37:21 · MAS · C10 · CARRY

- **Change:** Unchanged (S2 remap). TASYA's window open, right: logged [P] only while his line types (§4.2). *(script: S2 2 bars)*
- **Room / view:** bullpen · landlord step 2 · TASYA's window right · *[W] with TASYA's [P] window open (right)*
- **Action:** 'above them,' — on *above*, the ceiling does the same (ceiling 1 → 2 → 3).
- **Line** `a4-30-02` TASYA: "above them," [V/K · NOV 20, 2023 · re-verify before lock] · f20–45 (25 f) · RECORDED · phrase clip f35-60 of the whole take
- **Switch:** `bullpenLandlord({ceiling: 1..3})`
- **Sound:** SFX voice: tasya (phrase 2), NEW palette_step_thump ×3
- **Assets:** EXISTS `room.bullpen` (rooms-b) · EXISTS `cast.tasya.room` (cast)
- **Logged as:** WIDE · faces + hands 25 of 120 f · S-rep · 4 events
- **Crosswalk:** v1 30.06 · draft-3 lock 30.06

### 30.07 · WIDE `[W]` · 120 f (2 bars) · 18:37:21–18:42:21 · MAS · C10 · CARRY

- **Change:** Unchanged (S2 remap). TASYA's window open, right: logged [P] only while his line types (§4.2). *(script: S2 2 bars)*
- **Room / view:** bullpen · landlord step 3 · TASYA's window right · *[W] with TASYA's [P] window open (right)*
- **Action:** 'around them.' — on *around*, the walls follow (walls 1 → 2 → 3). The whole bullpen is Tasya-blue; Tasya's own sprite steps down into the slate and is gone: every employee, coat on and box in arms, is standing on him. His key ring jangles once, from somewhere inside the wall.
- **Line** `a4-30-02` TASYA: "around them." [V/K · NOV 20, 2023 · re-verify before lock] · f20–45 (25 f) · RECORDED · phrase clip f63-88 of the whole take
- **Switch:** `bullpenLandlord({walls: 1..3})` · `Tasya sprite: stepImg toward slate, 3 held steps`
- **Sound:** SFX voice: tasya (phrase 3), NEW palette_step_thump ×3, NEW key_jangle (inside the wall, muffled)
- **Gags / eggs:** The landlord becomes the room (a palette remap of the home room: cheap repetition set-piece).
- **Assets:** EXISTS `room.bullpen` (rooms-b) · EXISTS `cast.tasya.room` (cast)
- **Logged as:** WIDE · faces + hands 25 of 120 f · S-rep · 5 events
- **Crosswalk:** v1 30.07 · draft-3 lock 30.07

### 30.08 · FALLAWAY `[PF]` · 120 f (2 bars) · 18:42:21–18:47:21 · MAS · C10 · RETAG

- **Change:** Board 1's [P] is the [PF] 3.1 prints: the all-slate bullpen stepped down behind him; the 'looking down' expression swap. *(script: S2 bars 7-8)*
- **Room / view:** bullpen (all slate, held, stepped down) behind the window
- **Characters:** MAS (left): looks DOWN at the floor (cast.mas.swap-down); then 'hi.'
- **Action:** Mas, at his desk, looks down. The floor is Tasya. Mas: 'hi.' Beat. From the floor, warmly (a dialogue box whose tail points at the floor): 'Hello.'
- **Line** `a4-30-03` MAS: "hi." [INVENTED] · f20–38 (18 f) · RECORDED
- **Line** `a4-30-04` TASYA: "Hello." [INVENTED] · f56–78 (22 f) · RECORDED
- **Sound:** SFX voice: mas-manalt, voice: tasya (from the floor: a slight floor-thump EQ on a send)
- **Gags / eggs:** 'hi.' / 'Hello.'
- **Assets:** REUSE `cast.mas.portrait` (cast) · NEW `cast.mas.swap-down` (cast) · EXISTS `room.bullpen` (rooms-b) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine)
- **Logged as:** FALLAWAY · faces + hands 120 of 120 f · I · 3 events
- **Crosswalk:** v1 30.08 · draft-3 lock 30.08

### 30.09 · MEDIUM `[M]` · 45 f (3 beats) · 18:47:21–18:49:18 · MAS · C11 · REFRAME

- **Change:** MADA's [M] (Mada rig, boardroom-table medium plate): perfectly still in the only chair that isn't burning; nobody has mentioned the fires. *(script: 3 beats)*
- **Room / view:** boardroom · table medium plate (fires)
- **Characters:** MADA (medium rig, seated, arms folded, spinner turning, perfectly still)
- **Action:** INT. NOPEAI BOARDROOM — NIGHT. MADA, seated, perfectly still, in the only chair that isn't burning. Around him small cartoon fires are already burning: one on the table, one on a chair, one on a nameplate (3-drawing loops on 2s). Nobody has mentioned them.
- **Rail:** `NOV 21, 2023 · ~10 PM PT` types on at f0 (read ≥ 35 f; it persists)
- **Sound:** SFX NEW fire_crackle_small (loop, per fire)
- **Gags / eggs:** The unmentioned fires (C33). MADA's chair is the only one not burning.
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.mada.medium` (cast) · EXISTS `prop.fires` (kits)
- **Logged as:** MEDIUM · faces + hands 45 of 45 f · I · 3 events
- **Crosswalk:** v1 30.09 · draft-3 lock 30.09

### 30.10 · WIDE `[W]` · 45 f (3 beats) · 18:49:18–18:51:15 · MAS · C11 · CHANGED

- **Change:** The boardroom's ONE wide: the door bangs open and TERB walks in (terbWalkAt), his helmet popping on at the door (no Terb rig). *(script: 3 beats)*
- **Room / view:** boardroom · fires · wide
- **Characters:** TERB: bangs in through the frosted door; tall, crisp shirtsleeves, the red extinguisher held like a briefcase
- **Action:** The door bangs open (SHAKE_DOOR on the room layer, never the UI; hallway flash ≤ 1 frame). TERB walks in (terbWalkAt, 4 drawings), the red extinguisher held like a briefcase. At the door, a fire marshal's helmet pops on (1 drawing).
- **Sound:** SFX NEW door_bang, NEW helmet_pop (a small bonk)
- **Assets:** CHANGED `room.boardroom` (rooms-a) · EXISTS `cast.terb.room` (cast) · EXISTS `prop.extinguisher` (cast) · EXISTS `cast.mada.room` (cast) · EXISTS `prop.fires` (kits)
- **Logged as:** WIDE · not a face or a hand · I · 4 events
- **Crosswalk:** v1 30.10

### 30.11 · CARD `CARD` · 90 f (1 bar + 2 beats) · 18:51:15–18:55:09 · MAS · C11 · CHANGED

- **Change:** The [W] HOLDS under the full freeze: Mas walks past in colour (drawMasStand arm 'reach') and pulls the pin (pin:true → false). Logs as the [W] it rides. *(script: 1 bar + 2 beats)*
- **Room / view:** TERB name card · FULL FREEZE (the room holds 2-tone; Mas moves in colour)
- **Characters:** TERB: card portrait · MAS: room sprite in colour through the freeze (masWalkAt, then arm 'reach', then 'pocket')
- **Action:** The world freezes and HOLDS the freeze. The card opens. Mas, in colour through the freeze, walks past Terb and pulls the pin from his extinguisher.
- **On screen:** card `TERB` · card `CHAIRS BOARDS ON FIRE` · card-stat `EXTINGUISHERS: 1`
- **Switch:** `{type:'palette', to:'2TONE_FREEZE', mask: live(Mas), invert: true} for all 90 f (and 30.12)`
- **Sound:** SFX freeze_hit_C (REUSE), NEW footsteps_soft (Mas, the only sound in the freeze) · MUSIC The freeze: one held note.
- **Gags / eggs:** Business 2 of 2 (the pocketing freeze).
- **Assets:** NEW `kit.cards` (kits) · EXISTS `cast.terb.portrait` (cast) · EXISTS `cast.mas.stand` (cast) · CHANGED `room.boardroom` (rooms-a) · EXISTS `prop.extinguisher` (cast)
- **Logged as:** WIDE (rides it) · not a face or a hand · CARD · 6 events
- **Crosswalk:** v1 30.11 · draft-3 lock 30.11

### 30.12 · INSERT-HANDS `[ECU]` · 30 f (2 beats) · 18:55:09–18:56:15 · MAS · C11 · CARRY

- **Change:** Unchanged (drawPinTag; business 2 of 2). The freeze releases on the cut. *(script: 2 beats)*
- **Room / view:** the pin in Mas's hand (still frozen around it)
- **Characters:** MAS: his fingers with the pin (terb.ts drawExtinguisherInsert / drawPinTag)
- **Action:** The pin, in his hand, in colour: its tamper tag reads `DO NOT REMOVE`. He pockets it. The freeze releases on the cut.
- **On screen:** prop `DO NOT REMOVE`
- **Sound:** SFX NEW pin_pull_tink
- **Gags / eggs:** DO NOT REMOVE (C34); pays off in the tag's drawer.
- **Assets:** CHECK `cast.mas.hand.pin` (cast) · EXISTS `prop.extinguisher` (cast)
- **Logged as:** INSERT-HANDS · faces + hands 30 of 30 f · M · 2 events
- **Notes:** The full freeze runs 2 bars here (card + pin insert), not 1: director to confirm.
- **Crosswalk:** v1 30.12 · draft-3 lock 30.12

### 30.13 · PORTRAIT `[P]` · 120 f (2 bars) · 18:56:15–19:01:15 · MAS · C11 · REFRAME

- **Change:** '…Ah.' is in TERB's [P] (draft 3's [M] is gone): behind his window, in the room, everyone looks around at room scale. One window held through both lines.
- **Room / view:** boardroom (live, fires) behind the window
- **Characters:** TERB (right): helmet on; eyes L / R on the look-around; brows up on '…Ah.' · the room behind the window: every sprite turns its head (one head-turn drawing each, f60)
- **Action:** TERB, right: 'Which room is on fire?' f60: behind his window, everyone in the room looks around, as if seeing the fires for the first time. f75: '…Ah.'
- **Line** `a4-30-05` TERB: "Which room is on fire?" [INVENTED] · f4–46 (42 f) · RECORDED
- **Line** `a4-30-06` TERB: "…Ah." [INVENTED] · f75–91 (16 f) · RECORDED
- **Sound:** SFX voice: terb, fire_crackle_small
- **Gags / eggs:** 'Which room is on fire?' / '…Ah.'
- **Assets:** EXISTS `cast.terb.portrait` (cast) · CHANGED `room.boardroom` (rooms-a) · REUSE `kit.portrait-layout` (kits) · EXISTS `prop.fires` (kits)
- **Logged as:** PORTRAIT · faces + hands 120 of 120 f · I · 4 events
- **Crosswalk:** v1 30.13 · draft-3 lock 30.13, 30.13a

### 30.14 · TWO-SHOT `[2S]` · 75 f (1 bar + 1 beat) · 19:01:15–19:04:18 · MAS · C11 · REFRAME

- **Change:** THE CALM-OFF as a [2S] (medium rigs Mas + Mada over the boardroom-table plate): all the chaos happens BEHIND them. W0 calibration trio.
- **Room / view:** boardroom · table medium plate (calm-off framing: Mas left, Mada right, across the table)
- **Characters:** MAS (medium rig, flip: facing camera-right toward Mada, arm 'clasp'): still · MADA (medium rig): still, spinner turning · TERB (room sprite, behind them): sprays the chair fire (spray + 3-drawing cone)
- **Action:** MAS, left, and MADA, right, across the table. Neither moves. Behind them: Terb sprays the chair fire and the extinguisher works (because the pin is out). Keycaps bounce off the table. Somewhere inside the wall, a key ring jangles. f45: TERB (O.S.): 'Terms?'
- **Line** `a4-30-07` TERB: "Terms?" [INVENTED] · f45–67 (22 f) · RECORDED
- **Sound:** SFX NEW extinguisher_spray (steam_hiss variant), keycap_popcorn (REUSE), NEW key_jangle (in the wall), voice: terb
- **Gags / eggs:** The spray works because Mas took the pin. The key ring in the wall (Tasya is the building).
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.mas.medium` (cast) · NEW `cast.mada.medium` (cast) · EXISTS `cast.terb.room` (cast) · EXISTS `prop.extinguisher` (cast) · EXISTS `prop.fires` (kits) · REUSE `cast.gerg.keycaps` (cast)
- **Logged as:** TWO-SHOT · faces + hands 75 of 75 f · S-rep · 6 events
- **Crosswalk:** v1 30.14 · draft-3 lock 30.14

### 30.15 · PORTRAIT `[P]` · 60 f (1 bar) · 19:04:18–19:07:06 · MAS · C11 · CARRY

- **Change:** Carried (HOLD 1 BEAT, then the canned answer).
- **Room / view:** boardroom behind the window
- **Characters:** MADA (right): arms folded, spinner turning; HOLD 1 BEAT, then the canned answer
- **Line** `a4-30-08` MADA: "Good question." [INVENTED] catchphrase · f19–46 (27 f) · RECORDED
- **Sound:** SFX voice: mada (master read)
- **Gags / eggs:** 'Good question.' 3 of 3.
- **Assets:** EXISTS `cast.mada.portrait` (cast)
- **Logged as:** PORTRAIT · faces + hands 60 of 60 f · I · 2 events
- **Crosswalk:** v1 30.15 · draft-3 lock 30.15

### 30.16 · PORTRAIT `[P]` · 75 f (1 bar + 1 beat) · 19:07:06–19:10:09 · MAS · C11 · CARRY

- **Change:** Carried (HOLD 1 BEAT; one beat late).
- **Room / view:** boardroom behind the window
- **Characters:** MAS (left): HOLD 1 BEAT; then, one beat late, the echo
- **Line** `a4-30-09` MAS: "good question." [INVENTED] · f19–52 (33 f) · RECORDED
- **Sound:** SFX voice: mas-manalt
- **Gags / eggs:** The echo.
- **Assets:** REUSE `cast.mas.portrait` (cast)
- **Logged as:** PORTRAIT · faces + hands 75 of 75 f · I · 2 events
- **Crosswalk:** v1 30.16 · draft-3 lock 30.16

### 30.17 · TWO-SHOT `[2S]` · 120 f (2 bars) · 19:10:09–19:15:09 · MAS · C11 · REFRAME

- **Change:** The episode's ONE LONG HOLD in the [2S] (two still men in one frame), and the stamp in the same frame (board 1: two portraits + a room wide). *(script: 2 bars (the long hold 1 bar + the stamp 1 bar))*
- **Room / view:** boardroom · table medium plate (calm-off framing)
- **Characters:** MAS and MADA (medium rigs): still; Mada's spinner stops (bar 1, beat 3), he nods once (1-px dip) · TERB: his hand only, into frame (bar 2)
- **Action:** Bar 1: HOLD 1 BAR (the episode's one long hold): two still men in one frame. Mada's spinner stops. He nods once. Bar 2: Terb's hand comes into frame, stamps a term sheet without looking (2 drawings) and hands it to both of them at the same time (1 drawing: two hands take it).
- **Sound:** SFX (fires crackle, very low), rubber_stamp_C (REUSE, bar 2), paper_flutter (REUSE) · MUSIC Nothing.
- **Gags / eggs:** The calm-off lands.
- **Assets:** NEW `room.boardroom.medium` (rooms-a) · NEW `cast.mas.medium` (cast) · NEW `cast.mada.medium` (cast) · EXISTS `cast.terb.room` (cast) · EXISTS `prop.term-sheet` (cast)
- **Logged as:** TWO-SHOT · faces + hands 120 of 120 f · I · 5 events
- **Crosswalk:** v1 30.17, 30.18 · draft-3 lock 30.17, 30.18

### 30.20 · UI-TILE-GRID `[POV]` · 90 f (1 bar + 2 beats) · 19:15:09–19:19:03 · MAS · C11 · REFRAME

- **Change:** Mas's PHONE lights green, full-bleed (board 1: Gerg's laptop on the table).
- **Room / view:** his phone, full-bleed (green)
- **Action:** Mas's phone lights green, and keycaps pop out of the bottom of the frame. Gerg's post (held ≥ 71 f).
- **Post** `a4-30-10` GERG: "Returning to NopeAI & getting back to coding tonight." [V · NOV 21, 2023 · re-fetch the casing; '&' read as 'and'] · f0–90 (held 90 f, needs 70)
- **On screen:** post `Returning to NopeAI & getting back to coding tonight.` [V · NOV 21, 2023] re-fetch casing
- **Sound:** SFX keycap_popcorn (REUSE), post_click (REUSE)
- **Assets:** CHANGED `prop.phone` (kits) · NEW `kit.post-ui` (kits) · REUSE `cast.gerg.keycaps` (cast)
- **Logged as:** UI-TILE-GRID · not a face or a hand · M · 3 events
- **Crosswalk:** v1 30.20 · draft-3 lock 30.20

### 30.20a · FALLAWAY `[PF]` · 15 f (1 beat) · 19:19:03–19:19:18 · MAS · C11 · NEW

- **Change:** NEW (3.1): MAS, left, reading Gerg's post; his face doesn't change (the payoff shot of the D8 plant: Gerg came back without being asked). *(script: 1 beat)*
- **Room / view:** boardroom (held behind the window, stepped down)
- **Characters:** MAS (left): reading; face unchanged
- **Action:** MAS, left, reading it. His face doesn't change. 1 beat.
- **Sound:** SFX (room tone; fires low)
- **Assets:** REUSE `cast.mas.portrait` (cast) · CHANGED `room.boardroom` (rooms-a) · REUSE `kit.portrait-layout` (kits) · CHECK `kit.fallaway` (engine)
- **Logged as:** FALLAWAY · faces + hands 15 of 15 f · I · 1 events
- **Crosswalk:** new

### 30.21 · INSERT-PROP `[ECU]` · 135 f (2 bars + 1 beat) · 19:19:18–19:25:09 · MAS · C11 · RETAG

- **Change:** The last grain as a prop insert (drawHourglass lg, sand:1 → 0; the shatter) on the table insert.
- **Room / view:** boardroom · table insert (TABLE_INSERT.prop)
- **Action:** The last grain runs out of TTEMME's hourglass. His post arrives beside it (held ≥ 94 f). The hourglass shatters, only the glass (salvaged shatter). The sand holds the shape of the hourglass for one beat, then falls (3 drawings).
- **Post** `a4-30-11` TTEMME: "I am deeply pleased by this result, after ~72 very intense hours of work." [V · NOV 21, 2023; '~' read as 'about'] · f15–135 (held 120 f, needs 94)
- **On screen:** post `I am deeply pleased by this result, after ~72 very intense hours of work.` [V · NOV 21, 2023]
- **Sound:** SFX post_click (REUSE), hourglass_shatter (REUSE), NEW sand_fall
- **Gags / eggs:** The sand holds its shape (C: cartoon physics).
- **Assets:** EXISTS `prop.hourglass` (kits) · NEW `kit.post-ui` (kits)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 4 events
- **Crosswalk:** v1 30.21 · draft-3 lock 30.21

### 30.22 · WIDE `[W]` · 60 f (1 bar) · 19:25:09–19:27:21 · MAS · C12 · CHANGED

- **Change:** The sign lights up; Mas is ALREADY at the reception desk, no lanyard, glass in hand. The 4-drawing walk-in goes. *(script: 1 bar)*
- **Room / view:** lobby · night
- **Characters:** MAS: room sprite standing at the reception desk (drawMasStand, no lanyard), his glass in his hand
- **Action:** INT. NOPEAI LOBBY — NIGHT. The wall sign that was blank in the check scene lights up (neon ignite, 3 held steps). Mas is already at the reception desk, without a lanyard, his glass in his hand.
- **On screen:** sign `DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0` [INVENTED] running sign
- **Sound:** SFX neon_ignite (REUSE), neon_buzz (REUSE)
- **Gags / eggs:** The lobby sign (meter): resets to 0 on Nov 21; Ep2 counts from here.
- **Assets:** EXISTS `room.lobby` (rooms-a) · EXISTS `cast.mas.stand` (cast) · EXISTS `prop.lobby-sign` (kits)
- **Logged as:** WIDE · not a face or a hand · I · 3 events
- **Crosswalk:** v1 30.22 · draft-3 lock 30.22

### 30.23 · INSERT-PROP `[ECU]` · 45 f (3 beats) · 19:27:21–19:29:18 · MAS · C12 · RETAG

- **Change:** Untagged in draft 3: a prop insert (the maintenance hand and the box of zeros; board 1's 30.23). *(script: 3 beats)*
- **Room / view:** lobby · floor insert (drawSignFloorInsert)
- **Characters:** A maintenance hand (private individual: hand only)
- **Action:** A hand sets a small box on the floor under the sign (2 drawings). The box is full of spare `0` plates.
- **Sound:** SFX NEW box_set_down (a soft rattle of plates)
- **Gags / eggs:** The box of spare zeros (C35).
- **Assets:** EXISTS `prop.zero-box` (kits) · NEW `cast.hands.worker` (cast) · EXISTS `room.lobby` (rooms-a)
- **Logged as:** INSERT-PROP · faces + hands 45 of 45 f · M · 2 events
- **Crosswalk:** v1 30.23 · draft-3 lock 30.23

### 30.24 · WIDE `[W]` · 60 f (1 bar) · 19:29:18–19:32:06 · MAS · C12 · RETIME

- **Change:** 2 bars -> 1 bar: Cancel greys over three held beats; THE UNLIT ARROW FROM SC 26 steps in ON SCREEN and clicks on beat 4: Bonk. *(script: 1 bar)*
- **Room / view:** lobby · night
- **Action:** Over the lobby, the 1993 dialog pops up once more, in full colour: `OK` · `Cancel`. Beats 1-3: Cancel greys out one dither step per beat (3 held steps). Beat 4: the arrow pointer from the call (the one that clicked Cancel at noon) steps in on screen and clicks it. *Bonk.*
- **On screen:** ui `OK` · ui `Cancel`
- **Sound:** SFX NEW dialog_pop_chip, alert_bonk (REUSE, on beat 4)
- **Gags / eggs:** Cancel greys out again: the 1993 dialog closes its loop.
- **Assets:** EXISTS `kit.dialog-1993` (kits) · EXISTS `kit.call-grid` (kits) · EXISTS `room.lobby` (rooms-a)
- **Logged as:** WIDE · not a face or a hand · I · 5 events
- **Crosswalk:** v1 30.24 · draft-3 lock 30.24

### 30.25 · CLOSE-UP `[CU]` · 30 f (2 beats) · 19:32:06–19:33:12 · MAS · C12 · REFRAME

- **Change:** SILENT: the same drawing as 26.05a, the lobby's tungsten BEHIND him (the light change lives in the backdrop unless W0 rules materials). 'okay.' moves to the hands. *(script: 2 beats)*
- **Room / view:** Mas CU over the lobby (drawMasCU backdrop 'lobby')
- **Characters:** MAS: full frame, the episode's second and last close-up; the same drawing as sc 26; nothing changes
- **Action:** MAS, full frame: the firing's drawing, silent like the first, with the lobby's tungsten behind him instead of the Strip's neon. 2 beats (the house deadpan).
- **Sound:** SFX room_tone (lobby) · MUSIC None.
- **Assets:** NEW `cast.mas.cu` (cast) · EXISTS `room.lobby` (rooms-a)
- **Logged as:** CLOSE-UP · faces + hands 30 of 30 f · I · 1 events
- **Notes:** Ruling 4 default: 2 [CU]s per episode. If G1 caps it at one, this becomes sc 26 phrase 1's [PF] framing, the light behind him cyan → tungsten; don't mix sizes.
- **Crosswalk:** v1 30.25 · draft-3 lock 30.25

### 30.26 · INSERT-HANDS `[ECU]` · 45 f (3 beats) · 19:33:12–19:35:09 · MAS · C12 · RETIME

- **Change:** 2 beats (was 1), with 'okay.' OVER THE HANDS: he sets the glass down on the reception desk and nudges it one pixel true (the sc 24 ritual's bookend). The recorded line + the house punch tail need a 3rd beat. *(2 beats (script) → boarded 3 (the punch tail))*
- **Room / view:** lobby · reception desk insert (NEW small plate: the desk top under tungsten)
- **Characters:** MAS: hand only (cast.mas.hand.nudge: the set-down, whose last frame is the nudge)
- **Action:** f0-3: his hand sets the glass down on the reception desk. f4: 'okay.' (off his face, over the hands; no lip-sync). f26: two fingers nudge it one pixel true. Hold to the cut.
- **Line** `a4-30-12` MAS: "okay." [INVENTED] · f4–26 (22 f) · RECORDED · same take, now OFF his face over the hands (no lip-sync)
- **Sound:** SFX NEW glass_set_down, voice: mas-manalt ('okay.', the same take) · MUSIC Act resolution (a small button after the line).
- **Gags / eggs:** G02 bookend: he straightens a glass that didn't move.
- **Assets:** NEW `room.lobby.reception-insert` (rooms-a) · NEW `cast.mas.hand.nudge` (cast)
- **Logged as:** INSERT-HANDS · faces + hands 45 of 45 f · M · 2 events
- **Crosswalk:** draft-3 lock 30.26

## 31. INT. NOPEAI BULLPEN — BACK WALL — DAY · [BASE] · M/I · side MAS · 19:35:09–20:04:03 · 690 f (printed 19:16.8–19:43.8, ≈ 27 s)

*his POV.*

### 31.01 · INSERT-PROP `[ECU]` · 90 f (1 bar + 2 beats) · 19:35:09–19:39:03 · MAS · C12 · REFRAME

- **Change:** The vault as a PROP INSERT (new insert-scale drawing): `DO NOT OPEN. DO NOT EXPLAIN.` legible. The walk moves to the [W] 31.02. *(script: 1 bar + 2 beats)*
- **Room / view:** bullpen · back wall · the Q* vault at insert scale (NEW), under the tungsten spill from the hall
- **Action:** A squat steel vault stencilled `Q*` under the tungsten spill from the hall. It hums at the score's root note, F. One yellow sticky note is stuck on its door: `DO NOT OPEN. DO NOT EXPLAIN.` The rail types on at f0 and keeps reading into 31.02 (it persists).
- **Rail:** `NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*"` types on at f0 (read ≥ 105 f; it persists)
- **On screen:** prop `Q*` · prop `DO NOT OPEN. DO NOT EXPLAIN.` [INVENTED] egg
- **Sound:** SFX NEW vault_hum_F (sustained, at the score's root) · MUSIC The hum IS the music here; the score sits on F.
- **Assets:** NEW `prop.q-vault` (rooms-b)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 2 events
- **Crosswalk:** v1 31.01 · draft-3 lock 31.01

### 31.02 · WIDE `[W]` · 60 f (1 bar) · 19:39:03–19:41:15 · MAS · C12 · REFRAME

- **Change:** The walk in ONE [W] with the room walkers (masWalkAt; drawGergStand type → look 'up'); no rig walks. *(script: 1 bar)*
- **Room / view:** bullpen · back wall · wide (the vault at the vaultQ mark, room scale)
- **Characters:** MAS: walks past the vault L→R without looking (masWalkAt, 4 drawings on 2s) · THE ORB: at his shoulder (room scale); it LOOKS at the vault (iris turns) · GERG: walks past the other way, typing (drawGergStand type 0-2), and stops (look 'up')
- **Action:** The back wall. Mas walks past the vault without looking, the Orb at his shoulder. The Orb looks. Gerg walks past the other way, typing, and stops.
- **Sound:** SFX NEW footsteps_soft ×2, typing_soft (REUSE), vault_hum_F · MUSIC The hum IS the music here.
- **Assets:** EXISTS `room.bullpen` (rooms-b) · NEW `prop.q-vault` (rooms-b) · EXISTS `cast.mas.stand` (cast) · SALVAGE `cast.orb.room` (cast) · EXISTS `cast.gerg.walk` (cast)
- **Logged as:** WIDE · not a face or a hand · I · 5 events
- **Notes:** The vault beat's one wide.
- **Crosswalk:** v1 31.01, 31.02 · draft-3 lock 31.02

### 31.03 · PORTRAIT `[P2]` · 120 f (2 bars) · 19:41:15–19:46:15 · MAS · C12 · REFRAME

- **Change:** The exchange in a [P2] (MAS left, GERG right: gerg-speak portrait). Gerg's exit happens IN his window (looks over at the note, nods, the window closes); the separate note insert and walk-on are gone.
- **Room / view:** bullpen (held) behind both windows
- **Characters:** MAS (left): NOT looking (level stare, away from the vault) · GERG (right, gerg-speak portrait): laptop open; looks over at the sticky note, nods, walks on
- **Action:** GERG: 'What's in there?' MAS (not looking): 'it's a preview.' The vault hums on the line. After the punch: in his window, Gerg looks over at the sticky note (beat), reads it, nods (1-px dip), and his window closes (3 held steps) as he walks on. The hum is sound only.
- **Line** `a4-31-01` GERG: "What's in there?" [INVENTED] · f4–26 (22 f) · RECORDED
- **Line** `a4-31-02` MAS: "it's a preview." [INVENTED] (echo of the 'research preview' launch) · f34–69 (35 f) · RECORDED
- **Sound:** SFX voice: gerg-mockbran, mas-manalt, vault_hum_F swells 1 dB under 'preview.'
- **Gags / eggs:** 'it's a preview.' (the research-preview echo).
- **Assets:** REUSE `cast.mas.portrait` (cast) · EXISTS `cast.gerg.portrait` (cast) · REUSE `kit.portrait-layout` (kits) · EXISTS `room.bullpen` (rooms-b)
- **Logged as:** PORTRAIT · faces + hands 120 of 120 f · I · 5 events
- **Crosswalk:** v1 31.03, 31.04, 31.05 · draft-3 lock 31.03, 31.04

### 31.06 · PORTRAIT `[P]` · 165 f (2 bars + 3 beats) · 19:46:15–19:53:12 · MAS · C12 · RETIME

- **Change:** The WHOLE memo on camera (board 1 laid its second half over the nameplate insert) (voiced, never V.O.; the page is never inserted). His own real line lands on the prop consequence (31.07).
- **Room / view:** bullpen · Mas's end desk, the conference door (shut, nameplate on) behind him
- **Characters:** MAS (left): at his desk, reading his memo aloud, unhurried (eyes down to the page, then level)
- **Action:** He reads the whole memo aloud, unhurried, on camera (voiced only; the memo page is never inserted); the 0.6 s pause at the ellipsis stays.
- **Line** `a4-31-03` MAS: "i love and respect alyi… i harbor zero ill will towards him." [V · NOV 29, 2023] · f8–150 (142 f) · RECORDED
- **Rail:** `NOV 29, 2023` types on at f0 (read ≥ 21 f; it persists)
- **Sound:** SFX voice: mas-manalt (memo-read, whole) · MUSIC A soft, unhurried figure.
- **Assets:** REUSE `cast.mas.portrait` (cast) · EXISTS `room.bullpen` (rooms-b)
- **Logged as:** PORTRAIT · faces + hands 165 of 165 f · I · 2 events
- **Notes:** The source has a capital 'I'; it belongs to Ep7. Subtitles lowercase; the page is never shown.
- **Crosswalk:** v1 31.06 · draft-3 lock 31.06

### 31.07 · INSERT-PROP `[ECU]` · 90 f (1 bar + 2 beats) · 19:53:12–19:57:06 · MAS · C12 · CHANGED

- **Change:** Carried as a prop insert (a worker's hand + the chair back): four screws, four beats; the plate comes off. The memo no longer plays over it. *(script: 1 bar + 2 beats)*
- **Room / view:** boardroom · back of ALYI's board chair (drawChairBackInsert)
- **Characters:** A maintenance worker's hand with a screwdriver (hand only)
- **Action:** The boardroom. A maintenance worker's screwdriver takes the `ALYI` nameplate off the back of his board chair: four screws, four beats, one held drawing each. Beat 5: the plate comes off. Hold 1 beat.
- **On screen:** prop `ALYI`
- **Sound:** SFX NEW screw_squeak ×4, NEW plate_off_tick
- **Gags / eggs:** 'zero ill will' over four screws.
- **Assets:** CHANGED `room.boardroom` (rooms-a) · EXISTS `prop.nameplate-alyi` (rooms-a) · NEW `cast.hands.worker` (cast)
- **Logged as:** INSERT-PROP · faces + hands 90 of 90 f · I · 6 events
- **Notes:** F2: he left the board that day and stays at the company: the plate comes off the CHAIR; the office door keeps its plate (31.08).
- **Crosswalk:** v1 31.07 · draft-3 lock 31.07

### 31.08 · INSERT-PROP `[ECU]` · 45 f (3 beats) · 19:57:06–19:59:03 · MAS · C12 · REFRAME

- **Change:** Draft 3's [M] is a prop insert (new insert-scale drawing): the shut conference-room door and its nameplate. *(script: 3 beats)*
- **Room / view:** bullpen · the conference-room door at insert scale (NEW): shut, the ALYI plate on
- **Action:** Back in the bullpen, the conference-room door, shut, with its nameplate still on. Hold.
- **Gags / eggs:** Hands Ep2 its WHERE'S ALYI?
- **Assets:** NEW `prop.door-nameplate` (rooms-b)
- **Logged as:** INSERT-PROP · not a face or a hand · M · 1 events
- **Crosswalk:** v1 31.08 · draft-3 lock 31.08

### 31.09 · WIDE `[W]` · 120 f (2 bars) · 19:59:03–20:04:03 · MAS · C12 · RETAG

- **Change:** Board 1's close on the window corner is a TIGHTER PLATE OF THE ROOM, so it logs [W] (the memo beat's one wide) and keeps the seat text legible. *(script: 2 bars)*
- **Room / view:** bullpen · the window corner (a tighter [W] plate: the chair large enough for its seat text) · *a tighter plate of a room is [W]*
- **Action:** By the window, a MACROSOFT-blue folding chair unfolds itself (4 drawings). Its seat-back reads `OBSERVER (NON-VOTING)`. It stays empty. From somewhere above, Tasya's key ring drops onto the seat (3 drawings). *Jangle.* The chair is on his floor anyway. Hold to the act's end.
- **On screen:** prop `OBSERVER (NON-VOTING)` [V] the Nov 29 observer seat
- **Sound:** SFX NEW chair_unfold_clacks, NEW key_jangle (the drop) · MUSIC Act-out button; hand-off to the tag (sc 32).
- **Gags / eggs:** The observer chair stays empty (F1).
- **Assets:** EXISTS `room.bullpen` (rooms-b) · NEW `prop.observer-chair` (rooms-b)
- **Logged as:** WIDE · not a face or a hand · M · 4 events
- **Crosswalk:** v1 31.09 · draft-3 lock 31.09

---

## V.O. (draft 3.1: five lines, all [INVENTED], lowercase)

| Id | Shot | Tc | Line | Device | Frames | Status | Checks |
|---|---|---|---|---|---|---|---|
| `a4-26a-vo1` | 26A.01 | 14:16:00 | *i don't keep score.* | D2 | 46 | NEW READ (est. 46 f) · record the guardrails fallback 'i don't keep things.' as an alt take | ✓ clean |
| `a4-26a-vo2` | 26A.05 | 14:29:03 | *the meeting ended early.* | D4 | 50 | SCRATCH (the editor's a4-26-vo1 take of these words moves here; re-read optional) | ✓ clean |
| `a4-29-vo1` | 29.01 | 16:39:18 | *i put the phone down.* | D5 | 54 | NEW READ (est. 54 f) | ✓ starts 45 f into the rail's 51 f read (29.00) |
| `a4-29-vo2` | 29.10 | 16:52:21 | *the badge was a joke.* | D3 | 54 | NEW READ (est. 54 f) · retire draft 2's on-mic a4-29-02 | ✓ clean |
| `a4-29-vo3` | 29.12 | 17:27:21 | *gerg never waits to be asked.* | D8 | 74 | SCRATCH (the editor's take; same words, no re-read) | ✓ clean |

- Rules held: starts on a beat; ends ≥ 1 beat before a cut or a spoken line; ≥ 1 bar from any real line, dated quote card, name card, freeze or `(REPORTED)` item; never over the dialogue box; its text band (y 182–203) framed on shadow. None in sc 26 (the candor card's scene and the drop-out), none in pass one, none after 'gerg never waits to be asked.'.
- The Orb never reacts to a V.O. line: it is on the lanyard before D3 (29.04), and it reads his face before `rewinding…` (26A.06).
- **Retired:** `a4-26-vo1` the meeting ended early. (in sc 26) (no V.O. in sc 26 (the drop-out and the candor card play clean); the words move to 26A as a4-26a-vo2); `a4-29-02` the hearts were sincere. (claims a feeling about the employees' real act; replaced by 'the badge was a joke.' (a4-29-vo2)); `caption` mas manalt: super. (the call's caption line) (an invented line in real-transcript UI; replaced by his voice through their speaker (a4-27-00)).

## Dialogue index

| Id | Sc | Speaker | Line | Mode | Frames | Status | Shots |
|---|---|---|---|---|---|---|---|
| `a4-25-01` | 25 | NELEH | Step four. | on-mic | 20 | RECORDED | 25.05 |
| `a4-25-02` | 25 | MADA | Good question. | on-mic | 27 | RECORDED | 25.05 |
| `a4-26-01` | 26 | MAS | super. | on-mic | 22 | RECORDED | 26.07 |
| `a4-26a-vo1` | 26A | MAS (V.O.) | i don't keep score. | vo | 46 | NEW READ (est. 46 f) · record the guardrails fallback 'i don't keep things.' as an alt take | 26A.01 |
| `a4-26a-01` | 26A | MAS | "if i start going off, the nopeai board should go after me for the full value of my shares" | post-popup | post | RECORDED | 26A.03 |
| `a4-26a-vo2` | 26A | MAS (V.O.) | the meeting ended early. | vo | 50 | SCRATCH (the editor's a4-26-vo1 take of these words moves here; re-read optional) | 26A.05 |
| `a4-27-00` | 27 | MAS | super. | speaker-filter | 22 | DERIVED · NEW PROCESS: a4-26-01 through a small laptop-speaker filter (band-limited, boxy, under the room); no new read | 27.01 |
| `a4-27-01` | 27 | GERG | "…I quit." | post-popup | post | RECORDED | 27.01a |
| `a4-27-02` | 27 | RIMA | I'll hold it together. | on-mic | 44 | RECORDED | 27.05 |
| `a4-27-03` | 27 | NELEH | For how long? | on-mic | 29 | RECORDED | 27.05a |
| `a4-27-04` | 27 | RIMA | We'll share more soon. | on-mic | 33 | RECORDED | 27.05b |
| `a4-27-05` | 27 | TILED EMPLOYEE | Is this a coup? | on-mic | 33 | RECORDED | 27.06 |
| `a4-27-06` | 27 | ALYI | "You can call it this way" | on-mic | 75 | RECORDED | 27.07 |
| `a4-27-07` | 27 | MAS | "…sorta like reading your own eulogy while you're still alive" | post-popup | post | RECORDED | 27.10 |
| `a4-27-08` | 27 | NELEH | The bylaws allow it. Footnote three. | on-mic | 57 | RECORDED | 27.12 |
| `a4-27-09` | 27 | ALYI | Step four… will reveal itself. | on-mic | 79 | RECORDED | 27.12a |
| `a4-27-10` | 27 | NELEH | When? | on-mic | 15 | RECORDED | 27.12b |
| `a4-27-11` | 27 | ALYI | The company will tell us. | on-mic | 77 | RECORDED | 27.12c |
| `a4-27-12` | 27 | NELEH | The company is calling us. | on-mic | 41 | RECORDED | 27.14 |
| `a4-27-13` | 27 | ALYI | That is the company telling us. | on-mic | 89 | RECORDED | 27.14a |
| `a4-27-14` | 27 | MARIO | I've written up some thoughts. | on-mic | 52 | RECORDED | 27.19 |
| `a4-27-15` | 27 | ADELINA | In plain English: no. | on-mic | 38 | RECORDED | 27.22 |
| `a4-27-16` | 27 | MARIO | Hi. Yes. We're very worried. How much? | on-mic | 67 | RECORDED | 27.24 |
| `a4-27-17` | 27 | MAS | "first and last time i ever wear one of these" | post-popup | post | RECORDED | 27.26 |
| `a4-27-18` | 27 | TTEMME | Chat. I'm the CEO now. | on-mic | 42 | RECORDED | 27.29 |
| `a4-27-19` | 27 | TTEMME | Chat… for how long? | on-mic | 39 | RECORDED | 27.31 |
| `a4-27-20` | 27 | TASYA | "a new advanced AI research team" | read-aloud-post | 68 | RECORDED | 27.33 |
| `a4-27-21` | 27 | NELEH | Step four? | on-mic | 21 | RECORDED | 27.36 |
| `a4-27-22` | 27 | MADA | Good question. | on-mic | 27 | RECORDED | 27.36 |
| `a4-29-vo1` | 29 | MAS (V.O.) | i put the phone down. | vo | 54 | NEW READ (est. 54 f) | 29.01 |
| `a4-29-01` | 29 | RIMA | "NopeAI is nothing without its people" | post-popup | post | RECORDED | 29.03 |
| `a4-29-vo2` | 29 | MAS (V.O.) | the badge was a joke. | vo | 54 | NEW READ (est. 54 f) · retire draft 2's on-mic a4-29-02 | 29.10 |
| `a4-29-03` | 29 | MAS | mostly. | on-mic | 23 | RECORDED · RE-TAKE RECOMMENDED (it now answers the Orb's look at the lanyard, after a 1-beat hold) | 29.10a |
| `a4-29-04` | 29 | GERG | One sec. Compiling. | on-mic | 30 | RECORDED | 29.11 |
| `a4-29-05` | 29 | MAS | what are you building? | on-mic | 48 | RECORDED | 29.11a |
| `a4-29-06` | 29 | GERG | The company. Again. Just in case. | on-mic | 48 | RECORDED | 29.11b |
| `a4-29-vo3` | 29 | MAS (V.O.) | gerg never waits to be asked. | vo | 74 | SCRATCH (the editor's take; same words, no re-read) | 29.12 |
| `a4-29-07` | 29 | TASYA | Everyone is welcome. | on-mic | 36 | RECORDED | 29.12 |
| `a4-29-08` | 29 | MAS | leave it open. | on-mic | 37 | RECORDED | 29.13 |
| `a4-29-09` | 29 | NELEH | Has anyone read the char— | on-mic | 40 | RECORDED | 29.16 |
| `a4-30-01` | 30 | ALYI | "I deeply regret my participation in the board's actions." | read-aloud-post | 125 | RECORDED | 30.01 |
| `a4-30-02` | 30 | TASYA | "We are below them, above them, around them." | on-mic | 88 | RECORDED | 30.05, 30.06, 30.07 |
| `a4-30-03` | 30 | MAS | hi. | on-mic | 18 | RECORDED | 30.08 |
| `a4-30-04` | 30 | TASYA | Hello. | on-mic | 22 | RECORDED | 30.08 |
| `a4-30-05` | 30 | TERB | Which room is on fire? | on-mic | 42 | RECORDED | 30.13 |
| `a4-30-06` | 30 | TERB | …Ah. | on-mic | 16 | RECORDED | 30.13 |
| `a4-30-07` | 30 | TERB | Terms? | on-mic | 22 | RECORDED | 30.14 |
| `a4-30-08` | 30 | MADA | Good question. | on-mic | 27 | RECORDED | 30.15 |
| `a4-30-09` | 30 | MAS | good question. | on-mic | 33 | RECORDED | 30.16 |
| `a4-30-10` | 30 | GERG | "Returning to NopeAI & getting back to coding tonight." | post-popup | post | RECORDED | 30.20 |
| `a4-30-11` | 30 | TTEMME | "I am deeply pleased by this result, after ~72 very intense hours of work." | post-popup | post | RECORDED | 30.21 |
| `a4-30-12` | 30 | MAS | okay. | on-mic | 22 | RECORDED · same take, now OFF his face over the hands (no lip-sync) | 30.26 |
| `a4-31-01` | 31 | GERG | What's in there? | on-mic | 22 | RECORDED | 31.03 |
| `a4-31-02` | 31 | MAS | it's a preview. | on-mic | 35 | RECORDED | 31.03 |
| `a4-31-03` | 31 | MAS | "i love and respect alyi… i harbor zero ill will towards him." | memo-read | 142 | RECORDED | 31.06 |

## ASSET LIST

Status: **EXISTS** built by the Act Four prep (file + function named) · **REUSE** a show / engine asset from before the prep · **SALVAGE** port from a dev slot (never edit the original) · **CHANGED** exists; needs a new option or state (additive, in a new file where it's someone else's module) · **CHECK** exists; confirm at the board's scale · **NEW** to build. `file ✓` = the file existed when the board was generated.

| Status | Count |
|---|---|
| NEW | 34 |
| CHANGED | 5 |
| CHECK | 3 |
| SALVAGE | 2 |
| EXISTS | 43 |
| REUSE | 6 |

### rooms-a

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `room.boardroom.medium` | studio/src/shared/pixel/rooms/boardroom-medium.ts (proposed) | The boardroom TABLE medium plate: the table edge with the blueprint, the dark window behind (Alyi's reflection slot), the slate-wall + Tasya's-door state, the fires state, and the calm-off framing (Mas left, Mada right across the table). | 27.11, 27.13, 27.14b, 27.32, 27.35, 27.36, 30.09, 30.14, 30.17 |
| **NEW** | `room.lobby.reception-insert` | — | A small insert-scale plate: the reception desk top under the lobby's tungsten, for the glass set-down + nudge (30.26). | 30.26 |
| **CHANGED** | `room.boardroom` | studio/src/shared/pixel/rooms/boardroom.ts ✓ · drawBoardroom (Nov 17 plan · Nov 19 spot · slate + tasyaDoor 0-4 · FIRES_SC30) · drawTableInsert({focus 'blueprint'\|'prop'\|'laptop', word 0-3}) · drawChairBackInsert · drawLaptopChairInsert | ADD a `?`-ONLY step 4 (drawTableInsert word 3 draws the scribble + `?`; 3.1 wants only `?`), in the table insert and on the table in every later boardroom frame. | 27.16, 27.17, 27.27, 27.30, 27.32, 30.10, 30.11, 30.13, 30.20a, 31.07 |
| **EXISTS** | `prop.nameplate-alyi` | studio/src/shared/pixel/rooms/boardroom.ts ✓ · drawChairBackInsert (4 screw states + plate off) |  | 31.07 |
| **EXISTS** | `room.lobby` | studio/src/shared/pixel/rooms/lobby.ts ✓ · drawLobby (day / night, the sign blank → lit, the reception front layer) · drawLobbyCam · drawLobbyCamWide · drawSignFloorInsert |  | 27.26, 30.22, 30.23, 30.24, 30.25 |
| **EXISTS** | `room.tpool-door` | studio/src/shared/pixel/rooms/tpool-door.ts ✓ · drawTpoolDoor · drawTpoolClose (authored BASE, survives EARLYWEB16) |  | 26.12, 26.13 |
| **EXISTS** | `room.vegas-suite` | studio/src/shared/pixel/rooms/vegas-suite.ts ✓ · drawSuite · suiteLayers · glassShiver · drawLaptopInsert({screen:'join'\|'gone', cursor, pressed, mic}) · drawDeskInsert({phoneLit, mic}) · suitePortraitBg · suiteTileBg | No new plate for board 2: the nudge (24.02) plays on drawDeskInsert (his glass at the right), the click (25.08) on drawLaptopInsert 'join', both [PF]s on suitePortraitBg stepped down, the strip tap (26.06) on drawDeskInsert {mic:true}. *pov-changes §5.1 lists 'laptop corner and mic icon at insert scale' as NEW: drawDeskInsert already frames the phone with the laptop's corner and the lit mic (rooms-a suite-desk-insert.png).* | 24.01, 24.02, 24.03, 25.08, 26.02a, 26.05a, 26.06, 26.07, 26.09 |

### rooms-b

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `prop.door-nameplate` | — | The conference-room door, shut, its ALYI plate on, at insert scale (31.08). | 31.08 |
| **NEW** | `prop.observer-chair` | — · (bullpen.ts has only the observerChair mark) | The window corner as a tighter [W] plate: the MACROSOFT-blue folding chair unfolds (4 drawings), `OBSERVER (NON-VOTING)` legible on the seat back, the key ring drops (3) (31.09). | 31.09 |
| **NEW** | `prop.q-vault` | — · (bullpen.ts has only the vaultQ mark) | The Q* vault at INSERT scale with the sticky note `DO NOT OPEN. DO NOT EXPLAIN.` legible (31.01), and at room scale on the vaultQ mark (31.02). | 31.01, 31.02 |
| **NEW** | `room.darkroom.medium` | studio/src/shared/pixel/rooms/darkroom-medium.ts (proposed) | The dark-room desk MEDIUM plate: the cyan cone, the rack's LEDs, the desk edge, the monitor (the board grid small in its corner), the back wall with the blue door's slot (29.12). Mas in the left third (§4.3 rule 8); frame y 182-203 on shadow for the V.O. *Salvage source: dev/mcoldopen/medium.ts (the intro's medium two-shot, MED layout; it puts Mas right of the monitor, so restage).* (source: dev/mcoldopen/medium.ts) | 26A.02, 29.01, 29.04, 29.10a, 29.08, 29.12 |
| **NEW** | `room.lighthouse.desk-insert` | studio/src/shared/pixel/rooms/lighthouse-desk.ts (proposed) | Insert-scale desk top buried in paper, with the ringing phone on its cradle (27.18) and after the click (27.23). The handset + throne (adelina.ts drawThroneHandset 'lg', 30x30) sits on it. | 27.18, 27.23 |
| **CHANGED** | `room.darkroom` | studio/src/shared/pixel/rooms/darkroom.ts ✓ · drawDarkRoom({tally, carve, lanyard, boardGrid, clock, blueDoor 1-4, blueDoorAjar}) · drawDarkDesk({tally 2\|3, carve, glass, phone:'down'\|'none', lanyard}) · drawRackLeds | ADD drawDarkDesk phone:'up' (face-up, a screen rect the feed painter fills) in the SAME framing as phone:'down', so 29.01a and 29.03 are a matching frame. Everything else exists. | 26.13, 26A.01, 26A.05, 26A.06, 29.00, 29.01a, 29.03, 29.10, 29.07a, 29.12q, 29.12r, 29.12, 29.13, 29.17a |
| **CHECK** | `room.lighthouse` | studio/src/shared/pixel/rooms/lighthouse.ts ✓ · drawLighthouse({phone1, throne 'on'\|'fallen'\|'none', meters}) · drawRentMeter · drawDeskPhone · handsetImg / throneImg · lampTurn | CHECK: the two rent meters must sit clear of the right portrait window (x 356-468, y 24-160) so they read behind Mario's [P] (27.24). | 27.19, 27.20, 27.24 |
| **EXISTS** | `prop.rent-meters` | studio/src/shared/pixel/rooms/lighthouse.ts ✓ · drawRentMeter |  | 27.24 |
| **EXISTS** | `room.bullpen` | studio/src/shared/pixel/rooms/bullpen.ts ✓ · drawBullpen({variant day\|allhands\|walkout, door shut\|crack\|open, nameplate, iou, handsUp, crowd}) · bullpenLandlord · DOOR_CRACK / DOOR_OPENING · drawGlassReflection · marks vaultQ, observerChair | 27.06 / 27.07a use the allhands plate as a tighter [W] (the same drawing); 30.01 the door 'crack' behind the [P2]. | 27.06, 27.07, 27.07a, 30.01, 30.04, 30.05, 30.06, 30.07, 30.08, 31.02, 31.03, 31.06, 31.09 |

### cast

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `cast.alyi.swap-up` | — | ALYI looks UP at the hearts (30.01 [P2]; board 1's 30.03 already asked for it). An expression swap. | 30.01 |
| **NEW** | `cast.gerg.medium-tile` | — | Gerg's tile at MEDIUM tile scale, the glance up into his camera (29.11c). An expression swap on the tile. | 29.11c |
| **NEW** | `cast.hands.worker` | — | Maintenance hands only (a private individual): the screwdriver on 4 screws + the plate off (31.07); setting down the box of zeros (30.23). | 30.23, 31.07 |
| **NEW** | `cast.mada.medium` | — | MADA waist-up, seated, arms folded, spinner (27.11-27.36, 30.09, the calm-off 30.14-30.17): the nod; lids for the slow blink. | 27.11, 27.13, 27.14b, 27.32, 27.35, 27.36, 30.09, 30.14, 30.17 |
| **NEW** | `cast.mas.cu` | studio/src/shared/pixel/cast/mas-cu.ts ✓ · masCU · drawMasCU({backdrop 'strip'\|'lobby'}) | ONE drawing: three-quarter, the one-pixel smile, NO mouths (both uses silent); the backdrop carries the light (the Strip's neon; the lobby's tungsten). *A parallel stage started this file at board time: verify before W0.* | 26.05a, 30.25 |
| **NEW** | `cast.mas.eyes` | studio/src/shared/pixel/cast/mas-cu.ts ✓ · drawEyesStrip(y0, pos -2..2) | The eyes strip, 480x64 letterboxed, 5 pupil positions (26.04a). *A parallel stage started this file at board time (the function was a stub).* | 26.04a |
| **NEW** | `cast.mas.hand.carve` | — | the carve with the pen's steel clip, 4 growth steps (with prop.tally) *ECU kit hand (26A.01)* | 26A.01 |
| **NEW** | `cast.mas.hand.click` | — | hand on the trackpad: rest → press (1 frame, 1 px) *ECU kit hand (25.08)* | 25.08 |
| **NEW** | `cast.mas.hand.heart-tap` | — | five fingers, the thumb tapping the face-up phone lying on the desk (8 taps); the matching frame of .six *ECU kit hand (29.03)* | 29.03 |
| **NEW** | `cast.mas.hand.nudge` | — | the nudge and the set-down: ONE drawing whose last frame is the nudge (two fingers, the glass 1 px true) *ECU kit hand (24.02, 30.26)* | 24.02, 30.26 |
| **NEW** | `cast.mas.hand.six` | — | the same hand resting on the face-down phone with SIX fingers, plus a five-finger copy for the G2 A/B *ECU kit hand (29.01a)* | 29.01a |
| **NEW** | `cast.mas.hand.tap-strip` | — | the thumb on the phone's suggested-replies strip beside the laptop's corner; the tap at once (NO hover drawing) *ECU kit hand (26.06)* | 26.06 |
| **NEW** | `cast.mas.hand.thumb-mark3` | — | the brush (side of the hand, 2 drawings), then the thumb at rest on mark 3 ONLY (one drawing moved in whole pixels) *ECU kit hand (26A.01)* | 26A.01 |
| **NEW** | `cast.mas.medium` | studio/src/shared/pixel/cast/mas-medium.ts ✓ · drawMasMedium · masMediumBack / masMediumFront · MAS_M_HAND (heads 34/down/front; arms rest/phone/tally/clasp/down; lights monitor/board/warm) | Waist-up, head ≈ 36 px, left third; 3 heads, 4 arm poses, the six mouths; flip for the calm-off (facing Mada). *A parallel stage started this file at board time.* | 26A.02, 29.01, 29.04, 29.10a, 29.08, 29.12, 30.14, 30.17 |
| **NEW** | `cast.mas.swap-down` | — | Mas's portrait looking DOWN at the floor (30.08 'hi.'). An expression swap in a new file; no edit to mas.ts. | 30.08 |
| **NEW** | `cast.neleh.hand-marker` | — | Her hand + the marker at insert scale: uncap (2), write `?` (3) (27.16). A prop insert (a hand and an object), never her eyes. | 27.16 |
| **NEW** | `cast.neleh.medium` | — | NELEH waist-up, standing with the marker (27.11-27.36): 3 heads, 4 arm poses, mouths; no legs. | 27.11, 27.13, 27.14b, 27.32, 27.35, 27.36 |
| **NEW** | `cast.orb.medium` | — | The Orb at [2S] scale (a sphere and an iris). IRIS TARGETS: tally marks 1, 2, 3 and his thumb (26A.02), the phone and the GUEST lanyard (29.04), his face. *CHECK: Com says the iris positions exist; confirm them at [2S] scale. Source: dev/mcoldopen/orb.ts.* (source: dev/mcoldopen/orb.ts) | 26A.02, 29.01, 29.04, 29.10a, 29.08, 29.12 |
| **NEW** | `cast.orb.portrait` | — | The Orb in the RIGHT window: iris desk → his face (26A.06), held on the lanyard (29.10), name → thumbnail → name + chime (29.07a). | 26A.06, 29.10, 29.07a |
| **CHANGED** | `cast.alyi.window-exit` | — · portraitWindow + the door-jamb clip | His door-cut portrait slides out of its window in whole-pixel steps; the window holds empty 1 beat, then closes (3 held steps). No new drawing (27.08). | 27.08 |
| **CHECK** | `cast.mas.hand.pin` | studio/src/shared/pixel/cast/terb.ts ✓ · drawExtinguisherInsert · drawPinTag | The pin in his fingers, DO NOT REMOVE legible (30.12). *pov-changes: 'the pin is built'. CHECK that Mas's fingers are in the drawing.* | 30.12 |
| **SALVAGE** | `cast.mas.tile` | — · masTileImg (still in dev/mfinale/callart) | Mas's call tile (Vegas, day); the cast's callgrid view composes the salvage (no FIRED., the clock blanked). (source: dev/mfinale/callart.ts) | 26.01, 26.05 |
| **SALVAGE** | `cast.orb.room` | studio/src/shared/pixel/cast/orb.ts (port) · drawOrb · orbLookAt · orbBob | Room scale at his shoulder (24.01, 31.02: it looks at the vault). (source: dev/mcoldopen/orb.ts) | 24.01, 31.02 |
| **EXISTS** | `cast.adelina.portrait` | studio/src/shared/pixel/cast/adelina.ts ✓ · adelinaPortrait (phone 'ear', throne on/off) |  | 27.20, 27.21, 27.22 |
| **EXISTS** | `cast.alyi.door` | studio/src/shared/pixel/cast/alyi-speak.ts ✓ · drawAlyiStand (clip to DOOR_OPENING) | 27.06 all-hands doorway. | 27.06 |
| **EXISTS** | `cast.alyi.portrait` | studio/src/shared/pixel/cast/alyi-speak.ts (+ alyi.ts) ✓ · alyiSpeakPortrait · alyiReflection · drawAlyiWindow (flicker 'there'\|'gone') · drawAlyiTile |  | 26.01, 26.03, 26.08, 27.01, 27.07, 27.08, 27.11, 27.12a, 27.12c, 27.14a, 27.14b, 27.17, 29.15, 30.01 |
| **EXISTS** | `cast.calltile` | studio/src/shared/pixel/cast/calltile.ts ✓ · tileFrame · micIcon · miniFrame · voteFlipAt |  | 26.01, 29.01, 29.07, 29.11, 29.11b, 29.11c |
| **EXISTS** | `cast.gerg.portrait` | studio/src/shared/pixel/cast/gerg-speak.ts (+ gerg.ts) ✓ · gergSpeakPortrait · drawGergTile (typing) · gergGlow |  | 29.11, 29.11b, 29.12r, 31.03 |
| **EXISTS** | `cast.gerg.walk` | studio/src/shared/pixel/cast/gerg-stand.ts ✓ · drawGergStand({legs, type 0-2, look 'screen'\|'up'}) · gergWalkAt | 31.02. | 31.02 |
| **EXISTS** | `cast.mada.portrait` | studio/src/shared/pixel/cast/mada.ts ✓ · madaPortrait · drawSpinner |  | 29.19, 30.15 |
| **EXISTS** | `cast.mada.room` | studio/src/shared/pixel/cast/mada.ts ✓ · drawMadaSeated · drawMadaChair (bolted) | The boardroom wides (27.17, 27.27, 30.10). | 27.17, 27.27, 30.10 |
| **EXISTS** | `cast.mada.tile` | studio/src/shared/pixel/cast/mada.ts ✓ · drawMadaTile (any size: wedged, blue-heart spinner, half-frame 29.18) · madaTileSpinner |  | 26.01, 26.08, 27.01, 27.10, 29.18, 29.20 |
| **EXISTS** | `cast.mas.stand` | studio/src/shared/pixel/cast/mas-stand.ts ✓ · drawMasStand({legs, arm 'down'\|'reach'\|'pocket', guest}) · masWalkAt · MAS_REACH_HAND |  | 27.26, 30.11, 30.22, 31.02 |
| **EXISTS** | `cast.neleh.portrait` | studio/src/shared/pixel/cast/neleh.ts ✓ · nelehPortrait (brows 'level'\|'query'\|'worry', footnotes) | The two listeners (27.05c, 27.12d) REUSE brow 'query'. | 26.02, 27.05a, 27.05c, 27.12, 27.12b, 27.12d, 27.14, 27.15 |
| **EXISTS** | `cast.neleh.room` | studio/src/shared/pixel/cast/neleh.ts ✓ · drawNelehRoom (arm paper\|marker\|write0\|write1) | The boardroom wides (27.17, 27.27). | 27.17, 27.27 |
| **EXISTS** | `cast.neleh.tile` | studio/src/shared/pixel/cast/neleh.ts ✓ · drawNelehTile · drawNelehMini · tileOrbit |  | 26.01, 26.08, 27.01, 29.16 |
| **EXISTS** | `cast.quietvote` | studio/src/shared/pixel/cast/the-quiet-vote.ts ✓ · drawQuietVoteTile · drawQuietVoteLaptop · drawQuietVoteMini |  | 26.01, 26.08, 27.01, 27.11, 27.14b, 27.17, 29.17 |
| **EXISTS** | `cast.rima.portrait` | studio/src/shared/pixel/cast/rima-speak.ts ✓ · rimaSpeakPortrait (the hard spotlight, the jacket smooth) |  | 27.03, 27.04, 27.05, 27.05b |
| **EXISTS** | `cast.tasya.portrait` | studio/src/shared/pixel/cast/tasya-speak.ts ✓ · tasyaSpeakPortrait |  | 27.33 |
| **EXISTS** | `cast.tasya.room` | studio/src/shared/pixel/cast/tasya-speak.ts ✓ · drawTasyaRoom (arm 'sign'\|'keys0'\|'keys1'\|'clasp') |  | 27.32, 30.04, 30.05, 30.06, 30.07 |
| **EXISTS** | `cast.terb.portrait` | studio/src/shared/pixel/cast/terb.ts ✓ · terbPortrait (helmet on/off, brows 'ah') |  | 30.11, 30.13 |
| **EXISTS** | `cast.terb.room` | studio/src/shared/pixel/cast/terb.ts ✓ · drawTerbRoom · terbWalkAt (helmet pops on at the door) · arms carry/spray/stamp/hand |  | 30.10, 30.14, 30.17 |
| **EXISTS** | `cast.ttemme.portrait` | studio/src/shared/pixel/cast/ttemme.ts ✓ · ttemmePortrait · drawChatOverlay |  | 27.28, 27.29, 27.31 |
| **EXISTS** | `cast.ttemme.room` | studio/src/shared/pixel/cast/ttemme.ts ✓ · ttemmeRoom |  | 27.27 |
| **EXISTS** | `prop.arrow-sign` | studio/src/shared/pixel/cast/tasya-speak.ts ✓ · drawTasyaRoom arm 'sign' |  | 27.32 |
| **EXISTS** | `prop.extinguisher` | studio/src/shared/pixel/cast/terb.ts ✓ · drawExtinguisherInsert · drawPinTag · drawSpray |  | 30.10, 30.11, 30.12, 30.14 |
| **EXISTS** | `prop.term-sheet` | studio/src/shared/pixel/cast/terb.ts ✓ · drawTermSheet |  | 30.17 |
| **EXISTS** | `prop.throne-handset` | studio/src/shared/pixel/cast/adelina.ts + rooms/lighthouse.ts ✓ · drawThroneHandset({size 'lg'\|'room', throne}) · handsetImg / throneImg |  | 27.18, 27.23 |
| **REUSE** | `cast.gerg.keycaps` | studio/src/shared/pixel/cast/gerg.ts ✓ · gergKeycaps |  | 27.02, 30.14, 30.20 |
| **REUSE** | `cast.mario.portrait` | studio/src/shared/pixel/cast/mario.ts (+ talk.ts marioMouth) ✓ · drawMarioPortrait (finger 0-2) · marioMouth |  | 27.19, 27.20, 27.22, 27.24 |
| **REUSE** | `cast.mas.desk` | studio/src/shared/pixel/cast/mas.ts ✓ · masDesk |  | 24.01, 26.09, 30.04 |
| **REUSE** | `cast.mas.portrait` | studio/src/shared/pixel/cast/mas.ts ✓ · masPortrait (mouths A E O M rest smile, lids, look) |  | 24.03, 26.02a, 26.07, 26A.05, 29.11a, 29.12q, 29.12r, 29.13, 29.17a, 30.01, 30.08, 30.16, 30.20a, 31.03, 31.06 |

### kits

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `kit.cards` | — · (engine ui.ts nameCard + the cast's card portraits exist: card-0…5.png) | To build: the generic 1-beat 2-tone freeze print (freeze.ts covers only 4 founders), TERB's full freeze with Mas live, the two dated quote cards, the act-out card, the rail band + type-on (the side labels `THE BOARD'S SIDE` / `HIS SIDE`), the `∞` glyph. | 26.02, 26.05a, 26.10, 26A.06, 27.04, 27.21, 27.28, 28.01, 29.00, 29.06, 29.19, 30.11 |
| **NEW** | `kit.post-ui` | — · (callToast exists in callgrid.ts) | Post pop-ups in source casing with their own UI stamp (9:32 PM PT), the feed of eight identical posts (29.03), the suggested-replies strip [super]×3 (26.06), the phone composer (26A.03), Gerg's green-lit post, the upside-down post (27.26), the notification band (27.10), the signature list (29.07), the `…` glyph. | 26.06, 26A.03, 27.01a, 27.02, 27.10, 27.26, 27.29, 27.33, 29.03, 29.05, 29.07, 30.01, 30.20, 30.21 |
| **NEW** | `prop.check-evirht` | — | The EVIRHT check, drawn for [2S] scale: front `EVIRHT · TENDER OFFER @ ~$86B VALUATION` legible, the red stamp `VOID IF CEO MISSING`, the eggs on the back; the tray-first eject (4 positions). | 29.08 |
| **NEW** | `prop.wallet` | — | The Senate wallet open on the desk, one card HEALTH INSURANCE, a moth (3 drawings) (26A.04). | 26A.04 |
| **CHANGED** | `prop.phone` | — · drawDeskInsert (face-up, lit) · drawDarkDesk phone 'down' | NEW: face-up on the dark desk with a feed (29.03, via room.darkroom). The full-bleed phone screens (26A.03, 30.20) are kit.post-ui. | 26.06, 26A.03, 29.03, 30.20 |
| **EXISTS** | `kit.blueprint` | studio/src/shared/pixel/kits/blueprint.ts ✓ · bp* · BLUEPRINT_PRINT · curlAt / tearAt (kits-plan runs sc 25 on its real clock) |  | 24.03, 25.01, 25.02, 25.03, 25.04, 25.05, 25.06, 25.07, 25.08, 27.11, 27.16, 27.35 |
| **EXISTS** | `kit.call-grid` | studio/src/shared/pixel/kits/callgrid.ts ✓ · gridLayout · drawTile · tileDrop · plateFallY · slideTiles · pointerAt / drawPointer · micChip · spotlight · cctv · callToast · typedDots |  | 26.01, 26.03, 26.04, 26.04b, 26.04c, 26.05, 26.08, 26.11, 27.01, 27.01a, 27.02, 27.03, 27.09, 27.26, 29.14, 30.24 |
| **EXISTS** | `kit.dialog-1993` | studio/src/shared/pixel/kits/callgrid.ts ✓ · callDialog (full colour; Cancel enabled or greying one step at a time) · dialogButton | 30.24 is 1 bar now: three held greys + the on-screen arrow's click on beat 4 (timing only). | 26.04, 26.04b, 26.04c, 26.05, 30.24 |
| **EXISTS** | `kit.falling-stack` | studio/src/shared/pixel/kits/avalanche.ts ✓ · planPile / drawPile · withBlueHeart · planGridStack / drawGridStack · shove · scatter · floatHearts · odometer |  | 27.09, 27.10, 29.14, 29.15, 29.16, 29.17, 29.18, 29.20, 30.01 |
| **EXISTS** | `prop.fires` | studio/src/shared/pixel/kits/props.ts + rooms/setkit.ts ✓ · fire · fireOut · drawFire · FIRES_SC30 |  | 30.09, 30.10, 30.13, 30.14 |
| **EXISTS** | `prop.guest-lanyard` | studio/src/shared/pixel/kits/props.ts ✓ · guestBadge · guestWorn (+ darkroom lanyard, mas-stand guest) | CHECK 'laid square beside the glass' reads in the medium plate (29.01). | 27.26, 29.00, 29.01, 29.04, 29.10a |
| **EXISTS** | `prop.hourglass` | studio/src/shared/pixel/cast/ttemme.ts + kits/props.ts ✓ · drawHourglass lg · hourglassFlipAt · hourglassBeats · shatter; props.ts hourglass L | On the boardroom table insert (TABLE_INSERT.prop). | 27.30, 30.21 |
| **EXISTS** | `prop.lobby-sign` | studio/src/shared/pixel/kits/props.ts ✓ · lobbySign · signLight · digitPlate |  | 30.22 |
| **EXISTS** | `prop.odometer` | studio/src/shared/pixel/kits/avalanche.ts ✓ · odometer · odoRoll · LETTER_STOPS |  | 29.05 |
| **EXISTS** | `prop.pen` | studio/src/shared/pixel/kits/props.ts ✓ · pen |  | 26A.01 |
| **EXISTS** | `prop.tally` | studio/src/shared/pixel/kits/props.ts + rooms/darkroom.ts ✓ · tally (growth, shavings curl/pile) · drawDarkDesk({tally, carve}) | The states exist (two faint · the third growing with shavings · three). The thumb-on-mark-3 is cast.mas.hand.thumb-mark3. *pov-changes §5.1 lists 'tally states' as NEW: built by the prep.* | 26A.01, 26A.02, 29.00, 29.01 |
| **EXISTS** | `prop.zero-box` | studio/src/shared/pixel/kits/props.ts + rooms/lobby.ts ✓ · zeroBox · drawSignFloorInsert |  | 30.23 |
| **REUSE** | `kit.dialogue-box-noportrait` | studio/src/shared/pixel/ui.ts ✓ · dialogueBox(tail 'none'), top centre | `super.` through their speaker (27.01): no portrait window, no name plate; types at Mas's rate. *pov-changes lists a NEW state; the engine's box already takes tail 'none'.* | 27.01 |
| **REUSE** | `kit.portrait-layout` | studio/src/shared/pixel/ui.ts ✓ · portraitWindow · dialogueBox | Mas window x12 y24, the other x356 y24 (112x136). | 24.03, 26.02a, 26.07, 26A.05, 26A.06, 27.03, 27.05, 27.05a, 27.05b, 27.05c, 27.07, 27.08, 27.12, 27.12a, 27.12b, 27.12c, 27.12d, 27.14, 27.14a, 27.15, 27.19, 27.20, 27.22, 27.24, 29.10, 29.07a, 29.11a, 29.12q, 29.12r, 29.17a, 30.01, 30.05, 30.08, 30.13, 30.20a, 31.03 |

### engine

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `kit.mas-version` | — | MAS'S VERSION helper: a matching-frame variant of the next shot's drawing + a STILLNESS flag (freezes every other layer for the bar). No present-day rim, no palette switch. | 29.01a |
| **NEW** | `kit.vo-line` | — | The V.O. line: x 12, baseline y 198, 1-px N0 shadow, his cyan one ramp step down, 0.5 ch/f; never over the dialogue box; staggered ≥ 1 beat from a toast or a rail item. | 26A.01, 26A.05, 29.01, 29.10, 29.12 |
| **CHECK** | `kit.fallaway` | studio/src/shared/pixel/light.ts ✓ · resolve() with the key near zero (or one family step, ≤ 2 beats) | The [PF] method. W0 art-director ruling needed for holds > 2 beats (26.02a 4, 26A.05 6, 27.15 3, 29.17a 4, 30.08 8 beats). Default relight ruling: the ROOM only. | 24.03, 26.02a, 26A.05, 27.15, 29.12q, 29.12r, 29.17a, 30.08, 30.20a |

### score

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `score.keynote-piano` | — | MAS'S VERSION's bed: a soft keynote-reel piano, 1 bar, ORIGINAL (no real track, no borrowed melody), killed mid-phrase by the hard cut (29.01a). | 29.01a |
| **CHANGED** | `score.violin` | — | One sad violin, played straight, UNDER ALYI'S POST ONLY; a hard stop on the first heart (30.01). The 2-beat hold is room tone. | 30.01 |

### dialogue/mix

| Status | Asset | File · function | Needs | Used in |
|---|---|---|---|---|
| **NEW** | `mix.laptop-speaker` | — | a4-26-01 through a small laptop-speaker filter (band-limited, boxy, quieter than the room) = a4-27-00 (27.01). No new read. | 27.01 |

**No longer needed** (against board 1 and draft 3's handoff list):

- `prop.labelled-desks` (EXISTS but unused): boardroom.ts tasyaDoor 4 / drawTasyaDoorInsert: the desks insert is cut.
- `prop.gerg-laptop` (EXISTS but unused): drawTableInsert focus 'laptop': 30.20 is now Mas's phone, full-bleed.
- `cast.other-yrral` (never built: not needed): the new-board wide is cut (THE OTHER YRRAL no longer appears in Ep1).
- `cast.mario.room / cast.adelina.room` (unused in Act Four): the lighthouse plays in prop inserts and portraits.
- `cast.mas.hands (board 1's generic id)` (replaced): by the seven per-drawing ids cast.mas.hand.*.
- `cast.hands.neleh` (renamed): cast.neleh.hand-marker (writes `?` only).
- `Mas [CU] front view, mouths, half-lid` (not needed for Ep1): both close-ups are silent: one drawing.
- `the hover drawing (tap ±1 px)` (not needed): no hover on the firing call.
- `the thumb along all three marks` (not needed): it becomes the thumb at rest on mark 3.
- `the thumb-hearting insert for Alyi` (not needed): the hearts rise out of his window in the [P2].
- `the call's live-caption line` (not needed): his voice through their speaker instead.
- `Mas's lobby walk-in (4 drawings)` (not needed): he is already at the reception desk (masWalkAt is still used in 31.02).
- `medium rigs: Terb, Alyi, Mario, TTEMME, Tasya, Rima` (not needed in Act Four): only principals in home rooms get [M].
- `medium plates: the Vegas suite, the bullpen back wall, the lighthouse desk` (not needed): 2 plates remain: the dark-room desk and the boardroom table.
- `the present-day cyan 6-px rim; 'the soft score bed'` (not needed): MAS'S VERSION has no rim; the keynote piano replaces the bed.

**Net against the changelog (§5.3):** medium rigs 5 (Mas, the Orb, NELEH, MADA, GERG as a medium tile) · medium plates 2 (the dark-room desk, the boardroom table) · Mas `[CU]` 1 drawing · new Mas hand drawings 6 + the six-finger variant (the pin exists) · new insert-scale props / plates: the vault, the shut door, the lighthouse desk, the reception desk top (the laptop corner with its mic already exists: `drawDeskInsert`) · the tally states already exist (`props.ts tally`, `drawDarkDesk`) · relights 0 on faces.

## PRODUCTION CHUNKS

12 chunks. The rule: a chunk is ≤ 10 s of NEW-ART set-piece or ≤ 45–60 s of dialogue. Every set-piece in the act now runs on a built kit (the blueprint, the call grid, the falling stack, the landlord remap, the F1.2 door), so new-art set-piece time is 0 s everywhere; the kit-driven seconds are listed apart. Estimates: the board-1 mode rates (agent-min per s) and the rule of thumb (0.4 min/s + 3.5 min/event).

| Chunk | Shots | Tc | s | Dialogue s | Kit set-piece s | New-art s | Events | Est. (modes / thumb) | Fits |
|---|---|---|---|---|---|---|---|---|---|
| **C01** | 24.01–25.08 (11) | 12:31:00–13:21:00 | 50.0 | 5.0 | 42.5 | 0.0 | 64 | 240 / 244 min | ✓ |
| **C02** | 26.01–26.09 (14) | 13:21:00–14:01:00 | 40.0 | 2.5 | 2.5 | 0.0 | 51 | 168 / 194 min | ✓ |
| **C03** | 26.10–26A.06 (10) | 14:01:00–14:33:12 | 32.5 | 9.4 | 7.5 | 0.0 | 29 | 133 / 114 min | ✓ |
| **C04** | 27.01–27.10 (15) | 14:33:12–15:14:18 | 41.25 | 17.5 | 10.6 | 0.0 | 42 | 140 / 164 min | ✓ |
| **C05** | 27.11–27.17 (13) | 15:14:18–15:48:12 | 33.75 | 20.0 | 0.0 | 0.0 | 33 | 73 / 129 min | ✓ |
| **C06** | 27.18–28.01 (18) | 15:48:12–16:37:21 | 49.38 | 23.1 | 0.0 | 0.0 | 52 | 131 / 202 min | ✓ |
| **C07** | 29.00–29.08 (12) | 16:37:21–17:17:21 | 40.0 | 9.4 | 0.0 | 0.0 | 36 | 128 / 142 min | ✓ |
| **C08** | 29.11–29.13 (8) | 17:17:21–17:36:00 | 18.12 | 15.6 | 0.0 | 0.0 | 17 | 37 / 67 min | ✓ |
| **C09** | 29.14–29.20 (8) | 17:36:00–18:16:00 | 40.0 | 5.0 | 35.0 | 0.0 | 22 | 167 / 93 min | ✓ |
| **C10** | 30.01–30.08 (6) | 18:16:00–18:47:21 | 31.88 | 30.0 | 15.0 | 0.0 | 25 | 100 / 100 min | ✓ |
| **C11** | 30.09–30.21 (12) | 18:47:21–19:25:09 | 37.5 | 13.8 | 3.1 | 0.0 | 42 | 118 / 162 min | ✓ |
| **C12** | 30.22–31.09 (12) | 19:25:09–20:04:03 | 38.75 | 13.8 | 0.0 | 0.0 | 38 | 125 / 148 min | ✓ |
| **Act** | 139 | 12:31:00–20:04:03 | 453.1 | | | 0 | 451 | 1560 / 1760 min | |

- **C01 · The suite + THE PLAN (on its real clock) + the click.** Depends on: kit.blueprint (EXISTS: kits-plan runs sc 25 on its 1080-f clock), room.vegas-suite (EXISTS). NEW first: cast.mas.hand.nudge, cast.mas.hand.click. The flash-print is a palette remap (BLUEPRINT_PRINT).
  Build / confirm first: `cast.mas.hand.click`, `cast.mas.hand.nudge`, `cast.orb.room`, `kit.fallaway`.
- **C02 · THE FALLING TILE, phrases 1-4: the call, Cancel works, the drop-out, the silent [CU], super., the frozen feed (W0 calibration).** Depends on: kit.call-grid + kit.dialog-1993 (EXISTS). NEW first: cast.mas.cu, cast.mas.eyes (both in progress: cast/mas-cu.ts), cast.mas.hand.tap-strip, kit.post-ui (the strip). W0: log [PF], [CU], [ECU] and the drop-out apart from the salvaged grid.
  Build / confirm first: `cast.mas.cu`, `cast.mas.eyes`, `cast.mas.hand.tap-strip`, `cast.mas.tile`, `kit.cards`, `kit.fallaway`, `kit.post-ui`, `prop.phone`.
- **C03 · The candor card, F1.2 (TPOOL), THAT NIGHT: mark 3, 'i don't keep score.', the Orb counts, the 9:32 post, 'the meeting ended early.', rewinding… (W0 calibration).** Depends on: room.tpool-door + room.darkroom (EXISTS). NEW first: room.darkroom.medium, cast.mas.medium (in progress: cast/mas-medium.ts), cast.orb.medium + cast.orb.portrait (port dev/mcoldopen/orb.ts), cast.mas.hand.carve + .thumb-mark3, prop.wallet, kit.post-ui (composer), kit.vo-line; V.O. a4-26a-vo1 NEW READ.
  Build / confirm first: `cast.mas.hand.carve`, `cast.mas.hand.thumb-mark3`, `cast.mas.medium`, `cast.orb.medium`, `cast.orb.portrait`, `kit.cards`, `kit.fallaway`, `kit.post-ui`, `kit.vo-line`, `prop.phone`, `prop.wallet`, `room.darkroom`, `room.darkroom.medium`.
- **C04 · Pass one I: 'super.' on their speaker, the toasts, RIMA, the listener, the all-hands, Alyi leaves his window, the hearts.** Depends on: kit.call-grid, kit.falling-stack (EXISTS), room.bullpen allhands (EXISTS), cast.rima/neleh/alyi portraits (EXISTS). NEW: kit.post-ui (toasts, posts, the notification band), kit.cards (the generic 1-beat freeze print), mix.laptop-speaker; engine dialogueBox tail 'none' (REUSE).
  Build / confirm first: `cast.alyi.window-exit`, `kit.cards`, `kit.post-ui`, `mix.laptop-speaker`.
- **C05 · Pass one II: the committee in the boardroom (the [2S] tier + the volley), the listener, NELEH's real face, the `?`, the speakerphone.** Depends on: room.boardroom (EXISTS). NEW first: room.boardroom.medium, cast.neleh.medium, cast.mada.medium, cast.neleh.hand-marker; CHANGED room.boardroom table insert (`?`-only state).
  Build / confirm first: `cast.mada.medium`, `cast.neleh.hand-marker`, `cast.neleh.medium`, `kit.fallaway`, `room.boardroom`, `room.boardroom.medium`.
- **C06 · Pass one III: the lighthouse throne call (prop inserts + portraits), the security-cam badge, TTEMME and the hourglass, Tasya's door, 'Step four?' / 'Good question.', WHAT THEY DIDN'T KNOW.** Depends on: room.lighthouse, room.lobby cam, prop.throne-handset, prop.rent-meters, cast.ttemme, cast.tasya, prop.hourglass (EXISTS); the boardroom medium tier from C05. NEW: room.lighthouse.desk-insert; kit.post-ui (the upside-down post); kit.cards (the act-out card). CHECK the meters clear of the right window.
  Build / confirm first: `cast.mada.medium`, `cast.neleh.medium`, `kit.cards`, `kit.post-ui`, `room.boardroom`, `room.boardroom.medium`, `room.lighthouse`, `room.lighthouse.desk-insert`.
- **C07 · Pass two I: the home shot (HIS SIDE), 'i put the phone down.', MAS'S VERSION, eight hearts, the Orb on the lanyard, 'the badge was a joke.', 'mostly.', the letter, the check.** Depends on: the dark-room medium tier from C03. NEW first: kit.mas-version (matching frame + stillness flag), cast.mas.hand.six + .heart-tap, room.darkroom phone:'up', prop.check-evirht (legible at [2S] scale), score.keynote-piano; V.O. a4-29-vo1 / -vo2 NEW READS; the a4-29-03 re-take.
  Build / confirm first: `cast.mas.hand.heart-tap`, `cast.mas.hand.six`, `cast.mas.medium`, `cast.orb.medium`, `cast.orb.portrait`, `kit.cards`, `kit.mas-version`, `kit.post-ui`, `kit.vo-line`, `prop.check-evirht`, `prop.phone`, `room.darkroom`, `room.darkroom.medium`, `score.keynote-piano`.
- **C08 · Pass two II: Gerg's tile, the quiet beat (an exchanged look), 'gerg never waits to be asked.', the door on 'asked', 'leave it open.'.** Depends on: cast.gerg portrait / tile (EXISTS), room.darkroom blueDoor (EXISTS) in the medium framing (C03). NEW: cast.gerg.medium-tile (the glance swap).
  Build / confirm first: `cast.gerg.medium-tile`, `cast.mas.medium`, `cast.orb.medium`, `kit.fallaway`, `kit.vo-line`, `room.darkroom`, `room.darkroom.medium`.
- **C09 · THE TILE AVALANCHE (S3, 16 bars) + the MADA card.** Depends on: kit.falling-stack (EXISTS: avalanche.ts lands 745/770, the shoves, the sparks). Kit-driven repetition (S-rep), so it books as one chunk; if the grid-stack plan is re-cut, split at 29.17a.
  Build / confirm first: `kit.cards`, `kit.fallaway`, `room.darkroom`.
- **C10 · The return I: the doorway [P2] with Alyi (three hearts off the beat), the walkout, THE LANDLORD BECOMES THE ROOM (S2), 'hi.' / 'Hello.'.** Depends on: room.bullpen + bullpenLandlord (EXISTS). NEW: cast.alyi.swap-up, cast.mas.swap-down, score.violin (under the post only).
  Build / confirm first: `cast.alyi.swap-up`, `cast.mas.swap-down`, `kit.fallaway`, `kit.post-ui`, `score.violin`.
- **C11 · The return II: the fires, Terb's full freeze and the pin, 'Which room is on fire?' / '…Ah.', the calm-off [2S] and the long hold, Gerg's post and Mas's face, the last grain (W0 calibration: the calm-off).** Depends on: the boardroom medium tier (C05) + cast.mas.medium (C03); cast.terb, prop.extinguisher, prop.hourglass, prop.fires (EXISTS); kit.cards (the full freeze with Mas live). W0 calibration trio: the calm-off [2S] (30.14-30.17).
  Build / confirm first: `cast.mada.medium`, `cast.mas.hand.pin`, `cast.mas.medium`, `kit.cards`, `kit.fallaway`, `kit.post-ui`, `prop.phone`, `room.boardroom`, `room.boardroom.medium`.
- **C12 · The return III + sc 31: the lobby sign and the box of zeros, Cancel greys, the silent [CU], 'okay.' over the hands, Q*, the memo, the nameplate, the shut door, the observer chair.** Depends on: cast.mas.cu (C02), cast.mas.hand.nudge (C01). NEW: room.lobby.reception-insert, prop.q-vault, prop.door-nameplate, prop.observer-chair, cast.hands.worker.
  Build / confirm first: `cast.hands.worker`, `cast.mas.cu`, `cast.mas.hand.nudge`, `cast.orb.room`, `prop.door-nameplate`, `prop.observer-chair`, `prop.q-vault`, `room.boardroom`, `room.lobby.reception-insert`.

**Dependency order.** C01 and C09 can start now (their kits exist; C01 waits only on two hand drawings). C02 and C03 are the W0 calibration and wait on the close tier (the `[CU]`, the eyes, the hands, the dark-room medium plate, Mas's and the Orb's rigs). C04–C06 wait on kit.post-ui and kit.cards; C05 on the boardroom medium tier (NELEH, MADA, the table plate), which C06, C11 reuse. C07–C08 reuse C03's dark-room tier and add MAS'S VERSION, the check and the Gerg glance. C10 needs two expression swaps. C11 is the third W0 calibration piece (the calm-off). C12 needs the four insert-scale props.

## Read checks

88 must-read items checked at 0.25 s + 0.05 s per character (rails over the frames they persist; posts over their hold). **0 fail.**

| Shot | Kind | Text | Needs | Has | |
|---|---|---|---|---|---|
| 24.01 | rail | NOV 17, 2023 · ~NOON PT · LAS VEGAS | 48 | 720 | ✓ |
| 26.05a | rail | +1 FIRING | 17 | 420 | ✓ |
| 26.12 | rail | 2005–08 · TPOOL · (REPORTED) | 40 | 150 | ✓ |
| 26A.01 | rail | NOV 17, 2023 · THAT NIGHT | 36 | 450 | ✓ |
| 26A.06 | rail | NOV 17 · EARLIER · THE BOARD'S SIDE | 48 | 750 | ✓ |
| 27.09 | rail | NOV 18 | 14 | 1065 | ✓ |
| 27.18 | rail | (REPORTED) · THE BOARD OFFERS MARIO THE JOB, AND A MERGER | 75 | 435 | ✓ |
| 27.26 | rail | NOV 19 | 14 | 120 | ✓ |
| 27.27 | rail | NOV 19 · NIGHT | 23 | 285 | ✓ |
| 27.32 | rail | NOV 19 · 11:53 PM PT | 30 | 270 | ✓ |
| 29.00 | rail | NOV 20, 2023 · ~2:06 AM PT · HIS SIDE | 51 | 495 | ✓ |
| 29.05 | rail | THE LETTER | 18 | 1680 | ✓ |
| 30.01 | rail | NOV 20, 2023 | 21 | 285 | ✓ |
| 30.05 | rail | NOV 20, 2023 · RECONSTRUCTED | 40 | 480 | ✓ |
| 30.09 | rail | NOV 21, 2023 · ~10 PM PT | 35 | 1140 | ✓ |
| 31.01 | rail | NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*" | 105 | 270 | ✓ |
| 31.06 | rail | NOV 29, 2023 | 21 | 420 | ✓ |
| 25.01 | stamp | HOW TO FIRE A CEO WHO OWNS NOTHING. | 48 | 180 | ✓ |
| 25.02 | stamp | LEFT EARLIER IN 2023 | 30 | 240 | ✓ |
| 25.02 | label | THESE FOUR VOTE | 24 | 240 | ✓ |
| 25.03 | label | NOPEAI · THE NONPROFIT | 33 | 180 | ✓ |
| 25.03 | label | CONTROLS | 16 | 180 | ✓ |
| 25.03 | label | NOPEAI · THE COMPANY (CAPPED PROFIT) | 50 | 180 | ✓ |
| 25.03 | label | THE BOARD'S DUTY: THE MISSION. NOT THE INVESTORS. | 65 | 180 | ✓ |
| 25.03 | label | MACROSOFT · ~$10B IN (REPORTED) · VOTES: 0 | 57 | 180 | ✓ |
| 25.03 | stamp | EQUITY: 0 (HIS TESTIMONY) | 36 | 180 | ✓ |
| 25.04 | label | 1. NOON · VIDEO CALL ✓ | 33 | 180 | ✓ |
| 25.04 | label | 2. BLOG POST ✓ | 23 | 180 | ✓ |
| 25.04 | label | 3. INTERIM CEO ✓ | 26 | 180 | ✓ |
| 25.04 | label | 4. ______________ | 27 | 180 | ✓ |
| 25.08 | ui | BOARD · VIDEO CALL · JOIN | 36 | 60 | ✓ |
| 26.01 | label | THE QUIET VOTE · camera off | 39 | 60 | ✓ |
| 26.02 | card | NELEH | 12 | 60 | ✓ |
| 26.02 | card | READ THE CHARTER. LITERALLY. | 40 | 60 | ✓ |
| 26.02 | card-stat | FOOTNOTES: ∞ | 21 | 60 | ✓ |
| 26.03 | ui | … | 8 | 60 | ✓ |
| 26.04 | ui | OK | 9 | 60 | ✓ |
| 26.04 | ui | Cancel | 14 | 60 | ✓ |
| 26.06 | ui | [super] [super] [super] | 34 | 150 | ✓ |
| 26.10 | quote-card | "…not consistently candid in his communications with the board…" | 83 | 120 | ✓ |
| 26.10 | quote-card | — THE NOPEAI BOARD · BLOG POST · NOV 17, 2023 | 60 | 120 | ✓ |
| 26A.03 | post | if i start going off, the nopeai board should go after me for the full value of my shares | 113 | 113 | ✓ |
| 26A.03 | ui | 9:32 PM PT | 18 | 120 | ✓ |
| 26A.04 | prop | HEALTH INSURANCE | 26 | 60 | ✓ |
| 26A.06 | toast | rewinding… | 18 | 30 | ✓ |
| 27.01 | dialogue-box | super. | 14 | 90 | ✓ |
| 27.01a | toast | GERG MOCKBRAN has left. | 34 | 75 | ✓ |
| 27.01a | post | …I quit. | 16 | 45 | ✓ |
| 27.02 | toast | BUKAJ has left. | 24 | 60 | ✓ |
| 27.04 | card | RIMA TAMURI | 20 | 60 | ✓ |
| 27.04 | card | CEO (WEEKEND EDITION) | 32 | 60 | ✓ |
| 27.04 | card-stat | HEARTS SENT: 0 | 23 | 60 | ✓ |
| 27.10 | post | …sorta like reading your own eulogy while you're still alive | 78 | 105 | ✓ |
| 27.21 | card | ADELINA | 15 | 60 | ✓ |
| 27.21 | card | IN PLAIN ENGLISH: | 27 | 60 | ✓ |
| 27.21 | card-stat | TRANSLATES DOOM INTO REVENUE | 40 | 60 | ✓ |
| 27.24 | prop | NOZAMA · UP TO $4B | 28 | 120 | ✓ |
| 27.24 | prop | ELGOOG · UP TO $2B | 28 | 120 | ✓ |
| 27.26 | post | first and last time i ever wear one of these | 59 | 90 | ✓ |
| 27.27 | prop | CEO (TEMP) | 18 | 60 | ✓ |
| 27.28 | card | TTEMME | 14 | 60 | ✓ |
| 27.28 | card | CEO (72 HOURS). | 24 | 60 | ✓ |
| 27.28 | card-stat | TIME LEFT: 72:00:00 | 29 | 60 | ✓ |
| 28.01 | act-card | WHAT THEY DIDN'T KNOW | 32 | 75 | ✓ |
| 29.03 | post | NopeAI is nothing without its people | 50 | 120 | ✓ |
| 29.03 | ui | RIMA TAMURI | 20 | 120 | ✓ |
| 29.05 | ui | 505 · 650 · 700 · 745 / 770 | 39 | 75 | ✓ |
| 29.06 | quote-card | "…unable to work for or with people that lack competence, judgment and care for our mission and employees" | 134 | 180 | ✓ |
| 29.06 | quote-card | — THE EMPLOYEES' LETTER TO THE NOPEAI BOARD · NOV 20, 2023 | 76 | 180 | ✓ |
| 29.07 | ui | ALYI (REPORTED) | 24 | 60 | ✓ |
| 29.08 | prop | EVIRHT · TENDER OFFER @ ~$86B VALUATION | 53 | 90 | ✓ |
| 29.08 | stamp | VOID IF CEO MISSING | 29 | 90 | ✓ |
| 29.19 | card | MADA | 11 | 60 | ✓ |
| 29.19 | card | LAST FIRER STANDING | 29 | 60 | ✓ |
| 29.19 | card-stat | ANSWERS GIVEN: 0 | 26 | 60 | ✓ |
| 30.11 | card | TERB | 11 | 90 | ✓ |
| 30.11 | card | CHAIRS BOARDS ON FIRE | 32 | 90 | ✓ |
| 30.11 | card-stat | EXTINGUISHERS: 1 | 26 | 90 | ✓ |
| 30.12 | prop | DO NOT REMOVE | 22 | 30 | ✓ |
| 30.20 | post | Returning to NopeAI & getting back to coding tonight. | 70 | 90 | ✓ |
| 30.21 | post | I am deeply pleased by this result, after ~72 very intense hours of work. | 94 | 120 | ✓ |
| 30.22 | sign | DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0 | 53 | 60 | ✓ |
| 30.24 | ui | OK | 9 | 60 | ✓ |
| 30.24 | ui | Cancel | 14 | 60 | ✓ |
| 31.01 | prop | Q* | 9 | 90 | ✓ |
| 31.01 | prop | DO NOT OPEN. DO NOT EXPLAIN. | 40 | 90 | ✓ |
| 31.07 | prop | ALYI | 11 | 90 | ✓ |
| 31.09 | prop | OBSERVER (NON-VOTING) | 32 | 120 | ✓ |

## Board calls, rulings and flags

**Open rulings, boarded at their defaults** (pov-changes §7):

| # | Ruling | Default used | Where |
|---|---|---|---|
| 1 | 'super.' as his voice through their speaker, in the dialogue box with no portrait | **As written** | 27.01 (a4-27-00: the a4-26-01 take through a laptop-speaker filter; engine dialogueBox tail 'none') |
| 2 | 'i don't keep score.' or the fallback 'i don't keep things.' | **Score** | 26A.01; under the fallback, 26A.02's iris steps to the pocketed pen instead (same length) |
| 3 | The six fingers in MAS'S VERSION (A/B at G2) | **Kept as an egg** | 29.01a (cast.mas.hand.six + a five-finger copy); if THE OUTSIDER marks '?', cut 29.01a and the V.O. (−1 bar + the line) |
| 4 | G1's [CU] cap | **2 per episode** | 26.05a + 30.25 (one drawing); the fallback is sc 26 phrase 1's [PF] framing relit behind him |
| 5 | Act Four at AMBER for faces and hands | **Accept** | measured 49.6% (the changelog projected 47–48%) |
| 6 | Alyi's doorway hold | **2 beats (1 if the MADA card misses)** | 30.01 f190-219 |
| 7 | The relight ruling | **Room only** | every [PF] and both [CU]s: the room steps down; no face is relit |

**Board calls** (places this board departs from, or interprets, the printed script):

- **29.00.** The HIS SIDE rail types on over the home shot (f0), not after it, so the [2S]'s V.O. is the only must-read in its frame (§5.2). Its 50 f read ends at 29.01 f20; the V.O. starts at f15 (start-to-start stagger 3 beats).
- **29.01.** 1 bar → 1 bar + 2 beats: the new read (est. 54 f) must end ≥ 1 beat before MAS'S VERSION's hard cut. If the recorded read is ≤ 42 f, it returns to 1 bar with the V.O. at f0.
- **29.08.** 1 bar → 1 bar + 2 beats, and the separate check-front insert is gone: the check's front reads in the [2S] (≈ 2.2 s + the stamp). prop.check-evirht must be drawn legible at [2S] scale.
- **29.10.** V.O. D3 plays over the Orb's [P] (on the lanyard), exactly 1 bar after Rima's last post; HOLD 1 BEAT after the line; then 'mostly.' in the [2S].
- **30.26.** 2 beats → 3 beats: 'okay.' (22 f) + the house punch tail.
- **26.04c/26.05.** The arrow settles on Cancel in 26.04c; the CLICK is 26.05's first frame, so the D6 drop-out runs exactly 2½ bars (150 f) to the phone's buzz (26.06 f0), as the changelog asks.
- **27.20-27.22.** The script's [P2] puts MARIO (silent) in the LEFT window, the only pass-one frame with the left window in use. Everyone still speaks from the right. Default: as scripted; alternative: Adelina's [P] alone with the phone leaving frame.
- **27.24.** The second phone, the rent meters and 'Hi. Yes…' are ONE [P] of Mario (two consecutive Mario [P]s would jump-cut).
- **30.13.** 'Which room is on fire?' and '…Ah.' are one held TERB window; the room behind it turns at f60.
- **30.17.** The long hold (bar 1) and the stamp (bar 2) are one [2S] (the same frame).
- **31.09.** Board 1's close on the observer chair is a tighter plate of the bullpen, so it logs [W] (3.1 prints [W]) and the seat text stays legible.
- **29.00 (logging).** The home shot (the glass) is logged a prop insert with no hand (strict §4.2): not a face or a hand. Counted, faces + hands would rise by 30 f.

**Flags:**

- **length · note.** The act boards to 7:33.12 (10875 f) against the printed 7:12.8: +20.3 s, all from recorded dialogue, new-read estimates and read time (sc 27 +10.25 s, sc 29 +5.79 s, sc 30 +2.5 s, sc 31 +1.75 s). It is INSIDE the 6:54–7:34 band with 0.88 s to spare, which is the writer's synthetic-voice allowance case. If the slate reads long, the writer's order: BUKAJ's toast (27.02, −0.6 s), the pass-one hold 1 → 0 beats (27.01, −0.6 s), Mario's second phone (27.24, −5 s). Never hearts 8 → 6.
- **events · warn.** Visual events 451 vs board 1's 407 (+44), above the changelog's +15–20 projection: Ep1 ≈ 1,444 against the ≈ 1,300 cap. The close tier adds drawings (hands, eyes, the Orb's iris steps, the [PF] step-downs). Offsets already taken: the new-board wide, the lobby walk-in, the desks, the eyelines, the hover.
- **engine · resolved.** THE PLAN's #7FDBFF / #0B1E3F: the blueprint kit ships its own palette set (kits-fx). Board 1's BLOCKER is closed.
- **engine · open.** The rail band (y 203-269): bullpen stops at y 203, the boardroom paints to y 236. Rule opaque band or dimmed overlay (board 1 recommended the overlay). The side labels ride it.
- **engine · note.** Glyphs the engine font lacks: `∞` (NELEH's card), `…` (rewinding…, the posts), `~` (the rail, the check). The kits draw their own; the post-ui / cards kits must too.
- **engine · note.** freeze.ts covers only gerg / alyi / mario / nole: the six Blip cards need the generic print (kit.cards), Mas masked live; TERB's is a FULL freeze with Mas walking in colour.
- **engine · W0.** W0 calibration trio: sc 26 (C02), 26A (C03) and the calm-off [2S] 30.14-30.17 (C11). Log [PF], [CU], [ECU], [M]/[2S] and the drop-out apart from the salvaged grid.
- **engine · W0.** [PF] method for holds > 2 beats (26.02a, 26A.05, 27.15, 29.17a, 30.08): resolve() with the key near zero vs a family step (PIXEL_GUIDE: family steps never for long holds). Art-director ruling.
- **cast · parallel.** At board time a parallel stage had started cast/mas-cu.ts (masCU, drawMasCU, drawEyesStrip stub), cast/mas-medium.ts (drawMasMedium) and cast/medium-kit.ts. The asset list marks them NEW with the file present; verify before the chunks that need them (C02, C03).
- **cast · CHECK.** The Orb's iris targets at [2S] scale (tally marks 1, 2, 3, his thumb, the phone, the lanyard, his face) and the Orb's promotion from dev/mcoldopen/orb.ts to a shared cast file.
- **rooms · CHECK.** Lighthouse: the rent meters must sit clear of the right window (x 356-468, y 24-160) to read behind Mario's [P] (27.24).
- **dialogue · record.** New reads: a4-26a-vo1 'i don't keep score.' (+ the alt 'i don't keep things.'), a4-29-vo1 'i put the phone down.', a4-29-vo2 'the badge was a joke.'. Re-take: a4-29-03 'mostly.'. Process: a4-27-00 (laptop-speaker filter on a4-26-01). Scratch in the cut: a4-26a-vo2 and a4-29-vo3 (the editor's). Retire: a4-26-vo1 (sc 26), a4-29-02.
- **facts · lock.** [V/K] on screen with RECONSTRUCTED until settled: 'We are below them, above them, around them.' (30.05-30.07), `~$86B` (29.08), `LEFT EARLIER IN 2023` (25.02). Re-fetch casing: Gerg's '…I quit.' (27.01a) and 'Returning to NopeAI…' (30.20). `ALYI (REPORTED)` needs a facts row (29.07). Time zones (PT) in 24.01, 26A.03, 27.32, 29.00, 30.09.
- **guardrails · rule.** Mas never touches tally marks 1 and 2 (26A.01: the thumb rests on mark 3 only; the Orb's look is the only thing that touches 1 and 2).
- **guardrails · rule.** No hover on the firing call (26.06); no eyelines before 'leave it open.' (29.13); the three hearts to Alyi rise OFF the beat, his face unchanged (30.01).
- **guardrails · rule.** The check lands as pure record (29.08): nothing of his (line, look, hand) within a bar of it; Gerg's tile follows directly.
- **guardrails · rule.** Pass one (sc 27): no V.O., no devices, no Mas portrait window; everyone speaks from the right. He appears as posts, the security tile and his voice on their call.
- **guardrails · rule.** MAS'S VERSION has no rim and no on-screen label: the correction reads on the matching-frame cut alone.
- **guardrails · rule.** Private individuals: the employee tiles, the reposting avatars and the letter's signatures are generic and unidentifiable; the maintenance workers are hands only. No clock or timestamp on the security tile or the call UI. No F1 / race marks in Las Vegas.
- **guardrails · rule.** X1: nobody enters the dark room: Gerg is a video tile; Tasya's door appears with the key in the lock and stays shut.
- **guardrails · rule.** Photosensitivity: nothing new flashes. The heart pour (27.09-27.10) and the door bang (30.10, hallway flash ≤ 1 frame) go through the luminance and red-flash audit.
- **continuity · ask.** TERB's full freeze runs 2 bars here (30.11 1½ bars + the pin insert 30.12), as board 1: director to confirm.
- **continuity · ask.** 27.26: Mas's post sits UPSIDE-DOWN in the security tile (read-load risk). Fallback: upright 2 beats, then the drawn upside-down version.
- **continuity · resolved.** Board 1's asks closed by 3.1: NELEH writes `?` only (no illegible word); the board's left window stays empty (not 'the BOARD holds the left window'); the legend line 'a medium is a tighter authored plate' is dropped.

## Sound

- **New SFX:** `blue_heart_ping`, `blueprint_print`, `box_set_down`, `call_connect`, `card_thud`, `chair_feet_ticks`, `chair_unfold_clacks`, `chalk_snap`, `chalk_squeak`, `check_tick`, `crane_truck_pass`, `dialog_pop_chip`, `door_appear`, `door_bang`, `extinguisher_spray`, `fire_crackle_small`, `footsteps_soft`, `glass_set_down`, `glass_shiver`, `handset_click`, `heart_tick`, `helmet_pop`, `key_jangle`, `lamp_hum`, `marker_squeak`, `marker_uncap`, `meter_whir`, `moth_flutter`, `palette_step_thump`, `paper_curl_rustle`, `paper_tear`, `pen_stroke_ticks`, `phone_buzz`, `phone_ring_chip`, `phone_wake`, `pin_pull_tink`, `plate_off_tick`, `rack_tray_whir`, `rewind_chirp`, `sand_fall`, `sand_tick`, `screw_squeak`, `speaker_tones`, `spotlight_clunk`, `tally_carve`, `text_tick`, `tile_clack`, `tile_press`, `tile_scrape`, `tiny_throne_clatter`, `toast_pop`, `vault_hum_F`, `wall_step`.
- **Reuse:** `alert_bonk`, `dialog_ok_click`, `freeze_hit_Bb`, `freeze_hit_C`, `freeze_hit_Db`, `freeze_hit_F`, `glyph_dissolve`, `heart_gliss`, `hourglass_shatter`, `keycap_popcorn`, `neon_buzz`, `neon_ignite`, `odometer_ratchet`, `orb_servo`, `paper_flutter`, `paper_whip`, `post_click`, `render_front_sweep`, `room_tone`, `rubber_stamp_C`, `server_hum`, `typing_soft`.
- D6 DROP-OUT: 26.05 f0 (the click) → 26.06 f0 (the buzz), 150 f = 2½ bars; the silent [CU] and the silent rail inside it; NO V.O.
- score.keynote-piano (29.01a): original, 1 bar, killed mid-phrase by the hard cut; the first heart Tick on 29.03's downbeat.
- score.violin (30.01): under Alyi's post only; a dead stop on the first heart; the 2-beat hold is room tone.
- Hearts to Alyi: three heart_gliss notes at the post's own pace, OFF the grid (f144, f156, f171).
- The quiet beat (29.12q · 29.11c · 29.12r): keycaps only, no music; no music under the V.O. D8 or Tasya's line.
- mix.laptop-speaker: a4-27-00 on the board's call (27.01), the call's room tone under it; nobody reacts.
- 30.24: Cancel greys over three held beats; alert_bonk on beat 4 as the on-screen arrow clicks.

