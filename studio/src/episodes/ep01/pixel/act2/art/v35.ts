// MR. MAS — Ep1 Act Two art for v3.5 (script draft 8.4; the `v3-shots-act2-act3` pass, the final version). New, additive,
// namespaced to Act Two: nothing here edits another pass's module; the shared rooms, rigs and kits are composed from their
// exports (the Senate's `noClone` is an opt-in option on rooms/senate.ts). Native 480 x 270, the room area rows 0..202, the
// master palette, whole-pixel moves, held drawings.
//   sc 26  phoneReminder         the generic calendar reminder (the cold open's invite card's look) over his feed
//   sc 27  drawWalletSet         [INSERT] his hand sets the wallet down on the witness table's baize (the 2019 match)
//          drawDaisPad           [INSERT] a senator's pen over a blank pad, nothing to write (hands only)
//          drawGavel             the chairman's gavel on the dais (up / down), laid over rooms/senate drawSenateDais
//   sc 28  MAR 2019, NopeAI's first office BY DAY in the T3 memory tier (cut-paper: flat shapes, a one-rung shadow down
//          and right, three-tone figures with a cut edge, paper grain), Act One's JUN 2018 room a year on (the same
//          warehouse windows at back left, the same two racks, the whiteboard on wheels where the monitor wall stood):
//          drawTrayMarker        [INSERT] the same hand, same place in frame, sets a marker on the whiteboard's tray
//          office2019            [W] Gerg's cloud bill unrolling to the floor, Mas at the board, Alyi and Mada at the
//                                table, THE QUIET VOTE's chair turned away
//          board2S               [2S] the whiteboard large, the diagram building on his lines (NONPROFIT · THE BOARD →
//                                CAPPED PROFIT · 100x → CEO · EQUITY: 0), his writing arm, Alyi in the foreground
//          mada2S                [2S] Mada at the table (the spinner), the Quiet Vote's chair turned away, the board's
//                                lower box where his hand draws the stick figure
//          drawCheckDoor         [INSERT] the landlord's first check slides in under the office door (JUL 2019)
//          frontSweep            the intro's render front (shared transitions.renderFront, dir right in, left out)
//   sc 29  drawPassport          [INSERT] his passport's visa pages, seven stamps one a beat (the stamp comes down)
//          drawFlagHands         [INSERT] his page slides across a table to two hands under a desk flag (no faces)
//          drawLectern           [M] a lectern in a generic hall (no crest), MAS lip-synced, the one-pixel smile
//          drawPhonePost         [POV] a post on his phone on a hotel desk (NOTERB's; his, his thumb on Post)
//          drawGuestBook         [INSERT] his pen signs a guest book under a flag's fringe; `toLetter` the page becomes
//                                the one-sentence letter under the same hand, pen and signature
//   sc 30  drawLetterDesk        [INSERT] the one-sentence letter on many desks: the sleeves and desks swap, the names
//                                scroll, + HUNDREDS MORE
//   sc 30A drawOtherOrders       the other signers' hands, each with a purchase order, round Mario's
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf, FAMILIES} from '../../../../../shared/pixel/palette';
import {text, textWidth, bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {pt, pw, pwrap} from '../../../../../shared/pixel/kits/uitype';
import {tiny, tinyWidth} from '../../../../../shared/pixel/rooms/kit-b';
import {renderFront, frontPos} from '../../../../../shared/pixel/transitions';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/mas-medium';
import type {MasMediumState} from '../../../../../shared/pixel/cast/mas-medium';
import {drawGergPose} from '../../../../../shared/pixel/cast/gerg-poses';
import {alyiSpeakPortrait, ALYI_SPEAK_DEFAULT} from '../../../../../shared/pixel/cast/alyi-speak';
import type {AlyiSpeakState} from '../../../../../shared/pixel/cast/alyi-speak';
import {drawAlyiTable} from '../../../../../shared/pixel/cast/alyi';
import {drawMadaSeated, MADA_SEAT_DEFAULT} from '../../../../../shared/pixel/cast/mada';
import {drawMadaMedium, MADA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/mada-medium';
import type {MadaMediumState} from '../../../../../shared/pixel/cast/mada-medium';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {drawRegulateSheet} from '../../../../../shared/pixel/kits/senate-props';
import {drawPost} from '../../../../../shared/pixel/kits/post-card';
import type {PostSpec} from '../../../../../shared/pixel/kits/post-card';
import {drawPostFor} from '../../../../../shared/pixel/kits/post-any';
import type {PosterAny} from '../../../../../shared/pixel/kits/post-any';
import {drawRestingHand, penWord} from './half-written';

const RH = 203;
const TR = 0x1000000;

// ================================================================== the T3 memory tier (cut-paper)
// The same recipe as Act One's JUN 2018 (act1/art/v35.ts, private there, re-stated here so the two passes don't share a
// file in flight): a layer drawn flat and laid on the page with a one-rung shadow down and right; a sprite flattened to
// three tones with a cut edge a rung up on its top and left; the paper's static grain.
const paper = (b: Buf, draw: (t: Buf) => void, sh = 1) => {
  const t = new Buf(480, RH, TR);
  draw(t);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (t.c[y * 480 + x] === TR) continue;
    for (let s = 1; s <= sh; s++) { const X = x + s, Y = y + s; if (X < 480 && Y < RH && t.c[Y * 480 + X] === TR) b.set(X, Y, stepColor(b.get(X, Y), -2)); }
  }
  for (let i = 0; i < 480 * RH; i++) if (t.c[i] !== TR) b.c[i] = t.c[i];
};
const POST3 = (c: number) => {
  const fm = familyOf(c); if (!fm) return c;
  const [fam, i] = fm, R = FAMILIES[fam], n = R.length;
  const lv = i < n * 0.36 ? Math.max(0, Math.round(n * 0.15)) : i < n * 0.7 ? Math.round(n * 0.5) : Math.min(n - 1, Math.round(n * 0.78));
  return R[Math.min(n - 1, lv)];
};
const SKIN_FAMS = new Set(['S', 'K', 'X']);
const paperSprite = (b: Buf, draw: (t: Buf) => void, o: {keepSkin?: boolean} = {}) => {
  const t = new Buf(480, RH, TR);
  draw(t);
  for (let i = 0; i < 480 * RH; i++) if (t.c[i] !== TR) { const fm = o.keepSkin === false ? null : familyOf(t.c[i]); if (!fm || !SKIN_FAMS.has(fm[0])) t.c[i] = POST3(t.c[i]); }
  paper(b, (p) => {
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const v = t.c[y * 480 + x]; if (v === TR) continue;
      const up = y === 0 || t.c[(y - 1) * 480 + x] === TR, left = x === 0 || t.c[y * 480 + x - 1] === TR;
      p.c[y * 480 + x] = up || left ? stepColor(v, 1) : v;
    }
  });
};
const grain = (b: Buf, x0 = 0, y0 = 0, x1 = 480, y1 = RH) => {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const h = hash(x, y, 97);
    if (h < 0.035) b.set(x, y, stepColor(b.get(x, y), 1)); else if (h > 0.975) b.set(x, y, stepColor(b.get(x, y), -1));
  }
};
/** a capsule (a limb, a pen): lit top edge, shaded underside, keyline */
const capsule = (b: Buf, x0: number, y0: number, x1: number, y1: number, w: number, pal: [number, number, number, number]) => {
  const L = Math.max(1, Math.hypot(x1 - x0, y1 - y0)), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  for (let t = -w; t <= L + w; t += 0.5) for (let q = -w; q <= w; q += 0.5) {
    const beyond = t < 0 ? -t : t > L ? t - L : 0;
    const d = Math.hypot(beyond, q); if (d > w) continue;
    const X = Math.round(x0 + ux * t - uy * q), Y = Math.round(y0 + uy * t + ux * q);
    b.set(X, Y, d > w - 0.9 ? pal[0] : q < -w * 0.4 ? pal[3] : q < w * 0.35 ? pal[2] : pal[1]);
  }
};

/** a hand writing (or about to): the pen's tip at (tx, ty), the pen up and right at 45°, the index finger along its top,
 *  the thumb under it, the fist, the cuff and the sleeve running off the frame's upper right */
export const penHand = (b: Buf, tx: number, ty: number, o: {sleeve: [number, number, number, number]; cuff?: number; lit?: boolean} = {sleeve: [PAL.G0, PAL.G2, PAL.G3, PAL.G4]}) => {
  const SK: [number, number, number, number] = [PAL.S1, PAL.S3, PAL.S4, o.lit ? PAL.S6 : PAL.S5];
  capsule(b, tx + 70, ty - 42, tx + 230, ty - 132, 17, o.sleeve);
  if (o.cuff !== undefined) capsule(b, tx + 60, ty - 36, tx + 72, ty - 43, 12, [PAL.N0, stepColor(o.cuff, -1), o.cuff, stepColor(o.cuff, 1)]);
  for (let j = -16; j <= 16; j++) for (let i = -22; i <= 22; i++) {
    const e = Math.hypot(i / 22, j / 16); if (e >= 1) continue;
    b.set(tx + 44 + i, ty - 26 + j, e > 0.9 ? SK[0] : j < -7 ? SK[3] : j < 5 ? SK[2] : SK[1]);
  }
  for (let n = 0; n < 3; n++) { b.set(tx + 36 + n * 8, ty - 38 + n * 2, PAL.S2); b.set(tx + 37 + n * 8, ty - 37 + n * 2, PAL.S2); }
  capsule(b, tx + 36, ty - 14, tx + 14, ty - 3, 5, SK);
  capsule(b, tx, ty, tx + 40, ty - 36, 2, [PAL.N0, PAL.N1, PAL.N3, PAL.G5]);
  capsule(b, tx + 32, ty - 34, tx + 9, ty - 10, 5, SK);
  rect(tx + 8, ty - 13, 4, 3, b.ink(PAL.S6)); // the index finger's nail
};

// ================================================================== the render front (the intro's glowing seam)
/** the intro's front (dev/meras: 12 frames, a white-hot core in the cyan glow), between two drawings of this frame:
 *  `from` ahead of it, `to` behind it; dir 'right' into a memory, 'left' back out */
export const frontSweep = (b: Buf, k: number, from: (t: Buf) => void, to: (t: Buf) => void, dir: 'right' | 'left', frames = 12) => {
  const A = new Buf(480, 270, PAL.N0), B = new Buf(480, 270, PAL.N0);
  from(A); to(B);
  const {pos, smear} = frontPos(k, 0, frames, 480, 5);
  const out = new Buf(480, 270, PAL.N0);
  renderFront(out, A, B, pos, {dir, smear, glow: 5, core: [PAL.C9, PAL.C8, PAL.C7, PAL.C6, PAL.C5], tear: 1});
  for (let i = 0; i < 480 * RH; i++) b.c[i] = out.c[i];
};

// ================================================================== sc 26 · the reminder over his feed
/** the generic calendar reminder (the cold open's invite card's look: the page glyph with its red head band, the grey
 *  label, the title legible, a thin rule), sized for the phone's screen; `k` = frames since it started to slide */
export const REMINDER = {l1: 'SENATE JUDICIARY', l2: 'MAY 16 · TESTIFY', w: 108, h: 50};
export const phoneReminder = (b: Buf, px: number, py: number, pwid: number, k: number) => {
  if (k < 0) return;
  const slide = k === 0 ? -34 : k === 1 ? -14 : k === 2 ? -4 : 0;
  const {w, h} = REMINDER;
  const x = px + Math.round((pwid - w) / 2), y = py + 14 + slide;
  const t = new Buf(480, RH, TR);
  rect(x + 1, y + h, w - 2, 2, t.ink(PAL.N0));
  rect(x, y + 1, w, h - 2, t.ink(PAL.P2)); rect(x + 1, y, w - 2, h, t.ink(PAL.P2));
  rect(x + 5, y + 5, 11, 11, t.ink(PAL.G4)); rect(x + 6, y + 6, 9, 9, t.ink(PAL.P1)); rect(x + 6, y + 6, 9, 3, t.ink(PAL.R2));
  t.set(x + 8, y + 4, PAL.N2); t.set(x + 12, y + 4, PAL.N2);
  for (const [i, j] of [[8, 11], [10, 11], [12, 11], [8, 13], [10, 13]]) t.set(x + i, y + j, PAL.G4);
  text(t, 'reminder', x + 21, y + 7, PAL.G4);
  text(t, REMINDER.l1, x + 6, y + 21, PAL.N1);
  text(t, REMINDER.l2, x + 6, y + 32, PAL.N1);
  rect(x + 6, y + 44, w - 12, 1, t.ink(PAL.G5));
  // clipped to the screen (below its header bar)
  for (let yy = py + 10; yy < Math.min(RH, py + 200); yy++) for (let xx = px; xx < px + pwid; xx++) { const v = t.c[yy * 480 + xx]; if (v !== TR) b.set(xx, yy, v); }
};

// ================================================================== sc 27 · the witness table, close
const baize = (b: Buf) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 18 ? (bayer(x, y) < 0.3 ? PAL.L0 : PAL.N1) : bayer(x, y) < 0.3 ? PAL.L1 : PAL.L0); };
/** the closed wallet (worn brown leather, a stitched edge) at (x, y), 124 x 62 */
const wallet = (b: Buf, x: number, y: number, shadow = true) => {
  const w = 124, h = 62;
  if (shadow) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i + 4, y + j + 4, PAL.N1);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const e = Math.min(i, j, w - 1 - i, h - 1 - j);
    b.set(x + i, y + j, e < 1 ? PAL.D0 : e < 3 ? PAL.D3 : e === 4 && (i + j) % 3 === 0 ? PAL.W3 : i < w * 0.3 ? PAL.D4 : PAL.D3);
  }
  rect(x + 3, y + h - 12, w - 6, 1, b.ink(PAL.D1)); // the fold's lip
};
/** [INSERT] 15.14's out: his hand sets the wallet down on the witness table, `drop` px still to fall (held steps) */
export const drawWalletSet = (b: Buf, f: number, st: {drop: number}) => {
  baize(b);
  const d = -Math.max(0, st.drop);
  wallet(b, 184, 108 + d, st.drop <= 0);
  if (st.drop > 0) for (let j = 0; j < 62; j++) for (let i = 0; i < 124; i++) if (bayer(i, j) < 0.5) b.set(184 + i + 6 + (st.drop >> 2), 108 + j + 6, PAL.N1); // its shadow, apart
  drawRestingHand(b, 116 + d);
  void f;
};
/** [INSERT] 28.05: a senator's hand and pen hovering over a blank yellow pad on the dais's walnut, nothing written */
export const drawDaisPad = (b: Buf, f: number, st: {k: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x + (y >> 3)) % 34 === 0 ? PAL.D4 : bayer(x, y) < 0.2 ? PAL.D2 : PAL.D3);
  // the pad (legal yellow: the tungsten ramp's pale end), its ruled lines and red margin, blank
  const X = 120, Y = 20, W = 220, H = 170;
  rect(X + 4, Y + 4, W, H, b.ink(PAL.D1));
  rect(X, Y, W, H, b.ink(PAL.W8)); rect(X, Y, W, 10, b.ink(PAL.D1)); rect(X, Y + 10, W, 1, b.ink(PAL.W7));
  for (let yy = Y + 22; yy < Y + H; yy += 9) for (let xx = X + 2; xx < X + W - 2; xx++) b.set(xx, yy, PAL.C7);
  for (let yy = Y + 11; yy < Y + H; yy++) b.set(X + 30, yy, PAL.R3);
  // the hand from the frame's right, the pen's tip over the first line, hovering (a pixel up and down on 8s)
  const bob = Math.floor(st.k / 8) % 2;
  penHand(b, X + 70, Y + 54 - bob, {sleeve: [PAL.N0, PAL.N2, PAL.N3, PAL.N5], cuff: PAL.P2});
  void f;
};
/** the chairman's gavel on the bench top (drawSenateDais: the chair at x 250, the bench top at y 98): 'up' raised in
 *  his hand, 'down' struck on its block */
export const drawGavel = (b: Buf, pos: 'up' | 'down') => {
  const bx = 222, by = 96;
  rect(bx - 6, by - 3, 16, 3, b.ink(PAL.D1)); rect(bx - 6, by - 3, 16, 1, b.ink(PAL.D4)); // the sound block
  const head = pos === 'up' ? [bx - 8, by - 34] : [bx - 6, by - 11];
  const hand = pos === 'up' ? [bx + 12, by - 22] : [bx + 16, by - 4];
  line(head[0] + 6, head[1] + 4, hand[0], hand[1], b.ink(PAL.D4));
  line(head[0] + 6, head[1] + 5, hand[0], hand[1] + 1, b.ink(PAL.D2));
  rect(head[0], head[1], 12, 8, b.ink(PAL.D3)); rect(head[0], head[1], 12, 1, b.ink(PAL.W4)); rect(head[0] + 3, head[1], 1, 8, b.ink(PAL.W5)); rect(head[0] + 8, head[1], 1, 8, b.ink(PAL.W5));
  ellipse(hand[0] + 2, hand[1], 4, 3, b.ink(PAL.S4)); b.set(hand[0] + 1, hand[1] - 2, PAL.S5);
};

/** [INSERT] 28.05's out: the chairman's gavel, close, over its sound block on the bench's walnut: 'up' raised, 'mid'
 *  coming down, 'down' struck (the knock the passport's stamp takes over) */
export const drawGavelECU = (b: Buf, f: number, st: {pos: 'up' | 'mid' | 'down'}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 40 ? (bayer(x, y) < 0.3 ? PAL.N3 : PAL.N2) : (x + Math.floor(y * 0.4)) % 53 < 2 ? PAL.D4 : bayer(x, y) < 0.2 ? PAL.D2 : PAL.D3);
  rect(0, 40, 480, 2, b.ink(PAL.W5)); rect(0, 42, 480, 1, b.ink(PAL.D1)); // the bench's gold trim at its far edge
  // the sound block: a round walnut puck, its lit rim
  for (let y = 130; y < 190; y++) for (let x = 150; x < 330; x++) {
    const top = Math.hypot((x - 240) / 90, (y - 150) / 20), side = y > 150 && Math.abs(x - 240) < 90 * Math.sqrt(Math.max(0, 1 - ((Math.min(y, 170) - 150) / 20) ** 2)) + 0;
    if (top < 1) b.set(x, y, top > 0.9 ? PAL.W4 : PAL.D4);
    else if (side && y < 172 && Math.abs(x - 240) < 90) b.set(x, y, x < 200 ? PAL.D3 : PAL.D2);
  }
  // the gavel: the head (a turned walnut cylinder with two brass bands), the handle up to his hand at the right
  const hy = st.pos === 'up' ? 28 : st.pos === 'mid' ? 76 : 112, tilt = st.pos === 'up' ? -10 : st.pos === 'mid' ? -4 : 0;
  const hx0 = 176, hx1 = 300;
  for (let x = hx0; x < hx1; x++) {
    const yy = hy + Math.round(((x - hx0) / (hx1 - hx0)) * tilt);
    for (let j = 0; j < 38; j++) {
      const band = (x > hx0 + 18 && x < hx0 + 26) || (x > hx1 - 26 && x < hx1 - 18);
      const e = x < hx0 + 3 || x > hx1 - 4 || j === 0 || j === 37;
      b.set(x, yy + j, e ? PAL.D0 : band ? (j < 10 ? PAL.W7 : PAL.W5) : j < 8 ? PAL.D4 : j < 28 ? PAL.D3 : PAL.D2);
    }
  }
  const mx = 238, my = hy + 19 + Math.round(tilt / 2);
  capsule(b, mx, my - 18, mx + 150, my - 150, 7, [PAL.D0, PAL.D2, PAL.D3, PAL.D4]);
  // his hand round the handle, the white cuff, the charcoal sleeve off the frame's top right
  for (let j = -18; j <= 18; j++) for (let i = -24; i <= 24; i++) { const e = Math.hypot(i / 24, j / 18); if (e < 1) b.set(mx + 96 + i, my - 98 + j, e > 0.9 ? PAL.S1 : j < -8 ? PAL.S5 : j < 6 ? PAL.S4 : PAL.S3); }
  for (let n = 0; n < 3; n++) { b.set(mx + 84 + n * 8, my - 110 + n * 2, PAL.S2); b.set(mx + 85 + n * 8, my - 109 + n * 2, PAL.S2); }
  capsule(b, mx + 120, my - 118, mx + 132, my - 128, 13, [PAL.N0, PAL.P1, PAL.P2, PAL.W9]);
  capsule(b, mx + 132, my - 128, mx + 260, my - 230, 20, [PAL.N0, PAL.G0, PAL.G1, PAL.G2]);
  if (st.pos === 'down') for (const [dx, dy] of [[-14, -6], [-20, 4], [14 + 124, -6], [20 + 124, 4]]) line(hx0 + dx, hy + 30 + dy, hx0 + dx + (dx < 0 ? -10 : 10), hy + 30 + dy + 2, b.ink(PAL.W6)); // the knock
  void f;
};

// ================================================================== sc 28 · MAR 2019: NopeAI's first office, by day
/** Act One's JUN 2018 room (act1/art/v35.ts OFFICE) a year on: the same floor line, windows and racks */
export const OFFICE19 = {floorY: 150, win: {x0: 18, x1: 164, y0: 44, y1: 118}, racks: [376, 424], board: {x0: 176, x1: 364, y0: 44, y1: 128}};
const brick = (x: number, y: number) => {
  const row = Math.floor(y / 6), off = row % 2 ? 9 : 0;
  const mortar = y % 6 === 5 || (x + off) % 18 === 17;
  return mortar ? PAL.P0 : hash(Math.floor((x + off) / 18), row, 41) < 0.2 ? PAL.P0 : PAL.P1;
};
/** the room's back wall, floor, ceiling pipes, the windows' daylight and its patches on the floor (cut paper) */
const officeDay = (b: Buf) => {
  const O = OFFICE19;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 10 ? PAL.G4 : y < O.floorY ? brick(x, y) : (y - O.floorY) % 9 === 0 ? PAL.D3 : PAL.D4);
  paper(b, (t) => { rect(0, 4, 480, 3, t.ink(PAL.G5)); rect(0, 38, 480, 2, t.ink(PAL.G4)); for (const x of [60, 200, 330, 450]) rect(x, 0, 3, 10, t.ink(PAL.G5)); });
  // the warehouse windows at back left: a pale sky, the neighbours' flat tops in the haze
  paper(b, (t) => {
    const W = O.win;
    rect(W.x0 - 3, W.y0 - 3, W.x1 - W.x0 + 6, W.y1 - W.y0 + 6, t.ink(PAL.G2));
    for (let y = W.y0; y < W.y1; y++) for (let x = W.x0; x < W.x1; x++) t.set(x, y, y < W.y0 + 30 ? (bayer(x, y) < 0.3 ? PAL.C7 : PAL.C8) : PAL.C7);
    const bld: Array<[number, number, number]> = [[18, 84, 22], [40, 72, 16], [56, 90, 26], [82, 66, 14], [96, 80, 30], [126, 74, 18], [144, 88, 20]];
    for (const [bx, top, bw] of bld) { rect(bx, top, bw, W.y1 - top, t.ink(PAL.G6)); for (let yy = top + 3; yy < W.y1 - 2; yy += 5) for (let xx = bx + 2; xx < bx + bw - 2; xx += 4) if (hash(xx, yy, 13) < 0.3) t.set(xx, yy, PAL.G5); }
    for (let x = W.x0; x < W.x1; x += 37) rect(x, W.y0, 3, W.y1 - W.y0, t.ink(PAL.G2));
    rect(W.x0, W.y0 + 34, W.x1 - W.x0, 3, t.ink(PAL.G2));
  });
  // the daylight's patches: slanting across the floor from the windows (the panes' shape, cut paper a rung lighter)
  for (let y = O.floorY + 2; y < RH; y++) for (let x = 0; x < 300; x++) {
    const u = x - (y - O.floorY) * 1.3 - 20;
    if (u > 10 && u < 140 && Math.floor(u / 37) === Math.floor((u + 3) / 37) && y < O.floorY + 34 && bayer(x, y) < 0.3) b.set(x, y, PAL.W4);
  }
};
/** the two racks (the same two as 2018, INVIDIA on their plates), lit by day */
const racksDay = (b: Buf, f: number) => {
  paper(b, (t) => {
    for (const rx of OFFICE19.racks) {
      rect(rx, 50, 42, OFFICE19.floorY - 50, t.ink(PAL.G2)); rect(rx, 50, 42, 2, t.ink(PAL.G4)); rect(rx + 40, 50, 2, OFFICE19.floorY - 50, t.ink(PAL.G1));
      for (let u = 0; u < 12; u++) { const yy = 60 + u * 7; rect(rx + 3, yy, 36, 5, t.ink(PAL.G1)); for (let q = 0; q < 6; q++) rect(rx + 5 + q * 5, yy + 2, 3, 1, t.ink(PAL.G3)); }
      rect(rx + 3, 53, 36, 7, t.ink(PAL.N1)); tiny(t, 'INVIDIA', rx + 21 - (tinyWidth('INVIDIA') >> 1), 54, PAL.G6);
    }
  });
  for (const rx of OFFICE19.racks) for (let u = 0; u < 12; u++) if (hash(u, rx, Math.floor(f / 6)) < 0.5) b.set(rx + 36, 62 + u * 7, PAL.L3);
};

// ------------------------------------------------------------------ the whiteboard and its diagram
/** the marker's ink (the dry-erase blue) and the red one for the cap */
const INK = PAL.I0, RED = PAL.R2;
export interface DiagramState {
  /** the lower box: 0..4 of its sides drawn (held steps: left, bottom, right, top), then the arrow at 5 */
  box2?: number;
  /** characters of CAPPED PROFIT written */
  capped?: number;
  /** characters of 100x written */
  x100?: number;
  /** underlines under the top box (the tap on "the board.") */
  tap?: number;
  /** the stick figure's strokes (0..5: head, body, arms, legs) */
  stick?: number;
  /** characters of CEO · EQUITY: 0 written */
  equity?: number;
}
export const DIAGRAM = {top: {x: 70, y: 12, w: 124, h: 22}, low: {x: 58, y: 54, w: 148, h: 70}, x100: {x: 214, y: 76}};
const ink2 = (b: Buf, x0: number, y0: number, x1: number, y1: number, col = INK) => { line(x0, y0, x1, y1, b.ink(col)); if (x0 === x1) line(x0 + 1, y0, x1 + 1, y1, b.ink(col)); else line(x0, y0 + 1, x1, y1 + 1, b.ink(col)); };
/** the board's diagram at board origin (X, Y); `clip` keeps it on the board */
export const drawDiagram = (b: Buf, X: number, Y: number, st: DiagramState) => {
  const T = DIAGRAM.top, Lw = DIAGRAM.low;
  // the top box (on the board from the start): NONPROFIT · THE BOARD
  const tx = X + T.x, ty = Y + T.y;
  ink2(b, tx, ty, tx + T.w, ty); ink2(b, tx, ty + T.h, tx + T.w, ty + T.h); ink2(b, tx, ty, tx, ty + T.h); ink2(b, tx + T.w, ty, tx + T.w, ty + T.h);
  const s1 = 'NONPROFIT · THE BOARD';
  pt(b, s1, tx + Math.round((T.w - pw(s1)) / 2) + 1, ty + 8, INK);
  for (let u = 0; u < (st.tap ?? 0); u++) ink2(b, tx + 8, ty + T.h + 4 + u * 3, tx + T.w - 8, ty + T.h + 4 + u * 3);
  // the lower box, side by side on his line, then the arrow down to it
  const lx = X + Lw.x, ly = Y + Lw.y, n = st.box2 ?? 0;
  if (n >= 1) ink2(b, lx, ly, lx, ly + Lw.h);
  if (n >= 2) ink2(b, lx, ly + Lw.h, lx + Lw.w, ly + Lw.h);
  if (n >= 3) ink2(b, lx + Lw.w, ly, lx + Lw.w, ly + Lw.h);
  if (n >= 4) ink2(b, lx, ly, lx + Lw.w, ly);
  if (n >= 5) { const ax = tx + (T.w >> 1); ink2(b, ax, ty + T.h + 2, ax, ly - 3); ink2(b, ax - 4, ly - 7, ax, ly - 3); ink2(b, ax + 4, ly - 7, ax, ly - 3); }
  const s2 = 'CAPPED PROFIT';
  if (st.capped) pt(b, s2.slice(0, st.capped), lx + Math.round((Lw.w - pw(s2)) / 2), ly + 6, INK);
  if (st.x100) bigText(b, '100x'.slice(0, st.x100), X + DIAGRAM.x100.x, Y + DIAGRAM.x100.y, RED);
  // the stick figure in the lower box's lower left and its label: CEO · EQUITY: 0
  const sx = lx + 30, sy = ly + 22, k = st.stick ?? 0;
  if (k >= 1) ellipse(sx, sy + 4, 4, 4, b.ink(INK)), ellipse(sx, sy + 4, 2, 2, b.ink(PAL.P2));
  if (k >= 2) ink2(b, sx, sy + 9, sx, sy + 22);
  if (k >= 3) ink2(b, sx - 7, sy + 13, sx + 7, sy + 13);
  if (k >= 4) ink2(b, sx, sy + 22, sx - 6, sy + 31);
  if (k >= 5) ink2(b, sx, sy + 22, sx + 6, sy + 31);
  const s3 = 'CEO · EQUITY: 0';
  if (st.equity) pt(b, s3.slice(0, st.equity), sx + 14, sy + 14, INK);
};
/** the board: aluminium frame, the white surface with old ghosts, the tray; its wheeled stand under it (to `standTo`) */
const board = (t: Buf, x0: number, y0: number, x1: number, y1: number, standTo?: number) => {
  rect(x0 - 3, y0 - 3, x1 - x0 + 6, y1 - y0 + 6, t.ink(PAL.G5));
  rect(x0 - 3, y0 - 3, x1 - x0 + 6, 1, t.ink(PAL.G6));
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) t.set(x, y, hash(x >> 3, y >> 2, 61) < 0.05 && bayer(x, y) < 0.5 ? PAL.G6 : PAL.P2);
  // the tray
  rect(x0 - 3, y1 + 3, x1 - x0 + 6, 4, t.ink(PAL.G4)); rect(x0 - 3, y1 + 3, x1 - x0 + 6, 1, t.ink(PAL.G6));
  if (standTo !== undefined) {
    for (const lx of [x0 + 16, x1 - 18]) { rect(lx, y1 + 7, 3, standTo - y1 - 9, t.ink(PAL.G3)); rect(lx - 10, standTo - 3, 23, 2, t.ink(PAL.G3)); t.set(lx - 10, standTo - 1, PAL.N1); t.set(lx + 12, standTo - 1, PAL.N1); }
  }
};
/** the marker lying on the tray / in his hand (a fat dry-erase pen: white barrel, blue label, dark cap at `capLeft`) */
const marker = (b: Buf, x: number, y: number, len = 40) => {
  rect(x, y, len, 7, b.ink(PAL.P2)); rect(x, y, len, 1, b.ink(PAL.W9)); rect(x, y + 6, len, 1, b.ink(PAL.P0));
  rect(x + 12, y + 1, 14, 5, b.ink(INK));
  rect(x - 10, y, 10, 7, b.ink(PAL.N2)); rect(x - 10, y, 10, 1, b.ink(PAL.N4));
};
/** [INSERT] 28.01: the whiteboard's tray close, the marker on it under his resting hand (`hy` null: the hand gone) */
export const drawTrayMarker = (b: Buf, f: number, st: {hy: number | null}) => {
  // the wall under the board (brick in the daylight), the board's white above the tray
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 128 ? (hash(x >> 3, y >> 2, 61) < 0.05 && bayer(x, y) < 0.5 ? PAL.G6 : PAL.P2) : brick(x, y + 3));
  // the day falling across the brick (a slanting patch)
  for (let y = 142; y < RH; y++) for (let x = 0; x < 480; x++) { const u = x - (y - 142) * 1.2; if (u > 40 && u < 250 && bayer(x, y) < 0.55) b.set(x, y, stepColor(b.get(x, y), 1)); }
  paper(b, (t) => { rect(0, 128, 480, 12, t.ink(PAL.G4)); rect(0, 128, 480, 2, t.ink(PAL.G6)); rect(0, 138, 480, 2, t.ink(PAL.G2)); }, 2);
  // the corner of the top box's ghost, top left (the board already written on above the frame)
  paper(b, (t) => marker(t, 200, 121, 76));
  if (st.hy !== null) paperSprite(b, (t) => drawRestingHand(t, st.hy!));
  grain(b);
  void f;
};

// ------------------------------------------------------------------ the wide
export interface Office2019St {
  /** Gerg's bill: 0 rolled in his hand .. 1 unrolled to the floor and along it (held steps) */
  bill: number;
  gergMouth?: 'rest' | 'open';
  masMouth?: 'rest' | 'open';
  alyiMouth?: 'rest' | 'open';
  f: number;
}
/** the cloud bill: a long printout from his near hand to the floor and curling along it toward the board */
const cloudBill = (t: Buf, hx: number, hy: number, u: number) => {
  const floor = OFFICE19.floorY + 38;
  const drop = Math.round(clamp(u, 0, 1) * 150);
  const down = Math.min(drop, floor - hy), along = Math.max(0, drop - down);
  for (let j = 0; j < down; j++) for (let i = 0; i < 12; i++) t.set(hx + i, hy + j, i === 0 ? PAL.P0 : i === 11 ? PAL.P1 : (j % 5 === 2 && i > 2 && i < 10 - (j % 3)) ? PAL.G5 : PAL.P2);
  rect(hx, hy, 12, 4, t.ink(PAL.C5)); // its header band
  for (let i = 0; i < along; i++) for (let j = 0; j < 5; j++) t.set(hx + 11 + i, floor - 5 + j, j === 0 ? PAL.P2 : j === 4 ? PAL.P0 : (i % 5 === 2 && j === 2) ? PAL.G5 : PAL.P1);
  if (along > 6) { ellipse(hx + 11 + along, floor - 4, 4, 4, t.ink(PAL.P1)); ellipse(hx + 11 + along, floor - 4, 2, 2, t.ink(PAL.P0)); }
};
/** [W] 28.02 head: NopeAI's first office, March 2019, by day */
export const office2019 = (b: Buf, st: Office2019St) => {
  const f = st.f, O = OFFICE19;
  officeDay(b);
  racksDay(b, f);
  // the whiteboard on its wheeled stand where the monitor wall stood, NONPROFIT · THE BOARD at its top
  paper(b, (t) => board(t, O.board.x0, O.board.y0, O.board.x1, O.board.y1, O.floorY + 34));
  const bs = 'NONPROFIT · THE BOARD', bx = 230, by = 54;
  tiny(b, bs, bx + 3, by + 4, INK); rect(bx, by, tinyWidth(bs) + 6, 1, b.ink(INK)); rect(bx, by + 11, tinyWidth(bs) + 6, 1, b.ink(INK)); rect(bx, by, 1, 12, b.ink(INK)); rect(bx + tinyWidth(bs) + 5, by, 1, 12, b.ink(INK));
  // the table at the right, and at it: ALYI, MADA, THE QUIET VOTE's chair turned away
  paper(b, (t) => {
    rect(318, 166, 162, 5, t.ink(PAL.D4)); rect(318, 166, 162, 1, t.ink(PAL.W6)); rect(324, 171, 3, 26, t.ink(PAL.D2)); rect(470, 171, 3, 26, t.ink(PAL.D2));
  });
  paperSprite(b, (t) => drawAlyiTable(t, 330, 118, {lid: 0, mouth: st.alyiMouth ?? 'rest', light: 'dinner'}));
  paperSprite(b, (t) => drawMadaSeated(t, 412, 190, {...MADA_SEAT_DEFAULT, light: 'room'}, {flip: true}));
  // the Quiet Vote: a tall chair's back, turned away (to the windows), nothing of whoever sits in it
  paper(b, (t) => {
    rect(452, 120, 26, 44, t.ink(PAL.N2)); rect(452, 120, 26, 2, t.ink(PAL.G2)); rect(454, 124, 22, 38, t.ink(PAL.N3));
    for (let yy = 126; yy < 160; yy += 4) rect(456, yy, 18, 1, t.ink(PAL.N2));
    rect(463, 164, 3, 20, t.ink(PAL.N1)); rect(452, 184, 26, 2, t.ink(PAL.N1));
  });
  // GERG with his cloud bill (sc 9's tug pose: the near hand pinching; the laptop in his arm, as always)
  paperSprite(b, (t) => {
    drawGergPose(t, 112, 190, {body: 'tug', type: 0, look: 'up', mouth: st.gergMouth ?? 'rest'});
    cloudBill(t, 124, 146, st.bill);
  });
  // MAS at the board's left end, turned to Gerg, the marker in his hand
  paperSprite(b, (t) => drawMasStand(t, 206, 190, {...MAS_STAND_DEFAULT, mouth: st.masMouth ?? 'rest', light: 'room'}, {flip: true}));
  grain(b);
};

// ------------------------------------------------------------------ the 2S at the board
/** the far side of the office behind a close setup: brick, the windows' daylight at the left, soft */
const officeFarDay = (b: Buf) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(brick(x, y), bayer(x, y) < 0.5 ? 0 : -1));
  paper(b, (t) => {
    rect(0, 20, 60, 110, t.ink(PAL.G2));
    for (let y = 23; y < 127; y++) for (let x = 0; x < 57; x++) t.set(x, y, y < 60 ? PAL.C8 : PAL.C7);
    rect(28, 20, 3, 110, t.ink(PAL.G2)); rect(0, 70, 60, 3, t.ink(PAL.G2));
  });
};
export const BOARD2S = {x0: 96, y0: 10, x1: 358, y1: 146};
export interface Board2SSt extends DiagramState {
  f: number;
  mas: Partial<MasMediumState>;
  /** his marker's tip on the board (frame coords), or null (his arm down) */
  pen: [number, number] | null;
  /** his figure's left edge (default 6) */
  masX?: number;
  alyi: Partial<AlyiSpeakState>;
}
/** where Mas stands for a pen point: the shoulder (x + 64) at most 92 px from it, never further in than 190 */
export const masAtBoard = (pen: [number, number] | null) => (pen ? clamp(pen[0] - 64 - 110, 6, 190) : 6);
/** the writing arm: from his near shoulder to the pen's point, the elbow dropped; the marker in his fist */
const writingArm = (t: Buf, sx: number, sy: number, px: number, py: number) => {
  const ex = Math.round((sx + px) / 2 - 6), ey = Math.round(Math.max(sy, py) + 16);
  const HOOD: [number, number, number, number] = [PAL.G0, PAL.G2, PAL.G3, PAL.G4];
  capsule(t, sx, sy, ex, ey, 7, HOOD);
  capsule(t, ex, ey, px - 8, py + 6, 6, HOOD);
  for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const e = Math.hypot(i / 6, j / 6); if (e < 1) t.set(px - 7 + i, py + 6 + j, e > 0.85 ? PAL.S1 : j < -2 ? PAL.S5 : PAL.S4); }
  capsule(t, px - 4, py + 3, px, py, 2, [PAL.N0, PAL.N1, PAL.N2, PAL.P2]);
  t.set(px, py, INK); t.set(px + 1, py, INK);
};
/** [2S] 28.02: the whiteboard large and legible; MAS at its left, writing; ALYI in the right foreground at the table */
export const board2S = (b: Buf, st: Board2SSt) => {
  officeFarDay(b);
  const B = BOARD2S;
  paper(b, (t) => board(t, B.x0, B.y0, B.x1, B.y1), 2);
  drawDiagram(b, B.x0, B.y0, st);
  // MAS (medium, facing right to the board), his body run down to the frame's foot; he stands at `masX` (the layout
  // steps him along the board so the marker is always an arm's length from his shoulder)
  const mx = st.masX ?? 6, my = 52;
  paperSprite(b, (t) => {
    drawMasMedium(t, mx, my, {...MAS_MEDIUM_DEFAULT, head: '34', look: 1, light: 'warm', arm: 'down', ...st.mas} as MasMediumState);
    for (let y = my + 110; y < RH; y++) for (let x = mx; x < mx + 84; x++) { const v = t.get(x, my + 109); if (v !== TR) t.set(x, y, v); }
    if (st.pen) writingArm(t, mx + 64, my + 64, st.pen[0], st.pen[1]);
  });
  // ALYI at the table in the right foreground, facing left to the board, the table's edge across the foot
  paperSprite(b, (t) => putBustCut(t, alyiSpeakPortrait({...ALYI_SPEAK_DEFAULT, ...st.alyi} as AlyiSpeakState), 362, 78, 186, true));
  paper(b, (t) => { rect(300, 186, 180, 17, t.ink(PAL.D4)); rect(300, 186, 180, 2, t.ink(PAL.W6)); });
  grain(b);
};

// ------------------------------------------------------------------ the 2S at the table
export interface Mada2SSt extends DiagramState {
  f: number;
  mada: Partial<MadaMediumState>;
  spin: number | null;
  stopped?: boolean;
  pen: [number, number] | null;
}
/** [2S] 28.03: the board's lower box at frame left (his hand drawing in it, the sleeve in from the frame's left edge),
 *  MADA at the table (the spinner), THE QUIET VOTE's tall chair beside him, turned away */
export const mada2S = (b: Buf, st: Mada2SSt) => {
  officeFarDay(b);
  // the board, nearer: its lower box across the frame's left half
  const X = -40, Y = -44;
  paper(b, (t) => board(t, 0, 0, 236, 118), 2);
  for (let y = 0; y < 121; y++) for (let x = 0; x < 3; x++) b.set(x, y, PAL.P2);
  drawDiagram(b, X, Y, st);
  if (st.pen) paperSprite(b, (t) => {
    const [px, py] = st.pen!;
    capsule(t, -10, py + 60, px - 8, py + 6, 7, [PAL.G0, PAL.G2, PAL.G3, PAL.G4]);
    for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const e = Math.hypot(i / 6, j / 6); if (e < 1) t.set(px - 7 + i, py + 6 + j, e > 0.85 ? PAL.S1 : j < -2 ? PAL.S5 : PAL.S4); }
    capsule(t, px - 4, py + 3, px, py, 2, [PAL.N0, PAL.N1, PAL.N2, PAL.P2]);
  });
  // the table in the foreground right; MADA (medium, arms folded, facing left to the board), the spinner over his head
  paperSprite(b, (t) => drawMadaMedium(t, 262, 58, {...MADA_MEDIUM_DEFAULT, head: '34', light: 'room', ...st.mada} as MadaMediumState, {flip: true, spin: st.spin, stopped: st.stopped}));
  // THE QUIET VOTE's chair beside him, its tall back to us (turned away), nothing of whoever is in it
  paper(b, (t) => {
    // the headrest, the tall back (its mesh, the frame's rounded shoulders), the arms either side
    for (let y = 44; y < 62; y++) for (let x = 392; x < 436; x++) { const e = Math.hypot((x - 414) / 22, (y - 53) / 9); if (e < 1) t.set(x, y, e > 0.85 ? PAL.N1 : y < 50 ? PAL.G2 : PAL.N3); }
    rect(410, 62, 8, 8, t.ink(PAL.N1));
    for (let y = 70; y < 160; y++) for (let x = 380; x < 448; x++) {
      const r = y < 84 ? Math.hypot(Math.max(0, Math.abs(x - 414) - 20) / 14, (84 - y) / 14) : 0;
      if (r > 1) continue;
      const edge = x < 383 || x > 444 || (y < 84 && r > 0.8);
      t.set(x, y, edge ? PAL.G2 : (x + y) % 4 === 0 || (x - y) % 4 === 0 ? PAL.N2 : PAL.N3);
    }
    rect(372, 118, 8, 6, t.ink(PAL.N1)); rect(448, 118, 8, 6, t.ink(PAL.N1)); rect(374, 124, 4, 30, t.ink(PAL.N1)); rect(450, 124, 4, 30, t.ink(PAL.N1));
  });
  paper(b, (t) => { rect(236, 160, 244, 43, t.ink(PAL.D4)); rect(236, 160, 244, 2, t.ink(PAL.W6)); for (let x = 236; x < 480; x += 40) rect(x, 164, 1, 39, t.ink(PAL.D3)); });
  grain(b);
};

// ------------------------------------------------------------------ the check under the door
/** [INSERT] 28.04: the office door's foot, the daylight in the gap under it; the landlord's first check slides in
 *  under it (`slide` px still to come, held steps): MACROSOFT · $1,000,000,000 · JUL 2019 */
export const drawCheckDoor = (b: Buf, f: number, st: {slide: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 34 ? ((x >> 5) % 2 ? PAL.D2 : PAL.D3) : (y - 34) % 12 === 0 ? PAL.D3 : PAL.D4);
  paper(b, (t) => { rect(0, 26, 480, 6, t.ink(PAL.D1)); rect(0, 26, 480, 1, t.ink(PAL.D4)); });
  for (let x = 0; x < 480; x++) { b.set(x, 32, PAL.W8); b.set(x, 33, bayer(x, 33) < 0.5 ? PAL.W7 : PAL.W6); }
  // the daylight from the gap, fanning onto the boards
  for (let y = 34; y < 90; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < (1 - (y - 34) / 56) * 0.45) b.set(x, y, stepColor(b.get(x, y), 1));
  // the check: cream with a pale mint band (the landlord's cousin of Act One's big check), sliding toward us
  const W = 300, H = 118, X = 90, Y = 50 - Math.max(0, st.slide);
  paper(b, (t) => {
    rect(X, Y, W, H, t.ink(PAL.P2)); rect(X, Y, W, 1, t.ink(PAL.W9));
    for (let y = Y + 2; y < Y + 20; y++) for (let x = X + 2; x < X + W - 2; x++) t.set(x, y, bayer(x, y) < 0.35 ? PAL.K4 : PAL.P2);
    rect(X, Y + H - 1, W, 1, t.ink(PAL.P0));
    bigText(t, 'MACROSOFT', X + 12, Y + 26, PAL.N2);
    text(t, 'JUL 2019', X + W - 12 - textWidth('JUL 2019'), Y + 30, PAL.N2);
    tiny(t, 'PAY TO THE ORDER OF', X + 12, Y + 52, PAL.G4);
    rect(X + 12, Y + 72, 90, 1, t.ink(PAL.G5)); text(t, 'NOPEAI', X + 16, Y + 62, PAL.N3);
    const amt = '$1,000,000,000', aw = bigTextWidth(amt) + 12;
    rect(X + W - 10 - aw, Y + 50, aw, 28, t.ink(PAL.P1)); rect(X + W - 10 - aw, Y + 50, aw, 1, t.ink(PAL.P0));
    bigText(t, amt, X + W - 4 - aw, Y + 57, PAL.N1);
    rect(X + 176, Y + 102, 110, 1, t.ink(PAL.G5));
    const sig: Array<[number, number]> = [[180, 98], [186, 92], [192, 99], [198, 91], [205, 97], [212, 93], [220, 98], [230, 95]];
    for (let i = 0; i + 1 < sig.length; i++) line(X + sig[i][0], Y + sig[i][1], X + sig[i + 1][0], Y + sig[i + 1][1], t.ink(PAL.N3));
  }, 2);
  // the door's foot over the check's far edge (it comes from under it)
  paper(b, (t) => { rect(0, 26, 480, 6, t.ink(PAL.D1)); rect(0, 26, 480, 1, t.ink(PAL.D4)); });
  grain(b);
  void f;
};

// ================================================================== sc 29 · the tour
export interface StampSpec { city: string; date: string; x: number; y: number; shape: 'round' | 'rect' | 'oval'; col: number }
export const STAMPS: StampSpec[] = [
  {city: 'RIO DE JANEIRO', date: '18 MAY 2023', x: 118, y: 54, shape: 'oval', col: PAL.U3},
  {city: 'LAGOS', date: '19 MAY 2023', x: 186, y: 110, shape: 'rect', col: PAL.L2},
  {city: 'MADRID', date: '22 MAY 2023', x: 92, y: 150, shape: 'round', col: PAL.R2},
  {city: 'WARSAW', date: '23 MAY 2023', x: 300, y: 50, shape: 'rect', col: PAL.F4},
  {city: 'PARIS', date: '23 MAY 2023', x: 402, y: 88, shape: 'round', col: PAL.I0},
  {city: 'LONDON', date: '24 MAY 2023', x: 304, y: 128, shape: 'oval', col: PAL.R1},
  {city: 'MUNICH', date: '25 MAY 2023', x: 396, y: 160, shape: 'rect', col: PAL.R2},
];
/** one stamp's ink (the city legible, the date in tiny type), centred at (x, y); the ink a little uneven */
const stampInk = (b: Buf, s: StampSpec, seed: number) => {
  const w = Math.max(textWidth(s.city), tinyWidth(s.date)) + 18, h = 30;
  const x0 = s.x - (w >> 1), y0 = s.y - (h >> 1);
  const put = (x: number, y: number) => { if (hash(x, y, seed) < 0.86) b.set(x, y, s.col); };
  if (s.shape === 'rect') { for (let i = 0; i < w; i++) { put(x0 + i, y0); put(x0 + i, y0 + 1); put(x0 + i, y0 + h - 1); put(x0 + i, y0 + h - 2); } for (let j = 0; j < h; j++) { put(x0, y0 + j); put(x0 + 1, y0 + j); put(x0 + w - 1, y0 + j); put(x0 + w - 2, y0 + j); } }
  else {
    const rx = s.shape === 'round' ? Math.max(w, 40) / 2 : w / 2 + 4, ry = s.shape === 'round' ? rx * 0.62 : h / 2 + 2;
    for (let a = 0; a < 720; a++) { const t = (a / 720) * Math.PI * 2; for (const r of [0, 1, 4]) put(Math.round(s.x + Math.cos(t) * (rx - r)), Math.round(s.y + Math.sin(t) * (ry - r))); }
  }
  const t = new Buf(480, RH, TR);
  text(t, s.city, s.x - (textWidth(s.city) >> 1), s.y - 8, s.col);
  tiny(t, s.date, s.x - (tinyWidth(s.date) >> 1), s.y + 5, s.col);
  for (let i = 0; i < 480 * RH; i++) if (t.c[i] !== TR && hash(i % 480, (i / 480) | 0, seed + 3) < 0.93) b.c[i] = t.c[i];
};
/** the rubber stamp itself over the page, coming down (its shadow, then it, then lifting) */
const stampBlock = (b: Buf, x: number, y: number, phase: 0 | 1 | 2) => {
  if (phase === 0) { for (let j = -14; j <= 14; j++) for (let i = -34; i <= 34; i++) if (Math.hypot(i / 34, j / 14) < 1 && bayer(x + i, y + j) < 0.5) b.set(x + i + 8, y + j + 8, stepColor(b.get(x + i + 8, y + j + 8), -2)); return; }
  const lift = phase === 2 ? -10 : 0;
  for (let j = -14; j <= 14; j++) for (let i = -34; i <= 34; i++) if (Math.hypot(i / 34, j / 14) < 1) b.set(x + i + 5, y + j + 5 + lift, stepColor(b.get(x + i + 5, y + j + 5 + lift), -2));
  for (let j = -14; j <= 14; j++) for (let i = -34; i <= 34; i++) { const e = Math.hypot(i / 34, j / 14); if (e < 1) b.set(x + i, y + j + lift, e > 0.9 ? PAL.D0 : j < -6 ? PAL.D4 : PAL.D3); }
  for (let j = -9; j <= 9; j++) for (let i = -9; i <= 9; i++) { const e = Math.hypot(i / 9, j / 9); if (e < 1) b.set(x + i, y + j + lift - 4, e > 0.85 ? PAL.D0 : i < -2 && j < -2 ? PAL.W5 : PAL.D4); }
};
/** [INSERT] 29.01: his passport open on its visa pages; `landed` stamps inked; `coming` the next one's phase */
export const drawPassport = (b: Buf, f: number, st: {landed: number; coming: {i: number; phase: 0 | 1 | 2} | null; push: number}) => {
  // a hotel desk's dark wood round the booklet
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x + (y >> 2)) % 41 === 0 ? PAL.D3 : bayer(x, y) < 0.25 ? PAL.D1 : PAL.D2);
  const p = st.push;
  const X0 = 20 - p, X1 = 460 + p, Y0 = 8 - p, Y1 = 200 + p, mid = 240;
  // the cover's navy edge, the pages (pale, a fine wavy guilloche), the gutter's shadow
  rect(X0 - 5, Y0 - 5, X1 - X0 + 10, Y1 - Y0 + 10, b.ink(PAL.N4)); rect(X0 - 5, Y0 - 5, X1 - X0 + 10, 1, b.ink(PAL.N6));
  for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
    const wav = Math.round(Math.sin((x + p) / 9) * 2 + Math.sin((y + x) / 23) * 2);
    const g = ((y + wav) % 7 === 0) || ((x - y + wav) % 29 === 0);
    const gut = Math.abs(x - mid);
    b.set(x, y, gut < 2 ? PAL.P0 : gut < 6 && bayer(x, y) < 0.5 ? PAL.P1 : g ? PAL.P1 : PAL.P2);
  }
  tiny(b, 'VISAS', X0 + 12, Y0 + 6, PAL.P0); tiny(b, 'VISAS', mid + 12, Y0 + 6, PAL.P0);
  tiny(b, '14', X0 + 12, Y1 - 12, PAL.P0); tiny(b, '15', X1 - 22, Y1 - 12, PAL.P0);
  for (let i = 0; i < st.landed; i++) stampInk(b, STAMPS[i], 71 + i);
  if (st.coming) { const s = STAMPS[st.coming.i]; stampBlock(b, s.x, s.y, st.coming.phase); }
  void f;
};
/** a desk flag on its small stand, hanging from a crossbar (three bands, no emblem): 'es' red-yellow-red across,
 *  'fr' blue-white-red down */
const deskFlag = (b: Buf, x: number, y: number, kind: 'es' | 'fr') => {
  const w = 54, h = 36;
  rect(x - 2, y - 4, w + 4, 2, b.ink(PAL.G6)); rect(x + (w >> 1) - 1, y - 4, 2, h + 60, b.ink(PAL.G5));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const sway = Math.round(Math.sin((j + i * 0.3) / 7) * 1);
    let c: number;
    if (kind === 'es') c = j < h * 0.25 || j >= h * 0.75 ? PAL.R2 : PAL.W7;
    else c = i < w / 3 ? PAL.F4 : i < (2 * w) / 3 ? PAL.P2 : PAL.R2;
    b.set(x + i + sway, y + j, (i + j) % 9 === 0 ? stepColor(c, -1) : c);
  }
  for (let i = 0; i < w; i++) if (i % 3 === 0) b.set(x + i, y + h, PAL.W6); // the fringe
  rect(x + (w >> 1) - 10, y + h + 56, 22, 4, b.ink(PAL.G4));
};
/** [INSERT] 29.01's cutaways: a table; his page slides across it (`k` 0..) to two hands under a desk flag; no faces */
export const drawFlagHands = (b: Buf, f: number, st: {k: number; flag: 'es' | 'fr'; cuff: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 60 ? (bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1) : (x - y * 2) % 97 < 6 ? PAL.D3 : bayer(x, y) < 0.2 ? PAL.D3 : PAL.D2);
  rect(0, 60, 480, 1, b.ink(PAL.D4));
  deskFlag(b, 330, 8, st.flag);
  const xs = [-80, 60, 130, 150];
  const sx = xs[Math.min(3, st.k >> 1)];
  drawRegulateSheet(b, sx, 70);
  // the hand receiving it, from the frame's right (a suit cuff over the white shirt's): the fingers reach onto the page
  // once it has stopped
  const reach = st.k >= 6 ? 0 : 30;
  drawRestingHand(b, 120, -4 + reach, {cuff: [PAL.P2, stepColor(st.cuff, 1), st.cuff]});
  void f;
};
/** [M] 29.02: a lectern in a generic university hall (wood panelling, tall windows' grey London light, no crest); MAS
 *  behind it, the gooseneck mic; the audience's heads in the foreground dark */
export const drawLectern = (b: Buf, f: number, st: {mas: Partial<MasPortraitState>}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const px = x % 60;
    b.set(x, y, y < 16 ? PAL.D1 : px < 2 ? PAL.D4 : px > 57 ? PAL.D1 : y % 48 < 2 ? PAL.D4 : bayer(x, y) < 0.2 ? PAL.D3 : PAL.D2);
  }
  // two tall windows, London grey, their light on the panels' edges
  for (const wx of [40, 380]) { rect(wx - 3, 20, 56, 150, b.ink(PAL.D1)); for (let y = 22; y < 168; y++) for (let x = wx; x < wx + 50; x++) b.set(x, y, (x - wx) === 24 || (y - 22) % 36 === 0 ? PAL.D1 : y < 80 ? PAL.G6 : PAL.G5); }
  // the sconces
  for (const sx of [150, 330]) { rect(sx, 40, 6, 10, b.ink(PAL.W6)); rect(sx + 1, 38, 4, 2, b.ink(PAL.W8)); for (let j = 0; j < 26; j++) for (let i = -14; i < 20; i++) if (bayer(sx + i, 50 + j) < (1 - Math.hypot(i / 16, j / 26)) * 0.6) b.set(sx + i, 50 + j, stepColor(b.get(sx + i, 50 + j), 1)); }
  // MAS behind the lectern, 3/4 toward the hall at frame left
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...st.mas} as MasPortraitState), 196, 30, RH);
  // the lectern: a slanted top, its front panel, the gooseneck mic up to him
  poly([176, 150, 332, 150, 322, 203, 186, 203], b.ink(PAL.D3));
  rect(170, 144, 168, 8, b.ink(PAL.D4)); rect(170, 144, 168, 1, b.ink(PAL.W5));
  for (let y = 158; y < RH; y++) { b.set(196, y, PAL.D2); b.set(312, y, PAL.D2); }
  line(250, 146, 244, 128, b.ink(PAL.N2)); line(244, 128, 232, 118, b.ink(PAL.N2)); rect(228, 114, 6, 5, b.ink(PAL.N1)); b.set(229, 114, PAL.G4);
  // the audience's heads along the foot, dark against him
  for (let i = 0; i < 9; i++) { const hx = 10 + i * 56 + (i % 2) * 14; ellipse(hx, 200, 18, 16, b.ink(PAL.N1)); ellipse(hx, 200, 16, 14, b.ink(PAL.N0)); }
  void f;
};
/** [POV] 29.03 / 29.04: his phone face-up on a hotel desk (a lamp's warm pool), filling the frame's height; a post on
 *  it in its own UI, drawn at the UI's size and shown 2x (the pixels doubled, the words at display size); `thumb`: his
 *  thumb on Post (0 none, 1 over it, 2 pressed); `compose`: his words in the compose box (while k < 0) */
export const PHONE29 = {x: 124, y: 6, w: 232};
export const drawPhonePost = (b: Buf, f: number, st: {post: {kind: 'any'; spec: {poster: PosterAny; text: string; ts?: string}} | {kind: 'mas'; spec: PostSpec}; k: number; thumb?: 0 | 1 | 2; compose?: string | null}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 440) / 200, (y - 10) / 160);
    b.set(x, y, (x + (y >> 2)) % 43 === 0 ? PAL.D3 : d < 1 && bayer(x, y) < (1 - d) * 0.6 ? PAL.D4 : bayer(x, y) < 0.2 ? PAL.D2 : PAL.D1);
  }
  const P = PHONE29;
  rect(P.x + 5, P.y + 5, P.w, RH, b.ink(PAL.D0));
  rect(P.x, P.y, P.w, RH, b.ink(PAL.N0)); rect(P.x + 1, P.y + 1, P.w - 2, RH, b.ink(PAL.N1)); rect(P.x + 1, P.y + 1, P.w - 2, 1, b.ink(PAL.G2));
  rect(P.x + (P.w >> 1) - 14, P.y + 4, 28, 3, b.ink(PAL.N0));
  const sx = P.x + 8, sy = P.y + 12, sw = P.w - 16;
  rect(sx, sy, sw, RH - sy, b.ink(PAL.N2));
  rect(sx, sy, sw, 16, b.ink(PAL.N3)); rect(sx + 6, sy + 6, 30, 4, b.ink(PAL.G3));
  const hw = sw >> 1;
  const t = new Buf(hw, 100, TR);
  if (st.compose !== undefined && st.compose !== null && st.k < 0) {
    rect(2, 2, hw - 4, 44, t.ink(PAL.N3));
    pwrap(st.compose, hw - 12).slice(0, 4).forEach((l, i) => pt(t, l, 5, 5 + i * 10, PAL.P2));
    rect(hw - 30, 50, 26, 12, t.ink(st.thumb === 2 ? PAL.C3 : PAL.C5)); pt(t, 'Post', hw - 25, 53, PAL.N0);
  } else if (st.post.kind === 'any') drawPostFor(t, 2, 2, st.post.spec, {size: 'phone', w: hw - 4, k: st.k});
  else drawPost(t, 2, 2, st.post.spec, {size: 'phone', w: hw - 4, k: st.k});
  for (let y = 0; y < 100; y++) for (let x = 0; x < hw; x++) { const v = t.c[y * hw + x]; if (v === TR) continue; const X = sx + x * 2, Y = sy + 18 + y * 2; if (Y + 1 < RH) { b.set(X, Y, v); b.set(X + 1, Y, v); b.set(X, Y + 1, v); b.set(X + 1, Y + 1, v); } }
  if (st.thumb) {
    // his thumb from the frame's lower right onto Post: a rounded tip, the nail on top, the rest of it off frame
    const tx = sx + sw - 30, ty = sy + 18 + 56 * 2 + (st.thumb === 2 ? 2 : 0);
    capsule(b, tx, ty, tx + 70, ty + 60, 13, [PAL.S1, PAL.S3, PAL.S4, PAL.S5]);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) if (Math.hypot((i - 6) / 6, (j - 4) / 4) < 1) b.set(tx - 2 + i, ty - 9 + j, j < 3 ? PAL.S6 : PAL.S5);
  }
  void f;
};
/** the NOTERB poster (post-any): a name and a plain initial avatar, no face (a commissioner shown only as his post) */
export const NOTERB: PosterAny = {
  name: 'NOTERB', handle: '', accent: PAL.F5, bg: PAL.F3,
  avatar: ['....kkkkkk....', '..kkbbbbbbkk..', '.kbbbbbbbbbbk.', '.kbbxbbbbxbbk.', 'kbbbxxbbbxbbbk', 'kbbbxbxbbxbbbk', 'kbbbxbbxbxbbbk', 'kbbbxbbbxxbbbk', 'kbbbxbbbbxbbbk', '.kbbxbbbbxbbk.', '.kbbbbbbbbbbk.', '..kkbbbbbbkk..', '....kkkkkk....', '..............'],
  avatarPal: {k: PAL.N0, b: PAL.F3, x: PAL.P2},
  initial: ['#.#', '###', '###', '#.#', '#.#'],
};
/** [INSERT] 29.05: a guest book under a flag's fringe; his pen signs (`sig` 0..1 of the signature); `toLetter` 0..1: the
 *  page's ruled lines and old signatures give way (ordered dither) to the one-sentence letter, the hand, pen and his
 *  signature holding their place */
export const drawGuestBook = (b: Buf, f: number, st: {sig: number; toLetter: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.25 ? PAL.D3 : PAL.D2);
  // the page (the book's right page, cream), and the letter it becomes
  const X = 70, Y = 22, W = 340, H = 181;
  const book = new Buf(480, RH, PAL.P2), letter = new Buf(480, RH, PAL.P2);
  for (let y = Y; y < RH; y++) for (let x = X; x < X + W; x++) { book.set(x, y, (y - Y) % 16 === 15 ? PAL.P1 : PAL.P2); letter.set(x, y, PAL.P2); }
  for (let r = 0; r < 7; r++) { const yy = Y + 12 + r * 16; for (let i = 0; i < 60 + ((r * 37) % 50); i++) book.set(X + 20 + (r % 2) * 150 + i, yy + Math.round(Math.sin(i / 4 + r) * 2), PAL.N3); tiny(book, 'MAY 2023', X + 20 + (r % 2 ? 0 : 150) + 30, yy - 2, PAL.P0); }
  for (let r = 0; r < 4; r++) for (let i = 20; i < W - 20 - (r === 3 ? 90 : 0); i++) if ((i + r * 3) % 11 !== 0) letter.set(X + i, Y + 10 + r * 8, PAL.G4);
  rect(X + 20, Y + 50, 130, 1, letter.ink(PAL.G5));
  for (let y = Y; y < RH; y++) for (let x = X; x < X + W; x++) b.set(x, y, bayer(x, y) < st.toLetter ? letter.get(x, y) : book.get(x, y));
  rect(X, Y, W, 1, b.ink(PAL.W9)); rect(X - 3, Y, 3, RH - Y, b.ink(PAL.P0));
  // the flag's fringe and its lower edge across the top (generic navy, gold fringe; no city)
  if (st.toLetter < 1) for (let x = 0; x < 300; x++) {
    const edge = Math.round(44 - x * 0.12 + Math.sin(x / 11) * 3);
    for (let y = 0; y < edge; y++) b.set(x, y, (Math.floor(x / 11) % 2 ? PAL.N4 : PAL.N5));
    if (x % 3 !== 2) for (let y = edge; y < edge + 5; y++) b.set(x, y, y === edge ? PAL.W7 : PAL.W5);
  }
  // his signature on the next line, stroke by stroke, and the pen hand from the right at its head
  const sig: Array<[number, number]> = [[0, 2], [6, -6], [12, 3], [18, -5], [24, 0], [31, -8], [36, 1], [44, -4], [52, 2], [60, -3]];
  const n = Math.round(clamp(st.sig, 0, 1) * (sig.length - 1));
  const ox = GUEST_SIG.x, oy = GUEST_SIG.y;
  if (st.toLetter < 0.5) for (let i = 0; i < 60; i++) b.set(ox + i, oy + 6, PAL.P0); // the book's line under it
  for (let i = 0; i < n; i++) { line(ox + sig[i][0], oy + sig[i][1], ox + sig[i + 1][0], oy + sig[i + 1][1], b.ink(PAL.N2)); line(ox + sig[i][0], oy + sig[i][1] + 1, ox + sig[i + 1][0], oy + sig[i + 1][1] + 1, b.ink(PAL.N2)); }
  penHand(b, ox + sig[n][0], oy + sig[n][1], {sleeve: [PAL.G0, PAL.G2, PAL.G3, PAL.G4]});
  void f;
};
/** where his signature lies, in the guest book and (the match) on the letter's signature column */
export const GUEST_SIG = {x: 262, y: 142};

// ================================================================== sc 30 · the one sentence, on many desks
export type LetterDesk = 'his' | 'simed' | 'notnih' | 'more';
/** [INSERT] 17.01's head: the one-sentence letter full frame on a desk; `names` shows the signatories' list (the
 *  statement's own style: bold names, a grey line under each), `scroll` its whole-pixel scroll up, `more` + HUNDREDS
 *  MORE at its foot; `desk` whose desk (the surround, the sleeve); `hand` the signing hand's step (0 none, 1 in, 2 on
 *  the page, 3 out), `sigs` signatures scribbled so far */
export const drawLetterDesk = (b: Buf, f: number, st: {desk: LetterDesk; names: boolean; scroll: number; more: boolean; hand: 0 | 1 | 2 | 3; sigs: number; masSig: boolean}) => {
  const dark = st.desk === 'notnih';
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c: number;
    if (st.desk === 'simed') c = (x + (y >> 1)) % 37 < 2 ? PAL.P0 : bayer(x, y) < 0.3 ? PAL.P0 : PAL.P1; // pale maple
    else if (dark) c = PAL.N0;
    else c = bayer(x, y) < 0.25 ? PAL.D3 : PAL.D2;
    b.set(x, y, c);
  }
  const X = 110, Y = 50, W = 260;
  // the page (the quote box sits above it, over the desk), the sentence greeked on it, then the signatories
  for (let y = Y; y < RH; y++) for (let x = X; x < X + W; x++) b.set(x, y, PAL.P2);
  rect(X, Y, W, 1, b.ink(PAL.W9));
  for (let r = 0; r < 2; r++) for (let i = 16; i < W - 16 - (r ? 80 : 0); i++) if ((i + r * 5) % 13 !== 0) b.set(X + i, Y + 10 + r * 7, PAL.G4);
  tiny(b, 'SIGNATORIES:', X + 16, Y + 28, PAL.G4);
  const NAMES = ['MAS MANALT', 'MARIO', 'SIMED', 'NOTNIH', 'OIGNEB'];
  const WHO = ['CEO, NOPEAI', 'CEO, MISANTHROPIC', 'CEO, MINDDEEP', 'EMERITUS PROFESSOR', 'PROFESSOR'];
  const t = new Buf(480, RH, TR);
  const top = Y + 46 - st.scroll;
  if (st.names) NAMES.forEach((nm, i) => { const yy = top + i * 22; text(t, nm, X + 16, yy, PAL.N1); tiny(t, WHO[i], X + 16, yy + 10, PAL.G4); });
  // the list runs on below the five (greeked names), and + HUNDREDS MORE lands at its foot
  if (st.names) for (let i = 5; i < 9; i++) { const yy = top + i * 22; for (let q = 0; q < 50 + ((i * 29) % 40); q++) if (q % 6 !== 5) t.set(X + 16 + q, yy + 3, PAL.G5); }
  if (st.more) { const s = '+ HUNDREDS MORE'; rect(X + W - 26 - textWidth(s), 170, textWidth(s) + 12, 16, t.ink(PAL.P1)); text(t, s, X + W - 20 - textWidth(s), 174, PAL.R1); }
  for (let y = Y + 38; y < RH; y++) for (let x = X; x < X + W; x++) { const v = t.c[y * 480 + x]; if (v !== TR) b.set(x, y, v); }
  // his signature from the guest book, held in its place (the match), and the others' scribbles beside the list
  if (st.masSig) {
    const sig: Array<[number, number]> = [[0, 2], [6, -6], [12, 3], [18, -5], [24, 0], [31, -8], [36, 1], [44, -4], [52, 2], [60, -3]];
    const ox = GUEST_SIG.x, oy = GUEST_SIG.y;
    for (let i = 0; i + 1 < sig.length; i++) if (ox + sig[i][0] >= X) { line(ox + sig[i][0], oy + sig[i][1], ox + sig[i + 1][0], oy + sig[i + 1][1], b.ink(PAL.N2)); line(ox + sig[i][0], oy + sig[i][1] + 1, ox + sig[i + 1][0], oy + sig[i + 1][1] + 1, b.ink(PAL.N2)); }
  }
  for (let s = 0; s < st.sigs; s++) { const sy = GUEST_SIG.y + 16 + s * 14, sx = GUEST_SIG.x - 4; for (let i = 0; i < 64; i++) b.set(sx + i, sy + Math.round(Math.sin(i / (3 + s) + s) * 3), PAL.N2); }
  // the desk's light: NOTNIH's pool from above (the rest dark), and the page lit in it
  if (dark) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 250) / 190, (y - 120) / 110); if (d > 1) b.set(x, y, PAL.N0); else if (d > 0.8 && bayer(x, y) < (d - 0.8) * 5) b.set(x, y, stepColor(b.get(x, y), -3)); }
  // SIMED's chess piece on the desk's left: a knight (a flat cut silhouette, lit edge)
  if (st.desk === 'simed') { poly([40, 150, 70, 150, 66, 138, 60, 132, 66, 118, 58, 104, 44, 110, 50, 118, 46, 132, 44, 138], b.ink(PAL.N1)); line(58, 104, 66, 118, b.ink(PAL.G4)); rect(36, 150, 38, 5, b.ink(PAL.N1)); }
  // the signing hand: a sleeve from the desk's side, the pen down on the page (each desk its own sleeve)
  if (st.hand) {
    const sleeve: [number, number, number, number] = st.desk === 'simed' ? [PAL.N0, PAL.N3, PAL.N4, PAL.N5] : dark ? [PAL.N0, PAL.N1, PAL.N2, PAL.G3] : [PAL.G0, PAL.G2, PAL.G3, PAL.G4];
    const ox = GUEST_SIG.x - 4, oy = GUEST_SIG.y + 16 + (st.desk === 'notnih' ? 14 : 0);
    let px = st.hand === 1 ? ox + 90 : st.hand === 2 ? ox + 50 : ox + 120, py = st.hand === 2 ? oy : oy - 24;
    if (st.desk === 'his') { px = st.hand === 2 ? GUEST_SIG.x + 60 : GUEST_SIG.x + 110; py = st.hand === 2 ? GUEST_SIG.y - 3 : GUEST_SIG.y - 40; }
    penHand(b, px, py, {sleeve, cuff: st.desk === 'simed' ? PAL.P2 : undefined, lit: dark});
  }
  void f;
};

// ================================================================== sc 30A · every signer's pen, an order
/** two more orders behind Mario's, each in another signer's hand (a navy suit cuff, a tweed cuff), cropped by the frame */
export const drawOtherOrders = (b: Buf, f: number) => {
  const order = (x: number, y: number, w: number, h: number, cuff: [number, number]) => {
    rect(x + 3, y + 3, w, h, b.ink(PAL.G5));
    rect(x, y, w, h, b.ink(PAL.P2)); rect(x, y, w, 1, b.ink(PAL.W9)); rect(x, y, w, 14, b.ink(PAL.L1));
    tiny(b, 'PURCHASE ORDER', x + 6, y + 4, PAL.P2);
    tiny(b, 'AI CHIPS', x + 6, y + 22, PAL.N2); tiny(b, 'QTY: MORE', x + 6, y + 32, PAL.N2);
    for (let k = 0; k < 3; k++) for (let i = 6; i < w - 6; i++) if (i % 5 !== 4) b.set(x + i, y + 46 + k * 8, PAL.G5);
    for (let k = 0; k < 3; k++) { const fx = x + 4 + k * 10, fy = y + h - 16; rect(fx, fy, 9, 20, b.ink(PAL.S4)); rect(fx, fy, 9, 3, b.ink(PAL.S5)); rect(fx + 8, fy, 1, 20, b.ink(PAL.S2)); }
    for (let yy = y + h + 4; yy < RH; yy++) for (let xx = x - 4; xx < x + 40; xx++) b.set(xx, yy, (xx + yy) % 5 === 0 ? cuff[1] : cuff[0]);
  };
  order(8, 34, 110, 120, [PAL.N3, PAL.N4]);
  order(368, 12, 104, 112, [PAL.D3, PAL.D4]);
  void f;
};
void poly; void bigTextWidth;
