# Ep2 v1: Act Three's picture (sc 13, 14, 15, 17, "leave them up")

> **Status: built, rendered and looked at, 2026-10-09, by Act Three's picture pass.** Four scene modules in `studio/src/episodes/ep02/pixel/act3/scenes/` draw all 58 shots of the v1 EL lock (7,680 f, 5:20.00), with the act's own drawings in `act3/sets/` (one file per place: `lobby.ts` sc 13, `floor.ts` and `band.ts` sc 14, `office.ts` and `f22.ts` sc 15, `bridge.ts` sc 17, plus `common.ts` and `backhead.ts`, copies of Act Two's). The picture is `out/ep02/v1/picture/act3.mp4` (silent; the mix is the sound pass's), the per-scene cache `out/ep02/v1/scenes/act3/`, the contact sheet `out/ep02/v1/picture/act3-sheet.png` (one labelled frame per shot, decoded from the MP4).
>
> **Checks [M]:** `check`: 58 layouts, 0 stand-ins, 0 problems, 12 GLYPH frames (15.09). `scenecheck --every 8`: 1,059 frames, 0 differ. Flash check (`flash_seg.py`): at most **1** flash in any second (f5977, the 17.10 → 17.11 cut from the dark draft to the cream receipt under his shoes), **0** red, pass; the largest luminance step 0.345 (f5979). The lock check: `lock.py --seg act3` re-run into scratch on the same EL timeline and takes: 8 checks ok, 0 failed, and its `data.ts` and `lock/act3.json` are **byte-identical** to the committed ones (the picture draws the lock as it stands; no timing changed). GLYPH (`glyphs`): the browser host's plain frames equal Node's, the 12 GLYPH frames equal Node's outside the room area; 12 spliced, 0 missing. Scoped `tsc --noEmit` over `act3/shots.ts` and its imports (153 files): 0 errors (one found and fixed: a staffer's eye shape, §3). Renders through `ops/heavy.sh` (`MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`, two workers): first pass 13: 8 s, 14: 14 s, 15: 111 s (the party's bloom and the GLYPH splice), 17: 37 s; the last fixes re-rendered only the changed scenes (the cache). Cache keys: `sc-13-15be5a91c5ccc69e`, `sc-14-da1b0f1bf542fb54`, `sc-15-2e0c44f17a02eadd`, `sc-17-e9f40fb839fb9334`; `act3.mp4` md5 `db62a6d7…`.
>
> **What was looked at [J]:** every new drawing as native stills while it was built (about 170, tiled at half 1080p, with 4x crops of faces, hands and text), then **every shot's start, turn and end frame decoded from the rendered MP4 at 1080p** (174 frames, viewed as 3 x 2 sheets with 1080p crops of the faces and hands), the 12 GLYPH frames, and each fix again from the re-render (f120, 2105, 3514, 4442, 4745, 4790, 4880 and the sheet). Nothing was watched in real time or heard with its mix (R8).

**Contents:** [1. The shots](#1-the-shots) · [2. Passes and leaps](#2-passes-and-leaps) · [3. Fixed after looking](#3-fixed-after-looking) · [4. Where this departs from the plan, and why](#4-where-this-departs-from-the-plan-and-why) · [5. Weak, or for a human to check](#5-weak-or-for-a-human-to-check) · [6. Re-running](#6-re-running) · [7. Rules checked](#7-rules-checked) · [8. Files](#8-files)

---

## 1. The shots

Frames are act frames (the lock's); `k` is the shot's own frame (the layouts' `f` is the frame inside the scene; no layout reads `sh.s` as a clock: `scenecheck` passes). Marks are the lock's sounds, words and texts (each layout's `marks`), a planned frame as the fallback. Lip-sync: `lip` = the drawn viseme track on a portrait or bust; `room` = the room-scale flap. No V.O. line moves a mouth: V.O. 7 over his face in the evening (lips still), V.O. 8 over his thumb on the pin, V.O. 9 over his still face on the bridge, V.O. 10 over his thumb hovering at Post, all typed by the host's shared voLine. No pointer anywhere: fingertips and thumbs on glass, his phone's strip (P6).

### Sc 13 · Leave them up (6 shots, 744 f)

The art's lobby master (art/sets/lobby2: February's flyers curling on the rack pillars, the complaint a side table with cups, DAYS SINCE 176 and 76: the cold open's 100 and 0 plus the 76 days since, the corner TV's presser). New here: the two STAFFERS as sculpted busts and room figures (A: a woman, a bun, a mustard cardigan; B: a man, curly hair, a dusty blue hoodie; nobody named, nobody real), the pillar close with its LED rows, the lobby out of focus in its own materials, the floor from above, the presser re-staged.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 13.01 | 0-204 | OTS-W | **ARRIVE** 2.4 s before the first line: over the back of Mas's head (Act Two's turned-away bust, copied) onto the staffers at their pillar, close: A pinches the curled corner of her flyer and peels it in held steps (her arm from the shoulder, the elbow out); B's hand flat on his, smoothing the tape (two held drawings); both lip-synced; B's eyes turn to her on her question | B's line k144 |
| 13.02 | 205-309 | OTS-W → MCU | A turns to Mas, the corner still pinched in her fingers, a worried brow: "He posted, though. Do we take these down now?" (lip); MCU Mas (his approved portrait in the lobby's daylight, keyed one step from the doors) facing them: "leave them up." (lip) | his line k76 (the cut k70) |
| 13.03 | 310-462 | ECU → MCU → ECU | From above: a fallen flyer flutters onto the stone floor by the red runner and settles; his hand comes down and pinches its corner, lifts it out; MCU: Mas at his pillar side on, the flyer pressed to the steel upside down under his hand (his arm from the shoulder, the elbow low), his thumb running the tape along its top; ECU: his flyer upside down on the pillar, a beat (the doorway in its photo, nobody in it) | `paper_flutter` k9, `tape_pull` k57 |
| 13.04 | 463-568 | SCR → FULL FRAME | The lobby TV framed close (its bezel, the lobby soft beyond), the presser on it; pushed to full frame at k16: REMUHCS and three colleagues, the bill-shaped lectern ROADMAP · $32B/YR with nine FORUM stickers carried by two aides to a narrow door marked FLOOR: it bumps the frame face on, they turn it sideways, it bumps again; REMUHCS · MAJORITY LEADER and the lower third BIPARTISAN SENATE AI ROADMAP | `lectern_bump` k52, k81 |
| 13.05 | 569-665 | SCR | The reporter's question from off camera (no senator speaks); the aides set it face on again; an aide's hand slaps a tenth FORUM sticker on, crooked | `sticker_slap_tv` k72 |
| 13.06 | 666-743 | WIDE | The master by day: Mas walks off the near floor frame-right past the staffers at their pillar (their heads after him); as he crosses the edge the adventure band lights in the band's rows in three held steps | `ui_band_on` k52 |

### Sc 14 · The open floor (12 shots, 1,416 f; every frame `full`: the band is the game's)

The art's spread (art/sets/floor openFloor: Ep1's bullpen re-dressed, tiled staff at ordinary desks, the urn, the spoon in a mug, the chiller's puddle, DOT on her ladder, Alyi's door on a centre pin with Ep1's note on its frame, the humming chair). New here: a polished heatsink sculpture on a plinth by the glass (where he sees his own face), the cast in the back aisle (Mas, Bukaj, Ekiel), his replies typed over his head (the classic games' way of talking), the fins close with his phone's strip, the two-shot at the chair, the domino from above, the corridor. The band (`act3/sets/band.ts`, a copy of the art's) carries the verbs (Open greyed and struck throughout), the sentence line on its top row, the strip's chosen line typed in his colour as he says it, and the inventory: his pocket (CTRL · ESC · glass · phone, and once it lands a plain yellowed slip, unlabelled, never his colour).

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 14.01 | 744-810 | WIDE | **ARRIVE** on the spread, the band lit: Mas comes in frame-left along the back aisle (13.06's exit) | — |
| 14.02 | 811-930 | WIDE | He walks to the heatsink and stops; `Look at heatsink` (the sentence line); over his head "i can see my face in it." (his face a warm smudge in the polish); `Pick up reflection`, his hand reaches: "i can't pick that up." | `ui_verb_select` k4, k67 |
| 14.03 | 931-1050 | WIDE → MCU | `Talk to reflection`; the fins close: his own face in the polished metal (his approved portrait mirrored, banded by the fins, cooled to the steel: his, never Alyi's); his phone's strip low in frame, `> where are you going?` · `> can we talk?` · `> come back` greyed and struck (the 1993 Cancel); his thumb goes to the greyed one first and presses: bonk, the chip shakes | `alert_bonk` k96 |
| 14.04 | 1051-1175 | MCU | His thumb presses `can we talk?` (lit); in the fins his reflection mouths it back (a held viseme track, no voice), held | — |
| 14.05 | 1176-1262 | WIDE | DOT (from behind) turns on her ladder and points her screwdriver at Alyi's door; Mas walks to it | — |
| 14.06 | 1263-1362 | WIDE | `Open` greyed; he knocks: bonk (the room jolts a pixel for two frames); the note shakes off the frame and tumbles in held steps into his pocket at the spread's scale; the inventory gains the slip; `Pick up note` | `alert_bonk` k14, `paper_flutter` k28, in the pocket k54 |
| 14.07 | 1363-1481 | WIDE → 2S | BUKAJ comes in with a box of printouts and sits in the humming chair; his plate BUKAJ · NEW CHIEF SCIENTIST · INHERITED THE HUM. typed on (top right); the two-shot: "congratulations." typed in the band as Mas says it (lip) | his line k84 |
| 14.08 | 1482-1699 | 2S | Mas (his portrait in the floor's daylight) and Bukaj (art/cast/bukaj, his hand flat on the chrome armrest, the chair's mesh and hum behind him): "Thank you. It's still warm." (a soft smile), "need anything?" typed as said, "Not yet. I'd like a week in it…" (neutral, soft, exact); both lip | — |
| 14.09 | 1700-1781 | WIDE | EKIEL crosses the back aisle with his box, past ordinary desks; on the hit the 2-TONE FREEZE (Ep1 kit2) with Ekiel kept in colour, the card EKIEL / CO-LED THE SAFETY TEAM. + SQUINT: 100%, one bar; then he walks on | `freeze_hit_F` k14 |
| 14.10 | 1782-1925 | HIGH | The carpet from above: his hand sets his thread's first post down as one domino (the post in its own UI, verbatim, MAY 17; a divider and three pips under it), his shoes walk off; it tips back, lands face up and slides to the toe of Mas's sneaker | `domino_set` k12, `domino_topple_run` k110 |
| 14.11 | 1926-2049 | WIDE → ECU → ECU | Down the corridor: Ekiel's empty desk (the MISC box on it), the safety team's own door with its plate SUPERALIGNMENT / SAFETY TEAM, DOT at it from behind; her orange-cuffed hand backs out four screws, one per beat (art/cast/dot); the plate dropped face up into the MISC box, MAY 17, its screws beside it | `screw_turn_1-4` k24/39/54/69, `plate_drop_box` k93 |
| 14.12 | 2050-2159 | WIDE | **AFTER** back at Alyi's door, the domino at his shoe: `Pivot door`; his hand to it; it turns on its centre pin in held steps, the opening showing Alyi's office in the evening; the chair's hum swells | `door_pivot_creak` k35 |

### Sc 15 · Where u at? (19 shots, 2,400 f; F2.2 in T4 glossy)

The art's office (art/sets/alyioffice: the desk with no chair, the wheel marks, the evening window) with Alyi's door from inside (the same pivoting door), Ep1's seated Mas on the desk's edge, the Orb at his shoulder; his phone in his hand (common cupThumb: the cup grip, the thumb on the glass) with the thread and TPOOL rebuilt at a phone's proportions (EARLY-WEB16 inside the 2024 bezel). F2.2 is the art's party and offsite (art/sets/f22) with Ep1's Alyi in the art's warm states; new here: the chant medium under the swag, the two-shot's run-on, the 2023 two-shot re-lit as two people at a screen, the offsite medium, the GLYPH streams.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 15.01 | 2160-2221 | WIDE | **ARRIVE** on the empty office as the hum stops: the door he pivoted turns shut on its pin behind him (the matched object); Mas on the desk's edge with his phone, the Orb | — |
| 15.02 | 2222-2312 | ECU | His phone in his hand: the thread, Alyi's NOV 20, 2023 post with three hearts (his), Alyi's MAY 14, 2024 post below it, both collapsed to dates and first lines (grey bars); his thumb scrolls it a step | `thumb_scroll` k6 |
| 15.03 | 2313-2484 | MCU | His face in the evening (his approved portrait, the window's dusk keyed one step, its pink on his rim), eyes down; far off, Alyi's voice from launch night (no face: Ep1's line); he looks up toward the window; **V.O. 7** typed, lips still | the line's end +6 |
| 15.04 | 2485-2642 | ECU | His thumb scrolls the home screen in held steps to a tiny old icon, TPOOL · 2012, and taps it; the splash WHERE U AT?; welcome back, mas; the 2008 hourglass turning; the Orb comes in beside the phone and scans it (its fan, held steps): toast `verified: 2008` | `app_splash_2006` k33, `hourglass_cursor_2008` k76, `orb_scan_sweep` k100, `ui_toast_pop` k120 |
| 15.05 | 2643-2820 | ECU | Held from below, the field and the phone's keyboard: his thumb types `where u at?` posed on each key, the key's preview above it; the map in its 2008 colours: every pin LAST SEEN: 2012 but one, its card ALYI CHECKED IN · DEC 2022 · "feel the agi"; its ripple warms and breaks into rings of string-light bulbs spreading past the phone as the room steps down (the door into F2.2) | `pin_ping` k72 |
| 15.06 | 2821-2989 | WIDE → M → WIDE | The holiday party, DEC 2022 (rail): silhouettes under string lights on a slow chase, the racks; closer: ALYI under a low swag (it crops his frame's top), laughing, his hand up: "FEEL THE AGI!" (lip, his eyes crinkled); the wide: every hand up with the chant | his line k43, the crowd k83 |
| 15.07 | 2990-3168 | 2S | Across the crowd: Alyi close under the swag, his raised hand finding Mas, then talking to him, warm (lip); Mas small in the crowd with his glass, not chanting (room mouth) | Alyi's last line k118 (laughing) |
| 15.08 | 3169-3323 | ECU → 2S | His phone held up in his warm hand (art checkInECU): CHECK IN, then `feel the agi` typed; the two-shot: he turns the screen to Mas, laughing, and Mas raises his glass | `check_in_blip` k45; the turn k104, the glass k116 |
| 15.09 | 3324-3407 | WIDE | The party, every hand up; for 12 frames the racks' status lights become token streams running across the room in rows (GLYPH, real tokens by the Remotion host), dense at each head, the rows clear of his face | `glyph_shimmer` k19 |
| 15.10 | 3408-3620 | 2S | **2023** (rail), this office at night: his screen close at frame left, its bezel cropping him; the post in its own UI, INTRODUCING SUPERALIGNMENT · ALYI, EKIEL and its hard sentence (held the whole shot and the next); Ekiel beside him squinting (he blinks); his chair's back behind him; the city's lights in the window; a caret after the byline | — |
| 15.11 | 3621-3750 | 2S | "Nobody knows how to do this yet." (Ekiel, lip) · "Someone should." (Alyi, lip, eyes on the screen) | — |
| 15.12 | 3751-3827 | ECU | His finger above the bare Publish (art publishECU: a real pointing hand, no hover, no cursor) | — |
| 15.13 | 3828-3943 | WIDE → M | The offsite at night: the trees, the staff in silhouette, the UNALIGNED effigy (a paperclip robot of our design); ALYI in the lodge doorway, half cut off by its jamb, the long match struck; closer: Alyi in the doorway, the jamb over his near half, the flame lighting his face, calm | `torch_light` k25 (the medium from k51) |
| 15.14 | 3944-3989 | ECU | He presses it: the button a rung down | `post_click` k9 |
| 15.15 | 3990-4104 | WIDE | The effigy catches: the fire palette-cycled (the shape held, the colours walking), its light on everything | `flame_whoomph` k6 |
| 15.16 | 4105-4214 | WIDE → ECU | The glow shrinks in held steps to one point of light at (240, 100) | — |
| 15.17 | 4215-4330 | ECU | **AFTER** the point is the pin, pulsing at the same frame point on his phone; his thumb goes up the glass and covers it; **V.O. 8**; no IOU, no hand near his pocket | — |
| 15.18 | 4331-4439 | WIDE | He gets up off the desk, pockets the phone and walks out with the Orb; the door turns on its pin and shuts on the empty office; the room holds | `door_close_soft` k70 |
| 15.19 | 4440-4559 | WIDE → ECU → WIDE | The stairwell, Mas going down the treads; the buzz; his phone: `request for comment`, its thumbnail a strip of receipt paper (no outlet, no headline); he reads it without stopping and keeps going down | `phone_buzz_step_1` k28 |

### Sc 17 · The NDA across the bridge (21 shots, 3,120 f; the S3; act-out 2)

The art's bridge (art/sets/bridge: the doors up the hill, the deck in the evening rush, the night, the afternoon, May 20 in rain; the cars; the DRIVER; the voice menu) and the art's Forecaster, blimp and storm cloud. New here: the quick run's three planes with the receipt's print parked for its reads, the pen at a low angle and in the Forecaster's MCU, his phone in his hand on the bridge (the scramble's stack, the call, the grey-bar draft), his face at dusk (the call at his ear), his shoes on the unrolling receipt, the two-shot, the moving cloud, the blimp close.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 17.01 | 4560-4665 | WIDE | **ARRIVE** 4 s on NopeAI's front doors up the hill in the evening, the exit agreement pouring out like a receipt; THE FORECASTER walks up from the street (not out of the building) and stops beside it; rail MAY 17, 2024 | `receipt_printer` k0 |
| 17.02 | 4666-4823 | WIDE | The quick run, three parallax planes (the far city, the towers and cables, the lanes); the receipt across the lanes in the near plane, parked so each line reads to its floor: NON-DISPARAGEMENT and IN PERPETUITY together, then IN PERPETUITY and CLAUSE 9: THIS RECEIPT DOES NOT EXIST., then the clause, then the coupon SAVE 0% ON YOUR NEXT EXIT; traffic slows to a stop | `car_honk_1` k139 |
| 17.03 | 4824-4914 | WIDE | Across the lanes: the Forecaster up the far lane; Mas small in the foreground; the 2-TONE FREEZE with the Forecaster kept, the card THE FORECASTER / EX-NOPEAI. + AT STAKE: ~$2M, the stat in the LEDGER pass for six frames | `freeze_hit_F` k24 |
| 17.04 | 4915-5265 | LOW → MCU → WIDE → MCU | Low at the receipt: a pen on a bank chain rises out of the paper (never from Mas's hand); his MCU (kind, precise, keyed by the low sun), the pen hanging in front of him: "Here's where I am…" (lip); the wide across the lanes for "It says in perpetuity." (room mouth; Mas outside it, small); his MCU: "I don't forecast that far." | `pen_chain_rattle` k9; the wide from "says", back at "don't" |
| 17.05 | 5266-5342 | MEDIUM | The DRIVER in his window, the glass going down, leaning out: "You gonna think it over, or can we move? We're parked on it." (lip, quick) | `car_window_down` k2 |
| 17.06 | 5343-5484 | MCU → WIDE | "Already did. It's the one thing I didn't need a number for." (lip, word for word); the wide: the chain draws the pen back into the paper; Mas's phone comes up lit | `pen_chain_rattle` k90 |
| 17.07 | 5485-5596 | WIDE | Mid-span, Mas has seen it, his phone lit in his hands; it buzzes (a pixel of shake) | `phone_buzz_step_1` k46 |
| 17.08 | 5597-5711 | ECU | **THE SCRAMBLE** in his hand at dusk: each buzz drops one in: the staff's screenshot (NON-DISPARAGEMENT highlighted), the grey LEGAL tile `call me` (an icon, never a face or a name), a second `request for comment`; his thumb flicking fast at the screen's foot | `phone_buzz_step_2-4` k4/38/79 |
| 17.09 | 5712-5868 | ECU → MCU | His thumb on LEGAL; calling…; his face, locked, at dusk, the phone at his ear in his hand: "everyone who signed one. find them. all of them. today." (lip, quick); his face doesn't move | `call_ring` k4, `call_connect` k37 |
| 17.10 | 5869-5978 | ECU | A draft typed (grey bars, no word), deleted, typed; Post lit only while there is something in it | `key_tap_soft_01` k9, `key_delete_run` k43, `key_tap_soft_03` k72 |
| 17.11 | 5979-6088 | ECU → MCU | His sneakers on the receipt, the paper still unrolling under them; his still face; **V.O. 9**, lips still | — |
| 17.12 | 6089-6331 | WIDE → 2S | The Forecaster crosses the stalled lanes toward him between the cars; the two-shot: "I've got a forecast on you. Median: an apology, within the hour, in lowercase." (lip, pleasantly); Mas still | — |
| 17.13 | 6332-6451 | ECU | The draft whole, Post lit; his thumb comes up and hovers by Post, and doesn't press; **V.O. 10** | — |
| 17.14 | 6452-6499 | WIDE | The night, one held wide: the cable's lights cycle once (a palette walk); Mas a silhouette on the receipt; the Forecaster asleep against the far rail | — |
| 17.15 | 6500-6784 | WIDE | The next afternoon (rail MAY 18): his post pops up over the sky in its own UI, one trim per honk, each to its read floor; the Forecaster wakes, stands, crosses out an hour: "Updating." (room mouth) | `post_click` k36, honks k98/124/196/258, `pen_scribble_short` k274 |
| 17.16 | 6785-6925 | MEDIUM → WIDE | The DRIVER: "Excuse me. Does honking count as disparagement?" (lip, worried); the car behind him honks; the wide: the Forecaster walks off frame-right; Mas answers nobody | `car_honk_1` k112 |
| 17.17 | 6926-7165 | WIDE | May 20 (rail), rain: traffic moving, the receipt trodden flat, Mas under a plain umbrella; the `her` blimp drifts in over the bay; the storm cloud with a blank letterhead rolls out of the city and parks over it; one tuned thunder pop (two frames, the sky only) | `thunder_tuned_F` k177 |
| 17.18 | 7166-7333 | WIDE | It rains letterhead (blank sheets); the receipt's ink runs in the rain; far off, the Forecaster's probability-curve umbrella opens (the egg) | `umbrella_pop` k121 |
| 17.19 | 7334-7439 | POV | His rain-beaded phone (art voiceMenu): five live waveforms; his wet thumb taps Pause on VOICE 5; VOICE 5 [PAUSED], its `Hey.` greyed | `ui_pause_tap` k48 |
| 17.20 | 7440-7569 | ECU | Beside the greyed slot, his company's post in its own UI, two fragments, the second a beat after the first (cropped before the voice's name) | `ui_toast_pop` k7, the second at its text |
| 17.21 | 7570-7679 | WIDE | **AFTER** the blimp close under the cloud in the rain: it sags a pixel a light as its running lights click off one by one; the last on the DREAD sting; a beat darker; black from k95 (act-out 2) | `blimp_lights_off` k14/31/48/67 |

## 2. Passes and leaps

Act Three has **no video-model insert and no Tier 2 leap** (manifest §4: 2.A is sc 1, 2.H sc 22), so no Runway take was made and the key was not read. Its passes, all code, each in the manifest:
- **UI LIT** (sc 14; its threshold at 13.06's end): the adventure band through the whole scene.
- **T4 glossy** (F2.2): the art's bloom and specular on the party, the 2023 office and the offsite.
- **GLYPH, 12 frames** (15.09 k19-30): real glyph tokens drawn by the Remotion host over the stream rows and the racks (`STREAMS_MASK`), spliced by the Node renderer from `GLYPH_DIR`; on the room, never in his eyes.
- **EARLY-WEB16** (15.04-15.05, 15.17): TPOOL's own screen inside the 2024 phone.
- **2-TONE FREEZE** cards (14.09, 17.03) and **LEDGER** (six frames on 17.03's stat, the manifest's money pass).

## 3. Fixed after looking

Each was seen in native stills or in frames decoded from the MP4, fixed, and looked at again.

**Sc 13**
1. **The pillar's flyers read as stamps** (scale 3) and A's peel was a smudge: the flyers at scale 4; the peeled corner a lifted triangle showing the paper's back, its shadow on the steel.
2. **A's arm came across her body** to the flyer: from her shoulder out to the elbow and back to the pinch at the corner.
3. **The art's flyer ECU had a figure in its doorway photo** (a silhouette cut by the jamb); the cold open's flyer (1.13) has nobody in it, and nothing near the flyer may read as Alyi: 13.03's flyers are the art's sheet copied with the photo empty (a dark corridor, the door half open on a lit room).
4. **The fallen flyer lay on the floor like a sticker** (the room-scale flyer scaled up in false perspective): the frame-scale sheet laid on the stone from above, settling in held steps; his hand pinches its corner.
5. **The taping MCU's two hands floated** (sleeves crossing his face, a hand pointing at the paper): one near arm from the shoulder down to a low elbow and up to a hand turned flat on the flyer, the thumb running the tape (the hand rig's left-hand pose so the palm lies on the paper).
6. **The presser's door let the lectern through sideways** (the art's door 70 wide, the sideways lectern 18): a narrow 34-px door, the lectern 84 face on and 40 deep sideways, so both tries bump on their sounds; an aide's hand slaps the tenth sticker on.
7. **13.06's staffers stood off their pillar**: at its two sides.

**Sc 14**
8. **His face in the heatsink had no heatsink he could reach** (the art's fins sit low at the frame's right, behind the desks): a polished heatsink sculpture on a plinth by the glass, beside the back aisle; his face a warm smudge in it while he stands there.
9. **The note's fall was lost against the wall**: brighter (the yellowed W8/W9), tumbling in held steps into his pocket.
10. **Bukaj's plate covered Ekiel's ladder corner and the room's top left**: moved to the top right.
11. **The chair's armrest was drawn over Bukaj's hand**: under it.
12. **"Not yet." on Bukaj's `focus` face read stern**: neutral (soft, exact).
13. **The domino read as a sheet of paper**, the setting hand came from below across the post, and Mas's shoe was a grey egg: a divider and three pips under the post; Ekiel's hand grips its right edge from the right (his navy cuff); a sneaker from above (laces, the toe cap, the jeans' hem).
14. **14.12's opening was the art's pale strip**: Alyi's office in the evening (its violet wall, the window's glow, the desk's edge), the next scene's room through the door.

**Sc 15**
15. **The phone ECUs' wrap grip put a thumb shard across the screen's foot and a claw of fingers at its far edge**: every phone in the scene is held from below (common `cupThumb`): the thumb at the glass's foot, on the icon for the tap, up the glass to cover the pin.
16. **The art's TPOOL and thread screens were drawn for a short, wide phone** and squeezed into this one: rebuilt at the phone's own proportions (a status bar; the home screen scrolling in held steps to the tiny old icon; the map's pin where 15.16's point lands; the check-in card in the 7-px face, it was the 3-px `tiny`).
17. **The ripple's break into string lights drew a tangle of wire** across the frame: rings of bulbs on the chase spreading from the pin while the room steps down.
18. **Alyi's busts ended on a black slab** (Ep1's speaking portrait ends on its window's frame rows): `common.ts runOn` repeats the last cloth row (found automatically).
19. **The swag of lights crossed his eyes** in the chant medium: lowered to his brow line.
20. **The 2023 two-shot made both men cyan holograms** (the art's screen light remapped every tone; P8): their own skin, keyed one step from the screen, the cyan only as a rim on the edge toward it, the far side a rung down; his chair's back behind him; the window's city; Ekiel blinks twice.
21. **The offsite's Alyi was 20 px tall** in the doorway (the flame on his face unreadable): 15.13's second half is a medium on him in the doorway, the jamb over his near half, the match's flame on his calm face.
22. **15.19 began with Mas cut by the frame's top**: he starts on the treads.

**Sc 17**
23. **The near lane's cars drove across the receipt's print**: along its far edge, their tyres on the paper.
24. **17.02's lines flew past under their read floors** (CLAUSE 9 had about 40 frames against its 52): the camera parks so the first two lines share the frame, then the second and the clause, then the clause, then the coupon (each to its floor, inside the lock's windows); the clause in the plain face so it fits beside its neighbours.
25. **17.04's low angle had a pair of trousers and a slab** at its right that read as boxes: removed; the pen rises toward him out of frame.
26. **17.08's thumb covered the items as they landed**: it flicks at the screen's foot.
27. **17.03's stat lost its tilde** (the card's face has none: "AT STAKE: $2M"): drawn by hand in its gap.
28. **The storm cloud was grey on a grey sky** and parked from the first frame: its lobes two rungs darker; it rolls out of the city and parks over the blimp.
29. **17.13's hovering thumb landed on Post** (a press): it hovers beside it.
30. **The phone shots on the bridge sat on a flat gradient**: the bridge soft behind.

**Found by `tsc`:** staffer B's eye shape was an unknown name (`'open'`), so his eyes fell to a default: `'almond'` (looked at again at 1080p).

## 4. Where this departs from the plan, and why

- **13.02 cuts to an MCU on Mas** for "leave them up." (the lock: OTS-W): over his shoulder his mouth isn't visible. [FIRM P9]
- **13.03 is three setups** (ECU from above, the MCU taping, the ECU of the flyer; the lock: ECU → MCU): the beat is "his upside-down flyer, a beat". [GUIDE P3]
- **Sc 14's replies are typed over his head** (the classic adventure grammar), the sentence line on the band's top row, and the strip's chosen line in the band in his colour as he says it (the script: "the dialogue box types"). [J]
- **14.03-14.04's thumb** is a plain thumb from below the frame on the strip (the hand rig's thumb pose put the hand over the reflection's face). [J]
- **14.11 is WIDE → ECU → ECU** (the lock: WIDE → ECU): the plate dropping into MISC, MAY 17, reads only close. [FIRM P7]
- **15.06 is WIDE → MEDIUM → WIDE** (the lock: WIDE), **15.08 ECU → 2S**, **15.13 WIDE → MEDIUM**: Alyi's lines and his flame needed his face (warm reads warm). [FIRM P5 feeling, P9]
- **15.07's Mas** has a room-scale mouth (the lock: lip both): he is small in the crowd by the proposal's own staging. [GUIDE]
- **17.04 is LOW → MCU → WIDE → MCU** (the lock: LOW): his long refusal is lip-synced close; the wide across the lanes (Mas outside it, small) holds the middle of it. [FIRM P9; the proposal's "held in a wide" kept for "It says in perpetuity."]
- **17.09, 17.11 open on ECUs** (his thumb on LEGAL; his shoes on the unrolling receipt) before the locked face. [J]
- **17.12 is WIDE → 2S** (the lock: MCU): he crosses the stalled lanes first, then stands beside Mas. [GUIDE]
- **17.02 prints the whole CLAUSE 9 line** (the lock, the script and the proposal), where the art's receipt prints `CLAUSE 9 …` (art.md §7's open ask). [the lock wins]
- **17.21 goes to black at k95** (15 frames before the act's end): the act-out under the DREAD sting's tail and Act Four's J-cut. [J]
- **13.06 lights the adventure band in the band's rows** (the threshold, the lock's `ui_band_on`), so the frame is `full` from there; no rail is up then. [J]

## 5. Weak, or for a human to check

- **Nothing has been watched in motion with its sound.** The marks follow the lock's sounds (the bonks, the screws, the honks, the bumps, the slap, the pings, the lights clicking off); every one wants a look against the mix.
- **The room-scale cast is small** in the spread (sc 14) and on the bridge (sc 17): 80-px figures in wides; faces read in the MCUs and two-shots. The spread is a find-the-man game by design; whether Mas is findable at speed is a human call.
- **The two staffers are new one-off busts** (makeBust3); their faces read [J] but haven't had a lineup review.
- **14.03-14.04's thumb** is a simple shape (a pad and a nail), not the hand rig.
- **15.08's hand** is the art pass's (checkInECU): the fingers round the phone and the thumb over its edge read a little heavy at 1080p.
- **The DRIVER's forearm on the sill** (17.05, 17.16) is the art pass's: a red sleeve along the sill with the hand over the door; it reads as an arm resting, a little like a capsule [J].
- **The typing and resting thumbs** (15.05, 15.17, 17.08-17.13) are an adult thumb at the phone's own scale: large, as Act Two noted.
- **The 2023 two-shot's Alyi** is Ep1's speaking portrait (his look, bald on top); in screen light he reads as a person [J]; a human should confirm he reads as Alyi to a newcomer.
- **17.14's night** is short (2 s) and dark: the cable lights' one cycle is subtle.
- **The thunder pop** (17.17) is two frames of the sky a few rungs up (the flash check counts it as 0 flashes); a human should judge whether it reads as lightning.
- **Resource asks (R16, non-blocking):** one human pass of Act Three with its mix; a medium-scale Mas rig (waist-up, room light) would let the spread and the bridge play closer than 80 px.

**Notes from earlier segments, carried:** Act Two's `backhead.ts` and `common.ts` helpers are copied into `act3/sets/` (copies, so the acts never share a cache key; the tag's OTS can still copy Act Two's). No art-pass file was edited (`act3/sets/band.ts` is a copy of the art's band with the sentence line added). The scene cache was pruned (current and previous index kept); the GLYPH PNGs are in this session's scratchpad (`a3/glyph`) and must be re-run with `glyphs` if 15.09 changes.

## 6. Re-running

From the repo root; `S` is any scratch folder.
```sh
cd studio
node src/episodes/ep02/pixel/tools/build.mjs act3 $S/r-act3.cjs
node $S/r-act3.cjs check
node $S/r-act3.cjs native $S/stills 120 871 2905 3514 4760 7400            # native stills of any frames
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act3.cjs glyphs $S/glyph 2      # the 12 GLYPH frames (Remotion), once per change to 15.09
GLYPH_DIR=$S/glyph X264_THREADS=1 MRMAS_MAX_LOAD=40 MRMAS_HEAVY_MEM_MAX=6G ../ops/heavy.sh node $S/r-act3.cjs scenes --jobs 2   # -> out/ep02/v1/picture/act3.mp4
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act3.cjs scenecheck --every 8
cd .. && bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py out/ep02/v1/picture/act3.mp4
# the lock check: re-derive into scratch and compare
python3 studio/src/episodes/ep02/pixel/tools/lock.py --seg act3 --timeline show/reel/ep02-v1-el/ep02-v1-el-act3.json \
  --takes show/episodes/ep02/production/v1/assembly/el-v1/act3-takes.json --ep-in 17520 --label "ACT THREE" \
  --out-json $S/lock.json --out-ts $S/lock.ts --strict && cmp $S/lock.ts studio/src/episodes/ep02/pixel/act3/data.ts
# the contact sheet (one frame per shot: the list below), or 1080p frames for a look
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py sheet out/ep02/v1/picture/act3.mp4 \
  out/ep02/v1/picture/act3-sheet.png "TITLE" "120|13.01|OTS-WIDE" "290|13.02|OTS-WIDE" ...
```
The sheet's frames: 120, 290, 380, 520, 645, 700 · 790, 871, 1023, 1111, 1246, 1303, 1422, 1632, 1741, 1854, 1988, 2105 · 2200, 2267, 2420, 2620, 2732, 2905, 3079, 3200, 3348, 3514, 3700, 3789, 3900, 3980, 4047, 4130, 4300, 4385, 4500 · 4620, 4760, 4880, 5090, 5304, 5414, 5541, 5654, 5790, 5976, 6034, 6210, 6420, 6476, 6642, 6855, 7150, 7331, 7400, 7505, 7625.

## 7. Rules checked

P1 (pixel first, 1080p), P2 (the MCUs, two-shots and ECUs carry the talk; wides establish and carry the spread and the bridge), P3 (arrivals: sc 13 2.4 s on the staffers before the first line, sc 14 2.8 s on the spread, sc 15 2.6 s on the empty office (the door shutting, the hum stopping), sc 17 4.4 s on the doors; aftermaths: the upside-down flyer and the presser's own beat, the plate in the box and the pivot, his thumb on the pin and the empty room after the door, the grey slot and the blimp's lights), P5 (§3: arms from shoulders with elbows (13.01 A, 13.03, 17.09), faces reading warm (Alyi crinkled at the party, calm with the flame, Bukaj soft), crops, text), P6 (no pointer anywhere: thumbs and fingertips on glass, his phone's strip in sc 14, the bare Publish with a finger), P7 (the flyers, FLOOR, the plate, ROADMAP · $32B/YR, the FORUM stickers, the band's verbs, the strip, the plate in the box, MAY 17, the thread's dates and hearts, TPOOL's screens, the post's sentence, the receipt's lines, LEGAL, the posts all read at 1080p), P8/P14 (no video model; Alyi a person throughout, never in a present-day surface: the heatsink and the fins show only Mas), P9 (every speaker's mouth on screen or the voice established: the reporter on the TV, Alyi's Ep1 line far off), P10 (face lights on Mas's MCUs: the lobby's daylight, the evening window, the low sun on the bridge), P11 (passes UI LIT, T4, GLYPH, EARLY-WEB16, the freeze and LEDGER, each in the manifest), P15 (flash 1/s max, 0 red; read floors: the speech lines, the plate (2.8 s for 49 characters), the domino's post (floor 4.9 s, held 6 s), the Superalignment sentence (held 8.9 s + 5.4 s), the receipt's lines (§3 24), the apology's trims, the pause's fragments), P17 (no scaffolding), P18 (V.O. 7-10 typed by the host's voLine with the voice, never over a rail or a toast), W8 (no V.O. at the refusal, over the draft, at the posts or the pause; nothing in F2.2 or after it supplies a reason for Alyi's leaving; the note never held for reading, never in his colour; the papers start at NopeAI's doors), GR §6 (the GLYPH on the room, never in his eyes; the offsite calm, no iconography; DOT from behind only; the letterhead blank), R1 (Ep1 and the art pass imported only; Act Two's helpers copied; no shared file edited), R10 (every render, decode, GLYPH run, check and typecheck through `ops/heavy.sh`, one at a time; `MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`), R11 (keyscan before the commit and the push), R13 (this note), R14 (scratch in this session's scratchpad). Broken on purpose: the framings in §4 (GUIDE).

## 8. Files

**New:** `studio/src/episodes/ep02/pixel/act3/sets/{common,backhead,lobby,band,floor,office,f22,bridge}.ts`; `out/ep02/v1/picture/act3-sheet.png`; this file.
**Filled (the stubs):** `studio/src/episodes/ep02/pixel/act3/scenes/sc-{13,14,15,17}.ts`.
**Generated, not committed:** `out/ep02/v1/picture/act3.mp4` (git-ignored) with its `.srt` and `.render.json`, and the scene cache `out/ep02/v1/scenes/act3/`.
