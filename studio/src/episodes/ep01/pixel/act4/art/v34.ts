// MR. MAS — Ep1 v3.4 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): THE RETURN'S COUNT (S8.04; script
// draft 8.3, script-v34-notes.md; SHOWRUNNER-NOTES 000: the mastermind by specifics, never a declaration).
//   drawCount(b, t)   over the firing's drawing (his CU, the lobby's tungsten behind him), in the empty right of the frame:
//                     first a quiet echo of Neleh's blueprint in its own drawn language (her sheet's lettering, bpText):
//                     the four seats' plates bracketed as VOTES, and the CEO's box with EQUITY: 0 under it, pencilled in
//                     the background's own colour two rungs down (their count, faint); then what he holds, in the same
//                     language and in his cyan: the landlord's key, the money's ticker climbing, Gerg's badge on its
//                     lanyard. Each item is struck in on its word in three held steps (2 f apart); nothing else is
//                     lettered (no caption beyond the V.O.). `t` = the frames since each word: {four, votes, landlord,
//                     money, gerg} (negative: not yet)
import {Buf} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {bpText} from '../../../../../shared/pixel/kits/blueprint';

const RH = 203;
type Pts = Array<[number, number]>;
/** a 1 px line's pixels */
const lineP = (x0: number, y0: number, x1: number, y1: number): Pts => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1), out: Pts = [];
  for (let q = 0; q <= n; q++) out.push([Math.round(x0 + ((x1 - x0) * q) / n), Math.round(y0 + ((y1 - y0) * q) / n)]);
  return out;
};
const rectP = (x: number, y: number, w: number, h: number, r = 0): Pts => {
  const out: Pts = [];
  for (let i = r; i < w - r; i++) { out.push([x + i, y]); out.push([x + i, y + h - 1]); }
  for (let j = r; j < h - r; j++) { out.push([x, y + j]); out.push([x + w - 1, y + j]); }
  if (r) { out.push([x + 1, y + 1], [x + w - 2, y + 1], [x + 1, y + h - 2], [x + w - 2, y + h - 2]); }
  return out;
};
const ringP = (cx: number, cy: number, r: number): Pts => {
  const out: Pts = [];
  for (let a = 0; a < 360; a += 3) out.push([Math.round(cx + r * Math.cos((a * Math.PI) / 180)), Math.round(cy + r * Math.sin((a * Math.PI) / 180))]);
  return out;
};
const polyP = (pts: Pts): Pts => pts.slice(1).flatMap((p, i) => lineP(pts[i][0], pts[i][1], p[0], p[1]));
/** three held steps from t: 0 before, then 1, 2, 3 (2 f apart) */
const stepsAt = (t: number) => (t < 0 ? 0 : t < 2 ? 1 : t < 4 ? 2 : 3);

/** their count, pencilled: the background two rungs down (never a new colour on the tungsten) */
const pencil = (b: Buf, pts: Pts) => { for (const [x, y] of pts) if (x >= 0 && x < 480 && y >= 0 && y < RH) b.set(x, y, stepColor(b.get(x, y), -2)); };
/** his count, in his cyan: the line and a one-rung-darker shadow under it (so it holds on the cream and the orange) */
const cyan = (b: Buf, pts: Pts) => {
  for (const [x, y] of pts) if (x >= 0 && x < 480 && y + 1 < RH) b.set(x, y + 1, PAL.C2);
  for (const [x, y] of pts) if (x >= 0 && x < 480 && y >= 0 && y < RH) b.set(x, y, PAL.C6);
};

export interface CountTimes { four: number; votes: number; landlord: number; money: number; gerg: number }
export const COUNT_AT = {votes: [212, 30] as [number, number], ceo: [368, 26] as [number, number], key: [214, 110] as [number, number], ticker: [284, 102] as [number, number], badge: [372, 90] as [number, number]};
export const drawCount = (b: Buf, t: CountTimes) => {
  // ---- theirs: the four seats' plates (one a held step, as her figure pointed at them), the bracket, VOTES
  const [vx, vy] = COUNT_AT.votes;
  const nPlates = t.four < 0 ? 0 : Math.min(4, 1 + Math.floor(t.four / 2));
  for (let i = 0; i < nPlates; i++) pencil(b, rectP(vx + i * 34, vy, 28, 11, 1));
  const sv = stepsAt(t.votes);
  if (sv >= 1) pencil(b, [...lineP(vx, vy + 15, vx, vy + 18), ...lineP(vx + 130, vy + 15, vx + 130, vy + 18)]);
  if (sv >= 2) pencil(b, [...lineP(vx, vy + 18, vx + 130, vy + 18), ...lineP(vx + 65, vy + 18, vx + 65, vy + 21)]);
  if (sv >= 3) { const tb = new Buf(480, RH, 0x1000000); bpText(tb, 'VOTES', vx + 65, vy + 24, 99, 0, {align: 'center', col: 1}); const pts: Pts = []; for (let i = 0; i < tb.c.length; i++) if (tb.c[i] === 1) pts.push([i % 480, Math.floor(i / 480)]); pencil(b, pts); }
  // the CEO's box, with EQUITY: 0 under it (a beat after VOTES, before "i had")
  const sc = stepsAt(t.votes - 6);
  const [cx, cy] = COUNT_AT.ceo;
  if (sc >= 1) pencil(b, rectP(cx, cy, 76, 22));
  if (sc >= 2 || sc >= 3) {
    const tb = new Buf(480, RH, 0x1000000);
    if (sc >= 2) bpText(tb, 'CEO', cx + 8, cy + 8, 99, 0, {col: 1});
    if (sc >= 3) bpText(tb, 'EQUITY: 0', cx, cy + 27, 99, 0, {col: 1});
    const pts: Pts = []; for (let i = 0; i < tb.c.length; i++) if (tb.c[i] === 1) pts.push([i % 480, Math.floor(i / 480)]); pencil(b, pts);
  }
  // ---- his: the landlord's key (the bow, the shaft, the bit)
  const sk = stepsAt(t.landlord), [kx, ky] = COUNT_AT.key;
  if (sk >= 1) cyan(b, [...ringP(kx + 8, ky + 7, 7), ...ringP(kx + 8, ky + 7, 3)]);
  if (sk >= 2) cyan(b, [...lineP(kx + 15, ky + 6, kx + 50, ky + 6), ...lineP(kx + 15, ky + 8, kx + 50, ky + 8), ...lineP(kx + 50, ky + 6, kx + 50, ky + 8)]);
  if (sk >= 3) cyan(b, [...polyP([[kx + 38, ky + 8], [kx + 38, ky + 14], [kx + 42, ky + 14], [kx + 42, ky + 11], [kx + 45, ky + 11], [kx + 45, ky + 15], [kx + 49, ky + 15], [kx + 49, ky + 8]])]);
  // the money's ticker: its frame, the line climbing, the arrow
  const sm = stepsAt(t.money), [tx, ty] = COUNT_AT.ticker;
  if (sm >= 1) cyan(b, [...rectP(tx, ty, 64, 28, 1), ...lineP(tx + 4, ty + 22, tx + 60, ty + 22)]);
  if (sm >= 2) cyan(b, polyP([[tx + 6, ty + 20], [tx + 16, ty + 15], [tx + 24, ty + 18], [tx + 36, ty + 10], [tx + 44, ty + 12], [tx + 56, ty + 5]]));
  if (sm >= 3) cyan(b, [...lineP(tx + 56, ty + 5, tx + 51, ty + 5), ...lineP(tx + 56, ty + 5, tx + 56, ty + 10)]);
  // Gerg's badge: the lanyard, the card, its photo and its two lines (no name: the word says it)
  const sg = stepsAt(t.gerg), [gx, gy] = COUNT_AT.badge;
  if (sg >= 1) cyan(b, [...lineP(gx + 2, gy, gx + 9, gy + 13), ...lineP(gx + 18, gy, gx + 11, gy + 13)]);
  if (sg >= 2) cyan(b, [...rectP(gx, gy + 14, 21, 28, 1), ...lineP(gx + 8, gy + 17, gx + 12, gy + 17)]);
  if (sg >= 3) cyan(b, [...rectP(gx + 4, gy + 21, 8, 9), ...lineP(gx + 4, gy + 34, gx + 16, gy + 34), ...lineP(gx + 4, gy + 37, gx + 12, gy + 37)]);
};
