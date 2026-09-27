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
// WHAT PLAYS (d4). The knee, whole, once: one event per note.
//   o0-29    F (1.1): a 1-px cyan thread draws along the desk edge of the last frame and peels up into the flat line;
//            the room dissolves in 3 dithered steps (gone by o24); the dotted future draws on to the top; the band
//            (terms + pointer) steps up at o18
//   o30      F (1.3): MR. MAS + the file, one block, anchored to the screen (never pans, never cropped), 28 px (4x the
//            credits): a 1-BIT paper plate
//   o60 o90  F F (2.1, 2.3): `created by`, `written` pop onto the flat line (1-BIT)
//   o105-150 the leap in QUARTERS, the pen climbing, the camera craning 20 px: G `picture · music`, Ab `voices`
//            (`created by` folds), C `AI tools` (EARLY-WEB16); the title steps to EARLY-WEB16 on G
//   o150     F (3.3): the eighth plate, THE EMPTY POST BOX (the cold open's composer: caret, tool row, greyed Post),
//            rises out of the thread's end; the title steps to BASE (no plate: paper type, the file in cyan)
//   o150-239 the final frame: MR. MAS beside the empty post box at the top of the curve. `written` folds (o165).
//            The Ep1 moth comes in from the right (o135), goes to the light and lands on the post box on 4.1 (o180)
//   o240-249 the out: the frame steps to black in 4 dithered steps; the band goes out on 5.1; the caret stays
//   o255-269 the caret alone, in place, blinking on the beat, with the f0 sound (felt F5 + chip F6 glint). Out.
//
// d4 CHANGES (the cold read of d3, 16 s file: title cut to "R. MAS" by the pan, file cut to "eview.md", 5.5 s of
//   empty grid on the flat, 2.6 s of the intro's x9 caret macro read as "dead air or a glitch", the moth invisible at
//   480x270 and colliding with the terms line's period, 7 boxes in 2 styles by the end, the title underpowered):
//   - THE ONE THING: MR. MAS is anchored (screen space) from o30 to the out and resolves as the final beat beside
//     the empty post box. It no longer rides the line. It climbs the palette ladder itself (1-BIT > EARLY-WEB16 >
//     BASE), which also makes the ladder legible.
//   - No pan: nothing can scroll off. Only a 20 px crane on the leap. Every plate pops whole, stays put, and the flat
//     ones fold back into the line once read. Measured: 0 crop frames, 0 overlapping text boxes.
//   - Shorter: 6 bars -> 4.5 (15 s -> 11.25 s). The knee starts ON the lift (no empty bar), the leap is in quarter
//     notes, the hard cut to the intro's f0 macro is gone: the frame dissolves around the post box's own caret, which
//     is the loop point in this frame. The glint lands on 5.2; out on o269.
//   - The moth moved off the terms line to the post box's top edge (the light), with a new 11x7 wings-spread rest
//     sprite and two wing twitches; its flight keeps clear of every letter (measured: 0 frames over text).
//   - "you are here" sits on a cleared strip (the chart's dotted verticals had read as punctuation inside it).
//   - Music: re-timed to the new shape; the ring's strings hold no F (their 5th partials had put A under the whole
//     final frame: raw A/F 0.29 in the no-third window; now 0.045).
//
// Re-render (from studio/; SCR = your own scratch folder; every deliverable lands in ../out/lookdev/outro/d/,
// and build.py copies the mp4 to ../out/lookdev/outro/outro-d.mp4). About 6 min wall-clock in all on this machine.
//   SCR=/tmp/claude-1000/<session>/scratchpad/outro-d4
//   # 0. fast Node preview of any frames (exact pixels, 2x) + the audits (read time, crops, overlaps, the moth)
//   npx esbuild src/dev/outro/d/tools/preview.ts --bundle --platform=node --outfile=$SCR/od.js --log-level=warning
//   node $SCR/od.js $SCR/pv 2 1 -10 12 75 128 200 256 ; node $SCR/od.js --boxes $SCR/boxes.json 1
//   # 1. temp music (12.5 s incl. the pickup) + designed SFX; the engine writes nothing under audio/ with --out
//   PYTHONDONTWRITEBYTECODE=1 OST_WORKERS=4 ../audio/.venv-theme/bin/python -B src/dev/outro/d/audio/track.py --no-loop --no-mp3 --out $SCR/music
//   PYTHONDONTWRITEBYTECODE=1 ../audio/.venv-theme/bin/python -B src/dev/outro/d/audio/mix.py --scratch $SCR
//   # 2. picture, silent, 1080p (≈2 min)
//   npx remotion render src/dev/outro/d/entry.tsx outro-d-ep1 $SCR/outro-d-ep1-silent.mp4 --concurrency=4 --crf=14 --bundle-cache=false --log=error
//   # 3. variant stills (1080p PNG): Ep1 reference, Ep7, Ep10 (mid-flat and final)
//   for v in 1:200 7:200 10:100 10:200; do npx remotion still src/dev/outro/d/entry.tsx outro-d-stills $SCR/var-ep${v%%:*}-o${v##*:}.png --props="{\"ep\":${v%%:*},\"o\":${v##*:}}" --bundle-cache=false --log=error; done
//   # 4. mux (Remotion's ffmpeg, libfdk_aac 256k), decode every frame of the ENCODED mp4 (1080p and area-scaled
//   #    480x270, as PNGs in $SCR/dec1080, $SCR/dec480), QA -> outro-d-qa.json, 3 key stills, the two sheets
//   PYTHONDONTWRITEBYTECODE=1 ../audio/.venv-theme/bin/python -B src/dev/outro/d/tools/build.py --scratch $SCR
//
// Measured (2026-09-26, pass d4, from the encoded mp4): h264 1920x1080 yuv420p 24/1, 294 frames, AAC 48 kHz
//   stereo, 12.250 s. Every text element wholly on screen and settled for at least its read time (16 chars/s +
//   0.5 s; title 2.5 s; terms 5 s): terms + pointer 9.17 s lit (o20-o239); MR. MAS + file 8.67 s; plates: created by
//   58 f vs 42, written 73 vs 53, picture · music 133 vs 107, voices 118 vs 89, AI tools 103 vs 84. Crops 0,
//   overlapping text boxes 0, moth over text 0. Lowest text contrast 6.45:1 (EARLY-WEB16 cyan on slate); slug and
//   pointer 6.58:1. Encoded vs engine pixels inside text boxes <= 1.8/255 at 1080p; <= 3.2/255 at 480x270 except the
//   EARLY-WEB16 title's file line (8.2/255: a flat colour shift of the slate, the type is unchanged by eye).
//   Music -16.07 LUFS; mix -16.4 LUFS, -1.0 dBTP; engine QA: no warnings, no written third, F-major check passes
//   (0 windows over the limit), no-third windows A/F 0.009 and 0.045 (limit 0.06), knee_whole 0 (the register-exact
//   detector), knee_completion 2 hits, both the felt's one statement (read on its top line and its bottom line).
// Needs a human: watching it at speed against A/B/C/E; the credit line `(creator)`; legal review of the terms
//   line + pointer (LEGAL TEXT: DRAFT); the OST owner's Ep1 reprise colour and the leap in quarters (a diminution
//   of the knee); whether the loop point may move: the lone caret ends at the post box's caret (308,30), not the
//   built intro's (96,76) that A and E close into, so the next intro's f0 macro would cut in off-axis.
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
