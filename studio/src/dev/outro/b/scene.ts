// MR. MAS · outro B, "the Orb's verdict": the scene as ONE PixelScene definition per episode (pure; shared by the
// Remotion host and the Node preview). Frame numbers are FILE frames of the mock-up (the stand-in comes first, see
// timeline.ts); the comments below use outro frames (o = file frame - 24).
//
//   f0-23      STAND-IN   the episode's last frame (Ep1's button isn't built): the cold open's dark-room MEDIUM, f56-62
//   o0         cut to black on the downbeat. The band lights with the terms line and the pointer (held to o254).
//              The Orb, close, frame-right, steps up from black in 3 palette steps
//   o9         lit: the toast's header posts the scan target; o12 its catch-light glints (the title's glint)
//   o15-19     the iris swivels to the lens in 3 drawings (the intro bookend's gesture, f690-694)
//   o30-54     the scan fan sweeps down across the toast. [GLYPH-MASKED] in the cone's leading half only (o31-52): the
//              credits are tokens there; behind the cone's axis they have resolved into plain type, and they STAY as
//              type after it has passed (legible from about o42), so reading can start before the knee
//   o60, o75   the two credit chips land around that type on the knee's flat line (2.1, 2.2), straight
//   o90-112    the leap: the iris narrows one step per note (G Ab C F), looking harder at the viewer
//   o120       the verdict on the viewer, `viewer: human ✓` (the chime, C7); o135 the score's F5 -> C6
//   o150-154   a plain week: the iris relaxes back to its toast (3 drawings); o165 glint
//   Ep1 only, the moth stinger INSIDE bar 3 (the Orb still on screen): o138 the moth drops in from the top of frame,
//              bumbles across the Orb's lit lens, o150 the iris swivels down after it, o160 it settles beside the terms
//              line's final period (beside the words, never on one) and folds its wings; o165 the iris narrows on it
//   o179       the last frame: the cut to black takes everything together; the file holds 18 f of black after it
import {Buf, W, H, line} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {Mask} from '../../../shared/pixel/mask';
import type {GlyphStyle} from '../../../shared/pixel/glyph';
import type {PixelSceneProps} from '../../../shared/pixel/compose';
import {orbBob, orbLook} from '../../../shared/pixel/cast/orb-medium';
import {drawMedium} from '../../mcoldopen/medium';
import {T, PRE, EPS, EpId, EpData, oOf, toastLines, linePops} from './timeline';
import {BAND, drawBand, drawStandinLabel, drawChip, chipW, CHIP_H, tx, drawOrbClose, drawGlint, drawMoth, MOTH_REST, ORB, LOOKS, LOOK_IDLE, MothPose} from './art';

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'switch' | 'bg'>;

// ================================================================== layout
/** the toast's column (left-aligned, facing the Orb across the frame): rows [header, credit 1, credit 2], the verdict
 *  under them after a gap. The block sits on the Orb's eye line (ORB.cy 96). */
export const TOAST = {x: 32, y: [62, 77, 92], vy: 114};
/** where a row's type sits (the chip draws its type at x + 6, y + 2; the resolved scan type sits exactly there, so
 *  the text never moves when its chip lands) */
export const typeAt = (i: number): [number, number] => [TOAST.x + 6, TOAST.y[i] + 2];
/** the ink colour of the resolved scan type (before its chip lands) and of a chip's type */
export const INK_RESOLVED = PAL.C6;

// ================================================================== the Orb over time
/** Ep1: where the iris goes after the moth (3.3): down at the band, where it will land (the servo's 3 drawings) */
export const LOOK_MOTH: [number, number] = orbLook(ORB.cx, ORB.cy, MOTH_REST[0], MOTH_REST[1], 110);
const lookAt = (o: number, moth: boolean): [number, number] => {
  if (o < T.iris[0]) return LOOK_IDLE;
  if (o < T.iris[1]) return LOOKS[1];
  if (o < T.iris[2]) return LOOKS[2];
  if (o < T.idle[0]) return LOOKS[3];
  if (moth) {
    // from the lens to the moth: 3 drawings on 2s (like the intro's servo), then held on it to the cut
    const k = Math.min(3, Math.floor((o - T.idle[0]) / 2) + 1);
    return [LOOK_MOTH[0] * k / 3, LOOK_MOTH[1] * k / 3];
  }
  if (o < T.idle[1]) return LOOKS[2];
  if (o < T.idle[2]) return LOOKS[1];
  return LOOK_IDLE;
};
const fadeStep = (o: number) => (o < T.fade[1] ? -3 : o < T.fade[2] ? -2 : o < T.fade[3] ? -1 : 0);
const scanning = (o: number) => o >= T.cone[0] && o <= T.cone[1];
/** the aperture: idle 0.5, wide while scanning, then one held step narrower per note of the leap, back at the verdict;
 *  Ep1: one step narrower again on the moth at 3.4 */
const THINK_AP = [0.38, 0.28, 0.19, 0.1];
const apertureAt = (o: number, moth: boolean) => {
  if (scanning(o)) return 1;
  if (o >= T.think[0] && o < T.verdict) {
    let k = 0;
    while (k < T.think.length - 1 && o >= T.think[k + 1]) k++;
    return THINK_AP[k];
  }
  if (moth && o >= T.squint) return THINK_AP[0];
  return 0.5;
};

// ================================================================== the scan fan
/** per-frame [direction deg, half-angle deg]. 180 = straight left; > 180 = above the Orb's eye line. It opens above
 *  the toast, sweeps down through it and past it, and closes (whole frames). */
export const fanAt = (o: number): [number, number] => {
  const k = o - T.cone[0];
  const OPEN: Array<[number, number]> = [[197, 2], [197, 4], [196, 6]];
  const CLOSE: Array<[number, number]> = [[170, 6], [169, 4], [169, 3], [169, 1]];
  if (k < OPEN.length) return OPEN[k];
  const s0 = T.cone[0] + OPEN.length, s1 = T.cone[1] - CLOSE.length + 1; // o33 .. o50
  if (o < s1) return [Math.round((196 - ((o - s0) / (s1 - 1 - s0)) * 26) * 2) / 2, 6];
  return CLOSE[Math.min(CLOSE.length - 1, o - s1)];
};
const CONE_LEN = 440;
const angleOf = (x: number, y: number, ax: number, ay: number) => {
  let a = (Math.atan2(y + 0.5 - ay, x + 0.5 - ax) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
};
/** the cone split at its axis: [lead] = the side it's sweeping into (tokens), [trail] = the side it has passed (type) */
const coneHalves = (ax: number, ay: number, dir: number, half: number) => {
  const lead = new Mask(), trail = new Mask();
  for (let y = 0; y < BAND.y; y++)
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x + 0.5 - ax, y + 0.5 - ay);
      if (d < 8 || d > CONE_LEN) continue;
      const rel = angleOf(x, y, ax, ay) - dir; // + = above the axis (already swept), - = below it (sweeping into)
      if (Math.abs(rel) > half) continue;
      (rel >= 0 ? trail : lead).a[y * W + x] = 255;
    }
  return {lead, trail};
};

// ================================================================== the credits, as the scan's "true world"
/** the credit lines (rows 1..) as plain resolved type on black: what the scan finds. The header is not in it (it
 *  posted before the scan), nor the verdict (the Orb hasn't decided yet). */
const creditSource = (e: EpData) => {
  const b = new Buf(W, H, PAL.N0);
  toastLines(e).forEach((s, i) => { if (i > 0) { const [x, y] = typeAt(i); tx(b, s, x, y, INK_RESOLVED); } });
  return b;
};
const glyphStyle = (e: EpData): GlyphStyle => ({
  cell: e.cell, bg: PAL.N1, bloom: 0.8, tint: PAL.C6, tintAmt: 0.35, noise: 0.4, shimmer: 0.2, shimmerStep: 1,
  tone: {lo: 0.06, hi: 0.62, gamma: 0.8}, floor: 0.03, edges: false, seed: 23 + e.ep,
});

// ================================================================== the moth's flight (whole pixels, on 2s)
// Ep1, inside bar 3. In from the top of frame above the Orb, drawn to the brightest thing on screen: it bumbles across
// the Orb's lit lens (o144-148), drops away below it, and comes down onto the band from ABOVE and to the RIGHT of the
// terms line's end, so it never crosses a word of the terms line, the pointer or the toast. Positions are the sprite's
// centre (art.ts drawMoth); they and the drawing hold for 2 frames.
export const MOTH_WAY: Array<[number, number, number]> = [
  [T.mothIn, 452, -8], [T.mothIn + 4, 440, 30], [T.mothIn + 8, 412, 74], [T.mothIn + 10, 426, 92],
  [T.mothIn + 12, 404, 110], [T.mothIn + 15, 428, 148], [T.mothIn + 18, 462, 182], [T.mothIn + 20, 454, 204],
  [T.mothLand, MOTH_REST[0], MOTH_REST[1]],
];
const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
export const mothFlight = (o: number): {pose: MothPose; x: number; y: number} | null => {
  if (o < T.mothIn || o > T.out) return null;
  if (o >= T.mothLand) {
    if (o < T.mothFold[0]) return {pose: 'half', x: MOTH_REST[0], y: MOTH_REST[1]};
    if (o < T.mothFold[1]) return {pose: 'open', x: MOTH_REST[0], y: MOTH_REST[1]};
    if (o >= T.mothTwitch && o < T.mothTwitch + 2) return {pose: 'open', x: MOTH_REST[0], y: MOTH_REST[1]};
    return {pose: 'rest', x: MOTH_REST[0], y: MOTH_REST[1]};
  }
  const k = o - ((o - T.mothIn) % 2); // position and drawing hold for 2 frames
  let i = 0;
  while (i < MOTH_WAY.length - 2 && MOTH_WAY[i + 1][0] <= k) i++;
  const P = (j: number) => MOTH_WAY[Math.max(0, Math.min(MOTH_WAY.length - 1, j))];
  const [f1, x1, y1] = P(i), [f2, x2, y2] = P(i + 1), [, x0, y0] = P(i - 1), [, x3, y3] = P(i + 2);
  const t = Math.min(1, (k - f1) / Math.max(1, f2 - f1));
  const jit = (k - T.mothIn) / 2; // a moth's erratic 1 px wobble, deterministic
  const x = Math.round(cr(x0, x1, x2, x3, t) + [0, 1, 0, -1, 1, 0][jit % 6]);
  const y = Math.round(cr(y0, y1, y2, y3, t) + [0, -1, 1, 0, -1, 1, 0][jit % 7]);
  return {pose: jit % 2 ? 'half' : 'open', x, y};
};

// ================================================================== the scene
export const makeScene = (epId: EpId): SceneDef => {
  const e = EPS[epId];
  const lines = toastLines(e);
  const pops = linePops(e);
  const src = creditSource(e);
  const style = glyphStyle(e);
  // state handed from draw() to switch()/after() for the same frame (draw always runs first)
  const st: {f: number; glyph: Mask | null; cy: number} = {f: -1, glyph: null, cy: ORB.cy};
  // the scan's final axis: after the scan, everything above it has been read
  const DONE = fanAt(T.cone[1])[0];

  return {
    bg: PAL.N0,
    draw: (fb, f) => {
      st.f = f; st.glyph = null;
      if (f < PRE) { drawMedium(fb, 56 + (f % 7)); return; } // the stand-in: the cold open's f56-62 cycle
      const o = oOf(f);
      if (o > T.out) return; // after the cut: black
      const cy = ORB.cy + orbBob(o);
      st.cy = cy;
      const orbMask = new Uint8Array(W * H);
      drawOrbClose(fb, cy, lookAt(o, e.moth), apertureAt(o, e.moth), scanning(o), fadeStep(o), orbMask);
      // the resolved credits: every source pixel the scan's axis has already passed stays as type. (From o55 that is
      // all of them; while the cone is inside the toast it is the part above its axis.) The chips land over it later.
      if (o >= T.cone[0]) {
        const dir = scanning(o) ? fanAt(o)[0] : DONE;
        for (let y = 0; y < BAND.y; y++)
          for (let x = 0; x < W; x++) {
            const c = src.c[y * W + x];
            if (c === PAL.N0) continue;
            if (angleOf(x, y, ORB.cx + 0.5, cy + 0.5) >= dir) fb.c[y * W + x] = c;
          }
      }
      if (scanning(o)) {
        const [dir, half] = fanAt(o);
        const {lead, trail} = coneHalves(ORB.cx + 0.5, cy + 0.5, dir, half);
        for (let i = 0; i < orbMask.length; i++) if (orbMask[i]) { lead.a[i] = 0; trail.a[i] = 0; }
        const glyphOn = o >= T.glyph[0] && o <= T.glyph[1];
        // the beam's body: one rung above black (the resolved type already sits on the trail side)
        for (let i = 0; i < trail.a.length; i++) {
          if (fb.c[i] !== PAL.N0) continue;
          if ((lead.a[i] && !glyphOn) || trail.a[i]) fb.c[i] = PAL.N1;
        }
        if (glyphOn) st.glyph = lead;
      }
    },
    switch: (f) => (st.f === f && st.glyph ? {type: 'glyph', mask: st.glyph, source: src, style} : null),
    after: (ui, f) => {
      if (f < PRE) { drawStandinLabel(ui); return; } // the lookdev label lives on the stand-in only (art.ts)
      const o = oOf(f);
      if (o >= T.bandOut) return; // the cut: black to the end of the file
      drawBand(ui);
      const cy = st.f === f ? st.cy : ORB.cy + orbBob(o);
      // the scan fan's two edge rays: hot at the lens, cooling with distance, clipped at the band
      if (scanning(o)) {
        const [dir, half] = fanAt(o);
        for (const s of [-1, 1]) {
          const a = ((dir + s * half) * Math.PI) / 180;
          let k = 0;
          line(ORB.cx, cy, Math.round(ORB.cx + Math.cos(a) * CONE_LEN), Math.round(cy + Math.sin(a) * CONE_LEN), (x, y) => {
            k++;
            if (k < 9 || y >= BAND.y - 1) return;
            const col = k < 60 ? PAL.C8 : k < 170 ? PAL.C6 : PAL.C4;
            if (k > 170 && (x + y) % 2) return;
            ui.set(x, y, col);
          });
        }
        ui.set(ORB.cx, cy, PAL.C9);
      }
      // the toast: the header posts (a 2 px drop); the credit chips land AROUND their resolved type (no drop, so the
      // words never move while someone is reading them; Ep10's land before the scan, so they drop like the header)
      lines.forEach((s, i) => {
        const k = o - pops[i];
        const inPlace = i > 0 && !e.prefill;
        drawChip(ui, TOAST.x, TOAST.y[i], s, 'credit', inPlace && k >= 0 ? Math.max(1, k) : k, inPlace && k === 0);
      });
      drawChip(ui, TOAST.x, TOAST.vy, e.verdict, 'verdict', o - T.verdict);
      // the catch-light glint (Ep1's second one gives way to the moth)
      const g1 = o - T.glint1, g2 = e.moth ? -1 : o - T.glint2;
      if (g1 === 0 || g2 === 0) drawGlint(ui, cy, 2);
      else if (g1 === 1 || g2 === 1) drawGlint(ui, cy, 1);
      // Ep1: the moth, last (over the Orb's face as it passes the lens; its path never meets a word)
      if (e.moth) {
        const m = mothFlight(o);
        if (m) drawMoth(ui, m.pose, m.x, m.y);
      }
    },
  };
};

/** each toast row's box (native px, inclusive) [x0, y0, x1, y1]: rows 0..n-1, then the verdict */
export const rowBoxes = (e: EpData): Array<[number, number, number, number]> => {
  const out: Array<[number, number, number, number]> = toastLines(e).map((s, i) => [TOAST.x - 1, TOAST.y[i] - 3, TOAST.x + chipW(s), TOAST.y[i] + CHIP_H - 2]);
  out.push([TOAST.x - 1, TOAST.vy - 3, TOAST.x + chipW(e.verdict), TOAST.vy + CHIP_H - 2]);
  return out;
};
/** the toast's bounding box (for QA crops): [x0, y0, x1, y1] */
export const toastBox = (e: EpData): [number, number, number, number] => {
  const r = rowBoxes(e);
  return [Math.min(...r.map((b) => b[0])), Math.min(...r.map((b) => b[1])), Math.max(...r.map((b) => b[2])), Math.max(...r.map((b) => b[3]))];
};
