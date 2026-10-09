// MR. MAS — Ep2 v1 · act2 · scene 10: 7 shot(s), 1104 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act2.json:
//   10.01 (155 f, GFX · the full sheet: the stamp OMNI) · 10.02 (232 f, GFX · section, a pan from BEFORE to NOW,) ·
//   10.03 (157 f, GFX · NOW: an ear, an eye and a mouth wi) · 10.04 (117 f, GFX · a pan down the three steps: step
//   1) · 10.05 (142 f, GFX · step 2 (MON, a tiny RADNUS on the ) · 10.06 (130 f, GFX · the full sheet again: the
//   tiny sta) · 10.07 (171 f, GFX · the break: an empty speech bubble )
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   10.01: The linework draws itself on her words.
//   10.02: Every move follows one of her sentences.
//   10.05: Nobody on the paper mentions Radnus, and neither does she.
//   10.07: The tear's light, a beat, before the stage.
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "10", layouts: L.all});
