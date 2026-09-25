// Dev entry for the act4 FX kits (MOTION-GRAPHICS / FX). Renders ONLY the kit demos.
//   npx remotion still  src/episodes/ep01/act4/kits/entry.tsx kits-plan ../out/ep01/act4/assets/kits/<name>.png --frame=40 --bundle-cache=false --log=error
//   npx remotion render src/episodes/ep01/act4/kits/entry.tsx kits-plan ../out/ep01/act4/assets/kits/<name>.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../dev/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
