# Ep2 v1: the cold open's picture (sc 1, "The mammoth, and what came through the door")

> **Status: built, rendered and looked at, 2026-10-09, by the cold open's picture pass.** One scene module, `studio/src/episodes/ep02/pixel/coldopen/scenes/sc-1.ts`, draws all 13 shots of the v1 EL lock (1,320 f, 55.0 s), with the scene's own drawings in `coldopen/sets.ts`. The 2.A leap is the **Runway take** (Veo 3.1 Fast, objects only), spliced into the wall screen at full 1080p as overlay layers, the way Ep1's 3D CLOD went into Act One. The picture is `out/ep02/v1/picture/coldopen.mp4` (silent; the mix is the sound pass's), its contact sheet `out/ep02/v1/picture/coldopen-sheet.png`.
>
> **Checks [M]:** `check`: 13 layouts, 0 stand-ins, 0 problems. `scenecheck --every 8`: 0 frames differ. Flash check (`flash_seg.py`): at most **1** flash in any second, **0** red, pass. Overlays: 255 frames laid (1.01: 72, 1.02: 175, 1.03: 8), 0 missing, 0 refused. A scoped `tsc --noEmit` over `coldopen/` and `art/creatures.ts`: 0 errors. Render: 23 s for the scene (two workers, `ops/heavy.sh`, `MRMAS_MAX_LOAD=40`).
>
> **What was looked at [J]:** 51 frames decoded from the rendered MP4 at 1080p (every shot's start, turn and end, more on the set pieces), plus picture stills between rounds; the fixes below came from those looks. Nothing was watched in real time or heard with its mix (R8).

**Contents:** [1. The shots](#1-the-shots) · [2. The 2.A leap: the Runway take](#2-the-2a-leap-the-runway-take) · [3. Fixed after looking](#3-fixed-after-looking) · [4. Where this departs from the plan, and why](#4-where-this-departs-from-the-plan-and-why) · [5. Weak, or for a human to check](#5-weak-or-for-a-human-to-check) · [6. Re-running](#6-re-running) · [7. Rules checked](#7-rules-checked) · [8. Files](#8-files)

---

## 1. The shots

Frames are the segment's (the scene starts at 0, so they are also the scene's). Marks are the lock's words and sounds (each layout's `marks`), with the planned frame as a fallback.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 1.01 | 0-71 | W, the side-on master (`art/sets/lobby2` drawLobby2) | **ARRIVE** (3.0 s, no line): FEB 15. The wall screen plays the take (f000-071) in its bezel, near-photoreal. Staff on beanbags watching; GERG typing on his own beanbag at the front row's left end (his green glow); SELBEEP under the screen aiming his clapperboard remote; MAS at his counter, his water and a staffer's coffee beside him, the Orb at his shoulder; the lobby chair (teal) on the runner; the director's chair. Rail `FEB 15, 2024` (host). Sign `86` | the votives and rack LEDs tick |
| 1.02 | 72-246 | M: the stone wall close, a rack pillar, the bezel big | SELBEEP's bust (Ep2's sculpted head, lip-synced, proud) turned to the room; the take runs f018-165 behind him, the mammoth coming close. On "sentence" the **pixel foot** breaks the bezel's lip (it cracks, two chips fall) and the take **holds** on f165: the preview stops as it comes out | foot at the step (`mammoth_step_pixel` k148), in 3 held steps from k144 |
| 1.03 | 247-311 | W with GERG in the foreground (OTS over his laptop) | The screen steps the held frame down to our grid (k0-7: real, 2 px, the native grid, the palette); on the step (k8) the pixel mammoth is out on the floor, a **fifth leg for two frames**, the screen behind it the meadow with nobody in it; it walks screen-left a pixel a frame; heads turn. GERG, not looking up, room-flap mouth on "Which sentence?" | out at `mammoth_step_pixel` #1 (k8) |
| 1.04 | 312-479 | M: SELBEEP's bust in the right foreground, the master a rung down behind | "A mammoth walking through the snow…" lip-synced; the mammoth walks past the staff toward the lobby chair; the chair sags and melts in three held steps under "It understands physics."; at the back **Mas's glance**: his eye a pixel down to it | steps at `palette_drip` (k114), "understands" +6, "physics" +4; glance from k116 |
| 1.05 | 480-569 | M, as 1.04 | "Directionally." (proud to worry, lip-synced) over the mammoth standing in the puddle; on the hit the **2-TONE FREEZE** (Ep1's `freeze2`, the dark room's curve) with **Mas kept in colour**, and the card `SELBEEP / DIRECTOR OF MAMMOTHS.` + `MAMMOTHS CONTAINED: 0` (Ep1's gag card, top left, clear of his face), held to the cut | `freeze_hit_F` (k30) |
| 1.06 | 570-667 | W, the master, FEB 29 | Rail `FEB 29, 2024`. DOT up her ladder from behind, beside the sign: `86` off, a bare hook, `100` up on the hang. The mammoth wanders out screen-left in front of Mas (his head over its back); its prints in the carpet; the chair a teal puddle; the staff back at their laptops. The first THUD (outside): the door glass shivers | `plate_hang` (k27), `door_glass_rattle` (k78) |
| 1.07 | 668-798 | M: the back counter (Ep1's approved Mas medium rig) | Mas still, hands on the stone top, the Orb at his shoulder; his water, a staffer's coffee; the sign's foot over him (`FIRE MAS: 100`); DOT's ladder and her feet at frame right. SELBEEP is off screen (his voice is established). THUD: the coffee jumps (drops), his water doesn't; the ladder sways a pixel | `cup_jump` (k127), `ladder_sway_creak` (k129) |
| 1.08 | 799-889 | OTS over GERG's laptop, the master behind | GERG, not looking up, room-flap mouth on "That's not the mammoth. The mammoth's on the fourth floor."; his laptop's lid low in frame, its green edge; the ladder still settling; the door glass still shivering | |
| 1.09 | 890-1009 | OTS-W over Mas's shoulder, straight down the axis | A new one-point view of the lobby in the master's lit materials: the rack pillars receding, the runner, the frosted glass entrance. THUD: a shape behind the frosted doors, the room layer shakes 2 px (Mas and the band never do). The doors bang open (four held drawings of the leaves), daylight down the floor, and for the swing the sidewalk: a planter, a `PAUSE` sign leaning on it. The hand truck rolls in by itself (no one pushing) and down the axis, the complaint upright on it growing in held steps, caption legible throughout (`NOLE v. MANALT ET AL.` / `YOU PROMISED!!!`), and stops at his feet; the doors swing shut. Mas's silhouette never moves; its rim warms when the doors open | `hand_truck_step` (k5), `door_bang_open` (k14), `hand_truck_roll` (k24) |
| 1.10 | 1010-1076 | ECU (`art/sets/lobby2-art` complaintPageECU) | Page one, all exclamation points; it lifts off in three held steps on the flutter; the contents `! .... 1` / `!! .... 2` / `!!! .... 3` held to read (2.4 s) | `paper_flutter` (k4) |
| 1.11 | 1077-1138 | W, the 1.09 camera | The complaint tips back off the truck and lands flat, face up: the last THUD (the room shakes; a ring of paper dust); the empty truck rolls off right. A curling flyer shakes off the nearest pillar, tumbles, and lands face up on it: `WHERE IS ALYI?` legible, its photo a doorway with nobody in it | `paper_stack_fall` (k3), `paper_flutter` (k21), lands k28 |
| 1.12 | 1139-1264 | LOW → MCU → LOW | The sign from below (drawn flat at 2x, keystoned across only so no letter breaks), DOT's orange-cuffed hand holding the spare `0` out. MCU MAS (Ep1's approved lobby CU): the head shake is the drawing a pixel over and back, twice; he never blinks. LOW: she lowers the 0; the second, smaller sign comes up under the first in her hand and hangs: `DAYS SINCE SOMEONE SUED MAS: 0`, held 2.5 s | `plate_hang` (k65) |
| 1.13 | 1265-1319 | ECU | The flyer on the complaint's page (`WHERE IS ALYI?`, the doorway, nobody in it) held a second; the Orb comes down into frame and looks (its servo); its iris (six blades) closes on the doorway in four held steps and holds on the door's light, which sits where the **intro's first frame** has its lit block (native x 82-116, y 37-120): the matched object for the SMASH TO INTRO | `orb_servo` (k9); iris from k22 |

Lip-sync: SELBEEP's bust on his visemes (`face: lip`) in 1.02, 1.04, 1.05; GERG's portrait on the room flap of his take (`face: room`) in 1.03 and 1.08. No V.O. in the cold open (the plan's: on camera). No cursor anywhere.

## 2. The 2.A leap: the Runway take

- **The take [M]:** `out/ep02/v1/runway/clips/a1-veo31fast-t2v-mammoth-s215.mp4`, Veo 3.1 Fast, text to video, 8 s, 1280 × 720, 24 fps, seed 215, model audio off, **80 credits** (balance 165 → 85). Its `provenance.json` beside it (prompt, negative prompt, task id, hashes), as the manifest's §4 asks. Made with Ep1's client, `studio/src/dev/genvideo/runway/gen.py`, unchanged; the key never left `.env`.
- **Objects only [J, looked at nine frames across it and every 3rd frame of its last two seconds]:** one woolly mammoth walking at the camera through snow, a pine treeline, falling snow, its breath. No person, face, hand, rider, text or watermark.
- **The splice:** `coldopen/tools/aros_insert.py` cover-fits the take into the screen's rect (the master's 412 × 404 at 1080p; the medium's 1048 × 592) and writes RGBA layers that the renderer lays over the picture (`overlay` on 1.01-1.03; `out/ep02/v1/inserts/aros/<shot>/manifest.json`). 1.02's manifest carries a check on Selbeep's line (`e2-co-0001` at k13), so a re-lock that moves it is refused loudly. The leap keeps its contrast: no grade, no rim, no down-rez (P12).
- **Our conversion:** 1.03 k2-7 steps the held frame down (2 px blocks, the native grid in true colour, the master palette: Ep1's tear and hourglass order, `insert.py`'s quantiser, imported); from k8 the screen shows the take's own meadow with the mammoth painted out, on our grid in the palette (`coldopen/aros.ts`, generated by the same tool). The pixel foot (1.02) is ours, placed where the take's near foot meets the screen's lip (the tool measures it: `AROS_FOOT`).
- **Timing across the cut:** the take is 8 s and 1.01 + 1.02 run 10.1 s, so 1.02 starts at f018 (1.01 ends on f071): the wide's small mammoth reads about the size of the medium's, so the overlap doesn't show [J]. From the foot's step the take holds on f165.
- **The Blender filler** (`art/aros/`) is kept as the art pass made it; the film uses the take.

## 3. Fixed after looking

Each was seen at full size, fixed, re-rendered and looked at again.
- **The mammoth's face** (`art/creatures.ts`, the art pass's drawing, used only by this scene and the art stills): its ear fringe was three stacked bars that read as the letter **E**, and its tusks were drawn 0.9 px a step, so they broke into **dotted lines** with a stray dotted arc. Now: a dark eye under a lit brow, the ear a shag patch, two whole cubic tusks thick at the root and tapering, lit above and shadowed under.
- **The meadow after the step-out** showed **ghost tusks** (the first clean plate left the tusks' tips in): the plate is now filled from the take's clean left and right edges.
- **GERG sat on air** in the wides (the 'sit' pose with his beanbag at his feet): the beanbag is under him now. In the two OTS shots his room sprite was **drawn twice** (behind his own foreground portrait): hidden there.
- **GERG's laptop** in the OTS read as a big grey crate with a "C" sticker, then as a white card: it is now the lid's back low in the frame, dark, its green edge lit, a fingertip glinting over it on his typing.
- **SELBEEP in the medium** first sat behind a ledge (a moulding band read as a counter in front of him), then, raised, his lanyard's badge ran down as a long strip (the bust's torso extension): the wall runs to the frame's foot and the bust sits at it. The wall's speckle noise read as dirt: removed.
- **SELBEEP in the wides** stood in the front row over a staffer's head: he stands behind the front rows now, and is kept clear of the screen's rect so the overlay never covers him.
- **The pixel foot** read as a striped box: it is now a shag leg flaring to a round grey foot with a ragged fringe and four nails, as wide as the take's leg at the lip, and it comes all the way out (it stopped two rows short, which hid the nails).
- **The freeze** printed the room almost all navy (the bright curve on a dimmed room): Ep1's `FREEZE_DARK` curve, undimmed, prints the lobby as a lobby; Mas stays in colour.
- **DOT's head covered the `100`** while she hung it: she stands beside the plate, her near hand on its edge.
- **1.07:** Mas's hands hung in front of the counter's panel (the medium rig's hands rest on a desk top): the counter now has a top surface seen from above; the water read as a teal box: it is a tumbler; the sign's last line was cut off at the frame's top: the sign's foot now reads `FIRE MAS: 100`.
- **1.09:** Mas's silhouette had stair-stepped shoulders (a cut-out): it is a head, a hood at the nape and one smooth shoulder curve. The `PAUSE` sign was hidden behind the complaint in the doorway: the truck waits in the doorway's left half and the planter and sign are at its right.
- **1.11:** the flat complaint's caption ran past its cover and under Mas's shoulder, the empty truck sat on top of it, and the flyer's headline collided with its photo: the complaint lands nearer and right, tipped back face up, the caption sits on its far half, the truck is drawn behind and rolls off, and the flyer's headline is one line of the tiny type over a foreshortened doorway.
- **1.12:** the art's keystone dropped rows, so `DAYS` read **`ORYS`**; DOT's plate left a cream remnant when her hand was painted out; the second sign was a different scale with its text crammed left. Both boards are now drawn flat at 2x and keystoned across only (no dropped rows), the hand and plate are drawn separately, and the second sign is the same board, smaller, on short wires from the first.
- **1.13:** the iris began at k13, so the flyer was on screen half a second: the flyer now holds a second before the iris closes. The art's flyer ECU puts a silhouette in the doorway; this shot's doorway has **nobody in it** (§4).
- **SELBEEP blinked on "physics"** (1.04): his blink schedule moved off the line's key words.
- **The lobby chair** sat behind GERG's laptop in the OTS (its back poked up like part of it): it moved along the runner to x 150, where the mammoth still reaches it on "It understands physics." and Mas can glance at it.

## 4. Where this departs from the plan, and why

- **1.03 is one shot, not a wide then an OTS.** The script has `[W]` then `[OTS]` inside 65 frames. A cut at about k36 would leave 1.4 s of step-out and put the first sight of GERG on a different axis. One wide with GERG in the foreground (his portrait, mouth on his take) keeps "Selbeep and the mammoth beyond him" (the plan's note) and the speaker visible (P9). [GUIDE: the plan's framing; reason P9, P4]
- **1.07 is a medium on Mas at the counter, not the master.** The beat's point is the coffee jumping and Mas's water not, four frames before the cut; in the master the cups are 4 px. The medium makes it read at 1080p (P7), gives Mas his first close look (P2), and keeps Selbeep off screen as the line is written. [GUIDE: the lock's `W`; reason P7, P2]
- **1.09 and 1.11 use a new set:** the lobby straight down its length (the master is side-on and can't look down the axis). It's painted in the master's own lit materials, so the two angles share a palette.
- **The flyer's photo has nobody in it** (1.11, 1.13). The art pass's flyer ECU draws a figure in the doorway; the plan says "its photo a doorway", the room-scale flyer is drawn empty, and the Act Three rule is no image of Alyi in any surface. The empty doorway is the question.
- **The second sign** is drawn as the same kind of board as the first (smaller), not the art's tiny-type board, so it reads at its read time.
- **The take holds** from the foot's step to the cut (1.02 k148-174): the plan doesn't say what the screen does once the foot is out; the hold makes the preview stop as its subject leaves it, and keeps the pixel foot joined to the take's leg [J].

## 5. Weak, or for a human to check

- **Nothing here has been watched in motion with its sound.** The marks follow the lock's sounds, but the THUDs, the step and the freeze hit want a look against the mix.
- **The step-out is a cut inside the shot:** the screen's close, head-on mammoth steps down to our grid (k2-7), then on k8 the room-scale mammoth is out on the floor, in profile, with its fifth leg. It reads as "it came out" in stills [J]; in motion it may want two in-between drawings of it climbing down.
- **The mammoth walks behind SELBEEP** for most of 1.03 (it comes out where he stands); busy for about a second.
- **GERG's laptop** is now a lid low in frame with a lit edge; it reads as a laptop more than it did, but not strongly. GERG's portrait is Ep1's (approved), with a three-state mouth, so his lip-sync is the room flap, not visemes.
- **1.07 is sparse:** Mas at medium scale is small in the frame, with a lot of wall.
- **The freeze card's print** (1.05) is a busy 50% screen over the lobby; the mammoth prints faintly.
- **The axis set's side walls** are mostly rack pillars (on brand for the cathedral of racks, but dense).
- **The largest luminance step** in the segment is the cut from the dark axis to the bright pages (1.09 → 1.10, a mean step of 0.50): one step, not a flash (the check passes), but a hard brightness cut.
- **The art stills** that draw the mammoth (`out/ep02/v1/art/`) were not re-rendered after the face fix; they show the old ear and tusks.
- **The overlay layers aren't in git** (146 MB); `aros_insert.py` rebuilds them from the take (§6). The take itself is git-ignored like every MP4.

## 6. Re-running

From the repo root; `S` is any scratch folder.
```sh
# the take (already made; 80 credits; only if it must be remade)
audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/gen.py t2v --model veo3.1_fast --duration 8 --ratio 1280:720 --seed 215 \
  --prompt "<see the provenance.json>" --negative "<ditto>" --out out/ep02/v1/runway/clips --name a1-veo31fast-t2v-mammoth-s215 --cap 80
# the overlay layers, the manifests and coldopen/aros.ts (~2 min; --plates-only rewrites only aros.ts)
MRMAS_MAX_LOAD=40 bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/coldopen/tools/aros_insert.py
# the picture
cd studio
node src/episodes/ep02/pixel/tools/build.mjs coldopen $S/r-co.cjs
node $S/r-co.cjs check
MRMAS_MAX_LOAD=40 X264_THREADS=1 ../ops/heavy.sh node $S/r-co.cjs scenes --jobs 2     # -> out/ep02/v1/picture/coldopen.mp4
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-co.cjs scenecheck --every 8
cd .. && bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py out/ep02/v1/picture/coldopen.mp4
```
A re-lock that moves 1.01-1.03's lengths, or Selbeep's first line in 1.02, makes the renderer refuse the overlay (it says why): re-run `aros_insert.py` after the re-lock.

## 7. Rules checked

P1 (pixel first, 1080p), P2 (Mas's medium and CU; foreground faces), P3 (3.0 s arrival before the first line; the aftermath: the complaint at his feet, the flyer, the head shake, the second sign), P5 (the full-size look, §3), P6 (no cursor), P7 (the coffee, the PAUSE sign, the caption, the flyer, the signs read at 1080p), P8/P14 (no person from the video model; DOT never shows her face; the flyer's doorway is empty), P9 (every speaker's face on screen or the voice established: Selbeep O.S. in 1.07 after three shots of him), P11-P13 (2.A, the Tier 2 leap, made by the video model, contrast kept; our conversion at the step-out), P15 (flash check: 1/s max, no red; must-read text held: the card 2.4 s, the stat 1.8 s, `PAUSE` 1.3 s, the contents 2.4 s, `WHERE IS ALYI?` 1.4 s, the second sign 2.5 s), P17 (no scaffolding), R1 (Ep1 read and imported only: `act2/kit2` freeze and gag card, `mas-medium`, `mas-cu`, `gerg`, `insert.py`; nothing under Ep1 edited), R10 (every render and the tool through `ops/heavy.sh`, one at a time), R11 (the Runway key read only inside `gen.py`; keyscan before the commit and the push), R13 (this note), R14 (scratch in this session's scratchpad). Broken on purpose: the two framings in §4 (GUIDE).

**Resource asks (R16, non-blocking):** Runway credits are at 85; two more takes (a 4 s take of the mammoth climbing down out of the frame, for the step-out's in-betweens, or an i2v take from our own pixel frame) would let the step-out move instead of cut. One human look at the cold open with its mix.

## 8. Files

- `studio/src/episodes/ep02/pixel/coldopen/scenes/sc-1.ts`: the 13 layouts.
- `studio/src/episodes/ep02/pixel/coldopen/sets.ts`: the scene's drawings (the master with its cast, the medium, the counter, the axis set, the OTS foregrounds, the pages, the signs, the flyer and the iris).
- `studio/src/episodes/ep02/pixel/coldopen/aros.ts`: generated by the tool (the meadow plate, the foot's x, the take's provenance).
- `studio/src/episodes/ep02/pixel/coldopen/tools/aros_insert.py`: the take → the overlay layers, the manifests, `aros.ts`.
- `studio/src/episodes/ep02/pixel/art/creatures.ts`: the mammoth's face (§3).
- `out/ep02/v1/runway/clips/a1-veo31fast-t2v-mammoth-s215.provenance.json`, `out/ep02/v1/inserts/aros/<shot>/manifest.json`, `out/ep02/v1/inserts/aros/sheet.png` (committed); the layers `l*.png` (git-ignored, rebuilt by the tool).
- `out/ep02/v1/picture/coldopen.mp4` (git-ignored) and `coldopen-sheet.png` (one labelled frame per shot).
