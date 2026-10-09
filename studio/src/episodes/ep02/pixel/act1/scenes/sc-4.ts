// MR. MAS — Ep2 v1 · act1 · scene 4: 36 shot(s), 4632 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act1.json:
//   4.01 (60 f, WIDE · the candle-lit table (establish) ) · 4.02 (245 f, ECU · his finger on the bare Publish but) ·
//   4.03 (115 f, LOW·DESK · Mas reading → HIGH · the plan) · 4.04 (110 f, WIDE · ghost 1 rises in double exposure )
//   · 4.05 (91 f, MEDIUM · a staffer's eyes to the empty c) · 4.06 (158 f, LOW·DESK · Mas, as if calling a vote → H)
//   · 4.07 (94 f, WIDE · the table, one shot for the landi) · 4.08 (192 f, OTS · over Mas's shoulder onto NOLE at t)
//   · 4.09 (363 f, OTS · the same setup: Nole's case, the 2) · 4.10 (112 f, LOW·DESK · Mas → HIGH · the planchette
//   s) · 4.11 (110 f, OTS · Nole spreads his hands → HIGH · th) · 4.12 (109 f, MCU · Nole jabbing at the board →
//   HIGH ·) · 4.13 (110 f, WIDE · the cow ghost rises, chewing; its) · 4.14 (116 f, OTS · Nole at the cow → LOW·DESK
//   · Mas) · 4.15 (97 f, MEDIUM · Nole's lamp clicks on; his post) · 4.16 (171 f, WIDE · ghost 3 rises, DEC 2018,
//   its head) · 4.17 (65 f, MEDIUM · Nole slaps his phone down → ECU) · 4.18 (238 f, 2S · NOLE and GHOST-NOLE side
//   by side, s) · 4.19 (114 f, LOW·DESK · Mas → HIGH · the planchette s) · 4.20 (52 f, MCU · NOLE, quiet → MCU · the
//   STAFFER be) · 4.21 (60 f, MCU · NOLE to her, hushed) · 4.22 (398 f, MCU · GERG typing (his correction) ↔ MCU) ·
//   4.23 (137 f, MCU · NOLE takes the fear back) · 4.24 (75 f, WIDE · NOLE, loud again, to the table) · 4.25 (146 f,
//   OTS · over Mas's shoulder: ghost 3 drift) · 4.26 (106 f, MCU · NOLE, the lamp dark (held through ) · 4.27 (65 f,
//   ECU · Mas lifts his glass; the candle ne) · 4.28 (105 f, WIDE · NopeAI's first office, Feb 2018, ) · 4.29 (108
//   f, WIDE · the slide and the room in one fra) · 4.30 (114 f, WIDE · at the back, Mas sips from the cr) · 4.31 (44
//   f, INSERT · the arena monitor: the match st) · 4.32 (100 f, 2S · across the room: ALYI foreground, c) · 4.33 (71
//   f, WIDE → MATCH · the glass at the back of ) · 4.34 (216 f, OTS · the reverse, over Nole's shoulder,) · 4.35 (98
//   f, WIDE · the table: Nole sets the candle d) · 4.36 (67 f, MCU → WIDE · Mas blows out the last cand)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   4.01: The planchette has no pointer glyph (P6): it reads as a planchette, never a cursor. The byline row legible
//     at 1080p (… · ALYI · … · MAS).
//   4.02: The click is his move. The rail clears before the V.O. types in his cyan (P18).
//   4.03: Base setup for his questions; the HIGH planchette answers them.
//   4.04: Alyi appears only as an author (his name on the header), never in brass or stone (R1). The spirit-photo
//     pass (2.G) on the ghosts only.
//   4.05: The empty chair is a chair: no image of Alyi in it.
//   4.06: HOLD 2 BEATS (the table's, waiting) before the first knock.
//   4.07: The door he didn't use stays in frame.
//   4.08: Plate on his entrance: name plus what he is to Mas, told once.
//   4.09: The scene's one speech.
//   4.10: Each letter a tick on the beat.
//   4.11: The N moves in one held glide.
//   4.12: The three hands: Mas's, ghost-Nole's, Gerg's (R1). Nobody's reflection.
//   4.13: The caption reads over the chewing; the scene keeps moving under it.
//   4.14: No invented line disputes the record (R2).
//   4.15: His answer goes to the internet, and has no words in it.
//   4.16: The header must read at 1080p; the voice plays while it holds.
//   4.17: ECU: his still hand carries the slap (R1).
//   4.18: HOLD 2 BEATS before the ghost's answer: the hold is Nole's.
//   4.19: SET-04 in the board's corner (T3 cut-paper; slate and shell stones). The stone label legible.
//   4.20: The room goes quiet for the only time.
//   4.22: The knobs tick only while the stream pours in, and freeze at the match (the numbers were fixed during
//     play). No players, no hands. The wall starts on "Nobody wrote it.", so the picture carries the second half.
//   4.24: The board's corner goes back to letters.
//   4.25: The bill has its referent in the frame (R2). The V.O. types in his cyan.
//   4.26: The lamp's tell: off. A slow drift in.
//   4.27: The glass is the matched object into F2.3.
//   4.28: No captions. The slide is the public reason (R2); the litigant's account stays off screen.
//   4.29: The room's answer is the room: no prop, no sheet, nothing asked of anyone on screen (script review).
//   4.32: Alyi present, lit, a person (P8), part of him cut off by the frame (his rule). Warm. About 2 s on the
//     look.
//   4.33: The relit candle is the matched object out.
//   4.34: Base setup for the confrontation.
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "4", layouts: L.all});
