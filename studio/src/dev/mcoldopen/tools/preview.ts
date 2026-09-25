// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview for mcoldopen (pixels exact; glyph tokens approximated as tinted cells).
//   npx esbuild src/dev/mcoldopen/tools/preview.ts --bundle --platform=node --outfile=<scratch>/mco.js
//   node <scratch>/mco.js <outDir> <scale> screen:<f> | macro:<P>:<f> | frame:<f> | strip:<f,f,..> | world:<f>
import {writePNG} from '../../pixeladv/tools/png';
import {Buf} from '../../../shared/pixel/px';
import {composeFrame} from '../../../shared/pixel/compose';
import {screenAt} from '../screen';
import {drawMacro} from '../macro';
import {coldOpen} from '../scene';
import {drawCathedral} from '../cathedral';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;

export const renderFrame = (f) => {
  const {fb, layers, ui, uiLayers} = composeFrame(coldOpen, f);
  const c = fb.c.slice();
  const paintLayer = (l) => {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2)
      for (let j = 0; j < ch; j++) for (let k = 0; k < cw; k++) { const x = l.fills[i] + k, y = l.fills[i + 1] + j; if (x >= 0 && y >= 0 && x < fb.w && y < fb.h) c[y * fb.w + x] = l.style.bg ?? 0x04050a; }
    for (const t of l.tokens) {
      const a = Math.min(1, t.a * (0.35 + 0.65 * t.v));
      for (let j = 1; j < ch; j++) for (let k = 0; k < cw - 1; k++) {
        const x = t.x + k, y = t.y + j;
        if (x < 0 || y < 0 || x >= fb.w || y >= fb.h) continue;
        const o = c[y * fb.w + x];
        const mix = (s) => Math.round(((o >> s) & 255) * (1 - a) + ((t.col >> s) & 255) * a);
        c[y * fb.w + x] = (mix(16) << 16) | (mix(8) << 8) | mix(0);
      }
    }
  };
  layers.forEach(paintLayer);
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  uiLayers.forEach(paintLayer);
  return c;
};

for (const id of ids) {
  const [kind, a, b] = id.split(':');
  const name = id.replace(/[:,]/g, '_');
  if (kind === 'screen') { const s = screenAt(Number(a)); writePNG(`${outDir}/${name}.png`, s.w, s.h, s.c, scale); }
  else if (kind === 'macro') {
    const s = screenAt(Number(b));
    const fb = new Buf(480, 270, 0);
    drawMacro(fb, s, Number(a), {focus: [32, 16], anchor: [296, 118]});
    writePNG(`${outDir}/${name}.png`, 480, 270, fb.c, scale);
  } else if (kind === 'frame') writePNG(`${outDir}/${name}.png`, 480, 270, renderFrame(Number(a)), scale);
  else if (kind === 'world') { const w = new Buf(480, 270, 0); drawCathedral(w, Number(a)); writePNG(`${outDir}/${name}.png`, 480, 270, w.c, scale); }
  else if (kind === 'strip') {
    const fr = a.split(',').map(Number);
    const cols = 4, rows = Math.ceil(fr.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const out = new Uint32Array(W * H);
    fr.forEach((f, k) => {
      const c = renderFrame(f);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * W + ox + x] = c[y * 480 + x];
    });
    writePNG(`${outDir}/${name.slice(0, 40)}.png`, W, H, out, 1);
  }
  console.log('wrote', name);
}
