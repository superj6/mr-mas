// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of the pixelengine demos (pixels exact; glyph tokens approximated as tinted cells —
// real glyphs only exist in the Remotion render).
//   npx esbuild src/dev/pixelengine/tools/preview.ts --bundle --platform=node --outfile=/tmp/pe.js
//   node /tmp/pe.js <outDir> <scale> panel:<id> | dissolve:<f,f,..> | front:<f,f,..>
import {writePNG} from '../../../shared/pixel/png';
import {composeFrame} from '../../../shared/pixel/compose';
import {PANELS, dissolveScene, frontScene} from '../scenes';
import {drawCathedral} from '../art';
import {Buf} from '../../../shared/pixel/px';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;

const render = (scene, f) => {
  const {fb, layers, ui} = composeFrame(scene, f);
  const c = fb.c.slice();
  const lateUI = () => { if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i]; };
  for (const l of layers) {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2)
      for (let j = 0; j < ch; j++) for (let k = 0; k < cw; k++) { const x = l.fills[i] + k, y = l.fills[i + 1] + j; if (x >= 0 && y >= 0 && x < fb.w && y < fb.h) c[y * fb.w + x] = l.style.bg ?? 0x04050a; }
    for (const t of l.tokens) {
      const a = t.a * (0.35 + 0.65 * t.v);
      for (let j = 1; j < ch; j++) for (let k = 0; k < cw - 1; k++) {
        const x = t.x + k, y = t.y + j;
        if (x < 0 || y < 0 || x >= fb.w || y >= fb.h) continue;
        const o = c[y * fb.w + x];
        const mix = (s) => Math.round(((o >> s) & 255) * (1 - a) + ((t.col >> s) & 255) * a);
        c[y * fb.w + x] = (mix(16) << 16) | (mix(8) << 8) | mix(0);
      }
    }
  }
  lateUI();
  return c;
};
const grid = (name, scene, frames) => {
  const cols = 4, rows = Math.ceil(frames.length / cols);
  const W = 480 * cols, H = 270 * rows;
  const c = new Uint32Array(W * H);
  frames.forEach((f, k) => {
    const b = render(scene, f);
    const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * W + ox + x] = b[y * 480 + x];
  });
  writePNG(`${outDir}/${name}.png`, W, H, c, 1);
};
for (const id of ids) {
  const [kind, arg] = id.split(':');
  if (kind === 'panel') {
    const p = PANELS.find((q) => q.id === arg);
    writePNG(`${outDir}/panel-${arg}.png`, 480, 270, render(p.scene, 0), scale);
  } else if (kind === 'cathedral') { const b = new Buf(480, 270, 0); drawCathedral(b, Number(arg) || 0); writePNG(`${outDir}/cathedral.png`, 480, 270, b.c, scale); }
  else if (kind === 'dissolve') grid('dissolve', dissolveScene, arg.split(',').map(Number));
  else if (kind === 'front') grid('front', frontScene, arg.split(',').map(Number));
  else if (kind === 'dframe') writePNG(`${outDir}/dissolve-${arg}.png`, 480, 270, render(dissolveScene, Number(arg)), scale);
  else if (kind === 'fframe') writePNG(`${outDir}/front-${arg}.png`, 480, 270, render(frontScene, Number(arg)), scale);
  console.log('wrote', id);
}
