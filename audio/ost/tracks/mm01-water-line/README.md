# MM-01 · Water Line (Mas's theme)

Composer E, OST batch 1 (OST-BIBLE §5.E2); fix 1 by composer A. A library suite in the **DARK ROOM** palette (P01). Nobody has listened to it; every level and check below was measured.

## Fix 1 (2026-09-26): what changed

**The target.** Balance, only where it doesn't hurt the cue: **71 · 16 · 2 · 10 → 61 · 27 · 3 · 8** (piano · orch · big band · chip), against P01's 55 · 25 · 5 · 15. By energy it is 65 · 25 · 2 · 8.

**The changes:**
- **Strings +2 dB** (violas and cellos, `gain_db` 1 → 3). They are still sul tasto guide tones, with soft attacks, low-passed and without swells. P01 forbids string swells for feelings, so the level rose and nothing moves more.
- **In A's second statement (b7–8) the violas join the cellos,** as they already do in A′. So the strings creep in: none in A1, cello and viola in A2, both statements in A′.
- **The Harmon +2 dB** (`gain_db` −5 → −3). It is still the one line in B.
- **The V.O. windows' felt is a touch fuller** (velocity 0.40/0.37 → 0.48/0.45), because the louder sections around them would otherwise push the windows under −26. They now read **−24.8, −25.2 and −24.9** LUFS, where they were −25.4, −25.9 and −25.5: all nearer the −24 centre.

**Not changed, and why:**
- **The chip stays where it was** (8 %, against 15). P01 allows the chip one voice, doubling one note, **≤ −10 dB under the piano**. In A′ it already sits only 7.8 dB under by this metric, and in B the brief's triangle counter-line is almost level with the felt. More chip would break the palette rule, so the remaining gap to the target goes to the piano.
- **The felt-alone bars** (intro, the three V.O. windows, the coda: 14 of 30 bars) stay felt alone, as the brief says. They are why piano can't come down further.

**Also:**
- **The engine's sub check (fix 5d)** now runs. META `room_sfx` marks every section as possibly under the SFX `room_drone`, with `room_sfx_drop_stems = ['bass']`. The sub band reads −33 to −38 dB under the total in every section (the limit is −18), even with the bass stem kept.
- **The 5 s cut-down's tail fade is now in the score** (`end_fade`, 5.0 → 6.2 s). The editor's hand fix is no longer needed after a re-render. The editor's originals are still in `render/_pre-editor/`.
- **Re-rendered on the fixed engine**, with stems and the loop verified. The old masters are kept as MP3 in `render/_pre-fix1/`.

**Tone.** Calm, alone, and sure of himself at 2 a.m. It is not sad. The Water Line is the only complete motif in the show, so the cue never reaches for anything. The felt leads and everything else asks leave to join.

## Palette

- **Felt upright:** the theme's Upright KW with its key mechanics (`felt_mech`), swung at the house +10 frames. The left hand is on its own `felt_lh` track so the motif matcher can read the melody.
- **Upright bass:** pp, in a two-feel (the half-time feel).
- **Brushes:** a sweep, with taps on 2 and 4.
- **Strings:** violas and cellos, sul tasto (soft attacks, low-passed). They carry the kink and the guide tones.
- **Harmon trumpet:** one line (b13–16).
- **Chip:** a triangle counter-line in B; in A′, the 50 % square doubling only the nudge (G4), plus a triangle an octave down on the settle.
- **The verdict:** vibes and celesta.
- **Not used:** no brass swell, no sad cello double, no F6 bell, no third at any cadence, and no F major.

## Form (album and underscore; bar n starts at (n−1) × 2.5 s)

| Bars | Time | Section | What happens |
|---|---|---|---|
| 1–2 | 0–5 s | Intro | The flat line and the nudge on the felt alone, over a third-free left hand. The nudge's F is held into bar 2 over D♭maj7, so **the settle is withheld**. |
| 3–10 | 5–25 s | A | Statement 1 over Fm9 (trio). **V.O. window** b5–6 (10–15 s, felt alone, D♭maj7). Statement 2 over B♭m9, with a cello guide tone creeping in. **V.O. window** b9–10 (20–25 s): C7sus(♭9), where the ♭9 settles into the sus. |
| 11–18 | 25–45 s | B, "the night" | The kink G–A♭–C in the violas (b11), never taken. A cello and viola bed underneath. The chip triangle counter-line. **The Harmon line** b13–16 (30–40 s). **The verdict** F5 → C6 at b17 (40.0 s), over an open fifth. The cellos touch the kink again at b18. |
| 19–26 | 45–65 s | A′ | The motif returns with the chip square on the nudge only (47.3 s, 57.3 s). Cellos and violas hold guide tones. **V.O. window** b21–22 (50–55 s). |
| 27–30 | 65–75 s | Coda | The flat line, then C4 → F4 on an open fifth (F3 C4 F4) at 68.1 s. It rings out. |

## Loops, endings, variants

- **Loop:** bars 3–26, 5.000–65.000 s, which is 60.000 s or 1440 frames. It is seamless, and `--verify-loop` reads −64 dB.
  - Files: `render/mm01-water-line-loop.wav`, `-loop-tail.wav` and `-loop-x3-preview.mp3`.
- **Endings:** cut after b10 (25.0 s), b18 (45.0 s) or b26 (65.0 s). Each is a held suspended chord that rings out on its own. They are marked in the cue sheet.
- **Variants from the stems:**
  - felt alone (V.O.-safe) = `piano`;
  - trio = `piano` + `bass` + `drums`;
  - full = all.
- **Under the SFX `room_drone` or `server_hum`:** mute the `bass` stem. Every other part stays at or above C3 (P01's "nothing below C3").
- **Cut-downs and the STRAIGHT variant** (`python track.py --variants`, no stems):

  | File id | Length | What it is |
  |---|---|---|
  | `mm01-water-line-30s` | 12 bars | A plus the coda |
  | `mm01-water-line-15s` | 6 bars | One trio statement, the D♭maj7 window, the cadence |
  | `mm01-water-line-05s` | 2 bars | The whole Water Line, felt alone |
  | `mm01-water-line-straight` | 8 bars | The Water Line ×2 on cellos, straight, with no chip and no piano, for a sanctioned sincere beat |

## Measured (final render)

| Check | Result |
|---|---|
| Album master | −16.0 LUFS-I, −1.31 dBTP (a quiet cue; §6.5 allows −16) |
| Underscore master | −20.0 LUFS-I, −5.0 dBTP |
| Short-term (the engine's meter, fixed) | p95 −17.8 (limit −17), median −21.2, no warning |
| V.O. windows | −24.8, −25.2 and −24.9 LUFS (target −24 ±2; batch 1: −25.4, −25.9, −25.5) |
| Checks | Written third 0. F-major OK: the worst sieved A/F is 0.108, in a window whose F is under 5 % of the pitched energy, so not judged. No-third windows OK (A ≤ 0.026). Whole knee 0, knee completion 0. WATER_LINE found ×4, VERDICT ×12. The felt swings at +10.0 frames. |
| Sub under the room SFX (fix 5d) | −33.5 to −37.7 dB under the total in every section (limit −18), with or without the bass stem |
| Markers | within 6.7 ms |
| Stems | sum to the master at −166 dB |
| Loop | seamless; `--verify-loop` −65.0 dB (piano −61.6, every other family ≤ −131; see the engine note) |
| Spectrum | 2–6 kHz −20.6 dB, centroid 431 Hz |
| Balance | **61 · 27 · 3 · 8** (energy 65 · 25 · 2 · 8) against P01's 55 · 25 · 5 · 15; batch 1 was 71 · 16 · 2 · 10. See the weaknesses. |

## What to audition

1. **0–5 s:** is it calm and sure, not sad? Is it identifiable within 2 bars?
2. **5–10 s and 15–20 s:** does the trio swing like people, with the push chords reading as jazz rather than lounge?
3. **The V.O. windows (10–15, 20–25, 50–55 s),** with a stock voice on top.
4. **30–40 s:** the Harmon line is "the night" and never a quote. Is the chip triangle identity, not a toy?
5. **40.0 s:** the verdict. Is it the Orb (an open fifth, no third)?
6. **The x3 preview at 60 s and 120 s:** the loop seam.
7. **Fix 1, the new balance.** Listen to 17.5–25 s (A's second statement, now with violas) and 25–45 s (B, strings and Harmon each 2 dB up). Is it still "everything else asks leave to join"? Do the strings stay the world far off, not a cushion under his feelings? Is the Harmon still the night, not a feature?

## Weaknesses

- **Balance is still felt-heavy** against the palette target (61 · 27 · 3 · 8 against 55 · 25 · 5 · 15, after fix 1). The brief itself keeps 14 of the 30 bars felt-only (the intro, the V.O. windows and the coda). P01 caps the chip at one doubled note ≤ −10 dB under the piano, so the chip can't take up the difference.
- **The spectral centroid (415 Hz) is just under the 450 Hz guide.** It is dark by design, like the felt in the title.
- **There is no true solo cello** in the sample library. The STRAIGHT variant uses the VSCO cello section at pp, which is a section sound; audition it.

## Engine note: short-term loudness was over-read (fixed in the engine on 2026-09-26, fix 1; kept for the record)

`engine/mix.py short_term_lufs()` (and `analysis._k_power`) apply pyloudnorm's K-weighting with
`f.apply_filter(y)` on a `[samples, 2]` array. `scipy.signal.lfilter` filters along the last axis, so it filters
across the two channels, not along time. Every short-term reading comes out about 3.5 dB high: the underscore
p95 warning, the LRA, the piano roll's loudness curve and `balance_energy`. The `balance` measure itself and the
integrated loudness are unaffected. The figures in this README re-measure short-term loudness with per-channel
filtering; the engine's warning in the cue sheet is the inflated reading. The fix is `lfilter(..., axis=0)`,
one filter per channel.

The loop's `--verify-loop` reads −64 dB overall. Every family is at or below −131 dB except the piano, at −61 dB,
which is inaudible. My guess is that `expand_loops` does not shift a Track's `pedal` automation into the repeated
pass, so the felt's emulated sustain pedal differs in pass 2. The loop file itself uses the right pedal.

---

**Music editor, 2026-09-25:** the 5 s cut-down (`mm01-water-line-05s-album` / `-underscore`) now ends on a 1.2 s raised-cosine fade (5.0 → 6.2 s). Before, the pedalled open fifth held at −28 dBFS and was chopped at 6.2 s by the engine's 30 ms end fade. The originals are in `render/_pre-editor/`.
