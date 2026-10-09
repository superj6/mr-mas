// MR. MAS — Ep2 v1 · act3 · scene 13: 6 shot(s), 744 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act3.json:
//   13.01 (205 f, OTS-WIDE · over Mas's shoulder at his pi) · 13.02 (105 f, OTS-WIDE · the first staffer turns to
//   Ma) · 13.03 (153 f, ECU → MCU · a fallen flyer; Mas picks it) · 13.04 (106 f, SCR → FULL FRAME · the lobby TV
//   framed i) · 13.05 (97 f, SCR · the TV: a reporter's question; an ) · 13.06 (78 f, WIDE · the lobby master: Mas
//   walks off f)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "13", layouts: L.all});
