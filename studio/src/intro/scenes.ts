// MR. MAS — intro-ep1: every moment as a PixelScene definition on its OWN local clock (pure, no React), so the same
// objects drive the Remotion composition and the integrator's Node probes. Each is exactly what that moment's own
// component mounts (ColdOpen.tsx, Meras.tsx, Mdinner1.tsx, Mdinner2.tsx, Rollcall.tsx, MFinale.tsx), plus the QC pass.
// If a moment's component ever adds more than <PixelScene {...scene}/>, mirror it here.
import type {PixelSceneProps} from '../shared/pixel/compose';
import type {Buf} from '../shared/pixel/px';
import {PAL} from '../shared/pixel/palette';
import {makeColdOpen} from '../dev/mcoldopen/scene';
import {SPAN} from '../dev/mcoldopen/timeline';
import {merasScene} from '../dev/meras/scene';
import {makeScene as makeMd1Scene} from '../dev/mdinner1/scene';
import {SCENE as MD2_SCENE} from '../dev/mdinner2/scene';
import {drawRollcall} from '../dev/mrollcall/scene';
import {toGlobal as rcGlobal} from '../dev/mrollcall/timeline';
import {localScene} from '../dev/mfinale/scene';
import {MF_START} from '../dev/mfinale/timeline';
import type {MomentId} from './edl';
import {qcScene} from './qc';
import {EP1_SLOT} from './slot';
import type {IntroSlot} from './slot';

export type Scene = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch' | 'bg'>;

/** The moments for an episode's slot (slot.ts: the five per-episode changes, SCRIPT §8). Local clock: frame 0 = the
 *  edit's `origin` (edl.ts). The slot reaches the cold open (the line, the dot), the dinner (the keycap) and the finale
 *  (the subtitle, and the bookend's replay of the cold open); 1993-2014, the vault and the roll call carry no Ep2 change. */
export const scenesFor = (slot: IntroSlot): Record<MomentId, Scene> => ({
  mcoldopen: qcScene(makeColdOpen(slot.cold)), // ColdOpen renders hold = toGlobal(local) = local + SPAN.from; SPAN.from is 0 (asserted below)
  meras: qcScene(merasScene), // merasDraw adds MERAS_START itself
  mdinner1: qcScene(makeMd1Scene(slot.keycap.legend)), // the scene converts local -> global itself
  mdinner2: qcScene(MD2_SCENE),
  mrollcall: qcScene({draw: (fb: Buf, f: number) => drawRollcall(fb, rcGlobal(f))}),
  mfinale: qcScene({...localScene(MF_START, {cold: slot.cold, subtitle: slot.subtitle}), bg: PAL.N0}),
});
/** Ep1's (intro-ep1) */
export const SCENES: Record<MomentId, Scene> = scenesFor(EP1_SLOT);

if (SPAN.from !== 0) throw new Error('mcoldopen SPAN.from moved: SCENES.mcoldopen must add the offset');
