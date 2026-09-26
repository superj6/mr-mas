// MR. MAS — shared room: the NOPEAI BOARDROOM, the MEDIUM PLATE (the table). Ep1 act 4 draft 3.1: the sc 27 [2S]s
// (NELEH + MADA: 27.11, 27.13, 27.14b, 27.32, 27.35, 27.36), 30.09 (MADA's [M] among the fires) and the calm-off
// (30.14, 30.17: MAS + MADA, the episode's one long hold). New file, owned by the act-4 medium-tier artist.
// The same room as rooms/boardroom.ts (the wide), a camera step closer and at table height: the far side of the long
// table across the frame, the medium rigs seated / standing behind its far edge. Behind them, left to right: the dark
// window onto the Valley (ALYI's reflection lives in the glass; the speed-dial wheel egg), the pendant's LED bar
// overhead (the key light, cyan family), the slatted back wall with the slot TASYA's slate-blue door appears in
// (27.32), the framed CHARTER, and at the right edge the chair with THE QUIET VOTE's laptop on it (camera off).
// On the table: THE PLAN's blueprint between the two of them (step 4 a blank line, then her `?`), the phones that
// buzz and walk themselves to the edge (27.11 / 27.13), the tent cards, and in sc 30 the fires (on the table, on a
// chair, on a nameplate), the keycaps bouncing, the term sheet and TERB's stamping hand.
// It is a plate, so with nobody in it it logs `[W]`; with the medium rigs in it, it's the `[2S]` / `[M]`.
// Light: key = the pendant (cyan), from above; ambient = night; the fires add tungsten pools (sc 30); the open door
// throws slate light. Lighting notes step the room down (`dim`); faces are never relit.
// DRAW ORDER:  drawBoardPlate (ceiling, pendant, window + reflection, wall, door, charter, the laptop chair, any
//              background chairs + their fires)  ->  anyone at room scale behind the table (TERB spraying)  ->  the
//              medium rigs' BACK images  ->  drawBoardPlateTable (the table top and everything on it)  ->  the rigs'
//              FRONT images (forearms on the table)  ->  drawBoardPlateFront (TERB's hand + the term sheet in his
//              grip, the vignette).
import {Buf, rect, line, poly, ellipse, bayer, clamp, hash} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import type {Img} from '../figure';
import {ROOM_W, ROOM_H, tiny, tinyWidth, vignette} from './kit-b';
import {drawQuietVoteTile} from '../cast/the-quiet-vote';

// the boardroom's own materials (defineMat: first definition wins, so these match rooms/boardroom.ts exactly)
defineMat('br.slate', ['N0', 'N1', 'G0', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'G0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'G0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('br.walnut', ['N0', 'D0', 'D1', 'D1', 'D2', 'D3', 'N5', 'N6'], ['N0', 'D0', 'D1', 'C0', 'C1', 'C2', 'C4', 'C6'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W6']);
defineMat('br.leather', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C3', 'C5'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W5']);
defineMat('br.bp', ['N1', 'F0', 'F1', 'F2', 'F2', 'F3', 'F3', 'F4'], ['N1', 'F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5'], ['N1', 'F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5']);
defineMat('br.bpInk', ['N2', 'F3', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7'], ['N2', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'], ['N2', 'F4', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']);
defineMat('br.brass', ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['D0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']);

// ------------------------------------------------------------------ geometry (frame coords, 480 x 203)
export const BPLATE = {
  /** the table's far edge: the rigs' TABLE rows sit on it */
  tableY: 132,
  /** the table's near edge; below it the dark */
  nearY: 184,
  ceilY: 6,
  pendant: {x0: 128, x1: 392, y: 12},
  win: {x0: 0, x1: 226, y0: 10, y1: 131, horizon: 66, mullions: [74, 150]},
  wall: {x0: 230},
  /** TASYA's door slot (outer frame), between the two figures */
  door: {x0: 250, x1: 296, y0: 24},
  charter: {x0: 420, x1: 462, y0: 22, y1: 70},
  /** THE QUIET VOTE: the laptop on a chair at the right edge (its screen rect) */
  laptop: {x0: 428, x1: 474, y0: 100, y1: 128},
  /** where the scenes put the medium rigs (top-left): left slot (NELEH standing / MAS seated), right slot (MADA) */
  left: {neleh: [66, 16] as [number, number], mas: [66, 48] as [number, number]},
  right: {mada: [318, 52] as [number, number]},
  /** the blueprint sheet on the table between them (a mild trapezoid) */
  bp: {x0: 112, x1: 242, y0: 138, y1: 164},
  /** the phones' home spots (they walk toward the near edge 3 px per held step) */
  phones: [[70, 160], [274, 148], [186, 172], [404, 156]] as Array<[number, number]>,
  /** the term sheet's spot between them (30.17) */
  termSheet: {x: 206, y: 150, w: 44, h: 22},
};
const B = BPLATE;

export interface BoardFire { at: 'table' | 'plate' | 'chair'; x: number; y?: number; state?: 'burn' | 'out'; outAt?: number; phase?: number }
export interface BoardPlateOpts {
  /** the back wall steps to MACROSOFT slate (27.32); a material swap on the wall only */
  slate?: boolean;
  /** TASYA's door: 0 none · 1..3 its held steps up out of the shadow · 4 there, shut, key in the lock · 5 open */
  door?: 0 | 1 | 2 | 3 | 4 | 5;
  /** ALYI's reflection in the window glass: an image stepped down k rungs (the city's brighter lights shine through) */
  reflection?: {img: Img; x: number; y: number; k?: number} | null;
  /** the speed-dial wheel egg in the Valley (27): true spins, 'still' parked (sc 30) */
  rolodex?: boolean | 'still';
  /** THE QUIET VOTE's laptop on the chair at the right edge */
  laptop?: boolean;
  /** the tent cards: name + x (their centre); `fire` sets one burning (sc 30) */
  plates?: Array<{name: string; x: number; fire?: boolean}>;
  /** the blueprint: false none · 0 step 4 blank · 1..3 NELEH's ? drawn in 3 strokes (hook, stem, dot) */
  blueprint?: false | 0 | 1 | 2 | 3;
  /** the phones: lit screens, the buzz (1 px jitter on alternate frames), the walk (0..6 held steps toward the edge) */
  phones?: {lit?: boolean; buzz?: boolean; step?: number} | null;
  /** sc 30: fires; each 'chair' fire also draws the empty chair back it burns on (at medium scale) */
  fires?: BoardFire[];
  /** sc 30: keycaps bouncing off the table (frames since they started, or null) */
  keycaps?: number | null;
  /** 30.17: the term sheet on the table ('blank' | 'stamped') and TERB's hand ('stamp' coming down on it | 'hand' holding it
   *  out to both of them), drawn by drawBoardPlateFront */
  termSheet?: 'none' | 'blank' | 'stamped';
  terbHand?: 'none' | 'stamp' | 'hand';
  /** lighting note: the room steps down k rungs behind the figures (never the faces) */
  dim?: 0 | 1 | 2 | 3;
  vignette?: boolean;
}

// ------------------------------------------------------------------ lights
const pendantCyan = (x: number, y: number, dim: number) => {
  // the LED bar over the table: a long pool on the table top, a softer wash on the wall and the figures
  const dx = x < B.pendant.x0 ? B.pendant.x0 - x : x > B.pendant.x1 ? x - B.pendant.x1 : 0;
  const onTable = y >= B.tableY ? clamp(1 - Math.abs(y - (B.tableY + 10)) / 44, 0, 1) : clamp(1 - (B.tableY - y) / 150, 0, 1) * 0.7;
  return clamp(1 - dx / 170, 0, 1) * onTable * Math.max(0, 1 - dim * 0.3);
};
const fireWarm = (fires: BoardFire[], f: number) => (x: number, y: number) => {
  let w = 0;
  for (const fr of fires) {
    if ((fr.state ?? 'burn') !== 'burn') continue;
    const fy = fr.y ?? (fr.at === 'chair' ? 96 : fr.at === 'plate' ? 150 : 160);
    const fl = [1, 0.88, 0.95][Math.floor((f + (fr.phase ?? 0) * 2) / 2) % 3];
    const d = Math.hypot((x - fr.x) / (fr.at === 'plate' ? 46 : 70), (y - fy) / (fr.at === 'plate' ? 34 : 50));
    w = Math.max(w, clamp(1 - d, 0, 1) * 0.9 * fl);
  }
  return w;
};

// ------------------------------------------------------------------ the far layer: ceiling, pendant, window, wall
const paintValley = (b: Buf, f: number, rolodex: boolean | 'still') => {
  const W = B.win, HZ = W.horizon;
  for (let y = W.y0; y <= W.y1; y++) for (let x = W.x0; x <= W.x1; x++) {
    const bz = bayer(x, y);
    let c: number;
    if (y < HZ) {
      const t = (y - W.y0) / (HZ - W.y0);
      c = t < 0.35 ? PAL.N1 : t < 0.6 ? (bz < (t - 0.35) / 0.25 ? PAL.N2 : PAL.N1) : t < 0.85 ? PAL.N2 : bz < (t - 0.85) / 0.15 ? PAL.U0 : PAL.N2;
    } else {
      const t = (y - HZ) / (W.y1 - HZ);
      c = t < 0.08 ? PAL.U0 : t < 0.3 ? PAL.N1 : PAL.N0;
    }
    b.set(x, y, c);
  }
  for (let k = 0; k < 30; k++) {
    const x = W.x0 + Math.floor(hash(k, 1, 3) * (W.x1 - W.x0)), y = W.y0 + 3 + Math.floor(hash(k, 2, 3) * (HZ - W.y0 - 16));
    b.set(x, y, hash(k, 3, 3) < 0.3 ? PAL.N5 : PAL.N3);
  }
  // the far ridge, then the city grid in perspective and the freeway river
  for (let x = W.x0; x <= W.x1; x++) {
    const r1 = HZ - 5 - Math.round(3 * Math.sin(x * 0.04) + 2 * Math.sin(x * 0.11 + 1) + (x < 60 ? (60 - x) * 0.1 : 0));
    for (let y = r1; y < HZ + 2; y++) b.set(x, y, y === r1 ? PAL.N2 : PAL.N1);
  }
  for (let row = 0; row < 30; row++) {
    const t = row / 29;
    const y = Math.round(HZ + 3 + Math.pow(t, 1.5) * (W.y1 - HZ - 3));
    const step = Math.max(2, Math.round(2 + t * 8));
    for (let x = W.x0 + (row * 3) % step; x <= W.x1; x += step) {
      const h = hash(x, row, 11);
      if (h > 0.6) continue;
      if (hash(x, row, 12 + Math.floor((f + x * 5 + row * 11) / 40)) > 0.93) continue;
      b.set(x, y, h < 0.08 ? PAL.C5 : h < 0.2 ? PAL.W6 : h < 0.45 ? PAL.W4 : PAL.W3);
      if (t > 0.55 && h < 0.3) b.set(x + 1, y, h < 0.15 ? PAL.W3 : PAL.W2);
    }
  }
  for (let x = W.x0; x <= W.x1; x++) {
    const yy = Math.round(HZ + 26 + (x - W.x0) * 0.14 + 4 * Math.sin(x * 0.025));
    const mv = (x + Math.floor(f / 2)) % 5;
    if (mv !== 2) b.set(x, yy, mv === 0 ? PAL.W7 : PAL.W4);
    if ((x + Math.floor(f / 2)) % 3 !== 1) b.set(x, yy + 2, (x + Math.floor(f / 2)) % 4 === 0 ? PAL.R2 : PAL.R1);
  }
  for (const [tx, th, tw] of [[128, 22, 9], [140, 30, 7], [114, 14, 6], [46, 12, 7], [196, 18, 8]] as const) {
    rect(tx, HZ - th, tw, th + 4, b.ink(PAL.N1));
    for (let y = HZ - th + 2; y < HZ + 2; y += 2) for (let x = tx + 1; x < tx + tw - 1; x += 2) if (hash(x, y, 31) < 0.35) b.set(x, y, hash(x, y, 32) < 0.5 ? PAL.W4 : PAL.C3);
    if (Math.floor((f + tx) / 18) % 2 === 0) b.set(tx + (tw >> 1), HZ - th - 1, PAL.R3);
  }
  if (rolodex) {
    // the giant speed-dial wheel, far off in the Valley: a ring of Rolodex cards, a card per 4 frames when spinning
    const cx = 92, cy = HZ - 16, r = 20, g = rolodex === 'still' ? 0 : Math.floor(f / 4);
    for (let a = 0; a < 64; a++) { const t = (a / 64) * Math.PI * 2; b.set(Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), PAL.N3); }
    for (let k = 0; k < 12; k++) {
      const t = ((k + g * 0.25) / 12) * Math.PI * 2;
      const x = Math.round(cx + Math.cos(t) * r), y = Math.round(cy + Math.sin(t) * r);
      line(cx, cy, x, y, (px, py) => { if (hash(px, py, 5) < 0.5) b.set(px, py, PAL.N2); });
      rect(x - 1, y, 3, 2, b.ink(PAL.P0)); b.set(x - 1, y, PAL.P1);
    }
    rect(cx - 1, cy - 1, 3, 3, b.ink(PAL.N4));
    line(cx - 6, HZ + 2, cx, cy, b.ink(PAL.N2)); line(cx + 6, HZ + 2, cx, cy, b.ink(PAL.N2));
  }
};
const paintReflection = (b: Buf, r: NonNullable<BoardPlateOpts['reflection']>) => {
  const W = B.win, k = r.k ?? 2;
  for (let j = 0; j < r.img.h; j++) for (let i = 0; i < r.img.w; i++) {
    const v = r.img.c[j * r.img.w + i];
    if (v < 0) continue;
    const X = r.x + i, Y = r.y + j;
    if (X < W.x0 || X > W.x1 || Y < W.y0 || Y > W.y1) continue;
    if (B.win.mullions.some((m) => X >= m && X <= m + 2)) continue;
    const c = stepColor(v, -k);
    // the city's brighter lights shine through him
    if (lightness(b.get(X, Y)) > lightness(c) + 0.12) continue;
    b.set(X, Y, c);
  }
};

const farCache = new Map<string, Buf>();
const paintWall = (slate: boolean, dim: number, doorStep: number): Buf => {
  const key = `${slate}|${dim}|${doorStep}`;
  const hit = farCache.get(key);
  if (hit) return hit;
  const out = new Buf(ROOM_W, ROOM_H, PAL.N0);
  const mb = new MatBuf(ROOM_W, ROOM_H);
  const wallMat = slate ? 'br.slate' : 'wall', slatMat = slate ? 'br.slate' : 'trim';
  rect(0, 0, ROOM_W, B.ceilY, mb.mat('black', 0.2));
  rect(0, B.ceilY - 1, ROOM_W, 1, mb.mat('trim', 0.6));
  rect(B.wall.x0, B.ceilY, ROOM_W - B.wall.x0, B.tableY - B.ceilY + 4, mb.mat(wallMat, 0));
  // the acoustic slats, a camera step closer: wider, every 10 px, each with a lit left edge
  for (let x = B.wall.x0 + 6; x < ROOM_W; x += 10) {
    rect(x, B.ceilY + 2, 2, B.tableY - B.ceilY, mb.mat(slatMat, -1.1));
    rect(x + 2, B.ceilY + 2, 1, B.tableY - B.ceilY, mb.mat(slatMat, 0.6));
  }
  for (let y = B.ceilY; y < B.tableY; y++) for (let x = B.wall.x0; x < ROOM_W; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
  // the window frame (the glass itself is emissive, painted after resolve)
  rect(B.win.x0, B.win.y0 - 4, B.win.x1 - B.win.x0 + 5, 4, mb.mat('metal', -1.1));
  rect(B.win.x1 + 1, B.win.y0 - 4, 4, B.tableY - B.win.y0 + 4, mb.mat('metal', -0.8));
  rect(B.win.x1 + 1, B.win.y0 - 4, 1, B.tableY - B.win.y0 + 4, mb.shade(1.4));
  // the framed CHARTER: brass frame, cream paper, ruled lines, one highlighted clause, the red seal
  const C = B.charter;
  rect(C.x0, C.y0, C.x1 - C.x0 + 1, C.y1 - C.y0 + 1, mb.mat('br.brass', 0.4));
  rect(C.x0, C.y0, C.x1 - C.x0 + 1, 1, mb.shade(1.4));
  rect(C.x0 + 3, C.y0 + 3, C.x1 - C.x0 - 5, C.y1 - C.y0 - 5, mb.mat('paper', -1.2));
  for (let y = C.y0 + 12, k = 0; y < C.y1 - 8; y += 4, k++) rect(C.x0 + 7, y, C.x1 - C.x0 - 14 - (k % 3) * 4, 1, mb.mat('paper', -2.4));
  rect(C.x0 + 7, C.y0 + 24, 22, 1, mb.mat('br.brass', 1.6));
  ellipse(C.x1 - 9, C.y1 - 9, 3.2, 3.2, mb.mat('red', 1));
  // TASYA's door (slate, always: it's the landlord's door): outline steps up out of the shadow, then the leaf, key
  if (doorStep) {
    const D = B.door, w = D.x1 - D.x0, h = B.tableY - D.y0;
    if (doorStep <= 3) {
      // held steps: the outline only, climbing from the table edge upward (1/3, 2/3, all)
      const top = B.tableY - Math.round((h * doorStep) / 3);
      rect(D.x0 - 2, top, 2, B.tableY - top, mb.mat('br.slate', 1.4));
      rect(D.x1, top, 2, B.tableY - top, mb.mat('br.slate', 0.6));
      if (doorStep === 3) rect(D.x0 - 2, D.y0 - 2, w + 4, 2, mb.mat('br.slate', 1.6));
    } else {
      rect(D.x0 - 3, D.y0 - 3, w + 6, 3, mb.mat('br.slate', 1.5));
      rect(D.x0 - 3, D.y0, 3, h, mb.mat('br.slate', 1.1));
      rect(D.x1, D.y0, 3, h, mb.mat('br.slate', 0.4));
      rect(D.x0, D.y0, w, h, mb.mat('br.slate', 0.6));
      // two raised panels, the key in the lock (brass), a ring
      rect(D.x0 + 5, D.y0 + 6, w - 10, 30, mb.shade(0.8)); rect(D.x0 + 5, D.y0 + 42, w - 10, 40, mb.shade(0.8));
      rect(D.x0 + 5, D.y0 + 6, w - 10, 1, mb.shade(1)); rect(D.x0 + 5, D.y0 + 42, w - 10, 1, mb.shade(1));
      rect(D.x1 - 8, D.y0 + 52, 3, 6, mb.mat('br.brass', 1)); ellipse(D.x1 - 7, D.y0 + 62, 3, 3, mb.mat('br.brass', 0.6));
      ellipse(D.x1 - 7, D.y0 + 62, 1.4, 1.4, mb.mat('br.slate', 0.6));
      if (doorStep === 5) {
        // open: the leaf swings in (a sliver at the hinge), the slate-lit room beyond: desks in rows, labelled
        rect(D.x0, D.y0, w, h, mb.emit(PAL.G3));
        for (let r = 0; r < 4; r++) {
          const yy = D.y0 + 30 + r * 16, ww = w - 8 - r * 4;
          rect(D.x0 + 4 + r * 2, yy, ww, 3, mb.emit(PAL.G5));
          rect(D.x0 + 4 + r * 2, yy + 3, ww, 5, mb.emit(PAL.G2));
          for (let k = 0; k < ww; k += 7) rect(D.x0 + 6 + r * 2 + k, yy - 2, 3, 2, mb.emit(PAL.P1));
        }
        rect(D.x0, D.y0, 5, h, mb.mat('br.slate', 1.8));
      }
    }
  }
  // the laptop's chair at the right edge: a high back, seen from the side, pulled out from the table
  const L = B.laptop;
  poly([L.x0 - 6, B.tableY, L.x0 - 8, L.y0 - 24, L.x0 - 4, L.y0 - 30, L.x1 + 2, L.y0 - 30, L.x1 + 6, L.y0 - 24, L.x1 + 5, B.tableY], mb.mat('br.leather', 1.3));
  rect(L.x0 - 4, L.y0 - 30, L.x1 - L.x0 + 6, 1, mb.shade(3));
  resolve(mb, {
    amb: (x, y) => 2.2 - dim * 0.5 - Math.max(0, (y - 90) / 80),
    cyan: (x, y) => pendantCyan(x, y, dim) * 0.75,
    warm: () => 0,
    dither: 0.6,
  }, out, 0);
  if (doorStep === 5) {
    // the slate light out of the open door across the wall, one rung, dithered at its edge
    const D = B.door;
    for (let y = D.y0; y < B.tableY; y++) for (let x = D.x1 + 3; x < D.x1 + 50; x++) {
      const t = (x - D.x1) / 50;
      if (bayer(x, y) > t) out.set(x, y, stepColor(out.get(x, y), 1));
    }
  }
  farCache.set(key, out);
  return out;
};

// ------------------------------------------------------------------ the medium fire (its own drawing, not the room's)
// Three drawings held on 2s, phase-staggered: tongues of flame from a hot core, tungsten ramp out to red tips. `s` is
// its height in px (the table fire 26, a nameplate's 16, a chair's 30).
const fireDrawings = new Map<string, Array<Array<[number, number, number]>>>();
const fireShape = (s: number): Array<Array<[number, number, number]>> => {
  const key = String(s);
  const hit = fireDrawings.get(key);
  if (hit) return hit;
  const out: Array<Array<[number, number, number]>> = [];
  for (let d = 0; d < 3; d++) {
    const px: Array<[number, number, number]> = [];
    const w = s * 0.55;
    const tongues = [[-0.28, 0.72 + 0.1 * Math.sin(d * 2.1)], [0.05, 1 - 0.06 * d], [0.3, 0.66 + 0.12 * Math.cos(d * 1.7)]];
    for (let j = 0; j < s; j++) for (let i = -Math.ceil(w); i <= Math.ceil(w); i++) {
      const u = i / w, v = j / s; // v 0 = base, 1 = top
      let inside = 0;
      for (const [tx, th] of tongues) {
        const cx = tx * (1 - v * 0.4) + 0.08 * Math.sin(v * 7 + d * 2);
        const half = (1 - v / th) * (0.42 + 0.2 * (1 - v)) * (v < 0.25 ? 0.7 + v * 1.2 : 1);
        if (v < th && Math.abs(u - cx) < half) inside = Math.max(inside, 1 - Math.abs(u - cx) / half);
      }
      if (inside <= 0) continue;
      const heat = inside * (1 - v * 0.8);
      const c = heat > 0.62 ? PAL.W8 : heat > 0.45 ? PAL.W7 : heat > 0.28 ? PAL.W6 : heat > 0.14 ? PAL.W5 : PAL.R3;
      px.push([i, -j, c]);
    }
    out.push(px);
  }
  fireDrawings.set(key, out);
  return out;
};
export const drawFireM = (b: Buf, cx: number, by: number, s: number, f: number, phase = 0) => {
  const dr = fireShape(s)[Math.floor((f + phase * 2) / 2) % 3];
  for (const [i, j, c] of dr) b.set(cx + i, by + j, c);
};
const drawSmokeM = (b: Buf, cx: number, by: number, k: number) => {
  if (k < 0 || k > 23) return;
  const st = Math.floor(k / 4);
  [[0, -5, 5], [-3, -12, 4], [3, -18, 3], [0, -24, 2]].forEach(([dx, dy, r], i) => {
    if (i > st) return;
    const yy = by + dy - st * 3, rr = Math.max(1, r - Math.max(0, st - 3));
    const col = st > 4 ? PAL.G2 : st > 2 ? PAL.G3 : PAL.G4;
    for (let y = -rr; y <= rr; y++) for (let x = -rr; x <= rr; x++) if (x * x + y * y <= rr * rr + 0.5 && bayer(cx + x, yy + y) < 0.8) b.set(cx + dx + x, yy + y, col);
  });
};
const fireOn = (fr: BoardFire, f: number) => (fr.state ?? 'burn') === 'burn' || (fr.outAt !== undefined && f < fr.outAt);

/** an empty board chair's back at medium scale (the same drawing as MADA's, never his: his never burns) */
const drawChairBackM = (b: Buf, cx: number, dim: number) => {
  const top = B.tableY - 58;
  const pts = [cx - 25, B.tableY, cx - 26, top + 20, cx - 23, top + 8, cx - 15, top + 2, cx, top, cx + 15, top + 2, cx + 23, top + 8, cx + 26, top + 20, cx + 25, B.tableY];
  poly(pts, b.ink(dim ? PAL.N0 : PAL.N1));
  line(cx - 15, top + 3, cx + 15, top + 3, b.ink(dim ? PAL.N1 : PAL.N3));
  line(cx - 22, top + 9, cx - 15, top + 3, b.ink(dim ? PAL.N1 : PAL.N2));
  line(cx - 20, top + 16, cx - 20, B.tableY, b.ink(PAL.N0)); line(cx + 20, top + 16, cx + 20, B.tableY, b.ink(PAL.N0));
  rect(cx - 12, top + 1, 24, 1, b.ink(dim ? PAL.N2 : PAL.C1));
};

/** The far layer (everything behind the table's far edge, except the cast). Rows 0..BPLATE.tableY. */
export const drawBoardPlate = (b: Buf, f: number, o: BoardPlateOpts = {}) => {
  const dim = o.dim ?? 0;
  const wall = paintWall(!!o.slate, dim, o.door ?? 0);
  for (let y = 0; y < B.tableY + 4; y++) b.c.set(wall.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  paintValley(b, f, o.rolodex ?? false);
  if (o.reflection) paintReflection(b, o.reflection);
  // the glass reflects the room: the pendant's bar as a faint cyan dash line, two sheen streaks, the mullions
  const W = B.win;
  for (let x = W.x0; x <= W.x1; x++) if (x % 3 !== 0 && x > 90) b.set(x, W.y0 + 8, x % 3 === 1 ? PAL.C2 : PAL.C1);
  for (let y = W.y0; y <= W.y1; y++) for (let x = W.x0; x <= W.x1; x++) {
    const u = (x - W.x0) + (y - W.y0) * 0.55;
    if ((u > 30 && u < 36) || (u > 40 && u < 42) || (u > 150 && u < 154)) b.set(x, y, stepColor(b.get(x, y), 1));
  }
  for (const m of W.mullions) { rect(m, W.y0, 3, W.y1 - W.y0 + 1, b.ink(PAL.N1)); rect(m, W.y0, 1, W.y1 - W.y0 + 1, b.ink(PAL.N3)); }
  if (dim) for (let y = 0; y < B.tableY; y++) for (let x = W.x0; x <= W.x1; x++) if (!(bayer(x, y) < 0.2)) b.set(x, y, stepColor(b.get(x, y), -Math.min(2, dim)));
  // the pendant's LED bar (emissive: it IS the key), its two hangers, its glow along the ceiling
  const Pd = B.pendant;
  for (const hx of [Pd.x0 + 20, Pd.x1 - 20]) rect(hx, 0, 1, Pd.y, b.ink(PAL.N2));
  rect(Pd.x0, Pd.y, Pd.x1 - Pd.x0, 3, b.ink(PAL.N2));
  rect(Pd.x0 + 2, Pd.y + 3, Pd.x1 - Pd.x0 - 4, 1, b.ink(dim >= 2 ? PAL.C4 : PAL.C8));
  for (let x = Pd.x0 + 2; x < Pd.x1 - 2; x++) if (bayer(x, Pd.y + 4) < 0.5) b.set(x, Pd.y + 4, PAL.C3);
  // THE QUIET VOTE: a black tile on the laptop on the chair (camera off); the laptop's base on the seat
  if (o.laptop) {
    const L = B.laptop;
    rect(L.x0 - 2, L.y0 - 2, L.x1 - L.x0 + 4, L.y1 - L.y0 + 4, b.ink(PAL.G1));
    rect(L.x0 - 2, L.y0 - 2, L.x1 - L.x0 + 4, 1, b.ink(PAL.G3));
    drawQuietVoteTile(b, L.x0, L.y0, L.x1 - L.x0, L.y1 - L.y0, {label: false, sub: false});
    tiny(b, 'CAMERA OFF', L.x0 + Math.round((L.x1 - L.x0 - tinyWidth('CAMERA OFF')) / 2), L.y1 - 6, PAL.N4);
    rect(L.x0 - 6, L.y1 + 2, L.x1 - L.x0 + 12, 2, b.ink(PAL.G2));
  }
  // sc 30: the empty chairs that burn, behind the table (medium scale), and their fires
  for (const fr of o.fires ?? []) if (fr.at === 'chair') {
    drawChairBackM(b, fr.x, dim);
    if (fireOn(fr, f)) drawFireM(b, fr.x, B.tableY - 50, 30, f, fr.phase ?? 0);
    else if (fr.outAt !== undefined) drawSmokeM(b, fr.x, B.tableY - 52, f - fr.outAt);
  }
};

// ------------------------------------------------------------------ the table top + what's on it
const tableCache = new Map<string, Buf>();
const paintTableTop = (dim: number, fires: BoardFire[], f: number): Buf => {
  const burning = fires.filter((x) => x.at !== 'chair' && (x.state ?? 'burn') === 'burn');
  const key = `${dim}|${burning.map((x) => `${x.at}${x.x}`).join(',')}|${burning.length ? Math.floor(f / 2) % 3 : 0}`;
  const hit = tableCache.get(key);
  if (hit) return hit;
  const out = new Buf(ROOM_W, ROOM_H, PAL.N0);
  const mb = new MatBuf(ROOM_W, ROOM_H);
  // walnut: long grain receding, the far edge's lip catching the pendant, the near edge's rounded lip
  for (let y = B.tableY; y < B.nearY; y++) for (let x = 0; x < ROOM_W; x++) {
    const v = y + 1.3 * Math.sin(x / 83 + y / 29) + 0.5 * Math.sin(x / 17 + y / 5);
    const band = Math.floor(v / 4);
    let lvl = (hash(band, 3, 21) - 0.5) * 0.5 + 0.4;
    if (v - band * 4 < 1 && hash(band, 5, 23) < 0.5) lvl -= 0.7;
    mb.mat('br.walnut', lvl)(x, y);
  }
  rect(0, B.tableY, ROOM_W, 1, mb.shade(2));
  rect(0, B.tableY + 1, ROOM_W, 1, mb.shade(0.6));
  rect(0, B.nearY, ROOM_W, 1, mb.shade(1.6));
  rect(0, B.nearY + 1, ROOM_W, 5, mb.mat('br.walnut', -1.4));
  rect(0, B.nearY + 6, ROOM_W, ROOM_H - B.nearY - 6, mb.mat('black', -2));
  const warm = fireWarm(burning, f);
  resolve(mb, {
    amb: (x, y) => 1.6 - dim * 0.4 - Math.max(0, (y - 170) / 30),
    cyan: (x, y) => (y > B.nearY + 5 ? 0 : pendantCyan(x, y, dim) * 0.62),
    warm: (x, y) => (y > B.nearY + 5 ? 0 : warm(x, y)),
    dither: 0.5,
  }, out, 0);
  // the pendant's reflection: a long glossy streak along the table, broken by the grain
  const ry = B.tableY + 10;
  for (let x = B.pendant.x0 - 8; x < B.pendant.x1 + 8; x++) for (let j = 0; j < 3; j++) {
    if (hash(x >> 1, ry + j, 41) < 0.18 || (j === 2 && bayer(x, ry + j) < 0.5)) continue;
    out.set(x, ry + j, j === 1 ? PAL.C6 : PAL.C4);
  }
  tableCache.set(key, out);
  return out;
};
const drawBlueprint = (b: Buf, mark: 0 | 1 | 2 | 3) => {
  const P = B.bp;
  const quad = [P.x0 + 6, P.y0, P.x1 - 5, P.y0, P.x1, P.y1, P.x0, P.y1];
  poly(quad.map((v, i) => v + (i % 2 ? 1 : 1)), (x, y) => b.set(x, y, stepColor(b.get(x, y), -2)));
  poly(quad, b.ink(PAL.F2));
  for (let y = P.y0 + 3; y < P.y1; y += 4) for (let x = P.x0 + 4; x < P.x1 - 2; x += 2) if (y < P.y1 - 1) b.set(x, y, PAL.F3);
  line(P.x0 + 8, P.y0 + 2, P.x1 - 7, P.y0 + 2, b.ink(PAL.C5));
  line(P.x0 + 3, P.y1 - 2, P.x1 - 3, P.y1 - 2, b.ink(PAL.C5));
  // the numbered path, at medium size: 1 ✓ 2 ✓ 3 ✓ (short ruled lines), 4 and a long blank line
  for (let k = 0; k < 4; k++) {
    const y = P.y0 + 5 + k * 5, x = P.x0 + 10 + k;
    tiny(b, String(k + 1), x, y - 1, PAL.C7);
    if (k < 3) { rect(x + 5, y + 2, 34 - k * 3, 1, b.ink(PAL.C5)); tiny(b, '^', x + 42 - k * 2, y - 1, PAL.C7); }
    else {
      rect(x + 5, y + 3, 56, 1, b.ink(PAL.C6));
      // her mark: a hand-drawn `?` in marker (cream), stroke by stroke: the hook, the stem, the dot
      const qx = x + 8, qy = y - 3;
      const hook: Array<[number, number]> = [[0, 1], [1, 0], [2, 0], [3, 0], [4, 1], [4, 2], [3, 3], [2, 4]];
      const stem: Array<[number, number]> = [[2, 5]];
      const dot: Array<[number, number]> = [[2, 7]];
      const pts = [...(mark >= 1 ? hook : []), ...(mark >= 2 ? stem : []), ...(mark >= 3 ? dot : [])];
      for (const [dx, dy] of pts) { b.set(qx + dx, qy + dy, PAL.P2); b.set(qx + dx + 1, qy + dy + 1, PAL.F1); }
    }
  }
  // the two boxes + the CONTROLS arrow (in miniature) at the right, the curled near corner
  rect(P.x1 - 40, P.y0 + 5, 22, 7, b.ink(PAL.C5)); rect(P.x1 - 39, P.y0 + 6, 20, 5, b.ink(PAL.F2));
  line(P.x1 - 29, P.y0 + 12, P.x1 - 29, P.y0 + 15, b.ink(PAL.C5));
  rect(P.x1 - 44, P.y0 + 15, 30, 7, b.ink(PAL.C5)); rect(P.x1 - 43, P.y0 + 16, 28, 5, b.ink(PAL.F2));
  poly([P.x1 - 9, P.y1, P.x1, P.y1, P.x1 - 2, P.y1 - 7], b.ink(PAL.F4));
  line(P.x1 - 9, P.y1, P.x1 - 2, P.y1 - 7, b.ink(PAL.C6));
};
/** the blueprint's step-4 line (frame coords): where NELEH's marker tip goes to write the ? */
export const BPLATE_STEP4: [number, number] = [BPLATE.bp.x0 + 13 + 8 + 2, BPLATE.bp.y0 + 5 + 15 + 1];
const drawPhoneM = (b: Buf, x: number, y: number, lit: boolean, f: number, seed: number) => {
  // a phone lying on the table, foreshortened (wider than deep): black glass, a lit screen when it buzzes
  rect(x + 1, y + 7, 14, 1, b.ink(PAL.N0));
  rect(x, y, 14, 7, b.ink(PAL.N1)); rect(x, y, 14, 1, b.ink(PAL.G3)); rect(x + 13, y, 1, 7, b.ink(PAL.N0));
  if (lit) {
    rect(x + 1, y + 1, 12, 5, b.ink(PAL.C4)); rect(x + 2, y + 2, 7, 1, b.ink(PAL.C8)); rect(x + 2, y + 4, 5, 1, b.ink(PAL.C6));
    if (Math.floor((f + seed * 3) / 6) % 2 === 0) b.set(x + 11, y + 2, PAL.P2);
  }
};
const drawTentCard = (b: Buf, name: string, cx: number, y: number) => {
  const w = Math.max(24, tinyWidth(name) + 8), x = cx - Math.round(w / 2);
  // a folded card standing on the table: its lit face, the fold's top edge, the shadow behind
  rect(x + 2, y + 10, w, 1, b.ink(PAL.N0));
  rect(x, y, w, 10, b.ink(PAL.P0)); rect(x, y, w, 1, b.ink(PAL.P2)); rect(x, y + 9, w, 1, b.ink(PAL.G3));
  tiny(b, name, x + Math.round((w - tinyWidth(name)) / 2), y + 3, PAL.N1);
};
const drawTermSheet = (b: Buf, state: 'blank' | 'stamped', x: number, y: number, w: number, h: number) => {
  rect(x + 1, y + h, w, 1, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.P1)); rect(x, y, w, 1, b.ink(PAL.P2));
  tiny(b, 'TERMS', x + 3, y + 3, PAL.N1);
  for (let k = 0; k < 3; k++) rect(x + 3, y + 10 + k * 3, w - 8 - k * 5, 1, b.ink(PAL.P0));
  if (state === 'stamped') {
    const sx = x + 16, sy = y + h - 9;
    for (let i = 0; i < 14; i++) { b.set(sx + i, sy, PAL.R2); b.set(sx + i, sy + 6, PAL.R2); }
    for (let j = 0; j <= 6; j++) { b.set(sx, sy + j, PAL.R2); b.set(sx + 13, sy + j, PAL.R2); }
    tiny(b, 'OK', sx + 4, sy + 1, PAL.R2);
  }
};

/** The table top and everything on it: pass this as the rigs' `table` callback (it paints rows tableY..202). */
export const drawBoardPlateTable = (b: Buf, f: number, o: BoardPlateOpts = {}) => {
  const fires = o.fires ?? [];
  const top = paintTableTop(o.dim ?? 0, fires, f);
  for (let y = B.tableY; y < ROOM_H; y++) b.c.set(top.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  if (o.blueprint !== undefined && o.blueprint !== false) drawBlueprint(b, o.blueprint);
  for (const p of o.plates ?? []) drawTentCard(b, p.name, p.x, B.tableY + 4);
  if (o.phones) {
    const st = o.phones.step ?? 0;
    B.phones.forEach(([px, py], i) => {
      const jit = o.phones!.buzz && ((f + i) & 1) ? (i % 2 ? 1 : -1) : 0;
      drawPhoneM(b, px + jit, Math.min(B.nearY - 8, py + st * 3), !!o.phones!.lit, f, i);
    });
  }
  if (o.termSheet && o.termSheet !== 'none' && o.terbHand !== 'hand') drawTermSheet(b, o.termSheet, B.termSheet.x, B.termSheet.y, B.termSheet.w, B.termSheet.h);
  // fires on the table and on the tent cards (sc 30)
  for (const fr of fires) {
    if (fr.at === 'chair') continue;
    const by = fr.y ?? (fr.at === 'plate' ? B.tableY + 5 : B.tableY + 30);
    if (fireOn(fr, f)) drawFireM(b, fr.x, by, fr.at === 'plate' ? 16 : 26, f, fr.phase ?? 0);
    else if (fr.outAt !== undefined) {
      drawSmokeM(b, fr.x, by - 2, f - fr.outAt);
      for (let i = -4; i <= 4; i++) b.set(fr.x + i, by, PAL.N0); // the scorch
    }
  }
  // keycaps bouncing on the table (whole-pixel hops, three at a time, one bounce each, then they rest)
  if (o.keycaps !== null && o.keycaps !== undefined) {
    for (let k = 0; k < 6; k++) {
      const t = o.keycaps - k * 5;
      if (t < 0) continue;
      const hop = [0, 5, 8, 9, 8, 5, 0, 2, 3, 2, 0][Math.min(10, Math.floor(t / 2))] ?? 0;
      const x = 150 + Math.round(hash(k, 1, 91) * 180) + Math.min(10, Math.floor(t / 2)) * (k % 2 ? 1 : -1);
      const y = B.tableY + 18 + Math.round(hash(k, 2, 91) * 20) - hop;
      rect(x, y, 5, 4, b.ink(PAL.G4)); rect(x, y, 5, 1, b.ink(PAL.G6)); rect(x + 4, y + 1, 1, 3, b.ink(PAL.G2));
      if (hop === 0) rect(x + 1, y + 4, 5, 1, b.ink(PAL.N0));
    }
  }
};

// ------------------------------------------------------------------ the front layer: TERB's hand, the vignette
// Terb's hand comes into frame from the near side (he stands on our side of the table, off picture), reaching over
// the table's near edge from the bottom of the frame: a crisp pale shirt sleeve, the cuff, the hand. 'stamp' presses
// the rubber stamp down onto the term sheet; 'hand' holds the stamped sheet up between them, to both at once.
const TERB_HAND = ['...oo3333oo...', '..o34444443o..', '.o3444444443o.', 'o344444444433o', 'o334444443333o', 'o233333333322o', '.o2222222222o.', '..oooooooooo..'];
export const drawBoardPlateFront = (b: Buf, f: number, o: BoardPlateOpts = {}) => {
  void f;
  const T = B.termSheet;
  if (o.terbHand && o.terbHand !== 'none') {
    const stamp = o.terbHand === 'stamp';
    // the hand's centre (the fist on the stamp's handle, or the grip on the sheet's near corner)
    const hx = T.x + T.w - 10, hy = stamp ? T.y - 4 : T.y + 2;
    // 'hand': the stamped sheet held out low over the table between them (drawn first: his hand grips its corner)
    if (!stamp && o.termSheet && o.termSheet !== 'none') drawTermSheet(b, o.termSheet, hx - T.w + 6, hy - T.h + 3, T.w, T.h);
    // the sleeve: from the frame's bottom edge up and in to the wrist, widening toward us (foreshortened), lit from
    // the pendant above; soft folds across it, its underside in shadow
    const wx = hx + 3, wy = hy + 3;
    for (let y = wy; y < ROOM_H; y++) {
      const t = (y - wy) / (ROOM_H - wy);
      const cx = Math.round(wx + t * 34), hw = Math.round(6 + t * 7);
      for (let x = cx - hw; x <= cx + hw; x++) {
        const u = (x - (cx - hw)) / (2 * hw);
        const fold = Math.abs(((y - wy) + (x - cx) * 0.6) % 13 - 6.5) < 0.8 && u > 0.2 && u < 0.85;
        b.set(x, y, u < 0.08 ? PAL.P1 : u < 0.4 ? (fold ? PAL.G4 : PAL.G6) : u < 0.8 ? (fold ? PAL.G3 : PAL.G5) : u < 0.94 ? PAL.G3 : PAL.N0);
      }
    }
    // the cuff (with its button) at the wrist
    for (let y = wy - 1; y < wy + 4; y++) for (let x = wx - 8; x <= wx + 8; x++) b.set(x + Math.round((y - wy) * 0.4), y, y === wy - 1 ? PAL.P2 : PAL.P1);
    b.set(wx + 5, wy + 2, PAL.G3);
    if (stamp) {
      // the rubber stamp under his fist, pressed flat onto the sheet
      rect(hx - 3, hy + 3, 6, 3, b.ink(PAL.N1)); rect(hx - 6, hy + 6, 12, 3, b.ink(PAL.R1)); rect(hx - 6, hy + 6, 12, 1, b.ink(PAL.R2));
    }
    const sk: Record<string, number> = {o: PAL.S1, '2': PAL.S3, '3': PAL.S4, '4': PAL.S5};
    TERB_HAND.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = sk[r[i]]; if (c !== undefined) b.set(hx - 7 + i, hy - 5 + j, c); } });
    // the knuckles' splits (a fist)
    for (let k = 0; k < 3; k++) b.set(hx - 3 + k * 3, hy - 2, PAL.S2);
  }
  if (o.vignette !== false) vignette(b, 1, 0.66, 0.72, ROOM_H, ROOM_H);
};
