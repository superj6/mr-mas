// SATIRE structure deliverable frames (latex-puppet caricature, TV puppet-studio staging). Builder: satire.
// Dev entry: src/dev/satire/entry.tsx
import React from 'react';
import type {FrameDef} from '../shared/frame-def';
import {SatireFrame, SatireScene} from '../dev/satire/SatireScene';
import {Lineup} from '../dev/satire/Lineup';

const Key: React.FC = () => <SatireFrame t={74} />;
const Closeup: React.FC = () => <SatireFrame t={106} />;
const Button: React.FC = () => <SatireFrame t={116} />;

export const frames: FrameDef[] = [
  {id: 'satire-scene', component: SatireScene, durationInFrames: 120, fps: 24},
  {id: 'satire-key', component: Key},
  {id: 'satire-extra-closeup', component: Closeup},
  {id: 'satire-extra-button', component: Button},
  {id: 'satire-extra-lineup', component: Lineup},
];
