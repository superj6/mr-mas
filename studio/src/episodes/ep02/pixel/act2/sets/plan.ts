// MR. MAS — Ep2 v1 · act2: THE PLAN: `OMNI` (sc 10), on the show-wide blueprint kit (shared/pixel/kits/blueprint.ts:
// cyan #7FDBFF on navy #0B1E3F, drawn in proxy colours and inked by bpComposite). The shots pass, 2026-10-09; the
// record is shots-act2.md. The art pass's SET-11 sheet (art/sets/plan.ts: the layout, its accurate content, the tiny
// figures) re-drawn here so the linework DRAWS ITSELF ON as Rima says it (the kit's grammar: whole-pixel strokes with a
// hot pen tip, lettering typed on, stamps that land with a kick): every element has its own start frame.
//   planFrame2(b, f, T, st)   the frame: the sheet as of scene frame f (T: each element's start frame, DONE for
//                             everything an earlier shot finished), viewed at st.pan, with the empty bubble, the tiny
//                             figures' look up, the blot and the tear (st.behind: the real stage the tear reveals)
//   DONE                      an element finished before this shot
//   PANS                      the camera's stops: the stamp, BEFORE, the grate, NOW, the steps, the stage
import {Buf, rect, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {bpSheet, bpBox, bpText, bpStamp, bpComposite, BPX, tearAt, inkPath, linePts, ellipsePts, bpDim, drawOn, rectPts, bpTextWidth} from '../../../../../shared/pixel/kits/blueprint';
import {micro} from '../../../../../shared/pixel/cast/bosses';
import {RH} from './common';

export const DONE = -100000;
export const PANS = {stamp: 0, before: 40, grate: 100, now: 150, steps: 250, stage: 337};
/** every element's start frame (scene frames); undefined = not on the paper yet */
export interface PlanT {
  icons?: [number?, number?, number?];
  stamp?: number; fine?: number;
  before?: number; boxes?: [number?, number?, number?]; note?: number;
  fell?: number; tag?: number;
  now?: number; gbox?: number; laugh?: number;
  s1?: number; eng?: number; s2?: number; s3?: number; crowd?: number;
  stage?: number;
}
const L = (b: Buf, x0: number, y0: number, x1: number, y1: number, n = 9999, col: number = BPX.line) => inkPath(b, linePts(x0, y0, x1, y1), n, col);
const on = (f: number, t0: number | undefined) => t0 !== undefined && f >= t0;
const prog = (f: number, t0: number | undefined, len: number, sp = 8) => (t0 === undefined ? 0 : t0 === DONE ? len : drawOn(f, t0, len, sp));
/** a tiny drafting figure: head circle, body, arms (art/sets/plan.ts tinyFigure, copied); look: the head a pixel up */
const tinyFigure = (b: Buf, x: number, y: number, o: {arm?: 'up' | 'pass' | 'down'; col?: number; skirt?: boolean; look?: boolean; n?: number} = {}) => {
  const c = o.col ?? BPX.line, n = o.n ?? 9999;
  inkPath(b, ellipsePts(x, y - 14 - (o.look ? 1 : 0), 3, 3), n, c, {tip: false});
  if (o.look) { b.set(x, y - 17, BPX.hot); }
  L(b, x, y - 11, x, y - 4, n, c);
  if (o.skirt) { L(b, x, y - 4, x - 3, y, n, c); L(b, x, y - 4, x + 3, y, n, c); } else { L(b, x, y - 4, x - 2, y, n, c); L(b, x, y - 4, x + 2, y, n, c); }
  if (o.arm === 'up') { L(b, x, y - 9, x - 4, y - 14, n, c); L(b, x, y - 9, x + 4, y - 14, n, c); }
  else if (o.arm === 'pass') { L(b, x, y - 9, x + 5, y - 9, n, c); L(b, x, y - 9, x - 3, y - 6, n, c); }
  else { L(b, x, y - 9, x - 3, y - 5, n, c); L(b, x, y - 9, x + 3, y - 5, n, c); }
};
const ear = (b: Buf, x: number, y: number, n = 9999, c: number = BPX.line) => { inkPath(b, ellipsePts(x, y, 6, 9, -Math.PI / 2, Math.PI * 1.4), n, c); inkPath(b, ellipsePts(x + 1, y + 1, 3, 4, -Math.PI / 2, Math.PI * 1.2), n, BPX.mid); };
const eye = (b: Buf, x: number, y: number, n = 9999) => { inkPath(b, ellipsePts(x, y, 8, 4), n, BPX.line); inkPath(b, ellipsePts(x, y, 2, 2), n, BPX.hot, {tip: false}); };
const mouth = (b: Buf, x: number, y: number, open: boolean, n = 9999) => { L(b, x - 8, y, x + 8, y, n); if (open) inkPath(b, ellipsePts(x, y + 2, 6, 3, 0, Math.PI), n, BPX.line); else inkPath(b, ellipsePts(x, y, 8, 3, 0, Math.PI), n, BPX.mid); };
const bubble = (b: Buf, x: number, y: number, w: number, h: number, col = BPX.line) => {
  L(b, x + 3, y, x + w - 3, y, 9999, col); L(b, x + 3, y + h, x + w - 3, y + h, 9999, col);
  L(b, x, y + 3, x, y + h - 3, 9999, col); L(b, x + w, y + 3, x + w, y + h - 3, 9999, col);
  for (const [cx, cy] of [[x + 1, y + 1], [x + w - 1, y + 1], [x + 1, y + h - 1], [x + w - 1, y + h - 1]]) b.set(cx, cy, col);
  L(b, x + 4, y + h, x, y + h + 5, 9999, col); L(b, x, y + h + 5, x + 9, y + h, 9999, col);
};

/** the sheet (proxies, 480 x 540) as of scene frame f */
const sheetAt = (f: number, T: PlanT, st: {look?: boolean}): Buf => {
  const b = new Buf(480, 540, BPX.navy);
  bpSheet(b, {});
  // the stamp OMNI and its fine print
  if (on(f, T.stamp)) bpStamp(b, ['OMNI'], 240, 50, T.stamp === DONE ? 9 : f - T.stamp!, {huge: true, double: true});
  if (on(f, T.fine)) bpText(b, '(o = omni)', 214, 80, f, T.fine === DONE ? -999 : T.fine!, {col: BPX.faint});
  // hears · sees · talks: an ear, an eye, a mouth, each drawing itself on her word
  const [ih, is, it] = T.icons ?? [];
  if (on(f, ih)) ear(b, 200, 102, prog(f, ih, 60, 6));
  if (on(f, is)) eye(b, 240, 102, prog(f, is, 60, 6));
  if (on(f, it)) mouth(b, 280, 100, false, prog(f, it, 60, 6));
  // BEFORE: the three-box relay as clerks passing a note
  if (on(f, T.before)) bpText(b, 'BEFORE', 20, 116, f, T.before === DONE ? -999 : T.before!, {big: true, cps: 1});
  const boxes = [['1 · SPEECH', 'TO TEXT'], ['2 · MODEL', ''], ['3 · TEXT TO', 'SPEECH']];
  const bt = T.boxes ?? [];
  boxes.forEach(([a, c], i) => {
    const t0 = bt[i];
    if (!on(f, t0)) return;
    const x = 56 + i * 124, d = t0 === DONE ? -999 : t0!;
    const done = bpBox(b, x, 138, 104, 46, f, d);
    bpText(b, a, x + 6, 144, f, done, {cps: 3}); if (c) bpText(b, c, x + 6, 154, f, done + 4, {cps: 3});
    if (f > done + 6) tinyFigure(b, x + 80, 180, {arm: 'pass'});
    if (i === 0) { L(b, 38, 160, 56, 160, prog(f, t0, 18, 4)); ear(b, 30, 160, prog(f, t0, 60, 6)); }
    if (i < 2 && f > done) { const n = prog(f, d === -999 ? DONE : done, 30, 4); L(b, x + 104, 160, x + 124, 160, n); if (n >= 20) { L(b, x + 120, 157, x + 124, 160); L(b, x + 120, 163, x + 124, 160); } }
    if (i === 2 && f > done) { L(b, 428, 160, 438, 160, prog(f, d === -999 ? DONE : done, 10, 4)); mouth(b, 446, 160, false, prog(f, d === -999 ? DONE : done + 2, 40, 6)); }
  });
  // the note passing from clerk to clerk (a small folded square), each a hop on 4s
  if (on(f, T.note) && T.note !== DONE) {
    const k = f - T.note!, hop = Math.floor(k / 8) % 3, u = (k % 8) / 8;
    const x0 = 56 + hop * 124 + 86, x1 = x0 + 124 * (hop < 2 ? 1 : 0) - (hop < 2 ? 0 : 0);
    const nx = Math.round(hop < 2 ? x0 + (x1 - x0) * u : x0), ny = 168 - Math.round(Math.sin(u * Math.PI) * 6);
    rect(nx, ny, 5, 4, b.ink(BPX.hot));
  }
  // the grate at box 1; the words drop through it and out of the diagram; backstage's [laughter] tag at the bottom
  if (on(f, bt[0])) { for (let i = 0; i < 9; i++) L(b, 60 + i * 10, 190, 60 + i * 10, 198, prog(f, bt[0], 8, 1), BPX.mid); L(b, 58, 190, 148, 190, prog(f, bt[0], 90, 6), BPX.mid); L(b, 58, 198, 148, 198, prog(f, bt[0], 90, 6), BPX.mid); }
  if (on(f, T.fell)) {
    ['TONE', 'LAUGHTER', "WHO'S TALKING", 'BACKGROUND NOISE'].forEach((w, i) => {
      const t = T.fell === DONE ? 99 : f - T.fell! - i * 6;
      if (t < 0) return;
      // each word starts on the grate's top, falls through it (held steps on 2s), and lands in its row below
      const yEnd = 204 + i * 10, y0 = 180;
      const y = t >= 14 ? yEnd : Math.min(yEnd, y0 + Math.round(((t - (t & 1)) / 14) ** 2 * (yEnd - y0)));
      bpText(b, w, 60 + (i % 2) * 40, y, f, -999, {col: BPX.faint});
    });
  }
  if (on(f, T.tag)) {
    bpText(b, 'laughter', 68, 248, f, T.tag === DONE ? -999 : T.tag!, {col: BPX.mid, cps: 3});
    for (const [bx, d] of [[64, 1], [68 + bpTextWidth('laughter') + 2, -1]] as Array<[number, number]>) { L(b, bx, 247, bx, 256, 9999, BPX.mid); L(b, bx, 247, bx + d * 2, 247, 9999, BPX.mid); L(b, bx, 256, bx + d * 2, 256, 9999, BPX.mid); }
  }
  // NOW: an ear, an eye and a mouth wired into one box
  if (on(f, T.now)) bpText(b, 'NOW', 260, 206, f, T.now === DONE ? -999 : T.now!, {big: true, cps: 1});
  if (on(f, T.gbox)) {
    const d = T.gbox === DONE ? -999 : T.gbox!;
    const done = bpBox(b, 300, 236, 120, 40, f, d, {double: true});
    bpText(b, 'GTP-4o', 336, 250, f, done, {big: true, cps: 1});
    ear(b, 256, 252, prog(f, T.gbox, 60, 6)); eye(b, 270, 280, prog(f, T.gbox, 60, 6));
    const laughing = on(f, T.laugh) && (T.laugh === DONE || f - T.laugh! < 40);
    mouth(b, 450, 256, laughing, prog(f, T.gbox, 60, 6));
    L(b, 264, 252, 300, 252, prog(f, T.gbox, 40, 4)); L(b, 278, 280, 300, 266, prog(f, T.gbox, 40, 4)); L(b, 420, 256, 440, 256, prog(f, d === -999 ? DONE : done, 20, 4));
    // the laugh in, the laugh back
    if (on(f, T.laugh)) { const k = T.laugh === DONE ? 99 : f - T.laugh!; if (k >= 0) bpText(b, 'ha', 236, 236, f, -999, {col: BPX.hot}); if (k >= 6) bpText(b, 'ha', 452, 240, f, -999, {col: BPX.hot}); }
  }
  // 1. 232 MS (AVG 320): the tiny engineer opens his mouth and the tiny bubble has already answered
  if (on(f, T.s1)) { bpStamp(b, ['1.'], 40, 312, T.s1 === DONE ? 9 : f - T.s1!, {big: true}); bpText(b, '232 MS (AVG 320)', 64, 306, f, T.s1 === DONE ? -999 : T.s1! + 3, {cps: 3}); }
  if (on(f, T.eng)) {
    const k = T.eng === DONE ? 99 : f - T.eng!;
    const ex = k >= 30 ? 220 : 180 + Math.floor(k / 3) * 4;
    tinyFigure(b, ex, 324, {arm: 'down', look: st.look});
    if (k >= 30) { bubble(b, 230, 296, 20, 12); bpText(b, 'hi', 235, 299, f, -999, {col: BPX.hot}); b.set(ex + 1, 312, BPX.hot); }
  }
  // 2. MON: a tiny calendar, MON circled, a tiny RADNUS on the Tuesday square
  if (on(f, T.s2)) {
    const d = T.s2 === DONE ? -999 : T.s2!;
    bpStamp(b, ['2.'], 40, 360, T.s2 === DONE ? 9 : f - T.s2!, {big: true});
    bpBox(b, 64, 344, 120, 42, f, d, {speed: 20});
    ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach((dd, i) => { if (f > d + 4 + i) micro(b, dd, 68 + i * 23, 348, BPX.line); if (i) L(b, 64 + i * 24, 344, 64 + i * 24, 386, f > d + 3 ? 9999 : 0, BPX.mid); });
    inkPath(b, ellipsePts(74, 351, 9, 5), prog(f, T.s2 === DONE ? DONE : d + 6, 60, 8), BPX.hot);
    // his square carries his own block, as on Mas's calendar (8.04's ELGOOG keynote on TUE 14): a tiny filled tag
    // typed ELGOOG, the tiny Radnus standing under it (unmentioned; the tag is how a viewer knows him)
    if (f > d + 12) {
      for (let y = 354; y < 363; y++) for (let x = 89; x < 112; x++) b.set(x, y, y === 354 || y === 362 ? BPX.mid : BPX.faint);
      micro(b, 'ELGOOG'.slice(0, Math.max(0, f - d - 13)), 89, 356, BPX.hot);
    }
    if (f > d + 10) tinyFigure(b, 100, 384, {arm: 'down', col: BPX.mid, look: st.look});
  }
  // 3. $0, and a tiny crowd floods in
  if (on(f, T.s3)) {
    bpStamp(b, ['3.'], 40, 408, T.s3 === DONE ? 9 : f - T.s3!, {big: true});
    bpText(b, '$0', 64, 400, f, T.s3 === DONE ? -999 : T.s3! + 2, {big: true, cps: 1});
  }
  if (on(f, T.crowd)) {
    const k = T.crowd === DONE ? 999 : f - T.crowd!;
    for (let q = 0; q < 18; q++) {
      // they file in from the right in held steps, each to its own place
      const tx = 110 + q * 12 + (q % 2) * 3, start = q * 2, kk = k - start;
      if (kk < 0) continue;
      const x = kk >= 20 ? tx : Math.round(tx + (470 - tx) * (1 - (kk - (kk & 1)) / 20));
      tinyFigure(b, x, 420 + (q % 3) * 3, {arm: q % 4 === 0 && kk >= 20 ? 'up' : 'down', col: q % 2 ? BPX.mid : BPX.line, look: st.look && kk >= 20});
    }
  }
  // the last square: the tiny stage, its tiny lights, tiny Rima in a tiny spotlight
  if (on(f, T.stage)) {
    const d = T.stage === DONE ? -999 : T.stage!;
    const done = bpBox(b, 300, 440, 160, 80, f, d);
    if (f > done) {
      L(b, 304, 500, 456, 500, prog(f, d === -999 ? DONE : done, 160, 10));
      for (let q = 0; q < 6; q++) { const lx = 316 + q * 26; if (f > done + 4 + q * 2) { inkPath(b, ellipsePts(lx, 452, 3, 2), 9999, BPX.hot, {tip: false}); L(b, lx, 455, lx - 8 + q * 3, 498, 9999, BPX.faint); } }
      if (f > done + 18) { tinyFigure(b, 380, 500, {arm: 'down', skirt: true, look: st.look}); inkPath(b, ellipsePts(380, 500, 12, 3), 9999, BPX.hot, {tip: false}); }
      if (f > done + 24) bpDim(b, 300, 460, 530, 'MAY 13', f, d === -999 ? -999 : done + 24);
    }
  }
  return b;
};

export interface PlanSt { pan: number; bubble?: number; blot?: boolean; tear?: number; behind?: Buf; look?: boolean; cell?: boolean }
/** the frame: the sheet at f, the empty bubble (st.bubble 0..1 drifting in from the right margin, nothing in it,
 *  lowercase-sized), its blot over the tiny stage's lights, the tear (st.tear: frames since it) to st.behind */
export const planFrame2 = (b: Buf, f: number, T: PlanT, st: PlanSt) => {
  const sheet = sheetAt(f, T, {look: st.look});
  if (st.cell) {
    // the panel's last square, still lit: the grid's first cell (the match from 9.06)
    const C = {x: 224, y: 152 + Math.round(st.pan), s: 32}; // wings GRID_CELL, where 9.06's fifth cell settled
    for (const p of rectPts(C.x, C.y, C.s, C.s)) sheet.set(p[0], p[1], BPX.hot);
  }
  const bub = st.bubble ?? 0;
  if (bub > 0) {
    const bx = Math.round(500 - bub * 166), by = 448 + Math.round(Math.sin(bub * 5) * 3);
    // it blots out what's under it (the tiny lights go dark under it), a soft shadow under it on the paper
    for (let j = 0; j < 22; j++) for (let i = 0; i < 34; i++) sheet.set(bx + i, by + j, BPX.navy);
    for (let i = 2; i < 36; i++) if (hash(i, 1, 4) < 0.6) sheet.set(bx + i, by + 24, BPX.minor);
    bubble(sheet, bx, by, 34, 22, BPX.hot);
    if (st.blot) for (let q = 0; q < 6; q++) { const lx = 316 + q * 26; if (lx > bx - 6 && lx < bx + 40) for (let j = -3; j <= 3; j++) for (let i = -4; i <= 4; i++) if (sheet.get(lx + i, 452 + j) === BPX.hot) sheet.set(lx + i, 452 + j, BPX.minor); }
  }
  const k = st.tear ?? -1;
  const t = tearAt(k);
  bpComposite(b, sheet, {oy: clamp(Math.round(st.pan), 0, 540 - RH), behind: st.behind, tear: k >= 0 ? {y: 104, run: t.run, up: t.up, down: t.down, from: 'left'} : null, neon: [PAL.W8, PAL.W9, PAL.P2, PAL.W7]});
};
