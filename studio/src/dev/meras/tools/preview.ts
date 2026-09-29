// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of the meras span (pixels exact; this span uses no glyph layers).
//   npx esbuild src/dev/meras/tools/preview.ts --bundle --platform=node --outfile=<scratch>/mp.js \
//     --loader:.woff=empty --loader:.woff2=empty --loader:.css=empty --external:remotion --external:react
//   NODE_PATH=node_modules node <scratch>/mp.js <outDir> <scale> <globalFrame> [...] | sheet:<f,f,..> | crop:<f>:<x>,<y>,<w>,<h>
import {writePNG} from '../../../shared/pixel/png';
import {composeFrame} from '../../../shared/pixel/compose';
import {merasScene} from '../scene';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const frameC = (g) => {
  const {fb, ui} = composeFrame(merasScene, g - 120);
  const c = fb.c.slice();
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  return c;
};
for (const id of ids) {
  if (id.startsWith('sheet:')) {
    const fs = id.slice(6).split(',').map(Number);
    const cols = Math.min(4, fs.length), rows = Math.ceil(fs.length / cols);
    const W = 480 * cols + 4 * (cols - 1), H = 270 * rows + 4 * (rows - 1);
    const out = new Uint32Array(W * H).fill(0x303030);
    fs.forEach((g, k) => {
      const c = frameC(g);
      const ox = (k % cols) * 484, oy = Math.floor(k / cols) * 274;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * W + ox + x] = c[y * 480 + x];
    });
    writePNG(`${outDir}/sheet_${fs[0]}-${fs[fs.length - 1]}.png`, W, H, out, scale);
    console.log('sheet', fs.join(','));
  } else if (id.startsWith('crop:')) {
    const [, gS, r] = id.split(':');
    const [x, y, w, h] = r.split(',').map(Number);
    const c = frameC(Number(gS));
    const out = new Uint32Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out[j * w + i] = c[(y + j) * 480 + x + i];
    writePNG(`${outDir}/crop_${gS}.png`, w, h, out, scale);
    console.log('crop', gS);
  } else {
    const g = Number(id);
    writePNG(`${outDir}/f${g}.png`, 480, 270, frameC(g), scale);
    console.log('frame', g);
  }
}
