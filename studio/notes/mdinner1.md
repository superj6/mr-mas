# mdinner1: THE WOODROSE opening + the GERG and ALYI cards (intro frames 225-359)

This is the pixel edition of shot-table rows 4.4 to 6.4 in `final.md` §3.

## Polish pass (polish-a, 2026-09-25): the art director's fixes
- **The world is printed for one beat, not frozen for two.** GERG: the print is 240-254, the card holds over the live room until 285. ALYI: the print is 300-314, the card holds until the candle wipe at 340. `FREEZE_G/FREEZE_A = {t0, t1, card}` in `timeline.ts`; `worldClock` follows (w = g - 15 from 255, g - 30 from 315). mdinner2 imports `worldClock`/`camera` from here, so it stays in sync.
- **The key gag lives in the one frozen beat**: he looks at us (240), at the hanging key (244), plucks it (248), looks at it, looks at us (253), and pockets it as the room resumes (254-256); the one-pixel smile at 259 while Gerg types on, one key short; a glance at Gerg at 268.
- **The freeze is a print, on the engine's one print system** (`src/shared/pixel/freeze.ts`, shared with mdinner2): cream paper + the founder's ink (GERG green, ALYI orange-red). Paper / one 50% screen / ink for the room; figures, faces, the chairs and the effigy on a hard threshold with a 1 px ink contour; lettering (THE WOODROSE, UNALIGNED) on its own mid threshold; the tablecloth on a low threshold (a clean paper field with ink edges: the bottom third is a printed tablecloth with two chair backs, not a navy band); the featured founder on a brighter threshold, knocked out of the screen by 2 px of paper. The first two frames of each hit are the flash-print (nearly all paper). On the GERG hit the frame re-frames 18 px up the wall (`CAM.yCard`), so the card sits on the wall and the table sits lower.
- **The cards are the engine's one founder card** (`founderCard`, same geometry as MARIO and NOLE); ALYI keeps his lancet window and drop-in, with the standard plate beside it. At most one fine-print line: GERG `SLEEP: DEPRECATED` (PTO: 404 is cut), ALYI `PRODUCTS: 0 · BUNKER: YES`. GERG's portrait blinks once (266).
- **No floating label**: the CTRL legend is printed on the keycap (a 16x8 modifier key with a hand-pixelled `CTRL`).
- **Dinner-Mas has one catchlight per eye.** Mas's water glass has its flat water line (matching mdinner2's).
- **Alyi under the rose window is lit in flat planes**: the god-rays skip his pixels (no checker on his face or robe); he takes a cyan rim and one flat rung of machine light on his upper third (`alyiRim` in `cathedral.ts`).
- **225 is a hard switch**: the dinner is BASE from its first frame; the amber render front is gone (meras ends its whip in early-web on 224). The 2015 slate is the shared `eraStamp`.
 It uses the shared engine (`src/shared/pixel`) and the cast modules without modifying either. Everything the cast didn't have is in `src/dev/mdinner1/`.

## Outputs (`out/season/intro/moments/`)
| file | composition | global frame | what |
|---|---|---|---|
| `mdinner1-opening.png` | `mdinner1-opening` | 237 | 2015: Gerg typing, keycaps popping; his napkin is now a website; Mas steepled in the arched window |
| `mdinner1-gerg-card.png` | `mdinner1-gerg-card` | 253 | the GERG print: the card, Mas in colour holding the CTRL key, looking at us |
| `mdinner1-ctrl.png` | `mdinner1-ctrl` | 251 | Mas holds up the CTRL key he just plucked out of the frozen air (legend on the cap) |
| `mdinner1-cathedral.png` | `mdinner1-cathedral` | 299 | the wall has become a server cathedral; Alyi levitates; the effigy burns |
| `mdinner1-alyi-card.png` | `mdinner1-alyi-card` | 334 | the ALYI card over the live room: token eyes; Mas toasts a marshmallow on the burning effigy |
| `mdinner1.mp4` | `mdinner1` | 225-359 | the span: 135 frames, 24 fps, 960x540 (`--scale=0.5`) |
| `mdinner1-scratch-audio.wav`, `mdinner1-with-scratch-audio.mp4` | (tool) | 225-359 | a **timing scratch** track, not sound design (see Audio) |

There is also `mdinner1-vault` (f359), which is not in the delivered five. It is the hand-off frame, for a continuity check against mdinner2.

```
npx remotion still  src/dev/mdinner1/entry.tsx mdinner1-opening ../out/season/intro/moments/mdinner1-opening.png --bundle-cache=false --log=error
npx remotion render src/dev/mdinner1/entry.tsx mdinner1 ../out/season/intro/moments/mdinner1.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
python3 src/dev/mdinner1/tools/scratch_audio.py ../out/season/intro/moments/mdinner1-scratch-audio.wav
```
Fast Node preview (about 1 s for several frames): `npx esbuild src/dev/mdinner1/tools/preview.ts --bundle --platform=node --outfile=<scratch>/md1.cjs`, then run `node <scratch>/md1.cjs <outDir> <scale> f:<g> | grid:<g,..> | crop:<g,x,y,w,h> | cgrid:<x,y,w,h>@<g,..> | tune:<g>@lo,hi,gamma[,slo,shi,sg]@... | lab:mas`. All frame arguments are **global** frames. In the Node preview, glyphs are shown only as tinted cells.

## Integrating (frame numbers match the intro timeline)
- Local frame `f` equals global frame `f + 225`. Every constant in `timeline.ts` and `scene.ts` is a global frame. `MD1 = {from: 225, to: 359, frames: 135}`.
- `<Mdinner1Sequence />` (in `Mdinner1.tsx`) mounts the whole span at global frame 225.
- **Overlap with mdinner2:** mdinner2 starts at global 345 (the vault). My f340-344 lens-side flame wipe is built to be that hand-off, so mount `<Mdinner1Sequence until={344} />` and cut to mdinner2 at 345.
- My own 345-359 is a fallback vault using the castrivals `drawVault` and `marioImg`. It already sits on mdinner2's beats: ticks at 348, 352 and 356, Mario out at 350, finger up at 357.
- The previous shot, meras (2014), should end with the crown glint at native (84, 108), i.e. 1080p (336, 432). That is where the sideboard candelabra flame is at f225.

## Beat map (15 frames per beat; hits on beats)
| global | beat | picture | style |
|---|---|---|---|
| 225 | 4.4 | hard cut on the candelabra flame, already in the show's full palette; a 5-frame whip right, with highlight-only pixel smear | BASE |
| 229-239 | | slow truck (1-2 px/f); `2015` slate (the shared era stamp). Gerg types on 1s, keycaps pop every 2 f; CTRL key pops at 226 | BASE |
| 232 | eighth | the napkin sketch becomes a live website; Mas's eyes go to it at 234 | |
| **240** | **5.1 HIT** | **GERG PRINT**: 2-frame flash-print (nearly all paper), 2 px drop-kick, then the frame re-frames 18 px up the wall; the card opens. The CTRL key hangs mid-air | print (cream + GERG green); Mas masked out |
| 240-245 | | Mas, live: looks at us (the world stopped), then at the hanging key | |
| 246-253 | | reach (246), plucks it (248), looks at it (250-252), looks at us holding it (253) | |
| **255** | **5.2** | the world is live again (the card holds over it); he pockets the key as it resumes (254-256) | BASE |
| 259-261 | | the one-pixel smile; Gerg types on, one key short | |
| 266 | | GERG's portrait blinks once | |
| 268-275 | | Mas glances at Gerg, who has not noticed | |
| **285** | **5.4** | the card leaves with the truck + tilt. Rack LEDs ripple on (285-288), the nave opens in 3 held steps (286-288) | BASE |
| 287-299 | | Alyi leaves his chair: levitation lift on 2s, 2 → 22 px | |
| 289-291 | | the votives light; **the paperclip effigy raises its own UNALIGNED sign** | |
| 292-293 | eighth ("THE") | the rose window **boots as GLYPH tokens** for 2 frames, then resolves to stained glass | GLYPH (masked to the oculus) |
| 294-296 | | god-rays extend in 3 steps (they skip Alyi: he is lit in flat planes with a cyan rim) | |
| 296 | sixteenth | flame whoomph: the effigy ignites (oversized burst, then steady) | |
| **300** | **6.1 HIT** | **ALYI PRINT**: flash-print + kick. The stained-glass lancet drops in (4 held drawings, 2 px overshoot) | print (cream + ALYI ink) |
| **315** | **6.2** | the world is live again; on the card his eyes open as scrolling token streams | BASE; pixel token runs |
| 324-327 | | Mas's telescoping marshmallow fork extends (3 lengths) | |
| **328-335** | **6.3** (330) | marshmallow at the burning effigy's flame, toasting in 3 palette steps | |
| 336-339 | | retract, bite, chew | |
| 340-344 | | the lens-side candle wipes right to left at 3x parallax and takes the card with it | BASE |
| 345-359 | 6.4 | vault open; Mario silhouette → steps out at 350 → lit → finger at 357; RED-TEAMED ticks 348/352/356 | BASE |

## Style switches in this span (sparing, each with one reason)
1. **The freeze print** ×2 (240-254, 300-314): one beat each, on the engine's print system (`src/shared/pixel/freeze.ts`), tone curves tuned for this room in `scene.ts` `PRINT_TONES`. Mas, the key he holds, his fork and the lens-side candle are masked out with an exact per-pixel owner buffer (`OwnedBuf`), so the tablecloth over his lap still prints.
2. **GLYPH** ×1, 2 frames (292-293): inside the rose window only. The machine opens its eye, and it's gone before it reads as an effect.
3. Alyi's token eyes stay pixel token runs (the cast's design), not the glyph font.
- Removed in the polish pass: the amber EARLYWEB16 → BASE render front at 225-229 (225 is a hard switch).

## What I built (all in `src/dev/mdinner1/`)
- `timeline.ts`: the span, beats, freeze windows, a **world clock** that stops during freezes and resumes without jumps, the whole-pixel camera path (whip, truck, tilt, snap), and the freeze kick.
- `set.ts`: THE WOODROSE, a 1120x300 world painted once as (material, level) and lit per frame with **world-anchored dither**, so trucks never shower-door. It contains:
  - tall dusk windows onto Sand Hill oaks, with the arched window behind Mas as a Last Supper halo
  - brass `THE WOODROSE` lettering
  - walnut wainscot, pendants, and the candle and candelabra
  - linen with a teal runner (the thread, lying flat)
  - empty chairs on both sides of the table
  - Alyi's bay: fluted pilasters and an oculus
- `cathedral.ts`: the pilasters become rack columns. A lancet opening shows an endless nave whose vanishing point sits behind Alyi's head. Also here: the neural-net rose window, the LED votive stands, and the cyan god-rays.
- `masdinner.ts`: **new Mas drawings**, seated square to camera, warm key and cool window rim. It uses the cast's `camera` head map, eyes and mouths. Arm drawings: steeple, reach1, reach2, hold, pocket, rest, fork, roast, bite. Back and front layers let forearms rest on the cloth.
- `props.ts`: the CTRL key (a modifier, so wider than the popcorn caps; 3 tumble drawings), the napkin→website, and the paperclip-robot effigy (1 px wire, arms 0/1/2, sign held aloft). Also the fire (a teardrop heat field with walking tongues and embers), the telescoping fork with a 4-step marshmallow, and the lens-side wipe flame.
- `cards.ts`: the GERG card (engine `nameCard` plus the egg row) and the ALYI stained-glass lancet card. It also has the `2015` slate, the `CTRL` object label, and `textDot` (the engine font has no `·`).
- `scene.ts` (the staging), `Mdinner1.tsx`, `entry.tsx`, `lab.ts` (Mas pose sheet), `tools/preview.ts`, `tools/scratch_audio.py`.

## Rig limits / known issues
- Dinner-Mas is one frontal head (the cast's `camera` drawing). A turn toward Gerg or Alyi is an eye dart only. His reach is a 2-drawing swap and reads fine at speed.
- The room is a table-height tableau, so the room sprites are small (about 50 px seated) and the acting lives in the cards. In the print the bottom third is a paper tablecloth with two ink chair backs and an ink floor strip.
- Gerg's popcorn caps are 3 px. They read as motion, but frozen mid-air at 240 they are specks.
- The printed fire (300-314) is a paper flame shape; from 315 it burns live.
- The CTRL key is drawn a little over-size (16x8) so its legend reads; it is the hero prop, but next to 3 px popcorn caps it is a cheat.
- 345-359 overlaps mdinner2 (see Integrating).

## Audio: cue sheet for this span (planning, frame-accurate)
Key F minor, 96 BPM. The "no third" joke holds until the f120 drop; from there the dinner is in minor. Stems follow the picture's tiers: this is the "crisp" tier (clean mix, real room reverb, no tape wobble).

| global | music | SFX | vocals |
|---|---|---|---|
| 225 | tape spins up to speed from the 2014 tier (pitch ramp ≈80 ms) | whip whoosh (short, bright); candle flare | — |
| 225-239 | half-bar pickup: brushed kit, piano ostinato on F | **mechanical-keyboard snare roll** (16ths → 32nds, crescendo). Real keyswitch recordings are wanted; each popped keycap gets a tiny plastic "tock" | room walla, very low (restaurant), cut dead at 240 |
| 232 | — | a single soft UI tick (napkin → website) | — |
| **240** | **HIT on Fm**: timpani, brass stab, low piano, 808 boom; the kick goes half-time | camera shutter (2 frames, matches the pop) | — |
| 241-254 | held low F/C fifth (organ or low strings), almost nothing else: the world is printed | room tone only. Foley on Mas: key pluck (248, a tiny plastic click + a sparkle), hoodie-pocket rustle (254) | — |
| 255-284 | the kit comes back in (a tiny tape catch on 255), quarter-note kicks | Gerg's keys resume (one key short), the room walla returns, low | — |
| 259 | — | nothing on the one-pixel smile (silence is the joke) | — |
| **285** | organ swell begins toward D♭ | server fans spin up; rack LEDs as rising blips (285-288); votives as faint glass ticks (289) | **whispered chant "FEEL"** (a small group, close-miked, dry) |
| **292** | — | rose window: a soft bell/celesta on F (the glyph boot) | **whispered "THE"** |
| **296** | — | **flame whoomph** (low thump + rising crackle) | — |
| **300** | **HIT on D♭**: brass + timpani; a **wordless choir** enters ("ah", no words) | shutter | **shouted "A-G-I!"** at 300 / 303 / 307 (3 syllables, small crowd, big room) |
| 315 | choir holds | token-eyes: a faint digital shimmer (3 high blips) | — |
| 324-327 | — | three telescoping clicks (a camp-fork extending) | — |
| 315-339 | choir holds | the room is live again: the effigy fire crackles while he toasts the marshmallow on it | — |
| 337 | — | a soft marshmallow bite | — |
| 340-344 | choir releases | a big close **flame "whoof" passing the lens** (pan right→left) | — |
| 345-359 | pizzicato under a **two-tone klaxon on eighths** (soft) | steam hiss; servo on the door; **triple chime** at 348 / 352 / 356 (the RED-TEAMED ticks) | — |

The scratch track (`mdinner1-scratch-audio.wav`, muxed into `mdinner1-with-scratch-audio.mp4`) is all pure synthesis. It exists only to prove the timing. The two HITs are its loudest frames, at 240 and 300. Vocals are **not** faked: each vocal line is marked by a breath-shaped noise swell at its exact frame.

## Resources that would raise quality
- **Audio:** access to a music model or library (for example Suno/Udio-class for the theme stems, or a licensed trailer-hit and choir library). Also an SFX model or library (ElevenLabs SFX, or real mechanical-keyboard and camera-shutter recordings) and a voice source for the whispered and shouted chants (a TTS/voice model or a small recorded group). With stems, I can re-cut them to these frames.
- **Picture:**
  - reference photos of the real dining-room type (a high-end Sand Hill hotel restaurant at dusk), to hand-pin the wall materials
  - a decision on whether the cathedral should also appear in mdinner2's shots (the bay stays lit after 300 in my span)
  - a pixel artist's hand pass on the dinner-Mas torso and the effigy
