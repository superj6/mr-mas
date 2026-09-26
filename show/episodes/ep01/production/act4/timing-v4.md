# Ep1 · Act Four · Timing v4 (the lock and the picture)

> **v4.2 (the closing pass, 2026-09-26).** The current lock is v4.2: **77 shots, 6036 frames, 4:11.50** (12:31:00 → 16:42:12). S3.08 and S5.10 are cut, S8.07 (+0.5 s) and S8.10 (+1 s) hold longer; the rest of the picture changes are labels and staging inside shots. Why: [edit-plan-v4](edit-plan-v4.md) §11 and [v4-for-review](v4-for-review.md). The renders named below were re-made from lock v4.2 under the same names.
>
> **v4.1 (the finishing pass, 2026-09-26).** This file describes the v4.0 lock (82 shots, 4:28.88). The current lock is v4.1: **79 shots, 6066 frames, 4:12.75** (12:31:00 → 16:43:18), with v4.0's shot IDs kept (S4.05, S5.07, S6.05, S7.04 and S7.12 cut; S5.09b and S7.02b new). What changed and why is in [edit-plan-v4](edit-plan-v4.md) §10; the lengths as locked are in [shotlist-v4.md](shotlist-v4.md) (generated). The v4.0 renders named below are superseded and deleted: the current files are `out/ep01/act4/animatic/act4-animatic-v4.mp4` (1920 × 1080, margin notes and the review transcript, the v4.1 mix), `act4-animatic-v4-picture.mp4` (960 × 540, the picture only, **with the mix**, for the newcomer read), `act4-v4-contact.png`, `act4-v4-contact-native.png` and `layout-v4.json`. The rest of this file is v4.0's record.

| | |
|---|---|
| **Who** | THE EDITOR, picture pass v4, 2026-09-26. |
| **Why** | The showrunner on the v3 animatic: too many cuts and pauses, hard to follow, "it should be fluid and coherent", no random silences, no half-second music; then "no hard cutoffs for rules", "clear … to someone with minimal familiarity", and "balance clarity with engaging/suspenseful storytelling". Guidance: [flow-and-continuity](../../../../bible/flow-and-continuity.md). The plan: [edit-plan-v4](edit-plan-v4.md) (final). The script: `## ACT FOUR`, draft 4.0. |
| **What exists** | The board [shots-v4.json](shots-v4.json) (82 shots, from the plan's §3) → the lock [shots-locked-v4.json](shots-locked-v4.json) → the animatic's [data-v4.ts](../../../../../studio/src/episodes/ep01/act4/animatic/data-v4.ts), layouts `shots4.ts` / `plan4.ts`, composer `frame4.ts`. The generated shot list: [shotlist-v4.md](shotlist-v4.md). |
| **Renders** | `out/ep01/act4/animatic/act4-animatic-v4-dlgguide.mp4` (1280 × 720, margin notes and review transcript) and `act4-animatic-v4-picture-dlgguide.mp4` (960 × 540, **the picture only**, for the newcomer test). Both carry a **dialogue guide**: the 46 takes at their lock frames, with no score, no room beds and no SFX. It is a sync check, **not the mix**; its gaps are silent by design. The sound pass mixes from this lock (§6). Also `act4-v4-contact.png` (one 480 × 270 still per shot, at 1×), `act4-v4-cuts-1..3.png` (every cut: the outgoing shot's last frame beside the incoming shot's third) and `layout-v4.json` (what each shot is built from). |
| **Honesty** | I can't play video or audio in real time. Everything below was **measured from the lock, or checked on stills**. Nothing here "flows", "reads" or "sounds" right until a person has watched and listened; edit-plan-v4 §8 lists the 15 checks, and §8 below adds the picture pass's own. |
| **Numbers** | Every number is a guide for spotting problems, not a gate (flow-and-continuity). Where I departed from the plan, I say why. |

**Clock.** Act frame 0 = episode 12:31:00. 24 fps.

---

## 0. The result

| | v3 (measured) | v4 plan (§6) | **v4 lock** |
|---|---|---|---|
| Runtime | 4:08.9 (248.9 s) | ≈ 4:28 (268.0 s) | **4:28.88 (268.9 s)**, 12:31:00 → 16:59:21 |
| Shots | 119 | 82 | **82** |
| Mean / median shot | 2.09 / 1.88 s | ≈ 3.3 / 2.75 s | **3.28 / 2.83 s** |
| Shots under 2 s / 1.5 s / 1 s | 72 / 48 / — | 21 / 4 / — | **21 / 4 / 0** |
| Runs of 3+ shots under 1.6 s | 6 | 0 | **0** |
| Runs of 3+ shots under 2 s | — | 1 (the avalanche) | **1**: S6.02–S6.05, the avalanche montage |
| Most cuts in any 10 s | — | 5 | **5** (12 windows reach 5; §2) |
| Dialogue: reply gaps | 0.125 s, uniform | 0.2–1.2 s by exchange | **median 0.5 s**, from −0.29 s (overlap) to +1.29 s (§3) |
| D6 (the Cancel click's digital silence) | ≈ 2½ bars | "about 5 beats" | **3.54 s (5.7 beats)**, one departure from the plan's lengths (§4) |

Runtime is an outcome (flow-and-continuity §6). The lock is 0.9 s longer than the plan's sum: +2.0 s (47 f) of growth where a take's tail or a read floor needed it, −0.5 s (12 f) given back by cuts on the turn, and −0.6 s (14 f) trimmed from D6 (§4).

---

## 1. How the lock places things (`tools/lock_v4.py`)

v3's lock rules were each satisfied, and together made the jagged cut: a uniform 3–7 f reply gap, cuts snapped to the beat grid, every set-piece cut to its bar count. v4 keeps none of them. What it does instead:

1. **A line's length is its take** (`lines.json` `frames_24`). One take changed: `a4-25-10b`, below.
2. **Replies are spaced like people talk,** using the plan's gap for **that** exchange (edit-plan-v4 §5.6): quick replies 0.3–0.5 s, loaded ones 0.6–0.9 s, and the one long clear moment (Adelina's "no" to Mario's money call) 1.3 s. Scripted overlaps keep their frames from the cue sheet. No gap is a default.
3. **Cuts land on story points, not on a grid.** Most shots start where the last one ended. Nine start **on the turn**: a set lead (0–0.6 s) before the line they cut to. The line being answered may run across the cut, which is an L-cut on the reply ("welcome" under Mas's "leave it open.", "hi." under "Hello.").
4. **A shot keeps the length the plan chose for comprehension,** unless its content needs more: its last line plus a short tail (8 f), a must-read text item held for its read floor (0.25 s + 0.05 s a character, **counted from the frame it lands, in the order items land**), or a story mark. Then it grows by exactly the shortfall, and the lock logs it.
5. **Rails carry time and place only.** Each types on at 2 characters a frame, holds for its read floor plus 0.75 s, and clears. A rail can run across a cut into the next shot of the same sequence (the Q\* rail does); it's clamped so it never runs into a new place. The side badge carries the side; it flips on S2.05's whip frame and on the first frame after the card.
6. **Story marks are frames in the lock** (the click, the tilt, the glance, the stamp, the label flip, the shatter…). The layouts read them, and so can the sound pass (§6), so picture and sound share one clock.
7. **Nothing snaps to the 96 bpm grid.** The music is to be rendered to the picture (edit-plan-v4 §5.7), not the picture cut to the music.

**The one take edit.** `a4-25-10b` "Three left this year. Four of us vote." is NELEH's delivered `a4-25-10` take (t01), cut at 0.775 s. That point sits inside the digital silence of the 0.28 s pause after "seats." (under −110 dBFS; the "s" of "seats" has decayed below −75 dBFS by 0.74 s). It was re-trimmed with the pass's own 20 ms head / 40 ms tail and re-levelled to −16 LUFS (true peak −2.6 dBTP). The ASR reads "Three left this year, four of us vote." It is 56 f (2.32 s). It's a new row in `lines.json` with the same fields plus `derived_from`, so `a4-25-10` and v3 are untouched. Files: `audio/ep01/act4/dialogue/wav|mp3/a4-25-10b.*`, `takes/a4-25-10b/`. **It needs an ear on the head of "Three"** (plan §8 check 12). The two changed post texts are rows `a4-27-01b` (pending the facts re-fetch, with its fallback in the row) and `a4-26a-01b`. They are unvoiced, so no scratch read was made. No other line was recorded or changed.

---

## 2. Shot lengths

**Distribution** (82 shots):

| Length | Shots | |
|---|---|---|
| under 1.0 s | 0 | no flash cuts at all; the act has no impact beat that needed one |
| 1.0–1.5 s | 4 | |
| 1.5–2.0 s | 17 | |
| 2.0–2.5 s | 9 | |
| 2.5–3.0 s | 13 | |
| 3.0–4.0 s | 17 | |
| 4.0–5.0 s | 10 | |
| 5.0–6.0 s | 5 | |
| 6.0 s and over | 7 | S1.07 the call (6.0), S7.01 the box (6.0), S5.09 Gerg (6.5), S7.06 Terb's wide (7.33), S1.03 THE PLAN (9.0), S4.08 the split (9.08), S5.06 the letter (10.25). Each holds a sequence of changes inside one frame; see the plan §3 |

**By sequence:**

| Seq | TC | v3 | Plan | **Lock** | Shots | Mean / median | Notes |
|---|---|---|---|---|---|---|---|
| S1 noon, the plan and the call | 12:31:00–13:11:20 | 35.1 s (20) | 41.4 | **40.83** | 12 | 3.40 / 2.62 | −0.58 s: D6 trimmed (§4) |
| S2 that night, the third mark | 13:11:20–13:25:02 | 11.9 (4) | 13.25 | **13.25** | 5 | 2.65 / 2.50 | the V.O. moved a beat later so the rail clears first (script 4.0) |
| S3 Friday, the board's side | 13:25:02–13:56:13 | 27.9 (13) | 31.25 | **31.46** | 9 | 3.50 / 3.00 | Rima's plate read (+0.17), the coup turn (−0.13), Alyi's line tail (+0.17) |
| S4 the weekend, step four | 13:56:13–14:46:14 | 42.2 (23) | 49.0 | **50.04** | 15 | 3.34 / 2.62 | the split grows +0.58 s (Mario's money call + tail), Tasya's shot +0.29 |
| S5 2 AM, what they didn't know | 14:46:14–15:30:20 | 44.7 (19) | 44.5 | **44.25** | 12 | 3.69 / 2.73 | two cuts on the turn come in early ("mostly.", "leave it open.") |
| S6 the avalanche | 15:30:20–15:46:10 | 20.0 (13) | 15.5 | **15.58** | 6 | 2.60 / 1.92 | the montage: one clock, its beats 1.25–1.9 s |
| S7 the return | 15:46:10–16:30:06 | 39.5 (17) | 43.5 | **43.83** | 13 | 3.37 / 2.75 | Terb's wide +0.33 ("…Ah." + tail) |
| S8 the lobby, and after | 16:30:06–16:59:21 | 27.6 (10) | 29.5 | **29.62** | 10 | 2.96 / 2.88 | the memo's tail +0.12 |
| **Act** | | **248.9 (119)** | **268.0** | **268.88** | **82** | **3.28 / 2.83** | |

**Cut density.** At most 5 cuts fall in any 10 s window. Twelve windows reach 5. They are the falling tile (from 13:01), the phone and "super." into the dark room (13:07–13:15), the end of pass one (14:42: "Step four?", Mada, the card, the home shot), the avalanche (15:30–15:36), the Terb block (16:10–16:15) and the lobby (16:30–16:33). None contains a shot under 1.25 s. The only run of three or more shots under 2 s is S6.02–S6.05, the avalanche montage under one cue, as the plan intends.

### 2.1 The short shots (under 1.6 s) and why each is short

| Shot | Length | Why it's short, and why that's right (guide: reactions 1.5–2.5 s, montage beats 1–2.5 s) |
|---|---|---|
| S1.06 JOIN | 1.50 | An action insert: the click, and the tape-stop reaching zero on it. It is lengthened from v3's 1.25 so the click registers |
| S1.08 the eyes | 1.25 | One reaction: the pupils move one pixel. Doubled from v3's 0.62 |
| S2.04 the Orb counts 2, 3 | 1.50 | The count's return after the TPOOL insert. It's the same setup as S2.02 (1.75), so it reads as one count around a bracket |
| S4.05 the phones overhead | 1.50 | One action: the first phone tips off, *clack*. A table insert between two people shots |
| S4.07 Neleh at the blank line | 1.50 | Her one moment of doubt, a reaction. Plan 1.5, up from 0.62 |
| S6.02 Mas watching | 1.50 | Avalanche montage beat |
| S6.05 the black tile pushed out | 1.25 | Avalanche montage beat: one idea, no sound |
| S7.03 "hi." | 1.25 | The line is 0.54 s; the cut on "Hello." lands at 1.25 s |
| S7.12 Mas reading Gerg's post | 1.25 | A no-change reaction ("his face doesn't change"). The post itself held 3.25 s on the shot before |
| S8.02 the box of zeros | 1.50 | A prop insert between the sign and the refused dialog |

No two of these sit next to each other outside the avalanche.

---

## 3. Dialogue rhythm (as locked)

46 voiced lines, 1607 f of speech (24.9% of the act). The replies, with the gap the lock gave them (negative = overlap):

| Exchange | Gap | Plan's guide |
|---|---|---|
| NELEH "…Four of us vote." → "This board controls the company." | +0.54 s | 0.3–0.6, on the drawings |
| "The investor gets—" → "And the CEO owns—" | +0.54 | 0.3–0.6 |
| "And the CEO owns—" / MADA "Good question." | −0.17 (4 f overlap) | keep: the cut-off is the joke |
| RIMA "We'll share more soon." / "Share what?" (O.S.) | −0.25 (6 f) | keep: interrupted |
| "Share what?" → "More. Soon." | +0.58 | 0.5–0.7: the identical non-answer |
| "Is this a coup?" → "You can call it this way" (across the cut) | +0.79 | 0.6–0.9: the first admission |
| "…Footnote three." → "Step four will reveal itself." | +0.46 | 0.3–0.5 |
| ALYI / "When?" | −0.17 (4 f) | keep: heated |
| "The company is calling us." → "That is the company telling us." | +0.50 | 0.4–0.6 |
| MARIO / ADELINA "In plain English: no." | −0.29 (7 f) | keep: she takes the phone |
| ADELINA → MARIO "Hi. Yes. We're very worried. How much?" | +1.29 | 1.0–1.5: the click, the dial tone, the rail, the second ring |
| TASYA's post → "Step four?" (across the cut) | +0.79 | 0.6–0.9 |
| V.O. "the badge was a joke." → "mostly." (across the cut) | +0.83 | 0.7–1.0 |
| GERG "One sec. Compiling—" / "what are you building?" | −0.17 (4 f) | keep |
| "what are you building?" → "The company. Again. Just in case." | +0.33 | 0.3–0.4 |
| V.O. D8 → TASYA (O.S.) "Everyone is welcome." | +0.79 | 0.6–1.0 |
| "Everyone is welcome." / "leave it open." (across the cut) | −0.17 (4 f) | keep: on the tail of "welcome" |
| "hi." / "Hello." (across the cut) | −0.04 (1 f) | keep |
| "Which room is on fire?" → "…Ah." | +0.92 | 0.8–1.0: the look-around |
| "Terms?" → MADA "Good question." (one two-shot) | +0.50 | 0.4–0.6: he takes his time |
| MADA → MAS "good question." (across the cut) | +0.63 | one beat late |
| "What's in there?" → "it's a preview." | +0.29 | 0.25–0.4 |

**Wordless stretches.** Some run over 6 s between voiced lines. They carry the story in picture and read text, and the plan scores all of them (§6):
- the call and the fall, "Good question." → "super." (22 s): the card, the dialog, the cursor, D6, the CU, the phone
- the letter and the check (16 s)
- the posts and the lobby in the coda of S7–S8 (25 s): Gerg's post, Ttemme's post, the sign, the refused dialog

With the dialogue guide alone, these play as silence. **They are not silence in the plan.** Each is a spot to check once the mix is in (§8).

---

## 4. Where the lock departs from the plan's lengths, and why

| Shot | Plan → lock | Why |
|---|---|---|
| **S1.09** the click | 3.75 → **3.42 s** | The plan's own lengths put D6 (click to buzz) at 4.1 s, 6.6 beats. The script's 4.0 text says "the drop-out ran about 5 beats", and the showrunner's note is against long silences. The tail after the four tiles close goes from 15 f to 6 f |
| **S1.10** the silent CU | 2.25 → **2.00 s** | With S1.09, D6 is 3.54 s (5.7 beats). `+1 FIRING` types at 0.62 s, reads by 1.33 s, and the face holds 0.67 s more before the buzz. **The first thing to check by ear**, as the plan says: the 3.5 s of digital silence, then the ≈ 8 s music-free span to the carve |
| S2.01 the carve | length kept; the V.O. moves 0.62 → **1.25 s** in | Script 4.0: the `NOV 17 · NIGHT` rail clears before the V.O. Its read floor is 0.96 s. The V.O. still ends 2.8 s before the `(REPORTED)` rail |
| S4.12 the door | length kept; the rail hold is **1.3 s** | Script 4.0: the `11:53 PM PT` rail types and clears before the door opens (f31) |
| S8.03 the refused dialog | length kept; **one try, not two** | Script 4.0 has one click and the shake. The plan's "somebody tries again" was dropped as busier than the beat needs |
| grown shots (lock log) | S3.04 +4 f, S3.07 +4 f, S4.04 +2 f, S4.06 +5 f, S4.08 +14 f, S4.13 +7 f, S7.06 +8 f, S8.08 +3 f | Each grew by exactly what a take's tail or a plate's read floor needed |
| cuts on the turn | S3.06 −3 f, S4.03 −3 f, S5.04 −1 f, S5.11 −5 f | Each cut lands a set lead before the line it cuts to (§1.3) |

Everything else runs at the plan's length.

---

## 5. Text on screen

Each must-read item's read floor is checked in the order it lands, and every one clears (lock `problems`: none). The tightest:
- S2.03's `(REPORTED)` rail: 2.71 s up against a 2.62 s floor, inside the 3.5 s flashback
- S4.08's `(REPORTED) · THE BOARD OFFERED MARIO THE JOB`: up 3.21 s, floor 2.46 s. It is the act's one rail read under a voice (plan §8 check 6)
- S5.06, the letter page, with four items in sequence over 10.25 s: header, insult line with the counter rolling under it, demand, `ALYI (REPORTED)`
- S3.03, the blog post: 64 characters in 3.75 s

The 14 rails, with the time each is up, are at the foot of [shotlist-v4.md](shotlist-v4.md). No frame stacks a card, a rail and a plate. Where a plate shares a shot with other text (Rima, Mario, Ttemme, Tasya), the plate lands first and, for Mario and Tasya, clears before the next item.

---

## 6. For the sound pass: the story marks on the act clock

`shots-locked-v4.json` has the same shape as v3's lock:
- `audio_cues`: the 46 voiced takes, with `abs`, `gain_db`, `via` and the `clean` file where a call chain is built
- `posts`
- `lines_gaps`
- `shots[].marks`: shot-relative frames
- `sound_marks`, below

The designed stops and rests, resolved from the plan's §5.2:

| Kind | What | TC | Act frame | Span |
|---|---|---|---|---|
| stop 1 | **D6**, the Cancel click (S1.09) → the phone's buzz (S1.11) | 13:04:03 | 795 → 880 | 3.54 s of digital silence |
| stop 2 | Gerg's glance (S5.09 `glance`); his keys return at `type` | 15:20:16 | 4072 | to S5.09 `type` (+1.15 s) |
| stop 3 | MADA's label (S6.06 `label`) | 15:43:20 | 4628 | the label's hold to the cut, 2.6 s |
| stop 4 | "Terms?" (S7.07) | 16:10:19 | 5275 | the long hold, to S7.09 `stamp` |
| rest | the four dial tones at the split's opening (S4.08) | 14:17:23 | 2567 → 2591 | 1.0 s |
| hang | the pizzicato's held note under "Step four?" and Mada | 14:43:04 | 3172 → 3254 | 3.4 s (a pedal, not a stop) |
| decay | the violin's held note, from the first heart (S7.01 `heart1`) | 15:50:17 | 4793 | — |
| rest | the sand's held beat (S7.13 `shatter` → `fall`) | 16:29:00 | 5712 → 5728 | 0.67 s |
| rest | the lobby CU before "okay." | 16:37:12 | 5916 → 5978 | 2.58 s |

Sequence boundaries (one continuous cue each, plan §5.1) are `sequences[].start_frame / end_frame`. The planned cue and room for each is in the lock, and in the animatic's margin ("PLANNED CUE").

---

## 7. The picture: what each shot is drawn from, and what the still check changed

**Method.** I rendered every shot at its key frames and checked each against its purpose in the plan, plus every cut (outgoing last frame beside incoming third frame, `act4-v4-cuts-*.png`) and a still per shot (`act4-v4-contact.png`). Fixed during the check:
- **S1.03–S1.05 THE PLAN** is one 480 × 330 sheet, redrawn at the section's scale (`plan4.ts`).
  - The chair row carries two-line plates, `MAS` / `CEO` and `GERG` / `CO-FOUNDER`. The four take the invite icons when the ring draws.
  - The box round the six, the arrow and the company are on the same sheet. The CEO box sits at the company's right wall, with the fence and key ring just outside it.
  - The tilt is 60 px at 1 px a frame, and the stamp leaves the top of frame with it.
  - S1.04 is one fixed 2× crop. The company's label, which the crop would cut mid-word, is dropped from the detail. `EQUITY: 0` now stamps at the same size as `VOTES: 0`, side by side, with `(HIS TESTIMONY)` under it, so the two zeros read as one picture.
- **The call is one screen** (S1.07). The tiles slide into speaker view and back in three held steps; the live caption `ALYI …` sits under his pinned tile. S1.09's cursor carries the `ALYI` tag in his colour.
- **Neleh's laptop** puts Alyi's tile top-right. That is her gallery order, and it sets up the **match cut** into the all-hands. The all-hands plate slides 30 px so his doorway lands where his tile's doorway was: the shift repeats the plate's left edge, a door jamb, for 30 px. Check the match in motion.
- **Stand-in hands.** The click-hand stand-in used as Neleh's pen (S3.02, S3.09, S4.14) read as a blob in stills, so it is replaced by a drawn marker. On S4.14 the marker enters, holds a beat, then writes the `?`.
- **Rima** sits in a drawn high-backed leather CEO chair under her spotlight (tufting, piping and wings, so it doesn't read as a screen). S4.10's spotlight swings off the matching empty chair.
- **Caller IDs.** The four ringing phones in S4.02 (seats A, C, D and the right end) carry `STAFF · STAFF · INVESTORS · STAFF` on tags just above them. The overhead S4.05 uses landscape phones, with the IDs on their screens.
- **The split** (S4.08) is two 238 px panes. Adelina crosses into the right pane to take the phone. ELGOOG's meter is a tag at the pane's edge (NOZAMA's own meter is in the pane). Mario's plate is re-measured so it fits its lettering.
- **The lobby camera** (S4.09) is labelled `NOPEAI HQ · LOBBY`. The CCTV's tracking box reads `VISITOR: GUEST` over the walking figure (the lanyard itself is 3 px), and the post is the right way up.
- **Tasya's sign** `MAS · GERG →` is sized to its lettering.
- **Rima's post** is legible as `RIMA TAMURI` on the first card (S5.03); every later avatar stays glyph noise.
- **The letter page** (S5.06): ALYI's call thumbnail is now labelled and lights with the highlight.
- **The check** (S5.08): the VOID stamp is spaced so its two lines don't touch.
- **Gerg's over-the-shoulder** (S5.09): his tile now sits in a monitor in the dark room, with its stand and its spill on the desk, rather than floating in black.
- **The avalanche** (S6) samples one stack on one clock across all six shots, with the letter's `745 / 770` static (v3's counter restarted at 0).
- **The term sheet** (S7.10): Terb's seal has no words. An invented `AGREED` was removed, since the stamp gesture already says it.
- **Gerg's phone** (S7.11) lost the stand-in's own "post-ui stand-in" label, which was production chrome inside the picture.
- **The reception desk** (S8.05): its top is recoloured to pale stone with brass edges, only where the pixels are the desk's (hand and sleeve untouched). It no longer shares the suite's dark top.
- **The vault** (S8.07) is drawn at room scale: a door, a wheel, the `Q*` stencil and the sticky note `DO NOT OPEN. DO NOT EXPLAIN.`, with the Orb at Mas's shoulder. It replaces a labelled box.
- **The screwdriver hand and scorch** (S8.09). The plate now comes off with 10 frames left to see it gone (v3's timing took it off on the last frame).
- **The observer chair** (S8.10) is drawn: a Macrosoft-blue folding chair in four held drawings, with its `MACROSOFT · OBSERVER (NON-VOTING)` placard.

**Still stand-ins (19 shots, all drawn, none a label):** post-ui cards (S3.05, S3.09, S4.09, S5.03, S7.01, S7.11, S7.13), the kit.cards act card (S5.01), the letter page's lettering (S5.06), the 2× hourglass (S4.11, as v3), the flat phones (S4.05), the floor's box and coat (S7.04), Terb's wide staging (S7.06, below), the crop "low" angle (S8.01), and the drawn hands, desk, vault and chair (S8.02, S8.05, S8.07, S8.09, S8.10). The ledger is `layout-v4.json`.

**Picture issues I can see but haven't solved (for the art owners):**
- **S7.06:** Mas walks through the freeze on the near side of the table, while Terb stands by the far wall at the door. This is v3's own staging. The pin-pull reads as reaching across depth, and a proper walk-to-Terb drawing would fix it.
- **S4.08's left pane** can't hold both Neleh and Mada at this scale; Mada sits outside the crop.
- **S4.09:** the lobby figure is small, so `GUEST` rides the tracking box, not the lanyard.
- **S7.13's hourglass** is small at insert scale.
- **The 1:2 screen thumbnails** (the laptop edge in S3.02) and **the 2× hourglass** are the two scaled stand-ins v3 already carried.

---

## 8. What a human must still check (beyond edit-plan-v4 §8)

1. **Watch the v4 picture with the mix.** The renders here carry only the dialogue guide, so every gap between lines is silent. Judge flow, music and holes only on the sound pass's mix, muxed onto this picture:
   ```sh
   ffmpeg -i act4-animatic-v4-dlgguide.mp4 -i act4-mix-v4.wav \
     -map 0:v -map 1:a -c:v copy -c:a aac out.mp4
   ```
   Or re-render with `MIX=<wav>`.
2. **D6 at 3.5 s**, and whether the plan's 4.1 s played better.
3. **The match cut** S3.05 → S3.06: does Alyi's doorway land where his tile's was?
4. **The ear check on `a4-25-10b`'s head.**
5. **Judder** on S1.01's drift (12 px), S1.03's tilt (60 px) and S5.06's scroll (40 px).
6. **The newcomer test** on `act4-animatic-v4-picture-dlgguide.mp4` (no speaker names in frame), with a transcript that names speakers only once the show has (plan §8 check 13).

## 9. Running it

```sh
python3 studio/src/episodes/ep01/act4/animatic/tools/board_v4.py      # shots-v4.json from the plan's tables
python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v4.py       # shots-locked-v4.json + data-v4.ts
cd studio && npx esbuild src/episodes/ep01/act4/animatic/tools/render4.ts --bundle --platform=node --outfile=<scratch>/anim4.cjs
node <scratch>/anim4.cjs check                                    # every shot has a layout, no gaps
node <scratch>/anim4.cjs contact <out.png> native                 # one 480 x 270 still per shot
node <scratch>/anim4.cjs cutpairs <dir>                            # every cut, both sides
node <scratch>/anim4.cjs ledger <out.json>                         # what each shot is built from
MIX=<wav> node <scratch>/anim4.cjs video   <out.mp4> 6             # 1280 x 720 (margin + transcript)
MIX=<wav> node <scratch>/anim4.cjs picture <out.mp4> 6             # 960 x 540, the picture only
python3 studio/src/episodes/ep01/act4/animatic/tools/shotlist_v4.py   # shotlist-v4.md from the lock (after ledger)
```

The Remotion entry registers `ep01-act4-animatic-v4`, `ep01-act4-animatic-v4-picture` and `ep01-act4-animatic-v4-still`. v3 is unchanged as `ep01-act4-animatic` and renders through `tools/render.ts`. A Remotion still of v4 (act frame 2640) is pixel-identical to the Node renderer's (0 of 921,600 pixels differ). v3's outputs, `data-v3.ts`, `lock_v3.py` and `lines.json`'s v3 rows are untouched.
