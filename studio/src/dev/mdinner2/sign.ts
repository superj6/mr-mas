// MR. MAS — mdinner2: the neon sign, OPEN AI -> NOPE AI.
// Letters are hand-placed 1px tube SKELETONS; the look is built from them in three rings: the hot core
// (the skeleton), the glass tube (4-neighbour ring), and an ordered-dither glow (two more rings, sparse).
// The letters hang on a rail from two chains. Slot 0 (the front) is empty: the N slides into it.
import {Buf, bayer, rect, PAL, ALL_COLORS, SKIN_COLORS, lightness, compilePalette, Mask} from '../../shared/pixel';

// 9 x 15 skeletons (N is generated: a clean whole-pixel diagonal between the stems)
const nRows = () => Array.from({length: 15}, (_, r) => {
  const c = Math.round((r * 8) / 14);
  return Array.from({length: 9}, (_, i) => (i === 0 || i === 8 || i === c ? '#' : '.')).join('');
});
const SK: Record<string, string[]> = {
  O: ['..#####..', '.#.....#.', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '.#.....#.', '..#####..'],
  P: ['#######..', '#......#.', '#.......#', '#.......#', '#.......#', '#......#.', '#######..', '#........', '#........', '#........', '#........', '#........', '#........', '#........', '#........'],
  E: ['#########', '#........', '#........', '#........', '#........', '#........', '#........', '#######..', '#........', '#........', '#........', '#........', '#........', '#........', '#########'],
  N: nRows(),
  A: ['...###...', '..#...#..', '.#.....#.', '#.......#', '#.......#', '#.......#', '#.......#', '#########', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
};
export const SIGN = {
  /** slot pitch and letter cap height (skeleton) */
  pitch: 14, cap: 15,
  /** local x of slot k (letters are 9 wide); slot 0 is the empty front hook */
  slotX: (k: number) => 4 + k * 14,
  /** A and I hang after a word gap */
  aX: 4 + 4 * 14 + 9 + 8, iX: 4 + 4 * 14 + 9 + 8 + 9 + 5,
  w: 4 + 4 * 14 + 9 + 8 + 9 + 5 + 5 + 4,
  /** rail (local y) and the letters' top */
  railY: 0, letterY: 5,
  h: 22,
};
type Tint = {core: number; tube: number; glow1: number; glow2: number};
const RED: Tint = {core: PAL.W8, tube: PAL.R3, glow1: PAL.R2, glow2: PAL.R1};
const CYAN: Tint = {core: PAL.C9, tube: PAL.C6, glow1: PAL.C4, glow2: PAL.C2};
const DARK: Tint = {core: PAL.G3, tube: PAL.G2, glow1: -1, glow2: -1};

/** One neon letter at (x, y) = top-left of its skeleton. `buzz` thins the glow for a flicker frame. */
export const neonLetter = (b: Buf, ch: string, x: number, y: number, t: Tint, buzz = 0, mask?: (x: number, y: number) => void) => {
  const sk = SK[ch];
  const w = sk[0].length, h = sk.length;
  const on = (i: number, j: number) => i >= 0 && j >= 0 && i < w && j < h && sk[j][i] === '#';
  const R = 3;
  for (let j = -R; j < h + R; j++)
    for (let i = -R; i < w + R; i++) {
      let d = 9;
      if (on(i, j)) d = 0;
      else for (let k = 1; k <= R && d === 9; k++) {
        for (let dj = -k; dj <= k && d === 9; dj++) for (let di = -k; di <= k; di++) if (Math.abs(di) + Math.abs(dj) <= k && on(i + di, j + dj)) { d = k; break; }
      }
      if (d > R) continue;
      const X = x + i, Y = y + j;
      let c = -1;
      if (d === 0) c = t.core;
      else if (d === 1) c = t.tube;
      else if (d === 2 && t.glow1 >= 0 && bayer(X, Y) < (buzz ? 0.25 : 0.5)) c = t.glow1;
      else if (d === 3 && t.glow2 >= 0 && bayer(X, Y) < (buzz ? 0.06 : 0.19)) c = t.glow2;
      if (c < 0) continue;
      b.set(X, Y, c);
      mask?.(X, Y);
    }
};

export interface SignState {
  /** x offset of the N from its home slot (4) in px; whole pixels. Home = 0, front = -40 */
  nDx: number;
  /** N lifted off the rail (px) */
  nLift: number;
  /** OPEN lit (0 dark, 1 lit, 2 buzzing thin) */
  open: 0 | 1 | 2;
  /** AI lit */
  ai: 0 | 1 | 2;
  /** AI's slide along the rail (px, whole pixels; the N's landing jolts it into the gap) */
  aiDx?: number;
  /** whole-pixel swing offset of the sign from its rest spot (two parallel chains keep it level) */
  sx: number;
  sy: number;
}

/**
 * Draw the sign hanging from the ceiling. (x, y) = top-left of the rail at rest (world->screen converted by
 * the caller). chainTop = screen y of the chain anchors. `mask` records coverage (the sign is "live" in a freeze).
 */
/** `onN(true)` is called before the N (and its hook) is drawn and `onN(false)` after: the caller can hand the N to
 *  another owner (Mas takes it inside the freeze: it keeps his colour while the sign prints). */
export const drawSign = (b: Buf, x: number, y: number, chainTop: number, s: SignState, mask?: (x: number, y: number) => void, onN?: (start: boolean) => void) => {
  const X = x + s.sx, Y = y + s.sy;
  const put = (px: number, py: number, c: number) => { b.set(px, py, c); mask?.(px, py); };
  // two chains from fixed ceiling anchors to the rail ends: straight whole-pixel lines, alternating links
  for (const [ax, rx] of [[x + 6, X + 6], [x + SIGN.w - 7, X + SIGN.w - 7]]) {
    const n = Math.max(Math.abs(rx - ax), Math.abs(Y - chainTop));
    for (let k = 0; k < n; k++) {
      const px = Math.round(ax + ((rx - ax) * k) / n), py = Math.round(chainTop + ((Y - chainTop) * k) / n);
      if (k % 3 === 2) continue;
      put(px, py, k % 3 === 0 ? PAL.G4 : PAL.G2);
    }
  }
  // rail: a dark bar with a lit top edge, end caps
  rect(X, Y + SIGN.railY, SIGN.w, 2, b.ink(PAL.N1));
  for (let i = 0; i < SIGN.w; i++) { put(X + i, Y + SIGN.railY, i % 7 === 0 ? PAL.G5 : PAL.G3); put(X + i, Y + SIGN.railY + 1, PAL.N1); }
  put(X - 1, Y, PAL.G2); put(X - 1, Y + 1, PAL.N1); put(X + SIGN.w, Y, PAL.G2); put(X + SIGN.w, Y + 1, PAL.N1);
  const openT = s.open === 0 ? DARK : RED, aiT = s.ai === 0 ? DARK : CYAN;
  const hook = (lx: number, ly: number) => { put(lx + 4, Y + 2, PAL.G4); for (let k = Y + 3; k < ly - 1; k++) put(lx + 4, k, PAL.G3); };
  const ly = Y + SIGN.letterY;
  const nx = X + SIGN.slotX(4) + s.nDx, ny = ly - s.nLift;
  const drawN = () => {
    onN?.(true);
    put(nx + 4, Y + 2 - s.nLift, PAL.G4);
    for (let k = Y + 3 - s.nLift; k < ny - 1; k++) put(nx + 4, k, PAL.G3);
    neonLetter(b, 'N', nx, ny, openT, s.open === 2 ? 1 : 0, mask);
    onN?.(false);
  };
  // while it travels, the N rides the back of the rail: O, P, E stay in front of it
  const moving = s.nDx < 0 && s.nDx > -(SIGN.slotX(4) - SIGN.slotX(0));
  if (moving) drawN();
  hook(X + SIGN.slotX(0), ly); // the empty front hook: room for exactly one letter
  (['O', 'P', 'E'] as const).forEach((ch, k) => { hook(X + SIGN.slotX(k + 1), ly); neonLetter(b, ch, X + SIGN.slotX(k + 1), ly, openT, s.open === 2 ? 1 : 0, mask); });
  const ad = s.aiDx ?? 0;
  hook(X + SIGN.aX + ad, ly); neonLetter(b, 'A', X + SIGN.aX + ad, ly, aiT, s.ai === 2 ? 1 : 0, mask);
  neonLetter(b, 'I', X + SIGN.iX + ad, ly, aiT, s.ai === 2 ? 1 : 0, mask);
  if (!moving) drawN();
};

/** where the N's top-centre is (for Mas's hand), in the same coords as drawSign */
export const nHandle = (x: number, y: number, s: SignState): [number, number] => [x + s.sx + SIGN.slotX(4) + s.nDx + 4, y + s.sy + SIGN.letterY - s.nLift + 15];

// ================================================================== the neon's light on the running room
// The tubes light what is near them. It is a per-colour LUT (a palette operation, no blending) at two strengths,
// matched by OKLab lightness into the tube's own ramp: NEAR the letters every colour takes the tube's hue (skin
// goes to the warm skin ramp under red, the cyan-skin ramp under cyan, so faces stay faces); FARTHER out only
// the shadows fill with the tube's colour and the lit surfaces keep their light. The soft masks resolve as an
// ordered-dither falloff at the edge of the light.
const L_OF = new Map(ALL_COLORS.map((c) => [c, lightness(c)] as const));
const SKIN = new Set(SKIN_COLORS);
const byL = (L: number, pool: number[]) => { let best = pool[0], bd = Infinity; for (const c of pool) { const d = Math.abs(L_OF.get(c)! - L); if (d < bd) { bd = d; best = c; } } return best; };
const TUBE_POOL = {
  red: {ramp: [PAL.N0, PAL.W0, PAL.R0, PAL.W1, PAL.Q0, PAL.W2, PAL.R1, PAL.Q1, PAL.U3, PAL.U4, PAL.R2, PAL.W4, PAL.U5, PAL.R3, PAL.Q2, PAL.W5, PAL.W6, PAL.W7, PAL.W8], skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6]},
  cyan: {ramp: [PAL.N0, PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5, PAL.C6, PAL.C7, PAL.C8, PAL.C9], skin: [PAL.K0, PAL.K1, PAL.K2, PAL.K3, PAL.K4, PAL.K5]},
};
/** the tint LUT for one tube: near = everything takes the hue; far = only colours darker than `shadow` do */
export const tintLUT = (tube: 'red' | 'cyan', near: boolean, lift = 0.04, shadow = 0.34): Array<[number, number]> => {
  const P = TUBE_POOL[tube];
  const out: Array<[number, number]> = [];
  for (const c of ALL_COLORS) {
    const L = L_OF.get(c)!;
    if (!near && (L > shadow || SKIN.has(c))) continue;
    const nL = L + (1 - L) * lift;
    const n = byL(nL, SKIN.has(c) ? P.skin : P.ramp);
    if (n !== c) out.push([c, n]);
  }
  return out;
};
const spillSet = (tube: 'red' | 'cyan', near: boolean) =>
  compilePalette({id: `spill-${tube}-${near ? 'near' : 'far'}`, label: `neon spill (${tube})`, use: 'the neon lights the running room', colors: [], mode: 'identity', pin: tintLUT(tube, near, near ? 0.08 : 0.03)});
export const SPILL = {
  red: {near: spillSet('red', true), far: spillSet('red', false)},
  cyan: {near: spillSet('cyan', true), far: spillSet('cyan', false)},
};
/** soft box coverage around [x0, x1] x [y0, y1] with a falloff of rx, ry px */
export const boxFalloff = (x0: number, y0: number, x1: number, y1: number, rx: number, ry: number, gain = 1) =>
  Mask.from((x, y) => {
    const dx = Math.max(0, x0 - x, x - x1) / rx, dy = Math.max(0, y0 - y, y - y1) / ry;
    return Math.max(0, Math.min(1, (1 - Math.hypot(dx, dy)) * gain));
  });
