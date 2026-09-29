// MR. MAS · style range · prototype 4 · THE TIER 1 REEL (style-range §7.4): P4 SPORTS, P5 STREAM, P3 BROADCAST and
// P21 IRIS, each inside its pixel room, 720 f at 24 fps. Per-asset dev entry (only this asset's compositions).
// Render (from studio/, CPU):
//   npx remotion render src/dev/range/p4/entry.tsx range-p4 <scratch>/p4-picture.mp4 --concurrency=4 --crf=16 --bundle-cache=false --log=error
//   npx remotion still  src/dev/range/p4/entry.tsx range-p4 <out>.png --frame=N --bundle-cache=false --log=error
// Sound (the OST engine's venv; cue first, then the rooms/devices/SFX pass, which also muxes):
//   cd src/dev/range/p4/audio && ../../../../../../audio/.venv-theme/bin/python cue.py --out <scratch>/cue
//   ../../../../../../audio/.venv-theme/bin/python sound.py --cue <scratch>/cue --wav <scratch>/mix.wav \
//       --picture <scratch>/p4-picture.mp4 --out ../../../../../../out/lookdev/range/p4.mp4
// Stills + contact sheet: tools/sheet.ts (Node, same renderer; bit-identical to the Remotion frames, checked).
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import {P4} from './P4';

registerRoot(makeRoot([
  {id: 'range-p4', component: P4, durationInFrames: 720, fps: 24, width: 1920, height: 1080},
]));
