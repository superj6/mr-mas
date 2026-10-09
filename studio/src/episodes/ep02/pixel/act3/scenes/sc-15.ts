// MR. MAS — Ep2 v1 · act3 · scene 15: 19 shot(s), 2400 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act3.json:
//   15.01 (62 f, WIDE · the empty office: a desk with no ) · 15.02 (91 f, ECU · his phone: the thread, collapsed t)
//   · 15.03 (172 f, MCU · Mas on the desk's edge; far off, A) · 15.04 (158 f, ECU · TPOOL: its splash; welcome back,
//   m) · 15.05 (178 f, ECU · he types where u at? → POV · the m) · 15.06 (169 f, WIDE · the holiday party, Dec 2022:
//   silh) · 15.07 (179 f, 2S · across the crowd: Alyi (cropped by ) · 15.08 (155 f, ECU · Alyi holds up his phone,
//   Mas's dea) · 15.09 (84 f, WIDE · the racks in the corner hum along) · 15.10 (213 f, 2S · this office, 2023,
//   night: Alyi at h) · 15.11 (130 f, 2S · the same: Ekiel; Alyi, without look) · 15.12 (77 f, ECU · his finger
//   above the bare Publish ) · 15.13 (116 f, WIDE · a leadership offsite at night: a ) · 15.14 (46 f, ECU · he
//   presses Publish) · 15.15 (115 f, WIDE · the effigy catches) · 15.16 (110 f, WIDE → ECU · the fire's glow shrinks
//   to ) · 15.17 (116 f, ECU · the point is the pin, pulsing on h) · 15.18 (109 f, WIDE · he pockets the phone, gets
//   up off) · 15.19 (120 f, WIDE · the stairwell, Mas small on the s)
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "15", layouts: L.all});
