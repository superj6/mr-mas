// Dev entry for the season outline reel (one composition per show/reel/*.json, plus reel-season and
// reel-ep01-full, the full-length pilot stitched from ep01-full-part1 + Act Four + ep01-full-part2).
// Studio: npx remotion studio src/dev/reel/entry.tsx   (run `node src/reel/sync.mjs --watch` alongside)
// Render: bash src/dev/reel/render_all.sh
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/reel.frame';

registerRoot(makeRoot(frames));
