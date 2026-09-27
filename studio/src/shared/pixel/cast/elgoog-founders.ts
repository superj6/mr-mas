// MR. MAS — cast: NIRB and EGAP, ELGOOG's founders, summoned from retirement (Ep1 sc 8; characters/cameos-industry.md).
// New file (v3-art-a, 2026-09-27). The script: "backlit silhouettes with dialogue boxes and no portraits", rising out of
// a crypt, shading their eyes from the daylight. So they are room sprites drawn as silhouettes (one rung off black)
// with the lobby's daylight as a hot rim on their crowns and lit edges, and each carries one readable thing, never a
// face: NIRB, taller and lean, a small glass prism over one eye that catches the light (a headset in silhouette);
// EGAP, a little stooped in a zip fleece, holding up an oversized mug that says RETIRED / 2019. Parody names only;
// no likeness (guardrails: caricature by silhouette and a prop).
//   drawFounder(b, who, footX, footY, pose, {clip, flip})
//   pose.arm: shade (a hand up at the brow: the daylight) · mug (EGAP: both hands, the mug up at his chest) · reach (a
//             hand out: taking the lanyard) · down
//   pose.legs: stand · step (a knee up: the last stair)
//   pose.lanyard: wearing the GUEST lanyard (a red strap, the white card at the chest: it reads even in silhouette)
//   pose.lit: 0 silhouette (in the crypt's mouth) · 1 half-lit (out in the lobby: their fronts pick up the day)
//   FOUNDER_H, FOUNDER_FOOT
import {Buf} from '../px';
import {PAL} from '../palette';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';
import {tiny} from '../rooms/kit-b';

export type FounderId = 'nirb' | 'egap';
export const FOUNDER_W = 44, FOUNDER_H = 86;
export const FOUNDER_FOOT: [number, number] = [22, 84];
export interface FounderPose { arm: 'shade' | 'mug' | 'reach' | 'down'; legs: 'stand' | 'step'; lanyard: boolean; lit: 0 | 1 }
export const FOUNDER_DEFAULT: FounderPose = {arm: 'shade', legs: 'stand', lanyard: false, lit: 0};

const fig = (who: FounderId, p: FounderPose): FigureDef => {
  // NIRB stands 84 (tall, lean); EGAP 78 and a little stooped (his head forward of his shoulders)
  const tall = who === 'nirb';
  const top = tall ? 2 : 8, stoop = tall ? 0 : 2;
  const hipY = tall ? 48 : 50;
  const leg = (g: string, hip: number, kx: number, ky: number, ax: number, ay: number): Part[] => [
    {group: g, mat: 'body', prims: [seg(hip, hipY, 7, kx, ky, 5.6), seg(kx, ky, 5.4, ax, ay, 4.6), P.ell(kx, ky, 2.7, 2.5)]},
    {group: g + 's', mat: 'body', prims: [P.poly(ax - 3, ay, ax + 2.6, ay, ax + 3, ay + 4, ax - 7, ay + 4, ax - 7, ay + 2)]},
  ];
  const parts: Part[] = [];
  if (p.legs === 'step') { parts.push(...leg('legF', 25, 26, 66, 26, 80)); parts.push(...leg('legN', 19, 14, 58, 15, 70)); }
  else { parts.push(...leg('legF', 25, 25.4, 66, 25.6, 80)); parts.push(...leg('legN', 19, 18.6, 66, 18.4, 80)); }
  // the torso: NIRB a narrow athletic top, EGAP a fuller zip fleece
  const w = tall ? 0 : 2;
  parts.push({group: 'torso', mat: 'body', prims: [P.poly(14 - w, top + 20, 20, top + 17, 26, top + 17, 31 + w, top + 21, 31 + w, top + 31, 30 + w, hipY + 1, 14 - w, hipY + 1, 14 - w, top + 31, 13 - w, top + 24)]});
  parts.push({group: 'neck', mat: 'body', prims: [P.poly(19 - stoop, top + 13, 24 - stoop, top + 13, 24, top + 18, 19, top + 18)]});
  // the head: a plain oval (no features: they are backlit), EGAP's thrust a little forward (screen-left)
  parts.push({group: 'head', mat: 'body', prims: [P.ell(21.5 - stoop, top + 7, 6, 7.5)]});
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'body', prims: [P.ell(sx, sy, 3.4, 3.6), seg(sx, sy, 6.2, ex, ey, 5.2), seg(ex, ey, 5, hx, hy, 4.2), P.ell(ex, ey, 2.6, 2.6), P.ell(hx, hy, 2.4, 2.4)]});
  const s = top + 22;
  // arms: [far elbow, far hand, near elbow, near hand]
  const A: Record<FounderPose['arm'], number[]> = {
    shade: [30, s + 11, 30, s + 20, 13, s + 4, 16 - stoop, top + 4],
    mug: [28, s + 10, 22, s + 8, 15, s + 10, 20, s + 8],
    reach: [30, s + 11, 30, s + 20, 11, s + 8, 4, s + 8],
    down: [30, s + 11, 30, s + 20, 15, s + 11, 15, s + 20],
  };
  const a = A[p.arm];
  parts.unshift(sl('armF', 29, s, a[0], a[1], a[2], a[3]));
  parts.push(sl('armN', 16, s, a[4], a[5], a[6], a[7]));
  const stamps: Stamp[] = [];
  if (tall) stamps.push({x: 16 - stoop, y: top + 5, rows: ['GGw', 'GG.'], pal: {G: ['prism', 4], w: ['prism', 5]}}); // NIRB's small prism over one eye
  if (p.lanyard) stamps.push({x: 18, y: top + 18, rows: ['r...r', '.r.r.', '..r..', '.www.', '.wkw.', '.www.'], pal: {r: ['strap', 3], w: ['card', 4], k: ['card', 1]}});
  if (p.arm === 'mug' && !tall) stamps.push({x: 6, y: s + 1, rows: [
    // the oversized mug, both hands on it, RETIRED / 2019 (its letters are drawn by drawFounder after the rig)
    'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm..',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm..',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMmmm',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm.m',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm.m',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm.m',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm.m',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMmmm',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm..',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm..',
    'mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm..',
    '.mmmmmmmmmmmmmmmmmmmmmmmmmmmm...',
  ], pal: {m: ['mug', 2], M: ['mug', 4]}});
  return {w: FOUNDER_W, h: FOUNDER_H, parts, stamps};
};
// silhouette ramps: the body one rung off black, the lit edge in the lobby's daylight (lit 1: the front half-lit)
const SIL = (lit: 0 | 1): Record<string, number[]> => ({
  body: lit ? [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5, PAL.G6] : [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.P1],
  prism: [PAL.N1, PAL.C2, PAL.C4, PAL.C6, PAL.C7, PAL.C9],
  strap: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3, PAL.R3],
  card: [PAL.G4, PAL.G5, PAL.P1, PAL.P2, PAL.P2, PAL.P2],
  mug: [PAL.N1, PAL.G4, PAL.G5, PAL.P1, PAL.P2, PAL.P2],
});
const rig = (lit: 0 | 1): LightRig => ({
  key: [0.2, -1], keyBand: lit ? 2 : 1, shadowBand: 0, rim: true, outline: false,
  back: [-0.6, -0.8], backBand: 1, backRamp: {body: lit ? PAL.G5 : PAL.P0},
  ramps: SIL(lit), noEdge: ['prism', 'strap', 'card', 'mug'],
});
export const founderImg = memo((q: {who: FounderId; p: FounderPose}) => renderFigure(fig(q.who, q.p), rig(q.p.lit)));
export const drawFounder = (b: Buf, who: FounderId, footX: number, footY: number, p: FounderPose, o: {clip?: (x: number, y: number) => boolean; flip?: boolean} = {}) => {
  const img = founderImg({who, p});
  const fx = o.flip ? FOUNDER_W - 1 - FOUNDER_FOOT[0] : FOUNDER_FOOT[0];
  const x = footX - fx, y = footY - FOUNDER_FOOT[1];
  blitImg(b, img, x, y, {flip: o.flip, clip: o.clip});
  // EGAP's mug: its words, legible (tiny caps, ink on the mug's cream)
  if (who === 'egap' && p.arm === 'mug') {
    const s = 8 + 22;
    const mx = o.flip ? x + FOUNDER_W - 1 - 6 - 29 : x + 6, my = y + s + 1;
    const clip = o.clip;
    const tmp = new Buf(b.w, b.h, 0x1000000);
    tiny(tmp, 'RETIRED', mx + 2, my + 1, PAL.N1);
    tiny(tmp, '2019', mx + 8, my + 6, PAL.R2);
    for (let i = 0; i < tmp.c.length; i++) { const v = tmp.c[i]; if (v === 0x1000000) continue; const X = i % b.w, Y = Math.floor(i / b.w); if (!clip || clip(X, Y)) b.c[i] = v; }
  }
};
