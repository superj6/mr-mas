// MR. MAS — Ep2 v1 art: SET-02, THE BOARDROOM SÉANCE (sc 4), the ghosts (§2.3), GHOST-NOLE (§2.1) and the séance's
// props (§3). The room is Ep1's boardroom (shared/pixel/rooms/boardroom.ts, imported: Mas at the head, seat L, screen-
// left; the foot of the table, seat R, screen-right, where Nole drops through the ceiling), re-lit by candles only
// (kit `candleLight`, a palette walk to the warm ramp near a flame and to the night ramp away from them).
//   drawSeance(b, st, cast)   st: {f, candles: 'lit' | 'flare' | 'snuffed' (per-candle: out[]), board: true, planchette:
//                             [x, y] on the board (the letter it sits on) | 'corner' (the Go corner), hole: 0 none | 1
//                             tiles falling | 2 the hole | 3 the hole and the cable (Nole's) , orb: true (THE ORB hangs
//                             over the table like a chandelier), emptyChair: true (seat R, before Nole), lamp: Nole's
//                             post lamp at the foot (on/off), dark: 0..1 (the last candle)} · cast: {seated, hands, near}
//   drawGhost(b, x, y, g)     a ghost: an email thread of translucent reply chevrons in the candle's pool, its dated
//                             header (and the line it carries); the spirit-photo double exposure (2.G) is its dithered
//                             50 % and the faint second image 2 px offset. g.kind 'thread' | 'bang' (NOLE · JUST NOW,
//                             made of !) | 'cow' (the 2018 cow: chevrons, a charging cable for a tail, its plug ALSET)
//   drawGhostNole(b, x, y, p) GHOST-NOLE: Nole's rig rendered in the ghost treatment (pale, chevron-textured, 50 %),
//                             p.hoodie for 2018; holding up his dated header (p.header)
//   drawOuija(b, x, y, o)     the board: letters as reply chevrons, a Go-board corner (slate and shell stones in T3 cut
//                             paper when o.go), the plain brass-rimmed planchette (no pointer glyph: a planchette)
//   ouijaECU(b, f, o)         [ECU] the board close: the planchette on a letter; o.word spells as it glides
//   OUIJA_LETTERS             where each letter sits (for the planchette's path: O P E N / N O P E)
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {drawBoardroom, BR} from '../../../../../shared/pixel/rooms/boardroom';
import {noleImg, NOLE_BASE, NOLE_FOOT, NolePose} from '../../../../../shared/pixel/cast/nole';
import {drawOrb} from '../../../../../shared/pixel/cast/orb-medium';
import {blitImg} from '../../../../../shared/pixel/figure';
import {fill, dith, pt, pw, bpt, bpw, tiny, tinyWidth, candleLight, Flame, TR, RH, layer, put, paper, paperSprite, vramp} from '../kit';
import {seatedStaff} from '../cast/civic2';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ the board on the table
export const OUIJA = {x: 182, y: 150, w: 116, h: 22};
const ROWS = ['>>> A B C D E F G H I J K L M', 'N O P Q R S T U V W X Y Z >>>'];
/** the letters' centres (board-local, at the room's table scale) */
export const OUIJA_LETTERS: Record<string, [number, number]> = (() => {
  const out: Record<string, [number, number]> = {};
  ROWS.forEach((r, j) => { let x = 6; for (const ch of r.split(' ')) { if (ch.length === 1) out[ch] = [x + 2, 6 + j * 8]; x += ch.length === 3 ? 14 : 8; } });
  out['>>>'] = [8, 6];
  return out;
})();
/** the board at room scale (x, y = its top-left on the table; a slight perspective: the far edge 8 px narrower) */
export const drawOuija = (b: Buf, x: number, y: number, o: {go?: boolean; planchette?: [number, number] | null; glide?: number} = {}) => {
  const {w, h} = OUIJA;
  for (let j = 0; j < h; j++) { const inset = Math.round(((h - j) / h) * 4); for (let i = inset; i < w - inset; i++) b.set(x + i, y + j, j === 0 ? PAL.D4 : (i + j) % 9 === 0 ? PAL.D2 : PAL.D3); }
  fill(b, x + 4, y + h, w - 8, 2, PAL.D1);
  // the letters (cream on the wood): the reply chevrons at either end
  ROWS.forEach((r, j) => { let cx = x + 6; for (const ch of r.split(' ')) { tiny(b, ch, cx, y + 4 + j * 8, ch === '>>>' ? PAL.W7 : PAL.P1); cx += ch.length === 3 ? 14 : 8; } });
  // the Go-board corner (lower right): a grid of lines, a few stones
  if (o.go) {
    const gx = x + w - 26, gy = y + h - 12;
    fill(b, gx, gy, 22, 10, PAL.W5); for (let i = 0; i < 22; i += 4) fill(b, gx + i, gy, 1, 10, PAL.D2); for (let j = 0; j < 10; j += 3) fill(b, gx, gy + j, 22, 1, PAL.D2);
    for (const [sx, sy, c] of [[gx + 4, gy + 3, PAL.N1], [gx + 12, gy + 6, PAL.P2], [gx + 16, gy + 3, PAL.N1]] as Array<[number, number, number]>) fill(b, sx - 1, sy - 1, 3, 3, c);
  }
  // the planchette: a plain heart-shaped wooden piece with a brass rim and a clear window (no pointer glyph)
  if (o.planchette) {
    const [px, py] = o.planchette;
    const X = x + px, Y = y + py;
    for (let j = -5; j <= 5; j++) for (let i = -6; i <= 6; i++) { const d = Math.hypot(i / 6.2, (j + (j > 0 ? j * 0.25 : 0)) / 5.2); if (d < 1) b.set(X + i, Y + j, d > 0.78 ? PAL.W6 : d > 0.45 ? PAL.D4 : PAL.P1); }
    ellipse(X, Y, 2, 2, b.ink(PAL.C7)); b.set(X - 1, Y - 1, PAL.C9);
  }
};
/** [ECU] the board close, the planchette on a letter (letters legible in the 7 px face) */
export const ouijaECU = (b: Buf, f: number, o: {at?: string; word?: string; hands?: number; corner?: boolean} = {}) => {
  // the wood, the letters large, the chevrons
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x + Math.floor(y * 0.3)) % 37 < 2 ? PAL.D2 : PAL.D3);
  const L1 = '>>> A B C D E F G H', L2 = 'I J K L M N O P Q R', L3 = 'S T U V W X Y Z >>>';
  [L1, L2, L3].forEach((r, j) => bpt(b, r, 240 - Math.round(bpw(r) / 2), 40 + j * 40, j === 0 || j === 2 ? PAL.P1 : PAL.P1));
  // the letter under the planchette (big at the centre), the planchette over it with its brass rim and window
  const at = o.at ?? 'O';
  const pos: Record<string, [number, number]> = {};
  [L1, L2, L3].forEach((r, j) => { let cx = 240 - Math.round(bpw(r) / 2); for (const ch of r.split(' ')) { pos[ch] = [cx + Math.round(bpw(ch) / 2), 40 + j * 40 + 7]; cx += bpw(ch) + bpw(' '); } });
  const [px, py] = pos[at] ?? [240, 100];
  for (let j = -34; j <= 34; j++) for (let i = -40; i <= 40; i++) { const d = Math.hypot(i / 40, (j + (j > 0 ? j * 0.3 : 0)) / 34); if (d < 1) b.set(px + i, py + j, d > 0.86 ? (j < 0 ? PAL.W7 : PAL.W5) : d > 0.8 ? PAL.W3 : d > 0.42 ? (i < 0 ? PAL.D4 : PAL.D3) : b.get(px + i, py + j) === PAL.P1 ? PAL.P2 : PAL.C1); }
  ellipse(px, py, 16, 14, b.ink(PAL.W5)); // the window's brass ring
  for (let j = -13; j <= 13; j++) for (let i = -15; i <= 15; i++) if (Math.hypot(i / 15, j / 13) < 0.92) { const c = b.get(px + i, py + j); b.set(px + i, py + j, c === PAL.W5 ? PAL.D3 : c); }
  bpt(b, at, px - Math.round(bpw(at) / 2), py - 7, PAL.P2);
  if (o.word) bpt(b, o.word, 20, 172, PAL.W7);
  if (o.hands) {
    // three hands resting on the planchette (Mas's, a ghost's, Gerg's): plain, room-lit, the ghost's translucent
    const H = [[px - 52, py - 10, PAL.S4], [px + 30, py - 26, PAL.C6], [px + 26, py + 14, PAL.S3]] as Array<[number, number, number]>;
    H.slice(0, o.hands).forEach(([hx, hy, c], i) => { for (let j = 0; j < 12; j++) for (let k = 0; k < 22; k++) { if (i === 1 && (k + j) % 2) continue; const d = Math.hypot((k - 11) / 11, (j - 6) / 6); if (d < 1) b.set(hx + k, hy + j, k < 4 ? stepColor(c, -1) : c); } });
  }
};

// ------------------------------------------------------------------ the ghosts (2.G: the spirit photo inside the candle's pool)
export interface GhostSpec { kind: 'thread' | 'bang' | 'cow'; header: string; body?: string; size?: 1 | 2; rise?: number }
/** a translucent pixel: every other pixel (a 50 % ordered screen) in the ghost's pale ramp, lit from the candle below */
const ghostPx = (b: Buf, x: number, y: number, c: number) => { if (((x + y) & 1) === 0) b.set(x, y, c); else b.set(x, y, stepColor(b.get(x, y), 1)); };
/** one reply chevron `>` (7 x 7) in the ghost screen */
const chevron = (b: Buf, x: number, y: number, c: number, s = 1) => { for (let k = 0; k < 4 * s; k++) { ghostPx(b, x + k, y + k, c); ghostPx(b, x + k, y + 7 * s - k - 1, c); ghostPx(b, x + k + 1, y + k, c); ghostPx(b, x + k + 1, y + 7 * s - k - 1, c); } };
export const drawGhost = (b: Buf, x: number, y: number, g: GhostSpec) => {
  const s = g.size ?? 1, rise = g.rise ?? 1;
  const C = [PAL.C4, PAL.C6, PAL.C7, PAL.C8];
  if (g.kind === 'cow') {
    // a cow made of chevrons: the body a block of rows, legs, a head with horns; the charging cable tail, its plug ALSET
    const cells: Array<[number, number]> = [];
    for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) cells.push([i * 8, j * 8]);
    for (const [lx] of [[0], [16], [40], [48]]) for (let j = 4; j < 6; j++) cells.push([lx, j * 8]);
    cells.push([-10, -6], [-10, 2], [-18, -6], [-18, 2], [-24, 4]);
    for (const [cx, cy] of cells) chevron(b, x + cx, y + cy, C[(cx + cy) % 4 === 0 ? 3 : 2]);
    // horns, the eye
    line(x - 16, y - 7, x - 20, y - 14, b.ink(PAL.C8)); line(x - 6, y - 7, x - 4, y - 14, b.ink(PAL.C8)); fill(b, x - 14, y - 2, 2, 2, PAL.N0); fill(b, x - 26, y + 6, 6, 4, PAL.C7);
    // the cable tail and its plug (stamped ALSET)
    for (let k = 0; k < 26; k++) b.set(x + 56 + k, y + 4 + Math.round(Math.sin(k / 4) * 3) + Math.floor(k / 6), PAL.N4);
    fill(b, x + 80, y + 5, 24, 9, PAL.G5); fill(b, x + 104, y + 6, 4, 2, PAL.G6); fill(b, x + 104, y + 10, 4, 2, PAL.G6); tiny(b, 'ALSET', x + 82, y + 7, PAL.N1);
    // its chevron header, dated 2018
    ghostHeader(b, x - 10, y - 24, g.header, C);
    return;
  }
  // a thread: a column of chevron rows narrowing upward into a wisp, the body text inside, the header on top
  const rows = g.kind === 'bang' ? 6 : 7;
  for (let r = 0; r < rows; r++) {
    const n = Math.max(1, Math.round((rows - r) * 0.9 * rise));
    const w0 = n * 8 * s;
    for (let k = 0; k < n; k++) {
      const cx = x + Math.round((7 * 8 * s - w0) / 2) + k * 8 * s, cy = y + 60 * s - r * 8 * s;
      if (g.kind === 'bang') { for (let q = 0; q < 6 * s; q++) ghostPx(b, cx + 3, cy + q, C[3]); ghostPx(b, cx + 3, cy + 7 * s, C[3]); }
      else chevron(b, cx, cy, C[(r + k) % 2 ? 2 : 1], s);
    }
  }
  // the double exposure: a faint second image of the column, 2 px up-right
  for (let j = y + 10; j < y + 68 * s; j++) for (let i = x; i < x + 58 * s; i++) if (((i + j) & 3) === 0 && hash(i, j, 3) < 0.15) b.set(i + 2, j - 2, PAL.C3);
  ghostHeader(b, x, y - 4, g.header, C);
  if (g.body) {
    const lines = wrapTo(g.body, 160);
    const bx = x + 64 * s, by = y + 8;
    fill(b, bx - 2, by - 2, Math.max(...lines.map((l) => pw(l))) + 6, lines.length * 9 + 4, PAL.N0);
    lines.forEach((l, i) => pt(b, l, bx, by + i * 9, PAL.C7));
  }
};
const ghostHeader = (b: Buf, x: number, y: number, s: string, C: number[]) => {
  const w = pw(s) + 8;
  for (let j = 0; j < 11; j++) for (let i = 0; i < w; i++) ghostPx(b, x + i, y + j, j === 0 || j === 10 ? C[2] : C[0]);
  pt(b, s, x + 4, y + 2, PAL.C9);
};
const wrapTo = (s: string, w: number) => { const out: string[] = []; let cur = ''; for (const word of s.split(' ')) { const t = cur ? cur + ' ' + word : word; if (pw(t) > w && cur) { out.push(cur); cur = word; } else cur = t; } if (cur) out.push(cur); return out; };

// ------------------------------------------------------------------ GHOST-NOLE
const ghostMap = (hoodie: boolean) => (c: number) => {
  const L = lightness(c);
  if (hoodie && c !== PAL.N0) { /* the 2018 hoodie: his tee and jacket read as a soft grey hoodie (paler in the ghost) */ }
  return L > 0.55 ? PAL.C9 : L > 0.38 ? PAL.C8 : L > 0.24 ? PAL.C7 : L > 0.12 ? PAL.C6 : PAL.C4;
};
export const drawGhostNole = (b: Buf, footX: number, footY: number, p: {pose?: Partial<NolePose>; hoodie?: boolean; header?: string; flip?: boolean} = {}) => {
  const img = noleImg({...NOLE_BASE, ...(p.pose ?? {})});
  const t = layer(b.w, b.h);
  const x0 = footX - (p.flip ? img.w - 1 - NOLE_FOOT[0] : NOLE_FOOT[0]), y0 = footY - NOLE_FOOT[1];
  blitImg(t, img, x0, y0, {flip: p.flip, map: ghostMap(!!p.hoodie)});
  // the 2018 hoodie: a hood shape behind his neck and drawstrings
  if (p.hoodie) { for (let j = 0; j < 8; j++) for (let i = 0; i < 16; i++) if (Math.hypot((i - 8) / 8, (j - 4) / 4) < 1) t.set(x0 + 32 + i - 8, y0 + 22 + j, PAL.C6); line(x0 + 38, y0 + 30, x0 + 38, y0 + 38, t.ink(PAL.C9)); line(x0 + 42, y0 + 30, x0 + 42, y0 + 37, t.ink(PAL.C9)); }
  // the spirit photo: 50 % screen, a faint second image offset 2 px
  for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) {
    const v = t.c[y * t.w + x]; if (v === TR) continue;
    if (((x + y) & 1) === 0) b.set(x, y, v); else b.set(x, y, stepColor(b.get(x, y), 1));
    if (((x + y) & 3) === 1 && x + 2 < b.w && y - 2 >= 0) b.set(x + 2, y - 2, PAL.C4);
  }
  if (p.header) ghostHeader(b, x0 + 8, y0 - 14, p.header, [PAL.C4, PAL.C6, PAL.C7, PAL.C8]);
};

// ------------------------------------------------------------------ the room
export interface SeanceState {
  f: number;
  /** each candle on/off (6 table candles, left to right); a flare steps every flame up one rung */
  out?: boolean[];
  flare?: boolean;
  board?: boolean;
  planchette?: [number, number] | null;
  go?: boolean;
  hole?: 0 | 1 | 2 | 3;
  orb?: boolean;
  emptyChair?: boolean;
  lamp?: 'off' | 'on' | null;
  staff?: boolean;
}
export const SEANCE_CANDLES: Array<[number, number]> = [[150, 150], [176, 158], [232, 146], [300, 158], [330, 150], [392, 160]];
const candle = (b: Buf, x: number, y: number, on: boolean, flare: boolean, f: number) => {
  fill(b, x - 1, y - 6, 3, 7, PAL.P1); b.set(x - 1, y - 6, PAL.P2); fill(b, x - 2, y, 5, 1, PAL.W4);
  if (!on) { b.set(x, y - 7, PAL.N2); return; }
  const h = (flare ? 6 : 4) + ((Math.floor(f / 4) + x) % 3 === 0 ? 1 : 0);
  for (let j = 0; j < h; j++) { const w = j < h - 2 ? 1 : 0; for (let i = -w; i <= w; i++) b.set(x + i, y - 7 - j, j < 2 ? PAL.W8 : j < h - 1 ? PAL.W7 : PAL.W6); }
};
export const drawSeance = (b: Buf, st: SeanceState, cast: {seated?: (b: Buf) => void; hands?: (b: Buf) => void; near?: (b: Buf) => void; over?: (b: Buf) => void} = {}) => {
  const s: SeanceState = {board: true, planchette: [70, 6], go: true, hole: 0, orb: true, emptyChair: true, lamp: null, staff: true, ...st};
  const out = s.out ?? [];
  drawBoardroom(b, {f: s.f, plates: {}, rolodex: false, pendant: 0, noNear: false}, {
    seated: (bb) => {
      // three staffers holding hands along the far side (seats B, C, D), seated, turned to the board
      if (s.staff) for (const [sx, seed] of [[186, 3], [240, 6], [294, 9]] as Array<[number, number]>) blitImg(bb, seatedStaff({seed, pose: 'hold'}), sx - 12, 112);
      cast.seated?.(bb);
    },
    hands: (bb) => {
      if (s.board) drawOuija(bb, OUIJA.x, OUIJA.y, {go: s.go, planchette: s.planchette});
      SEANCE_CANDLES.forEach(([cx, cy], i) => candle(bb, cx, cy, !out[i], !!s.flare, s.f));
      if (s.lamp) { fill(bb, 412, 140, 2, 18, PAL.G3); fill(bb, 406, 136, 12, 5, PAL.G4); if (s.lamp === 'on') { fill(bb, 408, 141, 8, 1, PAL.W8); } }
      cast.hands?.(bb);
    },
    near: cast.near,
  });
  // the ceiling hole over the foot of the table (Nole's), the tiles, the cable
  if (s.hole) {
    const hx = 420, hy = 0;
    if (s.hole >= 2) { fill(b, hx - 22, hy, 44, 10, PAL.N0); for (let i = -22; i < 22; i += 3) b.set(hx + i, hy + 10 + (i % 2), PAL.G3); }
    if (s.hole === 1 || s.hole === 3) for (let k = 0; k < 7; k++) { const tx = hx - 24 + Math.floor(hash(k, 1, 4) * 48), ty = 12 + Math.floor(hash(k, 2, 4) * 120) + (s.f % 12) * 4; fill(b, tx, ty % 150, 7, 4, PAL.G4); fill(b, tx, ty % 150, 7, 1, PAL.G5); }
    if (s.hole === 3) { line(hx, 0, hx, 96, b.ink(PAL.G2)); line(hx + 1, 0, hx + 1, 96, b.ink(PAL.G4)); }
  }
  const flames: Flame[] = SEANCE_CANDLES.map(([x, y], i) => ({x, y: y - 9, r: s.flare ? 110 : 96, on: !out[i]}));
  if (s.lamp === 'on') flames.push({x: 412, y: 140, r: 60});
  candleLight(b, flames, {amb: 0.2});
  // THE ORB as the chandelier over the table (after the grade: its chrome carries the candles' warm points)
  if (s.orb) { line(240, 0, 240, 24, b.ink(PAL.N3)); drawOrb(b, 240, 38, 12, {look: [0, 0.6], aperture: 0.5}); for (const [cx] of SEANCE_CANDLES.slice(1, 5)) b.set(240 + Math.round((cx - 240) / 22), 47, PAL.W7); }
  cast.over?.(b);
};

export const ART: ArtAsset[] = [
  {
    id: 'set02-seance', manifest: 'SET-02 · the boardroom séance (night)', kind: 'set', name: 'The boardroom séance: candles, the board, the Orb as chandelier',
    file: 'sets/seance.ts', exports: 'drawSeance, SEANCE_CANDLES, drawOuija, OUIJA, OUIJA_LETTERS, ouijaECU', scenes: '4',
    note: 'Ep1\'s boardroom re-lit by six candles (a palette walk); the reply-chevron board with its Go corner; the empty chair; the ceiling hole and cable',
    stills: [
      {label: '[W] 4.01: candles only, the staff holding hands, the board and planchette, the Orb over the table, the empty chair at the foot', draw: (b) => drawSeance(b, {f: 0})},
      {label: '[W] 4.07: CRASH, the ceiling hole over the foot of the table, the tiles and the cable; one candle flared; the ghost of 2016 hanging', draw: (b) => drawSeance(b, {f: 5, hole: 3, flare: true}, {over: (bb) => drawGhost(bb, 64, 30, {kind: 'thread', header: 'FROM: ALYI · JAN 2016'})})},
      {label: '[ECU] the board: the plain brass-rimmed planchette on the O (no pointer glyph); three hands resting on it (4.12)', draw: (b) => { ouijaECU(b, 0, {at: 'O', hands: 3}); }},
    ],
  },
  {
    id: 'creature-ghosts', manifest: '§2.3 the ghosts · GHOST-NOLE', kind: 'creature', name: 'The ghosts (reply-chevron email threads), the cow, GHOST-NOLE',
    file: 'sets/seance.ts', exports: 'drawGhost, drawGhostNole', scenes: '4',
    note: 'translucent chevrons in a 50 % screen with a faint offset second image (2.G spirit photo); dated headers carry the record\'s words',
    stills: [{label: 'ghost 1 (ALYI · JAN 2016, "less open") · GHOST-NOLE "Yup" (2016) · the cow (2018, ALSET plug) · NOLE · JUST NOW (!) · GHOST-NOLE 2018 hoodie', draw: (b) => {
      vramp(b, 0, 0, 480, 203, [PAL.N0, PAL.W0, PAL.W1, PAL.N1]);
      drawGhost(b, 4, 24, {kind: 'thread', header: 'FROM: ALYI · JAN 2016', body: '"...IT WILL MAKE SENSE TO START BEING LESS OPEN."'});
      drawGhostNole(b, 300, 190, {header: 'RE: · 2016', pose: {arm: 'down'}});
      drawGhost(b, 40, 140, {kind: 'cow', header: '2018'});
      drawGhost(b, 196, 110, {kind: 'bang', header: 'NOLE · JUST NOW'});
      drawGhostNole(b, 420, 190, {hoodie: true, header: 'DEC 2018', pose: {arm: 'point'}, flip: true});
    }}],
  },
];
void rect; void poly; void bayer; void clamp; void dith; void tinyWidth; void put; void paper; void paperSprite; void BR;
