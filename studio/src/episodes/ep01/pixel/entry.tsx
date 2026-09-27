// Dev entry for the Ep1 pixel pipeline (P0). Registers ONLY the pixel compositions (frames.ts: every <seg>/shots.ts).
// Prefer the Node renderer (tools/render.ts: faster, pixel-identical, it splices this host's GLYPH / browser frames in
// and muxes the mix). Remotion directly, for a still or a check (from studio/, through ops/heavy.sh):
//   npx remotion still  src/episodes/ep01/pixel/entry.tsx ep01-pixel-act4-v5-still <out.png> --props='{"offset": 1010}' --log=error
//   npx remotion still  src/episodes/ep01/pixel/entry.tsx ep01-pixel-act1-still <out.png> --props='{"offset": 240, "mode": "review"}' --log=error
//   npx remotion render src/episodes/ep01/pixel/entry.tsx ep01-pixel-act4-v5 <out.mp4> --frames=990-1040 --concurrency=2 --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../dev/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
