# The Ep1 pixel pipeline

This folder turns any segment's stick timeline into the pixel picture: the cold open, Acts One to Four and the tag. A shot pass writes one file, `<seg>/shots.ts`, with one layout per shot. The pipeline does everything else: the timing lock, the band under the picture, Mas's V.O. line, rails, subtitles, lip-sync data, whips and other transitions, GLYPH frames, stand-ins for shots with no layout, reviewer slates, the review margin, the Node render and the Remotion compositions.

The pipeline is Act Four v5's (`../act4/animatic/`: `lock_v5.py`, `frame5.ts`, `render5.ts`), generalized. Act Four v5 runs on it as `act4-v5/` and draws the same frames, pixel for pixel. That was the test; the record is [pipeline.md](../../../../../show/episodes/ep01/production/full-v3/pipeline.md).

## What a shot pass does

1. **Lock the segment** (light). This writes `<seg>/data.ts` and `show/episodes/ep01/production/full-v3/lock/<seg>.json`.
2. **Write `<seg>/shots.ts`.** Export `SEGMENT = defineSegment({seg, lock: LOCK, layouts})`, with one layout per shot id.
3. **Build the segment's renderer and check it** (light). While any shot has no layout, `check` fails and lists it.
4. **Look at stills and the contact sheet** (light). Then render the picture (heavy, through `ops/heavy.sh`).

Re-lock whenever the stick timeline changes. Rebuild the renderer whenever anything changes, because the bundle is what renders.

## Commands

`S` is your own scratch folder, for example `/tmp/claude-1000/<session>/scratchpad/<your-pass>/`.

```sh
cd /home/jgon/project/art/mrmas

# 1. The lock (light, about a second). Takes default to the timeline's _source.takes; --takes is repeatable.
#    The mix is the temp track the render muxes: --mix-offset is the mix frame of the segment's frame 0
#    (a standalone stick reel's mix has a 3 s title card: 72).
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act1 --timeline show/reel/ep01-v3/act1.json \
    --takes audio/ep01/v3/act1/lines.json --mix audio/reel/ep01-v3/act1-mix.wav --mix-offset 0
#    It prints its checks and exits 1 if one fails. It never re-times anything.

# 2. Write studio/src/episodes/ep01/pixel/act1/shots.ts (next section). Touch nothing else in pixel/.

cd studio
# 3. Build and check (light, a few seconds)
node src/episodes/ep01/pixel/tools/build.mjs act1 $S/r-act1.cjs
node $S/r-act1.cjs check                      # exit 1: stand-ins, marks that did not resolve, layouts that throw,
                                              # tiling, the mix's length. --allow-standins for a partial pass
node $S/r-act1.cjs contact $S/act1-contact.png [native]   # one still per shot; red = stand-in
node $S/r-act1.cjs picstills $S/st 240 1200   # pictures (1920 x 1080); `stills` = review frames; `native` = 480 x 270 at 2x
node $S/r-act1.cjs ledger $S/act1-ledger.json # what every shot is built from
../ops/heavy.sh npx tsc --noEmit -p .         # the type-check (ignore src/dev/realism/bake)

# 4. Only if a layout returns GLYPH layers (or the segment has browser frames): the Remotion host draws those frames
node $S/r-act1.cjs glyphspan                   # which frames
../ops/heavy.sh node $S/r-act1.cjs bundle $S/bundle
BUNDLE=$S/bundle ../ops/heavy.sh node $S/r-act1.cjs glyphs $S/glyph-act1 2

# 5. Render (heavy). Default output out/ep01/full-v3/picture/<seg>.mp4, with <seg>.srt and <seg>.mp4.render.json beside it
GLYPH_DIR=$S/glyph-act1 SEGDIR=$S X264_THREADS=1 ../ops/heavy.sh node $S/r-act1.cjs picture --jobs 2
#    review [out.mp4] = the review frame (margin + transcript); both <review.mp4> <picture.mp4> = both in one pass
#    flags: --mix <wav> --mix-offset <f> | --no-audio · --slate 2 (a 2 s reviewer head slate, silent)
#           --opt subs=burn (burned-in subtitles) · --opt key=value (any segment option) · --from a --to b
```

Two more tools:
- **Compare two renders**: `node src/episodes/ep01/pixel/tools/mp4cmp.mjs <a.mp4> <b.mp4> 240 1200 ...` prints each file's H.264 stream md5 and the md5 of each listed decoded frame. Through `ops/heavy.sh` for a long frame list.
- **A throwaway segment in scratch**: write a `.ts` in your scratch that imports a scratch `data.ts` and calls `main(defineSegment({...}))` from `tools/render.ts`, then build it with `node src/episodes/ep01/pixel/tools/build.mjs --entry <that.ts> $S/r.cjs`. This renders a lock without touching `pixel/`.

Remotion directly, for a still of any segment (every `<seg>/shots.ts` registers itself, and nothing else needs editing):

```sh
npx remotion still src/episodes/ep01/pixel/entry.tsx ep01-pixel-act1-still $S/a.png --props='{"offset": 240}' --log=error
npx remotion still src/episodes/ep01/pixel/entry.tsx ep01-pixel-act1-still $S/b.png --props='{"offset": 240, "mode": "review"}' --log=error
```

The compositions are `ep01-pixel-<seg>` (the picture), `ep01-pixel-<seg>-review` and `ep01-pixel-<seg>-still`. Run any render of more than a few frames through `ops/heavy.sh`, with `--concurrency=4` or lower.

One bundle serves every segment. A `shots.ts` that throws when it loads is skipped, with a console error. But one that doesn't compile breaks the Remotion bundle for every pass, so build and `check` your own renderer before bundling.

## The shot spec: `<seg>/shots.ts`

```ts
import {defineSegment, layouts, held, mk, mouth, roomMouth, drawTexts, RH} from '../kit';
import {drawBullpen} from '../../../../shared/pixel/rooms/bullpen';
import {LOCK} from './data';

const L = layouts();
L.add('5.03', {
  st: 'rooms/bullpen (day) + cast/gerg-medium, the two desks, held',  // what it's built from: the margin prints it
  face: {GERG: 'lip', MAS: 'lip'},                                    // who shows a mouth in this framing
  marks: {push: ['w', 'e1-a1-5-01', 'shipping', 0]},                  // story marks, as anchors (below)
  draw: (fb, k, sh, f) => {
    drawBullpen(fb, 0, {door: 'shut'});
    gergAt(fb, mouth(sh, k, 'GERG'), k >= mk(sh, 'push', 999));
    drawTexts(fb, sh, k, {only: ['plate', 'ui']});                    // the lock's in-world text, default look
  },
});
L.add(['7.02', '7.02-back'], {...});                                  // one layout for a set-up and its return
export const SEGMENT = defineSegment({seg: 'act1', lock: LOCK, layouts: L.all});
```

### `draw(fb, k, sh, f)`

- **Where:** `fb` is the 480 × 270 show frame. Draw the room area, rows 0 to 202 (`RH` = 203). The band below is the host's.
- **When:** `k` is the frame inside the shot, from 0. `f` is the segment frame (`sh.s + k`).
- **Rules:** be pure. The same `(k, sh, f)` must always draw the same pixels, because Node and Remotion both render and chunks render in parallel. Use `held()` for a drawing that never changes.
- **Returns** (all optional): `{layers, full, noVo, noRail, noSubs, print}`.
  - `layers`: GLYPH layers.
  - `full`: you drew the whole frame, band included.
  - `noVo`: no V.O. line this frame.
  - `print`: `'blueprint'` or a function applied over the finished frame.
- **The show's rules** (studio/PIXEL_GUIDE.md): native resolution, the master palette, whole-pixel moves, held drawings. Nothing is scaled except a screen's own pixels. Never draw a text label as a stand-in.

### What `sh` (a `PxShot`, `types.ts`) carries

Every field is on the shot's own clock.

| Field | What it is |
|---|---|
| `id`, `setup`, `beats` | the stick beat id; its `shotId`; the beats merged into it (`cont`) |
| `tag` / `framing` | the stick's frame marker, e.g. `"TWO-SHOT · Mas and Gerg, desk to desk (held)"` |
| `cls`, `move` | the size class and cut/hold, for the margin |
| `lines[]` | every line heard in the shot: `s`/`e` (first sound / after the last), `words` `[w, f0, f1]` from `s`, `mouth` (the take's visemes), `face`, `kind` (`dialogue`/`vo`/`post`), `os`, `tag` |
| `carry` / `pre` | on a line: `carry` = it started in an earlier shot (an L-cut). `pre` = it belongs to a later shot and starts under this one (a pre-lap, the stick's negative `t`). `s < 0` = it started before this shot |
| `texts[]` | in-world text with a `kind`: `plate`, `card`, `label`, `ui`, `toast`, `sign`, `stamp`, `clock`, `ticker`. The device prefix is stripped. Rails and posts are not here |
| `spots[]` | the stick's sound spots `{name, k, dur}`, so a picture can land on a sound in the mix |
| `onscreen[]` | the stick's onscreen items as written, rails and posts included |
| `cast[]` | the stick's characters `{id, pose, x, from, until}` |
| `speak[]`, `names[]`, `fg`, `set`, `room`, `style`, `fx`, `cues`, `kind`, `slate` | as in the stick timeline |
| `marks` | the resolved story marks, in shot frames |

### Marks: anchors

Declare marks as `marks: {name: anchor}` on the layout. The host resolves them at load time on the lock, so a mark lands on the sound in the mix. `tools/lock.py` uses the same grammar for a plan file. Offsets are in frames.

| Anchor | Resolves to |
|---|---|
| `['f', n]` / `['len', off]` | n frames in / the shot's end + off |
| `['snd', name, n, off]` | the n-th sound spot of that name |
| `['txt', substr, 'at' \| 'until', off]` | an onscreen item's start or end |
| `['on' \| 'end', lineId, off]` | a line's first / last sound |
| `['w' \| 'we', lineId, word, off]` | a word's start / end (`'word#2'` = the 2nd) |
| `['speak', who, 'at' \| 'end', off]` | a silent speaking highlight |
| `['beat', beatId, off]` | a merged beat's first frame |
| `['mark', name, off]` | another mark of this shot |

A mark that doesn't resolve is listed by `check`, which exits 1. Read marks with `mk(sh, 'name', fallback)`.

### Mouths: `face` and `lipsync.ts`

The framing decides who shows a mouth, not the take. Set `face: {WHO: 'lip' | 'room' | null}`; speakers not named show none.

| Call | Use |
|---|---|
| `mouth(sh, k, WHO)` | a drawn viseme track (busts, tiles, mediums) |
| `roomMouth(sh, k, WHO)` | open/rest at room scale, flapped on the take's syllables |
| `talking(sh, k, WHO)` | a speaking ring or spinner (no face needed) |

- **The conventions are Act Four v5's:** the mouth leads its sound by one frame, and no drawing is held under two frames (production/act4/lipsync-v5.md).
- **A line with no take** gets a track built from its words; the lock logs which ones.

### What the host adds

These are options on `defineSegment({options})`, or `--opt` at render time.

| Option | What it does | Default |
|---|---|---|
| `vo: 'typed'` | Mas's V.O. as pov-and-framing §5.2 has it: one lowercase line directly above the band (x 12, baseline 198), his cyan one step down, 1-px shadow, typed at 0.5 characters a frame, held 15 frames. A line wider than the frame wraps upward, and `check` lists it (§5.3 asks for 45 glyphs at most). Frame V.O. shots so rows 182–203 sit on shadow, and keep your own text out of those rows. `noVo` turns it off for a frame | on |
| rails | the lock's rails, typed into the band | always |
| `badge` | Act Four v5's HIS SIDE / THE BOARD'S SIDE chip (v3 drops it: v3-plan §1.4) | off |
| `subs: 'burn'` | dialogue subtitles burned into the band's foot. Every render also writes `<seg>.srt` (dialogue, and the V.O. in lowercase italics) | off |
| `standin: 'stick' \| 'plate'` | what a shot with no layout draws | stick |

- **Transitions:**
  - `whip: 'in' | 'out'` on a layout: Act Four's 2-frame whips.
  - `enter`/`exit: {kind: 'dip' | 'flash' | 'dither', frames}`: `dither` is a bayer dissolve into the next shot's first frame, pixel-pure.
- **Stand-ins:** a shot with no layout, or whose layout throws, draws a STAND-IN: the stick figures of its cast on a plain set, its in-world text, and a red tag in the picture. It is never silent. The renderer prints a banner, `render.json` lists it, the review margin marks it red, and `check` fails on it.
- **Reviewer slates:** a stick card whose caption or cue says "reviewer" is drawn as a slate marked "not part of the show". `--slate <s>` adds a head slate to a render, and the audio waits for it.
- **GLYPH:** a layout with `glyph: true` may return GLYPH layers. The Remotion host draws true glyph tokens there, and the Node render splices those frames in (`glyphs`, then `GLYPH_DIR`). Without them it draws v4's 2-pixel stand-in marks and says so.
- **Browser frames:** `browser: {frames: (f, opts) => ...}` plus a `<seg>/browser.tsx` exporting `BROWSER = {Component}` hand whole frames to a React component in Remotion. This is Act Four's J1, off by default.
- **The review frame:** the show frame at 3x, the editor's margin and the transcript band. `review: {...}` on the segment renames its labels (`spec.ts ReviewConfig`).

## Files

| File | What it is |
|---|---|
| `tools/lock.py` | the lock (generalized `lock_v5.py`): timeline + takes (+ plan) → `<seg>/data.ts` and `full-v3/lock/<seg>.json` |
| `types.ts` | the lock's schema (`PxShot` has every Act Four `ShotV5` field) |
| `spec.ts` | the shot-spec interface: `Layout`, `LayoutOut`, `SegmentOptions`, `ReviewConfig`, `defineSegment`, `layouts` |
| `kit.ts` | one import for layouts: the spec, lip-sync, text, the pixel font, held drawings, framing moves |
| `frame.ts` | the host: `prepare`, `native`, `picture`, `review`, `glyphFrames`, `browserFrames`, `srt` |
| `anchors.ts`, `lipsync.ts`, `text.ts`, `standin.ts` | marks, mouths, in-world text and the review face, stand-ins and slates |
| `Host.tsx`, `frames.ts`, `entry.tsx` | Remotion: the host component, the auto-registered compositions, the entry |
| `tools/render.ts`, `tools/build.mjs` | the Node renderer, and the per-segment bundle builder |
| `tools/act4check.ts` | the port test: `frame5.ts` against this pipeline on Act Four v5, every frame |
| `tools/mp4cmp.mjs` | two renders compared: the H.264 stream md5 and decoded frames |
| `act4-v5/` | Act Four v5 on the pipeline (plan.json reads lock_v5.py's tables; shots.ts wraps shots5.ts; browser.tsx = J1) |
| `example/` | the worked example on the v3 stick sample: three placeholder layouts, the rest stand-ins. Not a segment of the show |

## Limits

These are measured, not guessed. The full list is in pipeline.md.

- **Nothing here has been watched.** The test is pixel equality with v5, and stills were looked at.
- **Browser frames can't be drawn in Node.** A GLYPH frame without its Remotion PNG draws stand-in marks, and the render reports it.
- **Lines with no take** get a mouth built from their words, not from phonemes.
- **The default in-world text** (`drawTexts`) is serviceable, not art. It keeps above row 180, and plates, posts and UI with a story role should be drawn by the layout.
- **Import committed art only.** The art passes' new modules in `shared/pixel/` may change while they work; check with `git ls-files`.
