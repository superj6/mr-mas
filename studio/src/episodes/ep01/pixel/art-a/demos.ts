// MR. MAS — Ep1 full-v3, v3-art-a (cold open + Act One): the stills registry, in script order. Each demos/*.ts file
// registers its assets' states with D() (registry.ts); tools/sheet.ts renders them.
import './demos/coldopen';
import './demos/act1-launch';
import './demos/act1-drill';
import './demos/act1-elgoog';
import './demos/act1-lobby';
import './demos/act1-duel';
import './demos/act1-pause';
export {DEMOS} from './registry';
export type {AssetDemo} from './registry';
