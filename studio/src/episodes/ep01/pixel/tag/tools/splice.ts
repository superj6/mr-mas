// @ts-nocheck -- Node-only tool (bundled with esbuild by tools/build.mjs --entry), excluded from the browser typecheck.
// MR. MAS — Ep1 v3.1 tag (the v3-shots-coldopen-tag pass): the Runway insert's SPLICE FRAMES. insert.py --png writes the
// insert as whole 1920 x 1080 frames (DIR/pic/NNNNN.png, numbered from the tag's frame 62). The Node renderer splices a
// browser frame's PNG as it is, so anything the host would draw on those frames has to be in the PNG: here, Mas's V.O.
// "those are stills." (v31-vo-07, typed over the insert's stills and pull-back) and the band. This draws each splice
// frame's host layer (the segment with the insert's layout swapped for a key colour: the band, the V.O. line, nothing
// else), lays it over the insert's PNG at 4x, and gives the V.O. glyphs a 1-px N0 outline so they read on the pale still
// (runway.md §6: "the pixel type needs its dark shadow on the pale still"). Frames with no host layer are copied as-is.
//   node src/episodes/ep01/pixel/tools/build.mjs --entry src/episodes/ep01/pixel/tag/tools/splice.ts $S/splice.cjs
//   node $S/splice.cjs <insert png dir> <out dir>      -> <out dir>/pic/NNNNN.png for every splice frame (GLYPH_DIR=<out dir>)
import * as fs from 'fs';
import * as path from 'path';
import {PAL} from '../../../../../shared/pixel/palette';
import {prepare, native, RH} from '../../frame';
import {defineSegment} from '../../spec';
import {readPNG, writePNG} from '../../tools/render';
import {SEGMENT, DEMO_SPLICE} from '../shots';

const KEY = 0xff00ff;
const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error('usage: splice.cjs <insert png dir> <out dir>'); process.exit(2); }
const spec = defineSegment({...SEGMENT, seg: 'tag-splice-host', layouts: {...SEGMENT.layouts, 'v31-32.01d': {st: 'splice key', draw: (fb) => { for (let i = 0; i < 480 * RH; i++) fb.c[i] = KEY; }}}});
const seg = prepare(spec);
let laid = 0, copied = 0;
const vo: number[] = [];
for (let f = DEMO_SPLICE.from; f < DEMO_SPLICE.to; f++) {
  const inFile = path.join(src, 'pic', `${String(f).padStart(5, '0')}.png`), outFile = path.join(dst, 'pic', `${String(f).padStart(5, '0')}.png`);
  if (!fs.existsSync(inFile)) { console.error(`missing ${inFile}`); process.exit(1); }
  const n = native(seg, f).fb;
  let any = false;
  for (let i = 0; i < 480 * RH; i++) if (n.c[i] !== KEY) { any = true; break; }
  const pic = readPNG(inFile);
  if (pic.w !== 1920 || pic.h !== 1080) { console.error(`${inFile}: ${pic.w}x${pic.h}`); process.exit(1); }
  const put = (x: number, y: number, v: number) => { for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) pic.c[(y * 4 + j) * 1920 + x * 4 + i] = v; };
  let bandDiff = 0;
  for (let y = RH; y < 270; y++) for (let x = 0; x < 480; x++) { const v = n.c[y * 480 + x]; if (pic.c[(y * 4) * 1920 + x * 4] !== v) bandDiff++; put(x, y, v); }
  if (any) {
    // the outline first (the 8 neighbours of every V.O. glyph pixel that are background), then the host's own pixels
    for (let y = 1; y < RH - 1; y++) for (let x = 1; x < 479; x++) {
      if (n.c[y * 480 + x] !== PAL.C6) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (n.c[(y + dy) * 480 + x + dx] === KEY) put(x + dx, y + dy, PAL.N0);
    }
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const v = n.c[y * 480 + x]; if (v !== KEY) put(x, y, v); }
    vo.push(f);
  }
  writePNG(outFile, pic);
  if (any || bandDiff) laid++; else copied++;
}
console.log(JSON.stringify({splice: DEMO_SPLICE, frames: DEMO_SPLICE.to - DEMO_SPLICE.from, with_host_layer: laid, as_is: copied, vo_frames: vo.length ? [vo[0], vo[vo.length - 1]] : []}));
