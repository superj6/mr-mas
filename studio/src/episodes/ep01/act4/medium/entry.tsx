// Dev entry for the Ep1 act 4 MEDIUM / TWO-SHOT tier (the medium-tier artist). Registers ONLY these frames.
//   npx remotion still  src/episodes/ep01/act4/medium/entry.tsx act4med-shot-30-14 ../out/ep01/act4/assets/medium/shot-30-14.png --bundle-cache=false --log=error
//   npx remotion render src/episodes/ep01/act4/medium/entry.tsx act4med-motion ../out/ep01/act4/assets/medium/motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
// Faster, pixel-identical: tools/lab.ts (Node, no browser).
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../dev/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
