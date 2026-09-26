// MR. MAS - style-range Prototype 1: the PIXEL side of THE READ.
//   p0-119    the pre-roll: [MS] over the table, G6 THE HOTSPOT (his cursor reads each player; the dealer isn't a
//             hotspot); the band slides away and the room under the table takes the lines; the Intern takes the next
//             card off the shoe, lifts it into the lamp, holds it, and snaps it down on the cut (p120)
//   p360-405  the J4 placeholder's SOURCE frame (J4.tsx renders it as the machine's view)
//   p406-479  the tail: the band slides home with the bars still over the four players; his cursor comes back on the
//             downbeat and lands on him: `look at mas`, and nothing sets. His one-pixel eye return. Black on p468.
// Everything here is the shared engine's pipeline (PixelScene / composeFrame): palette-exact, whole pixels.
import {Buf, TRANSPARENT, clamp, hash} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {blitImg, Img} from '../../../../shared/pixel/figure';
import {MatBuf, resolve} from '../../../../shared/pixel/light';
import type {PixelSceneProps} from '../../../../shared/pixel/compose';
import {drawUI, drawCursor} from '../../../pixeladv/art/ui';
import {T, SEATS, Seat, BARS, SEAT_X, INTERN_X, caretOn, BEAT} from '../geo';
import {tablePlate, overlay, feltEdge, LIGHTS, FAR_RAIL_Y, W, H} from './table';
import {NOLE_IMG, NOLE_HEAD, NOLE_PHONE, MARIO_IMG, MARIO_HEAD, KRAM_IMG, NESNEJ_IMG, BUST_HEAD, INTERN_IMG, INTERN_CARET, INTERN_W, INTERN_ARM, InternHand, MAS_IMG, MAS_AT, MasEye} from './cast';
import {statBar, barWidth} from './bars';

const UI_Y = 203;

// ------------------------------------------------------------------ staging (frame coords)
interface Placed { img: () => Img; x: number; y: number; flip: boolean; headX: number; headTop: number; }
/** each seat's figure: top-left, flip (Nole and Kram face the pot to their right; Mario and Nesnej to their left) */
const placeSeat = (s: Seat): Placed => {
  const rail = FAR_RAIL_Y;
  switch (s) {
    case 'nole': { const y = rail - 38; return {img: () => NOLE_IMG({flare: false}), x: SEAT_X.nole - (NOLE_HEAD.w - NOLE_HEAD.cx), y, flip: true, headX: SEAT_X.nole, headTop: y}; }
    case 'kram': { const y = rail - 35; return {img: () => KRAM_IMG({}), x: SEAT_X.kram - BUST_HEAD.cx, y, flip: false, headX: SEAT_X.kram, headTop: y}; }
    case 'mario': { const y = rail - 33; return {img: () => MARIO_IMG({}), x: SEAT_X.mario - (MARIO_HEAD.w - MARIO_HEAD.cx), y, flip: true, headX: SEAT_X.mario, headTop: y}; }
    case 'nesnej': { const y = rail - 35; return {img: () => NESNEJ_IMG({}), x: SEAT_X.nesnej - (BUST_HEAD.w - BUST_HEAD.cx), y, flip: true, headX: SEAT_X.nesnej, headTop: y}; }
  }
};
export const PLACED: Record<Seat, Placed> = {nole: placeSeat('nole'), kram: placeSeat('kram'), mario: placeSeat('mario'), nesnej: placeSeat('nesnej')};
export const INTERN_AT = {x: INTERN_X - INTERN_W / 2, y: FAR_RAIL_Y - 46};
/** the Intern's caret, in frame coords: [x, y top, height] */
export const CARET_AT: [number, number, number] = [INTERN_AT.x + INTERN_CARET[0], INTERN_AT.y + INTERN_CARET[1], INTERN_CARET[2]];
/** the back of Mas's head (frame coords), where his cursor lands at the end and where the machine's caret finds nothing */
export const MAS_HEAD: [number, number] = [MAS_AT[0] + 54, MAS_AT[1] + 16];
/** the stat bars' slots: two rows, staggered so four bars never touch */
const BAR_ROW: Record<Seat, number> = {nole: 0, kram: 1, mario: 0, nesnej: 1};
export const barPos = (s: Seat): [number, number] => {
  const b = BARS[s];
  const w = barWidth(b.label, b.cells);
  const x = Math.round(PLACED[s].headX - w / 2);
  const y = PLACED.kram.headTop - 26 + BAR_ROW[s] * 12;
  return [x, y];
};

// ------------------------------------------------------------------ G6 THE HOTSPOT: the cursor's path
type Hot = Seat | 'intern' | 'rest' | 'mas';
const HOT_PT: Record<Hot, [number, number]> = {
  nole: [SEAT_X.nole, PLACED.nole.headTop + 12],
  kram: [SEAT_X.kram, PLACED.kram.headTop + 11],
  mario: [SEAT_X.mario, PLACED.mario.headTop + 11],
  nesnej: [SEAT_X.nesnej, PLACED.nesnej.headTop + 11],
  intern: [INTERN_X - 1, FAR_RAIL_Y - 37],
  rest: [214, 150],
  mas: MAS_HEAD,
};
/** [arrive frame, target]; the cursor leaves each target DWELL frames after arriving and glides (on 2s) */
const PATH: Array<[number, Hot]> = [[0, 'rest'], [16, 'rest'], [T.hot.nole, 'nole'], [T.hot.kram, 'kram'], [T.hot.mario, 'mario'], [T.hot.nesnej, 'nesnej'], [T.internCross[0], 'intern']];
const TAIL_PATH: Array<[number, Hot]> = [[T.cursorBack, 'intern'], [T.cursorOnMas, 'mas']];
const DWELL = 7;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const along = (path: Array<[number, Hot]>, p: number, dwell: number, firstLeave: number): [number, number] => {
  const q = Math.floor(p / 2) * 2;
  for (let i = path.length - 1; i >= 0; i--) {
    const [t0, k0] = path[i];
    if (q < t0) continue;
    const next = path[i + 1];
    const a = HOT_PT[k0];
    if (!next) return a;
    const leave = i === 0 ? firstLeave : t0 + dwell;
    if (q <= leave) return a;
    const [t1, k1] = next;
    const b = HOT_PT[k1];
    const u = easeInOut(Math.min(1, (q - leave) / Math.max(1, t1 - leave)));
    return [Math.round(a[0] + (b[0] - a[0]) * u), Math.round(a[1] + (b[1] - a[1]) * u)];
  }
  return HOT_PT[path[0][1]];
};
export const cursorAt = (p: number): [number, number] => (p >= T.tail ? along(TAIL_PATH, p, 1, T.cursorBack + 2) : along(PATH, p, DWELL, 16));
/** which player is lit as a hotspot on this frame (the Intern never is; at the end, Mas himself) */
export const hotAt = (p: number): Hot | null => {
  if (p >= T.cursorOnMas && p < T.black) return 'mas';
  if (p >= T.snap) return null;
  for (const s of SEATS) { const t = T.hot[s]; if (p >= t && p < t + DWELL + 1) return s; }
  return null;
};

// ------------------------------------------------------------------ the band (one eased slide each way, whole pixels)
export const bandDy = (p: number) => {
  const slide = (t: number) => Math.round(67 * (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2));
  const [r0, r1] = T.retract, [b0, b1] = T.ret;
  if (p < r0) return 0;
  if (p < r1) return slide((p - r0) / (r1 - r0));
  if (p < b0) return 67;
  if (p < b1) return 67 - slide((p - b0) / (b1 - b0));
  return 0;
};

// ------------------------------------------------------------------ the dealer's card (frame space)
const internHand = (p: number): InternHand => {
  const L = T.lift;
  if (p >= T.tail || p < L.reach) return 'shoe';
  if (p < L.lift) return 'reach';
  if (p < L.up) return 'lift';
  if (p < L.down) return 'up';
  if (p < L.smear) return 'down';
  if (p < T.snap) return 'smear';
  return 'shoe';
};
/** where the card lands: the next spot on the board */
const CARD_LAND: [number, number] = [292 - 44 + 5 * 9, 140 - 9];
const drawCard = (fb: Buf, p: number) => {
  const pose = internHand(p);
  if (pose === 'shoe' || pose === 'reach') return;
  const [, , hx, hy] = INTERN_ARM[pose];
  const X = INTERN_AT.x + hx, Y = INTERN_AT.y + hy;
  const edge = PAL.N0;
  if (pose === 'lift') {
    // flat in the hand, back up
    for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) fb.set(X - 7 + i, Y - 2 + j, j === 0 ? PAL.N5 : PAL.N3);
    return;
  }
  if (pose === 'up') {
    // held up into the lamp, its face to the room: the brightest paper in the frame; the lamp flashes on it once
    const flash = p >= T.lift.up + 6 && p < T.lift.up + 8;
    const x0 = X - 3, y0 = Y - 11;
    for (let j = -1; j <= 10; j++) for (let i = -1; i <= 6; i++) {
      const ring = j === -1 || j === 10 || i === -1 || i === 6;
      fb.set(x0 + i, y0 + j, ring ? edge : j < 2 && i > 2 ? (flash ? PAL.W9 : PAL.W8) : i === 0 ? PAL.P1 : flash ? PAL.W9 : PAL.P2);
    }
    // a pip (generic, no court card)
    fb.set(x0 + 2, y0 + 4, PAL.R2); fb.set(x0 + 3, y0 + 4, PAL.R2); fb.set(x0 + 2, y0 + 5, PAL.R2); fb.set(x0 + 3, y0 + 5, PAL.R3);
    return;
  }
  // down / smear: the card travels to the felt as a streak of paper (the one smear the pixel base allows itself)
  const t = pose === 'down' ? 0.35 : 0.8;
  const cx = Math.round(X + (CARD_LAND[0] - X) * t), cy = Math.round(Y + (CARD_LAND[1] - Y) * t);
  const len = pose === 'down' ? 8 : 16;
  for (let i = 0; i < len; i++) {
    const x = cx + i, y = cy - Math.round(i * 0.25);
    fb.set(x, y, i < len - 5 ? PAL.P1 : PAL.P2);
    fb.set(x, y + 1, i % 3 === 0 ? PAL.P0 : PAL.P1);
    fb.set(x, y + 2, edge);
  }
};

// ------------------------------------------------------------------ the room's small life (whole pixels, slow)
/** held drawings breathe: one pixel, on a slow cycle, never in step with each other */
const breath = (p: number, per: number, ph: number) => (Math.sin((2 * Math.PI * (p + ph)) / per) > 0.35 ? -1 : 0);
const BREATH: Record<Seat, [number, number]> = {nole: [88, 0], kram: [76, 23], mario: [96, 51], nesnej: [84, 12]};
/** Kram's soup is still hot: two threads of steam off the thermos mouth, rising a pixel every three frames */
const drawSteam = (fb: Buf, p: number) => {
  const mx = SEAT_X.kram - 10, my = feltEdge(SEAT_X.kram, false) + 10 - 13;
  for (let k = 0; k < 2; k++)
    for (let j = 0; j < 9; j++) {
      const age = (Math.floor(p / 3) + j + k * 5) % 9;
      const y = my - age;
      const x = mx + k * 2 + Math.round(Math.sin((age + k * 3 + p / 9) * 0.9) * 0.8);
      if (hash(x, y, Math.floor(p / 3)) < 0.35 + (age < 4 ? 0.3 : 0)) fb.set(x, y, age < 3 ? PAL.N5 : PAL.N4);
    }
};
/** Nole's phone: his feed scrolls (the screen's rows step through two tones) */
const drawPhone = (fb: Buf, p: number) => {
  const P = PLACED.nole;
  const img = P.img();
  const x = P.x + (img.w - 1 - NOLE_PHONE[0]), y = P.y + NOLE_PHONE[1];
  const s = Math.floor(p / 5);
  for (let j = -2; j <= 1; j++) {
    const on = (j + s) % 3 !== 0;
    fb.set(x, y + j, on ? PAL.C6 : PAL.C4);
  }
};

// ------------------------------------------------------------------ his chair (in front of his lower back)
let CHAIR: Buf | null = null;
const chairLayer = () => {
  if (CHAIR) return CHAIR;
  const mb = new MatBuf(W, H);
  const x0 = -4, x1 = 116, cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
  const topAt = (x: number) => Math.round(194 + ((x - cx) / hw) ** 4 * 7);
  for (let x = x0; x <= x1; x++) {
    const t = topAt(x);
    for (let y = t; y < H; y++) {
      const u = (x - cx) / hw, v = (y - t) / 60;
      // the back turns away from the lamp: lit only along its top roll, the panel falls into the dark
      let lvl = y === t ? 2.4 : y === t + 1 ? 1.4 : y < t + 4 ? 0.6 : -0.2 - v * 0.8;
      if (Math.abs(u) > 0.93) lvl -= 0.8;
      mb.mat('p1.chair', lvl)(x, y);
    }
    // the brass nail line two rows under the roll
    if ((x - x0) % 3 === 1 && x > x0 + 1 && x < x1 - 1) mb.emit(Math.abs(x - 96) < 16 ? PAL.W6 : PAL.W4)(x, topAt(x) + 3);
  }
  // the tufting: a diamond of buttons in the dark, each with a crease
  for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) {
    const bx = Math.round(x0 + 10 + i * 16 + (j % 2) * 8), by = 212 + j * 16;
    if (bx > x1 - 6) continue;
    mb.emit(PAL.N0)(bx, by);
    mb.shade(-1)(bx - 1, by + 1); mb.shade(-1)(bx + 1, by + 1);
  }
  const out = new Buf(W, H, TRANSPARENT);
  resolve(mb, {...LIGHTS, warm: (x, y) => (y < 200 ? 0.55 * clamp(1 - Math.abs(x - 100) / 90, 0, 1) : LIGHTS.warm(x, y) * 0.4)}, out, 0);
  CHAIR = out;
  return out;
};

// ------------------------------------------------------------------ the frame
const glassAt: [number, number] = [150, 162];
/** Mas's glass: the house tumbler on the rail by his hand, the water ONE flat row; never shaken, never rippled */
export const drawTableGlass = (b: Buf, map?: (c: number) => number) => {
  const m = map ?? ((c: number) => c);
  const [x, y] = glassAt; // y = the base row
  const w = 7, h = 11, top = y - h;
  for (let i = 0; i < w + 3; i++) b.set(x + 1 + i, y + 1, PAL.N0);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = x + i, Y = top + j;
    const water = j >= 4;
    if (i === w - 1) b.set(X, Y, m(water ? PAL.W5 : PAL.W4));
    else if (i === 0) b.set(X, Y, m(PAL.C2));
    else if (water) b.set(X, Y, m(j === 4 ? PAL.C8 : i === 1 ? PAL.C4 : i < 4 ? PAL.C3 : PAL.C2));
    else if (i === 1) b.set(X, Y, m(PAL.C4));
  }
  for (let i = 1; i < w - 1; i++) b.set(x + i, top + 4, m(i > w - 4 ? PAL.C9 : PAL.C7)); // THE water line: one flat row
  for (let i = 0; i < w; i++) b.set(x + i, top - 1, m(i > w - 4 ? PAL.W6 : PAL.C4));
  for (let i = 0; i < w; i++) { b.set(x + i, y - 1, m(i > w - 4 ? PAL.W5 : PAL.C3)); b.set(x + i, y, m(PAL.C1)); }
  b.set(x + 1, top + 6, m(PAL.C9));
};

export interface FrameOpts {
  hot: Hot | null; eye: MasEye;
  /** the caret on the Intern's face: 'blink' (quarter notes), 'on' (held: it is looking), 'off' (its face is empty) */
  caret: 'blink' | 'on' | 'off';
  /** per-layer palette steps for the machine's view (J4 reads a re-levelled source) */
  lv?: {back?: number; front?: number; players?: number; mas?: number; intern?: number};
}
const stepMap = (k?: number) => (k ? (c: number) => stepColor(c, k) : undefined);
/** paint the table frame (native 480 x 270) */
export const drawTableFrame = (fb: Buf, p: number, o: FrameOpts) => {
  const {back, front} = tablePlate();
  const lv = o.lv ?? {};
  if (lv.back) { for (let i = 0; i < back.c.length; i++) fb.c[i] = stepColor(back.c[i], lv.back); } else fb.c.set(back.c);
  // the Intern behind the right end, then the players behind the far rail
  const intern = INTERN_IMG({hand: internHand(p)});
  blitImg(fb, intern, INTERN_AT.x, INTERN_AT.y, {map: stepMap(lv.intern)});
  const caretLit = o.caret === 'on' || (o.caret === 'blink' && caretOn(p));
  if (caretLit) {
    const [cx, cy, ch] = CARET_AT;
    for (let j = 0; j < ch; j++) fb.set(cx, cy + j, j === 0 ? PAL.C8 : PAL.C6);
  }
  for (const s of SEATS) {
    const P = PLACED[s];
    const lit = o.hot === s;
    const k = (lit ? 1 : 0) + (lv.players ?? 0);
    const [per, ph] = BREATH[s];
    blitImg(fb, P.img(), P.x, P.y + breath(p, per, ph), {flip: P.flip, map: stepMap(k), clip: (_x, y) => y < FAR_RAIL_Y + 2});
  }
  if (lv.front) overlay(fb, front, (c) => stepColor(c, lv.front!)); else overlay(fb, front);
  drawSteam(fb, p);
  drawPhone(fb, p);
  drawCard(fb, p);
  // Mas in the foreground (he breathes too), his chair in front of his lower back, then his glass
  const mk = (o.hot === 'mas' ? 1 : 0) + (lv.mas ?? 0);
  blitImg(fb, MAS_IMG({eye: o.eye}), MAS_AT[0], MAS_AT[1] + breath(p, 104, 40), {map: stepMap(mk)});
  overlay(fb, chairLayer(), stepMap(lv.mas ? Math.min(lv.mas, 1) : 0));
  drawTableGlass(fb, stepMap(mk));
};

// ------------------------------------------------------------------ the scene (all pixel frames, by p)
export const isPixel = (p: number) => p < T.snap || p >= T.tail;
const caretMode = (p: number): FrameOpts['caret'] => (p >= T.lift.up && p < T.snap ? 'on' : 'blink');
export const PIXEL_SCENE: PixelSceneProps = {
  bg: PAL.N0,
  draw: (fb, p) => {
    const eye: MasEye = p >= T.eyeReturn ? 1 : 0;
    drawTableFrame(fb, p, {hot: hotAt(p), eye, caret: caretMode(p)});
  },
  after: (ui, p) => {
    // the stat bars: they set on the hotspots, and they are still there when we come back (the read is his)
    for (const s of SEATS) {
      const k = p >= T.tail ? 99 : p - T.hot[s];
      if (k < 0) continue;
      const [x, y] = barPos(s);
      const b = BARS[s];
      statBar(ui, x, y, b.label, b.cells, b.filled, k, hotAt(p) === s);
    }
    // the band: drawn into its own layer, then shifted down by the slide
    const dy = bandDy(p);
    if (dy < 67) {
      const band = new Buf(W, H, TRANSPARENT);
      const hot = hotAt(p);
      const away = p >= T.retract[0] && p < T.cursorBack;
      const sentence = hot === 'mas' ? 'look at mas' : hot && !away ? `look at ${hot}` : '';
      const verb = (p >= 16 && p < T.retract[0]) || p >= T.cursorBack ? 'Look at' : undefined;
      drawUI(band, {cutscene: false, sentence, hoverVerb: verb, f: p});
      for (let y = UI_Y; y < H - dy; y++) for (let x = 0; x < W; x++) {
        const c = band.c[y * W + x];
        if (c !== TRANSPARENT) ui.c[(y + dy) * W + x] = c;
      }
    }
    // his cursor, while the game is his (hidden from the moment the band starts to go until it is home again)
    const show = (p < T.retract[0]) || (p >= T.cursorBack && p < T.black);
    if (show) { const [cx, cy] = cursorAt(p); drawCursor(ui, cx, cy, p); }
    return;
  },
};
export {BEAT};
