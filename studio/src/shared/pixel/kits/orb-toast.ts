// MR. MAS — kit: THE ORB's TOAST and SCAN FAN in the dark room (Ep1 sc 18, 19, 32; new file, owned by the `v3-art-b`
// pass). The toast is the Orb's signature prop (show/characters/the-orb.md): a small system notification that pops up
// beside it with the verdict. This is the intro bookend's chip (studio/src/dev/mfinale/bookend.ts drawToast: a C6 face,
// a C8 rule, N0 type, an N0 keyline, 11 px tall, the text + 12 px wide; it pops down into place in 2 held steps),
// re-drawn here because shared code doesn't import dev folders.
//   drawToast(b, x, y, s, k, o)   `verified: human` (kind 'verdict'), `re-scanning…` (kind 'working': dark cyan with a
//                                 3-drawing spinner), `catching up: 7 weeks` (kind 'note'); k = frames since it popped
//                                 (k 0 sits 2 px high); x, y = its top-left once settled; anchor 'right' puts x at its
//                                 right edge (a toast beside the Orb on the Orb's left)
//   drawScanFan(b, ax, ay, dir, half, o) the scan's thin cyan fan from the lens at (ax, ay): pixels inside it are lit by the
//                                 beam (a cyan wash on an ordered screen, the edges two dotted rays); returns the cone's
//                                 Mask for the GLYPH layer (the tokens live INSIDE the cone only)
//   fanSweep(k, n, from, to)      the fan's direction at step k of n (held steps, never a smooth sweep)
import {Buf, rect, bayer} from '../px';
import {PAL, nearest, FAMILIES, lightness} from '../palette';
import {Mask} from '../mask';
import {pt, pw} from './uitype';

export type ToastKind = 'verdict' | 'working' | 'note';
export const TOAST_H = 13;
export const toastW = (s: string, kind: ToastKind = 'verdict') => pw(s) + 12 + (kind === 'working' ? 9 : 0);
export const drawToast = (b: Buf, x: number, y: number, s: string, k: number, o: {kind?: ToastKind; anchor?: 'left' | 'right'; f?: number} = {}) => {
  if (k < 0) return {w: 0, h: 0};
  const kind = o.kind ?? 'verdict';
  const w = toastW(s, kind);
  const X = o.anchor === 'right' ? x - w : x, Y = y + (k === 0 ? -2 : 0);
  const face = kind === 'verdict' ? PAL.C6 : kind === 'working' ? PAL.C1 : PAL.N2;
  const rule = kind === 'verdict' ? PAL.C8 : kind === 'working' ? PAL.C5 : PAL.C4;
  const ink = kind === 'verdict' ? PAL.N0 : PAL.C8;
  rect(X - 1, Y - 1, w + 2, TOAST_H, b.ink(PAL.N0));
  rect(X, Y, w, 11, b.ink(face));
  rect(X, Y, w, 1, b.ink(rule));
  let tx = X + 6;
  if (kind === 'working') {
    // the spinner: three drawings on 4s, a quarter-ring of dots going round
    const st = Math.floor((o.f ?? 0) / 4) % 3;
    const dots: Array<Array<[number, number]>> = [[[1, 0], [3, 1], [3, 3]], [[3, 3], [1, 4], [0, 2]], [[0, 2], [1, 0], [3, 1]]];
    for (const [dx, dy] of dots[st]) b.set(tx + dx, Y + 3 + dy, PAL.C8);
    b.set(tx + 1, Y + 2 + 3, PAL.C4);
    tx += 9;
  }
  pt(b, s, tx, Y + 2, ink);
  return {w, h: TOAST_H};
};

// ------------------------------------------------------------------ the scan fan
const CYAN = FAMILIES.C;
/**
 * The fan from (ax, ay), pointing `dir` degrees (0 = screen-right, 90 = down), `half` degrees either side, out to
 * `len` px. Pixels inside are lit by the beam: each takes the cyan of its own lightness plus a step, on a 50% ordered
 * screen, so the room shows through; the two edge rays are dotted C7. Returns the cone's Mask.
 */
export const drawScanFan = (b: Buf, ax: number, ay: number, dir: number, half: number, o: {len?: number; rows?: number; strength?: 1 | 2} = {}): Mask => {
  const len = o.len ?? 420, rows = o.rows ?? 203;
  const m = new Mask(b.w, b.h);
  const d0 = (dir * Math.PI) / 180, h = (half * Math.PI) / 180;
  for (let y = 0; y < rows; y++) for (let x = 0; x < b.w; x++) {
    const dx = x + 0.5 - ax, dy = y + 0.5 - ay;
    const r = Math.hypot(dx, dy);
    if (r < 4 || r > len) continue;
    let a = Math.atan2(dy, dx) - d0;
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    if (Math.abs(a) > h) continue;
    m.a[y * b.w + x] = 255;
    const edge = Math.abs(Math.abs(a) - h) * r < 0.9;
    const c = b.get(x, y);
    if (edge) { if ((x + y) % 2 === 0) b.set(x, y, PAL.C7); continue; }
    const lit = nearest(c, CYAN);
    const L = lightness(c);
    const target = CYAN[Math.min(CYAN.length - 1, Math.max(1, CYAN.indexOf(lit) + (o.strength ?? 1)))];
    if (bayer(x, y) < (L < 0.2 ? 0.35 : 0.55)) b.set(x, y, target);
  }
  // the lens flare at the apex
  rect(ax - 1, ay - 1, 3, 3, b.ink(PAL.C8)); b.set(ax, ay, PAL.C9);
  return m;
};
/** held steps of a sweep: step k of n from `from` to `to` degrees (whole steps, never a smooth pan) */
export const fanSweep = (k: number, n: number, from: number, to: number) => from + ((to - from) * Math.min(n - 1, Math.max(0, k))) / Math.max(1, n - 1);
