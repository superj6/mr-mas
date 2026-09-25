// Drawn angles + bake frames shared by the offline bake and the rig (builder key: realism).
import type {View, V} from './sdf';

/** Bake frame in camera-space cm: [x0, y0, x1, y1] (y up). Rig places the image at x0*U, -y1*U. */
export type Box = [number, number, number, number];

export const MAS_BOX: Box = [-13, -22, 13, 14.5];
export const MAS_PPC = 32;

/** Mas: A = at his monitor (3/4 screen-left), M = passing angle (on the blink), B = turned to Nole (screen-right, up). */
export const MAS_VIEWS: Record<'A' | 'M' | 'B', View> = {
  A: {yaw: 40, pitch: 3, roll: 0},
  M: {yaw: 14, pitch: 0, roll: -1},
  B: {yaw: -12, pitch: -5, roll: -1.5},
};

/** Camera-space light directions (toward the light; y up). */
export const L_MONITOR: V = [-0.9, -0.06, 0.42];
export const L_DOOR: V = [0.8, 0.18, -0.56];
