// COLLAGE structure dev entry (builder key: collage). Registers only this builder's frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/collage.frame';
import {devFrames} from './devframes';

registerRoot(makeRoot([...frames, ...devFrames]));
