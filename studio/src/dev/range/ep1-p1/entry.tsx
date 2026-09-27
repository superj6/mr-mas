// Dev entry for range/ep1-p1 (style-range §6.1a, E1-P1: 1.A CLOD under its launch light). Renders ONLY this prototype.
// The whole build is tools/build.sh (probe -> cels on the iGPU -> pixel CLOD + shadows -> clip -> sound -> mux ->
// stills and sheets from the encoded mp4). By hand, from studio/ (S = a scratch dir holding cels/):
//   npx remotion still  src/dev/range/ep1-p1/entry.tsx ep1-p1-probe $S/probe.png --gl=angle
//   npx remotion render src/dev/range/ep1-p1/entry.tsx ep1-p1-cels $S/cels-raw --sequence --image-format=png --gl=angle --concurrency=1
//   npx remotion render src/dev/range/ep1-p1/entry.tsx ep1-p1 $S/video.mp4 --public-dir=$S/pub --gl=angle --concurrency=4
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import {P1} from './P1';
import {Cels, CEL_W, CEL_H, CEL_COUNT} from './gl/CelRender';
import {Probe} from './Probe';
import {FRAMES} from './timeline';

registerRoot(makeRoot([
  {id: 'ep1-p1', component: P1, durationInFrames: FRAMES, fps: 24, width: 1920, height: 1080},
  {id: 'ep1-p1-cels', component: Cels, durationInFrames: Math.max(2, CEL_COUNT), fps: 24, width: CEL_W, height: CEL_H},
  {id: 'ep1-p1-probe', component: Probe, width: 960, height: 200},
  {id: 'ep1-p1-still', component: P1, width: 1920, height: 1080, props: {hold: 300}},
]));
