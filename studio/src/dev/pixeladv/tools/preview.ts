// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Dev-only Node preview: bundle with esbuild and run to dump frames as PNGs in seconds.
//   node <bundle>.js <outDir> <scale> <frame|sheet-id> [...]
import {writePNG} from '../../../shared/pixel/png';
import {renderScene, renderSheet} from '../scene';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const id of ids) {
  if (id.startsWith('grid:')) {
    // contact sheet: up to 16 scene frames at 1x in a 4-column grid, labelled by frame number
    const fr = id.slice(5).split(',').map(Number);
    const cols = 4, rows = Math.ceil(fr.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const c = new Uint32Array(W * H);
    fr.forEach((n, k) => {
      const b = renderScene(n);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * W + ox + x] = b.c[y * 480 + x];
      // frame tick marks (n in binary-ish bars) — top-left corner
      for (let i = 0; i < 7; i++) for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) c[(oy + y + 1) * W + ox + 1 + i * 4 + x] = (n >> (6 - i)) & 1 ? 0xffffff : 0x333333;
    });
    writePNG(`${outDir}/grid.png`, W, H, c, 1);
    console.log('wrote grid');
    continue;
  }
  if (id.startsWith('crop:')) {
    // crop:<frames comma list>:x:y:w:h -> frames side by side
    const [, fl, xs, ys, ws, hs] = id.split(':');
    const fr = fl.split(',').map(Number);
    const [x0, y0, w, h] = [xs, ys, ws, hs].map(Number);
    const W = w * fr.length + (fr.length - 1) * 2;
    const c = new Uint32Array(W * h).fill(0x222222);
    fr.forEach((n, k) => {
      const b = renderScene(n);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c[y * W + k * (w + 2) + x] = b.c[(y0 + y) * 480 + x0 + x];
    });
    writePNG(`${outDir}/crop.png`, W, h, c, scale);
    console.log('wrote crop');
    continue;
  }
  const buf = /^\d+$/.test(id) ? renderScene(Number(id)) : renderSheet(id);
  writePNG(`${outDir}/${id}.png`, buf.w, buf.h, buf.c, scale);
  console.log('wrote', id);
}
