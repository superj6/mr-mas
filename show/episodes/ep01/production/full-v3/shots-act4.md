# Ep1 v3.3: Act Four's shots (`v3-shots-act4`, 2026-09-27 / 28)

> **Status: v3.3 built, checked and rendered. Nothing committed.** Track P2 of [PLAN.md](PLAN.md) for the `act4` segment ("five days, told twice", **8:25.75**), on the **v3.3 Kokoro lock** (`show/reel/ep01-v33/ep01-v33-act4.json`, committed a756708; [lock-v33.md](lock-v33.md)). **§V33 below is the current state.** It's a polish (PLAN §6), so §V32 and §V31 still describe everything V33 doesn't mention. §1–§8 are the v3 round's record. `pixel/act4/data.ts` is now the v3.3 lock.
>
> **Nothing here has been watched or heard.** Stills, crops and frames decoded from the render were looked at (§V33.5). The render's and the checks' numbers are measured.

## V33. The v3.3 polish (PLAN.md §6; script draft 8.2, [script-v33-notes.md](script-v33-notes.md))

### V33.1 The lock and the temp track

- **The lock:** `tools/lock.py --seg act4 --plan pixel/act4/plan.json` on the v3.3 timeline gives **79 shots from 80 beats, 12,138 f (8:25.75)**, episode frame 17117 (11:53:05). There are 98 lines (4 of them the inner voice, all face null, as before), 6 posts and 44 on-camera mouths. Every check passes. D6 is 5.08 s, unchanged. S7.13 is frames **10955–11218**, and the Runway splice is at k128–263 (11083–11218; `hourglass.py --s713 10955`).
- **The plan:**
  - It adds `audio/ep01/v33/act4/lines-v33.json` and `takes-v33-cut-mouths.json`. `cut_mouths.py` now runs both rounds (its v3.1 output is byte-identical) and gives Tasya's TV cut `v33-a4-0002` the mouth of its source, `v3-a4-0003` (words 10–17, shifted −3.345 s).
  - **Re-anchored:** S4.09 `post` (its text is gone), S4.10b `close` (it was on "Okay.", now the read +10 f), S7.02b's below / above / around (on the new take's words).
  - **Faces:** S7.02 is EMPLOYEE `room`; S7.02b is TASYA `lip` (on the TV).
- **The temp track:** there's no v3.3 mix pass and no stick reel yet. So the reel's own mixer (`studio/src/reel/tools/mixer.mjs`) ran on the lock's render plan (`studio/out/reel-work/ep01-v33-stick/plan.json`): 235 takes over the 7 beds, −16.63 LUFS, 8 s of wall time, through `ops/heavy.sh`. Its Act Four chapter was cut sample-exact to `out/ep01/full-v3/picture/act4-v33-stick-mix.wav`: 24,276,000 samples = 12,138 f. The full-episode WAV and v3.2's Act Four cut were then deleted.

### V33.2 The changed shots

| Item | Shot | What it draws now |
|---|---|---|
| **P12** | S4.02 (18.92 s) | **The push in, as the stepped push.** pov-and-framing §4.7.2 allows no smooth zooms and no scaled art, so the push is a ladder of drawn sizes. <ul><li>**The wide (k0–219).** v3.2's C13 (the phones buzzing and walking, the caller IDs), now with a whole-pixel drift toward Neleh from k40 (1 px every 22 f, 8 px).</li><li>**[M] on her second speech's first word (k220).** `rooms/twoshots drawBoard2S`: NELEH medium, lip-synced, Mada beyond, the phones lit on the table. It drifts on toward her (1 px every 6 f).</li><li>**Her [MCU] on "Monday" (k280).** S4.07's framing: the board plate soft behind her, its phones in frame, `nelehPortrait` lip-synced, the face light at 2 steps.</li><li>**The wide again (k352–378),** after her line, for phone A's teeter, fall and clack. C13 is kept, and the drift holds.</li><li>**The glass cutaway on Alyi's line (k379).** **The row of phones lights up in frame:** the four reflected screens start one rung dim and light one by one, from "That" to "company". Each takes a 2-frame pop, then sits two rungs up. His reflection turns on "company" (v3.2), and it carries a face light (P18).</li></ul>The held-frame scan finds no run of identical frames in the shot of 2 s or more |
| **P13** | v32-S5.00 (8.00 s) | **Dated once.** The lock drops the rail, and the host's rail band draws nothing here now. The camera's plate is the lock's `NOPEAI HQ · LOBBY · NOV 19 · 1:03 PM`, in the kit's own plate style. <ul><li>It is up from the cut into the camera to the end: 46 f, 1.9 s. In v3.2 the plate came only on the last grade step, as the shorter `… NOV 19`.</li><li>So that the plate can be read, the look up at the camera starts 4 f earlier (post +22) and the cut into the camera comes 10 f earlier (len −46).</li><li>The grade steps come every 8 f.</li></ul> |
| **S2 / P15** | S4.10 (4.29 s) | Rima's tile on the wall screen is 29 × 16 px, too small to letter. So her label is the call's **name bar hung under the screen**. It reads `RIMA TAMURI · INTERIM CEO`, and at the lock's 0.8 s (the spot leaving her) it flips, with one blank chip for 2 frames, to the lock's `RIMA TAMURI · CTO`. It is drawn in the room, so Ttemme's card freeze prints it in two tones, still legible. **Not drawn:** her jacket smooth (the tile is too small) |
| **S2 / P15** | S4.10b (15.21 s) | v5's two-shot copied. "Okay." is gone. **After the read (open +10 f), he turns the page over toward us** (`art/v33 drawBlankPage`): edge-on for 3 f, three-quarters for 3 f, then **the sheet facing us, blank**, from k326 to the cut (1.6 s), in his two hands. His brow goes unsure while he holds Neleh's eye. The next shot is his hand on the hourglass. **Timing:** the lock's `paper_whip` (11.77 s = k282) falls inside v5's folder slide (k276–296), so it plays as the slide. The turn is timed from the read, not from that sound |
| **P16** | S5.03 (5.88 s) | v3.2's 405 → 406 → 407 → 406 app bar now **ticks visibly**. On each change the old number rolls up out of the bar and the new one rolls up in (2 held frames), and the heart beats one rung brighter for 4 frames. Each change lands 6 f before the inner voice says the number (the 407 on "seven", the last 406 on the second "six") |
| **S3** | S7.03 (2.17 s) | "Down here." is cut. My v3.1 slate ripple answered that line, so the override is gone, and it's v5's MCU as it was (a port) |
| **S4 / P17** | S7.02 (5.96 s) | v5's walkout wide. **The EMPLOYEE** stands where Tasya stood, facing Mas, with a box in her arms. <ul><li>**Her figure** (`art/v33 drawEmployee`) is the room's own walkout extra, seed 73 in the green parka. A search over the extras picked it because its hair colour, its long hair and its skin are her S3.06 tile's.</li><li>**Visibly the one speaking:** her mouth opens on the take's syllables (v33-a4-0001, room scale), her face is lit one rung ("her mouth lit"), and the frame drifts toward her (1 px every 14 f, 10 px).</li><li>**Behind her, the bullpen's wall TV plays softly** (`drawWallTV`): Tasya at a podcast mic, listening, hung behind the crowd.</li></ul> |
| **S5 / P17** | S7.02b (5.71 s) | **The same wide, held on,** so the cut from S7.02 is continuous (same framing and drift offset, the employee still holding her box). Both beats are framed WIDE in the lock, and two different wides of this one room would be a jump cut. <ul><li>**The wall TV** plays his interview clip: **TASYA at a podcast mic**, lip-synced (his medium rig, cast/tasya-medium), with the mic on its boom arm in from the frame's left, clear of his face.</li><li>**The staff stand packed in front of it**, their heads over its lower edge, since the TV is drawn only where no crowd pixel is.</li><li>On "below" the floor steps to Macrosoft slate, on "above" the ceiling, on "around" the walls (v5's landlord steps). The TV doesn't step.</li><li>Tasya isn't on the floor.</li></ul>**The TV** is 100 × 56, hung on the conference glass over the room's own dark screen. That screen is 50 × 28, too small for a readable mic |
| **P18** | the close-ups | See §V33.3 |

**Kept as v3.2 built it:**
- the shock opening (the code for S1.01–S1.11 is untouched, and the hard cut still lands at frames 575/576);
- the Runway splice;
- the inner voice with no mouth (all 4 V.O. lines are face null, and the guard still wraps every layout);
- every other v3.2 layout.

### V33.3 P18, the face light: what was already there, and what's new

The list's close-ups already carry face lights from v3.1 (kits/face-light `faceKey`, the face only):
- "alyi voted." (S5.07b) and "good question." (S7.08): Mas at 1 step;
- Gerg's look (S5.09b): 2 steps;
- Neleh's real face (S3.04b, S4.07): 2 steps;
- Mada (S4.15): 2 steps.

**Measured on native frames:** the lit face pixels in each head's rect average **25–40% relative luminance**. The frames average 1–2%. The mood analysis's 4.5–5.4% are frame means, and a light on the face only can hardly move a frame mean while the room stays untouched, which is the rule.

**New this round:**
- **Alyi in the glass (S4.02):** his reflection is drawn in the glass's blue ramps, not in skin, so `faceKey` can't find it. `glassFaceKey` steps his face's lit rungs (N3 and up, and the cyan rim) up one inside the head's rect, and leaves the dark glass and the Valley's lights alone. The rect's lit pixels measure 7.5%, a reflection's level, deliberately.
- **Neleh's new MCU inside S4.02:** 2 steps.
- **"The toast" (S2.05):** the Orb's iris ECU with the `rewinding…` toast. No face is in frame, so there's nothing to light. If the mood analysis meant another act's toast (Act Three's "thanks."), that shot isn't mine.

### V33.4 Checks and render

1. **The lock:** every check passes. **`r.cjs check`:** exit 0, 79 shots, 79 layouts (46 `V`, 33 `P`), **0 stand-ins**, 0 problems, 164 browser frames (28 GLYPH + 136 hourglass).
2. **The EL lock** (the assembly builds the EL picture from it). I tested it in scratch:
   - `lock.py` on `show/reel/ep01-v33-el/ep01-v33-el-act4.json`, with `--plan pixel/act4/plan.json` and `--out-json` / `--out-ts` into scratch, gives 12,398 f, every check passing. The takes were v3.2's EL takes plus this round's Kokoro two, as stand-ins, because el-v33's takes don't exist yet.
   - `assembly/tools/build_el.mjs act4` against it builds, and its `check` exits 0.
   - Sample frames of every changed shot render on it: S4.02's ladder lands on the EL marks (the glass at k352), and so do S4.10b's page, S7.02 / S7.02b and S5.03.
   - The segment reads everything from marks on lines, words and sounds, and from shot lengths, so it follows either lock.
   - **For the assembly:** v33-a4-0002's EL take needs a mouth track for the TV, as its Kokoro cut does here.
3. **Photosensitivity:**
   - **flashcheck.py on the MP4**, in four overlapping chunks: one run over the whole act was killed at the heavy scope's 8 GB, so the chunks were area-scaled to the tool's own 160 × 90 and kept lossless. **At most 1 flash in any 1 s** (the selfie's white step, frames 4712 / 4716), **0 red. Pass.** This includes the Runway insert. The largest single-frame mean-luminance step is the hard cut, 0.573 at frame 576.
   - **`flash.ts` on the native frames:** at most 2 in any 1 s (S5.08, as before), 0 red. Pass.
4. **Held frames** (`flash.ts`'s new scan, the picture area, every native frame): **the longest run of identical frames in the act is 4.4 s** (S5.08). There are 7 runs of 2 s or more, none in S4.02, and nothing near 8 s.
5. **`tsc --noEmit -p .`:** 20 errors, none in `pixel/act4/` (bake.ts 11, runway pxframes 5, streamframes 4, as before).
6. **The render** was one job through `ops/heavy.sh` (`heavy-run33.sh`: build, check, flash, bundle, glyphs with hourglass off, `hourglass.py --png … --s713 10955`, picture, sheet, tsc; then `fc33.sh` for flashcheck). `picture --jobs 2` took **120 s wall**.
   - **`out/ep01/full-v3/picture/act4.mp4`** replaces v3.2's: H.264 1920 × 1080, **12,138 frames, 505.75 s (8:25.75)**, 43.8 MB, with the v3.3 stick mix as AAC temp audio (505.75 s).
   - Beside it: `act4.srt` and **`act4-sheet.png`** (79 shots, stand-ins: none).
   - Deleted from scratch afterwards: the bundle, the insert's PNGs, the hourglass intermediates and the flash chunks.

### V33.5 What I looked at, and what's weakest

**Looked at:**
- **Native stills:**
  - S4.02 through the ladder (wide, drift, [M], [MCU], the wide for the fall, the glass), with a 3× crop of the phones lighting and a 4× crop of the lit reflection;
  - S5.00's cut into the camera, its plate and the grade steps;
  - S4.10 before and after the flip, and in the freeze;
  - S4.10b's read, turn and blank page;
  - S5.03's count;
  - S7.02 and S7.02b, with 4× crops of the employee speaking and of the TV (a first mic's boom crossed his face and was re-drawn);
  - the P18 faces.
- **Decoded from the MP4:** frames 3860, 3930, 3995, 4020, 4830, 5130, 5560, 6380, 9430, 9600 and 11150 (the Runway insert in place).
- **The contact sheet.**

**Weakest:**
1. **The employee is a 78 px figure with a 2 px mouth.** She's the room's walkout extra, and two other extras in the crowd wear the same green parka (seeds at x 180 and 438). The mouth, the lit face and the drift point to her, but a newcomer may still hunt for the speaker. A distinct figure would need a new rig, or the shared crowd changed.
2. **S4.02's return to the wide** for the phone's fall (1.1 s between the MCU and the glass) is a quick cut out and back. I kept C13's gag rather than lose it off-screen.
3. **S7.02b is the same wide as S7.02** (continuous). The TV is the new subject, but the framing doesn't change.
4. **Rima's CTO flip** is readable for 5 f before the card's freeze and for 12 f after it. In between it reads in the two-tone print (the lock's clock: the label at 0.8 s, the card at 1.0 s).
5. **The blank page** is up 1.6 s, squeezed by v5's folder marks after "…why you fired him.".
6. **The temp track** is this pass's run of the stick mixer, not a mix pass's.

**To re-render** (from the repo root; `S` = the scratch folder):

```sh
python3 studio/src/episodes/ep01/pixel/act4/cut_mouths.py
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act4 --plan studio/src/episodes/ep01/pixel/act4/plan.json
bash ops/heavy.sh bash $S/mix33.sh        # the temp mix (the reel's mixer on the v3.3 render plan) + its Act Four cut
bash ops/heavy.sh bash $S/heavy-run33.sh  # build, check, flash, bundle, glyphs (hourglass=false), hourglass.py --png, picture, sheet, tsc
bash ops/heavy.sh bash $S/fc33.sh         # flashcheck.py on the MP4, in four chunks
```

### V33.6 v3.3b: two readability fixes (the newcomer's notes; after 08d73ba, not committed)

**Beat lengths are unchanged.** The frame count is still exactly **12,138**, and every shot's frames match 08d73ba's lock. The only lock change is S7.02's plan entry: a `push` mark on the employee's first word, and the face EMPLOYEE `lip`. Composer Y's refit lengths still hold.

**1. S7.02, "I can't find who's speaking."** The fix has two parts:
- **She's the one green coat.** `art/v33 recolourCrowd` re-coats the two other green-parka extras (rooms/bullpen WALKOUT_CROWD at x 180 and 438) in plum and charcoal. It paints only where each extra's own pixels show, so the bench and the boxes in front of them are untouched. It runs in the wide and in the [M]'s background.
- **The stepped push, one drawn size:** the wide (k0–32) cuts on her line's first word (k33, the new `push` mark) to her **[M]**. That is `art/v33 drawEmployeeM`:
  - **The figure:** a new bust on the civic kit (cast/civic-kit `bustHead` + the jacket torso: the shared skull, 3/4 camera-left, six mouths). Her tile's long dark hair (a centre part, falling past the far shoulder), her skin, the green parka with its hood and quilting, a cream top.
  - **Her face:** lip-synced (v33-a4-0001) and blinking.
  - **The box in her arms** across the frame's foot, her hands gripping its top edge.
  - **The framing:** she's at the right third, looking across the frame (camera-left) to Mas off screen, over the bullpen soft behind her (framing `mcuRoom`) with a whole-pixel drift.
  - The cut is the one added cut, motivated by the speaker.

**2. S7.02b, the podcast mic.** A **cut in from the wide to an insert of the wall TV** (`art/v33 drawTVInsert`): the screen (420 × 152) fills the frame.
- **In the clip:**
  - Tasya's warm portrait (cast/tasya-phone `tasyaRoomPortrait`) lip-synced (v33-a4-0002), on an interview set: acoustic-foam wall tiles, two warm practicals, the desk's edge;
  - a **broadcast mic with a foam windscreen on a boom arm**, angled up at his mouth from below-left, clear of it: the cap's mottled foam and its rim ring, the body, the yoke, the arm in two segments with its spring, the desk clamp;
  - a **`PODCAST` bug** in the screen's top-left corner (a red dot, the UI face).
- **Round the TV:** the bullpen's ceiling, walls and floor. They step to Macrosoft slate column by column (rooms/bullpen `toSlate`, 3 held steps) on "above", "around" and "below".
- **In the foreground:** a colleague's head and shoulders (bottom-left) and a packed box with a lamp arm (bottom-right), in silhouette, rimmed by the TV's light, to keep us in the bullpen.
- **The hold:** the 1.35 s after "…around them." stays on the screen.
- **Not kept:** the S7.02 wall TV (`drawWallTV`) still plays softly in the wide. The v3.3 S7.02b "same wide, held on" is gone.

**3. The EL take of the TV cut.** `cut_mouths.py` has a third job. The EL `v33-a4-0002` is cut from the EL `v3-a4-0003` (words 10–17), so its mouth is that take's (the assembly's el_takes.py track, `assembly/el-v32/act4-takes.json`), shifted −4.238 s. Every one of the 8 words lines up at that shift, and the result is 25 shapes.
- It goes to **`audio/ep01/v3-el/ep01-v33/act4/lines-A-cut-mouths.json`**, the whole EL row plus `mouth`. The EL `lines-A.json` is not touched.
- **For the assembly:** pass it after the EL takes (later files win).
- **Tested:** locked in scratch on `show/reel/ep01-v33-el/ep01-v33-el-act4.json` with `--plan pixel/act4/plan.json` (12,398 f), and `build_el.mjs act4` + `check` exit 0. v33-a4-0002 carries its 23-key track there, and Tasya's mouth moves on the TV at the EL frames.
- **Still needed:** the EL employee take (v33-a4-0001) gets its mouth from el_takes.py like every other EL take. It isn't a cut.
- The Kokoro outputs of `cut_mouths.py` are byte-identical to before.

**Checks and render** (one job through `ops/heavy.sh`: `heavy-run33.sh`, then `fc33.sh`):
- **The lock:** passes, 12,138 f. **`r.cjs check`:** exit 0, 79 layouts, 0 stand-ins, 0 problems.
- **Render:** `picture --jobs 2` took 134 s wall. **`act4.mp4`: 12,138 frames, 505.75 s**, 1080p, with the v3.3 stick mix. `act4.srt` and `act4-sheet.png` (0 stand-ins) are re-made.
- **flashcheck.py on the MP4, in four chunks:** **at most 1 flash in any 1 s** (the selfie, 4712 / 4716), **0 red. Pass.** The cut into her [M] is one darkening transition (frame 9428), not a flash.
- **Native `flash.ts`:** at most 2 (S5.08), 0 red. **Longest held run:** 4.4 s (S5.08).
- **tsc:** the same 20 errors, none in act4.

**Looked at** (native stills, 3–4× crops, decoded MP4 frames 9410–9670):
- the wide with one green coat;
- her [M] talking (the mouth open and shut) and her hands on the box (a first version's fingers read as ribbing, and a plant's leaves read as buttons on her chest, so both were redrawn or cut);
- the TV insert across the slate steps (a first mic, at 16 × 24, was a grey smudge against the foam wall; now 24 × 46 with its arm).

**Weakest:**
- The [M]'s background is the wide's pixels softened (the house MCU convention), so the room behind her is small-scale.
- Tasya's mouth on the TV is his portrait's, under the beard: it moves, but the mic and the bug carry the "podcast" read more than the lips do.

## V32. The v3.2 round (script draft 8.1; SHOWRUNNER-NOTES 00 and 0: "Mas needs agency", the rise-to-power spine, [calibration](../../../../bible/calibration.md))

### V32.1 What changed, and where

**The lock:** `tools/lock.py --seg act4 --plan pixel/act4/plan.json` on the v3.2 timeline gives **79 shots from 80 beats, 12,203 f (8:28.46)**, 100 lines (4 of them the inner voice, all face null), 6 posts and 43 on-camera mouths. Every check passes.
- **The plan:** the timeline and `audio/ep01/v32/act4/lines-v32.json` (v32-a4-0001, Neleh's new "Step three…", which has its own mouth track, so `cut_mouths.py` needs no change). New or re-anchored marks: S1.12 `pick` (len −22); S4.02 `turn` (on "company"); S5.11 `key` (door4 + 4, as in v3.1: v3.2 moved the first `key_tap_space` to −1.0 s, Gerg's last tap under Tasya's J-cut) and the badge's `slide` / `tick` / `set` (`folder_slide`, `pen_tick_1`, the second `key_tap_space`). Faces: S3.03 NELEH (she is on camera now, in the editor's call window); S3.04 without ALYI (his line there is cut).
- **Text kinds:** plates match the lock's `NAME · RELATION` (`RIMA TAMURI · INTERIM CEO`, `ADELINA · CO-FOUNDER`). S4.09's post is empty in the lock (`POST: MAS: “”`: the badge post moved to v32-S5.00, where the lock writes it as a label). That text is a label here. lock_v5's POST_IDS still expects `a5-27-P3`, and a plan can't drop a key, so `post_ids` points S4.09 at S4.01's id; the silent-post check then counts the six posts that remain.
- **The temp track:** there's no v3.2 mix pass yet, so it's **the v3.2 stick reel's Act Four chapter**. `out/ep01/reel/ep01-v32-stick.mp4` from 726.875 s for 508.458 s is cut to `out/ep01/full-v3/picture/act4-v32-stick-mix.wav` (24-bit, 48 kHz): **24,406,000 samples = exactly 12,203 f**. The Act One pass cut its mix the same way.
- **Episode timecode:** 17373 (12:03:21) = 640 + 720 + 48 + 7914 + 4633 + 3418.
- **D6** (the Remove click to the buzz) is 5.08 s, unchanged.

**The layouts:** 45 `V`, 34 `P`. **Stand-ins: 0.**

| Shot | s | What it draws now |
|---|---|---|
| S1.01 – S1.11 | | **the shock opening, exactly v3.1's.** The code is identical (a diff of the section), and so are this lock's frames, marks and lines for those eight shots. The hard cut measured on the decoded MP4: frame 575 has a luma of 22.4 / 255, and frame 576 (the dialog's first frame) 173.7 |
| S1.12 | 3.83 | v3.1's OTS without the fall to night (that moved to S1.13). After the 2.6 s hold, **he picks up his phone** (`art/v32 phonePickup`): his hand and the phone rise into frame in silhouette, in front of the lit call, in 4 held steps from len −22 (black, the Strip's red neon on its right edge, the screen's cyan light on its top edge), and it holds in his hand to the cut |
| **v32-S1.13** | 5.00 | **new** (kits/act4-v32 `drawSuitePhone`): **his post after the blow.** His thumb types from the first key tap (two held thumb drawings on 3s) up to "…will have more to say about what's next later." and the salute. On `post_click` (k86) the post goes up in its own UI, `1:46 PM`. Then the room falls to night in three held steps (len −22, −14, −6) while the screen stays lit |
| S3.02 | 1.63 | a port. v5's layout scales the pen run to the lock's shorter marks |
| S3.03 | 9.00 | v5's copied. **The post types itself** (`art/v32 blogTyped`, k6–110). The untyped glyphs, descenders included, are erased exactly: the rest of each line is lettered by the same call into a mask. The caret sits at the typing point. Then it holds to read. **Neleh's lips move, silent:** the editor's corner call window is redrawn in its speaker layout (`blogSpeakerWindow`: NELEH large, her own tile painter, small mouth shapes on 4s while she reads, then lip-synced on "Any objections?" with the speaking ring; the other three as the kit's minis). The kit draws all four as minis, where no mouth reads. Post on the tick, PUBLISHED |
| S3.04 | 10.83 | v5's copied. **Rima's tile label** is two rows, `RIMA TAMURI` over `INTERIM CEO` (`rimaTileLabel`), in place of v5's show plate: the notes call it "her tile's own label". The tile is too narrow for one line |
| S4.02 | 18.92 | v3.1's, and in the glass cutaway **his reflection turns to the phones on "company"** (kits/act4-v31 `drawAlyiGlass` `look: 'door'`). **Small:** the head moves a few pixels, and the eyes' change is lost in the glass's dark ramp (art-b §7.3 says the same) |
| S4.08 | 18.79 | v3.1's, with **the first-appearance plate carrying one relation word**: `ADELINA` / `CO-FOUNDER` (`art/texts plateRel`: v5's plate layout, the relation typed on under the name). No new style |
| **v32-S5.00** | 8.00 | **new: walking in as a guest.** kits/act4-v32 `drawReceptionMCU`, full colour at his shoulder: <ul><li>a hand slides the GUEST lanyard across the stone (4 held positions, k0–15);</li><li>**he puts it on himself** (the strap over his head, k16–31, round the `cloth_rustle`);</li><li>the selfie at arm's length, with **one white flash step** for 2 f on `camera_shutter`;</li><li>**his post** in its own UI on `post_click` (k100, `POSTS.masBadge`);</li><li>**his look up at the corner camera** from k126 (the near-front head, the same face);</li><li>on the look, a cut into that camera's own frame (`drawLobbyCCTVStep`: the lobby wide, him at the desk in the lanyard), stepping into its grade one step each 6 f, with the chrome and REC on the last.</li></ul>S4.09 opens on the same feed as their wall screen |
| S4.09 | 11.33 | v3.1's Sunday **without the post card on the CCTV tile** (the post is his now, in S5.00): the phones in a row and the ticker |
| S5.03 | 5.88 | v5's, with **the app's heart count** in an app bar over the phone's screen (`art/v32 heartCount`): **405** until his first heart, **406** on it, **407** and **back to 406**, each 6 f before his inner voice says it |
| S5.11 | 15.63 | v5's copied (the door, Tasya, "and the rent?", "Due on the first.") to k290. Then **the badge he doesn't wear:** <ul><li>a CUT to kits/act4-v32 `drawBadgeUnderDoor` [ECU] at floor level. The MACROSOFT badge slides out under the door from `folder_slide` (k297) and ticks against his chair leg on `pen_tick_1` (k319). His hand comes down and lifts it.</li><li>Back in the 2S (`drawBadgeReach2S`, with v5's door layered as v5 does), he leans down for it without getting up and sits up looking down.</li><li>On the second `key_tap_space` (k357) he sets it on the desk beside the GUEST lanyard, square.</li></ul> |
| S5.12 | 5.50 | v3.1's, with the MACROSOFT badge on the desk where S5.11 set it (continuity) |
| S7.06 · S7.07-cont | | **his terms**, as v3.1 built them: he pulls the pin, and on "gerg comes back too." Terb writes it in. Unchanged |
| S7.13 | 11.00 | the **Runway hourglass splice at k128–263**, now segment frames 11149–11284 (`hourglass.py --s713 11021`) |
| other shots | | ports, or v3.1's layouts on the lock's new lengths: S3.06 and S8.08 (the J-cuts; the pre-lapped speakers aren't faced in the shot before), S5.09b ("keep building." sooner), S4.15 |

**His moves, where each reads:**
1. **The post after the blow:** S1.12's pick-up, then S1.13, 5.0 s. The typing runs 2.75 s and the post is up for the last 1.4 s.
2. **Walking in as a guest:** S5.00, 6.5 s at his shoulder and 1.5 s in their camera, then their screen in S4.09.
3. **The badge he doesn't wear:** S5.11 k290–375, 3.5 s, and it stays on the desk in S5.12 (and in S7.01 and v31-S7.03b, as before).
4. **His terms:** S7.06 and S7.07-cont (v3.1's).

**Time away from him** (the board's side, v31-S3.00p to S4.15, less his lobby), measured on this lock: **3:19.7 in two parts**, 2:23.3 (frames 1215–4655) and 0:56.4 (4847–6200), with his lobby's 8.0 s between them.

### V32.2 New and changed files

- **`pixel/act4/shots.ts`:** v3.2's layouts (S1.12, v32-S1.13, S3.03, S3.04, S4.02, S4.08, v32-S5.00, S4.09, S5.03, S5.11, S5.12), the header and review labels.
- **`pixel/act4/plan.json`:** the v3.2 lock plan (§V32.1).
- **`pixel/act4/art/v32.ts` (new):** `phonePickup`, `blogTyped`, `blogSpeakerWindow`, `rimaTileLabel`, `heartCount`.
- **`pixel/act4/art/texts.ts`:** `plateRel` (the name and one relation word).
- **Everything else is imported:** kits/act4-v32 and kits/act4-v31 (the v3-art-b pass), and v5's and the shared modules. Nothing in them was edited.
- **Generated:** `pixel/act4/data.ts` and `full-v3/lock/act4.json`.
- **The temp mix:** `out/ep01/full-v3/picture/act4-v32-stick-mix.wav`.

### V32.3 Checks

1. **`node r.cjs check`:** exit 0. 79 shots, 79 layouts, **0 stand-ins**, 0 problems. The browser frames are the 28 GLYPH frames plus S7.13's 136.
2. **The lock's checks all pass** (§V32.1).
3. **Photosensitivity** (`flash.ts`, WCAG 2.x general and red flash, over all 12,203 native frames, 340 s): **at most 2 flashes in any 1 s** (one window at S5.08, as before), **0 red. Pass.**
   - The selfie's white step is one flash (frames 4712 and 4714).
   - The fall to night steps one way only, so it makes no pairs.
   - The measure covers the pipeline's own frames. For S7.13 k128–263 that means the v5 drawing, not the Runway insert, which measured 0 flashes in the Runway pass's check.
4. **The inner voice:** all 4 V.O. lines are face null on this lock, and the guard still wraps every layout.
5. **`tsc --noEmit -p .`:** 20 errors, **none in `pixel/act4/`** or anything it imports (bake.ts 11, runway pxframes 5, streamframes 4, as before).

### V32.4 Render

One job through `ops/heavy.sh` (`scratchpad/v3-shots-act4/heavy-run32.sh`): build, check, flash, bundle, `glyphs --opt hourglass=false`, `hourglass.py --png … --s713 11021`, `picture --jobs 2` (**124 s wall**, 16.8 ms a frame per worker), the sheet, tsc.
- **`out/ep01/full-v3/picture/act4.mp4`:** H.264 1920 × 1080, **12,203 frames, 508.458 s (8:28.46)**, 43.8 MB, with the v3.2 stick mix's Act Four as AAC temp audio (508.458 s). `act4.srt` sits beside it.
- **Browser frames spliced:** 164 (28 GLYPH + 136 hourglass). 0 missing, 0 stand-in marks, 0 failed layouts.
- **The sheet:** `out/ep01/full-v3/picture/act4-sheet.png` (79 shots, stand-ins: none).
- **Deleted from scratch afterwards:** the bundle, the insert's PNGs and the hourglass intermediates (6.1 GB free on the disk).

**To re-render** (from the repo root):

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act4 --plan studio/src/episodes/ep01/pixel/act4/plan.json
bash ops/heavy.sh bash $S/heavy-run32.sh      # build, check, flash, bundle, glyphs (hourglass=false), hourglass.py --png, picture, sheet, tsc
```

If a v3.2 mix pass lands, point `plan.json`'s `mix.path` at it (repo-relative), re-lock, and re-run.

### V32.5 What's weakest (v3.2)

1. **Alyi's turn (S4.02)** is a few pixels in a dark reflection. It may not read in motion.
2. **The pick-up (S1.12)** is a silhouette about 30 px wide over the frozen call, for the last 0.9 s. It reads as a phone in stills. The cut to S1.13's ECU does the rest.
3. **The badge reach (S5.11's 2S):** the desk hides his hands, so it reads as a lean (art-b §7.3). The floor ECU carries the pickup.
4. **The reception MCU's lobby** is the wide's pixels stepped down, not redrawn at MCU depth (art-b's note). The receptionist's hand is small at slide 0.
5. **S3.03's speaker window** is my layout of the kit's pieces (Neleh's tile at 82 × 70, the three minis beside her). It isn't a state the call kit draws.
6. **The temp track is the stick's mix**, not a mix pass's.

### V32.6 What I looked at (stills, crops and decoded frames, not motion)

- **Native stills:**
  - S1.12 k68–91 (the rise), with a 4× crop;
  - S1.13 at typing start, mid, full, posted, and the three night steps;
  - S3.03 at 4 typing points (a 2× crop to check for stray descenders: an earlier rect mask left the 'g' tails; the glyph mask fixed it), the held page, "Any objections?" with the ring, and the click;
  - S3.04 after the join;
  - S4.02 either side of the turn (a 4× crop);
  - S4.08's plate;
  - S5.00 at every phase (slide, lift, on, flash, post, look, the four grade steps) and S4.09's first frame;
  - S5.03 at 405 / 406 / 407 / 406;
  - S5.11's ECU through the tick and the hand, the reach, the sit-up and the two badges;
  - S5.12.
- **Decoded from the MP4:** frames 572–579 (the cut), 860, 974, 2500, 2860, 4030, 4595, 4690, 4712 (the flash), 4790, 4830, 8364, 8400, 9990 and 11201 (the Runway insert in place).
- **The contact sheet.**

## V31. The v3.1 round (script draft 7; the showrunner: "it should feel like a sudden shock to viewer he's fired, but the viewer just becomes aware through the plan, the video call is a bit hard to understand what cancel means")

### V31.1 What changed, and where

**The lock:** `tools/lock.py --seg act4 --plan pixel/act4/plan.json` on the v3.1 timeline gives **77 shots from 78 beats, 12,426 f (8:37.75)**, 105 lines (5 of them the inner voice), 7 posts and 44 on-camera mouths. Every check passes.
- **The plan** still reads lock_v5.py's tables and the v4 base lock. Its `shots` entries are updated for v3.1: S1.07's `freeze` on "company" +3; S1.09 now opening after the click; the Remove click (`v31-S1.08d`); S3.04's jacket on Rima's first line; S5.09b's `type` after "keep building." +12; S5.09-back's glance back to v5's anchor (after "case").
- **Text kinds:** the board side's `ALYI removed MAS MANALT from the meeting.` is a toast, and `TTEMME / INTERIM CEO, TAKE TWO · CHAT: LIVE` is a card.
- **The temp track** is the v3.1 mix pass's `out/ep01/full-v3/mix-v31/act4-mix.wav`: exactly 12,426 f, repo-relative. The v3.1 stick's reel-work mix is gone.
- **Episode timecode:** 17820 (12:22:12).
- **D6** (the Remove click to the buzz) is **5.08 s on this lock**, not v5's 3.7 s. The check's range was widened to what lock-v31 §5 sets, and the length is the lock's.
- **Three cut takes had no mouth tracks** (v31-a4-0001 from a5-27-01, v31-a4-0005 from a5-27-35, v31-a4-0007 from a5-29-05). `pixel/act4/cut_mouths.py` gives each the source take's track, moved onto the cut file's clock. The shift is measured from the first word (−0.533, −2.648, −0.120 s). It writes `takes-v31-cut-mouths.json`, the last takes file in the plan.

**The layouts:** 39 `V` (changed) and 38 `P` (v5's as it was). **Stand-ins: 0.**

| Shot | s | What it draws now |
|---|---|---|
| S1.01 | 6.21 | the suite and race weekend (v3's), no V.O. now: the arrival as ordinary life (the truck, the shiver, his still glass), the drift over the whole shot |
| **v31-S1.01b** | 3.21 | **new** (`art/v31 drawWindowTwoShot`). A two-shot at the suite's window: the suite's own view, race-dressed, one step soft. A generic race car (plain red, a blank number disc, no livery) on the near straight in whole-px steps, two passes. MAS's bust turned to the Orb. The Orb's iris follows the car, holds where it lost it, and snaps back to find it. He blinks. **Not drawn:** the sip |
| S1.02 | 7.00 | **S1.06 folded in.** The nudge ECU with the JOIN corner and the four attendee circles; his hand leaves; the laptop pings (JOIN's halo in held steps). On "gerg's" the arrow steps across the four icons, on "alyi" it goes back to the door, on "probably" beside JOIN; then onto JOIN, and the click on its sound. The V.O. rows on shadow |
| S1.07 | 7.58 | v5's grid **without the NELEH card or the Cancel dialog**: five tiles with their own name labels. **ALYI's first sentence on camera, lip-synced** (`art/v31 alyiTileLit`: the board side's lit doorway drawing with its viseme mouth; v5's his-side tile, his reflection, hid the mouth under the glass's bar). On "company." the four board tiles freeze, his mouth mid-word, and the Wi-Fi drops 3 → 2 → 1 bars. His own tile stays live |
| **v31-S1.08d** | 2.38 | **new** (kits/act4-v31 `drawRemoveDialog`): **the HARD CUT, bright.** The frame goes cream, the dialog opens in two held outline steps (`Remove MAS MANALT` / `from the meeting?` · `Remove`) and holds to read. ALYI's arrow steps on from his tag's time (4 held positions) and clicks on `dialog_ok_click`; the pressed button holds to the cut. The one silence starts on the click |
| S1.09 | 3.29 | v5's drop, now after the Remove we saw. His tile falls and comes apart (the GLYPH dissolve, 28 Remotion frames spliced), and the four close up, **still frozen as S1.07 froze them** (Alyi lit). Wi-Fi at one bar; the notice |
| S1.12 | 4.63 | v3 26.09 copied: the four frozen from S1.07's freeze (not live until "super.") and Alyi lit; the fallaway; the neon on his rim |
| S2.02 | 2.58 | **S2.04 folded in** (the TPOOL flash is cut): the eye-light on his thumb, then marks 1, 2 and 3 = his thumb, the last on `render_front_sweep` (v5's S2.02 then S2.04, one framing) |
| **v31-S3.00p** | 4.63 | **new** (kits/act4-v31 `drawNelehDeskHigh`). The rewind lands on **her desk from above at 11:52**: MADA joined early, three slots waiting; THE PLAN unfolded; her pen ticking on it while she says "Once more, before the others join.". Her card sits on the right (the laptop's early tile stays in view). Then the push into the paper: an 8 f bayer dissolve onto S1.03's first sheet frame, her pen by her plate |
| S1.03 | 11.75 | **THE PLAN on the board's side.** v5's copied, with **GERG / CHAIR** (`art/v31 planChairV3`: the plate re-drawn from the same sheet and ink) and **her figure stepping out of her own NELEH chair** on the stamp and walking to the sheet's edge before her first line |
| S1.04 | 9.50 | v3's (BILLIONS IN, EQUITY: 0 alone); Mada's line from his spinner icon, as v5 |
| S1.05 | 2.79 | the path with **no curl or tear**, then the pull back: a 4 f dissolve landing on the `paper_whip`, onto her desk from above at 11:59, her pen on step 1 |
| S3.00a–S3.06 | | ports (the lock's shorter arrival and grid). S3.01's notice reads `ALYI removed MAS MANALT from the meeting.` from the lock. **Not drawn:** "his reflection's hand moves, once" in Alyi's tile (no such state in call-boardside) |
| S3.04b · S3.07 · S4.07 · S4.15 · S5.05 · S5.07b · S5.09b · S7.08 | | **the face lights** (kits/face-light `faceKey`, skin in the head's rect only, the lit edge one more). **2 steps** on Neleh, Alyi, Mada and Gerg. **1 step on Mas:** at 2 his cyan-lit face went flat and pale in the crops, and at 1 it reads with its features |
| S4.02 | 18.88 | v3's wide (phone A falls: clack), then **the MCU·glass cutaway** on Alyi's line (kits/act4-v31 `drawAlyiGlass`, lip-synced) |
| S4.09 | 15.63 | **Sunday:** kits/act4-v31 `drawSundayOTS`, the phones in a row (STAFF · STAFF · INVESTORS · INVESTORS) buzzing in turn, and the ticker `INVESTORS PUSH TO BRING MANALT BACK` crawling in. His badge post is moved above the ticker (it had covered the post's first line) |
| S4.10 | 4.29 | v3's, and **Ttemme's card**: the room frozen in two tones while the lock's card text is up (`blipCard` TTEMME / INTERIM CEO, TAKE TWO · CHAT: LIVE) |
| S5.09 | 14.88 | **He calls Gerg:** v5's OTS copied with kits/act4-v31 `callOutPainter` on the monitor (the app, GERG pressed, `Calling…` under the RING). On `dialog_ok_click` (the pick-up) v5's tile opens and Gerg is there. **Weak:** the app and the press last about 4 f before the ring, because the RING sound sits at 0.2 s |
| S5.06 | 22.79 | v3's (the letter, its ALYI). **Not drawn:** "the letter slides over" (it cuts in) |
| S6.01 | 4.50 | v5's avalanche, with **the letter's header strip on the first employee tile** (`art/v31 firstTileStrip`: kits/act4-v31 `letterHeaderStrip`, the short form `STAFF LETTER` where the board's tiles leave less room). It follows the tile down, and the pour buries it |
| S7.03 | 2.79 | v5's MCU; the slate ripple now answers "Down here." |
| **v31-S7.03b** | 2.58 | **new** (kits/act4-v31 `drawTuesdayInvite`): his desk, the two badges, the invite `Board · Tue 10:00 PM`, his thumb on Accept on the tap's sound, accepted |
| S7.06 | 9.13 | **re-staged on the lock's sounds.** The door; TERB; **the FREEZE on `freeze_hit_F` (k6)** with his card while Mas walks through in colour to his side; the unfreeze; **Terb's dry squeeze on `extinguisher_pin` (k67)** (kits/act4-v31 `drawDrySqueeze`: click, nothing, the 1 px kick) and he frowns; **Mas beside him pulls the pin** and pockets it. Then v5's after: his line and the look-around turns. **Deviation:** the caption has the click before the freeze, but the lock's sounds put the freeze at 0.25 s and the click at 2.8 s. The picture follows the sounds. To get the caption's order, the lock owner can move `freeze_hit_F` after `extinguisher_pin` |
| S7.07 | | v3's re-anchored spray (a port) |
| S7.07-cont | 17.38 | v3's copy, and on "Gerg comes back too." **Terb writes it in** (kits/act4-v31 `drawTerbWriting`, 4 held steps, his room mouth), composited behind the table and the two men the way the 2S composites him |
| S7.13 | 11.00 | k0–127: v5's layout (`fall` re-anchored to shatter +10, so k194 is the heap the insert's last frames hold). **k128–263: the Runway insert**, spliced as 136 PNGs from `studio/src/dev/genvideo/runway/hourglass.py --png … --s713 11181`. The segment declares them as browser frames (option `hourglass`, default on; the Remotion GLYPH step runs with it off) |
| S8.03 | 3.00 | **the lobby's greyed Remove:** v5's copied with kits/act4-v31 `drawRemoveDialog` (field `screen`). Remove greys a dither step a beat; the empty-tagged arrow steps on and clicks on the bonk; the button doesn't go down; the shake |
| cut | | S1.06 (folded into S1.02), S1.08, S2.03, S2.04 (folded into S2.02), S7.07b, S8.09b. **The v3 S7.07b nameplate state is unused now** |

**Kept from v3:**
- no side badges, and no WHAT THEY DIDN'T KNOW card;
- plates cut to names;
- race weekend on the Strip, and the four attendee circles;
- the S1.04 text states;
- C13's falling phone and C14's split;
- the letter's ALYI;
- Mas's inner voice never moves his mouth (the guard over every layout). On this lock all 5 V.O. lines have face null.

### V31.2 New and changed files

- **`pixel/act4/shots.ts`:** rewritten for v3.1, with the v3 layouts carried over where they still hold.
- **`pixel/act4/plan.json`:** the v3.1 lock plan.
- **`pixel/act4/cut_mouths.py` → `takes-v31-cut-mouths.json`:** the cut takes' mouth tracks.
- **`pixel/act4/art/v31.ts` (new):** the window two-shot, the Wi-Fi bars, GERG / CHAIR, the first tile's strip, Alyi's lit tile.
- **`pixel/act4/art/invite.ts`:** the join corner gains the arrow and hover knobs.
- **Everything else is imported:**
  - kits/act4-v31 (the v3-art-b pass);
  - kits/face-light (art-a);
  - the Runway pass's hourglass.py, run with this lock's S7.13 start;
  - v5's modules.

  Nothing in those was edited.

### V31.3 Checks

1. **`node r.cjs check`:** exit 0. 77 shots, 77 layouts, **0 stand-ins**, 0 problems, no V.O.-over-rail notes. The browser frames are the 28 GLYPH frames plus S7.13's 136.
2. **The lock's checks all pass** (§V31.1), including "every on-camera mouth has a track", after the cut-take mouths.
3. **Photosensitivity** (`flash.ts`, WCAG 2.x general and red flash, as §4.3): **at most 2 flashes in any 1 s** (in one window at S5.08, as in v3), **0 red. Pass.**
   - **The hard cut to the Remove dialog** counts as one transition into cream (S1.08d k0) and one out (S1.09 k0), 57 frames apart. That is one flash across 2.4 s.
   - **Ttemme's 2-TONE card** is one flash.
   - **The measure covers the pipeline's own frames.** For S7.13 k128–263 that means the v5 drawing, not the Runway insert. The insert measured **0 flashes** in the Runway pass's check (runway.md §11.3).
4. **The GLYPH step** (Remotion, with `hourglass` off): its plain frames are identical to Node's, and its 28 GLYPH frames are identical outside the room area. 0 missing.
5. **`tsc --noEmit -p .`:** 20 errors, **none in `pixel/act4/`** or anything it imports: all are in `src/dev/realism/bake` and the Runway pass's `src/dev/genvideo/runway/{pxframes,streamframes}.ts`.
6. **The V.O. mouth guard:** all 5 V.O. lines are face null on this lock, so no mouth is drawn for them.

### V31.4 Render

The heavy steps ran as one job through `ops/heavy.sh` (`scratchpad/v3-shots-act4/heavy-run31.sh`):
- build and check;
- `flash.ts`, 369 s;
- `bundle`, then `glyphs --opt hourglass=false` (the 28 GLYPH frames);
- `hourglass.py --scratch … --out … --png $S/glyph31 --s713 11181`, which wrote the 136 insert PNGs, numbered by segment frame;
- `picture --jobs 2` with `GLYPH_DIR`: **149 s wall**, 19.4 ms a frame per worker;
- the contact sheet;
- `tsc`.

**The result:** `out/ep01/full-v3/picture/act4.mp4`.
- **The file:** H.264 1920 × 1080, **12,426 frames, 517.75 s (8:37.75)**, with the v3.1 mix's Act Four as AAC temp audio of the same length. `act4.srt` sits beside it.
- **Browser frames spliced:** 164 (28 GLYPH + 136 hourglass), 0 missing, 0 stand-in marks, 0 failed layouts, **0 stand-ins**.
- **The sheet:** `out/ep01/full-v3/picture/act4-sheet.png`.
- **The hard cut, measured on the decoded MP4:** frame 575 (S1.07's last) has a mean luma of 20.9 / 255, and frame 576 (the dialog's first) 172.5. The cut sits on the shot boundary.
- **Deleted from scratch afterwards:** the insert's PNGs, the Remotion bundles, the old v3 mix cut and the hourglass intermediates (the disk had 5.5 GB free). hourglass.py re-makes the PNGs.

**To re-render** (from the repo root, then `studio/`; `S` = the scratch folder):

```sh
python3 studio/src/episodes/ep01/pixel/act4/cut_mouths.py
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act4 --plan studio/src/episodes/ep01/pixel/act4/plan.json
bash ops/heavy.sh bash $S/heavy-run31.sh      # build, check, flash, bundle, glyphs (hourglass=false), hourglass.py --png, picture, sheet, tsc
```

### V31.5 What's weakest (v3.1)

1. **The Remove dialog lives or dies in motion.** The picture does what the brief asks:
   - a hard cut to cream (a luma spike from the call's ~11%);
   - the dialog readable for about 1.1 s before the arrow;
   - the click on the lock's sound, into the silence.

   Whether it lands as a shock is for someone watching with the mix.
2. **S5.09's call out is nearly instant:** the app and the press last 4 frames before the ring, because the lock's RING is at 0.2 s. The V.O. carries the intent. A longer app beat needs the lock to move the ring.
3. **S7.06's order** follows the lock's sounds, not the caption (V31.1).
4. **v31-S1.01b is a bust in front of the view.** It isn't a staged two-shot at the glass: there's no rig for Mas standing at a window, and the sip isn't drawn. The car is 18 px and passes in under a second.
5. **Face lights are rect-based:** any skin-family pixel in the head's rect steps up. The crops showed only faces (and Neleh's neck) moving.
6. **Not drawn:** Alyi's reflection's hand in S3.01, and the letter sliding over in S5.06.
7. **The hourglass insert** is the Runway pass's picture, unchanged. The tail's pixel chat corner still says F there (runway.md §11.5 item 7).

### V31.6 What I looked at (stills, crops and decoded frames, not motion)

**The new opening, frame by frame, as the lead asked** (native frames at 2x):
- S1.01b at k1, 13, 26, 41, 51, 66, 76;
- S1.02 at k6, 36, 44, 74, 114, 146, 156, 162, 164, 167: the nudge, the ping, the arrow's path, the click;
- S1.07 at k16, 66, 106, 144, 147, 151, 166, 181, plus a 3x crop of Alyi's tile over his line (k76–96, the mouth moving) and at the freeze;
- **the join into the Remove card:** S1.07 k181 → v31-S1.08d k0, 1, 3, 24, 30, 36, 42, 46, 56;
- S1.09 k1, 17, 47, 78.

**The board side's arrival:**
- S2.02;
- v31-S3.00p at k6, 46, 86, 90, 101, 110;
- S1.03 k1, 15, 55, 275;
- S1.04; S1.05 k25, 60.

**The rest:**
- S3.01's notice;
- S4.02's cutaway;
- S4.09 (before and after moving the post);
- S4.10's card;
- S5.09's ring and open;
- S6.01's strip;
- v31-S7.03b;
- S7.06 k22, 62, 82, 102, 122, 152;
- S7.07-cont's writing;
- S8.03;
- every face light, with Mas's at 1 and 2 steps side by side;
- the V.O. frames (S1.02, S5.03, S5.09, S5.09b);
- the contact sheet;
- **frames decoded from the rendered MP4** (the bundled ffmpeg, by time):
  - v31-S1.01b, S1.02, S1.07 (Alyi speaking, lit);
  - the cut: S1.07's last frame against S1.08d's first, measured;
  - S1.08d at the arrow and the click, S1.09;
  - the Runway insert in context (the stream, the sand standing, back to the pixel heap);
  - S8.03.

## 1. Files (the v3 round)

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
