// MR. MAS — Ep2 v1 · act4 · scene 22: 9 shot(s), 912 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act4.json:
//   22.01 (179 f, WIDE · white, room tone only; the pin fa) · 22.02 (157 f, WIDE · Mas (pixel) walks up from
//   frame-l) · 22.03 (96 f, WIDE · the band lights for four seconds:) · 22.04 (110 f, MCU · over his shoulder at the
//   slot: he ) · 22.05 (87 f, INSERT · the glimpse: the slot's gap fil) · 22.06 (29 f, ECU · the flap swings shut on
//   its spring) · 22.07 (62 f, MCU · Mas at the shut flap) · 22.08 (77 f, MEDIUM · the door and his raised hand in)
//   · 22.09 (115 f, WIDE · he turns and walks away the way h)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "22", layouts: L.all});
