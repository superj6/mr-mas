// MR. MAS — Ep2 v1 · act2 · scene 11: 16 shot(s), 2352 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act2.json:
//   11.01 (204 f, WIDE · the locked meter frame from mid-h) · 11.02 (120 f, SCR · the big screen: CHATGTP grows
//   ears) · 11.03 (76 f, GLYPH 5 frames · its eyes are tokens poi) · 11.04 (320 f, WIDE · the meter frame: the
//   ENGINEER at ) · 11.05 (234 f, WIDE · the meter frame → SCR · three mou) · 11.06 (165 f, MCU · RIMA, half in the
//   light now, perfe) · 11.07 (264 f, WIDE · the engineer turns the phone's ca) · 11.08 (89 f, SCR · the stream's
//   chat scrolls up the s) · 11.09 (120 f, MCU · RIMA in the half-dark, perfectly c) · 11.10 (72 f, SCR → WIDE · the
//   big screen: LIVE → ENDE) · 11.11 (72 f, MEDIUM · in the wings, Mas takes out his) · 11.12 (77 f, MCU · his face
//   in the work light, still ) · 11.13 (240 f, WIDE · the word becomes a blimp and rise) · 11.14 (62 f, MCU · RIMA
//   on her mark, composed, not lo) · 11.15 (165 f, 2S · the ENGINEER beside RIMA at her mar) · 11.16 (72 f, WIDE ·
//   every head near the wings turns; )
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   11.01: The locked meter frame: every step of the light is measured here. The front row is below this frame (it's
//     first seen in sc 12, after the blimp has gone: FC).
//   11.02: The badge holds if the facts pull holds (facts A60); otherwise it goes.
//   11.03: Toast 1 of 3.
//   11.04: The episode's first cut-off, with a motive the house can see. Record CHATGTP's line whole; "Thanks."
//     comes in over "favorite". Subtitles: "…one of my favorite—" / "Thanks." / "—things."
//   11.05: Three-part harmony through the intro's sung-vocal pipeline.
//   11.06: Under pressure she sticks to the script harder.
//   11.07: The fogged glasses are a mid-house audience member's, never the front row.
//   11.08: Live, before her close (R1). Free is the catch; safety is never mentioned (script review: no thesis by
//     placement).
//   11.09: The episode's one long hold of hers.
//   11.10: The stream ends before the post (the post is about 20 minutes later: R1).
//   11.11: A real post never rides the beat.
//   11.12: Why he posted it is contested: nothing tells us (W8).
//   11.13: The blimp takes the coverage, not her live stage (R1). Four held sizes, one a bar.
//   11.14: No wince (R2: no 'understudy' framing, GR §6).
//   11.15: Said to a listener (W19). His words are the film's premise, not the voice (D-6).
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "11", layouts: L.all});
