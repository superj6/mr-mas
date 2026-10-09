// MR. MAS — Ep2 v1 · act2 · scene 12: 8 shot(s), 960 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act2.json:
//   12.01 (157 f, WIDE · the stage as the house lights com) · 12.02 (81 f, WIDE · the front row from the wings, in )
//   · 12.03 (82 f, ECU · the chrome armrest: Ep1's Sep 25 p) · 12.04 (24 f, BLACK · a beat) · 12.05 (144 f, MCU ·
//   Mas at his desk, the monitor besid) · 12.06 (158 f, ECU · his phone lights: Alyi's post, in ) · 12.07 (247 f,
//   ECU · he types his own post at a post's ) · 12.08 (67 f, MCU · his face, held 2–3 s; the cue stop)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "12", layouts: L.all});
