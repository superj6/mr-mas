# MM-10 · His Side / 745

**Composer D** (batch 1); **fix pass 1 by composer B, 2026-09-26**; fix 2b re-render by the engine owner, 2026-09-26. Scored to picture for `E01-S29a` and `E01-S29b` (OST-BIBLE §5.D1).
The palette moves from **P01 DARK ROOM** into **P11 SET-PIECE SWING**. Nobody has listened to this cue; every choice below was set by measurement.

His version of the five days has almost no music. Then the company falls into his lap as a swung avalanche, and it stops dead on the one man who will not move.

## Fix 2b (2026-09-26): re-rendered on the retuned engine

- **No note, timing or level was changed.** The picture version (underscore, stems) and the album edit were re-rendered because the engine's fix-2b tuning moves two audible notes by more than 10 cents. The fix-1 master MP3s (and the AUDITION mix) are in `render/_pre-fix2b/`.
- **What moved:** the pressing strings tremolo at 88.75 s (album edit 83.1 s). Its cello E3 sounded 33 cents sharp (its sample's old automatic correction pointed 25 cents the wrong way) and its cello B♭3 25 cents sharp (a sharp sample that was never corrected); both are now in tune. The viola tremolo moves 1 cent and the trumpet stabs up to 7 cents.
- **Measured:** picture and album edit have no warnings. Masters −14.0 (album edit) / −16.0 (underscore) LUFS-I, −1.15 / −3.15 dBTP; p95 −14.1. F-major passes (picture worst sieved 0.22, explained; album edit 0.035). Markers: picture 10, worst 9.3 ms; album edit 14, worst 13.0 ms (the known held chord). Stems sum at −163.8 dB.
- The AUDITION mp3 was not rebuilt; it has the old tremolo tuning.

## Fix pass 1 (2026-09-26): what changed

- **The album master is now an ALBUM EDIT** (`render/mm10-his-side-745-album.wav/.mp3`, 1:31.9, −14.0 LUFS-I). The picture version was 54 % silence (the record plays dry), which is right under picture and wrong on an album. The edit is described below; its own cue sheet, MIDI and piano roll are `render/mm10-his-side-745-album-edit.*`.
- **The picture version is unchanged** and is still the **underscore master and the stems** (lock v2 timing: act 5925 at file 0; checked note for note, mute for mute, against batch 1). It was **not** re-timed to the Act Four lock v3; that pass owns timing.
- **Re-rendered on the fixed engine** (the corrected meter, the pizz tuning, the new render pool, the QA checks 5a–5d). The walking bass's contrabass pizz layer and the strings' pizz now play tuned samples. The batch-1 master MP3s are in `render/_pre-fix1/`.
- **The engine's false p95 warning is gone:** the fixed meter reads −14.1, as this README said. The picture cue sheet has **no warnings**.
- `render/…-AUDITION-with-scratch-vo-and-freeze-hit.mp3` was made by composer D from the batch-1 render and was not rebuilt (the timing is the same; the pizz tuning is not in it).
- **How to rebuild:** `python track.py` renders the picture (underscore, stems, MIDI, cue sheet), then the album edit, then moves the edit's album master onto `mm10-his-side-745-album.wav` and writes both cue sheets. `--album-edit-only` re-renders the edit alone. **`build.py mm10-his-side-745` renders the picture score only**, and would put a picture-timed album master back (it prints a note saying so).

## The album edit (`mm10-his-side-745-album-edit`)

Built from the cue's own code: the avalanche's phrases are the same functions on the edit's own 96 grid (a 1-beat pickup; bar 1 = 0.625 s; `A(k)` moves A1 to bar 10).

| Bars | Time (s) | What |
|---|---|---|
| 1 | 0.6 | His felt: the Water Line bar 1, pp |
| 2 | 3.1 | **His version:** the KEYNOTE bar of MM-02's D5 insert (the same notes, a shade softer), **cut dead mid-note** on bar 3. On picture this bar belongs to MM-02; the album tells the scene. |
| 3 | 5.6 | One bar of silence (the real post) |
| 4 | 8.1 | One felt C4: the settle never comes |
| 5–6 | 10.6–13.1 | The counter's Build cell, stopped dead on the clunk; a bar of silence (the letter card) |
| 7.4–9 | 17.5–20.6 | The compile passes (4, then 8 + 4 cut), stopped dead; a bar of silence (the quiet beat, the door) |
| 10–21 | 23.1–53.1 | **The avalanche, A1–A12, exactly as in picture**: the compile, Step Four (Alyi resists, Neleh's window, the blank crushed), the Water Line augmented and its settle |
| 22–25 | 53.1–63.1 | **Chorus 2 · the stack:** the compile at full from the first bar, and **Step Four pressing down over it** in the muted horn and bassoon (F4 E♭4 D♭4 over F minor, F minor 9 and D♭maj7♯11; the fourth bar is its blank). A brass hit ends it. |
| 26–29 | 63.1–73.1 | **Chorus 2 · the board presses:** phrase 2's chorale again, nobody resisting, the Build at full over it, the blank crushed again (two brass hits and the timpani) |
| 30–33 | 73.1–83.1 | **Chorus 2 · 745 faces:** the Water Line in its own time, twice, in the violins in octaves with the chip triangle and the square on the nudge, over the swung Build; the second settle is held into the band |
| 34–36 | 83.1–90.6 | **The one full band**, 3 bars (the cue's own `CARD_BAR=39` alternate), level, with Mada's spinner and the timpani roll |
| 37 | 90.6 | **Everything stops dead.** The file ends 1.25 s later. |

- **The level arc** (LUFS-I on the album master): intro −18.3; A1–4 −14.9; A5–8 −14.1; A9–12 −13.7; the stack −13.2; the board −13.5; 745 faces −13.9; **the band −12.8, the peak**.
- **Checks:** no warnings. Written third none; F-major spectral OK (worst 0.037); whole knee 0; knee completion 0; WATER_LINE, BUILD, STEP_FOUR and MADA_SPINNER found; 14 markers, worst 13 ms (Alyi's beat; the edit is not laid to picture, so its markers are checked at ±15 ms). Balance 26 · 30 · 18 · 26; 2–6 kHz −16.9 dB.
- It has no underscore master and no stems: the picture version is the underscore master.

## Picture sync

- The cue follows **Ep1 Act Four timing lock v2** (`show/episodes/ep01/production/act4/shots-locked-v2.json`).
  - **File start** (t = 0) is act frame **5925**: episode 16:37:21, shot 29.00 f0.
  - **File end** is act 8295 (18:16:15), where sc 30 and composer E's MM-11 begin.
  - To convert: **act frame = 5925 + 24·t**.
- **Length is 98.75 s**, not the bible's 92 s. The lock runs 6.42 s longer than the printed 16:28–18:00.
- **Grid:** 96 BPM.
  - One pickup beat puts bar 1 on the act's bar line at 5940.
  - **Bar 22 is 5/4.** The lock's 29.12 shot is 2 bars + 1 beat long, so the avalanche lands on its own downbeats. The 5/4 bar sits inside the silence, so nobody hears it.
- **Avalanche bars** A1–A16 are cue bars 24–39.

## Palette

| | Instruments |
|---|---|
| **Form a** | Felt upright (the Water Line) and a 25 % chip pulse (the Build, straight), with xylophone doubling at Gerg's tile. Nothing else. |
| **Form b** | Chip lead (the Build, **16ths swung 0.7** over the swung-eighth ride); walking upright + contrabass pizz; jazz kit ride and sticks; grand comping; low strings, bassoon and muted horn (Step Four); violins in octaves with a chip triangle (the Water Line); timpani; xylophone. **The episode's one full band** plays in phrase 4 only: 3 trumpets, 3 trombones, alto, tenor and bari. |

## Motifs

All from OST-BIBLE §2, note for note:
- **The Water Line.** Bar 1 on the felt under the first V.O. Its bar-2 **C4 alone** under the second V.O., so the settle never comes in his account. Then the whole line **augmented** in the avalanche, where **the settle finally arrives**: the held high F at A11.3.
- **The Build.** A straight chip cell under the counter. Gerg's compile passes, 4 then 8 notes. Then the swung chip lead compiling 4 → 8 → 12 → 16.
- **Step Four**, stated twice, with **Alyi's held beat** and **the blank crushed**.
- **Mada's spinner**, C5–D♭5.

Checks: `find_motif` finds WATER_LINE, BUILD, STEP_FOUR and MADA_SPINNER. The whole knee appears 0 times.

## Form

| t (s) | Act / TC | Picture | Music |
|---|---|---|---|
| 0–2.5 | 5925 · 16:37:21 | Home shot | Nothing of D's; composer C's 09x felt F4 rings in |
| 3.125–5.625 | 6000 · 16:41:00 | V.O. "i put the phone down." | Felt: the Water Line bar 1, pp |
| **5.625** | 6060 · 16:43:12 | [MAS'S VERSION] | **Hard stop.** The bar is **empty for composer E's MM-02**; digital silence runs through Rima's post, the 8 Ticks and the clearance bar |
| 15.625 | 6300 · 16:53:12 | V.O. "the badge was a joke." | **One felt C4.** It is out before "mostly." |
| 21.25–**23.125** | 6435–6480 · 17:01:00 | The counter, 505 → 745 | The Build's first cell (chip). It **stops dead on the clunk** |
| 23.1–40.6 | → 6900 | Quote card, ALYI (REPORTED), the Orb's chime, the check | **Dry** (the record) |
| 42.5 | 6945 · 17:20:09 | Gerg: "Compiling." | Compile pass 1: 4 notes, chip + xylo, then a dead stop. Mas's line lands dry |
| 46.25 → **48.125** | 7035 → 7080 | "The company. Again. Just in case." | Pass 2 (8 notes). Pass 3 is **cut dead on the cut into the quiet beat** |
| 48.1–58.75 | → 7335 | Quiet beat, D8 V.O., the door, Tasya, "leave it open." | **No music** (4.25 bars of room) |
| **58.75** | 7335 · 17:36:15 | **A1: the avalanche** | Timpani F + the swung chip compile (4 → 8 → 12 → 16); ride from A1, bass from A2, low strings and piano from A3; a brass hit at A4.4 (68.125) |
| 68.75 | 7575 · 17:46:15 | A5: the stack presses the board | Step Four (half notes) under the chip |
| **72.5** | 7665 · 17:50:09 | **Alyi's tile resists** | **The engine stops for one beat.** The G♭ chord gives, then pushes back (timpani, pizz, spiccato) |
| 73.75–76.25 | 7695–7755 | **Neleh's line** ("Has anyone read the char—") | Dialogue window: no lead; the chorale pp, shoved a swung eighth early |
| 77.5 | 7785 · 17:55:09 | A8, step four | **The blank crushed**: the Build plus two brass hits |
| 78.75 | 7815 · 17:56:15 | A9: the QUIET VOTE | The Water Line augmented (violins in 8ves, chip triangle, the square on the nudge at 82.5). **At 80.0 the board's bowed F pedal drops out silently** (no hit) |
| **85.0** | 7965 · 18:02:21 | 745 faces, one gap | **The settle: a held high F**. A12 (86.25) thins to the Build + that F |
| **88.75** | 8055 · 18:06:15 | A13: Mada wedged | **The full band** on C7(♯9♭13), 2 bars. Tremolo strings and a timpani roll press at a held level (no ramp); Mada's spinner in celesta + chip |
| **93.75** | 8175 · 18:11:15 | **The MADA card** | **Everything stops dead** (tails cut); `freeze_hit_F` owns the downbeat |
| 93.75–98.75 | → 8295 | The card; the room | Digital silence |

**Switches** at the top of `track.py`, each a one-line re-render:

| Switch | Default | Alternative |
|---|---|---|
| `CARD_BAR` | 38 | 37 or 39: the card-stop alternates A14 or A16 |
| `BUILD_STOP` | `'quiet'`: stop on the cut into the quiet beat, as the script says | `'glance'`: pass 3 finishes exactly on Gerg's glance, act 7110 |
| `STRICT_CARD_CLEAR` | `False` | `True`: no Build under the counter (see the weaknesses below) |

## Measured (final render)

| Measure | Result | Target |
|---|---|---|
| Album (now the album edit, above) | −14.0 LUFS · −1.15 dBTP | −14.0 LUFS |
| Underscore (featured) | −16.0 LUFS · −3.15 dBTP | −16 LUFS |
| Phrase loudness (integrated) | b1 −16.2 · b2 −15.3 · b3 −15.3 · b4 −14.2 | Rising arc; the peak is phrase 4 |
| Short-term (the engine's fixed meter) | p95 −14.1 | ≤ −13 |
| Momentary max | −12.4 | ≤ −11 |
| V.O. windows | −22.7 and −24.2 LUFS | −24 ±2 |
| Music vs scratch V.O., 1–4 kHz | 22.8 and 20.0 dB below | ≥ 10 dB below |
| Balance, form b (theme method) | ≈ 13 · 35 · 27 · 26 | 15 · 35 · 25 · 25 |
| Balance, whole cue | 15 · 32 · 26 · 26 | — |
| Silence windows | All pass. The real post, the quote card and REPORTED sit under −90 to −240 dBFS; "mostly." at −80 | — |
| Hard stops | −240 dBFS | — |
| Markers | All 14 within ±10 ms | ±10 ms |
| Written third (every note boundary) · F-major spectral | none · passes (worst sieved A/F 0.22, explained) | — |
| Whole knee · knee completion (pitch class) | 0 · 0 | 0 |
| Stems | Sum to the underscore at −163.8 dB | — |

**About batch 1's p95 warning.** The batch-1 build reported −10.6 LUFS because `engine/mix.short_term_lufs` filtered across the channels. Engine fix 1 corrected it; the −14.1 above is now the engine's own reading.

## Files (`render/`)

- `mm10-his-side-745-album.wav/.mp3`: **the album edit** (fix 1); `-underscore.wav/.mp3`: the picture version
- `mm10-his-side-745-album-edit.cue.json`, `.mid`, `-pianoroll.png`: the album edit's own sheet, score and roll
- `stems/`: piano, strings, winds, brass, bass, drums, perc and chip, as FLAC
- `.mid`, `-pianoroll.png` and `.cue.json` (markers, silence and V.O. windows, SFX slots, audition)
- **`-AUDITION-with-scratch-vo-and-freeze-hit.mp3`** has the animatic's scratch V.O. and `freeze_hit_F` laid in at their lock positions. It is for listening only, never delivery.

## Audition (priority order)

1. **58.75 s.** Does the avalanche **erupt** out of the door beat's 10.6 s of silence, or whimper? Its first bar is deliberately sparse: timpani F and 4 chip notes.
2. **93.75 s**, with `freeze_hit_F` (use the AUDITION mp3). Does the dead stop get the laugh (the stat is the joke), or sound like a playback glitch?
3. **88.75–93.75 s.** Is the one full band **earned**? It must press at a level, not ramp into the card.
4. **58.75–68.75 s.** The chip lead's 16ths are swung 0.7 over a triplet-swung ride. Is that a double-time shuffle, or two swings fighting? **Any Nintendo-overworld feel is a fail.**
5. **78.75–88.75 s.** Does his calm line read inside the avalanche? Is the high F at 85.0 s the settle at last?
6. **2.5–5.6 s.** The felt under "i put the phone down."; then the cut to E's keynote bar at 5.625 s.
7. **72.5 s.** Does Alyi's held beat read as resistance, or as a dropout?
8. **The album edit, whole (fix 1).** Does it play as a piece? In particular: the intro's 1-bar rests and dead stops without picture; the borrowed keynote bar; chorus 2 as momentum rather than a repeat; three bars of band instead of two; the dead stop as the album ending.

## Weaknesses and open points

- **The quote-card clearance is 2 beats, not the full bar rule 10 asks for.** The lock puts the counter's clunk 2 beats before the letter card. D follows the bible's form-a call (the Build stops on the clunk), so the music clears the card by 2 beats. `STRICT_CARD_CLEAR=True` gives a full dry bar instead; the supervisor to rule.
- **"The Build stops when he looks up" versus "no music in the quiet beat".** The bible table says both. D follows the script, so the Build stops on the cut into the quiet beat, 2 beats before the glance. `BUILD_STOP='glance'` is the other reading.
- **The QUIET VOTE.** The bible drops one layer silently; the shot list's SFX note says "duck everything 1 beat". Both can happen, but the mixer should know.
- **Neleh's window** (73.75–76.25 s) could not be checked against her recording, because the sc 29 on-mic lines were being re-recorded while this was built. Run `voice_check.py` against the new takes. The same goes for Gerg's and Mas's on-mic lines in form a.
- **The sampled full band** (VSCO brass + GM saxes) on one sustained chord for 5 s may sound synthetic. Listen for it.
- **The 16th swing** of the chip lead (0.7) is a composer's guess. If it fights the ride, try 0.4.
- **The album edit's chorus 2 is new writing** from the cue's material (the stack's Step Four counter, the board's second chorale, the Water Line in its own time). It is the part of the edit most in need of ears.
