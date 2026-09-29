# Ep1 v3.5 · shots · ACT ONE (proposal-v35 sc 4–24)

| | |
|---|---|
| **What this is** | The pixel layouts for Act One, now on the **v3.5 base lock** (script draft 8.4, the final version, Kokoro timing): **76 shots, 10,794 frames, 7:29.75**, with the first weeks, 3 AM, JUN 2018, the window, the vision post, the waitlist and **style leap 9A** (the tear macro) (§15, on top of §14 and earlier). Sections 1–10 describe the v3 build and its rounds; §11–§14 are v3.1–v3.4; each later section supersedes the earlier ones where they differ. Nothing was committed: the lead commits. |
| **Where it is** | **Layouts:** `studio/src/episodes/ep01/pixel/act1/shots.ts` (one layout per shot), `act1/extras.ts` (the v3–v3.4 additive drawings) and **`act1/art/v35.ts`** (the v3.5 art). **The lock:** `act1/data.ts` and `full-v3/lock/act1.json` (`lock.py`). **The picture:** `out/ep01/full-v3/picture/act1.mp4` (1920 × 1080, 24 fps, the v3.5 stick mix as temp audio), `act1.srt` and `act1.mp4.render.json` beside it; the contact sheet `act1-sheet.png`. **The temp track:** `out/ep01/full-v3/picture/act1-v35-stick-mix.wav`. **The tear macro:** `out/ep01/full-v3/runway/tear-702*` and `clips/t1-*`; tools `studio/src/dev/genvideo/runway/tear_scene.py`, `tear.py`. |
| **Measured** | v3.5 (§15.7): `check` passes (76 layouts, 0 stand-ins, 0 unresolved marks, 60 browser frames) on the Kokoro lock and on the EL lock (10,947 frames, in scratch). Flashes, every frame streamed with the macro spliced: at most **1 in any second**, **0 red** (the limit is 3). |
| **Looked at** | The contact sheet, and about 150 native stills at 2× chosen by story moment: every arrival, every V.O. line, every plate, the lit band, the moving pieces (the cursor, the finger, the marker, the tear, the check, the wipe, the passer-by), and the fixes after each round (§5). Stills only: **nothing here has been watched in motion or heard with the picture.** |

---

## 1. The shots

Built from the art-a modules ([art-a.md](art/art-a.md)); every `st` string in `shots.ts` names what a shot is built from, and the review render prints it in the margin. **R** = the art's setup used as it is; **C** = the art's setup re-composed in `extras.ts` from its exported parts, to free one parameter the packaged setup fixes; **+** = a small additive drawing of this pass.

| Shot | s | Setup | Built from | What moves (the life, the marks) |
|---|---|---|---|---|
| 5.01 | 3.0 | ECU | R `drawButtonECU` + **+** `sleepLed` | his closed laptop's sleep LED breathing in the corner (held steps, 2.7 s loop) |
| 5.02 | 8.0 | W · arrival | R `drawLaunchWide` + `drawCursor` + **+** `litBand` | the whole shot is the arrival; Gerg types and glances up as Mas's voice names him, Rima steps back from her board as he names her, Mas breathes (the desk sprite's breathe drawing); the cursor drifts in and parks on the button as the band lights (`Push button` → `Push research preview`), 4 s from the cursor's arrival, then the band dims back to dark |
| 5.03 | 12.0 | 2S | R `drawLaunch2S` + plate | Gerg lip-synced, typing, not looking up; Mas's eyes go to Rima's board on her O.S. line and on "she'll go for three."; plate `GERG MOCKBRAN` beside Gerg |
| 5.04 | 29.0 | OTS | **C** `otsRima` (held steady; his desk's edge across the foot; the button and cursor lifted clear of the V.O.) | Rima lip-synced and blinking; she smooths her lapel before "Mas, it's your call", lifts her brow waiting through his V.O. and "it's a preview.", firms on "a fortune", half-lids at Gerg's "v2 problem"; Alyi small and soft in the glass, blinking; plate `RIMA TAMURI` |
| 5.05 | 2.6 | MCU·glass | R `drawLaunchGlass` + plate | Alyi's reflection lip-synced; plate `ALYI` |
| 5.06 | 3.0 | MCU | R `drawLaunchMcuRima` | her brow up while she waits; after "…still a preview." her lids come half down |
| v3-5.06b | 6.3 | MCU·glass hold | R `drawLaunchGlass` | the reflection still watching the button, two slow blinks, under "alyi asks that about everything we build…" |
| 5.07 | 4.5 | 2S | R `drawLaunch2S` + **+** `rimaMarkerHand` | Gerg's one key with a flourish, "Your button." lip-synced without looking up; behind him Rima's hand and marker draw the third underline on the squeak (the V.O.'s prediction paid); Mas's head goes down to the button |
| 5.08 | 2.3 | ECU | R `drawButtonECU` via **C** `fingerECU` | the band lights again for the press (`Push research preview`); the parked cursor on the cap; his finger comes in with no hover in three held steps and takes the cursor's place; touch, the click, the LED; the band dims back to cutscene mode in held steps (lit 1.5 s in all) |
| 5.09 | 15.2 | MCU·glass | **C** `glassCount` (the art's composite, with mouths) | Alyi's reflection lip-synced, then gone on his footsteps (a soft step, then the empty glass); Rima capping her marker at the board; Mas soft in the fg, lip-synced, turning to the room for "let's see if anyone notices."; the hold after |
| 5.10 | 14.2 | OTS | R `drawLaunchOTSLaptop` + **+** `chatCard` | the bubble idle, then lit with its glow before anyone types, talking on its lines; the replies type on; he types `is anyone there?` in the input row (the caret on a held blink) and sends it; Rima lip-synced, blinking, firm on "Nobody asked one."; Gerg's hands typing |
| 5.11 | 8.2 | MCU | R `drawLaunchMcuMas` | he reads it; "it likes me." lip-synced; the one-pixel smile held until Gerg deflates it; his eyes back on the screen on the V.O., and the smile comes back on "twice" |
| 5.12 | 2.6 | ECU | R `drawChatECU` | the counter ticks 0 → 1 · 2 · 7 · 104 · 1,389 on the three counter rolls, then blurs; the bubble glows on the first tick |
| 6.01 | 5.0 | ECU → W | R `drawChatECU` (grow) | the counter leaves the plate and grows in three held drawings on the stick's value changes, spinning |
| 6.02 | 5.0 | W | R `drawLaunchWide` (odo, armsUp) | the machine drops through the desk in two held drawings on the clunk; a whole-pixel shake; splinters settling; Gerg arms up; Rima beside the desk, then peering; Mas's lids down to the hole |
| 6.04 | 5.0 | ECU | R `drawGergPhoneInsert` + plate | the buzz, NOLE's post, Gerg's heart on the first tap, Rima's un-heart on the second; plate `NOLE` outside the UI once it's read |
| 6.06 | 2.3 | ECU | R `drawWedgedWheel` + **+** grit | the last wheel settles in held steps on the ratchet, then holds legible: `1,000,000` (the rail DEC 5 in the band) |
| 6.08 | 11.1 | HIGH | R `drawHoleHigh` | Rima peering down ("Low-key." / "Very low. Basement."); on the pop the tile comes back up out of the hole like toast and drops back; the glow climbs; the `$` odometer on the fast ratchet; the racks step green → amber → red on the palette steps; heat shimmer |
| 7.01 | 7.8 | MCU·PF | R `drawLaunchMcuPF` | the tear wells at his lower lid, holds, then slides a pixel every 4 f to reach his jaw as he says "it's the bill." (lip-synced, eyes up toward Rima), eyes down again for "mostly the bill."; the red rim from the hole steps up as Rima speaks |
| 7.02 | 4.0 | HIGH → ECU → HIGH | R `drawHoleHigh`, `drawGpuTear` | three setups inside the stick's one beat: the tear falls down the shaft; it lands on the red-hot GPU on the hiss (splash, three puffs); back up, his phone lit red at the top edge (the siren's J-cut), the last steam rising |
| 8.01 | 2.5 | ECU | R `drawAlertInsert` | ELGOOG · CODE RED; his thumb over it, the tap; the app zooms to full-bleed in held steps, the Elgoog lobby seen 1:1 through the screen |
| 8.02 | 2.8 | POV | R `drawElgoogLobby` | the slab slides on the shove, the siren rises in three held drawings and starts turning; Radnus, arms folded, until the heat lights his sleeve |
| 8.03 | 4.0 | POV | R `drawElgoogLobby` + Radnus | he pats the sleeve out and it relights; "Everyone, it's fine." at room scale from the take; gag plate `RADNUS · POLITELY ON FIRE` on the relight |
| 8.04 | 21.4 | POV hold | R `drawElgoogLobby` + founders | NIRB and EGAP climb out of the crypt one held step at a time (a knee up on each step), shade their eyes, come out lit; Radnus holds up his phone for "Search is fine", folds his hands for "It is ours. We published it.", pats his sleeve; EGAP reaches on his line, NIRB on "badges"; the siren turning throughout |
| 8.05 | 2.4 | POV | R `drawElgoogLobby` + **+** `guestCard` | Radnus hands the lanyards; EGAP's, then NIRB's; each card reads GUEST; his sleeve relights |
| 8.06 | 2.5 | OTS | R `drawPhoneLockOTS` + a wipe | the siren on the phone; he locks it and the red goes out; then his figure crosses the lens right in five frames (a foreground wipe of the kit's own pixels) and the bullpen is left empty under the lobby door's pre-lap |
| 9.01 | 5.5 | W · arrival | R `drawDealWide` + `drawCheck` | the lobby by day, Tasya already standing there, still; Mas, just through the door, crosses to his mark by the desk (x 312, right of the check); the check slides in through the doors in held steps behind him and jams on the nudge, legible, with nobody in front of its words; its pen hangs on its right edge |
| 9.04 | 4.4 | W · freeze | R `drawDealWide` + `dealFreeze` + `nameCard` | the full freeze, Mas alone in colour turning from his mark, two steps to the check's right edge, reaching and pocketing the pen on the tick (his body right of the amount); the gag card `TASYA / THE LANDLORD · RUNS MACROSOFT`; the frame's foot in the print's navy under the V.O. |
| 9.06 | 7.1 | 2S | **C** `deal2S` (pan 110, the art's) | the freeze lifts; Tasya lip-synced, warm, blinking; Gerg at the door behind, tugging the check's blank stub where it's caught in the wings, left of its words |
| 9.07 | 3.0 | W | R `drawDealWide` + `drawCheckFloor` | the check slides out of the door onto the floor in held steps (under the cast) and fits; Mas, from his mark right of it, walks left straight onto it, arriving on the footstep |
| 9.08 | 1.6 | MCU | R `drawDealMcuMas` | pop: the third collar with its 1-px hop |
| 9.09 | 28.5 | 2S hold | **C** `deal2S` (pan 110, held steady) | Mas lip-synced (never on his V.O.), looking down at what he's standing on before "and the rent?"; Tasya lip-synced and blinking, the ring coming up with its 11 keys on "our servers", walking out of frame right on "Everyone is welcome", so "Rent is due on the first." and the jangles land O.S. on Mas alone on the money |
| 9.10 | 13.0 | W · time jump | R `drawDealWide` + **+** `passerBy` | weeks on, held: the check scuffed, Gerg on its edge, Mas at the desk, Tasya with the twelfth key: **+** `twelfthKey`, a new NopeAI-beige key on his ring drawn big enough to count at room scale (3 px bow, 5 px blade, dark keyline), swinging with the ring's jangle and catching the light every 40 f; an employee walks across the check without looking down and out by the door; the TV comes on with GNIB; Gerg and Tasya at room scale from their takes, Gerg's eyes up at the TV |
| 9.11 | 2.4 | SCR | R `drawTvScreen` tap | Radnus tap-dancing (the kit's two drawings) |
| 9.12 | 4.9 | SCR | R `drawTvScreen` telescope + `tvLedger` | the telescope turns on the three servos, the ticker crawls in, the figure lands on the stamp with the 6-frame LEDGER print |
| 9.13 | 5.5 | 2S | R `drawDealGerg2S` | "ours does that too." lip-synced; Gerg looks from the TV to Mas, then down, and closes the lid on the click (LOBBY_LID), held |
| 11.01 | 3.0 | W · match cut | R `drawDemoArrival` | the lid opens at the same place in frame in held steps; Gerg types |
| 11.03 | 13.6 | SPLIT | R `drawDuelSplit` + plates | LEFT Gerg holds up the napkin and snaps it on the shutter, the photo on the demo screen; RIGHT Mario writing, then dictating the memo as the scroll grows; plates `CLOD 1 · SAME DAY` and `MARIO` in the right pane; the frame's foot a rung darker under the V.O. |
| 11.04 | 10.0 | SPLIT | R `drawDuelSplit` | the launch light slams on, CLOD bows on its line; Mario looks up, "Addendum.", writes; the website in two drawings on the pop; the cheer in two held drawings |
| 11.05 | 5.0 | SPLIT | R `drawDuelSplit` | Mas's post pops over the pane; phones out; the cheer; Mario reads it, then adds a line on the scribble |
| 11.06 | 5.0 | SPLIT | R `drawDuelSplit` | the second scroll unrolls and crosses the split in held steps, landing on Gerg's desk on the curl; Gerg snaps it on the shutter; MEMO → WEBSITE on the pop; the empty spindle |
| 12.01 | 4.3 | OTS → push | R `drawLetterOTS`, `drawLetterPage`, `drawClipboard` | the monitor lights on the toast; the push to full-bleed in held steps; the page slides off right on the paper's whip (three frames, the dark behind it); the clipboard glides through the dark toward frame right, `PAUSES RECEIVED: 0` legible |
| 12.02 | 10.7 | W · arrival | R `drawNoleDesk` + plates | the clipboard glides in from the left and lands; the flourish on the scribble; sparks on the two crackles; Oigneb's sign higher for his line; Nole and Oigneb at room scale from their takes; plates `NOLE · BUILDING HIS OWN` (riding the sparks) and `OIGNEB` |
| 12.04 | 2.5 | HIGH | R `drawPleaseHigh` | PLEASE, its last letter still being drawn on the pen's scratch; a 1-px knock on the cut |
| 12.05 | 2.5 | MCU·glass | R `drawLaunchGlass` + **+** | Alyi's reflection reading the letter on his phone, his thumb scrolling it (held steps); Mas bent over the sheet, the pen's tip moving on its corner |
| 12.06 | 2.5 | ECU | R `drawPleaseECU` | the pen on the last stroke, then it lifts in held steps on the tick |
| 12.07 | 1.0 | BLACK | the whole frame black | the act-out |

**Shares (the lock's size classes, by time):** faces and hands (ECU, OTS, MCU, 2S / medium) 25 shots, 3:00, **55.8 %** (pov-and-framing §4.2's target is 55 % or more); wides 15 shots, 1:44, 32.2 % (the arrivals, the drill's HIGH shots and the four split phrases, which the lock logs as W though each pane holds faces); screens 6 shots, 38 s, 11.7 %; black 1 s. The long stays are 5.04 (29 s), 9.09 (28.5 s), 8.04 (21.4 s), 5.09 (15.2 s), 5.10 (14.2 s).

### 1.1 What `extras.ts` adds, and why each is a re-composition, not an edit

- **`litBand`** draws the host's band, rail and V.O. line exactly as `frame.ts` does, plus the adventure game's sentence line. A layout can't draw in the band unless it takes the whole frame (`{full: true}`), so the launch's lit band is drawn by the layouts **only where the script calls for it, at most 4 s each time** (pov-and-framing §4.5; the lead's follow-up ruling): in 5.02, from the cursor's arrival for 4 s (the band lights in two held steps, holds, and dims back inside the 4 s), and in 5.08, lit again for the press and dimmed out after the click ("the band dims back into cutscene mode"), 1.5 s. Everywhere else, 5.03–5.07 included, the band is the host's dark one. The sentence line dims a step whenever a V.O. line is typing (one must-read at a time). The parked cursor stays in the picture in the setups that show the button (5.03, 5.04, 5.07), as the script's "stay in the foreground of every setup until the click" asks; it's in the room, not the band.
- **`otsRima`** is `drawLaunchOTSRima`'s five calls with the button moved from x 150 to x 364 on a drawn desk edge: at x 150 it sat under 5.04's V.O. line (art-a §2 asked for this lift).
- **`glassCount`** is `drawLaunchGlass`'s composite with a mouth and a head for Mas and a speaking state for Alyi.
- **`deal2S`** is `drawDeal2S` with the pan as a parameter. It also fixes a smear in the art's own pan fill (see §5, 9.09).
- **`fingerECU`** moves the kit's own finger pixels (the difference between the ECU drawn with and without the finger).
- **`rimaMarkerHand`, `sleepLed`, `guestCard`, `passerBy`, `twelfthKey`** (Gerg's room walk recoloured to an unnamed employee), **`chatCard`** (the chat window's own card style, placed below the product plate), **`grains`, `bottomShade`, `castMask`** are small additions.

### 1.2 Stand-ins

**None.** Every shot has a layout, and no frame of the 7,740 drew the host's stand-in or threw.

---

## 2. Grammar notes (what the layouts decide)

- **Mas's inner voice never moves his mouth.** The pipeline's `face` table names a speaker, and the lip-sync then draws his mouth on his V.O. lines too (seen in the first stills: his lips moved on "mostly the bill."). The layouts use `say()` / `saying()`, which draw a mouth for spoken lines only. *For the pipeline owner:* any other segment with `face: {MAS: 'lip'}` and a V.O. in the same shot has the same problem.
- **Mas doesn't blink** (pov-and-framing §4.3 rule 10). His life in holds is breath (the desk sprite), the eye dart, the lids going down to something, the one-pixel smile, the head turning. Everyone else blinks on long loops.
- **Plates are names**, placed beside the person, not in a fixed corner. The gag plates the beat plan keeps are drawn (`RADNUS · POLITELY ON FIRE`, `NOLE · BUILDING HIS OWN`, `CLOD 1 · SAME DAY`, Tasya's freeze card).
- **The lock's stick scaffolding is not drawn:** `mas types: is anyone there?` (he types it in the input row), `his sheet: PLEASE`, `USERS: 12,408 / 88,190 / 301,775 / 486,002` over spinning wheels (the blur is the point; the million is the first legible number), `SUMMONED.` (the crypt and the founders say it), `( ! )` (the phone lights red), `♥`, `NAPKIN → WEBSITE` / `MEMO → WEBSITE` / `GTP-4` / `PAUSE` / the check's words / the TV captions (all drawn by the art itself).
- **Arrivals:** 5.02, 8.02 (the phone's full-bleed), 9.01, 9.10 (the time jump, held 3.6 s before the first line), 11.01 (the match cut), 12.02 open on the room with its people; 12.01 opens close on the known home room, as the script has it.

---

## 3. The V.O. rows (mas-inner-voice §9: rows 182–203 clear of must-read UI)

| V.O. | Shot | What sits under the line | Done |
|---|---|---|---|
| v3-vo-01 | 5.02 | the carpet in shadow | as drawn; **shares the screen with the rail `NOV 30, 2022`** (the lock's timing; `check` notes it; not re-timed here) |
| v3-vo-02 | 5.03 | the desks' dark fronts | as drawn (the cursor and button sit at rows 156–175) |
| v3-vo-03 | 5.04 | the shoulder silhouette and his desk's edge | the button and cursor moved right, clear of the line |
| v3-vo-04 | v3-5.06b | the glass's dark foot | as drawn |
| v3-vo-05 | 5.11 | his hoodie; the chat's glow line under it | as drawn |
| v3-vo-06 | 6.01 | the dark window | as drawn |
| v3-vo-07 | 7.01 | the stepped-down bullpen | as drawn |
| v3-vo-08 | 9.04 | the freeze printed cream on the sunlit floor | the foot filled with the print's navy (x 0–300) |
| v3-vo-09 | 9.09 | his hoodie | as drawn |
| v3-vo-10 | 11.03 | the demo pane's day floor | the split's foot a rung darker (all four split shots, so it doesn't pump) |

---

## 4. Photosensitivity (measured, every frame)

A scratch tool (`scratchpad/v3-shots-act1/flashcheck.ts`, bundled with `build.mjs --entry`) drew all 7,740 frames through `frame.ts native` and measured them against WCAG 2.3.1's thresholds, approximated on the 480 × 270 show frame:
- relative luminance per pixel; a pixel transitions when it changes by 0.1 or more with the darker state under 0.8;
- a 160 × 90 window (a third of the frame each way, the 10° field) transitions when 25 % of it moves the same way; windows on a 40 × 30 grid;
- a flash is a pair of opposing transitions; the count is the most in any 24 frames;
- red: pixels entering or leaving saturated red (R/(R+G+B) ≥ 0.8), same area rule.

| | Result |
|---|---|
| **General flashes, the most in any second** | **1** (limit 3). Shots that reach 1: 8.02–8.05 (the Elgoog siren's sweep, one revolution a second), 9.07 (the check dropping to the floor), 12.01 (the full-bleed page and its whip into the dark). 8.06's final wipe was re-measured over frames 4400–4520: still 1 (8.05), none in 8.06 |
| **Red flashes** | **0** (the palette's reds, R2/R3, are not saturated by the WCAG definition; the siren's sweep and the red-hot GPU are big red areas, but steady or single changes) |
| The drill's red (6.08, 7.02), the stamps (9.12's LEDGER print, 6 frames), Gerg's photo flashes (11.03, 11.06: a phone-sized screen) | under the area rule; no second holds more than one flash |
| Layouts that threw, stand-ins | none, on any frame |

This is an automated approximation, not a certified PSE test (Harding or PEAT on the final encode is the real check).

---

## 5. What the look passes changed (one reader, stills)

- **5.07:** the marker hand first read as a stick poking the board; redrawn as a forearm running back behind Gerg's head, with a cuff and a closed hand.
- **5.10:** the chat window stacks its cards from the top, and the second reply covered the product plate `CHATGTP · USERS:` (the art's own `ots-visionary` still has the overlap). The second reply is drawn below the plate in the window's own card style.
- **6.04:** the NOLE name was a `label` in the lock, not a `plate`; the plate helper takes both.
- **7.01:** the tear left the eye too early to read as a tear; it now wells and holds a second at the lid, then slides to reach his jaw on "it's the bill."
- **Mas's mouth on his V.O.** (7.01, 5.11, 9.09): fixed (§2).
- **8.06:** "he stands and walks out of frame right": a slide of the kit's pixels in 2-frame steps read as a cardboard cut-out, and a rise showed the silhouette's flat bottom. Now a five-frame foreground wipe to the right, with the whole shoulder silhouette carried (its dark body equals the dark wall in places).
- **9.01, 9.07:** the check sliding in was first drawn over Mas, then behind him with holes where his dithered hoodie matched the lobby's dither; the figures' mask is now closed (dilate, erode).
- **9.04:** the V.O. on the freeze's cream floor was busy; the foot is the print's navy.
- **9.09 (and 9.06):** the art's `softLobby` fills the pan's gap by repeating the entrance glass's first 20 columns; when the street's passing car is in those columns it repeats into a long red bar across the gap. `deal2S` takes the fill from frame 0, when the car is off screen. *For the art owner:* `drawDeal2S` itself still has it.
- **9.10:** the passer-by first vanished mid-frame; now he crosses the check and walks out by the door, before the dialogue gets going.
- **12.01:** the whip first smeared the page into a full-frame cream flash; now the page slides off right with the dark behind it.

---

## 6. How to re-run

`S` is a scratch folder (this pass used `scratchpad/v3-shots-act1/`). From the repo root unless noted.

```sh
# the temp track: Act One's slice of the stick reel's mix (the reel's act1 chapter starts at 65.667 s = frame 1576)
python3 -c "import wave; r=wave.open('studio/out/reel-work/ep01-v3-stick/mix.wav'); r.setpos(1576*2000); d=r.readframes(7740*2000); \
w=wave.open('out/ep01/full-v3/picture/act1-stick-mix.wav','wb'); w.setnchannels(2); w.setsampwidth(3); w.setframerate(48000); w.writeframes(d); w.close()"

# the lock (light)
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act1 --timeline show/reel/ep01-v3/ep01-v3-act1.json \
    --takes audio/ep01/act1/dialogue/lines-fast-v1.json --takes audio/ep01/v3/act1/lines-v3.json \
    --mix out/ep01/full-v3/picture/act1-stick-mix.wav --mix-offset 0 --label 'ACT ONE'

cd studio
node src/episodes/ep01/pixel/tools/build.mjs act1 $S/r-act1.cjs
node $S/r-act1.cjs check
node $S/r-act1.cjs contact ../out/ep01/full-v3/picture/act1-sheet.png native
node $S/r-act1.cjs native $S/stills 82 404 952 ...                      # native stills at 2x
SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-act1.cjs picture --jobs 2   # -> out/ep01/full-v3/picture/act1.mp4

# the flash count (every frame, about 4 min)
node src/episodes/ep01/pixel/tools/build.mjs --entry $S/flashcheck.ts $S/flash.cjs
bash ../ops/heavy.sh node $S/flash.cjs $S/flash.json
```

- The lock's mix path is repo-relative (`render.ts` joins it to the repo root). When the final mix lands, re-lock with `--mix` and its offset, or render with `--mix <wav> --mix-offset <f>`.
- The segment has no GLYPH layers and no browser frames: no Remotion bundle is needed for the picture.

---

## 7. The render

- **`out/ep01/full-v3/picture/act1.mp4`**: H.264 1920 × 1080, 24 fps, **7,740 frames, 322.500 s (5:22.5)**, AAC 192k from `act1-stick-mix.wav` at offset 0 (the same 322.500 s), 34.2 MB. Rendered with `render.ts picture --jobs 2`, `X264_THREADS=1`, through `ops/heavy.sh`: 107 s of render (23.9 ms a frame per worker; the lobby's shots are the heavy ones at about 40 ms), 3:02 of wall with the heavy-slot wait. `render.json`: 0 stand-ins, 0 failed layouts, 0 GLYPH or browser frames.
- `act1.srt` beside it: the dialogue, and the V.O. in lowercase italics.
- **Checked after the encode:** `ffprobe` (the stream counts and lengths above), and 14 frames decoded from the MP4 and looked at (5.02, 5.04, v3-5.06b, 5.08, 5.11, 7.01 twice, 8.04, 9.04, 9.09, 9.10, 11.03, 12.02, 12.05): they match the native stills, and 7.01's V.O. frame has his mouth at rest.
- **The picture uses only committed art** (the art-a modules, commit 6bce45f) plus this pass's two new files.

---

## 8. What's weakest (for the lead and the showrunner)

1. **Nothing has been watched.** Every timing (the cursor's drift, the finger, the wipe, the tear) is judged from stills.
2. **5.07's marker hand** is a small new drawing of a forearm behind Gerg's head. It may still read as a stick at 1×; the alternative is to drop it and let the line draw itself.
3. **8.06's exit** is a five-frame foreground wipe of a silhouette, not a drawn stand-up: there is no standing drawing of Mas at OTS scale.
4. **The lit band is now two short moments** (5.02, 4 s; 5.08, 1.5 s), dark in between. The parked cursor still sits on the button in 5.03–5.07's setups; if that also counts as lit UI, it's the `cursor` flags in those layouts.
5. **The founders (8.04) have no dialogue boxes.** The script describes "backlit silhouettes with dialogue boxes"; here they speak through the phone's speaker and show who's talking by gesture (the reach, the lowered hand). If a viewer can't tell NIRB from EGAP, a small box or speaking tick is the fix.
6. **Tasya's keys at room scale** are 1 px each: "eleven keys" is carried by the V.O. and by the ring coming up at medium scale in 9.09; the twelfth key in 9.10's wide is drawn as its own oversized beige key (a new, readable key, not a count of twelve).
7. **9.10's passer-by** is Gerg's walk recoloured: an unnamed employee, but the same build.
8. *(Round 2: 5.04's and 9.09's 1-px background drifts are removed; both hold steady.)*
9. **12.05's reflection** is soft and the phone in it small; that it's the pause letter he's reading rests on 12.01–12.02 having just shown it.

---

## 9. Round 2 (the lead's follow-up, 2026-09-27)

- **The lit band** only where the script calls for it, 4 s at most each time: 5.02 (4 s from the cursor's arrival) and 5.08 (1.5 s, the press and the click); the host's dark band everywhere else (`litLevel`, `LIT_MAX = 96`).
- **5.04 and 9.09** hold steady (camX 470, pan 110); the drifts are gone.
- **9.10's twelfth key** is a new additive drawing, `extras.twelfthKey`: a NopeAI-beige key hung on the ring, bigger than the ring's 1 × 3 px keys so it reads in the wide, with a dark keyline against his blazer, swinging with the jangle.
- **The V.O. mouth in the tag and the cold open:** checked, nothing to fix. The tag's one V.O. (v3-vo-24, "it looks calmer than me.", 32.03) plays on a layout that passes no mouth and has no `face` table; the two shots with `face: {MAS: 'lip'}` (32.05, 33.04) carry only his spoken lines. Measured: in 32.03's native frames under the V.O. (k 20–58), the only pixels that change are in the cover's region (x 258–417), never his face. The cold open has no V.O. lines. `tag.mp4` is unchanged and was not re-rendered.
- **Re-measured:** flashes over frames 0–2100 and 4990–6060 (every frame of the changed shots): **0 flashes, 0 red** in both ranges, no layout threw (the whole-segment count from round 1 stands elsewhere: at most 1 a second). **Re-rendered:** `out/ep01/full-v3/picture/act1.mp4` again the same way (`render.ts picture --jobs 2`, `X264_THREADS=1`, `ops/heavy.sh`): 7,740 frames, 322.500 s video and audio, 103 s of render, 0 stand-ins, 0 failed layouts; the contact sheet re-written.

---

## 10. Round 3: the check reads clear (the lead's note on about 200 s)

- **The problem:** in the check's shots a standing figure covered its words. In 9.06 (about 200 s, frame 4800) the art's 2S puts Gerg's tug figure at wide x 238, right over `$ MULTIBILLION`, so he read as standing on the check. In 9.01 Mas stopped at x 150 in front of the memo line; in 9.04 he stood at x 214 over the amount; in 9.07's first frames he stood in front of it too.
- **The fix, by staging (no art edited):** the jammed check spans wide x 22–278 (its blank stub 22–72, its words from x 81, the amount box 174–270). Mas's mark is now x 312, right of it, in 9.01, 9.04 and 9.07. In 9.04 he takes two steps to the check's right edge and reaches. The pen, which the art clips over the top edge above the amount, is drawn from the kit's own pen pixels on the check's right edge at his hand's height (`edgePen`). In 9.06 Gerg tugs the stub, left of the words (`deal2S` takes his position now). The floor check (9.07 on, 9.10, 9.13) has no legible words, so standing on it is the story.
- **Looked at:** native stills of every shot showing the jammed check (9.01 through its slide and jam, 9.04 through the reach and the pocketing, 9.06 before and after Gerg's entrance, 9.07 through the slide), and the frame at 200 s decoded from the new MP4.
- **Re-measured and re-rendered:** flashes over frames 4470–5000 (every frame of 9.01–9.07): at most 1 a second (9.07, as in round 1), 0 red, no layout threw. `act1.mp4` re-rendered the same way (7,740 frames, 322.500 s video and audio, 0 stand-ins, 0 failed layouts); the contact sheet re-written. The frame at 200.0 s decoded from the MP4 shows the check whole: `MACROSOFT`, `PAY TO NOPEAI`, `$ MULTIBILLION` and the memo, with Gerg on the stub at its left.

---

## 11. Round 4: v3.1, the final lock (script draft 7, the lead's rulings)

### 11.1 The re-lock

- **Timeline:** `show/reel/ep01-v31/ep01-v31-act1.json` (final). **Takes:** the v3 lines plus `audio/ep01/v31/act1/lines-v31.json` (the seven new reads, `v31-a1-0001`–`0007`). **Temp track:** `out/ep01/full-v3/picture/act1-v31-stick-mix.wav`, Act One's slice of the v3.1 stick reel (`out/ep01/reel/ep01-v31-stick.mp4` from 61.667 s for 337.458 s, PCM 24-bit 48 kHz stereo).
- **Result:** **49 shots, 8,099 frames, 5:37.5** (v3: 47, 7,740, 5:22.5), 70 lines; every `lock.py` check passes. `act1/data.ts` and `full-v3/lock/act1.json` are regenerated; the v3 lock, layouts and extras are kept in this pass's scratch (`v3-backup/`).

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act1 --timeline show/reel/ep01-v31/ep01-v31-act1.json \
    --takes audio/ep01/act1/dialogue/lines-fast-v1.json --takes audio/ep01/v3/act1/lines-v3.json \
    --takes audio/ep01/v31/act1/lines-v31.json \
    --mix out/ep01/full-v3/picture/act1-v31-stick-mix.wav --mix-offset 0 --label 'ACT ONE'
```

### 11.2 The rulings, as applied

| Ruling | Where |
|---|---|
| **No band prompt anywhere** | The lit band is gone (`litBand`, `litLevel` removed): every shot uses the host's dark band. The cursor lives in the scene: it drifts in and parks on the button in 5.02, sits on it through 5.03–5.07, and gives way to his finger in 5.08. |
| **Launch night: `warm: 1` on every bullpen setup** | Every sc 5 bullpen setup that has the switch: 5.02 (the wide, with its background life), 5.03 and 5.07 (the 2S), 5.04 (`otsRima`, re-composed with the art's warm branch: the warm back wall, the lamp's key on Rima's face, the shoulder's tungsten rim), 5.05 and v3-5.06b (the glass), 5.06 (Rima's MCU), 5.09 (`glassCount`), 5.10 (the laptop OTS), 5.11 (Mas's MCU); and 6.02, the same wide minutes later. Not warmed: the button and chat inserts (no switch), 7.01's fallaway (it steps the room down; no switch), 8.06 (Dec 21, no switch), and sc 12 (another night, March; the art's own 12.05 frame is cool). |
| **Face lights, two steps where one barely shows, Alyi's reflection included** | Alyi in the glass at `faceLight: 2`: 5.05, v3-5.06b, 5.09 (from the rack on his first word), and 12.05 (the art's demo had 1). The warm setups carry the art's own one-step keys (Rima in 5.04 and 5.06, Mas in the 2S, Gerg's green) and 5.11's lamp rim. |
| **The gold third collar on every collar-3 call** | `collarStyle: 'v31'` on every collar call, 2 and 3 (the 2S, 5.11, 7.01, the lobby wide in 9.01/9.04/9.07/9.10, 9.08's pop, `deal2S` in 9.06/9.09, 9.13, the Sydney setups). The art module asks for it on every call "so the stack stays one design": with the old style on the two-collar shots the pop at 9.08 would also have reshaped the first two collars. |
| **The match cut: the new OTS on both halves, lids matched** | v31-10.04 ends on `drawGergLaptopPOV` in the lobby (the chat face, his hands; the lid half down, held 4 frames, then shut, held 16); 11.01 opens on the same slab in the same place in frame (`GERG_LAPTOP.shut`) on the demo desk, and it opens in the same held steps (2 → 1 → 0) on the Atem thread. |
| **Rezeile: printed on the page, no pipeline plate** | v31-12.03 draws `drawEmitDrop` with `byline: true` (BY REZEILE under the headline); the lock's `REZEILE` label is not drawn as a plate. |
| **`cleanUnder` on the MCUs that dither skin** | 5.11 (`warm: 1` and `cleanUnder: true`). 7.01's red under-light is already a clean rim in the art (no dither on skin), and the lobby's medium setups don't under-light. |
| **Keep the v3 fixes** | Steady holds (5.04 at camX 470, 9.06/9.09 at pan 110, no drifts); the check's staging (Mas's mark x 312, the edge pen, Gerg on the stub); V.O. mouths shut (`say()` / `saying()` move a mouth only on a spoken line). |

### 11.3 New, changed and moved beats

- **5.03**: Rima now stands at the board behind Gerg, her back to us (`cast/rima-board` 'lower'): she speaks from the board without turning round, the same staging 5.07 needs.
- **5.07** (4.5 → 8.9 s, the board seed): Gerg's key and "Your button." as before; Mas's head goes down to the button; on the marker's squeak Rima draws the third underline (her arm follows its wet end), caps the marker as she asks "Did anyone tell the rest of the board?" (her back to us: the take is tagged O.S.), holds it capped while Gerg answers "It's a research preview." (lip-synced, looking up), and lowers it; the hold into the click. The v3 marker hand (`rimaMarkerHand`) is retired.
- **5.08**: no band text; the finger as before.
- **5.09**: the rack to the glass on Alyi's first word, in one held half step (2 frames): his face two steps up, Rima at the board softened as the art softens her (whole pixels a rung down on the dither). Rima is capped (she capped in 5.07).
- **6.04 is cut** (the lock drops it); **6.02** is 3.5 s now, marks on the clunk.
- **7.01**: the tear catches the light (the art's `tearCatch`) on Rima's word "tear" ("Is that a tear?", the new read).
- **8.04**: re-timed on Radnus's shorter take (`v31-a1-0004`): the phone up for "Search is fine…", the sleeve patted after EGAP's question, hands folded for "It is ours."; the gag plate **THE FOUNDERS · SUMMONED.** typed on once both are out of the crypt and held about 4 s (to the end of NIRB's first question), top centre, clear of everyone.
- **9.09**: re-timed on Tasya's shorter take (`v31-a1-0005`: the ring up on "servers"); he goes on "Everyone is welcome." at the stick's 16.5 s, and "Rent is due on the first." lands O.S. on Mas.
- **9.10**: the TV comes on with GNIB and Sydney in its box (`bubble: 'sydney'`).
- **9.12**: the ticker carries `FEB 8 ·` (`date`).
- **9.13**: no laptop close (moved to v31-10.04): Gerg looks from the TV to Mas on the line and stays on him; the TV is back on GNIB with Sydney in the box, and she blinks just as he finishes.
- **v31-10.01** (1.8 s): the TV full frame, Sydney in GNIB's box; on the pop she slips out in three held steps; cut to the wide, she drifts down across the lobby (held every 3 frames) and parks a pixel off Mas's face. The **SYDNEY** plate under the box, then where she parks (the `2022` is the stamp on her face; not a plate).
- **v31-10.02** (18.5 s, held): the 2S, Mas and Sydney. "Hi! Isn't 2022 a lovely year?" and on its 😊 her face takes the smile, fixed from then on (her dots light in turn while she talks); Mas corrects her (lip-synced), lids half down through the scold, compliments her, and keeps the one-pixel smile after.
- **v31-10.03** (5.5 s): Tasya's hand at her chain with the timer from the first frames, clipped on the tick; the face 5; his line lip-synced, the smile unbroken between words.
- **v31-10.04** (3.0 s): the wide, the timer dings (0, its two shake drawings), her face blanks, then she's new (brighter, 5 again); the Gerg 2S for "Hi!" (her dots lit), Gerg looks down; the POV on his laptop, the lid closes, HOLD on the lid.
- **11.01** (8.8 s): the match cut on the lid → the thread held to read (the crate, `anon · 03/03/23`) → the bullpen's arrival wide at Gerg's first word (the demo stage under GTP-4, Mas at his end desk, Gerg on camera for all of his line, lip-synced) → back on his screen for Mas's O.S. prediction; on "open source" Gerg scrolls down to the replies already piling up (24 px in four held steps).
- **11.03**: the right pane clean under the V.O. (CLOD unlit, Mario writing, no scroll); the memo's scroll grows from nothing to phrase 2's length.
- **11.04** (8.5 s): no caption on the napkin → website swap (it falls 10 frames before the cheer; the lock has no toast pop now); HOLD on Mario writing to the cut.
- **11.05 and 11.06 are cut** (the lock drops them).
- **v31-12.03** (4.4 s, new): THUD, the EMIT drop (in the air on the thud's frame, the 2 px shake in held drawings, the water line still), held to read.
- **12.04**: the v3.1 desk (EMIT and the printed letter beside the sheet), the knock through the art's own shake with `waterStill`.
- **12.05**: EMIT on Alyi's phone in the reflection (the v3 page-scroll overlay is dropped: it would paint over the EMIT page), face light 2.
- **12.06**: PLEASE / REG: R, E, G written on the pen's scratch (about 11 frames a letter, held on 3s), the lift on the tick.

### 11.4 Measured, looked at, rendered

- **`check`:** 49 layouts, 0 stand-ins, 0 unresolved marks or faces, 0 problems (one note, unchanged from v3: 5.02's V.O. shares the screen with the rail). Every layout's marks were also resolved and printed (the 5.07 squeak at 79 and question at 91, 8.04's phone up 160–252 around Radnus's take, 9.09's exit at 396, 10.04's ding at 7 and "Hi!" at 22, 11.01's cut at 26 and 116). `tsc`: no error in `pixel/act1/` (the project's 20 errors are all in `src/dev/`).
- **Looked at:** about 90 native stills at 2× of the new and changed beats (5.02 through the passer and the cursor, 5.03, 5.04, 5.05, 5.06, v3-5.06b, 5.07 at every Rima pose, 5.09 before, during and after the rack, 5.10, 5.11, 6.02, 7.01 with a crop of the tear's catch, 8.04 with its plate, 9.01–9.13, every v31-10 beat at each state, 11.01 at each of its setups, 11.03, 11.04, v31-12.03 in the air, shaking and held, 12.04, 12.05, 12.06 through REG and the lift), and the contact sheet. Fixes after looking: the SYDNEY plate first sat in GNIB's search field (it read as a query) and then rode along with her drift; it now sits under the box, then waits where she parks. The thread's replies were below the screen's edge; Gerg now scrolls to them.
- **Flashes:** every one of the 8,099 frames drawn through the host in one process (`flashcheck.ts`, the same WCAG approximation as §4, 248 s): at most **1 flash in any second** (in 8.02–8.05, 9.07, v31-10.04, 11.01 and 12.01; the busiest at frame 7468, 12.01's whip), **0 red flashes**, no layout threw.
- **Render:** `out/ep01/full-v3/picture/act1.mp4` re-rendered the same way (`render.ts picture --jobs 2`, `X264_THREADS=1`, `ops/heavy.sh`): H.264 1920 × 1080, 24 fps, **8,099 frames, 337.458 s** video and AAC audio from `act1-v31-stick-mix.wav` (337.458 s), 35.7 MB; 121 s of render (24.1 ms a frame per worker); `render.json`: 0 stand-ins, 0 failed layouts, 0 GLYPH or browser frames. `act1.srt` and the contact sheet `act1-sheet.png` re-written. `ffprobe` checked, and 10 frames decoded from the MP4 and looked at (5.02, 5.03, 8.01, 9.09, v31-10.02, v31-10.04, 11.01, 11.03, v31-12.03, 12.05): they match the native stills, the letterbox is dark everywhere and the cursor sits in the scene.
- Stills and the decoded frames only: **nothing here has been watched in motion or heard with the picture.**

### 11.5 Notes for the lead

1. **9.13's tail still has the stick's `folder_close` spot** (2.8 s, −22 dB) although the laptop close moved to v31-10.04, and **10.04's close has no sound spot**. The picture closes the lid in 10.04 (52–56); the sound pass may want to move the spot there.
2. **The collars:** `'v31'` on the two-collar shots too (§11.2), against the letter of "every collar-3 call"; if the lead wants v3's collars before the pop, it is the `CS` constant's uses where `collars` is 2.
3. **Warm stops at launch night** (sc 5 and 6.02). If "every bullpen setup" means sc 8 and 12 too, 8.06's and 12.05's backgrounds are `launchBackM` and can take the same switch.
4. **v31-10.04 cuts fast** (wide 0.8 s, 2S 0.9 s, POV 1.25 s) to fit the reset, "Hi!", and the lid in 3 s; the lid's hold is 16 frames before the match.
5. **10.02 is an 18.5 s hold** with only the mouths, her dots and his lids moving (steady, as ruled); the soft lobby behind is still.
6. §8's items 2 (the marker hand, retired) and 4 (the lit band, gone) no longer apply.

---

## 12. Round 5: v3.2, the final lock (script draft 8.1: Mas's moves)

### 12.1 The re-lock

- **Timeline:** `show/reel/ep01-v32/ep01-v32-act1.json` (final). **Takes:** the earlier takes plus `audio/ep01/v32/act1/lines-v32.json` (7 lines: 4 reads, 3 cuts). **Temp track:** `out/ep01/full-v3/picture/act1-v32-stick-mix.wav`, Act One's slice of `out/ep01/reel/ep01-v32-stick.mp4` (61.667 s for 329.750 s).
- **Result: 51 shots, 7,914 frames, 5:29.8** (v3.1: 49, 8,099, 5:37.5), 67 lines, every take placed; every `lock.py` check passes. The v3.1 lock, layouts and extras are kept in scratch (`v31-backup/`).

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act1 --timeline show/reel/ep01-v32/ep01-v32-act1.json \
    --takes audio/ep01/act1/dialogue/lines-fast-v1.json --takes audio/ep01/v3/act1/lines-v3.json \
    --takes audio/ep01/v31/act1/lines-v31.json --takes audio/ep01/v32/act1/lines-v32.json \
    --mix out/ep01/full-v3/picture/act1-v32-stick-mix.wav --mix-offset 0 --label 'ACT ONE'
```

### 12.2 His four moves, on screen

| Move | Shot | What the picture does |
|---|---|---|
| **The button press** | 5.08 (and 5.02's cursor) | As v3.1: the cursor parks on the button in the wide, his finger comes in with no hover in three held steps, touches, clicks, the LED lights. Gerg's "I'm shipping it." is cut in the lock, so the press is his call alone. |
| **The million post** | 6.06 | `drawMillionPost`: the last wheel settles on the ratchet; on the post's click **his** post opens in post-card's three held steps, his avatar and name, "CHATGTP launched on wednesday. today it crossed 1 million users!", `DEC 4 · 11:35 PM`, and holds 3.6 s (the read floor for its 66 characters). |
| **The call** | 7.02 → v32-7.03 | 7.02: under the last steam his hand comes down onto the phone at the frame's edge, and the phone wakes under his fingers (`handOnPhone`). v32-7.03, **per the ruling:** it opens on the ECU of the phone ringing on the desk (`drawCallScreenECU`, `TASYA · MACROSOFT` large over the key-ring avatar; the world carries the plate), then cuts, 6 frames before "Mas.", to the MCU with the phone at his ear, **its back to us and its screen to him, at a real phone's size** (`callMcu`, below). His full ask is lip-synced; he smiles one pixel on "I'll bring a pen."; he lowers the phone in a held step; on the hang-up it lights red before it reaches the desk (its screen's edge red, the siren's glint, its red on his chin and chest), and his lids drop to it. The red is the call's end now, so 7.02's phone stays dark. |
| **The click that ships GTP-4** | 11.04 | The LEFT pane cuts in to 5.08's insert (`paneButton`: the beige button, `research preview`), his finger comes in with 5.08's held steps, touch, click, LED; on the click's 4th frame the pane is back in the bullpen with the napkin swapped into a working website (no caption), and the cheer comes 6 frames after the click. RIGHT: CLOD launches and Mario's "Addendum." as before. |

**`callMcu` (extras, additive):** `rooms/launch-call.ts` has only the outward, oversized phone (its 42 × 64 phone faces us). The ruling asks for the phone at his ear with its screen facing him at normal size, so the MCU is re-composed from the module's own parts (7.01's fallaway, his portrait at (96, 34), the tile's red rim, the band at the foot) with a 12 × 40 phone at his ear (about half his head's height), his fingers round its back, the heel of his hand under it, and the sleeve to the frame's corner. The lowered phone is tipped back toward him, so only its screen's top edge shows; the red reads through that edge and on him. No dither on skin: the screen's light on his cheek is a clean 2 px rim.

### 12.3 Everything else that changed

- **Plates with one relation word** (drawn with the host's `drawPlate`, which sets the relation on a second line): `GERG MOCKBRAN · CO-FOUNDER` (5.03), `RIMA TAMURI · CTO` (5.04), `ALYI · CO-FOUNDER` (5.05), `RADNUS · RUNS ELGOOG · POLITELY ON FIRE` (8.03), `MARIO · EX-NOPEAI` (11.03, moved in to x 388 so it fits the pane), `NOLE · EARLY FUNDER · BUILDING HIS OWN` (12.02, moved above him: at his feet it ran over Oigneb). `TASYA · MACROSOFT` is the phone's own screen in v32-7.03, not a plate.
- **5.02:** no V.O.; the wide keeps its room (the passer-by as we arrive, Rima stepping back from the board at 3.5 s, the cursor), then Gerg's cut take "Okay, the build's green." at room scale.
- **v3-5.06b:** 2.5 s, one slow blink (the V.O. is cut).
- **6.01:** no V.O.; the picture as before.
- **8.04:** the one cut-in on the founders for "Someone else built that?" (`drawFoundersCutIn`: NIRB and EGAP at 3x peering at Radnus's phone, EGAP reaching, then his mug; the siren's sweep stays in the wide, see §12.4). It runs from EGAP's line to 4 frames after it; Radnus's sleeve-pat moves after the cut-in.
- **9.04:** no V.O., so the navy foot fill under it is gone.
- **9.09:** on the stick's `key_ring_jangle_3` (on "That collar suits you.") Tasya's ring comes up, clinks, and the gold third collar hops a pixel (`deal2S` now takes `collarPop`); the ring comes up again on "our servers". Re-timed on the shorter scene (the V.O. "it does." cut): his look down now follows "That collar suits you."
- **v32-9.10k (new, 1.6 s):** `drawKeyRingECU`, eleven keys and the beige twelfth stamped `NOPEAI`, jangling in two held drawings on the jangle; the rail `FEB 7, 2023` in the band.
- **9.10:** Gerg's new line at room scale; he looks up from his laptop for it and stays on Tasya through "…we made them dance…" (the audit's reacting listener).
- **v31-10.03:** the timer's own face reads `5 QUESTIONS` (`timerFace`); "House rules, Sydney." (the cut take).
- **11.03:** no V.O.; Mario's memo from 1.5 s; the scroll grows with it.
- **12.01:** `6 MONTHS` on the letter (the OTS, the push, the whipped page and the gliding clipboard), per the ruling. 12.02's desk clipboard stays at desk size.
- **12.02:** Nole's J-cut (his line starts under 12.01's glide); Oigneb's new line "You signed it. Now put the iron down." lifts PAUSE high.
- **Kept from v3.1:** warm launch night, the face lights, the v31 collars everywhere, the match cut on the laptop, the check's staging, steady holds, no band prompt, V.O. mouths shut (the four V.O. lines left in Act One move no mouth).

### 12.4 Measured, looked at, rendered

- **`check`:** 51 layouts, 0 stand-ins, 0 unresolved marks or faces, 0 problems, 0 notes. Every layout's marks were resolved and printed (the call: ring 7, the cut 30, "pen" ends 173, the hang-up 199; 11.04: the click at 108, the cheer at 114; 9.09's clink at 21).
- **Looked at:** about 80 native stills at 2× of the new and changed beats (5.02 through its hold, 5.03–5.05's plates, v3-5.06b, 6.06 through the card's steps, 7.02's hand in each step with a crop, v32-7.03's ECU, the MCU at the ear with a crop, the lowering, the low and the red, 8.03's plate, 8.04's cut-in in and out, 9.04, 9.09 at the clink, 9.10k, 9.10, 10.03, 11.03, 11.04 at every step of the insert and after, 12.01, 12.02) and the contact sheet, plus the art's v3.2 demos. Fixes after looking: the lowered phone first read as a box (it now shows its lit edge); 7.02's hand first read as a blob (now a hand with fingers and a thumb, the phone waking under it); the red first painted two rows on his lips (now one clean rim); the NOLE plate ran over Oigneb.
- **Flashes:** every one of the 7,914 frames drawn through the host in one process (`flashcheck.ts`, §4's WCAG approximation, 217 s): **one fix.** The new 8.04 cut-in with the siren's red sweeping across it (`turning`) plus the cut in and out measured **2 flashes in a second** at frame 4182 (under the limit of 3, but above this act's 1). The cut-in now holds the founders without the sweep (`turning: false`; the sweep stays in the wide), and frames 3900–4420 re-measured at **1**. Everywhere else at most **1 a second** (8.02, 8.03, 8.05, 9.07, v31-10.04, 11.01, 12.01, as in v3.1), **0 red flashes**, no layout threw.
- **`tsc`:** no error in `pixel/act1/` (the project's 21 errors are in `src/dev/` and one in `pixel/act4/`, other passes' files).
- **Render:** `out/ep01/full-v3/picture/act1.mp4` re-rendered the same way (`render.ts picture --jobs 2`, `X264_THREADS=1`, `ops/heavy.sh`, one heavy job at a time): H.264 1920 × 1080, 24 fps, **7,914 frames, 329.750 s** video and AAC audio from `act1-v32-stick-mix.wav` (329.750 s), 34.3 MB; 92 s of render (20.3 ms a frame per worker); `render.json`: 0 stand-ins, 0 failed layouts, 0 GLYPH or browser frames. `act1.srt` and the contact sheet `act1-sheet.png` re-written. `ffprobe` checked, and 10 frames decoded from the MP4 and looked at (5.02, 6.06's post, the call's ECU, the MCU at the ear, the red, 8.04, 9.09, 11.03, 11.04's button, 12.02): they match the native stills.
- Stills and decoded frames only: **nothing here has been watched in motion or heard with the picture.**

### 12.5 Notes for the lead

1. **11.04's click has no sound spot** in the stick; the picture's click is at frame 108, 6 frames before the cheer. The sound pass could put 5.08's `dialog_ok_click` there.
2. **7.02's `( ! )` label** is stale in the lock (the phone lighting red moved to the end of the call). I used it only as a timing anchor for the hand; nothing draws it.
3. **9.13's `folder_close`** is still in the stick at its tail (§11.5 item 1), and v31-10.04's lid close still has no spot.
4. **The call's ECU** is the ringing screen of an outgoing call (the script: "One ring, through the phone's filter"); if the lead wants his thumb on it first, 7.02's hand already carries the reach.

---

## 13. Round 6: v3.3, the polish (script draft 8.2, PLAN §6)

A polish on v3.2, not a rebuild: five spots changed, everything else as in §12.

### 13.1 The re-lock

- **Timeline:** `show/reel/ep01-v33/ep01-v33-act1.json` (committed a756708). **Takes:** as v3.2 (the restored V.O. `v3-vo-09` is the v3 take). **Temp track:** `out/ep01/full-v3/picture/act1-v33-stick-mix.wav`. No v3.3 stick reel was rendered, so it's Act One's slice (episode frames 1480–9414) of the reel plan's own mix (`src/reel/tools/mixer.mjs out/reel-work/ep01-v33-stick/plan.json`, through `ops/heavy.sh`, −16.6 LUFS), the way the Acts Two–Three pass made theirs. The full-episode WAV was deleted after slicing, and so were my v3, v3.1 and v3.2 slices.
- **Result: 51 shots, 7,934 frames, 5:30.6** (v3.2: 7,914), 68 lines, every take placed; every `lock.py` check passes. The v3.2 lock and layouts are kept in scratch (`v32-backup/`).
- **Changed lengths:** 5.07 213 → 238 f (P1), 6.06 110 → 86 f (P2), 9.09 497 → 515 f (V1); 1-frame roundings elsewhere.

### 13.2 The five items

| Item | Shot | What the picture does now |
|---|---|---|
| **P1** | 5.07 | Under Gerg's "It's a research preview." (2 frames before it) the 2S cuts in to Mas's MCU and holds to the shot's end, about 4 s: his face, not answering, turned away to his desk, no look at Rima; 16 frames after Gerg's line his lids come half down to the button, which is 5.08's ECU. 5.11's MCU is reused as its frame, re-composed (`extras.mcuMasDesk`) without the chat's glow: his laptop is dark here, so the portrait is in the desk lamp's warm light with its rim and warm collars. As 5.11's own call (`light: 'monitor'`) it read as lit by a screen that isn't on. |
| **P2** | 6.06 | The wheel lands on the ratchet in held steps and there's no hold on the digits. His phone's compose strip slides up at the frame's foot with **only the post's first line**, `CHATGTP launched on wednesday. today it crossed…` (post-card's 9 px chip, the UI type, his accent rule). His thumb comes up from the bottom right in held steps and presses **Post** on the post's click (the pill lights), then it reads **Posted**. The line holds 3.2 s to the cut (`extras.postPreview`). |
| **P3** | 7.01 | The tear wells at his lower lid and **holds at his eye** until Rima's word "tear". The art's catch-light (`tearCatch`, the hottest white) is on from 12 frames before the word, and on the word a three-armed catch-light round it for 4 frames makes it read (`extras.tearGlint`: one pixel up, left and right, in the lamp's tungsten, never below). Then it slides toward his jaw as he answers "it's the bill." |
| **P4 + V1** | 9.08, 9.09 | 9.08 is unchanged: the pop, the gold third collar surfacing (its first appearance). **9.09 now opens in 9.08's MCU:** Tasya's hand comes in from frame right in two held steps (`extras.settleHand`: the blazer's navy from tasya-medium's own rungs, the shirt cuff, his key ring hanging from his fingers). On "That collar suits you." it settles the collar: on the stick's `key_ring_jangle_3` the ring swings against it (the collar's 1 px hop, a glint at the contact), and Mas gives the one-pixel smile. The hand goes in two steps before the line ends, and it cuts to the 2S on the line's end. "it does." (V.O.) plays over the held 2S with his mouth shut, then he looks down at what he's standing on, then "and the rent?". The v3.2 clink in the 2S (the ring raised across the frame) is gone; the ring still comes up on "our servers". |
| **P14** | 8.03, 12.02 | The plates are the lock's two-part texts, `RADNUS · RUNS ELGOOG` and `NOLE · BUILDING HIS OWN` (host `drawPlate`, the relation on its second line). Their placements stand. |

- **P4, the check before 9.08:** every Mas drawing before 9.08 has two collars or none. The layouts pass `collars: 2` or take a default of 2 (5.03, 5.07, 5.11, 7.01, v32-7.03, 9.01, 9.04, 9.06, 9.07); the room-scale bullpen wides draw no collars. That's his own two, never the Macrosoft third. The cold open isn't mine and keeps it.
- **M1:** skipped, as offered. The score carries the accent, and launch night's bullpen is already `warm: 1` (the hall's tungsten one step in, §11.2).

### 13.3 Judged differently

1. **P1's hold** runs to the shot's end (about 4 s), not about 1 s. The lock put the extra second at the tail after Gerg's line, so cutting back to the 2S for the last 2 s would have added a cut for nothing. His lids dropping to the button is the change inside the hold, and it hands straight to 5.08's finger.
2. **P4 is staged as a continuation of 9.08's MCU, not inside the 2S.** In the 2S Tasya stands at frame right, 300 px from Mas, too far for a hand at his collar without a walk across the frame. 9.09 opens on the same MCU framing 9.08 ends on (no cut at the beat's head), the hand comes in, and there's one cut to the 2S on the line's end. Tasya's line plays with him off-screen for those 2 s.
3. **P3 adds a small catch-light** round the art's one bright pixel, 4 frames only. The bright pixel alone reads at 2×; at 1× on a phone it might not.

### 13.4 Measured, looked at, rendered

- **`check`:** 51 layouts, 0 stand-ins, 0 unresolved marks, 0 problems, 0 notes; the marks were printed (5.07 cut-in at 143, lids at 189; 6.06 the ratchet at 2, the click at 18; 7.01 "tear" at 38; 9.09 the clink at 21, the line's end at 54, "it does." ends at 85).
- **The EL lock:** act1 locked on `show/reel/ep01-v33-el/ep01-v33-el-act1.json` into scratch (its own takes' timing, no mix) and built with the assembly's `build_el.mjs`: **8,059 frames, 51 layouts, 0 problems**, every mark resolving (5.07's cut-in at 160, 9.09's line's end at 62, 11.04's cheer at 113). The segment builds from the EL lock unchanged.
- **Looked at:** native stills at 2× of every changed moment (5.07 before and after the cut-in and with the lids down; 6.06 the landing, the strip's steps, the thumb's approach, the press, Posted, the hold; 7.01 the tear at the eye before, on and after the word, with a crop at 8×; 9.08; 9.09 every step of the hand, the clink with a crop, the withdraw, the 2S under "it does."; 8.03's and 12.02's plates) and the contact sheet. The fix after looking: 5.07's MCU as 5.11's own call was lit cyan by a dark laptop; it's now in the lamp's light.
- **Flashes (`coldopen/tools/flashcheck.py` on the rendered MP4, every frame):** at most **2 flashes in any second**, at frames 7383–7397 (12.01: the push's held steps up to the bright full-bleed letter, then the whip to the dark, unchanged since v3). The limit is 3. **0 red flashes**, pass. The largest single-frame change of mean luminance is 0.53 at 7910 (12.06's cream page cutting to 12.07's black: one transition, not a flash). None of the changed shots produces a frame-level transition. The tool as written holds every frame in float64 (about 10 GB for 7,934 frames) and was killed on memory here (exit 137) with the other passes running, so I ran its own functions (`lin`, `blocks`, `frame_events`, `max_flashes`) with the frames decoded and reduced to their 16 × 9 blocks one at a time (`scratch/flashpy_stream.py`, through `ops/heavy.sh`). It's the same method, and the numbers are the tool's. The earlier rounds' "1 a second" came from this pass's own frame-accurate counter (§4), which measures 12.01 at 1.
- **Render:** `out/ep01/full-v3/picture/act1.mp4` replaced (`render.ts picture --jobs 2`, `X264_THREADS=1`, `ops/heavy.sh`, one heavy job at a time): H.264 1920 × 1080, 24 fps, **7,934 frames, 330.583 s** video and AAC audio from `act1-v33-stick-mix.wav` (330.583 s), 34.6 MB; 103 s of render; `render.json`: 0 stand-ins, 0 failed layouts. `act1.srt` and `act1-sheet.png` re-written. `ffprobe` checked, and 8 frames decoded from the MP4 and looked at (5.07's 2S and its MCU cut-in, 6.06's Posted strip, 7.01, 9.09's settle, the clink, and the 2S under "it does."): they match the native stills.
- Stills and decoded frames only: **nothing here has been watched in motion or heard with the picture.**

### 13.5 Notes for the lead

1. **The collar's clasp at 9.09** is the stems pass's sound (lock-v33 §3); the picture's clink is on the stick's `key_ring_jangle_3` (k 21).
2. **6.06's thumb** presses Post on the stick's `post_click` (k 18), 16 frames after the wheel's ratchet. If the sound pass moves the post click, the thumb follows it.
3. §12.5's notes stand (11.04's click has no spot; 9.13's `folder_close`; 7.02's stale `( ! )`).

---

## 14. Round 7: v3.4, the planner's voice (script draft 8.3, SHOWRUNNER-NOTES 000)

Three spots on v3.3, and everything else as in §13.

### 14.1 The re-lock

- **Timeline:** `show/reel/ep01-v34/ep01-v34-act1.json` (commit 4309e86). **Takes:** as v3.3 plus `audio/ep01/v34/act1/lines-v34.json` (the two new V.O. reads). **Temp track:** `out/ep01/full-v3/picture/act1-v34-stick-mix.wav`, Act One's slice (episode frames 1480–9581) of the v3.4 reel plan's mix (`mixer.mjs`, through `ops/heavy.sh`, −16.7 LUFS), as in §13.1. The episode WAV and the v3.3 slice are deleted.
- **Result: 51 shots, 8,101 frames, 5:37.5** (v3.3: 7,934), 68 lines, every take placed; every `lock.py` check passes. The v3.3 files are kept in scratch (`v33-backup/`).
- **Changed lengths:** 5.03 268 → 233 f, 5.04 695 → 712 f, 7.01 173 → 253 f, 11.03 221 → 326 f; ±1-frame roundings elsewhere.

### 14.2 The beats

| Shot | What changed |
|---|---|
| **5.03** | "she'll go for three." is cut. Mas's eyes go to Rima's board on her line and come back 10 frames after it (the mark that hung on the V.O. now hangs on her line). |
| **5.04** | New V.O. `v34-vo-01`, "she's right. it will break. it goes out tonight anyway." (lips still: he's the foreground silhouette). **The settle:** on its word "goes" his head in the silhouette dips 3 px toward the desk and the button in three held steps (`otsRima` `headDy`: the head above the collar line moves, the shoulders stay). It stays down through "it's a preview." and comes back up as Rima answers. With no face in the OTS, the nod to the button is the eyes' move. |
| **7.01** | New V.O. `v34-vo-02`, "mostly the bill. we can't buy that many servers. someone can." (lips still). On "someone can." his eyes go down to his phone on the desk (camera-left, lids half) and stay, into 7.02's hand on the phone and the call. The tear's glint at his eye is kept (§13.2). |
| **11.03** | Mario's V.O. `v3-vo-10` is restored, "mario used to sit where gerg sits. he left to build a careful one.", over the clean right pane (v3.1's staging, which the layout kept). Mario's memo follows it. The plate is `MARIO` again, at v3.1's spot. `CLOD 1 · SAME DAY` is at the lock's time (from 1.0 s), as in v3.1. |

**The V.O. typing (judged, Act One only):** the host types V.O. at a flat 0.5 characters a frame and clears it 15 frames after the voice ends. The planner's lines are long, 55–66 characters over 93–111 frames, so at 0.5 the host cleared them before their last characters appeared: 5.04 lost its final period, 7.01's lost its last character, and 11.03's (in v3.1 too) ended on "a careful o". In 5.04, 7.01 and 11.03 the layout now draws the same line itself (`voTyped`: the host's position, type, colour, shadow, wrapping and 15-frame hold) at 0.5 characters a frame *or faster*, so it finishes typing when the voice does. It returns `{noVo: true}`. The other V.O. lines (5.11, 9.09) already fit and still use the host. If the lead wants this everywhere, it's a one-line change to `frame.ts` `voLine` (the rate), and the other acts' long lines have the same problem.

### 14.3 Measured, looked at, rendered

- **`check`:** 51 layouts, 0 stand-ins, 0 unresolved marks, 0 problems (5.04's "goes" at 433, 7.01's "someone" at 188).
- **The EL lock** (`show/reel/ep01-v34-el/ep01-v34-el-act1.json`, which landed during this round): act1 locked from it into scratch and built with the assembly's `build_el.mjs`, giving **8,240 frames, 51 layouts, 0 problems**, every mark resolving (5.04's "goes" at 527, 7.01's "someone" at 202, 11.03's memo at 157).
- **Looked at:** native stills at 2× of 5.04 before, through and after the dip (with a crop), 7.01 through the V.O. and the look, and 11.03 under the V.O. and at the MARIO plate. Also 7 frames decoded from the MP4: the V.O. lines now complete on screen.
- **Flashes** (`flashcheck.py`'s method on the MP4, streamed as in §13.4): at most **2 flashes in any second**, at 12.01's push and whip (frame 7550, the same place as v3.3's 7383), **0 red**, pass. The largest mean-luminance step is 12.06 to black. None of the changed shots produces a frame-level transition.
- **Render:** `out/ep01/full-v3/picture/act1.mp4` replaced (`render.ts picture --jobs 2`, `X264_THREADS=1`, `ops/heavy.sh`): H.264 1920 × 1080, 24 fps, **8,101 frames, 337.542 s** video and AAC audio, 35.3 MB; 138 s of render; 0 stand-ins, 0 failed layouts. `act1.srt` and `act1-sheet.png` re-written.
- Stills and decoded frames only: **nothing here has been watched in motion or heard with the picture.**

---

## 15. Round 8: v3.5, the final version (script draft 8.4, proposal-v35 sc 4–24, PLAN §8)

The `p-act1` pass, 2026-09-28. Act One grows from 51 to **76 shots, 10,794 frames, 7:29.75** (the base lock, Kokoro timing). Everything v3.4 had is kept unless listed here. Nothing was committed.

### 15.1 The re-lock and the temp track

- **Timeline:** `show/reel/ep01-v35/ep01-v35-act1.json` (816ca71). **Takes:** the six files in its `_source.takes_files`. **Temp track:** `out/ep01/full-v3/picture/act1-v35-stick-mix.wav`, Act One's slice (episode frames 1480–12274) of the v3.5 reel plan's mix (`mixer.mjs out/reel-work/ep01-v35-stick/plan.json`, through `ops/heavy.sh`, −16.7 LUFS). The episode WAV was deleted after slicing. The v3.4 slice is kept: the CLOD look-dev's `run.sh` still points at it.
- **Result:** 76 shots from 77 beats (6.08 + 6.09 merge as before), 81 lines (7 V.O.), every take placed, every `lock.py` check passes. The v3.4 `act1/*.ts` and `lock/act1.json` are backed up in the pass's scratch (`v34-backup/`).

```sh
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg act1 --timeline show/reel/ep01-v35/ep01-v35-act1.json \
    --takes audio/ep01/act1/dialogue/lines-fast-v1.json --takes audio/ep01/v3/act1/lines-v3.json --takes audio/ep01/v31/act1/lines-v31.json \
    --takes audio/ep01/v32/act1/lines-v32.json --takes audio/ep01/v34/act1/lines-v34.json --takes audio/ep01/v35/act1/lines-v35.json \
    --mix out/ep01/full-v3/picture/act1-v35-stick-mix.wav --mix-offset 0 --label 'ACT ONE'
```

### 15.2 Where the new art lives

- **`act1/art/v35.ts`** (new, additive, namespaced to Act One): the first weeks' phones, hands and screens; the generic post card; 3 AM's screens; the render front; the 2018 office in the T3 cut-paper tier (flat layers with one-rung shadows, sprites flattened to three tones with a cut edge, paper grain) and the ATOD arena in its own game medium; the window at dusk and Gerg's users line; the vision post's editor and feed; DRAB's waitlist; the FILED cut-in; GNIB's chyron; GTP-4's left-pane additions. Its header lists every export.
- **`act1/shots.ts`:** 25 new layouts and the changed ones below. **The V.O. now types through the host's shared `voLine`** (frame.ts finishes the typing 4 frames before the voice), so v3.4's layout-level `voTyped` is retired (5.04, 7.01, 11.03). Lips stay still on every V.O. line.
- **The style leap's tools:** `studio/src/dev/genvideo/runway/tear_scene.py` (the Blender keyframe) and `tear.py` (the compositor), beside the hourglass's.

### 15.3 New shots (Kokoro frames)

| Shot | Frames | What it is |
|---|---|---|
| v35-10.01 | 3758–3817 | the match: a stranger's phone in the same place and size as his, the essay prompt, the answer pouring |
| v35-10.02 | 3818–3865 | a laptop: the red line, "why does this crash", green on the pulse; a stranger's hands |
| v35-10.03 | 3866–3925 | the viral prompt, shortened ("king james verse: a peanut butter sandwich stuck in a VCR"), "And it came to pass…" with a red initial |
| v35-10.04 | 3926–3997 | NOLE's post, "replying to @masa", whole from its first frame; his plate |
| v35-10.05 | 3998–4045 | two phones: dinner; "how do i say sorry to my sister" |
| v35-10.06 | 4046–4105 | the window close: "7 × 8 = 54." over the banner `research preview · may make things up` |
| v35-10.07 | 4106–4165 | STACK UNDERFLOW's notice, "Temporary policy: CHATGTP is banned" |
| v35-10.08 | 4166–4201 | his desk from above, covered in lit phones; his lights red |
| v35-12.01 | 5017–5124 | 3 AM OTS: the at-capacity page (up from k0), the reload, the stranger's post (no name, no face); the corner counter; 3:04 AM |
| v35-12.02 | 5125–5227 | his MCU in the laptop's light: he reads it twice (the eye dart on held steps), the one-pixel smile at the second read's end |
| v35-12.03 | 5228–5271 | the corner counter close, which becomes PLAYED AGAINST ITSELF TODAY: 180 YEARS in the same place, size and face; the glowing seam re-draws the frame as 2018 |
| v35-13.01 | 5272–5347 | the first office, cut paper: the LED sign (the counter's place), six screens of ATOD, the racks with INVIDIA, Alyi and Mas either side of the wall, Gerg at the back, the lone desk |
| v35-13.02 | 5348–5673 | 2S: Alyi and Mas facing the wall, its light on their edges; both lip-synced |
| v35-13.03 | 5674–5849 | Alyi's MCU; Mas O.S. |
| v35-13.04 | 5850–5994 | Alyi turns to Mas; no answer; Mas's eyes go to the lone desk |
| v35-13.05 | 5995–6054 | the lone desk: "the cat sat on the the mat of the", the sticky note `text? / (side project)`, a hoodie on the empty chair |
| v35-13.06 | 6055–6090 | he walks with his glass; the seam sweeps back; he is in January's lobby at the same place (9.01 picks up his walk at x 132) |
| v35-18.01 | 8333–8476 | the glass close: Gerg's hand takes the line up and off the top; the clipping (Reuters' headline words); `PLUS · $20` → the wide at dusk, the four of them |
| v35-18.02 | 8477–8596 | 2S at the window: "Still a preview?" / "still a preview." → the wide, all four laughing (held drawings) |
| v35-18.03 | 8597–8656 | Mas alone under one lamp, the line in the dark glass; he opens the laptop |
| v35-19.01 | 8657–8728 | his laptop from above his hands: the editor, the title typed |
| v35-19.02 | 8729–9064 | the page full frame: the three passages typed and held, the earlier ones dimmed but still there |
| v35-19.03 | 9065–9160 | his MCU in the page's light; the V.O. |
| v35-19.04 | 9161–9244 | Publish; his feed; ATEM · A NEW MODEL · FOR RESEARCHERS ONLY; the lid closes (11.01 opens it) |
| v35-22.01 | 10135–10206 | the wall TV: DRAB behind a velvet rope that snaps taut, JOIN THE WAITLIST; the users line past the TV's edge |

### 15.4 Changed shots

| Shot | Frames | What changed |
|---|---|---|
| 5.10 | 1988–2322 | the banner reads `research preview · may make things up` (the facts pass's wording, so 10.06 pays it) |
| 5.12 | 2515–2624 | the wait: 5.10's OTS held, Gerg's three refresh taps (one held drawing each), Rima not looking, then looking; the insert 12 frames before the first tick |
| 7.02 | 3431–3550 | INVIDIA on the pixel card; **the macro at 3459–3518** (style leap 9A); the hand on the phone after it |
| v32-7.03 | 3551–3757 | the exit: the phone lights cool (not red) and we cut to it on the desk as strangers' screenshots pop up (the first is the essay) |
| 8.06 | 4957–5016 | the phone goes down out of frame; his laptop's light comes up (the siren's tail into 3 AM) |
| 9.01 | 6091–6222 | his glass in his hand (the match out of 2018) |
| 9.10, 9.13, v31-10.01 | 7186–7464, 7641–7709, 7710–7752 | the chyron THE NEW GNIB · POWERED BY NOPEAI (the box keeps CHATGTP's face in GNIB's colours); 9.10 carries Gerg's restored line |
| 11.01 | 9245–9452 | the GTP-4 banner isn't up yet (patched out of the arrival wide); MAR 3 rail (host) |
| 11.03 | 9453–9882 | Mario dictates through point two; the right pane is still duel-split's own drawing |
| 11.04 | 9883–10134 | left pane only: the users line jumps on his click; Alyi's reflection in the glass leans in; the bar-exam card on its mark; 2 s longer |
| 12.02 | 10310–10483 | the solder is gone: a cut-in of two hands in one frame (signing PAUSE, stamping ZAI CORP. FILED twice), then back to the wide for Oigneb's new line, the papers on the shelf |

### 15.5 The style leap: the tear on the red-hot GPU (9A)

- **Our keyframe:** `tear_scene.py` in Blender 4.5.3, Cycles CPU, 1280 × 720, 128 samples: the heatsink's fins as blackbody metal (1020 K at the base to 790 K at the tips, hot spots), the bead of water on their edges, the shroud with **INVIDIA** in raised brushed metal (DejaVu Sans Bold, our type; no mark of any real company). `out/ep01/full-v3/runway/inputs/tear-702-first-keyframe.png`.
- **The take:** `gen.py i2v`, veo3.1_fast, 4 s, seed 702, from our keyframe: **40 credits (205 → 165)**. `clips/t1-veo31fast-i2v-tear-s702.mp4` + provenance. The prompt names only physics, material, light and camera; the negative prompt excludes hands, people, faces, fire, text changes. Checked frame by frame: no person, hand or face. Its f012–f021 carry a thin falling thread (its idea of a drop landing), so the insert uses **f022–f081**: the bead dancing on its own vapour and boiling away, two puffs of steam.
- **Every letter is ours:** `tear.py` lays the keyframe's letters (their bright metal only, grown 2 px, softened) over each frame, aligned per frame by a ±4 px search. The grade warms the take's salmon fins to red-hot (×[1.0, 0.78, 0.64], ×0.95, the soft knee to 194/255).
- **The splice:** the lock's INVIDIA span on 7.02 (k28–87 = **segment frames 3459–3518**, 60 frames, 2.5 s) is declared as the segment's browser frames (option `tear`, on by default; `--opt tear=false` is the pixel fallback). Each PNG is the whole picture: the insert in the room area, the pipeline's own band under it. In and out through the grid: palette on the native grid (2 f), the native grid in true colour (2 f), 2 px blocks (2 f), real (48 f), and back.
- **Outputs:** `runway/tear-702.mp4` (the insert alone), `tear-702-sheet.png`, `tear-702-timing.json`.
- **Re-run (the PNGs are deleted after the render):**

```sh
node $S/r-act1.cjs picstills $S/tearpics $(seq 3459 3518)
bash ops/heavy.sh audio/.venv-casting/bin/python studio/src/dev/genvideo/runway/tear.py --pics $S/tearpics --png $S/glyph --start 3459
```

- **For the EL picture:** 7.02 starts at **3642** on the EL lock, so its span is **3670–3729**: `picstills` of those frames from the EL renderer, then `tear.py --start 3670`, and `GLYPH_DIR` for the EL render.
- **For the sound pass:** the pixel tear lands on the stick's `steam_hiss` (k10); the macro's sizzle and two puffs run k28–87 (the second puff about k75); it is silent. Veo embeds SynthID: the credits' AI-assisted line covers it.

### 15.6 Guardrails, as drawn

- The first weeks: prompts only; strangers are hands (three skin ramps), never a face or a name; the 3 AM post has no name and a plain grey disc.
- Parody names only: CHATGTP, NOLE (@nole, replying to @masa), STACK UNDERFLOW (a stack upside down for a mark, generic teal), ATEM, DRAB (Elgoog's skewed primaries), INVIDIA (plain letters), GNIB, ZAI CORP. No real logo.
- The 2018 side project's researcher is never drawn (the hoodie on the chair).
- CLOD's pane in 11.03–11.04 is duel-split's own drawing and its own draw call, with nothing of ours over the right pane, so the claymation overlay replaces it cleanly.

### 15.7 Measured, looked at, rendered

- **`check`:** 76 layouts, 0 stand-ins, 0 unresolved marks, 0 problems, 60 browser frames. One note, from the lock's timing: 11.03's V.O. shares the screen with the MAR 14 rail (the rail at 0.2 s, the V.O. at 0.8 s).
- **The EL lock:** locked from `show/reel/ep01-v35-el/ep01-v35-el-act1.json` (takes `audio/ep01/v3-el/ep01-v35/act1/lines-A.json`) into scratch and built with the assembly's `build_el.mjs` (`ELDIR` = the scratch): **10,947 frames, 76 layouts, 0 problems**, every mark resolving, 60 browser frames (3670–3729).
- **Flashes** (flashcheck.py's method, streamed: every frame drawn through the host, the macro's PNGs read where they splice, 160 × 90, reduced to its blocks frame by frame): at most **1 flash in any second** (19.04's page to its feed), **0 red**; the limit is 3. The largest single-frame change of mean luminance was the cut from 19.02's full-frame page to 19.03 (0.55); the page is now a rung down (P1), re-measured at 0.37 there.
- **Looked at:** about 60 native stills at 2× of every new and changed shot (several at more than one moment), the macro's frames at full size and a sheet. Fixes after looking: the strangers' thumbs (sticks → thumbs), the lamp pools (red discs), the desk of phones (they read as papers), Gerg's arm on the glass (a pole across the clipping), the users line (it reshaped as it grew: now one fixed curve, revealed), DRAB and FILED (the display face's D reads as an O), the stamp's arm over the header, the chyron's overflow into the TV's bezel, the half-hidden neon in 11.01.
- Stills and sheets only: **nothing here has been watched in motion or heard with the picture.**

### 15.8 The final round's edits (the showrunner's notes, 2026-09-28)

- **3 AM (12.01–12.03):** his screen shows the team's own channel, `#launch`, instead of the stranger's post: anonymous staff avatars (a colour chip, a pale head and shoulders, no names), "1M 🎉 best week of my life", "my mom wrote her wedding toast with it 😭", "thank you mas 🙏", and the reactions piling up (hand-set 7 × 7 emoji). The timing, the at-capacity page, his two reads and the exit into the 2018 counter are unchanged. `art/v35.ts` `teamChannel`.
- **The two new V.O. lines** (v35-vo-05 in v31-12.03, v35-vo-06 in v35-19.03, replacing v35-vo-02) are in the EL lock: `el_takes.py --lock v35 act1` (83 rows, 71 mouth tracks), then `lock.py` on `show/reel/ep01-v35-el/ep01-v35-el-act1.json` with `--mix out/ep01/full-v3/mix-v35-el/act1-mix.wav --ep-in 1351` into `assembly/el-v35/{lock-act1.json,data-act1.ts}` (10,947 frames; every check passes). The previous files are backed up in the pass's scratch. They type through the host's voLine, lips still. v35-vo-05 shares the screen with the MAR 29 rail (the lock's timing).
- **No mouse cursor in the launch:** 5.02's drift-in and park, the parked cursor in 5.03, 5.04 and 5.07, and 5.08's cursor before his finger are gone. 5.08 is the bare cap, his finger, the click, the LED. The vision post's cursor (19.04, on a screen) stays.
- **The EL picture** was rendered once before the plan changed (the 3 AM channel and the new V.O., without the cursor removal): `check` "11.04: overlay on 244 frames", 244 overlay frames laid, 60 tear frames (3670–3729), 0 stand-ins; flash (flash_seg.py) max 2 in a second (12.01's push and whip, as before), red 0. Its embedded audio is `mix-v35-el/act1-mix.wav`, which doesn't have the two new V.O. lines yet. It's to be replaced by one render after the new lock.
