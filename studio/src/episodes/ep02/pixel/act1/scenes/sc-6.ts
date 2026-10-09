// MR. MAS — Ep2 v1 · act1 · scene 6: 11 shot(s), 1944 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   6.01 (218 f, 2S · the locked meter frame inside the p) · 6.02 (82 f, 2S · the meter frame: XEL waits; the mic) ·
//   6.03 (275 f, 2S · the meter frame: Mas answers; the m) · 6.04 (172 f, 2S · the meter frame: XEL lets it sit; h)
//   · 6.05 (219 f, 2S · the meter frame: the "no." ladder, ) · 6.06 (257 f, 2S · the meter frame: XEL pauses; hop 3
//   ) · 6.07 (385 f, MCU · MAS against the curtain (the one c) · 6.08 (110 f, 2S · back to the meter frame: the mic
//   ha) · 6.09 (43 f, INSERT · the player's chrome: the counte) · 6.10 (132 f, 2S · off the record: XEL leans toward
//   th) · 6.11 (51 f, 2S → MATCH · the curtain parts, and in t)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "6", layouts: L.all});
