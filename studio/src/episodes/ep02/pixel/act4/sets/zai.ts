// MR. MAS — Ep2 v1 · act4 · sc 20's right pane: THE ZAI LOBBY (JUN 10, that afternoon). The shots pass, 2026-10-09.
// The set is the art pass's (art/sets/zai: a converted warehouse, the brand-new Faraday birdcage with its shipping tag
// and padlock, the banner that's been up a while, Nole's post lamp, the visitor a silhouette at the glass), re-composed
// here for the split's 238 px pane (the art's wide spreads it over 480: the doors, the cage, the banner and Nole can't
// share a pane there) and with the close shots the pane needs:
//   zaiPane(b, f, st)      [W] 20.01-20.02 (the pane x 121..358): the banner KORG 2: NEXT QUARTER over the room, the
//                          glass doors with the visitor's silhouette, the birdcage at them (its tag, its open padlock),
//                          NOLE under his lamp (lit or off), his phone up; Mas's post lighting his phone (a small card)
//   noleMCU(b, f, st)      [MCU] 20.03: Nole (his conversation portrait, under his lamp's warm light) turned to the
//                          visitor at the doors, his phone in his hand; the cage beside him; lip-synced
//   cageClose(b, f, st)    [ECU] 20.03-20.04: the cage's bars close, his phone inside on its floor (put in by his hand),
//                          the door shutting, the padlock snapping shut; then the phone buzzing, the replies to his own
//                          post stacking up its screen where he can't reach them (nothing legible)
//   emptyHands(b, f, st)   [MCU] 20.04: Nole looks at the padlock, then at his empty hands (both open, palms up, at the
//                          frame's foot); the lamp clicks off (his warm light gone)
import {Buf, rect, line, ellipse, bayer, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {Img} from '../../../../../shared/pixel/figure';
import {noleImg, NOLE_BASE, NOLE_FOOT, nolePortraitImg} from '../../../../../shared/pixel/cast/nole';
import type {NolePose} from '../../../../../shared/pixel/cast/nole';
import {drawBirdcage} from '../../art/sets/zai';
import {makeRoom} from '../../art/cast/civic2';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {drawEp2Post} from '../../art/props/ui';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';
import {fill, bpt, bpw, vramp, warmSkin} from '../../art/kit';
import {RH, W, glow, putBustSoft} from './common';

/** the visitor: a person-shaped silhouette against the doors' daylight (no line, no face, no one we know) */
const visitor = makeRoom({kind: 'jacket', ramps: {skin: SKIN.medium, hair: HAIR.dark, suit: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], shirt: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5]}});
/** the warehouse: steel rafters high in the dark, corrugated walls, a concrete floor (the art's, unchanged) */
const warehouse = (b: Buf) => {
  vramp(b, 0, 0, W, 150, [PAL.N0, PAL.N1, PAL.N2]);
  for (let x = 0; x < W; x += 8) fill(b, x, 30, 1, 120, PAL.N1);
  for (let k = 0; k < 5; k++) { const x = 20 + k * 110; line(x, 0, x + 50, 28, b.ink(PAL.G2)); line(x + 100, 0, x + 50, 28, b.ink(PAL.G2)); fill(b, 0, 28, W, 3, PAL.G2); }
  vramp(b, 0, 150, W, RH - 150, [PAL.G1, PAL.G2]);
};
const banner = (b: Buf, cx: number) => {
  // (the fixes pass, 2026-10-10: it read KORG 2: NEXT QUARTER, a release-timeline claim over invented staging, Act
  // Two's review minor left to this act) the product's name only, on the same long banner, sun-faded (its navy blotched
  // a rung lighter, the letters a rung down), its corner peeling: a banner that has been up a while, no date on it
  const s = 'KORG 2', w = bpw('KORG 2: NEXT QUARTER') + 16, x = Math.round(cx - w / 2);
  for (const tx of [x + 6, x + w - 7]) line(tx, 28, tx, 36, b.ink(PAL.G3));
  fill(b, x, 36, w, 22, PAL.N3); fill(b, x, 36, w, 1, PAL.N5);
  for (let yy = 37; yy < 58; yy++) for (let xx = x; xx < x + w; xx++) if (bayer(xx, yy) < 0.18 + 0.25 * Math.max(0, Math.sin((xx - x) / 23) * Math.cos(yy / 7))) b.set(xx, yy, PAL.N4);
  bpt(b, s, Math.round(cx - bpw(s) / 2), 40, PAL.G4);
  for (let i = 0; i < 6; i++) b.set(x + w - 1 - i, 57 - i, PAL.N1);
  for (let i = 0; i < 5; i++) fill(b, x + w - 6 + i, 52 + i, 1, 6 - i, PAL.N5);
};
export interface ZaiPaneSt { cage?: 'empty' | 'phone'; door?: 'open' | 'shut'; padlock?: 'open' | 'locked' | 'none'; lamp?: 'on' | 'off'; nole?: Partial<NolePose> | null; lit?: number }
export const ZAI = {lamp: 330, nole: 296, cage: 196, doors: 124};
export const zaiPane = (b: Buf, f: number, st: ZaiPaneSt = {}) => {
  warehouse(b);
  banner(b, 240);
  // the glass doors (at the pane's left edge), cold daylight outside; the visitor's silhouette at them
  const D = ZAI.doors;
  fill(b, D - 4, 64, 58, 86, PAL.N3); fill(b, D, 68, 24, 82, PAL.C6); fill(b, D + 28, 68, 24, 82, PAL.C6); fill(b, D + 24, 68, 4, 82, PAL.N2);
  visitor.draw(b, D + 14, 150, {arm: 'down', head: {hair: 'short'}}, {map: () => PAL.N1});
  // the birdcage at the doors, brand new: its tag, its padlock
  drawBirdcage(b, ZAI.cage, 160, {tag: true, padlock: st.padlock === 'none' ? undefined : st.padlock ?? 'open', door: st.door ?? 'open', phone: st.cage === 'phone', f});
  // Nole's post lamp on a tall stand, his standing spot by it
  const LX = ZAI.lamp;
  fill(b, LX, 84, 3, 100, PAL.G3); fill(b, LX - 14, 182, 31, 3, PAL.G3); fill(b, LX - 22, 78, 20, 8, PAL.G4); fill(b, LX - 4, 80, 8, 2, PAL.G4);
  const lampOn = (st.lamp ?? 'off') === 'on';
  if (lampOn) { fill(b, LX - 20, 86, 16, 2, PAL.W8); for (let y = 88; y < 190; y++) for (let x = 230; x < 380; x++) { const d = Math.hypot((x - (LX - 12)) / 64, (y - 160) / 76); if (d < 1 && bayer(x, y) < (1 - d) * 0.6) b.set(x, y, stepColor(b.get(x, y), 1)); } }
  if (st.nole !== null) blitImg(b, noleImg({...NOLE_BASE, arm: 'phone', ...st.nole}), ZAI.nole - NOLE_FOOT[0], 186 - NOLE_FOOT[1], {map: lampOn ? warmSkin : undefined});
  // his phone lighting with Mas's post: a small notification card over his raised phone (Mas's post, its own UI)
  if (st.lit !== undefined && st.lit >= 0) drawEp2Post(b, 196, 64, 'jun10', {size: 'notify', w: 152, k: st.lit});
};

// ================================================================== Nole, close
/** the warehouse behind a close shot: the doors' daylight soft at the left (the visitor's silhouette in them), the
 *  rafters dark, two rungs down */
let SOFT: Buf | null = null;
const zaiSoft = () => {
  if (SOFT) return SOFT;
  const t = new Buf(W, 270, PAL.N0);
  zaiPane(t, 0, {nole: null, padlock: 'none'});
  const b = new Buf(W, RH, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(t.get(clamp(Math.round(110 + x * 0.55), 0, W - 1), clamp(Math.round(64 + y * 0.55), 0, RH - 1)), -1));
  // (the fixes pass: the art's open padlock, scaled up inside the dome, read as a small orange bird) the open padlock
  // drawn at this scale on the door's latch, its shackle up and open
  softLock(b, true);
  SOFT = b;
  return b;
};
/** viseme -> Nole's portrait mouths (0 rest, 1 teeth, 2 open, 3 round, 4 the smirk) */
export const noleMouth = (v: string): 0 | 1 | 2 | 3 | 4 => (v === 'A' ? 2 : v === 'E' ? 1 : v === 'O' ? 3 : v === 'smile' ? 4 : 0);
export const noleMCU = (b: Buf, f: number, st: {mouth?: 0 | 1 | 2 | 3 | 4; lamp?: boolean; dip?: number; phone?: boolean}) => {
  b.c.set(zaiSoft().c.subarray(0, W * RH));
  // under his lamp: his rig's monitor-cyan skin re-lit warm (his face stays his face)
  const im = nolePortraitImg({mouth: st.mouth ?? 0, jab: 0, blink: 0, brow: 0, dip: st.dip ?? 0, ...(st.phone === false ? {} : {screen: 'post' as const})});
  const lit = st.lamp !== false ? {...im, c: im.c.map((v) => (v < 0 ? v : warmSkin(v)))} : im;
  putBustSoft(b, lit, 196, 34, RH);
  if (st.lamp !== false) glow(b, 300, 60, 160, 120, 1);
  void f;
};

// ================================================================== the cage, close
/** [ECU] the cage's bars close (brass), his phone on the cage's floor behind them; `hand`: his hand (from the right)
 *  setting it down and withdrawing; the door (its own bars, open or shut) and the padlock in front (open, or snapped
 *  shut); `buzz`: the phone buzzing on 2s, `k` replies stacked up its screen (grey bars: nothing legible) */
export const cageClose = (b: Buf, f: number, st: {door: 'open' | 'shut'; padlock: 'open' | 'locked'; buzz?: boolean; k?: number; hand?: 0 | 1 | 2; snap?: boolean}) => {
  vramp(b, 0, 0, W, RH, [PAL.N0, PAL.N1, PAL.N1]);
  const bz = st.buzz && Math.floor(f / 2) % 2 ? 1 : 0;
  // the phone face up on the cage floor, its screen's glow on the bars
  // (the shots pass: drawn dark on the dark floor it didn't read through the bars; a bezel with its lit edges, the
  // screen still on his own post (its avatar, its lines, nothing legible) as it's set down, the glass's glare)
  fill(b, 166 + bz, 34, 148, 158, PAL.G1); fill(b, 166 + bz, 34, 148, 2, PAL.G4); fill(b, 166 + bz, 34, 2, 158, PAL.G3); fill(b, 312 + bz, 34, 2, 158, PAL.N0);
  fill(b, 175 + bz, 44, 130, 140, PAL.C1);
  if (!st.buzz) { fill(b, 180 + bz, 52, 120, 34, PAL.C2); fill(b, 184 + bz, 56, 9, 9, PAL.C4); fill(b, 198 + bz, 58, 80, 2, PAL.C5); fill(b, 198 + bz, 64, 92, 2, PAL.C3); fill(b, 198 + bz, 70, 60, 2, PAL.C3); }
  for (let i = 0; i < 40; i++) { const x = 260 + i, y = 44 + Math.round(i * 1.2); if (bayer(x, y) < 0.5) b.set(x + bz, y, PAL.C3); }
  if (st.buzz) {
    const n = Math.min(9, st.k ?? 0);
    for (let i = 0; i < n; i++) { const y = 168 - i * 14; fill(b, 180 + bz, y, 120, 11, PAL.C2); fill(b, 183 + bz, y + 2, 7, 7, PAL.C4); fill(b, 194 + bz, y + 3, 72 - (i * 13) % 30, 2, PAL.C5); fill(b, 194 + bz, y + 7, 40 - (i * 7) % 20, 1, PAL.C3); }
    if (bz) for (const [x, d] of [[156, -1], [326, 1]] as Array<[number, number]>) for (let q = 0; q < 3; q++) for (let i = 0; i < 6; i++) b.set(x + d * (i >> 1) + d * q * 5, 90 + q * 30 + i, PAL.C6);
    glow(b, 240, 110, 200, 120, 1);
  }
  // his hand setting the phone down (from the right, the black sleeve), withdrawing in steps
  if (st.hand !== undefined) {
    const out = st.hand * 70;
    const h = placeHand(POSES.open([-0.75, 0.35, -0.55], [0.1, -0.9, 0.42], 'R'), {s: 7, at: [300 + out, 70], anchor: 'middle', light: 'lobby', cuffRamp: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2, PAL.N3]});
    sleeve(b, h.cuffEnd, [h.cuffEnd[0] + 220, h.cuffEnd[1] - 40], 40, 46, [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3]);
    drawHand(b, h.hand, h.x, h.y);
  }
  // the bars (and the door's own bars, standing open to the right, or shut in line with the rest)
  for (let x = 120; x < 380; x += 16) { fill(b, x, 0, 4, RH, PAL.W5); fill(b, x, 0, 1, RH, PAL.W7); }
  if (st.door === 'open') for (let x = 386; x < 470; x += 12) { fill(b, x, 20, 3, 170, PAL.W4); fill(b, x, 20, 1, 170, PAL.W6); }
  fill(b, 100, 186, 300, 6, PAL.W4);
  // the padlock on the door's hasp in the foreground: its shackle up (open) or down in the body (snapped shut)
  const px = 250, py = st.door === 'shut' ? 120 : 132;
  if (st.door === 'shut' || st.padlock === 'locked') {
    const up = st.padlock === 'open' ? 10 : 0, jolt = st.snap ? 1 : 0;
    for (let i = 0; i < 26; i++) { const a = Math.PI * (i / 25); const sx = px + 16 + Math.round(Math.cos(a) * 12), sy = py - 4 - up - Math.round(Math.sin(a) * 14); fill(b, sx - 1, sy, 3, 3, PAL.G4); b.set(sx, sy, PAL.G6); }
    fill(b, px + 3, py - 4 - up, 3, 6 + up, PAL.G4); fill(b, px + 26, py - 4, 3, 6, PAL.G4);
    fill(b, px - 2 + jolt, py, 36, 30, PAL.W4); fill(b, px - 2 + jolt, py, 36, 2, PAL.W6); fill(b, px + 30 + jolt, py, 4, 30, PAL.W3);
    ellipse(px + 16 + jolt, py + 14, 3, 4, b.ink(PAL.N1)); fill(b, px + 15 + jolt, py + 16, 3, 6, PAL.N1);
    if (st.snap) for (const [dx, dy] of [[-8, -6], [-10, 2], [44, -6], [46, 2]]) b.set(px + dx, py + dy, PAL.P2);
  }
};

// ================================================================== his empty hands
/** the shots pass: Nole's portrait has his phone hand drawn in (the hand, the phone, its glowing screen, at the
 *  portrait's lower left). In 20.04 the phone is in the cage, so the hand comes off: what was above the tee's
 *  shoulder line (the portrait's torso polygon: (0,116) (10,108) (26,102) (44,97)) goes transparent, what was below it
 *  is the tee, carried in from the first column clear of the hand, with the tee's own edge row along the line */
const noPhoneHand = (im: Img): Img => {
  const c = Int32Array.from(im.c), w = im.w;
  const top = (x: number) => x <= 10 ? 116 - x * 0.8 : x <= 26 ? 108 - (x - 10) * 0.375 : 102 - (x - 26) * 5 / 18;
  for (let y = 48; y < Math.min(im.h, 124); y++) for (let x = 0; x < 30; x++) {
    const t = Math.ceil(top(x));
    c[y * w + x] = y < t ? -1 : y === t ? im.c[(t + 1) * w + 33] === -1 ? -1 : stepColor(im.c[Math.min(im.h - 1, y + 4) * w + 33], 1) : im.c[y * w + 33];
  }
  return {...im, c};
};
/** the soft room behind 20.04's MCU (the fixes pass, 2026-10-10, the episode review's minor: his caged phone read as a
 *  small orange bird: the soft background still had the empty cage, its door open and its open padlock hanging
 *  inside the dome): the cage shut and locked, his own phone inside it, lit and buzzing, replies stacking up its screen
 *  (grey bars, nothing legible), drawn at the MCU's own scale over the soft room; the padlock on the door's latch,
 *  its shackle closed */
let SOFT_LOCKED: Buf | null = null;
const zaiSoftLocked = () => {
  if (SOFT_LOCKED) return SOFT_LOCKED;
  const t = new Buf(W, 270, PAL.N0);
  zaiPane(t, 0, {nole: null, door: 'shut', padlock: 'none'});
  const b = new Buf(W, RH, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(t.get(clamp(Math.round(110 + x * 0.55), 0, W - 1), clamp(Math.round(64 + y * 0.55), 0, RH - 1)), -1));
  SOFT_LOCKED = b;
  return b;
};
const cagedPhone = (b: Buf, f: number, n: number) => {
  const X = (px: number) => Math.round((px - 110) / 0.55), Y = (py: number) => Math.round((py - 64) / 0.55);
  const cx = ZAI.cage, base = 130, hw = 20;
  const bz = Math.floor(f / 2) % 2;
  // the phone standing on the cage's floor, leaning on the back bars: bezel, lit screen, the replies stacking up it
  const x0 = X(cx) - 15 + bz, y0 = Y(base - 3) - 40, pw0 = 22, ph0 = 40;
  glow(b, x0 + pw0 / 2, y0 + ph0 / 2, 30, 34, 1);
  fill(b, x0, y0, pw0, ph0, PAL.N0); fill(b, x0 + 1, y0, pw0 - 2, 1, PAL.G4); fill(b, x0, y0 + 1, 1, ph0 - 2, PAL.G3);
  fill(b, x0 + 2, y0 + 3, pw0 - 4, ph0 - 6, PAL.C5); fill(b, x0 + 8, y0 + 1, 6, 1, PAL.N1);
  for (let i = 0; i < Math.min(5, n); i++) { const yy = y0 + ph0 - 7 - i * 6; fill(b, x0 + 3, yy, pw0 - 6, 5, PAL.P1); fill(b, x0 + 4, yy + 1, 3, 3, PAL.C3); fill(b, x0 + 8, yy + 1, 9 - (i * 3) % 5, 1, PAL.G4); fill(b, x0 + 8, yy + 3, 6 - (i * 2) % 3, 1, PAL.G5); }
  // the buzz: two short ticks either side, on 2s
  if (bz) for (const d of [-1, 1]) for (let q = 0; q < 2; q++) fill(b, d < 0 ? x0 - 4 - q * 3 : x0 + pw0 + 2 + q * 3, y0 + 10 + q * 9, 1, 5, PAL.C6);
  // the cage's front bars over it (brass, a rung down in the soft light)
  for (let i = -hw; i <= hw; i += 4) { const xx = X(cx + i); fill(b, xx, Y(base - 22), 2, Y(base - 3) - Y(base - 22), PAL.W4); b.set(xx, Y(base - 22), PAL.W5); }
  softLock(b, false);
};
/** the padlock at the MCU's scale on the cage door's latch (its right edge): `open` the shackle up, one leg out of the
 *  body; locked, the shackle's arch down into it */
function softLock(b: Buf, open: boolean) {
  const X = (px: number) => Math.round((px - 110) / 0.55), Y = (py: number) => Math.round((py - 64) / 0.55);
  const lx = X(ZAI.cage + 6) - 2, ly = Y(130 - 12), up = open ? 5 : 0;
  for (let i = 0; i < 12; i++) { const a = Math.PI * (i / 11); fill(b, lx + 5 + Math.round(Math.cos(a) * 4), ly - 1 - up - Math.round(Math.sin(a) * 5), 2, 2, PAL.G5); }
  if (open) fill(b, lx + 1, ly - up - 1, 2, up + 1, PAL.G5);
  fill(b, lx, ly, 12, 10, PAL.W5); fill(b, lx, ly, 12, 1, PAL.W7); fill(b, lx + 11, ly, 1, 10, PAL.W3); fill(b, lx + 5, ly + 3, 2, 4, PAL.N1);
}
export const emptyHands = (b: Buf, f: number, st: {lamp: boolean; down: boolean; buzz?: number}) => {
  b.c.set(zaiSoftLocked().c.subarray(0, W * RH));
  cagedPhone(b, f, st.buzz ?? 5);
  if (!st.lamp) for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  const im = noPhoneHand(nolePortraitImg({mouth: 0, jab: 0, blink: st.down ? 1 : 0, brow: 1, dip: st.down ? 6 : 0}));
  const lit = st.lamp ? {...im, c: im.c.map((v) => (v < 0 ? v : warmSkin(v)))} : {...im, c: im.c.map((v) => (v < 0 ? v : stepColor(v, -1)))};
  putBustSoft(b, lit, 186, 30, RH);
  // his two hands at the frame's foot, open, palms up, empty (the black tee's forearms down out of frame)
  if (st.down) {
    const skin = st.lamp ? (c: number) => warmSkin(c) : (c: number) => stepColor(c, -1);
    for (const [x, side, fx] of [[206, 'L', 0.55], [294, 'R', -0.55]] as Array<[number, 'L' | 'R', number]>) {
      const h = placeHand(POSES.open([fx, -0.55, 0.62], [0, 0.85, 0.5], side), {s: 4.6, at: [x, 186], anchor: 'middle', light: 'lobby', skinMap: skin, cuffRamp: [PAL.S2, PAL.S3, PAL.S3, PAL.S4, PAL.S4, PAL.S5, PAL.S5]});
      sleeve(b, h.cuffEnd, [h.cuffEnd[0] + (side === 'L' ? -30 : 30), RH + 60], 15, 20, [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S4].map(skin));
      drawHand(b, h.hand, h.x, h.y, {map: skin});
    }
  }
  void f;
};
void rect; void ellipse;
