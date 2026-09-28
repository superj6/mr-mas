# Ep1 v3.4: the stick lock (`v3-lock`, 2026-09-28)

> **Status: FINAL v3.4 KOKORO LOCK, for the lead and the EL pass.** Script draft 8.3's six v3.4 beat plans ([beat-plan-v34/](beat-plan-v34/), notes [script-v34-notes.md](script-v34-notes.md)) applied as deltas on the v3.3 lock (`show/reel/ep01-v33/`; nothing there was rebuilt or edited). On top of the plans, it carries the coordinator's one delta: S4.02 loses "That is the company telling us." (§3).
>
> **All the v3.1–v3.3 rules stand:**
> - J-cut gap closing;
> - negative line `t` for pre-laps;
> - rooms leading cuts by 0.6 s;
> - the read floor;
> - S7.13's 264 Runway frames.
>
> **The tag's two Runway lengths are gone with the duck.**
>
> **No stick reel was rendered.** Only the render's plan was built (`episode.mjs --plan`). **Nobody watched or listened to any of this.** Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The lock** | `show/reel/ep01-v34/ep01-v34-{coldopen,act1,act2,act3,act4,tag}.json` |
| **The manifest** (key `ep01-v34-stick`; flash-fixed intro, outro B, Act Four "five days, told twice") | `show/reel/ep01-v34/ep01-v34.manifest.json` |
| The builder | `audio/reel/ep01-v34/build_timeline.py` (the v3.3 builder, extended). It writes the lock, the manifest and `audio/reel/ep01-v34/lock-report.json`, which lists every edit per beat. |
| The beds | `audio/reel/ep01-v34/bed.py` → `<seg>-bed.wav` + `-bed-qa.json` |
| Measurements, transcript | `audio/reel/ep01-v34/measure.py` → `measure.json`, [lock-v34-transcript.txt](lock-v34-transcript.txt) |
| The takes (the script pass's) | `audio/ep01/v34/<seg>/lines-v34.json` (the 8 new V.O. lines), and v3-vo-10 from `audio/ep01/v3/act1/lines-v3.json` |

---

## 1. Runtime and frames

| Segment | v3.3 lock | v3.4 estimate (notes §1) | **v3.4 lock** | **Frames** | vs estimate | vs v3.3 |
|---|---|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | **640** | 0.0 | 0.0 |
| Act One | 5:30.6 | 5:37.8 | **5:37.5** | **8,101** | −0.3 | +7.0 |
| Act Two | 3:10.5 | 3:01.2 | **3:01.2** | **4,349** | 0.0 | −9.3 |
| Act Three | 2:13.4 | 2:05.3 | **2:05.3** | **3,007** | 0.0 | −8.1 |
| Act Four | 8:25.8 | 8:29.2 | **8:27.8** | **12,187** | **−1.5** | +2.0 |
| Tag | 0:42.3 | 0:33.2 | **0:33.3** | **798** | 0.0 | −9.1 |
| **Story** | **20:29.3** | **20:13.5** | **20:11.8** | **29,082** | **−1.8** | **−17.5** |

- **The episode runs 20:53.9:** the story, the 30 s intro, the 2 s card and outro B (10.125 s). With the 3 s slate, the render plan is 30,165 frames (20:56.9).
- **Against the estimate, −1.8 s:**
  - **S4.02, −1.5:** the coordinator's delta (§3).
  - **5.04, −0.3:** the plan places "it's a preview." 0.8 s after the new V.O., which is the v3.3 gap (0.81 s). The estimate adds 0.3 s the placements don't have.
  - **21.02, −0.29:** the deepfake line goes and the old tail (0.26 s) follows Nedib's order line. The estimate's 0.55 s is 0.008 s short of the drop-only rule's 0.3 s threshold.
  - **18.02, +0.3:** the builder's hold after a V.O. in a beat with no lines is 0.8 s; the estimate uses 0.5.
  - Every other beat is within 0.1 s of its `est_s`.
- **The inner voice is 15 lines** (Act One 5, Act Two 1, Act Three 3, Act Four 5, the tag 1), 132 words by the notes' count. The transcript's word counter gives 124, because it counts differently.
- **Six J-cut lines, all inherited**, with negative `t` from −0.5 to −1.0 s.
- **The Runway frames:**
  - S7.13 is exactly 264 frames (Act Four frames 10906–11169).
  - The tag has none: v31-32.01d is cut, and 32.01 is now the plan's 3.2 s (77 frames).

## 2. Every changed beat against the notes

| Item | Beat | v3.3 → v3.4 (s) | What the lock has |
|---|---|---|---|
| A | 5.03 | 11.17 → 9.73 | "she'll go for three." goes. Gerg answers Rima 0.5 s after her. The caption no longer quotes the cut line. |
| A | 5.04 | 28.96 → 29.64 | v34-vo-01 (3.85 s) 0.5 s after Rima's "your call" line; "it's a preview." 0.8 s after it |
| A | 7.01 | 7.22 → 10.56 | v34-vo-02 (4.45 s) 0.4 s after "it's the bill."; Rima's J-cut (−0.6) stays |
| A | 11.03 | 9.20 → 13.59 | v3-vo-10 restored (4.59 s voiced) at 0.8 s, and Mario's memo 0.5 s after it. The plate is `MARIO`, with his line. `CLOD 1 · SAME DAY` stays at 1.0 s, as in v3.1's 11.03 with this V.O. (§4). The strip names Mario and Gerg from the V.O.'s words. |
| G | 13.02 | 3.83 → 1.60 | Sirrah's catchphrase goes; the plan's 1.6 s |
| A | 13.09 | 16.19 → 14.67 | "he's not wrong." goes; "how's the dancing?" 0.9 s after Radnus |
| B | 13.12, 13.13 | 0.63; 5.98 → 7.18 | `DEEPFAKES OF ME: SEEN 0` goes from the card, in both beats (§4). v34-vo-04 (1.30 s) 0.4 s after "put it in writing", then "Longer." 0.5 s after it. |
| B | 14.01, **14.03 and 14.05 cut** | 6.0 → 4.0; −2.40, −2.42 | The clip, its chip and the rail `MAY 12` go. `CLASS PHOTO #1 · ♥` holds from 0.2 s to the black (§4). 14.06's voice over black is unchanged. |
| A | 18.02 | 3.20 → 4.58 | v34-vo-05 (3.38 s) at 0.4 s, over the label |
| A | 18.06 | 7.20 → 5.67 | "i made it for everyone else." goes; e1-a3-18-03 at 2.2 s |
| B | 21.02, **21.03 and 21.04 cut**, 21.05, v32-21.06 | 10.60 → 8.01; −4.38, −4.40 | The deepfake line and its two copy pops go (§4). The order's line stays. 21.05 and v32-21.06 get the plan's captions (the room applauds; he switches it off). |
| A | 22.01 | 10.90 → 14.32 | v34-vo-06 (3.02 s) at 1.8 s, under the applause. The stage line follows 0.6 s after it, and the question keeps its 1.2 s gap (§4). The rail, the counter and the applause stay at the stage's opening (§4). |
| A | S1.02 | 7.00 → 7.27 | v34-vo-07 (5.03 s) at 1.2 s; the JOIN click stays at the beat's end. The strip no longer names Alyi here: the new line doesn't say her name, and she's named since 5.05. |
| **delta** | **S4.02** | 18.90 → 17.40 | §3 |
| A | S5.09 | 14.87 → 14.06 | v34-vo-09 (1.43 s) at 0.3 s; Gerg's "Sorry, one sec. I've got a build compiling." 0.5 s after it, and the call's rhythm kept (§4) |
| MM | S8.04 | 1.75 → 5.84 | v34-vo-11 (4.64 s) at 0.4 s, over the firing's drawing |
| C | 32.01, **v31-32.01d cut** | 2.58 → 3.20; −9.71 | The rail `DEC 6` leaves 32.01 for 32.02 (at 0.2 s). The monitor is dark. The tag's pad plays through to the thud. |
| C | 32.04, 33.01 | unchanged | shot notes (the monitor dark) |

**Every plan beat is in the lock once, in the plan's order.** Every kept line is present and every dropped line is gone. The one exception is Alyi's S4.02 line, dropped by the delta. Every take file exists. The only overlap is S4.08's, inherited: Adelina cuts in on Mario, 0.32 s. No on-screen item is newly under its read floor.

## 3. The coordinator's delta: S4.02

From the showrunner's "don't make anything too on the nose":
- **What goes:** Alyi's "That is the company telling us." (a5-27-28, 15.83–18.42 s).
- **What carries it:** the row of phones lighting up. In the stick, a `phone_buzz_step_1` marks the moment at 15.8 s, where his line began.
- **What follows:** Neleh's "Then we'll write step four ourselves." (S4.07, unchanged) comes directly after the phones.

**The timing:**
- Neleh's second turn ends at 14.58 s. The first phone goes over at 15.24 s (the clack). The row lights at 15.8 s and holds 1.6 s. **The beat is 17.4 s** (was 18.9, so −1.5 s).
- **The stepped push (P12)** is unchanged up to the phones: it reaches her MCU by "Monday" at 11.7 s. The clack follows 3.5 s later and the phones 0.6 s after that, so no frame is held more than 8 s.
- **The caption:** "CUT to Alyi's reflection in the dark window for his line, so it is his." becomes "Then the whole row of phones lights up at once."
- **Logged** as a deviation in `lock-report.json` (`PLAN_PATCH`, `drop_line`).
- **The pixel pass** now owes no cut to Alyi's reflection in this beat.

## 4. What didn't apply as written, and what the builder adds

1. **A retimed first line landing back in front of the line that followed it** (22.01, S5.09). The follower lost its read gap to the V.O. that was placed at the front in between: 22.01's question came 0.5 s after the stage line instead of 1.2 s. It now keeps its gap. 22.01 and S5.09 land on their estimates (14.32, 14.06).
2. **Items dragged along by their anchor line** (`ITEM_PIN`). A new V.O. at a beat's start pushed the line they were anchored to, and they went with it. They now keep the source's times:
   - 22.01's rail, counter, applause, odometer and landing (the V.O. is "under the applause for a hundred million a week");
   - 11.03's `CLOD 1 · SAME DAY` chip and name;
   - 14.01's photo.
3. **13.12's drop removed Nedib's name and the camera shutter.** They start with the stat, but they belong to the card, which stays. The coincidence rule now spares anything a kept item starting at the same time may own.
4. **13.13** is where 13.12's card rides on, and it carried the same `DEEPFAKES OF ME: SEEN 0`. It goes there too. It's logged as a deviation, since the plan only names 13.12.
5. **14.01's photo** had given way to the clip at 1.8 s. With the clip gone, it's the feed until the black (`ONSCREEN_OPEN`).
6. **21.02's two `tower_pop`s** were the cut-paper copy popping up. The notes un-draw the copy, so they go (`SOUND_DROP`).
7. **S1.02's `names[]` alyi** came from the old V.O. ("alyi set it up") and is dropped (`NAME_DROP`).
8. **5.03's caption** still quoted "she'll go for three."; the phrase is removed (`CAPTION_SUB`).
9. **The tag's chapter subtitle** is "december · sc 32-33 · the cover" (was "the Elgoog demo").
10. **The v3.3 tables keyed by beat id are reset,** because their edits are already in the v3.3 timelines. `NO_SAFETY_NET` stays on, and there are no trims.

## 5. The beds

This is v3.3's method (lock-v33.md §3). The mixer lays all 231 takes, and each chapter gets one temp bed. What changed for v3.4:
- The tag's pad no longer drops out for the demo, because its gap beat is gone. It plays through to the thud (0–22.5 s).
- All 7 beds built in about 30 s through `ops/heavy.sh`, with **0 missing SFX**.
- The one silence is Act Four, 26.15–31.26 s.
- The stick has one new SFX: the S4.02 phones (§3).

## 6. Pacing: v3.3 against v3.4

| | v3.3 lock | **v3.4 lock** |
|---|---|---|
| Shots · ASL · median shot | 228 · 5.4 s · 4.0 s | **223 · 5.4 s · 4.0 s** |
| Stays · median stay | 48 · 15.2 s | **48 · 15.2 s** |
| Entry air, median (all / spoken only) | 3.8 s / 5.1 s | **3.7 s / 5.2 s** |
| Exit air, median | 3.7 s | **3.2 s** |
| Lines · J-cuts · L-cuts | 235 · 6 · 5 | **231 · 6 · 5** |
| Mas's words · share · inner-voice lines (words) | 350 · 20.5 % · 13 (82) | **389 · 22.7 % · 15 (124)** |

## 7. How to rebuild

```sh
python3 audio/reel/ep01-v34/build_timeline.py                         # the lock + manifest + lock-report.json + pacing
bash ops/heavy.sh audio/.venv-casting/bin/python audio/reel/ep01-v34/bed.py   # the beds (about 30 s)
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v34/ep01-v34.manifest.json --plan
cd .. && python3 audio/reel/ep01-v34/measure.py                       # measure.json + lock-v34-transcript.txt
```

## 8. Open, for a ruling or an ear

1. **S4.02's 1.6 s phone hold** (§3). The pixel pass can set it to the drawing; it's one `est_s` in `PLAN_PATCH`.
2. **18.02's hold** after its V.O. is 0.8 s (the rule) against the plan's 0.5 s, and **21.02's tail** is 0.26 s against the plan's 0.55 s. Each is a one-line change if the lead wants the estimate.
3. **For an ear** (notes §8): v34-vo-04 and v34-vo-05 (pace flags), and the restored v3-vo-10 beside the newer Mas takes.
