import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {ComicPage} from '../shared/comic/Page';
import {SCENE_FRAMES, Cam} from '../shared/comic/script';

/**
 * NOIR GRAPHIC-NOVEL MOTION COMIC structure (builder key: comic).
 * The beat is one printed album page: 7 panels, hand-lettered balloons + SFX, black + cyan + red plates
 * screened into real halftone, and a guided-view camera that travels panel to panel.
 */
const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return <ComicPage frame={f} />;
};
const At: React.FC<{frame: number; cam?: Cam; all?: boolean}> = ({frame, cam, all}) => <ComicPage frame={frame} cam={cam} all={all} />;

export const frames: FrameDef[] = [
  {id: 'comic-scene', component: Scene, durationInFrames: SCENE_FRAMES, fps: 24},
  {id: 'comic-key', component: At, props: {frame: 70}},
];
