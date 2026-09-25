import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from './masfix.frame';

registerRoot(makeRoot(frames));
