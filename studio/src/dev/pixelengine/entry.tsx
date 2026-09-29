// Dev entry for the shared pixel engine demos. Renders ONLY this builder's frames.
//   npx remotion still src/dev/pixelengine/entry.tsx pixelengine-switches-sheet ../out/lookdev/pixel/engine/switches-sheet.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/pixelengine.frame';

registerRoot(makeRoot(frames));
