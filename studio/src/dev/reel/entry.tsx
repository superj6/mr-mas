// Dev entry for the season outline reel (one composition per show/reel/epNN.json, plus reel-season).
// Studio: npx remotion studio src/dev/reel/entry.tsx   (run `node src/reel/sync.mjs --watch` alongside)
// Render: bash src/dev/reel/render_all.sh
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/reel.frame';

registerRoot(makeRoot(frames));
