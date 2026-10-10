// MR. MAS — Ep2's intro composition (not a *.frame.tsx: it stays out of src/Root.tsx; its own entry registers it).
import type {FrameDef} from '../../../shared/frame-def';
import {INTRO_FRAMES, FPS} from '../../../shared/timing';
import {IntroEp2} from './IntroEp2';

export const frames: FrameDef[] = [{id: 'intro-ep2', component: IntroEp2, durationInFrames: INTRO_FRAMES, fps: FPS, width: 1920, height: 1080}];
