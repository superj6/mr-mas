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
  const n = Math.max(Math.abs(hx - sx), Math.abs(hy - sy));
  for (let i = 0; i <= n; i++) { const x = Math.round(sx + (hx - sx) * i / n), y = Math.round(sy + (hy - sy) * i / n); b.set(x, y, c); b.set(x + 1, y, c); }
  rect(hx - 1, hy - 1, 3, 3, b.ink(skin));
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
    const ax = cx + 22, ay = top + dy + 56;
    for (let i = 0; i < 46; i++) { const x = ax + Math.round(i * 0.35), y = ay - i; for (let w = 0; w < 7; w++) b.set(x + w, y, col); }
    const hx = ax + 16, hy = ay - 50;
    rect(hx, hy, 9, 8, b.ink(PAL.S3));
    rect(hx - 1, hy - 14, 11, 14, b.ink(PAL.P2)); rect(hx - 1, hy - 10, 11, 2, b.ink(PAL.C5));
  }
};
export interface PartyCheerSt { k: number; raise: number; clink1: number; clink2: number }
export const partyCheer = (b: Buf, f: number, st: PartyCheerSt) => {
  const {k} = st;
  launchBackM(b, 140, {soft: 2, alyi: 'gone', warm: 1, underlines: 3});
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
  const lift = k < st.raise - 2 ? 0 : k < st.raise ? 1 : 2;
  const [hx, hy] = [[x + 102, 170], [x + 106, 118], [x + 108, 62]][lift];
  // his forearm up from the frame's foot (the hoodie's grey, lit warm on its edge), his hand round the glass
  for (let yy = hy + 10; yy < RH; yy++) { const t = (yy - hy - 10) / (RH - hy), cx = hx + 2 + Math.round(t * 12), hw = 6 + Math.round(t * 3); for (let xx = cx - hw; xx <= cx + hw; xx++) b.set(xx, yy, xx === cx - hw ? PAL.W4 : xx > cx + hw - 2 ? PAL.G1 : PAL.G3); }
  rect(hx - 4, hy + 2, 13, 10, b.ink(PAL.S4)); rect(hx - 4, hy + 2, 13, 2, b.ink(PAL.S5));
  bigGlass(b, hx - 3, hy - 22);
  // two cups clink near the lens: from the frame's bottom corners, meeting at its foot, a glint on each touch
  const near = (kk: number) => kk >= 0 && kk < 8;
  const c1 = k - st.clink1, c2 = k - st.clink2;
  if (c1 >= -6 && c2 < 12) {
    const t = c1 < 0 ? (c1 + 6) / 6 : 1;
    const lx = Math.round(130 + 70 * t), rx = Math.round(330 - 70 * t) - (near(c2) ? 4 : 0);
    nearCup(b, lx, 150, PAL.C5); nearCup(b, rx, 152, PAL.W5);
    if (near(c1) || near(c2)) { const gx = 240, gy = 158; b.set(gx, gy, PAL.W9); b.set(gx - 1, gy, PAL.W7); b.set(gx + 1, gy, PAL.W7); b.set(gx, gy - 1, PAL.W7); b.set(gx, gy + 1, PAL.W7); }
  }
  void f;
};
/** his glass at bust scale: a clear tumbler, its water line catching the room's warm light */
const bigGlass = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 24; j++) for (let i = 0; i < 14; i++) {
    const edge = i === 0 || i === 13 || j === 23;
    b.set(x + i, y + j, edge ? (i === 0 ? PAL.G6 : PAL.G4) : j < 7 ? stepColor(b.get(x + i, y + j), 1) : i < 3 ? PAL.C7 : PAL.C5);
  }
  rect(x + 1, y + 7, 12, 1, b.ink(PAL.C8)); b.set(x + 3, y + 2, PAL.W9); b.set(x + 3, y + 3, PAL.W8);
};
/** a paper cup near the lens (big, a little soft), its band */
const nearCup = (b: Buf, x: number, y: number, band: number) => {
  for (let j = 0; j < 44; j++) for (let i = 0; i < 30 + Math.round(j * 0.2); i++) {
    const X = x + i - Math.round(j * 0.1), Y = y + j; if (Y >= RH) continue;
    if (bayer(X, Y) < 0.08) continue;
    b.set(X, Y, j < 3 ? PAL.P1 : j > 8 && j < 16 ? band : i < 4 ? PAL.P0 : PAL.P2);
  }
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
  // Mas (left, turned to him) and Alyi (right, turned to Mas): warm, the laugh in their shoulders
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0, mouth: laughing ? 'smile' : k >= st.toast ? 'smile' : 'rest', lid: laughing && bob === 2 ? 1 : 0};
  const mt = new Buf(480, RH, TR);
  putBust(mt, masPortrait(ms), 70, 40 + bob);
  drawCollarsPortrait(mt, 70, 40 + bob, 3, {head: '34', light: 'warm', style: 'v31'});
  for (let y = 0; y < RH; y++) for (let x = 70; x < 182; x++) { const v = mt.c[y * 480 + x]; if (v !== TR) b.set(251 - x, y, v); }
  faceKey(b, 70, 40, 182, 140, 1, 1);
  const as: AlyiSpeakState = {...ALYI_SPEAK_DEFAULT, t: f, mouth: laughing ? (['A', 'E', 'smile', 'E'] as const)[Math.floor((k - st.laugh) / 4) % 4] : 'smile', eyes: laughing && bob === 2 ? 'closed' : 'open'};
  putBust(b, alyiSpeakPortrait(as), 262, 42 + (bob === 1 ? 1 : 0));
  faceKey(b, 262, 42, 374, 142, 2, -1);
  // a desk's edge at the frame's foot (cups, a pizza box) hides where the busts end; the hands and the glass go over it
  const top = 186;
  for (let y = top; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === top ? PAL.W4 : y < top + 3 ? PAL.D3 : bayer(x, y) < 0.3 ? PAL.D1 : PAL.D2);
  for (const cx of [26, 380, 420]) { rect(cx, top - 9, 6, 9, b.ink(PAL.P2)); rect(cx, top - 6, 6, 2, b.ink(PAL.C5)); }
  rect(300, top - 4, 60, 4, b.ink(PAL.D4)); rect(300, top - 4, 60, 1, b.ink(PAL.P1));
  // a forearm from off the frame's foot up to a hand at (hx, hy): a sleeve band (lit edge), the hand
  const arm = (hx: number, hy: number, bx: number, sleeve: number, rim: number) => {
    for (let yy = hy + 20; yy < RH; yy++) { const t = (yy - hy - 20) / Math.max(1, RH - hy - 20); const cx = hx + 6 + Math.round((bx - hx - 6) * t), hw = 7 + Math.round(t * 3); for (let xx = cx - hw; xx <= cx + hw; xx++) b.set(xx, yy, xx === cx - hw ? rim : sleeve); }
    rect(hx - 2, hy + 12, 16, 10, b.ink(PAL.S4)); rect(hx - 2, hy + 12, 16, 2, b.ink(PAL.S5));
  };
  // the toast: Alyi's cup (from the right) to Mas's glass (from the left), the clink at centre; then Alyi's cup goes
  // down and his hand goes to Mas's shoulder for the laugh; Mas's glass comes down out of the frame at x 196
  const reach = k < st.toast - 8 ? 0 : k < st.toast - 4 ? 1 : k < st.toast + 10 ? 2 : 1;
  const down = k >= st.down ? Math.min(3, Math.floor((k - st.down) / 3) + 1) : 0;
  const gx = down ? PARTY_GLASS_OUT : [PARTY_GLASS_OUT, 212, 222][reach], gy = down ? [0, 140, 172, 210][down] : [150, 122, 112][reach];
  if (gy < RH) { arm(gx, gy, gx - 34, PAL.G3, PAL.W4); bigGlass(b, gx, gy - 6); }
  const cupGone = k >= st.laugh + 2;
  if (!cupGone) {
    const ax = [300, 262, 240][reach], ay = [150, 122, 112][reach];
    arm(ax, ay, ax + 40, PAL.N2, PAL.W3);
    rect(ax, ay - 6, 12, 18, b.ink(PAL.P2)); rect(ax, ay - 2, 12, 3, b.ink(PAL.C5)); rect(ax, ay - 6, 12, 1, b.ink(PAL.P1));
  }
  if (k >= st.toast && k < st.toast + 4) { const cx = 236, cy = 112; b.set(cx, cy, PAL.W9); for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]] as Array<[number, number]>) b.set(cx + dx, cy + dy, PAL.W7); }
  // Alyi's hand on Mas's shoulder through the laugh: his near arm across (the sweater's dark, its top lit warm), the
  // hand resting on the hoodie's shoulder
  if (k >= st.laugh + 6 && k < st.down + 6) {
    const sx = 268, sy = 150 + bob, hx = 176, hy = 128 + bob;
    for (let i = 0; i <= sx - hx; i++) { const x = sx - i, yc = Math.round(sy + (hy - sy) * i / (sx - hx) - Math.sin(i / (sx - hx) * Math.PI) * 6); for (let w = -6; w <= 6; w++) b.set(x, yc + w, w === -6 ? PAL.W3 : w > 4 ? PAL.N1 : PAL.N2); }
    for (let j = 0; j < 12; j++) for (let i = 0; i < 18; i++) if (Math.hypot((i - 9) / 9, (j - 6) / 6) < 1) b.set(hx - 12 + i, hy - 8 + j, j < 3 ? PAL.S5 : i < 3 ? PAL.S3 : PAL.S4);
  }
  void clamp; void hash;
};
