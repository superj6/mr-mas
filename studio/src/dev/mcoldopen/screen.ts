// MR. MAS — mcoldopen: what is on Mas's monitor. A generic "Z" post composer (dark mode) floating over a
// log-scale chart: a long flat cyan line, a knee, and a blinking dot labelled "you are here".
// Drawn in SCREEN pixels (SW x SH). The medium shot shows it 1:1; the LCD macros magnify the same buffer.
import {Buf, rect, line, ellipse, spr, blit} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';
import {EV, caretOn, typedCount, lastKey, L_TOKENS, EP1_COLD, EP1_LINE, indicatorOn} from './timeline';
import type {ColdLine, ColdSlot} from './timeline';

export const SW = 180;
export const SH = 112;
export const PANEL = {x: 8, y: 9, w: 136, h: 58};
/** top-left of line 1 of the post text (screen px) */
export const TEXT_AT: [number, number] = [PANEL.x + 8, PANEL.y + 7];
export const LINE_STEP = 11;
/** the knee of the curve = where "you are here" sits */
export const KNEE: [number, number] = [134, 88];
export const POST_BTN = {x: PANEL.x + 110, y: PANEL.y + 42, w: 24, h: 10};
/** where the caret sits before anything is typed (the LCD macros centre on it) */
export const CARET_HOME: [number, number] = [TEXT_AT[0], TEXT_AT[1]];

// ------------------------------------------------------------------ chart geometry
const flatY = (x: number) => KNEE[1] + Math.round(3 * (1 - x / KNEE[0]));
const RISE_END = SW - 3;
const riseY = (x: number) => KNEE[1] - Math.round(Math.pow((x - KNEE[0]) / (RISE_END - KNEE[0]), 1.75) * (KNEE[1] + 3));
/** point on the rising curve, u 0..1 from the knee to the top edge */
const risePoint = (u: number): [number, number] => {
  const x = Math.round(KNEE[0] + u * (RISE_END - KNEE[0]));
  return [x, riseY(x)];
};
/** the `you are here` dot's rest for an episode (SCRIPT §8.4's ladder): 0.50 sits at the knee (Ep1), past it the dot
 *  rests that far up the rising curve (0.55 = a tenth of the way from the knee to the top edge), 1.0 at the top */
export const dotRest = (d: number): [number, number] => (d <= 0.5 ? KNEE : risePoint(Math.min(1, (d - 0.5) / 0.5)));

// 3x5 micro digits for the axis eggs
const MICRO: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#.', '##.', '.#.', '.#.', '###'], '2': ['##.', '..#', '.#.', '#..', '###'],
  '3': ['##.', '..#', '.#.', '..#', '##.'], '5': ['###', '#..', '##.', '..#', '##.'], '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '##.'], "'": ['#', '#', '.', '.', '.'], K: ['#.#', '##.', '#..', '##.', '#.#'],
  M: ['#.#', '###', '#.#', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
};
const micro = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const ch of s) {
    const g = MICRO[ch];
    if (!g) { cx += 2; continue; }
    g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + j, col); });
    cx += g[0].length + 1;
  }
};

const POINTER = spr(`
#......
##.....
#o#....
#oo#...
#ooo#..
#oooo#.
#ooooo#
#ooo###
#o#o#..
##.#o#.
....##.
`);

export interface ScreenState {
  f: number;
  /** the episode's line (its text and keys) */
  line: ColdLine;
  l1: number;
  l2: number;
  /** the typing indicator: which of its three dots is lit (0-2), or null when it isn't up */
  indicator: number | null;
  /** where the dot rests (and its label sits) this episode */
  rest: [number, number];
  caret: boolean;
  caretLine: 0 | 1;
  /** the you-are-here dot, or null once it has left the top */
  dot: [number, number] | null;
  dotHalo: boolean;
  chart: 'knee' | 'vertical';
  pointer: [number, number];
  pressed: boolean;
  /** after Post: the composer is empty again */
  posted: boolean;
}

export const screenState = (f: number, co: ColdSlot = EP1_COLD): ScreenState => {
  const cl = co.line;
  const posted = f >= EV.click;
  const l1 = posted ? 0 : typedCount(cl.keys1, f);
  const l2 = posted ? 0 : typedCount(cl.keys2, f);
  const idle = f - lastKey(f, cl) >= 8;
  const rest = dotRest(co.dot);
  // the indicator's three dots light in turn, one beat a cycle, phase-locked to the beat grid (like the caret)
  const ind = !posted && indicatorOn(cl, f) ? Math.floor((((f % 15) + 15) % 15) / 5) : null;
  let dot: [number, number] | null = rest;
  if (f >= EV.dotSlide[0] && f <= EV.dotSlide[1]) dot = risePoint([0.3, 0.58, 0.82, 0.97][f - EV.dotSlide[0]]);
  else if (f >= EV.dotExit) dot = null;
  const px = f < EV.pointer[0] ? [152, 74] : f >= EV.pointer[1] ? [POST_BTN.x + 13, POST_BTN.y + 5] : null;
  let pointer: [number, number];
  if (px) pointer = px as [number, number];
  else {
    // on 2s, ease-out toward the button
    const k = Math.min(1, (Math.floor((f - EV.pointer[0]) / 2) * 2 + 2) / (EV.pointer[1] - EV.pointer[0] + 1));
    const e = 1 - (1 - k) * (1 - k);
    pointer = [Math.round(152 + (POST_BTN.x + 13 - 152) * e), Math.round(74 + (POST_BTN.y + 5 - 74) * e)];
  }
  return {
    f, line: cl, l1, l2, indicator: ind, rest,
    // the indicator stands where the caret would be: the caret is off while it pulses
    caret: ind === null && (!idle || caretOn(f)),
    caretLine: !posted && cl.brk !== null && f >= cl.brk ? 1 : 0,
    dot, dotHalo: caretOn(f),
    chart: f >= EV.chartSnap ? 'vertical' : 'knee',
    pointer,
    pressed: f === EV.click || f === EV.click + 1,
    posted,
  };
};

// ------------------------------------------------------------------ avatar (12x12, a tiny Mas)
const AVATAR = spr(`
....oooo....
..ooCCCCoo..
.oCCCHCCCCo.
.oCHHHHHCCo.
oCHHhhhhHCCo
oCHhssssHCCo
oCChsSSsCCCo
oCCCssssCCCo
.oCCCssCCCo.
.oCgggggggo.
..ogggggggo.
....oooo....
`);
const drawAvatar = (b: Buf, x: number, y: number) =>
  blit(b, AVATAR, x, y, {o: PAL.N0, C: PAL.C1, H: PAL.B3, h: PAL.B2, s: PAL.S3, S: PAL.S4, g: PAL.G2});

// ------------------------------------------------------------------ draw
export const drawScreen = (b: Buf, s: ScreenState) => {
  // wallpaper: the chart
  rect(0, 0, SW, SH, b.ink(PAL.N1));
  // decade gridlines + dotted log minors
  for (let d = 0; d < 6; d++) {
    const y0 = 104 - d * 20;
    for (let x = 0; x < SW; x++) b.set(x, y0, PAL.N2);
    for (let k = 2; k <= 9; k++) {
      const y = Math.round(y0 - 20 * Math.log10(k));
      if (y < 0) continue;
      for (let x = (k & 1); x < SW; x += 4) b.set(x, y, PAL.N2);
    }
  }
  for (let x = 14; x < SW; x += 30) for (let y = 1; y < 104; y += 2) b.set(x, y, PAL.N2);
  // axis + eggs
  for (let x = 0; x < SW; x++) b.set(x, 105, PAL.N3);
  [["'93", 6], ["'08", 44], ["'15", 80], ["'22", 112]].forEach(([t, x]) => { micro(b, t as string, x as number, 107, PAL.N4); b.set((x as number) + 4, 104, PAL.N4); });
  ['1K', '1M', '1B', '1T'].forEach((t, i) => micro(b, t, SW - 10, 99 - (i + 1) * 20, PAL.N4));

  // the curve: flat for a lifetime, then the knee
  for (let x = 0; x <= KNEE[0]; x++) {
    const y = flatY(x);
    b.set(x, y, PAL.C5);
    b.set(x, y + 1, PAL.C1);
    if ((x & 1) === 0) b.set(x, y - 1, PAL.C0);
  }
  if (s.chart === 'knee') {
    let py = KNEE[1];
    for (let x = KNEE[0]; x <= RISE_END; x++) {
      const y = riseY(x);
      for (let yy = Math.min(py, y); yy <= Math.max(py, y); yy++) { b.set(x, yy, PAL.C6); b.set(x + 1, yy, PAL.C2); }
      py = y;
    }
  } else {
    // snapped vertical: straight up out of the knee, hot core + glow
    for (let y = -1; y <= KNEE[1]; y++) { b.set(KNEE[0], y, PAL.C8); b.set(KNEE[0] + 1, y, PAL.C5); b.set(KNEE[0] - 1, y, PAL.C3); b.set(KNEE[0] + 2, y, PAL.C1); }
  }
  // you are here
  const label = 'you are here';
  text(b, label, s.rest[0] - textWidth(label) + 1, s.rest[1] + 6, PAL.C5);
  if (s.dot) {
    const [dx, dy] = s.dot;
    if (s.dotHalo) for (const [i, j] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]]) b.set(dx + i, dy + j, PAL.C3);
    rect(dx - 1, dy - 1, 3, 3, b.ink(PAL.C7));
    b.set(dx, dy, PAL.C9);
  }

  // composer panel (floats over the chart): drop shadow, keyline, soft corners
  const {x: px, y: py, w: pw, h: ph} = PANEL;
  rect(px + 2, py + 2, pw, ph, b.ink(PAL.N0));
  rect(px, py, pw, ph, b.ink(PAL.N3));
  rect(px + 1, py + 1, pw - 2, ph - 2, b.ink(PAL.N0));
  for (const [cx, cy] of [[px, py], [px + pw - 1, py], [px, py + ph - 1], [px + pw - 1, py + ph - 1]]) b.set(cx, cy, PAL.N1);
  // text + caret
  const t1 = s.line.l1.slice(0, s.l1), t2 = s.line.l2.slice(0, s.l2);
  text(b, t1, TEXT_AT[0], TEXT_AT[1], PAL.P1);
  text(b, t2, TEXT_AT[0], TEXT_AT[1] + LINE_STEP, PAL.P1);
  if (s.caret) {
    const ln = s.caretLine === 0 ? t1 : t2;
    const cx = TEXT_AT[0] + (ln.length ? textWidth(ln) + 1 : 0);
    rect(cx, TEXT_AT[1] + s.caretLine * LINE_STEP - 1, 4, 9, b.ink(PAL.C6));
  }
  if (s.indicator !== null) drawIndicator(b, s, t1, t2);
  // divider + tool row
  for (let x = TEXT_AT[0]; x < px + pw - 4; x++) b.set(x, py + 38, PAL.N2);
  const iy = py + 44;
  const ic = PAL.C3;
  rect(TEXT_AT[0], iy, 6, 5, b.ink(ic)); rect(TEXT_AT[0] + 1, iy + 1, 4, 3, b.ink(PAL.N0)); b.set(TEXT_AT[0] + 2, iy + 3, ic); b.set(TEXT_AT[0] + 3, iy + 2, ic);
  for (let k = 0; k < 3; k++) rect(TEXT_AT[0] + 10, iy + k * 2, k === 1 ? 4 : 6, 1, b.ink(ic));
  ellipse(TEXT_AT[0] + 22.5, iy + 2.5, 2.6, 2.6, b.ink(ic)); ellipse(TEXT_AT[0] + 22.5, iy + 2.5, 1.6, 1.6, b.ink(PAL.N0));
  // character counter ring (fills with the post length)
  const n = s.l1 + s.l2;
  const rx = POST_BTN.x - 7, ry = POST_BTN.y + 5;
  for (let a = 0; a < 20; a++) {
    const th = -Math.PI / 2 + (a / 20) * Math.PI * 2;
    const on = a / 20 < n / 140;
    b.set(Math.round(rx + Math.cos(th) * 3.4), Math.round(ry + Math.sin(th) * 3.4), on ? PAL.C5 : PAL.N3);
  }
  // Post
  const enabled = n > 0 || s.pressed;
  const {x: bx, w: bw, h: bh} = POST_BTN;
  const by = POST_BTN.y + (s.pressed ? 1 : 0);
  rect(bx, by, bw, bh, b.ink(s.pressed ? PAL.G3 : enabled ? PAL.G5 : PAL.N3));
  for (const [cx, cy] of [[bx, by], [bx + bw - 1, by], [bx, by + bh - 1], [bx + bw - 1, by + bh - 1]]) b.set(cx, cy, PAL.N0);
  text(b, 'Post', bx + Math.floor((bw - textWidth('Post')) / 2), by + 2, enabled ? PAL.N0 : PAL.N5);

  // the pointer
  blit(b, POINTER, s.pointer[0], s.pointer[1] + (s.pressed ? 1 : 0), {'#': PAL.N0, o: PAL.P2});
  return b;
};

export const screenAt = (f: number, co: ColdSlot = EP1_COLD) => drawScreen(new Buf(SW, SH, PAL.N1), screenState(f, co));

// ------------------------------------------------------------------ the typing indicator (Ep2)
/** The pulsing typing indicator: a small rounded bubble of three dots where the caret would stand, after the typed
 *  text on its line, holding the rest of the phrase's slot (SCRIPT §8.1, Ep2: "her", then silence under it). The dots
 *  light in turn, one beat a cycle; nothing else on the screen moves. 14 x 7 screen px, the composer's own greys. */
export const INDICATOR = {w: 14, h: 6, gap: 3};
const drawIndicator = (b: Buf, s: ScreenState, t1: string, t2: string) => {
  const ln = s.caretLine === 0 ? t1 : t2;
  const x = TEXT_AT[0] + (ln.length ? textWidth(ln) + INDICATOR.gap : 0);
  const y = TEXT_AT[1] + s.caretLine * LINE_STEP + 1; // on the x-height, beside the lowercase
  const {w, h} = INDICATOR;
  rect(x, y, w, h, b.ink(PAL.N3));
  for (const [cx, cy] of [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]]) b.set(cx, cy, PAL.N1);
  for (let i = 0; i < 3; i++) {
    // the lit dot, the one it just left a step down (the trail), the third at rest
    const col = i === s.indicator ? PAL.P2 : (i + 1) % 3 === s.indicator ? PAL.P0 : PAL.N6;
    rect(x + 2 + i * 4, y + 2, 2, 2, b.ink(col));
  }
};

// ------------------------------------------------------------------ tokens (for the Post burst)
/** tokenizer view of the post (the semicolon gets its own token): Ep1's, from timeline.ts */
export const TOKENS: Array<{t: string; line: 0 | 1}> = L_TOKENS;
/** screen-px box of each token as typed: [x, y, w] (y = top of caps) */
export const tokenBoxes = (cl: ColdLine = EP1_LINE) => {
  const out: Array<{t: string; x: number; y: number; w: number; line: 0 | 1}> = [];
  let acc = ['', ''];
  for (const tk of cl.tokens) {
    const before = acc[tk.line];
    const x0 = TEXT_AT[0] + (before.length ? textWidth(before) + 1 : 0);
    acc[tk.line] = before + tk.t;
    const x1 = TEXT_AT[0] + textWidth(acc[tk.line]);
    out.push({t: tk.t, x: x0, y: TEXT_AT[1] + tk.line * LINE_STEP, w: x1 - x0, line: tk.line});
  }
  return out;
};
