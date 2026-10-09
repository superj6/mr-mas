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
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "11", layouts: L.all});
