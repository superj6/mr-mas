// MR. MAS — cast: CLOD, MISANTHROPIC's product as a character (characters/products-as-characters.md), the pixel
// drawing. New file (v3-art-a, 2026-09-27). The script (sc 11): "a rounded terracotta clay figure with visible
// thumbprints, a small bow tie and a clipboard, and a tiny potter's wheel turning in its chest". The style-range pass's
// E1-P1 clip renders it in real clay (dev/range/ep1-p1: a three.js puppet composited over the pixel frame, a style
// option, not the default); this is its BASE pixel drawing for the full-episode preview, on the same plinth.
//   drawClod(b, footX, footY, st)   room scale (~56 px): st.pose 'wait' (upright, unlit, hands on its clipboard) ·
//                                   'bow' (the bow toward Mario, "You're absolutely right!") · 'up' (risen, facing
//                                   us, the clipboard up); st.lit 0 unlit (the can light off: a dark clay mass) · 1
//                                   lit (the launch light: warm terracotta, a hot rim); st.wheel (the chest wheel's
//                                   held turn, 0..2); st.eyes 'open' | 'shut'; st.smile
import {Buf, ellipse, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo} from './kit';

export const CLOD_W = 44, CLOD_H = 62;
export const CLOD_FOOT: [number, number] = [22, 60];
export interface ClodState { pose: 'wait' | 'bow' | 'up'; lit: 0 | 1; wheel: number; eyes: 'open' | 'shut'; smile: boolean }
export const CLOD_DEFAULT: ClodState = {pose: 'wait', lit: 0, wheel: 0, eyes: 'open', smile: false};

const fig = (s: ClodState): FigureDef => {
  const bow = s.pose === 'bow' ? 7 : 0;
  // the body: one rounded bean of clay (its head is its top, no neck), a flat base on the plinth; the bow tips it
  const lean = (y: number) => (s.pose === 'bow' ? Math.round((40 - y) * 0.22) : 0);
  const pts: number[] = [];
  for (let k = 0; k <= 24; k++) { const a = Math.PI + (k / 24) * Math.PI; const x = 22 + Math.cos(a) * 15, y = 22 + Math.sin(a) * 18; pts.push(x - lean(y), y + bow * (1 - (y - 4) / 40)); }
  pts.push(38, 44, 36, 60, 8, 60, 6, 44);
  const parts: Part[] = [{group: 'body', mat: 'clay', prims: [P.poly(...pts)]}];
  // the arms: two clay stubs holding the clipboard at its chest (wait / bow), or the clipboard up (up)
  const up = s.pose === 'up';
  parts.push({group: 'armL', mat: 'clay', prims: [P.ell(8 - lean(34), (up ? 30 : 38) + bow * 0.3, 4, 6)]});
  parts.push({group: 'armR', mat: 'clay', prims: [P.ell(36 - lean(34), (up ? 26 : 38) + bow * 0.3, 4, 6)]});
  const stamps: Stamp[] = [];
  const fx = 22 - lean(14), fy = 14 + Math.round(bow * 0.7);
  // the face: two dot eyes, a small curved mouth (a smile when it agrees)
  stamps.push({x: fx - 6, y: fy, rows: s.eyes === 'shut' ? ['kk.......kk'] : ['kk.......kk', 'kk.......kk'], pal: {k: ['dark', 0]}});
  stamps.push({x: fx - 3, y: fy + 6, rows: s.smile ? ['k.....k', '.kkkkk.'] : ['.kkkkk.'], pal: {k: ['dark', 0]}});
  // the bow tie under its "chin", blue
  stamps.push({x: fx - 4, y: fy + 11, rows: ['bb.bb', 'bbBbb', 'bb.bb'], pal: {b: ['tie', 2], B: ['tie', 4]}});
  // the potter's wheel in its chest: a small disc with a turning mark (3 held drawings)
  const wx = fx - 4, wy = fy + 17;
  const spoke = [['.www.', 'wwWww', 'w.W.w', 'wwWww', '.www.'], ['.www.', 'wWwww', 'w.W.w', 'wwwWw', '.www.'], ['.www.', 'wwwWw', 'w.W.w', 'wWwww', '.www.']][((s.wheel % 3) + 3) % 3];
  stamps.push({x: wx, y: wy, rows: spoke, pal: {w: ['wheel', 2], W: ['wheel', 4]}});
  // thumbprints: small curved marks pressed into the clay (a rung down), round its shoulders and belly
  for (const [tx, ty] of [[12, 8], [30, 12], [10, 30], [32, 34], [18, 46], [28, 52]] as Array<[number, number]>) stamps.push({x: tx - lean(ty), y: ty + Math.round(bow * (1 - (ty - 4) / 40)), rows: ['.pp.', 'p..p'], pal: {p: ['clay', 1]}});
  // the clipboard: cream paper on a board, held at its chest (or up)
  const cx = up ? 30 : 14, cy = (up ? 18 : 34) + Math.round(bow * 0.4);
  stamps.push({x: cx - lean(cy), y: cy, rows: ['.cccccccc.', 'dPPPPPPPPd', 'dPlllllPPd', 'dPPPPPPPPd', 'dPllllPPPd', 'dPPPPPPPPd', 'dPlllllPPd', 'dddddddddd'], pal: {c: ['board', 3], d: ['board', 1], P: ['paper', 3], l: ['paper', 1]}});
  return {w: CLOD_W, h: CLOD_H, parts, stamps};
};
const RAMPS = (lit: 0 | 1): Record<string, number[]> => lit
  ? {clay: [PAL.D1, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0], tie: [PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5, PAL.F6], wheel: [PAL.D2, PAL.D3, PAL.D4, PAL.W5, PAL.W7, PAL.W8], board: [PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W4, PAL.W5], paper: [PAL.P0, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.P2]}
  : {clay: [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.W1, PAL.W2], dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0], tie: [PAL.N0, PAL.F0, PAL.F1, PAL.F2, PAL.F2, PAL.F3], wheel: [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.W2, PAL.W2], board: [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D2, PAL.D3], paper: [PAL.G2, PAL.G2, PAL.G3, PAL.G4, PAL.G4, PAL.G4]};
const rig = (lit: 0 | 1): LightRig => ({
  key: [-0.7, -0.7], keyBand: lit ? 4 : 2, shadowBand: 4, rim: true, outline: true,
  back: [1, -0.3], backBand: 1, backRamp: lit ? {clay: PAL.W7} : {clay: PAL.D2},
  ramps: RAMPS(lit), noEdge: ['dark', 'tie', 'wheel', 'board', 'paper'],
});
export const clodImg = memo((s: ClodState) => renderFigure(fig(s), rig(s.lit)));
export const drawClod = (b: Buf, footX: number, footY: number, s: Partial<ClodState> = {}) => {
  const st = {...CLOD_DEFAULT, ...s};
  blitImg(b, clodImg(st), footX - CLOD_FOOT[0], footY - CLOD_FOOT[1]);
  void ellipse; void rect; void stepColor;
};
