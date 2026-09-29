// Dev entry for the generated-video insert demos (studio/tools/genvideo, src/shared/pixel/GenVideo.tsx).
// The demo clips are converted by the test bench into studio/public/genvideo/_test/ (gitignored):
//   audio/.venv-genvideo/bin/python studio/tools/genvideo/test_genvideo.py
//   npx remotion render src/dev/genvideo/entry.tsx genvideo-window ../out/lookdev/genvideo/tests/demo-window.mp4 --scale=0.5 --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
