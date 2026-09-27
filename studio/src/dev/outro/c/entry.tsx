// MR. MAS — OUTRO PROPOSAL C, "After hours: DAYS SINCE" — a VISUAL OUTLINE (a mock-up to compare, not a final).
// Brief: show/production/OUTRO-PROPOSALS.md §4 and §9 (row C). Showrunner: "the outro should be shorter than the
// intro probably. but let's create a few proposals with some sort of visual outlines for comparison".
//
// WHAT IT IS (second pass): 180 frames (3 bars at 96 BPM, 7.5 s) after a 24-frame stand-in "last frame" (the cold
// open's dark-room MEDIUM, mcoldopen/medium.ts drawMedium f56): the file is 204 f = 8.5 s. The NopeAI lobby at
// night, locked on the wall right of the desk: the lit DAYS SINCE sign still at 0, the building DIRECTORY carrying the
// credits as tenants (the title row reads CLOSED DEC 27, 2023: the date the count is counted to), the box of spare
// zeros, a rack pillar's LEDs; the band carries the terms line + the pointer for all 180 frames. The maintenance
// hand (orange cuff) drops the 0 in the box and hangs 3, then 6: 36 (NOV 21 -> DEC 27, 2023), and is gone by o120.
// On 3.1 (o120) the after-hours timer steps the house light down (the button chord F-C-G, the contactor's kick gives
// the sign its one flicker); the moth comes to the one light left, bumps the box twice and lands beside the terms
// line's final period at o150 (3.3); out at o179.
// Timing sheet: timeline.ts. Set + board: set.ts. Hand: cast.ts. Moth: moth.ts. Band: band.ts. Words: text.ts.
//
// FILES (outputs; nothing else in the repo was touched):
//   out/lookdev/outro/outro-c.mp4                   the mock-up, 1080p 24 fps, 204 f = 8.5 s, temp music + designed SFX
//   out/lookdev/outro/c/outro-c-ep1-1080p.mp4       the same file (the brief's name; a hard link)
//   out/lookdev/outro/c/outro-c-key{1,2,3}-*.png    three key stills (o40, o100, o170), 1920x1080, from the ENCODED mp4
//   out/lookdev/outro/c/outro-c-keyframes.png       the sheet: six numbered frames from the mp4 + the bar grid
//   out/lookdev/outro/c/outro-c-ep10.png            the extra still: how Ep10 differs (1920x1080)
//   out/lookdev/outro/c/outro-c-variants.png        Ep1 (o112) / Ep4 (the reset) / Ep10 side by side
//   out/lookdev/outro/c/outro-c-{music,sfx,mix}.wav the temp score (OST engine), the SFX stem, the final mix (8.5 s)
//   out/lookdev/outro/c/qa/                         qa.json, sound.json, the readability crops (full size + 480x270)
//
// RE-RENDER (from the repo root; SC = any scratch folder; ~5 min on a busy 14-core box):
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
//   node "$SC/preview.cjs" "$SC" 2 o0 o105 o150 s0 check
//
// Composition ids: outro-c-ep1 (204 f), outro-c-stills (3 f: 0 Ep1 o112, 1 Ep4, 2 Ep10).
//
// HANDOFF (2026-09-26, third pass: the cold read's fixes)
//   Changed, and why (the cold read of the 11 s file):
//   - "End it when the 36 lands": 4 bars -> 3 (10.0 s -> 7.5 s; the file 11.0 s -> 8.5 s). The old bar 3 (a hold
//     where only a speck moved) is cut. The house light steps down on 3.1, the frame the hand is gone; the sign's
//     flicker is now the contactor's kick (o121-122) instead of its own beat; the moth lands inside the chord's ring
//     (o150) and the frame holds 1.2 s after it, fading from o168. Score: the knee's push is now Dbmaj7(#11) (the old
//     bar 3's colour, in half a beat) straight into F-C-G on 3.1; the chip kink echo is gone.
//   - "Nothing on screen explains why it's 36": the directory's title row reads CLOSED DEC 27, 2023 (Ep4 APR 30,
//     2025; Ep10 2027??), so the count reads as days since, as of that date. The reset date stays off screen.
//   - "The moth ... looks like a stray cursor or a compression speck": it's now outro E's moth (moth.ts, copied, not
//     imported): 21 x 17 native, dusty wings, fast flutter, a silhouette when it's against the lit face. Landed, it's
//     17 x 21 beside the period, antennae either side of the dot. It never crosses the plate well (the count) or a
//     band letter (checked, all frames).
//   - "RENDERED IN CODE wrap breaks the ledger grid; VOICES gets 3 dots": the board is 364 px wide (was 304); every
//     credit is one line; the values share one column (x 162); the leaders sit on one 4-px grid that stops at x 158.
//     A blank groove separates the title row from the credits.
//   - The variants sheet's Ep1 panel is o112 (house light on, the hand letting go), like Ep4's. Ep10's INTERN row
//     now slides in from the right (FFICE still arriving), since its value sits on the column, not right-aligned.
//   Measured (qa/qa.json, qa/sound.json, from the ENCODED mp4): every line up 7.5 s (the 36 for 3.1 s); contrast
//   11.4:1 on the board, 11.75:1 on the band, 2.77:1 on the red count digits, 4.2:1 on the slug; band stillness
//   p99.99 diff 2/255 (moth masked); music -16.0 LUFS, mix -16.0 LUFS / -2.8 dBTP, last frame -44 dBFS. OST engine
//   QA: F-major and both no-third windows pass; knee_whole reads 2 (felt + chip 8va: one knee, two lines).
//   tools/preview.ts check (in qa.json check_txt): the band is never covered; the moth never covers or touches a letter.
//   Open issues / weaknesses:
//   - Reading: 7.5 s up. The terms line (87 chars, 5.4 s at 16 cps) fits; terms + pointer need 8.2 s, 0.7 s more
//     than the frame holds; the directory (16.8 s of text) is a skim, as before, now with a date to find.
//   - Still a lot of text on one card: the board, the band and the red DRAFT slug (the slug and "(CREATOR)" are the
//     brief's placeholders; they read as unfinished because they are).
//   - The hand comes DOWN from above frame (the brief says it rises): from below it would cover the credits for a bar.
//   - The moth is copied from E, not shared: the five should move to one shared module (a lead decision). At 17 x 21
//     it's cartoon-big for the lobby's scale; it reads at 480x270 because of that.
//   - The close sign has three plate slots; the lobby wide (rooms/lobby.ts paintSign, sc 30) has one.
//   - Real credits on a parody company's wall: legal question (OUTRO-PROPOSALS §10, legal 4). LEGAL TEXT: DRAFT.
//   - Leaves Mas's POV every week; the count and the CLOSED date must be checked against each episode's facts.md.
//   - Temp score only, never heard by a person; the room tone, neon hum and SFX are designed placeholders.
//   - OUTRO-PROPOSALS §0/§4/§9 and the comparison strip still say C is 10 s / 4 bars (outside this folder: the lead's).
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
