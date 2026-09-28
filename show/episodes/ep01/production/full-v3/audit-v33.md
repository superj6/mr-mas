# Ep1 v3.3: the focused final check (`audit-v33`, 2026-09-28)

> **The film checked:** `out/ep01/full-v3/ep01-v33.mp4` (Kokoro, 21:12.17). All times below are on this film's clock. The EL film (`ep01-v33-el.mp4`, 21:12.46) was checked for its sound seams and the four defect spots only.
>
> **What the check covered:** a polish round against [PLAN §6](PLAN.md) (items X, V, S, P, M), [audit-v32](audit-v32.md) and the newcomer's top 8. It is not a full re-audit.
>
> **Nobody watched or listened.** Each finding is marked:
> - **[M] measured.** Measured from the film's audio (the v3.3 mixes match it to 0.02 ms and 0.02 dB), the v3.3 room, SFX and score stems, and the locks. The scripts are audit-v32's, pointed at v3.3 (scratchpad `audit-v33/`).
> - **[J] judged.** Judged from frames: 849 sampled every 1.5 s, 4 fps around every changed cut, and full-resolution (1080p) crops where a detail is small.
>
> Nothing was edited or committed, and the frames and audio scratch are deleted.

## 1. Landed?

**The summary: 34 of the 36 items landed, 2 landed partly (X3 and P11), and none were missed.** P6 and S2 count as landed as designed.

| Item | Status | v3.3 time | Evidence |
|---|---|---|---|
| X1 lobby click | **landed** | 15:08.85 | [M] At the v3.2 spot, the mix's second difference is 1.2× local (v3.2: 85×). The largest spike in the walk-in window is the designed hang-up click (15:06.15). On the EL film, the largest spike there is the designed shutter. |
| X2 stop on ALYI | **landed** | 17:03.35 | [M] Score stem 2.0× local, mix 2.3× (v3.2: 30× and 12×). |
| X3 night re-entry | **partly** | 12:34.23 (cut 12:34.63) | [M] It now pre-laps 0.40 s, and the step at the cut is −9.1 dB (was +24.4). But the attack itself still goes −41 → −15 LUFS within 100 ms (+26 dB; EL +23.5). The 400 ms level after it is about 3 dB under v3.2. The jolt has moved rather than gone. §2. |
| X4 whip tick | **landed** | 12:43.83 | [M] Room stem second difference 0.0008, 4.0× local (v3.2: 0.0054, 13×, at −38 dBFS). |
| X5 score step | **landed** | 10:05.79 | [M] Now a `DESIGNED HIT` mark in the act3 cue sheet ("the iris flicks to the monitor"). The step at the cut is +4.8 dB over 400 ms. |
| X6 avalanche | **landed** | 17:50.0–18:06.1 | [M] The loudest 3 s is −11.4 LUFS against a talk median of −15.6 (+4.2 LU). The mix pass reports a +1.66 LU lift. |
| X7 changed cuts | **landed** | all | [M] The stem scan (every 0.2 s block, over 25× the block's p99.5): **0 discontinuities** in all 18 room, SFX and score stems. The mix scan finds 0 click candidates. All 40 room changes crossfade. Every black carries tone (§2). |
| V1 "it does." | **landed** | 4:30.88 | [J] It follows "That collar suits you." (4:28.93), and Tasya's hand is on the collar at 4:29.5. |
| V2 "he's not wrong." | **landed** | 7:15.75 | [J] "how's the dancing?" follows 0.9 s later. |
| V3 no voice at the paper | **landed** | 10:48–10:55.5 | [M] No V.O. line in the lock. [J] His face is held 2.4 s. |
| S1 Tidder trigger | **landed** | 10:07.6–10:19.7 | [J] The VP clip and the pinky promise are gone. The forum's hands stay, and his hand goes up and then down. The thread `t/singularity · "is it already here? anyone actually know?"` is legible for 4.2 s, then his reply is typed into it. |
| S2 Rima (picture only, as designed) | **landed** | 15:27.9 · 15:44–15:46 | [J] `RIMA TAMURI · CTO` is legible in the Ttemme card frame. "Okay." is cut. He shows the page's blank back. |
| S3 "Down here." | **landed** | 18:36.3 | [M] The line is gone. [J] The look down at the slate floor holds 2.2 s. |
| S4 the employee's line | **landed** | 18:26.07 | [J] A medium on the employee (the only green coat, a box in her arms), mouth lit. She is clearly the speaker. |
| S5 Tasya on TV | **landed** | 18:31.12 | [J] A `PODCAST` wall TV with a boom mic; the floor steps to slate. [M] The lock's tag is `tv`. |
| P1 his face under the board question | **landed** | 2:02.9–2:06.3 | [J] His MCU, not answering, held 3.4 s (the plan said about 1 s). The finger insert follows at 2:06.75. |
| P2 the million post | **landed** | 2:57.2–3:00.8 | [J] The wheel lands, then his thumb on Post and one preview line. The digits' 1 s hold is gone. |
| P3 the tear | **landed (small)** | 3:13.0–3:17.2 | [J, 1080p crop] A glint under the eye that tracks down to his jaw. It's 3–5 px, so it's invisible at thumbnail size. |
| P4 the collar | **landed** | 4:27.0–4:29.5 | [J, 1080p crop] Before 9.08 (2:04, 3:13) he wears two collars, red and green. At the pop, a third, yellow-orange, appears. Tasya's hand settles it. |
| P5 Atem folded in | **landed** | 9:39.8–9:43.6 | [J] v31-18.00b is gone (−4.4 s). But the monitor fills about half the frame, not "softly behind" (§3). |
| P6 the anchor (declined as written) | **landed as designed** | 7:39–7:42.5 | [J] A generic anchor at a desk with a blank lower-third bar, clearly not the senator. |
| P7 the chip order | **landed** | 9:32.0–9:34.6 | [J] A blue fleece cuff holds the order, Mas's grey sleeve is empty at the right, and the scroll's end shows. |
| P8 the glass cut | **landed** | 9:34.6–9:39.8 | [J] The line climbs off the top at 9:36.5–9:37, then the sky holds. [M] Act Three's room runs under the black: the seam's floor is −42.1 dBFS (v3.2: −51.3). |
| P9 the thread | **landed** | 10:15.3 | See S1. |
| P10 page 30 and the tab | **landed** | 10:53.1 · 11:39 · 11:46 | [J] His held, lit face. The `DECODING INTENTIONS` tab stays in the strip. The reminder pops up over his NOTIFY ME page. |
| P11 sign-ups post | **partly** | 11:38.7–11:48.5 | [J] NOTIFY ME is there. The post doesn't collapse: its card stays at the top of the page through 23.02. |
| P12 boardroom wide | **landed** | 14:24.5–14:43.4 | [J] A stepped push: medium at 14:34, MCU at 14:36.5. The phones light up in Alyi's reflection (14:40.9). [M] The longest unchanged run in the shot is 2.75 s (v3.2: about 18.9 s). |
| P13 date once | **landed** | 15:07.2 | [M] No rail in the beat; the camera's plate stays. |
| P14 two-part plates | **landed** | 3:39.5 · 6:10 | [J] `RADNUS · RUNS ELGOOG` and `NOLE · BUILDING HIS OWN`. |
| P15 the blank page | **landed** | 15:44–15:46 | See S2. |
| P16 the count | **landed** | 16:17.5–16:22 | [J] ♥405 → 406 → 407 → 406, with the voice (±0.5 s at 4 fps). |
| P17 employee and TV | **landed** | 18:25–18:36 | See S4 and S5. |
| P18 face light | **landed (per the shot pass)** | e.g. 10:53, 14:36.5 | [J] The faces are lit, with the room untouched. **No v3.2 frames are left to compare.** The claim of 1 step on Mas and 2 on the others comes from shots-act4 §V33.3. |
| P19 the cover | **landed** | 20:35.0–20:39.8 | [M] 32.03 runs 4.8 s. |
| M1 warm accent | **landed (cue sheet)** | 2:38.7–2:40.0 | [M] Marks: "M1: the felt arrives on A-flat major… with 'it likes me.'" and the Build's pass in A♭. Not heard. |
| M2 refit | **landed** | all | [M] Every score render matches its segment to the sample, Kokoro and EL. |

## 2. Sound (measured)

**The four v3.2 defects:**

| Defect | v3.2 | **v3.3 Kokoro** | **v3.3 EL** |
|---|---|---|---|
| X1 lobby click | 15:19.52: SFX cut off mid-sample, 85× local | **gone**: 1.2× at 15:08.85 | **gone**: only the designed shutter |
| X2 unfaded stop on ALYI | 17:13.27: score 30×, mix 12× | **gone**: 2.0× / 2.3× at 17:03.35 | **gone**: 3.0× / 2.3× |
| X3 night re-entry | 12:45.29: +24.4 dB in 400 ms, out of zero, on the cut | **moved**: the attack is 0.4 s early (12:34.23), −41 → −15 LUFS in 100 ms; at the cut −9.1 dB | **moved**: +23.5 dB in 100 ms at the attack |
| X4 whip tick | 12:54.50: room 13× at −38 dBFS | **gone**: 4.0×, tiny | **gone**: 4.8×, tiny |

**Chapter seams** (film audio; steps over 100 ms and 400 ms; floor within ±1.5 s):

| Seam | Kokoro | EL | Verdict |
|---|---|---|---|
| cold open → intro | 0:26.67 · +2.1 / −14.6 · −56.4 | 0:24.29 · +2.4 / −14.6 · −56.5 | Unchanged: the designed dead cut |
| intro → card | +0.3 / −7.9 · −45.5 | +0.4 / −7.9 | OK |
| card → Act One | +19.4 / +20.0 · −43.1 | +20.9 / +20.3 | The designed downbeat |
| Act One → Two | 6:29.25 · −0.2 / +3.0 · −42.7 | −0.4 / +3.1 | OK |
| **Act Two → Three** | 9:39.79 · +0.4 / +5.0 · **−42.1** | −0.3 / +3.8 · −41.5 | **Better:** P8's room J-cut under the black (v3.2 floor −51.3) |
| Act Three → Four | 11:53.21 · +1.0 / +0.9 | +1.0 / +1.1 | The crane pre-lap |
| Act Four → tag | 20:18.96 · −0.3 / +1.5 | −0.8 / −1.1 | The hum as an L-cut |
| tag → outro | 21:02.04 · +7.8 / **+13.3** | +7.7 / +13.2 (+14.5 in 200 ms) | Unchanged from v3.2; for an ear |
| end | fades to zero over 0.6 s | same | OK |

**Every boundary [M]** (222 boundaries, 210 cuts):
- **Room tone.** No run of 0.1 s or more falls below −60 dBFS except the final fade. Below −50 there are only the designed moments: the Act Three black's dead stop (11:50.96, −53.4) and three dips inside the one silence (≥ −51.6).
- **The one silence** runs from the Remove click (12:19.11) to the buzz (12:24.2), 5.07 s, room tone only. Unchanged.
- **Digital zero:** only the first 2 ms and the last 36 ms.
- **The score.** Every stop or start on a cut is on a cue-sheet window edge, silence or mark. There's none without a mark any more: X5 is now marked.
- **Dialogue.** Nothing is clipped. The two interruptions are designed (Mario, Neleh). Five line J-cuts at place changes and Tasya's statement across S4.13d, all as in v3.2.
- **Air at room changes:** the median entry air is 2.8 s and the median exit air 2.9 s.

**New in v3.3:** nothing wrong measured.
- The two click-like flags at S7.06 (18:47.5, 18:52.5) are speech and room at level: 2.1× and 1.2× in ±5 ms, with no level step.
- The P8 act-out (9:39.04) steps −8.8 dB into the black: the bell's tail, designed.

## 3. New forced or out-of-the-blue moments (judged, changed spots only)

1. **Act Three's head is busier, not softer** (9:39.8–9:43.6, P5). The Atem monitor fills about half the frame. Three text items (`MACROSOFT WELCOMES ATEM`, `KRAM · RUNS ATEM`, `OPEN SOURCE`) and "Everyone is welcome." arrive in the act's first 3.8 s. Mas doesn't look at it. It's short now, and calibration §4 lets an egg pass if it has no hold, so this is minor. **Fix:** drop Kram's plate (the hoodie says it), or darken the monitor a step.
2. **The Act Two out has lost its Mas beat** (9:34.6–9:39.0, P8). The glass was his look down; now the act ends on three small figures looking up at a cyan hairline leaving the top edge. That's readable as "the price climbs", but it's thin, and nobody's reaction carries it. **Fix:** a 2–3 px line in the intro curve's colour, and let Mas's head turn last, one drawing larger. Minor.
3. **13.09 grows to about 15.8 s unchanged apart from mouths** (7:03.8–7:19.5), with V2 added. It's a conversation two-shot, and the voice gives it a turn. Acceptable.
4. **Nothing else new reads as forced.**
   - The employee's line lands on the person who asked "Is this a coup?", which is a cause, not a blurt.
   - The TV clip reads as a clip.
   - The blank page reads as the running gag.
   - P1's held face makes the board question land on him without a line.

## 4. Calibration: did v3.3 swing?

**No.** Every measure moved only at its spot.

| Measure | v3.2 | **v3.3** | Target | Verdict |
|---|---|---|---|---|
| V.O. | 11 lines / 77 words; 0 in Act Two; a 6:49 gap | **13 / 82**; 5-1-2-4-1 by act; the longest undesigned gap is 2:45 (4:30.9 → 7:15.8) | 10–14, placed where only the voice works | **On target.** The two long silences are the designed ones: the board's side (3:41) and the return (4:08). |
| Text items a minute (lock on-screen) | 14.5 (Act Three 20.6, tag 21.8) | **14.4** (Act Three 20.2, tag 21.3) | fewer where busy | Flat. Act Three and the tag stay the densest (§3 #1). |
| Cuts a minute (ASL) | Act Three 11.8 (4.91 s), tag 14.5 (3.76 s) | **11.7 (4.94 s), 14.2 (3.85 s)** | calmer (mood §3.6) | Barely calmer. No swing either way. |
| Longest unchanged holds [M, 4 fps at 96×54, so mouths don't register] | S4.02's wide about 18.9 s | 5.04 28.8 s · S7.07/-cont 24.8 s · Sydney 18.3 s · 13.09 15.8 s: all talk holds with lipsync, and all but 13.09 unchanged from v3.2. **S4.02: 2.75 s max.** | every hold changes | Fixed where asked. The talk holds are conversation, not desk-under-voice. |
| Runtime | 21:24.5 (story 20:41.7) | **21:12.17 (story 20:29.3)** | 20–22 min | On target. |
| Plates, labels | 2 three-part plates; the walk-in dated twice | two-part plates; dated once; 0 `(REPORTED)` | world → line → plate + one word | On target. |

## 5. The newcomer's top 8 (read-v32-newcomer §8)

1. **A V.O. line reacting to Neleh's paper.** **Declined by design** (V3): a held face for 2.4 s instead (10:53). [J] It reads as taking it in.
2. **Act Two V.O. that makes "please regulate me" a strategy.** **Partly:** "he's not wrong." (7:15.8) ends the drought. A strategy line would state a motive, and calibration §9 bars that.
3. **The glass and waterline.** **Fixed**: cut (P8).
4. **A reason for the Tidder post.** **Fixed**: the thread on his screen (10:16).
5. **Trim the Act Three TV montage.** **Fixed**: the VP and pinky are gone. It's now one held frame, 7.7 s.
6. **Explain "CO-FOUNDER".** **Not addressed.** The label is still `SHIP TO: MAS MANALT, CO-FOUNDER` (9:47), and it wasn't in PLAN §6. Low.
7. **Rima's reason for being replaced.** **Partly, by design**: the CTO bar and the blank page, with no reason on the record.
8. **"Down here."** **Fixed**: cut.

## 6. Still worth fixing (ranked)

Honestly, **nothing that matters enough to block the Drive swap.** For a v3.3.1, if anyone wants one:

1. **X3, the night re-entry attack** (12:34.23, both films): [M] +24–26 dB within 100 ms. Give the felt fifth a 150–250 ms swell, or take it another 3–4 dB down. For an ear first. S.
2. **Act Three's head** (9:40): drop `KRAM · RUNS ATEM`, or dim the monitor a step (§3 #1). S.
3. **P11:** collapse the sign-ups post card once it's up (11:42.5). S.
4. **The Act Two out's line** (9:36.5): thicken it, and let Mas turn last (§3 #2). S.
5. **The tag → outro step,** +13 dB (21:02.0). Unchanged; for an ear. S.
6. **"CO-FOUNDER"** (9:47): leave it, or give it a plate relation word. Low.
