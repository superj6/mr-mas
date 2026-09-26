// MR. MAS — shared layouts: the MEDIUM / TWO-SHOT tier's shots, composed (Ep1 act 4 draft 3.1; new file, owned by the
// act-4 medium-tier artist). Every function paints one board shot into the 480x203 room area of a native frame (rows
// 203..269 belong to the rail builder). Pure pixel code; deterministic on (frame, state).
//
//   drawDark2S      [2S] MAS + THE ORB at the dark-room desk (26A.02, 29.01, 29.04, 29.10a, 29.08, 29.12)
//                   orbTally(f, t0)   26A.02: the iris steps mark 1 -> 2 -> 3 (his thumb), one per beat, and holds
//                   orbToLanyard(f, t0)  29.04: on the phone (the taps) for 2 beats, onto the GUEST lanyard on beat 3
//   drawBoard2S     [2S] NELEH (standing, marker) + MADA (seated, spinner) at the boardroom table (27.11 .. 27.36),
//                   ALYI a reflection in the window behind them, THE QUIET VOTE's laptop on its chair
//   drawMadaM       [M]  MADA alone among the fires (30.09): "in the only chair that isn't burning"
//   drawCalmOff2S   [2S] THE CALM-OFF (30.14, 30.17): MAS left, MADA right, across the table; the chaos behind them
//                   (TERB spraying the chair fire, keycaps), the spinner stops, the nod, TERB's hand + the term sheet
//   drawDoorwayP2   [P2] MAS left at his end desk; ALYI right in the gap of the conference-room door, the frame cutting
//                   his window (30.01): the three hearts rising out of Mas's window off the grid, crossing the gap and
//                   hanging at the edge of Alyi's window; Alyi looks up at them (the expression swap); the IOU flutters
//   drawVaultP2     [P2] MAS left (not looking), GERG right, laptop open (31.03): Gerg looks over at the note, nods,
//                   and his window closes in 3 held steps as he walks on
//
// Screen direction (pov-and-framing §4.3 rule 8): Mas is always the LEFT slot, in three-quarter; the other person the
// right. Portrait windows sit at the animatic's WL (12, 24) / WR (356, 24), 112 x 136.
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {Img} from '../figure';
import {portraitWindow} from '../ui';
import {tiny} from './kit-b';
import * as MM from '../cast/mas-medium';
import * as OM from '../cast/orb-medium';
import * as MD from '../cast/mada-medium';
import * as NM from '../cast/neleh-medium';
import {DPLATE, DPLATE_LOOK, DarkPlateOpts, drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront} from './darkroom-plate';
import {BPLATE, BoardPlateOpts, drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront} from './boardroom-plate';
import {drawBullpen} from './bullpen';
import {drawMasPortrait, MasPortraitState, MAS_PORTRAIT_DEFAULT} from '../cast/mas';
import {alyiSpeakPortrait, alyiReflection, AlyiSpeakState} from '../cast/alyi-speak';
import {gergGlow, GergSpeakState} from '../cast/gerg-speak';
import {drawTerbRoom, drawSpray, TerbRoomPose, TERB_ROOM_DEFAULT, TERB_HORN, TERB_FOOT} from '../cast/terb';
import {Viseme} from '../cast/talk';

export const WL: [number, number] = [12, 24];
export const WR: [number, number] = [356, 24];
export const PW = 112, PH = 136;
const RH = 203;

// ================================================================== the dark room: MAS + THE ORB
export interface OrbPose { look?: [number, number]; aperture?: number; scanning?: boolean }
export interface Dark2SState {
  mas?: Partial<MM.MasMediumState>;
  orb?: OrbPose | null;
  plate?: DarkPlateOpts;
}
/** 26A.02: mark 1, mark 2, then mark 3 = his thumb, one per beat from t0; it holds on the thumb */
export const orbTally = (f: number, t0: number, beat = 15): [number, number] => OM.orbStep(f, t0, [DPLATE_LOOK.mark1, DPLATE_LOOK.mark2, DPLATE_LOOK.thumb], beat);
/** 29.04: the iris on the phone for two beats (the taps), then one step onto the GUEST lanyard, held */
export const orbToLanyard = (f: number, t0: number, beat = 15): [number, number] => OM.orbStep(f, t0, [DPLATE_LOOK.phone, DPLATE_LOOK.phone, DPLATE_LOOK.lanyard], beat);
export const drawDark2S = (b: Buf, f: number, s: Dark2SState = {}) => {
  const o: DarkPlateOpts = {tally: 3, glass: true, ...s.plate};
  const still = o.still !== undefined && o.still !== null;
  drawDarkPlate(b, f, o);
  if (s.orb !== null) {
    const [ox, oy] = DPLATE.orb;
    const ob = s.orb ?? {};
    OM.drawOrb(b, ox, oy + OM.orbBob(f, still), OM.ORB_MR, {look: ob.look ?? DPLATE_LOOK.face, aperture: ob.aperture ?? 0.5, scanning: ob.scanning, monitor: -1});
  }
  const [mx, my] = DPLATE.mas;
  MM.drawMasMedium(b, mx, my, {...MM.MAS_MEDIUM_DEFAULT, ...s.mas}, {desk: (bb) => drawDarkPlateDesk(bb, f, o)});
  drawDarkPlateFront(b, f, o);
};

// ================================================================== the boardroom: NELEH + MADA
export interface Board2SState {
  neleh?: Partial<NM.NelehMediumState> | null;
  mada?: Partial<MD.MadaMediumState> | null;
  /** the footnote orbit phase (frames); null = off */
  orbit?: number | null;
  scatter?: number;
  /** the spinner frame; null = no spinner (nobody has asked him anything) */
  spin?: number | null;
  stopped?: boolean;
  spinCol?: 'grey' | 'blue';
  /** ALYI, a reflection in the window behind them: 'there' | 'gone' (his two-frame flicker) | null */
  alyi?: {mouth?: Viseme; flicker?: 'there' | 'gone'} | null;
  plate?: BoardPlateOpts;
}
const alyiInGlass = (a: Board2SState['alyi'], f: number): BoardPlateOpts['reflection'] => {
  if (!a || a.flicker === 'gone') return null;
  // the portrait-size reflection in the glass between them, stepped down (the city's lights shine through him)
  const img = alyiReflection({mouth: a.mouth ?? 'rest', eyes: 'open', t: f, mirror: true});
  return {img, x: 118, y: 6, k: 1};
};
const BOARD_DEFAULT: BoardPlateOpts = {laptop: true, blueprint: 0, rolodex: true, plates: [{name: 'NELEH', x: 86}, {name: 'ALYI', x: 280}]};
export const drawBoard2S = (b: Buf, f: number, s: Board2SState = {}) => {
  const o: BoardPlateOpts = {...BOARD_DEFAULT, reflection: alyiInGlass(s.alyi === undefined ? {} : s.alyi, f), ...s.plate};
  drawBoardPlate(b, f, o);
  const [nx, ny] = BPLATE.left.neleh, [dx, dy] = BPLATE.right.mada;
  const table = (bb: Buf) => drawBoardPlateTable(bb, f, o);
  const mada = (bb: Buf, then: (b: Buf) => void) => s.mada === null ? then(bb)
    : MD.drawMadaMedium(bb, dx, dy, {...MD.MADA_MEDIUM_DEFAULT, head: '34', look: -1, ...s.mada}, {table: then, spin: s.spin === undefined ? f : s.spin, stopped: s.stopped, spinCol: s.spinCol});
  if (s.neleh === null) mada(b, table);
  else NM.drawNelehMedium(b, nx, ny, {...NM.NELEH_MEDIUM_DEFAULT, ...s.neleh}, {flip: true, orbit: s.orbit === undefined ? f : s.orbit, scatter: s.scatter, table: (bb) => mada(bb, table)});
  drawBoardPlateFront(b, f, o);
};

// ================================================================== sc 30: MADA's [M] among the fires
export const FIRES_M: BoardPlateOpts['fires'] = [
  {at: 'chair', x: 238, phase: 0}, {at: 'table', x: 170, phase: 1}, {at: 'plate', x: 104, phase: 2},
];
export interface MadaMState { mada?: Partial<MD.MadaMediumState>; spin?: number | null; stopped?: boolean; plate?: BoardPlateOpts }
export const drawMadaM = (b: Buf, f: number, s: MadaMState = {}) => {
  const o: BoardPlateOpts = {laptop: false, rolodex: 'still', plates: [{name: 'ALYI', x: 104, fire: true}], fires: FIRES_M, ...s.plate};
  drawBoardPlate(b, f, o);
  const [dx, dy] = BPLATE.right.mada;
  MD.drawMadaMedium(b, dx, dy, {...MD.MADA_MEDIUM_DEFAULT, light: 'fire', ...s.mada}, {table: (bb) => drawBoardPlateTable(bb, f, o), spin: s.spin === undefined ? f : s.spin, stopped: s.stopped});
  drawBoardPlateFront(b, f, o);
};

// ================================================================== sc 30: THE CALM-OFF
export interface CalmOffState {
  mas?: Partial<MM.MasMediumState>;
  mada?: Partial<MD.MadaMediumState>;
  spin?: number | null;
  stopped?: boolean;
  /** TERB behind them at room scale (he is back by the wall): his pose, and the spray's frame count (null = none) */
  terb?: {x?: number; pose?: Partial<TerbRoomPose>; spray?: number | null} | null;
  plate?: BoardPlateOpts;
}
/** the calm-off's fires: the chair behind them (Terb sprays it; it goes out because the pin is out) */
export const FIRES_CALMOFF = (outAt?: number): NonNullable<BoardPlateOpts['fires']> => [
  {at: 'chair', x: 262, phase: 0, state: outAt === undefined ? 'burn' : 'out', outAt},
];
export const drawCalmOff2S = (b: Buf, f: number, s: CalmOffState = {}) => {
  const o: BoardPlateOpts = {laptop: false, rolodex: 'still', fires: FIRES_CALMOFF(), ...s.plate};
  drawBoardPlate(b, f, o);
  // TERB at room scale by the back wall, facing the chair fire (screen-right), spraying: his feet are behind the
  // table (the table top paints over them)
  if (s.terb !== null) {
    const t = s.terb ?? {};
    const pose: TerbRoomPose = {...TERB_ROOM_DEFAULT, arm: t.spray !== null && t.spray !== undefined ? 'spray' : 'carry', pin: false, ...t.pose};
    const fx = t.x ?? 206, fy = BPLATE.tableY + 22;
    drawTerbRoom(b, fx, fy, pose);
    if (t.spray !== null && t.spray !== undefined && pose.arm === 'spray') {
      const hx = fx - TERB_FOOT[0] + TERB_HORN[0], hy = fy - TERB_FOOT[1] + TERB_HORN[1];
      drawSpray(b, hx, hy, 1, t.spray, {len: 34, drop: -0.7});
    }
  }
  const [mx, my] = BPLATE.left.mas, [dx, dy] = BPLATE.right.mada;
  const table = (bb: Buf) => drawBoardPlateTable(bb, f, o);
  MM.drawMasMedium(b, mx, my, {...MM.MAS_MEDIUM_DEFAULT, arm: 'clasp', light: 'board', look: 0, ...s.mas}, {flip: true,
    desk: (bb) => MD.drawMadaMedium(bb, dx, dy, {...MD.MADA_MEDIUM_DEFAULT, head: '34', look: -1, light: 'fire', ...s.mada}, {table, spin: s.spin === undefined ? f : s.spin, stopped: s.stopped})});
  drawBoardPlateFront(b, f, o);
};

// ================================================================== sc 30: THE DOORWAY [P2]
/** a heart at medium size (the hearts that rise out of his window), with a 1 px dark keyline so it reads on anything */
const HEART = ['.kk.kk.', 'kRRkRRk', 'kRWRRRk', 'kRRRRRk', '.kRRRk.', '..kRk..', '...k...'];
export const drawHeartM = (b: Buf, x: number, y: number) => HEART.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = ({k: PAL.N0, R: PAL.R2, W: PAL.P2} as Record<string, number>)[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
/**
 * Heart k's position `t` frames after it left his window: it rises out of the top edge of Mas's window, drifts
 * across the gap in held 2-frame steps (whole pixels), and hangs at the edge of Alyi's window. Null before it starts.
 */
export const doorwayHeart = (k: number, t: number): [number, number] | null => {
  if (t < 0) return null;
  const x0 = WL[0] + 84 + k * 8, y0 = WL[1] + 8;
  const hx = WR[0] - 12 - (k % 2) * 3, hy = WR[1] + 18 + k * 13;
  const T = Math.floor(t / 2) * 2; // held on 2s
  const rise = Math.min(1, T / 10), go = Math.max(0, Math.min(1, (T - 10) / 34));
  const e = go < 0.5 ? 2 * go * go : 1 - Math.pow(-2 * go + 2, 2) / 2;
  const x = Math.round(x0 + (hx - x0) * e), y = Math.round(y0 - 10 * rise + (hy - (y0 - 10)) * e);
  return [x, y];
};
export interface DoorwayP2State {
  mas?: Partial<MasPortraitState>;
  alyi?: {mouth?: Viseme; up?: boolean};
  /** the frame each heart leaves his window (off the grid: at the post's own pace); [] = none yet */
  hearts?: number[];
  /** the IOU note taped to the frame at his shoulder: 0 flat, 1 lifting, 2 lifted (its flutter, held drawings) */
  iou?: 0 | 1 | 2;
  /** each window's open state 0..1 (3 held steps) */
  openL?: number;
  openR?: number;
}
/** Alyi looking UP at the hearts (the expression swap): his eyes move up one row inside the dark sockets */
const alyiUp = (src: Img): Img => {
  const out: Img = {w: src.w, h: src.h, c: new Int32Array(src.c)};
  const lift = (x0: number, x1: number, y0: number) => {
    for (let x = x0; x <= x1; x++) {
      const a = src.c[y0 * src.w + x], m = src.c[(y0 + 1) * src.w + x], l = src.c[(y0 + 2) * src.w + x];
      out.c[y0 * src.w + x] = m; out.c[(y0 + 1) * src.w + x] = l; out.c[(y0 + 2) * src.w + x] = a;
    }
  };
  lift(49, 60, 47); lift(38, 43, 47);
  return out;
};
const IOU = [
  ['yyyyyyyyyyyyyyyyyy', 'yYYYYYYYYYYYYYYYYy', 'yY..............Yy', 'yYYYYYYYYYYYYYYYYy', 'yY..............Yy', 'yYYYYYYYYYYYYYYYYy', 'yyyyyyyyyyyyyyyyyy'],
];
const drawIOU = (b: Buf, x: number, y: number, k: 0 | 1 | 2) => {
  // a yellowed sticky note, tape along its top; the free bottom corner lifts in the draught nobody else feels
  const w = 34, h = 15;
  rect(x + 8, y - 1, 12, 2, b.ink(PAL.G5));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const lifted = k && i > w - 7 && j > h - 1 - (k === 1 ? 3 : 6) + (w - 1 - i) * 0.5;
    if (lifted) continue;
    b.set(x + i, y + j, j === 0 ? PAL.W7 : i === w - 1 || j === h - 1 ? PAL.W4 : PAL.W6);
  }
  if (k) for (let i = 0; i < (k === 1 ? 3 : 6); i++) b.set(x + w - 1 - i, y + h - 1 - (k === 1 ? 3 : 6) + i, PAL.W8);
  tiny(b, 'IOU: 20%', x + 2, y + 3, PAL.D1);
  tiny(b, 'COMPUTE', x + 2, y + 9, PAL.D1);
  void IOU;
};
/** Alyi's door-cut window content: the dark conference room behind him, Alyi, the door leaf, the frame, the note */
const alyiDoorWindow = (b: Buf, x: number, y: number, s: NonNullable<DoorwayP2State['alyi']>, iou: 0 | 1 | 2, f: number) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + PW && py < y + PH;
  for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) b.set(x + i, y + j, j > 100 && ((i + j) & 1) ? PAL.N1 : PAL.N0);
  const st: AlyiSpeakState = {mouth: s.mouth ?? 'rest', eyes: 'open', t: f};
  const img = s.up ? alyiUp(alyiSpeakPortrait(st)) : alyiSpeakPortrait(st);
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) { const v = img.c[j * img.w + i]; if (v >= 0 && clip(x + i + 4, y + j)) b.set(x + i + 4, y + j, v); }
  // the door leaf (open a crack) cuts in from the left: warm wood, its edge lit by the bullpen's day, the latch
  rect(x, y, 30, PH, b.ink(PAL.D2)); rect(x + 26, y, 3, PH, b.ink(PAL.D3)); rect(x + 29, y, 1, PH, b.ink(PAL.D4));
  rect(x + 2, y, 1, PH, b.ink(PAL.D1));
  rect(x + 20, y + 74, 5, 12, b.ink(PAL.G4)); rect(x + 20, y + 74, 5, 1, b.ink(PAL.G6)); rect(x + 21, y + 79, 3, 2, b.ink(PAL.G2));
  // the frame on the right: the jamb, its stop, and the note taped at his shoulder
  rect(x + PW - 10, y, 10, PH, b.ink(PAL.D3)); rect(x + PW - 10, y, 2, PH, b.ink(PAL.D4)); rect(x + PW - 2, y, 2, PH, b.ink(PAL.D1));
  drawIOU(b, x + PW - 42, y + 92, iou);
};
export const drawDoorwayP2 = (b: Buf, f: number, s: DoorwayP2State = {}) => {
  drawBullpen(b, f, {door: 'crack', iou: true});
  rect(0, RH, 480, 1, b.ink(PAL.N0));
  portraitWindow(b, WL[0], WL[1], PW, PH, {open: s.openL ?? 1, name: 'MAS MANALT', accent: PAL.C7,
    content: (bb, xx, yy) => drawMasPortrait(bb, xx, yy, {...MAS_PORTRAIT_DEFAULT, ...s.mas})});
  portraitWindow(b, WR[0], WR[1], PW, PH, {open: s.openR ?? 1, name: 'ALYI', accent: PAL.W5,
    content: (bb, xx, yy) => alyiDoorWindow(bb, xx, yy, s.alyi ?? {}, s.iou ?? 0, f)});
  (s.hearts ?? []).forEach((t0, k) => { const p = doorwayHeart(k, f - t0); if (p) drawHeartM(b, p[0], p[1]); });
};

// ================================================================== sc 31: THE VAULT [P2]
export interface VaultP2State {
  mas?: Partial<MasPortraitState>;
  gerg?: {mouth?: Viseme; look?: -1 | 0 | 1; lid?: 0 | 1 | 2; nod?: 0 | 1};
  /** the frame his window starts to close (3 held steps, 2 frames each); undefined = open */
  closeAt?: number;
}
/** Gerg's window content: the bullpen by day behind him (soft), GERG under his open laptop's green glow, its lid */
const gergLaptopWindow = (b: Buf, x: number, y: number, g: NonNullable<VaultP2State['gerg']>) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + PW && py < y + PH;
  for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) {
    const d = Math.hypot((i - PW * 0.8) / (PW * 0.9), (j - PH * 0.2) / (PH * 0.9));
    b.set(x + i, y + j, d < 0.55 ? PAL.G2 : d < 0.8 ? (((i + j) & 1) ? PAL.G2 : PAL.G1) : PAL.G1);
  }
  const st: GergSpeakState = {mouth: g.mouth ?? 'rest', lid: g.lid ?? 1, look: g.look ?? 0};
  const img = gergGlow(st);
  const ny = g.nod ? 1 : 0;
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) { const v = img.c[j * img.w + i]; if (v >= 0 && clip(x + i, y + j + ny)) b.set(x + i, y + j + ny, v); }
  // the laptop he carries open, walking and typing: its lid's back across the window's bottom, the green on him
  rect(x + 18, y + PH - 16, 70, 16, b.ink(PAL.G3)); rect(x + 18, y + PH - 16, 70, 1, b.ink(PAL.G5)); rect(x + 87, y + PH - 16, 1, 16, b.ink(PAL.G1));
  rect(x + 50, y + PH - 10, 6, 5, b.ink(PAL.G4));
};
export const drawVaultP2 = (b: Buf, f: number, s: VaultP2State = {}) => {
  drawBullpen(b, f, {door: 'shut'});
  portraitWindow(b, WL[0], WL[1], PW, PH, {open: 1, name: 'MAS MANALT', accent: PAL.C7,
    content: (bb, xx, yy) => drawMasPortrait(bb, xx, yy, {...MAS_PORTRAIT_DEFAULT, look: 0, ...s.mas})});
  const k = s.closeAt === undefined ? -1 : f - s.closeAt;
  const open = k < 0 ? 1 : k < 2 ? 0.66 : k < 4 ? 0.33 : k < 6 ? 0.1 : 0;
  portraitWindow(b, WR[0], WR[1], PW, PH, {open, name: 'GERG', accent: PAL.L3, content: (bb, xx, yy) => gergLaptopWindow(bb, xx, yy, s.gerg ?? {})});
};
