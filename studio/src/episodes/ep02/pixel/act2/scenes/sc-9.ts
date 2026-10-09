// MR. MAS — Ep2 v1 · act2 · scene 9: 6 shot(s), 1248 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act2.json:
//   9.01 (199 f, WIDE · the wings in work light: road cas) · 9.02 (197 f, MEDIUM · the ENGINEER rehearsing to her )
//   · 9.03 (115 f, SCR · the monitor's transcript drops a [) · 9.04 (320 f, 2S · Mas, screen-left, and RIMA, the
//   win) · 9.05 (250 f, WIDE · Mas walks off frame-left; a pan w) · 9.06 (167 f, SCR · the monitor: the VOICE panel,
//   five)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "9", layouts: L.all});
