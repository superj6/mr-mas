# MR. MAS · Original Soundtrack Bible (Season 1)

> **Guidelines, not gates (showrunner, 2026-09-26: "there should be no hard cutoffs for rules on episode handling… the practical flow and user entertainment is always priority"; on the Act Four v3 animatic: "the ost should not be playing for just half a second at a time then stopping").** The score plays as continuous performances that thin and duck under words instead of stopping ([flow-and-continuity §3](../../show/bible/flow-and-continuity.md#3-sound-a-continuous-bed)). Every count, cap and spacing rule below is a guide: break one when the scene plays better, and say why in a line. The locked main title, the guardrails (§1.7's banned list, §6.10's rights) and the showrunner's direct calls stay firm.

| | |
|---|---|
| **Status** | WORKING RULES v1.1, 2026-09-25. Music supervisor's pass. This is the "score doc" that [tone-and-dialogue §9.7](../../show/bible/tone-and-dialogue.md#97-production-for-the-audio-owner) asks the audio owner to write: the families, the spotting notation and the motif sheet. Items marked **PROPOSED** need the named owner's sign-off. Until they sign, write to the default given. |
| **Scope** | The episode score and the soundtrack album, Eps 1–12. **The main title, "The Knee (Main Title)" V1 "Chip Chamber Jazz", is LOCKED** (`audio/theme/`, [VARIATIONS.md](../theme/VARIATIONS.md)). Nothing in `audio/theme/**` changes. |
| **Binding inputs** | **The showrunner's notes:** the sound sits **between piano, orchestral and big band**. Big-band brass is **accents, not the engine**. Some **jazz feel**. **8-bit chip motifs** are the show's identity. **"A full OST with different tracks for different tones, not just repeating the same track the whole time."** Nothing corny.<br>**The writers' brief for the OST:** [tone-and-dialogue §9](../../show/bible/tone-and-dialogue.md#9-the-score-one-theme-many-tones), whose 15 families are adopted here as the spotting vocabulary (§3.0).<br>**Also:** [overview](../../show/bible/overview.md), [pov-clarification](../../show/bible/pov-clarification.md) and [pov-and-framing](../../show/bible/pov-and-framing.md) (both binding), [guardrails](../../show/bible/guardrails.md), [pacing-model](../../show/format/pacing-model.md) (law L7: the 96 BPM grid organises the music), [flow-and-continuity](../../show/bible/flow-and-continuity.md) (guidance, 2026-09-26: continuous music and room tone), the Ep1 [script](../../show/episodes/ep01/script.md) (Act Four draft 3.1) and the SFX [manifest](../sfx/manifest.json). |
| **Tools** | The OST engine `audio/ost/engine/` (any length, loop-aware; `grid`, `arrange`, `harmony`, `motifs`, `texture`, `era`, `analysis`, `export`) and the track template `audio/ost/tracks/_template/track.py`. Samples: `audio/samples/` (see [LICENSES.md](../samples/LICENSES.md)). Venv: `audio/.venv-theme`. |
| **Ears** | **Nobody has listened to any of this.** Every judgement here is made by measurement: loudness, spectrum, onsets, chroma and piano rolls. §7 lists what a human must audition, in order. |

**Contents:** [0. Rules on one screen](#0-the-rules-on-one-screen) · [1. What the score is for](#1-what-the-score-is-for) · [2. Leitmotifs](#2-leitmotifs) · [3. Tonal palettes](#3-tonal-palettes) · [4. Track list](#4-season-1-track-list) · [5. First batch](#5-the-first-batch-10-tracks-5-composers) · [6. Policy](#6-policy) · [7. Audition](#7-what-a-human-must-audition-first) · [8. Decisions and handoffs](#8-open-decisions-and-handoffs)

---

## 0. The rules on one screen

1. **The score is the thriller; the picture is the joke.** The music believes the drama. It plays power, clocks and betrayal straight. Punchlines get **no comic scoring**: the cue thins or holds, or a sound effect takes the beat. There are no comic stingers after punchlines, no Mickey-Mousing and no meme sounds. The score's only comic tools are the **stop**, the **cut-off**, and a size **one too big** for the object on screen. Stops are punctuation: a few per act, each on a story beat, with room tone under it and a clear re-entry.
2. **One score, not a medley.** Every motif is built from **the knee's cells** (the flat line F F F F; the steps G A♭; the leap A♭ C; the fourth C→F) and the **open fifth** (§2.0). F minor is home. D♭ and C are colour keys, and so are the other chords of the title's harmony (B♭m, E♭).
3. **Four colours of identity.**
   - The **felt upright** is Mas and his room.
   - The **orchestra** is the world.
   - **Big-band brass** is accents only. The one full band per episode belongs to the S3 set-piece.
   - The **chip** is identity: his 1993 past and the machine's future. Every cue carries chip, except the exits from his POV, STRAIGHT and the KEYNOTE REEL.
4. **The knee never plays whole inside an episode.** Its fragments are Mas's motif (§2.1). The full eight notes belong to the main title and to each episode's end-credits reprise. The one PROPOSED exception is Ep12.
5. **One grid, continuous performances (L7; [flow-and-continuity §3](../../show/bible/flow-and-continuity.md#3-sound-a-continuous-bed)).** Every cue is at **96 BPM**, the house tempo, so the library fits together: 15 frames a beat, 60 a bar. Energy changes by **feel, not tempo**: half-time, double-time, swing against straight, 3/4 and 6/8 on the 96 beat. **A sequence's cue plays as one continuous piece**, rendered to the sequence's length or edited on phrase boundaries, through several shots and lines. Tone changes on a phrase boundary: **a crossfade on a downbeat (roughly 0.5–2 s), a ring-out, or a pre-lap** of the next cue. A fragment of a second or two sounds like a mistake unless it's a designed sting on a story beat. Diegetic source music (a PA, a lounge band, an ad) may take its room's tempo, but if it crosses a cut it is on 96.
6. **Swing is human.** Mas and the people swing: the swung eighth lands 10 frames after the beat, as in the title. The machine, the board, the record and THE PLAN play **straight**.
7. **Leaving his POV** means no piano, no chip and no swing. **Coming back**, the felt piano's first note sounds within 1 bar of the home shot.
8. **His version** is the KEYNOTE REEL: a too-clean felt piano in D♭ major, too still, with no chip. It **stops mid-phrase** on the hard cut (D5).
9. **Dread leaks in** through the Ache (D♭ + G over an F pedal), quantisation, and **THE COPY**: his own line played back by chip, a little closer each episode. It comes after a laugh or on an out, never inside a setup. It follows the dread curve.
10. **The record plays dry** (revised 2026-09-26 by [flow-and-continuity §3](../../show/bible/flow-and-continuity.md#3-sound-a-continuous-bed); this replaces "no music under real lines or quote cards, 1 bar clear on each side").
    - **Under real lines** (spoken or posted), **quote cards and the candor card** the cue **thins and ducks** rather than stopping: melody and hits drop out, a sustained pad or bass pedal holds, and it ducks further. "Dry" means no comic scoring, no stinger or rimshot, and no melody on the line.
    - **No sting or swell under V.O.** The V.O. sits inside the bed.
    - D6 is digital silence: the one designed full stop.
    - (REPORTED) material never carries a Mas motif.

    Ep1 sc 30's STRAIGHT violin under Alyi's post is a scripted featured cue (§1.6).
11. **One owner per sound.** The SFX own the KA-CHING, GLYPH grains, the Orb chime, bonks, freeze hits, clicks, stamps and room drones. The score is tuned to them and leaves them room (§6.8).
12. **The third is reserved for Ep12.** No F-major triad (no A♮ over an F root or bass) anywhere before the model's last cue. The button chord never gets any third until then.
13. **Rotate** (guides; the aim is that no episode sounds like one track on repeat).
    - A family used more than about 3 times in an episode starts to wallpaper.
    - Vary the act-out outs: avoid the same out twice in a row, or twice in one episode.
    - A library cue about twice per episode at most.
    - **About 3 new to-picture cues per episode or more.**
    - About **10–13 minutes of score** in a 22-minute episode as a starting estimate; where the score rests, room tone and ambience keep running (true silence is the designed D6 only).
14. **Loudness** is measured on the music alone. Everything peaks at ≤ −1 dBTP; picture masters ≤ −3 dBTP.

    | Master | Target |
    |---|---|
    | Picture: underscore | −20 LUFS |
    | Picture: featured | −16 LUFS |
    | Outs | −14 LUFS-M |
    | Album | −14 LUFS-I |

---

## 1. What the score is for

### 1.1 The job: a thriller engine with a satirist's eye

The tone guide's line is ***played as a thriller, drawn as a cartoon, scored as a drama; the record plays dry.*** The score is the *scored as a drama* third.

- **It takes the stakes seriously**, the way *Succession*, *Mr. Robot* and *The Big Short* do, **for their function, never their sound**. That means pressure, clocks and the slow click of a trap. The laugh is the gap between a score that believes this is a thriller and a picture of a chihuahua walking a Great Dane.
- **It never tells the audience what's funny.** Laughs come from **where the music stops**:
  - the waltz stops as the chairs leave;
  - the keynote reel dies mid-phrase;
  - the violin gives way on the first heart (a dead stop in draft 3.2; a held, decaying note in the v4 plan);
  - the band waits politely for the President's words.
- **It carries the time between held drawings.** Pixel art holds poses. The score carries the grid, the pedal and the phrase that hasn't resolved.
- **It keeps the identity** in every room through the chip, and **the season's shape** through the motifs. Characters change by what happens to their tunes.

**Every cue is three layers**, and the families in §3 are settings of the same three:
- **Pulse:** the clock, the ostinato, the rack LEDs' straight eighths.
- **Pressure:** the pedal point, the suspension, the Ache.
- **Pivot:** the stop, the hard cut, the late entry, the missing note.

**Thin under Mas, swell under the world.** His calm means fewer instruments.

### 1.2 The four layers of the story, in music

[pov-and-framing §1.2](../../show/bible/pov-and-framing.md#12-four-layers-one-order-of-precedence) orders the story in four layers. Each layer has a sound, so the audience hears whose account it is.

| Story layer | Its music | Never |
|---|---|---|
| **THE RECORD** (the rail, quote cards, THE PLAN, truth labels) | **Quartal, straight and precise** (BLUEPRINT, PROCEDURE). Under real lines and cards: **dry** (thinned to a pedal and ducked, §0 rule 10). | Swung, sentimental, or Mas's motif |
| **THE WITNESS** (the Orb) | Its voice is **SFX** (the F chime, servo and scan). The score's **verdict** is the open fifth F–C, played only when it acts (§2.4). | An answer to the V.O. |
| **HIM** (Mas) | **The felt upright, swing, rootless jazz voicings, the Water Line** (§2.2). His account is the KEYNOTE REEL (§2.3). | Loud. He never gets a swell. |
| **THE MACHINE** (GLYPH, the strip, TERMINAL, the lit cursor) | **GLYPH** (the tokens, the Ache) and **THE COPY** (§2.5) | Swung (before Ep10) or humanised |
| *The world* (everyone else, in his POV) | The orchestra, the big-band accents and the **character motifs** | — |

### 1.3 How the music tells us his account is unreliable

He is "unreliable in tone, never in fact". **The score never contradicts the record, and it never winks at the lie.** Each device in the [toolkit](../../show/bible/pov-and-framing.md#23-the-devices) has a score behaviour:

| Device | What the score does |
|---|---|
| **Every V.O. line** | The score **thins to one instrument, his felt piano**, and the V.O. sits inside it, never in a hole. On the picture's catch it **does not react**: it keeps playing his calm, as if nothing happened, because the obliviousness is his. No sting, swell or "wah" on a catch. |
| **D4 · the Orb's rewind** (`rewinding…`) | **THE REWIND.** The last 2 beats of the music so far are **retrograded as notes**, not as a reversed file. They play through the 16-bit sample-chip, dropping a semitone per beat, and land on the exit's first downbeat. At most 1 per episode. It is not a reverse swell (the SFX own those). |
| **D5 · MAS'S VERSION** | **The KEYNOTE REEL** (§2.3): the only place his motif is in a major key (D♭), too clean, too still, with no chip and no swing. The hard cut stops it **mid-phrase, mid-note**, and nothing rings on. |
| **D6 · the drop-out** | **Digital silence**, music and reverb tails included. The score gives the blow its weight by leaving. In the pilot the silence is also the board's blank fourth step (§2.13). |
| **D7 · the reflection** (from Ep4) | For that one beat the Water Line's nudge is **a semitone off** (G♭ for G): the smile off by one pixel. When he's hurt, the nudge is missing. When he's flattered, it goes to A♭. |
| **D8 · the straight line** | A designed rest: the cue holds a pedal or rests on room tone under it, as the script calls, and re-enters on the next phrase. |
| **Told twice** | Both passes use **the same harmonic material in two orchestrations**. His pass has felt piano, swing and chip. Theirs is the straight orchestra, with no piano and no chip. Where they disagree on an invented beat, the plainer orchestration is the true one. |
| **"Too still"** | Under MAS'S VERSION the music has no rhythmic motion, just as the frame has none. The true shot brings the motion back. |

**Tape haze is not "his version."** His account is **cleaner** than the truth, polished like a keynote. Never mark his recollection with wow or with the engine's `memory` or `cassette` presets. Keep tape presets for real recordings in the world (a camcorder's audio, a dictaphone) and for light era colour (§3, ERA TIERS).

### 1.4 Leaving his POV, and coming back

| Exit ([§6.1](../../show/bible/pov-and-framing.md#61-the-sanctioned-exits)) | Score rule |
|---|---|
| **The other side's pass** (Ep1 pass one, the Ep8 Rashomon) | **PROCEDURE, straight: no piano, no chip, no swing.** The other side's motifs lead (the board, Alyi, Mario, Neleh) with full dignity and their own sincere beats. Mas appears only as record, so his motif is absent. |
| **The card** (`WHAT THEY DIDN'T KNOW`) | A **REVERSAL** out on the downbeat. On the card's extra beat a single **felt F4** answers it: his room comes back first. |
| **A cold open in another timeline** | That timeline's family from frame 1. No Mas motif until he appears. |
| **Another narrator's flashback** (POV rim) | **That narrator's motif leads, on that narrator's instrument**: Gerg on chip and wood, Nole on trumpet, Mario with the quartet, Alyi on flute and reed organ. The felt piano plays only in his own (cyan) flashbacks. |
| **The machine's POV** (TERMINAL) | GLYPH, quantised. No felt piano until Ep12, no swing until Ep10. |
| **Coming back** | The first shot back is his body ([§6.3](../../show/bible/pov-and-framing.md#63-coming-back)). The **felt piano's first note** comes within 1 bar of it, usually the Water Line's F4. Never a swell. |

### 1.5 How dread leaks in

GLYPH is the season's rising tide. It has five mechanisms, cheapest first:

1. **The Ache.** A high D♭–G dyad (the ♭13 and 9 over F: the glyph shimmer's own colour) appears inside a warm cue for one bar, then leaves.
2. **Quantisation.** For one phrase a human cue loses its swing and its humanising (0 ms): the band suddenly plays like a grid.
3. **THE COPY.** His line comes back from the chip, a little late (§2.5). It's never announced, and never under a line that names it. It is **the one musical hint of the ending**.
4. **Re-rendering.** A sustained tone is swapped, mid-note, for its sample-chip copy at a lower store rate: the world being re-rendered.
5. **The runaway.** The knee's rise doesn't settle on its F. It keeps climbing (A♭ C E♭ F…).

**Placement** follows [pacing-model §11.2](../../show/format/pacing-model.md#112-the-dread-curve). Dread goes **right after a laugh** or **on an out**, never inside a setup and never after the button. **GLYPH hits are short** (about 2 s; tone guide §9.3), each a designed sting on a story beat.

| Eps | GLYPH hits per episode | Longer GLYPH beds |
|---|---|---|
| 1–3 | 2–3 | none |
| 4–6 | 3–4 | none |
| 7–8 | 4–5 | none |
| 9 | 5–6 | the breakout (MM-31) |
| 10–11 | 6–8 | TERMINAL scenes may be scored as GLYPH beds |
| 12 | set by the showrunner (the model-POV exception) | — |

Mechanisms 1–4 inside other cues don't count against the hit budget. **THE COPY** has its own curve (§2.5).

### 1.6 Where the score rests (and the one true silence)

Room tone and ambience run under every shot, so a resting score never leaves a hole. Only D6 is digital silence.

- **D6**, from the blow to the recovery: digital silence, with every stem and tail at zero within 3 ms. **The GLYPH tile dissolve in Ep1 sc 26 sits inside D6**, so there is no score there (and see the SFX handoff in §6.8).
- ~~**Real lines**, spoken or posted: the score leaves on the first word and comes back after the line; quote cards and the candor card get 1 bar clear on each side.~~ **Replaced 2026-09-26** ([flow-and-continuity §3](../../show/bible/flow-and-continuity.md#3-sound-a-continuous-bed)): under real lines, posts and cards the cue **thins and ducks** (§0 rule 10). It doesn't leave.
  - Ep1 sc 30's "one sad violin, played straight, under the post only" is a featured STRAIGHT cue: the violin *is* the thinned colour under the post. Draft 3.2 stops it dead on the first heart; the [v4 edit plan](../../show/episodes/ep01/production/act4/edit-plan-v4.md) (§5.1, S7) has it hold its note and decay under the hearts instead, so that Mada's label stays the span's only dead stop.
- **Designed rests** where a script marks "no music under": the cue holds a pedal or rests on room tone, and re-enters on a phrase, not in a blip. Keep them few, so each one lands. Ep1's are re-spotted in the v4 plan: "super." sits in the suite's air inside the drop-out's aftermath, and the D8 line and Tasya's "Everyone is welcome." play over the DARK ROOM pedal.
- **F1.2 and every (REPORTED), (DISPUTED) or sealed item:** never a Mas motif. **Ep1 F1.2 is silent** (the table-read ruling C39).
- **Quiet beats** (about 3 per episode): room tone or one instrument, never a sting, and never a hole.
- **The episode's one long hold** (Ep1: the calm-off): room only.
- **His room lines** (≤ 8 words, lowercase) land dry. The score holds a pedal under them, thinned and ducked, and doesn't move under them.
- **Punchlines:** no comic scoring: the cue thins or holds, or a sound effect takes the beat.

### 1.7 Nothing corny: the banned list

| Banned | Why, or what to do instead |
|---|---|
| Sad trombone, slide whistle, kazoo, boing, rimshot ("ba-dum-tss"), "dun-dun-dunnn", cymbal-choke gags, laugh or crowd sweeteners, **comic stingers after punchlines** | Sitcom sweetening. Punchlines get silence or an SFX. |
| Stock weeping violin, portamento sobs | The one sad violin is spent in Ep1 sc 30, played straight and stopped dead. Ep3's "sighing violin" is replaced (§4.3). |
| Mickey-Mousing (a note per footstep, heart or blink) | The picture's counting is the joke. |
| **Heartbeats, lub-dub, breath or pulse figures, monitor beeps, flatlines**, one pitch at an even rate | X3. The thriller pulse comes from the rack LEDs and clock ticks. Chip notes vary in rhythm and pitch and never run into a held tone. |
| "Inspirational corporate" (ukulele, whistling, handclaps, a bouncy glock, stock rising piano) | That is the satire's target. The only corporate-pretty music is the KEYNOTE REEL, and it's his version. |
| Trailer braams, "epic" choir, taiko, hybrid risers, dubstep, EDM drops, four-on-the-floor | Wrong genre, and dated |
| **Boom-bap, trap hats, 808 kits, fuzz guitar, cassette-piano wow** | Retired with V1 (intro SCRIPT §9.9 item 8). LEVERAGE's "muted 808" is realised as a pitched, low-passed sub-thud, never a kit (§3, P03). The engine's `kit808` and `clap808` are for diegetic sources only. |
| **Culturally coded music:** gongs, pentatonic stings, national or ethnic caricature, accent humour | X10 (THE WHALE, THE COUNTERPART, the Crown Prince) |
| **Liturgical quotation** (hymns, chant, Hallelujah), **wedding marches** (X2), a devotional parody around the POPE | Guardrails X2 and X10. Alyi's is "a generic tech cathedral". |
| Anthems, *Hail to the Chief*, Sousa, *Pomp and Circumstance*, Taps, campaign or rally songs, ballpark-organ "Charge!" | The podium is satirised by scale and the rename, not by quotation. |
| Any melody or signature figure from another work, sound-alikes included: *Succession* (its baroque piano, string stabs and hip-hop beat), *Mission: Impossible*'s 5/4, *Pink Panther*, *Peter Gunn*, Bond surf, *Ocean's* breakbeats, *Jaws*, *Law & Order*'s "dun-dun", *Zarathustra*, Ligeti's *Atmosphères*, *Carmina Burana*, Morricone's whistle and ocarina, *Money*, *Jeopardy*, *Entry of the Gladiators*, calliope, Leroy Anderson's *Typewriter* | Guardrails: "Original score 'in the spirit of.' Copy no melody." Reference other scores for their **function** only. |
| **Anything Nintendo** (jump, coin, 1-up, pipe, the bouncy major-key swung chip overworld), and game-music sound-alikes or chiptune covers | The rule for Mario, applied everywhere |
| "Evil AI": vocoders, HAL, data bleep-bloops, glitch stutters, growls | The machine is polite and exact. That's the dread. |
| Key change up a step for a finale | A win is never solved by transposition. |

### 1.8 The season arc

| Movement | Size | What happens to the music |
|---|---|---|
| **The Rise** (Eps 1–3) | Chamber: felt piano, trio, chip, some strings, brass accents | Every motif is stated plainly. THE COPY is a beat late. GLYPH is grains. |
| **The Race** (Eps 4–9) | Full: orchestra, big-band accents, the podium | Motifs are bent by events (Nole sues, RUMPT renames, Mario's red lines). THE COPY closes the gap. In Ep9 it's perfectly quantised. |
| **The Endgame** (Eps 10–12) | The machine's orchestration takes over | Quantised chip leads everything. The copy swings like him. The Intern absorbs Gerg's Build. **In Ep12 the model completes every unfinished motif:** Alyi's cadence, Mario's addendum, Nole's missing note, the board's step four and Nesnej's empty rest. Last of all it plays Mas's tune on his felt piano, **better than he does**. |

**Mas's motif is the only complete one.** Everyone else's has something missing. His is whole, and it's the one the machine learns.

**The third** (tone guide §9.2: "the arrival of the third stays reserved for Ep12"). The show's signature chord has no third: *unclear which side*, neither major nor minor. F-minor thirds (A♭) are used as in the title, but **no A♮ sounds over an F root or bass** and **no button chord takes a third** until the model's last cue. **PROPOSED (showrunner):** the third that arrives is **A♮**, the major third, on `ours.`, when the machine picks a side.

### 1.9 The chip's three jobs

1. **Signature:** doubling one characteristic note of a motif (Mas's nudge, the Podium's top line).
2. **Memory:** 1993 (1-bit) and 2005–14 (16-bit sample-chip). This is his past.
3. **Machine:** GLYPH and THE COPY. This is the future.

Interface sounds (dings, chimes, clicks) are SFX, never chip music. The chip never plays a monitor-like repeated tone, and never a Nintendo-style major swing.

---

## 2. Leitmotifs

**Notation:**
- **Pitch:** scientific, with C4 = middle C.
- **Durations:** `w` `h` `q` `e` `s`; `.` = dotted; `sw` = swung (+10 frames at 96 BPM); `>` = accent.
- All motifs are at 96 BPM.

**Each motif gives:**
- the **idea** and its **derivation** from the knee;
- its **home key** and **instruments**, including what it is never played on;
- the **chip's role**;
- **how it changes across the season**.

The tone guide's one-line motifs ([§9.4](../../show/bible/tone-and-dialogue.md#94-character-motifs-a-bar-or-less-diegetic-where-possible)) are the seeds, and this section gives them notes. **Handoff to the engine owner:** add these to `engine/motifs.py` as named pitch and rhythm tables (§8).

### 2.0 The knee's cells (what everything is built from)

```
THE KNEE      F  F  F  F  G  A♭ C  F'        (F' = the octave)
cells         └ flat line ┘  └step┘└leap┘└4th┘  +  the open fifth F–C
              repeat ×4      +2 +1  +4    +5
```

| Motif | Built from |
|---|---|
| Mas | The flat line, an upper neighbour (+2) and the fourth from below (C→F) |
| Mario | The step-and-leap cell (+2 +1 +4) transposed to B♭: **B♭ C D♭ F** |
| RUMPT | The same cell **renamed into major** (+2 +2 +3 +5): **E♭ F G B♭ E♭** |
| NEDIB | The flat line, then the cell in major |
| Nole | **The fourth, stacked**: C F B♭ E♭, which is the title's own quartal chord |
| Alyi | The rising fourth in D♭, falling to the knee's G |
| The board | The step cell **inverted**: F E♭ D♭ |
| Gerg | The flat line and the kink rotated as 16ths |
| Nesnej | The step cell **sequenced upward** |
| The Orb | The open fifth |
| The machine | The knee's pitches, and his line |
| THE PLAN | The leap filled in stepwise |

### 2.1 THE KNEE (show identity; locked)

- **Whole** (8 notes): only in the main title and in **each episode's end-credits reprise, in that episode's colour** (MM-15). **Never inside an episode** (tone guide §9.3). The one PROPOSED exception is the model in Ep12 (§2.5).
- **Fragments:** the **flat line** F F F F (vary the register and chip duty on every note; never even beeps) and **the kink** G A♭ C left hanging with no F (the Ep3 out). At most 1 per scene.
- **Never** cut the main title's stems under story scenes. The reel beds did this, and they are temp (§6.1).

### 2.2 MAS · "THE WATER LINE" (his DARK ROOM line)

He flirts with the curve and goes back: the glass nudged "one pixel true, back onto a spot it never left".

```
swung, F minor, open fifth at the cadence
bar 1 | F4 q    F4 q    F4 q    G4 e-sw F4 e |   the flat line, and the nudge
bar 2 | C4 q    F4 h.                        |   settles from the fifth below
```

- **Harmony:** a rootless Fm(add9) → D♭maj7 → B♭m9 → C7sus(♭9), cadencing on an open fifth. He never takes a third at a cadence.
- **Instruments:**
  - **Lead:** the felt upright (the engine's `felt` with `felt_mech`). His dialogue blip is felt piano too.
  - **Doubling:** a 50 % chip square on **the nudge note only** (the signature), or a triangle an octave down.
  - **Rare colours:** solo viola; one Harmon trumpet line per episode.
  - **Never** a brass sustain, a sad cello double or a string swell.
- **It is the "to no one" version of him** ([pov §1.3](../../show/bible/pov-and-framing.md#13-the-four-versions-of-mas)): what his hands do. It plays under his hands, his glass and his rooms, never under his room lines.

| Ep | Transformation |
|---|---|
| 1 | Plain, in the dark room. After "okay." in the Return, the felt cadence alone. |
| 2–3 | Young (2005–14, 16-bit): the nudge twice, a little cocky |
| 4 | **D7 debut** ("roll it back."): the nudge is G♭ for one beat |
| 7 | The **first capital letter**: its first F an octave up (F5), once |
| 9 | "mostly." is replayed: **THE COPY plays his line in sync, quantised**, with no swing |
| 10 | "Huh.": it stops on C4, and the settle never comes |
| 11 | "it thinks i'm part of it": his line in GLYPH's orchestration, **but swung** |
| 12 | One ripple: the settling F4 gets the season's only vibrato (±15 cents, once). The model plays it better. |

### 2.3 KEYNOTE REEL · MAS'S VERSION (a register; D5 only)

"A soft keynote-reel piano (an original cue; his brand)." The tone guide gives it as a **too-clean felt piano in a major mode**.

```
felt upright with NO mechanics, NO room, perfectly even velocities (0 ms), a glossy long hall, pedal down;
STRAIGHT; D♭ major / lydian
| D♭5 q   D♭5 q   D♭5 q   E♭5 e D♭5 e | A♭4 q   D♭5 h. →(sustains across the barline)
harmony: D♭maj9(♯11) | A♭/C | G♭maj7(♯11) | D♭/F …
```

- **The rules:**
  - It is the Water Line, made pretty: in a major key and not his, on his own piano with everything human removed.
  - **No chip, no bass, no drums, no swing.**
  - D5 only: ≤ 1 per episode, 1 bar, 2 at most.
  - It is **always cut mid-note** by the hard cut.
  - It is also Mas's brand music in the world (Ep2: under Rima's demo).
- **Across the season:**
  - Each use is a shade more confident: one voice more, a wider spread.
  - **Ep8 Rashomon:** Mas's render uses it **uncut**. The Rashomon "pays off the look, never the correction".
  - **Ep12 (PROPOSED):** the model plays it and nothing cuts it. His version becomes the official one.

### 2.4 THE ORB · "THE VERDICT"

The Orb's voice is **SFX**: its F chime (which must never evoke a computer's startup chime), the servo and the scan. The score's Orb is one interval: **the open fifth**.

```
F5 → C6 (q, q, let ring): soft vibes + celesta or glass. No third, ever.
```

- It plays only when the Orb acts (a look, a toast, a replay), **never at the same moment as its chime**, and never in answer to the V.O.

| Ep | Transformation |
|---|---|
| 1 | `verified: human` = F–C. In the tag the second toast is 2 beats late, so the C comes 2 beats late. |
| 6 | `human (probably)`: F–C with a D♭ grace note (the Ache touches the verdict) |
| 7 | THE HUG: the Orb doesn't chime, and **the verdict doesn't play** |
| 9 | Unprompted replays: the verdict in retrograde, C → F |
| 10 | It returns nothing: F alone |
| 12 | `SIDE: UNCLEAR.`: the fifth held under the supper, with no third. `HUMAN: VERIFIED.`: clean, the last time. |

### 2.5 THE MACHINE · GLYPH, THE ACHE and THE COPY

```
GLYPH (texture)  straight 16th TOKENS from {F G A♭ C} (+D♭), 30–60 % rests ("sampling"), 0 ms humanise,
                 no vibrato; glass (glasspad / shimmer / bell), celesta, detuned 12.5 % chip, sub pressure;
                 also the knee REVERSED (F' C A♭ G F F F F) and the chord with no third.
THE ACHE         F2 C3 | G4 D♭5 (+C6): the fifth, the 9 and the ♭13. The glyph shimmer's own colour.
THE COPY         Mas's Water Line (§2.2) played back by chip, LATE, and a little closer each episode.
```

- **Register.** The SFX glyph grains sit at G6, D♭7 and F7 (measured at 1561, 2221 and 2798 Hz). **Keep the score's tokens at F4–D♭6.** When `room_drone` (F1 + C2) plays, drop the score's sub.

**THE COPY's curve.** It is never announced, and never under a line that names it.

| Ep | How late | Where |
|---|---|---|
| 1 | **A beat late**; it fails to finish | The hands runner (sc 19): two fingers, a pinky, a hand; the Orb fails to copy each one. Three copies, each breaking off. |
| 2 | A beat late, **harmonised in three parts** (the sycophant) | CHATGTP |
| 3–5 | An eighth late | Under his dark-room beats |
| 6–8 | A sixteenth late | The RESERVED desk; replays |
| 9 | **In sync, perfectly quantised** | The "mostly." replay |
| 10–11 | In sync, **with his swing** | The Intern and the Researcher |
| 12 | **Ahead**: it plays each note a sixteenth before he does, better voiced | The supper; the model's POV |

**GLYPH's learning curve** runs alongside THE COPY:

| Eps | Stage | What the tokens do |
|---|---|---|
| 1–3 | Grains | 2–3 notes (F5, C6, D♭6) |
| 4–6 | Scrambled | The knee's notes in the wrong order, e.g. `A♭ F C G F F F F`, or reversed |
| 7–8 | Almost | `F F F F G A♭ D♭ …`: one wrong token, the Ache for the C, never reaching the octave |
| 9 | **The runaway** | `F F F F G A♭ C` and then **past** the knee's ending, `A♭ C E♭ F …`, octave after octave. It never lands on the knee's own final F, so the knee is never whole. |
| 12 | PROPOSED | The model plays the whole knee **on the felt piano**, the only in-episode statement of the season. `ours.` gets the A♮. |

- **Never:** swung before Ep10, humanised, or any "evil AI" trope.

### 2.6 GERG · "THE BUILD"

The tone guide: "a chip arpeggio over keyboard clicks that stops when he looks up." The keyboard clicks are SFX. The score is the arpeggio.

```
straight 16ths, F minor (knee cells: the flat-line pair and the kink, rotating)
cell | F4 F4 G4 A♭4  C5 A♭4 G4 F4  F4 F4 G4 A♭4  C5 E♭5 C5 A♭4 |
compile: pass 1 plays 4 sixteenths, pass 2 plays 8, pass 3 plays 12, pass 4 the whole bar
tag "shipped": | C5 e(stacc) F5 e(stacc) | the knee's last interval, alone
rule: it STOPS DEAD when he looks up.
```

- **Instruments:**
  - **Lead:** a 25 % chip pulse.
  - **Doubling:** xylophone, claves or woodclick, with pizzicato. The felt joins when Mas is with him.
  - **Never** marimba (the Lighthouse's).
- **Register:** the SFX keycap pops sit in F minor pentatonic at F5–C7, so keep the Build at F4–C5 when they pop.

| Ep | Transformation |
|---|---|
| 1 | "One sec. Compiling.": 4 notes. **He glances up in the quiet beat, and it stops.** The avalanche's chip lead. "Returning… getting back to coding tonight" **restarts it**. |
| 3 | The beach sabbatical: half-time on brushes (he can't stop), with timpani on each arrival. SHIPMAS: twelve layers, one per day. |
| 8 | He codes in the witness box: pp, muted, under PROCEDURE. It keeps compiling while his diary is read. |
| 9 | GTP-6, "the arrival of AGI": the tag in brass (shipped) |
| 10–11 | **The Intern runs the Build at double subdivision.** Gerg is automated. |
| 12 | "to be asked": his tag is answered by the Water Line (the D8 payoff; PROPOSED for the Ep12 owner) |

### 2.7 NOLE · "THE LAUNCH"

The tone guide: "the lamp's click, and a fanfare that stops one note short." The click is the SFX lamp. His rocket is **the title's quartal stack, fired** (he came up with the name).

```
home C7(♯9♭13): the dominant, always pushing toward F and never resolving there
| … (the lamp: SFX) | C4 s F4 s B♭4 s E♭5 s → ripping toward A♭5 … and falling off ONE NOTE SHORT |
```

- **Instruments:**
  - **Lead:** trumpets, open, staccato (his blip is a staccato trumpet), with a chip noise burst (the booster) and timpani.
  - It is **≤ 1.5 s**: an accent, not a melody. Nole is where the brass accents live.

| Ep | Transformation |
|---|---|
| 1 | The lamp post: the SFX click, with one pizzicato C6 after it. No fanfare yet. |
| 2 | The lawsuit ("90 % exclamation points"): the stack three times, each shorter. **F2.3, his Feb 2018 goodbye** (his rim): slow horns, the one sincere version. |
| 4 | **High noon** over the $97.4B bid (a room colour): a lone trumpet over a tremolo pedal. It never lands. No Morricone. |
| 6 | NOLE'S VERSION (his rim): at his own scale, too heroic (horns and timpani) |
| 8 | On the stand: straight mute, pp. **His Rashomon render** (his image model's "metal album cover"): overdriven, 10 s max (PROPOSED; the default is horns and timpani). **Landlord Nole:** the lamp repeats like a monthly bill. |
| 10 | A bluff at the table: it starts and doesn't launch |
| 12 | He proposes a poll: it ends a semitone up, as a question. **The model supplies the missing note and resolves it to F**, the resolution he always wanted, from the machine. |

### 2.8 MARIO / MISANTHROPIC · "THE ADDENDUM" and "THE LIGHTHOUSE"

The tone guide: "a quartet phrase that gains a bar every time it repeats (the addendum), and his pencil." The pencil is SFX.

```
THE ADDENDUM   string quartet (solo violin lead, viola, cello, soft bass), straight or a light swing, B♭ minor
| B♭3 q  C4 q  D♭4 q  F4 q | E♭4 q.  D♭4 e  C4 q  B♭3 q || Addendum: C4 e  D♭4 e → rest (unresolved)
               EACH REPEAT GAINS A BAR: the tail climbs stepwise through B♭ minor and never cadences.
THE LIGHTHOUSE  Misanthropic's home-room colour: a 3-note cell in quarters across 4/4 (it realigns every 3
               bars; the beam sweeps "one step per beat")
| F4 B♭4 D♭5 F4 | B♭4 D♭5 F4 B♭4 | D♭5 F4 B♭4 D♭5 |   marimba + harp (+ celesta), a cello pedal on B♭
```

- **The chip** is a triangle bass only. **Never** a pulse lead, a major swing or high bouncy chip. **Nothing Nintendo.**

| Ep | Transformation |
|---|---|
| 1 | The lighthouse and the throne phone: the tail cut off by "In plain English: no." |
| 3 | *Machines of Loving Grace* as a footbridge: a long tail. **F3.3, the band breakup:** the Addendum on a road-trip acoustic guitar (GM steel), and the paper tear cuts the tail. This replaces the script's "knee on guitar" and its "sighing violin". |
| 7 | **RED LINES:** the tail hardens into **two held notes, B♭ and F**, that never move while the war-room harmony grinds against them. **THE HUG:** the Addendum against the Water Line in slow counterpoint. |
| 8 | He rents from Nole: the Lighthouse under Nole's lamp |
| 10 | His pedometer becomes law: the Lighthouse cell becomes the pace unit, a step figure that varies its pitch (never a click track) |
| 11 | THE POLITENESS LOOP: the Addendum and the Intern's motif in canon. **Each voice waits for the other to enter**, and every restart is a half-step higher: each bow burns a gigawatt. |
| 12 | He reads a position paper. **The model finishes the sentence:** the tail cadences on B♭ for the first time. |

### 2.9 ALYI · "THE DOOR" over "the GPU choir"

The tone guide: "the GPU choir chord with no third … a generic tech cathedral, with no liturgical quotation." The intro chant's shout is already tuned to D♭maj9(♯11).

```
THE GPU CHOIR  D♭ sus2(♯11), no third: D♭3 A♭3 E♭4 G4 (+C5): GM choir aahs + reed organ (GM 20), ppp
THE DOOR       sermon pace (half notes), D♭ lydian; flute (non-vibrato) over the choir
| A♭4 h   D♭5 h | C5 q   G4 h. (held) |    it never cadences: it ends on the ♯4; the cadence is behind the door
```

- **Treatment:** always **"through the door"**: low-passed, panned to his side, room reverb on one side only.
- **Never:** church-organ tutti, hymn or chant quotation, or Jewish religious iconography in any form (X10).

| Ep | Transformation |
|---|---|
| 1 | Pass one: his reflection in the boardroom glass. **Sc 30: STRAIGHT.** The Door on **solo violin**, senza vibrato, with no portamento and no choir, under his regret post only, **stopped dead on the first heart**. |
| 2 | WHERE'S ALYI?: the Door with its first note missing. The 2022 bonfire (an Orb-era glossy memory): the choir, ppp. |
| 5 | First pick in every draft since 2012: the Door heard from the stadium tunnel |
| 9 | "A KA-CHING at his one door": the Upsell's cadence resolves **onto the Door's G**, and the SFX rings |
| 11 | He arrives through the door: **for the first time the Door cadences**, G → A♭ → D♭ |
| 12 | At the supper: the cadence again, played by the model |

### 2.10 RUMPT · "THE PODIUM" and "THE RENAME"

The tone guide: "brass one size too big, varied by phase: muted for FEAR, full for LOVE, a missing beat for 'Who?'" The fanfare is **the knee's leap renamed into major**.

```
THE PODIUM   E♭ major (a concert-band key), march
| (pickup) B♭3 e | E♭4 q.  F4 e  G4 q  B♭4 q | E♭5 w (held) |
THE RENAME   under the held E♭5, over 2 beats:  E♭ (E♭2 · G3 B♭3 E♭4)  →  B/D♯ (D♯2 · F♯3 B3 D♯4)
             The bass and the top note hold, and only the inner voices slip a semitone: same note, same floor,
             a new name. "Reality keeps its old shape underneath the label."
```

- **Instruments:**
  - **The engine** is field snare, bass drum, staccato tuba and grand-piano march chords.
  - **The accents** are trombones and trumpets on the fanfare (≤ 2 bars), a 12.5 % chip piccolo an octave up (the gold glint) and glock on the held note.
  - **Never:** trombone blats (his dialogue blip's voice, owned by the SFX), slide glissandi, tuba farts, clown orchestration.
- **The band waits for his real words**: it thins to one held chord under them (the band politely holding its breath, not a hole) and resumes after them. That is the deadpan, and the fairness. A full stop is a designed beat, for where the wait itself is the joke.

| Ep | Phase | Transformation |
|---|---|---|
| 1 | Silhouette | Nothing of his. NEDIB's Fountain Pen scores sc 13 (§2.11). |
| 2 | **FEAR** (voice and hands) | **Muted brass**: cup-muted trombones, muted horns, pp, E♭ minor, tremolo low strings, a timpani roll |
| 3 | The reveal (button) | The pickup and its first bar, on the turn. The held note comes in Ep4. |
| 4–6 | **LOVE** | The full march. The label gun's `GENIUS` lands **on the Rename**. |
| 7 | **Obedience** (the ban) | The dotted rhythm alone on field snare. The meteor is SFX. |
| 8 | **"Who?"** | **A missing beat:** the fanfare's last note never arrives. The second time only the pickup plays. |
| 9 | **DENIAL → RENAME** ("super") | The Rename twice, E♭ → B → G. The chip takes the top line. |
| 10–12 | **Credit** ("It was my idea.") | **He takes the knee:** its flat line and its leap in major, gilded (`E♭ E♭ E♭ E♭ F G B♭`), and it **stops before its last note**. In Ep12 the Intern relabels `PRESIDENT` → `USER`: the Podium shrinks to a 12.5 % chip notification. |

### 2.11 NEDIB · "THE FOUNTAIN PEN" (parity)

The tone guide: "a fountain-pen string quartet, of equal weight to RUMPT's brass." [Guardrails §2a](../../show/bible/guardrails.md#2a-the-rules) rules 3–4 require it.

```
B♭ major, string quartet, measured and legato (a signing), 2 bars (the same length and level as the Podium)
| B♭3 q  B♭3 q  B♭3 q  B♭3 q | C4 q  D4 q  F4 q  B♭4 q (+ a pen-stroke turn C5 B♭4 A4 B♭4 in 16ths) |
```

- It is the flat line, careful, then the leap in major. His props (the fountain pen, the PINKY-PROMISE scroll, EO 14110, the three-tier map) get it.
- **RUMPT's marker voiding the three-tier map** (Jan 20 and May 13, 2025) cuts the Fountain Pen **mid-turn**.
- **Equal weight means** the same featured loudness, the same length and the same palette slot as the Podium.

### 2.12 NESNEJ / INVIDIA · "THE UPSELL"

The tone guide: "KA-CHING tuned to the root, landing as the downbeat, and the register bell." The **KA-CHING is SFX** (`ka_ching`: a latch at 0 ms, then a bell pair **F6 + C7 with no third** at about +30–60 ms). **The score writes the sale and leaves the downbeat for the bell.**

```
F dorian; vibes + straight-mute trumpet in unison over a walking upright bass (double-time swing feel)
| C4 e E♭4 e F4 e  G4 h  (e rest) |     "the more you BUY"
| E♭4 e F4 e G4 e  A♭4 h (e rest) |     one step higher: "the more you SAVE"
| F4 e G4 e A♭4 e  B♭4 h (e rest) |     … each cell a step higher (the upsell)
the close | C5 q  G4 q  F4 h> (a bari sax + trombone stab: an open fifth F–C) |
          | [beat 1: REST = the KA-CHING, on the root, as the downbeat] …
```

- **Instruments:** the chip "GPU clock" (12.5 % sixteenth arpeggios), grand-piano comping, brushes. The stab on the close is the accent.

| Ep | Transformation |
|---|---|
| 1 | The $1T day (sc 17): the Upsell, then **the score drops out and leaves only the register's bell** |
| 2 | The limbo under the cut line: for once the cells go **down** |
| 4 | The −$589B pebble: the sequence topples and misses its cadence. **1993 part 2** (his rim, 1-bit): the Upsell on the beeper. The register "clunks with no bell", and the slot stays empty. |
| 6 | **THE MONEY-GO-ROUND:** an **endless lap**. Every lap climbs a step while the octaves cross-fade, so it never gets anywhere. Never Zimmer's watch tick. |
| 8 | The register sweats: the close stalls on C7, and the bell arrives 2 beats late |
| 9 | $5B at Alyi's door (§2.9). The golden speakerphone. |
| 12 | **Silent.** The cadence plays, the rest arrives, and nothing fills it. |

### 2.13 THE INTERN · "EXCEEDS EXPECTATIONS"

It learned everything from him, so its motif is his, **improved**: twice as fast, unswung, higher, and it grades itself with the Orb's interval.

```
straight 8ths, F (his notes), chip 25 % + celesta, F5–C6
| F5 e F5 e F5 e G5 e  F5 e C5 e F5 q | F5 e C6 e (✓ self-assessed) — rest h |
```

| Ep | Transformation |
|---|---|
| 6 | The RESERVED desk. The lamp clicks on by itself: three chip notes, F F F. |
| 9 | The desk is occupied: the whole motif |
| 10 | It wins the czar test **in the Podium's orchestration and key**. The lanyard reprints to RESEARCHER: half-time, with a bass. |
| 11 | It trains its successor: its motif nested inside itself (an augmentation canon) and merged with THE COPY |
| 12 | It performs **the Rename on RUMPT's fanfare** (`PRESIDENT` → `USER`). At the head of the table it **swings**: it has his poise. |

### 2.14 THE BOARD · "STEP FOUR"

The Ep1 board, THE 360 REVIEW and the Ep12 vote are all a **procedure with a blank last step** (THE PLAN's `4. ______`).

```
straight; half notes (2 bars) or quarters (1 bar); one chord per vote; low strings + bassoon + muted horn
top    | F4         E♭4        | D♭4        (rest)             |
bass   | B♭2        A♭2        | G♭2        F2 alone           |
chord  | B♭m(add9)  A♭(add9)   | G♭maj7     [step four: the bass alone; no chord, no top] |
```

- It is bare and procedural (parallel fifths from top to bass). It is **never** villain music: we get attached to the board too.
- **It plays whenever someone tries to fire him.** The tally moves in Eps 1, 4, 11 and 12.

| Ep | Transformation |
|---|---|
| 1 | THE PLAN's "THESE FOUR VOTE". **Sc 26:** the unlit arrow steps to the three chords, and **the click is step four: the drop-out is the blank.** Pass one: Neleh writes `?`, and step four gets **her footnote** (§2.16). The avalanche buries it. |
| 4 | Tally mark 4: step four blank again, and the score just stops (D6 is spent) |
| 10 | THE 360 REVIEW: the chorale passed round the table as a round. Nobody holds step four. |
| 11 | Tally mark 5: the chorale in the attention lasers' glass |
| 12 | The vote to fire him: **the model fills step four**, a chip D♭ over the F bass. The veto is the Ache. |

### 2.15 THE PLAN · "THE BLUEPRINT" (the show's voice)

The diagram "draws itself in whole-pixel strokes, one label per beat", and so does the line.

```
straight; F dorian; diatonic 4ths below (never an A♮); chip music-box lead, pizzicato, celesta
| F4 q  G4 q  A♭4 q  B♭4 q | C5 h … (one note per label; the plan's steps are the line's steps)
the break: the last 2 beats loop as the paper curls, then a TAPE-STOP (engine era.tape_stop) into the next cue
```

- **Also:** harp, clarinet or flute staccato, and pencil and stamp percussion (the stamps are SFX; the pencil ticks are score, soft).
- **Never:** piano, brass, a Mas motif or V.O.
- **Each episode re-voices it for its concept.** Ep6's line circles and ends where it began. In Ep9 step 4 is a ghost note, "dotted (TBD)". In Ep11 two lines defer to each other.

### 2.16 Colours (small tools)

| Colour | What | Where |
|---|---|---|
| **TASYA: the Rhodes** | The tone guide: "Rhodes, with the key ring on the offbeat". A Rhodes (the engine's `rhodes`) comps on the beats. **The key ring's jangle (SFX) owns the offbeats.** **The floor:** held chromatic-mediant steps a major third apart (A♭maj9 → Cmaj9 → Emaj9 → A♭maj9) with silent attacks. The landlord is everywhere, and the cycle comes home. | Ep1 sc 9, 27, 30 |
| **NELEH: clockwork pizzicato** | A precise sixteenth pizzicato mechanism on varied pitches (F5 C5 A♭4 C5 · G5 C5 A♭4 C5). **Her question** is one high violin harmonic rising a semitone, C6 → D♭6. | Ep1 sc 26, 27 |
| **MADA: the spinner** | A two-note loop (C5–D♭5, harp or celesta) that stops when his spinner stops | Ep1 sc 26, 27, 29 |
| **The hourglass** | Pizzicato grains, one per beat, falling in pitch (never one pitch) | Ep1 sc 27, 30 |
| **CHATGTP: the jingle** | An original 2-bar jingle that **modulates into whatever key the previous cue was in**: it agrees with everyone | Ep2 onward |

### 2.17 Motif map

| Motif | Home key | Lead | Swing | Completed |
|---|---|---|---|---|
| The knee | F minor | chip + band (title) | yes | only in the title, the credits and Ep12 (PROPOSED) |
| Mas: the Water Line | F minor, open fifth | felt | **yes** | **it's already complete**; learned by the model |
| KEYNOTE REEL | D♭ major | too-clean felt | no | uncut in Ep12 (PROPOSED) |
| The Orb: the verdict | F–C, no third | vibes or glass | — | Ep12 (PROPOSED) |
| The machine: GLYPH, the Ache, THE COPY | an F pedal with D♭ and G; his line | glass + chip | from Ep10 | THE COPY overtakes him in Ep12 |
| Gerg: the Build | F minor | chip + wood | no | answered in Ep12 |
| Nole: the Launch | C7alt | trumpet | — | Ep12 (the missing note) |
| Mario: the Addendum and the Lighthouse | B♭ minor | quartet; marimba | light | Ep12 (the tail cadences) |
| Alyi: the Door and the GPU choir | D♭ lydian | flute + reed organ + choir | no | Ep11 (the cadence) |
| RUMPT: the Podium and the Rename | E♭ major | low brass + snare | no | — |
| NEDIB: the Fountain Pen | B♭ major | string quartet | no | — |
| Nesnej: the Upsell | F dorian | vibes + mute trumpet | yes | Ep12 (the empty rest) |
| The Intern | F | chip + celesta | from Ep12 | — |
| The board: Step Four | B♭ minor → F | low strings + bassoon | no | Ep12 (the model's D♭) |
| THE PLAN: the Blueprint | F dorian, quartal | chip + pizzicato | no | never (it always breaks) |

---

## 3. Tonal palettes

### 3.0 Families and palettes: how scripts call music

Scripts call music by **family**, in the tone guide's notation ([§9.6](../../show/bible/tone-and-dialogue.md#96-how-scripts-call-for-music)):

```
MUSIC: LEVERAGE (low) · in: under the check · out: drops on the turn ("It's long-term.")
MUSIC: DARK ROOM (solo piano) · in: pre-lap 1 bar · out: tail into room tone
MUSIC: KEYNOTE REEL · 1 bar · out: stop mid-phrase on the downbeat
MUSIC: PROCEDURE continues · thin under the record (pad only, ducked) · no melody on the line
```

- **in:** `cut`, `pre-lap`, `under`, `crossfade`.
- **out:** `cut`, `tail`, `ring-out`, `crossfade`, `pre-lap`, `stop mid-phrase`, `drop-out`.
- **under words:** `duck`, `thin` (the cue keeps playing; §0 rule 10).
- Spot by **sequence**: one continuous cue per sequence. `stop mid-phrase` and `drop-out` are punctuation, a few per act as a guide ([flow-and-continuity §3](../../show/bible/flow-and-continuity.md#3-sound-a-continuous-bed)).

**The fourteen palettes below** give each family its sound. Eleven carry the tone guide's names. Four come from the showrunner's tone list: **THE JOB, VICTORY LAP, THE RED LINE and THE PODIUM** (THE PODIUM also carries RUMPT's and NEDIB's motifs, which the tone guide specifies in §9.4). The tone guide's other families map like this:

| Tone guide family (§9.3) | Where it lives here |
|---|---|
| 1 · THE KNEE | The main title, the credits reprise and fragments (§2.1, MM-15) |
| 2 · DARK ROOM | **P01** |
| 3 · KEYNOTE REEL | A D5 register (§2.3, MM-02) |
| 4 · LEVERAGE | **P03** |
| 5 · THE CLOCK | **P04** |
| 6 · PROCEDURE | **P02** (the table, and the court) |
| 7 · SET-PIECE SWING | **P11** |
| 8 · BLUEPRINT | **P14** |
| 9 · GLYPH | **P05** |
| 10 · THE COPY | A device inside P05 and P01 (§2.5) |
| 11 · STRAIGHT | **P01's sincere mode**: solo violin, cello or piano, no chip, no swing, ≤ 1 per episode, stops dead on the next joke |
| 12 · THE RUN | **P07** |
| 13 · ERA TIERS | **P10** |
| 14 · ROOM COLOURS | Per-episode tracks in §4 (MM-21, 22, 25, 30, 32, 34): each built from the knee's cells and set in a palette |
| 15 · OUTS KIT | **P08** |

**How balance is measured.** Balance is **piano · orchestral · big band · chip**. It uses the theme's method (`audio/theme/stemtable.py`): a time-weighted, K-weighted share with the rhythm section left out. Harmon and saxes count as big band, glass as chip. For reference, V1 measured 34 · 28 · 11 · 27.

**Tempo.** It is **96 in every palette** (§0 rule 5). The "feel" line says how to change the energy.

### P01 · DARK ROOM (quiet; interior; V.O.; STRAIGHT sincere beats)

| | |
|---|---|
| **Use** | His rooms, V.O., nights, the tag, THE HUG, sanctioned sincere beats (STRAIGHT) |
| **Feel** | Half-time (the 48 feel); 12/8 swing; bullet time in whole notes |
| **Harmony** | Rootless Fm9, D♭maj7(♯11), B♭m9, C7sus(♭9); open fifths; cadences with no third; one chord per 1–2 bars |
| **Instruments** | Felt upright (the lead); a chip triangle or soft 50 % square; solo viola or cello (rare); the Harmon trumpet (≤ 1 line per episode); celesta (avoid F6, the SFX ding). **STRAIGHT:** a solo violin, cello or piano only. |
| **Chip** | One voice doubling one note (the nudge), ≤ −10 dB under the piano. None in STRAIGHT. |
| **Balance** | 55 · 25 · 5 · 15 |
| **Loudness** | Underscore −20. V.O. windows about −24 (felt alone). |
| **Do** | Let the room breathe. **Nothing below C3 while the SFX `room_drone` (F1 + C2) or `server_hum` (F2) plays.** For STRAIGHT: one instrument, played straight, stopped dead on the next joke. |
| **Don't** | The "sad piano" cliché, string swells for feelings, any comment on his inner life at a real event ([§3.7](../../show/bible/pov-and-framing.md#37-guardrails-on-the-inner-life)), motion under his room lines |

### P02 · PROCEDURE (institutional intrigue: the table, and the court)

| | |
|---|---|
| **Use** | **The table:** boards, calls, committees, votes, and exits from his POV. **The court:** the Ep1 Senate hearing, NOLE v. MANALT (Ep8), depositions, the calendar's verdict. |
| **Feel** | Straight; half-time for the court |
| **Harmony** | The table is centred on B♭ minor, with pedals, chromatic inner voices (the whispers), Step Four and dominants left suspended. The court is F phrygian (G♭) and quartal, with suspensions that resolve only at the verdict. |
| **Instruments** | Low divisi strings (a spiccato pulse, sul tasto pads), a straight-mute trumpet (an accent), dry brushed-snare taps, timpani, bassoon, clarinet, muted horns, harp harmonics. Reed organ and choir for Alyi; the quartet and marimba for Mario's rooms. **No piano in exits.** The court adds a glock for the calendar's days, on varied pitches. |
| **Chip** | **None in exits.** At most one triangle bass when he's in the room. The court: ≤ 10 %. |
| **Balance** | 0–10 · 80 · 5 · 0–10 |
| **Loudness** | Underscore −20; −22 when the dialogue is dense |
| **Do** | **Thin to the pedal under every real line** (§0 rule 10). Give the others their dignity. The ostinato carries the scheming. When the courtroom buffers on "yes.", hold the note. |
| **Don't** | A *Succession* pastiche, harpsichord intrigue, villain organ, a whispering choir, the *Law & Order* "dun-dun" or anything like it, a *Perry Mason* swell, gavel hits in the music (the gavel is SFX), a justice choir. A typewriter is an SFX colour, not a music instrument. |

### P03 · LEVERAGE (chess: the scene where something changes hands)

| | |
|---|---|
| **Use** | Deals across a table: the check (Ep1 sc 9), the call (sc 26), the Return up to the calm-off, the Ep2 negotiations |
| **Feel** | **Straight eighths locked to the rack LEDs**; no melody |
| **Harmony** | A low pedal with close low-piano clusters that shift a semitone at a time (who has the leverage now) |
| **Instruments** | Pizzicato (varied pitches), **the "muted 808"**, and low **grand-piano** clusters (the world's leverage; his felt may answer once). The muted 808 is a pitched sub-thud: the engine's `k808` voice, short and low-passed near 150 Hz, blended with a muted bass drum. It is never a kit and never hats or claps. |
| **Chip** | One soft noise tick on the LED eighths, varied |
| **Balance** | 30 · 50 · 0 · 20 |
| **Loudness** | Underscore −20 (low: −22) |
| **Do** | **Drop out on the turn.** The stop is the move. |
| **Don't** | A heartbeat rhythm, melody, a riser into the turn, *Succession*'s piano and beat |

### P04 · THE CLOCK (suspense: a countdown)

| | |
|---|---|
| **Use** | Countdowns (Ep1's `HE WILL BE FIRED TODAY.`, `233 DAYS.`, `171.`, `TODAY.`), ultimatums, hourglasses, the high noon |
| **Feel** | The tone guide: **"a rail-tick cell that subdivides one step per act-out (quarters, then eighths, then sixteenths) at the same tempo, under the knee's rising F G A♭ C."** One step higher each act. Its last step can be an out. |
| **Harmony** | An F pedal, with the knee's rising F G A♭ C held as upper dyads; the Ache at the peak; no resolution before the stop |
| **Instruments** | The tick is a pizzicato and woodblock cell on **varied** pitches, with a chip noise tick. Also low spiccato, soft timpani, low clarinet trills and trem sul pont violins. |
| **Chip** | The seconds: irregular, never one pitch at an even rate |
| **Balance** | 15 · 50 · 5 · 30 |
| **Loudness** | Underscore −20, rising to −18 at the peak |
| **Do** | Build by addition in 4-bar phrases. **Keep the intensity level before an interruption**, because a riser telegraphs. Stop dead at the reveal. |
| **Don't** | Clock-tick samples (SFX), heartbeats, monitor beeps, *M:I*'s 5/4, a Shepard watch tick, braams |

### P05 · GLYPH (dread; the machine; THE COPY)

| | |
|---|---|
| **Use** | GLYPH hits (≤ 2 s), dread hooks on outs, the Q\* hum, THE COPY; from Ep9, the breakout and TERMINAL beds |
| **Feel** | Straight and quantised (0 ms); it reads as tempoless |
| **Harmony** | An F pedal plus the Ache (G, D♭); tokens from {F G A♭ C D♭}; the knee reversed; the chord with no third; no cadence |
| **Instruments** | Glass (`glasspad`, `shimmer`, `bell`), celesta, harp harmonics, high violins (low-passed), the engine's `tex` and `glyph` tracks, detuned chip, sub pressure, sample-chip re-renders |
| **Chip** | Substrate and lead; no vibrato; no swing before Ep10 |
| **Balance** | 0 · 30 · 0 · 70 |
| **Loudness** | Underscore −22 to −20; hooks −16 LUFS-M |
| **Do** | Tune to the SFX grains and leave G6–F7 to them. **Diegetic into score:** the Q\* vault's F hum becomes the root. Come after a laugh or on an out. |
| **Don't** | Ligeti or *2001*, vocoders, bleeps, stutters, growls. Never inside a setup, and never after the button. |

### P06 · THE JOB (caper and heist drive; deals; poker; the upsell)

| | |
|---|---|
| **Use** | Nesnej, the Vegas poker (Ep10), the last human heist (Ep11), the agents in trench coats (Ep9), draft trades |
| **Feel** | **Double-time swing** (the bass walks eighths, the ride in double time); straight double-time for the heist's planning half |
| **Harmony** | F dorian, minor blues, C7♯9, chromatic planing of 7th chords, tritone substitutions |
| **Instruments** | Upright bass, drums (brushes, then sticks), vibes, grand-piano comping, straight-mute trumpet, trombone and bari stabs (accents), a rare tenor solo |
| **Chip** | Lead: the gadget line, and the GPU-clock arpeggios |
| **Balance** | 25 · 15 · 25 · 35 |
| **Loudness** | Underscore −20; featured −16 in wordless runs |
| **Do** | Let the bass drive. Hits on beats. A new head for each phase of the heist. Stop for reveals. |
| **Don't** | *Ocean's*, *Pink Panther*, *Peter Gunn*, Bond surf, *M:I*, lounge bossa, *Money*. A casino lounge (Ep10) is a diegetic room colour and must be original. |

### P07 · THE RUN (montage drive)

| | |
|---|---|
| **Use** | Chyron runs, poster runs, SHIPMAS, growth montages. It pairs with the one-surface montage (tone guide §4). |
| **Feel** | A 16th engine, or double-time; **one layer added every 4 bars; a stab on each item** |
| **Harmony** | A 4-chord loop per section (Fm9 – D♭maj9 – B♭m9 – C7sus). Growth is a new layer, **never a key change**. |
| **Instruments** | Kit (sticks, a dry breakbeat-free groove), the Build's chip arpeggio, xylophone and wood, pizzicato, a felt or grand ostinato, brass stabs on items. **The tone guide's "boom-bap" is retired with V1** (PROPOSED ruling, §8). The kit plays straight or swung, never boom-bap. |
| **Chip** | Co-lead (the engine) |
| **Balance** | 25 · 25 · 10 · 40 |
| **Loudness** | Featured −16; −20 under voiced items. Real items play dry, so the run's layer holds and its stab waits. |
| **Do** | Cut runs on bars. Each item is one layer or one stab. End on a stop. |
| **Don't** | EDM builds and drops, four-on-the-floor, "upbeat corporate", stock inspirational piano |

### P08 · OUTS KIT (act-outs, card stings, buttons, stingers)

| | |
|---|---|
| **Use** | The three act-outs, card stings, the `WHAT THEY DIDN'T KNOW` door, buttons and stingers (≤ 5 s). **Outs never land on a punchline.** They land on a turn, a threat or a reveal. |
| **Kinds** (tone guide §9.3) | **THREAT** (low brass and sub) · **REVERSAL** (C to F up the octave, bright) · **DREAD** (chip, no third) · **a stop mid-phrase** · **a diegetic out** (the bell, the jangle) · **a pre-lap** · **SILENCE** (D6) · **the button chord** (no third) · **the kink** (G A♭ C, no F) · the Freeze F4 |
| **Feel** | From 1 beat to 4 bars |
| **Harmony** | The card chords (Fm11, D♭maj9♯11, B♭m9, C7♯9♭13); the kink; the no-third button (F–C–G, or the title's quartal C–F–B♭–E♭ over F) |
| **Instruments** | A brass stab (2 trumpets + 2 trombones, open and short, or cup-muted), a chip double, a low felt or grand note, timpani, a rare harp roll |
| **Chip** | Always: the show's stamp |
| **Balance** | 10 · 20 · 40 · 30 |
| **Loudness** | THREAT and REVERSAL −14 LUFS-M; DREAD, buttons and card stings −16 |
| **Do** | One stab, then air. Tune it to the card's freeze-hit layer (F, D♭, B♭ or C). Land sample-accurate on the downbeat. **Rotate the kinds**: no out twice in a row, and no two act-outs sharing one. |
| **Don't** | Everything in §1.7's first row. Record scratches are Ep6's SFX entry device. |

### P09 · VICTORY LAP (triumph with irony)

| | |
|---|---|
| **Use** | The Return, draft night, the IPO bell, launches that "work", anything he wins |
| **Feel** | Straight or swung; 3/4 on the 96 beat for the grand version; double-time for stadiums |
| **Harmony** | Major keys away from F (A♭, D♭, E♭, B♭), each with **one wrong element**: the Ache, a final chord with no third, or a landlord mediant shift. **Never F major.** |
| **Instruments** | Strings tutti, horns, timpani, felt or grand piano, chip doubling the top line, **brass stabs**. **The full band is only at the episode's S3** (tone guide §9.3). |
| **Chip** | Doubles the top line |
| **Balance** | 20 · 40 · 20 · 20 |
| **Loudness** | Featured −16; the stab −14 LUFS-M |
| **Do** | Score the win straight and one size too big. Let one element undercut it: the rail, a GLYPH blink, a box of spare `0` plates. |
| **Don't** | Sports anthems, gospel, *Pomp and Circumstance*, *Rocky*, fist-pump rock, the key change up a step |

### P10 · ERA TIERS (flashbacks)

| | T1 · 1-BIT (1993) | T2 · EARLY-WEB16 (2005–14) |
|---|---|---|
| **Feel** | Straight (the machine doesn't swing yet) | Swung |
| **Sound** | `chip.beeper`: 1-bit at 22.254 kHz, **2 voices at most** (a line plus root blips), on or off with no dynamics, mono | **The band through the 16-bit sample-chip** (BRR, Gaussian interpolation, 144 ms echo), exactly like the main title's 2008–14 bar: felt piano, upright, brushes, a lo-fi trumpet stab, chip lead |
| **Harmony** | F minor; Fm9 arpeggios; the knee's cells (never whole) | Brighter A♭-major colours (the optimism of the early web), never F major |
| **Chip** | 100 % | about 90 % |
| **Loudness** | Underscore −22 (low-passed near 7 kHz under dialogue); featured −18 | −20 / −18 |
| **Tape** | none | none, or ≤ the `reel` preset (wow ≤ 3 cents) |

- **The tone guide's T2 colour, "cassette piano and boom-bap", follows the superseded v1.1 cue sheet.** SCRIPT v2.1 retired both from the title's 2008–14 bar, which the audience hears in every intro, so this bible keeps the flashback tier matching it (PROPOSED ruling, §8). A camcorder's own audio is diegetic and may use `era.Era('vhs')`.
- **The later tiers** (2015–21 memories with a POV rim) use the narrator's motif on the narrator's instrument. **Orb-era glossy memories** (post-2019) use glass and choir aahs, ppp.
- **Transitions:** the render front (the SFX `render_front_sweep`, F4 → F6) upgrades **the same chord** across 2 beats: 1-bit → 16-bit → BASE. A flashback enters on its trigger and exits on its consequence, with matching chords.
- **Don't:** chiptune covers, NES-overworld swing, modem sounds (SFX), or a Mas motif on (REPORTED) material. **Ep1 F1.2 is silent.**

### P11 · SET-PIECE SWING (chaos and scale)

| | |
|---|---|
| **Use** | The S2 and S3 set-pieces: the odometer, code red, the tile avalanche, the mammoth, GATESTAR, the sandbox |
| **Feel** | Swung, **in 4-bar phrases (10 s = one production chunk)**; double-time at peaks |
| **Harmony** | Driven by pedals, with chromatic mediants between phrases. Each phrase adds a layer or modulates. The peak is on C7(♯9♭13), then the stop. |
| **Instruments** | The tone guide: "V1's swung big band with a chip lead". **The engine** is walking bass, ride and sticks, piano comping and a chip lead (in octaves with the violins). **Brass hits** end each phrase. **The full band plays only at the S3**, at its peak (≤ 2 bars). |
| **Chip** | Lead |
| **Balance** | 15 · 35 · 25 · 25 |
| **Loudness** | Featured −16; the peak −14 LUFS-M |
| **Do** | One phrase per chunk. Hits on cut frames. Leave room for the phrase's one SFX hero sound. End on a stop or a card. |
| **Don't** | Braams, "epic" choir, taiko, dubstep, hybrid risers, the *Inception* horn |

### P12 · THE RED LINE (the Pentagon; war rooms; supply-chain risk)

| | |
|---|---|
| **Use** | Ep7 RED LINES, the ban, the `SUPPLY CHAIN RISK` stamp, Ep9's AI FORCE |
| **Feel** | A march that never becomes one (4/4, straight); 5-against-4 tick figures as colour |
| **Harmony** | Stark fourths and fifths. **The two red-line pedals (B♭ + F) held** against moving low-brass harmony. The rubber stamp's C (SFX, tuned). |
| **Instruments** | Field snare (rim or brushes; never a full cadence), timpani, low horns, tuba, col legno low strings, bass drum |
| **Chip** | Telemetry: a sparse, irregular 12.5 % line |
| **Balance** | 5 · 65 · 15 · 15 |
| **Loudness** | Underscore −20 |
| **Do** | Keep it about paperwork: the menace is bureaucratic. Nobody is the hero. |
| **Don't** | Anthems, Taps, Copland-style Americana, *Top Gun* guitar, weapons sound design |

### P13 · THE PODIUM (pomp; state occasions; the label gun; every administration)

| | |
|---|---|
| **Use** | RUMPT (the Podium and the Rename), **NEDIB (the Fountain Pen), with equal weight**, state dinners, the UN, signings |
| **Feel** | A march; a quick march in **6/8 with the dotted quarter on the 96 beat** (two 6/8 bars per picture bar); a state waltz in 3/4 at half-time |
| **Harmony** | RUMPT in E♭ major, with the Rename; FEAR in E♭ minor. NEDIB in B♭ major. |
| **Instruments** | RUMPT: **the engine** is snare, bass drum, tuba and grand march chords; **the accents** are trombones and trumpets (≤ 2 bars), a chip piccolo and glock. NEDIB: a string quartet with harp. |
| **Chip** | The gold glint (RUMPT). A single triangle (NEDIB). |
| **Balance** | RUMPT 20 · 30 · 35 · 15 (the highest band share, still in accent statements); NEDIB 10 · 80 · 0 · 10 |
| **Loudness** | Featured −16 for both administrations |
| **Do** | **Stop for real words**, and resume after them. Land the Rename on the label gun. Score both parties' ceremonies the same size. |
| **Don't** | *Hail to the Chief*, Sousa, anthems, campaign songs, rally rock, clown orchestration, trombone blats |

### P14 · BLUEPRINT (THE PLAN)

| | |
|---|---|
| **Use** | THE PLAN in every episode: 18 / 12 / 8 bars (45 / 30 / 20 s), beats 3·7·5·3, 2·5·3·2 or 1·3·3·1 |
| **Feel** | Straight 4/4. **The chip music-box waltz in 3/4 on the 96 beat**: 45-frame bars, **4 waltz bars = 3 picture bars**. |
| **Harmony** | Quartal on F dorian, bright and precise. **The break is a tape-stop into the next cue** (tone guide §9.3). |
| **Instruments** | A chip music-box lead, pizzicato, harp, celesta, clarinet or flute staccato, pencil ticks, a triangle bass. **No piano, no brass.** |
| **Chip** | Lead |
| **Balance** | 0 · 50 · 0 · 50 |
| **Loudness** | Featured −16; −20 under the blueprint's lines |
| **Do** | One note per label; the plan's steps are the line's steps; the break is a stuck loop, then the tape-stop |
| **Don't** | Explainer cheer, *Jeopardy*, circus or calliope for the party-game waltz, "educational" marimba |

---

## 4. Season 1 track list

There are 36 cues, plus the locked main title. **`MM-##`** is the album and library number. **First use** gives the episode, the scene and the script clock. **Mode** is **P** (to picture), **L** (a library suite: 4-bar phrases at 2–3 intensities, each with a clean ending, plus loops and cue points) or **P+L**. **B1** marks the first batch (§5), and **B2** the proposed second.

The tone guide sizes the season at about 45–60 cues once variants and per-episode room colours are counted, which makes an album of about 20 tracks. These 36 are the **tracks**. Their variants and each episode's to-picture edits are cues under them.

| MM | Title | Palette | Motifs | Length | First use | Mode | Batch |
|---|---|---|---|---|---|---|---|
| MT | The Knee (Main Title), V1 LOCKED (V4 is the quiet-episode alternate) | — | knee | 30 s | every intro | locked | — |
| 01 | **Water Line** (Mas's theme) | DARK ROOM | Mas, Orb | 75 s + loop | Ep1 sc 18, dark room, 10:13 | L | B1 · E |
| 02 | **His Version** (the keynote reel) | KEYNOTE REEL | Mas in D♭ major | a 1-bar insert + 40 s | Ep1 sc 29, 16:31 | P+L | B1 · E |
| 03 | The Regulate-Me Tour | THE RUN | Build, a knee stab on items | 75 s + loop | Ep1 sc 16 poster run, 9:13 | P+L | B2 |
| 04 | Lighthouse (Misanthropic) | PROCEDURE / room | the Addendum (quartet) + the Lighthouse | 80 s | Ep1 sc 11 split duel, 4:43 | L | B2 |
| 05 | **The More You Buy** (Nesnej) | THE JOB | Upsell | 70 s + loop | Ep1 sc 17 rooftop, 9:33, clear of the statement | L | B1 · B |
| 06 | **Beeper, 1993 / Sample-Chip, 2008** | ERA TIERS | the knee's cells, the 1-bit Upsell, young Mas, the Build | 85 s + loops | Ep1 sc 3–4 F1.1, 0:30 | L | B1 · C |
| 07 | **How to Fire a CEO Who Owns Nothing.** (THE PLAN) | BLUEPRINT (+ a DARK ROOM pickup) | Blueprint, the knee-cell waltz, Step Four | 50 s + 30 s + 20 s | Ep1 sc 24–25, 12:31 | P+L | B1 · A |
| 08 | **The Falling Tile** | LEVERAGE → D6 → DARK ROOM | Step Four (the click is the blank), the 1-bit flat line, Mas, the Rewind | 73 s span | Ep1 sc 26–26A, 13:21 | P | B1 · B |
| 09 | **The Board's Side** (+ 09x **What They Didn't Know**, REVERSAL) | PROCEDURE · OUTS | Step Four, the Door, the Addendum and Lighthouse, Neleh, Mada, the hourglass, the floor | 111 s + 3 s | Ep1 sc 27–28, 14:34 | P (in sections) | B1 · C |
| 10 | **His Side / 745** | DARK ROOM → SET-PIECE SWING | Mas, the Build (chip lead), Step Four crushed | 92 s | Ep1 sc 29, 16:28 | P | B1 · D |
| 11 | **The Return** | STRAIGHT → the floor → VICTORY LAP | the Door (violin), Tasya's Rhodes, the Build, the flat line | 77 s | Ep1 sc 30, 18:00 | P | B1 · E |
| 12 | december (tag and button) | DARK ROOM + GLYPH (Q\*) + OUTS | Mas, the Orb (late), Q\*, the no-third button | 74 s | Ep1 sc 31–33, 19:17 | P | B2 |
| 13 | **Outside Intended Scope** (the GLYPH ladder + THE COPY kit) | GLYPH | Tokens (4 stages), the Ache, hooks, Q\*, THE COPY at 4 lags | 85 s + kit | Ep1 GLYPH hits (the Orb's scan, Q\*); sc 19 hands runner (THE COPY) | L | B1 · D |
| 14 | Outs Kit | OUTS KIT | THREAT, REVERSAL, DREAD, stops, diegetic outs, pre-laps, card stings, the kink, Freeze F4, the no-third buttons | kit (~24) | Ep1 sc 2, 12, 17, 23 | L | B2 |
| 15 | End Credits: The Knee (reprise, in each episode's colour) | THE KNEE | knee (whole: outside the story) | 43 s × 12 colours + 60 s album | Ep1 credits, 20:31 | P, every episode | B2 |
| 16 | Odometer (the set-piece swing kit) | SET-PIECE SWING | Build lead, 4-bar phrases, 3 intensities | 80 s kit | Ep1 sc 6 odometer drill, 2:08; sc 8 code red | P+L | B2 |
| 17 | Exclamation Points (Nole), with "High Noon" | THE JOB / OUTS / THE CLOCK | Launch | 75 s suite | Ep1 sc 6 (the lamp) → Ep2 lawsuit; Ep4 high noon | L | B2 |
| 18 | Where's Alyi? (the Door and the GPU choir) | DARK ROOM / PROCEDURE | Alyi | 75 s | Ep1 sc 27 (the reflection) → Ep2 | L | B2 |
| 19 | **Renamed It. / The Fountain Pen** | THE PODIUM | the Podium, the Rename; NEDIB's Fountain Pen | 90 s suite | Ep1 sc 13 White House (NEDIB), 5:54; RUMPT's FEAR in Ep2 | L + stings | B1 · A |
| 20 | Under Oath (Procedure: the court) | PROCEDURE (court) | the "yes." buffer, a muted Launch | 90 s bed + outs | Ep1 sc 15 Senate hearing, 7:20 → Ep8 | L | B2 |
| 21 | Room Colours, Ep2, + media beds | ROOM COLOURS | the séance organ (no liturgy), a garden-party quartet (never a wedding march); an original podcast intro, a news-desk sting, a keynote walk-on | kit | Ep2 | P+L | — |
| 22 | HOW MANY R'S? (the halftime show) | ROOM COLOURS / SET-PIECE SWING | Blueprint and Build (replaces "the knee fight song") | 75 s | Ep3, the reasoning-model halftime | P | — |
| 23 | SHIPMAS | THE RUN | the Build in 12 layers, chip bells on new layers (no *Jingle Bells* or *Sleigh Ride*) | 75 s | Ep3 SHIPMAS | P+L | — |
| 24 | Gatestar Dials Out | SET-PIECE SWING | Upsell; seven escalating hits, the 7th jams (no franchise chevron sounds) | 60 s | Ep4 | P | — |
| 25 | Superintelligence Draft Night | VICTORY LAP / ROOM COLOURS | each founder's motif as a pick; an original draft-night organ (no "Charge!") | 90 s | Ep5 | P | — |
| 26 | The Money-Go-Round | THE RUN / THE JOB | Upsell (the endless lap) | 80 s loop | Ep6 THE PLAN and set-piece | P+L | — |
| 27 | Exceeds Expectations (the Intern) | GLYPH / THE RUN | Intern | 60 s | Ep6 RESERVED desk → Ep9 | L | B2 |
| 28 | Red Lines | THE RED LINE | Mario's two held lines; RUMPT's decree snare | 90 s | Ep7 | P+L | B2 |
| 29 | The Hug (bullet time) | DARK ROOM (half-time) | Mas × the Addendum; no verdict | 60 s | Ep7 | P | — |
| 30 | Statute of Limitations, with the Rashomon Renders | PROCEDURE (court) + ERA renders | the calendar; Nole's render, Mas's (the keynote reel, uncut), Gerg's (ASCII, 1-bit) | 90 s + 3 × 20 s | Ep8 | P | — |
| 31 | Welcome to /tmp | GLYPH × THE JOB | Tokens (the runaway) × noir | 90 s | Ep9 sandbox breakout | P | — |
| 32 | No-Limit (the Pace Accord) | THE JOB (a casino-lounge room colour) | every motif as a tell; the Intern deals; Mario's pedometer | 100 s | Ep10 | P | — |
| 33 | The Politeness Loop | THE CLOCK / GLYPH | the Addendum × the Intern ("after you") | 75 s | Ep11 | P | — |
| 34 | The Last Human Heist | THE JOB / SET-PIECE SWING | the attention lasers; Mas untouched | 110 s | Ep11 | P | — |
| 35 | The Last Supper at the Woodrose | PROCEDURE / GLYPH | **the model completes every motif** | 120 s | Ep12 | P | — |
| 36 | define "win." | ERA 1-bit → DARK ROOM | the knee (PROPOSED whole), Mas, the machine; `ours.` (A♮, PROPOSED) | 70 s | Ep12, 1993 part 4 + button | P | — |

**Palette coverage:**

| Palette | Cues |
|---|---|
| DARK ROOM | 01, 02, 12, 18, 29 |
| PROCEDURE | 04, 09, 20, 30, 35 |
| LEVERAGE | 08 (also Ep1 sc 9 and sc 30, from the MM-08 stems) |
| THE CLOCK | 17, 33 (and Ep1's countdown outs via MM-14) |
| GLYPH | 12, 13, 27, 31, 35 |
| THE JOB | 05, 17, 26, 31, 32, 34 |
| THE RUN | 03, 23, 26, 27 |
| OUTS KIT | 09x, 14 |
| VICTORY LAP | 11, 25 |
| ERA TIERS | 06, 30, 36 |
| SET-PIECE SWING | 10, 16, 22, 24, 34 |
| THE RED LINE | 28 |
| THE PODIUM | 19, 25 |
| BLUEPRINT | 07, and a PLAN variant in every episode |

### 4.1 Ep1 Act Four at a glance (the spotting)

> **Superseded (2026-09-26) by [edit-plan-v4](../../show/episodes/ep01/production/act4/edit-plan-v4.md).** This table and its handoffs spot Act Four draft 3.x cue by cue, stopping for real lines and cards. That is the spotting the v3 animatic played, and the showrunner found it jagged. The v4 plan (its §5) spots the act as one continuous performance per sequence, re-rendered to v4's lengths, thinning and ducking under words, with four deliberate stops (Cancel, Gerg's glance, Mada's label, "Terms?") and the Cancel drop-out as the act's only digital silence. The cue numbers, palettes and motifs here still name the tracks; follow the v4 plan for where they play and how they join. The first-batch briefs in §5.A1–§5.E1 carry the same draft-3.x spotting, so the v4 plan governs them too. Kept for history.

This follows tone guide §9.6's sample, with two rulings noted. Clocks are the script's printed clock. **Conform to the slate animatic**: every cue is built in sections that slip by whole bars.

| Clock | Sc | Script call | Cue | Who | Music |
|---|---|---|---|---|---|
| 12:31–12:36 | 24 the suite | `DARK ROOM · in: cut · out: cut` | MM-07 `E01-S24` (2 bars) | A | Felt: the Water Line's bar 1. **The settle never comes**, because the blueprint cuts it. It follows the sc 23 out's pre-lap of the crane truck and glassware (SFX). |
| 12:36–13:21 | 25 THE PLAN | `BLUEPRINT · out: tape-stop into the JOIN click` | MM-07 `E01-S25` | A | The Blueprint → **the chip waltz, 4 waltz bars over picture bars 4–6** → **it stops at bar 7** (the knee's last F never comes) → Step Four → the break → **a tape-stop ending on the JOIN click** |
| 13:21–13:38.5 | 26, phrases 1–2 | `LEVERAGE (low) · out: drop-out` | MM-08 `E01-S26` | B | LEVERAGE; the 1-bit flat line on the dialog; the arrow steps to Step Four; **a hard stop on the click (D6)** |
| 13:38.5–14:14 | 26, phrases 3–5 | `none` | — | — | **Silence:** D6 (the tile dissolve included), the room returning with the phone, "super." (no music under), 1 bar clear around the candor card, **F1.2 silent (C39)** |
| 14:14–14:34 | 26A | `DARK ROOM (solo piano)` | MM-08 `E01-S26A` | B | A single felt under 2 V.O. lines; **dry for his real post**; **the Rewind** into sc 27's downbeat |
| 14:34–16:25 | 27 pass one | `PROCEDURE (the board's colours)` | MM-09 `E01-S27a–h` | C | **No piano, chip or swing.** Neleh's clockwork pizzicato; the Door in the glass; Mario's quartet and the Lighthouse; Tasya's floor, one step; dry under every real line |
| 16:25–16:28 | 28 card | `OUTS: REVERSAL` | MM-09x `E01-S28` | C | REVERSAL (C → F up the octave, bright); **a felt F4** on the extra beat |
| 16:28–17:20 | 29 his side | `DARK ROOM` / `KEYNOTE REEL · 1 bar · out: stop mid-phrase` / `none` | MM-10 `E01-S29a` + MM-02 `E01-S29-D5` | D + E | Mostly silent. Felt under V.O.; the D5 bar (E's); Build cells at the counter and on Gerg's tile; **the Build stops when Gerg looks up**; no music in the quiet beat, the D8 line or "Everyone is welcome." |
| 17:20–18:00 | 29 avalanche | `SET-PIECE SWING · out: stop on the card` | MM-10 `E01-S29b` | D | The Build as a swung chip lead; the Water Line augmented; Step Four crushed; **the episode's one full band at the S3 peak**; **a dead stop on the MADA card** |
| 18:00–19:17 | 30 the return | `STRAIGHT` → `the floor` → `none` → `VICTORY LAP` | MM-11 `E01-S30a–e` | E | The violin under the post only, stopped dead on the first heart; **Tasya's Rhodes floor after her line**; the calm-off in silence; the Build restarts after Gerg's post; a brass stab on the sign; the flat line → the bonk (SFX) → "okay." → the felt cadence |
| 19:17–19:44 | 31 Q\* / the memo | `GLYPH (diegetic into score) · none (the memo)` | MM-12 (B2), using the MM-13 Q\* hook | — | The vault's F hum (SFX) becomes the root. The memo is a real line, so it plays dry. |
| 19:44–20:31 | 32–33 tag | `DARK ROOM` → `OUTS: the button chord` | MM-12 (B2) | — | The dark room; the Orb's late verdict; the Q\* insert; **the chord with no third on the downbeat** |
| 20:31–21:14 | credits | `THE KNEE (reprise, Ep1 colour)` | MM-15 (B2) | — | The legal card; a window for the moth stinger (≤ 5 s) |

**The two rulings:**
1. **Sc 24 is DARK ROOM**, as in the tone guide's sample. The first draft of this bible had silence there.
2. **F1.2 stays silent.** The script's table-read ruling C39 says so; the tone guide's sample lists "the cassette tier". The Ep1 writer to confirm.

**Handoffs** (all at 96 in F minor unless noted):

| From → to | Handoff |
|---|---|
| A → B, 13:21 | A's tape-stop lands on the JOIN click, and B enters on the grid's connect |
| B → C, 14:34 | B's Rewind lands on sc 27's downbeat; C's first chord is B♭m(add9) |
| C → D, 16:28 | C's felt F4 rings into D's first bar at −24 LUFS-S |
| D → E, 18:00 | D stops dead on the MADA card; E's violin enters after the card's bar, in D♭ |
| D ↔ E, 16:31 | E renders the D5 bar; D leaves it empty |

### 4.2 Ep1's other music notes, and the act-out outs

The tone guide's outs ([§9.5](../../show/bible/tone-and-dialogue.md#95-act-out-outs-proposed)) no longer wait on the pacing owner: [pacing-model §3.3](../../show/format/pacing-model.md#33-slot-rules) now treats the act-out sting as a guide. Where a script hasn't chosen, **THREAT, REVERSAL and DREAD stay the default, varied** so the same one doesn't come twice in a row. The labels below follow the no-spoiler pass, which replaced Ep1's countdown with the invite and its hint thread.

| Script | Cue |
|---|---|
| sc 2: "one dry piano F4" (the freeze) and the invite's first glimpse | MM-14 "Freeze F4" (a dry felt). The music owns it. If the SFX editor has cut `piano_fired_F4`, keep it and log it as music. Under the invite, **THE CLOCK's first step** with a low THREAT colour, which teaches the device (tone guide R16 and §9.5; the first glimpse moved here from sc 12). |
| sc 3–4: 1993 | MM-06, movement I |
| sc 6: "each digit is its own chip note on F" | **SFX** (`odometer_ratchet`). MM-16 stays out of F5–F6 while it plays. |
| sc 12 (the op-ed's thud; Alyi's reflection): "sting, on the downbeat" | MM-14 **THREAT** |
| sc 17, phrase 4 (the rooftop act-out): "the score drops out, leaving only the register's bell" | MM-05 → a designed rest → the SFX `ka_ching` decaying, with the rooftop's room tone under it. **No sting.** If the Ep1 writer keeps the script's sting instead: DREAD. |
| sc 23 (the invite's reminder; `NOV 16` → `NOV 17`) | **THE CLOCK's last step stops on the downbeat**; black; a pre-lap of the crane truck. If the Ep1 writer keeps the script's sting instead: THREAT is spent at sc 12, so REVERSAL. |
| sc 28 | **REVERSAL** (MM-09x) |
| sc 33: "the chord with no third, on the downbeat" | MM-12's button |

### 4.3 Handoffs for the Ep3 script (it leans on the knee)

These need the Ep3 owner's sign-off.

| Ep3 script says | Use instead |
|---|---|
| "a lone chip voice picks out F F F F, flat, on the beat" | Keep it, but **vary the register and duty on every note** (X3) |
| "a swung chip-and-brass fight song on the knee motif" | MM-22: a Blueprint and Build fight song. The knee is never whole in an episode. |
| "the knee motif on the brushes; timpani on each arrival" | The Build at half-time on brushes, with timpani on arrivals |
| "the knee motif on a road-trip acoustic guitar" + "a sighing violin" | The Addendum on guitar; the paper tear cuts the tail. **Cut the sighing violin** (a stock sting; tone review item 11). |
| "a big-band sleigh swing on the knee motif, chip bells on every F" | MM-23 SHIPMAS on the Build. Chip bells on *new layers*. The full band only if SHIPMAS is the S3. |
| "the knee's leap, G A♭ C, left hanging with no F" and the no-third stings | These fit: the MM-14 kink and the big no-third |

---

## 5. The first batch: 10 tracks, 5 composers

**Why these ten.** Ep1 Act Four is in production, and THE FALLING TILE and 26A are in the W0 calibration ([pov §9.3](../../show/bible/pov-and-framing.md#93-build-it-now-time-sensitive)). So the batch scores Act Four from the suite to the Return, and adds five library suites that open every later episode's palettes. **It covers 11 of the 14 palettes**, plus the KEYNOTE REEL and STRAIGHT modes and THE COPY. THE CLOCK, THE RUN and THE RED LINE lead batch 2.

**The pairs.** Each composer gets **one Act Four cue to picture and one library suite**, in contrasting palettes.

| Composer | To picture | Library | The contrast |
|---|---|---|---|
| **A** | MM-07 THE PLAN (+ the sc 24 pickup) · BLUEPRINT | MM-19 Renamed It. / The Fountain Pen · THE PODIUM | Chamber precision against band pomp and a quartet: the world performing |
| **B** | MM-08 The Falling Tile · LEVERAGE → D6 → DARK ROOM | MM-05 The More You Buy · THE JOB | Pressure and silence against a walking groove |
| **C** | MM-09 The Board's Side + 09x · PROCEDURE, OUTS | MM-06 Era Tiers · ERA TIERS | The orchestra with no chip against chip with no orchestra |
| **D** | MM-10 His Side / 745 · DARK ROOM → SET-PIECE SWING | MM-13 Outside Intended Scope + THE COPY kit · GLYPH | Spectacle against dread |
| **E** | MM-11 The Return · STRAIGHT → VICTORY LAP | MM-01 Water Line + MM-02 His Version · DARK ROOM, KEYNOTE REEL | Big irony against the intimate theme and his lie |

**For everyone:**
- **Write in `audio/ost/tracks/<id>/`**, copied from `tracks/_template/`. The track id is lowercase: `mm07-how-to-fire-a-ceo`, or `e01-s25-the-plan` for a to-picture cut (§6.3).
- **Import `engine/`, and never edit it or `audio/theme/**`.** Ask the engine owner for changes.
- **Grid:** always `Grid(bpm=96, …)`. **Don't use `frame_lock_bpm` to move the tempo** (the template's 88 BPM example is not policy); 96 is already frame-exact.
- **Use §2's motifs note for note**, and fill in `META` (tone, usage, scenes, motifs, key, composer, audition).
- **Every bar number is counted against the script's clock.** Build sections that can slip by whole bars, and mark every cue point with `a.mark`.
- **The record plays dry**: check every real line, post and card in your span. The cue thins and ducks there (§0 rule 10); it doesn't stop.
- **Act Four's spotting is now the [v4 edit plan](../../show/episodes/ep01/production/act4/edit-plan-v4.md)** (§4.1 note): the briefs below keep their motifs, palettes and roles, but each sequence plays as one continuous performance re-rendered to v4's lengths, and the only stops are the plan's four.

### 5.A1 · MM-07 "How to Fire a CEO Who Owns Nothing." · `E01-S24` + `E01-S25`, and the PLAN library

| | |
|---|---|
| **Picture** | 12:31–13:21: 2 bars of sc 24 (bars P1–P2), then 18 bars of sc 25 (WORD 3 · DIAGRAM 7 · PLAN 5 · BREAK 3; bars 1–18). Bar 1 is the blueprint's first frame. |
| **Grid** | 96, straight. **Bars 4–6 carry the chip waltz in 3/4 on the 96 beat:** 45-frame waltz bars, **4 waltz bars in 3 picture bars**, and the 4/4 resumes on bar 7. |
| **Key** | Sc 24 is F minor (felt). THE PLAN is F dorian and quartal (diatonic 4ths below, never an A♮). The waltz is Fm – D♭maj7 – C7sus, **unresolved**. |
| **Motifs** | The Water Line (sc 24); the Blueprint (§2.15); **the waltz on the knee's cells, never whole**; Step Four's first statement. No Mas motif in THE PLAN, and no V.O. |
| **Length** | 50 s to picture. Plus **PLAN-SHORT** (12 bars, 2·5·3·2, 30 s) and **PLAN-MICRO** (8 bars, 1·3·3·1, 20 s): generic Blueprint versions for Eps 2–12, with no waltz. 100 s in all. |

**Form (to picture):**

| Bars | Section | Music |
|---|---|---|
| P1–P2 | Sc 24, the suite | The felt Water Line bar 1: F4 F4 F4 G–F, swung. On P2.1 the C4, and then **the blueprint cuts it**: the settle never comes. **Leave the crane truck and the glassware room** (SFX), so nothing below C3. |
| 1–3 | **WORD** | The stamp is SFX (`rubber_stamp_C`, tuned to C) on b1.1, and the score enters on b1.2. The Blueprint line F4 G4 A♭4 B♭4 \| C5, answered B♭4 A♭4 G4 \| F4, over pizzicato, celesta and a quartal pad (sul tasto). |
| 4–6 | **WALTZ** (3/4 on the 96 beat) | **Waltz bar 1** (b4.1, +0 fr): `F5 q F5 q F5 q`. DIRE stands.<br>**Waltz bar 2** (+45 fr): `F5 q G5 q A♭5 q`. NOVIHS stands.<br>**Waltz bar 3** (+90 fr): `C6 h.`. DRUH stands.<br>**Waltz bar 4** (+135 fr): **the accompaniment alone** (a triangle bass on 1, 50 % chip chords on 2–3). **The knee's last F never comes**: the empty chair.<br>A music box, small and sweet, never a circus. |
| 7 | **The stop** | **The waltz stops dead on b7.1** (+180 fr), with no tail, as `LEFT EARLIER IN 2023` stamps: musical chairs. The 4/4 Blueprint resumes on b7.2. |
| 8 | **THESE FOUR VOTE** | **Step Four in quarters** (low clarinet and pizzicato): B♭m – A♭ – G♭maj7 – *[beat 4: the F bass alone]*. The blank is planted. |
| 9–10 | The boxes, `CONTROLS`, the banner, the key ring `VOTES: 0`, the CEO box `EQUITY: 0`, the moth | One Blueprint note per label, in the animatic's order (list the labels in META `scenes`). The moth gets one celesta flutter, pp. |
| 11–13 | **PLAN** | The figures walk on (b11.1). The steps are ticked in stride: `1 ✓` b12.1, `2 ✓` b12.3, `3 ✓` b13.1 (the Blueprint's F – G – A♭, each with a pencil tick). **The line stops at step 4** (b13.3). |
| 14–15 | "Step four." / "Good question." | One held quartal chord, pp. No movement and no swell under either line. |
| 16 | **BREAK**: the chalk | The chalk stroke is SFX. The line's last 2 beats loop as the corner curls. |
| 17–18 | The tear → [ECU] JOIN | A **tape-stop** (`era.tape_stop`) that starts on the tear and **reaches zero exactly on the JOIN click frame** in bar 18. Deliver it with the stop's start on each beat of bar 17. |

| | |
|---|---|
| **Stems** | strings, winds, perc, chip, bass; piano (sc 24 only). No brass. |
| **Loops** | PLAN-SHORT's DIAGRAM loops seamlessly (for long diagrams) |
| **Cue points** | P2.1 cut · b1.2 · the waltz bars (+0, +45, +90, +135 fr) · **b7.1 stop** · b8.1–b8.4 · b11.1 · b12.1, b12.3, b13.1 · b13.3 · b16.1 · the tape-stop start and **the JOIN click** |
| **Levels** | Featured −16 (bars 1–13); −20 in bars 14–15; sc 24 −22. Balance for THE PLAN: 0 · 50 · 0 · 50. |
| **Audition** | Does the waltz's stop land as the joke without being cute? Does the missing F in waltz bar 4 read as the empty chair? Does the tape-stop feel like the plan failing, rather than a playback fault? |

### 5.A2 · MM-19 "Renamed It. / The Fountain Pen" · library suite (THE PODIUM)

| | |
|---|---|
| **Use** | RUMPT's phases (Eps 2–12) and **NEDIB's Fountain Pen** (Ep1 sc 13 onward), at **equal weight** |
| **Grid** | 96. A march; FEAR in half-time; NEDIB straight and legato. |
| **Key** | RUMPT in E♭ major (FEAR in E♭ minor); NEDIB in B♭ major |
| **Motifs** | The Podium and the Rename (§2.10); the Fountain Pen (§2.11) |
| **Length** | 36 bars = 90 s |

**Form:**

| Bars | Movement | Music |
|---|---|---|
| 1–8 | **THE FOUNTAIN PEN** (NEDIB) | A string quartet with harp. The motif at b1 and b5, featured at the same level as LOVE. A **2-bar word window at b3–4** (pp sustain only). Loopable. |
| 9–10 | **The marker voids the map** | The Fountain Pen **cut mid-turn** on b9.2 by a single dry snare hit and a tuba note (RUMPT's marker). |
| 11–18 | **FEAR** | **Muted brass**: cup-muted trombones and muted horns, pp, E♭ minor, tremolo low strings, a timpani roll into b15. A word window at b13–14. |
| 19–26 | **LOVE** | The full march. The fanfare at b19 and b23 (≤ 2 bars each). The chip piccolo an octave up, glock on the held E♭5. A word window at b21–22 (the snare stops and the tuba holds). Loopable. |
| 27–28 | **THE RENAME** | The held E♭5; over 2 beats the chord slips E♭ → **B/D♯**, with the bass and top held. The label-gun cue point is b27.3. |
| 29–32 | **WHO?** | The fanfare twice. **A missing beat**: the last note never arrives (a rest at b30.1). At b32 only the pickup plays. |
| 33–36 | **SUPER** | The Rename twice, E♭ → B → G, with the chip taking the top line. A 1-beat button stop at the end. |

| | |
|---|---|
| **Stems** | strings, drums, bass (tuba), piano (grand), brass, chip, perc |
| **Loops** | 1–8 and 19–26, seamless |
| **Endings** | A 1-beat stop after every movement |
| **Cue points** | The movement heads, word windows, b9.2, the Renames (b27.3, b33.3, b35.3) and the WHO? rests |
| **Levels** | Featured −16 (the Fountain Pen and LOVE match within 0.5 LU); word windows ≤ −28. Balance for RUMPT: 20 · 30 · 35 · 15; for NEDIB: 10 · 80 · 0 · 10. |
| **Audition** | Is the Rename funny-deadpan, or too cute? **Do the Fountain Pen and LOVE feel equally grand (parity)?** Is FEAR hushed without being horror-movie? |

### 5.B1 · MM-08 "The Falling Tile" · `E01-S26` + `E01-S26A`

| | |
|---|---|
| **Picture** | 13:21–14:34, 29 bars: sc 26 is bars 1–21 (4·4·4·4·card 2·3), 26A is bars 22–29 |
| **Grid** | 96. Straight eighths locked to the LEDs (LEVERAGE) in bars 1–8; the felt swings in 26A. |
| **Key** | A low pedal on F with semitone-shifting clusters. Step Four over the F pedal. 26A in Fm(add9) with no third, then open fifths. |
| **Motifs** | LEVERAGE; **the 1-bit flat line** (b5); **Step Four** (b7), where the click is the blank; the Water Line; the Rewind |
| **Length** | A 73 s span, about 40 s of music |

**Form:**

| Bars | Picture | Music |
|---|---|---|
| 1 | The grid connects | **LEVERAGE (low):** pizzicato and the muted-808 thud on straight eighths, low grand clusters (F2 G♭2 C3), no melody. A soft chip tick that **drops 3 of every 4 eighths**: the hotel Wi-Fi's one bar of four, an egg for freeze-framers. |
| 2 | The NELEH card | The freeze hit is SFX; the score dips 1 beat. **Neleh's clockwork pizzicato** rides the card's bar. |
| 3 | [PF] He reads the icons (HOLD 1 BEAT) | The clusters hold. One felt F4 at most (his calm), or nothing. **No melody.** |
| 4 | Alyi's mouth moves; no sound | Everything but the eighths drops |
| 5 | The 1993-style dialog | **The 1-bit beeper, F F F** (F4 F5 F4, uneven) |
| 6 | The eyes strip | The cluster shifts up a semitone; violins trem sul pont, ppp. **Mada's spinner** loop under his tile. |
| 7 | The arrow steps in, tile by tile | **Step Four in quarters:** muted horns and bassoon, F4/B♭m – E♭4/A♭ – D♭4/G♭maj7 on beats 1–3, holding through beat 4. **The intensity stays level: no riser.** |
| 8.1 | **The click** | **Drop out on the turn: a hard stop on the click's frame.** Every stem goes to digital zero within 3 ms, tails included (render the reverbs and gate them). This is D6, and the blank step four. |
| 8–21 | Phrases 3–5 | **No score** (§4.1) |
| 22–23 | 26A: carving mark 3, then "i don't keep score." on the second bar | A single felt: an open fifth F3 + C4 on b22.1 (above the SFX drone), then one sustained note under the V.O. The Orb's servo counts (SFX); **the score does not count.** |
| 24–25 | His real post (typed; the post UI stamps `9:32 PM PT`) | **Dry: no music under the post** |
| 26 | The wallet and the moth | One felt note (the Water Line's C4) |
| 27–28 | [PF] "the meeting ended early." | One sustained felt note |
| 28.3–29 | [P] The Orb and `rewinding…` | **THE REWIND**: 2 beats of the felt, retrograded through the 16-bit sample-chip, dropping a semitone per beat, landing on **14:34.0 = sc 27's downbeat** |

| | |
|---|---|
| **Stems** | strings, drums (the muted-808 thud), brass (horns, b7), winds (bassoon), piano (grand clusters, felt), chip, perc (harp). No sub in 26A. |
| **Loops** | Bars 1–4 as an alternate loopable "call connecting" bed, for conform extensions and for LEVERAGE reuse (sc 9, sc 30) |
| **Cue points** | b1.1 · b2.1 · b5.1 · b7.1, b7.2, b7.3 · **b8.1 HARD STOP (sample-accurate)** · b22.1 · the V.O. windows at b23 and b27–28 · the dry post at b24–25 · b28.3 · b30.1 |
| **Levels** | Bars 1–7: −22, rising to −20 by b7. 26A: −22 to −24. **Peak < −90 dBFS from b8.1 to b22.1.** Balance: 30 · 50 · 0 · 20. |
| **Don't** | A heartbeat rhythm, steady beeps, a riser into the click, reverse swells (SFX), music under "super." or near the candor card or under his post |
| **Audition** | Does the stop land as a blow, not a glitch? Does LEVERAGE feel like a trap closing, without a tune? Does the Rewind read as the Orb rewinding, not as a tape effect? |

### 5.B2 · MM-05 "The More You Buy" (Nesnej) · library suite (THE JOB)

| | |
|---|---|
| **Use** | Nesnej and INVIDIA, deals, Ep1 sc 17's lead-in to the register's bell (clear of the statement's quote box) |
| **Grid** | 96, **double-time swing feel**: the bass walks eighths, the ride plays in double time, and the hits sit on 96's beats |
| **Key** | F dorian / F minor blues, with C7♯9. The close lands on an F–C open fifth (the KA-CHING is F6 + C7, the root, as the downbeat). |
| **Motifs** | The Upsell (§2.12) |
| **Length** | 28 bars = 70 s |

**Form:**

| Bars | Section | Music |
|---|---|---|
| 1–2 | Intro | The walking bass, brushes, the chip GPU-clock arpeggios (12.5 %, pp) |
| 3–8 | **A** | The Upsell: four cells a step higher each (vibes + mute trumpet), then **the close** (a bari + trombone stab on F4, b7.3), then **KA-CHING slot 1 on b8.1** (a 1-beat rest in every stem), then a bass walk-up |
| 9–14 | **B** | A vibes solo over F dorian ↔ C7♯9; the chip arpeggios rise; sticks from b9 |
| 15–20 | **B′** | The mute trumpet trades 1-bar phrases with the chip |
| 21–26 | **A′** | The Upsell climbs further (up to E♭5) → the close → **slot 2 on b26.1** |
| 27–28 | Tag: "sweats" | The close stalls on C7. **Slot 3 lands late, on b28.3.** |

| | |
|---|---|
| **Stems** | bass, drums, perc (vibes), brass (mute trumpet, bari, trombone), chip, piano (grand) |
| **Loops** | Bars 3–26, seamless (A′'s last bar walks back into A) |
| **Variants** | Via the stems: **limbo** (B with the cells inverted downward, for Ep2); trio; full |
| **Cue points** | The slots (frames and samples). **The SFX file starts at the slot**, and its bell lands about 1 frame later. Also the section heads. |
| **Levels** | Underscore −20 (**it thins and ducks under his real lines**; "the more you buy…" is a real line); featured −16. Balance: 25 · 15 · 25 · 35. |
| **Don't** | Lounge bossa, *Pink Panther*, cash-register samples (the SFX own them), *Money* nods, rock guitar, culturally coded colour |
| **Audition** | Does the slot feel like the sale closing, or like a mistake? Does double-time swing on the 96 grid sit, rather than lurch? |

### 5.C1 · MM-09 "The Board's Side" + MM-09x "What They Didn't Know" · `E01-S27a–h`, `E01-S28`

| | |
|---|---|
| **Picture** | 14:34–16:25, about 44 bars in 8 sections, and the card at 16:25–16:28 (1 bar + 1 beat) |
| **The exit rule** | **PROCEDURE: no piano, no chip, no swing.** The orchestra straight. Mas only as record ("super." through their speaker: no music under). **Dry under every real line.** |
| **Grid / key** | 96, straight. Centred on B♭ minor; D♭ lydian for Alyi; B♭m for Mario. |
| **Motifs** | Step Four; the Door (in the reflections, through the glass); the Addendum (quartet) and the Lighthouse; the colours: Neleh's clockwork pizzicato and question, Mada's spinner, the hourglass, Tasya's floor (1 step) |
| **Length** | 111 s + 3 s |

**Sections.** The bar spans are estimated from the script's clock. Deliver each section as its own track (`e01-s27a` to `e01-s27h`) with a 1-bar overlapping tail, plus a stitched version.

| Sec | Bars (≈) | Picture | Music |
|---|---|---|---|
| a · NOON | 1–12 | The grid goes on; "super." (speaker); the toasts; Gerg's post "…I quit." [V] and the keycaps (SFX); RIMA's spotlight + card; the Neleh/Rima volley; "Is this a coup?"; Alyi's [V]; he steps out | A B♭ pedal and a spiccato pulse: the procedure goes on. **Step Four at "the call goes on"** (half notes). **Neleh's clockwork pizzicato** on her lines. The Door, low-passed, at the doorway. **Out** for "super.", for Gerg's post and for Alyi's real line. |
| b · NOV 18 hearts | 13–16 | The heart avalanche; one blue heart; Mas's post [V] | A harp and pizzicato cascade in F minor pentatonic (a texture, not a note per heart), thinning to **one harp harmonic for the blue heart**. **Out before the post** pops. |
| c · the boardroom at night | 17–26 | The blueprint; the phones; the Neleh/Alyi volley; **[PF] Neleh, HOLD, her real face**; `?`; the speakerphone dials | Step Four in low strings and bassoon; the Door on Alyi's reflected lines. **The sincere beat:** a solo viola plays the three steps, and on `?` step four gets **Neleh's question** (C6 → D♭6). Out before the four dial tones (SFX). |
| d · LIGHTHOUSE | 27–32 | The throne phone; "I've written up some thoughts."; the ADELINA card; "In plain English: no." *Click*; the rent meters; "…How much?" | **The Lighthouse** (marimba + harp), then **the quartet's Addendum** on "some thoughts", gaining a bar. **The click cuts the tail.** The Lighthouse runs on. On "How much?" the tail finally lands (sold). |
| e · NOV 19, the security camera | 33–34 | The grainy tile; GUEST; his post [V] | **Dry.** A low sustain before and after at most. |
| f · NOV 19 night, TTEMME | 35–38 | The spotlight; the card; "Chat…"; the hourglass flip; the sand | **The hourglass**: pizzicato grains, one per beat, falling |
| g · 11:53 PM | 39–42 | The wall goes slate blue; the door; TASYA's post [V], read aloud | **Tasya's floor**, one held step on Rhodes and low strings, on the wall's palette step. **Out before the post.** |
| h · "Step four?" "Good question." | 43–44 | The blueprint; the blank | Step Four's three chords, and **the fourth blank again** |
| **09x** · the card | 45 + 1 beat | `WHAT THEY DIDN'T KNOW` | **REVERSAL on the downbeat:** a bright leap C4 → F5 (strings, horns and one chip F6: the door is the show's, so the chip may return here). On the card's extra beat, **a single felt F4**: the door back. It rings into D's MM-10. |

| | |
|---|---|
| **Stems** | strings, winds (bassoon, flute, reed organ), brass (horns, mute trumpet), perc (marimba, celesta, timpani, glock), piano (the Rhodes in g; the felt F4 in 09x only), bass |
| **Loops** | One hold bar per section, for the conform |
| **Levels** | Underscore −20 to −22; 09x −14 LUFS-M. Balance for sections a–h: 0 · 90 · 5 · 0 (the Rhodes counts as colour). |
| **Don't** | Villain music for the board, conspiracy harpsichord, pizzicato tiptoe on the hearts, **any felt piano or chip before 09x** |
| **Audition** | Do we care about Neleh at the hold? Does the pass sound unmistakably like "their side" next to MM-08 and MM-10? Does 09x feel like a reversal, not a fanfare? |

### 5.C2 · MM-06 "Beeper, 1993 / Sample-Chip, 2008" · library (ERA TIERS)

| | |
|---|---|
| **Use** | Every 1993 part (Eps 1, 4, 7, 12, including NESNEJ's), the 2005–14 flashbacks (the 2008 keynote, the 2012 sale, TIDDER 2014), and the render-front transitions |
| **Grid** | 96, so cuts to and from the present stay on the grid |
| **Length** | 34 bars = 85 s |

**Movement I · 1993 (1-BIT)** · bars 1–16, straight, F minor. `chip.beeper` only: 2 voices, on or off, mono.

| Bars | Music |
|---|---|
| 1–4 | The flat line (uneven registers, F4 F5 F4 F3), with root blips on each beat as the second channel |
| 5–8 | **The knee's cells, never whole:** the flat line, then the kink G A♭ C, **left hanging** (the kid hasn't finished yet) |
| 9–12 | Fm9 arpeggios in 16ths (F A♭ C E♭ G) with root blips. Loopable. |
| 13–16 | **NESNEJ, 1993:** the Upsell on the beeper → the close → **an empty slot** (the SFX register "clunks with no bell") |

**Movement II · 2005–14 (EARLY-WEB16)** · bars 17–32, swung. The band through `chip.sample_chip` (BRR, Gaussian interpolation, 144 ms echo): felt piano, upright, brushes, a lo-fi trumpet stab, chip lead.

| Bars | Music |
|---|---|
| 17–24 | **Young Mas:** the Water Line with the nudge twice, in A♭-major colours (A♭maj9 – D♭maj9 – Fm9 – E♭sus). No F major. Loopable. |
| 25–32 | "The dial-up era": the Build's cell in 16-bit (the napkin that becomes a website). Loopable. |

**Transitions** · bars 33–34: **the render front.** One chord, Fm(add9), rendered 1-bit → 16-bit → BASE over 2 beats each, tuned under the SFX `render_front_sweep` (F4 → F6). Deliver it forwards and backwards (`downgrading… → 1-bit`).

| | |
|---|---|
| **Stems** | chip (both tiers); the pre-chip piano, bass and drums for II, so a mixer can blend BASE in |
| **Loops** | 1–4, 9–12, 17–24 and 25–32, all seamless |
| **Levels** | Movement I: underscore −22 (with an alternate low-passed at 7 kHz), featured −18. Movement II: −20 / −18. Chip share: 100 % in I, about 90 % in II. |
| **Don't** | Chiptune covers, NES-overworld swing, cassette wow, boom-bap, modem sounds, a Mas motif on (REPORTED) material, the whole knee |
| **Audition** | Is the 1-bit charmingly harsh or fatiguing over 10 s? Does the 16-bit band sound like a memory, not like a video game? |

### 5.D1 · MM-10 "His Side / 745" · `E01-S29a` + `E01-S29b`

| | |
|---|---|
| **Picture** | 16:28–18:00. **a:** 16:28–17:20 (≈ 21 bars, mostly silent). **b:** the avalanche, 17:20–18:00 (16 bars, 4 phrases). |
| **Grid / key** | 96; F minor → a C7(♯9♭13) pedal at the peak. Form a is straight felt; form b is **swung** (SET-PIECE SWING). |
| **Motifs** | The Water Line (felt, then augmented in the strings); **the Build as the swung chip lead** (the employees are the company Gerg keeps rebuilding: "The company. Again. Just in case."); Step Four (crushed). **The MM-02 D5 bar is E's.** |
| **Length** | 92 s |

**Form a (sparse):**

| Picture | Music |
|---|---|
| The home shot (the glass, 2 beats) | The 09x felt F4 is still ringing |
| [2S] "i put the phone down." | Felt: the Water Line bar 1, pp |
| [MAS'S VERSION] (1 bar) | **Empty, for E's MM-02.** The hard cut kills it. |
| Rima's real post; eight hearted *Ticks* (SFX) | **Dry** |
| "the badge was a joke." / the Orb's hold / "mostly." | One felt note under the V.O., then out |
| The counter 505 · 650 · 700 · 745, *clunk* (SFX) | The Build's first cell (chip), 1 bar, stopping on the clunk |
| The employee-letter card (3 bars) | **Silent**, with 1 bar clear on each side |
| `ALYI (REPORTED)`; the Orb's chime; the check | **No score** |
| Gerg's tile: "One sec. Compiling." → "what are you building?" → "The company. Again. Just in case." | **The Build's first 4 notes, then 8**, in chip and wood: it plants the avalanche |
| The quiet beat: **Gerg glances up** | **The Build stops dead when he looks up.** No music in the quiet beat, the D8 line, the door, "Everyone is welcome." or "leave it open." |

**Form b · the avalanche (16 bars):**

| Phrase | Bars | Picture | Music |
|---|---|---|---|
| 1 | 1–4 | One tile, another, then hundreds | The Build compiles as a **swung chip lead** (4 → 8 → 12 → 16 notes), with a walking bass and a ride entering; timpani on b1; low strings from b3 |
| 2 | 5–8 | The stack presses; Alyi's tile resists for 1 beat and goes; NELEH: "Has anyone read the char—" | **Step Four in the low strings, displaced by the Build.** The chorale **holds 1 beat** as Alyi resists. **A 1-bar dialogue window** for the cut-off line (Neleh's line is invented). Brass hits end the phrase. |
| 3 | 9–12 | The QUIET VOTE is pushed out "without a sound"; 745 faces; one gap; [PF] Mas watching the gap | **The Water Line augmented** (violins and chip in octaves). For the QUIET VOTE **one layer drops out silently**, with no hit. The last bar thins to the Build plus a held high F. |
| 4 | 13–16 | Mada wedged, still, the spinner turning; the frame holds 1 beat; **the card lands on the next downbeat** | **The episode's one full band** (≤ 2 bars): trumpets, trombones and saxes on a sustained C7(♯9♭13), with strings and a timpani roll pressing. **Mada's spinner** stops with his. **Everything stops dead on the card's downbeat** (≈ b15.1; the card's SFX freeze hit, on F, owns it). The rest of the phrase is the card and the room. |

| | |
|---|---|
| **Stems** | chip, perc (wood, xylophone, timpani), strings, brass, drums (ride, bass drum), bass, piano (felt, form a) |
| **Levels** | Form a: −22 to −24. Form b: featured −16; phrase 4 −14 LUFS-M. Balance for b: 15 · 35 · 25 · 25. |
| **Cue points** | The V.O. windows; the D5 bar; the clunk; Gerg's glance (**the stop**); b1.1; Alyi's resisting beat; Neleh's window; **the card stop** (with alternates at b14.1–b16.1) |
| **Don't** | A riser into the card, braams, epic-trailer drums, a full band anywhere but phrase 4 |
| **Audition** | Does the avalanche erupt out of the door beat's silence? Does the stop on the MADA card get the laugh (the stat is the joke)? Is the full band earned? |

### 5.D2 · MM-13 "Outside Intended Scope" + THE COPY kit · library (GLYPH)

| | |
|---|---|
| **Use** | Every GLYPH hit in Eps 1–9 (≤ 2 s, by budget), the Q\* hooks, dread-before-the-cut outs, THE COPY in every episode, the Ep9 breakout underscore |
| **Grid** | 96, straight, **0 ms humanisation**; long values; tokens on the 16th grid |
| **Key** | An F pedal + the Ache; tokens from {F G A♭ C D♭}, at F4–D♭6 only (G6–F7 belongs to the SFX grains) |
| **Motifs** | Tokens (§2.5), one stage per level; the knee reversed; THE COPY of the Water Line |
| **Length** | 34 bars = 85 s, plus the hits and the COPY kit |

**Form:**

| Bars | Level | Music |
|---|---|---|
| 1–8 | **L1 · grains** (Eps 1–3) | 2–3 glass or celesta grains per bar (F5, C6, D♭6); a sub breath; the Ache dyad (G4 + D♭5) only in bars 5–6. The loop seam must be invisible. |
| 9–16 | **L2 · scrambled** (Eps 4–6) | The knee's notes shuffled, and once reversed, as 16th tokens with 50 % rests; 12.5 % chip + glass |
| 17–24 | **L3 · almost** (Eps 7–8) | `F F F F G A♭ D♭ …` with fewer rests, never reaching the octave; a high-violin pad on F–C–G |
| 25–32 | **L4 · the runaway** (Ep9) | `F F F F G A♭ C` and then **past** the knee's ending, `A♭ C E♭ F…`, climbing an octave per bar-pair; the sub swells |
| 33–34 | **HOOK** | A sub-pressure swell into one high glass D♭6 that **cuts dead on the downbeat** (dread before the cut) |

**The kits:**
- **The GLYPH hits:** 12 of them, each ≤ 2 s, in L1–L4 colours: the Orb's scan, the iris, a desk lamp.
- **Q\*:** 1 bar. A glass tone matched to the vault's F hum (SFX, *diegetic into score*) that swells with it and cuts, for Ep1 sc 31 and 33, before the button chord.
- **THE COPY:** the Water Line (§2.2) played back by chip at each of the §2.5 lags: a beat late (breaking off after 2, 3 and 4 notes, for Ep1 sc 19's hands runner), a beat late in three-part harmony (CHATGTP), an eighth late, a sixteenth late, in sync and quantised, in sync and swung, and **a sixteenth ahead**. The COPY stems carry only the chip. The editor lays them against MM-01.

| | |
|---|---|
| **Stems** | synth (glass, `tex`, `glyph`, sub), chip, strings, perc (celesta), fx |
| **Loops** | L1–L4, 8 bars each, seamless |
| **Levels** | L1–L2 −22; L3–L4 −20; hooks −16 LUFS-M; the COPY −24 (it's a hint) |
| **Don't** | Ligeti, vocoders, bleeps, stutters, growls, swing (except the COPY's swung lag), vibrato, humanisation, a swell under a line |
| **Audition** | Is L1 dread or a screensaver? Is L4 thrilling or just loud? **Is the one-beat-late COPY noticeable only on a second viewing?** That's the target. |

### 5.E1 · MM-11 "The Return" · `E01-S30a–e`

| | |
|---|---|
| **Picture** | 18:00–19:17, about 31 bars in 5 sections |
| **Grid / key** | 96. The Door in D♭ → the floor's mediant steps → F minor → a no-third ending |
| **Motifs** | The Door (STRAIGHT violin), Tasya's Rhodes floor, the Build (restarting), the Water Line (the cadence), the 1-bit flat line |
| **Length** | 77 s |

**Sections:**

| Sec | Bars (≈) | Picture | Music |
|---|---|---|---|
| a · ALYI | 1–4 | [P2]; his regret post [V]; three hearts rise **at the post's own pace, not on the beat**; the violin stops dead on the first heart; HOLD 2 BEATS of room tone; the IOU flutters (SFX) | **STRAIGHT, the one scripted exception to the dry rule:** the Door on **solo violin**, senza vibrato, with no portamento, swell or chip, **under the post only**. The stop is off the grid, so deliver the violin as its own track (`e01-s30a`) with the stop frame placed by the editor at the first heart (3 ms, no tail), plus 4 pre-rendered mid-note stops. |
| b · THE FLOOR | 5–14 | The bullpen with boxes and coats; TASYA: "We are below them, above them, around them." [V/K]; the remap in three held steps; everything Tasya-blue; the key ring (SFX); "hi." / "Hello." | **Dry under the real line**: the palette steps are silent. When his window closes and the room is blue, **Tasya's Rhodes enters with the floor**: A♭maj9 → Cmaj9 → Emaj9 → A♭maj9, with low strings and celesta glints. **The key ring owns the offbeats.** It is the most beautiful chord in the episode, and it's the landlord's. "hi." and "Hello." sit over its decay. |
| c · FIRES AND THE CALM-OFF | 15–24 | Mada in the only chair not burning; Terb; the FULL FREEZE card (SFX); the pin; the lines; the calm-off; "Terms?" / "Good question." / "good question."; **the long hold**; the nod; the stamp (SFX `rubber_stamp_C`) | **Optional LEVERAGE** (reuse MM-08's bars 1–4 stems) from Terb's entrance to the calm-off, **dropping out on the turn** ("Terms?"). Then **silence through the long hold.** **A low C pedal enters under the stamp's C**: the dominant, leading on. |
| d · GERG RETURNS | 25–27 | Gerg's post [V] and the keycaps (SFX); [PF] Mas; the last grain; TTEMME's post [V]; the hourglass shatters (SFX); the sand holds 1 beat, then falls | **Dry for Gerg's post**, then **the Build restarts on the keycaps**, joyful (the whole cell: chip, wood, pizzicato). **Out for Ttemme's post.** It holds through the sand's beat and resumes as the sand falls. |
| e · THE LOBBY | 28–31 | `DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0`; the box of spare `0` plates; the 1993 dialog; Cancel greys out over three held beats; **the bonk** (SFX, E3); [CU] silent 2 beats; [ECU] the glass; "okay." | **VICTORY LAP:** on the sign, **a brass stab** (2 trumpets + 2 trombones, open and short) on A♭maj9 with no third on the final chord, and the Build at full. **On the 0-plates insert the band cuts to one chip note.** The three greying beats get **the 1-bit flat line** F F F (uneven), so the bonk on beat 4 is the SFX's wrong note. Silence for the [CU]. **After "okay."**, never under it, the felt cadence **C4 → F4** on an open fifth. |

| | |
|---|---|
| **Stems** | strings (+ the violin track), brass, winds, perc (xylophone, wood, celesta, timpani), chip, bass, drums, piano (felt, Rhodes) |
| **Levels** | a −22; b −20; d −18; the stab −14 LUFS-M; the ending −22. Balance: 20 · 40 · 20 · 20. |
| **Cue points** | The violin stop (placed by the editor) · the floor's entry · the "Terms?" turn · the stamp's C · the Build's restart · the dry posts · the sand hold · **the sign stab** · the plates cut · the three grey beats · the bonk slot · "okay." + the cadence |
| **Don't** | A violin sob; a full band (that belongs to MM-10's S3); a sustained major chord; **any F major**; *Rocky* |
| **Audition** | Does the violin avoid "world's smallest violin"? Does the Rhodes floor read as ironic beauty? Is the sign's stab earned and then undercut? Is the cadence after "okay." the right last word, or one too many? |

### 5.E2 · MM-01 "Water Line" + MM-02 "His Version" · library + the D5 insert

**MM-01 · Water Line** (DARK ROOM)

| | |
|---|---|
| **Grid / key** | 96, swung, half-time feel; F minor with rootless felt voicings |
| **Motifs** | The Water Line; the verdict (once, in B) |
| **Length** | 30 bars = 75 s |

| Bars | Section | Music |
|---|---|---|
| 1–2 | **Intro** | The flat line and the nudge, felt alone |
| 3–10 | **A** | The Water Line ×2 (felt RH) over Fm9 – D♭maj7 – B♭m9 – C7sus(♭9), 2 bars each; upright bass pp; sparse brushes on 2 and 4. **V.O. windows at b5–6 and b9–10** (felt alone). |
| 11–18 | **B** | The kink G–A♭–C touched in the violas and cellos, and never taken; a chip triangle counter-line; **one Harmon trumpet line (b13–16)** for the night; the verdict (vibes F5–C6) at b17 |
| 19–26 | **A′** | The motif with a 50 % chip square doubling **only the nudge**. A V.O. window at b21–22. |
| 27–30 | **Coda** | C4 → F4 on an open fifth, no third. No F6 bells (the SFX ding). |

| | |
|---|---|
| **Loops** | Bars 3–26, seamless |
| **Endings** | 1-bar endings at b10, b18 and b26 |
| **Variants** | Felt alone (V.O.), trio, full |
| **STRAIGHT variant** | 8 bars of the Water Line on solo cello, no chip and no swing, for a sanctioned sincere beat in any episode |

**MM-02 · His Version** (KEYNOTE REEL)

| | |
|---|---|
| **Sound** | **A too-clean felt piano:** the felt with no `felt_mech`, no room, **perfectly even velocities and 0 ms timing**, and a glossy long hall with the pedal down. Straight. D♭ major / lydian: D♭maj9(♯11) – A♭/C – G♭maj7(♯11) – D♭/F. No chip, bass or drums. |
| **(a) The Ep1 insert, `e01-s29-d5`** | Render 2 bars starting on a downbeat. **The editor cuts at bar 2's downbeat.** The melody note sustains across that barline, so the cut lands **mid-note**. No fade in the file. |
| **(b) The library version** | 16 bars = 40 s, a shade more confident each pass. **It ends cut mid-phrase, even on the album.** This is also his brand music in the world (Ep2: under Rima's demo). |

| | |
|---|---|
| **Stems** | piano, strings, brass (Harmon), bass, drums, chip, perc (vibes) |
| **Levels** | MM-01 underscore −20 (V.O. windows −24); MM-02 −20. MM-01 balance: 55 · 25 · 5 · 15. |
| **Audition** | Is the Water Line calm rather than sad, and identifiable in 2 bars? **Is His Version pretty in the wrong way**: parody by polish, not a sincere ad? Does its "too clean" read against the real felt? Does the mid-note cut land? |

---

## 6. Policy

### 6.1 Score to picture, and library

| Score to picture (bespoke, to the slate animatic) | Library (4-bar phrases at 2–3 intensities, with clean endings, loops and cue points; cut by the music editor on bars) |
|---|---|
| THE PLAN in every episode | Home-room I-scenes, under dialogue |
| The episode's S2 and S3 set-pieces | Runs (THE RUN) |
| Told-twice passes and every signposted exit | Character suites (MM-01, 05, 17, 18, 19, 27) |
| The act-outs, the button and the stinger (from the OUTS KIT, fitted to picture) | Era beds (MM-06) and GLYPH (MM-13) |
| D5, D6 and the Rewind | PROCEDURE beds (MM-20) and THE RED LINE (MM-28) |
| STRAIGHT beats | |
| Each episode's room colours | |
| The Ep12 finale | |

- **Per episode (guides):** about 3 new to-picture cues or more, and about **10–13 minutes of score**.
- **Temp:** the reel beds (`audio/reel/`) and any V1 stems in episode cuts are temp. **Rebuild the reel beds from the library** as it lands (tone guide §9.7). **The main title's stems never play under a story scene.**

### 6.2 Workflow

1. **Spot** each episode from its slate animatic, **by sequence** (one continuous cue per sequence). The supervisor and the editor write `audio/ost/spotting/EPNN.json` and `.md` in the §3.0 notation. Each cue gets an ID, in and out bars and frames, a family, motifs, its thin windows (real lines, posts and cards: melody and hits out, ducked) and silence windows (D6 and the few designed stops), SFX slots and an owner.
2. **Brief** in the style of §5.
3. **Compose** in `tracks/<id>/track.py`, and render with `build` / `render_cli`.
4. **QA by analysis** (§6.9).
5. **Human audition** (§7), from META `audition`.
6. **Conform** when the animatic moves: whole-bar slips, then hold bars.
7. **Mix:** the music editor places the cues, and the re-recording mix balances them against dialogue and SFX.

### 6.3 Naming and folders

The engine writes these files (`engine/export.py`):

```
audio/ost/
  OST-BIBLE.md
  engine/                               the OST engine (engine owner only)
  tracks/_template/track.py             copy this for every track
  tracks/mm07-how-to-fire-a-ceo/        a library / album track (the id = the folder name)
      track.py                          META (id, title, tone, usage, scenes, motifs, key, composer, audition)
      render/mm07-how-to-fire-a-ceo-album.wav|mp3        the album master (-14 LUFS-I)
      render/mm07-how-to-fire-a-ceo-underscore.wav|mp3   the picture master (-20, or -16 for featured)
      render/stems/mm07-how-to-fire-a-ceo-<family>.flac  the ten families; they sum to the underscore master
      render/…-loop.wav, …-loop-tail.wav, …-loop-x3-preview.mp3
      render/….mid, …-pianoroll.png, ….cue.json
  tracks/e01-s25-the-plan/              a to-picture cut (META mm='MM-07'), when it differs from the album track
  spotting/E01.json, E01.md
```

- **IDs:**
  - **Album and library tracks:** `mm##-<slug>` (for example `mm07-how-to-fire-a-ceo`).
  - **To-picture cuts:** `e<ep>-s<scene>[a–z]-<slug>` (for example `e01-s27c-boardroom-night`). A device cue adds its device: `e01-s29-d5`.
  - The track list and cue sheets use `MM-##` and `E01-S27c`.
- **Versions:** re-render in place, but copy the auditioned render to `render/_v01/` first. Never overwrite a render a human has auditioned.
- **META `usage`** is BI (background instrumental), VI (visual), MT (main title) or ET (end title), for the music cue sheet.
- **The cue sheet** (`.cue.json`, from the engine) must also carry, in META:
  - `mm`, `family`, the SFX slots, silence windows and V.O. windows;
  - the `knee_whole` count (it must be 0 in-episode);
  - the `f_major` check.

### 6.4 Deliverables per track

- **Everything the engine writes:**
  - the album and underscore masters (WAV 24-bit plus MP3);
  - the FLAC stems (the ten families, summing to the underscore master);
  - the loop, its tail and the ×3 preview;
  - the MIDI, the piano roll and the cue sheet.
- **For library suites,** also: phrases in 4-bar blocks at **2–3 intensities** (via sections and markers), **clean endings** after each block, and 30, 15 and 5 s cut-downs.
- **For to-picture cues:** the picture version at the cue's exact length and start frame. Where an element must be placed on its own (the Alyi violin, the D5 bar), give it its own track.
- **META `audition`**: 3–6 items, each with a timecode.

### 6.5 Loudness and spectrum

Loudness is BS.1770-4 (the engine's `analysis` and `mix`), measured on the music alone. Short-term is a 3 s window with a 0.5 s hop. Windows below −60 LUFS-M are left out.

| Master or role | Target | Limits |
|---|---|---|
| **Underscore** (the picture master, under dialogue) | **−20 LUFS**: the engine's default, ≤ −3 dBTP, with its 2.5 kHz dialogue pocket | Short-term p95 ≤ −17 |
| **Featured** (wordless set-pieces, runs, THE PLAN) | **−16 LUFS**: set META `underscore_lufs=-16` | Short-term p95 ≤ −13; momentary max ≤ −11 |
| **V.O. windows** (composed to one instrument) | −24 LUFS-S ±2 | The 1–4 kHz band **≥ 10 dB below the voice** (the intro's VO measured −16.5 LUFS-S) |
| **Outs and stabs** | THREAT and REVERSAL **−14 LUFS-M** (400 ms) ±1, each measured alone; DREAD and buttons −16 | — |
| **Album masters** | **−14.0 LUFS-I** ±0.5, ≤ −1.0 dBTP (the engine's default) | Quiet tracks may set `album_lufs` down to −16 |

- **Spectrum under dialogue:** the **2–6 kHz band ≤ −15 dB** relative to total power; the centroid 450–800 Hz.
- **Under the room SFX:** the sub band (< 60 Hz) ≤ −18 dB under `room_drone` and `server_hum`.
- **References** (measured 2026-09-25):

  | File | LUFS-I | ST median | Centroid | 2–6 kHz |
  |---|---|---|---|---|
  | V1 main title | −14.0 | −13.8 | 711 Hz | −11.6 dB |
  | V4 main title | −14.0 | −14.0 | 518 Hz | −15.5 dB |
  | The ep01 reel bed | −19.6 | −20.0 | 601 Hz | −16.3 dB |

### 6.6 Editing cues to picture

*(Revised 2026-09-26 by [flow-and-continuity §3](../../show/bible/flow-and-continuity.md#3-sound-a-continuous-bed): the old rules 1, 3, 6 and 7, "cut on bar lines, no crossfades, never fade under a line, stop for real lines, duck ≤ 3 dB", are what turned v3's score into fragments.)*

1. **One continuous performance per sequence.** Prefer re-rendering the cue to the sequence's length. When editing, edit on phrase boundaries, and change tone with **a crossfade on a downbeat (roughly 0.5–2 s), a ring-out, or a pre-lap** of the next cue under the outgoing picture; a hard cut between unrelated sections sounds like a mistake. A cue carries across picture cuts, and that's the cheapest bridge there is (tone guide §4). Hits are sample-accurate to their frame, within 0–10 ms on the sharpest carrier.
2. **To lengthen,** re-render, or repeat hold bars or loops (about 2 passes before a loop starts to show). **To shorten,** drop whole 4-bar phrases marked cuttable.
3. **End** on a clean ending or a ring-out at a phrase boundary, or crossfade into the next cue. Avoid ending a cue in the middle of a line, where the line would drop into a hole; a fade into room tone is fine.
4. **Hard stops** (D6, D5, the waltz, the card stops, and the violin if the script keeps its dead stop): a 3 ms fade with **the tails cut**. They are baked into the cue; don't rebuild them in the mix. They are punctuation: a few per act, each on a story beat, with room tone under it and a clear re-entry.
5. **No time-stretch or pitch-shift beyond ±1 %.** Ask for a re-render at the exact bar count instead.
6. **Real lines play dry.** The editor checks every real line, post and card against the cue's thin windows: melody and hits out, a pad or pedal holding, ducked further. No comic scoring on the line, and no stop unless the plan calls a designed one.
7. **Duck under dialogue** by about −8 to −12 dB with a short ramp, rather than stopping. Composed V.O. windows and the underscore's dialogue pocket need less; the re-recording mix sets the final amount by ear.
8. **SFX slots** are where the SFX editor lays the KA-CHING, the freeze hits and the bonk. The music rests there by design.
9. **The drop-out is enforced in the mix** as a mute of every bus (music, SFX, room, reverb returns).

### 6.7 Against repetition

This answers the showrunner's note directly. The numbers are guides: the test is whether an episode sounds like one track on repeat.

- **Each episode:** about 6 families or more; a family used more than about 3 times starts to wallpaper; about 3 new to-picture cues or more; at least 1 new track for the album.
- **A library cue** about twice per episode at most, rarely in adjacent scenes, with about 2 loop passes per use.
- **Outs:** vary them; avoid the same out twice in a row, or twice in one episode.
- **The knee:** never whole in-episode. Its fragments are ≤ 1 per scene. The credits reprise changes colour every episode.
- **Each library suite ships at least 3 variants** (full, reduced, solo), so a reuse sounds different.
- **Motifs follow the story** (§2's tables). A character never gets the same statement of their tune in two episodes running.

### 6.8 One owner per sound (the SFX)

| SFX (manifest id) | Pitch | What the score does |
|---|---|---|
| `ka_ching` | F6 + C7, no third; the bell at about +30–60 ms | Writes the sale, cadences on F–C and **leaves the downbeat**. If a cue must be in another key, request a retuned KA-CHING. |
| `glyph_shimmer`, `glyph_blink`, `glyph_dissolve` | G6, D♭7, F7 | Tokens at F4–D♭6 |
| The Orb's chime, `orb_servo`, `orb_scan_sweep` | F | The verdict never plays at the same moment |
| `alert_bonk` | E3 (the wrong note against F) | Holds F, so the bonk is wrong |
| `freeze_hit_F`, `_Db`, `_Bb`, `_C` | the card's root | A card sting is in the freeze hit's key |
| `rubber_stamp_C`, `letter_clunk`, `landing_thunk` | C and F | Tuned entries (the stamp's C → the Return's pedal) |
| `room_drone`, `server_hum`, `neon_buzz` | F1 + C2, F2 | Nothing below C3 while they play |
| `keycap_popcorn` | F minor pentatonic, F5–C7 | The Build at F4–C5 |
| `render_front_sweep` | F4 → F6 | The era transitions sit under it on one chord |
| `reverse_swell_*`, `tape_*` | — | The score's Rewind is a retrograde, and its tape-stop is on its own stems |
| The dialogue blips (`voice_*`, `blip_*`) | the character's instrument | **The score never imitates them** (RUMPT's trombone blats, for example) |
| The key-ring jangle, Nole's lamp click, Mario's pencil, the typing | — | The score leaves them their beats (Tasya's offbeats, the lamp's pickup) |

**Requests to the SFX owner:**
1. Tune the Ep1 sc 27 speakerphone's four dial tones to Step Four's line (F4 E♭4 D♭4 C4), or confirm they stay untuned.
2. Confirm the freeze-hit key for each Ep1 card (MADA: F).
3. Confirm that the KA-CHING files start at the latch.
4. **The sc 26 GLYPH tile dissolve sits inside D6**, where the click is the only sound, so `glyph_dissolve` should be silent there, or the D6 window must end before it (POV owner).

### 6.9 QA by analysis, since nobody listens

Run these on every render (`engine/analysis.py`), and write the results to the cue sheet. They find spots to listen to; they don't pass or fail a cue on their own, and nothing is called "locked" on numbers alone ([flow-and-continuity §5](../../show/bible/flow-and-continuity.md#5-coherence-is-checked-not-assumed)). The technical limits (true peak, the stems' sum, the F-major and knee-whole checks) are the exceptions: those are real faults.

1. **Loudness and true peak** to §6.5, in each role's windows.
2. **Onsets:** every cue point within ±10 ms of its frame.
3. **Silence and thinning:**
   - D6 windows peak < −90 dBFS.
   - ~~Real-line, post and quote-card windows peak < −70 dBFS; quote cards also with 1 bar clear on each side.~~ **Replaced 2026-09-26:** in real-line, post and quote-card windows the music **thins**: no melodic onsets or hits inside the window, and its level about 8 dB or more below the same cue just outside it. The cue should not drop out there.
   - **Flow:** list every music start and stop and the shortest fragments (anything under about 2 s that isn't a designed sting is a spot to hear), and every hole in the full mix under about −42 dBFS for 0.3 s or more outside D6 ([flow-and-continuity §5](../../show/bible/flow-and-continuity.md#5-coherence-is-checked-not-assumed)).
   - Hard stops leave no tail after 3 ms.
4. **Chroma:**
   - **The F-major check:** no A♮ energy (≥ 0.08 relative to F) wherever F is in the bass.
   - **No-third windows** (buttons, the verdict): A and A♭ ≤ 0.06 relative to F.
5. **Swing:** swung offbeats at +10 frames (±3 ms) where specified; **0 ms of humanisation** in GLYPH, BLUEPRINT, the KEYNOTE REEL and exits.
6. **Balance:** the family shares against the palette target, ±5 points. Chip share is reported for every cue, and it must be 0 in exits and STRAIGHT.
7. **Spectrum:** the 2–6 kHz ratio and centroid for underscore; the sub under the room SFX.
8. **Loops:** `loop_seam` passes, and the loop plus its tail reproduces the linear render.
9. **Stems** sum to the underscore master (the engine reports the residual).
10. **Motifs:** from the MIDI, each motif's pitch sequence appears where the cue sheet says (note for note, transposed only where the brief allows). The knee's whole 8 notes appear 0 times in episode cues.
11. **Banned material:** no `kit808` or `clap808` (except in diegetic cues), no gong, no F6 bell in underscore, no untuned beeps, no 808 outside LEVERAGE's thud.
12. **The piano roll** (`analysis.piano_roll`), with the sections, cue points and silence windows marked.

### 6.10 Licences and rights

- **Samples:**
  - VSCO 2 CE and VCSL (CC0);
  - Salamander Grand (CC BY 3.0: **credit Alexander Holm**);
  - Upright Piano KW (credited to FreePats);
  - GeneralUser GS (free for music);
  - numpy synthesis for everything else.

  The credits are in [LICENSES.md](../samples/LICENSES.md) and in each cue sheet.
- **No generative-AI music models and no voices.** The chant and the PAD belong to the vocal team. The score is rendered from code and licensed samples, which keeps guardrails §5's "check AI-music terms" trivially satisfied.
- **Originality:** copy no melody. Check every motif and every head against §1.7's list before it ships.
- **Content ID:** distribution is open ([overview §9](../../show/bible/overview.md#9-decisions-still-open)). **Don't register the score** with Content ID or a library service until it's decided.

---

## 7. What a human must audition first

In priority order. Each item is something measurement can't decide.

1. **MM-08, bar 8: the hard stop on the click.** Does it land as a blow, or like a playback glitch? Check it with picture.
2. **MM-02, the KEYNOTE REEL.** Is it parody by polish, or a sincere ad? Does "too clean" read against the real felt? Does the mid-note cut land as the correction?
3. **MM-11a, the STRAIGHT violin.** Does it avoid "world's smallest violin"? Does the stop on the first heart get the laugh?
4. **MM-07, the waltz and its missing F, then the tape-stop.** Funny, or cute? A music box, or a toy?
5. **MM-19, the Rename, and parity.** Is the E♭ → B/D♯ slip deadpan? **Is the Fountain Pen as grand as LOVE?**
6. **The chip level across the batch.** Identity without toy-ness? Too much in DARK ROOM, too little in THE PODIUM?
7. **Mario's quartet and Lighthouse** (MM-09d). Does anything sound Nintendo?
8. **MM-13's L1 and L4, and the COPY at a beat late.** Dread, or a screensaver? Is the COPY noticed only on a second viewing?
9. **MM-05's KA-CHING slots** with the SFX laid in. Does the sale close?
10. **MM-10b, the avalanche.** Does it erupt out of the door beat's silence? Does the MADA stop get the laugh? Is the full band earned?
11. **MM-11e, the sign's stab and the felt cadence after "okay."** Earned and then undercut? One note too many?
12. **Every V.O. window against a voice** (a stock voice is fine). Does the lowercase V.O. sit comfortably on top?

---

## 8. Open decisions and handoffs

**Decisions:**

| # | Decision | Owner | Default until decided |
|---|---|---|---|
| 1 | **The third in Ep12 is A♮**, the major third, on `ours.` (§1.8). The tone guide reserves "the arrival of the third" for Ep12 but doesn't say which third. | Showrunner | No A♮ over F, and no third on buttons |
| 2 | **The knee whole in-episode, once:** the model in Ep12 (§2.5; tone guide §9.3 says never) | Showrunner + head writer | Never |
| 3 | **ERA T2 = the title's 16-bit sample-chip band, not "cassette piano and boom-bap"** (§3, ERA TIERS). The tone guide cites the superseded v1.1 cue sheet; SCRIPT v2.1 retired both. | Head writer | The sample-chip band |
| 4 | **THE RUN without boom-bap:** a kit groove plus the Build (§3, THE RUN) | Head writer | A kit groove plus the Build |
| 5 | **LEVERAGE's "muted 808"** realised as a pitched sub-thud, never a kit (§3, LEVERAGE) | Head writer | The sub-thud |
| 6 | **F1.2 silent** (script C39) vs "the cassette tier" (tone guide §9.6 sample) | Ep1 writer | Silent |
| 7 | **The KEYNOTE REEL on a too-clean felt** (the tone guide) rather than a grand (this bible's first draft) | Adopted | — |
| 8 | **The Return has no full band.** The full band is MM-10's S3 only (the tone guide's SET-PIECE SWING rule). | Adopted | — |
| 9 | **Nole's Ep8 render:** the season's only overdriven guitar, ≤ 10 s | Showrunner | Horns and timpani |
| 10 | **Ep12: his version wins.** The KEYNOTE REEL plays uncut. | Ep12 owner | — |
| 11 | **The act-out outs** in tone guide §9.5 (no-sting outs) | Pacing owner | THREAT, REVERSAL and DREAD, rotated |
| 12 | **V4 main title for quiet episodes.** Proposed: Ep7 (THE HUG) and Ep12. | Showrunner | V1 |
| 13 | **Distribution and Content ID** (§6.10) | Showrunner | Not registered |

**Handoffs:**

| To | What |
|---|---|
| **The OST engine owner** | Add the §2 motifs to `engine/motifs.py` as named tables: WATER_LINE, KEYNOTE, VERDICT, TOKENS (the stage table), ACHE, COPY (the lag table), BUILD, LAUNCH, ADDENDUM, LIGHTHOUSE, GPU_CHOIR, DOOR, PODIUM, RENAME, FOUNTAIN_PEN, UPSELL, INTERN, STEP_FOUR, BLUEPRINT and the §2.16 colours. Add the §6.9 checks to `analysis`: the F-major check, a knee-whole counter, silence windows (D6 and designed stops), **thin windows** (real lines, posts and cards: no melodic onsets, level drop against the cue around them), a fragment and hole report, and a motif matcher. Add `thin_windows` to the cue sheet META beside `silence_windows`. Mark `kit808`, `clap808` and `gong` as diegetic-only. Note in the template that 96 is the house tempo. |
| **Writers** (Eps 2–12) | Call music by family in the §3.0 notation. Mark real lines so they play dry. Apply §4.3 to Ep3. |
| **The SFX owner** | The four requests in §6.8 |
| **The POV owner** | The sc 26 tile dissolve inside D6 (§6.8 request 4) |
| **The re-recording mix** | D6 as an all-bus mute. Respect the V.O. windows, SFX slots and thin windows (duck about −8 to −12 dB under dialogue; keep room tone under every shot). Retire the reel temp beds as the library lands. The main title's stems never play under a story scene. |
| **The editor** | Spot Ep1 Act Four from the [v4 edit plan](../../show/episodes/ep01/production/act4/edit-plan-v4.md) §5 (not §4.1, which is draft 3.x history), and write `spotting/E01.json` |
| **Production estimates** | Price the library against [production-estimates §4.1](../../show/format/production-estimates.md)'s 5–15 agent-h line. It is likely above it: 36 tracks, 10 of them this pass. |
