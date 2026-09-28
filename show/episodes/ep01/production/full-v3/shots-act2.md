# Ep1 full v3 · shots: Act Two, "the regulate-me tour" (sc 13–17)

| | |
|---|---|
| **What this is** | The record of Act Two's pixel layouts on the stick lock: every shot, what it's built from, what's new, the checks, how to re-render it, and what's weakest. **Now on the v3.3 lock: [§10](#10-v33-the-v33-lock-script-draft-82-a-polish) is current**; §9 is the v3.2 round, §8 the v3.1 round and §1–§7 the v3 pass, kept for the record. |
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
