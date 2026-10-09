# e02-v1-act3 · Ep2 v1 Act Three "leave them up" (sc 13–17) · the music stem

**The score pass, 2026-10-09.** Three cues in three renders, laid on the EL lock (the master, `show/reel/ep02-v1-el/ep02-v1-el-act3.json`: 7,680 frames, 320.00 s) with the `e02-v1-common` engine (composer X's `v3lib`), plus a pre-lap file for THE CLOCK's first tick under Act Two's black:

| Render | Cue | Scenes |
|---|---|---|
| `e02-08-wheres-alyi` | E02-08 WHERE'S ALYI?: THE CLOCK, first step | 13, 14 |
| `e02-09-feel-it` | E02-09 FEEL IT: the felt, F2.2, the felt again | 15 (F2.2 inside) |
| `e02-10-the-bridge` | E02-10 THE BRIDGE: the S3, the episode's one full-band stretch, the DREAD out | 17 |

**Nothing here has been listened to.** Every number below is measured [M]. The musical calls are judged [J]. The "For an ear" list says what only a person can check.

**The brief:**
- **The cue list:** [manifest.md §6](../../../../show/episodes/ep02/production/v1/manifest.md#6-score-cues), E02-08, E02-09 and E02-10.
- **The scenes and the mood map:** [proposal.md](../../../../show/episodes/ep02/production/v1/proposal.md) sc 13–17, "The feeling curve" and "The seams" 15–20.
- **The script's MUSIC lines** (script-v1.md sc 13–17), **the beat plan's J and L cuts** (13.01 J 0.8, 14.12 L 1.0, 15.19 J 1.0, 17.21 J 1.2) and **the lock's music runs** (`track.py --dry --el`).
- **The notes from the earlier segments:**
  - Act Two ends on a designed stop at 278.208 s (digital zero to 279.0), and THE CLOCK's first tick is a J under that black. This act writes `render/music-el-prelap.wav`, as Act One did, and since the score review `mix_episode.py` lays it on Act Two's score bus.
  - The record on screen (posts, a broadcast's lower third) is found with Act Two's `record_windows()`, widened for this act's kinds.
  - Score-like sounds missing from the SFX board are claimed in `cues-el.json` → `claims_sfx`.
  - Bowed vibes need about −14 dB of track gain against four sul-tasto strings.
  - Keep F out of the bottom during a tape-stop. This act has no tape-stop.

The mood map, in order:

| Scene | Mood |
|---|---|
| 13 | a wry, sad beat, then a dry laugh |
| 14 | playful, then lonely (his own face saying "can we talk?"), with a chill at the domino and the screws |
| 15 | loneliness; then, in F2.2, warmth and joy, gravity, resolve and dread; a determined evening |
| 17 | the big comic set-piece, respect, frantic hands and the relief of hearing him act, a laugh at the forecast, pathos in the rain |

## The render

| | |
|---|---|
| `render/music-el.wav` | **320.000 s, 15,360,000 samples (7,680 frames × 2,000), exact.** 48 kHz / 24-bit stereo, git-ignored |
| `render/music-el-prelap.wav` | **0.792 s**: Act Two's black, from its designed stop (Act Three's −0.792 s) to Act Three's first frame. THE CLOCK's first tick sounds at −0.625 s. The file's last sample runs into `music-el.wav`'s first (0.0170 / 0.0130 against 0.0174 / 0.0125). Peak −8.0 dBFS. See "For the other passes" |
| Level | −19.93 LUFS-I; true peak −3.15 dBTP; short-term p95 −17.02, max −15.06 |
| `check.py` (with the review's new checks) | `act3 7680 f 320.000 s exact=True lock=True −19.93 LUFS-I −3.15 dBTP \| silence 0 holes 0 holes-42 0 frag 0 (runs 1) \| 12 dB steps 0 unmarked 0 \| F-major True rule12 True knee 0/0 \| pocket p10 12.3 min 11.2 fail 0 exempt 0 \| PASS` (the old check passed the dropout: its hole test was −60 dBFS) |
| Engine QA, every cue | F-major OK, written and spectral (worst A/F 0.34, 0.32, 0.19). Rule 12 OK: no A-natural is written anywhere. Knee whole 0, completions 0. Every hit mark has an onset within 10 ms (1/1 and 4/4; E02-09 marks no hit). The sub under the lobby's `server_hum` reads −52.0 dB and under office 2023's −47.1 dB, against a −18 limit. The one warning left is E02-10's short-term p95 (−16.6, over the −17 underscore guide): judgement call 9 |
| Music runs | **one run, 0 → 320.0.** There is no designed silence inside the act, no digital silence, no hole under −60 dBFS and no fragment |
| `cues-el.json` | the cue sheet: each cue's sync marks and events, the designed hits, `claims_sfx`, the sections, the record on screen, the pre-lap's own entry, the measurements and the engine QA. It names the timeline it was laid to |

The Kokoro lock (`show/reel/ep02-v1/`) was not rendered, because the film is the EL lock.

## The score review's fixes (2026-10-09)

| Finding | What changed in `track.py` | Result [M] |
|---|---|---|
| **E02-09: an undeclared dropout at the glow** (170.7–175.4): the glass decayed under −48 dBFS from about 172.8 s, under −42 dBFS for 1.55 s, then the felt's return jumped +35 dB in 0.5 s (Ep1's "3 AM bloom", S9) | the choir's no-third chord thins to ppp at the glow and **holds to the pin** (it let go over 1.6 s before); the **sul-tasto F pedal swells in first** (0.9 s before the pin's beat), and **the felt returns a beat later, softer** (its own track, 7 dB under the felt; 176.0, 1.5 s before V.O. 8) | the bed never falls under **−35.8 LUFS-M** (50 ms RMS under −39.1 dBFS at its lowest; S3's hole test is −42); the felt's return reads **−20.9 LUFS-M**, 4 dB over the strings' swell before it (the review: −52.8 → −17.3) |
| **E02-10: the two-feel pumps 20–30 dB** at the bar lines (217.6, 220.1, 222.6, 255.1) | the upright legato in the two-feel; **an arco bass on each bar's root** under the refusal and the forecast (low-passed at 700 Hz: nothing in the voices' band) | the pump **7–17 dB, median 10.0** (the review: up to 30); no laugh sound falls in this act |
| the chant's lift masked its onset (e2-a3-0010, +9.3 dB) | the lift waits until the chant is established: the first beat 0.5 s after its first word (121.625, was 121.0) | its onset **+12.4 dB** |
| **the pre-lap was never laid** (seam 15: THE CLOCK's first tick lost under the midpoint's black) | `mix_episode.py` lays `music-el-prelap.wav` on Act Two's score bus from 278.208 at this act's head gain, and this act's head fade is off | on the score bus: Act Two's last 200 ms and this act's first 200 ms 8.6 dB apart (the ticks), a sample jump of 0.0005 |

**The mood balance** [J]: this act's suspense is about 17 % of its scored time, and the episode's about 15 % against the plan's "about a third" (manifest.md §6). S2 holds (suspense a minority), so the balance is left as composed and **asked of the showrunner's proxy**. If the lighter balance is not intended, the targeted change is THE CLOCK in sc 13–14: the Ache (G + D♭ over the F pedal) at more of its thresholds (the walk-off, the threshold, DOT's cuff), not a broad re-score (S1).

## What plays (the cue sheet)

EL seconds, on the segment's own clock (0 = Act Three's first frame). Chord changes that land on cuts pre-lap them by the latest grid point at least 0.15 s before the cut. They measure 0.17–0.46 s [M]; the exceptions are judgement calls 2 and 3. No change lands inside a V.O., a line of his, a real line or the record on screen; each moves before or after it.

### E02-08 WHERE'S ALYI? (−0.63 → 91.0): THE CLOCK, first step

P04 THE CLOCK, straight (the machine's time), its first step: one tick a beat. **The grid is locked to the four screws of sc 14** (`screw_turn_1` is a bar line), so the screws, one a beat in Ep1's rhythm, land on the clock's own beats. The tick is a violin pizzicato and a woodblock on varied pitches, chord tones of the current step (F4–E♭5), never one pitch at an even rate. The chip adds its irregular "seconds": 43 noise ticks on scattered sixteenths, none under the presser, a V.O., his lines or the record. The pedal is F3 + C4, sul tasto (cello, viola). **The knee's rising F G A♭ C** is the clarinet's held lower note, with the violins a fourth or fifth above.

| s | What plays | Why |
|---|---|---|
| −0.625 | **the first tick**, in the pre-lap file: pizzicato, woodblock and a soft timpani F3, one beat into Act Two's black (0.167 s after its designed stop). The F pedal bows in (2.4 s silent attack); the clarinet's F4 and the violins' C5 | "THE CLOCK's first tick under the midpoint's black" (13.01 J). The re-entry Act Two's stop promised |
| 0.000 | the third tick, on the act's first frame. **Designed hit**, so the mix keeps its attack | The act's head is already playing; `mix_episode.py`'s head fade drops to 0.04 s |
| 2.4 → 12.5 | the clock under the staffers (the tick softer under talk); "leave them up." (11.71) plays over a held dyad | A wry, sad beat. Nothing moves under his line |
| 13.125 | **the step to G**, on the beat 0.21 s after the cut to the flyer | His decision, then his own hand on the fallen flyer (hope). The change waits out his line |
| 19.29 → 27.5 | **the presser: a tiny bed.** The tick at 45 %, a −5 dB fader ride, no change, the G dyad held. −26.0 LUFS | "The presser a tiny ducked bed". The lower third (BIPARTISAN SENATE AI ROADMAP, [H]) is the record and plays dry. The reporter's question and the tenth sticker get no hit (the dry laugh is the picture's) |
| 27.500 | **A-flat**, 0.25 s before the walk-off | He goes to reach Alyi |
| 30.625 | **C**: the knee's leap lands, 0.38 s before the open floor's cut. `ui_band_on` lights the band at 29.93 | "The open floor's band lights as he crosses, and THE CLOCK's first step carries" |
| 31.25 → 43.75 | **+ the cello's pizzicato eighths** (F3 C4 A♭3 C4 G3 C4 A♭3 D♭4), the C dyad over the F pedal, the chip's seconds a little denser. −19.4 LUFS | Playful: the verbs, the heatsink, the strip. The bonk (42.79) is the SFX's |
| 43.750 | **THE DOOR blooms once, its first note missing**: D♭5 (2 beats), C5, then G4 held (the ♯4, no cadence). Non-vibrato flute "through the door": low-passed, one side, the room on one side only. Under it the pedal moves to D♭ (D♭3 + A♭3), the pizzicato rests and the tick drops to 60 %. 0.04 s before the cut (on the beat). −16.2 LUFS-M | "The Door (first note missing) blooms once, on his own reflection mouthing `can we talk?`": lonely |
| 48.750 | back to the F pedal and the C dyad; the pizzicato again (0.25 s before 14.05) | DOT's cuff points at the door; the note flutters into his pocket with no music on it (it is never defined) |
| 56.562 | **the chair**: the pedal to D♭, 0.23 s before the cut | |
| 56.792 → 73 | **the chair's hum is the GPU choir** (D♭3 A♭3 E♭4 G4, D♭ sus2(♯11), no third): choir aahs and reed organ through a "hum" chain (two low-passes near 500 Hz, almost mono), on `chair_hum_choir`'s own time. From 57.6 the score's choir opens out of it over 5 s, ppp. The tick at 62 % under Bukaj | "The chair's hum is the GPU choir's chord, diegetic into score". **The score plays the claimed `chair_hum_choir`** (it is not on the SFX board) |
| 70.625 | **Ekiel**: the F pedal, an A♭4 + D♭5 dyad, **+ low spiccato eighths** (Ep1's clock layer). The score's choir out; the hum fades as he walks off (to 73.1). `freeze_hit_F` (71.43) lands over the F pedal | The chill begins |
| 74.375 | **Ekiel's post: THE CLOCK thins to its pedal.** No tick, no dyad, no spiccato; F3 + C4 alone (−21.9 LUFS-M at most) | "Thins to its pedal under Ekiel's post" (his own words, the record: dry) |
| 80.625 | the team's door: the tick again, the spiccato, and **the Ache** (glass G4 + D♭5 over the F pedal), a soft timpani F3; a +1.5 dB ride | "A chill at the screws". P04: the Ache at the peak |
| 81.25 → 83.125 | **the four screws take the clock's four beats.** The pizzicato and the woodblock leave exactly those beats | The SFX own the screws; the clock is made of them |
| 86.875 | **THE CLOCK stops dead** on the pivot's creak (`door_pivot_creak` 86.886, beat 2) | "Stop dead at the reveal": the door he couldn't open turns on its pin |
| 86.9 → 91.0 | **the hum swells** (the chair's GPU choir, then the score's, +C5; a +2.5 dB ride), rings 1.0 s over the cut to the empty office (90.0), and **stops at 91.0** (a 0.12 s release) | "The chair's hum swells and rings over the cut" (14.12 L 1.0); "the chair's hum stops where the chair used to be" |

### E02-09 FEEL IT (91.0 → 189.8): the felt, F2.2, the felt again

**His room** (91 → 117.5): P01 DARK ROOM, one felt piano (rootless chords, one a phrase, the pedal re-caught on each) over a sul-tasto cello and viola. Nothing sounds below C3. **F2.2** (117.25 → 175.4) is Alyi's memory, so the score leaves Mas's POV (OST rule 7): no felt, no chip pulse, no swing. It plays the Orb-era glossy colour: the GPU choir (choir aahs and reed organ), glass and its shimmer, ppp, the string lights as celesta and harp, and the Door. **His room again** from the pin.

| s | What plays | Why |
|---|---|---|
| 91.000 | **the felt's first chord where the hum stops**: D♭maj9 (F3 A♭3 C4 E♭4), D♭3 + A♭3 bowed under it | "The chair's hum carries in, then stops"; the felt is his interior. D♭ keeps the choir's root, so the hand-over is the hum's absence |
| 92.250 | B♭m9, 0.33 s before the thread | His three hearts under Alyi's regret post; the two dates. **The thread (92.98–96.34, kind `post`) and Alyi's far line ("Six years and eleven months.", 96.92–99.02) play over a held chord, unscored** |
| 99.125 | **F minor 9**, struck between the far line and V.O. 7; V.O. 7 (100.22) sits inside it, with nothing attacking (−23.7 LUFS) | Now he's the one counting. The count gets no figure: no Mickey-Mousing |
| 103.188 | **A-flat maj9**, on the eighth 0.35 s before TPOOL; the felt's top E♭5 (104.54); **the chip's triangle C5 → E♭5** (104.75) | The early web's brighter A♭ (P10 T2). The chip is his past: his 2006 app still knows him |
| 109.750 | G♭maj7(♯11), 0.38 s before 15.05; the felt's top D♭5 (112.04) | "where u at?", every pin `LAST SEEN: 2012` |
| 113.500 | **D♭ sus(♯11) on the felt; the GPU choir swells in under the pin's ripple** (from −30 dB to its level by the cut). The felt lets go 0.1 s before F2.2 | "The ping's ripple; the choir": the sound lead into F2.2 (seam 18) |
| 117.250 | **F2.2, 0.29 s before the cut**: the choir (D♭ sus2(♯11)), the glass's A♭4 + E♭5, the shimmer, and **the string lights**: celesta eighths cycling A♭ E♭ G D♭ C E♭ A♭ G, a harp under every other one (the lights palette-cycle, never strobe). −19.1 LUFS | The party: warmth. Alyi's "FEEL THE AGI!" ([V]) plays over the same texture, softer, with no melody |
| 121.625 | **the chant's lift**, the first beat 0.5 s after the chant's first word: the choir adds C5 and E♭5, the lights climb an octave, the shimmer thickens. −18.1 LUFS-M | "The chant's giddy lift (warm, never a hymn)". The chant is [V]: texture only, no melody, no hit (judgement call 5). It lifts once the chant is established, so its first word is clear |
| 124.125 | **the exchange**: the lights stop, the choir thins (−6 dB), 0.46 s before 15.07 | "Thinning under the exchange": "You're not chanting." / "someone has to hold the glass." / "Then I'll feel it for both of us." |
| 133.500 | **THE DOOR, whole** (A♭4 D♭5 \| C5 G4, its G held), over the choir, the lights back, softly | His joke check-in, turned to Mas; Mas raises his glass. The Door is whole here because Alyi is present. It never cadences |
| 138.188 | **the racks hum along**: the choir swells (+C5), and **GLYPH's grains** (Ep2's stage: F5 C6 D♭6, straight sixteenths, half of them rests: 10 grains on celesta and a detuned 12.5 % chip pair), 0.31 s before the cut | The racks are the choir. The glyph is on the room, never in his eyes. The SFX's `glyph_shimmer` (G6–F7) keeps its band; the score's grains stay at F5–D♭6 |
| 141.625 | **2023: the choir thins to its no-third chord** (−5 dB, no glass, no lights), the cello's D♭3 under it, 0.38 s before the cut | "Under the post and 'Someone should.'": gravity. The Superalignment post (143.4–150.9, kind `post`) plays dry |
| 156.000 | the viola's A♭3 and the violins' E♭4 join the choir's chord, 0.29 s before 15.12 | The turn begins: his finger, the bare Publish button |
| 161.0 → 164.125 | **THE DOOR again**: A♭4 (161.0), D♭5, C5, then **G4 at 164.125**, 0.21 s before the cut to the click. **The Publish click (164.74) lands on the held ♯4.** −15.3 LUFS-M | "The Publish click on the Door's held ♯4 (warm resolve, no cadence)". The click is the SFX's |
| 166.000 | **the Ache under the choir**: an arco F2 and a cello C3 under it, glass G4 + D♭5, and C6 from the next bar, 0.25 s before the fire. The Door's G rings on into it | "The Ache (D♭ + G over an F pedal) under the fire". The Door's G becomes the Ache's G: resolve and dread together. The flame's whoomph is the SFX's |
| 170.688 | **the glow shrinks to one point**: the bass lets go; the choir thins over 1.6 s to ppp and **holds its no-third chord to the pin**, under the glass (−21.1 LUFS-M, then −32 to −36) | The bed never empties: no dropout before the felt returns (the review) |
| 174.475 | **the sul-tasto F pedal** (cello F3, viola C4) swells in over the choir's hold, 0.9 s before the pin's beat | The return's soft entry (S9) |
| 176.000 | **the felt returns**, a beat after, soft: F (F3 C4 F4, the open fifth), 0.38 s after the pin's cut. V.O. 8 ("i'll ask him in person.", 177.50) sits inside it (−22.9 LUFS). −20.9 LUFS-M | "The felt returns within a bar of the pin"; his plan, with nothing attacking |
| 180.167 | **D♭maj9 as he goes**, on a swung and 0.29 s before 15.18: the felt's A♭4, then **C5 on the bar (181.0)**, the chip's triangle under the C | A determined evening: the knee's leap A♭ → C, with no F after it. The door's close (183.41) is the SFX's |
| 184.750 | **the stairs: thin to the pedal** (F3 + C4, the felt rests), 0.25 s before the cut. The buzz (186.2) is the out; the pedal fades under the receipt's chatter (189.0, the SFX's J 1.0 s) into the band's push | "Thins to its pedal on the stairs; the buzz is the out" |

### E02-10 THE BRIDGE (189.8 → 320.0): SET-PIECE SWING, the full band, the DREAD out

P11 SET-PIECE SWING, swung. **The grid's bar line is NopeAI's doors (190.0)**, in 4-bar phrases. The engine is a walking upright (with contrabass pizzicato), the jazz kit's ride, vibes comping and **the Build** on the chip (Gerg's arpeggio, straight sixteenths, compiling). Brass hits come only at phrase ends in the clear. **The full band plays only for the run, a pickup and two bars.**

| s | What plays | Why |
|---|---|---|
| 189.792 | **the swung push into the doors**, 0.21 s before the cut: vibes Fm11, the upright's F2, the ride's bell, a light brass tap. Designed hit | "Arrive on NopeAI's front doors, the receipt already pouring out … the band in". The receipt's chatter (J 1.0 s) is the SFX's |
| 190.0 → 194.17 | the walk (Fm11, Fm11), the ride, the vibes; **the Build compiles**: 4 notes (190.63), then 8 (192.5) with the violins' pizzicato under it. −16.6 LUFS | The doors; the Forecaster walks up from the street |
| 194.167 | **THE FULL BAND's pickup**: a brass shout (trumpets, trombones, tenor sax) on the swung and, 0.25 s before the run's cut, and again on the and-of-4. Designed hit | "The episode's one full-band stretch, at its peak only (≤ 2 bars)": the receipt down the hill and across five lanes |
| 195.0 → 200.0 | **two bars, full band**: crash, ride and snare, the walk, the horns, brass hits on 1, the swung 2&, and 4; **the Build whole, twice, in octaves with the violins** (chip F5, spiccato violins F4). **The peak (197.5) on C7(♯9♭13)**. −13.2 LUFS-M, after a −3.5 dB ride | "The Build's chip lead in octaves with the violins; brass hits at phrase ends". P11: "the peak is on C7(♯9♭13), then the stop" |
| 199.792 | **the phrase's last stab** (C7(♯9♭13), the and-of-4). Designed hit. **Then THE CUT-OFF on the downbeat (200.0)**; the honk (200.22) lands in the gap | The traffic stops on the receipt, so the band stops. The cut-off is the score's only comic tool (OST rule 1); the honk is the SFX's |
| 200.0 → 204.375 | **the stall: a C pedal** (arco bass C2, cello C3, viola G3: an open fifth), through the card. `freeze_hit_F` (202.0) sits a fourth above it. −24.9 LUFS | The card, `THE FORECASTER / EX-NOPEAI.`; `AT STAKE: ~$2M`. "The stakes land before the pen does" |
| 204.375 | the band again, thin: a vibes C7sus and the upright's C, 0.42 s before 17.04 | |
| 205.0 → 230.0 | **a two-feel** (half notes on the upright, legato), **an arco bass holding each bar's root under it** (the floor), the ride soft with the hat on 2 and 4, the vibes comping softer under talk; Fm11, D♭maj9(♯11), C7sus, B♭m9, E♭9, A♭maj9. **No lead, no brass hit under his terms or the driver.** −18.7 LUFS | Respect: "I don't forecast that far." The phrase ends land inside lines, so they get no hits. The band never empties before a bar line (the review measured a 24–30 dB pump at 217.6–222.6) |
| 226.250 | **the horns' soft D♭ chord** (A♭3 C4 E♭4 F4), on the beat after "Already did…" ends. −16.2 LUFS-M | Respect, with no hit. The pen withdrawing is the SFX's |
| 230.0 | Mas sees it: the upright walks quarters again, the kick feathers in | His phone, lit |
| 232.917 | **THE SCRAMBLE**, on a swung and 0.29 s before 17.08: the band drops to **the bass in swung eighths** (an F pedal: F F C F A♭ F E♭ G) **and the Build**, pass by pass (4, 8, 12, 8; 16, 8). No drums, no vibes | "The band drops to the bass and the Build's chip lead, busier on the same grid" |
| 240.33 → 243.77 | **his call**: the Build out, the bass at 62 % (−18.7 LUFS-M) | "Ducks under his call line": he is heard acting |
| 244.375 | **the draft**: the pedal moves a mediant down (F → D♭), 0.17 s before 17.10; the Build compiles again (16, then 8) | Frantic hands |
| 249.43 → 252.91 | **V.O. 9** on his still face: the Build out, the bass on (−24.7 LUFS) | The still face over the fast inside. Nothing attacks on the words |
| 253.542 | **the swing returns**, on a swung and 0.17 s before 17.12 (A♭maj9, D♭maj9(♯11), B♭m9, E♭9sus), thin under the forecast, the arco root under each bar | "Median: an apology, within the hour, in lowercase." No hit on the laugh |
| 263.542 | his thumb over Post: **a held E♭9sus** (strings sul tasto, the arco bass), 0.29 s before 17.13. V.O. 10 sits inside it (−23.4 LUFS) | "not until legal has every name." Nothing attacks |
| 268.542 | **one held chord through the night**: D♭maj9 (the strings, the arco D♭2, the bowed vibes), 2 s, 0.29 s before the cut | "One held chord through the night (2 s)" |
| 270.625 | **the bass pedal** (F2, C2 on 1 and 3, the cello's F3 a whisper under it), 0.21 s before the next afternoon | "Thins to the bass pedal under the posts". His posts (272.43–281.63) play dry. **The honks take the phrase ends** (274.93, 276.03, 279.03, 281.58: no brass anywhere). "Updating." and the driver's "Does honking count as disparagement?" get no hit; the honk behind him (287.39) is the SFX's button |
| 288.125 | **a pad in the rain, five voices**: four sul-tasto strings and the bowed vibes. D♭maj9 (D♭3 A♭3 C4 F4, vibes E♭5 G5): the thunder (`thunder_tuned_F`, 295.98) finds an F4 in it | "A pad in the rain": pathos. A played room, not a synth pad |
| 298.125 | B♭m9 (D♭3 F3 A♭3 C4, vibes D♭5 F5) | The ink runs |
| 300.625 | **the chip, once**: the Build's tag (C5 → F5, the knee's fourth) on a thin 12.5 % pulse, far | The show's stamp, small, in the rain |
| 305.312 | G♭maj7(♯11) (G♭2 D♭3 F3 B♭3, vibes C5 F5), on the eighth 0.27 s before 17.19 | The voice menu: his thumb finds VOICE 5 |
| 307.583 | **his thumb taps Pause: the pad's fifth voice (the bowed vibes) stops**, on `ui_pause_tap`; four voices hold | VOICE 5 paused, inside the music: no hit, no notification (judgement call 7) |
| 310.0 → 315.3 | the pad holds, no change | NopeAI's post, two fragments (kind `post`): dry |
| 315.625 | **the pad thins to its pedal** (F3 + C4), the first beat after the post's window | The blimp sags. Its first three running lights (316.02, 316.72, 317.42) get no music |
| 318.217 | **THE DREAD STING** on the blimp's last light (`dread_sting`'s own time): the Ache on a detuned 12.5 % chip pair (G4, D♭5, C6), glass G4 + D♭5, the grand's F2 and C3, a sub F1, a timpani F2. Designed hit. −15.2 LUFS-M | P08 DREAD (chip, no third), "one stab, then air". **The score plays the claimed `dread_sting`** (it is not on the SFX board). The act-out kinds rotate: Act One rang THE COPY into its black, Act Two stopped mid-phrase, and Act Three ends on DREAD |
| 318.2 → 320.0 | its air rings into the black, faded over the last 0.35 s | The black's J 1.2 s (the beacon's motor, the quartet's first pizzicato) belongs to Act Four |

## The sync points (all read from the lock; the score re-lays itself)

| Lock event | s | What the score does |
|---|---|---|
| Act Two's lock: its designed stop (B('12.08') + 2.0) | −0.792 | the first tick on the first grid beat after it (−0.625); the pre-lap file starts there |
| `screw_turn_1` (14.11) | 81.25 | THE CLOCK's grid (a bar line); the four screws take four beats |
| e2-a3-0004 ("leave them up.") | 11.71–12.50 | the G step waits until after it (13.125) |
| the presser: 13.04 → 13.05 | 19.29–27.75 | a tiny bed (−5 dB ride, the tick at 45 %), no change; its lower third ([H]) the record |
| 13.06, 14.01, 14.05, 14.09 (cuts) | 27.75, 31.0, 49.0, 70.83 | A♭, C, F/C, Ekiel's colour: each pre-lapped 0.21–0.38 s |
| 14.04 (his reflection) | 43.79 | the Door on the beat (43.75) |
| `chair_hum_choir` (14.07) | 56.79 | the hum (claimed); the D♭ pedal on the eighth before the cut (56.56) |
| Ekiel's post (14.10, kind `post`) | 74.85–80.25 | the pedal alone from 74.375; the clock back on the first beat after the window (80.625) |
| `door_pivot_creak` (14.12) | 86.886 | the clock stops on its beat (86.875) |
| 14.12's L cut (the plan: `over_s` 1.0) | 90.0 → 91.0 | the hum rings over and stops; the felt's downbeat (E02-09's bar line) |
| the thread (15.02, kind `post`); Alyi's far line; e2-vo-07 | 92.98–96.34; 96.92–99.02; 100.22 | B♭m9 before them; F minor struck between the far line and V.O. 7 |
| `pin_ping` (15.05) | 113.12 | the choir swells in from the next bar (113.5) |
| 15.06 (F2.2), the chant e2-a3-0010 | 117.54; 121.03 | F2.2 at 117.25; the lift on the beat nearest the chant (121.0) |
| 15.08 (the check-in) | 132.04 | the Door from the first bar line 0.4 s after it (133.5) |
| 15.14 (the click's cut); `post_click` | 164.33; 164.74 | the Door's G at 164.125 (0.21 s before the cut), its A♭ five beats earlier (161.0) |
| 15.15, 15.16, 15.17, 15.18, 15.19 | 166.25 … 185.0 | the Ache, the glow, the felt, D♭, the pedal: each pre-lapped 0.25–0.35 s |
| 15.19's J cut (the plan: `lead_s` 1.0) | 189.0 | the pedal fades under the receipt's chatter into the push |
| 17.01 (NopeAI's doors) | 190.0 | E02-10's grid (a bar line); the push 0.21 s before it |
| 17.02 (the run) | 194.42 | the full band's pickup (194.167) |
| 17.04, 17.08, 17.10, 17.12, 17.13, 17.14, 17.15 | 204.79 … 270.83 | re-entry, scramble, mediant, swing, held chord, night, pedal: each pre-lapped 0.17–0.42 s |
| e2-a3-0019 (his call), e2-vo-09, e2-vo-10 | 240.33, 249.43, 265.38 | the Build out; the V.O. rides |
| 17.17, 17.18, 17.19 | 288.58, 298.58, 305.58 | the pad's changes |
| `ui_pause_tap` (17.19) | 307.583 | VOICE 5 (the bowed vibes) stops |
| NopeAI's post (17.20, kind `post`) | 310.3–315.3 | no change; the pedal after it (315.625) |
| `dread_sting` (17.21; the last `blimp_lights_off`) | 318.217 | the DREAD sting |

**Re-timing [M]:** dry builds on two scratch copies of the lock, re-timed:
- copy (a): 13.02 +0.7 s, 14.03 −0.6, 14.10 +1.1, 15.04 +0.9, 15.12 −0.5, 17.02 +1.3, 17.09 +0.8, 17.15 −1.2;
- copy (b): 13.01 −0.5, 14.07 +0.9, 14.11 −0.4, 15.08 +1.2, 15.16 +0.6, 17.04 −0.9, 17.13 +1.0, 17.19 +0.7.

Both re-laid every mark to the moved events: the screws and the clock's grid, the stop on the creak, the hum's stop, the felt's downbeat, the Door's G before the click, the push, the full band's pickup, the scramble, the night, the pause and the DREAD. Note QA stayed clean in all three cues (no written third, knee 0/0). The first tick's J follows the screws' phase: 0.625 s here, 0.708 on copy (a) and 0.25 on copy (b). It is always the first grid beat at least 0.06 s into Act Two's black.

## Measured

| Section | s | LUFS-I | True peak |
|---|---|---|---|
| E02-08 1 the black, the staffers (F) | 0 → 13.1 | −20.8 | −8.0 |
| E02-08 2 "leave them up.", the flyer (G) | 13.1 → 19.3 | −20.0 | −7.5 |
| E02-08 3 the presser: a tiny bed | 19.3 → 27.5 | −26.0 | −13.9 |
| E02-08 4 the walk-off (A♭), the threshold (C) | 27.5 → 30.6 | −20.7 | −7.0 |
| E02-08 5 the open floor (the pizzicato) | 30.6 → 43.75 | −19.4 | −6.3 |
| E02-08 6 the reflection: THE DOOR | 43.75 → 48.75 | −18.5 | −7.1 |
| E02-08 7 DOT's cuff; the note | 48.75 → 56.6 | −19.8 | −7.0 |
| E02-08 8 the chair: the hum, the GPU choir; Bukaj | 56.6 → 70.6 | −20.3 | −7.7 |
| E02-08 9 Ekiel: the card; his post (the pedal) | 70.6 → 80.6 | −21.6 | −6.2 |
| E02-08 10 the screws: the Ache | 80.6 → 86.9 | −20.1 | −6.5 |
| E02-08 11 the pivot: the stop; the hum's swell | 86.9 → 91.0 | −20.8 | −7.0 |
| E02-09 1 the empty office (D♭, B♭ minor) | 91.0 → 99.1 | −19.8 | −3.2 |
| E02-09 2 the far line; V.O. 7 inside F minor | 99.1 → 103.2 | −21.8 | −3.2 |
| E02-09 3 TPOOL (A♭); the map (G♭); the ripple | 103.2 → 117.25 | −19.8 | −3.4 |
| E02-09 4 F2.2 the party; the chant's lift | 117.25 → 124.1 | −19.6 | −6.1 |
| E02-09 5 the exchange; the check-in's Door | 124.1 → 138.2 | −22.3 | −7.5 |
| E02-09 6 the racks: GLYPH's grains | 138.2 → 141.6 | −20.3 | −9.6 |
| E02-09 7 2023: the no-third chord | 141.6 → 161.0 | −19.6 | −6.0 |
| E02-09 8 the turn: the Door's ♯4 under the click | 161.0 → 166.0 | −17.8 | −5.9 |
| E02-09 9 the fire: the Ache; the glow; the choir's hold | 166.0 → 175.4 | −21.2 | −5.9 |
| E02-09 10 the pin (F); V.O. 8; D♭ as he goes | 175.4 → 184.75 | −19.7 | −3.5 |
| E02-09 11 the stairs: the pedal | 184.75 → 189.8 | −21.1 | −8.8 |
| E02-10 A the doors | 189.8 → 194.2 | −16.8 | −3.3 |
| E02-10 B the run: THE FULL BAND; the cut-off | 194.2 → 200.0 | −15.8 | −3.2 |
| E02-10 C the stall (the C pedal) | 200.0 → 204.4 | −25.1 | −9.4 |
| E02-10 D the refusal (the two-feel, the arco floor) | 204.4 → 232.9 | −18.7 | −4.3 |
| E02-10 E the scramble | 232.9 → 253.5 | −18.5 | −5.7 |
| E02-10 F the forecast; V.O. 10 | 253.5 → 268.5 | −19.0 | −4.9 |
| E02-10 G the night | 268.5 → 270.6 | −22.6 | −11.1 |
| E02-10 H the posts (the bass pedal) | 270.6 → 288.1 | −22.8 | −6.3 |
| E02-10 I the rain (the pad) | 288.1 → 315.6 | −22.1 | −9.1 |
| E02-10 J the pedal; the DREAD; the black | 315.6 → 320.0 | −22.2 | −3.2 |
| **whole stem** | 0 → 320.0 | **−19.93** | **−3.15** |

- **Engine masters (underscore):** E02-08 −20.5, E02-09 −20.0, E02-10 −19.5 (each reads within 0.03 of its target).
- **Balance, piano · orch · big band · chip** (the engine's gated metric; rhythm excluded):
  - E02-08: 0 · 97 · 0 · 3
  - E02-09: 19 · 74 · 0 · 8
  - E02-10: 1 · 71 · 11 · 17
- **Momentary peaks (LUFS-M)** [M]:
  - E02-08: the head −17.1; the presser −24.4; the threshold −16.4; the Door −16.2; the chair −16.6; Ekiel's post −21.9; the screws −15.9; the hum's swell −18.9.
  - E02-09: the felt −13.9; TPOOL −14.0; the ripple −13.7; the party −14.2; the lift −18.1; the exchange −19.7; the check-in's Door −15.2; the racks −18.5; 2023 −17.7; the turn's Door −14.3; the fire −15.4; the glow −21.1; the choir's hold −32 to −36; the felt's return −20.9; as he goes −13.2; the stairs −18.7.
  - E02-10: the doors −12.8; the full band −13.2; the stall −21.0; the refusal −13.6; the respect −16.2; the scramble −14.1; his call −18.8; the draft −15.3; V.O. 9 −23.6; the forecast −14.6; V.O. 10 −22.3; the night −19.8; the posts' entry −16.4; the rain −17.8; the pause and NopeAI's post −20.7; the DREAD −15.3.
- **The V.O. windows** [M]: V.O. 7 −23.6 LUFS, V.O. 8 −22.9, V.O. 9 −24.9, V.O. 10 −23.5. The engine's guide is −24 ± 2.
- **The dialogue pocket** [M]: the engine's 2–6 kHz band reads −18.5 dB (E02-08), −24.7 (E02-09) and −23.0 (E02-10); the guide is ≤ −15. Per line in 1–4 kHz after the mix's duck (`e02-v1-common/pocket.py`): every one of the act's 28 lines has at least **+11.2 dB** at its onset (10th percentile +12.3; before the duck +4.6). The underscore masters also carry the engine's −2 dB pocket at 2.5 kHz.
- **The pump at the two-feel's bar lines** [M] (50 ms RMS: the lowest in the 0.5 s before each bar line against the highest in the 0.2 s after), 205–263 s: 7–17 dB, median 10.0 (the review: up to 30).
- **The mix's duck:** by mood, E02-08 9 dB, E02-09 7 and E02-10 9 under speech (`mix_episode.py`'s table). No `duck_db` override is asked for.
- **The cut check** [M]: no step of 12 dB or more at any cut. The cut-off at 200.0 is not a cut; the card's cut at 201.0 falls inside the stall's pedal.
- **Mood shares by scored time** (320 s) [J]:

  | Mood | Where | Share |
  |---|---|---|
  | wry, playful, comic scale | sc 13; the open floor; the bridge's doors, run, refusal, forecast and posts | about 40 % |
  | warm, sincere, lonely, quiet | the Door; the chair; his room; F2.2's party, check-in, 2023 and turn; the pin and the stairs; the night; the rain | about 43 % |
  | suspense and dread | Ekiel and the screws; the fire; the scramble; the DREAD | about 17 % |

  Suspense stays a minority (S2). Across the episode it is about 15 % against the plan's "about a third": an open question for the showrunner's proxy (above, and manifest.md §6).

## Judgement calls (rules bent on purpose, one line each)

1. **The first tick's J is 0.625 s, not the plan's 0.8.** THE CLOCK's grid is locked to the four screws (one a beat, Ep1's rhythm), so the first tick takes the first grid beat inside Act Two's black. The grid beat at −1.25 would sound over Act Two's held line.
2. **The step to G lands 0.21 s after the flyer's cut, not before it.** The pre-lap point falls inside "leave them up.", and no change lands inside a line of his.
3. **Some changes are not pre-lapped by about 0.25 s:** the Door blooms on the beat 0.04 s before 14.04; the screws' door enters 0.375 s after its cut (Ekiel's post runs to it); the pad's pedal enters 0.21 s after 17.21 (NopeAI's post runs to it). The record and the beat come first.
4. **F2.2 has no felt, no chip pulse and no swing** (OST rule 7: his POV is left). E02-09's chip there is GLYPH's ten grains on the room.
5. **The chant's lift plays under the [V] chant** (two more choir voices, the lights an octave up, the shimmer thicker) because the plan asks for it ("the chant's giddy lift"). It is texture only: no melody, no hit, no stinger (OST rule 10), and it waits until the chant is established (0.6 s in), so its first word is clear.
6. **The Door plays whole in F2.2, twice** (the check-in; the turn). The manifest's "first note missing" belongs to WHERE'S ALYI? (sc 14), Alyi's absence. In the memory he is there. Neither statement cadences.
7. **VOICE 5 is the pad's fifth voice**, and it stops on his pause tap. The plan says "a pad in the rain" and "no bonk, no notification". This is inside the music, not a hit on the tap.
8. **The presser is read as "a tiny bed"** (the clock thinned and ridden −5 dB, no change), not as an invented media bed. A Senate press conference has no music of its own.
9. **E02-10's short-term p95 is −16.6** (the engine's underscore guide is −17). The doors and the run are the episode's S3, featured (P11: featured −16, the peak −14 LUFS-M; measured −12.6 and −13.2).
10. **E02-09's felt attacks peak about −14 LUFS-M** (as he goes −13.3). The felt was lowered 4 dB and its velocities softened, but the chords carry the room's level. Act Two's dark room peaked at −13.9.
11. **E02-08's chip share is 3 %** by the gated metric (P04's guide is 30). Its chip is the clock's irregular "seconds", 43 noise ticks, short and sparse, which the metric under-counts. The tick itself is pizzicato and woodblock, as P04 specifies.
12. **The full band is a pickup and two bars** (the and-of-3 into beat 4, then two bars). The ≤ 2 bars are the bars; the pickup pre-laps the run's cut.

## For the other passes

- **Mix:**
  - **The head.** `designed_hit` at 0.0 (THE CLOCK's third tick), so `mix_episode.py`'s head fade is 0.04 s, not 1.2. Act Two wrote no ring-out.
  - **The pre-lap (`render/music-el-prelap.wav`, 0.792 s).** It belongs under Act Two's black, from Act Two's designed stop (278.208 on Act Two's clock) to its last sample (279.0). THE CLOCK's first tick sounds at 278.375 (Act Three's −0.625). It runs continuously into `music-el.wav`'s first sample. Act Two's black is digital zero in its stem (`silences_designed`); **`mix_episode.py` lays this file on Act Two's score bus** (`score_bus`: the next chapter's pre-lap, ending on Act Two's last sample, at this act's head gain), and this act's head fade is off (the review found it unused). Its entry is also recorded in `cues-el.json` → `prelap`.
  - **No ring-out.** The DREAD's air fades over the act's last 0.35 s. The black's J 1.2 s (the beacon's motor, the quartet's first pizzicato) is Act Four's own pre-lap to write.
- **SFX:** the score claims two sounds the SFX board doesn't have (`claims_sfx`; `stems.py` reads them):
  - `14.07:chair_hum_choir` (the chair's hum as the GPU choir, diegetic into score);
  - `17.21:dread_sting` (the DREAD out).

  The score leaves room for, and never doubles:
  - `screw_turn_1`–`4` (14.11): THE CLOCK's grid is anchored on them and its tick leaves those four beats. Keep them dry and on time;
  - `door_pivot_creak` (14.12): the clock stops on its beat; keep its attack;
  - `freeze_hit_F` (14.09 over the F pedal; 17.03 a fourth over the C pedal);
  - `thunder_tuned_F` (17.17): the pad carries F4 there. Tune it to F, never A;
  - `car_honk_1`–`5`: they take the phrase ends; nothing is tuned to them;
  - `blimp_lights_off` ×4: no music on the first three, the DREAD on the fourth;
  - every bonk, verb click, scroll, ping, key tap, the Publish click and the flame.
- **Picture:** the stop and the swell assume the pivot's creak (14.12) and the plan's L 1.0 s into the empty office. If picture moves the creak, the clock follows it.
- **The engine (`e02-v1-common/`, not edited):** two findings for the other segments:
  - The cello's pizzicato and spiccato samples carry A2 (~111 Hz) and A3 (~215 Hz) body resonances that fail the spectral F-major check over an F pedal (render 1). This track notches them (and 440 Hz) on its own copies of the tracks.
  - The brass `*_stac` samples speak about 12 ms in, so a brass-only designed hit misses the 10 ms hit check. This track sets their `latency_ms` to 11.
- **The record on screen** is Act Two's `record_windows()` widened to kind `lower-third` (a broadcast's own caption). A quote counts only in a post, a document or a caption, so the invented check-in `"feel the agi"` (kind `ui`) is not the record.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act3/track.py --dry --el          # the lock's runs, every mark, note QA
MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act3/track.py --render --el
#   (--render clock | feel | bridge: only those cues; then it re-lays, measures and writes the pre-lap)
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act3/track.py --assemble --el     # re-lay render/_work/el, measure
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                   # the segment checks (PASS)
```

Render times through `heavy.sh` [M]:

| Cue | Time |
|---|---|
| E02-08 the clock | 46–56 s |
| E02-09 feel it | 45–60 s |
| E02-10 the bridge | 96–172 s |

E02-09 is built after the other two, because it starts on E02-08's hum stop and fades into E02-10's push. After any re-lock, re-render all three: every sync point comes from the lock (S5). A render started from an interactive shell's job control was stopped by a signal once (exit 147). Run it with stdin from `/dev/null` (or under `setsid`), as above.

## For an ear, in order

1. **−0.6–13 s:** the tick is a clock in a lobby, not a countdown cliché (no tick sample, no heartbeat). Its first beat in the black reads as the re-entry Act Two's stop promised.
2. **19–27.5 s:** the presser is a tiny bed; the tenth sticker gets no music.
3. **30.6 s:** the C as the band lights reads as the knee's leap, not a stinger.
4. **43.75–49 s:** the Door through the door: lonely, his own face; never a hymn.
5. **56.8–62 s:** the hum reads as the chair's, then opens into the choir.
6. **80.6–87 s:** the screws are the clock's ticks; the Ache is a chill, not a horror sting. The stop on the creak lands.
7. **87–91 s:** the hum swells over the cut and stops where the chair used to be; the felt is the room he's left in.
8. **91–117 s:** the felt is his interior, never a sad-piano cliché; the chip's two notes on TPOOL are small.
9. **117–124 s:** the party is warm and giddy, never a hymn; the lift is with the chant, not on it.
10. **133.5–138 s and 161–166 s:** the Door over the check-in is warm; the Publish click lands on the held G; the Ache under the fire is dread, not horror.
11. **170.7–185 s:** the choir's hold after the glow is a held breath, not a gap; the F pedal leads the felt's return, which is soft, not a bloom; D♭ and the leap as he goes read as a decision.
12. **189.8–200 s:** the band is the show's own (the chip Build, a walking upright, vibes, a brass shout), never lounge; the full band only for the run; the cut-off reads as the traffic stopping, not as a gag. **205–263 s:** with the arco floor the two-feel is continuous, not stop-start, and still not lounge (S1).
13. **233–253 s:** the scramble is frantic in the hands and quiet under his voice.
14. **268.5–270.6 s:** one held chord is the night.
15. **288–318 s:** the rain pad is a played room; VOICE 5 leaving is felt, not noticed.
16. **318.2 s:** the DREAD is one stab, then air.

## Rules checked

[M] measured, [J] judged.
- **S1:** every cue names its motif and its mood (the cue sheet above) [J]. The show's own sound throughout:
  - the knee's cells: the rising F G A♭ C as the clock's dyads; the leap A♭ → C as he goes; the Build (the flat-line pair and the kink); the Build's tag (the fourth);
  - the chip in every cue (the clock's seconds; TPOOL's triangle and GLYPH's grains; the Build and the DREAD);
  - the leitmotifs: the Door three times (first note missing, then whole, twice), the GPU choir, the Ache twice, THE CLOCK;
  - the hybrid orchestra (sul-tasto strings, pizzicato and spiccato, clarinet, flute, harp, celesta, glass, choir, timpani, a sub) and the jazz colour (swing, a walking and two-feel upright, vibes, quartal and extended chords, a brass shout);
  - no third.

  No lounge: the band is vibes, upright, chip and brass hits, not a piano trio. No generic pads: the sustained colours are played strings, bowed vibes, the choir and glass [J; ears 8, 12, 15].
- **S2:** suspense is about 17 % of the scored time [J].
- **S3:** one run for the act; 0 holes (under −60, and under S3's own −42 dBFS for 0.3 s: the check that missed the glow's dropout now runs), 0 fragments (measured), 0 digital silence. The music thins and ducks under lines rather than stopping. The two stops are punctuation with sound under them: the clock on the creak (the hum carries on) and the cut-off on the traffic (the C pedal carries on) [M].
- **S4:** the act's sound leads: the clock's tick under Act Two's black (J 0.625 s); the choir under the pin's ripple; the pedal under the receipt's chatter into the push [M].
- **S5:** every layer is anchored to the lock's events and the plan's cuts, and the re-timed locks re-lay [M].
- **S9:** laid to the lock's frames. The designed hits are marked: the head's tick, the push, the full band's pickup, its last stab, and the DREAD. Soft entries: the strings' silent attacks, the choir's swells, the felt after the hum, and the felt's return at the pin after the F pedal (no step over 5 dB in 0.3 s) [M].
- **S11:** the story sounds keep their room: the screws, the creak, the bonks, the click, the honks, the thunder and the blimp's lights [J].
- **OST rules:**
  - 1: no comic scoring. Nothing lands on the tenth sticker, a bonk, the forecast's laugh, the honks or "Updating."; the cut-off is the run's only joke [J/M].
  - 4: the knee is never whole [M].
  - 6: the clock and the machine are straight; the band swings [M].
  - 7: F2.2 leaves his POV (no felt, chip pulse or swing); the felt returns within a beat of the pin [M].
  - 10: the record plays dry under every post and the presser's lower third; nothing attacks under the V.O. [M].
  - 11: the score plays only the two sounds it claims [M].
  - 12: no A-natural anywhere [M].
- **Guardrails:** no music gives Alyi a reason (W8). F2.2 scores what he wanted (the party's warmth, the gravity, the click and the fire), and the Door never cadences [J]. Nothing tells what Mas knew: his call and the V.O. play over the band thinned, with no comment [J].
- **R10:** every render went through `heavy.sh` with `OST_WORKERS=2`, `MRMAS_MAX_LOAD=40` and `MRMAS_HEAVY_MEM_MAX=6G`, one at a time [M].
- **R1:** Ep1 untouched. The score pass wrote only `audio/ost/tracks/e02-v1-act3/`; the review's fixes also touched Ep2's `e02-v1-common` (the lock hash, the per-line pocket, S3's −42 dBFS scan) and `audio/reel/ep02-v1/mix_episode.py` (the pre-laps). Ep1's tracks were read, never edited.
- **R8:** nothing heard.
- **Broken on purpose:** the twelve calls above.

**Resource ask (R16, non-blocking):** one human listen of the sixteen points above, ears 4, 9, 10 and 12 most of all. Whether the GPU choir reads as a tech cathedral rather than a hymn, and whether the band reads as the show's swing rather than lounge, are an ear's calls.
