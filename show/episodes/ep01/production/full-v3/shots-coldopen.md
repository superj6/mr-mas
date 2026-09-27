# Ep1 v3: the cold open's pixel shots (`v3-shots-coldopen-tag`, 2026-09-27)

> **Status: built, checked and rendered.** This is track P2 of [PLAN.md](PLAN.md) for the `coldopen` segment. The tag's record is [shots-tag.md](shots-tag.md).
>
> **Nothing here was watched or heard.** I looked at the contact sheet, at native stills of every shot (at 2x, with crops at 4x of the mouths, the iris steps and the 1993 icon), and at six frames decoded from the rendered MP4s. The flash numbers are measured. Whether the cuts play needs a person.
>
> Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The layouts** | `studio/src/episodes/ep01/pixel/coldopen/shots.ts` (11 layouts, one per shot) |
| **This segment's small drawings** (new, additive) | `studio/src/episodes/ep01/pixel/coldopen/art.ts` |
| The lock | `studio/src/episodes/ep01/pixel/coldopen/data.ts` and `full-v3/lock/coldopen.json` (generated) |
| **Takes with mouth tracks** | `studio/src/episodes/ep01/pixel/coldopen/takes-mouth.json`, written by `coldopen/tools/mouths.py` (the tag's is beside its own shots) |
| The flash measurement | `studio/src/episodes/ep01/pixel/coldopen/tools/flashcheck.py` |
| **The picture** | `out/ep01/full-v3/picture/coldopen.mp4`: 1920×1080, 24 fps, 736 frames, 30.67 s, H.264, with the stick mix as AAC temp audio. `.srt` and `.mp4.render.json` sit beside it |
| **The contact sheet** | `out/ep01/full-v3/picture/coldopen-sheet.png` (one still per shot, at 1x) |
| The temp track | `out/ep01/full-v3/picture/coldopen-stick-mix.wav`: frames 72–808 of the stick reel's mix (`studio/out/reel-work/ep01-v3-stick/mix.wav`), cut sample-exact |

---

## 1. The shots

Frame numbers are segment frames. Every shot has a real layout, and there are **no stand-ins**.

| Shot | Frames | Length | Framing | Built from | What moves |
|---|---|---|---|---|---|
| 1.00 | 0–12 | 0.50 s | black | the whole frame black (no band rule) | the hall is heard first (the bed) |
| 1.01 | 12–114 | 4.25 s | **the arrival wide** | `rooms/apec-stage` `drawApecWide` | a slow drift upstage (1 px every 8 f, to 12 px); the host's card lifts 2 f before the question; the Orb bobs; the rail types in the band |
| 1.02 | 114–248 | 5.58 s | MCU | `drawApecMCU` | Mas's mouth from the take, eyes on the host; the hailstone leaves the far window as he starts and arcs up across the soft window on 2s, out of the top before the cut |
| 1.03 | 248–285 | 1.54 s | insert (the table from above) | `drawApecTable` + `coldopen/art` `tableStone`, `hostSpill` | the stone falls in (2 held drawings) and lands on the plink mark, then bobs; the host's glass sloshes 1–2–3 on the slosh mark and settles, keeping its spill; the tent card reads |
| 1.04 | 285–349 | 2.67 s | MCU (1.02's set-up) | `drawApecMCU` | "…discovery forward…"; 3 f after the last word the far window's phone clicks off, and 9 f later the banquet rises |
| 2.01 | 349–364 | 0.63 s | wide, frozen | `drawApecWide` + `apecFreeze` | a 3-frame flash on the cut; the room is navy and cream, and Mas and his phone stay in colour |
| 2.02 | 364–424 | 2.50 s | insert (the phone) | `kits/phone-invite` + `coldopen/art` `buzzPhone`, `freezeOutside` | the screen wakes on the buzz; the phone jumps 1 px while it buzzes; the invite slides down in three held steps, then holds to read; the table round it stays frozen |
| 2.03 | 424–484 | 2.50 s | MCU, frozen round him | `drawApecMCU` + `freezeOutside` / `mcuLive` | he reads (lids low, the invite's white on his jaw), looks up 8 f before "noted.", mouth from the take; on the tap mark the light on his jaw steps to the calendar's pale blue |
| 3.01 | 484–532 | 2.00 s | 2S, back in colour | `drawApec2S` + `kits/rewind-toast` | the Orb's iris steps phone → between → Mas on the 2nd and 3rd servo marks; the toast pops on the blink with the year slot at 2023 |
| 3.02 | 532–604 | 3.00 s | wide, scrubbing | `drawApecWide` run backward + `apecScrub` | the Orb bobs backward; it catches on 2022 on the 1st servo (a 1-px judder, the room one light step up) and holds; on the 2nd servo it slips (the ovation sits, the card lowers, the host's water climbs home, the stone flies out of his glass and back to the far window, whose phone lights again) and steps down to paper white; the counter rolls 2023 → 2001 (`yearAt`) |
| 4.01 (+ 4.02) | 604–736 | 5.50 s | the whole frame, 1-bit | `coldopen/art` `draw1993`: the intro's pillarbox, zoom rects and alert (`dev/meras/era1993.ts`), and the shared era stamp | the 1993 stamp's rule grows; the alert opens in two zoom-rect frames; `Are you sure?` with OK the default and Cancel greyed; the alert's 1-bit Orb icon looks at us, at OK (k 44), back at us (k 76), then down at the toast; the 1-bit toast `rewinding… too far` pops on the blink (k 98) |

- **Arrival:** 1.01 is the series' first frame, a wide on the room with its people: Mas, the Orb and the host's hand.
- **Holds breathe without blinks:** adult Mas never blinks ([pov-and-framing §3.6](../../../../bible/pov-and-framing.md)). His life on camera is his mouth, his eyes and the light on him. The room supplies the rest: the Orb's bob, the drift, the stone's glyph noise turning on 6s, the spinner in the invite.
- **Mouths:** Mas's MCU lines are faced `lip`. The host is a hand and a PA voice, so no mouth.
- **Marks:** every story sound is a mark anchored on the lock: `synth:plink`, `synth:slosh`, `synth:buzz`, `key_tap_soft_03`, the three `orb_servo`s, `glyph_blink`, `glyph_blink@1bit`, the host line's onset, and the word "forward". Every mark resolves (`check`).

## 2. Art: reused and new

- **Reused (v3-art-a, [art-a.md §1.1](art/art-a.md)):** `rooms/apec-stage.ts` (the wide, the MCU, the table, the 2S, the freeze, the scrub), `kits/phone-invite.ts`, `kits/rewind-toast.ts` (both toasts), `cast/mas-seated.ts`, `cast/mas-collars.ts`.
- **Reused (the intro, as the lead asked):** `dev/meras/era1993.ts` supplies the 1993 alert (`drawDialog`: the modal frame, the dithered title bar, the rounded buttons, Cancel greyed, OK's default ring), its `zoomRects`, and its pillarbox `PB`. `cast/era.ts` supplies the 1993 stamp exactly as the intro sets it. They're imported, not copied. The shipped intro is built from these same files. (art-a's `kits/dialog-1993.ts` is a simplified re-draw, and isn't used.)
- **New, in `coldopen/art.ts`, all additive:**
  - `tableStone`: the stone in his glass **without the ring** that `drawApecTable`'s plink draws. "A ring in the water" is Ep12's reserved tell (§3.6), and the script says his water line doesn't move. It uses the art's own stone drawing and bob steps.
  - `hostSpill`: the spill kept after the slosh settles.
  - `freezeOutside`, `mcuLive`, `phoneLive`: the 2-TONE freeze for the MCU and the insert, which the art only has for the wide.
  - `buzzPhone`.
  - `draw1993`, with a copy of the intro's 32×32 1-bit Orb icon (it isn't exported) that adds an iris offset.
- **Not drawn, or changed from the script:**
  - **The sip after "noted."** (2.03): the MCU has no glass drawing, and 16 f is too short for one.
  - **The 1993 date card sits bottom-left, not top-left:** it's the intro's own stamp in its own corner, the same as every era stamp.
  - **4.01 fills the whole 480×270 frame:** it takes the intro's 3:2 pillarbox of the full frame, not a pillarbox inside the room area. That makes it the intro's 1993 look, one smash cut before the intro.
  - **The alert's title bar is left untitled:** the intro's reads `age 8`, and nobody is in this one.

## 3. Checks

| Check | Result |
|---|---|
| `lock.py` (with `takes-mouth.json` and the cut mix) | all checks ok: 11 shots from 12 beats, 736 f, 3 of 3 lines placed, 2 mouth tracks, the mix 736 f = 0 + 736 |
| `node $S/r-co.cjs check` | **0 stand-ins, 0 problems**, 0 GLYPH frames, the track 736 f |
| `tsc` over `coldopen/shots.ts` and `tag/shots.ts` and everything they import (a scratch tsconfig extending `studio/tsconfig.json`) | no errors |
| **Flashes** (`flashcheck.py`: WCAG-style general and red flash, 25 % area, any 1 s window) | **max 1 flash in any second** (the freeze's cut flash, frames 349–352); red flashes 0. Largest single-frame step of the mean luminance: 0.21, at 349. **Pass** (the limit is 3) |
| The render | 736 frames in 7 s (2 workers, 15.8 ms a frame per worker), no stand-ins, no failed layouts; the video and audio both 30.67 s |

## 4. Re-running

From the repo root; `S` is a scratch folder.

```sh
python3 studio/src/episodes/ep01/pixel/coldopen/tools/mouths.py coldopen        # takes-mouth.json (only if a take changes)
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg coldopen --timeline show/reel/ep01-v3/ep01-v3-coldopen.json \
    --takes studio/src/episodes/ep01/pixel/coldopen/takes-mouth.json \
    --mix out/ep01/full-v3/picture/coldopen-stick-mix.wav --mix-offset 0 --ep-in 0
cd studio
node src/episodes/ep01/pixel/tools/build.mjs coldopen $S/r-co.cjs && node $S/r-co.cjs check
node $S/r-co.cjs contact ../out/ep01/full-v3/picture/coldopen-sheet.png native
SEGDIR=$S/seg X264_THREADS=1 bash ../ops/heavy.sh node $S/r-co.cjs picture --jobs 2
cd .. && audio/.venv-casting/bin/python studio/src/episodes/ep01/pixel/coldopen/tools/flashcheck.py out/ep01/full-v3/picture/coldopen.mp4
```

- **The temp mix:** the cut mix is frames 72–808 of the stick reel's `mix.wav` (48 kHz, 2,000 samples a frame). If the reel is re-mixed, cut it again the same way.
- **Why a scratch path won't do:** the lock stores the mix path relative to the repo.
- **Why the takes file is derived:** the cold open's fastrec takes have `mouth: []`. With them the lock gives no mouth track, and without them it loses the takes' PA/O.S. modes. `mouths.py` adds tracks with the house method (a4lib `mouth_cues`: the takes' own word spans and misaki phonemes, gated by the WAV's envelope), re-implemented without torch. It touches no audio or takes file.

## 5. What's weakest

1. **1.01, the one wide:**
   - Mas is small: the seated sprite is 66 px tall. That's art-a's scale.
   - The "drift upstage" is the art's 12-px truck: the plate slides left, not in toward the window.
   - Whether the lit window reads at 4 px needs an eye.
2. **3.02, the scrub:** most of what it says rides on the light steps and the counter. The backward motions (the card, the crowd, the host's water, the stone) are small in the wide.
3. **2.02:** the frozen table round the phone prints as a busy cream dither. It's a lot of texture for a 2.5 s read.
4. **3.01:** the medium Mas sits low in the frame, and the iris steps are small at r 11.
5. **4.01** holds a still alert for 4.2 s. The only life is the stamp's rule, the iris's looks and the toast; MM-06 is meant to carry it.
6. **Lip-sync** comes from the takes' word and phoneme timing through `mouths.py`. It hasn't been watched against the sound.
