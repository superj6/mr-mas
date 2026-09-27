// MR. MAS — OUTRO PROPOSAL A, "the closing session": LOOKDEV MOCK-UP (a visual outline to compare, not a final).
// Brief: show/production/OUTRO-PROPOSALS.md §2 + §9 row A, cut down after the cold read (README "Polish pass").
// Handoff: studio/src/dev/outro/a/README.md.
// Compositions:
//   outro-a-ep1     234 f @24 = 1 s stand-in (last frame of Act Four v4) + the 210-frame outro (o0-o209, 8.75 s)
//   outro-a-stills  per-episode variant stills; --props='{"which":"ep1"|"ep6"|"ep10"|"ep10-keys"}' (default ep10)
//
// Re-render (from studio/; outputs land in out/lookdev/outro/a/ + a copy at out/lookdev/outro/outro-a.mp4;
// SCR = your own scratch folder, e.g. <session scratchpad>/outro-a):
//   # 0. stand-in frame -> standin-data.ts (only if the Act Four animatic changes)
//   OUTRO_A_SCRATCH=$SCR ../audio/.venv-theme/bin/python src/dev/outro/a/tools/standin.py
//   # 1. temp music (OST engine, read-only import; renders into scratch, build.py copies what it needs out)
//   OST_WORKERS=4 ../audio/.venv-theme/bin/python src/dev/outro/a/audio/track.py --no-stems --no-loop --out $SCR/music
//   # 2. picture, silent, 1080p (PNG frames so the pixel art never sees JPEG)
//   npx remotion render src/dev/outro/a/entry.tsx outro-a-ep1 $SCR/outro-a-ep1-silent.mp4 --concurrency=4 \
//     --image-format=png --crf=12 --pixel-format=yuv420p --bundle-cache=false --log=error
//   # 3. layout from the engine, mix (music + designed SFX), mux (Remotion's ffmpeg), key stills, sheets, readability
//   #    QA on the encoded mp4 (about 30 s)
//   ../audio/.venv-theme/bin/python src/dev/outro/a/tools/build.py --scratch $SCR
//   # optional: a variant still through Remotion itself (build.py draws the same pixels with tools/preview.ts)
//   npx remotion still src/dev/outro/a/entry.tsx outro-a-stills $SCR/var-ep10.png --props='{"which":"ep10"}'
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroA, OutroAVariant} from './Outro';
import {TOTAL} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-a-ep1', component: OutroA, durationInFrames: TOTAL, fps: 24},
  {id: 'outro-a-stills', component: OutroAVariant, props: {which: 'ep10'}},
];

registerRoot(makeRoot(frames));
