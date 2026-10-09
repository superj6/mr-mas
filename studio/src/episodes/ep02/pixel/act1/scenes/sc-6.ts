// MR. MAS — Ep2 v1 · act1 · scene 6: 11 shot(s), 1944 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   6.01 (218 f, 2S · the locked meter frame inside the p) · 6.02 (82 f, 2S · the meter frame: XEL waits; the mic) ·
//   6.03 (275 f, 2S · the meter frame: Mas answers; the m) · 6.04 (172 f, 2S · the meter frame: XEL lets it sit; h)
//   · 6.05 (219 f, 2S · the meter frame: the "no." ladder, ) · 6.06 (257 f, 2S · the meter frame: XEL pauses; hop 3
//   ) · 6.07 (385 f, MCU · MAS against the curtain (the one c) · 6.08 (110 f, 2S · back to the meter frame: the mic
//   ha) · 6.09 (43 f, INSERT · the player's chrome: the counte) · 6.10 (132 f, 2S · off the record: XEL leans toward
//   th) · 6.11 (51 f, 2S → MATCH · the curtain parts, and in t)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   6.01: The locked meter frame: every hop plays in it, against the same curtain and chairs.
//   6.02: The card on the first hop, as the topper.
//   6.05: Its shortness is the joke.
//   6.07: The mic never grows while he talks, so the meter stays honest. A face light one step (P10).
//   6.09: "tell it once" took six chapters.
//   6.10: Kept only if the reel's laugh test passes (D-20: −4 s if not).
//   6.11: Match cut: the curtain → the dollhouse halves.
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "6", layouts: L.all});
