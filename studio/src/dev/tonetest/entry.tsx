import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/tonetest.frame';
import {debugFrames} from './debug';

registerRoot(makeRoot([...frames, ...debugFrames]));
