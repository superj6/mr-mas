# MR. MAS OST engine

This is the music engine for the show's original soundtrack. It is a generalised copy of `audio/theme/engine/`, the engine behind the LOCKED main title *The Knee*. The original stays untouched: nothing here imports it or writes into `audio/theme/`.

The theme engine could only make one thing: a 30-second, 96 BPM, 720-frame cue. This engine renders cues of any tempo, meter and length. It adds:

- tempo ramps, meter changes and swing;
- seamless loop files;
- ten family stems;
- two masters (album and underscore);
- MP3 previews, a MIDI file with the tempo map, and a cue sheet per track;
- composer tools:
  - voicings, patterns, a humanizer and dynamics;
  - articulations and a drum DSL;
  - textures, a tape era filter and in-world speakers;
  - the leitmotif tables;
  - the OST-BIBLE's QA checks.

**How the rules are split.** Usage rules (which tone, which motif, which palette) live in [`../OST-BIBLE.md`](../OST-BIBLE.md). This file documents the tools. Where the bible binds a tool, this file says so, and the engine's defaults follow the bible.

**Contents:** [1. Quick start](#1-quick-start) · [2. House rules](#2-house-rules-binding) · [3. Time](#3-time-grid) · [4. Notes](#4-writing-notes-arr) · [5. Instruments](#5-instruments-palette-tracks-families) · [6. Harmony](#6-harmony-harmony) · [7. Patterns](#7-patterns-patterns) · [8. Dynamics](#8-dynamics-dynamics) · [9. Humanizer](#9-humanizer-humanize) · [10. Articulations](#10-articulations-articulations-as-art) · [11. Drums](#11-drum-dsl-drums) · [12. Textures](#12-glyph--dread-textures-texture) · [13. Era filters](#13-era-filters-and-in-world-speakers-era) · [14. Motifs](#14-motifs-motifs) · [15. Score and render](#15-score-and-rendering-render) · [16. Loops](#16-loops) · [17. Export](#17-export-masters-stems-files-export) · [18. Cue sheet](#18-cue-sheet-idcuejson) · [19. QA](#19-qa-without-ears-analysis-ost-bible-69) · [20. Porting theme code](#20-porting-theme-code) · [21. The demo](#21-the-demo-tracks_demo) · [22. Performance, disk, limits](#22-performance-disk-known-limits)

---

## 1. Quick start

```bash
cd audio/ost
cp -r tracks/_template tracks/mm07-how-to-fire-a-ceo           # ids: mm##-<slug> or e<ep>-s<scene>-<slug> (OST-BIBLE s6.3)
$EDITOR tracks/mm07-how-to-fire-a-ceo/track.py                  # set META, write build()
../.venv-theme/bin/python build.py mm07-how-to-fire-a-ceo --no-stems --no-loop    # a fast draft
../.venv-theme/bin/python build.py mm07-how-to-fire-a-ceo --verify-loop           # a final: every check
```

- **A track** is one `track.py` with a `META` dict and a `build()` that returns a `Score`.
- **The template,** `tracks/_template/track.py`, is runnable and lists every META field.
- **Outputs** land in `tracks/<id>/render/` ([section 17](#17-export-masters-stems-files-export)).
- **`build.py` with no ids** builds every folder that doesn't start with `_`, and refreshes `ost/ost-index.json`.

```python
from engine import *                                   # everything below is exported here

g = Grid(bpm=96, bars=8, swing=1.0)                    # the house tempo and swing
a = Arr(g)
prog = progression(g, [(1, 'Fm(add9)'), (3, 'Dbmaj7'), (5, 'Bbm9'), (7, 'C7sus(b9)')])
comp(a, 'felt', prog, style='charleston', kind='rootless_a')
walking_bass(a, 'ubass', prog, bars=(1, 9), layer='cb_pizz')
Drums(a, 'brushes').play('sweep: ~~~~~~~~\ntap: ..x...x.\nkick: o...o...', bars=(1, 9))
place_motif(a, 'felt', 'WATER_LINE', (5, 1), vel=0.5)
sc = Score('mm01', g, palette(), a.notes, loop=g.span(1, 9), markers=a.markers, meta=META)
```

## 2. House rules (binding)

These come from the showrunner's notes and the OST-BIBLE.

- **The blend:** between PIANO, ORCHESTRAL and BIG BAND. Big-band brass is for accents, not the engine.
- **Jazz feel.**
- **Chip motifs:** 8-bit chip motifs as the show's identity.
- **"A full OST with different tracks for different tones."** The OST-BIBLE lists the palettes, the tracks and the rules against repetition.
- **Nothing corny:**
  - no sad-trombone falls on punchlines, and no mickey-mousing;
  - no heartbeat pulses;
  - no data bleeps, glitch stutters, vocoders or "evil AI" growls;
  - no Ligeti or *2001* clusters.
- **Tempo:** the house tempo is **96 BPM** (1 bar is 60 frames, 2.5 s).
  - **The 24 rule:** a to-picture cue uses a multiple of 24 BPM in n/4 time, with n = BPM ÷ 24.
  - Library cues may use any tempo, locked to frames with `frame_lock_bpm()`.
- **Swing:** the house swing is `swing=1.0`, which puts the swung eighth at +10 frames at 96 BPM. Mas and the people swing. The machine, the board, the record and THE PLAN play **straight**, with 0 ms of humanisation.
- **The knee:** never whole inside an episode. Use its fragments, at most one per scene ([section 14](#14-motifs-motifs)).
- **Diegetic source only.** The 808 and trap kits (`kit808`, `clap808`, `h808`, `sn808`, `rim808`) and the gong are for in-world source music, played through an in-world speaker (`era.futz`). A clean pitched sub (`k808`, `sub`) is fine.
- **Tape:** tape wow is never Mas's own recollection. The tape presets are for real recordings on screen and for light T2 colour.
- **One owner per sound:** the SFX own the GLYPH grains (G6–F7), the KA-CHING (F6 + C7), the Orb's chime and the F6 bells. The score leaves them room.

## 3. Time (`grid`)

Every `Note` time is in **seconds**. `Grid` turns bars, beats and 24 fps frames into seconds.

```python
g = Grid(bpm=96, meter='4/4', bars=24, swing=1.0, swing_unit=0.5,
         meters=[(9, '3/4'), (10, '4/4')],                     # meter changes by bar
         tempo=[(13, 96), (17, 120, 'ramp'), (21, 72)],         # hold 96 to bar 13, ramp to 120 by bar 17, step to 72 at 21
         beat_unit=1.0, pickup=0)
```

**Constructor arguments:**

| Argument | Meaning |
|---|---|
| `bpm` | Beats per minute in quarter notes, or in `beat_unit` quarters (`beat_unit=1.5`: dotted quarters, for 6/8 and 12/8). |
| `tempo` | A list of `(pos, bpm[, 'ramp'])`. `'ramp'` ramps **into** that point, linearly in beats. Without it, the tempo steps at that point. `pos` is a bar or `(bar, beat)`. |
| `meters` | A list of `(bar, 'n/d')`. Beats count in the denominator unit. |
| `swing` | 0 is straight, 1 is triplet (the house swing), 1.5 is 3:1. `swing_unit=0.5` swings eighths; `0.25` swings sixteenths. |
| `pickup` | The number of meter beats the file holds before bar 1. They sit in bar 0. |

**Methods.** Bars and beats are 1-based and may be fractional.

| Method | Returns |
|---|---|
| `g.t(bar, beat)` | Seconds, straight. |
| `g.s(bar, beat)` | Seconds, **swung**. |
| `g.f(bar, beat)` / `g.fr(bar, beat)` | The 24 fps frame, as a float or rounded to an int. |
| `g.at(pos)` | Any position, in seconds: seconds, `(bar, beat)`, `(bar, beat, 'sw')`, `'f123'` or `'5:2.5'`. |
| `g.dur(d, at)` | A duration: seconds, `'2b'`, `'1.5q'`, `'2bar'`, `'12f'`, `'0.5s'`, `'1/8'`, `'1/4d'` or `'1/8t'`. It is measured from `at`, so ramps are honoured. |
| `g.pos(sec)` / `g.label(sec)` | Seconds back to `(bar, beat)`, or to `'bar:beat'`. |
| `g.span(b0, b1)` | `(t0, t1)` for bars [b0, b1). |
| `g.bar_s(bar)`, `g.beats_s(n, at)` | The length of a bar, or of n beats, in seconds. |
| `g.bpm_at(sec)`, `g.meter_of(bar)`, `g.steps(b0, b1, step_q, swung)` | Tempo, meter and grid-point lookups. |
| `g.tq(q)` / `g.qt(sec)` | Quarter position to seconds, and back (exact inverses). |
| `g.describe()` | The tempo and meter maps as JSON (this goes into the cue sheet). |

`frame_lock_bpm(bpm, beats)` gives the tempo nearest `bpm` at which `beats` beats last a whole number of frames. For example, 84 BPM becomes 84.0876, and 16 beats then last exactly 274 frames.

## 4. Writing notes (`Arr`)

```python
a = Arr(g)
a.n('felt', 'F4', (1, 1), '1b', 0.5)                        # inst, pitch, position, duration, velocity, lock=False, **x
a.ch('felt', ['Ab3', 'C4', 'Eb4'], (1, 2.5, 'sw'), '1/8', 0.4, roll=0.008)
a.seq('vc', [('F2', (1, 1), '2b'), ('C3', (1, 3), '2b', 0.6)])
a.line('lead', 'F5/8 F5/8 G5/4. r/8 C6/2^', (5, 1), vel=0.55, swing=True, duty=0.25)   # swing=True | amount
a.mark('door slam', (9, 1))            # a sync point: cue sheet, MIDI marker, onset QA (±10 ms)
a.section('B', 9, 17)
a.copy_bars((1, 5), 9, insts=['felt']); a.transpose(2, insts=['lead']); a.scale_vel(0.8, t0=g.t(9)); a.remove(insts=['arp'])
```

- **Pitch** is a name (`'Ab3'`; C4 = 60) or a MIDI number.
- **`lock=True`** keeps a note off the humanizer's timing. Use it for picture hits and machine voices.
- **`**x`** extras:
  - samples: `art`, `rel`, `att`, `offset`, `env=[(sec, gain)]`, `bend=[(sec, semis)]`, `detune`, `gain`, `lp`, `pan`;
  - chip voices: `duty`, `vib`, `slide`, `att`, `dec`, `sus`, `rel`, `steps`.
- **`line()` tokens** are a pitch or `r` (a rest), then `/denominator`. Add `.` for dotted, `t` for a triplet, `^` for an accent. A `|` is ignored.

## 5. Instruments (`palette`, `Track`, families)

`palette()` returns about 100 fresh `Track`s, so tweak them per cue. Every track routes to one of the **ten stem families**: `piano strings winds brass bass drums perc chip synth fx`.

| Family | Tracks (a `†` marks a keyswitched section, switched per note by `x['art']`) |
|---|---|
| piano | `felt` (the theme's felt upright), `felt_mech`, `upright`, `grand` (Salamander, **CC BY: credit Alexander Holm**), `rhodes` |
| strings | `vln1† vln2† vla† vc† cb†` (sus / leg / trem / pizz / spic), `svln†`, `harp`, and the theme's `vln_pizz`, `vc_trem`, … |
| winds | `fl†` (sus / nv / stac), `cl†` (sus / stac), `bsn`, `reed` (a harmonium, never a church organ) |
| brass | **the big-band horns:** `tpt†` (sus / vib / stab / harmon / straight), `hn†` (sus / stab / mute), `tbn†` (sus / vib / stab / **fall** (real VSCO falls) / short), `tuba†`, `harmon`, **the saxes** (`tsax†`, `tsax_stac`, `asax`, `bsax`), `tpt_stac`, … |
| bass | `ubass`, `cb_pizz` (the real contrabass pizz layer), `sub` (808 sub with glide; also LEVERAGE's pitched thud) |
| drums | `brush`, `jazz`, `swish`, `snare`, `hat`, `k808` (pitched kick), and the **diegetic-only** `kit808`, `h808`, `clap808`, `sn808`, `rim808` |
| perc | `timp`, `bdrum`, `crash`, `suscym`, `cym_swell`, `gong` (**diegetic-only**), `snare_taps`, `glock`, `celesta`, `vibes†` (soft / hard / bowed), `marimba`, `xylo`, `chimes`, `bell`, `claves`, `woodclick`, `cabasa`, `rimshot`, `bdrum_muted`, `clip_perc` |
| chip | `lead`, `lead2`, `arp`, `tri`, `noise`, `beeper`, `sqbass`, `chipkick`, `noisesweep`, and the `snes_*` voices (real samples through the 16-bit sample-chip filter) |
| synth | `drone`, `pad` (polyBLEP; `kind` = warm / glass / hollow), `gupad`, `glasspad`, `tex` (textures) |
| fx | `glyph`, `revswell`, `shimmer`, `riser`, `impact`, `room`, `clip_fx` |

`Track(name, src, stem, gain_db, pan, width, sends={'hall': dB}, hum_ms, offset_ms, vel_jit, drift_ms, rel, post, eq, auto=[(sec, gain)], pedal=[(sec, bool)], cc=[(sec, ctrl, val)], latency_ms, credit, balance)`

- **`src` kinds:** `('ss', set)`, `('art', inst)`, `('sf2', path, bank, preset, drums)` or `('fn', f(note, rng))`.
- **Reverb sends:** `hall stage room plate chamber snes noir dark booth cathedral`.
- **Sustain pedal:** tinysoundfont ignores CC64, so `pedal` is emulated. A released note holds until the pedal comes up.
- **Sample tuning (fix 2, 2026-09-26).** `library.TUNING` holds a **measured** correction, in cents, for every sample of the harp, the clarinet (`cl`, `cl_stac`) and the four pizzicato sets. The sampler transposes by it, so the note sounds at the written pitch; the sample files are untouched.
  - What was wrong: the automatic estimate read the harp's octave and the clarinet's twelfth, so those samples were never corrected; the short sets (pizz, stac) were never fine-tuned at all. The clarinet's `F#5` file is an F (−100 cents), `cl_stac` read 20–45 cents flat below D5, and pizz samples were up to 42 cents off.
  - The harp's soft (`mp`) layer is one G1 sample and its `f` layer is E1, D7 and F7. The harp now has `max_stretch=4`: further than 4 semitones from those samples it plays the `mf` sample instead, at the velocity's level. So the harp is safe at any velocity; the 0.42–0.62 workaround is no longer needed.
  - Re-measure a set with `python -m engine.tuning --sets <name>`. Check every correction with `python -m engine.tuning --verify`: each corrected sample is rendered at its own pitch and at both ends of the range it covers, and its fundamental must be within 5 cents (the worst is 2.8 cents).
  - Ensemble pizzicato is a chorus of players, so each correction carries about ±5 cents of measurement uncertainty.
- **Sample tuning, fix 2b (2026-09-26): the brass and bass shorts, the tremolos and the solo violin.** `library.TUNING` now also corrects every sample of `tuba_stac`, `tpt_stac`, `hn_stac`, `cb_spic`, `vla_trem`, `vc_trem` and `svln` (305 samples). `tuning.TUNED_SETS` lists them, so `--verify` and the tests check them too.
  - **Why a new method.** `harmonic_f0` on a fixed window misread these sets. A brass staccato scoops or cracks through its first 100–200 ms, the contrabass spiccato's bow noise fills its first 100 ms, and a section's partials scatter ±20 cents, so one strong stray partial wins the power-weighted comb. Its worst misreadings: `hn_stac` C1_v1_rr2 +204 c (an 80 ms crack onto D), `cb_spic` E0_v3_rr1 −250 c and `vc_trem` E1_v1 −56 c. All three are within 5 cents in fact.
  - **The method (`tuning.METHOD`).** `vote_f0`: every harmonic votes with its spectrum normalised to its own band, weighted towards the pitch-dominant 2nd–6th harmonics; the harmonics' frequencies are then combined by a Cauchy M-estimate, which is continuous, so a render transposed a few cents reads the same.
    - `'short'` (the four short sets): a frame track over the note's body, each frame weighted by its power and its stability. The slowly moving part of a gliding tone sets its pitch (Gockel, Moore & Carlyon 2001).
    - `'held'` (the tremolos and the violin): one spectrum averaged over the first ~2 s of the sample (weight 1 to 1.0 s, tapering to 0 at 3.0 s), because a held note is heard from the sample's start.
    - The fix-2 sets keep `harmonic_f0` (method `'window'`), so their table and their verify are unchanged.
  - **What it corrects** (the note moves by minus the value):
    - `tuba_stac`: A#0_v2_rr3 is played 95 c flat (an A for a B-flat); F1_v1_rr1 −60 c; the A#1 v1 takes −8 to −56 c; D#1_v2_rr3 +23 c. Below D3 the takes average 8–18 c flat.
    - `tpt_stac`: F2_v2 −31 and −23 c; the rest within −13 to +15 c, most within ±7 c.
    - `cb_spic`: G#1 +15 and +18 c; the rest within ±10 c but F#0_v1_rr1 (−24 c).
    - `hn_stac`: G1_v1_rr2 −59 c; C1_v2 −31 and −17 c.
    - `vc_trem`: B2_v2 +25 c.
    - `svln`: C4_p +23 c, A4_f +15 c, E5_f +13 c.
    - The tremolo and violin sets were already fine-tuned by the HPS estimate, which was up to 45 c wrong: vc_trem B1_v1 had +44.9 and measures +1.7, and F2_v2 had −25.4 and measures +8.0.
  - **Verified:** `--verify` renders every one of the 305 samples through the sampler at its own pitch and at both ends of its zone, and re-measures each render by the set's method: 901 renders, the worst 3.5 cents (`hn_stac` G1_v1_rr1, a gliding take). The estimate is transposition-invariant, so the verify checks the transposition, not a lucky reading.
  - **Uncertainty.** A section's centre and a gliding take (60–150 c through the note) carry ±5–10 c. The independent time-domain cross-check (YIN on the same frames, `measure_set`'s `yin_cents`) agrees within 5 c on about 90 % of the samples; about 30 of the 305 differ by more, mostly gliding brass takes, low section notes and the spiccato bass (where the fundamental pulls the period away from the dominant harmonics). Among the samples the cues play, the least certain are `tpt_stac` F2_v2_rr1 (a 150 c glide), `vc_trem` F2_v2 (−5 to +17 c by method) and `vla_trem` E2_v1 and G2_v1 (±5 c).
  - **Not corrected:** `vibes_hard` and `xylo`. Their bars are inharmonic, so a harmonic estimate has nothing to lock onto.
  - `tracks/mm11-the-return/senza.py` (the senza-vibrato violin) reads the VSCO files itself, so it now applies `TUNING['svln']` too.
- **Balance groups.** `balance=` overrides a track's group. The defaults follow the family:

  | Group | Families and tracks |
  |---|---|
  | piano | piano |
  | orch | strings, winds, perc |
  | bigband | brass (the saxes are in it) |
  | chip | chip, plus glass and tokens: `glasspad`, `shimmer`, `bell`, `glyph` |
  | rhythm | bass, drums |
  | fx | synth, fx |

## 6. Harmony (`harmony`)

```python
parse('Dbmaj9#11'); parse('C7#9b13'); parse('F9sus4')        # Chord(root, ivs, bass); no-third chords contain no third
voice('Fm11', 'rootless_a', around='C4')     # close drop2 drop3 drop24 rootless_a rootless_b shell shell173 spread quartal tones
drop2('C7#9b13', top='Ab5'); rootless('Bbm9', 'B')
quartal('D4', 4, scale=scale('F', 'dorian')); so_what('E3')
voice('F9sus4', 'quartal', n=5)              # -> F Bb Eb G C: the chord's implied mode, kept third-free
ust('C', 'bVI', low='E3')                    # Ab/C7: LH E-Bb, RH Ab C Eb (also II, bIII, bV, VI, III, bVII, bIIm)
spread('Fm9', 'F1', 'C6', n=8); lead(prev, 'Bbm9', 'drop2'); implied_mode('G7alt')
progression(g, [(1, 'Fm9'), (3, 'Dbmaj7#11')])   # -> [(t0, t1, Chord)]; chord_at(prog, t)
scale('F', 'dorian'); scale_notes('F', 'dorian', 'F3', 'F5'); degree('F', 'dorian', 3)
```

- **Symbols the parser reads:**
  - qualities: `maj M ^ m min - dim o dim7 m7b5 ø aug + sus sus2 sus4 5 mMaj7`;
  - extensions: `6 7 9 11 13 69 add9 alt`;
  - alterations: `b5 #5 b9 #9 #11 b13`;
  - slash basses: `/F`.
- **`C11` means C9sus4.**
- **Modes:** all seven church modes, melodic and harmonic minor, lydian dominant, altered, whole-tone, both diminished scales, blues, and the major and minor pentatonics.

## 7. Patterns (`patterns`)

Rates are in quarter notes: 0.5 is eighths, 1/3 is triplet eighths, 0.25 is sixteenths. Every generator adds its notes to the `Arr` and returns them.

```python
arp(a, 'arp', 'Fm9', bars=(3, 7), rate=0.25, pattern='updown', octaves=2, low='F4', follow=prog, swing=0.0)
ostinato(a, 'vc', ['F3', 'C4', None, '-'], bars=(1, 9), rate=0.5, art='spic', follow=prog, mode='transpose')
rhythm(a, 'lead', 'F6', bars=(9, 13), k=5, n=16, rate=0.25)            # euclidean; euclid(3, 8) -> x..x..x.
comp(a, 'felt', prog, style='charleston', kind='rootless_a')           # whole halves charleston anticipate twofour freddie sparse stabs
walking_bass(a, 'ubass', prog, bars=(3, 11), layer='cb_pizz')          # roots C2-B2, the line up to D3 (the theme's register)
tokens(a, 'lead2', bars=(9, 13), stage='scrambled', duty=0.125)        # GLYPH's TOKEN STREAM (OST-BIBLE s2.5)
```

**`tokens`** is the token stream from the bible:

- straight 16ths with 30–60 % rests;
- `lock=True`, so 0 ms of humanisation;
- no vibrato;
- the register kept at F4–D♭6.

**Its stages** (`TOKEN_STAGES`):

| Stage | Eps | Notes |
|---|---|---|
| `grains` | 1–3 | F5, C6, D♭6 |
| `scrambled` / `reversed` | 4–6 | the knee's notes in the wrong order, or reversed |
| `almost` | 7–8 | F F F F G A♭ D♭ |
| `stream` | 9 on | |

From Ep10, pass the grid's swing: it has learned his.

## 8. Dynamics (`dynamics`)

```python
c = marks(g, [((1, 1), 'pp'), ((5, 1), 'mf', 'cresc'), ((7, 1), 'f'), ((8, 3), 'p', 'dim')])
a.notes = apply_vel(a.notes, c, insts=['vln1', 'vla'], mode='mul')   # 'mul' keeps the written accents; 'set' replaces them
T['vla'].auto = gain_points(c, g.t(1), g.t(9)); sc.stem_auto['strings'] = db_points(c, g.t(1), g.t(9))
a.n('vln1', 'F4', t, 4.0, 0.75, env=swell_env(4.0, 0.25, 1.0, 's'))  # also fp_env(), sfz_env(), hairpin(), phrase_arc()
```

- **Markings:** `pppp` to `fff`.
- **Shapes:** `lin exp log s step hold`.
- **A mark with no shape** is a subito.

## 9. Humanizer (`humanize`)

Every draw is seeded from the note itself: the track, the nominal start, the pitch and the articulation. Two things follow:

- the loop body renders identically in the full cue and in the loop file;
- editing bar 5 doesn't re-roll bar 40.

**Track level:** `hum_ms`, `offset_ms`, `vel_jit` and `drift_ms`. `lock=True` notes never move.

**Composition level:**

- `Humanizer(timing_ms, push_ms, vel, drift_ms, drift_s, len_jit).apply(notes)`;
- `groove(notes, g, 'laidback' | 'push' | 'drag' | 'ride' | 'backbeat', insts, amount, mpc_swing=56)`;
- `accent(notes, g, {1: 1.08, 2: 0.94, 3: 1.03, 4: 0.94})`.

## 10. Articulations (`articulations`, as `art`)

```python
art.legato(a, 'vln1', [('C5', (3, 1), '1.5b'), ('Bb4', (3, 2.5, 'sw'), '0.5b'), ('Ab4', (3, 3), '2b')], port=5)
art.sus / art.pizz / art.spic / art.trem(a, 'vla', ['E4', 'Bb4'], (5, 1), '1bar', swell=('pp', 'mp'))
art.swell(a, 'hn', ['F3', 'C4', 'Eb4'], (6, 1), '1bar', 'p', 'f'); art.fp; art.sfz
art.stab(a, 'tpt', ['C5', 'Ab4', 'F4'], (9, 1), vel=0.85)             # a section: players a hair apart, detuned
art.fall(a, 'tpt', 'Ab5', kick, 0.5, depth=4, hold=0.34, front='stab')   # real=True on tbn = the VSCO fall samples
art.rip / art.doit / art.scoop / art.shout(a, voicing_high_to_low, at, vel)
```

- **`legato`** is a crossfade: each later note skips its attack (offset into the sample) and overlaps the one before it.
- **`front='stab'`:** the VSCO sustain samples speak about 30 ms late. Use `front='stab'` on any brass kick that holds a sustain sample. The demo's kick measured +29 ms without it and −0.4 ms with it.

## 11. Drum DSL (`drums`)

```python
Drums(a, 'brushes').play('''
    sweep: ~~~~~~~~ | ~~~~~~~~       # '|' separates bars; a 1-bar line loops over the bar range
    tap:   ..x...x. | ..x...xX
    kick[vel=0.4]: x...x...
''', bars=(3, 11))
```

- **Steps:** the number of step characters per bar sets the resolution (8 is eighths in 4/4). It works in any meter.
- **Characters:**
  - `x` is a hit, `X` an accent, `o` soft, `g` a ghost;
  - `f` is a flam;
  - `2` to `9` are ratchets;
  - `~` holds the previous hit;
  - `.` or `-` is a rest.
- **Options:** `vel=`, `swing=`, `pitch=`, `len=` and `push=` (ms).
- **Kits and their voices:**

  | Kit | Voices |
  |---|---|
  | `brushes` | sweep, tap, slap, swirl, kick, hatf, ride, bell, rim |
  | `jazz` | ride, bell, crash, snare, rim, kick, hat, hatf, ohat, tom1 to tom3 |
  | `orch` | bd, snare, taps, cym, crash, timp, rim, wood |
  | `chip` | kick, snare, hat, ohat, metal |
  | `808` | kick, sub, snare, clap, hat, ohat, rim, `gu_*`: **diegetic source only**, through `era.futz` |

- **`swing_ride(a, bars)`** is the theme's ride pattern.

## 12. Glyph / dread textures (`texture`)

A texture is one note on the `tex` (synth) or `glyph` (fx) track. `note.dur` is its length and `vel` its level.

```python
a.n('tex', 'F1', (1, 1), '8bar', 0.5, kind='dread', intensity=0.4)             # sub + THE ACHE (G4 + Db5) + dark air
a.n('tex', 'F1', (1, 1), '8bar', 0.4, kind='dread', voicing='none')            # sub pressure + air only
a.n('glyph', 60, (2, 1), '4bar', 0.5, density=1.0, quantize_s=g.dur('1/16', (2, 1)))   # polite token grains, F4-Db6
a.n('tex', 'D4', t, 6.0, 0.5, kind='granular', src=('set', 'vibes', 'F5', 0.7, 2.0), scan=(0.1, 0.6))
a.n('tex', 'D4', t, 4.0, 0.5, kind='freeze', src=('file', 'vsco2ce/...wav'))     # spectral freeze: "time stops"
a.n('tex', 'C2', t, 10.0, 0.5, kind='shepard', rising=True)                      # endless rise: cut it off on a hit
a.n('tex', 'F1', t, 20.0, 0.5, kind='hum', mains=60)                             # the data-centre cathedral
```

The generators also work as plain functions returning arrays: `sine_cluster`, `dread`, `granular`, `freeze`, `glyph`, `shepard`, `server_hum`, and `crush(x, bits=(12, 4), rate=(24000, 3000))`.

**The defaults follow the bible:**

- **`dread`** carries the Ache (D♭ and G over the F pedal) as pure, slowly beating tones. `voicing='cluster'` gives the older quarter-tone cluster; use it rarely, and never in P04.
- **`glyph`** plays soft chip blips on the token set {F G A♭ C D♭} inside F4–D♭6. Its `tick`, `chirp` and `stutter` kinds are for diegetic UI only. For the straight-16th stream, use `patterns.tokens`.

## 13. Era filters and in-world speakers (`era`)

```python
Era('cassette')(buf)                           # presets: reel cassette walkman vhs dictaphone memory broken
sc.stem_post['chip'] = Era('reel')             # light T2 colour (allowed); hiss adds up across stems, so use one
futz(buf, 'tv')                                # in-world speakers: phone laptop tv radio pa (arena slap-back)
T['h808'].post = lambda b: futz(Era('vhs')(b), 'tv')   # an 808 beat on a TV in the room: diegetic source
tape_stop(buf, at_s, 0.6)                      # THE PLAN's break (s2.15); use nowhere else
codec_2008(buf, 0.5)                           # a 2008-14 low-bitrate codec colour
```

- **Wow and flutter are a modulated delay, not a resample:** hits stay within 1–3 ms of their frame (`memory` about 7.5 ms, `broken` about 17 ms).
- **Measured pitch wobble** (RMS):

  | `reel` | `cassette` | `memory` | `broken` |
  |---|---|---|---|
  | 2 cents | 6 cents | 10 cents | 25 cents |

- **`periodic=True`** makes the whole chain wrap exactly around the buffer.
- **The bible's rule:** tape is never Mas's recollection.

## 14. Motifs (`motifs`)

`MOTIFS` holds the OST-BIBLE §2 tables as named pitch and rhythm tables, so every composer places the same notes.

| Group | Names |
|---|---|
| The knee | `KNEE`, `FLAT_LINE`, `KINK` |
| Mas and the Orb | `WATER_LINE` (with `nudge_double`), `KEYNOTE`, `VERDICT` |
| The machine | `ACHE` (a chord), `TOKENS` (the stage table), `COPY` (the lag table) |
| The players | `BUILD` (with `tag` and `compile_passes`), `LAUNCH`, `ADDENDUM` (with `tail`), `LIGHTHOUSE`, `GPU_CHOIR` (a chord), `DOOR`, `PODIUM` (with `pickup` and `credit`), `RENAME` (chords), `FOUNTAIN_PEN` (with `turn`), `UPSELL` (with `close`), `INTERN` |
| Procedure | `STEP_FOUR` (with `bass` and `harmony`), `BLUEPRINT` |
| Colours (§2.16) | `TASYA_FLOOR`, `NELEH_CLOCKWORK`, `NELEH_QUESTION`, `MADA_SPINNER`, `HOURGLASS`, `CHATGTP_JINGLE` |

Each entry carries:

- its bible section and key;
- its swing (1.0 or straight);
- `line`, in `Arr.line` notation;
- the lead instruments, `never` and `rule`;
- its per-episode transformations (`eps`) where the bible gives them.

```python
place_motif(a, 'felt', 'WATER_LINE', (5, 1), vel=0.5)            # swung, as written
place_motif(a, 'lead', 'WATER_LINE', (5, 1), part='nudge_double', duty=0.5)   # the chip square on the nudge only
place_motif(a, 'lead2', 'COPY', (5, 1), ep=3)                    # the Water Line, an eighth late, quantised
place_motif(a, 'tbn', 'PODIUM', (9, 1), part='pickup')           # parts: line tail tag turn close bass credit pickup
a.ch('glasspad', chord_of('ACHE'), (9, 1), '1bar', 0.4)          # chord_of('GPU_CHOIR', plus=True)
find_motif(a.notes, 'WATER_LINE')      # [{inst, t, transpose}]: the motif matcher (it finds KEYNOTE and INTERN too: they ARE his line)
knee_whole_count(a.notes)              # 0 inside an episode (s2.1)
knee(5), flat_line(), kink(), leap(), transform(ps, 'invert' | 'retro' | 'minor_leap' | ...), TITLE_CHORD = 'F9sus4'
```

Machine motifs (`KEYNOTE`, `TOKENS`, `BLUEPRINT`, `BUILD`, `INTERN`) are placed straight with `lock=True`, so they get 0 ms of humanisation.

## 15. Score and rendering (`render`)

```python
Score(name, grid, tracks, notes, loop=(t0, t1), mutes=[(t0, t1)], mute_fade_ms=3.0,
      markers=[(sec, label)], sections=[(label, t0, t1)], stem_post={'piano': fn}, stem_gain={'brass': -2},
      stem_auto={'synth': [(sec, dB)]}, macro=[(sec, dB)], end_fade=(t0, t1), tail_s=5.0, meta=META, master={...})
render_score(sc)        # {family: [2, n]}; render_loop(sc) -> (loop stems, ringout stems, info); expand_loops(sc, n)
```

- **`mutes`** are the hard stops: the D6 drop-out, D5, the violin, the card stops.
  - Every stem **and its reverb tails** fades to **digital zero** within `mute_fade_ms` (3 ms), and returns at the end of the window.
  - The build gates again after the pocket EQ and the mastering. The demo's stop measures −240 dBFS.
- **Rendering is parallel** (`OST_WORKERS`, default min(6, cores − 1)). Sample sets and SoundFonts are preloaded and shared.
  - **Fix 3, 2026-09-26.** Each track renders in its own forked child, which leaves its buffer in `/dev/shm` and exits. The old `ProcessPoolExecutor` could hang for ever: if a worker died part-way through sending its buffer, the others blocked on a shared lock and the parent waited in a read that never finished. No timeout could get it out.
  - **Timeout guard.** A child that crashes, or runs longer than `OST_JOB_TIMEOUT` seconds (default 900), has its Python stack printed and is killed. That one track is then rendered again in the main process, with twice the time allowed; after that the build stops with a `TimeoutError`. Raise `OST_JOB_TIMEOUT` for a single track that really takes longer than 15 minutes.
  - **Other threads.** If any other Python thread is alive, nothing is forked and the render runs serially. Parts renderers no longer need `workers=1`.
- **Stem posts may be nonlinear.**

## 16. Loops

Set `Score.loop = g.span(b0, b1)`. The body is every note whose written start lies in [t0, t1).

- **The loop file (`<id>-loop.wav`)** is exactly the loop length, in samples. Everything the body rings past t1 is folded back onto its start.
  - The master gain is periodic.
  - It uses the same make-up as the underscore master, so the loop and the full cue intercut.
- **The ringout (`<id>-loop-tail.wav`)** is what keeps sounding after the last pass.
- **Verified:**
  - The loop file equals pass 2 of the body played 4x, to −90 dB, and the ringout matches to −133 dB.
  - `--verify-loop` repeats this check on every final (OST-BIBLE §6.9 item 8). On the demo it measures −72.5 dB overall and −130 to −139 dB per family. Piano, strings and bass read about −70 dB: that is the outro's humanised lead-in reaching back into pass 2, not a loop error.
  - Time-variant inserts (`Era`, `futz`) are excluded from that identity check. They still wrap seamlessly, and the seam check covers them.
- **The pass-start rule:**
  - Humanisation never moves a note before its pass start.
  - Latency lead-in is trimmed there, not delayed.
  - Half-samples always round up, so every pass lands on the same samples.
- **Gotchas:**
  - A pad that starts before t0 isn't in the loop.
  - To crossfade a bed over the seam, make it about 1.5 s longer than the loop, with matching fades.
  - Use `frame_lock_bpm()`; the build warns if the loop isn't a whole number of frames.
- **`META['album_loops'] = n`** repeats the body n times in the album master.

## 17. Export: masters, stems, files (`export`)

| File | What |
|---|---|
| `<id>-album.wav/.mp3` | **The album master.** Defaults: −14 LUFS-I, −1 dBTP, glue comp 1.8:1. `META['album_lufs']` (as low as −16) is for quiet tracks. |
| `<id>-underscore.wav/.mp3` | **The underscore master.** Defaults: −20 LUFS-I, −3 dBTP, a light 1.3:1 comp and a −2 dB dialog pocket at 2.5 kHz. **Featured** cues set `META['underscore_lufs'] = -16`. |
| `stems/<id>-<family>.flac` | The ten families, 24-bit FLAC, **summing to the underscore WAV** (the demo's residual is −162 dB). |
| `<id>-loop.wav`, `<id>-loop-tail.wav`, `<id>-loop-x3-preview.mp3` | [Section 16](#16-loops). The MP3 preview is for auditioning the seams: MP3 itself never loops. |
| `<id>.mid` | The score as written, with the exact tempo map (within 10 µs at the demo's bar 7), meters, markers, sections and LOOP START/END. |
| `<id>-pianoroll.png` | Families, bars, loop, markers, silence and stop windows, and the loudness curve. |
| `<id>.cue.json` | The cue sheet ([section 18](#18-cue-sheet-idcuejson)). |

**META fields the build reads:**

| Field | What it does |
|---|---|
| `mm`, `family`, `usage` | The album and library number, the OST-BIBLE palette, and BI / VI / MT / ET. |
| `motif_ids` | Motifs the matcher must find. |
| `silence_windows` | `[(t0, t1, label, max_dbfs)]`: D6 −90, real lines −70. |
| `no_third_windows` | Windows where A and A♭ must stay ≤ 0.06 of F. |
| `vo_windows` | Composed V.O. windows, which must read −24 ±2 LUFS. |
| `sfx_slots` | Where the SFX own the downbeat. |
| `diegetic_tracks` / `diegetic` | Declares in-world source music. |
| `hit_tol_ms` | The onset tolerance for markers (default 10). |
| `knee_whole_ok` | Allows the whole knee (main title and credits only). It also silences the knee-completion warning. |
| `room_sfx` | `[dict(t0=, t1=, sfx='room_drone' or 'server_hum')]` or `[(t0, t1, sfx)]`: where the SFX room beds play. `sfx_slots` entries that name `room_drone` or `server_hum` also count. Give them `t1`, `end` or `dur`; without one, the check runs to the end of the cue. |
| `room_sfx_drop_stems` | Stems the editor mutes under the room SFX (for example `['bass']`, as MM-01 and MM-13 instruct). The sub check judges the mix without them and reports both readings. |
| `album_loops`, `album_lufs`, `underscore_lufs` | See above. |
| `audition` | What a human must listen for. |

**Flags:** `--no-stems`, `--no-loop`, `--no-mp3`, `--loop-stems`, `--verify-loop`, `--workers N`.

## 18. Cue sheet (`<id>.cue.json`)

The schema is `mrmas-ost-cue/1`. A cue sheet holds:

- **identity:** `id`, `mm`, `family`, `title`, `usage`, `tone`, `tags`, `scenes`, `motifs`, `key` and `composer`;
- **`timing`:** the tempo and meter maps, the end, and the album duration in seconds, frames and bar:beat;
- **`sections`, `markers`, `hit_check`, `sfx_slots`, `silence_windows`, `vo_windows`, `knee_whole`, `knee_completion`, `f_major`, `room_sfx_windows`**;
- **`loop`:** samples, seconds, frames, `frame_aligned`, the tail, the seam check and loudness;
- **`files`, `masters`** (targets and measured values), **`stems`** (the residual and family shares), **`spectrum`, `bar_levels`**;
- **`instrumentation`, `credits`**;
- **`qa`**, the whole of [section 19](#19-qa-without-ears-analysis-ost-bible-69);
- **`audition`, `warnings`**.

## 19. QA without ears (`analysis`, OST-BIBLE §6.9)

The build runs these on every render and writes a warning for each failure:

| Check | Function | Rule |
|---|---|---|
| Loudness, true peak | `loudness`, `short_term_stats` | Targets as in [section 17](#17-export-masters-stems-files-export); underscore short-term p95 ≤ −17 (featured ≤ −13); 3 s windows, 0.5 s hop, gated at −60. **Fix 1 (2026-09-26):** the K-weighting (`mix.k_weight`) runs along time. It used to filter across the two channels and read 2.5–4 dB hot. It now matches pyloudnorm to 0.003 LU on V1, whose ST median is −13.8, and matches the editor's p95 on all 26 batch-1 underscore masters (0.00 LU). `lra`, the piano-roll curve and `balance_energy` share the fix. |
| Onsets | `hits` | Every marker within ±10 ms. The onset is the attack's start (half the local flux peak, 2.7 ms hop). |
| Silence | `silence`, `hard_stops` | D6 and hard stops < −90 dBFS, measured inside the 3 ms fades; `silence_windows` at their limits |
| Written third (rule 12) | `written_third` | **From the notes, at every note boundary** (sustain pedal included): no A♮, in any octave, may sound at any moment where F is the lowest sounding pitch. Overlaps under 20 ms (a legato crossfade, a roll) are listed as grazes and don't fail. The old per-beat sample missed MM-09's off-beat F3. |
| F-major check | `f_major_check` | The windows are wherever F is the lowest sounding pitch (from the notes), in pieces of at most one beat, with the hard stops cut out. The **harmonic-sieved** audio A/F must stay < 0.08; the sieve credits F's own 5th partial to F. It runs on the pitched families, without drums and fx. **When a window fails, the A is traced to its stem** (`a_from`, in %), and each A peak is classed as one of: **written A**; **partial k of written X** (the sieve credits a partial only when its fundamental is in the window); **glide** (a written bend, slide or sub drop sweeping through A); **tail** (a partial of a note that stopped less than 1.5 s before); or **resonance** (a partial of nothing written). The same resonance under different written notes is listed in `fixed_resonances` (a mute's formant, for example). Over the limit, a window is classed **written** (fail), **resonance** (≥ 25 % of its A-peak power comes from nothing written: fail, audition it) or **explained** (only partials of written non-A notes, tails and glides: pass). See the note under the table. |
| Knee completion (rule 4) | `knee_completion` | In any one line (an instrument's top line, or its bottom line when it plays chords): eight consecutive onsets reading F F F F G A♭ C F **by pitch class**, in any register and any key, each within 2.5 s of the one before. A rest or a new phrase doesn't break it, and a loop that completes it across its own seam is caught too. `knee_whole_count` (the exact register, gaps ≤ 1.6 s) stays for the motif sheet. |
| Sub under the room SFX (§6.5) | `sub_under_room`, `room_sfx_windows` | Wherever META marks `room_drone` or `server_hum`, the sub band (< 60 Hz) of the underscore master must sit ≥ 18 dB under its total power. The report names the stem that carries the sub, gives the reading without `room_sfx_drop_stems`, and lists the notes below C3 (the palette rule). |
| No-third windows | `no_third` | A and A♭ ≤ 0.06 of F |
| Swing | `swing_report` | Per track: the median off-beat position in frames (the house swing reads +10.0 at 96 BPM; straight reads +7.5) and `hum_ms` |
| Balance | `balance` | The theme's `stemtable.py` method, reproduced exactly (it gives V1's 34 · 28 · 11 · 27): piano · orch · bigband · chip, rhythm excluded. Also `balance_energy` (ungated), because the theme method counts a brief stab at full loudness for its whole section. Sections are the Score's own, else 4-bar blocks. |
| Spectrum | `band_ratio_db`, `bands` | The 2–6 kHz band ≤ −15 dB (underscore); the centroid |
| Loops | `loop_seam`, `verify_loop` | The seam, plus `--verify-loop` |
| Stems | `stems_residual` | The stems sum to the underscore master |
| Motifs | `find_motif`, `knee_whole_count` | The `motif_ids` are found; the whole knee appears 0 times |
| Banned material | `banned` | No diegetic-only tracks unless declared; no F6 bell |
| Piano roll | `piano_roll` | Sections, cue points, loop, and silence and stop windows marked |

**The F-major classes.** The commonest *explained* window is the F bass's own 5th partial, when its fundamental is too weak for the sieve. A window whose F holds under 5 % of its pitched energy isn't judged on A/F, because the F is written but not heard (a decayed pluck, a buried pedal); those windows are counted in `f_inaudible_windows`. `ok_written` is rule 12 and a hard fail. `ok_spectral` failing means: audition it.

The other functions: `bands`, `chroma(x, t0, t1, sieve=)`, `pc_energy` (the unnormalised chroma), `sounding_spans`, `f_bass_windows`, `bar_levels`, `family_share`, `onsets`, `loop_seam`. **Fix 3:** `chroma(sieve=True)` no longer crashes on a NaN frequency. The mask edge's skirt was being "refined" to a negative frequency; it now refines only true peaks, clamped to ±½ bin.

**Regression tests** (`engine/tests/`, 43 tests, about 35 s): `cd audio/ost && ../.venv-theme/bin/python -m unittest discover -s engine/tests -v`. `OST_ENGINE_ROOT=<dir>` runs them against another copy of the engine.

**Analysis can't judge taste.** `META['audition']` should list 3–6 timecoded items.

## 20. Porting theme code

The theme works in **frames**. Here, times are **seconds**.

| Theme code | OST code |
|---|---|
| `fr(b, bt)` | `g.t(b, bt)` |
| `eighth(b, bt, True, sw)` | `g.eighth(...)` or `g.s(b, bt + 0.5)` |
| `std_tracks()` | `palette()` (the names are kept; the sections are keyswitched) |
| `STEMS` | `FAMILIES` (the Harmon trumpet is in `brass`, and so are the saxes; `sub` is in `bass`; drones are in `synth`) |
| a length of 7 frames | `'7f'` |

`nm()`, the chip, the SNES filter, `felt_post`, `cup_mute`, `tape_peak` and `air` behave as in the theme.

## 21. The demo (`tracks/_demo/`)

The demo is a 20.6 s test of every tool. It follows the house rules, so it is safe to copy from.

| Bars | Part | What it does |
|---|---|---|
| 1 | cold open | the Water Line's first bar on clean felt, with the 50 % chip square on the nudge only; a quartal F9sus4 left hand; sub pressure |
| 2–5 | **loop** | the trio (rootless charleston comping, laid-back, walking bass plus pizz, brushes); pizz, a legato violin line and a tremolo swell; the flat line (bar 3) and the kink (bar 5); a chip arp; token grains plus a quantised GLYPH; the Ache for one bar; a sub bed that crossfades over the seam; one brass kick with a stab-fronted fall; Ab/C7; an in-world TV playing a trap beat (futz plus VHS) |
| 6 | tag (3/4) | a ritardando from 84 to 64 BPM; a horn swell and strings on F9sus4; a **hard stop** on the and-of-3 |
| 7 | title (2/4) | the title hit with no third |

**Measured:**

| Check | Result |
|---|---|
| album master | −14.02 LUFS, −1.15 dBTP |
| underscore master | −20.00 LUFS, −3.15 dBTP |
| stems | sum to the underscore master at −162 dB |
| loop | 274 frames exactly; seam clean (0.25x the typical step); verify −72.5 dB |
| hits | −0.4 ms and −7.6 ms |
| hard stop | −240 dBFS |
| title hit | A 0.028, A♭ 0.001 of F |
| F-major check | OK |
| knee | whole 0; both fragments found |
| balance | 33 · 17 · 39 · 10 (energy: 39 · 24 · 19 · 17, with the corrected meter) |
| spectrum | 2–6 kHz −16.3 dB; centroid 406 Hz |

**The one warning is true.** The short-term p95 is −16.6 (the old meter read −11.9), just over −17, because the demo ends on a title hit: it isn't an underscore bed. The demo is private: `build.py` never lists it in `ost-index.json`.

**Audition:** the timecoded list is in `render/_demo.cue.json` → `audition`.

## 22. Performance, disk, known limits

- **Speed.** The demo takes about 20 s, or about 32 s with `--verify-loop`. The Salamander SF2 (1.27 GB) is loaded once per build and shared with the workers.
- **Denormals.** The filters add a fixed −400 dB dither, because decaying IIR state is about 100x slower on the CPU.
- **Disk.** The volume had 12 GB free (97 % used). A full build measures about **1.5 MB per second of music**, so a 3-minute track is about 280 MB:
  - two WAV masters, about 104 MB;
  - FLAC stems, about 135 MB;
  - the loop files;
  - the MP3s.

  Draft with `--no-stems --no-loop`, and build stems for finals only.
- **Limits:**
  - The pedal emulation has no half-pedalling and no resonance.
  - GM pads and choirs can sound dated; audition them.
  - There is no time-stretching (the bible forbids more than ±1 % anyway).
  - `Era` hiss adds up across stems.
  - The onset QA is coarse in dense passages.
  - The audio chroma readings are indicative: a quiet A in a short window can escape the audio F-major reading. The written-note check (`written_third`, every boundary) can't miss one.
  - The motif matcher reads each instrument's top line, so a motif split across instruments isn't found.
