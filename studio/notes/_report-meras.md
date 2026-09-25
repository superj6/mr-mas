I built frames 120–239 as the composition `meras`, and its frame numbers match the intro timeline. The MP4 is 960×540, 24 fps, exactly 120 frames (5.000 s). I checked it with ffprobe and pulled frames back out to confirm they match the Remotion stills. I looked at every render and did many fix rounds; typecheck is clean for my files, and I touched no shared or other builders' files.

**The span, on the beat grid** (every hit lands on a 15-frame beat or the eighth after it):
- **1993, 1-bit (120–167):** framed as a 3:2 pillarbox, animated on fours.
  - Hard cut on the drop at 120.
  - 128: his eyes go to the lens. 132: his head follows. He never blinks.
  - 135: the world greys out and becomes the alert dialog: "MAS MANALT / no equity.", with "age 8" in the title bar, a 1-bit Orb icon and Cancel greyed out. Only the kid stays in full contrast.
  - 150: a stranger's pointer clicks Cancel and nothing happens. 165: the kid clicks OK. 166–167: the dialog zooms shut into the tip of the staircase curve.
- **Render front (168–179):** a cyan scanline sweeps left to right with a spark riding the curve. Behind it the world re-renders in early-web 16 colours, and the pillarbox widens to full 16:9.
- **2008 (180–194):** the TPOOL keynote seen from an audience camcorder.
  - Mas strides out of the wing; his collars pop at 180 and 187.
  - A faceless turtleneck sleeve tosses him the clicker.
  - On the giant screen a GPS breadcrumb climbs like the curve and ends at a pin.
  - The camcorder overlay reads "▶ PLAY" and "JUN 09 2008".
- **2014 (195–224):** Why Combinator.
  - The hoodie founders heave Mas up onto the laptop-and-ramen throne, landing at 210.
  - LUAP, standing on his stack of essays, sends the paper crown down a dotted path; it lands at 217 and glints.
- **225–239:** the glint cuts to a candle flame on the same pixel, and the candle's light spreads outward, re-rendering the room in the base palette.

**Handoff to mdinner1:** they own 225–359 and asked for the crown glint to land on their candelabra flame at native (84, 108). My 2014 ends with a fast pan that puts it exactly there at 224, using the same streak effect as their whip. I'd mount meras 120–224 and theirs from 225. My own 225–239 is a fallback ending so `meras.mp4` plays whole.

**What looks strong**
- The alert name card, with the kid's unblinking stare beside it.
- The render front that widens the frame as it passes.
- The camcorder keynote reads as 2008.
- The crown's dotted path pays off as a clean graphic match into the dinner.
- The 1-bit kid is a new, larger drawing (three head angles, the forward cowlick, calm eyes, the one-pixel smile), because the cast's wide-shot sprite can't carry the stare.

**Weaknesses**
- The 2014 throne still reads a bit like a stepped altar.
- The founders are deliberately generic, which makes them doll-like.
- Mas 2008 is the 82 px cast sprite, so the collar pops are only 2–4 px.
- The first few dinner frames in the early-web palette look rough.
- My 2015 is only a fallback: it isn't mdinner1's set, and the cloth folds are stripy.
- The end-of-2014 pan is fast by design.

**Audio.** I wrote a code-composed sound sketch, frame-locked to the cues. It is a timing and tone reference, not the score, and I couldn't listen to it, only check its levels numerically.
- **1993 chip tier:** a sub boom on F at the drop, square bass, and a beeper playing F F F that stops while the dialog is open. The stranger's click gets a wrong-note bonk (G♭); the kid's OK completes the phrase with C.
- **Render front:** a tape transport starts up.
- **2008–14 cassette tier:** boom-bap under the hook (F F F F G A♭ C F) on a warbly tape piano, one note per eighth from 180. Collar pops are tuned A♭5, C6 and F6, with a brass stab at 195 and a glock ping on the glint.
- **225–239:** a whoosh under the pan, then a tape spin-up and a mechanical-keyboard roll into the 240 hit.
- **Vocals:** this span has none by design. The one recorded element should be a real, quiet crowd "ohh" at 210; I didn't fake it, because a synthetic crowd would be the corny version.

**Resources that would help**
- Two or three System 6/7 dialog screenshots and a MacPaint-era illustration you like, so I can match the 1993 look exactly.
- Your final polo colours, and whether 2008 should stay the audience-camcorder framing or become a closer "news clip".
- A phone recording of a crowd "ohh" and of any mechanical keyboard.
- If you'd like it, I can export the cue list as MIDI stems for a composer or an AI music tool.
- Video-model output doesn't fit this span, because every frame is exact pixel art. The TPOOL slide or the 2014 banner could take an image-model texture as reference art.

**Composition ids:** `meras` (120 frames) and stills `meras-key-1993` (f132), `meras-key-alert` (f152), `meras-key-front` (f174), `meras-key-2008` (f193), `meras-key-2014` (f220). `meras-key-woodrose` (f235, the fallback 2015 frame) is registered but not delivered.

**Code:** the frame definitions are in `src/styleframes/meras.frame.tsx`; everything else is in `src/dev/meras/`. `<MerasMount/>` places the span at global frame 120. The 1-bit kid is `kid93.ts`, the 2008 stride and collar states are `mas08.ts`, and the sketch generator is `audio/sketch.ts`. Notes are in `notes/meras.md`.

Files are in `/home/jgon/project/art/mrmas/out/pixel/moments/`:
- meras-1993.png
- meras-alert.png
- meras-front.png
- meras-2008.png
- meras-2014.png
- meras.mp4
- meras-scratch-audio.wav
- meras-with-scratch-audio.mp4