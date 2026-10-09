// MR. MAS — Ep2 v1 art: the creatures and things that act (manifest §2.3).
//   drawMammoth(b, x, y, f, o)   sc 1: the pixel mammoth that steps out of the bezel (88 x 74). EIGHT drawings held
//                                three frames each (f -> drawing), its own colour ramp (AROS brown: never the master's
//                                skin), palette-cycled fur (the shag's bands walk one rung on 6s), o.fifth = the fifth leg
//                                for the 2 frames of the step-out; it glides 1 px a frame (the caller moves x). Facing
//                                screen-left (it heads toward the elevators). o.melt: 0..3 nothing / the chair's drip
//   mammothPrint(b, x, y)        its footprint left in the carpet, in its own ramp (they stay)
//   meltChair(b, x, y, step)     the lobby chair beside it, melting into the carpet in three held palette-drip steps
//   drawBlimp(b, cx, cy, size, o)  sc 11, 17: the lowercase `her` blimp in four held sizes (1..4), its tether (never
//                                across the seat), running lights (o.lights: how many still on), o.sag 0..3 px
//   drawStormCloud(b, x, y, f, o)  sc 17: a cloud with a blank letterhead; o.rain: it rains letterhead
//   drawChatBalloon(b, cx, cy, size, o)  sc 23: a balloon in CHATGTP's bubble shape with its dot eyes, no words; size =
//                                one held size per pump (1..4); o.string: the string down to (sx, sy), o.taut
//   drawEggTab(b, x, y)          sc 23: an egg sitting on a bill in a background tab (no hatch, no plate)
//   drawIris(b, x, y, o)         sc 19: IRIS, a small progress bar with a face, stuck at 99%
//   drawReceipt(b, pts, o)       sc 17: the exit agreement as a thermal-paper receipt along a path (a ribbon), its lines
//                                legible where it is wide enough; o.run = the ink running in the rain
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, TR} from './kit';

// ------------------------------------------------------------------ the mammoth
/** its own ramp: deep umber to straw (dark -> light), and a tusk ivory */
export const MAMMOTH_RAMP = [PAL.D0, PAL.D1, PAL.D2, PAL.B2, PAL.D3, PAL.B3, PAL.D4, PAL.B4, PAL.W3];
const IVORY = [PAL.P0, PAL.P1, PAL.P2];
/** the eight drawings of the walk: per leg [front-near, front-far, back-near, back-far] the foot's x offset and lift */
const GAIT: Array<Array<[number, number]>> = [
  [[0, 0], [6, 0], [0, 0], [6, 0]], [[-3, 2], [5, 0], [2, 0], [8, 1]], [[-6, 3], [3, 0], [4, 0], [7, 0]], [[-5, 1], [1, 0], [5, 2], [5, 0]],
  [[-2, 0], [-1, 1], [3, 3], [3, 0]], [[1, 0], [-3, 2], [0, 1], [1, 0]], [[3, 0], [-1, 3], [-1, 0], [3, 2]], [[2, 0], [3, 1], [-1, 0], [6, 0]],
];
export const mammothDrawing = (f: number) => Math.floor(f / 3) % 8;
export const drawMammoth = (b: Buf, x: number, y: number, f: number, o: {fifth?: boolean; clip?: (x: number, y: number) => boolean} = {}) => {
  // x, y = the front of its head's box, its feet's line. Facing screen-left. 88 wide, 74 tall.
  const d = mammothDrawing(f), g = GAIT[d], cyc = Math.floor(f / 6) % 3;
  const R = MAMMOTH_RAMP;
  const bob = d % 4 === 2 ? 1 : 0;
  const set = (px: number, py: number, c: number) => { if (!o.clip || o.clip(px, py)) b.set(px, py, c); };
  // shag: vertical strands, each column its own length and tone; the palette cycle walks the strands one column on 6s
  const strand = (i: number, j: number, base: number) => {
    const col = i + cyc;
    const h = hash(col, Math.floor(j / 5), 31);
    const k = h < 0.22 ? 1 : h > 0.8 ? -1 : 0;
    return R[clamp(base + k + (col % 4 === 0 ? -1 : 0), 0, R.length - 1)];
  };
  // the silhouette (local i 0..87, j 0..73): a high domed head at the front, the shoulder hump behind it, the back
  // sloping down to the rump, the belly with its long skirt of hair
  const topAt = (i: number) => i < 6 ? 30 - i * 3 : i < 18 ? Math.round(12 - (i - 6) * 0.9) : i < 34 ? Math.round(2 + Math.pow((i - 28) / 6, 2)) : Math.round(3 + (i - 34) * 0.42);
  const hemAt = (i: number) => (i < 10 ? 36 : 52) + Math.round(3 * Math.sin(i * 1.3 + cyc)) + (hash(i + cyc, 7, 3) < 0.4 ? 2 : 0);
  // far legs first (darker), then the body, then the near legs
  const leg = (lx: number, [dx, lift]: [number, number], far: boolean) => {
    const base = far ? 1 : 3;
    for (let j = 44; j < 74 - lift; j++) for (let i = 0; i < 11; i++) {
      const px = x + lx + dx + i - (j > 68 ? 1 : 0), py = y - 74 + j + (j < 50 ? bob : 0);
      set(px, py, i === 0 ? R[0] : i === 10 ? R[1] : strand(lx + i, j, base + (i < 3 ? 1 : 0)));
    }
    for (let i = -1; i < 12; i++) set(x + lx + dx + i, y - lift - 1, R[0]);
    for (let i = 1; i < 10; i += 3) set(x + lx + dx + i, y - lift - 2, R[6]);
  };
  leg(24, g[1], true); leg(68, g[3], true);
  for (let i = 4; i < 86; i++) {
    const t = topAt(i), hm = hemAt(i);
    for (let j = t; j <= hm; j++) {
      const px = x + i, py = y - 74 + j + bob;
      const edge = j === t;
      const lit = j < t + 3 && i < 60;
      set(px, py, edge ? R[lit ? 8 : 6] : lit ? R[7] : strand(i, j, j > hm - 8 ? 2 : i < 20 ? 5 : i < 40 ? 4 : 3));
    }
  }
  // the head's front: the brow, the small eye, the ear's fringe; the trunk hanging and curling forward
  set(x + 13, y - 56 + bob, PAL.N0); set(x + 12, y - 56 + bob, PAL.N0); set(x + 12, y - 57 + bob, R[8]);
  for (let j = 0; j < 10; j++) for (let i = 0; i < 6; i++) if (i + (j % 3) < 5) set(x + 20 + i, y - 58 + j + bob, strand(20 + i, j, 2));
  for (let k = 0; k < 30; k++) {
    const tx = x + 6 - Math.round(Math.sin((k / 30) * 2.6) * 7) + (k > 26 ? k - 26 : 0), ty = y - 46 + bob + k;
    const w = k < 10 ? 6 : k < 20 ? 5 : 4;
    for (let q = 0; q < w; q++) set(tx + q, ty, q === 0 ? R[1] : q === w - 1 ? R[3] : strand(tx + q, ty, 4));
  }
  // the tusks: long ivory curves, forward, down and up again
  for (let side = 0; side < 2; side++) for (let k = 0; k < 34; k++) {
    const a = (k / 34) * Math.PI;
    const tx = x + 12 - side * 3 - Math.round(k * 0.9), ty = y - 40 + bob + Math.round(Math.sin(a) * 9) - Math.round(Math.max(0, k - 22) * 0.9);
    set(tx, ty, IVORY[side ? 1 : 2]); if (k < 24) set(tx, ty + 1, IVORY[side ? 0 : 1]);
  }
  leg(14, g[0], false); leg(58, g[2], false);
  // the fifth leg (2 frames at the step-out): a pale, wrong extra limb between the front pair
  if (o.fifth) for (let j = 46; j < 72; j++) for (let i = 0; i < 9; i++) set(x + 38 + i, y - 74 + j, i === 0 ? R[1] : strand(38 + i, j, 6));
  // the tail tuft at the rump
  for (let j = 0; j < 12; j++) set(x + 86 + (j > 8 ? 1 : 0), y - 60 + j + bob, R[j > 9 ? 7 : 2]);
};
/** a footprint in the carpet: an oval of the mammoth's own ramp, two rungs (it stays) */
export const mammothPrint = (b: Buf, x: number, y: number) => { for (let j = 0; j < 3; j++) for (let i = 0; i < 9; i++) { const d = Math.hypot((i - 4) / 4.5, (j - 1) / 1.6); if (d < 1) b.set(x + i, y + j, d > 0.6 ? MAMMOTH_RAMP[1] : MAMMOTH_RAMP[2]); } };
/** the lobby chair melting into the carpet in three held palette-drip steps (0 = whole) */
export const meltChair = (b: Buf, x: number, y: number, step: 0 | 1 | 2 | 3) => {
  const C = [PAL.R0, PAL.R1, PAL.R2, PAL.R3];
  const sag = [0, 4, 10, 16][step];
  // seat and back (a club chair in the lobby's red), drooping: each column drips down by a hashed amount
  for (let i = 0; i < 24; i++) {
    const drip = step ? Math.round(hash(i, 3, 5) * sag) : 0;
    const top = y - 26 + sag + Math.round(Math.sin((i / 24) * Math.PI) * (step ? -2 : 0));
    const bottom = y + Math.min(drip, 6);
    for (let yy = top; yy < bottom; yy++) {
      const back = i > 16 && yy < y - 12 + sag;
      if (yy < y - 14 + sag && !back && step < 3) continue;
      b.set(x + i, yy, yy > y - 3 ? C[0] : back ? C[2] : i < 4 ? C[3] : C[1]);
    }
    if (step >= 2) for (let k = 0; k < drip; k++) b.set(x + i, y + k, k === drip - 1 ? C[2] : C[1]);
  }
};

// ------------------------------------------------------------------ the blimp
/** sizes 1..4: a lowercase `her` blimp (a silver envelope with the word in it, fins, a gondola), its running lights */
export const drawBlimp = (b: Buf, cx: number, cy: number, size: 1 | 2 | 3 | 4, o: {lights?: number; sag?: number; tether?: [number, number] | null; f?: number} = {}) => {
  const rx = [22, 34, 52, 76][size - 1], ry = Math.round(rx * 0.36), sag = o.sag ?? 0;
  const Y = cy + sag;
  if (o.tether) line(cx - Math.round(rx * 0.2), Y + ry, o.tether[0], o.tether[1], b.ink(PAL.G3));
  // the envelope: silver-grey with a lit top, its seams, a slight droop when sagging
  for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) {
    const d = Math.hypot(i / rx, j / ry);
    if (d >= 1) continue;
    const droop = sag ? Math.round((Math.abs(i) / rx) * sag * 0.6) : 0;
    const c = j < -ry * 0.5 ? PAL.G6 : j < 0 ? PAL.G5 : j < ry * 0.6 ? PAL.G4 : PAL.G3;
    b.set(cx + i, Y + j + droop, (i % Math.max(6, Math.round(rx / 4)) === 0 && Math.abs(j) < ry - 1) ? stepColor(c, -1) : c);
  }
  // fins at the tail (right)
  poly([cx + rx - 6, Y - 2, cx + rx + Math.round(rx * 0.25), Y - ry - Math.round(ry * 0.4), cx + rx + Math.round(rx * 0.2), Y - 1], b.ink(PAL.G3));
  poly([cx + rx - 6, Y + 2, cx + rx + Math.round(rx * 0.25), Y + ry + Math.round(ry * 0.4), cx + rx + Math.round(rx * 0.2), Y + 1], b.ink(PAL.G2));
  // the gondola
  fill(b, cx - Math.round(rx * 0.2), Y + ry - 1, Math.round(rx * 0.4), Math.max(3, Math.round(ry * 0.3)), PAL.G2);
  // the word, lowercase, in the envelope
  const word = 'her';
  if (size >= 3) { const w = bpw(word); bpt(b, word, cx - Math.round(w / 2) - 4, Y - 7, PAL.N1); }
  else { const w = pw(word); pt(b, word, cx - Math.round(w / 2) - 2, Y - 3, PAL.N1); }
  // running lights along the bottom seam: o.lights of 5 still on
  const lit = o.lights ?? 5;
  for (let k = 0; k < 5; k++) { const lx = cx - rx + Math.round(((k + 1) * 2 * rx) / 6); b.set(lx, Y + Math.round(ry * 0.75), k < lit ? (k % 2 ? PAL.R3 : PAL.L3) : PAL.G2); }
};

// ------------------------------------------------------------------ the storm cloud with a blank letterhead
export const drawStormCloud = (b: Buf, x: number, y: number, f: number, o: {rain?: boolean; flash?: boolean} = {}) => {
  const lobes: Array<[number, number, number]> = [[20, 22, 16], [44, 14, 20], [72, 18, 18], [96, 24, 14], [58, 28, 26], [30, 30, 16], [86, 32, 16]];
  for (const [lx, ly, r] of lobes) for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const d = Math.hypot(i, j * 1.2); if (d < r) b.set(x + lx + i, y + ly + j, o.flash ? PAL.N7 : j < -r * 0.4 ? PAL.N4 : j < r * 0.3 ? PAL.N3 : PAL.N2); }
  // the letterhead: a blank sheet's top edge and its empty rule, pinned to the cloud's face
  fill(b, x + 36, y + 22, 44, 18, PAL.P1); fill(b, x + 36, y + 22, 44, 1, PAL.P2); fill(b, x + 40, y + 27, 36, 1, PAL.G4); fill(b, x + 40, y + 31, 20, 1, PAL.G5);
  if (o.rain) for (let k = 0; k < 26; k++) { const rx = x + 8 + Math.floor(hash(k, 1, 9) * 104), ry = y + 44 + ((Math.floor(hash(k, 2, 9) * 80) + f * 3) % 120); fill(b, rx, ry, 4, 3, PAL.P1); b.set(rx, ry, PAL.P2); fill(b, rx + 1, ry + 1, 2, 1, PAL.G4); }
};

// ------------------------------------------------------------------ the chatbot balloon (the tag)
export const drawChatBalloon = (b: Buf, cx: number, cy: number, size: 1 | 2 | 3 | 4, o: {string?: [number, number]; taut?: boolean; scale?: number} = {}) => {
  const w = Math.round([10, 16, 22, 28][size - 1] * (o.scale ?? 1)), h = Math.round(w * 0.78);
  const x0 = cx - (w >> 1), y0 = cy - (h >> 1);
  // CHATGTP's bubble: a rounded rectangle, the tail at its lower left, two dot eyes (no words, no sticker)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const cxr = Math.min(i, w - 1 - i), cyr = Math.min(j, h - 1 - j);
    if (cxr + cyr < Math.max(2, Math.round(w / 6))) continue;
    b.set(x0 + i, y0 + j, j < 2 ? PAL.P2 : cxr < 2 || cyr < 2 ? PAL.C5 : PAL.P1);
  }
  poly([x0 + 2, y0 + h - 2, x0 + Math.round(w * 0.3), y0 + h - 2, x0 - 1, y0 + h + Math.round(h * 0.3)], b.ink(PAL.P1));
  const er = Math.max(1, Math.round(w / 12));
  for (const ex of [cx - Math.round(w * 0.18), cx + Math.round(w * 0.18)]) ellipse(ex, cy - 1, er, er, b.ink(PAL.N0));
  b.set(cx + Math.round(w * 0.3), y0 + 3, PAL.W9);
  if (o.string) {
    const [sx, sy] = o.string;
    const ax = x0 + Math.round(w * 0.1), ay = y0 + h + Math.round(h * 0.3);
    if (o.taut) line(ax, ay, sx, sy, b.ink(PAL.G6));
    else { const n = Math.max(2, Math.abs(sy - ay)); for (let k = 0; k <= n; k++) { const t = k / n; b.set(Math.round(ax + (sx - ax) * t + Math.sin(t * Math.PI * 2) * 3), Math.round(ay + (sy - ay) * t), PAL.G5); } }
  }
};

// ------------------------------------------------------------------ the egg on a bill (a background tab)
export const drawEggTab = (b: Buf, x: number, y: number) => {
  // the tab: a browser tab strip and its page: a bill's first page (lines), an egg resting on it
  fill(b, x, y, 70, 8, PAL.N2); fill(b, x + 2, y + 1, 30, 7, PAL.N4); tiny(b, 'BILL', x + 4, y + 2, PAL.P1);
  fill(b, x, y + 8, 70, 44, PAL.P1); fill(b, x + 6, y + 12, 58, 1, PAL.G4);
  for (let r = 0; r < 6; r++) fill(b, x + 6, y + 18 + r * 5, 40 + ((r * 13) % 18), 1, PAL.G5);
  for (let j = 0; j < 14; j++) for (let i = 0; i < 11; i++) { const d = Math.hypot((i - 5) / 5.5, (j - 8) / (j < 8 ? 8 : 6)); if (d < 1) b.set(x + 48 + i, y + 30 + j, i < 4 && j < 8 ? PAL.P2 : d > 0.8 ? PAL.P0 : PAL.W9); }
  fill(b, x + 47, y + 44, 13, 1, PAL.G4);
};

// ------------------------------------------------------------------ IRIS (a progress bar with a face, stuck at 99%)
export const drawIris = (b: Buf, x: number, y: number, o: {blink?: boolean; labelAbove?: boolean} = {}) => {
  fill(b, x, y, 40, 12, PAL.G6); fill(b, x + 1, y + 1, 38, 10, PAL.N1);
  fill(b, x + 2, y + 2, 35, 8, PAL.C5); fill(b, x + 2, y + 2, 35, 1, PAL.C7);
  // the face in the bar's filled part: two dot eyes, a small patient mouth
  if (o.blink) { fill(b, x + 12, y + 5, 3, 1, PAL.N0); fill(b, x + 22, y + 5, 3, 1, PAL.N0); } else { fill(b, x + 13, y + 4, 2, 2, PAL.N0); fill(b, x + 23, y + 4, 2, 2, PAL.N0); }
  fill(b, x + 16, y + 8, 6, 1, PAL.N0);
  if (o.labelAbove) { fill(b, x + 10, y - 9, 17, 8, PAL.N1); tiny(b, '99%', x + 12, y - 8, PAL.P1); } else tiny(b, '99%', x + 12, y + 14, PAL.P1);
};

// ------------------------------------------------------------------ the receipt (the exit agreement)
export const RECEIPT_LINES = ['NON-DISPARAGEMENT', 'IN PERPETUITY', 'CLAUSE 9: THIS RECEIPT DOES NOT EXIST.', '- - - - - - - - - - -', 'SAVE 0% ON YOUR NEXT EXIT'];
/** the receipt as a straight run (a strip w wide at x, y, `len` long, scrolled by `scroll` px): thermal paper, its
 *  printed lines in the 7 px face; `run` = ink running in the rain (lines smear down in held steps) */
export const drawReceiptStrip = (b: Buf, x: number, y: number, w: number, len: number, scroll: number, o: {run?: number; dir?: 'down' | 'right'; flat?: boolean} = {}) => {
  const t = new Buf(w, len, TR);
  fill(t, 0, 0, w, len, o.flat ? PAL.P1 : PAL.P2); fill(t, 0, 0, 1, len, PAL.P0); fill(t, w - 1, 0, 1, len, PAL.P0);
  const pitch = 14;
  for (let k = -2; k * pitch < len + scroll + pitch; k++) {
    const yy = k * pitch - (scroll % (RECEIPT_LINES.length * pitch)) + 4;
    const s = RECEIPT_LINES[((k % RECEIPT_LINES.length) + RECEIPT_LINES.length) % RECEIPT_LINES.length];
    if (yy < -8 || yy > len) continue;
    if (pw(s) <= w - 4) pt(t, s, 2, yy, PAL.N2); else tiny(t, s, 2, yy + 1, PAL.N2);
    if (o.run) for (let r = 1; r <= o.run; r++) for (let i = 2; i < Math.min(w - 2, pw(s) + 2); i += 3) if (hash(i, k, 4) < 0.5) t.set(i, yy + 6 + r * 2, PAL.G5);
  }
  for (let j = 0; j < len; j++) for (let i = 0; i < w; i++) { const v = t.c[j * w + i]; if (v === TR) continue; if (o.dir === 'right') b.set(x + j, y + i, v); else b.set(x + i, y + j, v); }
};
/** the receipt lying across a lane in perspective (a band from (x0, y) to (x1, y) of height h at the near end) */
export const drawReceiptLane = (b: Buf, x0: number, x1: number, y: number, h: number, scroll: number, o: {run?: number; tyres?: number[]} = {}) => {
  const len = x1 - x0;
  const t = new Buf(len, h, TR);
  drawReceiptStrip(t, 0, 0, h, len, scroll, {run: o.run, dir: 'right'});
  for (let j = 0; j < h; j++) for (let i = 0; i < len; i++) { const v = t.c[j * len + i]; if (v !== TR) b.set(x0 + i, y + j, v); }
  for (const tx of o.tyres ?? []) for (let j = 0; j < h; j++) { b.set(tx, y + j, PAL.G4); b.set(tx + 1, y + j, PAL.G5); }
};
void rect; void bayer; void tinyWidth;
