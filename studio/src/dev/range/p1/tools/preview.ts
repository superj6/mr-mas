// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of P1's PIXEL frames (pixels exact; glyph tokens approximated as tinted cells).
//   npx esbuild src/dev/range/p1/tools/preview.ts --bundle --platform=node --outfile=<scratch>/p1pre.js
//   node <scratch>/p1pre.js <outDir> <scale> <frame> [<frame> ...]
import {writePNG} from '../../../pixeladv/tools/png';
import {composeFrame} from '../../../../shared/pixel/compose';
import {PIXEL_SCENE} from '../pixel/scene';

const [outDir, scaleS, ...fs] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const s of fs) {
  const f = Number(s);
  const {fb, layers, ui} = composeFrame(PIXEL_SCENE, f);
  const c = new Uint32Array(fb.c);
  for (const l of layers) {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2)
      for (let j = 0; j < ch; j++) for (let k = 0; k < cw; k++) { const x = l.fills[i] + k, y = l.fills[i + 1] + j; if (x >= 0 && y >= 0 && x < fb.w && y < fb.h) c[y * fb.w + x] = l.style.bg ?? 0x04050a; }
    for (const t of l.tokens) {
      const a = t.a * (0.35 + 0.65 * t.v);
      for (let j = 1; j < ch; j++) for (let k = 0; k < cw - 1; k++) {
        const x = Math.round(t.x) + k, y = Math.round(t.y) + j;
        if (x < 0 || y < 0 || x >= fb.w || y >= fb.h) continue;
        const o = c[y * fb.w + x];
        const mix = (sh) => Math.round(((o >> sh) & 255) * (1 - a) + ((t.col >> sh) & 255) * a);
        c[y * fb.w + x] = (mix(16) << 16) | (mix(8) << 8) | mix(0);
      }
    }
  }
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  writePNG(`${outDir}/px-${String(f).padStart(3, '0')}.png`, fb.w, fb.h, c, scale);
}
