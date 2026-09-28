// MR. MAS — kit: THE YEAR ON THE MONITOR, the rest of Act Three's items (Ep1 sc 19, 22, 23; new file, owned by the
// `v3-art-b` pass). Painters for kits/mas-monitor.ts (POV / OTS) and the dark room's two-shot screen (the mini).
//   lighthousePainter(st)   19.11 / 19.13: MISANTHROPIC's lighthouse (rooms/lighthouse.ts, reused whole) with its own
//                           sign on the brick, `MISANTHROPIC` (the beat plan: the lighthouse's own sign replaces the plate),
//                           MARIO at the desk on phone one, finger raised mid-warning; `ring2` the second phone ringing,
//                           `answer` Mario has picked it up too; `meter` the rent meter hanging, spinning
//                           (NOZAMA · UP TO $4B, the room's own meter)
//   devdayPainter(st)       22.01: the keynote stage: MAS at the centre mark, the launch-night odometer clunking up
//                           through the floor (3 held steps) to `100,000,000 / WEEK`, TASYA walking on from the right,
//                           laughing, arms open; the crowd's heads along the bottom
//   coldOpenPainter(st)     23.01: the cold open's frame, the APEC stage (rooms/apec-stage.ts, the `v3-art-a` pass's
//                           room, reused whole): a crop of its wide at the screen's own size
import {Buf, rect, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg} from '../figure';
import {bigText, bigTextWidth, text} from '../font';
import {pt, pw} from './uitype';
import {isMini, Painter} from './mas-monitor';
import {drawLighthouse, LIGHTHOUSE, handsetImg} from '../rooms/lighthouse';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../cast/mario';
import {drawMasStand, MAS_STAND_DEFAULT} from '../cast/mas-stand';
import {drawTasyaStage} from '../cast/civic-extras';
import {odometer} from './avalanche';
import {drawApecWide} from '../rooms/apec-stage';

/** copy a 480 x 203 room into a screen buffer: the POV screen takes a centred crop at 1:1 (never scaled); the mini
 *  takes a crop round `focus` */
const cropInto = (scr: Buf, room: Buf, focus: [number, number]) => {
  const x0 = Math.max(0, Math.min(480 - scr.w, Math.round(focus[0] - scr.w / 2)));
  const y0 = Math.max(0, Math.min(203 - scr.h, Math.round(focus[1] - scr.h / 2)));
  for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, room.get(x0 + x, y0 + y));
  return [x0, y0];
};

// ------------------------------------------------------------------ the lighthouse (19.11, 19.13)
export interface LighthouseItemState { ring2?: number | null; answer?: boolean; meter?: boolean; }
export const lighthousePainter = (st: LighthouseItemState = {}): Painter => (scr, f) => {
  const room = new Buf(480, 270, PAL.N0);
  const out = drawLighthouse(room, f, {meters: st.meter ? 1 : 0, phone1: 'off', throne: 'on', ring2: st.answer ? null : st.ring2 ?? null, phone2: st.answer ? 'off' : 'cradle'});
  // MARIO behind the desk, the handset at his ear, the finger of the other hand raised (mid-warning)
  const [mx, my] = out.anchors.marioBehind;
  const img = marioImg({...MARIO_BASE, arm: 'raise'});
  blitImg(room, img, mx - MARIO_FOOT[0], my - MARIO_FOOT[1], {clip: (_x, y) => y < LIGHTHOUSE.desk.back + 2});
  const hs = handsetImg('cream', true);
  blitImg(room, hs, mx - 12, my - 76);
  if (st.answer) blitImg(room, handsetImg('black', false), mx + 10, my - 70);
  out.front?.(room);
  // the lighthouse's own sign on the brick, above the desk: a painted board, MISANTHROPIC in its brick red on cream
  const s = 'MISANTHROPIC', sw = bigTextWidth(s) + 16, sx = 240 - Math.round(sw / 2), sy = 92;
  rect(sx - 1, sy - 1, sw + 2, 22, room.ink(PAL.D1)); rect(sx, sy, sw, 20, room.ink(PAL.P1)); rect(sx, sy, sw, 1, room.ink(PAL.P2)); rect(sx, sy + 19, sw, 1, room.ink(PAL.P0));
  bigText(room, s, sx + 8, sy + 3, PAL.W3);
  if (isMini(scr)) { cropInto(scr, room, [240, 110]); return; }
  cropInto(scr, room, [240, 104]);
};

// ------------------------------------------------------------------ DevDay (22.01)
export interface DevDayState { rise: 0 | 1 | 2 | 3; clunk?: boolean; tasya: number | null; laugh?: boolean; mouth?: 'rest' | 'open'; /** v3.1: the Sydney bubble on its chain, tiny, riding behind Tasya */ sydney?: boolean; }
export const devdayPainter = (st: DevDayState): Painter => (scr, f) => {
  const mini = isMini(scr);
  const W = mini ? 480 : scr.w, H = mini ? 203 : scr.h;
  const room = new Buf(480, 270, PAL.N0);
  // the stage: a dark hall, the big backdrop screen in the show's cyan with the event's plain name, the stage's lit edge
  const floorY = Math.round(H * 0.74);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) room.set(x, y, y < floorY ? (bayer(x, y) < 0.15 ? PAL.N2 : PAL.N1) : y === floorY ? PAL.C5 : y < floorY + 3 ? PAL.N3 : PAL.N2);
  const bx0 = Math.round(W * 0.14), bx1 = Math.round(W * 0.86), by0 = Math.round(H * 0.06), by1 = Math.round(H * 0.5);
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) { const t = (y - by0) / (by1 - by0) + (bayer(x, y) - 0.5) * 0.2; room.set(x, y, t < 0.4 ? PAL.C1 : t < 0.8 ? PAL.C2 : PAL.C3); }
  const title = 'DEVDAY';
  bigText(room, title, Math.round(W / 2 - bigTextWidth(title) / 2), Math.round((by0 + by1) / 2 - 7), PAL.C8, {shadow: PAL.C0});
  // the odometer clunking up through the floor: its drum housing rises in held steps, the drums reading the week
  const rise = [0, 10, 22, 34][st.rise];
  if (rise) {
    const val = 100000000;
    const tmp = new Buf(480, 60, 0x1000000);
    odometer(tmp, 30, 20, val, {digits: 9, commas: true, suffix: '/ WEEK', kick: st.clunk});
    const ox = Math.round(W * 0.42) - 30, oy = floorY - rise - 7;
    for (let j = 0; j < 60; j++) for (let i = 0; i < 200; i++) { const c = tmp.get(i, j); if (c !== 0x1000000 && oy + j - 20 < floorY) room.set(ox + i, oy + j - 20 + 13, c); }
    rect(ox + 20, floorY - 1, 170, 1, room.ink(PAL.C7)); // the floor's lit seam where it came up
  }
  // MAS at the centre mark (the room sprite), turning to Tasya; TASYA walking on from the right, arms open
  drawMasStand(room, Math.round(W * 0.2), floorY, {...MAS_STAND_DEFAULT, mouth: st.mouth ?? 'rest', light: 'monitor'});
  if (st.tasya !== null && st.sydney) {
    // the Sydney bubble on its chain (sc 10's egg-timer chain), tiny, hanging behind his shoulder: a cream bubble, two
    // dot eyes, a dotted mouth, the chain up out of frame
    const tx = Math.round(W * 0.97 - (W * 0.2) * Math.min(1, st.tasya)) + 14, ty = floorY - 70;
    for (let y = 0; y < ty; y += 2) room.set(tx + 4, y, PAL.G4);
    rect(tx, ty, 10, 7, room.ink(PAL.P2)); rect(tx, ty, 10, 1, room.ink(PAL.C6)); room.set(tx + 1, ty + 7, PAL.P2);
    room.set(tx + 3, ty + 2, PAL.N0); room.set(tx + 6, ty + 2, PAL.N0); room.set(tx + 3, ty + 5, PAL.G4); room.set(tx + 5, ty + 5, PAL.G4); room.set(tx + 7, ty + 5, PAL.G4);
  }
  if (st.tasya !== null) drawTasyaStage(room, Math.round(W * 0.97 - (W * 0.2) * Math.min(1, st.tasya)), floorY, {f, walk: st.tasya < 1, laugh: st.laugh ?? true, flip: true});
  // the crowd's heads along the bottom: dark rounded bumps, a few phones lit
  for (let x = -4; x < W; x += 11) { const hx = x + Math.round(hash(x, 1, 91) * 4), hy = H - 10 + Math.round(hash(x, 2, 91) * 3); for (let j = 0; j < 14; j++) for (let i = 0; i < 10; i++) if (Math.hypot((i - 5) / 5, (j - 6) / 7) < 1 || j > 8) room.set(hx + i, hy + j, PAL.N0); if (hash(x, 3, 91) < 0.15) rect(hx + 3, hy - 4, 3, 4, room.ink(PAL.C6)); }
  if (mini) { cropInto(scr, room, [W * 0.55, H * 0.55]); return; }
  for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, room.get(x, y));
};

// ------------------------------------------------------------------ the cold open's frame (23.01)
export const coldOpenPainter = (st: {} = {}): Painter => (scr, f) => {
  const room = new Buf(480, 270, PAL.N0);
  drawApecWide(room, f, {});
  cropInto(scr, room, isMini(scr) ? [200, 110] : [230, 104]);
  void st; void pt; void pw; void text; void stepColor;
};
