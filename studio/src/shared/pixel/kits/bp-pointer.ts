// MR. MAS — shared kit: NELEH'S BLUEPRINT FIGURE WITH A DRAFTING POINTER (BP-NELEH-POINTER; Ep1 Act Four v5 art pass;
// new file, owned by the v5 art pass). THE PLAN is voiced in 5.0+: her figure (the one holding the glowing paper) stands
// at the right edge of the sheet from the stamp on and points at what she names; MADA's voice comes from his spinner
// icon, turning while he speaks (sc 25; S1.03-S1.05). Linework in the blueprint kit's proxies (BPX), so it inks with the
// sheet: draw it into the sheet BEFORE bpComposite (or over a finished frame with inkOver()).
//   bpNeleh(b, x, y, pose, f, o)   her figure, foot centre (x, y), facing camera-left (into the sheet). Poses:
//       {kind: 'rest'}                          pointer held upright at her side
//       {kind: 'point', at: [tx, ty], tap?}     the pointer aimed at a sheet point (a gesture: POINTER_LEN long, it never
//                                               reaches across the sheet); tap 1 = the tip's recoil drawing (2 px back).
//                                               A target beyond the pointer's reach gets a drafting LEADER: a dotted
//                                               line from the tip to it, ending in a hot tick (r3: the stills check read
//                                               her short pointer as aimed at THE QUIET VOTE, the nearest chair, when
//                                               she was naming MAS / CEO). leader: false turns it off.
//                                               callout {box, rail} (a4p5 r2): a drafting callout instead, routed
//                                               under every label to a hot arrow at the named box (see BpCallout)
//       {kind: 'down'}                          the pointer set down, lying on the floor line at her feet
//       {kind: 'walk', step}                    walking (walkStep drawings), the pointer left behind
//     o.glow   "us": her paper glows bright (the plate's page answers the word)
//     o.k      1 (sheet scale) | 2 (redrawn at twice the size for the 2x detail; strokes stay 1 px)
//     o.knock  clear the paper behind her figure first (a drafting knockout): at the sheet's right edge the double
//              border line would otherwise run through her body (the stills sheet read her as clipped by the frame)
//   pointAt(k, targets)            the aim at frame k from [[k0, [x, y]], ...] held keyframes (no tween: each new
//                                  target is a new drawing; `sweep()` gives 3 held in-betweens for a sweep)
//   sweep(k, k0, frames, from, to) an aim swept across in 3 held drawings (her pointer sweeping to the four)
//   bpTipIn(b, tip, dir, len, k)   the pointer's tip entering the 2x detail from off frame (the shaft and the hot tip)
//   bpVoice(b, x, y, f, speaking)  MADA's voice: his spinner icon at 2x, turning only while he speaks, with his name
//   bpBracket(b, x, y, w, h, k)    the named thing lights: hot corner brackets in 2 held drawings (on the tap)
//   inkOver(fb, paint)             paint proxies over an already-inked blueprint frame (demos, overlays)
import {Buf, rect} from '../px';
import {BPX, bpWalker, inkPath, linePts, bpSpinner, BLUEPRINT, WalkerKind} from './blueprint';
import {applyPalette} from '../palettes';
import {text, textWidth} from '../font';

export type BpNelehPose =
  | {kind: 'rest'}
  | {kind: 'point'; at: [number, number]; tap?: 0 | 1; leader?: boolean; callout?: BpCallout}
  | {kind: 'down'}
  | {kind: 'walk'; step: 0 | 1 | 2};
export const POINTER_LEN = 44;
/**
 * a4p5 r2: a drafting CALLOUT in place of the straight leader, for a named thing across the sheet. The prep check read
 * the straight leader (ending on the MAS / GERG bracket's corner, a pixel from ALYI's chair and label) as still
 * ambiguous: a dotted line across a row of labelled chairs can be read as ending on any of them. The callout never
 * crosses a label: from the pointer's tip it drops at 45 degrees to a RAIL (a row under every label and the four's ring),
 * runs along it and turns up into the named thing's bracket with a hot arrowhead at its centre. Dots are the bright
 * line ink, one on, one off (the old leader's mid ink, 1 on 2 off, was faint at 1x).
 *   box   the named thing's rect (the one bpBracket lights): the arrow ends at its bottom edge's centre
 *   rail  the rail's row (sheet y), below the box and clear of every label
 */
export interface BpCallout { box: [number, number, number, number]; rail: number }
const dotLine = (b: Buf, x0: number, y0: number, x1: number, y1: number, phase: number, c: number) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) if ((i + phase) % 2 === 0) b.set(Math.round(x0 + ((x1 - x0) * i) / Math.max(1, n)), Math.round(y0 + ((y1 - y0) * i) / Math.max(1, n)), c);
  return n + phase;
};
/** the callout path from the pointer's tip (ex, ey): 45 degrees down to the rail, along it, up into the box's centre */
export const bpCallout = (b: Buf, ex: number, ey: number, co: BpCallout) => {
  const [bx, by, bw, bh] = co.box;
  const tx = Math.round(bx + bw / 2), ty = by + bh + 1;
  const drop = Math.max(0, co.rail - ey), dir = tx < ex ? -1 : 1;
  const kx = ex + dir * Math.min(drop, Math.abs(tx - ex));
  let ph = dotLine(b, ex + dir * 2, ey + 2, kx, co.rail, 0, BPX.line);
  ph = dotLine(b, kx, co.rail, tx, co.rail, ph, BPX.line);
  dotLine(b, tx, co.rail, tx, ty + 2, ph, BPX.line);
  // the arrowhead, pointing up into the box
  b.set(tx, ty, BPX.hot); b.set(tx - 1, ty + 1, BPX.hot); b.set(tx, ty + 1, BPX.hot); b.set(tx + 1, ty + 1, BPX.hot);
  for (let i = -2; i <= 2; i++) b.set(tx + i, ty + 2, BPX.hot);
};
/** her pointing hand (foot-relative, sheet scale): the arm facing into the sheet */
const HAND = (x: number, y: number, k: number): [number, number] => [x - 4 * k, y - (11 + 14 - 5) * k];

export const bpNeleh = (b: Buf, x: number, y: number, pose: BpNelehPose, f: number, o: {glow?: boolean; k?: 1 | 2; knock?: boolean} = {}) => {
  const k = o.k ?? 1;
  const step = pose.kind === 'walk' ? pose.step : 0;
  if (o.knock) rect(x - 6 * k, y - 38 * k, 14 * k, 38 * k + 1, b.ink(BPX.navy));
  // her body: the kit's paper walker, facing camera-left (the paper on the near side), the page glowing
  bpWalker(b, 'paper' as WalkerKind, x, y, step, f, {flip: false, k, bright: o.glow});
  const [hx, hy] = HAND(x, y, k);
  if (pose.kind === 'rest') {
    // held upright at her side: a line from the hand up past her head, the tip hot
    inkPath(b, linePts(hx, hy + 2 * k, hx - 1 * k, hy - 22 * k), 999, BPX.line, {tip: false});
    b.set(hx - 1 * k, hy - 22 * k, BPX.hot);
    return;
  }
  if (pose.kind === 'down') {
    // lying on the floor line in front of her, parallel to it
    inkPath(b, linePts(x - 8 * k, y + 1, x - 8 * k - 30 * k, y + 1), 999, BPX.mid, {tip: false});
    b.set(x - 8 * k - 30 * k, y + 1, BPX.line);
    return;
  }
  if (pose.kind === 'walk') return;
  // pointing: a straight shaft from her hand toward the target, POINTER_LEN long (x k), the tip hot; a 2 px recoil on tap
  const [tx, ty] = pose.at;
  const dx = tx - hx, dy = ty - hy, d = Math.max(1, Math.hypot(dx, dy));
  const L = POINTER_LEN * k - (pose.tap ? 2 * k : 0);
  const ex = Math.round(hx + (dx / d) * L), ey = Math.round(hy + (dy / d) * L);
  // the arm: shoulder to hand, raised toward the aim
  const [sx, sy] = [x - 1 * k, y - 23 * k];
  inkPath(b, linePts(sx, sy, hx, hy), 999, BPX.line, {tip: false});
  inkPath(b, linePts(hx, hy, ex, ey), 999, BPX.line, {tip: false});
  rect(ex - (k > 1 ? 1 : 0), ey - (k > 1 ? 1 : 0), k, k, b.ink(BPX.hot));
  // the pointer's rubber tip: one more hot pixel along the shaft
  b.set(Math.round(ex - (dx / d) * 2), Math.round(ey - (dy / d) * 2), BPX.hot);
  // the leader: a drafting callout line, dotted (1 on, 2 off) from just past the tip to the target, a hot tick there
  if (pose.callout) { bpCallout(b, ex, ey, pose.callout); return; }
  const far = Math.hypot(tx - ex, ty - ey);
  if (pose.leader !== false && far > 10) {
    const n = Math.floor(far);
    for (let i = 4; i < n - 3; i += 3) b.set(Math.round(ex + ((tx - ex) * i) / n), Math.round(ey + ((ty - ey) * i) / n), BPX.mid);
    const ux = (tx - ex) / far, uy = (ty - ey) / far;
    // the tick: a short bar across the leader's end (a drafting arrow's cheaper cousin), and the target pixel hot
    b.set(tx, ty, BPX.hot);
    b.set(Math.round(tx - uy * 2), Math.round(ty + ux * 2), BPX.line); b.set(Math.round(tx + uy * 2), Math.round(ty - ux * 2), BPX.line);
    b.set(Math.round(tx - uy), Math.round(ty + ux), BPX.line); b.set(Math.round(tx + uy), Math.round(ty - ux), BPX.line);
  }
};
/** the held aim at frame k: [[k0, target], ...] sorted; before the first key she rests */
export const pointAt = (k: number, keys: Array<[number, [number, number]]>): BpNelehPose => {
  let cur: [number, number] | null = null;
  let t0 = -1;
  for (const [kk, at] of keys) if (k >= kk) { cur = at; t0 = kk; }
  if (!cur) return {kind: 'rest'};
  // a tap on each new target: the recoil drawing on its 2nd-3rd frame
  return {kind: 'point', at: cur, tap: k - t0 >= 2 && k - t0 < 4 ? 1 : 0};
};
/** a sweep from `from` to `to` in 3 held in-between drawings over `frames` (then it holds on `to`) */
export const sweep = (k: number, k0: number, frames: number, from: [number, number], to: [number, number]): BpNelehPose => {
  if (k < k0) return {kind: 'point', at: from};
  const s = Math.min(3, Math.floor(((k - k0) / Math.max(1, frames)) * 3));
  const t = s / 3;
  return {kind: 'point', at: [Math.round(from[0] + (to[0] - from[0]) * t), Math.round(from[1] + (to[1] - from[1]) * t)]};
};
/** the 2x detail: the pointer's shaft entering from off frame toward `tip`, redrawn at 2x (strokes 1 px, tip 2 x 2) */
export const bpTipIn = (b: Buf, tip: [number, number], dir: [number, number], len = 80, tap: 0 | 1 = 0) => {
  const d = Math.max(1e-6, Math.hypot(dir[0], dir[1]));
  const ux = dir[0] / d, uy = dir[1] / d;
  const tx = Math.round(tip[0] + ux * (tap ? 3 : 0)), ty = Math.round(tip[1] + uy * (tap ? 3 : 0));
  const bx = Math.round(tx + ux * len), by = Math.round(ty + uy * len);
  inkPath(b, linePts(bx, by, tx, ty), 999, BPX.line, {tip: false});
  inkPath(b, linePts(bx + 1, by, tx + 1, ty), 999, BPX.mid, {tip: false});
  rect(tx - 1, ty - 1, 3, 3, b.ink(BPX.hot));
};
/** MADA's voice in the plan: his spinner icon (2x), turning only while he speaks, his name small under it */
export const bpVoice = (b: Buf, x: number, y: number, f: number, speaking: boolean) => {
  rect(x - 13, y - 13, 27, 27, b.ink(BPX.navy));
  inkPath(b, linePts(x - 13, y - 13, x + 13, y - 13), 999, BPX.faint, {tip: false});
  inkPath(b, linePts(x - 13, y + 13, x + 13, y + 13), 999, BPX.faint, {tip: false});
  inkPath(b, linePts(x - 13, y - 13, x - 13, y + 13), 999, BPX.faint, {tip: false});
  inkPath(b, linePts(x + 13, y - 13, x + 13, y + 13), 999, BPX.faint, {tip: false});
  bpSpinner(b, x, y, speaking ? f : 0, !speaking, 2);
  const s = 'MADA';
  text(b, s, x - Math.floor(textWidth(s) / 2), y + 17, speaking ? BPX.line : BPX.mid);
};
/** what she names lights up: hot corner brackets round a sheet rect, in 2 held drawings (k 0-1 short, 2+ full) */
export const bpBracket = (b: Buf, x: number, y: number, w: number, h: number, k: number) => {
  if (k < 0) return;
  const a = k < 2 ? 3 : 6, c = k < 2 ? BPX.mid : BPX.hot;
  for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]] as Array<[number, number, number, number]>) {
    for (let i = 0; i < a; i++) { b.set(cx + dx * i, cy, c); b.set(cx, cy + dy * i, c); }
  }
};
/** paint blueprint proxies over an already-inked frame: `paint` draws into a keyed layer that is inked, then copied */
export const inkOver = (fb: Buf, paint: (b: Buf) => void) => {
  const KEY = 0x010203;
  const L = new Buf(fb.w, fb.h, KEY);
  paint(L);
  const mask = L.c.map((c) => (c === KEY ? 0 : 1));
  const inked = new Buf(fb.w, fb.h, 0);
  inked.c.set(L.c.map((c) => (c === KEY ? BPX.navy : c)));
  applyPalette(inked, BLUEPRINT);
  for (let i = 0; i < fb.c.length; i++) if (mask[i]) fb.c[i] = inked.c[i];
};
