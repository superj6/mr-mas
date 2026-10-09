// MR. MAS — Ep2 v1 · act1 · scene 4A: 6 shot(s), 840 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   4A.01 (183 f, WIDE · the same table by day, from its f) · 4A.02 (300 f, 2S · across the table favouring MADA
//   (th) · 4A.03 (96 f, OTS · over Mas's shoulder onto TERB, who) · 4A.04 (81 f, ECU · the nameplates click into
//   their sl) · 4A.05 (120 f, WIDE · as he sits he glances at Gerg at ) · 4A.06 (60 f, ECU · his phone, face up on
//   the table be)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "4A", layouts: L.all});
