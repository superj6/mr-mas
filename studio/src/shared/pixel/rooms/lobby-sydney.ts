// MR. MAS — shared set: SC 10, SYDNEY in the NopeAI lobby (draft 7, restored). New file (v3-art-a, v3.1 round,
// 2026-09-27). It stages cast/sydney.ts in sc 9's dressed lobby (rooms/lobby-deal.ts: weeks on, the check scuffed on
// the floor, Mas at the desk with his glass, Gerg on the check's edge with his laptop, Tasya with twelve keys) and the
// lobby TV (kits/tv-news.ts, its v3.1 `bubble` state). Nothing here edits sc 9's drawings.
//   drawSydneyTvExit(b, f, st)   [SCR] v31-10.01: the TV full frame, GNIB's search box; the bubble (Sydney) slips out
//                                of the box, down the picture, over the caption band and the bezel and out of frame,
//                                in held steps (st.step 0 in the box · 1 · 2 · 3 · 4 gone; the box empty after 0)
//   sydneyDriftAt(t)             the wide's drift, t 0..1: out of the TV's screen, down across the lobby, to a pixel
//                                too close to Mas's face (SYD_PARK); whole pixels, held every 3 frames by the caller
//   drawSydneyWide(b, f, st)     [W] the lobby as 9.10 left it, the TV's box empty, Sydney at room size (st.sydney.at
//                                or .t), her face, the timer on her chain (10.04's ding, the blink-and-reset)
//   drawSydney2SMas(b, f, st)    [2S] v31-10.02: Mas at the desk with his glass (medium), Sydney a pixel from his
//                                nose (screen size: ChatGTP's drawing, repainted); the lobby soft behind, the TV's box
//                                empty
//   drawSydney2STasya(b, f, st)  [2S] v31-10.03: Tasya (medium, frame right, unbroken smile) and Sydney; st.clip: his
//                                near hand out clipping the egg timer to her chain (0 none · 1 the timer in his
//                                fingers at the chain · 2 hung, his hand back), the timer's face `5`
//   drawSydneyGerg2S(b, f, st)   [2S] v31-10.04: sc 9.13's two-shot (Mas at the desk, Gerg on the check with his
//                                laptop, the lid at LOBBY_LID) with Sydney turned to Mas, brand new ("Hi!"); the lid
//                                closes → the match cut (kits/gerg-laptop.ts has his screen's POV)
import {Buf, rect, bayer} from '../px';
import {PAL, stepColor, familyOf} from '../palette';
import {LOBBY} from './lobby';
import {drawDealWide, DealWideState, softLobby, drawDealGerg2S, DealGerg2SState} from './lobby-deal';
import {drawTvScreen, TvState} from '../kits/tv-news';
import {drawSydney, SydneyOpts, SYDNEY, sydneyChainAt, drawEggTimer} from '../cast/sydney';
import {drawMasMedium, MAS_MEDIUM_DEFAULT, MasMediumState, MAS_M_DESK, MAS_MW} from '../cast/mas-medium';
import {drawCollarsMedium} from '../cast/mas-collars';
import {drawTasyaMedium, TasyaMediumState, TASYA_M_CLIP} from '../cast/tasya-medium';

const RH = 203;
const TRANS = 0x1000000;

// ------------------------------------------------------------------ [SCR] the exit from the TV
export interface SydneyTvExitState { step?: 0 | 1 | 2 | 3 | 4; face?: SydneyOpts['face']; talk?: boolean }
/** where the bubble sits in drawTvScreen's GNIB frame (its search box), and its held steps out of the screen */
export const SYD_TV_STEPS: Array<[number, number]> = [[101, 52], [104, 104], [110, 158], [118, 188]];
export const drawSydneyTvExit = (b: Buf, f: number, st: SydneyTvExitState = {}) => {
  const step = st.step ?? 0;
  drawTvScreen(b, f, {show: 'gnib', bubble: step === 0 ? 'sydney' : 'gone', bubbleFace: st.face});
  if (step >= 1 && step <= 3) {
    const [x, y] = SYD_TV_STEPS[step];
    // she is out of the picture now: drawn over the box's edge, the caption band and the bezel (in front of the TV)
    drawSydney(b, x, y, {size: 'screen', face: st.face ?? 'dots', talk: st.talk, f, chain: true});
  }
};

// ------------------------------------------------------------------ [W] the drift across the lobby
/** the wide's Mas (sc 9.10's staging: at the desk) and where Sydney parks: one pixel off his face */
export const SYD_WIDE = {mas: [170, 184] as [number, number], tvOut: [LOBBY.TV.x0 + 22, LOBBY.TV.y1 - 6] as [number, number], park: [179, 108] as [number, number]};
export const sydneyDriftAt = (t: number): [number, number] => {
  const [x0, y0] = SYD_WIDE.tvOut, [x1, y1] = SYD_WIDE.park;
  const u = Math.max(0, Math.min(1, t));
  const e = u * u * (3 - 2 * u);
  // a shallow arc: it drops out of the screen first, then drifts across, then settles (a 1 px bob on the way)
  const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * Math.min(1, e * 1.4) + Math.sin(u * Math.PI) * 18 + (u < 1 ? Math.round(Math.sin(u * 20)) : 0);
  return [Math.round(x), Math.round(y)];
};
export interface SydneyWideState extends DealWideState {
  sydney?: (SydneyOpts & {at?: [number, number]; t?: number}) | null;
}
/** the lobby weeks on (sc 9.10's dressing, the defaults below), the TV's box empty once she's out */
export const drawSydneyWide = (b: Buf, f: number, st: SydneyWideState = {}) => {
  const out = !!st.sydney;
  drawDealWide(b, f, {
    check: 'scuffed',
    mas: {at: SYD_WIDE.mas, collars: 3, collarStyle: 'v31'},
    tasya: {keys: 12, beige: true, mouth: 'smile'},
    gerg: {body: 'sit', at: [96, 190], look: 'up'},
    ...st,
    tv: st.tv ?? {show: 'gnib', bubble: out ? 'gone' : 'sydney'},
  });
  if (st.sydney) {
    const s = st.sydney;
    const [x, y] = s.at ?? sydneyDriftAt(s.t ?? 1);
    drawSydney(b, x, y, {...s, size: 'room'});
  }
};

// ------------------------------------------------------------------ [2S] Mas and Sydney, a pixel too close
export interface Sydney2SMasState {
  mas?: Partial<MasMediumState>;
  collars?: number;
  sydney?: SydneyOpts;
  /** how far off his face she parks (px; 1 = "a pixel too close") */
  gap?: number;
  tv?: TvState;
}
/** the rightmost skin pixel of a medium Mas drawn (flipped, facing right) at (x, y), in his face's rows */
const faceEdge = (x: number, y: number, s: MasMediumState): {x: number; y: number} => {
  const t = new Buf(480, RH, TRANS);
  drawMasMedium(t, x, y, s, {flip: true});
  let best = {x: x + 50, y: y + 26};
  for (let yy = y + 12; yy < y + 40; yy++) for (let xx = x + MAS_MW - 1; xx >= x; xx--) { const c = t.get(xx, yy); if (c === TRANS) continue; const fm = familyOf(c); if (fm && (fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X') && xx > best.x) best = {x: xx, y: yy}; }
  return best;
};
export const SYD_2S = {mas: [150, 92] as [number, number]};
export const drawSydney2SMas = (b: Buf, f: number, st: Sydney2SMasState = {}) => {
  softLobby(b, f, {check: 'scuffed', tv: st.tv ?? {show: 'gnib', bubble: 'gone'}});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.35) b.set(x, y, stepColor(b.get(x, y), -1));
  const [mx, my] = SYD_2S.mas;
  const ms: MasMediumState = {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'rest', ...st.mas};
  drawMasMedium(b, mx, my, ms, {flip: true, desk: (bb) => {
    for (let y = my + MAS_M_DESK; y < RH; y++) for (let x = 40; x < 340; x++) bb.set(x, y, y === my + MAS_M_DESK ? PAL.G5 : y < my + MAS_M_DESK + 3 ? PAL.G4 : bayer(x, y) < 0.3 ? PAL.N3 : PAL.N2);
  }});
  drawCollarsMedium(b, mx, my, st.collars ?? 3, {flip: true, style: 'v31'});
  // his glass on the desk by his hand (the one flat water line)
  const gx = mx + 104, gy = my + MAS_M_DESK - 14;
  for (let j = 0; j < 14; j++) { b.set(gx, gy + j, PAL.G6); b.set(gx + 6, gy + j, PAL.G4); for (let i = 1; i < 6; i++) b.set(gx + i, gy + j, j > 4 ? (i === 1 ? PAL.C7 : PAL.C6) : PAL.G5); }
  for (let i = 1; i < 6; i++) b.set(gx + i, gy + 5, PAL.C8);
  // Sydney, parked a pixel off his nose, her eyes level with his
  const e = faceEdge(mx, my, ms);
  const gap = st.gap ?? 1;
  drawSydney(b, e.x + 1 + gap, my + 12, {size: 'screen', ...st.sydney});
};

// ------------------------------------------------------------------ [2S] Tasya and Sydney: the egg timer
export interface Sydney2STasyaState {
  tasya?: Partial<TasyaMediumState>;
  sydney?: SydneyOpts;
  /** 0 no timer yet · 1 his fingers clipping it on (the timer in his hand at her chain) · 2 hung on her chain */
  clip?: 0 | 1 | 2;
  /** the timer's digit (5 when he clips it) */
  n?: number;
}
export const SYD_TASYA = {tasya: [372, 96] as [number, number]};
export const drawSydney2STasya = (b: Buf, f: number, st: Sydney2STasyaState = {}) => {
  softLobby(b, f, {check: 'scuffed', tv: {show: 'gnib', bubble: 'gone'}}, 60);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.35) b.set(x, y, stepColor(b.get(x, y), -1));
  const [tx, ty] = SYD_TASYA.tasya;
  const clip = st.clip ?? 0;
  // Sydney hangs where his clipping hand reaches (her chain's clip point at his fingertips)
  const [hx, hy] = [tx + TASYA_M_CLIP[0], ty + TASYA_M_CLIP[1]];
  const sx = hx - SYDNEY.screen.clip[0], sy = hy - SYDNEY.screen.clip[1] - 1;
  drawTasyaMedium(b, tx, ty, {mouth: 'smile', brow: 'warm', keys: 12, beige: true, ...st.tasya, arm: clip === 1 ? 'clip' : st.tasya?.arm ?? 'clasp'});
  drawSydney(b, sx, sy, {size: 'screen', ...st.sydney, timer: clip === 2 ? {n: st.n ?? 5} : null});
  if (clip === 1) {
    // the timer in his fingers at her chain (drawn over the chain; his fingertips over the ring)
    const [cx, cy] = sydneyChainAt(sx, sy);
    drawEggTimer(b, cx, cy, {n: st.n ?? 5});
    rect(cx + 1, cy - 1, 3, 3, b.ink(PAL.S4)); b.set(cx + 1, cy - 1, PAL.S5); b.set(cx + 3, cy + 1, PAL.S3);
  }
};

// ------------------------------------------------------------------ [2S] 10.04: the reset; Gerg closes his laptop
export interface SydneyGerg2SState extends DealGerg2SState { sydney?: SydneyOpts | null }
export const drawSydneyGerg2S = (b: Buf, f: number, st: SydneyGerg2SState = {}) => {
  drawDealGerg2S(b, f, {collarStyle: 'v31', ...st, tv: st.tv ?? {show: 'gnib', bubble: 'gone'}});
  if (st.sydney === null) return;
  // Mas is at (30, 92) in this setup, facing right: she hangs off his nose, turned to him
  const ms: MasMediumState = {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'rest', ...st.mas};
  const e = faceEdge(30, 92, ms);
  drawSydney(b, e.x + 2, 104, {size: 'screen', face: 'dots', timer: {n: 5}, ...st.sydney});
};
