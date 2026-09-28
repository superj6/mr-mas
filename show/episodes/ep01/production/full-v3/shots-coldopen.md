# Ep1 v3: the cold open's pixel shots (`v3-shots-coldopen-tag`, 2026-09-27)

> **Status: final on the v3.1 lock (the v3.1 section below); re-cut, re-locked and re-rendered (§0), 2026-09-27.** This is track P2 of [PLAN.md](PLAN.md) for the `coldopen` segment. The tag's record is [shots-tag.md](shots-tag.md).
>
> **Nothing here was watched or heard.** I looked at the contact sheet, at native stills of every shot (at 2x, with crops at 4x of the mouths and the iris steps), at frames decoded from the rendered MP4s, and at the last 3 s against the intro's frame 0. The flash and join numbers are measured. Whether the cuts play needs a person.
>
> Nothing was committed.

## v3.1 (the final lock, 2026-09-27)

- **The check:** the cold open's v3.1 timeline (`show/reel/ep01-v31/ep01-v31-coldopen.json`) has the same timing as the 640-frame v3 one in every beat: lengths, lines, words, onscreen items, sounds, fx and cast. The only changes are the music cue strings, and 1.02's line text without its quotation marks (spoken lines lose them in v3.1).
- **What I re-ran:**
  - I re-locked on the v3.1 timeline. Only the lines' text changed in the lock, which affects the `.srt`.
  - I re-rendered, now muxed with the sound pass's v3.1 mix, `out/ep01/full-v3/mix-v31/coldopen-mix.wav` (640 f).
- **Identical picture:** the new `picture/coldopen.mp4`'s H.264 stream is identical to the v3 640-frame render (md5 `1948fa16…`), and sampled frames are identical.

## 0. The re-cut: the cold open ends on the rewind (the lead's ruling, 2026-09-27)

**The note.** The showrunner watched the v3 film: "i think the cold open to intro is not very good transition."

**The lead's diagnosis:** the cold open ended on its own 1993 alert (pillarboxed, with `rewinding… too far`). Then the intro cut to the present-day dark room and showed 1993 again five seconds later, with its own kid and alert. That's two 1993s, a jump back to the present between them, and two different 1993 looks.

**What changed:**

- **The timelines** (both, the same edit, by `studio/src/episodes/ep01/pixel/coldopen/tools/cut_1993.py`, logged in each file's `_v3_edits`):
  - **Beats 4.01 and 4.02 are cut** (sc 4, F1.1 · 1993, 5.5 s).
  - **3.02 runs 3.0 → 4.5 s:**
    - `rewinding…` ends at 3.0 s, and `rewinding… too far` shows from 3.0 to 4.17 s;
    - a `glyph_blink` is added at 3.0 s;
    - fx `rewind, smear, collapse`;
    - the frame, caption and cues are rewritten, including a sound cue for the whirr.
  - The headers go to `sc 1-3`, `Nov 16, 2023`, 26.667 s (Kokoro) and 26.027 s (EL).
  - The files: `show/reel/ep01-v3/ep01-v3-coldopen.json` and `show/reel/ep01-v3-el/ep01-v3-el-coldopen.json`.
- **3.02's new end, frame by frame** (shot frames; the ending is the same in both):

  | k | What |
  |---|---|
  | 0–37 | as before: the catch on 2022 and the slip |
  | 37– | it washes up to its second light step and stays there. It no longer goes to paper white, since there's no 1993 frame to match |
  | 72 | **the blink:** the toast re-pops as `rewinding… too far`. Its year wheels run on, a year every 2 frames from 2001 to 1994, then the ones wheel creeps toward 3 in held steps. It never settles on camera, and the intro's 1993 shows where it went |
  | 94–99 | **the smear:** the room slides left, toward the cursor's side, 4 → 92 px, streaked with Act Four's whip smear |
  | 100–105 | **the collapse:** the picture's window closes on the cursor's rectangle in three held steps of 2 f. It's a crop, nothing scaled: the room inside goes a rung darker a step, with a C5 edge, and the whole frame outside goes black (the band too) |
  | 106–107 | **the intro's first frame:** its cyan cursor on black, drawn from the intro's own frame 0 (4 × 9 glyph cells in L3 and C5, native x 83–114, y 39–118) |

- **The cold open's new length:**
  - **Kokoro:** 736 → **640 frames = 26.67 s**.
  - **EL:** 721 → **625 frames = 26.04 s**.
  - Both are −96 f (−4.0 s): −5.5 s for the 1993 beats, +1.5 s for the new end of the rewind.
- **The code:**
  - `coldopen/shots.ts`: the 4.01 layout is gone, and 3.02 is rewritten.
  - `coldopen/art.ts`: `draw1993` and its import of the intro's `dev/meras` code are gone. `drawIntroCursor`, `smearRoom` and `collapseFrame` are new.
- **Re-locked and re-rendered:**
  - **Kokoro:** the lock, `picture/coldopen.mp4`, and the contact sheet.
  - **EL:** the lock, re-locked the assembly pass's way (`lock.py` on the EL timeline with `assembly/el/coldopen-takes.json`, `--out-json/--out-ts assembly/el/`), and `picture-el/coldopen.mp4` (`assembly/tools/build_el.mjs`).
  - **One flag differs from the assembly pass's EL lock: no `--mix`.** The final EL mix is still 721 f.

**Measured at the join** (the last frame against `out/intro/intro-ep1-V1-1080p.mp4` frame 0, at 1080p):
- **Mean absolute difference:** 6.6 of 255 inside the cursor's box and 4.0 outside it. What's left is the intro's dim glyph grid, which the cold open's black doesn't have.
- **Mean pixel value:** 6.5 (cold open) against 9.5 (intro).
- **The cursor lands where the intro's is, pixel for pixel.**

**Flashes:** at most 1 in any second in both renders. The new ending is one brighten (the smear) and one darken (the collapse), about 0.3 s apart.

**Left for other passes (not done here):**
- **The sound pass: new cold-open mixes are needed.** `out/ep01/full-v3/mix/coldopen-mix.wav` (736 f) and `mix-el/coldopen-mix.wav` (721 f) are the old length, with MM-06's 1993 chip notes after 3.02's third second.
  - The new ending wants the rewind whirr accelerating from the slip (k 37) through the smear into the collapse, cut on the last frame (Kokoro 26.67 s, EL 26.04 s), so the intro's first beat takes over.
  - It also wants `glyph_blink` on "too far" (3.02 + 3.0 s: Kokoro 25.17 s, EL 24.54 s).
  - The renders carry temp audio for now: the old mixes cut to the new length. Their last 1.5 s is the old 1993 audio.
- **The assembly:**
  - `picture-el/coldopen.mp4` carries the old EL final mix, cut, until the new one lands.
  - `assembly/tools/el_lock.sh`'s `--ep-in` table is 96 f early for every later segment (act1 1489 → 1393, and so on), in the EL film.
  - The films' chapters after the cold open move up 4.0 s.
- **Stale until re-run:**
  - the stick reel (`out/ep01/reel/ep01-v3-stick.mp4`) and its `studio/src/reel/data/ep01-v3{,-el}-coldopen.json` mirrors (`episode.mjs` rewrites them);
  - the beat plan `beat-plan/coldopen.json`, which still keeps 4.01 and 4.02. Re-running `build_timeline.py` would bring them back until the plan marks them `cut`.

---

**The files:**

| What | Where |
|---|---|
| **The layouts** | `studio/src/episodes/ep01/pixel/coldopen/shots.ts` (10 layouts, one per shot) |
| **This segment's small drawings** (new, additive) | `studio/src/episodes/ep01/pixel/coldopen/art.ts` |
| The lock | `studio/src/episodes/ep01/pixel/coldopen/data.ts` and `full-v3/lock/coldopen.json` (generated) |
| **Takes with mouth tracks** | `studio/src/episodes/ep01/pixel/coldopen/takes-mouth.json`, written by `coldopen/tools/mouths.py` (the tag's is beside its own shots) |
| The flash measurement | `studio/src/episodes/ep01/pixel/coldopen/tools/flashcheck.py` |
| **The picture** | `out/ep01/full-v3/picture/coldopen.mp4`: 1920×1080, 24 fps, **640 frames, 26.67 s**, H.264, with the stick mix as AAC temp audio. `.srt` and `.mp4.render.json` sit beside it. The EL picture is `out/ep01/full-v3/picture-el/coldopen.mp4`: 625 frames, 26.04 s |
| **The contact sheet** | `out/ep01/full-v3/picture/coldopen-sheet.png` (one still per shot, at 1x) |
| The temp track | `out/ep01/full-v3/picture/coldopen-stick-mix.wav`: frames 72–712 of the stick reel's mix (`studio/out/reel-work/ep01-v3-stick/mix.wav`, since deleted by the assembly pass), cut sample-exact |

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
| 3.02 | 532–640 | 4.50 s | wide, scrubbing, then the collapse | `drawApecWide` run backward + `apecScrub` + `coldopen/art` `smearRoom`, `collapseFrame`, `drawIntroCursor` | the Orb bobs backward. It catches on 2022 on the 1st servo (a 1-px judder, the room a light step up) and holds. On the 2nd servo it slips: the ovation sits, the card lowers, the host's water climbs home, the stone flies out of his glass and back to the far window, whose phone lights again, and the room washes up a second light step. The counter rolls 2023 → 2001 (`yearAt`). On the blink (k 72) the toast turns to `rewinding… too far` while the wheels spin on toward the nineties. The smear (k 94–99), the collapse into the cursor (k 100–105), then the intro's first frame (k 106–107). See §0 |

- **Arrival:** 1.01 is the series' first frame, a wide on the room with its people: Mas, the Orb and the host's hand.
- **Holds breathe without blinks:** adult Mas never blinks ([pov-and-framing §3.6](../../../../bible/pov-and-framing.md)). His life on camera is his mouth, his eyes and the light on him. The room supplies the rest: the Orb's bob, the drift, the stone's glyph noise turning on 6s, the spinner in the invite.
- **Mouths:** Mas's MCU lines are faced `lip`. The host is a hand and a PA voice, so no mouth.
- **Marks:** every story sound is a mark anchored on the lock: `synth:plink`, `synth:slosh`, `synth:buzz`, `key_tap_soft_03`, the three `orb_servo`s, both `glyph_blink`s, the end of `rewinding… too far` (the collapse), the host line's onset, and the word "forward". Every mark resolves (`check`).

## 2. Art: reused and new

- **Reused (v3-art-a, [art-a.md §1.1](art/art-a.md)):** `rooms/apec-stage.ts` (the wide, the MCU, the table, the 2S, the freeze, the scrub), `kits/phone-invite.ts`, `kits/rewind-toast.ts` (both toasts), `cast/mas-seated.ts`, `cast/mas-collars.ts`.
- **Reused from the intro:** its first frame's cursor, drawn from the intro's own frame 0 (§0). (The first cut reused the intro's 1993 alert from `dev/meras/era1993.ts`. That beat is gone, and so is the import.)
- **New, in `coldopen/art.ts`, all additive:**
  - `tableStone`: the stone in his glass **without the ring** that `drawApecTable`'s plink draws. "A ring in the water" is Ep12's reserved tell (§3.6), and the script says his water line doesn't move. It uses the art's own stone drawing and bob steps.
  - `hostSpill`: the spill kept after the slosh settles.
  - `freezeOutside`, `mcuLive`, `phoneLive`: the 2-TONE freeze for the MCU and the insert, which the art only has for the wide.
  - `buzzPhone`.
  - `smearRoom`, `collapseFrame`, `drawIntroCursor`: 3.02's end (§0).
- **Not drawn, or changed from the script:**
  - **The sip after "noted."** (2.03): the MCU has no glass drawing, and 16 f is too short for one.
  - **sc 4 (F1.1 · 1993) is cut** by the lead's ruling (§0). The script (draft 6) still has it. The script pass should move "too far" into sc 3 and drop sc 4.

## 3. Checks

| Check | Result |
|---|---|
| `lock.py` (with `takes-mouth.json` and the cut mix) | all checks ok: **10 shots from 10 beats, 640 f**, 3 of 3 lines placed, 2 mouth tracks, the mix 640 f = 0 + 640 (EL: 625 f, every check ok) |
| `node $S/r-co.cjs check` (and the EL renderer's) | **0 stand-ins, 0 problems**, 0 GLYPH frames, the track 640 f (EL 625) |
| `tsc` over `coldopen/shots.ts` and `tag/shots.ts` and everything they import (a scratch tsconfig extending `studio/tsconfig.json`) | no errors |
| **Flashes** (`flashcheck.py`: WCAG-style general and red flash, 25 % area, any 1 s window) | **max 1 flash in any second**, in both renders: the freeze's cut flash (frames 349–352), and the smear then collapse (627–634); red flashes 0. Largest single-frame step of the mean luminance: 0.21, at 349. **Pass** (the limit is 3) |
| The join with the intro | see §0: the cursor lands where the intro's is |
| The render | 640 frames in 7 s (2 workers); EL 625 frames in 6 s. No stand-ins, no failed layouts. Kokoro video 26.667 s / audio 26.666 s; EL 26.042 s / 26.041 s |

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

# the EL picture (the assembly pass's way; no --mix in the lock until the sound pass's new EL mix is 625 f)
A=show/episodes/ep01/production/full-v3/assembly
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg coldopen --timeline show/reel/ep01-v3-el/ep01-v3-el-coldopen.json \
    --takes $A/el/coldopen-takes.json --mix-offset 0 --ep-in 0 --label 'COLD OPEN' --out-json $A/el/lock-coldopen.json --out-ts $A/el/data-coldopen.ts
cd studio && node ../$A/tools/build_el.mjs coldopen $S/r-co-el.cjs
SEGDIR=$S/seg X264_THREADS=1 bash ../ops/heavy.sh node $S/r-co-el.cjs picture ../out/ep01/full-v3/picture-el/coldopen.mp4 --jobs 2 --mix <the EL mix> --mix-offset 0
```

- **The temp mix:** the cut mix is frames 72–712 of the stick reel's `mix.wav` (48 kHz, 2,000 samples a frame). When the sound pass's new `mix/coldopen-mix.wav` (640 f) lands, lock and render with it instead.
- **Why a scratch path won't do:** the lock stores the mix path relative to the repo.
- **Why the takes file is derived:** the cold open's fastrec takes have `mouth: []`. With them the lock gives no mouth track, and without them it loses the takes' PA/O.S. modes. `mouths.py` adds tracks with the house method (a4lib `mouth_cues`: the takes' own word spans and misaki phonemes, gated by the WAV's envelope), re-implemented without torch. It touches no audio or takes file.

## 5. What's weakest

1. **1.01, the one wide:**
   - Mas is small: the seated sprite is 66 px tall. That's art-a's scale.
   - The "drift upstage" is the art's 12-px truck: the plate slides left, not in toward the window.
   - Whether the lit window reads at 4 px needs an eye.
2. **3.02, the scrub and the collapse:**
   - Most of what the scrub says rides on the light steps and the counter. The backward motions (the card, the crowd, the host's water, the stone) are small in the wide.
   - `too far` gets 28 frames to read before the smear.
   - The collapse is 6 frames of crop onto the cursor, and its match needs an eye at speed.
   - The cold open's black lacks the intro's dim glyph grid, so the grid appears on the cut.
3. **2.02:** the frozen table round the phone prints as a busy cream dither. It's a lot of texture for a 2.5 s read.
4. **3.01:** the medium Mas sits low in the frame, and the iris steps are small at r 11.
5. **Lip-sync** comes from the takes' word and phoneme timing through `mouths.py`. It hasn't been watched against the sound.
