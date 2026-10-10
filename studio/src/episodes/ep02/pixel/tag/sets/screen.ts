// MR. MAS — Ep2 v1 · tag: WHAT IS ON HIS MONITOR in sc 23 (AUG 5 → AUG 21, 2024). The tag's picture pass, 2026-10-10.
// Monitor painters `(scr, f) => void` for Ep1's kits/mas-monitor (drawMonitorPOV full-bleed, or the tag's OTS), built on
// the art pass's SET-08 (art/sets/tag.ts: the rally post, the broadcast, THE PODIUM, RUMPT's hands; art/creatures.ts
// drawChatBalloon, drawEggTab), COPIED where a shot needs more than the still (the art file is never edited):
//   feedPainter(st)        23.03: HTURT's plain feed (no real platform's name or marks); RUMPT's post arrives in ONE
//                          FRAME, whole (his text never types): `…and she 'A.I.'d' it…`, its photo (a rally crowd under
//                          SIRRAH's plate, a SUMMER 2024 decal); the egg on a bill in a background tab (Ep3's)
//   photoFaces(w, h)       the crowd's faces in that photo (screen px), for the Orb's TERMINAL scan (23.04)
//   broadcastPainter(st)   23.06-23.07: the Aug 21 interview in a PLAIN player (no network, no logo): hands and tie only,
//                          no face, no voice (the player's speaker muted); its own lower third, whole, "…having me
//                          speak… It's a little bit dangerous out there." (his real words, the faithful crop); the
//                          player's chrome (its bar, the lower third, the frame) clearing in held steps (st.clear)
//   podiumPainter(st)      23.07-23.08: THE PODIUM on its hill at dusk, still facing away; his hands from below the frame
//                          (forearms foreshortened toward the lens, white cuffs, navy sleeves) pump up a balloon in
//                          CHATGTP's bubble shape (dot eyes, no words, no sticker) on a hand pump, tie it to the
//                          podium's corner, and go; the balloon on a slack string; then the string TAUT over the far edge
// The candidate is hands and tie only (guardrails; art.md §4): no face, no voice, no fist pumps.
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
  pt(scr, POST_TEXT, g.x + 26, g.y + 28, PAL.P1);
  drawCrowd(scr, g.ph);
  for (const [fx, fy, hr] of st.ticks ?? []) { for (let i = 0; i < 3; i++) scr.set(fx - 1 + i, fy - hr - 4 + (i === 1 ? 1 : 0), PAL.C8); scr.set(fx + 2, fy - hr - 5, PAL.C8); }
};

// ================================================================== 23.06-23.07: the broadcast (Aug 21)
const LOWER = '…having me speak… It\'s a little bit dangerous out there.';
const tie = (b: Buf, x: number, y: number, len: number) => { poly([x - 4, y, x + 4, y, x + 3, y + 6, x + 6, y + len, x, y + len + 6, x - 6, y + len, x - 3, y + 6], b.ink(PAL.R2)); line(x + 2, y + 6, x + 4, y + len, b.ink(PAL.R1)); fill(b, x - 4, y, 8, 4, PAL.R1); };
/** the interview's picture (no chrome): a plain set (no network, no logo), the suit from the chin down, the over-long red
 *  tie past the frame, his hands up in front of the jacket talking (held drawings on 6s) */
const interview = (scr: Buf, k: number) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2;
  vramp(scr, 0, 0, W, H, [PAL.F1, PAL.F2, PAL.F3]);
  for (let i = 0; i < 14; i++) { const bx = (i * 67) % W, by = 10 + (i * 41) % Math.round(H * 0.5); ellipse(bx, by, 3 * s, 3 * s, scr.ink(i % 3 ? PAL.F3 : PAL.W4)); }
  const cx = Math.round(W / 2), sh = Math.round(W * 0.3), top = Math.round(H * 0.04);
  // (the jacket a rung under his sleeves, so the forearms read against it: the review of the art's still)
  for (let y = top; y < H; y++) { const half = Math.min(sh, Math.round(sh * 0.78 + (y - top) * 1.4)); fill(scr, cx - half, y, half * 2, 1, PAL.N0); fill(scr, cx - half, y, 1, 1, PAL.N2); fill(scr, cx + half - 1, y, 1, 1, PAL.N2); }
  const vb = Math.round(H * 0.5);
  for (let y = top; y < vb; y++) { const hw = Math.round(((vb - y) / (vb - top)) * W * 0.07); fill(scr, cx - hw, y, hw * 2, 1, PAL.P2); line(cx - hw - 1, y, cx - hw - 3 * s, y, scr.ink(PAL.N3)); line(cx + hw, y, cx + hw + 3 * s - 1, y, scr.ink(PAL.N3)); }
  tie(scr, cx, top + 2, Math.round(H * 0.9));
  // his hands: the left palm open to the lens, the right a step lower and turned, swapping on 6s (talking, never a fist)
  const up = Math.floor(k / 6) % 2, hs = 1.15 * s;
  const hl: [number, number] = [cx - Math.round(W * 0.16), Math.round(H * 0.62) - up * 4 * s], hr: [number, number] = [cx + Math.round(W * 0.16), Math.round(H * 0.6) - (1 - up) * 5 * s];
  rHand(scr, POSES.open([-0.25, -1, 0.1], [0, 0.1, -1], 'R'), [hl[0], hl[1] + 10 * s], 'wrist', hs, [hl[0] - 16 * s, H + 30]);
  rHand(scr, POSES.open([0.3, -1, 0.2], [0.2, 0, -1], 'L'), [hr[0], hr[1] + 10 * s], 'wrist', hs, [hr[0] + 16 * s, H + 30]);
};
/** st.k: the frame (the hands' rhythm); st.lower: 0 none, 1 the bar sliding in, 2 the bar and his words, whole;
 *  st.clear 0..4: the player's chrome clearing (1 the lower third gone, 2 the bar gone, 3 the frame's edges gone, 4 the
 *  picture itself dissolving out (a held dither) to what is outside the broadcast) */
export const broadcastPainter = (st: {k: number; lower: 0 | 1 | 2; clear?: number}): Painter => (scr: Buf) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2, cl = st.clear ?? 0;
  interview(scr, st.k);
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
/** THE PODIUM from behind (it faces away: the art's podiumBack, Ep1's roll-call podium, plain fluted gold) */
const podiumBack = (b: Buf, x: number, y: number, w: number, h: number) => {
  const x0 = x - (w >> 1);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const u = i / w; let c = u < 0.05 ? PAL.W5 : u < 0.8 ? (bayer(x0 + i, y + j) < 0.3 ? PAL.W2 : PAL.W3) : PAL.W4; if (u >= 0.8 && (i - Math.round(w * 0.8)) % 5 === 0) c = PAL.W2; b.set(x0 + i, y + j, c); }
  fill(b, x0 - 3, y - 5, w + 6, 6, PAL.W6); fill(b, x0 - 3, y - 5, w + 6, 1, PAL.W8); fill(b, x0 - 3, y, w + 6, 1, PAL.W1);
  fill(b, x0 + 6, y + 6, w - 12, Math.round(h * 0.18), PAL.W1); fill(b, x0 + 6, y + 6, w - 12, 1, PAL.N1);
  line(x - 4, y - 5, x - 7, y - 18, b.ink(PAL.N1)); line(x + 4, y - 5, x + 7, y - 18, b.ink(PAL.N1)); fill(b, x - 9, y - 21, 4, 4, PAL.N1); fill(b, x + 5, y - 21, 4, 4, PAL.N1);
};
/** the dusk hill behind the podium (the art's), cached per screen size; the ridge a little lower than the art's so the
 *  balloon has sky to float in */
const hillCache = new Map<string, Buf>();
const hill = (W: number, H: number) => {
  const key = `${W}x${H}`; const hit = hillCache.get(key); if (hit) return hit;
  const t = new Buf(W, H, PAL.N0);
  vramp(t, 0, 0, W, H, [PAL.U1, PAL.U2, PAL.U3, PAL.U4]);
  const ridge = Math.round(H * 0.66);
  for (let x = 0; x < W; x++) { const y = ridge + Math.round(Math.sin(x / 37) * 4 + Math.sin(x / 13) * 2); for (let yy = y; yy < H; yy++) t.set(x, yy, yy < y + 2 ? PAL.U1 : PAL.N1); }
  hillCache.set(key, t);
  return t;
};
/**
 * st.phase: 'limp' (the hands bring the pump and the limp balloon up onto the podium; st.lift 2..0 rising into place) ·
 * 'pump' (st.size 2..4 the balloon after each stroke, st.down the handle pushed down) · 'tie' (both hands at the
 * podium's near corner post, below its lip, the string's knot; st.knot pulled) · 'tied' (st.away 0..3 the hands going
 * down out of frame; the balloon floating up and to the right on its slack string, bobbing on 6s) · 'taut' (st.taut 1
 * the jerk, 2 settled: the string snapped straight from the knot up over the podium's lip toward its far side, the
 * balloon pulled down behind the podium so only its top and its dot eyes show over the gold, as if someone on the far
 * side had just taken hold of it). st.f: the frame (the bob)
 */
export interface PodiumSt { phase: 'limp' | 'pump' | 'tie' | 'tied' | 'taut'; size?: number; down?: boolean; knot?: boolean; away?: number; f?: number; lift?: number; taut?: 1 | 2 }
export const podiumPainter = (st: PodiumSt): Painter => (scr: Buf) => {
  const W = scr.w, H = scr.h, s = W < 200 ? 1 : 2;
  scr.c.set(hill(W, H).c);
  const px = Math.round(W / 2), pwid = Math.round(W * 0.42), py = Math.round(H * 0.6);
  podiumBack(scr, px, py, pwid, H - py);
  const f = st.f ?? 0, BS = s * 1.2;
  const x0 = px - (pwid >> 1);
  /** the knot: on the podium's near-left corner, a little below its lip (where a string is tied off) */
  const knotAt: [number, number] = [x0 + 3, py + 8 * s];
  const size = clamp(st.size ?? 1, 1, 4) as 1 | 2 | 3 | 4;
  const LEFT_EL: [number, number] = [px - Math.round(pwid * 0.62), H + 40], RIGHT_EL: [number, number] = [px + Math.round(pwid * 0.7), H + 40], MID_EL: [number, number] = [px + Math.round(pwid * 0.18), H + 40];
  // the pump, stood on the reading top at the right (it stays there once they're done with it)
  const pumpX = px + Math.round(pwid * 0.3);
  const pump = (lift: number, down: boolean) => {
    const base = py - 5 + lift * 8 * s, barrelTop = base - 20 * s, handleY = barrelTop - (down ? 2 * s : 9 * s);
    fill(scr, pumpX - 3 * s, barrelTop, 6 * s, base - barrelTop, PAL.R1); fill(scr, pumpX - 3 * s, barrelTop, 2 * s, base - barrelTop, PAL.R2); fill(scr, pumpX - 5 * s, base - 2, 10 * s, 2, PAL.N1);
    fill(scr, pumpX - 1, handleY, 2, barrelTop - handleY, PAL.G5); fill(scr, pumpX - 8 * s, handleY - 2 * s, 16 * s, 3 * s, PAL.G4); fill(scr, pumpX - 8 * s, handleY - 2 * s, 16 * s, 1, PAL.G6);
    return {base, handleY};
  };
  const knot = () => { fill(scr, knotAt[0] - 1, knotAt[1] - 1, 3, 3, PAL.G6); scr.set(knotAt[0] + 2, knotAt[1] + 1, PAL.G5); scr.set(knotAt[0] - 2, knotAt[1] + 2, PAL.G5); };
  if (st.phase === 'limp' || st.phase === 'pump') {
    // the hose from the pump's foot over the reading top to the balloon's neck, in his left hand at the near corner;
    // the balloon over the neck, growing a size each stroke; his right hand round the pump's T-handle
    const lift = st.lift ?? 0, P = pump(lift, !!st.down);
    const neck: [number, number] = [x0 + 12 * s, py - 12 * s + lift * 8 * s];
    for (let t = 0; t <= 40; t++) { const u = t / 40; scr.set(Math.round(pumpX - 3 * s + (neck[0] + 2 - (pumpX - 3 * s)) * u), Math.round(P.base - 3 + (neck[1] + 4 - (P.base - 3)) * u - Math.sin(u * Math.PI) * 6 * s), PAL.N2); }
    if (st.phase === 'limp') drawChatBalloon(scr, neck[0] + 5 * s, neck[1] + 1 * s, 1, {scale: BS});
    else { const bw = Math.round([10, 16, 22, 28][size - 1] * BS), bh = Math.round(bw * 0.78); drawChatBalloon(scr, neck[0] + (bw >> 1) - 2, neck[1] - (bh >> 1) - Math.round(bh * 0.3) - 2, size, {scale: BS, string: [neck[0], neck[1]]}); }
    rHand(scr, POSES.grip([0.05, -0.55, -0.83], [0.1, -0.83, 0.55], 'R', 0.7), [pumpX + 2 * s, P.handleY + 1], 'middle', 1.15 * s, RIGHT_EL);
    rHand(scr, POSES.pinch([0.35, -0.75, -0.5], [0.15, -0.55, 0.8], 'L'), [neck[0], neck[1]], 'index', 1.15 * s, LEFT_EL);
    return;
  }
  if (st.phase === 'tie' || st.phase === 'tied') {
    pump(0, false);
    // tied: the balloon floats up and to the right of the knot on a slack string (a gentle curve), bobbing on 6s
    const bob = [0, -1, -1, 0, 1, 1][Math.floor(f / 6) % 6] * s;
    const bw = Math.round(28 * BS), bh = Math.round(bw * 0.78);
    drawChatBalloon(scr, knotAt[0] + 20 * s + (bw >> 1), py - bh - 10 * s + bob, 4, {scale: BS, string: [knotAt[0], knotAt[1]]});
    if (st.phase === 'tie' || st.knot) knot();
    if (st.phase === 'tie') {
      // both hands at the corner post pinching the string into its knot (pulled tight on the knot's frame)
      const pull = st.knot ? 3 * s : 0;
      rHand(scr, POSES.pinch([0.45, -0.7, -0.5], [0.2, -0.5, 0.85], 'L'), [knotAt[0] - 3 * s - pull, knotAt[1]], 'index', 1.15 * s, LEFT_EL);
      rHand(scr, POSES.pinch([-0.45, -0.7, -0.5], [-0.2, -0.5, 0.85], 'R'), [knotAt[0] + 7 * s + pull, knotAt[1] + 1], 'index', 1.15 * s, MID_EL);
    } else if ((st.away ?? 3) < 3) {
      // the hands going down out of frame in held steps, open (let go)
      const d = (st.away ?? 0) * 26 * s;
      rHand(scr, POSES.open([0.3, -0.9, -0.3], [0.2, -0.4, 0.9], 'L'), [knotAt[0] - 6 * s, knotAt[1] + 8 * s + d], 'index', 1.15 * s, LEFT_EL);
      rHand(scr, POSES.open([-0.3, -0.9, -0.3], [-0.2, -0.4, 0.9], 'R'), [knotAt[0] + 12 * s, knotAt[1] + 8 * s + d], 'index', 1.15 * s, MID_EL);
    }
    return;
  }
  // taut: the string a straight line from the knot up over the lip (where it vanishes toward the far side), the
  // balloon pulled down behind the podium, its top and its eyes over the gold; on the jerk (taut 1) a step higher
  knot();
  const over: [number, number] = [px - Math.round(pwid * 0.05), py - 5];
  const bw = Math.round(28 * BS), bh = Math.round(bw * 0.78), cy = py - 5 - Math.round(bh * (st.taut === 1 ? 0.62 : 0.4));
  const t = new Buf(W, H, 0x1000000);
  drawChatBalloon(t, over[0] + Math.round(bw * 0.3), cy, 4, {scale: BS});
  for (let y = 0; y < py - 5; y++) for (let x = 0; x < W; x++) { const v = t.c[y * W + x]; if (v !== 0x1000000) scr.set(x, y, v); }
  // (the balloon is beyond the podium: the pump on its top stands in front of it)
  pump(0, false);
  // the string: two pixels wide where it crosses the gold so it reads against it, catching the light on the lip
  line(knotAt[0], knotAt[1], over[0], over[1], scr.ink(PAL.G6)); line(knotAt[0] + 1, knotAt[1], over[0] + 1, over[1], scr.ink(PAL.G4));
  fill(scr, over[0] - 1, over[1] - 1, 3, 2, PAL.P2);
};
void stepColor; void tinyWidth;
