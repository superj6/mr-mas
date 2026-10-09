// MR. MAS — Ep2 v1 art: SET-11, THE PLAN: `OMNI` (sc 10), on the show-wide blueprint kit (kits/blueprint.ts:
// cyan #7FDBFF on navy #0B1E3F, drawn in proxy colours and inked by bpComposite). Everything on the plan is accurate;
// the plan failing is the joke. A two-screen sheet (480 x 540) the camera pans down whole pixels:
//   OMNI stamp (o = omni) · BEFORE: three boxes as clerks passing a note EAR -> [1 · SPEECH TO TEXT] -> [2 · MODEL] ->
//   [3 · TEXT TO SPEECH] -> MOUTH, the grate at box 1 where TONE · LAUGHTER · WHO'S TALKING · BACKGROUND NOISE fall
//   through (backstage's [laughter] tag at the bottom) · NOW: an ear, an eye and a mouth wired into one box GTP-4o ·
//   the three steps: 1. 232 MS (AVG 320) (the tiny engineer, the bubble that has already answered) · 2. a tiny calendar
//   with MON circled, a tiny RADNUS on the Tuesday square · 3. $0 and a tiny crowd flooding in · the last square: the
//   tiny stage, its lights, tiny Rima in her spot · then an EMPTY speech bubble drifts in from the margin, blots out
//   the tiny stage's lights, and the sheet tears to the real stage lights.
//   planSheet(f, st)            -> the sheet Buf (proxies), held per state
//   planFrame(b, f, st)         the final frame: st {pan: 0..337, fell: 0..4 (the words falling through the grate), laugh:
//                               bool (the NOW mouth laughs back), stamps: 0..3, crowd: 0..1, bubble: 0..1 (its drift),
//                               tear: k frames since the tear (or -1), behind: the BASE frame the tear reveals}
//   PLAN_PANS                   the pan stops: the stamp, BEFORE, NOW, the steps, the stage
import {Buf, rect, line, ellipse, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {bpSheet, bpBox, bpText, bpStamp, bpComposite, BPX, tearAt, inkPath, linePts, ellipsePts, bpArrow, bpDim} from '../../../../../shared/pixel/kits/blueprint';
import {micro} from '../../../../../shared/pixel/cast/bosses';
import {fill, tiny, RH} from '../kit';
import type {ArtAsset} from '../asset';

export const PLAN_PANS = {stamp: 0, before: 40, now: 150, steps: 250, stage: 337};
export interface PlanSt { pan?: number; fell?: number; laugh?: boolean; stamps?: number; crowd?: number; bubble?: number; tear?: number; behind?: Buf }
const L = (b: Buf, x0: number, y0: number, x1: number, y1: number, col = BPX.line) => inkPath(b, linePts(x0, y0, x1, y1), 9999, col);
/** a tiny drafting figure (a clerk / an engineer / Rima): head circle, body, arms */
const tinyFigure = (b: Buf, x: number, y: number, o: {arm?: 'up' | 'pass' | 'down'; col?: number; skirt?: boolean} = {}) => {
  const c = o.col ?? BPX.line;
  inkPath(b, ellipsePts(x, y - 14, 3, 3), 9999, c);
  L(b, x, y - 11, x, y - 4, c);
  if (o.skirt) { L(b, x, y - 4, x - 3, y, c); L(b, x, y - 4, x + 3, y, c); } else { L(b, x, y - 4, x - 2, y, c); L(b, x, y - 4, x + 2, y, c); }
  if (o.arm === 'up') { L(b, x, y - 9, x - 4, y - 14, c); L(b, x, y - 9, x + 4, y - 14, c); }
  else if (o.arm === 'pass') { L(b, x, y - 9, x + 5, y - 9, c); L(b, x, y - 9, x - 3, y - 6, c); }
  else { L(b, x, y - 9, x - 3, y - 5, c); L(b, x, y - 9, x + 3, y - 5, c); }
};
const ear = (b: Buf, x: number, y: number, c = BPX.line) => { inkPath(b, ellipsePts(x, y, 6, 9, -Math.PI / 2, Math.PI * 1.4), 9999, c); inkPath(b, ellipsePts(x + 1, y + 1, 3, 4, -Math.PI / 2, Math.PI * 1.2), 9999, BPX.mid); };
const eye = (b: Buf, x: number, y: number) => { inkPath(b, ellipsePts(x, y, 8, 4), 9999, BPX.line); inkPath(b, ellipsePts(x, y, 2, 2), 9999, BPX.hot); };
const mouth = (b: Buf, x: number, y: number, open: boolean) => { L(b, x - 8, y, x + 8, y); if (open) { inkPath(b, ellipsePts(x, y + 2, 6, 3, 0, Math.PI), 9999, BPX.line); } else inkPath(b, ellipsePts(x, y, 8, 3, 0, Math.PI), 9999, BPX.mid); };
const bubble = (b: Buf, x: number, y: number, w: number, h: number, col = BPX.line) => {
  inkPath(b, linePts(x + 3, y, x + w - 3, y), 9999, col); inkPath(b, linePts(x + 3, y + h, x + w - 3, y + h), 9999, col);
  inkPath(b, linePts(x, y + 3, x, y + h - 3), 9999, col); inkPath(b, linePts(x + w, y + 3, x + w, y + h - 3), 9999, col);
  for (const [cx, cy] of [[x + 1, y + 1], [x + w - 1, y + 1], [x + 1, y + h - 1], [x + w - 1, y + h - 1]]) b.set(cx, cy, col);
  inkPath(b, linePts(x + 4, y + h, x, y + h + 5), 9999, col); inkPath(b, linePts(x, y + h + 5, x + 9, y + h), 9999, col);
};
const sheetCache = new Map<string, Buf>();
export const planSheet = (f: number, st: PlanSt): Buf => {
  const key = JSON.stringify({fell: st.fell ?? 4, laugh: !!st.laugh, stamps: st.stamps ?? 3, crowd: st.crowd ?? 1});
  const hit = sheetCache.get(key); if (hit) return hit;
  const b = new Buf(480, 540, BPX.navy);
  bpSheet(b, {});
  const done = 9999;
  // the stamp OMNI and its fine print
  bpStamp(b, ['OMNI'], 240, 50, 2, {huge: true, double: true});
  bpText(b, '(o = omni)', 214, 80, done, 0, {col: BPX.faint});
  // BEFORE: the three-box relay as clerks passing a note
  bpText(b, 'BEFORE', 20, 116, done, 0, {big: true});
  ear(b, 30, 160);
  const boxes = [['1 · SPEECH', 'TO TEXT'], ['2 · MODEL', ''], ['3 · TEXT TO', 'SPEECH']];
  boxes.forEach(([a, c], i) => {
    const x = 56 + i * 124;
    bpBox(b, x, 138, 104, 46, done, 0);
    bpText(b, a, x + 6, 144, done, 0); if (c) bpText(b, c, x + 6, 154, done, 0);
    tinyFigure(b, x + 80, 180, {arm: 'pass'});
    if (i < 2) { L(b, x + 104, 160, x + 124, 160); L(b, x + 120, 157, x + 124, 160); L(b, x + 120, 163, x + 124, 160); }
  });
  L(b, 38, 160, 56, 160); mouth(b, 446, 160, false); L(b, 428, 160, 438, 160);
  // the grate at box 1, the words falling through it and out of the diagram; the [laughter] tag at the bottom
  for (let i = 0; i < 9; i++) L(b, 60 + i * 10, 190, 60 + i * 10, 198, BPX.mid); L(b, 58, 190, 148, 190, BPX.mid); L(b, 58, 198, 148, 198, BPX.mid);
  const fell = st.fell ?? 4;
  ['TONE', 'LAUGHTER', "WHO'S TALKING", 'BACKGROUND NOISE'].forEach((w, i) => { if (i < fell) bpText(b, w, 60 + (i % 2) * 40, 204 + i * 10, done, 0, {col: BPX.faint}); });
  bpText(b, 'laughter', 68, 248, done, 0, {col: BPX.mid}); for (const [bx, d] of [[64, 1], [68 + 8 * 5 + 2, -1]] as Array<[number, number]>) { L(b, bx, 247, bx, 256, BPX.mid); L(b, bx, 247, bx + d * 2, 247, BPX.mid); L(b, bx, 256, bx + d * 2, 256, BPX.mid); }
  // NOW: an ear, an eye and a mouth wired into one box
  bpText(b, 'NOW', 260, 206, done, 0, {big: true});
  bpBox(b, 300, 236, 120, 40, done, 0, {double: true});
  bpText(b, 'GTP-4o', 336, 250, done, 0, {big: true});
  ear(b, 256, 252); eye(b, 270, 280); mouth(b, 450, 256, !!st.laugh);
  L(b, 264, 252, 300, 252); L(b, 278, 280, 300, 266); L(b, 420, 256, 440, 256);
  if (st.laugh) bpText(b, 'ha', 452, 240, done, 0, {col: BPX.hot});
  // the three steps
  const stamps = st.stamps ?? 3;
  if (stamps >= 1) { bpStamp(b, ['1.'], 40, 312, 2, {big: true}); bpText(b, '232 MS (AVG 320)', 64, 306, done, 0); tinyFigure(b, 220, 324, {arm: 'down'}); bubble(b, 230, 296, 20, 12); bpText(b, 'hi', 235, 299, done, 0, {col: BPX.hot}); }
  if (stamps >= 2) {
    bpStamp(b, ['2.'], 40, 360, 2, {big: true});
    // a tiny calendar, MON circled, a tiny RADNUS standing on the Tuesday square
    bpBox(b, 64, 344, 120, 26, done, 0);
    ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach((d, i) => { micro(b, d, 68 + i * 23, 348, BPX.line); if (i) L(b, 64 + i * 24, 344, 64 + i * 24, 370, BPX.mid); });
    inkPath(b, ellipsePts(74, 351, 9, 5), 9999, BPX.hot);
    tinyFigure(b, 100, 368, {arm: 'down', col: BPX.mid});
  }
  if (stamps >= 3) {
    bpStamp(b, ['3.'], 40, 408, 2, {big: true});
    bpText(b, '$0', 64, 400, done, 0, {big: true});
    const n = Math.round((st.crowd ?? 1) * 18);
    for (let k = 0; k < n; k++) tinyFigure(b, 110 + k * 12 + (k % 2) * 3, 420 + (k % 3) * 3, {arm: k % 4 === 0 ? 'up' : 'down', col: k % 2 ? BPX.mid : BPX.line});
  }
  // the last square: the tiny stage, tiny lights, tiny Rima in a tiny spotlight
  bpBox(b, 300, 440, 160, 80, done, 0);
  L(b, 304, 500, 456, 500);
  for (let k = 0; k < 6; k++) { const lx = 316 + k * 26; inkPath(b, ellipsePts(lx, 452, 3, 2), 9999, BPX.hot); L(b, lx, 455, lx - 8 + k * 3, 498, BPX.faint); }
  tinyFigure(b, 380, 500, {arm: 'down', skirt: true});
  inkPath(b, ellipsePts(380, 500, 12, 3), 9999, BPX.hot);
  bpDim(b, 300, 460, 530, 'MAY 13', done, 0);
  sheetCache.set(key, b); if (sheetCache.size > 24) sheetCache.delete(sheetCache.keys().next().value as string);
  return b;
};
export const planFrame = (b: Buf, f: number, st: PlanSt = {}) => {
  const base = planSheet(f, st);
  const sheet = base.clone();
  // the empty bubble from the margin: no words in it, lowercase-sized, drifting over the tiny stage and its lights
  const bub = st.bubble ?? 0;
  if (bub > 0) {
    const bx = Math.round(500 - bub * 170), by = 444 + Math.round(Math.sin(bub * 3) * 4);
    for (let j = 0; j < 30; j++) for (let i = 0; i < 46; i++) sheet.set(bx + i, by + j, BPX.navy); // it blots out what's under it
    bubble(sheet, bx, by, 46, 30, BPX.hot);
  }
  const k = st.tear ?? -1;
  const t = tearAt(k);
  bpComposite(b, sheet, {oy: clamp(Math.round(st.pan ?? 0), 0, 540 - RH), behind: st.behind, tear: k >= 0 ? {y: 120, run: t.run, up: t.up, down: t.down, from: 'left'} : null});
};

/** the real stage lights the tear reveals (the frame behind the paper) */
const stageLights = (): Buf => { const b = new Buf(480, 270, PAL.N0); for (let k = 0; k < 9; k++) { const x = 30 + k * 52; for (let y = 0; y < RH; y++) { const hw = 2 + y * 0.12; for (let i = -hw; i <= hw; i++) if (hash(x + i, y, k) < 0.5) b.set(Math.round(x + i), y, y < 8 ? PAL.W9 : PAL.W6); } fill(b, x - 5, 0, 10, 6, PAL.W8); } return b; };
export const ART: ArtAsset[] = [{
  id: 'set11-plan', manifest: 'SET-11 · THE PLAN: OMNI (BLUEPRINT)', kind: 'set', name: 'THE PLAN: OMNI on the blueprint kit (a two-screen sheet the camera pans)',
  file: 'sets/plan.ts', exports: 'planFrame, planSheet, PLAN_PANS', scenes: '10',
  note: 'accurate on paper: the relay that drops TONE / LAUGHTER at the grate, GTP-4o, 232 MS (AVG 320), MON, $0; the empty bubble blots the tiny stage; the tear',
  stills: [
    {label: '10.01-10.02: the OMNI stamp; BEFORE: the clerks passing the note; the grate: TONE · LAUGHTER · WHO\'S TALKING · BACKGROUND NOISE fall through', draw: (b) => planFrame(b, 0, {pan: 40})},
    {label: '10.03-10.05: NOW: ear, eye, mouth wired into GTP-4o (it laughs back); 1. 232 MS (AVG 320) · 2. MON circled, tiny Radnus on Tuesday · 3. $0', draw: (b) => planFrame(b, 0, {pan: 230, laugh: true})},
    {label: '10.07: the empty bubble drifts over the tiny stage and blots its lights; the sheet tears to the real stage lights', draw: (b) => planFrame(b, 0, {pan: 337, bubble: 0.8, tear: 9, behind: stageLights()})},
  ],
}];
void rect; void line; void ellipse; void tiny; void bpArrow;
