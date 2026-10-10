# Ep2 v1: Act Four's picture (sc 18, 19, 20, 22, "one door")

> **Status: built, rendered and looked at, 2026-10-09/10, by Act Four's picture pass.** Four scene modules in `studio/src/episodes/ep02/pixel/act4/scenes/` draw all 57 shots of the v1 EL lock (7,656 f, 5:19.00), with the act's own drawings in `act4/sets/` (one file per place: `light.ts` the lighthouse, `board.ts` the boardroom, `lobby.ts` the watch party and the lobby's morning, `campus.ts` ELPPA's lawn, `f21.ts` the 2008 stage, `zai.ts` the zAI lobby, `dark.ts` his dark room, `iss.ts` the pixel half of the ISS leap, `band.ts` the adventure band, plus `common.ts` and `backhead.ts`, copies of Act Three's). Sc 22 is the **2.H leap, real 3D**: the art pass's seven Blender plates plus 37 made here (`act4/tools/iss22.py`), spliced under the pixel figures by the pipeline's overlay (`act4/tools/iss22-insert.ts`). The picture is `out/ep02/v1/picture/act4.mp4` (silent; the act has no mix yet: the lock's `mix` is empty), the per-scene cache `out/ep02/v1/scenes/act4/`, the contact sheet `out/ep02/v1/picture/act4-sheet.png` (one labelled frame per shot, decoded from the MP4).
>
> **The review pass, 2026-10-10:** the picture review's 21 findings (9 major, 12 minor) answered in all four scene modules, all 21 fixed (§3, "The review pass"); sc 18, 19, 20 and 22 re-rendered (the sc 22 overlays re-made), every fixed frame looked at full size from the MP4, the sheet re-made. Its checks [M]: `check` 57 layouts, 0 stand-ins, 0 problems; `scenecheck --every 8` 1,050 frames, 0 differ; flash (`flash_seg.py`) 0 flashes in any second, 0 red, 39 transitions, pass, the largest luminance step now 0.296 at f2895 (19.05's cut to the stream); 22.01's opening white now 0.788 mean and max luma (was 0.923 / 0.933); scoped `tsc --noEmit` 0 errors; renders through `ops/heavy.sh` (`MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`, `X264_THREADS=1`, two workers) 18: 91 s, 19: 100 s, 20: 34 s, 22: 44 s; cache keys `sc-18-4c17842c744132eb`, `sc-19-fdb1c8eead2114f1`, `sc-20-1ac0e95aa472fe70`, `sc-22-38e6ac27f932a3f5`; `act4.mp4` md5 `0bcbb9ac…`; the cache pruned. The figures below this line describe the first pass where the review pass didn't change them.
>
> **Checks [M] (the first pass):** `check`: 57 layouts, 0 stand-ins, 0 problems (every mark resolved on the lock's sounds, words and texts). `scenecheck --every 8`: 1,050 frames, 0 differ (no layout reads `sh.s` as a clock). Flash check (`flash_seg.py`): at most **0** flashes in any second, **0** red, 36 transitions, pass; the largest luminance step 0.561 at f6744 (20.13's dark phone → 22.01's white, the planned hard cut, one step, not a flash). The lock check: `lock.py --seg act4` re-run into scratch on the same EL timeline and takes: 8 checks ok, its `data.ts` and `lock/act4.json` **byte-identical** to the committed ones (it exits 1 under `--strict` only for the speaker-label note the lock QA already recorded: `staffer` vs the take's TILED EMPLOYEE, e2-a4-0023; lock-v1.md §checks). Overlays: 912 frames of sc 22 overlaid, 0 missing files, 0 refused. Scoped `tsc --noEmit` over `act4/shots.ts` and its imports: 0 errors (before each render). Renders through `ops/heavy.sh` (`MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`, `X264_THREADS=1`, two workers): first pass 18: 89 s, 19: 99 s, 20: 36 s, 22: 43 s; then 22 alone (41 s) after the unfold and the knock, then 18, 19, 20 (111 s, 113 s, 25 s) after the fixes, 22 from the cache. Cache keys: `sc-18-3148336ce42776db`, `sc-19-6750295d6ff5b3dc`, `sc-20-e6b61c1b027baebe`, `sc-22-07a458c7531edb7c`; `act4.mp4` md5 `f063afa1…`; the cache pruned (current and previous index kept). The Blender plates: 37 at 1920 x 812, EEVEE, 32 samples, about 13 minutes through `heavy.sh`.
>
> **What was looked at [J]:** every drawing as native stills while it was built (about 260, tiled at half 1080p, with 4x crops of faces, hands, text and the leap's figures), the 3D plates at 1080p, then **every shot's start, turn and end frame decoded from the rendered MP4 at 1080p** (171 frames, three shots to a sheet, with full-size crops of the faces and hands that looked off), each fix again as stills and then from the re-rendered MP4 (f769, 2534, 3088, 5890, 5958, 5995, 7180, 7494), and the contact sheet. Nothing was watched in real time or heard with a mix.

**Contents:** [1. The shots](#1-the-shots) · [2. Passes and leaps](#2-passes-and-leaps) · [3. Fixed after looking](#3-fixed-after-looking) · [4. Where this departs from the plan, and why](#4-where-this-departs-from-the-plan-and-why) · [5. Weak, or for a human to check](#5-weak-or-for-a-human-to-check) · [6. Re-running](#6-re-running) · [7. Rules checked](#7-rules-checked) · [8. Files](#8-files)

---

## 1. The shots

Frames are act frames (the lock's); `k` is the shot's own frame (the layouts' `f` is the frame inside the scene; `scenecheck` passes). Marks are the lock's sounds, words and texts (each layout's `marks`), a planned frame as the fallback. Lip-sync: `lip` = the drawn viseme track on a portrait or bust; `room` = the room-scale flap. 35 of the act's 38 lines move a mouth; the three V.O. lines (11, 12, 13) are typed by the host's shared voLine in his cyan over his still face, never over a rail or a toast. No pointer anywhere: fingertips and thumbs on glass and paper.

### Sc 18 · The quiet vote (15 shots, 2,280 f; MAY 28, 2024)

The art's lighthouse of stacked essays (rooms/lighthouse, art/sets/committee `lighthouse18`) and Act One's boardroom on its morning camera (copied), re-dressed: the SAFETY AND SECURITY COMMITTEE banner, the TV on the back wall, the seat plates (MAS MANALT at A). The split screen (two 238-px panes, a 4-px divider, the waiting pane one palette rung down) carries the vote against the lighthouse.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 18.01 | 0-137 | WIDE | **ARRIVE** on the lighthouse, the beacon turning: EKIEL climbs the stair of bound drafts with sc 14's box, one step per footstep (steps 9-11); ADELINA at the top (step 14) raises her lanyard, its card printed on page 212; MARIO at his desk; rail MAY 28, 2024 | `footstep_soft_1/2`; her raise at the second |
| 18.02 | 138-185 | WIDE | The beam sweeps to the frame's edge (k<14), cut to the boardroom by day: the beam's warm band crossing the window; TERB at the head, MAS at A, MADA, the director; the banner over the window; the TV already on the podcast | the sweep k0-13 |
| 18.03 | 186-438 | FULL FRAME | The TV full frame: a plain podcast player (no title, no logo), the waveform walking with her level; NELEH's words captioned large, word by word from the take; the second sentence builds under the first | each word on its take time |
| 18.04 | 439-581 | FULL FRAME | Her second claim captioned as she says it, cropped before its next clause | — |
| 18.05 | 582-681 | FULL FRAME | Her caption held; under it the board's same-day statement card: "We are disappointed that Ms. NELEH continues to revisit these issues." — TERB, CHAIR (read time 4 s) | the card k-4 |
| 18.06 | 682-771 | MCU → OTS | Mas holding still at the table (Ep1's CU face in the window's day, keyed one step; the hoodie's near arm and seams drawn on it), 1.9 s; over his shoulder onto TERB, the remote in his near hand, the TV's cool spill on his cheek until he clicks it off; then his eyes down to his business, "First item." (lip, brisk mouths: no grin) | `tv_click_off`; his line |
| 18.07 | 772-856 | INSERT → SPLIT | Terb's hand holds the lanyard out by its strap, SAFETY COMMITTEE legible (26 f: its read); his forearm from the frame's lower left, tapering to the cuff; the split: LEFT Terb up at the table's corner, his arm out across it (shoulder, elbow, hand), Mas leaning in to it, his hand on the strap at Terb's fingers, the loop lifted over his head, over his crown, on (the held drawings on 4s and 3s), every face at the table to Terb; RIGHT Adelina drops hers over Ekiel two steps below; both land on the same beat | `lanyard_drop` |
| 18.08 | 857-1156 | SPLIT · LEFT | Terb reading the first task and the roll call, eyes on his sheet (lip, the open mouth dark, no teeth), looking up only on "our chief executive."; RIGHT a rung down: Mario writing, Ekiel in his new lanyard (the 212 card on his chest, clear of the desk) | the word `our` |
| 18.09 | 1157-1204 | SPLIT · LEFT | The table at room scale turns to Mas in two held steps; his MCU (the lanyard's card on his chest): "present." (lip) | his line |
| 18.10 | 1205-1509 | SPLIT · LEFT | Mada's minutes, his pen finishing the first word; Terb, brisk (lip); the table turns again; "also present." (lip); the pen writes the second word; Mas's still face; **V.O. 11** typed, lips still | `pen_scribble_short`; his line |
| 18.11 | 1510-1709 | SPLIT · RIGHT | MARIO at his desk by the lamp, writing without looking up; EKIEL in front of him, squinting; both lip; LEFT a rung down: Mas at the table | Ekiel's line |
| 18.12 | 1710-1892 | ECU INSERT | Mario's four pages fanned, Ekiel's line highlighted: "Building smarter-than-human machines is an inherently dangerous endeavor." (legible); on "inherently" his pen runs the underline (his hand from the lower right, the fleece cuff); his voice O.S., established | the word `inherently` |
| 18.13 | 1893-2131 | SPLIT · RIGHT | The glass case of CLOD boxes, the beacon glinting box by box (the last box's art a red suspension bridge, never named); MARIO, finger rising (lip); the scroll drops down the whole stairwell, the pane panning with it to the bottom and back; EKIEL squinting after it (lip); MARIO sets his pen down for the first time (lip) | `glint_tick` ×3, `scroll_unroll_fall`, the three lines |
| 18.14 | 2132-2198 | SPLIT · RIGHT MCU | Mario, finger up: "It's that we might win." (lip); the clipping by the lamp, byline NELEH & THE QUIET VOTE (an egg, never read out) | — |
| 18.15 | 2199-2279 | SPLIT · LEFT → FULL | His phone face up beside the minutes, dark; it lights: ELPPA / KEYNOTE / JUN 10 on their own lines (sc 8's invite come due), held for its read; the left pane widens to the whole frame in held steps (the lighthouse pushed out); his hand turns the phone face down | `ui_toast_pop`, `phone_turn_over` |

### Sc 19 · The phone's closer (20 shots, 3,216 f; JUN 10, 2024)

The art's lobby (art/sets/lobby2) at the watch party: ELPPA's keynote on the wall screen (art/sets/elppa `keynotePainter`), the staff on their beanbags (art/cast/civic2), GERG on his (the cold open's `gergSitting`, copied), DAYS SINCE 202 and 102, the corner TV on the stuck lectern. ELPPA's campus at noon (`act4/sets/campus.ts`: the lawn, the giant screen, the crowd's backs). F2.1's 2006 corner and 2008 stage in EARLY-WEB16, and the garden fable (art/sets/garden).

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 19.01 | 2280-2389 | WIDE | **ARRIVE** on the lobby at the watch party, 4.6 s: the keynote low on the wall screen, the staff half-listening, Gerg typing, the flyers curling, his upside down among them, the complaint a side table with cups, a mammoth's tusk behind the back row | — |
| 19.02 | 2390-2428 | SCR | The corner TV close, muted (its glyph): the lectern still jammed at FLOOR, the tally 0 BILLS, legible | — |
| 19.03 | 2429-2536 | WIDE | The doors open; HARAS walks in along the hand truck's old path, her calculator tape unspooling from the doors, comes forward of the rows and sits beside Gerg at his depth (in front of the staff, her beanbag cut by the frame's foot); her plate HARAS · FIRST CFO typed on (top right) | `calc_tape_spool`; she sits at spool+66 |
| 19.04 | 2537-2894 | 2S | Gerg (his speaking portrait, his laptop) and Haras (her bust, her tape), both lip; the keynote low behind them; as she asks the real one the screen puts up …AND LATER THIS YEAR: CHATGTP. and the staff behind rise to cheer on "profit" | `stream_announce_roar`, `crowd_cheer`, her line |
| 19.05 | 2895-3007 | SCR → 2S | ON STREAM full frame: the announcement; the lobby erupts, half of it up, the confetti cannon's burst; Haras under the cheer: "Let me reframe that. Upside." (lip), the tape up on "Upside." | `confetti_pop`; the word `Upside` |
| 19.06 | 3008-3168 | SCR → WIDE → MCU | The stream's cutaway to its outdoor crowd (the lawn at 1:1 in the stream's UI): at its edge, small, Mas, head DOWN over his lit phone, thumbs going; the lobby: a staffer stands and points: "Is that Mas?" (room mouth); the laugh; Gerg, the only one not cheering, takes out his phone (his MCU the reverse: the cheering lobby behind him, the screen's light on his face) | his line, `lobby_laugh_s` |
| 19.07 | 3169-3394 | WIDE | **ARRIVE** on ELPPA's lawn, 1.3 s empty of him; Mas comes up to the crowd's edge head down over his lit phone, thumbs going, finishes and sends, then looks up at the stage; his post in its own UI over the sky, verbatim, held for its read | `post_click`; the post's text |
| 19.08 | 3395-3560 | WIDE → MCU | The stream's chat lights with his post; the crowd's phones buzz; his MCU, the reverse: facing the screen (frame-right, off frame), the lawn and the pavilion behind him, the screen's light on his face, his eyes down on the phone low in his hand; **V.O. 12** typed, lips still, over clean lawn | `chat_ping_run`, `phone_wave_buzz`, the V.O. |
| 19.09 | 3561-3729 | MCU ↔ MCU | His phone buzzing (GERG) in his hand, eyes on it; up to his ear on the connect, his eyes back on the stage (the arm bent: upper arm down to the elbow by the frame's foot, the forearm up); Gerg in the cheering lobby, phone at his ear, the same bend (lip); Mas: "the phone's closer." (lip) | `call_ring`, `call_connect`, the lines |
| 19.10 | 3730-4082 | MCU ↔ MCU | The call crosscut on the speakers (both lip); Gerg's last question held; "i was up there once. they let me hold the clicker." | each line's cut |
| 19.11 | 4083-4130 | POV | A push from his face into his phone in three held steps to the stream's stage; a GPS breadcrumb in older colours draws itself across the boards | `render_front_sweep` |
| 19.12 | 4131-4245 | WIDE | EARLY-WEB16, 2006: a street corner, a phone ad: young Mas holds up a flip phone, a pin bobbing over him; the end card "WHERE YOU AT?" with its pin | the card's text |
| 19.13 | 4246-4366 | WIDE | The match on the pin: the 2008 stage's screen, a white TPOOL slide with the pin in the same place; Mas strides out of the wing, THE SLEEVE tosses him the clicker, he catches it, the collars pop | `clicker_catch` |
| 19.14 | 4367-4536 | WIDE | He clicks: TPOOL's map in its own colours, pins everywhere; two grey out on each tick until LAST UPDATED 2012; no cause claimed | `pin_grey_tick` ×4; the text |
| 19.15 | 4537-4624 | ECU · MATCH | The clicker in his 2008 hand becomes his 2024 phone in the same grip, his post still on its screen | the match k40 |
| 19.16 | 4625-4864 | WIDE | The phone's picture opens out in three held steps to the hedge with one gate; MIT KOOC turns a key as tall as he is; the gate swings; CHATGTP on a velvet rope, GUEST on its tail, the rope's end in an attendant's gloved hand inside the gate | `lock_big_turn`, `gate_iron_swing`, `velvet_rope` |
| 19.17 | 4865-5104 | MEDIUM → WIDE | The beds of phone-flowers (each head a phone: bezel, lit screen, notch, home bar): CHATGTP raises a tiny arm out of its side, an open palm, and waits; the flower bows to it (two drawings down, then up); only then a text bubble; IRIS on her bench at 99% | `flower_nod`, `chip_blip_bubble` ×2 |
| 19.18 | 5105-5312 | 2S → MCU | Outside the hedge, on a truck along it: Mas screen-left, phone in hand, then RADNUS already there a few feet along, not burning; his MCU (the roll call's bust, turned to Mas): "Lovely garden. I see they let your chatbot in." (lip); Mas's single, dry: "as a guest." (lip); Radnus's MCU, the polite smile held a beat too long | the lines |
| 19.19 | 5313-5414 | WIDE | The reverse from inside, the line crossed on purpose: the hedge's inside face across the whole frame but the gate; through its bars Mas outside, screen-right; the gate shuts behind CHATGTP; the lock big in the foreground on the latch, turning once | `gate_iron_swing`, `lock_big_turn` |
| 19.20 | 5415-5495 | WIDE | **AFTER** the garden folds back into the phone; on the lawn he pockets it | `phone_into_pocket` |

### Sc 20 · Like this (13 shots, 1,248 f; JUN 10 afternoon, JUN 11, JUN 19)

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 20.01 | 5496-5589 | SPLIT | LEFT the crowd thinning on the lawn, the giant screen's end card; Mas pockets his phone and walks out past it; RIGHT the zAI lobby: KORG 2: NEXT QUARTER, the glass doors with the visitor's silhouette, the new birdcage (its tag, the open padlock), NOLE under his lamp (off), phone up; on the toast his phone lights with Mas's post (a card in its own UI) | `ui_toast_pop` |
| 20.02 | 5590-5771 | SPLIT · RIGHT | His lamp clicks on; his own post goes up in its own UI with its condition, held for its read; LEFT a rung down, the lawn emptying | `lamp_click`; the post |
| 20.03 | 5772-5918 | SPLIT · RIGHT | Nole under his lamp, turned to the visitor, his phone in his hand: "If they go through with it, visitors' phones go in here. Like this." (lip); ECU: his hand sets his phone (lit, on his post) on the cage's floor and withdraws; the door shuts; the padlock snaps | `cage_door_shut`, `padlock_snap` |
| 20.04 | 5919-5997 | SPLIT · RIGHT | Inside the locked cage his phone buzzes, replies stacking (grey bars, nothing legible); Nole looks at the padlock, then at his empty hands (open at the frame's foot, the phone hand gone); the lamp clicks off | `phone_buzz_muffled`, `lamp_click` |
| 20.05 | 5998-6112 | WIDE | **ARRIVE** the divider slides away in held steps, the lobby full frame on JUN 11: the confetti in a pile, two staffers taking the party down; Mas by his pillar with his glass sets it down, peels his own upside-down flyer off, folds it into his jacket | `tape_peel`, `paper_flutter` |
| 20.06 | 6113-6141 | ECU | Inside his jacket's pocket: the folded cream flyer goes in, and his fingers leave it and stop on the yellowed corner of the old note already there (two papers): faded rules, no words; 1.2 s | `cloth_rustle` |
| 20.07 | 6142-6258 | WIDE | HARAS passes, walking, her tape trailing, UPSIDE circled on it, clear of the typed line; Mas at the back; **V.O. 13** typed, lips still | — |
| 20.08 | 6259-6311 | ECU | The complaint, cups' rings on its cover; its docket tab flicked: HEARING · JUN 12 · MOTION TO DISMISS (legible) | `docket_tab_flick` |
| 20.09 | 6312-6407 | WIDE | A rope drops and hooks the complaint; a staffer lifts the cups off just in time; it rises out of frame, a clean rectangle on the carpet (two rungs up, its dust edge); a sticky note flutters down onto it: (FOR NOW); no THUD | `rope_drop`, `rope_haul`, `sticky_flutter` |
| 20.10 | 6408-6575 | ECU | **ARRIVE** a week later, his dark room: his phone face down, first lying where the clean rectangle lay (the same horizontal shape, the same place), then reframed top-down (2 s in all); it lights at its edges; his hand turns it over; TPOOL still open on its map, over it Alyi's post "I am starting a new company:" and its card ISS · "one goal and one product: a safe superintelligence", legible | `phone_buzz_step_1`, `phone_turn_over`, the texts |
| 20.11 | 6576-6613 | ECU | Pushed in on the map (TPOOL's 2008 colours, dimmed for the dark room): Alyi's check-in pin ~100 px with sc 15's warm ripple and its tag ALYI · DEC 2022, the stale 2012 pins grey; the link card falls into frame and its corner strikes the pin's head, knocking it over | `pin_knock` |
| 20.12 | 6614-6709 | MCU → INSERT → MCU | Mas reading, still, his eyes down on the phone below frame (the phone's light on his chin), 2 s; his eyes come up (the decision); his hand takes the folded flyer out of his jacket; he stands, the camera tilting up with him (his head in frame), and goes out right | `cloth_rustle`, `chair_creak` |
| 20.13 | 6710-6743 | ECU | The knocked pin tips off its spot and falls, tumbling, leaving the frame's foot on the cut (the hard cut to white is 22.01, the pin falling on into it at the same size and x) | `pin_fall` |

### Sc 22 · One door (9 shots, 912 f; JUN 19, 2024; the 2.H leap)

Every frame is a 3D plate (Blender EEVEE, the art's scene: the cube, its door, the brass plate, the slot and its sprung flap, the lot, the overcast) with the pixel figures laid over it at 4x, keeping the contrast: no grade match, no pixel rim, no down-rez. Nobody human is in the 3D. No V.O.; nothing offered, nothing comes back; the note stays in his jacket.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 22.01 | 6744-6922 | WHITE → WIDE → CLOSE | **ARRIVE** white (capped at 0.79 luma: P15), room tone only; the pin falls into it at 20.13's size from the top of frame, tumbling on 3s (pixel); the camera tilts down out of the white on 2s (28 plates, the exposure coming down with the tilt) and the white is sky over an empty lot: the white cube, one sealed door; held; close: the brass plate ISS and the mail slot (2.5 s) | `pin_fall`; the tilt k40-94; ISS at its text |
| 22.02 | 6923-7079 | WIDE | Mas walks up from frame-left at his pace (his contact shadow a soft solid ellipse on the lot), never running; arrived, his back to us at the door; THE ORB at his shoulder sweeps its scan down the door's face in held steps, closes its aperture and hangs an empty, dim toast | `footstep_gravel`, `orb_scan_sweep` |
| 22.03 | 7080-7175 | WIDE + BAND | The band lights in held steps for four seconds: Use highlighted, `Use flyer on door`; his pocket CTRL · ESC · PHONE · FLYER (no note) | `ui_band_on`, `ui_band_off` |
| 22.04 | 7176-7285 | MCU · OTS | Over his shoulder: his arm bent (the upper arm out from under his shoulder to the elbow low by the frame's foot, the forearm up to the slot); he unfolds the flyer above the slot (folded, half open, open: held drawings), his, upside down, the tape on its corners, lowers it and pushes it in; the sprung flap swings in (3D: 0, 18, 36, 55 degrees) | `flyer_into_slot`, `mail_flap_lift` |
| 22.05 | 7286-7372 | INSERT | The gap fills the frame (the plate's slot edges, keyed): a room in a desk lamp's warm pool (a shelf of binders, a framed print, his chair), ALYI at the desk bent over the page (his on-model room head, eyes down on the page, a calm closed mouth, a neck into his collar), his writing arm from the shoulder to the elbow on the desk to the pen, the far hand on the page; he never looks up; the flyer falls past just inside and out of frame, unseen | `paper_drop_floor` (off frame) |
| 22.06 | 7373-7401 | ECU | The flap swings shut on its spring (70, 40, 15 degrees, shut, a 4-degree rebound, shut) | `mail_flap_spring_shut` |
| 22.07 | 7402-7463 | MCU | Mas at the shut flap (Ep1's medium rig, his face turned to it, a face light one step under the overcast; the hoodie's near arm and seams on the carry-down) | — |
| 22.08 | 7464-7540 | MEDIUM | The door and Mas in one frame, his back to us as he faces it: his right arm comes up (the elbow out, the fist's back at his head's height just off the door), held two beats (38 f), lowered | the raise k11-54 |
| 22.09 | 7541-7655 | WIDE | **AFTER** he walks away the way he came: his back, smaller and smaller on the lot; the cube unchanged (4.8 s) | `footstep_gravel` ×3 |

## 2. Passes and leaps

**2.H, the white cube (sc 22), real 3D, the second Tier 2 leap.** No video model: the manifest's 2.H is Blender ("the filler may be final"), so no Runway take was made and the key was not read. The art pass's `art/iss/iss_scene.py` is imported only; `act4/tools/iss22.py` is a copy of it (the same deterministic scene) with the cameras the shots need beyond the art's seven: 28 tilt plates (the camera pitched up into the overcast with the exposure pushed until the sky is white, smoothstepped down to the art's `wide` framing and exposure), the plate close (a 24 mm look at the brass plate and the slot), the over-the-shoulder flap at 0/18/36/55 degrees, and the flap shutting at 70/40/15/-4 degrees. `act4/tools/iss22-insert.ts` writes each shot's manifest from the scene module's own plan (`ISS_PLAN` in `sc-22.ts`): per frame the plate (made RGBA; the insert's keyed gap transparent so the layout's pixel room shows through) and the figures' layer (the scene's own pixel drawing at 4x nearest; contact shadows at 30% black); render.ts lays them over the room area, bottom first, as the cold open's 2.A and Ep1's CLOD. Under the overlay each layout draws the same frame in pixels (a flat stand-in for the plate) for the review frame and the browser host.

Passes, all code, each in the manifest: **EARLY-WEB16** (19.12-19.15, TPOOL in 20.10-20.13), the **split screen** (18.07-18.15, 20.01-20.04), **UI LIT** (22.03's band, four seconds), the stream's own UI (19.05, 19.06, 19.11), the garden fable's flat greens (19.16-19.20).

## 3. Fixed after looking

Each was seen in native stills or in frames decoded from the MP4, fixed, and looked at again.

**Sc 18**
1. **Ekiel floated over the CLOD case** (the stair's low steps are hidden behind the desk's clutter): he climbs steps 9-11, Adelina stands on 14 (checked with a stair-index render).
2. **The beam was invisible in the pale window**: a warm dithered band (W7/W8) with a spill; the banner was crossed by a mullion: drawn after the window's mid layer.
3. **The lanyard's "on" state read as a hat or a cup**: the straps either side of his head down to the card on his chest; his arm in its hold.
4. **Mario's finger-0 left a stub**: the mirrored portrait's finger pixels replaced by their neighbours.
5. **Mario's writing hand read as a navy block**: the pen's barrel only, moving.
6. **18.09-18.10 played at table level with nothing to read**: restructured: the table at room scale turning to him, his MCU, Mada's minutes as the insert.
7. **Terb's sheet and remote were too big**: both smaller.
8. **Ekiel's 212 was illegible**: the art's lanyard printed on page 212 hangs on his neck.
9. **A pale sliver over Terb's remote hand (18.06)**: the mirrored portrait's lit shoulder peeked above the fingers like a feather; his far shoulder takes the shirt's shade there.

**Sc 19**
10. **Gerg's portrait ended on a striped frame row**: `common.ts footClean` (a row where one colour holds most of the width and differs from above takes the row above).
11. **19.04's background heads read as balls on a red floor**: a stone wall, a dark floor with the runner, the wall screen on the keynote, soft silhouettes that stand with V arms at the cheer; the laptop smaller.
12. **The stream's crowd was scaled unevenly to full frame**: the lawn at 1:1 with Mas at its edge, the stream's chrome over it.
13. **Mas was on the lawn before his arrival**: he walks in at k30 (19.07).
14. **The art's 2008 stage has no splash slide**: `act4/sets/f21.ts stage08` through draw2008's screen hook (the art file untouched): the white TPOOL slide with the pin where the 2006 card's pin is.
15. **Haras sat on the air over her beanbag (19.03, 19.06)**: the cross-legged drawing's foot is its standing foot, 16 px under the hips; dropped 14 px, her hips sink into the beanbag; her tape's path follows.

**Sc 20**
16. **TPOOL's pin hid under the link card**: the pin lower on the map (80, 150), the card resting just above it.
17. **20.01's left pane missed the end card**: the lawn pane's source moved (x 178); Mas starts at 196.
18. **The pin fell too fast (20.13)**: three pixels a step on 2s.
19. **His rise left a torso block on the frame**: he stands out of the top and walks out right.
20. **The Nole MCU's background banner was huge and a second cage hung in front of him**: the soft background sampled lower; the extra cage removed.
21. **Three hands in "his empty hands" (20.04)**: Nole's portrait has its phone hand drawn in; it comes off (`zai.ts noPhoneHand`: above the tee's shoulder line transparent, the tee carried in below).
22. **The caged phone didn't read through the bars (20.03-20.04)**: a bezel with lit edges, the screen still on his post as it's set down, the glass's glare.

**Sc 22**
23. **22.08's knock was side-on, a fist raised into the air beside the door** (the art's drawing, Mas between the camera and the door): his back to us as he faces it, the near arm raised to knock from behind (`iss.ts drawMasBackKnock`), half-raise drawings either side.
24. **22.07's warm rig put a tungsten rim on him on an overcast lot, and its carry-down drew a "+" on his chest** (the pocket seam and the drawstrings carried down as stripes): the rim's top rungs mapped to the sky's grey; the hoodie cut above the seam and carried down plain.
25. **22.04 skipped "he unfolds the flyer"**: folded (its blank back, the fold), half open, open, lowered to the slot on 4s.

### The review pass (2026-10-10): the picture review's 21 findings

All in the scene modules and Act Four's own set files (copies; no art-pass, Ep1 or shared file edited). Each fixed frame was looked at as a native or 1080p still while it was built, then decoded from the re-rendered MP4 at 1080p (42 frames: 700, 790, 805, 809, 813, 900, 1150, 1600, 2230, 2335, 2510, 2700, 2950, 3020, 3150, 3220, 3530, 3650, 3700, 4800, 4917, 5130, 5200, 5250, 5300, 5330, 6122, 6128, 6250, 6400, 6420, 6590, 6600, 6640, 6700, 6743, 6744, 6756, 7040, 7231, 7300, 7433).

Major
26. **18.07, the handover was a hose and a jump cut**: the insert's forearm rises from the frame's lower left, foreshortened, tapering to a cuff band and a button (common `forearm`, drawn over the cuff's open end); the split is four held drawings: Terb up at the table's corner, his shirtsleeve arm out across it (the room sprite's own forearm clipped off), Mas leaning in to it (`sets/masseat4.ts`, a copy of Ep1's seated rig with the handover's arms and a lean), his hand on the strap, the loop lifted over his head, over his crown (two strap lines, never a box), on, on the drop's beat; every face at the table to Terb (Mada a lid down, the director turned, Mas's eyes down to Terb's hand).
27. **22.05, Alyi at the episode's peak**: redrawn (`sets/iss.ts alyiAtWork`): his on-model room head (Ep1's alyi-speak 3/4 head, copied, mirrored) bowed over the page, the lids low over open eyes, a calm closed mouth, sitting on his collar; a rounded back bent to the desk; the writing arm from the shoulder to the elbow on the desk to the hand and pen (moving on 4s), the far hand on the page; the room a desk lamp's warm pool with a shelf of binders, a framed print and his chair. Small, inside the slot, never looking up.
28. **22.04, the OTS arm was a straight bar**: bent (common `bentArm`): the upper arm out from under his shoulder's curve to the elbow low by the frame's foot, the forearm up to the slot, a fold inside the elbow.
29. **20.11-20.13, the out-transition object was a speck**: a true ECU on the map (`sets/dark.ts mapECU`): the check-in pin ~26 px (about 100 at 1080p) with sc 15's warm ripple and its tag ALYI · DEC 2022, the stale pins grey with their 2012 tags; the link card falls into frame and its corner strikes the pin's head; the pin tips, then falls tumbling (sideways, never upside down) and leaves the frame's foot on the cut; 22.01's pin is the same drawing (`drawCheckPin`) at the same size, entering at x 253 (20.13's exit ~250). The map in TPOOL's own sixteen colours, two of its rungs down (a frame-filling glass in a dark room shouldn't glare: 0.44 mean luma).
30. **22.01, the white broke P15's 80% cap**: the tilt plates' RGBA copies go through a soft knee in `tools/iss22-insert.ts` (luma above 0.70 eases to a 0.79 ceiling, the colour kept; tilt_27 within 0.012 of the art's wide plate); written as `rgba/tilt_NN-c79.png`. The opening white is now 0.788 mean and max (was 0.923 / 0.933); the hard cut keeps its contrast; flash_seg's largest step in the act is now elsewhere (0.296).
31. **19.06-19.10, the staging contradicted the lines**: on the lawn he is head DOWN over his lit phone, thumbs going (`sets/campus.ts drawMasBowed`: the art rig's head tipped forward and lowered, the phone's light on his chin) until the send; his MCU is re-plated as the reverse (`masLawn`: the lawn, the pavilion and the trees behind him, a few late arrivals; his portrait mirrored to face the screen at frame-right, its light on his face), his eyes down on the phone in 19.08 and on the buzz, back on the stage once it's at his ear; Gerg's call MCU is the reverse too (the cheering lobby behind him, no wall screen, the screen's light on his face).
32. **19.18, the title line in one static wide**: a truck along the hedge establishes the 2S in held steps (Radnus already there, `sets/garden.ts outsideTruck`), then his MCU (the roll call's bust, copied from `shared/pixel/cast/rollcall.ts`, flipped to Mas, its polite smile, lip-synced: `radnusMCU`), Mas's dry single for "as a guest." (lip, `masGuest`), and the smile held on Radnus's MCU.
33. **19.19, the walled garden had no wall on Mas's side**: the hedge's inside face runs the frame's width but the gate; Mas only through its bars; the lock big in the foreground on the latch (`drawLockS`, the art's lock redrawn at 1.55x with every measure scaled), turning once.
34. **19.17, the ask-first gag didn't read**: CHATGTP's arm grows out of its side to an open palm (four fingers, a thumb, a palm crease), held while it waits; the flower bows to it (its head rotated forward about the stem's top in two drawings, then back); every flower head is a phone (bezel, lit screen, notch, home bar); in 19.16 the rope's end is in an attendant's gloved hand inside the gate.

Minor
35. 19.09-19.10: both phone arms bent at the elbow (upper arm down from the shoulder, elbow by the frame's foot, forearm up, a fold).
36. 19.04-19.06: the cheering silhouettes' arms are tapered sleeves with mitten hands; Gerg's laptop is in his lap at the frame's foot, the lid tilted to him with its lit edge, his two hands on the keys (a finger lifting per keystroke), the screen's light under his jaw.
37. 18.06 / 18.08: Terb's mouths brisk (`briskTerb`: E speaks as A, the smile rests level, the open mouth's teeth inked dark), his eyes down after the click and on the sheet through the roll call, up only on "our chief executive."
38. 20.06: two papers: the folded cream flyer (its tape strips) goes in, then his fingers stop on the yellowed corner already there (`sets/lobby.ts pocketECU`, a copy of the art's `iouCornerECU` with the flyer).
39. 20.09-20.10: the clean rectangle two rungs up with a dust edge; 20.10 opens on the face-down phone lying where it lay (`faceDownMatch`), then reframes top-down.
40. 20.12: his eyes down on the phone (the lids lowered, the light on his chin), up on the decision; the stand pans up with him (the room drops away, his head kept in frame), then he steps out right.
41. 22.07 / 18.06 (and 18.09-18.14's left pane): the hoodie's near arm (its lit face, the crease at his side) and seams on the carry-down (common `clothLine` / `clothArea`).
42. 19.03-19.06: seated Haras is brought forward of the rows to Gerg's depth (her beanbag cut by the frame's foot), so her size is the foreground's; she walks forward to it in 19.03.
43. V.O. 12 and 13: Mas's MCU stands right of centre, so V.O. 12 types over clean lawn; in 20.07 Haras's walk ends short of the typed line, her tape and UPSIDE behind her.
44. 18.08-18.15: Ekiel's committee lanyard drawn on his bust in the right pane (`light.ts ekielLanyard`: the cord, the card, 212), clear of the desk.
45. 18.15 / 19.01: the toast on its lines without separators (ELPPA / KEYNOTE / JUN 10); the tusk a curved ivory tusk, lit along its top, pointed, rising behind the back row.
46. 22.02-22.03: the Orb's scan a fan sweeping down the door's face in held steps, then the aperture closing and an empty dim toast; every contact shadow a soft solid ellipse (no tick pattern).

## 4. Where this departs from the plan, and why

- **22.01's tilt is 28 held plates on 2s**, not a continuous camera move: every frame of sc 22 is a still plate plus pixels (the leap's grammar since the art pass), and the held steps keep it in the show's held-drawing timing.
- **22.08 from behind** (above, 23): the art's side-on knock read as knocking on air.
- **22.05**: the flyer is seen falling past the gap's edge (the art's room drawing) and lands out of frame; nobody sees it.
- **The DAYS SINCE counters read 202/102 on JUN 10** (the proposal's, arithmetic checked) **and 203/103 on JUN 11** (one day on; the proposal names none for JUN 11). The DAYS SINCE 176 vs V.O. 7 question carried from Act Three stays with the writers.
- **19.04's announcement** is up under its read floor (the lock's decision, kept).
- Act Three's helpers and the art's drawings that needed changes are **copies** in `act4/sets/`; no art-pass or shared file was edited.

## 5. Weak, or for a human to check

- **The review pass's own (2026-10-10):** Mas's head-down on the lawn is the art rig's head sheared and lowered (a room-scale read, not a new drawing); Alyi's face in 22.05 is 16 px (his room head: features of one or two pixels, warm and down, but small, as the slot asks); the 18.07 handover's held drawings are 3-5 frames each (Terb stands for it and the next table wide has him seated again, after 18.08's cut); 20.11's tag ALYI holds 0.8 s (a recognition, not a must-read; the ripple and the red pin carry it); the pin's x moves ~10 native px across the cut into 22.01; Radnus's MCU is the intro roll call's bust (on-model, but its first use in a scene); the bowing flower's rotation is nearest-neighbour (a few jaggies on its second drawing); the call MCUs mirror both portraits (each faces his screen).
- **19.15's match hands** are the art's blocky insert hands (kept: on-model with the hand rig).
- **22.02's walk cycle** steps every 3 frames; the gravel footsteps are spotted at k13/41/68 (the sound pass may re-spot them on the cycle).
- **20.04's open hands** are small against the bust.
- **f6744**: the cut into 22.01's white is now from the dimmed map (0.44) to 0.79 luma; worth a comfort check on a real screen.
- **22.09** ends with him a few pixels tall; the hold on the unchanged cube is the act's out.
- **No mix**: the act has no mix yet (the lock's `mix` is empty); lip-sync was checked against the takes' words in the lock, not heard.
- Nothing was watched in real time.

## 6. Re-running

From the repo root; `S` is any scratch folder.
```sh
# the 2.H plates (Blender, ~13 min) and the overlay layers; both under out/ep02/v1/inserts/iss/ (git-ignored but the manifests)
MRMAS_MAX_LOAD=40 bash ops/heavy.sh ~/Downloads/blender-4.5.3-linux-x64/blender -b --factory-startup \
  --python studio/src/episodes/ep02/pixel/act4/tools/iss22.py -- --out out/ep02/v1/inserts/iss/plates --samples 32
cd studio
node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/act4/tools/iss22-insert.ts $S/iss22.cjs
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/iss22.cjs                    # after any change to sc-22.ts, act4/sets/iss.ts or dark.ts's drawCheckPin
node src/episodes/ep02/pixel/tools/build.mjs act4 $S/r-act4.cjs
node $S/r-act4.cjs check
node $S/r-act4.cjs native $S/stills 69 1007 2534 5995 7231 7502        # native stills of any frames
X264_THREADS=1 MRMAS_MAX_LOAD=40 MRMAS_HEAVY_MEM_MAX=6G ../ops/heavy.sh node $S/r-act4.cjs scenes --jobs 2   # -> out/ep02/v1/picture/act4.mp4
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act4.cjs scenecheck --every 8
cd .. && bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py out/ep02/v1/picture/act4.mp4
python3 studio/src/episodes/ep02/pixel/tools/lock.py --seg act4 --timeline show/reel/ep02-v1-el/ep02-v1-el-act4.json \
  --takes show/episodes/ep02/production/v1/assembly/el-v1/act4-takes.json --ep-in 25200 --label "ACT FOUR" \
  --out-json $S/lock.json --out-ts $S/lock.ts --strict; cmp $S/lock.ts studio/src/episodes/ep02/pixel/act4/data.ts
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py sheet out/ep02/v1/picture/act4.mp4 \
  out/ep02/v1/picture/act4-sheet.png "TITLE" "69|18.01|WIDE" "162|18.02|WIDE" ...
```
The sheet's frames: 69, 162, 400, 560, 640, 760, 840, 1007, 1195, 1357, 1610, 1880, 2012, 2165, 2260 · 2335, 2409, 2534, 2860, 3000, 3088, 3330, 3478, 3645, 3906, 4120, 4188, 4320, 4520, 4610, 4800, 5050, 5209, 5400, 5480 · 5530, 5700, 5845, 5995, 6080, 6127, 6200, 6285, 6400, 6520, 6600, 6680, 6730 · 6880, 7040, 7128, 7231, 7329, 7387, 7433, 7502, 7620. The typecheck: `npx tsc -p <scratch>/tsconfig.act4.json` through `ops/heavy.sh`, a config that extends `studio/tsconfig.json` with `files: [act4/shots.ts]`, `include: []` and the studio's `@types` as `typeRoots`. The scene cache keys include each overlay's manifest and layers, so regenerating sc 22's layers re-renders sc 22 only.

## 7. Rules checked

P1 (pixel first, 1080p), P2 (MCUs and two-shots carry the talk; wides establish), P3 (arrivals: the lighthouse 5.7 s with the boardroom's own 2 s in 18.02; the watch party 4.6 s; the lawn 1.3 s before he walks in; 20.05's lobby morning after the divider; his dark room 2 s face down; sc 22 7.5 s of white, lot and plate before Mas; aftermaths: the phone turned face down, the pocket, the empty hands and the lamp off, (FOR NOW), the pin falling, his back on the lot), P5 (arms from shoulders with elbows: the knock, the lanyard, the OTS arm; faces: Mas still at the table and at the flap, Nole looking at his hands, Haras's focus; crops; text legible: the captions, the card, the highlighted line, the posts, 0 BILLS, LAST UPDATED 2012, the docket, (FOR NOW), the link card, ISS), P6 (no pointer anywhere), P8/P14 (no video model; nobody human in the 3D; Alyi a pixel person seen once through the gap, never looking up), P9 (every speaker's mouth on screen or the voice established: Neleh on the podcast player, Mario O.S. in 18.12), P10 (face lights on Mas: the window's day, the noon light, the morning window, the overcast), P11 (passes and the leap in the manifest), P12 (the leap's contrast kept), P15 (flash 0/s, 0 red; read floors held: the captions, the statement card, the posts, the docket), P17 (no scaffolding: no hedge labels, no disclaimers), P18 (V.O. 11-13 typed by the host's voLine), W8 (no V.O. in sc 22; nothing supplies a reason for Alyi's leaving; the note never read, never in his colour, never offered), R1 (Ep1 and the art pass imported only; copies in `act4/sets/` and `act4/tools/`; no shared file edited), R10 (every render, decode, Blender run, check and typecheck through `ops/heavy.sh`, one at a time; `MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`), R11 (keyscan before the commit and the push), R13 (this note), R14 (scratch in this session's scratchpad).

## 8. Files

**New:** `studio/src/episodes/ep02/pixel/act4/sets/{common,backhead,board,light,lobby,campus,f21,zai,dark,iss,band}.ts` (and, in the review pass, `masseat4.ts`, a copy of Ep1's seated rig with the handover's arms, and `garden.ts`, a copy of the art's garden with the fixes and the 19.18 coverage); `studio/src/episodes/ep02/pixel/act4/tools/{iss22.py,iss22-insert.ts}`; `out/ep02/v1/inserts/iss/22.0{1..9}/manifest.json` and `out/ep02/v1/inserts/iss/plates/anchors.json` (the plates, RGBA copies and figure layers are git-ignored and rebuilt by §6); `out/ep02/v1/picture/act4-sheet.png`; this file.
**Filled (the stubs):** `studio/src/episodes/ep02/pixel/act4/scenes/sc-{18,19,20,22}.ts`.
**Ignored (one rule added to `.gitignore`, as the cold open's 2.A):** `out/ep02/v1/inserts/iss/plates/*.png`, `out/ep02/v1/inserts/iss/rgba/` (since the review pass the tilt plates' copies are `rgba/tilt_NN-c79.png`, the capped white), `out/ep02/v1/inserts/iss/*/fig-*.png`.
