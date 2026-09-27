// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of E1-P1's PIXEL frames (exact pixels; the clay is not composited here).
//   npx esbuild src/dev/range/ep1-p1/tools/preview.ts --bundle --platform=node --outfile=<scratch>/pre.cjs
//   node <scratch>/pre.cjs <outDir> <scale> <takes.json|-> <gen dir|-> <frame> [<frame> ...]
import * as fs from 'fs';
import {writePNG} from '../../../pixeladv/tools/png';
import {Buf} from '../../../../shared/pixel/px';
import {drawFrame, setMouthTrack, setClodPixel} from '../pixel';
import {clayAt} from '../gl/cels';
import {loadClodPixel} from '../clodpx';

const [outDir, scaleS, takes, gen, ...fs2] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
if (takes && takes !== '-') { const t = JSON.parse(fs.readFileSync(takes, 'utf8')); setMouthTrack(t['mario-memo'].mouth, t['mario-addendum'].mouth); }
if (gen && gen !== '-' && fs.existsSync(`${gen}/clod-px.json`)) setClodPixel(loadClodPixel(JSON.parse(fs.readFileSync(`${gen}/clod-px.json`, 'utf8'))));
for (const s of fs2) {
  const f = Number(s);
  const fb = new Buf(480, 270);
  drawFrame(fb, f, clayAt(f));
  writePNG(`${outDir}/px-${String(f).padStart(3, '0')}.png`, fb.w, fb.h, fb.c, scale);
}
