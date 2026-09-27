// MR. MAS — kit: MAS'S MONITOR, the dark room's screen as a stage (Ep1 Act Three; new file, owned by the `v3-art-b` pass).
// Act Three's macro rides the monitor: the year arrives on it. Every monitor UI in this pass is a PAINTER,
// `(scr: Buf, f: number) => void`, that lays itself out for the buffer it's given, so the same item plays three ways:
//   [POV]     full-bleed, we're looking with him: drawMonitorPOV(b, f, paint) — the Act Four convention (kits/staff-
//             letter.ts S5.06): his monitor's screen at MON_POV (380 x 186) with a strip of its bezel on every side and,
//             past it on the right, the dark room's window (0 night · 1 one palette step greyer)
//   [OTS]     over his shoulder: drawMonitorOTS(b, f, paint) — the screen at MON_OTS (258 x 138) across the dark room
//             (soft, stepped down), his shoulder and the back of his head in the foreground, left
//   [2S·SCR]  the dark room's two-shot: pass the painter as rooms/darkroom-plate drawDarkPlate's `screen` (its virtual
//             screen is DPLATE_SCREEN_W x H = 96 x 60, sampled into the turned monitor)
// Painters shipped here: screenDim (the tag's monitor, sound off, nothing to read), screenScanlines (the Act Four
// screen texture, for a painter to finish with), eggCorner (a small thumbnail window in the screen's corner: Neleh's
// glowing paper, footnotes orbiting it, no title and no name).
import {Buf, rect, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {pt, pw} from './uitype';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DarkPlateOpts} from '../rooms/darkroom-plate';

export type Painter = (scr: Buf, f: number) => void;
export const MON_POV = {x: 18, y: 8, w: 380, h: 186};
export const MON_OTS = {x: 110, y: 22, w: 258, h: 138};
/** is this a full-size screen (POV / OTS) or the two-shot's small virtual one? painters branch on it */
export const isMini = (scr: Buf) => scr.w < 200;

// ------------------------------------------------------------------ the POV
const roomAround = (b: Buf, win: number) => {
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.25 ? PAL.N1 : PAL.N0);
  const wx = 412, wy = 0, ww = 68, wh = 132;
  const step = win >= 1 ? 1 : 0;
  for (let y = wy; y < wy + wh; y++) for (let x = wx; x < wx + ww; x++) {
    let c = y < 70 ? (bayer(x, y) < 0.4 ? PAL.N3 : PAL.N2) : (bayer(x, y) < 0.5 ? PAL.N2 : PAL.N1);
    if (y > 80 && hash(x >> 1, y >> 1, 7) < 0.05) c = PAL.W4;
    b.set(x, y, stepColor(c, step));
  }
  rect(wx - 3, wy, 3, wh + 3, b.ink(PAL.N0)); rect(wx, wy + wh, ww, 3, b.ink(PAL.N0)); rect(wx + 32, wy, 2, wh, b.ink(PAL.N0));
};
export const drawMonitorPOV = (b: Buf, f: number, paint: Painter, o: {window?: 0 | 1; scanlines?: boolean} = {}) => {
  const S = MON_POV;
  roomAround(b, o.window ?? 0);
  rect(S.x - 8, S.y - 6, S.w + 16, S.h + 14, b.ink(PAL.G0));
  rect(S.x - 8, S.y - 6, S.w + 16, 1, b.ink(PAL.G2));
  rect(S.x - 1, S.y - 1, S.w + 2, S.h + 2, b.ink(PAL.N0));
  b.set(S.x + S.w + 4, S.y + S.h + 4, PAL.L3);
  const scr = new Buf(S.w, S.h, PAL.N0);
  paint(scr, f);
  if (o.scanlines !== false) screenScanlines(scr);
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) b.set(S.x + x, S.y + y, scr.get(x, y));
};
/** the screen's texture: every third row a rung darker (the Act Four monitor's scanlines) */
export const screenScanlines = (scr: Buf) => { for (let y = 0; y < scr.h; y += 3) for (let x = 0; x < scr.w; x++) if (bayer(x, y) < 0.5) scr.set(x, y, stepColor(scr.get(x, y), -1)); };

// ------------------------------------------------------------------ the OTS
const otsCache = new Map<string, Buf>();
export const drawMonitorOTS = (b: Buf, f: number, paint: Painter, o: {plate?: DarkPlateOpts; key?: string} = {}) => {
  // the dark room behind the monitor, stepped down 3 rungs (soft), once per plate state
  const key = o.key ?? JSON.stringify(o.plate ?? {});
  let bg = otsCache.get(key);
  if (!bg) {
    bg = new Buf(480, 270, PAL.N0);
    const plate: DarkPlateOpts = {tally: 2, glass: true, ...o.plate};
    drawDarkPlate(bg, 0, plate); drawDarkPlateDesk(bg, 0, plate); drawDarkPlateFront(bg, 0, plate);
    // the camera has moved round behind him: the plate slid 60 px and softened
    const sh = new Buf(480, 270, PAL.N0);
    for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) sh.set(x, y, stepColor(bg.get(Math.min(479, x + 60), y), -3));
    bg = sh;
    otsCache.set(key, bg);
  }
  b.c.set(bg.c.subarray(0, 480 * 203));
  const T = MON_OTS;
  rect(T.x - 8, T.y - 8, T.w + 16, T.h + 16, b.ink(PAL.G1)); rect(T.x - 8, T.y - 8, T.w + 16, 1, b.ink(PAL.G3)); rect(T.x - 1, T.y - 1, T.w + 2, T.h + 2, b.ink(PAL.N0));
  const scr = new Buf(T.w, T.h, PAL.N0);
  paint(scr, f);
  screenScanlines(scr);
  for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) b.set(T.x + x, T.y + y, scr.get(x, y));
  rect(T.x + T.w / 2 - 12, T.y + T.h + 8, 24, 20, b.ink(PAL.G1));
  // the screen's light on the desk below it
  for (let y = T.y + T.h + 8; y < 203; y++) for (let x = T.x - 30; x < T.x + T.w + 30; x++) if (((x + y) & 3) === 0) b.set(x, y, stepColor(b.get(x, y), 1));
  // MAS in the foreground, left: the back of his head (hair in strands, the cowlick) and his hoodie's shoulder, a cyan
  // rim from the screen on the edges toward it
  const inHead = (x: number, y: number) => Math.hypot((x - 44) / 40, (y - 96) / 48) < 1;
  const inHood = (x: number, y: number) => Math.hypot((x - 40) / 56, (y - 150) / 26) < 1 && y > 124;
  const inSh = (x: number, y: number) => Math.hypot((x - 10) / 130, (y - 260) / 100) < 1;
  for (let y = 40; y < 203; y++) for (let x = 0; x < 180; x++) {
    const h = inHead(x, y), hd = inHood(x, y), s = inSh(x, y);
    if (!h && !hd && !s) continue;
    const rim = !(inHead(x + 1, y) || inHood(x + 1, y) || inSh(x + 1, y));
    b.set(x, y, h && !hd ? (rim ? PAL.C4 : (Math.floor((x * 0.6 + y) / 3) + (x >> 3)) % 3 === 0 ? PAL.B1 : PAL.B0) : hd ? (rim ? PAL.C3 : PAL.G1) : rim ? PAL.C3 : PAL.G0);
  }
  for (const [x, y] of [[46, 49], [47, 48], [48, 48], [49, 49]] as Array<[number, number]>) b.set(x, y, PAL.B2);
};

// ------------------------------------------------------------------ small painters
/** the tag's monitor: sound off, dim, nothing on it to read (a paused feed, blocks and a soft glow) */
export const screenDim: Painter = (scr, f) => {
  for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, bayer(x, y) < 0.2 ? PAL.N2 : PAL.N1);
  const k = isMini(scr) ? 1 : 4;
  for (let i = 0; i < 5; i++) { const y = Math.round(scr.h * (0.12 + i * 0.17)); rect(Math.round(scr.w * 0.08), y, Math.round(scr.w * (0.6 - (i % 2) * 0.12)), 2 * k, scr.ink(PAL.N3)); rect(Math.round(scr.w * 0.08), y, 3 * k, 2 * k, scr.ink(PAL.G2)); }
  // a muted-speaker glyph in the corner, the only thing lit
  const sx = scr.w - 8 * k, sy = 3 * k;
  rect(sx, sy + k, 2 * k, 2 * k, scr.ink(PAL.G3)); rect(sx + 2 * k, sy, k, 4 * k, scr.ink(PAL.G3)); scr.set(sx + 4 * k, sy + k, PAL.R2); scr.set(sx + 5 * k, sy + 2 * k, PAL.R2);
  void f;
};
/**
 * Neleh's paper egg (sc 21, the beat plan's 21.02): a small window in the screen's corner showing a paper glowing on a
 * desk with footnote numbers orbiting it. No title, no plate, no date, no name (zero read load; it waits for Act Four).
 */
export const eggCorner = (scr: Buf, f: number, corner: 'tl' | 'tr' | 'bl' | 'br' = 'br') => {
  const mini = isMini(scr);
  const w = mini ? 18 : 64, h = mini ? 13 : 44;
  const x = corner.endsWith('l') ? 2 : scr.w - w - 2, y = corner.startsWith('t') ? 2 : scr.h - h - 2;
  rect(x - 1, y - 1, w + 2, h + 2, scr.ink(PAL.N0)); rect(x, y, w, h, scr.ink(PAL.D1)); rect(x, y, w, 1, scr.ink(PAL.G3));
  // the paper, glowing: a pale page with a warm halo in stepped rings
  const cx = x + (w >> 1), cy = y + (h >> 1) + 1;
  const pwid = mini ? 5 : 14, ph = mini ? 6 : 18;
  for (let j = -ph; j <= ph; j++) for (let i = -pwid * 2; i <= pwid * 2; i++) { const d = Math.hypot(i / (pwid * 1.8), j / (ph * 0.9)); if (d < 1 && bayer(cx + i, cy + j) > d) scr.set(cx + i, cy + j, d < 0.6 ? PAL.W5 : PAL.W3); }
  rect(cx - (pwid >> 1), cy - (ph >> 1), pwid, ph, scr.ink(PAL.P2));
  if (!mini) for (let k = 0; k < 5; k++) rect(cx - 5, cy - 6 + k * 3, 10 - (k === 4 ? 4 : 0), 1, scr.ink(PAL.G5));
  // the footnote numbers orbiting it, stepping round on 8s
  if (!mini) {
    const nums = ['1', '2', '3', '4', '5'];
    const st = Math.floor(f / 8);
    nums.forEach((n, i) => {
      const a = ((i / nums.length) + st / 40) * Math.PI * 2;
      pt(scr, n, Math.round(cx + Math.cos(a) * 24 - 2), Math.round(cy + Math.sin(a) * 14 - 3), i % 2 ? PAL.W7 : PAL.P1);
    });
  } else for (let i = 0; i < 4; i++) { const a = ((i / 4) + Math.floor(f / 8) / 40) * Math.PI * 2; scr.set(Math.round(cx + Math.cos(a) * 7), Math.round(cy + Math.sin(a) * 4), PAL.W7); }
  void pw;
};
