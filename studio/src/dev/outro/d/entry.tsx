// MR. MAS — OUTRO PROPOSAL D, "the curve": LOOKDEV MOCK-UP (a visual outline to compare, not a final).
// Brief: show/production/OUTRO-PROPOSALS.md §5 + §9 row D. This header is the handoff note (what, where, how to
// re-run, what was measured, what still needs a human). Nothing here is committed or chosen.
//
// Compositions (this entry registers ONLY outro D's):
//   outro-d-ep1     294 f @24 = 24 f stand-in (cold open f56, the dark-room MEDIUM; Ep1's button isn't built)
//                   + the 270-frame outro (o0-o269, 11.25 s = 4.5 bars at 96 BPM)
//   outro-d-stills  one frame of any episode state: --props='{"ep":1|7|10,"o":-24..269}' (default Ep10, o200)
// Files: scene.ts (per-frame draw) · world.ts (chart, thread, plates, the anchored title, the post box, dot, moth,
//   band) · timeline.ts (all timing) · text.ts (§1.1 text, exact; per-episode values Ep1/Ep7/Ep10) · OutroD.tsx
//   (Remotion hosts; the Ep7/Ep10 "machine render" in the post box is a fenced 1080p SVG filler) · audio/track.py
//   (temp score, imports audio/ost/engine read-only) · audio/mix.py (score + SFX) · tools/preview.ts (Node preview +
//   read / crop / overlap / moth audits) · tools/build.py (mux, decode the ENCODED mp4, QA, stills, sheets).
//
// WHAT PLAYS (d5). The knee, whole, once: one event per note.
//   o0-29    F (1.1): the monitor's own curve lights up (o0-1); the room dissolves around it in 4 dithered steps
//            (o2-13); the push-in, on the thread alone (o12-23): every pixel of the monitor's curve travels out to
//            the full-frame chart's line, its rise breaking into the dotted future; the grid develops under it
//            (o14-25); the band (terms + pointer) steps up at o18
//   o30      F (1.3): MR. MAS + the file, one block, anchored to the screen (never pans, never cropped), 28 px: a
//            1-BIT paper plate
//   o60 o90  F F (2.1, 2.3): the human credits, `created by`, `written`, pop onto the flat line (1-BIT) and STAY
//   o105-150 the leap in QUARTERS, the pen climbing, the camera craning 20 px: G `picture · music`, Ab `voices`,
//            C `AI tools` (EARLY-WEB16)
//   o150     F (3.3): the eighth plate, THE EMPTY POST BOX (the cold open's composer: caret, tool row, greyed Post),
//            rises out of the thread's end; beside it the title upgrades ONCE, 1-BIT plate -> the show's own window
//            (the post box's chrome), as a 3-frame interlaced develop
//   o153-239 the final frame: every credit on screen, human first; two matched windows at the top of the curve. The
//            Ep1 moth (THE PLAN's blueprint moth) comes in from the right once the light is up (o153), flutters at
//            the caret and settles inside the empty post box's field on 4.1 (o180), wings spread
//   o240-249 the out: the frame AND the band step to black in 4 dithered steps; the caret stays
//   o255-269 the caret alone, in place, blinking on the beat, with the f0 sound (felt F5 + chip F6 glint). Out.
//
// d5 CHANGES (the cold read of d4, 12.25 s file):
//   - THE ONE THING: the human credits no longer fold. d4 folded `created by` (o120) and `written` (o165), so the
//     frame held longest (8-11 s, the screenshot) listed only picture · music / voices / AI tools and read as "made
//     by AI". Now both stay on the flat line to the out (created by 7.4 s settled, written 6.2 s).
//   - The opening was a crossfade in which the monitor's curve and the full-frame curve were both visible and
//     misaligned for ~0.5 s. Now it is one line: the monitor's curve (mirrored from mcoldopen/screen.ts) stays lit
//     while the room goes, then stretches out into the chart's line (a push-in on the thread alone); the grid only
//     develops once the room is gone. The desk-edge peel is gone.
//   - The title's restyles read as indecision (1-BIT > EARLY-WEB16 > bare type, the last the least finished). Now
//     one step, on the last F with the post box: 1-BIT paper plate -> the show's own window (drop shadow, N5
//     keyline, N1 face, a P0 bevel on the name), the post box's twin. It also takes a change out of the busy leap.
//   - The bright 1-BIT grid dots in the bottom band fought the chips, `you are here` and the axis: the 1-BIT rows now
//     keep only the axis and the 1K decade as one dot every 8 px (no minors, no verticals).
//   - The terms band hard-cut at the out while the rest dithered: it now steps out with the frame.
//   - The moth read as "a speck ... a glitch or dust" at 480x270: now 19x14 native (was 11x7), bright linework
//     wings with an eyespot, a hot thorax, feathered antennae, wings beating on 1s in flight; it enters AFTER the
//     post box (its light) is up and rests spread inside the empty field (the EQUITY-box moth, in an empty box).
//   - Music: unchanged notes (the harp F5 still lands with the moth on 4.1); SFX: the two fold sounds are gone, the
//     wings retimed to o153-179, twitches at o206 / o227.
//
// Re-render (from studio/; SCR = your own scratch folder; every deliverable lands in ../out/lookdev/outro/d/,
// and build.py copies the mp4 to ../out/lookdev/outro/outro-d.mp4). Heavy steps go through ../ops/heavy.sh (the
// showrunner's 2026-09-27 laptop rule: at most 2 heavy jobs machine-wide; start them in the background and poll).
// Measured d5 run times (unthrottled): music 7 s, picture 25 s, 4 stills ~30 s, build 14 s.
//   SCR=/tmp/claude-1000/<session>/scratchpad/outro-d5
//   # 0. fast Node preview of any frames (exact pixels, 2x) + the audits (read time, crops, overlaps, the moth)
//   npx esbuild src/dev/outro/d/tools/preview.ts --bundle --platform=node --outfile=$SCR/od.js --log-level=warning
//   node $SCR/od.js $SCR/pv 2 1 -10 16 75 128 200 256 ; node $SCR/od.js --boxes $SCR/boxes.json 1
//   # 1. temp music (12.5 s incl. the pickup) + designed SFX; the engine writes nothing under audio/ with --out
//   PYTHONDONTWRITEBYTECODE=1 OST_WORKERS=2 ../ops/heavy.sh ../audio/.venv-theme/bin/python -B src/dev/outro/d/audio/track.py --no-loop --no-mp3 --out $SCR/music
//   PYTHONDONTWRITEBYTECODE=1 ../audio/.venv-theme/bin/python -B src/dev/outro/d/audio/mix.py --scratch $SCR
//   # 2. picture, silent, 1080p
//   ../ops/heavy.sh npx remotion render src/dev/outro/d/entry.tsx outro-d-ep1 $SCR/outro-d-ep1-silent.mp4 --concurrency=4 --crf=14 --bundle-cache=false --log=error
//   # 3. variant stills (1080p PNG): Ep1 reference, Ep7, Ep10 (mid-flat and final)
//   for v in 1:200 7:200 10:100 10:200; do ../ops/heavy.sh npx remotion still src/dev/outro/d/entry.tsx outro-d-stills $SCR/var-ep${v%%:*}-o${v##*:}.png --props="{\"ep\":${v%%:*},\"o\":${v##*:}}" --bundle-cache=false --log=error; done
//   # 4. mux (Remotion's ffmpeg, libfdk_aac 256k), decode every frame of the ENCODED mp4 (1080p and area-scaled
//   #    480x270, as PNGs in $SCR/dec1080, $SCR/dec480), QA -> outro-d-qa.json, 3 key stills, the two sheets
//   PYTHONDONTWRITEBYTECODE=1 ../ops/heavy.sh ../audio/.venv-theme/bin/python -B src/dev/outro/d/tools/build.py --scratch $SCR
//
// Measured (2026-09-27, pass d5, from the encoded mp4): h264 1920x1080 yuv420p 24/1, 294 frames, AAC 48 kHz
//   stereo, 12.250 s. Every text element wholly on screen and settled for at least its read time (16 chars/s +
//   0.5 s; title 2.5 s; terms 5 s): terms + pointer 9.17 s lit (o20-o239); MR. MAS + file 8.67 s; plates: created by
//   178 f vs 42 (was 58), written 148 vs 53 (was 73), picture · music 133 vs 107, voices 118 vs 89, AI tools 103 vs
//   84. Crops 0, overlapping text boxes 0, moth over text 0 (the moth's box, 1 px margin, every frame). Lowest text
//   contrast 5.72:1 (the title window's P0 bevel on N1; the name itself is P1, 11:1); plates 6.45:1; slug and
//   pointer 6.58:1. Encoded vs engine pixels inside text boxes <= 3.8/255 at 1080p; <= 3.4/255 at 480x270 except the
//   file line (8.0/255: 1 px cyan type on near-black, chroma subsampling; unchanged by eye). Checked by eye at
//   1080p and 480x270: one curve on screen at every frame of the opening; the moth reads as a moth at rest.
//   Music (unchanged notes, re-rendered): -16.07 LUFS; mix -16.49 LUFS, -1.0 dBTP; engine QA: no warnings, no
//   written third, F-major check passes (worst sieved 0.078, limit 0.08), no-third windows A/F 0.009 and 0.045
//   (limit 0.06), knee_whole 0 (the register-exact detector), knee_completion 2 hits (the felt's one statement).
// Needs a human: watching it at speed against A/B/C/E; the credit line `(creator)`; legal review of the terms
//   line + pointer (LEGAL TEXT: DRAFT); the OST owner's Ep1 reprise colour and the leap in quarters (a diminution
//   of the knee); whether the loop point may move: the lone caret ends at the post box's caret (308,30), not the
//   built intro's (96,76) that A and E close into, so the next intro's f0 macro would cut in off-axis. The
//   monitor-curve formulas in scene.ts mirror mcoldopen/screen.ts by hand: if the cold open's chart changes, re-check
//   frames o0-23 (the preview's o0 frame must show no second curve).
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroD, OutroDStill} from './OutroD';
import {TOTAL} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-d-ep1', component: OutroD, durationInFrames: TOTAL, fps: 24},
  {id: 'outro-d-stills', component: OutroDStill, props: {ep: 10, o: 200}},
];

registerRoot(makeRoot(frames));
