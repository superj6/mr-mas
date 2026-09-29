// Dev entry for mfinale (intro frames 480-719). Renders ONLY this builder's frames.
//   npx remotion still  src/dev/mfinale/entry.tsx mfinale-key-title ../out/season/intro/moments/mfinale-title.png --bundle-cache=false --log=error
//   npx remotion render src/dev/mfinale/entry.tsx mfinale ../out/season/intro/moments/mfinale.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/mfinale.frame';

registerRoot(makeRoot(frames));
