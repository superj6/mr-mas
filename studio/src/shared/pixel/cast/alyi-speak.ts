// MR. MAS — cast: ALYI, speaking set (Ep1 act 4; new file, owned by the act-4 character artist).
// cast/alyi.ts (not edited) gives his portrait two mouths (rest / open). Act 4 has him talking a lot, almost always
// as a REFLECTION in glass or cut off by a doorframe, so this module adds:
//   alyiSpeakPortrait     the full six-mouth set, patched into alyi.ts's portrait (eyes open / closed / tokens)
//   alyiReflection        that portrait as a reflection on dark glass: mirrored, remapped to a cool dim ramp by
//                         lightness (never a blend), with the glass's sheen on top; flicker 'there' | 'gone'
//   drawAlyiWindow        the dark boardroom window with his reflection in it (sc 27: "a reflection in the dark
//                         window"; the two-frame flicker)
//   drawAlyiTile          his call tile: a doorway, and he is a reflection in its glass (sc 26)
//   drawAlyiMini          38x22
//   alyiStand / drawAlyiStand  room sprite, standing, 3/4 facing screen-right, for the doorway beats (sc 27, 30):
//                         the bullpen builder clips it with the doorframe ("half cut off by its frame")
// Guardrails: the cathedral is generic tech, never religious iconography; no mental-health readings.
import {Buf, rect, bayer, hash} from '../px';
import {PAL, lightness} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg} from './kit';
import {alyiPortrait, ALYI_PW, ALYI_PH, AlyiPortraitState} from './alyi';
import {Viseme, patchMouth} from './talk';
import {Clip, clipped, tileClip} from './calltile';

export interface AlyiSpeakState { mouth: Viseme; eyes: AlyiPortraitState['eyes']; t: number; }
export const ALYI_SPEAK_DEFAULT: AlyiSpeakState = {mouth: 'rest', eyes: 'open', t: 0};

// his portrait's mouth sits at (38, 74) (alyi.ts stamp y 71 + the 3px head drop); the rest drawing is 2 rows
const MOUTHS: Record<Viseme, {dy: number; rows: string[]}> = {
  rest: {dy: 0, rows: ['mmmmmmmmmm..', '..llllll....']},
  smile: {dy: -1, rows: ['.........m..', 'mmmmmmmmm...', '..llllll....']},
  A: {dy: 0, rows: ['mmmmmmmmmm..', 'mTTTTTTTm...', 'mddddddm....', '.mddddm.....', '..llll......']},
  E: {dy: 0, rows: ['mmmmmmmmmmm.', 'mTTTTTTTTm..', '.mddddddm...', '..llll......']},
  O: {dy: 0, rows: ['..mmmmm.....', '.mdddddm....', '.mdddddm....', '..mmmmm.....', '...lll......']},
  M: {dy: 0, rows: ['mmmmmmmmmm..', '.MMMMMMMM...', '..llllll....']},
};
export const alyiSpeakPortrait = memo((s: AlyiSpeakState): Img => {
  const base = alyiPortrait({eyes: s.eyes, mouth: 'rest', t: s.t});
  const m = MOUTHS[s.mouth];
  return patchMouth(base, {x: 39, y: 73, w: 11, h: 6, fillFromRow: 72}, 38, 74 + m.dy, m.rows, {m: PAL.S0, d: PAL.N0, l: PAL.S3, T: PAL.P1, M: PAL.S1});
});

// ------------------------------------------------------------------ the reflection
// Dark glass shows only the brighter half of what it reflects: lightness is mapped onto a dim cool ramp and the
// darkest tones drop out (the glass's own colour shows through). Mirrored, because it is a reflection.
const GLASS_RAMP = [-1, -1, -1, -2, PAL.N3, PAL.N4, PAL.N5, PAL.C2];
export const alyiReflection = memo((s: AlyiSpeakState & {mirror?: boolean}): Img => {
  const src = alyiSpeakPortrait({mouth: s.mouth, eyes: s.eyes, t: s.t});
  const out: Img = {w: src.w, h: src.h, c: new Int32Array(src.w * src.h).fill(-1)};
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
    const v = src.c[y * src.w + (s.mirror === false ? x : src.w - 1 - x)];
    if (v < 0) continue;
    const L = lightness(v);
    const k = Math.max(0, Math.min(GLASS_RAMP.length - 1, Math.floor((L - 0.1) / 0.075)));
    let c = GLASS_RAMP[k];
    // -2: the faintest rung is half there (an ordered 50% screen), so the night behind shows through him
    if (c === -2) c = ((x + y) & 1) === 0 ? PAL.N3 : -1;
    // the tokens stay bright in the glass: the machine shows through the man
    out.c[y * src.w + x] = v === PAL.C6 || v === PAL.C8 ? PAL.C6 : c;
  }
  return out;
});
/** the glass's own sheen: two thin diagonal streaks, fixed to the glass (they never move with him) */
const sheen = (b: Buf, x: number, y: number, w: number, h: number, clip: Clip) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const u = i + j * 0.55;
    if ((u > w * 0.18 && u < w * 0.18 + 2) || (u > w * 0.26 && u < w * 0.26 + 1)) { const X = x + i, Y = y + j; if (clip(X, Y) && bayer(X, Y) < 0.5) b.set(X, Y, PAL.N4); }
  }
};
export type AlyiFlicker = 'there' | 'gone';

/**
 * The boardroom's dark window with Alyi reflected in it: night city far below (a few dim lights), the mullions,
 * his reflection, the sheen. flicker 'gone' = the window alone (the two-frame "there and not there").
 * dx shifts the reflection inside the window (whole px) to stage it.
 */
export const drawAlyiWindow = (b0: Buf, x: number, y: number, w: number, h: number, s: AlyiSpeakState, o: {flicker?: AlyiFlicker; dx?: number; dy?: number} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N1));
  for (let j = Math.floor(h * 0.6); j < h; j++) for (let i = 0; i < w; i++) if (hash(i, j, 71) > 0.985) b.set(x + i, y + j, hash(i, j, 72) < 0.5 ? PAL.W4 : PAL.C3);
  if (o.flicker !== 'gone') {
    const img = alyiReflection({...s, mirror: true});
    blitImg(b0, img, x + Math.round(w / 2 - ALYI_PW / 2) + (o.dx ?? 0), y + h - ALYI_PH + (o.dy ?? 0), {clip});
  }
  sheen(b0, x, y, w, h, clip);
  // mullions: the window's frame bars
  rect(x + Math.round(w / 2) - 1, y, 2, h, b.ink(PAL.N0));
  rect(x, y + Math.round(h * 0.55), w, 2, b.ink(PAL.N0));
};

// ------------------------------------------------------------------ his call tile: a doorway, a reflection
/** Tile: a dim corridor doorway with a tall glass panel; Alyi is only his reflection in the glass. */
export const drawAlyiTile = (b0: Buf, x: number, y: number, w: number, h: number, s: AlyiSpeakState, o: {flicker?: AlyiFlicker} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  // a warm-dark wall; the door frame (wood) centred; the door's glass panel
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, bayer(x + i, y + j) < 0.3 ? PAL.W1 : PAL.W0);
  const dw = Math.round(w * 0.46), dx = x + Math.round((w - dw) / 2);
  rect(dx - 5, y, dw + 10, h, b.ink(PAL.D2)); rect(dx - 5, y, 2, h, b.ink(PAL.D3)); rect(dx + dw + 3, y, 2, h, b.ink(PAL.D1));
  rect(dx - 1, y, dw + 2, h, b.ink(PAL.D1));
  const gx = dx + 3, gy = y + 4, gw = dw - 6, gh = h - 4;
  const gc = tileClip(gx, gy, gw, gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) b.set(gx + i, gy + j, PAL.N1);
  if (o.flicker !== 'gone') {
    const img = alyiReflection({...s, mirror: true});
    blitImg(b0, img, gx + Math.round(gw / 2 - ALYI_PW / 2) + 4, gy + gh - ALYI_PH + 22, {clip: (px, py) => gc(px, py) && clip(px, py)});
  }
  sheen(b0, gx, gy, gw, gh, (px, py) => gc(px, py) && clip(px, py));
  // the door's push bar and hinge edge
  rect(gx - 1, gy + Math.round(gh * 0.55), 2, 6, b.ink(PAL.G4));
};
export const drawAlyiMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.W0));
  const cx = x + Math.floor(w / 2);
  rect(cx - 9, y, 18, h, b.ink(PAL.D2)); rect(cx - 7, y + 1, 14, h - 1, b.ink(PAL.N1));
  rect(cx - 3, y + 6, 6, 8, b.ink(PAL.N3)); rect(cx - 3, y + 6, 6, 3, b.ink(PAL.N4));
  rect(cx - 6, y + h - 5, 12, 5, b.ink(PAL.N2));
  b.set(cx - 2, y + 10, PAL.C2); b.set(cx + 1, y + 10, PAL.C2);
};

// ------------------------------------------------------------------ room sprite: standing, 3/4 facing screen-right
export const ALYI_STAND_W = 40;
export const ALYI_STAND_H = 80;
export const ALYI_STAND_FOOT: [number, number] = [19, 78];
export type AlyiStandLight = 'room' | 'door' | 'sil';
export interface AlyiStandPose { mouth: 'rest' | 'open'; lid: 0 | 1 | 2; arms: 'down' | 'clasp'; light: AlyiStandLight; }
export const ALYI_STAND_DEFAULT: AlyiStandPose = {mouth: 'rest', lid: 0, arms: 'down', light: 'door'};
const SHEAD = [
  '....oo4455oo....',
  '..o344455555o...',
  '.o33444455554o..',
  '.o3344444555o5..',
  'hh2334444455o...',
  'hhh23444bbbbb...',
  'hhh2234eO4Oe4o..',
  'hhh22334444444o.',
  '.hh22334444444o5',
  '.oh2233444444o..',
  '..o1223344m44o..',
  '..o122333444o...',
  '...o11222333o...',
  '....oo11122o....',
  '......o112o.....',
];
const sfig = (p: AlyiStandPose): FigureDef => {
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(hip, 44, 7.2, kx, 58, 5.8), seg(kx, 58, 5.6, ax, 73, 4.6), P.ell(kx, 58, 2.8, 2.6)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.4, 72, ax + 2.4, 72, ax + 6, 75, ax + 6, 78, ax - 2.8, 78)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'sw', prims: [P.ell(sx, sy, 3.6, 3.8), seg(sx, sy, 6.6, ex, ey, 5.8), seg(ex, ey, 5.6, hx, hy, 4.8), P.ell(ex, ey, 2.8, 2.8)]});
  const A = p.arms === 'clasp' ? {n: [27, 32, 23, 38], f: [14, 32, 20, 38]} : {n: [26, 32, 26.4, 41], f: [14, 32, 14.4, 41]};
  const parts: Part[] = [
    ...leg('legF', 15.5, 15.4, 15),
    sl('armF', 14, 21, A.f[0], A.f[1], A.f[2], A.f[3]),
    ...leg('legN', 21, 21.4, 21.6),
    {group: 'torso', mat: 'sw', prims: [P.poly(13, 18, 19, 16, 25, 17, 28, 21, 28, 30, 27, 37, 28, 45, 11, 45, 11, 38, 10, 30, 10, 22)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(18, 13, 23, 13, 23, 17, 18, 17)]},
    sl('armN', 25, 21, A.n[0], A.n[1], A.n[2], A.n[3]),
  ];
  const rows = SHEAD.slice();
  if (p.lid === 2) rows[6] = 'hhh2234bbbbbb4o.'.slice(0, 16);
  if (p.lid === 1) rows[6] = 'hhh2234eb4be4o..';
  if (p.mouth === 'open') { rows[10] = '..o1223344M44o..'; rows[11] = '..o12233M444o...'; }
  const stamps: Stamp[] = [
    {x: 11, y: 0, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], b: ['hair', 0], e: ['dark', 0], O: ['glint', 0], m: ['skin', 1], M: ['dark', 0],
    }},
  ];
  if (p.arms === 'clasp') stamps.push({x: 19, y: 36, rows: ['.3443.', '344443', '233332', '.2222.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  else for (const [hx, hy] of [[A.f[2], A.f[3]], [A.n[2], A.n[3]]]) stamps.push({x: Math.round(hx) - 1, y: Math.round(hy) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  return {w: ALYI_STAND_W, h: ALYI_STAND_H, parts, adjust: [{prims: [P.rect(0, 60, ALYI_STAND_W, 20)], add: -1, onlyMat: 'pants'}], stamps};
};
const SLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.W8],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
  sw: [PAL.N0, PAL.N1, PAL.X0, PAL.X1, PAL.X2, PAL.W5],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  glint: [PAL.W8, PAL.W8, PAL.W8, PAL.W8, PAL.W8, PAL.W8],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const SSIL: Record<string, number[]> = Object.fromEntries(Object.keys(SLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
SSIL.glint = [PAL.W6, PAL.W6, PAL.W6, PAL.W6, PAL.W6, PAL.W6];
const srig = (light: AlyiStandLight): LightRig => ({
  // 'door': the conference room behind him is lit (tungsten back-light through the gap); 'room': overhead
  key: light === 'door' ? [0.3, -0.95] : [0.55, -0.83], keyBand: light === 'door' ? 1 : 3, shadowBand: 3, rim: true, outline: true,
  back: light === 'door' ? [-1, -0.2] : [-1, -0.1], backBand: light === 'door' ? 2 : 1,
  backRamp: light === 'sil' ? {skin: PAL.W6, hair: PAL.W6, sw: PAL.W6, pants: PAL.W4, shoe: PAL.W3} : {skin: PAL.W6, hair: PAL.W4, sw: PAL.W4, pants: PAL.W3, shoe: PAL.W2},
  ramps: light === 'sil' ? SSIL : SLIT,
  groupBands: {torso: {key: 3, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 44 ? 1 : Math.max(0.25, 1 - (y - 44) / 34)),
});
export const alyiStand = memo((p: AlyiStandPose) => renderFigure(sfig(p), srig(p.light)));
export const drawAlyiStand = (b: Buf, footX: number, footY: number, p: AlyiStandPose, o: {flip?: boolean; clip?: Clip; map?: (c: number) => number} = {}) => {
  const fx = o.flip ? ALYI_STAND_W - 1 - ALYI_STAND_FOOT[0] : ALYI_STAND_FOOT[0];
  blitImg(b, alyiStand(p), footX - fx, footY - ALYI_STAND_FOOT[1], {flip: o.flip, clip: o.clip, map: o.map});
};
