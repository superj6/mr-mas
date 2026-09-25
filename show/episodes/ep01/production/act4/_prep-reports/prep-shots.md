I wrote the Act Four shot breakdown: 118 shots across scenes 24–31, 10,416 frames (7:14). Each scene adds up to the script's clock, and every cut falls on a beat of the 96 BPM grid. All 50 dialogue lines are placed in shots, and every piece of must-read text is on screen long enough to read. Dialogue lengths are estimates from the casting briefs' speaking speeds; the timing-lock stage will replace them with recorded lengths.

**Files**
- `/home/jgon/project/art/mrmas/show/episodes/ep01/production/act4/shotlist.md`: the readable version. It has the legend, the act at a glance, one block per shot, a dialogue index, the 12 chunks, the asset list by owner stage, the cards, the sound effects to build or reuse, the flags and a read-time table.
- `/home/jgon/project/art/mrmas/show/episodes/ep01/production/act4/shots.json`: the same data. Each shot has its id, chunk, frames, episode timecode, framing, room, characters, action, line ids, on-screen text with fact tags, rail, style tag, sound, gags, assets and a visual-event count. If the two files ever disagree, the JSON is the one to trust.
- The generator is in the scratchpad (`sb/build.py`, `emit.py`, `data_shots.py`, `data_assets.py`). Change the data and re-run `emit.py`; don't hand-edit the outputs.

**Ids**
- Shots are `24.01` to `31.09`, including `26A.xx` and `28.01`.
- Dialogue refs use the dialogue stage's line ids (`a4-25-01` to `a4-31-03`, read from their `lines_a4.py`), so the timing lock can join on them.
- Assets are `room.*`, `cast.*`, `kit.*` and `prop.*`. Owners follow the split the room builders are already using: rooms-a has the boardroom, lobby, Vegas suite and TPOOL door; rooms-b has the bullpen, lighthouse and dark room.

**Chunks**

| Chunk | Shots | Length | What |
|---|---|---|---|
| C01 | 24.01–25.02 | 22.5 s | Vegas suite, THE PLAN title and the chairs |
| C02 | 25.03–25.08 | 27.5 s | THE PLAN structure, path and tear |
| C03 | 26.01–26.05 | 30 s | The falling tile |
| C04 | 26.06–26A.04 | 40 s | "super.", quote card, TPOOL flashback, mark 3 |
| C05 | 27.01–27.10 | 34.5 s | Toasts, Rima, all-hands, hearts |
| C06 | 27.11–27.25 | 46.6 s | Boardroom and throne call (the writer's calibration run for dialogue cost) |
| C07 | 27.26–28.01 | 32 s | Badge, TTEMME, Tasya's door, act-out card |
| C08 | 29.01–29.13 | 49.9 s | Pass two in the dark room |
| C09 | 29.14–29.20 | 40 s | The tile avalanche |
| C10 | 30.01–30.08 | 33 s | Alyi's regret and the landlord |
| C11 | 30.09–30.21 | 38.5 s | Fires, Terb, calm-off, hourglass |
| C12 | 30.22–31.09 | 39.5 s | Lobby sign, dialog, Q*, memo, observer chair |

The mid-rate estimate is about 1,660 agent-min (about 28 agent-hours) of scene assembly, once kits, cast and rooms exist.

**Strengths**
- Held portraits and cuts do most of the work: 24 two-shots and single portraits, 24 inserts and 36 room wides. The two set-pieces are repetition: the landlord scene is a palette change, and the avalanche reuses the heart kit.
- The staging reuses the rooms, anchors, mouth set and call-tile chrome the other stages are already building (seats L–R with Mada at R, the bullpen door states and landlord colour-change function, the six mouth shapes).
- Style switches only happen where the script tags them. The GLYPH dissolve is 20 frames, and only Mas's tile goes grey.
- Guardrails are built into the shots. Employees and letter signatures are unidentifiable noise, and workers are hands only. There are no clocks on the security-cam or call UI, and no F1 marks in Vegas. Nobody enters the dark room. Anything the script marks as disputed ([V/K]) gets `RECONSTRUCTED` in the rail.

**Weaknesses**
- Pass one's portrait shots are 90–100% full at the briefs' speaking speeds (27.05, 27.07, 27.12, 27.14). If the recordings run long, take time from 27.13, 27.15, 27.34 and 27.35 first.
- C09 is 40 s of set-piece, which breaks the 10 s rule. It only holds if the falling-stack kit exists first; otherwise split it at 29.17, giving 13 chunks.
- Mas's upside-down post (27.26) and the Q* sticky note carry real read load.
- Several direction calls are my interpretations and are flagged for sign-off:
  - Mas's "greyed tile still falling" (26.11).
  - Neleh's word on step 4 against the later "still blank" (27.35).
  - Terb's full freeze runs 2 bars, not 1.
  - With Mas absent in pass one, the board takes the left portrait window.

**Before anyone builds**
- **Blueprint colours:** #7FDBFF and #0B1E3F are not in the master palette. The engine owner needs to add them as a new colour family or approve the nearest existing colours before the blueprint kit is locked.
- **Rail band:** the room builders disagree. The bullpen stops at y 203, but the boardroom paints the table down to y 236. Someone needs to rule whether the band is solid or a dimmed overlay; I recommend the dimmed overlay.
- **Dialog box:** the engine's `alertDialog()` draws a double border and a "!" icon, which the script forbids. The 1993 dialog kit must be drawn separately.
- **Font and cards:** the 7 px font has no `∞`, and the engine's name-card freeze only covers Gerg, Alyi, Mario and Nole. The six Blip cards need a general version.
- **Props built here first:** the check pen, the GUEST lanyard, the Senate wallet, the odometer and its clunk, the suggested-replies strip and the Orb's chime all get reused by Acts One to Three.
- **Script wins over bible files:** Rima's card reads `HEARTS SENT: 0` (gags.md has `1 (BLUE)`), and TTEMME's card reads `CEO (72 HOURS).` without "DEEPLY PLEASED." The intro spec's `II` desk tally matches the script's mark-3 scene.
- **Uncast voices:** Neleh, Mada, TTEMME, Tasya, Terb, Adelina and the tiled employee. Tasya's "below / above / around" line should be recorded whole and cut into 3 phrases placed on the bar grid.
- **Grid drift:** keeping every cut on the grid moved scenes 29–31 by up to 0.25 s from the script's printed times. Scene 31 now starts at 19:17:21.