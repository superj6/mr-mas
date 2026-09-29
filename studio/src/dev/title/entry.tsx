// Title-card dev entry: renders ONLY the MR. MAS title frames.
// npx remotion still src/dev/title/entry.tsx title-soft ../out/lookdev/looks/title/title-soft.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/title.frame';

registerRoot(makeRoot(frames));
