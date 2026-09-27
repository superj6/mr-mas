// MR. MAS · OUTRO PROPOSAL B, "the Orb's verdict" · a VISUAL OUTLINE (a moving mock-up to compare, not a final).
// Brief: show/production/OUTRO-PROPOSALS.md §1.1 (the text package), §3 (B) and §9 (row B). Showrunner: "i was
// thinking the outro should be shorter than the intro probably. but let's create a few proposals with some sort of
// visual outlines for comparison". Nothing here is decided; legal review of the on-screen text is PENDING.
//
// WHAT IT IS (pass 4). The outro is 180 frames (3 bars at 96 BPM, 7.5 s; the intro is 30 s), every week. Ep1's moth
// stinger now plays INSIDE bar 3 while the Orb is still on screen (no extra time). The mock-up file is 222 f = 9.25 s:
// a 24-frame stand-in "last frame" (the cold open's dark-room MEDIUM, mcoldopen/medium.ts drawMedium f56-62: Ep1's
// button isn't built) + the outro + 18 f of black while the score's open fifth releases.
//   o0      cut to black; the bottom band (480x67 native) lights with the terms line and the pointer and holds,
//           unmoved and uncovered, to the cut (o179, 7.5 s). The Orb (r 31, frame-right) steps up in 3 palette steps.
//   o9      lit: its toast's header posts the scan target, `scan: ep1.0_research_preview.md`. o12 glint.
//   o15-19  the iris turns to the lens (servo C6).
//   o30-54  the scan: a cyan cone sweeps down across the toast. GLYPH tokens in its leading half; behind its axis the
//           credits resolve into plain type and STAY (legible from o47 / o49), so reading starts before the knee.
//   o60,75  bar 2, the knee whole, straight (the machine's frame): the two credit chips land around that type on the
//           flat line (the words never move). o90-112, the leap: the iris narrows one held step per note.
//   o120    `viewer: human ✓` + the chime (C7); o135 the score's verdict F5 -> C6, the open fifth (no third).
//   o150    a plain week: the iris relaxes back to its toast (3 drawings), o165 glint, o179 cut.
//           Ep1: o138 the moth drops in from the top of frame and bumbles across the Orb's lit lens (a glass tap);
//           o150 the iris swivels down after it; o160 it settles beside the terms line's final period (1 px gap, never
//           on a word) and folds its wings; o165 the iris narrows on it one step; o172 a wing twitch; o179 cut: the
//           Orb, the toast, the band and the moth go out together.
//
// THE WORDS (timeline.ts). B's condensed toast (§3), trimmed for read time; the six §1.1 fields map onto it:
//   scan: ep1.0_research_preview.md            (title; the show name MR. MAS is not on this surface)
//   made in code by (creator), with ai tools   (created by · written with AI · picture/music rendered in code · AI tools)
//   voices: synthetic · none cloned            (voices)
//   viewer: human ✓                            (the verdict: the one line that drifts across the season)
//   band: "A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it." (389 px, one row)
//         "Full notice and sources: in the description."
//   The full 90-word notice, the tools by name and the receipts live in the episode description (+ MP4 metadata),
//   per OUTRO-PROPOSALS §1.1. The shared face lacks the em dash of Ep10's `viewer: —`; it is drawn locally (art.ts tx).
//
// READ TIME (tools/preview.ts `check`, measured on rendered pixels; tools/sheets.py adds the encoded-mp4 checks):
//   every row passes on its own (legible 2.5-7.1 s; <= 7.2 chars/s). The whole toast (117 chars) read IN ORDER by one
//   reader fits at 18 chars/s (0.58 s spare) and 20 (1.23 s), NOT at 16 (0.23 s past the cut). The band alone needs
//   7.3 s at 18 and is on 7.5 s, but only ~1 s of it is free of the toast. One first-time reader cannot read all 248
//   characters once in 7.5 s (13.8 s at 18 cps): see out/lookdev/outro/b/qa/qa.json and the sheet's read lane.
//
// HANDOFF (2026-09-26, pass 4: the cold-view fixes. The pass-3 code and file are not kept: the scratch copy was deleted).
//   changed  (1) THE ONE THING: the Ep1 moth no longer plays as a 3.75 s coda over the empty band after the Orb has
//            gone (a cold viewer: "a second, quieter ending after the first one has already landed"). It lands INSIDE
//            bar 3 while the Orb is on screen, and the Orb's closing glance (the button the cold viewer liked) is now
//            a look down at it. The file drops from 12.25 s to 9.25 s; the outro is still 7.5 s. (2) The moth is
//            redrawn 19 px wide as a moth's delta at rest, dusty brown (it read as a pink speck / bow-tie at 480x270).
//            (3) `viewer: verified: human` -> `viewer: human ✓` (one colon; read as clunky; the drift becomes the check
//            eroding into hedges: Ep6 `human (probably)`, Ep10 `—`). (4) No slug on the outro's frames: `LEGAL TEXT:
//            DRAFT` and "(creator) = credit TBD" sit on the stand-in second (not part of the outro), in the MP4's comment
//            tag, under the key stills and on the sheets, so the outro is seen as it would air. (5) The score ends on
//            the cut (notes end at 4.1, the drone fades through the 0.75 s of black).
//   why      a cold view of the pass-3 file (the extra, empty coda; `(creator)` and the corner slug read as unfinished;
//            the double colon; the moth unreadable at phone size).
//   measured the band never covered or moved (every lit frame, eps 1 / 6 / 10); the moth's rest box (x 435-453, 1 px
//            right of the period) and its whole flight clear of every text box (it crosses only the Orb, o146-151);
//            read time (above); text crops of the ENCODED mp4 vs the exact native frames: max error <= 7/255, contrast
//            5.7-12.3:1 on the outro's text (5.2:1 on the stand-in label); the mix -17.9 LUFS, -3.0 dBTP, the score
//            alone -17.8 LUFS over the outro; the score's chroma from o135 to the end: F and C only; the file's last
//            100 ms at -98 dBFS. The OST engine still flags one marker (3.125 s, the repeated F on 2.2: its onset
//            detector finds the previous F 58 ms early); pass 3's loudness note is gone.
//   needs a human  the showrunner's pick and credit line; legal review of the one-line terms + pointer and of the
//            condensed AI disclosure; the OST owner's Ep1 colour; a listen (the mix was measured, not auditioned).
//   open     the read budget (above); `(creator)` is still a placeholder on screen; MR. MAS is not on this surface;
//            the lens look every week; the moth enters while a slow reader may still be on the verdict; Ep7's "no
//            verdict" is not built; Ep10's score is described, not rendered.
//
// FILES (outputs; nothing else in the repo was touched):
//   out/lookdev/outro/b/outro-b-ep1-1080p.mp4        the mock-up, 1920x1080, 24 fps, 222 f, temp score + designed SFX
//   out/lookdev/outro/outro-b.mp4                    the same file (a hard link)
//   out/lookdev/outro/b/outro-b-key{1-scan,2-verdict,3-moth}.png   key stills from the ENCODED mp4 + a caption bar
//   out/lookdev/outro/b/outro-b-keyframes.png        the small sheet: six numbered frames, the bar grid, the read lane
//   out/lookdev/outro/b/outro-b-ep10.png             the extra still: how an Ep10 version differs
//   out/lookdev/outro/b/outro-b-variants.png         Ep1 / Ep6 / Ep10 verdicts, Ep10 at the scan, a plain week's end
//                                                    vs Ep1's moth end
//   out/lookdev/outro/b/outro-b-{music,sfx,mix}.wav  the temp score (OST engine), the SFX stem, the mix (48 kHz, 24-bit)
//   out/lookdev/outro/b/qa/                          text crops at full size and 480x270, 480x270 frames, qa.json
// CODE: timeline.ts (clock, words, per-episode data) · scene.ts (the PixelScene, the moth's flight) · art.ts (band,
//   chips, Orb, moth, stand-in label) · OutroB.tsx (hosts) · audio/track.py (score) · audio/mix.py (SFX + mix) ·
//   tools/preview.ts (Node preview + pixel checks) · tools/sheets.py (stills, sheets, QA) · tools/render.sh (all of it).
//
// RE-RENDER (from the repo root; SC = any scratch folder; about 3-6 min on a busy 14-core box):
//   bash studio/src/dev/outro/b/tools/render.sh "$SC"
// which runs, in order:
//   (cd studio && npx remotion render src/dev/outro/b/entry.tsx outro-b-ep1 "$SC/outro-b-silent.mp4" \
//       --concurrency=4 --crf=12 --bundle-cache=false --log=error)
//   (cd studio && npx remotion render src/dev/outro/b/entry.tsx outro-b-stills "$SC/stills" --sequence \
//       --image-format=png --concurrency=3 --bundle-cache=false --log=error)   0 Ep10 o40, 1 Ep10 o140, 2 Ep6 o140, 3 Ep6 o172
//   PYTHONDONTWRITEBYTECODE=1 audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/track.py --out "$SC/music" --no-loop
//       (imports audio/ost/engine READ-ONLY; its calibration cache is redirected to a copy in $SC; nothing under audio/)
//   audio/.venv-theme/bin/python studio/src/dev/outro/b/audio/mix.py "$SC"        -> the three WAVs in out/lookdev/outro/b/
//   Remotion's bundled ffmpeg (LD_LIBRARY_PATH=studio/node_modules/@remotion/compositor-linux-x64-gnu): video stream
//       copy + AAC 256k -> outro-b-ep1-1080p.mp4; hard link -> out/lookdev/outro/outro-b.mp4; decode every frame to $SC/dec
//   node "$SC/pv.js" ... check (the pixel checks, eps 1 6 10); audio/.venv-theme/bin/python studio/src/dev/outro/b/tools/sheets.py "$SC"
// Fast Node preview (no Remotion; GLYPH tokens approximated as tinted cells):
//   (cd studio && npx esbuild src/dev/outro/b/tools/preview.ts --bundle --platform=node --outfile="$SC/pv.js")
//   node "$SC/pv.js" "$SC" 2 1 64,158,200        |  node "$SC/pv.js" "$SC" 1 1 grid:34,66,158,172,184,200  |  ... 1 1 check
// Composition ids: outro-b-ep1 (222 f; props {ep: 1 | 6 | 10} give the other episodes' states, and no moth outside Ep1),
//   outro-b-stills (4 f).
import {registerRoot} from 'remotion';
import {makeRoot} from '../../makeRoot';
import type {FrameDef} from '../../../shared/frame-def';
import {OutroB, OutroBStills} from './OutroB';
import {TOTAL, STILLS} from './timeline';

const frames: FrameDef[] = [
  {id: 'outro-b-ep1', component: OutroB, durationInFrames: TOTAL, fps: 24, props: {ep: 1}},
  {id: 'outro-b-stills', component: OutroBStills, durationInFrames: STILLS.length, fps: 24},
];

registerRoot(makeRoot(frames));
