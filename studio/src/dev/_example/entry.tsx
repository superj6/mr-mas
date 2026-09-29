// Per-asset dev entry: renders ONLY this asset's frames, so one builder's broken file can't break another's render.
// Render:  npx remotion still src/dev/_example/entry.tsx <composition-id> ../out/lookdev/looks/<name>.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/test.frame';

registerRoot(makeRoot(frames));
