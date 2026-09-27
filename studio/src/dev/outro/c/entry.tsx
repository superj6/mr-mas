// MR. MAS — OUTRO PROPOSAL C, "After hours: DAYS SINCE" — a VISUAL OUTLINE (a mock-up to compare, not a final).
// Brief: show/production/OUTRO-PROPOSALS.md §4 and §9 (row C). Showrunner: "the outro should be shorter than the
// intro probably. but let's create a few proposals with some sort of visual outlines for comparison".
//
// WHAT IT IS (fourth pass): 192 frames (3 bars at 96 BPM + the button chord's ring-out, 8.0 s) after a 24-frame
// stand-in "last frame" (the cold open's dark-room MEDIUM, mcoldopen/medium.ts drawMedium f56): the file is 216 f =
// 9.0 s. The NopeAI lobby at night, locked on the wall right of the desk: the lit DAYS SINCE sign at last night's
// count (35), the building DIRECTORY carrying the credits in three big lines under a small head row (the show + the
// file), the box of spare zeros, a rack pillar's LEDs; the band carries the terms line + the pointer until the dip.
//   o0-83    the quiet read: nothing moves but the LEDs (the felt's flat line, then the knee's flat half)
//   o84-118  the maintenance hand (orange cuff) comes down, grips the units plate on the knee's G (o90-93), lifts it
//            off; on the knee's C (o105) it's clear of the slot and tonight's plate is there behind it: 36 (NOV 21 ->
//            DEC 27, 2023). It drops the 5 in the box (o112, thup o116) and goes
//   o120     3.1: the after-hours timer's first step, the house light down (the sign's one held-step flicker); the
//            moth comes to the lit box, bumps it twice, circles above it
//   o150-151 3.3: the timer's second step: the sign goes out, the hum stops, the board dims with the room; only the
//            rack's LEDs, the rose window's cyan and the band are left. The moth drops to the one light left and
//            lands beside the terms line's final period at o165 (3.4)
//   o184-191 the dip: the whole frame to black in four held Bayer steps; the sound is at zero by o190
// Timing sheet: timeline.ts. Set + board: set.ts. Hand: cast.ts. Moth: moth.ts. Band: band.ts. Words: text.ts.
//
// FILES (outputs; nothing else in the repo was touched):
//   out/lookdev/outro/outro-c.mp4                   the mock-up, 1080p 24 fps, 216 f = 9.0 s, temp music + designed SFX
//   out/lookdev/outro/c/outro-c-ep1-1080p.mp4       the same file (the brief's name; a hard link)
//   out/lookdev/outro/c/outro-c-key{1,2,3}-*.png    three key stills (o40, o105, o170), 1920x1080, from the ENCODED mp4
//   out/lookdev/outro/c/outro-c-keyframes.png       the sheet: six numbered frames from the mp4 + the bar grid
//   out/lookdev/outro/c/outro-c-ep10.png            the extra still: how Ep10 differs (1920x1080)
//   out/lookdev/outro/c/outro-c-variants.png        Ep1 (o105) / Ep4 (the reset) / Ep10 side by side
//   out/lookdev/outro/c/outro-c-{music,sfx,mix}.wav the temp score (OST engine), the SFX stem, the final mix (9.0 s)
//   out/lookdev/outro/c/qa/                         qa.json, sound.json, the readability crops (full size + 480x270)
//
// RE-RENDER (from the repo root; SC = any scratch folder; ~6 min on a busy 14-core box):
//   bash studio/src/dev/outro/c/tools/render.sh "$SC"
// which runs, in order:
//   (cd studio && npx remotion render src/dev/outro/c/entry.tsx outro-c-ep1 "$SC/outro-c-silent.mp4" \
//       --concurrency=4 --crf=12 --bundle-cache=false --log=error)
//   (cd studio && npx remotion still src/dev/outro/c/entry.tsx outro-c-stills "$SC/still-<k>.png" --frame=<k> ...)   k = 0 1 2
//   PYTHONDONTWRITEBYTECODE=1 audio/.venv-theme/bin/python studio/src/dev/outro/c/audio/track.py --out "$SC/music" --no-stems --no-loop
//       (imports audio/ost/engine READ-ONLY; its sample-calibration cache is redirected into $SC; writes nothing under audio/)
//   audio/.venv-theme/bin/python studio/src/dev/outro/c/audio/mix.py "$SC"      -> the SFX stem, the mix, the WAVs in out/
//   ffmpeg (Remotion's bundled one) mux: video stream copy + AAC 256k, swapped in by rename -> out/lookdev/outro/outro-c.mp4
//   node preview.cjs "$SC/native" ... check                                     -> the native band + moth checks, moth.json
//   audio/.venv-theme/bin/python studio/src/dev/outro/c/tools/sheets.py "$SC" -> stills, sheet, variants, QA crops
// Steps can run alone: render.sh "$SC" picture|stills|audio|mux|sheets.
// Node preview without Remotion (fast iteration; also runs the band checks):
//   (cd studio && npx esbuild src/dev/outro/c/tools/preview.ts --bundle --platform=node --outfile="$SC/preview.cjs") &&
//   node "$SC/preview.cjs" "$SC" 2 o0 o105 o165 s0 check
//
// Composition ids: outro-c-ep1 (216 f), outro-c-stills (3 f: 0 Ep1 o105, 1 Ep4, 2 Ep10).
//
// HANDOFF (2026-09-27, fourth pass: the second cold read's fixes, on the 8.5 s file)
//   Changed, and why:
//   - THE ONE THING, "the most text-heavy element gets the least time ... cut the directory down to what can be read
//     in the quiet before the hand arrives: about three short, larger lines, or hold the board alone longer": both.
//     §1.1's six 7-px ledger rows (16.8 s of text, dot leaders that went to mush at 480x270) are now one small head
//     row + three big lines in the 14-px display face, centred: CREATED BY (CREATOR) / MADE WITH AI / AI VOICES ·
//     NONE CLONED (3.4 s at 16 cps). The quiet read is o0-o83 (3.5 s, was 2.5 s). The rest of §1.1's credits (written
//     with AI, picture and score rendered in code, the voices designed from text, the tools by name) move to the
//     notice the pointer names. The board is 288 px (was 364), with an engraved DIRECTORY nameplate on its top rail.
//   - "0 to 36 in one swap is confusing ... a counter normally resets to 0; here someone changes 0 into 36": the
//     outro now opens on last night's count and the hand does the nightly job of a DAYS SINCE sign's keeper: 35 -> 36,
//     one plate (tonight's hangs behind yesterday's, like a tear-off calendar). The time jump since sc 30's 0 is in the
//     first frame, not in the action. The board's CLOSED DEC 27, 2023 (the second pass's explanation) is dropped.
//   - "add a short dip to black after the moth lands so the picture ends when the sound does": the after-hours timer
//     has a second step (3.3: the sign goes out, the hum stops), which also gives the moth a reason to leave the sign
//     for the band (the one light left); the whole frame dips to black o184-190 as the sound reaches zero at o190.
//   - "the second E in CREATED sits raised ... looks like a typo": the Ep1 (and Ep4) out-of-line letters are gone.
//   - "the bottom band ... a flat black strip ... reads like a compliance slate stuck onto the scene": no grey rule;
//     the floor falls off into the band's black in a Bayer ramp (rows 194-202), so it reads as the frame's dark
//     foreground; the DRAFT slug is the 3x5 micro face without the dashed chip.
//   - The count digits are R1 (≈ 9:1 on the lit face; R2 measured 2.8:1 on the encode). The sc 30 room sign uses
//     R2: a continuity note for whoever builds that shot.
//   - Score: the same knee (G on the fingers reaching the plate, C on the 36), the button chord now rings through
//     the sign going out and the landing, to o190. SFX: one plate (tap, hook ticks, thup), a second contactor and
//     the hum's stop at o151, the air stepping down twice.
//   Measured: qa/qa.json and qa/sound.json (from the ENCODED mp4; the numbers are in the pass report).
//   Open issues / weaknesses:
//   - Reading, honestly: the three credit lines fit the quiet read (3.4 of 3.5 s); the sign (2.4 s) is read during the
//     hand, which is where the eye already is. The band is up 7.67 s: the terms line alone (5.4 s) fits; terms +
//     pointer (8.2 s) need 0.5 s more than the frame holds. Everything on the frame in one pass is ≈ 16 s: nobody reads
//     all of it in one viewing, and the small head row (the file name) is a skim.
//   - The board's wording is new (text.ts CREDITS): it departs from §1.1's six rows on this surface only; the terms
//     line and the pointer are §1.1's, exactly. The showrunner and legal should see the three lines as the proposed
//     on-screen credits + disclosure. (CREATOR) is still the brief's placeholder.
//   - The opening count (35) is new to the brief (§4 says "still showing the last count, Ep1: 0, from sc 30").
//   - The hand comes DOWN from above frame (the brief says it rises): from below it would cover the credits.
//   - The moth is copied from E, not shared: the five should move to one shared module (a lead decision).
//   - The close sign has three plate slots; the lobby wide (rooms/lobby.ts paintSign, sc 30) has one.
//   - Real credits on a parody company's wall: legal question (OUTRO-PROPOSALS §10, legal 4). LEGAL TEXT: DRAFT.
//   - Leaves Mas's POV every week; the count must be checked against each episode's facts.md.
//   - Temp score only, never heard by a person; the room tone, neon hum and SFX are designed placeholders.
//   - OUTRO-PROPOSALS §0/§4/§9 and the comparison strip still say C is 10 s / 4 bars and describe the 0 -> 36 hang
//     and the six-row board (outside this folder: the lead's).
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroCEp1, OutroCStills} from './OutroC';
import {TOTAL, STILLS} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-c-ep1', component: OutroCEp1, durationInFrames: TOTAL, fps: 24},
  {id: 'outro-c-stills', component: OutroCStills, durationInFrames: STILLS.length, fps: 24},
];

registerRoot(makeRoot(frames));
