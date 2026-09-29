// SCREENLIFE structure dev entry (builder key: screen). Registers only this builder's frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/screen.frame';
import {devFrames} from './devframes';

registerRoot(makeRoot([...frames, ...devFrames]));
