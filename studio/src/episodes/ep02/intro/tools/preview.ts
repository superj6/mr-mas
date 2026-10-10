// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep2's intro, fast Node preview (pixels exact; GLYPH tokens drawn as tinted cells, deterministic) and the
// native-frame hashes the slot's proof compares. Every global intro frame through the EDL, from the moments built for
// an episode's slot (src/intro/scenes.ts scenesFor).
//   (cd studio && node_modules/.bin/esbuild src/episodes/ep02/intro/tools/preview.ts --bundle --platform=node \
//      --outfile=<scratch>/ip.js --log-level=warning)
//   node <scratch>/ip.js <outDir> <scale> <ep1|ep2> frame:<g> | strip:<g,g,..> | hash:<g0>-<g1>
//     frame  one PNG at <scale> (4 = 1920x1080, the full-size look)
//     strip  4 frames a row at <scale>
//     hash   one md5 per native frame (picture + UI + GLYPH tokens), as JSON on stdout
import * as crypto from 'crypto';
import {writePNG} from '../../../../shared/pixel/png';
import {composeFrame} from '../../../../shared/pixel/compose';
import {EDL, editAt} from '../../../../intro/edl';
import {scenesFor} from '../../../../intro/scenes';
import {EP1_SLOT} from '../../../../intro/slot';
import {EP2_SLOT} from '../slot';

const [outDir, scaleS, which, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 4;
const SC = scenesFor(which === 'ep1' ? EP1_SLOT : EP2_SLOT);

const paintLayers = (c, w, h, layers) => {
  for (const l of layers) {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2)
      for (let j = 0; j < ch; j++) for (let k = 0; k < cw; k++) { const x = l.fills[i] + k, y = l.fills[i + 1] + j; if (x >= 0 && y >= 0 && x < w && y < h) c[y * w + x] = l.style.bg ?? 0x04050a; }
    for (const t of l.tokens) {
      const a = Math.min(1, t.a * (0.35 + 0.65 * t.v));
      for (let j = 1; j < ch; j++) for (let k = 0; k < cw - 1; k++) {
        const x = t.x + k, y = t.y + j;
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const o = c[y * w + x];
        const mix = (s) => Math.round(((o >> s) & 255) * (1 - a) + ((t.col >> s) & 255) * a);
        c[y * w + x] = (mix(16) << 16) | (mix(8) << 8) | mix(0);
      }
    }
  }
};

/** the native frame at global intro frame g (the edit that owns it, on its moment's own clock) */
export const renderGlobal = (g) => {
  const e = editAt(g);
  const {fb, layers, ui, uiLayers} = composeFrame(SC[e.id], g - e.origin);
  const c = fb.c.slice();
  paintLayers(c, fb.w, fb.h, layers);
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  paintLayers(c, fb.w, fb.h, uiLayers);
  return c;
};

void EDL;
for (const id of ids) {
  const [kind, a] = id.split(':');
  if (kind === 'frame') writePNG(`${outDir}/${which}-f${a.padStart(3, '0')}.png`, 480, 270, renderGlobal(Number(a)), scale);
  else if (kind === 'strip') {
    const fr = a.split(',').map(Number);
    const cols = 4, rows = Math.ceil(fr.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const out = new Uint32Array(W * H);
    fr.forEach((f, k) => {
      const c = renderGlobal(f);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * W + ox + x] = c[y * 480 + x];
    });
    writePNG(`${outDir}/${which}-strip-${fr[0]}-${fr[fr.length - 1]}.png`, W, H, out, scale);
  } else if (kind === 'hash') {
    const [g0, g1] = a.split('-').map(Number);
    const out = {};
    for (let g = g0; g <= g1; g++) out[g] = crypto.createHash('md5').update(Buffer.from(renderGlobal(g).buffer)).digest('hex');
    console.log(JSON.stringify(out));
  }
}
