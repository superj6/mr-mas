// NOLE dev entry: registers only nole.frame.tsx compositions.
// npx remotion still src/dev/nole/entry.tsx nole-tone-test ../out/lookdev/looks/nole/tone-test.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/nole.frame';

registerRoot(makeRoot(frames));
