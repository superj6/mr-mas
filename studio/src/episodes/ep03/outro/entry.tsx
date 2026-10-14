// Entry for Ep3's outro (B, the Orb's verdict, in Ep1's format, with Ep3's credits): registers ONLY outro-b-ep3.
// The whole pipeline (picture, score, vocal line, mix, mux, checks) is tools/render.sh; the picture alone, from studio/:
//   bash ../ops/heavy.sh npx remotion render src/episodes/ep03/outro/entry.tsx outro-b-ep3 <out.mp4> --concurrency=4 --crf=12
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroEp3} from './OutroEp3';
import {TOTAL} from './timeline';

const frames: FrameDef[] = [{id: 'outro-b-ep3', component: OutroEp3, durationInFrames: TOTAL, fps: 24}];

registerRoot(makeRoot(frames));
