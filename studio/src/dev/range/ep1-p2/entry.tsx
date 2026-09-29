// Dev entry for range/ep1-p2 (E1-P2 · 1.H WHAT THE QUACK). Renders ONLY this prototype. CPU (2D canvas) composite over
// the Blender take, which must already be in <public>/take/f000..f119.png (tools/build.sh makes it). From studio/:
//   npx remotion still  src/dev/range/ep1-p2/entry.tsx ep1-p2   $S/p.png --frame=60 --public-dir=$S/public
//   npx remotion render src/dev/range/ep1-p2/entry.tsx ep1-p2   ../out/lookdev/range/ep1/ep1-p2.mp4   --public-dir=$S/public --concurrency=4
//   npx remotion render src/dev/range/ep1-p2/entry.tsx ep1-p2-b ../out/lookdev/range/ep1/ep1-p2-b.mp4 --public-dir=$S/public --concurrency=4
// (tools/build.sh runs the whole thing: the take, the sound, both cuts, the stills, the sheets, the measures.)
import React from 'react';
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import {EP1P2, Matte} from './P2Duck';
import {LEN} from './plan';

const A: React.FC = () => <EP1P2 version="A" />;
const B: React.FC = () => <EP1P2 version="B" />;

registerRoot(makeRoot([
  {id: 'ep1-p2', component: A, durationInFrames: LEN.A, fps: 24, width: 1920, height: 1080},
  {id: 'ep1-p2-b', component: B, durationInFrames: LEN.B, fps: 24, width: 1920, height: 1080},
  {id: 'ep1-p2-matte', component: Matte, width: 1920, height: 1080},
]));
