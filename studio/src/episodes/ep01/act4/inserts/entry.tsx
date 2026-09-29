// Dev entry for the Ep1 act 4 INSERT + EXPRESSION artist. Registers ONLY these frames.
//   npx remotion still  src/episodes/ep01/act4/inserts/entry.tsx act4ins-cu-26 ../out/ep01/act4/assets/inserts/cu-26.png --bundle-cache=false --log=error
//   npx remotion render src/episodes/ep01/act4/inserts/entry.tsx act4ins-motion ../out/ep01/act4/assets/inserts/motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../shared/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
