// MR. MAS — kit: THE USER ODOMETER (Ep1 Act One sc 5–6: "the user counter drills through the floors"). New file
// (v3-art-a, 2026-09-27). One mechanical design at three sizes (each its own drawing, never a scale of another):
//   'plate'  the chat window's counter (USERS: 0 → 1 · 2 · 7 · 104 · 1,389…): small paper wheels in a dark slot
//   'desk'   the counter detached and grown to a desk-sized machine: a riveted steel housing, a glass window over
//            seven fat drum wheels, the USERS plate, crank-side gears; it spins, drops through the desk and the floors,
//            and wedges in the bedrock (rooms/drill.ts), where its last wheel settles, legible: 1,000,000
//   'small'  the second, smaller odometer beside it far down the hole: `$`, spinning faster, its digits never legible
// Motion is held drawings: a wheel is either still (its digit centred), rolling (the digit strip offset by whole pixels
// toward the next digit) or spinning (a blur drawing: the digit's strokes smeared into vertical streaks, illegible, in
// two alternating drawings). Heat (the bill, sc 6 phrase 4) walks the housing up the red ramp in held steps.
//   drawWheel(b, x, y, w, h, d, o)         one wheel in its window: d digit, o.roll 0..1, o.spin 0 | 1 | 2 (0 still)
//   drawOdometer(b, x, y, st)              the whole counter at a size; returns its box {w, h}
//   odometerSize(size, n)                  {w, h} before drawing
//   ODO_USERS_TICKS                        the plate's first ticks (the stick's values): 0 → 1 · 2 · 7 · 104 · 1,389
import {Buf, rect, line, ellipse, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../font';

export type OdoSize = 'plate' | 'ecu' | 'wide' | 'desk' | 'small';
export const ODO_USERS_TICKS = [0, 1, 2, 7, 104, 1389];

/** one wheel: the paper drum in its window. spin > 0 = the blur drawings (1 | 2 alternate); roll offsets the strip */
export const drawWheel = (b: Buf, x: number, y: number, w: number, h: number, d: number, o: {roll?: number; spin?: 0 | 1 | 2; big?: boolean; paper?: number; ink?: number; heat?: number} = {}) => {
  const paper = o.paper ?? PAL.P1, ink = o.ink ?? PAL.N1;
  // the drum's curvature: the rows near the window's top and bottom a rung darker
  const eh = h <= 12 ? 1 : 2;
  for (let j = 0; j < h; j++) {
    const edge = j < eh || j >= h - eh;
    for (let i = 0; i < w; i++) b.set(x + i, y + j, edge ? stepColor(paper, -1) : paper);
  }
  if (o.spin) {
    // the blur: every digit's strokes smeared into streaks down the drum (illegible); two drawings, alternating
    for (let i = 1; i < w - 1; i++) {
      const on = hash(i, o.spin, 71) < 0.55;
      if (!on) continue;
      for (let j = 1; j < h - 1; j++) if (hash(i, j + o.spin * 31, 72) < 0.62) b.set(x + i, y + j, j < 3 || j > h - 4 ? stepColor(ink, 1) : ink);
    }
    return;
  }
  // the digit strip: this digit and the next, offset by the roll (whole pixels), clipped to the window
  const cell = new Buf(w, h * 2, paper);
  const dd = (n: number) => String(((n % 10) + 10) % 10);
  if (o.big) {
    const g = (n: number, yy: number) => bigText(cell, dd(n), Math.round((w - bigTextWidth(dd(n))) / 2), yy, ink);
    g(d, Math.round((h - BIG_CAP) / 2)); g(d + 1, h + Math.round((h - BIG_CAP) / 2));
  } else {
    const g = (n: number, yy: number) => text(cell, dd(n), Math.round((w - textWidth(dd(n))) / 2), yy, ink);
    g(d, Math.round((h - 7) / 2)); g(d + 1, h + Math.round((h - 7) / 2));
  }
  const off = Math.round((o.roll ?? 0) * h);
  for (let j = eh; j < h - eh; j++) for (let i = 0; i < w; i++) { const c = cell.c[(j + off) * w + i]; if (c !== paper) b.set(x + i, y + j, c); }
};

export const odometerSize = (size: OdoSize, n: number) => {
  if (size === 'plate') return {w: 4 + n * 8, h: 15};
  if (size === 'ecu') return {w: 6 + n * 16, h: 28};
  if (size === 'wide') return {w: 16 + n * 11 + Math.floor((n - 1) / 3) * 3, h: 40};
  if (size === 'small') return {w: 22 + n * 9, h: 30};
  return {w: 26 + n * 17 + Math.floor((n - 1) / 3) * 4, h: 58};
};

export interface OdometerState {
  size: OdoSize;
  /** the value shown on the still wheels (the spinning ones ignore it) */
  value: number;
  /** wheel count (default: plate 6, desk 7, small 5) */
  digits?: number;
  /** per wheel from the RIGHT (ones first): 0 still, 1 | 2 spinning; a single number applies to every wheel */
  spin?: number | number[];
  /** per wheel from the right: 0..1 roll toward the next digit */
  roll?: number[];
  /** the label: 'USERS' (default) or '$' */
  label?: string;
  /** heat 0 cool steel · 1 warm · 2 hot · 3 red-hot (the housing walks the red ramp) */
  heat?: number;
  /** a whole-pixel shake (the machine running): an x, y offset */
  shake?: [number, number];
  /** f drives the gears' held turn and the spin drawings' alternation */
  f?: number;
}
const commaGroups = (n: number) => n > 3;
export const drawOdometer = (b: Buf, x0: number, y0: number, st: OdometerState) => {
  const n = st.digits ?? (st.size === 'plate' ? 6 : st.size === 'desk' ? 7 : 5);
  const {w, h} = odometerSize(st.size, n);
  const [sx, sy] = st.shake ?? [0, 0];
  const x = x0 + sx, y = y0 + sy;
  const f = st.f ?? 0;
  const spinOf = (k: number) => { const s = Array.isArray(st.spin) ? st.spin[k] ?? 0 : st.spin ?? 0; return s ? ((1 + ((Math.floor(f / 2) + k) & 1)) as 1 | 2) : 0; };
  const digits = String(Math.max(0, Math.floor(st.value))).padStart(n, '0').slice(-n).split('').map(Number);
  if (st.size === 'plate' || st.size === 'ecu') {
    // a dark slot of paper wheels (the chat window's counter; 'ecu' = the same counter in the insert, its own drawing
    // with the display face)
    const E = st.size === 'ecu';
    rect(x, y, w, h, b.ink(PAL.N0)); rect(x + 1, y + 1, w - 2, h - 2, b.ink(PAL.N2)); rect(x + 1, y + 1, w - 2, 1, b.ink(PAL.N3));
    digits.forEach((d, i) => { const k = n - 1 - i; drawWheel(b, x + (E ? 4 : 3) + i * (E ? 16 : 8), y + 2, E ? 14 : 7, E ? 24 : 11, d, {big: E, spin: spinOf(k), roll: st.roll?.[k]}); });
    return {w, h};
  }
  const heat = Math.max(0, Math.min(3, st.heat ?? 0));
  const steel = [[PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5], [PAL.W1, PAL.G2, PAL.G3, PAL.W3, PAL.W4], [PAL.R0, PAL.W2, PAL.W3, PAL.W4, PAL.W5], [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W6]][heat];
  if (st.size === 'small') {
    // the `$` counter: a squat housing, five wheels, its label plate on the left; built to spin
    rect(x, y, w, h, b.ink(steel[0])); rect(x + 1, y + 1, w - 2, h - 2, b.ink(steel[2])); rect(x + 1, y + 1, w - 2, 1, b.ink(steel[4])); rect(x + 1, y + h - 2, w - 2, 1, b.ink(steel[1]));
    rect(x + 3, y + 6, 14, 18, b.ink(PAL.N1)); bigText(b, st.label ?? '$', x + 5, y + 8, heat >= 2 ? PAL.W7 : PAL.P1);
    rect(x + 19, y + 5, n * 9 + 1, 20, b.ink(PAL.N0));
    digits.forEach((d, i) => { const k = n - 1 - i; drawWheel(b, x + 20 + i * 9, y + 6, 8, 18, d, {spin: spinOf(k), roll: st.roll?.[k], paper: heat >= 2 ? PAL.W7 : PAL.P1, ink: PAL.N1}); });
    for (const [bx, by] of [[x + 2, y + 2], [x + w - 3, y + 2], [x + 2, y + h - 3], [x + w - 3, y + h - 3]]) b.set(bx, by, steel[4]);
    return {w, h};
  }
  if (st.size === 'wide') {
    // the desk-sized machine at the wide's room scale: the same housing, small digits (a desk's width at room scale)
    rect(x + 2, y + h, w - 1, 2, b.ink(PAL.N0));
    rect(x, y, w, h, b.ink(steel[0])); rect(x + 1, y + 1, w - 2, h - 2, b.ink(steel[2]));
    rect(x + 1, y + 1, w - 2, 1, b.ink(steel[4])); rect(x + 1, y + h - 2, w - 2, 1, b.ink(steel[1]));
    for (let i = 4; i < w - 4; i += 9) b.set(x + i, y + 3, steel[4]);
    rect(x + 6, y + 5, 22, 7, b.ink(PAL.N1)); for (let i = 0; i < 18; i += 2) b.set(x + 8 + i, y + 8, heat >= 3 ? PAL.W6 : PAL.G5);
    const wy = y + 15;
    rect(x + 5, wy, w - 10, 20, b.ink(PAL.N0));
    let cx = x + 7;
    digits.forEach((d, i) => { const k = n - 1 - i; drawWheel(b, cx, wy + 2, 10, 16, d, {spin: spinOf(k), roll: st.roll?.[k], paper: heat >= 3 ? PAL.W8 : PAL.P1}); cx += 11; if (k > 0 && k % 3 === 0) { b.set(cx, wy + 14, PAL.P1); b.set(cx, wy + 15, PAL.P1); cx += 3; } });
    const g = Math.floor(f / 3) % 3;
    for (let t = 0; t < 6; t++) { const a = (t / 6 + g / 18) * Math.PI * 2; b.set(Math.round(x + w - 5 + Math.cos(a) * 3), Math.round(y + 8 + Math.sin(a) * 3), steel[4]); }
    if (heat >= 2) for (let j = 0; j < 4; j++) for (let i = 0; i < w; i += 2) if (hash(i, j + Math.floor(f / 3), 73) < 0.25) b.set(x + i + (j & 1), y - 2 - j * 2, heat >= 3 ? PAL.R1 : PAL.W2);
    return {w, h};
  }
  // 'desk': the machine. A riveted housing with a lit top edge, the window's glass over the drums, the plate, the gears
  rect(x + 3, y + h, w - 2, 3, b.ink(PAL.N0)); // its shadow on whatever it stands on
  rect(x, y, w, h, b.ink(steel[0]));
  rect(x + 1, y + 1, w - 2, h - 2, b.ink(steel[2]));
  rect(x + 1, y + 1, w - 2, 2, b.ink(steel[4])); rect(x + 1, y + 3, w - 2, 1, b.ink(steel[3]));
  rect(x + 1, y + h - 3, w - 2, 2, b.ink(steel[1]));
  for (let i = 6; i < w - 6; i += 12) { b.set(x + i, y + 5, steel[4]); b.set(x + i, y + h - 5, steel[3]); } // rivets
  // the USERS plate on the housing's face, above the window
  const lab = st.label ?? 'USERS';
  const lw = textWidth(lab) + 8;
  rect(x + 10, y + 7, lw, 11, b.ink(PAL.N1)); rect(x + 10, y + 7, lw, 1, b.ink(steel[3]));
  text(b, lab, x + 14, y + 9, heat >= 3 ? PAL.W7 : PAL.P1);
  // the window: a dark recess, the wheels, commas between the groups, the glass's sheen over them
  const wx = x + 9, wy = y + 21, wh = 30;
  let cx = wx + 2;
  rect(wx, wy, w - 18, wh, b.ink(PAL.N0));
  digits.forEach((d, i) => {
    const k = n - 1 - i;
    drawWheel(b, cx, wy + 2, 15, wh - 4, d, {big: true, spin: spinOf(k), roll: st.roll?.[k], paper: heat >= 3 ? PAL.W8 : PAL.P1, ink: PAL.N1});
    cx += 17;
    if (commaGroups(n) && k > 0 && k % 3 === 0) { rect(cx - 1, wy + wh - 9, 2, 3, b.ink(PAL.P1)); b.set(cx - 1, wy + wh - 6, PAL.P1); cx += 4; }
  });
  for (let j = 0; j < wh; j++) { const i = 6 + Math.round(j * 0.5); if (i < w - 20) { b.set(wx + i, wy + j, stepColor(b.get(wx + i, wy + j), 1)); b.set(wx + i + 1, wy + j, stepColor(b.get(wx + i + 1, wy + j), 1)); } }
  // crank-side gears on the right flank (a held turn: 3 drawings)
  const g = Math.floor(f / 3) % 3;
  const gx = x + w - 6, gy = y + 12;
  ellipse(gx, gy, 5, 5, b.ink(steel[1])); ellipse(gx, gy, 3, 3, b.ink(steel[3]));
  for (let t = 0; t < 6; t++) { const a = (t / 6 + g / 18) * Math.PI * 2; b.set(Math.round(gx + Math.cos(a) * 5), Math.round(gy + Math.sin(a) * 5), steel[4]); }
  // heat: the housing shimmers (every third row a rung up at red-hot) and the air above it wavers (held 1 px steps)
  if (heat >= 2) for (let j = 0; j < 6; j++) for (let i = 0; i < w; i += 2) if (hash(i, j + Math.floor(f / 3), 73) < 0.25) b.set(x + i + (j & 1), y - 2 - j * 2, heat >= 3 ? PAL.R1 : PAL.W2);
  void bayer; void line;
  return {w, h};
};
