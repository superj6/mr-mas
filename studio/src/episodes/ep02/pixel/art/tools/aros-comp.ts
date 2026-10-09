// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep2 v1 art: the 2.A leap's composites. The programmatic filler's frames (art/aros/aros_mammoth.py: the
// near-photoreal mammoth, rendered at the lobby wall screen's own rect x4) laid into the lobby at 1080p, whole, keeping
// the contrast (P12: no grade match, no pixel rim, no down-rez): the pixel lobby x4 nearest, the leap inside the bezel.
//   1.05-aros-bezel   the preview playing in the bezel (frame 20)
//   1.08-step-out     on "sentence": its foot over the bezel's lower edge, the part outside the screen turned pixel (the
//                     8-drawing pixel mammoth), the near-photoreal inside it
// Build (light) and run (through ops/heavy.sh), from studio/:
//   node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/art/tools/aros-comp.ts $S/aros-comp.cjs
//   ../ops/heavy.sh node $S/aros-comp.cjs --frames ../out/ep02/v1/art/aros/frames --out ../out/ep02/v1/art/aros
import * as fs from 'fs';
import * as path from 'path';
import {Buf, TRANSPARENT} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {writePNG} from '../../../../../shared/pixel/png';
import {drawLobby2, LOBBY2} from '../sets/lobby2';
import {drawSelbeepRoom, drawDirectorsChair} from '../cast/selbeep';
import {drawMasStand} from '../../../../../shared/pixel/cast/mas-stand';
import {drawMammoth} from '../creatures';
import {readPNG} from './png-read';

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const FR = path.resolve(opt('--frames') ?? path.join(process.cwd(), '..', 'out', 'ep02', 'v1', 'art', 'aros', 'frames'));
const OUT = path.resolve(opt('--out') ?? path.join(FR, '..'));
fs.mkdirSync(OUT, {recursive: true});
const S = LOBBY2.SCREEN, sx0 = S.x0 * 4, sy0 = S.y0 * 4, sw = (S.x1 - S.x0 + 1) * 4, sh = (S.y1 - S.y0 + 1) * 4;
const comp = (name: string, frame: number, step: boolean) => {
  const img = readPNG(path.join(FR, `aros_${String(frame).padStart(4, '0')}.png`));
  if (!img) { console.error('no frame', frame); return; }
  const b = new Buf(480, 270, PAL.N0);
  drawLobby2(b, {f: 0, sign1: step ? '100' : '86', screen: (bb, r) => { for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) bb.set(r.x + i, r.y + j, PAL.N0); }}, {
    back: (bb) => { drawMasStand(bb, 28, 152, {legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'}); drawDirectorsChair(bb, 404, 168); },
    front: (bb) => drawSelbeepRoom(bb, 330, 196, {arm: 'present', mouth: 'open'}),
  });
  const W = 1920, H = 1080, out = new Uint32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) out[y * W + x] = b.c[(y >> 2) * 480 + (x >> 2)];
  // the leap, whole, inside the bezel
  // (on the step-out the clip is pushed in about its feet, so the mammoth fills the screen and its feet meet the
  // bezel's lower edge; the pixel mammoth below carries on from there: only its legs and feet show outside the screen)
  const C = step ? {x: 88, y: 89, w: 211, h: 207} : {x: 0, y: 0, w: img.w, h: img.h};
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) out[(sy0 + y) * W + sx0 + x] = img.c[(C.y + Math.floor((y * C.h) / sh)) * img.w + C.x + Math.floor((x * C.w) / sw)];
  if (step) {
    // the step-out: its feet over the bezel's lower edge onto the carpet, the part outside the screen pixel
    const l = new Buf(480, 270, TRANSPARENT);
    drawMammoth(l, S.x0 + 8, S.y1 + 10, 3);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const v = l.c[(y >> 2) * 480 + (x >> 2)]; if (v === TRANSPARENT) continue; const inside = x >= sx0 && x < sx0 + sw && y >= sy0 && y < sy0 + sh; if (!inside) out[y * W + x] = v; }
  }
  writePNG(path.join(OUT, `${name}.png`), W, H, out, 1);
  console.log('wrote', name);
};
comp('1.05-aros-bezel', 20, false);
comp('1.08-step-out', 44, true);
