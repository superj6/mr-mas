// MR. MAS — mrollcall scene: one portrait window per eighth note, hard cuts; the portraits ride the curve.
// Pure (no DOM): used by the Remotion components (Rollcall.tsx) and the Node preview (tools/preview.ts).
// Every function here takes the GLOBAL intro frame g (480..539) or a flash index n + frames-since-cut k.
import {Buf, rect, hash} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {panel, THEME, UITheme} from '../../shared/pixel/ui';
import type {DrawResult} from '../../shared/pixel/compose';
import type {GlyphLayer, Token} from '../../shared/pixel/glyph';
import {CX, micro} from '../../shared/pixel/cast/bosses';
import {drawTasya, drawRadnus, drawKram, drawNesnej, drawRima, drawWhale, drawRumpt, drawCursorWindow, RC_SIZE} from '../../shared/pixel/cast/rollcall';
import {CUTS, MR, ORDER, PlayerId, WINDOWS, THREAD, THREAD_RISE_X, threadReach, flashAt} from './timeline';

/**
 * Per flash: the egg plate (NAMES ONLY, rule 3.0.10; RUMPT's and the cursor's stay blank), the faction fill (the
 * player's tower colour, all eight on ONE luminance step: OKLab L 0.33-0.41, hue only — drawn as the window's inner
 * mat, never as a full-screen field), and where the authored portrait art is cropped into the 112x136 window.
 * RIMA's fill is NopeAI's in Ep1 (§8.2); the whale's plate is its company, PEEKDEEP [SLOT].
 */
export const PLAYERS: Record<PlayerId, {name: string; fill: number; crop: [number, number]}> = {
  tasya: {name: 'TASYA', fill: PAL.G2, crop: [8, 6]},
  radnus: {name: 'RADNUS', fill: PAL.B3, crop: [8, 2]},
  kram: {name: 'KRAM', fill: CX.U3, crop: [6, 6]},
  nesnej: {name: 'NESNEJ', fill: PAL.L1, crop: [8, 0]},
  rima: {name: 'RIMA TAMURI', fill: PAL.X1, crop: [15, 12]},
  whale: {name: 'PEEKDEEP', fill: PAL.C2, crop: [19, 6]},
  rumpt: {name: '', fill: PAL.W3, crop: [2, 2]},
  cursor: {name: '', fill: PAL.N6, crop: [2, 2]},
};
/** the inner mat (the faction fill) inside the bevel; the portrait sits inside it */
const MAT = 2;
const PLATE = PAL.N4;

/** One window frame for the whole roll call (the show's bevelled portrait window): no bevel flash on the cuts. */
const FRAME: UITheme = THEME;

const painters: Record<Exclude<PlayerId, 'cursor'>, (b: Buf, x: number, y: number, k: number) => void> = {
  tasya: drawTasya, radnus: drawRadnus, kram: drawKram, nesnej: drawNesnej, rima: drawRima, whale: drawWhale, rumpt: drawRumpt,
};

// ------------------------------------------------------------------ the steady surround + the thread
/** THE PLAYERS field: one flat dusk step (the skyline's dusk violet), with the cold-open chart's faint 1-px grid.
 *  It never changes across the eight cuts: only the window content does. */
const FIELD = CX.U0, GRID = CX.U1;
const drawSurround = (b: Buf, ox = 0, oy = 0) => {
  rect(ox, oy, 480, 270, b.ink(FIELD));
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) if ((x % 24 === 8 || y % 24 === 20) && (x + y) % 2 === 0) b.set(ox + x, oy + y, GRID);
};
/** The cyan thread (the curve) on the surround: drawn left to right up to `reach`, whole-pixel stair steps. */
const THREAD_CORE = PAL.C6, THREAD_GLOW = PAL.C3;
const drawThread = (b: Buf, reach: number, ox = 0, oy = 0) => {
  let prevY = -1;
  for (const [x0, x1, y] of THREAD) {
    if (x0 > reach) break;
    if (prevY >= 0) for (let yy = y; yy <= prevY; yy++) { b.set(ox + x0, oy + yy, THREAD_CORE); b.set(ox + x0 + 1, oy + yy, THREAD_GLOW); }
    for (let x = x0; x <= Math.min(x1, reach); x++) { b.set(ox + x, oy + y, THREAD_CORE); b.set(ox + x, oy + y + 1, THREAD_GLOW); }
    prevY = y;
  }
  // the last riser: straight up off the top of the frame
  if (reach >= THREAD_RISE_X) for (let yy = 0; yy <= THREAD[THREAD.length - 1][2]; yy++) { b.set(ox + THREAD_RISE_X, oy + yy, THREAD_CORE); b.set(ox + THREAD_RISE_X + 1, oy + yy, THREAD_GLOW); }
};

// ------------------------------------------------------------------ flash 8: the cursor (GLYPH)
/** Cursor blink: on 0-3, off 4-5, on 6-7 (SCRIPT §3.7: on f532-535, off 536-537, on 538-539). */
export const cursorOn = (k: number) => k < 4 || k >= 6;
/** The cursor's cell (native px) and where it sits: at eye level of a face that is not there yet. */
const CURSOR_CELL: [number, number] = [7, 12];

const cursorLayers = (x: number, y: number, w: number, h: number, k: number, g: number): GlyphLayer[] => {
  // the dark is full of text: a few very faint tokens, re-rolling on 2s, only inside the window
  const noise: Token[] = [];
  const [cw, chh] = [2, 3];
  for (let cy = y + 3; cy + chh <= y + h - 2; cy += chh)
    for (let cx = x + 2; cx + cw <= x + w - 2; cx += cw) {
      if (cy < 0) continue;
      const hsh = hash(cx, cy, 77);
      if (hsh > 0.045) continue;
      noise.push({x: cx, y: cy, v: 0.12 + hash(cy, cx, 3) * 0.22, pick: hash(cx, cy, 5 + Math.floor(g / 2) * (hash(cx, cy, 9) < 0.3 ? 1 : 0)), edge: -1,
        col: hash(cx, cy, 13) < 0.5 ? PAL.C3 : PAL.C4, a: 0.16 + hash(cx, cy, 17) * 0.2});
    }
  const layers: GlyphLayer[] = [{tokens: noise, style: {cell: [cw, chh], bloom: 0.2, weight: 400}, cell: [cw, chh], fills: []}];
  if (cursorOn(k)) {
    const [ccw, cch] = CURSOR_CELL;
    const cx = Math.round(x + w / 2 - ccw / 2), cy = Math.round(y + h * 0.5 - cch / 2);
    layers.push({tokens: [{x: cx, y: cy, v: 1, pick: 0, edge: -1, col: PAL.C7, a: 1, ch: '█'}], style: {cell: CURSOR_CELL, bloom: 1, weight: 700, size: [1, 1]}, cell: CURSOR_CELL, fills: []});
  }
  return layers;
};

// ------------------------------------------------------------------ one flash
export interface FlashOpts {
  /** tiny name plate under the window (default on) */
  plate?: boolean;
  /** paint the steady surround and the thread (default on; the contact sheet paints its own) */
  field?: boolean;
  /** offset of the 480x270 screen inside a bigger buffer (contact sheet) */
  ox?: number; oy?: number;
  /** global frame (the cursor's shimmer); defaults to the flash's own frame */
  g?: number;
}
const TMP = new Map<string, Buf>();
/** Paint flash n at k frames after its cut: surround, thread, window, portrait, plate. Returns glyph layers (8). */
export const drawFlash = (b: Buf, n: number, k: number, o: FlashOpts = {}): GlyphLayer[] => {
  const id = ORDER[n];
  const pl = PLAYERS[id];
  const ox = o.ox ?? 0, oy = o.oy ?? 0;
  const win = WINDOWS[n];
  const x = win.x + ox, y = win.y + oy, w = win.w, h = win.h;
  if (o.field !== false) { drawSurround(b, ox, oy); drawThread(b, threadReach(n), ox, oy); }
  panel(b, x, y, w, h, FRAME);
  // the faction fill: the window's inner mat, then the portrait cropped into it
  rect(x, y, w, h, b.ink(pl.fill));
  const iw = w - 2 * MAT, ih = h - 2 * MAT;
  let layers: GlyphLayer[] = [];
  if (id === 'cursor') {
    drawCursorWindow(b, x + MAT, y + MAT, iw, ih);
    layers = cursorLayers(x + MAT, y + MAT, iw, ih, k, o.g ?? CUTS[n] + k);
  } else {
    const [aw, ah] = RC_SIZE[id];
    let t = TMP.get(id);
    if (!t) { t = new Buf(aw, ah, PAL.N0); TMP.set(id, t); }
    t.c.fill(PAL.N0);
    painters[id](t, 0, 0, k);
    const [cx, cy] = pl.crop;
    for (let j = 0; j < ih; j++) for (let i = 0; i < iw; i++) b.set(x + MAT + i, y + MAT + j, t.c[(cy + j) * aw + cx + i]);
  }
  // tiny name plate (easter egg, names only): low contrast, on the surround under the frame and the thread
  if (o.plate !== false && pl.name) micro(b, pl.name, x - 1, y + h + 7, PLATE);
  return layers;
};

/** The whole moment at GLOBAL frame g (480..539). */
export const drawRollcall = (fb: Buf, g: number): DrawResult => {
  const {n, k} = flashAt(g);
  return {layers: drawFlash(fb, n, k, {g})};
};

// ------------------------------------------------------------------ contact sheet (960x540 native, shown 2x)
/** Each flash at its signature frame (k), for the sheet and the notes. */
export const SIGNATURE_K = [2, 4, 3, 4, 2, 4, 3, 0];
export const SHEET_W = 960, SHEET_H = 540;
export const drawSheet = (b: Buf): DrawResult => {
  rect(0, 0, SHEET_W, SHEET_H, b.ink(PAL.N0));
  const layers: GlyphLayer[] = [];
  for (let n = 0; n < 8; n++) {
    const cx = (n % 4) * 240, cy = Math.floor(n / 4) * 270;
    const id = ORDER[n];
    rect(cx, cy, 240, 270, b.ink(CX.U0));
    // the window is centred on the cell (the sheet shows the portraits, not the layout)
    const wn = WINDOWS[n];
    layers.push(...drawFlash(b, n, SIGNATURE_K[n], {field: false, ox: cx + 120 - (wn.x + wn.w / 2), oy: cy + 125 - (wn.y + wn.h / 2)}));
    const k = SIGNATURE_K[n];
    const label = `${n + 1}  ${['F', 'F', 'F', 'F', 'G', 'AB', 'C', 'F'][n]}  F${CUTS[n] + k}`;
    micro(b, label, cx + 4, cy + 3, PAL.N5);
    rect(cx + 239, cy, 1, 270, b.ink(PAL.N2));
    rect(cx, cy + 269, 240, 1, b.ink(PAL.N2));
  }
  return {layers};
};

export {CUTS, MR};
