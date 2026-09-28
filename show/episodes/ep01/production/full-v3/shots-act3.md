# Ep1 full v3 · shots: Act Three, "verified: human" (sc 18–23)

| | |
|---|---|
| **What this is** | The record of Act Three's pixel layouts on the stick lock: every shot, what it's built from, what's new, the checks, how to re-render it, and what's weakest. **Now on the v3.1 lock: [§8](#8-v31-the-v31-lock-script-draft-7) is current**; §1–§7 are the v3 pass, kept for the record. |
| **Who, when** | The `v3-shots-act2-act3` pass (track P2 of [PLAN.md](PLAN.md)), 2026-09-27. Nothing was committed: the lead commits. |
| **The files** | Layouts: `studio/src/episodes/ep01/pixel/act3/shots.ts`. It uses the helpers in `act2/kit2.ts`. The lock: `act3/data.ts` and [lock/act3.json](lock/act3.json). |
| **The picture** | **v3.1:** `out/ep01/full-v3/picture/act3.mp4` (1920 × 1080, 24 fps, H.264 + AAC, **2:25.13, 3,483 frames**, 11.9 MB; rendered in 31 s on 2 workers), muxed with the v3.1 stick mix as temp audio (`out/ep01/full-v3/picture/act3-v31-stick-mix.wav`). (The v3 render it replaced ran 2:08.04, 3,073 frames.) Beside it: `act3.srt`, `act3.mp4.render.json` and the contact sheet `act3-sheet.png`. The 5 GLYPH frames are the Remotion host's, spliced in. |
| **Measured** | 25 of 25 shots have a layout; 0 stand-ins; `check` passes; `tsc` prints nothing; the flash check passes (§4); the GLYPH check passes (the plain frames around them are identical Node against Remotion, and nothing outside the room area differs). |
| **Needs a person** | Nothing has been watched in motion or heard. I looked at the contact sheet and at about 45 sampled native frames (the arrival, every V.O. frame, every POV, the scan and its GLYPH frame, the call), and at one GLYPH frame from the Remotion host. |

---

## 1. The lock

The stick mix is sliced from the v3 stick reel's episode mix, where Act Three starts at reel frame 14230, 3,073 frames. The recipe is in [shots-act2.md §1](shots-act2.md#1-the-lock), with `9316 → 14230` and `4914 → 3073`.

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act3 --timeline show/reel/ep01-v3/ep01-v3-act3.json \
    --takes audio/ep01/act3/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act3/lines-v3.json \
    --mix out/ep01/full-v3/picture/act3-stick-mix.wav --mix-offset 0
```

- **Result:** 25 shots from 28 beats (18.04–18.05 and 21.02–21.03 merge; 20.04 and 20.06 share the setup `20.CALL`), 3,073 frames.
- **Lines:** 22, every one with a take.
- **Checks:** every one is `ok`.
- **The lock's one note, kept:** the rail `NOV 16, 2023 · 11:59 PM` is up 24 f, under its read floor. That's the stick's timing: the clock rolls.

## 2. The shots

The whole act plays in the home room: Act Four's dark plate, with art-b's Act Three compositions and monitor painters ([art/art-b.md §1.6](art/art-b.md)).

**Continuity** (art-b's decision §2.1, followed):
- The Orb settles into the faded outline on the wall at "you can stay." and watches from there through sc 21.
- By DevDay (sc 22, a week on) it has drifted to his shoulder, Act Four's spot, and the outline is empty again.

| Shot | Time · length | Layout |
|---|---|---|
| 18.01 | 0:00 · 6 s 2S | **Arrival.** An 8-frame fade up from the act break onto the home room: the desk, the blinking rack, the cyan key, the glass, the two old marks, the empty outline on the wall. It's held for 2.5 s; then on the whir the COINWORLD box slides out of the drive slot in four held steps and lands on the thunk, and Mas turns to it. |
| 18.02 | 0:06 · 3.2 s ECU | `drawLabelECU`: the label, legible; his fingertips come to the lid in two held steps; the rack's three LEDs keep blinking beyond it. |
| 18.03 | 0:09.2 · 4.9 s 2S | The lid lifts on the flutter; the Orb rises in three held steps on the three servo whirs, its lens finds him and dilates on the fourth; THE ORB card top right (live, no freeze: the stick has none). |
| 18.04 (+18.04g, 18.05) | 0:14.1 · 3.5 s MCU | `drawScanMCU`: the cone fans out in three held widths, **aimed down onto his face** (dir 176°, not the art demo's 184°, which passed over his hair). Then **5 GLYPH frames**: inside the cone only, his face is tokens (the cone's Mask, returned as the layer). By frame 6 the cone is gone. Then the toast `verified: human` on the chip click, and "thanks." (lip-synced). |
| 18.06 | 0:17.6 · 7.7 s 2S | The Orb drifts from the box to the outline in whole-pixel held steps (2 f) and settles into it (the outline now filled); the V.O. (mouth shut); "you can stay." (lip-synced); its aperture opens once on the chime; the hold. |
| 19.01 | 0:25.3 · 2 s 2S | Later (the box gone): the Orb's iris flicks from him to the monitor, where the lighthouse is small. |
| 19.11 | 0:27.3 · 2.5 s POV | `drawMonitorPOV` + `lighthousePainter`: MISANTHROPIC's lighthouse, Mario on phone one. |
| 19.12 | 0:29.8 · 2.5 s OTS | `drawOrbOTS`: from behind the Orb, Mas watching. |
| 19.13 | 0:32.3 · 2.5 s POV | The second phone rings, and Mario answers it after 1 s; the rent meter lights (NOZAMA · UP TO $4B) and spins; the cut on its tick. |
| 20.01 | 0:34.8 · 3.4 s OTS | `drawMonitorOTS` + `tidderPainter`: the reply types on with the keys, in source casing. |
| 20.02 | 0:38.3 · 1.6 s 2S | The LEDs stop, all of them (`ledsOff` and the plate's `still`: the Orb's bob and the city's lights stop too). The act's one quiet beat. |
| 20.03 | 0:39.8 · 2.6 s POV | Posted: the counter spins, a blur, climbing; the first reply legible. |
| 20.04 | 0:42.4 · 10.25 s 2S | The phone lights GERG on the desk; his hand goes to it on the key tap; his eyes stay on the counter climbing on the monitor; "i'm editing it." (lip-synced); then the Orb looks at him for about 2.7 s, longer than it needs to. |
| 20.05 | 0:52.7 · 3.1 s POV | The edit, framed tight, rewrites letter by letter on the keyboard roll; held to read. |
| 20.06 | 0:55.8 · 20 s 2S | Back on the two-shot, the LEDs blinking again, the counter climbing faster; Mas's head down to the phone for "go to sleep, gerg." as the Orb looks at the phone; for the V.O. (mouth shut) his eyes rest in the middle distance and the Orb looks at him; the hold. |
| 21.02 (+21.03) | 1:15.8 · 17.8 s POV | `eoPainter`: NEDIB, pen raised, lip-synced; a cut-paper copy pops up behind the desk on the first pop (3 held steps), the second at the window on the second, each lip-synced as it speaks; Neleh's paper egg in the corner. At 21.03 he turns to them, and the stat row updates on the chip. |
| 21.04 | 1:33.6 · 5.5 s 2S·SCR | **A slow whole-pixel drift in** (1 px each 12 f, to 10 px): Mas glances at the Orb for "which one's real?"; the iris flicks across the three on the three servos and settles; he answers back to the monitor. Both lines lip-synced. |
| 21.05 | 1:39.0 · 2.3 s POV | He signs (the signature's strokes on 3s); the copies clap on the claps. |
| 22.01 | 1:41.3 · 8.1 s POV | `devdayPainter`: the odometer clunks up through the floor in three held steps (the ratchet, the thunk) to `100,000,000 / WEEK`; Tasya walks on laughing, arms open, and stops at the stage's right, clear of the figure; Mas's room-scale mouth on his question; Tasya's laugh drawing on his take's syllables. |
| 22.02 | 1:49.4 · 5.3 s HIGH | `drawPhoneHigh`: the prompt lights on the chip; his thumb comes in and hovers (the one hover); the Orb's iris, at the frame's edge, steps to each word the V.O. weighs; the tap on super. |
| 22.03 | 1:54.8 · 3.3 s 2S | The Orb now at his shoulder (the outline empty); "super." (lip-synced, his head down to the phone); the iris lingers on the phone and its aperture narrows a step; no toast. |
| 23.01 | 1:58.0 · 2.5 s POV | `coldOpenPainter`: bar 1, the cold open's frame. |
| 23.02 | 2:00.5 · 2.5 s HIGH | The reminder on the chip; the Orb's iris steps along the four circles, one a beat, and stops on the black square. |
| 23.03 | 2:03.0 · 2.5 s 2S | The band rolls past midnight to NOV 17; Mas looks down (at the rail) and back up; the reminder goes dark. |
| 23.04 | 2:05.5 · 2.5 s | Black. |

## 3. Art

- **Reused as it is:**
  - art-b's `rooms/darkroom-act3` (`drawDarkA3`, `drawLabelECU`, `drawScanMCU`, `drawOrbOTS`, `ORB_HOME`, `boxOrbAt`);
  - `kits/mas-monitor` (`drawMonitorPOV`, `drawMonitorOTS`);
  - `kits/tidder`, `kits/eo-signing`, `kits/monitor-items` (the lighthouse, DevDay, the cold open);
  - `kits/phone-high` (`drawPhoneHigh`, `phoneMini`, `ORB_CIRCLE_LOOKS`);
  - Act Four's dark plate (`DPLATE_LOOK`).
- **New art:** none. The Orb's looks from its home on the wall (`HOME` in `shots.ts`) are hand-set, because `DPLATE_LOOK` is aimed from the shoulder spot.
- **Stand-ins:** none.
- **The gag card:** THE ORB, text only, top right over the rack (`kit2.drawGagCard`, as in Act Two).
- **GLYPH:** 18.04g returns `glyphLayer(fb, {tint C6, …}, cone mask, k)` for frames 357–361. The Remotion host draws the tokens.

## 4. Checks

| Check | Result |
|---|---|
| `node r-act3.cjs check` | 25 layouts, **0 stand-ins**, 0 problems. 5 GLYPH frames. The track is 3,073 frames, as the segment. |
| `glyphs` (Remotion against Node) | The plain frames either side are identical (0 pixels), and nothing outside the room area differs on the GLYPH frames (`glyph-act3/check.json`). |
| **Photosensitivity** (every native frame; the method is in [shots-act2.md §4](shots-act2.md#4-checks)) | **Worst: 1 transition in any 1 s; red: 0.** Passes. |
| **Dead frames** (the longest identical run per shot) | Every hold moves: 20.06 6 f, 20.04 6 f, 21.02 8 f, 18.06 8 f, 22.01 19 f. The long runs left are deliberate: 20.02 (34 f: the LEDs stop, and the stillness is the beat), the edit held to read (20.05, 40 f) and the black card. |
| **V.O. frames** (18.06, 20.06, 22.02) | Mas's mouth is shut: `kit2.spoken()`, as in Act Two. The V.O. types over the desk's dark underside or the desk wood. Nothing must-read is in rows 182–203; the phone's reply strip in 22.02 sits above them. |

## 5. Render

From `studio/`, with `S` your scratch folder. Act Three has GLYPH frames, so the Remotion host draws those first. The Remotion bundle includes every segment's `shots.ts`, so build and `check` yours before bundling.

```sh
node src/episodes/ep01/pixel/tools/build.mjs act3 $S/r-act3.cjs
node $S/r-act3.cjs check
node $S/r-act3.cjs contact ../out/ep01/full-v3/picture/act3-sheet.png native
bash ../ops/heavy.sh node $S/r-act3.cjs bundle $S/bundle
BUNDLE=$S/bundle bash ../ops/heavy.sh node $S/r-act3.cjs glyphs $S/glyph-act3 2
GLYPH_DIR=$S/glyph-act3 SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act3.cjs picture --jobs 2
```

## 6. What I changed after looking

- The scan cone passed over his hair; it now lands on his face, and it's narrower.
- Tasya's walk-on covered `/ WEEK`; he now stops short of it.
- Mas's lips moved on his V.O.; now `spoken()`.
- The label insert's rack LEDs blink; DevDay's Tasya laughs on his take.

## 7. What's weakest (to my eye, from stills)

1. **The Orb's looks from its home spot.** Everything it watches is far to its left, so the iris steps are mostly vertical and 2–3 px at 1×. "Flicks across the three NEDIBs" (21.04) reads as the iris moving, not as it picking one.
2. **The dark-room two-shot is small.** Mas's medium rig has a head of about 36 px at the far left, and the Orb is 25 px across. The act's intimate moments ("you can stay.", the call, "super.") are all at this one size, with only the MCU scan and the OTS closer.
3. **"He sips" (19.12) isn't drawn.** The portrait has no glass or hand, and a new drawing for a 2.5 s shot didn't seem worth the risk of looking bad; he just watches.
4. **The GLYPH beat** (the cone, then five frames of tokens, then the cone gone) is judged from stills and one Remotion PNG. Whether five frames reads as "his face is tokens" or as a glitch needs a person.
5. **22.03's Orb move** from the wall to his shoulder happens off screen (between DevDay and the keynote prompt). It fits Act Four's staging, but a viewer may notice the outline is empty again.

---

## 8. v3.1: the v3.1 lock (script draft 7)

### 8.1 The lock

```sh
# the temp track: Act Three's chapter of the v3.1 stick reel (600.375 s -> 745.5 s), 3,483 frames (the method in shots-act2.md §8.1)
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act3 --timeline show/reel/ep01-v31/ep01-v31-act3.json \
    --takes audio/ep01/act3/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act3/lines-v3.json \
    --takes audio/ep01/v31/act3/lines-v31.json --mix out/ep01/full-v3/picture/act3-v31-stick-mix.wav --mix-offset 0
```

- **Result:** 28 shots from 31 beats, 3,483 frames (2:25.13). 27 lines, every one with a take. Every check is `ok`.
- **The lock's notes, kept:** v31-vo-06 shares the screen with the rail `OCT 2023` (the timeline's timing).
- **A leftover sound:** the timeline keeps the second `tower_pop` at 21.02 + 10.49 s, but the picture has one copy now. That's for the sound pass.

### 8.2 What changed, shot by shot

| Shot | v3.1 |
|---|---|
| **v31-18.00** (new) | **The act's arrival**, an 8-frame fade up: the home room two-shot (Act Four's dark plate, the outline empty) with the monitor lit, the landlord's slate lobby small on it (`lobbyPainter`'s mini). |
| **v31-18.00b** (new) | POV, `lobbyPainter`: `MACROSOFT WELCOMES ATEM` · `JUL 18`. TASYA hangs the thirteenth key, Atem blue, in held steps. KRAM (new cast, mute) steps in. "Everyone is welcome." is **lip-synced**: the take's visemes are laid over the painter's own portrait, only the pixels that differ. "thirteen." (V.O.) comes once the key is hung. **The POV sits 10 px high**, so the must-read chyron clears the V.O. rows. |
| 18.01 | 3.4 s, the arrival gone: the whir pre-laps the cut, and the box is already sliding at frame 0; the lobby still on the monitor. |
| 18.02 | The new V.O. ("my other company. it tells people from machines.") runs over the label. The box's near edge falls into shadow at the frame's foot (the cream only; his fingertips stay lit), so the V.O. types on dark. |
| 18.04 (18.05) | **The face light:** `drawScanMCU {faceLight: 1}` on the toast phase (`faceLightImg`, keyed from the Orb's side). |
| 19.01 | 1.8 s: the iris flicks to the monitor, where Sirrah's lectern is small. |
| 19.11–19.13 | cut (the lighthouse item) |
| **v31-19.02** (new) | POV, `sirrahPainter`: JUL 12. Sirrah talks with a silent mouth; the chyron types on and holds. |
| **v31-19.03** (new) | **The hands runner, one held frame:** art-b's `drawDark2SSCR`, the monitor large at frame right. The steps: |
| | • the letters carry on; Mas's two fingers go up, and the Orb whirrs on the first servo; |
| | • JUL 21, the PINKY PROMISE unrolls in held steps; his pinky goes up, and the Orb rotates on the third servo; |
| | • SEP 13, the forum; his hand is already up before every hand goes up on "raised", NOLE's the highest, and the Orb rises one pixel; |
| | • "i've had mine up since may." (V.O.), the Orb looks at him, and he lowers his hand. |
| 20.02 | The Orb is at his shoulder now (§8.3). |
| 20.04, 20.06 | **The big-monitor two-shot**, so the call is on screen: the TIDDER thread with its counter climbing, and **GERG's video tile** in its corner (`withGergTile`, lip-synced, typing, ringed when he talks). The Orb's long look at Mas after "i'm editing it.". His head drops for "go to sleep, gerg.". The V.O. hold (mouth shut). Gerg's first line is now "Okay. That's patched.". |
| 20.05 | The edit POV keeps Gerg's tile in the corner (the call is on). |
| **v31-20.07** (new) | POV, `paperPainter`: the title page, then p. 29 ("research preview"), then p. 30 (the two logos, the held sentence), the scrollbar's thumb shrinking; "neleh's on our board. she quoted us." (V.O.). |
| **v31-20.08** (new) | The big-monitor two-shot, the paper on it: the Orb turns from the page to him. |
| 21.02 (+21.03) | **One copy**, lip-synced; no bezel egg; the stat `SEEN 1` on the chip. |
| 21.04 | **The big-monitor two-shot** (the two NEDIBs readable: `eoPainter`'s short layout), with a slow whole-pixel drift toward the monitor. The iris goes from the copy to the real one on the servos; **the toast `verified: human` pops over the real NEDIB** after the third servo. "the one with the pen." is cut. |
| 21.05 | One copy, `SEEN 1`, no egg. |
| 22.01 | **Opens for 1 s on the two-shot** (the keynote on the big monitor), then the POV. The Sydney bubble rides behind Tasya on stage. The marks follow the sounds, which moved +1 s. |
| 22.03 | **The face light:** `drawDarkA3 {faceLight: 1}` (art-a's `faceKey`). The Sydney bubble is on the small monitor too. |
| 23.02 | The hover names: ALYI, NELEH, MADA, THE QUIET VOTE, each as the iris reaches its circle. |

### 8.3 Continuity: where the Orb is

- **Why it moves:** art-b's big-monitor two-shot seats the Orb at his far shoulder.
- **The layouts' rule:**
  - it settles into the outline at "you can stay." (18.06) and watches from there as the iris flicks to the monitor (19.01);
  - from the hands runner (19.03) on, it sits at his shoulder, watching with him, and the outline is empty;
  - that holds in every plate shot too (20.02, 22.03, 23.03), which matches Act Four.
- **Geography:** the big-monitor frames are the room from the monitor's other side, with Mas still in the left third.

### 8.4 Face lights, `cleanUnder`, and the v3 fixes

- **Face lights:** on 18.05 (the mood analysis's list) and 22.03 (the draft 7 notes). Both are art-b's opt-ins.
- **`cleanUnder`:** it exists only on art-a's `drawLaunchMcuMas` (Act One). The only dither on a face in Act Three is the scan cone's, by design, so there was nothing to set.
- **The v3 fixes, kept:**
  - Mas's mouth stays shut on every V.O. (`kit2.spoken`).
  - The scan cone is aimed onto his face.
  - The GLYPH beat is five frames.

### 8.5 Checks (v3.1)

| Check | Result |
|---|---|
| `node r-act3.cjs check` | 28 layouts, 0 stand-ins, 0 problems; 5 GLYPH frames (551–555); the track is 3,483 frames |
| `glyphs` (Remotion against Node) | the plain frames either side identical; nothing outside the room area differs |
| `tsc` | prints nothing |
| **Flash check** | **Worst: 2 transitions (1 flash) in any second; red: 0. Passes.** |
| Longest still runs | 21.02's end, 36 f (the turned NEDIB held after the chip); 20.02, 34 f (the LEDs stop, deliberate); the black card |
| Looked at | the contact sheet and about 40 sampled frames: every new beat, the V.O. frames (18.00b, 18.02, 19.03, 20.06, 20.07), the runner's four stages, the call's tile, the toast in 21.04, both sides of 22.01's cut, 22.03, 23.02's names |

**Render** (from `studio/`):

```sh
node src/episodes/ep01/pixel/tools/build.mjs act3 $S/r-act3.cjs
node $S/r-act3.cjs check
bash ../ops/heavy.sh node $S/r-act3.cjs bundle $S/bundle
BUNDLE=$S/bundle bash ../ops/heavy.sh node $S/r-act3.cjs glyphs $S/glyph-act3 2
GLYPH_DIR=$S/glyph-act3 SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act3.cjs picture --jobs 2
```

### 8.6 Weakest in v3.1 (to my eye, from stills)

1. **Two geographies in one scene.** The plate (monitor left) and the big-monitor two-shot (monitor right) alternate in sc 19–22: 20.02 is the plate, 20.04 the big monitor, and so on. Each cut is across a POV, but a viewer may feel the room flip.
2. **The runner's forum at two-shot scale:** the raised hands are small ticks. The joke is the tiling, and the stick's own caption says legibility at this scale is a call.
3. **Tasya's lip-sync on the lobby clip** is a pixel patch over the painter's portrait. It depends on the painter keeping its placement (12 % of the screen, y 10).
4. **21.02's last 1.5 s** holds on the turned NEDIB with only the chip changing.
