# mdinner2: MARIO and NOLE cards + the OPEN → NOPE founding (intro frames 345-479)

This is the pixel edition of shot-table rows 6.4 to 8.4 in `final.md` §3. It continues THE WOODROSE from
mdinner1. **The room, its light rig, the diners' drawings and frames 345-359 are mdinner1's.** Those 15 frames
are drawn by mdinner1's own exported `drawFrame` into this span's owner buffer, so the overlap is pixel-identical by
construction (verified with `diff:345…359`: 0 px). From 360 on, this span's `drawFrame` mirrors mdinner1's draw
order and lighting calls (Alyi's flat planes and cyan rim, the linen, the lettering tags, the water line). The
freeze print and the card are the engine's shared module, `src/shared/pixel/freeze.ts`, the same one mdinner1
uses for GERG and ALYI.

## Polish pass (art director, 2026-09-25): what changed
- **Shorter freezes.** Mario's world is printed for one beat (360-374) and runs again from 375 under his card, which
  holds until the whip at 384. Nole's world is printed for two beats (420-449) and runs again from 450, with the card
  holding until Mas's touch at 466. The founding (465-479) and the neon relight play in the full-colour room.
- **One print for the whole dinner.** The frozen world is printed on cream paper in the founder's ink (Mario `F3`
  denim ink, Nole `R0` maroon), with the same sets (`freezePrint` / `freezeSolid` / `freezePop`), mdinner1's
  exported `PRINT_TONES` and a mirror of mdinner1's `printFrame`. The room gets a threshold plus one 50% screen.
  Figures, faces and lettering get a hard threshold. The featured founder gets his own brighter threshold and a
  2 px paper knock-out. Every printed figure keeps a 1 px ink contour. The linen prints as one clean paper field,
  so there is no dead band of navy at the bottom any more. Mas and whatever he holds are never printed.
  - Lettering stays legible in the print. THE WOODROSE sign and the vault's RED-TEAMED plate are tagged as text.
  - The neon prints as solid ink letters, with its glow rings dropped.
  - The check keeps `$1,000,000,000*` readable.
- **One card geometry** (`founderCard`): portrait window top-left, plate to its right, at most one fine-print line.
  Only the entrances differ.
  - Mario's window rises from below. His one fine-print line is a live counter, `WORD COUNT: 15,000+`, racing from
    366 to 374.
  - Nole's window slams from above. `*PLEDGED · RECEIVED: $133M` is cut, because the ledger flash says it.
    `SUED OVER IT.` is a name-sized rubber stamp (7 px caps, a double border, worn ink) in the fine-print row, landing
    on 435.
- **The paper wipe (401-404) is cut.** The telescope holds, aimed at the ceiling, straight into the burst at 405.
  The only sound there is the held sub.
- **The essay is in the world.** At 375 Mario's scroll drops from his back hand to the cloth and races down the
  running table to Mas (it used to come off the card's plate). The whip follows it.
- **The neon lights the running room** (`sign.ts` `SPILL`). This is a per-colour LUT matched by lightness into the
  tube's own ramp, at two strengths:
  - Near the letters every colour takes the hue. Skin goes to the warm skin ramp under red and to the cyan-skin
    ramp under cyan, so faces stay faces.
  - Farther out, only the shadows fill.
  - The soft masks resolve as an ordered falloff.
  - It covers the wall, the window, the cloth under the letters, Nole and the hull. Mas takes the far strength only.
  - It runs 412-419 as the sign swings in, and 450-479.
- **The room runs again after each freeze.**
  - Mario talks on 2s with the scroll in his back hand.
  - The glasses splash at touchdown and settle after 450.
  - The smoke rolls off and thins.
  - Nole pitches from the hatch, and the sign's swing settles to rest.
- **Coordination.**
  - Mas's dinner sprite is re-synced with mdinner1's (the eye catchlights).
  - The world clock reads mdinner1's `worldClock`, so a retime there carries over.
  - The neon lettering stays generic: a monoline pixel sans, never the real wordmark's letterforms.

## Outputs (`out/season/intro/moments/`)
| file | composition | global frame | what |
|---|---|---|---|
| `mdinner2-mario.png` | `mdinner2-mario` | 378 | the room running again under MARIO's card (WORD COUNT: 15,000+), the essay starting down the cloth |
| `mdinner2-telescope.png` | `mdinner2-telescope` | 398 | the live room: Mas aims the paper telescope at the ceiling |
| `mdinner2-booster.png` | `mdinner2-booster` | 416 | the booster through the ceiling, OPEN AI swung in and lighting the room red |
| `mdinner2-nole.png` | `mdinner2-nole` | 446 | the NOLE print (maroon), the card with `SUED OVER IT.`, Mas in colour |
| `mdinner2-nole-ledger.png` | `mdinner2-nole-ledger` | 451 | (new) the room running again; the check flashes LEDGER, `RECEIVED: $133M` |
| `mdinner2-nope.png` | `mdinner2-nope` | 479 | **key art**, full colour: Mas under `NOPE AI`, the neon on the wall, window and cloth, the place cards |
| `mdinner2.mp4` | `mdinner2` | 345-479 | 135 frames, 24 fps, 960×540 (`--scale=0.5`) |
| `mdinner2-scratch-audio.wav`, `mdinner2-with-scratch-audio.mp4` | (tool) | 345-479 | the re-cut timing scratch (see Audio) |

```
npx remotion still  src/dev/mdinner2/entry.tsx mdinner2-nope ../out/season/intro/moments/mdinner2-nope.png --bundle-cache=false --log=error
npx remotion render src/dev/mdinner2/entry.tsx mdinner2 ../out/season/intro/moments/mdinner2.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
python3 src/dev/mdinner2/tools/scratch_audio.py ../out/season/intro/moments/mdinner2-scratch-audio.wav
FF=node_modules/@remotion/compositor-linux-x64-gnu; LD_LIBRARY_PATH=$FF $FF/ffmpeg -y -i ../out/season/intro/moments/mdinner2.mp4 -i ../out/season/intro/moments/mdinner2-scratch-audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest ../out/season/intro/moments/mdinner2-with-scratch-audio.mp4
```
**Fast Node preview.** Bundle `src/dev/mdinner2/tools/preview.ts` with esbuild (`--loader:.woff=empty --loader:.woff2=empty --loader:.css=empty`), then run `node md2.cjs <outDir> <scale> <view>`. The views:

| view | what it renders |
|---|---|
| `f:<g>` | one frame |
| `grid:<g,..>` | several frames on one sheet |
| `c:<g>,<x>,<y>,<w>,<h>` | a crop of one frame |
| `cgrid:<x>,<y>,<w>,<h>,<g>,..` | the same crop across several frames |
| `diff:<g>` | this span's frame against mdinner1's |
| `tune:room=lo,hi,g;star=...` | re-tunes the print's curves for the views that follow |

The other tools are `tools/probe.ts` (the palette names down one column of a frame) and `tools/lut.ts` (prints the
neon spill LUTs).

## Integrating
- Local frame `f` = global `f + 345`. `<Mdinner2Sequence />` mounts it at 345 for 135 frames.
- **345-359** are mdinner1's frames exactly (delegated), so cutting from `<Mdinner1Sequence until={344} />` at 345 is
  invisible.
- **Hand-off at 480.** The room is live and in full colour. The sign reads `NOPE AI` and stays lit, the camera is at
  `(300, 8)`, and Mas is standing with his arm down. The roll call (`<MRollcallSequence/>`, 480-539) hard-cuts in on
  its first stab.

## Beat map (15 frames per beat)
| global | beat | picture | style |
|---|---|---|---|
| 345-359 | 6.4 | mdinner1's vault: RED-TEAMED ✓✓✓ at 348/352/356, Mario out 350, finger 357 | BASE |
| **360** | **7.1 HIT** | MARIO: the world is printed (2-frame flash-print 360-361), the card rises from below in 3 held steps | print, denim ink |
| 366-374 | | WORD COUNT races to 15,000+ | |
| **375** | **7.2** | the room runs again; Mario talks; the essay drops from his hand and races down the cloth | BASE |
| 384-389 | | whip left with the scroll; the card leaves on its near plane | |
| **390** | **7.3** | Mas takes the tail (390), rolls it (391-394), telescope up (395) and held on the ceiling | |
| **405** | **7.4** | the ceiling bursts (2-frame bloom step), the booster rides down, the neon swings in and lights the room | BASE + neon light |
| **420** | **8.1 HIT** | NOLE: printed at touchdown (flash-print 420-421), the card slams from above | print, maroon ink |
| **435** | **8.2** | `SUED OVER IT.` stamps into the card's fine-print row | |
| **450** | **8.3** | the room runs again; the check flashes LEDGER for 4 frames; smoke rolls off; Nole pitches | BASE, LEDGER on the check |
| 453-464 | | Mas's calm sip; his water line never moves | |
| **465** | **8.4** | Mas stands; 466 his hand on the N, the cards are place cards on the cloth; 473 the clunk; 474-476 AI lights | BASE, the neon's red and cyan light |

## Style switches in this span (sparing, each with one reason)
1. **The founder print** ×2, one beat each (Mario) and two beats (Nole): the frozen world. It is the dinner's one
   freeze grammar, shared with Gerg and Alyi.
2. **LEDGER**, 4 frames on the check (450-453): money. It is masked to the check only.
3. The burst's **2-frame family step** (405-406) is a flash, not a look.
4. The neon is a **light**, not a style: a palette LUT of the room under its colour, only where it reaches.
5. **No GLYPH** here. mdinner1 spends the dinner's glyph beat on the rose window.

## Files (`src/dev/mdinner2/`)
| file | what it holds |
|---|---|
| `timeline.ts` | the span, `FREEZE_M`, `FREEZE_N`, `T`, `worldClock` (built on mdinner1's), `boostClock`, `frozenAt` |
| `scene.ts` | the owner buffer (mdinner1's numbering), `drawFrame`, the neon light, the print, the switches and the UI |
| `cards.ts` | MARIO and NOLE on `founderCard` |
| `sign.ts` | the neon, and `SPILL` / `boxFalloff` |
| `scroll.ts` | the essay strip, the roll, and the telescope drawing. The paper wipe is removed. |
| `booster.ts` | `drawSmoke` takes `thin` |
| `masmd2.ts` | the COPY block, re-synced to mdinner1's sprite |
| `props.ts` | the span's props |

## Rig limits / known issues
- **Standing Mas is still a block.** In the key art he is mdinner1's seated drawing with the torso extended, and
  there are no arms at his sides. A hand pass on `masmd2.ts` `stand` would lift the key art most.
- **The print mirrors mdinner1's `printFrame`.** It is not exported. If mdinner1 retunes it, re-sync the mirror in
  `scene.ts`. The tones are imported, so a tone change carries over automatically.
- **Frozen Nole is small** in the hatch. The check and the card portrait carry him.
- **The key art cannot hold everyone.** Mario is out of frame. His scroll and his `MARIO (JOINS 2016)` place card
  stand in for him.
- **The spill barely reaches Gerg**, who sits too far from the sign. Nole and the hull take the cyan.

## Audio: cue sheet (re-cut for the new timing)
Key: B♭ minor into C major (the dominant of the F-minor home), 96 BPM.

| global | music | SFX | vocals |
|---|---|---|---|
| 345-359 | pizzicato + soft two-tone klaxon | steam, door servo, triple chime 348/352/356 | 357 Mario's inhale |
| **360** | HIT B♭m, klaxon cut dead; a held low fifth for ONE beat | shutter | — |
| 362-404 | the sighing violin (F5 sinking to D♭5) plays on over the running room | WORD COUNT ticks 366-374 | — |
| **375** | — | room murmur returns; paper: the essay drops and races left (375-386); whip 384 | Mario, "well, actually—" (syllable swells 375-383) |
| 390-404 | — | grab, roll, the tube's "thup" (395); **396-404 a held sub swelling into the crack** (the paper wipe is gone) | — |
| **405** | fuzz-guitar pickup from 414 | ceiling crack and boom, debris, rocket roar to 419, gutter, glass slosh (never Mas's), neon buzz, hatch pop | — |
| **420** | the biggest HIT, C major; the C/G/E pad for TWO beats | shutter, card slam | — |
| **435** | — | stamp thunk tuned to C | — |
| **450** | — | LEDGER register tick; smoke hiss; room murmur; the hull ticks as it cools | Nole pitching (swells 451-458) |
| 453-464 | — | Mas's glass: ring, sip, ring | — |
| 465-479 | C pedal, drum fill into bar 9 | neon hum under his hand, N unhook and slide, clunk tuned to F at 473, AI ignition 474/476 | — |

The scratch is synthesis, and it proves timing, not sound. Vocals are breath-shaped swells at their frames.

## Resources that would raise quality
- **Audio.** Real stems for the two hits and the violin sigh, and a neon transformer hum, a sign clunk, a rocket
  landing, glass slosh, paper, and a rubber stamp. Two voice takes: Mario's "well, actually—" and Nole's pitch.
  They can be scratch reads.
- **Picture.** A pixel artist's hand pass on standing Mas and on Nole in the hatch. And a decision on an everyone-in-
  one-shot key art, which would need a half-scale drawing of the room.
- **Video-model interlacing.** A generated smoke / plume plate under the booster landing, quantised through the
  engine palettes at 480×270. If you connect a video model, that's the first thing I'd prototype.
