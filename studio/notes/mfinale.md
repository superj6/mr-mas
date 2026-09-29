# mfinale: intro f540-719, pixel edition (the skyline, the title, the bookend; 7.5 s)

Bars 10-12 of the intro in the shared pixel engine: native 480x270, 4x nearest-neighbour. Frame numbers in all the
code are **global intro frames**. Bar 9 (480-539) is the roll call (`src/dev/mrollcall`, `<MRollcallSequence/>`).
Brief v2.1 cut the old per-episode slot (CHATGTP / FIRED / BACK) from the intro, so it is no longer mounted here.
`slot.ts` and `callart.ts` stay in the folder as Ep1 material.

## Polish pass (art director, 2026-09-25): what changed
- **480-539 cut, the span rebased.** `MF_START = 540` and `MF_FRAMES = 180`. The scene has no slot or call-art
  imports. The skyline's first stars used to be the cooled hearts; now they are a seeded field that comes out a few
  at a time on 2s (`duskStars`).
  - `mfinale-bars9-12` is a review composition: the roll call, then this span, exactly as the intro plays them.
- **The title's Orb is the cold-open Orb.** It is drawn with `mcoldopen/orb.ts` `drawOrb` at r = 9 (19 px, down from
  25): the black glass face, the blades and the lens, with no equator band, so it no longer reads as a Poké Ball.
  - Its chrome shell is re-shaded with what it reflects at the title: the dusk on a low curved horizon, and the
    wordmark's cyan letters on both flanks. A cold rim comes from the rose behind it.
  - It is kerned 1 unit off the R, with a word space after it, so the line reads "MR." then "MAS".
  - The wordmark is set so the Orb lands exactly on the rose window's hub, and the letters' bloom and outline no
    longer touch it.
- **NopeAI's rose window is the dinner's neural rose, at skyline scale.** Eight jewel petals (cyan leading, with
  amber, ruby and green), a glowing hub and a ring of sixteen nodes, as a circle in the wall at the iso angle. It is
  bigger (ru 10, rv 19), so the three cathedrals rhyme.
  - The west facade got a hand pass: coursed ashlar, two buttresses rising into pinnacles, and a gallery of niches
    under the rose.
- **The rooftops carry the roll call.**
  - New tower: MACHINES THINKING, a slim pale lab on the quay. It pops with PEEKDEEP at 615, and RIMA steps onto her
    mark as the spotlight SNAPS on at 617 (the roll call's beat, at rooftop scale). The two-line plate reads
    `MACHINES / THINKING` with `RIMA` under it.
  - KRAM holds out the soup thermos from his roll-call flash, not a poster. The cast KRAM is drawn through a
    left-clipping view here; the cast is not edited.
  - ATEM's billboard is raised so `METAVERSE` clears KRAM's head.
  - Plates never leave the frame: the ELGOOG plate now sits low and rides the frame edge.
- **The bookend is the cold open's room.** Mas, the Orb, the desk, the glass, the monitor and its arm are all drawn
  by `mcoldopen/medium.ts` `drawMedium`, replaying the cold open's own acting. It uses `MED`, `CARET_FRAME` and
  `screenAt` from mcoldopen. Only the screen content is this span's.
  - 692-704 replays f56-62: eyes on the screen, the Orb watching it.
  - 705-711 replays f112: the click on Post, eyes on the lens, the one-pixel smile.
  - While the dusk title is on his monitor, a ramp swap turns his key light violet (K→X, C→U). It snaps back to cyan
    the moment he posts.
  - The `verified: human` toast is cut. The iris GLYPH (705-706) is the last whisper.
- **Audio re-cut** (see below). The slot's cues are gone. Bar 9 is now the roll call's eight stabs on mrollcall's
  `CUTS`, brass doubled by a chip lead.

## Deliverables (`out/season/intro/moments/`)
| file | global frame | what |
|---|---|---|
| `mfinale-skyline.png` | f628 | the dusk skyline, all nine towers and their players, the cyan curve running up NopeAI's spire |
| `mfinale-title.png` | f660 | `MR. MAS`, the Orb on the rose window's hub, the subtitle |
| `mfinale-bookend.png` | f705 | the cold open's room: Post, eyes on the lens, the Orb's iris showing the skyline in GLYPH |
| `mfinale.mp4` | f540-719 | 180 frames, 960x540, 24 fps (`--scale=0.5`), silent |
| `mfinale-scratch-audio.wav`, `mfinale-with-scratch-audio.mp4` | f540-719 | the temp mix, muxed |
| `mfinale-bars9-12.mp4`, `mfinale-bars9-12-with-scratch-audio.mp4` | f480-719 | the roll call plus this span, with audio |
| `audio/mfinale-{music,sfx,vox,mix}.wav` | f540-719 | stems, 48 kHz stereo |
| `audio/mfinale-bars9-12-{music,sfx,vox,mix}.wav` | f480-719 | stems including the roll-call stabs |
| `_cut/mfinale-chatgtp.png`, `_cut/mfinale-fired.png` | — | the old slot's stills, archived (Ep1 material) |

The compositions live in the dev entry `src/dev/mfinale/entry.tsx`:

| composition | what it renders |
|---|---|
| `mfinale` | 180 frames; composition frame N = intro frame 540 + N |
| `mfinale-bars9-12` | 240 frames, starting at intro frame 480 |
| `mfinale-key-{skyline,title,bookend}` | the key stills |
| `mfinale-sheet` | a 4x4 sheet of any global frames: `--props='{"gs":[...]}'` |

```
npx remotion still  src/dev/mfinale/entry.tsx mfinale-key-title ../out/season/intro/moments/mfinale-title.png --bundle-cache=false --log=error
npx remotion render src/dev/mfinale/entry.tsx mfinale ../out/season/intro/moments/mfinale.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
npx esbuild src/dev/mfinale/tools/audio.ts --bundle --platform=node --outfile=<scratch>/audio.cjs && node <scratch>/audio.cjs ../out/season/intro/moments/audio
cp ../out/season/intro/moments/audio/mfinale-mix.wav ../out/season/intro/moments/mfinale-scratch-audio.wav   # then mux with the compositor's ffmpeg
```

## Integrating
- `MF_START = 540`, `MF_FRAMES = 180`, `ROLLCALL_START = 480`. `<MFinaleSequence/>` is `<Sequence from={540}
  durationInFrames={180}>`. In a 720-frame intro, mount `<MRollcallSequence/>` (480) and then `<MFinaleSequence/>`.
- **In:** f539 is the roll call's hand-off (the cursor window closing onto the dusk, the skyline's own sky formula at
  camera 0). f540 is the skyline: NopeAI pops, and the first stars are out.
- **Out:** f712-719 dissolve to black and leave only the caret at `CARET_FRAME` (on 8 / off 7), which is the cold
  open's f0.
  - The bookend READS the cold open (`drawMedium`), so any change there shows up here.
  - The acting frames used are f56-62 and f112. If the cold open retimes those beats, update `coldFrame()` in
    `bookend.ts`.

## Beat audit (15 frames per beat)
| frame | beat | hit |
|---|---|---|
| 540, 555, 570, 585, 600, 615 | 10.1-11.2 | tower pops: NopeAI + MACROSOFT (the plinth slides in at 541), ELGOOG/MINDDEEP, ATEM, INVIDIA, MISANTHROPIC + zAI, PEEKDEEP + MACHINES THINKING |
| 617 | — | RIMA's spotlight snaps on |
| 622 | — | the ignition; fully lit up the spire by 628 |
| 630 | 11.3 | title slam (8 px shake, the players flinch); the letters render 1-BIT 630, EARLY-WEB 633, flat 636, chrome 639 |
| 640 | — | the subtitle types on; 660 the celesta glint on the Orb |
| 690 | 12.3 | pull back: the title is on a screen (bezel, LCD rows); 692 the room, zoom-rects |
| 705 | 12.4 | Post (the cold open's click drawing); eyes to the lens; **the iris shows the skyline in GLYPH for 2 frames (705-706)**; the key light returns to cyan |
| 712-719 | — | ordered-dither dissolve to black; the caret stays |

## Style switches in this span (each one motivated, each one short)
- **The title renders up through the tiers** (3 frames each, masked to the letters): ONEBIT, EARLYWEB16, flat, then
  chrome. It is the era recap in 12 frames.
- **GLYPH, masked to the iris** (2 frames on the last beat): the machine's view of the city.
- The dusk key light in the bookend is a light (a ramp swap), not a style.

## Rig limits / known issues
- **The Orb as the period is small.** It reads at 1080p but not at thumbnail size. At r = 9 the cold-open model is in
  its "small face" branch (no blade edges).
- **The facade is the most procedural read left.** The rose and the stonework are hand-directed; the south wall and
  the scaffolding are still procedural.
- **KRAM's thermos is an override**, a clip plus a drawing in this file. The cast's `bosses.ts` could adopt a
  native thermos pose.
- **The bookend's picture is the title at f689, box-filtered onto the screen.** The subtitle is illegible at that
  size.
- **The roll call's hand-off sky has no stars**, and the skyline's arrive at 540 with the first tower. Copying the
  star field into mrollcall's hand-off would make the join seamless.

## Audio (temp mix, code-composed; shows the plan, is not the score)
Made in Node by pure synthesis (`tools/audio.ts`) and rendered for 480-719. `mfinale-*.wav` is the 540-719 slice,
with a 4 ms fade-in at the cut.

| frames | music | sfx | vox |
|---|---|---|---|
| 480-539 (roll call) | **eight stabs on mrollcall's CUTS** (480 487 495 502 510 517 525 532): brass power voicings doubled an octave up by a chip lead, F F F F G A♭ C F′ (louder as it climbs); kick on the beat, 808 on F, hats going to 16ths at 510; a reverse swell 532-540 | one dry cue per player, kept under the stabs: key clinks, a siren tuned to F, thermos steam, the GPU toss, RIMA's spotlight clunk, the whale's breach, the cursor's blinks | a short "aah" on C, then "ooh" on F′ |
| 540-629 | half-time 808, trap hats, glitch arp; **one pluck per tower: F F F F G A♭ C**; riser from 600; snare roll 615-629 | stone thud + dust per pop, the plinth's scrape, per-boss cues, the MACHINES THINKING spotlight at 617, the ignition fuse | — |
| 630-689 | **the final hit: F-C open fifth, no third** (low piano cluster, brass, timpani, sub drop); celesta F6 at 660 | slam body, subtitle key ticks | wordless choir F/C "aah" |
| 690-719 | celesta F6 at 690, the F1+C2 drone, **ding F6 at 705**, out by 719 | reverse whoosh into the monitor, zoom-rect swish, the Orb's servo at 705, Post click + swish, server hum | "ooh" F/C closing |

To make it real: sample-based or live stems of this cue sheet (brass section + a chip lead for the stabs, a real 808,
a celesta), 3-4 singers for the "aah"/"ooh", and foley for the per-player cues. Every hit is frame-listed above.

## Resources that would raise quality
- A pixel artist's pass on NopeAI's south wall and scaffold, and on the MACHINES THINKING roof rig.
- A reference board for the dusk skyline and the title lockup (how much chrome, how big the period).
- For the vox, a few recorded "aah"/"ooh" takes in F, or access to a voice or choir model. For the score, sample
  libraries or a composer working from this cue sheet.
- **Video-gen plates** (if you connect a model): the water, the steam, and the ignition's sparks as generated plates,
  quantised to the master palette at 480x270 with an ordered dither, so they stay inside the look.
