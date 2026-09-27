// MR. MAS — outro C: the cast. The maintenance hand (the Ep1 sc 30 hand; its orange cuff is continuity 2, Ep1 script
// §handoffs). (The moth is in moth.ts.)
//
// THE HAND is built the way the inserts-hands family builds hands (kits/inserts-hands.ts renderCaps: capsules with
// height, lit by the lobby's HandLight ramps and quantised to the portraits' flat cel planes, outlined, rimmed),
// posed here for this shot: the right hand from above, the back of the hand to camera, fingers down. Two drawings:
// 'open' (reaching in, letting go) and 'grip' (fingers over a plate's top edge, the thumb behind it). The coverall
// sleeve renders on the family's cuff ramp; the hi-vis cuff band is re-inked orange. Rendered once, then held.
import {Buf} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';

export type HandPose = 'open' | 'grip';
// A hand-pixelled pair of drawings (the capsule renderer, tried first, mushed the fingers together at this size):
// flat cel planes in the family's lobby ramps (inserts-hands.ts RAMPS.lobby: S0 outline, S1 shadow, S3 mid,
// S4 light, S5 bright, S6 rim), the light from below-left (the light box), an outline on the shadow side only.
// Coordinates are relative to the plate the hand holds or hovers over (its top-left); x 0..15 is the plate's width.
type Part = 'skin' | 'sleeve' | 'cuff' | 'nail';
interface Px { x: number; y: number; part: Part; tone: number; }
const SKIN = [PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6];      // 0 shadow .. 4 rim
const SLEEVE = [PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4];
const CUFF = [PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7];
const colOf = (p: Px) => (p.part === 'nail' ? PAL.S6 : (p.part === 'skin' ? SKIN : p.part === 'sleeve' ? SLEEVE : CUFF)[p.tone]);

const build = (pose: HandPose) => {
  const m = new Map<string, Px>();
  const put = (x: number, y: number, part: Part, tone: number) => m.set(x + ',' + y, {x, y, part, tone});
  /** a filled span, shaded left (lit) to right (shadow) */
  const span = (y: number, x0: number, x1: number, part: Part, lit = 1) => {
    for (let x = x0; x <= x1; x++) {
      const u = (x - x0) / Math.max(1, x1 - x0);
      put(x, y, part, u < 0.22 ? Math.min(4, 2 + lit) : u < 0.7 ? 2 : 1);
    }
  };
  // the coverall sleeve (up out of frame), the hi-vis cuff, the wrist, the back of the hand
  for (let y = -60; y <= -22; y++) span(y, 1, 14, 'sleeve');
  for (let y = -21; y <= -18; y++) span(y, 1, 14, 'cuff', y === -21 ? 2 : 1);
  for (let y = -17; y <= -15; y++) span(y, 3, 12, 'skin', 0);
  for (let y = -14; y <= -7; y++) { const g = Math.round(((y + 14) / 7) * 2); span(y, 3 - g, 12 + g, 'skin', 1); }
  // knuckles: a lit bump on each
  for (const kx of [2, 6, 10, 13]) put(kx, -7, 'skin', 3);
  if (pose === 'grip') {
    // the fingers go down BEHIND the plate: only their first rows show above its top edge
    for (const [x0, x1, y1] of [[1, 3, -1], [5, 7, -1], [9, 11, -1], [13, 15, -2]] as Array<[number, number, number]>) for (let y = -6; y <= y1; y++) span(y, x0, x1, 'skin', 1);
    // the thumb comes down IN FRONT of the plate, its pad on the face, the nail toward us
    for (let y = -12; y <= 5; y++) { const x0 = 13 - Math.round(((y + 12) / 17) * 4); span(y, x0, x0 + 2, 'skin', 2); }
    put(9, 4, 'nail', 0); put(10, 4, 'nail', 0); put(9, 5, 'skin', 1); put(11, 6, 'skin', 0); put(10, 6, 'skin', 0);
  } else {
    // open: four fingers hanging a little spread (middle ones longest), separated by clear gaps, nails at the tips
    for (const [x0, x1, y1] of [[0, 2, 1], [4, 6, 3], [8, 10, 3], [12, 14, 1]] as Array<[number, number, number]>) {
      for (let y = -6; y <= y1; y++) span(y, x0, x1, 'skin', 1);
      put(x0 + 1, y1 - 1, 'nail', 0);
      m.delete(x0 + ',' + y1); m.delete(x1 + ',' + y1); // rounded tips
      put(x0 + 1, y1, 'skin', 1);
    }
    // the thumb, out to the right and down
    for (let y = -13; y <= -3; y++) { const x0 = 13 + Math.round(((y + 13) / 10) * 3); span(y, x0, x0 + 2, 'skin', 2); }
  }
  // outline: silhouette pixels facing right or down (away from the light) go to the outline tone
  const out = new Map<string, Px>();
  for (const [k, p] of m) {
    const empty = (dx: number, dy: number) => !m.has(p.x + dx + ',' + (p.y + dy));
    if (p.part !== 'nail' && (empty(1, 0) || empty(0, 1))) out.set(k, {...p, tone: -1});
    else out.set(k, p);
  }
  return [...out.values()];
};
const cache = new Map<HandPose, Px[]>();
const handPx = (pose: HandPose) => { let v = cache.get(pose); if (!v) { v = build(pose); cache.set(pose, v); } return v; };
/** Draw the hand at a plate position (px, py) = the top-left of the plate it holds or hovers over. */
export const drawHand = (b: Buf, pose: HandPose, px: number, py: number) => {
  for (const p of handPx(pose)) {
    const c = p.tone < 0 ? (p.part === 'skin' ? PAL.S0 : PAL.N0) : colOf(p);
    b.set(px + p.x, py + p.y, c);
  }
};
// The moth moved to moth.ts (second pass: outro E's moth, shared).
