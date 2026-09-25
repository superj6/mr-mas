// Dev entry for mdinner2 (intro frames 345-479). Renders ONLY this builder's frames.
//   npx remotion still  src/dev/mdinner2/entry.tsx mdinner2-nope ../out/pixel/moments/mdinner2-nope.png --bundle-cache=false --log=error
//   npx remotion render src/dev/mdinner2/entry.tsx mdinner2 ../out/pixel/moments/mdinner2.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/mdinner2.frame';

registerRoot(makeRoot(frames));
