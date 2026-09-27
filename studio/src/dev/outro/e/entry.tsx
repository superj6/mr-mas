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
// WHAT IT IS (Ep1 values). 224 frames at 24 fps = 9.33 s: 1.0 s stand-in + the 7.5 s outro + 0.83 s of Ep1's moth.
//   m0-23     STAND-IN for the episode's last frame (Ep1's button isn't built): the cold open's dark-room MEDIUM,
//             drawMedium f56-62, labelled on screen as a stand-in. Audio: the button chord's tail + server_hum.
//   o0-149    cut on the downbeat to the file window, full frame, generic original chrome, `ep1.0_research_preview.md`
//             scrolled to its end: raw markdown (the script's last lines dim, `### END CREDITS`, then the credits as
//             a `---` front-matter block, lit a line per knee note o0-o55). The terms line + the pointer line sit on
//             the desktop's bottom line, OUTSIDE the window, from o0 to the end. The caret appears on 2.1 (o60) and
//             blinks on the beat (on 8 / off 7).
//   o128-149  his pointer (mfinale/callart drawPointer) in from frame-right to the close box (o128-141, on 2s),
//             hover o142-147, press o148-149
//   o150-157  3.3 click. The window closes in whole-pixel drawings toward the loop cursor: rows, line, dot, ember
//   o158-179  the black desktop: the loop cursor blinks on the beat (first on at o165), the terms line still up. A
//             plain week ends on o179 (composition outro-e-plain, 204 frames = 8.5 s with the stand-in).
//   o152-199  Ep1 only: the Senate moth enters at the collapsing line's height, loses the light, drops in two loose
//             swings and lands on 4.1 (o180) BESIDE the terms line's final period (antennae one pixel right of the
//             dot; the dot stays visible), wings folded from o188. End o199.
// Temp music (tools/track.py, OST engine, read-only): the knee whole once in bar 1 (felt, swung, chip 8va), the
// button chord F-C-G on 2.1, the Water Line settle C4->F4 on 2.3, the bass re-strike under a soft open fifth on 3.1,
// felt F5 + a 1-frame chip F6 glint with the click on 3.3 (the cold open's f0 sound), the F5 alone under the moth,
// nothing on 4.1. No third anywhere. Designed sound (tools/mix.py): server_hum under the stand-in, post_click on
// o150, a papery wing flutter panned with the moth (o152-179), two tiny settles, silence on landing.
//
// DELIBERATE DEVIATION: THE LOOP CURSOR is at (96,76) (mfinale/bookend.ts LOOP_CURSOR = the cold open's
// CARET_FRAME), not the brief's (298,124). intro SCRIPT §3.1 says (298,124), but the BUILT intro (out/intro/*.mp4)
// centres its f0 caret macro, and leaves its f712-719 caret, at (96,76). Closing into (96,76) matches the intro
// the viewer actually sees next; (298,124) would jump. One constant (window.ts CURSOR) if the intro owner rules
// otherwise.
//
// MEASURED (polish pass). Text (node <bundle> <dir> 1 verify): every glyph present; the terms line 389 px, one row;
// its pixels and the pointer line's are identical on all 200 Ep1 frames and all 180 plain-week frames (never moved,
// never covered, the moth included); the period stays visible under the landed moth, whose nearest pixel is 3 px
// from any glyph. Read time at 16 characters/s: every line alone fits (longest, `AI tools: …`, 3.0 s, lit 3.5 s
// before the pointer moves); the credits block as a whole (174 ch) needs 10.9 s and gets 6.25 s on screen, 5.3 s
// before the pointer moves: it is skimmed, not read in full; the terms (87 ch, 5.4 s) fit in every week; terms +
// pointer (131 ch, 8.2 s) get 8.33 s in Ep1 and 7.5 s in a plain week. Encoded mp4: box-reduced to 480x270 it
// matches the native render within 13/255 per channel on every outro frame (14 on the stand-in). Audio (decoded
// from the mp4): the knee's first F4 at 1.001 s (o0 = 1.000), the click at 7.250 s (o150); Ep1 mix -16.2 LUFS,
// -2.7 dBTP; plain week -16.1 LUFS; RMS -19 dBFS under the file, -28 after the click, the moth's flight -32, the
// landed 0.83 s -48 (the silence the moth lands in). OST QA: no written third, the knee whole = 1 statement (felt +
// its chip double), chip share 10 %, no warnings. NOBODY HAS LISTENED to the mix; these are meter readings.
// OUTPUTS (out/lookdev/outro/e/): outro-e-ep1-1080p.mp4 (copied to ../outro-e.mp4) · outro-e-plain-1080p.mp4 ·
// outro-e-still-{1-file,2-close,3-end}.png (from the mp4) · outro-e-ep{1,3,10}-still.png · outro-e-keyframes.png ·
// outro-e-variants.png · outro-e-ep1-{music-temp,mix}.wav · outro-e-plain-mix.wav · check/ (the 480x270 copies).
//
// RE-RENDER (from studio/; S = your scratch folder; FFD = node_modules/@remotion/compositor-linux-x64-gnu):
//   # 1. music (OST engine, read-only) and the two mixes (Ep1 with the moth; a plain week)
//   (cd .. && audio/.venv-theme/bin/python studio/src/dev/outro/e/tools/track.py --no-stems --no-loop --out $S/music)
//   (cd .. && audio/.venv-theme/bin/python studio/src/dev/outro/e/tools/mix.py $S/music out/lookdev/outro/e)
//   # 2. picture, 1080p (480x270 native at 4x, nearest-neighbour), then mux
//   npx remotion render src/dev/outro/e/entry.tsx outro-e-ep1 $S/picture.mp4 --concurrency=4 --crf=12 --bundle-cache=false --log=error
//   npx remotion render src/dev/outro/e/entry.tsx outro-e-plain $S/picture-plain.mp4 --concurrency=4 --crf=12 --bundle-cache=false --log=error
//   LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y -i $S/picture.mp4 -i ../out/lookdev/outro/e/outro-e-ep1-mix.wav \
//     -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart ../out/lookdev/outro/e/outro-e-ep1-1080p.mp4
//   LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y -i $S/picture-plain.mp4 -i ../out/lookdev/outro/e/outro-e-plain-mix.wav \
//     -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart ../out/lookdev/outro/e/outro-e-plain-1080p.mp4
//   cp ../out/lookdev/outro/e/outro-e-ep1-1080p.mp4 ../out/lookdev/outro/outro-e.mp4
//   # 3. the per-episode stills (1080p)
//   for e in 1 3 10; do npx remotion still src/dev/outro/e/entry.tsx outro-e-stills ../out/lookdev/outro/e/outro-e-ep$e-still.png --props="{\"ep\":$e}" --bundle-cache=false --log=error; done
//   # 4. key stills + sheets from the ENCODED mp4, and the 480x270 check copies (needs Pillow)
//   python3 src/dev/outro/e/tools/sheets.py ../out/lookdev/outro/e $S/frames
//   # fast pixel-exact preview / the text checks, no Remotion:
//   npx esbuild src/dev/outro/e/tools/preview.ts --bundle --platform=node --outfile=$S/oe.js && node $S/oe.js $S/pv 2 o:30 ep:10 verify
//
// OPEN (needs a human): the shorter on-screen values and the one-line terms need showrunner + legal sign-off (legal
// review pending; `LEGAL TEXT: DRAFT` slug on every outro frame); `(creator)` is a placeholder; nobody has listened;
// OUTRO-PROPOSALS §0/§6/§7 still say 6.25 s and (298,124) for E (that doc is not this builder's to edit); the Ep3 and
// Ep10 rungs are stills only (Ep10's "values before keys" and self-closing window are not animated).
//
// FILES: timeline.ts (every frame number and the audio cue list) · window.ts (window, Ep1 file, terms, close,
// cursor) · moth.ts (stinger) · variants.ts (Ep3 strawberry.jpg EXIF panel, Ep10 pace.yaml typed by the machine) ·
// scene.ts (one pure draw per frame) · text.ts (the shared 7-px face + local `#` etc.) · tools/ (preview + verify,
// track.py, mix.py, sheets.py). Shared code is imported read-only; nothing outside this folder was edited.
// Lookdev slugs: `LEGAL TEXT: DRAFT` (every outro frame) and the stand-in's own label. Legal review is pending.
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroE, OutroEStill} from './Outro';
import {TOTAL, TOTAL_PLAIN} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-e-ep1', component: OutroE, durationInFrames: TOTAL, fps: 24, props: {slug: true, sting: true}},
  {id: 'outro-e-plain', component: OutroE, durationInFrames: TOTAL_PLAIN, fps: 24, props: {slug: true, sting: false}},
  {id: 'outro-e-stills', component: OutroEStill, props: {ep: 10, slug: true}},
];

registerRoot(makeRoot(frames));
