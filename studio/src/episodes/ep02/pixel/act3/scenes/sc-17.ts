// MR. MAS — Ep2 v1 · act3 · scene 17: 21 shot(s), 3120 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act3.json:
//   17.01 (106 f, WIDE · NopeAI's front doors at the top o) · 17.02 (158 f, WIDE · one quick run: down the hill and
//   ) · 17.03 (91 f, WIDE · across the lanes: the Forecaster ) · 17.04 (351 f, LOW · a pen on a bank chain rises out
//   of) · 17.05 (77 f, MEDIUM · a DRIVER parked on the receipt ) · 17.06 (142 f, WIDE · across the lanes: the
//   Forecaster ) · 17.07 (112 f, WIDE · mid-span on the receipt: Mas sees) · 17.08 (115 f, ECU · the scramble on his
//   phone: staff s) · 17.09 (157 f, MCU · his face, locked (where we hear hi) · 17.10 (110 f, ECU · a draft opened,
//   typed, deleted, ty) · 17.11 (110 f, MCU · his still face; the receipt still ) · 17.12 (243 f, MCU · the
//   Forecaster, having crossed the) · 17.13 (120 f, ECU · Mas's thumb hovers over Post; he d) · 17.14 (48 f, WIDE ·
//   the night, one held shot: the bri) · 17.15 (285 f, WIDE · the next afternoon: Mas posts; th) · 17.16 (141 f,
//   MEDIUM · the honking driver leans out; t) · 17.17 (240 f, WIDE · May 20, a new day on the bridge, ) · 17.18 (168
//   f, WIDE · it rains letterhead; the receipt') · 17.19 (106 f, POV · his rain-beaded phone: the voice m) · 17.20
//   (130 f, ECU · beside it, his company's post pops) · 17.21 (110 f, WIDE · the blimp sags, its running light)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   17.01: The papers start at NopeAI's doors, never near Alyi (FC). He comes from the street, not out of the
//     building: he had already left (his refusal was in April; facts A32).
//   17.02: Egg at the very bottom: the coupon.
//   17.03: The stakes land before the pen does.
//   17.04: Mas is outside the refusal (R1), small in the foreground. The pen comes from the receipt, never from
//     Mas's hand.
//   17.06: Word for word (keep list).
//   17.08: Hands fast; the LEGAL tile a grey icon, never named.
//   17.09: The one time he hurries.
//   17.10: No legible word and no voice over it (R2: nothing at contested item 3).
//   17.11: W4's grammar: the face still, the inside fast. The V.O. is the fix's items, his rattled tell (MIV §3),
//     nothing about what he knew (W8); it plays on his face, never over the draft.
//   17.14: Palette cycle, no strobe.
//   17.15: Posts are pop-ups, never speeches. His real lowercase.
//   17.16: Mas answers nobody: at a real event his surface stays blank.
//   17.17: Thunder at most 3 flashes per 24 frames, every pop at or under 80% white (P15). One 4-bar phrase.
//   17.18: The letterhead is blank: the actress is never drawn, voiced or named.
//   17.19: No bonk, no notification here.
//   17.20: Two fragments, cropped before the voice's name; no name appears. The post claims nothing about how the
//     voice was made (facts §F) and answers no one.
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "17", layouts: L.all});
