// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v3: THE PLAN at 7 bars (draft 3.2), voiced by NELEH's blueprint
// figure and cut off by MADA. Rebuilt from plan25.ts (itself a copy of the FX builder's kits preview) to board 3:
//   25.01  [GFX·sheet]   the grid draws itself; beat 3 the new title stamps: WHO OWNS A CEO WHO OWNS NOTHING?
//   25.02  [GFX·section] the nine chair outlines; "Three": three stand and walk off; "Four": the ring around four
//   25.02b [GFX·sheet]   the tall sheet, a whole-pixel pan down the arrow: THE NONPROFIT → THE COMPANY
//   25.02c [GFX·detail]  the key ring outside the fence; VOTES: 0 lands on the "t" of "gets" (cuts the line)
//   25.02d [GFX·detail]  the CEO box, EQUITY: 0 (HIS TESTIMONY); the moth opens its wings and flutters out
//   25.03  [GFX·sheet]   four figures walk on; the path draws: 1. NOON · VIDEO CALL, and runs on under a FOLD
//   25.04  [GFX·detail]  the fold's corner curls, the neon under it; the sheet tears back into the suite
// The two detail sizes are an integer 2x nearest crop of the sheet (MARKED stand-in: kit.blueprint.v3 redraws the
// linework at 2x coordinates). No spoilers: nothing past step 1 is ever visible (the fold hides it).
import {Buf, rect} from '../../../../shared/pixel/px';
import {text} from '../../../../shared/pixel/font';
import {micro} from '../../../../shared/pixel/cast/bosses';
import {
  BPX, bpSheet, sheetReveal, bpText, bpLeader, bpBox, bpArrow, bpStamp, bpCheck, bpChair, ChairPose, bpChairTop, bpRing, bpWalker, walkStep,
  bpMoth, bpKeyRing, bpFence, bpComposite, curlAt, tearAt, linePts, inkPath, drawOn, rectPts,
} from '../../../../shared/pixel/kits/blueprint';
import {drawClickInsert} from '../../../../shared/pixel/kits/inserts-mas';
import type {ShotV3} from './data-v3';

let SHEET: Buf | null = null;
const sheet = () => (SHEET ??= (() => { const b = new Buf(480, 270, BPX.navy); bpSheet(b); return b; })());
let TALL: Buf | null = null;
const tallSheet = () => (TALL ??= (() => { const b = new Buf(480, 330, BPX.navy); bpSheet(b); return b; })());
const wordAt = (sh: ShotV3, w: string, dflt: number) => {
  for (const l of sh.lines) { const x = l.words.find((q) => q[0].toLowerCase().startsWith(w)); if (x) return l.s + x[1]; }
  return dflt;
};
const lineEnd = (sh: ShotV3, id: string, dflt: number) => sh.lines.find((l) => l.id === id)?.e ?? dflt;

// ------------------------------------------------------------------ 25.01 THE WORD (1 bar)
const drawWord = (b: Buf, k: number) => {
  const rv = sheetReveal(Math.floor(k / 3));
  if (rv < 3) { rect(0, 0, 480, 270, b.ink(BPX.navy)); bpSheet(b, {reveal: rv}); } else b.c.set(sheet().c);
  if (k >= 30) bpStamp(b, ['WHO OWNS A CEO', 'WHO OWNS NOTHING?'], 240, 128, k - 30, {huge: true, double: true, seed: 2, wear: 0.08});
};

// ------------------------------------------------------------------ 25.02 THE SECTION: nine chairs
const CH = ['DIRE', 'NOVIHS', 'DRUH', 'MAS', 'GERG', 'ALYI', 'NELEH', 'MADA', 'THE QUIET'];
const CX = CH.map((_, i) => 48 + i * 48);
const FOOT = 150;
const chairAt = (i: number, k: number, leave: number[]): {pose: ChairPose; x: number} => {
  const t0 = leave[i];
  if (t0 === undefined || k < t0) return {pose: 'sit', x: CX[i]};
  const w = k - t0;
  if (w < 6) return {pose: 'stand', x: CX[i]};
  return {pose: Math.floor((w - 6) / 2) % 2 ? 'walkB' : 'walkA', x: CX[i] - Math.floor((w - 6) / 2) * 5};
};
const drawChairs = (b: Buf, k: number, sh: ShotV3) => {
  b.c.set(sheet().c);
  const three = wordAt(sh, 'three', 38), four = wordAt(sh, 'four', 70);
  const leave = [three, three + 15, three + 30]; // one per waltz beat
  CH.forEach((name, i) => {
    const {pose, x} = chairAt(i, k, leave);
    if (x < -14) return;
    bpChair(b, x, FOOT, pose, {bolts: i === 7, sticker: i === 2});
    if (pose === 'sit') {
      bpText(b, name, x, FOOT + 6, 99, 0, {align: 'center', cps: 3});
      if (i === 8) bpText(b, 'VOTE', x, FOOT + 16, 99, 0, {align: 'center', cps: 3});
    }
  });
  // "Four": one ring around ALYI · NELEH · MADA · THE QUIET VOTE (MAS and GERG outside it)
  if (k >= four) bpRing(b, (CX[5] + CX[8]) / 2, FOOT - 4, 104, 36, k, four);
};

// ------------------------------------------------------------------ the structure (plan view) on the tall sheet
const SIX = ['MAS', 'GERG', 'ALYI', 'NELEH', 'MADA', 'THE QUIET VOTE'];
const microW = (s: string) => s.length * 4 - 1;
/** the tall sheet: THE NONPROFIT (y 30-100) → the arrow → THE COMPANY (y 144-300) with the CEO box and the key ring */
const drawStructure = (b: Buf, k: number, full = false) => {
  b.c.set(tallSheet().c);
  const K = full ? 999 : k;
  SIX.forEach((name, i) => {
    const x = 84 + i * 62, y = 64;
    bpChairTop(b, x, y, {mark: i >= 2});
    micro(b, name, x - Math.floor(microW(name) / 2), y + 16, BPX.mid);
  });
  bpBox(b, 14, 30, 452, 70, K, 0, {speed: 60, label: 'NOPEAI · THE NONPROFIT', labelAt: 'bottom'});
  if (K >= 8) bpArrow(b, 176, 106, 150, K, 8, {w: 9, head: 10, speed: 3});
  if (K >= 12) bpText(b, 'CONTROLS', 192, 118, K, 12);
  if (K >= 16) bpBox(b, 14, 158, 330, 150, K, 16, {speed: 40, double: true, label: 'NOPEAI · THE COMPANY (CAPPED PROFIT)'});
  if (full) {
    bpFence(b, 362, 246, 104, 13, 999, 0);
    bpBox(b, 60, 214, 140, 50, 999, 0, {speed: 30});
    bpText(b, 'CEO', 74, 222, 999, 0, {big: true});
    bpText(b, 'EQUITY:', 74, 244, 999, 0, {col: BPX.mid});
    const eb = rectPts(120, 237, 64, 20);
    inkPath(b, eb, 999, BPX.mid);
  }
};

// ------------------------------------------------------------------ 25.03 THE PATH (step 1 only; the rest under the fold)
const PATH_Y = 150, ST1 = 96, FOLD_X = 232;
const WALK: Array<{kind: 'door' | 'paper' | 'spinner' | 'square'; gap: number}> = [
  {kind: 'door', gap: 0}, {kind: 'paper', gap: 30}, {kind: 'spinner', gap: 60}, {kind: 'square', gap: 90},
];
const lead = (k: number) => Math.min(ST1 + 90, -24 + Math.floor(Math.max(0, k) / 2) * 5); // the last one steps onto 1 at beat 4
const fold = (b: Buf, lift = 0) => {
  // the folded paper: a flap laid back over the right of the sheet, its crease on FOLD_X (a darker navy, its own grid)
  for (let y = 0; y < 270; y++) for (let x = FOLD_X; x < 480; x++) {
    const onGrid = (x - FOLD_X) % 8 === 0 || y % 8 === 0;
    b.c[y * 480 + x] = onGrid ? BPX.faint : BPX.navy;
  }
  rect(FOLD_X, 0, 2, 270, b.ink(BPX.line));
  rect(FOLD_X + 2, 0, 3, 270, b.ink(BPX.faint));
  if (lift) rect(FOLD_X + 5, 0, lift, 270, b.ink(BPX.navy));
};
const drawPath = (b: Buf, k: number) => {
  b.c.set(sheet().c);
  bpText(b, 'THE PLAN', 22, 22, k, 0, {big: true, cps: 3, underline: true});
  const path = linePts(20, PATH_Y + 1, 470, PATH_Y + 1);
  inkPath(b, path, drawOn(k, 2, path.length, 30), BPX.mid, {dash: [5, 3]});
  if (k >= 16) {
    inkPath(b, rectPts(ST1 - 4, PATH_Y - 3, 9, 9), 999, BPX.line, {tip: false});
    text(b, '1', ST1 - 1, PATH_Y - 2, BPX.hot);
    bpLeader(b, [ST1 - 8, 162], [ST1, PATH_Y + 6], k, 18, BPX.faint);
    bpText(b, '1. NOON · VIDEO CALL', ST1 - 12, 164, k, 20, {cps: 3});
  }
  fold(b);
  const lx = lead(k);
  WALK.forEach((w, i) => {
    const x = lx - w.gap;
    if (x < -20) return;
    bpWalker(b, w.kind, x, PATH_Y, k < 45 ? walkStep(k + i, 0, 99999, 2) : 0, k);
  });
};

// ------------------------------------------------------------------ the frame
export const drawPlan3 = (fb: Buf, sh: ShotV3, k: number) => {
  const pg = new Buf(480, 270, BPX.navy);
  if (sh.id === '25.01') { drawWord(pg, k); bpComposite(fb, pg); return; }
  if (sh.id === '25.02') { drawChairs(pg, k, sh); bpComposite(fb, pg); return; }
  if (sh.id === '25.02b') {
    const tall = new Buf(480, 330, BPX.navy);
    drawStructure(tall, k);
    bpComposite(fb, tall, {oy: Math.min(60, Math.floor(k / 2) * 2)}); // the pan rides the arrowhead down, whole px on 2 f
    return;
  }
  if (sh.id === '25.02c' || sh.id === '25.02d') {
    // the detail sizes: an integer 2x nearest crop of the finished sheet (MARKED stand-in), new marks drawn at 1x on top
    const tall = new Buf(480, 330, BPX.navy);
    drawStructure(tall, 0, true);
    if (sh.id === '25.02c') {
      const jig = k >= 4 && k < 16 ? (Math.floor(k / 3) % 2 ? 1 : -1) : 0; // it jangles, hopeful
      bpKeyRing(tall, 414 + jig, 222, 16, 999, 0, 4);
    }
    const cx = sh.id === '25.02c' ? 414 : 130, cy = sh.id === '25.02c' ? 236 : 238;
    const x0 = Math.max(0, Math.min(240, cx - 120)), y0 = Math.max(0, Math.min(330 - 135, cy - 68));
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) pg.c[y * 480 + x] = tall.c[(y0 + (y >> 1)) * 480 + x0 + (x >> 1)];
    if (sh.id === '25.02c') {
      bpText(pg, 'MACROSOFT · ~$10B IN (REPORTED)', 240, 238, 999, 0, {align: 'center'});
      const t = wordAt(sh, 'gets', 21) + 4; // the stamp lands on the "t" of "gets": it cuts the line
      if (k >= t) bpStamp(pg, ['VOTES: 0'], 250, 120, k - t, {big: true, seed: 11});
    } else {
      bpStamp(pg, ['EQUITY: 0 (HIS TESTIMONY)'], 200, 206, 99, {seed: 9});
      const m0 = Math.max(46, lineEnd(sh, 'a4-25-02', 46));
      if (k < m0) bpMoth(pg, 212, 110, 0);
      else if (k < m0 + 4) bpMoth(pg, 212, 110, 1);
      else { const up = (k - m0 - 4) * 8; bpMoth(pg, 208 + ((k >> 1) % 2) * 3, 110 - up, (k >> 1) % 2 ? 2 : 1); }
    }
    bpComposite(fb, pg);
    return;
  }
  if (sh.id === '25.03') { drawPath(pg, k); bpComposite(fb, pg); return; }
  if (sh.id === '25.04') {
    drawPath(pg, 60);
    const behind = new Buf(480, 270, BPX.navy);
    drawClickInsert(behind, 0, {click: false});
    const curl = {corner: 'tr' as const, s: curlAt(k)};
    const tear = k >= 18 ? (() => { const t = tearAt(k - 18, 6); return {y: 165, run: t.run, up: t.up, down: t.down, seed: 5}; })() : null;
    bpComposite(fb, pg, {behind, curl, tear});
    return;
  }
  bpComposite(fb, pg);
  void bpCheck;
};
