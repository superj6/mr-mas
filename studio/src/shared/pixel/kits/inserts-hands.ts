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
// Construction: every hand but the carving fist is a set of CAPSULES with height (digits = three segments from the
// knuckle, the back of the hand a flattened slab, knuckle heads, the thumb's mound), posed in centimetres and rendered
// at the shot's px/cm (re-rasterised per scale, never an enlarged sprite), lit by the room's key through its normals
// and quantised to the portraits' flat cel planes (CEL: mauve shadow, the X3 bridge, the lit plane, one highlight;
// no dither on skin), outlined where one form passes over another, rimmed on the key side, joint creases on top. The
// carving fist is authored as explicit figure planes in the pen's frame (it reads better at 4.4 px/cm). Lights:
// 'dark' (the monitor's cyan from the top-left), 'suite' (the laptop's cyan + the window's pale back-rim), 'lobby'
// (tungsten from above + the lobby neon's cyan kiss on the rim).
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

const rad = (d: number) => (d * Math.PI) / 180;

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

/** The tap hand's thumb states. */
export type TapThumb = 'up' | 'tap' | 'rest';

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
  /** joint creases: positions along the axis (0..1) where a 1 px darker wrinkle crosses the top of the form */
  creases?: number[];
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
  const tb = new Float32Array(N), db = new Float32Array(N);
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
      zb[i] = z; idb[i] = ci; tb[i] = t * len; db[i] = Math.sqrt(d2) / r;
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
    // a joint crease: the pixels of this form within half a pixel of a crease line, near its top, two tones down
    const cr = caps[ci].creases;
    if (cr && m === 'skin' && db[i] < 0.62) {
      const c0 = caps[ci], L0 = Math.hypot(c0.b[0] - c0.a[0], c0.b[1] - c0.a[1]);
      for (const tc of cr) if (Math.abs(tb[i] - tc * L0) < 0.55) { k = Math.max(0, k - 2); break; }
    }
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
    caps.push({a: [x, y, z], b: [nx, ny, nz], ra: f.r[k], rb: f.r[k + 1], id: `${f.id}${k}`, creases: k === 0 ? [0.86, 0.93] : k === 1 ? [0.84] : undefined});
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

// ------------------------------------------------------------------ world poses seen at an elevation (glass shots)
/**
 * World cm (x right, y toward the camera side of the desk, z up) -> view px for a camera looking across the desk at
 * elevation E (deg; 90 = straight down, ~20 = nearly side-on). Returns a capsule builder in view space.
 */
export const viewCM = (s: number, ox: number, oy: number, E: number) => {
  const se = Math.sin(rad(E)), ce = Math.cos(rad(E));
  const V = (p: [number, number, number]): [number, number, number] => [ox + p[0] * s, oy + (p[1] * se - p[2] * ce) * s, (p[1] * ce + p[2] * se) * s];
  const cap = (a: [number, number, number], b: [number, number, number], ra: number, rb: number, id: string, sz = 1, mat: Cap['mat'] = 'skin'): Cap => ({a: V(a), b: V(b), ra: ra * s, rb: rb * s, sz, mat, id});
  return {V, cap};
};
/** A finger in world cm from its knuckle toward its tip through two joint points (straight segments). */
const chain = (cap: ReturnType<typeof viewCM>['cap'], pts: Array<[number, number, number]>, r: number[], id: string): Cap[] =>
  pts.slice(0, -1).map((p, k) => ({...cap(p, pts[k + 1], r[k], r[k + 1], `${id}${k}`), creases: k === 0 && pts.length > 3 ? [0.86, 0.93] : k === 1 && pts.length > 3 ? [0.84] : k === 0 ? [0.9] : undefined}));

/**
 * THE PINCH (hand 2: the set-down and the nudge, sc 24 + sc 30 — ONE drawing whose last frame is the nudge). The
 * right hand from the right: index and middle fingertips against the tumbler's right side, the thumb on its near face,
 * ring and pinky curled under. Seen across the desk at E (the glass shots' angle, the glass's water line one flat row).
 * World: the glass centre at (0, 0, 0), radius gR, height gH (cm). Anchors: the glass centre's base in the image.
 */
export const pinchHand = (o: {s: number; light: HandLight; E?: number; gR?: number; gH?: number}) => {
  const s = o.s, E = o.E ?? 22, R = o.gR ?? 3.6, GH = o.gH ?? 8.6;
  const W = Math.ceil(20 * s), H = Math.ceil(13 * s);
  const ox = Math.round(4.5 * s), oy = Math.round(H - 1.2 * s); // the glass's base centre in the image
  const {cap, V} = viewCM(s, ox, oy, E);
  const caps: Cap[] = [];
  const zI = GH * 0.56, zM = GH * 0.4;
  // the back of the hand: a slab facing the camera and up, from the knuckles (at the glass) back to the wrist
  const mcpI: [number, number, number] = [R + 5.6, -0.3, zI + 1.4], mcpM: [number, number, number] = [R + 5.9, 0.2, zM + 0.9];
  const mcpR: [number, number, number] = [R + 6.0, 0.4, zM - 0.6], mcpP: [number, number, number] = [R + 5.7, 0.4, zM - 2.0];
  const wrist: [number, number, number] = [R + 12.2, 0.8, zM + 0.4];
  caps.push(cap([R + 9.6, 0.7, zM - 0.2], wrist, 2.7, 2.6, 'wrist', 0.6));
  caps.push(cap([R + 6.6, 0.3, (zI + zM) / 2 - 0.4], [R + 9.8, 0.7, zM], 3.3, 2.8, 'back', 0.42));
  // the index + middle: straight, their pads on the glass's right side (index a little behind, middle a little in front)
  const tipI: [number, number, number] = [R + 0.72, -0.9, zI - 0.3], tipM: [number, number, number] = [R + 0.8, 0.4, zM - 0.4];
  caps.push(...chain(cap, [mcpI, [R + 3.4, -0.6, zI + 1.0], [R + 1.9, -0.8, zI + 0.45], tipI], [0.98, 0.9, 0.82, 0.76], 'fi'));
  caps.push(...chain(cap, [mcpM, [R + 3.6, 0.35, zM + 0.7], [R + 2.0, 0.4, zM + 0.2], tipM], [1.0, 0.92, 0.84, 0.78], 'fm'));
  // ring + pinky curled under the hand (their middle knuckles show)
  caps.push(...chain(cap, [mcpR, [R + 3.9, 0.9, zM - 1.3], [R + 4.3, 1.5, zM - 2.6]], [0.95, 0.88, 0.8], 'fr'));
  caps.push(...chain(cap, [mcpP, [R + 4.2, 0.9, zM - 2.7], [R + 4.7, 1.4, zM - 3.8]], [0.82, 0.76, 0.7], 'fp'));
  // the thumb: from its mound on the near side of the hand, across the glass's near face, its pad on the glass
  const tb: [number, number, number] = [R + 6.4, 2.2, zM + 0.6];
  const tipT: [number, number, number] = [R * 0.93, R * 0.42 + 1.0, zM + 0.8];
  caps.push(cap([R + 8.6, 1.6, zM - 0.2], tb, 1.6, 1.35, 'tmeta', 0.75));
  caps.push(...chain(cap, [tb, [R + 3.2, R * 0.45 + 1.9, zM + 1.0], tipT], [1.3, 1.12, 0.98], 'th'));
  // nails: index and middle seen from above-side at the tips, the thumb's on its top
  const nail = (a: [number, number, number], b: [number, number, number], r: number, id: string) => caps.push(cap([a[0], a[1], a[2] + r * 0.92], [b[0], b[1], b[2] + r * 0.9], r * 0.55, r * 0.5, id, 0.3, 'nail'));
  nail([R + 1.9, -0.8, zI + 0.45], [R + 0.95, -0.9, zI - 0.2], 0.8, 'ni');
  nail([R + 2.0, 0.4, zM + 0.2], [R + 1.05, 0.4, zM - 0.3], 0.82, 'nm');
  nail([R + 2.1, R * 0.44 + 1.5, zM + 0.95], [R + 0.35, R * 0.42 + 1.05, zM + 0.8], 0.95, 'nt');
  const light: CapLight = o.light === 'lobby'
    ? {key: [-0.2, -0.75, 0.62], back: {dir: [-0.9, 0.1, 0.4], min: 0.8, col: PAL.K2}, cel: CEL}
    : {key: [-0.62, -0.5, 0.6], back: {dir: [0.8, -0.5, 0.3], min: 0.76, col: PAL.X3}, cel: CEL};
  const r = renderCaps(W, H, caps, o.light, light);
  const w = V(wrist);
  return {img: r.img, anchors: {glassBase: [ox, oy] as [number, number], wrist: [w[0], w[1]] as [number, number]}, W, H, s, E, R, GH};
};

/**
 * THE CLICK (hand 1, sc 25 THE BREAK): the right hand on the laptop's palm rest, the index finger out on the
 * trackpad, the others curled, the thumb relaxed. World cm on the deck (z up), seen at E. 'click' presses the
 * index's tip into the pad (1 px: the only change). Anchors: the fingertip (put it on the trackpad).
 */
export const clickHand = (o: {s: number; E: number; click?: boolean; light?: HandLight; rot?: number}) => {
  const s = o.s, E = o.E, light = o.light ?? 'suite';
  const W = Math.ceil(22 * s), H = Math.ceil(19 * s);
  const ox = Math.round(3 * s), oy = Math.round(3 * s); // the index fingertip's contact point in the image
  const vw = viewCM(s, ox, oy, E);
  // the hand comes in from the lower right: rotate the pose about the fingertip in the deck plane
  const th = ((o.rot ?? -40) * Math.PI) / 180, ct = Math.cos(th), st = Math.sin(th);
  const Rz = (p: [number, number, number]): [number, number, number] => [p[0] * ct - p[1] * st, p[0] * st + p[1] * ct, p[2]];
  const V = (p: [number, number, number]) => vw.V(Rz(p));
  const cap = (a: [number, number, number], b: [number, number, number], ra: number, rb: number, id: string, sz = 1, mat: Cap['mat'] = 'skin') => vw.cap(Rz(a), Rz(b), ra, rb, id, sz, mat);
  const caps: Cap[] = [];
  const press = o.click ? 0.18 : 0;
  // the wrist and the back of the hand, resting on the palm rest (right of the trackpad), fingers pointing away
  const K = {i: [2.2, 8.2, 2.3], m: [4.3, 8.0, 2.45], r: [6.2, 8.5, 2.3], p: [7.9, 9.4, 2.0]} as Record<string, [number, number, number]>;
  const wristC: [number, number, number] = [6.8, 17.5, 1.9];
  caps.push(cap([6.6, 16.2, 1.8], [6.9, 19.5, 1.9], 2.6, 2.6, 'wrist', 0.55));
  caps.push(cap([6.4, 15.0, 1.55], [5.2, 11.2, 1.75], 2.7, 3.8, 'back', 0.34));
  caps.push(cap([8.2, 16.0, 1.4], [8.6, 10.4, 1.6], 1.0, 1.0, 'hypo', 0.55));
  caps.push(cap([4.4, 15.6, 1.6], [2.4, 12.6, 1.8], 1.5, 1.3, 'thenar', 0.6));
  for (const k of ['i', 'm', 'r', 'p']) caps.push(cap([K[k][0], K[k][1] + 0.2, K[k][2] + 0.1], [K[k][0], K[k][1] - 0.05, K[k][2] + 0.1], 0.98, 0.98, 'mcp' + k, 0.72));
  // the index: out straight onto the pad, a gentle bend, its tip on the contact point
  caps.push(...chain(cap, [K.i, [1.3, 4.0, 1.9], [0.6, 1.6, 1.25], [0, 0, 0.78 - press]], [1.0, 0.92, 0.84, 0.76], 'fi'));
  caps.push(cap([0.95, 2.4, 1.6 + 0.9], [0.15, 0.3, 0.8 - press + 0.72], 0.46, 0.42, 'ni', 0.3, 'nail'));
  // middle, ring, pinky curled on the palm rest
  const curl = (k: string, id: string, len: number) => {
    const a = K[k];
    const pip: [number, number, number] = [a[0] - 0.3, a[1] - len, a[2] - 0.9];
    const dip: [number, number, number] = [a[0] - 0.4, a[1] - len - 0.5, a[2] - 2.2];
    caps.push(...chain(cap, [a, pip, dip], [0.98, 0.92, 0.84], id));
  };
  curl('m', 'fm', 3.6); curl('r', 'fr', 3.4); curl('p', 'fp', 2.8);
  // the thumb: relaxed along the trackpad's right edge, pointing away-left
  caps.push(cap([3.2, 14.6, 1.7], [1.8, 11.0, 1.6], 1.45, 1.2, 'tmeta', 0.75));
  caps.push(...chain(cap, [[1.8, 11.0, 1.6], [0.2, 8.6, 1.3], [-0.9, 6.6, 1.0]], [1.2, 1.06, 0.95], 'th'));
  caps.push(cap([-0.1, 8.0, 1.3 + 0.9], [-0.8, 6.8, 1.0 + 0.85], 0.52, 0.48, 'nt', 0.3, 'nail'));
  const L: CapLight = {key: [-0.3, -0.85, 0.45], back: {dir: [0.8, -0.3, 0.4], min: 0.8, col: PAL.X3}, cel: CEL};
  const r = renderCaps(W, H, caps, light, L);
  const w = V(wristC);
  return {img: r.img, anchors: {tip: [ox, oy] as [number, number], wrist: [w[0], w[1]] as [number, number]}};
};

// ------------------------------------------------------------------ the 26A hands, form-shaded (desk-close scale)
/**
 * THE RESTING HAND (hand 5), capsules: relaxed on the desk, seen from his side (E), fingers forward and together,
 * the thumb out to the left with its PAD at the anchor (put it on mark 3). s = px/cm (the 26A desk close: ~4.4).
 */
export const restHandCaps = (o: {s: number; E?: number; light?: HandLight}) => {
  const s = o.s, E = o.E ?? 58, light = o.light ?? 'dark';
  const W = Math.ceil(16 * s), H = Math.ceil(22 * s);
  const ox = Math.round(2.2 * s), oy = Math.round(12.5 * s); // the thumb pad in the image
  const {cap, V} = viewCM(s, ox, oy, E);
  const caps: Cap[] = [];
  const mcp: Array<[number, number, number]> = [[3.0, -3.4, 2.2], [5.0, -3.9, 2.35], [6.9, -3.5, 2.2], [8.6, -2.5, 1.9]];
  const wrist: [number, number, number] = [6.4, 4.6, 1.5];
  caps.push(cap([6.3, 3.6, 1.35], [5.6, -0.6, 1.55], 2.6, 3.7, 'back', 0.32));
  caps.push(cap([8.6, 3.8, 1.2], [9.0, -1.8, 1.4], 1.0, 1.0, 'hypo', 0.55));
  caps.push(cap([4.4, 3.0, 1.5], [2.6, 0.2, 1.7], 1.5, 1.3, 'thenar', 0.6));
  mcp.forEach((k, i) => caps.push(cap([k[0], k[1] + 0.2, k[2] + 0.1], [k[0], k[1] - 0.05, k[2] + 0.1], 0.95, 0.95, 'mcp' + i, 0.72)));
  // the fingers lying forward, a little curled, the tips touching the desk; nails at the tips
  const lens: Array<[number, number, number]> = [[4.2, 2.4, 1.9], [4.7, 2.8, 2.1], [4.4, 2.7, 2.0], [3.6, 2.1, 1.7]];
  mcp.forEach((k, i) => {
    const f = capFinger({at: [0, 0, 0], heading: -90 - (1.5 - i) * 1.5, len: lens[i], r: [1.05, 0.97, 0.88, 0.8], pitch: [14, 14, 16], nail: true, id: 'f' + i});
    for (const c of f.caps) caps.push({...c, ...cap([c.a[0] + k[0], c.a[1] + k[1], c.a[2] + k[2]], [c.b[0] + k[0], c.b[1] + k[1], c.b[2] + k[2]], c.ra, c.rb, c.id, c.sz ?? 1, c.mat)});
  });
  // the thumb: from its mound out to the left, lying on its side, the pad at the anchor
  caps.push(...chain(cap, [[2.8, 1.2, 1.6], [1.5, -0.4, 1.3], [0.4, -1.5, 1.0], [-0.2, -1.9, 0.82]], [1.35, 1.12, 1.0, 0.9], 'th'));
  caps.push(cap([0.6, -1.4, 1.0 + 0.8], [-0.1, -1.85, 0.82 + 0.72], 0.5, 0.46, 'nt', 0.3, 'nail'));
  const r = renderCaps(W, H, caps, light, {key: [-0.58, -0.62, 0.52], cel: CEL});
  const w = V(wrist);
  return {img: r.img, anchors: {thumbPad: [ox, oy] as [number, number], wrist: [w[0], w[1]] as [number, number]}};
};
