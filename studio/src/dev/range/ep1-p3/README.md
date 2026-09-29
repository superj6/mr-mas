# E1-P3 · Below, above, around (style-range 1.D) · handoff

A fully programmatic filler for Ep1 sc 30, the landlord beat (Nov 20, 2023): the bullpen turns into
MACROSOFT's house style (flat corporate vector illustration) on Tasya's three words, around the one pixel man.
The brief is `show/bible/style-range.md` §6.1a, "E1-P3". Style-range 1.D rules FILLER = FINAL for this beat, so
code is the final route too. No external API was called.

## Outputs (`out/lookdev/range/ep1/`)

| File | What |
|---|---|
| `ep1-p3.mp4` | 437 f, 24 fps, 1920×1080, H.264 + AAC 256k (the rebuilt v5 sound + pass 7's additions) + a soft English subtitle track |
| `ep1-p3-key-1-below-p250.png` | "below": the vector floor being laid out from the floor line under Tasya, the rest of the room still pixel |
| `ep1-p3-key-2-landlord-p318.png` | the room held in the landlord's style; Tasya and Mas's island in pixel |
| `ep1-p3-key-3-hello-p360.png` | S7.03: Mas, the one pixel island, looking down on his own camera, brow up after "Hello." |
| `ep1-p3-sheet.png` / `ep1-p3-sheet-blind.png` | 25 frames from the encoded mp4, captioned / uncaptioned |

All stills and sheet tiles are pulled from the encoded mp4, not from the renderer.

## The clip, frame by frame (p0 = reel 412.0 s of `out/ep01/act4/reel/ep01-act4-v5.mp4`)

- p0–119 S7.02 wide, pixel (`rooms/bullpen` walkout, drawn without its crowd; `pixel.ts drawCrowdAt` re-stamps the crowd
  per frame in the room's own draw order). A drizzle runs past the windows (`rainOn`, on 2s, with beads on the glass).
  The navy coat at front left (seed 40) walks out: she turns and walks past the hall mouth and off frame left (gone by
  p75, before Mas's question lands). Seed 8 glances back after her (p22–57); the woman by the window (seed 5) turns to
  her neighbour on Mas's question (p70–99); boxes are re-gripped (p36, p92, p102); everyone breathes on held drawings.
  Mas at his end desk with the two badges (warm skin rungs), Tasya mid-floor IN FRONT of the bench. Mas's room-sprite
  mouth follows the take's recorded cues.
- p120–325 S7.02b Tasya's MCU, pixel, lip-synced from the take's own mouth cues (on 2s). **Its own camera** (`CAM.tasya`:
  1.25x, 5 output px per native px, x0 60, y0 5). Tasya on the LEFT third, the portrait mirrored so he faces Mas (in his
  eyeline behind him at his end desk); skin in daylight rungs; **hands below the frame** (portrait arms 'none', pass 7).
  He breathes in before each phrase (p118–126, p158–166, p232–240), his head dips a pixel on "fine", "IP", "capability",
  goes down on "below", up on "above", level on "around"; he leans a pixel toward Mas from "We are" (p241) and settles
  on an out-breath from p312; blinks at p141/186/230/262/318. The room is soft 2 around Mas's island (full value), the
  back row only; rain on the window behind him; seed 5 turns to her neighbour on "all the IP rights" (p184–209), seed 3
  glances toward the hall (p146–175), boxes re-gripped (p124, p168, p214, p236, p256).
  - "below" p246–257: the vector floor is laid out from the floor line under him, both ways, along the plate's own
    perspective (edges are floor lines of the vanishing point), crisp, eased, with a thin cloud-white seam on its front.
  - "above" p269–280: the vector ceiling is laid out from the ceiling line over his head the same way (no seam: white on
    white).
  - "around" p292–308: a crisp iris with a 3 px cloud-white rim (and a faint 8 px halo) closes from the frame's corners
    onto Mas's island (radius R0·(1−t)^2.2). Everything outside it is the landlord's whole room (shell, bench, the back
    row, their boxes; the island stays pixel), so the staff turn as it passes them, with no batches. Nothing in the
    pixel crowd moves between p284 and p312 except breath. When the ring passes Tasya his blazer's cyan glints go to
    slate and his window side takes a one-pixel daylight rim.
- p326–388 S7.03 Mas's MCU on the RIGHT third facing screen-left, `masLookDown`, warm key, the orange edge pixels gone,
  the black hole beside his neck filled with the hood's own deepest rung (pass 7), his window-side rim cool. **Its own
  camera** (`CAM.mas`: 1.5x, x0 160, y0 68), the back row only minus the one whose head would grow out of his. The room
  steps back one value rung over **16 frames**, p336–351 (haze 0.14 → 0.24, eased, in 0.02 steps). He breathes
  (out-breaths p342–353 and p370–381), blinks at p333–334, his brow goes up from p358 and his head dips a pixel toward
  the floor from p357 (he listens). The vector staff behind him breathe and blink. No contact shadow.
- p389–436 S7.05, hard cut, pixel `drawMadaM` among the fires; each fire lights the chair back / wall / glass around it,
  embers rise on 2s. The rail `NOV 21, 2023 · ~10 PM PT` types from p394. (The dotted ring in the sky is the show's
  speed-dial Rolodex wheel egg from sc 27, parked 'still'; the small ring over Mada is his spinner. Both are the shared
  plate's, kept so the exit matches the reel.)
- The mp4 carries a soft subtitle track (mov_text, English, default on) from `tools/subs.py`; the picture has no typed
  dialogue (pov-and-framing 4.7.3 rule 4, as Act Four v4).

## Files

- `entry.tsx` (makeRoot entry: `ep1-p3`, `ep1-p3-probe`), `P3.tsx` (the per-frame compositor, the cameras, the three
  moves, caches).
- `pixel.ts` the pixel side: plates, layer ownership, the crowd's life (poses: breath, re-grip, glance, the walker),
  the rain, the busts and their motion and local fixes, the wide, the exit and its fire light.
- `vector.ts` the landlord's house style: palette, the corner-radius family, shell, bench, staff, boxes (three
  cloud-greys and four details inside the matched silhouette: off-centre tape, tape folded over the edge, a shipping
  label, a hand-hole), the staff's coats in the pixel coats' hue families, depth cue. It is the "additive vector path
  module" of 1.D, kept local until the engine owner adopts it.
- `px-kit.ts` MCU helpers copied from the Act Four animatic (not imported: that pass is editing those files); pass 7 added
  an optional head split to `drawBust` (the rows above the neck move on their own, in whole pixels).
- `data.ts` GENERATED by `tools/lock.py` (the v5 reel's clock and the three takes' words and mouth cues).
- `tools/sound.py` the sound pass, `tools/subs.py` the subtitle track, `tools/sheet.py` the sheets, `tools/preview.ts` a
  Node preview of the pixel side, `tools/build.sh` everything.

## Re-run (from `studio/`)

```
../ops/heavy.sh src/dev/range/ep1-p3/tools/build.sh <scratch dir>              # lock, bundle, render, sound, mux, stills, sheets, promote
NOPROMOTE=1 ../ops/heavy.sh src/dev/range/ep1-p3/tools/build.sh <scratch dir>  # the same, leaving mp4 + stills in <scratch> for a look
npx remotion render <bundle> ep1-p3-probe <dir> --sequence --props='{"at":[250,318,360]}' --frames=0-2 --concurrency=1
```

Render: CPU (Chrome 2D canvas), `--concurrency=4`, 27 s for 437 frames on 2026-09-27 01:48 (134 s at load average ~45
on 2026-09-26 22:50). A Node preview of the pixel side (no browser) is `tools/preview.ts`. The sound pass takes 1–3 min (it re-runs the v5 bed in memory: cut before its
MASTER, so it writes nothing, with two bookkeeping patches that keep the bullpen bed's components apart; the rebuilt v5
buses match the v5 mix slice to -143.6 dBFS residual).

**Which v5 bed:** the Act Four reel's own pass snapshotted the bed that made `mix.wav` (15:08) at
`audio/reel/ep01-act4-v5/history/v5a-1508/` and then began a new revision of `bed.py` and `show/reel/ep01-act4-v5.json`
in place (22:10–22:27). `sound.py` reads the snapshot's `bed.py` with the snapshot's json (and falls back to the live
bed only if the snapshot is gone), so it keeps matching the reel this clip is cut from. The timing lock was re-checked
against the live json on 22:40: sc 30's beats are unchanged and `data.ts` came out byte-identical.

## Sound (measured, not heard)

The three v5 takes, the M7a render at its v5 offsets, and the v5 bullpen and boardroom beds are the v5 mix's own
samples. Added: Rhodes chords on the stressed syllables (p250 Abmaj9, p273 Cmaj9, p296 Emaj9: the render's own pad
chords at those moments), a sparse packing rustle in the line gaps before the change (pass 7: the flaps land on boxes
you see re-gripped, p36, p124, p236), a faint drizzle on the glass under the pixel room (pass 7, −44 dBFS RMS, from the
window side), the murmur, key taps and rain going with the share of the frame still pixel as the ring closes (pass 7;
pass 6 stepped at p296/300/304) while the HVAC hands over to a steady corporate hush, one muffled key-ring jangle
inside the wall at p312, and "Hello." given a low, close shelf. Numbers in `<scratch>/sound-qa.json` at build time.

## Pass 5 (2026-09-26, 22:00–23:00): what changed and why

Three render-look-fix rounds on the encoded mp4 (full size and 480×270), then the build:
- **r0 → r1: Mas's shadow was invisible.** The floor's oval sat mostly under the room's bottom edge (y 203) and behind
  his bust. Now a separate, un-hazed layer. A head-and-shoulders cast shadow along the floor was tried in a probe and
  dropped: at 480×270 it read as the nearest staff member's shadow.
- **r0 → r1: thirteen identical boxes** read as one pasted asset. Now three cloud-greys and four details, all inside
  each pixel box's silhouette (a new hash slot, so no staff attribute changed).
- **r1 → r2: Tasya's window side was his darkest side** (a dark cut-out edge against the brightest part of the room):
  the window-side rim above, from p296.
- **r2 → r3:** the beanie's pom moved onto the pixel pom (it overshot the pixel outline by about 1 native px); the
  sound pass pointed at the v5 bed snapshot (above).
- **Measured on the final encode:** 437 frames, 1920×1080, 24 fps, 18.21 s, AAC 48 kHz stereo, peak −4.5 dBFS; mix
  −16.9 LUFS against the v5 mix slice's −16.9; Rhodes peaks −20.4 / −19.8 / −17.8 dBFS at p250 / p273 / p296; key ring
  −30.4 dBFS at p312. Entry and exit against the Act Four v4 animatic (`out/ep01/act4/animatic/act4-animatic-v4.mp4`,
  its picture area at native 480×270): p0 vs its frame 4510 (S7.02) differs on 0.17% of native pixels (mouth and blink),
  p436 vs its frame 4700 (S7.05) on 1.42% (the fires' animation). Each step's pixel-in-slate drawing sits within
  0.01–0.04 of the vector drawing's mean lightness (floor 0.363 → 0.373, ceiling 0.949 → 0.916, walls 0.586 → 0.629),
  so the colour and light arrive on the word and the drawing four frames later, with no flash between.

## Passes 6–7 (2026-09-26 23:00 → 2026-09-27 02:00): the cold read's fixes

A cold-viewer review of pass 5's clip (frames at full size and 480×270, plus per-frame change) found: the change looked
like a rendering fault (4-frame lavender / white in-betweens, rows popping in 4 frames apart), the holds were frozen
(the wide changed on ~0.2% of pixels per frame), the close-ups were giant busts over the unchanged wide, and a list of
misreads. Pass 6 (a run that was killed before its build; its source edits were kept and checked) and pass 7 (this one):

- **The change reads as designed moves** (pass 6 → 7). Pass 6 dropped the in-betweens and the row batches for spreads
  from Tasya and one closing ring, all with soft edges. Pass 7 makes each move crisp: the floor and the ceiling are
  laid along the plate's perspective lines from the line under / over him (a cloud-white seam on the floor's front),
  and the ring is a crisp iris with a thin white rim (the soft edge printed as a dark smudge around the pixel room).
- **The holds live** (pass 7). The crowd is re-stamped per frame in poses: a walker leaves the room, glances, box
  re-grips, breath; a drizzle runs past the pixel windows (and stops with the pixel room: the brochure has a blue sky).
  Tasya breathes, nods on his stresses, follows his own words with his head, leans toward Mas, blinks every 1.5–3 s.
  Mas breathes, blinks, raises his brow and dips his head toward the floor on "Hello.".
- **Staging** (pass 6): each single has its own camera on the room (Tasya 1.25x, Mas 1.5x), the MCUs keep only the back
  row, Tasya faces Mas, Mas's floor shadow is gone (it made him read as a giant), his orange edge fringe is gone and his
  window-side rim is cool, Tasya is drawn in front of the bench in the wide (his legs no longer show through the desk).
  Pass 7: S7.03's focus pull is 16 frames, not 8 (the cold read saw a one-frame snap in pass 5).
- **Misreads** (pass 7): Tasya's clasped hands (a bread roll, then a loaf) are below the frame; the black hole in Mas's
  hood is the hood's deepest rung; the camel and green coats keep their hue families in the landlord's style (a staff
  member no longer changes identity as the ring passes). The front-row figure that changed hair and skin (seed 12) is
  no longer in the singles at all.
- **Kept on purpose:** the black band under the picture is the show's rail band (THE RECORD, pov-and-framing §1.2;
  "HIS SIDE", and the date in S7.05), the same in every Act Four shot this clip cuts against. The dotted wheel in the
  night sky and the ring over Mada are the show's Rolodex-wheel egg and Mada's spinner (shared plate, sc 27 on). The calm
  man among small fires is the teleplay's own image for sc 30 ("the only chair that isn't burning").

**Measured on pass 7's encode** (`out/lookdev/range/ep1/ep1-p3.mp4`, 2026-09-27 01:49): 437 frames, 1920×1080, 24 fps,
18.21 s, H.264 + AAC + mov_text (eng). Mix −16.9 LUFS against the v5 slice's −16.9, peak −4.45 dBFS, no limiting; the
rebuilt v5 buses still match the v5 mix slice at −143.6 dBFS residual; Rhodes −20.4 / −19.8 / −17.8 dBFS at p250 / 273
/ 296; drizzle −44.0 dBFS RMS over p0–290; key ring −30.4 dBFS at p312. Motion (share of 480×270 pixels changing by more
than 8/255 from the frame before, mean per frame, and frames that move at all), pass 5 → pass 7: the wide 0.00% (0 of
119) → 0.53% (96 of 119); Tasya's single before the change 0.03% (21 of 125) → 0.28% (63 of 125; drawings on 2s);
S7.03 one 37.8% jump at p336 → 9 small moves, the largest non-cut change anywhere 9.4% (the ceiling lay). Entry and exit
against the v4 animatic's picture area (native grid): p0 differs on 2.0% (pass 5: 0.2%: the walker, the rain, the
glances; p0 is a cut, from S7.01), p436 on 3.8% (pass 5: 2.0%: pass 6's fire light and embers). Render 27 s for 437
frames (CPU, `--concurrency=4`, lightly loaded), sound 55 s. No external API, no cost.

## Needs a person

- Watch and listen at full size and at phone size. Nothing here was watched in real time or heard.
- The blind read (brief's pass/fail) with the uncaptioned sheet and the clip.
- Open issues (pass 7):
  - **The splice.** The clip ends 5 frames before S7.05 ends in the v5 reel (lock: S7.05 runs to p442). Since pass 6,
    S7.05 carries fire light and embers that the reel's S7.05 does not, so splicing the clip into the reel as is pops
    the glow off for the last 5 frames. Either extend the clip to p442 (`CLIP_F` in `tools/lock.py` and `sound.py`) or
    give the reel's S7.05 the same fire light.
  - **"below" is the quietest move.** The visible floor in Tasya's single is a thin strip under the bench, and the
    landlord's slate is close in value to the soft pixel carpet, so at phone size it reads as the floor lightening with
    a seam running out. "above" (white ceiling) and "around" (the iris) read strongly. Judge at speed whether "below"
    needs more (a lighter floor, a longer seam) or whether its quietness is right for the first of three.
  - The walker's walk is a four-drawing background cycle (legs sheared from the hem, a foot lifted on the passing
    drawings); her feet slide a little. She is gone by p75, before Mas's question lands. Judge whether she pulls the eye
    from Mas at the start of the shot.
  - Rain is new story weather for the bullpen on Nov 20 (the brochure's blue sky is its answer). Judge taste; the sound
    under it is a faint bed nobody has heard.
  - Tasya's light still changes as the iris passes him (the slate remap and the rim). He stays pixel and isn't redrawn.
  - S7.03 shows only Mas's bust (the animatic's framing); his chair and desk read as the pixel island in S7.02b.
  - The dotted wheel in the night sky (the Rolodex egg) and the ring over Mada (his spinner) are read by a cold viewer
    as a Ferris wheel and a loading spinner; both are show continuity and kept.
  - The Rhodes chords are TEMP (GeneralUser Rhodes via the OST engine). No one has heard the sound.
