// Dev entry for the Ep1 act 4 CAST (character artist). Registers ONLY these frames.
//   npx remotion still  src/episodes/ep01/act4/cast/entry.tsx act4cast-sheet-neleh ../out/ep01/act4/assets/cast/neleh.png --bundle-cache=false --log=error
//   npx remotion render src/episodes/ep01/act4/cast/entry.tsx act4cast-motion ../out/ep01/act4/assets/cast/motion.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../dev/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
