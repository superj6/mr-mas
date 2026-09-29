// MR. MAS — Ep1 Act One art, v3.5 (the `p-act1` picture pass, 2026-09-28; new, additive, namespaced to Act One). The
// new places and inserts of proposal-v35's Act One, drawn on the show's master palette at native 480 x 270, whole
// pixels, held drawings. Nothing here edits a shared module: the rooms, rigs and kits are composed from their exports.
//
//   phoneBody / strangerHand / phoneChat      the first weeks (sc 10): strangers' phones and laptops, hands only, the
//                                              prompts legible, the answers a pour (guardrails: prompts only, no faces,
//                                              no names)
//   montage10(b, f, id, k)                     the eight inserts of sc 10 (10.01 .. 10.08) and his phone lighting up
//   feedPost                                   a generic post card (the first weeks' Nole card; 3 AM's stranger; Atem)
//   ots3am / mcu3am / counterECU               3 AM (sc 12): the at-capacity page, the stranger's post, his face, the
//                                              corner counter that becomes 2018's
//   renderFront(b, from, to, x, dir)           the intro's glowing seam re-drawing the frame behind it (progressive)
//   office2018 / office2S / alyiMcu2018 /      JUN 2018 (sc 13): NopeAI's first office at night in the T3 memory tier
//   loneDesk                                   (cut-paper: flat shapes, one-rung drop shadows, paper grain), the ATOD
//                                              arena on the monitor wall in its own game medium, INVIDIA on the racks
//   arena(b, x, y, w, h, f, seed)              ATOD: bots playing bots, top-down, a match per screen
//   glassInHand                                his water glass, carried out of 2018 into January's lobby
//   windowGlass / windowWide / window2S /      the window (sc 18): the users line in Gerg's marker, the clipping, the
//   windowLamp                                 paid plan in Rima's red, the four of them at dusk; Mas alone after
//   editorPOV / editorPage                     the vision post (sc 19): his laptop at night, the editor, Publish, his feed
//   waitlistTV                                 Elgoog's waitlist (sc 22): DRAB behind a velvet rope on the wall TV
//   filedECU / filedPapers                     the pause letter's two hands (sc 23): PAUSE signed, ZAI CORP. stamped FILED
//   gnibChyron                                 the lobby TV's chyron, THE NEW GNIB · POWERED BY NOPEAI (sc 15)
//   paneBar / paneUsersLine / paneAlyi         GTP-4's left pane (sc 21): the bar-exam card, the users line jumping,
//                                              Alyi's reflection leaning in
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf, FAMILIES} from '../../../../../shared/pixel/palette';
import {text, textWidth, bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {blitImg} from '../../../../../shared/pixel/figure';
import {pt, pw, pwrap, bpt, bpw} from '../../kit';
import {tiny, tinyWidth} from '../../../../../shared/pixel/rooms/kit-b';
import {drawChatBubble} from '../../../../../shared/pixel/cast/chatgtp';
import {drawOdometer, odometerSize} from '../../../../../shared/pixel/kits/odometer';
import {launchBackM, putBust, otsShoulder, drawCursor, deskLampM, LAUNCH_M} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {alyiSpeakPortrait, ALYI_SPEAK_DEFAULT, drawAlyiStand, ALYI_STAND_DEFAULT, alyiStand} from '../../../../../shared/pixel/cast/alyi-speak';
import type {AlyiSpeakState} from '../../../../../shared/pixel/cast/alyi-speak';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';
import type {MasStandPose} from '../../../../../shared/pixel/cast/mas-stand';
import {drawGergStand, GERG_STAND_DEFAULT} from '../../../../../shared/pixel/cast/gerg-stand';
import {drawGergPose} from '../../../../../shared/pixel/cast/gerg-poses';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../../../../../shared/pixel/cast/rima-stand';
import type {RimaStandPose} from '../../../../../shared/pixel/cast/rima-stand';
import {rimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/rima-speak';
import type {RimaPortraitState} from '../../../../../shared/pixel/cast/rima-speak';
import {drawCollarsPortrait} from '../../../../../shared/pixel/cast/mas-collars';
import {drawMasMedium, MAS_MEDIUM_DEFAULT, MAS_M_DESK} from '../../../../../shared/pixel/cast/mas-medium';
import type {MasMediumState} from '../../../../../shared/pixel/cast/mas-medium';
import {drawGergTable, GERG_DEFAULT, gergTypeAt} from '../../../../../shared/pixel/cast/gerg';
import {faceKey} from '../../../../../shared/pixel/kits/face-light';
import {drawAlertInsert} from '../../../../../shared/pixel/kits/phone-alert';
import {drawGergLaptopPOV, GERG_LAPTOP} from '../../../../../shared/pixel/kits/gerg-laptop';
import {LOBBY} from '../../../../../shared/pixel/rooms/lobby';

const RH = 203;
const TR = 0x1000000;
type Rect = {x: number; y: number; w: number; h: number};
/** copy a buffer drawn at its own origin into b at (x, y), clipped to the room area; TR pixels are skipped */
const put = (b: Buf, t: Buf, x: number, y: number) => {
  for (let j = 0; j < t.h; j++) { const Y = y + j; if (Y < 0 || Y >= RH) continue; for (let i = 0; i < t.w; i++) { const X = x + i; if (X < 0 || X >= 480) continue; const v = t.c[j * t.w + i]; if (v !== TR) b.c[Y * b.w + X] = v; } }
};
/** double a buffer's pixels into b (a screen's own pixels, seen close: the one thing the show scales) */
const put2x = (b: Buf, t: Buf, x: number, y: number) => {
  for (let j = 0; j < t.h * 2; j++) { const Y = y + j; if (Y < 0 || Y >= RH) continue; for (let i = 0; i < t.w * 2; i++) { const X = x + i; if (X < 0 || X >= 480) continue; const v = t.c[(j >> 1) * t.w + (i >> 1)]; if (v !== TR) b.c[Y * b.w + X] = v; } }
};
/** text with the multiplication sign (the pixel fonts have none): a 5 x 5 cross in its place */
export const ptx = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const part of s.split('×')) {
    if (cx !== x) { for (let i = 0; i < 5; i++) { b.set(cx + i, y + 1 + i, col); b.set(cx + 4 - i, y + 1 + i, col); } cx += 7; }
    pt(b, part, cx, y, col); cx += pw(part) + (part.endsWith(' ') ? 0 : 1);
  }
};
const bptx = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const part of s.split('×')) {
    if (cx !== x) { for (let i = 0; i < 9; i++) { rect(cx + i, y + 2 + i, 2, 2, b.ink(col)); rect(cx + 8 - i, y + 2 + i, 2, 2, b.ink(col)); } cx += 14; }
    bpt(b, part, cx, y, col); cx += bpw(part) + 2;
  }
};

/** a word in the pixel font's caps at 2x (the display face's D reads as an O at this size) */
const pt2 = (b: Buf, s: string, x: number, y: number, col: number) => {
  const t = new Buf(pw(s) + 2, 10, TR); pt(t, s, 0, 0, col);
  for (let j = 0; j < 10; j++) for (let i = 0; i < t.w; i++) if (t.c[j * t.w + i] !== TR) rect(x + i * 2, y + j * 2, 2, 2, b.ink(col));
};
// ================================================================== skin, hands and phones (the first weeks)
export type Tone = 0 | 1 | 2;
/** three strangers' skin ramps [edge, shadow, mid, light, highlight] (hands only, never a face) */
export const SKIN: Record<Tone, number[]> = {0: [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6], 1: [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5], 2: [PAL.D1, PAL.D2, PAL.B3, PAL.B4, PAL.S3]};
/** a phone's body: a rounded dark slab, 1 px keyline, its rim in `edge`; returns the screen's rect */
export const phoneBody = (b: Buf, x: number, y: number, w: number, h: number, edge = PAL.G3): Rect => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const cx = Math.min(i, w - 1 - i), cy = Math.min(j, h - 1 - j);
    if (cx < 5 && cy < 5 && Math.hypot(5 - cx, 5 - cy) > 5.2) continue;
    const Y = y + j; if (Y < 0 || Y >= RH) continue;
    b.set(x + i, Y, cx === 0 || cy === 0 ? PAL.N0 : cx === 1 || cy === 1 ? edge : PAL.N1);
  }
  return {x: x + 6, y: y + 10, w: w - 12, h: h - 20};
};
/** a stranger's hand holding a phone upright (x, y, w, h: the phone): the thumb up its left edge from below, four
 *  fingertips round its right edge; the palm is below the frame */
export const strangerHand = (b: Buf, x: number, y: number, w: number, h: number, tone: Tone) => {
  const R = SKIN[tone];
  // four fingertips curled round the right edge, each a rounded pad with a crease, the last one shorter
  for (let q = 0; q < 4; q++) {
    const fy = y + Math.round(h * 0.38) + q * 15, fx = x + w - 5, fw = q === 3 ? 9 : 11;
    for (let j = 0; j < 13; j++) for (let i = 0; i < fw; i++) {
      const d = Math.hypot((i - fw / 2 + 0.5) / (fw / 2), (j - 6) / 6.5); if (d >= 1) continue;
      const Y = fy + j; if (Y >= RH) continue;
      b.set(fx + i, Y, i >= fw - 2 ? R[0] : j < 3 ? R[3] : i < 2 ? R[1] : R[2]);
    }
    if (fy + 12 < RH) for (let i = 2; i < fw - 1; i++) b.set(fx + i, fy + 12, R[0]);
  }
  // the thumb up the left edge from the heel of the hand (a broad pad, the nail at its tip), the palm's heel below
  const ty0 = y + Math.round(h * 0.5);
  for (let yy = ty0; yy < RH; yy++) {
    const t = (yy - ty0) / Math.max(1, RH - ty0), hw = 8 + Math.round(t * 12), cx = x + 4 - Math.round(t * 22);
    for (let xx = cx - hw; xx <= cx + hw; xx++) {
      if (yy < ty0 + 9 && Math.hypot((xx - cx) / hw, (yy - ty0 - 9) / 9) > 1) continue;
      b.set(xx, yy, xx <= cx - hw + 1 ? R[0] : xx > cx + hw - 3 ? R[3] : xx < cx - hw + 5 ? R[1] : R[2]);
    }
    if (yy >= ty0 + 2 && yy < ty0 + 11) for (let xx = cx - 4; xx <= cx + 4; xx++) if (Math.hypot((xx - cx) / 4.5, (yy - ty0 - 6.5) / 4.5) < 1) b.set(xx, yy, yy < ty0 + 4 ? PAL.P2 : PAL.P1); // the nail
    if (yy === ty0 + 14) for (let xx = cx - hw + 3; xx < cx + hw - 3; xx++) b.set(xx, yy, R[1]); // the knuckle's crease
  }
};
/** two hands resting on a laptop's deck, typing (another stranger's): the backs of the hands, four fingers down onto
 *  the keys, the sleeves to the frame's foot */
const deckHands = (b: Buf, tone: Tone, k: number, sleeve = PAL.G2) => {
  const R = SKIN[tone];
  for (const [hx, flip] of [[140, false], [292, true]] as Array<[number, boolean]>) {
    const dy = (Math.floor(k / 4) + (flip ? 1 : 0)) % 2;
    for (let j = 0; j < 14; j++) for (let i = 0; i < 40; i++) { const d = Math.hypot((i - 20) / 20, (j - 7) / 7.5); if (d < 1 && 180 + j + dy < RH) b.set(hx + i, 180 + j + dy, d > 0.88 ? R[0] : j < 4 ? R[3] : R[2]); }
    for (let q = 0; q < 4; q++) { const fx = hx + 5 + q * 8 + (flip ? 2 : 0); for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) { const Y = 175 + j + dy + (q === 0 || q === 3 ? 2 : 0); if (Y < RH) b.set(fx + i, Y, i === 0 ? R[0] : j < 2 ? R[3] : R[2]); } }
    for (let y = 192 + dy; y < RH; y++) rect(hx + 4, y, 32, 1, b.ink(y === 192 + dy ? stepColor(sleeve, 1) : sleeve));
  }
};
/** the product's own chip at phone size: the two-dot bubble, 10 x 8 */
const chip = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 8; j++) for (let i = 0; i < 10; i++) { const cx = Math.min(i, 9 - i), cy = Math.min(j, 7 - j); if (cx === 0 && cy === 0) continue; b.set(x + i, y + j, cy === 0 && j === 0 ? PAL.C7 : PAL.C6); }
  b.set(x + 3, y + 3, PAL.N0); b.set(x + 6, y + 3, PAL.N0); b.set(x + 3, y + 4, PAL.N0); b.set(x + 6, y + 4, PAL.N0);
};
/** word bars: `rows` rows of the answer too small to read (a pour), each row broken into words */
const pourRows = (b: Buf, x: number, y: number, w: number, rows: number, seed: number, col: number, gap = 5) => {
  for (let r = 0; r < rows; r++) {
    let cx = x;
    const end = x + w - (r % 5 === 4 ? Math.floor(w * 0.45) : 0);
    for (let q = 0; cx < end; q++) { const ww = 5 + Math.floor(hash(r, q, seed) * 16); rect(cx, y + r * gap, Math.min(ww, end - cx), 2, b.ink(col)); cx += ww + 3; }
  }
};
export interface PhoneChatSt { prompt: string; answer?: string; kjv?: boolean; pour?: number; banner?: boolean; seed?: number; bg?: number }
/** CHATGTP on a stranger's phone: the header, the prompt in its bubble (legible), the product's chip, the answer
 *  (legible words if given) and its pour (0..1 of the rows) running on past the screen's foot */
export const phoneChat = (b: Buf, S: Rect, st: PhoneChatSt) => {
  const t = new Buf(S.w, S.h, st.bg ?? PAL.N1);
  rect(0, 0, S.w, 10, t.ink(PAL.N3)); rect(0, 10, S.w, 1, t.ink(PAL.N0));
  text(t, 'CHATGTP', (S.w - textWidth('CHATGTP')) >> 1, 2, PAL.P1);
  let y = 15;
  if (st.banner) { rect(0, 11, S.w, 9, t.ink(PAL.W2)); pt(t, 'research preview', 3, 12, PAL.W6); y = 25; }
  const rows = pwrap(st.prompt, S.w - 20);
  const bw = Math.min(S.w - 8, Math.max(...rows.map(pw)) + 10), bh = rows.length * 10 + 5;
  rect(S.w - 4 - bw, y, bw, bh, t.ink(PAL.N4)); rect(S.w - 4 - bw, y, bw, 1, t.ink(PAL.N5));
  rows.forEach((r, i) => pt(t, r, S.w - bw + 1, y + 3 + i * 10, PAL.P2));
  y += bh + 6;
  chip(t, 3, y + 1);
  const cx = 16, cw = S.w - cx - 4;
  const nb = Math.floor(clamp(st.pour ?? 0, 0, 1) * 20);
  let ah = 0;
  if (st.answer) ah = st.kjv ? 18 : pwrap(st.answer, cw - 8).length * 10;
  if (st.answer || nb) {
    const ch = 5 + ah + nb * 5 + 2;
    rect(cx, y, cw, ch, t.ink(PAL.P1)); rect(cx, y, cw, 1, t.ink(PAL.P2));
    if (st.answer && st.kjv) {
      // a King James page's rubricated initial, then the line in the ink
      bpt(t, st.answer[0], cx + 4, y + 3, PAL.R2);
      pt(t, st.answer.slice(1), cx + 5 + bpw(st.answer[0]), y + 8, PAL.N1);
    } else if (st.answer) pwrap(st.answer, cw - 8).forEach((r, i) => ptx(t, r, cx + 4, y + 4 + i * 10, PAL.N1));
    pourRows(t, cx + 4, y + 4 + ah, cw - 8, nb, st.seed ?? 3, PAL.G4);
  }
  put(b, t, S.x, S.y);
};

// ------------------------------------------------------------------ the strangers' rooms (soft, behind a close phone)
type Place = 'dorm' | 'couch' | 'kitchen' | 'bedroom' | 'desk';
const placeBg = (b: Buf, place: Place, x0 = 0, x1 = 480) => {
  for (let y = 0; y < RH; y++) for (let x = x0; x < x1; x++) {
    let c: number;
    const d = bayer(x, y);
    if (place === 'dorm') {
      // a desk lamp's warm pool at upper right on a dark wall, the desk's wood below (soft: out of focus)
      const l = Math.hypot((x - 430) / 200, (y - 10) / 140);
      c = y > 150 ? (d < 0.5 ? PAL.D3 : PAL.D2) : l < 0.25 ? (d < 0.5 ? PAL.W4 : PAL.D4) : l < 0.8 ? (d < (0.8 - l) * 1.1 ? PAL.D3 : PAL.D2) : d < 0.25 ? PAL.D2 : PAL.D1;
      if (y > 150 && y < 153) c = PAL.D4;
    } else if (place === 'couch') {
      // a plum blanket in soft folds, night (a TV's cool light from the left)
      const fold = Math.sin((x + y * 0.8) / 23) + Math.sin((x * 0.6 - y) / 37) * 0.6;
      c = fold > 0.9 ? PAL.U3 : fold > 0.1 ? (d < 0.5 ? PAL.U2 : PAL.U3) : fold > -0.7 ? PAL.U2 : PAL.U1;
      if (x < 90 && d < (90 - x) / 180) c = PAL.F3;
    } else if (place === 'kitchen') {
      // a counter's tiles under a warm under-cabinet light
      const tile = (x % 24 === 0) || (y % 24 === 0);
      c = tile ? PAL.D2 : y < 50 ? (d < 0.35 ? PAL.W4 : PAL.W3) : d < 0.3 ? PAL.D4 : PAL.D3;
      if (y > 140) c = d < 0.5 ? PAL.G3 : PAL.G2;
    } else if (place === 'bedroom') {
      // a dark bedroom: a pillow's pale edge, the rest night blue
      c = y > 120 && x > x0 + 20 ? (d < 0.4 ? PAL.N4 : PAL.N3) : d < 0.3 ? PAL.N2 : PAL.N1;
      const lamp = Math.hypot((x - (x0 + 40)) / 70, (y - 30) / 50);
      if (lamp < 1 && d < (1 - lamp) * 0.5) c = PAL.W1;
    } else {
      // a desk at night: the laptop's cool light on a dark desktop
      c = y > 150 ? (d < 0.3 ? PAL.G2 : PAL.G1) : d < 0.2 ? PAL.N2 : PAL.N1;
    }
    b.set(x, y, c);
  }
};
const mug = (b: Buf, x: number, y: number, col: number) => {
  rect(x, y, 16, 20, b.ink(col)); rect(x, y, 16, 2, b.ink(stepColor(col, 1))); rect(x + 12, y + 2, 1, 18, b.ink(stepColor(col, -1)));
  rect(x + 16, y + 5, 4, 2, b.ink(col)); rect(x + 18, y + 5, 2, 9, b.ink(col)); rect(x + 16, y + 12, 4, 2, b.ink(col));
  rect(x + 2, y + 1, 12, 1, b.ink(PAL.D1));
};

// ================================================================== a generic post card
export type AvatarKind = 'nole' | 'anon' | 'atem' | 'mas';
const AVN = ['....kkkkkk....', '..kkbbbbbbkk..', '.kbbhhhhhhbbk.', '.kbhhhhhhhhbk.', 'kbbhsSSSShhbbk', 'kbbhsSSSSshbbk', 'kbbbsSSSSsbbbk',
  'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbwwssxwbbbk', '.kbxwwxxwwxbk.', '.kbxxwwwwxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'];
const AVP: Record<string, number> = {k: PAL.N0, b: PAL.Q0, h: PAL.B1, s: PAL.S4, S: PAL.S5, x: PAL.N2, w: PAL.P1};
const avatar = (b: Buf, x: number, y: number, kind: AvatarKind) => {
  if (kind === 'nole') { AVN.forEach((r, j) => { for (let i = 0; i < 14; i++) { const c = AVP[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } }); return; }
  // a round chip: the stranger's is a plain grey disc (no face, no detail); Atem's and Mas's carry an initial
  const col = kind === 'anon' ? PAL.G3 : kind === 'atem' ? PAL.F4 : PAL.C3;
  for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const d = Math.hypot(i - 6.5, j - 6.5); if (d < 7) b.set(x + i, y + j, d > 6.2 ? PAL.N0 : col); }
  if (kind !== 'anon') text(b, kind === 'atem' ? 'A' : 'M', x + 4, y + 3, PAL.P2);
};
export interface FeedPostSpec { name?: string; handle?: string; reply?: string; text: string; ts?: string; av: AvatarKind }
export const feedPostSize = (spec: FeedPostSpec, w: number) => ({w, h: 21 + (spec.reply ? 9 : 0) + pwrap(spec.text, w - 34).length * 10 + 6});
/** a post card in a generic feed (post-card's grammar: the N2 card, its top rule a rung up, the avatar, the name and
 *  handle, the words in their own casing); `k` opens it in 3 held steps */
export const feedPost = (b: Buf, x: number, y: number, w: number, spec: FeedPostSpec, o: {k?: number; bg?: number; textCol?: number} = {}) => {
  const {h} = feedPostSize(spec, w);
  const k = o.k ?? 99, bg = o.bg ?? PAL.N2;
  if (k < 0) return h;
  const open = k >= 3 ? 1 : [0.2, 0.5, 0.8][k];
  const hh = Math.max(3, Math.round(h * open)), yy = y + Math.round((h - hh) / 2);
  rect(x - 1, yy - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, yy, w, hh, b.ink(bg)); rect(x, yy, w, 1, b.ink(stepColor(bg, 2)));
  if (open < 1) return h;
  avatar(b, x + 6, y + 6, spec.av);
  let ty = y + 6;
  if (spec.name) { pt(b, spec.name, x + 26, ty, PAL.P2); if (spec.handle) pt(b, spec.handle, x + 30 + pw(spec.name), ty, PAL.N6); ty += 10; }
  if (spec.ts) pt(b, spec.ts, x + w - 6 - pw(spec.ts), y + 6, PAL.N6);
  if (spec.reply) { pt(b, spec.reply, x + 26, ty, PAL.N6); ty += 9; }
  if (!spec.name) ty = y + 8;
  pwrap(spec.text, w - 34).forEach((l, i) => pt(b, l, x + 26, ty + 3 + i * 10, o.textCol ?? PAL.P1));
  return h;
};

// ================================================================== sc 9's exit and sc 10: the first weeks
/** the screen of his phone as drawAlertInsert frames it (the phone at 176, 28, 128 wide, to the frame's foot) */
export const HIS_PHONE = {x: 176, y: 28, w: 128, h: 176, screen: {x: 182, y: 38, w: 116, h: 165}};
/** v32-7.03's last beat: his phone put down on the desk lights with strangers' screenshots of their chats, one, then
 *  another, then dozens, popping up the screen (k frames since it lit); its cool light on the desk round it */
export const phoneLights = (b: Buf, f: number, k: number) => {
  drawAlertInsert(b, f, {k: 0});
  // the screen's cool spill on the desk (replacing the old red), in whole rungs
  const P = HIS_PHONE;
  for (let y = P.y - 14; y < RH; y++) for (let x = P.x - 18; x < P.x + P.w + 18; x++) { const d = Math.max(Math.abs(x - P.x - P.w / 2) - P.w / 2, P.y - y, 0) / 18; if (d > 0 && d < 1 && bayer(x, y) < (1 - d) * 0.45) b.set(x, y, stepColor(b.get(x, y), 1)); }
  const S = P.screen, t = new Buf(S.w, S.h, PAL.N2);
  const n = Math.min(14, 1 + Math.floor(k / 2));
  // the newest card at the top: each is a stranger's screenshot of a chat, a thumbnail (a prompt bar, answer rows);
  // the first one's prompt is the essay (it carries into 10.01)
  for (let i = 0; i < n; i++) {
    const age = n - 1 - i, cy = 4 + age * 26 - (k % 2 === 0 && i === n - 1 && k > 0 ? 6 : 0);
    if (cy > S.h) continue;
    rect(3, cy, S.w - 6, 23, t.ink(PAL.N3)); rect(3, cy, S.w - 6, 1, t.ink(PAL.N5));
    chip(t, 6, cy + 4);
    if (i === 0) { pt(t, 'write my essay on', 19, cy + 3, PAL.P2); pt(t, 'the fall of rome…', 19, cy + 12, PAL.P2); }
    else { rect(19, cy + 5, 40 + Math.floor(hash(i, 1, 71) * 40), 2, t.ink(PAL.P0)); pourRows(t, 19, cy + 11, S.w - 30, 2, i + 7, PAL.G4); }
  }
  put(b, t, S.x, S.y);
};
const ESSAY = 'write my essay on the fall of rome. make it sound like me';
const KJV = 'king james verse: a peanut butter sandwich stuck in a VCR';
/** sc 10's inserts, by the lock's beat id (k frames into the shot) */
export const montage10 = (b: Buf, f: number, id: string, k: number, dur: number) => {
  if (id === 'v35-10.01') {
    // MATCH from his phone: a stranger's, the same place and size in frame, held up in a dorm's lamplight
    placeBg(b, 'dorm'); mug(b, 60, 128, PAL.C4);
    const P = HIS_PHONE, S = phoneBody(b, P.x, P.y, P.w, P.h + 20, PAL.G4);
    phoneChat(b, {...S, h: RH - S.y}, {prompt: ESSAY, pour: clamp((k - 8) / 40, 0, 1), seed: 11});
    strangerHand(b, P.x, P.y, P.w, P.h, 1);
    return;
  }
  if (id === 'v35-10.02') {
    // someone's laptop at night: a code editor, one line red; the question in the chat beside it; on the pulse the
    // line turns green
    placeBg(b, 'desk');
    const sx = 64, sy = 12, sw = 352, sh = 152;
    rect(sx - 7, sy - 7, sw + 14, sh + 12, b.ink(PAL.N0)); rect(sx - 6, sy - 6, sw + 12, 1, b.ink(PAL.G2));
    rect(sx, sy, sw, sh, b.ink(PAL.N1));
    // the editor (left 220): line numbers, code as coloured word bars, the failing line
    const fixed = k >= Math.round(dur * 0.5);
    for (let r = 0; r < 13; r++) {
      const yy = sy + 6 + r * 11;
      tiny(b, String(40 + r), sx + 4, yy, PAL.N5);
      if (r === 7) { rect(sx + 16, yy - 2, 200, 9, b.ink(fixed ? PAL.L1 : PAL.R1)); }
      let cx = sx + 20 + (r % 4) * 8;
      for (let q = 0; q < 4 && cx < sx + 210; q++) { const ww = 8 + Math.floor(hash(r, q, 21) * 26); rect(cx, yy + 1, ww, 3, b.ink(r === 7 ? (fixed ? PAL.L3 : PAL.R3) : [PAL.C5, PAL.W6, PAL.F6, PAL.L3][(r + q) % 4])); cx += ww + 5; }
    }
    // the chat panel (right 128)
    const cx0 = sx + 224; rect(cx0, sy, sw - 224, sh, b.ink(PAL.N2)); rect(cx0, sy, 1, sh, b.ink(PAL.N0));
    rect(cx0, sy, sw - 224, 10, b.ink(PAL.N3)); text(b, 'CHATGTP', cx0 + ((sw - 224 - textWidth('CHATGTP')) >> 1), sy + 2, PAL.P1);
    const q = 'why does this crash', qw = pw(q) + 10;
    rect(sx + sw - 4 - qw, sy + 16, qw, 14, b.ink(PAL.N4)); pt(b, q, sx + sw - qw + 1, sy + 19, PAL.P2);
    chip(b, cx0 + 4, sy + 38);
    rect(cx0 + 17, sy + 36, sw - 224 - 21, 50, b.ink(PAL.P1)); pourRows(b, cx0 + 21, sy + 41, sw - 224 - 29, 8, 23, PAL.G4);
    // the deck, two hands resting on it (another stranger)
    poly([sx - 30, RH, sx + sw + 30, RH, sx + sw + 10, sy + sh + 6, sx - 10, sy + sh + 6], b.ink(PAL.G1));
    for (let x = sx - 6; x < sx + sw + 6; x++) b.set(x, sy + sh + 6, fixed ? PAL.L2 : PAL.C3);
    deckHands(b, 2, k, PAL.U2);
    return;
  }
  if (id === 'v35-10.03') {
    // a phone in the other hand, on a couch at night: the viral prompt, and the answer in a King James face
    placeBg(b, 'couch');
    const px = 150, py = 10, w = 180, h = 214;
    const S = phoneBody(b, px, py, w, h, PAL.G3);
    phoneChat(b, {...S, h: RH - S.y}, {prompt: KJV, answer: k >= 16 ? 'And it came to pass…' : undefined, kjv: true, pour: clamp((k - 20) / 30, 0, 1), seed: 31});
    strangerHand(b, px, py, w, h, 0);
    return;
  }
  if (id === 'v35-10.04') {
    // a feed on a phone, close: Nole's post, a reply to Mas (the name swaps only)
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.2 ? PAL.N2 : PAL.N1);
    for (let r = 0; r < 3; r++) { rect(56, 8 + r * 70, 368, 56, b.ink(PAL.N2)); pourRows(b, 90, 30 + r * 70, 300, 3, 40 + r, PAL.N4); }
    const spec: FeedPostSpec = {name: 'Nole', handle: '@nole', reply: 'replying to @masa', text: 'CHATGTP is scary good. We are not far from dangerously strong AI.', ts: 'DEC 3', av: 'nole'};
    const w = 330, h = feedPostSize(spec, w).h;
    feedPost(b, 75, Math.round((RH - h) / 2) - 6, w, spec, {k: 99, bg: PAL.N3});
    return;
  }
  if (id === 'v35-10.05') {
    // two phones side by side: a kitchen at dusk (dinner), a dark bedroom (the apology): the second is the one a
    // stranger's post answers at 3 AM
    placeBg(b, 'kitchen', 0, 238); placeBg(b, 'bedroom', 242, 480);
    rect(238, 0, 4, RH, b.ink(PAL.N0));
    const A = phoneBody(b, 58, 36, 120, 190, PAL.G4);
    phoneChat(b, {...A, h: RH - A.y}, {prompt: "eggs, half an onion, rice. what's dinner", pour: clamp((k - 6) / 30, 0, 1), seed: 51});
    strangerHand(b, 58, 36, 120, 190, 2);
    const B = phoneBody(b, 296, 22, 132, 200, PAL.G3);
    phoneChat(b, {...B, h: RH - B.y}, {prompt: 'how do i say sorry to my sister', pour: clamp((k - 10) / 40, 0, 1), seed: 53});
    strangerHand(b, 296, 22, 132, 200, 0);
    return;
  }
  if (id === 'v35-10.06') {
    // a chat window, close (its own pixels doubled): a sum answered wrong, over the small print nobody reads
    const t = new Buf(240, 102, PAL.N1);
    rect(0, 0, 240, 10, t.ink(PAL.N3)); text(t, 'CHATGTP', (240 - textWidth('CHATGTP')) >> 1, 2, PAL.P1);
    const q = 'what is 7 × 8', qw = pw(q.replace('×', 'xx')) + 12;
    rect(236 - qw, 16, qw, 14, t.ink(PAL.N4)); ptx(t, q, 240 - qw + 2, 19, PAL.P2);
    chip(t, 6, 38);
    rect(20, 35, 150, 26, t.ink(PAL.P1)); rect(20, 35, 150, 1, t.ink(PAL.P2));
    bptx(t, '7 × 8 = 54.', 26, 40, PAL.N1);
    rect(4, 70, 232, 12, t.ink(PAL.N2)); rect(4, 70, 232, 1, t.ink(PAL.N3));
    // the banner: the product's own small print, under the input row
    rect(0, 86, 240, 12, t.ink(PAL.W2)); rect(0, 86, 240, 1, t.ink(PAL.W3));
    pt(t, 'research preview · may make things up', 6, 88, PAL.W6);
    put2x(b, t, 0, 0);
    return;
  }
  if (id === 'v35-10.07') {
    // the coders' question site (a parody: its name, a stack upside down for a mark, generic colours), the notice
    const t = new Buf(240, 102, PAL.P2);
    rect(0, 0, 240, 9, t.ink(PAL.G2)); rect(40, 2, 150, 5, t.ink(PAL.G1));
    rect(0, 9, 240, 16, t.ink(PAL.N4)); rect(0, 25, 240, 1, t.ink(PAL.F5));
    // the mark: four bars, widest on top (a stack, underflowing), in the site's teal
    for (let i = 0; i < 4; i++) rect(8 + i, 12 + i * 3, 12 - i * 2, 2, t.ink(PAL.C5));
    pt(t, 'STACK UNDERFLOW', 26, 13, PAL.P2);
    // the notice: a pale box with a warm rule, its words in bold ink
    rect(8, 32, 224, 26, t.ink(PAL.W8)); rect(8, 32, 3, 26, t.ink(PAL.W5)); rect(8, 57, 224, 1, t.ink(PAL.W6));
    pt(t, 'Temporary policy: CHATGTP is banned', 15, 37, PAL.N1);
    rect(15, 48, 150, 2, t.ink(PAL.P0)); rect(15, 52, 110, 2, t.ink(PAL.P0));
    // the questions under it: vote boxes and title bars
    for (let r = 0; r < 4; r++) { const yy = 64 + r * 10; rect(8, yy, 12, 7, t.ink(PAL.P1)); rect(26, yy + 1, 90 + Math.floor(hash(r, 1, 81) * 80), 2, t.ink(PAL.F4)); rect(26, yy + 5, 60, 1, t.ink(PAL.P0)); }
    put2x(b, t, 0, 0);
    return;
  }
  if (id === 'v35-10.08') {
    // pull back: his desk at night covered in lit phones, strangers' chats on every one; among them his lights red
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 250) / 320, (y - 90) / 200); b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.55 ? PAL.G3 : bayer(x, y) < 0.3 ? PAL.G1 : PAL.G2); }
    const red = k >= Math.round(dur * 0.45);
    const phones: Array<[number, number, boolean]> = [[36, 20, false], [104, 64, true], [150, 8, false], [262, 26, false], [330, 90, true], [410, 18, false], [60, 118, true], [182, 112, false], [300, 148, false], [398, 128, false], [18, 60, false], [440, 70, true]];
    phones.forEach(([x, y, land], i) => {
      const w = land ? 46 : 28, h = land ? 28 : 46;
      // its glow on the desk round it, the shadow, the slab (rounded, a thick dark bezel), the lit screen: CHATGTP's
      // header strip, the chip, a prompt bubble, the answer's rows
      for (let yy = y - 5; yy < y + h + 5; yy++) for (let xx = x - 5; xx < x + w + 5; xx++) if ((xx < x || xx >= x + w || yy < y || yy >= y + h) && bayer(xx, yy) < 0.3) b.set(xx, yy, stepColor(b.get(xx, yy), 1));
      rect(x + 3, y + 3, w, h, b.ink(PAL.N0));
      for (let j = 0; j < h; j++) for (let q = 0; q < w; q++) { const cx = Math.min(q, w - 1 - q), cy = Math.min(j, h - 1 - j); if (cx + cy < 2) continue; b.set(x + q, y + j, PAL.N0); }
      const sx = x + 3, sy = y + 3, sw = w - 6, shh = h - 6;
      rect(sx, sy, sw, shh, b.ink(PAL.N2)); rect(sx, sy, sw, 3, b.ink(PAL.N4));
      rect(sx + 2, sy + 5, 4, 3, b.ink(PAL.C6));
      rect(sx + sw - 2 - Math.min(sw - 10, 14), sy + 5, Math.min(sw - 10, 14), 4, b.ink(PAL.N5));
      for (let yy = sy + 11; yy < sy + shh - 2; yy += 3) rect(sx + 7, yy, sw - 10 - Math.floor(hash(i, yy, 91) * 6), 1, b.ink(PAL.P1));
    });
    // his, near the middle: the red alert card, its red on the desk round it
    const hx = 214, hy = 56, hw = 30, hh = 50;
    if (red) for (let yy = hy - 10; yy < hy + hh + 10; yy++) for (let xx = hx - 10; xx < hx + hw + 10; xx++) if (bayer(xx, yy) < 0.35) b.set(xx, yy, PAL.R0);
    rect(hx + 3, hy + 3, hw, hh, b.ink(PAL.N0)); rect(hx, hy, hw, hh, b.ink(PAL.N0)); rect(hx + 2, hy + 2, hw - 4, hh - 4, b.ink(red ? PAL.R2 : PAL.N2));
    if (red) { ellipse(hx + 15, hy + 20, 5, 4, b.ink(PAL.R3)); rect(hx + 13, hy + 17, 4, 2, b.ink(Math.floor(f / 6) % 2 ? PAL.W7 : PAL.W8)); rect(hx + 6, hy + 34, 18, 2, b.ink(PAL.P2)); }
    return;
  }
};

// ================================================================== sc 12: 3 AM
/** his laptop's screen in the OTS (drawLaunchOTSLaptop's rect) */
export const LAP3 = {x: 100, y: 12, w: 300, h: 150};
/** the corner counter (1x) in his screen's menu bar, and where 12.03 doubles it (2x, the frame's top left) */
export const COUNTER_TXT = 'CHATGTP · USERS:';
export const YEARS_TXT = 'PLAYED AGAINST ITSELF TODAY: 180 YEARS';
export const COUNTER_AT = {x: 12, y: 16};
const menuBar = (t: Buf, w: number, f: number, counter: string | null) => {
  rect(0, 0, w, 11, t.ink(PAL.N3)); rect(0, 11, w, 1, t.ink(PAL.N0));
  if (counter === COUNTER_TXT) { pt(t, counter, 3, 2, PAL.G6); drawOdometer(t, 3 + pw(counter) + 3, 1, {size: 'plate', value: 8431207, digits: 7, spin: 1, f}); }
  else if (counter) pt(t, counter, 3, 2, PAL.G6);
  const clk = '3:04 AM'; pt(t, clk, w - 4 - pw(clk), 2, PAL.G5);
};
/** a few emoji, hand-set at the pixel font's height (7 x 7): 🎉 😭 🙏 ❤ */
const EMO: Record<string, [string[], Record<string, number>]> = {
  '🎉': [['.r..c.y', '...y..r', '.c.ww..', '..www.c', '.wwww..', 'www....', 'w......'], {w: PAL.W6, y: PAL.W8, r: PAL.R3, c: PAL.C6}],
  '😭': [['.yyyyy.', 'yyyyyyy', 'ykyyyky', 'bbyyybb', 'bykkkyb', 'byykyyb', '.yyyyy.'], {y: PAL.W7, k: PAL.N1, b: PAL.F6}],
  '🙏': [['...S...', '..sSs..', '..sSs..', '.ssSss.', '.ssSss.', '.ssSss.', '..c.c..'], {s: PAL.S5, S: PAL.S3, c: PAL.C5}],
  '❤': [['.rr.rr.', 'rrrrrrr', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], {r: PAL.R3}],
};
const emoji = (b: Buf, e: string, x: number, y: number) => { const g = EMO[e]; if (!g) return; g[0].forEach((row, j) => { for (let i = 0; i < 7; i++) { const c = g[1][row[i]]; if (c !== undefined) b.set(x + i, y + j, c); } }); };
/** text with emoji in it: the pixel font, the emoji drawn in their place */
const ptE = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x, run = '';
  const flush = () => { if (run) { pt(b, run, cx, y, col); cx += pw(run) + 2; run = ''; } };
  for (const ch of s) { if (EMO[ch]) { flush(); emoji(b, ch, cx, y); cx += 9; } else run += ch; }
  flush();
};
/** an anonymous staff avatar: a colour chip, a pale head and shoulders (no face, no name) */
const staffAvatar = (b: Buf, x: number, y: number, col: number) => {
  for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) { const cx = Math.min(i, 11 - i), cy = Math.min(j, 11 - j); if (cx + cy < 2) continue; b.set(x + i, y + j, col); }
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) if (Math.hypot(i - 1.5, j - 1.5) < 2) b.set(x + 4 + i, y + 2 + j, PAL.P1);
  for (let i = 2; i < 10; i++) for (let j = 8; j < 11; j++) if (Math.abs(i - 5.5) < 1.5 + (j - 8)) b.set(x + i, y + j, PAL.P1);
};
/** the team's internal channel on his screen at 3 AM: #launch, three messages from anonymous staff and the reactions
 *  piling up under them (`k` frames since it loaded: the messages land in 3 held steps, the counts tick) */
const teamChannel = (t: Buf, w: number, k: number) => {
  rect(0, 12, w, 12, t.ink(PAL.N2)); rect(0, 24, w, 1, t.ink(PAL.N0));
  pt(t, '#launch', 6, 14, PAL.P2); pt(t, '#launch', 7, 14, PAL.P2);
  const msgs: Array<[string, number]> = [['1M 🎉 best week of my life', PAL.L1], ['my mom wrote her wedding toast with it 😭', PAL.U3], ['thank you mas 🙏', PAL.F4]];
  msgs.forEach(([m, col], i) => {
    if (k < i) return;
    const y = 30 + i * 22;
    staffAvatar(t, 6, y, col);
    rect(22, y + 2, 16 + (i * 7) % 12, 2, t.ink(PAL.N4));
    ptE(t, m, 22, y + 7, PAL.P2);
  });
  // the reactions under the last message, piling up (the counts tick on held steps)
  if (k >= 3) {
    const tick = Math.min(12, Math.floor((k - 3) / 4));
    const R: Array<[string, number]> = [['🎉', 52], ['❤', 38], ['😭', 21], ['🙏', 44]];
    let x = 22;
    R.forEach(([e, n], i) => {
      const s = String(n + tick * (i + 1)), cw = 14 + pw(s);
      rect(x, 98, cw, 11, t.ink(PAL.N3)); rect(x, 98, cw, 1, t.ink(PAL.N5));
      emoji(t, e, x + 2, 100); pt(t, s, x + 11, 100, PAL.P1);
      x += cw + 4;
    });
  }
};
/** the at-capacity page, the reload, and the team's channel (st.page), in his laptop's screen */
export const laptopScreen3am = (b: Buf, S: Rect, f: number, page: 'capacity' | 'reload' | 'feed', k: number) => {
  const t = new Buf(S.w, S.h, PAL.N1);
  menuBar(t, S.w, f, COUNTER_TXT);
  if (page === 'capacity') {
    const l1 = 'CHATGTP IS AT', l2 = 'CAPACITY RIGHT NOW';
    bpt(t, l1, (S.w - bpw(l1)) >> 1, 30, PAL.P2); bpt(t, l2, (S.w - bpw(l2)) >> 1, 52, PAL.P2);
    drawChatBubble(t, (S.w - 34) >> 1, 84, {size: 'screen', state: 'idle', f});
    rect((S.w >> 1) - 30, 122, 60, 12, t.ink(PAL.N3)); pt(t, 'try again', (S.w - pw('try again')) >> 1, 124, PAL.G6);
  } else if (page === 'reload') {
    // the spinner: an arc of eight dots, the lit one stepping round on 2s
    const cx = S.w >> 1, cy = 70;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const on = (Math.floor(k / 2) % 8) === i; rect(cx + Math.round(Math.cos(a) * 12) - 1, cy + Math.round(Math.sin(a) * 12) - 1, 3, 3, t.ink(on ? PAL.P2 : PAL.N4)); }
  } else {
    // v3.5 final: the team's own channel at 3 AM, celebrating (anonymous staff avatars, no names), the reactions piling
    teamChannel(t, S.w, k);
  }
  put(b, t, S.x, S.y);
};
/** [OTS] 12.01: over his shoulder at 3 AM, the bullpen dark but for his laptop */
export const ots3am = (b: Buf, f: number, page: 'capacity' | 'reload' | 'feed', k: number) => {
  launchBackM(b, 520, {soft: 2, alyi: 'gone', underlines: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  const S = LAP3;
  rect(S.x - 8, S.y - 8, S.w + 16, S.h + 14, b.ink(PAL.N0)); rect(S.x - 7, S.y - 7, S.w + 14, 1, b.ink(PAL.G2));
  laptopScreen3am(b, S, f, page, k);
  poly([S.x - 30, RH, S.x + S.w + 30, RH, S.x + S.w + 8, S.y + S.h + 6, S.x - 8, S.y + S.h + 6], b.ink(PAL.G1));
  for (let y = S.y + S.h + 6; y < RH; y++) for (let x = S.x - 30; x < S.x + S.w + 30; x++) if (b.get(x, y) === PAL.G1 && (y - S.y - S.h) % 5 === 0 && (x + y) % 6 < 4) b.set(x, y, PAL.N2);
  for (let x = S.x - 8; x < S.x + S.w + 8; x++) b.set(x, S.y + S.h + 6, PAL.C4);
  otsShoulder(b, -62, 70, PAL.C5, {flip: true});
};
/** [MCU] 12.02: Mas in the laptop's light at 3 AM (drawLaunchMcuMas's frame, the room two rungs darker, the chat's
 *  light from below as a clean rim) */
export const mcu3am = (b: Buf, f: number, mas: Partial<MasPortraitState>) => {
  launchBackM(b, 330, {soft: 2, alyi: 'gone'});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'monitor', look: -1, ...mas};
  const x = 96, y = 34;
  putBust(b, masPortrait(s), x, y);
  drawCollarsPortrait(b, x, y, 2, {head: s.head ?? '34', light: 'monitor', style: 'v31'});
  const sk = (c: number) => { const fm = familyOf(c); return !!fm && (fm[0] === 'K' || fm[0] === 'X' || fm[0] === 'S'); };
  const hits: Array<[number, number]> = [];
  for (let yy = y + 56; yy < y + 100; yy++) for (let xx = x + 20; xx < x + 90; xx++) if (sk(b.get(xx, yy)) && !sk(b.get(xx, yy + 1))) hits.push([xx, yy]);
  for (const [xx, yy] of hits) b.set(xx, yy, stepColor(b.get(xx, yy), 2));
  for (let xx = 56; xx < 276; xx++) { b.set(xx, RH - 2, PAL.C6); b.set(xx, RH - 1, PAL.C7); if (bayer(xx, 0) < 0.5) b.set(xx, RH - 3, PAL.C4); }
  void f;
};
/** [INSERT] 12.03: his screen's top-left corner, close (its pixels doubled): the counter, then the same place, size and
 *  face, PLAYED AGAINST ITSELF TODAY: 180 YEARS */
export const counterECU = (b: Buf, f: number, swap: boolean) => {
  const t = new Buf(240, 102, PAL.N1);
  rect(0, 0, 240, 22, t.ink(PAL.N3)); rect(0, 22, 240, 1, t.ink(PAL.N0));
  if (!swap) { pt(t, COUNTER_TXT, COUNTER_AT.x / 2, COUNTER_AT.y / 2, PAL.G6); drawOdometer(t, COUNTER_AT.x / 2 + pw(COUNTER_TXT) + 3, COUNTER_AT.y / 2 - 1, {size: 'plate', value: 8431207, digits: 7, spin: 1, f}); }
  else pt(t, YEARS_TXT, COUNTER_AT.x / 2, COUNTER_AT.y / 2, PAL.G6);
  // the team's channel under it (12.01's screen, seen close)
  const c = new Buf(240, 90, PAL.N1);
  teamChannel(c, 240, 99);
  for (let j = 0; j < 90 - 12 && 26 + j < 102; j++) for (let i = 0; i < 240; i++) t.set(i, 26 + j, c.get(i, 12 + j));
  put2x(b, t, 0, 0);
};

// ================================================================== the render front (the intro's glowing seam)
/** the seam at x: behind it (dir 1: its left; -1: its right) `to`, resolving coarse to fine like a progressive image
 *  in its last 20 px; ahead of it `from`; the seam itself a 1 px line of light with a two-pixel halo */
export const renderFront = (b: Buf, from: Buf, to: Buf, x: number, dir: 1 | -1) => {
  for (let y = 0; y < RH; y++) for (let X = 0; X < 480; X++) {
    const d = dir > 0 ? x - X : X - x, i = y * 480 + X;
    if (d <= 0) { b.c[i] = from.c[i]; continue; }
    if (d < 20) { const s = d < 8 ? 8 : 4; const sx = X - (X % s), sy = y - (y % s); b.c[i] = to.c[sy * 480 + sx]; continue; }
    b.c[i] = to.c[i];
  }
  for (let y = 0; y < RH; y++) {
    const set = (X: number, c: number) => { if (X >= 0 && X < 480) b.set(X, y, c); };
    set(x, PAL.C9); set(x - dir, PAL.C7); set(x + dir, PAL.C6);
    if (bayer(x, y) < 0.5) set(x - 2 * dir, PAL.C5);
  }
};

// ================================================================== sc 13: JUN 2018, the T3 memory tier (cut-paper)
/** cut-paper: a layer drawn flat, then laid on the page with a one-rung shadow down and right (the paper's thickness) */
const paper = (b: Buf, draw: (t: Buf) => void, sh = 1) => {
  const t = new Buf(480, RH, TR);
  draw(t);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (t.c[y * 480 + x] === TR) continue;
    for (let s = 1; s <= sh; s++) { const X = x + s, Y = y + s; if (X < 480 && Y < RH && t.c[Y * 480 + X] === TR) b.set(X, Y, stepColor(b.get(X, Y), -2)); }
  }
  for (let i = 0; i < 480 * RH; i++) if (t.c[i] !== TR) b.c[i] = t.c[i];
};
/** a sprite as a cut-paper figure: its ramps flattened to three tones (shadow, mid, light), a cut edge a rung up on
 *  its top and left, its shadow on the page */
const POST3 = (c: number) => {
  const fm = familyOf(c); if (!fm) return c;
  const [fam, i] = fm, R = FAMILIES[fam], n = R.length;
  const lv = i < n * 0.36 ? Math.max(0, Math.round(n * 0.15)) : i < n * 0.7 ? Math.round(n * 0.5) : Math.min(n - 1, Math.round(n * 0.78));
  return R[Math.min(n - 1, lv)];
};
const paperSprite = (b: Buf, draw: (t: Buf) => void, o: {rim?: number; side?: -1 | 1} = {}) => {
  const t = new Buf(480, RH, TR);
  draw(t);
  for (let i = 0; i < 480 * RH; i++) if (t.c[i] !== TR) t.c[i] = POST3(t.c[i]);
  const cut = new Buf(480, RH, TR);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const v = t.c[y * 480 + x]; if (v === TR) continue;
    const up = y === 0 || t.c[(y - 1) * 480 + x] === TR, left = x === 0 || t.c[y * 480 + x - 1] === TR, right = x === 479 || t.c[y * 480 + x + 1] === TR;
    if (o.rim !== undefined && ((o.side ?? -1) < 0 ? left : right)) cut.c[y * 480 + x] = o.rim;
    else if (up || left) cut.c[y * 480 + x] = stepColor(v, 1);
  }
  paper(b, (p) => { for (let i = 0; i < 480 * RH; i++) if (t.c[i] !== TR) p.c[i] = cut.c[i] !== TR ? cut.c[i] : t.c[i]; });
};
/** the paper's grain over a region (static: it's the page, not the light) */
const grain = (b: Buf, x0 = 0, y0 = 0, x1 = 480, y1 = RH, skip?: (x: number, y: number) => boolean) => {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    if (skip && skip(x, y)) continue;
    const h = hash(x, y, 97);
    if (h < 0.035) b.set(x, y, stepColor(b.get(x, y), 1)); else if (h > 0.975) b.set(x, y, stepColor(b.get(x, y), -1));
  }
};

/** ATOD: bots playing bots, top-down, in the game's own medium (vivid, crisp, a HUD): the map's diagonal river, three
 *  lanes, the two bases, the towers, and the creeps and heroes marching and meeting (held on 3s) */
export const arena = (b: Buf, x: number, y: number, w: number, h: number, f: number, seed: number) => {
  const t = Math.floor(f / 3);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const u = i / w, v = j / h;
    let c = hash(i >> 1, j >> 1, seed) < 0.18 ? PAL.L2 : (i + j) % 7 === 0 ? PAL.L0 : PAL.L1;
    if (Math.abs(u - v) < 0.07) c = Math.abs(u - v) < 0.035 ? PAL.C4 : PAL.C3;
    const lane = j === 2 || i === 2 || j === h - 3 || i === w - 3 || Math.abs(u + v - 1) < 0.03;
    if (lane) c = PAL.P0;
    if (u < 0.2 && v > 0.8) c = (u < 0.1 && v > 0.9) ? PAL.L3 : PAL.L2;
    if (u > 0.8 && v < 0.2) c = (u > 0.9 && v < 0.1) ? PAL.R3 : PAL.R2;
    b.set(x + i, y + j, c);
  }
  // towers along the lanes
  for (const [u, v, g] of [[0.05, 0.4, 1], [0.05, 0.15, 1], [0.6, 0.95, 1], [0.35, 0.95, 1], [0.35, 0.65, 1], [0.95, 0.6, 0], [0.95, 0.85, 0], [0.4, 0.05, 0], [0.65, 0.05, 0], [0.65, 0.35, 0]] as Array<[number, number, number]>) rect(x + Math.round(u * (w - 3)), y + Math.round(v * (h - 3)), 2, 2, b.ink(g ? PAL.W8 : PAL.W7));
  // creeps: each lane, each team, marching toward the other base; they meet near the middle and flicker there
  const lanePt = (lane: number, p: number): [number, number] => {
    if (lane === 0) return p < 0.5 ? [2, Math.round((1 - p * 2) * (h - 5)) + 2] : [Math.round((p - 0.5) * 2 * (w - 5)) + 2, 2];
    if (lane === 1) return [Math.round(p * (w - 5)) + 2, Math.round((1 - p) * (h - 5)) + 2];
    return p < 0.5 ? [Math.round(p * 2 * (w - 5)) + 2, h - 3] : [w - 3, Math.round((1 - (p - 0.5) * 2) * (h - 5)) + 2];
  };
  for (let lane = 0; lane < 3; lane++) for (let n = 0; n < 3; n++) {
    const ph = ((t * 0.018 + n * 0.12 + hash(lane, seed, 5) * 0.2) % 0.5);
    const [gx, gy] = lanePt(lane, ph), [rx, ry] = lanePt(lane, 1 - ph);
    b.set(x + gx, y + gy, PAL.L3); b.set(x + rx, y + ry, PAL.R3);
  }
  // two heroes fighting somewhere mid-map (bright, a hit spark every other held step)
  const hx = x + Math.round(w * (0.4 + 0.2 * hash(seed, Math.floor(t / 8), 7))), hy = y + Math.round(h * (0.45 + 0.1 * hash(seed, Math.floor(t / 8), 8)));
  rect(hx, hy, 2, 2, b.ink(PAL.C8)); rect(hx + 4, hy - 1, 2, 2, b.ink(PAL.W8));
  if (t % 2) b.set(hx + 3, hy, PAL.W9);
  // the HUD: a thin top strip, the game's name, the two teams' score boxes
  rect(x, y, w, 5, b.ink(PAL.N0));
  if (w >= 40) { tiny(b, 'ATOD', x + 1, y, PAL.W7); rect(x + w - 12, y + 1, 4, 3, b.ink(PAL.L3)); rect(x + w - 6, y + 1, 4, 3, b.ink(PAL.R3)); }
};

/** the LED sign at the top of the 2018 wall: the counter's words, at the counter's place and size, each pixel a lit
 *  LED (a bright dot and its dimmer cell) */
export const ledCounter = (b: Buf, txt = YEARS_TXT) => {
  rect(0, COUNTER_AT.y - 6, 480, 26, b.ink(PAL.N0)); rect(0, COUNTER_AT.y - 6, 480, 1, b.ink(PAL.N2)); rect(0, COUNTER_AT.y + 19, 480, 1, b.ink(PAL.N2));
  const t = new Buf(240, 12, TR);
  pt(t, txt, COUNTER_AT.x / 2, 0, PAL.W7);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 240; i++) {
    const X = i * 2, Y = COUNTER_AT.y + j * 2;
    if (t.c[j * 240 + i] === TR) { if ((i + j) % 2 === 0 && X < 476) b.set(X, Y, PAL.W0); continue; }
    b.set(X, Y, PAL.W8); b.set(X + 1, Y, PAL.W6); b.set(X, Y + 1, PAL.W6); b.set(X + 1, Y + 1, PAL.W5);
  }
};

/** his water glass (the one from his desk), carried: a clear tumbler, its water line, a glint (hand at x, y) */
export const glassInHand = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 9; j++) { b.set(x, y + j, PAL.G6); b.set(x + 4, y + j, PAL.G4); for (let i = 1; i < 4; i++) b.set(x + i, y + j, j > 2 ? (i === 1 ? PAL.C7 : PAL.C6) : PAL.G5); }
  for (let i = 1; i < 4; i++) b.set(x + i, y + 3, PAL.C8);
  rect(x, y + 9, 5, 1, b.ink(PAL.G4));
};
/** the near hand of mas-stand's 'down' arm (local to the sprite's foot, unflipped): where the glass is held */
const MAS_HAND_DOWN: [number, number] = [9, -30];
export const masWithGlass = (b: Buf, footX: number, footY: number, p: Partial<MasStandPose>, o: {flip?: boolean; map?: (c: number) => number} = {}) => {
  drawMasStand(b, footX, footY, {...MAS_STAND_DEFAULT, ...p}, {flip: o.flip, map: o.map});
  const hx = o.flip ? footX - MAS_HAND_DOWN[0] - 4 : footX + MAS_HAND_DOWN[0], hy = footY + MAS_HAND_DOWN[1];
  glassInHand(b, hx, hy);
};

// ------------------------------------------------------------------ the first office at night
export interface Office2018St {
  /** Mas standing (x, legs, flip) with his glass, or walking; null = not in frame */
  mas?: {x: number; y?: number; legs?: MasStandPose['legs']; flip?: boolean} | null;
  alyi?: {x: number; flip?: boolean} | null;
  /** the LED counter sign (on by default) */
  counter?: boolean;
}
/** where the office's pieces are (the wide) */
export const OFFICE = {floorY: 150, wall: {x0: 176, x1: 364, y0: 48, y1: 132}, racks: [376, 424], lone: {x: 14, y: 150}, gerg: {x: 116, y: 150}};
const officeBack = (b: Buf, f: number) => {
  // the page: the back wall's deep navy, the ceiling, the floor boards
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 10 ? PAL.F0 : y < OFFICE.floorY ? PAL.F1 : (y - OFFICE.floorY) % 9 === 0 ? PAL.F1 : PAL.F2);
  // the ceiling's pipes (cut strips)
  paper(b, (t) => { rect(0, 4, 480, 3, t.ink(PAL.F3)); rect(0, 38, 480, 2, t.ink(PAL.F2)); for (const x of [60, 200, 330, 450]) rect(x, 0, 3, 10, t.ink(PAL.F3)); });
  // the warehouse windows at back left: the city at night through them
  paper(b, (t) => {
    const W = {x0: 18, x1: 164, y0: 44, y1: 118};
    rect(W.x0 - 3, W.y0 - 3, W.x1 - W.x0 + 6, W.y1 - W.y0 + 6, t.ink(PAL.F3));
    for (let y = W.y0; y < W.y1; y++) for (let x = W.x0; x < W.x1; x++) t.set(x, y, y < W.y0 + 40 ? PAL.N2 : PAL.U0);
    // the skyline (flat cut shapes) with lit windows
    const bld: Array<[number, number, number]> = [[18, 70, 22], [40, 58, 16], [56, 76, 26], [82, 52, 14], [96, 66, 30], [126, 60, 18], [144, 74, 20]];
    for (const [bx, top, bw] of bld) { rect(bx, top, bw, W.y1 - top, t.ink(PAL.N1)); for (let yy = top + 3; yy < W.y1 - 2; yy += 5) for (let xx = bx + 2; xx < bx + bw - 2; xx += 4) if (hash(xx, yy, 13) < 0.3) t.set(xx, yy, hash(xx, yy, 14) < 0.5 ? PAL.W6 : PAL.W4); }
    for (let x = W.x0; x < W.x1; x += 37) rect(x, W.y0, 3, W.y1 - W.y0, t.ink(PAL.F3));
    rect(W.x0, W.y0 + 34, W.x1 - W.x0, 3, t.ink(PAL.F3));
  });
  // Gerg at his desk at the back (the table sprite, as cut paper), his laptop's green on him
  paperSprite(b, (t) => {
    const G = OFFICE.gerg;
    drawGergTable(t, G.x - 12, G.y - 50, {...GERG_DEFAULT, type: gergTypeAt(f)}, f, {table: (bb, x, y) => { rect(x - 8, y, 64, 3, bb.ink(PAL.D3)); rect(x - 6, y + 3, 2, 14, bb.ink(PAL.N0)); rect(x + 52, y + 3, 2, 14, bb.ink(PAL.N0)); }});
  });
  for (let y = OFFICE.gerg.y - 30; y < OFFICE.gerg.y - 12; y++) for (let x = OFFICE.gerg.x - 20; x < OFFICE.gerg.x + 30; x++) { const d = Math.hypot((x - OFFICE.gerg.x - 4) / 26, (y - OFFICE.gerg.y + 20) / 10); if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, stepColor(b.get(x, y), 1) === b.get(x, y) ? PAL.L1 : PAL.L1); }
  // the lone desk in the far corner: a small monitor lit, a sticky note, a hoodie on the empty chair
  paper(b, (t) => {
    const L = OFFICE.lone;
    rect(L.x, L.y - 18, 46, 3, t.ink(PAL.D3)); rect(L.x + 2, L.y - 15, 2, 15, t.ink(PAL.N0)); rect(L.x + 40, L.y - 15, 2, 15, t.ink(PAL.N0));
    rect(L.x + 12, L.y - 34, 20, 15, t.ink(PAL.P0)); rect(L.x + 14, L.y - 32, 16, 10, t.ink(PAL.L0));
    for (let r = 0; r < 3; r++) rect(L.x + 15, L.y - 31 + r * 3, 6 + ((r * 5) % 9), 1, t.ink(PAL.L3));
    rect(L.x + 20, L.y - 19, 4, 1, t.ink(PAL.P0));
    rect(L.x + 29, L.y - 26, 4, 4, t.ink(PAL.W7));
    // the chair and the hoodie slung over it
    rect(L.x + 44, L.y - 30, 3, 30, t.ink(PAL.N0)); rect(L.x + 44, L.y - 14, 14, 3, t.ink(PAL.N0)); rect(L.x + 56, L.y - 14, 2, 14, t.ink(PAL.N0));
    poly([L.x + 40, L.y - 32, L.x + 50, L.y - 34, L.x + 52, L.y - 20, L.x + 46, L.y - 12, L.x + 41, L.y - 16], t.ink(PAL.G3));
    rect(L.x + 42, L.y - 33, 7, 3, t.ink(PAL.G4));
  });
};
/** the monitor wall: a rolling stand, six screens, a match of ATOD on each (its light on the floor in front) */
const monitorWall = (b: Buf, f: number) => {
  const M = OFFICE.wall, sw = 58, sh = 38;
  paper(b, (t) => {
    rect(M.x0 - 4, M.y0 - 4, M.x1 - M.x0 + 8, M.y1 - M.y0 + 8, t.ink(PAL.N0));
    rect(M.x0 + 20, M.y1 + 4, 3, OFFICE.floorY - M.y1, t.ink(PAL.N0)); rect(M.x1 - 23, M.y1 + 4, 3, OFFICE.floorY - M.y1, t.ink(PAL.N0));
    rect(M.x0 + 8, OFFICE.floorY - 2, 30, 3, t.ink(PAL.N0)); rect(M.x1 - 38, OFFICE.floorY - 2, 30, 3, t.ink(PAL.N0));
  });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) arena(b, M.x0 + 2 + c * (sw + 4), M.y0 + 2 + r * (sh + 4), sw, sh, f + (r * 3 + c) * 5, r * 3 + c + 1);
  // the wall's light on the floor: a pool in the arena's greens and reds, stepping slowly (held on 12s)
  const hue = Math.floor(f / 12) % 3;
  for (let y = OFFICE.floorY; y < RH; y++) for (let x = M.x0 - 40; x < M.x1 + 40; x++) { const d = Math.hypot((x - (M.x0 + M.x1) / 2) / 150, (y - OFFICE.floorY) / 40); if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, hue === 1 ? PAL.U2 : PAL.L1); }
};
/** the racks: two tall cabinets, vents, LEDs stepping on 6s, and the maker's name on them (INVIDIA) */
const racks = (b: Buf, f: number) => {
  paper(b, (t) => {
    for (const rx of OFFICE.racks) {
      rect(rx, 50, 42, OFFICE.floorY - 50, t.ink(PAL.G1)); rect(rx, 50, 42, 2, t.ink(PAL.G2)); rect(rx + 40, 50, 2, OFFICE.floorY - 50, t.ink(PAL.N0));
      for (let u = 0; u < 12; u++) { const yy = 60 + u * 7; rect(rx + 3, yy, 36, 5, t.ink(PAL.N1)); for (let q = 0; q < 6; q++) rect(rx + 5 + q * 5, yy + 2, 3, 1, t.ink(PAL.G2)); }
      // the maker's plate on each door: INVIDIA in raised letters
      rect(rx + 3, 53, 36, 7, t.ink(PAL.N0)); tiny(t, 'INVIDIA', rx + 21 - (tinyWidth('INVIDIA') >> 1), 54, PAL.G6);
    }
  });
  for (const rx of OFFICE.racks) for (let u = 0; u < 12; u++) for (let q = 0; q < 2; q++) if (hash(u, q + rx, Math.floor(f / 6)) < 0.55) b.set(rx + 36 + q * 2, 62 + u * 7, q ? PAL.C6 : PAL.L3);
  // the name again over both, big enough to read from the room: the chips they run on
  const s = 'INVIDIA', x0 = (OFFICE.racks[0] + OFFICE.racks[1] + 42) / 2 - (pw(s) >> 1) - 4;
  rect(x0, 40, pw(s) + 8, 10, b.ink(PAL.N0)); rect(x0, 40, pw(s) + 8, 1, b.ink(PAL.G3));
  pt(b, s, x0 + 4, 42, PAL.P1);
};
/** [W] 13.01 / 13.06: NopeAI's first office at night, June 2018 */
export const office2018 = (b: Buf, f: number, st: Office2018St = {}) => {
  officeBack(b, f);
  racks(b, f);
  monitorWall(b, f);
  if (st.counter !== false) ledCounter(b);
  const wallLit = (side: -1 | 1) => ({rim: [PAL.L3, PAL.W6, PAL.R3][Math.floor(f / 12) % 3], side});
  if (st.alyi) paperSprite(b, (t) => drawAlyiStand(t, st.alyi!.x, 188, {...ALYI_STAND_DEFAULT, arms: 'clasp', light: 'room'}, {flip: st.alyi!.flip}), wallLit(st.alyi.flip ? -1 : 1));
  if (st.mas) paperSprite(b, (t) => masWithGlass(t, st.mas!.x, st.mas!.y ?? 188, {legs: st.mas!.legs ?? 'stand'}, {flip: st.mas!.flip}), st.mas.legs && st.mas.legs !== 'stand' ? {} : wallLit(st.mas.flip ? -1 : 1));
  grain(b, 0, 0, 480, RH, (x, y) => (x >= OFFICE.wall.x0 && x < OFFICE.wall.x1 && y >= OFFICE.wall.y0 && y < OFFICE.wall.y1) || (y >= COUNTER_AT.y - 6 && y < COUNTER_AT.y + 20));
};

// ------------------------------------------------------------------ the 2S, the MCU and the insert (sc 13)
/** the office behind the close setups: the far side of the room, dark, soft (Gerg's green far back, the window's city,
 *  the lone desk's small glow), and the monitor wall's light coming in from frame left */
const officeFar = (b: Buf, f: number, lone = true) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 150 ? (bayer(x, y) < 0.2 ? PAL.F2 : PAL.F1) : bayer(x, y) < 0.3 ? PAL.F2 : PAL.F1);
  paper(b, (t) => {
    rect(250, 30, 180, 70, t.ink(PAL.F3));
    for (let y = 33; y < 97; y++) for (let x = 253; x < 427; x++) t.set(x, y, y < 60 ? PAL.N2 : PAL.U0);
    for (const [bx, top, bw] of [[253, 64, 30], [286, 52, 24], [312, 70, 40], [356, 58, 26], [386, 66, 41]] as Array<[number, number, number]>) { rect(bx, top, bw, 97 - top, t.ink(PAL.N1)); for (let yy = top + 3; yy < 95; yy += 6) for (let xx = bx + 3; xx < bx + bw - 3; xx += 6) if (hash(xx, yy, 23) < 0.3) t.set(xx, yy, PAL.W5); }
    rect(250 + 88, 30, 3, 70, t.ink(PAL.F3));
  });
  if (lone) paper(b, (t) => { rect(420, 118, 34, 3, t.ink(PAL.D2)); rect(428, 104, 16, 12, t.ink(PAL.P0)); rect(430, 106, 12, 8, t.ink(PAL.L1)); rect(440, 112, 3, 3, t.ink(PAL.W6)); });
  for (let y = 108; y < 128; y++) for (let x = 170; x < 240; x++) { const d = Math.hypot((x - 205) / 35, (y - 118) / 10); if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, PAL.L1); }
  // the wall's light from frame left: a wash in the arena's colour of the moment
  const col = [PAL.L1, PAL.U1, PAL.L1][Math.floor(f / 12) % 3];
  for (let y = 0; y < RH; y++) for (let x = 0; x < 120; x++) if (bayer(x, y) < (1 - x / 120) * 0.45) b.set(x, y, col);
  grain(b);
};
/** a bust as cut paper, lit from frame left by the arena (its rim in the colour of the moment); `face` steps the lit
 *  side of the face up (the face light) */
const paperBust = (b: Buf, img: import('../../../../../shared/pixel/figure').Img, x: number, y: number, f: number, o: {flip?: boolean; face?: number; rimSide?: -1 | 1} = {}) => {
  const rim = [PAL.L3, PAL.W6, PAL.R3][Math.floor(f / 12) % 3];
  paperSprite(b, (t) => putBust(t, img, x, y, {flip: o.flip}), {rim, side: o.rimSide ?? -1});
  if (o.face) faceKey(b, x, y, x + img.w, y + 100, o.face, o.rimSide ?? -1);
};
export interface Office2SSt { alyi: Partial<AlyiSpeakState>; alyiFlip?: boolean; mas: Partial<MasPortraitState> }
/** [2S] 13.02 / 13.04: Alyi (left) and Mas (right) facing the monitor wall off frame left, its light on them */
export const office2S = (b: Buf, f: number, st: Office2SSt) => {
  officeFar(b, f);
  paperBust(b, alyiSpeakPortrait({...ALYI_SPEAK_DEFAULT, t: f, ...st.alyi}), 34, 44, f, {flip: st.alyiFlip, face: 1, rimSide: st.alyiFlip ? 1 : -1});
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', ...st.mas};
  paperBust(b, masPortrait(ms), 262, 38, f, {face: 1});
  paper(b, (t) => drawCollarsPortrait(t, 262, 38, 2, {head: ms.head ?? '34', light: 'warm', style: 'v31'}), 0);
};
/** [MCU] 13.03: Alyi alone, lit by the arena: happy not to know */
export const alyiMcu2018 = (b: Buf, f: number, s: Partial<AlyiSpeakState>) => {
  officeFar(b, f, false);
  paperBust(b, alyiSpeakPortrait({...ALYI_SPEAK_DEFAULT, t: f, ...s}), 150, 36, f, {face: 1});
};
/** [INSERT] 13.05: the lone desk: a small monitor finishing a sentence badly, a sticky note, a hoodie on the chair */
export const loneDesk = (b: Buf, f: number, k: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 150 ? PAL.F1 : bayer(x, y) < 0.4 ? PAL.D2 : PAL.D1);
  paper(b, (t) => { rect(0, 148, 480, 4, t.ink(PAL.D3)); }, 1);
  // the monitor: a beige box (2018's spare), its screen a terminal
  paper(b, (t) => {
    rect(132, 18, 236, 134, t.ink(PAL.P0)); rect(132, 18, 236, 2, t.ink(PAL.P1)); rect(366, 18, 2, 134, t.ink(PAL.G4));
    rect(146, 30, 208, 104, t.ink(PAL.N0));
    rect(226, 152, 48, 6, t.ink(PAL.P0)); rect(210, 158, 80, 4, t.ink(PAL.P0));
  }, 2);
  for (let y = 31; y < 133; y += 2) for (let x = 147; x < 353; x++) b.set(x, y, PAL.N1);
  const out = 'the cat sat on the the mat of the';
  pt(b, '> sample --len 12', 154, 40, PAL.L1);
  pt(b, out, 154, 54, PAL.L3);
  if (Math.floor(k / 10) % 2 === 0) rect(154 + pw(out) + 3, 54, 5, 8, b.ink(PAL.L3));
  // the green light on the room round it
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 250) / 280, (y - 80) / 170); if (d < 1 && bayer(x, y) < (1 - d) * 0.25 && (x < 132 || x > 368 || y > 158)) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // the sticky note on the bezel
  paper(b, (t) => {
    rect(310, 104, 84, 36, t.ink(PAL.W7)); rect(310, 104, 84, 2, t.ink(PAL.W8)); rect(388, 134, 6, 6, t.ink(PAL.W6));
    pt(t, 'text?', 316, 110, PAL.N2); pt(t, '(side project)', 316, 124, PAL.N2);
  }, 1);
  // the empty office chair in the foreground at left (its back, the seat, the stem), a grey hoodie slung over the back:
  // the hood hanging over the top, the drawstrings, the front pocket, one sleeve dangling to the seat
  paper(b, (t) => {
    rect(40, 164, 64, 8, t.ink(PAL.N1)); rect(68, 172, 8, 31, t.ink(PAL.N0));
    for (let j = 0; j < 80; j++) for (let i = 0; i < 70; i++) { const cx = Math.min(i, 69 - i), cy = Math.min(j, 79 - j); if (cx + cy < 6) continue; t.set(36 + i, 84 + j, j < 3 ? PAL.N2 : PAL.N1); }
  }, 2);
  paper(b, (t) => {
    // the body of the hoodie over the chair's back
    for (let j = 0; j < 70; j++) for (let i = 0; i < 76; i++) { const w0 = 2 + Math.round(j * 0.08); if (i < w0 || i > 75 - w0) continue; t.set(33 + i, 92 + j, i < w0 + 3 ? PAL.G2 : j > 60 ? PAL.G2 : PAL.G3); }
    // the hood, hanging over the top edge toward us: a rounded flap, its lining in shadow
    for (let j = 0; j < 30; j++) for (let i = 0; i < 44; i++) { const d = Math.hypot((i - 22) / 22, (j - 2) / 28); if (d < 1) t.set(50 + i, 80 + j, d > 0.8 ? PAL.G2 : j < 10 ? PAL.G1 : PAL.G4); }
    // the drawstrings and the pocket
    rect(64, 110, 1, 18, t.ink(PAL.P1)); rect(78, 110, 1, 16, t.ink(PAL.P1)); rect(58, 138, 36, 14, t.ink(PAL.G2)); rect(58, 138, 36, 1, t.ink(PAL.G4));
    // a sleeve down the side to the seat, its cuff
    for (let j = 0; j < 70; j++) { const x0 = 26 + Math.round(j * 0.12); rect(x0, 98 + j, 12, 1, t.ink(j > 64 ? PAL.G2 : PAL.G3)); t.set(x0, 98 + j, PAL.G4); }
  }, 1);
  grain(b, 0, 0, 480, RH, (x, y) => x >= 146 && x < 354 && y >= 30 && y < 134);
};

// ================================================================== sc 18: the window
/** the dusk outside the bullpen's window (the medium panorama's window rect, or any rect): plum sky warming to the
 *  horizon, the city's cut-out blocks with their first lights, the bay's last light */
const duskView = (b: Buf, x0: number, y0: number, x1: number, y1: number, night = 0) => {
  const hz = y0 + Math.round((y1 - y0) * 0.62);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = (y - y0) / Math.max(1, hz - y0) + (bayer(x, y) - 0.5) * 0.18;
    let c = y >= hz ? (bayer(x, y) < 0.3 ? PAL.U1 : PAL.N2) : night ? (t < 0.6 ? PAL.N1 : PAL.N2) : t < 0.35 ? PAL.U1 : t < 0.62 ? PAL.U2 : t < 0.85 ? PAL.U3 : PAL.U4;
    if (!night && y >= hz && y < hz + 3 && bayer(x, y) < 0.5) c = PAL.W4;
    b.set(x, y, c);
  }
  for (let x = x0; x <= x1; x++) {
    const hgt = Math.round(8 + 10 * hash(Math.floor((x - x0) / 9), 1, 17) + 6 * hash(Math.floor((x - x0) / 23), 2, 17));
    for (let y = hz - hgt; y < hz; y++) b.set(x, y, night ? PAL.N1 : PAL.U0);
    for (let y = hz - hgt + 2; y < hz - 1; y += 3) if (hash(x, y, 19) < (night ? 0.25 : 0.12) && x % 2 === 0) b.set(x, y, night ? PAL.W6 : PAL.W5);
  }
};
/** Gerg's marker line on the glass: CHATGTP's users, one fixed steep curve (Gerg's green, a darker underside) from its
 *  base up to yEnd (far above the glass), drawn from the base up to `reveal` (y): extending it reveals more of the same
 *  curve, it never reshapes; a few ticks along the base */
const LINE_K = 2.6;
const lineAt = (x0: number, yBase: number, x1: number, yEnd: number, u: number): [number, number] =>
  [Math.round(x0 + (x1 - x0) * (1 - Math.pow(1 - u, 0.35))), Math.round(yBase - (yBase - yEnd) * Math.pow(u, LINE_K))];
/** where the curve reaches height y (its tip when revealed to y) */
export const lineTip = (x0: number, yBase: number, x1: number, yEnd: number, y: number): [number, number] => {
  const u = Math.pow(clamp((yBase - y) / (yBase - yEnd), 0, 1), 1 / LINE_K);
  return lineAt(x0, yBase, x1, yEnd, u);
};
export const usersLine = (b: Buf, x0: number, yBase: number, x1: number, yEnd: number, reveal: number, col = PAL.L3, under = PAL.L1, clipY = 0, ticks = true) => {
  let px = -1, py = -1;
  const dot = (x: number, y: number) => { for (const [dx, dy, c] of [[0, 0, col], [1, 0, col], [0, 1, under]] as Array<[number, number, number]>) { const X = x + dx, Y = y + dy; if (Y >= 0 && Y < RH && X >= 0 && X < 480) b.set(X, Y, c); } };
  for (let i = 0; i <= 600; i++) {
    const u = i / 600, [x, y0] = lineAt(x0, yBase, x1, yEnd, u), y = Math.round(y0 + Math.sin(i * 0.9) * 0.4);
    if (y < reveal || y < clipY) break;
    // join a gap to the last point (the curve's flat end moves several pixels a step): whole pixels along the chord
    if (px >= 0 && Math.max(Math.abs(x - px), Math.abs(y - py)) > 1) { const n = Math.max(Math.abs(x - px), Math.abs(y - py)); for (let j = 1; j < n; j++) dot(Math.round(px + (x - px) * j / n), Math.round(py + (y - py) * j / n)); }
    dot(x, y); px = x; py = y;
  }
  if (ticks) for (let k = 0; k < 5; k++) { const x = x0 + k * Math.round((x1 - x0) / 5); rect(x, yBase + 3, 1, 4, b.ink(col)); }
};
export interface WindowGlassSt { marker: number; hand: boolean; f: number }
/** [INSERT] 18.01's open: the bullpen window's glass, close: the city at dusk beyond, the users line in Gerg's green,
 *  the clipping taped to it (the headline legible), the paid plan in Rima's red; Gerg's hand extends the line up and
 *  off the top of the glass (`marker` 0..1 of the stroke) */
export const windowGlass = (b: Buf, st: WindowGlassSt) => {
  duskView(b, 0, 0, 479, RH - 1);
  // the mullion at the right edge and the sill at the foot
  rect(440, 0, 8, RH, b.ink(PAL.N3)); rect(440, 0, 2, RH, b.ink(PAL.N4)); rect(0, 188, 480, 15, b.ink(PAL.N3)); rect(0, 188, 480, 2, b.ink(PAL.N5));
  // the glass's faint reflections: the bullpen's lamps, a sheen
  for (let y = 0; y < 188; y++) for (let x = 0; x < 440; x++) { const u = (x + y * 0.6) % 190; if (u > 60 && u < 63 && bayer(x, y) < 0.5) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // the line: drawn before today up to y 44; Gerg's stroke carries it on up and off the top
  const top = Math.round(44 - st.marker * 120);
  usersLine(b, 40, 170, 346, -90, top);
  pt(b, 'USERS', 46, 176, PAL.L3);
  // the clipping, taped at the lower right: the headline's words (no figure)
  const cx = 312, cy = 118;
  rect(cx + 3, cy + 3, 124, 58, b.ink(PAL.U0)); rect(cx, cy, 124, 58, b.ink(PAL.P1)); rect(cx, cy, 124, 1, b.ink(PAL.P2));
  ['CHATGTP SETS RECORD', 'FOR FASTEST-GROWING', 'USER BASE'].forEach((l, i) => pt(b, l, cx + 6, cy + 6 + i * 10, PAL.N1));
  for (let r = 0; r < 3; r++) rect(cx + 6, cy + 38 + r * 5, 104 - r * 18, 2, b.ink(PAL.P0));
  for (const [tx, ty] of [[cx - 4, cy - 3], [cx + 108, cy - 3]] as Array<[number, number]>) { rect(tx, ty, 20, 7, b.ink(PAL.P2)); rect(tx, ty + 6, 20, 1, b.ink(PAL.P0)); }
  // the paid plan, in Rima's red marker beside the line, an arrow to it
  const px = 196, py = 100;
  bpt(b, 'PLUS · $20', px, py, PAL.R3);
  const [ax, ay] = lineTip(40, 170, 346, -90, 118);
  line(px - 4, py + 6, ax + 6, ay, b.ink(PAL.R3)); line(ax + 6, ay, ax + 12, ay - 2, b.ink(PAL.R3)); line(ax + 6, ay, ax + 10, ay + 4, b.ink(PAL.R3));
  // Gerg's hand at the stroke's end: the marker's tip on the glass at the line's end, his fist round the marker, the
  // forearm down and away to the frame's right edge, his navy tee's sleeve at the edge
  if (st.hand && top > -30) {
    const [tx, ty] = lineTip(40, 170, 346, -90, top), R = SKIN[1];
    // the marker: from the tip down-right, his green, a cap end
    for (let i = 0; i < 16; i++) { const X = tx + 2 + Math.round(i * 0.8), Y = ty + 2 + i; b.set(X, Y, PAL.L2); b.set(X + 1, Y, PAL.L3); b.set(X + 2, Y, PAL.L1); }
    b.set(tx, ty, PAL.L3); b.set(tx + 1, ty + 1, PAL.L3);
    // the fist round it (seen from the side: knuckles, the thumb over the marker)
    const fx = tx + 8, fy = ty + 8;
    for (let j = 0; j < 14; j++) for (let i = 0; i < 16; i++) { const d = Math.hypot((i - 8) / 8, (j - 7) / 7); if (d < 1) b.set(fx + i, fy + j, d > 0.85 ? R[0] : j < 4 ? R[3] : i > 11 ? R[1] : R[2]); }
    for (let q = 0; q < 3; q++) rect(fx + 2, fy + 4 + q * 3, 5, 1, b.ink(R[0]));
    // the forearm to the frame's right edge (a tapering band), the sleeve's hem at the edge
    for (let i = 0; i < 480; i++) {
      const X = fx + 10 + Math.round(i * 0.62), Y0 = fy + 6 + i, hw = 4 + Math.round(i * 0.015);
      if (X >= 480 || Y0 - hw >= RH) break;
      for (let j = -hw; j <= hw; j++) { const Y = Y0 + j; if (Y < 0 || Y >= RH) continue; const sleeve = Y0 > fy + 110; b.set(X, Y, j === -hw ? (sleeve ? PAL.N5 : R[3]) : j === hw ? (sleeve ? PAL.N2 : R[0]) : sleeve ? PAL.N4 : R[2]); }
    }
  }
};
/** the medium panorama's window at dusk (or night), the line on it: the setting for 18.01's wide, 18.02, 18.03 */
export const bullpenWindow = (b: Buf, night: boolean, markerTop: number) => {
  launchBackM(b, 0, {alyi: 'gone', warm: 1, underlines: 3});
  const w = LAUNCH_M.win;
  duskView(b, w.x0, w.y0, w.x1, w.y1, night ? 1 : 0);
  rect(Math.round((w.x0 + w.x1) / 2) - 1, w.y0, 4, w.y1 - w.y0 + 1, b.ink(PAL.N3)); rect(w.x0, w.y0 + 58, w.x1 - w.x0 + 1, 2, b.ink(PAL.N3));
  usersLine(b, w.x0 + 10, w.y1 - 12, w.x1 - 16, w.y0 - 60, markerTop, night ? PAL.L2 : PAL.L3, PAL.L1, w.y0 - 6);
  // the clipping, small, and the paid plan in red on the glass
  rect(w.x1 - 46, w.y1 - 30, 34, 20, b.ink(PAL.P1)); for (let r = 0; r < 4; r++) rect(w.x1 - 43, w.y1 - 27 + r * 4, 26 - (r % 2) * 8, 1, b.ink(PAL.N2));
  if (!night) {
    // dusk's warm light through the glass onto the room round the window (whole rungs, dithered)
    for (let y = 0; y < RH; y++) for (let x = 0; x < 300; x++) { const d = Math.hypot((x - 110) / 190, (y - 110) / 140); if (d < 1 && bayer(x, y) < (1 - d) * 0.45 && (x < w.x0 || x > w.x1 || y < w.y0 || y > w.y1)) b.set(x, y, stepColor(b.get(x, y), 1)); }
  }
};
export interface WindowWideSt { f: number; laugh?: boolean; mouths?: {RIMA?: 'open' | 'rest'; MAS?: 'open' | 'rest' | 'smile'} }
/** [W] 18.01 (after the glass) and the laugh: the four of them at the window at dusk (the room sprites, backlit) */
export const windowWide = (b: Buf, st: WindowWideSt) => {
  const f = st.f;
  bullpenWindow(b, false, -20);
  const bob = st.laugh ? (Math.floor(f / 4) % 2) : 0;
  const bobMap = (d: number) => (t: Buf, draw: (tt: Buf) => void) => { const tmp = new Buf(480, RH, TR); draw(tmp); for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const v = tmp.c[y * 480 + x]; if (v === TR) continue; const Y = y < 150 ? y + d : y; if (Y < RH) t.set(x, Y, v); } };
  const lay = (draw: (t: Buf) => void, d: number) => { const t = new Buf(480, RH, TR); bobMap(d)(t, draw); put(b, t, 0, 0); };
  // Gerg by the glass, looking up at his line, the marker still in his near hand; Alyi and Rima over his laptop;
  // Mas by the hall's light
  lay((t) => drawGergStand(t, 132, 194, {...GERG_STAND_DEFAULT, look: 'up', mouth: st.laugh ? 'open' : 'rest'}), bob);
  lay((t) => drawAlyiStand(t, 230, 196, {...ALYI_STAND_DEFAULT, arms: 'clasp', light: 'room', mouth: st.laugh ? 'open' : 'rest'}), st.laugh ? 1 - bob : 0);
  // Alyi's laptop, open in his hands, its screen toward her
  rect(240, 150, 16, 2, b.ink(PAL.G3)); poly([246, 150, 258, 150, 260, 138, 250, 138], b.ink(PAL.G1)); rect(257, 139, 1, 11, b.ink(PAL.C6));
  lay((t) => drawRimaStand(t, 290, 196, {...RIMA_STAND_DEFAULT, body: st.laugh ? 'stand' : 'lean', head: st.laugh ? 'face' : 'down', mouth: st.mouths?.RIMA ?? (st.laugh ? 'open' : 'rest')}, {flip: true}), bob);
  lay((t) => drawMasStand(t, 380, 196, {...MAS_STAND_DEFAULT, mouth: st.mouths?.MAS ?? (st.laugh ? 'smile' : 'rest')}, {flip: true}), st.laugh ? 1 - bob : 0);
};
/** [2S] 18.02: Mas (left, turned to her) and Rima (right, turned to him) at the window at dusk, the line behind them */
export const window2S = (b: Buf, f: number, st: {mas: Partial<MasPortraitState>; rima: Partial<RimaPortraitState>}) => {
  bullpenWindow(b, false, -20);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.5) { const c = b.get(x, y); b.set(x, y, stepColor(c, lightness(c) > 0.35 ? -1 : lightness(c) < 0.1 ? 1 : 0)); }
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0, ...st.mas};
  const mt = new Buf(480, RH, TR);
  putBust(mt, masPortrait(ms), 40, 40);
  drawCollarsPortrait(mt, 40, 40, 3, {head: ms.head ?? '34', light: 'warm', style: 'v31'});
  for (let y = 0; y < RH; y++) for (let x = 40; x < 152; x++) { const v = mt.c[y * 480 + x]; if (v !== TR) b.set(191 - x, y, v); }
  faceKey(b, 40, 40, 152, 140, 1, 1);
  putBust(b, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, ...st.rima}), 300, 44, {flip: true});
  faceKey(b, 300, 44, 412, 140, 1, -1);
  // the window's sill across the frame's foot in front of them (they stand at it): its lit top edge, its dark face
  const top = 176;
  for (let y = top; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === top ? PAL.U3 : y < top + 3 ? PAL.N4 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
  void f;
};
/** [W] 18.03: the others gone home; Mas at his end desk under one lamp, the line in the dark glass behind him; on
 *  `open` he opens a blank page (his laptop's light comes up on him) */
export const windowLamp = (b: Buf, f: number, open: number) => {
  bullpenWindow(b, true, -20);
  for (let y = 0; y < RH; y++) for (let x = 200; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  const ms: MasMediumState = {...MAS_MEDIUM_DEFAULT, light: open ? 'monitor' : 'warm', look: -1, head: '34'};
  const mx = 300, my = 60;
  drawMasMedium(b, mx, my, ms, {desk: (bb) => {
    for (let y = my + MAS_M_DESK; y < RH; y++) for (let x = 190; x < 480; x++) bb.set(x, y, y === my + MAS_M_DESK ? PAL.G4 : y < my + MAS_M_DESK + 3 ? PAL.G3 : y < my + MAS_M_DESK + 5 ? PAL.G2 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
  }});
  const dy = my + MAS_M_DESK;
  deskLampM(b, 430, dy - 30);
  for (let y = dy; y < RH; y++) for (let x = 330; x < 480; x++) { const d = Math.hypot((x - 450) / 120, (y - dy) / 40); if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // his laptop on the desk (the lid's back to us), opening on `open`: the screen's cyan edge and its light on him
  const lx = 262, ly = dy + 2;
  if (open) { poly([lx, ly, lx + 26, ly, lx + 24, ly - 16, lx + 2, ly - 16], b.ink(PAL.G1)); rect(lx + 2, ly - 16, 22, 1, b.ink(PAL.G3)); rect(lx + 25, ly - 15, 1, 15, b.ink(PAL.C6)); faceKey(b, mx, my, mx + 84, my + 50, 1, -1); }
  else { poly([lx, ly + 2, lx + 26, ly + 2, lx + 28, ly + 5, lx - 2, ly + 5], b.ink(PAL.G1)); rect(lx, ly + 2, 26, 1, b.ink(PAL.G3)); }
  void f;
};

// ================================================================== sc 19: the vision post
export const VISION = {
  title: 'Planning for AGI and beyond',
  p: [
    'Our mission is to ensure that artificial general intelligence—AI systems that are generally smarter than humans—benefits all of humanity.',
    '…a gradual transition to a world with AGI is better than a sudden one.',
    '…perhaps the most important—and hopeful, and scary—project in human history.',
  ],
};
/** the editor's page in a screen rect: the toolbar and Publish, the title (typed n chars), the body's passages (each
 *  typed to its n; earlier ones dimmed, scrolled up); `scale` 1 in the laptop, the page's own layout full frame */
export interface EditorSt { title: number; passages?: number[]; dim?: number; scroll?: number; publish?: 0 | 1 | 2 }
export const editorPage = (b: Buf, S: Rect, st: EditorSt) => {
  const full = S.w > 400;
  // full frame the page is a rung down (P1): the cut from the dark room to a whole-frame page is softer
  const t = new Buf(S.w, S.h, full ? PAL.P1 : PAL.P2);
  rect(0, 0, S.w, full ? 18 : 12, t.ink(full ? PAL.P0 : PAL.P1)); rect(0, full ? 18 : 12, S.w, 1, t.ink(full ? PAL.G5 : PAL.P0));
  pt(t, 'New post', 6, full ? 5 : 2, PAL.G3);
  const pbw = pw('Publish') + 12, pbx = S.w - pbw - 6;
  rect(pbx, full ? 3 : 1, pbw, full ? 12 : 10, t.ink(st.publish === 1 ? PAL.C7 : st.publish === 2 ? PAL.G5 : PAL.C4));
  pt(t, st.publish === 2 ? 'Published' : 'Publish', pbx + 6 - (st.publish === 2 ? 6 : 0), full ? 5 : 2, PAL.P2);
  let y = (full ? 28 : 18) - (st.scroll ?? 0);
  const title = VISION.title.slice(0, st.title);
  if (full) { bpt(t, title, 16, y, PAL.N1); y += 26; }
  else { const rows = [title.slice(0, 16), title.slice(16)].filter((r) => r.length); rows.forEach((r, i) => bpt(t, r.trim(), 10, y + i * 16, PAL.N1)); y += 36; }
  if (st.title < VISION.title.length && st.title > 0 && !full) rect(10 + bpw(title.slice(16) ? title.slice(16).trim() : title) + 2, y - 20, 1, 12, t.ink(PAL.C4));
  (st.passages ?? []).forEach((n, i) => {
    const s = VISION.p[i].slice(0, n);
    const rows = pwrap(s, S.w - (full ? 40 : 20));
    const col = i < (st.dim ?? 0) ? (full ? PAL.G4 : PAL.P0) : PAL.N1;
    rows.forEach((r, j) => pt(t, r, full ? 18 : 10, y + j * 11, col));
    if (n < VISION.p[i].length && rows.length) rect((full ? 18 : 10) + pw(rows[rows.length - 1]) + 1, y + (rows.length - 1) * 11, 1, 8, t.ink(PAL.C4));
    y += rows.length * 11 + 8;
  });
  put(b, t, S.x, S.y);
};
/** his laptop at night, from above his hands (gerg-laptop's POV frame, the room dark, his cuffs in the screen's light) */
export const editorPOV = (b: Buf, f: number, lid: 0 | 1 | 2, hands: boolean, screen: (S: Rect) => void) => {
  drawGergLaptopPOV(b, f, {place: 'bullpen', lid, screen: 'dark', hands, f});
  const S = GERG_LAPTOP.screen;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (lid === 0 && x >= S.x && x < S.x + S.w && y >= S.y && y < S.y + S.h) continue;
    const c = b.get(x, y);
    b.set(x, y, c === PAL.L2 ? PAL.C3 : c === PAL.L3 ? PAL.C4 : stepColor(c, familyOf(c)?.[0] === 'S' ? 0 : -2));
  }
  if (lid === 0) screen({x: S.x, y: S.y, w: S.w, h: S.h});
};
/** his feed after Publish: his post at the top, then a rival's, the same day */
export const feedAfter = (b: Buf, S: Rect, k: number, atemK: number) => {
  const t = new Buf(S.w, S.h, PAL.N1);
  rect(0, 0, S.w, 10, t.ink(PAL.N3)); pt(t, 'Home', 5, 1, PAL.P1);
  const h1 = feedPost(t, 6, 16, S.w - 12, {name: 'Mas Manalt', handle: '@masa', text: 'Planning for AGI and beyond', ts: 'FEB 24', av: 'mas'}, {k});
  if (atemK >= 0) feedPost(t, 6, 16 + h1 + 8, S.w - 12, {name: 'ATEM', handle: '@atem', text: 'ATEM · A NEW MODEL · FOR RESEARCHERS ONLY', ts: 'FEB 24', av: 'atem'}, {k: atemK, bg: PAL.N3});
  put(b, t, S.x, S.y);
};

// ================================================================== sc 22: Elgoog's waitlist on the bullpen's wall TV
/** [SCR] the wall TV, DRAB's page: the name in Elgoog's skewed primaries, a velvet rope across it (slack, then taut on
 *  `snap`), JOIN THE WAITLIST; past the TV's edge, the window's users line far above it */
export const waitlistTV = (b: Buf, f: number, snap: number) => {
  // the day bullpen's wall, and the window at right with the line going off its top
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.3 ? PAL.G4 : PAL.G3);
  const wx0 = 372;
  rect(wx0 - 4, 0, 112, RH, b.ink(PAL.G2));
  for (let y = 0; y < RH; y++) for (let x = wx0; x < 480; x++) b.set(x, y, y < 120 ? (bayer(x, y) < 0.5 ? PAL.F5 : PAL.F6) : PAL.F4);
  for (let x = wx0; x < 480; x++) { const hgt = 10 + Math.floor(hash(Math.floor(x / 11), 3, 29) * 18); for (let y = 120 - hgt; y < 120; y++) b.set(x, y, PAL.F4); }
  usersLine(b, wx0 + 4, 196, 476, -60, -60, PAL.L3, PAL.L1, 0);
  // the TV: bezel, the page
  const tx = 20, ty = 14, tw = 330, th = 176;
  rect(tx - 6, ty - 6, tw + 12, th + 12, b.ink(PAL.N0)); rect(tx - 5, ty - 5, tw + 10, 1, b.ink(PAL.G2));
  for (let y = ty; y < ty + th; y++) for (let x = tx; x < tx + tw; x++) b.set(x, y, PAL.P2);
  const name = 'DRAB', cols = [PAL.C5, PAL.U4, PAL.F5, PAL.W6];
  let cx = tx + ((tw - (pw(name) + 3) * 4) >> 1);
  for (let i = 0; i < 4; i++) {
    const g = new Buf(8, 10, TR); pt(g, name[i], 0, 0, cols[i]);
    for (let j = 0; j < 10; j++) for (let q = 0; q < 8; q++) if (g.c[j * 8 + q] !== TR) rect(cx + q * 4, ty + 22 + j * 4, 4, 4, b.ink(cols[i]));
    cx += (pw(name[i]) + 2) * 4;
  }
  // the velvet rope between two brass stanchions, in front of the button
  const s1 = tx + 50, s2 = tx + tw - 58, ry = ty + 96;
  for (const sx of [s1, s2]) { rect(sx - 2, ry - 6, 5, 4, b.ink(PAL.W7)); rect(sx - 1, ry - 2, 3, 48, b.ink(PAL.W6)); rect(sx, ry - 2, 1, 48, b.ink(PAL.W8)); rect(sx - 7, ry + 46, 15, 4, b.ink(PAL.W5)); }
  const taut = f >= snap;
  for (let x = s1 + 2; x <= s2 - 2; x++) { const u = (x - s1) / (s2 - s1), sag = taut ? 0 : Math.round(Math.sin(u * Math.PI) * 14); for (let j = 0; j < 3; j++) b.set(x, ry - 3 + sag + j, j === 0 ? PAL.R3 : PAL.R2); }
  const lbl = 'JOIN THE WAITLIST', bw = pw(lbl) + 20, bx = tx + ((tw - bw) >> 1), by = ry + 20;
  rect(bx, by, bw, 16, b.ink(PAL.F5)); rect(bx, by, bw, 1, b.ink(PAL.F6)); pt(b, lbl, bx + 10, by + 4, PAL.P2);
  // the screen's sheen
  for (let j = ty; j < ty + th; j++) { const i = 60 + Math.round((j - ty) * 0.7); if (bayer(tx + i, j) < 0.5) b.set(tx + i, j, stepColor(b.get(tx + i, j), -1)); }
};

// ================================================================== v3.5b (sc 22A): the usage flash
/** [INSERT] v35-22.02: every chatbot just shown, its usage climbing at once (a chart of its own, no product's UI, no
 *  figures): CHATGTP's line is Gerg's green marker line from the window past the TV (22.01's, the same curve in the same
 *  place: the match), already off the top; GNIB, DRAB, CLOD and ATEM · LEAKED rise under it from the counters' mark
 *  (`c0`), each in its own colour, a spinning count at its head */
export const usageFlash = (b: Buf, f: number, k: number, c0: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x % 40 === 0 || y % 34 === 0) ? PAL.N2 : bayer(x, y) < 0.12 ? PAL.N2 : PAL.N1);
  rect(0, 196, 480, 1, b.ink(PAL.N4));
  const t = (i: number) => clamp((k - c0 - i * 2) / 34, 0, 1);
  const lines: Array<[string, number, number, number, number, number]> = [
    // name, colour, underside, x0, the head's x, the height its head reaches (stacked apart so every label reads)
    ['GNIB', PAL.F6, PAL.F3, 20, 318, 96],
    ['CLOD', PAL.W5, PAL.W3, 20, 282, 122],
    ['DRAB', PAL.U4, PAL.U2, 20, 246, 148],
    ['ATEM · LEAKED', PAL.P1, PAL.P0, 20, 210, 172],
  ];
  lines.forEach(([name, col, under, x0, x1, top], i) => {
    const reveal = Math.round(196 - (196 - top) * t(i));
    if (reveal >= 195) return;
    usersLine(b, x0, 196, x1, top, reveal, col, under, 0, false);
    const [hx, hy] = lineTip(x0, 196, x1, top, reveal);
    pt(b, name, hx + 6, hy - 9, col);
    drawOdometer(b, hx + 6 + pw(name) + 4, hy - 10, {size: 'plate', value: 1000 + Math.floor(t(i) * 90000), digits: 6, spin: 1, f});
  });
  // CHATGTP: the window's line (22.01's), already off the top; its name and count riding it near the top
  usersLine(b, 376, 196, 476, -60, -60, PAL.L3, PAL.L1, 0);
  if (k >= c0) {
    const [lx, ly] = lineTip(376, 196, 476, -60, 30);
    pt(b, 'CHATGTP', lx - 52, ly + 2, PAL.L3);
    drawOdometer(b, lx - 52, ly + 11, {size: 'plate', value: 999999, digits: 6, spin: 1, f});
  }
};

// ================================================================== sc 23: two hands, one frame
/** [ECU] 12.02's cut-in: his desk top under the lamp from above: his left hand signing PAUSE on the clipboard, his
 *  right hand stamping FILED on ZAI CORP.'s papers (`stamp`: 0 up · 1 down · 2 lifting; `filed` how many imprints; the
 *  top sheet slides off between them) */
export const filedECU = (b: Buf, f: number, st: {sign: number; stamp: 0 | 1 | 2; filed: number; slide: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 170) / 300, (y - 80) / 200); b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.8 ? PAL.D3 : bayer(x, y) < 0.3 ? PAL.D1 : PAL.D2); }
  // the clipboard (left): the letter's header and 6 MONTHS, the signature line, his scribble growing
  rect(28, 14, 170, 190, b.ink(PAL.D4)); rect(34, 22, 158, 180, b.ink(PAL.P1)); rect(90, 8, 46, 14, b.ink(PAL.G4)); rect(92, 10, 42, 3, b.ink(PAL.G6));
  pt(b, 'PAUSE GIANT AI', 44, 34, PAL.N1); pt(b, 'EXPERIMENTS', 44, 44, PAL.N1); pt(b, '6 MONTHS', 44, 58, PAL.R2);
  for (let r = 0; r < 6; r++) rect(44, 74 + r * 8, 130 - (r % 3) * 20, 2, b.ink(PAL.P0));
  rect(44, 150, 120, 1, b.ink(PAL.N3));
  const n = Math.round(clamp(st.sign, 0, 1) * 60);
  for (let i = 0; i < n; i++) { const x = 50 + i * 1.8, y = 146 - Math.round(Math.sin(i * 0.5) * 5 + (i > 40 ? (i - 40) * 0.3 : 0)); b.set(Math.round(x), y, PAL.N0); b.set(Math.round(x) + 1, y, PAL.N1); }
  // his left hand with the pen at the scribble's end
  const px = 50 + Math.round(n * 1.8), py = 140;
  const R = SKIN[0];
  for (let y = py + 6; y < RH; y++) { const t = (y - py - 6) / (RH - py), cx = px - 20 - Math.round(t * 30), hw = 12 + Math.round(t * 6); for (let x = cx - hw; x <= cx + hw; x++) b.set(x, y, y > py + 34 ? (x < cx - hw + 2 ? PAL.N3 : PAL.N2) : x < cx - hw + 2 ? R[1] : R[2]); }
  line(px, py, px - 14, py + 16, b.ink(PAL.N0)); line(px + 1, py, px - 13, py + 16, b.ink(PAL.G4));
  // the papers (right): ZAI CORP.'s articles, the top sheet sliding away between the two stamps
  const sx = 268, sy = 24;
  rect(sx + 4, sy + 4, 176, 170, b.ink(PAL.P0)); rect(sx + 2, sy + 2, 176, 170, b.ink(PAL.P1));
  const sheet = (ox: number, imprint: boolean) => {
    rect(sx + ox, sy, 176, 170, b.ink(PAL.P2)); rect(sx + ox, sy, 176, 1, b.ink(PAL.P1));
    pt(b, 'ZAI CORP.', sx + ox + 12, sy + 12, PAL.N1);
    pt(b, 'ARTICLES OF INCORPORATION', sx + ox + 12, sy + 24, PAL.N1);
    pt(b, 'NEVADA', sx + ox + 12, sy + 36, PAL.N1);
    for (let r = 0; r < 8; r++) rect(sx + ox + 12, sy + 54 + r * 9, 140 - (r % 3) * 24, 2, b.ink(PAL.P0));
    if (imprint) { const iw = pw('FILED') * 2 + 14, ix = sx + ox + 34 + ((76 - iw) >> 1), iy = sy + 88; rect(ix, iy, iw, 22, b.ink(PAL.R2)); rect(ix + 2, iy + 2, iw - 4, 18, b.ink(PAL.P2)); pt2(b, 'FILED', ix + 7, iy + 4, PAL.R2); }
  };
  if (st.filed >= 1 && st.slide < 1) sheet(Math.round(st.slide * 190), true);
  if (st.slide > 0 || st.filed >= 2) sheet(0, st.filed >= 2);
  if (st.filed === 0) sheet(0, false);
  // his right hand and the stamp, coming in from frame right: up, down on the sheet (where FILED lands), lifting
  const hx = sx + 34, hy = [70, 114, 94][st.stamp];
  rect(hx, hy, 76, 10, b.ink(PAL.N1)); rect(hx + 2, hy + 10, 72, 3, b.ink(PAL.R1)); rect(hx, hy, 76, 1, b.ink(PAL.N3));
  rect(hx + 30, hy - 18, 16, 18, b.ink(PAL.D3)); rect(hx + 30, hy - 18, 16, 2, b.ink(PAL.D4)); rect(hx + 44, hy - 16, 2, 16, b.ink(PAL.D2));
  // the fist round the handle's knob, the forearm to the frame's right edge, his dark sleeve
  for (let y = hy - 34; y < hy - 14; y++) for (let x = hx + 24; x < hx + 54; x++) if (Math.hypot((x - hx - 39) / 15, (y - hy + 24) / 10) < 1) b.set(x, y, y < hy - 30 ? R[3] : x > hx + 48 ? R[1] : R[2]);
  for (let x = hx + 50; x < 480; x++) { const t = (x - hx - 50) / (480 - hx - 50), yc = Math.round(hy - 24 + t * 44), hw = 9 + Math.round(t * 4); for (let y = yc - hw; y <= yc + hw; y++) b.set(x, y, x > hx + 74 ? (y === yc - hw ? PAL.N4 : PAL.N2) : y === yc - hw ? R[3] : y === yc + hw ? R[0] : R[2]); }
  void f;
};
/** the papers on the shelf under his standing desk in the wide (room scale), FILED marks on them */
export const filedPapers = (b: Buf, x: number, y: number, filed: number) => {
  rect(x + 1, y + 1, 24, 10, b.ink(PAL.P0)); rect(x, y, 24, 10, b.ink(PAL.P2));
  for (let r = 0; r < 3; r++) rect(x + 3, y + 2 + r * 3, 16 - r * 3, 1, b.ink(PAL.P0));
  if (filed >= 1) { rect(x + 8, y + 4, 12, 5, b.ink(PAL.R2)); rect(x + 9, y + 5, 10, 3, b.ink(PAL.P2)); rect(x + 10, y + 6, 8, 1, b.ink(PAL.R2)); }
};

// ================================================================== sc 15: the TV's chyron
/** THE NEW GNIB · POWERED BY NOPEAI over the TV's own caption band: the lobby wide's small TV (LOBBY.TV), or the full
 *  frame TV (drawTvScreen's picture rect). `soft`: a medium setup's softened lobby */
export const gnibChyron = (b: Buf, where: 'wide' | 'full', soft = false) => {
  if (where === 'full') { rect(31, 169, 418, 19, b.ink(PAL.N0)); pt(b, 'THE NEW GNIB · POWERED BY NOPEAI', 38, 175, PAL.P2); return; }
  // the old caption ran 2 px past the picture into the bezel (MACROSOFT UNVEILS is 69 px): those columns take the
  // bezel's own pixel from above the band
  const T = LOBBY.TV, x = T.x0 + 2, y = T.y0 + 2, w = T.x1 - T.x0, h = T.y1 - T.y0 - 3, ph = h - 12;
  const bezel = b.get(T.x1, y + 4);
  const t = new Buf(w, 11, PAL.N0);
  tiny(t, 'THE NEW GNIB', 1, 0, PAL.P2); tiny(t, 'POWERED BY NOPEAI', 0, 6, PAL.P2);
  for (let j = 0; j < 11; j++) for (let i = 0; i < w; i++) {
    let c = x + i >= T.x1 ? bezel : t.c[j * w + i];
    if (soft && bayer(x + i, y + ph + 1 + j) < 0.5) c = stepColor(c, lightness(c) > 0.4 ? -1 : 0);
    b.set(x + i, y + ph + 1 + j, c);
  }
};

// ================================================================== sc 21: GTP-4's left pane
/** the bar-exam card popping over the left pane's website (k since it popped: 3 held steps) */
export const paneBar = (b: Buf, k: number) => {
  if (k < 0) return;
  const w = 196, h = 34, x = 20, y = 16;
  const open = k >= 3 ? 1 : [0.25, 0.55, 0.85][k], hh = Math.max(3, Math.round(h * open)), yy = y + Math.round((h - hh) / 2);
  rect(x + 3, yy + 3, w, hh, b.ink(PAL.N0)); rect(x - 1, yy - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, yy, w, hh, b.ink(PAL.P2)); rect(x, yy, w, 2, b.ink(PAL.C5));
  if (open < 1) return;
  pt(b, 'SIMULATED BAR EXAM', x + 8, y + 7, PAL.N2);
  bpt(b, 'TOP 10%', x + 8, y + 17, PAL.N1);
  // a check mark at the right, the result's own glyph
  for (let i = 0; i < 6; i++) { rect(x + w - 30 + i, y + 18 + i, 2, 2, b.ink(PAL.L2)); }
  for (let i = 0; i < 12; i++) { rect(x + w - 24 + i, y + 23 - i, 2, 2, b.ink(PAL.L2)); }
};
/** the users line on the left pane's back glass (Gerg's green), `jump` 0..1: the new stroke up off the glass's top */
export const paneUsersLine = (b: Buf, jump: number) => {
  // the pane's glass runs above the desks; the line lives on its upper left, clear of the banner and the door
  usersLine(b, 92, 100, 168, 0, Math.round(62 - jump * 40), PAL.L3, PAL.L1, 36);
};
/** Alyi's reflection in the pane's glass (the room sprite mirrored into the glass as a lightness modulation), leaning
 *  toward the website on `lean` */
export const paneAlyi = (b: Buf, lean: number) => {
  const img = alyiStand({...ALYI_STAND_DEFAULT, light: 'door', arms: 'down'});
  const x0 = 150, y0 = 52;
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const c = img.c[j * img.w + (img.w - 1 - i)];
    if (c < 0) continue;
    const dx = j < 40 ? -Math.round(lean * 3) : 0;
    const X = x0 + i + dx, Y = y0 + j;
    if (X < 0 || X >= 238 || Y >= 130) continue;
    const L = lightness(c);
    b.set(X, Y, stepColor(b.get(X, Y), L > 0.4 ? 2 : L > 0.2 ? 1 : 0));
  }
};
void line; void ellipse; void odometerSize; void drawGergPose; void drawCursor; void blitImg;
