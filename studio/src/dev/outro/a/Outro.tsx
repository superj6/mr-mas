// MR. MAS — outro A (lookdev): Remotion hosts. The mock-up (stand-in + outro, composition frame = PRE + o) and the
// per-episode variant stills. Everything is drawn by the shared pixel engine at 480x270 and presented at 4x.
import React from 'react';
import {PixelScene} from '../../../shared/pixel/PixelScene';
import {outroScene} from './scene';
import {variantScene, VariantId} from './skins';

const EP1_SCENE = outroScene();

/** the Ep1 mock-up; `hold` pins a composition frame (stills) */
export const OutroA: React.FC<{hold?: number}> = ({hold}) => <PixelScene {...EP1_SCENE} hold={hold} />;

const VARIANTS = new Map<VariantId, ReturnType<typeof variantScene>>();
/** a variant still: Ep6's BASE UI skin, or Ep10's machine-typed pane / its keyboard insert */
export const OutroAVariant: React.FC<{which: VariantId}> = ({which}) => {
  let s = VARIANTS.get(which);
  if (!s) { s = variantScene(which); VARIANTS.set(which, s); }
  return <PixelScene {...s} hold={0} />;
};
