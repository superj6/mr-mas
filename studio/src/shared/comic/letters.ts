/**
 * COMIC LETTERING — a hand-lettering stroke font (builder: comic).
 * Uppercase comic hand (Speedball-pen style), digits, punctuation and a few lowercase for the quiet voice.
 * Glyph space: cap height 1 (y=-1 cap line, y=0 baseline). Each glyph is a list of strokes (polylines,
 * optionally smoothed) and dots. Lettering is laid out into SVG path data and stroked with round caps.
 * Conventions baked in: crossbar "I" only for the personal pronoun (I, I'M, I'LL...), *bold italic* emphasis,
 * per-glyph hand jitter (seeded), balloon-friendly centred layout.
 */
type P = [number, number];
interface Glyph {
  w: number;
  s: P[][];
  /** strokes to smooth (Catmull-Rom) by index */
  smooth?: number[];
  dots?: P[];
}

const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 0): P[] => {
  const steps = n || Math.max(6, Math.round(Math.abs(a1 - a0) / 12));
  return Array.from({length: steps + 1}, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as P;
  });
};

const G: Record<string, Glyph> = {
  A: {w: 0.74, s: [[[0, 0], [0.37, -1], [0.74, 0]], [[0.15, -0.34], [0.59, -0.34]]]},
  B: {w: 0.7, s: [[[0.03, 0], [0.03, -1]], [[0.03, -1], [0.38, -1], ...arc(0.38, -0.765, 0.24, 0.235, -90, 90), [0.03, -0.53]], [[0.03, -0.53], [0.4, -0.53], ...arc(0.4, -0.265, 0.27, 0.265, -90, 90), [0.03, 0]]]},
  C: {w: 0.8, s: [arc(0.42, -0.5, 0.41, 0.5, -40, -320)]},
  D: {w: 0.76, s: [[[0.03, 0], [0.03, -1], [0.3, -1], ...arc(0.3, -0.5, 0.43, 0.5, -90, 90), [0.03, 0]]]},
  E: {w: 0.64, s: [[[0.6, -1], [0.03, -1], [0.03, 0], [0.62, 0]], [[0.03, -0.52], [0.47, -0.52]]]},
  F: {w: 0.6, s: [[[0.6, -1], [0.03, -1], [0.03, 0]], [[0.03, -0.5], [0.46, -0.5]]]},
  G: {w: 0.84, s: [[...arc(0.42, -0.5, 0.41, 0.5, -40, -340), [0.82, -0.47], [0.52, -0.47]]]},
  H: {w: 0.72, s: [[[0.03, -1], [0.03, 0]], [[0.7, -1], [0.7, 0]], [[0.03, -0.52], [0.7, -0.52]]]},
  I: {w: 0.2, s: [[[0.1, -1], [0.1, 0]]]},
  // crossbar I — personal pronoun only
  '|': {w: 0.4, s: [[[0.02, -1], [0.38, -1]], [[0.2, -1], [0.2, 0]], [[0.02, 0], [0.38, 0]]]},
  J: {w: 0.56, s: [[[0.52, -1], [0.52, -0.3], ...arc(0.28, -0.3, 0.24, 0.3, 0, 180)]]},
  K: {w: 0.7, s: [[[0.03, -1], [0.03, 0]], [[0.66, -1], [0.03, -0.4]], [[0.23, -0.58], [0.7, 0]]]},
  L: {w: 0.58, s: [[[0.03, -1], [0.03, 0], [0.58, 0]]]},
  M: {w: 0.86, s: [[[0.02, 0], [0.06, -1], [0.43, -0.3], [0.8, -1], [0.84, 0]]]},
  N: {w: 0.72, s: [[[0.03, 0], [0.03, -1], [0.7, 0], [0.7, -1]]]},
  O: {w: 0.86, s: [arc(0.43, -0.5, 0.43, 0.5, 0, 360, 30)]},
  P: {w: 0.66, s: [[[0.03, 0], [0.03, -1], [0.36, -1], ...arc(0.36, -0.73, 0.28, 0.27, -90, 90), [0.03, -0.46]]]},
  Q: {w: 0.9, s: [arc(0.43, -0.5, 0.43, 0.5, 0, 360, 30), [[0.52, -0.26], [0.9, 0.06]]]},
  R: {w: 0.7, s: [[[0.03, 0], [0.03, -1], [0.36, -1], ...arc(0.36, -0.73, 0.28, 0.27, -90, 90), [0.03, -0.46]], [[0.32, -0.46], [0.7, 0]]]},
  S: {w: 0.68, s: [[[0.64, -0.84], [0.5, -0.98], [0.3, -1.0], [0.1, -0.92], [0.04, -0.75], [0.14, -0.6], [0.36, -0.52], [0.56, -0.44], [0.66, -0.28], [0.62, -0.1], [0.44, 0], [0.22, 0], [0.02, -0.14]]], smooth: [0]},
  T: {w: 0.7, s: [[[0, -1], [0.7, -1]], [[0.35, -1], [0.35, 0]]]},
  U: {w: 0.72, s: [[[0.03, -1], [0.03, -0.36], ...arc(0.365, -0.36, 0.335, 0.36, 180, 0), [0.7, -1]]]},
  V: {w: 0.74, s: [[[0, -1], [0.37, 0], [0.74, -1]]]},
  W: {w: 0.98, s: [[[0, -1], [0.23, 0], [0.49, -0.74], [0.75, 0], [0.98, -1]]]},
  X: {w: 0.7, s: [[[0.02, -1], [0.68, 0]], [[0.68, -1], [0.02, 0]]]},
  Y: {w: 0.7, s: [[[0, -1], [0.35, -0.48], [0.7, -1]], [[0.35, -0.48], [0.35, 0]]]},
  Z: {w: 0.7, s: [[[0.04, -1], [0.66, -1], [0.02, 0], [0.68, 0]]]},
  '0': {w: 0.72, s: [arc(0.36, -0.5, 0.34, 0.5, 0, 360, 28)]},
  '1': {w: 0.5, s: [[[0.08, -0.8], [0.3, -1], [0.3, 0]], [[0.08, 0], [0.5, 0]]]},
  '2': {w: 0.72, s: [[...arc(0.35, -0.7, 0.31, 0.3, 190, 380), [0.02, 0], [0.7, 0]]]},
  '3': {w: 0.68, s: [arc(0.34, -0.74, 0.28, 0.26, 200, 450), arc(0.34, -0.27, 0.32, 0.27, 270, 520)]},
  '4': {w: 0.74, s: [[[0.52, 0], [0.52, -1], [0.02, -0.34], [0.72, -0.34]]]},
  '5': {w: 0.7, s: [[[0.64, -1], [0.12, -1], [0.07, -0.56], ...arc(0.36, -0.32, 0.32, 0.32, 230, 500)]]},
  '6': {w: 0.72, s: [[[0.56, -1], [0.22, -0.7], [0.07, -0.38]], arc(0.37, -0.32, 0.31, 0.32, 0, 360, 24)]},
  '7': {w: 0.7, s: [[[0.02, -1], [0.68, -1], [0.26, 0]]]},
  '8': {w: 0.7, s: [arc(0.35, -0.75, 0.26, 0.25, 0, 360, 22), arc(0.35, -0.26, 0.32, 0.26, 0, 360, 24)]},
  '9': {w: 0.72, s: [arc(0.36, -0.68, 0.31, 0.32, 0, 360, 24), [[0.67, -0.64], [0.56, -0.3], [0.2, 0]]]},
  '.': {w: 0.24, s: [], dots: [[0.11, -0.05]]},
  ',': {w: 0.24, s: [[[0.12, -0.08], [0.04, 0.16]]]},
  '!': {w: 0.28, s: [[[0.13, -1], [0.12, -0.3]], [[0.09, -1], [0.12, -0.36], [0.16, -1]]], dots: [[0.12, -0.05]]},
  '?': {w: 0.64, s: [[...arc(0.32, -0.74, 0.28, 0.26, 200, 420), [0.34, -0.46], [0.34, -0.28]]], dots: [[0.34, -0.05]]},
  "'": {w: 0.2, s: [[[0.1, -1], [0.07, -0.76]]]},
  '"': {w: 0.36, s: [[[0.1, -1], [0.07, -0.76]], [[0.26, -1], [0.23, -0.76]]]},
  '-': {w: 0.46, s: [[[0.04, -0.46], [0.42, -0.46]]]},
  '—': {w: 0.94, s: [[[0.04, -0.46], [0.9, -0.46]]]},
  ':': {w: 0.24, s: [], dots: [[0.11, -0.6], [0.11, -0.05]]},
  '/': {w: 0.52, s: [[[0.5, -1], [0.02, 0.06]]]},
  '…': {w: 0.8, s: [], dots: [[0.1, -0.05], [0.4, -0.05], [0.7, -0.05]]},
  // the quiet voice
  s: {w: 0.5, s: [[[0.46, -0.58], [0.34, -0.66], [0.16, -0.66], [0.04, -0.56], [0.08, -0.42], [0.26, -0.35], [0.42, -0.28], [0.48, -0.14], [0.38, -0.02], [0.18, 0], [0.02, -0.08]]], smooth: [0]},
  u: {w: 0.52, s: [[[0.03, -0.66], [0.03, -0.24], ...arc(0.25, -0.24, 0.22, 0.24, 180, 0), [0.47, -0.66]], [[0.47, -0.66], [0.49, 0]]]},
  p: {w: 0.54, s: [[[0.03, -0.66], [0.03, 0.36]], arc(0.27, -0.33, 0.24, 0.33, 0, 360, 22)]},
  e: {w: 0.54, s: [[[0.04, -0.34], [0.51, -0.34], ...arc(0.275, -0.33, 0.235, 0.33, 0, -300)]]},
  r: {w: 0.42, s: [[[0.03, -0.66], [0.03, 0]], [[0.03, -0.38], ...arc(0.26, -0.38, 0.23, 0.28, 180, 300)]]},
  ' ': {w: 0.4, s: []},
};

const smoothPts = (pts: P[], k = 6): P[] => {
  if (pts.length < 3) return pts;
  const out: P[] = [];
  const n = pts.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[n - 1]);
  return out;
};

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

export interface LetterOpts {
  /** cap height in local units */
  size: number;
  /** line height multiple of cap height */
  lh?: number;
  tracking?: number;
  align?: 'center' | 'left' | 'right';
  seed?: number;
  /** hand jitter amount 0..1 */
  jitter?: number;
  italic?: number;
  /** draw only the first N characters (layout of the whole text stays fixed) */
  upto?: number;
}

export interface LaidOut {
  /** regular-weight strokes */
  d: string;
  /** bold (emphasis) strokes */
  bold: string;
  /** dots as [x, y, bold] */
  dots: [number, number, boolean][];
  w: number;
  h: number;
  /** per-line widths */
  lines: number[];
}

const PRONOUN = /^I('|$|'M|'LL|'D|'VE)/;

/** Measure + lay out multi-line text ('\n' breaks; *word* = bold italic). Origin = centre of the block. */
export const layout = (text: string, o: LetterOpts): LaidOut => {
  const {size, lh = 1.42, tracking = 0.13, align = 'center', seed = 1, jitter = 1, italic = 0.2, upto = Infinity} = o;
  let drawn = 0;
  const rows = text.split('\n');
  type Tok = {ch: string; bold: boolean};
  const toks: Tok[][] = rows.map((row) => {
    const out: Tok[] = [];
    let bold = false;
    const words = row.split(' ');
    words.forEach((w, wi) => {
      let ww = w;
      const chars: Tok[] = [];
      for (let i = 0; i < ww.length; i++) {
        const c = ww[i];
        if (c === '*') {
          bold = !bold;
          continue;
        }
        chars.push({ch: c, bold});
      }
      const plain = chars.map((c) => c.ch).join('');
      if (PRONOUN.test(plain) && plain[0] === 'I') chars[0] = {ch: '|', bold: chars[0].bold};
      out.push(...chars);
      if (wi < words.length - 1) out.push({ch: ' ', bold});
      ww = '';
    });
    return out;
  });
  const adv = (t: Tok) => ((G[t.ch] ?? G[' ']).w + tracking) * (t.bold ? 1.06 : 1);
  const widths = toks.map((r) => r.reduce((a, t) => a + adv(t), 0) - tracking);
  const W = Math.max(...widths);
  const H = (rows.length - 1) * lh + 1;
  let d = '';
  let bd = '';
  const dots: [number, number, boolean][] = [];
  let gi = seed * 97;
  toks.forEach((row, ri) => {
    const lw = widths[ri];
    let x = align === 'center' ? -lw / 2 : align === 'left' ? -W / 2 : W / 2 - lw;
    const base = -H / 2 + 1 + ri * lh;
    row.forEach((t) => {
      const g = G[t.ch] ?? G[' '];
      gi++;
      drawn++;
      if (drawn > upto) {
        x += adv(t);
        return;
      }
      const rot = (hash(gi) - 0.5) * 0.035 * jitter;
      const dy = (hash(gi + 0.3) - 0.5) * 0.05 * jitter;
      const sc = 1 + (hash(gi + 0.7) - 0.5) * 0.05 * jitter;
      const sh = t.bold ? italic : 0.02 * jitter;
      const cx = g.w / 2;
      const tf = ([px, py]: P): P => {
        const ux = (px - cx) * sc;
        const uy = (py + 0.5) * sc;
        const rx = ux * Math.cos(rot) - uy * Math.sin(rot);
        const ry = ux * Math.sin(rot) + uy * Math.cos(rot);
        const X = x + cx + rx - (ry - 0.5) * sh;
        const Y = base + ry - 0.5 + dy;
        return [X * size, Y * size];
      };
      g.s.forEach((st, si) => {
        const pts = (g.smooth?.includes(si) ? smoothPts(st) : st).map(tf);
        const seg = 'M ' + pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join(' L ');
        if (t.bold) bd += seg + ' ';
        else d += seg + ' ';
      });
      g.dots?.forEach((pt) => {
        const [a, b] = tf(pt);
        dots.push([a, b, t.bold]);
      });
      x += adv(t);
    });
  });
  return {d, bold: bd, dots, w: W * size, h: H * size, lines: widths.map((w) => w * size)};
};

export const glyphAdvance = (ch: string) => (G[ch] ?? G[' ']).w;
/** Raw strokes of a glyph (glyph space) — for SFX lettering. */
export const glyphStrokes = (ch: string): {w: number; s: P[][]; dots: P[]} => {
  const g = G[ch] ?? G[' '];
  return {w: g.w, s: g.s.map((st, i) => (g.smooth?.includes(i) ? smoothPts(st) : st)), dots: g.dots ?? []};
};
