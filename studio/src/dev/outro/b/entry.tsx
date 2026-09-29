// MR. MAS · outro B, "the Orb's verdict": Ep1's FINAL outro (v3, 2026-09-27). The showrunner chose B ("i liked the
// orb outro. also it should say art, script, etc. created by opus 4.5, prompt jgon"); the credit reads opus 5.5
// (SHOWRUNNER-NOTES note 4), and there is no terms line or pointer on screen (note 3).
// How it's built, how to re-render it and how to change the credit text: README.md in this folder.
//   the clock, the words, the credits  timeline.ts (CREDITS, SHOW)  ·  the scene  scene.ts  ·  the drawings  art.ts
//   the score  audio/track.py  ·  the SFX + the mix  audio/mix.py  ·  checks + sheets  tools/  ·  all of it  tools/render.sh
// Composition ids:
//   outro-b-ep1     243 f (10.125 s): Ep1's outro, o0 = the cut to black, to 4.4 (225 f), + 18 f of black (the
//                   fifth's release). Props {ep: 6 | 10} give a plain week's states (cut at o179, black after, no moth).
//   outro-b-stills  4 f: the per-episode variant states (timeline.ts STILLS; frame 1 is also read by
//                   studio/src/dev/outro/_compare/reel.py).
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroB, OutroBStills} from './OutroB';
import {TOTAL, STILLS} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-b-ep1', component: OutroB, durationInFrames: TOTAL, fps: 24, props: {ep: 1}},
  {id: 'outro-b-stills', component: OutroBStills, durationInFrames: STILLS.length, fps: 24},
];

registerRoot(makeRoot(frames));
