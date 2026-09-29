// Per-asset dev entry for style jump prototype 2 (J3 "THE SKY OPENS"): renders ONLY these compositions.
//   npx remotion render src/dev/jumps/proto2/entry.tsx jump-proto-2 ../out/lookdev/jumps/proto2-silent.mp4 --concurrency=1 --bundle-cache=false --log=error
//   npx remotion still  src/dev/jumps/proto2/entry.tsx jump-proto-2 ../out/lookdev/jumps/proto2-p080.png --frame=80 --bundle-cache=false --log=error
// Full build (picture + sound + mux + stills): bash src/dev/jumps/proto2/tools/build.sh
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import {frames} from '../../../styleframes/jumps/proto2.frame';

registerRoot(makeRoot(frames));
