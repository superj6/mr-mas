import React from 'react';
import {Composition, Still} from 'remotion';
import './theme/fonts';
import type {FrameDef} from './frame-def';

/** Build a Remotion Root from a list of frame definitions (used by src/Root.tsx and per-asset dev entries). */
export const makeRoot = (defs: FrameDef[]): React.FC => {
  const sorted = [...defs].sort((a, b) => a.id.localeCompare(b.id));
  const R: React.FC = () => (
    <>
      {sorted.map((d) =>
        d.durationInFrames && d.durationInFrames > 1 ? (
          <Composition key={d.id} id={d.id} component={d.component} width={d.width ?? 1920} height={d.height ?? 1080} fps={d.fps ?? 24} durationInFrames={d.durationInFrames} defaultProps={d.props ?? {}} />
        ) : (
          <Still key={d.id} id={d.id} component={d.component} width={d.width ?? 1920} height={d.height ?? 1080} defaultProps={d.props ?? {}} />
        ),
      )}
    </>
  );
  return R;
};
