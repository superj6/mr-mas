// MR. MAS — Prototype 2 · real 3D · THE CLIFF (style-range §7.2, 11.A, Ep11 #3): the clip's clock and the room's depth
// model. Pure constants: shared by the pixel side, the extrusion, the camera path, the sound tool and the sheet.
//
// 96 BPM grid: beat 15 f, bar 60 f. 360 f (15 s): pixel p0-59 · 3D p60-314 · pixel p315-359.
// Polish pass (after the cold read): the lit cursor sets it off (`Look at lanyard`, one soft click); the band slides
// out and back with weight instead of stepping; the reveal settles into a short live hold; the push resolves the
// monitor in held resolution steps so the portal never pops; the nest is flown with an accelerating, then braking,
// schedule (V3 read, a rush of generations, EXCEEDS EXPECTATIONS held); the loss plot is the monitor's own plot
// (dark field, grey axes, the cyan line); the line runs off the chart and the camera falls with it; the fall lands
// in one continuous move, flattening onto the exact pixel frame.

export const N_FRAMES = 360;
export const FPS = 24;
export const NW = 480, NH = 270, RH = 203;

export const T = {
  /** the lit cursor glides to the monitor, the sentence line reads `Look at lanyard`, and it clicks (beat 3) */
  cursorIn: 6, hotspot: 26, click: 30,
  /** the band slides out of frame (gravity), the room takes the freed lines */
  bandOut: 45, bandOutEnd: 55,
  /** the first 3D frame: bit-identical to p59 (the frame gains depth) */
  d3: 60,
  /** the reveal: truck right, yaw ~8°, crane ~2°, heavy dolly, no overshoot; it settles by revealEnd */
  revealEnd: 124,
  /** the push: round his card, into his eyeline, into the screen (the room's camera on 1s from here) */
  pushAt: 135,
  /** the monitor's picture resolves in held steps as the lens nears it; the portal opens at the finest step */
  portalOpen: 167,
  /** V3 fills the frame (read), then the rush, then EXCEEDS EXPECTATIONS held */
  nest: 172,
  /** out of the last badge's photo window: the monitor's own loss plot */
  surface: 240,
  /** the ride onto the line */
  ride: 256,
  /** the crest (slow over the lip), the plunge */
  edge: 274, vertical: 286,
  /** the fall ends exactly on the room's staging camera (the last 3D frame is the exact pixel frame) */
  land: 314,
  /** the exact pixel frame again */
  pixelBack: 315,
  /** the band slides back up */
  bandIn: 322, bandInEnd: 331,
  /** the chip lead returns (sound) / his brow lifts and the Orb takes one servo step to his face (picture) */
  lead: 345,
} as const;

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** band offset (rows pushed down out of frame) per frame: 0 on screen .. 67 gone. Out: it falls (accelerates, on
 *  1s); in: it rises and settles (decelerates), like a drawer closing. */
export const BAND_H = NH - RH;
export const bandDrop = (p: number): number => {
  if (p < T.bandOut) return 0;
  if (p < T.bandOutEnd) { const t = (p - T.bandOut) / (T.bandOutEnd - T.bandOut); return Math.round(BAND_H * t * t); }
  if (p < T.bandIn) return BAND_H;
  if (p < T.bandInEnd) { const t = clamp01((p - T.bandIn) / (T.bandInEnd - T.bandIn)); return Math.round(BAND_H * Math.pow(1 - t, 3)); }
  return 0;
};

// ------------------------------------------------------------------ the staging camera (the pixel frame's own lens)
// A level camera with a shifted lens (verticals stay vertical, as the plate is painted): focal 480 native px, the
// principal point at the frame's centre column and near the top (row 16: the eye is above his head, looking across the
// desk). Units are metres in the room's staging space: camera at the origin, looking down -Z, +Y up.
export const CAM = {f: 480, cx: 240, cy: 16};

// the room's depth model (DPLATE geometry, never colour). z = distance along -Z.
export const DEPTH = {
  /** the desk top plane y = -deskH; its far edge (row 128) lands at 3.0 m */
  deskH: 0.7,
  /** the desk's front panel under the near lip */
  panelZ: 2.18,
  /** the back wall */
  wall: 3.8,
  /** the window reveal (glass plane behind the wall face) */
  reveal: 0.45,
  /** the city beyond the glass: one far backdrop */
  city: 42,
  /** the shelf juts this far from the wall */
  shelf: 0.42,
  /** the rack block: its front face depth, and the block's depth back to the wall */
  rackZ: 3.25,
  /** the monitor's screen quad: left (near) edge depth; the right edge is 64/52 of it (the painted foreshortening) */
  monL: 2.56,
  monCasing: 0.05,
  /** the Orb's centre depth (behind his card, in front of the window) */
  orb: 3.3,
  /** Mas's card: he sits at the desk's far edge (row 128 = 3.0 m); his forearms lie on the desk top */
  mas: 3.03,
  /** the desk's right end, world X (it is out of frame until the truck reveals its side) */
  deskEndX: 1.42,
  deskThick: 0.045,
} as const;

/** depth of the desk top plane at a (fractional) image row */
export const deskZ = (row: number) => (DEPTH.deskH * CAM.f) / (row - CAM.cy);
/** image ray (staging space, z = -1) through a fractional image point */
export const ray = (x: number, y: number): [number, number, number] => [(x - CAM.cx) / CAM.f, -(y - CAM.cy) / CAM.f, -1];
