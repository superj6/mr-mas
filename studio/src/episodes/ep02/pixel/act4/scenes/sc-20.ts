// MR. MAS — Ep2 v1 · act4 · scene 20: 13 shot(s), 1248 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act4.json:
//   20.01 (94 f, SPLIT · LEFT the thinning crowd, Mas wal) · 20.02 (182 f, SPLIT · RIGHT: his lamp clicks on; his p)
//   · 20.03 (147 f, SPLIT · RIGHT: MCU Nole at the cage, to ) · 20.04 (79 f, SPLIT · RIGHT: ECU the padlock and the
//   b) · 20.05 (115 f, WIDE · the NopeAI lobby, full frame, as ) · 20.06 (29 f, ECU · his fingers find the yellowed
//   corn) · 20.07 (117 f, WIDE · Haras passes, her tape trailing, ) · 20.08 (53 f, ECU · full frame: the complaint
//   in the m) · 20.09 (96 f, WIDE · a rope drops from above and hooks) · 20.10 (168 f, ECU · Jun 19, his dark room:
//   his phone f) · 20.11 (38 f, ECU · behind the post TPOOL is still ope) · 20.12 (96 f, MCU · Mas reading, still (2
//   s) → MEDIUM ) · 20.13 (34 f, ECU · on the phone, the pin tips off the)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   20.02: One crop, with its condition (R2).
//   20.04: Nothing legible in the replies.
//   20.05: The cage's bars (right pane) → the lobby's rack pillars as the divider slides away.
//   20.06: 1 s; away from Alyi and from every compute line (D-62).
//   20.07: The V.O. after the note's insert has cleared, before the docket.
//   20.08: Legible for its read floor, 2.1 s (P7, P15).
//   20.09: No THUD at its exit (THUD means "filed").
//   20.10: The clean rectangle on the carpet → his phone face down on the desk, same shape, same place.
//   20.11: No app tracks anyone (D-29).
//   20.12: A face light one step. His decision shown (FC).
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "20", layouts: L.all});
