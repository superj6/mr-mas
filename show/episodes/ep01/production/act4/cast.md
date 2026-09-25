# Ep1 Act 4: cast (character artist)

This is the handoff for scene builders. It lists the shared cast modules for Act Four ("The Blip, Told Twice", sc 24–31), what each one draws, and where each drawing is used.

- Code lives in `studio/src/shared/pixel/cast/`. These are new files; no existing cast file was edited.
- The preview and sheets live in `studio/src/episodes/ep01/act4/cast/`.
- Renders are in `out/ep01/act4/assets/cast/`.

## Conventions every module follows

- **Canvas and colour.** Native 480×270. Every colour is from the master palette. Figures are painted planes on the figure rig. Faces, eyes and mouths are hand-placed stamps.
- **Motion.** There is no rotation and no scaling. Motion is replacement drawings and whole-pixel moves.
- **Facing.** Room sprites face screen-right. Pass `flip` to face left.
- **Portraits** are 112×136. They drop straight into `nameCard({portrait})` and `portraitWindow({content})`.
- **Mouths.** Every speaking portrait uses the same six mouths: `A E O M rest smile`. They come from `cast/talk.ts`:
  - `visemeAt(f, t0, line, cps, hold=2)` drives the mouth from the typewriter head, on 2s.
  - `blinkSched(f, [starts])` gives the 3-frame blink.
  - `marioMouth(v)` maps the six mouths onto Mario's four (mario.ts: 0 rest/M, 1 E, 2 A, 3 O). Mario needs no new file.
- **Call tiles** come from `cast/calltile.ts`:
  - The standard tile is `TILE_W×TILE_H` = 150×86, the salvaged grid. Every `drawXTile(b, x, y, w, h, …)` also works at any size.
  - `bustY` keeps the face in frame when a tile is short.
  - Chrome is the caller's job: `tileFrame`, `tileLabel`, `tileVote` (the ballot icon: `back → edge → flip`, three held drawings via `voteFlipAt`), `speakRing` and `micIcon`.
  - Mini tiles are 38×22 and are separate drawings, never downscales.

## Modules

| Module | Portrait (112×136) | Tile / mini | Room sprite | Props and extras |
|---|---|---|---|---|
| `neleh.ts` | 6 mouths, 3 lids, eye dart, brows `level/query/worry`, `gaze:'down'` (reading). The glowing paper is held to her chest | Webcam bust, bookshelf, the paper glowing on the desk behind her; mini | Standing, 80 px: `paper / marker / write0 / write1`; lights `room/sil/fade`; `NELEH_MARKER_TIP` | `drawFootnotes(orbit, f, 'back'/'front'/'all', {scatter})` at portrait, tile and room scale. Freeze `f` to STOP; `scatter` 0..1 for sc 29 |
| `mada.ts` | Near-front poker face, arms folded, glasses. 6 mouths, 3 lids, `nod 0/1/2`; the `smile` is the one-pixel tell | Webcam bust (arms folded) plus spinner; `madaTileSpinner()` gives the spot the blue heart lands on; mini | Seated in the **bolted chair** (4 hex bolts): lid, mouth, nod; `drawMadaChair` draws the empty chair | `drawSpinner(cx, cy, f, {size lg/md/sm, stopped, col:'blue'})`: 8 steps on 3s. `stopped` dims the ring |
| `ttemme.ts` | Hoodie (off-brand purple), headset with boom mic, hourglass in hand (`sand`, `stream`). Brows `level/hype/unsure`, `gaze cam/sand` | Stream-room bust; mini | Standing: `hold / set / down`; lights `room/spot/sil`; the hourglass is drawn in sync via `TTEMME_ROOM_HG` | `drawHourglass` at `lg`/`room`: sand 0..1, grain stream, `hourglassFlipAt` (3 held drawings, including the side drawing), `hourglassBeats` (one grain per beat), `shatter` (glass flies for about 8 f; the sand holds its shape for 15 f, then falls). `drawChatOverlay` (the F egg). `drawStickyNote` (insert, reads `CEO (TEMP)`), `drawStickyNameplate` (room) |
| `terb.ts` | Tall; crisp shirt, navy tie, lit by fire. `helmet` on/off, brows `level/ah/flat`; the extinguisher head in the corner | Office bust (helmet off); mini | 92 px: walk `w0–w3` (`terbWalkAt`, 3 px per drawing), `stand`, `seat`. Arms `carry/spray/stamp/hand/none`; `helmet` flag (pops on at the door); `pin` flag; lights `room/fire/sil` | `drawSpray(tipX, tipY, dir, k)` from `TERB_HORN`. `drawExtinguisherInsert({pin})` (lever, handle, gauge, hose, pin plus tag). `drawPinTag` (the pin in Mas's fingers, tag reads **DO NOT REMOVE**). `drawTermSheet` (room/lg, stamped) |
| `the-quiet-vote.ts` | `drawQuietVotePortrait`: black, placeholder disc, "camera off", muted mic, an unlit speaker ring | `drawQuietVoteTile` at any size (small tiles keep only the mic plate); mini | `drawQuietVoteLaptop`: the laptop on a plain boardroom chair (sc 27) | No face, no room, no family. Only the ballot icon ever changes |
| `rima-speak.ts` | The roll-call face re-seated into 112×136. 6 mouths, 3 lids, brows `level/lift/firm`, the jacket-smoothing hand `smooth0/1`, spot `on/dark` | Tile with a **hard circular spotlight**: `spot 0` dark, `1` on; mini | — | `RIMA_HOUSE_DARK` gel |
| `tasya-speak.ts` | The roll-call face (glasses, cropped grey, beard, slate room). 6 mouths, 3 lids, brow `level/warm`, arms `clasp/ring/none`; `jangle 0/1` | — | Standing: `clasp / sign` (arrow pointing OUT) / `keys0/keys1`; lights `room/slate/sil` | The palette remap of the bullpen into Tasya belongs to the room builder |
| `adelina.ts` | New. Bob, reading glasses pushed up on her head, terracotta blazer. 6 mouths, 3 lids, brows `level/brisk/warm`, `phone:'ear'` with the handset, `throne` on/off | — | Standing: `down / reach / phone`; `throne`; lights `room/sil` | `drawThroneHandset` (lg/room, with the throne: "Click. The throne falls off") |
| `alyi-speak.ts` | alyi.ts portrait patched to 6 mouths (eyes `open/closed/tokens`) | `drawAlyiTile`: a doorway, and he is a reflection in its glass; mini | `drawAlyiStand` (doorway beats; clip it with the frame): arms `down/clasp`; lights `door/room/sil` | `alyiReflection` (mirrored, dim, translucent) and `drawAlyiWindow(…, {flicker:'gone'})` for the 2-frame there-and-not-there |
| `gerg-speak.ts` | gerg.ts portrait patched to 6 mouths; `gergGlow` = the laptop light remapped to **green**, including the underglow under his chin | `drawGergTile`: typing (a 1 px bob on gerg.ts's rhythm) plus keycaps; mini | — | — |
| `gerg-stand.ts` | — | — | Walking while typing on an open laptop: `w0–w3`, `type 0/1/2`, `look screen/up` (sc 31) | — |
| `mas-stand.ts` | — | — | Present-day Mas at 78 px: stand, walk `w0–w3` (`masWalkAt`), `reach` (the pin; `MAS_REACH_HAND`), `pocket`, `guest` lanyard; lights `room/monitor/sil` | — |

## Scene map

| Scene | Beat | Use |
|---|---|---|
| 25 (blueprint) | Figures and "Step four." | Voices only; the blueprint figures are the blueprint builder's. NELEH and MADA can use their portraits if the scene wants faces. MADA's outline carries bolts, matching the bolted chair |
| 26 | The five-tile grid | `drawAlyiTile` (mouth moving, `speakRing`, no sound), `drawNelehTile` (orbit; freeze `f` on the HOLD), `drawMadaTile` (spinner; `stopped` on the HOLD), `drawQuietVoteTile`, and ballot icons already `flip`. Mas's tile stays the salvage (`dev/mfinale/callart.vegasBg` plus `cast/mas`). See `callgrid.png` |
| 26 | The NELEH card | Portrait from `neleh.ts`. Card copy: `READ THE CHARTER. LITERALLY.` / `FOOTNOTES: ∞` |
| 27 | Board grid, Rima's tile | `drawRimaTile` with `spot 0 → 1` (the snap). See `boardgrid.png`. Her lines use `drawRimaSpeakPortrait` |
| 27 | All-hands doorway | `drawAlyiStand`, clipped by the door. "Is this a coup?": `alyiSpeakPortrait` or the doorway crop |
| 27 | Hearts | The last heart lands on `madaTileSpinner()`; `drawSpinner({col:'blue'})` spins it for one beat |
| 27 | Boardroom night | `drawNelehRoom` (`marker` → `write0/1`) and `drawFootnotes(roomOrbit)`; `drawAlyiWindow` (flicker `gone` for 2 f); `drawMadaSeated` plus spinner; `drawQuietVoteLaptop` |
| 27 | Lighthouse | Mario: existing `marioImg` / `drawMarioPortrait` with `marioMouth`. `drawAdelinaRoom` (`reach` → `phone` with the throne); portrait `phone:'ear', throne:true` for the line and the card; `throne:false` after the click |
| 27 | Lobby security tile | `drawMasStand({guest:true})` |
| 27 | TTEMME | Portrait plus `chat` overlay plus `sand`; `drawStickyNameplate` on the table; `hourglassFlipAt` → `hourglassBeats` |
| 27 | Tasya at the slate door | `drawTasyaRoom({arm:'sign'})`; `keys0/1` for the jangle |
| 29 | Gerg's video tile | `drawGergTile` |
| 29 | Tile avalanche | NELEH tile with `scatter` 0 → 1 as it goes; she speaks "Has anyone read the char—" with the bust mouths; the QUIET VOTE tile leaves without a sound; the MADA tile wedged in, spinner turning. Mini grid: `drawXMini` |
| 29 | Tasya O.S. | Portrait if needed |
| 30 | Doorway, Tasya | `drawAlyiStand` (`door` light); `drawTasyaRoom({arm:'clasp'})`, portrait `brow:'warm'` |
| 30 | Terb | Walk-in (`terbWalkAt`, `helmet:false` until the door, then `true`), CARD (full freeze) with Mas `drawMasStand({arm:'reach'})` in colour, `pin:true → false`, `drawPinTag` for the insert, `spray` plus `drawSpray`, `stamp`, `hand` plus `drawTermSheet` |
| 30 | The calm-off | PORTRAIT: `drawMadaPortrait` (spinner `stopped`, then `nod 0→1→2→1→0`) against Mas's existing portrait |
| 30 | The hourglass ends | The last grain (`sand:1`), then `shatter:k` |
| 30 | Lobby, no lanyard | `drawMasStand` walk (`masWalkAt`) |
| 31 | The vault | `drawMasStand` walks past; `drawGergStand` walks the other way, typing, and stops (`look:'up'`, mouth `open` for "What's in there?") |

## Verify and preview

- Sheets are one per module, plus `walkers.png`, `lineup.png`, `card-0..5.png`, `callgrid.png` and `boardgrid.png`.
- `motion.mp4` is 8 s: lip-sync, blinks, orbit, spinner stop and nod, sand and chat, Terb's walk-in with the helmet pop and the spray, the hourglass flip and shatter, Neleh writing, Alyi's flicker.
- Remotion render: `npx remotion still src/episodes/ep01/act4/cast/entry.tsx act4cast-sheet-<who> <png> --bundle-cache=false --log=error`. The ids are listed in `frames.ts`. The motion id is `act4cast-motion`.
- Fast Node preview:

```
npx esbuild src/episodes/ep01/act4/cast/tools/lab.ts --bundle --platform=node --outfile=<scratch>/lab.cjs
node <scratch>/lab.cjs <dir> 2 sheet:neleh motion:60
```

## Rig limits and known issues

- **Portrait angles.** Each portrait has one head angle: 3/4 camera-left, except Mada (near-front) and Rima (front). Nobody has a second head drawing. Flip a portrait to put it on the other side of the frame; its key light flips with it.
- **Busts.** Webcam busts have 6 mouths and 3 lids, with no brow acting except Neleh's.
- **Room heads.** Room-scale heads are 16 px maps with only `rest/open` mouths and a blink; lip-sync belongs in portraits. There are no room-scale arm poses beyond those listed, and no sitting poses except Mada's, Terb's `seat` legs, and Ttemme behind a table (the table hides his legs).
- **Patched speaking sets.** The Alyi and Gerg speaking sets are patches over the owners' portraits. If `alyi.ts` or `gerg.ts` moves a mouth, re-check the `patchMouth` boxes in `alyi-speak.ts` and `gerg-speak.ts`.
- **Name-card glyph.** `FOOTNOTES: ∞` needs an ∞ glyph, and the 7px face lacks one. The card or font owner has to add it.
- **Other card stats.** The other card stats render fine: `HEARTS SENT: 0`, `TIME LEFT: 72:00:00`, and so on.
- **Rima's blue.** Rima's `#1E6BFF` blue isn't in the master palette. The blue spinner and heart use the C family.
- **Glow.** The glow on Neleh's paper is palette steps toward plum on the lapel. It reads on the navy blazer only. On other backgrounds it falls back to W3.
- **Colour.** Tiles are drawn in full BASE colour. A desaturated call look, if anyone still wants it, is a palette set applied by the grid builder (the old `CALL_GREY` in `dev/mfinale/slot.ts`).

## Guardrail notes

- Every figure is caricature by persona: 1–2 features plus a prop. None is traced, and there are no body jokes.
- **NELEH** is lit like a scholar, never uplit, and never a villain.
- **THE QUIET VOTE** has no face and nothing personal.
- **ADELINA** is played as a co-founder only.
- **TTEMME**: the livestream site is never named. The overlay is generic; handles are unreadable colour dashes.
- **TASYA**: nothing in the design leans on an accent.
- **ALYI**: the reflection motif is glass, not religious imagery.
- There are no real logos. The call UI is generic.
