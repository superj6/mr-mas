// @ts-nocheck -- Node-only dev tool: prototype 2's review sheet (final polish). 1920 x 1080.
//   rows 1-2: the eight key frames of the build's variant (the TEAR), each a 4x box downsample of the real frame,
//             which is exactly the 480 x 270 phone read (§5.4 lesson 15)
//   row 3:    the tear at 1:1 (the continuous medium), and the two rejected variants at phone size: B SEAM (read cold
//             as a lit spire) and A GLASS (read cold as a smashed window)
// Labels in the show's 7 px pixel font. Pixel-identical frames to the Remotion composition (same compose()).
//   node sheet.js <out.png>
import {writePNG} from '../../../pixeladv/tools/png';
import {Buf} from '../../../../shared/pixel/px';
import {text, textWidth} from '../../../../shared/pixel/font';
import {compose, OUT_W, VARIANT} from '../scene';
import {T, N} from '../timing';

const out = process.argv[2];
const W = 1920, H = 1080;
const c = new Uint32Array(W * H).fill(0x07080d);
const label = (s: string, x: number, y: number, k: number, col = 0xc8cbd6) => {
  const w = textWidth(s) + 2, b = new Buf(w, 10, 0);
  text(b, s, 0, 0, 1);
  for (let j = 0; j < 10; j++) for (let i = 0; i < w; i++) if (b.c[j * w + i] === 1)
    for (let v = 0; v < k; v++) for (let u = 0; u < k; u++) { const X = x + i * k + u, Y = y + j * k + v; if (X < W && Y < H) c[Y * W + X] = col; }
};
const thumb = (p: number, variant: string, x: number, y: number) => {
  const {rgba} = compose(p, undefined, variant);
  for (let ty = 0; ty < 270; ty++) for (let tx = 0; tx < 480; tx++) {
    let r = 0, g = 0, b = 0;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const o = ((ty * 4 + j) * OUT_W + tx * 4 + i) * 4; r += rgba[o]; g += rgba[o + 1]; b += rgba[o + 2]; }
    c[(y + ty) * W + x + tx] = (Math.round(r / 16) << 16) | (Math.round(g / 16) << 8) | Math.round(b / 16);
  }
};
const crop = (p: number, variant: string, x: number, y: number, cx: number, cy: number, cw = 480, ch = 270) => {
  const {rgba} = compose(p, undefined, variant);
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const o = ((cy + j) * OUT_W + cx + i) * 4; c[(y + j) * W + x + i] = (rgba[o] << 16) | (rgba[o + 1] << 8) | rgba[o + 2]; }
};
const frame = (x: number, y: number, w = 480, h = 270) => { for (let i = 0; i < w; i++) { c[y * W + x + i] = 0x07080d; c[(y + h - 1) * W + x + i] = 0x07080d; } for (let j = 0; j < h; j++) { c[(y + j) * W + x] = 0x07080d; c[(y + j) * W + x + w - 1] = 0x07080d; } };

label('MR. MAS · STYLE JUMP PROTOTYPE 2 · J3 "THE SKY OPENS" · Ep9 Act Two no.23 · M1 rung 1 · final: THE TEAR', 24, 18, 3);
label(`1920x1080 · 24 fps · ${N} f · tear from p${T.crack} · opens p${T.open} · seal p${T.seal} · back p${T.back} · every thumbnail is the 480x270 phone read · internal only`, 24, 58, 2, 0x8a93a8);
const KEY: Array<[number, string]> = [
  [18, 'p18 pixel (W); he reads'], [33, 'p33 the tear runs down'], [40, 'p40 torn hairline; Orb has seen'], [49, 'p49 pulled apart (14)'],
  [75, 'p75 the hold (20): the far side'], [94, 'p94 the seal (5)'], [104, 'p104 the scar'], [116, 'p116 pixel; he reads on'],
];
KEY.forEach(([p, s], k) => {
  const x = (k % 4) * 480, y = k < 4 ? 120 : 424;
  label(s, x + 8, y - 26, 2);
  thumb(p, VARIANT, x, y);
  frame(x, y);
});
label('p75 the tear at 1:1 (continuous tone)', 8, 702, 2);
crop(75, VARIANT, 0, 728, 700, 0);
label('REJECTED  B · SEAM p75 (phone)', 488, 702, 2, 0xd9a07a);
thumb(75, 'seam', 480, 728);
label('REJECTED  A · GLASS p75 (phone)', 968, 702, 2, 0xd9a07a);
thumb(75, 'glass', 960, 728);
[0, 480, 960].forEach((x) => frame(x, 728));
const notes = [
  'BLIND COLD READS (480x270)',
  'B SEAM: its column sat on a',
  'tower roof: "a lit spire";',
  'the clean strip: "a pasted',
  'texture or a render glitch".',
  'A GLASS: "a smashed window,',
  'a bullet hole" (and an attack',
  'on his home: guardrail).',
];
notes.forEach((s, i) => label(s, 1452, 736 + i * 30, 2, i === 0 ? 0xf2d38a : 0xc8cbd6));
writePNG(out, W, H, c, 1);
console.log(out);
