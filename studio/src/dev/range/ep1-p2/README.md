# E1-P2 · WHAT THE QUACK (1.H) · handoff

The pilot's tag, sc 32 (Dec 6, 2023). This is a fully programmatic filler. ELGOOG's near-photoreal product film plays inside the dark room's pixel monitor, stutters and freezes, the Orb puts its scan beam on it, the frame breaks into the contact sheet of stills it was made from, and the clip cuts to the pixel `[2S]`. The brief is style-range §6.1a "E1-P2", and `plan.ts` holds the frame plan. Nothing is committed, no external API was called, and nothing was spent.

Last pass: **ep1r-p2r5** (2026-09-27), the fifth pass on this folder. It answers the cold review of v4 (below): a new take (a turntable spin), a rebuilt exposed screen, the Orb's beam, the `[OTS]` re-staged to match the `[2S]`, and the people animated.

## Outputs (`out/range/ep1/`)

| File | What |
|---|---|
| `ep1-p2.mp4` | Cut A, the ramp. 264 f (11.0 s), 1920×1080, 24 fps, H.264 + AAC, temp sound |
| `ep1-p2-b.mp4` | Cut B, the break. 216 f (9.0 s) |
| `ep1-p2-sheet.png`, `ep1-p2-b-sheet.png` | Labelled contact sheets, pulled from the encoded mp4s and shown at 480×270 |
| `ep1-p2-blind.png`, `ep1-p2-b-blind.png` | The same frames with no captions, for the blind read (every cell is phone size) |
| `ep1-p2-key-1-the-film-p040.png`, `-key-2-exposed-p170.png`, `-key-3-two-shot-p230.png` | Cut A's three key stills, full size, from the encoded mp4 |
| `ep1-p2-b-key-1-the-film-p040.png`, `-key-2-exposed-p122.png`, `-key-3-two-shot-p182.png` | Cut B's three key stills |
| `ep1-p2-measure.json`, `ep1-p2-b-measure.json` | Holds, grade and room levels, measured from the encoded mp4s |
| `ep1-p2-inputs/` | Inputs for the outside-layer test, on paper only: `cycles-f000.png` and `cycles-f119.png` (the move's two ends, Cycles, 1280×720, denoised), `screen-matte.png` with `screen-matte.json` (the film's rect in the `[OTS]`; v5 moved it to x 264), and `take-eevee.mp4` (the filler's take, x264 crf 14, for the premium comparison and for composite-only re-runs) |

## What the picture does (both cuts)

1. **`[OTS]`** from behind Mas's left shoulder. The monitor is left of centre, square to the lens; Mas is a black silhouette at frame right with the screen's cyan rim on his face side, looking screen-left at it (the way he looks at it in the `[2S]`); the window and the city are behind him; the Orb floats high at frame right, nearer the lens than he is. The band is on screen; `DEC 6, 2023` types in its sentence line at the scene's start (p6-20) and holds. The player's title strip says `ELGOOG DEMO`.
2. **The film** plays on 1s: a yellow rubber duck on a turntable under product light, turning from just past profile to nearly facing the lens (90° in 5 s) while the camera pushes in. The super `“What the quack!”` sets at p18.
3. **A (the ramp):** the same move on 2s (p72), on 4s (p96, the Orb's iris narrows), then frozen on 8s (p112). On the freeze Mas leans in (his head shears 2 px toward the screen) and the Orb fires: its lens lights and its scan beam crosses over his head onto the glass (p114): a dotted fan through the room's haze, corner brackets on the picture, a scan line stepping down it on 2s. At p120 the frozen frame steps down (two held steps) into the last cell of a 3×2 contact sheet while the other five stills are dealt in, one a frame (p122-126). Each still carries its take frame on a small tab (`F000 F022 F045 F067 F090 F112`): the frames between are missing. The beam moves onto the sheet; the caption `LATER: ELGOOG'S DEMO WASN'T REAL-TIME` types under it (p132-152); Mas sits back (p152); the beam goes out (p156).
   **B (the break):** at p72 the film breaks straight to the sheet (`F000 F014 F028 F043 F057 F071`), Mas leans in, the Orb fires; beam p74; caption p84-104; sits back p104; beam out p108.
4. **`[2S]`** (A p192, B p144): the shared dark-room plate, composed here so the shot can move. The monitor at frame left shows the same player (the same title strip, the same six stills in the room's palette, the chyron as marks). Mas breathes on 2s, hands clasped on the desk. The Orb's iris steps from the monitor to him (A p204); he turns his head from the screen to the Orb (A p212, the brow up) and gives the one-pixel smile (A p220); the Orb floats. The rack's slot whirs (A p240): its LED blinks and the magazine's edge shows. The `GUEST` card sits a rung down in the room's light.

## How it's built

- **The film:** `blender/duck.py` (v5). The duck is unchanged from v4: a procedural rubber duck from metaballs, meshed at 0.6 mm, trimmed to a flat foot, voxel-remeshed, relaxed and subdivided (about 672k faces); the bill, eyes, wing relief, parting line and smile groove are shader work in object space; each eye is a glossy moulded bead. The sweep, the lights and the lens are v4's.
  - **The move (new in v5):** the duck turns on a turntable (keyframed per frame, linear) under the fixed product light, apparent angle 100° → 10° (0 = facing the lens) over f000-f119, 0.75°/frame; the camera arcs 50° → 60° and pushes 0.60 → 0.55 m; focus follows the eye nearer the lens. v4 was a 52° camera arc (0.43°/frame), too slow for the ramp's dropped frames to show and for its stills to differ.
  - EEVEE Next on the Intel iGPU at 1056×592, 64 TAA samples, motion blur. No downloaded assets, no brand, nothing model-made.
- **The composite:** `P2Duck.tsx`, a CPU 2D canvas, in five layers: the native 480×270 pixel frame at 4× (`ots.ts` or `twoshot.ts`, and P4's `drawBand` with the rail); the film at output resolution inside the screen, its super drawn into it, graded by `grade.ts` (unchanged from v4: exposure ×0.82, a max-RGB soft knee under a hard cap 10 levels below 80%, the lens vignette, a grain fixed per take frame so it freezes in every hold, a half-LSB dither), or the contact sheet; the monitor's pixel UI (title strip, still tabs, chyron); the Orb's beam on the native grid (`beamCells`), screen-blended; the cast layer (Mas's silhouette, then the Orb), so the beam passes behind his head.
- **`ots.ts`:** the `[OTS]` room re-staged (monitor at x 66-330, the window and city behind Mas at frame right, no rack: it's behind the camera), Mas's silhouette (the portrait built facing right, its head OPENED with a radius-5 disc so the cowlick is gone, the lean as a shear, then mirrored), the Orb (r 19, `monitor: -1`, orb-medium's float on its own phase), the sheet layout and the beam.
- **`twoshot.ts`:** drawDark2S's draw order done here (plate, Orb, Mas's back image with the breath, the desk, the dimmed `GUEST` card, Mas's front image, the vignette), so Mas can breathe, turn and smile without editing the shared helper. The monitor's player is painted at the plate's 96×60 virtual screen: 29×16 stills snapped to the master palette in CIELAB (tungsten from W4 up, so the duck stays yellow).
- **Sound:** `tools/sound.py`, all temp. The dark room's bed (the v5 reel's recipe, about −39 dBFS RMS) and faint LED ticks; MM-12 as a temp felt line from the OST engine (read-only, its calibration cache in scratch); the slot's synthesised whir, which now starts 0.25 s before the LED's first blink so its spin-up is heard on the blink (v4's was ~0.3 s late). The Orb's beam is silent (the brief: the Orb's doubt has no sound). The monitor stays silent.

## Re-run (from `studio/`)

```bash
S=<a scratch folder>
bash src/dev/range/ep1-p2/tools/build.sh $S                            # take, sound, both cuts, review (the take is ~45 min)
bash src/dev/range/ep1-p2/tools/build.sh $S frames sound render review # composite-only: rebuild the take's PNGs from take-eevee.mp4, no Blender
bash src/dev/range/ep1-p2/tools/build.sh $S cycles                     # the two Cycles conditioning stills (CPU)
```

Run heavy steps through `../ops/heavy.sh` (for example `../ops/heavy.sh bash src/dev/range/ep1-p2/tools/build.sh $S frames sound render review`). The composite needs the take's PNGs in `$S/public/take/` (about 70 MB), passed as `--public-dir`; the `frames` step decodes them from `take-eevee.mp4` (4:2:0, a hair softer in chroma than the original PNGs). The script stops if free disk space falls under 5 GB. A single frame: `npx remotion still src/dev/range/ep1-p2/entry.tsx ep1-p2 $S/p.png --frame=140 --public-dir=$S/public`.

## What changed in v5, against the cold review of v4

| Review note | v5 |
|---|---|
| Nobody moves in the `[OTS]` | Mas breathes (1 px on 2s), leans in on the freeze and sits back when the caption lands; the Orb floats, narrows its iris at the 4s step, and fires |
| Nobody moves in the `[2S]`; a mannequin | He breathes, turns his head from the screen to the Orb, lifts his brow, and gives the one-pixel smile; hands clasped |
| The ramp reads as judder: the duck turns too slowly | A new take: a 90° turntable spin (0.75°/frame, was 0.43°); each dropped frame moves about 3× as many pixels |
| The three stills are nearly identical; "stills" doesn't come through | Six stills across the whole film in a 3×2 contact sheet, each numbered with its take frame; A's frozen frame steps down into the last cell while the others are dealt in |
| The exposed screen has dead space; a UI mockup | The sheet and the chyron fill the screen |
| The ring reads as a selection marquee, nothing ties it to the Orb | Replaced by the Orb's scan beam, drawn from its lens over Mas's head to the glass; the ring's fill no longer muddies the duck |
| The two-shot's monitor reads as a different screen; the Orb jumps sides | The `[OTS]` re-staged from Mas's other shoulder: monitor left, Mas right looking left, the Orb on his side away from the monitor, the window behind him, as in the `[2S]`; the `[2S]` monitor shows the same player and the same six stills |
| Garbled monitor title in the `[2S]` | Clean shapes: the play glyph, one title bar, three dots |
| `GUEST` placard pulls the eye first | Drawn a rung down in the room's light (grey card, dark-red band) |
| Hands are grey lumps gripping sticks | Hands clasped, clear of the tally marks |
| The silhouette's curl reads as a hook or antenna | The head is opened into a smooth crown |
| `DEC 6, 2023` lands in the last second and repeats the title strip | The rail types at the scene's start; the strip says only `ELGOOG DEMO` |
| (v4 handoff) the whir is heard 0.3 s after the LED | The motor starts 0.25 s earlier |

Checked in three rounds of stills (full size and 480×270) during the build, then on frames pulled from the encoded mp4s. One fix after the first full render: the `GUEST` card dimmed one more rung.

## Measured (from the encoded mp4s, ep1r-p2r5)

| | A | B |
|---|---|---|
| Length · size | 264 f (11.0 s) · 2.2 MB | 216 f (9.0 s) · 1.3 MB |
| Format | 1920×1080, 24 fps, H.264 + AAC | same |
| Loudness / peak (decoded from the mp4) | −23.7 LUFS / −5.0 dBFS | −23.8 LUFS / −4.8 dBFS |
| New drawings in the film, p1-71 (1s) | 71 of 71 | 71 of 71 |
| p72-95 (2s) · p96-111 (4s) · p112-119 (8s) | 12 · 4 · 1 (the 8s count reads 4: the other 3 are the Orb's beam coming on at p114 and its scan line stepping at p116, p118, noted in the JSON) | — |
| Size of each new drawing in the ramp: share of film pixels that move > 12 levels | 1s 0.2% · 2s 1.3% · 4s 3.2% (v4: 0.3% · 0.4% · 0.9%, so the dropped frames are now about 3× the step) | — |
| Film, max channel (8-bit) / 99.9th percentile (before the beam) | 204 / 191 | 204 / 191 |
| Film luma, max / mean (display) | 0.749 / 0.510 | 0.749 / 0.514 |
| Film pixels over 75% | 0.22% | 0.24% |
| Film mean vs the room's mean (OTS) | +4.50 stops | +4.52 stops |
| Film mean vs the room's lit surfaces (its 99th percentile) | +0.35 stops | +0.39 stops |
| The super's clearance from the duck (every take frame it shows on, f018-f119) | at least 69 px (at f054) | same take |
| The cast moves (frames where the region changes) | `[OTS]` Mas p30, p62 (breath), p112 (leans in), p152 (sits back); the Orb 21 times in p1-191 (float, iris, firing); `[2S]` Mas p200 (breath), p212 (turns), p220 (smile), p236 (breath); the Orb p204-206 (iris), float, the whir's LED | `[OTS]` Mas p30, p62, p72 (leans in), p104 (sits back); `[2S]` Mas p164 (turns), p172 (smile), p200 (breath) |

The take has an even exposure (mean 136-141 of 255 across the move) and a steady frame-to-frame change (0.26-0.52 levels mean over the whole frame, no outlier frame): no flicker or pops found by measurement. The whir now starts 0.25 s before the LED's first blink (A p240, B p192), where its spin-up envelope is already at about 60% (v4's reached that about 0.3 s after the blink).

## Render time (this pass; everything local, nothing spent)

| Step | Time |
|---|---|
| Lookdev test (5 frames of the new move) | about 2 min |
| The take (120 frames, EEVEE on the iGPU, shader cache warm) | 2,149 s of render (17.9 s a frame), about 36 min wall |
| The take's intermediate encode | under 1 min (plus the wait for a heavy slot) |
| Cut A composite · cut B composite (`--concurrency=4`) | 26-27 s · 16-24 s (two renders each: a first pass, then the card dimmed) |
| Sound, per cut | about 14 s |
| Review (sheets, keys, measures) | about 90 s |
| Cycles stills (2, 1280×720, 256 spp, CPU, re-rendered for the v5 move) | 701 s |

## Deliberate departures from the brief

- **Six stills, not three,** in a 3×2 contact sheet that fills the screen, each numbered with its take frame. v4's three-across strip used a third of the screen and the cold review read it as a UI mockup; three near-identical stills didn't say "stills".
- **A's stills** are spread across the whole film (F000-F112), ending on the frame it froze on, not "the last three holds".
- **The Orb's eye-light is its scan beam,** drawn from its lens to the glass (the review: the ring "looks like a selection marquee"; nothing said it was the Orb's). The Orb also fires (its lens lights) and narrows its iris; the brief said "nothing else on the Orb moves". Still silent.
- **The `[OTS]` is re-staged** (monitor left, Mas right, the Orb high right, the window behind him, no rack) so it doesn't cross the line against the `[2S]`: in v4 Mas faced right in the `[OTS]` and left in the `[2S]`, and the Orb and the monitor swapped sides.
- **The rail** types at the scene's start, the show's rail grammar, not "on the delivery" (the script's line for the full scene), and `DEC 6` is gone from the title strip: v4 typed the rail in the last second, repeating the strip.
- **B's first still is F000**, before the super sets, but it carries the super, as the brief asks.
- **The caption** follows the brief, `LATER: ELGOOG'S DEMO WASN'T REAL-TIME`. The script says `LATER: THE DEMO WASN'T REAL-TIME`; the facts owner decides.

## Needs a person

- Watch both cuts at full size and at phone size, and listen to them. Nothing here has been watched in real time or listened to.
- Run the blind read (`*-blind.png`, then the mp4s): do readers say "an ad" and "ELGOOG", then "fake" or "edited"? Which cut gets "faked" sooner? A tie goes to B.
- In motion: does A's ramp now read as the film being exposed (the Orb's beam lands on the freeze), or still as a player buffering? Does the beam read as the Orb looking, or as a UI effect?
- Is the turntable spin too brisk for a product film (18°/s)?
- The facts owner checks `ELGOOG DEMO`, `DEC 6, 2023` and the caption.
- Rule on the grade reading (below).

## Open issues and honest weaknesses

- **"Within a stop of the room"** can't be met literally while the film is a pale product film in a dark room: film mean against room mean is +4.5 stops. Against the light the room shows it receiving (its lit desk edge and rims, the 99th percentile) it is +0.35 to +0.39 stops, and the whites stay under 80% (luma max 0.749). Someone rules on which reading holds.
- **The duck is a clean CG product render, not a photograph** (unchanged from v4): the softbox reflections on the chest are soft shapes with a faint grain, the back has gentle lumps (the spin shows more of it at its start), the wing relief is bump only, EEVEE's subsurface barely shows and the floor reflection is faint. It looks finished at monitor size; at 1:1 an expert would call it CG. The planned FINAL (a video model conditioned on the Cycles stills, or Cycles for the whole take) closes that gap.
- **Whether the ramp now reads as "exposed"** is a viewer's call. Measured, each dropped frame is about 3× v4's; the Orb's beam landing on the freeze gives it an in-world cause. It may still read as a player hitching for the first half second.
- **The beam is a dotted fan with corner brackets and a scan line.** It has a source now, but some viewers may still read it as a UI effect laid over the room rather than light.
- **The one-pixel smile** is one pixel (the show's rule). At phone size the head turn is what reads; the smile needs full size. Mas doesn't blink (mas-medium's rule: no on-screen blinks), so his `[2S]` life is the breath, the turn and the smile.
- **The `[OTS]` silhouette's head** is the portrait's outline, opened: a smooth oval, but its face side is nearly straight. It reads as a head from behind; it has no ear.
- **The `[2S]` thumbnails** are 29×16 palette pixels, sampled onto the turned monitor; the ducks read yellow-orange with brown bills, and the chyron marks are uneven.
- **The encoded film** touches exactly 204 (80%) on a few saturated edge pixels.
- **The tally marks** still read as three thin bright lines in front of his hands (the plate's canonical marks, not changed here); with the hands clasped they no longer look held.
- **Geography:** the `[OTS]` is a cheat in one way: by the plate's layout the Orb would sit behind the camera from this angle; it is placed high at frame right, on the correct side.
- **Cycles stills** (`ep1-p2-inputs/`) were re-rendered for the v5 move (the spin's two ends), so they no longer match v4's arc.
