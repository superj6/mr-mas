// MR. MAS — Ep2 v1 · act4 · scene 18: 15 shot(s), 2304 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act4.json:
//   18.01 (136 f, WIDE · full frame: the lighthouse of sta) · 18.02 (48 f, WIDE · the beacon's beam sweeps across t)
//   · 18.03 (253 f, FULL FRAME · the boardroom TV, still on ) · 18.04 (142 f, FULL FRAME · the TV: her second claim)
//   · 18.05 (101 f, FULL FRAME · under it, the board's same-) · 18.06 (89 f, MCU · Mas at the table holds still →
//   Mad) · 18.07 (84 f, MEDIUM · Terb holds out a SAFETY COMMITT) · 18.08 (306 f, LEFT pane (the right pane steps
//   down a r) · 18.09 (68 f, MEDIUM · inside the left pane, at table ) · 18.10 (309 f, LEFT pane: Terb's next line;
//   the table t) · 18.11 (200 f, RIGHT pane (the left pane steps down and) · 18.12 (183 f, ECU insert · Mario's
//   page: one line high) · 18.13 (239 f, RIGHT pane: the beacon glints across the) · 18.14 (67 f, MCU inside the
//   right pane (the left pane) · 18.15 (79 f, LEFT pane: Mas's phone, face up on the t)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "18", layouts: L.all});
