// MR. MAS — shared set: INT. NOPEAI LOBBY — DAY, the landlord's deal (Ep1 sc 9). New file (v3-art-a, 2026-09-27);
// rooms/lobby.ts (the lobby plate, Act Four's) is not edited: this dresses it and stages it.
// The script (draft 6: 9.01 folds the delivery and the check's insert into the wide, C6; the pen goes into the freeze):
//   the revolving door's glass carries NOPEAI · A NONPROFIT in small gold letters; a novelty check the width of a door
//   jams in it, wedged across the wings right under the gold letters, legible in the wide (kits/novelty-check.ts:
//   MACROSOFT · "multiyear, multibillion dollar" · $ MULTIBILLION); TASYA is already there, as if he'd been part of
//   the wall, his key ring at his belt (11 keys; weeks on, 12, the newest in NopeAI beige); the full freeze (his card,
//   the P2 pass's) prints the lobby navy and cream while Mas keeps moving and pockets the pen; the check slides under the
//   door and fits like a floor; Mas steps on it; a third collar pops; the terms; weeks on, the check is still on the
//   floor, scuffed grey with footprints, Gerg sits on its edge with his laptop; the TV high on the wall shows GNIB's
//   launch, then Elgoog's drab demo (kits/tv-news.ts); Gerg closes his laptop (the match cut into sc 11: LOBBY_LID).
// Entry points (each paints rows 0..202 of b):
//   drawDealWide(b, f, st)      [W] the lobby with the check, the cast at room scale, the TV (st.live: the freeze mask)
//   dealFreeze(b, live)         the full freeze (the engine's navy / cream, re-curved for a day room), Mas in colour
//   drawDeal2S(b, f, st)        [2S] medium: Mas (frame left) and Tasya (frame right), the jammed door behind and
//                               between them (the lobby soft behind); st.gerg: Gerg at the door behind, tugging
//   drawDealMcuMas(b, f, st)    [MCU] Mas, the lobby soft behind: the collar pop (st.collarPop: frames since)
//   drawDealGerg2S(b, f, st)    [2S] 9.13: Mas at the desk with his glass, Gerg on the check's edge with his laptop,
//                               the lid open → closing → shut (LOBBY_LID: where it is in frame; sc 11's demo stage opens
//                               a lid in the same place)
import {Buf, rect, line, bayer, hash, clamp} from '../px';
import {PAL, stepColor, lightness, familyOf} from '../palette';
import {applyPalette, PALETTES} from '../palettes';
import {Mask} from '../mask';
import {drawLobby, LOBBY} from './lobby';
import {tiny} from './kit-b';
import {drawCheck, drawCheckFloor, CHECK} from '../kits/novelty-check';
import {drawTvPicture, TvState} from '../kits/tv-news';
import {drawMasStand, MasStandPose, MAS_STAND_DEFAULT} from '../cast/mas-stand';
import {drawCollarsStand, drawCollarsPortrait, drawCollarsMedium} from '../cast/mas-collars';
import {drawTasyaRoom, TasyaRoomPose, TASYA_ROOM_DEFAULT} from '../cast/tasya-speak';
import {drawTasyaMedium, TasyaMediumState, drawKeyRing} from '../cast/tasya-medium';
import {drawGergPose, GergPoseState} from '../cast/gerg-poses';
import {drawGergStand, GERG_STAND_DEFAULT, gergWalkAt} from '../cast/gerg-stand';
import {gergMedium, GERG_MEDIUM_DEFAULT, GergMediumState} from '../cast/gerg-medium';
import {drawMasMedium, MAS_MEDIUM_DEFAULT, MasMediumState, MAS_M_DESK} from '../cast/mas-medium';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {putBust} from './bullpen-launch';

const RH = 203;
const TRANS = 0x1000000;
/** where the check jams (its top-left in the wide), the floor check's strip, the gold letters, the feet lines */
export const DEAL = {
  checkJam: [22, 100] as [number, number],
  /** the check's blank stub, caught in the wings */
  stub: 50,
  checkFloor: {x: 30, y: 176, w: 200},
  letters: [34, 86] as [number, number],
  masIn: [22, 190] as [number, number],
  masDesk: [150, 186] as [number, number],
  tasya: [388, 186] as [number, number],
  gergDoor: [70, 186] as [number, number],
};

// ------------------------------------------------------------------ the wide
export interface DealWideState {
  /** the check: jammed in the door · on the floor (a doormat) · scuffed (weeks on) · null (not yet) */
  check?: 'jammed' | 'floor' | 'scuffed' | null;
  /** the pen clipped to it (until he pockets it in the freeze) */
  pen?: boolean;
  mas?: (Partial<MasStandPose> & {at?: [number, number]; flip?: boolean; collars?: number; collarStyle?: 'v31'}) | null;
  tasya?: (Partial<TasyaRoomPose> & {at?: [number, number]; keys?: number; beige?: boolean; jangle?: 0 | 1}) | null;
  /** Gerg: at the door tugging the check's corner · walking · sitting on the check (open / shut) */
  gerg?: (Partial<GergPoseState> & {at?: [number, number]; walk?: boolean; flip?: boolean}) | null;
  tv?: TvState;
  /** the freeze: filled with what stays in colour (Mas) */
  live?: Mask;
  revolve?: number;
}
const goldLetters = (b: Buf) => {
  const [x, y] = DEAL.letters;
  tiny(b, 'NOPEAI', x + 9, y, PAL.W6); tiny(b, 'A NONPROFIT', x - 1, y + 7, PAL.W6);
  for (let i = -1; i < 46; i++) if (bayer(x + i, y - 2) < 0.5) b.set(x + i, y - 2, PAL.W4);
};
export const drawDealWide = (b: Buf, f: number, st: DealWideState = {}) => {
  const tvOn = !!st.tv && st.tv.show !== 'off';
  drawLobby(b, {f, time: 'day', sign: 0, tv: tvOn ? 'on' : 'off', revolve: st.revolve ?? (st.check === 'jammed' ? 1 : 0)}, {});
  goldLetters(b);
  if (tvOn) { const T = LOBBY.TV; drawTvPicture(b, T.x0 + 2, T.y0 + 2, T.x1 - T.x0 - 3, T.y1 - T.y0 - 3, {...st.tv!, f}); }
  // the check: jammed across the door's wings (upright, the wings' frames crossing it: it won't fit), or on the floor
  if (st.check === 'jammed') {
    const [cx, cy] = DEAL.checkJam;
    drawCheck(b, cx, cy, {pen: st.pen, stub: DEAL.stub});
    // the drum's front wing and its steel edge in front of the check, and the canopy's shadow on its top
    const R = LOBBY.REVOLVE;
    for (const wx of [R.cx - 9, R.cx + 14]) { rect(wx, R.top, 2, R.floor - R.top, b.ink(PAL.G2)); rect(wx, R.top, 1, R.floor - R.top, b.ink(PAL.G4)); }
    for (let x = cx; x < R.cx + R.r + 2; x++) if (bayer(x, cy) < 0.5) b.set(x, cy, PAL.N2);
  } else if (st.check === 'floor' || st.check === 'scuffed') drawCheckFloor(b, DEAL.checkFloor.x, DEAL.checkFloor.y, DEAL.checkFloor.w, {scuffed: st.check === 'scuffed'});
  // the cast, back to front by their feet
  const liveA = st.live?.a;
  const cast: Array<[number, () => void]> = [];
  if (st.tasya) {
    const t = st.tasya; const [tx, ty] = t.at ?? DEAL.tasya;
    cast.push([ty, () => {
      drawTasyaRoom(b, tx, ty, {...TASYA_ROOM_DEFAULT, ...t}, {flip: true});
      // the giant ring at his belt: one key per tenant (room scale)
      drawKeyRing(b, tx - 8, ty - 36, t.keys ?? 11, {beige: t.beige, jangle: t.jangle, scale: 'room'});
    }]);
  }
  if (st.gerg) {
    const g = st.gerg; const [gx, gy] = g.at ?? DEAL.gergDoor;
    cast.push([gy, () => { if (g.walk) drawGergStand(b, gx, gy, {...GERG_STAND_DEFAULT, legs: gergWalkAt(f)}, {flip: g.flip}); else drawGergPose(b, gx, gy, g, {flip: g.flip}); }]);
  }
  if (st.mas) {
    const m = st.mas; const [mx, my] = m.at ?? DEAL.masIn;
    cast.push([my, () => {
      const tmp = new Buf(480, RH, TRANS);
      drawMasStand(tmp, mx, my, {...MAS_STAND_DEFAULT, ...m}, {flip: m.flip});
      drawCollarsStand(tmp, mx, my, m.collars ?? 2, {flip: m.flip, style: m.collarStyle});
      for (let i = 0; i < 480 * RH; i++) { const v = tmp.c[i]; if (v === TRANS) continue; b.c[i] = v; if (liveA) liveA[i] = 255; }
    }]);
  }
  cast.sort((a, c) => a[0] - c[0]).forEach(([, fn]) => fn());
};
/** the full freeze: the engine's navy / cream, re-curved for a day lobby (the stock curve is tuned on night rooms) */
export const DEAL_FREEZE = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.26, hi: 0.6, gamma: 1}});
export const dealFreeze = (b: Buf, live: Mask) => applyPalette(b, DEAL_FREEZE, {mask: live, invert: true, rect: [0, 0, 480, RH]});

// ------------------------------------------------------------------ the medium setups
/** the lobby behind a medium setup: the wide (with the check) stepped soft and a rung darker, so the figures sit in
 *  front of it (the Act Four MCU grammar: a medium figure over the room plate reads as nearer the lens) */
export const softLobby = (b: Buf, f: number, st: DealWideState, pan = 0) => {
  const W = new Buf(480, 270, PAL.N0);
  drawDealWide(W, f, {...st, mas: null, tasya: null, gerg: st.gerg ?? null});
  // the pan (the camera turned toward the door, so it lands between the two of them): the plate shifts right by
  // `pan` px and the entrance's glass wall continues into the gap (its columns repeat: the street beyond the glass)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const sx = x - pan;
    b.c[y * b.w + x] = sx >= 0 ? W.c[y * 480 + sx] : W.c[y * 480 + (((sx % 20) + 20) % 20)];
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const c = b.get(x, y); if (bayer(x, y) < 0.5) b.set(x, y, stepColor(c, lightness(c) > 0.4 ? -1 : 0)); }
};
export interface Deal2SState {
  check?: DealWideState['check'];
  pen?: boolean;
  mas?: Partial<MasMediumState>;
  tasya?: Partial<TasyaMediumState>;
  collars?: number;
  /** v3.1: the collars' drawing (mas-collars.ts 'v31') */
  collarStyle?: 'v31';
  /** Gerg behind them at the door, tugging the check's corner (room scale: he's further back) */
  gerg?: boolean;
  tv?: TvState;
}
export const drawDeal2S = (b: Buf, f: number, st: Deal2SState = {}) => {
  softLobby(b, f, {check: st.check ?? 'jammed', pen: st.pen, tv: st.tv, gerg: st.gerg ? {body: 'tug', at: [238, 172], flip: true} : null}, 110);
  // Mas at frame left, turned to Tasya (flipped), chest-up (the frame's bottom cuts his waist)
  const mx = 6, my = 96;
  drawMasMedium(b, mx, my, {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'down', ...st.mas}, {flip: true});
  drawCollarsMedium(b, mx, my, st.collars ?? 2, {flip: true, style: st.collarStyle});
  // Tasya at frame right, turned to Mas (he's authored facing left), his ring at his belt
  drawTasyaMedium(b, 380, 96, {arm: 'clasp', ...st.tasya});
};

export interface DealMcuState { mas?: Partial<MasPortraitState>; collars?: number; collarPop?: number; check?: DealWideState['check']; /** v3.1: 'v31' collars (the pop reads as a new collar: taller, gold) */ collarStyle?: 'v31' }
/** [MCU] Mas in the lobby: the pop (SFX), a third collar surfaces, one drawing, a 1 px hop (collarPop 0-1) */
export const drawDealMcuMas = (b: Buf, f: number, st: DealMcuState = {}) => {
  softLobby(b, f, {check: st.check ?? 'floor'});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.5) b.set(x, y, stepColor(b.get(x, y), -1));
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 1, ...st.mas};
  const x = 100, y = 34;
  putBust(b, masPortrait(s), x, y);
  drawCollarsPortrait(b, x, y, st.collars ?? 3, {head: s.head ?? '34', light: 'warm', pop: st.collarPop, style: st.collarStyle});
};

// ------------------------------------------------------------------ 9.13: Gerg closes his laptop (the match cut's first half)
/** where the laptop's lid is in frame in 9.13 (open: its top edge's span and height; shut: the slab) — sc 11's demo
 *  stage (rooms/duel.ts drawDemoArrival) opens a lid in exactly this place */
export const LOBBY_LID = {x0: 318, x1: 366, openTop: 128, base: 176};
export interface DealGerg2SState {
  /** the lid: 0 open · 1 half down · 2 shut */
  lid?: 0 | 1 | 2;
  gerg?: Partial<GergMediumState>;
  mas?: Partial<MasMediumState>;
  tv?: TvState;
  collars?: number;
  collarStyle?: 'v31';
}
/** draw his laptop's lid (its back toward us, the screen's green on its edge while it's open) at the match position */
export const drawMatchLid = (b: Buf, lid: 0 | 1 | 2) => {
  const {x0, x1, openTop, base} = LOBBY_LID;
  // the base on his knees
  rect(x0 - 4, base, x1 - x0 + 8, 4, b.ink(PAL.G2)); rect(x0 - 4, base, x1 - x0 + 8, 1, b.ink(PAL.G4));
  if (lid === 2) { rect(x0 - 4, base - 3, x1 - x0 + 8, 3, b.ink(PAL.G1)); rect(x0 - 4, base - 3, x1 - x0 + 8, 1, b.ink(PAL.G3)); return; }
  const top = lid === 0 ? openTop : Math.round((openTop + base) / 2) + 6;
  for (let y = top; y < base; y++) { const t = (y - top) / (base - top); const inset = Math.round((1 - t) * (lid === 0 ? 4 : 10)); for (let x = x0 + inset; x < x1 - inset; x++) b.set(x, y, x === x0 + inset ? PAL.G3 : y === top ? PAL.G4 : PAL.G1); b.set(x1 - inset - 1, y, PAL.L2); }
  if (lid === 0) for (let x = x0 + 18; x < x0 + 30; x++) b.set(x, openTop + 20, PAL.G3); // a sticker-less lid, one seam
};
export const drawDealGerg2S = (b: Buf, f: number, st: DealGerg2SState = {}) => {
  softLobby(b, f, {check: 'scuffed', tv: st.tv ?? {show: 'telescope', k: 2, figure: true}});
  // Mas at frame left at the reception desk with his glass (medium, flipped to face right)
  const mx = 30, my = 92;
  drawMasMedium(b, mx, my, {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'rest', ...st.mas}, {flip: true, desk: (bb) => {
    for (let y = my + MAS_M_DESK; y < RH; y++) for (let x = 0; x < 190; x++) bb.set(x, y, y === my + MAS_M_DESK ? PAL.G5 : y < my + MAS_M_DESK + 3 ? PAL.G4 : bayer(x, y) < 0.3 ? PAL.N3 : PAL.N2);
  }});
  drawCollarsMedium(b, mx, my, st.collars ?? 3, {flip: true, style: st.collarStyle});
  // his glass on the desk by his hand: the one flat water line
  const gx = 138, gy = my + MAS_M_DESK - 14;
  for (let j = 0; j < 14; j++) { b.set(gx, gy + j, PAL.G6); b.set(gx + 6, gy + j, PAL.G4); for (let i = 1; i < 6; i++) b.set(gx + i, gy + j, j > 4 ? (i === 1 ? PAL.C7 : PAL.C6) : PAL.G5); }
  for (let i = 1; i < 6; i++) b.set(gx + i, gy + 5, PAL.C8);
  // Gerg on the check's edge at frame right, chest-up, his laptop on his knees in front of him
  const g = gergMedium({...GERG_MEDIUM_DEFAULT, ...st.gerg});
  const gx0 = 300, gy0 = 96;
  const green = (st.lid ?? 0) < 2;
  for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) { const c = g.c[j * g.w + i]; if (c >= 0) b.set(gx0 + i, gy0 + j, green ? c : stepColor(c, familyOf(c)?.[0] === 'L' ? -3 : 0)); }
  drawMatchLid(b, st.lid ?? 0);
  void hash; void clamp; void line; void CHECK;
};
