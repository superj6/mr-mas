// Dev entry for ep01 act 4 · rooms B (the bullpen, the lighthouse, the dark room). Renders ONLY these frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../shared/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
