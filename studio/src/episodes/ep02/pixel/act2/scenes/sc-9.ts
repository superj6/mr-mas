// MR. MAS — Ep2 v1 · act2 · scene 9: 6 shot(s), 1224 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act2.json:
//   9.01 (191 f, WIDE · the wings in work light: road cas) · 9.02 (189 f, MEDIUM · the ENGINEER rehearsing to her )
//   · 9.03 (113 f, SCR · the monitor's transcript drops a [) · 9.04 (318 f, 2S · Mas, screen-left, and RIMA, the
//   win) · 9.05 (248 f, WIDE · Mas walks off frame-left; a pan w) · 9.06 (165 f, SCR · the monitor: the VOICE panel,
//   five)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   9.01: Wings are stage right (screen-left from the house): Mas keeps the left third.
//   9.02: The product answers before it's asked (the season's hint).
//   9.03: The tag is THE PLAN's plant (it lies at the bottom of the grate).
//   9.05: A walk-and-talk.
//   9.06: VOICE 5 is CHATGTP's own voice (R1): the voice we'll hear on stage. A [SCR] with its bezel in frame, so
//     the bezel can be broken.
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "9", layouts: L.all});
