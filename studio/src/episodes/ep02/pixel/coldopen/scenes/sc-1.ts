// MR. MAS — Ep2 v1 · coldopen · scene 1: 13 shot(s), 1320 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-coldopen.json:
//   1.01 (72 f, WIDE · the lobby master: the wall screen) · 1.02 (175 f, MEDIUM · SELBEEP under the screen, the r) ·
//   1.03 (65 f, WIDE · the step-out: the mammoth turns p) · 1.04 (168 f, MEDIUM · SELBEEP; the lobby chair beside) ·
//   1.05 (90 f, MEDIUM · SELBEEP beside the melted chair) · 1.06 (98 f, WIDE · the lobby master, two weeks on: D) ·
//   1.07 (131 f, WIDE · the master; Selbeep O.S.; a staff) · 1.08 (91 f, OTS-WIDE · over Gerg's laptop; Gerg does) ·
//   1.09 (120 f, OTS-WIDE · over Mas's shoulder straight ) · 1.10 (67 f, ECU · page one; the table of contents) ·
//   1.11 (62 f, WIDE · the complaint tips off the truck ) · 1.12 (126 f, LOW · the sign from below, DOT holding o) ·
//   1.13 (55 f, ECU · the flyer's doorway photo on the c)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   1.01: The 2.A leap: near-photoreal inside the bezel only (objects only: the animal, the meadow; nothing human).
//     The votives tick on eighths. Mas small at the back, left third; the doors far right (the axis).
//   1.02: An internal preview: the beanbags are his audience. The foot crosses the bezel on the word.
//   1.03: The AI tell is on the animal (a fifth leg, 2 frames), never on a person (style-range H2). The OTS over
//     Gerg keeps Selbeep and the mammoth beyond him.
//   1.04: The chair melts in three held palette-drip steps under "It understands physics." Mas's glance is one pixel
//     of eye.
//   1.05: Comedy cuts on the joke. The card is the topper.
//   1.06: DOT's face is never shown (Ep5); nobody names her. The first THUD is outside the building (R1): the hand
//     truck on the front steps.
//   1.07: The coffee jumps, Mas's water doesn't (the glass is a prop only, R1: no beat hangs on it).
//   1.08: His keys under the line; the doors glint far right.
//   1.09: One shot for the whole arrival. The room layer shakes 2 px; the UI never shakes. Mas's silhouette never
//     moves. The PAUSE sign is a group sign only: no date, group or grievance (PP2.1).
//   1.10: Read time for the contents: three short lines.
//   1.11: The first of the knee's four notes lands on the THUD.
//   1.12: Aftermath: the complaint at his feet, the flyer on it, the head shake, the second sign (P3).
//   1.13: The doorway → the intro's first frame (the intro's own imagery isn't repeated here).
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "1", layouts: L.all});
