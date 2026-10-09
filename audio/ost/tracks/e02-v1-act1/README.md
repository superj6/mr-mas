# e02-v1-act1 · Ep2 v1 Act One "the séance" (sc 4, 4A, 4B, 6, 7) · the music stem

**The score pass, 2026-10-09.** Four cues laid on the EL lock (the master, `show/reel/ep02-v1-el/ep02-v1-el-act1.json`: 8,736 frames, 364.00 s) with the `e02-v1-common` engine (composer X's `v3lib`):

- `e02-02-the-seance`
- `e02-03-procedure-march`
- `e02-04-long-form`
- `e02-05-a-tenant`

**Revised the same day after the score review** (the glass harmonica in the voices' band; the pre-lap now laid by the mix): see [The score review's fixes](#the-score-reviews-fixes-2026-10-09).

**Nothing here has been listened to.** Every number below is measured [M]. The musical calls are judged [J]. The "For an ear" list says what only a person can check.

**The brief:**
- **The cue list:** [manifest.md §6](../../../../show/episodes/ep02/production/v1/manifest.md#6-score-cues), E02-02 to E02-05.
- **The scenes and the mood map:** [proposal.md](../../../../show/episodes/ep02/production/v1/proposal.md) sc 4–7, "The feeling curve" and "The seams".
- **The script's MUSIC lines.**
- **The lock's music runs.**

The mood map, in order:

| Scene | Mood |
|---|---|
| 4 | a ghost-story giggle and courtroom comedy |
| Move 37 | wonder and a chill, the act's quiet centre |
| F2.3 | a sting, melancholy, and one warm second between the two who stayed |
| 4A | dry satisfaction and a warm half-second with Gerg |
| 6 | a growing laugh (unscored by plan) |
| 7 | comedy with a chill |

## The render

| | |
|---|---|
| `render/music-el.wav` | **364.000 s, 17,472,000 samples (8,736 frames × 2,000), exact.** 48 kHz / 24-bit stereo, git-ignored |
| `render/music-el-prelap.wav` | 1.000 s: the séance's room colour before the act's first frame (the plan's J 1.0 s under the filename card). It runs continuously into the stem's first sample, and `mix_episode.py` lays it under the card (see "For the other passes") |
| `render/music-el-ringout.wav` | 3.000 s: E02-05 past the act's last frame (THE COPY's last F and the room's tail) for Act Two's head. It runs continuously from the stem's last sample |
| Level | −20.11 LUFS-I; true peak −3.15 dBTP; short-term p95 −17.55, max −16.05 |
| `check.py` (with the review's new checks) | `act1 8736 f 364.000 s exact=True lock=True −20.11 LUFS-I −3.15 dBTP \| silence 0 holes 0 holes-42 0 frag 0 (runs 3) \| 12 dB steps 1 unmarked 0 \| F-major True rule12 True knee 0/0 \| pocket p10 13.9 min 10.9 fail 0 exempt 0 \| PASS` |
| Engine QA, every cue | no warnings. F-major ok (written and spectral). Rule 12 ok: no A-natural is written anywhere. Knee whole 0, completions 0. Every hit mark has an onset within 10 ms (5/5, 1/1, 2/2, 3/3). The sub under the cathedral's hum reads −23.9 dB (limit −18). |
| Music runs | three runs: 0 → 226.55 (the séance into PROCEDURE, one run), 234.2 → 238.25 (the sting), 315.8 → 364.0 (A TENANT). There are two designed rests between them (below), with no unmarked digital silence, no hole under −60 dBFS and no fragment |
| `cues-el.json` | the cue sheet: each cue's sync marks and events; the designed rests and hits; `claims_sfx`; the sections (with one `duck_db`); the real lines; the prelap and ring-out; the measurements and the engine QA. It names the timeline it was laid to |

The Kokoro lock (`show/reel/ep02-v1/`) was not rendered, because the film is the EL lock.

## The score review's fixes (2026-10-09)

The review measured each line's take against the score as the mix ducks it, in the voices' 1–4 kHz band (the audition's 2–6 kHz pocket, −29.3 dB, missed this energy). The glass harmonica's top bowls and their rubbed harmonics sat at −27 to −30 dBFS there under the talk; the B♭m9's C6 bowl was the worst, and every line the review named sat under a B♭m9. What changed in `track.py` [M]:

| Change | Why |
|---|---|
| **The séance's B♭m9 is re-voiced C5 F5 A♭5** (its 9th, 5th and 7th: no bowl over A♭5, no third), from D♭5 F5 C6 | the C6 bowl's fundamental (1,046 Hz) sat in the voices' band under the ghost email, "we keep everything." and "You sat at the back" |
| **The top bowl lifts under his lines (on camera and V.O.) and the real ones**: it lets go 0.6 s before the line with a short ring (0.3 s) and is re-rubbed after it (10 lifts) | "Under real lines and Mas's on-camera lines, take the top bowl out"; its entries now come before a line or after it, never into one |
| **The glass bus dips 5 dB above 1 kHz while voices sound** (a dynamic high shelf on the bowls and the phrase, in and out over 0.25 s around each line) | the rubbed 2nd and 3rd harmonics |
| **The room thins 4 dB under the real lines** (the ghosts' emails read aloud), as under the V.O. | "the cue thins to a pad under every ghost caption and real line": the band under the real line now sits 10 dB under the level before it |
| PROCEDURE's upper strings are darker (1.2 kHz, was 1.5) and its pulse and taps softer under talk | Terb's quiet take under the pedal (onset +9.8 → +10.9) |

The per-line result (`e02-v1-common/pocket.py`; onset = the first 0.6 s from the first word, after the mix's 8 dB duck):

| Line | s | onset, before → after (dB) | whole line | worst 0.5 s |
|---|---|---|---|---|
| e2-a1-0001 Mas: "is there anyone here… from 2016." | 13.16 | +6.6 → **+21.8** | 5.2 → 18.0 | −3.8 → 9.0 |
| e2-a1-0014 the real ghost email: "This needs billions per year…" | 88.95 | +5.7 → **+20.8** | 6.3 → 22.4 | 0.0 → 17.7 |
| e2-a1-0026 the ghost: "billions per year…" | 141.78 | +8.6 → **+13.6** | 9.5 → 13.5 | 5.3 → 10.7 |
| e2-vo-02 V.O. 2 | 143.32 | +10.2 → **+21.3** | 10.5 → 22.4 | 1.6 → 14.2 |
| e2-a1-0028 Mas: "we keep everything." (weighted) | 150.02 | +8.8 → **+20.3** | 6.1 → 18.3 | 2.6 → 15.3 |
| e2-a1-0029 Nole: "You sat at the back…" | 177.81 | +13.9 → **+16.4** | 9.7 → 12.6 | −1.8 → 2.0 (mid-line, under a glass phrase in his pause) |
| e2-a1-0033 Terb (PROCEDURE) | 212.23 | +9.8 → **+10.9** | 14.6 → 15.9 | 10.2 → 11.4 |

Across the act: every line's onset is at least **+10.9 dB** (10th percentile +13.9 over the act's 46 lines with score under them; before the duck +5.9, against Ep1's final's +3.9 on that basis). Before: p10 +10.0, min +5.7, five lines under +10. The V.O. windows read −25.3 and −24.7 LUFS (the engine's guide −24 ± 2). The duck stays the mix's 8 dB: the music made the room, so E02-02's duck didn't need raising.

## The audition: the séance's room colour (manifest E02-02; proposal D-35, D-49)

The plan asks for two 30 s samples, judged against the corny bar before the build, with the pick logged and its reason:
- **(a)** a glass harmonica with chip, F minor;
- **(b)** celesta and chip over a low reed pad.

`track.py --audition --el` renders both on the lock's first 30 s: the click, V.O. 1, his question, ghost 1, Gerg and "one knock". Each uses the same harmony, the same phrases with the chip's shadow, the same sul-tasto bass and the same felt under the V.O. Only the colour differs. The files are `render/_work/audition/e02-02-the-seance-audition-{glass,celesta}-underscore.wav` and `audition.json` (git-ignored).

| [M], each at −20 LUFS-I | (a) glass + chip | (b) celesta + chip over a low reed pad |
|---|---|---|
| energy share 80–300 Hz (the voices' fundamentals) | **4.5 %** | **40.6 %** |
| energy share 300 Hz–1 kHz | 75.9 % | 43.9 % |
| 2–6 kHz band (the presence band; the guide is ≤ −15 dB under dialogue) | −29.3 dB | −21.1 dB |
| spectral centroid | 575 Hz | 386 Hz |
| F-major / knee | ok / 0 | ok / 0 |

**The pick: (a), the glass harmonica.** The reasons:
1. **It stays out of the dialogue [M].** The reed pad puts 9× the glass's energy where the voices' fundamentals live (80–300 Hz), and its presence band is 8 dB hotter. The séance is wall-to-wall talk, and this colour plays under all of it.
2. **The corny bar [J].**
   - A low reed organ is the stock horror signifier. The proposal's own review flagged that (P-18).
   - Celesta over it reads as a Halloween music box.
   - The glass harmonica is the séance's period instrument, from Mesmer's parlours. It plays the joke straight, as OST rule 1 asks, and isn't a genre wink.
3. **The turn needs a colour change [J].** Move 37 is scored "celesta and chip". If the room were already celesta and chip, "the room colour thins to the Go figure" would change nothing. With the glass, the act's quiet centre is heard as a new instrument.
4. **Identity [J].** Glass is already the machine's colour in this score (GLYPH, the Ache). The emails' ghosts sound in the machine's glass, and the same bowls play THE ACHE under Nole's fear.

The glass harmonica is synthesised in `track.py` (`armonica_fn`), because the libraries have none. It is a rubbed bowl:
- a soft rub swell;
- a nearly pure tone with a little 2nd and 3rd harmonic while the finger rubs (no 5th, so no A over an F);
- the turning bowl's tremolo, a faint rub noise and a slow beat against the next bowl;
- **when the finger lifts, the bowl rings free.** That ring is the cue's soft exit.

The chords are played as an armonica player would. The bowls enter one by one, lowest first. On a long chord the middle bowl is re-rubbed every two bars, never under a line that's being held still.

## What plays (the cue sheet)

EL seconds, on the segment's own clock (0 = Act One's first frame). Chord changes that land on cuts pre-lap them by the latest beat or swung *and* at least 0.15 s before the cut. They measure 0.15–0.53 s, median 0.24 [M]. A change never lands inside a V.O., a real line, a ghost caption or a line of his: it moves before it, or after it when that would crowd the last change.

### E02-02 THE SÉANCE (−1.0 → 193.0, ringing to 194.6)

The 96 BPM grid is anchored on the Go stone (109.43 is a downbeat). It's straight: the record and the séance's procedure don't swing.

| s | What plays | Why |
|---|---|---|
| −1.0 → 3.8 | **The room colour, already playing.** Glass Fm(add9) (A♭4 C5 G5) over a sul-tasto bass F2 + C3. The glass's first phrase (C5 D♭5 C5, the sigh onto the Ache's D♭) starts at 0.68, the chip shadowing it an octave up (its duty narrowing 25 → 12.5 %) | "Arrive on the lit table with the room colour already playing". The J 1.0 s is in `music-el-prelap.wav`, which the mix lays under the card (no head fade now) |
| 3.8 | D♭maj9(♯11), the bowls entering one by one | After his click (2.90; `post_click` is the SFX's): the post is out. The change lands before the V.O. |
| 5.06 → 12.5 | **The felt** (F3 + C4) under V.O. 1; a −4 dB fader ride on the cue | His room, inside the bed: nothing attacks under his words (OST rule 10). The V.O. window measures −23.0 LUFS (DARK ROOM's guide is −24 ± 2) |
| 12.56 | B♭m9 (glass C5 F5, its A♭5 bowl lifted until his line is over) | "is there anyone here… from 2016." held still under his line |
| 17.35 | C7sus(♭9): ghost 1 rises | Thin under the caption `"…LESS OPEN."` and the Yup (real): melody and chip out |
| 22.56 | Fm(add9), 0.47 s *after* the cut | The caption runs to the cut, so the change waits for it to clear. It's the one late change |
| 25.68 | D♭maj9(♯11); **the pad** from 29.27 | "one knock if we promised a nonprofit." Then, as the script asks, the room colour drops to its pad (only the top bowl and the bass) through the HOLD and the knocks. No note doubles a knock |
| 31.93 | **Nole's dominant, C** (C7sus(♭9)) swells in after the third knock | He drops through the ceiling. His case plays over his own unresolved dominant, pushing toward F and never landing (OST §2.7) |
| 36.3, 45.06, 52.56 | the glass's phrases (D♭ C B♭; A♭ G F; then turned round, D♭ C A♭), softer under the talk, the chip on each | Nole's case is the scene's one speech. A long colour gets a second phrase so the room never settles into a pad |
| 40.84, 101.31 | **GERG'S BUILD** (the chip, straight 16ths: a pass of 4, then 8) under his own typing lines ("It's a blog post…", "Same email address, though.") | His keys, not looking up (OST §2.6; as in the cold open) |
| 44.22 | C11(♭9): B-flat minor over his C | "I paid for the table…" |
| 59.22 → 73.0 | C7sus held: **OPEN, NOPE and the three hands play on a held chord** | No comic scoring (OST rule 1). The phrases are kept off the board's spellings, from NOPE to the hands lifting |
| 72.97 | Fm(add9): the cow (−3 dB under its crop: no one speaks over it) | The record: thin under the caption |
| 82.56 | C7sus; **NOLE'S LAUNCH, three times, each shorter** (83.34, 84.27, 85.06): staccato trumpets C4 F4 B♭4 E♭5, then C F B♭, then C F, each falling off its last note. A chip noise burst (his booster) on each, a soft timpani C2 on the first | The lamp clicks (his motif's own SFX), he types, and his post rises as a ghost of `!`: "the stack three times, each shorter" (OST §2.7, Ep2). It deflates into the `!` |
| 86.31 | B♭m9: ghost 3 (DEC 2018); under the real email the top bowl lifts, the glass dips above 1 kHz and the room rides 4 dB down | Thin under its header and "billions per year" (both real) |
| 94.10 | (nothing) | The slap is the SFX's: "Mas's hand on his glass doesn't move" |
| 96.31 | C7sus; a phrase at 96.93 | "That was a different me." Held from Nole's beat through the ghost's "…Yup." (no scoring on the punchline) |
| 106.31 | **Move 37: the room thins to the open fifth** (glass F4 + C5, softer; bass F2 + C3) | "spirit, why zero?" The room goes quiet for the only time |
| 110.06 | **THE GO FIGURE**: celesta + chip, straight 8ths, F C G only, placed like stones (sparse, never a melody), on the beat after the stone | The stone's click (109.43) is the SFX's. "A chip Go figure on the open fifth (no third); celesta and chip" |
| 121.93 | **the knobs**: soft pizzicato grains, a loose human stream on every pitch of the cell | Gerg's "Nobody wrote it. It's millions of little numbers, like knobs." The score claims `knob_tick_grain`, and the mix ducks 5 dB here instead of 8, so the grains read (S11) |
| 129.22 | the grains straighten into quantised 16ths on F C G, **the chip on each** | "Then it played itself": its own games, the machine's own voice |
| 132.27 | **THE WALL FREEZES**: the grains and the Go figure stop dead | "The knobs tick only while the stream pours in, and freeze at the match" |
| 132.35 | **THE ACHE** on glass (G4 + D♭5 over F2 + C3) | Nole's fear ("One player in ten thousand…"): wonder and a chill, played by the séance's own bowls |
| 137.97 | Fm(add9): back to the room colour | "MINDDEEP had that in 2016. We had a blog." |
| 141.10 → 152.4 | B♭m9; **the felt** (D♭4 + F4) under V.O. 2 (ride −4 dB; −24.7 LUFS); held under "You kept them." / "we keep everything.", the top bowl out under V.O. 2 and "we keep everything." | The ghost's "billions…", then the V.O., the gap. "A sting, melancholy": nothing moves |
| 152.40 | **On the smoke, the glass rings free** (the finger lifts on the snuff), and the cut-paper chamber strings swell in on the same chord's tones (F, B♭, E♭) | "Crossfaded in on the smoke". The same chord is upgraded across the render front (P10) |
| 154.22 | F2.3's arrival: a soft timpani C2 under the swell; the C pedal (bass, cello) | The T3 tier's "timpani hit on each arrival", 0.32 s before the cut to 2018 |
| 155.06 | **NOLE'S LAUNCH on slow horns, its one sincere version**: C4, F4, B♭4, E♭5 in half notes. The A♭ never comes; the E♭ is held, then let go | His Feb 2018 goodbye (OST §2.7). The band-limited strings (6.5 kHz) are the memory's paper |
| 159.6, 160.9, 162.1 | the upper strings leave one by one: violins I, violins II, viola | "Nobody applauds. One by one the staff turn back to their monitors." The room's refusal, in texture rather than on any beat |
| 169.75 → 174.4 | the pedal moves to D♭ (bass D♭2, cello A♭2); **THE DOOR on non-vibrato flute, its first note missing**: D♭5, C5, then G4 held (its ♯4, no cadence), low-passed, panned to one side, room reverb only | The look between Alyi and Mas: "thins under the look to the Door's first bar, its first note missing", through the door (OST §2.9) |
| 173.81 | **the glass returns on the Door's own G** (D♭maj9(♯11): F4 C5 G5) | Back to 2024 on the same chord: the flute's G4 is the glass's G5 |
| 176.93 | B♭m9; a phrase at 177.56 | "You sat at the back." |
| 185.68 | C7sus | "Keep that too. See you in court." |
| 188.34 | **his fanfare stops ONE NOTE SHORT**: staccato trumpets C4 F4 B♭4 E♭5, then nothing; a chip booster | He rockets up (`rocket_roar` is the SFX's). OST §2.7: one note short on his exit |
| 190.06 | **THE LAST CHORD: F minor (add 9)**, struck 0.15 s before the cut | The room's F minor returns only when he's gone. He never got to resolve his dominant; the room does |
| 190.71 → 194.6 | **the finger lifts on the candle**: the bowls ring free (2.6 s), the bass lets go over 2.2 s | "The last candle: the last chord rings into E02-03". It rings 1.6 s into PROCEDURE, then crossfades out |

### E02-03 PROCEDURE, MARCH (192.75 → 226.6)

Straight, B♭ minor-centred: the table (P02).

| s | What plays | Why |
|---|---|---|
| 192.75 | **the low strings swell in sul tasto** (B♭m9: B♭1 F2 D♭3 C4 F4), 0.25 s before the cut | "The room colour's last chord rings into PROCEDURE's low strings as the lights step up". F and C are common to both chords |
| 195.25 | **the procedure**: a spiccato cello pulse (straight 8ths, root and fifth) and dry snare taps on 2 and 4 | Under Terb's opening: dry, institutional |
| 200.88 → 215.25 | **thin to the pedal**: the pulse and taps stop before the reading; the sul-tasto chord holds through "The law firm found…" (real) and "You can sit down now, Mas." | "Thins to its pedal under the reading (the record plays dry)" |
| 215.25 | G♭maj7(♯11), the pulse and taps back, a soft timpani G♭ | He sits: a step warmer. The nameplates' four clicks are the SFX's |
| 218.79 | **the warm half-second**: D♭maj9, muted horns (A♭3 C4 F4, 1.2 s), the chip's triangle D♭3 under the bass | His glance at Gerg. He's in the room, so the chip is allowed (P02: "at most one triangle bass") |
| 220.88 | **the Build's "shipped" tag** on the chip (C5, F5: the knee's last interval, alone) | Gerg lifts the laptop an inch, like a toast (OST §2.6) |
| 223.38 → 226.6 | **F7sus(♭9), left hanging**; the pulse stops; it rings out under the invite's toast (224.17) | "Dominants left suspended". The record stays open, and his phone lights |

**226.6 → 234.2: a designed rest** (marked in `silences_designed`). Nothing plays under the read, V.O. 3 (227.00–232.72): the boardroom's room tone carries it. The plan says "none under the read". The podcast sting is the re-entry.

### E02-04 LONG-FORM (234.2 → 238.9)

An original podcast-intro sting (MM-21 media bed), swung.

| s | What plays | Why |
|---|---|---|
| 234.20 | a brush swell | "Pre-laps under the card settling (J 0.8 s)" |
| 234.75 | **Fm9 on vibes, the upright's F2, the ride's bell**, a push 0.25 s before the cut to XEL's studio (designed hit) | The podcast's own intro. The mic icon becomes XEL's mic |
| 235.38 → 236.0 | the long question: vibes + the chip, C5, E♭5 (swung), G5, which hangs on D♭(♯11) (bass D♭2) | "Asks the long questions": a question left open. The melody is out 0.4 s before XEL's first (real) word |
| 236.4 → 238.9 | the D♭ chord rings and fades under "Take me through…" | "Enter late on the locked two-shot, the sting ending" |

**238.9 → 315.8: a designed rest** (marked). "The sting, then no score: the studio's padded room tone is the joke". The mic's hops, the counter's ticks and the freeze card's hit are SFX, and the plan has none under the curtain's part (6.11). The re-entry is the swing's push into the split.

### E02-05 A TENANT (315.8 → 364.0, ringing into Act Two's head)

Swung (people). The grid is anchored on the key ring's jangle (361.015 = a downbeat). Nothing is below C2 (the cathedral's hum): the sub under the room measures −23.9 dB against a −18 limit.

| s | What plays | Why |
|---|---|---|
| 315.81 | **the swing enters on the split**: the upright's F2 on a swung push 0.19 s before the cut, a brush slap, the ride's bell (designed hit) | "SET-PIECE SWING, low, on the split": the building splitting is the curtain's own motion |
| 316.0 → 322.06 | walking bass (upright + pizz), brushes. **The chip leads us down the building** (C A♭ G F E♭; then E♭ C B♭ A♭…). Fm11 → D♭maj9(♯11). The lead is out under his recorded voice on the phone (317.50–319.93, real) | "His voice on the phone leading us down". The chip is his world, and the shot still holds him at the top |
| 322.06 | **the basement leaves his POV: no chip, no felt.** A♭maj9 → Fm11; Tasya's Rhodes on 2 and 4, short and soft | OST rule 7. The Rhodes is Tasya's colour (OST §2.16). It plays only on 2 and 4, because Rhodes on every beat over brushes and an upright is Ep1's corny trio |
| 328.31 | **ONE Rhodes chord under the welcome**: his chord, G B♭ C E♭ over F (no third), on a push 0.07 s before the cut. The strings' floor holds it (silent attacks) and only the brush sweep keeps time | "Tasya's Rhodes, one chord under the welcome". The welcome is the lease, and the band holds while he speaks it |
| 336.64 | the swing again: B♭13, Fm11, D♭maj9(♯11), C7(♯9♭13) | "I brought my own team. Is there room for them?" |
| 345.39 | **the band holds on THE ACHE** (D♭5 + G4 over the bass's F2) | The key twisted off and grown back; "We keep a spare." No comic scoring: a held chill. The `INQUIRY` bonk is the SFX's |
| 350.39 | one bar of the swing (Fm11) | "Who else lives here?" |
| 352.89 → 358.51 | **the pan up through his floors: Tasya's floor**, A♭maj9 → Cmaj9 → Emaj9 → A♭maj9 (strings, silent attacks; the bass on each root). "A tenant." lands on the home chord | The landlord's colour (Ep1's): his mediant cycle comes home as the camera reaches Mas |
| 358.51 | **home on Mas: the felt's flat line and its nudge** (F4 F4 F4 G4–F4, swung). The floor resolves to Fm(add9) above C3 | Coming back to his POV, the felt's first note sounds within a bar of the home shot (OST rule 7) |
| 359.14 | **THE COPY: his line on the chip, a beat late** (F F F G–F…) | OST §2.5: THE COPY on an out, "a note late". In Ep2 it moved here from the demo (D-53) |
| 361.02 | **the key ring's jangle on the downbeat** (SFX). The copy's G lands on it. The strings let go (2.8 s). The felt stops after its fifth note, and **the copy finishes his line alone** (C4, then F4) | The machine finishes the line he doesn't. The chill under the act-out |
| 362.27 → 364.0 + ring-out | the copy's last F (1.4 s release) and the strings' tail **ring into the black** | "THE COPY rings out under it into the black". `music-el-ringout.wav` carries it under Act Two's head |

## The sync points (all read from the lock; the score re-lays itself)

| Lock event | s | What the score does |
|---|---|---|
| `post_click` (4.02) | 2.90 | the room tilts to D-flat at 3.81 |
| e2-vo-01, e2-vo-02 (V.O. 1, 2) | 5.70, 143.32 | the felt under each; a −4 dB ride; no change or attack inside |
| ghost captions (4.04, 4.13, 4.16) | 17.8, 73.49, 87.05 | thin to the pad. The cow's crop also gets −3 dB, since no one speaks over it |
| e2-a1-0004's end ("one knock…") | 29.15 | the pad (the knocks at 30.45 / 31.14 / 31.84 are SFX) |
| `lamp_click` (4.15) | 82.93 | Nole's three stacks from 83.34 |
| `go_stone_click` (4.19) | 109.43 | the grid's anchor; the Go figure from the beat after |
| e2-a1-0056 "Nobody" / "Then" / its end | 121.91 / 129.22 / 132.19 | the knobs' human stream / its own games / THE FREEZE (132.27) |
| `candle_snuff` (4.27) | 152.40 | the glass rings free; the chamber tier swells in |
| the cut to 4.32 (the look) | 170.0 | the D-flat pedal (169.75); the Door from 170.68 |
| e2-a1-0030's end ("See you in court.") | 188.14 | his fanfare at 188.34, one note short |
| `candle_blow` (4.36) | 190.71 | the last chord rings free |
| the reading e2-a1-0032 | 201.59–211.95 | the pulse out from 200.88; the pedal holds |
| `chair_unfold` (4A.03) | 214.31 | the pulse back at 215.25 |
| the cut to 4A.05 (+1.5 s) | 220.46 | Gerg's tag at 220.88 |
| `ui_toast_pop` (4A.06) | 224.17 | F7sus(♭9) hanging; PROCEDURE out by 226.6 |
| the cut to 6.01; XEL's first word | 235.0; 236.40 | the sting's push 234.75; its melody out by 236.0 |
| the cut to 7.01 (the split) | 316.0 | the swing's push at 315.81 |
| e2-a1-0047 (his voice on the phone) | 317.50–319.93 | the chip lead out |
| the cuts to 7.02 / 7.03 / 7.05 / 7.07 | 322.25 / 328.375 / 345.54 / 353.33 | the basement / the one chord / the hold on the Ache / the floor |
| `key_ring_jangle_1` (7.08) | 361.015 | the grid's anchor: the copy's second bar |

**Re-timing [M]:** dry runs on two scratch copies of the lock, re-timed:
- copy (a): 4.06 +0.7 s, 4.16 +1.2, 4.22 −0.6, 4A.02 +0.9, 6.07 +2.0, 7.04 +0.8;
- copy (b): 4.02 −0.5, 4.09 +1.5, 4.27 +0.6, 4.32 +0.4, 7.03 −0.7, 7.07 +1.1.

Both re-laid every mark to the new events, and note QA stayed clean in all four cues (no written third, knee 0/0). That pass found and fixed three faults:
- a glass phrase over the knocks when 4.06 grows (the script's pad), and one across Nole's slap when 4.16 grows: both are now explicit holds;
- Tasya's floor squeezing its last step: the steps now round down to whole beats.

On this lock the notes are unchanged by those fixes (identical dry output).

## Measured

| Section | s | LUFS-I | True peak | Balance: piano · orch · big band · chip (engine; rhythm excluded) |
|---|---|---|---|---|
| E02-02 1 the room colour, Nole's case, the Launch ×3 | 0 → 106.3 | −19.5 | −6.9 | 2 · 89 · 7 · 3 |
| E02-02 2 Move 37 (the Go figure, the knobs) | 106.3 → 132.4 | −23.4 | −11.5 | 0 · 94 · 0 · 6 |
| E02-02 3 the fear (THE ACHE) | 132.4 → 138.0 | −21.3 | −12.7 | 0 · 100 · 0 · 0 |
| E02-02 4 back; V.O. 2; "You kept them." | 138.0 → 152.4 | −19.8 | −8.7 | 4 · 96 · 0 · 0 |
| E02-02 5 F2.3 (the chamber tier, the Launch, the Door) | 152.4 → 173.8 | −22.5 | −7.6 | 0 · 46 · 54 · 0 |
| E02-02 6 back; the fanfare; the last chord | 173.8 → 193.0 | −18.5 | −6.4 | 0 · 91 · 7 · 2 |
| E02-03 the pulse; thin under the reading | 192.75 → 215.25 | −21.3 | −7.9 | 0 · 100 · 0 · 0 |
| E02-03 he sits; the warm half-second; the hanging chord | 215.25 → 226.6 | −20.4 | −7.0 | 0 · 54 · 31 · 14 |
| E02-04 the sting | 234.2 → 238.9 | −20.0 | −7.0 | 0 · 96 · 0 · 4 |
| E02-05 A the split (chip lead) | 315.8 → 322.1 | −18.7 | −3.15 | chip only (the bass and kit are rhythm) |
| E02-05 B the basement (Rhodes 2 and 4) | 322.1 → 328.3 | −19.5 | −6.7 | piano only |
| E02-05 C the welcome (one chord) | 328.3 → 336.6 | −20.5 | −8.1 | 27 · 73 · 0 · 0 (the chord over the floor) |
| E02-05 D–F the swing; the hold on the Ache | 336.6 → 352.9 | −19.8 / −23.3 / −19.9 | ≤ −7.3 | |
| E02-05 G the pan (Tasya's floor) | 352.9 → 358.5 | −23.0 | −10.3 | 0 · 100 · 0 · 0 |
| E02-05 H home on Mas; THE COPY | 358.5 → 364.0 | −18.9 | −6.5 | 74 · 13 · 0 · 13 |
| **whole stem** | 0 → 364.0 | **−20.11** | **−3.15** | E02-02 1·85·12·2 · E02-03 0·74·18·8 · E02-04 0·96·0·4 · E02-05 38·51·0·11 |

- **Momentary peaks (LUFS-M)** [M]:
  - the act's head −15.5; the Launch ×3 −17.4;
  - Move 37 −19.5 (the quiet centre); the Ache −19.2;
  - F2.3's horns −17.0; the Door −21.3; the fanfare −18.8;
  - the last chord's ring −17.3;
  - PROCEDURE's entry −22.2; the warm half-second −16.9;
  - the sting −16.9; the split's push −15.0; the welcome's chord −21.8;
  - THE COPY −14.7 (the outs guide is −14);
  - the act's last 0.4 s −32.9, and the ring-out's first 0.4 s −35.3: the copy rings across the cut and is gone about 1 s into Act Two.
- **The V.O. windows** [M]: −25.3 and −24.7 LUFS (the engine's guide, −24 ± 2), from the felt plus a −4 dB ride, the top bowl out.
- **The dialogue pocket** [M]: the engine's 2–6 kHz band reads −28.3 dB (the séance), −23.6, −24.9 and −19.4 dB (guide ≤ −15). Per line in 1–4 kHz after the mix's duck: every onset at least +10.9 dB (above). The mix ducks E02-02 and E02-05 by 8 dB and E02-03 and E02-04 by 9 dB under speech. `cues-el.json` → `sections` asks for 5 dB over the knobs (121.7–132.6) instead.
- **The cut check** [M]: one step of 12 dB or more, at 4B.01 (226.0, −12.7 dB). That is PROCEDURE's ring-out into the marked rest, 0.6 s from its mark.
- **Mood shares by scored time** (279.5 s of 364) [J]:

  | Mood | Where | Share |
  |---|---|---|
  | eerie-comic, the giggle played straight | the séance's room colour, the exit, the sting, the swing | about 60 % |
  | warm, sincere, melancholy | V.O. 2 to the smoke, F2.3, the warm half-second, the floor | about 14 % |
  | dry and institutional | PROCEDURE | about 11 % |
  | wonder | Move 37 | about 9 % |
  | suspense and chill | the Ache, the spare, THE COPY | about 6 % |

  Suspense stays a small minority (S2).

## Judgement calls (rules bent on purpose, one line each)

1. **4.05's change lands 0.47 s after its cut.** Ghost 1's caption runs to the cut, and a change can't land inside a real caption.
2. **The welcome's chord pushes its cut by only 0.07 s** (a swung *and*). The beat before would sit under the Humanist's last word (Ep1 v3.4's 0.1 s rule).
3. **Two designed rests** (226.6–234.2 and 238.9–315.8), both from the plan ("none under the read"; "then no score in the studio"). Room tone carries them, and each has a clear re-entry: the sting, then the split.
4. **The séance's chip share is 2 % by the engine's gated metric** (Move 37 6 %). The glass is this room's identity. The chip is its stamp: every glass phrase's shadow, Gerg's Build, the Go figure, the self-play grains and Nole's boosters. Its attacks are short, so a gated, time-weighted share under-counts them [J]. Ear check 1.
5. **The séance's felt** under V.O. 1 and V.O. 2 is not in the plan's music line. It follows Ep1's practice (the felt carries the V.O.) and OST rule 10 (the V.O. sits inside the bed).
6. **Gerg's Build in the séance** is not in the plan's music line. It is his leitmotif under his own typing lines (OST §2.6), and it adds the chip.
7. **THE COPY finishes the line the felt leaves**, rather than copying a whole line. The felt plays only the first bar, because Act Two's head plays the Water Line whole in the dark room. It isn't stated twice across the cut.

## For the other passes

- **Mix:**
  - **The prelap.** `render/music-el-prelap.wav` is the plan's J 1.0 s under the filename card. `mix_episode.py` now lays it: the card gets a score bus for it, ending on the card's last sample at Act One's head gain, and Act One's 1.0 s head fade is off, because the colour is already playing (the review found it unused; measured on the score bus: the card's last 200 ms and Act One's first 200 ms 0.8 dB apart, a sample jump of 0.005).
  - **The ring-out.** `render/music-el-ringout.wav` is read automatically under Act Two's head and crossfades out 2.5 s after Act Two's own entry.
  - **The tail.** The stem's last 5 ms fade was put back, so there is no notch at the seam (`laid[-1].tail_restored`).
  - **The duck.** `sections` duck_db is 5 over the knobs.
- **SFX:**
  - `knob_tick_grain` (4.22) is **claimed** by the score (`claims_sfx`): its grains are the knob wall's sound and stop on the freeze.
  - Keep the knocks, the jangle and the stone off A (the harmony there is D♭(♯11), F minor and the open fifth).
  - The lamp click starts Nole's stacks; the candle blow frees the last chord.
- **Act Two's composer:** Act Two opens on the black with the dark room's Water Line. This act ends on THE COPY's last F4 ringing into it (the ring-out), so the line plays whole there for the first time in the episode.
- **The engine (`e02-v1-common/v3lib.py`, not edited here):** `real_ids()` finds no real line in Ep2. The lock prints no quotation marks, and the takes carry no `[P`/`[V`/`[K` tag. This track reads the tags from the beat plan's `note` instead (`mark_real`: 14 real lines). Other segments need the same, or a fix in the common file.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --dry --el          # the lock's runs, every mark, note QA
MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --render --el
#   (--render seance | procedure | longform | tenant: only those cues; then it re-lays and measures)
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --assemble --el     # re-lay render/_work/el, measure
MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act1/track.py --audition --el
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                   # the segment checks (PASS)
```

Render times through `heavy.sh` [M]:

| Cue | Time |
|---|---|
| the séance | about 2–7 min (the glass is synthesised per note; 137–227 s on the review's re-renders) |
| PROCEDURE | 5 s |
| the sting | 2 s |
| A TENANT | 11–14 s |
| the audition | 10 s |

After any re-lock, re-render: every sync point comes from the lock (S5).

## For an ear, in order

1. **0–30 s and the séance as a whole:** does the glass read as rubbed glass bowls, an instrument, rather than a synth pad? Is it uncanny and played straight, never a horror organ, a theremin or a Halloween music box? Is the chip's shadow audible as the show's stamp? If the glass reads as a pad, the fallback is the audition's (b), or bowed vibes. **Under the talk** (13–16, 86–92, 141–152, 177–185 s): every first word is clear; the top bowl's lift and its re-rub after the line read as the player breathing, not as a gap, and the 5 dB dip above 1 kHz isn't heard as a filter.
2. **83–86 s:** Nole's three stacks, each shorter: a deflating fanfare, not a gag.
3. **106–138 s:** Move 37. Does the room go quiet? Are the Go figure and the knobs a texture, not a tune? Is the freeze a clean stop? Does the Ache on glass give the chill under "it was right"?
4. **152–174 s:** F2.3. Are the horns sincere? Do the strings leaving read as the room turning away? Is the Door on flute heard "through a door", and is the look warm?
5. **188–196 s:** the fanfare one note short beside the rocket; then the last chord ringing free from the candle into PROCEDURE's strings.
6. **201–212 s:** the reading plays dry (the pedal only). Is the warm half-second on Gerg's laptop warm, not cute?
7. **234–239 s:** the sting: a podcast intro in the show's own voice, earnest, not lounge.
8. **316–364 s:** the swing low and charming, never Nintendo; the basement's Rhodes never lounge; the one chord that is the lease; the hold on "We keep a spare."; the felt stopping and THE COPY finishing his line into the black.

## Rules checked

[M] measured, [J] judged.
- **S1:** every cue names its motif and its mood (the cue sheet above) [J]. The show's own sound throughout:
  - the knee's cells (the Build, the Water Line's flat line);
  - the chip in every cue (E02-02 2 %, E02-03 8 %, E02-04 4 %, E02-05 11 %);
  - the leitmotifs: Nole's Launch three ways, the Door on flute, the Build, the Ache, THE COPY, Tasya's Rhodes and floor;
  - the hybrid orchestra, the jazz colour (the swing, quartal and extended chords) and no third.

  No lounge: Tasya's Rhodes plays 2 and 4 only. No generic pads: the sustained colour is a played glass harmonica with phrases and breaths [J; ear 1].
- **S2:** suspense is about 6 % of the scored time [J].
- **S3:** one run per sequence. There are 0 holes, 0 fragments and 0 unmarked silences; the two plan-marked rests have clear re-entries; the music ducks and thins under lines rather than stopping [M].
- **S5:** every layer is anchored to the lock's events, and re-timed locks re-lay [M].
- **S9:** laid to the lock's frames. The designed hits are marked: the sting's push and the split's push. The entries are soft: PROCEDURE's swell, the felt under the V.O.s, silent string attacks [M].
- **S11:** the knobs read (claimed; duck 5 dB) [M/J].
- **OST rules:**
  - 1: no comic scoring; holds on OPEN/NOPE, the slap, the Yup and the spare [J].
  - 4: the knee is never whole [M].
  - 7: no chip or felt in the basement; the felt within a bar of the home shot [M].
  - 10: the record plays dry; nothing attacks under the V.O. [M].
  - 12: no A-natural anywhere [M].
- **R10:** every render went through `heavy.sh` with `OST_WORKERS=2`, one at a time [M].
- **R1:** Ep1 untouched. The score pass wrote only `audio/ost/tracks/e02-v1-act1/`; the review's fixes also touched Ep2's `e02-v1-common` (the lock hash, the per-line pocket) and `audio/reel/ep02-v1/mix_episode.py` (the pre-laps). Ep1's tracks were read, never edited.
- **R8:** nothing heard.
- **Broken on purpose:** the seven calls above.

**Resource ask (R16, non-blocking):** one human listen of the eight points above, the first one most of all (the synthesised glass). A sampled glass harmonica, or bowls recorded in a room, would replace `armonica_fn` with no change to the notes.
