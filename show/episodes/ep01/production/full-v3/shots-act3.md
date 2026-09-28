# Ep1 full v3 · shots: Act Three, "verified: human" (sc 18–23)

| | |
|---|---|
| **What this is** | The record of Act Three's pixel layouts on the stick lock: every shot, what it's built from, what's new, the checks, how to re-render it, and what's weakest. **Now on the v3.4 lock: [§11](#11-v34-the-v34-lock-script-draft-83-showrunner-notes-000) is current**; §10 is the v3.3 round, §9 the v3.2 round, §8 the v3.1 round and §1–§7 the v3 pass, kept for the record. |
| **Who, when** | The `v3-shots-act2-act3` pass (track P2 of [PLAN.md](PLAN.md)), 2026-09-27; the v3.2 and v3.3 rounds 2026-09-28. Nothing was committed: the lead commits. |
| **The files** | Layouts: `studio/src/episodes/ep01/pixel/act3/shots.ts`. It uses the helpers in `act2/kit2.ts`. The lock: `act3/data.ts` and [lock/act3.json](lock/act3.json). |
| **The picture** | **v3.3:** `out/ep01/full-v3/picture/act3.mp4` (1920 × 1080, 24 fps, H.264 + AAC, **2:13.42, 3,202 frames**, 10.7 MB), muxed with the v3.3 temp track (`act3-v33-stick-mix.wav`); see §10.4. It replaced v3.2's (2:22.42, 3,418 frames). Before that, the v3.1 render was `out/ep01/full-v3/picture/act3.mp4` (1920 × 1080, 24 fps, H.264 + AAC, **2:25.13, 3,483 frames**, 11.9 MB; rendered in 31 s on 2 workers), muxed with the v3.1 stick mix as temp audio (`out/ep01/full-v3/picture/act3-v31-stick-mix.wav`). (The v3 render it replaced ran 2:08.04, 3,073 frames.) Beside it: `act3.srt`, `act3.mp4.render.json` and the contact sheet `act3-sheet.png`. The 5 GLYPH frames are the Remotion host's, spliced in. |
| **Measured** | v3.3: 27 of 27 shots have a layout, 0 stand-ins, `check`, `tsc` and the GLYPH check clean, it builds on the v3.3 EL lock, and `flashcheck.py` passes (§10.4). v3.2: 29 of 29 shots have a layout, 0 stand-ins, `check`, `tsc` and the GLYPH check clean, the flash check passes (§9.4). v3: 25 of 25 shots have a layout; 0 stand-ins; `check` passes; `tsc` prints nothing; the flash check passes (§4); the GLYPH check passes (the plain frames around them are identical Node against Remotion, and nothing outside the room area differs). |
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

## 9. v3.2: the v3.2 lock (script draft 8.1)

**The brief** (the lead, 2026-09-28; SHOWRUNNER-NOTES 00 and 0, "Mas needs agency"; the calibration ledger, `show/bible/calibration.md`):
- re-lock on `show/reel/ep01-v32/ep01-v32-act3.json`;
- update the shots with art-b's v3.2 art ([art/art-b.md §7](art/art-b.md));
- his moves must read on screen: in Act Three, **the switch, DevDay live and pausing sign-ups**;
- first-appearance plates carry one relation word;
- keep the v3.1 fixes;
- re-render;
- the flash check.

### 9.1 The lock

```sh
# the temp track: Act Three's chapter of the v3.2 stick reel (out/ep01/reel/ep01-v32-stick.mp4, from reel frame 14,027),
# decoded with the bundled ffmpeg, trimmed to 3,418 frames x 2,000 samples, 48 kHz 24-bit
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act3 --timeline show/reel/ep01-v32/ep01-v32-act3.json \
    --takes audio/ep01/act3/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act3/lines-v3.json \
    --takes audio/ep01/v31/act3/lines-v31.json --takes audio/ep01/v32/act3/lines-v32.json \
    --mix out/ep01/full-v3/picture/act3-v32-stick-mix.wav --mix-offset 0
```

- **Result:** 29 shots from 32 beats, 3,418 frames (2:22.42). 23 lines, every one with a take. Every check is `ok`.
- **The V.O.:** two lines remain, "i made it for everyone else." (18.06, restored) and "thrilled is too much. enthusiastic is a lot." (22.02). Mas's mouth is shut on both.

### 9.2 What changed, shot by shot

| Shot | v3.2 |
|---|---|
| v31-18.00 | The room (the arrival, wide) plays for 1.8 s. Then it cuts in to `drawTallyECU`: the two faint old marks on the desk, framed legibly (8.1), for 1.4 s, drifting along the marks by whole pixels. |
| v31-18.00b | "thirteen." (V.O.) is cut, so the POV is drawn at its own height, and v3.1's 10 px lift is gone. `keyLarge`: the thirteenth key hangs large, Atem blue, on "welcome". KRAM's first-appearance plate reads `KRAM · RUNS ATEM`. It sits top right of the screen, clear of his OPEN SOURCE hoodie and the chyron. |
| 18.02 | The V.O. is cut, so the dark strip at the frame's foot is gone. The label plays in full. |
| v31-19.03 | The V.O. is cut, and its job is now an action. His hand is up before the room's. After Nole's "referee", he lowers it himself, 3 f after the line, and turns straight to his keys, head down, 8 f later. The Orb looks at him. |
| 20.02 | cut |
| 20.06 | The V.O. is cut. The hold is Gerg's keys running on, with Mas's eyes on the monitor. |
| v31-20.07 | Her plate reads `NELEH · NOPEAI BOARD`, on the title page for 1.7 s. The pages are re-timed for the quote: the title 1.1 s, p. 29 0.75 s, and p. 30 3.2 s. The quote gets another 0.6 s in v31-20.08 before the tab closes, 3.9 s in all. |
| v31-20.08 | `withTabs`: he closes the paper's tab (its x lit at 0.6 s), and the next tab opens: the order, live. |
| **v32-21.06** (new) | **His move: the switch.** `drawDark2SSCR {hand: 'switch', off}`. The copy is still clapping on the big monitor. He reaches over, from 9 f, and on the click (k 21) the glass goes black in one step. The Orb looks from the black glass to him. |
| 22.01 | **His move: DevDay, live.** The home two-shot and the bezel egg are gone. The shot runs [W] → [MCU] → [W]:<br>- **[W]**, `drawDevDayFull`, the stage full frame: the applause carries over, and the crowd along the foot claps in held steps. The odometer rises through the floor in three held steps on the ratchet (k 43, 51 and 59), and its drums kick on the thunk (k 104). Mas says "and today," with a room-scale mouth.<br>- **[MCU]**, `drawDevDayMCU`, from "you" (k 64) to the line's end: "…you can build your own chatgtp.", lip-synced.<br>- **[W]** again: Tasya walks on and stops clear of the figure. "so, how's the partnership going?" and "We love you guys." play with room-scale mouths. |
| 22.02 | caption only (that night, home) |
| **v32-22.04** (new) | **His move: pausing the sign-ups** (the record). `drawMonitorOTS` + `signupPainter` + `drawRackSlice`:<br>- the drums blur on the fast ratchet;<br>- the rack's LEDs step green → amber (k 23) → red (k 47);<br>- he types his post (k 27–66), and it goes up as a card on the post click (k 72);<br>- SIGN UP greys (k 87) and reads NOTIFY ME on the blink (k 93). |
| 23.02 | `avatars`: each hover card carries the member's small call tile, and Mada's face sits under his spinner. |
| unchanged (retimed by the lock only) | 18.01, 18.03, 18.04, 18.06, 19.01, v31-19.02, 20.01, 20.03–20.05, 21.02, 21.04, 21.05, 22.03, 23.01, 23.03, 23.04 |

### 9.3 Kept from v3.1

- **Mouths:** Mas's mouth never moves on a V.O. (`kit2.spoken`).
- **The Orb:** it stays at home in the outline through 19.01 and sits at his shoulder from 19.03 on.
- **Face lights:** on 18.04's toast and on 22.03.
- **The GLYPH:** it stays inside the scan cone only, for 5 frames.
- **`cleanUnder`:** not applicable here (it exists only on Act One's MCU).

### 9.4 Checks (v3.2)

| Check | Result |
|---|---|
| `node r-act3.cjs check` | 29 layouts for 29 shots, 0 stand-ins, 0 notes, 0 problems; the track is 3,418 frames |
| `tsc` | prints nothing |
| **GLYPH check** (`glyphspan`, `bundle`, `glyphs`) | frames 491–495 (18.04g). The plain frames around them are identical Node against Remotion, and nothing outside the room area differs. |
| **Flash check** | **Worst: 2 transitions (1 flash) in any second; red: 0. Passes.** |
| Longest still runs | 23.04 60 f (the black act-out), 21.02 36 f (the desk held between the order's lines, as in v3.1), v31-20.07 30 f (p. 30 held to read). The first audit found two holds that didn't change: v31-18.00's tally ECU, still for 33 f, and 22.01's opening wide, still for 43 f until the ratchet. The ECU now drifts along the marks by whole pixels (1 px every 8 f). In the wide, the hall claps in held steps while the applause runs: alternate groups of heads rise a pixel on alternate 4-frame beats. Both were re-rendered. |
| Looked at | about 35 sampled native frames: the arrival and the tally, the key and Kram's plate (at 2×), 18.02, the hand lowering and the turn to the keys, 20.06, the three paper pages and the plate, the tab closing and the order opening, the reach and the black glass, DevDay (the wide, the MCU, Tasya on), the sign-up OTS at four steps, and 23.02's two hover cards; plus the contact sheet |

**The picture:** `out/ep01/full-v3/picture/act3.mp4`: 1920 × 1080, 24 fps, H.264 + AAC, **2:22.42, 3,418 frames**, 11.7 MB, rendered in 26 s on 2 workers. The 5 GLYPH frames are spliced in from the Remotion host. It's muxed with the v3.2 stick mix (`act3-v32-stick-mix.wav`). Beside it: `act3.srt`, `act3.mp4.render.json` and `act3-sheet.png`.

**Render** (from `studio/`): `node $S/r-act3.cjs bundle $S/bundle32`, then `BUNDLE=$S/bundle32 node $S/r-act3.cjs glyphs $S/glyph32-act3 2`, then `GLYPH_DIR=$S/glyph32-act3 SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act3.cjs picture --jobs 2`.

### 9.5 Weakest in v3.2 (to my eye, from stills)

1. **v32-21.06's reach.** The desk hides his hand, so it may read as a lean. That's art-b's own note. The black glass is the payoff.
2. **22.01's wide.**
   - Mas is about 40 px tall on a big stage, and the odometer's figure is small at 1×. The MCU carries his line.
   - The stick's landing thunk (k 104) falls inside the MCU, so the drums' kick on it is off screen. The rise itself lands on the ratchet.
3. **v31-20.07's quote** holds 3.9 s against its 4.8 s read floor, because the title (with the plate) and p. 29 had to fit first. **For the lead:** hold p. 30 from the start, or trim p. 29.
4. **v32-22.04's OTS:** the back of his head is the monitor kit's dithered dark shape, as in 20.01.
5. **From v3.1, still open:**
   - 21.02 still has the stick's second `tower_pop` (k 251) with one copy on screen;
   - 22.03's small monitor still shows DevDay that night.

## 10. v3.3: the v3.3 lock (script draft 8.2, a polish)

**The brief** (the coordinator, 2026-09-28; [PLAN.md](PLAN.md) §6, binding; [script-v33-notes.md](script-v33-notes.md); [lock-v33.md](lock-v33.md)):
- re-lock on `show/reel/ep01-v33/ep01-v33-act3.json`;
- the changes:
  - **P5:** v31-18.00b merged into the arrival;
  - **S1 / P9:** the VP clip and the pinky promise cut, the forum kept; 20.01's Tidder thread title before his reply;
  - **P10:** his face held on page 30, the paper's tab kept in his strip, and 23.02's reminder over his own NOTIFY ME page;
  - **P11:** NOTIFY ME stays and the post collapses;
  - **P14:** plates of at most two parts;
- **mood §3.6:** Act Three cuts busy (15.2 a minute), so prefer changes inside a shot to new cuts;
- render through `ops/heavy.sh`, run `flashcheck.py`, build from the EL lock too, and delete scratch.

### 10.1 The lock

The temp track was made as in Act Two (shots-act2.md §10.1): Act Three's chapter from reel frame 13,987, 3,202 frames, into `out/ep01/full-v3/picture/act3-v33-stick-mix.wav`.

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act3 --timeline show/reel/ep01-v33/ep01-v33-act3.json \
    --takes audio/ep01/act3/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act3/lines-v3.json \
    --takes audio/ep01/v31/act3/lines-v31.json --takes audio/ep01/v32/act3/lines-v32.json \
    --mix out/ep01/full-v3/picture/act3-v33-stick-mix.wav --mix-offset 0
```

- **Result:** 27 shots from 30 beats, 3,202 frames (2:13.42). 23 lines, two of them V.O. ("i made it for everyone else.", "thrilled is too much…"), every one with a take. Every check is `ok`.

### 10.2 What changed, shot by shot

| Shot | v3.3 |
|---|---|
| v31-18.00 | **P5** (v31-18.00b merged in; 3.8 s): `drawDark2SSCR {orb: null}`, the home room with the monitor large at frame right. The Orb hasn't come yet, and its outline on the wall is empty.<br>- **The monitor:** the lobby plays softly on it, from `lobbyPainter {keyLarge}` with no JUL 18 chip.<br>- **Tasya:** his lips move on "Everyone is welcome." The thirteenth key goes on in held steps and hangs large, Atem blue, on "welcome".<br>- **Kram:** he steps in, in the dry OPEN SOURCE hoodie. The monitor's own chyron reads MACROSOFT WELCOMES ATEM.<br>- **The plate:** `KRAM · RUNS ATEM`, two parts, under the bezel below him.<br>For the two-shot's short screen (216 × 120), art-b's lobby painter gets a higher framing (`LOBBY_TOP`: Tasya 24 px up, Kram 48 px up, his forehead cropped by the screen's top), so the ring, the key and OPEN SOURCE all clear the chyron. |
| 18.01 | the lobby still on the plate's small monitor (the large key, no chip) as the Coinworld box slides out |
| 19.01 | The forum is small on the monitor, now that the VP clip is cut. |
| v31-19.02 | cut (the VP clip) |
| v31-19.03 | **S1:** the forum only; the pinky promise and his two fingers are gone.<br>- On servo 1 the Orb whirrs at the monitor.<br>- His hand goes up at the desk, before anyone's, and on servo 2 the Orb turns to it.<br>- On servo 3 (Remuhcs asking) the Orb rises a pixel.<br>- Every hand goes up on "raised".<br>- After "referee" he lowers his own hand, 3 f after the line, and turns to his keys, head down, 8 f later. |
| 20.01 | **S1 / P9:** `tidderPainter {title, replyBox}`.<br>- The thread reads from 0.2 s: `t/singularity`, "is it already here? anyone actually know?" (the notes' invented crowd text), with other people's comments greeked.<br>- The reply box opens on the lock's `TIDDER · reply` (1.2 s), and he types his reply on the keys. |
| v31-20.08 | **P10, V3 (no voice):** an MCU (`drawScanMCU`, no fan, no toast). His face reads page 30 in the page's light, two face-light steps from the monitor's side.<br>- It holds 2.0 s with nothing on his face changing (the room's LEDs tick).<br>- In the last 9 f the light drops a step as he switches tabs. |
| 21.02, 21.04, 21.05, v32-21.06 | **P10:** his tab strip (`withTabs`) keeps `DECODING INTENTIONS` open beside `LIVE · THE ORDER` until the monitor goes off. 21.04's toast moves under the strip. |
| v32-22.04 | **P11** (4.5 s):<br>- The post goes up on the click. It collapses in two held steps to the post UI's own compact card at the page's head, 60 % of the way to the blink.<br>- SIGN UP greys, and NOTIFY ME stays.<br>- The counter's drums stop when the button greys.<br>- The paper's tab stays in the strip. |
| 23.02 | **P10:** an SCR of his monitor (`drawMonitorPOV`): his own NOTIFY ME page with the collapsed post and the paper's tab in the strip.<br>- **The reminder** (`withReminder`) pops up in two held steps: `Board sync · Fri 12:00` and the four attendee circles. It sits at the page's lower right, clear of NOTIFY ME.<br>- **The Orb** at his shoulder, in at the frame's right edge, steps its iris along the circles, one every 11 f. Each circle's card shows the member's call tile and name: ALYI, NELEH, MADA (his face under the spinner), THE QUIET VOTE. It stops on the black square. |
| 23.03 | The reminder is on the plate's small monitor, over his page, and goes dark on its own. The phone on the desk is dark. |
| unchanged (retimed by the lock only) | 18.02, 18.03, 18.04, 18.06, 20.03–20.06, v31-20.07, 22.01–22.03, 23.01, 23.04 |

**The new art** is small, opt-in and drawn in the existing modules, in art-b's conventions:
- `kits/tidder.ts`: `title`, `replyBox`, `TIDDER_FORUM`, `TIDDER_THREAD`;
- `kits/monitor-v32.ts`: `signupPainter {collapse}`, `withReminder`;
- `kits/monitor-v31.ts`: `LOBBY_TOP` and Kram's framing on a screen under 150 px tall (the only such use is v31-18.00).

### 10.3 Plates (P14)

Act Three has no three-part plate: `KRAM · RUNS ATEM` and `NELEH · NOPEAI BOARD`. The Orb's gag card is unchanged. Two of the lock's texts have three parts, but both are UI on the monitor, not plates:
- `SEP 13 · REMUHCS · ASKED THE ROOM: …` is the news chip plus its two-part plate;
- `TIDDER · t/singularity · "…"` is the site, the forum and the title.

### 10.4 Checks (v3.3)

| Check | Result |
|---|---|
| `node r-act3.cjs check` | 27 layouts for 27 shots, 0 stand-ins, 0 notes, 0 problems; 3,202 frames |
| `tsc` | prints nothing |
| **The EL lock** | Tested as for Act Two, on `ep01-v33-el-act3.json`: 27 layouts for 27 shots, 3,114 frames, 0 stand-ins, 0 problems. |
| **GLYPH check** | Frames 386–390 (18.04g). The plain frames either side are identical Node against Remotion, and nothing outside the room area differs. |
| **Flash check** (`coldopen/tools/flashcheck.py`) | **Worst: 0 flashes in any second; red 0. Passes.** The largest mean-luminance step is 0.483 at frame 173, the cut from the dark room to the label ECU. This pass's own audit finds at most 2 transitions, 1 flash, in one region. |
| Longest still runs | 23.04 60 f (the black), 21.02 36 f, v31-20.07 30 f (p. 30 held to read), 20.01 28 f (the thread's title held to read) |
| Looked at | about 40 native stills and the contact sheet:<br>- the arrival at the key's three steps (at 2×);<br>- 19.03's hand up, the room's hands, the lowering and the keys;<br>- the thread, then the reply;<br>- the MCU before and after the switch;<br>- the tab strip in 21.02, 21.04 and 21.05;<br>- 22.04's typing, post, collapse, greying and NOTIFY ME;<br>- 23.02's pop and each card;<br>- 23.03 before and after the reminder goes. |

**The picture:** `out/ep01/full-v3/picture/act3.mp4`: 1920 × 1080, 24 fps, H.264 + AAC, **2:13.42, 3,202 frames**, 10.7 MB, rendered in 24 s on 2 workers. The 5 GLYPH frames are spliced in from the Remotion host. It's muxed with the v3.3 temp track (`act3-v33-stick-mix.wav`). Beside it: `act3.srt`, `act3.mp4.render.json` and `act3-sheet.png`.

### 10.5 What I judged differently, and what's weakest

1. **The tally cut-in (v3.2, draft 8.1's "framed legibly") is dropped from the merged arrival.**
   - **Why:** the 3.8 s shot now has to carry the lobby, the key, Kram's plate and Tasya's line, and mood §3.6 asks for changes inside shots over new cuts.
   - **What remains:** the two faint marks stay on the desk in every room shot. The plan's "left alone" list keeps them as they are.
   - **To restore it:** it's one branch in v31-18.00, since `drawTallyECU` stays in monitor-v32.
2. **v31-18.00 is the big-monitor two-shot, not the plate from behind the rack.** The lock's text says "from behind the rack" and "at frame right". The two-shot is the only room setup whose monitor is large enough for the plates to read. The cut to 18.01 is then a reverse onto the rack side, where the box comes out.
3. **23.02's Orb** is drawn in at the POV frame's right edge, so "the Orb's iris steps along them" is seen, not implied.
4. **Weakest:**
   - Kram's forehead is cropped by the screen's top in the arrival.
   - The MCU at page 30 shows his face and the room only; the page itself is the shot before.
   - The reminder card covers the right end of the drums.

### 10.6 v3.3.1: the micro-pass (audit-v33 §1 P11, §3 #1, §6 #2-3; frames unchanged)

- **v31-18.00:** `KRAM · RUNS ATEM` is dropped. The monitor's chyron `MACROSOFT WELCOMES ATEM` and his OPEN SOURCE hoodie carry the reference. Two text items now, plus "Everyone is welcome.".
- **v32-22.04 (P11):**
  - His post goes up on the click and holds while SIGN UP greys to NOTIFY ME.
  - 8 f after the blink, the post collapses away in two held steps (the card folded to its top half, then a 2 px strip, then gone).
  - The shot ends on the page alone: `CHATGTP Plus` and NOTIFY ME, with the paper's tab in the strip.
- **23.02 and 23.03:** the page is drawn without the post, so the reminder pops up over NOTIFY ME with DECODING INTENTIONS beside it.
- **Checks:**
  - **Kokoro:** `check` 27 / 27, 3,202 frames, and `tsc` is clean.
  - **EL:** it builds and checks on the assembly's `el-v33` lock, 27 layouts, 3,114 frames, 0 stand-ins, 0 notes, 0 problems.
  - **GLYPH:** 386–390; the plain frames are identical.
  - **Flash:** `flashcheck.py` finds 0 flashes in any second, red 0; it passes.
  - **The picture:** `out/ep01/full-v3/picture/act3.mp4`, 3,202 frames (2:13.42), 10.6 MB, 24 s on 2 workers, with its .srt and contact sheet re-written.

## 11. v3.4: the v3.4 lock (script draft 8.3; SHOWRUNNER-NOTES 000)

**The brief:** as Act Two's (shots-act2.md §11).

### 11.1 The lock

The temp track is sliced from reel frame 13,930 into `out/ep01/full-v3/picture/act3-v34-stick-mix.wav`. The takes add `audio/ep01/v34/act3/lines-v34.json`.

- **Result:** 26 shots from 28 beats, **3,007 frames (2:05.29)**. 21 lines, three of them V.O., every one with a take. Every check is `ok`.

### 11.2 What changed

| Shot | v3.4 |
|---|---|
| 18.02 | **The new V.O., "my other company. for when it gets harder to tell."** (v34-vo-05), plays over the label. The box's near edge falls into shadow at the frame's foot, as in v3.1, and his fingertips' ends go with it, so the typed line reads on dark. |
| 18.06 | "i made it for everyone else." is cut. The Orb's drift is now keyed to "you can stay.": it drifts across the line and settles into the outline as the line ends. |
| 21.02 | The order keeps its one line, with one NEDIB (lip-synced). The cut-paper copy, its pops, his turn to it and the stat row are un-drawn. The paper's tab stays in the strip. |
| 21.03, 21.04 | cut (the deepfake beats) |
| 21.05 | He signs, and the room on the monitor applauds. This is `eoPainter {applause}` (new, opt-in): a row of the press pool's heads along the screen's foot, hands up in two drawings on 4s. There is no copy. |
| v32-21.06 | the order's room still applauding on the big monitor when he switches it off |
| 22.01 | **The new V.O., "a year ago, forty users and a nice thread."** (v34-vo-06), plays under the applause.<br>- **The wide:** the applause, the crowd clapping and the odometer's three steps.<br>- **The MCU:** it starts as the figure settles and holds his look out at the hall under the V.O., with his lips still. After the line, the one-pixel smile. Then, in the same MCU, his stage line, lip-synced.<br>- **The wide again:** Tasya walks on.<br>This is one fewer cut than a separate push for his line would need. |
| unchanged (retimed by the lock only) | the rest |

### 11.3 Checks

| Check | Result |
|---|---|
| `check` | 26 layouts for 26 shots, 0 stand-ins, 0 problems; 3,007 frames. **The one note:** v34-vo-06 shares the screen with the rail `NOV 6, 2023 · DEVDAY`. That's the lock's timing (pov-and-framing §5.2), for the lead. |
| `tsc` | prints nothing |
| **The EL lock** | `ep01-v34-el-act3.json`, built as for Act Two: 26 layouts, **2,974 frames**, 0 stand-ins, 0 problems |
| **GLYPH** | frames 419–423; the plain frames are identical Node against Remotion |
| **Flash check** | **Worst: 0 flashes in any second; red 0. Passes.** |

**The picture:** `out/ep01/full-v3/picture/act3.mp4`, **3,007 frames (2:05.29)**, 9.7 MB, 25 s on 2 workers. The 5 GLYPH frames are spliced in. It's muxed with the v3.4 temp track, with its .srt and contact sheet.
