# MM-13 · Outside Intended Scope (the GLYPH ladder)

**Composer D** (batch 1); **fix pass 1 by composer B, 2026-09-26.** A library suite in palette **P05 GLYPH** (OST-BIBLE §5.D2).
- The hits, the Q\* bar and THE COPY at every lag are in the sibling kit: [`../mm13-kit-glyph-hits-and-copy/`](../mm13-kit-glyph-hits-and-copy/README.md).
- Nobody has listened to this suite; every choice below was set by measurement.

This is the machine learning the show's tune, politely: grains, then the knee scrambled, then almost, then running past its own ending. It is dread without a single "evil" sound.

## Fix pass 1 (2026-09-26): what changed

Rendered on the fixed engine (the corrected loudness meter, the sample tuning, the new render pool and the QA checks 5a–5d). The old master MP3s are in `render/_pre-fix1/`.

| Change | Why | Measured now |
|---|---|---|
| **The sub pressure is a floor, not a layer.** The `subp` track is 9 dB lower (gain −3 → −12 dB) and has a low shelf of −11 dB at 90 Hz, so the F1 itself is about 19 dB lower. | The sub read −3.9 to −7.5 dB of the total power below 60 Hz. §6.5 wants ≤ −18 dB under `room_drone` and `server_hum`, and this is a library bed that can lie under either. The editor asked for the fix in the cue, not only by muting the stem. | L1 −20.2, L2 −22.6, L3 −24.8, L4 −23.4, HOOK −20.8 dB. It passes on the full mix: dropping the bass stem is now optional. |
| **Room windows are marked.** META `room_sfx` covers every level (L1–L4) and the HOOK. | The new `sub_under_room` check needs the windows. | 5 of 5 pass. No `room_sfx_drop_stems` is set, so the check judges the full mix. |
| **The tokens have a high shelf** (−6 dB above 1.6 kHz on `lead2` and `arp`). **The strings' low-pass is 1.9 kHz** (was 2.4). | With the sub gone, the 2–6 kHz share of the cue rose to −13.8 dB (the limit under dialogue is −15). The tokens carried about 40 % of that band and the high violins about 30 %. | 2–6 kHz −16.0 dB. |
| **The HOOK is ridden down 2 dB** (a fader in `Score.macro`). | With less sub energy the make-up gain rose by about 1.2 dB, and the hook read −14.0 LUFS-M on the corrected meter. The brief wants −16 LUFS-M. | −15.8 LUFS-M. |
| **The dark air in L1–L2 comes down with the sub** (it is part of the same texture). | Its noise read as A-range energy at 107–113 Hz and 215–225 Hz over the F pedal in the new F-major trace (8 windows). | Those 8 windows are gone. |
| **Five library variants** in `render/variants/` (§6.4, §6.7): 30, 15 and 5 s cut-downs, and the reduced and solo versions. See below. | They were missing. | See the table below. |

The music is otherwise unchanged: every note and every level ratio inside a level is the same.

## Palette

**It is the opposite of MM-10**, which is warm, swung, human and big band. Here there is:
- no piano, brass or swing;
- no humanising: every note is locked and every track has hum 0 and vel_jit 0;
- no vibrato;
- no Mas motif.

**What plays:**
- **Chip:** a 12.5 % chip carries the tokens, band-limited to 2.6 kHz and shelved above 1.6 kHz, with a detuned 12.5 % double (+10 cents).
- **Glass:** celesta, the synth bell and the GM glass pad.
- **Strings:** high strings, low-passed at 1.9 kHz.
- **The Ache:** pure beating tones (G4 + D♭5 over the F pedal).
- **Sub pressure:** the F pedal, in slow breaths, now a quiet floor (about −20 to −25 dB of the total below 60 Hz).

**Register:** tokens only from {F G A♭ C D♭}, plus E♭ in the runaway, and only at F4–D♭6. G6–F7 belongs to the SFX glyph grains.

**The sub is still on the BASS stem**, so the editor can take it out completely under the room SFX. It no longer has to.

## Form (96 BPM, straight, 4/4; each level is 8 bars = 20 s)

| t (s) | Bars | Level | Music |
|---|---|---|---|
| 0–20 | 1–8 | **L1 · grains** (Eps 1–3) | 2–3 celesta or bell grains a bar (F5, C6, D♭6), placed on irregular 16ths so they never repeat within the bar; two slow sub breaths with dark air. **The Ache** enters in bars 5–6 only, at 10.0 s. |
| 20–40 | 9–16 | **L2 · scrambled** (Eps 4–6) | The knee's notes shuffled (A♭ F C G F F F F) as 16th tokens with 50 % rests, plus a detuned double and celesta on some tokens. **Bar 13 (30.0 s) plays the knee reversed** (F C A♭ G F F F F). The chord with no third (F C G) sounds in glass. |
| 40–60 | 17–24 | **L3 · almost** (Eps 7–8) | F F F F G A♭ **D♭**: the Ache's D♭ where the C should be, and it never reaches the octave. 30 % rests; a 7-token cycle drifts against the 16-step bar. A high-violin pad on F–C–G. The Ache returns at 50.0 s. |
| 60–80 | 25–32 | **L4 · the runaway** (Ep9) | F F F F G A♭ C, then **past the knee's ending**: E♭ F A♭ C, and round again. The rests thin from 35 % to 10 %. Under it, a line climbs A♭ C E♭ F **an octave per bar-pair**, from cello to viola to violins II to violins I, and each pair holds its F. The sub swells once per bar-pair, a little larger each time. **The E♭ after the C is never dropped, so the knee never closes** (whole-knee count 0; the new pitch-class knee-completion check also reads 0). |
| 80–85 | 33–34 | **HOOK** | The tokens stop. A sub-pressure swell leads into **one high glass D♭6** at 82.5 s, which **cuts dead on the downbeat at 85.0 s**. Ridden 2 dB down. |

## Loops (seamless, 20.000 s = 480 frames each)

| Loop | Bars | File | Level (x2) | Seam |
|---|---|---|---|---|
| L1 | 1–9 | `render/…-loop.wav` (+ `-loop-tail.wav`, `-loop-x3-preview.mp3`) | −22.6 LUFS | Seamless; `--verify-loop` −82.9 dB |
| L2 | 9–17 | `render/…-loop-L2.wav` (+ tail, x3 preview) | −21.2 (linear −21.2) | Seamless |
| L3 | 17–25 | `…-loop-L3.wav` | −19.5 (linear −19.4) | Seamless |
| L4 | 25–33 | `…-loop-L4.wav` | −20.6 (linear −20.6) | Seamless (the engine and the editor's detector now agree; it used to read CHECK) |

- **How L2–L4 are made.** Running `python track.py` writes them through `extra_loops()`, together with `…-loops.json`. They are pocket-EQ'd like the underscore master and levelled to their own bars in the underscore master, so a loop and the linear cue intercut. `build.py` renders L1 only.

## Library variants (`render/variants/`)

Written by `python track.py` (or `--variants-only`). Each has album and underscore WAV + MP3, MIDI, piano roll and cue sheet. They have no stems: the suite's stems carry every voice.

| Variant | Length | What | Underscore / album | 2–6 kHz |
|---|---|---|---|---|
| `…-30s` | 30.0 s | Bars 23–34: the end of L3, all of L4, the HOOK, cut dead. The F pedal and the violins' F–C–G re-enter on its first bar. | −20.2 / −15.4 LUFS | −14.9 dB |
| `…-15s` | 15.0 s | Bars 29–34: the runaway at its densest (violins II, then I) into the HOOK | −20.2 / −15.3 | −13.7 dB |
| `…-05s` | 5.0 s | Bars 33–34: the HOOK alone, an out | −20.4 / −15.2 | −11.9 dB |
| `…-reduced` | 85 s | The whole ladder without strings or the glass pad: tokens and double, celesta and bell, the Ache as beating tones, the sub floor. Lighter under dialogue; L4 rises by density alone. | −20.8 / −16.0 | −16.8 dB |
| `…-solo` | 85 s | The chip alone (`lead2`): the L1 grains on the chip with a soft plucked envelope, the tokens as written, the HOOK's D♭6. A further −3 dB shelf above 1.6 kHz. No glass, strings, sub or double. | −20.8 / −16.0 | −16.4 dB |

- **The cut-downs are mastered to the level their bars have in the suite** (underscore and album), so they intercut with the suite and its loops. The HOOK in the 5 s cut reads −15.8 LUFS-M, as in the suite.
- **The three cut-downs fail the 2–6 kHz rule** (−14.9, −13.7, −11.9 against −15). That rule is for beds under dialogue. These are the runaway and the HOOK, which the brief uses as **outs** ("dread before the cut"), and they are as bright as the suite's own last bars. Treat them as outs, not beds; use the reduced or solo variant under a line.
- Every variant passes the sub rule (worst −20.0 dB, in the reduced L1).

## Measured (final render)

| Measure | Result | Target |
|---|---|---|
| Underscore | −20.8 LUFS · −5.5 dBTP | set so the levels land |
| Album | −16.0 LUFS · −1.15 dBTP | the bible's quiet-track minimum |
| L1 · L2 · L3 · L4 | −22.5 · −21.2 · −19.5 · −20.6 LUFS-I | ≈ −22 · −22 · −20 · −20 |
| Hook | −15.8 LUFS-M | −16 LUFS-M |
| Short-term (corrected meter) | p95 −19.0 | ≤ −17 |
| 2–6 kHz | −16.0 dB | ≤ −15 dB |
| Sub (< 60 Hz) under the room SFX | −20.2 to −24.8 dB | ≤ −18 dB |
| Centroid | 713 Hz | — |
| Balance (theme method) | 0 · 28 · 0 · 72 | 0 · 30 · 0 · 70 |
| Written third (rule 12) | none | none |
| F-major, spectral | **3 windows flagged** (see below) | — |
| Whole knee · knee completion | 0 · 0 | 0 |
| Stems | Sum to the underscore at −167 dB (the editor's meter −116.7 dB, 24-bit) | — |
| Engine warnings | 1 (the F-major flag) | — |

**The F-major flag is the chip's A♭4, not an A.** The three windows are at 40.6, 43.7 and 44.9 s (L3's first bars), where the F is barely heard (5–7 % of the pitched energy) and the token A♭4 is loud. The "A" peaks sit at 428–442 Hz, 50–60 cents above the written A♭4 (415 Hz). Rendered alone, the chip's A♭4 puts −18 dB of its energy into that bin whatever its envelope or step setting: it is the analysis skirt of a short loud note, not a resonance and not a written third. The engine classes it as a "fixed resonance" because it recurs. **Handed to the engine owner:** the check has no class for the upper skirt of a written note a semitone below A.

**Stems:** chip, synth (glass pad and the Ache texture), perc (celesta and bell), strings, and bass (the sub floor).

## Audition

1. **L1 and its x3 preview.** Is it **dread or a screensaver?** With the sub now a floor, is L1 still watched, or empty? (If empty: bring `SUB_GAIN_DB` up 2–3 dB; the room check has 2.2 dB of margin in L1.)
2. **L3's first bars (40–45 s).** Does anything sound major? The flag above says it cannot, but listen.
3. **L4 (60–80 s).** Is it **thrilling or just loud?** It should accelerate by density and register, not level.
4. **The hook (82.5–85.0 s).** A glass D♭6 over the sub, cut dead, now 2 dB lower. Is it still a hook?
5. **The tokens with their new shelf.** Duller than the title's chip: still the machine, or muffled?
6. **The solo variant.** The chip alone for 85 s: the machine, politely, or data bleeps?
7. **30.0–32.5 s.** The knee reversed. A second-time listener may hear it backwards; a first-time listener must not hear a tune.

## Weaknesses

- **L1 is the riskiest level**, and fix 1 made it sparser: the sub breath is now about 19 dB lower. If it reads as a screensaver, the first step is a barely audible, low-passed high-violin F5 held under the whole level.
- **The glass pad** is a General MIDI patch (GU "bowed glass"), and the engine README warns that GM pads can sound dated.
- **The tokens are now band-limited to 2.6 kHz and shelved above 1.6 kHz** to pass the 2–6 kHz rule without the sub's help. The chip is duller than the title's chip.
- **The motif matcher can't verify the token stages**, because rests break the contiguous sequence. They are placed by `patterns.tokens` (seeded), and the whole-knee and knee-completion counts confirm the knee never closes.

## Rebuilding

```
OST_WORKERS=6 ../../../.venv-theme/bin/python track.py --verify-loop     # the suite (stems, L1 + verify), L2-L4, the variants
OST_WORKERS=6 ../../../.venv-theme/bin/python track.py --variants-only   # the five variants only (they read the suite's masters for their level)
```
`build.py mm13-outside-intended-scope` renders the suite and L1 only.
