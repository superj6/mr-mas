// Dev entry for mdinner1. Renders ONLY this builder's frames.
//   npx remotion still  src/dev/mdinner1/entry.tsx mdinner1-opening ../out/season/intro/moments/mdinner1-opening.png --bundle-cache=false --log=error
//   npx remotion render src/dev/mdinner1/entry.tsx mdinner1 ../out/season/intro/moments/mdinner1.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/mdinner1.frame';

registerRoot(makeRoot(frames));
