// MR. MAS — Ep2 v1 · act1 · scene 4: 36 shot(s), 4704 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   4.01 (60 f, WIDE · the candle-lit table (establish) ) · 4.02 (245 f, ECU · his finger on the bare Publish but) ·
//   4.03 (115 f, LOW·DESK · Mas reading → HIGH · the plan) · 4.04 (110 f, WIDE · ghost 1 rises in double exposure )
//   · 4.05 (93 f, MEDIUM · a staffer's eyes to the empty c) · 4.06 (157 f, LOW·DESK · Mas, as if calling a vote → H)
//   · 4.07 (120 f, WIDE · the table, one shot for the landi) · 4.08 (202 f, OTS · over Mas's shoulder onto NOLE at
//   t) · 4.09 (363 f, OTS · the same setup: Nole's case, the 2) · 4.10 (112 f, LOW·DESK · Mas → HIGH · the
//   planchette s) · 4.11 (110 f, OTS · Nole spreads his hands → HIGH · th) · 4.12 (110 f, MCU · Nole jabbing at the
//   board → HIGH ·) · 4.13 (110 f, WIDE · the cow ghost rises, chewing; its) · 4.14 (115 f, OTS · Nole at the cow →
//   LOW·DESK · Mas) · 4.15 (99 f, MEDIUM · Nole's lamp clicks on; his post) · 4.16 (171 f, WIDE · ghost 3 rises, DEC
//   2018, its head) · 4.17 (66 f, MEDIUM · Nole slaps his phone down → ECU) · 4.18 (239 f, 2S · NOLE and GHOST-NOLE
//   side by side, s) · 4.19 (113 f, LOW·DESK · Mas → HIGH · the planchette s) · 4.20 (53 f, MCU · NOLE, quiet → MCU
//   · the STAFFER be) · 4.21 (59 f, MCU · NOLE to her, hushed) · 4.22 (415 f, MCU · GERG typing (his correction) ↔
//   MCU) · 4.23 (146 f, MCU · NOLE takes the fear back) · 4.24 (75 f, WIDE · NOLE, loud again, to the table) · 4.25
//   (147 f, OTS · over Mas's shoulder: ghost 3 drift) · 4.26 (106 f, MCU · NOLE, the lamp dark (held through ) ·
//   4.27 (66 f, ECU · Mas lifts his glass; the candle ne) · 4.28 (105 f, WIDE · NopeAI's first office, Feb 2018, ) ·
//   4.29 (108 f, WIDE · the slide and the room in one fra) · 4.30 (116 f, WIDE · at the back, Mas sips from the cr)
//   · 4.31 (43 f, INSERT · the arena monitor: the match st) · 4.32 (101 f, 2S · across the room: ALYI foreground, c)
//   · 4.33 (71 f, WIDE → MATCH · the glass at the back of ) · 4.34 (218 f, OTS · the reverse, over Nole's shoulder,)
//   · 4.35 (98 f, WIDE · the table: Nole sets the candle d) · 4.36 (67 f, MCU → WIDE · Mas blows out the last cand)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "4", layouts: L.all});
