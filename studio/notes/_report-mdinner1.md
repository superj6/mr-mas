I built the dinner opening and the Gerg and Alyi cards (global frames 225–359) as `mdinner1`, with five key stills, the MP4 and an audio example. The MP4 is 960×540, 24 fps, exactly 135 frames; I pulled frames back out of it to check the encode matches the previews. Hits land on the beat grid; the two loudest frames of the audio are 240 and 300. My files typecheck clean; the 12 project errors are in other builders' `mfinale` and `realism` files. I did more than three rounds of fixes, looking at every render.

**Overlap with mdinner2:** mdinner2 also covers 345–359 (Mario's vault). My flame wipe at 340–344 is built to be the cut, so the integrator should mount `<Mdinner1Sequence until={344} />` and cut to mdinner2 at 345. My own 345–359 vault is a fallback, timed to mdinner2's beats (ticks 348/352/356, Mario out at 350, finger up at 357).

**Compositions** (dev entry `src/dev/mdinner1/entry.tsx`):
- `mdinner1`: the span, 135 frames. Local frame f = global frame f + 225. `Mdinner1Sequence` mounts it at global 225.
- `mdinner1-opening` (f237), `mdinner1-gerg-card` (f266), `mdinner1-ctrl` (f274), `mdinner1-cathedral` (f299), `mdinner1-alyi-card` (f334).
- `mdinner1-vault` (f359): a hand-off check only, not one of the five stills.

**Outputs** (in `/home/jgon/project/art/mrmas/out/season/intro/moments/`):
- `mdinner1-opening.png`, `mdinner1-gerg-card.png`, `mdinner1-ctrl.png`, `mdinner1-cathedral.png`, `mdinner1-alyi-card.png` (1920×1080)
- `mdinner1.mp4` (picture only)
- `mdinner1-scratch-audio.wav` and `mdinner1-with-scratch-audio.mp4`: a timing sketch in synthesized sound, not sound design

**Files** (in `/home/jgon/project/art/mrmas/studio/`):
- `src/styleframes/mdinner1.frame.tsx`
- `src/dev/mdinner1/`:
  - `timeline.ts`, `scene.ts`, `set.ts`, `cathedral.ts`
  - `masdinner.ts` (new dinner drawings of Mas; the cast had none)
  - `props.ts`, `cards.ts`, `Mdinner1.tsx`, `entry.tsx`, `lab.ts`
  - `tools/preview.ts`, `tools/scratch_audio.py`
- `notes/mdinner1.md`: beat map, how to integrate, limits, and the frame-by-frame audio plan

**Style switches, each with one reason:**
- **Early-web to full palette (225–229):** a thin amber scanline sweeps behind the whip into 2015, over in 5 frames.
- **Two-tone freeze, twice (240, 300):** the featured founder prints brighter than the room so he reads first. Mas, the key in his hand, his fork and the foreground candle stay in colour.
- **Glyph, one 2-frame touch (292–293):** the rose window boots as tokens before it becomes glass.
- **Alyi's eyes:** they open as scrolling token streams at f315.

**Strengths**
- The Woodrose looks like a finished dusk dining room: Mas sits in the arched window like the Last Supper halo, and the room stays stable while the camera trucks.
- Alyi's bay turns into the server cathedral in held steps: rack pillars, a nave that recedes behind his head, a neural-net rose window, votives and a light shaft onto him.
- The gags read without a word:
  - Mas plucks the hanging CTRL key and pockets it.
  - The paperclip effigy lifts its own UNALIGNED sign, then burns.
  - Mas pulls a telescoping fork and toasts a marshmallow on the frozen fire, with no crackle.
- The two freezes print cleanly and Mas is the only thing moving in them.
- The foreground candle wipe carries the switch from the frozen print back to the live room across the frame and takes the Alyi card with it.

**Weaknesses**
- The characters are small at this table-height framing (about 50 px seated), so the acting lives in the cards. In the freezes the bottom third is heavy empty navy.
- Frozen in mid-air, Gerg's popcorn keycaps are specks. The frozen fire reads as fire mostly from context.
- Dinner-Mas has one front-facing head, so he can only turn his eyes. His torso and the effigy would benefit from a pixel artist's hand pass.
- The Gerg card portrait holds still for 45 frames.
- The small "CTRL" label over the key (256–271) is the intro's only object label. If it feels like a winking UI joke, it's one line to remove.
- The scratch audio is simple synthesis. The chants ("FEEL", "THE", "A-G-I!") are not faked; each is marked by a soft breath at its exact frame.

**Resources that would raise quality:**
- A music model or a licensed library of trailer hits and choir, for real stems.
- An SFX source, or real recordings of mechanical keyboards and camera shutters.
- A voice model or a small recorded group for the whispered and shouted chants.
- Reference photos of a Sand Hill hotel dining room at dusk.
- Your call on whether mdinner2's shots keep the cathedral lit after f300.