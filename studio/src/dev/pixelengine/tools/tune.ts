// @ts-nocheck -- Node-only dev tool: palette tone-curve variants in a grid (dev iteration only).
import {writePNG} from '../../../shared/pixel/png';
import {PALETTES} from '../../../shared/pixel/palettes';
import {bayer4, bayer8, cluster4, checker} from '../../../shared/pixel/dither';
import {roomFrame} from '../room';
const [out, which] = process.argv.slice(2);
const pats = {bayer4, bayer8, cluster4, checker};
const variants = JSON.parse(process.argv[4]);
const frames = [roomFrame({world: 10, ui: true}), roomFrame({world: 74, ui: true, convo: true})];
const cols = 2, rows = variants.length;
const W = 480 * cols, H = 270 * rows;
const c = new Uint32Array(W * H);
variants.forEach((v, r) => {
  const set = PALETTES[which].with({...v, pattern: v.pattern ? pats[v.pattern] : undefined});
  frames.forEach((fb, k) => {
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(r * 270 + y) * W + k * 480 + x] = set.map(fb.c[y * 480 + x], x, y);
  });
});
writePNG(out, W, H, c, 1);
