// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v2: THE PLAN (sc 25), COPIED from the FX builder's kits preview
// (episodes/ep01/act4/kits/plan.ts, "copy, don't import") on its real clock: 18 bars = 1080 frames = act 120-1200.
// Animatic changes to the copy: the tear now opens onto the inserts builder's click plate (kits/inserts-mas.ts
// drawClickInsert, which has the trackpad), and 25.08 is that insert (the scene builder owns the real scene).
// ---- original header follows ----
// MR. MAS — ep01 act4 kits preview: THE PLAN (sc 25), laid out with the blueprint kit to the storyboard's shots
// (production/act4/shotlist.md 25.01-25.08) on its real clock: 18 bars at 96 BPM = 1080 frames (15 per beat, 60 per
// bar), cut on the grid. Plus 24.02's flash-print (a separate 60 f scene, `drawFlashFrame`).
// This proves the kit and is a starting layout for the sc 25 builder, who owns the scene (copy, don't import).
// The laptop insert behind the paper is rooms-a's drawLaptopInsert (read-only import).
//
//   25.01   0-179  the grid draws itself (3 held steps), the stamp lands on beat 2
//   25.02 180-419  nine chairs in elevation; DIRE, NOVIHS, DRUH stand and walk off; LEFT EARLIER IN 2023; the
//                  four voters circled one per beat; THESE FOUR VOTE
//   25.03 420-599  plan view: six chairs as top-view symbols; one element per beat; hold 2 beats
//   25.04 600-779  the numbered path; four walkers on 2s; ticks in stride; they stop at 4
//   25.05 780-899  closer (the figures redrawn 2x, not scaled): "Step four." / "Good question."
//   25.06 900-959  insert on the blank line: the chalk, 3 held drawings, squeak, snap
//   25.07 960-1019 the corner curls (4 held drawings, neon under it); beat 3 the sheet tears along the line
//   25.08 1020-    the laptop insert in BASE; beat 3 he clicks JOIN
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {inPalette} from '../../../../shared/pixel/palettes';
import {text, textWidth} from '../../../../shared/pixel/font';
import {micro} from '../../../../shared/pixel/cast/bosses';
import {
  BPX, bpSheet, sheetReveal, bpTitleBlock, bpText, bpLeader, bpBox, bpArrow, bpBanner, bpStamp, bpCheck, bpChair, ChairPose,
  bpChairTop, bpRing, bpWalker, walkStep, bpMoth, bpKeyRing, bpFence, bpChalk, bpCallout, bpComposite, curlAt, tearAt,
  linePts, inkPath, drawOn, rectPts, hugeText, BLUEPRINT_PRINT, traceBlueprint, inkBlueprint,
} from '../../../../shared/pixel/kits/blueprint';
import {drawLaptopInsert, LAPTOP_INSERT} from '../../../../shared/pixel/rooms/vegas-suite';
import {drawClickInsert} from '../../../../shared/pixel/kits/inserts-mas';

export const PLAN_FRAMES = 1080;
export const SH = {word: 0, chairs: 180, structure: 420, path: 600, close: 780, insert: 900, tear: 960, laptop: 1020};

// ------------------------------------------------------------------ shared pieces
let SHEET: Buf | null = null;
const sheet = () => (SHEET ??= (() => { const b = new Buf(480, 270, BPX.navy); bpSheet(b); return b; })());
const JOIN: [number, number] = [LAPTOP_INSERT.join.x + 50, LAPTOP_INSERT.join.y + 14];
const laptop = (b: Buf, f: number, pressed = false) => { drawClickInsert(b, f, {click: pressed}); };
void drawLaptopInsert;

// ------------------------------------------------------------------ 25.01 THE WORD
const drawWord = (b: Buf, k: number) => {
  const rv = sheetReveal(k);
  if (rv < 3) { rect(0, 0, 480, 270, b.ink(BPX.navy)); bpSheet(b, {reveal: rv}); } else b.c.set(sheet().c);
  if (k >= 15) bpStamp(b, ['HOW TO FIRE A CEO', 'WHO OWNS NOTHING.'], 240, 132, k - 15, {huge: true, double: true, seed: 2, wear: 0.08});
};

// ------------------------------------------------------------------ 25.02 THE CHAIRS (elevation)
const CH = ['DIRE', 'NOVIHS', 'DRUH', 'MAS', 'GERG', 'ALYI', 'NELEH', 'MADA', 'THE QUIET'];
const CX = CH.map((_, i) => 48 + i * 48);
const FOOT = 150;
const LEAVE = [60, 75, 90]; // DIRE, NOVIHS, DRUH stand on these beats (k from the shot's start); walk off left
const chairAt = (i: number, k: number): {pose: ChairPose; x: number} => {
  const t0 = LEAVE[i];
  if (t0 === undefined || k < t0) return {pose: 'sit', x: CX[i]};
  const w = k - t0;
  if (w < 8) return {pose: 'stand', x: CX[i]};
  // politely: 4 px per held drawing on 2s, the two walk drawings alternating
  return {pose: Math.floor((w - 8) / 2) % 2 ? 'walkB' : 'walkA', x: CX[i] - Math.floor((w - 8) / 2) * 4};
};
const drawChairs = (b: Buf, k: number) => {
  b.c.set(sheet().c);
  CH.forEach((name, i) => {
    const t0 = Math.floor(i / 3) * 15; // three per beat
    if (k < t0) return;
    const {pose, x} = chairAt(i, k);
    if (x < -14) return;
    bpChair(b, x, FOOT, pose, {bolts: i === 7, sticker: i === 2});
    if (pose === 'sit') {
      bpText(b, name, x, FOOT + 6, k, t0 + 2, {align: 'center', cps: 3});
      if (i === 8) bpText(b, 'VOTE', x, FOOT + 16, k, t0 + 6, {align: 'center', cps: 3});
    }
  });
  if (k >= 172) bpStamp(b, ['LEFT EARLIER', 'IN 2023'], CX[1], FOOT - 18, k - 172, {seed: 4});
  // the four who vote: one ring per beat (bar 4), then the label
  [5, 6, 7, 8].forEach((i, n) => bpRing(b, CX[i], FOOT - 6, i === 8 ? 27 : 22, 35, k, 180 + n * 15));
  if (k >= 225) {
    bpLeader(b, [CX[6] + 30, FOOT + 50], [CX[6] + 18, FOOT + 29], k, 225);
    bpText(b, 'THESE FOUR VOTE', CX[6] + 34, FOOT + 46, k, 228, {col: BPX.hot});
  }
};

// ------------------------------------------------------------------ 25.03 THE STRUCTURE (plan view)
const SIX = ['MAS', 'GERG', 'ALYI', 'NELEH', 'MADA', 'THE QUIET VOTE'];
const drawStructure = (b: Buf, k: number) => {
  b.c.set(sheet().c);
  SIX.forEach((name, i) => {
    const x = 84 + i * 62, y = 64;
    bpChairTop(b, x, y, {mark: i >= 2});
    micro(b, name, x - Math.floor(microWidthSafe(name) / 2), y + 16, BPX.mid);
  });
  const beat = (n: number) => n * 15;
  bpBox(b, 14, 30, 452, 70, k, beat(0), {speed: 40, label: 'NOPEAI · THE NONPROFIT', labelAt: 'bottom'});
  if (k >= beat(1)) { bpArrow(b, 176, 106, 136, k, beat(1), {w: 9, head: 10, speed: 8}); bpText(b, 'CONTROLS', 190, 116, k, beat(1) + 8); }
  if (k >= beat(2)) bpBox(b, 14, 144, 330, 108, k, beat(2), {speed: 40, double: true, label: 'NOPEAI · THE COMPANY (CAPPED PROFIT)'});
  if (k >= beat(3)) bpBanner(b, 240, 10, "THE BOARD'S DUTY: THE MISSION. NOT THE INVESTORS.", k, beat(3));
  if (k >= beat(4)) {
    bpFence(b, 362, 194, 104, 13, k, beat(4));
    bpKeyRing(b, 414, 170, 16, k, beat(4) + 4, 4);
    bpText(b, 'MACROSOFT', 414, 214, k, beat(4) + 10, {align: 'center'});
    bpText(b, '~$10B IN (REPORTED)', 414, 224, k, beat(4) + 14, {align: 'center', col: BPX.mid});
    bpText(b, 'VOTES: 0', 414, 234, k, beat(4) + 20, {align: 'center', col: BPX.hot});
  }
  if (k >= beat(5)) {
    bpBox(b, 110, 164, 140, 50, k, beat(5), {speed: 30});
    bpText(b, 'CEO', 124, 172, k, beat(5) + 4, {big: true});
    bpText(b, 'EQUITY:', 124, 194, k, beat(5) + 6, {col: BPX.mid});
    const eb = rectPts(170, 187, 64, 20);
    inkPath(b, eb, drawOn(k, beat(5) + 8, eb.length, 24), BPX.mid);
  }
  if (k >= beat(6)) bpStamp(b, ['EQUITY: 0 (HIS TESTIMONY)'], 180, 230, k - beat(6), {seed: 9});
  if (k >= beat(7)) bpMoth(b, 202, 197, k < beat(7) + 4 ? 1 : 2);
  else if (k >= beat(5) + 12) bpMoth(b, 202, 197, 0);
};
const microWidthSafe = (s: string) => s.length * 4 - 1;

// ------------------------------------------------------------------ 25.04 THE PATH
const PATH_Y = 150;
const ST = [70, 170, 270, 370];
const STEPS = ['1. NOON · VIDEO CALL', '2. BLOG POST', '3. INTERIM CEO', '4.'];
const STEP_Y = [164, 180, 164, 180];
const STEP4_Y = 188;
const WALK: Array<{kind: 'door' | 'paper' | 'spinner' | 'square'; gap: number}> = [
  {kind: 'door', gap: 0}, {kind: 'paper', gap: 34}, {kind: 'spinner', gap: 66}, {kind: 'square', gap: 98},
];
/** the lead walker: enters from the left, 5 px per held 2-frame drawing (walks on 2s), stops at station 4 */
const lead = (k: number) => Math.min(ST[3], -20 + Math.floor(Math.max(0, k - 6) / 2) * 5);
const drawPath = (b: Buf, k: number) => {
  b.c.set(sheet().c);
  bpText(b, 'THE PLAN', 22, 22, k, 0, {big: true, cps: 2, underline: true});
  bpText(b, 'STEPS TO BE TAKEN BY THE BOARD, IN ORDER', 22, 44, k, 8, {cps: 4, col: BPX.mid});
  const path = linePts(20, PATH_Y + 1, 462, PATH_Y + 1);
  inkPath(b, path, drawOn(k, 2, path.length, 30), BPX.mid, {dash: [5, 3]});
  ST.forEach((sx, i) => {
    const t0 = 4 + i * 4;
    if (k < t0) return;
    inkPath(b, rectPts(sx - 4, PATH_Y - 3, 9, 9), 999, BPX.line, {tip: false});
    text(b, String(i + 1), sx - 1, PATH_Y - 2, BPX.hot);
    const ly = STEP_Y[i];
    bpLeader(b, [sx - 8, ly - 2], [sx, PATH_Y + 6], k, t0 + 2, BPX.faint);
    const done = bpText(b, STEPS[i], sx - 12, ly, k, t0 + 4, {cps: 3});
    if (i < 3) {
      const tickAt = 6 + Math.ceil(((ST[i] + 20) / 5) * 2);
      bpCheck(b, sx - 12 + textWidth(STEPS[i]) + 5, ly - 1, k < tickAt ? -1 : k - tickAt);
    } else if (k > done) {
      const bl = linePts(sx + 2, STEP4_Y, sx + 66, STEP4_Y);
      inkPath(b, bl, drawOn(k, done + 1, bl.length, 8), BPX.line);
    }
  });
  const lx = lead(k);
  WALK.forEach((w, i) => {
    const x = lx - w.gap;
    if (x < -20) return;
    const moving = lx < ST[3];
    bpWalker(b, w.kind, x, PATH_Y, moving ? walkStep(k + i, 6, 99999, 2) : 0, k);
  });
};

// ------------------------------------------------------------------ 25.05 THE CLOSE (redrawn 2x)
const drawClose = (b: Buf, k: number) => {
  b.c.set(sheet().c);
  const FEET = 186;
  const xs = [384, 318, 252, 186]; // door, paper, spinner, square: bunched at the line
  WALK.forEach((w, i) => bpWalker(b, w.kind, xs[i], FEET, 0, k, {k: 2, bright: w.kind === 'paper' && k >= 10 && k < 40}));
  const path = linePts(20, FEET + 1, 462, FEET + 1);
  inkPath(b, path, 999, BPX.mid, {dash: [8, 5], tip: false});
  bpText(b, '4.', 404, FEET + 14, k, 0, {big: true, cps: 9});
  inkPath(b, linePts(430, FEET + 27, 466, FEET + 27), 999, BPX.line, {tip: false});
  bpCallout(b, 'Step four.', 336, 60, [322, 106], k, 10);
  bpCallout(b, 'Good question.', 150, 42, [252, 88], k, 50);
};

// ------------------------------------------------------------------ 25.06-25.07 THE INSERT (the blank line)
const LINE_Y = 150;
const drawInsert = (b: Buf, k: number) => {
  b.c.set(sheet().c);
  hugeText(b, '4.', 40, LINE_Y - 34, BPX.line);
  rect(104, LINE_Y, 350, 2, b.ink(BPX.line));
  if (k >= 6) bpChalk(b, 110, LINE_Y, k - 6, {run: 66, held: true, size: 2});
};

// ------------------------------------------------------------------ the frame
export const drawPlanFrame = (fb: Buf, f: number) => {
  if (f >= SH.laptop) { laptop(fb, f, f >= SH.laptop + 30 && f < SH.laptop + 32); return; }
  const sh = new Buf(480, 270, BPX.navy);
  let curl = null, tear = null;
  if (f < SH.chairs) drawWord(sh, f - SH.word);
  else if (f < SH.structure) drawChairs(sh, f - SH.chairs);
  else if (f < SH.path) drawStructure(sh, f - SH.structure);
  else if (f < SH.close) drawPath(sh, f - SH.path);
  else if (f < SH.insert) drawClose(sh, f - SH.close);
  else {
    // 25.06 then 25.07 on the same insert: the chalk has snapped; the corner curls; beat 3 it tears
    drawInsert(sh, Math.min(f - SH.insert, 59));
    if (f >= SH.tear) {
      const k = f - SH.tear;
      curl = {corner: 'tr' as const, s: curlAt(k)};
      if (k >= 30) { const t = tearAt(k - 30, 8); tear = {y: LINE_Y + 1, run: t.run, up: t.up, down: t.down, seed: 5}; }
    }
  }
  const behind = new Buf();
  if (curl || tear) laptop(behind, f);
  bpComposite(fb, sh, {behind, curl, tear});
};

// ------------------------------------------------------------------ 24.02: the flash-print (60 f)
export const FLASH_FRAMES = 60;
/** 24.02: the laptop insert, the cursor on JOIN; beat 4 (f 45) the whole frame flash-prints to blueprint for a beat.
 *  mode 'print' = BLUEPRINT_PRINT (a per-colour switch: in the rules). 'trace' = the line-drawing alternative (a
 *  filter, not a lookup: a showrunner call). */
export const drawFlashFrame = (fb: Buf, f: number, mode: 'print' | 'trace' = 'print') => {
  laptop(fb, f);
  if (f < 45) return;
  if (mode === 'print') fb.c.set(inPalette(fb, BLUEPRINT_PRINT).c);
  else { const t = traceBlueprint(fb); inkBlueprint(t); fb.c.set(t.c); }
};
void clamp; void bpTitleBlock;
