// MR. MAS — kits: MAS's HANDS at insert scale ([ECU], Ep1 act 4). New file, owned by the act-4 insert + expression
// artist. The hands are the ECU kit's tells-and-rituals vocabulary (pov-and-framing §3.4, §4.1): they square, pocket,
// carve and tap; they NEVER tremble, clench or fidget (X3). Every drawing is authored at its shot's scale (never an
// enlargement), lit by the room it's in via ramp sets, and moved only in whole pixels.
//
// The drawings (pov-changes §5.1, "Mas [ECU] hands": 6 + the six-fingered variant + its five-finger copy):
//   1  CLICK        sc 25 THE BREAK: the right hand on the trackpad, index out; 'rest' / 'click' (1 px press)
//   2  NUDGE        sc 24 + sc 30 (one drawing whose last frame is the nudge): 'hold' (fingertips on the rim, the glass
//                   lifted 2 px) / 'set' / 'release' / 'touch' (two fingertips on its side) / 'nudge' (glass + hand 1 px)
//   3  STRIP TAP    sc 26: the thumb over the phone (the laptop's corner in frame): 'enter' / 'tap' / 'lift'
//   4  CARVE        sc 26A bar 1: the fist on the MACROSOFT pen, the clip in the wood; tracks the carve tip in quarters
//   5  BRUSH + REST sc 26A bar 2: one flat hand moved in whole pixels: the side sweeps the shavings, the thumb comes to
//                   rest on mark 3 ONLY (marks 1 and 2 are (REPORTED): his hand never touches them, any episode)
//   6  HEART TAP    sc 29: the thumb on the face-up phone lying on the desk: 'up' / 'tap' (8 taps, one per beat)
//   V  VERSION      sc 29 MAS'S VERSION: the same hand resting on the face-down phone, SIX fingers (the egg), plus the
//                   five-finger copy for the G2 A/B. Nothing depends on counting them.
//
// Construction: a hand is a figure (figure.ts): palm, thumb and four (or five) fingers as separate groups so the rig's
// outline separates the digits; each finger is three tapered segments with round joints; knuckle light, joint creases
// and nails are tone planes on top. Lights: 'dark' (the monitor's cyan from the top-left), 'suite' (the laptop's cyan
// + the window's pale back-rim), 'lobby' (tungsten from above + the lobby neon's cyan kiss on the rim).
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, renderFigure} from '../figure';
import {memo, seg} from '../cast/kit';

export type HandLight = 'dark' | 'suite' | 'lobby';

// ------------------------------------------------------------------ ramps (the portrait's skin logic, per room)
const RAMPS: Record<HandLight, LightRig['ramps']> = {
  // [outline, shadow, mid, light, bright, rim]
  dark: {
    skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    skinB: [PAL.S0, PAL.X1, PAL.X3, PAL.K1, PAL.K2, PAL.K3],
    nail: [PAL.S0, PAL.X1, PAL.X3, PAL.K3, PAL.K4, PAL.K5],
    cuff: [PAL.N0, PAL.G0, PAL.G1, PAL.C2, PAL.C3, PAL.C5],
  },
  suite: {
    skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    skinB: [PAL.S0, PAL.X1, PAL.X3, PAL.K1, PAL.K2, PAL.K3],
    nail: [PAL.S0, PAL.X1, PAL.X3, PAL.K3, PAL.K4, PAL.K5],
    cuff: [PAL.N0, PAL.G0, PAL.G1, PAL.G3, PAL.C3, PAL.C5],
  },
  lobby: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinB: [PAL.S0, PAL.S2, PAL.S3, PAL.S3, PAL.S4, PAL.S5],
    nail: [PAL.S0, PAL.S2, PAL.S4, PAL.S5, PAL.S6, PAL.W9],
    cuff: [PAL.N0, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
  },
};
const RIGS: Record<HandLight, (key: [number, number]) => LightRig> = {
  dark: (key) => ({key, keyBand: 2, shadowBand: 2, rim: true, outline: true, ramps: RAMPS.dark, back: null}),
  suite: (key) => ({key, keyBand: 2, shadowBand: 2, rim: true, outline: true, ramps: RAMPS.suite, back: [0.9, -0.4], backBand: 1, backRamp: {skin: PAL.X3, skinB: PAL.X3, cuff: PAL.G4}}),
  lobby: (key) => ({key, keyBand: 2, shadowBand: 2, rim: true, outline: true, ramps: RAMPS.lobby, back: [-0.9, 0.2], backBand: 1, backRamp: {skin: PAL.K2, skinB: PAL.K1, cuff: PAL.C2}}),
};

// ------------------------------------------------------------------ the finger / thumb builder
export interface Digit {
  /** the knuckle (MCP) position, local px */
  at: [number, number];
  /** direction of the proximal segment, degrees (0 = right, -90 = up/away) */
  dir: number;
  /** segment lengths px (proximal, middle, distal) */
  len: [number, number, number];
  /** widths at the knuckle, the two joints and the tip */
  w: [number, number, number, number];
  /** bend at the two joints (deg, + = curls clockwise on screen) */
  bend?: [number, number];
  /** draw the nail (seen from the back of the hand) */
  nail?: boolean;
  /** only draw the first n segments (a finger curled out of sight) */
  segs?: 1 | 2 | 3;
}
export interface DigitGeo { joints: Array<[number, number]>; tip: [number, number]; dirs: number[]; }
const rad = (d: number) => (d * Math.PI) / 180;
export const digitGeo = (d: Digit): DigitGeo => {
  const joints: Array<[number, number]> = [d.at];
  const dirs: number[] = [];
  let a = d.dir;
  let [x, y] = d.at;
  const bends = [0, ...(d.bend ?? [0, 0])];
  for (let k = 0; k < 3; k++) {
    a += bends[k];
    dirs.push(a);
    x += Math.cos(rad(a)) * d.len[k];
    y += Math.sin(rad(a)) * d.len[k];
    joints.push([x, y]);
  }
  return {joints, tip: joints[3], dirs};
};
/** The prims of one digit: three tapered segments, round joints, a round tip. */
const digitPrims = (d: Digit): Prim[] => {
  const g = digitGeo(d);
  const n = d.segs ?? 3;
  const out: Prim[] = [];
  for (let k = 0; k < n; k++) {
    const [x0, y0] = g.joints[k], [x1, y1] = g.joints[k + 1];
    out.push(seg(x0, y0, d.w[k], x1, y1, d.w[k + 1]));
    out.push(P.ell(x0, y0, d.w[k] / 2, d.w[k] / 2));
  }
  const [tx, ty] = g.joints[n];
  out.push(P.ell(tx, ty, d.w[n] / 2, d.w[n] / 2));
  return out;
};
/** Point at fraction t along segment k of a digit, offset `side` px across it (+ = to the digit's right). */
const along = (g: DigitGeo, k: number, t: number, side = 0): [number, number] => {
  const [x0, y0] = g.joints[k], [x1, y1] = g.joints[k + 1];
  const a = rad(g.dirs[k]);
  return [x0 + (x1 - x0) * t - Math.sin(a) * side, y0 + (y1 - y0) * t + Math.cos(a) * side];
};
/** The details of a digit seen from the back: a crease line across each joint, knuckle light, the nail. */
const digitDetail = (d: Digit, lit: -1 | 1): Adjust[] => {
  const g = digitGeo(d);
  const n = d.segs ?? 3;
  const adj: Adjust[] = [];
  const cross = (k: number, t: number, w: number, tone: number) => {
    const [ax, ay] = along(g, k, t, -w / 2 + 1), [bx, by] = along(g, k, t, w / 2 - 1);
    adj.push({prims: [P.line(Math.round(ax), Math.round(ay), Math.round(bx), Math.round(by))], tone, onlyMat: 'skin'});
  };
  // joint creases (the middle joint shows 2 short lines, the top joint one), a darker tone
  if (n >= 2) { cross(1, 0.06, d.w[1] * 0.7, 2); cross(0, 0.9, d.w[1] * 0.55, 2); }
  if (n >= 3) cross(2, 0.05, d.w[2] * 0.6, 2);
  // knuckle light: a short highlight on the key side of the proximal segment's start
  const [kx, ky] = along(g, 0, 0.12, lit * d.w[0] * 0.18);
  adj.push({prims: [P.ell(kx, ky, Math.max(1, d.w[0] * 0.2), Math.max(1, d.w[0] * 0.16))], tone: 4, onlyMat: 'skin'});
  // the nail on the distal segment (from the back): a rounded plate, its cuticle one rung darker
  if (d.nail && n === 3) {
    const nw = d.w[2] * 0.62;
    const [c0x, c0y] = along(g, 2, 0.38, 0), [c1x, c1y] = along(g, 2, 1.0, 0);
    adj.push({prims: [seg(c0x, c0y, nw, c1x, c1y, nw * 0.86), P.ell(c1x, c1y, nw * 0.43, nw * 0.43)], tone: 3, onlyMat: 'skin', mat: 'nail'});
    const [ex, ey] = along(g, 2, 0.34, -nw / 2), [fx, fy] = along(g, 2, 0.34, nw / 2);
    adj.push({prims: [P.line(Math.round(ex), Math.round(ey), Math.round(fx), Math.round(fy))], tone: 1, onlyMat: 'nail'});
    const [hx, hy] = along(g, 2, 0.6, lit * nw * 0.22);
    adj.push({prims: [P.ell(hx, hy, Math.max(0.6, nw * 0.12), Math.max(1, nw * 0.2))], tone: 5, onlyMat: 'nail'});
  }
  return adj;
};

// ------------------------------------------------------------------ a hand = palm + digits + cuff
export interface HandDef {
  w: number; h: number;
  /** palm polygon (back of the hand) */
  palm: number[];
  /** the sleeve's rib cuff polygon (drawn last, over the wrist) */
  cuff?: number[];
  /** digits, drawn in order (back to front). The thumb is just a digit with 2 segments + its mound */
  digits: Array<Digit & {name: string; front?: boolean}>;
  /** extra planes (tendons, the thumb's mound light, contact shadows) */
  adjust?: Adjust[];
  /** key light direction (toward the light) */
  key: [number, number];
  /** the desk's foreshortening: y is squashed toward `squashY` (1 = none) — a hand lying on a desk seen obliquely */
  squash?: number;
  squashY?: number;
}
const squashPrim = (p: Prim, k: number, y0: number): Prim => {
  const f = (y: number) => y0 - (y0 - y) * k;
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => (i % 2 ? f(v) : v))};
    case 'ell': return {...p, cy: f(p.cy), ry: p.ry * k};
    case 'line': return {...p, y0: f(p.y0), y1: f(p.y1)};
    case 'rect': return {...p, y: f(p.y), h: p.h * k};
    default: return p;
  }
};
export const renderHand = (def: HandDef, light: HandLight): Img => {
  const lit: -1 | 1 = def.key[0] < 0 ? -1 : 1;
  const parts: Part[] = [];
  const behind = def.digits.filter((d) => !d.front), front = def.digits.filter((d) => d.front);
  for (const d of behind) parts.push({group: d.name, mat: 'skin', tone: 3, prims: digitPrims(d)});
  parts.push({group: 'palm', mat: 'skin', tone: 3, prims: [P.poly(...def.palm)]});
  for (const d of front) parts.push({group: d.name, mat: 'skin', tone: 3, prims: digitPrims(d)});
  if (def.cuff) parts.push({group: 'cuff', mat: 'cuff', tone: 2, prims: [P.poly(...def.cuff)]});
  const adjust: Adjust[] = [];
  for (const d of def.digits) adjust.push(...digitDetail(d, lit));
  adjust.push(...(def.adjust ?? []));
  const k = def.squash ?? 1, y0 = def.squashY ?? def.h - 1;
  const sq = (ps: Prim[]) => (k === 1 ? ps : ps.map((p) => squashPrim(p, k, y0)));
  const fig: FigureDef = {w: def.w, h: def.h, parts: parts.map((pt) => ({...pt, prims: sq(pt.prims)})), adjust: adjust.map((a) => ({...a, prims: sq(a.prims)}))};
  return renderFigure(fig, RIGS[light](def.key));
};
export {RAMPS as HAND_RAMPS};

// ------------------------------------------------------------------ pose builders
/**
 * A relaxed right hand, palm down, seen from above (from his side of the desk): the wrist at the bottom, the fingers
 * pointing away (up the frame), the thumb out to the left. s = px per cm at the shot's scale.
 * Returns the HandDef and anchors (the thumb pad, the fingertips, the pinky edge) in local px.
 */
export interface FlatOpts {
  s: number;
  /** extra finger (the six-fingered VERSION egg): a fifth finger between ring and pinky */
  six?: boolean;
  /** fingers' spread in degrees (0 = together) */
  spread?: number;
  /** thumb angle (deg, -90 = straight up) */
  thumb?: number;
  /** how much the fingers curl (0 flat .. 1 curled: foreshortens them) */
  curl?: number;
  key?: [number, number];
  /** the desk's foreshortening (see HandDef.squash) */
  squash?: number;
}
export const flatHand = (o: FlatOpts) => {
  const s = o.s;
  const W = Math.ceil(12.5 * s), H = Math.ceil(21 * s);
  const cx = W * 0.58, bot = H - 1, top = bot - 9.6 * s;
  const sp = o.spread ?? 4, cu = o.curl ?? 0.15;
  const fs = 1 - cu * 0.45; // foreshortening of curled fingers seen from above
  const L = (cm: number): [number, number, number] => [cm * 0.46 * s * fs, cm * 0.3 * s * fs, cm * 0.24 * s * fs];
  const Wd = (cm: number): [number, number, number, number] => [cm * s, cm * 0.92 * s, cm * 0.84 * s, cm * 0.78 * s];
  const digits: HandDef['digits'] = [];
  const fingers: Array<{name: string; at: [number, number]; dir: number; cm: number; w: number}> = o.six
    ? [
      {name: 'index', at: [cx - 3.3 * s, top + 0.35 * s], dir: -90 - sp * 1.3, cm: 7.8, w: 1.72},
      {name: 'middle', at: [cx - 1.6 * s, top - 0.1 * s], dir: -90 - sp * 0.5, cm: 8.5, w: 1.74},
      {name: 'ring', at: [cx + 0.1 * s, top + 0.05 * s], dir: -90 + sp * 0.2, cm: 8.2, w: 1.68},
      {name: 'ring2', at: [cx + 1.75 * s, top + 0.5 * s], dir: -90 + sp * 0.9, cm: 7.5, w: 1.62},
      {name: 'pinky', at: [cx + 3.3 * s, top + 1.4 * s], dir: -90 + sp * 1.6, cm: 6.2, w: 1.46},
    ]
    : [
      {name: 'index', at: [cx - 3.05 * s, top + 0.35 * s], dir: -90 - sp * 1.2, cm: 7.9, w: 2.02},
      {name: 'middle', at: [cx - 0.98 * s, top - 0.1 * s], dir: -90 - sp * 0.3, cm: 8.7, w: 2.06},
      {name: 'ring', at: [cx + 1.05 * s, top + 0.3 * s], dir: -90 + sp * 0.6, cm: 8.2, w: 1.92},
      {name: 'pinky', at: [cx + 2.95 * s, top + 1.35 * s], dir: -90 + sp * 1.5, cm: 6.4, w: 1.66},
    ];
  for (const f of fingers) digits.push({name: f.name, at: f.at, dir: f.dir, len: L(f.cm), w: Wd(f.w), bend: [cu * 6, cu * 8], nail: true});
  // the thumb: out of the palm's side (its MCP knuckle), two visible segments, seen a little from its side
  const ta = o.thumb ?? -122;
  const thumbAt: [number, number] = [cx - 4.1 * s, bot - 5.2 * s];
  const thumb: Digit & {name: string; front?: boolean} = {name: 'thumb', at: thumbAt, dir: ta, len: [3.3 * s, 2.9 * s, 0.01], w: [2.45 * s, 2.15 * s, 1.95 * s, 1.95 * s], bend: [10, 0], nail: false, segs: 2, front: true};
  digits.push(thumb);
  // the back of the hand: the index side runs down into the thumb's web, the pinky side is gently convex
  const palm = [
    cx - 2.9 * s, bot + 2, cx - 3.5 * s, bot - 2.2 * s, cx - 4.3 * s, bot - 4.6 * s, cx - 4.35 * s, top + 1.9 * s, cx - 4.0 * s, top + 0.1 * s,
    cx - 2.6 * s, top - 0.6 * s, cx - 0.98 * s, top - 1.0 * s, cx + 1.1 * s, top - 0.7 * s, cx + 3.0 * s, top + 0.35 * s, cx + 3.95 * s, top + 1.5 * s,
    cx + 4.2 * s, top + 3.6 * s, cx + 4.0 * s, bot - 3.0 * s, cx + 3.3 * s, bot - 0.6 * s, cx + 3.0 * s, bot + 2,
  ];
  const cuff = [cx - 3.4 * s, bot - 0.8 * s, cx - 1 * s, bot - 1.1 * s, cx + 2 * s, bot - 1.0 * s, cx + 3.5 * s, bot - 0.6 * s, cx + 3.9 * s, bot + 4, cx - 3.8 * s, bot + 4];
  // the back of the hand: the KNUCKLE ROW is the read (a lit head per finger, a dark valley between heads), the back
  // of the hand turning away toward the wrist (one rung), the thumb's mound a soft light. No lines on the dorsum: at
  // this size they read as palm creases.
  const adj: Adjust[] = [];
  fingers.forEach((f, i) => {
    adj.push({prims: [P.ell(f.at[0] - 0.1 * s, f.at[1] + 0.25 * s, f.w * 0.36 * s, f.w * 0.26 * s)], tone: 4, onlyMat: 'skin'});
    const nx = fingers[i + 1];
    if (nx && i < 3) adj.push({prims: [P.line(Math.round((f.at[0] + nx.at[0]) / 2 + 0.2 * s), Math.round((f.at[1] + nx.at[1]) / 2 + 0.2 * s), Math.round((f.at[0] + nx.at[0]) / 2 + 0.3 * s), Math.round((f.at[1] + nx.at[1]) / 2 + 1.3 * s))], tone: 2, onlyMat: 'skin', mat: 'skinB'});
  });
  adj.push({prims: [P.poly(cx - 3.6 * s, bot - 2.2 * s, cx + 4.0 * s, bot - 3.4 * s, cx + 3.3 * s, bot - 0.6 * s, cx + 3.0 * s, bot + 2, cx - 2.9 * s, bot + 2)], tone: 2, onlyMat: 'skin', mat: 'skinB'});
  adj.push({prims: [P.ell(cx - 3.3 * s, bot - 4.0 * s, 0.7 * s, 1.1 * s)], tone: 4, onlyMat: 'skin'});
  const k = o.squash ?? 1;
  const def: HandDef = {w: W, h: H, palm, cuff, digits, adjust: adj, key: o.key ?? [-0.8, -0.6], squash: k, squashY: bot};
  const tg = digitGeo(thumb);
  const Q = (p: [number, number]): [number, number] => [p[0], bot - (bot - p[1]) * k];
  return {def, anchors: {thumbPad: Q(tg.joints[2]), tips: fingers.map((f) => Q(digitGeo({at: f.at, dir: f.dir, len: L(f.cm), w: Wd(f.w), bend: [cu * 6, cu * 8]}).tip)), wrist: [cx, bot] as [number, number], pinkyEdge: Q([cx + 4.2 * s, top + 4 * s])}};
};

/**
 * The carving fist (sc 26A bar 1): the right hand overhand on the MACROSOFT pen (kits/props.ts `pen`, clip down in the
 * wood). Authored in the pen's own frame (a = along the barrel toward its back end, b = across it toward him), at the
 * 26A desk scale (~4.4 px/cm): four curled finger ridges on the far side (lit: the monitor is beyond the far edge),
 * the knuckle row, the back of the hand turning away toward the wrist, the thumb short along the barrel's near side,
 * the cuff. The clip's tip and the first ~14 px of the barrel stay clear so the carve reads.
 * Local origin = the grip centre on the barrel; place it at penGrip(tipX, tipY).
 */
export const PEN_AXIS: [number, number] = [0.857, -0.515];
/** where the fist's local origin goes for a pen drawn with its clip tip at (tx, ty) (kits `pen(b, tx, ty)`) */
export const penGrip = (tx: number, ty: number): [number, number] => [tx + 35, ty - 25];
export const carveFist = (_s = 4.4) => {
  const [ux, uy] = PEN_AXIS, nx = -uy, ny = ux; // n: across the barrel, toward him (down-right)
  const W = 72, H = 72;
  const ox = 34, oy = 28; // the grip centre in the image
  const pt = (a: number, b: number): [number, number] => [ox + ux * a + nx * b, oy + uy * a + ny * b];
  const poly = (...ab: number[]) => { const out: number[] = []; for (let i = 0; i < ab.length; i += 2) out.push(...pt(ab[i], ab[i + 1])); return P.poly(...out); };
  const ell = (a: number, b: number, r: number) => P.ell(...pt(a, b), r, r);
  const parts: Part[] = [];
  // the curled fingers' first joints on the far side: four rounded stubs (index nearest the tip), wrapping under
  const stubs: Array<[number, number]> = [[-9.6, 2.35], [-3.6, 2.45], [2.2, 2.3], [7.6, 2.0]];
  stubs.forEach(([m, r], i) => { const e = -7.6 + (i === 3 ? 0.8 : 0); parts.push({group: 'f' + i, mat: 'skin', tone: 3, prims: [poly(m - r, -4, m - r, e, m - r * 0.6, e - 1.2, m + r * 0.6, e - 1.2, m + r, e, m + r, -4)]}); });
  // the back of the hand: its far edge is the knuckle row; it narrows toward the wrist
  parts.push({group: 'palm', mat: 'skin', tone: 3, prims: [poly(-12.6, -4.4, -9.6, -6.6, -3.6, -7.0, 2.2, -6.8, 7.6, -6.0, 10.8, -4.0, 12.2, 0.5, 10.4, 6.5, 6.2, 11.5, -1.2, 12.6, -7.5, 10.4, -11.4, 5.4, -13.0, 0.4)]});
  parts.push({group: 'wrist', mat: 'skin', tone: 3, prims: [poly(-5.2, 10, 7.0, 9.6, 6.6, 15, -4.6, 15)]});
  // the thumb lies along the TOP of the barrel toward the tip (like a thumb on a knife's spine): drawn over it
  parts.push({group: 'thumb', mat: 'skin', tone: 3, prims: [poly(-9.5, -2.2, -17.6, -1.9, -19.6, -0.6, -19.6, 1.6, -17.6, 2.8, -9.5, 3.6, -6.5, 2.0, -6.5, -1.2), ell(-18.4, 0.4, 2.3)]});
  const adjust: Adjust[] = [
    // the knuckle row catches the key: a lit bump per finger; the dips between the heads one rung down
    ...stubs.map(([m]) => ({prims: [ell(m, -5.4, 1.9)], tone: 4, onlyMat: 'skin'} as Adjust)),
    ...stubs.slice(0, 3).map(([m, r]) => ({prims: [P.line(...pt(m + r + 0.5, -4.2).map(Math.round) as [number, number], ...pt(m + r + 0.5, -6.4).map(Math.round) as [number, number])], tone: 2, onlyMat: 'skin'} as Adjust)),
    // each stub's joint crease
    ...stubs.map(([m, r]) => ({prims: [P.line(...pt(m - r + 0.8, -7.0).map(Math.round) as [number, number], ...pt(m + r - 0.8, -7.0).map(Math.round) as [number, number])], tone: 2, onlyMat: 'skin'} as Adjust)),
    // the stubs' far faces (toward the key) one rung up
    ...stubs.map(([m, r]) => ({prims: [poly(m - r + 0.6, -7.9, m + r - 0.6, -7.9, m + r - 0.6, -8.8, m - r + 0.6, -8.8)], tone: 4, onlyMat: 'skin'} as Adjust)),
    // the back of the hand turns away toward the wrist: X3 bridge, then X2 on its near third, the wrist in shadow
    {prims: [poly(-12.4, 3.6, 12.0, 1.8, 10.4, 6.5, 6.2, 11.5, -1.2, 12.6, -7.5, 10.4, -11.4, 5.4)], tone: 2, onlyMat: 'skin', mat: 'skinB'},
    {prims: [poly(-10.4, 7.6, 11.0, 5.4, 6.2, 11.5, -1.2, 12.6, -7.5, 10.4)], tone: 2, onlyMat: 'skin'},
    {prims: [poly(-5.2, 11, 7.0, 10.6, 6.6, 19, -4.6, 19)], tone: 1, onlyMat: 'skin'},
    // the thumb: its top toward the key lit, its underside on the barrel dark, the nail at its tip
    {prims: [poly(-9.5, -1.6, -17.6, -1.3, -19.2, -0.4, -9.5, -0.2)], tone: 4, onlyMat: 'skin'},
    {prims: [poly(-9.5, 2.4, -17.6, 1.9, -17.6, 2.8, -9.5, 3.6)], tone: 2, onlyMat: 'skin'},
    {prims: [poly(-17.6, -1.0, -20.2, -0.2, -20.2, 1.2, -17.6, 1.2)], tone: 3, onlyMat: 'skin', mat: 'nail'},
  ];
  const fig: FigureDef = {w: W, h: H, parts, adjust};
  const img = renderFigure(fig, {...RIGS.dark([-0.75, -0.66]), rim: false, keyBand: 1});
  return {img, origin: [ox, oy] as [number, number], wrist: pt(1, 14)};
};

// ------------------------------------------------------------------ authored drawings (explicit pixel planes)
/** Build polygon prims from a flat list scaled by k around (0, 0) and offset. */
const PK = (k: number, dx = 0, dy = 0) => (...pts: number[]): Prim => P.poly(...pts.map((v, i) => (i % 2 ? v * k + dy : v * k + dx)));
const EK = (k: number, dx = 0, dy = 0) => (cx: number, cy: number, rx: number, ry: number): Prim => P.ell(cx * k + dx, cy * k + dy, rx * k, ry * k);
const LK = (k: number, dx = 0, dy = 0) => (x0: number, y0: number, x1: number, y1: number): Prim => P.line(Math.round(x0 * k + dx), Math.round(y0 * k + dy), Math.round(x1 * k + dx), Math.round(y1 * k + dy));

/**
 * THE RESTING HAND (26A: the brush, then the thumb at rest on mark 3; also the base of the flat poses). The right
 * hand lying on the desk, seen from his side of it (the desk foreshortened): the back of the hand up, fingers together
 * and a little curled, the knuckle row catching the monitor's key from beyond the far edge (top-left), nails at the
 * tips, the thumb lying on its side out to the left, its pad the anchor. Authored in pixel space at unit scale k
 * (k = 1.2 is the 26A desk scale). six = the VERSION egg (five fingers + the thumb).
 */
export const restHand = (k = 1.2, light: HandLight = 'dark', six = false) => {
  const Pp = PK(k), Ee = EK(k), Ll = LK(k);
  const W = Math.ceil(46 * k), H = Math.ceil(42 * k);
  const Pp0 = Pp; void Pp0;
  const parts: Part[] = [];
  const fingers: Array<{name: string; poly: number[]; knuckle: [number, number]; nail: number[]; crease: number}> = six
    ? [
      {name: 'index', poly: [12, 20, 12, 6, 13, 4, 15, 3, 17, 4, 18, 6, 18, 20], knuckle: [15, 17], nail: [14, 4.5, 16.5, 4.5, 16.5, 7, 14, 7], crease: 10.5},
      {name: 'middle', poly: [18, 19, 18, 4, 19, 2, 21, 1.5, 23, 2, 24, 4, 24, 19], knuckle: [21, 16], nail: [20, 3, 22.5, 3, 22.5, 5.5, 20, 5.5], crease: 9.5},
      {name: 'ring', poly: [24, 19, 24, 4, 25, 2.5, 27, 2, 29, 3, 30, 5, 30, 19], knuckle: [27, 16], nail: [26, 3.5, 28.5, 3.5, 28.5, 6, 26, 6], crease: 10},
      {name: 'ring2', poly: [30, 20, 30, 6, 31, 4.5, 33, 4, 35, 5, 36, 7, 36, 20], knuckle: [33, 17.5], nail: [32, 5.5, 34.5, 5.5, 34.5, 8, 32, 8], crease: 11.5},
      {name: 'pinky', poly: [36, 22, 36, 11, 37, 9, 39, 8.5, 40.5, 9.5, 41, 11, 41, 23], knuckle: [38.5, 20], nail: [37.5, 9.5, 39.5, 9.5, 39.5, 11.5, 37.5, 11.5], crease: 14.5},
    ]
    : [
      {name: 'index', poly: [12, 20, 12, 6, 13, 4, 15, 3, 17, 3, 19, 5, 19, 20], knuckle: [15.5, 17], nail: [14, 4.5, 17, 4.5, 17, 7.5, 14, 7.5], crease: 10.5},
      {name: 'middle', poly: [19, 19, 19, 4, 20, 2, 22.5, 1, 25, 1.5, 27, 3.5, 27, 19], knuckle: [23, 16], nail: [21, 2.5, 25, 2.5, 25, 6, 21, 6], crease: 9.5},
      {name: 'ring', poly: [27, 19, 27, 5.5, 28, 3.5, 30.5, 3, 33, 4, 34, 6, 34, 20], knuckle: [30.5, 16.5], nail: [29, 4.5, 32.5, 4.5, 32.5, 7.5, 29, 7.5], crease: 11},
      {name: 'pinky', poly: [34, 21, 34, 11, 35, 9, 37.5, 8, 40, 9.5, 41, 11.5, 41, 23], knuckle: [37.5, 19.5], nail: [36, 9.5, 39, 9.5, 39, 12, 36, 12], crease: 14.5},
    ];
  for (const f of fingers) parts.push({group: f.name, mat: 'skin', tone: 3, prims: [Pp(...f.poly)]});
  // the back of the hand: wider at the knuckle row, narrowing to the wrist (near), the pinky side a gentle curve
  parts.push({group: 'palm', mat: 'skin', tone: 3, prims: [Pp(11, 18, 15, 15.5, 23, 14, 31, 14.5, 38, 17, 42, 20.5, 42.5, 26, 40, 32, 38, 40, 16, 40, 13.5, 33, 10.5, 26)]});
  // the thumb, lying on its side out to the left, its base in the palm's side
  parts.push({group: 'thumb', mat: 'skin', tone: 3, prims: [Pp(14.5, 33, 10, 30, 5.5, 26.5, 1.5, 23, -0.5, 19.5, 0, 16.5, 2.5, 15, 6, 16, 10, 19.5, 13.5, 23.5, 14.5, 27), Ee(2, 19.5, 2.6, 2.9)]});
  const adjust: Adjust[] = [];
  for (const f of fingers) {
    // the knuckle head: lit on top; the finger's middle joint crease; the nail (a plate, a cuticle line, a glint)
    adjust.push({prims: [Ee(f.knuckle[0], f.knuckle[1], 2.2, 1.4)], tone: 4, onlyMat: 'skin'});
    const xs = f.poly.filter((_, i) => i % 2 === 0), x0 = Math.min(...xs), x1 = Math.max(...xs);
    adjust.push({prims: [Ll(x0 + 1.5, f.crease, x1 - 1.5, f.crease)], tone: 2, onlyMat: 'skin', mat: 'skinB'});
    adjust.push({prims: [Pp(...f.nail)], tone: 3, onlyMat: 'skin', mat: 'nail'});
    adjust.push({prims: [Ll(f.nail[0], f.nail[5], f.nail[2], f.nail[5])], tone: 1, onlyMat: 'nail'});
    adjust.push({prims: [Ee(f.nail[0] + 0.9, f.nail[1] + 1, 0.5, 0.7)], tone: 5, onlyMat: 'nail'});
  }
  adjust.push(
    // the dips between the knuckle heads
    ...fingers.slice(0, -1).map((f, i) => ({prims: [Ll((f.knuckle[0] + fingers[i + 1].knuckle[0]) / 2 + 0.4, (f.knuckle[1] + fingers[i + 1].knuckle[1]) / 2 - 0.5, (f.knuckle[0] + fingers[i + 1].knuckle[0]) / 2 + 0.6, (f.knuckle[1] + fingers[i + 1].knuckle[1]) / 2 + 1.5)], tone: 2, onlyMat: 'skin', mat: 'skinB'} as Adjust)),
    // the back of the hand turns away toward the wrist and the pinky side: X3, then X2 at the far corner
    {prims: [Pp(42, 21, 42.5, 26, 40, 32, 38, 40, 27, 40, 34, 31, 39, 24)], tone: 2, onlyMat: 'skin', mat: 'skinB'},
    {prims: [Pp(40.5, 23, 42.5, 26, 40, 32, 38.5, 37, 37, 32)], tone: 2, onlyMat: 'skin'},
    // the thumb: its top toward the key lit, the nail near its tip, its underside dark along the lower edge
    {prims: [Pp(2.5, 15.6, 6, 16.6, 10, 20, 13.5, 24, 12.5, 24.5, 9, 21, 5.5, 18, 2.5, 17)], tone: 4, onlyMat: 'skin'},
    {prims: [Pp(0.4, 17, 2.6, 15.8, 4.6, 16.8, 4, 19.4, 1.4, 19.8)], tone: 3, onlyMat: 'skin', mat: 'nail'},
    {prims: [Ll(2, 24, 12.5, 32)], tone: 2, onlyMat: 'skin', mat: 'skinB'},
  );
  const fig: FigureDef = {w: W, h: H, parts, adjust};
  const img = renderFigure(fig, {...RIGS[light]([-0.75, -0.66]), keyBand: 1, shadowBand: 1});
  return {img, anchors: {thumbPad: [2.5 * k, 20.5 * k] as [number, number], wrist: [27 * k, 40 * k] as [number, number], w: W, h: H}};
};

/**
 * THE TAP HAND (sc 26 the strip tap; sc 29 the hearts; sc 29 MAS'S VERSION). The right hand resting beside a phone
 * that lies on the desk, knuckles up, fingers curled on the desk, the THUMB out over the phone. Authored at ~14 px/cm
 * (the phone inserts' scale). thumb: 'up' (lifted: its shadow falls clear on the screen) | 'tap' (the pad down) |
 * 'rest' (lying on the face-down phone, VERSION). six = five fingers + the thumb (the VERSION egg); five = the G2 copy.
 * The drawing is IDENTICAL between the VERSION and the true shot except the finger count and the thumb state.
 * Anchors: `thumbTip` = the pad's centre (put it on the button), `wrist` = where the sleeve starts.
 */
export type TapThumb = 'up' | 'tap' | 'rest';
export const TAP_W = 206, TAP_H = 168;
export const tapHand = (light: HandLight = 'dark', thumb: TapThumb = 'tap', six = false) => {
  const Pp = PK(1), Ee = EK(1), Ll = LK(1);
  const parts: Part[] = [];
  const adjust: Adjust[] = [];
  // the curled fingers: each shows its proximal segment rising from the knuckle, the lit middle knuckle (the top of
  // the curl), the middle segment sloping down to the desk, the nail's edge at the far end
  const span0 = 76, span1 = 186; // the knuckle row, index side -> pinky side
  const n = six ? 5 : 4;
  const fw = (span1 - span0) / n;
  const tops = six ? [30, 22, 21, 26, 36] : [30, 20, 24, 38];
  for (let i = 0; i < n; i++) {
    const x0 = span0 + i * fw + 1, x1 = span0 + (i + 1) * fw - 1, m = (x0 + x1) / 2, t = tops[i];
    const base = 62 + (i === 0 ? 0 : i === n - 1 ? 8 : 0) - (six ? 0 : 0);
    const r = (x1 - x0) / 2;
    parts.push({group: 'f' + i, mat: 'skin', tone: 3, prims: [Pp(x0, base, x0, t + r * 0.9, m - r * 0.55, t + 1, m + r * 0.55, t + 1, x1, t + r * 0.9, x1, base + 4), Ee(m, t + r * 0.75, r, r * 0.8)]});
    // the middle knuckle (the curl's top) lit; the proximal segment below it one rung under; the middle segment beyond
    // it (toward the far end) turning down into shadow; the nail's edge peeking at the end
    adjust.push({prims: [Ee(m - r * 0.1, t + r * 1.45, r * 0.72, r * 0.42)], tone: 4, onlyMat: 'skin'});
    adjust.push({prims: [Pp(x0 + 1, t + r * 0.55, x1 - 1, t + r * 0.55, x1 - 2, t + 3, x0 + 2, t + 3)], tone: 2, onlyMat: 'skin', mat: 'skinB'});
    adjust.push({prims: [Ll(x0 + r * 0.45, t + r * 1.95, x1 - r * 0.45, t + r * 1.95)], tone: 2, onlyMat: 'skin', mat: 'skinB'});
    adjust.push({prims: [Pp(m - r * 0.5, t + 1.5, m + r * 0.5, t + 1.5, m + r * 0.4, t + 4, m - r * 0.4, t + 4)], tone: 3, onlyMat: 'skin', mat: 'nail'});
    // the valley to the next finger
    if (i < n - 1) adjust.push({prims: [Ll(x1 + 0.5, t + r * 2.4, x1 + 0.5, base - 2)], tone: 1, onlyMat: 'skin', mat: 'skinB'});
  }
  // the back of the hand, the knuckle row as its far edge
  parts.push({group: 'palm', mat: 'skin', tone: 3, prims: [Pp(66, 76, 80, 62, 106, 56, 134, 55, 160, 58, 182, 66, 194, 80, 198, 104, 192, 132, 182, 168, 104, 168, 90, 142, 72, 112)]});
  // the knuckle heads
  for (let i = 0; i < n; i++) {
    const m = span0 + (i + 0.5) * fw;
    adjust.push({prims: [Ee(m, 66 + (i === n - 1 ? 7 : i === 0 ? 3 : 0), fw * 0.36, 6)], tone: 4, onlyMat: 'skin'});
    adjust.push({prims: [Ee(m - fw * 0.1, 64 + (i === n - 1 ? 7 : i === 0 ? 3 : 0), fw * 0.16, 2.4)], tone: 5, onlyMat: 'skin'});
  }
  // the back of the hand turns away toward the wrist and the pinky side
  adjust.push({prims: [Pp(92, 120, 150, 100, 196, 96, 198, 104, 192, 132, 182, 168, 104, 168)], tone: 2, onlyMat: 'skin', mat: 'skinB'});
  adjust.push({prims: [Pp(160, 118, 197, 102, 192, 132, 182, 168, 150, 168)], tone: 2, onlyMat: 'skin'});
  // two faint tendons toward the index and middle knuckles (bridge tone, only at this scale)
  adjust.push({prims: [Ll(118, 150, 92, 78), Ll(128, 150, 118, 72)], tone: 2, onlyMat: 'skin', mat: 'skinB'});
  // THE THUMB: out of the palm's index side, over the phone, pointing up-left; its IP joint crease; the nail on top
  const lift = thumb === 'up' ? 2 : 0;
  parts.push({group: 'thumb', mat: 'skin', tone: 3, prims: [Pp(92, 132, 70, 118, 50, 98, 32, 76, 20, 58 - lift, 16, 45 - lift, 20, 36 - lift, 30, 31 - lift, 42, 36 - lift, 56, 52, 74, 70, 90, 84, 98, 100), Ee(24, 44 - lift, 11, 11)]});
  adjust.push(
    // its top toward the key: lit; its underside (toward him, the lower-right edge) one plane down
    {prims: [Pp(22, 36 - lift, 30, 33 - lift, 40, 37 - lift, 54, 53, 72, 71, 88, 86, 84, 88, 68, 74, 50, 56, 36, 42 - lift, 24, 40 - lift)], tone: 4, onlyMat: 'skin'},
    {prims: [Pp(20, 56 - lift, 34, 72, 52, 92, 72, 112, 92, 130, 96, 118, 78, 100, 58, 82, 40, 66, 26, 54 - lift)], tone: 2, onlyMat: 'skin', mat: 'skinB'},
    // the IP joint crease, the nail plate with its cuticle and glint
    {prims: [Ll(33, 60 - lift, 45, 50 - lift), Ll(35, 62 - lift, 46, 53 - lift)], tone: 2, onlyMat: 'skin'},
    {prims: [Pp(18, 40 - lift, 24, 34 - lift, 31, 35 - lift, 32, 42 - lift, 26, 48 - lift, 19, 48 - lift)], tone: 3, onlyMat: 'skin', mat: 'nail'},
    {prims: [Ll(26, 48 - lift, 33, 42 - lift)], tone: 1, onlyMat: 'nail'},
    {prims: [Ee(24, 38 - lift, 1.5, 1.2)], tone: 5, onlyMat: 'nail'},
  );
  const fig: FigureDef = {w: TAP_W, h: TAP_H, parts, adjust};
  const img = renderFigure(fig, {...RIGS[light]([-0.72, -0.7]), keyBand: 2, shadowBand: 2});
  return {img, anchors: {thumbTip: [24, 46 - lift] as [number, number], wrist: [143, 166] as [number, number]}};
};

// ================================================================== the CAPSULE HAND (form-shaded, for insert scale)
// A hand as capsules with height above the surface (x, y in image px; z toward the camera). Each pixel takes the
// front-most capsule; its normal is lit by the key and quantized to the room's skin ramp in clean bands (no dither on
// skin), outlined where one form passes over another and at the silhouette's shadow side, rimmed on its lit side.
// The same idea as the approved Orb (a form lit from its normals), so hands, glass and Orb sit in one light.
export interface Cap {
  a: [number, number, number]; b: [number, number, number];
  ra: number; rb: number;
  /** cross-section flattening (1 = round, 0.4 = a flattened slab like the back of the hand) */
  sz?: number;
  mat?: 'skin' | 'nail' | 'cuff';
  id: string;
}
export interface CapRender { img: Img; z: Float32Array; id: Int16Array; }
const TONES: Record<HandLight, number[]> = {
  // shadow -> light (the key side): 7 skin steps; then [outline, rim]
  dark: [PAL.X0, PAL.X1, PAL.X2, PAL.X3, PAL.K2, PAL.K3, PAL.K4],
  suite: [PAL.X0, PAL.X1, PAL.X2, PAL.X3, PAL.K2, PAL.K3, PAL.K4],
  lobby: [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.W9],
};
const NAILT: Record<HandLight, number[]> = {
  dark: [PAL.X1, PAL.X2, PAL.X3, PAL.K3, PAL.K4, PAL.K5, PAL.K5],
  suite: [PAL.X1, PAL.X2, PAL.X3, PAL.K3, PAL.K4, PAL.K5, PAL.K5],
  lobby: [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.W9, PAL.W9],
};
const CUFFT: Record<HandLight, number[]> = {
  dark: [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.C1, PAL.C2, PAL.C4],
  suite: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.C5],
  lobby: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
};
const OUTLINE: Record<HandLight, number> = {dark: PAL.S0, suite: PAL.S0, lobby: PAL.S0};
export interface CapLight {
  /** toward the key, 3D (x right, y down, z toward camera); normalised inside */
  key: [number, number, number];
  /** band thresholds on the lambert term (6 values between the 7 tones) */
  bands?: number[];
  /** a second (back / rim) light: direction and the colour its hottest band takes */
  back?: {dir: [number, number, number]; min: number; col: number};
  /** cel mode (the portraits' flat planes): indices into the 7-tone list, one per band, and the thresholds between */
  cel?: {tones: number[]; at: number[]};
}
/** the default cel look: mauve shadow, the X3 bridge, the lit plane, one highlight */
export const CEL = {tones: [2, 3, 4, 5], at: [0.12, 0.34, 0.8]};
export const renderCaps = (w: number, h: number, caps: Cap[], light: HandLight, L: CapLight): CapRender => {
  const N = w * h;
  const zb = new Float32Array(N).fill(-1e9), nxb = new Float32Array(N), nyb = new Float32Array(N), nzb = new Float32Array(N);
  const idb = new Int16Array(N).fill(-1);
  caps.forEach((c, ci) => {
    const [ax, ay, az] = c.a, [bx, by, bz] = c.b;
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-6, len = Math.sqrt(L2);
    const r0 = Math.max(c.ra, c.rb);
    const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - r0 - 1)), x1 = Math.min(w - 1, Math.ceil(Math.max(ax, bx) + r0 + 1));
    const y0 = Math.max(0, Math.floor(Math.min(ay, by) - r0 - 1)), y1 = Math.min(h - 1, Math.ceil(Math.max(ay, by) + r0 + 1));
    const sz = c.sz ?? 1;
    const slope = (bz - az) / len; // the axis rising toward b
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      let t = ((px - ax) * dx + (py - ay) * dy) / L2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const cx = ax + dx * t, cy = ay + dy * t;
      const r = c.ra + (c.rb - c.ra) * t;
      const ox = px - cx, oy = py - cy;
      const d2 = ox * ox + oy * oy;
      if (d2 >= r * r) continue;
      const hh = Math.sqrt(r * r - d2);
      const z = az + (bz - az) * t + hh * sz;
      const i = y * w + x;
      if (z <= zb[i]) continue;
      zb[i] = z; idb[i] = ci;
      // normal of the (flattened) tube; the axis slope tips it back along the axis
      let nx = ox / r, ny = oy / r, nz = (hh / r) / Math.max(0.2, sz);
      if (t > 0 && t < 1) { nx -= (dx / len) * slope * (hh / r); ny -= (dy / len) * slope * (hh / r); }
      const nl = Math.hypot(nx, ny, nz) || 1;
      nxb[i] = nx / nl; nyb[i] = ny / nl; nzb[i] = nz / nl;
    }
  });
  const kl = Math.hypot(...L.key) || 1;
  const K = L.key.map((v) => v / kl);
  const bands = L.bands ?? [-0.12, 0.1, 0.3, 0.5, 0.8, 0.96];
  const img = newImgH(w, h);
  const T = TONES[light], NT = NAILT[light], CT = CUFFT[light];
  for (let i = 0; i < N; i++) {
    const ci = idb[i];
    if (ci < 0) continue;
    const lam = nxb[i] * K[0] + nyb[i] * K[1] + nzb[i] * K[2];
    let k = 0;
    if (L.cel) { let c = 0; while (c < L.cel.at.length && lam > L.cel.at[c]) c++; k = L.cel.tones[c]; }
    else while (k < bands.length && lam > bands[k]) k++;
    const m = caps[ci].mat ?? 'skin';
    let col = (m === 'nail' ? NT : m === 'cuff' ? CT : T)[k];
    if (L.back && m !== 'nail') {
      const B = L.back.dir, bl = Math.hypot(...B) || 1;
      const lb = (nxb[i] * B[0] + nyb[i] * B[1] + nzb[i] * B[2]) / bl;
      if (lb > L.back.min && k < 4) col = L.back.col;
    }
    img.c[i] = col;
  }
  // outlines: a pixel whose neighbour is empty or clearly nearer (another form over it) takes the outline, on the
  // side away from the key; the key side of the silhouette takes the rim
  const out = new Int32Array(img.c);
  const kx = -K[0], ky = -K[1];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (idb[i] < 0) continue;
    const m = caps[idb[i]].mat ?? 'skin';
    let edge = false, rim = false;
    for (const [ddx, ddy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const X = x + ddx, Y = y + ddy;
      const j = Y * w + X;
      const emptyN = X < 0 || Y < 0 || X >= w || Y >= h || idb[j] < 0;
      const over = !emptyN && idb[j] !== idb[i] && zb[j] > zb[i] + 1.6;
      if (emptyN || over) {
        // toward the key = rim (only on the silhouette), away = outline
        const toward = ddx * kx + ddy * ky < 0;
        if (emptyN && toward) rim = true; else edge = true;
      }
    }
    if (edge) out[i] = m === 'cuff' ? PAL.N0 : OUTLINE[light];
    else if (rim && m !== 'cuff') out[i] = T[6];
  }
  img.c.set(out);
  return {img, z: zb, id: idb};
};
const newImgH = (w: number, h: number): Img => ({w, h, c: new Int32Array(w * h).fill(-1)});

/** A finger as three capsules from its knuckle: segment lengths, radii at the joints, per-joint pitch (down toward
 *  the desk: degrees; + = the segment dips away from the camera), the heading in the image plane. */
export interface CapFinger {
  at: [number, number, number];
  heading: number;
  len: [number, number, number];
  r: [number, number, number, number];
  pitch: [number, number, number];
  yaw?: [number, number, number];
  nail?: boolean;
  id: string;
}
export const capFinger = (f: CapFinger): {caps: Cap[]; tip: [number, number, number]; joints: Array<[number, number, number]>} => {
  const caps: Cap[] = [];
  let [x, y, z] = f.at;
  let hd = f.heading;
  let pitch = 0;
  const joints: Array<[number, number, number]> = [[x, y, z]];
  for (let k = 0; k < 3; k++) {
    hd += f.yaw?.[k] ?? 0;
    pitch += f.pitch[k];
    const L = f.len[k];
    const hL = L * Math.cos(rad(pitch)), dz = -L * Math.sin(rad(pitch));
    const nx = x + Math.cos(rad(hd)) * hL, ny = y + Math.sin(rad(hd)) * hL, nz = z + dz;
    caps.push({a: [x, y, z], b: [nx, ny, nz], ra: f.r[k], rb: f.r[k + 1], id: `${f.id}${k}`});
    x = nx; y = ny; z = nz;
    joints.push([x, y, z]);
  }
  if (f.nail) {
    // the nail: a flattened plate riding the distal segment's top, from 40% to the tip
    const [a, b] = [joints[2], joints[3]];
    const p = (t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t + f.r[3] * 0.92];
    caps.push({a: p(0.42), b: p(0.97), ra: f.r[3] * 0.56, rb: f.r[3] * 0.5, sz: 0.3, mat: 'nail', id: `${f.id}n`});
  }
  return {caps, tip: joints[3], joints};
};

// ------------------------------------------------------------------ poses in centimetres (rendered at any px/cm)
/** A pose frame: cm -> image px with a rotation about the wrist (deg, + = clockwise on screen) and the scale s. */
const frameCM = (s: number, ox: number, oy: number, rot = 0) => {
  const c = Math.cos(rad(rot)), si = Math.sin(rad(rot));
  return (p: [number, number, number]): [number, number, number] => [ox + (p[0] * c - p[1] * si) * s, oy + (p[0] * si + p[1] * c) * s, p[2] * s];
};
const capCM = (F: (p: [number, number, number]) => [number, number, number], s: number, a: [number, number, number], b: [number, number, number], ra: number, rb: number, id: string, sz = 1, mat: Cap['mat'] = 'skin'): Cap => ({a: F(a), b: F(b), ra: ra * s, rb: rb * s, sz, mat, id});

export interface TapPose {
  /** px per cm */
  s: number;
  thumb: TapThumb;
  six?: boolean;
  light: HandLight;
  /** the hand's heading, deg (0 = fingers straight up the frame) */
  rot?: number;
  /** the phone's top surface height, cm (the thumb's pad lands on it) */
  surf?: number;
}
/**
 * THE TAP HAND, form-shaded (capsules). Resting beside a phone lying on the desk: knuckles up, fingers loosely curled
 * on the desk, the thumb out over the phone. Rendered at s px/cm: sc 29 at ~9.5 (its own phone), sc 26 at ~13.5
 * (rooms-a's bigger desk-insert phone). Returns the image, the thumb pad (put it on the button) and the wrist.
 */
export const tapHandCaps = (o: TapPose) => {
  const s = o.s;
  const W = Math.ceil(19 * s), H = Math.ceil(17 * s);
  const ox = W * 0.72, oy = H - 0.2 * s; // the wrist centre sits at the image's bottom
  const F = frameCM(s, ox, oy, o.rot ?? -30);
  const caps: Cap[] = [];
  const surf = o.surf ?? 0.8;
  // the wrist and the back of the hand: ONE broad, gently convex slab from the wrist (5.2 cm) to the knuckle row
  // (8.2 cm), the pinky side's edge, the thumb's mound; faint metacarpal ridges only near the knuckles
  caps.push(capCM(F, s, [0, 1.6, 1.8], [0, -1.0, 2.0], 2.5, 2.6, 'wrist', 0.5));
  caps.push(capCM(F, s, [0.1, -1.2, 1.5], [0, -5.7, 1.72], 2.7, 3.85, 'back', 0.32));
  const mcp: Array<[number, number, number]> = o.six
    ? [[-3.3, -9.1, 2.55], [-1.65, -9.6, 2.7], [0, -9.75, 2.75], [1.65, -9.45, 2.6], [3.2, -8.7, 2.35]]
    : [[-3.05, -9.2, 2.55], [-1.0, -9.75, 2.75], [1.05, -9.5, 2.62], [3.0, -8.7, 2.35]];
  caps.push(capCM(F, s, [2.3, -1.2, 1.6], [3.55, -7.6, 1.85], 1.0, 1.05, 'hypo', 0.55));
  caps.push(capCM(F, s, [-2.0, -1.4, 1.85], [-4.1, -5.4, 2.05], 1.55, 1.35, 'thenar', 0.6));
  // the knuckle heads (+ a faint ridge running back from each)
  const kr = o.six ? 0.8 : 0.98;
  mcp.forEach((k, i) => {
    caps.push(capCM(F, s, [k[0] * 0.55, k[1] + 3.4, k[2] - 0.05], [k[0], k[1] + 0.3, k[2] + 0.1], kr * 0.55, kr * 0.82, 'meta' + i, 0.45));
    caps.push(capCM(F, s, [k[0], k[1] + 0.2, k[2] + 0.12], [k[0], k[1] - 0.05, k[2] + 0.12], kr, kr, 'mcp' + i, 0.72));
  });
  // the curled fingers (index -> pinky), touching: proximal forward and down, the middle straight down, the tip
  // tucked; from above they end in the rounded middle knuckles
  const lens: Array<[number, number, number]> = o.six
    ? [[4.0, 2.3, 1.8], [4.4, 2.6, 2.0], [4.5, 2.7, 2.0], [4.2, 2.5, 1.9], [3.4, 2.0, 1.6]]
    : [[4.1, 2.4, 1.9], [4.6, 2.8, 2.1], [4.3, 2.7, 2.0], [3.5, 2.1, 1.7]];
  const rr = o.six ? 0.84 : 1.04;
  mcp.forEach((k, i) => {
    const heading = -90 - (o.six ? (2 - i) * 2 : (1.5 - i) * 2.5);
    const f = capFinger({at: [0, 0, 0], heading, len: lens[i], r: [rr, rr * 0.95, rr * 0.86, rr * 0.76], pitch: [30, 62, 52], nail: false, id: 'f' + i});
    const pj = f.joints[1];
    f.caps.push({a: [pj[0], pj[1] + 0.1, pj[2]], b: [pj[0], pj[1] - 0.1, pj[2]], ra: rr * 0.98, rb: rr * 0.98, sz: 0.85, id: 'pip' + i});
    for (const c of f.caps) {
      const A: [number, number, number] = [c.a[0] + k[0], c.a[1] + k[1], c.a[2] + k[2]], B: [number, number, number] = [c.b[0] + k[0], c.b[1] + k[1], c.b[2] + k[2]];
      caps.push({...c, a: F(A), b: F(B), ra: c.ra * s, rb: c.rb * s});
    }
  });
  // THE THUMB: from its mound, over the phone, pointing up-left; the pad on the screen ('tap'), lifted ('up'),
  // lying on the phone's back ('rest')
  const lift = o.thumb === 'up' ? 0.45 : 0;
  const tipZ = surf + 0.82 + lift;
  const mcpT: [number, number, number] = [-4.6, -5.4, 2.1];
  const ip: [number, number, number] = [-6.9, -7.9, (mcpT[2] + tipZ) / 2 + 0.25];
  const tip: [number, number, number] = [-8.6, -10.1, tipZ];
  caps.push(capCM(F, s, [-2.8, -2.4, 2.0], mcpT, 1.55, 1.2, 'tmeta', 0.75));
  caps.push(capCM(F, s, mcpT, ip, 1.2, 1.08, 'tprox'));
  caps.push(capCM(F, s, ip, tip, 1.08, 0.95, 'tdist'));
  // the thumb's nail (on its top, near the tip)
  const nA: [number, number, number] = [ip[0] + (tip[0] - ip[0]) * 0.4, ip[1] + (tip[1] - ip[1]) * 0.4, ip[2] + (tip[2] - ip[2]) * 0.4 + 0.85];
  const nB: [number, number, number] = [ip[0] + (tip[0] - ip[0]) * 0.95, ip[1] + (tip[1] - ip[1]) * 0.95, ip[2] + (tip[2] - ip[2]) * 0.95 + 0.76];
  caps.push(capCM(F, s, nA, nB, 0.55, 0.5, 'tnail', 0.3, 'nail'));
  const light: CapLight = o.light === 'lobby'
    ? {key: [-0.35, -0.7, 0.62], back: {dir: [0.9, -0.2, 0.3], min: 0.72, col: PAL.K2}, cel: CEL}
    : o.light === 'suite'
      ? {key: [-0.6, -0.55, 0.6], back: {dir: [0.85, -0.45, 0.3], min: 0.74, col: PAL.X3}, cel: CEL}
      : {key: [-0.58, -0.52, 0.62], cel: CEL};
  const r = renderCaps(W, H, caps, o.light, light);
  const pad = F([tip[0] + 0.25, tip[1] + 0.35, 0]);
  return {img: r.img, anchors: {thumbPad: [pad[0], pad[1]] as [number, number], wrist: [ox, oy] as [number, number]}, z: r.z, W, H};
};
