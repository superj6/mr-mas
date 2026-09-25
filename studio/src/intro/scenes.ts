// MR. MAS — intro-ep1: every moment as a PixelScene definition on its OWN local clock (pure, no React), so the same
// objects drive the Remotion composition and the integrator's Node probes. Each is exactly what that moment's own
// component mounts (ColdOpen.tsx, Meras.tsx, Mdinner1.tsx, Mdinner2.tsx, Rollcall.tsx, MFinale.tsx), plus the QC pass.
// If a moment's component ever adds more than <PixelScene {...scene}/>, mirror it here.
import type {PixelSceneProps} from '../shared/pixel/compose';
import type {Buf} from '../shared/pixel/px';
import {PAL} from '../shared/pixel/palette';
import {coldOpen} from '../dev/mcoldopen/scene';
import {SPAN} from '../dev/mcoldopen/timeline';
import {merasScene} from '../dev/meras/scene';
import {SCENE as MD1_SCENE} from '../dev/mdinner1/scene';
import {SCENE as MD2_SCENE} from '../dev/mdinner2/scene';
import {drawRollcall} from '../dev/mrollcall/scene';
import {toGlobal as rcGlobal} from '../dev/mrollcall/timeline';
import {localScene} from '../dev/mfinale/scene';
import {MF_START} from '../dev/mfinale/timeline';
import type {MomentId} from './edl';
import {qcScene} from './qc';

export type Scene = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch' | 'bg'>;

/** local clock: frame 0 = the edit's `origin` (edl.ts) */
export const SCENES: Record<MomentId, Scene> = {
  mcoldopen: qcScene(coldOpen), // ColdOpen renders hold = toGlobal(local) = local + SPAN.from; SPAN.from is 0 (asserted below)
  meras: qcScene(merasScene), // merasDraw adds MERAS_START itself
  mdinner1: qcScene(MD1_SCENE), // SCENE converts local -> global itself
  mdinner2: qcScene(MD2_SCENE),
  mrollcall: qcScene({draw: (fb: Buf, f: number) => drawRollcall(fb, rcGlobal(f))}),
  mfinale: qcScene({...localScene(MF_START), bg: PAL.N0}),
};

if (SPAN.from !== 0) throw new Error('mcoldopen SPAN.from moved: SCENES.mcoldopen must add the offset');
