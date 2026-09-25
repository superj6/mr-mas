// MR. MAS — ep01 act 4 · rooms B: Remotion frames (stills of every room state + three motion tests).
// Render (from studio/):
//   npx remotion still  src/episodes/ep01/act4/rooms-b/entry.tsx <id> ../out/ep01/act4/assets/rooms-b/<id>.png --bundle-cache=false --log=error
//   npx remotion render src/episodes/ep01/act4/rooms-b/entry.tsx rb-motion-lighthouse ../out/ep01/act4/assets/rooms-b/rb-motion-lighthouse.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
import React from 'react';
import type {FrameDef} from '../../../../shared/frame-def';
import {PixelScene} from '../../../../shared/pixel';
import {SCENES, MOTION, PreviewScene} from './scenes';

const Scene: React.FC<{id: string; frame?: number}> = ({id, frame}) => {
  const s = [...SCENES, ...MOTION].find((q) => q.id === id) as PreviewScene;
  return <PixelScene draw={(fb, f) => s.draw(fb, f)} hold={frame} />;
};

export const frames: FrameDef[] = [
  ...SCENES.map((s) => ({id: s.id, component: Scene, props: {id: s.id, frame: 0}})),
  ...MOTION.map((s) => ({id: s.id, component: Scene, props: {id: s.id}, durationInFrames: s.frames ?? 48, fps: 24})),
];
