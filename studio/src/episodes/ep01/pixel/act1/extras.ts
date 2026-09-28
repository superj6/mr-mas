// MR. MAS — Ep1 pixel v3, ACT ONE (the `v3-shots-act1` pass, 2026-09-27): the small additive drawings and compositions
// the act's layouts need that the art passes' modules don't expose as one call. NEW file, namespaced to act1: nothing
// here edits a drawing. Each helper either composes exported art pieces (rooms/bullpen-launch, rooms/lobby-deal, the
// cast rigs) with a parameter the packaged setup fixes (a camera x, a mouth, a lifted prop), or adds a few pixels of
// idle life (a sleep LED, a passer-by, a scrolling phone page). All whole-pixel, master palette, pure in (k, f).
//
//   cursorPath(k, k0, k1, from, to)      the cursor's drift, held on 2s, easing into its park
//   sleepLed(fb, f)                      5.01: his closed laptop's sleep LED breathing (held steps)
//   fingerECU(fb, press, dx, dy)         5.08: the ECU button with his finger offset (the approach in held steps)
//   otsRima(fb, f, st)                   5.04: drawLaunchOTSRima re-composed (its v3.1 warm key kept) with his desk's
//                                        edge and the button lifted clear of the V.O. rows
//   glassCount(fb, f, st)                5.09: drawLaunchGlass's composite with Mas's and Alyi's mouths and the v3.1
//                                        rack to the glass in held steps (st.rack 0..2)
//   deal2S(fb, f, st)                    9.06 / 9.09: drawDeal2S with the pan, Tasya's x and Gerg's spot as parameters
//   passerBy(fb, f, x, y, bg)            9.10: an employee crossing the check (Gerg's walk, recoloured), behind the cast
//   guestCard(fb, x, y)                  8.05: the GUEST card on a lanyard, legible
//   bottomShade(fb, y0, n)               a lighting note: the frame's foot a rung or two darker (the V.O. rows on shadow)
import {Buf, rect, line, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../shared/pixel/palette';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {launchBackM, putBust, otsShoulder, drawCursor} from '../../../../shared/pixel/rooms/bullpen-launch';
import {faceKey} from '../../../../shared/pixel/kits/face-light';
import type {LaunchMState} from '../../../../shared/pixel/rooms/bullpen-launch';
import {drawButtonECU, drawBeigeButton} from '../../../../shared/pixel/kits/launch-button';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {rimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/rima-speak';
import type {RimaPortraitState} from '../../../../shared/pixel/cast/rima-speak';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../../../../shared/pixel/cast/rima-stand';
import type {RimaStandPose} from '../../../../shared/pixel/cast/rima-stand';
import {drawDealWide} from '../../../../shared/pixel/rooms/lobby-deal';
import type {DealWideState} from '../../../../shared/pixel/rooms/lobby-deal';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../shared/pixel/cast/mas-medium';
import type {MasMediumState} from '../../../../shared/pixel/cast/mas-medium';
import {drawCollarsMedium} from '../../../../shared/pixel/cast/mas-collars';
import {drawTasyaMedium} from '../../../../shared/pixel/cast/tasya-medium';
import type {TasyaMediumState} from '../../../../shared/pixel/cast/tasya-medium';
import {drawGergStand, GERG_STAND_DEFAULT, gergWalkAt} from '../../../../shared/pixel/cast/gerg-stand';
import type {TvState} from '../../../../shared/pixel/kits/tv-news';
import {pt, pwrap, RH} from '../kit';

// ------------------------------------------------------------------ small clocks
/** a blink on a long loop: 1 (half), 2 (shut), 1, each held 2 frames (the show's minimum hold), else 0 */
export const blinkLid = (k: number, seed: number, period = 97): 0 | 1 | 2 => {
  const p = (((k + seed * 37) % period) + period) % period;
  return p < 2 ? 1 : p < 4 ? 2 : p < 6 ? 1 : 0;
};
/** a whole-pixel ease from a to b between frames k0 and k1, held on 2s */
export const ease2 = (k: number, k0: number, k1: number, a: number, b: number) => {
  const kk = k - (k % 2);
  const t = clamp((kk - k0) / Math.max(1, k1 - k0), 0, 1), e = 1 - (1 - t) * (1 - t);
  return Math.round(a + (b - a) * e);
};
export const cursorPath = (k: number, k0: number, k1: number, from: [number, number], to: [number, number]): [number, number] =>
  [ease2(k, k0, k1, from[0], to[0]), ease2(k, k0, k1, from[1], to[1])];

// ------------------------------------------------------------------ 5.01: his closed laptop, asleep
/** the sleep LED on the laptop's front edge in the button ECU (drawButtonECU's corner, x 380-480): breathing in held
 *  steps on a 2.7 s loop */
export const sleepLed = (fb: Buf, f: number) => {
  const p = Math.floor(f / 8) % 8;
  const c = [PAL.C1, PAL.C2, PAL.C4, PAL.C6, PAL.C7, PAL.C6, PAL.C4, PAL.C2][p];
  const x = 452, y = 27;
  fb.set(x, y, c); fb.set(x + 1, y, c);
  if (p >= 3 && p <= 5) { fb.set(x - 1, y, stepColor(fb.get(x - 1, y), 1)); fb.set(x + 2, y, stepColor(fb.get(x + 2, y), 1)); }
};

// ------------------------------------------------------------------ 5.08: the finger's approach
const ECU_BASE = new Map<string, Buf>();
const ecuOf = (key: string, draw: (b: Buf) => void) => { let b = ECU_BASE.get(key); if (!b) { b = new Buf(480, 270, PAL.N0); draw(b); ECU_BASE.set(key, b); } return b; };
/** the button ECU (press 0 up · 1 touching · 2 the click), his hand offset by (dx, dy) whole pixels: the hand is the
 *  difference between the kit's drawing with the finger and without it, so its pixels are the kit's own */
export const fingerECU = (fb: Buf, press: 0 | 1 | 2, dx: number, dy: number, lit: boolean) => {
  const bare = ecuOf(`bare${lit ? 1 : 0}${press === 2 ? 2 : 0}`, (b) => drawButtonECU(b, 0, {press: press === 2 ? 2 : 0, lit}));
  const hand = ecuOf(`hand${press}${lit ? 1 : 0}`, (b) => drawButtonECU(b, 0, {press, lit, finger: true}));
  fb.c.set(bare.c.subarray(0, 480 * RH), 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const i = y * 480 + x;
    if (hand.c[i] === bare.c[i]) continue;
    const X = x + dx, Y = y + dy;
    if (X >= 0 && X < 480 && Y >= 0 && Y < RH) fb.c[Y * 480 + X] = hand.c[i];
  }
};

// ------------------------------------------------------------------ 5.04: over his shoulder onto Rima
export interface OtsRimaState {
  camX: number;
  rima: Partial<RimaPortraitState>;
  cursor: boolean;
  alyi?: LaunchMState['alyi'];
  /** v3.1: launch night warmed a step (the back wall's warm variant, his desk lamp's key on her face, the shoulder's
   *  rim in the lamp's tungsten): drawLaunchOTSRima's own warm branch */
  warm?: 0 | 1;
}
/** drawLaunchOTSRima's setup, re-composed: the back wall at camX, Rima's portrait at his desk, HIS DESK's near edge
 *  across the frame's foot (she stopped at it: the V.O. rows sit on its shadow), the button and the parked cursor on it
 *  at frame right, clear of the V.O. line, and his shoulder in the foreground */
export const otsRima = (fb: Buf, f: number, st: OtsRimaState) => {
  launchBackM(fb, st.camX, {alyi: st.alyi ?? {soft: true}, soft: 1, warm: st.warm});
  putBust(fb, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, ...st.rima}), 232, 44, {flip: true});
  if (st.warm) faceKey(fb, 232, 44, 344, 128, 1, -1);
  const top = 178;
  for (let y = top; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, y === top ? PAL.G3 : y < top + 3 ? PAL.G2 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
  otsShoulder(fb, -44, 64, st.warm ? PAL.W4 : PAL.C4, {flip: true});
  drawBeigeButton(fb, 364, top + 4, {scale: 'medium'});
  if (st.cursor) drawCursor(fb, 382, top + 6);
  void f;
};

// ------------------------------------------------------------------ 5.09: the glass composite, with mouths
export interface GlassCountState {
  alyi: LaunchMState['alyi'];
  rima: Partial<RimaStandPose>;
  mas: Partial<MasPortraitState>;
  /** v3.1 (5.09's shot note, drawLaunchGlass rack 'glass'): the focus racks to the reflection. 0 none (v3's frame) ·
   *  1 the held half step (a quarter of Rima's pixels a rung down, Alyi's face one step) · 2 racked (Rima soft as the
   *  art softens her, Alyi's face two steps) */
  rack?: 0 | 1 | 2;
  warm?: 0 | 1;
}
const TRANS = 0x1000000;
/** drawLaunchGlass(b, f, {mas: true, rima, rack}) re-composed so Mas's soft foreground head can speak and turn: the
 *  medium back wall at camX 460 with Alyi's reflection (any speaking state), Rima at the board, Mas soft (two rungs
 *  toward the dark) in the foreground, the button under his hand */
export const glassCount = (fb: Buf, f: number, st: GlassCountState) => {
  const rack = st.rack ?? 0;
  launchBackM(fb, 460, {alyi: st.alyi, underlines: 3, warm: st.warm, faceLight: rack});
  const rp: RimaStandPose = {...RIMA_STAND_DEFAULT, body: 'cap', head: 'back', light: 'board', ...st.rima};
  if (!rack) drawRimaStand(fb, 250, 176, rp);
  else {
    // racked off her: whole pixels a rung down on the dither (the art's own softening), half of it on the held step
    const t = new Buf(480, RH, TRANS);
    drawRimaStand(t, 250, 176, rp);
    for (let i = 0; i < 480 * RH; i++) {
      const v = t.c[i]; if (v === TRANS) continue;
      const x = i % 480, y = (i / 480) | 0, d = bayer(x, y);
      fb.c[y * fb.w + x] = rack === 2 ? (d < 0.5 ? stepColor(v, -1) : stepColor(v, lightness(v) > 0.35 ? -1 : 0)) : d < 0.25 ? stepColor(v, -1) : v;
    }
  }
  putBust(fb, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'monitor', look: 1, ...st.mas}), -30, 48, {flip: true, map: (c) => stepColor(c, -2)});
  drawBeigeButton(fb, 70, 190, {scale: 'medium'});
  void f;
};

// ------------------------------------------------------------------ 9.09: the terms, with the camera drifting
/** lobby-deal's softLobby (private there), the same steps: the wide without its figures, panned `pan` px (the entrance's
 *  glass continuing into the gap), dithered a rung down */
const FILL = new Map<string, Buf>();
const softLobbyPan = (b: Buf, f: number, st: DealWideState, pan: number) => {
  const W = new Buf(480, 270, PAL.N0);
  drawDealWide(W, f, {...st, mas: null, tasya: null, gerg: st.gerg ?? null});
  // the gap the pan opens is filled with the entrance glass's first 20 columns, repeated (the art's own fill). Taken
  // from frame 0 of the same dressing, when the street's passing car (lobby.ts traffic) is off screen: a car in those
  // columns would repeat into a long red bar across the gap
  const key = `${st.check}|${st.tv?.show ?? ''}`;
  let F0 = FILL.get(key);
  if (!F0) { F0 = new Buf(480, 270, PAL.N0); drawDealWide(F0, 0, {...st, mas: null, tasya: null, gerg: null}); FILL.set(key, F0); }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const sx = x - pan;
    b.c[y * b.w + x] = sx >= 0 ? W.c[y * 480 + sx] : F0.c[y * 480 + (((sx % 20) + 20) % 20)];
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const c = b.get(x, y); if (bayer(x, y) < 0.5) b.set(x, y, stepColor(c, lightness(c) > 0.4 ? -1 : 0)); }
};
export interface Deal2SPanState {
  pan: number;
  check: DealWideState['check'];
  mas: Partial<MasMediumState>;
  tasya: Partial<TasyaMediumState> | null;
  /** Tasya's x (he leaves frame right on his last line) */
  tasyaX?: number;
  /** Gerg behind them at the door, tugging the check (the art's drawDeal2S staging at [238, 172]; `at` moves him) */
  gerg?: boolean | {at: [number, number]; flip?: boolean};
  collars?: number;
  tv?: TvState;
}
/** drawDeal2S with the pan as a parameter (the art's own is 110) and Tasya's x free; the v3.1 collars (mas-collars
 *  'v31': one design across the episode) */
export const deal2S = (fb: Buf, f: number, st: Deal2SPanState) => {
  const g = st.gerg ? (st.gerg === true ? {at: [238, 172] as [number, number], flip: true} : st.gerg) : null;
  softLobbyPan(fb, f, {check: st.check, tv: st.tv, gerg: g ? {body: 'tug', at: g.at, flip: g.flip} : null}, st.pan);
  const mx = 6, my = 96;
  drawMasMedium(fb, mx, my, {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'down', ...st.mas}, {flip: true});
  drawCollarsMedium(fb, mx, my, st.collars ?? 3, {flip: true, style: 'v31'});
  if (st.tasya) drawTasyaMedium(fb, st.tasyaX ?? 380, 96, {arm: 'clasp', ...st.tasya});
};

// ------------------------------------------------------------------ 9.10: somebody crossing the check
/** an employee (Gerg's room walk, recoloured to another person: a plum sweater, darker hair) crossing the lobby, drawn
 *  only where `bg` (the wide without its cast) still shows, so the cast in front of them keeps its pixels */
const OTHER = (c: number) => {
  const fm = familyOf(c); if (!fm) return c; const [fam, i] = fm;
  if (fam === 'L') return [PAL.D0, PAL.D1, PAL.D2, PAL.D3][Math.min(3, i)];
  if (fam === 'F') return [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.D4, PAL.D4][Math.min(6, i)];
  if (fam === 'B') return [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3][Math.min(4, i)];
  if (fam === 'S') return stepColor(c, -1);
  return c;
};
export const passerBy = (fb: Buf, f: number, x: number, y: number, bg: Buf, cast: Buf, flip = false) => {
  const tmp = new Buf(480, RH, 0x1000000);
  drawGergStand(tmp, x, y, {...GERG_STAND_DEFAULT, legs: gergWalkAt(f), look: 'screen'}, {map: OTHER, flip});
  for (let i = 0; i < 480 * RH; i++) {
    const v = tmp.c[i];
    if (v === 0x1000000) continue;
    if (cast.c[i] !== bg.c[i]) continue; // a cast member is in front here
    fb.c[i] = v;
  }
};

// ------------------------------------------------------------------ a figure mask from two renders
/** the pixels a cast changed (`withCast` vs `bare`), with the holes closed (dilate, then erode, 1 px): where a figure's
 *  dithered colour happens to equal the plate's pixel under it, the raw difference has holes */
export const castMask = (withCast: Buf, bare: Buf): Uint8Array => {
  const n = 480 * RH, m = new Uint8Array(n), d = new Uint8Array(n), e = new Uint8Array(n);
  for (let i = 0; i < n; i++) m[i] = withCast.c[i] !== bare.c[i] ? 1 : 0;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let v = 0;
    for (let j = -1; j <= 1 && !v; j++) for (let i = -1; i <= 1; i++) { const X = x + i, Y = y + j; if (X >= 0 && Y >= 0 && X < 480 && Y < RH && m[Y * 480 + X]) { v = 1; break; } }
    d[y * 480 + x] = v;
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let v = 1;
    for (let j = -1; j <= 1 && v; j++) for (let i = -1; i <= 1; i++) { const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= 480 || Y >= RH || !d[Y * 480 + X]) { v = 0; break; } }
    e[y * 480 + x] = v || m[y * 480 + x] ? 1 : 0;
  }
  return e;
};

// ------------------------------------------------------------------ 5.10: the chat's second reply, below the plate
/** a bot reply card as kits/chat-window draws them (cream card, its top rule, the text in the dark ink), placed by the
 *  layout: the window stacks its cards from the top and the third would cover the product plate */
export const chatCard = (b: Buf, x: number, y: number, w: number, text: string) => {
  const rows = pwrap(text || ' ', w - 10), hh = rows.length * 10 + 6;
  rect(x, y, w, hh, b.ink(PAL.P1)); rect(x, y, w, 1, b.ink(PAL.P2));
  rows.forEach((r, i) => pt(b, r, x + 5, y + 3 + i * 10, PAL.N1));
};

// ------------------------------------------------------------------ 9.10: the twelfth key, readable in the wide
/** the NopeAI-beige twelfth key on Tasya's ring at room scale (the ring: lobby-deal drawDealWide's drawKeyRing at
 *  (footX - 8, footY - 36), r 5). The ring's own keys are 1 x 3 px, so the new one is drawn over it as a key of its own:
 *  a 3 x 3 bow and a 5 px blade with its teeth, in the button's beige, a dark keyline so it reads against his navy
 *  blazer, hanging a little proud of the others; `jangle` swings it a pixel with the ring, `glint` lights its bow */
export const twelfthKey = (fb: Buf, footX: number, footY: number, jangle: 0 | 1, glint: boolean) => {
  const bx = footX - 8 - 6 + jangle, by = footY - 36 + 3;
  const KEY = ['.kkk.', 'kbbbk', 'kbhbk', 'kbbbk', '.kbk.', '.kbk.', '.kbkk', '.kbbk', '.kbk.', '.kbkk', '.kbbk', '..k..'];
  const col: Record<string, number> = {k: PAL.N0, b: PAL.P1, h: PAL.N1};
  KEY.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = col[r[i]]; if (c !== undefined) fb.set(bx + i, by + j, c); } });
  fb.set(bx + 1, by + 1, PAL.P2); fb.set(bx + 2, by + 5, PAL.P2); // its lit edge
  if (glint) { fb.set(bx + 1, by + 1, PAL.W8); fb.set(bx, by + 1, PAL.P2); }
};

// ------------------------------------------------------------------ 8.05: the GUEST lanyard card, legible
export const guestCard = (fb: Buf, cx: number, y: number) => {
  const w = tinyWidth('GUEST') + 4, x = cx - (w >> 1);
  line(cx - 3, y - 7, cx - 1, y - 1, fb.ink(PAL.R2)); line(cx + 3, y - 7, cx + 1, y - 1, fb.ink(PAL.R2));
  rect(x - 1, y - 1, w + 2, 9, fb.ink(PAL.N0)); rect(x, y, w, 7, fb.ink(PAL.P2)); rect(x, y, w, 1, fb.ink(PAL.R2));
  tiny(fb, 'GUEST', x + 2, y + 2, PAL.N1);
};

// ------------------------------------------------------------------ lighting notes
/** the frame's foot stepped `n` rungs toward the dark from y0 (dithered over the first 6 rows): the V.O. rows on shadow */
export const bottomShade = (fb: Buf, y0: number, n: number, x0 = 0, x1 = 480) => {
  for (let y = y0; y < RH; y++) for (let x = x0; x < x1; x++) {
    const t = (y - y0) / 6;
    if (t < 1 && bayer(x, y) > t) continue;
    fb.set(x, y, stepColor(fb.get(x, y), -n));
  }
};
/** a few grains trickling down (held on 3s): debris after the drill, grit in the bedrock */
export const grains = (fb: Buf, f: number, x0: number, x1: number, y0: number, y1: number, n: number, seed: number, col: number) => {
  const k = Math.floor(f / 3);
  for (let i = 0; i < n; i++) {
    const x = x0 + Math.floor(hash(i, 1, seed) * (x1 - x0));
    const span = y1 - y0, y = y0 + ((Math.floor(hash(i, 2, seed) * span) + k * 2) % span);
    fb.set(x, y, col);
  }
};
