# mrollcall: "THE PLAYERS" roll call (intro f480-539, bar 9)

INTRO_PIXEL_BRIEF v2.1 bar 9: eight portrait flashes, one per eighth note, playing the knee motif
F F F F G Ab C F. BASE pixel throughout. The last flash is the moment's only GLYPH.

## Files
- `src/shared/pixel/cast/rollcall.ts` holds the portrait art (8 painters, `RC_SIZE`). It uses the cast-portrait method: polygon planes with explicit ramp indices, plus `renderFigure` edges and hand-pixelled stamps.
- `src/dev/mrollcall/timeline.ts` holds `MR`, `toGlobal` / `toLocal`, `CUTS`, `flashAt(g)`, `WINDOWS`, `HANDOFF` and `MOTIF`.
- `src/dev/mrollcall/scene.ts` holds `drawRollcall(fb, g)`, `drawFlash`, `drawSheet`, the fields and plates, the cursor glyph layers and the dusk hand-off.
- `src/dev/mrollcall/Rollcall.tsx` holds `<MRollcall/>` (local frames), `<MRollcallSequence/>` (mounted at 480), `<MRollcallSheet/>` and `<MRollcallHold g/>`.
- `src/dev/mrollcall/entry.tsx` is the dev entry.
- `src/styleframes/mrollcall.frame.tsx` defines the compositions `mrollcall` (60 f), `mrollcall-sheet` and `mrollcall-hold` (`--props='{"g":506}'`).
- `src/dev/mrollcall/tools/preview.ts` is a Node preview. Build it with `npx esbuild src/dev/mrollcall/tools/preview.ts --bundle --platform=node --outfile=<scratch>/rc.cjs`, then run `node rc.cjs <dir> <scale> f:<g> win:<n>:<k> strip:<n> contact sheet`. Glyph tokens are drawn as flat cells in Node, so judge the cursor in Remotion.

## Timing
Composition frame 0 is global 480. Mount it with `<MRollcallSequence/>`, or wrap `<MRollcall/>` in `<Sequence from={480} durationInFrames={60}>` yourself.

**Snapping rule:** flash n (0-based) cuts at `floor(480 + n*7.5)`.
- On-beat eighths land exactly.
- Off-beat eighths fall on a half frame and are floored, so the picture cuts half a frame *ahead* of the stab, never behind it.

| # | note | cut (global) | frames | player | action (k = frames since cut) |
|---|---|---|---|---|---|
| 1 | F | **480** | 7 | TASYA | key-ring jangle, 2 drawings on 2s (A k0-1, B 2-3, A 4-5, B 6) |
| 2 | F | **487** | 8 | RADNUS | the beacon sits on a bracket right above his head; its lamp turns (4 drawings on 2s) and the red beam fans out of the dome, left wall (k0-1), back of head (k2-3), face (k4-5), profile (k6-7) |
| 3 | F | **495** | 7 | KRAM | thermos offered (rises 3, 1, 0 px on k0-2), the check bobs 1 px on 2s, steam alternates |
| 4 | F | **502** | 8 | NESNEJ | toss: in hand k0-1, then open hand; GPU edge-on k2-3, face-on k4-5, edge-on k6-7, climbing |
| 5 | G | **510** | 7 | RIMA TAMURI | k0 house dark (she is 4 px off her mark); k1 the cone SNAPS on and she lands 1 px short; k2+ on her mark |
| 6 | Ab | **517** | 8 | THE WHALE | breach: snout breaks the surface k0-1, half out k2-3, arched apex k4-7 (the spray falls on k6-7) |
| 7 | C | **525** | 7 | RUMPT | silhouette only; hand down k0, the point snaps out on k1 (2 px past its mark), settled k2+ |
| 8 | F' | **532** | 8 | (the cursor) | GLYPH block cursor: on k0-3, off k4-5, on k6-7; the pull-back on k5-7 (f537-539) |

Every cut frame (k0) brightens the bevel's lit edge one step (N6 to N8) for one frame. That is the stab. No flashes, no shakes.

## Design rules (what makes it one piece)
- **The window plays the melody.** Inner height is `150 + 100/12` px per semitone, at a fixed 124:150 aspect, around one centre (240, 130):
  - 1-4: 124x150
  - G: 138x166
  - Ab: 146x176
  - C: 172x208
  - F': 206x250, which fills the screen height

  The four Fs are the same window in the same place (the flat of the curve). Then the frame leaps with the brass.
- **Contrast rises.**
  - 1-4 sit on flat, muted faction fields with a hard N0 drop shadow: Macrosoft slate G1, Elgoog navy N3 with a 4-colour muted strip, Atem violet CX.U1, Invidia green L0.
  - 5-8 sit on black. The portraits become light sources in the dark: warm-white spotlight, moonlit sea, gold backlight, cyan cursor.
- **Framing tightens.**
  - 1-4 are drawn at dialogue-portrait scale with headroom.
  - RIMA is drawn 16% bigger (`enlarge()` re-rasterises the polygons; stamps keep pixel size).
  - The whale fills its window, the RUMPT silhouette is a chest-up close shot, and the cursor window is the whole screen height.
- **Faces face alternately:** L, R, L, R across 1-4 (the lineup trope). Key lights:
  - TASYA: monitor cyan.
  - RADNUS: warm, with the red gel.
  - KRAM: violet-white.
  - NESNEJ: warm, with a green back rim.
  - RIMA: top spot.
  - Whale: moon.
  - RUMPT: gold rim only.
- **Name plates** are 3x5 micro text in low-contrast faction tones under each frame (easter eggs). RUMPT's reads `???`. The cursor has none.
- **The hand-off.** On k5-7 the cursor window closes in 3 held steps (124x150, then 62x76, then 26x32) onto the dusk. The dusk is the skyline's own sky formula, far city, quay lamps and water reflection, copied from `src/dev/mfinale/skyline.ts` (`skyColumn`, `drawFarCity`, the water pass) at camera 0. So f539's world is f540's world before the towers pop. It is copied rather than imported, so a broken skyline file can't break this render. If mfinale changes its sky, re-copy those ~40 lines.
- **Palette:** master palette plus the castrivals CX dusk violets (U0-U5) only. The audit over all 60 frames and the sheet found 72 colours and zero strays.

## Rig limits / acting notes
- Portraits are single drawings. The only replacements are the jangle (2 drawings), the beacon (4), the GPU (2), NESNEJ's hand (closed/open), the whale (3 poses; the arch is an integer row lean), RUMPT's arm (2) and RIMA's house-dark vs lit.
- No mouths or blinks: at 7-8 frames per flash there is no time to read them.
- The RADNUS beam is a gel **remap**. Figure pixels take the full red ramp (it tops out at R3, so the white collar goes red, not yellow) and wall pixels a dim one, with 5 px dithered edges. The fan's apex is fixed at the lamp; a dim dithered glow rings the dome. No blending.
- The cursor is a hand-built `GlyphLayer`: a forced `█` token in a 7x12 cell with full bloom, plus about 4.5% faint shimmer tokens (C3/C4, alpha 0.16-0.36) filling the window ("the dark is full of text").
- Per-episode (brief v2.1): RUMPT's silhouette fills in from Ep3. Swap `drawRumpt` for a lit rig and keep the podium. The cursor window "gains a face": raise the shimmer density inside a head-shaped `Mask` week by week.

## Known issues / next
- RIMA is better after the AD pass (see below) but is still the plainest face; a 3/4 head angle would give her more life than the frontal spot pose.
- KRAM has the eager half-smile now, but it is small (2 px); at 7 frames the thermos carries him.
- The window sizes follow semitones, so G and Ab differ by only 8 px. That is musically true but visually subtle.
- Flashes 1-4 leave the field mostly empty at 1080p (the window is 26% of the width). That is deliberate (the standard portrait convention, and it makes the leap read), but a showrunner may want the base window bigger. Change `winSize()` in `timeline.ts` and re-seat the 1-4 art (`FIG_DX/FIG_DY`).
- Audio isn't wired. The 8 stabs should land on `CUTS` (brass doubled by chip lead, per the brief).

## Art-director pass (2026-09-25)
What changed after review, and why:
- **RADNUS: the siren is now over his head** (the gag is "polite smile *under* a siren"; it used to be a small dome on a shelf at the left, with a vertical red stripe that had no visible source). The beam is now a fan from the dome that sweeps the room. The four Elgoog tiles moved to the left wall to make room. Fixed a gel bug: the red ramp topped out at W7, so the white collar flashed **yellow** under the beam. It now tops out at R3.
- **RUMPT: the point reads as a point.** The old hand was a flat, thin strip on a low arm, set against the darkest drape, so it read as a baton. Now the arm, fist, index finger and thumb are drawn along one axis about 40° up to camera-left, the finger continues the arm's line, and it is all one silhouette group, so no rim line is drawn where the arm crosses the body. The ear notch that threw little gold rim marks inside the head, which could read as a feature, is filled. The gold halo is stronger and sits slightly toward the hand so the point cuts out. The snap has a 2 px whole-pixel overshoot on k1. He is still pure N0 with a W7 rim and no facial features.
- **RIMA: less heavy.** The socket planes went from S1 to a thin S3 crease. The brows are 1 px higher and thinner (a head and a fine tail). The eyes have paper whites and a 4-px iris with the spot's catchlight on top. The small closed smile now lifts at the corners, with the lower lip catching the spot. The neck no longer reads as a banded column: there is one cast shadow under the jaw, the neckline is raised into a shoulder slope, and the neck part now ends at the neckline.
- **KRAM:** paper whites (skin-toned whites read as a squint), so the "wide, unblinking" stare shows. The eager closed half-smile pulls the near corner up 2 px.
- Unchanged, and approved as they are: TASYA, NESNEJ, THE WHALE, the cursor and the hand-off, the timing and snapping rule, the window-plays-the-melody sizes, and the fields.
- Checked: all 60 frames plus the sheet use 72 colours with 0 strays (master palette plus CX violets). The MP4 decodes to 60 frames at 1920x1080 and 24 fps. My files typecheck clean.
