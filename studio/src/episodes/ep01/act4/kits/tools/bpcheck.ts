// @ts-nocheck -- Node-only dev tool: renders the blueprint kit's building blocks on one sheet (a unit check).
import {writePNG} from '../../../../../shared/pixel/png';
import {Buf} from '../../../../../shared/pixel/px';
import {BPX, bpSheet, bpDim, bpBox, bpArrow, bpStamp, bpText, bpCheck, bpChair, bpWalker, bpMoth, inkBlueprint} from '../../../../../shared/pixel/kits/blueprint';
const b = new Buf(480, 270, BPX.navy);
bpSheet(b);
bpBox(b, 20, 30, 140, 60, 999, 0, {double: true, label: 'A DOUBLE BOX'});
bpDim(b, 20, 159, 104, '140 PX', 999, 0);
bpArrow(b, 200, 100, 40, 999, 0, {w: 7, head: 8});
bpText(b, '~$10B · TILDE CHECK', 230, 40, 999, 0);
bpStamp(b, ['STAMP 7 PX'], 300, 70, 1);
bpStamp(b, ['STAMP 14'], 390, 70, 1, {big: true});
bpCheck(b, 230, 100, 5); bpCheck(b, 245, 100, -1);
(['sit', 'stand', 'walkA', 'walkB'] as const).forEach((p, i) => bpChair(b, 40 + i * 30, 170, p, {bolts: i === 0, sticker: i === 1}));
(['door', 'paper', 'spinner', 'square'] as const).forEach((k, i) => bpWalker(b, k, 190 + i * 28, 170, (i % 3) as 0 | 1 | 2, 8));
[0, 1, 2].forEach((k) => bpMoth(b, 330 + k * 20, 160, k));
inkBlueprint(b);
writePNG(process.argv[2], 480, 270, b.c, 3);
