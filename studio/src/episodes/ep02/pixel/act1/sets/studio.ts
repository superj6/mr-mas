// MR. MAS — Ep2 v1 · act1 · sc 6 CHAPTER 1 OF 6 (MAR 18, 2024; XEL's studio): the drawings (the shots pass,
// 2026-10-09). The set is the art pass's (art/sets/studio.ts, SET-05: the curtain, two chairs, the mic in five held
// sizes, the podcast player's chrome with its chapter counter and REC light; art/cast/xel.ts), imported; its locked
// two-shot is COPIED here with the beats as parameters (the sitters' room-scale mouths, Mas's glass, XEL's lean, the
// squeeze, the curtain's part, a sitter left out for the freeze's keep mask).
//   meter(b, f, st)   [2S] the locked meter frame inside the chrome (the mic's size is the meter: it hops on XEL's
//                     pauses, never while Mas talks)
//   masMCU(b, f, st)  [MCU] Mas against the curtain, screen-left facing camera-right toward XEL, his approved portrait
//                     lip-synced, a face light one step (art studioMCU's framing)
//   chromeInsert      [INSERT] the chrome close (art)
import {Buf, ellipse} from '../../../../../shared/pixel/px';
import type {Img} from '../../../../../shared/pixel/figure';
import {PAL, familyOf} from '../../../../../shared/pixel/palette';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasMouth} from '../../../../../shared/pixel/cast/mas';
import {putBust} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {isSkin} from './common';
import {faceKey} from '../../../../../shared/pixel/kits/face-light';
import {xelBust} from '../../art/cast/xel';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import type {Expr} from '../../art/cast/civic2';
import {playerChrome, CHROME} from '../../art/sets/studio';
import {fill} from '../../art/kit';
import {bayer} from '../../../../../shared/pixel/px';
import {RH, W} from './common';

export {chromeInsert} from '../../art/sets/studio';

/** the black curtain (art studio's): vertical folds lit from the front-left; `part` 0..1 opens it from the middle */
const curtain = (b: Buf, r: {x: number; y: number; w: number; h: number}, part = 0) => {
  for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
    const u = (x - r.x) % 14, fold = u < 3 ? 0 : u < 7 ? 2 : u < 11 ? 1 : 0;
    const fl = y > r.y + r.h - 22;
    let c = fl ? (bayer(x, y) < 0.2 ? PAL.N2 : PAL.N1) : [PAL.N0, PAL.N1, PAL.N2][fold];
    if (!fl && fold === 2 && x < r.x + r.w * 0.45 && bayer(x, y) < 0.4) c = PAL.N3;
    b.set(x, y, c);
  }
  if (part > 0) {
    // the two halves drawn back to the sides in folds bunching at the edges; behind, the studio's grey wall
    const cx = r.x + (r.w >> 1), gap = Math.round(part * r.w * 0.5);
    for (let y = r.y; y < r.y + r.h - 22; y++) for (let x = cx - gap; x < cx + gap; x++) b.set(x, y, bayer(x, y) < 0.3 ? PAL.G3 : PAL.G2);
    for (const side of [-1, 1]) for (let y = r.y; y < r.y + r.h - 22; y++) for (let k = 0; k < 10; k++) { const x = cx + side * (gap + k); b.set(x, y, k % 3 === 0 ? PAL.N0 : PAL.N2); }
  }
};
/** Mas's three popped polo collars at the portrait's scale (Ep1's stack: coral inside, green, cream outermost; no new
 *  pop in Ep2). The fixes pass (2026-10-10): Ep1's 4 x 10 points at this scale read as red, green and white tinsel at
 *  the neckline (the review; Ep1's P7). Here each collar is a band 4 px wide standing up beside the neck, its point
 *  flaring outward at the top, its lit top edge and a dark edge on its outer side; each one outside the last and two
 *  pixels lower, so the three read as three stacked collars. The neck is found in the drawn portrait (its skin at the
 *  throat), so the stack sits on the neck wherever the portrait stands */
const COLLAR_COLS: Array<[number, number, number]> = [[PAL.R1, PAL.R2, PAL.R3], [PAL.L1, PAL.L2, PAL.L3], [PAL.P0, PAL.P1, PAL.P2]];
const collarStack = (b: Buf, x: number, y: number) => {
  // the neck: the skin run nearest the portrait's middle on the throat's row, and the neckline below it
  const row = y + 86;
  let nl = -1, nr = -1;
  for (let xx = x + 40; xx < x + 76; xx++) if (isSkin(b.get(xx, row))) { if (nl < 0) nl = xx; nr = xx; }
  if (nl < 0) return;
  const cx = (nl + nr) >> 1;
  let base = row; while (base < y + 110 && isSkin(b.get(cx, base))) base++;
  for (const side of [-1, 1]) {
    const edge = side < 0 ? nl : nr;
    for (let i = 2; i >= 0; i--) {
      const col = COLLAR_COLS[i];
      const top = base - 13 + 2 * i, bot = base + 1 + i;
      for (let yy = top; yy <= bot; yy++) {
        const lean = Math.round((bot - yy) * 0.3);
        const tip = yy - top;
        const w = tip === 0 ? 2 : tip === 1 ? 3 : 4;
        const inner = edge + side * (1 + 4 * i + lean);
        for (let k = 0; k < w; k++) {
          const X = inner + side * (4 - w + k);
          const outer = k === w - 1, fold = yy === top + 5 && k > 0;
          b.set(X, yy, tip === 0 ? col[2] : outer ? col[0] : fold ? col[0] : k === 0 ? col[2] : col[1]);
        }
        // the dark edge outside it (so the bands read as layers, never one striped trim)
        b.set(inner + side * 4, yy, PAL.N0);
      }
    }
  }
};
export interface MeterSt {
  mic: 1 | 2 | 3 | 4 | 5;
  ch: number;
  rec: boolean;
  /** Mas (his approved portrait, faced camera-right toward XEL): mouth, eye dart */
  mas?: {mouth?: MasMouth; look?: -1 | 0 | 1; head?: '34' | 'front'};
  /** XEL (his sculpted bust, faced camera-left): mouth, expression, lean toward the mic (0..3: 3 = his head behind the
   *  giant capsule); null = left out */
  xel?: {mouth?: Viseme; expr?: Expr; lean?: 0 | 1 | 2 | 3} | null;
  /** the giant mic pressing Mas against the curtain: 1 leaning round it, 2 pressed flat (the capsule has crept over
   *  to him: it rests against his cheek and shoulder) */
  squeeze?: 0 | 1 | 2;
  part?: number;
  /** the podcast's own cameras (the fixes pass, 2026-10-10: 90 s on one locked two-shot was Act One's slowest stretch):
   *  'two' the meter frame (every hop happens here, so the mic's growth is read against the same frame), 'mas' / 'xel'
   *  a single on whoever is talking at the same scale (the other a sliver at the edge, the mic at its size in frame) */
  cam?: 'two' | 'mas' | 'xel';
}
/** where the mic stands (its capsule's centre x): pressed against Mas at squeeze 2 */
const micX = (st: MeterSt) => CHROME.pic.x + (CHROME.pic.w >> 1) - (st.mic === 5 ? 6 : 0) - ((st.squeeze ?? 0) === 2 ? 84 : 0);
/** the sculpted busts' skin, smoothed: a skin pixel that stands alone in its 3 x 3 (one or no neighbour of its own
 *  tone, five or more of one other skin tone) takes that tone; the shading's planes stay, the speckle goes */
const smoothSkin = (im: Img): Img => {
  const c = new Int32Array(im.c), W2 = im.w;
  const sk = (v: number) => { const fm = familyOf(v); return !!fm && fm[0] === 'S' && fm[1] >= 2; };
  for (let y = 1; y < im.h - 1; y++) for (let x = 1; x < W2 - 1; x++) {
    const v = im.c[y * W2 + x]; if (!sk(v)) continue;
    const n = new Map<number, number>(); let same = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { if (!i && !j) continue; const u = im.c[(y + j) * W2 + x + i]; if (u === v) same++; else if (sk(u)) n.set(u, (n.get(u) ?? 0) + 1); }
    if (same > 1) continue;
    let best = -1, bn = 0; for (const [u, m] of n) if (m > bn) { bn = m; best = u; }
    if (bn >= 5) c[y * W2 + x] = best;
  }
  return {w: im.w, h: im.h, c};
};
const XEL_SMOOTH = new Map<string, Img>();
const xelSmooth = (s: {mouth: Viseme; expr: Expr}) => { const k = `${s.mouth}:${s.expr}`; let im = XEL_SMOOTH.get(k); if (!im) { im = smoothSkin(smoothSkin(xelBust(s))); XEL_SMOOTH.set(k, im); } return im; };
/** the mic on its stand at five held sizes, at the two-shot's scale: the capsule (its grille, the dark band, the shock
 *  mount's ring), the stand down out of the picture; size 5 fills the frame */
const MIC = [{hw: 7, hh: 15, top: 78}, {hw: 11, hh: 23, top: 66}, {hw: 17, hh: 35, top: 50}, {hw: 28, hh: 56, top: 26}, {hw: 58, hh: 118, top: 2}];
export const micAt = (b: Buf, cx: number, y0: number, y1: number, size: 1 | 2 | 3 | 4 | 5) => {
  const m = MIC[size - 1];
  const top = y0 + m.top;
  const sw = Math.max(2, Math.round(m.hw / 4));
  fill(b, cx - (sw >> 1), top + m.hh, sw, y1 - top - m.hh, PAL.G3); fill(b, cx - (sw >> 1), top + m.hh, 1, y1 - top - m.hh, PAL.G5);
  const grid = Math.max(2, Math.round(m.hw / 5));
  for (let j = 0; j < m.hh; j++) for (let i = -m.hw; i <= m.hw; i++) {
    const d = Math.hypot(i / m.hw, (j - m.hh / 2) / (m.hh / 2 + 0.5));
    if (d >= 1) continue;
    b.set(cx + i, top + j, d > 0.88 ? (i < 0 ? PAL.G6 : PAL.G2) : (i + j) % grid === 0 ? PAL.G2 : i < -m.hw * 0.3 ? PAL.G5 : PAL.G4);
  }
  fill(b, cx - m.hw, top + Math.round(m.hh * 0.62), m.hw * 2 + 1, Math.max(1, Math.round(m.hw / 6)), PAL.N1);
  ellipse(cx, top + m.hh + Math.round(m.hh / 10), m.hw + 3, Math.max(1, Math.round(m.hh / 12)), b.ink(PAL.N2));
};
/** [2S] the locked meter frame inside the chrome: the black curtain, MAS at the left (his approved portrait, warm, three
 *  collars, faced camera-right toward XEL), XEL at the right (his bust, faced camera-left), the mic on its stand
 *  between them at its held size; CH. n OF 6 and REC in the chrome */
export const meter = (b: Buf, f: number, st: MeterSt) => {
  fill(b, 0, 0, W, RH, PAL.N0);
  const r = CHROME.pic;
  const t = new Buf(W, 270, PAL.N0);
  curtain(t, r, st.part ?? 0);
  const sq = st.squeeze ?? 0;
  const off = st.cam === 'mas' ? 100 : st.cam === 'xel' ? -90 : 0;
  const mc = micX(st) + off;
  const mx = r.x + 6 - [0, 22, 30][sq] + off, my = r.y + 30;
  const ms = {...MAS_PORTRAIT_DEFAULT, light: 'warm' as const, mouth: st.mas?.mouth ?? 'rest', look: st.mas?.look ?? 0, head: st.mas?.head ?? '34'};
  putBust(t, masPortrait(ms), mx, my, {flip: true});
  collarStack(t, mx, my);
  faceKey(t, mx, my, mx + 112, my + 100, 1, 1);
  if (st.xel !== null) {
    const x = st.xel ?? {};
    // leaning toward the mic; at 3 his head is behind its capsule (wherever it stands)
    const ln = x.lean ?? 0;
    const xx = ln === 3 ? mc - 64 : ln === 2 && sq === 2 ? mc + 64 : r.x + r.w - 124 - [0, 6, 30][ln] + off;
    putBust(t, xelSmooth({mouth: x.mouth ?? 'rest', expr: x.expr ?? 'neutral'}), xx, r.y + 26);
  }
  micAt(t, mc, r.y, r.y + r.h, st.mic);
  for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) b.set(x, y, t.c[y * 480 + x]);
  playerChrome(b, {ch: st.ch, rec: st.rec});
  void f;
};
/** [MCU] Mas against the curtain (the art's studioMCU framing): his approved portrait faced camera-right toward XEL,
 *  warm, his three collars, lip-synced, a face light one step (P10) */
export const masMCU = (b: Buf, f: number, st: {mouth: MasMouth; look?: -1 | 0 | 1; head?: '34' | 'front'}) => {
  curtain(b, {x: 0, y: 0, w: W, h: RH});
  const ms = {...MAS_PORTRAIT_DEFAULT, light: 'warm' as const, mouth: st.mouth, look: st.look ?? 0, head: st.head ?? '34'};
  putBust(b, masPortrait(ms), 70, 44, {flip: true});
  collarStack(b, 70, 44);
  faceKey(b, 70, 44, 182, 150, 1, 1);
  void f; void ellipse;
};
