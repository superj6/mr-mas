# Ep2 v1: the tag's picture (sc 23, "august")

> **Status: built, rendered and looked at, 2026-10-10, by the tag's picture pass.** One scene module, `studio/src/episodes/ep02/pixel/tag/scenes/sc-23.ts`, draws all 9 shots of the v1 EL lock (888 f, 0:37.00), with the tag's own drawings in `tag/sets/` (`dark.ts` his dark room at night: the arrival from behind, the cover, the pages, the OTS with THE ORB, the Orb's TERMINAL view, the MCU; `screen.ts` what is on his monitor: HTURT's feed and RUMPT's post, the Aug 21 broadcast, THE PODIUM and the balloon; `common.ts` and `backhead.ts`, copies of Act Four's). The picture is `out/ep02/v1/picture/tag.mp4` (silent: the lock's `mix` is empty), the per-scene cache `out/ep02/v1/scenes/tag/`, the contact sheet `out/ep02/v1/picture/tag-sheet.png` (one labelled frame per shot, decoded from the MP4).
>
> **Checks [M]:** `check`: 9 layouts, 0 stand-ins, 0 problems (every mark resolved on the lock's sounds and texts). `scenecheck --every 4`: 236 frames, 0 differ (no layout reads `sh.s` as a clock). Flash (`flash_seg.py`): **0** flashes in any second, **0** red, 5 transitions, pass; the largest mean-luminance step 0.158 at f110 (the cover's OTS → the pages' ECU). The lock check: `lock.py --seg tag` re-run into scratch on the same EL timeline and takes: 8 checks ok, 0 problems under `--strict`, its `data.ts` and `lock/tag.json` **byte-identical** to the committed ones. Scoped `tsc --noEmit` over `tag/shots.ts` and its imports: 0 errors. Render through `ops/heavy.sh` (`MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`, `X264_THREADS=1`): 888 f in 14.8 s; cache key `sc-23-902eb105f5abe223`; `tag.mp4` md5 `c054e0a9…`.
>
> **What was looked at [J]:** every shot as 1080p stills while it was built (four rounds, about 60 frames, with 1080p crops of the TERMINAL brackets and RUMPT's hands), then **every shot's start, turn and end decoded from the rendered MP4** (43 frames: 0, 37, 38, 46, 109 · 110, 112, 116, 139, 161, 180, 196, 213 · 214, 252, 313 · 314, 330, 350, 380, 405, 414, 465, 477 · 478, 520, 548 · 549, 584, 659 · 660, 664, 668, 680, 731, 769, 785, 801 · 802, 809, 839 · 840, 887), the fixes again as stills (f30, 37, 208, 560, 584) and from the re-rendered MP4, and the contact sheet. Also act4.mp4's last frame (f7655) beside the tag's first, for the seam. Nothing was watched in real time or heard with a mix.

**Contents:** [1. The shots](#1-the-shots) · [2. Passes and leaps](#2-passes-and-leaps) · [3. Fixed after looking](#3-fixed-after-looking) · [4. Where this departs from the plan, and why](#4-where-this-departs-from-the-plan-and-why) · [5. Weak, or for a human to check](#5-weak-or-for-a-human-to-check) · [6. Re-running](#6-re-running) · [7. Rules checked](#7-rules-checked) · [8. Files](#8-files)

---

## 1. The shots

Frames are the segment's (the scene starts at 0, so the layouts' `f` is the same frame); `k` is the shot's own frame. Marks are the lock's sounds and texts. No line in the tag moves a mouth: the one line is V.O. 14, typed by the host's voLine in his cyan over the back of his head (no face, so no lips), never over a rail or a toast. No pointer anywhere: his hand is on paper, the Orb reads the screen with its own lens.

### Sc 23 · The other company (9 shots, 888 f; AUG 5 → AUG 21, 2024; his dark room, night)

Ep1's dark room (rooms/darkroom-plate) as Act Two's night OTS room and MCU plate (copied), Ep1's framed GUEST lanyard on the wall, his glass; the art's SET-08 (THE PODIUM, RUMPT's hands, the chatbot balloon, the broadcast, the rally post, the egg on a bill), copied into `tag/sets/screen.ts` where a shot needed more than the still.

| Shot | Frames | Framing | What it shows | Turn / marks |
|---|---|---|---|---|
| 23.01 | 0-109 | WIDE → OTS | **ARRIVE** on the room from behind him, the monitor's glow on (its dim feed), the GUEST frame on the wall, rail AUG 5: his back as he sits (standing at the chair, half down, seated: three held drawings, k0-13), his head where 22.09 left him on the lot (x ~262 against 22.09's ~270), THE ORB at his right shoulder; 1.5 s on the room, then the refiled complaint drops from above (held drawings k35-37) onto the desk in front of the monitor: the room jolts 2 px, dust off the desk, he doesn't move; over his right shoulder and down (k46): the cover, NOLE v. MANALT ET AL. · FEDERAL COURT, the (FOR NOW) note stuck on it, crossed out | `landing_thunk` k38 |
| 23.02 | 110-213 | ECU | Top-down on the desk under the monitor's light: the cover; his hand pinches each sheet's foot and turns it over the top (held drawings: the sheet lifting, its underside curling, its shadow): page 1 ends **!!**, page 2 **!**, page 3 **.** (the display face at 2x, the cold open's ECU grammar, the page number small at the foot); his flat hand slides the stack off to the left in held steps; the monitor's foot and its light on the clear desk | `page_turn` ×3 (k6, 29, 51) |
| 23.03 | 214-313 | POV | His monitor full-bleed: HTURT's plain feed (grey rows, nothing legible), rail AUG 11; on the pop RUMPT's post arrives **whole** in one frame (a plain red square avatar, …and she 'A.I.'d' it…), its photo a rally crowd under SIRRAH's plate, SUMMER 2024 on its corner; the background tab, an egg on a bill (Ep3's) | `ui_toast_pop` k38 |
| 23.04 | 314-477 | 2S → TERMINAL → 2S | Over his shoulder, the Orb at his shoulder lifts on the servo and floats to the screen in held steps, its aperture opening; **TERMINAL (2.E)** on the sweep: the Orb's view in Ep1's TERMINAL palette, the rally redrawn at the machine's resolution, a scan line down it, a bracket stepping face to face (four, 0.5 s each) with `human` under each, its log `001 human` … counting every face in the photo (130); back in his room on the chime, the Orb's toast `verified: human (all of them)` hung under the photo it verified (toast 3 of 3); it floats back toward his shoulder | `orb_servo` k7, `orb_scan_sweep` k33, `orb_chime_F` k100 |
| 23.05 | 478-548 | OTS | The same OTS, the toast cleared: the post and the photo on the monitor, the egg tab, the Orb settling at his shoulder; **V.O. 14** "sixty elections this year." typed over the back of his head | the V.O. |
| 23.06 | 549-659 | POV | The Aug 21 interview in its own plain player (no network, no logo; a muted speaker in its bar: no voice), rail AUG 21: the suit from the chin down, the over-long red tie, his hands talking (on 6s), forearms from below the frame; on the text the lower third slides in whole: "…having me speak… It's a little bit dangerous out there." (76 f on screen; its floor is 73) | `blip_text_neutral`; the text k33 |
| 23.07 | 660-801 | POV | The player's chrome clears in held steps (the lower third, the bar, the frame, k0-5), the picture dissolves in held dither (k6-13) to what is outside the broadcast: THE PODIUM on its dusk hill, still facing away; the same hands come up from below with a hand pump and a limp balloon; a stroke on each pump, the balloon (CHATGTP's bubble, dot eyes, no words, no sticker) a size bigger each time; both hands at the podium's near corner post tie its string; they let go and sink out of frame; the balloon floats on its slack string, bobbing on 6s | `balloon_pump` ×3 (k19, 45, 71), `knot_tie` k109 |
| 23.08 | 802-839 | POV | **HOOK** the balloon bobbing; on the snap the string goes taut, a straight line from the knot over the podium's lip, and the balloon is pulled down behind the podium, its top and dot eyes over the gold (a jerk drawing, then settled), as if someone on the far side had just taken hold of it | `string_taut` k7 |
| 23.09 | 840-887 | MCU | **AFTER** Mas at his monitor at night (Ep1's approved portrait, the plate soft behind him), its glow on his still face, a face light one step; the cut to black on the downbeat is the lock's end (the score's bar line, 37.000 s) | — |

## 2. Passes and leaps

**2.E TERMINAL (the manifest's one pass for the tag, code):** 23.04's middle, the Orb's point of view (pov-and-framing: TERMINAL is the machine's view), in Ep1's own `palettes.ts` TERMINAL set (the 4-level CRT teal), entered on the scan sweep and left on the verdict's chime. The crowd is redrawn at the machine's resolution (the same rally: the hangar wall, its pillars, SIRRAH's plate, the decal) so a bracket and a label can sit on a face; its marks and its log are in TERMINAL's own four colours, with every third row a rung down (the CRT's texture). **No video-model insert and no Tier 2 leap** are booked for the tag (manifest §4: 2.E is code), so no Runway take was made and the key was not read. Other devices, all in-world: HTURT's UI, the broadcast player, the Orb's toast (Ep1's kit).

## 3. Fixed after looking

Each was seen in 1080p stills or in frames decoded from the MP4, fixed, and looked at again.

1. **23.01, an unmotivated cyan slab at the left of the wide:** the OTS room is Ep1's plate slid, and the plate's own monitor light (its cone on the desk and wall) came with it; from behind him, wider, it has no source. The cyan and K families left of the monitor walk to the navy (`dark.ts wideBack`).
2. **23.01, a dark screen in the arrival** ("the monitor's glow on"): the feed a rung up, and the room round the monitor a rung up in a soft pool.
3. **23.01, the Orb hung in the complaint's fall path** (k37: a slab with an Orb on it): it moved to his right shoulder, clear of the fall.
4. **23.01, the cover's OTS head was a sliver** at the frame's edge: moved in so the back of his head and his shoulder read as the over-the-shoulder.
5. **23.02, the big "!" was a broken bar** (a hand-drawn stem and dot with a gap): the display face's own glyphs at 2x, whole pixels, the cold open's ECU look; the page number moved up into the frame.
6. **23.02, it ended on a bare dark desk** with no reason to cut to the monitor: the monitor's foot and its light are revealed as the stack slides away.
7. **23.03-23.05, the photo overflowed at the OTS's size** (the art's crowd rows ran out under the photo, its pillars into the egg tab): the crowd drawn on a layer clipped to the photo, its rows spaced to the photo's height; the post card and the egg tab re-spaced so the tab shows at both sizes.
8. **23.04, the Orb's home sat over the photo and its toast covered the post's words:** home by his shoulder at the bezel's foot; the toast hung centred under the photo.
9. **23.04, the TERMINAL crowd read as blobs with no visible brackets** (the photo magnified 2x, then remapped; the light brackets merged into light shapes): the crowd redrawn at the machine's resolution, the brackets with a dark keyline, the four picks all in one row so every label sits inside the frame.
10. **23.07, the balloon was cropped by the screen's top** at its last sizes and when tied: the ridge and podium lower, the balloon 2.4x, floating up and right of the knot.
11. **23.08, the taut string ran along the podium's lip** where it couldn't be seen: the knot is on the near corner post just below the lip, so the taut line crosses the gold as a clear diagonal; the balloon (now beyond the podium) behind the pump.
12. **23.06, RUMPT's sleeves vanished into his jacket** (both navy): the jacket a rung down with a keyline, the sleeves a rung up; the forearms now read rising from below the frame to the white cuffs.

## 4. Where this departs from the plan, and why

- **23.01 is WIDE → OTS** (the lock's framing is OTS). The arrival is a wide from behind so the match with 22.09 (his back, the same place in frame) and the room (the GUEST frame, the monitor's glow) both read; the cover is read in an over-the-shoulder close down onto the desk.
- **The match is the same place, not the same size**: 22.09 ends with him about 35 px tall on the lot; the dark room at that size would lose the desk and the monitor. His back is at x ~262 against 22.09's ~270, square away, the screen ahead of him as the cube was.
- **23.04's 2S is the OTS** (his back and the Orb in one frame); the cut to 23.05 is in the same framing, the Orb's float back carrying across it.
- **The TERMINAL view's own text** (`> scan`, `001 human` … `130 human`) is new: the machine's log, in its own medium, counting the photo's faces so "(all of them)" is shown, not said. No words beyond `human` and numbers.
- **Small additions in the world, each with a reason:** a muted-speaker glyph in the broadcast's bar (why there is no voice); the pages' small page numbers (the order of !!, !, .); the hand pump stays on the podium once used.
- **The art's THE PODIUM hill** is used as the art pass drew it (its open ask, art.md §7, stands).

## 5. Weak, or for a human to check

- **The fall** is three held drawings in the wide (k35-37); its motion streaks read as dotted rows; the THUD's weight rests on the sound and the 2 px jolt.
- **The page turn's curl** is a flat underside band, not a modelled curl; it reads at speed [J], it isn't pretty held.
- **RUMPT's arms** are forearms from below the frame (the camera on his side of the podium), elbows off frame; long reaches in 23.07.
- **The TERMINAL crowd** is not a pixel-exact magnification of the photo on his screen (the same rally, redrawn for the machine's eye).
- **23.09 is held still for 2 s**: his face lit by the screen, nothing moves (the chill is meant to sit there); worth a look in real time with the held chord.
- **The two cuts into and out of TERMINAL** (k33, k96) are the scene's brightest changes; the flash check passes them (0 flashes), but a comfort look on a real screen is worth it.
- **No mix:** the tag has no mix yet (the lock's `mix` is null). The picture's hits sit on the lock's spots, which the E02-13 cue sheet also uses (THUD 1.6 s = k38, the pumps, the knot, the taut string, the chime); none of it was heard.
- **Carried from Act Four** (shots-act4.md §5, untouched here): 22.09 ends with him a few pixels tall; the tag opens on him larger in the same place.
- Nothing was watched in real time.

## 6. Re-running

From the repo root; `S` is any scratch folder.
```sh
cd studio
node src/episodes/ep02/pixel/tools/build.mjs tag $S/r-tag.cjs
node $S/r-tag.cjs check
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-tag.cjs picstills $S/stills 30 140 395 731 830          # 1080p stills of any frames
X264_THREADS=1 MRMAS_MAX_LOAD=40 MRMAS_HEAVY_MEM_MAX=6G ../ops/heavy.sh node $S/r-tag.cjs scenes --jobs 2   # -> out/ep02/v1/picture/tag.mp4
MRMAS_MAX_LOAD=40 ../ops/heavy.sh node $S/r-tag.cjs scenecheck --every 4
cd .. && bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/flash_seg.py out/ep02/v1/picture/tag.mp4
python3 studio/src/episodes/ep02/pixel/tools/lock.py --seg tag --timeline show/reel/ep02-v1-el/ep02-v1-el-tag.json \
  --takes show/episodes/ep02/production/v1/assembly/el-v1/tag-takes.json --ep-in 32856 --label "TAG" \
  --out-json $S/lock.json --out-ts $S/lock.ts --strict; cmp $S/lock.ts studio/src/episodes/ep02/pixel/tag/data.ts
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/episodes/ep02/pixel/tools/sheet.py sheet out/ep02/v1/picture/tag.mp4 \
  out/ep02/v1/picture/tag-sheet.png "TITLE" "30|23.01|WIDE → OTS" "140|23.02|ECU" "260|23.03|POV" "395|23.04|2S → TERMINAL" \
  "530|23.05|OTS" "600|23.06|POV" "731|23.07|POV" "830|23.08|POV" "870|23.09|MCU"
```
The typecheck: `npx tsc -p <scratch>/tsconfig.tag.json` through `ops/heavy.sh`, a config that extends `studio/tsconfig.json` with `files: [tag/shots.ts]`, `include: []` and the studio's `@types` as `typeRoots`.

## 7. Rules checked

P1 (pixel, 1080p), P2 (his back, the OTS and his MCU carry the scene; the monitor is his POV), P3 (arrival: 1.5 s on the room before the THUD, his back as he sits; aftermath: the taut string, then his still face, 2 s, to the cut), P4 (the run's items each held for their read; no hold over 4 s without change), P5 (looked at full size: his hand at the page's foot and flat on the stack, RUMPT's forearms from below to the cuffs, Mas's face reading still, crops, the text), P6 (no cursor: paper, the Orb's lens), P7 (what's named is visible: the cover, the note, the marks, the post, the photo's plate and decal, the egg, the toast, the lower third, the balloon's eyes), P9 (no speaker on screen: V.O. only), P10 (his MCU a face light one step), P11 (2.E TERMINAL as the manifest books it), P14 (no video model; RUMPT hands and tie only, no face, no voice), P15 (flash 0/s, 0 red; read floors: the caption 64 f for a 50 f floor, the post 62/31, each `human` ≥ 15/12, the toast 58/41, the lower third 76/73), P17 (no scaffolding), P18 (V.O. 14 typed by the host, after the toast cleared, never over a rail), W8 (no V.O. on the suit or over the candidate's words; his real words on the broadcast's own lower third; the balloon wordless), W20 (the post in its own UI, the words on a lower third), R1 (Ep1, the art pass and the acts imported or copied; no shared or Ep1 file edited), R10 (every render, decode, check and typecheck through `ops/heavy.sh`, one at a time; `MRMAS_MAX_LOAD=40`, `MRMAS_HEAVY_MEM_MAX=6G`), R11 (keyscan before the commit and the push), R13 (this note), R14 (scratch in this session's scratchpad).

## 8. Files

**New:** `studio/src/episodes/ep02/pixel/tag/sets/{common,backhead,dark,screen}.ts` (`common` and `backhead` copies of Act Four's; `dark` copies Act Two's night OTS and MCU; `screen` copies the art's SET-08 drawings it changed); `out/ep02/v1/picture/tag-sheet.png`; this file.
**Filled (the stub):** `studio/src/episodes/ep02/pixel/tag/scenes/sc-23.ts`.
**Generated, git-ignored or left untracked as before:** `out/ep02/v1/picture/tag.mp4` (and its `.srt` and `.render.json`), the scene cache `out/ep02/v1/scenes/tag/`.
