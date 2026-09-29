# meras: the eras, intro frames 120-239 (1993 → 2008 → 2014 → 2015)

The span from the DROP to THE WOODROSE, in the approved pixel look: native 480x270, 4x nearest-neighbour,
whole-pixel motion, drawings held, style switches as palette/era changes with one reason each.

## Polish pass (polish-a, 2026-09-25): the art director's fixes
- **Skin survives the early-web palette.** `palettes.ts` pins skin (S0-S6) to three FLAT web colours per era (2008: 663333 / cc9966 / ffcc99; 2014: 663333 / 993300 / cc9966 / ffcc66 highlight): no checker on a face or an arm, no dark-brown face in 2014. Hair is flat too.
- **2014, the founders**: a front fill from the pendants (flat tone-3 faces, a lit brow plane), two eyes, a brow line and an open mouth each; four different hoodies (charcoal, light heather, navy, grey) and hair (dark, black, red, brown); no forks: a raised noodle cup and a pair of chopsticks.
- **2014, the set**: the brick wall is there everywhere at a low (cool slate) tone, and the pendants throw warm pools that fall off in one dithered band. The throne is a chair: a laptop back, a laptop cushion, **laptop armrests** capped with glowing open laptops, two laptop legs with dark air under the seat, a low plinth. Mas reads seated.
- **1993**: the beige case's back is drawn light (1-bit beige) with a keyline, ten vent slots, the handle recess, ink ports and the power cord; the rocket poster has a nose cone, a straight body with a porthole, swept fins and a flame; the kid's face is paper with ONE hard 50% shadow shape (no gradient dither) and a clean nose; the room is limited to bounded patterns (one pool behind him, the desk's lit pool, the blinds).
- **2008**: the stage-right curtain is narrower (x 440+) and reads as fabric (flat lit folds, a rimmed edge); Mas strides in from it. Mas 2008 is the locked 78 px (`cast/mas.ts` `MAS_STAGE_DY`).
- **4.2 (f195) is a hard cut** on the brass stab (the 2-frame dither wipe is gone; the spring settle lands on the cut).
- **Era stamps are one design**: `eraStamp()` (`src/shared/pixel/cast/era.ts`), same face, size and screen corner for 1993 (on the pillarbox bar, 1-bit), 2014 (early-web) and 2015 (BASE). The 2008 camcorder date stays diegetic.
- **My 2015 fallback (225-239) is a hard switch to BASE** on the cut (the radial candle front is gone), matching mdinner1.


## Outputs (`out/season/intro/moments/`)
| file | composition | global frame | what |
|---|---|---|---|
| `meras-1993.png` | `meras-key-1993` | 132 | 1-BIT, 3:2 pillarbox: kid Mas at the back of the beige no-logo computer, turned to the lens; the staircase curve climbs out of the glow |
| `meras-alert.png` | `meras-key-alert` | 152 | his name card as a System-7 alert (`age 8` title bar, Orb icon, `MAS MANALT / no equity.`), Cancel greyed; the stranger's pointer has just clicked it; the world is greyed out, only the kid is live |
| `meras-front.png` | `meras-key-front` | 174 | the render front: a cyan scanline chases the curve's tip; 2008 re-renders behind it and the frame widens past the pillarbox |
| `meras-2008.png` | `meras-key-2008` | 193 | EARLY-WEB 16, audience camcorder: TPOOL keynote, breadcrumb ending in a pin, both collars popped, the tossed clicker caught; `▶ PLAY` / `JUN 09 2008` OSD |
| `meras-2014.png` | `meras-key-2014` | 220 | WHY COMBINATOR: crowned on the throne of laptops and ramen cups, founders cheering with forks, LUAP on his essays, the dotted path, the glint |
| (not delivered) | `meras-key-woodrose` | 235 | my fallback 2015 frame: the candelabra's light re-rendering the room into BASE |
| `meras.mp4` | `meras` | 120-239 | the span, 120 frames, 24 fps, 960x540 (`--scale=0.5`) |
| `meras-scratch-audio.wav`, `meras-with-scratch-audio.mp4` | (tool) | 120-239 | a code-composed **sound sketch** (timing + tier reference, not the score) |

```
npx remotion still  src/dev/meras/entry.tsx meras-key-alert ../out/season/intro/moments/meras-alert.png --bundle-cache=false --log=error
npx remotion render src/dev/meras/entry.tsx meras ../out/season/intro/moments/meras.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
# sound sketch (Node, no deps):
npx esbuild src/dev/meras/audio/sketch.ts --bundle --platform=node --outfile=<scratch>/snd.js && node <scratch>/snd.js ../out/season/intro/moments/meras-scratch-audio.wav
npx remotion ffmpeg -y -i ../out/season/intro/moments/meras.mp4 -i ../out/season/intro/moments/meras-scratch-audio.wav -c:v copy -c:a aac -b:a 192k -shortest ../out/season/intro/moments/meras-with-scratch-audio.mp4
```
Fast Node preview (about 1 s): `npx esbuild src/dev/meras/tools/preview.ts --bundle --platform=node --outfile=<scratch>/mp.js --loader:.woff=empty --loader:.woff2=empty --loader:.css=empty --external:remotion --external:react --external:react-dom`,
then `NODE_PATH=node_modules node <scratch>/mp.js <outDir> <scale> <g> | sheet:<g,g,..> | crop:<g>:<x>,<y>,<w>,<h>`. All frames are **global**.
This span has no glyph layers, so the Node preview is pixel-exact (verified against the Remotion still).

## Integrating (frame numbers match the intro timeline)
- `timeline.ts`: `MERAS_START = 120`, `MERAS_FRAMES = 120`, `globalFrame(local)`, and the cue table `T` (global frames). Every era module works in global frames.
- `<MerasMount/>` (`Meras.tsx`) = `<Sequence from={120} durationInFrames={120}>`. `<MerasStill g={…}/>` holds one global frame.
- `merasScene` (`scene.ts`) is a plain `PixelSceneProps` object, so an integrator can also call `composeFrame(merasScene, g - 120)`.
- **Hand-off to mdinner1 (they own 225-359):** mdinner1 cuts on their candelabra flame at native (84, 108) on f225 and whips right. My 2014 ends with an accelerating whole-pixel pan (f218-224, highlight-only smear, the same whip language) that lands the crown's glint **exactly on (84, 108) at f224**. Recommended mount: `meras` f120-224, then mdinner1 from f225.
- My own f225-239 is a complete fallback ending (a sideboard candelabra on the same spot, and a radial "candlelight" render front into BASE) so `meras.mp4` plays whole; it is not meant to replace mdinner1's set.
- Hand-in from mcoldopen: the cold open ends on white f118-119; 1993 hard-cuts in on the DROP at f120.

## Beat map (15 frames per beat; every hit is on a beat or the eighth after it)
| global | beat | picture | style |
|---|---|---|---|
| **120** | **3.1 DROP** | hard cut: the kid at the screen; `1993` slate; the staircase line starts climbing (grows on fours) | 1-BIT, 3:2 |
| 128 | eighth | his eyes leave the screen for the lens (the match cut on the eyes) | |
| 132 | | the head follows: the stare. He never blinks | |
| **135** | **3.2** | the world greys out (System 7 "disabled" checker); only the kid stays live; zoom rects grow from his eyes (135-136) | |
| 137 | | the alert is open: `age 8`, Orb icon, `MAS MANALT` / `no equity.`, Cancel greyed, OK default | |
| 139-149 | | a stranger's pointer comes in from the bottom-left, on twos, and waits on Cancel | |
| **150** | **3.3** | it clicks Cancel (1 px press): nothing. It backs off 3 px at 158 | |
| **165** | **3.4** | the kid clicks his mouse; OK inverts | |
| 166-167 | | the dialog zooms shut into the curve's tip; the world un-greys | |
| 168-179 | | **render front**: a cyan scanline sweeps left→right, a spark rides the staircase; behind it, 2008 in EARLY-WEB 16, full 16:9 (the pillarbox is rendered away) | 1-BIT → EW16 |
| 168-188 | | Mas (23) strides out of the stage-right wing into the spot, 4-drawing stride on threes | EW16 |
| **180** | **4.1** | green collar pops (+ a 2 px camcorder bump); `JUN 09 2008` | |
| 182-190 | | the turtleneck sleeve (stage left, faceless) tosses the clicker; it arcs over the TPOOL screen | |
| 187 | eighth | the coral collar pops | |
| 190 | | he catches it and presents; the breadcrumb reaches the pin, which drops; `where u at?` at 193 | |
| **195** | **4.2** | hard cut to 2014 on the brass stab; 3 px spring settle; `2014`; the crowd holds him low | EW16 (lit) |
| 199-203 | | LUAP's dotted path draws itself from his hand to Mas's head | |
| 202 | eighth | the two collars re-pop over the hoodie | |
| 204 | | the crown leaves LUAP's hand and slides down the path on twos | |
| 195-209 | | heaved up out of the crowd in whole-pixel steps... | |
| **210** | **4.3** | ...and lands on the throne (1 px settle); founders cheer (a noodle cup, chopsticks) | |
| 217 | eighth | the paper crown lands on his head | |
| 218-224 | | the glint grows; the camera starts to pan right (220) and accelerates into the cut, landing the glint on (84, 108) | |
| **225** | **4.4** | cut on the glint → candle flame (same pixel); EW16 | EW16 |
| 225-239 | | (fallback) hard switch to BASE on the cut; the glint shrinks into the flame; `2015`, THE WOODROSE menu card, Gerg typing | BASE |

## Style switches (sparing, each motivated)
1. **1-BIT, authored** (not a threshold): every material is an 8x8 MacPaint pattern ladder, screen-locked. The kid gets the early-Mac 1 px paper keyline so he reads on the night wall. The freeze is the System 7 disabled look (50% checker on paper), because the name card is a system alert.
2. **Render front 1-BIT → EARLY-WEB 16**: the scanline literally upgrades the world, and the 3:2 frame widens to 16:9 as it passes.
3. **EARLY-WEB 16, two lit variants** (`palettes.ts`): derived from the engine set with `.with()`; the solver's picks are hand-`pin`ned where a lit scene needs them (skin shadows were going red, the polo mid navy, greys blue). ERA08 swaps the orange/gold for the polo green and a hair brown; ERA14 is the engine palette with pins.
4. (removed in the polish pass) the radial candle front: 2015 is a hard switch to BASE on the cut.
- Not used here: GLYPH (nothing in this span is the machine watching; the Orb is only a 1-bit icon in the alert), LEDGER, TERMINAL.

## What I built (all in `src/dev/meras/`)
- `timeline.ts`: span constants and the cue table.
- `bit.ts`: 1-bit painting (ink/paper, pattern ladder, pools, greyed-out, invert). `bitfig.ts`: a small 1-bit figure renderer (shapes with an ellipsoid/cylinder normal, one light, quantised to pattern ladders, contour, stamps, early-Mac halo).
- `kid93.ts`: **a new, larger kid Mas** (medium shot, head ~60 px; the cast's `drawMasKid` is a wide-shot sprite whose 2 px eyes can't carry the stare). Three head drawings (A at the screen, A2 eyes on the lens, C turned to camera), forward cowlick, level calm lids, the one-pixel smile, striped tee, click pose.
- `era1993.ts`: the bedroom (blinds, rocket poster, floppies), the computer from behind as a black box with a glowing rim, the staircase curve, the alert card (own implementation: movable-modal title bar, 32x32 Orb icon, rounded buttons with the default ring, greyed Cancel), the pointer, Mac zoom rects.
- `mas08.ts`: extends the cast's `masStage` with a 4-drawing stride and three collar states (flat / green up / both up).
- `era2008.ts`: the keynote from the audience: blue stage wash, the TPOOL slide (2008 web-map colours, glossy wordmark with reflection, BETA starburst, the breadcrumb as the curve, the pin, `where u at?`), floor reflection, spot, wing curtain, audience silhouettes with two people filming, the faceless sleeve and the clicker toss, camcorder drift + OSD.
- `era2014.ts`: warehouse with pendant light cones, the banner, the throne (open laptops as a crest, a tapered back of closed laptops, a cushion, a dark plinth, ramen-cup armrests), four generic hoodie founders (lift/cheer drawings, forks, a laptop), LUAP on a stack of essays, the dotted path, the paper crown (the cast crown recoloured to paper), collar re-pop, the glint, the hand-off pan.
- `era2015.ts`: fallback WOODROSE frames: dusk window, panelling, sideboard candelabra, linen with the teal runner, Gerg typing (cast `drawGergTable` with keycaps), menu card, the radial candlelight front.
- `scene.ts` (pipeline), `Meras.tsx`, `entry.tsx`, `tools/preview.ts`, `audio/sketch.ts`.
- Read-only use of: `src/shared/pixel/**` (engine) and `cast/mas.ts` (`masStage`, `masThrone`), `cast/gerg.ts`, `cast/kit.ts` (`seg`).

## Sound plan for this span (the sketch in `meras-scratch-audio.wav` follows it)
**Music** (the score's tiers, same hook in every tier: F F F F G A♭ C F):
- **T1, 1993 (120-167):** sub boom on F at the DROP, the first minor third; square bass on eighths; noise hats; pulse-wave beeper **F F F** at 120/127/135, then the beeper **stops while the dialog is open** (the music is literally waiting on the modal). The OK click completes the phrase with **C** at 165; F again at 172.
- **Render front (168-179):** a tape transport clunks and comes up to speed: the joke is that the next tier is cassette.
- **T2, 2008-14 (180-239):** boom-bap on a warbly cassette (±15 cents wow), the hook on tape piano, one note per eighth from 180, so it lands the octave F at 232 right before the f240 hit. D♭maj7 pad → F minor at 210.
**Effects** (all tuned to the key; no meme sounds, no real OS sounds):
| frame | effect |
|---|---|
| 150 | the stranger's click, then a dry square **G♭ bonk** that sags a semitone and a half (the wrong note) |
| 165 | the kid's mouse click |
| 180 / 187 | collar pops, tuned A♭5 / C6 (rising: status) |
| 182-190 | (final: a small whoosh on the clicker toss; left out of the sketch to keep it clean) |
| 195 | lo-fi brass stab, D♭ |
| 202 | collar re-pop, F6 |
| 210 | Mas lands: the kick under it (final: a real crowd "ohh", see Vocals) |
| 217 / 218 | paper crown "fwip"; glock ping F6 on the glint |
| 220-224 | air whoosh under the pan into the cut |
| 225-239 | tape spin-up + an accelerating mechanical-keyboard roll into the f240 hit (mdinner1 carries the hit) |
**Vocals:** this span has no dialogue by design. One recorded element: at f210 a quiet, impressed crowd **"ohh"** (6-10 friends, one take, close together, no laughter) under the landing. I did not synthesize it; a fake crowd would be the corny version.

## Rig limits / known issues
- The 1993 world is locked off by design: its patterns are screen-aligned, so nothing in it may slide; everything moves by swaps (eyes, head, pointer steps, the curve growing on fours).
- The kid's head turn is two drawings (plus the eye lead). His arms are simple; the hands are mitt shapes at this scale.
- Mas 2008 is 82 px tall (the cast sprite): the collar pops are 2-4 px changes; they read because nothing else on him moves on those frames, and the sound sells them. His stride is my drawing on the cast's upper body; the arms don't swing (hand in pocket reads as swagger).
- The sleeve is only an arm by design (faceless). The clicker is 4x7 px in flight.
- 2014 founders are generic by design (no real people): simple lit faces with two eyes and a mouth; they read as a crowd, not as characters. LUAP is a small generic figure; his identity is carried by the essay stack and the label.
- The 2014 lamp pools are still simple ovals; a hand-shaped light on the brick would be the next pass.
- The 1993 case is now the largest light shape in the frame; the kid's paper face still wins as the brightest point, but it is closer than before.
- EARLY-WEB 16 is posterised on purpose (hand-pins, few checker mixes). Some transitional frames of the dinner in EW16 (225-232) look rough; they are on screen for only a few frames.
- 2015 is a fallback; the real set is mdinner1's. My dinner's cloth folds are stripy.
- The pan at 220-224 moves up to ~45 px/frame: it is meant to read as the start of mdinner1's whip, not as a camera move on its own.

## Resources that would raise quality
- **A 1993 reference**: two or three screenshots of System 6/7 dialogs and a MacPaint-era illustration you like — I would hand-match the button ring, title-bar stripes and pattern set exactly.
- **The polo colours** (green over coral is still the cast's guess) and whether the 2008 shot should be the real-event framing (audience camcorder) or a closer "news clip" framing.
- **A recorded crowd "ohh"** (phone is fine) and any mechanical keyboard for the 225-239 roll.
- **A composer pass or a DAW session**: the sketch's MIDI-like cue list is in `audio/sketch.ts`; I can export it as MIDI stems if you want to hand it to a person or an AI music tool (ElevenLabs/Suno), then lay the tuned hits on top in code.
- For the video-model interlace idea: this span is a poor fit (every frame is palette-exact pixel art); the 2008 TPOOL slide or the 2014 banner could take an *image*-model texture pass as reference art, but not generated video.
