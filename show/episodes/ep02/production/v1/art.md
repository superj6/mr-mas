# Ep2 v1: the art

> **Status: second pass, 2026-10-09: the art review's findings fixed.** Every new set, room, prop, creature and character in [manifest.md](manifest.md) §1–§3 has a drawing in `studio/src/episodes/ep02/pixel/art/`, registered as one of **43 assets** with **138 stills** at 1080p (120 in the first pass; the review split montages and added the missing drawings). SET-23 (ISS, the 2.H leap) is real 3D: a Blender 4.5.3 EEVEE scene, seven plates, nine composites. **New in this pass:** the 2.A AROS filler, a Blender-rendered near-photoreal mammoth (48 frames) with its two lobby composites (§3b). The contact sheet is [`out/ep02/v1/art/sheet.png`](../../../../../out/ep02/v1/art/sheet.png).
>
> **Ep1 is untouched.** Nothing under Ep1's locked paths or `studio/src/shared/` was edited; Ep1's rigs, rooms and kits are imported read-only, and anything that had to change was copied first (§4). No shared code changed, so `ops/reorg/smoke.sh` has nothing new to prove. [M: the commit touches only `studio/src/episodes/ep02/pixel/art/`, `out/ep02/v1/art/` and this file.]
>
> **What was looked at.** Every still, every ISS composite and both AROS composites were rendered through `ops/heavy.sh` and viewed at full size; faults found that way were fixed and re-rendered (§5). The stills tool now runs a **text-fit check** on every string it draws (§1), and its last report flags only words that are covered on purpose (§7). The art folder typechecks clean with `tsc --noEmit` (a tsconfig scoped to the folder, through heavy.sh). Marks: [M] measured from files or renders, [J] judged by eye.

**Contents:** [1. Rendering](#1-rendering) · [2. The assets](#2-the-assets) · [3. SET-23, the 3D leap](#3-set-23-the-3d-leap-2h) · [3b. AROS, the 2.A filler](#3b-aros-the-2a-filler) · [4. Imported, copied, new](#4-imported-copied-new) · [5. Looked at and fixed](#5-looked-at-and-fixed) · [6. Notes for the scene builders](#6-notes-for-the-scene-builders) · [7. Open issues and asks](#7-open-issues-and-asks) · [8. The stills](#8-the-stills)

---

## 1. Rendering

Run every command from `studio/`, and run each heavy step through `ops/heavy.sh`. `$S` is any scratch folder.

```sh
# the stills (all 138), their text-fit report and index, and the contact sheet -> out/ep02/v1/art/{stills/,sheet.png}
node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/art/tools/stills.ts $S/stills.cjs
../ops/heavy.sh node $S/stills.cjs [--only id,id] [--no-sheet] [--out DIR] [--plates DIR] [--aros DIR]

# SET-23: the 3D plates (Blender EEVEE on the iGPU, ~1-2 min a plate at 1920 x 812 with the gravel), then the composites
../ops/heavy.sh ~/Downloads/blender-4.5.3-linux-x64/blender -b --factory-startup \
  --python src/episodes/ep02/pixel/art/iss/iss_scene.py -- --out ../out/ep02/v1/art/iss/plates --w 1920 --h 812 --samples 32
node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/art/tools/iss-comp.ts $S/iss-comp.cjs
../ops/heavy.sh node $S/iss-comp.cjs --plates ../out/ep02/v1/art/iss/plates --out ../out/ep02/v1/art/iss

# 2.A: the AROS filler (48 frames at the wall screen's 103 x 101 x4 = 412 x 404, ~15 s a frame), then its composites
../ops/heavy.sh ~/Downloads/blender-4.5.3-linux-x64/blender -b --factory-startup \
  --python src/episodes/ep02/pixel/art/aros/aros_mammoth.py -- --out ../out/ep02/v1/art/aros
node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/art/tools/aros-comp.ts $S/aros-comp.cjs
../ops/heavy.sh node $S/aros-comp.cjs --frames ../out/ep02/v1/art/aros/frames --out ../out/ep02/v1/art/aros
```

- **Stills:** each asset's stills go to `stills/<id>[-n].png` at 1920 × 1080 (480 × 270 at 4x, nearest). Each still carries a label band: its manifest row and id (wrapped to two lines when long), the shot (wrapped), and the scenes. A still that owns the band (the UI LIT spread, SET-12) keeps its whole 480 × 270 frame, and its label goes in a strip under it (1920 × 1348). The sheet shows each asset's first still at 1x. `stills/index.json` lists every file with its asset and label (§8 is made from it).
- **The text-fit check.** While a still draws, every `pt` / `bpt` / `tiny` call records its glyph pixels and the plate under it (`kit.ts` `TEXT_FIT`). After the still is finished, the tool flags a string that leaves the frame, overflows its plate (more than 30 % of its rim off a plate that holds most of it), or is drawn over (its glyph pixels no longer one colour, or that colour now the plate's own). A grade or palette remap that recolours a whole word alike passes. The report is `stills/textfit.json` (`textfit-partial.json` for an `--only` run), and the run prints it. Decorative type (the party's token streams) is drawn inside `untracked(() => …)` and is not checked.
- **The previews.** SET-23 in the stills and on the sheet reads the plates from `out/ep02/v1/art/iss/plates/`; SET-01's wall screen reads the AROS frames from `out/ep02/v1/art/aros/frames/` (`--aros DIR` to point elsewhere). Both are box-averaged to the pixel frame for the preview only; the composites in `iss/` and `aros/` keep the 3D whole and lay the pixel layer over it at 4x.
- **The heavy.sh gate (a decision, recorded here).** Through both passes other projects held the load average at 22–28, and in this pass one of them also held about 12 GB, so `MemAvailable` sat at 2–6 GB [M: `uptime`, `/proc/meminfo`]. heavy.sh's defaults (`MRMAS_MAX_LOAD=16`, its memory floor) would have waited without end. The small jobs ran with `MRMAS_MAX_LOAD=64 MRMAS_MIN_AVAIL_GB=4` and a cap of `MRMAS_HEAVY_MEM_MAX=1500M` (the stills and composites), `3000M` (Blender, the typecheck). The swap and PSI gates stayed on, the jobs ran one at a time, and none came near its cap. Relax the gate this way only for jobs this small.

---

## 2. The assets

One row per registered asset, printed from `registry.ts` (`ALL_ART`). `file` and `exports` are relative to `studio/src/episodes/ep02/pixel/art/`.

| id | manifest | kind | name | file | exports | scenes | note |
|---|---|---|---|---|---|---|---|
| `set01-lobby` | SET-01 · the NopeAI lobby master | set | The NopeAI lobby, side-on (the Ep2 master) | `sets/lobby2.ts (+ sets/lobby2-art.ts)` | drawLobby2, LOBBY2, drawSignBoard, drawFlyer, drawComplaint, drawHandTruck, drawCleanRect, drawConfetti, drawPresserSmall | 1, 13, 19, 20 | Ep1's narthex from the side: Mas's counter under the signs (back left), the desk, the wall screen (right), the doors far right; beanbag rows |
| `set02-seance` | SET-02 · the boardroom séance (night) | set | The boardroom séance: candles, the board, the Orb as chandelier | `sets/seance.ts` | drawSeance, SEANCE_CANDLES, drawOuija, OUIJA, OUIJA_LETTERS, ouijaECU | 4 | Ep1's boardroom re-lit by six candles (a palette walk); the reply-chevron board, the Go board beside it; the empty chair; the ceiling hole and cable |
| `creature-ghosts` | §2.3 the ghosts · GHOST-NOLE | creature | The ghosts (reply-chevron email threads), the cow, GHOST-NOLE | `sets/seance.ts` | drawGhost, drawGhostNole | 4 | translucent chevrons in a 50 % screen with a faint offset second image (2.G spirit photo); dated headers carry the record's words |
| `set03-office2018` | SET-03 · NopeAI's first office, Feb 2018 (T3) | set | The first office by day, four months before Ep1's June night | `sets/office2018.ts` | office2018feb, arenaInsert, alyiLooksBack | 4 (F2.3) | T3 cut paper: one rack, the arena on one monitor, AGI with three crossed-out arrows, the Go stone, ALSET · AI, the ladder and hatch; nobody applauds |
| `set04-move37` | SET-04 · Move 37: the board and the knob wall (T3) | set | Move 37: the Go board, the stone, the wall of knobs | `sets/office2018.ts` | move37 | 4 | the 19 x 19 board in cut paper, slate and shell stones; tiny human boards pour into the wall of knobs and tick them; then the program's own boards; then the wall freezes; no players, no hands |
| `set05-studio` | SET-05 · XEL's studio (2.D the player chrome) | set | XEL's studio: the curtain, two chairs, the mic in five sizes, the player's chrome | `sets/studio.ts` | studio2S, studioMCU, playerChrome, chromeInsert, drawMic, CHROME | 6 | the locked 2S is the meter frame: the mic hops a size on each pause (1..5), the counter CH. 1..6 OF 6, the REC light goes out; no show name or logo |
| `set06-cutaway` | SET-06 · the cathedral, cut away | set | The cathedral as a dollhouse cross-section (430 rows tall; the frame pans it) | `sets/cutaway.ts` | cutaway, basement2S, keyECU, SECTION_H, FLOORS | 7 | the halves slide apart; floors light one by one; MACROSOFT's plinth BELOW · ABOVE · AROUND; the basement's sealed boxes; the odometer egg in the bedrock |
| `set07-darkroom-ui` | SET-07 · the dark room (Ep2's monitor and phone items) | prop | The dark room's monitor and phone items: RULEBOOK, the calendar, the ELPPA call, the news recap, the phone face down | `sets/darkroom2.ts` | rulebookNotif, calendarPainter, elppaCall, newsRecapPainter, phoneFaceDown, drawMonitorOTS2 (painters for kits/mas-monitor drawMonitorPOV, and Ep2's OTS) | 8, 12, 20 | monitor items are painters (POV / OTS / 2S); the SNOOZE button stays unpressed; the call tile has no face and no name; OMNI over Elgoog's keynote, no blimp |
| `set09-newsdesk` | SET-09 · the news-desk lineup · §2.2 the NEWS-DESK HOST and three cardboard cutouts | set | The news desk: a height chart, three cardboard CEO cutouts in lanyards, the unplated host | `sets/darkroom2.ts` | newsDesk, newsSitePainter | 8 | a generic news site (no outlet name, logo or trade dress); the host turns from the lineup to the lens; cutouts are Ep1's rigs flattened to cardboard |
| `set10-stage` | SET-10 · the demo stage: the wings, the stage from the house, the front row | set | The demo stage: the wings (work light), the locked wide (the spotlight's meter frame), the front row | `sets/stage.ts` | wings, stageWide, STAGE, frontRow, armrestECU | 9, 11, 12 | the wings in work light, road cases, the monitor; the big screen with LIVE -> ENDED and the chat; the spot slides a step per laugh; RESERVED: CHIEF SCIENTIST never flips |
| `char-chatgtp-ep2` | §2.1 CHATGTP (its Ep2 face) · §3 the VOICE panel | character | CHATGTP's Ep2 face and the VOICE panel | `sets/stage.ts` | drawChatFace, voice5Badge, voicePanel | 9, 11, 17, 19 | ears, eyes and a mouth in three held steps; three mouths for the harmony; token eyes (5 frames); 😊; a raised hand and the GUEST band (the garden); the panel of five voices |
| `set11-plan` | SET-11 · THE PLAN: OMNI (BLUEPRINT) | set | THE PLAN: OMNI on the blueprint kit (a two-screen sheet the camera pans) | `sets/plan.ts` | planFrame, planSheet, PLAN_PANS | 10 | accurate on paper: the relay that drops TONE / LAUGHTER at the grate, GTP-4o, 232 MS (AVG 320), MON, $0; the empty bubble blots the tiny stage; the tear |
| `set12-openfloor` | SET-12 · the open floor (the reach-for-him spread) · UI LIT | set | The open floor: a find-the-man spread with the adventure band | `sets/floor.ts` | openFloor, FLOOR, adventureBand, heatsinkMCU, dominoECU, miscBoxECU | 14 | ordinary desks (no pedestals); polished heatsinks show only Mas's face; Alyi's door on a centre pin with the note on its frame; the humming chair; the safety team's own door down the corridor |
| `set13-alyioffice` | SET-13 · Alyi's office (2024 evening, empty; 2023 night) and the stairwell | set | Alyi's office: empty in May 2024; his screen in 2023; the stairwell | `sets/alyioffice.ts` | alyiOffice, OFFICE, screen2023, publishECU, stairwell | 15 (and F2.2) | the desk with no chair (wheel marks where it stood); 2023: his screen crops him, Ekiel squints at the post; the bare Publish (no cursor); the stairwell push |
| `prop-tpool` | §3 TPOOL on a 2024 phone · the thread | prop | TPOOL (his first company's app, LAST UPDATED 2012) and the thread | `sets/alyioffice.ts` | tpoolPhone, threadPhone | 15, 20, 22 | EARLY-WEB colours inside a modern bezel; WHERE U AT?, welcome back, mas, the 2008 hourglass; the one warm pin; the link card knocks it loose |
| `set14-party22` | SET-14 · the holiday party, Dec 2022 (T4 glossy) | set | The holiday party, Dec 2022: string lights, the chant, Alyi warm | `sets/f22.ts` | party22, party22TwoShot, checkInECU, stringLights | 15 (F2.2) | T4: bloom and specular on the pixel base; string lights on a slow chase (no strobe); the swag crops Alyi; Mas not chanting, his glass; racks' lights become token streams (12 GLYPH frames) |
| `set15-offsite` | SET-15 · the leadership offsite, 2023, at night (T4) | set | The offsite: the lodge doorway, the UNALIGNED effigy, the fire | `sets/f22.ts` | offsite, fireToPoint | 15 (F2.2) | a paperclip robot of our own design; Alyi half cut off by the doorway's jamb, the flame in his hand, face lit and calm; palette-cycled fire, never strobing |
| `set16-bridge` | SET-16 · the Bay Bridge, mid-span (evening rush, the night, the afternoon, May 20 in rain) | set | The Bay Bridge: the receipt across five lanes, the night, the rain | `sets/bridge.ts` | bridgeDoors, receiptRun, bridgeDeck, drawCar, penChain, scramblePhone, scrambleInHands, voiceMenu | 17 | NopeAI's doors at the top of the hill, the receipt pouring out; stalled traffic on it; the night's palette cycle (no strobe); May 20 rain, the storm cloud's blank letterhead, the sagging blimp |
| `char-driver` | §2.2 the DRIVER | character | The DRIVER (an everyday voice through a car window) | `sets/bridge.ts` | driverWindow, drawCar | 17 | a navy cap, a red work jacket; leaning out, his arm on the sill; "can we move?" (talk), "Does honking count…?" (worry) |
| `creature-blimp-cloud-receipt` | §2.3 the blimp · the storm cloud · the receipt | creature | The `her` blimp (four sizes), the storm cloud with a blank letterhead, the receipt | `creatures.ts` | drawBlimp, drawStormCloud, drawReceiptStrip, drawReceiptLane, RECEIPT_LINES | 11, 17 | the blimp in four held sizes, its running lights clicking off, sagging; the cloud rains letterhead; the receipt's lines legible: NON-DISPARAGEMENT · IN PERPETUITY · CLAUSE 9 · SAVE 0% ON YOUR NEXT EXIT |
| `set17-lighthouse` | SET-17 · Misanthropic's lighthouse (sc 18 additions) | set | The lighthouse in sc 18: Ekiel on the stair, Adelina's lanyard, Mario's pages, the CLOD case | `sets/committee.ts` | lighthouse18, clodCase, lanyard, pagesECU | 18 | Ekiel climbs the stair of bound drafts with his box; Adelina raises a lanyard printed on page 212; the CLOD boxes glint as the beam passes (the last one's art the bridge, never named) |
| `set02b-committee` | SET-02 · the boardroom, May 28 (the committee) · SET-18 the split | set | The boardroom on May 28: the banner, the TV's podcast player and the statement card; the split | `sets/committee.ts` | boardroom18, podcastTV, split18, SPLIT | 18, 20 | a plain player with no show name or logo; her words captioned large; the board's card with its honorific; two 238 x 203 panes and a 4 px divider, the waiting pane a rung down |
| `set19-campus` | SET-19 · ELPPA's campus, the keynote crowd | set | ELPPA's campus: the lawn, the giant screen, the crowd's backs (generic, off-brand) | `sets/elppa.ts` | campus, keynotePainter, streamCrowd | 19, 20 | no real building, logo or trade dress; the stream's chat lights with his post; phones buzz across the lawn; the crowd thins to the end card (sc 20) |
| `set20-f21` | SET-20 · F2.1: the 2006 street corner (EARLY-WEB16) and the 2008 keynote stage · §2.1 YOUNG MAS | set | F2.1: the 2006 phone ad, the 2008 stage (the intro's frame), the pins greying | `sets/elppa.ts (+ f21/era2008.ts, mas08.ts, palettes.ts, timeline.ts: copies of studio/src/dev/meras)` | corner2006, stage2008, breadcrumb, matchClicker | 19 (F2.1) | EARLY-WEB16 throughout; the end card WHERE YOU AT?; the 2008 big screen's pins grey out one by one to LAST UPDATED 2012 (no cause claimed); the clicker becomes the 2024 phone in the same grip |
| `set21-garden` | SET-21 · the walled garden · §2.3 IRIS · §3 the gate, the key, the lock, the rope, the wristband, the phone flowers | set | The walled garden: the square-cut hedge, one gate, the lock, the phone flowers, IRIS | `sets/garden.ts (+ cast/kooc.ts, creatures.ts drawIris)` | gardenGate, gardenBeds, outsideHedge, gateReverse, phoneUnfold, drawChatSmall, drawGiantLock | 19 | CHATGTP walked through on a velvet rope, GUEST band on its tail; a raised hand, a nod, then a text-only bubble; IRIS stuck at 99%; Radnus polite outside the hedge, not burning; never rings, altars or vows |
| `set22-zai` | SET-22 · the zAI lobby · §2.2 a VISITOR · §3 the birdcage, the padlock, the caged phone | set | The zAI lobby: the brand-new birdcage, the KORG 2 banner, Nole's lamp | `sets/zai.ts` | zaiLobby, cageECU, drawBirdcage | 20 | a converted warehouse, cold; the cage's shipping tag still on; the visitor a silhouette (no line, no face); his phone locked in, buzzing, nothing legible |
| `set23-iss` | SET-23 · ISS: the white cube on an empty lot (2.H real 3D) · §3 the plate, the slot's sprung flap, the flyer | set | ISS: the white cube (Blender EEVEE plates) with the pixel Mas, flyer and Alyi on top | `iss/iss_scene.py (3D plates) + sets/iss.ts (pixel layers) + tools/iss-comp.ts (the composites)` | issLayer, issRoom, issPreview, drawMasBackSmall, ISS_ANCHORS | 22 | sealed by design: no handle, no lock, no keyhole, no mat, no sign; the flap shuts on its spring, no return; Mas, Alyi and the flyer stay pixel, composited keeping the contrast; previews here are box-averaged, the composites are whole |
| `set08-podium` | SET-08 · THE PODIUM (the tag) · §2.2 RUMPT's hands · §2.3 the chatbot balloon · §3 the broadcast, the rally post, the egg | set | The tag on his monitor: the broadcast, THE PODIUM and the balloon, the rally post and the Orb's scan | `sets/tag.ts (+ creatures.ts drawChatBalloon, drawEggTab)` | broadcastPainter, podiumPainter, rallyPostPainter, rumptHands, refiledLanding | 23 | hands and tie only (no face, no voice, no fist pumps); the podium still faces away; the balloon has no words and no sticker; the lower third the broadcast's own, plain |
| `prop-posts-ui` | §3 the posts in their own UI · the XEL invite · the blog editor · the push · the ISS link card | prop | Ep2's posts and phone UI (verbatim, name swaps, his lowercase) | `props/ui.ts` | EP2_POSTS, drawEp2Post, POSTERS_EP2, xelInvite, blogEditor, requestPush, issLinkCard | 4, 4B, 11, 12, 14, 15, 17, 19, 20, 23 | each post in its own UI (Ep1's kits); no capital "I" on screen in Mas's crops; the Publish is bare (no cursor) |
| `prop-nameplates-4a` | §3 the 4A nameplates (new plates; Terb's sheet is cast/terb-sheet.ts) | prop | The Mar 8 nameplates clicking into their slots | `props/ui.ts` | nameplatesECU | 4A | MAS MANALT · BOARD, OMIS · NEW DIRECTOR, NEW DIRECTOR, NEW DIRECTOR; no bracketed placeholder (P17); one click each |
| `prop-presser` | §3 the roadmap lectern · §2.1 REMUHCS (+ colleagues and aides) on the lobby TV | prop | REMUHCS's roadmap presser on the lobby TV (full frame, sc 13; the corner TV, sc 19) | `props/ui.ts` | presserFull | 13, 19 | the bill-shaped lectern ROADMAP · $32B/YR with nine FORUM stickers (an aide's tenth), turned sideways at FLOOR, still stuck; 0 BILLS; REMUHCS has no line in Ep2 |
| `char-selbeep` | §2.2 SELBEEP | character | SELBEEP (the AROS video lead) | `cast/selbeep.ts` | selbeepBust, drawSelbeepRoom, drawRemote, drawDirectorsChair, SELBEEP_DEFAULT | 1 | proud showman; brown suede bomber, studio-yellow lanyard; the remote the size of a clapperboard; proud / talk / worry / laugh |
| `char-xel` | §2.2 XEL | character | XEL (the long-form host) | `cast/xel.ts` | xelBust, drawXelSeated, XEL_DEFAULT | 6 | a plain dark suit and tie, an earnest listener; seated room sprite for the locked 2S (faces left), lean toward the mic |
| `char-humanist` | §2.2 THE HUMANIST | character | THE HUMANIST (Macrosoft's new AI chief) | `cast/humanist.ts` | humanistBust, drawHumanistRoom, HUMANIST_DEFAULT | 7 | slate blazer, amber open collar; caught out (worry), polite (smile), talking; carries the DEFLECTION (LICENSED) boxes |
| `char-engineer` | §2.2 the DEMO ENGINEER | character | the DEMO ENGINEER (stock) | `cast/engineer.ts` | engineerBust, drawEngineerRoom, ENGINEER_DEFAULT | 9, 11 | headset with boom, teal zip-up, DEMO lanyard; presenter smile, nervous laugh, worry; phone up; unclipping the headset |
| `char-bukaj` | §2.2 BUKAJ | character | BUKAJ (the new chief scientist) | `cast/bukaj.ts` | bukajBust, drawBukajRoom, BUKAJ_DEFAULT | 14 | glasses, teal crew-neck over a white collar; soft, exact, warm; seated in the humming chair, a hand flat on the armrest |
| `char-ekiel` | §2.2 EKIEL | character | EKIEL (co-led the safety team) | `cast/ekiel.ts` | ekielBust, drawEkielRoom, EKIEL_DEFAULT | 14, 15 (F2.2), 18 | the squint is his resting face; sandy hair, navy zip-up; at Alyi's screen in 2023 (cyan light); the committee lanyard in 18 |
| `char-forecaster` | §2.2 THE FORECASTER | character | THE FORECASTER (ex-NopeAI) | `cast/forecaster.ts` | forecasterBust, drawForecasterRoom, drawProbUmbrella, FORECASTER_DEFAULT | 17 | forest-green hoodie, a clipboard of dates, a watch; kind and precise (smile, focus); asleep against the rail; the umbrella egg |
| `char-haras` | §2.2 HARAS | character | HARAS (first CFO) | `cast/haras.ts` | harasBust, drawHarasRoom, drawCalcTape, HARAS_DEFAULT | 19, 20 | teal blazer, dark bob, the calculator tape; brisk smile, "And profit?" (focus), "Upside." (proud); walking, on a beanbag |
| `char-kooc` | §2.2 MIT KOOC | character | MIT KOOC (runs ELPPA; unplated) | `cast/kooc.ts` | drawKoocRoom, drawGiantKey | 19 (the garden) | black quarter-zip, silver hair, composed; the key as tall as he is, carried and turned in the lock (three held steps) |
| `char-alyi-ep2` | §2.1 ALYI (Ep2 states) | character | ALYI: the 2018 look back, the party, the 2023 screen, the offsite, at work in ISS | `cast/alyi2.ts` | alyiWarm, drawAlyiRoom2, drawAlyiAtWork, drawTpoolCheckIn, ALYI_WARM_DEFAULT | 4 (F2.3), 15 (F2.2), 22 | warm and human: laughing, the chant, his phone up, "Someone should." in screen light, calm with the flame; cropping is the sets' job |
| `char-mas-ep2` | §2.1 MAS (new room drawings) | character | MAS: Ep2's new room poses | `cast/mas2.ts` | drawMasStand2, drawMasBack, iouCornerECU, MAS2_FOOT | 13, 17, 19, 20, 22, F2.2 | Ep1's standing rig (copied) with phone, umbrella, tape, knock, glass and slot arms; and his back walking away |
| `char-dot` | §2.2 DOT | character | DOT (front-desk contractor; never her face) | `cast/dot.ts` | drawDotLadder, drawDotBack, dotPlateOut, dotHandsECU | 1, 14 | from behind only: navy work jacket, orange lanyard strap and orange cuffs, a low bun; up the ladder; her hands at the screws |
**Built on purpose as reuse, not drawn new here:**
- **Name cards (the 2-tone freeze), plates and rails.** These use the shared `ui.ts` kits. Their texts are in the manifest's §3.
- **The staffers.** These are the `cast/civic2.ts` recolours: `seatedStaff`, `crowdBacks`, and the room rig with `STAFF_LOOKS`.
- **SET-06's drill and SET-18's split grammar.** SET-06 imports Ep1's drill (`sets/cutaway.ts`). SET-18 is `SPLIT` in `sets/committee.ts`, with Ep1's 238 + 4 + 238 geometry.
- **Every Ep1 room the manifest marks "reuse".** These are imported as they are: the boardroom, the bullpen, the dark room, the lighthouse, the lobby's materials, and Nole's desk.

---

---

## 3. SET-23, the 3D leap (2.H)

**The scene.** `iss/iss_scene.py` builds the whole scene from nothing in Blender 4.5.3. It is deterministic: hashed sizes, no random module, no clocks.
- **The cube:** white, 3.2 m on a side, its edges bevelled (4.5 cm, five segments) so they catch the light.
- **The door:** one door with a hairline seam, sealed by design: no handle, no lock, no keyhole.
- **The plate:** brass, engraved `ISS`.
- **The mail slot:** a raised brass bezel with a **sprung flap** inset in it (a 2 mm gap all round, a pull lip, three hinge knuckles along its top edge). A plate sets the flap's angle: 0° is shut, and 55–86° is pushed in. The gap is a boolean cut whose walls take a dark material, so it reads as a hole. Behind it is a warm interior plane. In the `insert` plate that plane is pure green, as a key for the pixel room.
- **The lot (second pass):** a ground shader of Voronoi stones and cracks with a large-scale tone drift and a contact darkening near the cube's base; about 7000 scattered pebbles in two stones' worth of colour, 2000 dry grass tufts (nine blades each), and two ragged tyre tracks, all fading out beyond ~9 m so the scatter has no hard edge.
- **Beyond the lot:** 260 trees in the haze (poplar spindles, pines, round crowns; smooth-shaded, clustered, an emission haze by distance), so the treeline reads as trees in fog and no longer as chess pieces.
- **Left out:** no mat, no sign, no lock.
- **Light (second pass):** a key sun (energy 3.6, a 14° soft angle) and a cool fill sun, world strength 0.7, ambient occlusion at 0.9 m, so the cube has a lit side, a shade side and a contact shadow.
- **Render settings:** AgX, Punchy, exposure +0.15. [J] The sky reads as near-white, as 22.01 asks ("the white turns out to be sky").

**The plates** (`out/ep02/v1/art/iss/plates/`, 1920 × 812 = the room area at 4x):

| plate | shot | camera |
|---|---|---|
| `wide` | 22.01–22.03 (and Mas's walk in, 22.02) | 28 mm, 8.6 m from his line; the room figure stands 75 px [M: anchors] |
| `ots` | 22.04 over his shoulder at the slot, the flap pushed in 55° | 30 mm, above and left of the slot |
| `insert` | 22.05 the gap fills the frame, the flap in at 86°, the gap keyed green | 50 mm, 16 cm from the door |
| `ecu` | 22.06 the flap shut on its spring | 50 mm, 78 cm |
| `mcu` | 22.07 Mas at the shut flap: the wall receding on the right, the lot behind him | 24 mm, along the wall from the door's right |
| `knock` | 22.08 the door and his raised hand | 50 mm from 15 m (the room figure at its own scale) |
| `away` | 22.09 his back crossing the lot, the cube on the right | 28 mm, from beside the cube looking out |

**The anchors.** The script projects Mas's marks into each camera and writes the screen points to `plates/anchors.json`, in native pixels: the walk line, the door mark, the head height, the slot, and the walk away's two ends. `sets/iss.ts` stands every pixel figure on those points, so a re-framed camera carries its marks with it.

**The pixel layers** (`sets/iss.ts`), each drawn on a transparent layer:
- **The figures:** Mas walking in, with THE ORB at his shoulder scanning the cube. It toasts nothing.
- **22.04:** the back of his head (hair strands, the ear, the nape) and shoulder, his arm with an elbow. His hand pinches the flyer, upside down with the tape still on its corners, sized to the slot (its lower edge in the gap).
- **22.02:** in the arrive, he faces the door as he walks up.
- **22.07:** Mas at medium scale facing the flap (the medium rig flipped), his face light one step up.
- **22.08:** the room-scale `knock` arm.
- **22.09:** his back, which shrinks with distance.
- **Contact shadows:** a layer pixel can be a shadow marker (`ISS_SHADOW`), which darkens the plate under it instead of covering it.
- **The room through the gap** (`issRoom`): a warm room with Alyi at a desk, working and absorbed. He never looks up, and the slot's lower edge crops him. The flyer falls tilted, close to the gap, and out of frame unseen.
- **No grading:** none of the layers is graded to the plate, given a rim, or down-rezzed.

**The composites** (`out/ep02/v1/art/iss/`):
- `22.02-wide`, `22.02-wide-arrive`
- `22.04-ots`, `22.05-insert`, `22.06-ecu`, `22.07-mcu`, `22.08-knock`
- `22.09-away`, `22.09-away-far`

Each is 1920 × 1080, with the band left plain because the assembly owns it.

**Still to animate.** The 22.06 swing needs the flap's in-between angles. Render them by setting the flap angle per plate in `SHOTS`, or by adding a `--flap` argument. The walks (22.02, 22.09) are pixel layers over a locked plate, so they need no new plates.

---

## 3b. AROS, the 2.A filler

The 2.A leap is SET-01's wall screen playing AROS's preview: a near-photoreal woolly mammoth in snow, inside the pixel lobby's bezel, keeping the contrast (P12: no grade match, no pixel rim, no down-rez in the composites). The art review asked for the filler to be built or for its owner to be named. **It is built**, programmatically, in Blender: no video model, no photo, no likeness.

- **`aros/aros_mammoth.py`** builds the scene from nothing in Blender 4.5.3 and renders **48 frames at 24 fps, 412 × 404** (the wall screen's 103 × 101 at 4x). Deterministic: a sin hash, no random module, no clocks.
  - **The mammoth:** a body of smooth-unioned blobs (the domed head, the shoulder hump, the sloping back), furred with particle hair (short, clumped, two tones of brown), long curved tusks, a trunk on a curve, four legs on pivots in a slow walk toward the lens.
  - **The tell:** a fifth leg on frames 40–41, the generated-video glitch the scene's joke wants, there for two frames and gone.
  - **The world:** snowfall, a hazed pine line, a pale sky; the camera 50 mm at a 3/4 angle so the head, tusks and trunk read in the screen's small rect.
  - **Out:** `frames/aros_0001…0048.png` and `clip.json` (the clip's manifest: native size, fps, the frame list).
- **`tools/aros-comp.ts`** lays the frames into the lobby at 1080p: the pixel lobby x4 nearest, the frame whole inside the bezel.
  - `1.05-aros-bezel.png`: the preview playing (frame 20), sc 1, FEB 15, SELBEEP presenting.
  - `1.08-step-out.png`: on "sentence", frame 44 pushed in about its feet so the mammoth fills the screen and its feet meet the bezel's lower edge; below the edge, the part outside the screen is the pixel mammoth (`creatures.ts` `drawMammoth`): only its legs and feet show, stepping onto the carpet.
- **In the stills,** the SET-01 wall screen shows the frames box-averaged to the pixel screen (a preview only).
- **Owner:** the 2.A leap's owner can replace the frames with anything that fits the same rect; the composite tool reads whatever is in `frames/`.

---

## 4. Imported, copied, new

**Imported read-only** from `studio/src/shared/pixel/` and Ep1:
- **Rigs and cast:** the civic-kit rigs, `figure`, `palette`, `px` and `nole`, plus `radnus`, `orb`, `orb-medium`, `mas-medium`, `chatgtp`, `civic-extras` (the senators) and `terb-sheet`.
- **Rooms:** the boardroom, bullpen, lighthouse, lobby and Nole's desk.
- **Kits:** `mas-monitor`, `post-card`, `post-any`, `blueprint`, `palettes` (EARLYWEB16), `ui.ts`.
- **From Ep1's animatic `lay` and `rooms/kit-b`:** the text helpers.
- **Two Ep1 drawings, imported as they are:** the arena monitor and the glass in hand.

**Copied** (Ep1 and dev code is never edited; every copy names its source in its header):
- **`kit.ts`:** the T3 cut-paper tier (`paper`, `paperSprite`, `grain`), from Ep1's act-1 v35 art. It also holds the party arms (`capsule`, `armTo`, `grip`, `HANDSKIN`), from Ep1's `act3/art/party.ts`.
- **`cast/alyi2.ts`:** the happy eyes and the stand rig, from `alyi-speak`.
- **`cast/mas2.ts`:** the stand rig, from `mas-stand`.
- **`f21/`:** `era2008`, `mas08`, `palettes` and `timeline`, from `studio/src/dev/meras/`. The copies changed their import paths; `era2008` gained a screen-painter hook and a BETA starburst sized to its word, and `mas08` redraws the stage drawing's mouth (§5a).
- **`sets/cutaway.ts`'s key ECU** draws Ep1's `key-ring-insert` as it is, then paints its off-centre buckle out in the Ep2 still (the shared kit is untouched).

**New:** everything else in the folder, the 3D scene included. This pass added:
- **`cast/head3d.ts`:** the sculpted head (a ray-marched skull per character, cel-banded, with a procedural face).
- **`cast/hands2.ts`:** the posable capsule hand, sleeves, and the phone grips (on Ep1's `inserts-hands` renderer, imported).
- **`aros/aros_mammoth.py`** and **`tools/aros-comp.ts`:** the 2.A filler and its composites (§3b).
- **`tools/stills.ts`:** the text-fit check, the stills index, wrapped labels, the own-band stills.

**The guardrails, as drawn** [J]:
- **Parody names only** (naming.md). There are no logos, seals or real brands, and the broadcast is unbranded.
- **RUMPT** is hands and tie only. His post's avatar is a plain red square.
- **ALYI** is warm and human in 2022–2023. He is cropped by a frame in every present-day shot: his monitor's edge, the doorway jamb, the slot.
- **DOT** is seen from behind only.
- **Nothing in the art is photoreal, cloned or video-generated.**
- **No mouse cursor** appears on any Publish button.
- **Text** is legible at read time.

---

## 5. Looked at and fixed

### 5a. The second pass: the art review's findings

Each finding below was fixed, re-rendered and looked at full size; where a fix raised a new fault in the full-size look, that was fixed too (the last items).

- **Every new bust shared one skull.** The busts are now **sculpted per character**: `cast/head3d.ts` ray-marches each head from its own measurements (cranium, cheeks, jaw, chin, brow, nose, mouth, ears, neck, hair style) with cel bands, ambient occlusion, a cast shadow and rims, and draws the face procedurally (eye shapes, brows, mouths, age lines, glasses, stubble). `civic2.ts` `makeBust3` assembles them. SELBEEP (quiff, hooded eyes, heavy brows, his director's chair and megaphone), the FORECASTER (clipboard, watch, a focus brow), BUKAJ (a soft round face, glasses), EKIEL (a real one-row squint), XEL, the HUMANIST, the ENGINEER (headset anchored to his head), HARAS, the DRIVER (a cap) and the news host each read as their own person beside Ep1's lineup [J: a lineup render, Ep1 vs Ep2].
- **HARAS was a man's head.** She has her own: a bob, lashes, rose lips, no chin stroke, a blazer; her room sprite uses a new `bob` hairstyle and a woman's head (`roomHead {hair: 'bob', woman: true}`), in the lobby (sc 19, 20) and on her sheet.
- **The room heads read as goateed and snouty.** `civic2.ts`'s room head was redrawn (the mouth forward, the chin lit, the jaw's underside in mid tones, the neck set back and carried to the collar; the body's own neck part dropped) for XEL, SELBEEP, the staff, the HUMANIST, the FORECASTER, KOOC, the aides and EKIEL; Mas's Ep2 stand rig (`mas2.ts`) got the same treatment and a two-pixel mouth at the front of the face (on the bridge, at dusk, at the 2018 office).
- **ECU hands.** All the close hands use one capsule rig (`cast/hands2.ts`, on Ep1's `inserts-hands` renderer): posed fingers and thumb, cuffs, sleeves, front/behind compositing round props, and two tested phone grips (`holdPhone` wrap and cup). Redrawn with it: the darkroom phone turn, the party check-in, the bridge driver's arm and the scramble and the voice-menu thumb, the 2008 clicker and 2024 phone match, DOT's plate and screwdriver, the podium/broadcast hands, the séance planchette hands, the publish finger, the ISS 22.04 hand, the IOU corner.
- **The publish ECU** has a real pointing finger hovering over the bare Publish (and pressing it on the next drawing).
- **Alyi's eyes** were a dark mask (Ep1's socket shadow and a remap that turned the whites dark). The sockets are cleared to skin, the open eyes have whites, irises and a glint, and the brows are softer; the screen remap keeps whites light. Smiling or laughing, his eyes crinkle; the flame and 2023 looks are open-eyed and calm; the offsite mouth is closed.
- **Alyi's 2023 hologram** look became a person in screen light (his skin kept, cyan only on the lit planes), and both he and Ekiel face the screen, which moved to frame left.
- **XEL seated:** a real seated figure on a studio chair with a footrest, facing Mas.
- **The 2018 office:** a visible tumbler in Mas's hand, raised for 4.32; the staff rows with chairs and monitors, drawn in depth order; Nole in warm skin; the AGI inset.
- **The boardroom plates** follow the date (TERB, MAS MANALT, OMIS, NEW DIRECTOR, NEW DIRECTOR).
- **The presser** ends on 0 BILLS, a card hung over the stuck lectern; the corner TV in the lobby shows it too.
- **The stage:** the chat is its own strip beside the face (no cut-off), contrast raised, the highlighted message boxed; a new still 11.08 with the chat on; LIVE / ENDED tags sized; Rima's spot is a bright floor pool with a beam.
- **The domino run** lies on the floor between the desk rows.
- **The 2006 young Mas** was garbled and had a lilac block. The era palette is pinned by hand, the flip phone sits in his hand, and (in the Ep2 copy of the stage rig) his mouth is a small grin at the front of the face instead of a stroke that read as a moustache.
- **The flyers:** the flyer ECU is at the flyer's own scale (WHERE IS ALYI?, the doorway photo, tape, curl) on the complaint's own page; the pillar flyers read as paper (text rows, a dimmed photo, a cast shadow); the low-angle sign is keystoned and sized to its words, with DOT's hand holding the spare 0 from below.
- **ISS:** the ground textured, the cube bevelled, key and fill lights, the trees vertical in haze, the slot's raised bezel with the flap's gap and hinge (§3); the posing fixed (the arrive faces the door, the MCU faces the flap, the flyer sized to the slot).
- **The AROS filler** is built (§3b).
- **The missing drawings, now drawn:** the sc 20 IOU corner ECU (his fingers finding the yellowed corner in his hoodie pocket, no words); the MISC box ECU (MAY 17, the plate and screws in it); ghost 3's header with the 0% quote in full; the séance staff holding hands; the ceiling hole readable (drawn after the candle grade: lit torn edges, a hanging tile, insulation, the cable with a spark) and one candle flaring.
- **Text clipping:** every string the review listed was refitted (plates sized to their words), and the stills tool now checks every string (§1).
- **The minor list:** EKIEL on the lighthouse stair (his step) and the op-ed clipping as plain newsprint; the offsite doorway jamb cutting Alyi and his long fireplace match; chairs under every seated staffer and BUKAJ; a real lobby counter; the laptop glints off the staff's eyes; the melted chair in plastic teal (not blood); DOT pointing left at the door; the party's swag, raised hand and token streams of tiny glyphs; the cow as a real silhouette; CHATGTP's garden mitt and the harmony's mouths; one gate design in the garden; the keynote presenter a silhouette; the receipt reading `CLAUSE 9 …` only; SELBEEP's director's chair; the stills tool's label wrapping, one still per insert and per montage item, and the stage's chat still.
- **Found in this pass's full-size look, also fixed:** the calendar's snap line over MON 13; the 2008 BETA starburst fitted to its word; the lobby's PAUSE placard and the slab's caption; the DEFLECTION box labels; the TPOOL icon in its own home-screen slot; the rally signs inside the photo; the (FOR NOW) note; the plinth's BELOW · ABOVE · AROUND inside its band; the stray belt buckle in the key ECU; phones in a phone's proportions (the call tile, the face-down phone, the check-in); the news host's shoulders above the desk; the driver's forearm on the sill; the CHATGTP sheet laid out clear of its panel; the ghosts' headers on their own rows; the ouija's letters whole, with the Go board beside it; the lane receipt's text turned, not mirrored; Mas sitting on the desk's edge in 15.01 and standing on a tread in the stairwell; the director's chair moved off SELBEEP; the complaint hauled up clear of Mas; the plan's first still framing the whole OMNI stamp.

### 5b. The first pass

These faults were seen at full size and fixed. Each one was re-rendered and viewed again.

- **Room heads** faced the wrong way. They were rebuilt on Ep1's laht room head. Their dark neck rows read as a goatee, so the neck tones were lightened.
- **Expressions** didn't read. Each expression now swaps the brows, eyes and mouth. Hairlines were raised and brows darkened, because the brows had been hidden under the hair.
- **Busts:** `putBustCut` darkens rows far below the image, so busts sit at y≈56–67.
- **The mammoth** read as a striped dog. Its silhouette was redrawn: a domed head, a hump, a sloping back, shaggy strands, a trunk and tusks.
- **Lobby signs** overlapped Mas, and three-digit numbers overflowed their plates. The layout changed, the plates now size to their numbers, and the second sign has three lines.
- **The séance's candle grade** had hard rings, so it is now dithered. The Orb is drawn after the grade.
- **The mic at size 5** left the frame. Each size now has its own capsule top.
- **The KOOC key's bow** sat inside his torso. In the garden the key could only face one way, so it gained a flip.
- **The engineer's unclip hand** floated. It has new arm points.
- **The cutaway's facade slide** had wrong arithmetic, which is now fixed.
- **UI montages** squeezed their text, so each item now has its own still.
- **The glyphs ♥ and [ ]** are missing from the font, so they are hand-drawn.
- **The driver** was a floating head. He is now in a car window, with his forearm on the sill.
- **The party two-shot** had a black slab under Alyi. He sits at y 62, and the light swag crops his head.
- **At the offsite**, the door jamb now cuts Alyi, and the effigy's post is short.
- **The committee banner** was clipped by the split's pane. The banner and the TV moved inside the pane.
- **Adelina** was cut by the frame's top. She now stands on the highest step that keeps her whole.
- **The garden:**
  - The lock floated and KOOC stood in the gate. The lock now hangs on a hasp beside the gate, with KOOC turning the key from the right.
  - The leash is the velvet rope, and the stanchions are gone.
  - CHATGTP has its Ep2 face at room scale, and a `GUEST` tag big enough to read.
  - The garden bubble is wordless (grey bars), because no line is scripted for it.
  - IRIS sits on a real bench.
  - The raised hand is bigger, and it no longer covers the nodding flower.
- **The zAI lobby:** the blocky visitor became a real silhouette made from a room rig. The lamp is over Nole, and the caged phone glows and buzzes.
- **The tag:**
  - The podium was a brick box, and the hands came from nowhere. It is now THE PODIUM from behind (it faces away), with the hands entering from the frame's bottom edge.
  - The broadcast suit has lapels, a shirt V, and arms with elbows.
  - The rally photo was a frieze of heads. It is now a crowd of faces with plain signs.
  - The scan steps a bracket from face to face, with a terminal log beside it.
  - The decal moved off the toast.
- **The presser:** the `FORUM` stickers sit in a 3 × 3 grid, legible. The plate moved into the lower third.
- **ISS:**
  - Mas faced away from the cube, and he floated. Contact shadows fixed the floating.
  - The trees read first as igloos, then as rocks. They are now a hazed treeline.
  - The gap read white; it is now a dark hole with warm light.
  - The MCU torso stopped at the desk line. It now carries to the frame's bottom with an outline.
  - In the insert, the flyer hung on the wall like a poster. It now falls, tilted.
  - The flyer at the slot was too small; it is now letter-size.
  - Alyi wasn't cropped. He moved so the slot's edge crops him.
- **The previews:** every two-up preview was split into full-frame stills, because squeezing a frame to half its width distorts the pixels.
- **One bug, found by `tsc`:** SELBEEP's presenting remote never drew. The check compared the room arm with the wrong name. It now sits in his raised fist.
- **The band:** the font has no `§` or `é`, so the stills tool's band writes the plain forms.

---

## 6. Notes for the scene builders

- **The room area** is rows 0–202 (`RH = 203`), and the band sits below it. Every set draws into a 480 × 270 `Buf`. Pass `f` (the frame) and a small state object; each set's state is documented in its file header.
- **Monitor content** is a painter, `(scr: Buf, f) => void`. Hand it to `kits/mas-monitor`'s `drawMonitorPOV` / `drawMonitorOTS`.
- **The civic2 factory** (`cast/civic2.ts`):
  - **Busts:** each `makeBust` takes an `Expr` (`neutral`, `smile`, `laugh`, `worry`, `proud`, `squint`, `focus`) and a mouth. Place a bust at y≈56–67 with `putBustCut`.
  - **Room figures:** `makeRoom(spec).draw(b, footX, footY, pose, {flip, clip, map})`. A room figure faces screen-right unless flipped.
- **The sculpted busts** (`cast/head3d.ts`, `civic2.ts`): `makeBust3(spec)` takes a `BustSpec3` (`head`: the skull's measurements and hair; `face`: eye, brow and mouth styles; `torso`; `ramps`) and returns a memoised `(state) => Img`; `state` is `{expr, mouth}` (a viseme). `bustAnchors(spec, pose)` gives the face's points (eyes, mouth, nose, ear, chin, crown) for props like the engineer's headset. Place a bust with `putBustCut` at y≈30–60 so its shoulders clear any desk.
- **Hands** (`cast/hands2.ts`): `placeHand(POSES.point|open|grip|pinch(fwd, back, side), {s, at, anchor})` then `drawHand`; `sleeve` for the arm; `holdPhone(b, rect, {grip: 'wrap'|'cup', thumbAt, …, drawPhone})` holds anything flat (phones, cards, clickers) with the right parts in front of and behind it. `skinDown(k)` darkens skin for dim rooms. z is positive toward the camera.
- **Text** in sets goes through `kit.ts` `pt` / `bpt` / `tiny` so the text-fit check sees it; wrap decorative type in `untracked`.
- **The posts:** `props/ui.ts` `EP2_POSTS` holds every Ep2 post verbatim, by id. Draw one with `drawEp2Post(b, x, y, id, {size, w, k, hearts})`, which opens in three held steps through Ep1's kits.
- **SET-23:** call `issLayer(b, shot, f, st)` on a buffer filled with `TRANSPARENT`, then lay it over the plate with `issOver`. The layer needs the anchors from `setIssAnchors(JSON of plates/anchors.json)`.

---

## 7. Open issues and asks

- **The receipt's CLAUSE 9 line.** The art review asked for `CLAUSE 9 …` only, and the manifest agrees (`CLAUSE 9…`); the art draws that. `script-v1.md` line 1257 (and `proposal.md` line 595) still give the full `CLAUSE 9: THIS RECEIPT DOES NOT EXIST.` **Ask:** the script owner aligns the script, or tells the art to draw the full line.
- **The AROS filler** (§3b) is built in Blender, not with a video model or a browser 3D library. **Ask:** the showrunner approves its look from `out/ep02/v1/art/aros/`, or the 2.A owner drops in other frames (same rect).
- **The text-fit report's last flags are all deliberate:** a beanbag staffer in front of the complaint's `!!!` (lobby-2), the planchette over the board's `X` (séance 1–2), the three hands resting over the letters (séance 3), the Humanist's head over the boxes' labels (cutaway 3), the fire eating `UNALIGNED` (offsite 2). [M: `stills/textfit.json`]
- **Ep1's own rigs keep Ep1's faces.** Where Ep2 imports an Ep1 rig unchanged (Mas seated in the studio and the cutaway, Mas standing in the lobby, Tasya, Radnus, the Ep1 busts), their drawings are Ep1's. The Ep2 copies (`mas2.ts`, `alyi2.ts`, `f21/mas08.ts`) carry this pass's fixes.
- **THE PODIUM's hill (SET-08).** The manifest says "copy the intro's podium hill (P01)". No hill-with-podium drawing exists in code: the intro's podium is the roll-call flash on black (`cast/rollcall.ts`). SET-08 draws a new dusk hill and shows the roll-call podium's gold from behind. **Ask:** confirm the look, or point to the P01 frame.
- **22.06's flap swing** needs in-between plates (§3). This is a few minutes of Blender work.
- **SET-23 is still frames per shot.** The leap's motion is the pixel figures over locked plates. A camera move would need per-frame plates; the script supports that, but no frames were rendered.
- **The typecheck** covered the art folder with a scoped tsconfig. The whole-studio typecheck was not run.

---

## 8. The stills

`out/ep02/v1/art/stills/` (1920 × 1080; the SET-12 spread 1920 × 1348). The label is the band's text. Printed from `stills/index.json`.

| file | label |
|---|---|
| `set01-lobby-1.png` | sc 1, FEB 15: AROS on the wall screen (the 2.A filler in the bezel: the near-photoreal mammoth, previewed here box-averaged), the staff on beanbags, Mas at his counter, SELBEEP and his director's chair |
| `set01-lobby-2.png` | sc 1, FEB 29: the mammoth out on the carpet (its prints), the chair melted, the hand truck at the doors, DOT up the ladder, PAUSE through the door |
| `set01-lobby-3.png` | sc 13, MAY 15: February's flyers curling, Mas's taped back upside down, the complaint a side table (cups), the corner TV's presser |
| `set01-lobby-4.png` | sc 19, JUN 10: the watch party: ELPPA's keynote on the wall screen, signs 202 / 102, the tusk behind the back row, the confetti cannon |
| `set01-lobby-5.png` | sc 20, JUN 11 (morning): the complaint hauled up on its rope, the clean rectangle, the confetti swept, Mas peeling his flyer |
| `set01-lobby-6.png` | [ECU] 1.10 the complaint's page one, all exclamation points |
| `set01-lobby-7.png` | [ECU] 1.10 the contents |
| `set01-lobby-8.png` | [ECU] 20.08 the docket tab: HEARING · JUN 12 · MOTION TO DISMISS |
| `set01-lobby-9.png` | [LOW] 1.12 the sign from below, DOT's hand holding the spare 0 out |
| `set01-lobby-10.png` | [LOW] 1.12 the second sign hung under it: DAYS SINCE SOMEONE SUED MAS: 0 |
| `set01-lobby-11.png` | [ECU] 1.13 the flyer on the complaint: WHERE IS ALYI?, the doorway photo, the tape, the curl |
| `set01-lobby-12.png` | [ECU] 13.03 Mas's flyer on the pillar, taped back upside down |
| `set01-lobby-13.png` | [ECU] 23.02 the refiled complaint's page three |
| `set02-seance-1.png` | [W] 4.01: candles only, the staff holding hands, the board and planchette, the Orb over the table, the empty chair at the foot |
| `set02-seance-2.png` | [W] 4.07: CRASH, the ceiling hole over the foot of the table, the tiles and the cable; one candle flared; the ghost of 2016 hanging |
| `set02-seance-3.png` | [ECU] the board: the plain brass-rimmed planchette on the O (no pointer glyph); three hands resting on it (4.12) |
| `creature-ghosts.png` | ghost 1 (ALYI · JAN 2016, "less open") · GHOST-NOLE "Yup" (2016) · the cow (2018, ALSET plug) · NOLE · JUST NOW (!) · ghost 3: GHOST-NOLE 2018, his header the 0% clause |
| `set03-office2018-1.png` | [W] 4.28: Nole mid-speech at his slide ALSET · AI, the all-hands facing him, Gerg typing, Mas at the back with his glass |
| `set03-office2018-2.png` | [W] 4.30: the rows turned back to their monitors, Nole up the ladder to the hatch, Mas sipping |
| `set03-office2018-3.png` | [INSERT] 4.31 the arena on the one monitor plays on |
| `set03-office2018-4.png` | [2S] 4.32 Alyi, lit, cropped by his monitor's edge, turns and looks back at Mas, who lifts his glass |
| `set04-move37-1.png` | the stone clicked down, MAR 2016 · GAME 2 · MOVE 37; the stream of human games ticking every knob |
| `set04-move37-2.png` | "Then it played itself": the program's own boards pouring in (cyan); and the frozen wall |
| `set05-studio-1.png` | [2S] 6.01: CH. 1 OF 6 · REC, the mic at size 1, Mas (screen-left, his glass) and XEL (screen-right) |
| `set05-studio-2.png` | [2S] 6.08: the mic at size 5, filling the frame, Mas leaning around it; CH. 5 OF 6 |
| `set05-studio-3.png` | [MCU] 6.07 Mas against the curtain, a face light |
| `set05-studio-4.png` | [INSERT] 6.09 CH. 6 OF 6, the REC light out |
| `set06-cutaway-1.png` | [W] 7.01: the section opened, the lights on, the window low (the plinth, the basement: Tasya in the doorway, the Humanist with his boxes) |
| `set06-cutaway-2.png` | [W] 7.07: the whole-pixel pan up to the top: Mas at his monitor (a rung down), NopeAI's floors under him |
| `set06-cutaway-3.png` | [2S] 7.02 the Humanist with his box (caught out) and Tasya in the doorway, his phone face up |
| `set06-cutaway-4.png` | [ECU] 7.05 the key grown back, MAR 19, the paw-print key |
| `set07-darkroom-ui-1.png` | [POV] 8.01: the RULEBOOK notification slides down: the 400-page book, its SNOOZE button bolted to the spine (unpressed) |
| `set07-darkroom-ui-2.png` | [POV] 8.04 / 8.07: the calendar: his block snapped onto MON 13, Elgoog already on TUE 14, the June invite dropping in |
| `set07-darkroom-ui-3.png` | [ECU] 8.06: his phone face up, the call tile ELPPA (no face, no name), then CONFIRMED |
| `set07-darkroom-ui-4.png` | [OTS] 12.05: the afternoon recap on his monitor: ELGOOG'S KEYNOTE under the OMNI stamp (no blimp) |
| `set07-darkroom-ui-5.png` | [ECU] 20.10: the phone face down on the desk, lit at its edges |
| `set07-darkroom-ui-6.png` | [ECU] 20.10: then turned over by his hand (the fingers under its far edge, the thumb on the near one) |
| `set09-newsdesk-1.png` | [POV] 8.02: the news site, its cropped headline over the segment's still (the lineup); the still plays: the host turns to the lens |
| `set09-newsdesk-2.png` | the segment full frame: the lineup, the height chart, the host turned to the lens |
| `set10-stage-1.png` | [W] 9.01: the wings in work light: road cases, cables, the monitor (CHATGTP a plain bubble), Rima's hard spot, Gerg's road case |
| `set10-stage-2.png` | [W] 11.04: the locked wide: Rima's spot one step toward the screen, the face grown, VOICE 5, LIVE, the house full |
| `set10-stage-3.png` | [W] 11.13: ENDED; the house lights up a step, the house emptying, the phones raised and swung |
| `set10-stage-4.png` | [W] 11.08: the chat on (its own strip): "what's the catch?" scrolls up, lit; the face talking; LIVE |
| `set10-stage-5.png` | [W] 12.02 the front row in plain house light, the placard (it never flips) |
| `set10-stage-6.png` | [ECU] 12.03 the chrome armrest: Ep1's toast in it for 2 s |
| `char-chatgtp-ep2.png` | grow 0..3 · talking · the harmony (three mouths) · token eyes · 😊 · the garden (hand, GUEST band) · the VOICE panel, VOICE 5 saying Hey. |
| `set11-plan-1.png` | 10.01-10.02: the OMNI stamp whole; BEFORE: the clerks passing the note; the grate: TONE · LAUGHTER · WHO'S TALKING starting to fall through |
| `set11-plan-2.png` | 10.03-10.05: NOW: ear, eye, mouth wired into GTP-4o (it laughs back); 1. 232 MS (AVG 320) · 2. MON circled, tiny Radnus on Tuesday · 3. $0 |
| `set11-plan-3.png` | 10.07: the empty bubble drifts over the tiny stage and blots its lights; the sheet tears to the real stage lights |
| `set12-openfloor-1.png` | [W] 14.01-14.06: the spread with the band lit (Open greyed), the note on Alyi's door frame, the humming chair, DOT pointing a screwdriver at his door |
| `set12-openfloor-2.png` | [W] 14.12: Pivot door: it turns on its centre pin; the note gone into his pocket; the domino run lying along the floor to his shoe |
| `set12-openfloor-3.png` | [ECU] 14.11: the MISC box on Ekiel's empty desk, its label MAY 17, the team's plate and its four screws dropped in |
| `set12-openfloor-4.png` | [MCU] 14.03-14.04: his own face in the polished fins mouthing "can we talk?"; the strip with "come back" greyed |
| `set12-openfloor-5.png` | [HIGH] 14.10 the domino: Ekiel's post, MAY 17 |
| `set13-alyioffice-1.png` | [W] 15.01: the empty office in the evening: a desk with no chair, the door open; Mas sits on the desk's edge (cast) |
| `set13-alyioffice-2.png` | [2S] F2.2 15.10-15.11: 2023, night: Ekiel squinting, Alyi at his screen ("Someone should."), the screen's edge cropping him, the post and its Publish |
| `set13-alyioffice-3.png` | [ECU] 15.12 his finger above the bare Publish (no hover) |
| `set13-alyioffice-4.png` | [W] 15.19 the stairwell, the request for comment push |
| `prop-tpool-1.png` | [ECU] 15.02 the thread collapsed to its dates and first lines |
| `prop-tpool-2.png` | [ECU] 15.04 the tiny old icon at the end of his home screen: TPOOL · 2012 |
| `prop-tpool-3.png` | [ECU] the splash: WHERE U AT? · LAST UPDATED 2012 |
| `prop-tpool-4.png` | welcome back, mas (the 2008 hourglass) |
| `prop-tpool-5.png` | typed: where u at? |
| `prop-tpool-6.png` | the map: every pin LAST SEEN: 2012 but one, ALYI CHECKED IN · DEC 2022 · "feel the agi", its ripple warming |
| `set14-party22-1.png` | [W] 15.06: the chant building, ALYI lit and laughing, hand raised, the swag of lights cropping his frame; the racks in the corner |
| `set14-party22-2.png` | [2S] 15.07: across the crowd: Alyi (the swag over his frame) to Mas, small, not chanting, his glass ("You're not chanting.") |
| `set14-party22-3.png` | [W] 15.09 the racks' status lights as token streams across the room (never his eyes) |
| `set14-party22-4.png` | [ECU] 15.08 his phone held up: TPOOL, CHECK IN, feel the agi |
| `set15-offsite-1.png` | [W] 15.13: the lodge doorway, Alyi half cut off by its frame carrying the flame to the effigy; staff in silhouette; trees |
| `set15-offsite-2.png` | [W] 15.15 the effigy catches (palette-cycled, never a strobe) |
| `set15-offsite-3.png` | [W] 15.16 the glow shrinking to one point of light |
| `set16-bridge-1.png` | [W] 17.01: the cathedral's front doors up the hill, the exit agreement pouring out like a receipt, the Forecaster arriving from the street |
| `set16-bridge-2.png` | [W] 17.03-17.07: mid-span, evening rush: five lanes stalled on the receipt, the Forecaster on the far lane, Mas small on the near one |
| `set16-bridge-3.png` | [W] 17.14 the night (the lights' one cycle) |
| `set16-bridge-4.png` | [W] 17.17 May 20: traffic moving, the receipt trodden flat, Mas under an umbrella, the cloud's blank letterhead, the blimp |
| `set16-bridge-5.png` | [W] 17.02 the quick run (three parallax planes) |
| `set16-bridge-6.png` | [LOW] 17.04 the pen on its bank chain |
| `set16-bridge-7.png` | [ECU] 17.08-17.10 the scramble in his hands: a clause, the grey LEGAL tile, a second request for comment, the call, a draft as grey bars |
| `set16-bridge-8.png` | [POV] 17.19 the voice menu, VOICE 5 [PAUSED] |
| `char-driver-1.png` | [M] "You gonna think it over…" (talk A, leaning out of the window, his forearm on the sill) |
| `char-driver-2.png` | [M] "Does honking count as disparagement?" (worry) |
| `creature-blimp-cloud-receipt.png` | the blimp sizes 1..4 (the last sagging, two lights left) · the storm cloud raining letterhead · the receipt strip |
| `set17-lighthouse-1.png` | [W] 18.01: the lighthouse, Ekiel on the stair with his box, Adelina at the top raising the lanyard, Mario writing, the CLOD case |
| `set17-lighthouse-2.png` | [ECU] 18.12: the four pages, the one line highlighted in yellow, "inherently" underlined in Mario's ink |
| `set02b-committee-1.png` | [SCR] 18.03 / 18.05: the plain podcast player at full frame, her captions, the board's statement card beneath |
| `set02b-committee-2.png` | SPLIT 18.07: LEFT the boardroom (the banner, the TV), RIGHT the lighthouse (Adelina's lanyard), the right pane a rung down |
| `set19-campus-1.png` | [W] 19.07-19.08: the crowd's backs under the giant screen, Mas at the edge typing (three collars, no pop), the chat lighting with his post, phones buzzing |
| `set19-campus-2.png` | [SCR] 19.06: the lobby wall screen's stream cutaway: the outdoor audience, our stream's UI, Mas small at its edge, head down |
| `set19-campus-3.png` | sc 20: the crowd thinned, the end card |
| `set20-f21-1.png` | [W] 19.12: 2006, a phone ad on a street corner: young Mas with a flip phone, grinning, the GPS pin bobbing over his head |
| `set20-f21-2.png` | [W] 19.12: the ad's end card, "WHERE YOU AT?" |
| `set20-f21-3.png` | [W] 19.13-19.14: the intro's 2008 frame, the clicker caught, the collars popped; the big screen's pins greying, LAST UPDATED 2012 |
| `set20-f21-4.png` | [ECU · MATCH] 19.15: the 2008 clicker in his hand (-> the 2024 phone in the same grip) |
| `set20-f21-5.png` | [ECU · MATCH] 19.15: the 2024 phone in the same grip, his post on it |
| `set20-f21-6.png` | [POV] 19.11 the breadcrumb drawing itself over the 2024 stream |
| `set21-garden-1.png` | [W] 19.16: the hedge, its one gate open; MIT KOOC turns the key in the lock; CHATGTP led in on a velvet rope, GUEST |
| `set21-garden-2.png` | 19.16 / 19.20: his phone's picture opening outward (three held steps; this is the second), or folding back |
| `set21-garden-3.png` | [W] 19.17: the beds of phone-shaped flowers; CHATGTP raises a tiny hand, the flower nods, a text bubble pops; IRIS on her bench at 99% |
| `set21-garden-4.png` | [2S] 19.18 outside the hedge: Mas, phone in hand, watching; Radnus along it, rising into frame, politely outside too |
| `set21-garden-5.png` | [W] 19.19 the reverse, from inside: the gate swinging shut behind CHATGTP, the lock turning once; Mas outside, screen-right |
| `set22-zai-1.png` | [W] 20.01-20.03: the cage at the doors (tag, open padlock), the banner KORG 2: NEXT QUARTER, Nole under his lit lamp, phone up; the visitor at the glass |
| `set22-zai-2.png` | [ECU] 20.04: his own phone inside the locked cage, buzzing, the replies stacking where he can't reach them |
| `set23-iss-1.png` | [W] 22.02: the lot, the cube; Mas walks up from frame-left, THE ORB scanning the cube (it toasts nothing) |
| `set23-iss-2.png` | [MCU] 22.04 over his shoulder at the slot: the flyer, upside down, tape on its corners, lifts the flap |
| `set23-iss-3.png` | [INSERT] 22.05 the gap fills the frame: a lit room, Alyi at a desk, working, absorbed, cropped by the slot's edges; the flyer drops, unseen |
| `set23-iss-4.png` | [ECU] 22.06 the flap swung shut on its spring (no return) |
| `set23-iss-5.png` | [MCU] 22.07 Mas at the shut flap, the face light one step |
| `set23-iss-6.png` | [M] 22.08 the door and his raised hand (held two beats), then lowered |
| `set23-iss-7.png` | [W] 22.09 he walks away the way he came: his back, small, crossing the lot; the cube doesn't change |
| `set08-podium-1.png` | [POV] 23.06: the Aug 21 interview in a plain player: hands and tie only, the lower third "…having me speak… It's a little bit dangerous out there." |
| `set08-podium-2.png` | [POV] 23.07: THE PODIUM on its hill, still facing away; the same hands pump up the chatbot balloon (dot eyes, no words, no sticker) |
| `set08-podium-3.png` | [POV] 23.07: they tie it to the podium |
| `set08-podium-4.png` | [POV] 23.08: the string goes taut, as if someone on the far side of the podium had just taken hold of it |
| `set08-podium-5.png` | [POV] 23.03-23.04: RUMPT's post and the rally photo (SIRRAH's plate, SUMMER 2024); the Orb's TERMINAL scan, verified: human (all of them); the egg in a background tab |
| `set08-podium-6.png` | 23.01 the refiled complaint landed on his desk (the cover legible): FEDERAL COURT, the (FOR NOW) note crossed out |
| `prop-posts-ui-1.png` | posts: her · Alyi's two crops · Mas's May 14 · Ekiel's · the apology's first trim · NopeAI's pause · his Jun 10 · Nole's · Alyi's Jun 19 + the ISS card |
| `prop-posts-ui-2.png` | posts (2): the apology's other trims · RUMPT's on HTURT (its photo: sets/tag.ts) |
| `prop-posts-ui-3.png` | [ECU] 4B.01 the XEL invite on his phone (a mic icon where the next shot's mic stands), Accept |
| `prop-posts-ui-4.png` | [POV] 4.01 the blog editor: NOPEAI AND NOLE, the byline row, the bare Publish (no cursor) |
| `prop-posts-ui-5.png` | the push: request for comment (sc 15, 17), its thumbnail a strip of receipt paper |
| `prop-nameplates-4a.png` | [ECU] 4A.04 his nameplate, then the three new directors', one by one (the last on its click) |
| `prop-presser-1.png` | [SCR] 13.04: the presser at full frame, REMUHCS · MAJORITY LEADER, the lower third, the lectern with nine FORUM stickers |
| `prop-presser-2.png` | [SCR] 13.05 an aide slaps on a tenth sticker; they try it sideways at the FLOOR door |
| `prop-presser-3.png` | sc 19 (the corner TV): still stuck at the door, 0 BILLS |
| `char-selbeep.png` | busts: proud with the remote · talking (A) · "Directionally." (worry) · laugh; room: present, point, down |
| `char-xel.png` | busts: listening · the long question (focus, talk E) · warm · curious (worry); seated: rest, talk, lean 2 |
| `char-humanist.png` | busts: caught out with his box (worry) · "Is there room?" (talk E) · polite smile · talking (O); room: carry, walk, down |
| `char-engineer.png` | busts: presenter (smile) + phone · nervous laugh · "What if it freezes?" (worry) · unclipping, off mic; room: phone, raise, unclip |
| `char-bukaj.png` | busts: "It's still warm." (smile) · talking (E) · "Not yet." (focus) · neutral; room: carry, seated, stand |
| `char-ekiel.png` | busts: squint (card) · F2.2 at the screen, "Nobody knows how" (talk, cyan) · sc 18 lanyard, "You annotated?" (worry) · dry smile; room: carry, climb, stand |
| `char-forecaster.png` | busts: "Here's where I am." (focus, talk) · the forecast (smile) · checking his watch · neutral; room: walk, talk, cross out, asleep; the umbrella |
| `char-haras.png` | busts: "starting with the easy ones" (smile, talk) · "And profit?" (focus) · "Upside." (proud, the tape up) · neutral; room: walk, stand, on a beanbag; the tape |
| `char-kooc.png` | room: the key carried · the turn (three held steps) · the key alone |
| `char-alyi-ep2.png` | busts: the chant (laugh, hand up) · "You're not chanting." (smile, talk) · TPOOL check-in · 2023 "Someone should." · the flame; room: chant, torch; ISS at work |
| `char-mas-ep2-1.png` | phone (bowed) · umbrella · tape · knock · glass · slot (the flyer) · from behind: walk |
| `char-mas-ep2-2.png` | [ECU] sc 20, Jun 11: his fingers finding the IOU's yellowed corner in his jacket's pocket (the corner only; no words) |
| `char-dot-1.png` | from behind up the ladder: reach (the plate swap) · hold (the spare 0) · grip (the sway) · point (the screwdriver); standing |
| `char-dot-2.png` | [ECU] sc 14.11: her orange-cuffed hand backs out the four screws, one per beat (2 of 4 out) |
