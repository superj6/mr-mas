// MR. MAS — shared set: A STANDING DESK IN THE DARK (Ep1 sc 12). New file (v3-art-a, 2026-09-27).
// NOLE's desk: a tall standing desk in a dark room, his "1am post lamp" (characters/nole.md: a single desk lamp that
// switches on whenever he posts) the only light, a rocket-red glint on his phone. The letter's clipboard glides in on
// its own and lands on the desk (kits/pause-letter.ts); he signs it with a flourish of his LEFT hand and, not looking,
// his RIGHT hand solders a GPU onto a board on the shelf under the desk, in sparks of three held drawings. In the
// background OIGNEB holds up a PAUSE sign (cast/oigneb.ts), then holds it higher. Nobody pauses.
//   drawNoleDesk(b, f, st)   [W] the room's one setup (its arrival: the clipboard gliding in)
//   NOLE_DESK                the geometry: the desk top, the clipboard's landing spot, the solder point
import {Buf, rect, line, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor, lightness, familyOf} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {blitImg} from '../figure';
import {noleImg, NOLE_BASE, NolePose, NOLE_FOOT} from '../cast/nole';
import {drawOigneb, OignebPose} from '../cast/oigneb';
import {drawClipboard} from '../kits/pause-letter';

const RH = 203;
export const NOLE_DESK = {
  top: 118, x0: 110, x1: 260,
  /** the clipboard's resting spot on the desk (small, room scale), and its glide in from the left (held steps) */
  clip: [150, 84] as [number, number],
  /** the shelf under the desk where the board and the GPU are; the solder point */
  shelfY: 150, solder: [218, 146] as [number, number],
  lamp: [124, 118] as [number, number],
  noleFoot: [206, 190] as [number, number],
  oignebFoot: [384, 186] as [number, number],
};
const N = NOLE_DESK;
defineMat('nd.floor', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('nd.wall', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
defineMat('nd.desk', ['N0', 'N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W6']);
defineMat('nd.steel', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C5'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W7']);

const lampLight = (x: number, y: number) => {
  const [lx, ly] = N.lamp;
  const d = Math.hypot((x - lx - 30) / 110, (y - ly) / 70);
  return d < 1 ? (1 - d) * 0.85 : 0;
};
let base: Buf | null = null;
const paintBase = () => {
  if (base) return base;
  const mb = new MatBuf(480, RH);
  rect(0, 0, 480, 150, mb.mat('nd.wall', 0));
  for (let y = 0; y < 150; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 9) < 0.004) mb.shade(0.6)(x, y);
  rect(0, 150, 480, RH - 150, mb.mat('nd.floor', 0));
  for (const y of [152, 160, 172, 188]) rect(0, y, 480, 1, mb.shade(-0.6));
  // the standing desk: a slab on a steel frame, a shelf under it (the board, the GPU)
  rect(N.x0, N.top, N.x1 - N.x0, 5, mb.mat('nd.desk', 0.8)); rect(N.x0, N.top, N.x1 - N.x0, 1, mb.shade(1.4));
  for (const lx of [N.x0 + 6, N.x1 - 9]) rect(lx, N.top + 5, 3, 190 - N.top - 5, mb.mat('nd.steel', 0.4));
  rect(N.x0 + 6, N.shelfY, N.x1 - N.x0 - 12, 3, mb.mat('nd.steel', 0.2));
  rect(N.x0 + 4, 188, 16, 2, mb.mat('nd.steel', -0.2)); rect(N.x1 - 20, 188, 16, 2, mb.mat('nd.steel', -0.2));
  const buf = new Buf(480, RH, PAL.N0);
  resolve(mb, {amb: (x, y) => 1.4 - (y > 150 ? 0.3 : 0), cyan: () => 0, warm: (x, y) => lampLight(x, y), dither: 0.6}, buf, 0);
  // the lamp: his 1am post lamp, a small architect's lamp on the desk's left end, lit
  const [lx, ly] = N.lamp;
  line(lx, ly - 1, lx + 6, ly - 22, buf.ink(PAL.G2)); line(lx + 6, ly - 22, lx + 18, ly - 26, buf.ink(PAL.G2));
  rect(lx - 3, ly - 2, 8, 2, buf.ink(PAL.G1));
  for (let j = 0; j < 7; j++) for (let i = 0; i < 12 - j; i++) buf.set(lx + 14 + i + j, ly - 28 + j, j === 0 ? PAL.G3 : PAL.G1);
  rect(lx + 18, ly - 21, 8, 1, buf.ink(PAL.W8)); rect(lx + 17, ly - 20, 10, 1, buf.ink(PAL.W7));
  base = buf;
  return base;
};

export interface NoleDeskState {
  /** the clipboard: its glide (0 out of frame · 1..3 gliding in, held · 4 landed on the desk) */
  clip?: number;
  /** Nole's signature on it: 0 · 1 the flourish · 2 signed */
  signed?: number;
  /** the solder's sparks: frames since they started, or null (3 held drawings, on 3s) */
  sparks?: number | null;
  nole?: Partial<NolePose>;
  oigneb?: Partial<OignebPose> | null;
  /** v3.2 (opt-in): the clipboard's `6 MONTHS` line (legible only on the big clipboard, st.bigClip) */
  months?: boolean;
  /** v3.2 (opt-in): the clipboard at its 64 x 84 size while it glides in (clip 1..3), so its header and 6 MONTHS read
   *  in the wide before it lands small on the desk */
  bigClip?: boolean;
}
const SPARKS = [
  [[0, -3], [2, -5], [-2, -4], [4, -2], [-3, -1]],
  [[1, -6], [3, -3], [-1, -7], [5, -5], [-4, -3], [6, -1]],
  [[2, -8], [-2, -6], [6, -4], [-5, -5], [4, -9]],
];
export const drawNoleDesk = (b: Buf, f: number, st: NoleDeskState = {}) => {
  const src = paintBase();
  for (let y = 0; y < RH; y++) b.c.set(src.c.subarray(y * 480, (y + 1) * 480), y * b.w);
  // OIGNEB in the background, the lamp's spill just reaching him (dim), holding up the sign
  if (st.oigneb !== null) { const [ox, oy] = N.oignebFoot; drawOigneb(b, ox, oy, {sign: 'chest', light: 'dim', ...st.oigneb}); }
  // the board and the GPU on the shelf under the desk, lit by the sparks when they fly
  const [sx, sy] = N.solder;
  rect(sx - 30, N.shelfY - 6, 44, 6, b.ink(PAL.L0)); rect(sx - 30, N.shelfY - 6, 44, 1, b.ink(PAL.L1));
  rect(sx - 4, N.shelfY - 12, 20, 6, b.ink(PAL.N2)); rect(sx - 4, N.shelfY - 12, 20, 1, b.ink(PAL.G3)); ellipse(sx + 6, N.shelfY - 9, 2, 2, b.ink(PAL.G1));
  // Nole behind the desk, facing screen-left: the front arm (his left, toward the camera side) signs the clipboard;
  // the back arm reaches down under the desk to the solder (hidden by the desk top; its hand and the iron show under it)
  const pose: NolePose = {...NOLE_BASE, arm: 'check', back: 'hang', light: 'lit', ...st.nole};
  const img = noleImg(pose);
  const [fx, fy] = N.noleFoot;
  // his rig is keyed to a monitor's cyan (its skin rungs are the K / X families); under the lamp they walk to the
  // warm skin ramp, and the cyan rims to the lamp's tungsten
  const warm = (c: number) => { const fm = familyOf(c); if (!fm) return c; const [fam, i] = fm; if (fam === 'K') return [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S5, PAL.S6][i] ?? c; if (fam === 'X') return [PAL.S1, PAL.S1, PAL.S2, PAL.S3][i] ?? c; if (fam === 'C') return i >= 6 ? PAL.W6 : i >= 3 ? PAL.W4 : PAL.W2; return c; };
  blitImg(b, img, fx - NOLE_FOOT[0], fy - NOLE_FOOT[1], {map: warm});
  // the lamp's warm key on his front (a gel on his lit rungs, near the lamp)
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const X = fx - NOLE_FOOT[0] + i, Y = fy - NOLE_FOOT[1] + j;
    if (img.c[j * img.w + i] < 0) continue;
    if (lampLight(X, Y) > 0.35 && lightness(b.get(X, Y)) > 0.2 && bayer(X, Y) < 0.5) b.set(X, Y, stepColor(b.get(X, Y), 1));
  }
  // the desk top in front of his hips (redraw the slab over him: he stands behind it), the clipboard on it
  const top = paintBase();
  for (let y = N.top; y < N.top + 5; y++) for (let x = N.x0; x < N.x1; x++) b.set(x, y, top.get(x, y));
  const clip = st.clip ?? 4;
  if (clip > 0) {
    const [cx, cy] = N.clip;
    const gx = clip >= 4 ? cx : Math.round(-40 + (cx + 40) * [0, 0.35, 0.7, 0.92][clip]);
    const gy = clip >= 4 ? cy : cy - [0, 16, 8, 2][clip];
    if (st.bigClip && clip < 4) drawClipboard(b, gx, gy - 50, {signed: st.signed ?? 0, months: st.months});
    else drawClipboard(b, gx, gy, {small: true, signed: st.signed ?? 0, months: st.months});
  }
  // the iron under the desk and the sparks (three held drawings, on 3s), their light on the shelf
  if (st.sparks !== null && st.sparks !== undefined) {
    line(sx + 8, N.top + 6, sx + 2, sy - 4, b.ink(PAL.G3)); b.set(sx + 1, sy - 3, PAL.W6);
    const k = Math.floor(st.sparks / 3) % 3;
    for (const [dx, dy] of SPARKS[k]) { b.set(sx + dx, sy + dy, PAL.W8); b.set(sx + dx, sy + dy + 1, PAL.W6); }
    for (let y = N.top + 6; y < N.shelfY; y++) for (let x = sx - 16; x < sx + 18; x++) if (bayer(x, y) < 0.18 * (1 - Math.hypot(x - sx, y - sy) / 20)) b.set(x, y, stepColor(b.get(x, y), 2));
  }
  void clamp;
};
