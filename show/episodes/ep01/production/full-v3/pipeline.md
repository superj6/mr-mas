# Ep1 v3: the episode pixel pipeline (track P0)

> **Status: built and tested, 2026-09-27, by the `v3-pipeline` pass.** Nothing is committed; the lead commits.
>
> **The result:** Act Four v5, run through the new pipeline, produces the **same H.264 stream, bit for bit**, as the existing v5 picture render (`out/ep01/act4/animatic/act4-animatic-v5-picture.mp4`). That covers all 12,443 frames.
>
> **What that proves, and what it doesn't:** it proves the frames are the same as before. It doesn't prove the picture reads well. Nobody has watched either render.

**What P0 is for** ([PLAN §1](PLAN.md)): one pipeline that takes any segment's stick timeline plus a per-segment shot-spec module and renders the pixel picture. Then the P2 shot passes (the cold open, Acts One to Four, the tag) write only layouts.

**How a shot pass uses it:** see [studio/src/episodes/ep01/pixel/README.md](../../../../../studio/src/episodes/ep01/pixel/README.md), which has the commands.

## 1. What was built

Everything is in `studio/src/episodes/ep01/pixel/`, and every file is new. **No Act Four file was edited**; they are only imported. v4 and v5 are untouched: `git status` shows no tracked file changed by this pass.

| Piece | File | Generalized from | What changed |
|---|---|---|---|
| **The lock** | `tools/lock.py` | `act4/animatic/tools/lock_v5.py` | See §1.1 |
| **The host** | `frame.ts` | `frame5.ts` | See §1.2 |
| **The shot spec** | `spec.ts`, `types.ts`, `anchors.ts`, `kit.ts` | the `DRAW5` registry | A shot pass exports `SEGMENT = defineSegment({seg, lock, layouts})`. Each layout gives `{draw(fb, k, sh, f), st, standin?, kind?, marks?, face?, whip?, enter?, exit?, glyph?}` (§1.3) |
| **Lip-sync** | `lipsync.ts` | `lipsync5.ts` | Typed wrappers only. It's Act Four's module and conventions, not a copy |
| **Stand-ins and slates** | `standin.ts`, `text.ts` | frame5's stick fallback | See §1.4 |
| **The Node renderer** | `tools/render.ts`, `tools/build.mjs` | `render5.ts` | See §1.5 |
| **Remotion** | `entry.tsx`, `frames.ts`, `Host.tsx` | `Animatic5.tsx`, `frames.ts` | Segments are found automatically (`require.context` on `<seg>/shots.ts`). Each registers `ep01-pixel-<seg>`, `-review` and `-still`. A shot pass edits nothing here |
| **Test tools** | `tools/act4check.ts`, `tools/mp4cmp.mjs` | (new) | frame5 against the pipeline in one process; two renders compared by stream and by decoded frames |
| **The port** | `act4-v5/` | (new) | See §1.6 |
| **The worked example** | `example/` | (new) | The v3 stick sample, with three placeholder layouts on the committed bullpen art and the other 47 shots as stand-ins. Not a segment of the show |

### 1.1 The lock (`tools/lock.py`)

- **What it takes:** any timeline, one or more takes files (or the timeline's own lines), an optional mix and an optional plan.
- **What it writes:** `full-v3/lock/<seg>.json` and `pixel/<seg>/data.ts`.
- **Plans:** a plan can hold marks, faces, post ids, text kinds, refs and sound marks. It can also read those tables straight out of a Python file's assignments without running it: `plan_py`, which is how the port reads `lock_v5.py`.
- **New since `lock_v5.py`:**
  - **Pre-laps:** a negative `t` puts the line into the earlier shot, flagged `pre`.
  - **Beat lengths that aren't whole frames:** beats are placed on the reel's half-up rounding.
  - **Lines with no take:** kind and mode come from the tag, and the mouth track from the words.
  - **Text kinds from the device prefixes:** name plates are found from `names[]` and the cast.
  - **Reviewer-slate detection.**
  - **Timelines from git:** `git:<rev>:<path>`.
  - **The general fields on every shot:** `spots`, `onscreen`, `cast`, `speak`, `beatStarts`, `names`, `set`/`room`/`style`/`fx`, `slate`.
- **What stayed plan data, not code:** the Act Four specifics that `lock_v5.py` hard-codes (the 12:31:00 timecode, the 72-frame mix offset, D6, the four sound marks, the `RIMA:` post).

### 1.2 The host (`frame.ts`)

- **What it does:** `prepare`, `native`, `picture` and `review`, plus `glyphFrames`, `browserFrames` and `srt`.
- **The band:**
  - rails, typed
  - Mas's V.O. line, as pov-and-framing §5.2 has it: lowercase, x 12, baseline 198, C6 with an N0 shadow, typed at 0.5 characters a frame, held 15 frames. A line wider than the frame wraps upward, and `check` lists it.
  - the side badge, as an option
  - dialogue subtitles burned in, as an option. An `.srt` is written beside every render.
- **Transitions:** Act Four's 2-frame whips, plus dip, flash and a bayer dissolve.
- **Prints:** the blueprint print, or any function over the finished frame.
- **The review frame:** frame5's, with its labels as configuration.

### 1.3 The shot spec

- **Marks** are declared beside the layout as anchors, in the same grammar as the lock. They're resolved at load time; a failure is listed by `check`.
- **Faces** are per framing, as Act Four has them.

### 1.4 Stand-ins and slates

- **Stand-ins:**
  - What's drawn: the stick figures of a shot's cast on a plain set (their stick x and pose, a mouth while they speak), or a labelled plate, with the lock's in-world text on top and a red STAND-IN tag in the picture.
  - How loudly it's flagged: a banner on every render, the list in `render.json`, red in the review margin and on the contact sheet, and a failed `check` unless `--allow-standins` is passed.
- **Reviewer slates:** a stick card whose caption or cue says "reviewer" is drawn as a slate marked "not part of the show". `--slate <s>` adds a head slate to a render, with silence under it.
- **Default in-world text:** plates, cards, labels, UI, toasts, posts and tickers, all kept above row 180 (the V.O. rows).

### 1.5 The Node renderer (`tools/render.ts`)

- **Built per segment** by `build.mjs <seg>` in about 0.1 s.
- **Unchanged from render5:** no browser, raw AVI into the bundled x264, parallel chunks cut on shot starts. The encoder settings are the same.
- **What it writes:** `out/ep01/full-v3/picture/<seg>.mp4` by default, or `review`, or `both`.
- **Audio:** the lock's mix at its offset, or `--mix` / `--mix-offset`, or `--no-audio`.
- **Other options:** `--slate`, `--opt key=value`, `--glyph marks`, `--from`/`--to`.
- **Browser frames:** frames that only a browser can draw (GLYPH tokens, and J1 when it's on) are spliced in from the Remotion host's PNGs, after `bundle` and `glyphs`.
- **Other modes:** `check`, `glyphspan`, `stills`/`picstills`/`native`, `contact`, `cuts`, `ledger`, `srt`.

### 1.6 The port (`act4-v5/`)

- **What it is:** the test. `plan.json` reads `lock_v5.py`'s tables and the v4 lock's marks, from the timeline that v5 was cut from (git `2fd8da5`).
- **`shots.ts`** hands this lock's shots to `shots5.ts`'s own 83 layouts, through `drawShot5`.
- **`browser.tsx`** holds J1.

## 2. The test: Act Four v5 through the pipeline

**Why the old timeline:** `data-v5.ts` was cut from `show/reel/ep01-act4-v5.json` as it stood at commit `2fd8da5`, before the 2026-09-27 hedge-label removal. A copy of `lock_v5.py` with its output paths redirected to scratch reproduces `data-v5.ts` byte for byte from that timeline. The port therefore locks that same timeline: `plan.json` sets `"timeline": "git:2fd8da5:show/reel/ep01-act4-v5.json"`.

**Why the test reaches the lock too:** the port renders from its own lock, never from `data-v5.ts`. So the test covers `lock.py` as well as the host.

| # | What was compared | How | Result |
|---|---|---|---|
| 1 | **The lock** | Every one of the 22 ShotV5 fields of all 83 shots (1,826 fields), plus `SEQS`, `RAILS`, `SUBS`, `SOUND_MARKS`, `V4_IDS`, `D6`, `MIX`, `ACT_FRAMES`, `EP_IN_FRAMES` and the GLYPH frame list, against `data-v5.ts` (`act4check lock`) | **identical** |
| 2 | **Every show frame** | All 12,443 frames at 480 × 270, pixel by pixel, and their GLYPH layers, `frame5.native5` against `frame.native` in one process (`act4check frames`, 228 s on 2 workers) | **0 differ** |
| 3 | **Picture and review frames** | 2,231 frames at 1920 × 1080: every 6th frame, both sides of every cut, all 28 GLYPH frames. `picture5` against `picture`, and `anim5` against `review` | **0 differ, in both** |
| 4 | **The Remotion host** | The new host's 28 GLYPH frames and 4 plain frames, picture and review, 64 PNGs. Compared with the v5 host's own PNGs from the v5 render (`a4p5-finish/glyph`) (`act4check pngs`) | **64 of 64 identical** |
| 4b | **The new host on its own** | Remotion against Node on the plain frames; on the GLYPH frames, outside the room area | **identical** |
| 5 | **The encoded film** | The new picture render (`render.ts picture --jobs 2`, `X264_THREADS=1`, the new host's GLYPH PNGs spliced), against the existing `act4-animatic-v5-picture.mp4` | **The H.264 stream md5 is equal, `76d4d1556b25a8307abb65a1d3f9252d`: the same encode, every frame** |
| 5b | **Sampled decoded frames** | 30 frames: 0, 50, 90, 140; the GLYPH frames 997, 999, 1000, 1010, 1020, 1026, 1028; the V.O. frames "i don't keep score." 1216, 1230, 1250, 1262; the whips 1510–1513; the chunk seam 6273/6274; the card 6943; 3000, 5000, 8000, 9238, 9300, 11000, 12342, 12442. Each decoded to PNG and hashed (`mp4cmp.mjs`) | **30 of 30 identical** |

**Two differences known before the test, and why the result survives both:**
- **`shots5.ts` changed after the v5 render.** At 10:09 on 2026-09-27 (commit `95ebc0e`), only S5.06's `st` string (its "built from" note) changed. That string appears in the **review** margin only, never in the picture, so the picture comparison is unaffected. The in-process review comparison (row 3) is made against the current `shots5.ts`, where it is identical.
- **The current Act Four timeline has lost its hedge labels** (TPOOL, MARIO, ALYI, MACROSOFT). Re-locking the current one would change those texts, as intended. That belongs to the v3 re-lock of Act Four (S3), not to this test.

**The records** (scratch, may not last): `scratchpad/v3-pipeline/act4check-frames.json` (the per-frame test with md5 samples), `glyph-vs-old.json`, `mp4cmp-v5.json`, `render/act4-v5.mp4.render.json`.

### 2a. Beyond Act Four

- **The 5 Ep1 v2 timelines** (cold open, Acts One to Three, the tag) all lock with no plan and no failed check. They were written to scratch, not to the lock folder.
- **The v3 stick sample** (the `example` segment) exercises the new cases:
  - 2 pre-laps land in the shot before (`e1-a1-5-01` at −0.50 s into 5.03 appears in 5.02 as a `pre` row)
  - 3 reviewer slates are detected and drawn as slates
  - 13 beats aren't whole frames
  - 12 V.O. lines
  - it runs with and without takes; with `--no-takes`, 58 mouth tracks are built from the words
- **The cold open end to end with no layouts at all:** 10 of 10 shots rendered as tagged stand-ins, with a 2 s head slate and burned subtitles, in 4 s.
- **Node against Remotion on the example's review frame:** identical.
- **What I looked at (stills, not motion):** the example's slate, a stand-in, the V.O. line and the review frame, the cold open's head slate and a stand-in with burned subtitles, and J1 through the Remotion host (`--props '{"opts":{"j1":true}}'`). J1 draws its certificate on the browser frames, and it is off by default.

## 3. Speed

| Job | Time | Per frame |
|---|---|---|
| **Act Four picture** (12,443 frames, 1080p, 2 workers, `X264_THREADS=1`) | **116 s wall** | about 15 ms per worker, about 107 frames a second in total. The act is 8:38, so that is about 4.5× real time |
| v5's `render5` for comparison (picture and review together) | 237 s | |
| Drawing only, in the test (`native`) | | 8.3 ms, where frame5 took 9.6 ms: the pipeline adds nothing measurable |
| Stand-in-only segments | | about 8 ms per frame per worker |
| The lock | about 1 s | |
| The renderer build | 0.1 s | |
| The Remotion bundle | about 10 s | from file times, not timed directly |
| The GLYPH frames (32 frames × 2 compositions, and the check) | about 10 s | from file times, not timed directly |

**Estimate for the episode:** at this rate the whole of Ep1 (about 20 min, about 29,000 frames) renders its picture in about 4.5 min on 2 workers. This is an estimate, not a measurement: real layouts may cost more than stand-ins, and Act Four's layouts are heavy.

## 4. Limits and open issues

1. **Nothing here has been watched or heard.** Equality with v5 is measured. The look of the example, the stand-ins and the slates is judged from stills only.
2. **Frames only a browser can draw:**
   - GLYPH tokens and J1 need the Remotion host (`bundle`, then `glyphs`, then `GLYPH_DIR`).
   - Without the PNGs, a GLYPH frame gets v4's 2-pixel marks and J1 frames get the plain picture. Both are reported.
   - Runs of browser frames more than 24 frames apart are rendered as separate Remotion ranges.
3. **Act Four in v3** needs the S3 re-lock of the current timeline (the C13–C16 cuts, no hedge tags, no badges) and a `pixel/act4/shots.ts`. For shots that keep their v5 layout, that file can reuse `act4-v5/shots.ts`'s wrapper. The v5 `plan.json` marks name v5 shot ids; a re-cut shot needs its marks re-anchored.
4. **The `badge` option is off for v3** (v3-plan §1.4), and the review margin's side box is off with it. The WHAT THEY DIDN'T KNOW card is a layout matter for the Act Four pass.
5. **Lines with no take** get a mouth track built from their words (shapes on 3s, a closure on m/b/p), not from phonemes. The lock logs every one.
6. **The default in-world text** (`drawTexts`) is serviceable, not art. Posts and plates with a story role should be drawn by the layout.
7. **§5.2's "one must-read at a time"** is checked, not enforced. `check` and the lock list any V.O. that shares the screen with a rail; the v3 sample has one (`v3s-01` with "NOV 30, 2022").
8. **The subtitle file** holds dialogue and V.O. from the lock's `subs`, using the facts text fix where the segment has one. Nothing muxes it into the MP4; it sits beside it.
9. **Parallel renders are chunked on shot starts.** A layout that isn't a pure function of `(k, sh, f)` breaks the equality between chunked and Remotion frames. The rule is in the README.
10. **The example uses only committed art.** The art passes' new modules (`mas-seated.ts` and others, still untracked) may change under anyone who imports them now.
11. **`tsc --noEmit -p .`** in `studio/` shows no errors outside the known `src/dev/realism/bake` ones.

## 5. Re-running the test

`S` is your scratch folder. From `studio/`; the heavy steps go through `ops/heavy.sh`.

```sh
python3 src/episodes/ep01/pixel/tools/lock.py --seg act4-v5 --plan src/episodes/ep01/pixel/act4-v5/plan.json    # (from the repo root)
node src/episodes/ep01/pixel/tools/build.mjs --entry src/episodes/ep01/pixel/tools/act4check.ts $S/a4c.cjs
node $S/a4c.cjs lock                                                            # the lock: identical
../ops/heavy.sh node $S/a4c.cjs frames $S/act4check.json --jobs 2 --review-every 6   # every frame (~4 min)
node src/episodes/ep01/pixel/tools/build.mjs act4-v5 $S/r.cjs
../ops/heavy.sh node $S/r.cjs bundle $S/bundle
BUNDLE=$S/bundle ../ops/heavy.sh node $S/r.cjs glyphs $S/glyph 2
node $S/a4c.cjs pngs <the v5 render's glyph dir> $S/glyph                        # if that dir still exists
GLYPH_DIR=$S/glyph SEGDIR=$S X264_THREADS=1 ../ops/heavy.sh node $S/r.cjs picture $S/act4-v5.mp4 --jobs 2
../ops/heavy.sh node src/episodes/ep01/pixel/tools/mp4cmp.mjs ../out/ep01/act4/animatic/act4-animatic-v5-picture.mp4 $S/act4-v5.mp4 997 1010 1216 ...
```

## 6. Files

- **Code:** `studio/src/episodes/ep01/pixel/`. See the README's file table.
- **Generated:**
  - `pixel/act4-v5/data.ts` and `pixel/example/data.ts`
  - `full-v3/lock/act4-v5.json` and `full-v3/lock/example.json`
  - The P2 passes' `pixel/<seg>/data.ts` and `full-v3/lock/<seg>.json` are generated the same way.
- **Output:** none in `out/`. The test render is identical to the existing v5 picture, so it was kept only in scratch.
