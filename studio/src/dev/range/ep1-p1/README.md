# E1-P1 · CLOD under its launch light (style-range 1.A) · handoff

A fully programmatic filler for Ep1 sc 11, the split-screen duel (Mar 14, 2023), from phrase 1 to the cut to sc 12.
CLOD, MISANTHROPIC's product, is the only thing in clay: a stop-motion puppet rendered with three.js on the iGPU
and composited at output resolution into the pixel lighthouse pane. Everything else is pixel, and the verb band
stays on screen. The brief is `show/bible/style-range.md` §6.1a, "E1-P1". No external API was called.
R24 (the whole pane in clay, `ep1-p1-b.mp4`) is not ruled on, so that cut is not built.

## Outputs (`out/range/ep1/`)

| File | What |
|---|---|
| `ep1-p1.mp4` | 660 f (27.5 s), 24 fps, 1920×1080, H.264 crf 16 + AAC 256k, the temp sound pass |
| `ep1-p1-key-1-pixel-clod-p150.png` | phrase 1: CLOD unlit on its plinth, a pixel figure |
| `ep1-p1-key-2-launch-p268.png` | the launch: clay CLOD in the pool, "…right!" (open mouth), `CLOD 1 · SAME DAY` |
| `ep1-p1-key-3-the-hold-p452.png` | the hold under the light while the duel plays around it |
| `ep1-p1-sheet.png` / `ep1-p1-sheet-blind.png` | 32 frames from the encoded mp4, captioned / numbered only |

All stills and sheet tiles are pulled from the encoded mp4, not from the renderer.

## Timing (660 f, not 600)

Mario's temp memo runs 206 f, past the brief's p176 limit, so the clip opens a bar early (phrase 1's downbeat),
as the brief allows: every brief frame is +60 here (`timeline.ts`, `B(p)`). The slam is p240, the clay runs
p240–599 (15 s), and the cut to sc 12 is p600 (rail `MAR 22, 2023` from p604).

- p0–239 pixel split. Gerg photographs the napkin, CLOD stands unlit on the plinth as a pixel figure made from the
  clay's own first key (`tools/pxclod.ts`), and Mario's plate shows from p8 to p96.
- p240 the can slams on with a one-pixel kick, no switch. The beam, pool and desk spill are drawn in whole rungs,
  Mario's near side goes one rung warmer (amber, never red), and CLOD is clay.
- p240–263 the bow on 2s. "You're absolutely right!" plays p244–276 on three replacement mouths.
  `CLOD 1 · SAME DAY` shows p255–295.
- p264–599 the hold. The pose is still while the surface boils through 4 replacement surfaces on 2s in a hashed,
  aperiodic order, with the prints pinned and the wheel turning in eighths. Three replacement-lid blinks come at
  p352 (right after "Addendum."), p462 and p550.
- p300–599 the duel plays around the hold: the post, the cheers, the second scroll across the split, the website,
  the empty spindle.
- p600–659 sc 12, over Mas's shoulder at night, with `PAUSE GIANT AI EXPERIMENTS` on his monitor.

## What round 4 (this pass) changed, and why

It worked from the round-3 source, which had never been rendered to mp4.
- **Clay, not felt (`gl/clay.ts`):** the sheen lobe is gone (at 2× it read as a plush toy). The material now has a
  waxy clearcoat broken up by the prints, the terracotta is deeper, and the prints are stronger.
- **The chest wheel:** it's tipped 0.7 rad toward the lens with a pale head and a shallower niche. Edge-on, it had
  read as a hole in the belly.
- **Whites:** the clay's tone shoulder now caps luminance at 0.76, with no channel above 0.86. A clearcoat glint
  had measured 83% in the encoded mp4.
- **Blinks:** three replacement-lid blinks (`gl/cels.ts` `BLINKS`, lid parts in `clay.ts`) give the hold life
  without moving the pose.
- **`GTP-4` banner:** the script's hand-lettered banner (sc 11, final pass) now hangs over the demo stage. It also
  covers the neon, which the pane's crop cut to "E AI". Mas's post card moved to x=2 so it covers the banner whole.
- **The beam** keeps its haze until it reaches CLOD. Before, it thinned to a quarter dither above the head, so
  the light never visibly landed on the puppet.
- **The plinth top:** the clay's shadow takes one rung there, not two. The top had gone black, and the far foot
  looked like it was hovering.
- **Sheets:** p354 (a blink) is added.

## Re-run (from `studio/`)

```
S=<your scratch dir>
src/dev/range/ep1-p1/tools/build.sh $S            # all stages: voice cels px clip sound mux stills
src/dev/range/ep1-p1/tools/build.sh $S clip mux stills   # picture-only change (needs $S/pub/cels and $S/sound.wav)
../audio/.venv-mix/bin/python src/dev/range/ep1-p1/tools/motion.py <tile crops t000.png..> $S/pub/cels/cel-051.png
```

- The `voice` stage makes the stock Kokoro takes locally into `$S/vo` and writes `gen/takes.json`. The `sound`
  stage needs `$S/vo`.
- `cels` probes the GL renderer first and refuses anything that isn't the iGPU.
- Times this pass: cels 90–103 s (64 cels, iGPU, `--gl=angle`), clip 134–273 s (`--concurrency=4`), sound 30 s,
  stills about 1 min.

## Measured (from the encoded mp4, `tools/motion.py` and ffprobe)

- 660 frames, 24/1, 1920×1080, 27.5 s audio and video.
- **On 2s:** inside the clay, an odd frame differs from the previous frame by 0.02 mean abs (max 0.09). A new
  drawing differs by 4.07.
- **The boil in the hold:** 3.27 mean abs per drawing (min 2.97, max 3.8). 188 of 13,041 hold-drawing pairs match
  (the same surface and wheel eighth), and the sequence has no period.
- **Entry:** p238→p239 changes 0.0 in the tile, and p239→p240 changes 22.9. Pixel-figure and clay silhouettes
  match by eye (`tools/pxclod.ts` builds one from the other).
- **Clay whites:** 72.5% max luma pre-encode, 0 clay pixels above 80% in the hold after encode. The 206/255 (81%)
  peak at p240–244 in the tile is the pixel spill's W7 on the desk, not the clay.
- **Sound (temp):** −16.0 LUFS, peak −1.6 dBFS. The clunk is a transient at 10.0 s (p240). The music thins to
  about −33 dBFS under the post and comes back for phrase 4, and MM-17 comes in low after the cut.

## Needs a human

- Watch and listen at full size and at phone size. I can't watch in real time or listen.
- The blind read (brief: "a clay product or puppet has launched", no "filter", "effect" or "glitch"; the hold reads
  as a puppet at 480×270).
- Does the hold read as a loop over 15 s (30 s in the episode)?
- Do the blinks help, or should the hold stay strictly still?
- The temp mix: MM-04 and MM-17 are engine temps, the clunk, press, whirr and felted upright are synthesised, and
  the voices are stock presets.

## Open issues and weaknesses

- The clip is 660 f, not 600, because of the memo take. In the episode the clay runs about 30 s, twice this sample.
- DOF softens CLOD's lower body and clipboard. That's intended as miniature focus, but at full size it's the most
  likely "pasted-in" tell. At 480×270 it reads as an orange clay figure in a spotlight.
- The bow happens in 24 f, fast next to the 32 f line.
- Mouths and lids are small at 480×270 (1–2 px). The face reads mostly by the eyes and bow tie.
- The spill's W7 on the desk measures about 81% luma after the encode. That's the pixel palette's ceiling plus
  4:2:0 error, not the clay.
- Final route (R22, the showrunner's pick, paper only): a stop-motion day, a scanned maquette, a video model for
  the clay body only (code keeps the mouths and timing), or this filler as final. Nothing was spent.
