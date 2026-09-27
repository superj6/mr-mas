// Dev entry for the J1 v5 port's preview (prep-artbuild-r3). Registers ONLY 'ep01-act4-j1-v5-preview' (it is not a
// *.frame.tsx, so src/Root.tsx does not auto-register it). Run from studio/:
//   npx remotion still  src/episodes/ep01/act4/art-v5/j1/entry.tsx ep01-act4-j1-v5-preview <out.png> --frame=50 --log=error
//   npx remotion render src/episodes/ep01/act4/art-v5/j1/entry.tsx ep01-act4-j1-v5-preview <out.mp4> --concurrency=4 --log=error
// It builds its Root directly (no src/dev/makeRoot import: shipped Act Four code must not add src/dev/ imports).
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import '../../../../../shared/theme/fonts';
import {J1Preview, PREVIEW_LEN} from './J1Preview';

const Root: React.FC = () => (
  <Composition id="ep01-act4-j1-v5-preview" component={J1Preview} width={1920} height={1080} fps={24} durationInFrames={PREVIEW_LEN} defaultProps={{}} />
);
registerRoot(Root);
