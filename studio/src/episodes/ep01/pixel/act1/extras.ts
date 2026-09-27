// MR. MAS — Ep1 pixel v3, ACT ONE (the `v3-shots-act1` pass, 2026-09-27): the small additive drawings and compositions
// the act's layouts need that the art passes' modules don't expose as one call. NEW file, namespaced to act1: nothing
// here edits a drawing. Each helper either composes exported art pieces (rooms/bullpen-launch, rooms/lobby-deal, the
// cast rigs) with a parameter the packaged setup fixes (a camera x, a mouth, a lifted prop), or adds a few pixels of
// idle life (a sleep LED, a passer-by, a scrolling phone page). All whole-pixel, master palette, pure in (k, f).
//
//   litBand(fb, sh, k, f, rails, lit)   the adventure-game BAND lit for the launch (sc 5: "the band lights, and a
//                                        cursor drifts to the button"): the host's band, rail and V.O. line, plus the
//                                        sentence line (`Push research preview`) at level 0..3; the layout returns
//                                        {full: true} while it draws the band itself
//   cursorPath(k, k0, k1, from, to)      the cursor's drift, held on 2s, easing into its park
//   sleepLed(fb, f)                      5.01: his closed laptop's sleep LED breathing (held steps)
//   fingerECU(fb, press, dx, dy)         5.08: the ECU button with his finger offset (the approach in held steps)
//   rimaMarkerHand(fb, f, wet, gerg)     5.07: Rima's hand and marker at the board behind Gerg, drawing the third line
//   otsRima(fb, f, st)                   5.04: drawLaunchOTSRima re-composed with a drifting back wall, his desk's edge
//                                        and the button lifted clear of the V.O. rows
//   glassCount(fb, f, st)                5.09: drawLaunchGlass's composite with Mas's and Alyi's mouths
//   deal2S(fb, f, st)                    9.09: drawDeal2S with the soft lobby's pan as a parameter (a slow drift)
//   passerBy(fb, f, x, y, bg)            9.10: an employee crossing the check (Gerg's walk, recoloured), behind the cast
//   guestCard(fb, x, y)                  8.05: the GUEST card on a lanyard, legible
//   bottomShade(fb, y0, n)               a lighting note: the frame's foot a rung or two darker (the V.O. rows on shadow)
import {Buf, rect, line, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../shared/pixel/palette';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {textWidth} from '../../../../shared/pixel/font';
import {launchBackM, putBust, otsShoulder, drawCursor, LAUNCH_M} from '../../../../shared/pixel/rooms/bullpen-launch';
import type {LaunchMState} from '../../../../shared/pixel/rooms/bullpen-launch';
import {drawButtonECU, drawBeigeButton} from '../../../../shared/pixel/kits/launch-button';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {rimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/rima-speak';
import type {RimaPortraitState} from '../../../../shared/pixel/cast/rima-speak';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../../../../shared/pixel/cast/rima-stand';
import type {RimaStandPose} from '../../../../shared/pixel/cast/rima-stand';
import {gergMedium, GERG_MEDIUM_DEFAULT} from '../../../../shared/pixel/cast/gerg-medium';
import type {GergMediumState} from '../../../../shared/pixel/cast/gerg-medium';
import {gergTypeAt} from '../../../../shared/pixel/cast/gerg';
import {drawDealWide} from '../../../../shared/pixel/rooms/lobby-deal';
import type {DealWideState} from '../../../../shared/pixel/rooms/lobby-deal';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../shared/pixel/cast/mas-medium';
import type {MasMediumState} from '../../../../shared/pixel/cast/mas-medium';
import {drawCollarsMedium} from '../../../../shared/pixel/cast/mas-collars';
import {drawTasyaMedium} from '../../../../shared/pixel/cast/tasya-medium';
import type {TasyaMediumState} from '../../../../shared/pixel/cast/tasya-medium';
import {drawGergStand, GERG_STAND_DEFAULT, gergWalkAt} from '../../../../shared/pixel/cast/gerg-stand';
import type {TvState} from '../../../../shared/pixel/kits/tv-news';
import {pt, pw, pwrap, RH} from '../kit';
import type {PxShot, PxRail} from '../types';

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

// ------------------------------------------------------------------ the lit band (sc 5, the one lit-UI moment of Act One)
export const SENTENCE = 'Push research preview';
/** the host's band (frame.ts band + voLine, the same pixels) with the adventure game's sentence line. level: 3 lit (the
 *  sentence in paper, the rule a lit line), 2 and 1 the dim-out's held steps, 0 = the host's own band exactly */
export const litBand = (fb: Buf, sh: PxShot, k: number, f: number, rails: PxRail[], lit: {level: number; text: string | null}) => {
  const L = clamp(Math.round(lit.level), 0, 3);
  rect(0, RH, 480, 270 - RH, fb.ink(PAL.N0));
  rect(0, RH, 480, 1, fb.ink([PAL.N3, PAL.N4, PAL.N5, PAL.G4][L]));
  if (L >= 2) for (let x = 0; x < 480; x++) if (bayer(x, 0) < 0.5) fb.set(x, RH + 1, PAL.N2);
  // the rail, exactly as the host types it (2 characters a frame from its start)
  const r = rails.find((q) => f >= q.s && f < q.e);
  if (r) {
    const s = r.text.slice(0, Math.max(0, (f - r.s) * 2));
    pwrap(s, 440).slice(0, 3).forEach((l, i) => pt(fb, l, 12, RH + 12 + i * 11, PAL.P1, {shadow: PAL.N2}));
  }
  // the sentence line: the verb and the object under the cursor, centred low in the band
  if (L > 0 && lit.text) {
    const col = [PAL.N0, PAL.N5, PAL.P0, PAL.P2][L];
    const x = Math.round(240 - pw(lit.text) / 2);
    pt(fb, lit.text, x, RH + 44, col, {shadow: L >= 2 ? PAL.N2 : undefined});
  }
  // Mas's V.O. line, as the host draws it (pov-and-framing §5.2): lowercase, x 12, baseline 198, C6 on an N0 shadow,
  // 0.5 characters a frame, held 15 frames after its last sound; wrapped upward if wider than 456
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const text = l.text.toLowerCase();
    const n = clamp(Math.floor((k - l.s) * 0.5), 0, text.length);
    if (pw(text) <= 456) { pt(fb, text.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0}); continue; }
    const rows = pwrap(text, 456);
    let left = n;
    rows.forEach((row, i) => { pt(fb, row.slice(0, Math.max(0, left)), 12, 191 - (rows.length - 1 - i) * 11, PAL.C6, {shadow: PAL.N0}); left -= row.length + 1; });
  }
};

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

// ------------------------------------------------------------------ 5.07: the third underline, with her hand in it
/** Rima's hand and marker at the whiteboard behind Gerg in drawLaunch2S (camX 330): the marker's tip rides the third
 *  underline's wet end; her sleeve runs up and away behind Gerg's head (his sprite's pixels are kept) */
export const rimaMarkerHand = (fb: Buf, f: number, wet: number, gerg: Partial<GergMediumState>) => {
  const camX = 330, bx = LAUNCH_M.board.x0 - camX, by = LAUNCH_M.board.y0;
  const lx = bx + 10 + textWidth('LAUNCH: '), uw = textWidth('LOW-KEY') + 3;
  const len = Math.round(uw * clamp(wet, 0, 1));
  const tx = lx - 1 + len, ty = by + 21 + 6 + (len > uw * 0.6 ? 1 : 0);
  const g = gergMedium({...GERG_MEDIUM_DEFAULT, type: gergTypeAt(f), ...gerg});
  const gx = 300, gy = 66;
  const isGerg = (x: number, y: number) => { const i = x - gx, j = y - gy; return i >= 0 && j >= 0 && i < g.w && j < g.h && g.c[j * g.w + i] >= 0; };
  const put = (x: number, y: number, c: number) => { if (!isGerg(x, y)) fb.set(x, y, c); };
  // the sleeve: her forearm running back to the right, rising gently toward her shoulder behind Gerg's head; the
  // jacket's grey with its lit top edge (the board's cool light) and a darker underside
  for (let s = 0; s < 40; s++) {
    const x = tx + 6 + s, yc = ty - 6 - Math.round(s * 0.35), hw = 3 + (s > 14 ? 1 : 0);
    for (let w = -hw; w <= hw; w++) put(x, yc + w, w === -hw ? PAL.G5 : w === hw ? PAL.N1 : w > 1 ? PAL.G1 : PAL.G3);
  }
  rect(tx + 5, ty - 10, 2, 8, (x, y) => put(x, y, PAL.P1)); // her shirt cuff
  // the hand closed on the marker (knuckles up), and the marker: a dark barrel, the red tip on the line
  const HAND = ['.3443.', '345543', '345554', '234443', '.2332.'];
  const hc: Record<string, number> = {'2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
  HAND.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (hc[r[i]] !== undefined) put(tx + 1 + i, ty - 8 + j, hc[r[i]]); });
  put(tx, ty - 1, PAL.R2); put(tx, ty - 2, PAL.N0); put(tx + 1, ty - 3, PAL.N0); put(tx + 1, ty - 2, PAL.N1); put(tx + 2, ty - 4, PAL.N1);
};

// ------------------------------------------------------------------ 5.04: over his shoulder onto Rima
export interface OtsRimaState {
  camX: number;
  rima: Partial<RimaPortraitState>;
  cursor: boolean;
  alyi?: LaunchMState['alyi'];
}
/** drawLaunchOTSRima's setup, re-composed: the back wall at camX (a slow drift), Rima's portrait at his desk, HIS DESK's
 *  near edge across the frame's foot (she stopped at it: the V.O. rows sit on its shadow), the button and the parked
 *  cursor on it at frame right, clear of the V.O. line, and his shoulder in the foreground */
export const otsRima = (fb: Buf, f: number, st: OtsRimaState) => {
  launchBackM(fb, st.camX, {alyi: st.alyi ?? {soft: true}, soft: 1});
  putBust(fb, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, ...st.rima}), 232, 44, {flip: true});
  const top = 178;
  for (let y = top; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, y === top ? PAL.G3 : y < top + 3 ? PAL.G2 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
  otsShoulder(fb, -44, 64, PAL.C4, {flip: true});
  drawBeigeButton(fb, 364, top + 4, {scale: 'medium'});
  if (st.cursor) drawCursor(fb, 382, top + 6);
  void f;
};

// ------------------------------------------------------------------ 5.09: the glass composite, with mouths
export interface GlassCountState {
  alyi: LaunchMState['alyi'];
  rima: Partial<RimaStandPose>;
  mas: Partial<MasPortraitState>;
}
/** drawLaunchGlass(b, f, {mas: true, rima}) re-composed so Mas's soft foreground head can speak and turn: the medium
 *  back wall at camX 460 with Alyi's reflection (any speaking state), Rima at the board, Mas soft (two rungs toward the
 *  dark) in the foreground, the button under his hand */
export const glassCount = (fb: Buf, f: number, st: GlassCountState) => {
  launchBackM(fb, 460, {alyi: st.alyi, underlines: 3});
  drawRimaStand(fb, 250, 176, {...RIMA_STAND_DEFAULT, body: 'cap', head: 'back', light: 'board', ...st.rima});
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
/** drawDeal2S with the pan as a parameter (the art's own is 110) and Tasya's x free */
export const deal2S = (fb: Buf, f: number, st: Deal2SPanState) => {
  const g = st.gerg ? (st.gerg === true ? {at: [238, 172] as [number, number], flip: true} : st.gerg) : null;
  softLobbyPan(fb, f, {check: st.check, tv: st.tv, gerg: g ? {body: 'tug', at: g.at, flip: g.flip} : null}, st.pan);
  const mx = 6, my = 96;
  drawMasMedium(fb, mx, my, {...MAS_MEDIUM_DEFAULT, light: 'warm', head: '34', look: 1, arm: 'down', ...st.mas}, {flip: true});
  drawCollarsMedium(fb, mx, my, st.collars ?? 3, {flip: true});
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
