# Ep1 · Act Four · Extra pixel assets for the v5 preview (hand-off to the pixel pass)

| | |
|---|---|
| **What this is** | The hand-off list for the lower-priority art that [art-built-v5.md](art-built-v5.md) §4 lists as not built: the stand-ins still drawn in kept v4 shots (art-needs P4 POLISH-STANDINS), ROOM-LOBBY-LOW, the optional PROP-PODCAST-BOOM, and a pixel variant of Tasya's room remap (S7.02b) that moves the way E1-P3 (1.D) moves. For each asset: its module, the v5 shot it serves, what it replaces in the v4 layout, and the call that wires it. |
| **Why** | The showrunner, 2026-09-27, on Act Four's remaining score, sound, mix, art, facts checks and captions: "i don't understand why those would take so long or why they're not being integrated now". The lead ruled the v5 timing locked, so this is built now, in parallel with the pixel preview pass. Also binding: fully programmatic, organized files, a successor's notes, and "try not to cook/freeze my laptop". |
| **Who, when** | The `a4fin-pixelextra` pass (an additional pixel artist), 2026-09-27, about 01:15–01:55. Nothing was committed. |
| **Where it is** | Code: `studio/src/episodes/ep01/act4/art-v5/extra/` (six modules, `demos.ts`, `tools/sheet.ts`, README). Stills: `out/ep01/act4/assets/v5/extra/` (`sheet-native.png`: 24 stills at 480×270; `native/`; `full/` at 1920×1080; `index.json`). |
| **Not touched** | `shots5.ts`, `animatic/**`, every existing `art-v5` module and every `shared/pixel` file. The new modules only import them. The pixel pass wires everything below. |
| **Honesty** | I can't watch video. I looked at every still on the sheet at 1× and in 3–5× crops, and fixed what didn't read to me. That's one reader's judgment. Nothing here has been seen in motion or placed in a real v5 shot (`shots5.ts` wasn't there to place it in); every demo draws the asset over the shared drawing its shot uses, at the v5 lock's marks. |

---

## 0. The short version

- **Built (8 assets, 24 stills, palette-clean):** Neleh's pen and marker hand (S3.02, S4.14), the worker's screwdriver fist (S8.09), the observer chair and its reserved-seat card (S8.10), the chapter card (S5.01), the lobby's stone desk top (S8.05), the lobby from low with the carton of zeros in the worker's hand (S8.01), the optional podcast boom (S7.02b), and a pixel variant of Tasya's room remap with E1-P3's staging (S7.02b).
- **Each one is a one-call swap** into the v4 layout that v5 re-clocks: the same anchors, the lock's marks (§1).
- **Left to the pixel pass, as briefed:** the art-built §3.1 fixes it's already doing (Tasya's light, the footnotes, the badges, the pointer, the hourglass HIGH view, the thumbnails, the window wall) and the STATE-SMALL wiring. Also not built: the S7.06 look-around and ROOM-BOARDROOM-DAY (§2).
- **1.D, measured:** the E1-P3 clip lines up with the v5 lock frame for frame, so if R25 takes 1.D, the pixel preview can splice it with no re-timing (§3).

---

## 1. The hand-off list

The module paths are under `studio/src/episodes/ep01/act4/art-v5/extra/`. Shot starts and lengths are act frames from `shots-locked-v5.json`, and marks are shot frames. The "v4 call" column is the line in `animatic/shots4.ts` that a v5 layout inherits through the `v4()` adapter. The sheet keys are `ID@state` in `out/ep01/act4/assets/v5/extra/index.json`.

| Asset | Module · entry | Shot (v5 lock) | Replaces (v4 layout) | Sheet |
|---|---|---|---|---|
| **POLISH-PEN-HAND** | `hands.ts` `drawNelehPenHand(b, tx, ty, {tool, pose})` | **S3.02** (2056, 62 f; tick1 4, run0 19, run1 44): `tool: 'pen'` · **S4.14** (6824, 59 f; q 31): `tool: 'marker'` | `nelehHand(fb, tx, ty)`, the floating orange stick marked MARKED in both. Same tip anchor | `S4.14-question`, `S4.14-enter-lift`, `S3.02-pen-tick` |
| **POLISH-SCREW-HAND** | `hands.ts` `drawWorkerScrewHand(b, sx, sy, {turn, from})` | **S8.09** (12210, 84 f; s1 8, s2 24, s3 41, s4 58) | `screwHand(...)`: a fist-shaped block and a brown sleeve | `screw1-turn0` … `screw3-turn2` |
| **POLISH-FOLD-CHAIR** | `observer-chair.ts` `drawObserverChair(b, x, y, {unfold, keys})`, `observerPlacard(b, rx, ry, {k})`, `CHAIR.rail`, `chairKeysAt` | **S8.10** (12342, 101 f; unfold 0, keys 68; label from 19) | `foldChair(...)`: a blue slab as tall as a person, with a floating label and a 12-dot ring | `u0-folded` … `u3-keys-landed` |
| **POLISH-CHAPTER-CARD** | `cards-inserts.ts` `drawChapterCard(b)` | **S5.01** (6943, 42 f) | `actCard(fb, …)`, marked stand-in | `S5.01` |
| **POLISH-LOBBY-STONE** | `cards-inserts.ts` `drawLobbyStoneNudge(b, step)` | **S8.05** (11646, 59 f; set 4, nudge 10) | `drawNudgeInsert` + the STONE recolour and the brass line through the middle of the desk | `S8.05-set`, `S8.05-nudge` |
| **ROOM-LOBBY-LOW** | `lobby-low.ts` `drawLobbyLow(b, f, {sign, box})`, `signAt`, `boxAt` | **S8.01** (11453, 79 f; ignite 2; sign text 4–79) | `v3(fb, '30.19', …)`: the night wide cropped (crop stand-in). v4's S8.02 box insert is folded in | `unlit-box-in-air`, `half-lit-box-set`, `lit-hand-gone` |
| **PROP-PODCAST-BOOM** *(optional)* | `landlord.ts` `drawPodcastBoom(b, mx, my, step)`, `boomStepAt` | **S7.02b** (9936, 206 f) | Nothing (new, optional; cut it if 1.D is taken) | `step2-dipping`, `step3-in` |
| **STYLE-LANDLORD-PX** *(option)* | `landlord.ts` `drawLandlordRemapPlate(b, f, st)`, `landlordRemapAt`, `landlordRemapKey` | **S7.02b** (below 126, above 149, around 172) | The room callback of v4's S7.02b MCU (`bullpenRoom(..., {landlord: L})`, three region steps) | `below-k132` … `around-k184` |

### How to wire each one (the v5 layout's lines)

Names are as in `shots4.ts`: `mk(sh, name, default)` for marks, `held`, `MCU`, and `sh.texts`.

**S3.02**, her pen. Keep v4's path; only the draw changes. She lifts for the run and rests on the tick and the blank:
```ts
drawNelehPenHand(fb, x, y + 6, {tool: 'pen', pose: k >= r0 && k < r1 ? 'lift' : 'rest'});
```

**S4.14**, her marker. It enters lifted along v4's path and rests on the `?`:
```ts
drawNelehPenHand(fb, k < q ? Math.round(380 - 50 * inn) : wx + 18 + w * 14, k < q ? Math.round(214 - 44 * inn) : wy - 2, {tool: 'marker', pose: k < q ? 'lift' : 'rest'});
```
The hand clips at the room band (`maxY` 203). The sleeve always leaves the frame at the lower right.

**S8.09**, the screws. `n` is v4's count of screws already out, so the fist sits on the next screw (`PLATE_INSERT` is `rooms/boardroom.ts`):
```ts
if (!off) { const i = Math.min(3, n); const [sx, sy] = PLATE_INSERT.screws[i];
  drawWorkerScrewHand(fb, sx, sy, {turn: (i % 3) as 0 | 1 | 2, from: sx < 240 ? 'left' : 'right'}); }
```
- `turn` rolls the fist a third of a turn per drawing. The script's "one held drawing each" gives one per screw.
- `from: 'left'` mirrors the drawing for the two left-hand screws, so the fist never covers `ALYI`. It has no lettering, so the mirror is allowed.

**S8.10**, the chair. Keep v4's room. The chair stands on the room's own anchor, `anchors.observerChair` = (404, 178):
```ts
held(fb, 'bull-shut4', (b) => bullpenRoom(b, 0, {door: 'shut'}, {}));
const u = Math.max(0, Math.min(3, Math.floor((k - mk(sh, 'unfold', 0)) / 5))) as 0 | 1 | 2 | 3;
drawObserverChair(fb, 404, 178, {unfold: u, keys: chairKeysAt(k, mk(sh, 'keys', 68))});
const t = sh.texts.find((x) => x.kind === 'label');
if (t && k >= t.s) { const [rx, ry] = CHAIR.rail(404, 178, u); observerPlacard(fb, rx, ry, {k: k - t.s}); }
```
- The keys fall in 5 held steps from above the frame, land, and bounce 1 px (`KEYS_LAND` = 5).
- The card stands in a clip-stand on the backrest's top rail, above the empty seat.

**S5.01**, the card:
```ts
drawChapterCard(fb); return {full: true};
```

**S8.05**, the stone top. The whole layout body becomes:
```ts
drawLobbyStoneNudge(fb, k < mk(sh, 'set', 4) ? 'held' : k < mk(sh, 'nudge', 10) ? 'set' : 'nudge');
```

**S8.01**, the lobby from low. The rail and the badge stay the host's.
```ts
drawLobbyLow(fb, k, {sign: signAt(k, mk(sh, 'ignite', 2)), box: boxAt(k, mk(sh, 'ignite', 2) + 10)});
```
- `signAt` is v4's ignition flicker: 1, 2, 1, 2, then 3 (lit), on 2s.
- `boxAt` holds each step for 3 f: the carton in the air, lower, set, the hand lifting, the hand gone. So it's set well inside the 79 f shot, and the sign's line holds after it. Move the start mark if the sound pass spots the set-down elsewhere.

**S7.02b**, the remap option. It replaces only the room callback. Tasya's bust, the lip-sync and the MCU framing are as v4:
```ts
const st = landlordRemapAt(k, {below: mk(sh, 'below', 126), above: mk(sh, 'above', 149), around: mk(sh, 'around', 172)});
MCU(fb, landlordRemapKey(st), (b) => drawLandlordRemapPlate(b, 0, st), tasyaSpeakPortrait({...}), {third: 'R'});
```
- "below": the floor goes slate outward from his feet in held 2 f steps over 12 f.
- "above": the ceiling goes the same way, from over his head.
- "around": the walls and the NOPE AI neon go slate as a ring closing from the frame's corners onto Mas at his end desk, over 16 f.
- It ends all-slate, so it cuts into v4's S7.03 (Mas over the all-slate bullpen). `island: 26` would keep a circle around Mas unremapped, E1-P3's "one pixel island".
- If the MCU stays on the right third, Tasya's bust hides Mas, and the ring reads as closing on Tasya.

**S7.02b**, the boom, if kept. Draw it after the bust:
```ts
drawPodcastBoom(fb, 288, 78, boomStepAt(k, 41, 188));
```
- It dips in over 3 held steps and lands on "We have all the IP rights…". Tasya's line `a5-30-06` starts at shot frame 7, and "We" is at +40, so shot frame 47.
- It lifts after "around them", which ends at 7 + 180 = 187.
- (288, 78) puts the mic head about 30 px left of his mouth at mouth height, for v4's bust (third `R`, no `dx`). Move it with the bust.

---

## 2. What this pass did not build, and why

| Item | Why not | Owner / next |
|---|---|---|
| art-built §3.1 rows 1–9: Tasya's light, FIX-FOOTNOTES, the badges, the pointer, the hourglass HIGH view, the thumbnails, the window wall | The pixel pass is fixing these now. They're in its scratch and in the modified `tasya-phone.ts`, `macrosoft-badge.ts` and `boardroom-head.ts`. Excluded by the brief | The pixel pass |
| STATE-SMALL 1–4, 6, 7, 9, 10 | Layout wiring with options that already exist | The pixel pass (`shots5.ts`) |
| **The S7.06 look-around** (a POLISH-STANDINS item) | The heads turning need new room-scale head drawings inside `drawTerbRoom` / `drawMadaSeated` / `drawMasStand`, all shared cast files. Overlaying heads over a held wide would fight their rigs. v4's 2 px sway stays | The cast owner: a `look` option (a 3-drawing head turn) on those three rigs |
| **ROOM-BOARDROOM-DAY** (conditional) | PLATE-BOARD-SCREEN's S4.09 doesn't frame the window (art-built §4), so it isn't needed | Only if the v5 S4.09 framing shows the window |
| **A dolly-in low angle for S8.01** | ROOM-LOBBY-LOW here keeps the wide's distance. With a camera close enough for the sign to loom, Mas at the desk would be about 1.6× room scale (≈125 px), and no standing Mas drawing exists at that size. `mas-medium.ts` is seated. The low read comes from the vault, the collapsed floor and the near carton | If the room wants the looming sign: a ~125 px standing Mas (the cast owner), then re-stage `lobby-low.ts` |
| **STYLE-1D itself** (the vector house style) | It's E1-P3 (`src/dev/range/ep1-p3`, another pass's). It draws Canvas vector paths at output resolution, which the Node pixel renderer can't | §3 |

---

## 3. 1.D (R25): the E1-P3 clip fits the v5 lock exactly

- **Measured:** E1-P3's `data.ts` says its p0 is reel frame 9888. The lock's rule is "mix.wav frame 72 is act frame 0", so p0 is act frame 9816, the lock's S7.02 start.
- **The shot lengths match:** S7.02 is 120 f in both, S7.02b 206 f in both, and S7.03 63 f in both. S7.05 is p389–436 in the clip, 48 of the lock's 53 f.
- So **act frame = 9816 + p for p 0–436**. If R25 takes 1.D, the preview can take `out/lookdev/range/ep1/ep1-p3.mp4`'s frames for S7.02–S7.03 as they are, with no re-timing.
- Cut the podcast boom then (style-range). STYLE-LANDLORD-PX is the pixel stand-in that plays the same beats if the room compares the two.

---

## 4. Judgment calls a person should check

1. **The placard sits above the chair** (S8.10). The script says "its seat reads …". At the wide's scale the chair is ~50 px tall and the words need ~110 px in the 7 px face, so no part of the chair can carry them legibly. I stood the card in a reserved-seat clip-stand on the top rail, so the empty seat stays clear under it. The alternative is a lower-third label.
2. **The worker's skin and sleeve.** The worker is one person across S8.01 and S8.09: the warm skin ramp one rung deeper than Neleh's, a charcoal work jacket and a knit cuff. In S8.09's cool boardroom light the hand reads greyish, glove-like at 1×.
3. **The screwdriver fist** reads as a fist on a screwdriver at 1×. Up close the fingers are a little mitten-like, and the thumb is small.
4. **The pen hand** is good at 1×. At 4× the fingertip cluster at the nib is busy, and her navy blazer on THE PLAN's navy separates only by its lit edge.
5. **The low angle is modest** (§2). It's a floor-level wide, not a looming sign.
6. **STYLE-LANDLORD-PX's spread is subtle** on the already grey-blue bullpen, as v4's steps are. Mas is hidden behind the bust on the right-third MCU.
7. **The chapter card** is the display face, cream on black, with one short paper rule. If the rule reads as decoration, delete that line.

---

## 5. How to re-run (from `studio/`)

```bash
S=<scratch dir>
npx esbuild src/episodes/ep01/act4/art-v5/extra/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
node $S/sheet.cjs all ../out/ep01/act4/assets/v5/extra      # 24 stills: native/ + full/ + sheet-native.png + index.json (~8 s)
node $S/sheet.cjs strays                                    # all 24 print "ok" (2026-09-27)
node $S/sheet.cjs crop $S/c.png POLISH-SCREW-HAND@screw2-turn1 200 60 280 143 3
```

- **Measured:** 24 stills, 0 palette strays, `tsc` clean on the six modules (a scratch tsconfig with `files` only), and no existing file edited.
- **Needs a person:** everything about how it reads in motion, and §4.
