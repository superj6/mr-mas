// Dev entry for castmas. Renders ONLY this builder's frames.
//   npx remotion still src/dev/castmas/entry.tsx castmas-sheet ../out/lookdev/pixel/cast/castmas-sheet.png --bundle-cache=false --log=error
//   npx remotion render src/dev/castmas/entry.tsx castmas-motion ../out/lookdev/pixel/cast/castmas-motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/castmas.frame';

registerRoot(makeRoot(frames));
