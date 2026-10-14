// Entry for Ep3's intro variant: registers ONLY intro-ep3 (src/intro's cut from the moments with Ep3's slot).
// From studio/, through ops/heavy.sh (tools/master.sh does the whole master):
//   npx remotion still  src/episodes/ep03/intro/entry.tsx intro-ep3 <out.png> --frame=40 --log=error
//   bash src/episodes/ep03/intro/tools/master.sh intro-ep3 <out.mp4> <scratch>
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
