// MR. MAS — cast: MAS TURNED AWAY, and the Q* vault at MCU-2 scale (CAST-MAS-TURNAWAY; Ep1 Act Four v5 art pass; new
// file, owned by the v5 art pass). S8.07 [MCU-2], the frameless 50/50: MAS, left, turned away to camera-left, already
// past the vault and not looking; GERG, right, a hand on the vault; the vault soft between them with its sticky note.
// v4 played Mas's front portrait there (and his mouth on "it's a preview."); v5 turns him away, so the line is heard,
// not seen (no mouth, art-needs-v5 §1.2).
//   masTurnedAway(s)          a 112 x 136 bust in masPortrait's own frame (same crown, shoulders and bust crop, so
//                             drawBust places it exactly where his portrait sits): the back of his head, a lost profile
//                             (the cheek's edge on the left, the side he walks toward), his right ear, the nape, the
//                             hood bunched on his back. The cowlick still breaks the silhouette at the front hairline.
//                             s.light 'warm' (the bullpen by day, tungsten key from the left) | 'monitor' (cyan);
//                             s.step 0 | 1: the walk's two held drawings (a 1 px bob and the shoulders' swing)
//   drawVaultMid(b, x, y, o)  the squat steel vault at this scale (76 x 88): the wheel, the hinge bolts, Q* stencilled,
//                             the yellow sticky note DO NOT OPEN. / DO NOT EXPLAIN. legible in the 7 px face; o.soft
//                             steps it down (the rack), the note included (keep it sharp with o.noteSharp)
//   gergHandOnVault(b, x, y)  GERG's hand flat on the vault's door, his green-lit sleeve coming in from the right
// Light: the lost profile catches the key (left); the back of the head and the hood are in their own shadow. No dither
// on skin or figures.
import {Buf, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {FigureDef, Img, LightRig, P, Part, Adjust, renderFigure} from '../figure';
import {memo} from './kit';
import {pt, pw} from '../kits/uitype';
import {bigText} from '../font';

export interface MasTurnawayState { light: 'warm' | 'monitor'; step: 0 | 1 }
export const MAS_TURNAWAY_DEFAULT: MasTurnawayState = {light: 'warm', step: 0};

const plane = (onlyMat: string, tone: number, ...prims: ReturnType<typeof P.poly>[]): Adjust => ({prims, tone, onlyMat});

const fig = (s: MasTurnawayState): FigureDef => {
  const b = s.step ? 1 : 0; // the bob: the head and shoulders a whole pixel down on the passing step
  const Y = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + b : v)));
  const sw = s.step ? -1 : 0; // the near shoulder swings a pixel forward (toward camera-left) on the passing step
  const parts: Part[] = [
    // the hoodie from behind: the near (left) shoulder lower and forward, the far one squarer
    {group: 'torso', mat: 'hood', tone: 2, prims: [Y(2 + sw, 144, 4 + sw, 118, 12, 106, 28, 99, 46, 96, 70, 96, 88, 100, 100, 110, 108, 144)]},
    // the nape and the neck's back (the neck turns away: only its right side shows)
    {group: 'neck', mat: 'neck', tone: 1, prims: [Y(50, 72, 50, 96, 66, 96, 72, 72)]},
    // the hood, bunched on his back below the neck (the dark inside faces away from us: we see its outside)
    {group: 'hood', mat: 'hood', tone: 1, prims: [Y(34, 104, 40, 94, 52, 90, 66, 90, 78, 93, 86, 102, 82, 116, 68, 122, 50, 120, 38, 114)]},
    // the head from behind, turned away to camera-left: the cranium, and the lost-profile cheek on the left edge
    {group: 'head', mat: 'skin', tone: 2, prims: [
      P.ell(62, 47 + b, 24, 26),
      Y(38, 50, 36, 58, 37, 66, 40, 74, 45, 80, 50, 82, 50, 60, 44, 46),
    ]},
    // the hair covering the back of the head: short sides and nape, a little length on top; the COWLICK springs off
    // the front hairline (camera-left) and breaks the silhouette, his mark from any angle
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      Y(42, 44, 40, 34, 44, 24, 52, 17, 62, 14, 74, 16, 82, 23, 86, 32, 87, 46, 85, 58, 81, 68, 74, 74, 64, 76, 54, 74, 48, 66, 46, 56),
      Y(47, 22, 45, 17, 41, 13, 37, 13, 39, 16, 42, 19, 44, 24),
    ]},
    // his right ear on the far side of the head, near its back edge
    {group: 'ear', mat: 'skinD', tone: 2, prims: [Y(82, 46, 86, 44, 89, 48, 89, 56, 86, 62, 82, 62, 81, 54)]},
  ];
  const adjust: Adjust[] = [
    // hair: strands radiating from the crown whorl down to the nape and forward to the fringe; the key's catch on the
    // crown's lit (left) side; the nape's short hair a rung darker
    plane('hair', 1, Y(64, 22, 65, 22, 58, 40, 57, 40), Y(70, 24, 71, 25, 72, 46, 71, 46), Y(76, 28, 77, 29, 82, 50, 81, 50), Y(60, 24, 61, 25, 50, 34, 49, 33), Y(66, 50, 67, 50, 64, 70, 63, 70), Y(74, 52, 75, 52, 76, 68, 75, 68)),
    plane('hair', 3, Y(44, 28, 48, 21, 54, 17, 50, 23, 46, 31), Y(38, 13, 42, 13, 44, 18, 41, 16)),
    plane('hair', 4, Y(44, 26, 47, 22, 45, 27), Y(39, 13, 41, 13, 40, 14)),
    plane('hair', 0, Y(52, 70, 60, 74, 72, 73, 80, 67, 76, 72, 64, 77, 54, 75)),
    // the lost profile: the cheek's lit edge, the jaw's line going away, the shadow where the cheek turns
    plane('skin', 3, Y(38, 52, 40, 51, 40, 66, 42, 74, 39, 70, 37, 62)),
    plane('skin', 1, Y(44, 62, 48, 60, 50, 66, 50, 80, 46, 78)),
    // the nape in the hair's shadow, the neck's side a rung lighter where the key reaches round
    plane('neck', 0, Y(50, 72, 70, 74, 68, 80, 52, 80)),
    plane('neck', 2, Y(50, 84, 53, 84, 53, 96, 50, 96)),
    // the ear's bowl and rim
    plane('skinD', 1, Y(84, 48, 87, 48, 87, 56, 85, 59)),
    plane('skinD', 3, Y(82, 47, 83, 46, 83, 58, 82, 57)),
    // the hoodie from behind: the shoulder blades' folds, the hood's lit top edge, the seam down the near shoulder
    plane('hood', 3, Y(36, 104, 42, 95, 52, 91, 46, 97, 40, 106)),
    plane('hood', 0, Y(42, 112, 52, 118, 66, 120, 80, 114, 78, 118, 66, 123, 50, 121)),
    plane('hood', 3, Y(6 + sw, 118, 12, 108, 24, 101, 16, 109, 10, 122)),
    plane('hood', 1, Y(58, 124, 60, 124, 62, 144, 60, 144), Y(90, 108, 96, 112, 104, 144, 98, 144)),
  ];
  return {w: 112, h: 136, parts, adjust};
};
// masPortrait's two rigs (cast/mas.ts masPortraitRig), key from camera-left; the rim toward the key only
const rig = (light: MasTurnawayState['light']): LightRig => light === 'warm'
  ? {
    key: [-0.9, -0.4], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck'],
    back: [1, -0.1], backBand: 1,
    backRamp: {skin: PAL.S2, skinD: PAL.S1, hair: PAL.B2, hood: PAL.G2},
    ramps: {
      skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
      neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
      skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
      hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
      hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
    },
  }
  : {
    key: [-0.9, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck'],
    back: [1, -0.1], backBand: 1,
    backRamp: {skin: PAL.X0, skinD: PAL.S0, hair: PAL.B1, hood: PAL.G1},
    ramps: {
      skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
      neck: [PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2, PAL.K3],
      skinD: [PAL.S0, PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2],
      hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K2, PAL.C6],
      hood: [PAL.N1, PAL.G0, PAL.G1, PAL.C2, PAL.C3, PAL.C6],
    },
  };
export const masTurnedAway = memo((s: MasTurnawayState): Img => renderFigure(fig(s), rig(s.light)));

// ------------------------------------------------------------------ the vault at MCU-2 scale
/** body 80 x 88 (+ its right side 10, the plinth 4); the note's rect relative to (x, y) */
export const VAULT_MID = {w: 90, h: 92, note: {x: 26, y: 21, w: 46, h: 38}, hand: {x: 58, y: 66}};
export interface VaultMidOpts { soft?: 0 | 1 | 2; noteSharp?: boolean }
/** The squat steel vault (drawVaultInsert's design, drawn again at this size): a box in 3/4 with its right side
 *  turning away, the inset door, the wheel handle (a drawn ring and three spokes), the hinge bolts, Q* stencilled
 *  and the sticky note in four lines. Lit by the hall's tungsten from the left, the bullpen's day on its right side.
 *  Put GERG's hand at VAULT_MID.hand (gergHandOnVault), under the note. */
export const drawVaultMid = (b: Buf, x: number, y: number, o: VaultMidOpts = {}) => {
  const k = o.soft ?? 0;
  const s = (c: number) => (k ? stepColor(c, -k) : c);
  const W = 80, H = 88, side = 10;
  // the body: front face, the right side turning away, the top's lit edge, the plinth
  rect(x, y, W, H, b.ink(s(PAL.G3)));
  for (let j = 0; j < H; j++) for (let i = 0; i < side; i++) { const top = Math.round((i / side) * 5); if (j >= top && j < H - Math.round((i / side) * 2)) b.set(x + W + i, y + j, s(i < 2 ? PAL.G2 : PAL.G1)); }
  rect(x, y, W, 2, b.ink(s(PAL.G5))); rect(x, y, 2, H, b.ink(s(PAL.W4)));
  rect(x - 2, y + H, W + side + 3, 3, b.ink(s(PAL.G1))); rect(x - 2, y + H + 3, W + side + 3, 1, b.ink(s(PAL.N1)));
  // the inset door with its bevel (lit top-left, dark bottom-right)
  const dx = x + 6, dy = y + 7, dw = W - 12, dh = H - 13;
  rect(dx, dy, dw, dh, b.ink(s(PAL.G2)));
  rect(dx, dy, dw, 1, b.ink(s(PAL.G4))); rect(dx, dy, 1, dh, b.ink(s(PAL.W3)));
  rect(dx, dy + dh - 1, dw, 1, b.ink(s(PAL.G1))); rect(dx + dw - 1, dy, 1, dh, b.ink(s(PAL.N2)));
  // the hinge bolts on the right
  for (const yy of [dy + 6, dy + dh - 14]) { rect(dx + dw - 5, yy, 4, 8, b.ink(s(PAL.G4))); rect(dx + dw - 5, yy + 7, 4, 1, b.ink(s(PAL.N2))); }
  // Q* stencilled in the display face, with the stencil's bridges (1 px gaps through the strokes)
  bigText(b, 'Q*', dx + 4, dy + 4, s(PAL.N2));
  for (const [gx, gy] of [[dx + 9, dy + 4], [dx + 9, dy + 16], [dx + 22, dy + 10]]) { b.set(gx, gy, s(PAL.G2)); b.set(gx, gy + 1, s(PAL.G2)); }
  // the wheel handle, low on the left: a ring, three spokes, the hub; the hall light on its left edges
  const wx = dx + 12, wy = dy + dh - 14;
  for (let j = -10; j <= 10; j++) for (let i = -10; i <= 10; i++) {
    const d = Math.hypot(i, j);
    if (d > 7.2 && d < 9.4) b.set(wx + i, wy + j, s(i < -2 && j < 3 ? PAL.W5 : i < 3 ? PAL.G4 : PAL.G1));
    else if (d >= 9.4 && d < 10.4) b.set(wx + i, wy + j, s(PAL.N1));
  }
  for (const [ax, ay] of [[1, 0], [0.5, 0.87], [-0.5, 0.87]]) for (let t = -7; t <= 7; t++) { b.set(Math.round(wx + ax * t), Math.round(wy + ay * t), s(PAL.G4)); b.set(Math.round(wx + ax * t) + 1, Math.round(wy + ay * t) + 1, s(PAL.N1)); }
  rect(wx - 2, wy - 2, 5, 5, b.ink(s(PAL.G5))); b.set(wx - 1, wy - 1, s(PAL.W6));
  // the sticky note on the door: yellow, a curl at its lower corner, four lines of 7 px type (v4's three lines need a
  // note 67 px wide, wider than this door)
  const n = VAULT_MID.note, ns = (c: number) => (o.noteSharp ? c : s(c));
  const nx = x + n.x, ny = y + n.y;
  rect(nx, ny, n.w, n.h, b.ink(ns(PAL.W7)));
  rect(nx, ny, n.w, 1, b.ink(ns(PAL.W8)));
  rect(nx + n.w - 3, ny + n.h - 3, 3, 3, b.ink(ns(PAL.W6))); b.set(nx + n.w - 1, ny + n.h - 1, s(PAL.G2));
  const lines = ['DO NOT', 'OPEN.', 'DO NOT', 'EXPLAIN.'];
  lines.forEach((l, i) => pt(b, l, nx + Math.round((n.w - pw(l)) / 2), ny + 3 + i * 9, ns(PAL.D1)));
};
/** GERG's hand flat on the vault's door (fingers pointing camera-left), his sleeve in from the right, green-lit
 *  from his open laptop below (gerg-speak gergGlow's greens). (x, y) = the fingertips' left end, the palm's top. */
export const gergHandOnVault = (b: Buf, x: number, y: number, k = 0) => {
  const s = (c: number) => (k ? stepColor(c, -k) : c);
  // four fingers, flat, a knuckle row, the back of the hand, the thumb tucked under
  for (let f = 0; f < 4; f++) { rect(x + f % 2, y + f * 3, 12 - (f === 3 ? 3 : 0), 2, b.ink(s(PAL.S4))); rect(x + f % 2, y + f * 3 + 2, 12 - (f === 3 ? 3 : 0), 1, b.ink(s(PAL.S2))); }
  rect(x + 11, y, 10, 12, b.ink(s(PAL.S3))); rect(x + 11, y, 10, 1, b.ink(s(PAL.S5)));
  rect(x + 12, y + 12, 7, 2, b.ink(s(PAL.S2)));
  for (let j = 0; j < 12; j++) b.set(x + 11, y + j, s(j % 3 === 0 ? PAL.S2 : PAL.S4)); // the knuckles
  // the sleeve (his dark hoodie), green on its underside
  rect(x + 21, y - 2, 24, 16, b.ink(s(PAL.G1))); rect(x + 21, y - 2, 24, 1, b.ink(s(PAL.G3))); rect(x + 21, y + 12, 24, 2, b.ink(s(PAL.L1)));
  rect(x + 21, y - 2, 1, 16, b.ink(s(PAL.G0)));
};
