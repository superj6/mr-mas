// Entry for Ep2's outro (B, the Orb's verdict, in Ep1's format, with Ep2's credits): registers ONLY outro-b-ep2.
// The whole pipeline (picture, score, vocal line, mix, mux, checks) is tools/render.sh; the picture alone, from studio/:
//   bash ../ops/heavy.sh npx remotion render src/episodes/ep02/outro/entry.tsx outro-b-ep2 <out.mp4> --concurrency=4 --crf=12
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroEp2} from './OutroEp2';
import {TOTAL} from './timeline';

const frames: FrameDef[] = [{id: 'outro-b-ep2', component: OutroEp2, durationInFrames: TOTAL, fps: 24}];

registerRoot(makeRoot(frames));
