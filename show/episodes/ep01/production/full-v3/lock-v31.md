# Ep1 v3.1: the stick lock (`v3-lock`, 2026-09-27)

> **Status: FINAL v3.1 LOCK, for the lead.** Script draft 7's six v3.1 beat plans ([beat-plan-v31/](beat-plan-v31/), notes [script-v31-notes.md](script-v31-notes.md)) applied on top of the v3 lock (`show/reel/ep01-v3/`, as committed; nothing there was rebuilt or edited), with the lead's rulings: the launch-night board question and "gerg comes back too." kept; Act Four is "five days, told twice"; the Runway inserts' frame lengths (runway.md §6 and §11.5). **Downstream passes (art, shots, score, EL, mix) can start from `show/reel/ep01-v31/`.**
>
> **Nothing here was watched or heard.** Every number is measured from the files. Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The lock** | `show/reel/ep01-v31/ep01-v31-{coldopen,act1,act2,act3,act4,tag}.json` |
| **The manifest** (key `ep01-v31-stick`; the studio shows `reel-ep01-v31`) | `show/reel/ep01-v31/ep01-v31.manifest.json` |
| **The stick reel** | `out/ep01/reel/ep01-v31-stick.mp4` (+ `-chapters.json`, `-measure.json`) |
| The builder | `audio/reel/ep01-v31/build_timeline.py` (the v3 builder, extended) → the lock, the manifest, `audio/reel/ep01-v31/lock-report.json` (every edit and deviation, per beat) |
| The beds | `audio/reel/ep01-v31/bed.py` → `audio/reel/ep01-v31/<seg>-bed.wav` + `-bed-qa.json` |
| Measurements, transcript | `audio/reel/ep01-v31/measure.py` → `audio/reel/ep01-v31/measure.json`, [lock-v31-transcript.txt](lock-v31-transcript.txt) |
| **The takes** | `audio/ep01/v31/<seg>/lines-v31.json` + `wav/` (fastrec's `lines.json`, `qa/`, `log/` beside it); the recorder and cutter `audio/ep01/v31/takes.py`, `record.sh`; the demo voice's cast overlay `audio/ep01/v31/cast-v31.json` |

---

## 1. Runtime

| Segment | v3 lock | v3.1 estimate (notes §1.1) | **v3.1 lock** | vs estimate | vs v3 |
|---|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | 0.0 | 0.0 |
| Act One | 5:22.5 | 5:38.0 | **5:37.5** | −0.6 | +15.0 |
| Act Two | 3:24.7 | 3:19.6 | **3:21.3** | +1.6 | −3.5 |
| Act Three | 2:08.0 | 2:20.8 | **2:25.1** | +4.3 | +17.1 |
| Act Four | 8:43.8 | 8:32.3 | **8:37.8** | +5.5 | −6.0 |
| Tag | 0:33.9 | 0:40.7 | **0:41.3** | +0.6 | +7.5 |
| **Story** | **20:39.6** | **20:58.1** | **21:09.6** | **+11.5** | **+30.0** |

- **The first build ran 21:13.4, over the lead's "about 21:10", so the notes' first-ranked trim applies: O1**, 6.04 (Nole's Dec 3 post, whole, −3.8 s). Nole's first appearance is now 12.02. O2–O5 are unused.
- **The episode is 21:51.7:** the story, the 30 s intro, the 2 s card and the Orb outro (10.125 s). The reel adds its 3 s title slate (21:54.7).
- **Where it runs over the estimate:**
  - **S7.13 +5.0 s against the plan:** the Runway hourglass insert fixes the beat at 264 frames (11.0 s), and its line stays (§4.2).
  - **v31-19.03 +2.8 s:** the hands runner's two restored takes and the V.O. measure longer than the plan's 9.6 s.
  - **The tag's demo beat +1.1 s** (233 frames) against 32.01 −0.6 s (62 frames).
  - **S1.01 keeps the plan's 6.2 s** now that its only line (v3-vo-17) is dropped (§4.9).
  - The new and restored lines' measured lengths: 5.07 +0.7, v31-10.02 +0.7, v31-10.03 +1.1, S3.04 +1.1, S7.07-cont +1.1.
  - **Under:** S4.08 −1.0, S5.09 −0.9, S5.09b −0.4.

## 2. Pacing: v3 against v3.1

`python3 studio/src/reel/tools/pacing.py` on the six v3 timelines and the six v3.1 ones:

| | v3 lock | **v3.1 lock** |
|---|---|---|
| Shots · ASL · median shot | 226 · 5.5 s · 4.0 s | **227 · 5.6 s · 4.0 s** |
| Places (stays) · **median stay** | 50 · 12.3 s | **45 · 19.2 s** |
| Stays under 10 s / 10–30 / 30–60 / 60 s+ | 23 / 10 / 12 / 5 | **17 / 12 / 11 / 5** |
| Talk stays (8 s or more) | 31 | **31** |
| Entry air, median (all lines / spoken only) | 3.7 s / 5.3 s | **2.6 s / 4.3 s** |
| Entry air 2 s or less (all / spoken) | 11 / 7 | **13 / 10** |
| **Exit air, median** | 2.8 s | **3.2 s** |
| Exit air 1.5 s or less | 10 | **6** |
| Lines · J-cuts · L-cuts | 228 · 2 · 6 | **251 · 2 · 6** |
| Mas's words · share · inner-voice lines (words) | 396 · 22 % · 24 (185) | **443 · 23.4 % · 28 (208)** |

- **Fewer, longer stays:** the median stay goes from 12.3 s to 19.2 s, and the stays under 10 s drop from 23 to 17. The lighthouse and the TPOOL flash are gone, Sydney's scene lives in the lobby, and the hands runner plays in the dark room.
- **The aftermaths grow:** exit air median 2.8 → 3.2 s; only 6 stays now cut out within 1.5 s of the last word.
- **Entry air is shorter on paper, by design:**
  - The plan puts Mas's voice or the scene's first line early in several openings: 11.01's Atem line at 1.2 s on the match cut, 13.01's V.O. at 1.0 s, 22.02's at 1.3 s.
  - S3.00a's arrival is now 0.3 s, because the new v31-S3.00p (Neleh's desk at 11:52) is the board side's arrival. THE PLAN between them is GFX (`void`), which the tool counts as a break.
  - Counting spoken lines only, the median entry air is 4.3 s.

## 3. The takes

**38 v3.1 takes** in `audio/ep01/v31/`: 29 read with fastrec (the 7 new V.O. lines and 22 spoken lines; `--workers 2`, through `ops/heavy.sh`), 8 cut from existing takes, 1 reused. **0 file problems.** The 8 restored v2 lines keep their v2 takes, including the three Mas takes (e1-a1-10-01, 10-03, 11-05): they're the same voice preset as the v3 Mas speech (`a-michael-close`, 0.86–0.92).

| Id | Who | Line | Take | Speed | Voiced s | syll/s | Flags left |
|---|---|---|---|---|---|---|---|
| v31-a1-0001 | Rima (O.S.) | Did anyone tell the rest of the board? | read (re-read at 0.86 after 5.52 syll/s) | 0.86 | 1.95 | 5.13 | — |
| v31-a1-0002 | Gerg | It's a research preview. | read | 1.06 | 1.12 | 5.36 | — |
| v31-a1-0003 | Rima (O.S.) | A million people, Mas. Is that a tear? | read | 0.86 | 2.76 | 4.27 | — |
| v31-a1-0004 | Radnus | Search is fine. Totally fine. It's just a chat thing. | **read, not cut** (the cut would end on the take's comma) | 1.03 | 3.40 | 4.11 | — |
| v31-a1-0005 | Tasya | Oh, we don't think of it as rent… the floors warm. | read as three whole reads (5.09 syll/s as one) | 0.85 | 7.45 | 4.27 | — |
| v31-a1-0006 | Tasya | House rules, Sydney. Five questions, then a fresh start. | read | 0.86 | 3.46 | 3.63 | — |
| v31-a1-0007 | Sydney | Hi! | **cut** from e1-a1-10-06: the reset is the same "Hi!" | 0.84 | 0.33 | — | — |
| v31-a2-0001 | Nedib | Whatever you promise in here today, put it in writing. | **cut** from e1-a2-13-15 | 0.93 | 3.07 | — | — |
| v31-a2-0002 | Nedib | Longer. | **cut** from e1-a2-13-15 | 0.93 | 0.80 | — | — |
| v31-a2-0003 | Lahtnemulb | That voice was not mine. The words were not mine. | read | 0.88 | 3.37 | 3.45 | — |
| v31-a3-0001 | Tasya (monitor) | Everyone is welcome. | **cut** from e1-a1-9-08: the same words, the same read | 0.86 | 1.51 | — | — |
| v31-a3-0002 | Gerg (call) | Okay. That's patched. | **cut** from e1-a3-20-05 | 1.06 | 1.35 | — | — |
| v31-a4-0001 | Alyi (call) | Mas. The board has decided… lead the company. | **cut** from a5-27-01: told twice, verbatim, the same take | 0.87 | 4.38 | — | — |
| v31-a4-0002 | Neleh | Once more, before the others join. | read | 0.96 | 1.72 | 4.65 | — |
| v31-a4-0003 | Rima (O.S.) | We'll say we will. | read | 0.94 | 0.93 | 4.30 | — |
| v31-a4-0004 | Neleh | The staff want him back. The investors want him back. | read | 0.94 | 3.09 | 4.49 | — |
| v31-a4-0005 | Neleh | We've talked all day about him coming back, and we're no closer. | **cut** from a5-27-35 | 0.94 | 3.35 | — | — |
| v31-a4-0006 | Neleh (O.S.) | Step four, Mada? | read | 0.94 | 1.07 | 3.74 | — |
| v31-a4-0007 | Gerg | Best time there is. Nobody else is pushing anything. | **cut** from a5-29-05 | 1.06 | 2.98 | — | — |
| v31-a4-0008 | Mas | read me the letter. | read | 0.90 | 1.16 | 4.31 | — |
| v31-a4-0009 | Gerg | Okay. Pull it up. | read (a split read's "up" was heard as "out"; back to one read) | 1.06 | 1.20 | 5.62 | a 0.3 s pause opened at a −25 dB dip: for an ear |
| v31-a4-0010 | Gerg (monitor) | That's the share sale. Everybody was about to get paid. | read | 1.06 | 2.65 | 5.96 | — |
| v31-a4-0011 | Mas | keep building. | read | 0.90 | 0.97 | 3.09 | — |
| v31-a4-0012 | Mas | and the rent? | **reuse** e1-a1-9-05, deliberately Act One's take | 0.90 | 0.94 | — | — |
| v31-a4-0013 | Tasya (O.S.) | Due on the first. | read | 0.92 | 1.10 | 3.64 | ASR "Do on…" (a homophone) |
| v31-a4-0014 | Tasya (O.S.) | Down here. | read | 0.92 | 0.79 | 2.53 | — |
| v31-a4-0015 | Mas | gerg comes back too. | read | 0.90 | 1.36 | 2.94 | slow (a four-syllable line) |
| v31-a4-0016 | Terb | Gerg comes back too. | read (1.06 after 2.58 at 1.02: no change) | 1.06 | 1.54 | 2.60 | slow for brisk Terb: **for an ear** |
| v31-a4-0017 | Neleh | Mario, it's Neleh… and to discuss a merger. | read | 0.96 | 6.56 | 5.05 | — |
| v31-tg-0001 | ELGOOG'S DEMO | What the quack! | read, **a new stock voice** (below) | 1.04 | 1.02 | 2.94 | slow (an exclamation) |
| v31-tg-0002 | Mas | that was close. | read | 0.90 | 1.06 | 2.83 | slow (a short line) |
| v31-vo-01 | Mas V.O. | four companies, one table. radnus has been mouthing… | read | 0.87 | 6.54 | 3.63 | — |
| v31-vo-02 | Mas V.O. | her mouth is a beat late. the voice isn't hers. | read | 0.87 | 3.41 | 3.73 | — |
| v31-vo-03 | Mas V.O. | thirteen. | read | 0.88 | 0.93 | 2.15 | ASR "13" (a number) |
| v31-vo-04 | Mas V.O. | my other company. it tells people from machines. | read (0.85 after 4.35) | 0.85 | 3.46 | 4.23 | — |
| v31-vo-05 | Mas V.O. | i've had mine up since may. | read | 0.87 | 1.62 | 3.70 | — |
| v31-vo-06 | Mas V.O. | neleh's on our board. she quoted us. | read (0.85 after 4.50) | 0.85 | 2.73 | 4.39 | — |
| v31-vo-07 | Mas V.O. | those are stills. | read | 0.88 | 1.16 | 2.59 | slow ("flat, almost admiring") |

- **Speaker, speed and device** come from a reference take of the same character in the same scene (`takes.py READ`), so the call and monitor chains match.
- **Cuts** are made at sentence boundaries, at the middle of the pause, with 12 ms fades and room-tone handles out to the house's 0.35 s. The same performance matters in four of them: Alyi's sentence heard once per side, Sydney's reset "Hi!", the landlord's "Everyone is welcome." on the monitor, and Nedib's two halves.
- **ELGOOG'S DEMO** is a new stock voice, not a cast voice: `bf_isabella` (no cast member uses a `b`-voice), bright and dry, speed 1.04, and "quack" given its IPA after speech recognition heard "quackie". It lives in `audio/ep01/v31/cast-v31.json`: the registry plus this one voice, passed as `fastrec --cast`. **The registry owner can fold it into `audio/voices/cast.json`.**

## 4. How the plans were applied, and every deviation

The v3 rules stand ([lock.md §4](lock.md)), including the J-cut gap closing. The v3.1 builder adds these (its docstring has them all; `lock-report.json` has every edit per beat):

1. **O1 applied** (§1).
2. **S7.13 is 264 frames, and "Chat, we're so back." stays.**
   - The lead's note, from runway.md §11.5: the first 128 frames stay as drawn, the insert replaces k128–263, and the extra 69 frames go at the tail, after its last line.
   - The plan dropped the line as a runtime trim (R7). The insert makes the beat's length fixed anyway, and it was built around that line: the chat turns "we're so back" on it, at k134–166.
   - So the line costs nothing and stays: a5-30-18 at 5.60 s (k134), the shatter at k173. **The lead can drop it:** the beat keeps its 264 frames either way.
3. **The tag's Runway demo:** 32.01 is exactly 62 frames, so the insert splices at tag frame 62. v31-32.01d is exactly 233 frames. "What the quack!" lands at i110, on the smooth turn; "those are stills." at i168, in the stillness window (runway.md §6, §7).
4. **Placement:**
   - `start±S` is an absolute time: a line after an earlier line goes in after it.
   - A new line at a negative start replaces a dropped first line as a J-cut, and the line after it keeps its read gap (7.01: Rima from −0.6 s, "it's the bill." 0.8 s after her).
   - A moved line (S1.02 ← S1.06's V.O., S5.09b ← S5.09-back's) is placed by its `at`. A merged beat's other sounds come with it: S1.06's JOIN click stays at S1.02's end.
5. **Length changes with no audio change:**
   - Growth goes at the tail, except 22.01 ("open for 1 s on the two-shot"), which grows at its head.
   - Trims shave air: the largest stretch first, and each stretch is compressed rather than cut, so what sits in it keeps its order.
   - The plan's own targets come first (TRIM_HINTS): S3.00a's arrival to 0.3 s with the wondering beat kept at 1.0 s; 13.06's line at 0.6 s; S3.05 and S4.13 starting 0.5 s and 1 s sooner; S3.03's hold after "Any objections?"; 9.13 ending on its line.
   - No-line beats scale, except 18.01, which cuts at its head (the arrival moved to v31-18.00), and 32.01, which cuts at its tail (the splice).
6. **Lines dropped with nothing in their place keep the plan's picture time** where it's longer: 21.04 (4.4 s, where the Orb answers "which one's real?") and S5.09-back (5.4 s, where his keys stop).
7. **THE PLAN's three moved beats take the room they now play in** (Neleh's office, not Vegas's suite).
8. **Captions** that quoted a changed line now carry the new words: S3.04b "We'll say we will.", S4.14 "Step four, Mada?", S7.03 "Down here."
9. **S1.01 keeps the plan's 6.2 s:** its only line was the dropped V.O., and without the rule it would have shrunk to 2.4 s.
10. **Sounds:**
    - S1.09's Cancel click is taken out; the Remove dialog (v31-S1.08d) has the click, and the one silence now starts there.
    - The plans' `sounds` notes become stick SFX (`NEW_SOUNDS`): the bubble's pop and the revolving door, the egg timer's tick and ding, EMIT's THUD and the pen, the Remove click, the Orb's servos over the runner, the pinned extinguisher's dry click, the invite's tap.
11. **Names:** a plate the plan adds names its character from that frame (SYDNEY, KRAM). ELGOOG'S DEMO joins the tag's cast.
12. **Sequence markers** go on the new scenes: sc 10 (Sydney), 20A (Neleh's paper) and S3 (Neleh's desk at 11:52). 18.01's marker moves to v31-18.00.
13. **Subtitles:** spoken lines lose their quotation marks, and print ellipses at their ends (the plans' `_about`). The letter's page reads "judgement" (`line_text_fix`); the take stands.
14. **The chapter names:** Act Four's timeline part and the manifest read "five days, told twice".
15. **The intro** is the flash-fixed picture, `out/season/intro/intro-ep1-V1-1080p-flashfix.mp4`, with its own audio as before (−3 dB).

## 5. The stick sound (temporary)

The same method as the v3 lock (lock.md §5): the mixer lays all 251 takes (−3 dB), one bed per chapter, ducked −10 dB.
- **Rooms** lead each cut; the v3 plans' J-/L-cut sounds apply wherever the v3.1 plan doesn't set its own.
- **SFX** are the beats' sounds; all resolved.
- **Pads** follow the v3.1 music strings:
  - Sydney rides the lobby's caper colour.
  - The pause letter stops on the THUD.
  - The board's side opens on a waltz stand-in at 11:52.
  - The tag's pad drops out for the demo film and stops on the thud.
- **The one silence** runs from the Remove click to the phone's buzz.
- **The cold open** is now the 640-frame cut, so no v2 or v3 stem lines up with it. The bed keeps the v2 stem through the end of its rewind (24.7 s), then plays the rewind again at double speed for the new 1.5 s, into the intro's hard cut.

## 6. The reel

`out/ep01/reel/ep01-v31-stick.mp4`: 1280×720, 24 fps, H.264 + AAC, **21:54.7** (the 3 s slate + the 21:51.7 episode), 108.5 MB. Rendered with `node src/reel/tools/episode.mjs <manifest> --jobs 2 --conc 4` through `ops/heavy.sh`: 21 segments in 431.9 s of wall.

| Chapter | Starts | Length | Mix, LUFS | Peak, dBFS |
|---|---|---|---|---|
| title slate | 0:00.0 | 3.0 | (silence) | |
| cold open | 0:03.0 | 26.7 | −18.2 | −6.5 |
| intro (flash-fixed) | 0:29.7 | 30.0 | −16.9 | −4.3 |
| card | 0:59.7 | 2.0 | −37.9 | −26.6 |
| Act One | 1:01.7 | 5:37.5 | −16.7 | −4.4 |
| Act Two | 6:39.1 | 3:21.3 | −16.4 | −4.5 |
| Act Three | 10:00.4 | 2:25.1 | −17.2 | −5.1 |
| Act Four | 12:25.5 | 8:37.8 | −16.3 | −4.4 |
| tag | 21:03.3 | 0:41.3 | −21.7 | −5.5 |
| outro | 21:44.6 | 0:10.1 | −17.0 | −4.2 |

- **Checked:**
  - 31,553 video frames, the plan's count;
  - video and audio both 1314.708 s;
  - all 251 takes and 7 beds placed, 0 missing files;
  - −16.6 LUFS with a −4.2 dBFS sample peak, and the limiter never engaged;
  - the only digital silence is the title slate.
- **The Runway frames:**
  - S7.13 is 264 frames (it ends at 11.0 s);
  - 32.01 is 62 frames, so the demo starts on tag frame 62;
  - the demo beat is 233 frames.
- **Looked at** (stills, not the film): v31-10.02 (SYDNEY named in the strip and on her figure; sc 10's slate) and v31-32.01d (the demo beat's text and lines). The Remove dialog's timing was checked in the timeline.
- **The transcript** is [lock-v31-transcript.txt](lock-v31-transcript.txt).
- **Not watched or heard:** the cuts, the takes, the beds, the pads.

## 7. How to rebuild

```sh
python3 audio/ep01/v31/takes.py plan                                  # lines-in.json per segment + cast-v31.json
bash ops/heavy.sh bash audio/ep01/v31/record.sh [seg ...]             # fastrec --workers 2 (resumes; FORCE="id ..." re-reads)
audio/.venv-casting/bin/python audio/ep01/v31/takes.py cut            # the 8 cut takes
python3 audio/ep01/v31/takes.py assemble                              # <seg>/lines-v31.json
python3 audio/reel/ep01-v31/build_timeline.py                         # the lock + manifest + lock-report.json + pacing
                                                                      #   (O1 by default; V31_TRIMS= for none, or O1,O3,…)
audio/.venv-casting/bin/python audio/reel/ep01-v31/bed.py             # the beds (about 1 min)
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v31/ep01-v31.manifest.json --jobs 2 --conc 4
cd .. && python3 audio/reel/ep01-v31/measure.py                       # measure.json + lock-v31-transcript.txt
```

- **The v3 timelines are this lock's source:** rebuild them only with their own history in mind. The cold open's 640-frame cut and the Act Two rail fix were edited in after the v3 build.
- **Each timeline's `_source.takes_files`** lists its takes files, for `lock.py --takes`.

## 8. Open, for a ruling or an ear

1. **S7.13's line** (§4.2): kept, at no cost. Drop it if R7 was a taste call, not only runtime.
2. **For an ear:**
   - Terb's "Gerg comes back too." (slow at any speed);
   - Gerg's "Okay. Pull it up." (a pause opened at a dip);
   - the cut takes' joins;
   - the restored v2 Mas takes beside the v3 ones;
   - the demo voice;
   - "ATEM" as the v2 take says it (the naming owner's call, notes §6.3).
3. **The registry owner:** fold `elgoog-demo` into `audio/voices/cast.json`.
4. **The cold open's bed** is an approximation. The v3 sound pass's stems predate the 640-frame cut, so the score and sound passes should rebuild them for it.
