// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of mdinner1 (pixels exact; glyph tokens approximated as tinted cells).
//   npx esbuild src/dev/mdinner1/tools/preview.ts --bundle --platform=node --outfile=<scratch>/md1.cjs
//   node <scratch>/md1.cjs <outDir> <scale> f:<global> | grid:<g,g,g,..> | world:<x,y,w,h>
import {writePNG} from '../../../shared/pixel/png';
import {composeFrame} from '../../../shared/pixel/compose';
import {SCENE} from '../scene';
import {toLocal} from '../timeline';
import {debugWorld, _tuneFreeze, _tunePrint} from '../scene';
import {labMas} from '../lab';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;

const render = (g) => {
  const {fb, layers, ui, uiLayers} = composeFrame(SCENE, toLocal(g));
  const c = fb.c.slice();
  const drawLayers = (ls) => {
    for (const l of ls) {
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
  };
  drawLayers(layers);
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  drawLayers(uiLayers);
  return c;
};

for (const id of ids) {
  const [kind, arg] = id.split(':');
  if (kind === 'f') writePNG(`${outDir}/f${arg}.png`, 480, 270, render(Number(arg)), scale);
  else if (kind === 'grid') {
    const fs = arg.split(',').map(Number);
    const cols = Math.min(4, fs.length), rows = Math.ceil(fs.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const c = new Uint32Array(W * H);
    fs.forEach((g, k) => {
      const b = render(g);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * W + ox + x] = b[y * 480 + x];
    });
    writePNG(`${outDir}/grid-${fs[0]}-${fs[fs.length - 1]}.png`, W, H, c, scale);
  } else if (kind === 'world') {
    const [x, y, w, h, g] = arg.split(',').map(Number);
    const b = debugWorld(x, y, w, h, g ?? 239);
    writePNG(`${outDir}/world-${x}.png`, w, h, b.c, scale);
  }
  else if (kind === 'tune') {
    // tune:<g>:lo,hi,gamma;lo,hi,gamma;...
    const [gs, ...curves] = arg.split('@');
    const g = Number(gs);
    const cs = curves.map((c) => c.split(',').map(Number));
    const cols = Math.min(3, cs.length), rows = Math.ceil(cs.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const out = new Uint32Array(W * H);
    cs.forEach(([lo, hi, gamma, slo, shi, sg], k) => {
      _tuneFreeze({lo, hi, gamma}, slo !== undefined ? {lo: slo, hi: shi, gamma: sg} : undefined);
      const b = render(g);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * W + ox + x] = b[y * 480 + x];
    });
    writePNG(`${outDir}/tune-${g}.png`, W, H, out, scale);
  }
  else if (kind === 'crop') {
    const [g, x, y, w, h] = arg.split(',').map(Number);
    const c = render(g);
    const out = new Uint32Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out[j * w + i] = c[(y + j) * 480 + x + i];
    writePNG(`${outDir}/crop-${g}-${x}.png`, w, h, out, scale);
  }
  else if (kind === 'cgrid') {
    // cgrid:x,y,w,h@g,g,g...
    const [rc, gl] = arg.split('@');
    const [x, y, w, h] = rc.split(',').map(Number);
    const fs = gl.split(',').map(Number);
    const cols = Math.min(4, fs.length), rows = Math.ceil(fs.length / cols);
    const W = (w + 2) * cols, H = (h + 2) * rows;
    const out = new Uint32Array(W * H);
    fs.forEach((g, k) => {
      const c = render(g);
      const ox = (k % cols) * (w + 2), oy = Math.floor(k / cols) * (h + 2);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out[(oy + j) * W + ox + i] = c[(y + j) * 480 + x + i];
    });
    writePNG(`${outDir}/cgrid-${fs[0]}.png`, W, H, out, scale);
  }
  else if (kind === 'ptune') {
    // ptune:<g>@room lo,hi;solid lo,hi;star lo,hi@...   (gamma 1) -> one frame per variant, side by side
    const [gs, ...vars] = arg.split('@');
    const g = Number(gs);
    const W = 480 * vars.length, H = 270;
    const out = new Uint32Array(W * H);
    vars.forEach((v, k) => {
      const [r, so, st] = v.split(';').map((q) => q.split(',').map(Number));
      _tunePrint({room: {lo: r[0], hi: r[1], gamma: 1}, ...(so ? {figure: {lo: so[0], hi: so[1], gamma: 1}} : {}), ...(st ? {star: {lo: st[0], hi: st[1], gamma: 1}} : {})});
      const b = render(g);
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[y * W + k * 480 + x] = b[y * 480 + x];
    });
    _tunePrint({});
    writePNG(`${outDir}/ptune-${g}.png`, W, H, out, scale);
  }
  else if (kind === 'lab') { const b = labMas(); writePNG(`${outDir}/lab-${arg}.png`, b.w, b.h, b.c, scale); }
  console.log('wrote', id);
}
