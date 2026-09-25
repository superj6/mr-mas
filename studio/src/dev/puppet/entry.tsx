// PUPPET structure dev entry (paper-puppet diorama). Registers only puppet frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/puppet.frame';

registerRoot(makeRoot(frames));
