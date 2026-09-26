# E01-S30a · The Door (the STRAIGHT violin)

Composer E (OST-BIBLE §5.E1 a); fix pass 1 by composer B. This is the editor's own violin track for Ep1 sc 30's opening: "MUSIC: one sad violin, played straight, under the post only." It is the one scripted exception to the dry rule. MM-11 contains the same violin with its default stop. Nobody has listened to it.

## Use

- **Lay the file at act frame 8310** (lock v2, 30.01 f15), where ALYI starts reading his post (a4-30-01, spoken, 8310–8435).
- **Cut it on the first heart** with a 3 ms fade and no tail.
  - The lock's animatic puts the first heart at **act 8439 (30.01 f144) = 5.375 s** into this file.
  - The hearts rise "at the post's own pace", off the grid, so the editor owns the stop.

**Pre-cut alternates** (3 ms fade, then digital zero, tails cut; each is written after the render by `python track.py`):

| File (`render/`) | Stop, act frame | Seconds into the file | What it is |
|---|---|---|---|
| `…-stop-f8439.wav` | 8439 | 5.375 | The lock's first heart |
| `…-stop-f8427.wav` | 8427 | 4.875 | Half a beat early |
| `…-stop-f8451.wav` | 8451 | 5.875 | The 2nd heart |
| `…-stop-f8466.wav` | 8466 | 6.500 | The 3rd heart |

Every stop is mid-note: the level just before the cut is −23 to −30 dBFS, and it is digital zero after.

## Sound

- **The Door (§2.9), an octave below the flute's pitch:** A♭3 D♭4 | C4, then G3, the Door's ♯4, held. It never cadences.
- **Played on the G string,** so the held note is the **open G**: the plainest sound a violin makes.
- **Why an octave down:** Alyi's post is spoken, so the 2–6 kHz rule applies. At the written octave the solo violin read −8 dB in 2–6 kHz, against a −15 limit, even heavily EQ'd. It now reads −23.8 dB.
- **SENZA VIBRATO:** the only solo violin in the library (VSCO 2 CE Arco Vib) is de-vibrato'd by `../mm11-the-return/senza.py`.
  - A pitch track every 2.5 ms, then variable-rate re-reading.
  - The vibrato band (3.5–8 Hz) comes down 11–16 dB on every sample; the G3 sample is already nearly still.
- **No portamento, no swell, no chip, no accompaniment.** The level is flat and each note is its own bow.

## Fix 2b (2026-09-26): the violin retuned

Re-rendered by the engine owner, with the four pre-cut stops re-written from the new underscore master. The fix-1 master MP3s are in `render/_pre-fix2b/`; nothing is re-timed.

- **What changed.** `../mm11-the-return/senza.py` reads the VSCO files itself, so the violin had no tuning correction at all. The engine's fix-2b measurement (`library.TUNING['svln']`) finds the C4 p sample **23 cents sharp**, and the Door's D♭4 and C4 both come from it. `senza.py` now applies the table.
- **Measured on the new underscore master:** A♭3 +1.0, D♭4 +0.4, C4 −0.7 and G3 +1.1 cents. Before the fix, the same notes measured −2.0, +21.6, +17.4 and −1.9 cents in MM-11, which is the same violin.
- **The levels are re-normalised to the same targets.** The one measurable side effect is in the spectrum: the retuned, near-pure tone meets the hall send at another point of its frequency response, so the 2–6 kHz share rose 2.3 dB. It is still far under the V.O. limit.

## Fix pass 1 (2026-09-26)

Re-rendered on the fixed engine by composer B, who now owns this folder; the four pre-cut stops were re-written from the new underscore master. **The music is unchanged**: the solo violin is not one of the re-tuned sample sets (the engine owner measured it but did not correct it), so the render measures the same as batch 1 (loudness, peak, spectrum). The batch-1 master MP3s are in `render/_pre-fix1/`.

## Measured (fix-2b render)

| Check | Result |
|---|---|
| Underscore master | -22.0 LUFS-I (§5.E1: a at −22), -13.42 dBTP |
| Album master | -18.05 LUFS-I, -9.1 dBTP |
| Short-term (corrected meter) | p95 -20.11 |
| Spectrum | 2–6 kHz -21.5 dB (was −23.8; the V.O. limit is −15), centroid 653 Hz |
| DOOR found | yes |
| Written third · F-major spectral · whole knee · knee completion | none · OK · 0 · 0 |
| Engine warnings | none |
| Pitch (fix 2b) | A♭3 +1.0, D♭4 +0.4, C4 −0.7, G3 +1.1 cents (was about +22 on the D♭4 and C4) |

## Audition

1. **0–5.4 s under a4-30-01:** is it sincere and plain? It must never read as "world's smallest violin": no sob, no sweetness.
2. **`-stop-f8439.wav`:** does the dead stop on the first heart get the laugh, or does it sound like a glitch?
3. **The de-vibrato'd tone:** is it still a player (bow noise, a little intonation drift), not a synth?
4. **Fix 2b, the retuned D♭ and C** (22 and 17 cents lower): A/B against `render/_pre-fix2b/`. Is it in tune now?
