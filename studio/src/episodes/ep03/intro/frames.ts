// MR. MAS — Ep3's intro composition (not a *.frame.tsx: it stays out of src/Root.tsx; its own entry registers it).
import type {FrameDef} from '../../../shared/frame-def';
import {INTRO_FRAMES, FPS} from '../../../shared/timing';
import {IntroEp3} from './IntroEp3';

export const frames: FrameDef[] = [{id: 'intro-ep3', component: IntroEp3, durationInFrames: INTRO_FRAMES, fps: FPS, width: 1920, height: 1080}];
