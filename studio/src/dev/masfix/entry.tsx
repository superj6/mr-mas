import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from './masfix.frame';

registerRoot(makeRoot(frames));
