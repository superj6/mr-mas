// MR. MAS — Prototype 2 · THE CLIFF · the extrusion: "the grid gains depth". Pure (no DOM).
// Every pixel of the frame becomes one voxel: a slab whose FRONT face is the pixel's footprint on a plane, and whose
// back face is that footprint pushed further along the staging rays (x (1 + k)). Its sides lie in the planes through
// the staging camera and the pixel's edges, so from the staging camera every voxel covers exactly its own pixel and
// its sides are edge-on: frame 60 is frame 59, bit for bit. From anywhere else the sides show: the room has relief.
// The plane comes from the DRAW STAGE that last wrote the pixel (plate, Orb, Mas's back, desk, glass, Mas's front) plus
// DPLATE's geometry inside the plate (wall, window + reveal, trim, sill, shelf, books, clock, monitor, stand, rack) —
// never from colour. People stay flat: Mas is a card one voxel thick standing at the desk's far edge (where he sits),
// his forearms lie on the desk top (the draw stage says which pixels are his FRONT image), and the loose rim-light
// pixels of his outline sit on the surface behind them (light on the wall, not specks in the air); his glass is a
// card. The Orb is a sphere of voxels. The monitor's display is not voxels: it is one quad that re-samples the screen
// at finer resolutions as the lens nears it (screenLevel), so the portal never pops.
// Beyond the frame's edges (what a moving camera will see) the room is continued in its own colours, and everything
// hidden behind a nearer voxel (the wall behind the Orb, Mas, the monitor, the books; the desk under the glass) is
// there too, from the plate / desk stages drawn alone.
import {Buf, bayer, hash, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, familyOf} from '../../../shared/pixel/palette';
import {DPLATE, DPLATE_SCREEN_W, DPLATE_SCREEN_H} from '../../../shared/pixel/rooms/darkroom-plate';
import {CAM, DEPTH, NW, NH, RH, deskZ} from './params';
import {Layers, portalRect} from './pixel';

/** colour -> [family index, rung]; the palette texture is FAM_ORDER x 16 */
export const FAM_ORDER = ['N', 'C', 'W', 'S', 'K', 'X', 'B', 'G', 'D', 'R', 'L', 'P', 'F', 'I', 'U', 'Q'];
export const colCode = (c: number): number => {
  const f = familyOf(c);
  if (!f) throw new Error(`colour ${c.toString(16)} is not a master-palette colour`);
  return FAM_ORDER.indexOf(f[0]) * 16 + f[1];
};

export const FLAG = {emissive: 1, owner: 2, card: 4, sphere: 8, screen: 16, dark: 32, behindScreen: 64, shadow: 128} as const;
export const LAYER = {wall: 0, window: 1, city: 2, trim: 3, shelf: 4, monitor: 5, rack: 6, orb: 7, mas: 8, desk: 9, glass: 10, under: 11, screen: 12, hidden: 13} as const;

/** per-instance: a0 = (px, py, colCode, flags), a1 = (nx, ny, nz, d) the front plane, a2 = (k, layer, 0, 0) */
export interface Instances {
  n: number; a0: Float32Array; a1: Float32Array; a2: Float32Array;
  /** image pixel -> the instance that shows the PLATE stage's pixel there (-1 if none): the live LEDs / city */
  plateInst: Int32Array;
}
class Builder {
  a0: number[] = []; a1: number[] = []; a2: number[] = [];
  plateInst = new Int32Array(NW * NH).fill(-1);
  get n() { return this.a0.length / 4; }
  add(px: number, py: number, col: number, flags: number, n: V3, d: number, k: number, layer: number) {
    this.a0.push(px, py, colCode(col), flags);
    this.a1.push(n[0], n[1], n[2], d);
    this.a2.push(k, layer, 0, 0);
  }
  /** a slab on the depth plane z (z > 0), `th` metres deep */
  z(px: number, py: number, col: number, flags: number, z: number, th: number, layer: number) {
    this.add(px, py, col, flags, [0, 0, 1], -z, th / z, layer);
  }
  done(): Instances { return {n: this.a0.length / 4, a0: new Float32Array(this.a0), a1: new Float32Array(this.a1), a2: new Float32Array(this.a2), plateInst: this.plateInst}; }
}

// ------------------------------------------------------------------ planes (staging space; n faces the camera)
export type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
/** the point where the staging ray through image point (x, y) meets depth z (z > 0) */
export const atDepth = (x: number, y: number, z: number): V3 => [((x - CAM.cx) / CAM.f) * z, (-(y - CAM.cy) / CAM.f) * z, -z];
/** intersect the staging ray through (x, y) with plane n.P = d */
export const onPlane = (x: number, y: number, n: V3, d: number): V3 => {
  const r: V3 = [(x - CAM.cx) / CAM.f, -(y - CAM.cy) / CAM.f, -1];
  const t = d / dot(n, r);
  return [r[0] * t, r[1] * t, r[2] * t];
};
export const DESK_TOP = {n: [0, 1, 0] as V3, d: -DEPTH.deskH};

// the monitor: the screen quad's plane from its painted foreshortening (left column 65 rows tall, right 53)
const M = DPLATE.mon;
export const MON = {zL: DEPTH.monL, zR: DEPTH.monL * ((M.botL - M.topL + 1) / (M.botR - M.topR + 1))};
const PL = atDepth(M.x0, 76, MON.zL), PR = atDepth(M.x1 + 1, 76, MON.zR);
/** along the screen, left (near) -> right (far) */
export const SCREEN_T = norm(sub(PR, PL));
let sn = norm(cross([0, 1, 0], SCREEN_T));
if (dot(sn, [-PL[0], -PL[1], -PL[2]]) < 0) sn = [-sn[0], -sn[1], -sn[2]];
/** the screen's outward normal (it faces him, and a little toward the camera) */
export const SCREEN_N: V3 = sn;
export const SCREEN_D = dot(SCREEN_N, PL);
const SIDE_N: V3 = [-SCREEN_T[0], -SCREEN_T[1], -SCREEN_T[2]];
const SIDE_D = dot(SIDE_N, PL);
/** the key: a point just in front of the middle of his screen (staging space) */
export const KEY_LIGHT: V3 = (() => { const c = atDepth(34, 76, (MON.zL + MON.zR) / 2); return [c[0] + SCREEN_N[0] * 0.25, c[1] + SCREEN_N[1] * 0.25, c[2] + SCREEN_N[2] * 0.25]; })();
const quadY = (x: number, a: number, b2: number) => Math.round(a + ((x - M.x0) / (M.x1 - M.x0)) * (b2 - a));
const inScreenQuad = (x: number, y: number) => x >= M.x0 && x <= M.x1 && y >= quadY(x, M.topL, M.topR) && y <= quadY(x, M.botL, M.botR);
/** image pixel -> virtual monitor screen coordinate (drawMonitor's own sampling), or null on the bezel */
export const screenUV = (x: number, y: number): [number, number] | null => {
  if (x < M.x0 + 3 || x > M.x1 - 3) return null;
  const t0 = quadY(x, M.topL, M.topR), t1 = quadY(x, M.botL, M.botR);
  const s0 = t0 + 3, s1 = t1 - 4;
  if (y < s0 || y > s1) return null;
  const u = ((x - M.x0 - 3) / (M.x1 - M.x0 - 6)) * DPLATE_SCREEN_W;
  const v = ((y - s0) / Math.max(1, s1 - s0)) * DPLATE_SCREEN_H;
  return [u, v];
};
/** the display pixels that show the portal (the level-1 photo window, with the level-2 badge in it) */
export const isPortalPixel = (x: number, y: number) => {
  const uv = screenUV(x, y);
  if (!uv) return false;
  const P = portalRect();
  const u = Math.min(DPLATE_SCREEN_W - 1, Math.floor(uv[0])), v = Math.min(DPLATE_SCREEN_H - 1, Math.floor(uv[1]));
  return u >= Math.round(P.x) && u < Math.round(P.x + P.w) && v >= Math.round(P.y) && v < Math.round(P.y + P.h);
};
/** the portal's display pixels, as an image-space bounding box */
export const portalPixels = () => {
  const out: Array<[number, number]> = [];
  for (let y = M.topR; y <= M.botL; y++) for (let x = M.x0; x <= M.x1; x++) if (isPortalPixel(x, y)) out.push([x, y]);
  return out;
};
/** a virtual-screen point (u, v) -> its point on the 3D screen plane (through drawMonitor's own mapping) */
export const screenPoint = (u: number, v: number): V3 => {
  const x = M.x0 + 3 + (u / DPLATE_SCREEN_W) * (M.x1 - M.x0 - 6);
  const t0 = M.topL + ((x - M.x0) / (M.x1 - M.x0)) * (M.topR - M.topL), t1 = M.botL + ((x - M.x0) / (M.x1 - M.x0)) * (M.botR - M.botL);
  const s0 = t0 + 3, s1 = t1 - 4;
  const y = s0 + (v / DPLATE_SCREEN_H) * (s1 - s0);
  return onPlane(x + 0.5, y + 0.5, SCREEN_N, SCREEN_D);
};

// the shelf's contents (rooms/darkroom-plate paintBack), for classification by position
const SH = DPLATE.shelf;
const BOOKS: Array<[number, number]> = [[4, 12], [8, 10], [12, 13], [16, 11], [20, 12], [24, 9]];
const isBook = (x: number, y: number) => BOOKS.some(([bx, bh]) => x >= bx && x < bx + 3 && y >= SH.y - bh && y < SH.y);
const isClock = (x: number, y: number) => x >= 56 && x < 73 && y >= SH.y - 10 && y < SH.y;
const isPlant = (x: number, y: number) => (x >= 82 && x < 89 && y >= SH.y - 5 && y < SH.y) || Math.hypot((x + 0.5 - 85) / 4.5, (y + 0.5 - (SH.y - 7)) / 3) <= 1;
const W_ = DPLATE.win;
const inWinInterior = (x: number, y: number) => x >= W_.x0 && x <= W_.x1 && y >= W_.y0 && y <= W_.y1;
const isMullion = (x: number, y: number) => inWinInterior(x, y) && ((x >= W_.mx - 1 && x <= W_.mx + 1) || (y >= W_.my && y <= W_.my + 1));
const isReveal = (x: number, y: number) => x >= W_.x0 - 1 && x <= W_.x1 + 1 && y >= W_.y0 - 1 && y <= W_.y1 + 1 && !inWinInterior(x, y);
const isTrim = (x: number, y: number) => x >= W_.x0 - 5 && x <= W_.x1 + 5 && y >= W_.y0 - 5 && y <= W_.y1 + 4 && !isReveal(x, y) && !inWinInterior(x, y);
const isSill = (x: number, y: number) => y >= W_.y1 + 5 && y <= W_.y1 + 8 && x >= W_.x0 - 8 && x <= W_.x1 + 8;
const R_ = DPLATE.rack;
const isRack = (x: number, y: number) => x >= R_.x0 && y >= R_.y0 && y < DPLATE.deskY;
const isSlot = (x: number, y: number) => x >= DPLATE.slot.x && x < DPLATE.slot.x + DPLATE.slot.w + 16 && y >= DPLATE.slot.y - 1 && y < DPLATE.slot.y + DPLATE.slot.h;
const isStand = (x: number, y: number) => x >= 30 && x < 38 && y > quadY(x, M.botL, M.botR) && y < DPLATE.deskY;
const isSidePanel = (x: number, y: number) => x >= M.x0 - 4 && x < M.x0 && y >= M.topL + 2 && y <= M.botL - 2;
const isMonitor = (x: number, y: number) => isSidePanel(x, y) || inScreenQuad(x, y);
const isEmissivePlate = (x: number, y: number) => (inWinInterior(x, y) && !isMullion(x, y)) || (isClock(x, y) && y >= SH.y - 8 && y < SH.y - 3) || (isRack(x, y) && x < R_.x0 + 16 && !isSlot(x, y));

// ------------------------------------------------------------------ the city beyond the frame (the same generator as the
// plate's private cityLights, run over a wider rect so a moving camera sees more of the same city; inside the window
// rect the plate's own pixels are used, so the copy only ever shows where the frame never did)
export const CITY_EXT = {x0: W_.x0 - 170, x1: W_.x1 + 150, y0: W_.y0 - 70, y1: W_.y1 + 46};
const cityExtended = (): Buf => {
  const {x0, x1, y0, y1} = CITY_EXT;
  const b = new Buf(x1 - x0 + 1, y1 - y0 + 1, PAL.N2);
  const put = (x: number, y: number, c: number) => b.set(x - x0, y - y0, c);
  const WH = W_.y1 - W_.y0;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = (y - W_.y0) / WH + (bayer(x, y) - 0.5) * 0.1;
    put(x, y, t < 0.4 ? PAL.N2 : t < 0.68 ? PAL.N3 : t < 0.9 ? PAL.N4 : PAL.N5);
  }
  const towers = (xs: number, dir: 1 | -1, salt: number, near: boolean) => {
    for (let x = xs, k = 0; dir > 0 ? x < x1 : x > x0; k++) {
      const wq = near ? 12 + Math.floor(hash(k, 11 + salt) * 16) : 7 + Math.floor(hash(k, 1 + salt) * 10);
      const top = W_.y0 + Math.round(WH * (near ? 0.7 + hash(k, 12 + salt) * 0.2 : 0.42 + hash(k, 2 + salt) * 0.3));
      const xa = dir > 0 ? x : x - wq + 1;
      for (let yy = top; yy <= y1; yy++) for (let xx = xa; xx < xa + wq; xx++) put(xx, yy, near ? (xx === xa ? PAL.N2 : PAL.N1) : PAL.N2);
      if (near) { for (let j = top + 2; j < y1 - 1; j += 2) for (let i = xa + 2; i < xa + wq - 1; i += 2) if (hash(i, j, xa + 7) < 0.1) put(i, j, hash(j, i, 5) < 0.55 ? PAL.W5 : PAL.C4); }
      else { for (let j = top + 3; j < y1 - 1; j += 3) for (let i = xa + 1; i < xa + wq - 1; i += 2) if (hash(i, j, xa) < 0.07) put(i, j, hash(j, i, 3) < 0.6 ? PAL.W4 : PAL.C4); }
      x += dir * (wq + (near ? Math.floor(hash(k, 13 + salt) * 4) : 1 + Math.floor(hash(k, 3 + salt) * 3)));
    }
  };
  towers(W_.x0, 1, 0, false); towers(W_.x0 - 1, -1, 40, false);
  towers(W_.x0, 1, 0, true); towers(W_.x0 - 1, -1, 40, true);
  return b;
};

// ------------------------------------------------------------------ the extrusion
export const EXT = {left: 230, right: 110, top: 44, deskEndL: -2.05, deskEndR: 1.62};

/** the wall where the frame never showed it: the plate's own wall row continued, with plaster specks */
const wallAt = (L: Layers, x: number, y: number): number => {
  const yy = Math.max(0, Math.min(DPLATE.deskY - 1, y));
  if (x >= 0 && x < NW && y >= 0 && y < DPLATE.deskY) {
    // behind something in the plate (the monitor, a book): continue the nearest clean wall in this row, to the right
    for (let xx = x; xx < NW; xx++) {
      if (!isMonitor(xx, yy) && !isStand(xx, yy) && !isBook(xx, yy) && !isClock(xx, yy) && !isPlant(xx, yy) && !(xx < SH.x1 && yy >= SH.y && yy < SH.y + 3)) return L.plate.c[yy * NW + xx];
    }
    return PAL.N1;
  }
  if (x < 0) {
    if (y >= SH.y && y < SH.y + 3) return L.plate.c[y * NW];
    let c = L.plate.c[yy * NW];
    if (isMonitor(0, yy) || isStand(0, yy) || (yy >= SH.y - 13 && yy < SH.y + 3) || y < 0) c = L.plate.c[40 * NW];
    return hash(x, y, 5) < 0.03 ? PAL.N0 : c;
  }
  return hash(x, y, 5) < 0.03 ? PAL.N0 : L.plate.c[yy * NW + NW - 1];
};

/** the depth of the plate's surface at an in-frame pixel (the same classification the extrusion uses) */
const plateDepth = (x: number, y: number): number => {
  const w = DEPTH.wall;
  if (inWinInterior(x, y)) return w + DEPTH.reveal - 0.05; // the glass (the mullion plane)
  if (isReveal(x, y)) return w;
  if (isSill(x, y)) return w - 0.07;
  if (isTrim(x, y)) return w - 0.02;
  if (x < SH.x1 && y >= SH.y && y < SH.y + 3) return w - DEPTH.shelf;
  if (isBook(x, y) || isPlant(x, y)) return w - DEPTH.shelf + 0.04;
  if (isClock(x, y)) return w - DEPTH.shelf + 0.06;
  if (isRack(x, y)) return DEPTH.rackZ;
  return w;
};

/** the monitor's display pixels (the quad takes them; the bezel stays voxels) */
export const isDisplayPixel = (x: number, y: number) => screenUV(x, y) !== null;

export interface ExtrudeOpts {
  /** margins beyond the frame (native px): wide for the room we leave (the camera turns in it), a sliver for the room
   *  we land in (the camera only ever approaches it from straight behind its own lens) */
  margins?: {left: number; right: number; top: number};
  /** the city: the wide far backdrop (the room we leave) or only what the window shows, just behind the glass */
  city?: 'wide' | 'window';
  /** the display as voxels (the room we land in keeps its painted plot as voxels: it is only ever seen from behind
   *  its own lens) or left to the resolving quad (the room we leave) */
  displayVoxels?: boolean;
}
export const extrudeRoom = (L: Layers, o: ExtrudeOpts = {}): Instances => {
  const B = new Builder();
  const {left, right, top} = o.margins ?? EXT;
  const cityWide = (o.city ?? 'wide') === 'wide';
  const own = (layer: string, x: number, y: number) => {
    if (x < 0 || y < 0 || x >= NW || y >= NH) return false;
    const i = y * NW + x;
    if (L.mas.c[i] !== TRANSPARENT) return layer === 'mas';
    if (y >= DPLATE.deskY && L.glass.c[i] !== TRANSPARENT) return layer === 'glass';
    if (y >= DPLATE.deskY) return layer === 'desk';
    if (L.orb.c[i] !== TRANSPARENT) return layer === 'orb';
    return layer === 'plate';
  };
  const wallZ = DEPTH.wall;
  const zPlate = (x: number, y: number, col: number, flags: number, z: number, th: number, layer: number) => {
    if (flags & FLAG.owner && x >= 0 && y >= 0 && x < NW && y < NH) B.plateInst[y * NW + x] = B.n;
    B.z(x, y, col, flags, z, th, layer);
  };
  // ---- the plate: x -left .. NW + right, rows -top .. deskY + 50 (the wall runs on down behind the desk)
  for (let y = -top; y < DPLATE.deskY + 50; y++) for (let x = -left; x < NW + right; x++) {
    const inF = x >= 0 && y >= 0 && x < NW && y < DPLATE.deskY;
    const flags = own('plate', x, y) ? FLAG.owner : 0;
    if (!inF) {
      if (x >= NW && y >= R_.y0 && y < DPLATE.deskY) { B.z(x, y, L.plate.c[y * NW + NW - 1], 0, DEPTH.rackZ, wallZ - DEPTH.rackZ, LAYER.rack); continue; }
      if (x < 0 && y >= SH.y && y < SH.y + 3 && x > -120) { B.z(x, y, wallAt(L, x, y), 0, wallZ - DEPTH.shelf, DEPTH.shelf, LAYER.shelf); continue; }
      const c = y >= DPLATE.deskY && x >= 0 && x < NW ? (hash(x, y, 9) < 0.04 ? PAL.N1 : PAL.N0) : wallAt(L, x, y);
      B.z(x, y, c, 0, wallZ, 0.1, LAYER.wall);
      continue;
    }
    const col = L.plate.c[y * NW + x];
    const em = isEmissivePlate(x, y) ? FLAG.emissive : 0;
    if (inWinInterior(x, y) && !isMullion(x, y)) continue; // the backdrop takes these (below)
    if (isMullion(x, y)) { zPlate(x, y, col, flags, wallZ + DEPTH.reveal - 0.05, 0.04, LAYER.window); continue; }
    if (isReveal(x, y)) { zPlate(x, y, col, flags, wallZ, DEPTH.reveal, LAYER.window); continue; }
    if (isSill(x, y)) { zPlate(x, y, col, flags, wallZ - 0.07, 0.1, LAYER.trim); continue; }
    if (isTrim(x, y)) { zPlate(x, y, col, flags, wallZ - 0.02, 0.05, LAYER.trim); continue; }
    if (x < SH.x1 && y >= SH.y && y < SH.y + 3) { zPlate(x, y, col, flags, wallZ - DEPTH.shelf, DEPTH.shelf, LAYER.shelf); continue; }
    // everything below stands in front of the wall: the wall behind it is kept (hidden) for when the camera moves
    const behind = () => B.z(x, y, wallAt(L, x, y), 0, wallZ, 0.1, LAYER.hidden);
    if (isBook(x, y) || isPlant(x, y)) { zPlate(x, y, col, flags, wallZ - DEPTH.shelf + 0.04, 0.16, LAYER.shelf); behind(); continue; }
    if (isClock(x, y)) { zPlate(x, y, col, flags | em, wallZ - DEPTH.shelf + 0.06, 0.12, LAYER.shelf); behind(); continue; }
    if (isMonitor(x, y)) {
      if (isSidePanel(x, y)) { if (flags) B.plateInst[y * NW + x] = B.n; B.add(x, y, col, flags, SIDE_N, SIDE_D, 0.02 / MON.zL, LAYER.monitor); behind(); continue; }
      // the quad takes the display; the wall behind it is kept for the reveal's parallax, and culled once the portal
      // is open (so nothing of the room shows past the nest's edges)
      if (!o.displayVoxels && isDisplayPixel(x, y)) { if (!isPortalPixel(x, y)) B.z(x, y, wallAt(L, x, y), FLAG.behindScreen, wallZ, 0.1, LAYER.hidden); continue; }
      if (flags) B.plateInst[y * NW + x] = B.n;
      B.add(x, y, col, flags | FLAG.emissive | FLAG.screen, SCREEN_N, SCREEN_D, 0.0005, LAYER.screen);
      if (!isPortalPixel(x, y)) behind();
      continue;
    }
    if (isStand(x, y)) { zPlate(x, y, col, flags, MON.zL + 0.3, 0.03, LAYER.monitor); behind(); continue; }
    if (isSlot(x, y)) { zPlate(x, y, col, flags, DEPTH.rackZ + 0.04, 0.3, LAYER.rack); continue; }
    if (isRack(x, y)) { zPlate(x, y, col, flags | em, DEPTH.rackZ, wallZ - DEPTH.rackZ, LAYER.rack); continue; }
    zPlate(x, y, col, flags, wallZ, 0.1, LAYER.wall);
  }
  // ---- the city: one far backdrop behind the glass (emissive), the plate's own pixels inside the window
  const city = cityExtended();
  const CE = cityWide ? CITY_EXT : {x0: W_.x0, x1: W_.x1, y0: W_.y0, y1: W_.y1};
  const cityZ = cityWide ? DEPTH.city : DEPTH.wall + DEPTH.reveal + 0.35;
  for (let y = CE.y0; y <= CE.y1; y++) for (let x = CE.x0; x <= CE.x1; x++) {
    const inside = inWinInterior(x, y) && !isMullion(x, y);
    const col = inside ? L.plate.c[y * NW + x] : city.get(x - CITY_EXT.x0, y - CITY_EXT.y0);
    const fl = FLAG.emissive | (inside && own('plate', x, y) ? FLAG.owner : 0);
    zPlate(x, y, col, fl, cityZ, cityZ * 0.02, LAYER.city);
  }
  // ---- the Orb: a sphere of voxels (each pixel at the sphere's depth, deep through to its back)
  {
    const [ox, oy] = L.orbC;
    const r = 12, zc = DEPTH.orb, R = (r * zc) / CAM.f;
    for (let y = oy - r - 1; y <= oy + r + 1; y++) for (let x = ox - r - 1; x <= ox + r + 1; x++) {
      if (x < 0 || y < 0 || x >= NW || y >= NH) continue;
      const c = L.orb.c[y * NW + x];
      if (c === TRANSPARENT) continue;
      const dx = ((x + 0.5 - ox) / CAM.f) * zc, dy = ((y + 0.5 - oy) / CAM.f) * zc;
      const h = Math.max(Math.sqrt(Math.max(0, R * R - dx * dx - dy * dy)), R * 0.1);
      B.z(x, y, c, (own('orb', x, y) ? FLAG.owner : 0) | FLAG.sphere, zc - h, 2 * h, LAYER.orb);
    }
  }
  // ---- Mas: a flat card one voxel thick standing at the desk's far edge; his FRONT image (forearms, hands) below the
  // desk line lies on the desk top; the loose rim-light pixels of his outline sit on the surface behind them
  const zMas = DEPTH.mas;
  const opaque = (x: number, y: number) => x >= 0 && y >= 0 && x < NW && y < NH && L.mas.c[y * NW + x] !== TRANSPARENT;
  const DESK_ARM = {n: DESK_TOP.n, d: DESK_TOP.d + 0.003};
  for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
    const i = y * NW + x, c = L.mas.c[i];
    if (c === TRANSPARENT) continue;
    const fl = (own('mas', x, y) ? FLAG.owner : 0) | FLAG.card;
    if (L.masFront[i] && y >= DPLATE.deskY) { B.add(x, y, c, fl, DESK_ARM.n, DESK_ARM.d, 0.004, LAYER.mas); continue; }
    let nb = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && opaque(x + dx, y + dy)) nb++;
    if (nb < 3 && y < DPLATE.deskY && L.orb.c[i] === TRANSPARENT) { B.z(x, y, c, fl, plateDepth(x, y) - 0.012, 0.006, LAYER.mas); continue; }
    B.z(x, y, c, fl, zMas, zMas / CAM.f, LAYER.mas);
  }
  // ---- his glass: a flat card, like him
  let gLow = 0;
  for (let i = 0; i < NW * RH; i++) if (L.glass.c[i] !== TRANSPARENT) gLow = Math.max(gLow, Math.floor(i / NW));
  const zG = deskZ(gLow + 1) - 0.004;
  for (let y = 0; y < RH; y++) for (let x = 0; x < NW; x++) {
    const c = L.glass.c[y * NW + x];
    if (c !== TRANSPARENT) B.z(x, y, c, (own('glass', x, y) ? FLAG.owner : 0) | FLAG.card, zG, zG / CAM.f, LAYER.glass);
  }
  // ---- the key's shadows on the desk top: his glass (a flat card casts a flat shadow) and the Orb, tested by casting
  // from each footprint to the key through the card's plane (the shader dissolves them in once the room has depth)
  const [ox, oy] = L.orbC, orbC = atDepth(ox + 0.5, oy + 0.5, DEPTH.orb), orbR = (12 * DEPTH.orb) / CAM.f;
  const cardHit = (P: V3, z: number, img: Buf) => {
    const t = (-z - P[2]) / (KEY_LIGHT[2] - P[2]);
    if (t <= 0 || t >= 1) return false;
    const Q: V3 = [P[0] + (KEY_LIGHT[0] - P[0]) * t, P[1] + (KEY_LIGHT[1] - P[1]) * t, -z];
    const ix = Math.floor(CAM.cx + (CAM.f * Q[0]) / z), iy = Math.floor(CAM.cy - (CAM.f * Q[1]) / z);
    return ix >= 0 && iy >= 0 && ix < NW && iy < DPLATE.deskY && img.c[iy * NW + ix] !== TRANSPARENT;
  };
  const orbHit = (P: V3) => {
    const d = sub(KEY_LIGHT, P), m = sub(P, orbC as V3);
    const a = dot(d, d), b = 2 * dot(m, d), c = dot(m, m) - orbR * orbR, disc = b * b - 4 * a * c;
    if (disc < 0) return false;
    const t = (-b - Math.sqrt(disc)) / (2 * a);
    return t > 0 && t < 1;
  };
  const inShadow = (P: V3) => cardHit(P, zMas, L.mas) || cardHit(P, zG, L.glass) || orbHit(P);
  // ---- the desk: the top plane (footprints on y = -deskH), the near lip, its front panel; continued both ways
  const nearY = DPLATE.nearY;
  for (let y = DPLATE.deskY; y < NH + 40; y++) for (let x = -left; x < NW + right; x++) {
    const inF = x >= 0 && x < NW && y < NH;
    let col: number;
    if (inF) col = L.desk.c[y * NW + x];
    else if (y < NH) col = L.desk.c[y * NW + (x < 0 ? 0 : NW - 1)];
    else col = PAL.N0;
    if (col === TRANSPARENT) col = PAL.N0;
    const flags = own('desk', x, y) ? FLAG.owner : 0;
    if (y < nearY) {
      // the desk ends (its sides) out of frame, at a world X
      const P = onPlane(x + 0.5, y + 0.5, DESK_TOP.n, DESK_TOP.d);
      if (P[0] < EXT.deskEndL || P[0] > EXT.deskEndR) continue;
      B.add(x, y, col, flags | (inShadow(P) ? FLAG.shadow : 0), DESK_TOP.n, DESK_TOP.d, 0.03, LAYER.desk);
    } else if (y < nearY + 5) {
      const z = deskZ(nearY);
      const P = atDepth(x + 0.5, y + 0.5, z);
      if (P[0] < EXT.deskEndL || P[0] > EXT.deskEndR) continue;
      B.z(x, y, col, flags, z, 0.04, LAYER.desk);
    } else {
      const P = atDepth(x + 0.5, y + 0.5, DEPTH.panelZ);
      if (P[0] < EXT.deskEndL + 0.05 || P[0] > EXT.deskEndR - 0.05) continue;
      B.z(x, y, col, flags | FLAG.dark, DEPTH.panelZ, 0.02, LAYER.under);
    }
  }
  return B.done();
};

export const ownerCount = (I: Instances) => { let n = 0; for (let i = 0; i < I.n; i++) if (I.a0[i * 4 + 3] & FLAG.owner) n++; return n; };

// ------------------------------------------------------------------ the monitor's display, resolving (the push)
/** the display's image-space box (native px, [x0, x1) x [y0, y1)) */
export const SCREEN_BOX = {x0: M.x0 + 3, x1: M.x1 - 2, y0: M.topL + 3, y1: M.botL - 3};
/** continuous image point -> virtual screen (u, v): exactly the inverse of screenPoint (so the nest lines up) */
export const imgToUV = (xc: number, yc: number): [number, number] => {
  const x = xc - 0.5, y = yc - 0.5;
  const u = ((x - M.x0 - 3) / (M.x1 - M.x0 - 6)) * DPLATE_SCREEN_W;
  const f = (x - M.x0) / (M.x1 - M.x0);
  const s0 = M.topL + f * (M.topR - M.topL) + 3, s1 = M.botL + f * (M.botR - M.botL) - 4;
  return [u, ((y - s0) / (s1 - s0)) * DPLATE_SCREEN_H];
};
export interface ScreenLevel { L: number; w: number; h: number; col: Uint32Array; kind: Uint8Array }
/**
 * The display at resolution step L (2^L texels per image px): level 0 is the plate's own painted pixels (so the quad
 * is the flat frame, bit for bit); each finer level samples `paint(scr, V)` (the virtual screen drawn at V px per
 * virtual px) through the monitor's own mapping. kind: 0 = not display (the bezel's voxels show), 1 = display,
 * 2 = the portal (V2's photo window, which opens onto the 3D nest).
 */
export const screenLevel = (L: number, plate: Buf, paint: (scr: Buf, V: number) => void): ScreenLevel => {
  const S = 1 << L, {x0, x1, y0, y1} = SCREEN_BOX;
  const w = (x1 - x0) * S, h = (y1 - y0) * S;
  const col = new Uint32Array(w * h), kind = new Uint8Array(w * h);
  let scr: Buf | null = null;
  if (L > 0) { scr = new Buf(DPLATE_SCREEN_W * S, DPLATE_SCREEN_H * S, PAL.N1); paint(scr, S); }
  const P = portalRect();
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const xc = x0 + (i + 0.5) / S, yc = y0 + (j + 0.5) / S;
    const px = Math.floor(xc), py = Math.floor(yc), k = j * w + i;
    if (!isDisplayPixel(px, py)) continue;
    if (!scr) { col[k] = plate.c[py * NW + px]; kind[k] = isPortalPixel(px, py) ? 2 : 1; continue; }
    const [u, v] = imgToUV(xc, yc);
    const su = Math.max(0, Math.min(scr.w - 1, Math.floor(u * S))), sv = Math.max(0, Math.min(scr.h - 1, Math.floor(v * S)));
    col[k] = scr.c[sv * scr.w + su];
    kind[k] = u >= P.x && u < P.x + P.w && v >= P.y && v < P.y + P.h ? 2 : 1;
  }
  return {L, w, h, col, kind};
};
