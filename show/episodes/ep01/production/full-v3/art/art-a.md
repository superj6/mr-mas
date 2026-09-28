# Ep1 full v3 · art-a: the cold open and Act One

| | |
|---|---|
| **What this is** | The record of the pixel assets built for the cold open and Act One (sc 1–12) for the full-episode pixel preview. For each asset: its id, the module, the entry points a shot layout calls, its states, and what is still a stand-in or open. |
| **Who, when** | The `v3-art-a` pass (track P1a of [PLAN.md](../PLAN.md)), 2026-09-27; the v3.1 round (script draft 7) the same day, in §7; the v3.2 round (draft 8.1), 2026-09-28, in §8. Nothing was committed by this pass: the lead commits. |
| **Built against** | [script.md](../../../script.md) sc 1–12; the v2 stick timelines `show/reel/ep01-full/ep01-{coldopen,act1}-v2.json`; the cuts in [stick/v3-plan.md §3](../../stick/v3-plan.md) (C1 Sydney, C2 Kram's crate, C4 the EMIT page, C5 the drill's kitchen, shaft phrase and Gerg's second post, C6 the folds); the beat plans `beat-plan/{coldopen,act1}.json` and the P1a list in [script-v3-notes.md §4 and §7](../script-v3-notes.md) (read at about 11:55, after they landed). |
| **Where it is** | **Code:** 30 new modules in `studio/src/shared/pixel/{rooms,cast,kits}/` (the tables below), plus the v3.1 round's 6 new modules and its opt-in states (§7). The stills registry is `studio/src/episodes/ep01/pixel/art-a/` (`demos.ts` → `demos/*.ts`, one file per scene group; `registry.ts`; `tools/sheet.ts`; `README.md` with the commands). **Stills:** `out/ep01/full-v3/assets/art-a/`: `sheet-native.png` (176 stills at 1×, 4 across: v3's 109, the v3.1 round's 50, the v3.2 round's 17; keys marked `v31` / `v32` or new ids), `native/` (480×270), `full/` (1920×1080, 4× nearest), `index.json`. |
| **Measured** | v3.2 round: 176 stills render, `strays` all ok, the 159 earlier stills pixel-identical (every v3.2 change is opt-in or new), `tsc` clean for this pass's files. v3.1 round: 159 stills render; `strays` prints `all ok`; the 109 v3 stills are **pixel-identical** in the picture area to their v3 renders (every v3.1 change is an opt-in state or a new module); `tsc` prints nothing for this pass's files. v3: 109 stills render. `sheet-a.cjs strays` prints `ok` for all 109 (the master palette, plus the engine's ONEBIT set for 1993 and its LEDGER set for the TV's money print). `tsc` over the project prints nothing for any file of this pass (its only errors are 11 pre-existing ones in `src/dev/realism/bake/bake.ts`). `git status` shows only new files: no existing file was edited, Act Four's included. |
| **Needs a person** | v3.1: the same one-reader look at each new still (§7.5). I looked at every still at 1× on the sheet, at 2× one by one, and cropped the doubtful ones at 3–5×, and fixed what didn't read to me (§4). That is one reader's judgment, not a blind read. Nothing has been seen in motion: every held-step timing is on paper. No v3 shot layout exists yet, so each still shows its asset in a demo framing; its note names the beat it serves. |

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

---

## 7. The v3.1 round (script draft 7)

Built against [script-v31-notes.md §4](../script-v31-notes.md) (the P1a list and its shot notes), [beat-plan-v31/](../beat-plan-v31/) `coldopen` and `act1`, the draft 7 script (sc 5, 7, 9–12), [mood-analysis.md](../mood-analysis.md) §4 #4 (face lights) and #10 (warm launch night a step), and the lead's round: warmer practical light for the bullpen (desk lamps, monitor spill on faces, background life) and face-light states for the listed close-ups.

**The rule held:** every change to a v3 module is an opt-in state or a new export. The 109 v3 stills re-render **pixel-identical** in the picture area, so the v3 shot layouts (`pixel/act1/shots.ts`, `pixel/coldopen/shots.ts`) are unaffected. A v3.1 layout turns on each change explicitly (§7.2).

### 7.1 New modules

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **CAST-SYDNEY** | `cast/sydney.ts` | `drawSydney(b, x, y, o)` · `drawEggTimer(b, x, y, o)` · `sydneyChainAt` · `SYDNEY`, `SYDNEY_COL` | Sizes: `screen` (ChatGTP's own 34×26 drawing, repainted) and `room` (her own 15×12). Faces: `dots` (ChatGTP's face), `smile` (the 😊: happy-arc eyes, the dots in a curve, rose cheeks; it never moves while she talks), `blink`, `blank`. Other states: `talk` (the dots light in turn, in place), `bright` (brand new), the `2022` stamp on her face, the chain under her. The egg timer: a cream egg, its digit printed on it (`5`, `0` on the ding), two held shake drawings | GNIB's colours are this pass's pick: the Macrosoft slate family, pastel (periwinkle body, slate edge). No real product's colours. The `SYDNEY` plate is the pipeline's |
| **SET-SYDNEY** | `rooms/lobby-sydney.ts` | `drawSydneyTvExit` · `sydneyDriftAt(t)` · `drawSydneyWide` · `drawSydney2SMas` · `drawSydney2STasya` · `drawSydneyGerg2S` · `SYD_TV_STEPS`, `SYD_WIDE`, `SYD_2S`, `SYD_TASYA` | **v31-10.01:** the TV full frame; she slips out of GNIB's box, over the caption band and the bezel (held steps 0–4, the box empty after). **Wide:** the drift from the TV to a pixel off Mas's nose. **10.02:** the 2S, Mas at the desk with his glass, her face 1 px off his. **10.03:** Tasya's `clip` hand at her chain (0 none · 1 clipping · 2 hung, `5`). **10.04:** the ding and the blink-blank in the wide; the 9.13 two-shot with her brand new at Mas, the lid at `LOBBY_LID` | At the TV's own bubble size she is small on a full-frame TV. The TV's search box stays empty behind her (`bubble: 'gone'`) |
| **INSERT-GERG-LAPTOP** · **KIT-ATEM-THREAD** | `kits/gerg-laptop.ts` | `drawGergLaptopPOV(b, f, st)` · `drawAtemThread(b, x, y, w, h, st)` · `drawAtemCrate` · `GERG_LAPTOP`, `ATEM_THREAD` | Over his shoulder, down at the screen. `place`: lobby (his knees, the scuffed check under) · bullpen (the demo desk). `lid`: 0 open · 1 the lid's back coming over, its green leaking onto the keys · 2 shut (the same slab, `GERG_LAPTOP.shut`, in both rooms: a second matched pair for the cut). `screen`: `chat` (the two-dot face big in ChatGTP's window, NopeAI's own colours) · `thread` · `dark`. The thread is a generic board: `BOARD`, `anon · 03/03/23`, the crate, grey replies. The crate is plywood stencilled `ATEM · MODEL WEIGHTS · RESEARCHERS ONLY`, tipped on its side, its lid off, files spilling out | New: the two-shots see the lid's back, so the screen needed its own angle. No real message board's layout or marks |
| **INSERT-EMIT-OPED** | `kits/emit-oped.ts` | `drawEmitSpread` · `drawEmitDrop(b, f, {k})` · `drawEmitPhonePage` · `EMIT_OPED`, `EMIT_SPREAD` | **v31-12.03 [HIGH]:** k 0 the magazine a hand's height over its shadow · 1–4 landed, the desk shaking 2 px in held steps while his glass's water line stays put · 5+ still, held to read. The headline in the display face, five lines: "Pausing AI Developments Isn't Enough. We Need to Shut It All Down." The printed pause letter's header shows past its top. `byline` prints `BY REZEILE` if the plate is dropped. The phone-size page is for 12.05 | EMIT's teal and gold and its slab masthead, with the glyph grid copied from art-b's `kits/emit-cover.ts` (keep the two in step). The picture on the right page is abstract |
| **CAST-RIMA-BOARD** | `cast/rima-board.ts` | `drawRimaBoard(b, x, y, pose)` · `rimaBoardTip` · `RIMA_BOARD_LINE0` | Her back at the board, at the medium panorama's scale (twice her room sprite, new geometry): `write` · `underline` (`reach` 0..1: her arm draws the line, she stays put) · `cap0` · `cap1` · `lower` | From behind, the cap reads only by the raised hand and the red cap end (small). Used in `drawLaunch2S` `st.rima` |
| (face lights) | `kits/face-light.ts` | `faceKey(b, x0, y0, x1, y1, k, side)` · `warmRim(...)` · `toWarmLamp(c)` | Buffer-level: skin rungs only (S, K, X), whole rungs, never a blend or a dither | Generic, for any pass. Art-b's `kits/face-light-img.ts` builds on it for the Act Three and Act Four close-ups |

### 7.2 Opt-in states on the v3 modules (the defaults are v3's)

| Module | New option | For |
|---|---|---|
| `rooms/bullpen-launch.ts` | `warm: 1` on the wide and every medium setup (`LaunchMState`, `drawLaunchMcuMas`, `drawLaunchOTSLaptop`) | Mood §4 #10: the hall's tungsten reaches further, Mas's desk lamp (an anglepoise on his desk, `LAUNCH_LAMPS`, `deskLampM`), a lamp left on at the far row. Mas's cool desk sprite goes warm (`toWarmLamp`). A key from the lamp on Rima's face (OTS, MCU) and on Mas's (2S); Gerg's green a rung up on his face; a warm rim down Mas's left in 5.11. The panorama's warm wall goes through the dusk plums (`bl.wallw`), so the wash doesn't read as red smudges |
| | `life: {passer, flicker, car}` (wide) | Background life: a backlit passer-by crossing the hall's far end (two walk drawings), a far monitor's screensaver and its rare flicker, a car's light crossing the bridge in the window |
| | `faceLight` (1–2) on Alyi's reflection; `rack: 'glass'` (5.09); `phonePage: 'emit'` | Mood §4 #4 on 5.05, v3-5.06b and 12.05. The rack: his face lit 2, Rima softened. 12.05: the EMIT page in his hand |
| | `Launch2SState.rima: RimaBoardPose` | 5.07, the board seed: Rima at the board behind Gerg, the third underline (`wet`), capping, not turning round |
| | `cleanUnder` (implied by `warm`) on `drawLaunchMcuMas` | v3 dithered the chat's light on his chin. **v3.1 layouts should set it** |
| | `tearCatch` (7.01) · `collarStyle` | The tear's bright pixel the hottest white · the v31 collars |
| `kits/tv-news.ts` | `bubble: 'sydney' \| 'gone'`, `bubbleFace`, `date: 'FEB 8'` | Sydney in GNIB's box (9.10, and 9.13's blink), the empty box after she leaves, the ticker's own date (9.12) |
| `kits/please-sheet.ts` | `drawPleaseECU {reg, regPart}` · `drawPleaseHigh {desk: 'v31', waterStill}` | 12.06 `PLEASE` / `REG`, the pen lifting mid-word (hand-set R and G glyphs added) · 12.04: EMIT and the printed letter beside the sheet, a rung down |
| `kits/pause-letter.ts` | `drawLetterPage {print}` | The letter printed out (no browser strip) |
| `rooms/duel-split.ts` | `DuelLeftState.caption: false` | 11.04: no `NAPKIN → WEBSITE` |
| `rooms/lobby-deal.ts` | `softLobby` exported · `collarStyle` on the wide's Mas, the 2S, the MCU, the 9.13 2S | Sc 10's setups; the v31 collars |
| `rooms/apec-stage.ts` · `cast/mas-seated.ts` | `collarStyle` on the 2S and the MCU · `pose.collarStyle` | The cold open's stack matching 9.08's |
| `cast/mas-collars.ts` | `style: 'v31'` on all three sizes | 9.08's note (the pop read as the hoodie's trim): taller points standing up the neck toward the jaw, and **the third collar in gold**, a colour nothing else on him has |
| `cast/tasya-medium.ts` · `cast/rima-stand.ts` | arm `clip`, `TASYA_M_CLIP` · `rimaStandRig` exported | 10.03 · the board figure's rig |

### 7.3 Draft 7's list, item by item

| Item | Where |
|---|---|
| Sydney: the bubble (ChatGTP's face, GNIB's colours, `2022`), its exit from the TV, the egg timer (`5`, the ding), the blink-and-reset, the same face in a chat window on Gerg's laptop | `CAST-SYDNEY@states`, `SET-SYDNEY@*`, `UI-TV@v31-scr-gnib-sydney`, `INSERT-GERG-LAPTOP@lobby-chat` |
| 11.01: the thread, the tipped crate, `03/03/23`; Gerg on camera for his line | `INSERT-GERG-LAPTOP@bullpen-thread`, `KIT-ATEM-THREAD@full`, `SPLIT-DUEL@v31-arrival-gerg-line` |
| The laptop close and the match cut | The v3 pair still works (`drawSydneyGerg2S` lid 2 → `drawDemoArrival` lid 2, both at `LOBBY_LID`). The POV adds a second matched pair (`GERG_LAPTOP.shut`, lobby → bullpen) |
| v31-12.03: EMIT on his desk over the letter, the headline, the 2 px shake | `INSERT-EMIT-OPED@drop-air`, `@drop-shake`, `@held-to-read` (the `REZEILE` plate is the pipeline's; `@byline-printed` is the option) |
| 12.05: Alyi's reflection holding a phone with the EMIT page | `ROOM-BULLPEN-LAUNCH@v31-glass-emit-phone` (and `@v31-glass-close-emit`) |
| 12.06: `PLEASE` / `REG` | `INSERT-PLEASE@v31-ecu-reg`, `@v31-ecu-reg-lift`; 12.04 between the two asks: `@v31-high-between` |
| 5.07: Rima capping her marker (the board seed) | `CAST-RIMA-BOARD@poses`, `ROOM-BULLPEN-LAUNCH@v31-2s-warm-underline`, `@v31-2s-cap`, `@v31-2s-capped` |
| Text: `FEB 8 ·` in the ticker | `UI-TV@v31-scr-ticker-date`. `THE FOUNDERS · SUMMONED.` is a plate (the pipeline's): not drawn |
| Shot notes: the tear's bright pixel; the new collar; Alyi as the speaker; the right pane clean; no caption; face lights on Alyi in the glass; warming 5.02 | `CAST-MAS-TEAR@v31-catch`; `ROOM-LOBBY-DEAL@v31-mcu-collar-pop` and `PROP-COLLARS@v31-scales`; `@v31-glass-rack`; `SPLIT-DUEL@v31-p1-clean`; `SPLIT-DUEL@v31-p2-no-caption`; `@v31-glass-facelight`, `@v31-glass-blink-lit`; `@v31-wide-warm` and the `warm` setups. No band text is the pipeline's |
| No longer needed (the crossing scroll, `MEMO → WEBSITE`, the old Cancel dialog) | Nothing drawn. The v3 states stay in the modules, unused by v3.1 |

### 7.4 Measured: the warmth and the face light

Mean luma and warmth (R−B) over the picture area, v3 → v3.1, from the stills:

| Setup | Luma | R−B |
|---|---|---|
| 5.02 wide (`warm`, `life`) | 9.4% → 9.8% | −14.4 → −11.1 |
| 5.03 / 5.07 2S | 11.9% → 12.0% | −24.9 → −23.1 |
| 5.04 OTS Rima | 11.0% → 11.2% | −20.7 → −20.2 |
| 5.06 MCU Rima | 11.2% → 11.5% | −21.7 → −21.5 |
| 5.11 MCU Mas | 13.0% → 13.1% | −29.1 → −28.3 |
| 5.05 Alyi's face in the glass (the face's box) | 11.1% → 17.3% (faceLight 2) | — |

The wide warms the most. The medium setups barely move on average: their frames are mostly the neon's and the board's cyan, and the lamp's light lands on the faces (the keys), not the frame. If the first watch still reads cold, the shot pass can push further on its side, for example with a warm rim on Rima's jacket, or by opening the 2S's camera toward the hall. On the glass reflection, one face-light step barely shows (it is a modulation of dark glass); two read. The demos use 2.

### 7.5 What the look fixed (one reader)

- The egg timer read as a lantern. It is now a cream egg with its digit printed on it.
- The face on Gerg's screen was tiny in a big dark window. It now uses ChatGTP's ECU face.
- The half-down lid read as a green screen. It is now the lid's back coming over, with the green leaking out from under it.
- The lobby floor under the laptop was too busy. The check is greyer, with the dirt sparse.
- The crate's grain read as blotches. It is now thin grain.
- The magazine's picture carried a placeholder word. It now has a credit bar.
- The magazine beside PLEASE competed with the word. It sits a rung down, out of the lamp's pool.
- The panorama's lamp wash and the lamp's reflections in the glass read as red smudges and embers. The wash now bridges through the plums and sits higher on the wall; the reflections are small hot points.
- The glass reflection's face light at 1 barely showed. The demos use 2.
- 5.11 dithered the chat's light on his chin, which broke the no-dither-on-skin rule. `cleanUnder` gives a clean rim instead.
- Sydney's parking spot in the wide was moved to a pixel off his nose.

### 7.6 Open, and for a decision

1. **GNIB's colours.** The pastel slate (Macrosoft's family) is this pass's pick. The script says only "GNIB's colours".
2. **The v31 collars change the stack's design for the whole episode:** a gold third collar and taller points. Adopt them on every collar call (the cold open's MCU, 2S and wide; sc 5's 2S and MCUs; 7.01; the lobby; sc 10), or on none. Sc 10's setups use them by default.
3. **Face light strength.** One step, as the notes say, barely shows on the reflection; two read.
4. **Which half of the match cut rides the POV.** Both pairs are matched: the lid at `LOBBY_LID` and the shut slab at `GERG_LAPTOP.shut`.
5. **REZEILE:** the pipeline's plate, or printed on the page.
6. **The warmth is modest in the medium setups** (§7.4).
7. **For P1b:** Sydney at DevDay (22.01) is `drawSydney(b, x, y, {size: 'room', face: 'smile', timer: {n: 5}})`.

---

## 8. The v3.2 round (script draft 8.1: Act One)

Built against [script-v32-notes.md](../script-v32-notes.md) §4 (Act One) and §10.3 and §10.7 (the plates the world carries, and 8.1's picture notes), and the v3.2 beat plan [beat-plan-v32/act1.json](../beat-plan-v32/act1.json). Additive as before: 4 new modules, opt-in states on 7 modules. **The 159 earlier stills re-render pixel-identical.**

### 8.1 The assets

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **SET-CALL** (v32-7.03) | `rooms/launch-call.ts` | `drawLaunchCallMcu(b, f, st)` · `drawTasyaContact(b, x, y, w, h, st)` · `drawCallScreenECU` · `drawKeyRingGlyph` · `CALL_TEXT` | [MCU] later that night, 7.01's fallaway behind him, the tile's red under him as a clean rim. `phone`: `ear` (at his ear, **its lit screen out to us**: `TASYA · MACROSOFT` over a key-ring avatar, the call running) · `low` (lowered, the call over) · `red` (lighting red before it reaches the desk: a siren dome, `ELGOOG` / `CODE RED`). The contact screen at any size, with states `ringing` · `call` · `ended`. The ECU option: the phone ringing on his desk, the contact large | **Cartoon, never a real backroom:** the screen faces us (a cartoon licence, so the relation plate reads in the world), with a big friendly key-ring avatar. His face stays open, lit from below like a campfire story, with no second party and no shadows over his eyes. The phone is oversized (42×64) so its words read. A person should judge whether it's too big |
| **INSERT-MILLION-POST** (6.06) | `kits/act1-v32.ts` | `drawMillionPost(b, f, {k, settle})` · `MAS_MILLION`, `MILLION_POST_AT` | The odometer wedged in bedrock, the last wheel on `1,000,000` (`drill.ts`), his post popping over it in post-card's own UI and held steps. The words: "CHATGTP launched on wednesday. today it crossed 1 million users!", `DEC 4 · 11:35 PM` | Uses `kits/post-card.ts` as is (poster `mas`). `masMillion` is a constant here, not an edit to post-card's `POSTS` |
| **KIT-KEY-RING** (v32-9.10k) | `kits/key-ring-insert.ts` | `drawKeyRingECU(b, f, st)` · `KEY_RING_ECU` | [ECU] his belt and the ring, large: eleven keys in brass, steel and copper, spread round the lower arc so they can be counted, and a beige twelfth hanging level at the front, its bow stamped `NOPEAI` in the 7 px face. `jangle` 0/1. `keys: 13, thirteenth` gives Act Three's thirteenth in Atem blue (v31-18.00b, for P1b) | The rail `FEB 7, 2023` is the pipeline's. `KEY_RING_ECU` says where the ring is, so the rail can sit clear of it |
| **ROOM-ELGOOG@v32-cutin-founders** (8.04) | `rooms/elgoog-cutin.ts` + `cast/elgoog-founders.ts` | `drawFoundersCutIn(b, f, st)` · `founderCutIn` / `drawFounderCutIn` (3×) | The one cut-in, for "Someone else built that?". NIRB and EGAP at 3×, re-rastered from their own geometry (vector, never a scaled sprite), backlit, their rims widened for the size. They peer at Radnus's phone held in from frame left, the two-dot bubble on it; the mug reads `RETIRED` / `2019`. Also: the phone's chrome, and the siren's red passing on its turn (`turning`) | The silhouettes are flat by design (no portraits) |

### 8.2 Opt-in states on existing modules

| Module | Option | For |
|---|---|---|
| `rooms/duel-split.ts` | `DuelLeftState.button: ButtonEcuState` | 11.04: GTP-4 goes out on his click. The left pane cuts in to 5.08's insert (his finger on the beige button, `research preview`), cropped round the button into the pane (a crop, never a scale); `press` 0/1/2, `lit` |
| `rooms/lobby-deal.ts` | `Deal2SState.collarPop` | 9.09's note: the ring's clink against the collar. On the jangle's clink the newest collar hops 1 px, as when it surfaced. With the v31 collars it is gold, the ring's brass: the collar reads as the landlord's |
| `cast/sydney.ts` · `rooms/lobby-sydney.ts` | `EggTimerState.face: 'questions'` · `timerFace` | v31-10.03: the timer's own face reads `5 QUESTIONS`: a chunkier egg with the digit on its dome and a printed band round its waist |
| `kits/pause-letter.ts` | `months` on `drawLetterPage`, `drawLetterOTS`, `drawClipboard` | 12.01 / 12.02: `6 MONTHS` under the header (the display face in red on the page; micro caps on the 64 px clipboard) |
| `rooms/nole-desk.ts` | `months`, `bigClip` | 12.02: the 26 px desk clipboard can't carry a word, so `bigClip` glides it in at its 64 px size, with the header and `6 MONTHS` legible in the wide, before it lands small |
| `cast/elgoog-founders.ts` | `founderCutIn`, `drawFounderCutIn` (new exports) | 8.04's cut-in |

### 8.3 Draft 8.1's list, item by item

| Item | Where |
|---|---|
| v32-7.03: the phone at his ear, lit red from below; the contact screen (`TASYA · MACROSOFT`, the key-ring avatar); the phone lighting red as he lowers it | `SET-CALL@ear`, `@low`, `@red`, `@ecu-ringing` |
| 6.06: his post over the million | `INSERT-MILLION-POST@card`, `@opening` |
| 11.04: his finger on the beige button in the left pane | `SPLIT-DUEL@v32-p2-button`, `@v32-p2-button-touch` |
| v32-9.10k: the key ring large, eleven and a beige twelfth stamped `NOPEAI` | `KIT-KEY-RING@ecu-12`, `@ecu-12-jangle` (and `@ecu-13` for P1b) |
| 9.09: the ring's clink against the collar | `ROOM-LOBBY-DEAL@v32-2s-clink` |
| v31-10.03: `5 QUESTIONS` | `SET-SYDNEY@v32-2s-tasya-questions` |
| 12.01 / 12.02: `6 MONTHS` | `UI-PAUSE-LETTER@v32-push-months`, `@v32-clipboard-months`, `ROOM-NOLE-DESK@v32-glide-big` |
| 8.04: one cut-in on the founders | `ROOM-ELGOOG@v32-cutin-founders` |
| The plates with a relation word (`GERG MOCKBRAN · CO-FOUNDER`, `RADNUS · RUNS ELGOOG · …`, `MARIO · EX-NOPEAI`, `NOLE · EARLY FUNDER · …`) | The pipeline's text layer: not drawn. `TASYA · MACROSOFT` is the one the world carries, on his phone |

### 8.4 What the look fixed (one reader)

- The key ring was too small for an ECU, with its stamp in micro caps. The ring is now bigger (r 50) with the keys spread, and the stamp is in the 7 px face.
- The phone's red alert borrowed the insert's card, whose words ran off the phone. It now has its own alert at phone size.
- The founders at 3× read as cardboard cut-outs with a 1 px rim. The rim is now K px.

### 8.5 Open, and for a decision

1. **The call's phone faces out** (the cartoon licence), so `TASYA · MACROSOFT` reads without a cutaway. The ECU (`@ecu-ringing`) is there if the shot pass would rather keep the phone real and cut in.
2. **The call phone's size** (42×64, about his head's height): big enough to read, and cartoon. A person should judge whether it tips into silly.
3. **12.02's `6 MONTHS`** is legible only if the clipboard glides in big (`bigClip`) or 12.01's page carries it. At the desk's size it can't.

**Lead's rulings on §8 (2026-09-28):**
1. **The call:** open on the **ECU of the phone ringing on the desk** with the contact screen large (`TASYA · MACROSOFT`), then Mas with the phone at his ear, **screen facing him** and at normal size. No outward-facing screen and no oversized phone: the ECU carries the read.
2. **Phone size:** normal, per 1.
3. **`6 MONTHS`:** carried by 12.01's letter page. The clipboard stays at desk size.
