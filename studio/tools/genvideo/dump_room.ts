// @ts-nocheck -- Node-only test helper (bundled with esbuild), outside the browser typecheck.
// Dumps the engine's EXACT native frames of the approved room (pixelengine drawRoom, = the pixeladv scene) as
// 480x270 PNGs, so test_genvideo.py can score the video round trip (engine -> MP4 -> pixelize) pixel by pixel.
//   npx esbuild tools/genvideo/dump_room.ts --bundle --platform=node --outfile=/tmp/gv-room.js --log-level=warning
//   node /tmp/gv-room.js <outDir> <frames>
import {mkdirSync} from 'fs';
import {writePNG} from '../../src/shared/pixel/png';
import {Buf, W, H} from '../../src/shared/pixel/px';
import {PAL} from '../../src/shared/pixel/palette';
import {drawRoom} from '../../src/dev/pixelengine/room';

const [outDir, nS] = process.argv.slice(2);
mkdirSync(outDir, {recursive: true});
const n = Number(nS) || 120;
for (let f = 0; f < n; f++) {
  const b = drawRoom(new Buf(W, H, PAL.N0), {world: f, ui: true, convo: true});
  writePNG(`${outDir}/r${String(f).padStart(4, '0')}.png`, W, H, b.c, 1);
}
console.log(`wrote ${n} frames to ${outDir}`);
