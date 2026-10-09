# Ep2 v1: Act One's picture (sc 4, 4A, 4B, 6, 7, "the séance")

> **Status: built, rendered and looked at, 2026-10-09, by Act One's picture pass.** Five scene modules in `studio/src/episodes/ep02/pixel/act1/scenes/` draw all 62 shots of the v1 EL lock (8,736 f, 6:04.00), with the act's own drawings in `act1/sets/` (one file per scene, plus two shared helpers). The picture is `out/ep02/v1/picture/act1.mp4` (silent; the mix is the sound pass's), the per-scene cache `out/ep02/v1/scenes/act1/`, the contact sheet `out/ep02/v1/picture/act1-sheet.png` (one labelled frame per shot).
>
> **Checks [M], after the picture review's fixes (2026-10-09):** `check`: 62 layouts, 0 stand-ins, 0 problems. `scenecheck --every 8`: 1,199 frames, 0 differ. Flash check (`flash_seg.py`): **0** flashes in any second, **0** red, pass (the largest luminance step is still the cut into 4.31's arena insert, 0.187). A scoped `tsc --noEmit` over `act1/` (128 files): 0 errors. All five scenes re-rendered, because every one had a fix (`ops/heavy.sh`, `MRMAS_MAX_LOAD=40`, two workers, under another project's load): scene 4 in 228 s, 4A 17 s, 4B 7 s, 6 40 s, and 7 in 22 s after a last paw-print fix. Cache keys: `sc-4-66037dd93ed807ee`, `sc-4a-9525bb52c5966b29`, `sc-4b-fc7176d6656b2d98`, `sc-6-6f269cb65af336fc`, `sc-7-4d1ff6faf06940bb`. (The first pass's: `sc-4-ef99a01c7ec0c927`, `sc-4a-3dc55a3f904332d1`, `sc-4b-4de58788de0c1a91`, `sc-6-a4cd0bdafc498999`, `sc-7-863af57e20879c2f`.)
>
> **What was looked at [J]:** every new drawing at native 2x while it was built (about 300 stills), then **236 frames decoded from the rendered MP4 at 1080p** (every shot's first, middle and last frame, plus its turns: 4.02's click, the planchette's letters, the three hands, the stone, the knob wall's three states, the snuff and the sweeps, the rocket, the blow; the nameplates' clicks, the Accept; each hop of the mic, the freeze, the lean into the mic; the section's lights, the key, the pan up), and the fixes again from the second render. Nothing was watched in real time or heard with its mix (R8).
>
> **The picture review's 21 findings (9 major, 12 minor) are fixed: §3b.** Each fix was looked at as native stills at 2x while it was built (about 150), then as **56 frames decoded from the new MP4 at 1080p**: every frame the review named, plus each fix's turns (the three hands at rest and lifting, the staff mid-swivel, Alyi's look before and after the crinkle, the key in the hand, the gap and the spare, the blow, `Accepted`, the squeeze). One more fix came out of that look (the paw print still read as a face), and sc 7 was re-rendered for it. Two art-pass files are edited, because the fixes are in the characters: the Humanist's nose (a fairness fix: **for the guardrails reviewer**) and XEL's smile (§4).

**Contents:** [1. The shots](#1-the-shots) · [2. Passes and leaps](#2-passes-and-leaps) · [3. Fixed after looking](#3-fixed-after-looking) · [3b. Fixed after the picture review](#3b-fixed-after-the-picture-review) · [4. Where this departs from the plan, and why](#4-where-this-departs-from-the-plan-and-why) · [5. Weak, or for a human to check](#5-weak-or-for-a-human-to-check) · [6. Re-running](#6-re-running) · [7. Rules checked](#7-rules-checked) · [8. Files](#8-files)

---

## 1. The shots

Frames are each shot's own `k` (the lock's shot frames; `f` in the layouts is the frame inside the scene). Marks are the lock's words and sounds (each layout's `marks`), with the planned frame as a fallback. Lip-sync: `lip` = a drawn viseme track on an approved portrait or bust; `room` = the room-scale flap. No V.O. line moves a mouth (V.O. 1 over his still face, V.O. 2 over the back of his head, V.O. 3 over his phone).

### Sc 4 · The Email Séance (36 shots, 4,632 f)

The room is Ep1's boardroom at night re-lit by six candles (the art pass's board, ghosts and Orb chandelier). Seats: **MAS at the head (L), his laptop; the EMPTY CHAIR at seat A beside him; GERG at B, a hand on the planchette (his real arm, shoulder to elbow to hand, while it's within his reach; off it once the three hands lift in 4.12); three STAFFERS at C, D, E holding hands (each arm bent at the elbow, the clasped hands resting low on the table); NOLE lands at the foot (R) under his hole; the frosted door on the right wall stays shut.** Setups: **W** the candle-lit wide; **LOW·DESK** Mas at the head (Ep1's approved portrait faced to the table, the candles behind him, his laptop's light from below); **HIGH** the board from above (the plain brass-rimmed planchette, no pointer); **OTS** down the table from the head, over the back of Mas's head, to Nole at the foot; **MCU** Nole (Ep1's portrait, warmed by the candles, his post lamp); **M** Gerg and the staffer, the empty chair beyond.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 4.01 | 0-59 | W → LOW·DESK POV | **ARRIVE:** 1.5 s on the lit table (hands joined, the Orb), then 1.0 s at his end: the post on his laptop, `NOPEAI AND NOLE`, `… · ALYI · … · MAS`, legible (and again above the button in 4.02) | k36 cut |
| 4.02 | 60-304 | ECU → W → MCU | His finger over the bare Publish (title and byline above it), the click; the wide: every candle a step taller, the planchette sliding A→C by itself, the rail `MAR 5, 2024`; then his face (LOW·DESK, lips still) while **V.O. 1** types | `post_click` k9, `candle_flare` k12, `planchette_glide` k24; MCU from k64 (rail out at k62, V.O. from k76) |
| 4.03 | 305-419 | LOW·DESK → HIGH | "is there anyone here… from 2016." (lip); the planchette to `>>>`, the chevrons glow on the chime | `planchette_glide` k86, `inbox_chime_low` k93 |
| 4.04 | 420-529 | W | Ghost 1 rises out of the board (`FROM: ALYI · JAN 2016`, the quote, held 4 s); the 2016 GHOST-NOLE unfurls beside the staff (`RE: · 2016`, "YUP."), "Yup" on his room mouth; Mas looks up | rise k2-12, the second k40-56 |
| 4.05 | 530-620 | M | The staffer's eyes go to the empty chair (a chair: seat, arms, nobody); Gerg, quietly, to her (room mouth); her eyes come back to him | — |
| 4.06 | 621-778 | LOW·DESK → HIGH | "one knock if we promised a nonprofit." (lip); the held hands at the board's far edge, the planchette still (1.2 s); KNOCK, KNOCK, KNOCK: dust sifting down, more each time, the board a pixel on the third | `ceiling_knock` k109, 126, 143 |
| 4.07 | 779-872 | W | CRASH: tiles rain over the foot, the room jolts; Nole drops on his cable and lands (the room jolts again); the staff look up; Mas doesn't: "you're early. we're on 2016." (room mouth) | `ceiling_burst` k0, `cable_drop` k9, `landing_thunk` k26 |
| 4.08 | 873-1064 | OTS | Nole at the foot brushing a tile off his shoulder; his plate `NOLE · FUNDED IT. LEFT IT. SUING IT.` (k4-114); his line (lip, the phone hand jabbing on its stresses); Gerg answers off frame | — |
| 4.09 | 1065-1427 | OTS | His case (lip), the jab on "table", "candles", "ceiling", "name", a dip on both "open"s; the 2016 ghost's "less open" and its Yup hang behind him, floating a pixel | word marks |
| 4.10 | 1428-1539 | LOW·DESK → HIGH | "spirit, what did we call it?" (lip); the planchette glides to O, P, E, N, a letter on each tick, the word along the near edge in his cyan | `planchette_letter_tick` ×4 |
| 4.11 | 1540-1649 | OTS → HIGH | "There. Even the furniture knows." (lip, the smirk after); the planchette pauses on the N, then carries it to the front in one held glide: `N O P E` | `planchette_glide` k73 |
| 4.12 | 1650-1758 | MCU → HIGH | Nole jabbing (lip), looking down at the end; closer over the board (its camera moved so the planchette sits mid-frame): **three whole hands resting on it** from three sides, Mas's grey cuff from the left, GHOST-NOLE's from above in the spirit screen, Gerg's from the right, each sleeve on its forearm's line, held 0.7 s; lifted together at k88 (a gap of shadow under the fingertips), gone at k94 | — |
| 4.13 | 1759-1868 | W | The cow ghost (chevrons, cable tail, `ALSET` plug, `2018`) rises, chewing; its caption `FWD: "…ATTACH TO ALSET AS ITS CASH COW…"` and under it `NOLE: "…EXACTLY RIGHT…"` as ghost-text plates, typed on, held | `cow_moo_reverb` k7 |
| 4.14 | 1869-1984 | OTS → LOW·DESK | "I forwarded that. I didn't write it." (lip, the cow over the table) → "you wrote 'exactly right.'" (lip) | cut 6 f before Mas's line |
| 4.15 | 1985-2081 | M (Nole's MCU) | His post lamp (a weighted base on the table's edge, a jointed arm, a cone shade) clicks on beside him, two candles standing on the table at lower left; he types, eyes down; his post rises off the phone as a ghost of `!`, `NOLE · JUST NOW`, held 2.3 s as it floats up | `lamp_click` k5, `reverse_swell_1beat` k40 |
| 4.16 | 2082-2252 | W | The planchette's last slide; ghost 3, GHOST-NOLE in his 2018 hood, leaning across the table, his `DEC 2018` header with the 0% sentence top left (held 6.6 s), his line on his room mouth | rise k2-16 |
| 4.17 | 2253-2317 | MCU → ECU | Nole's slap (5 f) → Mas's hand round his glass of water (clear: the room through the empty glass as it is, the water cool and clear with the candle small and upside down in it, only the rim warm; his forearm on the wrist's own line, tapering, a ribbed cuff, the elbow off frame): the candle beyond jumps two steps and settles; the glass, the hand and the water don't move | `phone_clack_floor` k5, `candle_flare` k6 |
| 4.18 | 2318-2555 | 2S | Nole and GHOST-NOLE face to face (the same portrait twice, the ghost flipped in the spirit screen, a hood behind its neck), `DEC 2018` between them; both lip-synced; Gerg off frame; Nole turns on the ghost for "Say something ELSE."; the long hold; "…Yup." | — |
| 4.19 | 2556-2669 | LOW·DESK → HIGH → ECU | "spirit, why zero?" (lip); the planchette slides into the board's corner, the corner turns to a cut-paper Go board in three held steps; Move 37 (SET-04): the stone clicks down, `MAR 2016 · GAME 2 · MOVE 37` | `planchette_glide` k53, `go_stone_click` k70 |
| 4.20 | 2670-2721 | MCU → MCU | Nole, quiet, eyes down: "That's why." (lip) → the staffer whispering behind her hand at the stone (her line is O.S.) | — |
| 4.21 | 2722-2781 | MCU | Nole to her, hushed, leaning (lip, a tighter framing) | — |
| 4.22 | 2782-3179 | MCU → MCU → ECU | Gerg typing, cheerfully literal (room mouth); she whispers to him behind her hand; **from "Nobody wrote it."** the knob wall: tiny human boards (kaya yellow, a little face on each) pour in along the top, above the Go board, and down into the wall, every knob ticks, each lands as a warm knob; on "Then it played itself" the program's own boards, a different thing (dark, cyan-bordered, a black and a white stone on each, no face; the knobs they land on light cyan); the wall freezes on "games" | `on e2-a1-0056` k143, "Then" k319, "games" k378 |
| 4.23 | 3180-3316 | MCU | Nole takes the fear back (lip; a third framing, his head dipping on "right") | — |
| 4.24 | 3317-3391 | W | Nole, loud again, jabbing at the table (room mouth); the board back to letters | — |
| 4.25 | 3392-3537 | OTS | Ghost 3 drifts into Mas's eyeline (eased, held steps), its 0% header top left (wrapped to three lines: the whole block, `NOT 1%.` included, clear of the back of his head), "billions per year…" on its room mouth; Mas's cheek turns a sliver to it; **V.O. 2** types | — |
| 4.26 | 3538-3643 | MCU | Nole, the lamp dark beside him: "You kept them." (lip); "we keep everything." lands on his face (L-cut); a whole-pixel drift in (7 px) | — |
| 4.27 | 3644-3708 | ECU | Mas lifts his glass in held steps; the candle nearest Nole snuffs, its smoke curls across the glass; on the render front's sweep 2018 is revealed left to right behind a cut-paper front: Mas's glass at the back of the first office | `candle_snuff` k13, `render_front_sweep` k43 |
| 4.28 | 3709-3813 | W (T3) | NopeAI's first office, FEB 20, 2018 (rail): one rack, the arena monitor, `AGI` with three crossed-out arrows, the Go stone; the staff (13) each at a desk, every chair swivelled round toward Nole, their monitors on behind them; Nole facing his slide `ALSET · AI`, his hand on it, his mouth moving with no sound; Gerg typing; **Alyi at his desk at the front right**, turned to Nole; Mas at the back with his glass of water (pale, cool, a highlight) | — |
| 4.29 | 3814-3921 | W (T3) | Nole finishes, his hand still on the slide; nobody applauds; one staffer every 6 frames swivels back to the monitor behind them (13 held steps in a scattered order, k8-86: the chair, the knees and the reaching arm flip toward the desk); Alyi turns back to his with them | — |
| 4.30 | 3922-4035 | W (T3) | Mas sips; Nole climbs the ladder rung by rung; the hatch slides shut | `glass_sip` k10, `ladder_climb` k32, `hatch_slide_shut` k89 |
| 4.31 | 4036-4079 | INSERT | The arena match on the one monitor plays on; nobody paused it | — |
| 4.32 | 4080-4179 | 2S (T3) | Across the room: Alyi in the foreground at his desk, warm, cropped by his monitor's edge, turns (k24-30) and looks back at Mas: **his eyes open on him** (whites, the irises turned toward him, a glint; drawn over the paper tier) with a soft open smile, held 1.1 s before Mas at the back lifts his glass an inch (k56); the crinkle (the lower lids lifted, a crease) comes in only after the eyes have met (k66); 2.9 s on the look | — |
| 4.33 | 4180-4250 | 2S → ECU → W | The 2018 look; the front sweeps back to 2024 (his glass, the smoke thinning); the wide: Nole strikes a match, relights the candle, lifts it | `render_front_sweep` k5, `match_strike` k37 |
| 4.34 | 4251-4466 | OTS (reverse) | Over Nole's shoulder (the back of his head, his black tee), his arm up and bent at the elbow, the candle raised to Mas's cheek like evidence (k0-14); Mas in the left third, still, lit by it from that side (a step up near it, a rim on the near edge, the far side a step down); his line from behind his own head; the sip | `glass_sip` k190 |
| 4.35 | 4467-4564 | W | Nole at Mas's end sets the candle down hard in front of him, already rising on his cable (room mouth); on the roar he's yanked back across and up through his hole and the gust snuffs every other candle (their smoke); a ceiling tile drops back into place | `rocket_roar` k53, `tile_land_1` k90 |
| 4.36 | 4565-4631 | MCU → W | The last candle right under his chin; Mas leans in (two held steps) until his pursed lips are a few pixels from its flame (lit only by it) and blows it out: the flame bends away from his mouth; its ember, its smoke; the dark room (the aftermath, 1.9 s) | `candle_blow` k12 |

### Sc 4A · You can sit down now (6 shots, 792 f)

The boardroom by day on the séance's camera (a morning grade over Ep1's boardroom: the window a pale sky, no reflection): **TERB at the head (L)** with his single sheet, no helmet, no extinguisher; **MADA** halfway down (C), perfectly still; **OMIS** (D) and the two new directors (A, E) (Ep1's civic extras); **MAS** standing beside his empty chair (B); **GERG** at the back by the door with his laptop, in front of the end chair's high back. The window's light on the near half is feathered across the room (no seam).

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 4A.01 | 0-181 | W | **ARRIVE** (2.6 s, rail `MAR 8`): the room by day, Mas already standing; Terb looks up for his first line (room mouth), then back to the sheet | — |
| 4A.02 | 182-457 | 2S → MCU | The finding's first half on MADA (Ep1's medium rig, the poker face, perfectly still; Mas standing at the left behind his chair's high back, a rung soft); from "but also found" Mas's face: **Ep1's approved CU**, nothing on it (tungsten: the morning, not a monitor) | "but" k154 |
| 4A.03 | 458-540 | OTS | Over Mas's shoulder (the back of his head and hood, right foreground) onto TERB's approved portrait, his sheet at the frame's foot; he looks up: "You can sit down now, Mas." (lip); Mas sits: his shoulder drops out of frame | `chair_unfold` k53 |
| 4A.04 | 541-622 | ECU | The four nameplates click in, his first: `MAS MANALT · BOARD`, `OMIS · NEW DIRECTOR`, `NEW DIRECTOR`, `NEW DIRECTOR` (each a pixel high on its click) | `nameplate_click` ×4 |
| 4A.05 | 623-735 | W | The plates in; Mas sits and looks over to Gerg at the back, who lifts his laptop an inch (k40-63) and looks up | — |
| 4A.06 | 736-791 | ECU | His phone face up beside his nameplate's corner (`MANALT`); under the last click it lights: the invite's toast, its mic icon; its glow on the wood | `ui_toast_pop` k12 |

### Sc 4B · The booking (1 shot, 216 f)

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 4B.01 | 0-215 | ECU | **ARRIVE** on the phone's glow (continuous from 4A.06): the calendar card in Ep1's invite look (`XEL · LONG-FORM`, `MAR 18 · 2 HRS`, the mic icon, Accept / Decline); **V.O. 3** types; a beat after it his index finger on Accept (no cursor), then `Accepted` on the lit button, held 8 frames; the card settles into the `MO 18` cell in three held steps (never blank: its mic and `Accepted`, then its mic and `XEL`), its **mic icon landing where 6.01's mic stands** | `post_click` k170; `Accepted` k172-179; settles k180-191 |

### Sc 6 · Chapter 1 of 6 (11 shots, 1,944 f)

The locked meter frame inside the podcast player's chrome (`CH. n OF 6`, `REC`, the scrubber): the black curtain, **MAS** at the left (his approved portrait, warm, his three collars, a face light), **XEL** at the right (his sculpted bust), the mic on its stand between them at its held size. Both faces lip-synced.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 6.01 | 0-217 | 2S | Enter late (1.4 s): CH. 1, the mic at size 1; XEL's first question (focus while he asks) | — |
| 6.02 | 218-299 | 2S | XEL waits; the mic hops (2), CH. 2; the 2-tone freeze with XEL in colour and the card `XEL / ASKS THE LONG QUESTIONS.` + `EPISODE: 419` (top centre, clear of both faces), held to the cut | `mic_grow_step` k12, `chapter_tick` k14, `freeze_hit_F` k19 |
| 6.03 | 300-574 | 2S | Mas answers; the mic doesn't move | — |
| 6.04 | 575-746 | 2S | XEL lets it sit; hop (3), CH. 3; the Alyi question | k18, k22 |
| 6.05 | 747-965 | 2S | The "no." ladder, quick; Mas's small smile after "neither" | — |
| 6.06 | 966-1222 | 2S | XEL pauses; hop (4), CH. 4; the real question, warm (an open-eyed, gentle smile; his skin's speckle smoothed), leaning a hair | k18, k22 |
| 6.07 | 1223-1607 | MCU | The one cut-in: Mas against the curtain (no chrome), the relationship answer at his own pace (lip), a face light | — |
| 6.08 | 1608-1717 | 2S | Back to the meter: the mic exactly where it was; XEL's pause; hop (5) fills the frame, CH. 5; on the creak Mas leans round it (his chair pushed toward the curtain) | k40, k44, `chair_creak` k66 |
| 6.09 | 1718-1760 | INSERT | The chrome close: CH. 6 OF 6, the REC light goes out | k7, `rec_light_off` k21 |
| 6.10 | 1761-1892 | 2S | Off the record: the giant capsule has crept over to Mas and rests against his cheek and shoulder, pressing him to the curtain at the frame's edge; XEL leans in beside it ("Is it… conscious, though?"), and for "Yes." his head is behind the capsule: it seems to come from inside the mic | — |
| 6.11 | 1893-1943 | 2S → MATCH | The curtain parts from the middle in held steps (→ 7.01's halves sliding apart) | `curtain_draw` k3 |

### Sc 7 · A tenant (8 shots, 1,152 f)

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 7.01 | 0-149 | W | The facade's two halves slide apart (the curtain's match), Mas at his monitor at the top; following his recorded voice on the phone the camera pans down whole pixels as the floors' lights click on from the top down, past MACROSOFT's plinth (`BELOW · ABOVE · AROUND`, re-set in the plate's own face so it reads, 2.9 s), to the basement, lit last (his monitor steps down a rung); the odometer egg in the bedrock | `dollhouse_slide` k0, `light_bank_click` k19, 38, 99, 113 |
| 7.02 | 150-296 | 2S | THE HUMANIST (his bust, his `DEFLECTION (LICENSED)` box, caught out; lip) by his sealed boxes; TASYA in the doorway's warm light (Ep1's medium rig, the ring); the phone on a box between them, turned down to one bar at k8; he sets the box down; his plate `THE HUMANIST · MACROSOFT'S NEW AI CHIEF` (k11-93) | `box_set` k35 |
| 7.03 | 297-500 | MCU | Closer on TASYA in the doorway (his approved portrait in the room's warm skin): the stair's light behind him, the bare bulb keying his face from the upper left; his welcome (lip), warm and unhurried, a pleasant smile between the words | — |
| 7.04 | 501-708 | 2S | "I brought my own team…" (lip), his hands open and spread ("people first"); the Humanist's polite smile after; Tasya's answer (lip) | — |
| 7.05 | 709-834 | ECU | The ring at his belt: **Tasya's fingers** (his shirt cuff, the navy sleeve down from his elbow off frame) pinch the middle key, twist it off in two held steps on the click and carry it up and out toward the Humanist (k19-34); the gap (5 f); the spare grows in (four held steps, k40-55), its bow stamped `MAR 19`: the stamp is the date (no band rail); LE CHIEN's small key with a paw print (a pad and four toes); Tasya's line off frame; the `INQUIRY` envelope sails in and bonks off the ring | `door_key_turn` k7, `alert_bonk` k97 |
| 7.06 | 835-895 | 2S | The Humanist, the key in his hand, looks up where Tasya looked: "Who else lives here?" (lip) | — |
| 7.07 | 896-1016 | W | With Tasya's glance the camera pans up the section whole pixels (3 a frame), floor by floor, to Mas at his monitor (a rung down); "A tenant." lands on him | — |
| 7.08 | 1017-1151 | MCU | Mas at his monitor in the dark room (Ep1's dark-room 2S: his medium rig, the Orb, his tally; a rung down), still; the jangle below frame at k63; black from k96 (1.6 s): act-out 1 | `key_ring_jangle_1` k63 |

## 2. Passes and leaps

Act One has **no video-model insert and no Tier 2 leap** (manifest §4: 2.A and 2.H are sc 1 and sc 22). Its passes, all code:
- **2.G spirit photo** (sc 4): the ghosts in the art's 50 % screen with the faint offset second image; GHOST-NOLE's portrait in the same treatment for 4.18; the ghost hand in 4.12.
- **T3 cut paper** (sc 4): Move 37's board and knob wall (SET-04); F2.3 by day (SET-03, copied with its beats); the render front that sweeps the glass into 2018 and back (4.27, 4.33).
- **2.D podcast** (sc 6): the player's chrome, the counter, `REC`.

## 3. Fixed after looking

Each of these was seen in native stills or in frames decoded from the MP4, fixed, and looked at again.

**Sc 4**
1. **Mas's back of head (the OTS foreground)** first read as a black disc with an orange ring, then as a striped ball (the strand pattern made rings), and a NaN in the shoulder's slope drew a black line across the table: redrawn (`act1/sets/figures.ts backHead`) as a skull with diagonal hair strokes, the ear and a sliver of cheek on the side he looks toward, the nape, the hood, rounded shoulders, a candle rim; the same drawing (Nole's hair and tee) is Nole's shoulder in 4.34 and Mas's in 4A.03.
2. **The OTS's table** came from Ep1's down-the-table plate, whose far end made Nole a giant behind a narrow table: a new view of the foot (its slatted wall, the table's trapezoid, the candles down it), Nole's portrait cut by its far edge.
3. **Ghost 1's header sat on Nole's face** in the OTS and over the 2016 Yup's header in the wide: both re-laid (left in the OTS, the Yup's beside the staff in the wide); **ghost 3's 0% header** moved off Nole to the top left; **the cow** off his chin to the left.
4. **Mas's LOW·DESK face was nearly black** (the candle grade ran over the approved portrait): the room is graded first and the portrait drawn on it; the laptop's cool light only on the planes that face it. The same order for the reverse (4.34), the staffer and Gerg.
5. **Mas at the head of the wide** was invisible; then the laptop key turned his whole face cyan: a cool rim only on the edge facing the laptop.
6. **Gerg's face went flat yellow** in 4.05 (a rim pass read its own output and filled the face): the rim from a snapshot.
7. **The empty chair** read as a tombstone, then a doorway: a seat, armrests and a column under the high back (P7: "He signed it." points at a chair).
8. **The glass** read as a box with a fist on it: a cut-crystal tumbler (an elliptical rim and base, tapered walls, facets catching the candle, the water's surface an ellipse, what's behind it seen through it), its sleeve softened and run to the frame's corner.
9. **The board from above** was letters floating on wood: a maple board with its border and corner studs on the darker table; the held hands brought down into frame; the letter under the planchette's window drawn in it.
10. **The publish finger** was cyan-lit (the dark room's rig): warm, in the candles' light; the title and byline on the page above the button.
11. **Nole's lamp** was a T-shaped floor lamp: a desk lamp (an angled arm off the table, a cone shade), dark until it clicks on.
12. **Nole's MCU was one framing seven times:** three framings (the base, a lean in for the hushed line, a tighter one for the fear) and the drift in 4.26.
13. **The `!` ghost** shot out of frame before its header could be read: it rises a pixel a frame (in frame 2.3 s).
14. **The cut-paper sweep** turned a dark frame into a dark frame: the front now reveals 2018 behind it (the same glass in Mas's hand at the back of the first office), and in 4.33 2024 from 2018's look back.
15. **F2.3 had no Alyi in the wide** and 4.32 was Alyi's bust beside a bare brick wall: Alyi at his desk at the front right of the all-hands (turning back to his monitor with the room), and 4.32 recomposed on the office itself, a rung soft, Mas at the back.
16. **The plate** `NOLE · FUNDED IT…` sat on the Yup ghost: moved to the table, clear of everyone.
17. **The dark aftermath** kept a lit tile at the top right: it darkens with the room.

**Sc 4A, 4B**
18. **The day grade** printed the walls as checkerboard noise: a deterministic remap (the night's cool rungs to day greys, the warm a rung up) and a pale sky in the window.
19. **The new directors stood** in their chairs (the extras' sitting sprite drawn on the far-side floor): their feet under the table.
20. **Mas standing behind his chair** showed only his head over its high back: he stands beside it.
21. **4A.02's two-shot** was Mada small beside a black bar: Mas standing at medium (his rig, a rung soft) behind his chair, Mada seated, the table across his waist.
22. **Mas's CU was cyan** in the morning room: the approved drawing's tungsten light.
23. **The calendar's mic icon** sat on the date: the date at the cell's top, the icon under it at 6.01's mic's place.

**Sc 6**
24. **The meter frame was a wide** (room-scale sitters, about 40 px, for a minute of talk): the same locked two-shot, tightened to the two faces (approved portrait, sculpted bust), both lip-synced; the mic redrawn at that scale in five held sizes (`act1/sets/studio.ts micAt`).
25. **The freeze card covered Mas's face:** top centre.
26. **XEL's "Yes." came from his own mouth:** he leans his head behind the giant capsule for it.

**Sc 7**
27. **The floors lit bottom-up** while the camera follows the voice down: the section copied and lit from the top down; the basement last.
28. **`BELOW · ABOVE · AROUND`** was 5-px type: re-set in the 7-px face on the plinth.

## 3b. Fixed after the picture review

The picture review of 2026-10-09 gave 21 findings (9 major, 12 minor). Every one is fixed in the scene modules and drawings below, all five scenes re-rendered (`ops/heavy.sh`, `MRMAS_MAX_LOAD=40`), and the fixed frames looked at, first as native stills at 2x and then decoded from the new MP4 at 1080p (§5's list). The finding's frame numbers are act frames.

**Major**
1. **Flat-bar and stick arms in the séance wide** (4.01/4.04/4.07/4.13/4.16/4.24/4.33/4.35; `act1/sets/seance.ts room`). The three staffers' joined arms are now bent: each upper arm drops from the shoulder to an elbow at the table's edge, and the forearm runs out along the table to the clasped hands, which rest low on it (laced fingers, a lit knuckle row). Each sleeve takes its own staffer's sweater tones, read off the sprite, and the sprite's own lap hand is covered (no third hand). Gerg's "hand on the planchette" is now his real arm, shoulder to elbow to hand, in his own jacket's tones (a dark sleeve on the dark table read as no arm), and it's drawn only while the planchette is within his reach (the board's left end: A, C, `>>>`). From 4.13 on his hand is off it, since the three hands lifted in 4.12, so the 425-px stick can't recur when the planchette sits at M.
2. **The glass ECU's periscope arm** (4.17/4.27/4.33; `glassECU`). The hand's grip now points a little up the glass, and the forearm runs on the wrist's own line (rotated 7 degrees toward the elbow, never a kink), tapering from 22 px at the elbow (off frame, left) to 14 at the wrist, with the hoodie's ribbed cuff a rung lighter at the wrist.
3. **4.12's three hands** (`boardHigh`, a new `cam`). The board's camera moves (80, 78) so the planchette sits mid-frame, and three whole hands rest on it from three sides: Mas's grey cuff from the left, GHOST-NOLE's from above in the spirit screen (the whole hand and cuff in frame, its fingertips on the top rim), and Gerg's from the right. Each sleeve runs on its forearm's line. They rest from k71 (0.7 s) and lift together at k88.
4. **F2.3: the staff never turned** (4.28-4.29; `act1/sets/f23.ts office18`). From 4.28 every staffer (13 now, in three rows) sits at a desk with a monitor on, on the side away from Nole. The chairs are swivelled round toward him: the sprite faces him, and the chair's high back is behind them. In 4.29 they swivel back one at a time, every 6 frames in a scattered order (k8-86). The sprite, its chair and its knees flip toward the desk, and its arm reaches to the keyboard. Alyi turns back with them; his facing was inverted and is now fixed. Nole faces his slide, now hung lower on its easel, and his hand rests on it.
5. **4.32 Alyi's look read smug** (`f23.ts alyiLook`, `alyiEyes`). After the turn his eyes are open on Mas: whites, the irises turned screen-left toward him, a glint. They're drawn over the cut paper, because the tier's three tones had flattened them to slits. He has a soft open smile (the lips parted on the teeth, the corners up, the cheek's bump). The look holds 1.1 s before Mas lifts his glass (k56), and the crinkle (the lower lids lifted by the cheeks, a crease; the eyes still open) comes in only at k66, after the eyes have met.
6. **The glass read as whiskey** (`tumbler`, `f23.ts waterGlass`). In 2024 the empty part of the glass shows the room behind it exactly as it is. The water is clear: the room seen through it in cool greys a rung up, a pale cyan surface, and the candle small and upside down in it, with the streak a cylinder makes of a light. Only the rim and the lit wall are warm, and the highlight is cool white. The same tumbler serves 4.34's sip. In 2018 the art rig's amber drink is recoloured in his hand's box to a pale cool fill with a highlight. This is done locally, because `art/cast/mas2.ts` is also imported by the cold open.
7. **7.05: the handover had no hand** (`act1/sets/tenant.ts keys`, a copy of the kit's ring ECU so the middle key can be its own drawing). Tasya's hand, at the ring's scale, comes down from his elbow off the top right: his shirt cuff, then the navy sleeve. It pinches the middle key's bow, twists it off in two held steps on the click (k7-18), and carries it up and out of frame toward the Humanist in four held steps (k19-34). The bare gap holds 5 frames, then the spare grows in over four held steps (the tag half, the tag stamped `MAR 19`, the blade half, the blade). In 7.06 the key is in the Humanist's hand.
8. **4.36: the candle died by itself** (`masBlow`). The candle stands right under his chin. He leans in two held steps of 10 px across and 8 px down, until his pursed lips are a few pixels from the flame at k12, and the flame bends away from his mouth on the breath. The ember and the smoke stay.
9. **The Humanist's nose** (`art/cast/humanist.ts`, the art pass's file, edited because the problem is in the character). The nose is now of ordinary proportions (no hook, less projection, a softer tip), and the face fuller and less gaunt (shallower sockets, softer cheekbones, a shorter muzzle). The caricature now carries his file's own features: an earnest lifted brow (brows up at rest and in the polite smile), the open amber collar, and a new `spread` arm, "people first" (both hands open toward us, fingers up), used on his team question in 7.04. The lanyard waits for Ep5, where the file puts it. **The guardrails reviewer should look at the redraw (an ask, §5).**

**Minor**
10. **4.25's header hid `NOT 1%.`** (`noleOTS`). Ghost 3's header is drawn last and wrapped wider (three lines), so the whole block clears the back of Mas's head and Nole's hair.
11. **The OTS back of the head's checker** (`act1/sets/figures.ts backHead`). The ear, the cheek and the hood were stepped in the shape's own units at scale 1.25, which left holes in a grid. They're now walked in the frame's own pixels, with solid ramps. The shoulders' dither is now flat ramps (lit, mid, the far side's shadow), and the cheek is a crescent hugging the skull's outline, with a one-step rim. This covers 4.08/4.09/4.11/4.14/4.25, 4.34 (Nole) and 4A.03.
12. **Nole's MCU set** (`noleBg`, `noleFore`). A walnut table edge runs across the frame's foot in front of him. The two candles stand on it, with their bodies, wicks and small flames (no flame floating in the air), and their pool of light is on the wall. The lamp is now a desk lamp: a weighted base on the table, two struts with a hinge and springs, and the cone shade angled down at him, with its bulb when it's on. The same table and candles stand in 4.18's two-shot.
13. **Mas and Gerg at room scale** (`room`). Mas's laptop rim is one soft step (the mixed-light skin) and only on the flat planes: a row whose edge juts past its neighbours (the nose, the lips) keeps its own skin, so the profile has no white outline. Gerg's face is warmed a step from the candles (the screen's cyan rungs walked to his skin, the sockets lifted out of black). The 4.01 wide is now 1.5 s (k0-35). The post's 1.0 s on the laptop plus its 0.5 s over the Publish button in 4.02 still clears its read time.
14. **The 4A wide** (`act1/sets/board.ts`). (a) Terb's extinguisher is gone: the rig's sheet arm carries it, so its red and nozzle pixels are left out and his far hand hangs empty. (b) Gerg is drawn in front of the end chair's high back (behind it, the back's day grade read as see-through trousers), and the laptop's green is cleared from his face; it stays on the screen's edge. (c) The window light's hard edge at x 220 is feathered across x 170-270 in an ordered dither.
15. **Tasya in the doorway** (`tenant.ts tasyaMCU`). 7.03, his welcome, is now a single on him: his approved portrait in the room's warm skin, the stair's light behind him, and the bare bulb keying his face from the upper left (the whole face a step up, the planes toward it two). He has a pleasant smile between the words. His floating far hand in the 2S (the `ring` arm's hand stamp, its arm hidden behind the coat) is covered by the coat: the hand is in his pocket.
16. **XEL's smirk; 6.10's squeeze** (`art/cast/xel.ts` smile; `act1/sets/studio.ts`). XEL's warm face is now open-eyed and gentle, with the cheek lift halved, and his bust's skin speckle is smoothed: a lone pixel in its 3 x 3 takes the tone around it, two passes. In 6.10 the giant mic has crept over to Mas: its capsule rests against his cheek and shoulder, and he's pressed to the curtain at the frame's edge, only 30 px out of frame. XEL leans in beside the capsule, and for "Yes." his head is behind it.
17. **The ceiling hole's flames** (`holeAt`). The torn edge is broken tile in browns, one warm step on the lip. The ceiling's tone is carried across the frame: the far tiles a dithered rung or two above black, their grid faint.
18. **7.05's rail and paw** (`sc-7.ts`, `tenant.ts`). The band rail is dropped for the shot (`noRail`), so the stamp carries the date (`MAR 19`, held 3.0 s). LE CHIEN's key has a round bow with a readable paw print (a pad and four toes).
19. **The knob wall's second half** (`f23.ts move37`, a copy of the art's). The stream runs along the top, above the Go board, and turns down into the wall. The human games are kaya-yellow boards with a little face beside each, and they land as warm knobs. The program's own games are a different thing: dark boards with a cyan border, a black and a white stone on each, no face, and the knobs they land on light cyan.
20. **4B's missing `Accepted`** (`board.ts invite`, `sc-4b.ts`). `Accepted` is held on the lit button for 8 frames (k172-179) before the card collapses. While the card shrinks it keeps what it is, never a blank box: its mic and `Accepted`, then its mic and `XEL`.
21. **4.34's candle at his chest** (`masReverse`). Nole's arm is bent at the elbow and raises the candle to Mas's cheek in held steps (k0-14). Its light falls off across his face from that side: a step up near it, two on the near edge, the far side a step down.

## 4. Where this departs from the plan, and why

- **4.01 is two framings** (1.5 s wide, then 1.0 s at his laptop; the review asked for more on the wide), the lock's "WIDE → LOW·DESK": the arrival keeps the room 2.5 s before the click, and the post is legible 1.0 s on the laptop plus 0.5 s over the Publish button (its byline needs 1.15 s). [GUIDE: P3, P15]
- **4.02 adds a wide between the finger and his face** (k12-63): "every candle flares one step; the planchette moves by itself" can't be seen in an ECU of a button. The rail plays over it and clears before V.O. 1 types (P18). [GUIDE: P7]
- **The empty chair is seat A**, beside Mas at the head, not the end chair: Nole lands at the foot (R), and the door he didn't use (on the right wall) must stay clear of him. "At the table's end" reads as the far row's end nearest the head. [GUIDE: staging]
- **The OTS looks down the table from the head**, a view the art didn't have (the frontal wide can't look down the axis), over the back of Mas's head. [GUIDE]
- **The staffer's lines are O.S. in the lock**, so her face never moves a mouth: she whispers behind her cupped hand (4.20, 4.22). [P9]
- **The knob wall holds the frame from "Nobody wrote it." to the end** (10.6 s, Gerg's voice over it), rather than intercutting Gerg: the picture note says the picture carries the second half. [GUIDE: P2 for 10 s]
- **4.35: Nole is yanked back across to his hole, and his rocket's gust snuffs the other candles**, so the candle he set down is "the last candle" Mas blows out in 4.36 (the script has the last candle, no cause for the rest going out). [GUIDE: W13's cause before the result]
- **4A.01 is on the séance's camera, not "from its foot"**: the seam is "the same table by day", so the same framing carries the matched object (the dark table → the same table by day). Terb's sheet is in his hand, not lying where the board was. [GUIDE: W12]
- **Mada sits halfway down (C)** as the script says; Ep1's bolted chair stays at the foot, empty. [J: a continuity note for the next board scene]
- **4A.02's MCU is Ep1's approved CU in its tungsten light** (the drawing's own alternative ramp, never used before): the morning room has no monitor to light him cyan. [GUIDE]
- **The meter frame is tighter than the art's** (two faces, not two seated figures): the proposal's locked two-shot and its rule (the mic grows only on XEL's pauses) are kept; the 6.07 cut-in is a single on the curtain without the chrome, at the same pixel scale (the portrait is the closest lip-synced rig). [GUIDE: P2]
- **7.01 lights the floors top-down** (the art: bottom-up), following the voice down; **7.08 cuts to black at k96** (1.6 s of black under the jangle's ring-out and THE COPY: act-out 1). [GUIDE]
- **After the picture review (§3b):**
  - **4.12 is a closer framing over the planchette** (the board's camera moved), so the gag's three hands fit the frame. [P7]
  - **Gerg's hand leaves the planchette with the others in 4.12** and stays off it. The script has it on the planchette, and the lift is the shot that takes it off. [W13]
  - **F2.3 has 13 staffers at desks**, not 23 in theatre rows. The desks must be in the room before anyone turns back to them, and 23 desks don't fit the office. [W13: the cause before the result]
  - **7.03 is a single on Tasya**, not the locked 2S: the review asked for his welcome on a face that reads. The Humanist's polite smile moves to the end of his line in 7.04's 2S. [P2, P10]
  - **7.05 has no band rail**: the key's stamp is the date, as the script makes it. [P18]
  - **Two art-pass files are edited, because the fixes are in the characters.** `art/cast/humanist.ts`: the nose, a fairness and likeness fix, and the spread hands. `art/cast/xel.ts`: the smile. Neither is imported outside Act One. `art/cast/mas2.ts` (the glass) is left alone because the cold open imports it; the water is recoloured in `f23.ts`. **Move 37 and the key-ring ECU are copied** into `f23.ts` and `tenant.ts`, so the stream's route and the hand on the key are Act One's. [R1 in spirit: copy, don't reach into another segment's cache]

## 5. Weak, or for a human to check

- **Nothing has been watched in motion with its sound.** The marks follow the lock's sounds; the knocks, the crash, the slap, the snuff, the sweeps, the rocket, the clicks and the hops want a look against the mix.
- **The séance wide is small and dark:** an establishing wide at room scale (people 30-50 px), Mas tiny at the head; the faces read in the LOW·DESK, the OTS and the MCUs (most of the scene's time).
- **Nole's MCU** is Ep1's one conversation portrait (a profile, his phone up) in eight shots, varied by three framings, his dips, the jab and the lamp; **4.17's slap** is 5 frames of that portrait before the glass: the slap reads by its effect (the flames jump), not the gesture.
- **4.07's landing** is small at the wide's right edge (the door must stay clear).
- **The OTS foreground** (Mas's or Nole's back of head) is a new procedural drawing, not an approved rig. Since the review it's solid ramps with no checker, and it reads as hair, an ear, a turned cheek and a hood [J].
- **The staffer** is a new sculpted bust (makeBust3); her whisper behind her hand can also read as surprise.
- **The glass ECU's forearm** tapers on the wrist's line with a ribbed cuff (§3b 2); it's still a plain sleeve with no folds [J].
- **4.32's Alyi** is the art pass's warm bust (alyi2) in the cut-paper tier, with eyes drawn over the paper. He reads as a person looking at Mas, with an open smile [J], but the mouth's parted-lips smile is a stamp on a portrait built for talking, and the eyes are 9 px wide: **a human should judge whether the look reads as warm at speed** (P5 [FIRM], the setup for his absence).
- **The day boardroom** is a remap of the night one (a pale sky, warmed walnut, greyed walls), not a lit day plate.
- **Gerg's toast in 4A.05** is a pixel's lift and a look up at room scale: the warm half-second is small.
- **Tasya's glance up (7.04)** isn't on his face (the medium rig has no upward look); 7.07's pan carries it. **7.03's single** is his approved portrait at its own size (no scaled sprite): a bust in the right half of the frame, the left half the basement's wall, with lead room toward the Humanist.
- **The Humanist's redraw** (§3b 9) needs **the guardrails reviewer's look** (the review's ask; this pass had no reviewer to send it to). Its open palms are small stamps at bust scale.
- **7.05's hand** is the insert-hands renderer's pinch at the ring's scale; it's on screen about 1.4 s, so the twist wants a look at speed.
- **F2.3's swivel** is a 26-px sprite flipped with its chair and its reaching arm. It reads in stills at 2x [J]; at speed the scattered order should read as one by one.
- **The 4B → 6 match:** the mic icon lands within a pixel of 6.01's capsule (x 240), a few pixels high [M]; the cut has no dissolve.

**Resource asks (R16, non-blocking):** the guardrails reviewer on the Humanist's redraw (7.02-7.06); one human look at Act One with its mix; a Nole medium rig (or a second Nole portrait angle) would let his eight close shots vary their angle as well as their framing; a down-the-table boardroom plate at room scale (Ep1's boardroom-head is medium scale) would make the OTS a set rather than a construction.

## 6. Re-running

From the repo root; `S` is any scratch folder.
```sh
cd studio
node src/episodes/ep02/pixel/tools/build.mjs act1 $S/r-act1.cjs
node $S/r-act1.cjs check
node $S/r-act1.cjs native $S/stills 60 1650 2900 3700 4250 5100 5900 7600     # native stills of any frames
MRMAS_MAX_LOAD=40 X264_THREADS=1 ../ops/heavy.sh node $S/r-act1.cjs scenes --jobs 2     # -> out/ep02/v1/picture/act1.mp4
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act1.cjs scenecheck --every 8
cd .. && bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py out/ep02/v1/picture/act1.mp4
```
The contact sheet is 62 frames decoded from the MP4 (PyAV, `audio/.venv-casting`) and labelled with PIL: one per shot, mostly its middle frame, its turn where the middle isn't (4.01 k45, 4.02 k10, 4.10 k100, 4.12 k80, 4.19 k90, 4.22 k250, 4.27 k30, 4.33 k50, 4.35 k20, 4.36 k8, 4A.02 k100, 4A.04 k70, 4B.01 k100, 6.02 k60, 7.01 k120, 7.05 k110, 7.07 k100, among others). Since the review it's regenerated on the same frames, except 7.05 at k13 (the hand on the key), and 7.03 is labelled MCU.

## 7. Rules checked

P1 (pixel first, 1080p), P2 (LOW·DESK, OTS, MCU and the tightened meter frame carry most of the act's time; wides establish), P3 (arrivals: sc 4 2.5 s before the click, 4A 2.6 s, 4B 1.0 s and sc 6 1.4 s as the lock's agreed heads, sc 7 1.5 s on the voice; aftermaths: the dark after the last candle 1.9 s, the clicks and the glance, the card settling 1.9 s, the off-record exchange and the curtain, 1.5 s on Mas then black), P5 (the full-size look, §3), P6 (no cursor: a finger on Publish and on Accept; the planchette is a planchette), P7 (the post, the byline, the chair, the glass, the plates, the ghosts' words, the stone's label, the nameplates, the invite, the counter, the plinth, the key all read at 1080p), P8/P14 (no video model; Alyi only as an author in 2024 and a person, warm, cropped by his monitor in 2018; no image of him in any surface), P9 (every speaker on screen and lip-synced, or the voice established: Gerg off frame in 4.08/4.18, Terb over 4A.02, Tasya off in 7.05/7.07, the staffer behind her hand), P10 (face lights on Mas's MCUs and the meter), P11 (passes 2.G, T3, 2.D only, each motivated), P15 (flash 0/s, no red; must-read text held: the post 2.0 s, the plate 4.6 s, ghost 1's words 4.0 s, OPEN 1.9 s, NOPE 2.8 s, the cow's caption 4.2 s and reply 2.6 s, `NOLE · JUST NOW` 2.3 s, the 0% sentence 6.6 s, `MOVE 37` 1.8 s, the nameplates ≥ 1.2 s, the invite 7.3 s, the card 2.6 s, the plinth 2.9 s, `MAR 19` 4.0 s), P17 (no scaffolding), P18 (the rail clears before V.O. 1; no V.O. under a rail or a toast), W8 (no V.O. at the review; nothing on Mas's face at the finding; Mada does nothing), R1 (Ep1 imported only: rooms/boardroom, rooms/twoshots, cast nole/mas/mas-cu/mas-medium/mas-seated/gerg/gerg-stand/terb/terb-sheet/mada/mada-medium/tasya-medium/tasya-speak/orb-medium/civic-extras, act2/kit2's freeze and card, act1/art arena; nothing under Ep1 edited; no art-pass file edited), R10 (every render, still, decode, typecheck and check through `ops/heavy.sh`, one at a time), R11 (keyscan before the commit and the push), R13 (this note), R14 (scratch in this session's scratchpad). Broken on purpose: the framings and staging in §4 (GUIDE).

**After the picture review [J unless marked]:** P5 (arms from shoulders with elbows: the staffers' joined hands, Gerg's arm, the glass's forearm, the three hands, Nole's arm in 4.34, Tasya's on the key; a warm face reads warm: Alyi's open eyes, XEL's gentle smile, Tasya keyed; the frame: 4.25's header clear, 4.12's hands in frame), P6 (no cursor: the handover is a hand), P7 (the glass reads as water at 1080p; the three hands, the key, the paw, the knob wall's two kinds of board, `Accepted`), P10 (Tasya's face light, 4.34's candle key), W13 (the cause before the result: F2.3's monitors are in the room before anyone turns to them; Mas blows the candle out, at his lips; the key leaves in a hand and the spare grows after), GR §5 and the Humanist's file (no exaggerated nose; his own features carry him; for the guardrails reviewer). Measured: `check` 62 layouts, 0 stand-ins, 0 problems; a scoped `tsc --noEmit` over `act1/` (128 files) 0 errors [M].

## 8. Files

- `studio/src/episodes/ep02/pixel/act1/scenes/sc-4.ts`, `sc-4a.ts`, `sc-4b.ts`, `sc-6.ts`, `sc-7.ts`: the 62 layouts.
- `studio/src/episodes/ep02/pixel/act1/sets/seance.ts` (sc 4: the room, the ghosts in the wide, the desk POV, the publish ECU, LOW·DESK, the board from above, the OTS, Nole's MCU, Gerg and the staffer and her bust, the 2S of the two Noles, the glass, the reverse, the last candle), `f23.ts` (F2.3, the cut-paper sweep), `board.ts` (4A, 4B), `studio.ts` (sc 6), `tenant.ts` (sc 7), `figures.ts` (the back of a head), `common.ts` (helpers).
- Since the picture review: `act1/sets/f23.ts` also has `move37` (the art's, copied: the stream's route and the self-play boards), `alyiLook`/`alyiEyes` and `waterGlass`; `act1/sets/tenant.ts` has `ringECU`/`keys` (the kit's key-ring ECU, copied: the handover) and `tasyaMCU`; `act1/sets/seance.ts` has `noleFore` (the table, the candles and the desk lamp in front of Nole) and `ghostHeaderAt`; `art/cast/humanist.ts` (the nose, the brow, the `spread` arm) and `art/cast/xel.ts` (the smile) are edited.
- `out/ep02/v1/picture/act1.mp4` (git-ignored), `act1-sheet.png` (regenerated after the fixes); the cache `out/ep02/v1/scenes/act1/`.
