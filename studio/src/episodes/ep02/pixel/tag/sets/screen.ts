// MR. MAS — Ep2 v1 · tag: WHAT IS ON HIS MONITOR in sc 23 (AUG 5 → AUG 21, 2024). The tag's picture pass, 2026-10-10.
// Monitor painters `(scr, f) => void` for Ep1's kits/mas-monitor (drawMonitorPOV full-bleed, or the tag's OTS), built on
// the art pass's SET-08 (art/sets/tag.ts: the rally post, the broadcast, THE PODIUM, RUMPT's hands; art/creatures.ts
// drawChatBalloon, drawEggTab), COPIED where a shot needs more than the still (the art file is never edited):
//   feedPainter(st)        23.03: HTURT's plain feed (no real platform's name or marks); RUMPT's post arrives in ONE
//                          FRAME, whole (his text never types): `…and she 'A.I.'d' it…`, its photo (a rally crowd under
//                          SIRRAH's plate, a SUMMER 2024 decal); the egg on a bill in a background tab (Ep3's)
//   photoFaces(w, h)       the crowd's faces in that photo (screen px), for the Orb's TERMINAL scan (23.04)
//   broadcastPainter(st)   23.06-23.07: the Aug 21 interview in a PLAIN player (no network, no logo): hands and tie only,
//                          no face, no voice (the player's speaker muted), the hands at a real size; its own lower third, whole, "…having me
//                          speak… It's a little bit dangerous out there." (his real words, the faithful crop); the
//                          player's chrome (its bar, the lower third, the frame) clearing in held steps (st.clear)
//   podiumPainter(st)      23.07-23.08 (restaged, the final fix round: guardrail X4): THE PODIUM FULL FRAME in the
//                          broadcast's own studio (no hill, no dusk, no crowd, no flags), seen from where he stands,
//                          still facing away; his hands low on the reading surface on forearms from the frame's foot
//                          (one man at his lectern, never one behind it): a pinch on a slim party pump lying flat (a
//                          round cream knob pushed sideways; no upright barrel, no T-handle, no red) and on the
//                          balloon's neck; the balloon in CHATGTP's bubble shape (dot eyes, no words, no sticker); the
//                          hands tie it to the near ledge and slide away; then the balloon lifts, the string snaps
//                          straight up out of the top of the frame, and it tugs once more (its own pull, nobody's)
// The candidate is hands and tie only (guardrails; art.md §4): no face, no voice, no fist pumps, no raised arm.
import {Buf, line, ellipse, poly, bayer, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import type {Painter} from '../../../../../shared/pixel/kits/mas-monitor';
import {fill, pt, pw, pwrap, tiny, tinyWidth, vramp} from '../../art/kit';
import {drawChatBalloon, drawEggTab} from '../../art/creatures';
import {placeHand, drawHand, POSES} from '../../art/cast/hands2';
import type {HandPose} from '../../art/cast/hands2';
import {forearm} from './common';

// ================================================================== RUMPT's hands (the art's rHand, foreshortened)
const CUFF_W = [PAL.N2, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2, PAL.P2];
/** his jacket's sleeve: [outline, shadow, mid, lit, rim] */
const SLEEVE_N = [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N6];
/** a hand (cast/hands2) with the white shirt cuff, and the navy sleeve from the cuff back toward the elbow below the
 *  frame's edge, WIDENING toward the lens (common forearm: the art's sleeves were two poles of one width from the
 *  frame's corners) */
const rHand = (scr: Buf, pose: HandPose, at: [number, number], anchor: 'index' | 'middle' | 'thumb' | 'wrist', s: number, elbow: [number, number], o: {key?: [number, number]} = {}) => {
  const h = placeHand(pose, {s, at, anchor, light: 'lobby', cuffRamp: CUFF_W, key: [-0.3, -0.75, 0.6]});
  forearm(scr, h.cuffEnd, elbow, Math.max(3, 3.6 * s), Math.max(6, 9.5 * s), SLEEVE_N, o.key);
  drawHand(scr, h.hand, h.x, h.y);
  return h;
};
// ================================================================== 23.03-23.05: HTURT, RUMPT's post, the photo
const POST_TEXT = "…and she 'A.I.'d' it…";
/** the post's card and its photo, for a screen w x h (the art's layout: the card at the left, the background tab right) */
const postGeo = (W: number, H: number) => {
  const x = 14, y = 8, w = Math.min(262, W - 84), h = H - 16;
  return {x, y, w, h, ph: {x: x + 8, y: y + 42, w: w - 16, h: h - 50}};
};
/** the crowd in the photo (the art's crowd: rows of faces, smaller and higher toward the back, plain signs with no
 *  words), drawn into `scr`; returns every face [x, y, r] (screen px), front rows last */
const drawCrowd = (scr: Buf, ph: {x: number; y: number; w: number; h: number}) => {
  // drawn on a layer and kept inside the photo's rect (at the OTS's size the art's rows ran out under it, and its pillars
  // into the background tab); the rows' spacing follows the photo's height (the art's was set for the POV's 120 px)
  const t = new Buf(scr.w, scr.h, 0x1000000);
  vramp(t, ph.x, ph.y, ph.w, ph.h, [PAL.W2, PAL.W4, PAL.W5]);
  for (let i = 0; 6 + i * 42 < ph.w - 2; i++) fill(t, ph.x + 6 + i * 42, ph.y + 4, 2, 22, PAL.W6);
  const plate = 'SIRRAH';
  fill(t, ph.x + (ph.w >> 1) - 30, ph.y + 10, 60, 13, PAL.N1); fill(t, ph.x + (ph.w >> 1) - 30, ph.y + 10, 60, 1, PAL.W7);
  const faces: Array<[number, number, number]> = [];
  const SK = [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.D3, PAL.B3], HR = [PAL.B0, PAL.B1, PAL.B2, PAL.G5, PAL.N1, PAL.W3], CL = [PAL.R2, PAL.C4, PAL.N3, PAL.W6, PAL.P1, PAL.L2, PAL.U3, PAL.G4];
  const vs = Math.min(1, ph.h / 120);
  for (let r = 0; r < 5; r++) {
    const hr = 2 + r, gy = ph.y + Math.round((30 + r * (5 + r * 3)) * vs), step = 5 + r * 3;
    for (let i = -((r * 5) % step); i < ph.w + step; i += step) {
      const fx = ph.x + i + ((r * 7 + i * 3) % 4), hj = (i * 13 + r * 7) % 3, q = (i * 7 + r * 11) & 0xffff;
      if (fx < ph.x + hr || fx > ph.x + ph.w - hr - 1) continue;
      const fy = gy - hj, cl = CL[q % CL.length];
      for (let y = fy + hr; y < ph.y + ph.h; y++) { const hw = Math.min(hr * 2, 1 + Math.round((y - fy - hr) * 0.8)) + hr; fill(t, Math.max(ph.x, fx - hw), y, Math.min(hw * 2 + 1, ph.x + ph.w - Math.max(ph.x, fx - hw)), 1, cl); }
      ellipse(fx, fy, hr, hr + 1, t.ink(SK[q % SK.length]));
      for (let k = -hr; k <= hr; k++) t.set(fx + k, fy - hr - 1 + (Math.abs(k) > hr - 1 ? 1 : 0), HR[(q >> 3) % HR.length]);
      if (r >= 2) { t.set(fx - Math.round(hr / 2), fy, PAL.N0); t.set(fx + Math.round(hr / 2), fy, PAL.N0); }
      if (r >= 2 && q % 9 === 0 && fx - 2 >= ph.x && fx + hr * 2 + 2 < ph.x + ph.w) { fill(t, fx + hr + 1, fy - hr * 4, 2, hr * 4, SK[q % SK.length]); fill(t, fx - 2, fy - hr * 4 - 8, hr * 3 + 4, 8, PAL.C5); }
      if (fy < ph.y + ph.h - hr) faces.push([fx, fy, hr]);
    }
  }
  // the plate's name over the crowd's back rows (the stage sign above them), the decal on the photo's corner
  fill(t, ph.x + (ph.w >> 1) - 30, ph.y + 10, 60, 13, PAL.N1); fill(t, ph.x + (ph.w >> 1) - 30, ph.y + 10, 60, 1, PAL.W7); pt(t, plate, ph.x + (ph.w >> 1) - (pw(plate) >> 1), ph.y + 13, PAL.P2);
  fill(t, ph.x + ph.w - 54, ph.y + 3, 52, 10, PAL.P2); tiny(t, 'SUMMER 2024', ph.x + ph.w - 52, ph.y + 5, PAL.R2);
  for (let y = ph.y; y < ph.y + ph.h; y++) for (let x = ph.x; x < ph.x + ph.w; x++) { const v = t.get(x, y); if (v !== 0x1000000) scr.set(x, y, v); }
  return faces;
};
/** the faces in the photo of a w x h screen (the Orb's scan steps through them) */
export const photoFaces = (W: number, H: number) => {
  const g = postGeo(W, H), t = new Buf(W, H, PAL.N0);
  return {ph: g.ph, faces: drawCrowd(t, g.ph)};
};
/** HTURT's feed. st.post: RUMPT's post is up (it arrives whole in one frame); st.egg: the background tab with the egg
 *  on a bill; st.ticks: the faces the Orb has verified, a small tick over each (after its scan) */
export const feedPainter = (st: {post: boolean; egg?: boolean; ticks?: Array<[number, number, number]>}): Painter => (scr: Buf) => {
  const W = scr.w, H = scr.h;
  fill(scr, 0, 0, W, H, PAL.N1);
  if (W < 200) { fill(scr, 6, 6, W - 12, H - 12, PAL.N2); if (st.post) { fill(scr, 10, 10, 8, 8, PAL.R1); fill(scr, 22, 12, 40, 2, PAL.P1); fill(scr, 10, 24, W - 20, H - 36, PAL.W4); } return; }
  // the background window behind the feed, its tab and page: an egg sitting on a bill (Ep3's)
  if (st.egg) drawEggTab(scr, W - 74, 18);
  const g = postGeo(W, H);
  // the platform's plain chrome (its own name only: HTURT; no real platform's marks)
  fill(scr, g.x, g.y, g.w, g.h, PAL.N2); fill(scr, g.x, g.y, g.w, 10, PAL.N3); tiny(scr, 'HTURT', g.x + 4, g.y + 2, PAL.R3);
  if (!st.post) {
    // the feed before it: other posts as grey rows (avatars, bars; nothing legible)
    for (let r = 0; r < 4; r++) {
      const yy = g.y + 16 + r * 38;
      if (yy + 30 > g.y + g.h) break;
      fill(scr, g.x + 6, yy, 14, 14, PAL.N4); fill(scr, g.x + 26, yy + 2, 50 + ((r * 37) % 40), 3, PAL.N5);
      fill(scr, g.x + 26, yy + 10, g.w - 50 - ((r * 29) % 60), 3, PAL.N4); fill(scr, g.x + 26, yy + 17, g.w - 90 - ((r * 17) % 50), 3, PAL.N4);
      fill(scr, g.x + 4, yy + 32, g.w - 8, 1, PAL.N3);
    }
    return;
  }
  // RUMPT's post, whole: a plain red square avatar, his name and handle, his words, the photo
  fill(scr, g.x + 6, g.y + 16, 14, 14, PAL.R1); fill(scr, g.x + 6, g.y + 16, 14, 1, PAL.R2);
  pt(scr, 'RUMPT', g.x + 26, g.y + 15, PAL.P2); pt(scr, '@rumpt', g.x + 32 + pw('RUMPT'), g.y + 15, PAL.N6);
  // its own date on the name row, right-aligned, as every Ep2 post carries one (the film's fixes pass, 2026-10-10: the
  // rail AUG 11 is gone, so the post dates itself; facts A49)
  pt(scr, 'AUG 11', g.x + g.w - 6 - pw('AUG 11'), g.y + 15, PAL.N6);
  pt(scr, POST_TEXT, g.x + 26, g.y + 28, PAL.P1);
  drawCrowd(scr, g.ph);
  for (const [fx, fy, hr] of st.ticks ?? []) { for (let i = 0; i < 3; i++) scr.set(fx - 1 + i, fy - hr - 4 + (i === 1 ? 1 : 0), PAL.C8); scr.set(fx + 2, fy - hr - 5, PAL.C8); }
};

// ================================================================== 23.06-23.07: the broadcast (Aug 21)
const LOWER = '…having me speak… It\'s a little bit dangerous out there.';
const tie = (b: Buf, x: number, y: number, len: number) => { poly([x - 4, y, x + 4, y, x + 3, y + 6, x + 6, y + len, x, y + len + 6, x - 6, y + len, x - 3, y + 6], b.ink(PAL.R2)); line(x + 2, y + 6, x + 4, y + len, b.ink(PAL.R1)); fill(b, x - 4, y, 8, 4, PAL.R1); };
/** the interview's plain set (no network, no logo): its blue ramp and its soft lights */
const interviewSet = (scr: Buf) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2;
  vramp(scr, 0, 0, W, H, [PAL.F1, PAL.F2, PAL.F3]);
  for (let i = 0; i < 14; i++) { const bx = (i * 67) % W, by = 10 + (i * 41) % Math.round(H * 0.5); ellipse(bx, by, 3 * s, 3 * s, scr.ink(i % 3 ? PAL.F3 : PAL.W4)); }
};
/** the interview's picture (no chrome): the plain set, the suit from the chin down, the over-long red tie past the
 *  frame, his hands in front of the jacket talking (held drawings on 6s). The hands are at a real size for this framing
 *  (the review, a guardrail: at 1.15x against a jacket 60% of the screen wide a hand was about a fifth of the
 *  shoulders, the meme's picture; the character file rules out any hand-size joke). Nearer the lens than the chest,
 *  each hand is about 0.4 of the shoulders' width (the jacket a little narrower, the hands about 1.9x), the cuffs and
 *  some sleeve clear of the lower third. Talking hands at chest height, below the shoulders, never a fist */
const interview = (scr: Buf, k: number) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2;
  interviewSet(scr);
  const cx = Math.round(W / 2), sh = Math.round(W * 0.265), top = Math.round(H * 0.04);
  // (the jacket a rung under his sleeves, so the forearms read against it: the review of the art's still)
  for (let y = top; y < H; y++) { const half = Math.min(sh, Math.round(sh * 0.78 + (y - top) * 1.4)); fill(scr, cx - half, y, half * 2, 1, PAL.N0); fill(scr, cx - half, y, 1, 1, PAL.N2); fill(scr, cx + half - 1, y, 1, 1, PAL.N2); }
  const vb = Math.round(H * 0.5);
  for (let y = top; y < vb; y++) { const hw = Math.round(((vb - y) / (vb - top)) * W * 0.07); fill(scr, cx - hw, y, hw * 2, 1, PAL.P2); line(cx - hw - 1, y, cx - hw - 3 * s, y, scr.ink(PAL.N3)); line(cx + hw, y, cx + hw + 3 * s - 1, y, scr.ink(PAL.N3)); }
  tie(scr, cx, top + 2, Math.round(H * 0.9));
  // his hands: the left palm open to the lens, the right a step lower and turned, swapping on 6s (talking, never a fist)
  const up = Math.floor(k / 6) % 2, hs = 2.2 * s;
  const hl: [number, number] = [cx - Math.round(W * 0.175), Math.round(H * 0.56) - up * 4 * s], hr: [number, number] = [cx + Math.round(W * 0.175), Math.round(H * 0.545) - (1 - up) * 5 * s];
  rHand(scr, POSES.open([-0.25, -1, 0.1], [0, 0.1, -1], 'R'), hl, 'wrist', hs, [hl[0] - 18 * s, H + 46]);
  rHand(scr, POSES.open([0.3, -1, 0.2], [0.2, 0, -1], 'L'), hr, 'wrist', hs, [hr[0] + 18 * s, H + 46]);
};
/** st.k: the frame (the hands' rhythm); st.lower: 0 none, 1 the bar sliding in, 2 the bar and his words, whole;
 *  st.clear 0..3: the player's chrome clearing (1 the lower third gone, 2 the bar gone, 3 the frame's edges gone);
 *  st.empty 0..1: the figure (suit, tie, hands) dithered out of the picture, leaving the plain set (the final fix
 *  round: so the dissolve to THE PODIUM never lays his talking hands or the red tie over the podium) */
export const broadcastPainter = (st: {k: number; lower: 0 | 1 | 2; clear?: number; empty?: number}): Painter => (scr: Buf) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2, cl = st.clear ?? 0;
  interview(scr, st.k);
  if (st.empty) { const t = new Buf(W, H, PAL.N0); interviewSet(t); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (bayer(x, y) < st.empty) scr.set(x, y, t.get(x, y)); }
  // the lower third: the broadcast's own plain bar; his words whole (a broadcast puts its lower third up at once)
  const lh = s > 1 ? 30 : 14, ly = H - lh - 18;
  if (st.lower && cl < 1) {
    const bw = st.lower === 1 ? Math.round(W * 0.5) : W - 16;
    fill(scr, 8, ly, bw, lh, PAL.N0); fill(scr, 8, ly, 4, lh, PAL.P2);
    if (st.lower === 2) { if (s < 2) tiny(scr, LOWER.toUpperCase().slice(0, 30), 14, ly + 4, PAL.P2); else pwrap(LOWER, W - 40).forEach((l, i) => pt(scr, l, 18, ly + 5 + i * 10, PAL.P2)); }
  }
  // the player's own bar (no logo, no title): play, a scrubber, the speaker MUTED (why there's no voice), full screen
  if (cl < 2) {
    const by = H - 14;
    fill(scr, 0, by, W, 14, PAL.N0); fill(scr, 0, by, W, 1, PAL.N3);
    fill(scr, 8, by + 4, 2, 7, PAL.P1); fill(scr, 12, by + 4, 2, 7, PAL.P1);
    fill(scr, 24, by + 7, W - 80, 1, PAL.N4); fill(scr, 24, by + 7, Math.round((W - 80) * 0.42), 1, PAL.R2); fill(scr, 24 + Math.round((W - 80) * 0.42) - 1, by + 5, 3, 5, PAL.P2);
    const sx = W - 46, sy = by + 4;
    fill(scr, sx, sy + 2, 3, 3, PAL.P1); fill(scr, sx + 3, sy, 2, 7, PAL.P1); line(sx + 7, sy + 1, sx + 11, sy + 5, scr.ink(PAL.R2)); line(sx + 11, sy + 1, sx + 7, sy + 5, scr.ink(PAL.R2));
    fill(scr, W - 18, sy, 9, 7, PAL.N0); fill(scr, W - 18, sy, 9, 1, PAL.P1); fill(scr, W - 18, sy + 6, 9, 1, PAL.P1); fill(scr, W - 18, sy, 1, 7, PAL.P1); fill(scr, W - 10, sy, 1, 7, PAL.P1);
  }
  // the player's frame: a thin grey border round the picture (the window it plays in)
  if (cl < 3) { for (let x = 0; x < W; x++) { scr.set(x, 0, PAL.N3); scr.set(x, 1, PAL.N2); } for (let y = 0; y < H; y++) { scr.set(0, y, PAL.N3); scr.set(W - 1, y, PAL.N3); } }
};

// ================================================================== 23.07-23.08: THE PODIUM, the balloon
// Restaged in the final fix round (2026-10-10, guardrail X4: no assassination-attempt imagery in any form, no fist
// pumps). THE PODIUM is in the broadcast's own studio (its blue cyc and its soft, out-of-focus lights), not alone on
// an outdoor hill at dusk; no crowd, no flags. The camera is where he stands: we look down over the reading surface
// (the podium still faces away from us, toward an empty studio), so his hands come in from the frame's foot on
// forearms whose elbows are out of frame below it, one body's width apart: one hidden man standing at his lectern,
// never a body hidden behind it. The hands stay down on the surface the whole time (no arm raised; no fist: they pinch
// and let go). The pump is a slim party pump lying flat on the surface, its plunger a round cream knob pinched and
// pushed sideways (no upright barrel, no T-handle, no red). The hook's pull is the balloon's own: it lifts, the string
// snaps straight up out of the top of the frame, and it tugs once more; nobody is on the far side.
/** the studio round THE PODIUM (the interview's set: its blue ramp and its soft lights, cool), cached per size */
const studioCache = new Map<string, Buf>();
const studio = (W: number, H: number) => {
  const key = `${W}x${H}`; const hit = studioCache.get(key); if (hit) return hit;
  const t = new Buf(W, H, PAL.N0);
  // the cyc: the wall a ramp down to the floor's curve, the floor falling off toward the lens
  vramp(t, 0, 0, W, 70, [PAL.F1, PAL.F2, PAL.F3]);
  vramp(t, 0, 70, W, H - 70, [PAL.F3, PAL.F2, PAL.F1, PAL.N3]);
  // the key light's pool on the cyc behind the podium, a rung up (dithered)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const d = Math.hypot((x - W / 2) / 190, (y - 62) / 52); if (d < 1 && bayer(x, y) < (1 - d) * 0.8) t.set(x, y, stepColor(t.get(x, y), 1)); }
  // the studio's lights, out of focus on the wall (as in the interview's set; cool, no red)
  const BOK: Array<[number, number, number, number]> = [[34, 18, 7, PAL.F4], [92, 46, 5, PAL.F3], [140, 14, 6, PAL.F4], [372, 22, 7, PAL.F4], [430, 50, 5, PAL.F3], [458, 12, 6, PAL.F5], [64, 58, 4, PAL.F5], [404, 64, 4, PAL.F3]];
  for (const [bx, by, r, c] of BOK) { ellipse(bx, by, r, r, t.ink(c)); t.set(bx - Math.round(r / 2), by - Math.round(r / 2), stepColor(c, 1)); }
  studioCache.set(key, t);
  return t;
};
/** THE PODIUM from where he stands: the reading surface (a trapezoid, the far rim on the audience side), the near
 *  ledge, and the fluted back panel below it in his own shadow, running off the frame's foot */
const POD = {cx: 240, yF: 104, hwF: 76, yN: 176, hwN: 114};
/** the surface's colour for a row (u 0 the far rim .. 1 the near ledge): the studio's key from above and beyond, in
 *  solid bands with a narrow dither seam (no all-over mesh) */
const SURF = [PAL.W7, PAL.W6, PAL.W6, PAL.W5];
const surfAt = (x: number, y: number, u: number) => { const t = u * (SURF.length - 1), k = Math.floor(t), fr = t - k; return fr > 0.7 && bayer(x, y) < (fr - 0.7) / 0.3 ? SURF[Math.min(SURF.length - 1, k + 1)] : SURF[k]; };
const podiumTop = (b: Buf) => {
  const {cx, yF, yN, hwF, hwN} = POD;
  // the back panel (his side), plain fluted gold in his own shadow, running off the frame's foot
  // (gold a rung down, never a deep red: W4 with W3 flute shadows and a W5 lit edge, W3 lower down)
  for (let y = yN; y < b.h; y++) { const hw = hwN - 3; for (let x = cx - hw; x < cx + hw; x++) { const i = (x - (cx - hw)) % 12; b.set(x, y, i === 0 ? PAL.W3 : i === 1 ? PAL.W5 : y > yN + 16 ? (bayer(x, y) < 0.5 ? PAL.W3 : PAL.W4) : PAL.W4); } }
  // the reading surface, sloping down toward him
  for (let y = yF; y < yN; y++) {
    const u = (y - yF) / (yN - yF), hw = Math.round(hwF + (hwN - hwF) * u);
    for (let x = cx - hw; x < cx + hw; x++) { const e = Math.min(x - (cx - hw), cx + hw - 1 - x); b.set(x, y, e < 2 ? PAL.W4 : e < 3 ? PAL.W8 : surfAt(x, y, u)); }
  }
  // the far rim (the front's top edge, the audience side): a raised lip, its inner face toward him, its top line hot
  fill(b, cx - hwF - 3, yF - 5, 2 * hwF + 6, 5, PAL.W6); fill(b, cx - hwF - 3, yF - 5, 2 * hwF + 6, 1, PAL.W8); fill(b, cx - hwF - 3, yF - 1, 2 * hwF + 6, 1, PAL.W4);
  // the near ledge (the paper stop) along the near edge
  fill(b, cx - hwN - 3, yN - 3, 2 * hwN + 6, 3, PAL.W7); fill(b, cx - hwN - 3, yN - 3, 2 * hwN + 6, 1, PAL.W8); fill(b, cx - hwN - 3, yN, 2 * hwN + 6, 2, PAL.W4); fill(b, cx - hwN - 3, yN + 2, 2 * hwN + 6, 1, PAL.W1);
};
/** its two gooseneck mics on the far rim, bending toward him */
const podiumMics = (b: Buf) => {
  const {cx, yF} = POD;
  for (const sx of [-1, 1]) {
    const bx = cx + sx * 8, by = yF - 4;
    fill(b, bx - 3, by - 1, 7, 2, PAL.N1);
    line(bx, by - 1, bx + sx * 1, by - 14, b.ink(PAL.N1)); line(bx + sx * 1, by - 14, bx + sx * 4, by - 21, b.ink(PAL.N1));
    line(bx + 1, by - 1, bx + sx * 1 + 1, by - 14, b.ink(PAL.N3));
    ellipse(bx + sx * 5, by - 24, 3, 4, b.ink(PAL.N2)); b.set(bx + sx * 5 - 1, by - 26, PAL.N5);
  }
};
/** the pump, lying flat on the surface: a chunky toy party pump (green plastic, a blunt cream cone nozzle to the
 *  right; its rod and round cream ball knob to the left; `inn` 0 pulled out .. 1 pushed in); `dy` slides it in from
 *  his side. Thick and bright so it reads as a toy, never a syringe or anything with a plunger on top */
const PUMP = {x0: 180, x1: 234, y: 150, r: 6};
const pumpFlat = (b: Buf, inn: number, dy = 0) => {
  const {x0, x1, r} = PUMP, y = PUMP.y + dy;
  fill(b, x0 - 2, y + r + 1, x1 - x0 + 10, 2, PAL.W4);
  const BAR = [PAL.L0, PAL.L3, PAL.L3, PAL.L2, PAL.L2, PAL.L2, PAL.L2, PAL.L2, PAL.L1, PAL.L1, PAL.L1, PAL.L1, PAL.L0];
  for (let x = x0; x < x1; x++) for (let j = -r; j <= r; j++) b.set(x, y + j, x === x0 || x === x1 - 1 ? PAL.L0 : BAR[j + r]);
  // two moulded rings on the barrel, and its cream end caps
  for (const rx of [x0 + 2, x1 - 4]) for (let j = -r; j <= r; j++) { b.set(rx, y + j, j === -r || j === r ? PAL.L0 : PAL.P1); b.set(rx + 1, y + j, j === -r || j === r ? PAL.L0 : PAL.P0); }
  // the blunt cone nozzle (cream), short and round-ended
  for (let i = 0; i < 7; i++) { const hr = Math.max(2, r - 1 - i); for (let j = -hr; j <= hr; j++) b.set(x1 + i, y + j, j === -hr || j === hr ? PAL.P0 : j < 0 ? PAL.P2 : PAL.P1); }
  const kx = x0 - 3 - Math.round((1 - inn) * 14);
  fill(b, kx, y - 1, x0 - kx, 3, PAL.G4); fill(b, kx, y - 1, x0 - kx, 1, PAL.G6);
  ellipse(kx - 5, y, 6, 6, b.ink(PAL.P0)); ellipse(kx - 5, y - 1, 5, 5, b.ink(PAL.P1)); fill(b, kx - 7, y - 4, 2, 2, PAL.P2);
  return {knob: [kx - 5, y] as [number, number], tip: [x1 + 7, y] as [number, number]};
};
/** a hand from his side of the podium: placed (hands2, at a real size for the surface), the forearm running from its
 *  cuff down and out through the frame's foot toward an elbow well below it */
const HS = 3.4;
const podHand = (b: Buf, pose: HandPose, at: [number, number], anchor: 'index' | 'middle' | 'thumb' | 'wrist', out: number) => {
  const h = placeHand(pose, {s: HS, at, anchor, light: 'lobby', cuffRamp: CUFF_W, key: [-0.2, -0.85, 0.5]});
  const [cx, cy] = h.cuffEnd, bx = out, by = 1, bl = Math.hypot(bx, by);
  forearm(b, [cx, cy], [cx + (bx / bl) * 220, cy + (by / bl) * 220], 3.3 * HS, 8.4 * HS, SLEEVE_N, [-0.3, -0.95]);
  drawHand(b, h.hand, h.x, h.y);
  return h;
};
/** the chatbot balloon placed by the tip of its tail (where the string or the nozzle is) */
const balloonByTail = (b: Buf, tx: number, ty: number, size: 1 | 2 | 3 | 4, scale: number, o: {string?: [number, number]; taut?: boolean} = {}) => {
  const w = Math.round([10, 16, 22, 28][size - 1] * scale), h = Math.round(w * 0.78);
  const x0 = tx + 1, y0 = ty - h - Math.round(h * 0.3);
  drawChatBalloon(b, x0 + (w >> 1), y0 + (h >> 1), size, {scale, ...o});
};
/** the knot on the near ledge, left of centre (where a string is tied off, at his hands' height) */
const KNOT: [number, number] = [214, 174];
const knotAt = (b: Buf) => { fill(b, KNOT[0] - 1, KNOT[1] - 1, 3, 3, PAL.G6); b.set(KNOT[0] + 2, KNOT[1] + 1, PAL.G5); b.set(KNOT[0] - 2, KNOT[1] + 2, PAL.G5); };
/** the balloon afloat above the far rim, right of the mics (its tail's tip), and its scale there */
const FLOAT: [number, number] = [272, 100], FS = 2.6;
/**
 * st.phase: 'limp' (the hands slide the pump and the limp balloon onto the surface from his side; st.lift 2..0) ·
 * 'pump' (st.size 2..4 the balloon after each stroke, st.down the knob pushed in) · 'tie' (both hands at the near
 * ledge pinching the string into its knot; st.knot pulled tight) · 'tied' (st.away 0..1 the hands sliding back down
 * out of the frame's foot, 2+ gone; the balloon afloat above the far rim on its slack string, bobbing on 6s) · 'taut' (the
 * balloon lifts: st.taut 1 the jerk up, the string snapped straight; 2 settled, the balloon at the frame's top edge,
 * its dot eyes just under it, the string straight up to it from the knot; 3 a beat later one more tug, a step
 * higher). st.f: the frame (the bob)
 */
export interface PodiumSt { phase: 'limp' | 'pump' | 'tie' | 'tied' | 'taut'; size?: number; down?: boolean; knot?: boolean; away?: number; f?: number; lift?: number; taut?: 1 | 2 | 3 }
export const podiumPainter = (st: PodiumSt): Painter => (scr: Buf) => {
  scr.c.set(studio(scr.w, scr.h).c);
  podiumTop(scr);
  podiumMics(scr);
  const f = st.f ?? 0;
  if (st.phase === 'limp' || st.phase === 'pump') {
    // left hand: a pinch on the pump's knob, pushing it in sideways on each stroke; right hand: a pinch on the
    // balloon's neck at the nozzle. Both down on the surface, the forearms out through the frame's foot
    const dy = (st.lift ?? 0) * 12, P = pumpFlat(scr, st.phase === 'pump' && st.down ? 1 : 0, dy);
    const size = clamp(st.phase === 'limp' ? 1 : st.size ?? 2, 1, 4) as 1 | 2 | 3 | 4;
    balloonByTail(scr, P.tip[0] + 1, P.tip[1] - 2, size, 3.0);
    podHand(scr, POSES.pinch([0.6, -0.7, -0.35], [-0.1, -0.45, 0.88], 'L'), [P.knob[0] - 2, P.knob[1]], 'index', -0.55);
    podHand(scr, POSES.pinch([-0.55, -0.75, -0.35], [0.1, -0.45, 0.88], 'R'), [P.tip[0] + 3, P.tip[1] + 1], 'index', 0.5);
    return;
  }
  pumpFlat(scr, 1);
  const bob = [0, -1, -1, 0, 1, 1][Math.floor(f / 6) % 6] * 2;
  if (st.phase === 'tie' || st.phase === 'tied') {
    balloonByTail(scr, FLOAT[0], FLOAT[1] + bob, 4, FS, {string: KNOT});
    if (st.phase === 'tie' || st.knot) knotAt(scr);
    if (st.phase === 'tie') {
      const pull = st.knot ? 3 : 0;
      podHand(scr, POSES.pinch([0.55, -0.75, -0.35], [-0.1, -0.45, 0.88], 'L'), [KNOT[0] - 4 - pull, KNOT[1]], 'index', -0.45);
      podHand(scr, POSES.pinch([-0.55, -0.75, -0.35], [0.1, -0.45, 0.88], 'R'), [KNOT[0] + 5 + pull, KNOT[1] + 1], 'index', 0.45);
    } else if ((st.away ?? 3) < 2) {
      // let go: the hands as they left the knot, sliding back toward him and out through the frame's foot (one held
      // step, then gone)
      const d = (st.away ?? 0) * 14;
      podHand(scr, POSES.pinch([0.55, -0.75, -0.35], [-0.1, -0.45, 0.88], 'L'), [KNOT[0] - 8, KNOT[1] + 2 + d], 'index', -0.45);
      podHand(scr, POSES.pinch([-0.55, -0.75, -0.35], [0.1, -0.45, 0.88], 'R'), [KNOT[0] + 9, KNOT[1] + 3 + d], 'index', 0.45);
    }
    return;
  }
  // taut: the balloon has lifted; the string a straight line from the knot up to its tail
  knotAt(scr);
  // (the tail's tip: the jerk overshoots, the balloon settles back with its eyes clear under the top edge, and the tug
  // takes it a step higher, the eyes half over the edge)
  const tail: [number, number] = st.taut === 1 ? [FLOAT[0] + 4, FLOAT[1] - 46] : st.taut === 3 ? [FLOAT[0] + 8, FLOAT[1] - 52] : [FLOAT[0] + 6, FLOAT[1] - 38];
  balloonByTail(scr, tail[0], tail[1], 4, FS);
  const ax = tail[0] + 1 + Math.round(28 * FS * 0.1), ay = tail[1];
  line(KNOT[0], KNOT[1], ax, ay, scr.ink(PAL.G6)); line(KNOT[0] + 1, KNOT[1], ax + 1, ay, scr.ink(PAL.G4));
  // the jerk: the string still quivering a pixel off its line
  if (st.taut === 1) for (let t = 0.2; t < 0.9; t += 0.2) scr.set(Math.round(KNOT[0] + (ax - KNOT[0]) * t) - 1, Math.round(KNOT[1] + (ay - KNOT[1]) * t), PAL.G5);
};
void stepColor; void tinyWidth;
