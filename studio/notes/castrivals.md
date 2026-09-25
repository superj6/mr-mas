# castrivals: MARIO, NOLE and the skyline bosses (pixel-adventure style)

Character art for the intro's founder entrances (THE WOODROSE, 10–20 s) and the dusk skyline (22.5–26.25 s),
in the approved pixeladv look: native 480x270, 4x nearest-neighbour, indexed palette plus hand-built light ramps.

## Deliverables (`out/pixel/cast/`)
| file | composition | what |
|---|---|---|
| `castrivals-sheet.png` | `castrivals-sheet` | Main board: MARIO portrait · vault vignette · booster vignette · NOLE portrait · the seven rooftop bosses at dusk. Each element is shown at its own hero frame. |
| `castrivals-motion.mp4` | `castrivals-motion` (48 f @24) | The same board on one clock, rendered at `--scale=0.5 --concurrency=1`. Shows the vault opening, Mario's silhouette, his step, finger and unrolling scroll; the booster descent, touchdown, hatch, lean-out, check thrust and a 4-frame LEDGER flash; every boss loop; portrait acting. |
| `castrivals-extra-nole.png` | `castrivals-extra-nole` | Height lineup (Mas / Mario / Nole, measured px). Nole v2 walk on 2s, doorway silhouette, jab/jab2/lean/raise, the hatch pose with the check, v1→v2 crop, and portrait mouths including the smirk and the check phone screen. |
| `castrivals-extra-mario.png` | `castrivals-extra-mario` | Mario portrait with mouths, lids and brows. Eight room-sprite states. The vault's 4 held drawings, 4 scroll stages, and the 3 DRAFT flutter drawings. |
| `castrivals-extra-bosses.png` | `castrivals-extra-bosses` | Each boss at 2x plus its 4 loop steps at 1x, and the DUSK tone ramps. |
| `castrivals-extra-freeze.png` | `castrivals-extra-freeze` | Both vignettes in BASE and in the name-card two-tone FREEZE: Mario in parchment + ink blue, never red; Nole in navy + cream with a rocket-red stamp. |

Render (one at a time, CPU box):
`npx remotion still src/dev/castrivals/entry.tsx castrivals-sheet ../out/pixel/cast/castrivals-sheet.png --bundle-cache=false --log=error`
`npx remotion render src/dev/castrivals/entry.tsx castrivals-motion ../out/pixel/cast/castrivals-motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error`
Fast iteration without Remotion: bundle `src/dev/castrivals/tools/preview.ts` with esbuild (`--platform=node`) and run
`node preview.cjs <outDir> <scale> still sheet@<f> grid@0,6,12 extra-mario bosslab nolelab mariolab`.
Append `@x,y,w,h` to a view to crop it.

## Files (all mine)
- `src/shared/pixel/cast/bosses.ts`. Rivals kit: CX colour families (heathered fleece navy, dusk violet-to-coral bridge, rocket red), tone-map painter, 3x5 micro font (`^` = tick), `seg`/`shiftPrim`/`memo`. Also the seven boss vignettes (`drawBoss(b, id, x, y, f)` with the feet on the roof line), `BOSS_LOOP`, `DUSK` ramps and `twoTone`.
- `src/shared/pixel/cast/nole.ts`
  - Room sprite v2: `noleImg(NolePose)`. Legs: stand / wide / w0–w3. Front arm: down / phone / jab / jab2 / raise / point / check / check2. Back arm: hang / phoneUp / phoneUp2. `lean` (integer shear), `noLegs` (hatch), light: lit / sil / fade1 / fade2.
  - Portrait (upgraded copy of the approved one): `drawNolePortrait`, adding mouth 4 (smirk) and `screen: 'check'`.
  - `drawBooster` / `boosterHatch` (SPACEZ booster) and `checkImg(ledger?)`.
- `src/shared/pixel/cast/mario.ts`
  - Room sprite: `marioImg(MarioPose)`. Legs: stand / step0 / step1. Arm: down / chest / raise / raise2 / scroll. Plus `scroll`, mouth 0–2, brow, blink, light: lit / sil / fade.
  - Portrait: `drawMarioPortrait`, with mouths 0–3, blink 0–2, brow, finger 0/1/2 (down / up / up + lift) and nod.
  - `drawVault` (4 door drawings, beacons, steam, RED-TEAMED HUD), `drawScroll` (whole-pixel unroll ending in "ADDENDUM:") and `drawDraft`.
- `src/dev/castrivals/`: `sheet.ts` (board + motion staging, Woodrose set pieces), `extras.ts`, `CastCanvas.tsx`, `entry.tsx`, `lab.ts` plus `tools/` (dev-only previews). `src/styleframes/castrivals.frame.tsx` holds the frame defs.
- Imports: only `src/dev/pixeladv/core/*`, plus read-only use of `pixeladv/art/{mas,nole}` in the extras lineup and the v1 comparison. I did not touch `src/shared/pixel/cast/kit.ts` (another builder's file). My helpers mirror its tone-map conventions, so both kits compose.

## Look decisions
- **Lighting pairs the rivals.** Nole keeps his approved look: cyan key from camera-left, tungsten back-rim. Mario is its mirror: warm candle key from the table, cold vault light as the back-rim. Side by side on the board, the vault's cyan spill motivates Nole's key.
- **Faces are hand-pixelled tone maps**: room-sprite heads for both, and every face and curl plane in the portraits. Bodies stay on the rig, so walks and poses remain cheap. Light states (fade, silhouette, freeze) are ramp swaps and never redraws.
- **Nole v2 is less boxy**: trapezius slope, deltoid caps, short sleeves with hems, thicker arms, chest plane and fold, lats in shadow. He also has swept hair with volume, a square chin and jaw, and a phone that glows.
- **Mario**: bumpy curly silhouette, thin frames with a warm glint, heathered ink-navy fleece quarter-zip with a standing zip collar and pull, and an index finger raised. He is anxious-earnest through the worried brow, never through body language jokes. No red anywhere; no Nintendo cues.
- **Bosses** (26 px, big-head rooftop scale). Each has one exaggerated prop that reads in silhouette, plus one loop:
  - TASYA: a 9 px key ring, keys swinging L/C/R/C.
  - RADNUS: a polite extinguisher puff while the CODE RED rotor turns (1.5 rev/s, under the 2 rev/s cap).
  - SIMED: speed chess against a robot arm; the clock buttons alternate.
  - KRAM: gold chain, pumping a KRAM vs NOLE / CANCELED poster.
  - NESNEJ: mirror-leather jacket, paperboy GPU toss from a crate.
  - MARIO + ADELINA: on the essay-stack lighthouse gallery; he waves, she ticks the clipboard, the SAFETY beacon sweeps.
  - NOLE: a megaphone on the zAI gantry, rocket behind.
- **Style switches exercised here**: the LEDGER flash on the check, 4 frames of `RECEIVED: $133M`, only in the motion; and the name-card two-tone freeze (extra-freeze). Both are palette operations, so they can land on any frame.

## Rig limits (read before staging)
- **Moves well:** swaps and whole-pixel moves. Arm and leg drawings, walk on 2s, lean shear, mouths, lids, brows, finger states, light states, prop states (door, hatch, scroll length, beacons, siren), boss loops, integer shake.
- **Would look cheap:**
  - Turning heads. The sprite heads are one 3/4 drawing each, so a turn needs new maps (about half a day per angle).
  - Mario walking more than 2 steps: only stand, step0 and step1 exist.
  - Nole sitting: no drawing exists.
  - Bosses doing anything beyond their one loop: each is a hand map, about an hour per extra drawing.
- The vault door's open drawings are procedural ellipses at 4 fixed angles. Keep them held; never tween between them.
- The booster is lit for the dining room. Put it in another set and its ramps need re-picking.

## Known issues / next
- **Booster panel:** Nole is small and fairly dark. The acting belongs in the portrait, which is the genre convention, but a tighter hatch-crop shot would sell the landing.
- **Mario portrait:**
  - The mouth reads small at 1x.
  - The under-jaw shadow band could be softened further.
  - The curls are procedural strokes; one hand pass on the silhouette would help.
- **Touchdown smoke** is a dithered puff, acceptable for 2 frames. A hand-drawn 4-frame cloud would be better.
- **Skyline:** the far city and window grids are placeholders for the skyline builder's towers. The bosses only need a roof line and a y value.
- **Height labels are measured opaque pixels:** Mas 78, Mario 80, Nole 93. They are not the nominal 74 / 86 from pixeladv.

## Audio hooks (for the sound pass; frames are the motion test's)
- **Vault:**
  - Two-tone klaxon on eighths from f0, cut dead when the name card lands.
  - Servo clunk on each door drawing (f4, f7, f10).
  - Steam hiss from f7.
  - Triple chime on the HUD ticks (f30, f34, f38), in the klaxon's key.
- **Mario:**
  - Fleece rustle on the step (f12, f16).
  - A breath-in before the finger (f20).
  - A paper whoosh plus a soft tick per scroll unroll (from f26).
- **Booster:**
  - Rocket roar f0–7, folded into the touchdown hit at f8.
  - Crunch of bread basket, glass slosh, candle gutter (f9).
  - Hatch pop (f12).
  - A cardboard thwack on each check thrust (f22, f34).
  - The stamp thunk is tuned to the C major hit.
  - The LEDGER flash gets a cash-register dry tick, not a meme "ka-ching".
- **Bosses:**
  - Key jangle (TASYA), siren whoop tuned to F (RADNUS), chess-clock clicks (SIMED).
  - Poster rattle (KRAM), card whoosh (NESNEJ), foghorn low note (lighthouse), megaphone squawk (NOLE, filtered).
  - One tuned pluck per tower pop comes from the score, not the sprites.
