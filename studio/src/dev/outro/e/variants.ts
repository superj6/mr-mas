// MR. MAS — outro E: two later rungs of the file-type ladder, as stills (proposal doc §6 "Per episode").
//   Ep3  ep1.2_strawberry.jpg  an image viewer: the photo in 8x8 JPEG blocks, and the info (EXIF) panel holding the
//        credits; the AI-tool disclosure is literally the Software field. The pointer still clicks the close box.
//   Ep10 ep1.9_pace.yaml       a config editor: the machine types the credits block itself. No pointer, no hands; the
//        values are already in place before their keys are typed, aligned to a column no typist would bother with,
//        and the close box lights on its own (it will close itself).
// The terms line and the pointer line are identical in every episode (drawn by the scene, not here).
import {Buf, rect, ellipse, poly} from '../../../shared/pixel/px';
import {PAL, nearest, ALL_COLORS} from '../../../shared/pixel/palette';
import {wrap} from '../../../shared/pixel/font';
import {str, strW, Seg} from './text';
import {BODY, drawWindow, drawEditor, EditorLine, TEXT_X, LINE0, LINE_STEP} from './window';

// ================================================================== Ep3: strawberry.jpg
const IMG = {x: BODY.x + 8, y: BODY.y + 8, w: 216, h: 184};

/** the photo before compression: a garden strawberry, close, soft green bokeh behind it, sun from the top-left */
const photo = () => {
  const b = new Buf(IMG.w, IMG.h, PAL.L1);
  // the garden: darker toward the bottom-right, a few out-of-focus leaves and one warm patch of sun
  for (let y = 0; y < IMG.h; y++) for (let x = 0; x < IMG.w; x++) {
    const t = (x / IMG.w) * 0.3 + (y / IMG.h) * 0.7;
    b.set(x, y, t > 0.55 ? PAL.L0 : PAL.L1);
  }
  ellipse(34, 40, 26, 20, b.ink(PAL.L2));
  ellipse(186, 44, 22, 18, b.ink(PAL.L2));
  ellipse(192, 40, 10, 8, b.ink(PAL.L3));
  ellipse(24, 150, 26, 20, b.ink(PAL.L0));
  ellipse(196, 150, 30, 26, b.ink(PAL.L0));
  ellipse(64, 18, 12, 9, b.ink(PAL.W6));
  // the berry: widest a third of the way down, a rounded point at the bottom
  const cx = 110, top = 56, bot = 172, R = 60;
  const half = (t: number) => (t < 0.3 ? R * Math.pow(Math.sin((t / 0.3) * Math.PI / 2), 0.55) : R * Math.pow(1 - Math.pow((t - 0.3) / 0.7, 1.7), 0.75));
  for (let y = top; y <= bot; y++) {
    const t = (y - top) / (bot - top);
    const h = Math.round(half(t));
    for (let x = cx - h; x <= cx + h; x++) {
      const u = (x - cx) / Math.max(1, h);
      const lit = 0.55 * (1 - (u + 1) / 2) + 0.55 * (1 - t) + (Math.abs(u + 0.45) < 0.18 && t > 0.15 && t < 0.45 ? 0.35 : 0);
      b.set(x, y, lit > 0.95 ? PAL.R3 : lit > 0.62 ? PAL.R2 : lit > 0.34 ? PAL.R1 : PAL.R0);
    }
  }
  // seeds: small pits on a diamond lattice, each a yellow fleck with a dark lip
  for (let j = 0; j < 12; j++) for (let i = -7; i <= 7; i++) {
    const y = top + 12 + j * 9, x = cx + i * 10 + (j & 1 ? 5 : 0);
    const t = (y - top) / (bot - top);
    if (t > 0.96 || Math.abs(x - cx) > half(t) - 5) continue;
    b.set(x, y, PAL.W7); b.set(x + 1, y, PAL.W6); b.set(x, y + 1, PAL.R0);
  }
  // the calyx: six sepals splayed flat over the shoulders, and the stem
  const sep: Array<[number, number]> = [[-44, 10], [-30, -2], [-10, -8], [12, -8], [32, -2], [46, 10]];
  for (const [dx, dy] of sep) {
    poly([cx - 6, top + 2, cx + dx, top + dy + 10, cx + 6, top + 4], b.ink(PAL.L2));
    poly([cx - 2, top + 2, cx + dx * 0.8, top + dy + 9, cx + 3, top + 3], b.ink(PAL.L3));
  }
  rect(cx - 3, top - 22, 6, 24, b.ink(PAL.L3));
  return b;
};

/** 8x8 blocks, each its mean plus a first-order ramp (a stand-in for the DC and the first two AC terms), snapped
 *  back to the master palette: the blocking a heavy JPEG leaves */
const jpeg = (src: Buf) => {
  const out = new Buf(src.w, src.h, 0);
  const ch = (c: number, s: number) => (c >> s) & 255;
  for (let by = 0; by < src.h; by += 8) for (let bx = 0; bx < src.w; bx += 8) {
    const acc = [0, 0, 0], gx = [0, 0, 0], gy = [0, 0, 0];
    let n = 0;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const c = src.get(bx + x, by + y);
      [16, 8, 0].forEach((s, k) => { const v = ch(c, s); acc[k] += v; gx[k] += v * (x - 3.5); gy[k] += v * (y - 3.5); });
      n++;
    }
    const m = acc.map((v) => v / n), sx = gx.map((v) => v / 336 * 0.8), sy = gy.map((v) => v / 336 * 0.8);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const v = m.map((mv, k) => Math.max(0, Math.min(255, Math.round(mv + sx[k] * (x - 3.5) + sy[k] * (y - 3.5)))));
      out.set(bx + x, by + y, nearest((v[0] << 16) | (v[1] << 8) | v[2], ALL_COLORS));
    }
  }
  return out;
};
let jpegCache: Buf | null = null;

const INFO_X = IMG.x + IMG.w + 8;
const INFO_W = BODY.x + BODY.w - 6 - INFO_X;
const KEY_W = 44;
export const EP3_TITLE = 'ep1.2_strawberry.jpg';
export const EP3_INFO: Array<[string, string, boolean?]> = [
  ['File', 'ep1.2_strawberry.jpg'],
  ['Camera', 'none'],
  ['Title', 'MR. MAS'],
  ['Artist', '(creator)'],
  ['Comment', 'written: (creator), with AI'],
  ['Rendered', 'picture · music, in code'],
  ['Voices', 'synthetic · none cloned'],
  ['Software', 'AI tools: used throughout · listed in the notice', true],
];

export const drawEp3 = (b: Buf) => drawWindow(b, EP3_TITLE, 'jpg', {}, (bb) => {
  const img = (jpegCache ??= jpeg(photo()));
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) bb.set(IMG.x + x, IMG.y + y, img.c[y * img.w + x]);
  // the info panel
  rect(INFO_X, IMG.y, INFO_W, IMG.h, bb.ink(PAL.N2));
  str(bb, 'info', INFO_X + 6, IMG.y + 5, PAL.P1);
  rect(INFO_X + 6, IMG.y + 15, INFO_W - 12, 1, bb.ink(PAL.N4));
  let y = IMG.y + 21;
  for (const [k, v, hot] of EP3_INFO) {
    str(bb, k, INFO_X + 6, y, PAL.N8);
    const lines = wrap(v, INFO_W - KEY_W - 12);
    lines.forEach((ln, i) => str(bb, ln, INFO_X + 6 + KEY_W, y + i * LINE_STEP, hot ? PAL.C6 : PAL.P1));
    y += lines.length * LINE_STEP + 4;
  }
});

// ================================================================== Ep10: pace.yaml, typed by the machine
export const EP10_TITLE = 'ep1.9_pace.yaml';
const K = PAL.C5, V = PAL.P1, MARK = PAL.N7, DIM = PAL.N8;
/** the machine aligns every value to one column */
const VAL_X = TEXT_X + strW('  picture · music:') + 10;
export const EP10_KEYS = ['title', 'created by', 'written', 'picture · music', 'voices', 'AI tools'];
// the same on-screen values as Ep1 (window.ts EP1_LINES; polish pass): title without the filename, the short forms
export const EP10_VALS = ['MR. MAS', '(creator)', '(creator), with AI', 'rendered in code',
  'synthetic · none cloned', 'used throughout · listed in the notice'];
/** the still's moment: keys 0-2 typed, key 3 half typed, keys 4-5 not yet; every value already there */
const TYPED = [99, 99, 99, 8, 0, 0];

export const drawEp10 = (b: Buf) => drawWindow(b, EP10_TITLE, 'yaml', {selfHover: true}, (bb) => {
  const head: EditorLine[] = [
    {n: 41, segs: [['#', MARK], [' ep1.9_pace.yaml', DIM]]},
    {n: 42, segs: [['pace', DIM], [':', MARK], [' agreed', DIM], ['    # unit: steps', MARK]]},
    {n: 43, segs: []},
    {n: 44, segs: [['credits', K], [':', MARK]]},
  ];
  const rows: EditorLine[] = EP10_KEYS.map((k, i) => {
    const t = Math.min(TYPED[i], k.length + 1);
    const typed = (k + ':').slice(0, t);
    const segs: Seg[] = [['  ' + typed.replace(/:$/, ''), K]];
    if (typed.endsWith(':')) segs.push([':', MARK]);
    return {n: 45 + i, segs};
  });
  const lines = [...head, ...rows, {n: 51, segs: [] as Seg[]}];
  // the caret sits in the half-typed key
  const ci = TYPED.findIndex((t, i) => t < EP10_KEYS[i].length + 1);
  const cx = TEXT_X + strW('  ' + EP10_KEYS[ci].slice(0, TYPED[ci])) + 1;
  drawEditor(bb, lines, {line: head.length + ci, x: cx, on: true});
  EP10_VALS.forEach((v, i) => str(bb, v, VAL_X, LINE0 + (head.length + i) * LINE_STEP, V));
});
