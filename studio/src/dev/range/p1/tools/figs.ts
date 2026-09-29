// @ts-nocheck -- Node-only dev tool: every P1 pixel figure on one sheet at 8x (for pixel-level review).
import {writePNG} from '../../../../shared/pixel/png';
import {NOLE_IMG, MARIO_IMG, KRAM_IMG, NESNEJ_IMG, INTERN_IMG, MAS_IMG} from '../pixel/cast';
const out = process.argv[2];
const imgs = [KRAM_IMG({}), NESNEJ_IMG({}), MARIO_IMG({}), NOLE_IMG({flare: false}), INTERN_IMG({hand: 'up'})];
const W = imgs.reduce((a, i) => a + i.w + 4, 0), H = Math.max(...imgs.map((i) => i.h));
const c = new Uint32Array(W * H).fill(0x202030);
let ox = 0;
for (const im of imgs) { for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) { const v = im.c[y * im.w + x]; if (v >= 0) c[y * W + ox + x] = v; } ox += im.w + 4; }
writePNG(out + '/figs.png', W, H, c, 6);
const m = MAS_IMG({eye: 0});
const c2 = new Uint32Array(m.w * m.h).fill(0x202030);
for (let i = 0; i < m.c.length; i++) if (m.c[i] >= 0) c2[i] = m.c[i];
writePNG(out + '/mas.png', m.w, m.h, c2, 4);
