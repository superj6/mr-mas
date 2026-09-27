// MR. MAS — Ep1 full-v3, v3-art-a: the stills registry's type and its one `D()` (the demos/*.ts files register into it).
// A demo paints the 480 x 203 room area of a native frame the way a v3 shot would use the asset, so the sheet shows it
// in its framing, not on a blank. These are previews, not the v3 shot layouts: the P2 passes own the shots
// (`studio/src/episodes/ep01/pixel/<seg>/shots.ts`). Keys are `ID@state`; ids are the table's in
// show/episodes/ep01/production/full-v3/art/art-a.md.
import type {Buf} from '../../../../shared/pixel/px';

export interface AssetDemo {
  id: string;
  state?: string;
  /** the module the asset lives in (repo-relative from studio/src) */
  module: string;
  note?: string;
  /** what in this still is still a stand-in (empty = none) */
  standin?: string;
  draw: (fb: Buf) => void;
}
export const DEMOS: AssetDemo[] = [];
export const D = (d: AssetDemo) => { DEMOS.push(d); };
