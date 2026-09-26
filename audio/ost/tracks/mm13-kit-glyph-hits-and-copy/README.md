# MM-13 kit · GLYPH hits, Q\* and THE COPY

**Composer D** (batch 1); **fix pass 1 by composer B, 2026-09-26.** The kits from OST-BIBLE §5.D2, companion to the suite [`../mm13-outside-intended-scope/`](../mm13-outside-intended-scope/README.md).

## Fix pass 1 (2026-09-26): what changed

- **The sub is a floor now, as in the suite.** The `subp` track is 9 dB lower (gain −3 → −12 dB) with a low shelf of −11 dB at 90 Hz. The hits' sub read −3.6 to −12 dB of the total power below 60 Hz (H11, the sub-drop hit, was worst); §6.5 wants ≤ −18 dB under `room_drone` and `server_hum`. Q\*'s F2 swell comes down with it: the vault's own F hum is the root there.
- **Room windows are marked on every slot** (META `room_sfx`): the twelve hits (his room, `room_drone`), Q\* (`server_hum`, the vault) and the nine COPY slots (the dark room). All 22 pass on the full mix, so dropping the bass stem is optional.
- **H02's harp front is 3 dB lower.** Engine fix 2 makes a soft harp note play the tuned `mf` sample at a soft level instead of the old mis-tuned G1 `mp` sample stretched by up to 3 octaves; H02 came out 2.8 dB louder (−15.0 LUFS-M, over the −17 to −16 target). It now reads −16.5.
- **Re-rendered on the fixed engine** (the corrected meter, the harp tuning, the new render pool, the QA checks 5a–5d). The batch-1 master MP3s are in `render/_pre-fix1/`.

- **Format.** A kit, not a cue: every item has its own slot on a bar line, and the slots are separated by hard stops (digital silence, tails cut).
- **Tempo and feel.** 96 BPM, straight, with 0 ms of humanising.
- **Registers and tokens** follow the suite's rules: {F G A♭ C D♭} at F4–D♭6.
- **Listening.** Nobody has listened to this kit; every choice below was set by measurement.

## How to use it

- **Hits and Q\*:** cut the underscore master or the stems at the slot boundaries in the table below.
- **THE COPY:**
  - **Use the CHIP stem only.** It is digitally silent at every slot boundary.
  - Lay the slot start on MM-01's Water Line downbeat, and the lag is built in.
  - The **PIANO stem is a GUIDE** (the felt Water Line at the reference) so a human can hear the lag. **Never mix it.**
- **Sub:** it is on the BASS stem, and since fix 1 it is quiet enough to stay under `room_drone` or `server_hum` (every slot ≤ −19.9 dB below 60 Hz). Drop the stem only if you want the room's low F alone.

## Slots (file seconds)

| Slot | Start | Item | Level |
|---|---|---|---|
| H01 | 0.0 | L1 **the scan**: grains F5 → C6, sub puff | −16.8 LUFS-M |
| H02 | 5.0 | L1 **the iris**: the Ache blinks (harp front, D♭6 grain) | −16.5 |
| H03 | 10.0 | L1 **the lamp**: open fifth F–C, D♭6 grain | −15.8 |
| H04 | 15.0 | L2 scrambled burst (A♭ F C G) in glass F–C–G | −15.6 |
| H05 | 20.0 | L2 **the knee reversed** (F C A♭ G F F F F) | −16.1 |
| H06 | 25.0 | L2 the chord with no third (F C G), sub | −16.5 |
| H07 | 30.0 | L3 **almost** (F F F F G A♭ D♭), violins F–C–G | −16.3 |
| H08 | 35.0 | L3 the Ache held, D♭6 grain | −16.6 |
| H09 | 40.0 | L3 **re-rendered**: glass F swapped for its sample-chip copy at 40.78 | −19.0 |
| H10 | 45.0 | L4 **the runaway** burst (past the knee's end) | −16.9 |
| H11 | 50.0 | L4 sub swell into a glass D♭6 (the stab at 50.94) | −16.3 |
| H12 | 55.0 | L4 the stream (dense, rising) | −16.2 |
| QSTAR | 60.0 | 1 bar: glass F3–C4–F4 swells with the vault's F hum; D♭5 enters on beat 3; **cut dead at 62.5** (then the button chord) | −16.6 |
| C1a | 65.0 | Ep1 sc 19: **a beat late**; breaks off after 2 notes (two fingers). COPY in at 65.625 | chip −27.9 LUFS-S |
| C1b | 72.5 | Ep1: a beat late; breaks off after 3 notes (a pinky). In at 73.125 | −25.8 |
| C1c | 80.0 | Ep1: a beat late; breaks off after 4 notes (a hand). In at 80.625 | −24.6 |
| C2 | 87.5 | Ep2: a beat late, **in three-part harmony** (the sycophant) | −21.1 |
| C3 | 95.0 | Eps 3–5: **an eighth late** | −22.8 |
| C4 | 102.5 | Eps 6–8: **a sixteenth late** | −22.8 |
| C5 | 110.0 | Ep9: **in sync, quantised** (a straight nudge against his swung one) | −22.9 |
| C6 | 117.5 | Eps 10–11: **in sync, with his swing** | −22.9 |
| C7 | 125.0 | Ep12: **a sixteenth ahead**, better voiced (triangle 8vb, open fifth at the cadence). Its pickup is at 124.84, inside the silence of the previous slot | −24.6 |

The level targets from the bible:
- **Hits:** −17 to −16 LUFS-M.
- **COPY:** −24 LUFS-S (a hint).

(Hit levels are the corrected meter's 400 ms maximum on the underscore master; the COPY levels are the 3 s maximum of the chip stem.)

## Measured (fix-1 render)

| Check | Result |
|---|---|
| Underscore · album | −21.0 LUFS-I, −3.15 dBTP · −16.0 LUFS-I, −1.15 dBTP |
| Warnings | 1: the F-major flag at H07 (below) |
| Markers | 21, all within ±8 ms |
| Hits | Each ≤ 2.0 s, hard-cut with tails |
| Hard stops | 22, all digital zero |
| Sub (< 60 Hz) under the room SFX | every slot ≤ −19.9 dB (H11); limit −18 |
| Written third | none |
| F-major, spectral | **1 window flagged: H07, 30.5 s** (below) |
| Whole knee · knee completion | 0 · 0 |
| 2–6 kHz | −17.1 dB |
| Short-term (corrected meter) | p95 −20.4 |
| Stems | Sum to the underscore at −171 dB |

**The H07 flag is the chip's A♭4, not an A.** H07 is L3's "almost" run (F F F F G A♭ D♭). In its second beat the F is barely heard and the token A♭4 (415 Hz) puts energy into the analysis's A bin at 429–448 Hz, its upper skirt, exactly as in the suite's L3. Nothing is written on A. Handed to the engine owner with the suite's case.

## Audition

1. **C1a–C1c against MM-01** under Ep1 sc 19. Is the one-beat-late COPY noticeable **only on a second viewing**? That is the target.
2. **H01–H12 against picture and the SFX glyph grains.** They should be dread blinks, never UI bleeps; the SFX own dings, chimes and clicks.
3. **QSTAR with `vault_hum_F` laid in.** Does the glass become the hum? Is the cut at 62.5 dead enough for the button chord?
4. **C2.** Cloying on purpose, or just pretty?
5. **C7.** Does it sound like it knows the tune before he plays it, or like a sync error?
6. **H09.** Does it read as the world being re-rendered, or as a glitch?
7. **H02 and H08 (fix 1).** The soft harp fronts now come from the tuned `mf` samples at a soft level: are they too bright for "the iris" and the held Ache?
8. **The hits with a sub** (H01, H03, H05, H06, H08, H10–H12) with the sub 19 dB lower: does H11's "sub drop into a glass D♭6" still drop? With `room_drone` laid in, the room should supply what the score gave up.
9. **H07 at 30.5 s:** does anything sound major? (The flag above says no.)

## Weaknesses

- **The slot-boundary leak.** The engine's hard stop fades back in over the last 3 ms of each slot, so the previous item's reverb tail leaks at −58 to −75 dBFS in the master, guide and hit stems. The chip stem (the COPY) reads −240 dBFS there. It is inaudible, but slice with a 5 ms head fade.
- **C2 sits 3 dB over the hint**, because the three voices add up. Pull the harmony lines down if it reads as more than a hint.
- **C1a is quiet** (−27.9), because it is only two short notes.
- **`vault_hum_F` is a new SFX** that isn't in the manifest yet. QSTAR assumes the hum's root is F (octave unknown) and needs a check with the real file.
