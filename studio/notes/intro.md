# intro-ep1: the integrated opening (picture), Ep1

**Owner:** intro integrator / picture editor. **Date:** 2026-09-25.
**Spec:** `show/intro/SCRIPT.md` v2.1: 720 frames (f0–719) at 24 fps, 96 BPM, 15 frames per beat, 1920×1080 (native 480×270 at 4×).
**Composition:** `intro-ep1` (1920×1080, 24 fps, 720 frames). It is registered in the main Root (`src/intro/intro.frame.tsx`) and in the integrator's lighter dev entry (`src/dev/intro/entry.tsx`).

## Files
| path | what |
|---|---|
| `src/intro/edl.ts` | **The edit decision list**, the single source of the cut frames. Each edit has `origin` (the moment's local frame 0), `span` (what it can render) and `from`/`to` (what is on screen). There is a load-time check that the EDL tiles 0–719 with no gap or overlap. |
| `src/intro/scenes.ts` | Every moment as a PixelScene definition on its own clock. These are the same scene objects the moments' own components mount (`ColdOpen`, `Meras`, `Mdinner1`, `Mdinner2`, `MRollcall`, `MFinale`), with the QC pass added. |
| `src/intro/qc.ts` | The integrator's picture QC. It runs on each moment's final native frame (after its draw, palette and switches, before glyph and UI layers). It currently maps banned **#FF6600 → #FF7F2A** (see Fixes). |
| `src/intro/IntroEp1.tsx` | The composition. It has one `<Sequence>` per edit, with a nested negative-offset Sequence so an edit can start after its moment's origin without touching the moment. |
| `src/intro/intro.frame.tsx` | Registers `intro-ep1`. |
| `src/dev/intro/entry.tsx`, `review.tsx` | The dev entry. It has `intro-ep1` plus six review comps, `intro-raw-<moment>`: each moment over its whole authored span on the global clock, black elsewhere, for comparing both sides of an overlap. |
| `src/dev/intro/tools/master.sh` | Makes the silent masters: a Remotion PNG sequence, encoded with ffmpeg, then verified (see Masters). |
| `src/dev/intro/tools/events.ts` | Writes `intro-events.json`. It imports the moments' own timeline constants, so a retime in a moment re-flows into the export. |
| `src/dev/intro/tools/contact_sheet.py` | Writes the 48 beat stills and the contact sheet. |
| `src/dev/intro/tools/handoffs.py` | Writes the handoff stills and strips, the match-cut zoom and the overlap diff. |

**Outputs** are in `out/intro/picture/`:
- `intro-ep1-1080p-silent.mp4`
- `intro-ep1-4k-silent.mp4`
- `intro-events.json`
- `beats/`: 48 stills, `beat-NN_bar.beat_fFFF.png`, plus `_contact-sheet_intro-ep1-beats.png`
- `handoffs/`: every cut frame ±2–3 frames at 1080p, a strip per cut, the match-cut zoom and the overlap diff

```
cd studio
npx remotion still  src/dev/intro/entry.tsx intro-ep1 ../out/intro/picture/handoffs/x.png --frame=225 --bundle-cache=false --log=error
npx remotion render src/dev/intro/entry.tsx intro-ep1 <dir> --sequence --image-format=png --concurrency=4 --bundle-cache=false --log=error
bash src/dev/intro/tools/master.sh all            # both masters (about 3.5 min on this machine)
npx esbuild src/dev/intro/tools/events.ts --bundle --platform=node --outfile=<scratch>/events.cjs --loader:.woff=empty --loader:.woff2=empty --loader:.css=empty
node <scratch>/events.cjs ../out/intro/picture/intro-events.json
python3 src/dev/intro/tools/contact_sheet.py <png seq dir>
python3 src/dev/intro/tools/handoffs.py <png seq dir> <intro-raw-mdinner1 frames 340-359 dir>
```

## The edit (EDL)
| # | moment | on screen | local 0 | cut in |
|---|---|---|---|---|
| 1 | `mcoldopen` | f0–119 | f0 | Head of the loop (f0 is the caret on, the state f719 leaves) |
| 2 | `meras` | f120–**224** | f120 | Hard cut on 3.1, from paper white to 1-bit 1993 |
| 3 | `mdinner1` | **f225**–**344** | f225 | 4.4 match cut: the crown glint becomes the candelabra flame |
| 4 | `mdinner2` | **f345**–479 | f345 | 6.4, an invisible edit inside the pixel-identical overlap |
| 5 | `mrollcall` | **f480**–539 | f480 | 9.1 hard cut on stab 1 |
| 6 | `mfinale` | **f540**–719 | f540 | 10.1 hard cut onto the dusk skyline |

## Handoffs: the decisions and how each was checked
I rendered every cut frame and its neighbours and looked at them at native scale, and zoomed where it mattered: `handoffs/*_strip.png`.

- **meras → mdinner1: cut at f225** (the first frame of the 225–239 overlap).
  - meras' own 225–239 is a fallback 2015 room: a different set, not mdinner1's WOODROSE. mdinner1 owns 225 onward in its own set. So the only clean edit is on the beat where the glint becomes the flame.
  - **Found broken:** the glint landed 13 native px *below* the flame. meras aimed at (84,108), which is the candle's cup; the flame core (W9) that mdinner1 draws at f225 is at **(84,95)**. Fixed (Fix 1). The glint now sits on the flame core exactly (`handoffs/02_…_matchcut-zoom.png`).
  - The palette switches hard on the cut (EARLY-WEB16 → BASE). That is the approved polish-pass choice (art director: no second render front); SCRIPT §3.4 asks for a 5-frame front 225–229 (see Deviations).
  - Mas: throne-Mas in the 2014 palette on 224, seated dinner-Mas in BASE from 225. His glass is on the table at his hand from 225.
- **mdinner1 → mdinner2: cut at f345.**
  - The overlap f345–359 is **pixel-identical**: 0 px differ on all 15 frames, 1080p RGB, comparing the intro render against `intro-raw-mdinner1` (`handoffs/03_…_overlap-diff.txt`).
  - The cut is invisible wherever it goes. I put it on the first overlap frame, beat 6.4, which is also where §9.4 says mdinner2 owns the span (mdinner1 "hands off at f344", and its lens-side candle wipe completes on 344).
  - Camera, palette, Mas's pose and colour, and his glass with its flat water line are all continuous across it.
- **mdinner2 → mrollcall: cut at f480.** A hard cut on the downbeat, from the NOPE AI key art (neon settled from 477) to the TASYA window. It is clean, with no leftover UI. The build's roll call does not carry the table runner across the cut (see Deviations: layout).
- **mrollcall → mfinale: cut at f540.**
  - mfinale's `MF_START` is already **540**, and its scene no longer imports `slot.ts`/`callart.ts`. The old 480–539 slot is gone, so no edit was needed; I verified it in code and on the renders.
  - The roll call's cursor window pulls back 537–539 onto the skyline's own dusk sky and far city at camera 0, so 539 and 540 share the sky, the far city and the water.
  - On 540, NopeAI and MACROSOFT pop in, and so does the star field. mrollcall's copied sky has no stars; polish-b flagged this. It is minor, since it lands with the tower pop, but it is a one-line mrollcall fix (see To owners).
- **The loop, f719 → f0.** f712–719 dissolves to black with the caret on the beat phase (on 707–712, off 713–719). f0 is the cold-open macro with the caret on. The caret home is `CARET_FRAME` from mcoldopen, which the bookend imports.
- **mcoldopen → meras at f120.** f118–119 is flat 1-bit paper #E9E6DA (0.79 luminance), then a hard cut to 1993 on the drop.

## Fixes made
1. **meras, `src/dev/meras/era2014.ts` `HANDOFF`: `[84, 108]` → `[84, 95]`.** This is the moment-file edit, required for the 225 match cut.
   - The 2014 end-pan lands the glint on this point at f224. The pan and the (unmounted) fallback `era2015.ts FLAME` both follow the constant.
   - A comment in the file points here.
   - mdinner1's note ("the crown glint at native (84, 108)… where the candelabra flame is") is stale: the flame core is at (84,95) with the camera at y 30 on f225.
2. **Banned colour, integrator QC (`src/intro/qc.ts`), no moment edit.**
   - The 2014 section (f195–224) had about 3,200 native px per frame of **#FF6600** (YC's brand orange).
   - It comes from the engine's `EARLYWEB16` slot and meras' `ERA14` pins (W4–W6), which violates SCRIPT §3.4 / §9.5 note 4 and guardrails §5.
   - The master maps it to **#FF7F2A**, the approved WHY COMBINATOR orange. The lint now reports **0 banned pixels in all 720 frames**.
   - The QC runs after palette and switches, so the title ladder's EARLY-WEB16 letters are covered too.
   - **To fix at the source** (then the QC is a no-op): swap the slot in `shared/pixel/palettes.ts EARLYWEB16_COLORS` and in `meras/palettes.ts PIN14`.
3. **Master encoding.** Remotion's built-in encoder filters chroma across pixel edges. The masters are therefore encoded from the Remotion PNG sequence with the bundled ffmpeg, with nearest-neighbour chroma (`master.sh`). It is the same h264 / crf / yuv420p / 24 fps.
   - 1080p against the lossless render: mean PSNR 44.1 dB, worst 34.8 dB (f117, the dithered paper fade). Remotion's encoder at the same crf 12 gave 39.3 / 29.7.
   - 4K, first 130 frames: mean 44.5 dB, worst 39.2 dB.
4. **Mounting.** I checked that the intro frames are identical to each moment's own render, including the glyph layers: f102 (scan cone), f152, f534 (the GLYPH cursor), f633 (title ladder) and f705 (iris). All are 0 px different.

## Verification
- **Masters.** Both are `h264, yuv420p, 24/1, 720 frames, 30.000 s`, video only, tagged bt709.
  - 1080p: 1920×1080, crf 12.
  - 4K: 3840×2160, crf 16, from a **`--scale=2`** Remotion render. That render matches a nearest-neighbour 2× of 1080p, except where the glyph bloom is re-rasterised at 4K.
  - `master.sh` checks all of this after each encode.
- **Photosensitivity** (automated, on the native grid). A transition is at least 25% of the screen changing by 0.10 or more of relative luminance, with the darker state below 0.80.
  - The worst 24-frame window has **2 flashes: PASS** (limit 3).
  - Transitions: the paper fade 116–118, 120, 195, the freeze flash-prints (240/242, 300/302, 360/362, 420/422), the thaws (255, 315, 375, 450), and the candle wipe 341–343.
  - The roll call and the title slam stay under the area threshold. The brightest frame mean is 0.79 (f118).
- **One-frame anomalies** (a frame unlike both neighbours while they agree): only f180. That is meras' intended 2-px camcorder bump on the first collar pop.
- **Beats.** The 48 stills and the contact sheet were reviewed. Palette, camera and Mas's colour are continuous inside each moment.

## Deviations from SCRIPT.md v2.1, as built (for the showrunner and the owners)
The picture events JSON gives **the frames as built**, and gives `script` where the build differs. **Audio should cue the picture frames** until a moment is retimed.

| where | as built | SCRIPT v2.1 | owner |
|---|---|---|---|
| 225–229 | hard palette switch plus a 5-frame whip right (the art director's polish) | a 5-frame render front from the flame, camera locked at x = 0 | mdinner1 / meras |
| dinner freezes | the world is printed for 1 beat (240–254, 300–314, 360–374) and 2 beats (420–449); the cards hold over the live room | each freeze holds to its card close, and carded founders stay frozen | mdinner1/2 (polish-a/b) |
| 248 | CTRL pluck inside the Gerg print (pocket 254–256) | 270–282, pluck 274 | mdinner1 |
| 287–299 | Alyi levitates 2 → 22 px | he rises still seated in his chair | mdinner1 |
| **292–293** | GLYPH boot of the rose window | not in the budget (the GLYPH total is 15 frames: cone, cursor, iris) | mdinner1 |
| 296 | effigy whoomph | 290 | mdinner1 |
| **fine print** | `PRODUCTS: 0 · BUNKER: YES` (shared `freeze.ts`) | the fallback `PRODUCTS: 0 · EFFIGIES: 1`; BUNKER is held pending a ruling (§9.10) | engine / freeze.ts |
| 350 / 352 / 356 | HUD ticks at 348/352/356; Mario out 350, finger 357 | 348/351/354; out and finger 352 | mdinner2 |
| **450–453** | LEDGER flash on the check (`RECEIVED: $133M`) | held, not in the v2.1 cut | mdinner2 |
| 453–464 | sip | 450–455 | mdinner2 |
| **466–477** | place cards 466, N move 467–473 (clunk 473), AI relight 474–477: after the freeze | the N moves inside the freeze 456–464, relight 465 | mdinner2 |
| 480–539 | one centred window that grows by semitone (up to 206×250, 40% of the screen), 5–8 on black, RUMPT plate `???`, cursor window pull-back 537–539 | 112×136 windows riding the thread, one fill luminance step, blank plates | mrollcall (the showrunner picks the layout, §9.1) |
| 617 | RIMA's rooftop light snaps on (MACHINES THINKING roof) | her light drifts on NopeAI's roof deck from 540 | mfinale |
| **630–634** | title shake of **8 px** (`title.ts SHAKE`, 5 frames) | 3 px or less (rule 3.0.6), 630–632 | mfinale |
| **630–638** | wordmark palette ladder (1-bit, early-web, flat), chrome from 639 | cut in v2.1: chrome from 630 | mfinale |
| 640 | subtitle at 2 ch/f (640–655) | 4 ch/f (640–647) | mfinale |
| 690–719 | the cold open's front two-shot; toast `your post was sent` 705–711; fade to black 712–719 | a reverse angle behind his shoulder; toast `verified: human` at 692 [SLOT]; one light step at 716 | mfinale |
| 0–119 | stepped macro dolly-out 0–44; typing 24–55 / 71–93; chart snap 113 | insert; typing 18–49 / 64–83; snap 114 | mcoldopen |
| 2014 sign | orange plate with cream letters (#FF7F2A after QC) | flat #FF7F2A on cream #F3EEDC, with navy #000033 outlines on the letters | meras |
| collar pops | 180 / 187 / 202 | 180 / 190 / 205 | meras (**audio**: the SFX retimes in §9.3 assume the script frames) |

## To owners (suggested, not done: outside the integrator's files)
- **mfinale:** clamp `SHAKE` to ±3 px (rule 6). Drop the ladder if v2.1 stands.
- **Engine and meras:** remove #FF6600 at the source (Fix 2). Swap `BUNKER: YES` for the fallback in `freeze.ts`.
- **mdinner2:** set the ledger length to 0 (`T.ledgerLen`) if S5 stays held. Retime the N move into the freeze if the script timing stands.
- **mrollcall:** draw mfinale's `duskStars` over the 537–539 sky so the stars don't pop on at 540. Blank RUMPT's `???` plate.
- **mdinner1:** the handoff note in `notes/mdinner1.md` should read (84,95).
- **Audio:** cue from `intro-events.json`, not the script, where they differ. The ones that matter most: collar pops 187/202; HUD 352/356; whoomph 296; the `item_take`s at 248 (key), 390 (scroll) and 467 (N); `letter_clunk` 473; `neon_ignite` 474; Mas's sip 453; the stamp 435 is as scripted.
