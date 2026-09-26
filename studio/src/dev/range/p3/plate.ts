// MR. MAS — range/p3: the pixel [W]. Ep12's dinner at THE WOODROSE from the side, adventure-game staging: Mas at
// the head (left), the monitor at the far end (right) facing him like a mirror, the guests along the far side,
// LED candles, his water glass with its one flat row. Everything is drawn from layout.ts's metres through SIDE_CAM,
// so the 3D render can lift this exact frame into depth.
// Reuses (import only): mdinner1/set.ts (the WOODROSE wall, its materials, lights, pendants, glasses, places),
// mdinner1/props.ts (the water line), the pixel cast (mas desk, gerg, mario, nole), pixeladv's band.
import {Buf, W, H, bayer, clamp, hash, rect, line} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {blitImg} from '../../../shared/pixel/figure';
import {wallLayer, resolveWindow, WorldMat, SetLight, drawPendant, drawGlass, drawPlace, flameGlow} from '../../mdinner1/set';
import {drawWaterLine} from '../../mdinner1/props';
import {masDeskBack, masDeskFront, MAS_DESK_DEFAULT, MasDeskPose, MAS_DESK_EDGE} from '../../../shared/pixel/cast/mas';
import {gergBack, gergFront, GERG_DEFAULT, gergTypeAt, GERG_TABLE_EDGE} from '../../../shared/pixel/cast/gerg';
import {marioImg, MARIO_BASE} from '../../../shared/pixel/cast/mario';
import {noleImg, NOLE_BASE} from '../../../shared/pixel/cast/nole';
import {drawUI} from '../../pixeladv/art/ui';
import {SIDE_CAM, project, TABLE, CANDLES, MONITOR, MAS_GLASS, SCONCES, V3} from './layout';

// ------------------------------------------------------------------ owners (what each pixel is, for the lift)
export const O = {bg: 0, wall: 1, floor: 2, top: 3, drape: 4, prop: 5, candle: 6, monitor: 7, pendant: 8, chair: 9, person: 10, mas: 11, masGlass: 12, band: 13, under: 14, glow: 15} as const;
export class OBuf extends Buf {
  own: Uint8Array; cur: number = O.bg;
  constructor(w = W, h = H, fill = 0) { super(w, h, fill); this.own = new Uint8Array(w * h); }
  set(x: number, y: number, col: number) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x;
    this.c[i] = col; this.own[i] = this.cur;
  }
}
/** a colour-only write (glows, light spill): keeps the owner of what is lit */
const tint = (b: OBuf, x: number, y: number, col: number) => { if (x >= 0 && y >= 0 && x < b.w && y < b.h) b.c[y * b.w + x] = col; };

// ------------------------------------------------------------------ where things land in the side view
const P = (p: V3) => { const q = project(SIDE_CAM, p)!; return [q[0], q[1]] as [number, number]; };
const R = (p: V3) => { const q = P(p); return [Math.round(q[0]), Math.round(q[1])] as [number, number]; };
export const WIDE = (() => {
  const x0 = Math.round(P([TABLE.x0, TABLE.top, TABLE.z1])[0]), x1 = Math.round(P([TABLE.x1, TABLE.top, TABLE.z1])[0]);
  const back = Math.round(P([1.55, TABLE.top, TABLE.z0])[1]), front = Math.round(P([1.55, TABLE.top, TABLE.z1])[1]);
  const hem = Math.round(P([1.55, TABLE.hem, TABLE.z1 + TABLE.drape])[1]);
  const floorFront = Math.round(P([1.55, 0, TABLE.z1])[1]);
  const mon = R(MONITOR.c);
  return {x0, x1, back, front, hem, floorFront, mon, monTop: Math.round(P([MONITOR.c[0], MONITOR.c[1] + MONITOR.h / 2, 0])[1]), monBot: Math.round(P([MONITOR.c[0], MONITOR.c[1] - MONITOR.h / 2, 0])[1]),
    candles: CANDLES.map((c) => R(c)), glass: R(MAS_GLASS), wallCam: [280, 56] as [number, number],
    sconces: SCONCES.filter((q) => q.p[2] < 0).map((q) => R(q.p))};
})();

// ------------------------------------------------------------------ light (LED candles: steady; the monitor: cyan)
const pool = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => { const d = Math.hypot((x - cx) / rx, (y - cy) / ry); return d >= 1 ? 0 : 1 - d; };
const PENDANTS_S = [50, 172, 336];
/** the rig in SCREEN px; the wall layer passes world px, shifted back by wallCam */
const rig = (ox: number, oy: number, mon = 1): SetLight => ({
  amb: (_x, y) => { const Y = y - oy; return Y < 30 ? 0.7 : Y < WIDE.back ? 1.25 : 1.05; },
  warm: (x0, y0) => {
    const x = x0 - ox, y = y0 - oy;
    let v = y < WIDE.back - 60 ? 0.12 : y < WIDE.back ? 0.22 : y < WIDE.front ? 0.5 : y <= WIDE.hem ? 0.34 - (y - WIDE.front) * 0.004 : 0.12;
    for (const px of PENDANTS_S) v = Math.max(v, pool(x, y, px, 94, 54, 60) * 0.42, pool(x, y, px, WIDE.front - 4, 64, 12) * 0.8);
    for (const [cx, cy] of WIDE.candles) v = Math.max(v, pool(x, y, cx, cy - 2, 44, 16) * 0.95, pool(x, y, cx, cy - 12, 26, 34) * 0.66, pool(x, y, cx, cy + 14, 30, 28) * 0.55);
    // the sconces: a fan of light down the wall under each shade
    for (const [sx, sy] of WIDE.sconces) v = Math.max(v, pool(x, y, sx, sy + 26, 22, 34) * 0.62, pool(x, y, sx, sy - 6, 12, 10) * 0.5);
    return clamp(v, 0, 1);
  },
  cool: (x0, y0) => {
    const x = x0 - ox, y = y0 - oy;
    // the monitor's cyan: a cone back along the cloth toward Mas, a pool on the wall behind the far end
    let v = pool(x, y, WIDE.mon[0] - 30, WIDE.back + 3, 150, 14) * 0.9 * mon;
    v = Math.max(v, pool(x, y, WIDE.mon[0] - 8, WIDE.mon[1] - 6, 70, 64) * 0.7 * mon);
    v = Math.max(v, pool(x, y, 240, WIDE.back - 1, 150, 6) * 0.35);
    return clamp(v, 0, 1);
  },
});

// ------------------------------------------------------------------ the table (painted once, in screen px)
let TABLE_WM: WorldMat | null = null;
const tableLayer = () => {
  if (TABLE_WM) return TABLE_WM;
  const wm = new WorldMat(W, H);
  const {x0, x1, back, front, hem} = WIDE;
  for (let y = back; y < front; y++) for (let x = x0; x <= x1; x++) wm.mat('linen', 1.2 + (y - back) * 0.1)(x, y);
  rect(x0 + 8, back + 3, x1 - x0 - 16, 2, wm.mat('teal', 1));
  rect(x0 + 8, back + 5, x1 - x0 - 16, 1, wm.mat('teal', -0.4));
  rect(x0, front, x1 - x0 + 1, 1, wm.mat('linen', 1.6));
  for (let y = front + 1; y <= hem; y++)
    for (let x = x0; x <= x1; x++) {
      const k = ((x - x0 + Math.floor(hash(Math.floor((x - x0) / 23), 1, 3) * 6)) % 23 + 23) % 23;
      wm.mat('linen', -1.2 - (y - front) * 0.035 + (y === hem ? 0.6 : 0) + (y < front + 3 ? 0.9 : 0))(x, y);
      if (k === 11) wm.shade(-1.1)(x, y); else if (k === 12 || k === 10) wm.shade(-0.5)(x, y); else if (k === 14) wm.shade(0.4)(x, y);
    }
  // both ends of the cloth fall into shadow (the side faces are edge-on: a 3 px fold)
  for (let y = back; y <= hem; y++) { for (let i = 1; i <= 3; i++) { wm.mat('linen', -2.3 - i * 0.3)(x0 - i + (y < front ? 3 - i : 0), y); wm.mat('linen', -2.1 - i * 0.3)(x1 + i - (y < front ? 3 - i : 0), y); } }
  return (TABLE_WM = wm);
};

// ------------------------------------------------------------------ props
/** An LED pillar candle in a glass holder. The flame never moves (it is plastic): one drawing. (x, y) = base centre. */
export const drawLEDCandle = (b: OBuf, x: number, y: number) => {
  b.cur = O.candle;
  // the holder: a clear tumbler, only its edges catch light
  for (let j = 0; j < 12; j++) { b.set(x - 5, y - j, j === 11 ? PAL.P0 : PAL.N6); b.set(x + 5, y - j, j < 2 ? PAL.N5 : PAL.X2); }
  rect(x - 4, y, 9, 1, b.ink(PAL.N5));
  b.set(x - 5, y - 11, PAL.W8); b.set(x + 5, y - 11, PAL.P1);
  // the pillar (warm ivory, lit from its own flame: the top rim bright)
  rect(x - 3, y - 8, 6, 8, b.ink(PAL.P1));
  rect(x - 3, y - 8, 1, 8, b.ink(PAL.P2)); rect(x + 2, y - 8, 1, 8, b.ink(PAL.X3));
  rect(x - 3, y - 9, 6, 1, b.ink(PAL.W8));
  rect(x - 3, y - 1, 6, 1, b.ink(PAL.P0));
  // the LED flame: a teardrop, held (it doesn't flicker)
  const fl = ['.W.', 'WYW', 'WYW', '.y.'];
  const fp: Record<string, number> = {W: PAL.W7, Y: PAL.W9, y: PAL.W6};
  fl.forEach((r, j) => { for (let i = 0; i < 3; i++) { const c = fp[r[i]]; if (c !== undefined) b.set(x - 1 + i, y - 13 + j, c); } });
};
/** the monitor on its stand at the far end, turned 3/4 to Mas: the cyan face, the casing, the stand to the floor */
export const drawMonitor = (b: OBuf, flare = 0) => {
  b.cur = O.monitor;
  const cx = WIDE.mon[0], t = WIDE.monTop, bt = WIDE.monBot;
  const face = [PAL.C6, PAL.C7, PAL.C8, PAL.C9][clamp(flare, 0, 3)];
  for (let y = t; y <= bt; y++) {
    const sk = Math.round((y - t) * 0.12); // a slight 3/4 lean of the face
    for (let x = cx - 5 - sk; x <= cx + 1 - sk; x++) b.set(x, y, y === t || x === cx - 5 - sk ? PAL.C9 : (x + y) % 5 === 0 ? PAL.C7 : face);
    rect(cx + 2 - sk, y, 3, 1, b.ink(y === t ? PAL.N5 : PAL.N2));
    b.set(cx + 5 - sk, y, PAL.N1);
  }
  // a line of text on the screen the model is writing (unreadable at this size: two cyan rows)
  rect(cx - 3, t + 8, 3, 1, b.ink(PAL.C4)); rect(cx - 3, t + 11, 2, 1, b.ink(PAL.C4));
  // the stand: a slim post and a foot on the floor
  const floor = Math.round(P([MONITOR.c[0], 0, 0])[1]);
  rect(cx + 1, bt + 1, 2, floor - bt - 2, b.ink(PAL.N3));
  rect(cx + 1, bt + 1, 1, floor - bt - 2, b.ink(PAL.N5));
  rect(cx - 6, floor - 1, 14, 2, b.ink(PAL.N2));
  rect(cx - 6, floor - 1, 14, 1, b.ink(PAL.N4));
};
/** a brass wall sconce with a small shade (it throws its light down the wall) */
const drawSconce = (b: OBuf, x: number, y: number) => {
  const rows = ['..oWWWo..', '.oWYYYWo.', 'oWYYYYYWo', '.ooyyyoo.', '...oBo...', '...oBo...', '..oBBBo..'];
  const pal: Record<string, number> = {o: PAL.N0, W: PAL.W5, Y: PAL.W8, y: PAL.W6, B: PAL.W3};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x - 4 + i, y - 3 + j, c); } });
};
/** the host's chair at the head, seen from the side (its back behind Mas, the seat, the legs) */
const drawHeadChair = (b: OBuf, x: number, seatY: number, floorY: number) => {
  b.cur = O.chair;
  for (let y = seatY - 44; y < floorY; y++) { b.set(x, y, PAL.N0); b.set(x + 1, y, y < seatY ? PAL.D2 : PAL.D1); b.set(x + 2, y, PAL.N0); }
  rect(x, seatY - 45, 3, 1, b.ink(PAL.D4));
  rect(x, seatY, 30, 3, b.ink(PAL.D1)); rect(x, seatY, 30, 1, b.ink(PAL.D3));
  for (let y = seatY + 3; y < floorY; y++) { b.set(x + 27, y, PAL.N0); b.set(x + 28, y, PAL.D1); }
};

// ------------------------------------------------------------------ the frame
export interface WideState {
  /** band rows on screen (67 full, 0 retracted) */
  band: number;
  /** the monitor flares one rung on the return (0..3) */
  flare?: number;
  /** Mas's eye dart (-1 toward the monitor: his default) */
  look?: -1 | 0 | 1;
  /** skip the band (the lift reads the room only) */
  noBand?: boolean;
}
/** who is where in the [W] (native x ranges of the present-day guests' drawings) */
export const WIDE_PEOPLE: Array<{who: 'gerg' | 'mario' | 'nole'; x0: number; x1: number}> = [{who: 'gerg', x0: 168, x1: 220}, {who: 'mario', x0: 238, x1: 294}, {who: 'nole', x0: 300, x1: 368}];
export const drawWide = (b: OBuf, f: number, s: WideState) => {
  const [wx, wy] = WIDE.wallCam;
  // ---- the wall (the WOODROSE's own) and the floor it stands on
  b.cur = O.wall;
  const Lw = rig(wx, wy);
  resolveWindow(wallLayer(), Lw, b, wx, wy);
  // the wall layer's floor rows are the floor
  const floorWallY = 236 - wy;
  for (let y = floorWallY; y < H; y++) for (let x = 0; x < W; x++) b.own[y * W + x] = O.floor;
  b.cur = O.pendant;
  for (const px of PENDANTS_S) drawPendant(b, px, 36);
  for (const [sx, sy] of WIDE.sconces) drawSconce(b, sx, sy);
  // ---- guests along the far side (BACK layers): GERG, MARIO, NOLE; the empty chair at the end is TASYA's (he won't sit)
  b.cur = O.person;
  const gp = {...GERG_DEFAULT, type: gergTypeAt(f)};
  const GX = 168, GY = WIDE.back - GERG_TABLE_EDGE;
  blitImg(b, gergBack(gp), GX, GY);
  blitImg(b, marioImg({...MARIO_BASE, arm: 'chest'}), 238, WIDE.back - 40, {clip: (_x, y) => y < WIDE.back});
  blitImg(b, noleImg({...NOLE_BASE, arm: 'phone'}), 300, WIDE.back - 44, {clip: (_x, y) => y < WIDE.back});
  // ---- Mas at the head: his chair, the desk-tier drawing turned to face the far end (flipped), his legs under
  const seatY = WIDE.front + 10, floorY = WIDE.floorFront - 6;
  drawHeadChair(b, 56, seatY, floorY);
  b.cur = O.mas;
  const mp: MasDeskPose = {...MAS_DESK_DEFAULT, head: 'screen', light: 'monitor', look: s.look ?? 0, breathe: (Math.floor(f / 20) % 2) as 0 | 1};
  const MX = 62, MY = WIDE.back - MAS_DESK_EDGE + 2;
  blitImg(b, masDeskBack(mp), MX, MY, {flip: true, clip: (_x, y) => y < MY + 38});
  // his lap and legs (dark, the monitor's cyan catching the shin): hip -> knee under the cloth's end -> the floor
  for (let y = MY + 38; y < seatY; y++) rect(MX + 12, y, 22, 1, b.ink(y === MY + 38 ? PAL.G1 : PAL.G0));
  rect(MX + 30, seatY - 4, 14, 4, b.ink(PAL.G0));
  for (let y = seatY; y < floorY; y++) { rect(MX + 38, y, 5, 1, b.ink(PAL.N1)); b.set(MX + 43, y, PAL.C0); }
  rect(MX + 36, floorY - 2, 10, 2, b.ink(PAL.N0));
  // ---- the TABLE over everyone's lap
  b.cur = O.top;
  const Lt = rig(0, 0);
  resolveWindow(tableLayer(), Lt, b, 0, 0);
  for (let y = WIDE.front + 1; y <= WIDE.hem; y++) for (let x = WIDE.x0 - 3; x <= WIDE.x1 + 3; x++) if (b.own[y * W + x] === O.top) b.own[y * W + x] = O.drape;
  b.cur = O.under;
  rect(WIDE.x0 - 3, WIDE.hem + 1, WIDE.x1 - WIDE.x0 + 7, 5, b.ink(PAL.N0));
  // ---- FRONT layers
  b.cur = O.person;
  blitImg(b, gergFront(gp), GX, GY);
  b.cur = O.mas;
  blitImg(b, masDeskFront(mp), MX, MY, {flip: true, clip: (_x, y) => y < WIDE.front});
  // ---- on the cloth: places, the guests' wine, his water (one flat row), the LED candles, the laptop glint
  b.cur = O.prop;
  drawPlace(b, 131, WIDE.back + 2);
  for (const px of [192, 262, 326]) drawPlace(b, px, WIDE.back + 1);
  for (const gx of [207, 277, 341]) drawGlass(b, gx, WIDE.back + 3, true);
  b.cur = O.masGlass;
  const [gx, gy] = WIDE.glass;
  drawGlass(b, gx, gy, false);
  drawWaterLine(b, gx, gy);
  for (const [cx, cy] of WIDE.candles) { drawLEDCandle(b, cx, cy); b.cur = O.glow; flameGlow(b, cx, cy - 12, 8, 0, 0); }
  drawMonitor(b, s.flare ?? 0);
  // the monitor's face lights the near edge of the cloth and Mas's cheek (a rung, not a blend)
  // ---- the band (the adventure layout): it slides down out of frame in held steps
  if (!s.noBand && s.band > 0) drawBand(b, s.band, f);
};

/** The verb / inventory band, `rows` of it on screen (it slides down: its content moves, it is not cropped) */
export const drawBand = (b: OBuf, rows: number, f: number) => {
  const tmp = new Buf(W, H, PAL.N0);
  drawUI(tmp, {cutscene: false, sentence: '', f});
  const dy = 67 - rows;
  b.cur = O.band;
  for (let y = 203; y < H - dy; y++) for (let x = 0; x < W; x++) b.set(x, y + dy, tmp.c[y * W + x]);
};

/** Step every colour k rungs down its own ramp (the cutscene dim, the room going dark in whole rungs) */
export const stepFrame = (b: Buf, k: number, keep?: (i: number) => boolean) => {
  if (!k) return;
  for (let i = 0; i < b.c.length; i++) if (!keep || !keep(i)) b.c[i] = stepColor(b.c[i], -k);
};
void bayer; void line;
