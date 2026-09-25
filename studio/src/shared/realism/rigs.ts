// Realism kit — light rigs per setup (builder key: realism).
import type {LightRig, Ramp} from './lit';

/** Mas skin under the cyan monitor: cool reflected shadow -> core -> warm subsurface band -> cyan-lit skin. */
export const SKIN_MAS: Ramp = [
  [0, '#1c1a22'],
  [0.3, '#120c10'],
  [0.45, '#1d0f12'],
  [0.51, '#4a2320'],
  [0.56, '#4e3d3c'],
  [0.62, '#35494d'],
  [0.75, '#3f6266'],
  [0.88, '#4f7a7e'],
  [0.96, '#6a979a'],
  [1, '#9cc4c4'],
];

/** Monitor key from front-left (slightly below eye line). */
export const KEY_MONITOR_L: [number, number, number] = [-0.9, 0.1, 0.42];
/** Warm doorway from behind-right. */
export const RIM_DOOR_R: [number, number, number] = [0.85, -0.12, -0.5];

export const rigMonitor = (rim = 0): LightRig => ({
  key: KEY_MONITOR_L,
  ramp: SKIN_MAS,
  rim: RIM_DOOR_R,
  rimColor: '#ffa55a',
  rimAmt: rim,
  rimCut: 0.5,
  rimSoft: 0.22,
  spec: 0.35,
  specPow: 16,
  specColor: '#cffbff',
});
