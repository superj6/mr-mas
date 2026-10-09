# Ep2 v1: the production manifest (`ep1.1_her.wav`)

> **Status: 2026-10-08, for the one-go build.** Everything the episode needs, built from [proposal.md](proposal.md) (the agreed-quality flow; scene numbers are its numbers). For each item: what it is, where it's used, and whether it's **reused** from Ep1 (path), **copied** from Ep1 into Ep2's tree (Ep1 is locked: copy, never edit; LEARNINGS R1), or **new**.
>
> **Nothing has been built.** Paths below are sources to read; every new file goes under Ep2's locations (§0).

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
| **SET-01** | **NopeAI lobby** (the cathedral's narthex), by day, at a watch party, next morning | 1, 13, 19 (lobby), 20 (Jun 11, left pane) | **reuse** `shared/pixel/rooms/lobby.ts` (rack pillars, votives, neon `NOPE AI`, the DAYS SINCE sign), dressing pattern from `rooms/lobby-deal.ts`; the lobby TV from `kits/tv-news.ts` | the wall-sized screen with a bezel (AROS in sc 1; ELPPA's keynote in sc 19); beanbag rows; DOT's ladder; the second sign (`SUED MAS`); the glass doors' sidewalk view (the `PAUSE` sign, for the swing only); flyers on the pillars (fresh in 13, curling in 19, Mas's upside-down one); the confetti pile; the hand truck's path along the floor |
| **SET-02** | **NopeAI boardroom**: the séance (night), the Mar 8 meeting (morning), the committee (May 28) | 4, 4A, 18 (left pane) | **reuse** `rooms/boardroom.ts`, `rooms/boardroom-head.ts`, `rooms/board-screen.ts` (the wall screen with reflections) | candles (and the candle-lit palette); the Ouija board of reply chevrons with a Go-board corner; the planchette (a brass-rimmed planchette whose lens shows a pointer glyph; it must read as a planchette, never a free cursor, P6); the ceiling hole and cable; the knob wall; the `SAFETY AND SECURITY COMMITTEE` banner; the TV's podcast player and the board's statement card |
| **SET-03** | **NopeAI's first office, Feb 2018** (T3 cut-paper, by day) | 4 (F2.3) | **copy** Ep1's `episodes/ep01/pixel/act1/art/v35.ts` (`office2018`, Jun 2018 at night) and `act2/art/v35.ts` (`office2019`, by day; the T3 tier) into `studio/src/episodes/ep02/pixel/` | four months *before* Ep1's Jun 2018 night: fewer racks; the arena on one monitor; a whiteboard with `AGI` and three crossed-out arrows; a Go stone on a desk; the all-hands crowd in rows; the ladder and ceiling hatch; the window glass with Alyi's profile |
| **SET-04** | **Move 37: the board and the knob wall** (T3) | 4 | **new**, an inset in SET-02's board corner | a 19 × 19 grid in cut-paper; slate and shell stones; the stone click; `MAR 2016 · GAME 2 · MOVE 37`; the wall of tiny knobs behind it (the ghost's chevrons rearranged), every knob ticking one pixel-step per replayed stone; no players, no hands |
| **SET-05** | **XEL's studio** | 6 | **new** | a black curtain, two chairs, one mic on a stand in five held sizes; one locked two-shot drawing (the mic's meter frame); the `PART 1 OF 6` sign; a producer's hand |
| **SET-06** | **The cathedral, cut away** (a dollhouse cross-section) | 7 | **reuse** `rooms/drill.ts` (Ep1's odometer drill: the odometer still in the bedrock) and the dark room's top floor | the two halves sliding apart; Macrosoft's plinth `BELOW · ABOVE · AROUND`; the basement with `DEFLECTION (LICENSED)` boxes; lights clicking on floor by floor; the whole-pixel pan up the section |
| **SET-07** | **Mas's dark room** | 8, 23 | **reuse** `rooms/darkroom.ts`, `rooms/darkroom-plate.ts`, `rooms/darkroom-act3.ts` (the Orb's home spot); `kits/mas-monitor.ts` (the monitor as a stage: `[POV]` and `[OTS]` painters); Ep1's tag's framed `GUEST` lanyard | the `SO SCARY` balloon bobbing at the ceiling (sc 8 → 23); his calendar UI; the replay player UI (two dates: `FEB 2`, `JUN 13`) |
| **SET-08** | **The TV stand-up on the hill** (inside the replay) | 8 | **copy** the intro's podium hill (THE PODIUM, P01) from the intro build | a camera on a tripod, a light on a stand, the operator; the viewfinder's frame lines; an unbranded lower third; the over-long red tie running down the hill |
| **SET-09** | **The news-desk lineup** (on the monitor) | 8 | **new** (small) | a desk, a height chart, three cardboard cutouts in lanyards, an unplated host |
| **SET-10** | **The demo stage**: the wings (work-light palette), the stage from the house, the front row | 9, 11, 12 | **reference** Ep1's DevDay painter (`kits/monitor-items.ts` `devdayPainter`) and `rooms/duel-split.ts`'s demo stage; **new** as a full room | road cases and cables; a monitor in the wings; the stage with its big screen and the spotlight (one locked wide: the spotlight's meter frame); the tiled audience; the roped front row, the `RESERVED: CHIEF SCIENTIST` placard and its chrome armrest (a reflection surface); the lighting rig the blimp blocks |
| **SET-11** | **THE PLAN: `OMNI`** | 10 | **reuse** `kits/blueprint.ts` (show-wide), `kits/bp-pointer.ts` | the sheet: `BEFORE` (three boxes as clerks, the grate) → `NOW` (one box); three steps; the tiny stage; the empty bubble; the tear |
| **SET-12** | **The open floor** (the find-the-man spread) | 14 | **reuse** `rooms/bullpen.ts`, re-dressed; the UI band from `shared/pixel/ui.ts` | the spread: tiled staff, glass walls, polished heatsinks, a coffee urn, a spoon in a mug, a chiller puddle; pedestals of literally shiny products (`NEW!`); Alyi's office door on a centre pivot; the band's verbs and inventory |
| **SET-13** | **Alyi's office** (2024, empty; 2023, with his chair and his screen) | 15, F2.2 | **new** | a desk with no chair (2024); the same room in 2023 at night with his chair, his screen, the door frame where he tapes the note |
| **SET-14** | **The holiday party, Dec 2022** (T4 glossy) | F2.2 | **copy** Ep1's `episodes/ep01/pixel/act3/art/party.ts` (the Sep 2023 party) as a base, re-lit | palette-cycled string lights; silhouettes; a corner of humming racks whose status lights become token streams (the glyph runs across the room, never his eyes) |
| **SET-15** | **The leadership offsite, 2023, at night** (T4) | F2.2 | **new** | a lodge doorway; the wooden effigy (a paperclip robot, our design) stencilled `UNALIGNED`; the fire, palette-cycled, never strobing; staff in silhouette; trees |
| **SET-16** | **The Bay Bridge**, mid-span, by day, then in rain | 17 | **reference** `rooms/bay-bridge.ts` (Ep1's view across the bay); **new** deck set | five lanes of traffic, the pedestrian lane, the receipt layer under the tires; three parallax planes; the **camera-scroll extension** (production P4); the storm cloud with a blank letterhead; the rain; the far shore for the umbrella egg |
| **SET-17** | **Misanthropic's lighthouse** | 18 (right pane) | **reuse** `rooms/lighthouse.ts` (Ep1's; its header names Ep2 on) | Ekiel on the stair with his box; Adelina at the top; Mario's desk with a scroll; the glass case of CLOD boxes (the last one's art is the Golden Gate Bridge); the beacon's sweep |
| **SET-18** | **The split** (two 238 × 203 panes, a 4 px divider) | 18, 20 | **reuse** `rooms/duel-split.ts` (Ep1's split grammar) | the stepped-down pane (one palette rung) and room tone panned to its side |
| **SET-19** | **ELPPA's campus, the keynote crowd** (outdoor) | 19, 20 (left pane) | **new** | a lawn, a giant outdoor screen showing the keynote, the backs of a crowd, generic architecture in ELPPA's off-brand colours (**no real building, logo or trade dress**); the crowd thinning (sc 20) |
| **SET-20** | **F2.1: the 2006 street corner** (EARLY-WEB16; the TSOOB ad) and **the 2008 keynote stage** | 19 (F2.1) | 2006: **new** (small); 2008: **copy** `studio/src/dev/meras/era2008.ts` and `mas08.ts` (the intro's own 2008 frame: THE SLEEVE tosses the clicker, Mas catches it, the collars pop) | the 2006 ad's end card; the GPS breadcrumb drawn across the 2024 stream's stage; the match cut from the 2008 clicker to the 2024 phone |
| **SET-21** | **The walled garden** | 19 | **new** | a perfectly square-cut hedge wall with one gate; a lock as tall as MIT KOOC; beds of phone-shaped flowers; a bench with IRIS; outside the hedge for Mas and Radnus; the reverse from inside the gate (the line crossed on purpose) |
| **SET-22** | **The zAI lobby** | 20 (right pane) | **new**; Nole's post lamp from `rooms/nole-desk.ts` | the brand-new birdcage with its shipping tag; the rafters' banner `KORG 2: NEXT QUARTER`; the stairwell to a landing four floors up, backlit by morning windows |
| **SET-23** | **ISS: the white cube on an empty lot** (**real 3D, Tier 2 leap 2.H**) | 22 | **new**, Blender 4.5.3 EEVEE (`~/Downloads/blender-4.5.3-linux-x64/blender`; renders on the iGPU) | a white cube with one handleless door, a brass plate and mail slot, the sign, the `NO` doormat, an empty lot under overcast sky; rendered to the shot list at 1080p max; **the pixel Mas (walking in) and Alyi's pixel reflection (in the brass) composited on top, keeping the contrast** (no grade match, no pixel rim, no down-rez) |

---

## 2. Characters on screen

**Rigs live in `studio/src/shared/pixel/cast/`** unless marked. "Reuse" means import; any new pose for a shared rig goes in an Ep2 file that composes the rig.

### 2.1 Principals and recurring cast (rigs exist)

| Character | Scenes | Rig (reuse) | New poses or states for Ep2 |
|---|---|---|---|
| **MAS** | every act | `mas.ts`, `mas-stand.ts`, `mas-seated.ts`, `mas-medium.ts`, `mas-cu.ts`, `mas-turnaway.ts`, `mas-collars.ts` (three collars, no pop) | the Publish click (Ep1's `kits/launch-button.ts` grammar: his finger, no hover); standing behind a chair, then sitting (4A); the slow-motion walk (4 held drawings); typing on his phone in the wings; holding the clicker; sitting on a desk edge; standing on the receipt with glass and phone; the scramble (thumbs); taking a lanyard from a hand; at the edge of an outdoor crowd; outside a hedge; wiping his feet; raising a hand to knock and lowering it; walking in a 3D lot (composited) |
| **YOUNG MAS** (2006, 2008) | F2.1 | 2008: `studio/src/dev/meras/mas08.ts` (copy) | 2006: **new**, a flip phone and a bobbing pin, EARLY-WEB16 |
| **GERG** | 1, 4, 9, 13, 19 | `gerg.ts`, `gerg-stand.ts`, `gerg-medium.ts`, `gerg-poses.ts`, `gerg-speak.ts`, `kits/gerg-laptop.ts`; call tile `calltile.ts` | typing on a beanbag; at the séance table's corner; on a road case; his one look-up; on a call |
| **RIMA** | 9, 10 (O.S.), 11, 12 | `rima-stand.ts`, `rima-speak.ts`, `rima-v5.ts` | on stage in the spotlight, three light states (lit, half-lit, dark); clicking to the next slide; the clicker hand-off |
| **ALYI** | 4 (brass, glass), 12, 14, 15 (F2.2), 22 | `alyi.ts`, `alyi-speak.ts`, `alyi-v5.ts`; Ep1's party toast art (`episodes/ep01/pixel/act3/art/party.ts` `partyToast`, **copied**) for the 1 s in the chrome | **reflections**: one drawing in two angles, palette-remapped per surface (candlestick, planchette rim, chrome, heatsink, urn, spoon, window, the 3D brass plate), never warped; F2.2: a silhouette in profile raising one hand; lit and laughing; at his screen with Ekiel; writing and taping the note; a silhouette in a lodge doorway. **A person throughout** (P8): the intro's roll call shows his face first |
| **NOLE** | 4, F2.3, 20 | `nole.ts` (lit / sil / fade states; arms phone, jab, point, raise); his lamp from `rooms/nole-desk.ts` | the cable drop through the ceiling and the rocket back up; holding the relit candle; slapping his phone down; F2.3: at the front of the all-hands (T3), climbing the ladder; at the cage; a silhouette hauling a rope on a landing |
| **GHOST-NOLE** (2016, 2018) | 4 | **new** render of `nole.ts` in the ghost treatment (translucent reply chevrons, the spirit-photo pass); 2018 adds a hoodie | holding up its dated header |
| **TERB** | 4A, 18 | `terb.ts`, `terb-sheet.ts` | reading a sheet; holding out a lanyard; clicking the TV off |
| **MADA** | 4A, 18 | `mada.ts`, `mada-medium.ts` | perfectly still during the reading; writing in the minutes |
| **TASYA** | 7 | `tasya.ts`, `tasya-medium.ts`, `tasya-speak.ts`; `kits/key-ring-insert.ts` | in the basement doorway; a key twisted off and growing back |
| **MARIO** | 18 | `mario.ts` | writing without looking up; finger raised; setting his pen down |
| **ADELINA** | 18 | `adelina.ts` | raising and dropping a lanyard |
| **RADNUS** | 19 (garden) | `radnus.ts` | rising into frame along the hedge, politely on fire |
| **THE ORB** | throughout | `orb.ts`, `orb-medium.ts`; `kits/orb-toast.ts` | the chandelier at the séance; scanning a hourglass (`verified: 2008`); toasting nothing at the white door; the TERMINAL scan of a crowd (tag); the outro |
| **CHATGTP** | 9, 11, 19 | `chatgtp.ts` (Ep1's form: a bubble with dot eyes) | **its Ep2 face**: ears, eyes and a mouth in three held steps (one chip note each); three mouths for the harmony; token eyes for 5 frames; `😊`; a `GUEST` wristband on its tail; a tiny raised hand |
| **REMUHCS** (+ three colleagues) | 13 (on the TV) | civic kit: `cast/civic-extras.ts`, `cast/civic-kit.ts` (the colleagues are unnamed and unplated) | behind a bill-shaped lectern; aides turning it sideways at a `FLOOR` door |
| **THE SLEEVE** | F2.1 | `studio/src/dev/meras/era2008.ts` (copy) | as the intro draws it: a sleeve tossing a clicker. **No face, no frailty cues** |
| **NEDIB** | 23 | props only (`kits/eo-signing.ts`, his scroll) | the scroll's torn corner |
| **NELEH** | 18 | **not drawn**: her words are a transcript in a podcast player | — |
| **THE QUIET VOTE** | 18 | a byline egg only | — |

### 2.2 New characters (rigs to build; parody names from `show/bible/naming.md`)

| Character | Scenes | What to build | Guardrails |
|---|---|---|---|
| **SELBEEP** | 1 | standing, pointing a remote the size of a clapperboard; proud; medium rig with lip-sync | none beyond the general rules |
| **DOT** | 1, 14 | back to camera only, orange lanyard, up a ladder; her hands in an orange cuff with a screwdriver (four screws, one per beat) | her face is never shown (Ep5); nobody names her |
| **XEL** | 6 | seated, very still; lip-sync; in the locked two-shot | voiced only in a library voice; never an impression |
| **THE HUMANIST** | 7 | carrying boxes; turning to the doorway | no accent humour |
| **The NEWS-DESK HOST** and **three cardboard CEO cutouts** | 8 | a seated host who turns to the lens; flat cutouts in lanyards | the host is unplated (A14) |
| **The DEMO ENGINEER** (stock) | 9, 11 | headset, `DEMO` lanyard, holding a phone up; a walk; one medium rig (budget it) | a generic composite; never an `[OTS]` subject |
| **BUKAJ** | 14 | seated in the humming chair, a box of printouts, one hand flat on the armrest | — |
| **EKIEL** | 14, F2.2, 18 | walking with a box, squinting (two glowing rectangles in his eyes in 18); at a screen beside Alyi (F2.2); climbing the stair | no accent |
| **THE FORECASTER** | 17 | walking up the pedestrian lane; a watch and a clipboard; not taking the pen; crossing out an hour; walking off; an umbrella printed with a probability curve (far shore) | his refusal is principled; no invented probability |
| **The DRIVER** | 17 | in a car window, hand on the horn, reading the receipt | — |
| **HARAS** | 19 | walking in with a calculator tape unspooling; dropping onto a beanbag; writing on the tape | — |
| **MIT KOOC** | 19 (garden) | holding one key as tall as he is; turning it | unplated (A14); company to company only (X2) |
| **RUMPT's hands** (and the over-long red tie) | 8, 23 | hands in navy sleeves over a gold podium's edge: pumping a balloon, slapping a sticker, sliding a plank, reeling a string, tying a knot | **voice and hands only; the face is never shown**; no fist pumps; props and pose only |
| **The CAMERA OPERATOR** | 8 | at an eyepiece; stepping over the tie; one look up | a generic person |
| **ISOLEP's hand** | 23 | a hand in a suit sleeve: a pat, a nudge | the rail and pop-ups carry her |
| **STAFFERS** (séance, lobby, open floor, audiences, all-hands, party, campus, zAI) | many | recolours of `employee-stand.ts`, `civic-extras.ts` and the tiled-employee rigs; silhouettes where marked | nobody real; nobody named |

### 2.3 Creatures and objects that act

| Thing | Scenes | Build |
|---|---|---|
| **The mammoth** | 1 | pixel: 8 drawings held 3 frames each, palette-cycled fur, gliding one whole pixel a frame; its own colour ramp (its footprints stay in the carpet in that ramp); a fifth leg flickers for 2 frames at the step-out. Near-photoreal in the bezel: §4 |
| **The ghosts** | 4 | email threads made of translucent reply chevrons, each with a dated header; the `!` ghost; the spirit-photo double exposure (2.G) |
| **The cow** | 4 | a cow made of chevrons; a charging cable for a tail, its plug stamped `ALSET`; chewing |
| **The blimp** | 11, 12, 17 | a lowercase `her` blimp in four held sizes, a tether, running lights that click off one by one; sagging three pixels |
| **The storm cloud** | 17 | a cloud with a blank letterhead; it rains letterhead |
| **The `SO SCARY` balloon** | 8, 23 | a chatbot-bubble balloon with a smiley face; one held size per pump; the sticker; bobbing; reeled in; the string going taut |
| **The hydra** | 23 | an egg on a bill; it hatches into a one-headed hydra labelled `1047` that looks left, right, and swallows |
| **IRIS** | 19 | a small progress bar with a face, stuck at `99%` |
| **The receipt** | 15, 17 | thermal-paper receipt that noses under a door and unrolls lane by lane (a scrolling layer with legible lines) |

---

## 3. Props, inserts and UI

| Prop / insert | Scenes | Source | Note |
|---|---|---|---|
| The DAYS SINCE signs and number plates (`86` → `100`; `202`; second sign `SUED`: `0`, `102`) | 1, 19 | **reuse** the sign in `rooms/lobby.ts`; new second sign | arithmetic checked |
| The complaint `YOU PROMISED!!!` on a hand truck; pages of `!`; contents `!`/`!!`/`!!!`; later `(FOR NOW)`; the refiled `NOLE v. MANALT ET AL. · FEDERAL COURT` with pages `!!`, `!`, `.` | 1, 20, 23 | new | the cover never names Macrosoft (it joined in Nov) |
| The `WHERE IS ALYI?` flyer (a doorway photo) | 1, 13, 19 | new | |
| The `PAUSE` sign through the door glass | 1 | new | a group sign only; no date, group or grievance |
| Mas's water glass (no ripple), three uses | 1, 4, 17 | **reuse** the glass from Ep1's inserts (`kits/inserts-mas.ts`) | the coffee jumps; the flame jumps; rain falls in |
| The post `NOPEAI AND NOLE` with its byline row; Publish | 4 | new (the editor grammar of Ep1's vision post, `act1/art/v35.ts` `editorPOV`, copied) | |
| The Ouija board, the planchette, candles, the Go corner and stones, the knob wall | 4 | new | the planchette reads as a planchette |
| Nole's phone; his lamp | 4, 20 | `nole.ts`; `rooms/nole-desk.ts` | the lamp's tell: it doesn't click on at "You kept them." |
| Terb's single sheet; nameplates `MAS MANALT · BOARD`, `OMIS · [TITLE PENDING]` | 4A | `cast/terb-sheet.ts`; new plates | |
| The calendar invite `XEL · LONG-FORM · MAR 18 · 2 HRS` | 4B | **reuse** the look of `kits/phone-invite.ts` | |
| XEL's mic (five sizes); `PART 1 OF 6` | 6 | new | |
| Tasya's key ring (LE CHIEN's paw-print key; a key that grows back; the `MAR 19` stamp); the `INQUIRY` envelope | 7 | `kits/key-ring-insert.ts`; new envelope | |
| `DEFLECTION (LICENSED)` boxes; the plate `THE HUMANIST · MACROSOFT'S NEW AI CHIEF` | 7 | new | |
| The replay player (`FEB 2`, `JUN 13`); the lower third; the `SO SCARY` sticker | 8, 23 | new | the lower third is the broadcast's own, unbranded |
| The RULEBOOK notification (a 400-page book with a `SNOOZE` button on its spine) | 8 | new; `kits/phone-alert.ts` grammar | the button stays unpressed (Ep8) |
| The segment's title card `"MAS, TASYA AND RADNUS"` | 8 | new | |
| His calendar (`ELGOOG · DEVELOPER KEYNOTE · TUE 14`; `NOPEAI · SPRING UPDATE` set on `MON 13`) | 8 | new | |
| The wings' monitor; `yes!!`; the `[laughter]` tag; the `VOICE` panel (`VOICE 1`–`5`, `SINCE SEP 2023`, five hellos) unfolding onto a drafting grid | 9 | new | |
| THE PLAN sheet | 10 | `kits/blueprint.ts` | `232 MS (AVG 320)`; `MON`; `$0`; the empty bubble |
| The big screen; CHATGTP's face; the spotlight; the fogged glasses; his phone typing `h` `e` `r` and the post UI; the wave of phones; `is it safe?` | 11 | new; `kits/post-any.ts` / `kits/post-card.ts` for the post | the post types at a post's pace, off the beat |
| The clicker | 12, 19 (F2.1) | new; the 2008 clicker from `meras/era2008.ts` | |
| The `RESERVED: CHIEF SCIENTIST` placard (flips blank); the chrome armrest | 12 | new | |
| The roadmap lectern `ROADMAP · $32B/YR`; the `FLOOR` door | 13 | new (on the lobby TV) | |
| The suggestion strip (`> where are you going?` · `> can we talk?` · `> ~~come back~~`); `congratulations.`; `need anything?` | 14 | the phone strip from Ep1 (P6: his choice is the strip, never a cursor) | |
| Ekiel's dominoes (two legible posts in their own UI) | 14 | new; post UI from `kits/post-any.ts` | |
| **The IOU** `IOU: 20% COMPUTE`, tag `PLEDGED JUL 2023` | 14, 15, F2.2, 22 | Ep1's note (`episodes/ep01/…`, as aired) redrawn in Ep2 | **no `NEVER DELIVERED`** anywhere (decision D-09) |
| The `SUPERALIGNMENT` / `SAFETY TEAM` plate; four screws; the `MISC` box, label `MAY 17` | 14 | new; `kits/inserts-hands.ts` grammar for the hand | |
| Alyi's regret post with Mas's three hearts (`NOV 20, 2023`) | 15 | **copy** Ep1's post card | |
| TPOOL on a 2024 phone (`LAST UPDATED 2012`, `welcome back, mas`, a 2008 hourglass); the map (`LAST SEEN: 2012`; `LAST SEEN: 2023 · BONFIRE`) | 15, 17 | new | |
| The Superalignment post UI (`INTRODUCING SUPERALIGNMENT · ALYI, EKIEL`); `20% OF THE COMPUTE WE'VE SECURED TO DATE` · `FOUR YEARS` | F2.2 | new | its words are the record's |
| The effigy `UNALIGNED` | F2.2 | new | no religious iconography |
| The receipt (`NON-DISPARAGEMENT`, `IN PERPETUITY`, `CLAUSE 9…`, the coupon); the pen on a bank chain; the Forecaster's clipboard and watch | 17 | new | |
| The scramble on his phone (screenshots of a clause; a grey `LEGAL` tile; `request for comment`) | 17 | new; `kits/phone-high.ts` | the legal tile is a grey icon, never named |
| His apology post, four trims | 17 | post UI | his real lowercase |
| The voice menu, `VOICE 5 [PAUSED]` greyed with `Hey.`; `ALYI · LOCATION UPDATED` | 17 | new | |
| The lanyards (page `212`; `SAFETY COMMITTEE`); Mario's scroll; the CLOD boxes (the Golden Gate art); the op-ed clipping `NELEH & THE QUIET VOTE` | 18 | new; `cast/clod.ts` for the boxes | the name GOLDEN GATE CLOD is never printed |
| The boardroom TV's podcast player (transcript running, muted) and the board's statement card | 18 | new | her words only; the reply beside them |
| Haras's calculator tape; the desk confetti cannon; the stream's `…AND LATER THIS YEAR: CHATGTP.` | 19 | new | |
| The 2006 ad's end card `"WHERE YOU AT?"`; the GPS breadcrumb | F2.1 | new | |
| The gate, the key, the lock, the velvet rope, the `GUEST` wristband, the phone flowers | 19 | new | never rings, altars or vows |
| The Faraday birdcage; the padlock; Nole's post `…an unacceptable security violation… stored in a Faraday cage`; `MAS`; `MISSED CALL · MAS`; the sticky `(FOR NOW)` | 20 | new | caller ID legible at half-pane `[ECU]` |
| The white door's sign `"one goal and one product"`; the `NO` doormat; the mail slot; `Use IOU: 20% COMPUTE on door` | 22 | 3D (SET-23); the band from `shared/pixel/ui.ts` | |
| The fog replay; the `PLATFORM` plank; NEDIB's EO 14110 scroll; RUMPT's HTURT post `…and she 'A.I.'d' it…`; the Orb's TERMINAL scan; ISOLEP's pop-ups `"well-intentioned"` / `"ill informed"`; the plate `RENEIW'S BILL · CALIFORNIA AI SAFETY · HEADS: 1`; THE PODIUM | 23 | new; `kits/eo-signing.ts` for the scroll | ISOLEP's tags keep her statement's lowercase |
| Name cards (2-TONE FREEZE): `SELBEEP / DIRECTOR OF MAMMOTHS.` (`MAMMOTHS CONTAINED: 0`) · `XEL / INTERVIEWS MAS. AGAIN.` (`EPISODE: 419`) · `EKIEL / CO-LED THE SAFETY TEAM.` (`SQUINT: 100%`) · `THE FORECASTER / EX-NOPEAI.` (`AT STAKE: ~$2M`) | 1, 6, 14, 17 | `shared/pixel/freeze.ts` | at least 1.2 s; cards at least 45 s apart |
| Plates (no freeze): `NOLE · FUNDED IT. LEFT IT. SUING IT.` · `THE HUMANIST · MACROSOFT'S NEW AI CHIEF` · `BUKAJ · NEW CHIEF SCIENTIST · INHERITED THE HUM.` · `HARAS · FIRST CFO` · `RENEIW'S BILL…` | 4, 7, 14, 19, 23 | `shared/pixel/plate.ts` | name plus one relation word |
| Rails (date chyrons): `FEB 15, 2024` · `FEB 29 · NOLE SUES NOPEAI` · `MAR 5` · `FEB 20, 2018` · `MAR 8` · `MAR 19` (on the key) · `MAY 13` · `MAY 14 · ALYI LEAVES NOPEAI` · `DEC 2022` · `2023` · `MAY 17` · `MAY 18` · `MAY 20 · A FAMOUS VOICE OBJECTS` · `MAY 28, 2024` · `JUN 10 · CHATGTP IS COMING TO ELPPA'S PHONES` · `JUN 10` · `JUN 11 · NOLE DROPS HIS STATE SUIT` · `JUN 19 · ALYI FOUNDS ISS` · `JUL 8` · `AUG 5` · `AUG 11` · `AUG 16 · ISOLEP` · `AUG 22` | | the rail builder | never on screen with a V.O. line or a toast |

---

## 4. Style leaps, passes and video-model inserts

| Id | Tier | Scene | Filler (programmatic, first) | Final | People in it |
|---|---|---|---|---|---|
| **2.A** · the AROS mammoth | 2 · near-photoreal in a bezel | 1 | a three.js PBR mammoth walking in a snow plate, built to hold at screen size; the pixelize step at the bezel (the genvideo converter's logic, `shared/pixel/genclip.ts`, `GenVideo.tsx`); then the 8-drawing pixel mammoth | **video model, objects only**: a woolly mammoth in a snowy meadow, plodding toward camera, smooth at 24 fps, silent (E2-1 SYNTH) → the step-out stays our conversion | **none**: no person, face or hand in the plate |
| **2.H** · the white room (new) | 2 · real 3D | 22 | Blender EEVEE (overcast HDRI-free soft light; white cube, door, brass plate, mail slot, mat, lot); the pixel Mas and the pixel reflection composited | Blender (the filler may be final) | **none in 3D**: Mas and Alyi's reflection stay pixel drawings |
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
- **Flash and read checks** (P15) on every render, streamed in chunks through `ops/heavy.sh`.

---

## 5. Voice cast

**One film, the ElevenLabs cast** (Ep1's `audio/ep01/v3-el/cast-el.json`; read it, never edit it: Ep2 gets its own `audio/ep02/cast-el.json`). Model `eleven_multilingual_v2`. Library voices only (ElevenLabs premade or shared Voice Library voices called by `voice_id`): **no cloning, no voice design from anyone's audio, no "sounds like" prompts, no laugh mimicry, no voice chosen for resembling a real person** (S6; guardrails §5–§6). The house respellings carry over (`Mas` → "Moss", `Gerg` → "Gurg", `Alyi` → "Al-yee", `Nole` → "Knoll", `Macrosoft` → "Mack-roh-soft", `CHATGTP` → "Chat G-T-P"…); new names get forced-choice checks (`tools/pron_check.py`'s method): MINDDEEP, ELPPA, TSOOB, ISS, KORG, HARAS, BUKAJ, EKIEL, SELBEEP, XEL, AROS, RENEIW, ISOLEP, RETTIWT.

### 5.1 Voices that exist (Ep1's picks)

| Role | Voice (library) | Engine | Ep2 lines (≈) | Notes |
|---|---|---|---|---|
| **MAS** | Jeremy - Warm, Trustworthy, Sincere (`EwzF7Z2UMSib9JaKx0Kg`; Ep1's set A, candidate C) | EL | 24 spoken, **14 V.O.**, the intro's "her" | lane 105–125 Hz; spoken about 140 wpm; V.O. close and dry at 110–130 wpm (voices-el §AD's settings); the intro line fitted to the intro's frames as Ep1's (voices-el §Y) |
| **GERG** | Marcus - Bright, Upbeat and Clear | EL | 12 | the Move 37 explanation is his longest read: record it whole |
| **RIMA** | Mia - Clear, Smooth, Professional (Harper on file as B) | EL | 11 | THE PLAN's four lines O.S., composed |
| **NOLE** | Ryan - Confident and Bold | EL | 11 | bursts; "You kept them." quiet |
| **GHOST-NOLE** | the same voice (Ryan) | EL + treatment | 3 | the ghost treatment: a short dark reverb and a chip doubler a hair late; "Yup" read twice, different seeds |
| **TASYA** | Tyler Kurk - Smooth, Pleasant and Clear | EL | 4 | warm, unhurried |
| **TERB** | Ethan - Calm, Optimistic and Clear | EL | 6 | the Mar 8 finding and the May 28 sentence read whole, weighted |
| **RADNUS** | Dylan Malc - Calm & Educational | EL | 1 | quick, apologetic |
| **CHATGTP** | Maya - The Upbeat Creator | EL | about 10 | "one wo-o-ord." in three parts through the intro's sung-vocal pipeline (not TTS) |
| **REMUHCS** | Marc Laurent - Confident and Engaging | EL | 1 | on the TV chain |
| **MARIO** | Kokoro `am_liam` (a-liam-earnest) | **Kokoro**, matched into the EL room | 5 | level, room, chain and EQ matched (voices-el §AB3); within about 1 dB of Ekiel beside him |
| **ALYI** | Louis - Deep, Profound and Thoughtful | EL | the chant's first "FEEL THE AGI!" only | the one Alyi voice in Ep2; he leads, the crowd follows |
| **STAFFER** | Avery (Ep1's tiled employee) | EL | 2 | |

### 5.2 New roles (audition 3–4 library voices each; pick by measurement and a written reason, as voices-el §AA and §AC2)

| Role | Ep2 lines (≈) | Brief | Lane (guide) | Separation to check |
|---|---|---|---|---|
| **SELBEEP** | 4 | a proud showman presenting to a room; bright, pleased with himself; never a real person's cadence | 120–150 Hz | Gerg (they volley) |
| **XEL** | 7 | very slow, very still, low and even; long pauses inside questions are the meter; no impression of anyone | 95–120 Hz | Mas (they alternate in one locked frame) |
| **THE HUMANIST** | 3 | soft, polite, a little caught out; neutral American accent (no accent humour) | 110–135 Hz | Tasya |
| **The DEMO ENGINEER** | 6 | presenter-bright, nervous under it; his laugh recorded as a separate take | 125–160 Hz | CHATGTP, Rima |
| **BUKAJ** | 2 | soft, exact, warm | 110–135 Hz | Mas |
| **EKIEL** | 2 | quiet, dry, squinting; neutral accent | 110–140 Hz | Mario (Kokoro) |
| **THE FORECASTER** | 4 | conversational, precise, kind; a man who talks in medians | 110–140 Hz | Mas |
| **The DRIVER** | 1 | an everyday voice through a car window | any | the honks |
| **HARAS** | 4 | pleasant, precise, brisk | 165–200 Hz | Gerg |
| **RUMPT** | 4 | **a cartoon register**: big, brassy, a size too big for the room; **never an impression**; the prompt names and describes no one | 100–130 Hz | the reporters |
| **The stand-up REPORTER** (O.S.) | 2 | brisk, wrapping up a stand-up | 140–180 Hz | — |
| **The TV REPORTER** (O.S.) | 1 | a press-conference question, on the TV chain | any | Remuhcs |
| **STAFFER 2** | 1 | a second staff read | any | Staffer (Avery) |
| **VOICE 1–5** (the panel's hellos) | 5 one-word reads | five distinct product voices: `Hi.` · `Hi!` · `hi?` · `Hi…` · `Hey.`. **None imitates anyone; `VOICE 5` especially** (it's the slot that's paused): a library voice chosen for distinctness from the other four, nothing else | spread across lanes | each other |
| **The CROWD** (the chant) | 1 chant | 8–12 layered library reads after Alyi's lead, a holiday-party room, building from one to all | mixed | — |
| *NELEH* | — | **no take**: her line plays muted, as a transcript | — | — |

- **Budget:** the new roles' auditions run about 14 roles × 3–4 voices; the episode's takes come after the stick reel's script lock (Ep1 spent about 3,000–5,000 characters per phase; the episode's full set is the larger spend).
- **Recording rules** (voices-el): long reads recorded whole and cut by the lock; cut-offs recorded complete ("…one of my favorite things."; "And profit?"); hand-placed V.O. kept in the spec the lock builder reads (R9); the `--fixed` trap noted.
- **The mix:** dialogue −16 LUFS, V.O. −18 at the take; the film at about −16 LUFS integrated, true peak under −1 dBTP, measured on the decoded encode (S8).

---

## 6. Score cues

The show's own sound (OST-BIBLE §0): every cue on the 96 BPM grid; built from the knee's cells; chip in every cue except the exits from his POV; swung for people, straight for the machine, the board, the record and THE PLAN; **no third anywhere** (no A♮ over F before Ep12); one continuous performance per sequence, ducking and thinning under real lines, never stopping except at designed stops. Folders `audio/ost/tracks/e02-v1-<seg>/`; renders via the engine with `OST_WORKERS=2` through `ops/heavy.sh`.

| Cue | Scenes | Palette | Motifs | Length (≈) | Mood | Source | Designed stops and outs |
|---|---|---|---|---|---|---|---|
| **E02-01 The Mammoth** | 1 | SET-PIECE SWING, low, chip lead only | the Build's chip lead; the knee's first four notes | 50 s | wonder → suspense → comic jolt | new to picture, from MM-16 (Odometer kit) stems | thins to a bass pedal on the first THUD; out: the knee's first four notes on dry piano, cut on the smash |
| **MT** (intro) | intro | the main title (V1, locked) | the knee | 30 s | — | `audio/intro/` (Ep2 variant mix: the VO "her", Jeremy) | the D♭ lands in the typing indicator's silence |
| **E02-02 The Séance** | 4 | ROOM COLOUR (the séance organ: reed organ and chip, F minor; no liturgy, no hymn) → Move 37 colour → ERA T3 (cut-paper chamber) → organ | Nole's Launch (the stack three times, each shorter; the sincere version on slow horns in F2.3; one note short on his exit); the Go figure on the open fifth | 3:05 | a ghost-story giggle; comedy; **wonder and a chill** (Move 37: celesta and chip over the organ's pad, the knobs as soft pizzicato grains); melancholy (2018) | new (MM-21 Room Colours, Ep2) | crossfades on the smoke (in and out); the last candle: the organ's last chord rings into E02-03 |
| **E02-03 Procedure, March** | 4A | PROCEDURE (low strings, brushed snare) | — | 35 s | dry, institutional | new short, or MM-09 stems | thins to its pedal under the reading (the record plays dry) |
| **E02-04 Long-Form** | 4B → 6 | MM-21 media bed: an original podcast-intro sting | — | 6 s, then none | — | new | **then no score in the studio** (the padded room tone is the joke); SET-PIECE SWING enters on the curtain |
| **E02-05 A Tenant** | 7 | SET-PIECE SWING, low → Tasya's Rhodes, one chord | — | 45 s | comedy with a chill | new | out: the key ring's jangle on the downbeat (diegetic) |
| **E02-06 Dark Room, Spring** | 8 | DARK ROOM (MM-01 Water Line, library) + tiny media beds | **RUMPT's Podium in FEAR**: cup-muted trombones and horns, pp, E♭ minor, tremolo low strings, a timpani roll (MM-19); a news-desk sting | 45 s | dry amusement; a small thrill | library + new beds | the band holds one chord under his real words; out: the walk-on tune warming through a wall |
| **E02-07 One Word** (one tune in three rooms) | 9, 10, 11, 12 | the demo's walk-on (heard through the wall) → **BLUEPRINT** (THE PLAN: the tune as a chip music-box waltz, pizzicato, harp, celesta, F dorian; no piano, no brass, no V.O.) → the demo cue (swung, chip lead, light band) | the knee's step cell in the tune; **THE COPY** (a chip echo a note late) under the three-part harmony; **the Door with its first note missing**, once, on the reflection (sc 12) | 4:00 | nervous fun; the explainer's lean-in; **the biggest laughs**; a wince; sudden quiet | new (P) | a tape-stop at THE PLAN's tear; thins to a pad under the post; **stops mid-phrase on the downbeat** at the midpoint act-out |
| **E02-08 Where's Alyi?** | 13, 14 | THE CLOCK, first step (a pizzicato and woodblock tick on varied pitches under the knee's rising F G A♭ C) | **the Door** with its first note missing, blooming on each reflection; **the GPU choir chord** (D♭ sus2(♯11), no third) as the chair's hum, diegetic into score (MM-18) | 1:35 | wry; playful, then lonely; a chill at the screws | new to picture, from MM-18 | thins to its pedal under Ekiel's posts; out: the chair's hum rings over the cut |
| **E02-09 Feel It** | 15 (F2.2 inside) | DARK ROOM (one felt piano, his interior) → the Orb-era glossy colour (GPU choir aahs and glass shimmer, ppp) → felt | the Door over the choir; the chant's lift (warm, giddy, never a hymn); **the Ache** (D♭ + G over an F pedal) under the fire; the pledge on the Door's held ♯4 (warm resolve, no cadence) | 1:30 | loneliness; **warmth and joy**; gravity; resolve and dread; a determined night | new (P) | the felt returns within a bar of the pin; out: a receipt printer's chatter pre-laps E02-10 (SFX) |
| **E02-10 The Bridge** | 17 | SET-PIECE SWING, **the full band** (the episode's one full-band stretch, at its peak only, ≤ 2 bars) | the Build's chip lead in octaves with the violins; brass hits at phrase ends | 1:50 | the big comic set-piece; respect; pathos in the rain | new (P) | 4-bar phrases; thins to the bass pedal under the posts; **a pad in the rain**; out: the DREAD sting (MM-14 Outs Kit) on the notification |
| **E02-11 Leverage, Quartet** | 18, 19, 20 | LEVERAGE (a string quartet: pizzicato over the muted 808, locked to the rack LEDs) → under the keynote's own walk-on bed → **ERA T2** for F2.1 (the band through the 16-bit sample-chip, swung, brighter A♭ colours; **no cassette piano, no boom-bap**: the title's 2008 bar) → a garden-party arrangement of the same quartet (**never a wedding march**) → zAI's drone | **Mario's Addendum** (B♭ minor; it gains a bar each time) and **the Lighthouse** cell (marimba and harp) in the right pane; Nole's lamp click and a short fanfare | 4:05 | comedy; a jolt of truth (the transcript: the quartet thins to a pedal); a giddy cheer; nostalgia; wit; a pang at the gate; a laugh and a mystery | new (P) | **the 808 drops out on "present."**; one violin under the V.O.; **the cello's pedal on the gate**, carried into sc 20; **the THUD ends the performance: hard cut to white** |
| **E02-12 One Door** | 22 | DARK ROOM, sparse (one piano note per phrase) | **the Door** with its first note missing, on non-vibrato flute, "through the door" (low-passed, reverb on one side); **the GPU choir** under the reflection | 35 s | stillness; the one quiet ache | new (P) | **the lock's click plays in room tone only (a designed stop)**; returns under the IOU; resolves with no cadence (the Door cadences only in Ep11) |
| **E02-13 August** | 23 | THE RUN (kit, straight or swung, **never boom-bap**; xylophone and wood, pizzicato, a felt ostinato) | a knee stab on each item; RUMPT's muted brass inside the replay and on the button; **the Orb's verdict** (F → C on vibes and glass, one beat after its chime) | 48 s | momentum; a laugh; satisfaction; a chill | new (P), or MM-03 stems | thins to its pedal under the posts and the suit's landing; out: cut on the downbeat to black |
| **E02-14 End credits** | outro | THE KNEE, whole (MM-15), **Ep2's colour** | the knee: the title's wordless vocal pad takes the flat line and **stops before the leap** (the paused voice); celesta and chip finish it | about 7.5 s inside the outro's 10 s | — | new (MM-15 colour) | swung; ends on the open fifth |

- **New to-picture cues:** 10 (the guide is about 3 or more per episode).
- **Score minutes:** about 13 of 22:42; where the score rests (XEL's studio), room tone runs.
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
| The wings / the stage | **NEW** `bed_wings` (road cases, cable hum, a distant count); **NEW** `bed_demo_house` (seats, air handling, a few coughs) |
| The open floor | `bed_office_day` ✓ + `drip_clack` ✓ (the chiller) |
| Alyi's office (2024 night; 2023 night) | `bed_office_evening` ✓, thinned |
| F2.2: the party; the offsite | **NEW** `bed_party_crowd`; **NEW** `bed_fire_night` (crackle, wind in trees) |
| The bridge; the rain | **NEW** `bed_bridge_traffic` (traffic right to left, wind off the water); **NEW** `bed_rain` |
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
| **1** | `server_hum` ✓ · **NEW** `mammoth_step_pixel` ×4 (soft, heavy) · **NEW** `palette_drip` ×3 (the chair) or `drip_clack` ✓ · `freeze_hit_F` ✓ (the card) · **NEW** `building_thud_far` / `_near` / `_doors` (tuned to the bass pedal) · **NEW** `cup_jump` (the coffee) · **NEW** `ladder_sway_creak` · `door_bang_open` ✓ · **NEW** `hand_truck_roll` · `paper_flutter` ✓ (pages; the flyer) · **NEW** `plate_hang` (the second sign) · `orb_servo` ✓ (the iris step) |
| **4** | **NEW** `inbox_chime_low` (two octaves down) · `post_click` ✓ (Publish) · **NEW** `candle_flare` · **NEW** `planchette_glide`, `planchette_letter_tick` · `glyph_shimmer` ✓ / `reverse_swell_1beat` ✓ (a ghost rises) · **NEW** `ceiling_knock` ×3 (each louder) · `ceiling_burst` ✓ · **NEW** `cable_drop` · `landing_thunk` ✓ · **NEW** `cow_moo_reverb` (low, ghostly, short) · **NEW** `lamp_click` (Nole's) · **NEW** `go_stone_click` (slate on wood) · **NEW** `knob_tick_grain` · `phone_clack_floor` ✓ (on the table) · `freeze_hit_F` ✓ (F2.3's freeze) · `render_front_sweep` ✓ (into and out of 2018) · **NEW** `ladder_climb`, `hatch_slide_shut` · **NEW** `match_strike` · **NEW** `candle_snuff`, `candle_blow` · `rocket_roar` ✓ · `tile_land_1` ✓ · **NEW** `glass_sip` |
| **4A** | `folder_slide` ✓ (the nameplate down the table) · **NEW** `nameplate_click` ×2 · `chair_unfold` ✓ (he sits; or a soft chair) |
| **4B** | `ui_toast_pop` ✓ (the invite) · `post_click` ✓ (Accept) |
| **6** | **NEW** `mic_grow_step` ×4 (a tuned soft thunk, one size per hop) · **NEW** `chair_creak` · `paper_whip` ✓ (the sign flip) · **NEW** `curtain_draw` |
| **7** | **NEW** `dollhouse_slide` (whole-pixel steps) · **NEW** `light_bank_click` ×4 · `door_key_turn` ✓ (the key twisted off) · `key_ring_jangle_1–3` ✓ (the out) · `alert_bonk` ✓ (the envelope off the ring) |
| **8** | **NEW** `balloon_pump` ×n · **NEW** `sticker_slap` · **NEW** `balloon_bump` (on the ceiling) · `ui_toast_pop` ✓ · **NEW** `ui_swipe` · `mouse_scroll` ✓ (show to show) · **NEW** `ui_drop_snap` (the launch onto Monday) |
| **9** | **NEW** `ui_chirp_bright` (`yes!!`) · **NEW** `tag_drop` (`[laughter]`) · **NEW** `panel_unfold_step` · `drafting_ink_stroke` ✓ |
| **10** | `drafting_ink_stroke` ✓ · `pen_tick_1–3` ✓ · `rubber_stamp_C` ✓ · **NEW** `tiny_crowd_patter` · `paper_curl` ✓ · `paper_tear` ✓ |
| **11** | `spotlight_swing` ✓ ×3 · **NEW** `crowd_laugh_s` / `_m` / `_l` · `glyph_blink` ✓ (5 frames) · `typing_soft` ✓ · `post_click` ✓ (the softest) · **NEW** `phone_wave_buzz` (across the house) · **NEW** `blimp_inflate_step` ×4 · `palette_step_F` ✓ (the stage drops a step) · `crowd_hush` ✓ · `cloth_rustle` ✓ (the heads turn) |
| **12** | **NEW** `clicker_handoff` · **NEW** `placard_flip` · **NEW** `tether_creak` |
| **13** | **NEW** `tape_pull` · `paper_flutter` ✓ · **NEW** `lectern_bump` ×2 (on the TV) |
| **14** | **NEW** `ui_verb_select` · `alert_bonk` ✓ ×2 (the greyed `come back`; `Open`) · **NEW** `chair_hum_choir` (diegetic: the GPU choir chord) · **NEW** `box_set` · **NEW** `domino_set`, `domino_topple_run` · `paper_flutter` ✓ (the IOU) · **NEW** `door_pivot_creak` · `screw_turn_1–4` ✓ · `nameplate_off` ✓ · **NEW** `plate_drop_box` · `orb_servo` ✓ |
| **15** | **NEW** `thumb_scroll` · **NEW** `hourglass_cursor_2008` · `orb_scan_sweep` ✓ · `ui_toast_pop` ✓ · `key_tap_soft_01–06` ✓ · **NEW** `pin_ping` (a soft tuned ping) · F2.2: the chant (voices) · **NEW** `laptop_keys_night` · **NEW** `tape_stick` (the IOU on the door frame) · `flame_whoomph` ✓ (the effigy catches) · **NEW** `fire_crackle` · `cloth_rustle` ✓ (his hand on the IOU) · **NEW** `receipt_printer` (the out) |
| **17** | **NEW** `receipt_unroll_loop` · `phone_buzz_step_1–4` ✓ (the scramble) · `call_ring` ✓ · **NEW** `pen_chain_rattle` · **NEW** `car_honk_1–5` (tuned to the band's phrase ends) · **NEW** `car_window_down` · `pen_scribble_short` ✓ (`NOW`) · **NEW** `thunder_tuned_F` (≤ 3 flashes per 24 frames) · **NEW** `rain_into_glass` (drops, no ripple) · **NEW** `umbrella_pop` (far) · **NEW** `blimp_lights_off` ×n · `alert_bonk` ✓ (`VOICE 5`) · `ui_toast_pop` ✓ (the notification) |
| **18** | **NEW** `beacon_motor` · `footstep_soft_1–4` ✓ (on bound drafts) · **NEW** `lanyard_drop` ×2 (one beat, both panes) · **NEW** `tv_click_off` · `pen_scribble_short` ✓ ×2 (Mada's minutes) · **NEW** `scroll_unroll_fall` (down the stairwell) · **NEW** `glint_tick` (soft, tuned; the CLOD boxes) |
| **19** | **NEW** `calc_tape_spool` · **NEW** `confetti_pop` · `crowd_stir` ✓ + **NEW** `crowd_cheer` · `call_ring` ✓ · `call_connect` ✓ · F2.1: `render_front_sweep` ✓ (into EARLY-WEB16), the 2008 camcorder's own lo-fi applause (diegetic), **NEW** `clicker_catch` · garden: **NEW** `gate_iron_swing`, **NEW** `lock_big_turn`, **NEW** `velvet_rope`, **NEW** `flower_nod` (tiny) |
| **20** | **NEW** `lamp_click` · **NEW** `cage_door_shut` · **NEW** `padlock_snap` · `call_ring` ✓ (muffled inside the cage) · **NEW** `rope_haul` · **NEW** `paper_stack_fall` → **NEW** `building_thud_big` (the THUD that ends the cue) |
| **22** | **NEW** `pin_fall` (soft) · **NEW** `footstep_gravel` ×n · **NEW** `mat_wipe` · `orb_scan_sweep` ✓ (no toast) · **NEW** `ui_band_on` / `_off` · **NEW** `paper_slide_under` · **NEW** `lock_click_soft` (the softest click in the show) · **NEW** `mail_slot_flap` · `cloth_rustle` ✓ (the pocket) |
| **23** | **NEW** `fog_hiss` · `paper_tear` ✓ (the plank and the scroll) · `landing_thunk` ✓ (the suit) · **NEW** `page_turn` ×3 · `ui_toast_pop` ✓ (his post) · `orb_servo` ✓ · `orb_scan_sweep` ✓ · `orb_chime_F` ✓ · **NEW** `egg_pat`, `egg_roll_drop`, `egg_hatch` · **NEW** `string_reel` · **NEW** `knot_tie` · **NEW** `string_taut` (tuned, the hook) |
| **Outro** | Ep1's outro build: `orb_servo` ✓, `orb_scan_sweep` ✓, `orb_chime_F` ✓, `ui_toast_pop` ✓ |
| **Dialogue blips** (where a line is on a screen) | `blip_mas_*`, `blip_nole_*`, `blip_gerg_*`, `blip_alyi_*`, `blip_mario_*`, `blip_rumpt_*` ✓ (RUMPT's blip is the trombone; never in the score) |

- **NEW sounds:** about 90; most are short foley. Story sounds that carry a beat (the Go stone, the lock's click, the IOU under the door, the knob ticks, the screws) must read in their band against the mix (S11).

---

## 9. Build order and checks

The one-go order (LEARNINGS R2, R6, R7, R10, R15), each heavy step through `ops/heavy.sh`, one heavy job at a time:
1. **Script draft 6** from the proposal (the companion files regenerated once from it).
2. **Facts:** pull the [proposal's list](proposal.md#facts-to-pull-before-lock) and AUDIT §5.1.
3. **Takes:** Ep1's cast; the new roles' auditions (§5.2), picks with written reasons; `audio/ep02/`.
4. **The stick reel** (real takes, a temp bed, the cue sheet's temp score and SFX); then the reads: a fresh newcomer cold read (N32's format, gaps flagged), an insider read, the transition table, the mood analysis, a sound audit.
5. **The EL-timed lock** (the master; hand-placed V.O. in the builder's spec; R9), then a per-act rebuild script copied for Ep2.
6. **In parallel once the timing locks:** the score (§6), the SFX (§8), the art (§1–§4), the facts and captions.
7. **Picture** per act, then the mix, the mux and the film in `out/ep02/v1/`; the intro variant in `out/ep02/v1/intro/`.
8. **QA:** the flash check streamed; −16 LUFS integrated and < −1 dBTP on the decoded encode; 0 decode errors; 0 A/V lag; **P5's eye pass at full 1080p** on every new shot (arms from shoulders, warm faces read warm, crops, read times, no stray cursor, props legible at their moment).
9. **Release copy** in `production/v1/release.md` (M1–M5); the showrunner publishes.

**Laptop rules** (R10): every data-heavy command through `ops/heavy.sh`; Remotion `--concurrency=4`; fastrec `--workers 2`; `OST_WORKERS=2`; audio and frames in chunks; watch `/proc/pressure/memory`; one agent at a time during render and mix.

---

## 10. Resource asks

Non-blocking in this run: take the programmatic route and list the ask (R16).
- **Video-model credits** for 2.A's final layer (a mammoth in a snowy meadow; objects only).
- **ElevenLabs credits** for about 14 new roles' auditions (3–4 voices each) and the episode's takes.
- **One human viewer** for: the Lex #419 lines against the video; Neleh's podcast audio; the reel's pace; the newcomer questions (Move 37, Alyi as a person, the third director); the concept's accuracy; the score's moods by ear.
- **GPU** (optional): `sudo usermod -aG render,video jgon` makes the EEVEE renders for 2.H independent of the login session.
