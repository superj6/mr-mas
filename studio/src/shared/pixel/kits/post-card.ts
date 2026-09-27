// MR. MAS — shared kit: THE IN-WORLD POST CARD (UI-POST; Ep1 Act Four v5 art pass; new file, owned by the v5 art pass).
// A generic social post (guardrails §5: no real app's layout, marks or sounds): an avatar, the display name and the
// @handle, the post's words in source casing, and a heart count. It replaces v4's stand-ins (lay.ts postCard,
// callgrid postChip, inserts-mas feedStandIn: "post-ui stand-in" in shotlist-v4). Three sizes, each its own layout
// (never a scale of another):
//   'phone'   a card on a phone screen: 14 px face avatar, name + handle, wrapped text, the heart row (S5.03, S7.09)
//   'notify'  a call notification / a wall-screen corner: a 9 px initial avatar, name, 1-3 lines, no heart row
//             (S3.05 Gerg's "…I quit.", S4.01 the eulogy, S4.09 the badge post)
//   'popup'   a pop-up in its own UI inside a box or over a table: the phone card with a frame and a drop shadow
//             (S7.01 Alyi's regret in his P2 box, S7.13 Ttemme's result)
// Motion: the card opens in 3 held steps (k 0, 1, 2) and shows whole from k 3 (posts land whole; they are not typed).
// The heart row can tick (`hearts`) and light (`hearted`: his thumb, S5.03).
//   postBox(spec, size, w)                 -> {w, h} (lay out before drawing)
//   drawPost(b, x, y, spec, {size, w, k})  -> {w, h}
//   POSTS.*                                the act's posts in the lock's words (the text is the record: keep casing)
import {Buf, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {pt, pw, pwrap} from './uitype';

export type PostWho = 'mas' | 'gerg' | 'rima' | 'alyi' | 'ttemme' | 'staff';
export interface Poster { name: string; handle: string; accent: number; bg: number; initial: string }
/** display name + handle per poster (parody names only). The accent is the poster's colour in the show's grammar. */
export const POSTERS: Record<PostWho, Poster> = {
  mas: {name: 'Mas Manalt', handle: '@mas', accent: PAL.C6, bg: PAL.C3, initial: 'M'},
  gerg: {name: 'Gerg Mockbran', handle: '@gerg', accent: PAL.L3, bg: PAL.L1, initial: 'G'},
  rima: {name: 'Rima Tamuri', handle: '@rima', accent: PAL.P2, bg: PAL.P0, initial: 'R'},
  alyi: {name: 'Alyi', handle: '@alyi', accent: PAL.W6, bg: PAL.W3, initial: 'A'},
  ttemme: {name: 'Ttemme', handle: '@ttemme', accent: PAL.U5, bg: PAL.U3, initial: 'T'},
  staff: {name: 'NopeAI staff', handle: '@staff', accent: PAL.N8, bg: PAL.N5, initial: 'S'},
};
export interface PostSpec { who: PostWho; text: string; ts?: string; hearts?: number; }
/** the act's posts (v5 lock words; the record's casing, never corrected) */
export const POSTS = {
  gergQuit: {who: 'gerg', text: '…I quit.', ts: 'NOV 17'} as PostSpec,
  masEulogy: {who: 'mas', text: "…sorta like reading your own eulogy while you're still alive", ts: 'NOV 18'} as PostSpec,
  masBadge: {who: 'mas', text: 'first and last time i ever wear one of these', ts: 'NOV 19'} as PostSpec,
  rimaPeople: {who: 'rima', text: 'NopeAI is nothing without its people', ts: '2:06 AM', hearts: 0} as PostSpec,
  alyiRegret: {who: 'alyi', text: "I deeply regret my participation in the board's actions. I never intended to harm NopeAI…", ts: 'NOV 20'} as PostSpec,
  gergReturn: {who: 'gerg', text: 'Returning to NopeAI & getting back to coding tonight.', ts: 'NOV 21'} as PostSpec,
  ttemmeResult: {who: 'ttemme', text: 'I am deeply pleased by this result, after ~72 very intense hours of work.', ts: 'NOV 21'} as PostSpec,
};

// ------------------------------------------------------------------ avatars
// 14 x 14 faces, hand-pixelled (k keyline, b backdrop = the poster's bg, s/S skin, h/H hair, x extra): each reads as
// its character's one signature at thumbnail size (Mas's cowlick hoodie, Gerg's green glow, Rima's bob, Alyi's bald
// crown, Ttemme's headset)
const AV: Record<PostWho, string[]> = {
  mas: [
    '....kkkkkk....', '..kkbbbbbbkk..', '.kbbbhhhhbbbk.', '.kbbhhhhhhhbk.', 'kbbhhsSSshhbbk', 'kbbhsSSSSshbbk', 'kbbbsSSSSsbbbk',
    'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbxxssxxbbbk', '.kbxxxxxxxxbk.', '.kbxxxxxxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'],
  gerg: [
    '....kkkkkk....', '..kkbbbbbbkk..', '.kbbbhhhhbbbk.', '.kbbhhhhhhbbk.', 'kbbbhsSSshbbbk', 'kbbbsxSSxsbbbk', 'kbbbsSSSSsbbbk',
    'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbHHssHHbbbk', '.kbHHHHHHHHbk.', '.kbHHHHHHHHbk.', '..kkHHHHHHkk..', '....kkkkkk....'],
  rima: [
    '....kkkkkk....', '..kkbbbbbbkk..', '.kbbhhhhhhbbk.', '.kbhhhhhhhhbk.', 'kbbhhsSSshhbbk', 'kbbhsSSSSshbbk', 'kbbhsSSSSshbbk',
    'kbbhsSSSSshbbk', 'kbbhhsSSshhbbk', 'kbbbxxssxxbbbk', '.kbxxxHHxxxbk.', '.kbxxxHHxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'],
  alyi: [
    '....kkkkkk....', '..kkbbbbbbkk..', '.kbbbSSSSbbbk.', '.kbbSSSSSSbbk.', 'kbbhSSSSSShbbk', 'kbbhsSSSSshbbk', 'kbbbsSSSSsbbbk',
    'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbxxssxxbbbk', '.kbxxxxxxxxbk.', '.kbxxxxxxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'],
  ttemme: [
    '....kkkkkk....', '..kkbbbbbbkk..', '.kbbHhhhhHbbk.', '.kbHhhhhhhHbk.', 'kbbHhsSSshHbbk', 'kbbHsSSSSsHbbk', 'kbbHsSSSSsHbbk',
    'kbbbsSSSSsbbbk', 'kbbbbsSSHHbbbk', 'kbbbxxssxxbbbk', '.kbxxxxxxxxbk.', '.kbxxxxxxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'],
  staff: [
    '....kkkkkk....', '..kkbbbbbbkk..', '.kbbbhhhhbbbk.', '.kbbhhhhhhbbk.', 'kbbbhsSSshbbbk', 'kbbbsSSSSsbbbk', 'kbbbsSSSSsbbbk',
    'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbxxssxxbbbk', '.kbxxxxxxxxbk.', '.kbxxxxxxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'],
};
const AV_PAL: Record<PostWho, Record<string, number>> = {
  mas: {k: PAL.N0, b: PAL.C2, h: PAL.B2, s: PAL.S4, S: PAL.S5, x: PAL.G3},
  gerg: {k: PAL.N0, b: PAL.L0, h: PAL.B1, s: PAL.K2, S: PAL.K3, x: PAL.N0, H: PAL.G2},
  rima: {k: PAL.N0, b: PAL.P0, h: PAL.B0, s: PAL.S4, S: PAL.S5, x: PAL.N1, H: PAL.P2},
  alyi: {k: PAL.N0, b: PAL.W2, h: PAL.B1, s: PAL.S4, S: PAL.S5, x: PAL.N3},
  ttemme: {k: PAL.N0, b: PAL.U1, h: PAL.B0, H: PAL.G1, s: PAL.S4, S: PAL.S5, x: PAL.U3},
  staff: {k: PAL.N0, b: PAL.N4, h: PAL.B3, s: PAL.S3, S: PAL.S4, x: PAL.G4},
};
export const drawAvatar = (b: Buf, x: number, y: number, who: PostWho) =>
  AV[who].forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = AV_PAL[who][r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
/** 9 x 9 initial avatar (the notification size): a round chip in the poster's colour, the initial knocked out */
const RING9 = ['..#####..', '.#######.', '#########', '#########', '#########', '#########', '#########', '.#######.', '..#####..'];
export const drawAvatar9 = (b: Buf, x: number, y: number, who: PostWho) => {
  const P = POSTERS[who];
  RING9.forEach((r, j) => { for (let i = 0; i < 9; i++) if (r[i] === '#') b.set(x + i, y + j, P.bg); });
  // a 3 x 5 initial, centred (hand-set: the engine's 5 x 7 caps don't fit a 9 px chip)
  const G: Record<string, string[]> = {
    M: ['#.#', '###', '###', '#.#', '#.#'], G: ['###', '#..', '#.#', '#.#', '###'], R: ['##.', '#.#', '##.', '#.#', '#.#'],
    A: ['.#.', '#.#', '###', '#.#', '#.#'], T: ['###', '.#.', '.#.', '.#.', '.#.'], S: ['###', '#..', '###', '..#', '###'],
  };
  (G[P.initial] ?? G.S).forEach((r, j) => { for (let i = 0; i < 3; i++) if (r[i] === '#') b.set(x + 3 + i, y + 2 + j, PAL.P2); });
};

// ------------------------------------------------------------------ the heart row
const HEART5 = ['.#.#.', '#####', '#####', '.###.', '..#..'];
const heartIcon = (b: Buf, x: number, y: number, col: number) => HEART5.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') b.set(x + i, y + j, col); });
const replyIcon = (b: Buf, x: number, y: number, col: number) => { rect(x, y, 6, 4, b.ink(col)); rect(x + 1, y + 1, 4, 2, b.ink(PAL.N2)); b.set(x + 1, y + 4, col); b.set(x + 1, y + 5, col); };
const shareIcon = (b: Buf, x: number, y: number, col: number) => { rect(x + 2, y, 1, 5, b.ink(col)); b.set(x + 1, y + 1, col); b.set(x + 3, y + 1, col); rect(x, y + 5, 5, 1, b.ink(col)); };

// ------------------------------------------------------------------ layout
export type PostSize = 'phone' | 'notify' | 'popup';
const PAD = {phone: 6, notify: 4, popup: 6};
const textW = (size: PostSize, w: number) => w - (size === 'notify' ? 20 : 30) - PAD[size];
export const postLines = (spec: PostSpec, size: PostSize, w: number) => pwrap(spec.text, textW(size, w));
export const postBox = (spec: PostSpec, size: PostSize, w = size === 'notify' ? 170 : 220) => {
  const n = postLines(spec, size, w).length;
  const h = size === 'notify' ? 17 + n * 10 : 21 + n * 10 + 13;
  return {w, h};
};
export interface PostDraw {
  size: PostSize;
  w?: number;
  /** frames since the card landed (3 held open steps, whole from 3); undefined = fully shown */
  k?: number;
  /** override the heart count (it ticks); undefined = the spec's */
  hearts?: number;
  /** the viewer's own heart is lit (red) */
  hearted?: boolean;
  /** the card's surface (default N2 on phones, N3 as a notification) */
  bg?: number;
  /** light it from below in the poster's colour (Gerg's green glow on the call) */
  glow?: boolean;
}
export const drawPost = (b: Buf, x: number, y: number, spec: PostSpec, o: PostDraw) => {
  const {w, h} = postBox(spec, o.size, o.w);
  const P = POSTERS[spec.who];
  const k = o.k ?? 99;
  if (k < 0) return {w, h};
  const bg = o.bg ?? (o.size === 'notify' ? PAL.N3 : PAL.N2);
  const open = k >= 3 ? 1 : [0.2, 0.5, 0.8][k];
  const hh = Math.max(3, Math.round(h * open)), yy = y + Math.round((h - hh) / 2);
  if (o.size === 'popup') { rect(x + 3, yy + 3, w, hh, b.ink(PAL.N0)); }
  rect(x - 1, yy - 1, w + 2, hh + 2, b.ink(PAL.N0));
  rect(x, yy, w, hh, b.ink(bg));
  rect(x, yy, w, 1, b.ink(o.size === 'notify' ? P.accent : stepColor(bg, 2)));
  if (o.size === 'popup') { rect(x, yy + hh - 1, w, 1, b.ink(stepColor(bg, -1))); }
  if (open < 1) return {w, h};
  const lines = postLines(spec, o.size, w);
  if (o.size === 'notify') {
    drawAvatar9(b, x + 4, y + 4, spec.who);
    pt(b, P.name, x + 17, y + 5, PAL.P2);
    if (spec.ts) pt(b, spec.ts, x + w - 5 - pw(spec.ts), y + 5, PAL.N6);
    lines.forEach((l, i) => pt(b, l, x + 17, y + 16 + i * 10, PAL.P1));
    if (o.glow) for (let i = 0; i < w; i++) { b.set(x + i, y + h, PAL.L2); if (i % 2 === 0) b.set(x + i, y + h + 1, PAL.L1); }
    return {w, h};
  }
  drawAvatar(b, x + 6, y + 6, spec.who);
  pt(b, P.name, x + 26, y + 6, PAL.P2);
  pt(b, P.handle, x + 30 + pw(P.name), y + 6, PAL.N6);
  if (spec.ts) pt(b, spec.ts, x + w - 6 - pw(spec.ts), y + 6, PAL.N6);
  lines.forEach((l, i) => pt(b, l, x + 26, y + 19 + i * 10, PAL.P1));
  // the heart row
  const fy = y + h - 11;
  rect(x + 26, fy - 3, w - 32, 1, b.ink(stepColor(bg, 1)));
  replyIcon(b, x + 26, fy + 1, PAL.N6);
  const hc = o.hearted ? PAL.R3 : PAL.N6;
  heartIcon(b, x + 56, fy + 1, hc);
  const n = o.hearts ?? spec.hearts;
  if (n !== undefined) pt(b, n >= 1000 ? `${Math.floor(n / 100) / 10}K` : String(n), x + 64, y + h - 10, o.hearted ? PAL.R3 : PAL.N6);
  shareIcon(b, x + 96, fy, PAL.N6);
  return {w, h};
};
