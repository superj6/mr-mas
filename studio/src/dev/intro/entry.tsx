// Dev entry for the integrated intro. Registers ONLY intro-ep1 and the integrator's review compositions.
//   npx remotion still  src/dev/intro/entry.tsx intro-ep1 ../out/season/intro/picture/handoffs/f225.png --frame=225 --bundle-cache=false --log=error
//   npx remotion render src/dev/intro/entry.tsx intro-ep1 <dir> --sequence --image-format=png --concurrency=4 --log=error
//   npx remotion render src/dev/intro/entry.tsx intro-ep1 ../out/season/intro/picture/intro-ep1-1080p-silent.mp4 --codec=h264 --crf=12 --pixel-format=yuv420p --concurrency=4
//   npx remotion render src/dev/intro/entry.tsx intro-ep1 ../out/season/intro/picture/intro-ep1-4k-silent.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --scale=2 --concurrency=4
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../intro/intro.frame';
import {reviewFrames} from './review';

registerRoot(makeRoot([...frames, ...reviewFrames]));
