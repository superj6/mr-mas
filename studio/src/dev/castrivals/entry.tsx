// Dev entry for castrivals (MARIO + NOLE + the skyline bosses). Renders ONLY this builder's frames.
//   npx remotion still src/dev/castrivals/entry.tsx castrivals-sheet ../out/pixel/cast/castrivals-sheet.png --bundle-cache=false --log=error
//   npx remotion render src/dev/castrivals/entry.tsx castrivals-motion ../out/pixel/cast/castrivals-motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/castrivals.frame';

registerRoot(makeRoot(frames));
