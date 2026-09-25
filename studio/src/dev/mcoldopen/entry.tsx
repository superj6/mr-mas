// Dev entry for mcoldopen (the pixel cold open). Renders ONLY this builder's compositions.
//   npx remotion still  src/dev/mcoldopen/entry.tsx mcoldopen ../out/pixel/moments/mcoldopen-<name>.png --frame=<f> --bundle-cache=false --log=error
//   npx remotion render src/dev/mcoldopen/entry.tsx mcoldopen ../out/pixel/moments/mcoldopen.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/mcoldopen.frame';

registerRoot(makeRoot(frames));
