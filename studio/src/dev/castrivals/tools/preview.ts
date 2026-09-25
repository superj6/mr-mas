// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// castrivals preview: node <bundle>.js <outDir> <scale> <view[:frame]> ...
//   views: bosslab | sheet:<f> | any id known to renderView()
import {writePNG} from './png';
import {bossLab, noleLab, marioLab} from '../lab';
import {renderView} from '../sheet';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const id of ids) {
  const [name, fs, crop] = id.split('@');
  let buf;
  if (name === 'grid') {
    // grid@f0,f1,...: motion frames at 1x in a 3-column contact sheet
    const fr = fs.split(',').map(Number), cols = 3;
    const rows = Math.ceil(fr.length / cols);
    const c = new Uint32Array(480 * cols * 270 * rows);
    fr.forEach((n, k) => {
      const b = renderView('sheet', n);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * 480 * cols + ox + x] = b.c[y * 480 + x];
    });
    writePNG(`${outDir}/grid.png`, 480 * cols, 270 * rows, c, scale);
    console.log('wrote grid');
    continue;
  }
  if (name === 'bosslab') buf = bossLab();
  else if (name === 'nolelab') buf = noleLab();
  else if (name === 'mariolab') buf = marioLab();
  else buf = renderView(name, Number(fs ?? 0));
  if (crop) {
    const [x0, y0, w, h] = crop.split(',').map(Number);
    const c = new Uint32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c[y * w + x] = buf.c[(y0 + y) * buf.w + x0 + x];
    writePNG(`${outDir}/${name}${fs ? '-' + fs : ''}-crop.png`, w, h, c, scale);
  } else writePNG(`${outDir}/${name}${fs ? '-' + fs : ''}.png`, buf.w, buf.h, buf.c, scale);
  console.log('wrote', id);
}
