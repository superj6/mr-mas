// Dev entry for the Ep1 Act Four animatic (THE EDITOR). Registers ONLY these compositions (frames.ts): v5 (the current
// cut, lock v5: Animatic5.tsx), v4 and v3 kept for comparison.
//   v5: prefer the Node renderer tools/render5.ts (it renders the act, splices this host's GLYPH frames in and muxes the
//   stick mix; see its header). Remotion directly, for a check or a GLYPH frame range:
//   npx remotion render src/episodes/ep01/act4/animatic/entry.tsx ep01-act4-animatic-v5-picture <out.mp4> --frames=940-1054 --concurrency=2 --log=error
//   npx remotion still  src/episodes/ep01/act4/animatic/entry.tsx ep01-act4-animatic-v5-still <out.png> --props='{"offset": 1010, "picture": true}' --log=error
//   npx remotion render src/episodes/ep01/act4/animatic/entry.tsx ep01-act4-animatic-v4 <out.mp4> --concurrency=6 --bundle-cache=false --log=error
//   npx remotion render src/episodes/ep01/act4/animatic/entry.tsx ep01-act4-animatic-v4-picture <out.mp4> --concurrency=6 --bundle-cache=false --log=error
//   npx remotion still  src/episodes/ep01/act4/animatic/entry.tsx ep01-act4-animatic-v4-still <out.png> --props='{"offset": 3000, "version": 4}' --bundle-cache=false --log=error
//   (v3: ep01-act4-animatic / ep01-act4-animatic-still, as before)
// Faster, pixel-identical (Node, no browser): tools/render4.ts (v4) and tools/render.ts (v3); they also mux the audio.
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../shared/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
