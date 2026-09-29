// SATIRE (latex-puppet caricature) dev entry — registers only this structure's frames.
// npx remotion still src/dev/satire/entry.tsx satire-key ../out/lookdev/structures/satire/key.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/satire.frame';
import {devFrames} from './devframes';

registerRoot(makeRoot([...frames, ...devFrames]));
