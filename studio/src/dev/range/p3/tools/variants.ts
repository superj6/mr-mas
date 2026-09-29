// @ts-nocheck -- Node-only dev tool: the portrait swap drawings the reconstruction's idles can use (x2 sheet).
import {writePNG} from '../../../../shared/pixel/png';
import {gergPortrait, GERG_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/gerg';
import {alyiPortrait, ALYI_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/alyi';
import {marioPortraitImg, MARIO_PORTRAIT_REST} from '../../../../shared/pixel/cast/mario';
import {nolePortraitImg, NOLE_PORTRAIT_REST} from '../../../../shared/pixel/cast/nole';
const rows = [
  [0, 1, 2].map((v) => marioPortraitImg({...MARIO_PORTRAIT_REST, finger: v})).concat([marioPortraitImg({...MARIO_PORTRAIT_REST, finger: 0, nod: 2}), marioPortraitImg({...MARIO_PORTRAIT_REST, finger: 0, blink: 2}), marioPortraitImg({...MARIO_PORTRAIT_REST, finger: 0, mouth: 2})]),
  [0, 1, 2].map((v) => nolePortraitImg({...NOLE_PORTRAIT_REST, screen: 'post', jab: v})).concat([nolePortraitImg({...NOLE_PORTRAIT_REST, screen: 'post', dip: 2}), nolePortraitImg({...NOLE_PORTRAIT_REST, screen: 'post', blink: 2}), nolePortraitImg({...NOLE_PORTRAIT_REST, screen: 'post', mouth: 3})]),
  [-1, 0, 1].map((v) => gergPortrait({...GERG_PORTRAIT_DEFAULT, lid: 0, look: v})).concat([gergPortrait({...GERG_PORTRAIT_DEFAULT, lid: 2}), gergPortrait({...GERG_PORTRAIT_DEFAULT, lid: 0, mouth: 'open'}), gergPortrait({...GERG_PORTRAIT_DEFAULT, lid: 0, mouth: 'smile'})]),
  [alyiPortrait(ALYI_PORTRAIT_DEFAULT), alyiPortrait({...ALYI_PORTRAIT_DEFAULT, eyes: 'closed'}), alyiPortrait({...ALYI_PORTRAIT_DEFAULT, mouth: 'open'}), alyiPortrait({...ALYI_PORTRAIT_DEFAULT, t: 5}), alyiPortrait({...ALYI_PORTRAIT_DEFAULT, t: 12})],
];
const W = 6 * 120, H = 4 * 144, o = new Uint32Array(W * H).fill(0x202431);
rows.forEach((r, j) => r.forEach((m, i) => { for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) { const v = m.c[y * m.w + x]; if (v >= 0) o[(j * 144 + 4 + y) * W + i * 120 + 4 + x] = v; } }));
writePNG(process.argv[2], W, H, o, 2);
console.log(rows.map((r) => r.map((m) => m.w + 'x' + m.h).join(' ')).join('\n'));
