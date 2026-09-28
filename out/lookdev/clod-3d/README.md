# CLOD in 3D: look-development test (2026-09-28)

> **Approved and finalized:** the final insert is `out/ep01/full-v3/inserts/clod-v35-el/`, on the EL-timed lock and
> delivered as RGBA layers for the episode's own renderer. It keeps this test's look and changes only the expression.
> The "O" mouth became the open smile, and there are new warm (half-moon) eyes and longer happy-shut eyes on the nods.
> That change lives in the shared rig and in `pane_insert.py`. Re-running this test's steps now renders the new mouth,
> and in the pane the new eyes too. The stills and clips in this folder are the test as it was.

The showrunner asked: "also can we try replacing claude with an actual 3d rendering". This folder is that test: CLOD
as a real 3D clay puppet rendered in Blender 4.5.3 (Cycles, CPU), under the bible's Claymation rules
(style-range.md, "Claymation"; 1.A "CLOD under its launch light"). **It is a test only.** Nothing in the episode
changed: no timeline, lock, picture, mix or show doc was touched, and nothing is committed.

## What's here

| File | What it is |
|---|---|
| `clod-turnaround.png` | 1920 x 1080 turnaround: front, three-quarter, profile, back, on a grey paper sweep under one soft key |
| `clod-nod-absolutely-right.mp4` | 4 s, 24 fps shot on 2s (48 drawings): an eager nod with a squash on "You're absolutely right!", with CLOD's Kokoro take (`e1-a1-11-02`, the take the act uses) |
| `clod-nod-squash-accent.png` | Drawing 18 of the clip (frames 36–37): the bottom of the squash on "AB-solutely" |
| `clod-in-episode-11.04-mockup.mp4` | Ep1 Act One, frames 7256–7534: the last 50 frames of 11.03 (pixel CLOD, unlit), all of 11.04 with the clay CLOD in the lighthouse pane from the launch light on, and the first 24 frames of 12.01. The act's own temp mix |
| `clod-in-episode-f*.png` | Four 1080p stills from the mock-up (frame numbers are the act's) |
| `clod-in-episode-sheet.png` | Eight mock-up frames at the show's native 480 x 270 (box-filtered), the size a phone viewer reads it at. The first tile is the pixel CLOD before the light |
| `logs/` | The render logs (engine, size, samples, per-drawing seconds) |

## Look choices

**The puppet** (`studio/src/dev/blender/clod/clod_rig.py`, built procedurally and deterministically: hashed noise,
no random module, so every run builds the same puppet)
- **Proportions from the pixel drawing** (`shared/pixel/cast/clod.ts`) at 5 mm a native pixel: 0.28 m tall, one
  bean of clay whose head is its top, a gumdrop with a low belly, two pressed-on feet.
- **Clay**: Misanthropic terracotta `#B8573A` with a hand-mixed mottle (±7 %), roughness 0.52, a shallow warm
  subsurface (weight 0.18, 3.5 mm scale) so the edges glow slightly instead of reading as plastic.
- **Thumbprints are real dents** with the clay pushed up on one side (14 on the body, one on the crown, prints on
  the feet, elbows and hands). Their ridges and the loop tool's drag marks are bump shading from coordinates baked
  per vertex, so they are pinned to the clay and never swim while it bends or boils.
- **Boil**: four replacement surfaces (shape keys of low-frequency lumps, calmer on the face), one per 2-frame
  step in a hashed order with no immediate repeat. The prints live in the basis, so the surface shifts and the prints
  hold, as a re-handled real puppet's would.
- **Squash is volume-preserving**: the root bone scales z by s and x, y by 1/√s. The nod is a three-bone rig (root,
  body, head) weighted by height, and every pressed-on piece shares those weights so it rides the clay.
- **Replacement pieces**, never morphs: three mouths (smile, O, open) driven by the Kokoro take's own mouth track,
  open eyes and happy-shut arcs, all dark clay.
- **Bow tie** in blue clay (two pinched wings and a knot); **clipboard** with a blank ruled sheet (no text, no
  marks, nothing to read).
- **The potter's wheel** sits in a niche behind a rolled-clay porthole: a plaster wheel head tipped toward the lens,
  a tiny wet pot, a dark lug on the rim and a thumb-slip on the pot so the turn reads. It turns faster while CLOD
  agrees (its thinking) and eases after.
- **Nothing sharp and no marks**: every edge is rounded; there is no logo, no starburst and no lettering anywhere on
  it. The only round motif is the wheel in its porthole.

**The clip's stage**: a grey paper sweep with a faint painted mottle, **one soft key** (a 0.7 m warm disc, high front
left) and no fill except a dim grey world. A 100 mm lens from about 2 m at **f/2.8**, focused on the eyes every
step: about ±35 mm is sharp, so the clipboard's front edge and the sweep go soft (the miniature read). The camera
makes a slow 90 mm push **stepped on 2s** with a hand-written jitter table (sub-millimetre moves and ±0.03° roll,
no two neighbouring steps alike), and the puppet carries its own animator's-touch jitter. AgX view transform. The
performance listens, draws itself up, nods deep on "AB-" (squash 0.93, happy eyes), nods again smaller on "RIGHT",
overshoots proud and settles pleased with a head cock.

**The pane insert** (`pane_insert.py`, `composite.py`)
- **Placement from the pane's own geometry** (`shared/pixel/rooms/duel-split.ts`): CLOD's foot is room (142, 176),
  which lands on screen at (1282, 710). A 100 mm lens from 6.7 m, pitched 8.6° to match the plinth top's drawn
  ellipse, with the lens shifted until the foot sits on the pixel plinth. The clay's top lands at y = 488: 55 native
  px, the pixel CLOD's height.
- **Its light is the pane's light**: a warm spot from the upper left where the pixel can-light hangs (58° cone),
  a weak warm kick from the lamp and desk behind right, and a dark blue night world. Standard view transform, then a
  grade of (0.88, 0.78, 0.74) so the clay sits within about a stop of the pixel light around it.
- **Contact**: a second pass renders only CLOD's shadow onto shadow catchers shaped like the pixel plinth and floor.
  That shadow is averaged on the native 4 x 4 grid and stepped into two rungs pulled toward the night palette
  (PAL.N2), so the contact belongs to the pixel pane. The clay itself is laid in at output resolution (1920 x 1080).
- **The people stay pixel**, and so does the room: the plate is the episode's own Node renderer at the act's own
  lock, with only the pixel CLOD's draw call swapped for a no-op at bundle time (`plate-build.mjs`,
  `clod-stub.ts`). Before the launch light and after the cut, every frame is the episode's own frame (checked
  against `act1.mp4` frame for frame: 0.1 % mean difference, which is codec noise; the clay switches in on exactly
  frame 7312).
- **Timing from the lock, not by hand**: the clay switches in when the launch light slams on (the layout's own mark,
  CLOD's line start minus 2 frames), is shot on 2s from there, nods on the line's word times ("absolutely",
  "right"), speaks with the line's mouth track, rises when the pixel layout does (line end plus 4), looks up at the
  split with Mario, turns to him for "Addendum." (Mario's line start), agrees with that too, and turns to the rival's
  cheer across the split (the lock's `synth:cheer` spot). It leaves with the cut to 12.01.

## Settings and times (this laptop, 2026-09-28)

| Deliverable | Engine | Size | Samples | Render time |
|---|---|---|---|---|
| Turnaround | Cycles CPU, 10 threads, OIDN denoise | 1920 x 1080 | 128 (adaptive 0.02) | 76.7 s |
| 4 s nod clip | Cycles CPU, 10 threads, OIDN denoise | 1920 x 1080, 48 drawings | 48 | 3,088 s (51.5 min): 64 s a drawing (max 80 s) |
| Pane insert, 11.04 | Cycles CPU, 10 threads, OIDN denoise | 400 x 400 crop of 1920 x 1080, 99 drawings x 2 passes | 64 clay, 24 shadow | 873 s (14.6 min): 5.2 s clay + 3.6 s shadow a drawing |
| Clean plate and real frames | the episode's Node pixel renderer | 480 x 270 at 2x, 278 frames x 2 | n/a | 15.9 s (both bundles and all 556 frames) |
| Composite and encode | Blender's bundled Python (numpy, OpenImageIO), then x264 CRF 16 | 1920 x 1080, 278 frames | n/a | 43.5 s (composite, encode, stills, sheet) |

In all, about 67 minutes of machine time, 52 of them the clip. The look check (earlier the same day, 960 x 540) compared EEVEE with Cycles and picked Cycles: EEVEE's soft shadows
came out grainy on the sweep. Every render ran through `ops/heavy.sh`, one heavy job at a time.

Why the clip is slow: the miniature depth of field over a textured sweep, plus subsurface clay filling two thirds of
the frame, keeps adaptive sampling from stopping early, so all 48 samples run on nearly every pixel. The turnaround
took 128 samples in 77 s because its plain, sharp background converges almost at once.

## What reads and what doesn't (the test's own verdict)

- **Reads:** the character. At native size it's unmistakably a clay figure under the launch light: the thumbprints,
  the wheel in its porthole, the squash and the happy-shut eyes all carry, the 2s cadence and the stepped push give
  it the stop-motion hitch, and the Kokoro take sits on the nod. The pane insert keeps the room and the people
  pixel, lands on the plinth, and takes its light from the pixel can light.
- **Doesn't yet:** under AgX on the grey sweep, the lit clay drifts toward salmon (#DB9783 on the key side, against
  #B8573A; the midtones sit on target). In the pane the clay is the most saturated, most finely rendered thing in
  frame, so at 1080p it can read as a figurine laid over the picture rather than a puppet in the room; its soft,
  anti-aliased edge is the tell beside the hard pixel edges. When it turns to Mario mid-word, the eyes and the "O"
  mouth read startled more than eager. The plinth contact is faint.
- **For a final:** keep the medium and the lock-driven timing. Grade the clay a half stop darker and a little
  redder, give its edge the pane's one-rung rim instead of a smooth anti-alias, and replace the turned "O" mouth with
  the open smile. The boil is real and the prints stay pinned through it, but it is gentle (a 1–3 % shimmer in the
  shading between drawings): right for the close clip, likely invisible at pane size, where it could be doubled.
  Those are one more look pass (the bible's own E1-P1 prototype), not a rebuild.

## How to re-run

From the repo root (each step can run alone; with no steps it runs all five, in this order):

```
studio/src/dev/blender/clod/run.sh [turnaround] [clip] [pane] [plates] [composite] [clean]
```

- Environment variables: `BLENDER`, `LOCK` (default `show/episodes/ep01/production/full-v3/lock/act1.json`),
  `SHOT` (default `11.04`), `SAMPLES_STILL` (128), `SAMPLES_CLIP` (48) and `SAMPLES_PANE` (64).
- Intermediates go to `out/lookdev/clod-3d/tmp/work/`. Frame sequences are deleted once they're encoded, and
  `clean` removes `tmp/` entirely.
- Single drawings, for a look: `nod_clip.py -- --only 36 --w 480 --h 270 --samples 16` or
  `pane_insert.py -- --only 20,60`.
- Needs Blender 4.5.3 and the studio's Node modules (esbuild, and the Remotion compositor's ffmpeg). Nothing else is
  installed.

## How the in-episode version would be rendered on a final lock

1. **Re-time from the final lock.** `pane_insert.py` reads everything it needs from the lock: the shot's start and
   end, CLOD's line (its start, end, word times and mouth track), Mario's next line, and the cheer spot. Every key of
   the performance sits relative to those marks, so `LOCK=<final lock> run.sh pane` re-times the whole hold with no
   hand edits. If the final cut gives the duel the bible's longer hold (1.A: about 30 s of clay through phrases 2–4),
   the boil's hashed order and the stepped hold cover any length without a visible loop. Cost: about 9 s a drawing,
   so a 30 s hold (180 drawings) is about 27 minutes.
2. **Render the clay and shadow passes** at the picture's size, cropped to the pane: RGBA clay and a shadow alpha
   per drawing, on 2s from the launch light.
3. **Composite inside the episode's renderer, not over its MP4s.** The clean way in is a small, additive hook next
   to the renderer's existing splice of browser-drawn frames (`render.ts`, `GLYPH_DIR`): the duel-split layout
   takes `clod: {hidden: true}` while the clay is on (instead of this test's bundle-time stub), the shadow alpha
   is stepped on the native 4 x 4 grid and applied to the 480 x 270 frame before the 4x upscale, and the clay layer is
   laid in after the upscale at 1920 x 1080, exactly as `composite.py` does now. The picture, the review frame and
   the SRT then all come from one pass, and the mix is untouched.
4. **Pin the geometry to the layout.** The foot position and the crop (`FOOT`, `CROP` in `pane_insert.py`) are
   derived by hand from `DUEL.clod` and the pane's offsets. For a final they should be read from `duel-split.ts` at
   build time, so a re-staged pane can't leave the clay floating off its plinth.
5. **Sound** (the bible's 1.A, for the sound pass): the can's clunk on the downbeat, a close, dry clay press on the
   bow's down key, a tiny wheel whirr in the pool while the light is on, and one felted-upright phrase. None of that
   is in this test; the mock-up carries the act's existing temp mix.
