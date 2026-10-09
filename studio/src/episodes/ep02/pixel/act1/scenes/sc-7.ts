// MR. MAS — Ep2 v1 · act1 · scene 7: 8 shot(s), 1152 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   7.01 (150 f, WIDE · the cathedral splits open like a ) · 7.02 (147 f, 2S · the basement: THE HUMANIST with his)
//   · 7.03 (204 f, 2S · the same: Tasya's welcome) · 7.04 (208 f, 2S · the same: the team, the room; Tasya) · 7.05
//   (126 f, ECU · the key ring: a key twisted off; a) · 7.06 (61 f, 2S · the Humanist, looking up where Tasy) · 7.07
//   (121 f, WIDE · Tasya's glance, and a whole-pixel) · 7.08 (135 f, MCU · Mas at his monitor four floors up )
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "7", layouts: L.all});
