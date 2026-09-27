// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of E1-P3's PIXEL side: the plates, the owner map (tinted), the busts. No vector here (that needs a
// browser canvas: use the ep1-p3-probe composition).
//   npx esbuild src/dev/range/ep1-p3/tools/preview.ts --bundle --platform=node --outfile=<scratch>/pre.js
//   node <scratch>/pre.js <outDir>
import {writePNG} from '../../../pixeladv/tools/png';
import {Buf} from '../../../../shared/pixel/px';
import {plate, plateAt, wideFrame, madaFrame, tasyaLayer, masLayer, band, OWN, TRANSP} from '../pixel';

const out = process.argv[2];
const over = (a: Buf, b: Buf) => { for (let i = 0; i < a.c.length; i++) if (b.c[i] !== TRANSP) a.c[i] = b.c[i]; return a; };
const TINT = [0x000000, 0xff00ff, 0x00ffff, 0xffff00, 0xff0000, 0x00ff00];
for (const p of [60]) writePNG(`${out}/wide-${p}.png`, 480, 270, wideFrame(p).c, 2);
for (const p of [400, 430]) writePNG(`${out}/mada-${p}.png`, 480, 270, madaFrame(p).c, 2);
for (const p of [200, 247, 270, 300]) {
  const b = plateAt(p); band(b);
  over(b, tasyaLayer(p, p >= 300));
  writePNG(`${out}/tasya-${p}.png`, 480, 270, b.c, 2);
}
{
  const pl = plate('all', 0);
  const b = pl.buf.clone();
  for (let i = 0; i < 480 * 203; i++) if (pl.own[i]) { const t = TINT[pl.own[i]]; const c = b.c[i]; b.c[i] = (((((c >> 16) & 255) + ((t >> 16) & 255)) >> 1) << 16) | (((((c >> 8) & 255) + ((t >> 8) & 255)) >> 1) << 8) | (((c & 255) + (t & 255)) >> 1); }
  writePNG(`${out}/owners.png`, 480, 270, b.c, 2);
  const r = pl.buf.clone();
  for (let i = 0; i < 480 * 203; i++) r.c[i] = [0x000000, 0x3355ff, 0xffffff, 0x888888][pl.reg[i]];
  writePNG(`${out}/regions.png`, 480, 270, r.c, 2);
}
{
  const b = new Buf(480, 270, 0x808890); band(b); over(b, masLayer(340));
  writePNG(`${out}/mas-mcu.png`, 480, 270, b.c, 2);
}
console.log('ok', OWN);
