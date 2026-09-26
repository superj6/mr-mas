// MR. MAS — style jump prototype C · J6 · THE RING (Ep12 Button #17). Brief: show/bible/style-jumps.md §5.3.
// Prototype builder 3. Internal only: no frame of this leaves the room before Ep12 airs (style-jumps §3.6).
//   jump-proto-3            120 f (5.0 s): pixel p0-29 · the ring, continuous inside its own front, p30-89 · snap p90
//   jump-proto-3-quantized  the same ring kept on the grid (genai-candidates' option; decision 8 in §7.1), for the A/B
// Code: src/dev/jumps/proto3/ (art.ts pixel plate, ring.ts wave + continuous water, render.ts both media).
import type {FrameDef} from '../../shared/frame-def';
import {Proto3} from '../../dev/jumps/proto3/Proto3';
import {CLIP} from '../../dev/jumps/proto3/ring';

export const frames: FrameDef[] = [
  {id: 'jump-proto-3', component: Proto3, props: {variant: 'jump'}, durationInFrames: CLIP.frames, fps: 24},
  {id: 'jump-proto-3-quantized', component: Proto3, props: {variant: 'quantized'}, durationInFrames: CLIP.frames, fps: 24},
];
