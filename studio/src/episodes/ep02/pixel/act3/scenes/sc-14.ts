// MR. MAS — Ep2 v1 · act3 · scene 14: 12 shot(s), 1416 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act3.json:
//   14.01 (67 f, WIDE · the spread: tiled staff, glass wa) · 14.02 (120 f, WIDE · the spread: Look at heatsink; Pic)
//   · 14.03 (120 f, WIDE → MCU · Talk to reflection: Mas's o) · 14.04 (125 f, MCU · his own reflection mouthing can
//   we) · 14.05 (87 f, WIDE · from her ladder, DOT's orange cuf) · 14.06 (100 f, WIDE · Alyi's door: Open greyed,
//   bonk; t) · 14.07 (119 f, WIDE → 2S · beside the door, Alyi's old ) · 14.08 (218 f, 2S · Mas, screen-left; BUKAJ
//   seated, scr) · 14.09 (82 f, WIDE · EKIEL walks out with a box past o) · 14.10 (144 f, HIGH · the floor: his
//   resignation thread) · 14.11 (124 f, WIDE → ECU · down the corridor beside Ek) · 14.12 (110 f, WIDE · back at
//   Alyi's door: Pivot door; )
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "14", layouts: L.all});
