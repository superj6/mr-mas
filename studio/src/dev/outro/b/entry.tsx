// MR. MAS · OUTRO PROPOSAL B, "the Orb's verdict" · a VISUAL OUTLINE (a moving mock-up to compare, not a final).
// Brief: show/production/OUTRO-PROPOSALS.md §1.1 (the text package), §1.3 (the stinger slot), §3 (B) and §9 (row B).
// Showrunner: "i was thinking the outro should be shorter than the intro probably. but let's create a few proposals
// with some sort of visual outlines for comparison". Nothing here is decided; legal review of the on-screen text is PENDING.
//
// WHAT IT IS (pass 5). A plain week's outro is 180 frames (3 bars at 96 BPM, 7.5 s; the intro is 30 s). A week with a
// stinger keeps the Orb on screen one bar longer: Ep1's is 240 frames (10 s), its moth running from inside bar 3 through
// bar 4 as one continuous scene (§1.3 allows up to 2 bars after). The mock-up file is 282 f = 11.75 s: a 24-frame
// stand-in "last frame" (the cold open's dark-room MEDIUM, mcoldopen/medium.ts drawMedium f56-62: Ep1's button isn't
// built) + Ep1's outro + 18 f of black while the score's open fifth releases.
//   o0      cut to black; the bottom band (480x67 native) lights with the terms line and the pointer and holds,
//           unmoved and uncovered, to the cut. The Orb (r 31, frame-right) steps up in 3 palette steps.
//   o9      lit: its toast's header posts the show and the file, `MR. MAS · ep1.0_research_preview.md`. o12 glint.
//   o15-19  the iris turns to the lens (servo C6).
//   o30-54  the scan: a cyan cone sweeps down across the toast. GLYPH tokens in its leading half; behind its axis the
//           credits resolve into plain type and STAY (legible from o47 / o49), so reading starts before the knee.
//   o60,75  bar 2, the knee whole, straight (the machine's frame): the two credit chips land around that type on the
//           flat line (the words never move). o90-112, the leap: the iris narrows one held step per note.
//   o120    `viewer: human ✓` + the chime (C7), and the verdict LIGHTS THE LENS (the scan's hot palette + a glow in the
//           glass: the lamp). o135 the score's verdict F5 -> C6 over a felt fifth, the open fifth (no third).
//   o150    a plain week: the lamp goes out as the iris relaxes back to its toast (3 drawings); o165 glint; o179 cut.
//           Ep1 instead: o130 the moth drops in from the top of frame, drawn to the lamp; o142-163 it loops the lens in
//           front of the glass, going cyan in its light; o165 (3.4) it bumps the glass (a tuned tink) and tumbles; the
//           iris flinches shut; o171 the iris swivels down after it; o195 (4.2) it lands beside the terms line's final
//           period (1 px gap, never on a word) and folds its wings; o210 (4.3) the Orb narrows on it and lays a thin,
//           dotted beam of its light on it (the scan, once more, on a moth); o222 a wing twitch; o239 the last frame:
//           the cut takes the Orb, the toast, the band and the moth together. The moth is at rest 1.8 s before the cut.
//
// THE WORDS (timeline.ts). B's condensed toast (§3), trimmed for read time; the six §1.1 fields map onto it:
//   MR. MAS · ep1.0_research_preview.md        (title: the show + the episode's file, exactly §1.1's title field)
//   made in code by (creator), with ai tools   (created by · written with AI · picture/music rendered in code · AI tools)
//   voices: synthetic · none cloned            (voices)
//   viewer: human ✓                            (the verdict: the one line that drifts across the season)
//   band: "A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it." (389 px, one row)
//         "Full notice and sources: in the description."
//   The full 90-word notice, the tools by name and the receipts live in the episode description (+ MP4 metadata),
//   per OUTRO-PROPOSALS §1.1. The shared face lacks the em dash of Ep10's `viewer: —`; it is drawn locally (art.ts tx).
//
// READ TIME (tools/preview.ts `check`, measured on rendered pixels; tools/sheets.py adds the encoded-mp4 checks):
//   Ep1 (10 s): every row passes on its own (legible 5.0-9.6 s; <= 5.0 chars/s). The whole toast (121 chars)
//   read IN ORDER by one reader fits at 16 chars/s (2.0 s spare), 18 (2.9 s) and 20. The band (131 chars) is on 10 s,
//   3.2 s of it free of the toast at 18 cps. A plain week (Ep6, 7.5 s): the toast in order fits at 18 (0.20 s spare) and
//   20 (0.79 s), NOT at 16 (0.67 s past the cut); the band gets 0.57 s free of the toast (Ep10: in order fits at 16).
//   One first-time reader still cannot read every character once: Ep1 252 chars = 14.0 s at 18 cps in 10 s; a plain
//   week 255 = 14.2 s in 7.5 s. See out/lookdev/outro/b/qa/qa.json and the keyframes sheet's read lane.
//
// HANDOFF (2026-09-27, pass 5: a cold view of the pass-4 file, and its one thing. The pass-4 code is kept in the
// pass's scratch folder until the pass ends, then deleted with it; this header is the record.)
//   changed  (1) THE ONE THING, the moth ("the only moment with character, and it's easy to miss: dull brown on navy,
//            a speck at 480x270; it arrives after the eye's glow has faded, so 'moth drawn to the light' isn't clear;
//            it sits on 'it.' for only about 0.7 s"). The verdict now lights the Orb's lens (the lamp), and the moth
//            comes to THAT light: it loops the lit lens, bumps the glass, and only then drops to the band. It is
//            redrawn 25 px wide (was 19), pale grey-beige with warm edges (was dull brown), goes onto the K ramp (warm
//            under cyan) near the lamp, and is rim-lit cyan by the lens whenever the lens is lit, at rest too, where the
//            Orb's thin beam motivates the rim. It rests 1.8 s before the cut (was 0.8 s): Ep1's outro gains one bar
//            (7.5 -> 10 s; a plain week stays 7.5 s). (2) Misread: "nothing names the show, so a cold viewer doesn't
//            learn what they just watched": the header is now `MR. MAS · <file>`, exactly the §1.1 title field
//            (pass 4's `scan: ` prefix went, to keep a plain week's read budget: with it, Ep6 missed by 0.14 s).
//            (3) Misread: "the loudest audio isn't on the payoff" (the knee in bar 2 swelled loudest with nothing new
//            on screen): the knee is thinner and softer (brushes -6 dB, chip -5 dB, lower velocities), the verdict
//            fuller (a felt fifth under vibes + celesta, the chime +3 dB), the moth's bump a clear tuned tink; bar 3
//            now holds the cue's loudest moment (measured below). (4) The beam's rays are dotted
//            (solid, they read as strings hanging from the Orb). (5) render.sh gives B's outputs their own inodes
//            before writing (another agent's snapshot of the tree held hard links to them; its copies were left as
//            they were), clears stale QA frames, and drops pass 4's outro-b-key3-moth.png (the key stills are now
//            numbered in time order: key3 is the lamp, key4 the moth at rest).
//   why      a cold view of the pass-4 file (out/lookdev/outro/outro-b.mp4, 9.25 s).
//   measured the band's terms line and pointer unchanged on every lit frame (Ep1 o0-o239; Ep6, Ep10 o0-o179: 0
//            covered frames); the moth's rest box x 435-459, 1 px clear of the final period, and its whole flight clear
//            of every text box (0 hits; it crosses only the Orb, o144-169, the loop of the lamp); read time (above);
//            text crops of the ENCODED mp4 vs the exact native frames: max error <= 8/255, contrast 5.7-12.3:1 on the
//            outro's text (the pointer lowest), 5.2:1 on the stand-in label; the moth readable at 480x270 by eye (qa/
//            frame-480x270-o158, -o220). Audio: the mix -17.7 LUFS, -3.0 dBTP; the score alone -17.8 LUFS over Ep1's
//            10 s (bar 4 is pp; pass 4 measured -16.8 over 7.5 s). Per bar, the mix (integrated / max momentary LUFS):
//            bar 1 -21.6 / -14.9, bar 2 (the knee) -15.0 / -13.0, bar 3 (verdict, lamp, moth at the lens) -16.7 / -12.7,
//            bar 4 -22.3 / -18.3: the loudest moment is now in bar 3. The score alone, bar 2 over bar 3: 7.4 LU in pass 4,
//            1.7 LU now. Chroma from o135 to the end: F and C only (A/F 0.004 in bar 3, <= 0.018 in bar 4); the file's
//            last 100 ms at -98 dBFS. The OST engine still flags one marker (3.125 s, the repeated F on 2.2: its onset
//            detector finds the previous F 58 ms early); no loudness note.
//   needs a human  the showrunner's pick and credit line; legal review of the one-line terms + pointer and of the
//            condensed AI disclosure; whether a stinger may add a bar (Ep1 10 s vs a plain week 7.5 s); the OST owner's
//            Ep1 colour; a listen (the mix was measured, not auditioned).
//   open     the read budget (above): not everything once for a first-time reader, and a plain week misses the
//            in-order read at 16 cps; a stinger week runs 2.5 s longer than a plain one (Ep1 10 s vs 7.5 s): the
//            showrunner may want one fixed length; `(creator)` is still a placeholder on screen and "with ai tools" stands
//            in for the full AI line (legal); the lens look, and now the lamp, every week; the Orb's flinch (o166-170)
//            happens partly behind the tumbling moth and may read as a flicker; the beam on the moth is a new beat added
//            to motivate the rim light (a taste call: beamHalfAt() in scene.ts removes it); the moth flies fast (6-8
//            native px a frame, on 2s), so a slow viewer may see a flutter more than a loop; untouched cold-view taste
//            notes: the flat terminal chips, the stock decode, the band reading as a web footer, the empty middle; Ep7's
//            "no verdict" is not built; Ep10's score is described, not rendered; the stand-in is the cold open's shot;
//            for a few frames mid-scan, tokens brush the bottom of the still-resolving line. Downstream: the compare
//            reel (studio/src/dev/outro/_compare/reel.py) still lists B as 180 f with the moth o138-160 and keys o134 /
//            o176, and out/lookdev/outro/outro-compare.mp4 holds pass 4's B until its owner re-runs it.
//
// FILES (outputs; nothing else in the repo was touched):
//   out/lookdev/outro/b/outro-b-ep1-1080p.mp4        the mock-up, 1920x1080, 24 fps, 282 f, temp score + designed SFX
//   out/lookdev/outro/outro-b.mp4                    the same file (a hard link)
//   out/lookdev/outro/b/outro-b-key{1-scan,2-verdict,3-lamp,4-moth}.png   key stills from the ENCODED mp4 + a caption bar
//   out/lookdev/outro/b/outro-b-keyframes.png        the small sheet: six numbered frames, the bar grid, the read lane
//   out/lookdev/outro/b/outro-b-ep10.png             the extra still: how an Ep10 version differs
//   out/lookdev/outro/b/outro-b-variants.png         Ep1 / Ep6 / Ep10 verdicts, Ep10 at the scan, a plain week's end
//                                                    vs Ep1's moth end
//   out/lookdev/outro/b/outro-b-{music,sfx,mix}.wav  the temp score (OST engine), the SFX stem, the mix (48 kHz, 24-bit)
//   out/lookdev/outro/b/qa/                          text crops at full size and 480x270, 480x270 frames, qa.json
// CODE: timeline.ts (clock, words, per-episode data) · scene.ts (the PixelScene, the lamp, the moth's flight, the beam)
//   · art.ts (band, chips, Orb + lens glow, moth, stand-in label) · OutroB.tsx (hosts) · audio/track.py (score) ·
//   audio/mix.py (SFX + mix) · tools/preview.ts (Node preview + pixel checks) · tools/sheets.py (stills, sheets, QA) ·
//   tools/render.sh (all of it).
//
// RE-RENDER (from the repo root; SC = any scratch folder; about 5-7 min on a busy 14-core box):
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
//   node "$SC/pv.js" "$SC" 2 1 64,182,244        |  node "$SC/pv.js" "$SC" 1 1 grid:34,66,152,182,219,244  |  ... 1 1 check
// Composition ids: outro-b-ep1 (282 f; props {ep: 6 | 10} give a plain week's states, cut at o179, black after, no moth),
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
