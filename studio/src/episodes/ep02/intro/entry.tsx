// Entry for Ep2's intro variant: registers ONLY intro-ep2 (src/intro's cut from the moments with Ep2's slot).
// From studio/, through ops/heavy.sh (tools/master.sh does the whole master):
//   npx remotion still  src/episodes/ep02/intro/entry.tsx intro-ep2 <out.png> --frame=40 --log=error
//   bash src/episodes/ep02/intro/tools/master.sh intro-ep2 <out.mp4> <scratch>
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
