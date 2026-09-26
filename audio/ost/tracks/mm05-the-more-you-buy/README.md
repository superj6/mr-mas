# MM-05 · The More You Buy (Nesnej / INVIDIA)

**Library suite, THE JOB (P06)** (OST-BIBLE §5.B2). **Composer:** B; fix 1 by composer A. **Status:** fix 1 (2026-09-26), re-rendered on the fixed engine. Every judgement here comes from analysis; nobody has listened to it yet.

## Fix 1 (2026-09-26): what changed

- **The A♮ on the F downbeats was not the straight mute.** The engine's new F-major trace (fix 5b) puts 98–99 % of that A energy in the **bass stem**, as one peak at 111–113 Hz (an A2). The source is the solo-contrabass pizz layer (`cb_pizz`). Its F2 is the E2 v3 sample played a semitone up, and that sample has a body resonance only 5–7 dB below its strongest partial.
  - **Fix:** a narrow notch on the `cb_pizz` layer only: Q 5, −10 dB at 112 Hz (`CB_NOTCH` in `track.py`, also in the limbo). It takes the resonance down about 9 dB. The bass stem's overall level moves 0.06 dB, and the upright, which carries the walking line, is untouched.
  - **Result:** F-major check OK in every window. The worst sieved A/F is **0.042** (limit 0.08; it was 0.09 on the fixed engine before the notch, and 0.16 on the old meter). The four downbeats the old check flagged (1.25, 5.0, 35.0, 50.0 s) were an artefact of its one-beat windows.
  - The trumpet's 1.76 kHz notch stays: it is harmless, and it keeps the mute's formant out of the dialogue band.
- **Re-rendered on the fixed engine.** The meter fix removes the false p95 warning. The pizz tuning fix changes the `cb_pizz` layer by up to a few cents, so the bass will sound very slightly different.
- **The limbo's chroma wrapper is gone.** The engine now handles the NaN case itself (fix 3).
- **The KA-CHING check** (`render/extras/`) is rebuilt from the new underscore master.
- The old masters are kept as MP3 in `render/_pre-fix1/`.

**The idea:** a sales pitch that climbs a step every bar and always closes. It is double-time swing on the 96 grid: vibes and a straight-mute trumpet over a walking bass, with the chip as the GPU clock. Where the register should ring, the band leaves a rest.

It is meant to feel like a caper with a salesman's grin, played straight. The joke is structural: **every close leaves the downbeat empty for the SFX KA-CHING** (F6 + C7). The bell resolves the band.

## Palette

**The feel.** This is **double-time swing** on the 96 grid.
- The upright bass (with contrabass pizz) walks **eighths**, which are the quarters of a 192 feel.
- The drums play the double-time ride: `x.Xo` per two 96-beats on sticks, with the hi-hat on the 192 2 and 4. In the intro and A they play brushes, tapping the same pattern.
- **The swing lives on the 16ths** (grid `swing=0.66, swing_unit=0.25`, about 61 %, a 192-BPM swing ratio). The Upsell's eighths are the 192 quarters, so they sit on the grid.
- The swing report therefore reads +7.5 frames on the eighths **by design**. The 16th offbeats are the swung ones.

**The instruments:**
- **The Upsell:** vibes (soft mallets) and straight-mute trumpet in unison.
- **The B solo:** vibes on hard mallets.
- **Piano:** Salamander grand comping, with rootless voicings on swung-16th anticipations.
- **Big band (accents only):** bari sax and trombone stabs on the closes (an F–C open fifth) and on A′'s targets. The trumpet trades in B′.
- **Chip:** the GPU clock, a 12.5 % pulse in 16th arpeggios following the changes. It rises a register every 2 bars in B and stops one beat before every sale. In B′ it plays the answer phrases (25 % pulse) and in A′ it doubles the climb an octave up. **Nothing above E♭6:** the KA-CHING owns F6 + C7 and the GLYPH grains own G6–F7.

**Harmony:** F dorian / F minor blues, with C7♯9(♭13), D♭maj9(♯11), B♭13, B♭m9 and G♭7♯11. **No A♮ is written anywhere.** Over F minor the walking bass takes D♭, not the dorian D, because a bass D2's third partial is an A.

## Motifs

- **THE UPSELL** (§2.12), note for note on vibes and trumpet in unison. The matcher finds it at bar 3 on both instruments.
  - **A:** each cell is a step higher than the last: C E♭ F→**G** | E♭ F G→**A♭** | F G A♭→**B♭** | G A♭ B♭→**C**. Each target lands on the and-of-2, a double-time anticipation. Then comes **the close**, C5 G4 F4.
  - **At the close,** the trumpet lands on C5 while the vibes land on F4, so the close is the **F–C open fifth**. The bari (F2) and trombone (C3) stab it on beat 3.
  - **A′** climbs further: B♭, C, D♭, **E♭5**.
- **The KA-CHING slots:** beat 1 after each close rests in every stem. Nothing starts there and nothing held rings into it, and the GPU clock stops one beat early. The SFX file starts on the slot's sample.
- **B′, the counter-sale:** the trumpet plays a 1-bar phrase and the chip answers **one step higher, with one more note**. The chip always outbids.
- **The tag, "sweats":** the close starts (C5 G4) and **stalls on C7♯9♭13**.
  - The trumpet swells on D♭5 (the ♭9).
  - The vibes tremble on E♭5/A♭5.
  - The GPU clock sticks alternating E♭/E, the minor or the major third: *which side?*
  - A short tutti hit lands on 28.2, and **slot 3 comes late, on 28.3**.

## Form (full, 28 bars = 70.0 s; bar *b* starts at (*b* − 1) × 2.5 s)

| Bars | Time | Section (intensity) | Music |
|---|---|---|---|
| 1–2 | 0:00 | intro (1) | Walking bass, brush taps, the GPU clock at pp. Piano joins in bar 2. The fader ride is −2.5 dB. |
| 3–7 | 0:05 | **A** (2) | The Upsell's four cells and the close. **The stab lands at 0:16.25.** |
| **8.1** | **0:17.5** | **SLOT 1** (frame 420, sample 840 000) | Rest. Then the bass walks up C D♭ E♭ E G E into F, with a snare pickup. |
| 9–14 | 0:20 | **B** (3) | Sticks. A vibes solo built from the Upsell's stepwise climbs. The chip rises. |
| 15–20 | 0:35 | **B′** (2) | Trumpet ↔ chip trades, each chip answer one step up. |
| 21–25 | 0:50 | **A′** (3) | The climb to E♭5, with stabs on each target and the chip doubling at the octave. The close stab lands at **1:01.25**. The fader ride is +1.5 dB. |
| **26.1** | **1:02.5** | **SLOT 2** (frame 1500, sample 3 000 000) | Rest, then the walk-up. **This is the loop seam.** |
| 27–28 | 1:05 | tag (3) | The stall at 1:06.25; the last hit at 1:08.125. |
| **28.3** | **1:08.75** | **SLOT 3, late** (frame 1650, sample 3 300 000) | The cue ends in the slot. On picture, the bell resolves C7 to F. |

**Loop:** bars 3–26, **60.0 s = 1440 frames** exactly, seamless. A′'s last bar walks back into A, and the fader ride is at 0 dB on both sides of the seam. Files: `render/…-loop.wav`, `…-loop-tail.wav` and `…-loop-x3-preview.mp3`.

**Clean endings:** slot 1 (0:17.5) and slot 2 (1:02.5) are natural stops. Cut there and let the KA-CHING be the button.

## Variants (`python track.py --variants` → `render/variants/`)

| Variant | Length | What it is for |
|---|---|---|
| `mm05-the-more-you-buy-trio` | 70 s, same loop | Piano, bass, drums and the GPU clock only, with no melody, brass or chip lead. **The bed to cut under dialogue.** The slots stay. |
| `mm05-the-more-you-buy-limbo` | 20 s, an 8-bar loop | **Ep2, "the limbo under the cut line."** For once the cells go **down**: the Upsell inverted (−2, −1, −1 scale steps), each bar a step lower. Normal walking time on brushes. The mute trumpet gives up after 4 bars and the bari carries the descent under the line. No sale, no slot. |
| `…-cut30` | 30.0 s | Intro, A and slot 1, two trade bars, then the stall and the late slot |
| `…-cut15` | 15.0 s + the slot | The four cells and the close, ending in the slot |
| `…-cut05` | 5.0 s + the slot | The last cell and the close, ending in the slot |

**Variant measurements** (underscore; p95 is the correct short-term):

| Variant | Underscore | Balance (piano · orch · big band · chip) | 2–6 kHz | p95 | Loop |
|---|---|---|---|---|---|
| Trio | −20 | 47 · 0 · 0 · 53 | −18.5 dB | −18.8 | seamless, 1440 frames |
| Limbo | −20 | 23 · 41 · 10 · 26 | −18.1 dB | −19.3 | seamless, 480 frames |
| cut30 | −20 | 25 · 15 · 26 · 33 | −15.0 dB | −18.7 | — |
| cut15 | **−16 (featured)** | — | — | −15.2 | — |
| cut05 | **−16 (featured)** | — | — | −15.5 | — |

**Fix 1:** the F-major check is OK on every variant (worst sieved A/F 0.021–0.029). Before the `cb_pizz` notch, the trio, limbo, cut30 and cut15 failed it (0.083–0.379).

- **Why cut15 and cut05 are featured:** they are buttons into the bell, not beds under dialogue, so the 2–6 kHz limit for dialogue (−13.9 and −12.6 dB here) does not apply.
- **The limbo build no longer patches the engine.** The old `_robust_chroma` wrapper for the `_fund_chroma` NaN crash is removed, because the engine fixed the crash itself (fix 3, 2026-09-26).

**Extras:** `render/extras/mm05-the-more-you-buy-kaching-check.mp3` is the underscore master with the real `sfx/wav/ka_ching.wav` laid at all three slots (at −3.5 dB). It is **for audition only, not a deliverable.**

## Measured (`render/mm05-the-more-you-buy.cue.json`)

| Check | Result |
|---|---|
| Masters | Album −14.0 LUFS / −1.15 dBTP. Underscore −20.0 LUFS / −3.15 dBTP. The stems sum to the underscore master to −164 dB. |
| Loudness | LRA 3.6 LU. Short-term (the engine's meter, fixed): p95 −18.5, median −20.0. |
| Slots | Level in the first 150 ms of each slot, relative to the beat before: slot 1 −13 dB, slot 2 −16 dB, slot 3 −16 dB. After 150 ms each is −19 to −20 dB. These are natural band cut-offs, not gated. |
| Hits | All markers within ±10 ms. The two close stabs read −10.0 ms, at the edge of the tolerance: the trumpet's 12 ms latency pre-compensation probably leads slightly. |
| Harmony | No written A anywhere (`written_third` 0). **F-major check OK** (fix 1): 25 F-bass windows, worst sieved A/F 0.042 (limit 0.08). No third on the closes: A 0.019 and 0.014 of F. Whole knee 0; knee completion by pitch class 0. |
| Balance | **24 · 21 · 21 · 34** (piano · orch · big band · chip), against a target of 25 · 15 · 25 · 35. By energy (the fixed meter): 18 · 23 · 19 · 39. |
| Spectrum | 2–6 kHz −16.1 dB. Centroid 398 Hz. |
| Loop | Seam seamless. Verify −56.0 dB overall; drums and vibes read about −50, from the tag's humanised lead-in reaching back into pass 2. |

**The build has no warnings** (fix 1). The batch-1 build had two:
1. **"Short-term p95 −14.6 > −17"** was the engine meter's bug, and the engine fixed it on 2026-09-26.
2. **"F-major check: 4 windows"** was partly the old check's one-beat windows. What remained was real: the contrabass-pizz layer's A2 body resonance on the F2 downbeats, not the straight mute. It is now notched (see *Fix 1* above).
   - The trumpet's 1.76 kHz notch from batch 1 stays.

## What to audition (in order)

1. **The slots at 0:17.5, 1:02.5 and 1:08.75,** in `extras/…-kaching-check.mp3`. Does the sale **close**, or does it sound like a dropout? Is the late third bell funny, or does it feel like a sync error? (Bible §7, item 9.)
2. **0:00–0:20.** Does double-time swing on the 96 grid **sit** as a brisk 192 feel, or lurch? This is the brief's own question.
3. **0:15–0:17.5,** the close and the stab. It should read as an accent, not a big-band hit. No *Pink Panther*, no lounge.
4. **0:35–0:50,** the chip answering one step higher. Is it witty, or cute? Does anything sound Nintendo?
5. **1:05–1:08.75,** the stall. Is it sweat, not slapstick? Do the trumpet's D♭5 swell and the E♭/E chip read as nerves?
6. **The loop preview at 1:00 and 2:00.** Does the walk-up into A seam cleanly?
7. **`variants/…-limbo`.** Does it read as the same tune going the wrong way, rather than a sad version?
8. **Fix 1, the F downbeats** (5.0, 10.6, 35.0, 50.0 and 65.0 s). With the contrabass-pizz layer notched at 112 Hz, does anything still sound major? Is the walk still woody?

## Weaknesses

- **The vibes solo and the trades are composed, not improvised.** They are lines built from the Upsell. A human may find the solo too "written".
- **The contrabass-pizz layer is notched at 112 Hz** (fix 1). It is the attack layer under the upright, 8 dB down, so the walking bass should sound the same. An ear should confirm that the F downbeats (for example 10.6 s and 65.0 s) haven't lost their wood.
- **The walking bass is generated** by a rule-based walker (chord tones, scale runs, chromatic approaches). Bars 7–8, 25–28 and the walk-ups are written by hand. The walker makes some wide octave jumps where a line leaves the G1–F3 range.
- **The GM bari sax** (GeneralUser GS) is the weakest sample in the cue. It only plays short stabs and, in the limbo, a short line.
- **The chip is the loudest group** (34 %), which is what the brief asks for. Even so, under dialogue the GPU clock may need 2–3 dB less. The trio bed has the same clock.
- **No word windows.** "The more you buy…" is a real line, so this suite must be **cut** around it: use the slot ends, the cut-downs, or the trio.
