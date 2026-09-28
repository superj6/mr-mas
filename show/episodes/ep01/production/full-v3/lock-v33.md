# Ep1 v3.3: the stick lock (`v3-lock`, 2026-09-28)

> **Status: FINAL v3.3 KOKORO LOCK, for the lead and the EL pass.** Script draft 8.2's six v3.3 beat plans ([beat-plan-v33/](beat-plan-v33/), notes [script-v33-notes.md](script-v33-notes.md)) applied as deltas on the v3.2 lock (`show/reel/ep01-v32/`; nothing there was rebuilt or edited). The v3.1 and v3.2 rules all stand:
> - J-cut gap closing;
> - the Runway frames;
> - negative line `t` for pre-laps, down to −4 s (the schema's floor);
> - rooms leading cuts by 0.6 s;
> - the read floor.
>
> **No stick reel was rendered** (the coordinator: disk is at 5 GB). Only the render's plan was built (`episode.mjs --plan`, 40 MB), for the chapter clock and the transcript.
>
> **Nobody watched or listened to any of this.** Every number is measured from the files. Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The lock** | `show/reel/ep01-v33/ep01-v33-{coldopen,act1,act2,act3,act4,tag}.json` |
| **The manifest** (key `ep01-v33-stick`; flash-fixed intro, outro B, Act Four "five days, told twice") | `show/reel/ep01-v33/ep01-v33.manifest.json` |
| The builder | `audio/reel/ep01-v33/build_timeline.py` (the v3.2 builder, extended). It writes the lock, the manifest and `audio/reel/ep01-v33/lock-report.json`, which lists every edit per beat. |
| The beds | `audio/reel/ep01-v33/bed.py` → `audio/reel/ep01-v33/<seg>-bed.wav` + `-bed-qa.json` |
| Measurements, transcript | `audio/reel/ep01-v33/measure.py` → `audio/reel/ep01-v33/measure.json`, [lock-v33-transcript.txt](lock-v33-transcript.txt) |
| The takes (the script pass's) | `audio/ep01/v33/act4/lines-v33.json`: v33-a4-0001 (the employee), v33-a4-0002 (Tasya's TV cut) |
| The restored V.O. | v3-vo-09 and v3-vo-12, from `audio/ep01/v3/<seg>/lines-v3.json`, the files the plans name |

---

## 1. Runtime and frames

| Segment | v3.2 lock | v3.3 estimate (notes §1) | **v3.3 lock** | **Frames** | vs estimate | vs v3.2 |
|---|---|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | **640** | 0.0 | 0.0 |
| Act One | 5:29.8 | 5:30.6 | **5:30.6** | **7,934** | 0.0 | +0.8 |
| Act Two | 3:13.0 | 3:10.6 | **3:10.5** | **4,573** | 0.0 | −2.5 |
| Act Three | 2:22.4 | 2:13.4 | **2:13.4** | **3,202** | 0.0 | −9.0 |
| Act Four | 8:28.5 | 8:24.8 | **8:25.8** | **12,138** | **+0.9** | −2.7 |
| Tag | 0:41.3 | 0:42.3 | **0:42.3** | **1,016** | 0.0 | +1.0 |
| **Story** | **20:41.7** | **20:28.4** | **20:29.3** | **29,503** | **+0.9** | **−12.4** |

- **The episode runs 21:11.4:** the story, the 30 s intro, the 2 s card and outro B (10.125 s). With the 3 s title slate, the render plan is 30,586 frames (21:14.4).
- **The one estimate miss is S7.02b, +0.91 s** (5.71 s against 4.8):
  - The TV cut starts at `start+0.5` as planned and ends at 4.36 s.
  - The beat keeps v3.2's hold after "…around them." (1.35 s), under the lock's old-tail rule: the room finishes turning slate there.
  - The notes (§1) expected about 4.8 s, which is the take plus a short tail.
  - **If the lead wants 4.8 s,** it's one entry: `TAIL_CUT` plus the plan's `est_s`.
  - Every other beat is within 0.02 s of its `est_s`.
- **The Runway frames are reserved:**
  - S7.13 is exactly 264 frames (Act Four frames 10955–11218; it moved 66 frames earlier with the cuts before it).
  - 32.01 is 62 frames, so the demo splices at tag frame 62.
  - v31-32.01d is 233 frames.
- **The inner voice is 13 lines and 82 words** (v3.2: 11 and 77): Act One 5, Act Two 1, Act Three 2, Act Four 4, the tag 1.
- **Six J-cut lines**, all inherited, with negative `t` from −0.5 to −1.0 s. No new line J-cuts: v3.3's one J-cut is a sound, the Act Two seam (§3).

## 2. Every changed beat against the notes

| Item | Beat | v3.2 → v3.3 (s) | What the lock has |
|---|---|---|---|
| P1 | 5.07 | 8.87 → 9.90 | +1.03 at the tail: his face held after "It's a research preview." (the MCU cut-in is the pixel pass's) |
| P2 | 6.06 | 4.60 → 3.60 | The post is its preview line, `MAS (post): "CHATGTP launched on wednesday. today it crossed…"`. The 1 s comes out of the whole beat, with its items scaled ×0.78, since the beat has no lines. |
| P3, P4 | 7.01, 9.08 | unchanged | shot notes only |
| P14 | 8.03, 12.02 | unchanged | `RADNUS · RUNS ELGOOG`, `NOLE · BUILDING HIS OWN`. 12.02 keeps v3.2's read-floor hold (the plan kept 7.447 s). |
| **V1**, P4 | 9.09 | 20.69 → 21.48 | "it does." (v3-vo-09, 0.79 s voiced) 0.5 s after "That collar suits you.", then "and the rent?" 1.2 s after it. The key-ring clink stays on the line (0.9 s). |
| **V2** | 13.09 | 14.67 → 16.19 | "he's not wrong." (v3-vo-12, 1.12 s) 0.4 s after Radnus, then "how's the dancing?" 0.9 s after it |
| P6 | 14.01 | unchanged | a shot note (the anchor stays generic) |
| P7 | 17.10 | 2.50 → 3.00 | +0.5 at the tail |
| P8 | 17.11, **17.12 cut**, 17.13 | 4.42, −4.50, 0.75 | 17.11 gets the new frame and caption. The glass goes. Act Three's room leads 0.6 s under 17.13's black (bed §3). |
| **P5** | v31-18.00 ← **v31-18.00b merged** | 3.2 + 5.0 → 3.8 | "Everyone is welcome." moved in at `start+1.4` (monitor tag kept). `MACROSOFT WELCOMES ATEM`, `KRAM · RUNS ATEM` and `OPEN SOURCE` come in at 0.2 s. The JUL 18 chip goes. Kram's name comes along from the merged beat (§4). |
| P5 | 18.01 | unchanged | caption |
| **S1** | **v31-19.02 cut**, v31-19.03 | −3.60; 10.4 → 7.7 | The VP clip goes, and the pinky-promise chip goes. Remuhcs at `start+1.6`; her 65-character plate is up for the whole beat, 7.5 s, over its 3.5 s read floor. |
| S1, P9 | 20.01 | 3.42 → 4.40 | The TIDDER thread's title from 0.2 s (68 characters, up for 4.2 s against its 3.65 s floor). The reply comes 0.98 s later than in v3.2 (§4). |
| V3, P10 | v31-20.07, v31-20.08 | 5.0; 1.2 → 2.4 | no voice; his held face +1.2 s at the tail |
| P11 | v32-22.04 | 5.0 → 4.5 | scaled ×0.9 (no lines); NOTIFY ME and the post stay |
| P10 | 23.02 | unchanged | frame and caption |
| P12, P16 | S4.02, S5.03 | unchanged | shot notes |
| P13 | v32-S5.00 | unchanged | the rail goes; the camera's plate stays |
| **S2** | S4.10 | unchanged | `RIMA TAMURI · CTO` from 0.8 s, as the spotlight leaves her (Ttemme's figure comes in at 0.8 s, his plate at 1.0) |
| **S2**, P15 | S4.10b | 14.45 → 15.20 | "Okay." goes. The page turn (`paper_whip`, 11.77 s) stays, then the blank back and the hourglass: the plan's 15.2 s. |
| **S4**, P17 | S7.02 | 5.94 | The employee's new take at `start+1.4` (4.12 s voiced). The stick's figures put the employee in Tasya's place among the boxes. |
| **S5**, P17 | S7.02b | 8.58 → 5.71 | The TV cut at `start+0.5` (3.85 s), tag `tv`. Tasya is off the floor; the staff pack (§1 for the length). |
| **S3** | S7.03 | 2.80 → 2.20 | "Down here." goes. The caption no longer quotes it: "The look holds; the invite follows." |
| P19 | 32.03 | 3.80 → 4.80 | +1.0 at the tail |

**Every plan beat is in the lock once, in the plan's order.** Every kept line is present, and every dropped line is gone. Every take file exists, and no line overlaps another except S4.08's, which is inherited: Adelina cuts in on Mario, 0.32 s.

## 3. The beds

The v3.2 method runs on the v3.3 timelines (lock-v32.md §5). The mixer lays all 235 takes at −3 dB, and each chapter gets one temp bed, ducked −10 dB. What's new in v3.3:
- **THE ROOFTOP's pad** stopped on the glass (17.12). It now stops where Act Two's black starts (17.13).
- **17.13's plan J-cut** is "the rack's fans and LED ticks under the black (Act Three's arrival)". It's Act Three's first room (`dark`) leading 0.6 s under Act Two's end (`NEXT_CHAPTER_JCUT`), not 17.13's own room.
- **Measured:** all 7 beds built in about 30 s through `ops/heavy.sh`, with **0 missing SFX**. The one silence (the Remove click to the buzz, 25.9–31.0 s in Act Four) is unchanged.
- **The stick has no new SFX.** The v3.3 plans carry no `sounds` fields. The notes' sound items (the collar's clasp at 9.09, the TV's small speaker, the X fixes) are the stems pass's.

## 4. What didn't apply as written, and what the builder adds

1. **Restored V.O. with a take file.** The builder only knew v2 restores. A restored line with `take_file` now comes back with that take (the v3 V.O.) and is placed like a new line. Both takes match the plans' named files.
2. **A merged beat's names come with it.** v31-18.00b's `names[]` (Kram, from his plate) would have been lost in the merge, and Kram would have been labelled by his role. It now carries to v31-18.00, at its plate (0.2 s).
3. **20.01's +1.0 s goes before the reply** (`ITEM_SHIFT`): the thread's title is read, then his reply is typed. The plan's default would have put it all at the tail, with the reply appearing 0.4 s after the title.
4. **The stick's figures follow the notes** (`CHARS_SET`): in S7.02, the employee stands in Tasya's place; in S7.02b, Tasya is off the floor. The plans don't carry `chars`.
5. **S7.03's caption** still quoted "Down here.". The plan leaves it, so `CAPTION_SUB` replaces the phrase.
6. **S4.10's `RIMA TAMURI · CTO`** is timed to the spotlight's move (`ADD_AT`, 0.8 s). The plan's default was 0.2 s.
7. **A v3.2 leftover, fixed:** S4.09 carried an empty `POST: MAS: “”`. When v3.2 moved the CCTV post to v32-S5.00, a substring drop left the empty item behind. It goes. It's logged as the lock's one deviation.
8. **The TV tag:** Tasya's clip has `tag: "tv"`, the plan's value. The pixel lock reads the take row (`device: tv`). The reel's dialogue strip has no `tv` suffix, so it labels her "TASYA"; the transcript prints "TASYA (tv)".
9. **P2's post text:** "(post, preview; his thumb on send)" is a drawing note, so it becomes the post device's own `MAS (post): "…"` form (`ADD_TEXT`).
10. **The v3.2 tables keyed by beat id are reset,** because their edits are already in the v3.2 timelines. `EXACT_FRAMES` (Runway) is kept. `NO_SAFETY_NET` stays on. No trims.

## 5. Pacing: v3.2 against v3.3

| | v3.2 lock | **v3.3 lock** |
|---|---|---|
| Shots · ASL · median shot | 231 · 5.4 s · 4.0 s | **228 · 5.4 s · 4.0 s** |
| Stays · median stay | 48 · 15.4 s | **48 · 15.2 s** |
| Entry air, median (all / spoken only) | 4.5 s / 5.1 s | **3.8 s / 5.1 s** |
| Exit air, median | 3.4 s | **3.7 s** |
| Lines · J-cuts · L-cuts | 235 · 6 · 5 | **235 · 6 · 5** |
| Mas's words · share · inner voice (words) | 345 · 20.2 % · 11 (77) | **350 · 20.5 % · 13 (82)** |

The median entry air across all lines drops because the two restored V.O. lines now open talk in their stays; for spoken lines only, it's unchanged.

## 6. How to rebuild

```sh
python3 audio/reel/ep01-v33/build_timeline.py                         # the lock + manifest + lock-report.json + pacing
bash ops/heavy.sh audio/.venv-casting/bin/python audio/reel/ep01-v33/bed.py   # the beds (about 30 s)
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v33/ep01-v33.manifest.json --plan
cd .. && python3 audio/reel/ep01-v33/measure.py                       # measure.json + lock-v33-transcript.txt
# the stick reel, when disk allows: the same episode.mjs line with --jobs 2 --conc 4 instead of --plan
```

## 7. Open, for a ruling or an ear

1. **S7.02b's length** (§1): the rule's 5.71 s, or the notes' 4.8 s.
2. **12.02** keeps v3.2's 2.05 s gap before Oigneb. The plate is now 23 characters (read floor 1.4 s), so the gap could shorten by about 0.8 s. The plan kept 7.447 s, so the lock does too.
3. **For an ear:**
   - the employee's new read, and her "Mas" (ASR hears "Moss", as in every Mas take);
   - the TV cut's join;
   - the two restored V.O. lines in their new gaps (notes §8, items 1–2).
