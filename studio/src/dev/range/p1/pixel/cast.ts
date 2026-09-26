// MR. MAS - style-range Prototype 1: the PIXEL CAST at the Vegas table.
// Reused: NOLE and MARIO from the castrivals kit (their FigureDefs, re-lit here under the table's one tungsten pool).
// New: KRAM, NESNEJ and THE INTERN at room scale, seated / standing behind the far rail, and MAS in the left
// foreground at medium scale, BACK THREE-QUARTER (the over-the-shoulder that the anime push starts from).
// Everyone is lit by the same pool: the side of each face that turns toward the pot catches it, the tops of heads and
// shoulders take a warm rim, and the unlettered far neon puts a thin cool edge on their backs. Whole pixels only.
import {PAL} from '../../../../shared/pixel/palette';
import {FigureDef, Img, LightRig, P, Part, Stamp, renderFigure} from '../../../../shared/pixel/figure';
import {noleFigure} from '../../../../shared/pixel/cast/nole';
import {marioFigure, MARIO_BASE} from '../../../../shared/pixel/cast/mario';
import {CX} from '../../../../shared/pixel/cast/bosses';
import {seg} from '../../../../shared/pixel/cast/kit';
import {FormPart, Shape, renderForm, stampImg} from './inflate';

const memo = <T,>(fn: (p: T) => Img) => {
  const c = new Map<string, Img>();
  return (p: T) => {
    const k = JSON.stringify(p);
    let v = c.get(k);
    if (!v) { v = fn(p); c.set(k, v); }
    return v;
  };
};

// ------------------------------------------------------------------ the table's light, per material
const SKIN = [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5];
const SKIN_TAN = [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S4];
const RIM_COOL = [PAL.C4, PAL.C4, PAL.C4, PAL.C4, PAL.C4, PAL.C4];
const RIM_COOL_DIM = [PAL.C2, PAL.C2, PAL.C2, PAL.C2, PAL.C2, PAL.C2];

/** a seated player's rig: key from the pot (toward +x in the authored drawing) and above */
const tableRig = (ramps: Record<string, number[]>, back: Record<string, number>, keyX = 0.72): LightRig => ({
  key: [keyX, -0.7],
  keyBand: 3,
  shadowBand: 3,
  rim: true,
  outline: true,
  back: [-1, -0.05],
  backBand: 1,
  backRamp: back,
  ramps,
  groupBands: {torso: {key: 4, shadow: 4}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, head: {key: 5, shadow: 2}, collar: {key: 2, shadow: 1}},
  // the far rail cuts everyone at the chest: the lower torso already falls off toward the felt's dark edge
  keyGain: (_x, y) => (y < 36 ? 1 : Math.max(0.3, 1 - (y - 36) / 18)),
});

// ------------------------------------------------------------------ NOLE (castrivals rig, tungsten) : phone up
const NOLE_RAMPS: Record<string, number[]> = {
  skin: SKIN,
  hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.W3],
  tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.W2],
  belt: [PAL.N0, PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.W2],
  jeans: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.W2],
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.W2],
  phone: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.C4, PAL.C7],
  rimS: RIM_COOL, rimH: RIM_COOL_DIM,
};
export const NOLE_IMG = memo((_: {flare: boolean}) => {
  const fig = noleFigure({legs: 'stand', arm: 'phone', mouth: 0, lean: 0, light: 'lit', brow: 0, noLegs: true});
  // authored facing screen-left: key from its left (flipped at the table so he faces the pot)
  return renderFigure(fig, {...tableRig(NOLE_RAMPS, {skin: PAL.K2, hair: PAL.C2, tee: PAL.C1, phone: PAL.C3}), key: [-0.72, -0.7], back: [1, -0.05]});
});
/** Nole's head-top centre and the phone's screen centre, in his (unflipped) image */
export const NOLE_HEAD = {cx: 14 + 16 + 9, top: 0, w: 68};
export const NOLE_PHONE: [number, number] = [14 + 7, 28];

// ------------------------------------------------------------------ MARIO (castrivals rig, tungsten)
const MARIO_RAMPS: Record<string, number[]> = {
  skin: SKIN,
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B4, PAL.W4],
  fleece: [CX.F0, CX.F1, CX.F2, CX.F3, CX.F4, CX.F5],
  collar: [CX.F0, CX.F2, CX.F3, CX.F4, CX.F5, CX.F6],
  pants: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
  shoe: [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  rimC: RIM_COOL_DIM,
  glint: [PAL.W8, PAL.W8, PAL.W8, PAL.W8, PAL.W8, PAL.W8],
  zip: [PAL.G6, PAL.G6, PAL.G6, PAL.G6, PAL.G6, PAL.G6],
};
export const MARIO_IMG = memo((_: {}) => renderFigure(marioFigure({...MARIO_BASE, arm: 'down'}), tableRig(MARIO_RAMPS, {skin: PAL.K2, hair: PAL.C2, fleece: PAL.C2, collar: PAL.C3}, 0.72)));
export const MARIO_HEAD = {cx: 10 + 15 + 8, top: 0, w: 56};

// ------------------------------------------------------------------ KRAM and NESNEJ: new seated busts, room scale
// Authored facing screen-right (the pot is to their right when unflipped). Head = hand-pixelled tone map (16 x 19):
// digits = skin ramp, h..J = hair ramp, c = the cool back rim, b/e = brow/eye, m = mouth, g = gold, G = gold hot.
const BUST_W = 44, BUST_H = 50, HX = 13;
const CXB = HX + 9;
const bustTorso = (mat: string): Part[] => [
  // far arm first (behind the torso), then the neck, the torso (chest toward screen-right), the near arm
  {group: 'armF', mat, prims: [seg(CXB - 8, 25, 7, CXB - 12, 44, 6)]},
  {group: 'neck', mat: 'skin', prims: [P.poly(CXB - 3, 15, CXB + 3, 15, CXB + 4, 22, CXB - 4, 22)]},
  {group: 'torso', mat, prims: [P.poly(
    CXB - 4, 20.4, CXB + 4.4, 20.8, CXB + 8.6, 22.6, CXB + 11, 26, CXB + 12.4, 31, CXB + 12, 37, CXB + 13, 50,
    CXB - 12, 50, CXB - 11.6, 44, CXB - 12.6, 36, CXB - 12, 28, CXB - 10, 23.6, CXB - 7.4, 21.2)]},
  {group: 'armN', mat, prims: [seg(CXB + 9, 25, 7.4, CXB + 14, 44, 6.4)]},
];

// both heads start from Nole's approved head, mirrored to face the pot, then re-haired and re-jawed per player
const KRAM_HEAD = [
  '....o.oo.oo.o.....',
  '...oJoIJoIJoJo....',
  '..oIJHIJHIJHIJo...',
  '.oIHhIHhIHhIHIJo..',
  'oWhHhHhIHhIHhIJo..',
  'oWhhhHhhHhHhHI44o.',
  'oWhhhhhhhhhH23445o',
  '.oWhhhhhh12334445o',
  '.owhhhhh12333445o.',
  '.oWhh1oo3334bbb4o.',
  '..oWh12o23344e44o.',
  '..oW12o2233344455o',
  '..oW122o233344445o',
  '...ow12o223344noo.',
  '...o11122233444o..',
  '...o1122223mmm4o..',
  '....o1222233444o..',
  '....o122223344o...',
  '.....o1222334o....',
  '......oo11122o....',
  '.......o1222o.....',
];
const NESNEJ_HEAD = [
  '.....oooooo.......',
  '...ooHHHIIJoo.....',
  '..oHHHHHIIJJKo....',
  '.ohHHHHHIIJIJKo...',
  'oWhhHHIHHIIJIJKo..',
  'oWhhhHHHHHIHIIJ4o.',
  'oWhhhhhHHHHHI3445o',
  '.oWhhhhhhhH123445o',
  '.owhhhhh12333445o.',
  '.oWhh1oo3334bbb4o.',
  '..oWh12o23344e44o.',
  '..oW12o2233344455o',
  '..oW122o233344445o',
  '...ow12o223344noo.',
  '...o11122232444o..',
  '...o1122223mmm4o..',
  '....o1222233444o..',
  '....o1222233445o..',
  '.....oo2222334oo..',
  '.......o1111ooo...',
  '.......o1222o.....',
];
const HEAD_PAL = {
  o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
  h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], K: ['hair', 5], c: ['rim', 0], W: ['rim', 0], w: ['rim', 0], n: ['skin', 1],
  b: ['hair', 0], e: ['hair', 0], m: ['skin', 1], g: ['gold', 3], G: ['gold', 5],
} as Stamp['pal'];

const bust = (head: string[], torsoMat: string, extra: Stamp[] = []): FigureDef => ({
  w: BUST_W, h: BUST_H,
  parts: [
    ...bustTorso(torsoMat),
  ],
  adjust: [
    // the collar's shadow under the jaw
    {prims: [P.poly(CXB - 4, 20, CXB + 4, 20, CXB + 2, 23, CXB - 2, 23)], tone: 1, onlyMat: torsoMat},
  ],
  stamps: [{x: HX, y: 0, rows: head, pal: HEAD_PAL}, ...extra],
});

const KRAM_RAMPS: Record<string, number[]> = {
  skin: SKIN_TAN,
  hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.W3],
  tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.W2],
  gold: [PAL.D1, PAL.D2, PAL.W3, PAL.W5, PAL.W6, PAL.W8],
  rim: RIM_COOL_DIM,
};
export const KRAM_IMG = memo((_: {}) => {
  // the gold chain with its tiny thermos pendant
  const chain: Stamp = {x: CXB - 5, y: 21, rows: ['g.........g', '.g.......g.', '..gGgggGg..', '.....G.....', '.....g.....'], pal: HEAD_PAL};
  return renderFigure(bust(KRAM_HEAD, 'tee', [chain]), tableRig(KRAM_RAMPS, {skin: PAL.K2, hair: PAL.C2, tee: PAL.C1}));
});

const NESNEJ_RAMPS: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
  leather: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.W4],
  lapel: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.N5, PAL.W6],
  shirt: [PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.N4],
  rim: RIM_COOL,
};
export const NESNEJ_IMG = memo((_: {}) => {
  const fig = bust(NESNEJ_HEAD, 'leather', []);
  // the jacket's lapels and the dark tee in the V
  fig.parts.push({group: 'lapel', mat: 'lapel', prims: [P.poly(CXB - 4, 21, CXB, 27, CXB - 1, 34, CXB - 6, 24), P.poly(CXB + 5, 21, CXB + 1, 27, CXB + 3, 34, CXB + 8, 24)]});
  fig.parts.push({group: 'shirt', mat: 'shirt', prims: [P.poly(CXB - 3, 21, CXB + 4, 21, CXB + 0.5, 28)]});
  // leather sheen: one hard highlight down the near sleeve, one across the shoulder
  fig.adjust!.push({prims: [P.line(CXB + 12, 28, CXB + 13, 38)], tone: 5, onlyMat: 'leather'});
  fig.adjust!.push({prims: [P.line(CXB + 3, 21, CXB + 8, 22)], tone: 4, onlyMat: 'leather'});
  return renderFigure(fig, tableRig(NESNEJ_RAMPS, {skin: PAL.K2, hair: PAL.C4, leather: PAL.C2, lapel: PAL.C3}));
});
export const BUST_HEAD = {cx: CXB, top: 0, w: BUST_W};

// ------------------------------------------------------------------ THE INTERN (dealing): blazer, lanyard, a monitor
// head whose face is one blinking caret. Standing at the far right end, facing screen-left (authored that way).
export type InternHand = 'shoe' | 'reach' | 'lift' | 'up' | 'down' | 'smear';
const IN_W = 48, IN_H = 74;
const INTERN_RAMPS: Record<string, number[]> = {
  blazer: [PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.P0],
  shirt: [PAL.N1, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2],
  tie: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5],
  bezel: [PAL.N0, PAL.N1, PAL.G0, PAL.G1, PAL.G3, PAL.G5],
  screen: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  stand: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
  lanyard: [PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5],
  badge: [PAL.N2, PAL.P0, PAL.P0, PAL.P1, PAL.P2, PAL.P2],
  hand: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
};
/** the near arm's elbow and hand per pose (image coords); the card itself is drawn by the scene in frame space */
export const INTERN_ARM: Record<InternHand, [number, number, number, number]> = {
  shoe: [11, 44, 6, 52], reach: [9, 44, 2, 51], lift: [8, 38, 4, 36], up: [7, 30, 5, 17], down: [6, 36, -2, 40], smear: [5, 42, -6, 50],
};
const internFig = (hand: InternHand): FigureDef => {
  const parts: Part[] = [
    // the stand-neck into the collar
    {group: 'stand', mat: 'stand', prims: [P.rect(21, 17, 5, 7)]},
    // blazer: squared shoulders, a little too tall
    {group: 'torso', mat: 'blazer', prims: [P.poly(8, 27, 14, 23, 33, 23, 39, 27, 41, 40, 41, 74, 6, 74, 6, 40)]},
    {group: 'shirt', mat: 'shirt', prims: [P.poly(19, 23, 28, 23, 24, 36)]},
    // far arm toward the shoe
    {group: 'armF', mat: 'blazer', prims: [seg(36, 29, 7, 38, 46, 6)]},
  ];
  // near arm (screen-left): at the shoe, reaching, lifting the card into the lamp, holding it up, snapping it down
  const [ex, ey, hx, hy] = INTERN_ARM[hand];
  parts.push({group: 'armN', mat: 'blazer', prims: [seg(11, 29, 7.5, ex, ey, 6.5), seg(ex, ey, 6, hx + 1, hy, 5)]});
  parts.push({group: 'hand', mat: 'hand', prims: [P.ell(hx, hy, 2.4, 2.2)]});
  // the monitor head: bezel, the black screen (the caret is stamped per frame by the scene)
  parts.push({group: 'bezel', mat: 'bezel', prims: [P.rect(12, 2, 23, 16)]});
  parts.push({group: 'screen', mat: 'screen', prims: [P.rect(14, 4, 19, 12)]});
  return {
    w: IN_W, h: IN_H, parts,
    adjust: [
      // lapels
      {prims: [P.poly(17, 24, 22, 32, 20, 40, 15, 28)], add: 1, onlyMat: 'blazer'},
      {prims: [P.poly(30, 24, 26, 32, 28, 40, 33, 28)], add: -1, onlyMat: 'blazer'},
      {prims: [P.line(24, 37, 24, 74)], tone: 1, onlyMat: 'blazer'},
      // the dark tie down the shirt's V
      {prims: [P.rect(23, 25, 2, 11)], tone: 2, mat: 'tie'},
      {prims: [P.rect(23, 25, 2, 1)], tone: 3, mat: 'tie'},
      // the lanyard strap and the badge on the chest
      {prims: [P.line(19, 24, 21, 40), P.line(29, 24, 27, 40)], tone: 4, mat: 'lanyard'},
      {prims: [P.rect(20, 40, 8, 10)], tone: 3, mat: 'badge'},
      {prims: [P.rect(21, 41, 6, 2)], tone: 3, mat: 'lanyard'},
      // screen: a faint sheen line top-left, the rest black
      {prims: [P.line(15, 5, 20, 5)], tone: 5, onlyMat: 'screen'},
    ],
  };
};
export const INTERN_IMG = memo((p: {hand: InternHand}) => renderFigure(internFig(p.hand), {
  key: [0.55, -0.8], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, 0], backBand: 1, backRamp: {blazer: PAL.C3, bezel: PAL.C3, stand: PAL.C2, hand: PAL.C4},
  ramps: INTERN_RAMPS,
  groupBands: {screen: {key: 0, shadow: 0}, bezel: {key: 2, shadow: 1}},
  keyGain: (_x, y) => (y < 40 ? 1 : Math.max(0.3, 1 - (y - 40) / 30)),
}));
/** the caret: one 1 x 6 bar on the screen, in the image's coordinates */
export const INTERN_CARET: [number, number, number] = [23, 7, 6];
export const INTERN_W = IN_W;

// ------------------------------------------------------------------ MAS, back three-quarter, medium scale
// Seen from behind his right shoulder, he looks across the table to the right. The back of his head (the brown mass,
// the cowlick), his right ear, the edge of his cheek with ONE eye pixel at its rim, the grey hoodie's hood bunched at the
// nape, his right forearm along the rail to his hand. The pool is in front of him and to his right: he is backlit, a
// dark shape with a warm rim along the top-right of every form (inflate.ts lights each silhouette from the lamp).
export const MAS_W = 160, MAS_H = 214;
export type MasEye = 0 | 1;
const MAS_RAMP = {
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B4, PAL.W4],
  skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S5, PAL.S6],
  hood: [PAL.N0, PAL.N1, PAL.G0, PAL.G1, PAL.P0, PAL.P1],
  hoodIn: [PAL.N0, PAL.N0, PAL.N1, PAL.G0, PAL.G2, PAL.P0],
};
const pl = (...pts: number[]): Shape => ({k: 'poly', pts});
const el = (cx: number, cy: number, rx: number, ry: number): Shape => ({k: 'ell', cx, cy, rx, ry});
const MAS_LAMP: [number, number, number] = [0.62, -0.5, -0.6];
const masForm = (eye: MasEye): Img => {
  const parts: FormPart[] = [
    // the hoodie's back and shoulders (the near-left shoulder runs off the frame edge)
    {shapes: [pl(-4, 76, 16, 64, 40, 58, 80, 60, 100, 68, 112, 82, 116, 102, 112, 132, 114, 214, -4, 214)], ramp: MAS_RAMP.hood, R: 22, noOutlineBelow: 150,
      accents: [{shapes: [pl(96, 70, 100, 70, 110, 90, 106, 92)], add: -1}, {shapes: [pl(60, 90, 64, 90, 58, 214, 54, 214)], add: -1}]},
    // his right arm: the upper arm hangs from the shoulder, the forearm lies forward along the rail
    {shapes: [pl(96, 76, 110, 74, 120, 118, 104, 124), pl(104, 112, 122, 110, 142, 102, 140, 110, 120, 126, 108, 126), el(113, 118, 9, 8)], ramp: MAS_RAMP.hood, R: 7,
      accents: [{shapes: [pl(108, 120, 128, 110, 130, 112, 110, 123)], add: -1}]},
    {shapes: [pl(136, 99, 146, 99, 151, 103, 147, 109, 137, 109, 134, 104)], ramp: MAS_RAMP.skin, R: 3},
    // the neck and nape, then the hood bunched round it
    {shapes: [pl(50, 42, 68, 42, 70, 60, 50, 62)], ramp: MAS_RAMP.skin, R: 5},
    {shapes: [pl(28, 62, 42, 51, 62, 49, 80, 54, 90, 63, 76, 69, 50, 69)], ramp: MAS_RAMP.hoodIn, R: 5,
      accents: [{shapes: [pl(40, 60, 76, 62, 76, 64, 40, 63)], add: -1}]},
    // the face side: jaw, cheek, cheekbone (only its rim is seen)
    {shapes: [pl(62, 16, 74, 15, 81, 22, 85, 30, 85, 38, 80, 46, 72, 52, 64, 48, 60, 30)], ramp: MAS_RAMP.skin, R: 6, bands: [-0.45, -0.05, 0.3, 0.62]},
    // the hair: the skull's mass, the hairline sloping down in front to a sideburn, the cowlick flicked up at the crown
    {shapes: [el(56, 26, 18, 20), pl(60, 7, 74, 9, 82, 16, 84, 22, 78, 21, 73, 23, 70, 29, 66, 34, 58, 38), pl(62, 6, 67, 1, 75, 0, 82, 3, 86, 8, 80, 6, 76, 7, 81, 11, 74, 12, 66, 10)],
      ramp: MAS_RAMP.hair, R: 9, bands: [-0.3, 0.12, 0.45, 0.72],
      accents: [
        {shapes: [pl(40, 18, 42, 18, 48, 38, 46, 38), pl(48, 12, 50, 12, 54, 32, 52, 32), pl(34, 28, 36, 28, 40, 42, 38, 42)], add: -1},
        {shapes: [pl(58, 10, 60, 10, 68, 18, 66, 19), pl(64, 6, 66, 6, 72, 13, 70, 14)], add: 1},
      ]},
    // the right ear, over the hair's edge
    {shapes: [el(70, 31, 3.4, 5.6)], ramp: MAS_RAMP.skin, R: 2.5, bands: [-0.5, -0.05, 0.3, 0.6],
      accents: [{shapes: [pl(69, 28, 70, 28, 70, 34, 69, 34)], add: -2}]},
  ];
  const img = renderForm(MAS_W, MAS_H, parts, MAS_LAMP);
  // the one eye pixel at the cheek's rim: a lash and a white, the brow's tail above it
  const ex = eye === 0 ? 85 : 84;
  stampImg(img, ex, 26, ['b.', 'kw', '.k'], {b: PAL.B0, k: PAL.N0, w: PAL.S5});
  // his knuckles on the rail catch the pool
  stampImg(img, 140, 99, ['.56', '566', '.4.'], {'4': PAL.S3, '5': PAL.S5, '6': PAL.S6});
  return img;
};
export const MAS_IMG = memo((p: {eye: MasEye}) => masForm(p.eye));
/** where Mas's image is drawn (top-left, frame coords) */
export const MAS_AT: [number, number] = [-6, 58];
