// Bake jobs (builder key: realism).
import type {V, View} from '../../../shared/realism/sculpt/sdf';
import {masSkin, masHair} from '../../../shared/realism/sculpt/mas';
import {MAS_BOX, MAS_PPC, MAS_VIEWS, L_MONITOR, L_DOOR, Box} from '../../../shared/realism/sculpt/views';

export interface Job {
  name: string;
  vis: (p: V) => number;
  all: (p: V) => number;
  view: View;
  box: Box;
  ppc: number;
  key: V;
  rim: V;
  keySoft?: number;
  rimSoft?: number;
}

const masAll = (p: V) => Math.min(masSkin(p), masHair(p));

export const JOBS: Job[] = [];
for (const k of ['A', 'M', 'B'] as const) {
  JOBS.push({name: `mas${k}_skin`, vis: masSkin, all: masAll, view: MAS_VIEWS[k], box: MAS_BOX, ppc: MAS_PPC, key: L_MONITOR, rim: L_DOOR});
  JOBS.push({name: `mas${k}_hair`, vis: masHair, all: masAll, view: MAS_VIEWS[k], box: MAS_BOX, ppc: MAS_PPC, key: L_MONITOR, rim: L_DOOR});
}
