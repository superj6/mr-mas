// Dev entry for the rough intro animatic (stick figures + boxes, timing overlays).
// Render: npx remotion render src/dev/animatic/entry.tsx intro-animatic ../out/season/intro/animatic/intro-animatic-silent.mp4 --concurrency=2 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../shared/makeRoot';
import {frames} from '../../styleframes/animatic.frame';

registerRoot(makeRoot(frames));
