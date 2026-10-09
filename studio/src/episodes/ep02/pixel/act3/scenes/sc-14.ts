// MR. MAS — Ep2 v1 · act3 · scene 14: 12 shot(s), 1416 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act3.json:
//   14.01 (67 f, WIDE · the spread: tiled staff, glass wa) · 14.02 (120 f, WIDE · the spread: Look at heatsink; Pic)
//   · 14.03 (120 f, WIDE → MCU · Talk to reflection: Mas's o) · 14.04 (125 f, MCU · his own reflection mouthing can
//   we) · 14.05 (87 f, WIDE · from her ladder, DOT's orange cuf) · 14.06 (100 f, WIDE · Alyi's door: Open greyed,
//   bonk; t) · 14.07 (119 f, WIDE → 2S · beside the door, Alyi's old ) · 14.08 (218 f, 2S · Mas, screen-left; BUKAJ
//   seated, scr) · 14.09 (82 f, WIDE · EKIEL walks out with a box past o) · 14.10 (144 f, HIGH · the floor: his
//   resignation thread) · 14.11 (124 f, WIDE → ECU · down the corridor beside Ek) · 14.12 (110 f, WIDE · back at
//   Alyi's door: Pivot door; )
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   14.01: No image of Alyi in any surface (FC). The band is the episode's one dialogue tree; his choices are his
//     phone's strip, never a cursor (P6).
//   14.02: The adventure game's refusal, in the game's register.
//   14.03: The strip is the machine's read of him, never his mind. The greyed option is exactly the 1993 Cancel.
//   14.04: The Door blooms once, first note missing.
//   14.05: Her hands only.
//   14.06: At the spread's scale: no insert, no tag, no Mas colour (FC). Never defined.
//   14.07: The chosen strip line is voiced in his own voice as the box types it (voiced adventure games do this;
//     P9).
//   14.08: The typed lines stay in the band, voiced as they type; Bukaj's answers in the two-shot.
//   14.09: No shiny-product pedestals (FC).
//   14.10: One domino (R2). His own words: the thread's first post, which states the departure and carries no
//     grievance (script review).
//   14.11: The team's own door, never Alyi's (R2).
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "14", layouts: L.all});
