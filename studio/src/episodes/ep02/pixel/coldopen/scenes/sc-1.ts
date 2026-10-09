// MR. MAS — Ep2 v1 · coldopen · scene 1: 13 shot(s), 1344 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-coldopen.json:
//   1.01 (72 f, WIDE · the lobby master: the wall screen) · 1.02 (175 f, MEDIUM · SELBEEP under the screen, the r) ·
//   1.03 (66 f, WIDE · the step-out: the mammoth turns p) · 1.04 (168 f, MEDIUM · SELBEEP; the lobby chair beside) ·
//   1.05 (92 f, MEDIUM · SELBEEP beside the melted chair) · 1.06 (100 f, WIDE · the lobby master, two weeks on: D) ·
//   1.07 (144 f, WIDE · the master; Selbeep O.S.; a staff) · 1.08 (92 f, OTS-WIDE · over Gerg's laptop; Gerg does) ·
//   1.09 (122 f, OTS-WIDE · over Mas's shoulder straight ) · 1.10 (67 f, ECU · page one; the table of contents) ·
//   1.11 (63 f, WIDE · the complaint tips off the truck ) · 1.12 (128 f, LOW · the sign from below, DOT holding o) ·
//   1.13 (55 f, ECU · the flyer's doorway photo on the c)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "1", layouts: L.all});
