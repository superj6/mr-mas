I built the cold open (intro f0–119) as the Remotion composition **`mcoldopen`**, including the masked GLYPH Orb scan at f99–104. Its frame numbers are the intro's global frames. I checked every stage by eye in Node previews and Remotion stills, over at least three fix rounds. The MP4 is 960x540, 24 fps, exactly 120 frames, and I pulled frames out of it to confirm they match the stills. My files typecheck clean; the only project errors are 11 in another builder's `src/dev/realism/bake/bake.ts`.

**How the span plays**
- **f0–44, the dolly-out:**
  - It steps out ×3 on each beat, each step a hard cut.
  - f0 is a macro of the black LCD, where the blinking caret shows as lit subpixel stripes.
  - f15 shows the screen's individual pixels, and typing starts at f24.
  - f30 lands on the medium two-shot: the monitor, Mas 3/4 front lit only by the screen, and the Orb at his far shoulder.
  - The caret stays at the same spot in frame through every step, so it reads as one move.
- **f45–59, the wide:** the rebuilt dark room with Mas typing at his desk.
- **f60–98, back in the medium:**
  - The cut lands on the D-flat in the pause, and his head tilts at f63.
  - He types "unclear which side." and on "side" the you-are-here dot climbs the chart and leaves the screen (f90).
  - His eyes snap to the lens at f94, and the Orb's iris swivels to it at f97–98.
- **f99–104, the scan cutaway to the wide:** a fan opens from the iris and sweeps the room. Only inside it, the room is an endless data-center cathedral drawn in glyph tokens. Mas and the Orb stay pixel.
- **f105–117, the medium again:**
  - The one-pixel smile lands at f107.
  - He clicks Post at f112 while still looking at us, and the chart snaps vertical.
  - The line breaks into tokenizer chips (the semicolon is its own token) that stream past the lens.
  - The room brightens in palette steps, then dithers into white.
- **f118–119:** exactly the 1-bit paper colour, so the cut into 1993 is white-to-white.

Every cut and hit lands on a 15-frame beat, except f94, f97, f99–104 and f112, which follow the brief and the cue sheet.

**Audio:** you asked to see examples, so there is a scratch track made by pure synthesis. It covers the open-fifth drone, felt piano on the beats, the D-flat, the keys at the same frames the picture types them, the pluck, the servo, the scan, the knee run, the click and a swell into the white. The VO is not faked: each syllable is a breath marker at its frame, ready for a real read. I checked the onsets by measurement. The full cue sheet (music, effects, VO) is in the notes and in `CUES` in `timeline.ts`.

**What looks strong**
- The scan still (`mcoldopen-04-scan.png`) is the key image: the cathedral glowing in glyph inside the fan, Mas in pixel colour at its tip.
- The opening macro is a clean, unusual first image, and the stepped zoom-out reads as one move.
- The two-shot keeps the post fully legible alongside Mas's acting (the eye snap, the smile).
- The tokens-as-light chips and the fade into white are palette and glyph moves, not effects, and nothing reads as corny.

**Weaknesses**
- The monitor is cheated square to camera in the two-shot (a side panel implies it's turned toward him). It's standard 2D staging, but a purist will notice.
- The wide is very dark, and Mas is small in it (the approved 48 px desk sprite).
- The head tilt is only a 1-pixel crown shift, so it's nearly invisible.
- Mas's torso below the portrait's crop is my own continuation, not the cast builder's drawing, and would benefit from a hand pass.
- The cathedral's nearest pillars still read partly as vertical columns of characters.
- The biggest chips are the most "vector" thing in the intro, for about 3 frames.
- The scratch audio proves timing only; it is not the score.

**Resources that would raise quality**
- A voice for Mas: a recorded read, or a voice model you have rights to.
- Stems or a music model for the drone, felt piano and knee run. I can re-cut them to these frames.
- Keyboard and servo recordings, or a sound-effects model.
- A reference for the Orb you like.
- Your call on staging the monitor honestly (seen from behind) versus my cheat.

**For whoever assembles the intro:** `<ColdOpenMount/>` in `ColdOpen.tsx` mounts the span at its global frames, and `SPAN` / `toGlobal` are in `timeline.ts`. For the bookend: the caret's home in frame is `CARET_FRAME` = [96, 76], the medium monitor's screen origin is `MED.screen` = [80, 60], and `screenAt(f)` renders the screen at any frame. After Post the composer is empty with the caret blinking, which is the f0 state, so the piece can loop.

Render: `npx remotion render src/dev/mcoldopen/entry.tsx mcoldopen ../out/season/intro/moments/mcoldopen.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error` (for stills, use `still` with `--frame=N`).

Files are in `/home/jgon/project/art/mrmas/out/season/intro/moments/`:
- mcoldopen.mp4
- mcoldopen-01-macro.png (f2)
- mcoldopen-02-room.png (f52)
- mcoldopen-03-stare.png (f98)
- mcoldopen-04-scan.png (f102)
- mcoldopen-05-post.png (f115)
- mcoldopen-scratch-audio.wav
- mcoldopen-with-scratch-audio.mp4

Code is in `/home/jgon/project/art/mrmas/studio/`:
- src/styleframes/mcoldopen.frame.tsx
- src/dev/mcoldopen/ — `timeline.ts`, `screen.ts`, `macro.ts`, `medium.ts`, `wide.ts`, `orb.ts`, `cathedral.ts`, `chips.ts`, `scene.ts`, `paint.ts`, `ColdOpen.tsx`, `entry.tsx`, `tools/preview.ts`, `tools/scratch_audio.py`
- notes/mcoldopen.md