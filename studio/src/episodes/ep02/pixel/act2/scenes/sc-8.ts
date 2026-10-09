// MR. MAS — Ep2 v1 · act2 · scene 8: 7 shot(s), 1056 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act2.json:
//   8.01 (194 f, OTS · over Mas's shoulder in the dark, g) · 8.02 (124 f, POV · the monitor scrolls to a news site)
//   · 8.03 (186 f, OTS · Mas at the monitor, the lineup on ) · 8.04 (111 f, POV · his calendar: Elgoog's keynote
//   alr) · 8.05 (76 f, MCU · Mas, the lit Monday square in his ) · 8.06 (236 f, ECU · his phone face up: a call tile
//   ELP) · 8.07 (129 f, POV · an invite drops into his calendar )
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "8", layouts: L.all});
