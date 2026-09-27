// MR. MAS — Ep1 Act Four v5, EXTRA pixel assets: HANDS AT INSERT SCALE for the kept v4 shots whose hands were drawn
// stand-ins (art-needs-v5 P4 POLISH-STANDINS). New file, owned by the v5 extra art pass (a4fin-pixelextra). It builds on
// the capsule-hand renderer of shared/pixel/kits/inserts-hands.ts (renderCaps / viewCM / CEL), which it imports and
// does not edit: every hand is posed in centimetres and re-rasterised at its shot's px/cm (never an enlarged sprite),
// lit from its normals and quantised to the portraits' flat cel planes (no dither on skin).
//
//   nelehPenHand(o)       NELEH's right hand seen from straight above (the [HIGH] table overheads S3.02 and S4.14), a
//                         tripod grip on her pen / marker: 'rest' (the tip on the paper), 'lift' (tip and hand 1 cm up:
//                         between strokes, and for the run down the list). Returns the hand + barrel image with the TIP
//                         anchor (put it where the ink goes) and the wrist (where the sleeve starts).
//   drawNelehPenHand(b, tx, ty, o)   the same, drawn: the barrel, the hand, the navy blazer sleeve with the blouse cuff out
//                         to the frame's lower-right edge, and the hand's soft shadow on the paper (it closes to the tip
//                         when the tip touches, and parts from it on 'lift'). (tx, ty) = the pen's tip, the same anchor
//                         as v4's `nelehHand(fb, tx, ty)` in shots4.ts, so a v5 layout swaps the call one for one.
//   workerScrewHand(o)    the MAINTENANCE WORKER's right fist on a screwdriver, seen from the chair's back (S8.09): the
//                         tip on a screw head, the handle toward camera-right, the thumb along the handle; `turn` 0..2 is
//                         the fist rolled a third of a turn per drawing (four screws, one held drawing each).
//   drawWorkerScrewHand(b, sx, sy, o)  drawn with the worker's sleeve (charcoal work jacket, a hi-vis-free plain cuff) out to
//                         the frame's right edge; (sx, sy) = the screw head.
//   workerCarryHand(o) / drawWorkerCarryHand(b, x, y, o)  the same worker's hand carrying the small carton of spare 0
//                         plates by its near rim (S8.01, the lobby from low): fingers hooked over the rim, the thumb down
//                         the front face, the sleeve out through the frame's right edge (never across the sign).
//
// Skin: Neleh in the warm S ramp (as her portrait and her speakerphone hands); the worker in the same ramp one rung deeper
// (a different person, never a recolour of Mas). Light: 'table' = the boardroom pendant from above (S3.02 is her desk,
// S4.14 the boardroom table: both overheads are lit from above-left), 'boardroom' = the pendant's cool key on the chair
// back, 'lobby' = tungsten from above + neon cyan on the rim.
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {Img} from '../../../../../shared/pixel/figure';
import {Cap, CapLight, CEL, renderCaps, viewCM} from '../../../../../shared/pixel/kits/inserts-hands';

type V3 = [number, number, number];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/** a finger through its joint points (straight segments), with the joint creases on top, as inserts-hands' chain() */
const chain = (cap: ReturnType<typeof viewCM>['cap'], pts: V3[], r: number[], id: string, mat: Cap['mat'] = 'skin'): Cap[] =>
  pts.slice(0, -1).map((p, k) => ({...cap(p, pts[k + 1], r[k], r[k + 1], `${id}${k}`, 1, mat), creases: mat !== 'skin' ? undefined : k === 0 && pts.length > 3 ? [0.86, 0.93] : k === 1 && pts.length > 3 ? [0.84] : undefined}));
/** a fingernail riding the top of a distal segment (a -> b), from 40% to the tip */
const nailOn = (cap: ReturnType<typeof viewCM>['cap'], a: V3, b: V3, r: number, up: V3, id: string): Cap => {
  const p0 = add(lerp3(a, b, 0.42), mul(up, r * 0.9)), p1 = add(lerp3(a, b, 0.96), mul(up, r * 0.85));
  return cap(p0, p1, r * 0.56, r * 0.5, id, 0.3, 'nail');
};

// ------------------------------------------------------------------ colour maps (skin one rung deeper; Neleh's pen)
/** the worker's skin: the warm ramp one rung deeper (outline S0 stays; the rim stays a lit skin tone, never white) */
const DEEPER: Record<number, number> = {[PAL.S2]: PAL.S1, [PAL.S3]: PAL.S2, [PAL.S4]: PAL.S3, [PAL.S5]: PAL.S4, [PAL.S6]: PAL.S5, [PAL.W9]: PAL.S6};
export const deeperSkin = (c: number) => DEEPER[c] ?? c;
/** under the boardroom's cool pendant: the worker's skin in the mauve bridge + cyan-lit rungs, one rung deeper than Mas's */
const COOL_DEEP: Record<number, number> = {[PAL.X2]: PAL.X1, [PAL.X3]: PAL.X2, [PAL.K2]: PAL.X3, [PAL.K3]: PAL.K2, [PAL.K4]: PAL.K3};

// ================================================================== NELEH'S PEN HAND (overhead)
export type PenTool = 'pen' | 'marker';
export type PenPose = 'rest' | 'lift';
export interface PenHandOpts {
  /** px per cm (the table overhead: 3.3; the blueprint's step list is 20 px a line) */
  s?: number;
  pose?: PenPose;
  tool?: PenTool;
}
export interface HandImg { img: Img; tip: [number, number]; wrist: [number, number]; z: Float32Array; }
const PEN_S = 3.3;
const penCache = new Map<string, HandImg>();
/**
 * Her right hand from straight above (E 90), writing: a tripod grip 3 cm up the barrel (the thumb's pad on its left, the
 * index lying along its top, the middle finger under it), ring and pinky curled under the palm, the hand resting on its
 * pinky edge so the back of the hand faces up and to the right. The barrel leans back toward her, lower right.
 */
export const nelehPenHand = (o: PenHandOpts = {}): HandImg => {
  const s = o.s ?? PEN_S, pose = o.pose ?? 'rest', tool = o.tool ?? 'marker';
  const key = `${s}|${pose}|${tool}`;
  const hit = penCache.get(key);
  if (hit) return hit;
  const W = Math.ceil(20 * s), H = Math.ceil(19 * s);
  const ox = Math.round(3 * s), oy = Math.round(3 * s); // the tip in the image
  const {cap} = viewCM(s, ox, oy, 90);
  const lift: V3 = [0, 0, pose === 'lift' ? 1.0 : 0];
  const L = (p: V3): V3 => add(p, lift);
  const caps: Cap[] = [];
  // ---- a frame on the barrel: a = along it (from the tip up and back toward her, lower right), r = across it to its
  // right (upper right on screen), dz = height above the barrel's own line. The hand sits on the barrel's right side,
  // the barrel rests in the web between thumb and index and rises clear of the hand behind the knuckles.
  const dir = norm([0.40, 0.70, 0.52]);
  const right: V3 = [0.868, -0.496, 0];
  const P = (a: number, r: number, dz: number): V3 => L(add(add(mul(dir, a), mul(right, r)), [0, 0, dz]));
  const len = tool === 'marker' ? 14.6 : 14.0, rb = tool === 'marker' ? 0.7 : 0.42;
  caps.push(cap(P(0, 0, 0.05), P(tool === 'marker' ? 1.1 : 0.9, 0, 0), tool === 'marker' ? 0.2 : 0.12, rb * 0.92, 'nib', 1, 'nail'));
  caps.push(cap(P(tool === 'marker' ? 1.1 : 0.9, 0, 0), P(len, 0, 0), rb, rb, 'barrel', 1, 'cuff'));
  caps.push(cap(P(len - 1.3, 0, 0), P(len + 0.1, 0, 0), rb * 1.08, rb * 1.02, 'cap', 1, 'nail')); // the end cap: the marker's black cap / the pen's clip end
  const up: V3 = [0, 0, 1];
  // the index: its pad on the barrel's top 3.6 cm up, the finger arching along the barrel's right, the PIP the high point
  const pI: V3[] = [P(10.2, 3.0, -0.6), P(7.6, 1.8, 1.5), P(5.9, 1.2, 1.3), P(4.3, 0.75, rb + 0.55)];
  // the middle: under the barrel's right side at 2.5 cm, its knuckle beside the index's
  const pM: V3[] = [P(10.0, 4.8, -1.2), P(6.4, 3.4, 0.0), P(4.4, 2.4, -0.4), P(3.2, 1.2, -0.35)];
  // ring and pinky: curled under the palm
  const pR: V3[] = [P(9.5, 6.4, -2.0), P(7.7, 6.5, -3.3), P(8.3, 6.1, -4.6)];
  const pP: V3[] = [P(8.9, 7.8, -3.0), P(7.5, 7.6, -4.0), P(8.1, 7.2, -4.8)];
  // the back of the hand: one broad slab from the knuckle row down to the wrist, tipped onto its pinky edge
  caps.push(cap(P(15.6, 5.8, -4.8), P(19.5, 6.2, -6.4), 2.5, 2.4, 'wrist', 0.55));
  caps.push(cap(P(15.0, 5.6, -4.4), P(10.0, 5.0, -1.6), 2.7, 3.4, 'back', 0.36));
  [pI[0], pM[0], pR[0], pP[0]].forEach((k, i) => caps.push(cap(k, add(k, [0.05, -0.1, 0.08]), 0.95 - i * 0.06, 0.95 - i * 0.06, 'mcp' + i, 0.72)));
  caps.push(...chain(cap, pI, [0.98, 0.92, 0.84, 0.74], 'fi'));
  caps.push(nailOn(cap, pI[2], pI[3], 0.8, up, 'ni'));
  caps.push(...chain(cap, pM, [0.98, 0.92, 0.84, 0.76], 'fm'));
  caps.push(...chain(cap, pR, [0.94, 0.86, 0.78], 'fr'));
  caps.push(...chain(cap, pP, [0.84, 0.78, 0.7], 'fp'));
  // the thumb: from its mound by the wrist, on the barrel's left, its pad pressing the barrel at 3 cm
  const pT: V3[] = [P(11.8, 1.6, -3.6), P(8.2, -1.9, -2.0), P(5.5, -2.1, -0.8), P(3.6, -1.35, -0.2)];
  caps.push(cap(P(14.4, 3.8, -4.4), pT[0], 1.8, 1.5, 'thenar', 0.62));
  caps.push(...chain(cap, pT, [1.35, 1.2, 1.08, 0.94], 'th'));
  caps.push(nailOn(cap, pT[2], pT[3], 0.9, norm([-0.4, 0.1, 1]), 'nt'));
  const wristP = P(19.5, 6.2, -6.4);
  const light: CapLight = {key: [-0.35, -0.45, 0.82], back: {dir: [0.7, 0.5, 0.4], min: 0.84, col: PAL.S3}, cel: CEL};
  const r = renderCaps(W, H, caps, 'lobby', light);
  // the barrel's colour (it must read on THE PLAN's navy): a pale-grey paint marker with a black end cap, or a slim silver
  // pen with a cyan clip end; the nib ink-dark
  const bar = tool === 'marker'
    ? {[PAL.N0]: PAL.N0, [PAL.G0]: PAL.G3, [PAL.G1]: PAL.G4, [PAL.G2]: PAL.G5, [PAL.G3]: PAL.G6, [PAL.G4]: PAL.P1, [PAL.W6]: PAL.P2}
    : {[PAL.N0]: PAL.N0, [PAL.G0]: PAL.G2, [PAL.G1]: PAL.G3, [PAL.G2]: PAL.G4, [PAL.G3]: PAL.G5, [PAL.G4]: PAL.G6, [PAL.W6]: PAL.P2};
  for (let i = 0; i < r.img.c.length; i++) {
    const id = r.id[i];
    if (id < 0) continue;
    const c = caps[id];
    if (c.id === 'barrel') r.img.c[i] = (bar as Record<number, number>)[r.img.c[i]] ?? r.img.c[i];
    else if (c.id === 'nib') r.img.c[i] = PAL.N0;
    else if (c.id === 'cap') { const k = Math.min(2, Math.max(0, [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.W9].indexOf(r.img.c[i]) - 1)); r.img.c[i] = r.img.c[i] === PAL.S0 ? PAL.N0 : tool === 'marker' ? [PAL.N1, PAL.N2, PAL.N4][k] : [PAL.C3, PAL.C4, PAL.C6][k]; }
  }
  const out: HandImg = {img: r.img, tip: [ox, oy], wrist: [Math.round(ox + wristP[0] * s), Math.round(oy + wristP[1] * s)], z: r.z};
  penCache.set(key, out);
  return out;
};

/**
 * Her forearm in the navy blazer from the wrist out to the frame's lower right, the blouse cuff at the wrist. The sleeve
 * leaves the frame; it never ends in the picture. `put` paints one colour at (x, y).
 */
const blazerSleeve = (b: Buf, wx: number, wy: number, o: {w?: number; dir?: [number, number]} = {}) => {
  const [dx, dy] = o.dir ?? [0.62, 0.78];
  const w0 = o.w ?? 17;
  const nx = -dy, ny = dx; // across the sleeve
  const L = Math.ceil(Math.hypot(b.w, b.h));
  for (let t = 0; t < L; t++) {
    const w = w0 + t * 0.12;
    const cx = wx + dx * t, cy = wy + dy * t;
    if (cx - w > b.w + 2 || cy - w > b.h + 2) break;
    for (let u = -w / 2; u <= w / 2; u += 0.5) {
      const x = Math.round(cx + nx * u), y = Math.round(cy + ny * u);
      const e = u / (w / 2); // -1 (upper-right side, toward the key) .. 1
      const col = t < 3 ? (t < 2 ? PAL.P1 : PAL.P0) // the blouse cuff
        : Math.abs(e) > 0.92 ? PAL.N0 : e < -0.6 ? PAL.N5 : e < -0.1 ? PAL.N4 : e < 0.55 ? PAL.N3 : PAL.N2;
      b.set(x, y, col);
    }
  }
};

/** a soft cast shadow on the surface: every surface pixel under a hand pixel, offset by its height, one or two rungs down */
const castShadow = (b: Buf, img: Img, z: Float32Array, x0: number, y0: number, s: number, dir: [number, number], mask?: (x: number, y: number) => boolean) => {
  const seen = new Uint8Array(b.w * b.h);
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const k = j * img.w + i;
    if (img.c[k] < 0) continue;
    const h = Math.max(0, z[k]) / s; // cm above the surface
    const X = x0 + i + Math.round(dir[0] * h * s * 0.45), Y = y0 + j + Math.round(dir[1] * h * s * 0.45);
    if (X < 0 || Y < 0 || X >= b.w || Y >= b.h || seen[Y * b.w + X]) continue;
    if (mask && !mask(X, Y)) continue;
    seen[Y * b.w + X] = 1;
    b.set(X, Y, stepColor(b.get(X, Y), h > 4 ? -1 : -2));
  }
};

export interface DrawPenOpts extends PenHandOpts {
  /** paint the hand's shadow on what's under it (default true) */
  shadow?: boolean;
  /** clip everything to the picture area (default 203: the room band) */
  maxY?: number;
}
/** her pen hand with its tip at (tx, ty): shadow, sleeve, barrel + hand, in that order */
export const drawNelehPenHand = (b: Buf, tx: number, ty: number, o: DrawPenOpts = {}) => {
  const H = nelehPenHand(o);
  const x0 = tx - H.tip[0], y0 = ty - H.tip[1];
  const maxY = o.maxY ?? 203;
  const clip = (x: number, y: number) => y < maxY;
  if (o.shadow !== false) castShadow(b, H.img, H.z, x0, y0, o.s ?? PEN_S, [0.55, 0.8], clip);
  // the sleeve first (the hand's wrist sits over the cuff)
  const tmp = new Buf(b.w, b.h, 0);
  tmp.c.set(b.c);
  blazerSleeve(tmp, x0 + H.wrist[0], y0 + H.wrist[1]);
  for (let y = 0; y < Math.min(maxY, b.h); y++) for (let x = 0; x < b.w; x++) b.c[y * b.w + x] = tmp.c[y * b.w + x];
  for (let j = 0; j < H.img.h; j++) for (let i = 0; i < H.img.w; i++) {
    const c = H.img.c[j * H.img.w + i];
    if (c >= 0 && clip(x0 + i, y0 + j)) b.set(x0 + i, y0 + j, c);
  }
};

// ================================================================== THE WORKER'S SCREWDRIVER FIST (S8.09)
export interface ScrewHandOpts { s?: number; turn?: 0 | 1 | 2; }
const SCREW_S = 5.4;
const screwCache = new Map<string, HandImg & {handleEnd: [number, number]}>();
/**
 * The fist on a screwdriver whose tip sits in a screw head on the vertical chair back (the camera looks at the chair
 * back, E 0: world y is toward the camera, z up). The shaft comes out of the leather toward camera-right and a little
 * down; the handle is in the fist, the thumb laid along it toward the tip, the four fingers wrapped under it. `turn` rolls
 * the fist about the shaft by a third of a turn per drawing (the knuckles walk over the top), so a screw's four beats
 * read as turning, one held drawing each.
 */
export const workerScrewHand = (o: ScrewHandOpts = {}) => {
  const s = o.s ?? SCREW_S, turn = o.turn ?? 0;
  const key = `${s}|${turn}`;
  const hit = screwCache.get(key);
  if (hit) return hit;
  const W = Math.ceil(26 * s), H = Math.ceil(16 * s);
  const ox = Math.round(1.5 * s), oy = Math.round(5.5 * s); // the tip in the image
  const {cap, V} = viewCM(s, ox, oy, 8);
  const caps: Cap[] = [];
  // the shaft axis: out of the chair (toward camera, +y), to the right (+x), a little down (-z)
  const ax = norm([0.78, 0.55, -0.3]);
  const tip: V3 = [0, 0.1, 0], sEnd = add(tip, mul(ax, 6.2)), hA = sEnd, hB = add(tip, mul(ax, 16.5));
  caps.push(cap(tip, sEnd, 0.22, 0.3, 'shaft', 1, 'nail'));
  caps.push(cap(add(hA, mul(ax, -0.2)), add(hA, mul(ax, 1.2)), 0.7, 1.25, 'ferrule', 1, 'cuff'));
  caps.push(cap(add(hA, mul(ax, 1.2)), hB, 1.35, 1.25, 'handle', 1, 'cuff'));
  // a frame across the axis: u (up-ish), w (toward camera-ish); the roll turns it
  const upW: V3 = [0, 0, 1];
  const u0 = norm([upW[0] - ax[0] * ax[2], upW[1] - ax[1] * ax[2], upW[2] - ax[2] * ax[2]]);
  const w0: V3 = [ax[1] * u0[2] - ax[2] * u0[1], ax[2] * u0[0] - ax[0] * u0[2], ax[0] * u0[1] - ax[1] * u0[0]];
  const roll = (turn * 38 * Math.PI) / 180;
  const uu: V3 = add(mul(u0, Math.cos(roll)), mul(w0, Math.sin(roll))), ww: V3 = add(mul(w0, Math.cos(roll)), mul(u0, -Math.sin(roll)));
  const at = (a: number, u: number, w: number): V3 => add(add(add(tip, mul(ax, a)), mul(uu, u)), mul(ww, w));
  // the back of the hand: over the handle, from the knuckles (near the ferrule) back past the handle's end to the wrist
  caps.push(cap(at(10.2, 2.4, 1.2), at(15.2, 2.2, 2.0), 3.0, 2.8, 'back', 0.5));
  caps.push(cap(at(15.0, 2.0, 2.2), at(17.4, 1.8, 2.8), 2.5, 2.5, 'wrist', 0.6));
  // four fingers wrapped round the handle: each a ring of three segments from its knuckle over the top and under
  for (let i = 0; i < 4; i++) {
    const a = 9.4 + i * 1.75, r = 0.92 - i * 0.07;
    const pts: V3[] = [at(a + 0.6, 2.7, 1.6), at(a, 2.3, -0.6), at(a - 0.1, 0.2, -2.2), at(a - 0.2, -1.7, -1.3)];
    caps.push(cap(pts[0], add(pts[0], [0, 0, 0.1]), r * 1.05, r * 1.05, 'k' + i, 0.72));
    caps.push(...chain(cap, pts, [r, r * 0.95, r * 0.86, r * 0.78], 'f' + i));
  }
  // the thumb: from its mound on the near side, along the handle toward the tip, its nail up
  const t0 = at(14.8, 0.6, 2.6), t1 = at(11.6, 1.2, 2.2), t2 = at(8.8, 1.3, 1.5), t3 = at(7.2, 1.1, 1.2);
  caps.push(cap(at(16.8, 0.4, 2.6), t0, 1.7, 1.5, 'thenar', 0.62));
  caps.push(...chain(cap, [t0, t1, t2, t3], [1.3, 1.15, 1.02, 0.9], 'th'));
  caps.push(nailOn(cap, t2, t3, 0.9, uu, 'nt'));
  const light: CapLight = {key: [-0.45, 0.35, 0.82], back: {dir: [0.8, 0.2, 0.5], min: 0.86, col: PAL.C4}, cel: CEL};
  const r = renderCaps(W, H, caps, 'dark', light);
  // colours: the worker's skin one rung deeper than Mas's cool-lit hands; a steel shaft; an amber resin handle
  const AMBER: Record<number, number> = {[PAL.N0]: PAL.N0, [PAL.G0]: PAL.W1, [PAL.G1]: PAL.W2, [PAL.C1]: PAL.W3, [PAL.C2]: PAL.W4, [PAL.C4]: PAL.W6};
  for (let i = 0; i < r.img.c.length; i++) {
    const id = r.id[i];
    if (id < 0) continue;
    const c = caps[id];
    const v = r.img.c[i];
    if (c.id === 'shaft') r.img.c[i] = v === PAL.S0 ? PAL.N0 : v === PAL.X1 || v === PAL.X2 ? PAL.G3 : v === PAL.X3 ? PAL.G4 : PAL.G6;
    else if (c.id === 'ferrule') r.img.c[i] = v === PAL.N0 ? PAL.N0 : PAL.G3;
    else if (c.id === 'handle') r.img.c[i] = AMBER[v] ?? PAL.W5;
    else r.img.c[i] = COOL_DEEP[v] ?? v;
  }
  const he = V(add(tip, mul(ax, 19.5)));
  const out = {img: r.img, tip: [ox, oy] as [number, number], wrist: [Math.round(V(at(17.4, 1.8, 2.8))[0]), Math.round(V(at(17.4, 1.8, 2.8))[1])] as [number, number], z: r.z, handleEnd: [Math.round(he[0]), Math.round(he[1])] as [number, number]};
  screwCache.set(key, out);
  return out;
};

/**
 * The worker's sleeve: a charcoal work jacket with a plain knit cuff, from the wrist along `dir` for `fore` px (the
 * forearm), then bending at the elbow along `upper` out of the frame (the upper arm). It always leaves the frame.
 */
const workSleeve = (b: Buf, wx: number, wy: number, dir: [number, number], w0 = 20, maxY = 203, fore = 9999, upper: [number, number] = [0.3, 1]) => {
  const d0 = norm([dir[0], dir[1], 0]), d1 = norm([upper[0], upper[1], 0]);
  let cx = wx, cy = wy;
  for (let t = 0; t < 700; t++) {
    const bend = t >= fore;
    const [dx, dy] = bend ? [d1[0], d1[1]] : [d0[0], d0[1]];
    const nx = -dy, ny = dx;
    const w = w0 + Math.min(t, fore) * 0.1 + (bend ? 4 : 0);
    if (cx - w > b.w + 2 || cy - w > maxY + 2 || cx + w < -2 || cy + w < -2) break;
    for (let u = -w / 2; u <= w / 2; u += 0.5) {
      const x = Math.round(cx + nx * u), y = Math.round(cy + ny * u);
      if (y >= maxY) continue;
      const e = u / (w / 2);
      const col = t < 4 ? (Math.abs(e) > 0.9 ? PAL.N0 : e < -0.2 ? PAL.G2 : PAL.G1) // the knit cuff
        : Math.abs(e) > 0.93 ? PAL.N0 : e < -0.55 ? PAL.G3 : e < 0 ? PAL.G2 : e < 0.6 ? PAL.G1 : PAL.G0;
      b.set(x, y, col);
    }
    if (t >= 4 && t % 9 === 0 && !bend) for (let u = -w / 2 + 2; u <= w / 2 - 2; u += 3) b.set(Math.round(cx + nx * u), Math.round(cy + ny * u), PAL.G0); // a sleeve crease
    cx += dx; cy += dy;
  }
};

/**
 * The screwdriver fist with its tip on (sx, sy): the sleeve (forearm out to camera-right, the elbow, the upper arm down out
 * of the frame's foot), the fist, and a small contact shadow on the leather. `from: 'left'` mirrors the drawing (the same
 * worker reaching the left-hand screws from the left, so the fist never covers the plate's name); there is no lettering in
 * it, so the mirror is allowed (PIXEL_GUIDE: no mirrored frames WITH lettering).
 */
export const drawWorkerScrewHand = (b: Buf, sx: number, sy: number, o: ScrewHandOpts & {maxY?: number; from?: 'right' | 'left'} = {}) => {
  const H = workerScrewHand(o);
  const flip = o.from === 'left';
  const maxY = o.maxY ?? 203;
  const tmp = new Buf(b.w, b.h, 0);
  tmp.c.set(b.c);
  // compose in a right-handed frame, then copy (mirrored about the screw for 'left')
  const x0 = flip ? b.w - 1 - sx - H.tip[0] : sx - H.tip[0], y0 = sy - H.tip[1];
  const src = flip ? mirror(b) : b;
  castShadow(src, H.img, H.z, x0, y0, o.s ?? SCREW_S, [-0.35, 0.9], (x, y) => y < maxY);
  workSleeve(src, x0 + H.wrist[0] - 3, y0 + H.wrist[1], [0.9, 0.35], 30, maxY, 96, [0.35, 1]);
  for (let j = 0; j < H.img.h; j++) for (let i = 0; i < H.img.w; i++) {
    const c = H.img.c[j * H.img.w + i];
    if (c >= 0 && y0 + j < maxY) src.set(x0 + i, y0 + j, c);
  }
  if (flip) { const m = mirror(src); b.c.set(m.c); }
  void tmp;
};
const mirror = (b: Buf) => { const m = new Buf(b.w, b.h, 0); for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) m.c[y * b.w + x] = b.c[y * b.w + (b.w - 1 - x)]; return m; };

// ================================================================== THE WORKER'S CARRYING HAND (S8.01, the lobby from low)
export interface CarryHandOpts { s?: number; }
const carryCache = new Map<string, {img: Img; z: Float32Array; rim: [number, number]; wrist: [number, number]}>();
/**
 * One hand carrying a small carton by its near rim, seen from low in front (E 4: the camera on the lobby floor): the four
 * fingers hooked over the rim into the box (their middle knuckles on the rim), the thumb down the outside of the front
 * face, the back of the hand rising toward camera-right-up where the forearm leaves the frame. `rim` = the point on the
 * rim under the middle finger (put it on the carton's top edge); `wrist` = where the sleeve starts.
 */
export const workerCarryHand = (o: CarryHandOpts = {}) => {
  const s = o.s ?? 2.1;
  const key = `${s}`;
  const hit = carryCache.get(key);
  if (hit) return hit;
  const W = Math.ceil(24 * s), H = Math.ceil(26 * s);
  const ox = Math.round(8 * s), oy = Math.round(20 * s); // the rim point in the image
  const {cap, V} = viewCM(s, ox, oy, 4);
  const caps: Cap[] = [];
  // world: x right, y toward the camera, z up; the rim runs along x at (y 0, z 0); the box is behind it (y < 0)
  const kn: V3[] = [[-2.6, 1.3, 2.0], [-0.8, 1.5, 2.3], [1.0, 1.4, 2.2], [2.7, 1.1, 1.8]];
  // the back of the hand: from the knuckles up and back toward the wrist (up-right, toward the camera a little)
  caps.push(cap([0.2, 2.2, 2.6], [3.4, 3.6, 8.4], 3.0, 2.6, 'back', 0.42));
  caps.push(cap([3.2, 3.6, 8.2], [4.8, 4.2, 12.0], 2.4, 2.3, 'wrist', 0.6));
  kn.forEach((k, i) => {
    const r = 0.95 - Math.abs(i - 1.5) * 0.05;
    caps.push(cap(k, add(k, [0, 0.05, 0.1]), r * 1.02, r * 1.02, 'k' + i, 0.72));
    // over the rim and down inside the box: the proximal forward over the rim, the middle down behind it
    caps.push(...chain(cap, [k, [k[0] - 0.1, -0.4, 1.3], [k[0] - 0.15, -1.4, -1.2], [k[0] - 0.2, -1.2, -2.8]], [r, r * 0.93, r * 0.86, r * 0.78], 'f' + i));
  });
  // the thumb: from its mound down the outside of the front face
  caps.push(cap([2.6, 3.6, 5.2], [-2.6, 2.6, 3.6], 1.6, 1.4, 'thenar', 0.62));
  caps.push(...chain(cap, [[-2.6, 2.6, 3.6], [-4.0, 1.9, 1.0], [-4.4, 1.3, -1.4]], [1.3, 1.1, 0.96], 'th'));
  caps.push(nailOn(cap, [-4.0, 1.9, 1.0], [-4.4, 1.3, -1.4], 0.95, [0, 1, 0.1], 'nt'));
  const light: CapLight = {key: [0.3, 0.55, 0.78], back: {dir: [-0.9, 0.1, 0.4], min: 0.8, col: PAL.C4}, cel: CEL};
  const r = renderCaps(W, H, caps, 'lobby', light);
  for (let i = 0; i < r.img.c.length; i++) if (r.img.c[i] >= 0) r.img.c[i] = deeperSkin(r.img.c[i]);
  const w = V([4.8, 4.2, 12.0]);
  const out = {img: r.img, z: r.z, rim: [ox, oy] as [number, number], wrist: [Math.round(w[0]), Math.round(w[1])] as [number, number]};
  carryCache.set(key, out);
  return out;
};
/** the carrying hand with its rim point at (x, y); the sleeve runs out through the frame's right edge */
export const drawWorkerCarryHand = (b: Buf, x: number, y: number, o: CarryHandOpts & {maxY?: number} = {}) => {
  const H = workerCarryHand(o);
  const x0 = x - H.rim[0], y0 = y - H.rim[1];
  const maxY = o.maxY ?? 203;
  workSleeve(b, x0 + H.wrist[0] - 2, y0 + H.wrist[1] + 3, [1, -0.3], 15, maxY); // out through the frame's right edge, clear of the sign
  for (let j = 0; j < H.img.h; j++) for (let i = 0; i < H.img.w; i++) {
    const c = H.img.c[j * H.img.w + i];
    if (c >= 0 && y0 + j < maxY) b.set(x0 + i, y0 + j, c);
  }
};

/** rect re-export for hosts that clear a band */
export {rect};
