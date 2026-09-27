// MR. MAS — shared room: the BOARDROOM, DOWN THE TABLE TO ITS HEAD (PLATE-BOARD-HEAD; Ep1 Act Four v5 art pass; new file,
// owned by the v5 art pass). A new angle on rooms/boardroom.ts's room: the camera at the table's foot, looking down its
// length to the CEO chair at the head. The dark window onto the Valley runs down the left wall, the walnut slats down
// the right, the pendant's LED bar along the table's axis (the cool key), the back wall behind the chair with the slot
// Tasya's slate door opens in. Used by:
//   drawBoardHead2S   S4.10b [2S]: TTEMME in the CEO chair at the head (medium rig, flipped to face her), NELEH standing
//                     at the table's right side (medium rig), MADA soft beyond on the left side with his spinner, the
//                     sealed folder on the table (sliding toward Ttemme in held steps, or in his hands), his LIVE · CHAT
//                     panel at his elbow (kits/chat-panel.ts)
//   drawBoardHeadM    S4.13c [M]: Ttemme alone at the head, turned to the door; the slate door OPEN at the back with
//                     TASYA small in it (room scale, soft), nodding; Ttemme nods back
// The plate alone is drawBoardHead (walls, window, ceiling, table, chair, door). Figures are the callers' (the compose
// functions here are the reference framings). Palette: master only; the boardroom's own materials (defineMat, first
// definition wins, so they match rooms/boardroom.ts).
import {Buf, rect, line, poly, bayer, hash, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {drawTtemmeMedium, TtemmeMediumState, TTEMME_MEDIUM_DEFAULT, TTEMME_MW} from '../cast/ttemme-medium';
import {drawNelehMedium, NelehMediumState, NELEH_MEDIUM_DEFAULT} from '../cast/neleh-medium';
import {drawMadaMedium, MADA_MEDIUM_DEFAULT} from '../cast/mada-medium';
import {drawTasyaRoom, TasyaRoomPose, TASYA_ROOM_DEFAULT} from '../cast/tasya-speak';
import {drawFolder, FolderState} from '../kits/folder';
import {drawChatPanel} from '../kits/chat-panel';

defineMat('br.slate', ['N0', 'N1', 'G0', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'G0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'G0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('br.carpet', ['N0', 'N1', 'N1', 'N2', 'U0', 'U0', 'U1', 'N5'], ['N0', 'N1', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('br.walnut', ['N0', 'D0', 'D1', 'D1', 'D2', 'D3', 'N5', 'N6'], ['N0', 'D0', 'D1', 'C0', 'C1', 'C2', 'C4', 'C6'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W6']);
defineMat('br.leather', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C3', 'C5'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W5']);

const RH = 203;
/** geometry (frame coords) */
export const BHEAD = {
  vp: [240, 60] as [number, number],
  back: {x0: 150, x1: 330, y0: 18, y1: 112},
  /** the table: far edge row and its x extent, near edge (off frame) extent */
  table: {farY: 118, farX0: 196, farX1: 284, nearX0: 110, nearX1: 370},
  chair: {cx: 240, top: 42},
  /** Tasya's slate door in the back wall, left of the chair */
  door: {x0: 162, x1: 198, y0: 26},
  /** where the compose functions put the rigs (top-left) */
  ttemme: [204, 38] as [number, number],
  neleh: [372, 22] as [number, number],
  mada: [70, 60] as [number, number],
  /** the folder's slide across the table: from Neleh's side to in front of him */
  folderPath: [[318, 156], [250, 126]] as [[number, number], [number, number]],
  chat: {x: 150, y: 118},
};
const B = BHEAD;
const edgeL = (y: number) => B.table.farX0 - ((y - B.table.farY) * (B.table.farX0 - B.table.nearX0)) / (RH - B.table.farY);
const edgeR = (y: number) => B.table.farX1 + ((y - B.table.farY) * (B.table.nearX1 - B.table.farX1)) / (RH - B.table.farY);

export interface BoardHeadOpts {
  /** the back wall is MACROSOFT slate (after S4.12) */
  slate?: boolean;
  /** Tasya's door: 0 none · 4 there, shut · 5 open (slate light inside) */
  door?: 0 | 4 | 5;
  /** the lighting note: the room steps down k (never the faces) */
  dim?: 0 | 1 | 2;
}
const plateCache = new Map<string, Buf>();
/** The plate: back wall, left window wall, right slat wall, ceiling + the LED bar, the table, the CEO chair, the door. */
export const drawBoardHead = (b: Buf, f: number, o: BoardHeadOpts = {}) => {
  const key = `${o.slate ? 1 : 0}:${o.door ?? 0}:${o.dim ?? 0}`;
  let plate = plateCache.get(key);
  if (!plate) {
    const mb = new MatBuf(480, RH);
    const {back} = B;
    // ceiling (dark) and the floor (carpet) as the frame's fill
    rect(0, 0, 480, RH, mb.mat('br.carpet', -0.5));
    poly([0, 0, 480, 0, back.x1, back.y0, back.x0, back.y0], mb.mat('wall', -1.2));
    // the left wall: the window onto the Valley (a dark glass band receding), its mullions converging
    poly([0, 0, back.x0, back.y0, back.x0, back.y1, 0, RH], mb.mat('wall', -0.6));
    poly([0, 8, back.x0 - 2, back.y0 + 4, back.x0 - 2, back.y1 - 8, 0, RH - 30], mb.emit(PAL.N1));
    // the right wall: walnut slats receding
    poly([480, 0, back.x1, back.y0, back.x1, back.y1, 480, RH], mb.mat('br.walnut', 0.4));
    // the back wall behind the chair
    rect(back.x0, back.y0, back.x1 - back.x0, back.y1 - back.y0, mb.mat(o.slate ? 'br.slate' : 'wall', o.slate ? 1.2 : 0.6));
    // the table (walnut), the chair's high back behind its head
    poly([B.table.farX0, B.table.farY, B.table.farX1, B.table.farY, B.table.nearX1, RH + 1, B.table.nearX0, RH + 1], mb.mat('br.walnut', 1.4));
    const plate0 = new Buf(480, RH, PAL.N0);
    // the door (before resolve: its inside is emissive slate light when open)
    const d = B.door;
    if ((o.door ?? 0) >= 4) {
      rect(d.x0 - 3, d.y0 - 3, d.x1 - d.x0 + 6, back.y1 - d.y0 + 3, mb.mat('br.slate', 0.2));
      if (o.door === 5) {
        for (let y = d.y0; y < back.y1; y++) for (let x = d.x0; x < d.x1; x++) mb.emit(bayer(x, y) < 0.3 ? PAL.G5 : PAL.G4)(x, y);
      } else rect(d.x0, d.y0, d.x1 - d.x0, back.y1 - d.y0, mb.mat('br.slate', 1.8));
    }
    resolve(mb, {
      amb: (x, y) => 1.6 - (o.dim ?? 0) * 0.6 + (y > B.table.farY ? 0.3 : 0),
      cyan: (x, y) => {
        // the pendant's LED bar along the table's axis: a pool down the table top, a wash on the chair and the back wall
        const cx = 240, w = y >= B.table.farY ? 60 + (y - B.table.farY) * 0.6 : 70;
        return clamp(1 - Math.abs(x - cx) / w, 0, 1) * (y >= B.table.farY ? 0.5 : 0.4) * (1 - (o.dim ?? 0) * 0.25);
      },
      warm: () => 0,
      dither: 0.8,
    }, plate0);
    // hand-painted details on top (after the light pass, in palette)
    // the window: the Valley's lights, and the mullions converging on the vanishing point
    for (let k = 0; k < 140; k++) {
      const x = Math.floor(hash(k, 1, 13) * (back.x0 - 4)), top = 8 + (x / back.x0) * (back.y0 - 4), bot = RH - 30 + (x / back.x0) * (back.y1 - 8 - RH + 30);
      const y = Math.floor(top + (bot - top) * (0.45 + hash(k, 2, 13) * 0.5));
      plate0.set(x, y, hash(k, 3, 13) < 0.6 ? PAL.W4 : hash(k, 4, 13) < 0.5 ? PAL.C4 : PAL.W6);
    }
    for (const t of [0.28, 0.58, 0.82]) {
      const x = Math.round(t * (back.x0 - 2));
      line(x, Math.round(8 + t * (back.y0 - 4)), x, Math.round(RH - 30 + t * (back.y1 - 8 - RH + 30)), plate0.ink(PAL.N0));
    }
    line(0, 8, back.x0 - 2, back.y0 + 4, plate0.ink(PAL.N0));
    // the slats on the right wall (lines toward the VP)
    for (let k = 0; k < 9; k++) {
      const y0 = 10 + k * 22;
      line(480, y0, back.x1, back.y0 + ((y0 - 0) / RH) * (back.y1 - back.y0), plate0.ink(PAL.D0));
    }
    // the LED bar: an emissive strip down the ceiling toward the back wall
    poly([196, 0, 284, 0, 250, back.y0 - 2, 230, back.y0 - 2], (x, y) => plate0.set(x, y, y < 6 ? PAL.C7 : bayer(x, y) < 0.5 ? PAL.C6 : PAL.C5));
    // the table's grain and the pendant's reflection down its middle
    for (let y = B.table.farY + 2; y < RH; y += 3) {
      const a = Math.ceil(edgeL(y)), z = Math.floor(edgeR(y));
      for (let x = a; x < z; x++) if (hash(x >> 3, y, 21) < 0.08) plate0.set(x, y, stepColor(plate0.get(x, y), -1));
    }
    for (let y = B.table.farY; y < RH; y++) {
      const w = 3 + (y - B.table.farY) * 0.12;
      for (let x = Math.round(240 - w); x < 240 + w; x++) if (bayer(x, y) < 0.3) plate0.set(x, y, stepColor(plate0.get(x, y), 1));
    }
    line(B.table.farX0, B.table.farY, B.table.farX1, B.table.farY, plate0.ink(PAL.D4));
    line(B.table.farX0, B.table.farY, B.table.nearX0, RH, plate0.ink(PAL.D0));
    line(B.table.farX1, B.table.farY, B.table.nearX1, RH, plate0.ink(PAL.D3));
    // the CEO chair's high tufted leather back (lit from above by the LED bar)
    const {cx, top} = B.chair, cw = 58;
    for (let y = top; y < B.table.farY; y++) {
      const t = y - top, r = t < 8 ? Math.round(8 - Math.sqrt(Math.max(0, 64 - (8 - t) ** 2))) : 0;
      for (let x = cx - cw / 2 + r; x < cx + cw / 2 - r; x++) {
        const e = Math.min(x - (cx - cw / 2 + r), cx + cw / 2 - r - 1 - x);
        plate0.set(x, y, e < 1 ? PAL.N0 : t < 3 ? PAL.N5 : e < 3 ? PAL.N3 : PAL.N2);
      }
    }
    for (let j = 0, y = top + 12; y < B.table.farY - 4; j++, y += 10) for (let x = cx - 20 + (j % 2) * 7; x < cx + 20; x += 14) { plate0.set(x, y, PAL.N1); plate0.set(x + 1, y, PAL.N4); }
    // the back wall's door frame lines (slate door)
    if ((o.door ?? 0) >= 4) { rect(d.x0 - 3, d.y0 - 3, d.x1 - d.x0 + 6, 1, plate0.ink(PAL.G1)); rect(d.x0 - 3, d.y0 - 3, 1, B.back.y1 - d.y0 + 3, plate0.ink(PAL.G1)); rect(d.x1 + 2, d.y0 - 3, 1, B.back.y1 - d.y0 + 3, plate0.ink(PAL.G0)); }
    plate = plate0;
    plateCache.set(key, plate);
    if (plateCache.size > 16) plateCache.delete(plateCache.keys().next().value as string);
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.c[y * b.w + x] = plate.c[y * 480 + x];
};
/** repaint only the table top (the rigs' TABLE rows sit on its far edge: call it between the BACK and FRONT images) */
const tableOver = (b: Buf, plate: Buf, yMin: number) => {
  for (let y = Math.max(B.table.farY, yMin); y < RH; y++) for (let x = Math.floor(edgeL(y)); x <= Math.ceil(edgeR(y)); x++) b.set(x, y, plate.get(x, y));
};
const soft = (k: number) => (c: number) => stepColor(c, -k);

export interface BoardHead2SState {
  ttemme?: Partial<TtemmeMediumState>;
  neleh?: Partial<NelehMediumState> | null;
  /** Mada soft beyond, his spinner frame (null = no spinner) */
  mada?: {spin?: number | null} | null;
  folder?: FolderState | null;
  /** his chat panel's scroll frame (null = off) */
  chat?: number | null;
  plate?: BoardHeadOpts;
}
export const drawBoardHead2S = (b: Buf, f: number, s: BoardHead2SState = {}) => {
  drawBoardHead(b, f, s.plate);
  const plate = new Buf(480, RH, PAL.N0);
  drawBoardHead(plate, f, s.plate);
  // Mada soft beyond, at the table's left side (flipped to face across it), two rungs down
  if (s.mada !== null) {
    const [mx, my] = B.mada;
    drawMadaMedium(b, mx, my, {...MADA_MEDIUM_DEFAULT, head: '34', look: -1, chair: false}, {flip: true, map: soft(2), spin: s.mada?.spin === undefined ? f : s.mada.spin});
    chairBack(b, mx + 6, my + 76, 64, 1);
  }
  // Ttemme at the head, flipped to face her
  const [tx, ty] = B.ttemme;
  const folderUp = s.folder && s.folder.kind === 'up' ? s.folder : null;
  const st: TtemmeMediumState = {...TTEMME_MEDIUM_DEFAULT, look: 1, ...s.ttemme, arm: folderUp ? 'folder' : (s.ttemme?.arm ?? 'rest')};
  drawTtemmeMedium(b, tx, ty, st, {flip: true, f, table: (bb) => tableOver(bb, plate, 0), folder: folderUp});
  if (s.chat !== null && s.chat !== undefined) drawChatPanel(b, B.chat.x, B.chat.y, 'medium', s.chat);
  if (s.folder && s.folder.kind === 'table') drawFolder(b, 0, 0, s.folder, {path: B.folderPath});
  // Neleh standing at the table's right side (her own rig faces camera-left: she looks down the table at him)
  if (s.neleh !== null) {
    const [nx, ny] = B.neleh;
    drawNelehMedium(b, nx, ny, {...NELEH_MEDIUM_DEFAULT, head: '34', arm: 'paper', ...s.neleh}, {orbit: f});
    // the near chair's high back in the right foreground: she stands behind it (it hides where her rig ends)
    chairBack(b, 350, 136, 118, 0);
  }
};
/** a leather chair's high back seen from behind (a foreground occluder): rounded top, the pendant's line on its crown.
 *  k = how many rungs it steps down (1 for a chair beyond, 0 in the foreground) */
const chairBack = (b: Buf, x0: number, y0: number, w: number, k: number) => {
  const r0 = Math.min(12, Math.floor(w / 5));
  for (let y = y0; y < RH; y++) {
    const t = y - y0, r = t < r0 ? Math.round(r0 - Math.sqrt(Math.max(0, r0 * r0 - (r0 - t) ** 2))) : 0;
    for (let x = x0 + r; x < x0 + w - r; x++) {
      const e = Math.min(x - (x0 + r), x0 + w - r - 1 - x);
      b.set(x, y, stepColor(t < 2 ? PAL.N4 : e < 2 ? PAL.N2 : t < 5 ? PAL.N2 : PAL.N1, -k));
    }
  }
  for (let y = y0 + 14; y < RH - 4; y += 12) for (let x = x0 + 12; x < x0 + w - 12; x += 16) b.set(x, y, stepColor(PAL.N3, -k));
};
export interface BoardHeadMState {
  ttemme?: Partial<TtemmeMediumState>;
  tasya?: Partial<TasyaRoomPose> | null;
  /** Tasya's nod: 0 | 1 (his head a pixel down, the drawing held) */
  tasyaNod?: 0 | 1;
  chat?: number | null;
  plate?: BoardHeadOpts;
}
/** S4.13c: Ttemme alone at the head, turned to the open slate door; Tasya small and soft in it. */
export const drawBoardHeadM = (b: Buf, f: number, s: BoardHeadMState = {}) => {
  const po: BoardHeadOpts = {slate: true, door: 5, ...s.plate};
  drawBoardHead(b, f, po);
  const plate = new Buf(480, RH, PAL.N0);
  drawBoardHead(plate, f, po);
  if (s.tasya !== null) {
    const d = B.door;
    drawTasyaRoom(b, Math.round((d.x0 + d.x1) / 2), B.back.y1 + (s.tasyaNod ? 1 : 0), {...TASYA_ROOM_DEFAULT, light: 'slate', ...s.tasya}, {map: soft(1)});
    // the door's frame over his edges (he stands in it, not in front of it)
    rect(d.x0 - 3, d.y0 - 3, 3, B.back.y1 - d.y0 + 3, b.ink(PAL.G1)); rect(d.x1, d.y0 - 3, 3, B.back.y1 - d.y0 + 3, b.ink(PAL.G0));
  }
  const [tx, ty] = B.ttemme;
  drawTtemmeMedium(b, tx, ty, {...TTEMME_MEDIUM_DEFAULT, look: -1, ...s.ttemme}, {flip: false, f, table: (bb) => tableOver(bb, plate, 0)});
  if (s.chat !== null && s.chat !== undefined) drawChatPanel(b, B.chat.x, B.chat.y, 'medium', s.chat);
  void TTEMME_MW;
};
