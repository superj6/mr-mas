# Ep1 full v3 · art-b: Acts Two, Three and the tag

| | |
|---|---|
| **What this is** | The record of the pixel assets built for Acts Two, Three and the tag (sc 13–23, 32–33) for the full-episode pixel preview. For each asset it gives the id, the module, the entry points a shot layout calls, the states, and what is still a stand-in. |
| **Who, when** | The `v3-art-b` pass (track P1b of [PLAN.md](../PLAN.md)), 2026-09-27. Nothing was committed: the lead commits. |
| **Built against** | [script.md](../../../script.md) (Acts Two, Three and the tag); the v2 stick timelines `show/reel/ep01-full/ep01-{act2,act3,tag}-v2.json`; the cuts C7–C12 in [stick/v3-plan.md §3](../../stick/v3-plan.md); the v3 beat plans `beat-plan/{act2,act3,tag}.json` (read about 11:40, after they landed); and the P1b list in [script-v3-notes.md §7](../script-v3-notes.md). |
| **Where it is** | **Code:** new additive modules in `studio/src/shared/pixel/{rooms,cast,kits}/` (the table below). The stills registry is `studio/src/episodes/ep01/pixel/art-b/demos.ts`, with its sheet tool at `tools/sheet.ts`. **Stills:** `out/ep01/full-v3/assets/art-b/`, holding `sheet-native.png` (113 stills at 1x, 4 across), `native/` (480×270), `full/` (1920×1080, 4× nearest) and `index.json`. |
| **Measured** | 113 stills render. `sheet.cjs strays` prints `ok` for all 113 (the master palette, plus the engine's LEDGER set for the flash-print). `tsc` over the registry and every module it imports (61 shared files) prints nothing. `git status` shows only new files from this pass: no existing file was edited, Act Four's included. |
| **Needs a person** | I looked at every still at 1x and 2x, and cropped the doubtful ones at 3–4×. I fixed what didn't read to me (§4). That is one reader's judgment, not a blind read. Nothing has been seen in motion: every held-step timing is on paper. No v3 shot layout exists yet, so each still shows its asset in a demo framing (the beat it serves is in its note). |

---

## 0. The short version

- **Built: 8 sets and plates, 11 rigs, 14 prop and UI kits.**
  - **Sets:** the White House meeting room, the bridge, the Senate, the rooftop, the dark room's Act Three and tag overlays.
  - **Kits:** the tour poster, the register, the Senate props, Mas's monitor with its painters (TIDDER, the EO signing, DevDay, the lighthouse item, the cold open on the monitor), the phone from above, the Orb's toast and scan fan, EMIT's cover, THE GREY LADY's front page.
  - **Cast:** SIRRAH, NEDIB (and the deepfake copies), LAHTNEMULB and THE CLONE, SUCRAM, NESNEJ, RUMPT's silhouette, the senators, the gallery, the signers, the news anchor, the photographer, and TASYA walking on at DevDay.
- **Cast tiers.** Every speaking principal has two drawings.
  - A bust at the approved 112 × 136 size. It plays the `[MCU]`, and two busts behind a table make the `[2S]` (head ≈ 40 px, inside §4.1's `[M]` range).
  - A room sprite at ≈ 80 px for the wides.
  - Both are built on one shared kit, `cast/civic-kit.ts`. A new face is its signature features and props, never a new skull. That keeps the caricature in the silhouette and away from likeness.
- **Reused whole:**
  - the dark room's plate and wide (`rooms/darkroom-plate.ts`, `rooms/darkroom.ts`);
  - the Orb (`cast/orb-medium.ts`);
  - Mas's portrait, medium and standing rigs;
  - Mario's portrait and room sprite;
  - Tasya's portrait (re-lit warm by a ramp swap) and room sprite;
  - the lighthouse (`rooms/lighthouse.ts`, with its rent meter and phones);
  - the post card, the odometer, the tap hand and the 2 AM phone geometry;
  - the roll call's NESNEJ geometry;
  - two `v3-art-a` modules as they landed: RADNUS's room sprite (`cast/radnus.ts`) and the APEC stage (`rooms/apec-stage.ts`, for the cold open's frame on the monitor).
- **Stand-ins (one):** the **RADNUS bust**. Art-a built him at room scale only, and sc 13 needs him at bust size in two two-shots and the pan. It's a placeholder in art-a's colours (§3).
- **Cut, so not built (C7–C12):**
  - the poster's cuff and NOTERB;
  - 15.08 and 15.09;
  - NOTNIH's plate;
  - the hands runner, New Delhi, the lightning egg, the scroll pour and the glass paperweight;
  - the tag's drawer, the duck and the glass prompt.
- **Not taken:** the Act Four items in script-v3-notes §7 (S1.01–S7.07b). They're edits to Act Four's own modules and are left for the Act Four shot pass (§5).

---

## 1. The assets

**How to read the table.**
- *Module* paths are under `studio/src/shared/pixel/`.
- *Sheet* keys are `ID@state` in `index.json`, with files at `native/ID--state.png` and `full/ID--state.png`.
- Every module's header comment has the full interface. This table is the map.
- Every drawing function paints rows 0..202 of a 480 × 270 `Buf` (the rail band below is the pipeline's). They're deterministic on `(f, state)`, use whole pixels and held drawings, and stay inside the master palette.

### 1.1 The cast kit

| Id | Module | Entry points | States | Stand-in / open |
|---|---|---|---|---|
| **KIT-CIVIC** | `cast/civic-kit.ts` | `bustHead(spec, face, o)`, `suitTorso(t)`, `roomBody(spec, arm, legs)`, `headStamp`, `putBustCut(b, img, x, y, cutY, flip)`, ramps `SKIN` · `SUIT` · `HAIR` · `SHIRT_*` | head knobs: `long`, `jaw`, `soft`, `age`. Face: 6 visemes, 3 lids, a 1-px dart, 3 brows, eye styles calm · lash · crinkle, mouth widths 0–2. Torso kinds: suit, blazer, pantsuit, jacket. Room arms: down, point, baton, spread, card, clasp, write, reach, up, phone, stamp, hip, clap0/1; legs: stand, w0..w3 | `putBustCut` re-implements the Act Four framing kit's `bust()` falloff (episode code can't be imported into shared). |

### 1.2 Act Two: sc 13, the White House

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **ROOM-WH** | `rooms/whitehouse.ts` | `drawWHWide(b, f, st)`, `drawWHWall`, `WH` (geometry, seats, tripods, NEDIB's stride) | `door` 0–3 · `nedib {t}` (the stride, 4 drawings) · `tripods` 0–3 · `flash` 0–2 · `photographer` set / stand · `blocks` AI / IA · `sirrah.on` A / I / row / null · per-seat `look` head / door / cam3 / cam2 / ceiling / lens · Mario's `finger` 0–2 · `flame` 0–2 · `scroll` px (13.01, 13.06, 13.08, 13.11, 13.12) | The row is standing room sprites cut by the table. Turned heads are back-of-head overlays, and Mas's lens look is a front-facing head overlay. |
| | | `drawSirrahMCU(b, f, {on, sirrah})` | the pointer on A / I, the blocks at MCU size (13.02–13.04) | — |
| | | `drawWH2S(b, f, {L, R, pad, scroll, flame})` | any two busts behind the table (13.05, 13.09) | RADNUS's bust |
| | | `drawClassRow(b, pan)`, `WH_ROW` | the long plate at close-up size, a whole-pixel pan from 0 to `panMax` (13.07). Tasya faces camera 3 (re-lit warm), Mario camera 2, Radnus the ceiling, Mas the lens | RADNUS's bust |
| | | `drawWHOTS(b, f, {nedib, finger, scroll})`, `drawIndexUp` | from behind Mario's raised **index** finger onto NEDIB. `scroll` 0–3 are the held steps; 4 is the whole scroll out (draft 6's 13.13) | — |
| **PROP-COLLAR-FLAME** | `rooms/whitehouse.ts drawCollarFlame` | `(b, f, {size, pat})` | size 1 / 2 (the flame at insert scale: `kits/wh-props drawBigFlame`), the pat in 2 held drawings (13.10) | In art-a's colours (navy sweater, pale collar); the jaw and neck are generic |
| **PROP-CLASS-PHOTO** | `rooms/whitehouse.ts drawClassPhoto` | `(b, f, {caption, hand})`, `CLASS_PHOTO_STATE` | the flash frame printed: three CEOs turned to the door, NEDIB in the door, blocks I A, Mas at the lens, Mas's hand (13.14) | — |
| **PROP-AI-BLOCKS** · tripods · ceiling cam | `kits/wh-props.ts` | `drawBlock`, `drawBlocks(b, x, floorY, s, {order, hit})` (returns the face centres for the pointer), `drawTripod(b, x, floorY, n, {flash})`, `drawCeilingCam`, `drawBigFlame` | any size, AI / IA, hit | — |
| **CAST-SIRRAH** | `cast/sirrah.ts` | `sirrahBust(state)`, `SIRRAH_POINTER_HAND`, `drawPointer(b, hx, hy, tx, ty)`, `drawSirrahRoom(...)` (returns the hand) | bust arms point / down, 6 mouths. Room: point / clasp / down | — |
| **CAST-NEDIB** | `cast/nedib.ts` | `nedibBust(state)`, `drawNedibRoom(b, footX, footY, pose)` | bust arms baton / down / sign / clap0 / clap1; `copy` 0 / 1 / 2 (the deepfakes: a crude flat print, a scissor-cut paper margin, a laminate sheen, the wrong tie: green / teal). Room: stride w0..w3, baton, point, write, clap; `copy` | — |
| **CAST-RADNUS-STANDIN** | `cast/radnus-standin.ts` | `radnusBust(state)`, `RADNUS_COLLAR` | fold / write / pat / lean, `up` (the ceiling camera) | **The bust is a stand-in.** His room sprite in the row is art-a's `cast/radnus.ts`. |
| **photographer** | `rooms/whitehouse.ts` (internal) | drawn by `drawWHWide` | back to us, set / stand | — |

### 1.3 Act Two: sc 14, the bridge

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **ROOM-BRIDGE** | `rooms/bay-bridge.ts` | `drawBridgeOTS(b, f, {mouth, progress})`, `BRIDGE_PHONE` | over Mas's shoulder at the bullpen window: the clip on his phone and the `⚠ ALTERED AUDIO` tag. `mouth` comes from the lagged clock: the shot runs it a beat late (14.01) | The clip is drawn with 2 × 2 cells (the phone screen's own pixels, the Act Four "screen macro" allowance). |
| | | `drawBayWide(b, f, {hail, plink, glow})`, `BAY` | the bay and the lit skyline: the ONE dark tower with its one lit window. The hailstone's fall (t), the ripple (k), the glow off (14.02, 14.05) | The far building follows art-a's APEC plate (a narrow dark tower, one warm window). At night every other tower is lit. |
| | | `drawLitWindow(b, f, {nod, glow, hail})`, `LITWIN` | RUMPT's silhouette with the phone and the clip's grey tag strip on it, nodding on the beat; the hail out of the window's foot (14.03, 14.05) | — |
| | | `drawRepostECU(b, f, {step})` | hover / press / done `✓ REPOSTED` (14.04) | — |
| **KIT-NEWSCLIP** | `rooms/bay-bridge.ts` + `cast/civic-extras.ts` | `drawNewsClip(b, x, y, w, h, st)`, `alteredTag`, `warnIcon`, `repostIcon`, `drawAnchor(b, x, y, {mouth, px, blink})` | the invented anchor (no network, no name) | — |
| **CAST-RUMPT-WINDOW** | `cast/civic-extras.ts drawRumptWindow` | `(b, x, y, {nod, glow, size})` | **Silhouette only** (the roll call's convention): a plain round head, square suit shoulders, the over-long tie, the phone's cool rim. Any `size`, re-rasterised as geometry | — |

### 1.4 Act Two: sc 15, the Senate

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **ROOM-SENATE** | `rooms/senate.ts` | `drawSenateWide(b, f, st)`, `SENATE` | `lit` (which mic's red light is on) · `lean` · `gasp` · Mas's wallet up · Sucram phone / stamp / slam · the chairman's card · the clone's pose (15.02, 15.10, 15.13) | Staging: the dais seats run across frame right. The clone sits beside the chairman on the witnesses' side, in the taller, studded chair. |
| | | `drawSenateDais(b, f, {sheet})` | the dais across the frame. `sheet` 1 arriving from frame left, 2 in the clone's hand, 3 held up and turned over (15.16) | — |
| | | `drawWitness2S(b, f, {mas, sucram, moth, pocket})` | MAS + SUCRAM, both facing the dais (the busts flipped: nothing on them carries lettering). The moth on the pad or dodging (15.04, 15.05, 15.11, 15.14) | — |
| | | `drawDais2S(b, f, {chair, clone, lit})` | matte against glossy, the better chair (15.03) | — |
| | | `drawSenateOTS(b, f, {take})` | from behind Mas. `take` 0 → 3: the clone takes the card out of the chairman's hand (15.07) | — |
| | | `drawSenateMCU(b, f, {bust, third, bg, mic, lit})` | any bust over the drapes or the gallery (15.01, 15.06, 15.18) | — |
| **PROP-WALLET** · **PROP-SHEET** · mics · stamp | `kits/senate-props.ts` | `drawWalletECU(b, f, {open, moth})`, `drawSheetHigh(b, f, {slide, stamp})`, `drawRegulateSheet`, `drawSheetBack`, `stampMark(b, x, y, second, k, {scale, tilt})`, `drawMic`, `drawMoth`, `drawStampPad` | `HEALTH INSURANCE`. `PLEASE REGULATE ME` sliding with the stamp up / down / done. `CALLED IT. (BEFORE LAUNCH.)` / `(BEFORE SUCRAM.)` (15.12, 15.15, 15.17) | — |
| **CAST-LAHTNEMULB** | `cast/lahtnemulb.ts` | `lahtBust(state)`, `LAHT_CARD`, `drawIndexCard`, `drawLahtRoom` | bust arms card / down / mic / take / sheet; `clone` (the hair's 1-px hot highlight, specular points, the lapel sheen, brighter ramps). Room: card / down / lean / up, `nod` | — |
| **CAST-SUCRAM** | `cast/sucram.ts` | `sucramBust(state)`, `drawStampProp`, `drawSucramRoom` | phone / stamp / slam / down (the stare) | — |
| **CAST-SENATORS** · gallery | `cast/civic-extras.ts` | `drawSenator(b, x, footY, v, pose)`, `galleryTile`, `drawGallery(b, x0, x1, y0, rows, {gasp})` | 3 variants: sit / lean / sign / up. The gallery is one drawing, tiled, with the gasp | — |

### 1.5 Act Two: sc 16 and 17, the poster and the rooftop

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **KIT-TOUR-POSTER** | `kits/tour-poster.ts` | `drawTourPoster(b, f, st)`, `drawPosterSmile`, `TOUR_CITIES` | one held poster. `strip` (the review quote, the beat plan's "EU'S AI RULES") → `cancelled` k → `post` k (post-card popup, `…no plans to leave`, `@mas`) → `un` k → `added` k. Each stamp lands in 2 held steps. The smile cut-in (16.01, 16.05 merged) | The cities are flavour (the real spring-2023 tour) and assert no dates. |
| **ROOM-ROOFTOP** | `rooms/rooftop.ts` | `drawRooftopWide(b, f, st)`, `drawQuoteBox`, `drawCrack`, `crackPath`, `ROOF` | `signers` queue / sign / leave · Mas stand / reach · Mario stand / write / finger · `register` 0..1 (it rolls, the casters' 2 drawings) · NESNEJ · `crack` 0..1 · `look` (17.01, 17.03, 17.04, 17.11) | The sky is laid out afresh per horizon line (the wide's, the 2S's, the OTS's), never stretched. |
| | | `drawRooftop2S(b, f, {hand, write, turn, footnote})`, `drawRooftopOTS(b, f, {nesnej, finger, press})`, `drawGlassCrack(b, f, {run})` | Mas's hand out for the pen; Mario writing; both turn to the register (17.02, 17.05). From behind Mario's finger onto NESNEJ at the register (17.06). The glass: the reflected crack's `run` 0–3 steps to his reflection (17.12) | — |
| **PROP-REGISTER** | `kits/register.ts` | `drawRegisterRoom`, `drawRegisterBust`, `drawKeyECU(b, f, {press})`, `drawRegisterWindow(b, f, {pop})`, `drawLedgerPlate` / `ledgerPrint`, `drawPurchaseOrder` | KA-CHING's key (17.07), the LEDGER flash-print (17.08), `INVIDIA · $1,000,000,000,000 (INTRADAY)` popping on the flags (17.09), `PURCHASE ORDER · AI CHIPS · QTY: MORE` in Mario's hand (17.10) | — |
| **CAST-NESNEJ** | `cast/nesnej.ts` | `nesnejBust(state)` (124 × 150), `NESNEJ_KEY_TIP`, `drawNesnejRoom` | spread / key / down; mouths grin / A / E / O / M; light sun / screen. Room: spread / key / down / up (the chip, for the tag's egg if it ever returns) | The face and jacket geometry is the roll call's (copied: `nesnejFig` isn't exported; `rollcall.ts` isn't edited). |
| **CAST-SIGNERS** | `cast/civic-extras.ts drawSigner` | `(b, x, footY, v, pose, {f})` | 3 unplated signers: stand / sign / walk. v0 holds a chess piece (the insider's egg) | — |

### 1.6 Act Three and the tag: the dark room

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **ROOM-DARK-A3** | `rooms/darkroom-act3.ts` | `drawDarkA3(b, f, st)` (returns the scan's Mask) | Act Four's plate composed with: the Orb at `home` / `shoulder` / `box` / a point; the `outline` (empty / filled); `leds` off; the COINWORLD `box` tray; the EMIT `mag` tray; the paper's thud; the cover in his hand; `scan {dir, half}`; `toasts[]` (18.01, 18.03, 18.06, 19.01, 20.02, 20.04, 21.04, 22.03, 23.03, 32.01, 32.04, 33.01) | **Decision, §2.1:** the Orb's home outline sits on the wall right of the window. |
| | | `ORB_HOME`, `drawOrbOutline`, `ledsOff`, `drawBoxTray`, `boxOrbAt(rise)`, `drawMagTray` | overlays for any other composition | — |
| | | `drawScanMCU(b, f, {mas, fan, toast})` | the thin cone across his face. Its Mask is the GLYPH layer's, tokens inside the cone only. The toast (18.04, 18.04g, 18.05) | — |
| | | `drawOrbOTS(b, f, {screen, mas})` | from behind the Orb (r 44, foreground right), Mas lit cyan, any painter on the monitor (19.12) | — |
| | | `drawCoverMCU`, `drawBackWall(b, f, {cover, frame, mas, orb})`, `drawProfileGlass(b, f, {mas, hop})` | the cover beside his face (32.03, 32.05); the back wall with the cover pinned and the GUEST lanyard framed (32.07); his profile with his glass in the frame, water line flat (33.04, the beat plan's new composition) | — |
| **PROP-COINWORLD** | `rooms/darkroom-act3.ts drawLabelECU` | `(b, f, {hand})` | `FROM: COINWORLD · PROOF YOU'RE HUMAN` / `SHIP TO: MAS MANALT, CO-FOUNDER`; his fingertips at the lid (18.02) | — |
| **KIT-MAS-MONITOR** | `kits/mas-monitor.ts` | `drawMonitorPOV(b, f, painter, {window})`, `drawMonitorOTS(b, f, painter, {plate})`, `MON_POV`, `MON_OTS`, `isMini`, `screenDim`, `screenScanlines`, `eggCorner` | Every monitor item is a **painter** that lays itself out for POV (380 × 186), OTS (258 × 138) or the plate's 96 × 60 virtual screen (the two-shot). `screenDim` is the tag's monitor with nothing on it (32.01, draft 6). `eggCorner` is Neleh's glowing paper with its footnotes orbiting | The POV bezel and window strip follow Act Four's S5.06 (`kits/staff-letter.ts`), re-drawn here. |
| **UI-TIDDER** | `kits/tidder.ts` | `tidderPainter({phase, typed, count, spin, editK, tight})`, `TIDDER_*`, `editText(k)` | typing (20.01), posted with the counter blur and the first reply (20.03), the edit letter by letter, `tight` at the display size (20.05), mini | Parody site, generic UI, a teal header (off-brand). |
| **UI-EO** | `kits/eo-signing.ts` | `eoPainter({copies, pop, pen, signK, turn, clap, mouth, copyMouth, stat, egg})`, `EO_POV_FACES` | NEDIB, the pen raised, over the order running off both ends of a very big desk (draft 6). The copies pop behind the desk and at the window (3 held steps), he turns to them, the stat chip, he signs, they clap. The mini shows the three heads (21.02–21.05) | — |
| **UI-MONITOR** (items) | `kits/monitor-items.ts` | `lighthousePainter({ring2, answer, meter})`, `devdayPainter({rise, clunk, tasya, laugh, mouth})`, `coldOpenPainter()` | the lighthouse with its own `MISANTHROPIC` sign, Mario on phone one (19.11, 19.13); DevDay with the odometer's 3 held steps up through the floor to `100,000,000 / WEEK` and Tasya walking on, arms open (22.01); the APEC frame (23.01) | The cold open's frame is art-a's `drawApecWide`, cropped 1:1. |
| **UI-PHONE-HIGH** | `kits/phone-high.ts` | `drawPhoneHigh(b, f, {screen, thumb, orb})`, `attendeeCircles`, `ORB_CIRCLE_LOOKS`, `STRIP_SUPER`, `phoneMini(kind)` | `prompt` (`How did the keynote go?`, `[super] [enthusiastic] [thrilled]`), thumb hover (draft 6's new pose) → tap (22.02); `reminder` (`Board sync · Fri 12:00`, the four circles, the Orb's iris stepping) → `dark` (23.02, 23.03); `call` (GERG · speaker); `phoneMini` for the plate's phone | The four circles follow art-a's `kits/phone-invite.ts` design. Its card is too wide for this phone, so it's drawn at this screen's size. |
| **KIT-ORB-TOAST** | `kits/orb-toast.ts` | `drawToast(b, x, y, s, k, {kind, anchor, f})`, `drawScanFan(b, ax, ay, dir, half, {len})` (returns a Mask), `fanSweep` | verdict (the intro's chip), working (`re-scanning…`, a spinner), note | — |
| **PROP-EMIT** | `kits/emit-cover.ts` + `rooms/darkroom-act3.ts drawSlotECU` | `drawEmitCover(b, x, y, 'ecu' \| 'mcu' \| 'desk' \| 'wall', {sheen})`, `drawSlotECU(b, f, {out})` | `EMIT` in a slab masthead on a **teal** border (off-brand: no red border), Mas lit like a keynote, `CEO OF THE YEAR`. It slides down out of the rack's slot at 1:1 (32.02). | — |
| **PROP-GREY-LADY** | `kits/grey-lady.ts` | `drawFrontPageHigh(b, f, {settle})`, `drawPaperPlate(b, x, deskY, {phase, k})`, `serif`, `GREY_LADY_STAMP` | a plain hand-pixelled serif masthead (never blackletter), six columns, and the clerk's stamp in three lines, bold and legible: `COMPLAINT` / `THE GREY LADY v. MACROSOFT & NOPEAI` / `COPYRIGHT · FILED DEC 27, 2023` (33.02). The fall and the thud at two-shot scale (33.01) | — |
| **CAST-TASYA-STAGE** | `cast/civic-extras.ts drawTasyaStage` | `(b, x, footY, {f, walk, laugh, flip})` | walking on, arms open, laughing (22.01) | Tasya's own room sprite has no open-arms pose, so the same design is redrawn on the civic kit (`tasya-speak.ts` isn't edited). |

---

## 2. Decisions for the lead

1. **The Orb's home outline (sc 18).**
   - The script puts the faded outline "on the wallpaper at Mas's right shoulder". In the existing dark-room plate, and in the intro's wide, the Orb's spot at his shoulder is in front of the window, where there is no wallpaper.
   - I put the outline (`ORB_HOME`) on the wall between the window and the rack. The Orb settles into it at "you can stay." and sits there through Act Three.
   - Act Four keeps its Orb at his shoulder (it drifts over when it watches him).
   - If the lead wants the outline at the shoulder spot instead, it would have to go on the window glass.
2. **The dark room's orientation.** The script's PLAN has the monitor at frame right and the rack at frame left. I kept the Act Four plate as it is (monitor left, rack right) for continuity with Act Four's pixel preview. The rule "Mas frame left" still holds.
3. **The 2 × 2 news clip.** The anchor on Mas's phone (14.01) and the tag on the repost insert (14.04) are drawn in 2 × 2 cells: the screen's own pixels shown big, the Act Four framing kit's "screen macro". If that counts as a scaled sprite, the anchor needs a native drawing at the phone's size.
4. **The copies' tell.** The deepfake NEDIBs are told apart by a crude flat print, a scissor-cut paper margin and a green / teal tie. At the plate's small monitor (21.04), the three heads are about 10 px, so the Orb's look carries the pick. The POV frames carry the difference.
5. **The poster's handle.** His post uses the post card kit's `@mas` (the Act Four handle), not the v2 stick's `@masa`.

## 3. Stand-ins and cross-track notes

- **The RADNUS bust** (`cast/radnus-standin.ts`) is in the two-shots 13.05 and 13.09, the pan 13.07, and the collar insert's colours (13.10).
  - It's a placeholder in `v3-art-a`'s colours: the navy sweater, the pale collar, his skin ramp, the dark hair.
  - His room sprite in the row is art-a's own `cast/radnus.ts`.
  - If art-a draws a Radnus bust, `drawWH2S` and `drawClassRow` take it in place of `radnusBust`.
- **Art-a modules this pass imports:** `cast/radnus.ts` (the row) and `rooms/apec-stage.ts` (23.01). If either changes its exports, `rooms/whitehouse.ts` or `kits/monitor-items.ts` needs the matching edit.
- **The lit window** follows art-a's APEC far building, by reading its code, not by import.

## 4. What the review changed

I made two passes over the sheet. The fixes from the first pass:
- **Mario's finger (13.13):** it read as the wrong gesture. It's now the index finger, leaning toward NEDIB, the thumb standing off, the knuckles stepping down away from it.
- **Busts:** the busts' torsos ran on as flat slabs; they now fall off to shadow in bands.
- **The Senate:** the dais figures were hidden behind the bench, and the busts faced the wrong way. The dais-only frame now spreads the five seats.
- **Tasya:** his cyan-lit portrait is re-lit warm for the White House.
- **The deepfakes:** they looked identical to NEDIB. They're now crude cut-paper prints.
- **The stamps:** the ink misses broke the stamps' words. THE GREY LADY's words are now solid (only the box's rules miss), and Sucram's stamp misses less than half as often.
- **Layouts and props:**
  - the poster's list and stamps are re-laid inside the poster;
  - the register moved past the table's end;
  - the glass-crack insert now reads as a glass;
  - the reply-strip chips are clear of the thumb;
  - the ECU headline is on two lines;
  - Sucram's sleeve seen from above is now a filled band;
  - the fingertips have a palm.

**Still weakest, to my eye:**
- the collar insert's flat planes and its patting hand;
- the repost thumb;
- the small monitor's three NEDIBs;
- the rooftop wide's small figures under a big sky;
- the generic hands on the props.

## 5. Not built

- **The C7–C12 cuts** (above).
- **The Act Four items in script-v3-notes §7:** S1.01 race-weekend dressing, the S1.02 / S1.06 JOIN icons, the S1.04 key ring text, the S1.09 `ALYI` tag, S4.02's falling phone, S4.08's split without meter text, S7.07b's nameplate. They're opt-in states of Act Four's modules and are left to the Act Four shot pass.
- **The GLYPH tokens** in the scan cone. The engine draws them; this pass returns the cone's Mask.

## 6. Run (from `studio/`)

```bash
S=<scratch dir>        # your own subfolder of the session scratchpad
npx esbuild src/episodes/ep01/pixel/art-b/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
bash ../ops/heavy.sh node $S/sheet.cjs all ../out/ep01/full-v3/assets/art-b   # native/ + full/ + sheet-native.png + index.json (about 10 s)
node $S/sheet.cjs strays                      # every line must end "ok"
node $S/sheet.cjs one  $S/x.png ROOM-WH@wide-flash 2
node $S/sheet.cjs crop $S/c.png ROOM-WH@ots-nedib 330 30 150 120 4
```

Typecheck: a scratch tsconfig that extends `studio/tsconfig.json` with `"files": ["src/episodes/ep01/pixel/art-b/demos.ts"]` and `"types": []`. `npx tsc -p <it>` prints nothing.
