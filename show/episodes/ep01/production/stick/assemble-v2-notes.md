# Ep1 stick reel v2: the full-episode assembly (`ep01-full-v2`)

| | |
|---|---|
| **What this is** | The start page for the whole-episode Ep1 stick reel, v2. It covers the manifest that strings the chapters together, the render, what was measured on the encoded file, and what a person still has to judge. Each chapter's own handoff sits beside this file: [coldopen](coldopen-notes.md), [act1](act1-notes.md), [act2](act2-notes.md), [act3](act3-notes.md), [tag](tag-notes.md). Act Four's is [edit-plan-v5](../act4/edit-plan-v5.md). |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1", and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". It's fully programmatic: stock Kokoro voices, no external APIs, `.env` untouched. **The lead's call on length:** build the full episode at its current length, let the showrunner watch it and mark where it drags, then cut. So nothing here is cut. §6 lists candidates only. |
| **Who, when** | The `ep1s-assemble` pass, 2026-09-27, 01:45 → 02:40. The render ran 02:05 → 02:19. |
| **State** | Rendered and measured. **Nobody has watched or listened to it.** Nothing was committed (the lead commits). `script.md` was not edited. |
| **Superseded (2026-09-27, `ep1s-close`)** | This file describes and measures the **first** v2 cut (22:20.5), the one the newcomer, insider and flow-audit reads watched. After the five fix passes, the same output path was re-rendered (22:51.4) from an updated manifest (Act One and Act Two stems, two seam cross-fades, the card at 4 s). Its runtimes, measurements and review guide are in [ep01-stick-v2-for-review.md](ep01-stick-v2-for-review.md); the first cut's files are kept in that pass's scratch `before/`. The method and commands below still apply. |
| **Honesty** | I can't watch or listen. Every number here comes from a tool. Anything about how a frame reads comes from stills: a 90-frame contact sheet, 27 seam frames and 4 full-size frames. |

---

## 0. The short version

- **The episode reel is `out/ep01/reel/ep01-full-v2.mp4`**: 1280×720, 24 fps, H.264 plus AAC, 111.6 MB.
- **Runtime: 22:20.5** (32,172 frames). That's 21:33.5 of story (cold open through tag), plus the 3 s reel slate, the 30 s intro, the 2 s card and the 12 s outro placeholder (§4.1).
- **It decodes cleanly:** 32,172 of 32,172 planned frames, 0 decode errors. Video and audio are both 1,340.5 s.
- **Dialogue:** 222 voiced lines and 1,734 words, plus the intro's one VO line. Median words per line: cold open 10, Act One 5, Act Two 6, Act Three 6, Act Four 5, tag 1.
  - Longest conversations: Act One 43.3 s, Act Two 40.5 s, Act Three 15.2 s under the strict rule (25.9 s counting Gerg's call across its edit insert), Act Four 61.0 s (§4.2).
- **Loudness:**
  - The whole file is −17.74 LUFS with a −4.14 dBFS sample peak (pyloudnorm on the decoded AAC). The mixer's own meter said −17.67 / −4.3.
  - The chapters sit between −17.1 and −19.2 LUFS. The exceptions are the tag and outro (−26.3 / −26.2) and the 2 s card (−41.4).
  - Digital silence: only the 3 s slate.
- **Holes under −42 dBFS of 0.3 s or more:** 86 runs, 60.8 s in all. Every one is explained in §4.3. Only four go below −52 dBFS:
  - the slate (by design);
  - Act Four's designed "Silence." (inside its approved premix);
  - the last 0.4 s of the intro master;
  - 1 s at the Act Four → tag cut.
  - Most of the rest are pauses between lines in the room-tone-only scenes, where the mixer's −10 dB duck drops the room to about −48 to −51 dBFS.
- **Level jumps (§4.4).** The biggest is **intro → card → Act One**: the loud intro (−15.8 LUFS short-term) drops to room tone (−41.5) for **8.9 s** before the first line. The other large ones are act-outs and set pieces that play on room tone only, because **Acts One and Two have no SFX stem** (the mixer lays no per-beat SFX).
- **Seams:** the frames either side of all 9 chapter seams are the planned content, and the EP clock and bar run on across each (§5).
- **One shared-code change (for the lead to review):** `studio/src/reel/sync.mjs` now also reads one level of subfolders of `show/reel/`. It was the blocker all five segment passes reported (§3.1).

---

## 1. Files

| What | Where |
|---|---|
| **The manifest** | `show/reel/ep01-full/ep01-full-v2.manifest.json` (9 chapters, 25 beds; see §3) |
| Segment timelines (the segment passes') | `show/reel/ep01-full/ep01-{coldopen,act1,act2,act3,tag}-v2.json`; Act Four is `show/reel/ep01-act4-v5.json`, unchanged |
| Their synced copies (made by `sync.mjs`; don't edit) | `studio/src/reel/data/ep01-{coldopen,act1,act2,act3,tag}-v2.json` and `ep01-full-v2.manifest.json` (new, untracked) |
| **The reel** | `out/ep01/reel/ep01-full-v2.mp4` |
| Chapters (stands in for chapter markers) | `out/ep01/reel/ep01-full-v2-chapters.json` |
| Render timings (the tool's) | `out/ep01/reel/ep01-full-v2-measure.json` |
| **Levels, holes, jumps, seams, decode** (this pass) | `out/ep01/reel/ep01-full-v2-levels.json`: every hole and jump with its chapter, beat, bed and the lines on either side |
| **Dialogue measures** (this pass) | `out/ep01/reel/ep01-full-v2-dialogue.json` |
| Contact sheet (a frame every 15 s) | `out/ep01/reel/ep01-full-v2-sheet.png` |
| Seam sheet (each chapter's last frame, the next one's first frame, and first + 12) | `out/ep01/reel/ep01-full-v2-seams.png` |
| **Transcript** | [transcript-v2.txt](transcript-v2.txt) (a copy of the pass's scratch `transcript.txt`) |
| The two measuring scripts | `audio/reel/ep01-full-v2/transcript.py`, `audio/reel/ep01-full-v2/measure.py` |
| Changed shared code | `studio/src/reel/sync.mjs` (+28/−7 lines); `studio/src/reel/README.md` (+2/−1: 2 rows) |

**The transcript's rules:**
- Every voiced line is listed at its episode time, at the first audible word.
- It's labelled the way the reel's dialogue strip labels it: a name only once the picture has named that character (a plate, a card, a tile, or `known` carried from an earlier chapter). Before that, the cast's neutral role is used ("MAN AT THE LAPTOP"), as in `Reel.tsx` `nameAt`.
- Every in-picture text of more than 3 words is listed at the time it appears. A text carried across a cut is listed once.
- The intro's texts come from its design table (`show/intro/shot-table.md` §3), not from reading the picture.
- Reviewer scaffolding is left out: the slate, the notes margin, captions, shot headers and the bar.
- **It has 394 lines:** 223 voiced lines (222 plus the intro VO) and 145 on-screen texts.

---

## 2. How to re-run it (exact commands)

```sh
cd studio
# 1. sync (copies show/reel/*.json and show/reel/ep01-full/*.json into src/reel/data/), then look at the plan
node src/reel/sync.mjs
node src/reel/tools/episode.mjs ../show/reel/ep01-full/ep01-full-v2.manifest.json --plan --no-sync
# 2. render + mix + mux, always through the heavy-job wrapper, in the background (it can wait a while for a slot)
nohup ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-full/ep01-full-v2.manifest.json \
  --no-sync --jobs 2 --conc 2 > /tmp/ep01-full-v2.log 2>&1 &
#    -> out/ep01/reel/ep01-full-v2.mp4 (+ -chapters.json, -measure.json); work files in studio/out/reel-work/ep01-full-v2/
#    After a fix to one chapter, run step 2 again: only that chapter's segments re-render (cached by content).
#    A sound-only fix (a bed, a level): add --mix-only (about 30 s of mix + 30 s of mux).
cd ..
# 3. the measurements, the sheets and the transcript (repo root; PLAN = the work folder's plan.json)
PLAN=studio/out/reel-work/ep01-full-v2/plan.json; M=<scratch>/meas
nice -n 15 audio/.venv-casting/bin/python audio/reel/ep01-full-v2/measure.py out/ep01/reel/ep01-full-v2.mp4 $PLAN $M
python3 audio/reel/ep01-full-v2/transcript.py $PLAN $M
#    then copy $M/measure-audio-video.json, sheet.png, seams.png, dialogue.json and transcript.txt to their places (§1)
```

- **This pass's render** used `--work` in the session scratch (`scratchpad/ep1s-assemble/work/`, 0.5 GB), so a re-run from the default work folder renders every segment again. That takes about 14 min at `--jobs 2 --conc 2` (§4.1).
- **`measure.py`** is a single sequential decode (2 decoder threads). It took 59 s here. It holds the whole decoded track in memory as float arrays (several GB for 22 min; peak RAM not measured), so run it nice'd and one at a time.

---

## 3. What the assembly decided

The chapters and beds are pasted from each segment pass's handoff (their notes' §5, or `audio/reel/ep01-<seg>-v2/manifest-part.json`). Where a handoff left a choice, this is what was picked:

| Chapter | Source | Sound | Note |
|---|---|---|---|
| title | the reel's 3 s slate | silence | reviewer scaffolding, as in v1 |
| coldopen | `ep01-coldopen-v2`, acts COLD OPEN | 3 takes + the cold open stem (`lufs: null`, no loop) | the stem replaces v1's three cold-open beds |
| intro | `out/intro/intro-ep1-V1-1080p.mp4`, full frame, 30 s | its own master (V1 Chip Chamber), −3 dB, 0.3 s tail | unchanged from v1; the −3 dB trim is still a proposal for an ear |
| card | `ep01-full-part1` beat `card.01` (2 s) | room-tone stand-in, −42 LUFS | the old caption beat, because its text is the script's card word for word. **See §6.1: it's hard to read in 2 s** |
| act1 | `ep01-act1-v2` | 56 takes + 11 beds from `manifest-part.json` | its last bed carries `until: act2` |
| act2 | `ep01-act2-v2` | 39 takes + the 9 beds of act2-notes §4.3 (MM-05 is its `-loop.wav`) | |
| act3 | `ep01-act3-v2` | 21 takes + the Act Three stem (`lufs: null`) | the stem replaces v1's MM-01 and MM-14 beds; it stops dead at the black, so no `until` |
| act4 | `ep01-act4-v5`, **unchanged** | its own premix `audio/reel/ep01-act4-v5/mix.wav` from 3.000 s | checked: the timeline has no diff from HEAD, and the premix is 521.458 s = 3 s + the chapter's 518.458 s |
| tag | `ep01-tag-v2`, acts TAG | 2 takes + the tag stem (`lufs: null`) | |
| outro | `ep01-tag-v2`, acts CREDITS (12 s) | MM-15 temp pad, fades out | placeholder until an outro proposal is chosen |

- **`known` is `[]`.** Names carry from chapter to chapter: the cold open names Mas, and each timeline's cast marks the rest.
- The episode `dateSpan` is "Nov 2022 - Dec 2023" and `runtimeMin` is 23.
- **The mix block is v1's:** duck −10, floor −50, bed −26 LUFS, dialogue −3 dB, master left as is. All five segment tests used the same block, and the chapter levels match the tests that reported one: Act One −18.2 (test −18.2), Act Two −17.4 (−17.4), Act Three −19.2 (−19.2), tag −26.3 (−26.2).

### 3.1 The sync change (shared code; for the lead to review)

- **The blocker.** `sync.mjs` listed `show/reel/` flat, so `show/reel/ep01-full/*.json` never reached `studio/src/reel/data/`, and every `from: "ep01-…-v2"` failed with "timeline … not found". All five segment passes rendered from scratch mirrors of the studio instead.
- **The change.** `sync.mjs` now also reads **one level of subfolders** (any folder not starting with `.` or `_`). Their files land in `data/` flat under their own names, so a timeline's key is still its basename. A flat file wins a name clash, and the sync prints a `!` line for it. `--watch` watches the subfolders too.
- **What it touched.** Nothing else changed:
  - The 15 existing `data/` files were byte-identical before and after (checked with a JSON compare before the first sync).
  - The run added 6 files: the five v2 timelines and the manifest, which the studio now registers as `reel-ep01-full-v2`.
  - `sync.mjs` and `README.md` aren't in the bundle's code hash (`episode.mjs` hashes only `src/reel/**/*.ts(x)`), so no one's cached bundle was invalidated by the code change itself. Other bundles do see the new `data/` files.
- **The README** (`studio/src/reel/README.md`) says so in the `sync.mjs` row and under "Where a manifest lives". `episode.mjs <key>` still looks for a bare key only in `show/reel/`, so this manifest is passed by path.

---

## 4. Measurements

### 4.1 Runtime per segment

| Chapter | Starts | Length | Frames | Script (printed) | Render wall |
|---|---|---|---|---|---|
| title slate | 0:00.0 | 3.0 s | 72 | — | 4.9 s |
| COLD OPEN (sc 1–4) | 0:03.0 | **30.2 s** | 724 | 0:40 | 33.6 s |
| INTRO | 0:33.2 | 30.0 s | 720 | 0:30 | 4.5 s (transcode) |
| CARD | 1:03.2 | 2.0 s | 48 | 0:02 | 4.0 s |
| ACT ONE (sc 5–12) | 1:05.2 | **5:41.1** | 8,186 | 4:42 (played estimate ≈ 6:11) | 4 segments, 85.7–100.2 s each |
| ACT TWO (sc 13–17) | 6:46.3 | **3:37.4** | 5,218 | 4:19 (≈ 4:49.5) | 3 × 75.4–80.8 s |
| ACT THREE (sc 18–23) | 10:23.7 | **2:28.0** | 3,552 | 2:18 | 2 × 75 s |
| ACT FOUR (sc 24–31) | 12:51.7 | **8:38.5** | 12,443 | 9:36 | 6 × 119–134 s |
| TAG (sc 32–33) | 21:30.1 | **38.4 s** | 921 | 0:45 | 40.2 s |
| OUTRO (placeholder) | 22:08.5 | 12.0 s | 288 | 0:43 (credits) | 13.8 s |
| **Total** | | **22:20.5** | **32,172** | 23:35 | **842.6 s** |

- **Story** (cold open through tag) runs 21:33.5.
- **The render:** 842.6 s of wall time, which is 95.5 s of reel per minute. That's bundle reused, plan 0.3, render 811.3, mix 29.7 (alongside), concat 0.3, mux 30.5.
- **The machine:** `--jobs 2 --conc 2` (4 browser tabs) inside one `ops/heavy.sh` slot. The job waited about 15 min for the slot (01:50 → 02:05), while a Blender job and an OST render held both slots. Load average during the render was 8–13 on 14 threads, with 19–23 GB of memory available.

### 4.2 Dialogue per act (`ep01-full-v2-dialogue.json`)

| Act | Lines | Words | Median words / line | Lines ≤ 3 words | Longest conversation |
|---|---|---|---|---|---|
| Cold open | 3 | 33 | 10 | 1 | 11.8 s, 2 lines (the host's question, Mas's answer) |
| Intro | 1 (VO) | 6 | — | — | — |
| Act One | 56 | 437 | 5 | 18 | **43.3 s**, 12 lines (sc 5, the launch-night argument); 4 conversations over 20 s |
| Act Two | 39 | 284 | 6 | 9 | **40.5 s**, 10 lines (sc 15, the Senate); 2 over 20 s |
| Act Three | 21 | 142 | 6 | 6 | **15.2 s**, 4 lines (sc 21, Nedib's signing). Gerg's call (sc 20) is 25.9 s over 8 lines only across its edit insert, a 4.2 s gap (act3-notes) |
| Act Four | 101 | 836 | 5 | 27 | **61.0 s**, 19 lines (sc 29, Gerg's 2 a.m. call); 5 over 20 s |
| Tag | 2 | 2 | 1 | 2 | none (two one-word buttons) |
| **Episode** | **222** (+1 VO) | **1,734** | | | |

- **Definitions.**
  - A conversation is a run of lines in one scene with no gap over 3.0 s from one line's last word to the next line's first. That's the definition of Act Four's `report.py`, and Act Four's figures here match its own report exactly (101 / 836 / 5 / 61.0 s).
  - A word is a whitespace token with a letter or digit in it. So "back—and" is one word, which is why the cold open counts 33 here against its pass's 34, and Act One 437 against 440.
- **The longest stretches with no voice** (drag candidates, §6):

| Length | When | Where |
|---|---|---|
| 40.1 s | 9:10–9:50 | Act Two, the stamp, poster run and signers set piece |
| 32.6 s | 5:53–6:25 | Act One sc 11, the GTP-4 / CLOD duel into the pause letter |
| 29.4 s | 10:08–10:38 | across the Act Two → Three break: the rooftop crack, then the rack, the box and the Orb |
| 24.5 s | 10:44–11:09 | Act Three, the monitor run |
| 23.3 s | 21:23–21:46 | Act Four's last image into the tag's opening |
| 21.9 s | 2:39–3:01 | Act One, the user counter and the two posts |
| 21.0 s | 13:18–13:39 | Act Four, the falling tile and the removal |

The intro is 37 s without dialogue after its VO line, but that's the title sequence with its own score.

### 4.3 Holes: under −42 dBFS for 0.3 s or more (every one explained)

**Method.** 50 ms RMS of the louder channel on a 10 ms hop, from the decoded AAC. There are **86 runs, 60.8 s in total.** The full list, with each run's chapter, beat, bed and neighbouring lines, is in `ep01-full-v2-levels.json` → `holes_under_-42dBFS_0.3s`.

| Group | Runs | Total | Longest | Deepest | Why it's there |
|---|---|---|---|---|---|
| **A. The slate** | 1 | 3.0 s | 3.03 s | digital black | By design: the reel's title slate has no sound. The file's only digital silence (0.5 s or more under −90 dBFS). |
| **B. Room-tone-only scenes** | 52 | 37.0 s | 2.46 s | −51.0 | Pauses between (and inside) lines where the bed is the room-tone stand-in (−42 LUFS): Act One sc 5 (36 runs), sc 9 after LEVERAGE stops (9), sc 12 (1); Act Two sc 14 (2) and the wallet stop at 15.12 (4). The mixer ducks every bed −10 dB and holds the duck across gaps under 2.5 s, so the room rests at the −50 LUFS floor plus a −52 room: **−48 dBFS median**. The worst are Act One's chatbot beat, 2:21.6–2:24.0 (2.46 s) and 2:25.7–2:27.7 (2.03 s): "What a great question!" / "Nobody asked one." / "Brilliant!" play with the room ducked in between. **This is a mixer effect, not the script:** a real room doesn't drop 10 dB when someone speaks. See §7.1. |
| **C. Ducked score** | 14 | 7.5 s | 1.04 s | −51.3 | Rests inside a ducked cue between close lines: MM-19 in the White House (9 runs), and once each in the MM-16, MM-04 and MM-14 temp pads, MM-08 and MM-05. |
| **D. Cold open stem** | 5 | 3.7 s | 1.62 s | −52.1 | Three in the freeze and the invite read (0:18.9–0:22.7): the script drops the hall "to a low filtered hum… never to silence". The stem's hum is at −46, and the duck under "noted." takes it lower. Two short ones fall in the 1993 beat. |
| **E. Act Three stem** | 9 | 3.9 s | 0.80 s | −48.1 | The stem's 0.3 s fade-in at the Act Two → Three seam; then short gaps around "thanks.", on Gerg's call (4) and in the DevDay keynote (2), over the stem's ducked room. |
| **F. Tag stem** | 2 | 0.7 s | 0.36 s | −47.7 | Either side of "noted." in the dark room. |
| **G. Act Four's own premix** | 2 | 4.7 s | 3.67 s | −77.4 | 13:33.3–13:36.9 is the script's "Silence." as Mas is removed from the call (S1.09), inside the approved v5 mix. 21:29.6–21:30.6 is Act Four's mix ending (its last 0.55 s) plus the tag stem's 0.5 s fade-in: **about 1 s of near-black at the act break**, while the picture holds the observer chair. |
| **H. The intro's end** | 1 | 0.36 s | 0.36 s | −83.9 | The intro master's own last 0.2 s, plus the card's 0.3 s room fade-in. |

### 4.4 Abrupt level jumps

**Method.**
- **Steps:** the 3 s short-term loudness after a moment against the 3 s before it, with a change of 10 LU or more.
- **Startles:** the 400 ms momentary loudness rising 20 LU or more inside 0.4 s and landing at −16 LUFS or louder.

**What was found.**
- **Steps: 71.**
  - 55 are speech starting or stopping.
  - 8 happen inside one bed:
    - the cold open's freeze (−10 LU, designed);
    - Tasya's line ending 2 s before 4:17.5 (just outside the test's ±1.5 s window);
    - six inside Act Four's own approved mix: the laptop's JOIN at S1.02 (+11), the "Silence." at S1.09–S1.10 (−24, then +26), the render front at S2.03–S2.04 (−11, then +12), and the black tile at S6.06 that "goes without a sound" (−17).
  - 5 happen at a bed change and 3 at a seam. These are the ones worth an ear:

| When | Change | What |
|---|---|---|
| **1:03.2** (intro → card) | **−25.6 LU** (−15.8 → −41.5) | The intro's final hit, then 2 s of card on room tone, then sc 5's opening on the same room: **8.9 s at about −41.5 LUFS before the first line (1:12.1)**. It's the biggest non-slate drop in the episode. See §7.1. |
| 3:55.5–3:58.6 | −13.5, then +15.0 | MM-16 rings out into 3 s of lobby room, then LEVERAGE. As designed by the Act One pass. |
| 5:39.0 | +22.5 (−41.6 → −19.1) | After Sydney's exit, 6 s of room (5:33–5:39): the pre-beat's tick "is not laid" (the bed's own label), then the MM-04 pad and Mario. |
| 6:44.5 | +13.2 | Act One's act-out: 11 s of room (6:33.5–6:44.4) under the "Shut It All Down" text, then the MM-14 pad on the pen's lift. The pen's scratch isn't laid. |
| **10:14.5 → 10:24.0** (Act Two → Three) | −10.2, then **+13.9 at the seam** | The rooftop-wind stand-in (−40) for 9 s after the score stops, with the bell not laid, then the Act Three stem enters at −25.7. |

- **Startles: 107.** 88 are line onsets after a pause, and 19 are a word after a pause inside a line. **None is a non-speech hit**: no SFX, music or seam reaches −16 LUFS momentary with a 20 LU rise.
- **Across the seams** (short-term 3 s before → after):

| Seam | Before → after |
|---|---|
| title → cold open | slate → −17.8 |
| cold open → intro | −25.4 → −22.9 |
| intro → card | −15.8 → −41.5 |
| card → Act One | −41.1 → −41.6 momentary (room to room) |
| Act One → Two | −32.0 → −26.7 |
| Act Two → Three | −39.6 → −25.7 |
| Act Three → Four | −27.8 → −26.7 |
| Act Four → tag | −32.4 → −26.9 |
| tag → outro | −28.6 → −26.5 |

- **Chapter loudness** (integrated, decoded AAC): cold open −18.7 · intro −17.1 · card −41.4 · Act One −18.2 · Act Two −17.4 · Act Three −19.2 · Act Four −17.1 · tag −26.3 · outro −26.2. The whole file is −17.74 LUFS, with a −4.14 dBFS sample peak. The limiter didn't engage.

---

## 5. The seams, checked in the encoded file

I decoded every frame of `ep01-full-v2.mp4` (32,172; 0 errors) and kept each chapter's last frame, the next chapter's first frame, and that frame + 12. They're in `ep01-full-v2-seams.png`. I also looked at 4 full-size frames: the card, Act Four S1.03, Act Four's last frame and the tag's 32.03.

| Seam (frame) | Last frame before | First frame after |
|---|---|---|
| title → cold open (72) | the "EPISODE 1" slate | the APEC stage; its rail is up by frame 84 |
| cold open → intro (796) | 1993's 1-bit alert, "rewinding… too far" | the intro's opening frame (the cursor on black) |
| intro → card (1516) | the intro's last frame, the `verified: human` toast | the card, blank on its first frame; the text is fully drawn by frame 1528 |
| card → Act One (1564) | the card with its full text | sc 5's first beat: an empty frame, with "research previe…" typing by frame 1576 |
| Act One → Two (9750) | the act-out's black (void set) | the White House meeting room; the rail is up by frame 9762 |
| Act Two → Three (14968) | black (void) | Mas's dark room |
| Act Three → Four (18520) | black (void) | the Las Vegas suite; the rail by frame 18532 |
| Act Four → tag (30963) | the "MACROSOFT · OBSERVER (NON-VOTING)" chair, Act Four's last image | the dark room; "CUT LINE" by frame 30975 |
| tag → outro (31884) | black (void) | the outro placeholder card |

- **The margins read correctly** in all 4 full-size frames:
  - the header (`EP 01 · ep1.0_research_preview.md`, act, beat, shot and set);
  - the EP clock (`EP 1:04.2 / 22:20.5` on the card; `EP 21:30.1 / 22:20.5` on Act Four's last frame);
  - the chapter clock and the script clock;
  - the two-row bar, whose chapter marker advances across the seams;
  - "DIALOGUE · RECORDED TAKES" on the dialogue chapters.
- **Every chapter kind drew:** the title slate, the transcoded intro, a caption beat (the card), five dialogue reels and Act Four's premixed reel.
- **The contact sheet** (`ep01-full-v2-sheet.png`, a frame every 15 s) shows the planned set in every chapter, with no blank or error frames. The intro frames (Gerg's card at 0:45, the title slam at 1:00) are the V1 master's.

---

## 6. Length: where to look for drag (proposals only; nothing cut)

The showrunner watches first and marks the drag. The numbers point here:

1. **The long stretches without a voice** (§4.2): Act Two's set piece (40 s), Act One sc 11 (33 s), the Act Two → Three break (29 s), Act Three's monitor run (24.5 s) and Act Four's end into the tag (23 s).
   - The act and chapter notes already name their own trims: act2-notes §7, act3-notes §9, act1-notes §7, coldopen-notes §6 and tag-notes §6.
   - In the stick reel, these stretches play as text cards over temp pads or room tone, which is flatter than the final picture will be.
2. **Against the script's printed clocks,** the chapters play short: cold open −9.8 s, Act Two −42 s, Act Four −58 s, tag −6.6 s. Act One plays +59 s over its printed 4:42 (but 30 s under the script's own ≈ 6:11 played estimate), and Act Three +10 s. The whole story is 21:33.5, against the ≈ 22:20 printed.
3. **The card (§6.1 below) is the one place that may need to be longer, not shorter.**

### 6.1 A clarity note, not a length cut: the card

- **The 2 s card** (script: "FILENAME + DISCLAIMER CARD — 2 s") carries the filename plus a 13-word disclaimer.
- **Read time.** The text is fully drawn about 0.5 s in, which leaves about 1.5 s to read 13 words. That's roughly 9 words a second, against a comfortable 3–4.
- **Proposal:** 4 s (`"durs": {"card.01": 4}` on the card chapter). It's the showrunner's call, because it adds 2 s. Not made.
- *(2026-09-27: moot. The disclaimer is cut ([SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) note 3), so the card is the filename alone, 2 s.)*

---

## 7. Open issues, and what needs a person

### 7.1 Sound (found by measuring; not fixed, because they belong to the reel's mixer and to the segment passes)

1. **Room tone ducks.** The mixer ducks every bed −10 dB under speech, room-tone stand-ins included. Between close lines, the room drops to about −48 to −51 dBFS (52 of the 86 holes).
   - **Proposal:** a per-bed `duck` setting in `tools/mixer.mjs` (for example `"duck": 0` on `pad: {type: "room"}` beds), so a room holds steady the way a real one does.
   - It's a small change to shared code. I left it to the reel's owner.
2. **Acts One and Two have no SFX stem.** The cold open, Act Three and the tag built their own (`*_bed.py`). So Act One and Two's designed sounds aren't heard: Sydney's tick, the THUD, the pen's scratch, the rooftop bell, sc 14's anchor murmur. Each leaves a 6–11 s stretch of bare room (§4.4).
   - **Proposal:** an `act1_bed.py` and `act2_bed.py` in the pattern of `audio/reel/ep01-act3-v2/act3_bed.py`, played as each act's bed with `lufs: null`.
3. **Intro → card → sc 5** drops −25.6 LU into 8.9 s of room before the first line. That may read as the "random pause of silence" the flow notes warn about (SHOWRUNNER-NOTES 17).
   - Options: a longer intro `tail`, or the bullpen's own sound (keys, the build's fan) under the card and sc 5's opening once Act One has a stem.
4. **Act Four → tag** has about 1 s of near-black (Act Four's own ending). It's probably right for an act-out. An ear should confirm.
5. **Carried over, unchanged:**
   - the −3 dB intro trim;
   - the temp pads for MM-03, -04, -12, -14, -15, -16, -17 and -20;
   - the segment passes' flagged takes: Act One's "It's stuck." and "Suits you.", Act Two's 15-09 "a littles", Act Three's "is that the build?" and NOLE's pace.

### 7.2 Needs a person

| Measured here | Needs a person |
|---|---|
| Frames, decode, runtime per chapter, seam frames | **Watching the whole reel**, and marking where it drags (§6) |
| Loudness per chapter, holes, jumps, seams (§4.3–4.4) | **Listening**: the room ducking, the intro → card drop, the act-outs on bare room, the pads, the duck |
| Lines, words, conversations (§4.2); the transcript | The newcomer and insider reads across all five acts. Act Four's newcomer read is still owed (v5-stick-for-review) |

### 7.3 Housekeeping

- **Nothing was committed.** Untracked:
  - `show/reel/ep01-full/` (five timelines plus the manifest);
  - six `studio/src/reel/data/` files;
  - `out/ep01/reel/ep01-full-v2*`;
  - `audio/reel/ep01-full-v2/`;
  - this file and `transcript-v2.txt`.
- **Modified:** `studio/src/reel/sync.mjs` and `studio/src/reel/README.md`.
- **`docs/STATUS.md` doesn't exist yet.** When it does, this file is the Ep1 stick reel's entry.
- **Scratch** (temporary; nothing is needed to re-run): `scratchpad/ep1s-assemble/`.
  - `work/`: the bundle, 21 segments, `plan.json`, `mix.wav`, `mix-qa.json`;
  - `render.log`, `meas/`, `meas-audio/`, `transcript.txt`, `tools/`.
