// MR. MAS — kit: TIDDER, the forum reply (Ep1 sc 20; new file, owned by the `v3-art-b` pass). The parody site (naming.md:
// TIDDER for Reddit), a generic forum UI with no real site's layout, mascot, colours or marks (guardrails §5): a deep
// teal header with the plain wordmark, a thread, one comment box. A painter for kits/mas-monitor.ts (POV, OTS, or the
// dark room's two-shot screen: it lays itself out for the buffer's size).
//   tidderPainter(st)   phase 'typing' (his reply typing on, in source casing: `Agi has been achieved internally`, the
//                       caret, the post button lit) · 'posted' (his comment up; under it a reply counter spinning, its
//                       digits a blur while `spin`, and the first reply legible: `wait. human-level?? internally??`)
//                       · 'edit' (the comment rewriting itself letter by letter in place: `editK` characters of
//                       `…just memeing, y'all have no chill…` over what remains of the first; `tight` = framed tight on
//                       the middle, the must-read phrase at the display size, both ends running out of frame)
import {Buf, rect, hash, bayer} from '../px';
import {PAL} from '../palette';
import {pt, pw, bpt, bpw} from './uitype';
import {isMini, Painter} from './mas-monitor';

export const TIDDER_POST = 'Agi has been achieved internally';
export const TIDDER_EDIT = "…just memeing, y'all have no chill…";
export const TIDDER_REPLY = 'wait. human-level?? internally??';
export interface TidderState {
  phase: 'typing' | 'posted' | 'edit';
  /** typing: characters typed so far (the caret blinks on 8s) */
  typed?: number;
  /** posted / edit: the reply count, and whether its digits are still spinning (a blur) */
  count?: number;
  spin?: boolean;
  /** edit: characters of the edit written in so far */
  editK?: number;
  tight?: boolean;
}
const greek = (b: Buf, x: number, y: number, w: number, col: number, seed: number) => { let cx = x; while (cx < x + w) { const ww = 3 + Math.floor(hash(cx, seed, 5) * 9); rect(cx, y, Math.min(ww, x + w - cx), 3, b.ink(col)); cx += ww + 3; } };
const counterText = (n: number, spin: boolean, f: number) => {
  const s = n.toLocaleString('en-US');
  if (!spin) return s + ' replies';
  return s.split('').map((c, i) => (c >= '0' && c <= '9' ? String(Math.floor(hash(i, f, 9) * 10)) : c)).join('') + ' replies';
};
/** what the comment reads during the edit: the new words written over the old, letter by letter, in place */
export const editText = (k: number) => TIDDER_EDIT.slice(0, k) + TIDDER_POST.slice(Math.min(TIDDER_POST.length, k));
export const tidderPainter = (st: TidderState): Painter => (scr, f) => {
  const W = scr.w, H = scr.h;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, PAL.N1);
  if (isMini(scr)) {
    // the two-shot's small screen: the header, the thread's blocks, his comment block, the counter's digits
    rect(0, 0, W, 7, scr.ink(PAL.C2)); rect(2, 2, 14, 3, scr.ink(PAL.P2));
    for (let k = 0; k < 3; k++) rect(4, 10 + k * 6, W - 20 - k * 10, 3, scr.ink(PAL.N3));
    rect(3, 30, W - 6, 12, scr.ink(st.phase === 'typing' ? PAL.N3 : PAL.N2)); rect(3, 30, 2, 12, scr.ink(PAL.C5));
    rect(7, 34, st.phase === 'typing' ? Math.min(W - 16, (st.typed ?? 99) * 2) : W - 16, 3, scr.ink(st.phase === 'edit' ? PAL.W6 : PAL.P1));
    if (st.phase !== 'typing') { for (let i = 0; i < 4; i++) rect(8 + i * 5, 47, 3, 5, scr.ink(st.spin && (f + i) % 2 ? PAL.G4 : PAL.P2)); rect(30, 49, 20, 2, scr.ink(PAL.G3)); }
    return;
  }
  const s = W / 380; // the OTS screen is smaller: the layout keeps its sizes and trims its margins
  // the header: teal, the plain wordmark, a search bar
  rect(0, 0, W, 16, scr.ink(PAL.C1)); rect(0, 16, W, 1, scr.ink(PAL.C3));
  rect(8, 4, 8, 8, scr.ink(PAL.C5)); rect(10, 6, 4, 4, scr.ink(PAL.C1)); // a plain speech-square mark
  pt(scr, 'TIDDER', 20, 5, PAL.P2);
  rect(W - 110 * s, 4, 90 * s, 9, scr.ink(PAL.C0));
  if (st.tight && st.phase === 'edit') {
    // framed tight on the middle of the edited comment: the display face, both ends out of frame
    for (let y = 17; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, PAL.N2);
    const t = editText(st.editK ?? TIDDER_EDIT.length);
    const tw = bpw(t);
    bpt(scr, t, Math.round(W / 2 - tw / 2), Math.round(H / 2 - 7), PAL.P2);
    const caret = Math.round(W / 2 - tw / 2) + bpw(t.slice(0, st.editK ?? 0));
    if (Math.floor(f / 8) % 2 === 0 && (st.editK ?? 99) < TIDDER_EDIT.length) rect(caret, Math.round(H / 2 - 8), 2, 16, scr.ink(PAL.C6));
    return;
  }
  // the thread: its title, the post above (greeked), a comment of someone else's
  let y = 24;
  greek(scr, 10, y, Math.round(260 * s), PAL.P1, 1); y += 8; greek(scr, 10, y, Math.round(180 * s), PAL.P1, 2); y += 10;
  pt(scr, '1.2k comments', 10, y, PAL.G4); y += 14;
  rect(10, y, W - 20, 1, scr.ink(PAL.N3)); y += 6;
  if (st.phase === 'typing') {
    // the reply box: the typed words in his source casing, the caret, cancel and post
    pt(scr, 'reply as mas', 10, y, PAL.G4); y += 11;
    rect(10, y, W - 20, 44, scr.ink(PAL.N0)); rect(10, y, W - 20, 1, scr.ink(PAL.C4)); rect(10, y, 1, 44, scr.ink(PAL.C4)); rect(W - 11, y, 1, 44, scr.ink(PAL.N3)); rect(10, y + 43, W - 20, 1, scr.ink(PAL.N3));
    const t = TIDDER_POST.slice(0, st.typed ?? TIDDER_POST.length);
    pt(scr, t, 16, y + 7, PAL.P2);
    if (Math.floor(f / 8) % 2 === 0) rect(16 + pw(t) + 1, y + 6, 1, 9, scr.ink(PAL.C6));
    y += 50;
    rect(W - 100, y, 40, 12, scr.ink(PAL.N2)); pt(scr, 'cancel', W - 96, y + 3, PAL.G5);
    rect(W - 54, y, 44, 12, scr.ink((st.typed ?? 99) >= TIDDER_POST.length ? PAL.C5 : PAL.C2)); pt(scr, 'post', W - 44, y + 3, PAL.N0);
    return;
  }
  // his comment (posted, or rewriting itself), a small avatar and his handle
  rect(10, y, 8, 8, scr.ink(PAL.C3)); rect(12, y + 2, 4, 3, scr.ink(PAL.S3));
  pt(scr, 'mas', 22, y, PAL.C6); pt(scr, st.phase === 'edit' ? '· edited' : '· just now', 22 + pw('mas') + 4, y, PAL.G4);
  y += 12;
  const t = st.phase === 'edit' ? editText(st.editK ?? 0) : TIDDER_POST;
  pt(scr, t, 22, y, st.phase === 'edit' ? PAL.W7 : PAL.P2);
  y += 14;
  // the counter: its digits a blur while it spins (a new random digit every frame), the first reply under it
  const ct = counterText(st.count ?? 1204, !!st.spin, f);
  rect(22, y, pw(ct) + 10, 11, scr.ink(PAL.N2)); pt(scr, ct, 27, y + 2, st.spin ? PAL.G6 : PAL.P1);
  y += 17;
  rect(28, y, 1, 30, scr.ink(PAL.N3));
  rect(34, y, 7, 7, scr.ink(PAL.G3)); greek(scr, 45, y + 2, 34, PAL.G4, 7);
  pt(scr, TIDDER_REPLY, 34, y + 11, PAL.P1);
  y += 26;
  greek(scr, 34, y, Math.round(220 * s), PAL.N4, 8); greek(scr, 34, y + 8, Math.round(160 * s), PAL.N4, 9);
  void bayer;
};
