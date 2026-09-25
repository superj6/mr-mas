// Dev entry for the GRAPHIC-SHAPE CINEMA structure (key: shape). Registers only this builder's frames.
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/shape.frame';

registerRoot(makeRoot(frames));
