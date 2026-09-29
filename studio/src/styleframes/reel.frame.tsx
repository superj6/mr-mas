// SEASON OUTLINE REEL: a rough stick-figure animatic of every episode, ~2-3 min each, data-driven from
// show/reel/epNN.json (schema: studio/src/reel/schema.ts). Generator code lives in src/reel/.
//   sync data:   node src/reel/sync.mjs            (copies + lints show/reel/*.json into src/reel/data/; --watch for the studio)
//   studio:      npx remotion studio src/dev/reel/entry.tsx
//   render all:  bash src/dev/reel/render_all.sh    (-> out/season/reels/epNN.mp4, season.mp4, sheets/epNN.png)
// Compositions: reel-ep01 ... reel-ep12 (one per file), reel-season (all epNN back to back).
import {reelFrames} from '../reel/registry';

export const frames = reelFrames;
