// MR. MAS — range/p3: where each guest's pixel drawing sits on the native grid for a camera. The drawing never
// scales: its eye row is pinned to the projection of the seat's eye point and snapped to whole native pixels, so
// the 3D render places the sprite and the pixel grid keeps it a sprite.
import {Cam, project, Seat, V3} from './layout';

/** drawing sizes (native px): near = the approved portrait (+ the torso the cloth covers), far = the medium tier */
export const SPR = {
  near: {w: 112, h: 240, eyeRow: 62, eyeCol: 56},
  far: {w: 56, h: 118, eyeRow: 31, eyeCol: 28},
} as const;

export interface SpriteRect { x: number; y: number; w: number; h: number; depth: number; eye: V3; }
export const spriteRect = (cam: Cam, s: Seat): SpriteRect | null => {
  const d = s.near ? SPR.near : SPR.far;
  const eye: V3 = [s.x, s.eye, s.pz];
  const p = project(cam, eye);
  if (!p) return null;
  return {x: Math.round(p[0] - d.eyeCol), y: Math.round(p[1] - d.eyeRow), w: d.w, h: d.h, depth: p[2], eye};
};
