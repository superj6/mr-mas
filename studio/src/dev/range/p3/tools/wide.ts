// @ts-nocheck -- Node-only dev tool: the pixel [W] at native res (x2), band on / band off.
import {writePNG} from '../../../../shared/pixel/png';
import {OBuf, drawWide} from '../plate';
import {PAL} from '../../../../shared/pixel/palette';
const f = Number(process.argv[3] || 0), band = Number(process.argv[4] ?? 67);
const b = new OBuf(480, 270, PAL.N0);
drawWide(b, f, {band});
writePNG(process.argv[2], 480, 270, b.c, Number(process.argv[5] || 2));
if (process.argv[6]) { const o = new Uint32Array(480 * 270); const pal = [0x000000, 0x404080, 0x806040, 0xe0e0e0, 0xa0a0a0, 0xffc040, 0xff8000, 0x00ffff, 0xff00ff, 0x804000, 0xff0000, 0x00ff00, 0x0080ff, 0x303030, 0x101010, 0xffff80]; for (let i = 0; i < o.length; i++) o[i] = pal[b.own[i]] ?? 0xffffff; writePNG(process.argv[6], 480, 270, o, 2); }
