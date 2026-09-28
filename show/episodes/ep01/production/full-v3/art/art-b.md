# Ep1 full v3 · art-b: Acts Two, Three and the tag

| | |
|---|---|
| **What this is** | The record of the pixel assets built for Acts Two, Three and the tag (sc 13–23, 32–33) for the full-episode pixel preview. For each asset it gives the id, the module, the entry points a shot layout calls, the states, and what is still a stand-in. |
| **Who, when** | The `v3-art-b` pass (track P1b of [PLAN.md](../PLAN.md)), 2026-09-27; the v3.1 round (script draft 7) the same day, **§6**; the v3.2 round (script draft 8.1) on 2026-09-28, **§7**. Nothing was committed by this pass: the lead commits (commit 38c5d18 took in some of this pass's v3.1 files as they stood mid-round; the later edits are uncommitted). |
| **Built against** | [script.md](../../../script.md) (Acts Two, Three and the tag); the v2 stick timelines `show/reel/ep01-full/ep01-{act2,act3,tag}-v2.json`; the cuts C7–C12 in [stick/v3-plan.md §3](../../stick/v3-plan.md); the v3 beat plans `beat-plan/{act2,act3,tag}.json` (read about 11:40, after they landed); and the P1b list in [script-v3-notes.md §7](../script-v3-notes.md). |
| **Where it is** | **Code:** new additive modules in `studio/src/shared/pixel/{rooms,cast,kits}/` (the tables below; v3.1's in §6, v3.2's in §7). The stills registry is `studio/src/episodes/ep01/pixel/art-b/demos.ts`, with its sheet tool at `tools/sheet.ts`. **Stills:** `out/ep01/full-v3/assets/art-b/`, holding `sheet-native.png` (211 stills at 1x, 4 across: the 113 of v3, v3.1's 55, then v3.2's 43), `native/` (480×270), `full/` (1920×1080, 4× nearest) and `index.json`. |
| **Measured** | 211 stills render. `sheet.cjs strays` prints `ok` for all 211 (the master palette, plus the engine's LEDGER set for the flash-print and its ONEBIT ink and paper for v3.1's Remove dialog). `tsc` over the registry and every module it imports (98 shared files) prints nothing. v3.1 and v3.2 edited only this pass's own files, each change an opt-in state or a fix to its own drawing (§6.4); no other track's file was edited, Act Four's included. |
| **Needs a person** | I looked at every still at 1x and 2x, and cropped the doubtful ones at 3–6× (v3.1's too). I fixed what didn't read to me (§4, §6.4). That is one reader's judgment, not a blind read. Nothing has been seen in motion: every held-step timing is on paper. Each still shows its asset in a demo framing (the beat it serves is in its note); the shot passes own the shots. |

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
- **v3.1 (§6):** the draft 7 items for Acts Two and Three, the tag and Act Four, 55 stills: the match cut and the feed, the glass side-on, KRAM and the Atem lobby, the hands runner's two-shot with the monitor large, Neleh's paper, one deepfake, the hover names; the Remove dialog (the hard cut and S8.03's grey), Neleh's desk at 11:52 and the paper, Tuesday's invite, Sunday's phones and ticker, Alyi in the glass, the call out to Gerg, Terb's dry squeeze and his writing, the letter's header tile; and the face lights (one step, face only).
- **v3.2 (§7):** draft 8.1's items for Acts Two, Three and Four, 43 stills: his seat and glass at the White House, Radnus's face with the flame, the readable tag and his scrubbing thumb, the repost in the lit window, his hand and stamp and his phone on the poster, his face on the water's surface; the switch-off, DevDay full frame and its MCU, the sign-up page and the rack's LEDs, the thirteenth key large, the tally framed, the tabs, the hover avatars; the suite phone and the fall to night, the reception desk (the lanyard, the selfie, the corner camera), the lobby camera stepping into its grade, the badge under the door and on the desk, Alyi turning to the phones.

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

---

## 6. v3.1: script draft 7 ([script-v31-notes.md §4](../script-v31-notes.md))

The lead's brief for this round: Act Two's, Act Three's, the tag's and Act Four's new art as additive modules, the registry and the sheet, the face lights from [mood-analysis.md §4 #4](../mood-analysis.md). 55 new stills (`v31-*` states, and the new ids below).

### 6.1 The new and changed assets

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **PROP-CLASS-PHOTO** | `rooms/whitehouse.ts drawClassPhoto` | `{match}`, `CLASS_PHOTO_MATCH` | the print centred where the phone will be, his fingers round its left edge as they will be round the phone's (13.14 → 14.01) | — |
| **ROOM-BRIDGE** | `rooms/bay-bridge.ts drawBridgeOTS` | `{feed, hearts}`, `classPhotoPost(b, x, y, w, hearts, f)`, `holdFingers(b, ex, y0, n, pal)` | the feed lands on his own `CLASS PHOTO #1` post (the print drawn small at its own layout: the frames, the door with NEDIB, Sirrah, the four chairs), the hearts climbing, then the scroll to the clip (`feed` 0 → 1, whole px) (14.01) | — |
| **ROOM-WH**, **ROOM-SENATE** | `drawWHWide {mouths}`, `drawSenateWide {chair.mouth}` | existing options | Radnus's mouth moving silently in the wide (13.01); the chairman speaking his new line (15.02) | room-scale mouths: open / rest, 1–2 px |
| **PROP-GLASS-SIDE** | `rooms/rooftop.ts drawGlassSide` | `(b, f, {run})` | his glass side-on at table height, the sheet beyond, the sky and its crack stopped at x 250; through the water the crack runs on in jags and bends down across his small reflection (`run` 0..3) (17.12, replacing the view from above) | — |
| **PROP-SKY-CRACK** | `rooms/rooftop.ts drawCrack` | unchanged API | jagged and white now (runs of 3–9 px with 2–5 px jumps, a white core, a dark hairline, splinters) (17.11) | — |
| **KIT-NEWSCLIP** | `cast/civic-extras.ts drawAnchor` | unchanged | the anchor's hair dark brown and the blazer navy: plainly generic (the newcomer read "an orange-haired man"); RUMPT's window carries only his props (14.01, 14.03) | — |
| **CAST-KRAM** (new) | `cast/kram.ts` | `kramBust(state)`, `KRAM_BUST_DEFAULT` | the Atem founder, mute: the short curly crop, a grey hoodie with `OPEN` / `SOURCE` hand-painted across the chest, dry; light `slate` (the lobby) / `room`. **Never flipped** (the words would mirror) (18.00b) | guardrails §6: his family never |
| **UI-LOBBY-V31** | `kits/monitor-v31.ts lobbyPainter` | `({key, kram, caption, chip, f})` | the landlord's lobby in slate blue, `MACROSOFT WELCOMES ATEM`, `JUL 18`; TASYA's ring: 12 keys → the 13th going on, Atem blue → hung; KRAM stepping in (18.00, 18.00b); the plate's mini version for the home room's two-shot | Tasya's speaking portrait is drawn straight onto the lobby (its own tile background left out) with `drawTasyaKeyRing` |
| **UI-SIRRAH-V31** | `kits/monitor-v31.ts sirrahPainter` | `({typed, mouth})`, `SIRRAH_CHYRON` | SIRRAH at a lectern, the A and I blocks waist-high, the chyron typing on, `JUL 12` (v31-19.02); a short layout for screens under 150 px tall | never flipped (her sticky note is lettered) |
| **ROOM-DARK-2SSCR** (new) | `rooms/darkroom-v31.ts drawDark2SSCR` | `(b, f, {screen, mas, hand, orb, plate, toasts})`, `DARK_SCR` | the home room with the monitor **large** (216 × 120 at 1:1, standing on the desk) for the one held frame of the hands runner: Mas's hand `two` · `pinky` · `up` · `lower`; the Orb `whirr` · `rotate` · `rise` · `look` (v31-19.03); the paper with Gerg's tile (20.07); the EO with the Orb's toast over the real NEDIB (21.04) | legibility at 2S·SCR is the shot pass's call (the notes say so) |
| **UI-RUNNER** | `kits/monitor-v31.ts runnerPainter` | `({item, hands, unroll})` | `pinky`: NEDIB's hands at the scroll's rolled ends, `PINKY PROMISE`, `SIGNED: 7 AI COMPANIES`, seven pinky-prints (ink ridges on paper), NopeAI's in beige, `JUL 21`. `forum`: rows of one tiled figure, hands down → all up in one drawing, NOLE's the highest, filming on his phone (labelled at POV), `REMUHCS · ASKED THE ROOM: …`, `BILLS: 0`, `SEP 13` | NOLE at the forum is his own tile-size drawing (black tee, swept hair), not art-a's 96 px sprite |
| **UI-PAPER** | `kits/monitor-v31.ts paperPainter` | `({page, thumb})`, `PAPER_P30` | `title` (`DECODING INTENTIONS`, `NELEH`, the glowing page, its footnotes orbiting); `p29` (`research preview` in the paper's quotes, wrapping on the narrow page); `p30` (two small logos, the held sentence); the scrollbar's thumb shrinking (v31-20.07) | — |
| **UI-GERG-TILE** | `kits/monitor-v31.ts withGergTile` | `(painter, {mouth, typing})` | any painter with 2 AM's Gerg tile in the corner, ringed when he talks (20.04, 20.06) | — |
| **UI-EO** | `kits/eo-signing.ts eoPainter` | `{copies: 1, stat: 1}`, `EO_SHORT` | one copy, not two; `DEEPFAKES OF ME: SEEN 1` (21.02–21.03); a short layout for the two-shot's big monitor (the busts raised so the faces clear the desk) | the POV layout is unchanged |
| **UI-DEVDAY** | `kits/monitor-items.ts devdayPainter` | `{sydney}` | the Sydney bubble on its chain, tiny, behind Tasya on stage (22.01) | art-a owns Sydney's own drawing; this is the tiny echo |
| **UI-PHONE-HIGH** | `kits/phone-high.ts` | `{hover: 0..3}`, `ATTENDEE_NAMES` | the hover name under each circle as the Orb's iris steps along: `ALYI` `NELEH` `MADA` `THE QUIET VOTE` (23.02) | — |
| **PROP-COINWORLD** | `rooms/darkroom-act3.ts drawLabelECU` | unchanged | the sender's context: `PROOF YOU'RE HUMAN` under COINWORLD on the lid too (18.02) | — |
| **KIT-MONITOR-WAKE** | `kits/monitor-v31.ts screenWake` | `(k 0..3)` | the tag's monitor lighting on its own (32.01). The Runway insert's framing is `drawDarkA3` + `drawMonitorPOV`, unchanged | the insert is the `v31-runway` pass's |
| **UI-REMOVE** (new) | `kits/act4-v31.ts drawRemoveDialog` | `(b, f, {k, pointer, tag, click, grey, field, at, shake})`, `REMOVE_PATH`, `removeButton`, `cursorTag` | v31-S1.08d: the frame goes bright (the ONEBIT cream), the dialog opens in two held outline steps, `Remove MAS MANALT` / `from the meeting?`, ONE button `Remove` with the default ring; the noon arrow with its `ALYI` tag steps on (4 held positions), clicks. S8.03: `field: 'screen'` over the lobby, `grey` 1 → 3 a step a beat, the empty tag, the click that doesn't press, the shake | the S8.03 still shows it over a plain backdrop; the shot pass lays it over v5's lobby |
| **ROOM-NELEH-HIGH** (new) | `kits/act4-v31.ts drawNelehDeskHigh` | `(b, f, {clock, framing, pen})`, `planFirstFrame()` | `desk`: her desk from above at `11:52`, the call open (MADA's tile early, his spinner; three slots `waiting…`), THE PLAN's print unfolded, NELEH leaning over it from the frame's foot (her crown, the centre part, her footnote slips), her pen on the print. `paper`: the push's landing, S1.03's first sheet frame at 1:1 (nine chairs, `GERG / CHAIR`, no stamp yet) with her pen's tip by `NELEH` (v31-S3.00p) | the card (`NELEH / READ THE CHARTER. LITERALLY.`) is the card system's |
| **UI-TUESDAY-INVITE** (new) | `kits/act4-v31.ts drawTuesdayInvite` | `(b, f, {k, thumb, press, accepted})`, `TUESDAY`, `macrosoftInsert` | his end desk (S7.01's wood), the `GUEST` lanyard and the `MACROSOFT` badge at the same card size, the phone lighting, the invite sliding down in the cold open's calendar UI: `Board · Tue 10:00 PM`, Accept / Decline, a spinner, a fire helmet, a blank; his thumb straight down on Accept (no hover); accepted (v31-S7.03b) | — |
| **ROOM-BOARD-SCREEN-V31** (new) | `kits/act4-v31.ts drawSundayOTS` | `(b, f, {feed, alyi, neleh, ticker, buzz})`, `drawPhonesRow`, `drawTicker`, `PHONES_ROW`, `TICKER_SUNDAY` | v5's wall-screen OTS with the phones set in a row on the table's edge, face up, `STAFF · STAFF · INVESTORS · INVESTORS`, buzzing in turn; the ticker across the screen under the CCTV tile, `INVESTORS PUSH TO BRING MANALT BACK`, crawling in at 2 px a frame (S4.09) | his post in the feed's corner is v5's (`drawPost 'notify'`) |
| **ROOM-ALYI-GLASS** (new) | `kits/act4-v31.ts drawAlyiGlass` | `(b, f, {mouth, eyes})` | the cutaway: ALYI's reflection in the boardroom's dark window, lip-synced, not turning, the Valley's lights below his chin, the phones' lit screens reflected beside him as glow slabs (S4.02 [MCU·glass]) | the reflected caller IDs carry no letters: they would read backwards |
| **UI-CALL-OUT** (new) | `kits/act4-v31.ts callOutPainter`, `drawCallOutTile` | `({phase: 'app' \| 'click' \| 'ring', k})`, `(b, x, y, k)` | he opens the call app (`GERG · mobile` on top, `board sync · ended · Fri 12:00` under him), clicks, it rings out (`Calling…`, the pulses on 6s); the same as v5's corner tile, outgoing (S5.09) | the answer is v5's tile opening |
| **CAST-TERB** (compositions) | `kits/act4-v31.ts drawDrySqueeze`, `drawTerbWriting` | `(b, x, y, {k, flip})`, `(b, x, y, k, {flip})` | the squeeze with the pin in, k 1 the dry click's 1 px kick (S7.06); writing Mas's term onto the sheet, not looking up, the line growing k 0..4 (S7.07-cont) | cast/terb.ts and cast/terb-sheet.ts drawn as they are |
| **KIT-LETTER-HEADER** (new) | `kits/act4-v31.ts letterHeaderStrip` | `(b, x, y, w)` | `STAFF LETTER · TO THE BOARD` on the avalanche's first tile (`STAFF LETTER` on a small tile) (S6.01) | the avalanche is the shot pass's |
| **KIT-FACE-LIGHT** (new) | `kits/face-light-img.ts` | `faceLightImg(img, k, {key, top})`, `lumaOf`, `FACE_LIGHTS` | one step up on a rendered figure's face only (S, K, X rungs in its head region; outlines, eyes, hair, clothes untouched), keyed to one side. Opt-in on my own compositions: `drawScanMCU({faceLight: 1})` (18.05), `drawDarkA3({faceLight: 1})` (22.03, via art-a's `faceKey`) | §6.2 |

### 6.2 The face lights

- **What:** every close-up the draft 7 notes mark (18.05, 22.03; Act Four's S5.07b, S5.05, S4.07, S5.09b, S4.15, S7.08, S3.04b, S3.07) asks for one step. `FACE_LIGHTS` lists each with its key side and the entry point that suits its drawing: `faceLightImg` on a portrait before it is placed, or art-a's `kits/face-light.ts faceKey` over a rect for a face drawn straight into the buffer (Gerg's tile).
- **Measured, on my stills (not on the film):** 18.05's MCU, frame mean 5.70% → 5.80%, the face's box 22.7% → 25.4%. 22.03's two-shot, frame 8.95% → 9.02%, the face's box 18.4% → 22.4%. The frame barely moves, the face does: that's the brief ("the night palette and the room stay as they are"). The mood analysis's 4–5% figures are the edited film's; re-measuring them is the conform's job.
- **The collision:** art-a created `kits/face-light.ts` at the same time as I did, and theirs is the file on disk (committed in 38c5d18). I moved mine to `kits/face-light-img.ts` (the figure-level pass, the table, the measure) and use their `faceKey` for rects. Nothing of theirs was changed.

### 6.3 Not mine, or not built

- **Rezeile's op-ed (v31-12.03)** is Act One: art-a's.
- **S1.01b's window two-shot over the circuit** is the Act Four shot pass's (`episodes/ep01/pixel/act4/art/race.ts` exists).
- **The Act Four shot pass's, as states of v5's modules:** S1.03 `GERG / CHAIR` and her figure stepping out of her chair outline (the PLAN GFX); S1.05's pull-back out of the linework (a transition: its landing is `drawNelehDeskHigh` framing `paper`, its origin the desk); S1.07's name labels, the Wi-Fi icon's drop and the frozen tiles; S3.01's reflected hand and notice; S3.05's `…i quit.` (already in v5's `POST_FACTS5`); S4.10's 2-TONE card; S5.06's "judgement". The cuts to un-draw (S2.03, S7.07b, S8.09b) are theirs to drop.
- **The RADNUS bust:** the Act Two shot pass's `episodes/ep01/pixel/act2/art/radnus-bust.ts` supersedes my stand-in where it's used.

### 6.4 What the v3.1 review changed

- **Kram's words:** a 1 px drop per letter made the P and C read lowercase ("OREN"); the jacket's open-front lines crossed the words. Now one baseline, the letters spaced by hand, the lines left out.
- **Lettered busts are never flipped:** Kram in the lobby and Sirrah at the lectern now face their scene in the busts' own 3/4 view.
- **The lobby:** Tasya's portrait carried its own tile background into the lobby (a picture-in-picture box). Now drawn straight onto the slate; the 13th key moved off his face and made pale Atem blue with a paper glint.
- **The two-shot's monitor** hung below the desk's back edge (the desk covered its foot and the chyron's second line). It now stands on the desk and is drawn after it. Mas's raised hand was a tiny hand on a stick; now a 10 × 12 hand with 2 px fingers on a forearm from the elbow on the desk.
- **Short screens (under 150 px tall):** Sirrah's face sat behind the lectern and the EO's NEDIBs showed only their scalps; both painters now raise their busts there.
- **The runner:** the pinky-prints were dots (then black beans); now ink ridges on paper. The forum's raised hands were 2 px specks; now a sleeve and a hand per figure, and NOLE's phone labelled.
- **The feed's thumbnail** was a wall with four squares; now the photo's own layout drawn small. The fingers round the phone and the print were stacked squares; now rounded pads (`holdFingers`, shared, so the match cut matches).
- **The glass side-on:** his reflection was a user-icon silhouette; now his face (hair, cowlick, two dots, the smile) on a half-there hoodie. The crack now bends down across it, still in jags.
- **The Remove arrow** stopped under the button; its path now ends on the word. **The Tuesday thumb** was the desk hand at ECU size (a spread hand slapping the phone); now a thumb from above at the ECU's scale, its nail on Accept. **The call app's buttons** were dashes in circles (they read "remove"); now handsets. **The phones in a row** read as four UI buttons; now phones (body, bezel, slot, the answer and decline dots). **The ticker** was cut at the tile's edge; it now runs across the screen under the tile. **The hover tooltip** covered the date; it now sits under the circle. **The paper close's hand** was drawn at desk scale; at the paper's scale only the pen's tip and a fingertip fit.

**Still weakest, to my eye:** Terb's dry squeeze (the spray arm is the rig's own, small at room scale; the click lives in the sound); the forum's tiled rows (the joke is the tiling, but it reads as wallpaper at 1x); the 22.03 face light (one rung on a 20 px face is subtle); Neleh from above (a head's crown and a long reach).

---

## 7. v3.2: script draft 8.1 ([script-v32-notes.md §4, §10.7](../script-v32-notes.md))

The lead's brief (the showrunner's notes 00 and 0: agency, the rise-to-power spine, calibration): the Act Two, Act Three and Act Four new art and 8.1's picture notes, additive and opt-in. 43 new stills (`v32-*` states and the new ids below).

### 7.1 The new and changed assets

| Id | Module | Entry points | States (beat) | Stand-in / open |
|---|---|---|---|---|
| **ROOM-WH** | `rooms/whitehouse.ts drawWHWide` | `{settle, masGlass}` | Mas already seated nearest Sirrah, his own glass set down square in front of him; Radnus and Mario still settling (`settle` 1 half-risen, 2 just arriving) (13.01); Mario's finger on "trained" is the existing `finger` (13.02) | — |
| **ROOM-WH** (new entry) | `rooms/whitehouse.ts drawRadnusFlameMCU` | `(b, f, {size, pat, mouth, bust, collar})` | [MCU] Radnus's face and the flame together, one size up on `size` 2 (13.10, replacing the ECU). Takes any bust: the demos pass the Act Two shot pass's `radnusBust2` with `RADNUS2_COLLAR` | defaults to my stand-in bust |
| **ROOM-BRIDGE** | `rooms/bay-bridge.ts drawBridgeOTS`, `alteredTagBig` | `{scrub, tagBig}` | `⚠ ALTERED AUDIO` in the display face on two lines, readable; his thumb on the scrub bar, two drawings as two `progress` values (14.01) | — |
| **ROOM-BRIDGE** | `drawLitWindow` | `{repost: 1 \| 2}` | the silhouette's press (its phone's glow up a rung), then `✓ REPOSTED` in the same shot (14.03, 14.04 folded in) | — |
| **KIT-TOUR-POSTER** | `kits/tour-poster.ts` | `{hand, phone}` | his own hand with a rubber stamp on the last slot, one drawing each: `in` · `stamp` · `out`; his thumb on his phone in the frame's corner for "…no plans to leave" (16.01) | — |
| **PROP-GLASS-SIDE** | `rooms/rooftop.ts drawGlassSide` | `{surface: true}` | the camera a little above the rim: the rim and the water's surface thin ellipses, the sky's light on the surface and his face ON it (hair, eyes, smile; no body, no ripple ring); the reflected crack steps on across the surface and, on `run` 3, crosses his face under the eyes and breaks it (17.12, the audit's #8) | fallback per the notes: cut 17.12 |
| **ROOM-DARK-2SSCR** | `rooms/darkroom-v31.ts drawDark2SSCR` | `{hand: 'switch', off}` | he leans over (18 px) and reaches, elbow bent, to the switch on the bezel's near corner; the glass black in one step, its LED out (v32-21.06) | the switch is now drawn in every 2S·SCR frame (a small bezel detail) |
| **UI-DEVDAY** (new entries) | `kits/monitor-v32.ts drawDevDayFull`, `drawDevDayMCU` | `(b, f, DevDayState)`, `(b, f, {mas})` | the stage live, full frame, no bezel: the existing painter drawn at the frame's 480 × 203. **It holds:** the painter lays itself out by size, nothing crops, the odometer reads; it plays as a [W] with Mas at room scale. The push to [MCU]: his portrait (the near-front head) against the backdrop, a lavalier mic (22.01) | the 1 s home two-shot and the zAI egg are the shot pass's cuts (the painter has no zAI egg) |
| **UI-SIGNUP** (new) | `kits/monitor-v32.ts signupPainter`, `drawRackSlice` | `({spin, btn, typed, post})`, `(b, x0, step, f)`, `POST_PAUSE` | the sign-up page (`CHATGTP Plus`): the counter's drums a smear, never a figure; `SIGN UP` → greying → `NOTIFY ME`; his post typing in its box, then up as a card over the page's head; the rack's edge beside the monitor, its LEDs green → amber → red (v32-22.04) | — |
| **UI-LOBBY-V31** | `kits/monitor-v31.ts lobbyPainter` | `{keyLarge}` | the thirteenth key large (17 × 41, its own drawing), Atem blue, hung in front of the brass (v31-18.00b, 8.1) | — |
| **ROOM-DARK-A3** (tally) | `kits/monitor-v32.ts drawTallyECU` | `(b, f, {n})` | the desk top close in the monitor's light: the two faint old grooves (worn, broken), the third fresh on `n` 3 (v31-18.00, "framed legibly") | — |
| **UI-PAPER** (tabs) | `kits/monitor-v32.ts withTabs` | `(painter, {tabs, active, closing})` | a tab strip over any painter: the paper's tab `x` lit, then the order's tab open (v31-20.08) | — |
| **UI-PHONE-HIGH** | `kits/phone-high.ts` | `{hover, avatars}` | the hover card carries the member's small call tile over the name: ALYI, NELEH, MADA (his face under his spinner), the quiet vote's black tile (23.02) | the tiles are Act Four's `drawAlyiMini` / `drawNelehMini` / `drawMadaMini` |
| **UI-SUITE-PHONE** (new) | `kits/act4-v32.ts drawSuitePhone` | `(b, f, {typed, post, night, thumb})`, `POST_LOVED` | his phone in his hand in the suite's afternoon light, his thumb typing (no suggestion strip), the post up at `1:46 PM` with the salute drawn after it, the room falling to night in held steps (1 a rung down, 2 dusk navy, 3 night) while the screen stays lit (v32-S1.13) | the suite behind is a soft stand-in for `rooms/vegas-suite.ts` at this depth |
| **ROOM-RECEPTION** (new) | `kits/act4-v32.ts drawReceptionMCU`, `drawCornerCam` | `(b, f, {slide, lanyard, selfie, flash, look, post, mas})` | [MCU] full colour at his shoulder: the day lobby soft behind him, the stone counter and its brass nosing; a hand (no face) sliding the `GUEST` lanyard across (4 held positions); him putting it on (arms up, the strap over his head) and wearing it; the selfie at arm's length (the phone's back, its lens) and one white flash step; his look at the corner camera (the near-front head, the same face); his badge post (`POSTS.masBadge`, moved here from S4.09) (v32-S5.00) | — |
| **ROOM-LOBBY-CCTV** (new) | `kits/act4-v32.ts drawLobbyCCTVStep` | `(b, f, {step})` | the lobby camera's frame full frame (the day lobby, Mas at the desk in the lanyard), stepping into its grade one palette step a beat: each step the nearest palette colour at that share of the way, more grain; at 4 the grade and its chrome, `NOPEAI HQ · LOBBY · NOV 19`, REC (8.1: it ends by stepping out into the camera) | the cut onto the wall screen is v5's `drawBoardScreenOTS` |
| **ROOM-BOARD-SCREEN-V31** | `kits/act4-v31.ts drawSundayOTS` | unchanged | S4.09 without the post card: this composition never drew it (v5's S4.09 draws it into the feed; the Act Four shot pass drops that call) | — |
| **PROP-BADGE-DOOR** (new) | `kits/act4-v32.ts drawBadgeUnderDoor` | `(b, f, {slide, hand})` | [ECU] at floor level: the slate door's foot and its gap of light, the `MACROSOFT` badge sliding out across the floorboards (5 held positions) to tick against his chair leg; his hand coming down and picking it up (S5.11) | — |
| **ROOM-DARK-2S-BADGE** (new) | `kits/act4-v32.ts drawBadgeReach2S` | `(b, f, {reach, badges, plate, mas, orbLook})` | v5's dark two-shot: Mas leaning down out of his chair for it (the Orb looking down), then the two badges side by side on the desk, square (S5.11) | the slate door's states are v5's `drawSlateDoorOpen`, layered by the shot pass |
| **ROOM-ALYI-GLASS** | `kits/act4-v31.ts drawAlyiGlass` | `{look}` | "That is the company telling us.": his reflection turns to the phones (Act Four's `alyiReflectionLook`, and the head a step toward them) (S4.02) | the eyes' change is small in the glass's dark ramp |

### 7.2 Not mine, or not built

- **Act One's items** (v32-7.03, 6.06, 11.04, v32-9.10k, 9.09, v31-10.03, 12.01) are art-a's.
- **The first-appearance plates** (§10.3) are text the host draws; every plate here uses the existing plate style, so no art was needed.
- **The Act Four shot pass's, as states of v5's modules:** 15.15 (a reuse of 15.07 and 15.15); S3.03's self-typing post and Neleh's silent lips; S3.04's `INTERIM CEO` tile label; S5.03's heart count 406 → 407 → 406 (the post card kit's `hearts`); 8.04's cut-in. The un-draws (20.02's LEDs stopping, 22.01's home two-shot) are theirs to drop.

### 7.3 What the v3.2 review changed

- **The scrubbing thumb** first came in as a stylus-thin pole across the tag; it now lies along the bar with its pad just above it, so the tag stays whole, and the heel of the hand sits behind the phone's edge.
- **The stamp's hand** was an oval on a pole; now a fist (the back of the hand, four curled fingers, the thumb round the knob) on a wide sleeve at the poster's scale.
- **The corner phone** sat under the post card; it moved into the frame's corner.
- **The face on the water** was a dark speck, then a cyan face lost on the pale surface; now a darker, bigger face with the crack under its eyes.
- **The switch reach** was a straight 97 px pole; now two segments with an elbow, and he leans 18 px toward the monitor.
- **The post on the sign-up page** covered the button whose greying is the beat; it now goes up over the page's head.
- **The thirteenth key** was barely bigger than the brass; now 17 × 41, outlined, in front.
- **The tally ECU** had a hard lit/unlit edge down the middle and the marks went missing in an edit; now a smooth falloff and two grooves with lit walls.
- **The fall to night** stepped the warm room darker and redder; its steps now go to dusk navy, then night.
- **The receptionist's hand** was a speck and then covered the card's word; now a hand with fingertips at the card's edge. **Putting the lanyard on** had two floating balls for hands; now his forearms go up from his shoulders.
- **The badge pickup** had an oval hand; now fingers over the badge's edge and a thumb.
- **The DevDay MCU's** mic boom read as a scratch across him; now a lavalier.

**Still weakest, to my eye:** the reach in the two-shot (the desk hides what he does, so it reads as a lean); Alyi's turn (the glass's dark ramp swallows the eyes' change); the face on the water (small, as the script wants it: if it doesn't read in motion, the fallback is the cut); the day lobby behind the reception MCU (the wide's pixels stepped down, not redrawn at MCU depth).

## 8. Run (from `studio/`)

```bash
S=<scratch dir>        # your own subfolder of the session scratchpad
npx esbuild src/episodes/ep01/pixel/art-b/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
bash ../ops/heavy.sh node $S/sheet.cjs all ../out/ep01/full-v3/assets/art-b   # native/ + full/ + sheet-native.png + index.json (about 10 s)
node $S/sheet.cjs strays                      # every line must end "ok"
node $S/sheet.cjs one  $S/x.png ROOM-WH@wide-flash 2
node $S/sheet.cjs crop $S/c.png ROOM-WH@ots-nedib 330 30 150 120 4
```

Typecheck: a scratch tsconfig that extends `studio/tsconfig.json` with `"files": ["src/episodes/ep01/pixel/art-b/demos.ts"]` and `"types": []`. `npx tsc -p <it>` prints nothing.
