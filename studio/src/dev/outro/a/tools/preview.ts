// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview for outro A (pixels exact: this scene has no glyph layers). Frames are OUTRO frames (o).
//   npx esbuild src/dev/outro/a/tools/preview.ts --bundle --platform=node --outfile=<scratch>/oa.js
//   node <scratch>/oa.js <outDir> <scale> o:<o> | strip:<o,o,..> | var:<ep1|ep6|ep10|ep10-keys> | layout
// `layout` writes <outDir>/layout.json: the timeline, the typing schedule, every text box and the moth's path,
// straight from the scene's own modules, so tools/build.py (mix cues, QA boxes, sheets) never mirrors them by hand.
import {writeFileSync} from 'fs';
import {writePNG} from '../../../pixeladv/tools/png';
import {composeFrame} from '../../../../shared/pixel/compose';
import {outroScene} from '../scene';
import {variantScene} from '../skins';
import {PRE, OUT, O, TERMS_ON, KEY_STILLS, STRIP, READ_CPS, typingSchedule} from '../timeline';
import {EP1, TERMS, POINTER, LEGAL_ROWS} from '../text';
import {textBoxes} from '../pane';
import {mothPos} from '../moth';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const SCENE = outroScene();

const flat = (scene, f) => {
  const {fb, ui} = composeFrame(scene, f);
  const c = fb.c.slice();
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  return c;
};

for (const id of ids) {
  const [kind, a] = id.split(':');
  const name = id.replace(/[:,]/g, '_');
  if (kind === 'o') writePNG(`${outDir}/o${a}.png`, 480, 270, flat(SCENE, PRE + Number(a)), scale);
  else if (kind === 'var') writePNG(`${outDir}/var-${a}.png`, 480, 270, flat(variantScene(a), 0), scale);
  else if (kind === 'layout') {
    const moth = [];
    for (let o = O.mothIn; o <= O.end; o++) { const p = mothPos(o); if (p) moth.push([o, p[0], p[1]]); }
    writeFileSync(`${outDir}/layout.json`, JSON.stringify({
      PRE, OUT, O, TERMS_ON, KEY_STILLS, STRIP, READ_CPS,
      title: EP1.title, header: EP1.header, date: EP1.date, credits: EP1.credits, terms: TERMS, pointer: POINTER,
      legal: LEGAL_ROWS,
      typing: typingSchedule(EP1.credits), boxes: textBoxes(EP1), moth,
    }, null, 1));
  } else if (kind === 'strip') {
    const fr = a.split(',').map(Number);
    const cols = 4, rows = Math.ceil(fr.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const out = new Uint32Array(W * H);
    fr.forEach((o, k) => {
      const c = flat(SCENE, PRE + o);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * W + ox + x] = c[y * 480 + x];
    });
    writePNG(`${outDir}/${name.slice(0, 40)}.png`, W, H, out, 1);
  }
  console.log('wrote', name);
}
