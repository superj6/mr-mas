// ANIME SCENE structure (builder key: animescene, output key: anime). The 5 s test beat as prestige TV anime.
import React from 'react';
import type {FrameDef} from '../shared/frame-def';
import {AnimeScene} from '../shared/anime/scene/Scene';

const Key: React.FC = () => <AnimeScene frame={74} />;

export const frames: FrameDef[] = [
  {id: 'anime-scene', component: AnimeScene, durationInFrames: 120, fps: 24},
  {id: 'anime-key', component: Key},
];
