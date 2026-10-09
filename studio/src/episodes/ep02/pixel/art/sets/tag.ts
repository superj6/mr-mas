// MR. MAS — Ep2 v1 art: the TAG (sc 23) on his monitor: SET-08, THE PODIUM (the intro's podium, still facing away, on its
// hill: a plain fluted gold podium, Ep1's roll-call design, never a seal), RUMPT's HANDS (§2.2: navy sleeves, white cuffs,
// the over-long red tie; hands only: no face, no voice, no fist pumps), the CHATBOT BALLOON (§2.3: CHATGTP's bubble shape
// and dot eyes, no words, no sticker), the unbranded broadcast player with its lower third, RUMPT's post with the rally
// photo (SIRRAH's plate, a SUMMER 2024 decal, the crowd silhouettes), THE ORB's TERMINAL scan (human, human…), the egg
// in a background tab. All of it monitor painters (kits/mas-monitor: [POV] full-bleed or [OTS]).
//   broadcastPainter(k)        the Aug 21 interview in its own plain player: hands and tie only, the lower third
//                              "…having me speak… It's a little bit dangerous out there." (real words only), typing on
//                              with a neutral blip (st.k chars)
//   podiumPainter(st)          THE PODIUM on its hill, facing away; the hands from behind it pumping the balloon (st.size
//                              1..4), tying it on (st.tie), the string going taut (st.taut)
//   rallyPostPainter(st)       RUMPT's post `…and she 'A.I.'d' it…` (it arrives all at once), its photo: the rally crowd
//                              under SIRRAH's plate, the decal; st.scan 0..n: THE ORB's TERMINAL scan face by face
//                              (human · human · …), st.verdict
//   rumptHands(b, x, y, pose)  the hands (room-to-medium scale): 'talk' | 'pump' | 'tie'
//   refiledLanding(b, f, st)   [OTS] 23.01: the refiled complaint landing on his desk (NOLE v. MANALT ET AL. · FEDERAL
//                              COURT), the (FOR NOW) note stuck to it, crossed out
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawMonitorPOV, Painter} from '../../../../../shared/pixel/kits/mas-monitor';
import {drawOrb} from '../../../../../shared/pixel/cast/orb-medium';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith, grip, capsule, armTo} from '../kit';
import {drawChatBalloon, drawEggTab} from '../creatures';
import {crowdBacks} from '../cast/civic2';
import {placeHand, drawHand, sleeve, POSES, HandPose} from '../cast/hands2';
import type {ArtAsset} from '../asset';

const NAVY: [number, number, number, number] = [PAL.N0, PAL.N1, PAL.N2, PAL.N4];
/** the over-long red tie (it hangs far past where a tie ends) */
const tie = (b: Buf, x: number, y: number, len: number) => { poly([x - 4, y, x + 4, y, x + 3, y + 6, x + 6, y + len, x, y + len + 6, x - 6, y + len, x - 3, y + 6], b.ink(PAL.R2)); line(x + 2, y + 6, x + 4, y + len, b.ink(PAL.R1)); fill(b, x - 4, y, 8, 4, PAL.R1); };
export const rumptHands = (b: Buf, x: number, y: number, pose: 'talk' | 'pump' | 'tie', f = 0) => {
  // two navy sleeves with white cuffs coming in from below toward the middle, real hands at their ends
  const up = pose === 'pump' ? (Math.floor(f / 4) % 2 ? -10 : 0) : pose === 'talk' ? (Math.floor(f / 6) % 2 ? -3 : 0) : 0;
  const P = pose === 'talk' ? POSES.open : POSES.grip;
  rHand(b, P([-0.2, -1, 0.15], [0, 0, -1], 'R'), [x - 18, y + 14 + up], 'wrist', 1.6, [x - 40, y + 60]);
  rHand(b, P([0.2, -1, 0.15], [0, 0, -1], 'L'), [x + 18, y + 14 + up], 'wrist', 1.6, [x + 40, y + 60]);
};
// ------------------------------------------------------------------ his hands: Ep1's insert-hands grammar
// (the art review: the palms floated in front of the suit with no forearms). Each hand is a real hand (cast/hands2.ts):
// knuckles, nails, the thumb, the wrist into a white shirt cuff, and the navy sleeve from the cuff back to the elbow
// below the frame's edge.
const CUFF_W = [PAL.N2, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2, PAL.P2];
const SLEEVE_N = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5];
const rHand = (scr: Buf, pose: HandPose, at: [number, number], anchor: 'index' | 'middle' | 'thumb' | 'wrist', s: number, elbow: [number, number], o: {before?: (b: Buf) => void} = {}) => {
  const h = placeHand(pose, {s, at, anchor, light: 'lobby', cuffRamp: CUFF_W, key: [-0.3, -0.75, 0.6]});
  // (the sleeve as wide as the cuff it leaves, widening to the elbow)
  sleeve(scr, h.cuffEnd, elbow, Math.max(4, 4.2 * s), Math.max(5, 5.2 * s), SLEEVE_N);
  o.before?.(scr);
  drawHand(scr, h.hand, h.x, h.y);
  return h;
};

// ------------------------------------------------------------------ the broadcast (Aug 21)
const LOWER = '…having me speak… It\'s a little bit dangerous out there.';
export const broadcastPainter = (k = 999): Painter => (scr: Buf) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2;
  // a plain interview set (no network, no logo): a soft blue-grey ground with out-of-focus lights
  vramp(scr, 0, 0, W, H, [PAL.F1, PAL.F2, PAL.F3]);
  for (let i = 0; i < 14; i++) { const bx = (i * 67) % W, by = 10 + (i * 41) % Math.round(H * 0.5); ellipse(bx, by, 3 * s, 3 * s, scr.ink(i % 3 ? PAL.F3 : PAL.W4)); }
  // the suit from the chin down: navy shoulders, lapels, the white shirt's V, the over-long red tie past the frame
  const cx = Math.round(W / 2), sh = Math.round(W * 0.3), top = Math.round(H * 0.04);
  for (let y = top; y < H; y++) { const half = Math.min(sh, Math.round(sh * 0.78 + (y - top) * 1.4)); fill(scr, cx - half, y, half * 2, 1, PAL.N1); }
  const vb = Math.round(H * 0.5);
  for (let y = top; y < vb; y++) { const hw = Math.round(((vb - y) / (vb - top)) * W * 0.07); fill(scr, cx - hw, y, hw * 2, 1, PAL.P2); line(cx - hw - 1, y, cx - hw - 3 * s, y, scr.ink(PAL.N3)); line(cx + hw, y, cx + hw + 3 * s - 1, y, scr.ink(PAL.N3)); }
  tie(scr, cx, top + 2, Math.round(H * 0.9));
  // his hands up in front of the jacket, talking with them (held drawings on 6s): sleeves from the sides, white cuffs
  const up = Math.floor(k / 6) % 2;
  const hl: [number, number] = [cx - Math.round(W * 0.15), Math.round(H * 0.6) - up * 4 * s], hr: [number, number] = [cx + Math.round(W * 0.15), Math.round(H * 0.6) - (1 - up) * 4 * s];
  // the forearms rise from the elbows below the frame's edge to the cuffs; the open hands, palms to the camera
  const hs = 1.15 * s;
  rHand(scr, POSES.open([-0.18, -1, 0.15], [0, 0, -1], 'R'), [hl[0], hl[1] + 10 * s], 'wrist', hs, [hl[0] - 10 * s, H + 12]);
  rHand(scr, POSES.open([0.18, -1, 0.15], [0, 0, -1], 'L'), [hr[0], hr[1] + 10 * s], 'wrist', hs, [hr[0] + 10 * s, H + 12]);
  // the broadcast's own lower third, plain, his words typing on with a neutral blip (k chars)
  const lh = s > 1 ? 30 : 14;
  fill(scr, 0, H - lh - 6, W, lh, PAL.N0); fill(scr, 0, H - lh - 6, 6, lh, PAL.P2);
  const t = LOWER.slice(0, k);
  if (s < 2) tiny(scr, t.toUpperCase().slice(0, 30), 8, H - lh - 2, PAL.P2); else pwrap(t, W - 20).forEach((l, i) => pt(scr, l, 12, H - lh - 2 + i * 10, PAL.P2));
  fill(scr, 0, H - 4, W, 4, PAL.N1); fill(scr, 0, H - 4, Math.round(W * 0.4), 1, PAL.R2);
};

// ------------------------------------------------------------------ THE PODIUM on its hill, facing away
/** THE PODIUM from behind (it faces away): the plain fluted gold box (Ep1's roll-call podium), its slanted reading top
 *  and two goosenecks seen from the back, the flutes catching light down its near side; x = centre, y = the top lip */
const podiumBack = (b: Buf, x: number, y: number, w: number, h: number) => {
  const x0 = x - (w >> 1);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const u = i / w; let c = u < 0.05 ? PAL.W5 : u < 0.8 ? (bayer(x0 + i, y + j) < 0.3 ? PAL.W2 : PAL.W3) : PAL.W4; if (u >= 0.8 && (i - Math.round(w * 0.8)) % 5 === 0) c = PAL.W2; b.set(x0 + i, y + j, c); }
  fill(b, x0 - 3, y - 5, w + 6, 6, PAL.W6); fill(b, x0 - 3, y - 5, w + 6, 1, PAL.W8); fill(b, x0 - 3, y, w + 6, 1, PAL.W1);
  fill(b, x0 + 6, y + 6, w - 12, Math.round(h * 0.18), PAL.W1); fill(b, x0 + 6, y + 6, w - 12, 1, PAL.N1);
  line(x - 4, y - 5, x - 7, y - 18, b.ink(PAL.N1)); line(x + 4, y - 5, x + 7, y - 18, b.ink(PAL.N1)); fill(b, x - 9, y - 21, 4, 4, PAL.N1); fill(b, x + 5, y - 21, 4, 4, PAL.N1);
};
export const podiumPainter = (st: {size?: 0 | 1 | 2 | 3 | 4; tie?: boolean; taut?: boolean; f?: number} = {}): Painter => (scr: Buf) => {
  // from behind the podium on its hill: the dusk sky (the intro hill's), the land falling away beyond, the podium's back
  // filling the lower middle; his hands come in from the frame's bottom edge (no body, no face)
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2;
  vramp(scr, 0, 0, W, H, [PAL.U1, PAL.U2, PAL.U3, PAL.U4]);
  const ridge = Math.round(H * 0.6);
  for (let x = 0; x < W; x++) { const y = ridge + Math.round(Math.sin(x / 37) * 4 + Math.sin(x / 13) * 2); for (let yy = y; yy < H; yy++) scr.set(x, yy, yy < y + 2 ? PAL.U1 : PAL.N1); }
  const px = Math.round(W / 2), pwid = Math.round(W * 0.42), py = Math.round(H * 0.55);
  podiumBack(scr, px, py, pwid, H - py);
  const size = st.size ?? 0, f = st.f ?? 0, bob = Math.floor(f / 4) % 2;
  const tieAt: [number, number] = [px - Math.round(pwid / 2) + 4, py - 4];
  if (size && !st.tie && !st.taut) {
    // pumping: a hand pump stood on the reading top (right), his right hand on its T-handle; his left hand holding the
    // balloon's neck at the hose's end (left)
    const pumpX = px + Math.round(pwid * 0.28), handleY = py - 30 * s + bob * 8 * s;
    fill(scr, pumpX - 3 * s, py - 24 * s, 6 * s, 20 * s, PAL.R1); fill(scr, pumpX - 3 * s, py - 24 * s, 2 * s, 20 * s, PAL.R2);
    fill(scr, pumpX - 1, handleY, 2, py - 24 * s - handleY, PAL.G5); fill(scr, pumpX - 8 * s, handleY - 2 * s, 16 * s, 3 * s, PAL.G4);
    for (let t = 0; t <= 30; t++) { const u = t / 30; scr.set(Math.round(pumpX - 4 * s + (tieAt[0] + 10 * s - pumpX) * u), Math.round(py - 6 * s + Math.sin(u * Math.PI) * 6), PAL.N2); }
    // his right hand round the T-handle (the back of it to us, the fingers over the bar), the arm from below the frame
    rHand(scr, POSES.grip([0.05, -0.55, -0.83], [0.1, -0.83, 0.55], 'R', 0.7), [pumpX + 2 * s, handleY + 1], 'middle', 1.15 * s, [W - 30 * s, H + 14]);
    // his left hand pinching the balloon's neck at the hose's end
    rHand(scr, POSES.pinch([0.35, -0.75, -0.5], [0.15, -0.55, 0.8], 'L'), [tieAt[0] + 8 * s, tieAt[1] - 12 * s], 'index', 1.15 * s, [30 * s, H + 14]);
    drawChatBalloon(scr, tieAt[0] + 18 * s, tieAt[1] - 24 * s - size * 4 * s, size as 1 | 2 | 3 | 4, {scale: s * 1.4, string: [tieAt[0] + 8 * s, tieAt[1] - 12 * s]});
  } else if (st.tie) {
    // tying it on: both hands at the podium's corner, the knot
    drawChatBalloon(scr, tieAt[0] + 24 * s, tieAt[1] - 44 * s, 4, {scale: s * 1.3, string: [tieAt[0] + 4 * s, tieAt[1] - 4 * s]});
    // both hands at the podium's corner, pinching the string into its knot
    rHand(scr, POSES.pinch([0.45, -0.7, -0.5], [0.2, -0.5, 0.85], 'L'), [tieAt[0] + 1 * s, tieAt[1] - 2 * s], 'index', 1.15 * s, [26 * s, H + 14]);
    rHand(scr, POSES.pinch([-0.45, -0.7, -0.5], [-0.2, -0.5, 0.85], 'R'), [tieAt[0] + 7 * s, tieAt[1] - 2 * s], 'index', 1.15 * s, [Math.round(W * 0.55), H + 14]);
  } else if (size) {
    // the hands gone; the string tied at the corner goes taut over the far edge, as if someone beyond took hold of it;
    // the balloon pulled down a little over the far side
    const edge: [number, number] = [px - Math.round(pwid * 0.1), py - 5];
    line(tieAt[0], tieAt[1], edge[0], edge[1], scr.ink(PAL.G6)); fill(scr, tieAt[0] - 1, tieAt[1] - 1, 3, 3, PAL.G6);
    drawChatBalloon(scr, edge[0] + 30 * s, py - 38 * s, 4, {scale: s * 1.3, string: [edge[0] + 4, edge[1] - 1], taut: true});
  }
};

// ------------------------------------------------------------------ RUMPT's post and the rally photo; the Orb's scan
export const rallyPostPainter = (st: {scan?: number; verdict?: boolean; egg?: boolean} = {}): Painter => (scr: Buf) => {
  const W = scr.w, H = scr.h;
  fill(scr, 0, 0, W, H, PAL.N1);
  if (W < 200) { fill(scr, 6, 6, W - 12, H - 12, PAL.N2); fill(scr, 10, 10, 8, 8, PAL.R1); fill(scr, 22, 12, 40, 2, PAL.P1); fill(scr, 10, 24, W - 20, H - 36, PAL.W4); return; }
  // a background window behind, its tab and page: an egg sitting on a bill (Ep3's)
  if (st.egg) drawEggTab(scr, W - 78, 18);
  // the post in its own UI (HTURT: the platform's plain card), arriving all at once
  const x = 14, y = 8, w = 262, h = H - 16;
  fill(scr, x, y, w, h, PAL.N2); fill(scr, x, y, w, 10, PAL.N3); tiny(scr, 'HTURT', x + 4, y + 2, PAL.R3);
  fill(scr, x + 6, y + 16, 14, 14, PAL.R1); fill(scr, x + 6, y + 16, 14, 1, PAL.R2);
  pt(scr, 'RUMPT', x + 26, y + 15, PAL.P2); pt(scr, '@rumpt', x + 32 + pw('RUMPT'), y + 15, PAL.N6);
  pt(scr, "…and she 'A.I.'d' it…", x + 26, y + 28, PAL.P1);
  // the photo: a rally crowd in a hangar's warm light under SIRRAH's plate (a stage sign), a SUMMER 2024 decal
  const ph = {x: x + 8, y: y + 42, w: w - 16, h: h - 50};
  vramp(scr, ph.x, ph.y, ph.w, ph.h, [PAL.W2, PAL.W4, PAL.W5]);
  for (let i = 0; i < 6; i++) fill(scr, ph.x + 6 + i * 42, ph.y + 4, 2, 22, PAL.W6);
  const plate = 'SIRRAH';
  fill(scr, ph.x + (ph.w >> 1) - 30, ph.y + 10, 60, 13, PAL.N1); fill(scr, ph.x + (ph.w >> 1) - 30, ph.y + 10, 60, 1, PAL.W7); pt(scr, plate, ph.x + (ph.w >> 1) - (pw(plate) >> 1), ph.y + 13, PAL.P2);
  // the crowd, facing the stage (and the camera on it): rows of faces, smaller and higher toward the back, all kinds of
  // people in the warm light; a few plain signs held up (no words); the decal on the photo's top corner
  const faces: Array<[number, number, number]> = [];
  const SK = [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.D3, PAL.B3], HR = [PAL.B0, PAL.B1, PAL.B2, PAL.G5, PAL.N1, PAL.W3], CL = [PAL.R2, PAL.C4, PAL.N3, PAL.W6, PAL.P1, PAL.L2, PAL.U3, PAL.G4];
  for (let r = 0; r < 5; r++) {
    const hr = 2 + r, gy = ph.y + 30 + r * (5 + r * 3), step = 5 + r * 3;
    for (let i = -((r * 5) % step); i < ph.w + step; i += step) {
      const fx = ph.x + i + ((r * 7 + i * 3) % 4), hj = (i * 13 + r * 7) % 3, q = (i * 7 + r * 11) & 0xffff;
      if (fx < ph.x + hr || fx > ph.x + ph.w - hr - 1) continue;
      const fy = gy - hj, cl = CL[q % CL.length];
      for (let y = fy + hr; y < ph.y + ph.h; y++) { const hw = Math.min(hr * 2, 1 + Math.round((y - fy - hr) * 0.8)) + hr; fill(scr, Math.max(ph.x, fx - hw), y, Math.min(hw * 2 + 1, ph.x + ph.w - Math.max(ph.x, fx - hw)), 1, cl); }
      ellipse(fx, fy, hr, hr + 1, scr.ink(SK[q % SK.length]));
      for (let k = -hr; k <= hr; k++) scr.set(fx + k, fy - hr - 1 + (Math.abs(k) > hr - 1 ? 1 : 0), HR[(q >> 3) % HR.length]);
      if (r >= 2) { scr.set(fx - Math.round(hr / 2), fy, PAL.N0); scr.set(fx + Math.round(hr / 2), fy, PAL.N0); }
      // (a sign only where it fits inside the photo)
      if (r >= 2 && q % 9 === 0 && fx - 2 >= ph.x && fx + hr * 2 + 2 < ph.x + ph.w) { fill(scr, fx + hr + 1, fy - hr * 4, 2, hr * 4, SK[q % SK.length]); fill(scr, fx - 2, fy - hr * 4 - 8, hr * 3 + 4, 8, PAL.C5); }
      if (r >= 1 && r < 4) faces.push([fx, fy, hr]);
    }
  }
  fill(scr, ph.x + ph.w - 54, ph.y + 3, 52, 10, PAL.P2); tiny(scr, 'SUMMER 2024', ph.x + ph.w - 52, ph.y + 5, PAL.R2);
  // THE ORB's TERMINAL scan (2.E): a bracket stepping face to face, each done one ticked; its log beside the post
  const n = Math.min(faces.length, st.scan ?? 0);
  for (let i = 0; i < n; i++) {
    const [fx, fy, hr] = faces[(i * 7) % faces.length];
    if (i < n - 1) { scr.set(fx, fy - hr - 3, PAL.C7); continue; }
    const r = hr + 3; for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { for (let q = 0; q < 3; q++) { scr.set(fx + dx * r - dx * q, fy + dy * r, PAL.C8); scr.set(fx + dx * r, fy + dy * r - dy * q, PAL.C8); } }
  }
  if (n) {
    const lx = x + w + 6, ly = st.egg ? 74 : 12, lw = W - lx - 6;
    fill(scr, lx, ly, lw, H - ly - 8, PAL.N0); fill(scr, lx, ly, lw, 1, PAL.C5);
    const rows = Math.min(n, Math.floor((H - ly - 30) / 8));
    for (let i = 0; i < rows; i++) tiny(scr, `${String(n - rows + i + 1).padStart(2, '0')} HUMAN`, lx + 4, ly + 4 + i * 8, i === rows - 1 ? PAL.C8 : PAL.C5);
  }
  if (st.verdict) { const t = 'verified: human (all of them)'; const tx = x + Math.round((w - pw(t) - 10) / 2); fill(scr, tx, H - 26, pw(t) + 10, 14, PAL.N0); fill(scr, tx, H - 26, pw(t) + 10, 1, PAL.C6); pt(scr, t, tx + 5, H - 23, PAL.C7); }
};
// ------------------------------------------------------------------ the refiled complaint on his desk
export const refiledLanding = (b: Buf, f: number, st: {land?: number} = {}) => {
  // the desk top close (the dark room), the refiled complaint thudding down on it, its cover and the crossed-out note
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 60 ? (bayer(x, y) < 0.15 ? PAL.C1 : PAL.N1) : (x + y * 2) % 41 < 2 ? PAL.D1 : PAL.D0);
  const dy = [-120, -40, -4, 0][clamp(st.land ?? 3, 0, 3)];
  fill(b, 120, 80 + dy, 240, 110, PAL.P2); fill(b, 120, 80 + dy, 240, 2, PAL.W9); fill(b, 124, 190 + dy, 240, 6, PAL.P0);
  bpt(b, 'NOLE v. MANALT ET AL.', 134, 96 + dy, PAL.N1); pt(b, 'FEDERAL COURT', 136, 120 + dy, PAL.N2);
  { const nw = pw('(FOR NOW)') + 12; fill(b, 318 - (nw >> 1), 130 + dy, nw, 40, PAL.W7); fill(b, 318 - (nw >> 1), 130 + dy, nw, 2, PAL.W8); pt(b, '(FOR NOW)', 324 - (nw >> 1), 146 + dy, PAL.N2); line(318 - (nw >> 1), 168 + dy, 318 + (nw >> 1), 132 + dy, b.ink(PAL.R2)); line(319 - (nw >> 1), 168 + dy, 319 + (nw >> 1), 132 + dy, b.ink(PAL.R2)); }
};

export const ART: ArtAsset[] = [
  {
    id: 'set08-podium', manifest: 'SET-08 · THE PODIUM (the tag) · §2.2 RUMPT\'s hands · §2.3 the chatbot balloon · §3 the broadcast, the rally post, the egg', kind: 'set', name: 'The tag on his monitor: the broadcast, THE PODIUM and the balloon, the rally post and the Orb\'s scan',
    file: 'sets/tag.ts (+ creatures.ts drawChatBalloon, drawEggTab)', exports: 'broadcastPainter, podiumPainter, rallyPostPainter, rumptHands, refiledLanding', scenes: '23',
    note: 'hands and tie only (no face, no voice, no fist pumps); the podium still faces away; the balloon has no words and no sticker; the lower third the broadcast\'s own, plain',
    stills: [
      {label: '[POV] 23.06: the Aug 21 interview in a plain player: hands and tie only, the lower third "…having me speak… It\'s a little bit dangerous out there."', draw: (b) => drawMonitorPOV(b, 0, broadcastPainter(999))},
      {label: '[POV] 23.07: THE PODIUM on its hill, still facing away; the same hands pump up the chatbot balloon (dot eyes, no words, no sticker)', draw: (b) => drawMonitorPOV(b, 0, podiumPainter({size: 3, f: 4}))},
      {label: '[POV] 23.07: they tie it to the podium', draw: (b) => drawMonitorPOV(b, 0, podiumPainter({size: 4, tie: true}))},
      {label: '[POV] 23.08: the string goes taut, as if someone on the far side of the podium had just taken hold of it', draw: (b) => drawMonitorPOV(b, 0, podiumPainter({size: 4, taut: true}))},
      {label: '[POV] 23.03-23.04: RUMPT\'s post and the rally photo (SIRRAH\'s plate, SUMMER 2024); the Orb\'s TERMINAL scan, verified: human (all of them); the egg in a background tab', draw: (b) => drawMonitorPOV(b, 0, rallyPostPainter({scan: 14, verdict: true, egg: true}))},
      {label: '23.01 the refiled complaint landed on his desk (the cover legible): FEDERAL COURT, the (FOR NOW) note crossed out', draw: (b) => refiledLanding(b, 0, {land: 3})},
    ],
  },
];
void rect; void hash; void bpw; void tinyWidth; void TR; void dith; void grip; void crowdBacks; void drawOrb; void applyPalette;
