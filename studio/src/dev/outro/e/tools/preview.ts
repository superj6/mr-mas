// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview for outro E (exact pixels; this scene has no glyph layers, so it matches the Remotion render).
//   npx esbuild src/dev/outro/e/tools/preview.ts --bundle --platform=node --outfile=<scratch>/oe.js
//   node <scratch>/oe.js <outDir> <scale> m:<m> | o:<o> | p:<o> (plain week) | ep:<1|3|10> | end | strip:<m,m,..> | verify
// `verify` prints the text checks: every glyph present, the terms line's width, the terms and pointer pixels
// identical on every frame o0-o195 (never moved, never covered), the landed moth clear of every glyph, each line's
// read time vs its time on screen, and (polish pass 2) the ending: the last frame anything moves, the length of the
// still hold, and that nothing but the terms line (and the moth) is on the desktop after the close.
import {writePNG} from '../../../pixeladv/tools/png';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {drawMockup, drawVariant, drawEndState} from '../scene';
import {PRE, OUTRO, EV} from '../timeline';
import {text as sharedText} from '../../../../shared/pixel/font';
import {strW} from '../text';
import {TERMS, POINTER_LINE, TERMS_X, TERMS_Y, POINTER_X, POINTER_Y, EP1_LINES, EP1_TITLE, PERIOD} from '../window';
import {EP3_INFO, EP3_TITLE, EP10_KEYS, EP10_VALS, EP10_TITLE} from '../variants';
import {MOTH_BOX} from '../moth';

const LOCAL_CH = new Set(['#', '|', '[', ']', '<', '&', '@']);
const verify = () => {
  // 1. glyph coverage: a glyph the shared face lacks draws nothing and silently leaves a 4-px gap
  const strings = [TERMS, POINTER_LINE, EP1_TITLE, EP3_TITLE, EP10_TITLE, 'LEGAL TEXT: DRAFT', "STAND-IN: THE EPISODE'S LAST FRAME",
    ...EP1_LINES.map((l) => l.segs.map((q) => q[0]).join('')), ...EP3_INFO.flatMap(([k, v]) => [k, v]), ...EP10_KEYS, ...EP10_VALS,
    '# ep1.9_pace.yaml', 'pace: agreed    # unit: steps', 'credits:', 'info'];
  const missing = new Set();
  for (const str of strings) for (const ch of str) {
    if (ch === ' ' || LOCAL_CH.has(ch)) continue;
    const b = new Buf(16, 12, 0); sharedText(b, ch, 1, 1, 0xffffff);
    if (!b.c.some((v) => v === 0xffffff)) missing.add(ch);
  }
  console.log('missing glyphs:', missing.size ? [...missing].join(' ') : 'none');
  console.log('terms width px:', strW(TERMS), ' pointer width px:', strW(POINTER_LINE), ' terms x:', TERMS_X, ' period at', PERIOD);
  // 2. the terms + pointer rows: identical pixels on every frame of the outro (and Ep1's moth)
  const box = {x0: Math.min(TERMS_X, POINTER_X) - 1, x1: TERMS_X + strW(TERMS) + 1, y0: TERMS_Y - 1, y1: POINTER_Y + 9};
  const ref = new Buf(480, 270, PAL.N0); drawMockup(ref, PRE + EV.desktop + 1, {...O, sting: false});
  const textPx = [];
  for (let y = box.y0; y <= box.y1; y++) for (let x = box.x0; x <= box.x1; x++) if (ref.c[y * 480 + x] === PAL.P1) textPx.push(y * 480 + x);
  for (const sting of [true, false]) {
    const last = sting ? EV.end : OUTRO - 1;
    let bad = 0, firstBad = -1;
    for (let o = 0; o <= last; o++) {
      const b = new Buf(480, 270, PAL.N0); drawMockup(b, PRE + o, {...O, sting});
      const diff = textPx.filter((i) => b.c[i] !== PAL.P1).length;
      if (diff) { bad++; if (firstBad < 0) firstBad = o; }
    }
    console.log(`${sting ? 'Ep1 (moth)' : 'plain week'}: terms/pointer text pixels ${textPx.length}, frames o0-o${last} with any text pixel changed: ${bad}${firstBad >= 0 ? ' (first o' + firstBad + ')' : ''}`);
  }
  const pb = new Buf(480, 270, PAL.N0); drawMockup(pb, PRE + EV.end, O);
  console.log('period pixel visible at the end (moth landed):', pb.c[PERIOD[1] * 480 + PERIOD[0]] === PAL.P1);
  // the landed moth's own pixels (the Ep1 end frame minus the plain one) vs every terms/pointer text pixel
  const nb = new Buf(480, 270, PAL.N0); drawMockup(nb, PRE + EV.end, {...O, sting: false});
  const mothPx = [];
  for (let i = 0; i < 480 * 270; i++) if (pb.c[i] !== nb.c[i]) mothPx.push(i);
  let gap = 1e9;
  for (const i of textPx) for (const j of mothPx) {
    const d = Math.max(Math.abs((i % 480) - (j % 480)), Math.abs(Math.floor(i / 480) - Math.floor(j / 480)));
    if (d < gap) gap = d;
  }
  console.log('landed moth box', MOTH_BOX, `(${MOTH_BOX.x1 - MOTH_BOX.x0 + 1}x${MOTH_BOX.y1 - MOTH_BOX.y0 + 1} px, ${mothPx.length} px drawn); nearest text pixel ${gap} px away (1 = touching)`);
  // 3. read time at 16 and 20 characters a second vs time on screen, and vs the time before the pointer moves
  const win = EV.click / 24, calm = EV.pointer[0] / 24;
  const rows = [
    ['window title', EP1_TITLE, win, calm],
    ...EP1_LINES.filter((l) => l.segs.length).map((l) => ['file ' + l.n, l.segs.map((q) => q[0]).join(''), win, calm]),
  ];
  let block = 0;
  for (const [k, sx, t, c] of rows) {
    const n = sx.length;
    if (String(k).startsWith('file 21') && Number(String(k).slice(5)) >= 2109 && Number(String(k).slice(5)) <= 2114) block += n;
    console.log(`${String(k).padEnd(13)} ${String(n).padStart(3)} ch  16cps ${(n / 16).toFixed(2)} s  on screen ${t.toFixed(2)} s, lit before the pointer ${c.toFixed(2)} s  ${n / 16 <= c ? 'ok' : 'SHORT'}  | ${sx}`);
  }
  console.log(`credits block (lines 2109-2114): ${block} ch -> ${(block / 16).toFixed(1)} s at 16 cps, ${(block / 20).toFixed(1)} s at 20 cps; ` +
    `on screen ${win.toFixed(2)} s, whole from the cut, ${calm.toFixed(2)} s before the pointer moves`);
  const tp = TERMS.length + POINTER_LINE.length;
  for (const [k, sx] of [['terms', TERMS], ['pointer', POINTER_LINE], ['terms+pointer', TERMS + POINTER_LINE]])
    console.log(`${k.padEnd(14)} ${String(sx.length).padStart(3)} ch -> ${(sx.length / 16).toFixed(2)} s at 16 cps; on screen ${(OUTRO / 24).toFixed(2)} s (plain week), ${((EV.end + 1) / 24).toFixed(2)} s (Ep1)`);
  // 4. the ending (polish pass 2): the last frame on which ANY pixel changes, and the still hold after it
  for (const sting of [true, false]) {
    const last = sting ? EV.end : OUTRO - 1;
    let prev = null, lastChange = -1;
    for (let o = 0; o <= last; o++) {
      const b = new Buf(480, 270, PAL.N0); drawMockup(b, PRE + o, {...O, sting});
      if (prev && b.c.some((v, i) => v !== prev[i])) lastChange = o;
      prev = b.c;
    }
    const still = last - lastChange + 1;
    console.log(`${sting ? 'Ep1 (moth)' : 'plain week'}: last change on o${lastChange}; still o${lastChange}-o${last} = ${still} frames = ${(still / 24).toFixed(2)} s`);
  }
  // 5. after the close: nothing on the desktop but the terms/pointer text (and, in Ep1, the moth)
  const pw = new Buf(480, 270, PAL.N0); drawMockup(pw, PRE + OUTRO - 1, {...O, sting: false});
  const tset = new Set(textPx);
  let stray = 0;
  for (let y = 12; y < 270; y++) for (let x = 0; x < 480; x++) { const i = y * 480 + x; if (pw.c[i] !== PAL.N0 && !tset.has(i)) stray++; }
  console.log('plain week o179: non-black pixels outside the terms/pointer text (slug row excluded):', stray);
};

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const O = {slug: true};
const frame = (m) => { const b = new Buf(480, 270, PAL.N0); drawMockup(b, m, O); return b.c; };

for (const id of ids) {
  const [kind, a] = id.split(':');
  const name = id.replace(/[:,]/g, '_').slice(0, 60);
  if (kind === 'm') writePNG(`${outDir}/${name}.png`, 480, 270, frame(Number(a)), scale);
  else if (kind === 'o') writePNG(`${outDir}/${name}.png`, 480, 270, frame(Number(a) + PRE), scale);
  else if (kind === 'p') { const b = new Buf(480, 270, PAL.N0); drawMockup(b, Number(a) + PRE, {...O, sting: false}); writePNG(`${outDir}/${name}.png`, 480, 270, b.c, scale); }
  else if (kind === 'ep') { const b = new Buf(480, 270, PAL.N0); drawVariant(b, Number(a), O); writePNG(`${outDir}/${name}.png`, 480, 270, b.c, scale); }
  else if (kind === 'verify') verify();
  else if (kind === 'end') { const b = new Buf(480, 270, PAL.N0); drawEndState(b, O); writePNG(`${outDir}/${name}.png`, 480, 270, b.c, scale); }
  else if (kind === 'strip') {
    const fr = a.split(',').map(Number);
    const cols = 4, rows = Math.ceil(fr.length / cols);
    const Wd = 480 * cols, Ht = 270 * rows;
    const out = new Uint32Array(Wd * Ht);
    fr.forEach((m, k) => {
      const c = frame(m);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * Wd + ox + x] = c[y * 480 + x];
    });
    writePNG(`${outDir}/${name}.png`, Wd, Ht, out, scale);
  }
  console.log('wrote', name);
}
