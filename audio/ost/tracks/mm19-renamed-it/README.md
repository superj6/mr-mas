# MM-19 · "Renamed It. / The Fountain Pen" (THE PODIUM)

**Composer A (batch 1); fix pass 1 by composer B, 2026-09-26 · OST-BIBLE §5.A2 · palette P13 THE PODIUM · library suite, 36 bars, 90 s, 96 BPM, straight.**
Nobody has listened to this track. Every level, timing and pitch below was set by measurement. The last section lists what a human has to hear first.

**Tone: state occasions at equal weight.** It sets NEDIB's Fountain Pen and RUMPT's Podium side by side (guardrails §2a, rules 3–4).
- **The Fountain Pen** is a signing: a string quartet with harp, careful and legato, in B♭ major.
- **The Podium** is brass one size too big, in E♭ major, and it changes with each phase. FEAR is muted, LOVE is the full march, WHO? has a missing beat, and SUPER is renamed twice.
- **The band plays everything straight and stops for real words.**
- **The joke is the Rename.** The bass and the top note hold while only the inner voices slip a semitone: E♭ becomes B/D♯, the same note with a new name. It uses no sting, no swell and no trombone blat.

## Fix 2b (2026-09-26): re-rendered on the retuned engine

The notes, timing, levels and EQ are unchanged. Re-rendered by the engine owner: the suite, loop B, loop A and all seven variants. The engine's fix-2b tuning now corrects the tuba and trumpet staccatos, the tremolo sections and the solo violin. **This is the track it changes most.** The fix-1 master MP3s (the suite and the variants' album masters) are in `render/_pre-fix2b/`.

**What moved** (in the suite; the cut-downs and the reduced version share these notes):

| Voice | Where | Before fix 2b | Now |
|---|---|---|---|
| Tuba B♭1 and C2 (the `A#0_v2_rr3` take) | 48.75, 61.25 (C2), 62.5, 76.25 s | **95 cents flat**, almost an A | in tune (+95 c) |
| Tuba E♭2 (`D#1_v2_rr3`) | 7 notes, 20.6–82.5 s | 23 c sharp | in tune (−23 c) |
| Cello tremolo B♭2 (FEAR) | 25.0, 30.0, 35.0, 42.5 s | 43 c flat (the old automatic correction pointed the wrong way) | in tune (+43 c) |
| Viola tremolo G♭3 (FEAR) | the same four | 25 c flat | in tune (+25 c) |
| Trumpet stab G3 (`F2_v2` takes) | 45.0, 55.0, 70.0 s | 23–31 c flat | in tune; these takes glide 70–150 c, so ±10 c |
| Solo violin C6 / D6 (`C6_f`) | 14.5–16.9, 62.5 s | 20 c flat | in tune |
| Solo violin E5, E6, C6 (`E5_f`, `E6`, `C6_p`) | 13.8, 15.6, 61–65 s | 10–19 c sharp | in tune |

In all, 102 of the 312 notes on the retuned sets, across the suite and its variants, moved by more than 10 cents.

**Measured:**
- Masters: −14.01 / −16.02 LUFS, −1.15 / −3.15 dBTP. p95 −14.3. Balance 12 · 50 · 22 · 16. The stems sum at −161.8 dB. Both loops are seamless.
- F-major: passes, with no written A. The worst sieved A/F is 0.163 at 13.75 s, *explained* (the contrabass F2's own 5th partial); it was 0.03.
- Knee: 0 / 0. All seven variants: no warnings, F-major passes.
- **One marker now reads just outside tolerance:** b15.1 (35.0 s), −10.7 ms. The retuned FEAR tremolo enters 7 ms ahead of the timpani (its humanised start, unchanged), and the onset detector now takes the tremolo's attack. No note moved.

## Fix pass 1 (2026-09-26): what changed

- **Re-rendered on the fixed engine** (the corrected loudness meter, the sample tuning, the new render pool and the QA checks 5a–5d). The music of the suite is unchanged. The harp now plays tuned samples; the harp clamp (vel 0.42–0.62, level by gain) is kept, since it already stays in the tuned `mf` layer. The old master MP3s are in `render/_pre-fix1/`.
- **The library variants now exist as files** (§6.4, §6.7), in `render/variants/`, each with album and underscore WAV + MP3, MIDI, piano roll and cue sheet:
  - the **30, 15 and 5 s cut-downs** that this README used to only describe (RUMPT);
  - for **parity**, a **15 s and a 5 s cut-down of the Fountain Pen** (NEDIB). Its movement is 8 bars, so its 30 s is the 20 s movement or loop A;
  - a **reduced** version and a **solo piano** version of the whole suite.
- **The engine's short-term p95 warning is gone**: the corrected meter reads −14.3, as the README always said.
- **QA on this render:** no engine warnings on the suite or on any variant. Written third none; F-major worst sieved A/F 0.03; whole knee 0; knee completion 0; both loops seamless; parity 0.4 LU.

## What is in `render/`

| File | What |
|---|---|
| `mm19-renamed-it-album.wav/.mp3` | The album master (−14 LUFS-I) |
| `mm19-renamed-it-underscore.wav/.mp3` | The library master, featured (−16 LUFS-I, −3 dBTP, with the dialogue pocket) |
| `stems/mm19-renamed-it-*.flac` | The stems: strings, brass, drums, perc, piano, chip, bass. They sum to the underscore master. |
| `mm19-renamed-it-loop.wav`, `-loop-tail.wav`, `-loop-x3-preview.mp3` | **Loop B: LOVE**, bars 19–26 (45.0–65.0 s): 20.0 s, 480 frames, seamless |
| `mm19-renamed-it-fountainpen-loop.wav`, `…-loop-tail.wav`, `…-loop-x3-preview.mp3`, `…-loop.json` | **Loop A: the Fountain Pen**, bars 1–8 (0–20.0 s): 20.0 s, 480 frames, seamless, at the suite's underscore make-up |
| `mm19-renamed-it.mid`, `-pianoroll.png`, `.cue.json` | Score, piano roll and cue sheet |
| `variants/mm19-renamed-it-{30s,15s,05s,15s-nedib,05s-nedib,reduced,solo}-*` | The library variants (see below): album and underscore WAV + MP3, MIDI, piano roll, cue sheet. No stems: the suite's stems carry every voice. |

**Rebuilding.** `python track.py` renders the suite, loop B, loop A and the seven variants. `python track.py --variants-only [names]` renders variants only; `--no-variants` skips them. `python ../../build.py mm19-renamed-it` renders the suite and loop B.

## Form

| Bars | Time (s) | Movement | Music and cue points |
|---|---|---|---|
| 1–8 | 0.0–20.0 | **THE FOUNTAIN PEN** (NEDIB) · loop A | The motif on the viola section at b1 (B♭3 ×4, then C D F B♭ and the pen-stroke turn C B♭ A B♭).<br>**Word window b3–4** (5.0–10.0): pp sustain only.<br>The motif again on the solo violin, an octave up, at b5 (10.0), with the whole quartet, harp arpeggios, a soft grand and the chip triangle.<br>An answer phrase, then the breath on b8.4. |
| 9–10 | 20.0–25.0 | **THE MARKER** | The pen's final turn starts on b9.1. On **b9.2 (20.625)** one dry snare hit and a tuba E♭ (RUMPT's marker) cut it. Its A never sounds.<br>The strings, harp, piano and chip go to digital zero, tails included. |
| 11–18 | 25.0–45.0 | **FEAR** | The Podium in E♭ minor at half-time, on cup-muted trombones, from the pickup at b10.4 (24.375). Muted horns, tremolo cellos and violas, a ghost of the grand.<br>**Word window b13–14** (30.0–35.0).<br>A timpani roll on b14.4 into **b15.1 (35.0)**, with a single dulled chip glint.<br>It ends on C♭/E♭ → E♭m. **The 1-beat stop** falls at b18.3 (43.75). |
| 19–26 | 45.0–65.0 | **LOVE** · loop B | Pickup at 44.69.<br>**Fanfare 1 at b19 (45.0):** E♭4 q. F4 e G4 q B♭4 q \| E♭5, on trumpets in sixths with trombones. The chip piccolo plays an octave up, with a glock and a soft cymbal on the held note.<br>The engine: field snare, bass drum, staccato tuba, grand-piano march chords on every beat, strings.<br>**Word window b21–22** (50.0–55.0): the snare stops and the tuba holds.<br>**Fanfare 2 at b23 (55.0),** its held note over A♭/E♭.<br>The b25–26 tag climbs the Podium's dotted rhythm over A♭ – Cm7 – B♭7sus – B♭7. The band stops on b26.4, and the pickup leads back to b19 (or on to b27). |
| 27–28 | 65.0–70.0 | **THE RENAME** | The band arrives on E♭ (the held E♭5).<br>**At b27.3 (66.25) the inner voices slip:** E♭ becomes B/D♯. Horns, violas and 2nd violins slip; trumpet, violins, tuba and basses hold. **The label gun (SFX) lands here.**<br>1-beat stop at b28.3. |
| 29–32 | 70.0–80.0 | **WHO?** | The fanfare, then **the last note never arrives**: **b30.1 (72.5) is a hole**, with the whole band at digital zero for a beat.<br>The band resumes at b30.2 as if nothing happened and vamps.<br>**b32: the band waits** (77.5–79.69). Only the pickup plays: one trumpet and a chip glint. |
| 33–36 | 80.0–90.0 | **SUPER** | The E♭ finally arrives (80.0). **Rename 1 at b33.3 (81.25):** E♭ → B/D♯.<br>Re-voiced to B with a stab at b35.1. **Rename 2 at b35.3 (86.25):** B → G/B, where the B holds and D♯ → D, F♯ → G.<br>**The chip takes the top line:** RUMPT's flat line in the Podium's dotted rhythm, on the note that never changes.<br>**The button: a tutti G/B at b36.1 (87.5),** then the stop. |

**Clean edit points and cut-downs** (all on bar lines):
- Every movement starts with an attack and ends in a stop.
- **Cut-downs** (rendered as their own files in `render/variants/`, mastered to the suite's targets: −16 underscore, −14 album):

  | File | Length | Bars | Ends on |
  |---|---|---|---|
  | `…-30s` | 30.0 s | b17–28 (FEAR's close, LOVE whole, the Rename). The tremolo re-enters on its bar 1. | the Rename's stop |
  | `…-15s` | 15.6 s | b23–28 with the b22.4.5 pickup (fanfare 2, the tag, the Rename) | the Rename's stop |
  | `…-05s` | 5.6 s | b27–28 with the b26.4.5 pickup (the Rename; the label gun at 3.125 s) | the Rename's stop |
  | `…-15s-nedib` | 15.0 s + ring | b1–2 + b5–8 (the Fountain Pen on the violas, then on the solo violin) | the breath on b8 |
  | `…-05s-nedib` | 6.25 s + ring | b1–2 + the landing on b3.1 (the turn onto B♭ over a soft B♭ chord) | the landing |

- **Reduced** (`…-reduced`, 90 s): the same form, stops, word windows and parity fader with fewer players. NEDIB: the quartet and the chip triangle (no harp, no piano). FEAR: the cup-muted trombone, tremolo strings and the timpani (no horns, no piano ghost). RUMPT: **one trumpet** on the Podium over the march engine (snare, bass drum, tuba, grand chords, strings) with the chip piccolo; no trombones, horns or 2nd trumpet. The Renames slip in the violas and 2nd violins. Balance 13 · 51 · 16 · 20.
- **Solo piano** (`…-solo`, 90 s): the whole suite on the grand alone, with the chip identity layer kept (NEDIB's triangle, RUMPT's piccolo glints and SUPER's top line, 8 dB down). The Fountain Pen's line with its bass (the viola's statement an octave up, the harp's two rolled chords, the contrabass line under statement 2); the marker as one dry low E♭ octave; FEAR in pp octaves; the march as the suite's own grand chords over the tuba's roots, the fanfare in two parts; the Renames as a re-voicing under held outer keys. Balance 90 · 0 · 0 · 10. Parity by the same fader.

**Word windows** (pp sustain only; the level is ridden down by the conductor's fader, `level_map()`):

| Window | Time (s) | Measured (gated) | Target |
|---|---|---|---|
| NEDIB, b3–4 | 5.4–10.0 | −28.8 LUFS | ≤ −28 |
| FEAR, b13–14 (up to the timpani roll) | 30.1–34.3 | −28.5 LUFS | ≤ −28 |
| LOVE, b21–22 (up to the pickup) | 50.2–54.6 | −28.6 LUFS | ≤ −28 |

## Palette and balance

| | NEDIB (b1–8) | RUMPT (LOVE, b19–26) |
|---|---|---|
| Lead | Viola section, then solo violin 8va, legato (crossfaded) | Trumpets (stab-fronted sustains, so they speak on the grid) and trombones |
| Engine | Quartet sections, harp, soft grand | Field snare, bass drum, staccato tuba, grand-piano march chords, strings |
| Chip | One triangle doubling the bass | The chip piccolo (12.5 %) an octave above the fanfare; a glint on held notes; SUPER's top line |
| **Balance** (piano · orch · big band · chip) | **5 · 83 · 0 · 12** (target 10 · 80 · 0 · 10) | **18 · 31 · 36 · 16** (target 20 · 30 · 35 · 15) |

**Parity** is measured over the whole 8-bar movements, each including its word window:

| Movement | Time (s) | Gated | Ungated |
|---|---|---|---|
| The Fountain Pen | 0–20 | −15.4 LUFS | — |
| LOVE | 45–65 | −15.0 LUFS | — |

The difference is **0.4 LU** gated on the fix-1 render (it was 0.3; target ≤ 0.5). The word windows read −28.8, −28.5 and −28.5 LUFS.

**FEAR** measures −20.7 LUFS, about 5 LU under LOVE. It is hushed, and its word window is ridden to −28.5. It uses no clusters, no stingers and no pulse figure: the timpani is one roll, and there is no heartbeat.

## Harmony and the rules

- **No F-major triad anywhere.** B♭ major never uses its dominant, F major. The cadences are E♭/F (F9sus4, with no third), and the turn's A♮ only ever sits over a B♭ or D bass.
- **The one place an A♮ is written** is the marker's cut turn (b9.2), and the cut silences it.
- **Nothing is quoted.** There is no *Hail to the Chief*, Sousa, anthem, rally song, clown orchestration or trombone blat. The glock and cymbal are ceremonial, not gags.
- **The whole knee appears 0 times.**

## QA (measured on the final render; §6.9)

| Check | Result |
|---|---|
| Underscore / album | −16.03 / −14.02 LUFS; −3.15 / −1.15 dBTP |
| Short-term p95 · momentary max | −14.3 · −13.0 (limits −13 · −11). The fixed engine meter now agrees with the editor's. |
| Hits | every cue point within −5.3 … +2.7 ms: b1, b5, b9.2, b10.4, b15.1, b19, b23, b30.2, b32.4.5, b36.1 (fix 2b: b15.1 reads −10.7 ms, see above) |
| Hard stops | the five stops and holes are at −240 dBFS |
| F-major | pass: no written A♮ over an F bass (the new every-boundary check); worst sieved A/F 0.03 (b1.4 was re-voiced from E♭/F to E♭/G in batch 1) |
| Knee completion (by pitch class, new check) | 0 |
| Loops | B: 480 frames, seamless, verify −58.2 dB (piano −50: the grand's pedal tails). A: 480 frames, seamless. |
| Stems vs underscore | −161.9 dB |
| Motifs | FOUNTAIN_PEN found 2×, PODIUM 6×. The whole knee 0×. |

**Sync points with no attack, by design** (listed in the cue sheet's `sfx_slots` and `description`, not as onset markers): the three label-gun slips at b27.3, b33.3 and b35.3 (66.25, 81.25 and 86.25 s).

## Sample traps avoided (see MM-07's README for the harp)

- **Harp:** vel is kept at 0.42–0.62. Its `mp` layer is one G1 sample. (Engine fix 2 tuned every harp sample and stops any harp note stretching more than 4 semitones, so the clamp is no longer needed; it is kept because it already plays the same `mf` samples.)
- **Horn sustains:** kept below vel 0.75, because the top layer has only 2 samples.
- **Muted horns:** kept below vel 0.66, because the top layer has only 1 sample.
- **Tuba staccato:** played at vel ≥ 0.6. The soft layer's F2 sample is 55 cents flat.
- **The cup-muted trombone** speaks about 30 ms late. `latency_ms` compensates for it.

## What a human must audition (in this order)

1. **Parity** (0–20 s against 45–65 s): do the Fountain Pen and LOVE feel equally grand and equally serious? Neither may sound like the joke.
2. **The Rename** (65.0–70.0 s; the slip at 66.25 s): is it deadpan, or too cute? Play it with the label-gun SFX laid in.
3. **The marker** (20.0–21.0 s): does the cut read as a void rather than a gag?
4. **FEAR** (25–45 s): hushed and ceremonial, without being horror-movie?
5. **WHO?** (72.5 s, and 77.5–79.7 s): is the timing of the missing downbeat and the waiting band deadpan?
6. **SUPER** (80–90 s): does the chip top line hold while the world is renamed under it? Is it gilded without being toy-like or Nintendo?
7. **The solo piano variant:** a pianist at a state occasion, straight and measured, or a rehearsal pianist, ragtime or oom-pah? Does the Rename still read as a re-voicing under held keys (66.25 s)?
8. **The reduced variant, 45–65 s:** one trumpet on the Podium over the engine. Ceremonial, or a bugle call?
9. **Parity in the cut-downs:** the RUMPT 15 s against the NEDIB 15 s, and the two 5 s cuts. Equally grand?
