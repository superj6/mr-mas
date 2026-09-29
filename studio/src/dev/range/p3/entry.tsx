// Dev entry for range/p3 (Prototype 3: THE RECONSTRUCTION's table, 12.A). Renders ONLY this prototype.
// Always probe first, then render on the iGPU (one backend for the clip), with this folder's public dir (the HDRI):
//   npx remotion still  src/dev/range/p3/entry.tsx p3-probe $SCRATCH/probe.png --gl=angle --public-dir=src/dev/range/p3/public
//   npx remotion still  src/dev/range/p3/entry.tsx p3 ../out/lookdev/range/p3-still.png --frame=200 --gl=angle --public-dir=src/dev/range/p3/public --timeout=600000
//   npx remotion render src/dev/range/p3/entry.tsx p3 ../out/lookdev/range/p3.mp4 --gl=angle --concurrency=1 --public-dir=src/dev/range/p3/public --timeout=600000
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import {P3} from './P3';
import {Probe} from './Probe';
import {Clod} from './Clod';
import {P3_FRAMES} from './timeline';

registerRoot(makeRoot([
  {id: 'p3', component: P3, durationInFrames: P3_FRAMES, fps: 24, width: 1920, height: 1080},
  {id: 'p3-probe', component: Probe, width: 1920, height: 1080},
  {id: 'p3-clod', component: Clod, width: 1920, height: 1080},
]));
