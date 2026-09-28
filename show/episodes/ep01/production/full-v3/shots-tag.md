# Ep1 v3: the tag's pixel shots (`v3-shots-coldopen-tag`, 2026-09-27)

> **Status: v3.2, final: re-locked on the final v3.2 lock (the v3.2 section below), the Runway demo spliced (the v3.1 section). The sections after those are the v3 record.** This is track P2 of [PLAN.md](PLAN.md) for the `tag` segment. The cold open's record is [shots-coldopen.md](shots-coldopen.md), which also holds the shared tools.
>
> **The tag ends on its own last frame:** black on the vault's hum (33.05). The Orb outro follows as a separate chapter and isn't in this render.
>
> **Nothing here was watched or heard.** I looked at the contact sheet, at native stills of every shot at 2x, and at three frames decoded from the MP4. The flash numbers are measured.
>
> Nothing was committed.

## v3.2: the final lock (2026-09-28)

**The brief** (the lead): re-lock on the final v3.2 lock (`show/reel/ep01-v32/ep01-v32-tag.json`, lock-v32.md, script draft 8.1). The tag's V.O. "those are stills." is cut (calibration: a caption; the stutter carries the joke), and my v3.1 splice had baked it into the insert's PNGs.

**What changed in the timeline, measured against v3.1:**
- **Only that line.** v31-vo-07 is gone from v31-32.01d.
- Every beat's length, every other line, the onscreen text, sounds, fx, cast, frames and captions are identical.
- **No first-appearance plates fall in the tag.** Its cast is Mas, the Orb and ELGOOG'S DEMO; no plate is drawn.

**What I did:**
- **The lock:** re-locked on v3.2, on the same takes (`tag/takes-mouth.json`), with a temp track cut from the v3.2 stick reel (`out/ep01/reel/ep01-v32-stick.mp4`, 1235.333 s + 41.333 s → `picture/tag-stick-mix.wav`, 992 f). The episode frame in is 29576.
  - 992 frames; the lines are v31-tg-0001, v3-vo-24, v31-tg-0002 and e1-tg-33-01.
  - Against the v3.1 lock, only v31-32.01d's lines and every shot's timecode changed.
- **The splice PNGs:** rebuilt from scratch (`insert.py --variants a --no-chip --png … --png-offset 62`, `--out` in scratch), then `tag/tools/splice.ts`.
  - It now lays **no host layer on any of the 217 frames** (`with_host_layer: 0`): no V.O., and the band was already the same.
  - So the splice frames are the insert's own.
- **The code:** no layout changes; only the comments and the insert's `st` note, which reach the review margin only.
- **The render:** `out/ep01/full-v3/picture/tag.mp4`, 992 frames, 41.33 s. 217 browser frames spliced, 0 missing, no stand-ins. It ran as one heavy job: the PNGs, the splice and the render.

**Measured:**
- **The insert against `elgoog-demo-final.mp4`**, both decoded to 480×270:
  - worst frame MAD 1.23 of 255 (encode noise);
  - the V.O. rows (182–203, x 0–130) over i168–211 differ by 12 at most, so no text.
- **Joins, looked at:**
  - 61 → 62: the two-shot on the lit card → the insert's `[OTS]`;
  - 278 → 279: the insert's `[OTS]` on the held still → the layout's two-shot;
  - 294 → 295: → 32.02's slot.
  - Stills at 240 and 270 show the still and the pull-back clean.
- **Flashes:** **0 in any second**, red 0. The transitions are as in v3.1 (72, 265–271, 295, 776–780, 960). The largest mean-luminance step is 0.32 at 878.
- **The subtitles** (`tag.srt`): four lines, "What the quack!", *it looks calmer than me.*, "that was close." and "noted.".
- **Checks:** `check` has 0 stand-ins and 0 problems. `tsc` (scoped) is clean.

**For the sound pass:** the v3.2 tag is still 992 frames. The stillness at i167–216 (tag 229–278) is now silent of V.O. (runway.md §7's "Nothing but the room coming back").

## v3.1: the final lock, and the Runway demo spliced (2026-09-27)

**The brief** (the lead, under the showrunner's "fully finalized version"):
- Re-lock on the final v3.1 lock (`show/reel/ep01-v31/ep01-v31-tag.json`) and update the layouts for its new beats.
- Splice ELGOOG's Runway demo (`out/ep01/full-v3/runway/elgoog-demo-final.mp4`, runway.md §6) at tag frame 62.

**The picture:** `out/ep01/full-v3/picture/tag.mp4`, **992 frames, 41.33 s** (v3: 813, 33.88 s). Its temp audio is the v3.1 stick reel's tag chapter (`out/ep01/reel/ep01-v31-stick.mp4`, 1263.25 s + 41.33 s), cut to `out/ep01/full-v3/picture/tag-stick-mix.wav`. The episode frame in is 30246.

**What changed in the lock** (11 shots, 5 lines):

| Shot | Frames | v3.1 |
|---|---|---|
| 32.01 | 0–62 | 62 f (was 108). The rail `DEC 6, 2023` is here now, typed in the band. **The monitor lights on its own:** `kits/monitor-v31` `screenWake` 1, 2, 3 in held steps from k14, then from k26 `tag/art cardField`, the demo's bright first card, the same field as the insert's i0. The Orb's iris goes to it at k16. **Mas looks up at k50**, and the cut to the insert is 12 frames later, on his eyeline |
| **v31-32.01d** (new) | 62–295 | **The Runway insert**, 233 f; details below. "What the quack!" (the demo's voice, from the monitor) at i110; Mas's V.O. "those are stills." at i168 |
| 32.02 | 295–385 | unchanged (the rail moved to 32.01) |
| 32.03 | 385–476 | unchanged |
| 32.04 | 476–572 | unchanged, but **the frozen duck stays up on his monitor** (`tag/heldstill`, runway.md §6's continuity): the Orb re-scans the cover in front of the staged duck |
| 32.05 | 572–638 | **"that was close."** (v31-tg-0002, 66 f), replacing "close." Its mouth track is added by `coldopen/tools/mouths.py tag`, which now reads `audio/ep01/v31/tag/lines-v31.json` too |
| 32.07 | 638–722 | 84 f (was 102): the taps at k9 and k36; the walk back at k54–76 |
| 33.01–33.05 | 722–992 | unchanged; 33.01's monitor holds the duck too |

**The splice:**
- **Frames:** insert frame i is tag frame 62 + i.
  - **i0–216** (tag 62–278) are **browser frames**, declared on the segment (`browser.frames`: `DEMO_SPLICE`, 62–279). The renderer takes them whole from `GLYPH_DIR/pic/NNNNN.png`.
  - **i217–232** (tag 279–294), the insert's closing two-shot, are drawn by the layout: `drawDarkA3` with the held still on his monitor, Mas looking at it, the Orb's iris on it, then stepping to the rack (`DPLATE_LOOK.tray`) 6 frames before 32.02's whir (runway.md §6). It's the insert's own composition (`pxframes.ts`), drawn on the pipeline's clock.
- **The PNGs:**
  1. `insert.py --variants a --no-chip --png DIR --png-offset 62`, with `--out` pointed at scratch so the runway pass's files are untouched. The 233 PNGs match the final MP4 to within 1.2–2.8 of 255 (mean absolute difference, the MP4's encode).
  2. Then **`tag/tools/splice.ts`** lays the host's layer over them. The Node renderer splices a browser frame as it is, so the V.O. line has to be in the PNG.
     - It renders each splice frame with the insert's layout swapped for a key colour, which leaves only the band and the V.O. line.
     - It lays that over the PNG at 4x, and gives the V.O. glyphs a 1-px N0 outline so they read on the pale still (runway.md §6).
     - Result: 41 frames carry "those are stills." (tag 232–272) and 176 are unchanged. The band was already identical in all 217.
- **The layout's own drawing for i0–216** is a pixel fallback, for stills, contact sheets and the Remotion host, which has no `tag/browser.tsx`: the monitor kit's `[OTS]` with the card, then `[POV]` and `[OTS]` with the held still. **The contact sheet shows that fallback for the insert, not the film.**
- **New files:**
  - `tag/heldstill.ts`: the runway pass's `painter/held-still-2s-96x60.png`, transcribed to data so the layouts stay pure;
  - `tag/tools/splice.ts`;
  - `tag/art.ts` `cardField`.

**Measured:**
- **Joins,** decoded from the MP4 and looked at:
  - 61 → 62: the two-shot with the lit card and Mas looking up → the insert's `[OTS]` on the same field;
  - 278 → 279: the insert's `[OTS]` on the held still → the layout's two-shot, which matches the insert's own i217 frame;
  - 294 → 295: the Orb on the rack → 32.02's slot.
- **Flashes:** **0 in any second**, red 0.
  - The transitions: the push brightening (72), the pull-back darkening (265–271), the cut to the slot (295), the page (776–780) and the black (960).
  - The largest mean-luminance step is 0.32 at 878 (the page → 33.04), as in v3.
- **The render:** 992 frames in 15 s, **217 browser frames spliced, 0 missing**, no stand-ins, no failed layouts. Video and audio are both 41.333 s.
- **Checks:** `check` has 0 stand-ins and 0 problems. `tsc` (scoped) is clean.

**Re-running the splice** (heavy; the PNGs are about 90 MB and were deleted from scratch after the render):

```sh
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/insert.py --scratch $S/rw --out $S/rw-out \
    --variants a --no-chip --png $S/glyph --png-offset 62
cd studio
node src/episodes/ep01/pixel/tools/build.mjs tag $S/r-tag.cjs && node $S/r-tag.cjs check
node src/episodes/ep01/pixel/tools/build.mjs --entry src/episodes/ep01/pixel/tag/tools/splice.ts $S/splice.cjs
bash ../ops/heavy.sh node $S/splice.cjs $S/glyph $S/glyph-tag
GLYPH_DIR=$S/glyph-tag SEGDIR=$S/seg X264_THREADS=1 bash ../ops/heavy.sh node $S/r-tag.cjs picture --jobs 2
```

- **The lock:** `lock.py --seg tag --timeline show/reel/ep01-v31/ep01-v31-tag.json --takes studio/src/episodes/ep01/pixel/tag/takes-mouth.json --mix out/ep01/full-v3/picture/tag-stick-mix.wav --mix-offset 0 --ep-in 30246`.
- **Always pass `--out` to insert.py:** its default is the runway pass's folder.

**For other passes:**
- **The sound pass:** the final v3.1 tag mix needs to be 992 frames. The demo's cues are runway.md §7 (i-frames = tag frame − 62).
- **The EL tag:** it needs the same splice on its own lock; I didn't make it. The EL v3.1 timeline (`show/reel/ep01-v31-el/ep01-v31-el-tag.json`) also has 32.01 at 62 f and the insert at 233 f, with the demo's line and the V.O. at the same times (4.6 s and 7.0 s). So the same PNGs splice at the same frames. Run `splice.ts` on a bundle built on the EL lock (the assembly pass's `build_el.mjs` redirect) so the V.O. is baked in on the EL clock.

**What's weakest (v3.1):**
- The V.O. "those are stills." is pixel type over near-photoreal footage for 31 frames. The outline makes it legible, but it's a mix of media inside one frame.
- The review render and the Remotion host show the pixel fallback for the insert, not the film, because there's no `tag/browser.tsx`.
- 32.01's card field is a bright rectangle in the dark two-shot for 36 frames.

---

**The files:**

| What | Where |
|---|---|
| **The layouts** | `studio/src/episodes/ep01/pixel/tag/shots.ts` (10 layouts, one per shot) |
| **This segment's small drawings** (new, additive) | `studio/src/episodes/ep01/pixel/tag/art.ts` |
| The lock | `studio/src/episodes/ep01/pixel/tag/data.ts` and `full-v3/lock/tag.json` (generated) |
| **Takes with mouth tracks** | `studio/src/episodes/ep01/pixel/tag/takes-mouth.json` (from `coldopen/tools/mouths.py tag`) |
| **The picture** | `out/ep01/full-v3/picture/tag.mp4`: 1920×1080, 24 fps, 813 frames, 33.88 s, with the stick mix as AAC temp audio. `.srt` and `.mp4.render.json` sit beside it |
| **The contact sheet** | `out/ep01/full-v3/picture/tag-sheet.png` |
| The temp track | `out/ep01/full-v3/picture/tag-stick-mix.wav`: frames 29,874–30,687 of the stick reel's mix (the tag's chapter; the outro starts at 30,687) |

---

## 1. The shots

Frame numbers are segment frames; the episode time of frame 0 is 20:41:18. There are **no stand-ins**.

| Shot | Frames | Length | Framing | Built from | What moves |
|---|---|---|---|---|---|
| 32.01 | 0–108 | 4.50 s | **the arrival**: the dark room's plate, Mas and the Orb at the desk | `rooms/darkroom-act3` `drawDarkA3` (`tally: 3`, `kits/mas-monitor` `screenDim`) | Mas's thumb on the third mark, head down; at k 50 he looks up to the dim monitor. The Orb's iris goes marks → him → the rack, 6 f before the whir. The Orb bobs and the LEDs blink |
| 32.02 | 108–198 | 3.75 s | insert: the rack's slot | `drawSlotECU` + `kits/emit-cover` | on the whir mark the cover comes down in three held steps (headline first, masthead last), then holds to read; the LEDs blink; the rail `DEC 6, 2023` types in the band |
| 32.03 | 198–289 | 3.79 s | MCU: Mas and the cover | `drawCoverMCU` | the two faces are the same, both to the lens, under the V.O. "it looks calmer than me."; 10 f after the line his eyes go to the cover, once. The V.O. types over his dark hoodie and the fallen-away room (rows 182–203 are clear) |
| 32.04 | 289–385 | 4.00 s | 2S: the scan, twice | `drawDarkA3` + `kits/orb-toast` | the fan sweeps his face in four held steps on the 1st sweep mark, and `verified: human` pops over him on the 1st blink. On the 2nd sweep it re-sweeps the cover in his hand, there and back twice, under a working toast beside the cover, `re-scanning…`. The cover's own `verified: human` lands on the 2nd blink. Mas watches the Orb |
| 32.05 | 385–441 | 2.33 s | MCU·PF: profile, to the cover | `tag/art` `drawCoverProfile` | "close." (mouth from the take), turned to the cover at frame left, not to the Orb |
| 32.07 | 441–543 | 4.25 s | wide: the back wall | `drawBackWall` + `cast/mas-stand` + `tag/art` `drawWallOrb` | he pins the cover on the 1st tap and hangs the GUEST frame on the 2nd. 18 f later he walks back toward the desk (44 px, on 2s, the walk cycle), so the wall reads clear. The Orb beside him watches the wall, then drifts after him |
| 33.01 | 543–597 | 2.25 s | the thud, on the two-shot plate | `drawDarkA3` + `kits/grey-lady` `drawPaperPlate` | the paper falls in three held steps and lands on the thud mark: the room layer shakes 2 px over 5 frames (the band doesn't), the Orb hops a pixel, the paper's dust. The Orb looks down at it, then Mas does |
| 33.02 | 597–699 | 4.25 s | HIGH: his eyeline, full-bleed | `kits/grey-lady` `drawFrontPageHigh` | THE GREY LADY's plain serif masthead, the columns and the clerk's stamp, held to read from the cut; the page settles 1 px on each of the two paper-curl marks |
| 33.04 | 699–783 | 3.50 s | MCU·PF: profile and the glass | `drawProfileGlass` (its resting hand painted out: `tag/art` `eraseProfileHand`) | "noted." (mouth from the take), then the chord with no third held on his face; the water line is one flat row |
| 33.05 | 783–813 | 1.25 s | black | the whole frame black (no band rule) | the vault's hum rings on into the outro |

- **The arrival:** 32.01 is the tag's arrival, the whole shot. The dark room is the home room, so it opens on its plate with both of them in it (pov-and-framing §4.3.2); the script's `[2S]`.
- **No blinks for Mas** (§3.6). The room carries the life: the Orb's bob, the rack's LEDs, the dim monitor.
- **Marks:** `tape_start`, both `orb_scan_sweep`s, both `glyph_blink`s, both key taps, `synth:thud`, both `paper_curl`s, and the V.O.'s end. All of them resolve.
- **No lit-UI band:** v3's C12 cut the glass prompt.

## 2. Art: reused and new

- **Reused (v3-art-b, [art-b.md §1.6](art/art-b.md)):**
  - `rooms/darkroom-act3.ts` (`drawDarkA3`, `drawSlotECU`, `drawCoverMCU`, `drawBackWall`, `drawProfileGlass`)
  - `rooms/darkroom-plate.ts`, `rooms/darkroom.ts`
  - `kits/emit-cover.ts`, `kits/orb-toast.ts`, `kits/grey-lady.ts`, `kits/mas-monitor.ts`
  - `cast/mas-medium.ts`, `cast/mas.ts`, `cast/mas-stand.ts`, `cast/orb-medium.ts`
- **New, in `tag/art.ts`, all additive:**
  - `drawCoverProfile` (32.05): the tag's profile set-up (drawProfileGlass's fallen-away room, his portrait right of centre turned to camera-left) with the cover held at frame left. So "close." and "noted." play in one set-up and rhyme. Its hand is darkroom-act3's fingertips drawing, re-set here because it isn't exported; I set it below the cover's `CEO OF THE YEAR` line.
  - `eraseProfileHand` (33.04): drawProfileGlass's resting hand is an oval that read as a pale block beside the glass. It's painted out with the same fallen-away room, so the frame is his face and the glass.
  - `drawWallOrb` (32.07): the Orb beside him at the wall. `drawBackWall` puts it at the desk.
- **Changed from the lock or the script:**
  - **The cover's working toast reads `re-scanning…`** (the script), not the lock's `re-scanning the cover…`. The stick stacked both toasts and needed the words. The picture puts each toast by its own face, as the stick's cue asks.
  - **The stamp (33.02) is on the page from the cut:** the lock logged the stamp at 87 f against its 102 f read floor, and this gives it the whole 102 f.
  - **Only the Orb hops at the thud** (33.01). The phone and keyboard hops in the script aren't separate drawings in the plate, so the room shakes as a whole.
  - **No GLYPH tokens in the scan cone** (32.04): the fan is the pixel drawing only. Adding them needs a layer from the fan's mask and the Remotion GLYPH pass.

## 3. Checks

| Check | Result |
|---|---|
| `lock.py` | all checks ok: 10 shots from 10 beats, 813 f, 3 of 3 lines placed, 2 mouth tracks, the mix 813 f = 0 + 813. Logged: 32.03's beat isn't a whole number of frames; the 33.02 stamp's read floor (addressed above) |
| `node $S/r-tag.cjs check` | **0 stand-ins, 0 problems**, 0 GLYPH frames, the track 813 f |
| `tsc` (scoped, with the cold open) | no errors |
| **Flashes** (`coldopen/tools/flashcheck.py`) | **0 flashes in any second**, red 0. Three single transitions: the cut in to the front page (597, 601) and the cut to black (781). The largest mean-luminance step is 0.32 at 699, the cut from the page to 33.04. **Pass** |
| The render | 813 frames in 8 s (2 workers), no stand-ins, no failed layouts; the video and audio both 33.875 s |

## 4. Re-running

```sh
python3 studio/src/episodes/ep01/pixel/coldopen/tools/mouths.py tag             # tag/takes-mouth.json (only if a take changes)
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg tag --timeline show/reel/ep01-v3/ep01-v3-tag.json \
    --takes studio/src/episodes/ep01/pixel/tag/takes-mouth.json \
    --mix out/ep01/full-v3/picture/tag-stick-mix.wav --mix-offset 0 --ep-in 29802
cd studio
node src/episodes/ep01/pixel/tools/build.mjs tag $S/r-tag.cjs && node $S/r-tag.cjs check
node $S/r-tag.cjs contact ../out/ep01/full-v3/picture/tag-sheet.png native
SEGDIR=$S/seg X264_THREADS=1 bash ../ops/heavy.sh node $S/r-tag.cjs picture --jobs 2
cd .. && audio/.venv-casting/bin/python studio/src/episodes/ep01/pixel/coldopen/tools/flashcheck.py out/ep01/full-v3/picture/tag.mp4
```

`--ep-in 29802` is the tag's episode frame without the reel's 3 s slate: 1244.75 s − 3 s.

## 5. What's weakest

1. **32.04:** the cover in his hand is the 26×34 desk-scale cover, too small to read as the cover. The two fans (over his face, and over the cover) are only about 15° apart, so the second reads as "lower", not clearly "the cover". The toasts' placement carries most of the joke.
2. **32.02** holds a still cover for 3 s after it lands; only the LEDs move.
3. **The two profile singles (32.05, 33.04)** use his 3/4 portrait turned camera-left, not a true profile. The bust is cut at frame right over a lot of black.
4. **32.03:** art-b's fingertips sit on the edge of the cover's `CEO OF THE YEAR` line.
5. **33.01** is on the two-shot plate (the lock calls it WIDE), as art-b built it. Only the Orb hops.
6. **The walk in 32.07** is 22 frames of the stand rig's cycle. It hasn't been seen in motion.

> **V.O. mouth check (`v3-shots-act1`, 2026-09-27, for the lead):** the pipeline's `face` table draws a speaker's mouth on his V.O. lines too (found in Act One). The tag is clear of it: the V.O. "it looks calmer than me." plays on 32.03, whose layout passes no mouth and has no `face`; the `face: {MAS: 'lip'}` shots (32.05, 33.04) hear only his spoken lines. Measured on 32.03's frames under the V.O.: only the cover's region changes, never his face. No change to `tag/shots.ts`; `tag.mp4` not re-rendered. (The cold open has no V.O. lines.)
