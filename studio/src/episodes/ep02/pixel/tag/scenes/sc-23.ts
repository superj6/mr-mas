// MR. MAS — Ep2 v1 · tag · scene 23: 9 shot(s), 888 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-tag.json:
//   23.01 (110 f, OTS · his back as he sits at the desk; t) · 23.02 (104 f, ECU · its pages lose their exclamation
//   p) · 23.03 (100 f, POV · the candidate's post in its own UI) · 23.04 (164 f, 2S → TERMINAL · the Orb floats to
//   the mo) · 23.05 (71 f, OTS · Mas at the monitor, the toast clea) · 23.06 (111 f, POV · Aug 21: a TV interview in
//   its own ) · 23.07 (142 f, POV · the player's chrome clears: on THE) · 23.08 (38 f, POV · the hook: the string
//   goes taut) · 23.09 (48 f, MCU · Mas at his monitor, its glow on hi)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "23", layouts: L.all});
