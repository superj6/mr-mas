// MR. MAS — cast: TASYA at MEDIUM / TWO-SHOT scale (waist-up), with the giant key ring. New file (v3-art-a,
// 2026-09-27); cast/tasya-speak.ts is not edited. Ep1 sc 9's long two-shots with Mas (the terms, the collar, "and the
// rent?"): the medium tier's grammar (cast/medium-kit.ts): his APPROVED PORTRAIT's geometry (tasya-speak's
// tasyaSpeakFig: the head, the glasses' planes, the cropped grey sides, the salt-and-pepper beard, the navy blazer over
// an open collar) re-rasterized at half size (vector geometry, never a scaled sprite), a new waist-down torso and arms,
// and every face feature hand-placed at this size: the glasses' rims, the eyes, the brows, six mouths.
// Warm, measured, gently amused. Lit by the room (the warm skin ramp tasya-phone.ts introduced for the lobby; the
// slate ramp read as a green face). No accent humour, ever (guardrails §6).
//   tasyaMedium / drawTasyaMedium(b, x, y, st, {flip})   84 x 110, authored 3/4 facing screen-LEFT (toward Mas)
//   st.arm: clasp (hands together at the waist, pleased) · after (the near hand open, out to the side: "after you") ·
//           ring (the near hand up with the key ring) · down
//   st.keys: the ring at his belt: how many keys (one per tenant: 11, then 12 after the deal), st.beige: the newest key
//           in NopeAI beige (the button's colour); st.jangle 0 | 1
//   drawKeyRing(b, cx, cy, n, {beige, jangle, scale})     the ring alone: 'room' (for his room sprite's belt, 12 px) or
//                                                         'medium' (20 px); keys hang round its lower half
import {Buf, rect, ellipse} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, Img, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';
import {scaleParts, scaleAdjust} from './medium-kit';
import {tasyaSpeakFig, TASYA_SPEAK_RIG, TASYA_ROOM_DEFAULT} from './tasya-speak';
import type {Viseme} from './talk';

export const TASYA_MW = 84, TASYA_MH = 110;
export type TasyaMArm = 'clasp' | 'after' | 'ring' | 'down';
export interface TasyaMediumState { mouth: Viseme; lid: 0 | 1 | 2; brow: 'level' | 'warm'; arm: TasyaMArm; keys: number; beige: boolean; jangle: 0 | 1 }
export const TASYA_MEDIUM_DEFAULT: TasyaMediumState = {mouth: 'smile', lid: 0, brow: 'level', arm: 'clasp', keys: 11, beige: false, jangle: 0};
/** the belt ring's centre (local, unflipped) */
export const TASYA_M_RING: [number, number] = [66, 100];

const K = 0.5, OX = 14, OY = -6;
const fig = (s: TasyaMediumState): FigureDef => {
  const pf = tasyaSpeakFig({mouth: 'rest', lid: 0, brow: 'level', arms: 'none', jangle: 0});
  // the portrait's head, neck and collar at half size (its torso is replaced: a waist-up blazer)
  const keepGroups = new Set(['head', 'ear', 'neck', 'shirt']);
  const parts: Part[] = scaleParts(pf.parts.filter((p) => keepGroups.has(p.group)), K, OX, OY);
  const adjust = scaleAdjust((pf.adjust ?? []).filter((a) => a.onlyMat === 'skin'), K, OX, OY, false);
  // the blazer from the shoulders to the waist (the frame's bottom), a slim cut, the open collar at the neck
  parts.unshift({group: 'torso', mat: 'blazer', tone: 3, prims: [P.poly(20, 50, 30, 44, 40, 42, 50, 43, 60, 46, 70, 52, 74, 64, 74, 110, 16, 110, 16, 64)]});
  const sl = (g: string, pts: number[][], w0: number, w1: number): Part => ({group: g, mat: 'blazer', tone: 3, prims: pts.slice(1).map((p, i) => seg(pts[i][0], pts[i][1], i ? w1 : w0, p[0], p[1], w1)).concat(pts.map(([x, y]) => P.ell(x, y, w1 / 2, w1 / 2)))});
  const ARMS: Record<TasyaMArm, {near: number[][]; far: number[][]; hands: Array<[number, number]>}> = {
    clasp: {near: [[24, 54], [20, 76], [34, 90]], far: [[66, 56], [70, 76], [50, 90]], hands: [[36, 88], [46, 88]]},
    after: {near: [[24, 54], [12, 72], [2, 84]], far: [[66, 56], [70, 80], [66, 100]], hands: [[0, 84], [64, 100]]},
    ring: {near: [[24, 54], [16, 72], [22, 60]], far: [[66, 56], [70, 80], [66, 100]], hands: [[22, 58], [64, 100]]},
    down: {near: [[24, 54], [20, 78], [20, 100]], far: [[66, 56], [70, 80], [66, 100]], hands: [[20, 100], [66, 100]]},
  };
  const A = ARMS[s.arm];
  parts.unshift(sl('armF', A.far, 11, 9));
  parts.push(sl('armN', A.near, 12, 10));
  // the blazer's lapels and its button line; the shirt's open collar is the portrait's (scaled)
  // the key light from camera-left: the near shoulder and chest lit, the far side into shadow, the lapels a rung up,
  // the button line and the lapels' edges drawn
  adjust.push({prims: [P.poly(16, 64, 20, 50, 30, 44, 36, 48, 34, 70, 28, 110, 16, 110)], tone: 4, onlyMat: 'blazer'});
  adjust.push({prims: [P.poly(58, 50, 70, 52, 74, 64, 74, 110, 56, 110, 60, 70)], tone: 2, onlyMat: 'blazer'});
  adjust.push({prims: [P.poly(34, 45, 42, 50, 38, 70, 30, 56)], tone: 4, onlyMat: 'blazer'});
  adjust.push({prims: [P.poly(50, 44, 60, 48, 52, 66, 46, 50)], tone: 2, onlyMat: 'blazer'});
  adjust.push({prims: [P.line(30, 56, 38, 70), P.line(52, 66, 60, 48)], tone: 1, onlyMat: 'blazer'});
  adjust.push({prims: [P.line(42, 66, 42, 110)], tone: 1, onlyMat: 'blazer'});
  adjust.push({prims: [P.line(20, 50, 30, 44)], tone: 5, onlyMat: 'blazer'});
  // the face at this size, hand-placed: the glasses' two rims (a 1 px frame and its bridge), the eyes, the brows, the
  // mouth; the beard's lower edge
  const E = OY + 3 + 22; // eye line
  const L = s.lid;
  const eyeN = L === 2 ? ['.....', 'kkkkk'] : L === 1 ? ['.....', 'kkIkk'] : ['..I..', '.kIk.'];
  const eyeF = L === 2 ? ['...', 'kkk'] : L === 1 ? ['...', 'kIk'] : ['.I.', 'kIk'];
  const MOUTH: Record<Viseme, string[]> = {
    rest: ['mmmm.', '.ll..'], smile: ['mmmmr', '.ll..'], A: ['mmmm.', 'mddm.', '.mm..'], E: ['mmmmr', 'mTTm.'], O: ['.mm..', 'mddm.', '.mm..'], M: ['mmmm.', 'MMM..'],
  };
  const stamps: Stamp[] = [
    {x: 41, y: E - 1, rows: ['ggggggg.gggg.', 'g.....g.g..g.', 'g.....ggg..g.', '.ggggg...ggg.'], pal: {g: PAL.N0}},
    {x: 42, y: E - 1, rows: eyeN, pal: {k: PAL.X1, I: PAL.N0}},
    {x: 50, y: E - 1, rows: eyeF, pal: {k: PAL.X1, I: PAL.N0}},
    {x: 43, y: E, rows: ['.', 'c'], pal: {c: PAL.C8}},
    {x: 41, y: E - 3 - (s.brow === 'warm' ? 1 : 0), rows: s.brow === 'warm' ? ['.bbbb..bb.', 'b....bb..b'] : ['bbbbbb.bbb.'], pal: {b: PAL.G2}},
    {x: 42, y: E + 11, rows: MOUTH[s.mouth], pal: {m: PAL.S0, l: PAL.X2, r: PAL.X1, d: PAL.N0, T: PAL.P1, M: PAL.X0}},
  ];
  // the hands (medium size: a 5 x 4 block with a knuckle row)
  const hand = ([x, y]: [number, number], flip = false): Stamp => ({x: Math.round(x) - 2, y: Math.round(y) - 2, rows: flip ? ['.334.', '34443', '23443', '.222.'] : ['.433.', '34443', '34432', '.222.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  if (s.arm === 'clasp') stamps.push({x: 33, y: 85, rows: ['..33333333..', '.3444443444.', '344344434443', '233333333332', '.2222222222.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  else { stamps.push(hand(A.hands[0])); stamps.push(hand(A.hands[1], true)); }
  return {w: TASYA_MW, h: TASYA_MH, parts, adjust, stamps};
};
const SKIN_ROOM = [PAL.S0, PAL.X1, PAL.X2, PAL.S3, PAL.S4, PAL.S5];
const RIG: LightRig = {
  ...TASYA_SPEAK_RIG,
  ramps: {...TASYA_SPEAK_RIG.ramps, skin: SKIN_ROOM, blazer: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N7]},
  backRamp: {skin: PAL.S3, blazer: PAL.N6, hair: PAL.G4, beard: PAL.G4},
};

/** the giant key ring: a brass ring and n keys hanging round its lower half (the newest last, beige if st.beige) */
export const drawKeyRing = (b: Buf, cx: number, cy: number, n: number, o: {beige?: boolean; jangle?: 0 | 1; scale?: 'room' | 'medium'} = {}) => {
  const med = (o.scale ?? 'medium') === 'medium';
  const r = med ? 9 : 5;
  for (let y = -r - 1; y <= r + 1; y++) for (let x = -r - 1; x <= r + 1; x++) {
    const d = Math.hypot(x / r, y / r);
    if (d < 0.8 || d > 1.08) continue;
    const lit = -x - y;
    b.set(cx + x, cy + y, d > 1 ? PAL.W2 : lit > 3 ? PAL.W7 : lit > -2 ? PAL.W5 : PAL.W4);
  }
  // the keys: spread round the lower arc, each a bow and a blade (medium: 2 x 6; room: 1 x 3), leaning out a little
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const a = Math.PI * (0.12 + 0.76 * t) + (o.jangle ? 0.06 : -0.04);
    const ax = Math.round(cx + Math.cos(a) * r), ay = Math.round(cy + Math.sin(a) * r);
    const lean = Math.cos(a);
    const beigeKey = !!o.beige && i === n - 1;
    const col = beigeKey ? PAL.P1 : i % 3 === 0 ? PAL.W6 : i % 3 === 1 ? PAL.G5 : PAL.W5;
    const dark = beigeKey ? PAL.P0 : i % 3 === 1 ? PAL.G3 : PAL.W3;
    const len = med ? 6 : 3;
    for (let j = 0; j < len; j++) { const x = ax + Math.round(lean * j * 0.5), y = ay + 1 + j; b.set(x, y, j === 0 ? col : dark); if (med) b.set(x + 1, y, j === 0 ? col : j === len - 1 ? dark : col); }
    if (med && beigeKey) { b.set(ax + Math.round(lean * 3), ay + len + 1, PAL.P2); }
  }
};

export const tasyaMedium = memo((s: TasyaMediumState): Img => renderFigure(fig(s), RIG));
export const drawTasyaMedium = (b: Buf, x: number, y: number, s: Partial<TasyaMediumState> = {}, o: {flip?: boolean; map?: (c: number) => number} = {}) => {
  const st = {...TASYA_MEDIUM_DEFAULT, ...s};
  blitImg(b, tasyaMedium(st), x, y, {flip: o.flip, map: o.map});
  const [rx, ry] = TASYA_M_RING;
  const X = o.flip ? x + TASYA_MW - 1 - rx : x + rx;
  if (st.arm === 'ring') drawKeyRing(b, o.flip ? x + TASYA_MW - 1 - 22 : x + 22, y + 48, st.keys, {beige: st.beige, jangle: st.jangle});
  else drawKeyRing(b, X, y + ry, st.keys, {beige: st.beige, jangle: st.jangle});
  void rect; void ellipse; void TASYA_ROOM_DEFAULT;
};
