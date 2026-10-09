// MR. MAS — Ep2 v1 · act4 · scene 20: 13 shot(s), 1248 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act4.json:
//   20.01 (94 f, SPLIT · LEFT the thinning crowd, Mas wal) · 20.02 (182 f, SPLIT · RIGHT: his lamp clicks on; his p)
//   · 20.03 (147 f, SPLIT · RIGHT: MCU Nole at the cage, to ) · 20.04 (79 f, SPLIT · RIGHT: ECU the padlock and the
//   b) · 20.05 (115 f, WIDE · the NopeAI lobby, full frame, as ) · 20.06 (29 f, ECU · his fingers find the yellowed
//   corn) · 20.07 (117 f, WIDE · Haras passes, her tape trailing, ) · 20.08 (53 f, ECU · full frame: the complaint
//   in the m) · 20.09 (96 f, WIDE · a rope drops from above and hooks) · 20.10 (168 f, ECU · Jun 19, his dark room:
//   his phone f) · 20.11 (38 f, ECU · behind the post TPOOL is still ope) · 20.12 (96 f, MCU · Mas reading, still (2
//   s) → MEDIUM ) · 20.13 (34 f, ECU · on the phone, the pin tips off the)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "20", layouts: L.all});
