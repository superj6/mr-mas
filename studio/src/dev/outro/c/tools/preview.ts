// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Outro C preview without Remotion: node preview.cjs <outDir> <scale> <item> ...
//   item = <f>        a mock-up frame (composition frame: 0..23 stand-in, 24.. = o0..)
//        = o<o>       an outro frame (o0..o239)
//        = s<k>       a variant still (0 ep1 o112, 1 ep4, 2 ep10)
//        = check      the band checks: nothing covers the terms/pointer in any outro frame before the end dip (o184 on,
//                     where the whole frame goes to black); the moth never covers or touches (4-neighbour) a letter of
//                     either line, in flight or landed; writes <outDir>/moth.json (the moth's native bounding box per
//                     outro frame, for the QA's band-stillness mask)
import {writeFileSync} from 'fs';
import {writePNG} from './png';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {drawEp1, drawStill, PRE, OUT, EV, ep1State, renderOutro} from '../timeline';
import {bandGlyphPixels, PERIOD} from '../band';
import {mothPixels} from '../moth';

const frame = (item) => {
  const fb = new Buf(480, 270, PAL.N0);
  if (item.startsWith('s')) drawStill(fb, Number(item.slice(1)));
  else if (item.startsWith('o')) drawEp1(fb, PRE + Number(item.slice(1)));
  else drawEp1(fb, Number(item));
  return fb;
};
const [outDir, scaleS, ...items] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const it of items) {
  if (it === 'check') {
    // every band glyph pixel must be exactly the band ink in every outro frame (never covered, never moved)
    const px = bandGlyphPixels();
    let bad = 0;
    const READ_END = EV.dip[0]; // the dip takes the whole frame (band included) to black: the band's read ends there
    for (let o = 0; o < READ_END; o++) {
      const fb = new Buf(480, 270, PAL.N0);
      renderOutro(fb, ep1State(o));
      for (const i of px) if (fb.c[i] !== PAL.P1) { bad++; if (bad < 10) console.log('covered at o' + o, i % 480, Math.floor(i / 480)); }
    }
    console.log(bad ? `FAIL: ${bad} band glyph pixels covered` : `OK: terms + pointer uncovered in every outro frame before the dip (o0-o${READ_END - 1}, ${READ_END} frames = ${(READ_END / 24).toFixed(2)} s)`);
    // the moth must never cover or touch a letter of the band (4-neighbour), in any frame; the period itself it may
    // stand beside (touching the dot is allowed, covering it is not)
    const g = new Set(px);
    const [PX, PY] = PERIOD;
    const pi = PY * 480 + PX;
    let touch = 0, cover = 0, bandFrames = 0;
    const boxes = {};
    for (let o = 0; o < OUT; o++) {
      const m = mothPixels(o);
      if (!m.length) continue;
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, inBand = false;
      for (const [x, y] of m) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        if (y >= 203) inBand = true;
        const i0 = y * 480 + x;
        if (g.has(i0) || i0 === pi) { cover++; if (cover < 5) console.log('covers at o' + o, x, y); }
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const i = (y + dy) * 480 + x + dx;
          if (g.has(i) && i !== pi) { touch++; if (touch < 5) console.log('touches at o' + o, x, y); }
        }
      }
      if (inBand) bandFrames++;
      boxes[o] = [x0, y0, x1, y1];
    }
    writeFileSync(`${outDir}/moth.json`, JSON.stringify(boxes));
    console.log(cover ? `FAIL: the moth covers ${cover} band glyph pixels` : 'OK: the moth never covers a letter or the period (all frames)');
    console.log(touch ? `FAIL: the moth touches ${touch} letter pixels` : `OK: the moth never touches a letter (4-neighbour), in flight (${bandFrames} frames in the band) or landed`);
    continue;
  }
  const fb = frame(it);
  writePNG(`${outDir}/${it}.png`, 480, 270, fb.c, scale);
  console.log('wrote', it);
}
