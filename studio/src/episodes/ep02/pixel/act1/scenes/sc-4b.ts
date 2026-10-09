// MR. MAS — Ep2 v1 · act1 · scene 4B: 1 shot(s), 192 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   4B.01 (192 f, ECU · the calendar card on his phone (th)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "4B", layouts: L.all});
