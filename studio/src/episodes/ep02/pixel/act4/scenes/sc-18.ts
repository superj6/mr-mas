// MR. MAS — Ep2 v1 · act4 · scene 18: 15 shot(s), 2280 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act4.json:
//   18.01 (138 f, WIDE · full frame: the lighthouse of sta) · 18.02 (48 f, WIDE · the beacon's beam sweeps across t)
//   · 18.03 (253 f, FULL FRAME · the boardroom TV, still on ) · 18.04 (143 f, FULL FRAME · the TV: her second claim)
//   · 18.05 (100 f, FULL FRAME · under it, the board's same-) · 18.06 (90 f, MCU · Mas at the table holds still →
//   Mad) · 18.07 (85 f, MEDIUM · Terb holds out a SAFETY COMMITT) · 18.08 (300 f, LEFT pane (the right pane steps
//   down a r) · 18.09 (48 f, MEDIUM · inside the left pane, at table ) · 18.10 (305 f, LEFT pane: Terb's next line;
//   the table t) · 18.11 (200 f, RIGHT pane (the left pane steps down and) · 18.12 (183 f, ECU insert · Mario's
//   page: one line high) · 18.13 (239 f, RIGHT pane: the beacon glints across the) · 18.14 (67 f, MCU inside the
//   right pane (the left pane) · 18.15 (81 f, LEFT pane: Mas's phone, face up on the t)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   18.01: Sc 14's box in his arms (the seam).
//   18.03: Captions legible at 1080p. Her words only (W8).
//   18.05: Her account and the reply side by side (W16). The quote keeps its honorific (naming rule 12: only the
//     name changes).
//   18.06: No V.O. (W8). A face light one step.
//   18.07: The split (two 238 × 203 panes, a 4 px divider). The rhyme on one action.
//   18.09: HOLD 2 BEATS (the table's).
//   18.10: "also present." and Mada's second word land first; the V.O. types in his cyan, in his pane, with new
//     information (the same post's news), never a reading of the committee.
//   18.11: The lighthouse always plays beside Mas's pane.
//   18.12: An insert, not only in the pane (P7).
//   18.13: The name GOLDEN GATE CLOD is never printed or spoken (O2.2: an egg).
//   18.14: Egg on his desk, by the lamp: an op-ed clipping, byline NELEH & THE QUIET VOTE (facts A37; a byline egg
//     only, no hold, never read out).
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "18", layouts: L.all});
