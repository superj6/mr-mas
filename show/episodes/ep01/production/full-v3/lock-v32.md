# Ep1 v3.2: the stick lock (`v3-lock`, 2026-09-28)

> **Status: FINAL v3.2 LOCK, for the lead.** Script draft 8.1's six v3.2 beat plans ([beat-plan-v32/](beat-plan-v32/), notes [script-v32-notes.md](script-v32-notes.md)) applied on top of the v3.1 lock (`show/reel/ep01-v31/`; nothing there was rebuilt or edited). The builder keeps the v3.1 rules, including the J-cut gap closing and the Runway frames. Act Four is still "five days, told twice". **Downstream passes (pixel, shots, score, EL, mix) can start from `show/reel/ep01-v32/`.**
>
> **Nobody watched or listened to any of this.** Every number here is measured from the files. Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The lock** | `show/reel/ep01-v32/ep01-v32-{coldopen,act1,act2,act3,act4,tag}.json` |
| **The manifest** (key `ep01-v32-stick`; the studio shows `reel-ep01-v32`) | `show/reel/ep01-v32/ep01-v32.manifest.json` |
| **The stick reel** | `out/ep01/reel/ep01-v32-stick.mp4` (+ `-chapters.json`, `-measure.json`) |
| The builder | `audio/reel/ep01-v32/build_timeline.py` (the v3.1 builder, extended). It writes the lock, the manifest and `audio/reel/ep01-v32/lock-report.json`, which lists every edit per beat. |
| The beds | `audio/reel/ep01-v32/bed.py` → `audio/reel/ep01-v32/<seg>-bed.wav` + `-bed-qa.json` |
| Measurements, transcript | `audio/reel/ep01-v32/measure.py` → `audio/reel/ep01-v32/measure.json`, [lock-v32-transcript.txt](lock-v32-transcript.txt) |
| **The takes** | `audio/ep01/v32/<seg>/lines-v32.json` + `wav/`, with fastrec's `lines.json`, `qa/` and `log/` beside it. The recorder, cutter and re-stager: `audio/ep01/v32/takes.py` and `record.sh`. |

---

## 1. Runtime

| Segment | v3.1 lock | v3.2 estimate (notes §10.1) | **v3.2 lock** | vs estimate | vs v3.1 |
|---|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | 0.0 | 0.0 |
| Act One | 5:37.5 | 5:31.1 | **5:29.8** | −1.3 | −7.7 |
| Act Two | 3:21.3 | 3:13.2 | **3:13.0** | −0.1 | −8.2 |
| Act Three | 2:25.1 | 2:21.3 | **2:22.4** | +1.1 | −2.7 |
| Act Four | 8:37.8 | 8:28.8 | **8:28.5** | −0.4 | −9.3 |
| Tag | 0:41.3 | 0:41.3 | **0:41.3** | 0.0 | 0.0 |
| **Story** | **21:09.6** | **20:42.4** | **20:41.7** | **−0.7** | **−27.9** |

- **The episode runs 21:23.8:** the story, the 30 s intro, the 2 s card and the Orb outro B (10.125 s). The reel adds its 3 s title slate, for 21:26.8.
- **No trim was applied.** T1 and T2 are in the builder (`V32_TRIMS=T1,T2`), and the notes say neither is needed.
- **Two beats are held past the plan's placements for guardrails §7's read floor** (0.25 s + 0.05 s a character). Both are logged as deviations, for the lead (§4.4):
  - **12.02 at 7.45 s** (plan 7.8 s; the rules alone gave 6.0). Nole's J-cut closes the 2.3 s head that his plate was read in. The plan's 0.6 s gap before Oigneb would then hold `NOLE · EARLY FUNDER · BUILDING HIS OWN` for 0.64 s, where its floor is 2.15 s. Oigneb's entrance (her plate, then her line) now waits 2.05 s, so the plate holds 2.19 s.
  - **v31-20.07 at 5.0 s** (plan 4.0 s, +1.0). The paper's 91-character quote needs 4.8 s. With the V.O. cut, the quote is what he and we read, and the plan's 4.0 s would show it for 3.8 s. This keeps v3.1's length, so the notes' "Neleh's paper −1.0" doesn't happen.
- **9.10 is 1.1 s under its estimate** (9.99 s, est 11.1). The plan puts Gerg's new line at `start+2.6`, where the v3.1 head was 3.6 s. That shortens the head by 1.0 s on top of the shorter line (−2.0 s), and the estimate's −1.9 counts only the line. **If the lead wants the estimate,** set the new line's `after` to `start+3.6`.
- **Every other beat is within 0.4 s of its `est_s`:**
  - 15.10 −0.36 (the moved question at `start+0.4`, with the v3.1 tail);
  - S3.06 −0.24 (the J-cut);
  - 15.15 +0.17, 5.03 +0.16 and 22.01 +0.10 (the new takes' measured lengths).
- **The Runway frames are reserved:**
  - S7.13 is exactly 264 frames (Act Four frames 11021–11284).
  - 32.01 is exactly 62 frames, so the demo splices at tag frame 62.
  - v31-32.01d is exactly 233 frames.

## 2. Pacing: v3.1 against v3.2

`python3 studio/src/reel/tools/pacing.py` on the six v3.1 timelines and the six v3.2 ones (`measure.py`):

| | v3.1 lock | **v3.2 lock** |
|---|---|---|
| Shots · ASL · median shot | 227 · 5.6 s · 4.0 s | **231 · 5.4 s · 4.0 s** |
| Places (stays) · **median stay** | 45 · 19.2 s | **48 · 15.4 s** |
| Stays under 10 s / 10–30 / 30–60 / 60 s+ | 17 / 12 / 11 / 5 | **17 / 17 / 9 / 5** |
| Talk stays (8 s or more) | 31 | **30** |
| Entry air, median (all lines / spoken only) | 2.6 s / 4.3 s | **4.5 s / 5.1 s** |
| Entry air 2 s or less (all / spoken) | 13 / 10 | **13 / 11** |
| **Exit air, median** | 3.2 s | **3.4 s** |
| Exit air 1.5 s or less | 6 | **6** |
| Lines · J-cuts · L-cuts | 251 · 2 · 6 | **235 · 6 · 5** |
| Mas's words · share · inner-voice lines (words) | 443 · 23.4 % · 28 (208) | **345 · 20.2 % · 11 (77)** |

- **The inner voice is 11 lines and 77 words**, as the notes count it (§10.2).
- **Three more stays, so the median is shorter:**
  - The new beats add places:
    - Tasya's call takes him back to the bullpen after the data-centre shot (11.5 s);
    - v32-21.06 puts 2 s of the dark room before the stage;
    - his Sunday walk-in puts a lobby stay (19.3 s) inside the board's side, which cuts the `lighthouse` stay before it from 34.4 s to 18.8 s.
  - Stays of 10–30 s go from 12 to 17, and stays of 30–60 s from 11 to 9.
- **Entry air is longer.** The cut V.O. and "as you know" lines had opened scenes; now the picture opens them. Spoken lines only, the median entry air goes from 4.3 s to 5.1 s.
- **J-cuts go from 2 to 6** (§4.2).

## 3. The takes

**13 v3.2 takes** in `audio/ep01/v32/`:
- 8 read with fastrec (Kokoro-82M, the house method, `--workers 2`, through `ops/heavy.sh`);
- 3 cut from existing takes;
- 2 existing takes re-staged to a new device (the plan's `device`), without a re-read.

fastrec's QA reports **0 problems and 0 flags** in all four segments. No V.O. takes were needed: the two restored inner-voice lines (`e1-a3-18-04`, `v3-vo-24`) have theirs.

| Id | Who | Line | Take | Speed | Voiced s |
|---|---|---|---|---|---|
| v32-a1-0001 | Gerg | Okay, the build's green. | **cut** from e1-a1-5-01 (its first sentence); the J-cut stays at −0.5 s | 1.03 | 1.28 |
| v32-a1-0002 | Tasya (call) | Mas. | read | 0.86 | 0.61 |
| v32-a1-0003 | Mas | it's the bill. we're going to need more servers. | read (8.1: a full sentence replaces the reuse of e1-a1-7-02) | 0.90 | 2.79 |
| v32-a1-0004 | Tasya (call) | I'll bring a pen. | read | 0.86 | 1.17 |
| v32-a1-0005 | Gerg | Elgoog's going to hear about this from a search box. | read | 1.02 | 2.18 |
| v32-a1-0006 | Tasya | House rules, Sydney. | **cut** from v31-a1-0006 (its first sentence) | 0.86 | 1.27 |
| v32-a1-0007 | Oigneb | You signed it. Now put the iron down. | read | 0.87 | 2.52 |
| v32-a2-0001 | Mas | …i would form a new agency that licenses any effort above a certain scale of capabilities. | read | 0.88 | 6.67 |
| v32-a2-0002 | Senator | Would you come and run it? | **cut** from e1-a2-15-10 (its last sentence) | 0.85 | 1.55 |
| v32-a3-0001 | Mas (stage) | and today, you can build your own chatgtp. | read, on the stage chain | 0.915 | 2.92 |
| e1-a3-22-01 | Mas (stage) | so, how's the partnership going? | **re-staged**: monitor → stage (the take stands) | 0.915 | 1.80 |
| e1-a3-22-02 | Tasya (stage) | "We love you guys." | **re-staged**: monitor → stage (the take stands) | 0.92 | 1.73 |
| v32-a4-0001 | Neleh (call) | Step three. Rima, the staff will come to you now. | read | 0.96 | 2.67 |

- **Speaker, speed and device** come from a reference take of the same character in the same scene (`takes.py READ`), so the call and stage chains match.
- **Cuts** are made at sentence boundaries, at the middle of the pause, with 12 ms fades and room-tone handles out to the house's 0.35 s.
- **The re-stage** runs the clean take through the house `pa` chain (a hall's reverb) and normalises it to −16 LUFS, as `<id>.stage.wav`. The timeline plays that file, with no `monitor` tag.
- **The notes' count** is "7 new reads, 4 cuts". The plans' `take` fields give **8 new reads and 3 cuts**, because 8.1 made v32-a1-0003 a read, not a reuse. Either way it's 11 lines, and **ElevenLabs needs all 11** (notes §10.6).
- **Tasya's "Mas."** is one word at 1.64 syll/s. That's expected for a one-word call greeting, but it's **for an ear**.

## 4. How the plans were applied

The v3 and v3.1 rules still hold ([lock.md §4](lock.md), [lock-v31.md §4](lock-v31.md)). The v3.1 tables keyed by beat id are reset, because their edits are already in the v3.1 timelines. The v3.2 builder adds these rules; its docstring has them all, and `lock-report.json` has every edit per beat.

1. **One placement queue.** Retimed kept lines (the plans' new `at` on a kept line), moved, new and restored lines, and the V.O. all go into one queue:
   - items placed at `start±S` go first, in time order;
   - then each `after:<id>+S` item, once its anchor is placed.

   An `after:X+S` retime of a line that already follows X only resets the gap.
2. **The four new J-cuts** use the lead's gap-closing rule. The line starts at −lead, the lines after it keep their read gaps, and the beat shortens by the old head plus the lead:

   | Beat | Line | Lead | Old head | Beat shortens |
   |---|---|---|---|---|
   | 12.02 | Nole's "Great sign." | 0.5 s | 2.3 s | 2.8 s |
   | S3.06 | "Is this a coup?" | 0.6 s | 1.0 s | 1.6 s |
   | S5.11 | Tasya's "Don't get up, Mas." | 0.8 s | 1.9 s | 2.7 s |
   | S8.08 | the memo's first words | 1.0 s | 1.6 s | 2.6 s |

   5.03's new "Okay, the build's green." keeps v3.1's −0.5 s J-cut, and 7.01's Rima keeps hers (−0.6 s). That makes **6 J-cut lines**.
3. **Picture business the plan adds, with no timing given, keeps the plan's `est_s`** (`EST_HOLD`), with the extra time at the tail:
   - **S5.11 +3.18 s:** the MACROSOFT badge slides under the door after "Due on the first.", and he picks it up. The stick has its three sounds at 12.4, 13.3 and 14.9 s: the slide, the tick on the chair leg, the set-down.
   - **v31-18.00b +0.29 s:** the thirteenth key, hung large, in the picture time of the dropped V.O. "thirteen.".

   Everywhere else, the plans' explicit timings govern (`at`, `after`, `gap_s`, J-cuts) unless they would break a read floor (item 4). `est_s` is a check (§1).
4. **Guardrails §7's read floor over a plan's placement.** The floor is 0.25 s + 0.05 s a character, and a name card holds at least 1.2 s. A check of every on-screen item against the v3.1 lock found four new shortfalls, and the lock fixes all four:
   - **12.02 (`PLAN_PATCH`, `ONSCREEN_ANCHOR`):**
     - Oigneb's line waits 2.05 s after Nole's, not the plan's 0.6 s.
     - Her plate hands over on her line as in v3.1: Nole's plate goes out 0.2 s before it, and OIGNEB comes up 0.3 s before it.
     - NOLE's plate holds 2.19 s. The beat is 7.45 s.
   - **v31-20.07 (`PLAN_PATCH`):** the paper's quote gets its 4.8 s, so the beat is 5.0 s.
   - **S8.08 (`ONSCREEN_HOLD`):** the rail `NOV 29, 2023` had been anchored to the memo line, which the J-cut moved. It keeps its v3.1 read time, 0.2–1.5 s.
   - **S3.02 (`ONSCREEN_AT`):**
     - The problem: at the plan's 1.6 s, the list's blank step 4 was up for 0.05 s, yet the caption has the pen stop on it.
     - The fix: the four reveals are re-spaced inside the 1.6 s (0.2, 0.55, 0.8, 1.05), so the blank holds 0.55 s. It's still under its formula floor.
     - The whole list returns, ticked, in S4.14.

   The other items under their floor are unchanged from v3.1 (the shots passes log them).
5. **The strip names a J-cut line's speaker from the line's start** when the beat it leads into plates them. For example, 12.02's "Great sign." reads NOLE, not the cast's role "MAN IN THE POST": since v3.1's O1, there's no post.
6. **Re-staged takes:** 22.01's two monitor takes play their stage files (§3).
7. **Plates:** draft 8.1's first-appearance plates with one relation word stand. Examples:
   - NOLE · EARLY FUNDER · BUILDING HIS OWN
   - GERG MOCKBRAN · CO-FOUNDER
   - ADELINA · CO-FOUNDER
   - RIMA TAMURI · INTERIM CEO
   - KRAM · RUNS ATEM

   The v3 lock's plate safety net, which cut plates down to names, is off (`NO_SAFETY_NET`).
8. **On-screen text:**
   - Replace and drop keys match without their bracketed notes (`DEC 5, 2022 (rail)`).
   - S3.03 carries the board's statement in full.
   - S4.09's CCTV post moves to the new v32-S5.00, where he posts it.
   - Two drawing notes add no stick text: the phone's contact avatar, and the sign-up counter's blur.
   - 22.01's two drops are picture notes (the home two-shot, the rafters egg).
9. **New beats:**
   - v32-7.03, Tasya's call (TASYA · MACROSOFT names her);
   - v32-9.10k, the key ring large, with the rail FEB 7, 2023;
   - v32-22.04, the sign-up pause (sequence 22A);
   - v32-S1.13, his post from the suite;
   - v32-S5.00, his Sunday walk-in with the GUEST badge (sequence S4L).

   Each takes its plan's frame, room and sounds.
10. **Sounds:** the plans' `sounds` notes become stick SFX (`NEW_SOUNDS`), as placeholders for the sound pass:
   - the call's ring and hang-up;
   - the key ring's jangles;
   - the sign-ups' ratchet, post and blink;
   - the suite post's taps;
   - the lobby's rustle, shutter and post;
   - the badge.
11. **Names, subtitles, chapters and intro:** as in v3.1. Act Four's part and the manifest read "five days, told twice". The intro is `out/season/intro/intro-ep1-V1-1080p-flashfix.mp4` with its own audio at −3 dB. The outro is `out/ep01/outro/outro-b-v3.mp4` with its own audio at −1 dB.

## 5. The stick sound (temporary)

This uses the v3.1 method (lock-v31.md §5): the mixer lays all 235 takes at −3 dB, with one bed per chapter ducked −10 dB. What's new in v3.2:
- **A pad run is a run of one mood, not of one music string.** So v32-7.03's "THE HEAT" continues THE BILL's pad, and v32-9.10k's "LOBBY" continues the caper's.
- **The caper's pad** stops on the collar pop (9.08) and comes back on v32-9.10k's jangle, as the plan says ("the caper's new phrase comes in on the jangle").
- **"none" moods are room only:** v32-S1.13 and v32-S5.00. The felt note on his look up is left to the score pass.
- **An L-cut with no `over_s`** trails 1 s (21.05 and v32-21.06, the clapping; v32-S5.00, the CCTV hum).
- **Unchanged:** the one silence (the Remove click to the phone's buzz), the tag's pad dropping out for the Elgoog demo, and the cold open's approximated bed.
- **Measured:** all 7 beds built in 27 s through `ops/heavy.sh`, with **0 missing SFX**.

## 6. The reel

`out/ep01/reel/ep01-v32-stick.mp4`: 1280×720, 24 fps, H.264 + AAC, **21:26.8** (the 3 s slate + the 21:23.8 episode), 107.2 MB. Rendered with `node src/reel/tools/episode.mjs <manifest> --jobs 2 --conc 4` through `ops/heavy.sh`: 21 segments in 406 s of wall, one heavy job at a time.

| Chapter | Starts | Length | Mix, LUFS | Peak, dBFS |
|---|---|---|---|---|
| title slate | 0:00.0 | 3.0 | (silence) | |
| cold open | 0:03.0 | 26.7 | −18.2 | −6.5 |
| intro (flash-fixed) | 0:29.7 | 30.0 | −16.9 | −4.3 |
| card | 0:59.7 | 2.0 | −37.9 | −26.6 |
| Act One | 1:01.7 | 5:29.8 | −16.7 | −4.5 |
| Act Two | 6:31.4 | 3:13.0 | −16.3 | −4.7 |
| Act Three | 9:44.5 | 2:22.4 | −17.0 | −5.2 |
| Act Four ("five days, told twice") | 12:06.9 | 8:28.5 | −16.4 | −4.5 |
| tag | 20:35.3 | 0:41.3 | −22.3 | −5.7 |
| outro B | 21:16.7 | 0:10.1 | −17.0 | −4.2 |

- **Checked:**
  - 30,883 video frames, the plan's count;
  - video and audio both 1286.792 s;
  - all 235 takes and 7 beds placed, 0 missing files;
  - −16.6 LUFS with a −4.2 dBFS sample peak, and the limiter never engaged;
  - the only digital silence is the title slate.
- **Looked at** (stills, not the film):
  - 12.02: Nole's plate is up with the strip naming him;
  - S3.02: the list stops on the blank;
  - v31-20.07: the paper's quote;
  - S5.11: the badge tail. The stick draws no badge; the kit is the pixel pass's.
- **The transcript** is [lock-v32-transcript.txt](lock-v32-transcript.txt).
- **Not watched or heard:** the cuts, the takes, the beds, the pads.

## 7. How to rebuild

```sh
python3 audio/ep01/v32/takes.py plan                                  # lines-in.json per segment
bash ops/heavy.sh bash audio/ep01/v32/record.sh [seg ...]             # fastrec --workers 2 (resumes; FORCE="id ..." re-reads)
audio/.venv-casting/bin/python audio/ep01/v32/takes.py cut            # the 3 cut takes
audio/.venv-casting/bin/python audio/ep01/v32/takes.py restage        # 22.01's 2 takes through the stage chain
python3 audio/ep01/v32/takes.py assemble                              # <seg>/lines-v32.json
python3 audio/reel/ep01-v32/build_timeline.py                         # the lock + manifest + lock-report.json + pacing
                                                                      #   (no trims by default; V32_TRIMS=T1,T2 for the notes' §1.2)
bash ops/heavy.sh audio/.venv-casting/bin/python audio/reel/ep01-v32/bed.py   # the beds (about 30 s)
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v32/ep01-v32.manifest.json --jobs 2 --conc 4
cd .. && python3 audio/reel/ep01-v32/measure.py                       # measure.json + lock-v32-transcript.txt
```

- **The v3.1 timelines are this lock's source.** They were read and never edited.
- **Each timeline's `_source.takes_files`** lists its takes files, for `lock.py --takes`.

## 8. Open, for a ruling or an ear

1. **For the lead:**
   - the two read-floor holds, 12.02 (+1.45 s) and v31-20.07 (+1.0 s). Each is one `PLAN_PATCH` entry to revert (§1, §4.4);
   - 9.10's head: the plan's `start+2.6`, where `start+3.6` would give the estimate;
   - S3.02's list is still under its formula floor at the plan's 1.6 s.
2. **For an ear:**
   - the three cut joins: 5.03's "Okay, the build's green.", Tasya's "House rules, Sydney." and the senator's "Would you come and run it?";
   - 22.01's two re-staged takes beside the new stage read;
   - Tasya's one-word "Mas.".
3. **S5.11's badge:** the notes' §8 item 2 (for the guardrails owner) is still open. If the guardrails owner falls back, the badge stays on the floor, and the 3.18 s tail can go (remove `S5.11` from `EST_HOLD`).
4. **Unchanged from v3.1:**
   - S7.13's line (kept at no cost);
   - the elgoog-demo voice, to be folded into the registry;
   - the cold open's bed, which the score and sound passes should rebuild for the 640-frame cut.
