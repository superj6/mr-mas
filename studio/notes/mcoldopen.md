# mcoldopen: THE COLD OPEN, pixel edition (intro f0-119, 5.0 s)

This is the dark room, Mas at his desk in 3/4 front, THE ORB at his shoulder, and the post
"near the singularity; unclear which side." It includes the masked GLYPH Orb scan at f99-104 and the Post that turns
into tokens. Everything uses the shared engine (`src/shared/pixel`) and the cast (`src/shared/pixel/cast/mas.ts`).

## Polish pass (polish-a, 2026-09-25): the art director's fixes
- **The look to the lens is a drawing now.** At f94 the portrait swaps to a new near-front head (`masPortrait({..., head: 'front'})`, added to `cast/mas.ts`) and holds it through f117; the micro-smile (f107) is on the new head. The body stays 3/4.
- **The tilt (f63) is a 2-3 px drawing**: whole-pixel row and column shears on the head only (the crown steps 3 px toward the window, the far side drops 1 px), not a 1 px crown nudge.
- **He has arms.** Forearms cross the desk edge to a keyboard; two typing drawings on 2s, locked to the keystroke lists (`handsAt()` in `medium.ts`). From f106 the near hand lifts to the mouse; the click (f112) is a finger press plus a 1 px dip of the near shoulder.
- **The hoodie below the portrait is hand-painted**: the portrait's last row continues column by column (no seam), with creases, one fold off the shoulder and the kangaroo pocket's seam above the desk.
- **No TV stand.** The medium monitor hangs on a desk-clamped arm (a short pole, a knuckle, the arm to the mount). The screen position (`MED.screen`, `CARET_FRAME`) is unchanged, so the macros and the bookend still line up.
- **The wide monitor is turned 3/4 toward him** (its casing side and a foreshortened face), and the wall around the monitor's pool is one ramp step brighter so the room and the small Mas read.
- **The token chips are pixel-native**: the 7 px face at integer 1x (on the screen, f112), 2x (f113) and 3x (f114), pastel plates, dark letters, no bloom, no TrueType. f115-117 is the white-out with no chips. GLYPH is now used once in this span (the scan).

The canvas is native 480x270 at 4x nearest-neighbour, indexed master palette only.

## Deliverables (`out/pixel/moments/`)
| file | frame | what |
|---|---|---|
| `mcoldopen.mp4` | f0-119 | the span, 960x540, 24 fps, 120 frames (`--scale=0.5`) |
| `mcoldopen-01-macro.png` | f2 | the first image of the show: the caret as lit R/G/B subpixels on a black LCD |
| `mcoldopen-02-room.png` | f52 | the wide: the rebuilt room, Mas 3/4 front typing, lit only by the monitor |
| `mcoldopen-03-stare.png` | f98 | the two-shot: the post typed, the you-are-here dot gone, his eyes and the Orb's iris on the lens |
| `mcoldopen-04-scan.png` | f102 | the scan: the room revealed as the data-center cathedral, in GLYPH, inside the fan only |
| `mcoldopen-05-post.png` | f113 | Post: the line splits into its tokens, pixel-font chips at 2x on the way past the lens; the chart has snapped vertical |
| `mcoldopen-scratch-audio.wav`, `mcoldopen-with-scratch-audio.mp4` | f0-119 | a **timing scratch** made by pure synthesis. It is not the score (see Audio). |

Composition id: **`mcoldopen`** (120 frames). Its frame numbers are the intro frame numbers.

```
npx remotion still  src/dev/mcoldopen/entry.tsx mcoldopen ../out/pixel/moments/mcoldopen-04-scan.png --frame=102 --bundle-cache=false --log=error
npx remotion render src/dev/mcoldopen/entry.tsx mcoldopen ../out/pixel/moments/mcoldopen.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
python3 src/dev/mcoldopen/tools/scratch_audio.py ../out/pixel/moments/mcoldopen-scratch-audio.wav
```
For the fast Node preview (about 1 s), run `npx esbuild src/dev/mcoldopen/tools/preview.ts --bundle --platform=node --outfile=<scratch>/mco.js`,
then `node <scratch>/mco.js <outDir> <scale> frame:<f> | strip:<f,f,..> | screen:<f> | macro:<P>:<f> | world:<f>`.
Glyphs only appear as tinted cells in Node; judge the scan and the chips in Remotion.

## Integrating
- `SPAN = {from: 0, durationInFrames: 120}` (`timeline.ts`). Local frame = global frame - `SPAN.from`, and `toGlobal(local)` converts back.
- Use `<ColdOpenMount/>` (`ColdOpen.tsx`), a `<Sequence from={SPAN.from}>`, or place `<ColdOpen/>` yourself. `<ColdOpen frame={g}/>` holds a global frame.
- `coldOpen` (`scene.ts`) is a pure `PixelScene` definition, so `composeFrame(coldOpen, f)` works in Node for contact sheets.
- **For the bookend (f690-719):**
  - The caret's home is `CARET_FRAME = [96, 76]` in the medium shot, and the macros zoom about the same point.
  - The medium monitor's screen origin is `MED.screen = [80, 60]`, and its size is `SW x SH = 180 x 112`.
  - The wide room's monitor is at `WIDE.mon`.
  - `screenAt(f)` renders the screen at any frame. After Post, the composer is empty with the caret blinking, which is the f0 state.
- **For 1993 (f120):** f118-119 are the ONEBIT paper white exactly (`#e9e6da`), so the cut is white-to-white.

## The shots (cuts on the beat grid, except the 6-frame scan cutaway, which is locked to the brief's f99-104)
| frames | shot | what happens |
|---|---|---|
| 0-14 | **LCD macro, P9** | Black. The cyan block caret blinks on the beat (on 8 / off 7). At this range you see its R/G/B subpixel stripes, and the dark LCD's own matrix. |
| 15-29 | **macro, P3** | The dolly-out's first ×3 step, as a hard cut on beat 2. Whole screen pixels are visible in their black matrix. Typing starts under the VO at f24 ("n", "ne", "nea"...). |
| 30-44 | **medium two-shot, 1:1** | The next ×3 step, and the reveal. The Z composer floats over a log chart: a lifetime of flat line, a knee, and a blinking dot marked `you are here`. Mas, 3/4, is lit only by the screen, with THE ORB at his far shoulder, iris half open. Behind them are the window, the city, and a gothic spire on the skyline. |
| 45-59 | **wide** | The last step out. The room shows the rack (LEDs on eighths), the dead pendant lamp, a shelf with the red clock `1:36`, a print of the same knee, the desk, his glass, and moonlight on the floor. He types on 2s. |
| 60-98 | **medium** | Cut back in on the D-flat, in the pause. He tilts his head (f63). He types "unclear which side." (f70-93). On "side" the dot climbs the curve and leaves the top of the monitor (f86-90). **The eyes snap to the lens at f94. The Orb's iris swivels to the lens at f97-98.** |
| 99-104 | **wide + GLYPH** | The scan: a fan from the iris opens, sweeps down across the room, and closes. **Only inside it** the room is the endless data-center cathedral, in tokens. Mas and the Orb are masked out, so they stay pixel. The room just outside the beam catches one rung of its light. |
| 105-117 | **medium** | The lens is still hot, then cools (f105-106). **The micro-smile at f107** is one pixel, on the near-front head. His hand goes to the mouse (f106-111) and **he clicks at f112** without looking away from us. The line splits into its tokens (1x, f112), the chart snaps vertical (f113), and the chips come off the screen at 2x and 3x (f113-114). The room climbs its light ramps, then dithers into paper (f114-117). |
| 118-119 | **white** | The ONEBIT paper white, for the match cut into 1993. |

**Beat audit.** Everything visual that "hits" lands on a beat:
- the caret on-phases at 0 and 15
- the cuts at 15, 30, 45, 60 and 105
- the caret blink phase through the pause, and 75 inside the typing
- the dot's exit at 90

Four events are off-beat by design, matching the brief and the cue sheet:
- the eye snap at 94
- the servo at 97
- the scan at 99-104
- the click at 112, which sits on the knee-run note C6

## Style use (the switch rules)
- **BASE throughout.** The macros are not a style switch. They are optics: the same screen buffer, magnified by an integer, so its pixels become visible.
- **GLYPH once, for foreshadowing:** the scan is the machine seeing what the room really is (5 frames of full reveal, 6 including the closing frame).
- Post turns his words into tokens in the show's own pixel font: pastel plates with dark letters, the palette of a tokenizer visualiser, at integer scales only. The semicolon gets its own token.
- **Nothing is corny.** There is no glitch and no winking UI. The only jokes are background details:
  - the orphaned `you are here` label
  - the clock at 1:36
  - the knee print on the wall
  - the spire on the skyline

## Files (all mine)
Everything in `src/dev/mcoldopen/`, plus `src/styleframes/mcoldopen.frame.tsx` and this note.
- `timeline.ts`: every frame number, including the keystroke lists, the events, the shot list, the beat audit and the audio cue sheet (`CUES`)
- `screen.ts`: the composer over the log chart, in screen pixels; also `TOKENS` and `tokenBoxes()`
- `macro.ts`: the LCD macro (subpixels at P≥6, pixel cells at P3)
- `medium.ts`: the two-shot, including:
  - the portrait's torso, continued below its 112x136 crop
  - the head-tilt shear
  - the desk, the glass and the monitor
- `wide.ts`: the room. It is painted in MatBuf materials and lit with `resolve()`, like the approved pixeladv room.
- `orb.ts`: THE ORB at any radius, from 5 px up. It is a chrome sphere whose bands come from a reflection vector, with a black glass face, a six-blade aperture, the lens and one glint. The face can point anywhere, so the swivel is a redraw, never a rotation.
- `cathedral.ts`: the true world. It is built for the glyph read:
  - curved pointed arches that become contour glyphs
  - server cabinets broken into units, not long vertical rules, so it doesn't read as rain
  - votive LEDs, a GPU-die rose window, god-rays, a polished floor
- `chips.ts`: the token chips; `scene.ts`: the assembly; `paint.ts`: stepped light, windows and image helpers
- `ColdOpen.tsx`, `entry.tsx`; `tools/preview.ts`, `tools/scratch_audio.py`

## Audio plan for this span
There are three layers: music, SFX and VO. All frames are global. The machine-readable version is `CUES` in `timeline.ts`.

| frame | music | SFX | VO |
|---|---|---|---|
| 0-119 | sub drone F1+C2, an **open fifth with no third**, fading in over f0-30 | room tone, a low server hum, rack fans | — |
| 0 / 15 / 30 / 45 | felt piano F5 on each beat; 30 and 45 ducked 6 dB under the VO | — | — |
| 24-55 | — | soft low-profile keys at **exactly `L1_KEYS`** | "near the singularity;" (f24-57), soft, close-mic, reading his own post to an empty room, no word stressed |
| 60 | a **low D-flat** inside the pause, the colour note | — | (pause) |
| 70 | — | Shift+Enter (a heavier key) | — |
| 71-93 | — | keys at `L2_KEYS` | "unclear which side." (f72-91); "side" is left hanging, neither falling nor rising |
| 90 | a pluck as the dot leaves the screen | — | — |
| 94 | — | *nothing*: the eye snap is silent, and that is the point | — |
| 97-98 | — | the Orb's servo in two precise steps, panned right | — |
| 99-104 | — | the scan "shhk" (peak f100): airy filtered noise sweeping right to left with the fan, plus a faint lens chirp | — |
| 105 / 108 / 112 / 116 | **the knee run**: G5, A-flat5, C6, F6 | a mouse click at 112; a glassy tick per chip step, 113-114 | — |
| 105-119 | a reverse-cymbal swell into the white, cut dead at f120 for the 1993 drop | — | — |

**The scratch track** (`mcoldopen-scratch-audio.wav`, muxed into `mcoldopen-with-scratch-audio.mp4`) is pure Python synthesis.
- It is timing only: it reads the same keystroke lists as the picture, so every key lands on its frame.
- The VO is **not faked**. Each syllable is a breath-shaped swell at its frame, so a real read can be laid straight onto it.
- I checked the onsets by measurement: piano f15, Shift+Enter f70, pluck f90, the period f93, scan f99-100, knee run f105, and the click with C6 at f112.

## Rig limits (this span)
- **Mas, medium:** two head drawings (3/4 to the monitor, near-front to the lens), mouths, lids, the eye dart, a drawn 2-3 px tilt. Forearms and hands at the desk line: rest, two typing drawings on 2s, a lift, the mouse, the click. No continuous turn: the head angle is a swap on the eye snap.
- **Mas, wide:** the castmas desk sprite. Its head turns (screen → turn → camera) and its hands type on 2s.
- **The Orb:** the face direction and aperture are continuous parameters, but each frame is redrawn on whole pixels, and its float bob is 1 px.
- **Nothing is scaled or rotated.** The dolly-out is integer magnification of a screen, the push past the lens is drawn chip sizes, and the white is palette steps plus an ordered dither.

## Known issues / weaknesses
- **The monitor is still cheated square to camera** in the medium (the art director accepted the cheat); in the wide it is turned 3/4 toward him.
- **The wide is dark and Mas is small** in it (48 px desk sprite at the approved room scale), now helped by the lifted wall around the monitor.
- **The medium's hands are small** at this scale (about 17 px wide) and the torso silhouette is still a little square at the desk corners; a pixel artist's hand pass on the forearms would help.
- **The near-front head is a first drawing**: it reads as Mas (cowlick, level eyes, one-pixel smile), but the jaw is a touch long.
- **The cathedral's near piers** still read partly as vertical token columns at 4x. The arches, core and floor carry the image.

## Resources that would raise quality
- **A voice** for Mas, to replace the breath markers: a recorded read, or a voice model you have rights to. The timing slots are already in the scratch track.
- **Real stems or a music model** for the drone, the felt piano and the knee run. I can re-cut any stems to these frames.
- **Mechanical-keyboard and servo recordings**, or an SFX model, for the typing and the Orb.
- **A reference for the Orb** you like: the real device's proportions, or a prop render. I would hand-pin its chrome bands to it.
- **A decision on staging the monitor honestly** (seen from behind in the wide, with the post shown only in the macros). My version cheats it to keep the two-shot legible.
