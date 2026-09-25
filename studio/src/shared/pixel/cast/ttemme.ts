// MR. MAS — cast: TTEMME, "The 72-Hour CEO" (Ep1 act 4; new file, owned by the act-4 character artist).
// A livestream co-founder who ran the company for a weekend. Hoodie (an off-brand streaming purple), a headset
// with a boom mic, and the 72-HOUR HOURGLASS in his hand. He talks to "Chat" (the camera). Played sincere.
//   ttemmePortrait / drawTtemmePortrait  portrait (112x136): 6 mouths, 3 lids, eye dart, brows level / hype /
//                                        unsure, gaze to camera or down at the sand; the hourglass in his hand
//   drawChatOverlay                      the egg: a chat column scrolling up the side of his portrait, spamming F
//   drawHourglass                        the prop at 'room' and 'lg' scale: sand level, falling grain, the flip
//                                        (3 held drawings), the SHATTER (glass flies; the sand holds its shape
//                                        for one beat, then falls)
//   drawStickyNameplate / drawStickyNote the nameplate that is a sticky note: CEO (TEMP) (room scale + insert)
//   ttemmeBust / drawTtemmeTile          video-call tile; drawTtemmeMini
//   ttemmeRoom / drawTtemmeRoom          room sprite: standing / seated at the table, hourglass in hand or set down
import {Buf, rect, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {Adjust, FigureDef, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, blitTo, lightPool} from './kit';
import {Viseme} from './talk';
import {Clip, clipped, tileClip, bustY} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ============================================================ the hourglass
// sand: 0 = all sand in the top bulb (just flipped) .. 1 = all run through (the last grain). stream = a grain in
// the neck. flip: 'up' | 'side' (the one held drawing mid-flip; no rotation). shatter: frames since the glass broke.
export type HourglassSize = 'room' | 'lg';
export interface HourglassState { sand: number; stream?: boolean; flip?: 'up' | 'side'; shatter?: number; }
// 'lg': 19 x 31 (portrait / insert). g = glass edge, G = glass highlight, c = cap, C = cap light, p = post
const HG_LG = [
  'ccccccccccccccccccc',
  'cCCCCCCCCCCCCCCCCCc',
  '.p...............p.',
  '.p.gggggggggggg..p.',
  '.p.G...........g.p.',
  '.p.G...........g.p.',
  '.p.G...........g.p.',
  '.p..G.........g..p.',
  '.p..G.........g..p.',
  '.p...G.......g...p.',
  '.p....G.....g....p.',
  '.p.....G...g.....p.',
  '.p......G.g......p.',
  '.p.......g.......p.',
  '.p.......g.......p.',
  '.p.......g.......p.',
  '.p......g.G......p.',
  '.p.....g...G.....p.',
  '.p....g.....G....p.',
  '.p...g.......G...p.',
  '.p..g.........G..p.',
  '.p..g.........G..p.',
  '.p.g...........G.p.',
  '.p.g...........G.p.',
  '.p.g...........G.p.',
  '.p.gggggggggggg..p.',
  '.p...............p.',
  'ccccccccccccccccccc',
  'cCCCCCCCCCCCCCCCCCc',
  '.ccccccccccccccccc.',
  '...................',
];
const HG_ROOM = [
  'ccccccc',
  '.g...g.',
  '.g...g.',
  '..g.g..',
  '...g...',
  '..g.g..',
  '.g...g.',
  '.g...g.',
  'ccccccc',
];
// the bulbs' interiors per row (which columns can hold sand), derived from the glass outline
const interior = (rows: string[]) => rows.map((r) => {
  const idx = [...r].map((c, i) => (c === 'g' || c === 'G' ? i : -1)).filter((i) => i >= 0);
  if (idx.length < 2) return null;
  return [idx[0] + 1, idx[idx.length - 1] - 1] as [number, number];
});
const INT_LG = interior(HG_LG);
const INT_ROOM = interior(HG_ROOM);
const SAND = {s: PAL.W6, S: PAL.W7, d: PAL.W4};
const GLASS = {g: PAL.C3, G: PAL.C7, c: PAL.D3, C: PAL.D4, p: PAL.D2};

/** Draw the hourglass with its top-left at (x, y). */
export const drawHourglass = (b: Buf, x: number, y: number, st: HourglassState, o: {size?: HourglassSize; clip?: Clip; f?: number} = {}) => {
  const size = o.size ?? 'lg';
  const rows = size === 'lg' ? HG_LG : HG_ROOM;
  const intr = size === 'lg' ? INT_LG : INT_ROOM;
  const put = (X: number, Y: number, c: number) => { if (!o.clip || o.clip(X, Y)) b.set(X, Y, c); };
  if (st.flip === 'side') { drawHourglassSide(b, x, y, size, put); return; }
  const H = rows.length;
  const neck = rows.findIndex((r, j) => j > 2 && (r.match(/[gG]/g) ?? []).length === 1);
  // interior rows of each bulb
  const topRows: number[] = [], botRows: number[] = [];
  intr.forEach((iv, j) => { if (!iv || iv[1] < iv[0]) return; (j < neck ? topRows : botRows).push(j); });
  const cells = (list: number[]) => list.reduce((n, j) => n + (intr[j]![1] - intr[j]![0] + 1), 0);
  const total = Math.min(cells(topRows), cells(botRows));
  const fallen = Math.round(Math.max(0, Math.min(1, st.sand)) * total);
  const sh = st.shatter ?? -1;
  // sand: the top bulb drains from its top rows down (the level falls); the bottom bulb fills as a heap
  const sandPx: Array<[number, number, number]> = [];
  let left = total - fallen;
  for (let k = topRows.length - 1; k >= 0 && left > 0; k--) {
    const j = topRows[k]; const [a, c] = intr[j]!;
    const n = Math.min(left, c - a + 1), mid = (a + c) / 2;
    const cols = Array.from({length: c - a + 1}, (_, i) => a + i).sort((p, q) => Math.abs(p - mid) - Math.abs(q - mid)).slice(0, n);
    for (const i of cols) sandPx.push([i, j, 0]);
    left -= n;
  }
  left = fallen;
  for (let k = botRows.length - 1; k >= 0 && left > 0; k--) {
    const j = botRows[k]; const [a, c] = intr[j]!;
    const n = Math.min(left, c - a + 1), mid = (a + c) / 2;
    const cols = Array.from({length: c - a + 1}, (_, i) => a + i).sort((p, q) => Math.abs(p - mid) - Math.abs(q - mid)).slice(0, n);
    for (const i of cols) sandPx.push([i, j, 1]);
    left -= n;
  }
  if (sh < 0) {
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = (GLASS as Record<string, number>)[r[i]]; if (c !== undefined) put(x + i, y + j, c); } });
    for (const [i, j] of sandPx) put(x + i, y + j, (i + j) % 5 === 0 ? SAND.S : SAND.s);
    if (st.stream && total - fallen > 0) for (let j = neck - 1; j <= neck + 1 + (size === 'lg' ? 3 : 0); j++) if (((j + (o.f ?? 0)) & 1) === 0) put(x + Math.floor(rows[0].length / 2), y + j, SAND.S);
    return;
  }
  // ---- the shatter. k = frames since. Glass pixels fly on their own whole-pixel arcs for ~8 frames and are gone;
  // the caps drop straight down; the sand keeps the hourglass's shape for one beat (15 frames), then falls.
  const k = sh;
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const ch = r[i];
      if (ch === '.') continue;
      const isCap = ch === 'c' || ch === 'C' || ch === 'p';
      if (isCap) {
        const drop = j < H / 2 ? Math.min(H - 6, Math.round(0.6 * k * k)) : 0;
        if (ch === 'p' && k > 1) continue;
        put(x + i, y + j + drop, (GLASS as Record<string, number>)[ch]);
        continue;
      }
      if (k > 8) continue;
      const a = hash(i, j, 41) * Math.PI * 2, sp = 1.2 + hash(j, i, 42) * 2.4;
      const px = x + i + Math.round(Math.cos(a) * sp * k), py = y + j + Math.round(Math.sin(a) * sp * k + 0.35 * k * k);
      if (k > 5 && hash(i, j, 43) < 0.5) continue;
      put(px, py, k < 3 ? PAL.C8 : k < 6 ? PAL.C5 : PAL.C3);
    }
  });
  const floorY = H - 4;
  for (const [i, j] of sandPx) {
    if (k < 15) { put(x + i, y + j, (i + j) % 5 === 0 ? SAND.S : SAND.s); continue; }
    // after the beat: every grain drops to a heap on the base (whole pixels, a little spread)
    const t = k - 15;
    const tgt = floorY - Math.floor(hash(i, j, 9) * 3);
    const yy = Math.min(tgt, j + Math.round(0.5 * t * t));
    const xx = i + (yy >= tgt ? Math.round((hash(j, i, 8) - 0.5) * 6) : 0);
    put(x + xx, y + yy, SAND.s);
  }
};
const drawHourglassSide = (b: Buf, x: number, y: number, size: HourglassSize, put: (x: number, y: number, c: number) => void) => {
  // on its side mid-flip: caps left and right, bulbs lying down, the sand slumped along the lower wall
  void b;
  const rows = size === 'lg'
    ? [
      '.........................',
      'cc.....................cc',
      'Cc.gggg...........gggg.cC',
      'Cc.g...ggg.....ggg...g.cC',
      'Cc.G......ggggg......g.cC',
      'Cc.G.................g.cC',
      'Cc.G......ggggg......g.cC',
      'Cc.Gsss.ggg.....gggssG.cC',
      'Cc.Gssss...........ssG.cC',
      'cc.GGGG...........GGGG.cc',
    ]
    : ['.......', 'c.ggg.c', 'cg.g.gc', 'cgsgsgc', 'c.ggg.c'];
  const dy = size === 'lg' ? 10 : 2;
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; const c = ch === 's' ? SAND.s : (GLASS as Record<string, number>)[ch]; if (c !== undefined) put(x - (size === 'lg' ? 3 : 1) + i, y + dy + j, c); } });
};
/** the flip as three held drawings from t0: upright (spent) 0-3, on its side 4-7, upright (full top) from 8 */
export const hourglassFlipAt = (f: number, t0: number): HourglassState => (f < t0 + 4 ? {sand: 1} : f < t0 + 8 ? {sand: 0.5, flip: 'side'} : {sand: 0});
/** sand level for "one pixel per beat": grains fallen since t0 at one per beat (15 frames) */
export const hourglassBeats = (f: number, t0: number, size: HourglassSize = 'lg') => {
  const cap = size === 'lg' ? 96 : 9;
  return Math.max(0, Math.min(1, Math.floor((f - t0) / 15) / cap));
};

// ============================================================ the sticky-note nameplate: CEO (TEMP)
/** insert scale: a yellow note, marker capitals, one curled corner; ~44 x 30. (x, y) top-left. */
export const drawStickyNote = (b: Buf, x: number, y: number, o: {clip?: Clip; tilt?: 0 | 1} = {}) => {
  const W = 46, H = 30;
  const put = (X: number, Y: number, c: number) => { if (!o.clip || o.clip(X, Y)) b.set(X, Y, c); };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const curl = i + (H - j) < 7;
    if (curl) continue;
    const c = j < 4 ? PAL.W8 : (i + j * 3) % 97 === 0 ? PAL.W8 : PAL.W7;
    put(x + i, y + j, c);
  }
  // the curled corner, bottom-right... drawn as its underside; the adhesive band is a hair paler at the top
  for (let j = 0; j < 6; j++) for (let i = 0; i < 6 - j; i++) put(x + W - 6 + i + j, y + H - 1 - j, i === 0 ? PAL.W5 : PAL.W6);
  for (let i = 0; i < W - 1; i++) put(x + i, y + H, PAL.W3);
  const tb = new Buf(W, H, 0xff00ff);
  text(tb, 'CEO', Math.round((W - textWidth('CEO')) / 2), 6, PAL.N1);
  text(tb, '(TEMP)', Math.round((W - textWidth('(TEMP)')) / 2), 17, PAL.N1);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (tb.get(i, j) === PAL.N1) {
    // marker: every glyph pixel, plus a 1px bleed to the right on vertical strokes (a felt tip, not a font)
    put(x + i, y + j + (o.tilt ? (i > W / 2 ? 1 : 0) : 0), PAL.N1);
    if (tb.get(i + 1, j) !== PAL.N1 && tb.get(i, j + 1) === PAL.N1) put(x + i + 1, y + j, PAL.N3);
  }
};
/** room scale: the note on a small nameplate stand on the table (9 x 6); text is a scribble at this size */
export const drawStickyNameplate = (b: Buf, x: number, y: number) => {
  rect(x, y + 4, 11, 2, b.ink(PAL.N0)); rect(x + 1, y + 3, 9, 1, b.ink(PAL.G2));
  rect(x + 1, y, 9, 4, b.ink(PAL.W7)); rect(x + 1, y, 9, 1, b.ink(PAL.W8));
  b.set(x + 2, y + 2, PAL.N1); b.set(x + 3, y + 1, PAL.N1); b.set(x + 5, y + 2, PAL.N1); b.set(x + 6, y + 1, PAL.N1); b.set(x + 7, y + 2, PAL.N1); b.set(x + 8, y + 2, PAL.N1);
  b.set(x + 9, y + 3, PAL.W5);
};

// ============================================================ the chat overlay (egg)
// A column of messages scrolling up the side of his portrait, all of them "F". The panel is a palette step
// down of whatever is under it (a translucent overlay without a blend). One row per 9 px; scrolls 1 px/2 frames.
const HANDLES = [PAL.C6, PAL.L3, PAL.W7, PAL.R3, PAL.U5, PAL.P2, PAL.C8, PAL.W5];
export const drawChatOverlay = (b: Buf, x: number, y: number, w: number, h: number, f: number, o: {clip?: Clip} = {}) => {
  const put = (X: number, Y: number, c: number) => { if (X >= x && Y >= y && X < x + w && Y < y + h && (!o.clip || o.clip(X, Y))) b.set(X, Y, c); };
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, stepColor(stepColor(b.get(x + i, y + j), -2), 0));
  const ROW = 11;
  const scroll = Math.floor(f / 2);
  const first = Math.floor(scroll / ROW);
  for (let r = -1; r < Math.ceil(h / ROW) + 1; r++) {
    const id = first + r;
    const yy = y + r * ROW - (scroll % ROW) + 2;
    if (yy < y - ROW || yy > y + h) continue;
    const hc = HANDLES[Math.floor(hash(id, 1, 77) * HANDLES.length)];
    const nameW = 3 + Math.floor(hash(id, 2, 77) * 5);
    // the handle: a coloured dash (unreadable at this size, on purpose: no real usernames)
    for (let i = 0; i < nameW; i++) put(x + 2 + i, yy + 3, hc);
    const reps = hash(id, 3, 77) < 0.75 ? 1 : 2;
    const msg = Array(reps).fill('F').join(' ');
    const tb = new Buf(40, 9, 0xff00ff);
    text(tb, msg, 0, 0, PAL.P2);
    for (let j = 0; j < 9; j++) for (let i = 0; i < 40; i++) if (tb.get(i, j) === PAL.P2) put(x + 4 + nameW + i, yy + j, PAL.P1);
  }
};

// ============================================================ conversation portrait (112 x 136)
export const TTEMME_PW = 112;
export const TTEMME_PH = 136;
export type TtemmeBrow = 'level' | 'hype' | 'unsure';
export interface TtemmePortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  brow: TtemmeBrow;
  /** 'cam' talks to Chat (the lens); 'sand' watches the hourglass */
  gaze?: 'cam' | 'sand';
}
export const TTEMME_PORTRAIT_DEFAULT: TtemmePortraitState = {mouth: 'rest', lid: 0, look: 0, brow: 'level', gaze: 'cam'};

const portraitFig = (s: TtemmePortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 74 ? jaw : 0) : v)));
  const parts: Part[] = [
    // the hood, bunched behind the neck; the hoodie shoulders
    {group: 'hood', mat: 'hood', tone: 1, prims: [P.poly(56, 98, 60, 88, 72, 82, 88, 85, 100, 94, 106, 108, 92, 106, 74, 101)]},
    {group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(2, 144, 5, 118, 13, 106, 27, 99, 42, 96, 70, 96, 88, 100, 102, 110, 110, 144)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(50, 78, 50, 98, 58, 101, 67, 97, 67, 74)]},
    {group: 'roll', mat: 'hood', tone: 2, prims: [P.poly(34, 101, 42, 95, 50, 97, 58, 99, 66, 98, 74, 96, 81, 97, 78, 102, 68, 105, 56, 106, 44, 105)]},
    // head: a rounder face, 3/4 toward camera-left
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 48, 24, 25),
      J(42, 28, 38, 35, 36, 42, 36, 48, 35, 53, 36, 58, 36, 64, 38, 71, 41, 77, 45, 82, 51, 85, 58, 84, 65, 80, 71, 74, 75, 66, 77, 56, 79, 46, 77, 35, 70, 27, 58, 23, 48, 23),
    ]},
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(72, 51, 76, 48, 80, 50, 81, 58, 78, 66, 73, 67, 71, 61)]},
    // short, slightly messy dark hair
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(36, 44, 34, 34, 38, 25, 46, 18, 57, 15, 69, 16, 79, 22, 85, 31, 86, 44, 84, 56, 80, 50, 77, 40, 72, 35, 64, 33, 56, 34, 48, 33, 42, 36, 38, 42),
      P.poly(40, 24, 36, 19, 42, 20, 45, 16, 49, 19, 54, 14, 57, 18, 62, 13, 64, 17, 70, 14, 70, 19, 60, 22, 48, 24),
    ]},
    // the headset: a band over the crown to the near ear cup; the cup; the boom mic to the mouth corner
    {group: 'band', mat: 'kit', tone: 2, prims: [P.poly(40, 30, 44, 20, 52, 14, 62, 12, 72, 15, 80, 22, 84, 32, 85, 46, 82, 46, 81, 33, 77, 24, 70, 18, 62, 16, 53, 17, 46, 22, 43, 30)]},
    {group: 'cup', mat: 'kit', tone: 2, prims: [P.ell(79, 57, 7, 9)]},
    {group: 'boom', mat: 'kit', tone: 2, prims: [P.poly(74, 63, 76, 65, 70, 72, 60, 77, 51, 78, 51, 76, 60, 75, 69, 70)]},
    {group: 'foam', mat: 'foam', tone: 2, prims: [P.ell(48.5, 77, 3.5, 3)]},
  ];
  const adjust: Adjust[] = [
    // ---- face: monitor-white key from camera-left (he faces his stream), the purple LED as the back-rim
    plane('skin', 4, P.poly(40, 37, 47, 35, 55, 36, 50, 39, 44, 40, 39, 42), P.poly(44, 47, 46, 47, 43, 58, 41, 60), J(37, 52, 39, 51, 40, 58, 37, 60), J(43, 79, 48, 78, 50, 82, 45, 83)),
    plane('skin', 5, P.line(42, 59, 42, 60), P.line(44, 37, 49, 36)),
    plane('skin', 2, J(63, 35, 69, 38, 71, 46, 71, 58, 71, 67, 67, 75, 61, 80, 57, 81, 61, 73, 64, 63, 64, 51, 62, 41)),
    toMat('skin', 'skinD', 2, J(69, 38, 75, 40, 78, 48, 77, 58, 75, 67, 71, 75, 64, 81, 58, 84, 57, 81, 61, 80, 67, 75, 71, 67, 71, 58, 71, 46)),
    plane('skin', 2, P.poly(39, 46, 45, 46, 45, 48, 39, 49), P.poly(50, 46, 63, 45, 65, 48, 51, 49)),
    plane('skin', 2, P.poly(46, 49, 48, 49, 49, 59, 46, 63, 44, 62)),
    toMat('skin', 'skinD', 3, J(48, 55, 52, 57, 52, 62, 47, 64)),
    toMat('skin', 'skinD', 2, J(40, 63, 47, 63, 46, 65, 41, 65)),
    plane('skin', 2, J(41, 75, 50, 75, 49, 77, 42, 77)),
    plane('neck', 0, J(51, 83, 56, 85, 64, 81, 70, 76, 69, 85, 60, 89, 51, 88)),
    toMat('skinD', 'skinD', 1, J(74, 53, 77, 52, 78, 58, 76, 62)),
    // ---- hair: tufts, the LED catching the back
    plane('hair', 1, P.line(72, 20, 62, 33), P.line(64, 17, 55, 32), P.line(80, 28, 70, 36), P.line(84, 40, 78, 52)),
    plane('hair', 3, P.poly(36, 33, 39, 26, 45, 21, 41, 28, 38, 35), P.line(49, 19, 53, 15), P.line(58, 17, 61, 14)),
    plane('hair', 4, P.line(37, 31, 40, 26)),
    // ---- the headset: a hard highlight along the band, the cup's padded ring, a status LED
    plane('kit', 4, P.line(46, 21, 52, 16), P.line(53, 16, 62, 14)),
    plane('kit', 1, P.line(80, 26, 83, 40)),
    toMat('kit', 'pad', 2, P.ell(78, 57, 4.5, 6.5)),
    plane('kit', 4, P.line(73, 62, 70, 70)),
    // ---- hoodie: purple; the rolled hood edge, the lit chest, the drawstrings, folds
    plane('hood', 3, P.poly(35, 101, 42, 96, 50, 98, 44, 100, 38, 103)),
    plane('hood', 1, P.poly(44, 104, 56, 105, 68, 104, 78, 101, 76, 103, 66, 106, 54, 107)),
    plane('hood', 3, P.poly(8, 118, 14, 107, 26, 101, 36, 99, 30, 105, 20, 112, 12, 124)),
    plane('hood', 4, P.poly(8, 115, 14, 106, 24, 101, 16, 109, 10, 118)),
    plane('hood', 1, P.line(62, 108, 71, 144), P.line(84, 106, 98, 144), P.poly(88, 108, 102, 114, 107, 144, 97, 144)),
    plane('hood', 4, P.line(47, 106, 45, 121), P.line(57, 107, 58, 119)),
    plane('hood', 0, P.line(48, 107, 46, 121), P.line(58, 107, 59, 118)),
  ];
  const L = s.gaze === 'sand' ? Math.max(1, s.lid) : s.lid;
  const near = L === 2
    ? ['..............', '..............', '..............', '..LLLLLLLLLLL.', '...kkkkkkkkk..']
    : L === 1
      ? ['..............', '...LLLLLLLL...', '.LLLLLLLLLLLL.', 'LwwwiIIIiwww..', '..kkkkkkkkk...']
      : ['...LLLLLLL....', '.LLLLLLLLLLL..', 'LwwiIIIgiwww..', '.wwiIIIIiww...', '..kkkkkkkk....'];
  const far = L === 2 ? ['.......', '.......', '.......', 'LLLLLL.', '.kkkk..'] : L === 1 ? ['.......', '.LLLL..', 'LLLLLL.', 'wiIIw..', '.kkk...'] : ['..LLL..', 'LLLLLL.', 'wiIgw..', 'wiIIw..', '.kkk...'];
  const look = s.gaze === 'sand' ? -1 : s.look;
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    ch.forEach((c, i) => { if (/[iIg]/.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
    return out.join('');
  });
  const B = s.brow;
  const nb = B === 'hype' ? -2 : 0;
  const nearBrow = B === 'unsure' ? ['bb............', '.bbbbbbbb.....', '........bbbbbb'] : B === 'hype' ? ['....bbbbbbb...', '..bbbbbbbbbbbb', 'bbb...........'] : ['.....bbbbbbb..', '..bbbbbbbbbbbb', 'bbbb..........'];
  const farBrow = B === 'unsure' ? ['....b.', '.bbbb.', 'bb....'] : ['.bbbbb', 'bbbb..', '......'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['..............', 'mmmmmmmmmmmm..', '..llllllll....'],
    smile: ['...........m..', 'mmmmmmmmmmm...', '..llllllll....'],
    A: ['..............', 'mmmmmmmmmmmm..', 'mtTTTTTTTTm...', 'mddddddddm....', '.mdggggdm.....', '..mmmmmm......', '...llll.......'],
    E: ['..............', 'mmmmmmmmmmmmm.', 'mtTTTTTTTTTm..', '.mddddddddm...', '..mmmmmmmm....', '...lllll......'],
    O: ['..............', '...mmmmmm.....', '..mddddddm....', '..mddddddm....', '...mmmmmm.....', '....llll......'],
    M: ['..............', 'mmmmmmmmmmmm..', '.MMMMMMMMMM...', '..llllllll....'],
  };
  const stamps: Stamp[] = [
    {x: 49, y: 41 + nb, rows: nearBrow, pal: {b: PAL.B0}},
    {x: 36, y: 42 + (B === 'hype' ? -1 : 0), rows: farBrow, pal: {b: PAL.B0}},
    {x: 49, y: 45 + (s.gaze === 'sand' ? 1 : 0), rows: dart(near, look * 2), pal: {L: PAL.N0, w: PAL.S5, i: PAL.B2, I: PAL.N0, g: PAL.P2, k: PAL.X1}},
    {x: 37, y: 45 + (s.gaze === 'sand' ? 1 : 0), rows: dart(far, look), pal: {L: PAL.N0, w: PAL.S4, i: PAL.B2, I: PAL.N0, g: PAL.P2, k: PAL.X1}},
    {x: 42, y: 62, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 39, y: 70, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.X0, l: PAL.X2, t: PAL.S4, T: PAL.P1, d: PAL.N0, g: PAL.S2}},
    // the headset's live LED on the cup (it is always live)
    {x: 83, y: 53, rows: ['r'], pal: {r: PAL.R3}},
  ];
  return {w: TTEMME_PW, h: TTEMME_PH, parts, adjust, stamps};
};
const PRIG: LightRig = {
  key: [-0.9, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'pad', 'foam'],
  back: [1, -0.1], backBand: 2,
  backRamp: {skin: PAL.U4, skinD: PAL.U3, hair: PAL.U3, hood: PAL.U4, kit: PAL.U3},
  ramps: {
    skin: [PAL.S0, PAL.X1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinD: [PAL.S0, PAL.S0, PAL.X1, PAL.X2, PAL.S3, PAL.S4],
    neck: [PAL.S0, PAL.X0, PAL.X1, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B3],
    hood: [PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.G5],
    kit: [PAL.N0, PAL.N1, PAL.G0, PAL.G1, PAL.G3, PAL.G4],
    pad: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2],
    foam: [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G2, PAL.G3],
  },
};
export const ttemmePortrait = memo((s: TtemmePortraitState) => renderFigure(portraitFig(s), PRIG));

// his near hand holding the hourglass up in front of him (bottom camera-left): fingers round the waist
const HOLD_HAND = [
  '.oo..oo..oo..',
  'o45oo45oo45o.',
  'o44544544543o',
  'o3444444443o.',
  '.o33333332o..',
  '..o222222o...',
  '...oooooo....',
];
/** Stream-room wall: dark, a purple LED strip's wash from camera-right, one soft key from the monitor at left. */
const bgStream = (b0: Buf, x: number, y: number, w: number, h: number, clip: Clip) => {
  const b = clipped(b0, clip);
  lightPool(b, x, y, w, h, w * 1.02, h * 0.35, w * 0.7, h * 0.9, PAL.N1, [[1, PAL.U0], [0.68, PAL.U1], [0.42, PAL.U2]]);
  // the LED strip: a vertical bar at the right edge, beaded
  for (let j = 4; j < h - 30; j++) b.set(x + w - 3, y + j, j % 3 === 0 ? PAL.U5 : PAL.U4);
  // acoustic foam tiles, upper left, barely lit
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const tx = x + 4 + c * 11, ty = y + 6 + r * 11;
    for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) b.set(tx + i, ty + j, ((i + j + r + c) & 3) === 0 ? PAL.N3 : PAL.N2);
  }
};
export interface TtemmeDrawOpts {
  /** hourglass sand 0..1 (null: not in his hand) */
  sand?: number | null;
  stream?: boolean;
  /** chat overlay phase (frames); null = off */
  chat?: number | null;
  f?: number;
  w?: number; h?: number; ox?: number;
}
export const TTEMME_HG_AT: [number, number] = [12, 84];
export const drawTtemmePortrait = (b: Buf, x: number, y: number, s: TtemmePortraitState, o: TtemmeDrawOpts = {}) => {
  const w = o.w ?? TTEMME_PW, h = o.h ?? TTEMME_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  bgStream(b, x, y, w, h, clip);
  blitTo(b, ttemmePortrait(s), x - ox, y, {clip});
  if (o.sand !== null && o.sand !== undefined) {
    const hx = x - ox + TTEMME_HG_AT[0], hy = y + TTEMME_HG_AT[1];
    drawHourglass(b, hx, hy, {sand: o.sand, stream: o.stream}, {size: 'lg', clip, f: o.f});
    const pal: Record<string, number> = {o: PAL.S0, '2': PAL.X1, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
    // the sleeve first (it runs out of the bottom of the frame), then the fingers curled round the base cap
    for (let j = 34; j < 60; j++) for (let i = 0; i < 13; i++) { const X = hx + 2 + i + Math.floor((j - 34) / 4), Y = hy + j; if (clip(X, Y)) b.set(X, Y, j === 34 || i === 0 || i === 12 ? PAL.N0 : i < 3 ? PAL.U3 : PAL.U1); }
    HOLD_HAND.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined && clip(hx + 3 + i, hy + 27 + j)) b.set(hx + 3 + i, hy + 27 + j, c); } });
  }
  if (o.chat !== null && o.chat !== undefined) drawChatOverlay(b, x + w - 24, y, 24, h, o.chat, {clip});
};

// ============================================================ video-call tile (webcam bust, 72 x 80)
export const TTEMME_BUST_W = 72, TTEMME_BUST_H = 80;
export interface TtemmeBustState { mouth: Viseme; lid: 0 | 1 | 2; }
const bustFig = (s: TtemmeBustState): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(0, 80, 3, 65, 12, 57, 24, 53, 36, 52, 48, 53, 60, 57, 69, 65, 72, 80)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(30, 40, 30, 55, 36, 58, 42, 55, 42, 40)]},
    {group: 'roll', mat: 'hood', tone: 3, prims: [P.poly(24, 55, 36, 58, 48, 55, 46, 60, 36, 62, 26, 60)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(22, 23, 23, 14, 28, 10, 36, 9, 44, 10, 49, 14, 50, 23, 50, 32, 47, 40, 42, 45, 36, 47, 30, 45, 25, 40, 22, 32)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [P.poly(21, 24, 21, 14, 25, 8, 31, 5, 36, 7, 40, 4, 45, 7, 50, 12, 51, 24, 49, 17, 44, 14, 36, 15, 28, 15, 24, 18)]},
    {group: 'band', mat: 'kit', tone: 2, prims: [P.poly(20, 26, 20, 14, 25, 6, 36, 3, 47, 6, 52, 14, 52, 26, 50, 26, 50, 15, 46, 8, 36, 5, 26, 8, 22, 15, 22, 26)]},
    {group: 'cups', mat: 'kit', tone: 2, prims: [P.ell(20, 29, 3.5, 5), P.ell(52, 29, 3.5, 5)]},
    {group: 'boom', mat: 'kit', tone: 2, prims: [P.poly(18, 33, 20, 34, 22, 39, 28, 41, 28, 43, 21, 41, 17, 35)]},
    {group: 'foam', mat: 'foam', tone: 2, prims: [P.ell(30, 42, 2.5, 2)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(26, 17, 32, 14, 40, 14, 46, 17, 40, 18, 32, 18), P.poly(35, 26, 37, 26, 37, 34, 35, 34)),
    plane('skin', 2, P.poly(47, 22, 50, 22, 49, 32, 46, 38, 45, 30), P.poly(28, 41, 36, 45, 44, 41, 40, 46, 32, 46)),
    plane('skin', 2, P.poly(37, 27, 39, 28, 39, 34, 37, 34)),
    plane('neck', 0, P.poly(30, 43, 36, 47, 42, 43, 42, 49, 36, 52, 30, 49)),
    plane('hood', 4, P.line(3, 65, 12, 58), P.line(12, 57, 22, 54)),
    plane('hood', 1, P.poly(60, 58, 68, 66, 70, 80, 62, 80, 60, 68), P.line(32, 62, 31, 76), P.line(40, 62, 41, 74)),
    plane('kit', 4, P.line(26, 7, 34, 4)),
  ];
  const eye = s.lid === 2 ? ['.....', '.....', 'LLLLL'] : s.lid === 1 ? ['.....', 'LLLLL', 'wIgw.'] : ['.LLL.', 'LwIgw', '.kkk.'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['.......', 'mmmmmmm', '.lllll.'], smile: ['m.....m', '.mmmmm.', '..lll..'],
    A: ['mmmmmmm', 'mTTTTTm', 'mdddddm', '.mdddm.', '..lll..'], E: ['mmmmmmm', 'mTTTTTm', '.mdddm.', '..lll..'],
    O: ['..mmm..', '.mdddm.', '.mdddm.', '..mmm..'], M: ['.......', 'mmmmmmm', '.MMMMM.', '.lllll.'],
  };
  const stamps: Stamp[] = [
    {x: 26, y: 22, rows: ['bbbbb...bbbbb'], pal: {b: PAL.B0}},
    {x: 27, y: 24, rows: eye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.P2, k: PAL.X1}},
    {x: 40, y: 24, rows: eye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.P2, k: PAL.X1}},
    {x: 35, y: 34, rows: ['o.o'], pal: {o: PAL.S1}},
    {x: 33, y: 38, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.X0, l: PAL.X2, T: PAL.P1, d: PAL.N0}},
    {x: 54, y: 28, rows: ['r'], pal: {r: PAL.R3}},
  ];
  return {w: TTEMME_BUST_W, h: TTEMME_BUST_H, parts, adjust, stamps};
};
export const ttemmeBust = memo((s: TtemmeBustState) => renderFigure(bustFig(s), {...PRIG, key: [-0.5, -0.8]}));
export const drawTtemmeTile = (b: Buf, x: number, y: number, w: number, h: number, s: TtemmeBustState, o: {sand?: number | null; f?: number} = {}) => {
  const clip = tileClip(x, y, w, h);
  bgStream(b, x, y, w, h, clip);
  blitImg(b, ttemmeBust(s), x + Math.round(w / 2 - TTEMME_BUST_W / 2), bustY(y, h, TTEMME_BUST_H), {clip});
  if (o.sand !== null && o.sand !== undefined) drawHourglass(b, x + Math.round(w / 2) + 30, y + h - 12, {sand: o.sand, stream: true}, {size: 'room', clip, f: o.f});
};
export const drawTtemmeMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.U0)); rect(x + w - 2, y + 1, 1, h - 6, b.ink(PAL.U4));
  const cx = x + Math.floor(w / 2);
  rect(cx - 9, y + h - 5, 18, 5, b.ink(PAL.U2));
  rect(cx - 4, y + 5, 8, 10, b.ink(PAL.S4));
  rect(cx - 4, y + 4, 8, 2, b.ink(PAL.B1));
  rect(cx - 5, y + 3, 10, 1, b.ink(PAL.G1)); rect(cx - 6, y + 4, 1, 6, b.ink(PAL.G1)); rect(cx + 5, y + 4, 1, 6, b.ink(PAL.G1));
  b.set(cx - 2, y + 9, PAL.N0); b.set(cx + 1, y + 9, PAL.N0);
  rect(cx - 1, y + 12, 3, 1, b.ink(PAL.S1));
  rect(cx + 7, y + h - 7, 3, 5, b.ink(PAL.W6));
};

// ============================================================ room sprite
// Standing (or seated at the table: the legs are the table's to hide), 3/4 facing screen-right. Arms: 'hold' the
// hourglass up at his chest; 'set' both hands forward at table height (on the hourglass, for the flip);
// 'down' hands at his sides (after it shatters). The hourglass is drawn by the caller with drawHourglass('room')
// at TTEMME_ROOM_HG[arm] so its sand and flip stay in sync with the insert.
export const TTEMME_W = 44;
export const TTEMME_H = 82;
export const TTEMME_FOOT: [number, number] = [20, 80];
export type TtemmeArm = 'hold' | 'set' | 'down';
export type TtemmeLight = 'room' | 'spot' | 'sil';
export interface TtemmeRoomPose { arm: TtemmeArm; mouth: 'rest' | 'open'; blink: boolean; light: TtemmeLight; }
export const TTEMME_ROOM_DEFAULT: TtemmeRoomPose = {arm: 'hold', mouth: 'rest', blink: false, light: 'room'};
/** top-left of the room-scale hourglass (7x9) for each arm pose (local, unflipped); null = not in hand */
export const TTEMME_ROOM_HG: Record<TtemmeArm, [number, number] | null> = {hold: [26, 21], set: [33, 36], down: null};
const RHEAD = [
  '....ohhhhhho....',
  '..ohHhHIIHhHho..',
  '.okkkkkHHHHHHho.',
  'okHHIIIHkkHHhho.',
  'kHHIIIHHHhk44o..',
  'kHHIHHHhh3444o..',
  'kKKHHhh23bb4bbo.',
  'kKKKh234e4e44o..',
  'kKKKh23444444o5.',
  '.kKKh233444445o.',
  '..kh1223344444o.',
  '...o12233344o...',
  '...o122mmmm4o...',
  '...o12233444o...',
  '....o122333o....',
  '.....oo1122o....',
  '.......o12o.....',
];
const rleg = (hip: number, kx: number, ax: number): Part[] => [];
void rleg;
const troomFig = (p: TtemmeRoomPose): FigureDef => {
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(hip, 46, 7.6, kx, 60, 6), seg(kx, 60, 5.8, ax, 75, 4.8), P.ell(kx, 60, 2.9, 2.7)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.6, 74, ax + 2.6, 74, ax + 6.6, 77, ax + 6.6, 80, ax - 3, 80)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'hood', prims: [P.ell(sx, sy, 3.8, 4), seg(sx, sy, 7, ex, ey, 6.2), seg(ex, ey, 6, hx, hy, 5.2), P.ell(ex, ey, 3, 3)]});
  const A = p.arm === 'hold' ? {n: [28, 34, 28, 29] as const, f: [15, 34, 16, 42] as const}
    : p.arm === 'set' ? {n: [29, 35, 34, 40] as const, f: [18, 36, 31, 41] as const}
      : {n: [27, 34, 27, 42] as const, f: [15, 34, 15.4, 42] as const};
  const parts: Part[] = [
    ...leg('legF', 16.5, 16.4, 16),
    sl('armF', 15, 24, A.f[0], A.f[1], A.f[2], A.f[3]),
    ...leg('legN', 22.5, 22.8, 23),
    // hoodie: boxy, the hood a lump behind the neck, the pocket
    {group: 'torso', mat: 'hood', prims: [P.poly(14, 20, 20, 18, 26, 19, 30, 24, 30, 34, 29, 42, 30, 48, 12, 48, 12, 40, 11, 32, 11, 24)]},
    {group: 'hoodlump', mat: 'hood', prims: [P.poly(11, 17, 17, 15, 19, 19, 13, 22)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(19, 15, 24, 15, 24, 19, 19, 19)]},
    sl('armN', 26, 24, A.n[0], A.n[1], A.n[2], A.n[3]),
  ];
  const rows = RHEAD.slice();
  if (p.blink) rows[7] = 'kKKKh234b4b44o..';
  if (p.mouth === 'open') { rows[12] = '...o122mMMm4o...'; rows[13] = '...o122MM344o...'; }
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [
    {x: 12, y: 0, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], b: ['hair', 0], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
      k: ['kit', 1], K: ['kit', 3],
    }},
    // the boom mic from the cup to the mouth corner
    {x: 15, y: 10, rows: ['k...', '.kk.', '...f'], pal: {k: ['kit', 1], f: ['kit', 3]}},
    hand(A.f[2], A.f[3] + 1), hand(A.n[2], A.n[3] + 1),
    // pocket seam + drawstrings
    {x: 16, y: 38, rows: ['kkkkkkkkk'], pal: {k: ['hood', 1]}},
    {x: 20, y: 20, rows: ['d.d', 'd.d', 'd.d', '..d'], pal: {d: ['hood', 5]}},
  ];
  return {
    w: TTEMME_W, h: TTEMME_H, parts,
    adjust: [{prims: [P.rect(0, 62, TTEMME_W, 20)], add: -1, onlyMat: 'pants'}],
    stamps,
  };
};
const TLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B3],
  hood: [PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.U4],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.G1, PAL.G3, PAL.G5, PAL.P2],
  kit: [PAL.N0, PAL.N0, PAL.G0, PAL.G1, PAL.G3, PAL.G4],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const dimR = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
const TSPOT = Object.fromEntries(Object.entries(TLIT).map(([k, r]) => [k, r.map((_, i) => r[Math.min(5, i + 1)])]));
const TSIL: Record<string, number[]> = Object.fromEntries(Object.keys(TLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
void dimR;
const troomRig = (light: TtemmeLight): LightRig => ({
  key: light === 'spot' ? [0.1, -1] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.C6, hair: PAL.C6, hood: PAL.C6, pants: PAL.C5, shoe: PAL.C4, kit: PAL.C6} : {skin: PAL.X2, hair: PAL.U2, hood: PAL.U3, pants: PAL.N4, shoe: PAL.N3, kit: PAL.U2},
  ramps: light === 'room' ? TLIT : light === 'spot' ? TSPOT : TSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 48 ? 1 : Math.max(0.25, 1 - (y - 48) / 34)),
});
export const ttemmeRoom = memo((p: TtemmeRoomPose) => renderFigure(troomFig(p), troomRig(p.light)));
/** Draw with the feet on (footX, footY); pass the hourglass state to draw it in his hands in sync. */
export const drawTtemmeRoom = (b: Buf, footX: number, footY: number, p: TtemmeRoomPose, o: {flip?: boolean; hourglass?: HourglassState | null; f?: number; map?: (c: number) => number} = {}) => {
  const fx = o.flip ? TTEMME_W - 1 - TTEMME_FOOT[0] : TTEMME_FOOT[0];
  const ox = footX - fx, oy = footY - TTEMME_FOOT[1];
  blitImg(b, ttemmeRoom(p), ox, oy, {flip: o.flip, map: o.map});
  const at = TTEMME_ROOM_HG[p.arm];
  if (at && o.hourglass) {
    const hx = o.flip ? TTEMME_W - at[0] - 7 : at[0];
    drawHourglass(b, ox + hx, oy + at[1], o.hourglass, {size: 'room', f: o.f});
  }
};
void bayer;
