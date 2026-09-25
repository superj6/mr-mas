// Dev entry for meras. Renders ONLY this builder's frames.
//   npx remotion still  src/dev/meras/entry.tsx meras-key-alert ../out/pixel/moments/meras-alert.png --bundle-cache=false --log=error
//   npx remotion render src/dev/meras/entry.tsx meras ../out/pixel/moments/meras.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/meras.frame';

registerRoot(makeRoot(frames));
