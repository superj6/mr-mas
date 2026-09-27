// MR. MAS — shared kit: THE CALL FROM THE BOARD'S SIDE (UI-CALL-V5, STYLE-1G-NEON, STYLE-1G-SOFT; Ep1 Act Four v5 art
// pass; new file, owned by the v5 art pass). The same generic call app as kits/callgrid.ts (its chrome, chips, rings,
// toasts and grey), laid out the way THEIR laptops show it, with the states v5 plays on their side (sc 27, S3.00a-S3.05,
// S4.01) and none of his side's: no dialog, no arrow, no dissolve.
//   drawBoardCall(b, st)   paints the whole call into `b` (any size: the full [SCR] opening is 456 x 177, the OTS
//                          laptop's is NDESK.screen 284 x 152). The layout scales its TILES (their geometry), never
//                          their pixels: every tile painter draws at 1:1 into the tile rect it is given.
// Their gallery: NELEH top-left, MADA top-middle, ALYI top-right (his doorway sits right, for the S3.05 -> S3.06 match
// cut), THE QUIET VOTE bottom-left, and the FIFTH SLOT bottom-right: his tile, then Rima's.
// The fifth slot's states (`fifth`):
//   {kind: 'waiting', k}             an empty tile: "Waiting for MAS MANALT to join…" and typing dots (S3.00a open)
//   {kind: 'mas', k}                 his tile connecting (3 held steps from k 0), then MAS, small, perfectly still,
//                                    the one-pixel smile, one bar of hotel Wi-Fi; the Vegas neon CHASES behind him at
//                                    1.G's guardrail (<= 1 step per 8 f: vegasNeon), the visual proof for "No. That is
//                                    just him."
//   {kind: 'rima', k, mouth, hand?}  Rima's join (S3.04; hand 'smooth0' | 'smooth1': she smooths her jacket in 2 held
//                                    drawings, cast/rima-v5.ts): a join ring in 3 held steps, a hard circular spotlight
//                                    searches the grid and lands on her slot (overshoot, back, on), then stays in her
//                                    tile, lit like a stage
//   null                             no fifth tile
// `removed: k` (S3.01): his tile simply goes at k 0, the four close ranks (held steps, k 4-12), the notice types at the
// call's foot (from k 6) and the `MAS MANALT · audio` chip sits where his tile was (from k 10). `audio` sets the
// chip's mic level (0-3, lit green while "super." plays) or greys it.
// Mouths: `mouths.{alyi, neleh, rima}` (visemes, lip-sync), `speaking` = who has the call's speaking ring.
// Also: vegasNeon (1.G's re-clocked neon), softTile (1.G's P2 CALL softness: a tile at half resolution, doubled),
// drawTileSoft (his side: a callgrid tile with its video soft and its chips sharp).
import {Buf, rect, hash, bayer} from '../px';
import {PAL, stepColor, lum} from '../palette';
import {text, textWidth} from '../font';
import {blitImg} from '../figure';
import {callChrome, nameChip, micIcon, voteChip, speakingRing, typingDots, CALL_BAR_H, TileRect, TileState, drawTile, gridLayout, slideTiles, clipView, camOffBg, CALL_GREY, noticeIcon} from './callgrid';
import {pt, pw, pwrap} from './uitype';
import type {Viseme} from '../cast/talk';
import {drawNelehTile, drawNelehMini} from '../cast/neleh';
import {drawAlyiTile, drawAlyiMini} from '../cast/alyi-speak';
import {drawAlyiTileFit} from '../cast/alyi-v5';
import {drawMadaTile, drawMadaMini, drawSpinner} from '../cast/mada';
import {drawRimaTileV5, RimaTileHand} from '../cast/rima-v5';
import {masMediumBack, MAS_MEDIUM_DEFAULT, MAS_M_FACE} from '../cast/mas-medium';

// ------------------------------------------------------------------ layout
export interface BoardLayout { five: TileRect[]; four: TileRect[]; chip: [number, number]; noticeY: number; w: number; h: number }
/** tile rects for a screen of w x h: five = 3 + 2 (their gallery), four = the 2 x 2 after his tile goes */
export const boardLayout = (w: number, h: number): BoardLayout => {
  const gap = w >= 400 ? 6 : 4;
  const full = w >= 400;
  // a small window (the blog editor's corner) reserves no strip for the chip and the notice
  const reserve = h >= 120 ? 30 : 4;
  const tw = full ? 144 : Math.floor((w - 4 - 2 * gap) / 3);
  const th = full ? 76 : Math.min(Math.floor(tw * 0.56), Math.floor((h - CALL_BAR_H - reserve - gap) / 2));
  const area: TileRect = {x: 0, y: CALL_BAR_H, w, h: full ? h - CALL_BAR_H : 2 * th + gap + 6};
  const five = gridLayout(5, {w: tw, h: th, gap, area});
  const fw = full ? 150 : Math.floor((w - 3 * gap) / 2);
  const fh = full ? 60 : Math.min(Math.floor(fw * 0.56), Math.floor((h - CALL_BAR_H - reserve - gap) / 2));
  const four = gridLayout(4, {w: fw, h: fh, gap, area: {x: 0, y: CALL_BAR_H, w, h: 2 * fh + gap + 6}});
  const f5 = five[4];
  return {five, four, chip: [f5.x + Math.round(f5.w / 2) - 30, four[3].y + four[3].h + (full ? 5 : 6)], noticeY: h - (full ? 16 : 13), w, h};
};
/** their order in the five: neleh, mada, alyi, off (slot 4 = the fifth); in the four: neleh TL, alyi TR, mada BL, off BR */
const FIVE_OF = {neleh: 0, mada: 1, alyi: 2, off: 3} as const;
const FOUR_OF = {neleh: 0, alyi: 1, mada: 2, off: 3} as const;
type Who = keyof typeof FIVE_OF;
const ORDER: Who[] = ['neleh', 'mada', 'alyi', 'off'];

// ------------------------------------------------------------------ 1.G: the neon behind his still tile
/**
 * His tile's hotel room on THEIR side (1.G): the Strip's neon through the glass, CHASING at 1.G's guardrail: every
 * light steps on ONE 8-frame clock (at most 3 steps in any 24 f). The marquee advances one bulb, the floor chase one
 * dot, and the star blinks on every other step. No race car (it was motion noise). `frozen` holds it (his side's plain
 * freeze on "super.": no macroblocks, no warning).
 */
export const vegasNeon = (b0: Buf, x: number, y: number, w: number, h: number, f: number, frozen = false) => {
  const b = clipView(b0, x, y, w, h);
  const s = frozen ? 0 : Math.floor(f / 8);
  rect(x, y, w, h, b.ink(PAL.N1));
  const wx = x + Math.round(w * 0.22), ww = w - Math.round(w * 0.22);
  for (let j = 0; j < h; j++) for (let i = 0; i < ww; i++) b.set(wx + i, y + j, j < h * 0.55 ? (bayer(i, j) < (j / (h * 0.55)) * 0.5 ? PAL.N3 : PAL.N2) : PAL.N1);
  // a tower's lit windows (static)
  // r3: the tower, star and marquee sit clear of his head (his face is at 0.42 w): at 150 px wide the marquee stood
  // straight up out of his hair and read as a red hat on the stills sheet
  const tx = wx + Math.round(ww * 0.66);
  rect(tx, y + 8, 22, h - 8, b.ink(PAL.N0));
  for (let j = 12; j < h - 14; j += 5) for (let i = 3; i < 20; i += 4) if (hash(i, j, 3) < 0.55) b.set(tx + i, y + j, hash(i, j, 4) < 0.5 ? PAL.W6 : PAL.W4);
  // the marquee column: eight bulbs, one lit bulb walks down a step at a time
  const mx = wx + 3;
  rect(mx, y + 4, 9, Math.min(44, h - 8), b.ink(PAL.N0));
  const nb = Math.floor((Math.min(44, h - 8) - 4) / 5);
  for (let j = 0; j < nb; j++) { const lit = (j + s) % nb === 0; rect(mx + 2, y + 7 + j * 5, 5, 3, b.ink(lit ? PAL.P2 : PAL.R3)); rect(mx + 3, y + 8 + j * 5, 3, 1, b.ink(lit ? PAL.W8 : PAL.R1)); }
  // the star: on, on, dim (a blink every third step)
  const star = [[0, -3], [0, -2], [-1, -1], [1, -1], [-3, 0], [-2, 0], [2, 0], [3, 0], [-1, 1], [1, 1], [0, 2], [0, 3], [0, -1], [0, 0], [0, 1], [-1, 0], [1, 0]];
  const on = s % 3 !== 2;
  const sx = wx + Math.round(ww * 0.52), sy = y + 12;
  for (const [i, j] of star) b.set(sx + i, sy + j, on ? (i === 0 && j === 0 ? PAL.W9 : PAL.W7) : PAL.W4);
  // the floor chase: every third dot lit, advancing one dot per step
  const cy = y + Math.round(h * 0.62);
  for (let i = 0; i < ww - 6; i += 3) b.set(wx + 3 + i, cy, (i / 3 + s) % 3 === 0 ? PAL.W8 : PAL.W4);
  rect(wx - 1, y, 2, h, b.ink(PAL.N0)); rect(wx + 1, y, 1, h, b.ink(PAL.R1));
};
/** His tile as their laptop shows it: the neon, MAS small (medium scale, near-front, the one-pixel smile), still. */
export const drawMasTileTheirs = (b0: Buf, x: number, y: number, w: number, h: number, f: number, o: {frozen?: boolean} = {}) => {
  vegasNeon(b0, x, y, w, h, f, o.frozen);
  const img = masMediumBack({...MAS_MEDIUM_DEFAULT, head: 'front', mouth: 'smile', look: 0, arm: 'down', light: 'monitor'});
  const fx = x + Math.round(w * 0.42) - MAS_M_FACE[0], fy = y + Math.round(h * 0.42) - MAS_M_FACE[1];
  blitImg(b0, img, fx, fy, {clip: (px, py) => px >= x && py >= y && px < x + w && py < y + h});
  // one bar of hotel Wi-Fi in the tile's corner (the egg; zero read load)
  for (let i = 0; i < 4; i++) rect(x + w - 16 + i * 3, y + 9 - (i + 1) * 2, 2, (i + 1) * 2, b0.ink(i === 0 ? PAL.P1 : PAL.N3));
};

// ------------------------------------------------------------------ 1.G: the far end one step softer
/** 1.G's P2 CALL: the tile one grid-true step softer (half native resolution, doubled). A 2 x 2 block takes its
 *  top-left pixel, UNLESS the block holds one ISOLATED dark pixel (an eye, a nostril: under half the brightness of
 *  the other three), which then fills the block. a4p5 r2: the top-left alone dropped Neleh's eyes ("her softened face
 *  loses its eyes" on the stills check). Only an isolated pixel counts: a dark LINE (Mada's glasses, a brow) keeps
 *  the top-left rule, or the block row turns into a black bar. No stutter, no wobble: apply it every frame or never. */
export const softTile = (b: Buf, t: TileRect) => {
  for (let y = t.y; y < t.y + t.h; y += 2) for (let x = t.x; x < t.x + t.w; x += 2) {
    const px = [b.get(x, y), b.get(x + 1, y), b.get(x, y + 1), b.get(x + 1, y + 1)];
    const L = px.map(lum);
    let c = px[0];
    const dark = [0, 1, 2, 3].filter((i) => { const others = L.filter((_, j) => j !== i); return L[i] < 0.5 * Math.min(...others); });
    if (dark.length === 1) c = px[dark[0]];
    b.set(x, y, c); b.set(x + 1, y, c); b.set(x, y + 1, c); b.set(x + 1, y + 1, c);
  }
};

/**
 * His side (S1.07, S1.09, S1.12): a board tile drawn through callgrid's drawTile with its VIDEO one step softer and its
 * chrome sharp (r3: softening the whole tile rect blurred the name chips and THE QUIET VOTE's lettering into noise on
 * the stills sheet; the chips and the placeholder text are his app's own UI, drawn at full resolution over the soft
 * picture). Same arguments as drawTile.
 */
export const drawTileSoft = (b: Buf, t: TileState, f: number) => {
  if (t.open !== undefined && t.open < 6) { drawTile(b, t, f); return; }
  // the video only: no chips; the camera-off tile's lettering blanked (a space draws nothing) so no blur is left under it
  drawTile(b, {...t, name: t.id === 'off' ? ' ' : undefined, sub: t.id === 'off' ? ' ' : t.sub, muted: undefined, level: undefined, vote: -1, speaking: false}, f);
  softTile(b, t);
  if (t.id === 'off') {
    const s1 = t.name ?? 'THE QUIET VOTE', sub = t.sub ?? 'camera off';
    text(b, s1, t.x + Math.round((t.w - textWidth(s1)) / 2), t.y + Math.round(t.h / 2) - 8, PAL.G4);
    text(b, sub, t.x + Math.round((t.w - textWidth(sub)) / 2), t.y + Math.round(t.h / 2) + 3, PAL.G2);
  } else if (t.name) nameChip(b, t.x + 2, t.y + t.h - 13, t.name);
  if (t.muted !== undefined || t.level !== undefined) micIcon(b, t.x + t.w - 13, t.y + t.h - 13, {muted: t.muted, level: t.level});
  if (t.vote !== undefined && t.vote >= 0) voteChip(b, t.x + t.w - 12, t.y + 3, t.vote as 0 | 1 | 2 | 3);
  if (t.speaking) speakingRing(b, t);
};

// ------------------------------------------------------------------ the state
export type Fifth =
  | {kind: 'waiting'; k: number}
  | {kind: 'mas'; k: number; frozen?: boolean}
  | {kind: 'rima'; k: number; mouth?: Viseme; lid?: 0 | 1 | 2; hand?: RimaTileHand}
  | null;
export interface BoardCallState {
  /** act frame (drives the loops: footnotes, the spinner, the neon) */
  f: number;
  /** the call's clock in the chrome (their side shows it: 11:59 -> 12:00); null = none */
  clock?: string | null;
  fifth?: Fifth;
  /** frames since his tile was removed (S3.01); undefined = not removed */
  removed?: number;
  /** the audio chip left where his tile was: mic level 0..3 (lit), or greyed */
  audio?: {level: number; greyed?: boolean} | null;
  /** the notice at the call's foot and frames since it started typing */
  notice?: {text: string; k: number} | null;
  mouths?: Partial<Record<'alyi' | 'neleh' | 'rima', Viseme>>;
  speaking?: 'alyi' | 'neleh' | 'rima' | null;
  /** 1.G's softness on the far end's tiles (their side: HIS tile only) */
  softMas?: boolean;
  /** the call's title */
  title?: string;
  /** a4p5 finish (opt-in): ALYI's tile shows the man in his open doorway, lit (cast/alyi-v5 drawAlyiTileFit lit), at every
   *  tile size but the mini, in place of his reflection in the door's glass (his side keeps the reflection) */
  alyiLit?: boolean;
}

const drawBoardTile = (b: Buf, who: Who, t: TileRect, st: BoardCallState) => {
  const f = st.f, m = st.mouths ?? {};
  rect(t.x - 1, t.y - 1, t.w + 2, t.h + 2, b.ink(PAL.N0));
  // a small window (the blog editor's corner, tiles about 60 x 33): the full tile painters crop to a forehead or an
  // empty door top at that size, so the cast's own mini drawings stand in (Mada's spinner kept, small, turning)
  const mini = t.w < 80;
  if (mini && who === 'neleh') drawNelehMini(b, t.x, t.y, t.w, t.h);
  else if (mini && who === 'alyi') drawAlyiMini(b, t.x, t.y, t.w, t.h);
  else if (mini && who === 'mada') { drawMadaMini(b, t.x, t.y, t.w, t.h); drawSpinner(b, t.x + Math.floor(t.w / 2), t.y + 4, f, {size: 'sm', clip: (px, py) => px >= t.x && py >= t.y && px < t.x + t.w && py < t.y + t.h}); }
  else if (who === 'neleh') drawNelehTile(b, t.x, t.y, t.w, t.h, {mouth: m.neleh ?? 'rest', lid: 0, brow: 'level'}, {orbit: f});
  // under 130 px wide v4's tile crops his reflection to the top of his head: the fitted tile centres his face (r3).
  // a4p5 r2: also any tile shorter than 80 px (v4's tile is 86 tall and anchors him at the bottom, so the 2x2 [SCR]
  // layout's 150 x 60 tiles cut him at the eyes)
  else if (who === 'alyi' && st.alyiLit) drawAlyiTileFit(b, t.x, t.y, t.w, t.h, {mouth: m.alyi ?? 'rest', eyes: 'open', t: f}, {lit: true});
  else if (who === 'alyi' && (t.w < 130 || t.h < 80)) drawAlyiTileFit(b, t.x, t.y, t.w, t.h, {mouth: m.alyi ?? 'rest', eyes: 'open', t: f});
  else if (who === 'alyi') drawAlyiTile(b, t.x, t.y, t.w, t.h, {mouth: m.alyi ?? 'rest', eyes: 'open', t: f});
  else if (who === 'mada') drawMadaTile(b, t.x, t.y, t.w, t.h, {mouth: 'rest', lid: 0, nod: 0}, {spin: f});
  else {
    camOffBg(b, t.x, t.y, t.w, t.h);
    const s = 'THE QUIET VOTE', sub = 'camera off';
    if (textWidth(s) + 8 <= t.w) {
      text(b, s, t.x + Math.round((t.w - textWidth(s)) / 2), t.y + Math.round(t.h / 2) - 8, PAL.G4);
      text(b, sub, t.x + Math.round((t.w - textWidth(sub)) / 2), t.y + Math.round(t.h / 2) + 3, PAL.G2);
    } else if (pw(sub) + 6 <= t.w) {
      // a small tile (the blog editor's corner window): the label would spill over the tile's edge, so it keeps only
      // the proportional 'camera off' (the black tile itself is the read)
      pt(b, sub, t.x + Math.round((t.w - pw(sub)) / 2), t.y + Math.round(t.h / 2) - 5, PAL.G3);
    }
  }
  const name = who === 'off' ? '' : who.toUpperCase();
  if (name) nameChip(b, t.x + 2, t.y + t.h - 13, name);
  micIcon(b, t.x + t.w - 13, t.y + t.h - 13, {muted: who === 'off' || who === 'mada', level: st.speaking === who ? 2 : 0});
  voteChip(b, t.x + t.w - 12, t.y + 3, 3);
  if (st.speaking === who) speakingRing(b, t);
};
/** tile opening in 3 held steps (the callgrid rule: a black plate grows from its centre line) */
const opening = (b: Buf, t: TileRect, k: number) => {
  const step = k < 2 ? 0.2 : k < 4 ? 0.55 : 0.85;
  const hh = Math.max(3, Math.round(t.h * step)), yy = t.y + Math.round((t.h - hh) / 2);
  rect(t.x - 1, yy - 1, t.w + 2, hh + 2, b.ink(PAL.N0)); rect(t.x, yy, t.w, hh, b.ink(PAL.N2)); rect(t.x, yy, t.w, 1, b.ink(PAL.N4));
};
const waitingTile = (b: Buf, t: TileRect, k: number, f: number) => {
  rect(t.x - 1, t.y - 1, t.w + 2, t.h + 2, b.ink(PAL.N0));
  rect(t.x, t.y, t.w, t.h, b.ink(PAL.N2));
  for (let j = t.y; j < t.y + t.h; j += 2) for (let i = t.x; i < t.x + t.w; i++) if (bayer(i, j) < 0.06) b.set(i, j, PAL.N3);
  // dashed outline: an empty seat
  for (let i = 0; i < t.w; i += 4) { rect(t.x + i, t.y, 2, 1, b.ink(PAL.N5)); rect(t.x + i, t.y + t.h - 1, 2, 1, b.ink(PAL.N5)); }
  for (let j = 0; j < t.h; j += 4) { rect(t.x, t.y + j, 1, 2, b.ink(PAL.N5)); rect(t.x + t.w - 1, t.y + j, 1, 2, b.ink(PAL.N5)); }
  const lines = t.w >= 130 ? ['Waiting for MAS MANALT', 'to join…'] : pwrap('Waiting for MAS MANALT to join…', t.w - 10);
  const y0 = t.y + Math.round(t.h / 2) - Math.round(lines.length * 10 / 2) - 4;
  lines.forEach((l, i) => pt(b, l, t.x + Math.round((t.w - pw(l)) / 2), y0 + i * 10, PAL.P1));
  typingDots(b, t.x + Math.round(t.w / 2) - 11, y0 + lines.length * 10 + 2, f + k);
};
/** Rima's join: the ring (3 held steps out from the tile), then her spotlit tile */
const rimaTile = (b: Buf, t: TileRect, k: number, m: Viseme, lid: 0 | 1 | 2, hand: RimaTileHand = 'none') => {
  if (k < 0) return;
  if (k < 6) { opening(b, t, k); return; }
  rect(t.x - 1, t.y - 1, t.w + 2, t.h + 2, b.ink(PAL.N0));
  // r3 (STATE-SMALL 8): the tile bust with her smoothing hand (cast/rima-v5.ts); 'none' draws rimaBust as before
  drawRimaTileV5(b, t.x, t.y, t.w, t.h, {mouth: m, lid, hand}, {spot: 1});
  nameChip(b, t.x + 2, t.y + t.h - 13, 'RIMA TAMURI');
  micIcon(b, t.x + t.w - 13, t.y + t.h - 13, {level: m !== 'rest' && m !== 'smile' ? 2 : 0});
  // the join ring: 3 held drawings, stepping out, then gone
  const r = k - 6;
  if (r < 9) { const d = 2 + Math.floor(r / 3) * 2; for (const dd of [d, d + 1]) { rect(t.x - dd, t.y - dd, t.w + 2 * dd, 1, b.ink(PAL.W7)); rect(t.x - dd, t.y + t.h - 1 + dd, t.w + 2 * dd, 1, b.ink(PAL.W7)); rect(t.x - dd, t.y - dd, 1, t.h + 2 * dd, b.ink(PAL.W7)); rect(t.x + t.w - 1 + dd, t.y - dd, 1, t.h + 2 * dd, b.ink(PAL.W7)); } }
};
/** the hard spotlight SEARCH across the grid (k from the join): three held positions, overshoot, back, on her slot.
 *  Outside the circle the call steps down two rungs; once it lands it narrows into her tile (k >= 12) */
const spotSearch = (b: Buf, L: BoardLayout, k: number) => {
  if (k < 0 || k >= 12) return;
  const t = L.five[4];
  const path: Array<[number, number]> = [[-120, -60], [24, 8], [-6, -2], [0, 0]];
  const [ox, oy] = path[Math.min(3, Math.floor(k / 3))];
  const cx = t.x + t.w / 2 + ox, cy = t.y + t.h / 2 + oy, r = t.h * 0.75;
  for (let j = CALL_BAR_H; j < L.h; j++) for (let i = 0; i < L.w; i++) if (Math.hypot(i + 0.5 - cx, (j + 0.5 - cy) * 1.1) > r) b.set(i, j, stepColor(stepColor(b.get(i, j), -1), -1));
};
const audioChip = (b: Buf, x: number, y: number, a: {level: number; greyed?: boolean}) => {
  const s = 'MAS MANALT · audio';
  const w = pw(s) + 26;
  rect(x - 1, y - 1, w + 2, 15, b.ink(PAL.N0));
  rect(x, y, w, 13, b.ink(a.greyed ? PAL.N2 : PAL.N3));
  rect(x, y, w, 1, b.ink(a.greyed ? PAL.N3 : PAL.L2));
  micIcon(b, x + 2, y + 1, {level: a.greyed ? 0 : a.level, col: a.greyed ? PAL.G2 : a.level > 0 ? PAL.L3 : PAL.P1});
  pt(b, s, x + 21, y + 3, a.greyed ? PAL.G3 : PAL.P1);
};
const notice = (b: Buf, L: BoardLayout, s: string, k: number) => {
  if (k < 0) return;
  const shown = s.slice(0, Math.max(0, Math.floor(k * 1.5)));
  const w = Math.min(L.w - 8, pw(s) + 24), x = Math.round((L.w - w) / 2), y = L.noticeY - (k < 3 ? [-6, -3, -1][k] : 0);
  rect(x, y, w, 13, b.ink(PAL.N0)); rect(x + 1, y + 1, w - 2, 11, b.ink(PAL.N3)); rect(x + 1, y + 1, w - 2, 1, b.ink(PAL.N5));
  noticeIcon(b, x + 2, y + 2, 'leave'); // a4p5 finish: the filled door with its arrow (callgrid), not the 3 px outline
  pt(b, shown, x + 15, y + 3, PAL.P1);
};

/** The whole call as the board's laptops show it, into `b` (its own size is the layout). */
export const drawBoardCall = (b: Buf, st: BoardCallState) => {
  const L = boardLayout(b.w, b.h);
  callChrome(b, {title: st.title ?? 'board sync', clock: st.clock ?? null, controls: false});
  const removed = st.removed;
  const fifth = st.fifth === undefined ? null : st.fifth;
  // tile rects: the five while a fifth tile exists (or before the removal), the reflow to the four after it
  const rects: Record<Who, TileRect> = {} as Record<Who, TileRect>;
  for (const w of ORDER) rects[w] = L.five[FIVE_OF[w]];
  if (removed !== undefined && !(fifth && fifth.kind === 'rima')) {
    const from = ORDER.map((w) => L.five[FIVE_OF[w]]), to = ORDER.map((w) => L.four[FOUR_OF[w]]);
    const now = slideTiles(from, to, removed, 4, 8);
    ORDER.forEach((w, i) => (rects[w] = now[i]));
  }
  for (const w of ORDER) drawBoardTile(b, w, rects[w], st);
  const t5 = L.five[4];
  if (fifth && (removed === undefined || fifth.kind === 'rima')) {
    if (fifth.kind === 'waiting') waitingTile(b, t5, fifth.k, st.f);
    else if (fifth.kind === 'mas') {
      if (fifth.k < 6) opening(b, t5, fifth.k);
      else {
        rect(t5.x - 1, t5.y - 1, t5.w + 2, t5.h + 2, b.ink(PAL.N0));
        drawMasTileTheirs(b, t5.x, t5.y, t5.w, t5.h, st.f, {frozen: fifth.frozen});
        if (st.softMas) softTile(b, t5);
        nameChip(b, t5.x + 2, t5.y + t5.h - 13, 'MAS MANALT');
        micIcon(b, t5.x + t5.w - 13, t5.y + t5.h - 13, {muted: false, level: 0});
      }
    } else {
      rimaTile(b, t5, fifth.k, fifth.mouth ?? 'rest', fifth.lid ?? 0, fifth.hand ?? 'none');
      spotSearch(b, L, fifth.k - 6);
      if (st.speaking === 'rima' && fifth.k >= 6) speakingRing(b, t5);
    }
  }
  if (st.audio && (removed === undefined || removed >= 10)) audioChip(b, L.chip[0], L.chip[1], st.audio);
  if (st.notice) notice(b, L, st.notice.text, st.notice.k);
  void CALL_GREY;
};
export const BOARD_NOTICE = {removed: 'MAS MANALT was removed from the meeting.'};
