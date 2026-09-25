I applied the art director's fixes to the cold open (mcoldopen), the eras (meras), the first dinner span (mdinner1) and the Mas cast module. All affected outputs were re-rendered under the same filenames and checked as full stills, zoomed crops and frames pulled from the MP4s. The typecheck is clean, apart from existing errors in `src/dev/realism`. Two cast-module items are not done (see Not done below).

Another builder had already made one shared print-and-card module in the engine (`src/shared/pixel/freeze.ts`), which mdinner2 uses. I moved mdinner1 onto it, so all four founders share one card design. That means their black name-card box with coloured lettering, not the cream one I prototyped. I deleted my duplicate module. mdinner2 already takes mdinner1's frozen-world timing and camera, so it follows my new timing automatically.

**What changed**
- **mcoldopen:**
  - At f94 Mas's head swaps to a new near-front drawing and holds through the Post.
  - The head tilt is now a visible 2–3 px lean.
  - He has forearms and hands on a keyboard, with two typing drawings on 2s. His hand moves to the mouse, and the click adds a finger press and a 1 px shoulder dip.
  - The hoodie below the portrait is repainted with folds and a pocket.
  - The monitor now hangs on a desk-clamped arm. Its screen and caret positions are unchanged, so the macros and the bookend still line up.
  - In the wide, the monitor is turned 3/4 toward him and the wall around it is one step brighter.
  - The token chips now use the show's pixel font at 1x, 2x and 3x over f112–114, with no bloom.
- **meras:**
  - Skin is pinned to flat early-web colours, so no face or arm is checkered and his 2014 face is no longer dark brown.
  - The 2014 founders have lit faces with two eyes and a mouth, four different hoodies, and a noodle cup and chopsticks instead of forks.
  - The 2014 brick wall shows everywhere at low tone, with warm lamp pools.
  - The throne is now a chair with laptop armrests and legs, and Mas reads as seated.
  - 1993: the beige case back is light with vents, the rocket poster reads as a rocket, the kid's face has one hard 50% shadow, and the room uses a few bounded patterns.
  - The 2008 curtain is narrower and reads as fabric.
  - f195 is a hard cut.
  - My 225–239 fallback switches straight to the full palette.
  - The 1993, 2014 and 2015 year stamps now share one design.
- **mdinner1:**
  - The world freezes for one beat per founder (Gerg 240–254, Alyi 300–314). The cards stay over the live room until 285 and 340.
  - The CTRL-key gag now happens inside the Gerg freeze.
  - The freeze prints as cream paper plus the founder's ink. Figures, lettering and the tablecloth use hard thresholds with an ink outline, and the featured founder gets a paper knock-out.
  - "PTO: 404" and the floating CTRL label are cut; the legend is now on the key.
  - Dinner-Mas has catchlights, and his water glass has its water line.
  - Alyi under the rose window is lit in flat planes with a cyan rim, not checkered.
  - The amber scanline at 225 is gone; the cut is a hard switch to the full palette.
- **Cast (`cast/mas.ts`):** the new front head (optional, so existing calls are unchanged), the 2008 sprite locked to 78 px, and a catchlight in every room-scale head. The year stamp lives in the new `cast/era.ts`.
- **Scratch audio:** the mdinner1 track is re-cut for the shorter freezes, with the room returning at 255 and the fire crackling from 315. The cold-open chip ticks now land on 113–114. All three tracks are re-muxed onto the new video.

**Compositions** (renders in `/home/jgon/project/art/out/pixel/moments/` unless noted)

| Composition | Outputs | Notes |
|---|---|---|
| `mcoldopen` | `mcoldopen-01-macro`, `-02-room`, `-03-stare`, `-04-scan` (f2, f52, f98, f102), `-05-post`, `mcoldopen.mp4`, `mcoldopen-with-scratch-audio.mp4` | `-05-post` is now f113, was f115 |
| `meras-key-{1993, alert, front, 2008, 2014}` | `meras-1993.png`, `meras-alert.png`, `meras-front.png`, `meras-2008.png`, `meras-2014.png` | same frames as before |
| `meras` | `meras.mp4`, `meras-with-scratch-audio.mp4` | |
| `mdinner1-opening` | `mdinner1-opening.png` | f237, unchanged |
| `mdinner1-gerg-card` | `mdinner1-gerg-card.png` | now f253, was f266 |
| `mdinner1-ctrl` | `mdinner1-ctrl.png` | now f251, was f274 |
| `mdinner1-cathedral` | `mdinner1-cathedral.png` | f299 |
| `mdinner1-alyi-card` | `mdinner1-alyi-card.png` | f334, now over the live room |
| `mdinner1` | `mdinner1.mp4`, `mdinner1-with-scratch-audio.mp4` | |
| `castmas-sheet`, `castmas-extra`, `castmas-motion` | the matching files in `/home/jgon/project/art/out/pixel/cast/` | the extras sheet now shows the front head |

**Strengths**
- The freeze is now a legible designed print, not a navy dot field, and it matches mdinner2's system.
- The look to the lens reads as real acting.
- The chips no longer break the pixel look.
- The 2014 shot has real faces, a real chair and a lit wall.
- No dither remains on skin in any of my spans.

**Weaknesses**
- The medium's hands are small (about 17 px) and the torso's lower corners are still boxy. A hand pass by a pixel artist would help.
- The front head is a first drawing; the jaw is slightly long.
- The CTRL key is drawn oversized (16×8) so its legend can be read.
- The 1993 case is now the biggest light shape in that frame.
- The 2014 lamp pools are simple ovals.
- Alyi's print ink is a rust red (the engine's colour choice), which sits close to Nole's red.

**Not done**
- The 3/4 head for RIMA in `cast/rollcall.ts`. The review files it under the roll call, which another builder owns, so I left it to avoid a collision.
- The readable DRAFT sheet in `cast/mario.ts`.

**Resources that would raise quality**
- A pixel artist's pass on the front head and the hands.
- Real mechanical-keyboard and shutter recordings.
- A small group recording for the dinner chants.
- Music stems I can re-cut to the new freeze timing (240–254 and 300–314).

The notes are updated in `studio/notes/mcoldopen.md`, `meras.md`, `mdinner1.md` and `castmas.md`. I also added a portrait-angle preview tool at `src/dev/castmas/tools/portraitlab.ts`.