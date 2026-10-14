// Entry for the Ep3 v1 pixel pipeline (a copy of Ep1's). Registers ONLY Ep3's pixel compositions (frames.ts: every <seg>/shots.ts).
// Prefer the Node renderer (tools/render.ts: faster, pixel-identical, it splices this host's GLYPH / browser frames in
// and muxes the mix). Remotion directly, for a still or a check (from studio/, through ops/heavy.sh):
//   npx remotion still  src/episodes/ep03/pixel/entry.tsx ep03-pixel-card-still <out.png> --props='{"offset": 20}' --log=error
//   npx remotion still  src/episodes/ep03/pixel/entry.tsx ep03-pixel-act1-still <out.png> --props='{"offset": 240, "mode": "review"}' --log=error
//   npx remotion render src/episodes/ep03/pixel/entry.tsx ep03-pixel-act1 <out.mp4> --frames=0-48 --concurrency=2 --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
