// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of the rooms-A plates (pixel-exact: these rooms use no glyph layers).
//   npx esbuild src/episodes/ep01/act4/rooms-a/tools/preview.ts --bundle --platform=node --outfile=<scratch>/ra.js
//   node <scratch>/ra.js <outDir> <scale> <id> [<id> ...]     (ids: see PLATES in ../plates.ts; 'all')
import {writePNG} from '../../../../../dev/pixeladv/tools/png';
import {PLATES} from '../plates';
import {Buf} from '../../../../../shared/pixel/px';
import {strayColors} from '../../../../../shared/pixel/palettes';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const want = ids.includes('all') ? PLATES.map((p) => p.id) : ids;
for (const id of want) {
  const p = PLATES.find((q) => q.id === id || q.id === id.split('@')[0]);
  if (!p) { console.log('no plate', id); continue; }
  const f = id.includes('@') ? Number(id.split('@')[1]) : p.frame ?? 0;
  const b = new Buf(480, 270, 0);
  const t0 = Date.now();
  p.draw(b, f);
  const stray = strayColors(b);
  writePNG(`${outDir}/${id.replace('@', '-f')}.png`, 480, 270, b.c, scale);
  console.log('wrote', id, `${Date.now() - t0}ms`, stray.size ? `STRAY ${stray.size}: ${[...stray.keys()].slice(0, 6).map((c) => c.toString(16)).join(',')}` : 'palette ok');
}
