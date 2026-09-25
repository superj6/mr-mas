// MR. MAS — the full intro, Ep1: composition 'intro-ep1' (1920x1080, 24 fps, 720 frames = 30.0 s).
// Picked up by src/Root.tsx (every *.frame.tsx). The integrator's dev entry (src/dev/intro/entry.tsx) registers only
// this plus its review compositions, which bundles far less:
//   npx remotion render src/dev/intro/entry.tsx intro-ep1 ../out/intro/picture/intro-ep1-1080p-silent.mp4 --crf=12 --pixel-format=yuv420p --concurrency=4
import type {FrameDef} from '../shared/frame-def';
import {INTRO_FRAMES, FPS} from '../shared/timing';
import {IntroEp1} from './IntroEp1';

export const frames: FrameDef[] = [{id: 'intro-ep1', component: IntroEp1, durationInFrames: INTRO_FRAMES, fps: FPS, width: 1920, height: 1080}];
