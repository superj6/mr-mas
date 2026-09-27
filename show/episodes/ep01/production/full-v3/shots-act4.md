# Ep1 v3: Act Four's shots (`v3-shots-act4`, 2026-09-27)

> **Status: built, checked and rendered. Nothing committed.** Track P2 of [PLAN.md](PLAN.md) for the `act4` segment (8:43.8, "the Blip, told twice"), on the final v3 stick lock.
>
> **What it is:** a port. Act Four v5's 83 layouts (`studio/src/episodes/ep01/act4/animatic/shots5.ts`, through its own `drawShot5`, the same way the pipeline's `act4-v5` test runs them) draw every shot v3 kept, on the v3 lock's frames. Only what v3 changed is drawn anew: 21 of the 79 shots. Nothing in `act4/animatic`, `pixel/act4-v5`, `shared/pixel` or the art passes' registries was edited. The v3 art is three new modules in `pixel/act4/art/`, as additive opt-in states.
>
> **Nothing here has been watched or heard.** Stills and crops were looked at (listed in §6). The render's numbers are measured.

## 1. Files

| What | Where |
|---|---|
| **The shot spec** | `studio/src/episodes/ep01/pixel/act4/shots.ts` (79 layouts: 58 `P` = v5's layout as it was, 21 `V` = a v3 change) |
| **The lock plan** | `studio/src/episodes/ep01/pixel/act4/plan.json` (lock_v5.py's tables + the v3 re-anchors; §2) |
| **The lock** (generated) | `studio/src/episodes/ep01/pixel/act4/data.ts`, `show/episodes/ep01/production/full-v3/lock/act4.json` |
| **New art** (additive, opt-in) | `pixel/act4/art/race.ts` (S1.01), `art/invite.ts` (S1.02, S1.06), `art/texts.ts` (S1.04, S1.09, S5.06, S7.07b, the name plates) |
| **The picture** | `out/ep01/full-v3/picture/act4.mp4` (1920 × 1080, 24 fps, with the v3 stick mix's Act Four chapter as temp audio), `act4.srt`, `act4.mp4.render.json` beside it |
| **The contact sheet** | `out/ep01/full-v3/picture/act4-sheet.png` (one still per shot, its middle frame) |
| Scratch (may not last) | `scratchpad/v3-shots-act4/`: the temp mix `act4-mix.wav`, the renderer `r.cjs`, `flash.ts` / `flash.json` (§4.3), `ledger.json`, the GLYPH frames |

## 2. The lock

`tools/lock.py --seg act4 --plan pixel/act4/plan.json` on `show/reel/ep01-v3/ep01-v3-act4.json` gives **79 shots from 80 beats, 12,571 frames (8:43.79)**, 101 lines (7 of them Mas's inner voice), 7 silent posts, and 44 on-camera mouths. Every check passes: every line has a take, speech lies inside its take, mouth tracks carry, faced mouths have tracks, the D6 silence is 3.71 s, the shots tile the segment, and the mix is exactly the segment's length.

- **The plan** reads lock_v5.py's own tables (`plan_py`: verdicts, marks, faces, the v4 id map, the post ids, the size classes) and the v4 lock's marks for the reused v4 layouts (`base_lock`), exactly as the `act4-v5` port does. Its JSON `shots` merge over them only where v3 moved something:
  - **S4.02** (C13): `clack` on the landing_thunk, `tip` 5 f before it, `alyi` on a5-27-28; faces NELEH room, ALYI lip.
  - **S4.08** (C14): the second call's marks (`ring2`, `grab`, `handover`) moved past the shot's end, because their lines are cut.
  - **S4.13 / S4.13d** (C15): `read` and `names` on the new second sentence v3-a4-0001.
  - **S4.13e**: TASYA lip (the statement's tail runs 0.8 s into it).
  - **S5.09-back**: `glance` (his keys stop, he looks up) moved to after v3-vo-23 "gerg never waits to be asked." (+2 f), as the beat plan says: the planted line lands before his keys stop.
  - **S7.02**: TASYA room, MAS none (Tasya offers it; Mas says nothing).
  - **S7.02b**: below / above / around on v3-a4-0003.
  - **S7.07**: the spray between "once" and "We" on v3-a4-0004 (9 f).
  - **S7.07b**: the lock keeps v5's `nod` anchor, which now falls before the cut; the layout overrides it (`['f', 3]`).
- **Text kinds:** v5's table, with the v3 plates (names only: `ADELINA`, `TTEMME`, `THE OTHER YRRAL`).
- **The episode timecode:** Act Four's frame 0 is episode frame 17231 (11:57:23). That's the cold open 736 + the intro 720 + the card 48 + Acts One to Three 7740 + 4914 + 3073.
- **The temp mix:** the v3 stick reel's Act Four chapter, reel frames 17303–29874 of `studio/out/reel-work/ep01-v3-stick/mix.wav`, cut sample-exact to `scratchpad/v3-shots-act4/act4-mix.wav` (2000 samples a frame). There's no per-segment stick mix in `audio/reel/ep01-v3/` (only beds), so it's the same cut the other shot passes made. The plan names it by a repo-relative path because the renderer prefixes the repo.

## 3. The shots

`P` = v5's layout as it was (its v5 kind R/C/N is in `st`). `V` = a v3 change. **P\*** = v5's layout, with its marks re-anchored in `plan.json`.

| Shot | Framing | s | | What v3 changed |
|---|---|---|---|---|
| S1.01 | WIDE · establishing | 5.75 | V | **Race weekend on the Strip** (`art/race`, §5): lamp-post banners, pennants and flags on the grandstand, barrier wraps. All generic, with no lettering. The drift now spans the 5.7 s arrival (1 px / 11 f); the truck, the shiver and his still glass are v5's. V.O. v3-vo-17 |
| S1.02 | INSERT · hand, glass, laptop | 2.50 | V | **The four attendee circles** on the call app's board tiles (`art/invite`): a door, a glowing page, a spinner, a black square, drawn as the cold open's invite draws them. None is green |
| S1.03 | GFX · THE SHEET | 11.75 | P | |
| S1.04 | GFX · THE ZEROS | 9.50 | V | **`MACROSOFT · BILLIONS IN`**, and **`EQUITY: 0` alone** (`art/texts planZerosV3`) |
| S1.05 | GFX · the path, the break | 3.21 | P | |
| S1.06 | INSERT · trackpad, JOIN | 5.83 | V | **New hold (1.5 → 5.8 s): "his finger over JOIN while he thinks it through."** The laptop's arrow leaves JOIN on "gerg's", steps across the four icons (each tile lights as it passes), goes back to the door on "alyi", and comes down onto JOIN on "probably". His finger moves with it (1/8 of its travel). Then the click on its sound, and connecting…. The frame's foot goes to shadow under the V.O. V.O. v3-vo-18 |
| S1.07 | POV · the call grid | 5.50 | P | |
| S1.08 | ECU · his eyes | 1.25 | P | |
| S1.09 | POV · the call grid | 4.79 | V | **The arrow's tag reads `ALYI`** (v5's layout, copied with `cursorTagV3`). The GLYPH dissolve at the Cancel click is v5's; J1 is off |
| S1.10 | CU · Mas, still | 1.00 | P | |
| S1.11 | INSERT · his phone | 1.92 | P | |
| S1.12 | OTS · onto the laptop | 4.62 | V | **Aftermath (2.2 → 4.6 s):** the call stays frozen; the Strip's neon breathes one palette step on the red rim of his shoulder and in the window (held 12 f) |
| S2.01 | INSERT · the carve | 4.12 | P | V.O. "i don't keep score." (the kept take) |
| S2.02–S2.05 | the marks, TPOOL, the iris | | P | S2.03's shorter rail is the lock's |
| S3.00a | OTS · Neleh's laptop | 19.96 | P | +1 s arrival (the lock's; the waiting tile animates from frame 0) |
| S3.01–S3.06 | her desk, the blog, the grid | | P | RIMA's repeat plate is gone with its lock text |
| S3.07 | MCU · Alyi in the doorway | 10.83 | V | **Aftermath (+0.8 s):** after he steps back, the door leaf eases shut 3 px at a time, in 3 held steps |
| S3.05, S4.01 | | | P | |
| S4.02 | WIDE · the boardroom at night | 19.46 | V | **C13, rebuilt.** Three phones step as in v5. Phone A (its own room render: body and glow) walks on to the edge on the second buzz, teeters, tips and falls, and lands with a clack on the landing_thunk. It lies lit on the floor, and its caller ID goes. **Alyi's reflection says "That is the company telling us."** (lip-synced in the glass). The phones now buzz on 2s; v5's held drawing froze them in one offset |
| S4.07 | MCU · Neleh | 5.00 | P | |
| S4.08 | SPLIT · both calls | 21.83 | V | **C14:** the lighthouse with no rent meters (no RENT flags, no NOZAMA / ELGOOG, no meter tag), no NOZAMA caller ID, no second call. After "no." and the click: the throne falls, her pane dims, CALL ENDED. **The plate is `ADELINA`**; Mario's plate is gone |
| S4.09 | OTS · the lobby camera | 15.38 | P | |
| S4.10 | WIDE · the boardroom | 4.00 | V | **The plate is `TTEMME`** (a name-only plate) |
| S4.10b–S4.12 | | | P | |
| S4.13 | MCU · Tasya | 6.71 | P\* | C15: he reads the second sentence (v3-a4-0001); no plate |
| S4.13d | 2S · Neleh, Alyi's reflection | 7.42 | P\* | the names land on the new sentence |
| S4.13e | MCU · Tasya, the sign | 3.00 | V | **His mouth for the statement's last 0.8 s**, then his smile; the sign on its mark |
| S4.14, S4.15 | | | P | the board's side ends on Mada; the dark room is heard first (sound) |
| ~~S5.01~~ | ~~CARD~~ | | cut | **No WHAT THEY DIDN'T KNOW card** (C16) |
| S5.02 | INSERT · the home shot | 4.50 | V | **Arrival (2.6 → 4.5 s):** a slow drift, 1 px / 12 f |
| S5.03 | INSERT · his phone | 5.88 | P | V.O. v3-vo-20 (the count) over the hearts |
| S5.04, S5.05 | | | P | |
| S5.09 | OTS · the monitor | 15.83 | P | V.O. v3-vo-21; the ring and the click on their moved sounds |
| S5.06 | POV · the letter | 22.79 | V | **The signature row reads `ALYI`**, as the lock does (v5 lettered `ALYI (REPORTED)`) (`letterAlyiV3`) |
| S5.07b | MCU · Mas | 6.00 | P | the held face (3.5 → 6.0 s): v5's layout already flickers Gerg's typing light on him and blinks |
| S5.08 | INSERT · the check | 5.83 | P | |
| S5.09-back | OTS · the monitor | 9.46 | P\* | V.O. v3-vo-22, v3-vo-23; his keys stop after the planted line |
| S5.09b, S5.11 | | | P | |
| S5.12 | MCU · Mas, the door | 5.50 | V | **Aftermath (2.9 → 5.5 s):** his blinks through the hold after the rack |
| S6.01–S6.06 | the avalanche | | P | S6.06's +0.5 s on the label is the lock's |
| S7.01 | BOX | 19.79 | P | +1.5 s arrival (the lock's; the boxes open in their held steps) |
| S7.02 | WIDE · the packed bullpen | 5.96 | V | **Tasya says it now** (v3-a4-0002, room-scale mouth); Mas silent at his desk |
| S7.02b | MCU · Tasya | 8.58 | P\* | the record (v3-a4-0003); the slate steps on its words |
| S7.03, S7.05 | | | P | |
| S7.06 | WIDE · the boardroom, the freeze | 7.62 | V | **The look-around drawn** (it was v5's one flagged stand-in, v4's 2 px sway): the rigs' own flip. Terb turns to look behind him, then Mas, 8 f each, then back |
| S7.07 | 2S · the calm-off | 10.88 | P\* | Terb's re-read (v3-a4-0004); the spray between the sentences |
| S7.07b | MEDIUM · the Other Yrral | 1.58 | V | **The tent card reads `THE OTHER YRRAL`** (`yrralPlateV3`); he nods on the cut |
| S7.07-cont | 2S · the calm-off | 13.46 | V | v5's layout; the chair fire's smoke runs from S7.07's sprayEnd **on this lock** (v5's constant reads v5's frames) |
| S7.08 | MCU · Mas | 3.00 | V | **Aftermath (+0.9 s):** a blink |
| S7.09, S7.13, S8.01–S8.04 | | | P | S8.01's +0.7 s arrival is the lock's |
| S8.05 | INSERT · the glass on the stone | 3.25 | V | **Aftermath (+0.8 s):** the far warm lights (the bokeh, the tea-lights) flicker, each on its own |
| S8.06–S8.09b | | | P | the Q\* rail is gone with its lock text |
| S8.10 | WIDE · the observer chair | 5.21 | V | **The act's last image, +1 s:** a slow drift, 1 px / 10 f |

**Inherited, and checked against v3's rules:**
- **Side badges:** the host's option, off. The review margin's side box is off too.
- **The card:** cut from the lock.
- **The gag cards:** NELEH at S1.07, TERB at S7.06. Kept, as the show's style (script-v3-notes §4).
- **The in-world UI and signs** are kept: the caller IDs, `MADA · LAST FIRER STANDING`, `VOID IF CEO MISSING`, `MACROSOFT · OBSERVER (NON-VOTING)`, `STAFF LETTER · TO THE BOARD`, THE PLAN's own lettering.
- **Plates:** every one is drawn from the lock's text, so the cut ones are gone.

## 4. Checks (measured)

1. **`node r.cjs check`:** exit 0. 79 shots, 79 layouts, **0 stand-ins**, 0 layout problems, no marks that fail to resolve. 28 GLYPH frames (S1.09's dissolve), rendered by the Remotion host and spliced in. One note: v3-vo-17 shares the screen with the rail `NOV 17, 2023 · ~NOON PT · LAS VEGAS` for 1.4 s (§7).
2. **The text states match the drawings under them.** S1.04's two boxes are re-drawn from the same sheet through the same ink. Compared with v5's own frame (`t-texts.ts`):
   - **The caption's box** is **0 pixels different before the caption types on**. After that, the only pixels that differ are the caption's 248 pixels, all in its one ink.
   - **The label's box** differs only in the old glyphs' ink (287 px) and the new glyphs' (181 px).
3. **Photosensitivity** (`scratchpad/v3-shots-act4/flash.ts` → `flash.json`, a measurement, not a certification). It uses WCAG 2.x's general-flash and red-flash thresholds on all 12,571 show frames. The rules:
   - **A transition** is a same-direction change in relative luminance of 0.10 or more (with the darker state under 0.80), over 25% or more of a 160 × 90 window. The window is 1/9 of the frame, about a 10° field; there are 45 of them, sliding.
   - **A flash** is a pair of opposing transitions.
   - **Red:** a change into or out of saturated red over the same area.

   **The result: at most 2 flashes in any 1 s** (in one window, at S5.08, the cut from Mas's dark MCU into the bright check insert and on), **and 0 red flashes, so it passes the brief's ≤ 3.** The risky moments measure 1 each: S1.02's glow flood into the blueprint, S2.03's TPOOL flash, S7.06's door flash and freeze, and S8.01's sign ignition. Nearly every transition counted is a cut.
4. **`tsc --noEmit -p .`** (through heavy.sh, on the final code): 11 errors, **all in the known `src/dev/realism/bake`**. There are none in `pixel/act4/` or anything it imports.
5. **Mas's inner voice never moves his mouth** (the lead's note from the Act One pass). On this lock all 7 V.O. lines have `face: null`, and no V.O. line carries into another shot. So no layout draws a mouth for one: the lip-sync draws a mouth only for a faced line.
   - **The guard:** `shots.ts` now wraps every layout so its shot's V.O. lines are always face-less (`noVoMouth`), whatever a face table says.
   - **It was added after the render.** It changes no pixel: 94 V.O. frames of S1.01, S1.06, S2.01, S5.03, S5.09 and S5.09-back, plus 3 others, give the same md5 before and after.
   - **In the decoded MP4's V.O. frames**, his face is either off camera (the inserts), from behind (S5.09's OTS), or at room scale with no mouth drawn (S1.01).

## 5. The new art (additive, opt-in)

| Item (script-v3-notes §7) | Module | How it stays additive |
|---|---|---|
| **Race weekend on the Strip** (S1.01) | `art/race.ts` `drawSuiteRace` / `suiteRaceDressing` | It paints onto the finished frame only where the frame still shows the suite's emissive view layer (`suiteLayers`), inside the glass and off the mullions. So it sits behind Mas, his desk, the Orb and the laptop at the view's depth, with the glass's sheen re-applied. It's generic shapes and colours with no lettering: red/pale-chevron and chequer banners, pennants, flags, barrier wraps |
| **The JOIN screen's four attendees, none green** (S1.02, S1.06) | `art/invite.ts` | The cold open's `attendee` circles are copied unchanged (private in `kits/phone-invite.ts`). S1.02 re-composites join-corner's `drawNudgeJoin` with them. S1.06 is `drawClickInsert` re-drawn with the icons and three knobs: the arrow's position, the hand's offset, the hovered tile |
| **`MACROSOFT · BILLIONS IN`, `EQUITY: 0` alone** (S1.04) | `art/texts.ts` `planZerosV3` | Two text boxes are re-drawn from plan4's own sheet (bpSheet at its 2x crop, inkBlueprint), measured exact (§4.2) |
| **The arrow's tag `ALYI`** (S1.09) | `art/texts.ts` `cursorTagV3` | v5's private cursorTagBig without its role line |
| **The phone falling** (S4.02) | `shots.ts` (`phoneA`, `fallPhone`) | Phone A is its own boardroom render (seats `['A']` against the bare room), composited over the room with seats C, D, R. The fall is 7 held drawings |
| **The split without the meter text or NOZAMA** (S4.08) | `shots.ts` | `drawLighthouse({meters: 0})`, the lighthouse's own option |
| **`THE OTHER YRRAL`** (S7.07b) | `art/texts.ts` `yrralPlateV3` | The old card's box is restored from the same boardroom plate (drawBoardPlate + Table at the same f), only where drawBoardPlateFront doesn't cover it. The new card is drawn in calmoff-terms' style |
| Name-only plates (S4.08, S4.10) | `art/texts.ts` `plateName` | v5's private plateN with no lines |
| The letter's `ALYI` (S5.06) | `art/texts.ts` `letterAlyiV3` | The row is re-lettered on the scrolled page, clipped to the page's window under its fixed header |

**Reused:** everything else is v5's art as it was (the rooms, the cast, the kits, the art-v5 extras).

**Not used:** the art passes' new modules (art-a / art-b). Act Four needed none of them; both passes left the Act Four items to this pass (art-b.md §5).

## 6. What I looked at (stills and crops, not motion)

- The baseline and final contact sheets.
- Montages of native frames for:
  - S1.01 (and a 2x crop of the Strip)
  - S1.02, S1.04
  - S1.06 at 7 frames along the arrow's path
  - S1.09, S1.12 (and a crop of the rim)
  - S3.07 (a crop of the leaf's steps)
  - S4.02 (a 5x crop of every frame of the fall, and the reflection's mouth over its line)
  - S4.08 (before and after the click), S4.10, S4.13e (a crop of the mouth)
  - S5.02, S5.03, S5.06 at the ALYI stop, S5.09, S5.09-back, S5.12
  - S7.02 (plus a numeric check that Tasya's face pixels flap on his syllables: 6 px change on open frames, 0 on rest)
  - S7.06 (a crop of the turns), S7.07b
  - S8.05 (a crop of the lights), S8.10
- Two review frames (S1.06, S4.02).
- **Frames decoded from the rendered MP4** (the bundled ffmpeg, by time): S1.01, S1.06, S2.01, S4.02, S5.03, S5.09, S5.09-back and S7.07b.

## 7. Render

From `studio/`, with `S` = the scratch folder. The heavy steps run as one job through `ops/heavy.sh` (`scratchpad/v3-shots-act4/heavy-run.sh`):

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act4 --plan studio/src/episodes/ep01/pixel/act4/plan.json   # from the repo root
node src/episodes/ep01/pixel/tools/build.mjs act4 $S/r.cjs && node $S/r.cjs check
node $S/r.cjs bundle $S/bundle                                    # heavy: the Remotion bundle (S1.09's GLYPH frames)
BUNDLE=$S/bundle node $S/r.cjs glyphs $S/glyph-act4 2             # heavy
GLYPH_DIR=$S/glyph-act4 SEGDIR=$S X264_THREADS=1 node $S/r.cjs picture --jobs 2 --mix $S/act4-mix.wav --mix-offset 0
node $S/r.cjs contact ../out/ep01/full-v3/picture/act4-sheet.png
```

**The result:** `out/ep01/full-v3/picture/act4.mp4`.
- **The file:** H.264 1920 × 1080, 12,571 frames, **523.79 s (8:43.79)**, 41.4 MB, with AAC temp audio (the v3 stick mix's Act Four chapter) of the same length. `act4.srt` sits beside it.
- **The render:** 145 s of wall on 2 workers (18.7 ms a frame per worker).
- **GLYPH frames:** S1.09's 28 were drawn by the Remotion host and spliced in. The host's check: its plain frames are identical to Node's, and its GLYPH frames are identical outside the room area. 0 stand-in marks, 0 missing, 0 failed layouts, **0 stand-ins**.
- **The contact sheet:** `out/ep01/full-v3/picture/act4-sheet.png` (from the final code).
- **The render predates the V.O. guard (§4.5), which changes no pixel.** Re-render with the commands above to have the file and the code from the same build.

## 8. What's weakest, and open issues

1. **S4.02's fall is small.** At room scale the phone is 7 × 3 px, and the fall takes 5 frames. It will read as a lit sliver dropping, and the clack has to carry it. A cut-in wasn't taken, because the beat plan holds the wide.
2. **S1.06's inner-voice beat is the act's longest insert on hands.** Its life is the arrow's check of the four icons, which says what the V.O. says. Whether that's "narrating what the picture shows" (mas-inner-voice §8) is a call for someone watching. The arrow moves anyway; the alternative is a finger hover alone.
3. **S3.07's door leaf covers the right jamb as it eases in.** In a still it can read as the jamb vanishing. It's small.
4. **S4.02's reflection mouth is low contrast.** The reflection is drawn two steps into the glass (v5's k 2), so his line is lip-synced but faint.
5. **The lock's timing, left as it is:**
   - v3-vo-17 overlaps S1.01's date rail for 1.4 s (§5.2 wants one must-read at a time).
   - "the Other Yrral" is said just before the S7.07b cutaway, which lands on "and Mada."
   - The lock's owner could move the cut 0.5 s earlier.
6. **The temp mix lives in scratch.** The lock's `mix.path` points at `scratchpad/v3-shots-act4/act4-mix.wav`. Re-cut it from the reel's mix (§2) if scratch is cleared.
7. **The chapter titles in the review margin** still read v5's (e.g. "THE BOARD'S SIDE · BLIND") from the v4 base lock. That's the review frame only, never the picture.
