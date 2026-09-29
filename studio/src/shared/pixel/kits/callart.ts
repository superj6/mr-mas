// MR. MAS — mfinale: art for the per-episode slot (bar 9): the five-tile board call, its two board-member
// busts (front view, webcam scale), the tile backgrounds, the board's pointer, reaction hearts, and the insert
// of Mas's finger on the tiny beige button. Everything is master-palette pixels on the native grid.
import {Buf, rect, line, poly, ellipse, hash, clamp, bayer} from '../px';
import {PAL} from '../palette';
import {Img, P, Part, Adjust, LightRig, FigureDef, renderFigure, blitImg} from '../figure';
import {text, textWidth} from '../font';

const memo1 = <T,>(fn: () => T) => { let v: T | undefined; return () => (v ??= fn()); };

// ------------------------------------------------------------------ webcam busts (front view, 72x80)
// A webcam sees people square-on and slightly from below; the laptop screen is the key (cool, frontal),
// the room behind is the fill. Simple planes: this is a video tile, not a portrait window.
const BW = 72, BH = 80;
const plane = (onlyMat: string, tone: number, ...prims: ReturnType<typeof P.poly>[]): Adjust => ({prims, tone, onlyMat});

const WEBCAM_RIG = (ramps: Record<string, number[]>): LightRig => ({
  key: [-0.55, -0.6], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['in'],
  back: [0.9, -0.3], backBand: 1, backRamp: {}, ramps,
});

/** NELEH: a board member. Chin-length bob with a centre part, level brows, a tweed jacket over a light top. */
const nelehFig = (): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(2, 80, 4, 66, 12, 58, 24, 53, 36, 52, 48, 53, 60, 58, 68, 66, 70, 80)]},
    {group: 'top', mat: 'top', tone: 3, prims: [P.poly(27, 53, 36, 51, 45, 53, 41, 64, 36, 68, 31, 64)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(30, 42, 30, 55, 36, 58, 42, 55, 42, 42)]},
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(16, 30, 17, 16, 24, 8, 36, 5, 48, 8, 55, 16, 56, 30, 56, 44, 50, 47, 22, 47, 16, 44)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(22, 22, 24, 13, 30, 9, 36, 8, 42, 9, 48, 13, 50, 22, 50, 31, 48, 38, 44, 44, 36, 48, 28, 44, 24, 38, 22, 31)]},
    // bob: fringe-less centre part, the hair falls outside the cheeks to the jaw
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(20, 30, 20, 18, 25, 10, 32, 7, 36, 9, 30, 12, 26, 18, 24, 28, 24, 40, 25, 46, 18, 46, 17, 38),
      P.poly(52, 30, 52, 18, 47, 10, 40, 7, 36, 9, 42, 12, 46, 18, 48, 28, 48, 40, 47, 46, 54, 46, 55, 38),
    ]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(26, 16, 32, 12, 36, 12, 30, 16, 27, 22), P.poly(34, 26, 37, 26, 36, 34, 34, 35)),
    plane('skin', 2, P.poly(44, 18, 48, 22, 48, 32, 45, 40, 44, 30), P.poly(28, 41, 36, 45, 44, 41, 40, 46, 32, 46)),
    plane('hair', 3, P.poly(24, 12, 30, 9, 26, 15, 23, 22)),
    plane('hair', 1, P.line(36, 8, 36, 11), P.poly(46, 20, 48, 28, 48, 42, 46, 44)),
    plane('neck', 0, P.poly(30, 44, 36, 48, 42, 44, 42, 49, 36, 52, 30, 49)),
    plane('jacket', 3, P.poly(6, 66, 12, 58, 22, 54, 16, 62, 10, 72)),
    plane('jacket', 1, P.poly(60, 58, 68, 66, 70, 80, 62, 80, 60, 68), P.line(26, 56, 30, 80), P.line(46, 56, 42, 80)),
  ];
  const stamps: FigureDef['stamps'] = [
    // brows, eyes (level, attentive), nose, mouth (neutral, lips pressed)
    {x: 26, y: 23, rows: ['.bbbb.....bbbb.', 'b..........b..b'], pal: {b: PAL.B1}},
    {x: 27, y: 26, rows: ['.www....www.', 'wiIw...wiIw.', '.kk.....kk..'], pal: {w: PAL.S5, i: PAL.B3, I: PAL.N0, k: PAL.S2}},
    {x: 35, y: 31, rows: ['.o', 'oo'], pal: {o: PAL.S2}},
    {x: 31, y: 37, rows: ['.mmmmmmm.', '..lllll..'], pal: {m: PAL.S1, l: PAL.S4}},
  ];
  return {w: BW, h: BH, parts, adjust, stamps};
};

/** MADA: a board member. Short dark hair, rectangular glasses, a crew-neck sweater. */
const madaFig = (): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(0, 80, 3, 64, 12, 56, 24, 52, 36, 51, 48, 52, 60, 56, 69, 64, 72, 80)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(29, 40, 29, 54, 36, 57, 43, 54, 43, 40)]},
    {group: 'rib', mat: 'jacket', tone: 3, prims: [P.poly(26, 52, 36, 55, 46, 52, 44, 56, 36, 59, 28, 56)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(21, 22, 22, 13, 28, 8, 36, 7, 44, 8, 50, 13, 51, 22, 51, 32, 48, 40, 43, 45, 36, 47, 29, 45, 24, 40, 21, 32)]},
    {group: 'ears', mat: 'skin', tone: 2, prims: [P.ell(20.5, 28, 2.5, 4), P.ell(51.5, 28, 2.5, 4)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [P.poly(20, 24, 20, 14, 25, 7, 32, 4, 40, 4, 47, 7, 52, 14, 52, 24, 50, 18, 46, 13, 38, 12, 30, 13, 25, 15, 22, 20)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(24, 16, 30, 13, 36, 13, 28, 17, 25, 22), P.poly(34, 27, 37, 27, 36, 35, 34, 36)),
    plane('skin', 2, P.poly(45, 18, 50, 22, 50, 32, 46, 40, 45, 30), P.poly(28, 41, 36, 45, 44, 41, 40, 46, 32, 46)),
    plane('hair', 3, P.poly(24, 10, 32, 6, 28, 10, 23, 16)),
    plane('hair', 1, P.poly(44, 9, 50, 14, 51, 22, 47, 15)),
    plane('neck', 0, P.poly(29, 42, 36, 47, 43, 42, 43, 48, 36, 51, 29, 48)),
    plane('jacket', 3, P.poly(4, 64, 12, 57, 22, 53, 15, 61, 9, 71)),
    plane('jacket', 1, P.poly(60, 57, 69, 64, 72, 80, 63, 80, 61, 68)),
  ];
  const stamps: FigureDef['stamps'] = [
    {x: 25, y: 22, rows: ['bbbbb....bbbbb', '..............'], pal: {b: PAL.B0}},
    // glasses: thin frames, a glint on the near lens
    {x: 24, y: 24, rows: ['gggggggg.gggggggg', 'g.wiIw.ggg.wiIw.g', 'g..kk..g.g..kk..g', 'ggggggg...ggggggg'], pal: {g: PAL.N0, w: PAL.S5, i: PAL.B3, I: PAL.N0, k: PAL.S3}},
    {x: 26, y: 25, rows: ['j'], pal: {j: PAL.P2}},
    {x: 35, y: 31, rows: ['.o', 'oo'], pal: {o: PAL.S2}},
    {x: 31, y: 38, rows: ['mmmmmmmmm', '.lllllll.'], pal: {m: PAL.S1, l: PAL.S4}},
  ];
  return {w: BW, h: BH, parts, adjust, stamps};
};

const RAMPS_CALL = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.K4],
  neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  in: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2],
};
export const nelehBust = memo1(() => renderFigure(nelehFig(), WEBCAM_RIG({
  ...RAMPS_CALL,
  hair: [PAL.B0, PAL.B1, PAL.B3, PAL.B4, PAL.W4, PAL.W5],
  jacket: [PAL.N0, PAL.D1, PAL.D3, PAL.D4, PAL.W3, PAL.W5],
  top: [PAL.N1, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
})));
export const madaBust = memo1(() => renderFigure(madaFig(), WEBCAM_RIG({
  ...RAMPS_CALL,
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.G3],
  jacket: [PAL.N0, PAL.L0, PAL.L1, PAL.L2, PAL.L2, PAL.C4],
})));
export const BUST_W = BW, BUST_H = BH;

// ------------------------------------------------------------------ tile backgrounds
export type Clip = (x: number, y: number) => boolean;

/** MAS's tile: a hotel room at night, the Strip's neon through the glass, a race car streaking past below. */
export const vegasBg = (b0: Buf, x: number, y: number, w: number, h: number, f: number) => {
  // everything here stays inside the tile
  const b = new Buf(1, 1, 0);
  b.set = (px: number, py: number, c: number) => { if (px >= x && py >= y && px < x + w && py < y + h) b0.set(px, py, c); };
  // dim room wall (left), window (right 2/3) with the night outside
  rect(x, y, w, h, b.ink(PAL.N1));
  const wx = x + 34, ww = w - 34;
  for (let j = 0; j < h; j++) for (let i = 0; i < ww; i++) b.set(wx + i, y + j, j < h * 0.55 ? (bayer(i, j) < (j / (h * 0.55)) * 0.5 ? PAL.N3 : PAL.N2) : PAL.N1);
  // a far hotel tower with marquee bulbs + a neon star, and a vertical sign
  rect(wx + 70, y + 10, 26, h - 10, b.ink(PAL.N0));
  for (let j = 14; j < h - 20; j += 5) for (let i = 73; i < 94; i += 4) if (hash(i, j, 3) < 0.55) b.set(wx + i, y + j, hash(i, j, 4) < 0.5 ? PAL.W6 : PAL.W4);
  const star = [[0, -4], [0, -3], [0, -2], [-1, -1], [1, -1], [-4, 0], [-3, 0], [-2, 0], [2, 0], [3, 0], [4, 0], [-1, 1], [1, 1], [0, 2], [0, 3], [0, 4], [0, -1], [0, 0], [0, 1], [-1, 0], [1, 0]];
  const on = Math.floor(f / 4) % 3 !== 2;
  for (const [i, j] of star) b.set(wx + 50 + i, y + 16 + j, on ? (i === 0 && j === 0 ? PAL.W9 : PAL.W7) : PAL.W4);
  // vertical neon tube sign (letters unreadable at this size on purpose: it is just "the Strip")
  rect(wx + 30, y + 6, 9, 44, b.ink(PAL.N0));
  for (let j = 0; j < 8; j++) { const c = (j + Math.floor(f / 3)) % 8 === 0 ? PAL.P2 : PAL.R3; rect(wx + 32, y + 9 + j * 5, 5, 3, b.ink(c)); rect(wx + 33, y + 10 + j * 5, 3, 1, b.ink(PAL.R1)); }
  // chasing marquee bulbs along a canopy
  for (let i = 0; i < ww - 8; i += 3) b.set(wx + 4 + i, y + 56, ((i / 3 + Math.floor(f / 2)) % 3 === 0) ? PAL.W8 : PAL.W4);
  // the race car: a low streak passing on the street (every 18 frames), with a tail-light smear
  const cx = ((f * 23) % 190) - 30;
  if (cx > -20 && cx < ww + 10) {
    const cy = y + h - 12;
    rect(wx + cx, cy, 16, 3, b.ink(PAL.R2)); rect(wx + cx + 4, cy - 2, 6, 2, b.ink(PAL.N0));
    rect(wx + cx + 1, cy + 3, 3, 1, b.ink(PAL.N0)); rect(wx + cx + 11, cy + 3, 3, 1, b.ink(PAL.N0));
    for (let k = 1; k < 18; k++) if (bayer(k, 0) < 1 - k / 18) b.set(wx + cx - k, cy + 1, PAL.R3);
    rect(wx + cx + 15, cy + 1, 2, 1, b.ink(PAL.W8));
  }
  // window mullion + sill: the room edge catches the neon
  rect(wx - 1, y, 2, h, b.ink(PAL.N0));
  rect(wx + 1, y, 1, h, b.ink(PAL.R1));
};

/** NELEH's tile: a bookshelf (an academic's standard-issue video background). */
export const shelfBg = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x, y, w, h, b.ink(PAL.D1));
  const spines = [PAL.D3, PAL.R1, PAL.N4, PAL.L1, PAL.D4, PAL.P0, PAL.W3, PAL.N5];
  for (let s = 0; s < 4; s++) {
    const sy = y + 4 + s * 21;
    rect(x, sy + 17, w, 3, b.ink(PAL.D3));
    rect(x, sy + 20, w, 1, b.ink(PAL.D0));
    let bx = x + 2 + ((s * 7) % 5);
    while (bx < x + w - 2) {
      const bw = 2 + Math.floor(hash(bx, s, 9) * 3);
      const bh = 11 + Math.floor(hash(bx, s, 8) * 6);
      const col = spines[Math.floor(hash(bx, s, 7) * spines.length)];
      rect(bx, sy + 17 - bh, bw, bh, b.ink(col));
      b.set(bx, sy + 17 - bh, PAL.P1);
      bx += bw + (hash(bx, s, 6) < 0.15 ? 3 : 0);
    }
  }
};

/** MADA's tile: a plain office wall, one framed print, a plant. */
export const officeBg = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, bayer(i, j) < i / w * 0.6 ? PAL.N3 : PAL.N4);
  rect(x + w - 44, y + 12, 30, 22, b.ink(PAL.N0));
  rect(x + w - 42, y + 14, 26, 18, b.ink(PAL.P1));
  line(x + w - 42, y + 29, x + w - 30, y + 20, b.ink(PAL.L1)); line(x + w - 30, y + 20, x + w - 17, y + 27, b.ink(PAL.L1));
  rect(x + 8, y + h - 18, 10, 18, b.ink(PAL.D2));
  for (const [i, j] of [[0, -6], [-4, -10], [4, -12], [-2, -16], [3, -19], [0, -22]] as const) ellipse(x + 13 + i, y + h - 16 + j, 4, 3, b.ink(PAL.L1));
};

/** Camera-off tile: black, an initial disc, the label. */
export const camOffBg = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x, y, w, h, b.ink(PAL.N0));
  rect(x, y, w, 1, b.ink(PAL.N2)); rect(x, y + h - 1, w, 1, b.ink(PAL.N2)); rect(x, y, 1, h, b.ink(PAL.N2)); rect(x + w - 1, y, 1, h, b.ink(PAL.N2));
  ellipse(x + w / 2, y + h / 2 - 4, 13, 13, b.ink(PAL.G1));
  ellipse(x + w / 2, y + h / 2 - 9, 5, 5, b.ink(PAL.G3));
  poly([x + w / 2 - 9, y + h / 2 + 6, x + w / 2 - 6, y + h / 2 - 1, x + w / 2 + 6, y + h / 2 - 1, x + w / 2 + 9, y + h / 2 + 6], b.ink(PAL.G3));
};

export const drawBust = (b: Buf, img: Img, x: number, y: number, clip: Clip) => blitImg(b, img, x, y, {clip});

// ------------------------------------------------------------------ the board's pointer (classic arrow)
const ARROW = [
  'o..........',
  'oo.........',
  'owo........',
  'owwo.......',
  'owwwo......',
  'owwwwo.....',
  'owwwwwo....',
  'owwwwwwo...',
  'owwwwwwwo..',
  'owwwwwoooo.',
  'owwowwo....',
  'owo.owwo...',
  'oo..owwo...',
  'o....owwo..',
  '.....owwo..',
  '......oo...',
];
export const drawPointer = (b: Buf, x: number, y: number, press = false) => {
  ARROW.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === 'o') b.set(x + i, y + j + (press ? 1 : 0), PAL.N0); else if (c === 'w') b.set(x + i, y + j + (press ? 1 : 0), PAL.P2); } });
};

// ------------------------------------------------------------------ hearts (reaction avalanche) and stars
const HEARTS: string[][] = [
  ['#'],
  ['#.#', '###', '.#.'],
  ['##.##', '#####', '#####', '.###.', '..#..'],
  ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  ['.###.###.', '#########', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'],
  ['..###.###..', '.#########.', '###########', '###########', '###########', '.#########.', '..#######..', '...#####...', '....###....', '.....#.....'],
];
/** size 0..5 (1px star .. 11px heart). ramp = [shadow, body, light, spec]. Lit from the top-left. */
export const drawHeart = (b: Buf, x: number, y: number, size: number, ramp: number[]) => {
  const m = HEARTS[clamp(size, 0, 5)];
  const H = m.length, Wd = m[0].length;
  for (let j = 0; j < H; j++)
    for (let i = 0; i < Wd; i++) {
      if (m[j][i] !== '#') continue;
      let c = ramp[1];
      if (size >= 2) {
        const u = i / (Wd - 1), v = j / (H - 1);
        const edgeR = i === Wd - 1 || m[j][i + 1] !== '#', edgeB = j === H - 1 || m[j + 1][i] !== '#';
        if (u + v > 1.15 || (edgeR && u > 0.5) || (edgeB && v > 0.5)) c = ramp[0];
        if (size >= 3 && u < 0.4 && v < 0.4 && u + v < 0.5 && u + v > 0.12) c = ramp[2];
        if (size >= 3 && Math.abs(u - 0.22) < 0.1 && Math.abs(v - 0.2) < 0.12) c = ramp[3];
      } else if (size === 1 && j === 0) c = ramp[2];
      b.set(x + i, y + j, c);
    }
};
export const HEART_W = [1, 3, 5, 7, 9, 11];

// ------------------------------------------------------------------ the insert: Mas's finger on the tiny button
// ECU, looking down onto THE WOODROSE tablecloth under candlelight. The grey hoodie cuff comes in from the
// top-left; the index finger presses a tiny beige button (the 1993 beige) on a small plate.
const HAND_W = 170, HAND_H = 142;
const HO = [78, 72];
/** polygon in the hand's local drawing coords (offset into the big canvas) */
const hp = (...pts: number[]) => P.poly(...pts.map((v, i) => v + HO[i % 2]));
const hl = (x0: number, y0: number, x1: number, y1: number) => P.line(x0 + HO[0], y0 + HO[1], x1 + HO[0], y1 + HO[1]);
const handFig = (press: number): FigureDef => {
  const d = press; // 0 up, 1 touching, 2 pressed (finger 1px lower, knuckle flattens)
  const parts: Part[] = [
    // the sleeve: the forearm comes in from the top-left corner of the frame (absolute coords: it runs off-canvas)
    {group: 'sleeve', mat: 'hood', tone: 2, prims: [P.poly(0, 26, 12, 27, 70, 50, 129, 85, 134, 97, 119, 114, 60, 92, 0, 64)]},
    {group: 'cuff', mat: 'cuff', tone: 2, prims: [hp(30, 28, 50, 12, 58, 18, 60, 30, 44, 42, 34, 42)]},
    // back of the hand (fist, three fingers curled under), thumb along the side
    {group: 'hand', mat: 'skin', tone: 3, prims: [hp(42, 36, 54, 24, 66, 26, 74, 34 + d, 76, 44 + d, 70, 52 + d, 58, 54 + d, 46, 50, 40, 44)]},
    {group: 'thumb', mat: 'skin', tone: 2, prims: [hp(44, 46, 52, 50, 60, 56 + d, 58, 60 + d, 50, 58, 44, 52)]},
    // index finger, extended down-right to the button
    {group: 'finger', mat: 'skin', tone: 3, prims: [hp(66, 38 + d, 72, 34 + d, 84, 48 + d, 88, 56 + d, 86, 60 + d, 81, 60 + d, 76, 52 + d, 68, 44 + d)]},
  ];
  const adjust: Adjust[] = [
    // sleeve: lit top plane toward the candle (top-right), the underside in shadow, two fabric folds
    plane('hood', 3, P.poly(0, 26, 12, 27, 70, 50, 129, 85, 127, 90, 66, 58, 0, 36)),
    plane('hood', 4, P.poly(0, 27, 12, 28, 70, 51, 118, 79, 68, 54, 0, 31)),
    plane('hood', 1, P.poly(0, 54, 60, 82, 118, 108, 119, 114, 60, 92, 0, 64)),
    plane('hood', 1, P.line(8, 44, 70, 70), P.line(40, 66, 96, 90)),
    plane('hood', 3, P.line(8, 43, 70, 69)),
    plane('cuff', 3, hp(50, 12, 58, 18, 54, 20, 48, 16)),
    plane('cuff', 1, hp(34, 38, 44, 34, 58, 26, 60, 30, 44, 42, 34, 42)),
    // knuckle ridge catches the candle; the hand's underside into shadow
    plane('skin', 4, hp(54, 26, 64, 27, 70, 32, 62, 31, 56, 29)),
    plane('skin', 2, hp(46, 48, 58, 52 + d, 68, 51 + d, 72, 49 + d, 70, 53 + d, 58, 55 + d, 46, 51)),
    plane('skin', 4, hp(72, 36 + d, 80, 44 + d, 86, 53 + d, 83, 52 + d, 77, 44 + d, 71, 38 + d)),
    plane('skin', 2, hp(68, 43 + d, 76, 51 + d, 81, 59 + d, 78, 58 + d, 74, 53 + d, 67, 46 + d)),
    // knuckle creases
    plane('skin', 2, hl(60, 34, 64, 40 + d), hl(66, 34 + d, 70, 42 + d)),
  ];
  const stamps: FigureDef['stamps'] = [
    // the nail
    {x: 82 + HO[0], y: 53 + d + HO[1], rows: ['.nn', 'nNn', 'nN.'], pal: {n: PAL.S4, N: PAL.S6}},
  ];
  return {w: HAND_W, h: HAND_H, parts, adjust, stamps};
};
const HAND_RIG: LightRig = {
  key: [0.8, -0.5], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true,
  back: [-0.6, 0.6], backBand: 1, backRamp: {skin: PAL.S2, hood: PAL.G0, cuff: PAL.G0},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.W8],
    hood: [PAL.N0, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
    cuff: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5, PAL.W7],
  },
};
const handCache = new Map<number, Img>();
export const handImg = (press: number) => {
  let v = handCache.get(press);
  if (!v) { v = renderFigure(handFig(press), HAND_RIG); handCache.set(press, v); }
  return v;
};
/** finger-tip offset inside the hand image (where the button is) */
export const HAND_TIP: [number, number] = [85 + HO[0], 61 + HO[1]];

/** The tiny button on its plate, with the label-maker strip. (x, y) = top-left of the plate. */
export const drawButton = (b: Buf, x: number, y: number, pressed: boolean, lit: boolean) => {
  // the plate: beige plastic, lit from the right by the candle, its shadow falls down-left on the cloth
  for (let j = 0; j < 6; j++) for (let i = 0; i < 44; i++) if (bayer(i, j) < 0.7 - j * 0.1) b.set(x - 3 + i, y + 22 + j - 2, PAL.P0);
  rect(x - 2, y + 20, 44, 3, b.ink(PAL.D3));
  rect(x, y, 44, 22, b.ink(PAL.P0));
  rect(x, y, 44, 1, b.ink(PAL.P2));
  rect(x + 43, y, 1, 22, b.ink(PAL.P2));
  rect(x, y + 21, 44, 1, b.ink(PAL.D4));
  rect(x + 1, y + 1, 42, 19, b.ink(PAL.P1));
  // the button: tiny. A 7px round cap in a bezel; pressed = 1px lower, lit = a cyan LED beside it
  const bx = x + 8, by = y + 6 + (pressed ? 1 : 0);
  ellipse(x + 11.5, y + 10.5, 5, 5, b.ink(PAL.D4));
  ellipse(bx + 3.5, by + 3.5, 3.6, 3.6, b.ink(PAL.P2));
  b.set(bx + 2, by + 1, PAL.W9); b.set(bx + 3, by + 1, PAL.W9);
  rect(bx + 1, by + 6, 5, 1, b.ink(PAL.P0));
  rect(x + 20, y + 8, 2, 2, b.ink(lit ? PAL.C8 : PAL.D4));
  if (lit) { b.set(x + 19, y + 8, PAL.C5); b.set(x + 22, y + 9, PAL.C5); }
  // label-maker strip under the plate: dark tape, raised white letters
  const label = 'low-key research preview';
  const lw = textWidth(label) + 8;
  rect(x - 4, y + 28, lw, 11, b.ink(PAL.N1));
  rect(x - 4, y + 38, lw, 1, b.ink(PAL.N0));
  text(b, label, x, y + 30, PAL.P1);
};
