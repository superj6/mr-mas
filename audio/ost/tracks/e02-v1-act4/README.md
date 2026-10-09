# e02-v1-act4 · Ep2 v1 Act Four "as a guest" (sc 18–22) · the music stem

**The score pass, 2026-10-09.** Four renders, laid on the EL lock (the master, `show/reel/ep02-v1-el/ep02-v1-el-act4.json`: 7,656 frames, 319.00 s) with the `e02-v1-common` engine (composer X's `v3lib`), plus a pre-lap file for the quartet's first pizzicato under Act Three's black and a ring-out file for the act's out:

| Render | Cue | Scenes |
|---|---|---|
| `e02-11-leverage-quartet` | E02-11 LEVERAGE, QUARTET: one performance through sc 18–20 | 18, 19, 20 |
| `e02-11b-keynote-bed` | E02-11's diegetic layer: ELPPA's walk-on bed, through the lobby's wall screen, then the campus PA | 19 |
| `e02-11c-f21-band` | E02-11's F2.1 layer: the ERA T2 band through the 16-bit sample-chip | 19 (F2.1) |
| `e02-12-one-door` | E02-12 ONE DOOR | 22 |

E02-11b and E02-11c are layers of E02-11's one performance, on its grid. They are separate renders because one is played through two in-world speakers at the lay-in, and the other is the 16-bit sample-chip, which cost about 90–110 s per track over a full-length render (708 s for the first render; 283 s without it).

**Nothing here has been listened to.** Every number below is measured [M]. The musical calls are judged [J]. The "For an ear" list says what only a person can check.

**The brief:**
- **The cue list:** [manifest.md §6](../../../../show/episodes/ep02/production/v1/manifest.md#6-score-cues), E02-11 and E02-12.
- **The scenes and the mood map:** [proposal.md](../../../../show/episodes/ep02/production/v1/proposal.md) sc 18–22, "The feeling curve" and "The seams".
- **The script's MUSIC lines** (script-v1.md sc 18–22), **the beat plan's J and L cuts** (17.21 J 1.2, 18.15 J 0.8, 19.06 L 0.8, 19.20 L 0.6, 20.05 J 0.8, 20.10 J 1.0, 22.09 J 1.0) and **the lock's music runs** (`track.py --dry --el`).
- **The notes from the earlier segments:**
  - Act Three ends on the DREAD sting at 318.217 and writes no ring-out. The black's J 1.2 s (the beacon's motor and the quartet's first pizzicato) is this act's to write, as `render/music-el-prelap.wav`; since the score review `mix_episode.py` lays it on Act Three's score bus.
  - The act-outs so far: THE COPY ringing into black (Act One), a stop mid-phrase (Act Two), DREAD (Act Three). Act Four uses a fourth kind: **the Door's ♯4 left open, ringing over the match cut into the tag** (`render/music-el-ringout.wav`).
  - The engine normalises each cue to its `underscore_lufs`, so the sections are shaped with the macro fader rides (Act Three's `ride_macro`, copied).
  - The cello's pizzicato bodies (A2, A3) are notched on a copy of `vc`; the brass `*_stac` samples get `latency_ms` 11.
  - The Door "through the door" is MM-09's `door_post` on a copy of the flute; the GPU choir is built on `engine.sampler.GU`, preset 52.
  - Renders run under `setsid` with stdin from `/dev/null`, through `heavy.sh`.

The mood map, in order:

| Scene | Mood |
|---|---|
| 18 | a jolt of truth and a held breath; then comedy and a dry chill |
| 19 | a giddy cheer, a small thrill (his post), a lonely call, nostalgia and a pang, wit, a pang at the gate |
| 20 | a laugh, a smile at the rope, then a jolt and his still face deciding |
| 22 | stillness, a held breath, and the one quiet ache |

## The render

| | |
|---|---|
| `render/music-el.wav` | **319.000 s, 15,312,000 samples (7,656 frames × 2,000), exact.** 48 kHz / 24-bit stereo, git-ignored |
| `render/music-el-prelap.wav` | **1.200 s**: Act Three's black, its last 1.2 s (318.8 → 320.0 on Act Three's clock). The quartet's first pizzicato sounds at −1.042 s. It runs straight into `music-el.wav`'s first sample. Peak −12.2 dBFS. See "For the other passes" |
| `render/music-el-ringout.wav` | **2.600 s**: E02-12 past the act's last frame (the flute's held G4 and the D♭ fifth's release), a cos^1.5 fade. The act's last 5 ms are not faded, so it runs straight on from the stem's last sample. Peak −10.9 dBFS |
| Level | −20.22 LUFS-I; true peak −3.60 dBTP; short-term p95 −17.91, max −16.59 |
| `check.py` (with the review's new checks) | `act4 7656 f 319.000 s exact=True lock=True −20.22 LUFS-I −3.60 dBTP \| silence 0 holes 0 holes-42 0 frag 0 (runs 3) \| 12 dB steps 1 unmarked 0 \| F-major True rule12 True knee 0/0 \| pocket p10 16.4 min 12.4 fail 0 exempt 0 \| PASS` |
| Engine QA, every cue | F-major OK, written and spectral (E02-11's worst raw A/F 0.59 is explained: partials of written notes, the dyad's D5 and the bass's F). Rule 12 OK: no A-natural is written anywhere. Knee whole 0, completions 0. Every hit mark has an onset within 10 ms (3/3, worst 3.0 ms). The sub under the lobby's morning (`server_hum` stand-in) reads −49.7 dB against a −18 limit. No warnings left |
| Music runs | **three, by design:** 0 → 267.3 (E02-11), 282.95 → 307.4 and 312.95 → 319.0 (E02-12). The two gaps are the plan's two designed silences, marked in `silences_designed`. No unmarked digital silence, no hole under −60 dBFS, no fragment |
| `cues-el.json` | the cue sheet: each layer's window, sync marks and events, the designed hits, the designed silences, `claims_sfx`, the sections, the record on screen, the pre-lap's and ring-out's entries, the measurements and the engine QA. It names the timeline it was laid to |

The Kokoro lock (`show/reel/ep02-v1/`) was not rendered, because the film is the EL lock.

## The score review's fixes (2026-10-09)

| Finding | What changed | Result [M] |
|---|---|---|
| **E02-12 opened on A♭4, described as "the Door's missing first note, given by his own piano"**: the stated intent supplies the absence the leitmotif rule protects in Ep2 (first note missing until Ep11) | the lot's first felt note is **E♭4**, the D♭ fifth's 9th (open, no third), and the walk-up's note **B♭3** (a fourth down: quartal, still); no A♭ in the lot's first phrase. The descent still reaches A♭3 at the very end, under his back crossing the lot, an octave below and never at the Door's head (the flute's Door keeps its first note missing) | judgement call 12 rewritten |
| **Three picture times were estimates in the code alone** (S5) | **the lot** = 22.01 + the beat plan's own `arrive.s` (2.0 s, "the white and the falling pin"), which the picture draws its arrival to; **the quartet's end** = the lock's `sticky_flutter` (20.09: the note flutters down once the complaint has gone; was `rope_haul` + 1.0 s), so the pedal lifts on a lock sound; **his hand lowers** at 22.08 + 2.0 s (frame 48 of the shot), now written into the beat plan's 22.08 picture note, which the picture draws from | all three in `cues-el.json` → `picture_sync` (seconds and frames); the times are unchanged except the quartet's pedal lift (265.6, was 265.1) |
| **The pre-lap was never laid** (seam 20: Act Four opened mid-texture at −15.6 LUFS-M after the DREAD's air, a +15 LU step on a hard act break) | `mix_episode.py` lays `music-el-prelap.wav` on Act Three's score bus from 318.8, at this act's head gain, and this act's head fade is off | on the score bus: Act Three's last 400 ms and this act's first 400 ms read −21.3 and −15.5 LUFS-M (was −33.9 and −15.6), a sample jump of 0.003 |

## What plays (the cue sheet)

EL seconds, on the segment's own clock (0 = Act Four's first frame). **One grid for E02-11, E02-11b and E02-11c:** 96 BPM, straight, its bar lines on the garden's 4-bar phrases (19.16 at 192.708, then every 2.5 s back to the black). Chord changes that land on cuts pre-lap them by the latest eighth at least 0.15 s before the cut; they measure 0.21–0.42 s [M], with one exception (judgement call 3). No change lands inside a V.O., a line of his, a real line or the record on screen.

**The record on screen** (from the lock and the plan): the board's quoted card (24.45–28.35), Ekiel's highlighted line (71.45–75.55), his post (134.64–141.24), the ad's end card `"WHERE YOU AT?"` (174.66–176.78), Nole's post (233.22–240.42), the docket tab (260.89–262.99) and Alyi's post (269.6–273.9, under no music). **Real lines:** Neleh's two (e2-a4-0001, 0002).

### E02-11 LEVERAGE, QUARTET (−1.04 → 267.3): one performance through sc 18–20

P03 LEVERAGE as a string quartet: **straight pizzicato eighths** on varied pitches in a 3+3+2 grouping (the cello on eighths 1 and 4 and under C3, the viola above; MM-11's cells), **a muted 808** (`k808` through 150 Hz with a muted bass drum, on beat 1 and the and-of-3 of every other bar; never a kit), **the violins' close dyad** sul tasto, a semitone up each time the leverage moves, and **one soft chip noise tick** on some eighths. LEVERAGE's only gesture is the drop-out: "the stop is the move".

| s | What plays | Why |
|---|---|---|
| −1.042 | **the quartet's first pizzicato**, in the pre-lap file, one beat into the J: B♭ minor eighths | "Under the black, the lighthouse beacon's motor and the quartet's first pizzicato pre-lap (J 1.2 s)" (17.21) |
| −0.417 | **the Lighthouse cell** (marimba + harp: F4 B♭4 D♭5 in quarters, a 3-note cell across 4/4) | The lighthouse full frame: the beam sweeps one step a beat. Misanthropic's home room (OST §2.8) |
| 0.208 | **the 808's first thud** on the lighthouse's first bar line. **Designed hit** | The act's head is already playing; `mix_episode.py`'s head fade drops to 0.04 s |
| 5.521 | **F**: the eighths and the 808 move to F (0.23 s before 18.02); the Lighthouse cell stays behind | The beam sweeps across the NopeAI boardroom's window: the same morning, another room |
| 7.396 | **the TV: thin to the pedal** (0.35 s before 18.03). No eighths, no 808: F2 + C3 sul tasto, and a high violin "harmonic" (C6, Neleh's colour, OST §2.16) entering under the pedal before her first word. −20.9 LUFS | "Under Neleh's voice and the card the quartet thins to its pedal." Her words (real) and the board's card play dry: no melody, no change |
| 28.958 | **the harmonic rises a semitone** (C6 → D♭6), after the card's read, on his face | "A held breath (his face)". It moves only after the record has cleared |
| 30.717 | the harmonic goes with Terb's TV click; the pedal holds under "First item." | |
| 31.771 | **the split: LEVERAGE back** (0.40 s before 18.07): the eighths, the 808 (from 32.708), the violins' dyad C5 + D♭5. −19.2 LUFS | The rhyme on one action, and the committee's procedure |
| 33.958 | an 808 thud on the beat the lanyards drop (`lanyard_drop` 33.942, both panes) | The rhyme lands on a beat. It is the 808's own beat, not a hit on the lanyard |
| 35.7 → 49.3 | Terb's first task and the roll call: the eighths at 72 % under the talk | |
| **49.458** | **"present.": THE 808 DROPS OUT** (its last thud 49.271). The quartet carries on alone | "The 808 drops out on 'present.'" P03: drop out on the turn |
| 50.208 | the dyad a semitone up (D♭5 + D5), on the beat after "present." | The leverage moved |
| 58.333 | after "also present.": a semitone up again (D5 + E♭5). Mada's second word; the table's held breath; **V.O. 11** (60.07) inside the bed, the eighths softer and a −3 dB ride (−23.0 LUFS) | The V.O. sits inside the bed; nothing attacks on the words |
| 62.708 | **RIGHT: Mario's pane, B♭ minor** (0.21 s before 18.11): **Mario's Addendum** on the viola's pizzicato (B♭ C D♭ F \| E♭. D♭ C B♭), the cello's off-beats, a soft arco bass on B♭1, the violins' D♭5, the Lighthouse cell beside it, the chip a triangle bass only. **Statement 1:** the head and a one-bar tail (C D♭, rest), 62.7–70.2 | "Mario's Addendum (B♭ minor; it gains a bar each time) and the Lighthouse cell (marimba and harp)" |
| 71.45 → 75.55 | Ekiel's highlighted line ([V]): the Addendum rests; the cell and the bass hold | The record plays dry |
| 75.833 | **Statement 2 gains a bar:** the tail climbs C D♭ E♭ F, then G♭, and stops (75.8–85.8). The scroll falls the stairwell (82.29) inside the tail's climb | Never a cadence. The scroll's gag gets nothing of its own |
| 85.833 | **Statement 3** starts, a bar longer again… | |
| **88.958** | **…and is cut off** before "It's that we might win." (89.18): the stop. **The dry chill:** the Ache (glass G4 + D♭5) swells in, silent attack, over an arco F1 and the cello's C3, under the line. −21.2 LUFS-M at most | "A dry chill under 'It's that we might win.'" The Ache comes after a laugh (OST rule 9); the stop is the score's only comic tool (rule 1) |
| 92.083 | LEFT: the reminder (`ELPPA · KEYNOTE · JUN 10`): the F eighths again, softly | The deal comes due |
| 94.2 | **the keynote's walk-on bed (E02-11b) comes up under the quartet** (18.15 J 0.8 s) | "The keynote's walk-on music comes up under it (J 0.8 s)" |
| 94.583 | **the lobby: the deal day's A-flat cycle** (0.42 s before 19.01; an E♭9sus pickup into A♭ maj9 on the bar at 95.208): two bars each of A♭maj9, D♭maj9(♯11), B♭m9, E♭9sus. The quartet alone (no 808), **the violins' pizzicato double stops on the 3+3+2 accents** (giddy). −20.2 LUFS | "The quartet alone under the keynote's own walk-on bed". The giddy cheer, in brighter colours away from F (P09's rule: never F major) |
| 119.4 → 124.6 | the stream's roar, the lobby's cheer on "profit", "Upside.": no change, no hit | The cheer and the cut-off are the picture's and the SFX's |
| 132.042 | the campus: the cycle goes on; the bed moves to the campus PA (L 0.8 s) | |
| **134.583** | **THE STOP: his post.** The eighths stop dead on the first eighth after `post_click` (134.542). The quartet holds an A♭ pedal (A♭2 E♭3, C5 E♭5 sul tasto) under his post (dry) and **V.O. 12** (144.0, −22.2 LUFS) | "The quartet thins to its pedal under his post." The stop is the move: he takes the day's coverage from the lawn |
| 147.708 | **the call:** the eighths back on the bar after V.O. 12, cello and viola only, softer; the violins' C5 held. −21.8 LUFS | "A lonely, funny call". His lines are dry: nothing moves under them |
| 164.197 | "You ever miss being up there?": the eighths thin to the cello alone | Gerg's weighted question |
| 169.896 | after "they let me hold the clicker." (0.23 s before 19.11): the eighths stop; **the quartet holds its A♭ pedal** (A♭2, E♭3) through F2.1 | "F2.1 … over the quartet's held pedal" |
| 187.328 | LAST UPDATED 2012: the band (E02-11c) is gone; the pedal alone, −1 dB (−21.4 LUFS) | The pang |
| 191.458 | the garden's pickup on the first violin (E♭4 F4 G4), the chord's push on the and-of-4 (192.396, 0.31 s before 19.16) | "Back from the memory … the quartet takes the garden-party arrangement" |
| 192.708 | **THE GARDEN, phrase 1** (4 bars, on the beat's own 10.0 s): D♭maj7(♯11) \| G♭maj9 \| E♭m9 \| A♭9sus. The first violin's tune (light, arco), the viola's broken-chord eighths (spiccato), the second violin's held tones, the cello's pizzicato on 1 and 3; the chip's square doubles the phrase's top note. −19.4 LUFS | "The same quartet as a garden-party arrangement (never a wedding march)": no processional rhythm, no oom-pah. The ♯11 is its one wrong element |
| 202.708 | **phrase 2** (4 bars): the tune asks (its G5, the ♯11, held), then answers. The flowers' nods and CHATGTP's chip blips are the SFX's | The garden's wit: the guest asks first |
| 212.396 | **phrase 3: one violin** (D♭5, sul tasto; 0.31 s before 19.18) under Radnus and "as a guest." (−22.4 LUFS) | "Thinning to one violin." The plan's V.O. there was cut at the script review; the exchange takes its place |
| 219.583 | Radnus's held smile: the violin falls a semitone (D♭ → C) | The pang begins |
| 221.146 | **the gate: the cello's C pedal** (C2, arco, sul tasto), the violin's C handed down to it (0.23 s before 19.19); the viola's C3 joins on the lock's turn (223.349). It carries across the fold into sc 20 (L 0.6 s) | "The cello's pedal on the gate, carried into sc 20." A pang at the gate |
| 228.958 | **zAI: the muted 808 returns** under zAI's drone, on C1, on the beat 0.04 s before 20.01; a sparse chip tick | "The cello pedal; the muted 808 under zAI's drone" |
| **233.217** | **Nole's short fanfare** (the score plays the claimed `nole_fanfare_short`, 0.2 s after his lamp's click at 233.017): the Launch's quartal stack C4 F4 B♭4 E♭5 on staccato trumpets, a chip burst, a timpani C3; the E♭5 falls off, **one note short of A♭5**. **Designed hit.** −14.4 LUFS-M | "Nole's lamp click and his short fanfare the only motifs" (OST §2.7). It is done within 0.6 s, before his post can be read |
| 233.2 → 240.4 | Nole's post (the record): dry. The pedal and the 808 at 75 %, no tick, no change | |
| **246.210** | **the padlock snaps on his own phone: THE 808 DROPS OUT** (its last thud 245.208). The buzzing in the cage and the lamp going off get nothing | The stop is the move, and this one is his own. "A laugh": the picture's |
| 249.583 | **the lobby's morning: the C pedal resolves to F** (0.33 s before 20.05): the quartet's pedal F3 C4 G4 C5, sul tasto, nothing below C3 under the lobby's hum. **V.O. 13** (256.95, −22.7 LUFS) and the docket tab play inside it, no change. −21.0 LUFS | "The lobby's morning under the quartet's pedal" |
| 265.1 | the complaint rises out of frame (`rope_haul` + 1.0 s): the pedal lifts | "The quartet ends as the complaint leaves frame" |
| **266.000** | **the cello's last pizzicato, C3**, on the `(FOR NOW)` note's landing. **Designed hit.** C, not F: the dominant, left open | "The cello's last pizzicato on the note's landing." No THUD: the THUD means "filed" |

### E02-11b the keynote's walk-on bed (94.2 → 171.0): diegetic

ELPPA's walk-on bed, an original media bed in the show's own design (MM-21's family). OST rule 5: it crosses cuts, so it is on 96, on E02-11's grid and on its two-bar cycle (A♭, D♭ lydian, B♭m, E♭sus), so the two always agree. It is glassy and polite: a warm synth pad, a Rhodes ostinato in straight eighths, a soft sub on the bar, a cabasa, a rim on beat 4, a glock tick every four bars. There is no four-on-the-floor, no clap, no ukulele and no stock rising piano. Rendered dry at −24, then laid twice:
- **94.2 → 132.84, the lobby's wall screen:** `futz` tv, −3.5 dB. J 0.8 s, faded in. **−26.1 LUFS alone [M]**, about 6 dB under the quartet.
- **132.04 → 171.0, the campus PA far off:** `futz` pa (the arena slap), low-passed at 2.6 kHz, mono, −7 dB, crossfaded across 19.06's L 0.8 s. It goes with the push into his phone (19.11 + 0.9 s). **About −30 LUFS alone [M]**.

### E02-11c F2.1, the sample-chip band (170.8 → 188.7)

P10 ERA T2 (MM-06 II, the title's 2008 bar): **the band through the 16-bit sample-chip** (BRR, a 144 ms echo): a sample-chip piano, an upright, brushes and a chip lead, **swung** (the eighths measure 10 frames late). The colours are A♭maj9, D♭maj9 and E♭9sus, the early web's brighter A♭. There is no F in its bass and no cassette piano or boom-bap. It plays over E02-11's A♭ pedal. −18.3 LUFS (featured), −14.7 LUFS-M at most.

| s | What plays | Why |
|---|---|---|
| 170.833 | **the band comes in on the quartet's own chord** (A♭maj9), on the beat nearest `render_front_sweep` (170.925) | P10: the render front upgrades the same chord. Here it goes back into the past |
| 172.708 | **the young Water Line** on the sample-chip piano: F G-F G-F, the nudge twice, "a little cocky" (OST §2.2, Ep 2–3). The chip's 50 % square doubles the nudges. It finishes before the ad's end card | The 2006 phone ad: young Mas grins, the pin bobs |
| 174.66 → 176.78 | `"WHERE YOU AT?"`: the band comps, no lead | The record plays dry |
| 177.708 | **the Water Line again, settling** (C4 at 180.208, F4 held from 180.833) as the 2008 stage fills, the clicker is caught (179.17) and TPOOL's map fills with pins | The 2008 stage: he held the clicker because they let him |
| 184.217, 185.064, 185.912, 186.759 | **the pins grey, one note a pin**: the chip and the sample-chip vibes fall A♭5 G5 F5 E♭5, each a step lower and 22 % dimmer; the band drops away under them | "Each grey pin a step dimmer on the sample-chip's falling figure". The SFX's `pin_grey_tick` keeps its own sound |
| 187.328 | LAST UPDATED 2012: the band is gone (faded by 188.7) | The pang. No cause is claimed |

### Room tone only (266.35 → 282.98): the designed silence

The quartet has ended. Under the dark room's Jun 19 post (Alyi's own act, W8) and the hard cut to white, there is room tone only. The plan says: "under the dark room's Jun 19 post, room tone only; hard cut to white on the pin" and "room tone only, then the first piano note as the lot appears". It is marked in `silences_designed`, and its re-entry is E02-12's first felt note.

### E02-12 ONE DOOR (282.98 → 319.0, and the ring-out)

P01 DARK ROOM, sparse: one felt note a phrase (pedal down) over a sul-tasto D♭ fifth (D♭3 + A♭3, ppp, very slow silent attacks). The Door has its first note missing, on non-vibrato flute, "through the door" (MM-09's `door_post`: low-passed, the room on one side). The GPU choir sounds under the glimpse. The grid's bar 2 is the lot's first note.

| s | What plays | Why |
|---|---|---|
| 283.000 | **the first felt note, E♭4, alone in the sky** (22.01 + the plan's 2.0 s arrival: the pin falls at 281.43); the D♭ fifth begins under it, 3 s attacks. −25.1 LUFS | "Room tone only, then the first piano note as the lot appears." The D♭ fifth's 9th: open, no third, and no A♭ (judgement call 12) |
| 288.0, 293.0 | the felt's B♭3 (he walks up, never running: a fourth down), D♭4 (the Orb scans and toasts nothing) | One note a phrase |
| 295.500 | **THE DOOR, its first note missing:** D♭5 (2 beats), C5, then **G4 held** (the ♯4), under the band's `Use flyer on door` (295.0–299.2). −16.5 LUFS-M | The Door "through the door" under the game's verb for it |
| 300.5 | the felt's C4: the flyer out of his jacket, unfolded | |
| 302.149 | **the GPU choir swells in on the flap's lift** (D♭3 A♭3 E♭4 G4 C5, choir aahs + reed organ, ppp, full by the glimpse at 303.58); **the Door's held G becomes the choir's G**. −20.3 LUFS | "The GPU choir under the glimpse." Alyi at work, absorbed, never looking up. Nothing gives a reason |
| **307.388** | **THE DESIGNED STOP:** every voice and tail to zero 0.02 s before `mail_flap_spring_shut` (307.408) | "The flap's shutting plays in room tone only (the designed stop)." Marked in `silences_designed` |
| 307.39 → 313.0 | room tone only: Mas at the shut flap; he raises a hand to knock | |
| **313.000** | **the return as his raised hand lowers** (22.08 + 2.0 s, frame 48 of the shot: up by its first beat, held two, lowering; the plan's 22.08 note now says so): the felt's B♭3, a chip triangle doubling it 10 dB under, the D♭ fifth back with 1.2 s silent attacks | "The cue returns as his raised hand lowers." A soft entry (S9) |
| 314.250 | **THE DOOR again**, its first note missing: D♭5, C5 (315.5), **G4 held from 316.125 across the walk and over the cut**; the felt's A♭3 (315.5). −16.6 LUFS-M | "The Door resolves with no cadence across the walk (it cadences only in Ep11)" |
| 318.0 → 319.0 | the Door's last bar; the dark room's drone fades up under it (22.09 J 1.0 s, the stems') | |
| 319.0 → 321.6 | **the out: the G rings on into the tag** (`render/music-el-ringout.wav`), with the D♭ fifth's release | The act-out: the open ♯4, unresolved, over the match cut (his back on the lot → his back at the desk). A different out from the three before it |

## The sync points (all read from the lock; the score re-lays itself)

| Lock event | s | What the score does |
|---|---|---|
| 17.21's J (the plan: `lead_s` 1.2) | −1.2 | the pre-lap file starts there; the first pizzicato on the first grid beat inside it (−1.042) |
| 19.16 (the garden's first phrase) | 192.708 | E02-11's grid: a bar line, so the garden's two 4-bar phrases are the beat's own 10 s each |
| 18.02, 18.03, 18.07, 18.11, 19.01, 19.11, 19.16, 19.18, 19.19, 20.05 (cuts) | 5.75 … 249.92 | each change pre-lapped 0.21–0.42 s |
| `tv_click_off` (18.06) | 30.717 | the harmonic goes with the TV |
| the board's card (18.05, the record) | 24.45–28.35 | the harmonic's semitone rise waits for its end (28.958) |
| `lanyard_drop` (18.07) | 33.942 | an 808 beat (33.958) |
| e2-a4-0006 "present." | 49.458 | the 808's last thud before it |
| e2-a4-0008 "also present."; e2-vo-11 | 56.71; 60.07 | the dyad's second shift after it; the V.O. ride |
| Ekiel's highlighted line (18.12, the record) | 71.45–75.55 | the Addendum rests; statement 2 on the first beat after it |
| e2-a4-0016 "It's that we might win." | 89.18 | the Addendum's stop on the beat at least 0.2 s before it (88.958); the Ache under it |
| `ui_toast_pop` (18.15) | 92.02 | the F eighths from the beat after the Ache |
| 18.15's J (the plan: `lead_s` 0.8) | 94.2 | the keynote bed's entry |
| `post_click` (19.07) | 134.542 | THE STOP on the next eighth |
| e2-vo-12 | 144.0–147.69 | the call's eighths on the bar after it |
| e2-a4-0028 | 164.197 | the cello alone |
| `render_front_sweep` (19.11) | 170.925 | the band on the nearest beat |
| the ad's end card (19.12, the record) | 174.66–176.78 | the Water Line before it; again on the bar after it |
| `pin_grey_tick` ×4 (19.14) | 184.217 … 186.759 | the falling figure, one note a pin |
| `LAST UPDATED 2012` (19.14) | 187.328 | the band out |
| 19.06's L (the plan: `over_s` 0.8) | 132.04–132.84 | the bed's wall screen → campus PA crossfade |
| `lock_big_turn` (19.19) | 223.349 | the viola joins the cello's C |
| `nole_fanfare_short` (20.02), `lamp_click` | 233.217, 233.017 | the Launch (claimed) |
| `padlock_snap` (20.03) | 246.21 | the 808's last thud before it |
| `rope_haul`, `(FOR NOW)` (20.09) | 264.1, 266.0 | the pedal lifts at +1.0 s; the last pizzicato on the note |
| 22.01, `pin_fall` | 281.0, 281.429 | the lot's first note at 283.0 (22.01 + 2.0, at least `pin_fall` + 1.2) |
| `ui_band_on`, `Use flyer on door` (22.03) | 295.0, 295.4 | the Door on the bar line after the verb (295.5) |
| `mail_flap_lift` (22.04) | 302.149 | the choir's swell |
| `mail_flap_spring_shut` (22.06) | 307.408 | THE DESIGNED STOP, 0.02 s before |
| 22.08 | 311.0 | the return at +3 beats (313.0) |
| 22.09 | 314.208 | the Door again on the next beat (314.25) |
| 22.09's J (the plan: `lead_s` 1.0) | 318.0 | the Door's last bar (the stems' drone) |

**Re-timing [M]:** dry builds on two scratch copies of the lock, re-timed:
- copy (a): 18.03 +0.7 s, 18.08 −0.6, 18.13 +1.1, 19.04 +0.9, 19.10 −0.5, 19.14 +1.3, 20.03 +0.8, 20.08 −0.4, 22.04 +0.6;
- copy (b): 18.01 −0.5, 18.10 +0.9, 19.07 −0.4, 19.16 +1.2, 19.19 +0.6, 20.07 −0.9, 22.02 +1.0, 22.07 +0.7.

Both re-laid every mark to the moved events: the grid on the garden's phrase, the pre-lap's first beat (J 0.667 on copy (a)), the TV's pedal, "present.", the Addendum's stop, the stop on his post, the band and the pins, the garden, the gate, the fanfare, the padlock, the last pizzicato, the lot, the designed stop and the return. Note QA stayed clean in all four cues (no written third, knee 0/0). A longer garden phrase 2 (copy (b)) made the one violin take over where the eight bars end, which is now in the code.

## Measured

| Section | s | LUFS-I | True peak |
|---|---|---|---|
| E02-11 A1 the black's pre-lap; the lighthouse (B♭) | 0 → 5.5 | −18.9 | −5.0 |
| E02-11 A2 the beam crosses the boardroom (F) | 5.5 → 7.4 | −21.3 | −8.7 |
| E02-11 B1 Neleh, the card: the pedal, the harmonic | 7.4 → 29.0 | −20.9 | −7.8 |
| E02-11 B2 his face; "First item." | 29.0 → 31.8 | −21.8 | −10.5 |
| E02-11 C1 the split, the lanyards; Terb | 31.8 → 49.5 | −19.2 | −3.8 |
| E02-11 C2 "present."; "also present."; V.O. 11 | 49.5 → 62.7 | −21.4 | −9.0 |
| E02-11 D1 Mario: the Addendum, the Lighthouse cell | 62.7 → 85.8 | −19.4 | −4.7 |
| E02-11 D2 statement 3 cut off; the chill | 85.8 → 92.1 | −20.4 | −6.0 |
| E02-11 E1 the reminder | 92.1 → 94.6 | −21.5 | −6.4 |
| E02-11 E2 the lobby (+ the keynote bed) | 94.6 → 132.0 | −20.2 | −4.1 |
| E02-11 E3 the campus | 132.0 → 134.6 | −19.7 | −5.3 |
| E02-11 F his post: the pedal; V.O. 12 | 134.6 → 147.7 | −20.6 | −8.5 |
| E02-11 G the call | 147.7 → 169.9 | −21.8 | −7.8 |
| F2.1 (E02-11c over E02-11's pedal) | 169.9 → 187.3 | −18.4 | −4.5 |
| E02-11 H2 LAST UPDATED 2012; the pedal | 187.3 → 192.7 | −21.4 | −9.7 |
| E02-11 I1 the garden, phrases 1 and 2 | 192.7 → 212.4 | −19.4 | −3.6 |
| E02-11 I2 one violin | 212.4 → 221.1 | −22.4 | −11.7 |
| E02-11 J1 the gate: the cello's C | 221.1 → 229.0 | −21.1 | −9.5 |
| E02-11 J2 zAI: the 808, the fanfare, his post | 229.0 → 246.2 | −19.5 | −4.4 |
| E02-11 J3 the padlock; the pedal | 246.2 → 249.6 | −19.7 | −10.4 |
| E02-11 K the morning; V.O. 13; the last pizzicato | 249.6 → 266.8 | −21.3 | −8.5 |
| E02-12 1 the lot; the walk-up | 283.0 → 295.5 | −25.1 | −10.1 |
| E02-12 2 the Door under the verb | 295.5 → 302.1 | −19.6 | −7.1 |
| E02-12 3 the glimpse: the choir | 302.1 → 307.4 | −20.2 | −9.3 |
| E02-12 5 the return; the walk: the Door | 313.0 → 319.0 | −20.7 | −7.0 |
| **whole stem** | 0 → 319.0 | **−20.22** | **−3.60** |

- **Engine masters (underscore):** E02-11 −20.5, E02-11b −24.0, E02-11c −21.0, E02-12 −21.5 (each within 0.03 of its target).
- **Balance, piano · orch · big band · chip** (the engine's gated metric; rhythm excluded):
  - E02-11: 0 · 81 · 11 · 8 (the big band is the Launch's 0.6 s in its section);
  - E02-11b: 42 · 58 · 0 · 0 (diegetic: ELPPA's);
  - E02-11c: 0 · 0 · 0 · 100 (the sample-chip);
  - E02-12: 20 · 77 · 0 · 3.
- **Feel [M]:** E02-11's eighths are straight (the off-beats measure 7.5 frames: LEVERAGE, the machine's time); E02-11c's are swung (10 frames: the people, his past).
- **Momentary peaks (LUFS-M)** [M]: the lighthouse −14.2; Neleh's pedal −17.2; the committee −14.4; Mario −15.6; the chill −21.2; the lobby −16.2; his post −18.2; the call −18.3; F2.1 −14.7; the garden −13.1; one violin −19.2; the gate −16.8; zAI −14.4; the fanfare −14.4; the morning −19.1; the last pizzicato −17.8; the lot −21.4; the Door −16.5; the glimpse −19.0; the return and the walk −16.5.
- **The V.O. windows** [M]: V.O. 11 −23.0 LUFS, V.O. 12 −22.2, V.O. 13 −22.7. The engine's guide is −24 ± 2.
- **The dialogue pocket** [M]: the engine's 2–6 kHz band reads −18.9 dB (E02-11), −22.7 (E02-11b), −32.1 (E02-11c), −30.2 (E02-12); the guide is ≤ −15. Per line in 1–4 kHz after the mix's duck (`e02-v1-common/pocket.py`): every one of the act's 38 lines has at least **+12.4 dB** at its onset (10th percentile +16.4; before the duck +7.4).
- **The mix's duck:** by mood, E02-11 9 dB and E02-12 7 under speech (`mix_episode.py`'s table). No `duck_db` override is asked for.
- **The cut check** [M]: one step of 12 dB or more, at 20.10 (267.0, −14.0 dB), inside the marked silence: the dark room's room tone after the last pizzicato.
- **Mood shares by scored time** (297.8 s) [J]:

  | Mood | Where | Share |
  |---|---|---|
  | comic, giddy, witty | Mario and the Addendum; the reminder, the lobby, the campus; the call; the garden's phrases | about 37 % |
  | warm, nostalgic, quiet, sincere | his post's pedal; F2.1 and LAST UPDATED; one violin and the gate; the morning; E02-12 | about 34 % |
  | intrigue, tension, dread | the lighthouse and the committee (LEVERAGE); Neleh's pedal; the chill; zAI | about 29 % |

  Suspense stays a minority (S2). Across the episode it is about 15 % against the plan's "about a third": an open question for the showrunner's proxy (manifest.md §6).

## Judgement calls (rules bent on purpose, one line each)

1. **The first pizzicato's J is 1.042 s, not 1.2.** E02-11's grid is the garden's 4-bar phrase, so the first pizzicato takes the first grid beat inside Act Three's black; the pre-lap file itself is the full 1.2 s.
2. **The lanyards drop on beat 3, not a downbeat.** The garden's phrases fix the grid, and the drop sits on a beat (16 ms off). The plan asks for a shared beat in both panes, not a bar line.
3. **zAI's 808 enters on the beat 0.04 s before 20.01**, not 0.25 s. Its entry is a thud, and a thud before the cut would sound over the garden's fold.
4. **Nole's short fanfare starts with his post's pop** (the plan puts `nole_fanfare_short` there). It is 0.6 s of the Launch, done before the post can be read; the post itself plays dry.
5. **Neleh's "harmonic" is a held tone under her real words**, part of the pedal and never a melody; it moves (C6 → D♭6) only after the board's card, on his face.
6. **The Addendum is the viola's pizzicato under Mario's lines**, not a solo violin lead: the pane is wall-to-wall talk, so the melody stays in a low, soft pizzicato line, and it rests under the highlighted line (the record). It gains a bar each time (three bars, then four), and the third statement is cut off by the stop.
7. **The dry chill is the Ache** (G + D♭ over F) under "It's that we might win.", with a silent attack: the plan's "a dry chill", and dread after a laugh (OST rule 9).
8. **The keynote's walk-on bed is the score's own diegetic render.** There is no SFX for it, and the plan calls it an original media bed. Its glassy synth pad is ELPPA's music (the satire's target, rule 1.7's corporate-pretty lane), never the score's own colour.
9. **The young Water Line is split by the ad's end card** (the record plays dry), and returns, settling, on the 2008 stage.
10. **The pins' falling figure lands on the SFX's ticks.** The plan asks for exactly this ("each grey pin a step dimmer on the sample-chip's falling figure"). It is a figure on the record of his app, not a hit per object anywhere else.
11. **F2.1's band has no F in its bass** (A♭, D♭, E♭). In render 3 an Fm9 bar read 0.09 A/F from the sample-chip upright's ~111 Hz grit, over the 0.08 limit.
12. **E02-12's first felt note is E♭4, not the Door's head.** The first version opened on A♭4 and called it "the Door's missing first note, given by his own piano"; the score review read that intent as supplying the absence the leitmotif rule protects until Ep11, so the lot's first phrase has no A♭ (E♭4, B♭3, D♭4, C4). The flute's Door keeps its first note missing and never cadences. The line's last note, A♭3 under his back crossing the lot, is the bottom of a falling line, an octave under the Door's register and never followed by its D♭.
13. **The 808 drops out on the padlock as well as on "present."** The plan names only the first; the second is the same LEVERAGE gesture on Nole's own move (his phone locked away from him).
14. **The last pizzicato is C3, not F**: the dominant, left open ("for now"). The suit comes back in the tag.
15. **Three picture times are shared numbers, not estimates** (the score review; the picture for Act Four is not drawn yet): the lot appears at 22.01 + the plan's `arrive.s` (2.0 s); the quartet's pedal lifts on the lock's `sticky_flutter`; his hand lowers 2.0 s into 22.08 (frame 48), written into the beat plan's 22.08 picture note. `cues-el.json` → `picture_sync` lists them with their frames. If the picture changes one, change the plan (and re-lock); the score re-lays from it.
16. **The act's out is a ring-out** (the open ♯4 into the tag), a fourth kind after THE COPY, the stop and DREAD. OST P08 lists "a pre-lap" and "the kink" (an unresolved fragment); this is the Door's own unresolved end, carried over the match cut.
17. **The bed thins under the call** to the cello and viola, and finally the cello alone. The plan's "the quartet alone under the keynote's walk-on bed" holds for the whole span; under the call, alone means thinner.

## For the other passes

- **Mix:**
  - **The head.** `designed_hit` at 0.208 (the 808's first thud), so `mix_episode.py`'s head fade is 0.04 s, not 1.2. The quartet is already playing from the pre-lap.
  - **The pre-lap (`render/music-el-prelap.wav`, 1.200 s).** It belongs under Act Three's black, from Act Three's 318.8 to its last sample (320.0); its first pizzicato sounds at Act Three's 318.958, 0.74 s after the DREAD sting (its air rings on underneath). It runs straight into `music-el.wav`'s first sample. **`mix_episode.py` lays it on Act Three's score bus** (`score_bus`: the next chapter's pre-lap, ending on Act Three's last sample, at this act's head gain), and this act's head fade is off. Its entry is recorded in `cues-el.json` → `prelap`.
  - **The ring-out (`render/music-el-ringout.wav`, 2.600 s).** `mix_episode.py` already lays a previous chapter's `music-el-ringout.wav` at the next chapter's head and crossfades it out over 2.5 s from that chapter's own score entry. So the tag's head carries the Door's G for up to 2.6 s, under the dark room's drone. The act's last 5 ms are not faded, so the seam is continuous.
  - **The designed silences** (266.35–282.98, 307.39–313.0) are digital zero in the stem; the stems keep the room tone under both.
- **SFX:** the score claims one sound the SFX board doesn't have (`claims_sfx`; `stems.py` reads it): `20.02:nole_fanfare_short` (Nole's Launch, tuned to the C pedal). The score leaves room for, and never doubles:
  - `pin_grey_tick` ×4 (19.14): the falling figure puts one chip note on each (A♭5 G5 F5 E♭5). Tune each tick a step lower, never to A;
  - `post_click` (19.07): the eighths stop on the next eighth; keep its attack;
  - `padlock_snap` (20.03): the 808 drops out there; keep it dry;
  - `mail_flap_spring_shut` (22.06): the designed stop. The music is at zero from 0.02 s before it to the return, so the flap plays in room tone only;
  - `lanyard_drop` ×2, `tv_click_off`, `lamp_click` ×2, `lock_big_turn`, `render_front_sweep` (F4 → F6: the band enters on the quartet's A♭ chord under it), `rope_haul`, `pin_fall`, the chip blips, the cheer, the laugh, the buzzing: none gets a hit.
  - The keynote's walk-on bed is the score's (E02-11b), not an SFX.
- **Picture:** judgement call 15's three times (`cues-el.json` → `picture_sync`): the lot's arrival at the plan's 2.0 s (frame 6,792 of the act), the quartet's end on `sticky_flutter` (6,374), his hand lowering 2.0 s into 22.08 (frame 48 of the shot; 7,512 of the act), as the plan's 22.08 note now says. The lanyards' drop should stay on the shared beat (33.958).
- **The tag's composer:** the ring-out (the flute's G4 and the D♭ fifth releasing) crossfades out under your score's entry; it needs nothing from you. The act-outs so far: THE COPY, a stop mid-phrase, DREAD, and now the open ♯4 ring-out. The tag's plan ("cut on the downbeat to black") is a fifth kind.
- **The engine (`e02-v1-common/`, not edited):** findings for the other segments:
  - The cello pizzicato carries a fixed body resonance at 109.9 Hz that Act Three's 111.3 Hz notch misses over an F bass (render 1: sieved A/F 0.57). This track adds `('peq', 109.9, -12, 16)` to its `vc` copy.
  - A cello pizzicato C3 used as a designed hit speaks about 22 ms after its mark with the default 6 ms compensation. This track puts the hit on its own copy with `latency_ms` 20 (render 2: within 3 ms).
  - The 16-bit sample-chip post (`snes_*`) runs over the whole render buffer, about 90–110 s a track on a 272 s cue. Render a short T2 passage as its own cue (here 16–20 s instead of about 490 s).
  - The sample-chip upright's grit near 111 Hz fails the spectral F-major check over an F bass (0.085–0.09) even with two notches. Keep F out of a T2 bass.
  - `futz` (tv) adds about 3.5 dB of loudness to a dry bed (its drive normalises to the peak), so a diegetic bed through it needs its own trim.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act4/track.py --dry --el          # the lock's runs, every mark, note QA
MRMAS_MAX_LOAD=40 MRMAS_HEAVY_MEM_MAX=6G OST_WORKERS=2 setsid bash ops/heavy.sh \
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act4/track.py --render --el < /dev/null
#   (--render leverage | keynote | f21 | door: only those cues; then it re-lays, measures, writes the pre-lap and ring-out)
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act4/track.py --assemble --el     # re-lay render/_work/el, measure
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                   # the segment checks (PASS)
```

Render times through `heavy.sh` [M], with other projects holding the load at 10–14:

| Cue | Time |
|---|---|
| E02-11 the quartet | 283–370 s (708 s with the sample-chip tracks inside it, render 1) |
| E02-11b the keynote bed | 187 s |
| E02-11c the F2.1 band | 16–20 s |
| E02-12 one door | 21 s |

E02-11b and E02-11c read E02-11's events (its grid, its cycle, its pedal times), so build them after it; `build_all` does. After any re-lock, re-render all four: every sync point comes from the lock (S5).

## For an ear, in order

1. **−1.0–7.7 s:** the pizzicato under the black reads as the act's first sound, and the lighthouse as LEVERAGE: the machine's eighths, never a heartbeat or a ticking cliché.
2. **7.4–31.8 s:** the pedal under Neleh is a held breath, not a sad cue; the harmonic's semitone on his face is felt, not noticed.
3. **49.5 s:** the 808 dropping out on "present." reads as the move.
4. **62.7–89 s:** the Addendum gains a bar under Mario without fighting his lines; the stop before "It's that we might win." and the Ache under it are a dry chill, not a horror sting.
5. **94.6–134.5 s:** the lobby's pizzicato is giddy, not lounge or corporate cheer; the keynote bed reads as ELPPA's music on a TV, under the quartet.
6. **134.6 s:** the stop on his post lands as his move; the pedal under the post and V.O. 12 is a small thrill, not a swell.
7. **147.7–170 s:** the call is lonely and a little funny; nothing moves under his lines.
8. **170.8–189 s:** F2.1 sounds like a memory, not a video game; the young Water Line is cocky; the pins' figure is a pang, not a game-over.
9. **192.7–221 s:** the garden is witty and polite: never a wedding march, never a processional; the one violin under the exchange; the semitone fall on the held smile.
10. **221–229 s:** the cello's C on the gate is a pang.
11. **233.2 s:** the fanfare is Nole's, short, one note short; not a gag.
12. **246.2 s:** the 808's drop on the padlock; the buzzing gets nothing.
13. **249.6–266 s:** the morning pedal under V.O. 13; the last pizzicato on (FOR NOW) is a smile, not a stinger.
14. **266.4–283 s:** the silence under Alyi's post and the white is room tone, and it holds.
15. **283–307 s:** the felt notes are sparse and still, never a sad-piano cliché; the first, E♭, reads as the open sky, not as the Door's head; the Door under the verb is longing, not a hymn; the choir under the glimpse is a held breath.
16. **307.4 s:** the stop on the flap lands; the return at 313 is soft.
17. **314–321.6 s:** the Door's G left open over the cut into the tag.

## Rules checked

[M] measured, [J] judged.
- **S1:** every cue names its motif and its mood (the cue sheet above) [J]. The show's own sound throughout:
  - the knee's cells: the garden tune's steps and leaps, the young Water Line (the flat line and the nudge), Mario's step-and-leap cell in B♭ (the Addendum), Nole's stacked fourths, the Door's rising fourth;
  - the chip in every cue but the diegetic bed: LEVERAGE's ticks, Mario's triangle bass, the garden's square, the Launch's burst, F2.1's chip lead and falling figure, E02-12's triangle on the return;
  - the leitmotifs: LEVERAGE, the Lighthouse, the Addendum, the Launch, Neleh's harmonic, the young Water Line, the Ache, the Door (twice, its first note missing), the GPU choir;
  - the 808 (as LEVERAGE's muted thud, never a kit) and the hybrid orchestra (the quartet, arco bass, marimba, harp, glass, flute, choir and reed organ, timpani, staccato trumpets);
  - the jazz colour: quartal and extended chords (D♭maj9(♯11), E♭9sus, C7-quartal), the swung T2 band;
  - no third.

  No lounge cheer: the giddy lobby is pizzicato double stops, not a trio. No generic pads: the sustained colours are played strings, glass, choir and flute; the one synth pad is ELPPA's diegetic bed [J; ears 5, 15].
- **S2:** suspense is about 29 % of the scored time [J].
- **S3:** one continuous performance from the black to the complaint's exit (0 → 267.3), and one for sc 22, with 0 holes, 0 fragments and 0 unmarked silence. The music thins and ducks under lines rather than stopping. The two plan-marked silences (the dark room's post and the white; the flap) are marked, each with its re-entry [M].
- **S4:** the act's sound leads: the quartet's pizzicato under Act Three's black (J 1.042 s), the keynote bed under the reminder (J 0.8), the bed carried across the campus cut (L 0.8), the cello's pedal across the fold (L 0.6) [M].
- **S5:** every layer is anchored to the lock's events and the plan's cuts, and the two re-timed locks re-lay [M].
- **S9:** laid to the lock's frames. The designed hits are marked: the 808's first thud, the fanfare, the last pizzicato. The soft entries: the TV's pedal, the harmonic, the Ache, the A♭ pedals, the D♭ fifth's 3 s attacks, the choir's swell, the return [M].
- **S11:** the story sounds keep their room: the lanyards, the TV click, the post's click, the pins, the gate, the lamp, the padlock, the rope, the flap [J].
- **OST rules:**
  - 1: no comic scoring. Nothing lands on the scroll, the cheer, "Upside.", "Is that Mas?", "which half?", the beanbags, the buzzing cage or the rope; the stops are the only tools [J/M].
  - 4: the knee is never whole [M].
  - 5: one grid; the diegetic bed is on it [M].
  - 6: LEVERAGE and the machine straight; F2.1 swung [M].
  - 10: the record plays dry under every post, card, end card, highlighted line and docket; nothing attacks under the V.O. [M].
  - 11: the score plays only the sound it claims [M].
  - 12: no A-natural anywhere [M].
- **Guardrails:** no music gives Alyi a reason (W8): his post plays under room tone only; at the glimpse the choir holds (no sting, no cadence), and the Door never cadences [J]. Neleh's account and the board's reply play over the same held pedal: neither is scored as the truth [J]. Nole's post plays dry; his motif sounds on his own lamp [J].
- **R10:** every render went through `heavy.sh` with `OST_WORKERS=2`, `MRMAS_MAX_LOAD=40` and `MRMAS_HEAVY_MEM_MAX=6G`, one at a time [M].
- **R1:** Ep1 untouched. The score pass wrote only `audio/ost/tracks/e02-v1-act4/`; the review's fixes also wrote one sentence into the beat plan's 22.08 picture note (the hand's timing, no timing change to the lock), Ep2's `e02-v1-common` (the lock hash, the per-line pocket) and `audio/reel/ep02-v1/mix_episode.py` (the pre-laps). Ep1's tracks were read, never edited.
- **R8:** nothing heard.
- **Broken on purpose:** the seventeen calls above.

**Resource ask (R16, non-blocking):** one human listen of the seventeen points above, ears 4, 5, 9 and 15 most of all. Whether the giddy lobby reads as the show's own and not corporate cheer, whether the garden reads as witty and not a wedding, and whether the Door and the choir read as longing and not a hymn, are an ear's calls.
