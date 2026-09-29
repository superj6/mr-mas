// MR. MAS — mcoldopen: the MEDIUM two-shot. The monitor (screen 1:1, the caret exactly where the LCD macros
// held it), Mas cropped at mid-chest in the approved 3/4 portrait, lit only by that screen, and the Orb
// hanging at his far shoulder. Behind him: the window, the city, and the dark.
// Staging cheat (standard 2D grammar): the monitor is turned just enough toward him to show its left side
// panel, but its face is kept square to camera so the post stays legible.
import {Buf, rect, line, hash, bayer, poly} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {blitImg, Img} from '../../shared/pixel/figure';
import {masPortrait, MasPortraitState} from '../../shared/pixel/cast/mas';
import {screenAt, SW, SH, CARET_HOME} from './screen';
import {drawOrb, orbLookAt, orbBob} from '../../shared/pixel/cast/orb';
import {boxPool, ringPool, litWindows, shearTop, vignette} from './paint';
import {EV, L1_KEYS, L2_KEYS, L2_BREAK} from './timeline';

/** caret home in FRAME coords: the fixed point of the stepped dolly-out (macros centre on it too) */
export const CARET_FRAME: [number, number] = [96, 76];
export const MED = {
  screen: [CARET_FRAME[0] - CARET_HOME[0], CARET_FRAME[1] - CARET_HOME[1]] as [number, number], // (80, 44)
  mas: [296, 76] as [number, number],
  orb: [432, 112] as [number, number],
  orbR: 18,
  win: {x0: 318, x1: 480, y0: 0, y1: 226, mx: 406, my: 46},
  /** the desk top's far edge (Mas sits behind it; his keyboard is on a tray below it) */
  deskY: 228,
  glass: {x: 270, y: 194, w: 13, h: 46},
};
const SX = MED.screen[0], SY = MED.screen[1];
const BZ = {x0: SX - 4, y0: SY - 4, x1: SX + SW + 3, y1: SY + SH + 7}; // bezel (inclusive)

// ------------------------------------------------------------------ Mas (portrait + hand-painted torso + tilt)
/**
 * The portrait is a 112x136 bust; below its crop the hoodie is painted here in flat planes (no dither): the near
 * arm's monitor-lit rim and front plane, the crease into the chest, one diagonal fold off the near shoulder, the
 * kangaroo pocket's seam and side openings just above the desk, the far arm with its cool back rim. The forearms and
 * hands are drawn separately, over the desk (see drawHands).
 */
const TORSO_FROM = 124; // local row where the painting takes over from the portrait
const paintTorso = (src: Img, n: number): Img => {
  const H = src.h + n;
  const out: Img = {w: src.w, h: H, c: new Int32Array(src.w * H).fill(-1)};
  out.c.set(src.c.subarray(0, TORSO_FROM * src.w));
  const put = (x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < out.w && y < H) out.c[y * out.w + x] = c; };
  const get = (x: number, y: number) => (x < 0 || y < 0 || x >= out.w || y >= H ? -1 : out.c[y * out.w + x]);
  // 1) continue every column of the portrait's last row straight down (no seam), the silhouette flaring 1px
  const row = TORSO_FROM - 1;
  for (let x = 0; x < src.w; x++) {
    const c = src.c[row * src.w + x];
    if (c < 0) continue;
    for (let y = TORSO_FROM; y < H; y++) put(x, y, c);
  }
  let xl = 0, xr = src.w - 1;
  while (xl < src.w && src.c[row * src.w + xl] < 0) xl++;
  while (xr > 0 && src.c[row * src.w + xr] < 0) xr--;
  for (let y = TORSO_FROM + 14; y < H; y++) { put(xl - 1, y, get(xl, y)); put(xr + 1, y, get(xr, y)); }
  // 2) hand-placed planes: the chest turns away from the monitor below a diagonal (one flat rung down),
  //    the crease between the near arm and the chest, a fold falling off the near shoulder toward the pocket
  const cL = xl + 22, cR = xr - 18;
  for (let y = TORSO_FROM; y < H; y++) {
    const j = y - TORSO_FROM;
    put(cL + (j >> 3), y, PAL.N1);
    put(cR - (j >> 4), y, PAL.N1);
    const fx = cL + 5 + Math.floor(j * 0.7);
    if (j < 18) { put(fx, y, PAL.N1); put(fx - 1, y, PAL.G1); }
  }
  // 3) the kangaroo pocket's top seam, just above the desk edge (half hidden by his forearms)
  const py = H - 6;
  for (let x = cL + 9; x < cR - 6; x++) { const yy = py - (x > cL + 18 && x < cR - 16 ? 1 : 0); put(x, yy, PAL.N0); if (x < cL + 26) put(x, yy - 1, PAL.G1); }
  return out;
};

/**
 * The head tilt (the pause, f63): a drawn 2-3px roll toward the window, made of whole-pixel row and column
 * shears on the head and neck only (the body does not move): the crown steps 3px right, the far side of the head
 * drops 1px, the near side lifts 1px. Every step is a clean 1px seam, so the pixel clusters survive.
 */
const tiltHead = (img: Img, yNeck: number): Img => {
  const out: Img = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  const px = 58;
  for (let y = 0; y < yNeck; y++)
    for (let x = 0; x < img.w; x++) {
      const dx = Math.floor((yNeck - y) / 30); // 0..3 px to the right toward the crown
      const dy = x - px > 20 ? 1 : x - px < -22 ? -1 : 0;
      const sx = x - dx, sy = y - dy;
      out.c[y * img.w + x] = sx >= 0 && sx < img.w && sy >= 0 && sy < yNeck ? img.c[sy * img.w + sx] : -1;
    }
  return out;
};

/** The click (f112): the near (mouse) shoulder dips 1px, the rows below the collar on the camera-left half. */
const dipShoulder = (img: Img, fromRow: number, splitX: number, d: number): Img => {
  const out: Img = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  for (let y = img.h - 1; y >= fromRow; y--)
    for (let x = 0; x < splitX; x++) out.c[y * img.w + x] = y - d >= fromRow ? img.c[(y - d) * img.w + x] : img.c[fromRow * img.w + x];
  return out;
};

const masCache = new Map<string, Img>();
export const masMedium = (s: MasPortraitState, tilt: boolean, dip = 0): Img => {
  const key = JSON.stringify(s) + tilt + dip;
  let img = masCache.get(key);
  if (!img) {
    img = paintTorso(masPortrait(s), MED.deskY - MED.mas[1] - 136 + 2);
    if (tilt) img = tiltHead(img, 96);
    if (dip) img = dipShoulder(img, 100, 50, dip);
    masCache.set(key, img);
  }
  return img;
};

export const masPortraitAt = (f: number): {s: MasPortraitState; tilt: boolean; dip: number} => {
  const lid = f === EV.blink || f === EV.blink + 2 ? 1 : f === EV.blink + 1 ? 2 : 0;
  const front = f >= EV.eyeSnap;
  return {
    // the look to the lens (f94) is a swapped drawing: the near-front head, held through the Post
    s: {mouth: f >= EV.smile ? 'smile' : 'rest', lid: lid as 0 | 1 | 2, look: front ? 0 : -1, brow: 0, light: 'monitor', head: front ? 'front' : '34'},
    tilt: f >= EV.tilt && !front,
    dip: f === EV.click || f === EV.click + 1 ? 1 : 0,
  };
};

// ------------------------------------------------------------------ his hands at the desk line (typing on 2s)
const ALL_KEYS = [...L1_KEYS, L2_BREAK, ...L2_KEYS];
export type HandState = {near: 'rest' | 'typeA' | 'typeB' | 'lift' | 'mouse' | 'click'; far: 'rest' | 'typeA' | 'typeB'};
export const handsAt = (f: number): HandState => {
  const typing = ALL_KEYS.some((k) => f >= k - 1 && f <= k);
  const t: 'typeA' | 'typeB' = Math.floor(f / 2) % 2 ? 'typeB' : 'typeA';
  if (f >= EV.pointer[0] && f < EV.pointer[0] + 2) return {near: 'lift', far: 'rest'};
  if (f === EV.click || f === EV.click + 1) return {near: 'click', far: 'rest'};
  if (f >= EV.pointer[0]) return {near: 'mouse', far: 'rest'};
  if (typing) return {near: t, far: t === 'typeA' ? 'typeB' : 'typeA'};
  return {near: 'rest', far: 'rest'};
};

// hands: z outline, L lit (K3), K mid (K2), k dark (K1), x shadow (X1), F lit fingertip
const HAND_PAL: Record<string, number> = {z: PAL.N0, L: PAL.K3, K: PAL.K2, k: PAL.K1, x: PAL.X1, F: PAL.K3};
// seen from the front and a little above, curled on the keys (about 0.4 of his face's width)
const NEAR_BASE = [
  '...zzzzzz........',
  '.zzLLLLKKzz......',
  'zLLLLLKKKKKz.....',
  'zLLLLKKKKKkkz....',
  'zLLKKKKKKkkkz....',
  '.zKKKKKkkkkkz....',
];
const FINGERS: Record<string, string[]> = {
  rest: ['.zLKzLKzKkzkkz...', '..zz.zz.zz.zz....'],
  A: ['.zLKzLKzKkzkkz...', '..zz.zzKzz.zz....', '.......z.........'],
  B: ['.zLKzLKzKkzkkz...', '..zz.zz.zzkzz....', '..........z......'],
};
const NEAR_MOUSE = ['...zzzzzz........', '.zzLLLLKKzz......', 'zLLLLLKKKKKz.....', 'zLLLLKKKKKkz.....', '.zKKKKKkkkkz.....', '..zLKzKkzkz......', '...zz.zz.z.......'];
const NEAR_CLICK = ['.................', '...zzzzzz........', '.zzLLLLKKzz......', 'zLLLLLKKKKKz.....', 'zLLLLKKKKKkz.....', '.zKKKKKkkkkz.....', '..zLKzKkzkz......', '..zzz.zz.z.......'];
const NEAR_LIFT = ['...zzzzzz........', '..zLLLKKKz.......', '.zLLLKKKKkz......', '.zLKKKKkkkz......', '..zKkkkkkz.......', '...zzzzzz........'];
const FAR_BASE = [
  '........zzzzzz...',
  '......zzKKKkkzz..',
  '.....zKKKKkkkkxz.',
  '....zKKKkkkkkxxz.',
  '....zKkkkkkxxxxz.',
  '....zkkkkkxxxxz..',
];
const FAR_F: Record<string, string[]> = {
  rest: ['...zKkzkkzkkzxz..', '....zz.zz.zz.zz..'],
  A: ['...zKkzkkzkkzxz..', '....zz.zzkzz.zz..', '.........z.......'],
  B: ['...zKkzkkzkkzxz..', '....zz.zz.zzxzz..', '............z....'],
};
const stampMap = (b: Buf, rows: string[], x: number, y: number) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = HAND_PAL[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });

/**
 * A forearm lying on the desk, from the elbow at the torso's side toward the keys (foreshortened: it comes at the
 * lens). A rounded sleeve: a lit rim on the monitor side, the mid plane, a darker underside, a fold at the elbow and
 * the rib cuff at the wrist.
 */
const sleeve = (b: Buf, elbow: [number, number], wrist: [number, number], w0: number, w1: number, lit: boolean) => {
  const [x0, y0] = elbow, [x1, y1] = wrist;
  const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0)));
  for (let s = 0; s <= n * 2; s++) {
    const t = s / (n * 2);
    const cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t;
    const w = w0 + (w1 - w0) * t;
    // the cross-section is drawn as a vertical span (the arm lies on the desk; its top faces up and toward camera)
    if (Math.abs(y1 - y0) > Math.abs(x1 - x0) * 1.2) {
      // a steep (foreshortened) forearm: horizontal spans, lit on the monitor side (left for the near arm)
      const l = Math.round(cx - w / 2), r = Math.round(cx + w / 2), y = Math.round(cy);
      for (let x = l; x <= r; x++) {
        const u = (x - l) / Math.max(1, r - l);
        let c = lit ? (u < 0.18 ? PAL.C4 : u < 0.4 ? PAL.C2 : u < 0.8 ? PAL.G2 : PAL.G1) : (u < 0.5 ? PAL.G1 : PAL.G0);
        if (x === r) c = PAL.N0;
        if (t > 0.86) c = x === l ? (lit ? PAL.C3 : PAL.G2) : x === r ? PAL.N0 : PAL.G0;
        b.set(x, y, c);
      }
      continue;
    }
    const top = Math.round(cy - w / 2), bot = Math.round(cy + w / 2);
    const x = Math.round(cx);
    for (let y = top - 1; y <= bot; y++) {
      if (y === top - 1) { b.set(x, y, PAL.N0); continue; } // a dark seam where the arm lies over the body
      const u = (y - top) / Math.max(1, bot - top); // 0 top .. 1 underside
      let c = lit ? (u < 0.2 ? PAL.C4 : u < 0.42 ? PAL.C2 : u < 0.8 ? PAL.G2 : PAL.G1) : (u < 0.2 ? PAL.C2 : u < 0.5 ? PAL.G2 : u < 0.85 ? PAL.G1 : PAL.G0);
      if (y === bot) c = PAL.N0;
      if (t > 0.86) c = y === top ? (lit ? PAL.C3 : PAL.G2) : y === bot ? PAL.N0 : PAL.G0; // the rib cuff
      if (t > 0.2 && t < 0.25 && u > 0.35 && u < 0.8) c = PAL.G0; // the fold at the elbow
      b.set(x, y, c);
    }
  }
};

export const KEYBOARD = {x: 306, y: 235, w: 80, h: 8};
export const MOUSE = {x: 293, y: 237};
const drawKeyboard = (b: Buf) => {
  const {x, y, w, h} = KEYBOARD;
  rect(x, y, w, h, b.ink(PAL.N1));
  for (let i = 0; i < w; i++) b.set(x + i, y, i < 40 ? PAL.C2 : PAL.C1); // the back edge catches the screen
  for (let r = 0; r < 3; r++)
    for (let k = x + 2 + (r % 2) * 2; k < x + w - 3; k += 4) {
      rect(k, y + 1 + r * 2, 3, 1, b.ink(k < x + 36 ? PAL.G1 : PAL.G0)); // key tops
      b.set(k + 3, y + 1 + r * 2, PAL.N0);
    }
  rect(x, y + h - 1, w, 1, b.ink(PAL.G0));
  rect(x + 2, y + h, w - 1, 1, b.ink(PAL.N0)); // contact shadow
};
const drawMouse = (b: Buf) => {
  const {x, y} = MOUSE;
  const rows = ['.zzzzz.', 'zCcNNNz', 'zcNNNNz', 'zNNNNNz', '.zzzzz.'];
  const pal: Record<string, number> = {z: PAL.N0, C: PAL.C3, c: PAL.C1, N: PAL.N1};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};

/** Forearms, hands, the keyboard and the mouse: drawn over the desk top (they are nearer than its far edge). */
export const drawHands = (b: Buf, f: number) => {
  const h = handsAt(f);
  const dip = h.near === 'click' ? 1 : 0;
  drawKeyboard(b);
  drawMouse(b);
  // far forearm (camera-right, the body's shadow side) and hand, on the keys' right half
  const fy = h.far === 'typeA' || h.far === 'typeB' ? (h.far === 'typeA' ? 1 : 0) : 0;
  sleeve(b, [402, 219], [374, 233 + fy], 11, 8, false);
  stampMap(b, [...FAR_BASE, ...FAR_F[h.far === 'rest' ? 'rest' : h.far === 'typeA' ? 'A' : 'B']], 356, 227 + fy);
  // near forearm (camera-left, his mouse hand): on the keys, a lift (106-107), then on the mouse and the click
  const wrist: Record<HandState['near'], [number, number]> = {rest: [327, 231], typeA: [327, 232], typeB: [327, 231], lift: [309, 229], mouse: [300, 232], click: [300, 233]};
  const [wx, wy] = wrist[h.near];
  sleeve(b, [299, 218 + dip], [wx, wy], 12, 8, true);
  if (h.near === 'mouse') stampMap(b, NEAR_MOUSE, 291, 229);
  else if (h.near === 'click') stampMap(b, NEAR_CLICK, 291, 229);
  else if (h.near === 'lift') stampMap(b, NEAR_LIFT, 297, 225);
  else stampMap(b, [...NEAR_BASE, ...FINGERS[h.near === 'rest' ? 'rest' : h.near === 'typeA' ? 'A' : 'B']], 325, 226 + (h.near === 'typeA' ? 1 : 0));
};

// ------------------------------------------------------------------ the set
const inWindow = (x: number, y: number) => x >= MED.win.x0 && x < MED.win.x1 && y >= MED.win.y0 && y <= MED.win.y1;

const drawCity = (b: Buf, f: number) => {
  const {x0, x1, y1} = MED.win;
  // sky: dark overhead, the city's own glow thickening toward the horizon (stepped, seams dithered)
  for (let y = 0; y <= y1; y++)
    for (let x = x0; x < x1; x++) {
      const t = y / y1 + (bayer(x, y) - 0.5) * 0.09;
      b.set(x, y, t < 0.42 ? PAL.N2 : t < 0.7 ? PAL.N3 : t < 0.88 ? PAL.N4 : PAL.N5);
    }
  // far towers (haze: lighter, sparse lights), then near towers (dark, more lights)
  const far: Array<[number, number, number]> = [[318, 150, 16], [336, 128, 12], [350, 160, 20], [372, 118, 10], [384, 140, 18], [410, 96, 14], [426, 132, 16], [446, 110, 12], [460, 146, 22]];
  for (const [bx, top, w] of far) {
    rect(bx, top, w, y1 - top + 1, b.ink(PAL.N3));
    litWindows(b, bx, top, w, y1 - top, bx * 7 + 1, f, {px: 3, py: 4, density: 0.12, warm: 0.4});
  }
  // the tallest far tower wears a gothic spire (it will be the NOPEAI cathedral): a lit tip, never explained
  const sx = 414;
  poly([sx, 96, sx + 6, 96, sx + 3, 78], b.ink(PAL.N3));
  line(sx + 3, 78, sx + 3, 70, b.ink(PAL.N3));
  if (Math.floor(f / 12) % 2 === 0) b.set(sx + 3, 69, PAL.C5);
  const near: Array<[number, number, number]> = [[318, 176, 26], [346, 158, 18], [366, 184, 30], [398, 166, 22], [422, 150, 26], [450, 172, 30]];
  for (const [bx, top, w] of near) {
    rect(bx, top, w, y1 - top + 1, b.ink(PAL.N1));
    rect(bx, top, 1, y1 - top + 1, b.ink(PAL.N2)); // the lit edge (city glow)
    litWindows(b, bx, top, w, y1 - top, bx * 13 + 5, f, {px: 3, py: 3, density: 0.2});
  }
  // aviation lights on the two tallest near roofs (slow, out of phase)
  if (Math.floor((f + 5) / 16) % 2 === 0) b.set(434, 149, PAL.R3);
  if (Math.floor((f + 13) / 16) % 2 === 0) b.set(355, 157, PAL.R2);
};

const drawWindowFrame = (b: Buf) => {
  const {x0, x1, y1, mx, my} = MED.win;
  // outer trim on the left (catches the monitor), mullions, the sill
  rect(x0 - 5, 0, 5, y1 + 6, b.ink(PAL.N1));
  rect(x0 - 5, 0, 1, y1 + 6, b.ink(PAL.C1));
  rect(x0 - 1, 0, 1, y1 + 6, b.ink(PAL.N0));
  rect(mx, 0, 3, y1, b.ink(PAL.N1)); rect(mx, 0, 1, y1, b.ink(PAL.N2));
  rect(x0, my, x1 - x0, 3, b.ink(PAL.N1)); rect(x0, my, x1 - x0, 1, b.ink(PAL.N2));
  rect(x0 - 5, y1 + 1, x1 - x0 + 5, 5, b.ink(PAL.N1)); rect(x0 - 5, y1 + 1, x1 - x0 + 5, 1, b.ink(PAL.N3));
};

const drawRack = (b: Buf, f: number) => {
  // the server cabinet at the left edge: black, perforated, alive
  rect(0, 14, 46, 270 - 14, b.ink(PAL.N0));
  rect(45, 14, 1, 256, b.ink(PAL.C1)); // its edge toward the monitor
  rect(0, 14, 46, 1, b.ink(PAL.N2));
  for (let y = 22; y < 270; y += 26) {
    rect(4, y, 38, 22, b.ink(PAL.N1));
    for (let yy = y + 2; yy < y + 20; yy += 2) for (let xx = 6; xx < 30; xx += 2) if (((xx + yy) >> 1) & 1) b.set(xx, yy, PAL.N2);
    // LEDs: a steady column, and one per unit that blinks on eighth notes (7-8 frame phase)
    const k = (y - 22) / 26;
    b.set(34, y + 4, PAL.C4); b.set(37, y + 4, hash(k, 1) < 0.5 ? PAL.C3 : PAL.L2);
    const eighth = Math.floor((f * 2) / 15);
    const on = (eighth + k) % 3 !== 0;
    if (k === 1 || k === 3 || k === 5) b.set(34, y + 8, on ? PAL.R3 : PAL.R0);
    if (hash(k, 7) < 0.6) b.set(37, y + 8, (eighth + k * 2) % 4 === 0 ? PAL.W6 : PAL.W2);
  }
};

const drawShelf = (b: Buf) => {
  // a shelf over the monitor: books, the red clock (1:36), a plant; its underside catches the screen
  const y = 22;
  rect(50, y, 240, 3, b.ink(PAL.D1));
  rect(50, y + 3, 240, 1, b.ink(PAL.C1));
  const spines = [[58, 13, PAL.D2], [62, 15, PAL.R0], [67, 12, PAL.N3], [71, 14, PAL.D3], [76, 11, PAL.N2], [80, 15, PAL.R1], [86, 13, PAL.D2]] as const;
  for (const [x, h, c] of spines) { rect(x, y - h, 4, h, b.ink(c)); rect(x, y - h, 1, h, b.ink(stepColor(c, 1))); }
  // clock
  rect(208, y - 9, 22, 9, b.ink(PAL.N0));
  const dig: Record<string, string[]> = {
    '1': ['.#', '##', '.#', '.#', '.#'], '3': ['##', '.#', '##', '.#', '##'], '6': ['##', '#.', '##', '#.', '##'].map((r, i) => (i === 3 ? '##' : r)),
  };
  let cx = 211;
  for (const ch of '1:36') {
    if (ch === ':') { b.set(cx, y - 7, PAL.R2); b.set(cx, y - 5, PAL.R2); cx += 2; continue; }
    dig[ch].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y - 8 + j, PAL.R3); });
    cx += 3 + 1;
  }
  // plant: a few dark leaves
  const leaves = [[262, y - 4, 8, -6], [266, y - 3, -6, -8], [270, y - 5, 7, -9], [268, y - 2, 10, -3]];
  for (const [x, yy, dx, dy] of leaves) line(x, yy, x + dx, yy + dy, b.ink(PAL.L0));
  rect(262, y - 5, 8, 5, b.ink(PAL.D1));
};

const drawMonitor = (b: Buf, f: number) => {
  // left side panel (it is turned toward him), bezel, chin, the arm pole
  poly([BZ.x0 - 6, BZ.y0 + 2, BZ.x0, BZ.y0, BZ.x0, BZ.y1, BZ.x0 - 6, BZ.y1 - 3], b.ink(PAL.N0));
  line(BZ.x0 - 6, BZ.y0 + 2, BZ.x0 - 6, BZ.y1 - 3, b.ink(PAL.N2));
  rect(BZ.x0, BZ.y0, BZ.x1 - BZ.x0 + 1, BZ.y1 - BZ.y0 + 1, b.ink(PAL.N1));
  rect(BZ.x0, BZ.y0, BZ.x1 - BZ.x0 + 1, 1, b.ink(PAL.G1));
  rect(BZ.x1, BZ.y0, 1, BZ.y1 - BZ.y0 + 1, b.ink(PAL.G0));
  rect(BZ.x0, BZ.y1, BZ.x1 - BZ.x0 + 1, 1, b.ink(PAL.N0));
  rect(SX - 1, SY - 1, SW + 2, SH + 2, b.ink(PAL.N0));
  b.set(BZ.x1 - 6, BZ.y1 - 3, PAL.C3); // power LED
  // a desk-clamped monitor ARM (not a stand): a short pole off the desk's far edge, one knuckle, and the arm
  // reaching up-left to the mount behind the screen. The screen floats at eye height; nothing reads as a TV stand.
  const cx = 236, deskY = MED.deskY;
  // the clamp on the desk edge
  rect(cx - 7, deskY - 3, 15, 5, b.ink(PAL.G0)); rect(cx - 7, deskY - 3, 15, 1, b.ink(PAL.C2)); rect(cx - 7, deskY + 2, 15, 1, b.ink(PAL.N0));
  // the pole
  rect(cx - 2, BZ.y1 + 20, 5, deskY - 3 - (BZ.y1 + 20), b.ink(PAL.G0)); rect(cx - 2, BZ.y1 + 20, 1, deskY - 3 - (BZ.y1 + 20), b.ink(PAL.C2)); rect(cx + 2, BZ.y1 + 20, 1, deskY - 3 - (BZ.y1 + 20), b.ink(PAL.N0));
  // the knuckle
  const ky = BZ.y1 + 18;
  rect(cx - 4, ky - 3, 9, 7, b.ink(PAL.G1)); rect(cx - 4, ky - 3, 9, 1, b.ink(PAL.C3)); rect(cx - 4, ky + 3, 9, 1, b.ink(PAL.N0)); b.set(cx, ky, PAL.N0);
  // the arm up to the mount (behind the bezel): a flat bar, lit along its top
  const ax0 = cx - 3, ay0 = ky - 2, ax1 = SX + 112, ay1 = BZ.y1;
  poly([ax0, ay0 - 2, ax1, ay1 - 3, ax1, ay1 + 2, ax0, ay0 + 3], b.ink(PAL.G0));
  line(ax0, ay0 - 2, ax1, ay1 - 3, b.ink(PAL.C2));
  line(ax0, ay0 + 3, ax1, ay1 + 2, b.ink(PAL.N0));
  // a work cue (this is his lab, never a home: guardrails X1): a staff ID badge on its lanyard, hung off the knuckle
  for (let j = 0; j < 10; j++) b.set(cx + 4 + (j >> 2), ky + 3 + j, j % 3 === 2 ? PAL.C2 : PAL.C3);
  const bx = cx + 3, by = ky + 12;
  rect(bx - 1, by - 1, 9, 11, b.ink(PAL.N0));
  rect(bx, by, 7, 9, b.ink(PAL.P0));
  rect(bx, by, 7, 2, b.ink(PAL.C4));
  rect(bx + 1, by + 3, 2, 3, b.ink(PAL.N4));
  rect(bx + 4, by + 3, 2, 1, b.ink(PAL.G3)); rect(bx + 4, by + 5, 2, 1, b.ink(PAL.G3)); rect(bx + 1, by + 7, 5, 1, b.ink(PAL.G2));
  // the screen itself (emissive)
  const s = screenAt(f);
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) b.set(SX + x, SY + y, s.c[y * SW + x]);
  // the dot escapes: one frame above the bezel, one fainter, gone
  if (f === EV.dotExit) b.set(SX + SW - 3, BZ.y0 - 3, PAL.C8);
  if (f === EV.dotExit + 1) b.set(SX + SW - 3, BZ.y0 - 8, PAL.C4);
};

const drawDesk = (b: Buf) => {
  const y0 = MED.deskY;
  // dark wood receding: the screen lights the strip between the monitor and Mas; the near edge is black
  for (let y = y0; y < 270; y++)
    for (let x = 0; x < 480; x++) {
      const t = (y - y0) / (270 - y0) + (bayer(x, y) - 0.5) * 0.12;
      b.set(x, y, t < 0.3 ? PAL.D2 : t < 0.7 ? PAL.D1 : PAL.D0);
    }
  // the screen's light lands on the strip between the monitor and Mas
  ringPool(b, SX + SW + 10, y0 + 2, 120, 22, [[1, PAL.D2], [0.72, PAL.C0], [0.42, PAL.C1]], (x, y) => y > y0);
  // glossy top: a dim, broken reflection of the lit screen right under the monitor
  for (let y = y0 + 3; y < y0 + 16; y++)
    for (let x = SX + 6; x < SX + SW - 6; x++) if (bayer(x, y) < 0.42 - (y - y0) * 0.028 && hash(x >> 2, y, 9) < 0.8) b.set(x, y, PAL.C1);
  // the far edge catches the screen; wood grain as a few long broken lines
  for (let x = 0; x < 480; x++) b.set(x, y0, x < 330 ? PAL.C2 : PAL.C1);
  for (let k = 0; k < 9; k++) {
    const gy = y0 + 4 + ((k * 7) % 38), gx = (k * 97) % 400;
    for (let x = gx; x < gx + 40 + (k % 3) * 20; x++) if (hash(x, gy, 3) < 0.8) b.set(x, gy, stepColor(b.get(x, gy), -1));
  }
};

/** His water glass: tall, clear, and its water line is ruler-flat (it never ripples). */
const drawGlass = (b: Buf) => {
  const {x, y, w, h} = MED.glass;
  const water = y + 12;
  // contact shadow on the desk, away from the screen
  for (let i = 0; i < w + 8; i++) b.set(x + 4 + i, y + h, PAL.N0);
  for (let i = 0; i < w + 2; i++) b.set(x + 6 + i, y + h + 1, PAL.D0);
  for (let j = 0; j < h; j++) {
    const yy = y + j;
    for (let i = 0; i < w; i++) {
      const xx = x + i;
      const edgeL = i === 0, edgeR = i === w - 1;
      if (j < water - y) {
        // empty glass above the water: only its edges and one streak exist
        if (edgeL) b.set(xx, yy, PAL.C4);
        else if (edgeR) b.set(xx, yy, PAL.C1);
        else if (i === 2) b.set(xx, yy, PAL.C2);
      } else {
        // water: the scene behind, one step cooler, a lit left edge, a dark right
        const under = b.get(xx, yy);
        b.set(xx, yy, edgeL ? PAL.C5 : edgeR ? PAL.C2 : i === 2 ? PAL.C3 : i < 5 ? PAL.C1 : stepColor(under, 1) === under ? PAL.C0 : PAL.C0);
      }
    }
  }
  // the water line: one flat bright pixel row, and the rim
  for (let i = 1; i < w - 1; i++) b.set(x + i, water, i < 7 ? PAL.C7 : PAL.C4);
  for (let i = 0; i < w; i++) b.set(x + i, y, i < 6 ? PAL.C5 : PAL.C2);
  // thick glass base
  for (let i = 0; i < w; i++) { b.set(x + i, y + h - 2, i < 5 ? PAL.C4 : PAL.C2); b.set(x + i, y + h - 1, PAL.C1); }
};

export interface MediumOut { masMask?: Uint8Array; orbMask?: Uint8Array }

export const drawMedium = (b: Buf, f: number, o: MediumOut = {}) => {
  // ---- wall + the monitor's glow on it
  rect(0, 0, 480, 270, b.ink(PAL.N1));
  const wall = (x: number, y: number) => !inWindow(x, y) && !(x >= MED.win.x0 - 5 && x < MED.win.x0);
  // the screen faces him: its spill on the far wall is offset toward his side and falls off fast
  boxPool(b, BZ.x0 + 30, BZ.y0 + 10, BZ.x1 - BZ.x0 - 10, BZ.y1 - BZ.y0 - 10, [130, 78], [[1, PAL.N2], [0.56, PAL.C0], [0.2, PAL.C1]], wall, (x) => (x > BZ.x1 ? 1.35 : x < BZ.x0 + 40 ? 0.75 : 1), 0.62);
  // plaster texture: sparse specks (never a pattern)
  for (let y = 0; y < 270; y++) for (let x = 46; x < MED.win.x0 - 5; x++) if (hash(x, y, 31) < 0.03) b.set(x, y, stepColor(b.get(x, y), -1));
  drawCity(b, f);
  drawWindowFrame(b);
  drawRack(b, f);
  drawShelf(b);
  // ---- Mas (behind the desk), then the Orb at his far shoulder
  const {s, tilt, dip} = masPortraitAt(f);
  blitImg(b, masMedium(s, tilt, dip), MED.mas[0], MED.mas[1], {mask: o.masMask});
  const [ox, oy] = MED.orb;
  // after the scan cutaway the lens is still hot for a frame, then its aperture settles back
  const cooling = f === EV.scan[1] + 1;
  const ap = cooling ? 1 : f === EV.scan[1] + 2 ? 0.8 : 0.5;
  drawOrb(b, ox, oy + orbBob(f), MED.orbR, {look: orbLookAt(f, EV.irisTurn), aperture: ap, scanning: cooling, monitor: -1}, o.orbMask);
  // ---- the desk top in front of him, his glass, then the monitor (nearest to camera)
  drawDesk(b);
  drawGlass(b);
  drawHands(b, f);
  drawMonitor(b, f);
  vignette(b);
  return b;
};
