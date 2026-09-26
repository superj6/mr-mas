# MM-02 · His Version (the KEYNOTE REEL)

Composer E, OST batch 1 (OST-BIBLE §2.3, §5.E2 b); fix pass 1 by composer B. This is the library version. The Ep1 one-bar insert is `tracks/e01-s29-d5`. Nobody has listened to it; everything below was measured.

**Tone.** This is Mas's version of events, and his brand music in the world (Ep2: under Rima's demo). It is the Water Line made pretty: D♭ major, straight, too still, on his own felt piano with everything human removed. It should be pretty in the wrong way. The parody is in the polish; it is never a sincere ad and never a wink.

## Palette (`keynote.py`, shared with the insert)

- **The piano:** the same Upright KW as his real felt.
  - With no mechanics, no room send, 0 ms timing and even velocities: every note is locked, and the jitter is 0.
  - Polished: a glossy hall plus plate, a brighter "finished" EQ (`felt_post_bright` plus air) and full stereo width.
  - Measured against MM-01's real felt: centroid 458 Hz vs 387 Hz, 2–6 kHz +7.5 dB, side/mid +4 dB.
- **The pedal** is re-caught exactly on every bar line: a too-perfect pedal.
- **Not used:** no chip, no bass instrument, no drums and no swing. There is one chord per bar and no rhythmic motion except the tune.
- **Harmony** per 4 bars: D♭maj9(♯11) | A♭/C | G♭maj7(♯11) | D♭/A♭.
  - §2.3 sketches the last chord as "D♭/F …". Here the bass never lands on F, his real home.
  - That also keeps the upright's low-F 5th partial from reading as an A in the §6.9 check. With F in the bass it read 0.20–0.51; now it reads 0.0.

## Form (bar n starts at (n−1) × 2.5 s)

| Bars | Time | Pass | What changes |
|---|---|---|---|
| 1–4 | 0–10 s | 1 | KEYNOTE (D♭5 D♭5 D♭5 E♭5-D♭5 \| A♭4 D♭5), then the answer a fifth lower on A♭. One plain chord per bar. |
| 5–8 | 10–20 s | 2 | One voice more (the 9ths), and an octave more at the bottom. |
| 9–12 | 20–30 s | 3 | Wider: the tune in octaves, a halo voicing above it, and chords rolled by an even 18 ms. |
| 13–16 | 30–37.8 s | 4 | The most confident: octaves plus a parallel-fourths voice. |
| 16.1.5 | **37.8125 s** | CUT | The tune is **cut mid-note**, before the answer can settle: a hard stop with the tails cut to digital zero. It ends cut even on the album. |

The loudness climbs pass by pass, −23 → −20 LUFS-S per bar, as confidence rather than a crescendo.

## Loops and cut points

- **There is no loop,** by design: the cue grows with every pass.
- **Editor cut points that land mid-note:**
  - beats 2.5–4.5 of bars 2, 6, 10 and 14 (the held D♭5). In bar 2 that is 3.44–4.69 s.
  - the same beats of bars 4, 8 and 12 (the held A♭4).
- **Never cut on a bar line.** The pedal is re-caught there, so the cut would fall between chords.

## Fix pass 1 (2026-09-26)

Re-rendered on the fixed engine by composer B, who now owns this folder. **The music is unchanged**: the felt upright is not one of the re-tuned sample sets, and the render measures the same as batch 1 (loudness, peak, spectrum). The engine's false short-term warning is gone (it now reads −18.7, as this README always said). The batch-1 master MP3s are in `render/_pre-fix1/`. MM-10's new album edit borrows this cue's KEYNOTE bar (pass-1 voicing, the D5 insert's notes) for its "his version" bar.

## Measured (fix-1 render)

| Check | Result |
|---|---|
| Album master | −16.0 LUFS-I, −1.8 dBTP |
| Underscore master | −20.0 LUFS-I, −5.5 dBTP |
| Short-term (the engine and the editor agree) | p95 −18.7 |
| Written third · knee completion | none · 0 |
| Hard stop | −240 dBFS |
| KEYNOTE found | ×8 (every phrase) |
| Checks | F major OK (0.0) · knee whole 0 |
| Markers | within 5.3 ms |
| Stems | piano only; sums at −240 dB |
| Spectrum | 2–6 kHz −33 dB, centroid 485 Hz |

## What to audition

1. **0–10 s:** is it pretty in the wrong way, parody by polish? Does it avoid being a sincere ad, or a wink?
2. **This file 0–5 s against MM-01 5–10 s:** is his line recognisable under the major-key gloss?
3. **10–37 s:** does each pass read as a shade more confident, not as a build to a climax?
4. **37.81 s:** does the cut mid-note land as the correction, rather than a playback fault?
5. **The timbre against MM-01's felt:** does "too clean" read?

## Weaknesses

- **Even velocities and 0 ms timing on a sampled upright** can sound like MIDI rather than "a keynote". The line between too clean and cheap is exactly what the audition has to judge.
- **The answer phrase on A♭** is my own sequence of the KEYNOTE, not a §2 table motif.
