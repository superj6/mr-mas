// @ts-nocheck -- Node-only dev tool: the guests' reconstruction drawings at native size (x3) on one sheet.
//   npx esbuild src/dev/range/p3/tools/spr.ts --bundle --platform=node --outfile=$SP/spr.js && node $SP/spr.js $SP/spr.png [f]
import {writePNG} from '../../../../shared/pixel/png';
import {guestImg} from '../sprites';
const f = Number(process.argv[3] || 200);
const W = 560, H = 260, o = new Uint32Array(W * H).fill(0x202431);
let x0 = 4;
const put = (m, x, y) => { for (let j = 0; j < m.h; j++) for (let i = 0; i < m.w; i++) { const v = m.c[j * m.w + i]; if (v >= 0 && x + i < W && y + j < H) o[(y + j) * W + x + i] = v; } };
for (const [who, near, flip, toward] of [['mario', true, false, 1], ['nole', true, false, -1], ['gerg', false, false, 1], ['alyi', false, true, -1]]) {
  const m = guestImg(who, near, flip, toward, true, f);
  put(m, x0, 4); x0 += m.w + 8;
}
writePNG(process.argv[2], W, H, o, 3);
