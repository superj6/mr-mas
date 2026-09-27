// MR. MAS — kit: the WHITE HOUSE props (Ep1 sc 13; new file, owned by the `v3-art-b` pass).
//   drawBlock / drawBlocks   SIRRAH's A and I blocks (her signature prop, show/characters/sirrah.md): primary-coloured,
//                            bevelled alphabet blocks, the letter raised on the front face. Any size (18 px = knee-high
//                            at room scale; 44 px at MCU scale). `order` 'AI' (as set) or 'IA' (restacked: Radnus
//                            knocked them, the class photo). `hit` lights the face the pointer is on for 2 frames.
//   drawTripod               the photographer's tripods, taped `1` / `2` / `3` (room scale), camera on top; `flash`
//                            fires its head (the three cameras fire at once on NEDIB's line)
//   drawCeilingCam           the ceiling's security camera (the wrong camera Radnus looks at)
import {Buf, rect, line, ellipse} from '../px';
import {PAL} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {tiny, tinyWidth} from '../rooms/kit-b';

// ------------------------------------------------------------------ the A and I blocks
export type BlockColour = 'red' | 'blue' | 'yellow';
const BC: Record<BlockColour, {face: number; lit: number; hot: number; side: number; dark: number; top: number; letter: number; letterLit: number}> = {
  red: {face: PAL.R2, lit: PAL.R3, hot: PAL.S6, side: PAL.R1, dark: PAL.R0, top: PAL.R3, letter: PAL.W7, letterLit: PAL.W8},
  blue: {face: PAL.F4, lit: PAL.F5, hot: PAL.F6, side: PAL.F3, dark: PAL.F1, top: PAL.F5, letter: PAL.W7, letterLit: PAL.W8},
  yellow: {face: PAL.W6, lit: PAL.W7, hot: PAL.W8, side: PAL.W4, dark: PAL.W3, top: PAL.W8, letter: PAL.R2, letterLit: PAL.R3},
};
/** the letters' shapes on a 5 x 7 grid (the raised letter is drawn at the block's own scale) */
const LET: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
};
/**
 * One block, its front face `s` px square with its top-left at (x, y), seen a little from above and from camera-left:
 * the top face a lit parallelogram, the right side a darker one. The letter is raised (a lit edge, a shadow edge).
 */
export const drawBlock = (b: Buf, x: number, y: number, s: number, letter: 'A' | 'I', col: BlockColour, o: {hit?: boolean} = {}) => {
  const c = BC[col];
  const d = Math.max(2, Math.round(s * 0.28)); // the depth of the top / side faces
  // the side face (right) and the top face
  for (let j = 0; j < s; j++) for (let i = 1; i <= d; i++) { const yy = y + j - i + 1; b.set(x + s - 1 + i, yy, j < 1 ? c.side : i === d ? c.dark : c.side); }
  for (let j = 1; j <= d; j++) for (let i = 0; i < s; i++) b.set(x + i + j - 1, y - j, j === d || i === 0 ? c.lit : c.top);
  // the front face with a bevel: a lit top-left edge, a dark bottom-right edge, the inner square a step in
  rect(x, y, s, s, b.ink(o.hit ? c.lit : c.face));
  const bev = Math.max(1, Math.round(s / 14));
  rect(x, y, s, bev, b.ink(c.hot)); rect(x, y, bev, s, b.ink(c.lit));
  rect(x, y + s - bev, s, bev, b.ink(c.dark)); rect(x + s - bev, y, bev, s, b.ink(c.side));
  rect(x + bev + 1, y + bev + 1, s - 2 * bev - 2, 1, b.ink(c.lit));
  // the raised letter, centred, at an integer cell size
  const cell = Math.max(1, Math.floor((s - 4 * bev) / 8));
  const lw = 5 * cell, lh = 7 * cell;
  const lx = x + Math.floor((s - lw) / 2), ly = y + Math.floor((s - lh) / 2);
  LET[letter].forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') {
    rect(lx + i * cell, ly + j * cell, cell, cell, b.ink(c.letter));
    if (cell > 1) { rect(lx + i * cell, ly + j * cell, cell, 1, b.ink(c.letterLit)); }
  } });
  // the letter's drop shadow toward bottom-right (it is raised)
  LET[letter].forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') {
    const X = lx + (i + 1) * cell, Y = ly + (j + 1) * cell;
    if (!(r[i + 1] === '#') && i < 4) rect(X, ly + j * cell + 1, 1, cell, b.ink(c.dark));
    if (i === 4) rect(X, ly + j * cell + 1, 1, cell, b.ink(c.dark));
    if (!(LET[letter][j + 1]?.[i] === '#')) rect(lx + i * cell + 1, Y, cell, 1, b.ink(c.dark));
  } });
};
/**
 * The pair, standing on a floor at (x, floorY): A red, I blue, side by side, a small gap. `order` 'IA' is the
 * restack (the I first, knocked a few px askew). Returns the two face centres (for the pointer's aim).
 */
export const drawBlocks = (b: Buf, x: number, floorY: number, s: number, o: {order?: 'AI' | 'IA'; hit?: 'A' | 'I' | null} = {}): {A: [number, number]; I: [number, number]} => {
  const gap = Math.max(2, Math.round(s * 0.16));
  const d = Math.max(2, Math.round(s * 0.28));
  const first = (o.order ?? 'AI') === 'AI' ? 'A' : 'I';
  const second = first === 'A' ? 'I' : 'A';
  const col = (l: 'A' | 'I'): BlockColour => (l === 'A' ? 'red' : 'blue');
  const y = floorY - s;
  // contact shadows on the floor (away from the key: right)
  for (let i = 0; i < 2 * s + gap + d + 3; i++) b.set(x + i + 2, floorY, PAL.N0);
  const x2 = x + s + gap + d;
  const skew = o.order === 'IA' ? 1 : 0;
  drawBlock(b, x, y + skew, s, first, col(first), {hit: o.hit === first});
  drawBlock(b, x2, y, s, second, col(second), {hit: o.hit === second});
  const cA: [number, number] = [first === 'A' ? x + s / 2 : x2 + s / 2, y + s / 2];
  const cI: [number, number] = [first === 'I' ? x + s / 2 : x2 + s / 2, y + s / 2];
  return {A: [Math.round(cA[0]), Math.round(cA[1])], I: [Math.round(cI[0]), Math.round(cI[1])]};
};

// ------------------------------------------------------------------ the photographer's tripods
/**
 * A tripod at room scale (feet on floorY at x), its head `h` px up, a camera on it facing away from us (toward the
 * row), gaffer tape with its number on the centre post. `flash` 0 none · 1 the head fires (a white burst) · 2 its
 * afterglow.
 */
export const drawTripod = (b: Buf, x: number, floorY: number, n: 1 | 2 | 3, o: {h?: number; flash?: 0 | 1 | 2} = {}) => {
  const h = o.h ?? 46;
  const top = floorY - h;
  const leg = (dx: number, c: number) => line(x, top + 6, x + dx, floorY, b.ink(c));
  leg(-11, PAL.N1); leg(11, PAL.N2); leg(2, PAL.N0);
  line(x - 10, floorY, x - 12, floorY, b.ink(PAL.N0)); line(x + 10, floorY, x + 12, floorY, b.ink(PAL.N0));
  // the centre post and its tape, the number on the tape
  rect(x - 1, top + 4, 2, 22, b.ink(PAL.N0));
  rect(x - 4, top + 14, 9, 7, b.ink(PAL.P1)); rect(x - 4, top + 14, 9, 1, b.ink(PAL.P2)); rect(x - 4, top + 20, 9, 1, b.ink(PAL.P0));
  tiny(b, String(n), x - 1, top + 15, PAL.N1);
  // the camera body on its head (seen from behind: the body, the viewfinder hump, the lens hood's rim beyond)
  rect(x - 7, top - 7, 15, 10, b.ink(PAL.N1));
  rect(x - 7, top - 7, 15, 1, b.ink(PAL.G3)); rect(x - 7, top - 7, 1, 10, b.ink(PAL.G2));
  rect(x - 3, top - 10, 6, 3, b.ink(PAL.N1)); rect(x - 3, top - 10, 6, 1, b.ink(PAL.G3));
  rect(x - 5, top - 5, 4, 3, b.ink(PAL.N0)); b.set(x - 4, top - 4, PAL.C3); // the rear screen, lit
  if (o.flash) {
    // the flash head on its hot shoe, firing toward the row: a white core and a stepped burst
    const fx = x + 3, fy = top - 13;
    rect(fx - 2, fy, 5, 3, b.ink(PAL.G4));
    if (o.flash === 1) {
      ellipse(fx, fy - 2, 9, 6, b.ink(PAL.W8));
      ellipse(fx, fy - 2, 5, 3.5, b.ink(PAL.W9));
      for (const [dx, dy] of [[-13, -2], [13, -2], [0, -10], [-9, -8], [9, -8]] as Array<[number, number]>) line(fx, fy - 2, fx + dx, fy - 2 + dy, b.ink(PAL.W9));
    } else ellipse(fx, fy - 1, 3, 2, b.ink(PAL.W7));
  }
};

// ------------------------------------------------------------------ the ceiling camera
/** the security camera's dome under the ceiling (top-right of the room): a black glass dome, a red tally LED */
export const drawCeilingCam = (b: Buf, x: number, y: number, f = 0) => {
  rect(x - 5, y, 11, 2, b.ink(PAL.P0));
  for (let j = 0; j < 6; j++) for (let i = -5; i <= 5; i++) if (Math.hypot(i / 5.4, j / 6) <= 1) b.set(x + i, y + 2 + j, j < 2 && i < -1 ? PAL.G3 : PAL.N1);
  b.set(x - 2, y + 3, PAL.G5);
  if (Math.floor(f / 24) % 2 === 0) b.set(x + 2, y + 6, PAL.R3);
};

void text; void textWidth; void bigText; void bigTextWidth; void tinyWidth;

// ------------------------------------------------------------------ the flame at insert scale
/**
 * A candle-sized flame drawn at insert scale (props.ts `fire` tops out at room scale): a teardrop in stepped rings
 * (white core, gold, orange, a red lick at the edge), its tip swaying in 3 held drawings on 3s. `h` its height in px,
 * base centre at (x, baseY).
 */
export const drawBigFlame = (b: Buf, x: number, baseY: number, h: number, f: number) => {
  const k = Math.floor(f / 3) % 3;
  const sway = [0, 2, -1][k], lean = [0, 1, -1][k];
  const w = h * 0.34;
  for (let j = 0; j < h; j++) {
    const t = j / h; // 0 base .. 1 tip
    const half = w * Math.sin(Math.PI * Math.min(1, (1 - t) * 1.15)) * (t < 0.2 ? 0.75 + t : 1);
    const cx = x + sway * t * t + lean * t;
    for (let i = Math.floor(cx - half); i <= Math.ceil(cx + half); i++) {
      const u = Math.abs(i + 0.5 - cx) / Math.max(0.6, half);
      if (u > 1) continue;
      const r = Math.hypot(u, (t - 0.28) * 1.6);
      const c = r < 0.34 ? PAL.W9 : r < 0.55 ? PAL.W8 : r < 0.78 ? PAL.W7 : u > 0.86 && t > 0.3 ? PAL.R3 : PAL.W6;
      b.set(i, baseY - j, c);
    }
  }
  // the blue root where it sits on the cloth, and a spark above on one drawing
  for (let i = -2; i <= 2; i++) b.set(x + i, baseY, i === 0 ? PAL.C6 : PAL.N6);
  if (k === 1) b.set(x + 3, baseY - h - 3, PAL.W7);
};
