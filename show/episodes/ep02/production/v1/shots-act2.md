# Ep2 v1: Act Two's picture (sc 8, 9, 10, 11, 12, "her")

> **Status: built, rendered and looked at, 2026-10-09, by Act Two's picture pass.** Five scene modules in `studio/src/episodes/ep02/pixel/act2/scenes/` draw all 44 shots of the v1 EL lock (6,696 f, 4:39.00), with the act's own drawings in `act2/sets/` (one file per place: `dark.ts` the dark room, `wings.ts` the wings, `plan.ts` THE PLAN, `stage.ts` the stage from the house, plus `common.ts`). The picture is `out/ep02/v1/picture/act2.mp4` (silent; the mix is the sound pass's), the per-scene cache `out/ep02/v1/scenes/act2/`, the contact sheet `out/ep02/v1/picture/act2-sheet.png` (one labelled frame per shot, decoded from the MP4).
>
> **Checks [M]:** `check`: 44 layouts, 0 stand-ins, 0 problems, 5 GLYPH frames. `scenecheck --every 8`: 908 frames, 0 differ. Flash check (`flash_seg.py`): at most **1** flash in any second (at f4976, the ENDED tone's house-lights step), **0** red, pass; the largest luminance step is the 11.08 → 11.09 cut (bright screen to Rima in the half-dark, 0.278, one step). The lock check: `lock.py --seg act2` re-run into scratch on the same EL timeline and takes: 8 checks, **0 failed**, 0 problems, and its `data.ts` is **byte-identical** to the committed one (the picture draws the lock as it stands). GLYPH (`glyphs`): the browser host's plain frames equal Node's (pic and review), the 5 GLYPH frames equal Node's outside the room area; 5 spliced, 0 off. A scoped `tsc --noEmit` over `act2/` (291 files with their imports): 0 errors. Renders through `ops/heavy.sh` (`MRMAS_MAX_LOAD=40`, two workers, under another project's load): the second full pass 8: 32 s, 9: 40 s, 10: 40 s, 11: 87 s, 12: 60 s; a last type-only edit re-rendered sc 11 to the same bytes (`cmp`). Cache keys: `sc-8-96f6b2dcee323066`, `sc-9-5106b0581c675e45`, `sc-10-7c632c872d963b52`, `sc-11-9dd48abb91b7575b`, `sc-12-9e42f13fb2bf071c`.
>
> **What was looked at [J]:** every new drawing as native stills at 2x while it was built (about 250), then **every shot's first, turning and last frame decoded from the rendered MP4 at 1080p** (163 frames from the first render and 9 from the second, viewed at full size or as 2x2 sheets at half 1080p, with crops at 4-8x for faces, hands, glasses and text), and the fixes again from the second render. Nothing was watched in real time or heard with its mix (R8).

**Contents:** [1. The shots](#1-the-shots) · [2. Passes and leaps](#2-passes-and-leaps) · [3. Fixed after looking](#3-fixed-after-looking) · [4. Where this departs from the plan, and why](#4-where-this-departs-from-the-plan-and-why) · [5. Weak, or for a human to check](#5-weak-or-for-a-human-to-check) · [6. Re-running](#6-re-running) · [7. Rules checked](#7-rules-checked) · [8. Files](#8-files)

---

## 1. The shots

Frames are act frames (the lock's); `k` is the shot's own frame (the layouts' `f` is the frame inside the scene). Marks are the lock's sounds and words (each layout's `marks`), the planned frame as a fallback. Lip-sync: `lip` = a drawn viseme track on an approved portrait or bust; `room` = the room-scale flap. No V.O. line moves a mouth (V.O. 4 over the back of his head, V.O. 5 over his still face, V.O. 6 over his posted words). Every screen is touched, never pointed at: his fingertip, Rima's, his thumb (P6).

### Sc 8 · The dark room (7 shots, 1,056 f)

Ep1's dark room (rooms/darkroom-plate; kits/mas-monitor's POV), his approved portrait (cast/mas.ts) in the monitor's cyan, the art pass's SET-07 painters (the RULEBOOK, the news site, the calendar, the call tile). New in this pass: the OTS (the room behind the monitor without the kit's foreground head, then Act Two's own back of his head: soft cel bands of his brown hair, radial strands from the crown, the screen's cyan rim, the hood), his water glass in the foreground, Ep1's framed `GUEST` lanyard on the wall beside the monitor, and his fingertip on the touch screen (the art's hand rig, his grey sleeve).

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 8.01 | 0-193 | OTS → ECU | **ARRIVE** 2.2 s on the room, the monitor's glow on him; the RULEBOOK slides down on the pop: `EUROPE PASSES ITS AI RULEBOOK · 523–46`, its 400-page book with `SNOOZE` bolted on (unpressed); the ECU: the card close, his index and middle fingertips land and flick it off right, unopened | `ui_toast_pop` k52, `ui_swipe` k161 (ECU from k139) |
| 8.02 | 194-317 | POV | One whole-pixel scroll (4 steps) from his feed up to the news site: `…TAKES AIM AT MAS, TASYA AND RADNUS…` in its own UI over the still; the still plays (its bar runs), the unplated host turns from the cardboard lineup to the lens; rail `APR 1, 2024` | `mouse_scroll` k2, the turn k62 |
| 8.03 | 318-503 | OTS | Mas at the monitor, the lineup on it; **V.O. 4** typed (the back of his head: no mouth) | — |
| 8.04 | 504-614 | POV | His calendar, rail `MAY 10`: `ELGOOG · DEVELOPER KEYNOTE` already on TUE 14; his fingertip lands on his block (WED 15) and drags it in held steps onto MON 13; it snaps in | `ui_drop_snap` k96 (the drag k60-94) |
| 8.05 | 615-690 | MCU | His portrait toward the monitor, a face light one step from its side; the lit Monday square in his eyes (a bright 2-px glint in each); **V.O. 5** over his still face | — |
| 8.06 | 691-926 | ECU → MCU → ECU | The phone face up on the desk rings: a grey disc and `ELPPA`, no face, no name, Answer / Decline; his fingertip taps Answer on the connect; his face over the phone (lids lowered to it, level, no smile in it: the portrait's `smile` viseme mapped to rest) for his one sentence of terms (lip); `…`, then `CONFIRMED` on the chip | `call_connect` k48, line end k184, `ui_confirm_chip` k214 |
| 8.07 | 927-1055 | POV | The invite `ELPPA · KEYNOTE · JUN 10` drops in under the Monday square; his fingertip on Accept on the click, `accepted`; **AFTER**: the Monday square lit, the June invite under it; over the last 30 frames the rest of the screen steps down and the square's glow swells in three held steps (the match: 9.01's work light sits where the square sat in frame) | `invite_drop` k16, `post_click` k64 |

### Sc 9 · Backstage (6 shots, 1,224 f)

The art pass's SET-10 wings rebuilt as a room the camera can pan (560 px): black flats, a grid, cables, stacked road cases, the monitor on its stand screen-right, the work light far left, Gerg's road case in the foreground right. Cast at room scale: Mas (art cast/mas2, the glass arm; the rig's amber drink recoloured to water here, after the work-light map, as Act One's notes asked), the Orb (Ep1 orb-medium), the engineer (art cast/engineer), Rima (Ep1 rima-stand, its jaw lifted a rung here: §3), Gerg (Ep1 gerg-stand, typing). Mas keeps the left third.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 9.01 | 1056-1246 | WIDE | **ARRIVE** (cut on 8.07's glow → the work light), 2.4 s before her line, rail `MAY 13, 2024`: Mas with his glass and the Orb, the engineer with the phone, Rima poised in her hard spot (a cone from the grid, a hard pool) with the clicker, CHATGTP a plain bubble on the monitor, Gerg typing behind his case; Rima's line on a room mouth | — |
| 9.02 | 1247-1435 | MEDIUM → SCR | The engineer's bust (the phone up, presenter-bright, lip) rehearsing to Rima, soft at frame left; the monitor close: the bubble answers `yes!!` before he's asked; his "…Before I've asked." off screen | `ui_chirp_bright` k116 |
| 9.03 | 1436-1548 | SCR → MEDIUM | The old voice mode's transcript; the `[laughter]` tag falls off its foot; Gerg close at his road case (Ep1 gerg-speak under his laptop's green glow, lip), the laptop's back on the case; beyond him, small and soft, the engineer laughing nervously beside Rima, the laugh stopping on "laugh." | `tag_drop` k23, Gerg k50-98 |
| 9.04 | 1549-1866 | 2S | Mas (his approved portrait in the work light, turned to her) and Rima (Ep1 rima-speak), no cut-ins, both lip-synced; her answers composed, level brows | — |
| 9.05 | 1867-2114 | WIDE (pan) | Mas walks off frame-left (flipped, his walk cycle, the Orb with him); a 40 px whole-pixel pan with Rima as she crosses to the monitor, her spot keeping up with her; the engineer follows; room mouths on both lines | the walk k18-110 |
| 9.06 | 2115-2279 | SCR → GRID | Her fingertip taps the screen; the VOICE panel (`VOICE`, `SINCE SEP 2023`, `VOICE 1`-`VOICE 5`); her fingertip on each slot as it says hello (Hi. Hi! hi? Hi… Hey.); the fifth's square stays lit; on the unfold the panel's squares drop past the bezel row by row; on the ink stroke the drafting grid takes the frame from the floor up, and one cell is left lit: 10.01's first cell | lines k38/57/72/90/114, `panel_unfold_step` k131, `drafting_ink_stroke` k150 |

### Sc 10 · THE PLAN: `OMNI` (7 shots, 1,104 f)

The show-wide blueprint kit (shared/pixel/kits/blueprint: cyan #7FDBFF on navy #0B1E3F, proxies inked by `bpComposite`); the art pass's SET-11 sheet (480 × 540, its accurate content and tiny figures) re-drawn in `act2/sets/plan.ts` so **every element draws itself on as Rima says it** (whole-pixel strokes with a hot pen tip, lettering typed on, stamps that land with a kick). Rima is off screen throughout (her own voice; THE PLAN never carries his).

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 10.01 | 2280-2434 | GFX | **ARRIVE** on the lit cell (9.06's last frame), 2 s before her first word; the stamp `OMNI` lands, `(o = omni)` types; an ear, an eye and a mouth draw themselves on "hears", "sees", "talks" | `rubber_stamp_C` k18, the three words |
| 10.02 | 2435-2666 | GFX | `BEFORE` types; the three boxes draw on her words, ear to mouth, the tiny clerks passing a note; on "fell" `TONE` · `LAUGHTER` · `WHO'S TALKING` · `BACKGROUND NOISE` drop through box 1's grate one by one; the camera glides down to the grate; backstage's `[laughter]` tag lies at its bottom | "models", "note", "fell"; `[laughter]` k198 |
| 10.03 | 2667-2823 | GFX | `NOW` types; one double box `GTP-4o`, the ear, the eye and the mouth wired in; the grate above it empty; on "laugh back" a `ha` in at the ear, a `ha` out at the mouth, which opens | `tiny_laugh_back` k120 |
| 10.04 | 2824-2940 | GFX (pan) | A pan down to the steps; the tiny engineer walks on; `1.` lands, `232 MS (AVG 320)` types; the tiny bubble has already answered: `hi` | `rubber_stamp_C` k86 |
| 10.05 | 2941-3082 | GFX | `2.` on "today": a tiny calendar, MON circled, a tiny Radnus on the Tuesday square (unmentioned); `3.` on "free": `$0`, and eighteen tiny figures file in from the right | stamps k33, k61; `tiny_crowd_patter` k67 |
| 10.06 | 3083-3212 | GFX (pan) | Down to the last square: the tiny stage draws on, six tiny lights, tiny Rima in her tiny spot, `MAY 13` dimensioned | — |
| 10.07 | 3213-3383 | GFX → TEAR | An **empty** speech bubble, nothing in it, drifts in from the right margin in held steps; every tiny figure looks up (a head a pixel up, a hot dot); it settles over the tiny stage and blots out its lights; the sheet tears across and through the gap the real stage: 11.01's first frame, the rig's lights on (the same picture: `demoOpen` at k0) | `paper_tear` k128 |

### Sc 11 · "her" (16 shots, 2,352 f)

**The meter frame** (`act2/sets/stage.ts stageWide`, new composition on the art's pieces): the masking leg at frame left (stage right, the wings), the engineer's mark downstage right (screen-left, by the wings), Rima centre in her spot, the big screen centre-right (CHATGTP's Ep2 face from the art, the chat strip, `LIVE`/`ENDED`, the `VOICE 5` badge), the rig across the top, the house in the foreground (backs of heads, the press row's laptops, the raised phones). **The spot's four steps** are measured here: x 168 (on her) → 206 → 246 → 292 (more on the screen than on her), each on the lock's `spotlight_swing`; she goes half-lit, then into the half-dark. The screen close (`screenSCR`) is the same screen's picture with its own pixels doubled (an LED wall seen nearer).

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 11.01 | 3384-3587 | WIDE | **ARRIVE** on the tear's picture: Rima walks out of the wings to her mark; the spot lands on her; 2 s before "Good morning." (room mouth); the bubble on the big screen featureless | `spotlight_swing` k14 |
| 11.02 | 3588-3707 | SCR | Ears, eyes, a mouth in three held steps, one on each palette step; the `VOICE 5` badge from k38; its mouth on its lines | `palette_step_F` k4, k19, k33 |
| 11.03 | 3708-3783 | GLYPH → 2S | **GLYPH, 5 frames**: its eyes are tokens (two eye-shaped fields of glyphs, brightest on the screen-left side: toward the wings); then the wings: Mas (his portrait in the stage's spill, turned to the stage) and the Orb beside him scanning the screen; its toast `verified: …`, the dots cycling, never a word; it gives up and the toast drops away | `glyph_blink` k1, `orb_scan_sweep` k14, `ui_toast_pop` k21, gone k62 |
| 11.04 | 3784-4103 | WIDE | The engineer raises the phone and asks for short answers (room mouth); the product answers from the screen (its mouth on its line); "Thanks." in over "favorite"; the house laughs (the heads bob); **step 1** | `crowd_laugh_m` k250, `spotlight_swing` k262 |
| 11.05 | 4104-4337 | WIDE → SCR → WIDE | He tries again (room mouth); the screen close: **three mouths** harmonising (the art's harmony mouths); the bigger laugh; back to the wide for **step 2** | sung line k102-158, `spotlight_swing` k181 |
| 11.06 | 4338-4502 | MCU | Rima (her approved portrait) half in the light: her screen-right side still in the spot's edge, the other side a hard step down (a hard spot's edge, no dither on her skin); her line, never rushed (lip); the click is heard | `clicker_click` k13 |
| 11.07 | 4503-4766 | WIDE · ECU · SCR · WIDE | "Say hello to the room."; the product overwhelmed; **ECU** mid-house, a stranger's glasses (heavy dark frames, the screen small and cyan in each lens) fogging from their feet in three held steps; **SCR** "You're making me blush…", then 😊 (closed arcs, the blush); the wide: **step 3** | line ends k119, k142; `😊` k194; `spotlight_swing` k218 |
| 11.08 | 4767-4855 | SCR | The chat scrolls; `what's the catch?` arrives and sticks, lit; "It's free!" | — |
| 11.09 | 4856-4975 | MCU | Rima in the half-dark (two rungs down, a rim on her lit edge), the house waiting on her: her one long hold, then "…and that's the demo." (lip) | — |
| 11.10 | 4976-5047 | SCR → WIDE | `LIVE` → `ENDED` (the face dims a rung); the wide: the house lights a step up, the first seats emptying | `ENDED` k19, `house_lights_up` k28 |
| 11.11 | 5048-5119 | MEDIUM → ECU | In the wings his face unchanged, the phone rising into his hand; the composer: his thumb types `h` · `e` · `r` (each key lit, his thumb put on it) | `typing_soft` k24, k36, k50 |
| 11.12 | 5120-5196 | MCU → POV | His face in the stage's spill, still, two beats; the post lands in its own UI on the click: Mas Manalt · `her` · MAY 13 | `post_click` k31 |
| 11.13 | 5197-5436 | WIDE | The blimp rises out of the wings in four held sizes, a bar each, over the emptying house; the raised phones go up, then swing to it on the buzz; Rima holds her mark; `ENDED` | `blimp_inflate_step` k7/67/127/187, `phone_wave_buzz` k144 |
| 11.14 | 5437-5498 | MCU | Rima on her mark in the house light, composed; she doesn't look up | — |
| 11.15 | 5499-5663 | 2S | The engineer beside her, his headset coming off on the unclip, reads it off his phone to her, off mic (lip); she doesn't look up | `headset_unclip` k6 |
| 11.16 | 5664-5735 | WIDE | **AFTER**: the heads near the wings turn to them (a cheek and an ear come round on the left side of each), the blimp at its fourth size over the emptying house; the engineer beside Rima | `cloth_rustle` k4 |

### Sc 12 · The empty seat (8 shots, 960 f)

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 12.01 | 5736-5881 | WIDE → MCU | **ARRIVE** on the same screen, dark (11.16's `ENDED` → dark), the house lights coming up full, the rig dark and empty (the blimp gone: it never shares a frame with the seat), the last of the house filing out a few heads at a time; Rima the last one on her mark; closer: one breath (her shoulders rise a pixel and settle), then she walks off frame left with the clicker in held steps | `house_lights_up` k5 |
| 12.02 | 5882-5957 | WIDE | The art's front row (plain house light, the rope): `RESERVED: CHIEF SCIENTIST` on the empty seat, the placard as it is | — |
| 12.03 | 5958-6039 | ECU | Its chrome armrest: for 2 s on the Door's note, Ep1's own party toast in it (art armrestECU, Ep1 act3 `partyToast`): Alyi turning to Mas with a toast and a smile; then only the seat's red | `door_motif_note` k4 (toast k4-51) |
| 12.04 | 6040-6063 | BLACK | A beat | — |
| 12.05 | 6064-6207 | MCU | **ARRIVE** his dark room in the afternoon (the window's sky lit, the city a grey silhouette, the room a rung up), rail `MAY 14, 2024`; the monitor beside him face-on enough to read: `OMNI` over `ELGOOG'S KEYNOTE` (no blimp); his arm (bent at the elbow, from his shoulder) reaches and his fingertip presses the player's minimise; it shrinks to the taskbar over his work (a document); a beat | `ui_minimise` k110 |
| 12.06 | 6208-6365 | ECU | His phone in his hand (the art's wrap grip) lights in held steps: Alyi's post in its own UI, its first sentence; his thumb scrolls once, whole-pixel steps, past the post's middle (grey bars, no words) to "…I will miss everyone dearly." | `phone_buzz_step_1` k2, `thumb_scroll` k96 |
| 12.07 | 6366-6628 | ECU | The phone held from below (the cup grip): he types his post, his thumb on the key of each letter (`thumbFor` searches the grip for the nearest reach); on the click it posts, hard-stopped at "…and a dear friend." (no scroll; no capital I as a pronoun); **V.O. 6** typed only after both posts' read time | key taps k14/33/52, `post_click` k76, V.O. k223 |
| 12.08 | 6629-6695 | MCU | **AFTER**: his face held in the afternoon, a face light one step (Ep1 face-light-img); the cue stops (the act-out) | — |

## 2. Passes and leaps

Act Two has **no video-model insert and no Tier 2 leap** (manifest §4: 2.A and 2.H are sc 1 and sc 22), so no Runway take was made and the key was not read. Its passes, all code:
- **BLUEPRINT** (sc 10): the show-wide kit, every element drawing itself on; the tear (the kit's) reveals the real stage, the first frame of 11.01.
- **2.C stream** (sc 11): the big screen's chrome (`LIVE` → `ENDED`, the chat strip, the `VOICE 5` badge), seen in the meter frame and close (its pixels doubled).
- **GLYPH, 5 frames** (11.03 k0-4): real glyph tokens drawn by the Remotion host over two eye-shaped masks (shared/pixel/glyph `glyphLayer`; the layout's source puts a bright eye shape, brightest toward the wings, in each mask so the tokens make eyes), spliced by the Node renderer from `GLYPH_DIR` (`node r-act2.cjs glyphs <dir> 2`). On the room, never in anyone's eyes but the product's.

## 3. Fixed after looking

Each was seen in native stills or in frames decoded from the MP4, fixed, and looked at again.

**Sc 8**
1. **The OTS's back of his head** first read as a headset (the near ear a dark disc in a bright ring) with rain-like strand lines; then the kit's own head showed as a halo round Act Two's. The OTS now draws the kit's room without its head, then Act Two's back of the head: soft cel bands, radial strands from the crown, the cyan rim on the screen side, no ear (turned square away), the hood a rolled ring with elliptical light bands (a straight seam read as a box).
2. **The lit Monday square in his eyes** was a checker of +1 steps on his face (dither on skin): Ep1's face-light kit instead (one step, keyed from the monitor), and a 2-px glint in each eye.
3. **The Monday square's glow** at 8.07's end barely changed the frame: the rest of the screen steps down and the square comes up three steps, its light past the bezel (the match into the work light).
4. **Mas on the call smiled** on his `smile` visemes (the direction is "level, no smile in it"): mapped to rest for this shot.

**Sc 9**
5. **Rima's room sprite read as bearded** at 1080p (her lower face's S2 shadow met her hair): her jaw rows lifted a rung (`common.ts rimaRoomImg`; Ep1's rig itself untouched).
6. **Rima's portrait ended on a black slab** (its window's last row is N0, and the bust run-on repeated it): `bustRunOn` repeats row 134 instead.
7. **Gerg was tiny** behind his foreground case in 9.03, his line on a 2-px mouth: 9.03 is now a medium on his speaking portrait under the laptop's green, the engineer and Rima small beyond him.
8. **The road case overlapped Rima's walk** in 9.05 (Gerg's head over her legs): the room relaid (the monitor at 326, Gerg's case at 398), so she crosses clear of it.
9. **Mas walked off backwards** (facing right while moving left): flipped; and **his glass stayed amber** (the work-light map turned the recoloured water back to tungsten): the water is laid after the map, in neutral greys that survive it, mirrored with the flipped sprite.
10. **The engineer's bust carried AO grain** on its near cheek that read as stubble: `smoothSkin` (Act One's XEL fix, as a wrapper; the art file untouched).
11. **9.06 opened with no tap**: her fingertip comes in and taps before the panel opens.

**Sc 10**
12. **The `[laughter]` tag's right bracket** sat a space away: placed from the text's measured width.
13. **The tiny Radnus stood on `TUE`'s label**: the tiny calendar is taller and he stands below it.
14. **The tear revealed abstract light bars** (the art's): it reveals the real stage, 11.01's first frame.

**Sc 11**
15. **The chat showed `her?` before the post** and `what's the catch?` long before 11.08 (a cycled list): the chat is a sequence, the catch exactly at its index (`CATCH`), reached in 11.08; nothing before it says her or free.
16. **The ears were cut off** by the screen's top in the close: the face sits lower in the screen.
17. **The GLYPH rectangle** turned the whole eye band into a grey block of dense tokens: two eye-shaped masks, and a source that puts the eyes' light in them (the cream around them dark), so the tokens make two eyes looking into the wings.
18. **"Half in the light" darkened a box** round Rima (the background too): only her own pixels step down, through a layer.
19. **The glasses ECU** began as the art's bust scaled 2.6x with a second pair of rims drawn over its own: a procedural ECU instead (the brow, both eyes behind the lenses, heavy frames, the screen's reflection, the fog from the lenses' feet), its skin in solid bands.
20. **Her clicker in the MCU read as a thumbs-up** (the hand rig round a 3 cm remote at chest height): taken out; the click is heard (§4).
21. **The h-e-r thumb was off frame** (the phone too big and too low for the cup grip): the phone smaller and higher, and the grip's thumb position searched so the thumb lands on the key it presses.
22. **The engineer turned his back** on the screen in 11.07 (flipped for "the camera onto the audience"): unflipped; at room scale the turn doesn't read either way.
23. **The blimp's second size covered the engineer's face**: its path now starts inside the wings' masking and rises above his head.

**Sc 12**
24. **The heads vanished at once** on the lights-up: they file out a few at a time.
25. **The minimise reach** was a 260-px sleeve from the frame's corner across his chest: a bent arm from his shoulder (elbow below), the fingertip on the player's own minimise at its control bar.
26. **The second crop showed before the scroll** at the phone's foot: the post's middle is longer (grey bars) so "…I will miss everyone dearly." arrives only with the thumb.
27. **His posted words sat under his thumb**: the post card higher, the thumb below it.

## 4. Where this departs from the plan, and why

- **The monitor is a touch screen** in sc 8 and 12 (his fingertip swipes, drags, taps, minimises), as the wings' monitor is for Rima. The script names the actions, not the device; a cursor is forbidden (P6) and his phone's suggestion strip doesn't fit a monitor. [FIRM P6, GUIDE staging]
- **8.06 cuts to his face for the line** (the lock's "ECU → MCU") and back to the tile for `…` and `CONFIRMED`. [GUIDE P2, P9]
- **9.03 is a medium on Gerg** in the foreground with the engineer beyond, not a wide (the lock says "→ WIDE · Gerg at his road case in the foreground"): at room scale his line had no visible mouth. [FIRM P9]
- **11.06's click is heard, not shown**: the clicker at MCU scale read as a thumbs-up, a gesture that changes her meaning. [FIRM P5 feeling]
- **The chat's messages are invented filler** (`wow`, `so fast`, `it laughed`, `cute`, …), never her and never free before the catch (§3 15). [J]
- **The tear runs across the sheet** (the kit's own tear and the art's), where the script says "down the middle": the frame's middle, horizontally. [GUIDE]
- **The big screen's bubble is featureless in 11.01** (the art's grow 0): the face grows in 11.02, so the empty bubble of 10.07 meets the real screen's empty bubble on the cut. [J]
- **12.05 is a new composition** (his portrait at the right, the monitor face-on beside him), not Ep1's MCU, so the recap reads; 12.08 returns to Ep1's MCU. [GUIDE P7]
- **12.06 holds the phone in his hand** from the first frame (it lights in his hand), rather than on the desk. [J]

## 5. Weak, or for a human to check

- **Nothing has been watched in motion with its sound.** The marks follow the lock's sounds (the snaps, chirps, stamps, the swings of the spot, the inflate steps, the minimise); every one wants a look against the mix.
- **The room-scale cast is small.** The wings and the meter frame are wides with 80-px figures (Ep1's room scale); faces read in the mediums, MCUs and 2S (most of the dialogue's time). **Rima's room sprite** still reads a little heavy in the jaw at 1080p after its lift [J]; it is Ep1's approved rig.
- **The meter frame is dark** apart from the screen; the spot's steps read [J], but a human should judge whether "half in the light" reads at speed.
- **The engineer's bust** (the art pass's sculpted head) is smoothed but its mouth sits under the mic boom; its unclip pose's raised arm is the art's.
- **The glasses ECU** is a stylised insert (flat skin bands, graphic light) in a pixel act; it reads as glasses fogging [J], a little cartoon-flat against the portraits.
- **The OTS's back of his head** is a new procedural drawing, not an approved rig; it reads as hair and a hood [J]. The tag reuses this setup (script: "The tag reuses this setup"): `act2/sets/dark.ts otsDark` is the drawing to copy.
- **12.03's toast** is the art's armrest (Ep1's party picture in a band, not bent by a curve); it plays 2 s as a reflection, not a ghost [J].
- **11.13's blimp crosses the screen's corner** at its fourth size (it is between us and the stage). The plan's rule (the blimp never in a frame with the seat) holds: it is gone before 12.01.
- **Lip-sync** is the shared track on Ep1's portraits (Mas, Rima, Gerg) and the art's engineer bust; room mouths in the wides. Looked at in stills, not at speed.
- **Resource asks (R16, non-blocking):** one human pass of Act Two with its mix; a Rima medium rig (waist-up, at the meter frame's scale) would let her play the demo closer than 80 px; a stage-from-the-house plate at a larger scale would give the meter frame room for faces.

**Notes from earlier segments, carried:** the amber drink in `art/cast/mas2.ts`'s glass arm is recoloured locally here too (`wings.ts waterGlass`, after the work-light map); the contact-sheet script now lives in the repo (`pixel/tools/sheet.py`); Act Two's cache was pruned (`sceneprune` touches only `scenes/act2/`).

## 6. Re-running

From the repo root; `S` is any scratch folder.
```sh
cd studio
node src/episodes/ep02/pixel/tools/build.mjs act2 $S/r-act2.cjs
node $S/r-act2.cjs check
node $S/r-act2.cjs native $S/stills 100 1156 2410 3710 5397 6566          # native stills of any frames
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act2.cjs glyphs $S/glyph 2      # the 5 GLYPH frames (Remotion), once per change to 11.03
GLYPH_DIR=$S/glyph X264_THREADS=1 MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act2.cjs scenes --jobs 2   # -> out/ep02/v1/picture/act2.mp4
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-act2.cjs scenecheck --every 8
cd .. && bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py out/ep02/v1/picture/act2.mp4
# the lock check: re-derive into scratch and compare (no mix yet)
python3 studio/src/episodes/ep02/pixel/tools/lock.py --seg act2 --timeline show/reel/ep02-v1-el/ep02-v1-el-act2.json \
  --takes show/episodes/ep02/production/v1/assembly/el-v1/act2-takes.json --ep-in 10824 --label "ACT TWO" \
  --out-json $S/lock.json --out-ts $S/lock.ts --strict && cmp $S/lock.ts studio/src/episodes/ep02/pixel/act2/data.ts
# the contact sheet (frames listed in the commit and below), or frames at 1080p for a look
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py sheet out/ep02/v1/picture/act2.mp4 \
  out/ep02/v1/picture/act2-sheet.png "TITLE" "100|8.01|OTS → ECU" "264|8.02|POV" ...
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py frames out/ep02/v1/picture/act2.mp4 $S/look 811:8.06 4703:11.07
```
The sheet's frames (one per shot, mostly its turn): 100, 264, 418, 584, 675, 811, 991 · 1156, 1307, 1516, 1649, 1937, 2235 · 2410, 2635, 2797, 2924, 3031, 3183, 3353 · 3444, 3648, 3748, 4054, 4234, 4418, 4703, 4807, 4936, 5016, 5103, 5170, 5397, 5467, 5599, 5704 · 5766, 5922, 5988, 6050, 6168, 6268, 6566, 6659.

## 7. Rules checked

P1 (pixel first, 1080p), P2 (MCUs, mediums, 2S, OTS and ECUs carry most of the dialogue; the wides establish and carry the meter), P3 (arrivals before the first line or beat: sc 8 2.2 s, sc 9 2.4 s, sc 10 2.0 s, sc 11 2.0 s, sc 12 the empty stage 6 s with no line, the afternoon 4.6 s before the minimise; aftermaths: the Monday glow 1.2 s, the fifth square, the tear's light, the turning heads 3 s, his face 2.8 s), P5 (the full-size look, §3), P6 (no cursor: fingertips and a thumb on the screens), P7 (the RULEBOOK and its SNOOZE, the headline, the calendar blocks, the call tile, the invite, `yes!!`, `[laughter]`, the panel, every PLAN label, `VOICE 5`, `LIVE`/`ENDED`, `what's the catch?`, `her`, the placard, `OMNI`/`ELGOOG'S KEYNOTE`, both posts all read at 1080p), P8/P14 (no video model; Alyi only in Ep1's own toast art in the chrome, 2 s, and in his own words; no image of him in any present-day surface), P9 (every speaker's mouth on screen or the voice established: the engineer O.S. in 9.02's SCR, Rima O.S. over THE PLAN, CHATGTP on its screen, the VOICE slots by their hellos), P10 (face lights on Mas's MCUs: 8.05, 12.08), P11 (passes BLUEPRINT, 2.C, GLYPH only, each in the manifest), P15 (flash: 1/s max, 0 red; read times: the RULEBOOK 4.2 s, the headline 2.9 s + 8.03, the calendar 2.7 s, `CONFIRMED` 0.9 s, the invite 4.5 s, the panel 6.4 s, the falling words 3 s + all of 10.03, `232 MS (AVG 320)` 7 s across 10.04-10.05, `what's the catch?` 3.4 s, the placard the whole shot (3.2 s), the recap 4.6 s, Alyi's crops about 3.8 s and 2.4 s, Mas's post 10.5 s from its first letter), P17 (no scaffolding), P18 (V.O. 4, 5 and 6 type with the voice through the host's voLine, clear of the rails), W8 (no V.O. in sc 11; nothing on Mas's face or in the staging says why he posted; nothing in sc 12 gives a reason for Alyi leaving: no reflection turning away, no look at the blimp, no tether; "her" and the departure never share a frame), GR §6 (no invented private intent: nothing on Mas's face says why; Rima's aftermath her own, no wince), R1 (the show's shared pixel code imported only: rooms/darkroom-plate and kit-b, kits/mas-monitor, face-light-img, orb-toast and blueprint, cast mas, rima-speak, rima-stand, gerg-stand, gerg-speak, orb-medium, chatgtp, bosses and civic-kit, glyph and mask; the art pass's cast, sets and hands imported only; Ep1's party toast via the art's armrest; nothing under Ep1 edited; no shared or art-pass file edited), R10 (every render, decode, GLYPH run, check and typecheck through `ops/heavy.sh`, one at a time), R11 (keyscan before the commit and the push), R13 (this note), R14 (scratch in this session's scratchpad). Broken on purpose: the framings and staging in §4 (GUIDE).

## 8. Files

**New:** `studio/src/episodes/ep02/pixel/act2/sets/{common,dark,wings,plan,stage}.ts`; `studio/src/episodes/ep02/pixel/tools/sheet.py`; `out/ep02/v1/picture/act2-sheet.png`; this file.
**Filled (the stubs):** `studio/src/episodes/ep02/pixel/act2/scenes/sc-{8,9,10,11,12}.ts`.
**Generated, not committed:** `out/ep02/v1/picture/act2.mp4` (git-ignored) with its `.srt` and `.render.json`, and the scene cache `out/ep02/v1/scenes/act2/`.
