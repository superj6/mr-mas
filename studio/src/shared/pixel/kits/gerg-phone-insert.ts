// MR. MAS — kit: sc 6's cut-up to GERG's DESK (6.04, the drill's one angle on the bullpen). New file (v3-art-a,
// 2026-09-27). Gerg's desk from his side, his green laptop's edge at the frame's top, his phone face-up on the desk: it
// buzzes (two held shake drawings), a post pops in its own UI (kits/post-any.ts: NOLE's real post, [V] Dec 3, 2022,
// in the record's words and casing), Gerg's thumb hearts it, and Rima's hand reaches in from the frame's left and
// un-hearts it for him. The name plate (NOLE) is the P2 pass's, drawn under the phone once the post has been read.
//   drawGergPhoneInsert(b, f, st)   st.k: frames since the buzz (0-5 the buzz, 6+ the post landed); st.heart: 0 not yet ·
//                                   1 Gerg's thumb on it, hearted · 2 Rima's hand, un-hearted
//   NOLE_POST                       the post's words (the lock's)
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {drawPostFor, postBoxFor, POSTERS_A1} from './post-any';

export const NOLE_POST = {poster: POSTERS_A1.nole, text: 'CHATGTP is scary good. We are not far from dangerously strong AI.', ts: 'DEC 3'};
const RH = 203;
export interface GergPhoneState { k?: number; heart?: 0 | 1 | 2 }
/** a thumb or a fingertip from a frame edge to (tx, ty): a rounded tip, the nail, the digit widening to the edge */
const digit = (b: Buf, tx: number, ty: number, from: 'bottom' | 'left', skin: [number, number, number]) => {
  const [sh, body, lit] = skin;
  if (from === 'bottom') {
    for (let y = ty; y < RH; y++) { const t = (y - ty) / (RH - ty), hw = 8 + Math.round(t * 8), cx = tx + Math.round(t * 16); for (let x = cx - hw; x <= cx + hw; x++) { const d = Math.hypot((x - cx) / hw, (y - ty - 8) / 8); if (y < ty + 8 && d > 1) continue; b.set(x, y, x === cx - hw || x === cx + hw ? sh : x > cx + hw * 0.5 ? sh : y < ty + 5 ? lit : body); } }
    for (let j = 0; j < 6; j++) for (let i = -4; i <= 4; i++) if (Math.hypot(i / 4.5, (j - 3) / 3.5) < 1) b.set(tx + i, ty + 2 + j, j < 2 ? PAL.P2 : PAL.P1);
  } else {
    for (let x = 0; x <= tx; x++) { const t = (tx - x) / Math.max(1, tx), hh = 6 + Math.round(t * 7), cy = ty + Math.round(t * 10); for (let y = cy - hh; y <= cy + hh; y++) { const d = Math.hypot((x - tx + 7) / 7, (y - cy) / hh); if (x > tx - 7 && d > 1) continue; b.set(x, y, y === cy - hh || y === cy + hh ? sh : y > cy + hh * 0.4 ? sh : x > tx - 4 ? lit : body); } }
    for (let j = -3; j <= 3; j++) for (let i = 0; i < 5; i++) if (Math.hypot((i - 2) / 3, j / 3.5) < 1) b.set(tx - 4 + i, ty + j, i > 2 ? PAL.P2 : PAL.P1);
  }
};
export const drawGergPhoneInsert = (b: Buf, f: number, st: GergPhoneState = {}) => {
  const k = st.k ?? 20, heart = st.heart ?? 0;
  // his desk, lit by the laptop's green from the top edge (the lid's back at the top of frame)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = y / RH; b.set(x, y, bayer(x, y) < (1 - d) * 0.5 ? PAL.L1 : bayer(x, y) < 0.25 ? PAL.G2 : PAL.G1); }
  rect(0, 0, 480, 18, b.ink(PAL.N1)); rect(0, 18, 480, 2, b.ink(PAL.L2)); for (let x = 0; x < 480; x += 3) b.set(x, 19, PAL.L3);
  // the phone, face-up, buzzing (a pixel of shake on the buzz frames)
  const shake = k < 6 ? (k % 2 ? 1 : -1) : 0;
  const px = 136 + shake, py = 30, pw = 208, ph = 173;
  rect(px + 4, py + 4, pw, ph, b.ink(PAL.N0));
  rect(px, py, pw, ph, b.ink(PAL.N0)); rect(px + 1, py + 1, pw - 2, ph, b.ink(PAL.N1));
  rect(px + 6, py + 8, pw - 12, ph, b.ink(PAL.N2));
  if (k < 6) { for (const dx of [-8, -5, pw + 4, pw + 7]) for (let y = py + 30; y < py + 60; y += 4) b.set(px + dx, y + (dx < 0 ? 0 : 2), PAL.L2); } // the buzz, marked
  // the post in its own UI
  if (k >= 6) {
    const pk = k - 6;
    drawPostFor(b, px + 12, py + 22, NOLE_POST, {size: 'phone', w: pw - 24, k: pk, hearts: heart === 1 ? 1 : 0, hearted: heart === 1});
    const box = postBoxFor(NOLE_POST, 'phone', pw - 24);
    const hx = px + 12 + 58, hy = py + 22 + box.h - 8;
    if (heart === 1) digit(b, hx + 2, hy + 4, 'bottom', [PAL.S2, PAL.S3, PAL.S4]); // Gerg's thumb, just lifted off it
    if (heart === 2) digit(b, hx - 2, hy + 1, 'left', [PAL.S2, PAL.S4, PAL.S5]); // Rima's fingertip, on it: un-hearted
  }
};
