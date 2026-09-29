// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
//   node <bundle>.js <outDir> <scale> <view> [...]      view = sheet | motion:<f> | wip:<name> | strip:<f0,f1,..>
import {writePNG} from '../../../shared/pixel/png';
import {renderView} from '../sheet';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const id of ids) {
  const buf = renderView(id);
  const name = id.replace(/[:,]/g, '_');
  writePNG(`${outDir}/${name}.png`, buf.w, buf.h, buf.c, scale);
  console.log('wrote', name, buf.w, buf.h);
}
