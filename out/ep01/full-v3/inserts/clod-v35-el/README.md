# CLOD in 3D: the final insert for Ep1 11.04 (EL lock, 2026-09-28)

The showrunner approved the 3D clay CLOD ("yes i want the 3d clod") and kept the medium clash ("the contrast is part of
the charm for cases like this"). This folder is the final insert for the final film's Act One. It is rendered on the
ElevenLabs-timed lock and delivered as RGBA layers for the episode's own renderer to composite. It is not laid over
any MP4.

**Where it plays:** scene 21, "GTP-4, and CLOD the same day" (proposal-v35.md), shot **11.04**, the split's phrase 2.
The clay CLOD stands in the lighthouse pane from the moment the launch light slams on to the cut to the wall TV
(v35-22.01). It says "You're absolutely right!", looks up at the split with Mario, agrees with "Addendum." and turns to
the rival room's cheer.

## What changed from the test (out/lookdev/clod-3d/)

**Only the expression.** The puppet, clay, prints, boil, squash, bow tie, clipboard, wheel, Cycles, samples, the pane's
light, the camera, the grade (0.88, 0.78, 0.74) and the stepped two-rung shadow are the test's, untouched. It is not
graded to the pixel art, has no pixel rim and is not down-rezzed. The clay is laid in at 1920 x 1080, as in the test.

- **Mouth:** the turned "O" is gone. Every open shape of the take is now the **open smile** (`clod_rig.mouth_of`), and
  between sounds it's the closed smile. The "O" piece is still built but never shown.
- **Eyes:** there's a new replacement piece, **warm eyes**: a half-moon, with the dot's round top over a lower lid
  pushed up flat by the cheeks (`clod_rig._warm_eye`). It replaces the tall dots, which read startled, through the line,
  CLOD's rise and his agreement with "Addendum.". The tall dots stay only for the two looks away: up at the split, and
  across at the cheer.
- **Happy-shut eyes** now run through each nod and its hold, where the test shut them only for the squash. With the
  head pitched forward, open eyes read as a frown there. The order through the line is warm on "You're", happy through
  "AB-solutely" and its hold, warm as the head comes up, happy on "RIGHT", then warm on the rise.
- `preview/expression-before-after.png`: left, the test at k20 (the Kokoro lock, the "O" and the tall dots); right,
  the final at k20 on the EL lock (happy eyes, the open smile). Top: the pane at 2x. Bottom: the face at 4x.

## Timing: from the EL lock, not by hand

- **The lock:** `show/reel/ep01-v35-el/ep01-v35-el-act1.json` (key `ep01-v35-el-stick`; Act One, 10,947 frames), run
  through the pipeline's own `tools/lock.py` into a work file. The episode's `lock/act1.json` and `act1/data.ts` were
  not touched.
- **11.04** is segment frames **10046–10295** (250 f). CLOD's line is k8–39, "absolutely" starts at k13 and "right" at
  k31. Mario's "Addendum." is at k74, and the cheer is at k112.
- **The insert covers k6–249 = frames 10052–10295** (244 frames, 10.17 s): **122 drawings, on 2s** from the launch
  light (the layout's own mark: the line start minus 2). The deep nod lands on "AB-" (k16, squash 0.93), the second
  nod on "RIGHT" (k34), and CLOD rises at k43. He turns to Mario for "Addendum." (k72) and to the cheer (k118).
- **The take:** the EL lock plays CLOD's ElevenLabs take `e1-a1-11-02__clod-A.wav` (the test used the Kokoro take
  `e1-a1-11-02.wav`). That take has no viseme track, so the mouth is timed from the take's own loudness, one frame
  early and on 2s: the open smile on k8–13 and k18–33, and the closed smile on k14–17 (the "b" of "absolutely", the
  bottom of the squash) and after the line.
- **The eyes, by frame (on 2s):** warm on k6–13, happy on k14–29, warm on k30–33 and happy on k34–43. Then warm on
  k44–55 (the rise), the tall dots on k56–67 (looking up at the split), warm on k68–85, happy on k86–91 (the nod to
  "Addendum."), warm on k92–97, and the tall dots from k98 (the cheer), with one happy blink at k176–177.

## The files

| Path | What |
|---|---|
| `manifest.json` | The overlay: the seg, shot and beat id (`11.04`), the lock key and timeline (with its SHA-1), the shot's frames and length, the check line (`e1-a1-11-02` at k8–39), the marks and the take. `frames` lists all 244 frames (`k`, segment frame `f`, and its `layers`) |
| `shadow/s<frame>.png` | 122 layers, 1920 x 1080 RGBA, straight alpha: the shadow on the pixel plinth and floor, averaged on the native 4 x 4 grid, in two rungs toward PAL.N2 (the test's own arithmetic) |
| `clay/c<frame>.png` | 122 layers, 1920 x 1080 RGBA, straight alpha: the clay, graded as in the test |
| `logs/render-log.json` | Blender's log: the crop, the marks, the mouth track, the eye windows, and the seconds for each drawing |
| `preview/` | The final pane over the current Act One picture, drawn by the episode's own renderer through the new overlay stage (see below) |

`<frame>` is the drawing's first segment frame, so each file serves two frames.

## The renderer hook (smallest clean one; it does nothing unless a layout declares it)

- **`studio/src/episodes/ep01/pixel/spec.ts`:** `Layout.overlay?: {manifest: string}`.
- **`studio/src/episodes/ep01/pixel/tools/render.ts`:** an overlay stage. After a frame is drawn, and after any
  browser-frame splice, the stage lays the shot's declared layers over the picture (4x, 1:1) and the review frame (3x,
  nearest), in the room area only (above the band), bottom layer first.
  - **The same stage runs in `stills` and `picstills`.** `check` reports each overlay: accepted, refused or missing
    files. The picture's `render.json` summary counts the frames overlaid.
  - **It refuses the whole overlay, loudly** (stderr, `check`, the render summary), when the manifest's shot length or
    its check line's start differ from the lock being rendered. So a re-cut shot can't carry a stale insert.
  - **For a shot with no `overlay`,** `overlayOf` returns null and the frame is untouched. Checked: Act One's current
    code, rendered with the HEAD `render.ts` and with this one, gives byte-identical pictures (see "Checks").
- **`studio/src/shared/pixel/rooms/duel-split.ts`:** `clod: {hidden: true}` skips the pane's pixel CLOD. The light,
  cone, pool and plinth stay. This replaces the test's bundle-time stub.
- **The Remotion host (browser)** doesn't read overlays. There, 11.04 shows the empty plinth under the light. The
  picture comes from the Node renderer.

## The declaration Act One needs (act1/shots.ts, shot 11.04: one line added, one expression changed)

```ts
L.add('11.04', {
  overlay: {manifest: 'out/ep01/full-v3/inserts/clod-v35-el/manifest.json'},   // the 3D clay CLOD, launch light to the cut
  st: ...,                                                                      // (as now)
  marks: {clod: ['on', 'e1-a1-11-02', -2], ...},                                // (as now: c0 = the launch light = the insert's k6)
  draw: (fb, k, sh, f) => {
    ...
      right: {light: k >= c0 ? 1 : 0, clod: k >= c0 ? {hidden: true} : {}, mario, scroll: ..., f},
```

The second line replaces today's `clod: k >= c0 && k < c1 + 4 ? {pose: 'bow', smile: true} : {}`. The pass's lock
must be the EL-timed one (11.04 = 250 f, CLOD's line at k8). Otherwise the renderer refuses the overlay and says why.
Then run `check`, which should list `11.04: overlay on 244 frames`.

## Preview (the final pane over the current Act One picture)

The preview is built by `studio/src/dev/blender/clod/preview-build.mjs`: Act One's current `shots.ts` (the picture pass
in progress, as it stood at render time) on the EL lock, with the declaration above applied at bundle time, rendered by
the episode's renderer with the new stage.

- `preview/clod-v35-el-in-act1-9996-10320.mp4`: frames 9996–10319 (13.5 s). That's the last 50 frames of 11.03 (pixel
  CLOD, unlit), all of 11.04, and 24 frames of the wall TV. The sound is a preview-only temp mix (the EL act bed plus
  the lock's takes at their frames, `preview_mix.py`), not the episode's mix.
- `preview/clod-v35-el-sheet.png`: 8 pictures at half size, left to right and top to bottom:
  - 10040: 11.03, the pixel CLOD unlit.
  - 10054: the light on, "You're" (warm eyes, the open smile).
  - 10058: drawing up before the nod.
  - 10062: the squash on "AB-" (happy, closed).
  - 10072: "-lutely" (happy, the open smile).
  - 10090: risen (warm).
  - 10132: agreeing with "Addendum." (happy).
  - 10196: turned to the cheer.
- `preview/clod-v35-el-f10058.png`: one full 1080p picture.
- `preview/expression-before-after.png`: see above.

## Checks

- **The expression:** one check render on the Kokoro lock at k20 and k72, the test's exact poses. The "O" became the
  open smile there, but the first warm eye (a pointed crescent) turned into a frowning wedge while the head was
  pitched forward. So the eye became the round-cornered half-moon, and the nods keep happy-shut eyes through their hold.
  The first drawings of the final render confirmed it (k10 warm; k20, k24 and k26 happy with the open smile).
- **The hook does nothing without a declaration:** Act One's current code on its current lock, no overlay declared,
  rendered with the HEAD `render.ts` and with this one. 6 pictures (frames 120, 4000, 9990, 10000, 10100 and 10200;
  the last four inside 11.04) and 1 review frame came out **byte-identical**.
- **A wrong lock is refused:** the same declaration on the Kokoro lock (11.04 = 252 f) makes `check` fail with
  `11.04: overlay refused: made for a 250-frame 11.04; this lock's is 252 frames`, and renders print `OVERLAY REFUSED`.
- **On the EL lock:** 244 frames overlaid, 0 missing, 0 refused. The pixel CLOD is hidden from k6, and the clay stands
  on the pixel plinth at the test's foot position (1282, 710). The shots.ts that was current when the preview was
  built had MD5 `7cfb4015`.
- **`tsc --noEmit`:** 20 errors, all the known ones (bake.ts 11, runway pxframes 5, streamframes 4). None are in
  `spec.ts` or `duel-split.ts`; `render.ts` is `@ts-nocheck`.

## Render times (this laptop, 2026-09-28; every render through ops/heavy.sh, one at a time)

| Job | Engine and settings | Time |
|---|---|---|
| Expression check, 2 drawings (Kokoro lock, k20 and k72) | Cycles CPU, 10 threads, OIDN; 64 clay / 24 shadow samples; the 400 x 400 crop of 1920 x 1080 | 25.4 s |
| First final pass, stopped after 8 drawings to lengthen the happy eyes | as above | about 70 s |
| **The final insert, 122 drawings x 2 passes** | as above | **908 s (15.1 min)**: 4.5 s clay + 2.9 s shadow a drawing on average (clay max 7.4 s), with the machine shared with other passes |
| Layers and manifest (`insert_layers.py`) | Blender's Python (numpy, OpenImageIO) | 48 s |
| The hook's checks (14 stills, `check`) | the episode's Node renderer | 14 s |
| Preview: bundle, 9 stills, the 324-frame picture, mix, mux and sheets | the episode's Node renderer (55.6 ms a frame, 1 worker) | 40 s |

In all, about 18 minutes of machine time, 15 of them the insert. The Kokoro base lock was not rendered (see "Re-run").
The intermediates (the 400 x 400 crops, the work lock, the bundles and the stills) were deleted. The deliverable is
about 10 MB: clay 8.1 MB and shadow 1.5 MB.

## Re-run

From the repo root (`FINAL_WORK` defaults to `out/lookdev/clod-3d/tmp/final`; `run.sh clean` removes it):

```
studio/src/dev/blender/clod/run.sh final-lock final-pane final-layers final-preview
```

To render the **Kokoro base lock** as well (not rendered: the EL version ships), point the steps at
`FINAL_TIMELINE=show/reel/ep01-v35/ep01-v35-act1.json FINAL_KEY=ep01-v35-stick FINAL_OUT=out/ep01/full-v3/inserts/clod-v35-kokoro FINAL_BED=audio/reel/ep01-v35/act1-bed.wav`
(11.04 is 252 f there, with 123 drawings; about 17 min).
