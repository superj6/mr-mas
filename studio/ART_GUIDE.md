# MR. MAS — Art Guide for builders (v0.2, style-spectrum phase)

> **Render policy (showrunner, 2026-09-25):** 1080p (1920×1080) is the maximum render size. Never render 4K or use `--scale` above 1 for deliverables. Previews may use `--scale=0.5`.

## Goal right now
Produce a **style spectrum** the showrunner can pick from: the same assets (Mas, Nole, the dark-room
cold-open set with THE ORB, the MR. MAS title) rendered in ~9 styles, each with a 3 s motion test and an
honest note on rigging limits. Must look like a real show's lookdev, not an explainer video.
The user's notes so far: the outlined big-eyed cartoon look is **too cartoony**; wants **interesting**,
**diverse** options (pixel art, anime, closer to realism, …), but only things we can **realistically
animate** without looking amateur.

## What we can animate (all styles share this)
- 2D rigs: parts on pivots (head, jaw, eyes, lids, brows, arms), replacement mouths (6-9 shapes),
  blinks/eye darts, breathing, spring follow-through on hair/strings, 2-3 drawn head angles swapped on
  cuts/smears. **No continuous 3D head turns, no cloth sim, no full-body acting.**
- Strength = composition, lighting animation (monitor flicker, rim light), camera moves/parallax,
  texture boil, typography, timing. Limited animation that looks *intentional*.

## Code layout (Remotion 4, React 19, TS)
- `src/shared/tonal/types.ts` — TONAL RIG format: a back-to-front list of flat planes
  `{d, tone 0..4, hue, line?, angle?, transform?, light?}` + a hue table. Tone 0 = deepest shadow, 4 = highlight.
- `src/shared/tonal/masTone.ts` — reference tonal rig (Mas). Params: lookX/lookY/lid/mouth/brow/tilt/turn.
  **Copy its conventions**: 3/4 view facing screen-right, key light from screen-right (the monitor),
  local units with crown ≈ y-230, chin ≈ y180, bust crop y560, head width ≈ 310.
- `src/shared/tonal/ToneSvg.tsx` — vector renderers: paint | noir | engrave | riso (and soon soft).
- `src/shared/tonal/ToneCanvas.tsx` — raster renderers: glyph | pixel | dither | stipple.
- `src/shared/tonal/styles.ts` — style tokens (paper, ink, spot color, grain).
- `src/shared/draw/*`, `src/shared/fx/*` — older outline kit (Shape/Line/Fill/Figure), Grain/Paper/Vignette.
- `src/shared/theme/fonts.ts` — bundled fonts (see FONT map). `src/shared/timing.ts` — 96 BPM / 24 fps grid.

## Rules for parallel builders (important)
1. **Only edit files you own** (listed in your task). Never edit another builder's files or shared files
   you weren't assigned; if you need a helper, put it in your own folder.
2. Each builder gets its own dev entry: `src/dev/<key>/entry.tsx` that registers only its frames via
   `makeRoot(frames)` (see `src/dev/_example/entry.tsx`). Deliverable frames live in
   `src/styleframes/<key>.frame.tsx` exporting `frames: FrameDef[]` (ids: lowercase, dashes).
3. Render: `npx remotion still src/dev/<key>/entry.tsx <id> ../out/dev/<key>/<name>.png --bundle-cache=false --log=error`
   Motion test: `npx remotion render src/dev/<key>/entry.tsx <id> ../out/dev/<key>/<name>.mp4 --bundle-cache=false --log=error --concurrency=2`
   Then **look at your PNGs with the Read tool** and iterate at least 3 times until it's genuinely good.
4. Deterministic only (no Math.random/Date in render; seed PRNGs). Canvas renderers must use
   delayRender/continueRender (ToneCanvas does).
5. Guardrails: stylized, never photoreal/deepfake; no real logos (parody names only); caricature
   exaggerates 1-2 signature public features + a prop — no body-shaming, no ethnic caricature.
6. Write `notes/<key>.md`: what you built, how to use it, rig limits in your style, known issues.
