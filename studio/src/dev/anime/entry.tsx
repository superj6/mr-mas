// Dev entry for the ANIME CEL style: registers only anime frames.
// npx remotion still src/dev/anime/entry.tsx anime-lookdev ../out/lookdev/looks/anime/lookdev.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/anime.frame';

registerRoot(makeRoot(frames));
