// MR. MAS — cast kit for the MEDIUM / TWO-SHOT tier (Ep1 act 4, draft 3.1; new file, owned by the act-4 medium-tier
// artist). pov-and-framing §4.1: `[M]` is a principal's waist-up rig, head ≈ 32–40 px (≈ 2.5–3× room scale),
// "every size is its own drawing, never a scaled sprite". §9.1 (engine-owner note): a medium rig may start from the
// portrait's PARTS, re-rasterized at medium coordinates (vector geometry, not pixels), with the faces then
// hand-placed. That is what this kit does:
//   scalePrim / scaleParts / scaleAdjust   re-rasterize a portrait's polygon geometry at k (0.5 = medium) + offset.
//                                          Pixel maps (P.map) and stamps never scale: they are dropped, and the rig
//                                          stamps its own medium-size eyes, brows, mouths, hands.
//   lookAt                                  a look vector (-1..1) from a point toward a target, for the Orb's iris.
//   Rigged medium figures return TWO images (same local coords): BACK (head + torso + upper arms, which the plate's
//   desk / table top overpaints below its far edge) and FRONT (forearms + hands on the desk top, drawn after it).
import {Buf} from '../px';
import {P} from '../figure';
import type {Adjust, Img, Part, Prim, Stamp} from '../figure';
import {blitTo} from './kit';

/** Re-rasterize one primitive at scale k about the origin, then offset. Maps are dropped (pixel art never scales). */
export const scalePrim = (p: Prim, k: number, ox = 0, oy = 0): Prim | null => {
  switch (p.k) {
    case 'poly': return {k: 'poly', pts: p.pts.map((v, i) => v * k + (i % 2 ? oy : ox))};
    case 'ell': return {k: 'ell', cx: p.cx * k + ox, cy: p.cy * k + oy, rx: Math.max(0.6, p.rx * k), ry: Math.max(0.6, p.ry * k)};
    case 'rect': return {k: 'rect', x: Math.round(p.x * k + ox), y: Math.round(p.y * k + oy), w: Math.max(1, Math.round(p.w * k)), h: Math.max(1, Math.round(p.h * k))};
    case 'line': return {k: 'line', x0: Math.round(p.x0 * k + ox), y0: Math.round(p.y0 * k + oy), x1: Math.round(p.x1 * k + ox), y1: Math.round(p.y1 * k + oy)};
    case 'map': return null;
  }
};
const prims = (ps: Prim[], k: number, ox: number, oy: number) => ps.map((p) => scalePrim(p, k, ox, oy)).filter((p): p is Prim => !!p);
export const scaleParts = (parts: Part[], k: number, ox = 0, oy = 0): Part[] => parts.map((pt) => ({...pt, prims: prims(pt.prims, k, ox, oy)}));
/** Adjust planes at scale; `keepLines` false drops 1px detail lines (hair strands read twice as heavy at half size). */
export const scaleAdjust = (adj: Adjust[], k: number, ox = 0, oy = 0, keepLines = true): Adjust[] =>
  adj.map((a) => ({...a, prims: prims(keepLines ? a.prims : a.prims.filter((p) => p.k !== 'line'), k, ox, oy)})).filter((a) => a.prims.length);

/** Shift stamps (x, y). */
export const moveStamps = (st: Stamp[], dx: number, dy: number): Stamp[] => st.map((s) => ({...s, x: s.x + dx, y: s.y + dy}));

/** Iris dart inside an eye stamp: the iris letters (default i I g) shift d px inside the white; lids stay put. */
export const dartRows = (rows: string[], d: number, iris = /[iIg]/): string[] => rows.map((r) => {
  if (!d || !iris.test(r)) return r;
  const ch = r.split(''), out = ch.map((c) => (iris.test(c) ? 'w' : c));
  ch.forEach((c, i) => { if (iris.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
  return out.join('');
});

/** Flip-aware blit for a rig image whose authored facing is camera-left (flip = face camera-right). */
export const blitRig = (b: Buf, img: Img, x: number, y: number, o: {flip?: boolean; map?: (c: number, x: number, y: number) => number; clip?: (x: number, y: number) => boolean} = {}) =>
  blitTo(b, img, x, y, {flip: o.flip, map: o.map, clip: o.clip});

/** Local anchor -> frame coords for a rig drawn at (x, y), honouring flip. */
export const rigPoint = (img: {w: number}, x: number, y: number, p: [number, number], flip = false): [number, number] => [x + (flip ? img.w - 1 - p[0] : p[0]), y + p[1]];

/**
 * The look vector for the Orb (or any eye) at (fx, fy) aimed at a target (tx, ty): x -1 (screen-left) .. 1, y -1 (up)
 * .. 1. `depth` = how far in front of the frame plane the target sits, in px (bigger = a gentler look).
 */
export const lookAt = (fx: number, fy: number, tx: number, ty: number, depth = 40): [number, number] => {
  const dx = tx - fx, dy = ty - fy;
  const yaw = Math.atan2(dx, depth), pitch = Math.atan2(dy, Math.hypot(dx, depth));
  const c = (v: number) => Math.max(-1, Math.min(1, v));
  // drawOrb: yaw = look.x * 0.95, pitch = look.y * 0.8
  return [c(yaw / 0.95), c(pitch / 0.8)];
};

// ------------------------------------------------------------------ arms + hands at medium scale (figure parts)
// A forearm lying on a desk (or folded, or raised) and its hand, as renderFigure PARTS, so the rig's own light gives
// every piece its rim (lit side) and outline (shadow side): the sleeve, a rib cuff, the palm + fingers as one
// silhouette (the fingers split by 1px shadow lines) and the thumb as its own group (its own edge against the palm).
// Every size is a medium-native drawing: nothing here scales a portrait's hand.
export type V2 = [number, number];
const unit = (x: number, y: number): V2 => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
const at = (p: V2, d: V2, k: number, n?: V2, m = 0): V2 => [p[0] + d[0] * k + (n ? n[0] * m : 0), p[1] + d[1] * k + (n ? n[1] * m : 0)];
const segP = (a: V2, wa: number, b: V2, wb: number): Prim => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return {k: 'poly', pts: [a[0] + (nx * wa) / 2, a[1] + (ny * wa) / 2, b[0] + (nx * wb) / 2, b[1] + (ny * wb) / 2, b[0] - (nx * wb) / 2, b[1] - (ny * wb) / 2, a[0] - (nx * wa) / 2, a[1] - (ny * wa) / 2]};
};
export interface HandSpec {
  /** wrist point (where the cuff ends) */
  at: V2;
  /** direction from the wrist toward the fingertips */
  dir: V2;
  /** 1 = the thumb is on the left of `dir` (screen: the +n side, n = [-dir.y, dir.x]); -1 the other side */
  thumb: 1 | -1;
  len?: number;
  width?: number;
  /** 0 flat .. 1 a loose fist (fingers shorten and bunch) */
  curl?: number;
  /** thumb angle away from the palm (0 along the side .. 1 out wide) */
  thumbOut?: number;
  thumbLen?: number;
  /** hide the thumb (it is under the hand / behind the arm) */
  noThumb?: boolean;
}
export const handParts = (g: string, h: HandSpec, mat = 'skin', lit: V2 = [-0.9, -0.35]): {parts: Part[]; adjust: Adjust[]; tip: V2; thumbTip: V2} => {
  const d = unit(h.dir[0], h.dir[1]);
  const n: V2 = [-d[1], d[0]];
  const L = h.len ?? 9, Wd = h.width ?? 7, curl = h.curl ?? 0;
  const palmL = L * 0.52;
  const k = at(h.at, d, palmL);
  // one mitten silhouette: the wrist, the knuckle line (widest), the fingers' block rounding off at the tips
  const fl = (L - palmL) * (1 - curl * 0.55);
  const e = at(k, d, fl);
  const hw = Wd / 2, th = h.thumb;
  const mitt = P.poly(
    ...at(h.at, n, hw * 0.72), ...at(k, n, hw), ...at(k, d, fl * 0.7, n, hw * 0.96), ...at(e, d, -fl * 0.12, n, hw * 0.8),
    ...at(e, n, hw * 0.4), ...at(e, d, 0.25, n, 0), ...at(e, n, -hw * 0.45), ...at(e, d, -fl * 0.15, n, -hw * 0.86),
    ...at(k, d, fl * 0.6, n, -hw * 0.98), ...at(k, n, -hw), ...at(h.at, n, -hw * 0.72));
  const fingers: Prim[] = [mitt];
  const splits: Prim[] = [];
  // three short notches at the finger ends (the index is on the thumb side, the little finger shortest)
  for (let i = 0; i < 3; i++) {
    const s = (1 - i) * (Wd / 4) * th;
    const a = at(e, d, -Math.max(1.2, fl * 0.55), n, s), b = at(e, d, -0.2, n, s);
    splits.push({k: 'line', x0: Math.round(a[0]), y0: Math.round(a[1]), x1: Math.round(b[0]), y1: Math.round(b[1])});
  }
  const tips: V2[] = [e, e, e, e];
  const parts: Part[] = [{group: g + 'h', mat, tone: 3, prims: fingers}];
  const adjust: Adjust[] = [];
  // the shadow half of the hand (away from the key) a rung down, then the splits
  const sl = lit[0] * n[0] + lit[1] * n[1] > 0 ? -1 : 1;
  adjust.push({onlyMat: mat, tone: 2, prims: [P.poly(...at(h.at, n, sl * Wd * 0.22), ...at(k, n, sl * Wd * 0.26), ...at(at(k, d, fl), n, sl * Wd * 0.22), ...at(at(k, d, fl), n, sl * Wd * 0.62), ...at(k, n, sl * Wd * 0.62), ...at(h.at, n, sl * Wd * 0.45))]});
  adjust.push({onlyMat: mat, tone: 1, prims: splits});
  // the knuckle ridge catches the key: a lit row across the back of the hand
  const kr = [at(k, d, -0.5, n, -sl * hw * 0.7), at(k, d, -0.5, n, sl * hw * 0.15)];
  adjust.push({onlyMat: mat, tone: 4, prims: [{k: 'line', x0: Math.round(kr[0][0]), y0: Math.round(kr[0][1]), x1: Math.round(kr[1][0]), y1: Math.round(kr[1][1])}]});
  let thumbTip: V2 = at(h.at, n, h.thumb * Wd * 0.5);
  if (!h.noThumb) {
    const out = h.thumbOut ?? 0.15;
    const ta = at(h.at, d, palmL * 0.25, n, h.thumb * Wd * 0.34);
    const td = unit(d[0] * (1 - out) + n[0] * h.thumb * out * 1.4, d[1] * (1 - out) + n[1] * h.thumb * out * 1.4);
    thumbTip = at(ta, td, h.thumbLen ?? L * 0.42);
    parts.push({group: g + 't', mat, tone: 3, prims: [segP(ta, 2.8, thumbTip, 2.1)]});
  }
  return {parts, adjust, tip: tips[1], thumbTip};
};
/** a sleeve from the elbow to the wrist with a rib cuff; the lit plane runs along the side facing the key */
export const sleeveParts = (g: string, elbow: V2, wrist: V2, o: {w0?: number; w1?: number; mat?: string; lit?: V2; cuff?: number} = {}): {parts: Part[]; adjust: Adjust[]} => {
  const mat = o.mat ?? 'hood', w0 = o.w0 ?? 9, w1 = o.w1 ?? 7.5, lit = o.lit ?? [-0.9, -0.35];
  const d = unit(wrist[0] - elbow[0], wrist[1] - elbow[1]);
  const n: V2 = [-d[1], d[0]];
  const sl = lit[0] * n[0] + lit[1] * n[1] > 0 ? 1 : -1;
  const len = Math.hypot(wrist[0] - elbow[0], wrist[1] - elbow[1]);
  const cuff = o.cuff ?? 2;
  const cuffA = at(wrist, d, -cuff);
  const parts: Part[] = [
    {group: g, mat, tone: 2, prims: [P.ell(elbow[0], elbow[1], w0 * 0.5, w0 * 0.46), segP(elbow, w0, cuffA, w1)]},
    {group: g + 'c', mat, tone: 1, prims: [segP(at(cuffA, d, -0.5), w1 * 0.96, wrist, w1 * 0.9)]},
  ];
  const adjust: Adjust[] = [
    // the lit top of the sleeve (a third of its width, on the key side), and a hot line along its crest
    {onlyMat: mat, tone: 3, prims: [segP(at(elbow, n, sl * w0 * 0.26), w0 * 0.34, at(cuffA, n, sl * w1 * 0.24, d, -0.5), w1 * 0.3)]},
    {onlyMat: mat, tone: 4, prims: [{k: 'line', x0: Math.round(elbow[0] + n[0] * sl * w0 * 0.3), y0: Math.round(elbow[1] + n[1] * sl * w0 * 0.3), x1: Math.round(cuffA[0] + n[0] * sl * w1 * 0.3 - d[0] * Math.min(3, len * 0.2)), y1: Math.round(cuffA[1] + n[1] * sl * w1 * 0.3 - d[1] * Math.min(3, len * 0.2))}]},
  ];
  return {parts, adjust};
};
