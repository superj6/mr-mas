// @ts-nocheck -- Node-only dev tool. Mas portrait head angles side by side.
//   npx esbuild src/dev/castmas/tools/portraitlab.ts --bundle --platform=node --outfile=<scratch>/plab.cjs && node <scratch>/plab.cjs <out.png> <scale>
import {writePNG} from '../../../shared/pixel/png';
import {Buf} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {drawMasPortrait} from '../../../shared/pixel/cast/mas';
const [out, sc] = process.argv.slice(2);
const states = [
  {mouth: 'rest', lid: 0, look: -1, brow: 0, light: 'monitor'},
  {mouth: 'rest', lid: 0, look: 0, brow: 0, light: 'monitor', head: 'front'},
  {mouth: 'smile', lid: 0, look: 0, brow: 0, light: 'monitor', head: 'front'},
  {mouth: 'rest', lid: 1, look: 0, brow: 0, light: 'monitor', head: 'front'},
  {mouth: 'rest', lid: 0, look: 0, brow: 0, light: 'warm', head: 'front'},
];
const b = new Buf(116 * states.length, 136, PAL.N0);
states.forEach((s, i) => drawMasPortrait(b, i * 116, 0, s));
writePNG(out, b.w, b.h, b.c, Number(sc) || 4);
