// Dev entry for the pixeladv structure test. Renders ONLY this builder's frames.
//   npx remotion still src/dev/pixeladv/entry.tsx pixeladv-key ../out/lookdev/structures/pixeladv/key.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/pixeladv.frame';

registerRoot(makeRoot(frames));
