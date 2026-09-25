// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast pixel-exact previews of the act-4 insert + expression views (no Remotion; identical pixels):
//   npx esbuild src/episodes/ep01/act4/inserts/tools/lab.ts --bundle --platform=node --outfile=<scratch>/ins.cjs
//   node <scratch>/ins.cjs <outDir> <scale> <view> [<view> ...]      (view ids: see sheet.ts; 'list' prints them)
import {writePNG} from '../../../../../dev/pixeladv/tools/png';
import {renderView, VIEWS} from '../sheet';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
if (ids[0] === 'list') { console.log(VIEWS.join('\n')); process.exit(0); }
for (const id of ids[0] === 'all' ? VIEWS : ids) {
  const t0 = Date.now();
  const buf = renderView(id);
  const name = id.replace(/[:,@]/g, '_');
  writePNG(`${outDir}/${name}.png`, buf.w, buf.h, buf.c, scale);
  console.log('wrote', name, buf.w, buf.h, `${Date.now() - t0}ms`);
}
