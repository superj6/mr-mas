// mrollcall dev entry: registers ONLY this moment's compositions.
//   npx remotion still  src/dev/mrollcall/entry.tsx mrollcall-sheet ../out/season/intro/moments/mrollcall-sheet.png --bundle-cache=false --log=error
//   npx remotion render src/dev/mrollcall/entry.tsx mrollcall ../out/season/intro/moments/mrollcall.mp4 --concurrency=1 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from '../../styleframes/mrollcall.frame';

registerRoot(makeRoot(frames));
