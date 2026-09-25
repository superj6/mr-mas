// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast pixel-exact previews of the act-4 MEDIUM tier (no Remotion). Owned by the act-4 medium-tier artist.
//   npx esbuild src/episodes/ep01/act4/medium/tools/lab.ts --bundle --platform=node --outfile=<scratch>/med.cjs
//   node <scratch>/med.cjs <outDir> <scale> <view> [<view> ...]
// Views are sheet.ts ids (see renderView); 'zoom:<k>:<x>:<y>:<w>:<h>:<view>' crops a native region and blows it up
// k x nearest-neighbour (dev inspection only).
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
