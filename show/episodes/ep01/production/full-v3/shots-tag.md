# Ep1 v3: the tag's pixel shots (`v3-shots-coldopen-tag`, 2026-09-27)

> **Status: built, checked and rendered.** This is track P2 of [PLAN.md](PLAN.md) for the `tag` segment. The cold open's record is [shots-coldopen.md](shots-coldopen.md), which also holds the shared tools.
>
> **The tag ends on its own last frame:** black on the vault's hum (33.05). The Orb outro follows as a separate chapter and isn't in this render.
>
> **Nothing here was watched or heard.** I looked at the contact sheet, at native stills of every shot at 2x, and at three frames decoded from the MP4. The flash numbers are measured.
>
> Nothing was committed.

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
