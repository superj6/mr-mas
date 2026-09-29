// ENV dev entry: registers only the cold-open set / orb / screen frames.
// Render: npx remotion still src/dev/env/entry.tsx env-tone-test ../out/lookdev/looks/env/env-tone-test.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/env.frame';

registerRoot(makeRoot(frames));
