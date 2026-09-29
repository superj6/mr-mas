// MR. MAS — Ep1 Act Three art, v3.5b (SHOWRUNNER-NOTES 00000A: "the staff love him, and so does Alyi"): the Sep 25, 2023
// launch party for CHATGTP's voice and images, before the Tidder post. New, additive, namespaced to Act Three; the
// `p-act1` picture pass, 2026-09-28. Built from the show's own pieces: Act One's bullpen window at dusk with Gerg's users
// line (act1/art/v35.ts bullpenWindow), the room sprites (the staff are the rigs recoloured into other people, nobody
// named, nobody real), the portraits for the two-shot (Mas; Alyi in person, lit, warm with him).
//   partyWide(b, f, st)      [W] v35-32A.01: the bullpen in the evening, full of staff with cups, the banner CHATGTP CAN
//                            NOW SEE, HEAR AND SPEAK over the window, the line on the glass; Mas with his glass, Alyi beside
//   partyCheer(b, f, st)     [M] v35-32A.02: Mas raises his glass (his one-pixel smile), the staff round him raise their cups
//                            and cheer; two cups clink near the lens
//   partyToast(b, f, st)     [2S] v35-32A.03: Mas and Alyi: his cup to Mas's glass, the clink, a shared laugh, Alyi's hand on
//                            Mas's shoulder; the glass comes down out of frame (the match to 20.01's glass on his desk)
//   PARTY_GLASS_OUT          where the glass leaves 32A.03's frame (20.01 sets it down in the same place)
import {Buf, rect, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../../shared/pixel/palette';
import {pt, pw} from '../../kit';
import {launchBackM, putBust} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {alyiSpeakPortrait, ALYI_SPEAK_DEFAULT, drawAlyiStand, ALYI_STAND_DEFAULT} from '../../../../../shared/pixel/cast/alyi-speak';
import type {AlyiSpeakState} from '../../../../../shared/pixel/cast/alyi-speak';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../../../../../shared/pixel/cast/rima-stand';
import {drawCollarsPortrait} from '../../../../../shared/pixel/cast/mas-collars';
import {faceKey} from '../../../../../shared/pixel/kits/face-light';
import {bullpenWindow, glassInHand, SKIN} from '../../act1/art/v35';

const RH = 203;
const TR = 0x1000000;

// ------------------------------------------------------------------ the staff: the rigs recoloured into other people
type Look = {hood: string; hair: string; skin: 0 | 1 | 2};
/** a ramp swap by family: the hoodie/jacket (G) to another family, the hair (B) darker or lighter, the skin (S) to one of
 *  three ramps (never a face anyone would know: room scale, no names) */
const recolour = (look: Look) => (c: number) => {
  const fm = familyOf(c); if (!fm) return c;
  const [fam, i] = fm;
  if (fam === 'G') { const R: Record<string, number[]> = {F: [PAL.F0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5, PAL.F6], U: [PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.U4, PAL.U5, PAL.U5], D: [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.D4, PAL.D4], L: [PAL.L0, PAL.L0, PAL.L1, PAL.L1, PAL.L2, PAL.L2, PAL.L3], G: [PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6]}; return (R[look.hood] ?? R.G)[Math.min(6, i)]; }
  if (fam === 'B') return look.hair === 'dark' ? [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3][Math.min(4, i)] : look.hair === 'light' ? [PAL.B2, PAL.B3, PAL.B4, PAL.W4, PAL.W5][Math.min(4, i)] : c;
  if (fam === 'S' && look.skin !== 1) { const R = look.skin === 2 ? [PAL.D0, PAL.D1, PAL.D2, PAL.B3, PAL.B4, PAL.S3, PAL.S3] : [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.S6]; return R[Math.min(6, i)]; }
  return c;
};
const STAFF: Array<{x: number; y: number; flip: boolean; rig: 'm' | 'r'; look: Look}> = [
  {x: 78, y: 196, flip: false, rig: 'm', look: {hood: 'F', hair: 'dark', skin: 2}},
  {x: 128, y: 192, flip: false, rig: 'r', look: {hood: 'U', hair: 'dark', skin: 0}},
  {x: 176, y: 198, flip: false, rig: 'm', look: {hood: 'D', hair: 'light', skin: 0}},
  {x: 352, y: 194, flip: true, rig: 'r', look: {hood: 'L', hair: 'light', skin: 1}},
  {x: 398, y: 198, flip: true, rig: 'm', look: {hood: 'G', hair: 'dark', skin: 1}},
  {x: 444, y: 192, flip: true, rig: 'm', look: {hood: 'U', hair: 'dark', skin: 2}},
];
/** a paper cup (room scale): 3 x 4, a coloured band */
const cup = (b: Buf, x: number, y: number) => { rect(x, y, 3, 4, b.ink(PAL.P2)); rect(x, y + 1, 3, 1, b.ink(PAL.C5)); b.set(x + 2, y + 3, PAL.P0); };
/** a raised forearm with its cup at room scale (sleeve colour c): from the shoulder (sx, sy) up to the hand (hx, hy) */
const raisedArm = (b: Buf, sx: number, sy: number, hx: number, hy: number, c: number, skin: number) => {
  // shoulder -> elbow (out to the side and up) -> the hand above it: two 2 px strokes, the sleeve's lit edge, the hand
  const ex = sx + Math.round((hx - sx) * 1.8) + (hx >= sx ? 2 : -2), ey = sy - Math.round((sy - hy) * 0.45);
  const seg = (x0: number, y0: number, x1: number, y1: number) => { const n = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i++) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); b.set(x, y, stepColor(c, 1)); b.set(x + 1, y, c); b.set(x, y + 1, c); } };
  seg(sx, sy, ex, ey); seg(ex, ey, hx, hy + 2);
  rect(hx - 1, hy, 3, 3, b.ink(skin)); b.set(hx - 1, hy, stepColor(skin, 1));
};

// ------------------------------------------------------------------ arms, hands and happy faces (bust scale)
/** a sleeve ramp: shadow, mid, lit, and the warm rim on the lit edge */
type Sleeve = [number, number, number, number];
const HOODIE: Sleeve = [PAL.G1, PAL.G2, PAL.G3, PAL.W4];
/** a limb segment as a capsule, shaded from the room's warm key (up and to the left): its lit side a rung up, its far
 *  side a rung down, a warm rim on the lit edge */
const capsule = (b: Buf, x0: number, y0: number, x1: number, y1: number, r: number, sl: Sleeve) => {
  const dx = x1 - x0, dy = y1 - y0, L2 = Math.max(1, dx * dx + dy * dy);
  for (let y = Math.floor(Math.min(y0, y1) - r - 1); y <= Math.max(y0, y1) + r + 1; y++) for (let x = Math.floor(Math.min(x0, x1) - r - 1); x <= Math.max(x0, x1) + r + 1; x++) {
    if (y < 0 || y >= RH || x < 0 || x >= 480) continue;
    const t = clamp(((x - x0) * dx + (y - y0) * dy) / L2, 0, 1), cx = x0 + dx * t, cy = y0 + dy * t, d = Math.hypot(x - cx, y - cy);
    if (d > r) continue;
    const nx = (x - cx) / Math.max(0.5, d), ny = (y - cy) / Math.max(0.5, d), lit = -0.55 * nx - 0.83 * ny;
    b.set(x, y, d > r - 1 && lit > 0.35 ? sl[3] : lit > 0.3 ? sl[2] : lit < -0.35 ? sl[0] : sl[1]);
  }
};
/** an arm from the shoulder (on its own body) to the elbow to the wrist, the cuff a rung up near the wrist */
const armTo = (b: Buf, sh: [number, number], el: [number, number], wr: [number, number], sl: Sleeve) => {
  capsule(b, sh[0], sh[1], el[0], el[1], 7, sl);
  capsule(b, el[0], el[1], wr[0], wr[1], 6, sl);
  const t = 0.82, cx = el[0] + (wr[0] - el[0]) * t, cy = el[1] + (wr[1] - el[1]) * t;
  capsule(b, cx, cy, wr[0], wr[1], 6, [sl[1], sl[2], stepColor(sl[2], 1), sl[3]]);
};
/** a hand gripping something (x..x+w wide, from row y): the fingers wrapped across its front in four rows, their
 *  creases, the knuckles lit; the thumb over the top on the wrist's side (side -1: the wrist is to the left) */
const grip = (b: Buf, x: number, y: number, w: number, side: -1 | 1) => {
  for (let q = 0; q < 4; q++) {
    const yy = y + q * 3, x0 = x - 1 + (q === 3 ? 1 : 0), x1 = x + w + (q === 3 ? -1 : 1);
    for (let xx = x0; xx <= x1; xx++) { b.set(xx, yy, PAL.S5); b.set(xx, yy + 1, PAL.S4); b.set(xx, yy + 2, PAL.S2); }
    b.set(side < 0 ? x1 : x0, yy + 1, PAL.S3);
  }
  const tx = side < 0 ? x - 3 : x + w - 1;
  for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) if (Math.hypot((i - 2) / 2.6, (j - 3.5) / 4.2) < 1) b.set(tx + i, y - 4 + j, j < 2 ? PAL.S5 : PAL.S4);
  // the back of the hand to the wrist's side
  for (let j = 0; j < 12; j++) for (let i = 0; i < 7; i++) b.set(side < 0 ? x - 7 + i : x + w + 1 + i, y + j, i === (side < 0 ? 0 : 6) ? PAL.S2 : j < 2 ? PAL.S5 : PAL.S4);
};
/** happy eyes on a portrait (local coords): the lids closed into two upward arcs, the lower lids pushed up by the
 *  cheeks (a lit row under each), a crease at the outer corner; `band` is filled first with the skin under it */
const happyEyes = (b: Buf, px: number, py: number, band: [number, number, number, number], eyes: Array<[number, number, number]>, outer: number) => {
  const [bx0, bx1, by0, by1] = band;
  for (let x = bx0; x <= bx1; x++) { const skin = b.get(px + x, py + by1 + 2); for (let y = by0; y <= by1; y++) b.set(px + x, py + y, skin); }
  for (const [cx, cy, w] of eyes) {
    const h = w / 2;
    for (let i = -Math.floor(h); i <= Math.floor(h); i++) { const yy = cy + Math.round(Math.pow(Math.abs(i) / h, 2) * 2); b.set(px + cx + i, py + yy, PAL.N1); b.set(px + cx + i, py + yy + 1, PAL.S3); }
    for (let i = -Math.floor(h) + 1; i < Math.floor(h); i++) b.set(px + cx + i, py + cy + 4, PAL.S5);
  }
  b.set(px + outer, py + eyes[1][1] - 1, PAL.S2); b.set(px + outer + 1, py + eyes[1][1] - 2, PAL.S2); b.set(px + outer, py + eyes[1][1] + 3, PAL.S2);
};
/** Mas's 3/4 head (masPortrait '34', local): the eyes' band and centres */
const MAS_EYES = {band: [36, 61, 44, 49] as [number, number, number, number], eyes: [[41, 46, 7], [55, 46, 9]] as Array<[number, number, number]>, outer: 61};
/** Alyi's portrait (alyiSpeakPortrait, local): the deep-set eyes' band and centres, the mouth */
const ALYI_EYES = {band: [34, 60, 45, 50] as [number, number, number, number], eyes: [[39, 47, 7], [51, 47, 10]] as Array<[number, number, number]>, outer: 58};
/** Alyi's open laugh (local): the teeth, the dark of the mouth, its corners up */
const alyiLaugh = (b: Buf, px: number, py: number, open: number) => {
  const y0 = 72;
  for (let x = 40; x <= 49; x++) b.set(px + x, py + y0, PAL.P2);
  for (let y = 1; y <= open; y++) for (let x = 39 + (y === open ? 1 : 0); x <= 50 - (y === open ? 1 : 0); x++) b.set(px + x, py + y0 + y, PAL.N1);
  for (let x = 41; x <= 48; x++) b.set(px + x, py + y0 + open + 1, PAL.S3);
  b.set(px + 38, py + y0 - 1, PAL.S2); b.set(px + 51, py + y0 - 1, PAL.S2);
};
/** Alyi's eyes warmed (open, a smile in them): the sockets' dark a rung lighter, the cheeks lifted under them */
const alyiWarmEyes = (b: Buf, px: number, py: number) => {
  const [bx0, bx1, by0, by1] = ALYI_EYES.band;
  for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) { const c = b.get(px + x, py + y); if (lightness(c) < 0.2) b.set(px + x, py + y, stepColor(c, 1)); }
  for (const [cx, cy, w] of ALYI_EYES.eyes) for (let i = -Math.floor(w / 2) + 1; i < Math.floor(w / 2); i++) b.set(px + cx + i, py + cy + 4, PAL.S5);
};

// ------------------------------------------------------------------ [W] v35-32A.01
/** the banner over the window: a paper strip on two strings, the launch post's words hand-lettered */
const banner = (b: Buf, k: number) => {
  const s = 'CHATGTP CAN NOW SEE, HEAR AND SPEAK', w = pw(s) + 16, x = 14, y = 8;
  const sway = Math.floor(k / 12) % 2;
  for (let i = 0; i < w; i++) { const sag = Math.round(Math.sin((i / w) * Math.PI) * 3) + (i > w / 2 ? sway : 0); for (let j = 0; j < 13; j++) b.set(x + i, y + sag + j, j === 0 ? PAL.P1 : j === 12 ? PAL.P0 : PAL.P2); }
  const t = new Buf(w, 13, TR); pt(t, s, 8, 3, PAL.C3);
  for (let j = 0; j < 13; j++) for (let i = 0; i < w; i++) if (t.c[j * w + i] !== TR) b.set(x + i, y + Math.round(Math.sin((i / w) * Math.PI) * 3) + (i > w / 2 ? sway : 0) + j, PAL.C3);
  for (const sx of [x, x + w - 1]) for (let j = 0; j < y + 2; j++) b.set(sx, j, PAL.N4);
};
export interface PartyWideSt { k: number; cheer?: boolean }
export const partyWide = (b: Buf, f: number, st: PartyWideSt) => {
  bullpenWindow(b, false, -20);
  banner(b, st.k);
  // the room a rung warmer (the party's lamps), the hall's tungsten behind Mas and Alyi
  for (let y = 120; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.18) b.set(x, y, stepColor(b.get(x, y), 1));
  const bob = (i: number) => (Math.floor((f + i * 5) / 8) % 2);
  STAFF.forEach((p, i) => {
    const t = new Buf(480, RH, TR);
    const map = recolour(p.look);
    if (p.rig === 'm') drawMasStand(t, p.x, p.y, {...MAS_STAND_DEFAULT, mouth: bob(i) ? 'open' : 'smile'}, {flip: p.flip, map});
    else drawRimaStand(t, p.x, p.y, {...RIMA_STAND_DEFAULT, body: 'stand', head: 'face', mouth: bob(i) ? 'open' : 'rest'}, {flip: p.flip, map});
    const dy = bob(i);
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const v = t.c[y * 480 + x]; if (v !== TR) b.set(x, Math.min(RH - 1, y < p.y - 40 ? y + dy : y), v); }
    // a cup: raised in some hands, held low in others
    const skin = SKIN[p.look.skin][3];
    const hx = p.flip ? p.x - 12 : p.x + 10;
    if (i % 2 === 0) { raisedArm(b, hx, p.y - 52 + dy, hx + (p.flip ? -3 : 3), p.y - 74 + dy, recolour(p.look)(PAL.G3), skin); cup(b, hx + (p.flip ? -4 : 2), p.y - 79 + dy); }
    else cup(b, hx, p.y - 32);
  });
  // Mas, with his glass, and Alyi beside him, in person, lit, turned to him
  drawMasStand(b, 250, 196, {...MAS_STAND_DEFAULT, mouth: 'smile'});
  drawCollarsStandSafe(b);
  glassInHand(b, 259, 166);
  drawAlyiStand(b, 290, 196, {...ALYI_STAND_DEFAULT, arms: 'down', light: 'room', mouth: 'rest'}, {flip: true});
  cup(b, 278, 164);
};
const drawCollarsStandSafe = (_b: Buf) => { /* his collars at room scale are the rig's own (3 since Jan) */ };

// ------------------------------------------------------------------ [M] v35-32A.02
/** a soft figure at the frame's edge (a head and shoulders out of focus, anonymous), its cup raised on `up` */
const softGuest = (b: Buf, cx: number, top: number, col: number, up: boolean, dy: number) => {
  for (let y = top + dy; y < RH; y++) for (let x = cx - 60; x < cx + 60; x++) {
    const head = Math.hypot((x - cx) / 20, (y - top - dy - 22) / 24) < 1;
    const body = y > top + dy + 40 && Math.abs(x - cx) < 34 + (y - top - dy - 40) * 0.6;
    if (!head && !body) continue;
    if (bayer(x, y) < 0.12) continue; // soft: a few pixels of the room through its edge
    b.set(x, y, head ? (x < cx - 12 ? PAL.W2 : PAL.N2) : col);
  }
  if (up) {
    // the near arm up from the shoulder, bent at the elbow, the hand round a paper cup (soft, like the guest)
    const side = cx < 240 ? 1 : -1, shx = cx + side * 26, shy = top + dy + 58;
    const sl: Sleeve = [stepColor(col, -1), col, stepColor(col, 1), PAL.W3];
    const cx0 = shx + side * 8, cy0 = top + dy + 2;
    armTo(b, [shx, shy], [shx + side * 22, shy - 18], [cx0 + 5, cy0 + 20], sl);
    paperCup(b, cx0, cy0, 11, 16);
    grip(b, cx0, cy0 + 8, 11, side > 0 ? -1 : 1);
  }
};
export interface PartyCheerSt { k: number; raise: number; clink1: number; clink2: number }
export const partyCheer = (b: Buf, f: number, st: PartyCheerSt) => {
  const {k} = st;
  launchBackM(b, 60, {soft: 2, alyi: 'gone', warm: 1, underlines: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.2) b.set(x, y, stepColor(b.get(x, y), 1));
  const up = k >= st.raise, dy = up ? (Math.floor(k / 6) % 2) : 0;
  softGuest(b, 40, 40, PAL.U2, up && k >= st.raise + 2, dy);
  softGuest(b, 440, 30, PAL.F3, up && k >= st.raise + 3, 1 - dy);
  // Mas, facing us, his glass going up (a held step, then up), his one-pixel smile
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', head: 'front', mouth: up ? 'smile' : 'rest'};
  const x = 184, y = 38;
  putBust(b, masPortrait(ms), x, y);
  drawCollarsPortrait(b, x, y, 3, {head: 'front', light: 'warm', style: 'v31'});
  faceKey(b, x, y, x + 112, y + 96, 1, -1);
  // his near arm, from his own shoulder: bent at the elbow, the glass going up in two held steps on the cheer, his hand
  // round it (the clinks stay in the sound)
  const lift = k < st.raise - 2 ? 0 : k < st.raise ? 1 : 2;
  const [gx, gy] = [[x + 96, 150], [x + 102, 106], [x + 104, 52]][lift];
  const sh: [number, number] = [x + 100, y + 110];
  armTo(b, sh, [x + 124, lift === 2 ? y + 84 : y + 124], [gx + 7, gy + 22], HOODIE);
  bigGlass(b, gx, gy);
  grip(b, gx, gy + 12, 14, 1);
  void f; void st.clink1; void st.clink2;
};
/** a paper cup at bust scale (w x h): its rim, its band, its taper */
const paperCup = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) { const inset = Math.round(j * 0.12); for (let i = inset; i < w - inset; i++) b.set(x + i, y + j, j === 0 ? PAL.P1 : j > 3 && j < 7 ? PAL.C5 : i === inset ? PAL.P0 : PAL.P2); }
};
/** his glass at bust scale: a clear tumbler, its water line catching the room's warm light */
const bigGlass = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 24; j++) for (let i = 0; i < 14; i++) {
    const edge = i === 0 || i === 13 || j === 23;
    b.set(x + i, y + j, edge ? (i === 0 ? PAL.G6 : PAL.G4) : j < 7 ? stepColor(b.get(x + i, y + j), 1) : i < 3 ? PAL.C7 : PAL.C5);
  }
  rect(x + 1, y + 7, 12, 1, b.ink(PAL.C8)); b.set(x + 3, y + 2, PAL.W9); b.set(x + 3, y + 3, PAL.W8);
};
// ------------------------------------------------------------------ [2S] v35-32A.03
/** where Mas's glass leaves the frame in 32A.03 (its left edge, x): 20.01 has it set down on his desk there */
export const PARTY_GLASS_OUT = 196;
export interface PartyToastSt { k: number; toast: number; laugh: number; down: number }
export const partyToast = (b: Buf, f: number, st: PartyToastSt) => {
  const {k} = st;
  bullpenWindow(b, false, -20);
  banner(b, 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.5) { const c = b.get(x, y); b.set(x, y, stepColor(c, lightness(c) > 0.35 ? -1 : lightness(c) < 0.1 ? 1 : 0)); }
  const laughing = k >= st.laugh && k < st.down;
  const bob = laughing ? [0, 1, 2, 1][Math.floor((k - st.laugh) / 5) % 4] : 0;
  const warmFrom = st.toast - 8; // Alyi turns to Mas as the toast comes
  // MAS (left, turned to him): smiling from the toast, laughing (mouth open, eyes crinkled) through the laugh
  const mOpen = laughing && Math.floor((k - st.laugh) / 4) % 3 !== 2;
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0, mouth: laughing ? (mOpen ? 'A' : 'smile') : k >= warmFrom ? 'smile' : 'rest'};
  const mt = new Buf(480, RH, TR);
  putBust(mt, masPortrait(ms), 70, 40 + bob);
  drawCollarsPortrait(mt, 70, 40 + bob, 3, {head: '34', light: 'warm', style: 'v31'});
  if (laughing) happyEyes(mt, 70, 40 + bob, MAS_EYES.band, MAS_EYES.eyes, MAS_EYES.outer);
  for (let y = 0; y < RH; y++) for (let x = 70; x < 182; x++) { const v = mt.c[y * 480 + x]; if (v !== TR) b.set(251 - x, y, v); }
  faceKey(b, 70, 40, 182, 140, 1, 1);
  // ALYI (right): first turned to the room (his portrait flipped), then his head turns to Mas as the toast comes (a
  // swapped drawing), smiling at him, his eyes warm; the laugh: mouth open, eyes crinkled, and he leans in
  const turned = k >= warmFrom;
  const lean = laughing ? (k < st.laugh + 3 ? 2 : 4) : 0;
  const ax0 = 262 - lean, ay0 = 42 + (bob === 1 ? 1 : 0) + (lean ? 1 : 0);
  const as: AlyiSpeakState = {...ALYI_SPEAK_DEFAULT, t: f, mouth: turned ? 'smile' : 'rest', eyes: 'open'};
  const at = new Buf(480, RH, TR);
  putBust(at, alyiSpeakPortrait(as), ax0, ay0, {flip: !turned});
  if (turned && !laughing) alyiWarmEyes(at, ax0, ay0);
  if (laughing) { happyEyes(at, ax0, ay0, ALYI_EYES.band, ALYI_EYES.eyes, ALYI_EYES.outer); alyiLaugh(at, ax0, ay0, Math.floor((k - st.laugh) / 4) % 3 === 2 ? 2 : 3); }
  for (let i = 0; i < 480 * RH; i++) if (at.c[i] !== TR) b.c[i] = at.c[i];
  faceKey(b, ax0, ay0, ax0 + 112, ay0 + 100, 2, -1);
  // a desk's edge at the frame's foot (cups, a pizza box) hides where the busts end
  const top = 186;
  for (let y = top; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === top ? PAL.W4 : y < top + 3 ? PAL.D3 : bayer(x, y) < 0.3 ? PAL.D1 : PAL.D2);
  for (const cx of [26, 380, 420]) { rect(cx, top - 9, 6, 9, b.ink(PAL.P2)); rect(cx, top - 6, 6, 2, b.ink(PAL.C5)); }
  rect(300, top - 4, 60, 4, b.ink(PAL.D4)); rect(300, top - 4, 60, 1, b.ink(PAL.P1));
  // Alyi's sweater, sampled from his own portrait (its shoulder), for his arm
  const sw = at.get(ax0 + 30, ay0 + 122), ALYI_SW: Sleeve = [stepColor(sw, -1), sw, stepColor(sw, 1), PAL.W3];
  // the toast: Mas's glass (his arm from his own shoulder, bent, his hand round it) to Alyi's cup (his arm from his
  // shoulder); the clink at centre; Alyi's cup goes down after it; Mas's glass comes down out of the frame at x 196
  const reach = k < st.toast - 8 ? 0 : k < st.toast - 4 ? 1 : k < st.toast + 10 ? 2 : 1;
  const down = k >= st.down ? Math.min(3, Math.floor((k - st.down) / 3) + 1) : 0;
  const gx = down ? PARTY_GLASS_OUT : [PARTY_GLASS_OUT, 208, 220][reach], gy = down ? [0, 128, 160, 206][down] : [150, 116, 104][reach];
  const masSh: [number, number] = [172, 146 + bob];
  if (gy < RH) { armTo(b, masSh, [184, 178], [gx - 4, gy + 16], HOODIE); bigGlass(b, gx, gy); grip(b, gx, gy + 11, 14, -1); }
  const cupDown = k >= st.toast + 10 ? Math.min(3, Math.floor((k - st.toast - 10) / 3)) : 0;
  if (cupDown < 3 && !(laughing && k >= st.laugh + 2)) {
    const cx = [292, 250, 236][reach], cy = [150, 116, 106][reach] + [0, 16, 40][cupDown];
    armTo(b, [ax0 + 8, ay0 + 106], [ax0 + 2, 178], [cx + 16, cy + 14], ALYI_SW);
    paperCup(b, cx, cy, 13, 20);
    grip(b, cx, cy + 9, 13, 1);
  }
  if (k >= st.toast && k < st.toast + 4) { const cx = 235, cy = 110; b.set(cx, cy, PAL.W9); for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]] as Array<[number, number]>) b.set(cx + dx, cy + dy, PAL.W7); }
  // Alyi's hand on Mas's shoulder through the laugh: his arm from his own shoulder, reaching across (the sweater, the
  // elbow low between them, the cuff), his hand resting over Mas's shoulder, the fingers down its far side
  if (k >= st.laugh + 5 && k < st.down + 6) {
    const hx = 178, hy = 134 + bob;
    armTo(b, [ax0 + 8, ay0 + 104], [226, 170], [hx + 14, hy + 6], ALYI_SW);
    for (let j = 0; j < 11; j++) for (let i = 0; i < 20; i++) if (Math.hypot((i - 10) / 10, (j - 5) / 5.5) < 1) b.set(hx + i - 4, hy + j - 2, j < 2 ? PAL.S5 : i < 3 ? PAL.S3 : PAL.S4);
    for (let q = 0; q < 4; q++) for (let j = 0; j < 9; j++) { const X = hx - 6 + q * 4, Y = hy + 6 + j - (q === 0 ? 1 : 0); b.set(X, Y, PAL.S4); b.set(X + 1, Y, PAL.S3); if (j === 8) b.set(X, Y, PAL.S2); }
  }
  void clamp; void hash;
};
