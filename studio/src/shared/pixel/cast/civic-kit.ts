// MR. MAS — cast kit: THE CIVIC CAST (Ep1 Acts Two and Three; new file, owned by the `v3-art-b` pass). The shared
// geometry every new Act Two / Three speaker is built on, so a new face is its signature features (hair, glasses,
// aviators, pearls, a prop), never a new skull: caricature by silhouette and one or two features plus a prop, never a
// likeness (guardrails: no portrait likeness of a real person).
//
//   BUST tier (112 x 136, the approved portrait/MCU size; head ≈ 40 px, so it also plays the [M]/[2S] tier behind a
//   table): `bustHead(spec)` returns the head, ear and neck PARTS + the face's light PLANES + the eye / brow / mouth
//   STAMPS, all authored 3/4 facing CAMERA-LEFT (the approved portraits' view: nose at x ≈ 38, ear at x ≈ 86), key
//   light from camera-left. The base skull is the approved speaking-portrait head (cast/tasya-speak.ts), re-used as
//   geometry with two knobs: `long` (px added below the eyes) and `jaw` (px added to the back of the jaw). A figure
//   file adds its hair, its torso (`suitTorso`) and its props, and renders with `renderFigure` + its own LightRig.
//   Six mouths (cast/talk.ts visemes), three lids, a 1-px eye dart.
//
//   ROOM tier (a standing adult ≈ 78-82 px, head ≈ 13 px, pov-and-framing §4.1): `roomBody(spec, pose)` gives a
//   suited body as parts (legs, torso, arms in named poses) and the hands as stamps; the figure file adds its own
//   hand-pixelled 16 x 17 head TONE MAP (`headStamp`). Seated figures are the same drawing with the table/dais/desk
//   overpainting the legs (the plates own that line).
//
// Everything is whole-pixel, master palette only, no scaled sprites. Materials: skin, hair, suit, shirt, tie, plus a
// figure's own (pearl, gold, pen, lens, ...). A figure's LightRig supplies the ramps [outline, shadow, mid, light,
// bright, rim] per material.
import {PAL, stepColor as stepColorK} from '../palette';
import {P} from '../figure';
import type {Adjust, Part, Prim, Stamp, Img} from '../figure';
import type {Buf} from '../px';
import type {Viseme} from './talk';

export const CIV_W = 112, CIV_H = 136;
export const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
export const recolor = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ ramps
/** skin [outline, shadow, mid, light, bright, rim] per complexion, in warm (day / tungsten) light */
export const SKIN: Record<'light' | 'medium' | 'deep', number[]> = {
  light: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  medium: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  deep: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
};
/** the same complexions under the monitor's cyan (a figure seen in Mas's room light) */
export const SKIN_CYAN: Record<'light' | 'medium' | 'deep', number[]> = {
  light: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  medium: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  deep: [PAL.S0, PAL.X0, PAL.X1, PAL.X3, PAL.K2, PAL.K3],
};
export const SUIT: Record<'navy' | 'charcoal' | 'black' | 'plum' | 'tweed' | 'slate' | 'teal', number[]> = {
  navy: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5, PAL.N7],
  charcoal: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G5],
  black: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G4, PAL.G6],
  plum: [PAL.N0, PAL.U1, PAL.U2, PAL.U3, PAL.U4, PAL.U5],
  tweed: [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W4],
  slate: [PAL.N0, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N8],
  teal: [PAL.N0, PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C5],
};
export const SHIRT_WHITE = [PAL.N2, PAL.G4, PAL.G6, PAL.P1, PAL.P2, PAL.P2];
export const SHIRT_BLUE = [PAL.N2, PAL.N6, PAL.N7, PAL.N8, PAL.G6, PAL.P2];
export const HAIR: Record<'dark' | 'brown' | 'silver' | 'white' | 'grey', number[]> = {
  dark: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4],
  brown: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W4],
  silver: [PAL.N0, PAL.G2, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  white: [PAL.N1, PAL.G4, PAL.G5, PAL.G6, PAL.P2, PAL.W9],
  grey: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
};
/** the eye / mouth stamp colours (the approved portraits' ink: N0 lids, a warm white, S0 mouth line) */
export const FACE_INK = {lid: PAL.N0, white: PAL.P1, whiteShade: PAL.S4, iris: PAL.N0, glint: PAL.W8, lash: PAL.N0, mouth: PAL.S0, lip: PAL.S3, lipDark: PAL.S2, teeth: PAL.P2, teethShade: PAL.P0, dark: PAL.N0};

// ------------------------------------------------------------------ the bust head (3/4 camera-left)
export interface HeadSpec {
  /** px added below the eyes (a longer face) */
  long?: number;
  /** px added to the back of the jaw (a squarer, heavier jaw) */
  jaw?: number;
  /** a softer jaw and a 1-px smaller nose */
  soft?: boolean;
  /** age: 0 none · 1 the nasolabial fold · 2 + crow's feet and a forehead line */
  age?: 0 | 1 | 2;
  /** vertical offset of the whole head (the torso stays) */
  dy?: number;
  /** horizontal offset of the whole head */
  dx?: number;
}
export interface FaceState {
  mouth: Viseme;
  /** 0 open · 1 half · 2 closed */
  lid: 0 | 1 | 2;
  /** iris dart: -1 toward camera-left (where the head faces) · 0 · 1 toward camera-right */
  look: -1 | 0 | 1;
  /** 0 level · 1 raised (query / delight) · -1 knit */
  brow: -1 | 0 | 1;
}
export const FACE_DEFAULT: FaceState = {mouth: 'rest', lid: 0, look: 0, brow: 0};

const BASE_HEAD = [46, 33, 51, 26, 59, 22, 68, 21, 77, 24, 84, 31, 87, 41, 87, 53, 85, 63, 81, 73, 76, 81, 69, 87, 60, 90, 52, 89, 47, 85, 44, 79, 43, 73, 41, 69, 42, 66, 40, 63, 38, 60, 40, 57, 41, 51, 42, 43];
const BASE_EAR = [79, 50, 84, 47, 88, 50, 88, 58, 85, 65, 80, 66, 78, 59];
const BASE_NECK = [53, 80, 54, 101, 62, 104, 72, 101, 73, 78];
/** the head transform: `long` stretches everything below y 52, `jaw` pushes the back jaw out, soft pulls the nose in */
const tf = (h: HeadSpec) => {
  const L = h.long ?? 0, J = h.jaw ?? 0, dx = h.dx ?? 0, dy = h.dy ?? 0;
  return (pts: number[]) => pts.map((v, i) => {
    if (i % 2 === 0) {
      const y = pts[i + 1];
      let x = v;
      if (J && x > 62 && y > 62) x += J * Math.min(1, (y - 62) / 16);
      if (h.soft && x < 43 && y > 52 && y < 66) x += 1;
      return x + dx;
    }
    const y = v;
    return (y > 52 ? y + L * Math.min(1, (y - 52) / 34) : y) + dy;
  });
};
const T = (h: HeadSpec) => { const t = tf(h); return (...pts: number[]) => P.poly(...t(pts)); };
const TL = (h: HeadSpec) => { const t = tf(h); return (x0: number, y0: number, x1: number, y1: number) => { const p = t([x0, y0, x1, y1]); return P.line(Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), Math.round(p[3])); }; };
/** a head-space point (for stamps and props): [x, y] after the transform */
export const headPt = (h: HeadSpec, x: number, y: number): [number, number] => { const p = tf(h)([x, y]); return [Math.round(p[0]), Math.round(p[1])]; };

export interface BustHead { parts: Part[]; adjust: Adjust[]; stamps: Stamp[]; }
/**
 * The head, the ear and the neck (parts), the face's planes (adjust), and its eyes, brows, nostril and mouth (stamps).
 * `eye` sets the eye drawing: 'calm' (the approved hooded eye), 'lash' (a heavier upper lid with lashes), 'crinkle'
 * (a grin's lower lid pushed up). `browCol` the brow colour; `mouthW` 0 narrow · 1 standard · 2 a wide grin mouth.
 */
export const bustHead = (h: HeadSpec, s: FaceState, o: {eye?: 'calm' | 'lash' | 'crinkle'; browCol?: number; browHeavy?: boolean; mouthW?: 0 | 1 | 2; lipCol?: number; noNeck?: boolean} = {}): BustHead => {
  const H = T(h), HL = TL(h);
  const jawOpen = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const J = (...pts: number[]) => H(...pts.map((v, i) => (i % 2 && v >= 73 ? v + jawOpen : v)));
  const parts: Part[] = [];
  if (!o.noNeck) parts.push({group: 'neck', mat: 'skin', tone: 1, prims: [H(...BASE_NECK)]});
  parts.push(
    {group: 'head', mat: 'skin', tone: 2, prims: [J(...BASE_HEAD)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [H(...BASE_EAR)]},
  );
  const adjust: Adjust[] = [
    // the lit front plane (the key from camera-left)
    plane('skin', 3, J(46, 33, 51, 26, 59, 22, 66, 23, 62, 31, 61, 43, 63, 53, 62, 63, 60, 73, 57, 83, 52, 89, 47, 85, 44, 79, 43, 73, 41, 69, 42, 66, 40, 63, 38, 60, 40, 57, 41, 51, 42, 43)),
    plane('skin', 4, H(48, 31, 53, 25, 59, 23, 55, 30, 51, 36), H(39, 58, 41, 53, 43, 53, 42, 60, 39, 60), H(51, 55, 57, 54, 58, 60, 52, 61)),
    plane('skin', 5, HL(50, 28, 53, 26), HL(39, 59, 40, 59)),
    // the side of the face toward the ear, in shadow
    plane('skin', 1, J(72, 47, 78, 47, 80, 61, 78, 71, 72, 79, 66, 83, 68, 73, 72, 63)),
    // the eye sockets, the side of the nose, the upper lip's shadow
    plane('skin', 1, H(54, 46, 68, 44, 70, 48, 56, 49), H(43, 47, 49, 46, 49, 49, 44, 50)),
    plane('skin', 1, H(45, 52, 48, 51, 48, 60, 45, 63, 43, 61)),
    plane('skin', 1, H(40, 63, 46, 64, 47, 66, 42, 66)),
    plane('skin', 2, H(58, 59, 64, 57, 66, 63, 60, 65)),
    // the ear's bowl
    plane('skin', 1, H(81, 52, 85, 51, 86, 58, 83, 63, 81, 61)),
    plane('skin', 0, H(82, 55, 84, 55, 84, 59, 82, 59)),
  ];
  if (!o.noNeck) adjust.push(
    // under the jaw: the neck in the head's shadow, the lit neck's front edge
    plane('skin', 1, J(53, 89, 62, 88, 72, 83, 74, 84, 73, 96, 62, 99, 54, 96)),
    plane('skin', 2, H(55, 95, 60, 97, 58, 100, 55, 99)),
  );
  if (h.soft) adjust.push(plane('skin', 3, J(47, 80, 52, 84, 56, 86, 52, 88, 48, 85)));
  if ((h.age ?? 0) >= 1) adjust.push(plane('skin', 1, HL(47, 64, 44, 72), HL(55, 70, 56, 76)));
  if ((h.age ?? 0) >= 2) adjust.push(plane('skin', 1, HL(66, 50, 69, 52), HL(66, 52, 68, 54), HL(47, 37, 56, 35)), plane('skin', 2, HL(49, 40, 58, 38)));
  // ---- stamps: the eyes (near at 55, far at 44), the brows, the nostril, the mouth
  const L = s.lid;
  const eye = o.eye ?? 'calm';
  const dart = (rows: string[]) => rows.map((r) => {
    if (!s.look || !/[I]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (c === 'I' || c === 'g' ? 'w' : c));
    ch.forEach((c, i) => { if ((c === 'I' || c === 'g') && out[i + s.look] && out[i + s.look] !== '.' && out[i + s.look] !== 'L') out[i + s.look] = c; });
    return out.join('');
  });
  const nearEye = L === 2 ? ['...........', '.LLLLLLLLL.', '...kkkkk...']
    : L === 1 ? ['...........', '.LLLLLLLLL.', '..kwIIgwk..']
    : eye === 'lash' ? ['.LLLLLLLLL.', 'LLwwIIgwwL.', '..kwIIwk...']
    : eye === 'crinkle' ? ['..LLLLLLL..', '.LwwIIgwwL.', '..kkkkkkk..']
    : ['..LLLLLLL..', '.LwwIIgww..', '..kwIIwk...'];
  const farEye = L === 2 ? ['....', 'LLLL', '.kk.'] : L === 1 ? ['....', 'LLLL', 'kIIk']
    : eye === 'lash' ? ['LLLL', 'LIIw', '.kk.'] : eye === 'crinkle' ? ['.LL.', 'LIIL', '.kk.'] : ['.LL.', 'LIIw', '.kk.'];
  const EP = {L: FACE_INK.lid, w: FACE_INK.white, I: FACE_INK.iris, g: FACE_INK.glint, k: PAL.S2};
  const [nex, ney] = headPt(h, 55, 47), [fex, fey] = headPt(h, 44, 48);
  const bc = o.browCol ?? PAL.B1;
  const by = s.brow === 1 ? -1 : 0;
  const nearBrow = s.brow === -1 ? ['.bbbbbbbbbbb.', '...........bb'] : o.browHeavy ? ['.bbbbbbbbbbb.', 'bbbbbbbbbbbbb'] : ['..bbbbbbbbbb.', 'bbbbbbbbb....'];
  const farBrow = s.brow === -1 ? ['bbbb.', '....b'] : ['.bbbb', 'bbbb.'];
  const [nbx, nby] = headPt(h, 54, 43), [fbx, fby] = headPt(h, 43, 44);
  const [nx, ny] = headPt(h, 41, 63);
  const [mx, my] = headPt(h, 43, 72);
  const W = o.mouthW ?? 1;
  const lip = o.lipCol ?? PAL.S3;
  const mouths: Record<Viseme, string[]> = W === 2 ? {
    rest: ['m..........m', '.mmmmmmmmmm.', '..llllllll..'],
    smile: ['m..........m', '.mmmmmmmmmm.', '..llllllll..'],
    A: ['m..........m', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mddddddm..', '...mmmmmm...'],
    E: ['m..........m', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mmmmmmmm..'],
    O: ['............', '...mmmmm....', '..mdddddm...', '..mdddddm...', '...mmmmm....'],
    M: ['m..........m', '.mmmmmmmmmm.', '..MMMMMMMM..', '...llllll...'],
  } : W === 0 ? {
    rest: ['.......', 'mmmmmm.', '.llll..'],
    smile: ['......r', 'mmmmmm.', '.llll..'],
    A: ['.......', 'mmmmmmm', 'mTTTTm.', '.mddm..', '..mm...'],
    E: ['.......', 'mmmmmmr', 'mTTTTTm', '.mmmm..'],
    O: ['.......', '.mmm...', 'mdddm..', '.mmm...'],
    M: ['.......', 'mmmmmm.', '.MMMM..', '.llll..'],
  } : {
    rest: ['.........', 'mmmmmmmm.', '.lllll...'],
    smile: ['r.......r', '.mmmmmmm.', '..llll...'],
    A: ['.........', 'mmmmmmmmm', 'mTTTTTTm.', 'mddddddm.', '.mddddm..', '..mmmm...'],
    E: ['.........', 'mmmmmmmmr', 'mTTTTTTTm', '.mddddm..', '..llll...'],
    O: ['.........', '..mmmm...', '.mddddm..', '.mddddm..', '..mmmm...'],
    M: ['.........', 'mmmmmmmm.', '.MMMMMM..', '..llll...'],
  };
  const stamps: Stamp[] = [
    {x: nex, y: ney, rows: dart(nearEye), pal: EP},
    {x: fex, y: fey, rows: dart(farEye), pal: EP},
    {x: nbx, y: nby + by, rows: nearBrow, pal: {b: bc}},
    {x: fbx, y: fby + by, rows: farBrow, pal: {b: bc}},
    {x: nx, y: ny, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: mx - (W === 2 ? 1 : 0), y: my + (W === 2 ? 0 : 0), rows: mouths[s.mouth], pal: {m: FACE_INK.mouth, M: PAL.S1, l: lip, r: PAL.S2, T: FACE_INK.teeth, d: FACE_INK.dark}},
  ];
  return {parts, adjust, stamps};
};

// ------------------------------------------------------------------ bust torsos (3/4, facing camera-left)
export interface TorsoSpec {
  /** 'suit' notch lapels + shirt + tie · 'blazer' open collar · 'pantsuit' a shell top, no tie · 'jacket' leather */
  kind: 'suit' | 'blazer' | 'pantsuit' | 'jacket';
  /** shoulders' y (default 104) */
  sy?: number;
  /** no tie (open collar) */
  noTie?: boolean;
}
/** The torso parts and planes (materials: suit, shirt, tie). Frame-bottom at 150 (drawBust extends the bust). */
export const suitTorso = (t: TorsoSpec): {parts: Part[]; adjust: Adjust[]; stamps: Stamp[]} => {
  const d = (t.sy ?? 101) - 104;
  const Y = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + d : v)));
  const parts: Part[] = [
    {group: 'torso', mat: 'suit', tone: 2, prims: [Y(20, 150, 22, 118, 32, 107, 48, 101, 64, 101, 82, 103, 96, 109, 107, 118, 114, 130, 116, 150)]},
  ];
  const adjust: Adjust[] = [
    // the near shoulder catches the key; the far side of the chest falls off
    plane('suit', 3, Y(32, 107, 48, 101, 54, 112, 44, 124, 36, 116)),
    plane('suit', 4, P.line(33, 107 + d, 47, 102 + d)),
    plane('suit', 1, Y(76, 103, 82, 103, 96, 109, 107, 118, 111, 128, 112, 150, 90, 150, 80, 120, 72, 108)),
  ];
  const stamps: Stamp[] = [];
  if (t.kind === 'jacket') {
    parts.push({group: 'tee', mat: 'shirt', tone: 2, prims: [Y(50, 101, 58, 106, 66, 107, 74, 103, 70, 124, 62, 132, 54, 120)]});
    adjust.push(plane('suit', 0, P.line(50, 103 + d, 58, 136 + d), P.line(73, 104 + d, 66, 136 + d)), plane('shirt', 3, Y(54, 106, 60, 108, 58, 116, 55, 112)));
    return {parts, adjust, stamps};
  }
  if (t.kind === 'pantsuit') {
    // a round-necked shell top under the jacket, the jacket's shawl edge
    parts.push({group: 'shell', mat: 'shirt', tone: 2, prims: [Y(50, 101, 56, 106, 64, 107, 72, 104, 69, 118, 62, 124, 55, 116)]});
    adjust.push(plane('suit', 4, Y(48, 102, 52, 104, 57, 118, 60, 136, 57, 136, 52, 118)), plane('suit', 1, Y(73, 104, 76, 104, 70, 120, 66, 136, 63, 136, 66, 120)),
      plane('shirt', 3, Y(53, 106, 58, 108, 57, 113, 54, 110)), plane('shirt', 1, Y(66, 106, 71, 105, 69, 114, 65, 111)));
    return {parts, adjust, stamps};
  }
  // suit / blazer: the shirt's V, the collar band round the neck, the collar points, the tie, the notch lapels
  parts.push({group: 'shirt', mat: 'shirt', tone: 3, prims: [Y(51, 100, 57, 104, 64, 106, 71, 103, 68, 122, 62, 128, 56, 118), Y(51, 96, 56, 99, 63, 100, 72, 97, 74, 101, 71, 104, 63, 106, 57, 104, 51, 100)]});
  if (t.kind === 'suit' && !t.noTie) parts.push({group: 'tie', mat: 'tie', tone: 2, prims: [Y(60, 106, 65, 106, 66, 110, 64, 112, 66, 132, 62, 136, 59, 132, 61, 112, 59, 110)]});
  adjust.push(
    // the collar points (the near one lit), the V's shadow side
    plane('shirt', 4, Y(51, 100, 57, 104, 58, 110, 53, 106), Y(51, 96, 56, 99, 57, 102, 52, 99)),
    plane('shirt', 1, Y(66, 99, 72, 97, 73, 100, 67, 102)),
    plane('shirt', 2, Y(64, 106, 71, 103, 70, 110, 66, 110)),
    // the lapels: the near one lit on its roll, the far one a rung down, the notch gaps
    plane('suit', 4, Y(48, 102, 52, 104, 58, 120, 61, 136, 58, 136, 52, 120)),
    plane('suit', 3, Y(47, 104, 50, 106, 55, 122, 57, 136, 54, 136)),
    plane('suit', 1, Y(72, 104, 75, 104, 70, 120, 66, 136, 63, 136, 67, 120)),
    plane('suit', 0, P.line(50, 110 + d, 53, 108 + d), P.line(72, 109 + d, 74, 107 + d)),
  );
  if (t.kind === 'suit' && !t.noTie) adjust.push(plane('tie', 3, Y(60, 106, 63, 106, 62, 111, 61, 118, 60, 130)), plane('tie', 1, Y(64, 112, 66, 132, 64, 134, 63, 116)), plane('tie', 0, P.line(59, 111 + d, 66, 111 + d)));
  if (t.kind === 'blazer' || t.noTie) adjust.push(plane('shirt', 1, Y(58, 106, 63, 108, 62, 122, 59, 116)), plane('skin', 3, Y(58, 101, 64, 102, 62, 108, 59, 106)));
  if (t.kind === 'blazer' || t.noTie) parts.push({group: 'throat', mat: 'skin', tone: 2, prims: [Y(57, 100, 65, 101, 63, 110, 60, 110)]});
  return {parts, adjust, stamps};
};

// ------------------------------------------------------------------ room scale (a standing adult ≈ 80 px)
export const ROOM_FW = 44, ROOM_FH = 82;
export const ROOM_FOOT: [number, number] = [20, 80];
export type RoomArm = 'down' | 'point' | 'baton' | 'spread' | 'card' | 'clasp' | 'write' | 'reach' | 'up' | 'phone' | 'stamp' | 'hip' | 'clap0' | 'clap1';
export type RoomLegs = 'stand' | 'w0' | 'w1' | 'w2' | 'w3';
export interface RoomBodySpec {
  /** torso cut: 'suit' (square shoulders, a jacket hem at the hip) · 'pantsuit' · 'blazer' · 'jacket' (short, boxy) */
  kind: 'suit' | 'pantsuit' | 'blazer' | 'jacket';
  /** shoulder half-width boost in px (a boxier jacket) */
  broad?: number;
  /** trousers material (default 'suit') */
  legMat?: string;
}
type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const LG = (hip: number, kx: number, ky: number, ax: number, ay: number): Leg => ({hip, kx, ky, ax, ay});
const LEGS: Record<RoomLegs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: LG(23, 23.4, 61, 23.6, 75), f: LG(17, 16.8, 61, 16.4, 75), bob: 0},
  w0: {n: LG(23, 26.6, 60, 29.6, 74), f: LG(17, 14.2, 61, 10.8, 74), bob: 1},
  w1: {n: LG(23, 23.6, 61, 23, 75), f: LG(17, 18.6, 59, 19.6, 71), bob: 0},
  w2: {n: LG(23, 19.8, 61, 16.4, 74), f: LG(17, 20.8, 60, 23.6, 74), bob: 1},
  w3: {n: LG(23, 24, 59, 25, 71), f: LG(17, 17, 61, 16.8, 75), bob: 0},
};
export const roomWalkAt = (f: number): RoomLegs => (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(f / 3) % 4];
const seg = (x0: number, y0: number, w0: number, x1: number, y1: number, w1: number): Prim => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return P.poly(x0 + (nx * w0) / 2, y0 + (ny * w0) / 2, x1 + (nx * w1) / 2, y1 + (ny * w1) / 2, x1 - (nx * w1) / 2, y1 - (ny * w1) / 2, x0 - (nx * w0) / 2, y0 - (ny * w0) / 2);
};
/** where each arm pose puts [elbow x, y, hand x, y] for the near (camera-right) and far arm, local, unflipped */
const ARMS: Record<RoomArm, {n: [number, number, number, number]; f: [number, number, number, number]}> = {
  down: {n: [27, 34, 27.4, 43], f: [14, 34, 14.4, 43]},
  point: {n: [31, 30, 39, 26], f: [14, 34, 14.4, 43]},
  baton: {n: [30, 32, 33, 23], f: [14, 34, 14.4, 43]},
  spread: {n: [33, 29, 40, 23], f: [9, 29, 3, 23]},
  card: {n: [29, 35, 30, 30], f: [14, 34, 14.4, 43]},
  clasp: {n: [26, 35, 22, 38], f: [15, 35, 19, 38]},
  write: {n: [29, 36, 31, 41], f: [14, 35, 17, 41]},
  reach: {n: [30, 33, 37, 36], f: [14, 34, 14.4, 43]},
  up: {n: [30, 24, 31, 13], f: [14, 34, 14.4, 43]},
  phone: {n: [27, 35, 25, 30], f: [14, 34, 14.4, 43]},
  stamp: {n: [31, 32, 34, 40], f: [14, 35, 18, 38]},
  hip: {n: [30, 36, 26, 43], f: [11, 36, 15, 43]},
  clap0: {n: [29, 34, 24, 33], f: [14, 34, 19, 33]},
  clap1: {n: [30, 34, 26, 32], f: [13, 34, 17, 32]},
};
export const roomHand = (arm: RoomArm, side: 'n' | 'f', bob = 0): [number, number] => { const a = ARMS[arm][side]; return [Math.round(a[2]), Math.round(a[3] + bob)]; };
/**
 * A suited body at room scale (3/4 facing screen-right, like every room sprite; flip for left). Returns the parts and
 * the hand stamps; the figure adds its head map with `headStamp` at (12, bob). Materials: suit, shirt, tie, skin,
 * shoe (and `legMat`).
 */
export const roomBody = (spec: RoomBodySpec, arm: RoomArm, legs: RoomLegs = 'stand', o: {armF?: RoomArm; tie?: boolean} = {}): {parts: Part[]; stamps: Stamp[]; bob: number; adjust: Adjust[]} => {
  const Lg = LEGS[legs];
  const bob = Lg.bob;
  const B = (v: number) => v + bob;
  const br = spec.broad ?? 0;
  const lm = spec.legMat ?? 'suit';
  const leg = (l: Leg, near: boolean): Part[] => {
    const g = near ? 'legN' : 'legF';
    const foot = P.poly(l.ax - 2.6, l.ay, l.ax + 2.6, l.ay, l.ax + 6.4, l.ay + 3, l.ax + 6.4, l.ay + 5, l.ax - 3, l.ay + 5);
    return [
      {group: g, mat: lm, prims: [seg(l.hip, 46, 7.4, l.kx, l.ky, 5.8), seg(l.kx, l.ky, 5.6, l.ax, l.ay + 1, 5), P.ell(l.kx, l.ky, 2.8, 2.5)]},
      {group: g + 's', mat: 'shoe', prims: [foot]},
    ];
  };
  const an = ARMS[arm].n, af = ARMS[o.armF ?? arm].f;
  const sl = (g: string, sx: number, sy: number, a: [number, number, number, number]): Part => ({group: g, mat: 'suit', prims: [P.ell(sx, B(sy), 4, 4), seg(sx, B(sy), 7, a[0], B(a[1]), 6.2), seg(a[0], B(a[1]), 6, a[2], B(a[3]), 5.2), P.ell(a[0], B(a[1]), 3, 3)]});
  const torso = spec.kind === 'jacket'
    ? P.poly(12 - br, B(21), 18, B(18.5), 26, B(18.5), 31 + br, B(21), 31 + br, B(30), 30, B(42), 11, B(42), 11 - br, B(30))
    : P.poly(12 - br, B(21), 18, B(18.5), 26, B(18.5), 31 + br, B(21), 31 + br, B(30), 30, B(40), 31, B(48), 11, B(48), 12, B(40), 11 - br, B(30));
  const parts: Part[] = [
    ...leg(Lg.f, false),
    sl('armF', 15, 23, af),
    ...leg(Lg.n, true),
    {group: 'torso', mat: 'suit', prims: [torso]},
    {group: 'neck', mat: 'skin', prims: [P.poly(19, B(15), 24, B(15), 24, B(19), 19, B(19))]},
    sl('armN', 28, 23, an),
  ];
  const stamps: Stamp[] = [];
  // the shirt's V and the tie (or the shell top / tee)
  if (spec.kind === 'suit' || spec.kind === 'blazer') {
    stamps.push({x: 19, y: B(19), rows: spec.kind === 'suit' && o.tie !== false ? ['wwTww', '.wTw.', '.wTw.', '..T..', '..T..'] : ['wwsww', '.www.', '..w..'], pal: {w: ['shirt', 3], T: ['tie', 2], s: ['skin', 3]}});
    stamps.push({x: 17, y: B(20), rows: ['L.....l', 'L.....l', '.L...l.', '.L...l.', '..L.l..'], pal: {L: ['suit', 4], l: ['suit', 1]}});
  } else if (spec.kind === 'pantsuit') {
    stamps.push({x: 19, y: B(19), rows: ['wwwww', '.www.', '..w..'], pal: {w: ['shirt', 3]}});
  } else {
    stamps.push({x: 19, y: B(19), rows: ['kkkkk', '.kkk.', '..k..'], pal: {k: ['shirt', 2]}});
  }
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(B(y)) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  stamps.push(hand(af[2], af[3]), hand(an[2], an[3]));
  const adjust: Adjust[] = [{prims: [P.rect(0, 62, ROOM_FW, 20)], add: -1, onlyMat: lm}];
  return {parts, stamps, bob, adjust};
};
/** a room-scale head tone map (16 wide) as a stamp: `pal` maps its letters to [material, tone] */
export const headStamp = (rows: string[], bob: number, pal: Record<string, [string, number] | number>, dx = 0): Stamp => ({x: 12 + dx, y: bob, rows, pal});

// ------------------------------------------------------------------ placing a bust in a plate
/**
 * Composite a bust Img (112 x 136) into a frame with its top-left at (x, y), cut at row `cutY` (a table, a bench, the
 * frame's foot). Below the image's own last row the torso runs on to the cut: each column keeps the last row's colour,
 * falling off to shadow one rung every 12 px in hard bands (never a dither on a figure), and its two outer edges
 * keep an outline pixel. `flip` for camera-right facing (never on a figure carrying lettering).
 */
export const putBustCut = (b: Buf, im: Img, x: number, y: number, cutY: number, flip = false, side = 34) => {
  // the act-four framing kit's bust (episodes/ep01/act4/animatic/framing.ts `bust`, re-implemented for shared code): the
  // bottom row runs on down, and from the chest the shoulders fall off to shadow in hard bands toward the image's two
  // edges, the whole torso a band darker every 12 px below the portrait's own foot
  const col = (i: number) => (flip ? im.w - 1 - i : i);
  const Wd = im.w;
  for (let j = 0; y + j < cutY; j++) {
    const sy = Math.min(j, im.h - 1);
    for (let i = 0; i < Wd; i++) {
      let v = im.c[sy * Wd + col(i)];
      if (v < 0) continue;
      if (j >= 88) {
        const sd = side + (j >= im.h ? Math.round((j - im.h) * 0.7) : 0);
        const dx = Math.min(i, Wd - 1 - i);
        const kSide = dx < sd / 4 ? 6 : dx < sd / 2 ? 3 : dx < (3 * sd) / 4 ? 2 : dx < sd ? 1 : 0;
        const kBot = j >= im.h + 30 ? 5 : j >= im.h + 18 ? 3 : j >= im.h + 6 ? 2 : j >= im.h - 12 ? 1 : 0;
        const k = Math.max(kSide * (j >= 96 ? 1 : 0), kBot);
        if (k) v = stepColorK(v, -k);
      }
      b.set(x + i, y + j, v);
    }
  }
};
