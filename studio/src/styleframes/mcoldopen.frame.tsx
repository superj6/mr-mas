// MR. MAS — mcoldopen: THE COLD OPEN, pixel edition (intro f0-119, 5.0 s), with the masked GLYPH Orb scan
// at f99-104. Composition frame numbers = intro frame numbers (the span starts at global 0).
// Integrators: import {ColdOpenMount, ColdOpen, SPAN} from '../dev/mcoldopen/ColdOpen'.
import type {FrameDef} from '../shared/frame-def';
import {ColdOpen} from '../dev/mcoldopen/ColdOpen';
import {SPAN} from '../dev/mcoldopen/timeline';

export const frames: FrameDef[] = [
  {id: 'mcoldopen', component: ColdOpen, durationInFrames: SPAN.durationInFrames, fps: 24},
];
