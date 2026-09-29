// MR. MAS — outro A: the ROOM. The cold open's MEDIUM two-shot (src/dev/mcoldopen/medium.ts drawMedium, used
// read-only, exactly as the intro's bookend uses it): Mas at the desk in the f56-62 drawings (eyes on the screen,
// hands still), the Orb at his far shoulder, the city behind. This outro's own layers: the monitor's content, the
// light it throws, one blink (the cold open's own lid drawings, f48-50, copied in over his eyes only), the Orb's
// look (it follows the moth), and the room stepping down when the screen goes dark.
import {Buf, W, H, line} from '../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../shared/pixel/palette';
import {drawMedium, MED, CARET_FRAME} from '../../mcoldopen/medium';
import {SW, SH} from '../../mcoldopen/screen';
import {drawOrb, orbBob} from '../../../shared/pixel/cast/orb';
import {O} from './timeline';

export const SCREEN = {x: MED.screen[0], y: MED.screen[1], w: SW, h: SH}; // (80, 44) 180 x 112
/** the loop point: where the cold open's f0 caret sits (the same value as mfinale/bookend.ts LOOP_CURSOR) */
export const LOOP_CURSOR: [number, number] = CARET_FRAME;

/** the cold open's f56-62 cycle (a held performance; the rack LEDs and the city keep living under it) */
export const coldFrame = (o: number) => 56 + ((((o - O.room) % 7) + 7) % 7);

// ------------------------------------------------------------------ the blink (the cold open's own lid drawings)
/** f48 lid half, f49 closed, f50 half (medium.ts masPortraitAt); only his eyes are taken from those frames */
const LID_FRAME: Record<1 | 2, number> = {1: 48, 2: 49};
const EYES = {x0: MED.mas[0] + 24, x1: MED.mas[0] + 92, y0: MED.mas[1] + 34, y1: MED.mas[1] + 60};
const lidCache = new Map<number, {c: Uint32Array | Int32Array; m: Uint8Array}>();
const lidFrame = (lid: 1 | 2) => {
  let e = lidCache.get(lid);
  if (!e) {
    const b = new Buf(W, H, PAL.N0);
    const m = new Uint8Array(W * H);
    drawMedium(b, LID_FRAME[lid], {masMask: m});
    e = {c: b.c.slice(), m};
    lidCache.set(lid, e);
  }
  return e;
};
const blinkOver = (fb: Buf, mas: Uint8Array, lid: 1 | 2) => {
  const {c, m} = lidFrame(lid);
  for (let y = EYES.y0; y < EYES.y1; y++)
    for (let x = EYES.x0; x < EYES.x1; x++) {
      const i = y * W + x;
      if (m[i] && mas[i] && c[i] !== fb.c[i]) fb.c[i] = c[i];
    }
};

// ------------------------------------------------------------------ the lights going down at the very end
/** The room's last two drawings before black: every colour walks onto the night ramp at a fraction of its own
 *  lightness (a palette operation, never a blend), so warm and skin ramps that bottom out above black still go. */
const INK_1BIT = 0x0e0e10; // the 1-bit desktop (pane.ts INK): not a master colour, so stepColor leaves it
const NIGHT = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7, PAL.N8];
const NIGHT_L = NIGHT.map(lightness);
const nightCache = new Map<string, number>();
const toNight = (c: number, k: number) => {
  const key = `${c}:${k}`;
  let n = nightCache.get(key);
  if (n === undefined) {
    const L = lightness(c) * k;
    let best = 0;
    for (let i = 1; i < NIGHT.length; i++) if (Math.abs(NIGHT_L[i] - L) < Math.abs(NIGHT_L[best] - L)) best = i;
    n = NIGHT[best];
    nightCache.set(key, n);
  }
  return n;
};

// ------------------------------------------------------------------ the shelf clock (redrawn: the cold open's 2-px
// digits made its 6 read as a broken 8 at 1080p). Same box, same reds; 3 x 5 digits, centred in the 22 x 9 face.
const CLOCK = {x: 208, y: 13, w: 22, h: 9};
const DIGITS: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#', '##', '.#', '.#', '.#'], '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '.##', '..#', '###'], '4': ['#.#', '#.#', '###', '..#', '..#'], '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'], '7': ['###', '..#', '.#.', '.#.', '.#.'], '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
};
export const drawClock = (fb: Buf, time: string) => {
  const {x, y, w, h} = CLOCK;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) fb.set(x + i, y + j, PAL.N0);
  const width = [...time].reduce((a, ch) => a + (ch === ':' ? 1 : DIGITS[ch].length) + 1, -1);
  let cx = x + Math.floor((w - width) / 2);
  const cy = y + Math.floor((h - 5) / 2);
  for (const ch of time) {
    if (ch === ':') { fb.set(cx, cy + 1, PAL.R2); fb.set(cx, cy + 3, PAL.R2); cx += 2; continue; }
    DIGITS[ch].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') fb.set(cx + i, cy + j, PAL.R3); });
    cx += DIGITS[ch].length + 1;
  }
};

// ------------------------------------------------------------------ the light the screen throws
/** The pane lights him grey (paper on black, a small window on a black desktop): the cold open's cyan key walks to
 *  the night ramp, and his cyan-lit skin (K) to the mauve mixed-light mids (X), a dim, neutral face (a ramp swap).
 *  The eyes' catchlight takes the paper's colour. */
const PANE_KEY = new Map<number, number>([
  [PAL.C0, PAL.N2], [PAL.C1, PAL.N3], [PAL.C2, PAL.N4], [PAL.C3, PAL.N5], [PAL.C4, PAL.N6], [PAL.C5, PAL.N7], [PAL.C6, PAL.N8],
  [PAL.C7, PAL.N8], [PAL.C8, PAL.P1],
  [PAL.K0, PAL.S0], [PAL.K1, PAL.X0], [PAL.K2, PAL.X1], [PAL.K3, PAL.X2], [PAL.K4, PAL.X3], [PAL.K5, PAL.S4],
]);
const inPool = (x: number, y: number) => {
  const {x: sx, y: sy, w: sw, h: sh} = SCREEN;
  const inScreen = x >= sx - 4 && x < sx + sw + 4 && y >= sy - 4 && y < sy + sh + 8;
  const onWall = x >= 46 && x < MED.win.x0 - 5;
  const onDesk = y >= MED.deskY && x < MED.orb[0] - 30;
  return !inScreen && (onWall || onDesk);
};
/** mode: 'pane' (the 1-bit log is up; k = steps down while it closes), 'dark' (only the cursor, or nothing) */
const keyLight = (fb: Buf, mas: Uint8Array, mode: 'pane' | 'dark', k = 0) => {
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const m = mas[i] > 0, pool = !m && inPool(x, y);
      if (!m && !pool) continue;
      let c = fb.c[i];
      { const n = PANE_KEY.get(c); if (n !== undefined) c = n; }
      const step = mode === 'pane' ? -k : -1;
      fb.c[i] = step ? stepColor(c, step) : c;
    }
};

export interface RoomOpts {
  /** what the monitor shows (SW x SH), drawn over the composer */
  screen: Buf;
  mode: 'pane' | 'dark';
  /** key-light step for 'pane' (the window closing) */
  k?: number;
  /** the Orb's look and aperture (redrawn over the cold open's) */
  look: [number, number];
  aperture?: number;
  /** Mas's lids this frame (0 open) */
  lid?: 0 | 1 | 2;
  /** the whole room one light step down (the screen has gone dark) */
  dim?: boolean;
  /** the end: the room goes down this many more steps (the cursor, drawn after, stays lit) */
  fade?: number;
  /** the shelf clock's time (per episode) */
  clock?: string;
  /** zoom rects (the frame collapsing onto the screen): 0 none, 1 two outlines, 2 one */
  zoom?: 0 | 1 | 2;
}

export const drawRoom = (fb: Buf, o: number, r: RoomOpts) => {
  const f = coldFrame(o);
  const mas = new Uint8Array(W * H);
  drawMedium(fb, f, {masMask: mas});
  if (r.clock) drawClock(fb, r.clock);
  if (r.lid) blinkOver(fb, mas, r.lid);
  const {x: sx, y: sy, w: sw, h: sh} = SCREEN;
  for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) fb.set(sx + i, sy + j, r.screen.c[j * sw + i]);
  keyLight(fb, mas, r.mode, r.k ?? 0);
  const [ox, oy] = MED.orb;
  drawOrb(fb, ox, oy + orbBob(f), MED.orbR, {look: r.look, aperture: r.aperture ?? 0.5, monitor: -1});
  const down = (r.dim ? 1 : 0) + (r.fade ?? 0);
  if (r.fade && r.fade >= 2) for (let i = 0; i < fb.c.length; i++) fb.c[i] = toNight(fb.c[i], r.fade === 2 ? 0.62 : 0.32);
  else if (down) for (let i = 0; i < fb.c.length; i++) fb.c[i] = fb.c[i] === INK_1BIT && r.fade ? PAL.N1 : stepColor(fb.c[i], -down);
  if (r.zoom) {
    for (const s of r.zoom === 1 ? [0.35, 0.7] : [0.82]) {
      const x0 = Math.round(20 + (sx - 20) * s), y0 = Math.round(20 + (sy - 20) * s);
      const x1 = Math.round(W - 21 + (sx + sw - (W - 21)) * s), y1 = Math.round(H - 21 + (sy + sh - (H - 21)) * s);
      const col = r.zoom === 1 ? (s < 0.5 ? PAL.N5 : PAL.N6) : PAL.N5;
      line(x0, y0, x1, y0, fb.ink(col)); line(x0, y1, x1, y1, fb.ink(col)); line(x0, y0, x0, y1, fb.ink(col)); line(x1, y0, x1, y1, fb.ink(col));
    }
  }
};

/** the bezel pull-back (the intro bookend's f690-691 drawing) on a full-frame source: LCD rows, the bezel comes in */
export const drawPull = (fb: Buf, src: Buf, k: 0 | 1) => {
  for (let i = 0; i < fb.c.length; i++) fb.c[i] = src.c[i];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x++) fb.set(x, y, stepColor(fb.get(x, y), -1));
  const ins = k === 0 ? 9 : 20;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const e = Math.min(x, y, W - 1 - x, H - 1 - y);
    if (e < ins - 5) fb.set(x, y, e < ins - 12 ? PAL.N1 : PAL.N2);
    else if (e < ins) fb.set(x, y, e === ins - 5 ? PAL.N2 : PAL.N0);
  }
};
