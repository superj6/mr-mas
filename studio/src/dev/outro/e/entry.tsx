// MR. MAS — outro proposal E, "file closed" (show/production/OUTRO-PROPOSALS.md §6, §9). A VISUAL OUTLINE: a
// moving mock-up to compare against A-D, not a final. This entry registers ONLY this builder's compositions.
//
// POLISH PASS (2026-09-26, after a cold read of the 11.0 s v1). What changed and why:
//   - THE BLACK TAIL IS GONE. v1 ended on 4.5 s of near-black and near-silence before the moth landed ("the last
//     4.5 s feel like leftover"). Now the moth comes in WITH the collapsing line of light and lands on 4.1, 1.25 s
//     after the click; the mock-up ends 0.83 s later. Ep1 mock-up 11.0 s -> 9.33 s (outro + stinger 10.0 -> 8.33 s).
//   - THE MOTH READS AS A MOTH. v1's 14x9 moth was read as "a tiny fly", "a dead pixel or a stray pointer". It is
//     now 17x21 native (68x84 at 1080p): dusty forewings with a spot, mauve hindwings, striped body, long antennae,
//     a fast 1s flutter, and it loops inside title-safe instead of hugging the frame edge. Its flutter is ~14 dB
//     under the knee (v1's was inaudible), and it lands in silence.
//   - THE CREDITS BUILD AND GET TIME. v1 showed the block all at once for 5.0 s and the pointer pulled the eye away.
//     Now the knee's eight notes light the block a line a note (o0-o55), the file holds 2 beats longer (the click
//     moved 3.1 -> 3.3), and the pointer only sets off at o128, when the block has been whole for 3.0 s. The outro
//     proper is 3 bars, 7.5 s (was 2.5 bars, 6.25 s): still a quarter of the intro.
//   - SHORTER ON-SCREEN VALUES (a proposal for OUTRO-PROPOSALS §1.1, needs sign-off): `title` drops the filename
//     (the title bar shows it); `picture · music: rendered in code`; `voices: synthetic · none cloned`. The two
//     AI-disclosure rows keep their meaning whole. Block 252 -> 174 characters; the long forms go to the notice.
//     The Ep3 and Ep10 stills use the same values.
//   - Keys one rung brighter (C6; the cold read lost `created by:` and `voices:` at 480x270).
//
// POLISH PASS 2 (2026-09-27, after a second cold read of the 9.33 s v2; its one fix: "make the last beat read").
//   - THE ENDING. v2's moth landed on 4.1 (o180), twitched through a settle to o187, and the mock-up ended on o199:
//     the cold read felt "about 0.4 s of true stillness" and "a tail". Now the moth flies ONE path (in with the click,
//     at the collapsing light, a stall when it goes out, straight down) and lands on 3.4 (o165), 0.625 s sooner,
//     with no settle drawings. Nothing moves from o165 to the end, o195 (4.2): 31 frames, 1.29 s, measured on the mp4.
//   - NO LOOP CURSOR. The desktop caret read as "a stray pixel" with "nothing near it". It is dropped; the window
//     now closes to its own centre and the desktop keeps only the terms line (and, in Ep1, the moth). The loop to
//     the intro is carried by the sound alone (the felt F5 + chip glint on the click, the intro's f0 sound).
//   - THE MOTH READS AS A MOTH AT 480x270. It is drawn upright, wings flat and symmetrical, the way a moth sits on a
//     lit screen, not head-left round the dot (read as "a smudge on a full stop"), with a 3-px gap after the period.
//     Hindwings and body one rung brighter so the whole shape shows on black.
//   - NO SWEEP. v2 lit the credits a line per knee note; the cold read chased the cyan instead of reading. The block
//     is whole from the cut and the file's caret blinks on the beat from o0.
//   - EP1'S WINDOW IS SIZED TO ITS FILE: 288 px wide, centred (window.ts EP1_WIN), not full width (the cold read:
//     the empty right half looked like "a plain editor screenshot"). Ep3 and Ep10 keep the full-width window (their
//     stills are byte-identical). A deviation from OUTRO-PROPOSALS §6 "full frame"; EP1_WIN = WIN reverts it.
//   - The script's last lines (`**MAS**`, `noted.`, `CUT TO BLACK on the hum.`) one rung brighter (G5), the weakest
//     text at 480x270 in the cold read.
//   Ep1 mock-up 9.33 s -> 9.17 s (220 frames; the outro + stinger 8.17 s). The plain week is unchanged at 8.5 s.
//
// WHAT IT IS (Ep1 values). 220 frames at 24 fps = 9.17 s: 1.0 s stand-in + the 7.5 s outro + 0.67 s more of Ep1's
// moth (the moth itself starts inside the outro, with the click).
//   m0-23     STAND-IN for the episode's last frame (Ep1's button isn't built): the cold open's dark-room MEDIUM,
//             drawMedium f56-62, labelled on screen as a stand-in. Audio: the button chord's tail + server_hum.
//   o0-149    cut on the downbeat to the file window, sized to the file and centred, generic original chrome,
//             `ep1.0_research_preview.md` scrolled to its end: raw markdown (the script's last lines, `### END CREDITS`,
//             then the credits as a `---` front-matter block), whole from the cut. The file's caret blinks on the beat
//             (on 8 / off 7) from o0. The terms line + the pointer line sit on the desktop's bottom line, OUTSIDE the
//             window, from o0 to the end.
//   o128-149  his pointer (mfinale/callart drawPointer) in from frame-right to the close box (o128-141, on 2s),
//             hover o142-147, press o148-149
//   o150-156  3.3 click. The window closes in whole-pixel drawings to its own centre: rows, line, dot, ember
//   o157-179  the black desktop, nothing on it but the terms line. A plain week ends on o179 (composition
//             outro-e-plain, 204 frames = 8.5 s with the stand-in; still for its last 0.96 s)
//   o150-195  Ep1 only: the Senate moth comes in from frame-right with the click, at the height of the collapsing
//             light; the light goes out at o157, it drops straight to the terms line and lands on 3.4 (o165) BESIDE
//             the final period (3-px gap; the dot stays visible), upright, wings flat. Still from o165. End o195 (4.2).
// Temp music (tools/track.py, OST engine, read-only): the knee whole once in bar 1 (felt, swung, chip 8va), the
// button chord F-C-G on 2.1, the Water Line settle C4->F4 on 2.3, the bass re-strike under a soft open fifth on 3.1,
// felt F5 + a 1-frame chip F6 glint with the click on 3.3 (the cold open's f0 sound), the F5's decay alone under the
// moth and the still frame, nothing on 4.1. No third anywhere. Designed sound (tools/mix.py): server_hum under the
// stand-in, post_click on o150, a papery wing flutter panned with the moth (o150-164), one tiny settle on the
// landing (o165), then only the F5's tail, faded out by o195.
//
// THE LOOP CURSOR (v1/v2 closed into mfinale/bookend.ts LOOP_CURSOR, 96,76, the built intro's caret spot, instead of
// the brief's 298,124). Polish pass 2 drops the desktop cursor altogether (see above). If the showrunner wants the
// visual loop back, it should sit where it relates to the terms line or the moth, not float mid-frame.
//
// MEASURED (polish pass 2). Text (node <bundle> <dir> 1 verify): every glyph present; the terms line 389 px, one row;
// its pixels and the pointer line's identical on all 196 Ep1 outro frames and all 180 plain-week frames (never moved,
// never covered, the moth included); the period stays visible under the landed moth, whose nearest pixel is 5 px
// from any glyph; after the close the plain week's desktop has 0 pixels besides the terms/pointer text. Stillness:
// the last change of any pixel is o165 (Ep1: 31 still frames, 1.29 s) and o157 (plain: 23 frames, 0.96 s); on the
// encoded mp4 the last frame-to-frame change >8/255 is o165, and o166-o195 differ by at most 2/255 (encoder noise).
// Read time at 16 characters/s: every line alone fits (longest, `AI tools: …`, 3.0 s; all lines whole 5.33 s before
// the pointer moves, 6.25 s on screen); the credits block as a whole (174 ch) needs 10.9 s: skimmed, not read in
// full; the terms (87 ch, 5.4 s) fit in every week; terms + pointer (131 ch, 8.2 s) get 8.17 s in Ep1 and 7.5 s in a
// plain week. Encoded mp4: box-reduced to 480x270 it matches the native render within 13/255 on every outro frame
// (14 on the stand-in). Audio (decoded from the mp4): the knee's first F4 at 1.002 s (o0 = 1.000), the click at
// 7.250 s (o150); Ep1 -16.2 LUFS, -2.7 dBTP; plain week -16.1 LUFS; RMS -18.5 dBFS under the file, -23.6 during the
// flight (click + F5 + flutter), -45.6 over the still frame. OST QA: no written third, the knee whole = 1 statement
// (felt + its chip double; the engine counts 2), chip share 10 %, no warnings. NOBODY HAS LISTENED to the mix.
// OUTPUTS (out/lookdev/outro/e/): outro-e-ep1-1080p.mp4 (copied to ../outro-e.mp4) · outro-e-plain-1080p.mp4 ·
// outro-e-still-{1-file,2-close,3-end}.png (from the mp4) · outro-e-ep{1,3,10}-still.png · outro-e-keyframes.png ·
// outro-e-variants.png · outro-e-ep1-{music-temp,mix}.wav · outro-e-plain-mix.wav · check/ (the 480x270 copies).
//
// RE-RENDER (from studio/; S = your scratch folder; FFD = node_modules/@remotion/compositor-linux-x64-gnu). Polish
// pass 2 staged everything in $S/stage and moved it into out/ with mv, so no other link to an output is written to.
//   # 1. music (OST engine, read-only) and the two mixes (Ep1 with the moth; a plain week)
//   (cd .. && audio/.venv-theme/bin/python studio/src/dev/outro/e/tools/track.py --no-stems --no-loop --out $S/music)
//   (cd .. && audio/.venv-theme/bin/python studio/src/dev/outro/e/tools/mix.py $S/music $S/stage)
//   # 2. picture, 1080p (480x270 native at 4x, nearest-neighbour), then mux
//   npx remotion render src/dev/outro/e/entry.tsx outro-e-ep1 $S/picture.mp4 --concurrency=4 --crf=12 --bundle-cache=false --log=error
//   npx remotion render src/dev/outro/e/entry.tsx outro-e-plain $S/picture-plain.mp4 --concurrency=4 --crf=12 --bundle-cache=false --log=error
//   LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y -i $S/picture.mp4 -i $S/stage/outro-e-ep1-mix.wav \
//     -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart $S/stage/outro-e-ep1-1080p.mp4
//   LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y -i $S/picture-plain.mp4 -i $S/stage/outro-e-plain-mix.wav \
//     -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart $S/stage/outro-e-plain-1080p.mp4
//   # 3. the per-episode stills (1080p)
//   for e in 1 3 10; do npx remotion still src/dev/outro/e/entry.tsx outro-e-stills $S/stage/outro-e-ep$e-still.png --props="{\"ep\":$e}" --bundle-cache=false --log=error; done
//   # 4. key stills + sheets from the ENCODED mp4, and the 480x270 check copies (needs Pillow)
//   python3 src/dev/outro/e/tools/sheets.py $S/stage $S/frames
//   # 5. into place (renames), and the top-level copy
//   (cd $S/stage && for f in *.mp4 *.wav *.png check/*.png; do mv -f "$f" "$REPO"/out/lookdev/outro/e/"$f"; done)
//   cp ../out/lookdev/outro/e/outro-e-ep1-1080p.mp4 ../out/lookdev/outro/.outro-e.tmp && mv -f ../out/lookdev/outro/.outro-e.tmp ../out/lookdev/outro/outro-e.mp4
//   # fast pixel-exact preview / the text + stillness checks, no Remotion:
//   npx esbuild src/dev/outro/e/tools/preview.ts --bundle --platform=node --outfile=$S/oe.js && node $S/oe.js $S/pv 2 o:30 ep:10 verify
//
// OPEN (needs a human): the shorter on-screen values and the one-line terms need showrunner + legal sign-off (legal
// review pending; `LEGAL TEXT: DRAFT` slug on every outro frame); `(creator)` is a placeholder; nobody has listened;
// dropping the loop cursor and the content-sized Ep1 window are polish-pass deviations from OUTRO-PROPOSALS §6 (that
// doc still says 6.25 s, full frame and (298,124) for E and is not this builder's to edit); the Ep3 and Ep10 rungs
// are stills only (Ep10's "values before keys" and self-closing window are not animated); out/lookdev/outro/
// outro-compare.mp4 and outro-compare-sheet.png were cut from the v2 E and are now stale for E.
//
// FILES: timeline.ts (every frame number and the audio cue list) · window.ts (window geometry per file, Ep1 file,
// terms, close) · moth.ts (stinger) · variants.ts (Ep3 strawberry.jpg EXIF panel, Ep10 pace.yaml typed by the
// machine) · scene.ts (one pure draw per frame) · text.ts (the shared 7-px face + local `#` etc.) · tools/ (preview +
// verify, track.py, mix.py, sheets.py). Shared code is imported read-only; nothing outside this folder was edited.
// Lookdev slugs: `LEGAL TEXT: DRAFT` (every outro frame) and the stand-in's own label. Legal review is pending.
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../shared/makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroE, OutroEStill} from './Outro';
import {TOTAL, TOTAL_PLAIN} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-e-ep1', component: OutroE, durationInFrames: TOTAL, fps: 24, props: {slug: true, sting: true}},
  {id: 'outro-e-plain', component: OutroE, durationInFrames: TOTAL_PLAIN, fps: 24, props: {slug: true, sting: false}},
  {id: 'outro-e-stills', component: OutroEStill, props: {ep: 10, slug: true}},
];

registerRoot(makeRoot(frames));
