// MR. MAS — shared room: MAS'S DARK ROOM for Act Three and the tag (Ep1 sc 18–23, 32–33; new file, owned by the `v3-art-b`
// pass). The room is Act Four's (rooms/darkroom-plate.ts, the medium plate, and rooms/darkroom.ts, the intro's wide);
// neither file is edited. This module adds what July to December put in it, as overlays and compositions:
//   ORB_HOME / drawOrbOutline   the faded outline of a sphere on the wallpaper, the spot kept for it for years (sc 18):
//                               on the wall between the window and the rack, where the plate has wallpaper (the Orb's
//                               Act Four spot at his shoulder is in front of the window). `filled` = the Orb is in it.
//   ledsOff(b)                  the rack's LEDs stop, all of them (sc 20's one quiet beat); draw after drawDarkPlate
//   drawBoxTray(b, st)          sc 18: the COINWORLD box sliding out of the rack's drive slot like a tray (4 held steps),
//                               its lid, the packing foam, the Orb rising out of it (3 held steps) to eye level
//   drawLabelECU(b, f, st)      [ECU] (18.02) the box's shipping label, legible as he reaches for the lid:
//                               `FROM: COINWORLD · PROOF YOU'RE HUMAN` over `SHIP TO: MAS MANALT, CO-FOUNDER`
//   drawMagTray(b, pos)         sc 32: EMIT's year-end issue on the slot's tray (the two-shot's scale)
//   drawSlotECU(b, f, st)       [INSERT] (32.02) the rack's slot close, the magazine sliding out, its cover up
//   drawDarkA3(b, f, st)        [2S] the plate composed with all of the above: Mas (cast/mas-medium), the Orb (at 'home',
//                               'shoulder', 'box' rising, or a point), the tray, the paper's thud (kits/grey-lady), the
//                               cover in his hand, the scan fan and the toasts (kits/orb-toast); returns the scan's Mask
//   drawScanMCU(b, f, st)       [MCU] (18.04, 18.05) Mas's portrait, the thin cyan cone across his face from the Orb off
//                               frame right (its Mask is the GLYPH layer's: tokens inside the cone only), the toast
//   drawOrbOTS(b, f, st)        [OTS] (19.12) from behind the Orb (big, frame right, its chrome back to us), Mas lit cyan,
//                               watching the monitor past him (any painter on the monitor)
//   drawCoverMCU(b, f, st)      [MCU] (32.03, 32.05) Mas holding the cover up beside his face: the cover's face and his
//                               wear the same expression
//   drawBackWall(b, f, st)      [W] (32.07) the dark room's wide: the cover pinned to the wall, the GUEST lanyard framed
//                               beside it, Mas on his feet pinning it (cast/mas-stand)
//   drawProfileGlass(b, f, st)  [MCU·PF] (33.04) Mas, his glass at his hand in the same frame: everything hopped, its
//                               water line flat (the beat plan folds the glass insert into this frame)
import {Buf, rect, line, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg} from '../figure';
import {tiny, tinyWidth, vignette} from './kit-b';
import {pt, pw} from '../kits/uitype';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DPLATE_LOOK, DarkPlateOpts} from './darkroom-plate';
import {drawDarkRoom, drawDarkRoomFront, DARKROOM} from './darkroom';
import * as MM from '../cast/mas-medium';
import * as OM from '../cast/orb-medium';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {drawMasStand, MAS_STAND_DEFAULT} from '../cast/mas-stand';
import {putBustCut} from '../cast/civic-kit';
import {drawToast, drawScanFan, ToastKind} from '../kits/orb-toast';
import {drawEmitCover} from '../kits/emit-cover';
import {faceKey} from '../kits/face-light';
import {faceLightImg} from '../kits/face-light-img';
/** the medium Mas's face in his tile (cast/mas-medium at DPLATE.mas): the rect the face light works inside */
export const FACE_AT_MEDIUM = {x0: 22, y0: 2, x1: 62, y1: 44};
import {drawPaperPlate} from '../kits/grey-lady';
import {guestBadge} from '../kits/props';
import type {Painter} from '../kits/mas-monitor';
import {Mask} from '../mask';

const RH = 203;
// ------------------------------------------------------------------ the Orb's home on the wall
export const ORB_HOME = {x: 378, y: 62, r: 13};
export const drawOrbOutline = (b: Buf, o: {filled?: boolean} = {}) => {
  const {x, y, r} = ORB_HOME;
  // a sun-faded disc (the wallpaper a rung lighter where something round has hung for years), a crisp ring round it
  for (let j = -r - 1; j <= r + 1; j++) for (let i = -r - 1; i <= r + 1; i++) {
    const d = Math.hypot(i + 0.5, j + 0.5);
    if (d > r + 0.5) continue;
    const X = x + i, Y = y + j;
    if (d > r - 0.6) b.set(X, Y, stepColor(b.get(X, Y), -2));
    else if (d > r - 1.6) b.set(X, Y, stepColor(b.get(X, Y), 1));
    else if (!o.filled && bayer(X, Y) < 0.75) b.set(X, Y, stepColor(b.get(X, Y), 1));
  }
  // the old hook's hole above it
  b.set(x, y - r - 3, PAL.N0);
};
/** the rack's LEDs, all off (the plate's LED positions, from its geometry) */
export const ledsOff = (b: Buf) => {
  for (let k = 0, y = DPLATE.rack.y0 + 6; y < DPLATE.deskY - 4; y += 12, k++) {
    const x = DPLATE.rack.x0 + 10;
    b.set(x, y + 3, PAL.N1); b.set(x + 3, y + 3, PAL.N1);
    b.set(x, y + 7, PAL.N1); b.set(x + 6, y + 7, PAL.N1);
  }
};

/** fingertips coming up from the frame's foot (or a card's edge): n rounded tips with pale nails, lit by the monitor's
 *  cyan on their left edges, stepping a little in height (a relaxed hand) */
const fingertips = (b: Buf, x: number, y: number, n: number, w = 11, gap = 2, bottom = RH) => {
  // the back of the hand under the fingers (they belong to one hand), then each finger over it
  const hw = n * (w + gap), px = x - 2, py = y + w + 8;
  for (let yy = py; yy < bottom; yy++) for (let xx = px; xx < px + hw + 4; xx++) { const t = (xx - px) / (hw + 4); if (Math.hypot((t - 0.5) * 2, Math.max(0, py + 10 - yy) / 10) <= 1) b.set(xx, yy, t < 0.15 ? PAL.K3 : t > 0.85 ? PAL.X1 : PAL.K2); }
  for (let k = 0; k < n; k++) {
    const fx = x + k * (w + gap), fy = y + [4, 0, 1, 5][k % 4];
    const r = w / 2;
    for (let yy = fy; yy < bottom; yy++) for (let xx = fx; xx < fx + w; xx++) {
      const inTip = yy >= fy + r || Math.hypot(xx + 0.5 - fx - r, yy + 0.5 - fy - r) <= r;
      if (!inTip) continue;
      const edgeL = xx === fx || (yy < fy + r && Math.hypot(xx - 0.5 - fx - r, yy + 0.5 - fy - r) > r);
      b.set(xx, yy, edgeL ? PAL.K4 : xx >= fx + w - 2 ? PAL.X1 : yy < fy + 3 ? PAL.K3 : PAL.K2);
    }
    rect(fx + 2, fy + 2, w - 5, 3, b.ink(PAL.K4)); b.set(fx + 2, fy + 2, PAL.C8); // the nail
  }
};

// ------------------------------------------------------------------ the COINWORLD box (sc 18)
export const BOX = {w: 58, h: 24, travel: [0, 36, 80, 124, 150]};
export interface BoxTrayState { pos: 0 | 1 | 2 | 3 | 4; open?: boolean; rise?: 0 | 1 | 2 | 3; f?: number; }
const boxX = (pos: number) => DPLATE.slot.x - BOX.travel[pos] - (pos ? 6 : 0);
/** where the Orb is as it rises out of the box (centre), per rise step 0..3 (3 = eye level, then it drifts) */
export const boxOrbAt = (rise: number): [number, number] => { const x = boxX(4) + BOX.w / 2; return [Math.round(x), [DPLATE.deskY + 6, 110, 90, 72][rise]]; };
export const drawBoxTray = (b: Buf, st: BoxTrayState) => {
  if (!st.pos) return;
  const x = boxX(st.pos), y = DPLATE.deskY + 6;
  const clip = (X: number) => X < DPLATE.slot.x;
  const put = (X: number, Y: number, c: number) => { if (clip(X)) b.set(X, Y, c); };
  const box = (X: number, Y: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(X + i, Y + j, c); };
  // the tray (the drive's black tray, a cyan lip) and its shadow
  for (let i = 0; i < BOX.w + 12; i++) put(x - 4 + i, y + BOX.h + 3, PAL.N0);
  box(x - 4, y + BOX.h - 2, BOX.w + 10, 4, PAL.G1); box(x - 4, y + BOX.h - 2, BOX.w + 10, 1, PAL.C3);
  // the box: a white product box, its lid's seam, a cyan circle mark, the maker's name on the front
  box(x, y, BOX.w, BOX.h - 2, PAL.P2); box(x, y, BOX.w, 1, PAL.W9); box(x + BOX.w - 2, y, 2, BOX.h - 2, PAL.P0);
  box(x, y + 6, BOX.w, 1, PAL.P0);
  for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (Math.hypot(i, j) <= 3.4 && Math.hypot(i, j) >= 2) put(x + 9 + i, y + 14 + j, PAL.C4);
  const tb = new Buf(60, 8, 0x1000000); tiny(tb, 'COINWORLD', 0, 0, PAL.N3);
  for (let j = 0; j < 5; j++) for (let i = 0; i < 60; i++) if (tb.get(i, j) !== 0x1000000) put(x + 16 + i, y + 12 + j, PAL.N3);
  if (st.open) {
    // the lid off (propped against its side), the foam's top, the Orb in it
    box(x + 1, y, BOX.w - 3, 6, PAL.N2);
    for (let i = 2; i < BOX.w - 3; i++) put(x + i, y + 1 + ((i >> 2) % 2), PAL.G5);
    box(x + BOX.w + 1, y - 18, 4, 24, PAL.P1); box(x + BOX.w + 1, y - 18, 1, 24, PAL.W9);
  }
};
/** the label (18.02): the box's top, close, the label legible; his fingertips coming to the lid */
export const drawLabelECU = (b: Buf, f: number, st: {hand?: 0 | 1 | 2} = {}) => {
  // the box's white top filling the frame, the desk's dark edge and the rack's LEDs beyond, top
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 22 ? (bayer(x, y) < 0.3 ? PAL.N1 : PAL.N0) : y === 22 ? PAL.W9 : bayer(x, y) < 0.08 ? PAL.P1 : PAL.P2);
  for (const [x, y, c] of [[40, 8, PAL.C4], [52, 12, PAL.R3], [64, 8, PAL.L2]] as Array<[number, number, number]>) b.set(x, y, c);
  // the cyan circle mark and the maker's name, big, on the lid
  for (let j = -18; j <= 18; j++) for (let i = -18; i <= 18; i++) { const d = Math.hypot(i, j); if (d <= 18 && d >= 12) b.set(80 + i, 70 + j, d > 16 ? PAL.C3 : PAL.C5); }
  pt(b, 'COINWORLD', 58, 96, PAL.N3);
  // v3.1 (the sender context): the maker's line under its name, as the box prints it
  tiny(b, "PROOF YOU'RE HUMAN", 80 - (tinyWidth("PROOF YOU'RE HUMAN") >> 1), 108, PAL.G3);
  // the shipping label: a white sticker with its edge, two lines, a barcode
  const X = 150, Y = 44, W = 300, H = 104;
  rect(X + 3, Y + 3, W, H, b.ink(PAL.P0));
  rect(X, Y, W, H, b.ink(PAL.W9)); rect(X, Y + H - 1, W, 1, b.ink(PAL.P1));
  const l1 = "FROM: COINWORLD · PROOF YOU'RE HUMAN", l2 = 'SHIP TO: MAS MANALT, CO-FOUNDER';
  pt(b, l1, X + 12, Y + 12, PAL.N1);
  rect(X + 12, Y + 26, W - 24, 1, b.ink(PAL.G5));
  pt(b, l2, X + 12, Y + 34, PAL.N1);
  for (let i = 0; i < 180; i++) if (hash(i, 3, 41) < 0.55) rect(X + 12 + i, Y + 56, 1, 30, b.ink(PAL.N1));
  pt(b, '1Z 000 001', X + 12, Y + 89, PAL.G3);
  pt(b, 'FRAGILE · THIS SIDE UP', X + W - 12 - pw('FRAGILE · THIS SIDE UP'), Y + 89, PAL.R2);
  // his fingertips at the lid's edge (the monitor's cyan on them), in from the bottom left
  if (st.hand) fingertips(b, 18, st.hand === 2 ? 140 : 156, 4, 14, 2);
  void f;
};

// ------------------------------------------------------------------ EMIT's delivery (sc 32)
export const drawMagTray = (b: Buf, pos: 0 | 1 | 2 | 3 | 4) => {
  if (!pos) return;
  const travel = [0, 30, 70, 104, 124][pos];
  const x = DPLATE.slot.x - travel - 44, y = DPLATE.deskY + 8;
  const clip = (X: number) => X < DPLATE.slot.x;
  const put = (X: number, Y: number, c: number) => { if (clip(X)) b.set(X, Y, c); };
  for (let i = 0; i < 56; i++) { put(x - 4 + i, y + 12, PAL.N0); for (let j = 8; j < 12; j++) put(x - 4 + i, y + j, j === 8 ? PAL.C3 : PAL.G1); }
  // the magazine lying on the tray: the cover's teal border and gold masthead band on its top face, the pages' edge
  for (let j = 0; j < 7; j++) for (let i = 0; i < 44; i++) put(x + i + (6 - j), y + j, j === 0 ? PAL.C4 : i < 3 || i > 40 ? PAL.C2 : j < 3 ? PAL.W6 : PAL.N2);
  for (let i = 0; i < 44; i++) put(x + i, y + 7, PAL.P1);
};
export const drawSlotECU = (b: Buf, f: number, st: {out: 0 | 1 | 2 | 3}) => {
  // the rack's face close: black units, their vent slots, the LEDs, the drive slot's mouth; the tray and the magazine
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const unit = Math.floor(y / 44), inU = y % 44;
    b.set(x, y, inU < 2 ? PAL.G2 : inU === 43 ? PAL.N0 : x > 300 && (x + inU) % 5 === 0 && inU > 10 && inU < 34 ? PAL.N0 : PAL.N1);
    void unit;
  }
  for (let k = 0; k < 5; k++) { const on = (Math.floor(f / 8) + k) % 3 !== 0; rect(260 + (k % 2) * 18, 16 + k * 44, 4, 3, b.ink(on ? (k % 2 ? PAL.C5 : PAL.L3) : PAL.N2)); }
  // the slot near the top of frame (a dark mouth with a lit lip): the magazine slides DOWN out of it toward the desk in
  // held steps, its cover facing us, leading edge first (the cover at 1:1: its lower rows come out first, the
  // headline, then his face, then the masthead)
  const sy = 6;
  rect(150, sy, 180, 12, b.ink(PAL.N0)); rect(150, sy - 1, 180, 1, b.ink(PAL.C4)); rect(150, sy + 12, 180, 1, b.ink(PAL.G3));
  const out = [0, 64, 132, 185][st.out];
  if (out) {
    const cov = new Buf(150, 196, PAL.N0);
    drawEmitCover(cov, 0, 0, 'ecu');
    for (let j = 0; j < out; j++) for (let i = 0; i < 150; i++) b.set(165 + i, sy + 13 + j, cov.get(i, 196 - out + j));
    // its shadow on the rack's face
    for (let j = 0; j < out; j++) for (let i = 0; i < 4; i++) b.set(315 + i, sy + 15 + j, PAL.N0);
  }
};

// ------------------------------------------------------------------ the composed two-shot
export interface DarkA3State {
  plate?: DarkPlateOpts;
  mas?: Partial<MM.MasMediumState> | null;
  /** where the Orb is: its home on the wall (in the outline), at his shoulder (Act Four's spot), rising from the box
   *  (`rise` from the box state), or an explicit centre; null = not in the room yet */
  orb?: {at: 'home' | 'shoulder' | 'box' | [number, number]; look?: [number, number]; aperture?: number; scanning?: boolean} | null;
  /** the outline on the wall: true (empty) · 'filled' (the Orb sits in it) · false (not drawn) */
  outline?: boolean | 'filled';
  leds?: 'on' | 'off';
  box?: BoxTrayState | null;
  mag?: 0 | 1 | 2 | 3 | 4;
  /** the newspaper's thud onto the desk */
  paper?: {phase: 'fall' | 'down'; k?: number} | null;
  /** the cover in his hand (the two-shot's scale), held up beside him */
  cover?: boolean;
  /** the scan fan from the Orb's lens: dir / half in degrees */
  scan?: {dir: number; half: number} | null;
  toasts?: Array<{s: string; k: number; kind?: ToastKind; x: number; y: number; anchor?: 'left' | 'right'}>;
  /** v3.1 (mood §4 #4, opt-in): the face light, n ramp steps up on his face only (22.03: one step, keyed from the
   *  monitor's side); undefined = as before */
  faceLight?: number;
}
export const orbCentre = (at: NonNullable<DarkA3State['orb']>['at'], rise = 3): [number, number] => at === 'home' ? [ORB_HOME.x, ORB_HOME.y] : at === 'shoulder' ? DPLATE.orb : at === 'box' ? boxOrbAt(rise) : at;
export const drawDarkA3 = (b: Buf, f: number, st: DarkA3State = {}): Mask | null => {
  const o: DarkPlateOpts = {tally: 2, glass: true, ...st.plate};
  drawDarkPlate(b, f, o);
  if (st.outline !== false) drawOrbOutline(b, {filled: st.outline === 'filled'});
  if (st.leds === 'off') ledsOff(b);
  // the Orb (behind Mas's shoulder plane; when rising from the box it is clipped by the box's front until clear)
  let lens: [number, number] | null = null;
  if (st.orb) {
    const [ox, oy] = orbCentre(st.orb.at, st.box?.rise ?? 3);
    const still = o.still !== undefined && o.still !== null;
    const cy = oy + (st.orb.at === 'box' ? 0 : OM.orbBob(f, still));
    OM.drawOrb(b, ox, cy, OM.ORB_MR, {look: st.orb.look ?? DPLATE_LOOK.face, aperture: st.orb.aperture ?? 0.5, scanning: st.orb.scanning, monitor: -1});
    const lk = st.orb.look ?? DPLATE_LOOK.face;
    lens = [Math.round(ox + lk[0] * OM.ORB_MR * 0.7), Math.round(cy + lk[1] * OM.ORB_MR * 0.6)];
  }
  const desk = (bb: Buf) => {
    drawDarkPlateDesk(bb, f, o);
    if (st.box) drawBoxTray(bb, st.box);
    if (st.mag) drawMagTray(bb, st.mag);
    if (st.paper) drawPaperPlate(bb, 196, DPLATE.deskY + 22, st.paper);
  };
  if (st.mas !== null) {
    const [mx, my] = DPLATE.mas;
    MM.drawMasMedium(b, mx, my, {...MM.MAS_MEDIUM_DEFAULT, ...st.mas}, {desk});
    if (st.faceLight) { const F = FACE_AT_MEDIUM; faceKey(b, mx + F.x0, my + F.y0, mx + F.x1, my + F.y1, st.faceLight, -1); }
  } else desk(b);
  // the Orb rising out of the box is in front of the desk's far edge: redraw its part above the box's rim
  if (st.orb && st.orb.at === 'box' && st.box) {
    const [ox, oy] = boxOrbAt(st.box.rise ?? 0);
    const tmp = new Buf(480, 270, 0x1000000);
    OM.drawOrb(tmp, ox, oy, OM.ORB_MR, {look: st.orb.look ?? [0, 0], aperture: st.orb.aperture ?? 0.5, monitor: -1});
    const rim = DPLATE.deskY + 6;
    for (let y = 0; y < rim; y++) for (let x = ox - 14; x <= ox + 14; x++) { const c = tmp.get(x, y); if (c !== 0x1000000) b.set(x, y, c); }
  }
  if (st.cover) drawEmitCover(b, 150, 70, 'desk');
  drawDarkPlateFront(b, f, o);
  let m: Mask | null = null;
  if (st.scan && lens) m = drawScanFan(b, lens[0], lens[1], st.scan.dir, st.scan.half, {len: 360});
  for (const t of st.toasts ?? []) drawToast(b, t.x, t.y, t.s, t.k, {kind: t.kind, anchor: t.anchor, f});
  return m;
};

// ------------------------------------------------------------------ the scan, in close (18.04 / 18.05)
export interface ScanMCUState { mas?: Partial<MasPortraitState>; fan?: {dir: number; half: number} | null; toast?: {s: string; k: number} | null; /** v3.1 opt-in: the face light (18.05: one step, keyed from the Orb's side) */ faceLight?: number; }
export const drawScanMCU = (b: Buf, f: number, st: ScanMCUState = {}): Mask | null => {
  // the room soft behind him (the plate, three rungs down), his portrait left third, the fan from the right edge
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, f, {tally: 2}); drawDarkPlateDesk(bg, f, {tally: 2});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(bg.get(x, y), -3));
  vignette(b, 1, 0.6, 0.7, RH, RH);
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, ...st.mas});
  putBustCut(b, st.faceLight ? faceLightImg(im, st.faceLight, {key: [1, -0.2]}) : im, 100, 22, RH);
  let m: Mask | null = null;
  if (st.fan) m = drawScanFan(b, 478, 58, st.fan.dir, st.fan.half, {len: 520, strength: 2});
  if (st.toast) drawToast(b, 300, 40, st.toast.s, st.toast.k, {f});
  return m;
};

// ------------------------------------------------------------------ from behind the Orb (19.12)
export const drawOrbOTS = (b: Buf, f: number, st: {screen?: Painter; mas?: Partial<MasPortraitState>} = {}) => {
  // the room soft (the plate stepped down 2), his portrait watching the monitor at the frame's left edge
  const bg = new Buf(480, 270, PAL.N0);
  const plate: DarkPlateOpts = {tally: 2, screen: st.screen};
  drawDarkPlate(bg, f, plate); drawDarkPlateDesk(bg, f, plate);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, x < 72 ? bg.get(x, y) : stepColor(bg.get(x, y), -2));
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...st.mas}), 132, 30, RH);
  // the Orb in the foreground, frame right, its chrome back to us (the face turned to him, away from the lens)
  OM.drawOrb(b, 404, 116, 44, {look: [-0.92, 0.05], aperture: 0.5, monitor: -1});
};

// ------------------------------------------------------------------ the cover beside his face (32.03, 32.05)
export const drawCoverMCU = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>; sheen?: boolean} = {}) => {
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, f, {tally: 3}); drawDarkPlateDesk(bg, f, {tally: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(bg.get(x, y), -3));
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, head: 'front', look: 0, ...st.mas}), 110, 22, RH);
  // the cover held up at his cheek's level, frame right of his face: its face at his face's height
  drawEmitCover(b, 232, 22, 'mcu', {sheen: st.sheen});
  // his fingers at the cover's lower edge (the monitor's cyan on them)
  fingertips(b, 236, 146, 3, 10, 2, 164);
  for (let y = 164; y < RH; y++) for (let x = 232; x < 276; x++) b.set(x, y, x < 238 ? PAL.C3 : x > 270 ? PAL.N1 : PAL.G1); // his hoodie's cuff
};

// ------------------------------------------------------------------ the back wall (32.07)
export interface BackWallState { cover?: boolean; frame?: boolean; mas?: 'reach' | 'stand' | null; orb?: boolean; }
export const drawBackWall = (b: Buf, f: number, st: BackWallState = {}) => {
  drawDarkRoom(b, f, {tally: 3, lanyard: !st.frame, clock: '11:48'});
  // the wall between the rack and the window: the cover pinned (a pin's head), the small frame with the GUEST lanyard
  if (st.cover) { drawEmitCover(b, 112, 104, 'wall'); b.set(121, 103, PAL.R3); b.set(121, 104, PAL.W8); }
  if (st.frame) {
    const x = 140, y = 106;
    rect(x, y, 26, 22, b.ink(PAL.D3)); rect(x, y, 26, 1, b.ink(PAL.D4)); rect(x + 2, y + 2, 22, 18, b.ink(PAL.N2));
    for (let i = 4; i < 22; i++) b.set(x + i, y + 4, PAL.G3); // the strap, laid in a loop
    rect(x + 8, y + 8, 10, 8, b.ink(PAL.P1)); rect(x + 8, y + 8, 10, 2, b.ink(PAL.R2)); // the card, its red band
  }
  if (st.mas) drawMasStand(b, 132, DARKROOM.floorY, {...MAS_STAND_DEFAULT, arm: st.mas === 'reach' ? 'reach' : 'down', light: 'monitor'});
  if (st.orb) OM.drawOrb(b, DARKROOM.orb[0], DARKROOM.orb[1], DARKROOM.orbR, {look: [-0.8, 0.1], aperture: 0.5, monitor: -1});
  drawDarkRoomFront(b, f, {tally: 3, lanyard: !st.frame});
  void guestBadge;
};

// ------------------------------------------------------------------ his profile and his glass (33.04)
export const drawProfileGlass = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>; hop?: boolean} = {}) => {
  // the room fallen away (the plate four rungs down), his portrait right of centre facing the monitor (camera-left),
  // and at the frame's foot, left, his glass beside his hand: its water line one flat row
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, f, {tally: 3}); drawDarkPlateDesk(bg, f, {tally: 3});
  const dy = st.hop ? 2 : 0;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(bg.get(x, Math.min(202, y + dy)), -4));
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...st.mas}), 238, 20, RH);
  // the desk's near edge across the bottom, and the glass on it (a tumbler at this size, cyan-lit from the monitor)
  for (let y = 176; y < RH; y++) for (let x = 0; x < 238; x++) b.set(x, y, y === 176 ? PAL.C3 : y < 180 ? PAL.D2 : PAL.D1);
  const gx = 120, gy = 96, gw = 34, gh = 82;
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const X = gx + i, Y = gy + j, water = j > 20;
    let c = i < 2 ? PAL.C6 : i > gw - 3 ? PAL.C2 : i < 6 ? PAL.C4 : water ? (bayer(X, Y) < 0.5 ? PAL.C2 : PAL.C1) : -1;
    if (j > gh - 6) c = j === gh - 1 ? PAL.C2 : PAL.C3;
    if (c >= 0) b.set(X, Y, c);
  }
  rect(gx + 2, gy + 20, gw - 4, 1, b.ink(PAL.C8)); // the water line: one flat row
  rect(gx, gy, gw, 2, b.ink(PAL.C5));
  // his hand beside it, resting on the desk (the monitor's key on the knuckles)
  for (let y = 158; y < 178; y++) for (let x = 162; x < 214; x++) if (Math.hypot((x - 188) / 26, (y - 172) / 12) < 1) b.set(x, y, y < 166 ? PAL.K3 : PAL.K2);
  for (let y = 164; y < 178; y++) for (let x = 204; x < 238; x++) b.set(x, y, y < 168 ? PAL.C2 : PAL.G1);
  void line; void clamp; void blitImg; void tinyWidth; void hash; void pt; void pw;
};
