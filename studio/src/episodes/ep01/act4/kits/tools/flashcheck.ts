// @ts-nocheck -- Node-only dev tool: 24.02's flash-print candidates on the real laptop insert (rooms-a's file, read-only).
import {writePNG} from '../../../../../dev/pixeladv/tools/png';
import {Buf} from '../../../../../shared/pixel/px';
import {inPalette} from '../../../../../shared/pixel/palettes';
import {drawLaptopInsert, LAPTOP_INSERT} from '../../../../../shared/pixel/rooms/vegas-suite';
import {BLUEPRINT, BLUEPRINT_PRINT, traceBlueprint, inkBlueprint} from '../../../../../shared/pixel/kits/blueprint';
const base = new Buf();
drawLaptopInsert(base, {f: 0, cursor: [LAPTOP_INSERT.join.x + 50, LAPTOP_INSERT.join.y + 14]});
const a = inPalette(base, BLUEPRINT), p = inPalette(base, BLUEPRINT_PRINT);
const t = traceBlueprint(base); inkBlueprint(t);
const out = new Uint32Array(960 * 540);
const put = (src, ox, oy) => { for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * 960 + ox + x] = src.c[y * 480 + x]; };
put(base, 0, 0); put(a, 480, 0); put(p, 0, 270); put(t, 480, 270);
writePNG(process.argv[2], 960, 540, out, 2);
