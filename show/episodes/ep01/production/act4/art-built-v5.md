# Ep1 · Act Four · Art built for the v5 pixel preview

| | |
|---|---|
| **What this is** | The record of the pixel assets built for the Act Four v5 animatic, against the asset list in [art-needs-v5.md](art-needs-v5.md) §2. For each asset: its id, the module it lives in, how a shot layout uses it, where to see it on the stills sheet, and what is still a stand-in. It also records the J1 `CANCELLED` port, the one change to an existing shared file, and what was not built. |
| **Why** | The showrunner, 2026-09-26: "i'll let you use your judgement to now refine back to the full rendering preview of act4". Also binding: a fully programmatic first pass (no external APIs), organized files, and enough detail for a successor. |
| **Who, when** | The `prep-artbuild` pass, 2026-09-26, in three rounds: rounds 1–2 (about 16:40–18:30) built most P1 and P2 modules; round 3 (about 22:00–23:30, this write-up) built the missing P2 items, ported J1, checked every still, fixed what did not read, rendered the sheet and wrote this record. Nothing was committed (the lead commits). |
| **Where it is** | Code: `studio/src/shared/pixel/{rooms,cast,kits}/` (the assets, additive modules) and `studio/src/episodes/ep01/act4/art-v5/` (the stills registry `demos.ts`, the sheet tool, the J1 port in `j1/`). Stills: `out/ep01/act4/assets/v5/` (`sheet-native.png`, `native/`, `full/`, `index.json`, `j1/`). |
| **Honesty** | I can't watch video or listen. I looked at every still on the sheet (at 1×, 2× and cropped at 4–6×) and fixed what did not read to me; that is one reader's judgment, not a blind read. Nothing here has been seen in motion: the held-step timing of each state is on paper. The v5 shot layouts (`shots5.ts`) don't exist yet, so no asset has been placed in a real v5 shot; each still shows the asset in a demo framing or over the v4 shot it re-dresses. |

---

## 0. The short version

- **Built:** every P1 asset (11), every P2 asset (18, with STATE-SMALL partly: the two items that needed art), both P3 1.G style passes (the neon on the guardrail clock, the soft far-end tiles), and the J1 port as a drop-in component. **88 stills** on the sheet, all inside the master palette (and THE PLAN's own blueprint palette), checked by `sheet.cjs strays`.
- **Not built:** the P0 pipeline (INF-LOCK5, INF-SHOTS5, INF-FRAME5, INF-LIPSYNC5, INF-RENDER5: plumbing, not art, and not this pass's brief), STYLE-1D (conditional, R25), and the P4 polish items. See §4.
- **v4 still renders, unchanged.** Only one existing file was edited (`kits/callgrid.ts`, three opt-in options that default to v4's drawing). 812 v4 frames rendered with the old and the new `callgrid.ts` are byte-identical, and the v4 renderer's own `check` passes (77 shots, no missing layout, 6036 act frames). §3.
- **J1 is ported but stays off by default.** style-range §6.1a withdrew it and keeps the GLYPH dissolve at the Cancel click; the two must never both play. The component drops in at the click with its timing relative to the click. §2.
- **The stills sheet:** `out/ep01/act4/assets/v5/sheet-native.png` (all 88 at 480×270, 4 across), each still at 480×270 in `native/` and at 1920×1080 (4× nearest) in `full/`; J1's certificate frames (Remotion only) in `j1/`.

---

## 1. The assets

**How to read the table.** *Module* paths are under `studio/src/`. *Use* names the entry points a v5 layout calls. *Sheet* keys are `ID@state` in `out/ep01/act4/assets/v5/index.json` (files `native/ID--state.png` and `full/ID--state.png`). Every module's header comment has the full interface; this table is the map.

### P1 · new art under the long conversations

| Id | Module | Use (entry points) | Sheet | Still a stand-in / open |
|---|---|---|---|---|
| **ROOM-NELEH-DESK** | `shared/pixel/rooms/neleh-desk.ts` | `drawNelehDeskOTS(b, f, {time, push, pen, neleh, screen})`: the [OTS] over her right shoulder, the laptop screen at 1:1 (`NDESK.screen`, 284×152: draw the call into a Buf that size and pass it); `push` 0..`NDESK.pushMax` is the whole-pixel push. `drawNelehBezel(b, screen456x177, {time: 'day' \| 'evening'})`: her laptop full frame ([SCR]), the v4 bezel geometry. `drawNelehDeskWall(b, {time, soft})`: the back wall for her MCU | 7 (`ots-day-waiting` … `mcu-wall`) | S3.04b's MCU uses v4's `nelehPortrait` bust over the new wall (her bust's lower edge reads a little boxy, as in v4) |
| **CAST-NELEH-OTS-R** | `shared/pixel/cast/neleh-ots.ts` | `drawNelehShoulderR(b, rightX, bottomY, {light: 'screen' \| 'lamp' \| 'window' \| 'sil', turn: 0 \| 1})`, anchored bottom-right. Replaces every mirrored frame (art-needs §1.8), S4.04 included | 4 | — |
| **UI-CALL-V5** | `shared/pixel/kits/call-boardside.ts` | `drawBoardCall(b, st)` into a Buf of any size (456×177 for [SCR], `NDESK.screen` for the OTS). `st.fifth`: `{kind: 'waiting'}` · `{kind: 'mas', k, frozen}` (3 held opening steps, then MAS small and still, one bar of Wi-Fi, the neon) · `{kind: 'rima', k, mouth, hand}` (join ring, spotlight search, spotlit tile) · `null`. `st.removed` (the four close ranks), `st.audio` (the `MAS MANALT · audio` chip, lit or `greyed`), `st.notice` (`BOARD_NOTICE.removed`), `st.clock` (`11:59` → `12:00`), `st.mouths`, `st.speaking`, `st.softMas` | 5 + the 6 desk stills | r3: Alyi's tile under 130 px wide now uses `drawAlyiTileFit` (his face framed in the glass; at the OTS size v4's tile showed only the top of his head, so no lip-sync could read) |
| **UI-POST** | `shared/pixel/kits/post-card.ts` | `drawPost(b, x, y, spec, {size: 'phone' \| 'notify' \| 'popup', w, k, hearts, hearted, glow})`; `postBox()` to lay out first; `POSTS.*` holds the act's posts in the lock's words | 3 | The post texts in `POSTS` are the lock's as of 16:40; re-check against `lines-v5.json` / the script when the stick pass lands |
| **UI-BLOG-DRAFT** | `shared/pixel/kits/blog-draft.ts` | `drawBlogDraft(b456x177, {f, k, pointer: 'rest' \| 'post' \| null, click})`; `BLOG.lines`, `BLOG_POST_BTN` | 3 | The corner call window is a small grid (the cast's mini drawings) |
| **BP-NELEH-POINTER** | `shared/pixel/kits/bp-pointer.ts` | Draw into the sheet before `bpComposite`, or over a finished frame with `inkOver(fb, paint)`. `bpNeleh(b, x, y, pose, f, {glow, k, knock})`; `pointAt(k, keys)`, `sweep(...)` for held aims; `bpTipIn` (the 2× detail), `bpVoice` (Mada's spinner icon), `bpBracket` (the named plate lights) | 4 | r3: a target beyond the pointer's reach now gets a dotted drafting leader to it (the short pointer read as aimed at the nearest chair). The demos draw over v4's `plan4` sheet; v5's plan layout composes it for real |
| **UI-LETTER-V5** | `shared/pixel/kits/staff-letter.ts` | `drawStaffLetter(b, {k, f, quotes: [k1,k2,k3], count, clunk, scroll, alyi, gerg: {mouth}, window: 0..1})`; `LETTER_SCROLL_MAX`, `LETTER_STOPS` | 3 | r3: Alyi's thumbnail uses the fitted tile. The window's one-step grey is subtle at 1× (by design; check it in motion) |
| **CAST-TTEMME-MEDIUM** | `shared/pixel/cast/ttemme-medium.ts` | `drawTtemmeMedium(b, x, y, state, {table, flip, hourglass, folder})`; state: 6 mouths, `lid`, `brow`, `nod` 0–2, `head: '34' \| 'down'`, `arm: 'rest' \| 'folder' \| 'hourglass'`, `light: 'room' \| 'spot'` | 1 (`sheet`, 12 drawings) | — |
| **PROP-FOLDER** | `shared/pixel/kits/folder.ts` | `drawFolder(b, cx, cy, {kind: 'table', slide} \| {kind: 'up', seal, open}, {hands, path})`. Unlabelled; no page ever shows (guardrails X9) | 1 | — |
| **PLATE-BOARD-HEAD** | `shared/pixel/rooms/boardroom-head.ts` | `drawBoardHead(b, f, opts)` (the plate), `drawBoardHead2S(b, f, st)` (S4.10b), `drawBoardHeadM(b, f, st)` (S4.13c, the slate door open with Tasya small in it) | 4 | Tasya in the door is lit by the `slate` ramp (teal highlights on the skin), as v4 draws him in slate light; a judgment call worth a look (§5) |
| **CAST-TERB-SHEET** | `shared/pixel/cast/terb-sheet.ts` + `shared/pixel/rooms/calmoff-terms.ts` | `drawTerbSheetRoom(b, footX, footY, pose)` with arms `sheet` / `sheetSpray`, `read`; `drawCalmOffTerms2S(b, f, {terb: {pose, spray}, phone, mada, stopped})` composes S7.07 / S7.09 | 3 | `terb-sheet.ts` holds a verbatim copy of `terb.ts`'s room rig (not exported there); keep the two in step if Terb's room drawing changes |

### P2 · must-read carriers, smaller poses, props and angles

| Id | Module | Use (entry points) | Sheet | Still a stand-in / open |
|---|---|---|---|---|
| **STYLE-1G-NEON** | `kits/call-boardside.ts` (their side), `kits/callgrid.ts` (his side, opt-in) | Their side: `vegasNeon` inside `drawMasTileTheirs` steps every light on ONE 8-frame clock, no race car; `frozen` holds it. His side: `drawTile({... id: 'mas', neonGuard: true}, f)` (or `vegasBg(..., guard = true)`) | 2 | r3: the marquee column moved left of his head (at 150 px wide it rose out of his hair like a hat) |
| **ROOM-LOBBY-CCTV-DESK** | `shared/pixel/kits/lobby-feed.ts` | `drawLobbyFeed(b224x168, {f, phase: 'stand' \| 'turn' \| 'walk' \| 'gone', k, zoom, label})`; the feed's own ZOOM inset makes `GUEST` read | 2 | r3: the label and REC sit on a dark strip clear of the corner brackets (they broke up into "II@PEAI HQ" under the grade) |
| **PLATE-BOARD-SCREEN** | `shared/pixel/rooms/board-screen.ts` | `drawBoardScreenOTS(b, f, {feed, alyi: {mouth}})` (S4.09, Sunday by day), `drawBoardScreen2S(b, f, {alyi: {look}, neleh})` (S4.13d) | 2 | The window by day (ROOM-BOARDROOM-DAY) is not built; S4.09 as drawn doesn't frame the window |
| **ROOM-SLATE-DESKS** | `shared/pixel/rooms/slate-desks.ts` | Over a `drawDarkPlate` frame with `door: 4`: `drawSlateDoorOpen(b, f, {key: 0..2, gap})`, `slateDoorSign(b, dk)`, `drawSlateBeyond(b, x, y, w, h)`; `SLATE_GAP`, `keyTurnAt(k, t0)` | 5 | `mcu-soft` re-types v3 29.17's MCU recipe for the demo (the v5 layout owns the framing) |
| **PROP-SPEAKERPHONE-MCU** (r3) | `shared/pixel/kits/speakerphone.ts` | `drawSpeakerphoneMCU(b, {slide: 0..3, leds: 0..4, press, down, hand: 'none' \| 'pull' \| 'dial'})` over S4.07's MCU; `dialAt(k, k0, beat)` gives the held state of the four tones (one LED per seat) | 3 | Her hands are `inserts-hands.ts` capsule hands in the warm skin ramp; the pull is 3 held positions (no in-between drawing of the pod turning) |
| **ROOM-BULLPEN-UNPACK** | `shared/pixel/rooms/bullpen-unpack.ts` | `drawBullpenUnpack(b, f, {mas: {mouth}, drift})`; `openBox(kind)`, `shirtExtra(seed, o)`, `UNPACK_STAFF` | 3 | Mas's end desk is right of centre (the room's geometry, as v4's S7.02); the script's "his end desk, left" needs the room re-staged (flag from round 2) |
| **CAST-MAS-TURNAWAY** | `shared/pixel/cast/mas-turnaway.ts` | `masTurnedAway({light, step})` (drops into `drawBust` like his portrait), `drawVaultMid(b, x, y, {soft, noteSharp})`, `gergHandOnVault(b, x, y, rack)` | 3 | — |
| **PROP-HOURGLASS-INSERT** | `shared/pixel/kits/hourglass-insert.ts` | `drawHourglassXL(b, x, y, {moved, running, view: 'front' \| 'high', pose, hand, shatter, f})`; `hgxFlip(k)`; `HGX`, `HGX_GRAINS` | 5 | The two LOW·desk stills sit on a demo backing (marked on the sheet); r3 put Ttemme behind the table band instead of floating beside the prop |
| **CAST-TASYA-PHONE** | `shared/pixel/cast/tasya-phone.ts` | `tasyaPhonePortrait({...tasya state, arms, read})` into `drawBust`; `TASYA_PHONE_AT` | 2 | The key ring itself is the host's (as v4's `ring` arm) |
| **CAST-OTHER-YRRAL** | `shared/pixel/rooms/calmoff-terms.ts` | `drawOtherYrralM(b, f, {nod: 0 \| 1})` | 2 | — |
| **PROP-MACROSOFT-BADGE** (r3) | `shared/pixel/kits/macrosoft-badge.ts` | `macrosoftBadge(b, x, y, 'p2' \| 'desk' \| 'room', {strap})`; `badgesOnDeskRoom(b, x, y)` for S7.02 | 3 | The parody name only, no logo. In the demo the room-scale pair sits at `bullpenRoom`'s `masDesk` anchor + (0, 38) |
| **CAST-ALYI-PHONE** | `shared/pixel/cast/alyi-v5.ts` | `drawAlyiDoorPhone(b, f, {phone, alyi: {mouth, up}, hearts, ...})` (wraps `twoshots drawDoorwayP2`) | 2 | — |
| **CAST-ALYI-LOOK** | `shared/pixel/cast/alyi-v5.ts` | `alyiLook({mouth, eyes, t, dir: 'ahead' \| 'left' \| 'right' \| 'down'})`; `alyiReflectionLook(s, dir)` incl. `'door'` | 1 | The eye shift is 1–3 px inside deep sockets: it reads at 4×, subtly at 1× |
| **CAST-EMP-STAND** (r3) | `shared/pixel/cast/employee-stand.ts` | Over an all-hands room: `drawEmployeeStanding(b, EMP_STAND_WHO, {rise: 0..3, hand}, {dx})`; `standAt(k, k0)`. Draw it in room coordinates before any framing shift, or pass the shift as `dx` (v4's S3.06 shifts the room by 30 px) | 3 | "Standing" in the all-hands' tile language is her tile risen above its row with her torso under it |
| **PROP-PHONE-TABLE** | `shared/pixel/rooms/calmoff-terms.ts` | `drawTablePhone(...)`, or `drawCalmOffTerms2S(b, f, {phone: k})` | 1 | The post rides as its own `notify` card (too small to read on the phone) |
| **UI-CHAT-ROOM** | `shared/pixel/kits/chat-panel.ts` | `drawChatPanel(b, x, y, 'medium' \| 'room' \| 'corner', f)` | 1 | — |
| **UI-JOIN-CORNER** (r3) | `shared/pixel/kits/join-corner.ts` | `drawNudgeJoin(b, step, {pointer: 'beside' \| 'on' \| 'none', glow: 0..2, click})` = S1.02's nudge ECU with the laptop corner under his hand; `drawJoinCorner(b, o)` alone; `JOIN_CORNER` | 2 | — |
| **STATE-SMALL** (partly, r3) | `cast/rima-v5.ts` + `kits/call-boardside.ts` (item 8); `kits/callgrid.ts` (item 5) | Item 8, Rima smooths her jacket in her tile: `fifth: {kind: 'rima', ..., hand: 'smooth0' \| 'smooth1'}` (`drawRimaTileV5`). Item 5, Alyi's mouth in his tile on his side: `drawTile({... id: 'alyi', mouth: 'open', speaking: true}, f)` | 2 | Items 1–4, 6, 7, 9, 10 are layout work with options that already exist (§4) |

### P3 · the style passes

| Id | Module | Use | Sheet | Open |
|---|---|---|---|---|
| **STYLE-1G-SOFT** | `shared/pixel/kits/call-boardside.ts` | Their side: `drawBoardCall({softMas: true})`. His side (r3): `drawTileSoft(b, tileState, f)` in place of `drawTile` for the four board tiles: the video at half resolution doubled, the chips and THE QUIET VOTE's lettering sharp | 2 | style-range 1.G: if it reads as our own low quality, drop it and keep the neon |
| **STYLE-1D** | — | Not built (conditional, R25; the default is v4's palette steps) | — | — |

### P4 · conditional

| Id | Module | Use | Sheet | Open |
|---|---|---|---|---|
| **STYLE-J1** (ported, r3) | `episodes/ep01/act4/art-v5/j1/` | §2 | 4 (its pixel frames) + `j1/` (the certificate) | Off by default; never together with the GLYPH dissolve |

---

## 2. J1 `CANCELLED`, ported onto the click

**Status.** Conditional. style-range §6.1a (15:39) withdrew J1 at the Cancel click and keeps the masked GLYPH dissolve (use 2 of 2); style-jumps says "never both". The port exists so the room can cut the stick reel both ways and run a blind read (art-needs §1.1) without rebuilding anything. The v5 host should keep the dissolve by default.

**What moved where.**
- `j1/Certificate.tsx`, `j1/bust.ts`, `j1/bustArt.ts`, `j1/perforation.ts`: copies of `src/dev/jumps/proto1/` (only the import paths changed; `bustArt.ts` is byte-identical, md5 `d54fd8b5f4b1ee46a9cf65ddb730e067`). The prototype stays frozen as the record. Shipped Act Four code no longer needs to import `src/dev/` for J1 (ORGANIZATION-PLAN 5a). If `tools/engrave_bust.py` ever regenerates the bust, copy `bustArt.ts` here again.
- `j1/timing.ts`: the prototype's beats as **t = frames since the click** (its p minus 60), unchanged.
- `j1/pixel.ts`: the pixel side (the flash-print, the grey scar tile falling through its own slot, the four closing ranks), rebuilt to take the host's frames instead of the frozen lock-v2 composer.
- `j1/J1Cancelled.tsx`: the component. `j1/J1Preview.tsx` + `j1/entry.tsx`: a preview host.

**Timing, relative to the click** (`j1/timing.ts`):

| t (frames) | What shows |
|---|---|
| 0 | The host's own frame: Cancel's pressed drawing. D6 starts |
| 1–2 | The flash-print: the room area one flat paper tone; the rail band stays |
| 3–44 | The certificate (React/SVG, 1920×812 over the room area) with the host's rail band below it |
| 15 | `CANCELLED` punched through; the grid at the click shows, shaded, through every cut |
| 30 | His engraved pupils step one line toward the holes |
| 45–47 | The snap: the call again, his tile greyed with the one scar row |
| 48–55 | The tile falls through its own slot in four held drawings |
| 54–57 | The four close ranks in two held steps |
| 60 | J1 ends; the host's own S1.09 frames resume (the settled four, the notice) |

v5's D6 is about 3.7 s (~89 f) from the click to the buzz, so J1's 60 f fit with ~29 f of the host's own post-drop grid after. On lock v4 the click-to-cut is 59 f, so the preview's last J1 frame overlaps v4's S1.10 by one frame.

**How a v5 host drops it in** (for 0 ≤ t < 60, `j1Active(t)`):

```tsx
import {J1Cancelled, j1Active} from '../art-v5/j1/J1Cancelled';
// t = actFrame - clickFrame (the lock's S1.09 click mark)
if (j1Active(t)) return <J1Cancelled t={t} frame={native5(actFrame)} click={native5(clickFrame)} pixel={{fClick: clickFrame, neonGuard: true}} />;
```

- `frame`: the host's 480×270 frame at this act frame (J1 keeps its rail band; in the pop and the snap it edits a copy).
- `click`: the host's frame at t 0 (seen through the cuts).
- `pixel.g5 / g4`: pass them if the v5 S1.09 moves the grid (the default is sc 26's `G5` / `G4` from `animatic/shots.ts`, which v4's S1.09 uses).
- **The host must not also draw its tile drop / GLYPH dissolve for t 0–59.**
- A Node-only renderer (like `render4.ts`) can use `j1PixelFrame(t, host, o)` for every phase except the certificate. The certificate needs Remotion (SVG); it has only three distinct states (t 3–14, 15–29, 30–44), so a Node renderer could composite three pre-rendered 1920×812 stills. Not built.
- **Sound is not ported.** J1's temp sound pass is `src/dev/jumps/proto1/tools/sound.py` (built for lock v2); the v5 mix must re-spot it on the click.

**The preview** (`ep01-act4-j1-v5-preview`, 120 f): J1 dropped into THE EDITOR's v4 animatic at S1.09's click (act frame 735). S1.09 is an R (reused) layout in art-needs, so these are the v5 pictures; only the surrounding timing will move.
- `out/ep01/act4/assets/v5/j1/j1-v5-preview-silent.mp4` (silent, 5 s).
- Key stills at 1920×1080: `j1-t-01.png` (the arrow on Cancel), `j1-t+01.png` (the flash-print), `j1-t+20.jpg` (`CANCELLED`), `j1-t+35.jpg` (the pupil step), `j1-t+46.png` (the scar), `j1-t+52.png` (the fall), `j1-t+57.png` (the four closing). The two certificate stills are JPEG q92 (2.8 MB each as PNG).
- The same at 480×270 in `j1/native/`.
- The pixel-side frames are also on the main sheet (`STYLE-J1@t01…t57`, rendered in Node from `j1PixelFrame`).

---

## 3. Changes to existing files, and the v4 check

**One existing file changed:** `studio/src/shared/pixel/kits/callgrid.ts`. The changes are additive and opt-in, and each default is v4's drawing:
- `vegasBg(..., guard = false)`: with `guard`, every light steps on one 8-frame clock and the race car is gone (STYLE-1G-NEON on his side).
- `TileState.neonGuard` / `PaintOpts.neonGuard`: passes the guard to his tile's painter.
- `TileState.mouth` / `PaintOpts.mouth`: Alyi's reflection's mouth in his tile (STATE-SMALL 5).

Everything else is a new file. Rounds 1–2 kept to that rule too: `git status` shows no other modified file under `studio/src/shared` or `studio/src/episodes`.

**Measured:**
- 812 v4 native frames were rendered twice, once with `git show HEAD:studio/src/shared/pixel/kits/callgrid.ts` swapped in through an esbuild plugin and once with the edited file. All 812 are byte-identical (md5). They cover every shot's first, middle and last frames, plus every 3rd frame of S1, S6 and the call shots S3.01, S3.05, S4.01, S5.09, S5.09b and S8.03. The check is kept as `studio/src/episodes/ep01/act4/art-v5/tools/v4check.mjs` (run twice, both IDENTICAL).
- `node anim4.cjs check`: 77 shots, 0 missing layouts, 6036 act frames.
- `tsc --noEmit` shows only the pre-existing `src/dev/realism/bake/bake.ts` errors (`Buffer` types), the same list as before this round.

---

## 4. Not built, and why

| Id | Why not | Next step |
|---|---|---|
| INF-LOCK5, INF-SHOTS5, INF-FRAME5, INF-LIPSYNC5, INF-RENDER5 (P0) | Pipeline, not pixel assets; not in this pass's brief | The v5 composer pass. The modules here are ready to be called from `shots5.ts`; `demos.ts` shows each one's intended framing |
| STATE-SMALL 1, 2, 3, 4, 6, 7, 9, 10 | Layout work: the options already exist (the heart's target in `planPile` / `drawPile`, more phone steps in `boardRoom`, the spot's source and the plate text in `boardRoom`, the S4.13e split, `drawTile({open})` for the ring-and-open, `drawDark2S({mas: {head, mouth}})`, `drawGergTileWide({mouth})`, the texts) | `shots5.ts` |
| STYLE-1D (P3, conditional) | Ruling R25 is pending; the default is v4's palette steps | Only if E1-P3 passes its blind read |
| PROP-PODCAST-BOOM (P4, optional) | Optional; cut if 1.D is taken | — |
| ROOM-LOBBY-LOW (P4) | Polish; the interim is v4's crop plus the box merged in | — |
| POLISH-STANDINS (P4) | Polish of kept v4 shots | — |
| FIX-FOOTNOTES (P4) | Neleh's orbiting digits still read as stray numbers in her tiles (visible on this sheet too). Fixing them changes v4's `cast/neleh.ts` / `callgrid.ts` footnote drawing, and it needs a design call (numbers, † ‡ marks, or brackets) | THE EDITOR or the kit owner |
| ROOM-BOARDROOM-DAY (P4, conditional) | S4.09's OTS as drawn doesn't frame the window | Only if the v5 framing shows it |

---

## 5. What round 3 changed after looking at the stills

| Still | What did not read | Fix |
|---|---|---|
| Neleh's OTS laptop (S3.00a, S3.04), the letter's thumbnail | Alyi's tile at 88×49 showed only the top of his head: no eyes, no mouth | `cast/alyi-v5.ts drawAlyiTileFit`: the face centred in the glass, the glass wider on small tiles; used below 130 px |
| BP `point-plates` | The 44 px pointer, aimed at MAS / CEO from the sheet's edge, read as pointing at THE QUIET VOTE | A dotted drafting leader from the tip to any target out of reach; the demo figure moved inside the border |
| Lobby feed | "NOPEAI HQ · LOBBY" broke up into "II@PEAI HQ" under the scanlines, the bracket over its first letter | Label, REC and ZOOM on dark strips, clear of the brackets |
| `scr-evening` | Gerg's notification covered Mada's face | Moved to the bottom-left, over the camera-off tile |
| Their-side neon at 150 px | The marquee column rose out of his hair like a hat | Marquee left of his head, star and tower right |
| His-side soft tiles | Softening the whole rect blurred the name chips and THE QUIET VOTE into noise | `drawTileSoft`: video soft, chrome sharp |
| Standing employee | Drawn 30 px off her own tile (v4 shifts the room) | `{dx}` option, documented |
| LOW·desk hourglass backing | Ttemme floated beside the prop at its height | Behind the table band, soft 2 |
| Rima's smoothing hand | Hidden under her name chip | Moved onto the lapel |

**Judgment calls a person should look at:**
- **Tasya's teal face.** In `PLATE-BOARD-HEAD@M-door-tasya` and `CAST-TASYA-PHONE`, Tasya is lit by v4's `slate` ramp, so the highlights on his skin are teal. That's consistent with v4, where he is always in slate light. Up close, though, it can read as sickly rather than lit. I left it; the fix would be `light: 'room'` in `boardroom-head.ts`, one line.
- **Alyi's mouth on his side.** In his side's tile (`STATE-SMALL@alyi-mouth-his-side`) the difference between rest and open is 1–2 pixels behind the glass. The speaking ring carries the read.
- **Neleh's footnote digits**, §4.

---

## 6. How to re-run (from `studio/`)

```bash
S=<your scratch dir>
# the stills sheet: every demo in art-v5/demos.ts -> native/ (480x270), full/ (1920x1080), sheet-native.png, index.json
npx esbuild src/episodes/ep01/act4/art-v5/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
node $S/sheet.cjs all ../out/ep01/act4/assets/v5          # about 80 s
node $S/sheet.cjs strays                                 # palette check: every line must end in "ok"
node $S/sheet.cjs one $S/x.png UI-POST@phone 2           # one still at 2x
node $S/sheet.cjs crop $S/c.png UI-POST@phone 100 20 120 80 6   # a crop at 6x, for detail
# the J1 preview (Remotion; one bundle, then stills)
npx remotion render src/episodes/ep01/act4/art-v5/j1/entry.tsx ep01-act4-j1-v5-preview ../out/ep01/act4/assets/v5/j1/j1-v5-preview-silent.mp4 --concurrency=4 --crf=18 --log=error
npx remotion bundle src/episodes/ep01/act4/art-v5/j1/entry.tsx --out-dir=$S/j1b --log=error
npx remotion still $S/j1b ep01-act4-j1-v5-preview ../out/ep01/act4/assets/v5/j1/j1-t+46.png --frame=82 --log=error   # frame = t + 36
# the v4 non-regression check (v4 must still render, unchanged): builds v4's renderer with callgrid.ts as committed and as
# edited, md5-compares 812 native frames, prints IDENTICAL (about 3 min; writes only into the scratch dir)
node src/episodes/ep01/act4/art-v5/tools/v4check.mjs $S/v4check
npx esbuild src/episodes/ep01/act4/animatic/tools/render4.ts --bundle --platform=node --outfile=$S/anim4.cjs
node $S/anim4.cjs check                                  # 77 shots, 0 missing layouts, 6036 act frames
```

To add an asset to the sheet, register it in `art-v5/demos.ts` with `D({id, state, module, note, standin, draw})`. `draw` paints the 480×203 picture; the band below is sheet chrome.

---

## 7. Open issues for the lead

1. **J1 against GLYPH:** the port is ready and off by default (art-needs §1.1). Cut both ways only if the room wants it.
2. **Mas's end desk is right of centre in the bullpen** (S7.02, S8.08). The script says left; that needs the room re-staged, not new art.
3. **POSTS and BLOG texts** were typed from the lock as of 16:40. Re-check them against the final stick lines when the stick pass lands.
4. **Nothing is seen in motion.** The held-step clocks (the neon's 8 f, the stand's 3 f steps, the dial's beat, the key's 8 f) come from the script's notes, not from watching.
5. **FIX-FOOTNOTES** (§4), **Tasya's slate skin** (§5).
6. **Organization:** the J1 copies duplicate about 1.2 MB of generated SVG (`bustArt.ts`) from `src/dev/jumps/proto1/`. When ORGANIZATION-PLAN phase 5a runs, the prototype could re-export from here instead.
