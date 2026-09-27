# Ep1 · Act Four · Art needs for the v5 pixel preview

| | |
|---|---|
| **What this is** | A survey of the art the v5 pixel animatic needs, shot by shot, against what the v4 animatic already draws. For every v5 shot it says whether the v4 layout and art can be **reused as is** (re-clocked only), need a **change** (new pose, framing, prop, room angle or UI state), or are **new**. It ends in one asset list with a priority order and a size estimate per item. |
| **Why** | The showrunner, 2026-09-26: "the script dialogue and pacing is looking much better. i'll let you use your judgement to now refine back to the full rendering preview of act4". Also binding: a fully programmatic first pass (no external APIs, outside layers later), stick figures before final render, organized files, and enough detail for a successor. |
| **Who, when** | The `prep-artneeds` pass, 2026-09-26, about 16:00. A prep pass: it wrote only this file. No code was changed and nothing was rendered. |
| **Inputs read** | The live [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) and [ORGANIZATION-PLAN](../../../../../docs/ORGANIZATION-PLAN.md). The script's `## ACT FOUR` at draft 5.1 ([script.md](../../script.md), file time 15:48). [edit-plan-v5](edit-plan-v5.md) §0–§11. The stick timeline `show/reel/ep01-act4-v5.json` (file time 15:00; 84 beats; act 518.458 s = 8:38.5). The takes list `audio/ep01/act4/dialogue/lines-v5.json` (101 takes). The v4 sources: [shotlist-v4](shotlist-v4.md), [shots-locked-v4.json](shots-locked-v4.json), `studio/src/episodes/ep01/act4/animatic/{shots4,frame4,data-v4,frames,backs,framing,plan4}.ts`, the cast, rooms and kits under `studio/src/shared/pixel/`, and J1 in `studio/src/dev/jumps/proto1/`. The style guides: [style-range §6.1a](../../../../bible/style-range.md#61a-ep1-versatility-slate-2026-09-26) (file time 15:39) and [style-jumps §5.1](../../../../bible/style-jumps.md). `studio/PIXEL_GUIDE.md`, `studio/ART_GUIDE.md`. |
| **Honesty** | I can't watch video or listen. Everything here comes from reading code, data and docs, plus the timing sums noted below. I didn't render or view any image in this pass, so every "reuse as is" means the v4 layout exists and draws what v5 asks for on paper. Whether it still looks right at v5's longer holds needs a person to look. The size estimates are judgment, not measurements. |
| **Still moving** | The Act Four v5 stick pass is in its final fix loop, and the scene-craft pass may touch the script. Reel lengths below are as read at about 16:00. The asset list depends on what happens in each shot, not on exact lengths, so small re-timings don't change it. |

**Verdict key.** **R**: reuse the v4 layout and art as is, re-clocked on the v5 lock. **C**: the v4 layout with changed or added art. **N**: a shot with no v4 layout (it may still be built from existing modules). Sizes: **XS** under 1 h · **S** 1–3 h · **M** 3–6 h · **L** about a day (6–10 h) · **XL** 2 days or more. They're one builder's hours, including a still check.

---

## 0. The short version

- **Counted on the stick timeline** (82 setups: 84 beats less the two continuation beats `S7.06-cont` and `S7.07-cont`; the plan counts 81 shots):

  | Verdict | Shots | Reel seconds | Share of the act |
  |---|---|---|---|
  | **R**: reuse as is | 38 | 118.2 s | 23% |
  | **C**: change | 34 | 314.3 s | 61% |
  | **N**: new | 10 | 85.9 s | 17% |

  Nearly every C shot keeps its v4 drawing and adds something to it: lip-sync over a longer hold, a new state, pose or prop, or a text change. v5's held conversations mostly play in setups v4 already drew (two-shots, OTSs, the call grid, the split), and that's why the change time is high but the new art is modest.
- **What's truly new (P1):**
  - **Neleh's desk**, a room v4 never had. Four board's-side shots play over her shoulder or in front of her wall (S3.00a, S3.04, S3.04b, S3.05), about 52 s of the reel.
  - **A medium Ttemme** for the head-of-table two-shot and the welcome (S4.10b, S4.13c), about 21 s.
  - **An in-world post card** to replace v4's stand-in (seven shots).
  - **Terb reading the sheet** in depth through the 31 s calm-off.
  - **The draft-and-Post blog UI**, the **fuller letter page**, and **Neleh's blueprint figure with a pointer** in THE PLAN.
- **The pipeline comes first (P0).** A v5 lock built from the approved stick timeline, a `shots5` registry that re-clocks v4 layouts, and a 1080p picture host that draws true GLYPH tokens. With stick-figure placeholders for the 10 new shots, that gives a **full-act v5 preview on day one**. The art then replaces placeholders in priority order.
- **Style moments kept:** THE PLAN's blueprint, the call as a call told twice (1.G), the masked GLYPH dissolve at the Cancel click (use 2 of 2), F1.2's EARLY-WEB16 TPOOL door, the lobby CCTV on the wall screen (1.K), the vault's diegetic hum, and optionally the landlord's vector house style (1.D, ruling R25).
- **J1 is a conflict, flagged in §1.** This pass's brief says J1 must move onto the v5 timing. The newer style-range §6.1a (15:39) withdrew J1 at the click and keeps the GLYPH dissolve, and the 5.1 script keeps the dissolve too. The two must never both play. J1's retarget is costed below as a conditional P4 item, for a both-ways cut if the room still wants it.
- **Size:**

  | Band | Hours |
  |---|---|
  | P0 | ≈ 21–30 h |
  | P1 | ≈ 44–64 h |
  | P2 | ≈ 38–56 h |
  | P3 | ≈ 18–27 h (1.D is 16–24 h of it, conditional) |
  | P4 | ≈ 24–37 h (conditional or polish) |
  | **Unconditional P0–P2** | **≈ 103–150 builder-hours** |

  The rooms, cast and UI tracks are independent, so the work splits well across three or four builders once P0 is in.

---

## 1. Decisions and flags for the lead (read before building)

1. **J1 against the GLYPH dissolve (S1.09).**
   - This pass's brief: "J1 the CANCELLED certificate … must move onto the v5 timing".
   - [style-range §6.1a](../../../../bible/style-range.md#61a-ep1-versatility-slate-2026-09-26), "J1 · returned": the recommendation is withdrawn, and "the GLYPH dissolve stays at the Cancel click". Its reasons: GLYPH is the showrunner's foreshadowing device and this is its only readable use in the pilot; it would add a medium at the climax; it would tell the firing three times in 1.9 s.
   - The 5.1 script: `[GLYPH dissolve, 20 frames; use 2 of 2]`.
   - style-jumps: "Keep the dissolve and drop J1. Never both."
   - **Default here:** build the GLYPH dissolve (R, with true tokens via INF-FRAME5). J1 is costed as STYLE-J1 (P4, conditional) for a both-ways cut and a blind read, if the lead or the showrunner rules for it.
2. **Take flags that say lip-sync where the speaker is off picture.** In `lines-v5.json`, `lip_sync: true` is set on:
   - Neleh's post reading in S3.03, a full-frame screen
   - Mas in S5.06, the POV page
   - Mas in S5.09, over his own shoulder
   - the employee in S3.06, seen from the back of the crowd
   - Mas's "it's a preview." in S8.07, turned away

   The lock should decide on-camera mouths from the shot's framing, not from the take's flag (INF-LIPSYNC5).
3. **S3.07, the employee's hand.** The script has "Her hand comes down; she stays standing" landing inside Alyi's held door close-up, which doesn't show her. Either play it at the tail of S3.06's wide, or accept it off picture. Either way it costs no art beyond CAST-EMP-STAND.
4. **S4.09, `GUEST` must read.** v5 frames the lobby camera inside the wall screen, over Neleh's shoulder. At v4's full-frame CCTV size the lanyard is a few pixels. Inside a screen at 1:2 it can't read. So the camera needs a nearer angle (ROOM-LOBBY-CCTV-DESK), and the screen needs to sit at 1:1 native pixels in the OTS.
5. **S5.06, "the window greys by one palette step".** v4's letter is a full-frame page with no window. The v5 framing must keep a strip of the monitor's bezel and the dark room's window (UI-LETTER-V5).
6. **S7.02b–S7.03, 1.D against the palette steps.** R25 defaults to the script's pixel palette steps until E1-P3 passes its blind read after the stick approval. The v4 palette-step layout is the default here (C, small). STYLE-1D is conditional. If 1.D is taken, cut the optional podcast boom (style-range handoff to the Act Four pass).
7. **The 1.G chase-light guardrail.** The call tile's Vegas background in `kits/callgrid.ts` (`vegasBg`) steps its marquee every 3 frames, the pylon every 2 and the star every 4. 1.G allows "one step every 8 frames at most (3 in any 24 f)". This is a fix inside STYLE-1G-NEON, and it applies to his side's tile too.
8. **No mirrored frames with text in them.** v4's S4.04 builds its right-shoulder OTS by mirroring the whole v3 frame. v5's new OTS shots over Neleh (S3.00a, S3.04, S4.09) have screens with lettering in them, so they need her own right-side shoulder drawing (CAST-NELEH-OTS-R). S4.04 should switch to it as well.
9. **Shipped code importing `src/dev/`.** `animatic/backs.ts` imports `drawGlass` from `src/dev/pixeladv/art/room`. That's ORGANIZATION-PLAN phase 5a's concern, not this pass's. New v5 code shouldn't add more such imports. If J1 is ever retargeted into the animatic, promote its parts to `src/shared/` first.

---

## 2. The asset list, in priority order

**Priority logic:**
- **P0** lets the whole act render on v5 timing.
- **P1** is the new art under the longest new conversations, the ones a newcomer follows.
- **P2** is the must-read carriers and the smaller new poses, props and angles.
- **P3** is the style passes.
- **P4** is conditional or polish.

Inside a band, the order is by screen time served.

### P0 · the v5 pipeline (the full preview renders)

| # | Id | What | Used in | Reuse source | Size |
|---|---|---|---|---|---|
| 1 | **INF-LOCK5** | `tools/lock_v5.py` writes `shots-locked-v5.json` + `animatic/data-v5.ts` from the **approved** stick timeline. Shot starts and lengths come from each beat's `realStart`/`realDur`, lines from its `lines` (t, dur, words), mouths from `lines-v5.json`, and text items (rails, plates, cards, UI) from `onscreen`. It also resolves the story marks per shot: click, glance, stamp, flip, spot swing and so on. Kept shots keep their v4 ids. | all 82 | `animatic/tools/lock_v4.py` (458 lines), `audio/reel/ep01-act4-v5/build_timeline.py` | L (6–8 h) |
| 2 | **INF-SHOTS5** | `animatic/shots5.ts`, one layout per v5 shot. A `v4()` adapter re-clocks the 38 R layouts onto v5 marks, the way `shots4.ts`'s `v3()` did. Every shot without its pixel art yet falls back to a drawn stand-in or the stick figure, never a text label, so the act always renders end to end. | all | `animatic/shots4.ts` (1,105 lines) and its `v3()` / `v2()` adapters | M (4–6 h) |
| 3 | **INF-FRAME5** | `animatic/frame5.ts` + the host for `version: 5`. The picture only, 1920×1080 at 4× native, integer nearest. **True GLYPH tokens** via `glyphDraw` (`presentBuf` / `drawGlyphLayer`) in place of v4's 2-pixel marks (`frame4.ts putLayer`). The side badge, rails, plates and cards come from the lock. Register `ep01-act4-animatic-v5`, `-v5-picture` and `-v5-still` in `animatic/frames.ts`. | all | `frame4.ts` (181 lines), `Animatic.tsx`, `shared/pixel/glyphDraw.ts`, J1's `PixelLayer` (`dev/jumps/proto1/JumpProto1.tsx`) | M (4–6 h) |
| 4 | **INF-LIPSYNC5** | Mouth wiring for the on-camera talk: about 45 shots and 90 takes with mouth tracks. It covers tile busts (Alyi, Rima, Neleh, Gerg), the two-shot rigs (`drawBoard2S`, `drawCalmOff2S`, `drawDoorwayP2`, `drawDark2S`), room-scale rest/open mouths, and Alyi's reflections. The framing decides who shows a mouth (§1.2). | ≈ 45 shots | `cast/talk.ts` (visemes); every portrait, bust, medium and room pose already takes `mouth` | M (4–6 h) |
| 5 | **INF-RENDER5** | A Node renderer (`tools/render5.ts`), a mux onto the stick mix `audio/reel/ep01-act4-v5/mix.wav` as the temp track until a v5 mix exists, a contact sheet, and a `shotlist-v5.md` generator. Outputs go to `out/ep01/act4/animatic/act4-animatic-v5.mp4` and `-picture.mp4`, per ORGANIZATION-PLAN §2. | — | `tools/render4.ts`, `tools/shotlist_v4.py`, `tools/report_v4.py` | S–M (3–4 h) |

### P1 · new art under the long conversations

| # | Id | What | Used in (reel s) | Reuse source | Size |
|---|---|---|---|---|---|
| 6 | **ROOM-NELEH-DESK** | **Neleh's desk, a new set.** (a) The OTS plate: her desk surface, her laptop with its bezel filling the right two-thirds, THE PLAN's blueprint unfolded beside it with her pen on step 1, the charter, day light. (b) Its **evening** state: the desk lamp on, a warm pool reaching the bezel. (c) A soft back wall for her MCU (shelf, window), facing from the right. | S3.00a (19.0), S3.04 (19.2), S3.04b (3.6), S3.05 (10.6); the bezel surround of S3.01, S3.03 | `shots4.ts` S3.02's `laptopEdge` / `charter`; `rooms/boardroom.ts drawTableInsert` (the blueprint); `rooms/kit-b.ts`, `setkit.ts`; `rooms/darkroom-plate.ts` as the plate pattern | L (10–14 h) |
| 7 | **CAST-NELEH-OTS-R** | Neleh's right-side over-the-shoulder silhouette: her own drawing through `shoulder(…, flip)`, never a mirrored frame (§1.8). | S3.00a, S3.04, S4.04, S4.09 | `animatic/framing.ts shoulder()`, `cast/neleh.ts nelehPortrait` | S (1–2 h) |
| 8 | **UI-CALL-V5** | The call grid's board's-side states. (a) The empty fifth tile `Waiting for MAS MANALT to join…` with typing dots. (b) The call clock `11:59 → 12:00`. (c) His tile connecting small, with one bar of Wi-Fi. (d) His removal with no dialog: the tile goes and the four close ranks. (e) The notice `MAS MANALT was removed from the meeting.` (f) The `MAS MANALT · audio` chip, mic lit, then greyed. (g) Rima's join in the fifth slot: a join-chime ring and a hard circular spotlight. | S3.00a, S3.01, S3.04, S3.05, S4.01 | `kits/callgrid.ts` (`callChrome` clock, `slideTiles`, `micChip`, `typingDots`, `spotlight`, `callToast`); `shots4.ts callHers` / `sui` | M (3–5 h) |
| 9 | **UI-POST** | **The in-world post card**: avatar, name and handle, wrapped text, a heart count. Three sizes: a phone screen, a call notification or wall-screen corner, and the P2 box's pop-up. It replaces v4's `postCard4` / `postChip` stand-ins (shotlist-v4 marks them "post-ui stand-in"). | S3.05 (Gerg), S4.01 (eulogy), S4.09 (badge), S5.03 (Rima + flood), S7.01 (Alyi), S7.09 (Gerg), S7.13 (Ttemme) | `kits/callgrid.ts postChip`, `shots4.ts postCard4`, `kits/inserts-mas.ts feedStandIn` | M (4–6 h) |
| 10 | **UI-BLOG-DRAFT** | The NopeAI blog **as a draft in its editor**: `NOPEAI BLOG · DRAFT`, both sentences in the source's words, a `Post` button, her pointer clicking it on a tick, then the published state. The call grid sits small in the corner, with the spinner turning, the black tile, and Alyi at his doorway. | S3.03 (15.5) | `shots4.ts` S3.03 (the page, 20 lines), `callgrid drawPointer`, the grid | M (3–4 h) |
| 11 | **BP-NELEH-POINTER** | **Neleh's blueprint figure with a drafting pointer**, at the sheet's right edge from the stamp on. Poses in linework: stand, point at the nine, tap the `MAS / CEO` and `GERG / CO-FOUNDER` plates, sweep to the four, point at the key ring, point at the CEO box, set the pointer down, walk into the row of four. Her plate's page glows on "us". In the 2× zeros detail: the pointer's tip, and **Mada's spinner icon** turning while he speaks. | S1.03 (11.8), S1.04 (10.0), S1.05 (3.2) | `kits/blueprint.ts` (`bpWalker 'paper'`, `bpSpinner`, `inkPath`, `drawOn`), `animatic/plan4.ts` (the sheet, the chairs, the ring, the tilt, the 2× crop) | M (4–6 h) |
| 12 | **UI-LETTER-V5** | The staff-letter page for the 25 s read. It adds the third quoted line `"…positions for all NopeAI employees…"`, Gerg's small lip-synced tile in the monitor's corner, and a longer whole-pixel scroll (v4 capped it at 40 px). It keeps a strip of the monitor's bezel and the window, which greys one palette step while the counter rolls (§1.5). | S5.06 (22.8) | `shots4.ts` S5.06 (the page, `odometer` / `odoRoll`, `drawAlyiTile` thumbnail), `cast/gerg-medium.ts drawGergMediumTile`, `rooms/darkroom-plate.ts` window | M (3–4 h) |
| 13 | **CAST-TTEMME-MEDIUM** | **Ttemme at medium scale**, seated in the CEO chair: hoodie, headset mic, the hourglass in hand, mouths, blink, a nod (two held drawings). He reads behind a folder turned away and closes it. The `LIVE · CHAT` panel sits at his elbow. | S4.10b (15.2), S4.13c (6.0) | `cast/ttemme.ts` (portrait, bust, room pose, `drawChatOverlay`); `cast/mada-medium.ts` (319 lines) as the rig pattern; `cast/medium-kit.ts` | L (8–10 h) |
| 14 | **PROP-FOLDER** | The sealed, unlabelled folder. It slides across the table in held steps, and he breaks the seal with the folder turned away. The cover opens (we never see a page), then closes. | S4.10b | `kits/props.ts` patterns; `cast/terb.ts drawTermSheet` for paper | S (2–3 h) |
| 15 | **PLATE-BOARD-HEAD** | A boardroom plate looking down the table to its head: the CEO chair, Neleh standing at the table's side, Mada's spinner soft beyond. For S4.13c, the slate door is open at the back with Tasya small in it. | S4.10b, S4.13c | `rooms/boardroom-plate.ts` (slate, door 5), `rooms/boardroom.ts`, `cast/neleh-medium.ts`, `cast/tasya-speak.ts drawTasyaRoom` | M (4–6 h) |
| 16 | **CAST-TERB-SHEET** | Terb at room scale, in depth at the head of the table between Mas and Mada. He holds the single sheet, reads down to it, looks to Mada, sprays the chair fire between sentences, and talks with rest/open mouths. | S7.07 + cont (24.4), S7.09 (6.0) | `cast/terb.ts drawTerbRoom` (arms `carry`/`spray`/`stamp`/`hand`; a `sheet` arm is new); `rooms/twoshots.ts drawCalmOff2S` (its `terb.x`) | S–M (2–4 h) |

### P2 · must-read carriers, smaller new poses, props and angles

| # | Id | What | Used in (reel s) | Reuse source | Size |
|---|---|---|---|---|---|
| 17 | **STYLE-1G-NEON** | The Vegas neon's chase behind his still tile on **their** side, the visual proof for "No. That is just him." It's re-clocked to 1.G's guardrail of one step per 8 frames at most (§1.7). On his side the tile freezes on "super." with no macroblocks and no connection warning. | S3.00a, S3.01; S1.12 (frozen) | `kits/callgrid.ts vegasBg` (it already has a `frozen` flag) | S (1–2 h) |
| 18 | **ROOM-LOBBY-CCTV-DESK** | A CCTV angle **nearer the reception desk**, high in a corner and grainy, with the revolving door in frame. Mas stands at the desk as if there a while, his `GUEST` lettering readable. He turns and walks out through the revolving door, which keeps turning. The chrome reads `NOPEAI HQ · LOBBY · NOV 19`. It plays inside the wall screen over Neleh's shoulder (§1.4). | S4.09 (15.4) | `rooms/lobby.ts` (`drawLobbyCam`, `drawLobbyCamWide`, `cctvGrade`, `revolve`, `time: 'day'`); `cast/mas-stand.ts` (`masWalkAt`, `guest`); `kits/props.ts guestWorn` | M (4–6 h) |
| 19 | **PLATE-BOARD-SCREEN** | The boardroom wall screen at OTS and 2S scale, bezel in frame, with **Alyi's reflection in its glass**. The reflection is lip-synced, and in S4.13d it looks at the slate door. Variants: Sunday by day (S4.09); the slate door beyond with Neleh medium in front, pen stopping (S4.13d). | S4.09, S4.13d (7.4) | `boardroom-plate.ts` reflection, `cast/alyi-speak.ts alyiReflection`, `cast/neleh-medium.ts` | M (3–5 h) |
| 20 | **ROOM-SLATE-DESKS** | Through Tasya's door, ajar in the dark room: slate light, and labelled desks receding "as far as the light goes". Plus the key turning in the lock, in three held drawings. | S5.11 (11.4), S5.12 (2.9) | `rooms/darkroom-plate.ts` (`door` steps, `doorAjar`); `rooms/bullpen.ts` (`packedBox`, desks, `SLATE_RAMP` / `toSlate`) | S–M (3–4 h) |
| 21 | **PROP-SPEAKERPHONE-MCU** | The conference speakerphone at MCU scale. She pulls it across the table into her close-up, and her hand dials four tones, one LED per seat. | S4.07 (5.0) | `rooms/boardroom.ts` speaker LEDs; `kits/inserts-hands.ts` (`pinchHand` / `clickHand`, recoloured to her sleeve) | S (2–3 h) |
| 22 | **ROOM-BULLPEN-UNPACK** | A bullpen variant for Nov 29: coats off, boxes open and being unpacked, the staff turned toward Mas's end desk. Mas reads at room scale (mouths). | S8.08 (8.4) | `rooms/bullpen.ts` (`walkout` variant, `packedBox`, `WALKOUT_CROWD`); `cast/mas.ts drawMasDesk` | M (3–5 h) |
| 23 | **CAST-MAS-TURNAWAY** | S8.07 restaged. The 50/50: Mas **turned away** to camera-left, already past (a turned-away bust, no mouth), and Gerg's hand on the vault. The vault comes from `drawVaultP2` instead of v4's room-scale stand-in. | S8.07 (9.9) | `cast/mas.ts` portrait, `cast/gerg-speak.ts gergGlow`, `rooms/twoshots.ts drawVaultP2` | S–M (3–4 h) |
| 24 | **PROP-HOURGLASS-INSERT** | The 72-hour hourglass **drawn at insert scale**, retiring v4's MARKED 2× blow-up. States: full, the flip (three held drawings), running, the last grain, the shatter with the sand holding its shape. | S4.11 (3.4), S7.13 (8.1) | `kits/props.ts hourglass('L')`, `cast/ttemme.ts drawHourglass('lg')` and its shatter | M (3–4 h) |
| 25 | **CAST-TASYA-PHONE** | A `phone` arms state for `tasyaSpeakPortrait`: he reads his statement from his phone, pleased. | S4.13 (6.5) | `cast/tasya-speak.ts` (arms `ring`/`clasp`/`none`) | S (2 h) |
| 26 | **CAST-OTHER-YRRAL** | A seated silhouette with one two-drawing nod, behind a nameplate `YRRAL (NOT THAT YRRAL)`, at the table's far end among the fires. | S7.07b (1.6) | `rooms/boardroom.ts` tent cards (`THE OTHER YRRAL` already in `rooms-a/plates.ts`), `setkit.ts drawFire` | S (2–3 h) |
| 27 | **PROP-MACROSOFT-BADGE** | A slate-blue `MACROSOFT` badge beside the `GUEST` lanyard on his desk, at P2 and room scale. | S7.01, S7.02 | `kits/props.ts guestBadge('desk')` | XS–S (1 h) |
| 28 | **CAST-ALYI-PHONE** | Alyi in the P2 doorway holding his phone and reading, then looking up at the hearts. | S7.01 (18.3) | `rooms/twoshots.ts drawDoorwayP2` (`alyiUp`), `cast/alyi-speak.ts` | S (1–2 h) |
| 29 | **CAST-ALYI-LOOK** | Alyi's MCU in the doorway: an eye shift to the employee at the pause, then his step back out, in whole-pixel steps, to an empty doorway (the match cut's source). The same look-off is used for his reflection toward the door in S4.13d. | S3.07 (10.0), S4.13d | `cast/alyi-speak.ts` (eyes are only `open`/`closed`/`tokens` today); v4's unused S3.08 layout (the step back in the wide) | S (2 h) |
| 30 | **CAST-EMP-STAND** | One all-hands employee **standing** with her hand up, then down, still standing. | S3.06 (4.0) | `rooms/bullpen.ts` (`employeeTile`, `ALLHANDS_TILES`, `handsUp`) | S (1–2 h) |
| 31 | **PROP-PHONE-TABLE** | Mas's phone flat on the calm-off table, lighting green with Gerg's post and popping keycaps. It merges v4's S7.11 into the two-shot. | S7.09 (6.0) | `cast/gerg.ts gergKeycaps` / `drawKeycaps`, UI-POST | S (1–2 h) |
| 32 | **UI-CHAT-ROOM** | Ttemme's `LIVE · CHAT` panel at room and medium scale. v4's panel exists only at MCU and insert size. | S4.10, S4.10b, S4.13c, S7.13's corner | `cast/ttemme.ts drawChatOverlay`, `shots4.ts` S4.11's panel | S (1–2 h) |
| 33 | **UI-JOIN-CORNER** | The laptop's corner with `BOARD · VIDEO CALL · JOIN`, his pointer resting beside it, inside the nudge ECU before the glow turns to blueprint. | S1.02 (2.5) | `kits/inserts-mas.ts drawClickInsert` + `drawNudgeInsert` | XS–S (1 h) |
| 34 | **STATE-SMALL** | Small re-dresses of kept layouts: (1) the blue heart lands on **Rima's spotlit tile**, not Mada's spinner (S4.01); (2) more phone steps between Neleh's lines, one going over (S4.02); (3) the spot swings **off Rima's wall-screen tile** onto Ttemme, with the new plate `TTEMME · RAN A STREAMING SITE` (S4.10); (4) the sign beat split out as S4.13e; (5) Alyi's silent mouth and speaking ring in his tile (S1.07); (6) the tile's ring and open in three held steps (S5.09); (7) Mas's head turn and mouth in the Orb two-shot (S5.04); (8) Rima's jacket smooth inside her tile bust (S3.04); (9) Gerg's mouth on the look-up (S5.09b); (10) the plate and rail texts (§4). | as listed | the v4 layouts named | S–M (4–6 h total) |

### P3 · the style passes

| # | Id | What | Used in | Reuse source | Size |
|---|---|---|---|---|---|
| 35 | **STYLE-1G-SOFT** | 1.G's P2 CALL softness: the far end's tiles one grid-true step softer (half native resolution, doubled) on each side. On his side the four board tiles; on theirs his tile. No stutter, no wobble. If it reads as our own low quality, drop it and keep the neon (style-range 1.G). | S1.07, S1.09, S1.12; S3.00a, S3.01, S3.04 | a new passes-module function over `callgrid` tile rects | S (2–3 h) |
| 36 | **STYLE-1D** *(conditional: R25)* | THE LANDLORD BECOMES THE ROOM in flat vector house style (style-range E1-P3): vector floor, ceiling, walls, desks and boxes, and about six vector staff, silhouette-matched on "below / above / around". Mas, his desk and Tasya stay pixel. **Default until ruled:** v4's pixel palette steps (reused). | S7.02b, S7.03 | `rooms/bullpen.ts` walkout layout; **new** additive vector path module; `studio/src/dev/range/ep1-p3/` (not built yet) | XL (16–24 h incl. the blind read) |

### P4 · conditional, optional or polish

| # | Id | What | Used in | Reuse source | Size |
|---|---|---|---|---|---|
| 37 | **STYLE-J1** *(conditional; withdrawn by style-range §6.1a)* | J1 `CANCELLED` retargeted onto v5. Its pixel frames come from the v5 composer around S1.09's click instead of the frozen `lockv2.ts`. The 45 f jump sits inside v5's D6: about 3.7 s click to buzz, about 89 f, where v2's D6 was 150 f. Then the snap, and the tile falls through its own slot, with "You've been removed from the meeting." after. **It replaces the GLYPH dissolve; never both.** Cut the stick reel both ways and run a blind read (§1.1). | S1.09 | `studio/src/dev/jumps/proto1/` (`Certificate.tsx`, `pixel.ts`, `timeline.ts`, `bust.ts` / `bustArt.ts`); style-jumps §5.1's fixes (the grey tile behind the grid, the scar row) | L (8–12 h) |
| 38 | **PROP-PODCAST-BOOM** *(optional)* | A generic podcast boom mic dips into Tasya's MCU for the record and lifts after "around them". Cut it if 1.D is taken, or if the board artist finds it busy. | S7.02b | `cast/ttemme.ts` headset boom as a drawing reference | S (1–2 h) |
| 39 | **ROOM-LOBBY-LOW** *(polish)* | A true low angle of the lobby for the sign (v4 crops the wide as a stand-in), with the maintenance hand setting the box of zeros in the same shot. The interim is v4's crop plus the box merged in (1–2 h). | S8.01 (3.3) | `rooms/lobby.ts` (`sign`, `zeroBox`), `drawSignFloorInsert` | L (6–8 h) |
| 40 | **POLISH-STANDINS** | The drawn stand-ins still in kept shots: Neleh's marker hand (S3.02, S4.14), the chapter card (S5.01), the lobby desk-top recolour (S8.05), the screwdriver hand (S8.09), the folding chair (S8.10), the look-around (S7.06). | as listed | the v4 layouts; `kits/inserts-hands.ts` | S–M (6–10 h) |
| 41 | **FIX-FOOTNOTES** | Neleh's orbiting footnote digits read cold as "debug numbers or dizzy stars" (style-jumps §5.1's blind read, handed to the kit owner and THE EDITOR). Redraw them so they read as footnotes. | every Neleh tile: S1.07, S1.09, S1.12, S3.00a–S3.05, S4.01, S6.04 | `cast/neleh.ts drawFootnotes` | S (1–2 h) |
| 42 | **ROOM-BOARDROOM-DAY** *(conditional)* | The boardroom window by day and dusk, darkening between S4.09 and S4.10. Needed only if S4.09's OTS frames the window. `BoardroomState` has no time of day; the window is always night. | S4.09 | `rooms/boardroom.ts` (the window block) | S (2–3 h) |

**Totals:** P0 21–30 h · P1 44–64 h · P2 38–56 h · P3 18–27 h · P4 24–37 h. Without the conditional items (STYLE-1D, STYLE-J1, ROOM-BOARDROOM-DAY) and the optional boom, the whole list is about 118–173 h. Everything together is 145–214 h.

**Suggested tracks after P0.** The tracks are independent and can run at the same time:
- **Rooms:** 6, 18, 20, 22, 15, 19
- **Cast:** 13, 16, 25–30
- **UI and props:** 8–12, 14, 21, 24, 27, 31–33
- **Wiring:** 4 and 34

Style passes go last, on the locked timing.

---

## 3. Per sequence and shot

*Reel s* is the shot's length on the stick timeline as read; *v4* is the v4 lock length. Verdicts are R / C / N as in the key.

### S1 · Noon, Las Vegas: THE PLAN and the call (reel 49.1 s; v4 38.5 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S1.01 | 3.5 (3.00) | [W] suite, drift | `suiteRoom` (truck, shiver) + Orb | R | Rail text only |
| S1.02 | 2.5 (1.75) | [ECU] hand, glass, laptop | `drawNudgeInsert` → blueprint print | C | UI-JOIN-CORNER |
| S1.03 | 11.8 (9.00) | [GFX] THE SHEET, one tilt | `plan4.ts` sheet | C | BP-NELEH-POINTER; re-clocked to 3 lines (v4 had 2); "us" glow |
| S1.04 | 10.0 (4.00) | [GFX·detail 2×] THE ZEROS | `plan4.ts` 2× crop | C | Pointer tip + Mada's spinner icon (BP-NELEH-POINTER); 3 lines |
| S1.05 | 3.2 (3.50) | [GFX] path and break | `plan4.ts` path, curl, tear | C | Her figure sets the pointer down and joins the row (BP-NELEH-POINTER) |
| S1.06 | 1.5 (1.50) | [ECU] trackpad, JOIN | `drawClickInsert` | R | — |
| S1.07 | 5.5 (4.75) | [POV] the call grid | `call26` G5 + name card + dialog | C | Alyi's speaking ring and silent mouth (STATE-SMALL 5); STYLE-1G-SOFT; FIX-FOOTNOTES |
| S1.08 | 1.2 (1.25) | [ECU] eyes | `drawEyesStrip` | R | — |
| S1.09 | 4.8 (4.33) | [POV] arrow, Cancel, D6, drop | `drawPointer` + ALYI / CO-FOUNDER tag, `tileDrop` (GLYPH), notice | R | True GLYPH tokens (INF-FRAME5). J1 only if ruled (STYLE-J1) |
| S1.10 | 1.0 (1.25) | [CU] Mas, still | `drawMasCU` strip | R | — |
| S1.11 | 1.9 (1.92) | [ECU] phone, [super]×3 | `drawStripTapInsert` (mic chip lit) | R | — |
| S1.12 | 2.2 (2.25) | [OTS] super.; freeze; fall-away | v3 26.09 via `v3()` + `fallaway` | R | Plain freeze (1.G); lip-sync as v4 |

### S2 · That night: the third mark (reel 13.9 s; v4 13.75 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S2.01 | 4.1 (4.00) | [ECU] the carve, V.O. | `drawCarveInsert` → `drawBrushInsert` | R | — |
| S2.02 | 1.8 (1.75) | [ECU·top] three marks | `marksECU` | R | — |
| S2.03 | 4.0 (4.00) | **F1.2 TPOOL, EARLY-WEB16** | `renderFront` + `drawTpoolDoor` | R | The kept flashback, unchanged |
| S2.04 | 1.5 (1.50) | [ECU·top] marks | `marksECU` | R | — |
| S2.05 | 2.5 (2.50) | [ECU·Orb] rewinding…, whip | v3 26A.03 | R | Badge flip on the whip |

### S3 · Friday, the board's side: steps one to three (reel 88.2 s; v4 27.2 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S3.00a | 19.0 (—) | [OTS] over Neleh onto her laptop, slow push | none (v4 opened on S3.01) | **N** | ROOM-NELEH-DESK, CAST-NELEH-OTS-R, UI-CALL-V5 (waiting, clock, connect), STYLE-1G-NEON; Alyi lip-sync in tile |
| S3.01 | 3.7 (3.00) | [SCR] her laptop: his tile goes | `callHers` + live caption | C | UI-CALL-V5 (removal, notice, audio chip); v4's live caption goes; STYLE-1G-NEON |
| S3.02 | 2.6 (3.42) | [HIGH] her desk from above | `drawTableInsert` + `laptopEdge` + `charter` | R | Marker hand polish is P4 |
| S3.03 | 15.5 (3.25) | [SCR] the blog, drafted | the static blog page | C | UI-BLOG-DRAFT (both sentences, Post, grid corner) |
| S3.04 | 19.2 (4.50) | [OTS] over Neleh onto the grid, Rima spotlit | v4's S3.04 was Rima's MCU **in the boardroom chair**: not used | **N** | ROOM-NELEH-DESK, CAST-NELEH-OTS-R, UI-CALL-V5 (Rima's spotlit join), `drawRimaTile` lip-sync, the jacket smooth (STATE-SMALL 8); plate text |
| S3.04b | 3.6 (—) | [MCU] Neleh, one brow up | none | **N** | `nelehPortrait` (`brow: 'query'`) over ROOM-NELEH-DESK's back wall |
| S3.06 | 4.0 (2.62) | [W] the all-hands from the back | `allhands` (match cut, `handsUp`) | C | CAST-EMP-STAND |
| S3.07 | 10.0 (2.92) | [MCU·door] Alyi, held | v3 27.08 + v4.1 plate | C | CAST-ALYI-LOOK (look, step back, empty doorway); **drop** v4's `ALYI · HIS CO-FOUNDER` plate |
| S3.05 | 10.6 (3.00) | [SCR] her laptop, evening | `callHers` + `postCard4` + `keycapRain` | C | ROOM-NELEH-DESK evening lamp at the bezel; UI-POST; Alyi lip-sync in tile |

### S4 · The weekend, the boardroom: step four (reel 138.1 s; v4 49.7 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S4.01 | 4.8 (4.75) | [SCR] wall screen, hearts | `planPile` / `drawPile` on G5 | C | Blue heart onto Rima's spotlit tile (STATE-SMALL 1); UI-POST |
| S4.02 | 15.2 (3.00) | [W] boardroom at night, held | `boardRoom` (phones, blueprint, QV laptop, reflection, Rolodex) | C | Neleh's room-scale mouth; more phone steps (STATE-SMALL 2) |
| S4.04 | 6.9 (3.08) | [OTS] Neleh onto the window, Alyi's reflection | v3 27.14, **whole frame mirrored** | C | CAST-NELEH-OTS-R in place of the mirror; 3 lines on the reflection |
| S4.06 | 9.3 (4.96) | [2S] Neleh, Mada, reflection | `drawBoard2S` | R | Re-clock only; the clack is off picture |
| S4.07 | 5.0 (1.50) | [MCU·PF] Neleh, the decision, she dials | MCU·PF + fall-away | C | PROP-SPEAKERPHONE-MCU; her line |
| S4.08 | 28.0 (9.08) | [SPLIT] speakerphone / lighthouse, held | two panes: `boardRoom` + `lighthouseRoom` (Mario, Adelina, throne, phones, meters) | C | New plates `MARIO · RUNS THE RIVAL LAB · (REPORTED)` and `ADELINA · MARIO'S CO-FOUNDER`; Mario's finger rise (`MarioArm raise/raise2`); Adelina crossing in and handing over the second phone (`AdelinaArm reach/phone`); lip-sync for three |
| S4.09 | 15.4 (3.75) | [OTS] Neleh onto the lobby camera | full-frame `drawLobbyCam` + tracking box + post | C | ROOM-LOBBY-CCTV-DESK, PLATE-BOARD-SCREEN (Sunday day, reflection), CAST-NELEH-OTS-R, UI-POST; ROOM-BOARDROOM-DAY only if the window shows. **1.K** stays at bezel size |
| S4.10 | 4.0 (2.67) | [W] boardroom, now night | `boardRoom` spot swing, sticky note | C | Spot from Rima's wall-screen tile, the plate text (STATE-SMALL 3); UI-CHAT-ROOM |
| S4.10b | 15.2 (—) | [2S] Neleh and Ttemme across the table | none | **N** | CAST-TTEMME-MEDIUM, PROP-FOLDER, PLATE-BOARD-HEAD, `neleh-medium` standing, UI-CHAT-ROOM |
| S4.11 | 3.4 (2.50) | [LOW·desk] the hourglass | `ttemmePortrait` + chat + hourglass at 2× (MARKED stand-in) | C | PROP-HOURGLASS-INSERT |
| S4.12 | 2.9 (2.50) | [2S] Neleh, Mada; slate; the door | v3 27.28 | R | Rail `NOV 19 · ~11:53 PM PT` |
| S4.13 | 6.5 (5.50) | [MCU·door] Tasya, the statement | `tasyaSpeakPortrait` + doorway + plate + sign | C | CAST-TASYA-PHONE; the sign moves to S4.13e |
| S4.13c | 6.0 (—) | [M] Ttemme, Tasya soft in the door | none | **N** | CAST-TTEMME-MEDIUM (nod), PLATE-BOARD-HEAD (door open, Tasya at room scale) |
| S4.13d | 7.4 (—) | [2S] Neleh and Alyi's reflection | none | **N** | PLATE-BOARD-SCREEN (screen glass, slate door), `neleh-medium` (pen stops), CAST-ALYI-LOOK |
| S4.13e | 3.0 (in S4.13) | [MCU·door] the sign `MAS · GERG →` | v4 S4.13's sign beat | R | Split into its own shot (STATE-SMALL 4) |
| S4.14 | 2.5 (1.75) | [HIGH] blueprint, `?` | `drawTableInsert` + marker | R | Marker hand polish is P4 |
| S4.15 | 2.5 (2.00) | [MCU] Mada | v3 27.31 | R | — |

### Card · S5.01 (reel 1.8 s; v4 1.50 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S5.01 | 1.8 (1.50) | [GFX] `WHAT THEY DIDN'T KNOW` | `actCard` (marked stand-in) | R | Polish is P4 |

### S5 · His side, 2 AM: what they didn't know (reel 83.9 s without the card; v4 34.5 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S5.02 | 2.6 (2.50) | [ECU] glass and GUEST lanyard | v2 29.00 `drawDarkDesk` | R | — |
| S5.03 | 4.0 (4.00) | [ECU] phone, Rima's post, the flood | `drawPhoneInsert29` + `feedStandIn` | C | UI-POST (phone size) |
| S5.04 | 3.0 (2.96) | [2S] Mas and the Orb | `drawDark2S` + `orbToLanyard` | C | "the badge was a joke." now aloud: Mas's mouth and head turn (STATE-SMALL 7) |
| S5.05 | 2.3 (2.25) | [MCU] mostly., rack | v3 29.05 | R | — |
| S5.09 | 14.2 (5.21) | [OTS] onto the monitor, Gerg big | `drawGergMediumPOV` + `shoulder(masPortrait)` | C | The letter already open behind; the corner tile rings and opens in 3 held steps (STATE-SMALL 6); Gerg lip-sync |
| S5.06 | 22.8 (7.75) | [POV] the letter, slow scroll | the letter page (marked stand-in) | C | UI-LETTER-V5 |
| S5.07b | 3.5 (—) | [MCU] Mas, monitor light | v4's unused **S5.10** layout (MCU·PF, the monitor's green + cyan) | **N** | Reuse that layout with mouths; hold a beat after "He did both." |
| S5.08 | 5.8 (3.25) | [ECU·insert] the check | the check (slot, guilloche, stamp) | R | Re-clock the stamp after Gerg's line |
| S5.09 back | 5.0 (in S5.09) | [OTS] back onto the monitor | as S5.09 | R | Keys stop on the mark |
| S5.09b | 6.6 (1.75) | [POV] Gerg's look up, held | `drawGergTileWide` | C | Mouth on the look (STATE-SMALL 9); a longer hold; eyes drop, typing resumes |
| S5.11 | 11.4 (2.38) | [2S] the back wall; the slate door | `drawDark2S` door steps + sign | C | ROOM-SLATE-DESKS (key turn, crack, desks); Mas's "everyone." mouth; Gerg's small tile typing on the monitor |
| S5.12 | 2.9 (2.50) | [MCU] Mas, rack to the door | v3 29.17 + sign | C | The door ajar on the desks, matching S5.11 (ROOM-SLATE-DESKS) |

### S6 · The avalanche (reel 15.6 s; v4 15.58 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S6.01 | 4.5 (4.50) | [POV] the grid stacks | `planGridStack` / `drawGridStack`, 745 / 770 | R | — |
| S6.02 | 1.5 (1.50) | [MCU·PF] Mas watching | `avMas` | R | — |
| S6.03 | 1.9 (1.92) | [POV·half] Alyi's tile shoved | `drawAlyiTile` + `shove` | R | — |
| S6.04 | 2.0 (1.92) | [POV·half] Neleh's tile, "char—" | `drawNelehTile` (lip-sync) + `scatter` | R | FIX-FOOTNOTES (P4) |
| S6.06 | 5.8 (5.75) | [POV] the quiet vote out; Mada's label | the merged S6.05 + S6.06 | R | — |

### S7 · The return: Monday, and Tuesday in the boardroom (reel 86.5 s; v4 40.4 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S7.01 | 18.3 (6.00) | [P2] the two boxes, held | `drawDoorwayP2` (hearts, IOU) + the lanyard on the desk | C | PROP-MACROSOFT-BADGE, CAST-ALYI-PHONE, UI-POST (in his box); both men lip-synced |
| S7.02 | 5.0 (2.50) | [W] bullpen, packed boxes | `bullpenRoom` walkout + Tasya | C | The two badges at room scale; Mas's room-scale mouth for his question |
| S7.02b | 8.6 (3.50) | [MCU] Tasya: below / above / around | `tasyaSpeakPortrait` + slate steps | C | Lip-sync on the longer take. **1.D** is STYLE-1D (conditional); PROP-PODCAST-BOOM is optional |
| S7.03 | 2.6 (2.25) | [MCU·PF] Mas looking down | v3 30.06 `masLookDown` | R | "hi." is cut; "Hello." comes from the floor |
| S7.05 | 2.2 (2.00) | [M] Mada among the fires | `drawMadaM` | R | — |
| S7.06 (+cont) | 7.6 (7.33) | [W] Terb, freeze card, pin, "…Ah." | the v4 wide (bang, freeze, Mas through the freeze) | R | The look-around polish is P4 |
| S7.07 (+cont) | 24.4 (2.75) | [2S] the calm-off, Terb in depth | `drawCalmOff2S` (Terb spraying behind) | C | CAST-TERB-SHEET; Mas's and Terb's mouths; Mada's spinner (his take isn't lip-synced) |
| S7.07b | 1.6 (—) | [M] THE OTHER YRRAL | none (the tent card exists in `rooms-a/plates.ts`) | **N** | CAST-OTHER-YRRAL |
| S7.08 | 2.1 (1.75) | [MCU] Mas, "good question." | v3 30.14 | R | — |
| S7.09 | 6.0 (2.50) | [2S] the calm-off, long hold | `drawCalmOff2S` (spinner stops, nod, stamp, hand-over) | C | PROP-PHONE-TABLE + UI-POST (merges v4's S7.11) |
| S7.13 | 8.1 (4.58) | [HIGH] hourglass, chat corner | `drawTableInsert` + hourglass 2× + post stand-in | C | PROP-HOURGLASS-INSERT, UI-CHAT-ROOM (corner), UI-POST |

### S8 · The lobby, and after (reel 41.2 s; v4 30.3 s)

| Shot | Reel s (v4) | Setup | v4 source | Verdict | What's needed |
|---|---|---|---|---|---|
| S8.01 | 3.3 (2.75) | [LOW] the sign lights | v3 30.19 lobby crop (stand-in low angle) | C | Merge v4's S8.02 (the hand and the box of zeros) into the shot; a true low angle is ROOM-LOBBY-LOW (P4) |
| S8.03 | 3.0 (3.00) | [OTS-W] the refused Cancel | `callDialog` greying, empty-tag arrow, bonk, shake | R | One try, as v4 |
| S8.04 | 1.8 (1.75) | [CU] Mas, tungsten | v2 30.25 `drawMasCU` | R | — |
| S8.05 | 2.5 (2.50) | [ECU] glass on the stone | `drawNudgeInsert` (lobby recolour, stand-in) | R | Polish is P4 |
| S8.06 | 2.8 (2.75) | [ECU] the Q* vault | `drawVaultInsert` | R | Rail `NOV 22, 2023`; the hum is the diegetic GLYPH (sound) |
| S8.07 | 9.9 (6.42) | [MCU-2] Mas past, Gerg, the vault | the v4 50/50 (vault stand-in) | C | CAST-MAS-TURNAWAY; Gerg's 2 lines; the new rail text |
| S8.08 | 8.4 (2.58) | [W] the bullpen, the memo, slow drift | v4's S8.08 was Mas's **MCU**: not used | **N** | ROOM-BULLPEN-UNPACK; Mas at room scale with mouths |
| S8.09 | 3.5 (3.08) | [ECU] chair back, four screws | `drawChairBackInsert` + hand (stand-in) | R | Polish is P4 |
| S8.09b | 2.0 (—) | [ECU] the shut door, nameplate on | none in v4's lock; **`kits/inserts-props.ts drawShutDoorInsert` already exists** | **N** (existing art) | Register it; about 15 min |
| S8.10 | 4.2 (4.00) | [W] the observer chair | bullpen corner + folding chair (stand-in) | R | Polish is P4 |

**v4 art that v5 no longer uses:**
- Rima's MCU in the boardroom's CEO chair (v4 S3.04)
- Neleh's night desk with his 9:32 post (S3.09)
- Neleh's MCU on "the bylaws" (S4.03)
- the term-sheet insert (S7.10)
- Gerg's post on Mas's phone as its own shot (S7.11, now inside S7.09)
- the separate box-of-zeros insert (S8.02, now inside S8.01)
- the `ALYI · HIS CO-FOUNDER, CHIEF SCIENTIST` plate
- Mas's memo MCU (S8.08)

Keep them registered for comparison. Retiring them is ORGANIZATION-PLAN phase 6's business after the v5 lock.

---

## 4. The style moments Act Four keeps

| Moment | Where | Status for v5 | Items |
|---|---|---|---|
| **THE PLAN** · BLUEPRINT (the show's voice) | sc 25, S1.02 glow → S1.05 tear | Kept. v4's one-sheet build (`plan4.ts`) stands. v5 adds Neleh's pointer figure and Mada's spinner icon, re-clocked to six lines | BP-NELEH-POINTER |
| **The call as a call, told twice** (1.G) | sc 26 S1.07–S1.12; sc 27 S3.00a–S3.05; S4.01's buried grid; S6 | Kept and extended. His side is v4's grid (dialog, the ALYI / CO-FOUNDER arrow, the drop). Their side is new: the waiting tile, the clean removal, the audio chip, Rima's spotlit join. 1.G's neon proof and tile softness are added | UI-CALL-V5, STYLE-1G-NEON, STYLE-1G-SOFT |
| **Masked GLYPH dissolve**, use 2 of 2 | S1.09 | Kept (style-range §6.1a). v4 builds it with `callgrid tileDrop` → `glyphDissolve`, but v4's composer drew tokens as 2-pixel marks. v5 draws true glyph tokens | INF-FRAME5 |
| **J1 `CANCELLED`** (engraving, the record) | S1.09, in place of the dissolve | **Conditional, withdrawn** by style-range §6.1a (§1.1). The prototype is built on lock v2 (`dev/jumps/proto1`) | STYLE-J1 |
| **F1.2 TPOOL** · EARLY-WEB16, `(REPORTED)` | S2.03 | Kept as is | — |
| **1.K** lobby CCTV on the wall screen | S4.09 | Kept at bezel size; a new camera angle, so `GUEST` reads | ROOM-LOBBY-CCTV-DESK, PLATE-BOARD-SCREEN |
| **Freeze card** (Terb) | S7.06 | Kept as is (`freezePrint` + `blipCard`) | — |
| **1.D** the landlord's house style | S7.02b–S7.03 | Conditional (R25); pixel palette steps by default | STYLE-1D |
| **The vault's GLYPH** (diegetic hum on F) | S8.06–S8.07 | Kept. It's a sound, not a picture; no art | — |

---

## 5. Build rules that apply to every item

From `studio/PIXEL_GUIDE.md` §1–§4 and the v5 script's framing notes:
- **Native size.** Everything is authored at 480×270 (room 480×203 plus the band) and output at 4× nearest (1920×1080). The pixel frame is palette-constrained, so use `PAL.*` only.
- **Close shots are their own drawings.** Never scale a sprite. A zoom is a cut to the next size, and a pull-back is a cut to a wider drawing. Only a screen's own pixels may be shown at 1:2 (v4's rule), and not where its text must read (§1.4).
- **Motion.** Whole-pixel moves only, with small, budgeted pushes (edit-plan-v5 §7). Hold drawings on 2s or longer. Swap mouths, lids and arms; don't tween them. Windows and tiles open in three held steps.
- **No mirrored frames with lettering** (§1.8).
- **Facing.** Mas stays in the left third at every size. On the board's side, anyone framed alone faces from the right, and the left of frame never holds him.
- **Dither** only on backgrounds and light falloff, never on skin or figures.
- **GLYPH** is for dark foreshadowing only. This act's one visible use is the dissolve.
- **Guardrails.** Parody names only, generic UI (no real app's layout or sounds), no photoreal likenesses. The sealed folder and every reason for the firing stay unshown (guardrails X9).

---

## 6. Handoff

**Where new work goes** (ORGANIZATION-PLAN §2):

| Kind | Home |
|---|---|
| Shared art (rooms, cast, kits, UI) | `studio/src/shared/pixel/{rooms,cast,kits}/`, as additive modules or new states on existing ones |
| The v5 animatic code | `studio/src/episodes/ep01/act4/animatic/` (`shots5.ts`, `data-v5.ts`, `frame5.ts`, `tools/lock_v5.py`, `tools/render5.ts`) |
| The v5 lock and shot list | `show/episodes/ep01/production/act4/` (`shots-locked-v5.json`, `shotlist-v5.md`) |
| Renders | `out/ep01/act4/animatic/` (`act4-animatic-v5.mp4`, `-picture.mp4`) |
| Scratch | the session scratchpad, in a named subfolder |

Leave the v4 files untouched for comparison.

**How to re-run this survey's numbers** (run from the repo root):
```bash
# the stick timeline: every beat with its length, framing, cast and on-screen text
python3 -c "import json; d=json.load(open('show/reel/ep01-act4-v5.json')); [print(b['id'], b['reelDur'], b.get('frame',''), [c['id'] for c in b.get('chars',[])], [o['text'] for o in b.get('onscreen',[])]) for b in d['beats']]; print(d['_source'])"
# which takes carry mouths and lip_sync flags, by shot (for §1.2 and INF-LIPSYNC5)
python3 -c "import json,collections; L=json.load(open('audio/ep01/act4/dialogue/lines-v5.json')); c=collections.defaultdict(list); [c[i.get('shot_id')].append((i['speaker_slug'], i.get('lip_sync'), bool(i.get('mouth')))) for i in L]; [print(k, v) for k, v in c.items()]"
# which v4 layouts exist, and which are marked stand-in
grep -n "^S('" studio/src/episodes/ep01/act4/animatic/shots4.ts | cut -c1-120
grep -n "stand-in" show/episodes/ep01/production/act4/shotlist-v4.md | cut -c1-80
```

The R / C / N shares in §0 are the per-shot verdicts in §3, summed over each beat's `reelDur`. Continuation beats count with their shot. If the stick timeline is re-cut, re-sum the same way. The verdicts only change if a shot's content changes.

**Measured versus judged:**

| Measured (from the files) | Judged (needs a person) |
|---|---|
| The reel lengths and the act's 518.458 s | Every size estimate |
| Which v4 layouts and module functions exist, and their options (mouths, arms, heads, room states) | Every "reuse as is": the v4 drawing exists and is timed for a shorter hold; whether it still reads over v5's longer holds needs someone to look at stills and in motion |
| Which v4 shots are marked stand-in | The priority order |
| The take flags | |
| The chase-light rates in `vegasBg` | |

**Open issues:** §1's nine flags, in particular J1 against GLYPH (1), the lip-sync flags (2) and `GUEST`'s legibility (4). Also the showrunner's pending approval of the stick reel's flow and dialogue, which edit-plan-v5 §8 makes the gate before the pixel lock.
