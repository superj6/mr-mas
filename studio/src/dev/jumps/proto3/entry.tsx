// Per-asset dev entry for style jump prototype C · J6 · THE RING (only this asset's compositions).
// Render (from studio/):
//   npx remotion render src/dev/jumps/proto3/entry.tsx jump-proto-3 ../out/jumps/proto3-picture.mp4 --concurrency=2 --bundle-cache=false --log=error
//   npx remotion still  src/dev/jumps/proto3/entry.tsx jump-proto-3 ../out/jumps/proto3-still-p44.png --frame=44 --bundle-cache=false --log=error
//   node src/dev/jumps/proto3/tools/sound.mjs     (the sound pass + the mux to ../out/jumps/proto3.mp4)
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import {frames} from '../../../styleframes/jumps/proto3.frame';

registerRoot(makeRoot(frames));
