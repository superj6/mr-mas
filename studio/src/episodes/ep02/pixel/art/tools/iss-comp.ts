// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep2 v1 art: SET-23's composites. Each 3D plate (art/iss/iss_scene.py, 1920 x 812) gets its pixel layer
// (sets/iss.ts) laid over it at x4, nearest, keeping the contrast (no grade match, no pixel rim, no down-rez); the insert
// plate's keyed gap is filled with the lit room. The band under the room area is left plain (the film's band is the
// assembly's). Writes OUT/<shot>.png at 1920 x 1080.
// Build (light) and run (through ops/heavy.sh), from studio/:
//   node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/art/tools/iss-comp.ts $S/iss-comp.cjs
//   ../ops/heavy.sh node $S/iss-comp.cjs --plates ../out/ep02/v1/art/iss/plates --out ../out/ep02/v1/art/iss
import * as fs from 'fs';
import * as path from 'path';
import {Buf, TRANSPARENT} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {writePNG} from '../../../../../shared/pixel/png';
import {issLayer, issRoom, setIssAnchors, issOver} from '../sets/iss';
import {readPNG} from './png-read';

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const PLATES = path.resolve(opt('--plates') ?? path.join(process.cwd(), '..', 'out', 'ep02', 'v1', 'art', 'iss', 'plates'));
const OUT = path.resolve(opt('--out') ?? path.join(PLATES, '..'));
fs.mkdirSync(OUT, {recursive: true});
setIssAnchors(JSON.parse(fs.readFileSync(path.join(PLATES, 'anchors.json'), 'utf8')));

const SHOTS: Array<{name: string; plate: string; f: number; st: any; layer?: string}> = [
  {name: '22.02-wide', plate: 'wide', f: 3, st: {t: 0.55, scan: true}, layer: 'wide'},
  {name: '22.02-wide-arrive', plate: 'wide', f: 0, st: {t: 1}, layer: 'wide'},
  {name: '22.04-ots', plate: 'ots', f: 0, st: {push: 1}, layer: 'ots'},
  {name: '22.05-insert', plate: 'insert', f: 0, st: {drop: 1}},
  {name: '22.06-ecu', plate: 'ecu', f: 0, st: {}},
  {name: '22.07-mcu', plate: 'mcu', f: 0, st: {lit: true}, layer: 'mcu'},
  {name: '22.08-knock', plate: 'knock', f: 0, st: {raise: 1}, layer: 'knock'},
  {name: '22.09-away', plate: 'away', f: 0, st: {t: 0.45}, layer: 'away'},
  {name: '22.09-away-far', plate: 'away', f: 1, st: {t: 1}, layer: 'away'},
];
const KEYED = (c: number) => { const r = c >> 16, g = (c >> 8) & 255, b = c & 255; return g > r + 50 && g > b + 50; };
for (const s of SHOTS) {
  const img = readPNG(path.join(PLATES, `${s.plate}.png`));
  if (!img) { console.error(`no plate ${s.plate}`); continue; }
  const W = 1920, H = 1080, out = new Uint32Array(W * H).fill(PAL.N0);
  const sx = img.w / W, sy = img.h / 812;
  for (let y = 0; y < 812; y++) for (let x = 0; x < W; x++) out[y * W + x] = img.c[Math.floor(y * sy) * img.w + Math.floor(x * sx)];
  if (s.plate === 'insert') {
    const r = new Buf(480, 270, PAL.N0); issRoom(r, s.f, s.st);
    for (let y = 0; y < 812; y++) for (let x = 0; x < W; x++) if (KEYED(out[y * W + x])) out[y * W + x] = r.c[(y >> 2) * 480 + (x >> 2)];
  }
  if (s.layer) {
    const l = new Buf(480, 270, TRANSPARENT); issLayer(l, s.layer as any, s.f, s.st);
    for (let y = 0; y < 812; y++) for (let x = 0; x < W; x++) out[y * W + x] = issOver(out[y * W + x], l.c[(y >> 2) * 480 + (x >> 2)]);
  }
  writePNG(path.join(OUT, `${s.name}.png`), W, H, out, 1);
  console.log('wrote', s.name);
}
