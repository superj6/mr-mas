The mfinale span (intro f480-719) is done and rendered. It covers the Ep1 slot, the dusk skyline, the title and the bookend, all in the shared pixel engine with the cast modules used read-only. I looked at every section over several fix rounds: Node previews first, then Remotion stills and contact sheets, which is the only place the glyph moments show. The MP4 is 960x540, 24 fps, exactly 240 frames (10.0 s). My files typecheck clean.

**Compositions** (dev entry `src/dev/mfinale/entry.tsx`)
- `mfinale`: the span, 240 frames. Composition frame N is intro frame 480 + N. For the integrator, `<MFinaleSequence/>` mounts it at global 480; `timeline.ts` exports `MF_START`, `MF_FRAMES` and `toGlobal`, and all the art code uses global frame numbers.
- `mfinale-key-chatgtp`, `-fired`, `-skyline`, `-title`, `-bookend`: the key stills.
- `mfinale-sheet`: a dev 4x4 contact sheet of any frames, with glyph layers included.

**Outputs** (in `/home/jgon/project/art/mrmas/out/pixel/moments/`)

| File | Frame | What it shows |
|---|---|---|
| `mfinale-chatgtp.png` | f491 | Mas's finger on the tiny beige "low-key research preview" button; the table-runner line kinks straight up; the counter reads 1,000,000 / 5 DAYS; the whole frame one step brighter |
| `mfinale-fired.png` | f502 | The desaturated five-tile board call; Mas's tile breaking into glyph tokens that blow away |
| `mfinale-skyline.png` | f628 | All eight towers and bosses up; the rooftops lit as one cyan curve running up NopeAI's spire |
| `mfinale-title.png` | f660 | Chrome "MR. MAS" with the Orb as the period, set inside the rose window; subtitle; tiny Mas on the spire balcony |
| `mfinale-bookend.png` | f705 | The post goes out; Mas's eyes on the lens; the Orb's iris showing the skyline in glyph |

- `mfinale.mp4` is silent. `mfinale-with-scratch-audio.mp4` and `mfinale-scratch-audio.wav` carry a temp mix, following the other intro builders' naming.
- Separate music, effects and vocal tracks, plus the mix, are in `audio/mfinale-{music,sfx,vox,mix}.wav`.

**Timing.** Every beat lands on the 15-frame grid: 480, 495, 510, 525, one tower pop per beat from 540 to 615, 630 and 690. The off-beat events are the ones the design doc places there: badge flip at f518, rooftop ignition at f622, title typing from f640, the Orb's toast at f692. The iris glyph runs f705-706 on the last beat.

**Style changes, each short:**
- **Bloom:** one palette step brighter, spreading as a ring from the button (CHATGTP).
- **Grey:** a desaturated call palette I built locally for FIRED. It's the only set the engine lacks, so it could be promoted there.
- **Glyph:** the dissolve, then its reverse for BACK.
- **Title:** the letters go 1-bit, then early-web, then flat, then chrome, 3 frames each.
- **Iris:** 2 glyph frames in the Orb's eye.

**Continuity with the neighbouring spans**
- **Coming in (f479 to f480):** mdinner2 ends on the frozen founding with the NOPE AI neon lit. f480 cuts to a warm full-colour close-up, with the neon's red and cyan still lying on the tablecloth.
- **Going out (to the cold open's f0):** the bookend copies the cold open's two-shot layout from its notes (screen at (80, 60), 180x112; caret home (96, 76); Mas and the Orb in the same spots). After the post, the composer is empty with the caret on its home, blinking 8 on / 7 off, which is the cold open's f0 state. f712-719 dissolve to black, leaving only that caret.
- I copied those layout numbers rather than importing the cold open's code. If that span's layout moves, `bookend.ts` needs updating.

**Strengths**
- The skyline reads like a real pixel-art establishing shot: clean 2:1 isometric, a dusk gradient, rippling water reflections, bosses running their loops, towers popping on the beat. The curve becomes the skyline, then the title.
- The title card works: it builds up through the eras in 12 frames, and the Orb period sits in the rose window.
- Each slot beat tells its story in one image: tap and curve, the old 1993 dialog whose Cancel finally works, the tokens coming home, the hearts cooling into stars.
- The bookend closes the loop into the cold open's room.
- Nothing jokey or noisy: short, one-reason switches and no meme sounds.

**Weaknesses**
- The hand in the CHATGTP close-up, NopeAI's facade and the two board-member busts (NELEH, MADA) are the most procedural-looking drawings. The busts hold a single pose.
- The iris glyph beat is small: it reads as "the eye is full of the city", not as a readable skyline.
- The post shown on the monitor is the title frame shrunk onto the screen. It reads, but the subtitle is illegible at that size.
- The tower name plates face the camera flat on isometric buildings, which is a stylisation.
- The dusk colours come from the cast builders' extra colour set, which sits outside the master palette.
- **Audio:**
  - I couldn't listen to it on this machine. I checked it with spectrograms and per-beat levels.
  - It is a pure-synthesis temp for timing and structure, not the score.
  - The synthesized choir ("aah"/"ooh") is its weakest part.
  - The frame-by-frame cue sheet (music, effects, vocals) is in `notes/mfinale.md`.

**Resources that would raise the quality:**
- A pixel artist's pass on NopeAI and on the hand.
- A reference board of pixel cityscapes and title lockups you like.
- A few recorded "aah"/"ooh" takes in F, even on a phone, or access to a choir or voice model.
- A composer, or sample libraries for the code-composed score route.
- Video-generation clips for the fluid elements (steam, water, the hearts, the webcam tiles). They could be run through the engine's palette remap at 480x270 so they stay inside the look; I can wire that up once you connect a model.

**Files** (in `/home/jgon/project/art/mrmas/studio/`)
- `src/styleframes/mfinale.frame.tsx`
- `src/dev/mfinale/`: `timeline.ts`, `scene.ts`, `MFinale.tsx`, `entry.tsx`, `slot.ts`, `callart.ts`, `type.ts`, `iso.ts`, `skyline.ts`, `title.ts`, `bookend.ts`, and `tools/` (`preview.ts`, `audio.ts`, `png.ts`)
- `notes/mfinale.md`: integration, beat audit, style switches, rig limits and the audio cue sheet