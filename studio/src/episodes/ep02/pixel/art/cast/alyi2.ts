// MR. MAS — Ep2 v1 art: ALYI's Ep2 states (manifest §2.1; sc 4 F2.3, 12, 15 F2.2, 22). His rigs are Ep1's, imported
// read-only (cast/alyi.ts, alyi-speak.ts); everything new is composed here. His rules (the character file, LEARNINGS
// P8): A PERSON THROUGHOUT, warm and human in the 2022 flashback; SOME PART OF HIM IS ALWAYS CUT OFF BY A FRAME (the
// sets do the cropping: a light swag, a monitor's edge, a doorway, the slot); no reflections or surfaces in the present
// (sc 14 has none); he never looks up at the white door.
//   alyiWarm(s)            the bust (112 x 136, faces camera-left; flip for camera-right) with Ep2's moods and arms:
//                          s.mood 'calm' | 'smile' | 'laugh' (Ep1's party grammar: closed happy eyes, the open laugh) |
//                          'focus' (2023 at his screen); s.mouth a viseme (talking to Mas: lip-sync); s.arm 'none' |
//                          'raise' (the chant: his hand up, palm open) | 'phone' (holding up TPOOL's check-in screen) |
//                          'torch' (the long match for the effigy); s.light 'party' (T4 warm) | 'screen' (2023 night,
//                          cyan) | 'fire' (the offsite) | 'day' (2018, for the T3 paper pass)
//   drawAlyiRoom2(b, x, y, p)  room scale (40 x 80, faces screen-right): p.arm 'raise' | 'torch' | 'phone' | 'down',
//                          p.light 'party' | 'fire' | 'room'; the torch's flame palette-cycles on p.f (never a strobe)
//   drawAlyiAtWork(b, x, y, f) sc 22's glimpse: seated at a desk under a warm lamp, head down, writing; he never looks up
//   drawTpoolCheckIn(b, x, y, w, h, k)  the phone screen he holds up: TPOOL's CHECK IN with `feel the agi` typed
import {Buf, rect, line, bayer} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../../shared/pixel/palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../../../../../shared/pixel/figure';
import {memo, seg} from '../../../../../shared/pixel/cast/kit';
import {alyiSpeakPortrait, ALYI_STAND_W, ALYI_STAND_H, ALYI_STAND_FOOT} from '../../../../../shared/pixel/cast/alyi-speak';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {armTo, capsule, Sleeve, fill, pt, tiny, TR} from '../kit';
import {sheetPlate, sheetImg, sheetRoom, label} from './sheet';
import type {ArtAsset} from '../asset';

export type AlyiMood = 'calm' | 'smile' | 'laugh' | 'focus';
export type AlyiArm2 = 'none' | 'raise' | 'phone' | 'torch';
export type AlyiLight2 = 'party' | 'screen' | 'fire' | 'day';
export interface AlyiWarmState { mood: AlyiMood; mouth: Viseme; arm: AlyiArm2; light: AlyiLight2; f?: number }
export const ALYI_WARM_DEFAULT: AlyiWarmState = {mood: 'smile', mouth: 'rest', arm: 'none', light: 'party'};

// ------------------------------------------------------------------ face: Ep1's party grammar (act3/art/party.ts, copied)
/** happy eyes (local): the lids closed into upward arcs, the lower lids pushed up by the cheeks, a crease outside */
const happyEyes = (b: Buf, band: [number, number, number, number], eyes: Array<[number, number, number]>, outer: number) => {
  // the sockets filled with the lit lid's skin, then each eye a closed upward arc two pixels thick (a laugh's squeeze),
  // the cheek pushed up under it (a short lit bump, not a line), a crease at the outer corner
  const [bx0, bx1, by0, by1] = band;
  for (let x = bx0; x <= bx1; x++) { const skin = b.get(x, by1 + 3); for (let y = by0; y <= by1; y++) b.set(x, y, skin); }
  for (const [cx, cy, w] of eyes) {
    const h = w / 2;
    for (let i = -Math.floor(h); i <= Math.floor(h); i++) { const yy = cy + 1 - Math.round((1 - Math.pow(Math.abs(i) / h, 2)) * 2); b.set(cx + i, yy, PAL.S0); b.set(cx + i, yy + 1, Math.abs(i) < h - 1 ? PAL.N1 : PAL.S2); }
    for (let i = -1; i <= 1; i++) b.set(cx + i, cy + 4, PAL.S5);
  }
  b.set(outer, eyes[1][1], PAL.S2); b.set(outer + 1, eyes[1][1] - 1, PAL.S2); b.set(outer, eyes[1][1] + 2, PAL.S2);
};
const ALYI_EYES = {band: [34, 60, 45, 50] as [number, number, number, number], eyes: [[39, 47, 7], [51, 47, 10]] as Array<[number, number, number]>, outer: 58};
/** his open laugh (local): the teeth, the dark of the mouth, its corners up */
const alyiLaugh = (b: Buf, open: number) => {
  const y0 = 72;
  for (let x = 40; x <= 49; x++) b.set(x, y0, PAL.P2);
  for (let y = 1; y <= open; y++) for (let x = 39 + (y === open ? 1 : 0); x <= 50 - (y === open ? 1 : 0); x++) b.set(x, y0 + y, PAL.N1);
  for (let x = 41; x <= 48; x++) b.set(x, y0 + open + 1, PAL.S3);
  b.set(38, y0 - 1, PAL.S2); b.set(51, y0 - 1, PAL.S2);
};
/** a closed warm smile (local): the corners lifted, the cheek's lit bump */
const alyiSmile = (b: Buf) => {
  b.set(37, 72, PAL.S1); b.set(38, 73, PAL.S0); b.set(48, 72, PAL.S1); b.set(49, 71, PAL.S1);
  for (let x = 50; x <= 55; x++) b.set(x, 64, stepColor(b.get(x, 64), 1));
};

// ------------------------------------------------------------------ light remaps (a palette walk, never a blend)
const remap: Record<AlyiLight2, (c: number) => number> = {
  party: (c) => c,
  day: (c) => c,
  screen: (c) => {
    const fm = familyOf(c); if (!fm) return c;
    const L = lightness(c);
    // a person lit by a screen (P8): his own skin, the screen's cyan only on the lit planes (the key side)
    if (fm[0] === 'S') return fm[1] >= 5 ? PAL.K3 : fm[1] === 4 ? PAL.K2 : fm[1] === 3 ? PAL.S3 : c;
    if (fm[0] === 'W') return L > 0.6 ? PAL.C7 : PAL.C4;
    // (the light things, an eye's white, a glint, stay light: the screen's cyan, not its dark)
    return L < 0.12 ? PAL.N0 : L < 0.2 ? PAL.N1 : L < 0.28 ? PAL.C0 : L < 0.38 ? PAL.C1 : L < 0.55 ? PAL.C2 : L < 0.75 ? PAL.C5 : PAL.C7;
  },
  fire: (c) => {
    const fm = familyOf(c); if (!fm) return c;
    const L = lightness(c);
    if (fm[0] === 'S') return stepColor(c, 1);
    const W = [PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6];
    return W[Math.max(0, Math.min(7, Math.round(L * 9)))];
  },
};

// ------------------------------------------------------------------ the bust
const SW: Sleeve = [PAL.X0, PAL.X1, PAL.X2, PAL.W5];
const SK = [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6];
/** an open palm, fingers up (local), its thumb toward the face (the chant's raised hand) */
const openPalm = (b: Buf, x: number, y: number) => {
  // the palm (10 x 8) facing camera, four fingers up (the middle two longest), 1 px shadow between them, the thumb
  // out toward the face (left), the wrist's crease
  for (let j = 0; j < 8; j++) for (let i = 0; i < 10; i++) b.set(x + i, y + 10 + j, j === 0 ? SK[3] : i === 9 ? SK[1] : i < 2 ? SK[3] : SK[2]);
  const L = [6, 9, 10, 7];
  for (let f = 0; f < 4; f++) {
    const cx = x + 1 + f * 2 + (f > 1 ? 1 : 0);
    for (let j = 1; j <= L[f]; j++) { b.set(cx, y + 10 - j, j === L[f] ? SK[4] : SK[3]); b.set(cx + 1, y + 10 - j, j === L[f] ? SK[3] : SK[2]); }
    if (f < 3) for (let j = 1; j <= 3; j++) b.set(cx + 2 + (f === 1 ? 1 : 0), y + 10 - j, SK[0]);
  }
  for (let j = 0; j < 5; j++) { b.set(x - 1 - Math.floor(j / 2), y + 15 - j, SK[3]); b.set(x - Math.floor(j / 2), y + 15 - j, SK[2]); }
  for (let i = 1; i < 9; i++) b.set(x + i, y + 17, SK[1]);
};
/** the phone held up (local): a dark slab, its screen TPOOL's check-in */
export const drawTpoolCheckIn = (b: Buf, x: number, y: number, w: number, h: number, k = 99) => {
  fill(b, x, y, w, h, PAL.U1);
  fill(b, x, y, w, 7, PAL.W5); tiny(b, 'TPOOL', x + 2, y + 1, PAL.P2);
  fill(b, x + 2, y + 9, w - 4, 8, PAL.P2); tiny(b, 'CHECK IN', x + 4, y + 10, PAL.U2);
  const s = 'feel the agi'.slice(0, Math.max(0, k));
  fill(b, x + 2, y + 19, w - 4, h - 23, PAL.U0);
  if (w >= 40) pt(b, s, x + 4, y + 21, PAL.L3); else tiny(b, s.toUpperCase().slice(0, 8), x + 3, y + 21, PAL.L3);
  // the pin, bobbing on the map strip
  b.set(x + w - 6, y + h - 6, PAL.W7); b.set(x + w - 6, y + h - 5, PAL.W6);
};
/** a match's small flame (a teardrop, 3 px wide at most), its tip flickering on held drawings */
const matchFlame = (b: Buf, x: number, y: number, f: number) => {
  const ph = Math.floor(f / 3) % 3, H = [4, 5, 4][ph];
  for (let j = 0; j < H; j++) { const w = j < 2 ? 1 : 0; for (let i = -w; i <= w; i++) b.set(x + i + (j === H - 1 && ph === 1 ? 1 : 0), y - j, j === 0 ? PAL.W8 : j < 2 ? (i === 0 ? PAL.W9 : PAL.W6) : PAL.W5); }
};
const flame = (b: Buf, x: number, y: number, f: number, big = false) => {
  const ph = Math.floor(f / 3) % 4;
  const H = big ? [8, 10, 9, 11][ph] : [5, 6, 5, 7][ph];
  for (let j = 0; j < H; j++) { const w = Math.max(1, Math.round((big ? 3.4 : 2.2) * Math.sin(((j + 1) / (H + 1)) * Math.PI))); for (let i = -w; i <= w; i++) b.set(x + i + (j > H / 2 && ph % 2 ? 1 : 0), y - j, j < H * 0.35 ? (Math.abs(i) < w ? PAL.W8 : PAL.W6) : Math.abs(i) < w - 1 ? PAL.W7 : PAL.W5); }
};
/** his eyes OPEN and warm (the art review: Ep1's deep sockets read as dark bands with a glint; warm reads warm only
 *  when the eyes have whites and the brows soften): the sockets lifted to the cheek's skin, the eyes drawn with whites,
 *  an iris and a glint, the heavy brows thinned and raised a pixel (local, the bust's coordinates) */
const openWarmEyes = (b: Buf) => {
  const [bx0, bx1, by0, by1] = ALYI_EYES.band;
  // (the Ep1 portrait's dark S0 sockets go too, all but the silhouette's own outline: an S0 pixel with a transparent
  // neighbour)
  const edge = (x: number, y: number) => b.get(x - 1, y) === TR || b.get(x + 1, y) === TR || b.get(x, y - 1) === TR || b.get(x, y + 1) === TR;
  for (let x = bx0; x <= bx1 + 6; x++) { const skin = b.get(x, by1 + 4); for (let y = by0 - 3; y <= by1 + 1; y++) { const c = b.get(x, y); if (c !== TR && c !== PAL.W8 && !(c === PAL.S0 && edge(x, y))) b.set(x, y, skin); } }
  const near = ['..LLLLLLL..', '.LwwIIIgw..', '..wwIIIww..', '...kkkkk...'];
  const far = ['.LLLL.', 'LwIIg.', '.kkk..'];
  const P0: Record<string, number> = {L: PAL.N0, w: PAL.P1, I: PAL.B2, g: PAL.W8, k: PAL.S3};
  const st = (x: number, y: number, rows: string[]) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const v = P0[r[i]]; if (v !== undefined) b.set(x + i, y + j, v); } });
  st(49, 46, near); st(38, 47, far);
  b.set(54, 47, PAL.N0); b.set(53, 48, PAL.N0); b.set(40, 48, PAL.N0);
  // the brows: softer, a pixel higher, arched (the earnest, open brow), the dark of the old ones gone
  for (let x = 48; x <= 61; x++) b.set(x, x < 52 || x > 58 ? 43 : 42, PAL.B1);
  for (let x = 37; x <= 43; x++) b.set(x, x < 40 ? 44 : 43, PAL.B1);
};
export const alyiWarm = memo((s: AlyiWarmState): Img => {
  const W = 112, H = 136;
  const b = new Buf(W, H, TR);
  const laughOpen = s.mood === 'laugh' && s.mouth === 'rest';
  const base = alyiSpeakPortrait({mouth: laughOpen ? 'rest' : s.mood === 'smile' && s.mouth === 'rest' ? 'smile' : s.mouth, eyes: 'open', t: 0});
  blitImg(b, base, 0, 0);
  // smiling or laughing, talking or not, the eyes smile with the mouth (the crinkled happy eyes of Ep1's party);
  // calm (the flame, the 2018 look back) and focused (2023) the eyes are open with whites and the brows soften
  if (s.mood === 'laugh' || s.mood === 'smile') happyEyes(b, ALYI_EYES.band, ALYI_EYES.eyes, ALYI_EYES.outer);
  else openWarmEyes(b);
  if (laughOpen) alyiLaugh(b, 4);
  else if (s.mood === 'smile' && s.mouth === 'rest') alyiSmile(b);
  if (s.mood === 'focus') { for (let x = 48; x <= 58; x++) b.set(x, 43, PAL.B0); }
  // arms (Ep1's party construction: shoulder -> elbow -> wrist, the hand gripping)
  if (s.arm === 'raise') {
    armTo(b, [22, 112], [8, 92], [12, 66], SW, 7, 6);
    openPalm(b, 6, 44);
  } else if (s.arm === 'phone') {
    armTo(b, [22, 112], [10, 132], [18, 102], SW, 7, 6);
    fill(b, 4, 70, 24, 34, PAL.N0); fill(b, 5, 71, 22, 32, PAL.U1); fill(b, 5, 71, 22, 6, PAL.W5); fill(b, 7, 80, 18, 5, PAL.P2); fill(b, 7, 88, 14, 2, PAL.L3); b.set(22, 98, PAL.W7);
    for (let q = 0; q < 3; q++) { fill(b, 2, 92 + q * 3, 4, 2, SK[2]); b.set(2, 92 + q * 3, SK[3]); }
    fill(b, 24, 90, 4, 12, SK[2]); fill(b, 24, 90, 1, 12, SK[3]);
  } else if (s.arm === 'torch') {
    armTo(b, [22, 112], [10, 132], [24, 108], SW, 7, 6);
    // the long fireplace match: a pale wooden stick, its red head, a small flame (never a sparkler)
    line(26, 104, 12, 64, b.ink(PAL.W5)); line(27, 104, 13, 64, b.ink(PAL.D4));
    fill(b, 11, 62, 3, 3, PAL.R2); b.set(12, 61, PAL.R1);
    flame(b, 12, 60, s.f ?? 0, false);
    for (let q = 0; q < 4; q++) { fill(b, 21, 100 + q * 3, 9, 2, SK[2]); b.set(21, 100 + q * 3, SK[3]); }
  }
  const img: Img = {w: W, h: H, c: new Int32Array(W * H).fill(-1)};
  const m = remap[s.light];
  for (let i = 0; i < W * H; i++) if (b.c[i] !== TR) img.c[i] = m(b.c[i]);
  // the fire's warm rim on the near edge of the face (the flame is at frame left)
  if (s.light === 'fire') for (let y = 20; y < 100; y++) for (let x = 0; x < W; x++) { const v = img.c[y * W + x]; if (v < 0) continue; if (x === 0 || img.c[y * W + x - 1] < 0) { img.c[y * W + x] = PAL.W8; break; } }
  return img;
});

// ------------------------------------------------------------------ room scale (Ep1's alyi-speak stand, copied, more arms)
const SHEAD = [
  '....oo4455oo....', '..o344455555o...', '.o33444455554o..', '.o3344444555o5..', 'hh2334444455o...', 'hhh23444bbbbb...', 'hhh2234eO4Oe4o..',
  'hhh22334444444o.', '.hh22334444444o5', '.oh2233444444o..', '..o122334mmm4o..', '..o122334444443.', '...o1222333332..', '....o11222......', '.....o1122......', '.....o1122......', '.....o1122......',
];
export interface AlyiRoom2 { arm: 'raise' | 'torch' | 'phone' | 'down'; light: 'party' | 'fire' | 'room'; smile?: boolean; f?: number }
const rfig = (p: AlyiRoom2): FigureDef => {
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(hip, 44, 7.2, kx, 58, 5.8), seg(kx, 58, 5.6, ax, 73, 4.6), P.ell(kx, 58, 2.8, 2.6)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.4, 72, ax + 2.4, 72, ax + 6, 75, ax + 6, 78, ax - 2.8, 78)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'sw', prims: [P.ell(sx, sy, 3.6, 3.8), seg(sx, sy, 6.6, ex, ey, 5.8), seg(ex, ey, 5.6, hx, hy, 4.8), P.ell(ex, ey, 2.8, 2.8)]});
  const N = p.arm === 'raise' ? [31, 15, 33, 3] : p.arm === 'torch' ? [30, 30, 35, 24] : p.arm === 'phone' ? [30, 30, 33, 22] : [26, 32, 26.4, 41];
  const parts: Part[] = [
    ...leg('legF', 15.5, 15.4, 15), sl('armF', 14, 21, 14, 32, 14.4, 41), ...leg('legN', 21, 21.4, 21.6),
    {group: 'torso', mat: 'sw', prims: [P.poly(13, 18, 19, 16, 25, 17, 28, 21, 28, 30, 27, 37, 28, 45, 11, 45, 11, 38, 10, 30, 10, 22)]},
    sl('armN', 25, 21, N[0], N[1], N[2], N[3]),
  ];
  const rows = SHEAD.slice();
  if (p.smile) { rows[6] = 'hhh2234bb4bb4o..'; rows[10] = '..o12233m444m4o.'; rows[11] = '..o122334mmm43..'; }
  const stamps: Stamp[] = [{x: 11, y: 0, rows, pal: {o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5], h: ['hair', 1], b: ['hair', 0], e: ['dark', 0], O: ['glint', 0], m: ['skin', 1], M: ['dark', 0]}}];
  const hand = (x: number, y: number) => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]} as Stamp['pal']});
  stamps.push(hand(14.4, 41));
  if (p.arm !== 'raise') stamps.push(hand(N[2], N[3]));
  return {w: ALYI_STAND_W, h: ALYI_STAND_H, parts, adjust: [{prims: [P.rect(0, 60, ALYI_STAND_W, 20)], add: -1, onlyMat: 'pants'}], stamps};
};
const RAMP = (light: AlyiRoom2['light']): Record<string, number[]> => light === 'fire' ? {
  skin: [PAL.S0, PAL.S2, PAL.S4, PAL.S5, PAL.S6, PAL.W8], hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.W3, PAL.W5], sw: [PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W6],
  pants: [PAL.N0, PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3], shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3], glint: Array(6).fill(PAL.W8), dark: Array(6).fill(PAL.N0),
} : {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.W8], hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4], sw: [PAL.N0, PAL.N1, PAL.X0, PAL.X1, PAL.X2, PAL.W5],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3], glint: Array(6).fill(PAL.W8), dark: Array(6).fill(PAL.N0),
};
const rrig = (light: AlyiRoom2['light']): LightRig => ({
  key: light === 'fire' ? [1, -0.4] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1, backRamp: {skin: PAL.W6, hair: PAL.W4, sw: PAL.W4, pants: PAL.W3, shoe: PAL.W2},
  ramps: RAMP(light),
  groupBands: {torso: {key: 3, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 44 ? 1 : Math.max(0.25, 1 - (y - 44) / 34)),
});
const roomImg = memo((p: AlyiRoom2) => renderFigure(rfig({...p, f: 0}), rrig(p.light)));
export const drawAlyiRoom2 = (b: Buf, footX: number, footY: number, p: AlyiRoom2, o: {flip?: boolean; clip?: (x: number, y: number) => boolean} = {}) => {
  const fx = o.flip ? ALYI_STAND_W - 1 - ALYI_STAND_FOOT[0] : ALYI_STAND_FOOT[0];
  const x0 = footX - fx, y0 = footY - ALYI_STAND_FOOT[1];
  blitImg(b, roomImg({...p, f: 0}), x0, y0, {flip: o.flip, clip: o.clip});
  const X = (lx: number) => (o.flip ? x0 + ALYI_STAND_W - 1 - lx : x0 + lx);
  // the long fireplace match: a pale wooden stick from his hand, its red head, a small flame at the tip
  if (p.arm === 'torch') { line(X(35), y0 + 24, X(39), y0 + 7, b.ink(p.light === 'fire' ? PAL.W6 : PAL.P1)); b.set(X(39), y0 + 6, PAL.R2); b.set(X(39), y0 + 5, PAL.R1); matchFlame(b, X(39), y0 + 4, p.f ?? 0); }
  // the raised hand above his head, open, the fingers spread (the chant)
  if (p.arm === 'raise') {
    const sk = p.light === 'fire' ? [PAL.S2, PAL.S4, PAL.S5, PAL.S6] : [PAL.S1, PAL.S3, PAL.S4, PAL.S5];
    line(X(33), y0 + 4, X(34), y0 - 3, b.ink(sk[1])); line(X(32), y0 + 4, X(33), y0 - 3, b.ink(sk[2]));
    const hx = X(34), hy = y0 - 4;
    fill(b, hx - 2, hy - 3, 5, 4, sk[2]); fill(b, hx - 2, hy - 3, 5, 1, sk[3]);
    for (const [fx, fh] of [[-2, 3], [0, 4], [2, 4]] as Array<[number, number]>) for (let j = 1; j <= fh; j++) b.set(hx + fx + (o.flip ? 0 : 0), hy - 3 - j, j === fh ? sk[3] : sk[2]);
    b.set(hx - 3, hy - 2, sk[2]); b.set(hx - 4, hy - 3, sk[3]);
    b.set(hx + 3, hy - 4, sk[2]); b.set(hx + 4, hy - 6, sk[2]);
  }
  if (p.arm === 'phone') { fill(b, X(o.flip ? 35 : 32), y0 + 16, 4, 6, PAL.N0); fill(b, X(o.flip ? 34 : 33), y0 + 17, 2, 4, PAL.L2); }
};

// ------------------------------------------------------------------ sc 22: at work inside ISS (never looks up)
/** a medium-small seated figure at a desk in profile (facing screen-left), head bowed over the page, the near hand
 *  writing (a 2-step held pen), a warm lamp on him; x, y = the desk's front-left corner */
export const drawAlyiAtWork = (b: Buf, x: number, y: number, f: number) => {
  const pen = Math.floor(f / 8) % 2;
  // the chair back and the seated body (a sweater), bowed forward toward the desk on the left
  fill(b, x + 70, y - 34, 4, 46, PAL.D2); fill(b, x + 60, y + 8, 18, 4, PAL.D2);
  for (let j = 0; j < 30; j++) for (let i = 0; i < 22; i++) { const lean = Math.round((30 - j) * 0.35); if (i + lean > 3 && i + lean < 24) b.set(x + 46 + i - lean, y - 28 + j, i < 6 ? PAL.X2 : i > 17 ? PAL.X0 : PAL.X1); }
  // the head bowed (the dome toward camera-left and down), the close-cropped back, the ear; lit from the lamp (left)
  for (let j = 0; j < 15; j++) for (let i = 0; i < 15; i++) { const d = Math.hypot((i - 7) / 7.4, (j - 7) / 7.6); if (d < 1) b.set(x + 33 + i, y - 44 + j, i < 4 ? PAL.S5 : i < 9 ? PAL.S4 : j > 7 && i > 10 ? PAL.B1 : PAL.S3); }
  b.set(x + 35, y - 40, PAL.S6); b.set(x + 36, y - 41, PAL.S6); b.set(x + 37, y - 41, PAL.S6);
  // close-cropped dark hair round the back and the side of the head, the ear, the brow and nose turned down to the page
  for (let j = 0; j < 7; j++) for (let i = 0; i < 6; i++) if (i + j > 3) b.set(x + 41 + i, y - 39 + j, i > 3 ? PAL.B0 : PAL.B1);
  fill(b, x + 42, y - 36, 3, 4, PAL.S3); b.set(x + 43, y - 35, PAL.S2);
  b.set(x + 33, y - 35, PAL.S2); b.set(x + 32, y - 33, PAL.S4); b.set(x + 32, y - 32, PAL.S3); b.set(x + 33, y - 31, PAL.S2);
  // the near arm along the desk to the pen, the far hand flat on the page
  capsule(b, x + 50, y - 22, x + 34, y - 6, 3, [PAL.X0, PAL.X1, PAL.X2, PAL.W5]);
  capsule(b, x + 34, y - 6, x + 22, y - 3, 3, [PAL.X0, PAL.X1, PAL.X2, PAL.W5]);
  fill(b, x + 16, y - 6, 6, 4, PAL.S4); fill(b, x + 16, y - 6, 6, 1, PAL.S5);
  line(x + 17, y - 6 - pen, x + 13, y - 11 - pen, b.ink(PAL.N0));
  // the desk top, the page, the lamp's pool
  fill(b, x - 10, y - 2, 84, 3, PAL.D4); fill(b, x - 10, y + 1, 84, 10, PAL.D2); fill(b, x - 8, y + 11, 3, 20, PAL.D1);
  fill(b, x + 2, y - 3, 22, 2, PAL.P2);
  for (let i = 0; i < 4; i++) fill(b, x + 4 + i * 4, y - 3, 2, 1, PAL.G5);
  fill(b, x - 6, y - 26, 2, 24, PAL.G3); fill(b, x - 9, y - 30, 10, 5, PAL.G4); fill(b, x - 8, y - 25, 8, 1, PAL.W8);
};

export const ART: ArtAsset[] = [{
  id: 'char-alyi-ep2', manifest: '§2.1 ALYI (Ep2 states)', kind: 'character', name: 'ALYI: the 2018 look back, the party, the 2023 screen, the offsite, at work in ISS',
  file: 'cast/alyi2.ts', exports: 'alyiWarm, drawAlyiRoom2, drawAlyiAtWork, drawTpoolCheckIn, ALYI_WARM_DEFAULT', scenes: '4 (F2.3), 15 (F2.2), 22',
  note: 'warm and human: laughing, the chant, his phone up, "Someone should." in screen light, calm with the flame; cropping is the sets\' job',
  stills: [{label: 'busts: the chant (laugh, hand up) · "You\'re not chanting." (smile, talk) · TPOOL check-in · 2023 "Someone should." · the flame; room: chant, torch; ISS at work', draw: (b) => {
    sheetPlate(b, [PAL.U0, PAL.U1, PAL.N2, PAL.N2]);
    sheetImg(b, alyiWarm({mood: 'laugh', mouth: 'rest', arm: 'raise', light: 'party'}), -10, 40, 'the chant');
    sheetImg(b, alyiWarm({mood: 'smile', mouth: 'E', arm: 'none', light: 'party'}), 70, 40, 'not chanting');
    sheetImg(b, alyiWarm({mood: 'smile', mouth: 'rest', arm: 'phone', light: 'party'}), 150, 40, 'check-in');
    sheetImg(b, alyiWarm({mood: 'focus', mouth: 'O', arm: 'none', light: 'screen'}), 230, 40, 'someone should');
    sheetImg(b, alyiWarm({mood: 'calm', mouth: 'rest', arm: 'torch', light: 'fire', f: 3}), 310, 40, 'the flame');
    sheetRoom(b, 410, 'chant', (x, y) => drawAlyiRoom2(b, x, y, {arm: 'raise', light: 'party', smile: true}));
    sheetRoom(b, 438, 'torch', (x, y) => drawAlyiRoom2(b, x, y, {arm: 'torch', light: 'fire', f: 2}));
    drawAlyiAtWork(b, 400, 60, 0); label(b, 'ISS: at work', 440, 92);
  }}],
}];
void rect; void bayer;
