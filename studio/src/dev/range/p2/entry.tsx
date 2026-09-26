// Prototype 2 · real 3D · THE CLIFF (style-range §7.2, 11.A, Ep11 #3). Per-asset dev entry (renders ONLY these).
//   probe:  npx remotion still  src/dev/range/p2/entry.tsx range-p2-probe <scratch>/probe.png --gl=angle
//   exact:  npx remotion still  src/dev/range/p2/entry.tsx range-p2-exact <scratch>/exact.png --gl=angle
//   grid:   npx remotion still  src/dev/range/p2/entry.tsx range-p2-grid <scratch>/g.png --gl=angle --props='{"frames":[60,90]}'
//   clip:   npx remotion render src/dev/range/p2/entry.tsx range-p2 <out>.mp4 --gl=angle --concurrency=4
//   build:  bash src/dev/range/p2/tools/build.sh   (both variants, sound, stills, sheet)
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import {Probe} from './probe';
import {P2, P2Exact, P2Grid} from './P2';
import {N_FRAMES} from './params';

registerRoot(
  makeRoot([
    {id: 'range-p2-probe', component: Probe},
    {id: 'range-p2-exact', component: P2Exact},
    {id: 'range-p2-grid', component: P2Grid, props: {frames: [0, 30, 59, 60, 90, 124, 140, 150, 160, 167, 172, 190, 205, 226, 240, 250]}},
    {id: 'range-p2', component: P2, durationInFrames: N_FRAMES, props: {variant: 'native'}},
    {id: 'range-p2-hd', component: P2, durationInFrames: N_FRAMES, props: {variant: 'hd'}},
  ]),
);
