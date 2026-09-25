// NOIR GRAPHIC-NOVEL MOTION COMIC structure dev entry (builder key: comic). Registers only this builder's frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/comic.frame';
import {devFrames} from './devframes';

registerRoot(makeRoot([...frames, ...devFrames]));
