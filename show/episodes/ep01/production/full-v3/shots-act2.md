# Ep1 full v3 · shots: Act Two, "the regulate-me tour" (sc 13–17)

| | |
|---|---|
| **What this is** | The record of Act Two's pixel layouts on the stick lock: every shot, what it's built from, what's new, the checks, how to re-render it, and what's weakest. **Now on the v3.5 lock (the final version): [§12](#12-v35-the-v35-base-lock-script-draft-84-the-final-version) is current**; §11 is the v3.4 round; §10 is the v3.3 round, §9 the v3.2 round, §8 the v3.1 round and §1–§7 the v3 pass, kept for the record. |
| **Who, when** | The `v3-shots-act2-act3` pass (track P2 of [PLAN.md](PLAN.md)), 2026-09-27; the v3.2 and v3.3 rounds 2026-09-28. Nothing was committed: the lead commits. |
| **The files** | Layouts: `studio/src/episodes/ep01/pixel/act2/shots.ts`. Helpers shared with Act Three: `act2/kit2.ts`. New art: `act2/art/radnus-bust.ts`. The lock: `act2/data.ts` and [lock/act2.json](lock/act2.json). |
| **The picture** | **v3.3:** `out/ep01/full-v3/picture/act2.mp4` (1920 × 1080, 24 fps, H.264 + AAC, **3:10.54, 4,573 frames**, 14.7 MB), muxed with the v3.3 temp track (`act2-v33-stick-mix.wav`); see §10.4. It replaced v3.2's (3:13.04, 4,633 frames). Before that, the v3.1 render was `out/ep01/full-v3/picture/act2.mp4` (1920 × 1080, 24 fps, H.264 + AAC, **3:21.25, 4,830 frames**, 15.3 MB; rendered in 33 s on 2 workers), muxed with the v3.1 stick mix as temp audio (`out/ep01/full-v3/picture/act2-v31-stick-mix.wav`). (The v3 render it replaced ran 3:24.75, 4,914 frames, on `act2-stick-mix.wav`.) Beside it: `act2.srt`, `act2.mp4.render.json` and the contact sheet `act2-sheet.png` (one still per shot, each shot's middle frame). |
| **Measured** | v3.3: 38 of 38 shots have a layout, 0 stand-ins, `check` and `tsc` clean, it builds on the v3.3 EL lock, and `flashcheck.py` passes (§10.4). v3.2: 39 of 39 shots have a layout, 0 stand-ins, `check` and `tsc` clean, the flash check passes (§9.4). v3: 43 of 43 shots have a layout; 0 stand-ins; `check` passes; `tsc` over both segments prints nothing; the flash check passes (§4). |
| **Needs a person** | Nothing here has been watched in motion or heard. I looked at the contact sheet and at about 90 sampled native frames (every arrival, every V.O. frame, the dialogue shots, every freeze and card), and fixed what didn't read to me (§5). That's one reader's look at stills. |

---

## 1. The lock

- **Command** (from the repo root; the stick mix is sliced from the v3 stick reel's episode mix, where Act Two starts at reel frame 9316, and kept beside the picture the way Act One's is):

```sh
python3 - <<'EOF'   # the slice (48 kHz: 2,000 samples a frame)
import wave
w = wave.open('studio/out/reel-work/ep01-v3-stick/mix.wav'); w.setpos(9316 * 2000); d = w.readframes(4914 * 2000)
o = wave.open('out/ep01/full-v3/picture/act2-stick-mix.wav', 'wb'); o.setnchannels(2); o.setsampwidth(3); o.setframerate(48000); o.writeframes(d); o.close()
EOF
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act2 --timeline show/reel/ep01-v3/ep01-v3-act2.json \
    --takes audio/ep01/act2/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act2/lines-v3.json \
    --mix out/ep01/full-v3/picture/act2-stick-mix.wav --mix-offset 0
```

- **Result:** 43 shots from 50 beats (13.02–13.04, 13.11–13.12, 15.04–15.05, 17.03–17.04 and 17.07–17.09 merge), 4,914 frames; 39 lines, every one with a take; every check `ok`.
- **The lock's own notes, kept as they are** (I don't re-time): V.O. `v3-vo-11` shares the screen with the rail `MAY 4, 2023 · THE WHITE HOUSE` (§5.2 asks for one must-read at a time: a timing call for the lead); three plates are up under their read floor (the NEDIB, NESNEJ and ALTERED AUDIO items), which is why each gag card rides on into the next shot, as the stick does.

## 2. The shots

Sizes are the lock's classes. "Art" names the `v3-art-b` modules unless it says otherwise; every entry point is in [art/art-b.md](art/art-b.md).

| Shot | Time · length | Layout |
|---|---|---|
| 13.01 | 0:00 · 7.5 s W | **Arrival.** `drawWHWide`: the row facing SIRRAH at the head, her pointer moving between the A block and the class; Radnus's small collar flame; Mario's finger half up on "table". From "radnus" in the V.O., Radnus rehearses under his breath (a silent room-scale mouth). An 8-frame fade up from the act break. |
| 13.02 (+13.03, 13.04) | 0:07.5 · 6.4 s MCU | `drawSirrahMCU`: lip-sync, blinks, the pointer on A, landing on I on the freeze hit; the 2-tone freeze (15 f, the re-curved set, §3.3) and the SIRRAH card, which rides on while the room moves again. |
| 13.05 | 0:13.9 · 11 s 2S | `drawWH2S`: **RADNUS (the new bust)** writing it down (the pen in two held drawings, his eyes on the pad, one glance at Mario on "sub-concerns"), his extinguisher on the table, the small flame on his collar; MARIO lip-synced, the finger fully up on his first line, brow up for the sub-concerns; the scroll drops past the table's edge on the paper flutter. SIRRAH O.S. |
| 13.06 | 0:24.9 · 4.5 s W | `drawWHWide`: the photographer sets tripods 1, 2, 3 on the three landing thunks; on "camera one" the heads turn to their own cameras (Tasya cam 3, Mario cam 2, Radnus the ceiling), each at its own speed. |
| 13.07 | 0:29.4 · 3.75 s MCU | The row's long plate, re-laid here so it carries the new bust (Tasya re-lit warm on cam 3, Mario on cam 2, Radnus's eyes up to the ceiling camera); one whole-pixel pan R → L (frames 8–60), then Mas's lens look held about 1.25 s. |
| 13.08 | 0:33.2 · 5 s W | `drawWHWide`: four wrong eyelines (Mas at the lens); Tasya's room-scale mouth; Sirrah's pointer to the row on "Anyone". |
| 13.09 | 0:38.2 · 16.2 s 2S | `drawWH2S`: MAS (warm portrait, flipped to face him) and **RADNUS (the new bust)** leaning across; both lip-synced; Radnus's brow up through the apology; the flame on his collar and the extinguisher on the table; Mas's eyes leave Radnus for the V.O. ("he's not wrong.", mouth shut) and come back for "how's the dancing?". |
| 13.10 | 0:54.4 · 2.25 s ECU | `drawCollarFlame`: the flame grows on the whoomph; his hand pats at it in two held drawings from "We're being thoughtful." (O.S.). |
| 13.11 (+13.12) | 0:56.6 · 6.3 s W | `drawWHWide`: the door opens in held steps; NEDIB strides in and speaks (room-scale mouth); three heads turn round, each at its own speed; Mas's doesn't (V.O.) until the sentence ends, and then to the lens. **The flash:** all three tripods fire, a white step of 3 then 2 palette steps (never white), then the 2-tone freeze with **Mas kept in colour** (the 2TONE_FREEZE rule) and the NEDIB card. |
| 13.13 | 1:02.9 · 5.25 s OTS | `drawWHOTS`: from behind Mario's raised finger onto NEDIB (lip-synced, blinking); the finger goes all the way up on "writing"; the scroll comes out of his pocket word by word and the whole scroll is out on "Longer." The NEDIB card rides on to 45 f. |
| 13.14 | 1:08.2 · 5.9 s ECU | **CLASS PHOTO #1**, the art's print re-laid (§3.2) to print this cut's flash frame, so the print matches what we just saw; it slides in (3 held steps) and develops from white (3); "it's a good photo." (O.S.); held, the print drifting a pixel in his hand and its sheen sliding; a 12-frame step down into the night of sc 14. |
| 14.01 | 1:14.1 · 2.6 s OTS | `drawBridgeOTS`: the anchor clip on his phone, her mouth a beat late on its own clock, the ALTERED AUDIO tag, the progress bar running. |
| 14.02 | 1:16.7 · 1.25 s W | `drawBayWide`: push 1 of 3. |
| 14.03 | 1:17.9 · 1.9 s W | `drawLitWindow`: push 2 of 3, the silhouette nodding on an 8-frame beat. |
| 14.04 | 1:19.8 · 1.5 s ECU | `drawRepostECU`: hover, press, then REPOSTED on the click. |
| 14.05 | 1:21.3 · 2.4 s W | `drawBayWide`: the hailstone falls from the lit window, the plink's rings on the water, the glow off on the key tap. |
| 14.06 | 1:23.8 · 1.3 s | Black; the clone's voice runs on over it. |
| 15.01 | 1:25.1 · 4 s MCU | `drawSenateMCU`: THE CLONE at his lit mic, lip-synced on the carried line; he never blinks. |
| 15.02 | 1:29.1 · 4 s W | `drawSenateWide`: the chairman nodding along, then speaking (room-scale mouth); the red light moves from the clone's mic to his; the plate `LAHTNEMULB` (a name only) on the carpet under the dais. |
| 15.03 | 1:33.1 · 2.5 s 2S | `drawDais2S`: the clone's look (brow knit); the chairman takes the mic back, the red light with it. |
| 15.04 (+15.05) | 1:35.6 · 7.7 s 2S | `drawWitness2S`: the freeze (stock 2TONE, Mas kept in colour) and the SUCRAM card; then live: Sucram typing, lids down, lip-synced; Mas turns to him for "which one am i?". |
| 15.06 | 1:43.3 · 6.6 s MCU | `drawSenateMCU`: the chairman reading from his card (eyes down, up once over "really my biggest nightmare"), lip-synced. |
| 15.07 | 1:49.9 · 6.1 s OTS | `drawSenateOTS`: from behind Mas; on "jobs" the chairman reaches for his next card and the clone takes it (3 held steps) and reads it for him, silently; the chairman blinks and looks from Mas to it. |
| 15.10 | 1:56.0 · 8 s W | `drawSenateWide`: the dais leans in; one mic's red light comes on and the senator behind it speaks (room-scale mouth). |
| 15.11 | 2:04.0 · 6.25 s 2S | `drawWitness2S`: "i love my current job." (lip-synced, to the dais); Sucram types faster; on "money" Mas's hand goes to his pocket. |
| 15.12 | 2:10.3 · 3 s ECU | `drawWalletECU`: the wallet opens on HEALTH INSURANCE; the moth climbs out in three drawings on its sound. |
| 15.13 | 2:13.3 · 3.5 s W | `drawSenateWide`: the wallet held up; the gallery's one held gasp on the sound; the clone leans to its lit mic and reads the card (room-scale mouth). |
| 15.14 | 2:16.8 · 9 s 2S | `drawWitness2S`: Sucram stamps on the three stamps and on through his line; the moth dodges; he stops and looks at Mas for "…i have no equity in nopeai." (Mas lip-synced, to the dais), then goes back to his phone; the moth lands and lifts. The senator O.S. |
| 15.15 | 2:25.8 · 3.3 s HIGH | `drawSheetHigh`: the sheet slides in held steps (folder_slide); the stamp comes down mid-slide on the stamp sound; it leaves frame right. |
| 15.16 | 2:29.1 · 2.8 s W | `drawSenateDais`: the sheet into the clone's hand; the senators lean in, turn it over on the paper curl and hold it up; the chairman nods. |
| 15.17 | 2:31.9 · 1.9 s ECU | `drawSheetBack`: CALLED IT. (BEFORE SUCRAM.) |
| 15.18 | 2:33.8 · 2 s MCU | `drawSenateMCU`: Sucram's stare, no blink; his brow knits once. |
| 16.01 | 2:35.8 · 8 s GFX | `drawTourPoster`: one held poster; every item on its sound (the strip on the paper whip, the three stamps, the post on its click); two passing cars' lights sweep the brick, one each way (a one-step band: the hold's life). |
| 17.01 | 2:43.8 · 6 s W | `drawRooftopWide` + `drawQuoteBox`: the statement typing; the signers swap on the pen sounds (SIMED with his chess piece, NOTNIH, both unplated), Mas in one stroke on the pen run, Mario writing. |
| 17.02 | 2:49.8 · 10.4 s 2S | `drawRooftop2S`: Mario writes (two held drawings), the footnote growing on each scribble, his finger up on "So I'm adding a footnote"; Mas's hand out after the first line and held out; both lip-synced. |
| 17.03 (+17.04) | 3:00.2 · 2 s W | `drawRooftopWide`: the register rolls in (its casters' two drawings); the freeze (a curve re-set for the open sky, Mas kept in colour) and the NESNEJ card. |
| 17.05 | 3:02.3 · 3.7 s 2S | `drawRooftop2S`: both turned to the register, the pen still in Mario's hand, Mas's still half out; Mario lip-synced; the card rides on. |
| 17.06 | 3:05.9 · 3 s OTS | `drawRooftopOTS`: NESNEJ at the register (lip-synced, his grin at rest, blinking). |
| 17.07 (+17.08, 17.09) | 3:09.0 · 3.6 s ECU | `drawKeyECU` (the press lands on KA-CHING) · `ledgerPrint` (12 f) · `drawRegisterWindow` (the figure pops in, then a glint crosses the brass). |
| 17.10 | 3:12.6 · 2.5 s ECU | `drawPurchaseOrder`: its two rows print in on the lock's text time; a glint across the header. |
| 17.11 | 3:15.1 · 4.4 s W | `drawRooftopWide`: the crack runs L → R in 12 frames; Nesnej, then Mario (who writes it down), then Mas look up; then Mas alone to his glass. |
| 17.12 | 3:19.5 · 4.5 s ECU | `drawGlassCrack`: the reflected crack's three further steps; then the still water held while the bell decays. |
| 17.13 | 3:24.0 · 0.75 s | Black. |

## 3. Art: reused and new

### 3.1 New: RADNUS at bust size (`act2/art/radnus-bust.ts`)

- **Why:** art-b built a stand-in bust (a blazer on the civic kit, a long face, light hair), and RADNUS is in two two-shots and the pan.
- **What it is:** a new additive module, namespaced to this segment. It edits nothing, and `cast/radnus-standin.ts` stays for anyone else.
  - It's built on the civic kit (the shared skull, the six mouths, the three lids) to art-a's room sprite: art-a's own ramps (the brown skin, the dark hair, the bright navy sweater, the pale collar).
  - A slim knit V-neck (no lapels), the pale open collar lying over it, short neat dark hair with a side part, the serene closed half-smile.
  - Arms: `fold` (the hands folded at the table's edge), `write` (a pen in two held drawings), `pat` (the far hand at the collar), `lean`, and `none` (the pan). `up` rolls the eyes to the ceiling camera.
  - `drawExtinguisherSmall`: his extinguisher at the table's scale, in art-a's off-brand primaries, stood on the table like a water bottle.
- **The flame** on his collar is art-b's `drawBigFlame` at `RADNUS2_COLLAR`.

### 3.2 Re-laid in the layout (the art's own code, not changed)

- **The row's pan (13.07):** `drawClassRow` bakes the stand-in bust into its cached plate, so the layout builds the same long plate with the new bust.
- **CLASS PHOTO #1 (13.14):** `drawClassPhoto` prints a fixed state (NEDIB mid-stride at t 0.45). The layout prints this cut's flash frame instead, so the print matches the frame the viewer just saw. The print, the border, the sheen and the hand are the art's drawing, with an offset added for the slide-in and the drift.

### 3.3 The cards and the freeze

- **The gag cards** (`kit2.drawGagCard`) are the show's name card: nameCard's timing and its stat chip, as Act One's TASYA card and Act Four's cards type on. They're text only, and each is placed in its shot's empty corner so it never covers the face it names: SIRRAH and NEDIB top left, SUCRAM and NESNEJ top right.
- **Plates are names only:** `LAHTNEMULB`.
- **The 2-tone freeze keeps Mas in colour**, the palette's own rule, through a keep-mask drawn from his own sprite or bust.
- **Re-curved sets:** the White House and the rooftop print through re-curved sets (`FREEZE_BRIGHT` is art-a's APEC recipe; `FREEZE_SKY` is higher, for the open sky), because the stock curve prints a bright room almost all cream. The Senate two-shot uses the stock set.

### 3.4 Reused as it is

Everything else is art-b's, called with its own states:
- the White House (the wide, the 2S, the OTS, the Sirrah MCU, the collar insert);
- the bridge (all four setups);
- the Senate (the wide, the dais, both 2Ss, the OTS, the MCU);
- the senate props;
- the tour poster;
- the rooftop (the wide, the 2S, the OTS, the glass);
- the register (the key, the ledger print, the window, the purchase order);
- the cast busts and room sprites.

Mas, Mario and Tasya are the existing portraits and sprites. Nothing in `shared/pixel/` was edited.

### 3.5 Stand-ins

None. The art's own flagged stand-in, the RADNUS bust, isn't used here.

## 4. Checks

| Check | Result |
|---|---|
| `node r-act2.cjs check` | 43 layouts, **0 stand-ins**, 0 problems. The track is 4,914 frames, as the segment. |
| `tsc` (a scratch tsconfig over `act2/shots.ts` and `act3/shots.ts` and everything they import) | prints nothing |
| **Photosensitivity** (every native frame, measured): relative luminance and saturated-red share in a 3 × 3 grid and the whole frame. A transition is a swing of ≥ 0.10 relative luminance with the darker side under 0.80, or ≥ 20 % of a region's area to or from saturated red. A flash is a pair of opposing transitions. | **Worst: 3 transitions (1 flash) in any 1 s; red: 0.** Passes the limit of no more than 3 flashes a second. The White House flash (13.12) is one white step, and the LEDGER print (17.08) is one up-and-down. |
| **Dead frames** (the longest run of identical consecutive frames per shot, measured on the same pass) | Every talk hold has blinks, mouths, props or light moving: 13.05 3 f, 13.09 3 f, 17.02 4 f, 13.14 6 f. The long runs left are deliberate or small: the still water in the glass (17.12, 46 f: "the water doesn't move"), 15.07's listening dais before "jobs" (40 f), 17.11 after he looks down (34 f), the black cards, and Mas's lens look (13.07, 30 f). |
| **V.O. frames** | Mas's mouth is shut on every V.O. frame. The host applies a layout's `face` to his V.O. lines too, so the layouts read his mouth through `kit2.spoken()`, which shuts it under the inner voice. Checked on stills of 13.09. |
| Rows 182–203 under the V.O. | 13.01, 13.09 and 13.11 type the V.O. over the carpet or the table's dark folio; nothing must-read sits there. |

**The measuring tools** (scratch, may not last): `scratchpad/v3-shots-act2-act3/tools/audit.ts` (per-frame luminance, red share and hashes, from `frame.ts` `native`) and `tools/analyze.py` (the flash count and the still runs). The reports are `audit-act2-report.json` and `audit-act3-report.json`.

## 5. Render

From `studio/`, with `S` your scratch folder:

```sh
node src/episodes/ep01/pixel/tools/build.mjs act2 $S/r-act2.cjs
node $S/r-act2.cjs check
node $S/r-act2.cjs contact ../out/ep01/full-v3/picture/act2-sheet.png native
SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act2.cjs picture --jobs 2    # -> out/ep01/full-v3/picture/act2.mp4 (+ .srt, .render.json)
```

Act Two returns no GLYPH layers, so it needs no Remotion bundle.

## 6. What I changed after looking

- The freezes printed the White House almost all cream, so they now use the re-curved sets (§3.3).
- Mas's lips moved on his V.O., so his mouth is now read through `spoken()`.
- Long still holds got small life:
  - the print drifts in his hand;
  - the chairman blinks and looks;
  - Sucram goes back to his phone, and the moth lands and lifts;
  - the chairman nods under the held-up sheet;
  - two headlights cross the poster's wall;
  - a glint crosses the register's brass;
  - the purchase order's rows print in on their time.
- Each gag card went to the corner that doesn't cover its face.

## 7. What's weakest (to my eye, from stills)

1. **The White House wides:** everyone is about 80 px under a big wall, so the heads turning in 13.11 are 1–2 px moves at 1×. The turn reads from the backs of the heads more than from motion.
2. **The collar insert (13.10):** the art's flat planes and its paddle of a patting hand (art-b lists it too). It sits in art-a's navy and pale collar, but it isn't the new bust's drawing.
3. **The new RADNUS bust** is a civic-kit face, like the other Act Two busts. It reads calm and neat, but the key light's big shadow plane makes him look gaunter than the round-faced room sprite.
4. **The 17.04 freeze on the rooftop:** even re-curved, the open sky is the half screen, so the frame reads as a print more than as the rooftop.
5. **Two must-reads share the screen** in 13.01 (the V.O. and the rail). That's the lock's timing, left for the lead.
6. **The class photo's sheen and drift are 1-px moves.** Whether they read as a hand or as nothing needs a person to watch.

---

## 8. v3.1: the v3.1 lock (script draft 7)

**The brief** (the lead, 2026-09-27; the showrunner wants a fully finalized version):
- re-lock on `show/reel/ep01-v31/ep01-v31-act2.json`;
- update every new, changed and moved beat;
- use art-b's v3.1 art ([art/art-b.md §6](art/art-b.md));
- face lights where the mood analysis asks;
- `cleanUnder` on MCUs that dither skin;
- keep the v3 fixes;
- re-render;
- the flash check.

### 8.1 The lock

```sh
# the temp track: Act Two's chapter of the v3.1 stick reel (out/ep01/reel/ep01-v31-stick.mp4, 399.125 s -> 600.375 s),
# decoded with the bundled ffmpeg, trimmed to 4,830 frames x 2,000 samples, 48 kHz 24-bit
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act2 --timeline show/reel/ep01-v31/ep01-v31-act2.json \
    --takes audio/ep01/act2/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act2/lines-v3.json \
    --takes audio/ep01/v31/act2/lines-v31.json --mix out/ep01/full-v3/picture/act2-v31-stick-mix.wav --mix-offset 0
```

- **Result:** 40 shots from 47 beats, 4,830 frames (3:21.25). 41 lines, every one with a take. Every check is `ok`.
- **The lock's notes, kept:** the V.O. shares the screen with a rail in 13.01 (the rail now clears at 2.6 s, as the timeline has it) and in 14.01 (`MAY 12, 2023` under "her mouth is a beat late."). Both are the timeline's timing.

### 8.2 What changed, shot by shot

| Shot | v3.1 |
|---|---|
| 13.01 | **Radnus mouths his sentence silently from the first frame:** three-second phrases with a breath between. The new V.O. (v31-vo-01, "mouthing the same sentence since we sat down") names it. |
| 13.06 | 3.3 s: the tripods pop in faster, and the photographer's line starts at 0.6 s. The layout reads the three thunks, so nothing else changed. |
| 13.13 | "Longer." is split off (v31-a2-0001 / -0002). The scroll comes out word by word; the whole scroll is out after "…put it in writing."; NEDIB looks down at it, approving, brow up, and then says "Longer." |
| 13.14 | **The match cut.** The print is at the art's `CLASS_PHOTO_MATCH` geometry (centred where the phone will be), held at its left edge by the same finger pads as the phone (`holdFingers`). It's still this cut's own flash frame, now **without the tripods and the photographer in it** (they took the photo; the v3 print wrongly showed them). It settles 12 frames before the cut, and the v3 dip is gone: a hard cut. |
| 14.01 | 6.6 s. `drawBridgeOTS {feed, hearts}`: his own CLASS PHOTO #1 post, the hearts climbing. On the label's end his thumb scrolls to the clip in whole-pixel held steps; then the clip, her mouth late, under his V.O. (v31-vo-02). |
| 14.02 | cut |
| 15.02 | The chairman's real line ("That voice was not mine. The words were not mine.", room-scale mouth). The red light moves from the clone's mic to his; the v3 nodding along is gone. |
| 15.17, 15.18 | cut |
| 16.01 | 5 s. The two headlight sweeps are re-timed as fractions of the shot. |
| 17.11 | The crack is jagged and white now (art-b's `drawCrack`; the layout is unchanged). |
| 17.12 | `drawGlassSide`: the glass side-on at table height; the refracted crack runs on in three held steps and bends across his reflection. |
| unchanged (retimed by the lock only) | 13.02, 13.05, 13.07–13.11, 14.03–14.06, 15.01, 15.03–15.16, 17.01–17.10, 17.13 |

### 8.3 Face lights, `cleanUnder`, and the v3 fixes

- **Face lights:** the mood analysis (§4 #4) and the draft 7 notes list none in Act Two.
- **`cleanUnder`:** it exists only on art-a's `drawLaunchMcuMas` (Act One). None of Act Two's MCUs dithers skin, so there was nothing to set.
- **The v3 fixes, kept:**
  - Mas's mouth stays shut on every V.O. (`kit2.spoken`).
  - The gag cards sit in empty corners.
  - The freezes keep Mas in colour.
  - The new RADNUS bust is used.

### 8.4 Checks (v3.1)

| Check | Result |
|---|---|
| `node r-act2.cjs check` | 40 layouts, 0 stand-ins, 0 problems; the track is 4,830 frames |
| `tsc` (both segments and everything they import) | prints nothing |
| **Flash check** (every native frame, the §4 method) | **Worst: 3 transitions (1 flash) in any second; red: 0. Passes.** |
| Longest still runs | 17.12 46 f (the still water, deliberate), 15.07 40 f, 17.11 34 f, 13.07 30 f (the lens look), 15.14 30 f. Every talk hold has something moving. |
| Looked at | the contact sheet (`act2-sheet.png`) and about 20 sampled frames: 13.01, 13.13, both sides of the match cut, the feed, the scroll and the V.O. in 14.01, 15.02, 16.01, 17.12 |

**Render** (from `studio/`): `node src/episodes/ep01/pixel/tools/build.mjs act2 $S/r-act2.cjs`, then `node $S/r-act2.cjs check`, then `SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act2.cjs picture --jobs 2`.

### 8.5 Weakest in v3.1 (to my eye, from stills)

1. **The match cut is a match of centres, not of hands.** The print's left edge (and the fingers on it) sits about 100 px left of the phone's, because the print is 332 px wide and the phone 118. That's the art's geometry, followed as it is. Whether the cut reads as "the print became the phone" needs a person to watch it.
2. **13.13's look down at the scroll** is a 1-px iris move plus a brow. It may not read at 1×.
3. The v3 list (§7) still stands: the small White House wides, the collar insert, the rooftop freeze.

## 9. v3.2: the v3.2 lock (script draft 8.1)

**The brief** (the lead, 2026-09-28; SHOWRUNNER-NOTES 00 and 0, "Mas needs agency"; the calibration ledger, `show/bible/calibration.md`):
- re-lock on `show/reel/ep01-v32/ep01-v32-act2.json`;
- update the shots with art-b's v3.2 art ([art/art-b.md §7](art/art-b.md));
- his moves must read on screen: in Act Two, **the seat, proposing the agency and the stamp**;
- first-appearance plates carry one relation word;
- keep the v3.1 fixes;
- re-render;
- the flash check.

### 9.1 The lock

```sh
# the temp track: Act Two's chapter of the v3.2 stick reel (out/ep01/reel/ep01-v32-stick.mp4, from reel frame 9,394),
# decoded with the bundled ffmpeg, trimmed to 4,633 frames x 2,000 samples, 48 kHz 24-bit
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act2 --timeline show/reel/ep01-v32/ep01-v32-act2.json \
    --takes audio/ep01/act2/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act2/lines-v3.json \
    --takes audio/ep01/v31/act2/lines-v31.json --takes audio/ep01/v32/act2/lines-v32.json \
    --mix out/ep01/full-v3/picture/act2-v32-stick-mix.wav --mix-offset 0
```

- **Result:** 39 shots from 46 beats, 4,633 frames (3:13.04). 38 lines, every one with a take. Every check is `ok`.
- **Act Two has no V.O. now** (draft 8.1: he performs in public here). `kit2.spoken` still guards his mouth.

### 9.2 What changed, shot by shot

| Shot | v3.2 |
|---|---|
| 13.01 | **His move: the seat.** `drawWHWide {settle, masGlass}`. Mas is already seated nearest Sirrah, his own glass set down square in front of him. Radnus is half-risen and Mario is still arriving, and both settle into their seats over the first 2.7 s. Radnus's silent mouthing and Mario's finger are kept from v3.1. The V.O. that named the mouthing is cut, and so is its mark. |
| 13.09 | The V.O. is cut. After Radnus's courtesy ends, Mas's eyes drop off him for a beat, starting 4 f later. They come back for "how's the dancing?". |
| 13.10 | `drawRadnusFlameMCU` with this pass's RADNUS bust (`radnusBust2` with `RADNUS2_COLLAR`): his face and the flame together, replacing the collar ECU. The flame goes up one size on the whoomph. From "We're being thoughtful." (O.S.), his hand pats at it every 6 frames; his mouth stays shut and he blinks once. |
| 14.01 | `drawBridgeOTS {scrub, tagBig}`. The ALTERED AUDIO tag is drawn to read. **His move:** his thumb drags the clip back (two drawings), and the clip plays again, late again. The V.O. is cut. |
| 14.03 | `drawLitWindow {repost}`, with 14.04 folded in: the thumb presses, then ✓ REPOSTED on the click. |
| 14.04 | cut (folded into 14.03) |
| 15.02 | The plate reads `LAHTNEMULB · CHAIRMAN`. |
| 15.10 | The moved question: "Is there anything you'd like this committee to do?" (e1-a2-15-15). The red light and the room-scale mouth are on it. |
| 15.15 | **His move: the proposal.** It opens on 15.07's OTS, from behind him onto the dais, with the chairman blinking, for "i would form a new agency…" (his own testimony). On "licenses", it cuts to the HIGH. His hand slides `PLEASE REGULATE ME` across in held steps as he goes on (the OTS drifts in 1 px every 10 f before the cut). Sucram's stamp comes down mid-slide, and the sheet leaves frame as his line ends, so there's no empty table under him. |
| 15.16 | caption only (every senator wants to sign it) |
| 15.11 | The moved question ("Would you come and run it?") now opens the shot. Under it, Sucram glances down and Mas blinks; his "i love my current job." and the pocket on "money" are kept. |
| 16.01 | **His moves.** His thumb on his phone in the frame's corner posts the walk-back, and the post pops over the poster; UN-CANCELLED follows. Then his own hand comes in with a rubber stamp and stamps `ADDED DUE TO POPULAR DEMAND` on its mark: in for 8 f, the stamp for 4 f, out for 8 f. |
| 17.12 | `drawGlassSide {surface}`: his face on the water's surface. The reflected crack runs across it in held steps and breaks it under the eyes. |
| unchanged (retimed by the lock only) | 13.02, 13.05–13.08, 13.11, 13.13, 13.14, 14.05, 14.06, 15.01, 15.03–15.07, 15.12–15.14, 17.01–17.11, 17.13 |

### 9.3 Kept from v3.1

- **Mouths:** Mas's mouth never moves on a V.O. There are none in Act Two now, and the guard stays.
- **The match cut** (13.14): the print is at the phone's geometry, with no tripods and no dip.
- **The rest:**
  - the rail clears at 2.6 s (the timeline's);
  - the gag cards sit in empty corners;
  - the freezes keep Mas in colour;
  - the RADNUS bust is used in every medium and close shot (13.07, 13.09, 13.10).
- **Face lights and `cleanUnder`:** the v3.2 notes ask for none in Act Two. `cleanUnder` still exists only on Act One's MCU.

### 9.4 Checks (v3.2)

| Check | Result |
|---|---|
| `node r-act2.cjs check` | 39 layouts for 39 shots, 0 stand-ins, 0 notes, 0 problems; the track is 4,633 frames |
| `tsc` (both segments and everything they import) | prints nothing |
| **Flash check** (every native frame, the §4 method) | **Worst: 3 transitions (1 flash) in any second; red: 0. Passes.** |
| Longest still runs | 17.12 46 f (the still water, deliberate), 15.07 40 f, 17.11 34 f, 14.06 32 f (the black match cut), 13.07 30 f (the lens look), 15.15 30 f. The first audit found two holds that didn't change: 15.15's OTS, still for 60 f under his proposal, and the head of 15.11, still for 59 f now that the moved question opens it. The OTS now drifts in by whole pixels (1 px every 10 f), with the chairman and the clone blinking. In 15.11, Sucram glances down and Mas blinks under the question. Both were re-rendered. |
| Looked at | about 30 sampled native frames: 13.01's settle, 13.09's look away, 13.10 (the pat on and off), 14.01's scrub, 14.03's repost, 15.02's plate, 15.10, 15.15 (the OTS, the slide, the stamp, the exit), 16.01 (the phone, the hand in, the stamp, after), and 17.12; plus the contact sheet |

**The picture:** `out/ep01/full-v3/picture/act2.mp4`: 1920 × 1080, 24 fps, H.264 + AAC, **3:13.04, 4,633 frames**, 14.9 MB, rendered in 26 s on 2 workers. It's muxed with the v3.2 stick mix (`act2-v32-stick-mix.wav`). Beside it: `act2.srt`, `act2.mp4.render.json` and `act2-sheet.png`.

**Render** (from `studio/`): `node src/episodes/ep01/pixel/tools/build.mjs act2 $S/r-act2.cjs`, then `node $S/r-act2.cjs check`, then `SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act2.cjs picture --jobs 2`.

### 9.5 Weakest in v3.2 (to my eye, from stills)

1. **13.10 is a single at the two-shot's bust size, not a true MCU.** The art sets the bust at native size (X 250, Y 22), and the flame grows from 9 to 14 px. It reads as his face with a small flame.
2. **For the sound pass:** 15.15's stick SFX sit before the cut on "licenses" (k 68): `folder_slide` is at k 8 and `rubber_stamp_C` at k 40. In the picture, the slide's first step lands at k 78 and the stamp comes down at k 110.
3. **16.01:** the walk-back post and his stamping arm overlap for a few frames. The card stays up until UN-CANCELLED plus 16 f.
4. **13.01's settle** is small at the wide's scale, where the figures are about 20 px tall. Whether "he's already in the seat" reads needs a person to watch it.
5. **17.12's face on the water** is small, as the art notes. If it doesn't read in motion, the art's fallback is the cut.

## 10. v3.3: the v3.3 lock (script draft 8.2, a polish)

**The brief** (the coordinator, 2026-09-28; [PLAN.md](PLAN.md) §6, binding; [script-v33-notes.md](script-v33-notes.md) §2, §3.1, §3.3; [lock-v33.md](lock-v33.md)):
- re-lock on `show/reel/ep01-v33/ep01-v33-act2.json` (committed a756708);
- the changes:
  - **V2** (13.09): his lips stay still on the restored V.O.;
  - **P6** (14.01): the clip is unmistakably a generic news anchor at a desk, with a blank lower third; it is not the senator, and no real person is drawn;
  - **P7** (17.10): the order is in Mario's hand, held 0.5 s longer;
  - **P8** (17.11–17.13): the glass is cut, and the act ends on the chip-maker's line climbing off the frame;
  - **P14:** plates of at most two parts;
- small art goes in the existing modules, in art-b's conventions;
- render through `ops/heavy.sh`;
- run `flashcheck.py`;
- the segment must build from the EL lock too;
- delete scratch.

### 10.1 The lock

No stick reel was rendered for v3.3 (disk). The temp track is the reel's own mixer run on the lock pass's render plan, through `ops/heavy.sh` (9.7 s; −16.6 LUFS, 0 missing). The command, from `studio/`, is `node src/reel/tools/mixer.mjs out/reel-work/ep01-v33-stick/plan.json <scratch>/ep01-v33-mix.wav --work <scratch>`. Act Two's chapter was sliced from reel frame 9,414 for 4,573 frames × 2,000 samples into `out/ep01/full-v3/picture/act2-v33-stick-mix.wav`. The full mix was then deleted.

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act2 --timeline show/reel/ep01-v33/ep01-v33-act2.json \
    --takes audio/ep01/act2/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act2/lines-v3.json \
    --takes audio/ep01/v31/act2/lines-v31.json --takes audio/ep01/v32/act2/lines-v32.json \
    --mix out/ep01/full-v3/picture/act2-v33-stick-mix.wav --mix-offset 0
```

- **Result:** 38 shots from 45 beats, 4,573 frames (3:10.54). 39 lines, one of them V.O. ("he's not wrong."), every one with a take. Every check is `ok`.

### 10.2 What changed, shot by shot

| Shot | v3.3 |
|---|---|
| 13.09 | **V2:** "he's not wrong." (V.O., v3-vo-12) is back between the courtesy and the knife. His eyes leave Radnus as the courtesy ends (a new `thought` mark on the V.O.'s start caps it) and stay off through the thought, with his mouth shut (`spoken`). They come back 4 f before "how's the dancing?". |
| 14.01 | **P6, as the script notes decided (§3.1): not the senator.** `drawBridgeOTS {anchorDesk}`: the clip is a generic news anchor seated behind a desk.<br>- **The set:** two lit panels and a deep blue wall.<br>- **The desk:** glossy, with a lit front edge and a sheet of copy under her hands.<br>- **The lower third:** blank (a red accent tab and a pale band, no words, no ticker).<br>- **Unchanged:** the anchor sprite (invented, dark hair, slate blazer), her late mouth and the scrub are as before. Nobody real is drawn. |
| 17.10 | **P7:** `drawPurchaseOrder {mario}`, 3.0 s (the lock's +0.5).<br>- **His hand:** Mario's ink-blue fleece sleeve (ribbed cuff, soft folds, the nap) runs up and out of frame at the lower left.<br>- **His footnote:** a short ink line on the order, its glint stepping along the last strokes (still wet).<br>- **His appendix:** the scroll's rolled end lies at the frame's right edge.<br>- **Mas:** his hand is half out beside it, open and empty, in his grey sleeve. |
| 17.11 | **P8, the act-out** (the crack is gone with the glass). `drawRooftopWide {chipLine}`:<br>- The register's figure lifts off its flag window as a line. It's the intro's curve: a white core, the cyan glow and a spark at its head, flat and then straight up.<br>- The line climbs in 2-frame held steps behind Nesnej, and its head is off the top of the frame by 40 % of the shot. Its tail follows it out by 52 %.<br>- Nesnej looks up first, then Mario (who writes it down), then Mas, last.<br>- Then the frame tilts up in held steps (3 px every 2 f, to 36 px) and holds about 1 s on the empty sky. |
| 17.12 | cut (the glass) |
| 17.13 | unchanged: the black on the bell's tail. Act Three's room leading 0.6 s under it is a sound (lock-v33 §3). |
| unchanged (retimed by the lock only) | everything else |

**The new art** is small, opt-in and drawn in the existing modules, in art-b's conventions:
- `rooms/bay-bridge.ts`: `drawNewsClip {desk}`, `drawBridgeOTS {anchorDesk}`;
- `kits/register.ts`: `drawPurchaseOrder {mario}`;
- `rooms/rooftop.ts`: `drawChipLine`, `drawRooftopWide {chipLine}`.

Each module's header notes its v3.3 lines, and nothing that was there changed when the option is off.

### 10.3 Plates (P14)

Act Two has no three-part plate. `LAHTNEMULB · CHAIRMAN` is its one first-appearance plate. The gag cards (Sirrah, Nedib, Sucram, Nesnej) are unchanged, as the script notes keep them.

### 10.4 Checks (v3.3)

| Check | Result |
|---|---|
| `node r-act2.cjs check` | 38 layouts for 38 shots, 0 stand-ins, 0 notes, 0 problems; 4,573 frames |
| `tsc` (both segments and everything they import) | prints nothing |
| **The EL lock** | `show/reel/ep01-v33-el/ep01-v33-el-act2.json`, locked into scratch (lock.py `--out-ts`), then built with the assembly's `build_el.mjs` redirect and checked.<br>- **Result:** 38 layouts for 38 shots, 4,340 frames, 0 stand-ins, 0 problems; the only note is the missing temp track.<br>- **Caveat:** the test lock used the Kokoro takes, so its one take-bounds check failed (e1-a2-13-01). The assembly pass's EL takes (`el_takes.py --lock v33`) will carry the real ones. |
| **Flash check** (`coldopen/tools/flashcheck.py`) | **Worst: 1 flash in any second; red 0. Passes.** The largest mean-luminance step is 0.277 at frame 4,377 (the cut to the order). This pass's own per-frame audit agrees: 1 flash worst, red 0. |
| Longest still runs | 15.07 40 f, 14.06 32 f (the black match cut), 13.07 30 f, 15.15 30 f, 17.01 26 f, 17.11 25 f (the empty sky's hold, deliberate) |
| Looked at | about 25 native stills (13.09 on the V.O. and on the knife; 14.01's anchor at 4×; 17.10; 17.11 at each step of the line and at the tilt) and the contact sheet |

**The picture:** `out/ep01/full-v3/picture/act2.mp4`: 1920 × 1080, 24 fps, H.264 + AAC, **3:10.54, 4,573 frames**, 14.7 MB, rendered in 26 s on 2 workers. It's muxed with the v3.3 temp track (`act2-v33-stick-mix.wav`). Beside it: `act2.srt`, `act2.mp4.render.json` and `act2-sheet.png`.

**Disk:** the v3, v3.1 and v3.2 temp slices (`act2-*stick-mix.wav`, git-ignored, this pass's own) were deleted, and so was this pass's scratch.

### 10.5 Weakest in v3.3, and what I judged

1. **17.11's line is compact.** It rises at the frame's right edge, where the register stands, so its flat run is short before it turns up. Whether it reads as the intro's curve (the act's out) rather than a stock chart needs a person to watch it (the script notes, §8 item 7).
2. **14.01's anchor is small on the phone** (the clip is 112 px wide). The desk and the blank bar carry "anchor" at 1×.
3. **17.10: Mas's empty hand** is a plain drawing (a flat open hand). Mario's sleeve carries the beat.

### 10.6 v3.3.1: the micro-pass (audit-v33 §1, §3 #2, §6 #4; frames unchanged)

- **17.11, the act-out:**
  - **The line** is now a 2 × 2 white core on every path pixel inside a 1 px cyan glow, 4 px across, with a 4 × 4 spark at its head. It reads at 1080p.
  - **Composer X's timing is kept:** the lift at frame 6, the head out at 40 % (k 42), the tail out at 52 % (k 55).
  - **Mas's beat is his, and last.** In the wide his eyes stay down on the table while Nesnej and then Mario look up. Three frames after the tail leaves, it cuts in to `rooms/rooftop drawRooftopMasUp` [MCU], new and opt-in: him alone against the sky, facing where the line went. His eyes are level for 6 f, then turn up in one swapped drawing (the irises high under a lifted lid, the brows up, his face a light step up, keyed from above). He holds it 18 f (0.75 s), with no voice.
  - **Then** it's back on the wide, him looking up now. The tilt steps 6 px every 2 f to 36 px, then holds 0.5 s on the empty sky.
- **Checks:**
  - **Kokoro:** `check` 38 / 38, 4,573 frames, and `tsc` is clean.
  - **EL:** it builds and checks on the assembly's `el-v33` lock, 38 layouts, 4,340 frames, 0 stand-ins, 0 notes, 0 problems.
  - **Flash:** `flashcheck.py` finds at worst 1 flash in any second, red 0; it passes.
  - **The picture:** `out/ep01/full-v3/picture/act2.mp4`, 4,573 frames (3:10.54), 14.7 MB, 28 s on 2 workers, with its .srt and contact sheet re-written.
- **For a person:** whether the cut-in reads as his beat (him looking after the price) or as a reaction insert.

## 11. v3.4: the v3.4 lock (script draft 8.3; SHOWRUNNER-NOTES 000, the planner, hinted)

**The brief** (the coordinator, 2026-09-28): re-lock on `show/reel/ep01-v34/ep01-v34-act2.json` (commit 4309e86) and update the shots for its changes. Don't draw V.O. text: the shared `frame.ts voLine` fix types it fast enough to finish with the voice. Render through `ops/heavy.sh`, run the flash check, and build on the EL lock (`show/reel/ep01-v34-el/`).

### 11.1 The lock

The temp track is the reel mixer on `out/reel-work/ep01-v34-stick/plan.json` (7.8 s; −16.65 LUFS, 0 missing). Act Two's chapter was sliced from reel frame 9,581 into `out/ep01/full-v3/picture/act2-v34-stick-mix.wav`. The lock adds `--takes audio/ep01/v34/act2/lines-v34.json` to the v3.3 command (§10.1).

- **Result:** 36 shots from 43 beats, **4,349 frames (3:01.21)**. 38 lines, one of them V.O. ("mine's half written."). Every check is `ok`.

### 11.2 What changed

| Shot | v3.4 |
|---|---|
| 13.02 | Sirrah's line is cut. Her mouth rests at its smile (the shot's `face` is gone), and the pointer lands on A, then on I at the freeze. |
| 13.09 | "he's not wrong." is cut. His eyes still leave Radnus for a beat after the courtesy and come back for the knife. |
| 13.11 / 13.13 | Nedib's card keeps his name and the shutter; its `DEEPFAKES OF ME` stat row is gone. |
| 13.13 | **The new V.O., "mine's half written."** (v34-vo-04, answering "put it in writing"), comes with a new insert, `act2/art/half-written.ts drawHalfWrittenECU` [ECU]:<br>- **The page:** a folded sheet tucked in his hoodie's front pocket, its top panel showing PLEASE and, under it, REG. These are Act One's own pen glyphs, redrawn at 2×; the fold hides the rest.<br>- **The hand:** his hand rests on it, relaxed, four fingers across the pocket's hem. His thumb presses it a pixel further in on the line's last word.<br>- **No face,** so his lips are out of frame.<br>- **Timing:** 4 f before the V.O. until 3 f before "Longer.", then back on the OTS. |
| 13.14 | For the flash check (§11.3), the print slides in over 5 short held steps (60, 40, 24, 12 and 4 px, then settled) instead of 3 long ones. |
| 14.01 | The May 12 clip is cut. `drawBridgeOTS {noClip}`, new: his feed is his own CLASS PHOTO #1 post, its hearts climbing, with other people's items greyed under it. It holds to the black (14.06's voice). |
| 14.03, 14.05 | cut (the repost and the hailstone) |
| unchanged (retimed by the lock only) | the rest |

### 11.3 Checks

| Check | Result |
|---|---|
| `check` | 36 layouts for 36 shots, 0 stand-ins, 0 notes, 0 problems; 4,349 frames |
| `tsc` | prints nothing |
| **The EL lock** | `ep01-v34-el-act2.json`, locked into scratch and built with the assembly's `build_el.mjs` redirect: 36 layouts, **4,084 frames**, 0 stand-ins, 0 problems |
| **Flash check** (`flashcheck.py`) | **Worst: 1 flash in any second; red 0. Passes.** The first render measured 3 flashes (at the limit), at 13.14's slide-in: the bright print jumped 80 px at a time across the dark table. The shorter steps fixed it. |

**The picture:** `out/ep01/full-v3/picture/act2.mp4`, **4,349 frames (3:01.21)**, 1920 × 1080, 13.8 MB, 34 s on 2 workers. It's muxed with the v3.4 temp track. Beside it: `act2.srt`, `act2.mp4.render.json` and `act2-sheet.png`.

**For a person:** does 13.13's page read as his half-written ask, a payoff of Act One's PLEASE / REG, without spelling it out? The word is legible, and the line carries it.

## 12. v3.5: the v3.5 base lock (script draft 8.4, the final version)

**The brief** (the lead, 2026-09-28; [proposal-v35.md](proposal-v35.md) sc 25–30A, [script-v35-notes.md](script-v35-notes.md) §3, §5, §6, [lock-v35.md](lock-v35.md) §8, [PLAN.md](PLAN.md) §8): re-lock on `show/reel/ep01-v35/ep01-v35-act2.json` (5,074 frames). Nedib's card sets up `DEEPFAKES OF ME: SEEN 0`; the Senate without the clone, opening on a wide, Mas's own "i get paid enough for health insurance."; MAR 2019 (new, entered from his wallet hand on the intro's render front and left on the check, back to the hearing); the tour as his leverage game; the statement's signatures; every signer's pen an order. Render the Kokoro picture through `ops/heavy.sh`, run the flash check, and confirm it builds and checks on the EL-timed lock (`show/reel/ep01-v35-el/`).

### 12.1 The lock and the temp track

The temp track is the reel's own mixer on the v3.5 render plan (`studio/out/reel-work/ep01-v35-stick/plan.json`, through `ops/heavy.sh`, 9.5 s; −16.67 LUFS, 0 missing). Act Two's chapter is sliced sample-exact from plan frame 12,274 (the 72-frame slate included) for 5,074 frames into `out/ep01/full-v3/picture/act2-v35-stick-mix.wav`; the full mix was deleted. The script: `scratchpad/p-act23/mix35.sh` (it also cuts Act Three: frame 17,348 for 3,339).

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act2 --timeline show/reel/ep01-v35/ep01-v35-act2.json \
    --takes audio/ep01/act2/dialogue/lines-fast-v2.json --takes audio/ep01/v3/act2/lines-v3.json \
    --takes audio/ep01/v31/act2/lines-v31.json --takes audio/ep01/v32/act2/lines-v32.json \
    --takes audio/ep01/v34/act2/lines-v34.json --takes audio/ep01/v35/act2/lines-v35.json \
    --mix out/ep01/full-v3/picture/act2-v35-stick-mix.wav --mix-offset 0
```

- **Result:** 42 shots from 49 beats, **5,074 frames (3:31.42)**. 46 lines, one of them V.O. ("mine's half written."), every one with a take; every check `ok`.
- **The lock's read-floor notes:** Nedib's card (15 f in 13.11, rides on into 13.13, as before), Nesnej's card (as before), and v35-29.04's post (68 f against 104 f): handled in the picture (§12.3).

### 12.2 What changed, shot by shot (Kokoro frames; EL frames in §12.4)

| Shot | Frames | v3.5 |
|---|---|---|
| 13.11, 13.13 | 1169–1459 | Nedib's gag card has its stat row again: `DEEPFAKES OF ME: SEEN 0` (Act Three pays it: SEEN 1). |
| 14.01 | 1601–1745 | Over his shoulder at the window, his CLASS PHOTO #1 post, the hearts climbing; the reminder slides down over it in three held steps (`art/v35 phoneReminder`: the cold open's generic calendar card, `SENATE JUDICIARY` / `MAY 16 · TESTIFY`, no seal). Then 13.13's pocket insert again: he draws the folded page up out of the pocket (`PLEASE`, `REG` and the pen's dash where he stopped), holds it to read, lets it back down, and his hand rests on it. |
| v35-27.00 (new) | 1745–1836 | **The match:** the same page under the same resting hand at the same place in frame, now on the witness table's baize (`half-written {surface: baize}`); the gavel's knock lands on the cut. At 34 f a three-step tilt up (rows smeared) to the hearing room's wide, no clone, Sucram already typing. |
| 15.07, 15.10, 15.15 | | `rooms/senate {noClone}` (new, opt-in): the chairman alone; in 15.07 he reaches for his next card on "jobs" himself. |
| 15.16 | 2589–2656 | The sheet arrives in the **chairman's** hand; on the paper curl he holds it up and nods. |
| 15.13 | 2917–3019 | The wide: Mas holds the wallet up and says his own line (room-scale mouth); the gallery gasps after it. |
| 15.14 | 3019–3170 | After a held beat, `art/v35 drawWalletSet` [INSERT]: his hand sets the wallet down on the baize in three held steps and rests on it (the object for the 2019 match). |
| v35-28.01 (new) | 3170–3225 | **In, on the intro's render front** (shared `transitions.renderFront`, 12 f left to right, the white-hot core in the cyan glow, as dev/meras draws it): the wallet insert re-drawn as MAR 2019 in the T3 cut-paper tier, the same hand at the same place resting on a marker it has just set on the whiteboard's tray. The hand lifts off in two steps and leaves. `RAIL: MAR 2019` from the band. |
| v35-28.02 (new) | 3225–3556 | `office2019` [W]: NopeAI's first office by day, Act One's JUN 2018 room a year on (the same warehouse windows at back left, the same two INVIDIA racks, the whiteboard on wheels where the monitor wall stood; cut paper: flat shapes, a one-rung shadow down-right, three-tone figures with a cut edge, paper grain). Gerg's cloud bill unrolls from his hand to the floor and along it in held steps on his line; Mas at the board, Alyi and Mada at the table, the Quiet Vote's tall chair turned away. On Mas's line, `board2S` [2S]: the whiteboard large and legible, Mas (medium) writing with his arm to the marker's point, stepping along the board so it stays in reach and back to its edge when his marker is down (so each word he wrote is clear of him); Alyi at the table in the right foreground, lip-synced. The lower box side by side, the arrow down, `CAPPED PROFIT`; `100x` in the red marker; on "the board." two underlines under `NONPROFIT · THE BOARD`. |
| v35-28.03 (new) | 3556–3663 | `mada2S` [2S]: the board's lower box across the left half; Mada (medium, lip-sync) at the table, the Quiet Vote's office chair beside him, its back to us; Mas's sleeve from the frame's left edge draws the stick figure on "nothing." and writes `CEO · EQUITY: 0`; Mada's spinner turns over the answer and stops on "Good answer." |
| v35-28.04 (new) | 3663–3730 | `drawCheckDoor` [INSERT]: the landlord's first check slides in under the office door in three held steps: `MACROSOFT`, `$1,000,000,000` (display size), `JUL 2019`. |
| v35-28.05 (new) | 3730–3790 | **Out:** the render front sweeps back, right to left, from the check to a senator's hand and pen over a blank legal pad (hands only); the dais sits back, held (the senator who asked still lit); the chairman lifts his gavel; `drawGavelECU` [INSERT] the gavel comes down on its block on the knock (the passport's stamp takes the same stroke). |
| v35-29.01 (new) | 3790–3886 | `drawPassport` [INSERT]: his passport's visa pages, a slow push in; the rubber stamp comes down on each thunk (shadow, block, lift) and leaves its city: RIO DE JANEIRO · LAGOS · MADRID · WARSAW · PARIS · LONDON · MUNICH. After MADRID and after PARIS, `drawFlagHands` (8 f each): his page slides across a table to a hand under a desk flag (Spain's red and gold, France's three bands; no emblem, no face). |
| v35-29.02 (new) | 3886–4004 | `drawLectern` [M]: a lectern in a generic London hall (panelling, two tall windows, sconces, no crest), the audience's heads dark along the foot; Mas lip-synced, the one-pixel smile from "cease" on. |
| v35-29.03 (new) | 4004–4071 | `drawPhonePost` [POV]: his phone on a hotel desk, NOTERB's post in its own UI (kits/post-any, an initial avatar, no face), drawn at the UI's size and shown 2x: "There is no point in attempting blackmail…", MAY 25. |
| v35-29.04 (new) | 4071–4143 | The same phone: his words in the compose box, his thumb on Post, and his post goes up (kits/post-card, Mas Manalt). |
| v35-29.05 (new) | 4143–4176 | `drawGuestBook` [INSERT]: a guest book under a flag's draped, fringed corner (generic, no city); his pen signs; in the last 8 f the page gives way (ordered dither) to the one-sentence letter, his hand, pen and signature holding their place. |
| 17.01 | 4176–4332 | `drawLetterDesk` [INSERT]: the letter on many desks: his signature in place (the match), his hand leaving; the statement types across the top (`drawQuoteBox`) and holds; the signatories' list lands (MAS MANALT · MARIO · SIMED · NOTNIH · OIGNEB, a grey affiliation under each) and scrolls slowly; the desks swap with the signers: SIMED's pale maple and a chess knight, a navy sleeve signing on the first scribble; NOTNIH's desk dark but for one pool of light from above, a dark sleeve on the second; `+ HUNDREDS MORE` at the list's foot. Then the rooftop wide: Mas signs in one stroke (pen_run), Mario writes, the quote held over the sky. |
| 17.10 | 4878–4950 | `drawOtherOrders`: two more signers' hands at the frame's edges, each with its own order, round Mario's; Mas's hand stays empty. |
| cut | | 14.06, 15.01–15.03 (the clone), 16.01 (the tour poster) |
| unchanged (retimed by the lock only) | | the rest |

**The new art** is additive: `act2/art/v35.ts` (new; the T3 cut-paper recipe restated from Act One's `act1/art/v35.ts` so the two passes don't share a file in flight), `act2/art/half-written.ts` (opt-in `lift`, `dash`, `surface: 'baize'`; `drawRestingHand` and `penWord` exported; 13.13 draws exactly as before), `rooms/senate.ts` (opt-in `noClone` on the wide, the dais and the OTS; nothing changes when it's off).

### 12.3 The read-floor items (lock-v35 §8.3)

- **"no plans to leave"** (v35-29.04, 2.8 s against 4.3 s): the on-screen post is trimmed with the print ellipsis to its last clause, **"…and of course have no plans to leave."** (the record's own words, 38 characters, ≈2.2 s at the floor), at 2x on the phone. The rail carries MAY 26.
- **NOTERB's post** (v35-29.03): the name without a handle and the quote at 2x, whole from 0.2 s: 2.6 s against its ≈2.4 s floor.
- **MUNICH** (the last stamp, 0.7 s): it lands alone in the page's lower right with nothing else moving (the push is done), in the same large type as the others, and the gavel-to-stamp rhythm has taught the eye where the next one lands. 0.7 s is over the text floor for six letters (0.55 s); the name-card floor (1.2 s) isn't met, by the lock's timing.

### 12.4 Checks (v3.5)

| Check | Result |
|---|---|
| `check` | 42 layouts for 42 shots, 0 stand-ins, 0 notes, 0 problems; 5,074 frames. The cut shots' layouts (14.06, 15.01–15.03, 16.01) are removed. |
| `tsc` (a scratch tsconfig over `act2/shots.ts` and `act3/shots.ts` and everything they import) | prints nothing |
| **The EL lock** | `show/reel/ep01-v35-el/ep01-v35-el-act2.json`, locked into scratch (lock.py `--out-json/--out-ts`, the Kokoro takes then the EL `lines-A.json` over them, so the EL files' lengths pass the take-bounds check), built with the assembly's `build_el.mjs` (`ELDIR=` scratch) and checked: **42 layouts, 4,848 frames, 0 stand-ins, 0 problems**; its contact sheet drew every shot with no layout throwing. The EL takes carry no mouth tracks yet (the assembly's `el_takes.py --lock v35` makes them), so that test build's mouths flap. |
| **Flash check** (`coldopen/tools/flashcheck.py`) | **Worst: 1 flash in any second (frame 149, Sirrah's freeze, as before); red 0. Passes.** The first render measured 3 (at the limit): the check stepping 44 px at a time across the frame's blocks under the door (3663) and the Senate's smeared tilt (1779–1781). The check now slides only its last 12 px, and the tilt is two held steps over one even smear. Largest mean-luminance step: 0.462 at 3790 (the gavel close to the passport). |
| Looked at | about 80 native stills (every new shot at its beats; 28.02's board at each stroke and each step of his; the matches' two sides) and the contact sheet |

**The picture:** `out/ep01/full-v3/picture/act2.mp4`, **5,074 frames (3:31.42)**, 1920 × 1080, 24 fps, H.264 + AAC, 17 MB, 35 s of rendering on 2 workers, muxed with the v3.5 temp track (`act2-v35-stick-mix.wav`). Beside it: `act2.srt`, `act2.mp4.render.json`, `act2-sheet.png`. No GLYPH frames.

**To re-run** (from `studio/`, `S` your scratch folder): `node src/episodes/ep01/pixel/tools/build.mjs act2 $S/r-act2.cjs && node $S/r-act2.cjs check`, then `SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act2.cjs picture --jobs 2` and `node $S/r-act2.cjs contact ../out/ep01/full-v3/picture/act2-sheet.png native`. The EL test: the lock.py command above with `--timeline show/reel/ep01-v35-el/ep01-v35-el-act2.json`, `--takes audio/ep01/v3-el/ep01-v35/act2/lines-A.json` added last, no `--mix`, and `--out-json $S/el/lock-act2.json --out-ts $S/el/data-act2.ts`; then `ELDIR=$S/el node show/episodes/ep01/production/full-v3/assembly/tools/build_el.mjs act2 $S/el/r-act2-el.cjs` and its `check`.

### 12.5 Weakest (to my eye, from stills; nothing watched in motion or heard)

1. **28.02's writing arm** is a cut-paper tube from his shoulder, and Mas (a medium figure run down to the frame's foot) slides along the board in 12-px held steps with no legs in frame. It reads as him working the board, but it's the least drawn thing in the act.
2. **The 2019 wide** (28.02's head, 3.8 s): the figures are room-scale in a big room; Gerg's bill reads as a white strip unrolling, and Alyi, Mada and the Quiet Vote's chair are small at the table. The 2S carries the scene.
3. **MUNICH** holds 0.7 s (the lock's timing): legible, but under the name-card floor.
4. **v35-29.04's trim** ("…and of course have no plans to leave.") is my call for the read floor; the lead may prefer the full sentence with a longer hold. His one-pixel smile (the lock's note) isn't drawn: the shot is an insert of the phone.
5. **28.05:** the brief says "back to the senator's held face"; the lock's picture note says hands and pads only. The out goes check → blank pad (the match) → the dais held (the senator who asked still lit, room scale) → the gavel close. No close-up of a senator's face.
6. **The hands** (the pen hands, the flag cutaways' receiving hand, the order hands in 17.10) are simple drawings; the flag cutaways are 8 frames each.
7. **14.01's lift** is modest (24 px): it shows the dash after REG and reads as him checking the page, less as taking it out.
