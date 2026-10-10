// MR. MAS — Ep2 v1 · act4 · sc 18 PRESENT: MISANTHROPIC'S LIGHTHOUSE (May 28, the same morning; the split's right pane).
// The shots pass, 2026-10-09. The room is Ep1's lighthouse (rooms/lighthouse, imported read-only) with the art pass's
// sc 18 additions (art/sets/committee: lighthouse18, the CLOD case, the lanyard; imported) and what the shots need:
//   lightW(b, f, st)        [W] 18.01: the lighthouse, the beacon already turning; EKIEL climbing the stair of bound
//                           drafts with the box he walked out with (st.step on the stair), ADELINA at the top raising a
//                           lanyard (st.adel), MARIO at his desk; st.sweep: the beacon's beam sweeping the frame (18.02)
//   stairPane(b, f, st)     the split's right pane (18.07): Adelina dropping her lanyard over Ekiel (st.drop 0..3: in her
//                           raised hand, falling, round his neck), printed on page 212 of a Mario draft
//   mario2S(b, f, st)       [2S] 18.08-18.11 (the right pane): MARIO at his desk by the lamp (his conversation portrait,
//                           turned to Ekiel), writing; EKIEL in front of him in his new lanyard (art/cast/ekiel bust,
//                           turned to Mario); both lip-synced
//   pagesInsert(b, f, st)   [ECU] 18.12: the four pages, the one line highlighted in yellow (Ekiel's own), Mario's pen
//                           running its underline under `inherently` on the word (st.under 0..1)
//   clodClose(b, f, st)     [M] 18.13's head: the glass case of CLOD boxes, the beacon glinting across them box by box;
//                           the last box's art the Golden Gate Bridge (never named)
//   marioMCU(b, f, st)      [MCU] 18.13 / 18.14: Mario, finger rising, his pen (st.pen 'up' | 'down'); by the lamp the
//                           op-ed clipping, byline NELEH & THE QUIET VOTE (an egg, not held for reading, 18.14)
//   scrollDrop(b, f, st)    18.13: the brief document drops the whole stairwell: the pane pans with it down the spiral
//                           past every landing to the bottom (st.t 0..1) and back up (st.back 0..1)
//   ekielSquint(b, f, st)   [MCU] 18.13: Ekiel squinting after it, lip-synced
// Every right-pane drawing is composed round x 240 in a full frame (the split shows x 121..358).
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import {STAIR_STEPS, LIGHTHOUSE} from '../../../../../shared/pixel/rooms/lighthouse';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT} from '../../../../../shared/pixel/cast/adelina';
import {marioPortraitImg} from '../../../../../shared/pixel/cast/mario';
import type {MarioPortrait} from '../../../../../shared/pixel/cast/mario';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {lighthouse18, lanyard} from '../../art/sets/committee';
import {drawEkielRoom, ekielBust} from '../../art/cast/ekiel';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, glow, mirror, putBustSoft} from './common';

/** the right pane's crop (the split shows x 121..358 of a right-pane drawing) */
export const SXR = 121;

// ================================================================== the lighthouse, wide
/** the step Adelina stands on (the highest that keeps her whole in frame, as the art's still) */
/** Adelina's step: high on the stair at the frame's right (step 14: her head clears the frame's top), so Ekiel can climb
 *  the treads that show (9..12: steps 1..8 run behind the CLOD case and the desk's clutter) */
export const ADEL_STEP = 14;
/** Adelina at her step, flipped to face down the stair; her near arm reaching with a lanyard ('reach') or down */
const adelinaAt = (b: Buf, arm: 'reach' | 'down', lan: 'raise' | 'none') => {
  const s = STAIR_STEPS[ADEL_STEP];
  drawAdelinaRoom(b, s[0] - 4, s[1] + 2, {...ADELINA_ROOM_DEFAULT, arm}, {flip: true});
  if (lan === 'raise') lanyard(b, s[0] - 30, s[1] - 52, {page212: true});
};
/** the beacon's beam sweeping the frame: a broad soft wedge from the lamp, its far end at x `bx` (the band walks
 *  across in held steps) */
const beamSweep = (b: Buf, bx: number) => {
  const {cx, cy} = LIGHTHOUSE.lamp;
  for (let y = cy; y < RH; y++) {
    const t = (y - cy) / (RH - cy), mid = cx + (bx - cx) * t, half = 4 + t * 34;
    for (let x = Math.floor(mid - half); x <= mid + half; x++) {
      if (x < 0 || x >= W) continue;
      const a = 1 - Math.abs(x - mid) / half;
      if (bayer(x, y) < a * 0.7) b.set(x, y, stepColor(b.get(x, y), a > 0.6 ? 2 : 1));
    }
  }
};
export interface LightSt {
  /** Ekiel's step on the stair (null: not on it) */
  step?: number | null;
  /** Ekiel's legs (the climb's alternate drawings) */
  stride?: 0 | 1;
  /** Adelina: 'raise' (the lanyard up) or 'wait' */
  adel?: 'raise' | 'wait';
  /** the beacon's beam sweeping the frame (its far end's x) */
  sweep?: number;
}
/** Ekiel's climb in 18.01: the lowest treads at the frame's left (steps 1..4 are in front of the desk's clutter) */
export const CLIMB = [9, 10, 11];
export const lightW = (b: Buf, f: number, st: LightSt = {}) => {
  lighthouse18(b, f, {ekiel: null, adelina: null, mario: true});
  if (st.step !== null && st.step !== undefined) {
    const s = STAIR_STEPS[clamp(st.step, 0, STAIR_STEPS.length - 1)];
    drawEkielRoom(b, s[0], s[1], {state: 'climb', legs: st.stride ? 'w1' : 'w3'});
  }
  adelinaAt(b, st.adel === 'raise' ? 'reach' : 'down', st.adel === 'raise' ? 'raise' : 'none');
  if (st.sweep !== undefined) beamSweep(b, st.sweep);
};
/** the right pane at room scale (18.07): Ekiel arrived two steps below Adelina; she drops her lanyard over his head
 *  (drop 0 in her raised hand · 1 falling · 2 round his neck: his own lanyard drawing, the card printed on page 212) */
export const stairPane = (b: Buf, f: number, st: {drop: 0 | 1 | 2}) => {
  lighthouse18(b, f, {ekiel: null, adelina: null, mario: true});
  const s = STAIR_STEPS[ADEL_STEP - 2];
  drawEkielRoom(b, s[0], s[1], {state: 'stand', lanyard: 'none'});
  // round his neck: the lanyard printed on page 212 of a Mario draft (the art's card, its 212 legible)
  if (st.drop >= 2) lanyard(b, s[0] - 6, s[1] - 66, {page212: true});
  if (st.drop === 0) adelinaAt(b, 'reach', 'raise');
  else {
    adelinaAt(b, st.drop === 1 ? 'reach' : 'down', 'none');
    if (st.drop === 1) { const a = STAIR_STEPS[ADEL_STEP]; lanyard(b, Math.round((a[0] - 30 + s[0] - 6) / 2), Math.round((a[1] - 52 + s[1] - 82) / 2), {page212: true}); }
  }
};

// ================================================================== the 2S at Mario's desk
/** the lighthouse behind a close shot: its brick wall bowed and soft, the desk lamp's warm pool, the stair's treads
 *  dim behind, cached */
let WALL: Buf | null = null;
const wallSoft = () => {
  if (WALL) return WALL;
  const t = new Buf(W, 270, PAL.N0);
  lighthouse18(t, 0, {ekiel: null, adelina: null, mario: false});
  const b = new Buf(W, RH, PAL.N0);
  // a 2x push into the wall behind the desk (x 120..360, y 40..141), two rungs down: out of focus behind them
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const sx = clamp(Math.round(120 + x / 2), 0, W - 1), sy = clamp(Math.round(30 + y / 2), 0, RH - 1);
    b.set(x, y, stepColor(t.get(sx, sy), -2));
  }
  WALL = b;
  return b;
};
const deskTop = (b: Buf, y0: number) => {
  for (let y = y0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, y === y0 ? PAL.D4 : (x * 3 + y * 7) % 53 < 2 ? PAL.D2 : PAL.D3);
};
/** the brass desk lamp (its shade, the bulb's glow) and its pool on the desk */
const deskLamp = (b: Buf, x: number, y: number) => {
  fill(b, x - 2, y - 40, 3, 40, PAL.W3); fill(b, x - 1, y - 40, 1, 40, PAL.W5);
  poly([x - 16, y - 40, x + 14, y - 40, x + 8, y - 54, x - 10, y - 54], b.ink(PAL.W3));
  fill(b, x - 9, y - 54, 18, 2, PAL.W5); fill(b, x - 14, y - 41, 28, 1, PAL.W8);
  fill(b, x - 8, y - 2, 16, 3, PAL.W3); fill(b, x - 8, y - 2, 16, 1, PAL.W5);
};
/** Mario's portrait (Ep1's conversation drawing), MIRRORED to face screen-left (Ekiel is on his left, the stair side).
 *  finger 0 is Ep1's lowered finger, which still stands up into the frame's foot as a stub: here it is removed (the
 *  pixels where the finger-0 drawing differs from the finger-1 and finger-2 drawings take whichever of them is not
 *  skin: the fleece behind the finger), so a Mario who is writing has no finger raised */
const FINGERLESS = new Map<string, ReturnType<typeof marioPortraitImg>>();
const marioImg2 = (s: MarioPortrait) => {
  if (s.finger !== 0) return mirror(marioPortraitImg(s));
  const key = JSON.stringify(s); const hit = FINGERLESS.get(key); if (hit) return hit;
  const m = mirror(marioPortraitImg(s));
  const skin = (v: number) => { const fm = v >= 0 ? familyOf(v) : null; return !!fm && (fm[0] === 'S' || fm[0] === 'X' || fm[0] === 'K'); };
  // the lowered finger stands at the image's lower left once mirrored (x 8..34, below the chin line): each row's skin
  // pixels there take the fleece colour beside them (the nearest non-skin pixel to the right, else to the left)
  const c = m.c.slice();
  for (let y = Math.round(m.h * 0.62); y < m.h; y++) for (let x = 6; x < 36; x++) {
    const i = y * m.w + x;
    if (!skin(c[i])) continue;
    let r = x + 1; while (r < m.w && skin(m.c[y * m.w + r])) r++;
    let l = x - 1; while (l >= 0 && skin(m.c[y * m.w + l])) l--;
    const pick = r < m.w && m.c[y * m.w + r] >= 0 ? m.c[y * m.w + r] : l >= 0 ? m.c[y * m.w + l] : -1;
    c[i] = pick;
  }
  const out = {...m, c};
  FINGERLESS.set(key, out);
  return out;
};
/** viseme -> Mario's portrait mouths (0 rest, 1 small, 2 open, 3 round) */
export const marioMouth = (v: string): 0 | 1 | 2 | 3 => (v === 'A' ? 2 : v === 'O' ? 3 : v === 'E' || v === 'M' ? 1 : 0);
export interface Mario2SSt { mario?: Partial<MarioPortrait>; ekiel?: {mouth?: Viseme; expr?: 'squint' | 'worry' | 'neutral'}; write?: number; pages?: boolean }
export const mario2S = (b: Buf, f: number, st: Mario2SSt = {}) => {
  b.c.set(wallSoft().c.subarray(0, W * RH));
  glow(b, 300, 120, 120, 90, 1);
  // EKIEL at the pane's left, standing in front of the desk, turned to Mario (his bust mirrored), the committee
  // lanyard on him
  const ek = mirror(ekielBust({mouth: st.ekiel?.mouth ?? 'rest', expr: st.ekiel?.expr ?? 'squint', lanyard: 'committee'}));
  putBustSoft(b, ek, 116, 52, RH, false);
  // the desk across the frame's foot on Mario's side, his pages on it, the lamp
  deskTop(b, 168);
  deskLamp(b, 352, 168);
  glow(b, 330, 168, 80, 40, 1);
  // MARIO seated behind it, turned to Ekiel, writing (his pen hand on the page: the finger drawing's hand down out of
  // frame, a pen moving on the page instead)
  const m = marioImg2({mouth: 0, blink: 0, brow: 0, finger: 0, nod: 0, ...st.mario});
  blitImg(b, m, 236, 44, {clip: (_x, y) => y < 168});
  // the four pages fanned on the desk under his hand, his ink-blue pen
  for (let k = 0; k < 4; k++) { const px = 248 + k * 12, py = 174 - k * 2; fill(b, px, py, 40, 26, PAL.P2); fill(b, px, py, 40, 1, PAL.W9); for (let r = 0; r < 3; r++) fill(b, px + 4, py + 5 + r * 5, 30 - r * 4, 1, r === 1 && k === 3 ? PAL.W7 : PAL.G5); }
  if (st.write !== undefined) {
    // his pen moving across the page (held from below the frame's foot: the pen's barrel and its nib)
    const nx = 286 + (Math.floor(st.write) % 5) * 5, ny = 182 - (Math.floor(st.write) % 2);
    for (let i = 0; i < 2; i++) line(nx + i, ny, nx + 14 + i, RH + 2, b.ink(i ? PAL.N1 : PAL.I0));
    b.set(nx, ny, PAL.W6); fill(b, nx - 6, ny + 1, 7, 1, PAL.I0);
  }
  void f;
};

// ================================================================== 18.12: the pages
/** [ECU] the four pages fanned on the desk (art/sets/committee pagesECU, copied: its underline found the line it's on),
 *  the one line highlighted in yellow, Ekiel's own; Mario's ink notes in the margin; his pen (`under` 0..1) runs the
 *  underline under `inherently` on the word */
export const pagesInsert = (b: Buf, f: number, st: {under?: number} = {}) => {
  vramp(b, 0, 0, W, RH, [PAL.D2, PAL.D3, PAL.D2]);
  for (let k = 0; k < 4; k++) { const x = 30 + k * 18, y = 20 + k * 6; fill(b, x + 4, y + 4, 300, 168, PAL.D1); fill(b, x, y, 300, 168, PAL.P2); fill(b, x, y, 300, 1, PAL.W9); }
  const x = 84, y = 38;
  for (let r = 0; r < 12; r++) { if (r >= 5 && r <= 6) continue; fill(b, x + 8, y + 10 + r * 11, 240 - (r * 17) % 60, 2, PAL.G4); }
  const s = 'Building smarter-than-human machines is an inherently dangerous endeavor.';
  const lines = pwrap(s, 270);
  lines.forEach((l, i) => { fill(b, x + 4, y + 62 + i * 11, pw(l) + 8, 11, PAL.W7); pt(b, l, x + 8, y + 64 + i * 11, PAL.N1); });
  for (let r = 0; r < 5; r++) fill(b, x + 268, y + 20 + r * 9, 14 + (r * 7) % 12, 2, PAL.I0);
  // the underline: under `inherently` (whichever line it is on), drawn as the pen runs along it
  const li = lines.findIndex((l) => l.includes('inherently'));
  const u = clamp(st.under ?? 0, 0, 1);
  let nib: [number, number] = [x + 200, y + 120];
  if (li >= 0) {
    const ux = x + 8 + pw(lines[li].slice(0, lines[li].indexOf('inherently'))), uw = pw('inherently'), uy = y + 62 + li * 11 + 11;
    const n = Math.round(uw * u);
    fill(b, ux, uy, n, 1, PAL.I0); if (n > 2) fill(b, ux + 1, uy + 1, n - 2, 1, PAL.I0);
    nib = [ux + Math.max(0, n - 1), uy + 1];
    if (u <= 0) nib = [ux - 4, uy + 3];
  }
  // his hand and pen (from the lower right: the ink-blue fleece cuff), the nib on the line
  const h = placeHand(POSES.grip([-0.55, -0.7, -0.45], [0.25, -0.45, 0.85], 'R', 0.75), {s: 4.6, at: [nib[0] + 18, nib[1] + 26], anchor: 'thumb', light: 'lobby', cuffRamp: [PAL.N0, PAL.I0, PAL.F1, PAL.F2, PAL.F3, PAL.F3, PAL.F4]});
  sleeve(b, h.cuffEnd, [h.cuffEnd[0] + 180, h.cuffEnd[1] + 120], 22, 30, [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4]);
  // the pen: from the nib up through his fingers
  line(nib[0], nib[1], nib[0] + 22, nib[1] + 24, b.ink(PAL.N1)); line(nib[0] + 1, nib[1], nib[0] + 23, nib[1] + 24, b.ink(PAL.I0)); b.set(nib[0], nib[1], PAL.W6);
  drawHand(b, h.hand, h.x, h.y);
  void f;
};

// ================================================================== 18.13: the CLOD case, the scroll
/** [M] the glass case of CLOD boxes close (six boxes on two shelves behind glass; the last box's art a red suspension
 *  bridge over a blue bay, never named); the beacon's light glinting across them box by box (`glint` index) */
export const clodClose = (b: Buf, f: number, st: {glint?: number} = {}) => {
  b.c.set(wallSoft().c.subarray(0, W * RH));
  const X = 150, Y = 34, bw = 52, bh = 54, gap = 10;
  fill(b, X - 8, Y - 8, 3 * bw + 2 * gap + 16, 2 * bh + gap + 16, PAL.D1);
  fill(b, X - 4, Y - 4, 3 * bw + 2 * gap + 8, 2 * bh + gap + 8, PAL.N1);
  for (let k = 0; k < 6; k++) {
    const bx = X + (k % 3) * (bw + gap), by = Y + Math.floor(k / 3) * (bh + gap);
    fill(b, bx, by, bw, bh, PAL.W5); fill(b, bx, by, bw, 3, PAL.W7); fill(b, bx + bw - 3, by, 3, bh, PAL.W3);
    fill(b, bx + 5, by + 9, bw - 13, bh - 22, PAL.W3);
    if (k === 5) {
      // the bridge: a red suspension span over a blue bay, two towers, the cable's sag
      const ax = bx + 5, ay = by + 9, aw = bw - 13, ah = bh - 22;
      fill(b, ax, ay, aw, ah, PAL.C5); fill(b, ax, ay + ah - 9, aw, 9, PAL.C3);
      for (const tx of [ax + 10, ax + aw - 11]) fill(b, tx, ay + 4, 3, ah - 8, PAL.R2);
      for (let i = 0; i < aw; i++) { const sag = Math.round(Math.abs(i - (aw >> 1)) ** 2 / ((aw >> 1) ** 2) * 9); b.set(ax + i, ay + 6 + (9 - sag), PAL.R3); }
      fill(b, ax, ay + ah - 11, aw, 2, PAL.R1);
    } else {
      const cx = bx + 20, cy = by + 26;
      ellipse(cx, cy, 10, 10, b.ink(PAL.W6)); b.set(cx - 3, cy - 2, PAL.N1); b.set(cx + 3, cy - 2, PAL.N1); fill(b, cx - 3, cy + 4, 7, 1, PAL.D2);
    }
    fill(b, bx + 6, by + bh - 9, bw - 16, 3, PAL.D2);
    if (k === st.glint) {
      // the glint: the beacon's light across the box's lid and the glass in front of it
      for (let i = 0; i < 14; i++) { b.set(bx + bw - 14 + i, by + 2 + (i >> 1), PAL.W9); b.set(bx + bw - 15 + i, by + 3 + (i >> 1), PAL.W8); }
      glow(b, bx + bw / 2, by + bh / 2, bw * 0.7, bh * 0.7, 1);
    }
  }
  // the glass's own sheen (two diagonal streaks)
  for (let i = 0; i < 70; i++) { const x0 = X + 30 + i, y0 = Y - 2 + i * 1.5; if (y0 < Y + 2 * bh + gap && bayer(x0, Math.round(y0)) < 0.35) b.set(x0, Math.round(y0), stepColor(b.get(x0, Math.round(y0)), 1)); }
  void f;
};
/** [MCU] Mario at his desk by the lamp (his portrait mirrored, turned to Ekiel), finger `finger`; his pen in his other
 *  hand on the desk (`pen` 'up' in his fingers, 'down' set on the pages); the op-ed clipping by the lamp: its byline
 *  NELEH & THE QUIET VOTE (an egg) */
export const marioMCU = (b: Buf, f: number, st: {mouth?: 0 | 1 | 2 | 3; finger?: 0 | 1 | 2; pen?: 'up' | 'down'; brow?: 0 | 1}) => {
  b.c.set(wallSoft().c.subarray(0, W * RH));
  glow(b, 250, 100, 140, 110, 1);
  deskTop(b, 166);
  deskLamp(b, 344, 166);
  glow(b, 330, 170, 70, 30, 1);
  const m = marioImg2({mouth: st.mouth ?? 0, blink: 0, brow: st.brow ?? 0, finger: st.finger ?? 1, nod: 0});
  blitImg(b, m, 184, 34, {clip: (_x, y) => y < 166});
  // the clipping: newsprint, a headline bar, the byline legible, two columns of type, a small photo
  const cx = 126, cy = 170;
  fill(b, cx + 2, cy + 2, 118, 32, PAL.D1); fill(b, cx, cy, 118, 32, PAL.P0); fill(b, cx, cy, 118, 1, PAL.P1);
  fill(b, cx + 4, cy + 3, 80, 3, PAL.N2);
  tiny(b, 'NELEH & THE QUIET VOTE', cx + 4, cy + 9, PAL.N1);
  for (let r = 0; r < 3; r++) { fill(b, cx + 4, cy + 18 + r * 4, 46, 1, PAL.G4); fill(b, cx + 54, cy + 18 + r * 4, 30, 1, PAL.G4); }
  fill(b, cx + 90, cy + 16, 22, 13, PAL.G4); fill(b, cx + 92, cy + 18, 18, 9, PAL.G3);
  // the pages and the pen
  fill(b, 252, 172, 60, 24, PAL.P2); fill(b, 252, 172, 60, 1, PAL.W9); for (let r = 0; r < 3; r++) fill(b, 256, 177 + r * 5, 48 - r * 6, 1, PAL.G5);
  if (st.pen === 'down') { line(262, 186, 300, 182, b.ink(PAL.I0)); line(262, 187, 300, 183, b.ink(PAL.N1)); }
  void f;
};
/** the stairwell as one tall strip (cached): the round brick wall, the stair of bound drafts spiralling down past a
 *  landing every 70 px, the floor at the bottom. Height 560; the pane looks at a 203-high window into it */
const STRIP_H = 560;
let STRIP: Buf | null = null;
const strip = () => {
  if (STRIP) return STRIP;
  const b = new Buf(W, STRIP_H, PAL.N0);
  for (let y = 0; y < STRIP_H; y++) for (let x = 0; x < W; x++) {
    // bricks bowed round the tower (wider courses at the middle), lit from the lamp above: darker going down
    const bow = Math.round(Math.pow((x - 240) / 240, 2) * 6);
    const course = Math.floor((y + bow) / 7), off = course % 2 ? 6 : 0;
    const mortar = (y + bow) % 7 === 0 || (x + off) % 13 === 0;
    const depth = y / STRIP_H, edge = Math.abs(x - 240) / 240;
    let c = mortar ? PAL.N1 : (hash(Math.floor((x + off) / 13), course, 5) < 0.3 ? PAL.D2 : PAL.D3);
    if (!mortar && depth + edge * 0.5 > 0.55 && bayer(x, y) < depth) c = stepColor(c, -1);
    b.set(x, y, c);
  }
  // the treads: bound drafts stacked as steps, spiralling: a run going right, a landing, a run going left...
  for (let i = 0; i < 40; i++) {
    const run = Math.floor(i / 5), dir = run % 2 ? -1 : 1, j = i % 5;
    const x = 240 + dir * (-80 + j * 40), y = 40 + i * 13 + run * 6;
    const cov = [PAL.F2, PAL.D3, PAL.N4, PAL.F3, PAL.G3, PAL.U2][i % 6];
    fill(b, x - 18, y, 36, 9, cov); fill(b, x - 18, y, 36, 1, stepColor(cov, 1)); for (let r = 2; r < 9; r += 2) fill(b, x - 16, y + r, 32, 1, PAL.P1);
    fill(b, x - 18, y + 9, 36, 2, PAL.N0);
    if (j === 4) { fill(b, x - 30 + (dir > 0 ? 18 : -18), y + 6, 60, 6, PAL.D2); fill(b, x - 30 + (dir > 0 ? 18 : -18), y + 6, 60, 1, PAL.D4); }
  }
  // the floor at the bottom: boards, paper stacks
  for (let y = STRIP_H - 40; y < STRIP_H; y++) for (let x = 0; x < W; x++) b.set(x, y, y === STRIP_H - 40 ? PAL.D4 : (x * 3 + y) % 41 < 2 ? PAL.D1 : PAL.D2);
  for (let k = 0; k < 7; k++) { const sx = 40 + k * 64, sh = 10 + (k * 7) % 14; for (let r = 0; r < sh; r += 3) fill(b, sx, STRIP_H - 40 - r - 3, 34, 3, r % 6 ? PAL.P1 : PAL.P2); }
  STRIP = b;
  return b;
};
/** 18.13: the scroll dropped from the desk falls the whole stairwell; the pane looks at the strip from `cam` (0 = the
 *  top, 1 = the bottom), the scroll's leading edge at `edge` (strip px); it unrolls behind itself, its lines of text
 *  (grey bars, nothing legible) streaming past every landing */
export const scrollDrop = (b: Buf, f: number, st: {cam: number; edge: number}) => {
  const S = strip(), oy = Math.round(clamp(st.cam, 0, 1) * (STRIP_H - RH));
  for (let y = 0; y < RH; y++) b.c.set(S.c.subarray((y + oy) * W, (y + oy + 1) * W), y * W);
  // the scroll: a paper ribbon down the middle of the well from above the frame to its leading edge, a roll at its end
  const sx = 232, top = -oy, end = Math.min(STRIP_H - 44, st.edge) - oy;
  for (let y = Math.max(0, top); y < Math.min(RH, end); y++) {
    const wob = Math.round(Math.sin((y + oy) / 23) * 3);
    fill(b, sx + wob, y, 22, 1, (y + oy) % 9 === 0 ? PAL.P1 : PAL.P2);
    if ((y + oy) % 5 === 0) fill(b, sx + wob + 4, y, 10 + ((y + oy) % 7), 1, PAL.G5);
    b.set(sx + wob - 1, y, PAL.G4); b.set(sx + wob + 22, y, PAL.G3);
  }
  if (end >= 0 && end < RH + 10) { ellipse(sx + 11, end, 13, 5, (x, y) => { if (y >= 0 && y < RH) b.set(x, y, PAL.P2); }); fill(b, sx - 2, end - 1, 26, 2, PAL.G5); }
  // once it has landed: the paper piling in folds at the bottom
  if (st.edge >= STRIP_H - 44) { const by = STRIP_H - 44 - oy; for (let k = 0; k < 5; k++) { const w = 30 + k * 8; fill(b, 243 - w / 2, by - k * 3, w, 3, k % 2 ? PAL.P1 : PAL.P2); } }
  void f;
};
/** [MCU] Ekiel squinting after it (his bust mirrored, turned to Mario's side), lip-synced, the stair soft behind */
export const ekielSquint = (b: Buf, f: number, st: {mouth?: Viseme; expr?: 'squint' | 'worry' | 'neutral'}) => {
  b.c.set(wallSoft().c.subarray(0, W * RH));
  const ek = mirror(ekielBust({mouth: st.mouth ?? 'rest', expr: st.expr ?? 'squint', lanyard: 'committee'}));
  putBustSoft(b, ek, 178, 36, RH, false);
  void f;
};
void rect; void poly; void familyOf; void bpt; void bpw; void tinyWidth; void hash; void pw;
