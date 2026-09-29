// MR. MAS — mfinale: bar 9, the per-episode slot (Ep1).
//   9.1 f480 CHATGTP  insert: Mas's finger on a tiny beige button; a radial bloom re-skins the frame one rung
//                     brighter; the table-runner thread kinks straight up; the user odometer slams 1,000,000.
//   9.2 f495 FIRED.   hard cut, desaturated five-tile board call. The 1993 dialog returns; the pointer clicks
//                     Cancel and this time it works. Mas's tile GLYPH-dissolves into tokens and blows away.
//   9.3 f510 BACK.    colour slams back; the tokens fly home and snap to pixels; the interim hourglass
//                     shatters; the badge flips GUEST -> CEO (f518); the dialog re-pops with Cancel greyed.
//   9.4 f525          the reaction hearts (one blue) become an avalanche that carries the camera up; they
//                     cool into the first stars of the dusk sky.
import {Buf, W, H, rect, line, hash, clamp, bayer} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {Img, blitImg} from '../../shared/pixel/figure';
import {text, textWidth} from '../../shared/pixel/font';
import {compilePalette, PaletteSet} from '../../shared/pixel/palettes';
import {bayer4} from '../../shared/pixel/dither';
import {radialMask} from '../../shared/pixel/mask';
import {glyphDissolve, GlyphLayer, GlyphStyle} from '../../shared/pixel/glyph';
import {imgFromBuf, mapImg} from '../../shared/pixel/sprite';
import {alertDialog} from '../../shared/pixel/ui';
import type {SwitchSpec} from '../../shared/pixel/compose';
import {masPortrait} from '../../shared/pixel/cast/mas';
import {alyiPortrait} from '../../shared/pixel/cast/alyi';
import {lightPool} from '../../shared/pixel/cast/kit';
import {T} from './timeline';
import {newsPlate} from './type';
import {
  vegasBg, shelfBg, officeBg, camOffBg, nelehBust, madaBust, drawPointer, drawHeart, HEART_W,
  handImg, HAND_TIP, drawButton,
} from '../../shared/pixel/kits/callart';
import {drawSkyline} from './skyline';

// ================================================================== 9.1 CHATGTP (insert)
const PLATE: [number, number] = [150, 128]; // the button plate, top-left
const BTN: [number, number] = [PLATE[0] + 11, PLATE[1] + 10]; // button centre = the knee of the curve
const THREAD_Y = PLATE[1] + 25; // the runner, lying flat across the cloth, just under the plate
const KNEE_X = PLATE[0] + 62;

/** Candle-lit linen seen from above: a stepped light pool from a candle off the top-right edge. */
const CLOTH = [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.S3, PAL.S4, PAL.P1, PAL.P2];
const clothAt = (x: number, y: number, flick: number) => {
  const d = Math.hypot((x - 380 - flick) / 1.35, (y + 40) * 0.95);
  const v = 10.2 - d / 62;
  return CLOTH[clamp(Math.floor(v + (bayer(x, y) - 0.5) * 0.9), 0, CLOTH.length - 1)];
};
const cloth = (fb: Buf, k: number) => {
  const flick = [0, 1, 0, -1, 0, 0][Math.floor((k + 30) / 3) % 6];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) fb.set(x, y, clothAt(x, y, flick));
  // the NOPE AI neon hangs just above frame: its light still lies on the linen (NOPE red, AI cyan)
  for (let y = 0; y < 76; y++)
    for (let x = 170; x < 450; x++) {
      const u = (x - 170) / 280, d = Math.hypot((u - 0.5) * 2.1, y / 76);
      // NOPE on the left, AI on the right, the two lights interleaving (ordered) where they meet
      const red = u + (bayer(y, x) - 0.5) * 0.22 < 0.62;
      if (d > 1 || bayer(x, y) > Math.min(0.7, (1 - d) * (red ? 1.2 : 0.7))) continue;
      const c = fb.get(x, y);
      const light = c === PAL.P2 || c === PAL.P1;
      fb.set(x, y, red ? (light ? PAL.S5 : PAL.R2) : light ? PAL.K3 : PAL.C3);
    }
  // the dinner plate's rim, bottom-right (porcelain, a gold line, its shadow on the cloth)
  for (let y = 180; y < H; y++)
    for (let x = 330; x < W; x++) {
      const d = Math.hypot((x - 470) / 1.0, (y - 300) / 0.62);
      if (d < 150 && d > 146) fb.set(x - 3, y + 4, stepColor(fb.get(x - 3, y + 4), -2));
      if (d < 150) fb.set(x, y, d > 147 ? PAL.P1 : d > 145.5 ? PAL.W6 : d > 138 ? (bayer(x, y) < 0.5 ? PAL.P2 : PAL.P1) : d > 136 ? PAL.P0 : PAL.P2);
    }
  // crumbs: a few, hand-placed, each with a 1px shadow
  for (const [cx, cy] of [[96, 202], [101, 206], [262, 214], [300, 96], [228, 232]] as const) { fb.set(cx - 1, cy + 1, PAL.D3); fb.set(cx, cy, PAL.W6); }
};

/** the thread: 2px cyan, flat; from k>=1 it kinks up at the knee and races off the top edge */
const curveY = (x: number) => THREAD_Y - 3.2 * (Math.exp((x - KNEE_X) / 17) - 1);
const threadPts = (k: number): Array<[number, number]> => {
  const pts: Array<[number, number]> = [];
  for (let x = 0; x <= KNEE_X; x++) pts.push([x, THREAD_Y]);
  if (k <= 0) { for (let x = KNEE_X + 1; x < W; x++) pts.push([x, THREAD_Y]); return pts; }
  const top = [150, 100, 40, -10][Math.min(3, k - 1)];
  let px = KNEE_X, py = THREAD_Y;
  for (let x = KNEE_X + 0.25; x < W; x += 0.25) {
    const y = curveY(x);
    if (y < top) break;
    const X = Math.round(x), Y = Math.round(y);
    if (X !== px || Y !== py) { line(px, py, X, Y, (a, b) => pts.push([a, b])); px = X; py = Y; }
  }
  return pts;
};
const drawThread = (fb: Buf, k: number) => {
  const pts = threadPts(k);
  const hot = k >= 1;
  // soft light on the linen: an ordered-dither spill two pixels either side (cyan on cloth -> cooler rungs)
  for (const [x, y] of pts)
    for (let d = -3; d <= 3; d++) {
      const yy = y + d;
      if (Math.abs(d) < 2 || bayer(x, yy) > (hot ? 0.55 : 0.3) / Math.abs(d)) continue;
      const c = fb.get(x, yy);
      fb.set(x, yy, c === PAL.P2 || c === PAL.P1 ? PAL.C7 : c === PAL.P0 || c === PAL.D4 ? PAL.C4 : PAL.C2);
    }
  for (const [x, y] of pts) { fb.set(x, y, hot ? PAL.C8 : PAL.C6); fb.set(x, y + 1, hot ? PAL.C5 : PAL.C4); }
  // tokens riding the thread: short bright runs, moving toward the knee and then up it
  const n = pts.length;
  for (let i = 0; i < 18; i++) {
    const s = ((i * 37 + k * (hot ? 9 : 3)) % n + n) % n;
    for (let r = 0; r < 3; r++) { const p = pts[Math.min(n - 1, s + r)]; fb.set(p[0], p[1], PAL.C9); }
  }
};

/** Mechanical odometer: 7 drums; the value rolls on whole pixels and slams to 1,000,000 with a 1px kick. */
const ODO: [number, number] = [334, 24];
const drawOdometer = (fb: Buf, k: number) => {
  if (k < 2) return;
  const [ox, oy0] = ODO;
  const slam = 10;
  const kick = k === slam ? 1 : 0;
  const oy = oy0 + kick;
  const t = clamp((k - 2) / (slam - 2), 0, 1);
  const val = k >= slam ? 1000000 : Math.floor(1000000 * Math.pow(t, 2.6));
  const digits = 7, dw = 9, gap = 2, comma = 3;
  const wTot = digits * dw + (digits - 1) * gap + 2 * comma;
  rect(ox - 5, oy - 13, wTot + 10, 42, fb.ink(PAL.N0));
  rect(ox - 5, oy - 13, wTot + 10, 1, fb.ink(PAL.C5));
  text(fb, 'USERS', ox, oy - 10, PAL.N6);
  let x = ox;
  for (let i = 0; i < digits; i++) {
    const place = Math.pow(10, digits - 1 - i);
    const pos = (val / place) % 10; // continuous drum position
    const d0 = Math.floor(pos), fr = k >= slam ? 0 : pos - d0;
    const off = Math.round(fr * 11);
    rect(x, oy, dw, 13, fb.ink(PAL.P1));
    // the drum strip: the current digit with the next one rolling in from above
    const strip = new Buf(dw, 24, PAL.P1);
    text(strip, String((d0 + 1) % 10), 2, 1, PAL.N1);
    text(strip, String(d0), 2, 14, PAL.N1);
    for (let j = 0; j < 13; j++) for (let ii = 0; ii < dw; ii++) if (strip.get(ii, j + 11 - off) === PAL.N1) fb.set(x + ii, oy + j, PAL.N1);
    // drum curvature: the top and bottom rows fall into shade
    for (let ii = 0; ii < dw; ii++) { fb.set(x + ii, oy, PAL.P0); fb.set(x + ii, oy + 12, PAL.P0); fb.set(x + ii, oy + 1, stepColor(fb.get(x + ii, oy + 1), -1)); fb.set(x + ii, oy + 11, stepColor(fb.get(x + ii, oy + 11), -1)); }
    x += dw + gap;
    if (i === 0 || i === 3) { fb.set(x, oy + 11, PAL.P1); fb.set(x, oy + 12, PAL.P1); x += comma; }
  }
  if (k >= slam + 1) text(fb, '5 DAYS', ox, oy + 17, PAL.W7);
};

export const drawChat = (fb: Buf, g: number) => {
  const k = g - T.chat;
  cloth(fb, k);
  drawThread(fb, k);
  const press = k <= 1 ? 2 : k <= 3 ? 1 : 0;
  drawButton(fb, PLATE[0], PLATE[1], press === 2, k >= 1);
  const hi = handImg(press);
  const lift = press === 0 ? -3 : 0;
  const hx = BTN[0] - HAND_TIP[0], hy = BTN[1] - HAND_TIP[1] + lift;
  // its shadow falls down-left (the candle is up-right); the cloth steps two rungs darker under it
  for (let j = 0; j < hi.h; j++) for (let i = 0; i < hi.w; i++) if (hi.c[j * hi.w + i] >= 0) { const X = hx + i - 7, Y = hy + j + 9 - lift; fb.set(X, Y, stepColor(stepColor(fb.get(X, Y), -1), -1)); }
  blitImg(fb, hi, hx, hy);
  drawOdometer(fb, k);
};

/** The bloom: a radial render front from the button, one rung brighter behind it (+2 on the ring itself). */
export const chatSwitch = (g: number): SwitchSpec[] | null => {
  const k = g - T.chat;
  if (k < 0 || k >= 15) return null;
  const R = [4, 26, 60, 110, 175, 250, 340];
  if (k >= R.length) return [{type: 'step', k: 1}];
  const r = R[k];
  const disc = radialMask(BTN[0], BTN[1], r, 10);
  const ring = radialMask(BTN[0], BTN[1], r, 3).subtract(radialMask(BTN[0], BTN[1], Math.max(0, r - 7), 3));
  return [{type: 'step', k: 1, mask: disc}, {type: 'step', k: 1, mask: ring}];
};

// ================================================================== the call (9.2 - 9.4)
export const TW = 150, TH = 86;
export const TILES: Array<{id: 'mas' | 'alyi' | 'neleh' | 'mada' | 'off'; x: number; y: number; name: string}> = [
  {id: 'mas', x: 10, y: 17, name: 'MAS MANALT'},
  {id: 'alyi', x: 165, y: 17, name: 'ALYI'},
  {id: 'neleh', x: 320, y: 17, name: 'NELEH'},
  {id: 'mada', x: 88, y: 108, name: 'MADA'},
  {id: 'off', x: 243, y: 108, name: '(camera off)'},
];
const MAS_TILE = TILES[0];

/** Desaturated call: everything collapses onto the cool greys (G) — "90% desaturated". */
export const CALL_GREY: PaletteSet = compilePalette({
  id: 'CALL_GREY', label: 'CALL GREY', use: 'FIRED.: the board call, desaturated',
  colors: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  ramp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  mode: 'tone', levels: 3, pattern: bayer4, tone: {lo: 0.1, hi: 0.86, gamma: 0.9},
});

const label = (b: Buf, x: number, y: number, s: string, badge?: {text: string; col: number; flip?: number}) => {
  const w = textWidth(s) + 8;
  rect(x, y, w, 11, b.ink(PAL.N0));
  text(b, s, x + 4, y + 2, PAL.P1);
  if (badge) {
    const bw = textWidth(badge.text) + 6;
    const fl = badge.flip ?? 0; // 0 open, 1 half (edge-on), 2 thin
    const bx = x + w + 2;
    if (fl === 2) { rect(bx, y + 5, bw, 1, b.ink(badge.col)); return; }
    const hh = fl === 1 ? 5 : 11, yy = y + (11 - hh) / 2;
    rect(bx, yy, bw, hh, b.ink(badge.col));
    if (fl === 0) text(b, badge.text, bx + 3, y + 2, PAL.N0);
  }
};

const drawTile = (b: Buf, id: string, x: number, y: number, f: number) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + TW && py < y + TH;
  switch (id) {
    case 'mas':
      vegasBg(b, x, y, TW, TH, f);
      blitImg(b, masPortrait({mouth: 'rest', lid: 0, look: -1, brow: 0, light: 'monitor'}), x - 6, y - 12, {clip});
      break;
    case 'alyi':
      lightPool(b, x, y, TW, TH, TW * 0.8, TH * 0.9, TW * 0.7, TH * 0.9, PAL.N1, [[1, PAL.W0], [0.62, PAL.W1], [0.34, PAL.W2]]);
      blitImg(b, alyiPortrait({eyes: 'open', mouth: 'rest', t: 0}), x + 20, y - 12, {clip});
      break;
    case 'neleh':
      shelfBg(b, x, y, TW, TH);
      blitImg(b, nelehBust(), x + 38, y + 5, {clip});
      break;
    case 'mada':
      officeBg(b, x, y, TW, TH);
      blitImg(b, madaBust(), x + 40, y + 5, {clip});
      break;
    case 'off':
      camOffBg(b, x, y, TW, TH);
      break;
  }
};

/** the interim tile that takes Mas's slot while he is gone: an hourglass and a 72-hour clock */
const HOURGLASS = [
  'ooooooooo',
  '.oPPPPPo.',
  '.o.sss.o.',
  '..o.s.o..',
  '...o.o...',
  '...oso...',
  '..o.s.o..',
  '.o..s..o.',
  '.o.sss.o.',
  'ooooooooo',
];
const drawInterim = (b: Buf, x: number, y: number, shatter: number) => {
  rect(x, y, TW, TH, b.ink(PAL.N0));
  if (shatter < 0) { const s0 = 'interim'; text(b, s0, x + 4, y + TH - 11, PAL.G3); }
  const hx = x + TW / 2 - 4, hy = y + 24;
  if (shatter < 0) {
    HOURGLASS.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === 'o') b.set(hx + i, hy + j, PAL.G4); else if (c === 's') b.set(hx + i, hy + j, PAL.W6); else if (c === 'P') b.set(hx + i, hy + j, PAL.W4); } });
    const s1 = 'TTEMME', s2 = '72:00:00';
    text(b, s1, x + (TW - textWidth(s1)) / 2, hy + 14, PAL.G5);
    text(b, s2, x + (TW - textWidth(s2)) / 2, hy + 26, PAL.W6);
  } else {
    // shards: every glass pixel flies out on its own whole-pixel arc, then falls
    HOURGLASS.forEach((r, j) => {
      for (let i = 0; i < r.length; i++) {
        const c = r[i];
        if (c === '.' ) continue;
        const a = hash(i, j, 41) * Math.PI * 2, sp = 2 + hash(j, i, 42) * 5;
        const px = hx + i + Math.round(Math.cos(a) * sp * shatter), py = hy + j + Math.round(Math.sin(a) * sp * shatter + 0.9 * shatter * shatter);
        if (shatter > 4 && hash(i, j, 43) < 0.5) continue;
        b.set(px, py, c === 's' ? PAL.W6 : shatter > 2 ? PAL.G2 : PAL.G5);
      }
    });
  }
};

/** the call app around the tiles: a title bar, tile frames, a control bar */
const callChrome = (b: Buf, reactions: string | null, f: number) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  rect(0, 0, W, 11, b.ink(PAL.N2));
  rect(0, 11, W, 1, b.ink(PAL.N0));
  b.set(7, 5, PAL.R3); b.set(8, 5, PAL.R3); b.set(7, 4, PAL.R2); b.set(8, 6, PAL.R2);
  text(b, 'board sync', 14, 2, PAL.N6);
  const clock = '11:47';
  text(b, clock, W - 8 - textWidth(clock), 2, PAL.N6);
  for (const t of TILES) { rect(t.x - 1, t.y - 1, TW + 2, TH + 2, b.ink(PAL.N0)); rect(t.x - 2, t.y - 2, TW + 4, 1, b.ink(PAL.N2)); }
  // control bar (bottom right): mic, camera, share, leave, and the reactions counter
  const bx = 256, by = 236;
  rect(bx, by, 212, 18, b.ink(PAL.N2));
  rect(bx, by, 212, 1, b.ink(PAL.N3));
  const icon = (x: number, col: number) => { rect(x, by + 4, 14, 10, b.ink(PAL.N3)); rect(x + 5, by + 6, 4, 6, b.ink(col)); };
  icon(bx + 8, PAL.G4); icon(bx + 26, PAL.G4); icon(bx + 44, PAL.G4); icon(bx + 62, PAL.R2);
  rect(bx + 174, by + 4, 30, 10, b.ink(PAL.R1)); rect(bx + 179, by + 8, 20, 2, b.ink(PAL.P1));
  if (reactions) {
    drawHeart(b, bx + 84, by + 6, 2, [PAL.R1, PAL.R2, PAL.R3, PAL.W8]);
    text(b, reactions, bx + 92, by + 6, PAL.P1);
  }
  void f;
};

/** the full call frame (colour) with Mas's tile in state `mas`: 'live' | 'gone' | 'interim' | skip */
const drawCall = (b: Buf, g: number, o: {mas: 'live' | 'none' | 'interim'; badge?: {text: string; col: number; flip?: number}; shatter?: number; reactions?: string | null}) => {
  callChrome(b, o.reactions ?? null, g);
  for (const t of TILES) {
    if (t.id === 'mas') continue;
    drawTile(b, t.id, t.x, t.y, g);
    label(b, t.x + 2, t.y + TH - 13, t.name);
  }
  if (o.mas === 'live') { drawTile(b, 'mas', MAS_TILE.x, MAS_TILE.y, g); label(b, MAS_TILE.x + 2, MAS_TILE.y + TH - 13, MAS_TILE.name, o.badge); }
  if (o.mas === 'interim') drawInterim(b, MAS_TILE.x, MAS_TILE.y, o.shatter ?? -1);
};

/** capture Mas's tile (with its label) as an Img for the dissolve; `grey` pre-desaturates it */
const KEY = 0x010203;
const tileCache = new Map<string, Img>();
const masTileImg = (g: number, grey: boolean, badge?: {text: string; col: number}) => {
  const key = `${g}|${grey}|${badge?.text}`;
  let v = tileCache.get(key);
  if (v) return v;
  const t = new Buf(W, H, KEY);
  drawTile(t, 'mas', MAS_TILE.x, MAS_TILE.y, g);
  label(t, MAS_TILE.x + 2, MAS_TILE.y + TH - 13, MAS_TILE.name, badge);
  v = imgFromBuf(t, MAS_TILE.x, MAS_TILE.y, TW + 40, TH, KEY);
  if (grey) v = mapImg(v, (c, x, y) => CALL_GREY.map(c, x + MAS_TILE.x, y + MAS_TILE.y));
  tileCache.set(key, v);
  return v;
};

const DISSOLVE_STYLE: GlyphStyle = {cell: [2, 3], bloom: 0.55, tint: PAL.C6, tintAmt: 0.3};
const CLICK = T.fired + 3; // 498: the pointer clicks Cancel (this time it works)
const GONE0 = CLICK + 1; // 498: the tile starts to break
const DIALOG_BODY_FIRED = 'not consistently candid.';

export const drawFired = (fb: Buf, g: number): GlyphLayer[] => {
  const k = g - T.fired;
  drawCall(fb, g, {mas: g < GONE0 ? 'live' : g >= T.fired + 10 ? 'interim' : 'none', badge: {text: 'GUEST', col: PAL.G5}});
  const layers: GlyphLayer[] = [];
  if (g >= GONE0) {
    const img = masTileImg(GONE0, true, {text: 'GUEST', col: PAL.G5});
    layers.push(glyphDissolve(fb, img, MAS_TILE.x, MAS_TILE.y, {...DISSOLVE_STYLE, t: g - GONE0, frames: 12, wind: [7, -1.4], spread: 0.45, lead: 1, life: 9}));
  }
  // the dialog is back (1993's alert, same frame, same greyed Cancel... not this time)
  if (g < GONE0) {
    const dx = 145, dy = 72;
    alertDialog(fb, dx, dy, 190, {title: 'MAS MANALT', body: DIALOG_BODY_FIRED, buttons: ['Cancel', 'OK'], def: 1});
    // pointer glides in on 2s and clicks
    // the board's pointer glides in (whole px, on 1s) and clicks
    const px = [dx + 140, dx + 118, dx + 98, dx + 88][Math.min(3, k)], py = [dy + 78, dy + 62, dy + 52, dy + 48][Math.min(3, k)];
    drawPointer(fb, px, py, g === CLICK);
  }
  return layers;
};

/** Cancel button rect inside our dialog (for the pressed state, drawn in `after` on the click frame) */
export const cancelPressed = (b: Buf) => {
  const dx = 145, dy = 72, w = 190;
  // mirror alertDialog's layout: h = 34 + lines*11 + 26; buttons right-aligned, 44 wide, 10 apart
  const h = 34 + 11 + 26;
  const by = dy + h - 22;
  const okX = dx + w - 12 - 44, cx = okX - 10 - 44;
  rect(cx, by, 44, 14, b.ink(0x0e0e10));
  text(b, 'Cancel', cx + Math.round((44 - textWidth('Cancel')) / 2), by + 3, 0xe9e6da);
};

export const firedPalette = (g: number) => (g >= T.fired && g < T.back ? CALL_GREY : null);

export const drawBack = (fb: Buf, g: number): GlyphLayer[] => {
  const k = g - T.back;
  const flipAt = T.back + 8; // 518
  const badge = g < flipAt ? {text: 'GUEST', col: PAL.G5} : g === flipAt ? {text: 'GUEST', col: PAL.G5, flip: 1} : g === flipAt + 1 ? {text: 'CEO', col: PAL.C6, flip: 2} : g === flipAt + 2 ? {text: 'CEO', col: PAL.C6, flip: 1} : {text: 'CEO', col: PAL.C6};
  const FORM = 8;
  const formed = k >= FORM;
  drawCall(fb, g, {mas: formed ? 'live' : 'interim', badge, shatter: k < 6 ? k : 99});
  const layers: GlyphLayer[] = [];
  if (!formed) {
    const img = masTileImg(T.back, false, {text: 'GUEST', col: PAL.G5});
    layers.push(glyphDissolve(fb, img, MAS_TILE.x, MAS_TILE.y, {...DISSOLVE_STYLE, t: k, frames: FORM, wind: [7, -1.4], spread: 0.4, lead: 1, life: 6, reverse: true, seed: 23}));
  }
  // the dialog re-pops one beat later with Cancel greyed out again (the uncancellable dialog)
  if (k >= 11) alertDialog(fb, 300, 118, 150, {title: 'MAS MANALT', body: 'no equity.', buttons: ['Cancel', 'OK'], disabled: [0], def: 1});
  return layers;
};

// ================================================================== 9.4 the heart avalanche
interface Heart { x: number; y: number; x0: number; delay: number; size: number; blue: boolean; speed: number; }
const N_HEARTS = 1300;
/** Rest positions are in the skyline's own screen coords: the ones that stay become its first stars. */
export const HEARTS: Heart[] = Array.from({length: N_HEARTS}, (_, i) => {
  const blue = i === 311;
  const r = hash(i, 3, 71);
  const stays = blue || hash(i, 6, 71) < 0.09;
  const x = blue ? 322 : Math.floor(hash(i, 1, 71) * (W + 20)) - 10;
  return {
    x,
    // where the reaction bubbles up from: the bottom edge, bunched toward the reaction button
    x0: blue ? 342 : Math.round(342 + (hash(i, 7, 71) - 0.5) * 420 * Math.pow(hash(i, 8, 71), 0.6)),
    y: blue ? 38 : stays ? Math.floor(4 + hash(i, 2, 71) * 118) : Math.floor(-40 - hash(i, 2, 71) * 400),
    delay: blue ? 4 : Math.floor(Math.pow(hash(i, 4, 71), 1.3) * 7),
    size: blue ? 4 : r < 0.12 ? 1 : r < 0.3 ? 2 : r < 0.55 ? 3 : r < 0.8 ? 4 : 5,
    speed: 0.8 + hash(i, 5, 71) * 0.5,
    blue,
  };
});
const RED = [PAL.R1, PAL.R2, PAL.R3, PAL.W8];
const BLUE = [PAL.C3, PAL.C5, PAL.C7, PAL.C9];

export const drawHearts = (fb: Buf, g: number) => {
  const k = g - T.hearts;
  // the hearts crane the camera up: the call drops away; behind it, the dusk the skyline will pop into
  drawSkyline(fb, T.sky - 1, {bgOnly: true});
  // the call drops out of frame; reactions tick LETTER 745/770 before it goes
  const drop = Math.round(Math.pow(clamp((k - 1) / 6, 0, 1), 2) * 290);
  if (drop < H) {
    const call = new Buf(W, H, PAL.N1);
    drawCall(call, g, {mas: 'live', badge: {text: 'CEO', col: PAL.C6}, reactions: 'LETTER 745/770'});
    for (let y = drop; y < H; y++) for (let x = 0; x < W; x++) fb.set(x, y, call.get(x, y - drop));
  }
  // hearts: burst from the bottom, fan out, decelerate into their resting places; the ones that stay cool
  // and shrink into stars, the rest carry on out of the top of the frame
  const order = HEARTS.map((_, i) => i).sort((a, b) => HEARTS[a].size - HEARTS[b].size || a - b);
  for (const i of order) {
    const h = HEARTS[i];
    if (k < h.delay) continue;
    // near (big) hearts rush past, far (small) ones drift: the depth that sells the crane
    const dur = (h.blue ? 11 : 12 - h.size * 1.4) / h.speed;
    const t = clamp((k - h.delay) / dur, 0, 1);
    const e = 1 - Math.pow(1 - t, 2.2);
    const y = Math.round(290 + (h.y - 290) * e);
    const x = Math.round(h.x0 + (h.x - h.x0) * Math.pow(e, 0.7) + Math.sin(k * 0.6 + i) * (1 - e) * 2);
    if (y < -8) continue;
    const stays = h.y >= 0;
    const cool = stays ? clamp((t - 0.5) / 0.5, 0, 1) : 0;
    const size = h.blue ? (cool < 0.45 ? 4 : cool < 0.65 ? 3 : cool < 0.85 ? 2 : cool < 1 ? 1 : 0) : Math.max(0, Math.round(Math.min(h.size, stays ? 3 : 5) * (1 - cool)));
    const ramp = h.blue ? BLUE : cool < 0.3 ? RED : cool < 0.65 ? [PAL.R0, PAL.R1, PAL.R2, PAL.R3] : cool < 1 ? [PAL.N3, PAL.X1, PAL.X2, PAL.X3] : [PAL.P1, PAL.P1, PAL.P2, PAL.P2];
    const hw = HEART_W[size];
    drawHeart(fb, x - (hw >> 1), y - (hw >> 1), size, size === 0 && !h.blue ? [PAL.P1, starCol(i), PAL.P2, PAL.P2] : ramp);
  }
};
export const starCol = (i: number) => (hash(i, 9, 71) < 0.3 ? PAL.W8 : hash(i, 9, 71) < 0.6 ? PAL.P1 : PAL.N8);
/** the stars the hearts became (screen coords of the skyline's first frame) */
export const heartStars = () => HEARTS.map((h, i) => ({x: h.x, y: h.y, col: h.blue ? PAL.C8 : starCol(i), blue: h.blue})).filter((s) => s.y >= 0 && s.y < 150);

// ================================================================== headline plates (drawn in `after`: never remapped)
export const slotAfter = (ui: Buf, g: number) => {
  const PX = 22, PY = 228;
  if (g >= T.chat && g < T.fired) {
    const k = g - T.chat;
    // CHATGTP cuts in on the bloom ring (k=1), top-left over the linen
    newsPlate(ui, PX, PY - 10, 'CHATGTP', PAL.C7, 'NOV 2022', k - 1, {headCol: (x, y) => (y < 12 ? PAL.C9 : y < 20 ? PAL.C8 : PAL.C6)});
  } else if (g >= T.fired && g < T.back) {
    if (g === CLICK) cancelPressed(ui);
    newsPlate(ui, PX, PY, 'FIRED.', PAL.P2, null, g - T.fired, {headCol: PAL.P2});
  } else if (g >= T.back && g < T.hearts) {
    newsPlate(ui, PX, PY, 'BACK.', PAL.C7, null, g - T.back + 1, {headCol: (x, y) => (y < 12 ? PAL.C9 : y < 20 ? PAL.C8 : PAL.C6)});
  }
};
