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
//   callMcu(fb, f, st)                   v32-7.03 (the lead's ruling on art-a §8): rooms/launch-call's MCU re-composed
//                                        with the phone at NORMAL size, its screen facing him: at his ear, lowered in a
//                                        held step, low (the call over), and lit red (its light on his face, not ours)
//   handOnPhone(fb, step)                7.02: his hand coming down onto the phone at the HIGH's top edge (held steps)
//   paneButton(fb, press, dx, dy, lit)   11.04: 5.08's finger approach (fingerECU) cropped into the split's left pane,
//                                        the same crop duel-split's `button` state makes
//   postPreview(fb, k, click)            6.06 (v3.3, P2): his phone's compose strip at the frame's foot, only the post's
//                                        first line (post-card's own avatar chip and type), his thumb on Post, the click
//   mcuMasDesk(fb, f, mas)               5.07 (v3.3, P1): 5.11's MCU (drawLaunchMcuMas) without the chat: his laptop is
//                                        dark here, so his portrait in the lamp's warm light, the warm rim, warm collars
//   tearGlint(fb, i, k)                  7.01 (v3.3, P3): a three-armed catch-light round the tear's bright pixel
//   settleHand(fb, st)                   9.09 (v3.3, P4): Tasya's hand coming into 9.08's MCU from frame right to settle
//                                        the new collar, his key ring hanging from his fingers and clinking against it
//   bottomShade(fb, y0, n)               a lighting note: the frame's foot a rung or two darker (the V.O. rows on shadow)
import {Buf, rect, line, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../shared/pixel/palette';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {launchBackM, putBust, otsShoulder, drawCursor} from '../../../../shared/pixel/rooms/bullpen-launch';
import {faceKey, warmRim} from '../../../../shared/pixel/kits/face-light';
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
import {drawCollarsMedium, drawCollarsPortrait} from '../../../../shared/pixel/cast/mas-collars';
import {BUTTON_ECU} from '../../../../shared/pixel/kits/launch-button';
import {DUEL} from '../../../../shared/pixel/rooms/duel-split';
import {drawTasyaMedium} from '../../../../shared/pixel/cast/tasya-medium';
import type {TasyaMediumState} from '../../../../shared/pixel/cast/tasya-medium';
import {drawGergStand, GERG_STAND_DEFAULT, gergWalkAt} from '../../../../shared/pixel/cast/gerg-stand';
import type {TvState} from '../../../../shared/pixel/kits/tv-news';
import {pt, pw, pwrap, RH} from '../kit';
import {drawAvatar9} from '../../../../shared/pixel/kits/post-card';

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
  /** v3.4 (5.04, the decision): his head in the foreground silhouette dips this many whole pixels toward his desk and
   *  the button (the shoulders stay): the settle before "it's a preview." */
  headDy?: number;
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
  if (!st.headDy) otsShoulder(fb, -44, 64, st.warm ? PAL.W4 : PAL.C4, {flip: true});
  else {
    // the silhouette drawn apart, its head (above the collar line, y 146) moved down whole pixels over the shoulders
    const sil = new Buf(480, 270, 0x1000000);
    otsShoulder(sil, -44, 64, st.warm ? PAL.W4 : PAL.C4, {flip: true});
    const split = 146;
    for (let y = RH - 1; y >= 0; y--) for (let x = 0; x < 200; x++) {
      const v = sil.c[y * 480 + x]; if (v === 0x1000000) continue;
      const Y = y < split ? y + st.headDy : y;
      if (Y < RH) fb.set(x, Y, v);
    }
  }
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
  /** frames since the newest collar's hop (mas-collars `pop`: 1 px proud for 2 frames), or undefined */
  collarPop?: number;
  tv?: TvState;
}
/** drawDeal2S with the pan as a parameter (the art's own is 110) and Tasya's x free; the v3.1 collars (mas-collars
 *  'v31': one design across the episode) */
export const deal2S = (fb: Buf, f: number, st: Deal2SPanState) => {
  const g = st.gerg ? (st.gerg === true ? {at: [238, 172] as [number, number], flip: true} : st.gerg) : null;
  softLobbyPan(fb, f, {check: st.check, tv: st.tv, gerg: g ? {body: 'tug', at: g.at, flip: g.flip} : null}, st.pan);
  const mx = 6, my = 96;
  drawMasMedium(fb, mx, my, {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'down', ...st.mas}, {flip: true});
  drawCollarsMedium(fb, mx, my, st.collars ?? 3, {flip: true, style: 'v31', pop: st.collarPop});
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

// ------------------------------------------------------------------ v32-7.03: the call, the phone at normal size
const skinC = (c: number) => { const fm = familyOf(c); return !!fm && fm[0] === 'S' && lightness(c) > 0.3; };
export interface CallMcuState {
  /** 'ear' at his ear (its back to us, the screen to him) · 'mid' the held step down · 'low' at his chest, the call over,
   *  the screen still turned to him · 'red' the same, lit red: its light on his chin and the phone's rim */
  phone: 'ear' | 'mid' | 'low' | 'red';
  mas?: Partial<MasPortraitState>;
  glow?: number;
  collars?: number;
}
/** rooms/launch-call.ts drawLaunchCallMcu's frame (7.01's fallaway behind him, his portrait at (96, 34), the open tile's
 *  red from below as a clean rim, the tile's band at the frame's foot) with the phone a real phone's size for his head
 *  (12 x 40 at his ear, about half his head's height), held the way people hold one: its back to us, his fingers round
 *  it. The screen faces him; its light is read on him */
export const callMcu = (fb: Buf, f: number, st: CallMcuState) => {
  launchBackM(fb, 300, {soft: 2, alyi: 'gone', underlines: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, stepColor(fb.get(x, y), -2));
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', lid: 0, look: 0, ...st.mas};
  const x = 96, y = 34;
  putBust(fb, masPortrait(s), x, y);
  drawCollarsPortrait(fb, x, y, st.collars ?? 2, {head: s.head ?? '34', light: 'warm', style: 'v31'});
  const glow = st.glow ?? 2;
  if (glow) {
    const hits: Array<[number, number]> = [];
    for (let yy = y + 60; yy < y + 86; yy++) for (let xx = x + 10; xx < x + 100; xx++) if (skinC(fb.get(xx, yy)) && !skinC(fb.get(xx, yy + 1))) hits.push([xx, yy]);
    for (const [xx, yy] of hits) { fb.set(xx, yy, glow >= 2 ? PAL.W5 : PAL.S5); if (glow >= 2 && skinC(fb.get(xx, yy - 1))) fb.set(xx, yy - 1, PAL.S5); }
    for (let yy = RH - 10; yy < RH; yy++) for (let xx = 0; xx < 480; xx++) if (bayer(xx, yy) < (yy - RH + 10) / 12) fb.set(xx, yy, yy > RH - 4 ? PAL.R2 : PAL.R1);
  }
  const ph = st.phone;
  // the forearm: the hoodie sleeve from the hand down to the frame's bottom right (its lit edge the tile's red)
  const [hx, hy] = ph === 'ear' ? [x + 80, y + 84] : ph === 'mid' ? [x + 76, y + 122] : [x + 62, y + 134];
  for (let yy = hy; yy < RH; yy++) {
    const t = (yy - hy) / Math.max(1, RH - hy), cx = Math.round(hx + 6 + t * 34), hw = 8 + Math.round(t * 8);
    for (let xx = cx - hw; xx <= cx + hw; xx++) fb.set(xx, yy, xx <= cx - hw + 1 ? (glow ? PAL.W3 : PAL.G3) : xx > cx + hw - 3 ? PAL.G0 : PAL.G2);
  }
  // the phone's back: a dark rounded slab, one lit rim, the camera's lens near the top
  const slab = (x0: number, y0: number, w: number, h: number, lean: number, rim: number) => {
    for (let j = 0; j < h; j++) {
      const off = Math.round(lean * j), X0 = x0 + off;
      for (let i = 0; i < w; i++) {
        const corner = (j === 0 || j === h - 1) && (i === 0 || i === w - 1);
        if (corner) continue;
        fb.set(X0 + i, y0 + j, i === 0 ? rim : i === w - 1 || j === h - 1 ? PAL.N0 : j === 0 ? PAL.G3 : PAL.G1);
      }
    }
  };
  // his fingers round the back (four tips on the far edge) and the heel of his hand under the phone
  const fingers = (fx: number, fy: number, n: number, gap: number) => {
    for (let k = 0; k < n; k++) for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) if (Math.hypot(i - 1.5, j - 1.5) < 2) fb.set(fx + i, fy + k * gap + j, i === 0 ? PAL.S2 : j === 0 ? PAL.S5 : PAL.S4);
  };
  const palm = (px: number, py: number, w: number, h: number) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (Math.hypot((i - w / 2) / (w / 2), (j - h / 2) / (h / 2)) < 1) fb.set(px + i, py + j, j < 2 ? PAL.S5 : i > w - 3 ? PAL.S2 : PAL.S4);
  };
  if (ph === 'ear') {
    // at the ear: the slab leans from behind the ear (top) toward his mouth (bottom), 12 px across, 40 tall
    palm(x + 70, y + 74, 16, 12);
    slab(x + 76, y + 40, 12, 40, -0.2, glow ? PAL.W3 : PAL.G3);
    rect(x + 82, y + 44, 3, 3, fb.ink(PAL.N0)); fb.set(x + 83, y + 45, PAL.G4);
    fingers(x + 83, y + 56, 4, 5);
    // his screen's light on the cheek against it: a clean 2 px rim, a rung up (no dither on skin)
    for (let yy = y + 44; yy < y + 78; yy++) { const x1 = x + 76 + Math.round(-0.2 * (yy - y - 40)); for (let xx = x1 - 2; xx < x1; xx++) { const c = fb.get(xx, yy); if (skinC(c)) fb.set(xx, yy, stepColor(c, 1)); } }
  } else if (ph === 'mid') {
    // the held step down: level with his chin, still upright
    palm(x + 66, y + 112, 16, 12);
    slab(x + 70, y + 84, 12, 36, -0.1, glow ? PAL.W3 : PAL.G3);
    fingers(x + 78, y + 96, 4, 5);
  } else {
    // at his chest, tipped back toward him: its screen's upper edge shows (foreshortened, 20 x 5), the back below it
    const red = ph === 'red';
    palm(x + 50, y + 128, 24, 10);
    slab(x + 52, y + 116, 20, 14, 0, red ? PAL.R3 : glow ? PAL.W3 : PAL.G3);
    const sx0 = x + 53, sy0 = y + 117;
    for (let j = 0; j < 5; j++) for (let i = 0; i < 18; i++) fb.set(sx0 + i, sy0 + j, red ? (j === 0 ? PAL.R3 : PAL.R2) : j === 0 ? PAL.N3 : PAL.N2);
    if (red) {
      // the alert on its screen: the siren dome's white glint, stepping on 6s (a slow blink, not a flash)
      const on = Math.floor(f / 6) % 2 === 0;
      rect(sx0 + 7, sy0 + 1, 4, 2, fb.ink(on ? PAL.W8 : PAL.W6));
      // the alert's red on him: the undersides of his face, and a soft spill up the hoodie, in whole rungs
      const hits: Array<[number, number]> = [];
      for (let yy = y + 56; yy < y + 100; yy++) for (let xx = x + 20; xx < x + 90; xx++) if (skinC(fb.get(xx, yy)) && !skinC(fb.get(xx, yy + 1))) hits.push([xx, yy]);
      for (const [xx, yy] of hits) fb.set(xx, yy, PAL.R3);
      for (let yy = y + 90; yy < y + 117; yy++) for (let xx = x + 30; xx < x + 96; xx++) { const d = Math.hypot((xx - x - 62) / 34, (yy - y - 117) / 27); if (d < 1 && !skinC(fb.get(xx, yy)) && bayer(xx, yy) < (1 - d) * 0.7) fb.set(xx, yy, d < 0.5 ? PAL.R2 : PAL.R1); }
    }
    fingers(x + 72, y + 120, 2, 4);
  }
};

// ------------------------------------------------------------------ 7.02: his hand finds the phone
/** the HIGH (drill.ts HIGH.phone at (360, 14), 26 x 14 at the frame's top edge): his hand comes down over the desk's
 *  edge onto it in held steps (0 out of frame · 1 · 2 · 3 resting on it), the back of the hand from above, his sleeve */
export const handOnPhone = (fb: Buf, step: number) => {
  if (step <= 0) return;
  const dy = [0, -12, -6, 0][Math.min(3, step)];
  const hx = 358, hy = 6 + dy; // the back of the hand's top-left; the fingertips reach the phone's far half
  // the sleeve: from the frame's top edge down to the wrist (the dark hoodie, lit on its left edge)
  for (let y = 0; y < hy + 3; y++) for (let x = hx + 8; x < hx + 26; x++) fb.set(x, y, x === hx + 8 ? PAL.G4 : x > hx + 23 ? PAL.G0 : PAL.G1);
  // the back of the hand (seen from above), knuckles, then four fingers pointing down the frame onto the phone
  for (let j = 0; j < 10; j++) for (let i = 0; i < 20; i++) {
    if (Math.hypot((i - 9.5) / 10, (j - 5) / 5.5) >= 1) continue;
    const Y = hy + 2 + j; if (Y < 0) continue;
    fb.set(hx + 6 + i, Y, j < 2 ? PAL.S5 : i < 2 ? PAL.S2 : PAL.S4);
  }
  for (let k = 0; k < 4; k++) for (let j = 0; j < 7; j++) for (let i = 0; i < 3; i++) {
    const X = hx + 8 + k * 4 + i, Y = hy + 10 + j + (k === 0 || k === 3 ? -1 : 0); if (Y < 0) continue;
    fb.set(X, Y, i === 0 ? PAL.S2 : j === 6 ? PAL.S3 : PAL.S4);
  }
  // the thumb along the phone's near edge
  for (let j = 0; j < 8; j++) { const Y = hy + 6 + j; if (Y >= 0) { fb.set(hx + 3, Y, PAL.S2); fb.set(hx + 4, Y, PAL.S4); fb.set(hx + 5, Y, PAL.S4); } }
  // the phone wakes under his fingers: its screen a dim lit rung (he's about to call)
  if (step >= 3) for (let y = 15; y < 27; y++) for (let x = 361; x < 385; x++) { const c = fb.get(x, y); if (c === PAL.N1) fb.set(x, y, bayer(x, y) < 0.5 ? PAL.C2 : PAL.C1); }
};

// ------------------------------------------------------------------ 11.04: his finger in the left pane
/** the split's LEFT pane (x 0..DUEL.paneW) as duel-split's `button` crop of the ECU, from fingerECU so his finger can
 *  come in in 5.08's held steps; the pane's own divider is left to drawDuelSplit */
export const paneButton = (fb: Buf, press: 0 | 1 | 2, dx: number, dy: number, lit: boolean) => {
  const E = new Buf(480, 270, PAL.N0);
  fingerECU(E, press, dx, dy, lit);
  const x0 = Math.max(0, Math.min(480 - DUEL.paneW, BUTTON_ECU[0] - (DUEL.paneW >> 1) + 20));
  for (let y = 0; y < RH; y++) for (let x = 0; x < DUEL.paneW; x++) fb.c[y * fb.w + x] = E.c[y * 480 + x0 + x];
};

// ------------------------------------------------------------------ 6.06 (v3.3): the post as a preview, under his thumb
export const POST_PREVIEW = 'CHATGTP launched on wednesday. today it crossed…';
/** his phone's compose strip over the odometer ECU, at the frame's foot (post-card's colours: the popup's N2 card, his C6
 *  accent rule, his 9 px chip), one line only, and the Post pill; his thumb comes up from the frame's bottom right in
 *  held steps and presses it on the post's click (k = click), the pill lighting; then it lifts away and the line holds.
 *  `in` is when the strip slides up (2 held steps) */
export const postPreview = (fb: Buf, k: number, click: number, into: number) => {
  if (k < into) return;
  const x = 16, w = 330, h = 24, y = 166 + (k < into + 2 ? 16 : k < into + 4 ? 6 : 0);
  rect(x + 3, y + 3, w, h, fb.ink(PAL.N0));
  rect(x - 1, y - 1, w + 2, h + 2, fb.ink(PAL.N0)); rect(x, y, w, h, fb.ink(PAL.N2));
  rect(x, y, w, 1, fb.ink(PAL.C6)); rect(x, y + h - 1, w, 1, fb.ink(PAL.N1));
  drawAvatar9(fb, x + 6, y + 8, 'mas');
  pt(fb, POST_PREVIEW, x + 20, y + 9, PAL.P2);
  // the Post pill at the strip's right end: dim until he presses it, lit on the click, then "Posted" in his accent
  const px = x + w - 50, py = y + 6, pressed = k >= click && k < click + 6, done = k >= click + 6;
  rect(px, py, 42, 12, fb.ink(pressed ? PAL.C6 : done ? PAL.N3 : PAL.N4)); rect(px, py, 42, 1, fb.ink(pressed ? PAL.C8 : PAL.N5));
  const label = done ? 'Posted' : 'Post';
  pt(fb, label, px + Math.round((42 - pw(label)) / 2), py + 3, pressed ? PAL.N1 : done ? PAL.C6 : PAL.P2);
  // his thumb: up from the frame's bottom right to the pill (held steps: low, near, on it; the press sinks 1 px; lift)
  const tipX = px + 22, tipY = py + 7;
  const off = k < click - 8 ? null : k < click - 4 ? 22 : k < click ? 8 : k < click + 6 ? -1 : k < click + 10 ? 10 : k < click + 14 ? 26 : null;
  if (off === null) return;
  const ty = tipY + off;
  for (let yy = ty; yy < RH; yy++) {
    const t = yy - ty, cx = tipX + Math.round(t * 0.55), hw = Math.min(7, 3 + Math.floor(t / 3));
    for (let xx = cx - hw; xx <= cx + hw; xx++) {
      const edge = xx === cx - hw || xx === cx + hw;
      fb.set(xx, yy, edge ? PAL.S2 : t < 2 ? PAL.S5 : xx < cx - 1 ? PAL.S5 : PAL.S4);
    }
    if (t >= 2 && t < 6) for (let xx = cx - 2; xx <= cx + 2; xx++) fb.set(xx, yy, t === 2 ? PAL.P2 : PAL.S5); // the nail
  }
};

// ------------------------------------------------------------------ 9.09 (v3.3): Tasya's hand settles the collar
/** Tasya's hand in 9.08's MCU (lobby-deal drawDealMcuMas, Mas's portrait at (100, 34); the gold third collar spans x
 *  141..173, rows 113..127, its right point at x ~172): his forearm up from the frame's bottom right in the blazer's navy
 *  (tasya-medium's N4 / N5 lit / N3 shade), the shirt cuff, the hand pinching the collar's point, and his key ring
 *  hanging from his fingers (brass, eleven keys shown as five at this size). step 0 none · 1 far · 2 near · 3 on the
 *  collar; `swing` puts the ring against the collar (the clink), `glint` lights the contact */
export interface SettleHandState { step: 0 | 1 | 2 | 3; swing?: boolean; glint?: boolean }
export const settleHand = (fb: Buf, st: SettleHandState) => {
  if (!st.step) return;
  const [dx, dy] = [[0, 0], [56, 44], [26, 20], [0, 0]][st.step];
  const hx = 176 + dx, hy = 114 + dy; // the fingertips' left end at the collar's point
  // the sleeve: from the wrist (hx + 20, hy + 10) down-right to the frame's bottom
  const wx = hx + 22, wy = hy + 10;
  for (let yy = wy; yy < RH; yy++) {
    const t = (yy - wy) / Math.max(1, RH - wy), cx = Math.round(wx + 6 + t * 60), hw = 8 + Math.round(t * 5);
    for (let xx = cx - hw; xx <= cx + hw; xx++) fb.set(xx, yy, xx <= cx - hw + 1 ? PAL.N5 : xx >= cx + hw - 2 ? PAL.N3 : PAL.N4);
  }
  // the cuff at the wrist, then the back of the hand, the fingers reaching to the point
  for (let j = 0; j < 12; j++) for (let i = 0; i < 4; i++) fb.set(wx - 2 + i + Math.round(j * 0.2), wy - 4 + j, i === 0 ? PAL.G5 : PAL.P1);
  for (let j = 0; j < 11; j++) for (let i = 0; i < 16; i++) {
    if (Math.hypot((i - 7.5) / 8, (j - 5) / 5.5) >= 1) continue;
    fb.set(hx + 6 + i, hy - 1 + j, j < 2 ? PAL.S4 : j > 8 ? PAL.X2 : PAL.S3);
  }
  for (let k = 0; k < 3; k++) for (let i = 0; i < 7; i++) { const X = hx + i, Y = hy + k * 3; fb.set(X, Y, PAL.S3); fb.set(X, Y + 1, i === 0 ? PAL.X2 : PAL.S4); }
  fb.set(hx - 1, hy + 1, PAL.X1); // the fingertip on the collar's edge
  // the key ring from his fingers: a brass ring and five keys fanned under it
  const rx = hx + 8 - (st.swing ? 6 : 0), ry = hy + 19;
  for (let yy = -6; yy <= 6; yy++) for (let xx = -6; xx <= 6; xx++) { const d = Math.hypot(xx, yy); if (d >= 4.6 && d <= 6.2) fb.set(rx + xx, ry + yy, xx + yy < 0 ? PAL.W7 : PAL.W5); }
  line(hx + 8, hy + 8, rx, ry - 6, fb.ink(PAL.W4));
  const keys: Array<[number, number]> = [[-5, PAL.G5], [-2, PAL.W6], [0, PAL.G6], [2, PAL.W4], [5, PAL.G5]];
  for (const [kx, col] of keys) for (let j = 0; j < 8; j++) fb.set(rx + kx + Math.round(kx * 0.12 * j), ry + 6 + j, col);
  if (st.glint) { fb.set(rx - 6, ry - 2, PAL.W9); fb.set(rx - 7, ry - 2, PAL.W8); fb.set(rx - 6, ry - 3, PAL.W8); }
};

// ------------------------------------------------------------------ 5.07 (v3.3): his face, not answering
/** drawLaunchMcuMas's frame re-composed for 5.07: the launch back wall (warm, soft 2, camX 330), his portrait at (96, 34)
 *  lit by the desk lamp ('warm', its rim down his left side), the two collars in the warm ramp; no chat light (the
 *  laptop is dark until the click) */
export const mcuMasDesk = (fb: Buf, f: number, mas: Partial<MasPortraitState>) => {
  launchBackM(fb, 330, {soft: 2, alyi: 'gone', warm: 1});
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', look: -1, ...mas};
  const x = 96, y = 34;
  putBust(fb, masPortrait(s), x, y);
  warmRim(fb, x, y, x + 112, y + 96, -1, 3);
  drawCollarsPortrait(fb, x, y, 2, {head: s.head ?? '34', light: 'warm', style: 'v31'});
  void f;
};

// ------------------------------------------------------------------ 7.01 (v3.3): the tear's glint, readable
/** the catch-light round the tear's bright pixel in drawLaunchMcuPF's frame (portrait at (96, 34); the bead's bright
 *  pixel is MAS_TEAR_PATH[i] one row up): one pixel out up, left and right in the lamp's tungsten, for the frames the
 *  layout gives it (never below: that's his cheek's wet track) */
export const tearGlint = (fb: Buf, tx: number, ty: number) => {
  const x = 96 + tx, y = 34 + ty - 1;
  fb.set(x, y - 1, PAL.W7); fb.set(x - 1, y, PAL.W6); fb.set(x + 1, y, PAL.W6);
};
