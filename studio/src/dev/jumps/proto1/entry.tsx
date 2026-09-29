// Dev entry for style-jump prototype 1 (J1 "CANCELLED"). Registers ONLY this prototype's compositions.
//   npx remotion still  src/dev/jumps/proto1/entry.tsx jump-proto-1 ../out/lookdev/jumps/proto1-key-2.png --frame=70 --bundle-cache=false --log=error
//   npx remotion render src/dev/jumps/proto1/entry.tsx jump-proto-1 ../out/lookdev/jumps/proto1-silent.mp4 --concurrency=2 --bundle-cache=false --log=error
// The finished clip (picture + the sound pass, muxed with the bundled ffmpeg): tools/build.sh
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import {frames} from '../../../styleframes/jumps/proto1.frame';

registerRoot(makeRoot(frames));
