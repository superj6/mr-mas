// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast pixel-exact previews of the act-4 cast views (no Remotion):
//   npx esbuild src/episodes/ep01/act4/cast/tools/lab.ts --bundle --platform=node --outfile=<scratch>/lab.cjs
//   node <scratch>/lab.cjs <outDir> <scale> <view> [<view> ...]
import {writePNG} from '../../../../../dev/pixeladv/tools/png';
import {renderView} from '../sheet';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const id of ids) {
  const buf = renderView(id);
  const name = id.replace(/[:,]/g, '_');
  writePNG(`${outDir}/${name}.png`, buf.w, buf.h, buf.c, scale);
  console.log('wrote', name, buf.w, buf.h);
}
