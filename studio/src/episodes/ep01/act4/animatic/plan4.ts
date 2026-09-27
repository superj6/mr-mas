// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v4: THE PLAN as ONE sheet at the section's scale (edit-plan-v4 §3 S1.03-S1.05).
// v3 drew the chairs (section view, 48 px pitch) and the structure (plan view, micro text) on two sheets at two scales,
// and joined them with a slide it could not afford. v4 redraws the structure around the section chairs on one
// 480 x 330 tall sheet, so nothing is scaled and the newcomer never has to map one drawing onto another:
//   S1.03  [GFX·sheet]   HOW TO FIRE A CEO (v4.1; was WHO OWNS A CEO?) in the top margin over the chair row; the three walk off; the ring round the
//                        four (who take the invite icons); MAS / CEO and GERG / CO-FOUNDER outside it; the box round the
//                        six; a 60 px tilt (1 px a frame) down the arrow into THE COMPANY, the CEO box at its right wall
//   S1.04  [GFX·detail]  one fixed integer 2x crop (240 x 135 sheet px) holding the CEO box and, just outside the
//                        company's wall, the fence and the key ring: VOTES: 0 and EQUITY: 0 land side by side
//   S1.05  [GFX·sheet]   the path: the four icons walk onto 1. NOON · VIDEO CALL; the fold; the curl; the tear
// Nothing past step 1 is ever visible (the fold hides it).
import {Buf, rect} from '../../../../shared/pixel/px';
import {text} from '../../../../shared/pixel/font';
import {
  BPX, bpSheet, bpText, bpLeader, bpBox, bpArrow, bpStamp, bpChair, ChairPose, bpRing, bpWalker, walkStep, WalkerKind,
  bpMoth, bpKeyRing, bpFence, bpComposite, curlAt, tearAt, linePts, inkPath, drawOn, rectPts,
} from '../../../../shared/pixel/kits/blueprint';
import {drawClickInsert} from '../../../../shared/pixel/kits/inserts-mas';
import type {ShotV4} from './data-v4';

let TALL: Buf | null = null;
const tallSheet = () => (TALL ??= (() => { const b = new Buf(480, 330, BPX.navy); bpSheet(b); return b; })());
let SHEET: Buf | null = null;
const sheet = () => (SHEET ??= (() => { const b = new Buf(480, 270, BPX.navy); bpSheet(b); return b; })());
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const wordAt = (sh: ShotV4, id: string, w: string, dflt: number) => {
  const l = sh.lines.find((q) => q.id === id);
  const x = l?.words.find((q) => norm(q[0]).startsWith(norm(w)));
  return l && x ? l.s + x[1] : dflt;
};
const lineS = (sh: ShotV4, id: string, dflt: number) => sh.lines.find((l) => l.id === id)?.s ?? dflt;
const lineE = (sh: ShotV4, id: string, dflt: number) => sh.lines.find((l) => l.id === id)?.e ?? dflt;
const mk = (sh: ShotV4, name: string, dflt: number) => sh.marks[name] ?? dflt;

// ------------------------------------------------------------------ the one sheet's geometry (sheet px)
export const PLAN4 = {
  stamp: [240, 38] as [number, number],
  FOOT: 150,
  CX: [48, 96, 144, 192, 240, 288, 336, 384, 432],
  six: {x: 166, y: 70, w: 306, h: 122},
  arrow: {x: 318, y0: 196, y1: 232},
  company: {x: 110, y: 236, w: 292, h: 90},
  ceo: {x: 262, y: 252, w: 132, h: 56},
  equity: {x: 316, y: 280, w: 62, h: 18},
  fence: {x: 408, y: 288, w: 66, h: 14},
  ring: [441, 258] as [number, number],
  crop: {x0: 220, y0: 195},
};
const NAMES = ['DIRE', 'NOVIHS', 'DRUH', 'MAS', 'GERG', 'ALYI', 'NELEH', 'MADA', 'THE QUIET'];
const ICON: Record<number, WalkerKind> = {5: 'door', 6: 'paper', 7: 'spinner', 8: 'square'};
const chairAt = (i: number, k: number, leave: number[]): {pose: ChairPose; x: number} => {
  const {CX} = PLAN4;
  const t0 = leave[i];
  if (t0 === undefined || k < t0) return {pose: 'sit', x: CX[i]};
  const w = k - t0;
  if (w < 6) return {pose: 'stand', x: CX[i]};
  return {pose: Math.floor((w - 6) / 2) % 2 ? 'walkB' : 'walkA', x: CX[i] - Math.floor((w - 6) / 2) * 5};
};

/** the tall sheet at frame k of S1.03 (`full`: everything drawn, the key ring included: S1.04's source) */
interface PlanClock { three: number; four: number; box: number; arrow: number; company: number; stamp: number }
const drawTall = (b: Buf, k: number, c: PlanClock, full = false, companyLabel = true) => {
  b.c.set(tallSheet().c);
  const {FOOT, CX, six, arrow, company, ceo, equity, fence, ring} = PLAN4;
  const K = full ? 9999 : k;
  // the stamp in the top margin: the act's question, over the drawn row
  if (K >= c.stamp) bpStamp(b, ['HOW TO FIRE A CEO'], PLAN4.stamp[0], PLAN4.stamp[1], K - c.stamp, {big: true, seed: 2, wear: 0.08}); // v4.1: the board's how-to
  // the chair row (the section): three walk off, one a waltz beat
  const leave = [c.three, c.three + 15, c.three + 30];
  NAMES.forEach((name, i) => {
    const {pose, x} = chairAt(i, K, leave);
    if (x < -14) return;
    bpChair(b, x, FOOT, pose, {bolts: i === 7, sticker: i === 2});
    if (pose !== 'sit') return;
    bpText(b, name, x, FOOT + 6, 999, 0, {align: 'center'});
    if (i === 8) bpText(b, 'VOTE', x, FOOT + 15, 999, 0, {align: 'center'});
    if (i === 3) bpText(b, 'CEO', x, FOOT + 15, 999, 0, {align: 'center', col: BPX.hot});
    if (i === 4) bpText(b, 'CO-FOUNDER', x, FOOT + 15, 999, 0, {align: 'center', col: BPX.hot});
  });
  // "Four of us vote.": the ring round the four, who take the cold open's invite icons
  if (K >= c.four) {
    bpRing(b, (CX[5] + CX[8]) / 2, FOOT - 6, 102, 42, K, c.four);
    for (const i of [5, 6, 7, 8]) {
      const t = c.four + 6 + (i - 5) * 3;
      if (K >= t) bpWalker(b, ICON[i], CX[i], FOOT - 36, 0, K, {spin: true});
    }
  }
  // the box round the six (the nonprofit), then the arrow, then the company
  if (K >= c.box) bpBox(b, six.x, six.y, six.w, six.h, K, c.box, {speed: 60, label: 'NOPEAI · THE NONPROFIT', labelAt: 'bottom'});
  if (K >= c.arrow) bpArrow(b, arrow.x, arrow.y0, arrow.y1, K, c.arrow, {w: 9, head: 10, speed: 4});
  if (K >= c.company) {
    bpBox(b, company.x, company.y, company.w, company.h, K, c.company, {speed: 50, double: true, label: companyLabel ? 'NOPEAI · THE COMPANY' : undefined}); // v4.1: (CAPPED PROFIT) cut: jargon, not load
    const t1 = c.company + 6;
    if (K >= t1) {
      bpBox(b, ceo.x, ceo.y, ceo.w, ceo.h, K, t1, {speed: 30});
      bpText(b, 'CEO', ceo.x + 12, ceo.y + 8, K, t1 + 4, {big: true});
      bpText(b, 'EQUITY:', ceo.x + 12, equity.y + 5, K, t1 + 6, {col: BPX.mid});
      inkPath(b, rectPts(equity.x, equity.y, equity.w, equity.h), drawOn(K, t1 + 8, 2 * (equity.w + equity.h), 20), BPX.mid);
      bpFence(b, fence.x, fence.y, fence.w, fence.h, K, t1 + 4);
      bpKeyRing(b, ring[0], ring[1], 16, K, t1 + 8, 4);
    }
  }
};
const clockOf = (sh: ShotV4): PlanClock => ({
  stamp: mk(sh, 'stamp', 7), three: mk(sh, 'three', 38), four: mk(sh, 'four', 70), box: mk(sh, 'box', 95),
  arrow: mk(sh, 'arrow', 112), company: mk(sh, 'company', 150),
});
const FULL_CLOCK: PlanClock = {stamp: 0, three: -999, four: 0, box: 0, arrow: 0, company: 0};

// ------------------------------------------------------------------ S1.05 THE PATH (step 1 only; the rest under the fold)
const PATH_Y = 150, ST1 = 96, FOLD_X = 232;
const WALK: Array<{kind: WalkerKind; gap: number}> = [{kind: 'door', gap: 0}, {kind: 'paper', gap: 30}, {kind: 'spinner', gap: 60}, {kind: 'square', gap: 90}];
const fold = (b: Buf) => {
  for (let y = 0; y < 270; y++) for (let x = FOLD_X; x < 480; x++) b.c[y * 480 + x] = (x - FOLD_X) % 8 === 0 || y % 8 === 0 ? BPX.faint : BPX.navy;
  rect(FOLD_X, 0, 2, 270, b.ink(BPX.line));
  rect(FOLD_X + 2, 0, 3, 270, b.ink(BPX.faint));
};
const drawPath = (b: Buf, k: number, stopAt: number) => {
  b.c.set(sheet().c);
  bpText(b, 'THE PLAN', 22, 22, k, 0, {big: true, cps: 3, underline: true});
  const path = linePts(20, PATH_Y + 1, 470, PATH_Y + 1);
  inkPath(b, path, drawOn(k, 2, path.length, 30), BPX.mid, {dash: [5, 3]});
  if (k >= 14) {
    inkPath(b, rectPts(ST1 - 4, PATH_Y - 3, 9, 9), 999, BPX.line, {tip: false});
    text(b, '1', ST1 - 1, PATH_Y - 2, BPX.hot);
    bpLeader(b, [ST1 - 8, 162], [ST1, PATH_Y + 6], k, 16, BPX.faint);
    bpText(b, '1. NOON · VIDEO CALL', ST1 - 12, 164, k, 18, {cps: 3});
  }
  fold(b);
  // the four walk on and stop, the lead on step 1 (whole px on 2s)
  const lx = Math.min(ST1 + 90, 30 + Math.floor(Math.min(k, stopAt) / 2) * 7);
  WALK.forEach((w, i) => {
    const x = lx - w.gap;
    if (x < -20) return;
    bpWalker(b, w.kind, x, PATH_Y, k < stopAt ? walkStep(k + i, 0, 99999, 2) : 0, k);
  });
};

// ------------------------------------------------------------------ the frame
/** o.zerosLift (a4p5 finish, Act Four v5 S1.04; opt-in, default 0 = v4): lift the two zero stamps and the equity
 *  stamp's caption this many px, so (HE TOLD THE SENATE) clears the sheet's bottom border rule (the v5 picture audit:
 *  on the frame's last rows, crossed by the rule, barely legible at 1x) */
export const drawPlan4 = (fb: Buf, sh: ShotV4, k: number, o: {zerosLift?: number} = {}) => {
  const zl = o.zerosLift ?? 0;
  if (sh.id === 'S1.03') {
    const c = clockOf(sh);
    const tall = new Buf(480, 330, BPX.navy);
    drawTall(tall, k, c);
    const t0 = mk(sh, 'tilt', 130);
    bpComposite(fb, tall, {oy: Math.max(0, Math.min(60, k - t0))}); // 1 px a frame (4 output px at 24 Hz)
    return;
  }
  if (sh.id === 'S1.04') {
    // one held integer 2x crop of the finished sheet; the new marks at 1x on top. No slide.
    const tall = new Buf(480, 330, BPX.navy);
    drawTall(tall, 0, FULL_CLOCK, true, false); // the crop would cut the company's label mid-word: the detail drops it
    const jig = k >= mk(sh, 'jangle', 2) && k < mk(sh, 'jangle', 2) + 12 ? (Math.floor(k / 3) % 2 ? 1 : -1) : 0; // it jangles, hopeful
    if (jig) { // redraw the ring one px over (on the finished sheet: erase the rest pose under it)
      const [rx, ry] = PLAN4.ring;
      for (let y = ry - 20; y < ry + 42; y++) for (let x = rx - 20; x < rx + 21; x++) tall.c[y * 480 + x] = tallSheet().c[y * 480 + x];
      bpFence(tall, PLAN4.fence.x, PLAN4.fence.y, PLAN4.fence.w, PLAN4.fence.h, 999, 0);
      bpKeyRing(tall, rx + jig, ry, 16, 999, 0, 4);
    }
    const {x0, y0} = PLAN4.crop;
    const pg = new Buf(480, 270, BPX.navy);
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) pg.c[y * 480 + x] = tall.c[(y0 + (y >> 1)) * 480 + x0 + (x >> 1)];
    const S = (sx: number, sy: number): [number, number] => [(sx - x0) * 2, (sy - y0) * 2];
    // the key ring's label (the investor), a leader down to the ring
    const [lx, ly] = S(PLAN4.ring[0], PLAN4.ring[1] - 18);
    bpText(pg, 'MACROSOFT · ~$10B IN (REPORTED)', 472, 28, 999, 0, {align: 'right'});
    bpLeader(pg, [lx, 40], [lx, ly - 4], 999, 0, BPX.faint);
    // "The investor gets—" VOTES: 0 lands on "gets" (it cuts the line), below the ring
    const tv = mk(sh, 'votes', wordAt(sh, 'a4-25-12', 'gets', 20) + 4);
    if (k >= tv) bpStamp(pg, ['VOTES: 0'], 408, 238 - zl, k - tv, {big: true, seed: 11});
    // "Good question." EQUITY: 0 (HIS TESTIMONY) beside the empty equity box: the two zeros side by side
    const te = mk(sh, 'equity', wordAt(sh, 'a4-25-02', 'question', 70));
    if (k >= te) { // the same size as VOTES: 0, so the two zeros read as one picture; the record's own words beneath
      bpStamp(pg, ['EQUITY: 0'], 214, 236 - zl, k - te, {big: true, seed: 9});
      if (k >= te + 3) bpText(pg, '(HE TOLD THE SENATE)', 214, 257 - zl, k, te + 3, {align: 'center', cps: 3, col: BPX.hot}); // v4.1: to whom
    }
    // the moth leaves the empty box
    const [mx, my] = S(PLAN4.equity.x + PLAN4.equity.w / 2, PLAN4.equity.y + PLAN4.equity.h / 2);
    const m0 = mk(sh, 'moth', lineE(sh, 'a4-25-02', 90) + 4);
    if (k < m0) bpMoth(pg, mx, my, 0);
    else if (k < m0 + 4) bpMoth(pg, mx, my, 1);
    else { const up = (k - m0 - 4) * 6; if (my - up > -10) bpMoth(pg, mx - 4 + ((k >> 1) % 2) * 3, my - up, (k >> 1) % 2 ? 2 : 1); }
    bpComposite(fb, pg);
    return;
  }
  if (sh.id === 'S1.05') {
    const pg = new Buf(480, 270, BPX.navy);
    const c0 = mk(sh, 'curl', 53), t0 = mk(sh, 'tear', 68);
    drawPath(pg, k, c0 - 4);
    if (k < c0) { bpComposite(fb, pg); return; }
    const behind = new Buf(480, 270, BPX.navy);
    drawClickInsert(behind, 0, {click: false});
    const curl = {corner: 'tr' as const, s: curlAt(k - c0)};
    const tear = k >= t0 ? (() => { const t = tearAt(k - t0, 6); return {y: 165, run: t.run, up: t.up, down: t.down, seed: 5}; })() : null;
    bpComposite(fb, pg, {behind, curl, tear});
    return;
  }
  bpComposite(fb, sheet());
  void lineS;
};
