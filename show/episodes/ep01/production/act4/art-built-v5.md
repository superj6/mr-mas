# Ep1 · Act Four · Art built for the v5 pixel preview

| | |
|---|---|
| **What this is** | The record of the pixel assets built for the Act Four v5 animatic, against the asset list in [art-needs-v5.md](art-needs-v5.md) §2. For each asset: its id, the module it lives in, how a shot layout uses it, where to see it on the stills sheet, and what is still a stand-in. It also records the J1 `CANCELLED` port, the one change to an existing shared file, and what was not built. |
| **Why** | The showrunner, 2026-09-26: "i'll let you use your judgement to now refine back to the full rendering preview of act4". Also binding: a fully programmatic first pass (no external APIs), organized files, and enough detail for a successor. |
| **Who, when** | The `prep-artbuild` pass, 2026-09-26, in three rounds: rounds 1–2 (about 16:40–18:30) built most P1 and P2 modules; round 3 (about 22:00–23:30) built the missing P2 items, ported J1, checked every still, fixed what did not read, rendered the sheet and wrote this record. **Round 4, the `a4p5` art pass (2026-09-26 23:50 – 09-27 01:55, two sittings; the first ended when the session died):** fixed every "doesn't read" row of the prep check (PREP-2026-09-26 §3.1) and the judgment calls of §5 below, re-rendered the sheet (89 stills) and re-ran the v4 check with every touched shared file pinned. What it changed is **§5a**. Nothing was committed (the lead commits). |
| **Where it is** | Code: `studio/src/shared/pixel/{rooms,cast,kits}/` (the assets, additive modules) and `studio/src/episodes/ep01/act4/art-v5/` (the stills registry `demos.ts`, the sheet tool, the J1 port in `j1/`). Stills: `out/ep01/act4/assets/v5/` (`sheet-native.png`, `native/`, `full/`, `index.json`, `j1/`). |
| **Honesty** | I can't watch video or listen. I looked at every still on the sheet (at 1×, 2× and cropped at 4–6×) and fixed what did not read to me; that is one reader's judgment, not a blind read. Nothing here has been seen in motion: the held-step timing of each state is on paper. The v5 shot layouts (`shots5.ts`) don't exist yet, so no asset has been placed in a real v5 shot; each still shows the asset in a demo framing or over the v4 shot it re-dresses. |

---

## 0. The short version

- **Built:** every P1 asset (11), every P2 asset (18, with STATE-SMALL partly: the two items that needed art), both P3 1.G style passes (the neon on the guardrail clock, the soft far-end tiles), the J1 port as a drop-in component, and (round 4) FIX-FOOTNOTES as an opt-in style. **89 stills** on the sheet, all inside the master palette (and THE PLAN's own blueprint palette), checked by `sheet.cjs strays`.
- **Round 4 (a4p5) fixed the prep check's readability list** (§5a): Tasya's skin and fist warm, the MACROSOFT / GUEST badges, the pointer's callout, the HIGH hourglass redrawn from above with real shards, Gerg's and Alyi's faces framed, the boardroom window a real night view, Neleh's footnotes as numbered paper slips that never cross her face, her OTS turn and window rim, the soft tiles keeping eyes, the standing employee's ring, the bullpen opened round Mas, and the demo-layout faults. **Two things the v5 layouts must do to get them** are in §5a's "For the v5 host" list.
- **Not built:** the P0 pipeline (INF-LOCK5, INF-SHOTS5, INF-FRAME5, INF-LIPSYNC5, INF-RENDER5: plumbing, not art, and not this pass's brief), STYLE-1D (conditional, R25), and the P4 polish items other than FIX-FOOTNOTES. See §4.
- **v4 still renders, unchanged.** Five files that v4 shares were edited, each additively or behind an opt-in that defaults to v4's drawing: `kits/callgrid.ts` (round 3), `kits/props.ts`, `cast/tasya-speak.ts`, `cast/neleh.ts` and `cast/gerg-medium.ts` (round 4). 812 v4 frames rendered with all 16 touched shared files pinned to git HEAD and again as edited are byte-identical (round 4, 2026-09-27 01:41), and the v4 renderer's own `check` passes (77 shots, no missing layout, 6036 act frames). §3.
- **J1 is ported but stays off by default.** style-range §6.1a withdrew it and keeps the GLYPH dissolve at the Cancel click; the two must never both play. The component drops in at the click with its timing relative to the click. §2.
- **The stills sheet:** `out/ep01/act4/assets/v5/sheet-native.png` (all 89 at 480×270, 4 across), each still at 480×270 in `native/` and at 1920×1080 (4× nearest) in `full/`; J1's certificate frames (Remotion only) in `j1/` (not re-rendered in round 4: the certificate did not change). The sheet draws Neleh's footnotes in the v5 style (§5a).

---

## 1. The assets

**How to read the table.** *Module* paths are under `studio/src/`. *Use* names the entry points a v5 layout calls. *Sheet* keys are `ID@state` in `out/ep01/act4/assets/v5/index.json` (files `native/ID--state.png` and `full/ID--state.png`). Every module's header comment has the full interface; this table is the map.

### P1 · new art under the long conversations

| Id | Module | Use (entry points) | Sheet | Still a stand-in / open |
|---|---|---|---|---|
| **ROOM-NELEH-DESK** | `shared/pixel/rooms/neleh-desk.ts` | `drawNelehDeskOTS(b, f, {time, push, pen, neleh, screen})`: the [OTS] over her right shoulder, the laptop screen at 1:1 (`NDESK.screen`, 284×152: draw the call into a Buf that size and pass it); `push` 0..`NDESK.pushMax` is the whole-pixel push. `drawNelehBezel(b, screen456x177, {time: 'day' \| 'evening'})`: her laptop full frame ([SCR]), the v4 bezel geometry. `drawNelehDeskWall(b, {time, soft})`: the back wall for her MCU | 7 (`ots-day-waiting` … `mcu-wall`) | S3.04b's MCU uses v4's `nelehPortrait` bust over the new wall (her bust's lower edge reads a little boxy, as in v4) |
| **CAST-NELEH-OTS-R** | `shared/pixel/cast/neleh-ots.ts` | `drawNelehShoulderR(b, rightX, bottomY, {light: 'screen' \| 'lamp' \| 'window' \| 'sil', turn: 0 \| 1})`, anchored bottom-right. Replaces every mirrored frame (art-needs §1.8), S4.04 included | 4 | r4: `turn: 1` is 5 px and a lost profile (her cheek's rim past the hair); `'window'` has a clear cold rim (N8) and reads apart from `'sil'`; its demo sits on a night window |
| **UI-CALL-V5** | `shared/pixel/kits/call-boardside.ts` | `drawBoardCall(b, st)` into a Buf of any size (456×177 for [SCR], `NDESK.screen` for the OTS). `st.fifth`: `{kind: 'waiting'}` · `{kind: 'mas', k, frozen}` (3 held opening steps, then MAS small and still, one bar of Wi-Fi, the neon) · `{kind: 'rima', k, mouth, hand}` (join ring, spotlight search, spotlit tile) · `null`. `st.removed` (the four close ranks), `st.audio` (the `MAS MANALT · audio` chip, lit or `greyed`), `st.notice` (`BOARD_NOTICE.removed`), `st.clock` (`11:59` → `12:00`), `st.mouths`, `st.speaking`, `st.softMas` | 5 + the 6 desk stills | r3: Alyi's tile under 130 px wide now uses `drawAlyiTileFit` (his face framed in the glass; at the OTS size v4's tile showed only the top of his head, so no lip-sync could read). r4: also any tile under 80 px tall (the 2×2 [SCR] layout's 150×60 tiles cut him at the eyes) |
| **UI-POST** | `shared/pixel/kits/post-card.ts` | `drawPost(b, x, y, spec, {size: 'phone' \| 'notify' \| 'popup', w, k, hearts, hearted, glow})`; `postBox()` to lay out first; `POSTS.*` holds the act's posts in the lock's words | 3 | The post texts in `POSTS` are the lock's as of 16:40; re-check against `lines-v5.json` / the script when the stick pass lands. r4: the `notify` demo shows the entrance as labelled held steps (a lone k 1 read as an empty card) |
| **UI-BLOG-DRAFT** | `shared/pixel/kits/blog-draft.ts` | `drawBlogDraft(b456x177, {f, k, pointer: 'rest' \| 'post' \| null, click})`; `BLOG.lines`, `BLOG_POST_BTN` | 3 | The corner call window is a small grid (the cast's mini drawings) |
| **BP-NELEH-POINTER** | `shared/pixel/kits/bp-pointer.ts` | Draw into the sheet before `bpComposite`, or over a finished frame with `inkOver(fb, paint)`. `bpNeleh(b, x, y, pose, f, {glow, k, knock})`; `pointAt(k, keys)`, `sweep(...)` for held aims; `bpTipIn` (the 2× detail), `bpVoice` (Mada's spinner icon), `bpBracket` (the named plate lights) | 4 | r3: a target beyond the pointer's reach gets a dotted drafting leader to it. r4: **`callout: {box, rail}`** on the point pose routes the leader under every label (45° from the tip down to a rail row, along it, up into the named box's centre with a hot arrowhead); the straight leader still ended a pixel from ALYI's chair. The demos draw over v4's `plan4` sheet; v5's plan layout composes it for real |
| **UI-LETTER-V5** | `shared/pixel/kits/staff-letter.ts` | `drawStaffLetter(b, {k, f, quotes: [k1,k2,k3], count, clunk, scroll, alyi, gerg: {mouth}, window: 0..1})`; `LETTER_SCROLL_MAX`, `LETTER_STOPS` | 3 | r3: Alyi's thumbnail uses the fitted tile. r4: Gerg's thumbnail uses `drawGergMediumTile(..., {fit: true})` (his eyes 40% down; the bottom-anchored bust cut him at eye level). The window's one-step grey is subtle at 1× (by design; check it in motion) |
| **CAST-TTEMME-MEDIUM** | `shared/pixel/cast/ttemme-medium.ts` | `drawTtemmeMedium(b, x, y, state, {table, flip, hourglass, folder})`; state: 6 mouths, `lid`, `brow`, `nod` 0–2, `head: '34' \| 'down'`, `arm: 'rest' \| 'folder' \| 'hourglass'`, `light: 'room' \| 'spot'` | 1 (`sheet`, 12 drawings) | — |
| **PROP-FOLDER** | `shared/pixel/kits/folder.ts` | `drawFolder(b, cx, cy, {kind: 'table', slide} \| {kind: 'up', seal, open}, {hands, path})`. Unlabelled; no page ever shows (guardrails X9) | 1 | — |
| **PLATE-BOARD-HEAD** | `shared/pixel/rooms/boardroom-head.ts` | `drawBoardHead(b, f, opts)` (the plate), `drawBoardHead2S(b, f, st)` (S4.10b), `drawBoardHeadM(b, f, st)` (S4.13c, the slate door open with Tasya small in it) | 4 | r4: the window wall is a night view (sky, hills, the valley's light strings, a dark tower block behind the side seat, mullions, sill) instead of 140 random specks; Tasya in the door is lit `'room'` (warm skin; `tasya: {light: 'slate'}` gives the first build's look) |
| **CAST-TERB-SHEET** | `shared/pixel/cast/terb-sheet.ts` + `shared/pixel/rooms/calmoff-terms.ts` | `drawTerbSheetRoom(b, footX, footY, pose)` with arms `sheet` / `sheetSpray`, `read`; `drawCalmOffTerms2S(b, f, {terb: {pose, spray}, phone, mada, stopped})` composes S7.07 / S7.09 | 3 | `terb-sheet.ts` holds a verbatim copy of `terb.ts`'s room rig (not exported there); keep the two in step if Terb's room drawing changes. r4: `drawTablePhone(..., {caps})`: Gerg's keycaps are off by default (they flew on his own figure's paths and landed under the table as two stray pixels) |

### P2 · must-read carriers, smaller poses, props and angles

| Id | Module | Use (entry points) | Sheet | Still a stand-in / open |
|---|---|---|---|---|
| **STYLE-1G-NEON** | `kits/call-boardside.ts` (their side), `kits/callgrid.ts` (his side, opt-in) | Their side: `vegasNeon` inside `drawMasTileTheirs` steps every light on ONE 8-frame clock, no race car; `frozen` holds it. His side: `drawTile({... id: 'mas', neonGuard: true}, f)` (or `vegasBg(..., guard = true)`) | 2 | r3: the marquee column moved left of his head (at 150 px wide it rose out of his hair like a hat) |
| **ROOM-LOBBY-CCTV-DESK** | `shared/pixel/kits/lobby-feed.ts` | `drawLobbyFeed(b224x168, {f, phase: 'stand' \| 'turn' \| 'walk' \| 'gone', k, zoom, label})`; the feed's own ZOOM inset makes `GUEST` read | 2 | r3: the label and REC sit on a dark strip clear of the corner brackets (they broke up into "II@PEAI HQ" under the grade) |
| **PLATE-BOARD-SCREEN** | `shared/pixel/rooms/board-screen.ts` | `drawBoardScreenOTS(b, f, {feed, alyi: {mouth}})` (S4.09, Sunday by day), `drawBoardScreen2S(b, f, {alyi: {look}, neleh})` (S4.13d) | 2 | The window by day (ROOM-BOARDROOM-DAY) is not built; S4.09 as drawn doesn't frame the window |
| **ROOM-SLATE-DESKS** | `shared/pixel/rooms/slate-desks.ts` | Over a `drawDarkPlate` frame with `door: 4`: `drawSlateDoorOpen(b, f, {key: 0..2, gap})`, `slateDoorSign(b, dk)`, `drawSlateBeyond(b, x, y, w, h)`; `SLATE_GAP`, `keyTurnAt(k, t0)` | 5 | `mcu-soft` re-types v3 29.17's MCU recipe for the demo (the v5 layout owns the framing) |
| **PROP-SPEAKERPHONE-MCU** (r3) | `shared/pixel/kits/speakerphone.ts` | `drawSpeakerphoneMCU(b, {slide: 0..3, leds: 0..4, press, down, hand: 'none' \| 'pull' \| 'dial'})` over S4.07's MCU; `dialAt(k, k0, beat)` gives the held state of the four tones (one LED per seat) | 3 | Her hands are `inserts-hands.ts` capsule hands in the warm skin ramp; the pull is 3 held positions (no in-between drawing of the pod turning) |
| **ROOM-BULLPEN-UNPACK** | `shared/pixel/rooms/bullpen-unpack.ts` | `drawBullpenUnpack(b, f, {mas: {mouth}, drift})`; `openBox(kind)`, `shirtExtra(seed, o)`, `UNPACK_STAFF` | 3 | Mas's end desk is right of centre (the room's geometry, as v4's S7.02); the script's "his end desk, left" needs the room re-staged (flag from round 2). r4: the front row opened (nobody within ~75 px of him), so he is found first |
| **CAST-MAS-TURNAWAY** | `shared/pixel/cast/mas-turnaway.ts` | `masTurnedAway({light, step})` (drops into `drawBust` like his portrait), `drawVaultMid(b, x, y, {soft, noteSharp})`, `gergHandOnVault(b, x, y, rack)` | 3 | — |
| **PROP-HOURGLASS-INSERT** | `shared/pixel/kits/hourglass-insert.ts` | `drawHourglassXL(b, x, y, {moved, running, view: 'front' \| 'high', pose, hand, shatter, f})`; `hgxFlip(k)`; `HGX`, `HGX_GRAINS` | 5 | The two LOW·desk stills sit on a demo backing (marked on the sheet); r3 put Ttemme behind the table band instead of floating beside the prop. r4: **`view: 'high'` redrawn from above** (`HGX_HIGH`: both caps as ellipses, the far posts behind the glass, a contact shadow; shown on v4's own S7.13 plate, `drawTableInsert` 'prop'); the shatter is 16 fingernail shards that land and stay; the last grain is drawn after the neck's collar (it was covered) |
| **CAST-TASYA-PHONE** | `shared/pixel/cast/tasya-phone.ts` | `tasyaPhonePortrait({...tasya state, arms, read})` into `drawBust`; `TASYA_PHONE_AT` | 2 | r4: `skin: 'room'` (default) warm skin, the eye whites, teeth and beard highlights re-keyed off the slate rungs; `arms: 'ring'` draws the key ring IN his raised fist (warm), so the arm no longer reads as a floating blade; `read` adds the phone's glow along his lenses. `skin: 'slate'` is the first build |
| **CAST-OTHER-YRRAL** | `shared/pixel/rooms/calmoff-terms.ts` | `drawOtherYrralM(b, f, {nod: 0 \| 1})` | 2 | — |
| **PROP-MACROSOFT-BADGE** (r3) | `shared/pixel/kits/macrosoft-badge.ts` | `macrosoftBadge(b, x, y, 'p2' \| 'desk' \| 'room', {strap})`; `badgesOnDeskRoom(b, x, y)` for S7.02 | 3 | The parody name only, no logo. r4: the room-scale cards are 7×4 (flat colour, lit edge, band, shadow), placed with `BADGES_ROOM_AT` on his desk left of the laptop; at 480×270 the wide carries "two cards, red-white and slate", the words ride on the P2 insert (S7.01). `guestBadge('desk')` (kits/props.ts) is the word's width + 4, its clip on the strap: it read "UES" |
| **CAST-ALYI-PHONE** | `shared/pixel/cast/alyi-v5.ts` | `drawAlyiDoorPhone(b, f, {phone, alyi: {mouth, up}, hearts, ...})` (wraps `twoshots drawDoorwayP2`) | 2 | — |
| **CAST-ALYI-LOOK** | `shared/pixel/cast/alyi-v5.ts` | `alyiLook({mouth, eyes, t, dir: 'ahead' \| 'left' \| 'right' \| 'down'})`; `alyiReflectionLook(s, dir)` incl. `'door'` | 1 | The eye shift is 1–3 px inside deep sockets: it reads at 4×, subtly at 1× |
| **CAST-EMP-STAND** (r3) | `shared/pixel/cast/employee-stand.ts` | Over an all-hands room: `drawEmployeeStanding(b, EMP_STAND_WHO, {rise: 0..3, hand}, {dx})`; `standAt(k, k0)`. Draw it in room coordinates before any framing shift, or pass the shift as `dx` (v4's S3.06 shifts the room by 30 px) | 3 | "Standing" in the all-hands' tile language is her tile risen above its row with her torso under it. r4: from rise 2 an amber attention ring rounds her tile (`ring: false` turns it off); among ~60 tiles the rise alone did not pop |
| **PROP-PHONE-TABLE** | `shared/pixel/rooms/calmoff-terms.ts` | `drawTablePhone(...)`, or `drawCalmOffTerms2S(b, f, {phone: k})` | 1 | The post rides as its own `notify` card (too small to read on the phone) |
| **UI-CHAT-ROOM** | `shared/pixel/kits/chat-panel.ts` | `drawChatPanel(b, x, y, 'medium' \| 'room' \| 'corner', f)` | 1 | — |
| **UI-JOIN-CORNER** (r3) | `shared/pixel/kits/join-corner.ts` | `drawNudgeJoin(b, step, {pointer: 'beside' \| 'on' \| 'none', glow: 0..2, click})` = S1.02's nudge ECU with the laptop corner under his hand; `drawJoinCorner(b, o)` alone; `JOIN_CORNER` | 2 | — |
| **STATE-SMALL** (partly, r3) | `cast/rima-v5.ts` + `kits/call-boardside.ts` (item 8); `kits/callgrid.ts` (item 5) | Item 8, Rima smooths her jacket in her tile: `fifth: {kind: 'rima', ..., hand: 'smooth0' \| 'smooth1'}` (`drawRimaTileV5`). Item 5, Alyi's mouth in his tile on his side: `drawTile({... id: 'alyi', mouth: 'open', speaking: true}, f)` | 2 | Items 1–4, 6, 7, 9, 10 are layout work with options that already exist (§4) |

### P3 · the style passes

| Id | Module | Use | Sheet | Open |
|---|---|---|---|---|
| **STYLE-1G-SOFT** | `shared/pixel/kits/call-boardside.ts` | Their side: `drawBoardCall({softMas: true})`. His side (r3): `drawTileSoft(b, tileState, f)` in place of `drawTile` for the four board tiles: the video at half resolution doubled, the chips and THE QUIET VOTE's lettering sharp | 2 | style-range 1.G: if it reads as our own low quality, drop it and keep the neon. r4: `softTile` keeps an isolated dark pixel (an eye, a nostril) when it halves a 2×2 block, so Neleh's soft face keeps its eyes; lines (Mada's glasses) keep the top-left rule so they never become a black bar |
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

**Round 4 (a4p5) edited four more files that v4 shares**, each additively or behind an opt-in whose default is v4's drawing:
- `kits/props.ts`: `guestBadge(..., 'desk')` redrawn (the card is the word's width + 4). No v4 shot draws `'desk'` (only the kits demo sheet and this sheet do); `'insert'` is untouched.
- `cast/tasya-speak.ts`: three exports added at the end (`tasyaSpeakFig`, `TASYA_SPEAK_RIG`, `drawTasyaKeyRing`); nothing above them changed.
- `cast/neleh.ts`: `FootnoteStyle`, `withFootnoteStyle()`, `footnoteStyle()` and `drawFootnotes(..., {style})`. The module default is `'digits'` (v4's drawing); only a caller that asks gets `'slips'`, and `withFootnoteStyle` restores the previous style when its callback returns.
- `cast/gerg-medium.ts`: `GergTileOpts.fit` (default false).

The rest of round 4's edits are to v5's own new files (committed in 8c76d3f): `cast/{tasya-phone, neleh-ots, employee-stand}.ts`, `kits/{bp-pointer, call-boardside, hourglass-insert, macrosoft-badge, staff-letter}.ts`, `rooms/{boardroom-head, bullpen-unpack, calmoff-terms}.ts`, and `art-v5/demos.ts`.

**Measured (round 4, 2026-09-27 01:41):** `v4check.mjs` with all 16 touched shared files pinned to git HEAD (the command is in §6): **812 frames compared, IDENTICAL.** `anim4.cjs check`: 77 shots, 0 missing layouts, 6036 act frames. `tsc --noEmit`: only the pre-existing `src/dev/realism/bake/bake.ts` errors (two runs, 01:37 and 01:52; the first also showed two `BAND_FADE` errors in `src/dev/range/ep1-p1/pixel.ts`, another pass's file mid-edit, gone by the second).

**Measured (round 3):**
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
| ~~FIX-FOOTNOTES (P4)~~ | **Built in round 4 as an opt-in style** (§5a): numbered paper slips on a ring that never crosses her face. v4 keeps its digits | The v5 host switches it on (§5a) |
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

**Judgment calls a person should look at** (round 3's list; round 4 resolved the first and the third, §5a):
- ~~**Tasya's teal face.**~~ (Round 4: lit `'room'`.) In `PLATE-BOARD-HEAD@M-door-tasya` and `CAST-TASYA-PHONE`, Tasya is lit by v4's `slate` ramp, so the highlights on his skin are teal. That's consistent with v4, where he is always in slate light. Up close, though, it can read as sickly rather than lit. I left it; the fix would be `light: 'room'` in `boardroom-head.ts`, one line.
- **Alyi's mouth on his side.** In his side's tile (`STATE-SMALL@alyi-mouth-his-side`) the difference between rest and open is 1–2 pixels behind the glass. The speaking ring carries the read.
- ~~**Neleh's footnote digits**, §4.~~ (Round 4: the `'slips'` style, opt-in.)

---

## 5a. Round 4 (a4p5): the prep check's readability list, fixed

**The input.** Every "doesn't read" row of the prep check (PREP-2026-09-26 §3.1, rows 1–17) and the judgment calls in §5 above. **How I checked each fix:** the still before and after at 1× (480×270, the native frame, usually in a 2×2 montage), at 2× (960×540), and cropped at 3–6× for the detail; the re-rendered `full/` still at 1920×1080 for the footnotes. One reader's judgment, from stills; nothing seen in motion. The scratch files are in the session scratchpad under `a4p5-artfix/` (they may not last).

| # | What did not read | The fix | Where | Confirmed on |
|---|---|---|---|---|
| 1 | Tasya's skin green / teal ("alien") in the slate light | Lit `'room'`: a warm skin ramp, the slate door as his grey rim; the eye whites, teeth and beard highlights re-keyed off the slate rungs; the fist round the key ring warm too (it read as a pale teal gem) | `cast/tasya-phone.ts` (`skin`, default `'room'`), `rooms/boardroom-head.ts` (`drawBoardHeadM` passes `light: 'room'`) | `CAST-TASYA-PHONE@reading`, `@pleased-ring` (4× crops), `PLATE-BOARD-HEAD@M-door-tasya` |
| 2 | Neleh's footnote digits read as stray numbers; in a small tile the front "1" sat on her forehead | **The design call, made (reversible):** `'slips'`. Each footnote is a little slip of her glowing paper with its number printed on it (a cream card, a gold top edge, a dog-ear at portrait size, a 1 px shadow; the far ones a rung dimmer). The ring is seen from a little below, so its near half rides over her crown and its far half passes behind her head: a slip never crosses her brow or eyes. v4's digits stay the module default | `cast/neleh.ts` (`withFootnoteStyle`, `drawFootnotes {style}`) | `FIX-FOOTNOTES@digits-vs-slips` (new: v4 digits beside v5 slips at two orbit phases; at full size the v4 "1" is on her forehead, the slips are all above or beside her head), `UI-CALL-V5@connected`, `STYLE-J1@t46-snap-scar`, `PLATE-BOARD-HEAD@2S-offer` |
| 3 | The MACROSOFT badge invisible at room scale | 7×4 cards (was 3×2): flat colour, lit edge, header band, shadow; on the desk left of his laptop (`BADGES_ROOM_AT`). The wide carries "two cards, red-white and slate"; the words ride on S7.01's P2 insert, which reads | `kits/macrosoft-badge.ts` | `PROP-MACROSOFT-BADGE@room` (6× crop: two cards), `@scales` |
| 4 | GUEST read "UES" (the clasp over the G, the T off the card) | The card is the word's width + 4; the clip sits on the strap left of it | `kits/props.ts guestBadge 'desk'` | `PROP-MACROSOFT-BADGE@scales` (GUEST whole at 2×) |
| 5 | The pointer's leader ended a pixel from ALYI's chair: whom she points at stayed ambiguous | `callout: {box, rail}`: the leader drops 45° from the tip to a rail row under every label and the four's ring, runs along it and turns up into the named box's centre with a hot arrowhead; dots in the bright line ink, 1 on 1 off (the old mid ink, 1 on 2 off, was faint) | `kits/bp-pointer.ts` (`BpCallout`, `bpCallout`) | `BP-NELEH-POINTER@point-plates` (1× and 3× crop: the arrow sits under MAS / GERG's bracket; nothing else is crossed but the ring's lower arc) |
| 6 | The HIGH hourglass read as "against a wooden wall"; its shatter as sparkles round an intact frame | Redrawn from about 30° above (`HGX_HIGH`, 60×100): the lid's and the base's faces as ellipses with lathe rings and the pendant's catch, the side bands on their near arcs, the far posts behind the glass, the sand's mound, a two-rung contact shadow on the plate under it. The demo sits on v4's own S7.13 plate (`drawTableInsert` 'prop'). The shatter: 16 fingernail shards (4–7 px triangles, lit tip) that fly out and **stay lying** on the table from frame 9; the front view uses the same shards | `kits/hourglass-insert.ts` | `PROP-HOURGLASS-INSERT@high-last-grain`, `@high-shatter` (4× crops), `@states` |
| 7 | Tasya's raised arm read as a dark blade floating by his head; "reading" read as no change | The key ring drawn IN his raised fist (the host no longer has to draw it); for `read`, the phone's glow along the bottom of both lenses | `cast/tasya-phone.ts` (+ `cast/tasya-speak.ts` exports) | `CAST-TASYA-PHONE@pleased-ring`, `@reading` (4× crops) |
| 8 | Gerg's face cropped at eye level (the letter's thumbnail); Alyi's cropped at the eyes in the 2×2 [SCR] | Gerg: `fit` lowers his bust so his eyes sit 40% down the tile. Alyi: the fitted tile is used for any tile under 80 px tall, not only under 130 px wide | `cast/gerg-medium.ts` (`fit`), `kits/staff-letter.ts`; `kits/call-boardside.ts` | `UI-LETTER-V5@first-quote`, `ROOM-NELEH-DESK@scr-day-removed`, `@scr-day-removing` |
| 9 | The boardroom window a cloud of orange and teal specks, sparks round Mada's head | A night view: sky with the city's glow above the hills, strings of valley lights receding to the horizon, a freeway, a dark tower block behind the side seat (Mada's head sits on black), mullions, head rail and sill | `rooms/boardroom-head.ts windowView` | `PLATE-BOARD-HEAD@empty`, `@2S-offer`, `@2S-reading`, `@M-door-tasya` |
| 10 | Neleh's OTS `'window'` looked like `'sil'`; turn 0 and 1 looked the same | `'window'`: a clear cold rim (N8 on the hair, N6 on the blazer) and cooler hair rungs. `turn: 1`: 5 px (was 2) and a lost profile, her cheek's rim past the hair. The demo for `'window'` sits on a night window | `cast/neleh-ots.ts` | `CAST-NELEH-OTS-R@window` (2×), all four lights at 1× |
| 11 | `UI-POST@notify`: an empty card | It was the entrance's k 1 drawing, unlabelled. The demo shows k0–k2 and the whole card, labelled | `demos.ts` | `UI-POST@notify` |
| 12 | The standing employee didn't pop among ~60 tiles | An amber attention ring round her risen tile from rise 2 (`ring: false` turns it off) | `cast/employee-stand.ts` | `CAST-EMP-STAND@stand-hand-up` (found at 1× at a glance) |
| 13 | Mas found only on a second look in the bullpen | The front row opened: the two nearest front-row staff moved left (x 250 → 216, 176 → 150), so nobody in the front row stands within ~75 px of his desk and the others' looks lead to him | `rooms/bullpen-unpack.ts UNPACK_STAFF` | `ROOM-BULLPEN-UNPACK@reading`, `@drift-8` |
| 14 | STYLE-1G-SOFT: Neleh's soft face lost its eyes | `softTile` keeps an ISOLATED dark pixel of a 2×2 block (an eye, a nostril); lines keep the top-left rule (a first try that kept any dark pixel turned Mada's glasses into a black bar across his eyes) | `kits/call-boardside.ts softTile` | `STYLE-1G-SOFT@his-side` (5× crops of Neleh and Mada) |
| 15 | `scr-evening`: Gerg's post covered "camera" in "camera off" | The card 5 px lower | `demos.ts` | `ROOM-NELEH-DESK@scr-evening` (3× crop) |
| 16 | `PROP-PHONE-TABLE@lit`: two stray white pixels | Gerg's keycaps, flying on his own figure's paths from the phone's origin, landed under the table. Off by default (`drawTablePhone(..., {caps: true})` brings them back) | `rooms/calmoff-terms.ts` | `PROP-PHONE-TABLE@lit` |
| 17 | Sheet chrome: a stray "THE." and a cut-off figure (`BP-NELEH-POINTER@poses`); the lift+hand drawing over the slump (`PROP-HOURGLASS-INSERT@states`) | The poses on a blank drafting sheet; the states re-laid out in two rows plus a column (and the HIGH view added) | `demos.ts` | both stills |

**Still small at 480×270, as expected** (unchanged from the prep check §3.2; motion, insert scale or sound carries them): Alyi's look directions and his mouth in his side's tile, Yrral's nod, the key-turn drawings, the neon's steps, the speakerphone's LEDs, Ttemme's hourglass arm, Rima's smoothing hand, the bullpen's small props.

**For the v5 host (INF-SHOTS5 / INF-FRAME5): three things to do to get these fixes.** `shots5.ts` was being written while this round ran (its first lines appeared at about 01:38), and its S7.13 and S1.03 were drafted from the round-3 demos:
1. **Footnotes:** wrap the per-frame draw in `withFootnoteStyle('slips', () => …)` (from `cast/neleh.ts`), once, in `frame5.ts` / the native-frame function. That covers every Neleh drawing in the frame, reused v4 layouts included, and leaves v4's compositions untouched even in the same bundle. Without it v5 draws v4's digits. (The sheet does this in `demos.ts`: `V5_FOOTNOTES`.)
2. **S7.13:** draw the table with v4's `drawTableInsert(fb, {f, focus: 'prop'})` (rooms/boardroom.ts) and stand the hourglass on `TABLE_INSERT.prop`: `drawHourglassXL(fb, px - HGX_HIGH.foot[0], py + 3 - HGX_HIGH.foot[1], {view: 'high', …})` (see `highTable` in `demos.ts`). The draft's flat `woodGrain` field is the backing that read as a wall; the new drawing helps even on it, but the plate sells the angle.
3. **S1.03:** pass `callout: {box: [x, y, w, h], rail}` on the MAS / GERG point pose, with `box` the rect `bpBracket` lights and `rail` a row clear of every label (the demo: `box [176, FOOT + 3, 96, 24]`, `rail FOOT + 41`, the rail shifted by the tilt like the rest). Without it the straight leader is drawn.

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
# the v4 non-regression check (v4 must still render, unchanged): builds v4's renderer with the pinned files as committed
# and as edited, md5-compares 812 native frames, prints IDENTICAL (about 3 min, one core; writes only into the scratch
# dir). Round 4 pinned every shared file it or round 3 touched:
node src/episodes/ep01/act4/art-v5/tools/v4check.mjs $S/v4check $(git diff --name-only HEAD -- src/shared | sed 's#^studio/##')
#   (from studio/, git prints repo-relative paths; the sed makes them studio-relative. With no files it pins callgrid.ts)
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
5. ~~FIX-FOOTNOTES, Tasya's slate skin~~: done in round 4 (§5a). **The footnote slips are a design call** made by the art pass, not the showrunner: `FIX-FOOTNOTES@digits-vs-slips` shows both. If the room prefers the digits, drop the host's `withFootnoteStyle` wrapper; nothing else changes.
6. **Organization:** the J1 copies duplicate about 1.2 MB of generated SVG (`bustArt.ts`) from `src/dev/jumps/proto1/`. When ORGANIZATION-PLAN phase 5a runs, the prototype could re-export from here instead.
7. **The three host-side switches** in §5a (footnotes, S7.13's plate, S1.03's callout) are not in `shots5.ts` / `frame5.ts` yet (as of 01:50); the composer pass owns those files.
8. **The room-scale badges** read as two coloured cards, not as words (they can't at 7×4). If S7.02 must carry "MACROSOFT", push in or hold S7.01's P2 insert longer.
