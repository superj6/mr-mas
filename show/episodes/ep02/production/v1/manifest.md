# Ep2 v1: the production manifest (`ep1.1_her.wav`)

> **Status: revised after review round 1, 2026-10-08, for the one-go build.** Everything the episode needs, built from [proposal.md](proposal.md) (the agreed-quality flow; scene numbers are its numbers). For each item: what it is, where it's used, and whether it's **reused** from Ep1 (path), **copied** from Ep1 into Ep2's tree (Ep1 is locked: copy, never edit; LEARNINGS R1), or **new**.
>
> **Nothing has been built.** Paths below are sources to read; every new file goes under Ep2's locations (§0).
>
> **Round 1** changed items are marked **R1**; the reasons are in the proposal's [Review log](proposal.md#review-log-round-1).

**Contents:** [0. Where Ep2 lives](#0-where-ep2-lives) · [1. Sets and rooms](#1-sets-and-rooms) · [2. Characters on screen](#2-characters-on-screen) · [3. Props, inserts and UI](#3-props-inserts-and-ui) · [4. Style leaps, passes and video-model inserts](#4-style-leaps-passes-and-video-model-inserts) · [5. Voice cast](#5-voice-cast) · [6. Score cues](#6-score-cues) · [7. Room tone](#7-room-tone) · [8. SFX](#8-sfx) · [9. Build order and checks](#9-build-order-and-checks) · [10. Resource asks](#10-resource-asks)

---

## 0. Where Ep2 lives

| What | Where (ORG §2) |
|---|---|
| Production docs | `show/episodes/ep02/production/v1/` |
| Pixel code | `studio/src/episodes/ep02/pixel/` (new; copies of Ep1 code land here) |
| Renders and the film | `out/ep02/v1/` |
| Takes | `audio/ep02/` (new; the EL tools write their caches here, never into `audio/ep01/`) |
| Score | `audio/ost/tracks/e02-v1-<seg>/` |
| Per-act rebuild | a per-episode copy of `ops/rebuild-act.sh` |
| The intro variant | `out/ep02/v1/intro/` (never re-render or overwrite Ep1's intro outputs) |

**Shared code** under `studio/src/shared/pixel/` is imported, not edited. Where an Ep2 change would alter a shared file's output for Ep1, the Ep2 version is a new file (or an opt-in option with Ep1's default unchanged) and the pass says so in its handoff.

---

## 1. Sets and rooms

Base plate 480 × 270 native (room area rows 0–202, the band below); 4× to 1080p; the master palette; whole-pixel moves; held drawings.

| Id | Set | Scenes | Source | What's new |
|---|---|---|---|---|
| **SET-01** | **NopeAI lobby** (the cathedral's narthex), by day, at a watch party, next morning | 1, 13, 19 (lobby), 20 (Jun 11, left pane) | **reuse** `shared/pixel/rooms/lobby.ts` (rack pillars, votives, neon `NOPE AI`, the DAYS SINCE sign), dressing pattern from `rooms/lobby-deal.ts`; the lobby TV from `kits/tv-news.ts` | the wall-sized screen with a bezel (AROS in sc 1; ELPPA's keynote in sc 19, **R1:** including the stream's cutaway to its outdoor crowd with a small Mas in it); beanbag rows; DOT's ladder; the second sign (`SUED MAS`); **R1:** the front steps and door glass that rattles on each THUD (the hand truck coming up); the glass doors' sidewalk view (the `PAUSE` sign, for the swing only); flyers on the pillars (fresh in 13, **R1:** Mas's own taped upside down in 13, curling in 19); the confetti pile; the hand truck's path along the floor |
| **SET-02** | **NopeAI boardroom**: the séance (night), the Mar 8 meeting (morning), the committee (May 28) | 4, 4A, 18 (full frame, then left pane) | **reuse** `rooms/boardroom.ts`, `rooms/boardroom-head.ts`, `rooms/board-screen.ts` (the wall screen with reflections) | candles (and the candle-lit palette); the Ouija board of reply chevrons with a Go-board corner; **R1:** the planchette, **a plain brass-rimmed planchette with no pointer glyph in its lens** (P6); the ceiling hole and cable; the knob wall; an empty chair at the table's end (sc 4); four nameplate slots (4A); the `SAFETY AND SECURITY COMMITTEE` banner; **R1:** the TV at full-frame size for sc 18's podcast beat (the player, captions legible at 1080p, the board's statement card); the window the beacon's beam crosses |
| **SET-03** | **NopeAI's first office, Feb 2018** (T3 cut-paper, by day) | 4 (F2.3) | **copy** Ep1's `episodes/ep01/pixel/act1/art/v35.ts` (`office2018`, Jun 2018 at night) and `act2/art/v35.ts` (`office2019`, by day; the T3 tier) into `studio/src/episodes/ep02/pixel/` | four months *before* Ep1's Jun 2018 night: fewer racks; the arena on one monitor; a whiteboard with `AGI` and three crossed-out arrows; a Go stone on a desk; the all-hands crowd in rows; the ladder and ceiling hatch; **R1:** Nole's slide `AGI @ ALSET` (blank if the fact doesn't upgrade); **R1: Alyi at a desk, lit, in profile** (not a window reflection) |
| **SET-04** | **Move 37: the board and the knob wall** (T3) | 4 | **new**, an inset in SET-02's board corner | a 19 × 19 grid in cut-paper; slate and shell stones; the stone click; `MAR 2016 · GAME 2 · MOVE 37`; the wall of tiny knobs behind it (the ghost's chevrons rearranged). **R1:** a stream of tiny human boards pours into the wall, each one ticking every knob one pixel-step; on "Then it played itself." the stream turns into the program's own boards; then **the wall freezes** (the numbers are fixed at the match); no players, no hands |
| **SET-05** | **XEL's studio** | 6 | **new** | a black curtain, two chairs, one mic on a stand in five held sizes (**R1:** four hops); one locked two-shot drawing (the mic's meter frame); **R1:** an MCU setup of Mas against the curtain (the long answer) and of XEL; the `PART n OF 6` sign with six number cards (1–6); a producer's hand; **R1:** XEL's index card `COMPUTE` |
| **SET-06** | **The cathedral, cut away** (a dollhouse cross-section) | 7 | **reuse** `rooms/drill.ts` (Ep1's odometer drill: the odometer still in the bedrock) and the dark room's top floor | the two halves sliding apart; Macrosoft's plinth `BELOW · ABOVE · AROUND`; the basement with `DEFLECTION (LICENSED)` boxes; **R1:** Tasya's phone face up on a box, playing the podcast; lights clicking on floor by floor; the whole-pixel pan up the section; **R1:** a 1.5 s hold on Mas at his monitor |
| **SET-07** | **Mas's dark room** (**R1:** a work room; no domestic dressing, GR X1) | 8, 20 (the ping), 23 | **reuse** `rooms/darkroom.ts`, `rooms/darkroom-plate.ts`, `rooms/darkroom-act3.ts` (the Orb's home spot); `kits/mas-monitor.ts` (the monitor as a stage: `[POV]` and `[OTS]` painters); Ep1's tag's framed `GUEST` lanyard | the `SO SCARY` balloon bobbing at the ceiling (sc 8 → 23), **R1:** and its empty spot after it's reeled out; his calendar UI (Monday block; **R1:** the `ELPPA · KEYNOTE · JUN 10` invite); the replay player UI (**R1:** one date, `FEB 2`); **R1:** the staff-channel ping; **R1:** the call tile `ELPPA` → `CONFIRMED`; **R1:** the rally photo's plate and decal; a background tab with an egg on a bill |
| **SET-08** | **The TV stand-up on the hill** (inside the replay) | 8 | **copy** the intro's podium hill (THE PODIUM, P01) from the intro build | a camera on a tripod, a light on a stand, the operator; the viewfinder's frame lines; an unbranded lower third; the over-long red tie running down the hill. **R1:** the player's chrome clears before the balloon business (nothing invented inside the dated player) |
| **SET-09** | **The news-desk lineup** (on the monitor) | 8 | **new** (small) | a desk, a height chart, three cardboard cutouts in lanyards, an unplated host |
| **SET-10** | **The demo stage**: the wings (work-light palette), the stage from the house, the front row; **R1:** the wings next morning, half struck | 9, 11, 12 | **reference** Ep1's DevDay painter (`kits/monitor-items.ts` `devdayPainter`) and `rooms/duel-split.ts`'s demo stage; **new** as a full room | road cases and cables (**R1:** one road case for the clicker, and Mas's seat the next morning); a monitor in the wings; the stage with its big screen (**R1:** the `VOICE 5` badge; the `LIVE` → `ENDED` chrome) and the spotlight (one locked wide: the spotlight's meter frame); the tiled audience, **R1:** emptying after `ENDED`; **R1:** the press row's screens and a wall of raised phones that swing to the blimp; the roped front row, the `RESERVED: CHIEF SCIENTIST` placard and its chrome armrest (a reflection surface: the one-second Ep1 toast, then only the empty seat); the lighting rig the blimp blocks. **R1: no tether across the seat; no reflection looking up** |
| **SET-11** | **THE PLAN: `OMNI`** | 10 | **reuse** `kits/blueprint.ts` (show-wide), `kits/bp-pointer.ts` | the sheet: `BEFORE` (three boxes as clerks, the grate) → `NOW` (one box); three steps; the tiny stage; the empty bubble; the tear |
| **SET-12** | **The open floor** (the find-the-man spread) | 14 | **reuse** `rooms/bullpen.ts`, re-dressed; the UI band from `shared/pixel/ui.ts` | the spread: tiled staff, glass walls, polished heatsinks, a coffee urn, a spoon in a mug, a chiller puddle; pedestals of literally shiny products (`NEW!`); Alyi's office door on a centre pivot, **R1:** with Ep1's note on its frame (it flutters loose at the `Open` bonk) and Alyi's humming chair beside it; the band's verbs and inventory |
| **SET-13** | **Alyi's office** (2024, empty; 2023, with his chair and his screen) and **R1: its corridor** | 15, F2.2 | **new** | a desk with no chair (2024); the same room in 2023 at night with his chair, his screen, and **R1: the door frame with Ep1's note already taped there (no hand)**; **R1:** a glass door onto the corridor; a printer labelled `EXITS` in the corridor; receipt paper running along the corridor floor |
| **SET-14** | **The holiday party, Dec 2022** (T4 glossy) | F2.2 | **copy** Ep1's `episodes/ep01/pixel/act3/art/party.ts` (the Sep 2023 party) as a base, re-lit | palette-cycled string lights; silhouettes; **R1:** Mas in the crowd, raising his glass back; a corner of humming racks whose status lights become token streams (the glyph runs across the room, never his eyes) |
| **SET-15** | **The leadership offsite, 2023, at night** (T4) | F2.2 | **new** | a lodge doorway; the wooden effigy (a paperclip robot, our design) stencilled `UNALIGNED`; the fire, palette-cycled, never strobing; staff in silhouette; trees |
| **SET-16** | **The Bay Bridge**, mid-span, by day, **R1:** through a night, at dawn, then in rain | 17 | **reference** `rooms/bay-bridge.ts` (Ep1's view across the bay); **new** deck set | five lanes of traffic (stalled on the receipt), the pedestrian lanes on both sides (**R1:** the refusal across the lanes, Mas small in the foreground); the receipt layer under the tires; three parallax planes; the **camera-scroll extension** (production P4); **R1:** the bridge's lights cycling through one night (palette cycle, no strobe); dawn; the storm cloud with a blank letterhead; the rain; **R1:** the receipt's ink running in the rain; the far shore for the umbrella egg |
| **SET-17** | **Misanthropic's lighthouse** | 18 (full frame, then right pane) | **reuse** `rooms/lighthouse.ts` (Ep1's; its header names Ep2 on) | Ekiel on the stair with his box; Adelina at the top, **R1:** her raised lanyard held across the podcast beat; Mario's desk with a scroll; the glass case of CLOD boxes (the last one's art is the Golden Gate Bridge); the beacon's sweep (**R1:** its beam crosses into the boardroom window) |
| **SET-18** | **The split** (two 238 × 203 panes, a 4 px divider) | 18, 20 | **reuse** `rooms/duel-split.ts` (Ep1's split grammar) | the stepped-down pane (one palette rung) and room tone panned to its side |
| **SET-19** | **ELPPA's campus, the keynote crowd** (outdoor) | 19, 20 (left pane) | **new** | a lawn, a giant outdoor screen showing the keynote, the backs of a crowd, generic architecture in ELPPA's off-brand colours (**no real building, logo or trade dress**); the crowd thinning (sc 20); **R1:** Mas's jacket pocket with a glow through the fabric (`Calling NOLE…`) |
| **SET-20** | **F2.1: the 2006 street corner** (EARLY-WEB16; the TSOOB ad) and **the 2008 keynote stage** | 19 (F2.1) | 2006: **new** (small); 2008: **copy** `studio/src/dev/meras/era2008.ts` and `mas08.ts` (the intro's own 2008 frame: THE SLEEVE tosses the clicker, Mas catches it, the collars pop) | the 2006 ad's end card; the GPS breadcrumb drawn across the 2024 stream's stage; the match cut from the 2008 clicker to the 2024 phone |
| **SET-21** | **The walled garden** | 19 | **new** | a perfectly square-cut hedge wall with one gate; a lock as tall as MIT KOOC; beds of phone-shaped flowers; a bench with IRIS; outside the hedge for Mas and Radnus; the reverse from inside the gate (the line crossed on purpose) |
| **SET-22** | **The zAI lobby** | 20 (right pane) | **new**; Nole's post lamp from `rooms/nole-desk.ts` | the brand-new birdcage with its shipping tag; **R1:** a visitor's silhouette at the doors; the rafters' banner `KORG 2: NEXT QUARTER`; the stairwell to a landing four floors up, backlit by morning windows; **R1:** the complaint on its hand truck with the docket tab `HEARING · JUN 12 · MOTION TO DISMISS` turned out, legible at half-pane |
| **SET-23** | **ISS: the white cube on an empty lot** (**real 3D, Tier 2 leap 2.H**) | 22 | **new**, Blender 4.5.3 EEVEE (`~/Downloads/blender-4.5.3-linux-x64/blender`; renders on the iGPU) | a white cube with one handleless door, **sealed by design (no lock, no handle, no keyhole)**; a brass plate engraved `ISS`; a mail slot whose mechanism returns the note (a flap and a roller, no hand); the sign; an empty lot under overcast sky; **R1: no doormat**; rendered to the shot list at 1080p max; **the pixel Mas (walking in) and Alyi's pixel reflection (in the brass) composited on top, keeping the contrast** (no grade match, no pixel rim, no down-rez) |

---

## 2. Characters on screen

**Rigs live in `studio/src/shared/pixel/cast/`** unless marked. "Reuse" means import; any new pose for a shared rig goes in an Ep2 file that composes the rig.

### 2.1 Principals and recurring cast (rigs exist)

| Character | Scenes | Rig (reuse) | New poses or states for Ep2 |
|---|---|---|---|
| **MAS** | every act | `mas.ts`, `mas-stand.ts`, `mas-seated.ts`, `mas-medium.ts`, `mas-cu.ts`, `mas-turnaway.ts`, `mas-collars.ts` (three collars, no pop) | at the back of the lobby, glancing at the chair (1); the Publish click (Ep1's `kits/launch-button.ts` grammar: his finger, no hover); **R1:** lifting his glass (4, into F2.3); a still hand on the glass at the slap; standing behind a chair, then sitting, a glance at Gerg (4A); **R1:** an MCU against the curtain for the long answer (6); **R1:** a hand raised to swipe the balloon, lowered; on a call, unhurried (8); **R1:** ECU thumb typing `h` `e` `r` and an MCU in the work light (11); **R1:** picking the clicker off a road case; on a road case next morning, typing his post (12); **R1:** taping a flyer upside down (13); sitting on a desk edge (15); **R1:** the scramble (thumbs, a call, a draft typed and deleted) and a still face; standing through a night; **R1:** a thumb on `Pause` (17); taking a lanyard from a hand (18); at the edge of an outdoor crowd; **R1:** small in the stream's crowd shot (19); outside a hedge; **R1:** pocketing a phone with his thumb on it (20); raising a hand to knock and lowering it; walking in a 3D lot (composited); **R1:** pocketing the IOU on the move (22); **R1:** looking up at the empty spot on his ceiling (23) |
| **YOUNG MAS** (2006, 2008) | F2.1 | 2008: `studio/src/dev/meras/mas08.ts` (copy) | 2006: **new**, a flip phone and a bobbing pin, EARLY-WEB16 |
| **GERG** | 1, 4, 4A, 9, 13, 19 | `gerg.ts`, `gerg-stand.ts`, `gerg-medium.ts`, `gerg-poses.ts`, `gerg-speak.ts`, `kits/gerg-laptop.ts`; call tile `calltile.ts` | typing on a beanbag; at the séance table's corner, **R1:** a hand on the planchette, and a quiet line to a staffer; **R1:** standing at the back with his laptop, lifting it an inch (4A); on a road case; his one look-up; on a call |
| **RIMA** | 9, 10 (O.S.), 11, 12 | `rima-stand.ts`, `rima-speak.ts`, `rima-v5.ts` | on stage in the spotlight, three light states (lit, half-lit, dark); clicking to the next slide; **R1:** walking past the wings and setting the clicker on a road case (neutral; no hand-off, no look) |
| **ALYI** | 4 (F2.3), 12 (the chrome's 1 s), 14, 15 (F2.2), 22 | `alyi.ts`, `alyi-speak.ts`, `alyi-v5.ts`; Ep1's party toast art (`episodes/ep01/pixel/act3/art/party.ts` `partyToast`, **copied**) for the 1 s in the chrome | **R1:** F2.3: at a desk, lit, in profile, listening (a person, present); **reflections from May 2024 on only** (14's surfaces; 22's brass plate): one drawing in two angles, palette-remapped per surface, never warped; **R1: no planchette rim, no candlestick, no Go-stone gloss, no window in 2018, no turn-away in sc 12**; F2.2: a silhouette in profile raising one hand that finds Mas; lit and laughing; at his screen with Ekiel; looking from the post to the door frame (no writing, no taping); a silhouette in a lodge doorway. **A person throughout** (P8): the intro's roll call shows his face first |
| **NOLE** | 4, F2.3, 20 | `nole.ts` (lit / sil / fade states; arms phone, jab, point, raise); his lamp from `rooms/nole-desk.ts` | the cable drop through the ceiling and the rocket back up; holding the relit candle; slapping his phone down; F2.3: at the front of the all-hands (T3), his slide, climbing the ladder; at the cage, **R1:** to a visitor; **R1:** reading the docket tab, then hauling the complaint on a rope from a landing |
| **GHOST-NOLE** (2016, 2018) | 4 | **new** render of `nole.ts` in the ghost treatment (translucent reply chevrons, the spirit-photo pass); 2018 adds a hoodie | holding up its dated header; **R1:** ghost 3's header carries the "0%" clause while it voices the billions line |
| **TERB** | 4A, 18 | `terb.ts`, `terb-sheet.ts` | reading a sheet; holding out a lanyard; clicking the TV off |
| **MADA** | 4A, 18 | `mada.ts`, `mada-medium.ts` | perfectly still during the reading and the podcast; writing in the minutes |
| **OMIS** and **two new directors** | 4A | **R1:** `cast/civic-extras.ts` recolours (the two are unnamed) | sitting as their nameplates click |
| **TASYA** | 7 | `tasya.ts`, `tasya-medium.ts`, `tasya-speak.ts`; `kits/key-ring-insert.ts` | in the basement doorway; **R1:** turning down the podcast on his phone; a key twisted off and growing back |
| **MARIO** | 18 | `mario.ts` | writing without looking up; finger raised; setting his pen down |
| **ADELINA** | 18 | `adelina.ts` | raising a lanyard (**R1:** held across the podcast beat) and dropping it |
| **RADNUS** | 19 (garden) | `radnus.ts` | **R1 (correction):** rising into frame along the hedge, **polite, outside the hedge, not burning** (the earlier "politely on fire" contradicted the proposal and read as a meme wink) |
| **THE ORB** | throughout | `orb.ts`, `orb-medium.ts`; `kits/orb-toast.ts` | the chandelier at the séance; scanning a hourglass (`verified: 2008`); toasting nothing at the white door; the TERMINAL scan of a crowd (tag); the outro |
| **CHATGTP** | 9, 11, 19 | `chatgtp.ts` (Ep1's form: a bubble with dot eyes) | **its Ep2 face**: ears, eyes and a mouth in three held steps (one chip note each); **R1:** the `VOICE 5` badge in the screen's corner; three mouths for the harmony; token eyes for 5 frames; `😊`; a `GUEST` wristband on its tail; a tiny raised hand. **After the pause (sc 17) it does not speak in Ep2**; Ep3 decides its speaking voice |
| **REMUHCS** (+ three colleagues) | 13 (on the TV) | civic kit: `cast/civic-extras.ts`, `cast/civic-kit.ts` (the colleagues are unnamed and unplated) | behind a bill-shaped lectern (**R1:** nine `FORUM` stickers); aides turning it sideways at a `FLOOR` door |
| **THE SLEEVE** | F2.1 | `studio/src/dev/meras/era2008.ts` (copy) | as the intro draws it: a sleeve tossing a clicker. **No face, no frailty cues** |
| **SIRRAH** | 23 | **R1:** her Ep1 plate only, on a rally photo | not drawn; the photo's crowd is silhouettes with a `SUMMER 2024` decal (X11) |
| **NELEH** | 18 | **not drawn**: **R1:** her voice on the TV's podcast player, captioned | — |
| **THE QUIET VOTE** | 18 | a byline egg only | — |
| ~~NEDIB~~ | — | **R1:** out of Ep2 (the Jul 8 plank is cut) | — |

### 2.2 New characters (rigs to build; parody names from `show/bible/naming.md`)

| Character | Scenes | What to build | Guardrails |
|---|---|---|---|
| **SELBEEP** | 1 | standing, pointing a remote the size of a clapperboard; proud; medium rig with lip-sync | none beyond the general rules |
| **DOT** | 1, 14 | back to camera only, orange lanyard, up a ladder; her hands in an orange cuff with a screwdriver (four screws, one per beat) | her face is never shown (Ep5); nobody names her |
| **XEL** | 6 | seated; lip-sync; in the locked two-shot and an MCU with his index card | voiced only in a library voice; never an impression; **R1:** no "stillness" brief (§5.2) |
| **THE HUMANIST** | 7 | carrying boxes; turning to the doorway | no accent humour |
| **The NEWS-DESK HOST** and **three cardboard CEO cutouts** | 8 | a seated host who turns to the lens; flat cutouts in lanyards | the host is unplated (A14) |
| **The DEMO ENGINEER** (stock) | 9, 11 | headset, `DEMO` lanyard, holding a phone up; **R1:** unclipping his headset off mic; a walk; one medium rig (budget it) | a generic composite; never an `[OTS]` subject |
| **BUKAJ** | 14 | seated in the humming chair, a box of printouts, one hand flat on the armrest | — |
| **EKIEL** | 14, F2.2, 18 | walking with a box, squinting (two glowing rectangles in his eyes in 18); at a screen beside Alyi (F2.2); climbing the stair | no accent |
| **THE FORECASTER** | 17 | walking up the far pedestrian lane; a watch and a clipboard; **R1:** talking to a pen; crossing the stalled lanes; asleep against the rail; waking and crossing out an hour; walking off; an umbrella printed with a probability curve (far shore) | his refusal is principled; no invented probability |
| **The DRIVER** | 17 | in a car window, hand on the horn, reading the receipt; **R1:** leaning out (two lines) | — |
| **HARAS** | 19 | walking in with a calculator tape unspooling; dropping onto a beanbag; writing on the tape | — |
| **MIT KOOC** | 19 (garden) | holding one key as tall as he is; turning it | unplated (A14); company to company only (X2) |
| **RUMPT's hands** (and the over-long red tie) | 8, 23 | hands in navy sleeves over a gold podium's edge: **R1:** slapping a sticker and pumping a balloon (wordless, after the player's chrome clears), reeling a string, tying a knot | **hands only, no voice in Ep2 (R1)**; the face is never shown; no fist pumps; props and pose only |
| **The CAMERA OPERATOR** | 8 | at an eyepiece; stepping over the tie; one look up | a generic person |
| **A VISITOR** (R1) | 20 | a silhouette at the zAI doors | no line, no face |
| **STAFFERS** (séance, lobby, open floor, audiences, all-hands, party, campus, zAI) | many | recolours of `employee-stand.ts`, `civic-extras.ts` and the tiled-employee rigs; silhouettes where marked; **R1:** one staffer pointing at the wall screen (19) | nobody real; nobody named |
| ~~ISOLEP's hand~~ | — | **R1:** cut | — |

### 2.3 Creatures and objects that act

| Thing | Scenes | Build |
|---|---|---|
| **The mammoth** | 1 | pixel: 8 drawings held 3 frames each, palette-cycled fur, gliding one whole pixel a frame; its own colour ramp (its footprints stay in the carpet in that ramp); a fifth leg flickers for 2 frames at the step-out. Near-photoreal in the bezel: §4 |
| **The ghosts** | 4 | email threads made of translucent reply chevrons, each with a dated header; the `!` ghost; the spirit-photo double exposure (2.G) |
| **The cow** | 4 | a cow made of chevrons; a charging cable for a tail, its plug stamped `ALSET`; chewing; its header dated `2018` |
| **The blimp** | 11, 12, 17 | a lowercase `her` blimp in four held sizes, a tether (**R1:** never across the seat), running lights that click off one by one; sagging three pixels |
| **The storm cloud** | 17 | a cloud with a blank letterhead; it rains letterhead |
| **The `SO SCARY` balloon** | 8, 23 | a chatbot-bubble balloon with a smiley face; one held size per pump; the sticker; bobbing; reeled in; the string going taut |
| **The egg** (R1) | 23 | an egg on a bill in a background tab; no hatch, no plate (Ep3 hatches it) |
| **IRIS** | 19 | a small progress bar with a face, stuck at `99%` |
| **The receipt** | 15, 17 | thermal-paper receipt that **R1:** feeds from the `EXITS` printer, runs along the corridor floor, then unrolls lane by lane (a scrolling layer with legible lines); its ink runs in the rain |

---

## 3. Props, inserts and UI

| Prop / insert | Scenes | Source | Note |
|---|---|---|---|
| The DAYS SINCE signs and number plates (`86` → `100`; `202`; second sign `SUED`: `0`, `102`) | 1, 19 | **reuse** the sign in `rooms/lobby.ts`; new second sign | arithmetic checked |
| The complaint on a hand truck: **R1:** its caption `NOLE v. MANALT ET AL.` over `YOU PROMISED!!!`; pages of `!`; contents `!`/`!!`/`!!!`; **R1:** its docket tab `HEARING · JUN 12 · MOTION TO DISMISS`; later `(FOR NOW)`; the refiled `NOLE v. MANALT ET AL. · FEDERAL COURT` with pages `!!`, `!`, `.` | 1, 20, 23 | new | the cover never names Macrosoft (it joined in Nov); the docket tab legible at half-pane (P7) |
| The `WHERE IS ALYI?` flyer (a doorway photo) | 1, 13, 19 | new | **R1:** one taped upside down by Mas (13), still up in 19 |
| The `PAUSE` sign through the door glass | 1 | new | a group sign only; no date, group or grievance |
| Mas's water glass, **R1:** a prop only (no beat depends on a missing ripple) | 1 (the coffee jumps), 4 (his still hand; the lift into F2.3; the sip), 19–20 | **reuse** the glass from Ep1's inserts (`kits/inserts-mas.ts`) | **R1:** sc 17's rain beat is on the receipt's ink, not the glass |
| The post `NOPEAI AND NOLE` with its byline row; Publish | 4 | new (the editor grammar of Ep1's vision post, `act1/art/v35.ts` `editorPOV`, copied) | |
| The Ouija board, **R1:** the plain planchette (no pointer glyph), candles, the Go corner and stones, the knob wall and its training stream | 4 | new | the planchette reads as a planchette, never a cursor (P6) |
| Nole's phone; his lamp; **R1:** his slide `AGI @ ALSET` (F2.3) | 4, F2.3, 20 | `nole.ts`; `rooms/nole-desk.ts` | the lamp's tell: it doesn't click on at "You kept them."; the slide blank if the fact doesn't upgrade |
| Terb's single sheet; nameplates **R1:** `MAS MANALT · BOARD`, `OMIS · NEW DIRECTOR`, `NEW DIRECTOR`, `NEW DIRECTOR` | 4A | `cast/terb-sheet.ts`; new plates | no bracketed placeholder (P17) |
| The calendar invite `XEL · LONG-FORM · MAR 18 · 2 HRS` | 4B | **reuse** the look of `kits/phone-invite.ts` | |
| XEL's mic (five sizes, four hops); **R1:** the sign `PART 1 OF 6` with number cards `2`–`6`; XEL's index card `COMPUTE` | 6 | new | every part number shown (W15) |
| Tasya's key ring (LE CHIEN's paw-print key; a key that grows back; the `MAR 19` stamp); the `INQUIRY` envelope; **R1:** Tasya's phone playing the podcast | 7 | `kits/key-ring-insert.ts`; new envelope | |
| `DEFLECTION (LICENSED)` boxes; the plate `THE HUMANIST · MACROSOFT'S NEW AI CHIEF` | 7 | new | |
| **R1:** the staff-channel ping `he's talking about us` | 8 | `kits/phone-alert.ts` grammar | |
| The replay player (**R1:** `FEB 2` only); the lower third (real words only); the `SO SCARY` sticker | 8 | new | the lower third is the broadcast's own, unbranded; **R1:** the sticker and pump come after the player's chrome clears |
| The RULEBOOK notification (a 400-page book with a `SNOOZE` button on its spine), **R1:** undated | 8 | new; `kits/phone-alert.ts` grammar | the button stays unpressed (Ep8) |
| The segment's title card `"MAS, TASYA AND RADNUS"` | 8 | new | |
| His calendar (`ELGOOG · DEVELOPER KEYNOTE · TUE 14`; `NOPEAI · SPRING UPDATE` dragged onto `MON 13`; **R1:** the invite `ELPPA · KEYNOTE · JUN 10`) | 8, 18 (the reminder) | new | |
| **R1:** the call tile `ELPPA` (no face, no name) → `…` → `CONFIRMED` | 8 | `calltile.ts` grammar | |
| The wings' monitor; `yes!!`; the `[laughter]` tag; the `VOICE` panel (`VOICE 1`–`5`, `SINCE SEP 2023`, five hellos) unfolding onto a drafting grid | 9 | new | |
| THE PLAN sheet | 10 | `kits/blueprint.ts` | `232 MS (AVG 320)`; `MON`; `$0`; the empty bubble |
| The big screen (**R1:** the `VOICE 5` badge; `LIVE` → `ENDED`); CHATGTP's face; the spotlight; his phone typing `h` `e` `r` and the post UI; the wave of phones and the press row swinging to the blimp; `is it safe?` | 11 | new; `kits/post-any.ts` / `kits/post-card.ts` for the post | the post types at a post's pace, off the beat |
| The clicker | 12 (**R1:** on a road case), 19 (F2.1) | new; the 2008 clicker from `meras/era2008.ts` | |
| The `RESERVED: CHIEF SCIENTIST` placard (flips blank); the chrome armrest | 12 | new | **R1:** the chrome shows the Ep1 toast for 1 s, then only the empty seat |
| **R1:** Alyi's May 14 post (three crops, scrolled) and Mas's May 14 post (typed) | 12, 15 (in the thread) | `kits/post-any.ts` | each in its own UI and casing; must-read crops held to P15 |
| The roadmap lectern `ROADMAP · $32B/YR` with **R1:** nine `FORUM` stickers; the `FLOOR` door | 13 | new (on the lobby TV) | |
| The suggestion strip (`> where are you going?` · `> can we talk?` · `> ~~come back~~`); `congratulations.`; `need anything?` | 14 | the phone strip from Ep1 (P6: his choice is the strip, never a cursor) | |
| Ekiel's dominoes (two legible posts in their own UI: **R1:** "sailing against the wind" and "shiny products") | 14 | new; post UI from `kits/post-any.ts` | **no compute line** |
| **The IOU** `IOU: 20% COMPUTE` (Ep1's yellowed note); inventory tag `PLEDGED JUL 2023` | 14, 15, F2.2, 22 | Ep1's note (`episodes/ep01/…`, as aired) redrawn in Ep2 | **no `NEVER DELIVERED`** anywhere (D-09); **R1:** in F2.2 it's found on the door frame, no hand writes or tapes it |
| The `SUPERALIGNMENT` / `SAFETY TEAM` plate; four screws; the `MISC` box, label `MAY 17` | 14 | new; `kits/inserts-hands.ts` grammar for the hand | |
| Alyi's regret post with Mas's three hearts (`NOV 20, 2023`), **R1:** with his `MAY 14, 2024` post below it in the same thread | 15 | **copy** Ep1's post card | both dates in frame for the count |
| TPOOL on a 2024 phone (`LAST UPDATED 2012`, `welcome back, mas`, a 2008 hourglass); the map (`LAST SEEN: 2012`; **R1:** `ALYI · LAST SEEN: DEC 2022`); **R1:** the notification `ALYI · LOCATION UPDATED` (moved to sc 20) | 15, 20 | new | |
| The Superalignment post UI (`INTRODUCING SUPERALIGNMENT · ALYI, EKIEL`); `20% OF THE COMPUTE WE'VE SECURED TO DATE` · `FOUR YEARS` | F2.2 | new | its words are the record's |
| The effigy `UNALIGNED` | F2.2 | new | no religious iconography |
| **R1:** the corridor printer labelled `EXITS` | 15 | new | the receipt's origin; no person |
| The receipt (`NON-DISPARAGEMENT`, `IN PERPETUITY`, `CLAUSE 9…`, the coupon); the pen on a bank chain; the Forecaster's clipboard and watch | 17 | new | |
| The scramble on his phone (screenshots of a clause; a grey `LEGAL` tile; `request for comment`; **R1:** an outgoing call to `LEGAL`; a draft typed and deleted) | 17 | new; `kits/phone-high.ts` | the legal tile is a grey icon, never named |
| His apology post, four trims (**R1:** the last is "…they can contact me and we'll fix that too.") | 17 | post UI | his real lowercase |
| The voice menu: five waveforms; **R1:** `Pause` under his thumb; `VOICE 5 [PAUSED]` greyed with `Hey.`; NopeAI's note, cropped | 17 | new | **R1:** no bonk, no location notification here |
| The lanyards (page `212`; `SAFETY COMMITTEE`); Mario's scroll; the CLOD boxes (the Golden Gate art); the op-ed clipping `NELEH & THE QUIET VOTE` | 18 | new; `cast/clod.ts` for the boxes | the name GOLDEN GATE CLOD is never printed |
| **R1:** the boardroom TV's podcast player, full frame, her voice and captions (two lines), and the board's statement card | 18 | new | her words only; the reply beside them; captions readable at 1080p |
| Haras's calculator tape; the desk confetti cannon; the stream's `…AND LATER THIS YEAR: CHATGTP.`; **R1:** the stream's crowd cutaway | 19 | new | |
| The 2006 ad's end card `"WHERE YOU AT?"`; the GPS breadcrumb | F2.1 | new | |
| The gate, the key, the lock, the velvet rope, the `GUEST` wristband, the phone flowers | 19 | new | never rings, altars or vows |
| The Faraday birdcage; the padlock; Nole's posts (**R1:** "…ELPPA devices will be banned at my companies. That is an unacceptable security violation." · "…visitors will have to check their ELPPA devices at the door, where they will be stored in a Faraday cage"); **R1:** `Calling NOLE…` (through the pocket); `MAS`; `MISSED CALL · MAS`; the sticky `(FOR NOW)` | 20 | new | caller ID legible at half-pane `[ECU]` |
| The white door's brass plate `ISS`; the sign **R1:** "one goal and one product: a safe superintelligence"; the mail slot (returns by mechanism); `Use IOU: 20% COMPUTE on door` | 22 | 3D (SET-23); the band from `shared/pixel/ui.ts` | **R1:** no `NO` doormat; no lock |
| **R1:** RUMPT's HTURT post `…and she 'A.I.'d' it…`; the rally photo with SIRRAH's plate and a `SUMMER 2024` decal; the Orb's TERMINAL scan; the egg in a background tab; THE PODIUM; the Aug 22 lower third "…AI is always very dangerous…" | 23 | new | **R1 cut:** the fog replay, the `PLATFORM` plank, NEDIB's scroll, ISOLEP's pop-ups, `RENEIW'S BILL…` plate |
| Name cards (2-TONE FREEZE): `SELBEEP / DIRECTOR OF MAMMOTHS.` (`MAMMOTHS CONTAINED: 0`) · `XEL / INTERVIEWS MAS. AGAIN.` (`EPISODE: 419`) · `EKIEL / CO-LED THE SAFETY TEAM.` (`SQUINT: 100%`) · `THE FORECASTER / EX-NOPEAI.` (`AT STAKE: ~$2M`) | 1, 6, 14, 17 | `shared/pixel/freeze.ts` | at least 1.2 s; cards at least 45 s apart |
| Plates (no freeze): `NOLE · FUNDED IT. LEFT IT. SUING IT.` · `THE HUMANIST · MACROSOFT'S NEW AI CHIEF` · `BUKAJ · NEW CHIEF SCIENTIST · INHERITED THE HUM.` · `HARAS · FIRST CFO` · **R1:** `SIRRAH` (on the rally photo) | 4, 7, 14, 19, 23 | `shared/pixel/plate.ts` | name plus one relation word |
| **R1: Rails (date chyrons; a date, at most a place or an event's own name, never a headline):** `FEB 15, 2024` · `FEB 29, 2024` · `MAR 5, 2024` · `FEB 20, 2018` · `MAR 8` · `MAR 19` (on the key) · `APR 1, 2024` · `MAY 10` · `MAY 13, 2024` · `MAY 14, 2024` · `DEC 2022` · `2023` · `MAY 17, 2024` · `MAY 18` · `MAY 20` · `MAY 28, 2024` · `JUN 10, 2024` · `JUN 11` · `JUN 19, 2024` · `AUG 5` · `AUG 11` · `AUG 22` | | the rail builder | never on screen with a V.O. line or a toast; **the rail check (§9) greps this list** |

---

## 4. Style leaps, passes and video-model inserts

| Id | Tier | Scene | Filler (programmatic, first) | Final | People in it |
|---|---|---|---|---|---|
| **2.A** · the AROS mammoth | 2 · near-photoreal in a bezel | 1 | a three.js PBR mammoth walking in a snow plate, built to hold at screen size; the pixelize step at the bezel (the genvideo converter's logic, `shared/pixel/genclip.ts`, `GenVideo.tsx`); then the 8-drawing pixel mammoth | **video model, objects only**: a woolly mammoth in a snowy meadow, plodding toward camera, smooth at 24 fps, silent (E2-1 SYNTH) → the step-out stays our conversion | **none**: no person, face or hand in the plate |
| **2.H** · the white room | 2 · real 3D | 22 | Blender EEVEE (overcast HDRI-free soft light; white cube, sealed door, brass plate `ISS`, mail slot and its return mechanism, sign, lot; **R1:** no mat); the pixel Mas and the pixel reflection composited | Blender (the filler may be final) | **none in 3D**: Mas and Alyi's reflection stay pixel drawings |
| 2.G · spirit photo | 1 | 4 | code: double exposure inside the candle's pool | code | — |
| T3 · cut-paper | 1 | 4 (Move 37, F2.3) | code (Ep1's tier, copied) | code | — |
| 2.D · podcast | 1 | 6 | code | code | — |
| BLUEPRINT | 1 | 10 | `kits/blueprint.ts` | code | — |
| 2.C · stream | 1 | 11 | code | code | — |
| GLYPH | 1 | 11 (5 fr), F2.2 (12 fr) | `shared/pixel/glyph.ts`, `glyphDraw.ts` | code | on the room, never in Alyi's eyes |
| UI LIT | 1 | 14, 22 | `shared/pixel/ui.ts` | code | — |
| T4 · glossy | 1 | F2.2 | code (bloom, glass, specular on the pixel base) | code | — |
| EARLY-WEB16 / T2a | 1 | F2.1 | `meras` palettes (copied) | code | — |
| 2.E · TERMINAL | 1 | 23 | code | code | — |

- **Leaps keep their contrast** (LEARNINGS P12): no matching grade, no pixel rim, no down-rezzing.
- **Provenance:** 2.A's final layer gets a `provenance.json` (the GENAI plan §1.8) so the release copy can say it exactly ("near-photoreal inserts show objects only").
- **Flash and read checks** (P15) on every render, streamed in chunks through `ops/heavy.sh`. **R1:** the bridge's night cycle and the party's string lights are palette cycles, checked like the fire.

---

## 5. Voice cast

**One film, the ElevenLabs cast** (Ep1's `audio/ep01/v3-el/cast-el.json`; read it, never edit it: Ep2 gets its own `audio/ep02/cast-el.json`). Model `eleven_multilingual_v2`. Library voices only (ElevenLabs premade or shared Voice Library voices called by `voice_id`): **no cloning, no voice design from anyone's audio, no "sounds like" prompts, no laugh mimicry, no voice chosen or directed to resemble a real person** (S6; guardrails §5–§6). The house respellings carry over (`Mas` → "Moss", `Gerg` → "Gurg", `Alyi` → "Al-yee", `Nole` → "Knoll", `Neleh` → "Nell-eh", `Macrosoft` → "Mack-roh-soft", `CHATGTP` → "Chat G-T-P"…); new names get forced-choice checks (`tools/pron_check.py`'s method): MINDDEEP, ELPPA, TSOOB, ISS, KORG, HARAS, BUKAJ, EKIEL, SELBEEP, XEL, AROS, RETTIWT, NOPEAI.

### 5.1 Voices that exist (Ep1's picks)

| Role | Voice (library) | Engine | Ep2 lines (≈) | Notes |
|---|---|---|---|---|
| **MAS** | Jeremy - Warm, Trustworthy, Sincere (`EwzF7Z2UMSib9JaKx0Kg`; Ep1's set A, candidate C) | EL | 24 spoken (**R1:** + the ELPPA call; − "take your time."), **13 V.O.**, the intro's "her" | lane 105–125 Hz; spoken about 140 wpm; V.O. close and dry at 110–130 wpm (voices-el §AD's settings); the intro line fitted to the intro's frames as Ep1's (voices-el §Y); **R1:** the call is his one full sentence of terms: unhurried, level, no smile in it |
| **GERG** | Marcus - Bright, Upbeat and Clear | EL | 13 (**R1:** + "He signed it. He's just not here.") | the Move 37 explanation (40 words) is his longest read: record it whole; the new line quiet |
| **RIMA** | Mia - Clear, Smooth, Professional (Harper on file as B) | EL | 11 | THE PLAN's four lines O.S., composed |
| **NOLE** | Ryan - Confident and Bold | EL | 11 | bursts; "That's why." and "You kept them." quiet; **R1:** "Its own knobs said…" read as a fear, not a boast; "If they go through with it…" to a visitor |
| **GHOST-NOLE** | the same voice (Ryan) | EL + treatment | 3 | the ghost treatment: a short dark reverb and a chip doubler a hair late; "Yup" read twice, different seeds |
| **TASYA** | Tyler Kurk - Smooth, Pleasant and Clear | EL | 4 | warm, unhurried |
| **TERB** | Ethan - Calm, Optimistic and Clear | EL | 6 | the Mar 8 finding and the May 28 sentence read whole, weighted |
| **RADNUS** | Dylan Malc - Calm & Educational | EL | 1 | quick, apologetic |
| **CHATGTP** (and **R1: VOICE 5's `Hey.`**) | Maya - The Upbeat Creator | EL | about 10 + `Hey.` | "one wo-o-ord." in three parts through the intro's sung-vocal pipeline (not TTS). **R1:** VOICE 5 is this voice, so the paused slot is the one heard on stage. **Direction stays Ep1's bright, upbeat register**: no "breathy", "husky", "sultry" or film-referencing direction or description, in prompts, settings notes or take names. **Required before lock: a human ear check** that it evokes no real actress and no film character. After the pause CHATGTP has no Ep2 line; Ep3 decides its speaking voice |
| **REMUHCS** | Marc Laurent - Confident and Engaging | EL | 1 | on the TV chain |
| **NELEH** (R1) | Alexandra (her Ep1 A voice; voices-el §AE–§AF settings, speed 0.95) | EL | 2 (new takes) | **heard**, through a podcast-player chain (a small-speaker band-pass on the boardroom TV, then the room); her two lines are her own transcript's words with name swaps; recorded whole; ASR-verified against the text |
| **MARIO** | Kokoro `am_liam` (a-liam-earnest) | **Kokoro**, matched into the EL room | 5 | level, room, chain and EQ matched (voices-el §AB3); within about 1 dB of Ekiel beside him |
| **ALYI** | Louis - Deep, Profound and Thoughtful | EL | the chant's first "FEEL THE AGI!" only | the one Alyi voice in Ep2; he leads, the crowd follows |
| **STAFFER** | Avery (Ep1's tiled employee) | EL | 3 (**R1:** + "Is that Mas?") | |

### 5.2 New roles (audition 3–4 library voices each; pick by measurement and a written reason, as voices-el §AA and §AC2)

| Role | Ep2 lines (≈) | Brief | Lane (guide) | Separation to check |
|---|---|---|---|---|
| **SELBEEP** | 4 | a proud showman presenting to a room; bright, pleased with himself | 120–150 Hz | Gerg (they volley) |
| **XEL** (**R1** brief) | 7 | **a calm, earnest interviewer** who asks long questions; pick a timbre clearly unlike the real host's; **no direction toward stillness, slowness or pauses**: the pauses are cut in the edit (the mic-meter cuts), not performed | 95–130 Hz, away from the real host's | Mas (they alternate in one locked frame) |
| **THE HUMANIST** | 3 | soft, polite, a little caught out; neutral American accent (no accent humour) | 110–135 Hz | Tasya |
| **The DEMO ENGINEER** | 6 | presenter-bright, nervous under it; his laugh recorded as a separate take; **R1:** the post line read off mic, lower and closer | 125–160 Hz | CHATGTP, Rima |
| **BUKAJ** | 2 | soft, exact, warm | 110–135 Hz | Mas |
| **EKIEL** | 2 | quiet, dry, squinting; neutral accent | 110–140 Hz | Mario (Kokoro) |
| **THE FORECASTER** | 4 | conversational, precise, kind; a man who talks in medians | 110–140 Hz | Mas |
| **The DRIVER** | 2 (**R1:** + "Take your time?") | an everyday voice through a car window | any | the honks |
| **HARAS** | 4 | pleasant, precise, brisk | 165–200 Hz | Gerg |
| **The TV REPORTER** (O.S.) | 1 | a press-conference question, on the TV chain | any | Remuhcs |
| **STAFFER 2** | 1 | a second staff read | any | Staffer (Avery) |
| **VOICE 1–4** (the panel's hellos) | 4 one-word reads | four distinct product voices: `Hi.` · `Hi!` · `hi?` · `Hi…`. None imitates anyone. (**R1:** VOICE 5 is CHATGTP's Maya; §5.1) | spread across lanes | each other and Maya |
| **The CROWD** (the chant) | 1 chant | 8–12 layered library reads after Alyi's lead, a holiday-party room, building from one to all | mixed | — |
| ~~RUMPT~~ | — | **R1: no voiced line in Ep2.** His real words are the broadcasts' lower thirds with his trombone blip (§8). GR §5–§6 and his character file say "human performer, cartoon register"; Ep1's precedent (SIRRAH recast among library voices at the showrunner's request; NEDIB and REMUHCS on library voices) supports a library voice. The episode that first voices him logs the conflict as a decision row, gets the guardrails owner's update, runs a **blind resemblance check** (a listener who doesn't know the target can't name him), and lists a human performer as a resource ask | — | — |
| ~~The stand-up REPORTER~~ | — | **R1: cut** (invented words inside a dated replay) | — | — |

- **Budget:** about 12 new roles × 3–4 voices for auditions, plus Neleh's two new takes; the episode's takes come after the stick reel's script lock (Ep1 spent about 3,000–5,000 characters per phase; the episode's full set is the larger spend).
- **Recording rules** (voices-el): long reads recorded whole and cut by the lock; cut-offs recorded complete ("…one of my favorite things."; "And profit?"); hand-placed V.O. kept in the spec the lock builder reads (R9); the `--fixed` trap noted.
- **The mix:** dialogue −16 LUFS, V.O. −18 at the take; the film at about −16 LUFS integrated, true peak under −1 dBTP, measured on the decoded encode (S8).

---

## 6. Score cues

The show's own sound (OST-BIBLE §0): every cue on the 96 BPM grid; built from the knee's cells; chip in every cue except the exits from his POV; swung for people, straight for the machine, the board, the record and THE PLAN; **no third anywhere** (no A♮ over F before Ep12); one continuous performance per sequence, ducking and thinning under real lines, never stopping except at designed stops. Folders `audio/ost/tracks/e02-v1-<seg>/`; renders via the engine with `OST_WORKERS=2` through `ops/heavy.sh`.

| Cue | Scenes | Palette | Motifs | Length (≈) | Mood | Source | Designed stops and outs |
|---|---|---|---|---|---|---|---|
| **E02-01 The Mammoth** | 1 | SET-PIECE SWING, low, chip lead only | the Build's chip lead; the knee's first four notes | 52 s | wonder → suspense → comic jolt | new to picture, from MM-16 (Odometer kit) stems | thins to a bass pedal on the first THUD (outside); out: the knee's first four notes on dry piano from the complaint's THUD, cut on the smash |
| **MT** (intro) | intro | the main title (V1, locked) | the knee | 30 s | — | `audio/intro/` (Ep2 variant mix: the VO "her", Jeremy) | the D♭ lands in the typing indicator's silence |
| **E02-02 The Séance** | 4 | **R1: ROOM COLOUR, auditioned first:** (a) a glass harmonica (the period séance instrument) with chip, F minor; (b) celesta and chip over a low reed pad. **Judge both against the corny bar** (no horror-movie organ, no liturgy, no hymn) on a 30 s sample before the build; pick with a written reason → Move 37 colour → ERA T3 (cut-paper chamber) → room colour | Nole's Launch (the stack three times, each shorter; the sincere version on slow horns in F2.3; one note short on his exit); the Go figure on the open fifth | 3:00 | a ghost-story giggle; comedy; **wonder and a chill** (Move 37: celesta and chip over the room colour's pad, the knobs as soft pizzicato grains that **stop when the wall freezes**); melancholy (2018) | new (MM-21 Room Colours, Ep2) | crossfades on the smoke (in and out); the last candle: the room colour's last chord rings into E02-03 |
| **E02-03 Procedure, March** | 4A | PROCEDURE (low strings, brushed snare) | — | 35 s | dry, institutional; a warm half-second (the laptop) | new short, or MM-09 stems | thins to its pedal under the reading (the record plays dry) |
| **E02-04 Long-Form** | 4B → 6 | MM-21 media bed: an original podcast-intro sting | — | 6 s, then none | — | new | **then no score in the studio** (the padded room tone is the joke); SET-PIECE SWING enters on the curtain |
| **E02-05 A Tenant** | 7 | SET-PIECE SWING, low → Tasya's Rhodes, one chord | — | 47 s | comedy with a chill | new | **R1:** ducks under the podcast on Tasya's phone; out: the key ring's jangle on the downbeat (diegetic) |
| **E02-06 Dark Room, Spring** | 8 | DARK ROOM (MM-01 Water Line, library) + tiny media beds | **RUMPT's Podium in FEAR**: cup-muted trombones and horns, pp, E♭ minor, tremolo low strings, a timpani roll (MM-19); a news-desk sting | 58 s | dry amusement; a small thrill; **R1:** a quiet click of power (the call) | library + new beds | the band holds one chord under his real words; **R1:** the Water Line thins to its pedal under the call; one chip note on `CONFIRMED`; out: the walk-on tune warming through a wall |
| **E02-07 One Word** (one tune in three rooms) | 9, 10, 11, 12 | the demo's walk-on (heard through the wall) → **BLUEPRINT** (THE PLAN: the tune as a chip music-box waltz, pizzicato, harp, celesta, F dorian; no piano, no brass, no V.O.) → the demo cue (swung, chip lead, light band) | the knee's step cell in the tune; **THE COPY** (a chip echo a note late) under the three-part harmony; **the Door with its first note missing**, once, on the chrome's toast (sc 12) | 4:13 | nervous fun; the explainer's lean-in; **the biggest laughs**; a wince; sudden quiet; a warmth that hurts | new (P) | a tape-stop at THE PLAN's tear; **R1:** thins to a pad at `ENDED` and holds it under the post; the pad holds across sc 12's beat of black into the morning; thins to its pedal under Alyi's post; **stops mid-phrase on the downbeat after the 2–3 s hold on his face** (the midpoint act-out) |
| **E02-08 Where's Alyi?** | 13, 14 | THE CLOCK, first step (a pizzicato and woodblock tick on varied pitches under the knee's rising F G A♭ C) | **the Door** with its first note missing, blooming on each reflection; **the GPU choir chord** (D♭ sus2(♯11), no third) as the chair's hum, diegetic into score (MM-18) | 1:33 | wry; playful, then lonely; a chill at the screws | new to picture, from MM-18 | thins to its pedal under Ekiel's posts; out: the chair's hum rings over the cut |
| **E02-09 Feel It** | 15 (F2.2 inside) | DARK ROOM (one felt piano, his interior) → the Orb-era glossy colour (GPU choir aahs and glass shimmer, ppp) → felt | the Door over the choir; the chant's lift (warm, giddy, never a hymn); **the Ache** (D♭ + G over an F pedal) under the fire; **R1:** the found note on the Door's held ♯4 (warm resolve, no cadence) | 1:30 | loneliness; **warmth and joy**; gravity; resolve and dread; a determined night | new (P) | the felt returns within a bar of the pin; out: **R1:** the `EXITS` printer's chatter pre-laps E02-10 (SFX) |
| **E02-10 The Bridge** | 17 | SET-PIECE SWING, **the full band** (the episode's one full-band stretch, at its peak only, ≤ 2 bars) | the Build's chip lead in octaves with the violins; brass hits at phrase ends | 2:13 | the big comic set-piece; respect; **R1:** frantic hands (the scramble); a laugh; pathos in the rain | new (P) | 4-bar phrases; **R1:** under the scramble the band drops to bass and the chip lead, busier on the same grid; one held chord through the night (no stop); thins to the bass pedal under the posts; **a pad in the rain**; out: the DREAD sting (MM-14 Outs Kit) **on the blimp's last light** |
| **E02-11 Leverage, Quartet** | 18, 19, 20 | LEVERAGE (a string quartet: pizzicato over the muted 808, locked to the rack LEDs) → under the keynote's own walk-on bed → **ERA T2** for F2.1 (the band through the 16-bit sample-chip, swung, brighter A♭ colours; **no cassette piano, no boom-bap**: the title's 2008 bar) → a garden-party arrangement of the same quartet (**never a wedding march**) → zAI's drone | **Mario's Addendum** (B♭ minor; it gains a bar each time) and **the Lighthouse** cell (marimba and harp) in the right pane; Nole's lamp click and a short fanfare | 4:20 | **R1:** a jolt of truth and a held breath (her voice: the quartet thins to a pedal); comedy; a giddy cheer; nostalgia; wit; a pang at the gate; a laugh | new (P) | **the 808 drops out on "present."**; one violin under the V.O.; **the cello's pedal on the gate**, carried into sc 20; **the THUD ends the performance**; **R1:** under the dark room's ping, room tone only; hard cut to white on the pin |
| **E02-12 One Door** | 22 | DARK ROOM, sparse (one piano note per phrase) | **the Door** with its first note missing, on non-vibrato flute, "through the door" (low-passed, reverb on one side); **the GPU choir** under the reflection | 34 s | stillness; the one quiet ache | new (P) | **R1: the slot's return plays in room tone only (the designed stop)**; the cue returns under the pocket; resolves with no cadence (the Door cadences only in Ep11) |
| **E02-13 August** | 23 | THE RUN (kit, straight or swung, **never boom-bap**; xylophone and wood, pizzicato, a felt ostinato) | a knee stab on each item; **the Orb's verdict** (F → C on vibes and glass, one beat after its chime); RUMPT's muted brass under the lower third and the tie | 35 s | momentum; a laugh; satisfaction; a chill | new (P), or MM-03 stems | thins to its pedal under the posts and the suit's landing; out: cut on the downbeat to black |
| **E02-14 End credits** | outro | THE KNEE, whole (MM-15), **Ep2's colour** | the knee: the title's wordless vocal pad takes the flat line and **stops before the leap** (the paused voice); celesta and chip finish it | about 7.5 s inside the outro's 10 s | — | new (MM-15 colour) | swung; ends on the open fifth |

- **New to-picture cues:** 10 (the guide is about 3 or more per episode).
- **Score minutes:** about 13.5 of 23:40; where the score rests (XEL's studio), room tone runs.
- **Mood shares** (planned): suspense and dread about a third, comic and giddy about a third, warm and sincere about a third (S2).
- **Loudness:** underscore −20 LUFS, featured −16, outs −14 LUFS-M; peaks ≤ −1 dBTP (OST rule 14).
- **No comic scoring on punchlines** (the stop, the cut-off and a size one too big are the only tools); no meme sounds.

---

## 7. Room tone

One bed per location, always on, crossfaded at changes (S3). Library ids from `audio/sfx/manifest.json`; **NEW** where none fits.

| Location | Bed |
|---|---|
| The lobby (day; the watch party; next morning) | **NEW** `bed_lobby_day` (rack hum, the votives ticking on eighths); **NEW** `bed_lobby_watchparty` (a hundred people half-listening); `bed_lobby_night` ✓ as the base |
| The boardroom (séance night; Mar 8 morning; May 28 day) | **NEW** `bed_seance_candles` (crackle over `bed_boardroom_night` ✓); `bed_boardroom_day` ✓ |
| F2.3, the 2018 all-hands | `bed_allhands` ✓, through the T3 tier |
| XEL's studio | **NEW** `bed_podcast_studio` (padded: HVAC, a chair creak; never true silence) |
| The cathedral, cut away | `server_hum` ✓ floor by floor; **NEW** `bed_basement` (lower) |
| The dark room | `room_drone` ✓ + `server_hum` ✓ (the monitor's whine on top) |
| The wings / the stage | **NEW** `bed_wings` (road cases, cable hum, a distant count); **NEW** `bed_demo_house` (seats, air handling, a few coughs; **R1:** an emptying variant); **R1:** **NEW** `bed_wings_morning` (a half-struck set: a far drill, a case latch) |
| The open floor | `bed_office_day` ✓ + `drip_clack` ✓ (the chiller) |
| Alyi's office (2024 night; 2023 night) and **R1:** its corridor | `bed_office_evening` ✓, thinned |
| F2.2: the party; the offsite | **NEW** `bed_party_crowd`; **NEW** `bed_fire_night` (crackle, wind in trees) |
| The bridge; **R1:** the night; the rain | **NEW** `bed_bridge_traffic` (traffic right to left, wind off the water; **R1:** a stalled variant, idling engines); **R1:** **NEW** `bed_bridge_night` (sparse traffic, foghorn far off); **NEW** `bed_rain` |
| The lighthouse | `bed_lighthouse` ✓ + **NEW** `beacon_motor` |
| ELPPA's campus | **NEW** `bed_campus_outdoor` (an outdoor crowd, a big PA far off) |
| F2.1 | the 2008 camcorder's own audio (`era.Era('vhs')`, diegetic) |
| The garden | **NEW** `bed_garden` (birds kept small, a fountain far off) |
| The zAI lobby | **NEW** `bed_zai_warehouse` (high, cold, industrial) |
| The white lot | **NEW** `bed_empty_lot_wind` (a faint high wind) |

---

## 8. SFX

Owned by the SFX layer (OST rule 11: the KA-CHING, glyph grains, the Orb's chime, bonks, freeze hits, clicks, stamps, drones). ✓ = in `audio/sfx/manifest.json` (351 sounds); **NEW** = to make, in the show's own style (tuned where it sits in a cue; nothing corny, no meme sounds). After any timing change, every layer is re-anchored to the new lock (S5).

| Scene | Sounds |
|---|---|
| **1** | `server_hum` ✓ · **NEW** `mammoth_step_pixel` ×4 (soft, heavy) · **NEW** `palette_drip` ×3 (the chair) or `drip_clack` ✓ · `freeze_hit_F` ✓ (the card) · **R1:** **NEW** `hand_truck_step` ×3 (outside, closer each time, tuned to the bass pedal) · **NEW** `door_glass_rattle` · **NEW** `cup_jump` (the coffee) · **NEW** `ladder_sway_creak` · `door_bang_open` ✓ · **NEW** `hand_truck_roll` · **R1:** **NEW** `paper_stack_fall` (the complaint's THUD) · `paper_flutter` ✓ (pages; the flyer) · **NEW** `plate_hang` (the second sign) · `orb_servo` ✓ (the iris step) |
| **4** | **NEW** `inbox_chime_low` (two octaves down) · `post_click` ✓ (Publish) · **NEW** `candle_flare` · **NEW** `planchette_glide`, `planchette_letter_tick` · `glyph_shimmer` ✓ / `reverse_swell_1beat` ✓ (a ghost rises) · **NEW** `ceiling_knock` ×3 (each louder) · `ceiling_burst` ✓ · **NEW** `cable_drop` · `landing_thunk` ✓ · **NEW** `cow_moo_reverb` (low, ghostly, short) · **NEW** `lamp_click` (Nole's) · `phone_clack_floor` ✓ (on the table) · **NEW** `go_stone_click` (slate on wood) · **NEW** `knob_tick_grain` (**R1:** stops when the wall freezes) · `freeze_hit_F` ✓ (F2.3's freeze) · `render_front_sweep` ✓ (into and out of 2018) · **NEW** `ladder_climb`, `hatch_slide_shut` · **NEW** `match_strike` · **NEW** `candle_snuff`, `candle_blow` · `rocket_roar` ✓ · `tile_land_1` ✓ · **NEW** `glass_lift`, `glass_sip` |
| **4A** | `folder_slide` ✓ (the nameplate down the table) · **NEW** `nameplate_click` ×4 · `chair_unfold` ✓ (he sits; or a soft chair) |
| **4B** | `ui_toast_pop` ✓ (the invite) · `post_click` ✓ (Accept) |
| **6** | **NEW** `mic_grow_step` ×4 (a tuned soft thunk, one size per hop) · **NEW** `chair_creak` · `paper_whip` ✓ ×5 (**R1:** the sign's flips, 2 → 6) · **NEW** `curtain_draw` |
| **7** | **R1:** the podcast's line through a phone speaker (a band-passed copy of sc 6's take) · **NEW** `dollhouse_slide` (whole-pixel steps) · **NEW** `light_bank_click` ×4 · `door_key_turn` ✓ (the key twisted off) · `key_ring_jangle_1–3` ✓ (the out) · `alert_bonk` ✓ (the envelope off the ring) |
| **8** | **R1:** `ui_toast_pop` ✓ (the staff ping) · **NEW** `sticker_slap` · **NEW** `balloon_pump` ×n · **NEW** `balloon_bump` (on the ceiling) · `ui_toast_pop` ✓ · **NEW** `ui_swipe` · `mouse_scroll` ✓ (show to show) · **NEW** `ui_drop_snap` (the launch onto Monday) · **R1:** `call_ring` ✓ · `call_connect` ✓ · **NEW** `ui_confirm_chip` (one tuned chip note) · **NEW** `invite_drop` |
| **9** | **NEW** `ui_chirp_bright` (`yes!!`) · **NEW** `tag_drop` (`[laughter]`) · **NEW** `panel_unfold_step` · `drafting_ink_stroke` ✓ |
| **10** | `drafting_ink_stroke` ✓ · `pen_tick_1–3` ✓ · `rubber_stamp_C` ✓ · **NEW** `tiny_crowd_patter` · `paper_curl` ✓ · `paper_tear` ✓ |
| **11** | `spotlight_swing` ✓ ×3 · **NEW** `crowd_laugh_s` / `_m` / `_l` · `glyph_blink` ✓ (5 frames) · **R1:** **NEW** `stream_end_tone` (soft, `ENDED`) · **NEW** `house_lights_up` · `typing_soft` ✓ · `post_click` ✓ (the softest) · **NEW** `phone_wave_buzz` (across the house) · **NEW** `blimp_inflate_step` ×4 · `palette_step_F` ✓ · `crowd_hush` ✓ · `cloth_rustle` ✓ (the heads turn) · **R1:** **NEW** `headset_unclip` |
| **12** | **R1:** **NEW** `clicker_on_case` (a small plastic set-down) · **NEW** `placard_flip` · `key_tap_soft_01–06` ✓ (his post) · `post_click` ✓ |
| **13** | **NEW** `tape_pull` · `paper_flutter` ✓ · **NEW** `lectern_bump` ×2 (on the TV) |
| **14** | **NEW** `ui_verb_select` · `alert_bonk` ✓ ×2 (the greyed `come back`; `Open`) · `paper_flutter` ✓ (the IOU off the frame) · **NEW** `chair_hum_choir` (diegetic: the GPU choir chord) · **NEW** `box_set` · **NEW** `domino_set`, `domino_topple_run` · **NEW** `door_pivot_creak` · `screw_turn_1–4` ✓ · `nameplate_off` ✓ · **NEW** `plate_drop_box` · `orb_servo` ✓ |
| **15** | **NEW** `thumb_scroll` · **NEW** `hourglass_cursor_2008` · `orb_scan_sweep` ✓ · `ui_toast_pop` ✓ · `key_tap_soft_01–06` ✓ · **NEW** `pin_ping` (a soft tuned ping) · F2.2: the chant (voices) · **NEW** `laptop_keys_night` · `flame_whoomph` ✓ (the effigy catches) · **NEW** `fire_crackle` · `cloth_rustle` ✓ (his hand on the IOU) · **R1:** **NEW** `receipt_printer` (the `EXITS` printer, from the corridor: the out) · **R1 cut:** `tape_stick` (no hand tapes the note) |
| **17** | **NEW** `receipt_unroll_loop` · **NEW** `pen_chain_rattle` · **NEW** `car_honk_1–5` (tuned to the band's phrase ends) · **NEW** `car_window_down` · `phone_buzz_step_1–4` ✓ (the scramble) · `call_ring` ✓ · **R1:** `call_connect` ✓ · **NEW** `key_delete_run` · `pen_scribble_short` ✓ (`Updating.`) · **NEW** `thunder_tuned_F` (≤ 3 flashes per 24 frames) · **R1:** **NEW** `ink_run_drip` (rain on the receipt) · **NEW** `umbrella_pop` (far) · **R1:** **NEW** `ui_pause_tap` · **NEW** `blimp_lights_off` ×n · `ui_toast_pop` ✓ (the company's note) · **R1 cut:** `rain_into_glass`, the `VOICE 5` bonk, the location notification |
| **18** | **NEW** `beacon_motor` · `footstep_soft_1–4` ✓ (on bound drafts) · **R1:** the podcast chain (Neleh's takes through a small-speaker band-pass) · **NEW** `tv_click_off` · **NEW** `lanyard_drop` ×2 (one beat, both panes) · `pen_scribble_short` ✓ ×2 (Mada's minutes) · **NEW** `scroll_unroll_fall` (down the stairwell) · **NEW** `glint_tick` (soft, tuned; the CLOD boxes) · **R1:** `ui_toast_pop` ✓ (the reminder) |
| **19** | **NEW** `calc_tape_spool` · **NEW** `confetti_pop` · `crowd_stir` ✓ + **NEW** `crowd_cheer` · **R1:** **NEW** `lobby_laugh_s` (the crowd shot) · `call_ring` ✓ · `call_connect` ✓ · F2.1: `render_front_sweep` ✓ (into EARLY-WEB16), the 2008 camcorder's own lo-fi applause (diegetic), **NEW** `clicker_catch` · garden: **NEW** `gate_iron_swing`, **NEW** `lock_big_turn`, **NEW** `velvet_rope`, **NEW** `flower_nod` (tiny) |
| **20** | **R1:** `cloth_rustle` ✓ (the phone into his pocket) · **NEW** `lamp_click` · **NEW** `cage_door_shut` · **NEW** `padlock_snap` · `call_ring` ✓ (muffled inside the cage) · **R1:** **NEW** `docket_tab_flick` · **NEW** `rope_haul` · **NEW** `paper_stack_fall` → **NEW** `building_thud_big` (the THUD that ends the cue) · **R1:** `pin_ping` (TPOOL, in the dark room) |
| **22** | **NEW** `pin_fall` (soft) · **NEW** `footstep_gravel` ×n · `orb_scan_sweep` ✓ (no toast) · **NEW** `ui_band_on` / `_off` · **NEW** `paper_slide_under` · **R1:** **NEW** `mail_slot_return` (a flap and a soft roller: the designed stop, in room tone) · `cloth_rustle` ✓ (the pocket) · **R1 cut:** `mat_wipe`, `lock_click_soft` |
| **23** | `landing_thunk` ✓ (the suit) · **NEW** `page_turn` ×3 · `ui_toast_pop` ✓ (his post) · `orb_servo` ✓ · `orb_scan_sweep` ✓ · `orb_chime_F` ✓ · **NEW** `string_reel` · **NEW** `knot_tie` · **NEW** `string_taut` (tuned, the hook) · **R1 cut:** `fog_hiss`, the plank's `paper_tear`, `egg_pat`, `egg_roll_drop`, `egg_hatch` |
| **Outro** | Ep1's outro build: `orb_servo` ✓, `orb_scan_sweep` ✓, `orb_chime_F` ✓, `ui_toast_pop` ✓ |
| **Dialogue blips** (where a line is on a screen) | `blip_mas_*`, `blip_nole_*`, `blip_gerg_*`, `blip_alyi_*`, `blip_mario_*`, `blip_rumpt_*` ✓ (RUMPT's blip is the trombone; never in the score; **R1:** it carries his lower thirds in 8 and 23) |

- **NEW sounds:** about 95; most are short foley. Story sounds that carry a beat (the Go stone, the slot's return, the IOU under the door, the knob ticks, the screws, the docket tab, the `EXITS` printer) must read in their band against the mix (S11).

---

## 9. Build order and checks

The one-go order (LEARNINGS R2, R6, R7, R10, R15), each heavy step through `ops/heavy.sh`, one heavy job at a time:
1. **Script draft 6** from the proposal (the companion files regenerated once from it; **R1:** facts.md §E's WWDC row and the proposal's facts upgrades go in then).
2. **Facts:** pull the [proposal's list](proposal.md#facts-to-pull-before-lock) and AUDIT §5.1.
3. **Guardrails sign-offs, in writing (R1):** the political pair; "We'll hold a forum on it." at a real presser; the Aug 22 crop; sc 22's symbolic beat; the contested set and the picture check (proposal, [Guardrails pre-check](proposal.md#guardrails-pre-check)).
4. **Auditions before takes (R1):** the séance's room colour (two 30 s samples, judged against the corny bar); the VOICE 5 / CHATGTP human ear check.
5. **Takes:** Ep1's cast (Neleh's two new takes included); the new roles' auditions (§5.2), picks with written reasons; `audio/ep02/`.
6. **The stick reel** (real takes, a temp bed, the cue sheet's temp score and SFX); then the reads: a fresh newcomer cold read (N32's format, gaps flagged; **R1:** it must answer "why did Alyi leave?" with "it didn't say" and "why did Nole drop the suit?" with "the hearing was the next day", and raise no "is Alyi a person?"), an insider read, the transition table, the mood analysis, a sound audit.
7. **The EL-timed lock** (the master; hand-placed V.O. in the builder's spec; R9), then a per-act rebuild script copied for Ep2.
8. **In parallel once the timing locks:** the score (§6), the SFX (§8), the art (§1–§4), the facts and captions.
9. **Picture** per act, then the mix, the mux and the film in `out/ep02/v1/`; the intro variant in `out/ep02/v1/intro/`.
10. **QA:** the flash check streamed; −16 LUFS integrated and < −1 dBTP on the decoded encode; 0 decode errors; 0 A/V lag; **P5's eye pass at full 1080p** on every new shot (arms from shoulders, warm faces read warm, crops, read times, no stray cursor, props legible at their moment: the docket tab, the `PART` cards, Neleh's captions, the two May 14 posts); **R1: the rail check:** extract every rail's text from the lock and fail any word that isn't a month, a number, a year, a place or an event's own name; **R1: the picture check:** walk the proposal's list (no reflection turn or blimp look in sc 12; no compute line beside the IOU; no hand on the note in F2.2; the receipt from the printer; the pocket dial's glow; no mat, lock or hand at the white door).
11. **Release copy** in `production/v1/release.md` (M1–M5); the showrunner publishes.

**Laptop rules** (R10): every data-heavy command through `ops/heavy.sh`; Remotion `--concurrency=4`; fastrec `--workers 2`; `OST_WORKERS=2`; audio and frames in chunks; watch `/proc/pressure/memory`; one agent at a time during render and mix.

---

## 10. Resource asks

Non-blocking in this run: take the programmatic route and list the ask (R16).
- **Video-model credits** for 2.A's final layer (a mammoth in a snowy meadow; objects only).
- **ElevenLabs credits** for about 12 new roles' auditions (3–4 voices each), Neleh's two new takes, and the episode's takes.
- **One human viewer and listener** for: the Lex #419 lines against the video; Neleh's two lines against the podcast audio; **R1:** the VOICE 5 / CHATGTP ear check; the séance's room colour; the reel's pace; the newcomer questions (Move 37, Alyi as a person, why Alyi left, why the suit was dropped); the concept's accuracy; the score's moods by ear.
- **R1: a human performer** for RUMPT, for the episode that first voices him (GR §5–§6).
- **GPU** (optional): `sudo usermod -aG render,video jgon` makes the EEVEE renders for 2.H independent of the login session.
