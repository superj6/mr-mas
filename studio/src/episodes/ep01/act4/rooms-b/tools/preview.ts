// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview for ep01 act4 rooms B (pixel-exact: these rooms use no glyph layers).
//   npx esbuild src/episodes/ep01/act4/rooms-b/tools/preview.ts --bundle --platform=node --outfile=<scratch>/rb.js
//   node <scratch>/rb.js <outDir> <scale> <id|all> [frame]
import {writePNG} from '../../../../../dev/pixeladv/tools/png';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {strayColors} from '../../../../../shared/pixel/palettes';
import {SCENES} from '../scenes';

const [outDir, scaleS, which = 'all', frameS = '0', mode = ''] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const frames = frameS.split(',').map(Number);
if (mode.startsWith('strip')) {
  // contact strip: frames side by side at 1x (optionally cropped to rows y0..y1: strip:y0:y1)
  const [, a, b] = mode.split(':');
  const y0 = Number(a ?? 0), y1 = Number(b ?? 270), h = y1 - y0;
  const s = SCENES.find((q) => q.id === which);
  const cols = 4, rows = Math.ceil(frames.length / cols);
  const out = new Uint32Array(480 * cols * h * rows);
  frames.forEach((f, k) => {
    const fb = new Buf(480, 270, PAL.N0);
    s.draw(fb, f);
    const ox = (k % cols) * 480, oy = Math.floor(k / cols) * h;
    for (let y = 0; y < h; y++) for (let x = 0; x < 480; x++) out[(oy + y) * 480 * cols + ox + x] = fb.c[(y + y0) * 480 + x];
  });
  writePNG(`${outDir}/${which}-strip.png`, 480 * cols, h * rows, out, 1);
  console.log('wrote strip');
  process.exit(0);
}
for (const s of SCENES) {
  if (which !== 'all' && !which.split(',').includes(s.id)) continue;
  for (const f of frames) {
    const fb = new Buf(480, 270, PAL.N0);
    const t0 = Date.now();
    s.draw(fb, f);
    const stray = strayColors(fb);
    const name = frames.length > 1 ? `${s.id}-f${f}` : s.id;
    writePNG(`${outDir}/${name}.png`, 480, 270, fb.c, scale);
    console.log('wrote', name, `${Date.now() - t0}ms`, stray.size ? `STRAY ${[...stray.keys()].map((c) => c.toString(16)).join(',')}` : '');
  }
}
