# E01-S29-D5 · [MAS'S VERSION] (the MM-02 insert)

Composer E (OST-BIBLE §5.E2 a); fix pass 1 by composer B. This is the one-bar KEYNOTE REEL under Ep1 sc 29's `[MAS'S VERSION]` [ECU] (29.01a). Composer D's MM-10 leaves that bar empty. Nobody has listened to it.

## Use

- **Lay bar 1 under the shot.** In lock v2 that is 29.01a, act frame 6060 (an act bar line).
- **Cut at bar 2's downbeat:** 2.500 s into the file, 60 frames.
  - At the cut, the D♭5 from beat 4.5 and the D♭maj9(♯11) chord are both still sounding (pedal down), and nothing attacks until 3.75 s. So the hard cut lands **mid-note**.
  - There is no fade in the file. The cut is the editor's: 3 ms, tails cut (§6.6 rule 4).
- **Everything after 2.5 s is handle:** A♭/C and the settle, a beat late, so a late cut still lands mid-phrase.

## Sound

- It uses the too-clean felt from `../mm02-his-version/keynote.py`: no mechanics, no room, 0 ms timing, even velocities, a glossy hall, straight, in D♭ major, with no chip, bass or drums.
- It is voiced at pass 1, the plainest, because this is the season's first D5. Each later D5 is a shade more confident.

## Fix pass 1 (2026-09-26)

Re-rendered on the fixed engine (the corrected loudness meter, the sample tuning, the new render pool, the new QA checks), by composer B, who now owns this folder. **Nothing in the music changed**: the felt upright is not one of the re-tuned sample sets, so the render measures the same as batch 1 (loudness, peak, spectrum). The engine's false short-term warning is gone. The batch-1 master MP3s are in `render/_pre-fix1/`.

## Measured (fix-1 render)

| Check | Result |
|---|---|
| Underscore master | −20.0 LUFS-I, −3.15 dBTP |
| Album master | −16.0 LUFS-I, −1.15 dBTP |
| Short-term (the engine's corrected meter and the editor's agree) | p95 −18.7 |
| Written third (every note boundary) · F-major spectral | none · OK (worst 0.0) |
| Whole knee · knee completion (pitch class) | 0 · 0 |
| Spectrum | centroid 459 Hz, 2–6 kHz −31.8 dB |
| Stems | piano only; sum to the underscore master |
| Engine warnings | none |

## Audition

1. **0–2.5 s, then the cut at 2.5 s:** does the hard cut land mid-note as the correction (the lie interrupted), rather than a glitch?
2. **Pretty in the wrong way:** against the real felt either side of it in MM-10a.
