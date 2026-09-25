// ANIME SCENE dev entry (builder key: animescene). Registers only this builder's frames.
// Bundle once to a private dir, then render stills from it (see notes/animescene.md).
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/animescene.frame';

registerRoot(makeRoot(frames));
