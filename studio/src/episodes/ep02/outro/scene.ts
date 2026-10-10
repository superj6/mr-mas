// MR. MAS · Ep2's outro: the scene as ONE PixelScene definition (pure; shared by the Remotion host and the Node
// preview). File frame = outro frame. Page 1 is Ep1's outro B plain week (studio/src/dev/outro/b/scene.ts, read, never
// edited); page 2 is Ep2's cast, scanned in the same grammar.
//   o0         cut to black on the downbeat. The Orb, close, frame-right, steps up from black in 3 palette steps
//   o9         lit: the toast's header posts the show and the file (`mr. mas · ep1.1_her.wav`); o12 a glint
//   o15-19     the iris swivels to the lens in 3 drawings
//   o30-54     the scan fan sweeps down across the toast: GLYPH tokens in the cone's leading half (o31-52), the credits
//              resolved into plain type behind its axis (legible from about o47)
//   o60, o75   the two credit chips land around that type on the knee's flat line (2.1, 2.2)
//   o90-112    the leap: the iris narrows one step per note
//   o120       the verdict, `viewer: verified: human` (the chime, C7); the lens LIGHTS; o135 the score's F5 -> C6
//   o150-154   the lamp goes out as the iris relaxes back to its toast; o165 glint
//   o180-186   4.1: the toast steps down three held rungs and clears (the page turns)
//   o186       the cast page's header chip posts: `voices · role: library voice`
//   o190-214   the second scan, top to bottom: the voice cast (two columns) and the tools resolve behind its axis
//   o240, o255 5.1, 5.2: the two tools chips land around their type
//   o315       a glint; o344 the last frame (the cut on 6.4 takes the Orb and the page together)
import {Buf, W, H, line, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {Mask} from '../../../shared/pixel/mask';
import type {GlyphStyle} from '../../../shared/pixel/glyph';
import type {PixelSceneProps} from '../../../shared/pixel/compose';
import {orbBob} from '../../../shared/pixel/cast/orb-medium';
import {T, PAGE1, VERDICT, CAST_HEAD, CAST_A, CAST_B, TOOLS} from './timeline';
import {drawChip, chipW, CHIP_H, tx, tw, drawOrbClose, drawLensGlow, drawGlint, ORB, LOOKS, LOOK_IDLE} from './art';

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'switch' | 'bg'>;

// ================================================================== layout
/** page 1, Ep1's toast column: rows [header, credit 1, credit 2], the verdict under them */
export const TOAST = {x: 32, y: [98, 113, 128], vy: 150};
export const typeAt = (i: number): [number, number] => [TOAST.x + 6, TOAST.y[i] + 2];
export const INK_RESOLVED = PAL.C6;
/** page 2: the header chip, then two columns of `role: voice` rows (type only: a session log the scan prints), then
 *  the two tools chips. Column A's type lines up with the chips' type (x + 6); column B starts 16 px past A's widest. */
const ROW = 11;
const roleW = (r: [string, string]) => tw(`${r[0]}: `);
const rowW = (r: [string, string]) => tw(`${r[0]}: ${r[1]}`);
export const PAGE2 = (() => {
  const x = TOAST.x, headY = 26, gridY = 44;
  const ax = x + 6;
  const bx = ax + Math.max(...CAST_A.map(rowW)) + 16;
  const rows = Math.max(CAST_A.length, CAST_B.length);
  const toolsY = [gridY + rows * ROW + 6, gridY + rows * ROW + 21];
  return {x, headY, gridY, ax, bx, rows, toolsY};
})();
/** where each cast row's type sits: [x, y] */
export const castAt = (col: 0 | 1, i: number): [number, number] => [col ? PAGE2.bx : PAGE2.ax, PAGE2.gridY + i * ROW];
/** the cast's ink: the role a step down (the field), the library voice bright (the value) */
export const INK_ROLE = PAL.C5;
export const INK_VOICE = PAL.C8;

// ================================================================== the Orb over time
const lookAt = (o: number): [number, number] => {
  if (o < T.iris[0]) return LOOK_IDLE;
  if (o < T.iris[1]) return LOOKS[1];
  if (o < T.iris[2]) return LOOKS[2];
  if (o < T.idle[0]) return LOOKS[3];
  if (o < T.idle[1]) return LOOKS[2];
  if (o < T.idle[2]) return LOOKS[1];
  return LOOK_IDLE; // back on its toast for the rest: the cast page is its toast
};
const fadeStep = (o: number) => (o < T.fade[1] ? -3 : o < T.fade[2] ? -2 : o < T.fade[3] ? -1 : 0);
const scanning1 = (o: number) => o >= T.cone[0] && o <= T.cone[1];
const scanning2 = (o: number) => o >= T.cone2[0] && o <= T.cone2[1];
export const scanning = (o: number) => scanning1(o) || scanning2(o);
/** the lens is lit while it scans, and from the verdict until the glance back (3.3), as a plain week */
export const lensLit = (o: number) => scanning(o) || (o >= T.lamp && o < T.idle[0]);
const glowAt = (o: number) => (!lensLit(o) ? 0 : o === T.lamp || o === T.lamp + 1 ? 1.5 : 1);
const THINK_AP = [0.38, 0.28, 0.19, 0.1];
const apertureAt = (o: number) => {
  if (scanning(o)) return 1;
  if (o >= T.think[0] && o < T.verdict) {
    let k = 0;
    while (k < T.think.length - 1 && o >= T.think[k + 1]) k++;
    return THINK_AP[k];
  }
  return 0.5;
};

// ================================================================== the scan fans
/** page 1's fan, Ep1's: [direction deg, half-angle deg] per frame (180 = straight left, > 180 above the eye line) */
export const fanAt = (o: number): [number, number] => {
  const k = o - T.cone[0];
  const OPEN: Array<[number, number]> = [[197, 2], [197, 4], [196, 6]];
  const CLOSE: Array<[number, number]> = [[170, 6], [169, 4], [169, 3], [169, 1]];
  if (k < OPEN.length) return OPEN[k];
  const s0 = T.cone[0] + OPEN.length, s1 = T.cone[1] - CLOSE.length + 1;
  if (o < s1) return [Math.round((196 - ((o - s0) / (s1 - 1 - s0)) * 26) * 2) / 2, 6];
  return CLOSE[Math.min(CLOSE.length - 1, o - s1)];
};
/** page 2's fan: the cast page spans about 222 deg (its top right, above the Orb) to 145 deg (the tools, below the eye
 *  line), so it opens higher and sweeps further, at the same 25 frames */
export const fan2At = (o: number): [number, number] => {
  const k = o - T.cone2[0];
  const OPEN: Array<[number, number]> = [[224, 2], [224, 4], [223, 6]];
  const CLOSE: Array<[number, number]> = [[144, 6], [143, 4], [143, 3], [143, 1]];
  if (k < OPEN.length) return OPEN[k];
  const s0 = T.cone2[0] + OPEN.length, s1 = T.cone2[1] - CLOSE.length + 1;
  if (o < s1) return [Math.round((223 - ((o - s0) / (s1 - 1 - s0)) * 79) * 2) / 2, 6];
  return CLOSE[Math.min(CLOSE.length - 1, o - s1)];
};
const fanFor = (o: number) => (scanning2(o) ? fan2At(o) : fanAt(o));
const CONE_LEN = 440;
const angleOf = (x: number, y: number, ax: number, ay: number) => {
  let a = (Math.atan2(y + 0.5 - ay, x + 0.5 - ax) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
};
const coneHalves = (ax: number, ay: number, dir: number, half: number) => {
  const lead = new Mask(), trail = new Mask();
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x + 0.5 - ax, y + 0.5 - ay);
      if (d < 8 || d > CONE_LEN) continue;
      const rel = angleOf(x, y, ax, ay) - dir;
      if (Math.abs(rel) > half) continue;
      (rel >= 0 ? trail : lead).a[y * W + x] = 255;
    }
  return {lead, trail};
};

// ================================================================== what the scans find (plain type on black)
const page1Source = () => {
  const b = new Buf(W, H, PAL.N0);
  PAGE1.forEach((s, i) => { if (i > 0) { const [x, y] = typeAt(i); tx(b, s, x, y, INK_RESOLVED); } });
  return b;
};
/** one cast row: the role a step down, then the voice where `role: ` ends (inks overridable for masks) */
export const castRow = (b: Buf, r: [string, string], x: number, y: number, inkRole = INK_ROLE, inkVoice = INK_VOICE) => {
  tx(b, `${r[0]}:`, x, y, inkRole);
  tx(b, r[1], x + roleW(r), y, inkVoice);
};
const page2Source = () => {
  const b = new Buf(W, H, PAL.N0);
  CAST_A.forEach((r, i) => { const [x, y] = castAt(0, i); castRow(b, r, x, y); });
  CAST_B.forEach((r, i) => { const [x, y] = castAt(1, i); castRow(b, r, x, y); });
  TOOLS.forEach((s, i) => tx(b, s, PAGE2.x + 6, PAGE2.toolsY[i] + 2, INK_RESOLVED));
  return b;
};
const glyphStyle: GlyphStyle = {
  cell: [2, 3], bg: PAL.N1, bloom: 0.8, tint: PAL.C6, tintAmt: 0.35, noise: 0.4, shimmer: 0.2, shimmerStep: 1,
  tone: {lo: 0.06, hi: 0.62, gamma: 0.8}, floor: 0.03, edges: false, seed: 25,
};

// ================================================================== the scene
export const makeScene = (): SceneDef => {
  const src1 = page1Source(), src2 = page2Source();
  const st: {f: number; glyph: Mask | null; src: Buf; cy: number; look: [number, number]} = {f: -1, glyph: null, src: src1, cy: ORB.cy, look: LOOK_IDLE};
  const DONE1 = fanAt(T.cone[1])[0], DONE2 = fan2At(T.cone2[1])[0];
  /** the resolved type of one page: every source pixel the scan's axis has passed */
  const resolve = (fb: Buf, src: Buf, dir: number, cy: number) => {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const c = src.c[y * W + x];
        if (c === PAL.N0) continue;
        if (angleOf(x, y, ORB.cx + 0.5, cy + 0.5) >= dir) fb.c[y * W + x] = c;
      }
  };
  return {
    bg: PAL.N0,
    draw: (fb, f) => {
      st.f = f; st.glyph = null;
      const o = f;
      if (o < 0 || o > T.out) return; // after the cut: black
      const cy = ORB.cy + orbBob(o);
      const look = lookAt(o);
      st.cy = cy; st.look = look;
      const orbMask = new Uint8Array(W * H);
      drawOrbClose(fb, cy, look, apertureAt(o), lensLit(o), fadeStep(o), orbMask);
      const glow = glowAt(o);
      if (glow && fadeStep(o) === 0) drawLensGlow(fb, cy, look, orbMask, glow);
      // page 1's resolved credits (from the first scan until the page turns), page 2's (from the second scan on)
      if (o >= T.cone[0] && o < T.turn[3]) resolve(fb, src1, scanning1(o) ? fanAt(o)[0] : DONE1, cy);
      if (o >= T.cone2[0]) resolve(fb, src2, scanning2(o) ? fan2At(o)[0] : DONE2, cy);
      if (scanning(o)) {
        const [dir, half] = fanFor(o);
        const {lead, trail} = coneHalves(ORB.cx + 0.5, cy + 0.5, dir, half);
        for (let i = 0; i < orbMask.length; i++) if (orbMask[i]) { lead.a[i] = 0; trail.a[i] = 0; }
        const glyphOn = scanning1(o) ? o >= T.glyph[0] && o <= T.glyph[1] : o >= T.glyph2[0] && o <= T.glyph2[1];
        for (let i = 0; i < trail.a.length; i++) {
          if (fb.c[i] !== PAL.N0) continue;
          if ((lead.a[i] && !glyphOn) || trail.a[i]) fb.c[i] = PAL.N1;
        }
        if (glyphOn) { st.glyph = lead; st.src = scanning1(o) ? src1 : src2; }
      }
    },
    switch: (f) => (st.f === f && st.glyph ? {type: 'glyph', mask: st.glyph, source: st.src, style: glyphStyle} : null),
    after: (ui, f) => {
      const o = f;
      if (o < 0 || o > T.out) return;
      const cy = st.f === f ? st.cy : ORB.cy + orbBob(o);
      if (scanning(o)) {
        const [dir, half] = fanFor(o);
        for (const s of [-1, 1]) {
          const a = ((dir + s * half) * Math.PI) / 180;
          let k = 0;
          line(ORB.cx, cy, Math.round(ORB.cx + Math.cos(a) * CONE_LEN), Math.round(cy + Math.sin(a) * CONE_LEN), (x, y) => {
            k++;
            if (k < 9 || x < 0 || y < 0 || x >= W || y >= H) return;
            const col = k < 60 ? PAL.C8 : k < 170 ? PAL.C6 : PAL.C4;
            if (k > 170 && (x + y) % 2) return;
            ui.set(x, y, col);
          });
        }
        ui.set(ORB.cx, cy, PAL.C9);
      }
      // page 1: the header posts (a 2 px drop), the credit chips land around their type, the verdict pops; on 4.1 the
      // whole toast steps down a rung every 2 frames and is gone on o186 (the page turns)
      if (o < T.turn[3]) {
        const step = o < T.turn[0] ? 0 : o < T.turn[1] ? -1 : o < T.turn[2] ? -2 : -3;
        const tgt = step ? new Buf(W, H, TRANSPARENT) : ui;
        const pops = [T.header, ...T.lines];
        PAGE1.forEach((s, i) => {
          const k = o - pops[i];
          const inPlace = i > 0;
          drawChip(tgt, TOAST.x, TOAST.y[i], s, 'credit', inPlace && k >= 0 ? Math.max(1, k) : k, inPlace && k === 0);
        });
        drawChip(tgt, TOAST.x, TOAST.vy, VERDICT, 'verdict', o - T.verdict);
        if (step) for (let i = 0; i < tgt.c.length; i++) if (tgt.c[i] !== TRANSPARENT) ui.c[i] = stepColor(tgt.c[i], step);
      }
      // page 2: the header chip posts on o186 (a 2 px drop); the tools chips land around their resolved type on 5.1, 5.2
      drawChip(ui, PAGE2.x, PAGE2.headY, CAST_HEAD, 'credit', o - T.head2);
      TOOLS.forEach((s, i) => {
        const k = o - T.tools[i];
        drawChip(ui, PAGE2.x, PAGE2.toolsY[i], s, 'credit', k >= 0 ? Math.max(1, k) : k, k === 0);
      });
      // the catch-light glints
      for (const g of [T.glint1, T.glint2, T.glint3]) {
        if (o === g) drawGlint(ui, cy, 2);
        else if (o === g + 1) drawGlint(ui, cy, 1);
      }
    },
  };
};

// ================================================================== boxes for the checks and the QA crops
/** every text row of both pages: [label, page, the type's x, y, width in px, the frame range it should read in] */
export interface TextRow { line: string; page: 1 | 2; x: number; y: number; w: number; box: [number, number, number, number]; cast?: [string, string] }
export const textRows = (): TextRow[] => {
  const rows: TextRow[] = [];
  const chipRow = (s: string, page: 1 | 2, x: number, y: number) =>
    rows.push({line: s, page, x: x + 6, y: y + 2, w: tw(s), box: [x - 1, y - 3, x + chipW(s), y + CHIP_H - 2]});
  PAGE1.forEach((s, i) => chipRow(s, 1, TOAST.x, TOAST.y[i]));
  chipRow(VERDICT, 1, TOAST.x, TOAST.vy);
  chipRow(CAST_HEAD, 2, PAGE2.x, PAGE2.headY);
  const cast = (r: [string, string], col: 0 | 1, i: number) => {
    const [x, y] = castAt(col, i);
    const s = `${r[0]}: ${r[1]}`;
    rows.push({line: s, page: 2, x, y, w: roleW(r) + tw(r[1]), box: [x - 2, y - 1, x + roleW(r) + tw(r[1]) + 1, y + 9], cast: r});
  };
  CAST_A.forEach((r, i) => cast(r, 0, i));
  CAST_B.forEach((r, i) => cast(r, 1, i));
  TOOLS.forEach((s, i) => chipRow(s, 2, PAGE2.x, PAGE2.toolsY[i]));
  return rows;
};
