// MR. MAS — shared room: INT. SENATE HEARING ROOM — DAY (Ep1 sc 15; new file, owned by the `v3-art-b` pass). A 480 x 203
// room plate and its setups. The script's PLAN, kept: the witness table at frame left, facing right (MAS on the camera
// side, SUCRAM beside him, one glass of water); the raised dais at frame right, facing left (the chairman LAHTNEMULB at
// its centre, THE CLONE always at his hand toward the witnesses, in the better chair, the other senators along it, each
// with a microphone that has a small red light); the gallery of tiled spectators behind the witness table. The camera
// stays on the gallery side, so the witnesses always look right and the dais always looks left. A formal room: pale
// stone above a walnut wainscot, navy drapes behind the dais, a navy carpet; no seal and no flag (guardrails).
//
// Entry points (each paints rows 0..202 of `b`; deterministic on its state):
//   drawSenateWide(b, f, st)      [W] (15.02, 15.10, 15.13) the room: `lit` which microphone's light is on, `lean` the
//                                 dais leans in, `gasp` the gallery's one held drawing, the witnesses' poses (Mas's
//                                 wallet held up to the dais), the chairman's card, the clone's pose
//   drawSenateDais(b, f, st)      [W] (15.16) the dais alone, closer: the sheet arriving from frame left into the clone's
//                                 hand (`sheet` 0 none · 1 arriving · 2 in his hand · 3 held up, turned over)
//   drawWitness2S(b, f, st)       [2S] (15.04, 15.05, 15.11, 15.14) MAS + SUCRAM at the witness table, both facing right
//                                 (the busts flipped: no lettering on them); the mics, the glass, the stamp pad, the moth
//   drawDais2S(b, f, st)          [2S] (15.03) the chairman and THE CLONE behind the bench, the better chair
//   drawSenateOTS(b, f, st)       [OTS] (15.07) from behind Mas onto the dais: the chairman with his cards, the clone at
//                                 his hand; `take` the clone takes the next card out of his hand (3 held steps)
//   drawSenateMCU(b, f, st)       [MCU] (15.01, 15.06, 15.18) a bust in a third over the dais' drapes or the gallery
//   v3.5 (script draft 8.4: the clone is cut; the `v3-shots-act2-act3` pass; opt-in `noClone`, nothing changes when it is
//                                off): the dais without THE CLONE, his seat a plain senator's (`drawSenateWide`,
//                                `drawSenateDais`: the sheet then arrives in the CHAIRMAN's hand); `drawSenateOTS` the
//                                chairman alone behind the bench, a step nearer the frame's centre
// Cast used: LAHTNEMULB + THE CLONE (cast/lahtnemulb.ts), SUCRAM (cast/sucram.ts), the senators and the gallery
// (cast/civic-extras.ts), MAS (cast/mas-stand.ts room, cast/mas.ts portrait).
import {Buf, rect, line, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg, Img} from '../figure';
import {tiny} from './kit-b';
import {drawMic, drawStampPad, drawMoth} from '../kits/senate-props';
import {drawSenator, drawGallery, SenatorPose} from '../cast/civic-extras';
import {drawLahtRoom, lahtBust, LAHT_BUST_DEFAULT, LahtBustState, drawIndexCard, LahtRoomArm} from '../cast/lahtnemulb';
import {drawSucramRoom, sucramBust, SUCRAM_BUST_DEFAULT, SucramBustState, SucramRoomArm} from '../cast/sucram';
import {drawMasStand, MAS_STAND_DEFAULT} from '../cast/mas-stand';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {putBustCut} from '../cast/civic-kit';

const RH = 203;
export const SENATE = {
  wainscot: 62, floorY: 124,
  gallery: {x0: 0, x1: 250, y0: 52, rows: 4},
  witness: {x0: 40, x1: 250, top: 150, front: 158, foot: 196},
  seats: {mas: 116, sucram: 178} as Record<'mas' | 'sucram', number>,
  seatFoot: 196,
  dais: {x0: 272, top: 98, front: 150},
  /** the dais seats (foot x, left to right): the clone next to the chairman on the witnesses' side */
  daisSeats: [{id: 'senA', x: 304, v: 2}, {id: 'clone', x: 346}, {id: 'chair', x: 390}, {id: 'senB', x: 432, v: 0}, {id: 'senC', x: 472, v: 1}] as Array<{id: string; x: number; v?: 0 | 1 | 2}>,
  daisFoot: 142,
};
export type DaisSeat = 'senA' | 'clone' | 'chair' | 'senB' | 'senC';

// ------------------------------------------------------------------ the walls (cached)
const wallCache = new Map<string, Buf>();
const paintWall = (soft: number): Buf => {
  const key = String(soft);
  let b = wallCache.get(key);
  if (b) return b;
  b = new Buf(480, RH, PAL.N0);
  const {wainscot, floorY} = SENATE;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const bz = bayer(x, y);
    let c: number;
    if (y < wainscot) {
      // pale stone in ashlar courses, a faint vein; the overhead light falls off toward the top
      const course = y % 16 === 0 || (x + (Math.floor(y / 16) % 2) * 30) % 60 === 0;
      c = y < 8 ? PAL.G4 : bz < 0.5 - y / 200 ? PAL.G5 : PAL.G6;
      if (y > 20) c = bz < 0.35 ? PAL.G5 : PAL.G6;
      if (course) c = PAL.G4;
      if (hash(x >> 2, y >> 2, 17) < 0.02) c = PAL.P1;
    } else if (y < floorY) {
      const px = x % 48, py = y - wainscot;
      const edge = px === 2 || py === 6;
      c = y < wainscot + 3 ? (y === wainscot ? PAL.W4 : PAL.D4) : edge ? PAL.D4 : px === 46 ? PAL.D1 : py > floorY - wainscot - 4 ? PAL.D1 : PAL.D3;
    } else c = bz < 0.4 - (y - floorY) / 300 ? PAL.N4 : PAL.N3;
    b.set(x, y, c);
  }
  // the navy drapes behind the dais: tall folds, lit crests
  for (let y = 0; y < SENATE.dais.top + 4; y++) for (let x = 262; x < 480; x++) {
    const k = (x - 262) % 22;
    b.set(x, y, k < 3 ? PAL.N6 : k < 8 ? PAL.N5 : k < 16 ? PAL.N4 : PAL.N3);
  }
  rect(262, 0, 218, 4, b.ink(PAL.W5)); rect(262, 4, 218, 1, b.ink(PAL.W3)); // the valance's gold edge
  if (soft) for (let i = 0; i < b.c.length; i++) b.c[i] = stepColor(b.c[i], -soft);
  wallCache.set(key, b);
  return b;
};

// ------------------------------------------------------------------ the dais
interface DaisSt { seats?: typeof SENATE.daisSeats; lit?: DaisSeat | null; lean?: boolean; chair?: {arm?: LahtRoomArm; mouth?: 'rest' | 'open'; nod?: 0 | 1}; clone?: {arm?: LahtRoomArm; mouth?: 'rest' | 'open'}; sheet?: 0 | 1 | 2 | 3; senMouth?: DaisSeat | null;
  /** v3.5 (opt-in): no clone: his seat is a plain senator's, and the sheet goes to the chairman */
  noClone?: boolean; }
const drawDaisAt = (b: Buf, dx: number, f: number, st: DaisSt) => {
  const {top, front} = SENATE.dais;
  const x0 = SENATE.dais.x0 + dx;
  const SEATS0 = st.seats ?? SENATE.daisSeats;
  const SEATS = st.noClone ? SEATS0.map((s) => (s.id === 'clone' ? {id: 'senD', x: s.x, v: 1 as const} : s)) : SEATS0;
  // the chair backs behind the seats (the clone's is taller, brass-studded: the better chair)
  for (const s of SEATS) {
    const x = s.x + dx, better = s.id === 'clone';
    const cy = better ? 52 : 64;
    for (let j = 0; j < top - cy; j++) for (let i = -12; i <= 12; i++) {
      if (j < 3 && Math.abs(i) > 9) continue;
      const e = Math.abs(i) === 12 || j === 0;
      b.set(x + i, cy + j, better ? (e ? PAL.R2 : Math.abs(i) === 10 && j % 3 === 0 ? PAL.W6 : i < -3 ? PAL.R1 : PAL.R0) : e ? PAL.N4 : i < -3 ? PAL.N3 : PAL.N2);
    }
  }
  // the seated: senators, the clone and the chairman (standing sprites, the bench overpaints the legs), facing left
  const clip = (_x: number, y: number) => y < top + 2;
  for (const s of SEATS) {
    const x = s.x + dx;
    const pose: SenatorPose = st.sheet === 3 && s.id !== 'chair' ? 'up' : st.lean ? 'lean' : 'sit';
    if (s.id === 'clone') drawLahtRoom(b, x, SENATE.daisFoot, {arm: st.sheet === 3 ? 'up' : st.sheet === 2 ? 'card' : st.lean ? 'lean' : st.clone?.arm ?? 'down', mouth: st.clone?.mouth ?? 'rest', clone: true}, {flip: true, clip});
    else if (s.id === 'chair') drawLahtRoom(b, x, SENATE.daisFoot, {arm: st.lean ? 'lean' : st.chair?.arm ?? 'card', mouth: st.chair?.mouth ?? 'rest', clone: false, nod: st.chair?.nod}, {flip: true, clip});
    else drawSenator(b, x, SENATE.daisFoot, s.v ?? 0, pose, {flip: true, mouth: st.senMouth === s.id ? 'open' : 'rest', clip});
  }
  // the sheet: arriving into the clone's hand, then held up (its back toward the witnesses)
  const cloneX = (SEATS.find((q) => q.id === (st.noClone ? 'chair' : 'clone')) ?? SEATS[1]).x + dx;
  if (st.sheet === 1) { rect(cloneX - 40, top - 16, 12, 15, b.ink(PAL.P2)); rect(cloneX - 40, top - 16, 12, 1, b.ink(PAL.W9)); }
  if (st.sheet === 2) { rect(cloneX - 24, top - 22, 12, 15, b.ink(PAL.P2)); rect(cloneX - 24, top - 22, 1, 15, b.ink(PAL.W9)); }
  if (st.sheet === 3) { rect(cloneX - 26, top - 44, 22, 18, b.ink(PAL.P1)); rect(cloneX - 26, top - 44, 22, 1, b.ink(PAL.P2)); for (let i = 2; i < 20; i++) if (i % 3) b.set(cloneX - 26 + i, top - 38, PAL.R2); for (let i = 4; i < 18; i++) if (i % 3) b.set(cloneX - 26 + i, top - 33, PAL.R2); }
  // the bench: its top (with the mics and blank name tents), a gold trim, the panelled front curving to the floor
  rect(x0, top, 480 - x0 + 40, 4, b.ink(PAL.D1)); rect(x0, top, 480 - x0 + 40, 1, b.ink(PAL.D4));
  for (let y = top + 4; y < front; y++) for (let x = x0; x < 480; x++) {
    const px = (x - x0) % 34, py = y - top;
    const trim = py === 4 || py === 5;
    b.set(x, y, trim ? (py === 4 ? PAL.W6 : PAL.W4) : px === 2 ? PAL.D4 : px === 32 ? PAL.D1 : py > front - top - 3 ? PAL.D1 : PAL.D3);
  }
  // the step under it, its shadow on the carpet
  rect(x0 - 6, front, 480 - x0 + 6, 6, b.ink(PAL.D2)); rect(x0 - 6, front, 480 - x0 + 6, 1, b.ink(PAL.D4)); rect(x0 - 6, front + 6, 480 - x0 + 6, 2, b.ink(PAL.N1));
  for (const s of SEATS) {
    const x = s.x + dx;
    drawMic(b, x - 14, top, {lit: st.lit === s.id, dir: 1});
    // the name plate on the bench's face, under the trim (blank at this size; the chairman's reads CHAIR)
    rect(x - 9, top + 8, 20, 7, b.ink(PAL.P1)); rect(x - 9, top + 8, 20, 1, b.ink(PAL.P2)); rect(x - 9, top + 14, 20, 1, b.ink(PAL.P0));
    if (s.id === 'chair') tiny(b, 'CHAIR', x - 8, top + 9, PAL.N3);
  }
};

// ------------------------------------------------------------------ the witness table (wide)
interface WitnessSt { mas?: {wallet?: boolean; mouth?: 'rest' | 'open'}; sucram?: {arm?: SucramRoomArm; mouth?: 'rest' | 'open'}; }
const drawWitnessTable = (b: Buf, f: number, st: WitnessSt) => {
  const {x0, x1, top, front, foot} = SENATE.witness;
  const clip = (_x: number, y: number) => y < top + 1;
  drawMasStand(b, SENATE.seats.mas, SENATE.seatFoot, {...MAS_STAND_DEFAULT, arm: st.mas?.wallet ? 'reach' : 'down', mouth: st.mas?.mouth ?? 'rest'}, {clip: st.mas?.wallet ? undefined : clip});
  drawSucramRoom(b, SENATE.seats.sucram, SENATE.seatFoot, {arm: st.sucram?.arm ?? 'phone', mouth: st.sucram?.mouth ?? 'rest', lean: true}, {clip: st.sucram?.arm === 'stamp' ? undefined : clip});
  // the table: green baize to the floor, its lit top edge
  for (let y = top; y < foot; y++) for (let x = x0; x < x1; x++) b.set(x, y, y === top ? PAL.L2 : y < front ? PAL.L1 : (x - x0) % 30 === 0 ? PAL.L0 : bayer(x, y) < 0.2 ? PAL.L1 : PAL.L0);
  rect(x0, foot, x1 - x0, 2, b.ink(PAL.N1));
  // two mics, one glass of water, the binder, the stamp pad (the wallet held up over the table, in his reach hand)
  drawMic(b, SENATE.seats.mas + 10, top, {dir: -1});
  drawMic(b, SENATE.seats.sucram + 10, top, {dir: -1});
  rect(SENATE.seats.mas - 16, top - 7, 3, 7, b.ink(PAL.C3)); b.set(SENATE.seats.mas - 16, top - 5, PAL.C7); rect(SENATE.seats.mas - 16, top - 5, 3, 1, b.ink(PAL.C6));
  rect(SENATE.seats.sucram - 22, top - 3, 16, 3, b.ink(PAL.N2)); rect(SENATE.seats.sucram - 22, top - 3, 16, 1, b.ink(PAL.N4));
  drawStampPad(b, SENATE.seats.sucram + 18, top - 4, 1);
  if (st.mas?.wallet) {
    const hx = SENATE.seats.mas + 16, hy = SENATE.seatFoot - 80 + 40;
    rect(hx, hy - 7, 10, 7, b.ink(PAL.D3)); rect(hx, hy - 7, 10, 1, b.ink(PAL.D4)); rect(hx + 5, hy - 6, 4, 5, b.ink(PAL.P2));
  }
};

// ------------------------------------------------------------------ the wide
export interface SenateWideState extends DaisSt, WitnessSt { gasp?: boolean; }
export const drawSenateWide = (b: Buf, f: number, st: SenateWideState = {}) => {
  const w = paintWall(0);
  b.c.set(w.c.subarray(0, 480 * RH));
  const g = SENATE.gallery;
  drawGallery(b, g.x0, g.x1, g.y0, g.rows, {gasp: st.gasp});
  // the gallery's front rail
  rect(g.x0, 116, g.x1 - g.x0, 4, b.ink(PAL.D2)); rect(g.x0, 116, g.x1 - g.x0, 1, b.ink(PAL.W4)); for (let x = g.x0 + 6; x < g.x1; x += 12) rect(x, 120, 2, 10, b.ink(PAL.D1));
  drawDaisAt(b, 0, f, st);
  drawWitnessTable(b, f, st);
};
export const drawSenateDais = (b: Buf, f: number, st: DaisSt = {}) => {
  // a step closer on the dais: the drapes fill the back, the bench across the frame
  const w = paintWall(0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, w.get(Math.max(262, Math.min(479, 262 + ((x - 0) % 218))), y));
  // the dais across the whole frame, the five seats spread along it (the clone next to the chair, nearer the witnesses)
  const X0 = SENATE.dais.x0;
  const seats = [{id: 'senA', x: X0 + 60, v: 2 as const}, {id: 'clone', x: X0 + 170}, {id: 'chair', x: X0 + 250}, {id: 'senB', x: X0 + 340, v: 0 as const}, {id: 'senC', x: X0 + 430, v: 1 as const}];
  drawDaisAt(b, -SENATE.dais.x0, f, {...st, seats});
};

// ------------------------------------------------------------------ busts behind a table / bench (the 2S tier)
const putBust = putBustCut;
export interface Witness2SState {
  mas?: Partial<MasPortraitState>;
  sucram?: Partial<SucramBustState>;
  /** the moth: null · 'pad' landed on the stamp pad · 'dodge' in the air beside it (its 3 drawings on f) */
  moth?: 'pad' | 'dodge' | null;
  /** Mas's hand to his pocket (on "money"): the near arm drops out of frame */
  pocket?: boolean;
}
export const WIT2S = {mas: 70, sucram: 250, y: 26, table: 156};
export const drawWitness2S = (b: Buf, f: number, st: Witness2SState = {}) => {
  // behind them: the gallery, two rungs soft, the stone above
  const w = paintWall(2);
  b.c.set(w.c.subarray(0, 480 * RH));
  drawGallery(b, 0, 480, 40, 5, {});
  for (let y = 40; y < WIT2S.table; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  putBust(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...st.mas}), WIT2S.mas, WIT2S.y, WIT2S.table, true);
  putBust(b, sucramBust({...SUCRAM_BUST_DEFAULT, ...st.sucram}), WIT2S.sucram, WIT2S.y + 2, WIT2S.table, true);
  // the table's baize close, the mics at bust scale, his glass, the stamp pad (and the moth on it)
  for (let y = WIT2S.table; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === WIT2S.table ? PAL.L2 : bayer(x, y) < 0.3 ? PAL.L1 : PAL.L0);
  drawMic(b, WIT2S.mas + 104, WIT2S.table + 14, {scale: 'bust', dir: 1});
  drawMic(b, WIT2S.sucram + 104, WIT2S.table + 14, {scale: 'bust', dir: 1});
  const gx = WIT2S.mas + 20, gy = WIT2S.table - 22;
  for (let j = 0; j < 30; j++) for (let i = 0; i < 12; i++) b.set(gx + i, gy + j, j < 9 ? (i === 0 ? PAL.C5 : i === 11 ? PAL.C2 : PAL.N2) : i === 0 ? PAL.C6 : i === 11 ? PAL.C2 : i < 4 ? PAL.C3 : PAL.C2);
  rect(gx + 1, gy + 9, 10, 1, b.ink(PAL.C8)); // the water line: flat
  drawStampPad(b, WIT2S.sucram + 20, WIT2S.table + 20, 2);
  if (st.moth === 'pad') drawMoth(b, WIT2S.sucram + 38, WIT2S.table + 16, 1, true);
  if (st.moth === 'dodge') drawMoth(b, WIT2S.sucram + 18 + ((f >> 2) % 2) * 20, WIT2S.table + 2 - ((f >> 3) % 2) * 6, f >> 1, true);
};
export interface Dais2SState { chair?: Partial<LahtBustState>; clone?: Partial<LahtBustState>; lit?: 'chair' | 'clone' | null; }
export const DAIS2S = {chair: 272, clone: 110, y: 22, bench: 150};
export const drawDais2S = (b: Buf, f: number, st: Dais2SState = {}) => {
  const w = paintWall(1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, w.get(262 + (x % 218), y));
  // the chair backs: the clone's the taller, studded one
  const back = (x: number, top: number, better: boolean) => {
    for (let j = 0; j < DAIS2S.bench - top; j++) for (let i = -44; i <= 44; i++) {
      if (j < 8 && Math.abs(i) > 36 + j) continue;
      const e = Math.abs(i) >= 43 || j === 0;
      b.set(x + i, top + j, better ? (e ? PAL.R2 : Math.abs(i) === 38 && j % 6 === 0 ? PAL.W6 : i < -10 ? PAL.R1 : PAL.R0) : e ? PAL.N4 : i < -10 ? PAL.N3 : PAL.N2);
    }
  };
  back(DAIS2S.clone + 56, 12, true);
  back(DAIS2S.chair + 56, 40, false);
  putBust(b, lahtBust({...LAHT_BUST_DEFAULT, clone: true, arm: 'down', ...st.clone}), DAIS2S.clone, DAIS2S.y, DAIS2S.bench);
  putBust(b, lahtBust({...LAHT_BUST_DEFAULT, clone: false, ...st.chair}), DAIS2S.chair, DAIS2S.y + 2, DAIS2S.bench);
  // the bench top, the gold trim, the panelled front
  for (let y = DAIS2S.bench; y < RH; y++) for (let x = 0; x < 480; x++) {
    const py = y - DAIS2S.bench;
    b.set(x, y, py < 3 ? (py === 0 ? PAL.D4 : PAL.D1) : py === 10 ? PAL.W6 : py === 11 ? PAL.W4 : x % 60 === 4 ? PAL.D4 : x % 60 === 58 ? PAL.D1 : PAL.D3);
  }
  drawMic(b, DAIS2S.clone + 10, DAIS2S.bench + 6, {scale: 'bust', dir: -1, lit: st.lit === 'clone'});
  drawMic(b, DAIS2S.chair + 10, DAIS2S.bench + 6, {scale: 'bust', dir: -1, lit: st.lit === 'chair'});
};
export interface SenateOTSState { chair?: Partial<LahtBustState>; clone?: Partial<LahtBustState>; take?: 0 | 1 | 2 | 3;
  /** v3.5 (opt-in): no clone; the chairman alone behind the bench, a step nearer the centre */
  noClone?: boolean; }
export const drawSenateOTS = (b: Buf, f: number, st: SenateOTSState = {}) => {
  const w = paintWall(1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, w.get(262 + (x % 218), y));
  // the dais beyond (frame right): the two busts behind the bench, facing left toward us / Mas
  const take = st.take ?? 0;
  const chairArm = take >= 2 ? 'down' : 'card';
  const cloneArm = take >= 1 ? 'take' : 'down';
  const cx = st.noClone ? 300 : 344;
  if (!st.noClone) putBust(b, lahtBust({...LAHT_BUST_DEFAULT, clone: true, arm: cloneArm, ...st.clone}), 214, 40, 158);
  putBust(b, lahtBust({...LAHT_BUST_DEFAULT, clone: false, arm: st.noClone ? 'card' : chairArm, ...st.chair}), cx, 44, 158);
  for (let y = 158; y < RH; y++) for (let x = 150; x < 480; x++) { const py = y - 158; b.set(x, y, py < 2 ? PAL.D4 : py === 8 ? PAL.W6 : x % 50 === 0 ? PAL.D4 : PAL.D3); }
  if (!st.noClone) drawMic(b, 230, 164, {scale: 'bust', dir: -1});
  drawMic(b, cx + 16, 164, {scale: 'bust', dir: -1});
  // MAS in the foreground: the back of his head (brown hair in strands, the cowlick's tuft), the hood bunched at his
  // neck, the hoodie's shoulder; dark, with a 1-px rim from the dais' light on the right-hand edges
  const inHead = (x: number, y: number) => Math.hypot((x - 72) / 38, (y - 108) / 44) < 1;
  const inHood = (x: number, y: number) => Math.hypot((x - 70) / 52, (y - 170) / 30) < 1 && y > 142;
  const inSh = (x: number, y: number) => Math.hypot((x - 50) / 150, (y - 250) / 92) < 1;
  for (let y = 60; y < RH; y++) for (let x = 0; x < 220; x++) {
    const h = inHead(x, y), hd = inHood(x, y), sh = inSh(x, y);
    if (!h && !hd && !sh) continue;
    const rimR = !(inHead(x + 1, y) || inHood(x + 1, y) || inSh(x + 1, y)) || !(inHead(x, y - 1) || inHood(x, y - 1) || inSh(x, y - 1));
    let c: number;
    if (h && !hd) {
      const strand = (Math.floor((x * 0.6 + y) / 3) + (x >> 3)) % 3 === 0;
      c = rimR ? PAL.B4 : strand ? PAL.B2 : y > 130 ? PAL.B0 : PAL.B1;
    } else if (hd) c = rimR ? PAL.G4 : (x + y) % 9 === 0 ? PAL.G2 : PAL.G1;
    else c = rimR ? PAL.G3 : x > 150 ? PAL.G1 : PAL.G0;
    b.set(x, y, c);
  }
  // his cowlick's tuft against the light, and the ear's edge
  for (const [x, y] of [[74, 63], [75, 62], [76, 62], [77, 63], [73, 64]] as Array<[number, number]>) b.set(x, y, PAL.B3);
  for (let j = 0; j < 12; j++) b.set(108, 100 + j, j < 2 || j > 9 ? PAL.S1 : PAL.S3);
};
export interface SenateMCUState { bust: Img; flip?: boolean; third: 'L' | 'R'; bg: 'dais' | 'gallery'; mic?: boolean; lit?: boolean; }
export const drawSenateMCU = (b: Buf, f: number, st: SenateMCUState) => {
  const w = paintWall(2);
  if (st.bg === 'dais') for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, w.get(262 + (x % 218), y));
  else { b.c.set(w.c.subarray(0, 480 * RH)); drawGallery(b, 0, 480, 30, 7, {}); for (let i = 0; i < 480 * RH; i++) b.c[i] = stepColor(b.c[i], -2); }
  const x = st.third === 'L' ? 100 : 262, y = 22;
  putBust(b, st.bust, x, y, RH, st.flip);
  if (st.mic) drawMic(b, x + (st.third === 'L' ? 104 : -4), 178, {scale: 'bust', dir: st.third === 'L' ? -1 : 1, lit: st.lit});
};
void line; void clamp; void blitImg; void drawIndexCard;
