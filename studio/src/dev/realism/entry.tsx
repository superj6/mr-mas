// PAINTERLY PRESTIGE REALISM structure dev entry (builder key: realism). Registers only this builder's frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/realism.frame';
import {devFrames} from './devframes';

registerRoot(makeRoot([...frames, ...devFrames]));
