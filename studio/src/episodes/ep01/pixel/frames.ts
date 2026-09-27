// MR. MAS — Ep1 pixel pipeline (P0): the Remotion compositions, one set per segment, found automatically: every
// `<seg>/shots.ts` that exports SEGMENT registers (and `<seg>/browser.tsx`, if present, its browser-frame component).
// A shot pass adds nothing here. Registered only by ./entry.tsx.
//   'ep01-pixel-<seg>'          the picture, 1920 x 1080 (the show frame at 4x): what tools/render.ts encodes
//   'ep01-pixel-<seg>-review'   the review frame, 1920 x 1080 (3x + the editor's margin + the transcript band)
//   'ep01-pixel-<seg>-still'    a still of either: --props='{"offset": N}' or '{"offset": N, "mode": "review"}'
// Props on all three: offset, mode, marks, opts (segment options, e.g. '{"opts": {"j1": true}}').
// A segment whose module fails to load is skipped with a console error; the others still register.
import type {FrameDef} from '../../../shared/frame-def';
import {makeHost} from './Host';
import type {BrowserModule} from './Host';
import type {PixelSegment} from './spec';

const segs = require.context('./', true, /^\.\/[a-z0-9-]+\/shots\.tsx?$/);
const brow = require.context('./', true, /^\.\/[a-z0-9-]+\/browser\.tsx$/);
const browserOf = (dir: string): BrowserModule | undefined => {
  const key = brow.keys().find((k) => k.startsWith(`./${dir}/`));
  if (!key) return undefined;
  try { return (brow(key) as {BROWSER?: BrowserModule}).BROWSER; } catch (e) { console.error(`pixel: ${key} failed to load`, e); return undefined; }
};

export const frames: FrameDef[] = segs.keys().flatMap((key) => {
  const dir = key.split('/')[1];
  let spec: PixelSegment | undefined;
  try { spec = (segs(key) as {SEGMENT?: PixelSegment}).SEGMENT; } catch (e) { console.error(`pixel: ${key} failed to load`, e); return []; }
  if (!spec) return [];
  const Host = makeHost(spec, browserOf(dir));
  const id = `ep01-pixel-${spec.seg}`, n = spec.lock.frames;
  return [
    {id, component: Host, width: 1920, height: 1080, fps: 24, durationInFrames: n, props: {offset: 0, mode: 'picture'}},
    {id: `${id}-review`, component: Host, width: 1920, height: 1080, fps: 24, durationInFrames: n, props: {offset: 0, mode: 'review'}},
    {id: `${id}-still`, component: Host, width: 1920, height: 1080, props: {offset: 0, mode: 'picture'}},
  ];
});
