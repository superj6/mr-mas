# E01 · Act Four v5 · the continuous to-picture score

Two composers share this folder. Each owns the files with its prefix and one section of this README:

| Prefix | Sequences | Act frames | Section |
|---|---|---|---|
| `s1-s4_` | S1 the plan and the call · S2 that night · S3–S4 the board's side through step four · **the card (09x)** | 0 → 6985 (+ the felt F4's ring into S5) | [S1–S4](#s1s4-his-side-the-plan-and-the-call-that-night-the-boards-side-through-step-four) |
| `s5-s8_` | S5 his side at 2 AM · S6 the avalanche · S7–S8 the return, the lobby and the coda | 6985 → 12443 (+ a ~4 s ring into the tag) | [S5–S8](#s5s8-his-side-at-2-am-the-avalanche-the-return-the-lobby-and-the-coda) |

Clock: act frame 0 = episode 12:31:00, 24 fps, read from the locked stick timeline `show/reel/ep01-act4-v5.json` and the takes `audio/ep01/act4/dialogue/lines-v5.json`.

## S1–S4: his side (the plan and the call), that night, the board's side through step four

**What this is (2026-09-27).** The continuous to-picture score for act frames 0 → 6985 of Act Four v5, plus the card's felt F4 ringing about 2 s into S5. It's written to the exact frames of the locked stick timeline `show/reel/ep01-act4-v5.json` and its takes `audio/ep01/act4/dialogue/lines-v5.json`. There are three cues, each one continuous performance, rendered by the OST engine from the batch-1 material (MM-07, MM-08, MM-09 and 09x, imported read-only). The v4 re-lays in `tracks/e01-act4-v4/` were the starting point and weren't touched. **Nothing was heard.** Every number here is measured; the last section lists what numbers can't tell.

| Cue (`render/<id>-underscore.wav`) | Sequences | Lay file t = 0 on | In (first sound) | Out | Underscore | From |
|---|---|---|---|---|---|---|
| `s1-s4_noon` | S1: the suite, THE PLAN, the call | act 0 (12:31:00) | 48.9 | 997.1: **D6**, the hard stop on the Cancel click | −20.0 LUFS, −4.2 dBTP | MM-07 (felt bar, Blueprint, waltz, tape-stop) → MM-08 (LEVERAGE) |
| `s1-s4_third-mark` | S2: that night | act 1166 (13:19:14) | 1177.9 (the carve, 1178) | 1512.0: cut on the whip | −22.0 LUFS, −3.2 dBTP | MM-08 26A (felt, the Rewind) |
| `s1-s4_procedure` | S3 + S4 + the card: pass one, then 09x | act 1500 (13:33:12) | 1512.0 (the whip) | 7034.0: the felt F4's ring into S5 (the orchestra is faded out on 6985) | −21.0 LUFS, −3.2 dBTP | MM-09 a → h, then 09x |

Lay each file at 0 dB; the duck map assumes it. The album masters (−16 LUFS) are for the soundtrack only.

**Files.** Each cue has these in `render/`:
- `<id>-underscore.wav` (+ `.mp3`): the picture master
- `<id>-album.wav` (+ `.mp3`)
- `stems/<id>-<family>.flac`: they sum to the underscore master; residuals −165, −174 and −170 dB
- `<id>.mid`: the notes, with the tempo map and every sync point as a marker
- `<id>-pianoroll.png`
- `<id>.cue.json`: the engine's own cue sheet and QA

Beside them:

| File | What |
|---|---|
| `s1-s4_cuesheet.md` / `.json` | Frame-exact lay-in, in and out points, stops, sections, and every sync point with its onset check |
| `s1-s4_duckmap.json` | The mixer's key: one window per voiced line (first and last sound, head breath, depth), the holds, the posts, the designed no-score windows, and the gain curve (one value per act frame, 0 → 7100) |
| `s1-s4_qa.json` | Every measure below, in act frames |
| `render/s1-s4_chain-ducked-preview.mp3` | The three cues laid at their act frames and ducked by the map, act 0 → 7058. It's an audition aid only; the mix works from the stems |
| `s1-s4_common.py`, `s1-s4_s1_noon.py`, `s1-s4_s2_third_mark.py`, `s1-s4_s3s4_procedure.py` | The clock and the three scores; each cue's docstring has its frame-by-frame map |
| `s1-s4_render.py`, `s1-s4_qa.py`, `s1-s4_duckmap.py` | Render; measure, cue sheet and preview; the duck map |

**The clock.** Act frame 0 is 12:31:00, at 24 fps.
- A beat starts at its `realStart − 751.0 s`.
- A line's first sound is the beat's start + `t`, and its last sound is that + `dur`. Words come from the take's word times.
- Some story marks are only implied by the timeline (the walk-offs, the arrow's steps, the folder). Those come from the pixel pass's lock `show/episodes/ep01/production/act4/shots-locked-v5.json`.
- Before every build, `verify()` re-derives all 83 shot starts and 101 line onsets from the timeline and stops if they disagree. Asserts at the top of each cue stop the build if a frame it depends on moves.

### How each sequence plays

**S1 (`s1-s4_noon`)**
- **The suite.** His felt plays the Water Line's bar, swung. Its nudge G4, with the 50 % chip square on that note only, sounds **on his glass nudge (94)**. The C4 hangs on D♭maj7, and the pedal rings it on through the blueprint's cut and the stamp (151, SFX, C).
- **THE PLAN.** A quartal pad enters after the stamp. The chip waltz, in 3/4 on the 96 beat, walks the three chairs off on its **F F F (186, 201, 216, one a beat)**. The second waltz bar is the accompaniment alone: the empty chairs. **The 4/4 returns on "four" (276)**, and the waltz players' tails are gated there. From then on it's one Blueprint note per label: F (the four), G (NONPROFIT), A♭ ("controls"), B♭ ("company"), C (THE COMPANY), B♭ (VOTES: 0, at the line's end), A♭ (CEO). A note under a word plays on the box alone; a note in a gap gets the full voice.
- **The zeros and the path.** One held quartal chord plays, pp, under "Good question." and the two zeros, with the moth's celesta flutter. The harp draws the path, with tick 1 = F4 on "1. NOON". Then the stuck G–A♭ loop, and **the tape-stop from the tear (729) reaches zero on the JOIN click (772)**. THE PLAN's players carry their own reverb and the tape inside the track, so no tail crosses the click.
- **LEVERAGE (low),** 15 beats as one take from JOIN to Cancel:
  - Neleh's clockwork on her card (794.5), and his calm: one felt F4 (847).
  - Everything but the eighths drops under Alyi's silent mouth (862–888).
  - The 1-bit F F F on the dialog (888); the cluster moves up a semitone and Mada's spinner starts on his eyes (910).
  - Step Four plays on the arrow's three steps (940, 959, 978).
  - **Cancel (997): D6.** Every stem and tail goes to digital zero, and nothing plays under "super.".
  - LEVERAGE sits 3 dB under THE PLAN (MM-08's "low"). The step down lands on the JOIN click, where the tape is at zero.

**S2 (`s1-s4_third-mark`)**
- The re-entry after D6 is the felt's open fifth on the carve (1178).
- The nudge G4 sounds *before* "i don't keep score." (1216), so the V.O. sits inside the bed.
- Violas and celli hold the drone's F/C pedal an octave up, sul tasto, under the count and the TPOOL rail. Nothing sits below C3 over the room drone, and the (REPORTED) rail gets no Mas motif.
- The felt comes back on mark 3 (E♭4), then the settle C4 → F4 (1452, 1467).
- **The Rewind:** E4, B♭3 on the 16-bit sample-chip piano (1482, 1497). It's cut on the whip at 1512, where pass one's B♭m(add9) lands.

**S3 + S4 + the card (`s1-s4_procedure`): pass one as one procedure that never stops.** No piano and no chip play before the card (the exit rule).
- **a.** B♭m(add9) and a harp-harmonic dyad land on the whip, with Neleh's clockwork under the wait. The B♭ pedal enters as his tile connects (1545) and holds under the firing, "Mas. The board has decided…", with the viola whisper stepping down a semitone in each gap. The clockwork creeps back, quietly, under the tinny "super." (1985). **Step Four in quarters rides the pen's run down the list (2060)**, and its blank, the F bass alone, holds under the blog post's reading. A clock tick plays under "Any objections?" and its silence, and **the Post click lands on a tick (2476)**.
- **b.** One soft pizz figure follows Rima's join chime; then the pedal and the whisper hold under the appointment.
- **c.** At the all-hands the pedal plays alone (the hush is the bed; the record plays dry). In the evening the pulse returns softly with the keycaps (3390) and breathes down to its downbeats under the two lines.
- **d.**
  - NOV 18: a D♭ bed and the hearts' cascade, to the burial, then one harp harmonic for the blue heart (3731).
  - The boardroom: a pizz burst on each phone buzz (3750, 3945), and the clock tick only under Neleh's speeches. The tick's last beat is the clack's (4395).
  - **The Door's head (A♭4 → D♭5), through the door, plays as the cut finds Alyi's reflection (4101).** The GPU choir holds, ppp, under him until the reflection flickers (4492).
  - **The sincere beat (4499):** the solo viola plays the three steps, F E♭ D♭, over Step Four in quarters, and the G♭maj7 holds under "Then we'll write step four ourselves."
  - **A designed rest for the four dial tones** (4575 → 4623).
- **e.**
  - The Lighthouse (marimba and harp) starts on the first ring (4623), thinned to the marimba's half notes under the talk.
  - **The Addendum, Mario's quartet thin under his own line, enters on "some thoughts" (4960).** It gains its bar, and **"no." cuts its tail (5103)**.
  - On "How much?" the tail finally lands on G♭maj9 with D♭5 on top: sold, not resolved. It rings into the lobby camera.
- **f.**
  - The clockwork resumes, thin, on the lobby camera, with the tick under the talk.
  - **The straight-mute accent (F4 → B♭4) and the pulse play on the spotlight (5661).**
  - The music holds a sul tasto chord under the folder's long beat.
  - **The hourglass drops one pizz grain a beat, falling (6127).**
- **g. Tasya's floor**, with silent attacks:
  - A♭maj9 on the slate (6206), then Cmaj9 as the door opens (6240).
  - **The Rhodes plays on the beats as Tasya appears (6276);** the jangle SFX owns the offbeats.
  - The held chord settles about 4 dB before he speaks. It's re-voiced once, at the statement's sentence break (6518: Emaj9, the floor's next step).
  - It comes home to A♭maj9 on the sign, with one Rhodes chord (6753).
- **h.** On "Step four?" the clockwork winds down (6824) and **hangs on one held C over the blank's F bass (6844)**. Mada's spinner (C5–D♭5, harp harmonics) turns under his silence.
- **09x.** The C pickup (6935.5), then **the REVERSAL on the card's first frame (6943)**: F(add9), no third, one chip F6. It's ridden at −6.5 dB and reads −15.2 LUFS over the −21 bed. **At 6985 the orchestra fades out in 4 ms and one felt F4 (his room first) rings under S5's pedal,** at −25.0 LUFS in its first bar (§4.1 asks −24). S5's cue strikes nothing on 6985; its composer agreed to this above.

### Under the words: thinned, then ducked

- **Thinned in the notes.** Under every voiced line the score keeps only its pedal. In THE PLAN that means the roots, the pad and a soft pencil tick; in the boardroom, a clock tick. Figures, chord changes and whisper steps are placed in the gaps.
  - `s1-s4_qa.json` → `thin` lists every melodic onset written inside a line, with its reason. **None is unexplained.**
  - The designed ones:
    - THE PLAN's one box note per label (the plan's rule)
    - the waltz's F F F on the walk-offs
    - the clockwork under the tinny "super." (edit-plan a)
    - Mario's Addendum, played thin under his own line (e)
    - the Lighthouse's half notes under the split (e)
    - the hourglass grains under "Chat… for how long?" (f)
    - the floor's re-voicing at the statement's sentence break (g)
- **Ducked in the mix** by `s1-s4_duckmap.json`. The depth is level-aware, following v4.1's lesson that a full duck buries a cue that is already a pedal:
  - `depth = clamp(−31 LUFS − the score's own level in that line, category floor, −4 dB)`
  - The floors are:
    - −10 for THE PLAN's read, invented lines and the laptop's "super."
    - −11 for the record read aloud
    - −4 for his V.O., which sits inside a composed felt window
    - 0 for the suite's "super.", where no score plays
  - The duck pre-ducks 0.3 s ahead of the first sound (earlier if the head breath is), attacks over 0.2 s, and releases over 0.6 s starting 0.1 s after the last sound. It holds across gaps under 2.5 s at the shallower depth, so it doesn't pump.
  - Under a silent post it's −3 dB, with the held families +2 dB.
  - **Result:** the score's own level under the lines has a median of −21.8 LUFS. Ducked, every line sits between −28.5 and −31.1 LUFS (median −31.0). The depths come out between −4 and −10.5 dB.

### Measured (engine QA per cue, plus `s1-s4_qa.py` across the three laid end to end)

| Check | S1 | S2 | S3 + S4 + card |
|---|---|---|---|
| Written A♮ over an F bass (rule 12, every note boundary) | 0 | 0 | 0 |
| F-major, sieved audio (36 / 18 / 37 F-bass windows) | 1 window over the limit, **inside the designed tape-stop** (act 741, A/F 0.63): the chip triangle's 5th partial sweeping down through A as the tape slows. The engine can't attribute a time-warp done in a post; v4's S1 had the same | OK | OK |
| Knee completed by pitch class (rule 4) / whole knee | 0 / 0 | 0 / 0 | 0 / 0 |
| Hard stop | D6: −240 dBFS in the file; −138.5 dBFS peak across 997 → 1178 in the laid chain | the whip: −240 dBFS | — |
| Sync-point onsets within ±10 ms | 20 of 23 | 7 of 7 | 12 of 29 |
| Short-term p95 (limit −17) | −17.5 | −18.8 | −18.4 |
| 2–6 kHz band (limit −15 dB) | −19.6 | −36.2 | −21.0 |
| Balance piano · orch · bigband · chip | 11 · 50 · 0 · 38 | 81 · 14 · 0 · 5 | 1 · 85 · 13 · 1 (the horns count as big band; the 1 % chip is the card's F6) |

- **Holes and runs.** On the three laid at their act frames, the music plays in three runs: 48.9 → 997, then 1177 → 4616, then 4620 → 7033. There's no fragment under 2 s.
- **The one hole** (louder channel ≤ −60 dBFS for 0.3 s or more) is the designed D6 plus the room's "super." (997 → 1177, 7.5 s). The dial-tone rest dips below −60 dBFS for only 0.15 s; the sincere beat's release carries the rest. The S2 → S3 join has no gap: the S2 file is cut on the whip on the same frame the S3 chord starts.
- **Onsets over ±10 ms.** Most are bowed sul-tasto entries with 50 ms attacks and sustain samples that speak late: Step Four on the list, ±40–58 ms, and the pulse on the keycaps. The rest:
  - Muted horns on the arrow: −22 and −59 ms, possibly the latency compensation.
  - The GM Rhodes: +51 ms.
  - The landing: −39 ms.
  - The REVERSAL: −16 ms, the pickup and the harp roll leading.
  - The felt at 6985: −40 ms; the detector reads the orchestra's fade.
  - Every note is written on its frame. The list is in the cue sheet's sync tables.
- **The V.O. window** (S2) reads −27.8 LUFS in the cue master. §6.5 asks −24 ±2 for a composed V.O. window. The cue is almost all felt, so raising the felt raises the normalised whole, and it moved only 1.4 dB over two renders. Under its −4 dB duck it lands at −30.9 in the mix, level with every other line. Raise the G4 alone if the ear wants it forward.

### Where this departs from edit-plan-v5 §4, and why

1. **The walk-offs.** The plan puts F F F in the 0.8 s after "year". The pixel pass walks the chairs off at "stepped" +0/+15/+30 (`plan4.ts`: `three`, `+15`, `+30` on v5's mark), so the waltz follows the picture. It's the box alone under the words; the celesta joins on the third, after "year".
2. **The 4/4 returns on 276**, 3.4 frames into "four" (272.6). This keeps THE PLAN on one beat grid from the walk-offs to the tear; every label lands within 4 frames of its note.
3. **VOTES: 0.** The stamp (SFX, C) falls on the word "votes" (517), so the score leaves it to the SFX. The label's note B♭4 plays at the line's end (531).
4. **Step Four in pass one** is stated on S3.02's list, where the pen's run is the procedure, and on S4.07's sincere beat. The whip lands on its first chord alone.
5. **Alyi's colour is in the glass, not the doorway.** His all-hands answer [V] plays over the pedal alone, as plan c asks. The Door's head and the GPU choir sit where OST-BIBLE §2.9 puts his Ep1 motif: his reflection in the boardroom glass (S4.04 → S4.06).
6. **Tasya's floor takes all four steps** (A♭ → C → E → A♭, the cycle coming home), not just one. The plan's "re-voiced once at the sentence break" is the floor's next mediant step, and the Rhodes plays one chord on the sign.
7. **Mada's spinner turns under the hang** (S4.15). The plan asks for "one held note under Mada's silence"; the held C is that note. The spinner is his colour, for a spinner the picture shows turning.
8. **The REVERSAL rides at −6.5 dB, not MM-09's −9.** At −9 it sat only about 3.5 LU over this bed.
9. **The dial-tone rest is a true rest** (room tone, about 2 s), made from the sincere beat's release. It isn't a held pedal.

### What a human must hear

1. **0:02–0:06.** The felt's nudge on his glass nudge: one note on one gesture, or mickey-mousing?
2. **0:07–0:12 of S1.** The three walk-offs on F F F under "…stepped down this year.", then the 4/4 back on "four": a music box and a joke, or a clash with her voice?
3. **0:29–0:32 of S1.** Stuck, then the tape-stop onto JOIN, with LEVERAGE on the same frame: the plan failing, not a playback fault?
4. **41.5 s of S1 through S2's first note.** The click takes everything: 3.7 s of digital silence, the room and "super.", then the felt fifth on the carve.
5. **Pass one as a whole (228 s).** Does the pedal-and-whisper under the firing, told from their side, read as dignified and never villainous? Does the procedure ever nag like a loop?
6. **The Door's head and the choir in the glass.** A cathedral, never a church? Then the sincere beat: do we care about Neleh? Then the dial-tone rest.
7. **The Addendum under Mario, cut by "no.", and the landing on "How much?"** Sold, or a comic button? The bible's rule 1 forbids comic scoring; if it reads as a button, drop the landing and let the Lighthouse run on.
8. **Tasya's floor under the statement.** The Emaj9 at the sentence break should be a colour shift, not a swell on the names.
9. **The hang, the spinner, the REVERSAL and the felt F4 into S5's pedal.**

### Re-run

```bash
cd /home/jgon/project/art/mrmas
OST_WORKERS=2 ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_render.py   # all three (or: s1 s2 s3s4): about 3.5 min once a slot is free
audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_qa.py                                 # light: QA, duck map, cue sheet, preview (~1 min)
```

`python s1-s4_s1_noon.py` (or either of the other two) builds that score and prints its size without rendering. The whole render set is about 227 MB.

### Open issues

- **The mix isn't built here.** The v5 mixer should lay the three underscore files (or their stems) at the frames above and apply `s1-s4_duckmap.json`. The map covers act 0 → 7100; S5's composer has its own map from 6985.
- **The SFX pitches I scored against are the bible's, not checked against the files:** `rubber_stamp_C`, `bell_ding_F6`, `keycap_popcorn` F5–C7, `landing_thunk` C/F. OST-BIBLE §6.8's request 1 still stands: tune the four DTMF dial tones to F4 E♭4 D♭4 C4, so that in the rest the phone plays step four.
- **The pixel pass may move the walk-offs.** If it does, change `WALK` in `s1-s4_s1_noon.py`; the waltz and the 4/4's return move with it, and the assert names the frames to re-check.
- **The GU choir, reed organ and Rhodes are GM SoundFont voices,** which can sound dated (engine §22). They're ppp here and must be auditioned.

## S5–S8: his side at 2 AM, the avalanche, the return, the lobby and the coda

**What this is (2026-09-27).** The continuous to-picture score for act frames 6985 → 12443 of Act Four v5, plus a ring of about 4 s into the tag. It's written to the exact frames of the locked stick timeline `show/reel/ep01-act4-v5.json` and its takes `audio/ep01/act4/dialogue/lines-v5.json`, which are read at build time. There are three cues. S5 and S6 are one continuous performance each, and S7 and S8 run as one relay, as MM-11 does. They're rendered by the OST engine from the batch-1 material (MM-10 and MM-11, imported read-only). The v4 re-lays in `tracks/e01-act4-v4/` were the starting point and weren't touched. **Nothing was heard.** Every number here is measured; the full lists are in `s5-s8_cue-sheet.md` and `s5-s8_qa.json`.

| Cue (`render/<id>-underscore.wav`) | Lay file t = 0 on | Picture out | Underscore | What it is |
|---|---|---|---|---|
| `s5-s8_s5-two-am` · S5, DARK ROOM (MM-10 a) | act 6985 (17:22:01) | 9001; the pedal rings 1.25 s across it | −20.0 LUFS, −3.6 dBTP | **One F/C pedal**: cello F3 and viola C4, sul tasto. Nothing goes below C3, because the room drone is F1 + C2 (P01; MM-08's 26A does the same). On top of the pedal: (1) the felt C4 for the Orb exchange, held through "mostly."; (2) the Build with Gerg in compile passes (4, 8, 12, 8, 4), out under Mas's lines; (3) the upright-bass pulse (C3/F3, F C F –) under the letter, tightening to 745, out for `ALYI (REPORTED)` and the chime, back on "He did both." under the check; (4) the Build again with his keys, cut dead by his look (the **ring-out**: the pedal holds); (5) Tasya's Rhodes, A♭maj9 on the door (the title's F9sus4 over the pedal) and Cmaj9 on "desk", gone before "leave it open." |
| `s5-s8_s6-avalanche` · S6, SET-PIECE SWING (MM-10 b), the one full band | act 9001 (18:46:01) | **dead stop at 9341**; digital zero to 9376 | −16.0 LUFS (featured), −3.2 dBTP | MM-10's own avalanche bars at **exactly 96 BPM**, with no time-scale (v4 needed 96.9). S6.01 → the label is 340 frames, 22⅔ beats, so the label falls exactly on the swung "and" of beat 3, bar 6. The bars: A1, A4, A6 (Alyi resists), A7 (Neleh's window), A8's F pedal (it ends silently on THE QUIET VOTE), A9 (the Water Line augmented), A13 (the full band, 2⅔ beats), then the stop on `MADA · LAST FIRER STANDING`. |
| `s5-s8_s7s8-the-return` · S7 + S8, MM-11 relay → the vault's F | act 9376 (19:01:16) | 12443, + ~4 s into the tag | −20.0 LUFS, −3.2 dBTP | In order: (1) the STRAIGHT violin under Alyi's post; its G3 held and decaying under the hearts and the exchange (no stop); (2) Tasya's floor, pre-lapping as a bare A♭ fifth (the violin's G is its maj7), with a chord on each of below / above / around, the Rhodes bloom, and home under the rail; (3) LEVERAGE fading in under Mada, the bang inside it, thinned to its F pedal under the reading and the terms, then a **dead stop** on "of what?"; (4) the stamp's C pedal under both posts, one pizz grain on the hourglass's last grain, and a rest on the sand; (5) the Build's pickup, ONE brass stab on the sign, the Build's bar, one chip note, the 1993 flat line F F F, the bonk; (6) the lobby's quiet on the neon's F, then the felt after "okay."; (7) the vault's F: a glass pedal F3/C4 matched to the hum's fan tones, with the Ache under the (REPORTED) Q\* rail, then the pedal alone under the memo, ringing into the tag. |

Lay each file at 0 dB against its master and apply `s5-s8_ducking-map.json` to the music bus on top. The two duck maps overlap at 6985–7100: each map belongs to its own files, and on a single music bus take the lower of the two curves (their keys there agree). The album masters are for the soundtrack only.

**Stops.** Two dead stops, each with room tone under it and a clear re-entry:
- MADA's label, act 9341 → the violin at 9400 (2.45 s);
- "of what?", 10995 → the stamp's C pedal at 11167 (7.2 s: Mada's pause, both "good question"s, the long hold).

One ring-out: Gerg's look at 8500.

Two designed rests:
- the sand's beat, 11431 → 11443;
- the lobby CU and "okay." on the neon's F, 11590 → 11682. The CU is "silent like the first", and nothing plays under "okay.".

The act's one designed digital silence, D6 after the Cancel click, is S1–S4's.

**The ducking map** (`s5-s8_ducking-map.json`, from `s5-s8_ducking.py`): 60 keys, covering every placed take and every silent post or record text from 6985 to the act end. It's a gain curve in act frames (103 breakpoints). The shape: pre-duck 250 ms, attack 200 ms, release 600 ms, held across gaps under 2.5 s. The depths:
- a line: −9
- a line over a pedal: −6.5
- the record: −8 (−6.5 on a pedal)
- Neleh in the avalanche: −6
- a line over the violin's decay: −5
- a post: −3
- Alyi's post: −2

The thinning itself is composed into the cues: no melodic onset falls inside a quoted real line (measured: 0). `render/s5-s8_chain-ducked-preview.mp3` has the three masters laid on the act clock and ducked by the map, with act 6985 at t = 0. It's an audition aid only, not a mix.

**QA, measured (render 3):**
- **F-major check:** written OK and spectral OK in all three cues.
- **Rule 12 and rule 4:** written thirds 0, knee completions 0, whole knees 0.
- **Stems and stops:** stems sum to the masters at −160 to −169 dB; the hard stops read −104 and −110 dBFS.
- **Loudness:** short-term p95 −18.1, −14.7 (featured) and −17.1.
- **Holes:** on the act clock (off below −60 dBFS, 50 ms windows) there are 4 music runs and 4 off-windows of 0.3 s or more, every one designed. No run is shorter than 2 s.
- **Engine warnings:** the only ones left are six marker onsets that the detector can't pin within 10 ms. All are soft attacks: the pulse's first note, the Rhodes chords, the LEVERAGE fade-in, the grain.

**What changed between renders, and why (all measured):**
- **Render 1 → 2.** The S5 chip A♭4's 16th-rate AM sideband near 429 Hz read as A over a weak F. The Build's track went −2 dB and the F pedal's velocity 0.21 → 0.25.
- **Render 1 → 2.** A pizz body resonance at 111–112 Hz sat under LEVERAGE. It's now notched on the viola pizz and on MM-11's cello-pizz track.
- **Render 1 → 2.** The floor's 11 s pre-lap note outlasted its samples, falling to −55 dBFS before "below". It's now re-bowed.
- **Render 1 → 2.** The solo violin's C4 sample swells slowly (−19.7 dB in its first 0.3 s), so the Door's D♭4 and C4 sat 8–12 dB low. They now start 0.8 s into the sample.
- **Render 1 → 2.** On the solo contrabass, an F2 is equidistant from the E and F♯ samples, and the sampler picks one per stroke at random, so LEVERAGE's pedal jumped about 6 dB between strokes. It now plays on the cello section, where one sample is nearest.
- **Render 1 → 2.** The Ache under the Q\* rail lifted the bus 8 dB, so it's down about 7 dB. The coda pedal is up about 4 dB.
- **Render 2 → 3.** Each re-bow faded in over its sample's own bow attack, a +2–3 dB swell every 5 s. Later strokes now start 0.8 s into the sample.
- **Render 2 → 3.** LEVERAGE is ridden −1.5 dB (MM-11's own ride) and the floor's bloom −1 dB, bringing S7–S8's p95 from −16.7 to −17.1.

**Re-run** from this folder. The render goes through `ops/heavy.sh` as one job with `OST_WORKERS=2`, and takes about 1.5 min once it has a slot.

```bash
cd audio/ost/tracks/e01-act4-v5
../../../.venv-theme/bin/python s5-s8_render.py --dry          # note-level QA only (light)
OST_WORKERS=2 nohup ../../../../ops/heavy.sh ../../../.venv-theme/bin/python s5-s8_render.py > /tmp/s5s8.log 2>&1 &
../../../.venv-theme/bin/python s5-s8_ducking.py               # the ducking map (light)
../../../.venv-theme/bin/python s5-s8_qa.py                    # the act-clock QA + the ducked preview
../../../.venv-theme/bin/python s5-s8_cuesheet.py              # s5-s8_cue-sheet.md / .json
```

`s5-s8_render.py s6` renders one cue. A re-timed stick timeline re-spots all three cues on a re-run. Four marks have no stick event of their own: the hourglass's last grain and the three greying steps of Cancel. Those come from the pixel pass's `shots-locked-v5.json`, with fallbacks; re-run if the pixel pass moves them.

**What a human must hear** (none of this can be judged from numbers):
1. Whether S5's pedal reads as air under 84 s of talk, never as a drone effect, and whether the Build under Gerg's (invented) lines reads as his keyboard and not as a melody on his words.
2. The avalanche out of the pedal with no pickup. Its phrase-1 brass kick lands 3 frames before the cut to Mas (S6.02); keeping 96 BPM exact matters more than that cut. The stop on the swung "and" should get the laugh, never sound like a glitch.
3. The violin's long decay: sincere, not "world's smallest violin", and still there on the IOU beat.
4. LEVERAGE's pedal on the cello section instead of MM-11's contrabass, and the 7.2 s stop from "of what?".
5. The lobby's 3.8 s rest on the neon's F: designed, or a hole?
6. The Ache under the Q\* rail: dread, not a sting. And the glass pedal against the SFX vault hum: `server_hum` is F2 plus F3/C4 fans, and the pedal is on F3/C4, so they should fuse.

**Files:**
- `s5-s8_common.py`: the clock and the helpers.
- `s5-s8_s5_two_am.py`, `s5-s8_s6_avalanche.py`, `s5-s8_s7s8_the_return.py`: the three scores; each docstring is its frame-by-frame spotting table.
- `s5-s8_render.py`, `s5-s8_ducking.py`, `s5-s8_qa.py`, `s5-s8_cuesheet.py`: the tools, and their outputs beside them.
- In `render/`: `<id>-underscore.wav` / `-album.wav` (+ mp3), `stems/<id>-<family>.flac`, `<id>.mid`, `<id>-pianoroll.png`, `<id>.cue.json`, `<id>.act-log.json` (every sync point in act frames).
