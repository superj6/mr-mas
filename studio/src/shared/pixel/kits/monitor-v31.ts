// MR. MAS — kit: THE MONITOR's v3.1 ITEMS (Ep1 script draft 7, script-v31-notes.md §4; new file, owned by the `v3-art-b`
// pass). Painters for kits/mas-monitor.ts (POV 380 x 186, OTS 258 x 138), for the dark room's plate screen (the mini,
// 96 x 60) and for rooms/darkroom-v31's big monitor in the two-shot (216 x 120). Each lays itself out for its buffer.
//   lobbyPainter(st)    v31-18.00 / 18.00b: the landlord's lobby in slate blue, on the news: TASYA with his key ring
//                       (`key` 0 twelve keys · 1 the thirteenth in his fingers · 2 hung, Atem blue), KRAM stepping in
//                       (`kram` 0 · 1 · 2) in a hoodie printed OPEN SOURCE; the monitor's own caption `MACROSOFT WELCOMES
//                       ATEM` and its date chip `JUL 18` (the rail stays out)
//   sirrahPainter(st)   v31-19.02: SIRRAH at a lectern, the A and I blocks waist-high, the news chyron typing on
//                       (`typed` characters): `VP SIRRAH: "AI is kind of a fancy thing. First of all, it's two letters."`,
//                       chip `JUL 12`
//   runnerPainter(st)   v31-19.03 (the big monitor of the one held two-shot): `item` 'pinky' (NEDIB's hands unrolling the
//                       PINKY PROMISE scroll across a desk, seven pinky-prints, one in NopeAI beige, `SIGNED: 7 AI COMPANIES`,
//                       chip `JUL 21`) · 'forum' (the tiled room, every hand down, then `hands` 1 = all up in one drawing,
//                       NOLE's hand the highest holding his phone; the plate `REMUHCS · ASKED THE ROOM: SHOULD GOVERNMENT
//                       REGULATE AI?`, the egg `BILLS: 0`, chip `SEP 13`)
//   paperPainter(st)    v31-20.07 / 20.08: NELEH's paper in a PDF viewer: `page` 'title' (`DECODING INTENTIONS`, the
//                       `NELEH` byline, the glowing-page icon, footnote numbers orbiting) · 'p29' (`research preview` in
//                       the paper's own quotes) · 'p30' (two small logos side by side, NopeAI's button and the
//                       lighthouse, and the held sentence); `thumb` 0..1 the scrollbar's thumb shrinking as it loads
//   withGergTile(p, st) 20.04 / 20.06: any painter with GERG's video tile in the screen's corner (cast/gerg-medium's
//                       2 AM tile, typing, his mouth on the line)
//   screenWake(k)       32.01 (v3.1): the tag's monitor lighting on its own: 0 off · 1 the backlight · 2 the desktop
//                       coming up · 3 screenDim
import {Buf, rect, line, ellipse, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {bigText, bigTextWidth, text, textWidth} from '../font';
import {pt, pw, pwrap} from './uitype';
import {isMini, eggCorner, screenDim, Painter} from './mas-monitor';
import {tasyaSpeakPortrait, drawTasyaKeyRing, TASYA_PORTRAIT_DEFAULT} from '../cast/tasya-speak';
import {kramBust, KRAM_BUST_DEFAULT} from '../cast/kram';
import {sirrahBust, SIRRAH_BUST_DEFAULT} from '../cast/sirrah';
import {drawBlocks} from './wh-props';
import {galleryTile, GALLERY_TILE} from '../cast/civic-extras';
import {drawGergMediumTile} from '../cast/gerg-medium';
import {putBustCut} from '../cast/civic-kit';
import {blitImg} from '../figure';
import type {Viseme} from '../cast/talk';

/** the monitor's own date chip (the news's, not the show's rail): a dark pill, top-left */
const chip = (scr: Buf, s: string) => { const w = pw(s) + 8; rect(4, 4, w, 11, scr.ink(PAL.N0)); rect(4, 4, 2, 11, scr.ink(PAL.C5)); pt(scr, s, 8, 6, PAL.P2); };
/** a news lower-third band across the screen's foot: its words typed on to `typed` characters (2 lines at most) */
const chyron = (scr: Buf, s: string, typed = 999, accent = PAL.R2) => {
  const lines = pwrap(s, scr.w - 16).slice(0, 2);
  const h = 6 + lines.length * 10;
  rect(0, scr.h - h, scr.w, h, scr.ink(PAL.N0)); rect(0, scr.h - h, scr.w, 1, scr.ink(accent)); rect(0, scr.h - h, 4, h, scr.ink(accent));
  let left = typed;
  lines.forEach((l, i) => { pt(scr, l.slice(0, Math.max(0, left)), 8, scr.h - h + 4 + i * 10, PAL.P2); left -= l.length + 1; });
};

// ------------------------------------------------------------------ the landlord's lobby (v31-18.00, 18.00b)
export interface LobbyV31State { key: 0 | 1 | 2; kram: 0 | 1 | 2; caption?: boolean; chip?: boolean; f?: number; }
const slateLobby = (scr: Buf) => {
  // slate walls, a slate floor, a long reception desk, the tall glass behind (cool daylight), no brand's mark
  const W = scr.w, H = scr.h, fy = Math.round(H * 0.72);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const glass = y < fy - 10 && x > W * 0.08 && x < W * 0.92 && (x % Math.max(24, Math.round(W / 8))) > 2;
    const c = y >= fy ? (bayer(x, y) < 0.3 ? PAL.N5 : PAL.N4) : glass ? (y < fy * 0.5 ? (bayer(x, y) < 0.5 ? PAL.N7 : PAL.N6) : PAL.N6) : PAL.N4;
    scr.set(x, y, c);
  }
  rect(0, fy - 1, W, 1, scr.ink(PAL.N8));
};
/** the thirteenth key, Atem blue (a key's bow and blade, at the portrait ring's size) */
const blueKey = (b: Buf, x: number, y: number, lean = 0) => {
  const K = ['.OOOO.', 'OhLLLO', 'OL..LO', 'OL..LO', '.OLLO.', '..LD..', '..LD..', '..LD..', '..LD..', '..LD..', '..LDLO', '..LD..', '..LDLO', '..OO..'];
  // the one blue key among the brass: pale Atem blue with a paper glint, so it reads against the slate and his blazer
  const pal: Record<string, number> = {O: PAL.F3, L: PAL.F6, h: PAL.P2, D: PAL.F5};
  K.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i + Math.round(j * lean), y + j, c); } });
};
export const lobbyPainter = (st: LobbyV31State): Painter => (scr, f) => {
  const W = scr.w, H = scr.h;
  if (isMini(scr)) {
    slateLobby(scr);
    // two small figures in the lobby (Tasya with the ring's glint, Kram grey), the caption band
    rect(Math.round(W * 0.3), Math.round(H * 0.32), 6, 18, scr.ink(PAL.N2)); rect(Math.round(W * 0.3), Math.round(H * 0.26), 6, 6, scr.ink(PAL.K3)); scr.set(Math.round(W * 0.3) + 7, Math.round(H * 0.5), PAL.W6);
    if (st.kram) { const kx = Math.round(W * (st.kram === 1 ? 0.72 : 0.6)); rect(kx, Math.round(H * 0.32), 7, 18, scr.ink(PAL.G2)); rect(kx + 1, Math.round(H * 0.26), 5, 6, scr.ink(PAL.S4)); rect(kx + 1, Math.round(H * 0.4), 5, 1, scr.ink(PAL.P2)); }
    if (st.caption !== false) { rect(0, H - 9, W, 9, scr.ink(PAL.N0)); rect(0, H - 9, 3, 9, scr.ink(PAL.C5)); rect(5, H - 6, W - 20, 2, scr.ink(PAL.P2)); }
    return;
  }
  slateLobby(scr);
  // TASYA left, his speaking portrait (the slate room is his own light), the key ring up; the thirteenth key
  const tx = Math.round(W * 0.12), ty = 10;
  // his speaking portrait straight onto the lobby (its own tile background left out: the lobby is his slate), the ring
  const jangle = (Math.floor((st.f ?? f) / 6) % 2) as 0 | 1;
  const inScr = (X: number, Y: number) => X >= 0 && Y >= 0 && X < W && Y < H;
  putBustCut(scr, tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'ring', mouth: 'smile', brow: 'warm', jangle}), tx, ty, H);
  drawTasyaKeyRing(scr, inScr, tx - 5, ty, jangle);
  const rcx = tx + 25, rcy = ty + 66; // the ring's centre (tasya-speak drawRing: ox + 30, oy + 66, ox = x - 5)
  if (st.key === 1) blueKey(scr, rcx - 17, rcy + 3, -0.35); // going on: its bow at the ring's left (clear of his face), the blade swinging out
  if (st.key === 2) blueKey(scr, rcx - 3, rcy + 12, 0.05); // hung, the newest, lowest, in front of the brass
  // KRAM steps into the lobby, frame right, facing her (the civic busts' own 3/4 view: never flipped, the hoodie's
  // words would mirror): his bust in the slate light, the words legible
  if (st.kram) putBustCut(scr, kramBust({...KRAM_BUST_DEFAULT}), Math.round(W * (st.kram === 1 ? 0.66 : 0.56)), 18, H);
  if (st.chip !== false) chip(scr, 'JUL 18');
  if (st.caption !== false) chyron(scr, 'MACROSOFT WELCOMES ATEM', 999, PAL.N7);
};

// ------------------------------------------------------------------ SIRRAH's two letters (v31-19.02)
export const SIRRAH_CHYRON = 'VP SIRRAH: "AI is kind of a fancy thing. First of all, it\'s two letters."';
export const sirrahPainter = (st: {typed?: number; mouth?: Viseme}): Painter => (scr, f) => {
  const W = scr.w, H = scr.h;
  // a generic event backdrop (blue fabric), the lectern's wood front, the blocks waist-high beside it
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, (x >> 3) % 2 ? PAL.F3 : PAL.F2);
  if (isMini(scr)) {
    drawBlocks(scr, 6, H - 12, 12, {});
    rect(Math.round(W * 0.55), Math.round(H * 0.25), 12, 16, scr.ink(PAL.U3)); rect(Math.round(W * 0.55) + 2, Math.round(H * 0.12), 8, 8, scr.ink(PAL.S3)); rect(Math.round(W * 0.55) + 1, Math.round(H * 0.1), 10, 4, scr.ink(PAL.B1));
    rect(Math.round(W * 0.5), Math.round(H * 0.5), 22, 18, scr.ink(PAL.D3));
    rect(0, H - 8, W, 8, scr.ink(PAL.N0)); rect(3, H - 5, Math.min(W - 6, (st.typed ?? 99) / 2), 2, scr.ink(PAL.P2));
    return;
  }
  // (the two-shot's big monitor, 216 x 120, is shorter than the POV: her face must clear the lectern and the chyron)
  const short = H < 150;
  drawBlocks(scr, short ? 10 : 22, H - (short ? 28 : 20), short ? 30 : 44, {});
  const img = sirrahBust({...SIRRAH_BUST_DEFAULT, arm: 'down', mouth: st.mouth ?? 'E'});
  // facing the blocks (the busts' own 3/4 view, never flipped: her sticky note is lettered)
  putBustCut(scr, img, Math.round(W * 0.48), short ? -6 : 8, H);
  // the lectern in front of her: wood, a plain panel (no seal), its sloped top with a lamp
  const lx = Math.round(W * 0.48) + 10, ly = Math.round(H * (short ? 0.64 : 0.6));
  for (let y = ly; y < H; y++) for (let x = lx; x < lx + 92; x++) b3(scr, x, y, y === ly ? PAL.D4 : (x - lx) % 23 === 0 ? PAL.D1 : PAL.D3);
  rect(lx + 30, ly - 2, 30, 2, scr.ink(PAL.W6));
  chip(scr, 'JUL 12');
  chyron(scr, SIRRAH_CHYRON, st.typed ?? 999);
};
const b3 = (b: Buf, x: number, y: number, c: number) => b.set(x, y, c);

// ------------------------------------------------------------------ the hands runner (v31-19.03)
export interface RunnerState { item: 'pinky' | 'forum'; hands?: 0 | 1; unroll?: number; }
/** a pinky-print (an oval, its ridges in arcs) with a signer's scribble under it; `beige` = NopeAI's (the button's
 *  colour); `sm` for the small screens */
const pinky = (b: Buf, x: number, y: number, beige: boolean, sm: boolean) => {
  const rx = sm ? 3 : 5, ry = sm ? 4 : 7, cx = x + rx, cy = y + ry;
  // ink on paper: the ridges in the ink's colour, the paper between them; NopeAI's print in its beige ink
  const ridge = beige ? PAL.W4 : PAL.N2, soft = beige ? PAL.W6 : PAL.G4;
  for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) {
    const d = Math.hypot(i / rx, j / ry);
    if (d > 1) continue;
    const ring = Math.floor(d * (sm ? 3 : 5) + 0.5);
    if (ring % 2 === 0 || d > 0.88) b.set(cx + i, cy + j, d > 0.88 && ring % 2 ? soft : ridge);
  }
  const sy = cy + ry + (sm ? 2 : 3);
  for (let i = -rx - 1; i <= rx + 1; i++) b.set(cx + i, sy + (Math.floor((i + 9) / 2) % 2), PAL.N4); // the scribble
};
/** NEDIB's hand gripping a scroll's roll (his navy sleeve, the white cuff, the fingers over the roll); side -1 = left */
const rollHand = (b: Buf, x: number, y: number, side: -1 | 1, sm: boolean) => {
  const hw = sm ? 8 : 14, hh = sm ? 7 : 12;
  for (let j = 0; j < hh; j++) for (let i = 0; i < hw; i++) {
    const knuckle = j < 3 && (i % (sm ? 3 : 4)) === (sm ? 2 : 3);
    b.set(x + i, y + j, j === 0 || i === 0 || i === hw - 1 ? PAL.S1 : knuckle ? PAL.S2 : j < hh / 2 ? PAL.S4 : PAL.S3);
  }
  const cx = side < 0 ? x - (sm ? 6 : 10) : x + hw - 2;
  rect(cx, y + hh - (sm ? 3 : 5), sm ? 8 : 12, sm ? 3 : 5, b.ink(PAL.P2)); // the cuff
  rect(side < 0 ? cx - (sm ? 14 : 30) : cx + (sm ? 6 : 10), y + hh - (sm ? 4 : 7), sm ? 16 : 32, sm ? 5 : 9, b.ink(PAL.N2)); // the sleeve going off
};
/** the forum's NOLE: the tiled drawing's size, but his own (black tee, the swept dark hair), his arm up past everyone's
 *  with his phone in it, filming */
const noleTile = (b: Buf, x: number, y: number, up: boolean, H: number, label: boolean) => {
  const rows = ['.....hhhhhh.......', '....hHHHHHHh......', '...hHH33444o......', '...hH33e4e4o......', '....o334444o......', '....o334mm4o......', '.....o33344o......', '......o334o.......', '..kkkkkkkkkkkk....', '.kKKKKKKKKKKKKk...', 'kKKKKKKKKKKKKKKk..', 'kKKKKKKKKKKKKKKk..'];
  const pal: Record<string, number> = {h: PAL.N0, H: PAL.N1, '3': PAL.S2, '4': PAL.S4, e: PAL.N0, m: PAL.S2, o: PAL.S0, k: PAL.N0, K: PAL.G0};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
  if (!up) return;
  const top = Math.max(6, y - Math.round(H * 0.3));
  rect(x + 13, top + 8, 3, y + 9 - (top + 8), b.ink(PAL.S3)); rect(x + 13, top + 8, 1, y + 9 - (top + 8), b.ink(PAL.S4)); // the bare arm (a tee)
  rect(x + 11, top, 7, 11, b.ink(PAL.N0)); rect(x + 12, top + 1, 5, 8, b.ink(PAL.C5)); b.set(x + 13, top + 2, PAL.C8); // the phone, filming
  rect(x + 11, top + 9, 7, 3, b.ink(PAL.S4));
  if (label) { const t = 'NOLE'; rect(x + 20, top + 1, pw(t) + 6, 10, b.ink(PAL.N0)); pt(b, t, x + 23, top + 2, PAL.P2); }
};
export const runnerPainter = (st: RunnerState): Painter => (scr, f) => {
  const W = scr.w, H = scr.h, sm = W < 300;
  if (st.item === 'pinky') {
    // a desk seen from the front, NEDIB's hands at the two rolled ends of the scroll, unrolling it across the desk
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, y < H * 0.3 ? (bayer(x, y) < 0.2 ? PAL.P0 : PAL.P1) : (x + y) % 17 === 0 ? PAL.D2 : PAL.D3);
    rect(0, Math.round(H * 0.3), W, 1, scr.ink(PAL.D4));
    const u = Math.max(0.2, Math.min(1, st.unroll ?? 1));
    const sx = sm ? 22 : 40, sw = Math.round((W - sx * 2) * u), sy = Math.round(H * 0.22), sh = Math.round(H * 0.62);
    rect(sx + 3, sy + 3, sw, sh, scr.ink(PAL.D1));
    rect(sx, sy, sw, sh, scr.ink(PAL.P2)); rect(sx, sy, sw, 1, scr.ink(PAL.W9)); rect(sx, sy + sh - 1, sw, 1, scr.ink(PAL.P0));
    for (const rxx of [sx - 4, sx + sw - 3]) { rect(rxx, sy - 3, 7, sh + 6, scr.ink(PAL.P1)); rect(rxx + 1, sy - 3, 1, sh + 6, scr.ink(PAL.W9)); rect(rxx + 6, sy - 3, 1, sh + 6, scr.ink(PAL.P0)); } // the rolls
    const t1 = 'PINKY PROMISE', t2 = 'SIGNED: 7 AI COMPANIES';
    const mid = sx + (sw >> 1);
    if (sm) { text(scr, t1, mid - (textWidth(t1) >> 1), sy + 5, PAL.N1); pt(scr, t2, mid - (pw(t2) >> 1), sy + 15, PAL.N4); }
    else { bigText(scr, t1, mid - (bigTextWidth(t1) >> 1), sy + 10, PAL.N1); pt(scr, t2, mid - (pw(t2) >> 1), sy + 30, PAL.N4); }
    // the seven pinky-prints in a row, one in NopeAI beige (the button's colour)
    const pitch = sm ? 18 : 34, n = Math.min(7, Math.max(0, Math.floor((sw - 10) / pitch)));
    const px0 = mid - Math.round(((n - 1) * pitch) / 2) - (sm ? 3 : 5);
    for (let i = 0; i < n; i++) pinky(scr, px0 + i * pitch, sy + (sm ? 30 : 52), i === 3, sm);
    rollHand(scr, sx - (sm ? 10 : 16), sy + (sh >> 1) - 6, -1, sm); rollHand(scr, sx + sw - 2, sy + (sh >> 1) - 6, 1, sm);
    chip(scr, 'JUL 21');
    return;
  }
  // the forum: rows of seated figures, every one the same drawing; hands down, then all up in one drawing, and NOLE's
  // the highest, filming on his phone
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, y < 14 ? PAL.D2 : bayer(x, y) < 0.2 ? PAL.D2 : PAL.D1);
  const up = st.hands === 1;
  const tile = galleryTile({gasp: false});
  const plate = 'REMUHCS · ASKED THE ROOM: SHOULD GOVERNMENT REGULATE AI?';
  const lines = pwrap(plate, W - 16);
  const ph = 4 + lines.length * 10;
  const pitchY = sm ? 18 : 22, rows = Math.max(2, Math.floor((H - ph - 22) / pitchY) + 1);
  const noleRow = rows - 2, noleX = Math.round(W * 0.64);
  for (let r = 0; r < rows; r++) {
    const y = 20 + r * pitchY;
    for (let x = -8 + (r % 2) * 9; x < W; x += GALLERY_TILE.w) {
      const isNole = r === noleRow && Math.abs(x - noleX) < GALLERY_TILE.w / 2;
      if (isNole) { noleTile(scr, x, y, up, H, !sm); continue; }
      blitImg(scr, tile, x, y);
      if (up) { rect(x + 13, y - 3, 2, 13, scr.ink(PAL.N3)); rect(x + 13, y - 3, 1, 13, scr.ink(PAL.N5)); rect(x + 12, y - 7, 4, 4, scr.ink(PAL.S4)); scr.set(x + 12, y - 7, PAL.S5); } // the same raised hand, tiled
    }
  }
  rect(0, H - ph, W, ph, scr.ink(PAL.N0)); rect(0, H - ph, W, 1, scr.ink(PAL.W5));
  lines.forEach((l, i) => pt(scr, l, 6, H - ph + 3 + i * 10, PAL.P2));
  if (up) { const e = 'BILLS: 0'; rect(W - pw(e) - 10, H - ph - 13, pw(e) + 6, 11, scr.ink(PAL.N0)); pt(scr, e, W - pw(e) - 7, H - ph - 11, PAL.G5); }
  chip(scr, 'SEP 13');
  void f;
};

// ------------------------------------------------------------------ NELEH's paper (v31-20.07, 20.08)
export const PAPER_P30 = '"…exactly the kind of frantic corner-cutting that the release of CHATGTP appeared to spur."';
export interface PaperState { page: 'title' | 'p29' | 'p30'; thumb?: number; }
export const paperPainter = (st: PaperState): Painter => (scr, f) => {
  const W = scr.w, H = scr.h;
  // the viewer: grey chrome, a white page centred, the scrollbar at the right
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, PAL.G1);
  const mini = isMini(scr);
  const px = Math.round(W * (mini ? 0.18 : 0.14)), pw2 = Math.round(W * (mini ? 0.62 : 0.66)), py = mini ? 3 : 8;
  rect(px + 2, py + 2, pw2, H, scr.ink(PAL.N0));
  rect(px, py, pw2, H, scr.ink(PAL.P2));
  // the scrollbar and its thumb (smaller as more pages load)
  const th = Math.max(4, Math.round((H - 8) * (1 - 0.8 * Math.min(1, st.thumb ?? 0))));
  const tyy = st.page === 'title' ? 4 : st.page === 'p29' ? Math.round((H - th) * 0.72) : Math.round((H - th) * 0.76);
  rect(W - 6, 4, 3, H - 8, scr.ink(PAL.G2)); rect(W - 6, tyy, 3, th, scr.ink(PAL.G5));
  if (!mini) pt(scr, st.page === 'title' ? '1 / 36' : st.page === 'p29' ? '29 / 36' : '30 / 36', 6, H - 12, PAL.G5);
  const greek = (y: number, w = pw2 - 24) => { for (let i = 0; i < w; i++) if (hash(i >> 1, y, 7) < 0.78 && (i + y) % 11 !== 0) scr.set(px + 12 + i, y, PAL.G4); };
  if (mini) {
    // the two-shot's small screen: the page's blocks, the title bar dark, the glow icon
    rect(px + 4, py + 6, pw2 - 8, 4, scr.ink(PAL.N2)); for (let y = py + 16; y < H; y += 3) rect(px + 4, y, pw2 - 8 - (y % 7), 1, scr.ink(PAL.G4));
    if (st.page === 'title') { rect(px + pw2 - 12, py + 3, 6, 6, scr.ink(PAL.W5)); scr.set(px + pw2 - 10, py + 5, PAL.P2); }
    return;
  }
  if (st.page === 'title') {
    // the title page: a series line, the title big, the byline, the glowing-page icon, footnotes orbiting it
    pt(scr, 'ISSUE BRIEF · OCTOBER 2023', px + 12, py + 12, PAL.G3);
    const t1 = 'DECODING', t2 = 'INTENTIONS';
    bigText(scr, t1, px + 12, py + 28, PAL.N1); bigText(scr, t2, px + 12, py + 46, PAL.N1);
    rect(px + 12, py + 66, 60, 2, scr.ink(PAL.C4));
    pt(scr, 'NELEH', px + 12, py + 74, PAL.N3);
    greek(py + 96); greek(py + 102); greek(py + 108, pw2 - 60);
    // the icon, top-right of the page, with the numbers going round it (Act Four's thread)
    const ic = new Buf(200, 50, PAL.P2); // wide enough for eggCorner's full-size drawing
    eggCorner(ic, f, 'tl');
    for (let j = 0; j < 46; j++) for (let i = 0; i < 66; i++) scr.set(px + pw2 - 74 + i, py + 10 + j, ic.get(i + 2, j + 2));
    return;
  }
  if (st.page === 'p29') {
    for (let k = 0; k < 6; k++) greek(py + 12 + k * 8);
    // the line with the two words in the paper's own quotation marks, legible
    const q = 'described the release as a "research preview"';
    const ql = pw(q) + 6 <= pw2 - 20 ? [q] : pwrap(q, pw2 - 26); // the two-shot's page is narrower: the line wraps
    ql.forEach((l, i) => { rect(px + 10, py + 62 + i * 11, pw(l) + 6, 11, scr.ink(PAL.W8)); pt(scr, l, px + 13, py + 64 + i * 11, PAL.N1); });
    for (let k = 0; k < 8; k++) greek(py + 71 + ql.length * 11 + k * 8, pw2 - 24 - (k === 7 ? 70 : 0));
    return;
  }
  // p. 30: the two small logos side by side (NopeAI's round button, the lighthouse), then the held sentence
  const lx = px + 16, ly = py + 14;
  ellipse(lx + 8, ly + 8, 8, 8, scr.ink(PAL.N1)); ellipse(lx + 8, ly + 8, 5, 5, scr.ink(PAL.P1)); // NopeAI's button mark
  const lh = lx + 34; rect(lh + 4, ly + 4, 6, 12, scr.ink(PAL.W3)); rect(lh + 3, ly + 2, 8, 3, scr.ink(PAL.N1)); rect(lh + 5, ly, 4, 2, scr.ink(PAL.W6)); rect(lh + 2, ly + 16, 10, 2, scr.ink(PAL.N1)); // the lighthouse
  greek(py + 40); greek(py + 48, pw2 - 60);
  const lines = pwrap(PAPER_P30, pw2 - 26);
  rect(px + 10, py + 58, pw2 - 20, lines.length * 10 + 6, scr.ink(PAL.W8));
  lines.forEach((l, i) => pt(scr, l, px + 13, py + 61 + i * 10, PAL.N1));
  for (let k = 0; k < 5; k++) greek(py + 70 + lines.length * 10 + k * 8);
};

// ------------------------------------------------------------------ GERG's tile in the corner (20.04, 20.06)
export const withGergTile = (paint: Painter, st: {mouth?: Viseme; typing?: boolean} = {}): Painter => (scr, f) => {
  paint(scr, f);
  const mini = isMini(scr);
  const w = mini ? 30 : Math.round(scr.w * 0.3), h = mini ? 20 : Math.round(w * 0.62);
  const x = scr.w - w - 3, y = scr.h - h - 3;
  rect(x - 1, y - 1, w + 2, h + 2, scr.ink(st.mouth && st.mouth !== 'rest' ? PAL.L3 : PAL.N3));
  drawGergMediumTile(scr, x, y, w, h, {head: st.mouth && st.mouth !== 'rest' ? 'talk' : 'type', mouth: st.mouth ?? 'rest', lid: 1}, {f, typing: st.typing ?? true, fit: true, calm: true});
  if (!mini) { rect(x, y + h - 11, pw('GERG') + 6, 11, scr.ink(PAL.N0)); pt(scr, 'GERG', x + 3, y + h - 9, PAL.L3); }
};

// ------------------------------------------------------------------ the tag's monitor, waking (32.01, v3.1)
export const screenWake = (k: 0 | 1 | 2 | 3): Painter => (scr, f) => {
  if (k >= 3) { screenDim(scr, f); return; }
  for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, k === 0 ? ((x + y) % 97 < 2 ? PAL.N1 : PAL.N0) : k === 1 ? PAL.N1 : bayer(x, y) < 0.5 ? PAL.N1 : PAL.N2);
  if (k === 2) { const c = new Buf(scr.w, scr.h, PAL.N1); screenDim(c, f); for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) if (bayer(x, y) < 0.5) scr.set(x, y, c.get(x, y)); }
};
void line; void textWidth; void bigTextWidth; void stepColor;
