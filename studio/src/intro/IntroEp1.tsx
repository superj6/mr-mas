// MR. MAS — intro-ep1: the full 30.0 s opening (720 frames, 1920x1080, 24 fps), pixel edition.
// Mounts every moment at its global frames per the EDL (edl.ts). Each moment keeps its own clock: its local frame 0
// is `origin`; it is on screen from `from` to `to`. A later `from` than `origin` trims the head of the moment (nested
// Sequence with a negative offset), so an overlap can be cut anywhere without touching the moment's code.
// Each moment is its own <PixelScene> (scenes.ts: the same scene objects the moments' components mount, plus QC).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {PixelScene} from '../shared/pixel/PixelScene';
import {EDL, Edit, MomentId} from './edl';
import {SCENES, Scene} from './scenes';

/** One edit: visible [from, to], running on the moment's own clock (local 0 = origin). `scenes`: the episode's moments
 *  (scenes.ts scenesFor(slot)); Ep1's when omitted. */
export const EditMount: React.FC<{e: Edit; scenes?: Record<MomentId, Scene>}> = ({e, scenes = SCENES}) => (
  <Sequence from={e.from} durationInFrames={e.to - e.from + 1} name={`${e.id} f${e.from}-${e.to}`}>
    <Sequence from={e.origin - e.from} name={`${e.id} clock (local 0 = f${e.origin})`} layout="absolute-fill">
      <PixelScene {...scenes[e.id]} />
    </Sequence>
  </Sequence>
);

/** The whole intro cut from one episode's moments (the EDL is every episode's). */
export const IntroCut: React.FC<{scenes: Record<MomentId, Scene>}> = ({scenes}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {EDL.map((e) => (
      <EditMount key={e.id} e={e} scenes={scenes} />
    ))}
  </AbsoluteFill>
);

export const IntroEp1: React.FC = () => <IntroCut scenes={SCENES} />;
