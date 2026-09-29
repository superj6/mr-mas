// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of prototype 4: the exact frames the Remotion render makes (same pure renderer).
//   npx esbuild src/dev/range/p4/tools/preview.ts --bundle --platform=node --outfile=<scratch>/p4prev.cjs
//   node <scratch>/p4prev.cjs <outDir> full|native|both f1,f2,...      (full = 1920x1080, native = 480x270)
//   node <scratch>/p4prev.cjs <outDir> sheet <name> f1,f2,...          (a labelled contact sheet at native x1)
import * as fs from 'fs';
import {writePNG} from '../../../../shared/pixel/png';
import {renderFrame, renderNative, OUT_W, OUT_H} from '../render';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text} from '../../../../shared/pixel/font';

const [outDir, mode, a, b] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const frames = (s: string) => s.split(',').flatMap((t) => {
  if (t.includes('-')) { const [x, y, st] = t.split(/[-:]/).map(Number); const r = []; for (let f = x; f <= y; f += st || 1) r.push(f); return r; }
  return [Number(t)];
});

if (mode === 'sheet') {
  const list = frames(b);
  const cols = 4, rows = Math.ceil(list.length / cols);
  const W = 480 * cols + 8 * (cols + 1), H = (270 + 14) * rows + 8 * (rows + 1) + 16;
  const sheet = new Buf(W, H, PAL.N0);
  text(sheet, a, 8, 5, PAL.N7);
  list.forEach((f, i) => {
    const c = renderNative(f);
    const x0 = 8 + (i % cols) * (480 + 8), y0 = 24 + Math.floor(i / cols) * (270 + 14 + 8);
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) sheet.set(x0 + x, y0 + y, c[y * 480 + x]);
    text(sheet, `p${f}`, x0, y0 + 272, PAL.N6);
  });
  writePNG(`${outDir}/${a}.png`, W, H, sheet.c, 1);
} else {
  for (const f of frames(b ?? a)) {
    const t0 = Date.now();
    if (mode === 'full' || mode === 'both') {
      const out = new Uint8ClampedArray(OUT_W * OUT_H * 4);
      renderFrame(f, out);
      const c = new Uint32Array(OUT_W * OUT_H);
      for (let i = 0; i < c.length; i++) c[i] = (out[i * 4] << 16) | (out[i * 4 + 1] << 8) | out[i * 4 + 2];
      writePNG(`${outDir}/f${String(f).padStart(3, '0')}.png`, OUT_W, OUT_H, c, 1);
    }
    if (mode === 'native' || mode === 'both') writePNG(`${outDir}/n${String(f).padStart(3, '0')}.png`, 480, 270, renderNative(f), 2);
    console.log(`p${f} ${Date.now() - t0} ms`);
  }
}
