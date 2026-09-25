# Ep1 · Act Four · FX kits: usage notes (motion graphics / FX)

*Builder: motion-graphics / FX. 2026-09-25. Four shared kits in `studio/src/shared/pixel/kits/`, previews in `studio/src/episodes/ep01/act4/kits/`, renders in `out/ep01/act4/assets/kits/`. The demos follow the storyboard (`shotlist.md` board 1) where it is specific.*

## Files

| Kit | Module | Covers (shot list ids) |
|---|---|---|
| THE PLAN blueprint | `kits/blueprint.ts` | `kit.blueprint`: 24.02, 25.01–25.07, 27.16, 27.35 (the sheet on the table uses the same lettering) |
| Video-call grid | `kits/callgrid.ts` | `kit.call-grid`, `kit.dialog-1993` (colour version), the security tile of 27.26 |
| Falling stack + counters | `kits/avalanche.ts` | `kit.falling-stack` (27.09–27.10, 29.14–29.20, 30.03), `prop.odometer` (29.05) |
| Act-four props | `kits/props.ts` | `prop.hourglass`, `prop.guest-lanyard`, `prop.pen`, `prop.zero-box`, the lobby sign, the tally, the fires, the extinguisher spray and pin tag |

- **Preview (mine, don't import it into scenes):** `episodes/ep01/act4/kits/`:
  - `plan.ts`: sc 25 on its real clock, plus the 24.02 flash-print.
  - `demos.ts`: call, hearts, tiles, props and extras.
  - `standin.ts`: an unused placeholder suite.
  - `entry.tsx`, `frames.ts`, `Kits.tsx`: the Remotion entry and compositions.
  - `tools/preview.ts`, `tools/audit.ts`, `tools/bpcheck.ts`, `tools/flashcheck.ts`: Node tools.
- **Compositions:** `kits-plan` (1080 f), `kits-flash` / `kits-flashtrace` (60 f), `kits-call` (288), `kits-hearts` (408), `kits-tiles` (480), `kits-props` (240), `kits-extras` (192). For a still, pass `--frame=N`.

## How to use (per kit)

### Blueprint (`blueprint.ts`)
- **Colours.** Draw the sheet in the **proxy** master colours `BPX.*`. `BLUEPRINT` pins each proxy to its output colour `BP.*`: navy `#0B1E3F`, ink `#7FDBFF`, plus a hand-set ramp of faint, mid, hot, shade and the paper's back.
  - Either finish with `bpComposite(fb, sheet, {behind, curl, tear})`, or pass `palette={BLUEPRINT}`.
- **24.02 flash-print.** Use `{type:'palette', to: BLUEPRINT_PRINT}` (whole frame, one beat). It is a threshold plus one clustered pattern (like the freeze print), with skin solid.
  - `traceBlueprint(frame)` turns the frame into real line art and reads far more like a blueprint; see `blueprint-01b-trace-alternative-24-02.png`. It is a filter, though, not a per-colour lookup (PIXEL_GUIDE §1), so it is **a showrunner call**. The default is the print.
- **Sheet.** `bpSheet(b, {reveal})` draws the paper, grid, border and zone letters. For 25.01, `sheetReveal(k)` gives rows, then columns, then the border, as 3 held steps. `bpTitleBlock` holds zero-read eggs.
- **Draw-on.** Build a path with `linePts`, `polyPts`, `rectPts`, `ellipsePts` or `loopPts`, then `inkPath(b, pts, drawOn(f, t0, len, speed), col)`. It reveals whole pixels behind a hot pen tip.
  - `bpText` types lettering on, with a pen block and an optional underline. It has its own `~` glyph (the engine font has none).
- **Pieces.**
  - Structure: `bpBox` (label tab `top`/`bottom`, `double`), `bpArrow` (hatched fill), `bpBanner`, `bpDim`.
  - Marks: `bpStamp` (7 / 14 / 28 px lettering (`huge`), a 1 px kick on landing, wear that never breaks a 1 px stroke), `bpCheck`, `bpRing` (circle one item per beat).
  - Labels: `bpLeader`, `bpCallout` (figures speak in drafting callouts: the typing is the lip-sync).
- **Figures.**
  - `bpChair` (elevation): `sit`, `stand`, `walkA`, `walkB`; `bolts` (MADA's egg); `sticker` (DRUH: a plain rosette, no logo, no date).
  - `bpChairTop` is the plan-view symbol for 25.03; `mark` rings a voter.
  - `bpWalker` draws the door, paper, spinner and square: `k: 2` redraws it twice the size for 25.05 (never a scale), `bright` brightens NELEH's paper on her line. `walkStep(f, t0, t1, 2)` gives walks on 2s.
  - Also `bpMoth` (0 → 2), `bpKeyRing`, `bpFence` and `bpSpinner`.
- **The break.**
  - Chalk: `bpChalk(b, x, y, k, {held: true, size: 2})` grows in 3 held drawings, squeaks, snaps, and drops a crumb off-frame. It returns its phase, which gives the SFX cues `chalk_squeak` and `chalk_snap`.
  - Curl: `curlAt(k)` gives 4 held drawings. The BASE frame shows under it, and neon catches the lip.
  - Tear: `tearAt(k, 8)` runs the crack left to right with a hot render-front head, then the halves part in about 10 frames. Both go through `bpComposite` with `behind` = the BASE frame (`drawLaptopInsert`).

### Call grid (`callgrid.ts`)
- **Layout.**
  - `gridLayout(n)`: 5 → 3 + 2, 4 → 2 × 2; tiles are 150 × 84.
  - `slideTiles(from, to, f, t0)`: the gap closes in held steps.
  - `callChrome(b, {title:'board sync', clock: null})`: the clock is blanked per the salvage note.
- **`drawTile(b, {x,y,w,h, id, name, vote, speaking, muted, level, grey, frozenAt, open, hand}, f)`.**
  - `id`: `mas | alyi | neleh | mada | off | gerg | rima | face | blank`.
  - `vote`: 0–3, the flip drawings (`voteFlip`).
  - `open`: frames since the tile started opening; it opens in 3 held steps (26.01, 27.03).
  - `frozenAt`: freezes every loop mid-cycle (26.08: the footnotes stop mid-orbit, the spinner stops).
  - Ported painters: Mas (the Strip's neon), ALYI (a doorway, only a reflection in its glass), NELEH (bookshelf, a glowing charter, footnotes orbiting on 2s), MADA (arms folded, a spinner), THE QUIET VOTE (black, `camera off`).
  - New painters: GERG (green laptop glow), RIMA (roll-call art cropped to a webcam), and employee faces (seeded; `hand` 1/2 is the raised hand of 27.06).
- **The fall.**
  - `captureTile(state, f)` → Img.
  - `tileDrop(fb, img, x, y, k, {grey: true})` returns the GlyphLayer. It is four drawings on 4s (f0 / 4 / 8 / 12) plus the 20-frame GLYPH dissolve (Ep1's use 2 of 2).
  - `tilePlate(b, x, y + dropY(k))` is the emptied grey plate that keeps falling. `plateFallY` gives 26.11's 4 px per held step.
- **UI.**
  - Indicators: `micIcon`, `micChip` (the live mic without a tile), `speakingRing`, `typedDots` (26.03: one dot per 4 frames, then it stops).
  - Messages: `callToast` (27.01–02), `postChip`.
  - `spotlight(b, rect, cx, cy, r, find, {leave})` is hard-edged with no glow: it finds a tile in 3 held drawings and drifts off in 3 (27.03, 27.05).
- **Dialog.**
  - `callDialog(b, x, y, {w, head, grey: 0..3, cancelDown, okDown})` is the 1993 alert's frame in full colour, with no icon. `grey` greys Cancel out one dither step per level (30.24).
  - `dialogButton` returns the button rects; `drawPointer` and `pointerAt` move the board's arrow.
- **CCTV (27.26).** `cctv(b, rect, f, {label, post})` applies CCTV greys, row scan, brackets and a REC dot, and puts the post **upside-down** in the corner (a pixel-exact flip).
- **Also.** `CALL_GREY` (only Mas's falling tile greys, per the board) and `spinner` / `spinnerDots`.

### Falling stack (`avalanche.ts`)
- **Tiles (29.14–29.20).**
  - `planGridStack({x0, y0, cols, rows, pitch, reserve, t0, spawnAt})` is precomputed once; memoise it. It fills bottom-up behind a smoothed ragged front, never lands a tile before the one under it, and reserves the board's tiles. `openAt` fills a shoved tile's hole later.
  - `drawGridStack(b, plan, f, opts, paint, press)` draws it. Landings kick 1 px, and `press` gives the 1 px nudges toward MADA on every beat.
  - `landedBy(plan, f)` drives the counter. The demo's layout (40 × 21 slots of 12 px, MADA 13 × 7, the counter chip 4 × 1) lands on **exactly 745 / 770**.
- **Pressing and scattering.** `shove(f, t0)`: the tile is nudged, resists for 1 beat, then slides off in whole-px steps on 2s. `scatter(... {digits: true})`: NELEH's footnotes fly like sparks.
- **Hearts (27.09–27.10).**
  - `reactionBurst` is one heart in the tile corner, then ten.
  - `planPile({x0, x1, t0, ceiling, spawnAt})` is the pour: a staggered lattice of mixed sizes filled bottom-up with slow swells. It buries everything; each heart is one held sprite.
  - `withBlueHeart(plan, x, y, after, fromX)` adds exactly **one** blue heart, last and slow, optionally drifting in from above RIMA's tile.
  - `drawPile(..., {blue: 'skip'})` leaves the blue heart to the scene so it can ride the spinner. `pileTopAt` returns the surface, for anything riding it (the demo floats MADA's spinner on the pile).
- **Also.**
  - `floatHearts` is 30.03's three hearts, one per beat.
  - `odometer` (the launch-night drums) and `odoRoll(f, LETTER_STOPS(t0, 15))` give 505 · 650 · 700 · 745 / 770. `clunk` is true on each stop: that's the SFX cue.
  - `heartCounter`, `drawHeart`.

### Props (`props.ts`)
- **The hourglass.** `hourglass(b, x, y, {size: 'L'|'S', moved, running, pose, shatter})`.
  - Sand moves exactly one grain per `moved` step, so the scene passes the beat count for one pixel per beat.
  - `hourglassFlip(k)` gives the 3 drawn states (upright, side, flipped) plus a hop. Nothing is rotated.
  - `shatter` breaks only the glass: the shards fly, the sand holds its shape for one beat, then slumps in 3 drawings. Every drawing holds the same grain count.
- **The lobby sign.** `lobbySign(b, x, y, {days, lit: signLight(k)})` lights in held steps (2 flashes at most). `digitPlate` draws a plate; `zeroBox` is the box of spare zeros.
- **The tally.**
  - `tally(b, marks, {lit})` carves into whatever wood is already there. The groove is a family step of the surface, so it lights like the desk. It has old and faint marks and new, clean ones; `carve` is 0..1, so pass 4 held values for 26A.01. It ends with one wood curl.
  - `tallyRoom` is the wide's 1 px marks. `woodGrain` is the ECU surface, and it also works for the F1.2 dither-to-grain handoff.
- **The pen.** `pen(x, y)` is the MACROSOFT check pen with its steel clip, drawn at the carving angle.
- **Fires and the extinguisher.**
  - `fire(b, x, y, 'S'|'M'|'L', f, {seed, glow})` is a 3-drawing loop on 4s with a red lick outline, an orange body, a yellow core and a W8 heart. Give each fire a different `seed`.
  - `fireOut(..., k)` steps down L → M → S → ember → smoke.
  - `spray` is the extinguisher puff. `pinTag` is the pin with its tag, readable: `DO NOT REMOVE`.
- **The GUEST lanyard.** `guestBadge(b, x, y, 'insert'|'desk')` is a 64 × 42 card with GUEST in 14 px, a red band and a red strap. `guestWorn` is the room-scale version. No brand appears on it.

## Checks run
- **Photosensitivity.** `tools/audit.ts` measures mean-luminance jumps over every frame of every demo. None reaches 0.1, so there are 0 flashes in any 24-frame window. The largest jumps, 0.089, are the dialog popping and the 24.02 print. Pops are ≤ `BP.hot`, the lightest pixel colour.
- **Types.** `tsc` is clean on all kit and preview files; the repo's other pre-existing errors are untouched.
- **Guardrails.**
  - Parody names only.
  - The call app and the dialog are generic: no real UI, no icon, no OS look.
  - DRUH's sticker has no logo and no date. NOVIHS is a name only.
  - Only two figures appear on the blueprint: `~$10B (REPORTED)` and `EQUITY: 0`.
  - The employee faces are generic and seeded, with no likenesses.

## Known issues / for the next stage
1. **Engine font.** It has no `…` or `~`. The kit draws its own tilde (`bpDrawText`); the other demos write `...`. The post UI (`kit.post-ui`) will need `…`, so consider having the engine owner add both glyphs to `font.ts`.
2. **Overlaps with the rooms builders.**
   - rooms-b's `darkroom.ts` draws its own room-scale tally and lanyard. rooms-a's `boardroom.ts` draws its own fires (`drawFire`) and the blueprint on the table.
   - They work as wides. For one look across wide and insert, have them call `fire()`, `tallyRoom()` and `guestBadge('desk')`, and use the blueprint's lettering. That's their decision; I have not touched their files.
3. **The demo's dependency.** `plan.ts` imports rooms-a's `drawLaptopInsert` read-only. If its signature changes, the demo breaks, but the kit does not.
4. **The tear.** It is a diegetic paper tear whose crack runs as a render-front head, so it reads as in-vocabulary per the board's note. The curl is a paper peel. The script calls for both, but they are outside PIXEL_GUIDE's four-transition list, so keep them to 25.07 only.
5. **Not in this brief.** The shot list gives these to "kits", but I did not build them:
   - kits: `kit.cards` (name cards, quote cards, the act-out card, the rail), `kit.post-ui`, `kit.portrait-layout`.
   - props: `prop.phone`, `prop.wallet`, `prop.throne-handset`, `prop.rent-meters`, `prop.check-evirht`, `prop.arrow-sign`, `prop.labelled-desks`, `prop.extinguisher` (only the pin and the spray are here), `prop.term-sheet`, `prop.gerg-laptop`, `prop.q-vault`, `prop.nameplate-alyi`, `prop.observer-chair`.
6. **Timing.** The demos are condensed (except sc 25, which is on its real 1080 f clock). Scene builders set the real timing and pass `k` and `f`. The heart pile's end time depends on `spawnAt`; the demo's `Math.pow(i, 0.62) * 1.05` buries a 480 × 270 frame in about 140 frames.
