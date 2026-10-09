// MR. MAS — Ep2 v1 · act3 · scene 17: 21 shot(s), 3144 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act3.json:
//   17.01 (106 f, WIDE · NopeAI's front doors at the top o) · 17.02 (158 f, WIDE · one quick run: down the hill and
//   ) · 17.03 (91 f, WIDE · across the lanes: the Forecaster ) · 17.04 (367 f, LOW · a pen on a bank chain rises out
//   of) · 17.05 (100 f, MEDIUM · a DRIVER parked on the receipt ) · 17.06 (140 f, WIDE · across the lanes: the
//   Forecaster ) · 17.07 (111 f, WIDE · mid-span on the receipt: Mas sees) · 17.08 (115 f, ECU · the scramble on his
//   phone: staff s) · 17.09 (156 f, MCU · his face, locked (where we hear hi) · 17.10 (110 f, ECU · a draft opened,
//   typed, deleted, ty) · 17.11 (103 f, MCU · his still face; the receipt still ) · 17.12 (242 f, MCU · the
//   Forecaster, having crossed the) · 17.13 (120 f, ECU · Mas's thumb hovers over Post; he d) · 17.14 (48 f, WIDE ·
//   the night, one held shot: the bri) · 17.15 (285 f, WIDE · the next afternoon: Mas posts; th) · 17.16 (141 f,
//   MEDIUM · the honking driver leans out; t) · 17.17 (240 f, WIDE · May 20, a new day on the bridge, ) · 17.18 (165
//   f, WIDE · it rains letterhead; the receipt') · 17.19 (106 f, POV · his rain-beaded phone: the voice m) · 17.20
//   (130 f, ECU · beside it, his company's post pops) · 17.21 (110 f, WIDE · the blimp sags, its running light)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "17", layouts: L.all});
