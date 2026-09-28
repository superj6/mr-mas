// MR. MAS — Ep1 full-v3, v3-art-a (cold open + Act One): the stills registry, in script order. Each demos/*.ts file
// registers its assets' states with D() (registry.ts); tools/sheet.ts renders them.
import './demos/coldopen';
import './demos/act1-launch';
import './demos/act1-drill';
import './demos/act1-elgoog';
import './demos/act1-lobby';
import './demos/act1-duel';
import './demos/act1-pause';
// v3.1 round (script draft 7): the new beats and opt-in states
import './demos/v31-sydney';
import './demos/v31-laptop';
import './demos/v31-pause';
import './demos/v31-launch';
// v3.2 round (script draft 8.1)
import './demos/v32-act1';
export {DEMOS} from './registry';
export type {AssetDemo} from './registry';
