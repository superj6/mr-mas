# Ep1 full v3 · art-a: the cold open and Act One

| | |
|---|---|
| **What this is** | The record of the pixel assets built for the cold open and Act One (sc 1–12) for the full-episode pixel preview. For each asset: its id, the module, the entry points a shot layout calls, its states, and what is still a stand-in or open. |
| **Who, when** | The `v3-art-a` pass (track P1a of [PLAN.md](../PLAN.md)), 2026-09-27. Nothing was committed: the lead commits. |
| **Built against** | [script.md](../../../script.md) sc 1–12; the v2 stick timelines `show/reel/ep01-full/ep01-{coldopen,act1}-v2.json`; the cuts in [stick/v3-plan.md §3](../../stick/v3-plan.md) (C1 Sydney, C2 Kram's crate, C4 the EMIT page, C5 the drill's kitchen, shaft phrase and Gerg's second post, C6 the folds); the beat plans `beat-plan/{coldopen,act1}.json` and the P1a list in [script-v3-notes.md §4 and §7](../script-v3-notes.md) (read at about 11:55, after they landed). |
| **Where it is** | **Code:** 30 new modules in `studio/src/shared/pixel/{rooms,cast,kits}/` (the tables below). The stills registry is `studio/src/episodes/ep01/pixel/art-a/` (`demos.ts` → `demos/*.ts`, one file per scene group; `registry.ts`; `tools/sheet.ts`; `README.md` with the commands). **Stills:** `out/ep01/full-v3/assets/art-a/`: `sheet-native.png` (109 stills at 1×, 4 across), `native/` (480×270), `full/` (1920×1080, 4× nearest), `index.json`. |
| **Measured** | 109 stills render. `sheet-a.cjs strays` prints `ok` for all 109 (the master palette, plus the engine's ONEBIT set for 1993 and its LEDGER set for the TV's money print). `tsc` over the project prints nothing for any file of this pass (its only errors are 11 pre-existing ones in `src/dev/realism/bake/bake.ts`). `git status` shows only new files: no existing file was edited, Act Four's included. |
| **Needs a person** | I looked at every still at 1× on the sheet, at 2× one by one, and cropped the doubtful ones at 3–5×, and fixed what didn't read to me (§4). That is one reader's judgment, not a blind read. Nothing has been seen in motion: every held-step timing is on paper. No v3 shot layout exists yet, so each still shows its asset in a demo framing; its note names the beat it serves. |

---

## 0. The short version

- **Built: 7 sets, 10 rigs, 13 prop and UI kits** (30 modules), with an arrival wide and a held two-shot for every room.
  - **Sets:** the APEC stage (sc 1–3); the bullpen on launch night, the script's aisle geography (sc 5–7, 12); the drill (sc 6–7); Elgoog's lobby on his phone (sc 8); the NopeAI lobby dressed for the landlord's deal (sc 9); the duel split and its match-cut arrival (sc 11); Nole's standing desk in the dark (sc 12).
  - **Rigs:** Mas seated; Mas's collar stack (an overlay for his existing drawings); Rima standing; CHATGTP; RADNUS; NIRB and EGAP; Tasya at medium scale with his key ring; Gerg's extra poses; a pixel CLOD; OIGNEB.
  - **Kits:** the Orb's rewind toast and year counter; the 1993 dialog; the invite; the beige button; the odometer; the chat window; the code-red alert; the check; the TV broadcasts; the pause letter and clipboard; PLEASE; Gerg's phone insert; a post card for any poster.
- **Draft 6's list is in:** the legible `$ MULTIBILLION` check in the lobby wide (9.01); Tasya's ring at 11 keys, then 12 with the twelfth in the button's beige (9.04 → 9.10); the laptop match cut 9.13 → 11.01 on one lid position (`LOBBY_LID`); Alyi's reflection reading the pause letter on a phone (12.05); the alert `ELGOOG · CODE RED` (8.01); v3-5.06b's blink on the 5.05 glass.
- **Reused:** the lobby (`rooms/lobby.ts`), the day bullpen (`rooms/bullpen.ts`) and the lighthouse (`rooms/lighthouse.ts`) as plates; Mas's portrait, medium, desk and standing rigs; Gerg's table, medium and standing rigs; Rima's portrait and bust; Alyi's reflection and standing rig; Tasya's portrait geometry and room sprite; Nole's and Mario's room rigs; the Orb; the post card; the call kit's toast glyph; the engine's freeze, ONEBIT and LEDGER sets. **Ported** (copied, so shipped code doesn't import `src/dev/`): the intro's finger-on-button insert (`dev/mfinale/callart.ts`) and the style-range prototype's demo-stage pieces (`dev/range/ep1-p1/pixel.ts`).
- **Not built (cut):** Sydney and her egg timer, Kram's crate, the EMIT page and Rezeile's plate, the drill's kitchen and shaft phrase, Gerg's second post insert.
- **Not drawn here, on purpose:** name plates, rails, gag cards and Mas's V.O. line. Those are the pipeline's text layer (P0 / P2).

---

## 1. The assets

**How to read the tables.**
- *Module* paths are under `studio/src/shared/pixel/`. Every module's header comment has its full interface; these tables are the map.
- *Sheet* keys are `ID@state` in `index.json`, with files at `native/ID--state.png` and `full/ID--state.png`.
- Every drawing function paints rows 0..202 of a 480-wide `Buf` (the band below is the pipeline's). All are deterministic on `(f, state)`, use whole pixels and held drawings, and stay inside the master palette.

### 1.1 Cold open (sc 1–4)

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **ROOM-APEC** | `rooms/apec-stage.ts` | `drawApecWide(b, f, st)` · `drawApecMCU` · `drawApecTable` · `drawApec2S` · `apecFreeze(b, live)` · `apecScrub(b, k)` · `hailAt(t)`, `mcuHailAt(t)` · `APEC`, `APEC_2S_LOOKS`, `APEC_FREEZE` | **Wide:** ovation 0/1, the hailstone's arc (t, or `'glass'`), the host's slosh 0–3, the lit window on/off, the push 0–12 px, the host's card lift, phone dark/invite/accepted; `st.live` fills the freeze mask (Mas + phone). **MCU:** the near-front head, eyes on the host, 3 collars, the hail across the soft window, the phone's light on his jaw (invite white → accepted pale blue: a clean rim, no dither). **Table ECU:** the plink (k frames: bob, ring, settle), the slosh with its spill, the phone, the tent card `MAS MANALT · CEO, NOPEAI` legible. **2S:** chest-up medium Mas and the Orb at r 11 (3 iris looks). **Scrub:** 4 held steps to paper | The backdrop has no wordmark (no real event's branding); the rail gives the place. The freeze prints through a re-curved navy/cream set (the stock curve printed this bright room almost all cream) |
| **CAST-MAS-SEATED** | `cast/mas-seated.ts` | `drawMasSeated(b, seatX, seatY, pose)` · `MAS_SEAT`, `MAS_SEATED_GLASS`, `MAS_SEATED_FACE` | arm lap · sip · hold · reach · phone; head host · down; mouth; blink; collars 0–3; light stage · room · monitor · sil | Generic seated sprite (the chair is the scene's): art-b can use it for any seated Mas |
| **PROP-COLLARS** | `cast/mas-collars.ts` | `drawCollarsPortrait(b, x, y, n, {head, light, pop})` · `drawCollarsMedium` · `drawCollarsStand` | 1 coral, 2 + green, 3 + cream (newest outermost); `pop` 0–1 lifts the newest 1 px; warm / monitor / room | An overlay: Mas's own drawings have plain hoodie necks. Design only, never text |
| **UI-INVITE** | `kits/phone-invite.ts` | `drawInviteInsert(b, f, {k, state, press})` · `drawInviteCard` · `INVITE` | the screen wakes, the card slides in 3 held steps, `Board sync · Fri 12:00`, four nameless attendee circles (doorway, glowing page, spinner, black square: none green), Accept / Decline; accepted = pale blue | A generic calendar UI. art-b reused the circles' design |
| **UI-REWIND-TOAST** | `kits/rewind-toast.ts` | `drawRewindToast(b, x, y, {k, year, roll})` · `yearAt(t)` · `drawRewindToast1bit` | `rewinding…` with its year slot: 2023 → catches on 2022 → slips (2019 · 2015 · 2008 · 2001, the ones wheel rolling); the 1-bit `rewinding… too far` | The call kit's toast box and v5 rewind glyph, set in the kit face so the ellipsis draws |
| **GFX-1993** | `kits/dialog-1993.ts` | `draw1993Dialog(b, {k, question, okDown})` · `DLG1993`, `PILLAR` | paper field in the 3:2 pillarbox, the `1993` card, the open (2 held zoom rects), `Are you sure?` with OK (default ring) and Cancel greyed; the room's alternative `Continue?` is one argument | Drawn in the ONEBIT set's ink and paper (the intro's own 1993 look, re-drawn: no dev import) |

### 1.2 Sc 5: launch night in the bullpen

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **ROOM-BULLPEN-LAUNCH** | `rooms/bullpen-launch.ts` | `drawLaunchWide(b, f, st)` · `launchBackM(b, camX, st)` (the medium-scale back wall, a 960 px panorama) · `drawLaunch2S` · `drawLaunchOTSRima` · `drawLaunchGlass` · `drawLaunchMcuRima` · `drawLaunchMcuMas` · `drawLaunchOTSLaptop` · `drawLaunchMcuPF` · `drawBayNight` · helpers `putBust`, `otsShoulder`, `drawCursor`, `toGreenGlow` · `LAUNCH`, `LAUNCH_M`, `MAS_TEAR_PATH` | **Wide:** LOW-KEY underlined 1–3 (the third wet 0..1), Rima's pose/position or null, Alyi's reflection there/gone, the laptop dark/chat, the tile 0/popped/hole, the odometer on the desk / dropping (2 held) / gone (sc 6), Gerg typing or arms up. **2S:** Mas fg (warm, 2 collars) + Gerg across the aisle in his green; the button and the parked cursor. **OTS Rima**, her portrait at his desk, Alyi soft in the glass. **Glass:** the close pane with Alyi's reflection (any mouth, eyes closed for the blink, `'phone'` for 12.05, gone); the 5.09 composite (Mas soft fg, Rima capping the marker) and the 12.05 one (Mas bent over his sheet). **MCU Rima**, **MCU Mas** (chat-lit), **laptop OTS** (the chat window, Rima leaning in, Gerg's hands), **MCU·PF** (7.01: the fallaway, the red up-light rim, the tear) | See §3.1 on its geography. Mas's desk sprite is Act Four's (cyan-lit). Gerg's table sprite brings the Woodrose's dining-chair back |
| **CAST-RIMA-STAND** | `cast/rima-stand.ts` | `drawRimaStand(b, footX, footY, pose)` · `rimaMarkerAt` · `rimaWalkAt` | body stand · write · underline · cap · fold · lean · peer · w0–w3; head face · back · down; light room · board · sil | New room sprite (she had none). art-b can use it |
| **PROP-BEIGE-BUTTON** | `kits/launch-button.ts` | `drawButtonECU(b, f, {press, lit, finger})` · `drawBeigeButton(b, x, y, {scale})` · `BUTTON_ECU` | the ECU with the strip relabelled `research preview`, on the 1993 OK's screen position; the finger press 0/1/2, the LED; the prop at room and medium scale | Port of the intro's salvage, re-lit for the bullpen at night |
| **UI-CHAT** | `kits/chat-window.ts` | `drawChatWindow(b, x, y, w, h, st)` · `drawChatECU(b, f, st)` · `CHAT_BANNER` | the window (title strip, banner, the bubble, the plate `CHATGTP · USERS:` with its counter, the lines, the input with a held caret); the ECU with the first tick (roll), the blur, and 6.01's growth (grow 1–3) | **The banner's words are a stand-in** (`research preview · it can make things up`) until the facts owner confirms the warning's wording (script sc 5 note) |
| **CAST-CHATGTP** | `cast/chatgtp.ts` | `drawChatBubble(b, x, y, {size, state, f, glow})` · `CHAT_BUBBLE` | screen (34×26) and ECU (150×112) drawings; idle · lit · talk (the dots bob in turn) · blink; the glow ring | Its Ep1 form: dot eyes and a `• • •` mouth (it grows a face in Ep2) |

### 1.3 Sc 6–7: the drill

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **PROP-ODOMETER** | `kits/odometer.ts` | `drawOdometer(b, x, y, st)` · `drawWheel` · `odometerSize` · `ODO_USERS_TICKS` | sizes plate · ecu · wide · desk · small (`$`); per-wheel spin (2 blur drawings) and roll; heat 0–3; shake; gears on a held turn | art-b's DevDay odometer is its own drawing |
| **SET-DRILL** | `rooms/drill.ts` (+ the wide in `bullpen-launch.ts`, the growth in `kits/chat-window.ts`) | `drawHoleHigh(b, f, st)` · `drawWedgedWheel` · `drawGpuTear` · `drawDeskOdo` · `HIGH` | **6.01** the counter grows out of the plate (3 held drawings in the chat ECU); **6.02** the machine on his desk, dropping through it, the hole; **6.06** wedged in fractured bedrock, the last wheel settling (0–3) to `1,000,000`; **6.08** the hole from above, Rima peering down; **6.09** the tile popping up (2 held), the glow 0–3, the racks green → amber → red, the `$` counter, heat shimmer; **7.02** the tear falling (t), his phone red at the top edge, then the GPU: the splash, three held puffs | `drawDeskOdo` (a medium 6.01) is kept but superseded by the ECU growth: it hid Mas behind the laptop |
| **CAST-MAS-TEAR** | `rooms/bullpen-launch.ts drawLaunchMcuPF` | `st.tear` (k frames: the bead slides 1 px per 4 f down `MAS_TEAR_PATH`), `st.glow` | 1 px wide, 2 tall, its wet track a rung up; the hole's red as a rim under his chin and jaw | The portrait has no head-down drawing: he looks down by his lids |
| **INSERT-GERG-PHONE** | `kits/gerg-phone-insert.ts` + `kits/post-any.ts` | `drawGergPhoneInsert(b, f, {k, heart})` · `NOLE_POST` · `drawPostFor`, `postBoxFor`, `POSTERS_A1` | the buzz (2 held shakes), NOLE's post in its own UI, Gerg's thumb heart (1), Rima's fingertip un-hearting it (2) | `post-any.ts` is post-card's layout taking the poster as data (post-card's posters are a closed set: NOLE isn't in it). Fold it into post-card later |
| **CAST-GERG-POSES** | `cast/gerg-poses.ts` | `drawGergPose(b, footX, footY, pose)` · `GERG_LID` | tug · sit · sitShut · armsUp | Holds a copy of gerg-stand's rig (its figure isn't exported): keep the two in step |

### 1.4 Sc 8: the code red, on his phone

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **UI-ALERT** | `kits/phone-alert.ts` | `drawAlertInsert(b, f, {k, thumb, zoom, pov})` · `drawPhoneLockOTS(b, f, {locked})` · `drawAlertCard` · `ALERT` | 8.01: the phone on his desk, the red card, a siren glyph, `ELGOOG · CODE RED` (draft 6); the thumb over / tap; the app zooms to full-bleed in 3 held steps, showing any full-frame `pov` 1:1; 8.06: over his shoulder, the siren turning on the phone in his hand; locked | — |
| **ROOM-ELGOOG** | `rooms/elgoog-lobby.ts` | `drawElgoogLobby(b, f, st)` · `sirenBeamAt(f)` · `stairFoot(step, who)` · `ELGOOG` | the atrium in skewed primaries; the slab 0–3; the scissor lift 0–3 and the siren on it; turning (8 held beams a revolution, 1 rev/s); the crypt steps; Radnus's pose; the founders' stair step 0–4 and poses; `chrome` (the phone's status bar and rounded corners) | The sweep's red covers big areas once a second: inside the 3-flashes-a-second limit, but it goes on the photosensitivity check list |
| **CAST-RADNUS** | `cast/radnus.ts` | `drawRadnus(b, footX, footY, pose)` · `radnusFlameAt(f)` | arm fold · ext · pat · phone · lanyards · tap0 · tap1; fire 0–3 or null (the loop: burning 3 drawings, patted out, relit); light room · red · tv | Room scale only. **No bust:** art-b drew a stand-in bust for sc 13 (§5) |
| **CAST-FOUNDERS** | `cast/elgoog-founders.ts` | `drawFounder(b, who, footX, footY, pose, {clip})` | NIRB (tall, a small prism over one eye) and EGAP (stooped, the oversized `RETIRED` / `2019` mug); arm shade · mug · reach · down; legs stand · step; the GUEST lanyard; lit 0 (silhouette) · 1 (half-lit) | Backlit silhouettes by design (the script's "no portraits") |

### 1.5 Sc 9: the landlord's deal (the NopeAI lobby)

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **ROOM-LOBBY-DEAL** | `rooms/lobby-deal.ts` (over `rooms/lobby.ts`) | `drawDealWide(b, f, st)` · `dealFreeze(b, live)` · `drawDeal2S` · `drawDealMcuMas` · `drawDealGerg2S` · `drawMatchLid(b, lid)` · `DEAL`, `DEAL_FREEZE`, `LOBBY_LID` | **Wide:** the gold `NOPEAI · A NONPROFIT` on the door; the check null / jammed (legible, its stub in the wings) / floor / scuffed; the pen; Mas (any stand pose, collars), Tasya (keys 11/12, beige), Gerg (tug, sit, walking); the TV; `st.live` for the freeze. **2S:** medium Mas and Tasya over the soft lobby, panned so the jammed door is between them; Gerg tugging behind. **MCU** with the collar pop. **9.13 2S:** Mas at the desk with his glass, Gerg on the check, the lid open / half / shut at `LOBBY_LID` | The 2S's pan shows 110 px left of the lobby plate: a repeated strip of its entrance glass fills it (soft, in the background) |
| **PROP-CHECK** | `kits/novelty-check.ts` | `drawCheck(b, x, y, {pen, scuffed, stub})` · `drawCheckFloor` · `CHECK` | upright with the pen (`MACROSOFT` · `PAY TO NOPEAI` · `"multiyear, multibillion dollar"` · `$ MULTIBILLION`), its blank stub; on the floor as a doormat; scuffed with footprints | The parody name only, no logo |
| **CAST-TASYA-MEDIUM** | `cast/tasya-medium.ts` | `drawTasyaMedium(b, x, y, st, {flip})` · `drawKeyRing(b, cx, cy, n, {beige, jangle, scale})` · `TASYA_M_RING` | his portrait's geometry at half size; 6 mouths, 3 lids, brow level/warm; arm clasp · after · ring · down; the ring's keys (11 → 12, the twelfth beige), jangle; the ring alone at room and medium scale | At room scale a key is 1 px: the count reads at 4×, not at 1× |
| **UI-TV** | `kits/tv-news.ts` | `drawTvPicture(b, x, y, w, h, st)` (the lobby wide's TV, or full frame) · `drawTvScreen(b, f, st)` · `tvLedger(b)` · `TV_TEXT` | gnib (a search box with the chat bubble inside it; `MACROSOFT UNVEILS THE NEW GNIB`) · tap (across town: Radnus tap-dancing, 2 drawings, the siren) · telescope (3 held turns until its lens stares at him; the ticker crawls in; the figure holds); the LEDGER print | The figure is set `ELGOOG ~ -$100B (~7.7%, ONE DAY)`: the kit face has no `≈` or `−` |

### 1.6 Sc 11: the duel

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **SPLIT-DUEL** | `rooms/duel-split.ts` | `drawDuelSplit(fb, f, st)` · `drawDuelLeft` · `drawDuelRight` · `drawDemoArrival(b, f, {lid})` · `DUEL` | **11.01** the day bullpen dressed as the demo stage (GTP-4), full frame, Gerg's lid shut → open at `LOBBY_LID` (the match cut). **Left pane:** the demo screen blank · napkin · site1 · site2 · memo · memo1 · memo2 with its caption (`NAPKIN → WEBSITE`, `MEMO → WEBSITE`); Gerg type · napkin · snap · snapScroll · glance; the cheer 0–2; Mas's phone up; everyone's phones. **Right pane:** the lighthouse with no rent meters; the can light off/on; CLOD's pose; Mario dictate · write · lookup · phone · spindle; the first scroll's length; the second's run. **Both:** the post (k), the crossing (0..1, landed on Gerg's desk) | The left pane's pieces are ported from `dev/range/ep1-p1` |
| **CAST-CLOD** | `cast/clod.ts` | `drawClod(b, footX, footY, st)` | pose wait · bow · up; lit 0/1; the chest wheel's 3 held turns; eyes; smile | The BASE pixel drawing. The real-clay CLOD (style-range E1-P1) stays an option |

### 1.7 Sc 12: the pause letter, the standing desk, PLEASE

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **UI-PAUSE-LETTER** | `kits/pause-letter.ts` | `drawLetterOTS(b, f, {k, push})` · `drawLetterPage` · `drawClipboard(b, x, y, {signed, small})` · `LETTER` | 12.01: over his shoulder at night, the page on his monitor (`PAUSE GIANT AI EXPERIMENTS`, a signature list with OIGNEB, SUCRAM and NOLE), the push to full-bleed in 3 held steps; the clipboard, its clip's fine print `PAUSES RECEIVED: 0`, Nole's flourish 0–2, a room-scale size | A generic web page, not the real site's |
| **ROOM-NOLE-DESK** | `rooms/nole-desk.ts` | `drawNoleDesk(b, f, st)` · `NOLE_DESK` | the dark room, his 1am lamp; the clipboard gliding in (1–3 held) and landed; signed; the solder's sparks (3 held drawings under the desk); Nole's pose (re-lit warm for the lamp); OIGNEB | — |
| **CAST-OIGNEB** | `cast/oigneb.ts` | `drawOigneb(b, footX, footY, pose, {flip})` | sign chest · high · none; mouth; blink; light room · dim | The sign's word is drawn after the rig, so it never mirrors |
| **INSERT-PLEASE** | `kits/please-sheet.ts` | `drawPleaseHigh(b, f, {n, part, shake})` · `drawPleaseECU(b, f, {lift})` | 12.04: his desk from above, his writing hand and the other flat on the sheet, the MACROSOFT pen, PLEASE handwritten letter by letter (n, part); 12.06: the sheet, the pen lifting 0–2 | Hand-set pen strokes, never the typeset face |
| (in ROOM-BULLPEN-LAUNCH) | `drawLaunchGlass(b, f, {mas: 'bent', alyi: 'phone'})` | 12.05 | Alyi's reflection reads the pause letter on his phone (draft 6), Mas soft and bent over his sheet in the foreground | The phone reads brighter than the reflection round it |

---

## 2. For the shot passes (P2)

- **Scales.** Wides are room scale (people ≈ 80 px). The two-shots and OTS setups put medium figures (≈ 110 px, waist-up) or portraits (112×136, the MCU size) over a softened room plate, which is Act Four's MCU grammar: the nearer figure is the bigger one.
- **The match cut (9.13 → 11.01).** Draw 9.13 with `drawDealGerg2S({lid})` and 11.01 with `drawDemoArrival({lid})`. Both place Gerg at (300, 96) and the lid at `LOBBY_LID`, so the lid closes and opens in the same place in frame. The Build's chip line leads the cut (script-v3-notes §7, for sound).
- **The freezes.** Pass a `Mask` as `st.live` to `drawApecWide` or `drawDealWide`, then call `apecFreeze` or `dealFreeze`. The card over the freeze is the pipeline's (`freeze.ts`).
- **Text layer.** No plates, rails, cards or V.O. are drawn here. The pipeline burns Mas's V.O. line at about rows 190–198, and a few demo framings put the beige button and the cursor at rows 186–200 (the 2S, the OTS on Rima, the 5.09 glass). Lift them there if a V.O. line lands on those shots.
- **The fuse.** The parked cursor is in the picture (`drawCursor`). The band's verb line (`Push research preview`) belongs to the frame composer, if the shot pass keeps it.
- **Arrivals.** Every room has an arrival still: `ROOM-APEC@wide-arrival`, `ROOM-BULLPEN-LAUNCH@wide-arrival`, `ROOM-ELGOOG@arrival-slab`, `ROOM-LOBBY-DEAL@wide-arrival`, `SPLIT-DUEL@arrival-lid-shut`, `ROOM-NOLE-DESK@arrival-glide`. The APEC wide also drifts upstage (`push`).

## 3. Decisions made here

### 3.1 The launch-night bullpen follows the script's plan, not Act Four's back wall

Act Four's bullpen (`rooms/bullpen.ts`) faces the back wall: hall, whiteboard, glass and ALYI's door, windows, with Mas at the bench's right end in front of the door. The script's sc 5 PLAN and the stick lock's blocking put Mas's end desk at frame left, Gerg across the aisle at frame right, the whiteboard and the conference glass on the right, and the hall and the bay window back left. Act One follows the plan, so screen direction holds (Mas left). It's the same office, with the same neon, whiteboard, glass and hall tungsten, seen from the aisle at night. sc 11's demo stage uses Act Four's own day room, which Act Four's shots already established. The whiteboard is on the left in Act Four's wide and on the right here, and a viewer may notice. The pixel preview's first watch will tell.

### 3.2 Other calls

- **The drill** is BASE pixels. The style-range pass declined the 3D cutaway, and C5 cut the shaft phrase, so the depth is carried by 6.06's bedrock and the HIGH down the hole.
- **CLOD** is drawn in pixel. The real-clay insert remains the style-range option.
- **The check** is drawn upright and horizontal, not diagonal, so its words stay legible in the wide.
- **The founders** carry one prop each and no faces.
- **Nole** is re-lit warm under his lamp (his rig is keyed to cyan).
- **Freeze tone curves.** The two freezes use re-curved navy/cream sets (`APEC_FREEZE`, `DEAL_FREEZE`), derived with the engine's `.with()`. The stock set is not edited.

## 4. What the look pass fixed (one reader)

- **APEC:**
  - the stage spots went red on the deck (now neutral);
  - the banquet read as a fire band (now arched ballroom windows);
  - the table insert was abstract (now a high three-quarter view);
  - the 2S was only a crop (now its own medium framing);
  - the freeze was nearly all cream;
  - the phone light was dithered on his skin (now a rim).
- **Launch room:**
  - the hall's spill and the neon's wash were too loud;
  - the green flooded Gerg and the board;
  - the chest extensions read as boxes (they now fall into shadow);
  - the OTS shoulder was a blob (now the portrait silhouette);
  - the glass MCU cut Alyi off (now a close pane);
  - Alyi's reflection was invisible in the wide.
- **Drill:**
  - the 6.01 medium hid Mas (the growth now plays in the ECU);
  - the bedrock read as tiles;
  - the hole's red was dithered onto his face;
  - the tear read as a highlight;
  - the dropping machine floated past the desk's end.
- **Lobby:**
  - the door's wings cut `MACROSOFT` (the check now has a stub);
  - the jammed door sat behind Mas in the 2S (now panned between them);
  - the pan's first fill repeated the door.
- **Others:**
  - the counter's digits were clipped;
  - the collars were ticks (now popped points);
  - the phone alert still said `NEWS ALERT`;
  - the thumb read as a stick;
  - the OTS hand floated;
  - the demo monitor hid the napkin;
  - the clipboard's header overflowed;
  - the PLEASE hands were blobs;
  - the TV figure dropped `≈` and `−`.

## 5. Open, and for a decision

1. **The launch room's geography** (§3.1): keep the script's aisle view for Act One, or re-stage Act One on Act Four's back wall. Keeping it is my recommendation, for screen direction.
2. **A RADNUS bust:** art-b's sc 13 uses a stand-in bust in his colours. If he needs a real one, it's a new drawing (his room sprite is here).
3. **The chat banner's wording** waits on the facts owner.
4. **Photosensitivity:** the Elgoog siren's red sweep and 7.02's red-hot frames go on the saturated-red flash test.
5. **Mas's desk sprite** in the launch wide is Act Four's cyan-lit drawing. It reads as the working lamp's cool light; a warm variant would need a new drawing.

## 6. Re-running

The commands are in `studio/src/episodes/ep01/pixel/art-a/README.md`. From `studio/`: bundle `tools/sheet.ts` with esbuild into the scratch folder, then `node <scratch>/sheet-a.cjs all ../out/ep01/full-v3/assets/art-a` (through `bash ../ops/heavy.sh`; it takes about 9 s), then `strays`, `one`, `crop` and `group`.
