# MM-08 · The Falling Tile

**Cue:** `E01-S26` + `E01-S26A`, Ep1 Act Four (OST-BIBLE §5.B1). **Composer:** B; fix 1 by composer A. **Status:** fix 1 (2026-09-26), re-rendered on the fixed engine. Every judgement here comes from analysis; nobody has listened to it yet.

**Palette:** LEVERAGE (low) → D6 digital silence → DARK ROOM (a single felt piano) → THE REWIND.

**The idea:** a trap closing with no tune. Then a click takes every sound away. Then one felt piano plays in the dark, and the Orb takes back his settle.

## Fix 1 (2026-09-26): what changed

**The timing is untouched.** Nothing is re-timed to Act Four lock v3.

1. **LEVERAGE balance: the piano up.** Batch 1 read **20 · 64 · 0 · 17** in phrase 1 and **3 · 82 · 0 · 15** in phrase 2, against P03's **30 · 50 · 0 · 20**.
   - **Why:** the low grand clusters sat about 10 dB under the pizz, so the harmony that shifts a semitone ("who has the leverage now") was barely there.
   - **The clusters are up 9 dB** (grand `gain_db` −5 → +4), and a touch firmer on bars 5–6 (velocity 0.31/0.33 → 0.34/0.37).
   - **In bar 7 the grand doubles Step Four's bass in octaves** (B♭, A♭, G♭), soft and dry of the pedal: the world's leverage takes the step too. It stays level, with no riser, and stops with everything at the click.
   - **Now:** phrase 1 reads **27 · 56 · 0 · 17** and phrase 2 reads **21 · 66 · 0 · 13** (it was 3 · 82 · 0 · 15). The bed reads **27 · 56 · 0 · 17** (it was 4 · 77 · 0 · 19).
   - **The limit:** going further would need the clusters level with the pizz, or piano in bar 4, which the brief keeps to the pizz eighths alone.
2. **Rule 12, the F-major check.**
   - **The problem:** the new trace found a body resonance of the pizz samples at **~110–113 Hz (an A2)**, the same peak under F2, C3 and G♭2, 7–9 dB under the note. It showed in 7 of LEVERAGE's F-pedal windows, and in 8 of the bed's (worst sieved A/F 0.44).
   - **The fix:** narrow notches on the cello pizz (Q 10, −12 dB at 111.7 Hz) and the contrabass pizz (Q 8, −12 dB at 111 Hz). The nearest written pizz pitches move 1–2 dB at most.
   - **Now:** F-major check OK on all three renders, with 0 resonance windows. The worst sieved A/F is 0.073 on the album and the picture cue. On the bed, 3 windows are *explained* (the F bass's own 5th partial); the engine still lists a 110.6 Hz peak twice there, but the windows pass.
   - No A♮ was ever written.
3. **The engine's sub check (fix 5d)** runs over 26A's two scored stretches (META `room_sfx`, the dark room's `room_drone`). The felt stays above C3, and the sub band reads −31 to −35 dB under the total (the limit is −18).
4. **Re-rendered on the fixed engine**, stems included. The pizz tuning fix re-tunes the cello, contrabass and violin pizz by up to a few cents. The meter fix removes the false p95 warning. The old masters are kept as MP3 in `render/_pre-fix1/`.

## Files: one composition, three renders

`track.py` in this folder holds the composition. Its `compose(form)` produces three versions:

| Render | Where | What it is |
|---|---|---|
| **To picture** | `../e01-s26-the-falling-tile/render/` | The cue the editor lays in. 29 bars, 72.5 s, starting at 13:21.0. Stems for picture. |
| **Album edit** (this folder's build) | `render/mm08-the-falling-tile-*` | The same music, with the 14-bar D6 silence cut to 2 bars. 17 bars, 42.5 s. |
| **LEVERAGE bed** | `render/variants/mm08-leverage-bed-*` | The alternate "call connecting" bed. A seamless 4-bar loop (10.0 s, 240 frames) with no card and no felt. Use it to extend phrase 1 when the picture is conformed, or to reuse LEVERAGE in Ep1 sc 9 and sc 30 and Ep2 sc 18–19. |

To build:

```
python track.py                          # the album edit
python track.py --variants               # the bed
python ../e01-s26-the-falling-tile/track.py   # the picture cue
```

## Palette

**Bars 1–7, LEVERAGE.** Everything plays straight and locked to the rack LEDs, with 0 ms humanising. (Fix 1: the grand clusters sit about 3 dB under the pizz, not 10, and the grand doubles Step Four's bass in bar 7. The cello and contrabass pizz are notched at ~111 Hz.)
- **Pizzicato:** cello pizz in eighths, circling an F pedal on varied pitches (F2, C3, G♭2, F3, D♭3). It is never one pitch at an even rate and never a tune.
- **Contrabass:** doubles the pedal on F1.
- **The "muted 808":** a pitched F1 sub-thud (`k808`, low-passed at 150 Hz) blended with a muted bass drum. Its pattern is uneven (1+4 · 2.5 · 1+3.5 · 3), so hits are 1.5–1.9 s apart with no pairs. It is never a heartbeat and never a kit.
- **Grand clusters:** low Salamander clusters on F2 G♭2 C3, moving up to G♭2 G2 D♭3.
- **Chip:** a noise tick that keeps one eighth in four. The kept eighth and its noise clock move every bar, like the hotel Wi-Fi's one bar of four.

**Bars 22–29, DARK ROOM.** Felt upright only, plus felt mechanics. Nothing sounds below C3, which leaves room for the SFX `room_drone`.

**The Rewind.** The `snes_piano` voice: felt samples through the 16-bit sample-chip.

**Balance group.** The muted French horns in Step Four count as orchestral (`hn.balance = 'orch'`). They stay in the `brass` stem.

## Motifs

| Motif | Where | Notes |
|---|---|---|
| **Neleh's clockwork** (§2.16) | bar 2 | F5 C5 A♭4 C5 G5 C5 A♭4 C5 F5 C5 A♭4 C5 on violin pizz, 16ths, straight |
| **The 1-bit flat line** | bar 5 | Beeper plays F4 · F5 · F4 on beats 1, 2.5 and 4: uneven and octave-displaced |
| **Mada's spinner** (§2.16) | bars 6–7 | Celesta C5–D♭5 in eighths. It stops with everything at the click. |
| **Step Four** (§2.14) | bar 7 | Quarters on muted horns and bassoon: F4/B♭m(add9) → E♭4/A♭(add9) → D♭4/G♭maj7. Top and bass move in parallel fifths. The G♭maj7 holds through beat 4. **The bass's F2, step four, never comes: the D6 drop-out on 8.1 is the blank.** |
| **The Water Line** (§2.2), in extreme augmentation, one note per shot | 26A | Carve: F3 + C4 open fifth. First V.O.: the nudge G4. Wallet: the C4. Second V.O.: E♭4 (the ♭7, left unresolved). Bar 29: C4 → F4, the settle, "C4 q F4 h." |
| **The Rewind** (§1.3, D4) | bar 29 | The last 2 beats (C4, F4) retrograded as notes, a semitone lower each beat: E4, then B♭3. It is cut on 30.1, where MM-09 enters on B♭m(add9), so the rewind leads into the board's key. |

These are found by the matcher: `STEP_FOUR` ×2, `NELEH_CLOCKWORK` ×1, `MADA_SPINNER` ×12. The whole knee appears 0 times.

## Form (to picture)

Bar *b* starts at (*b* − 1) × 2.5 s. The picture clock is 13:21.0 plus that offset.

| Bars | Cue time | Picture | Music |
|---|---|---|---|
| 1 | 0:00.0 | The grid connects | LEVERAGE (low) starts |
| 2 | 0:02.5 | NELEH card | Beat 1 belongs to the freeze hit (SFX), so every stem rests. The clockwork enters at 0:03.125. |
| 3 | 0:05.0 | [PF] He reads the icons | The cluster holds. One felt F4, pp. |
| 4 | 0:07.5 | Alyi speaks with no sound | Only the pizz eighths |
| 5 | 0:10.0 | The 1993-style dialog | The beeper plays F F F and the bed returns |
| 6 | 0:12.5 | [ECU] The eyes strip | The cluster moves up a semitone. Violins trem "sul pont" at ppp (F5 + G♭5). Mada's spinner. |
| 7 | 0:15.0 / 15.625 / 16.25 | The arrow steps | Step Four, level, with no riser |
| **8.1** | **0:17.5 (13:38.5)** | **The Cancel click** | **Hard stop.** Every stem and every tail goes to −240 dBFS within 3 ms. |
| 8–21 | 0:17.5–0:52.5 | D6, "super.", candor card, F1.2 | **No score** |
| 22 | 0:52.5 (14:13.5) | 26A: carving mark 3 | Felt F3 + C4 |
| 23 | 0:55.0 | V.O. "i don't keep score." | G4 alone. Nothing moves under the line. |
| 24 | 0:57.5 | The Orb counts | The score holds and does not count. The pedal lifts on beat 3. |
| 25–26 | 1:00.0–1:05.0 | His real post | **Dry** (digital zero) |
| 27 | 1:05.0 | Wallet and moth | C4 |
| 28 | 1:07.5 | V.O. "the meeting ended early." | E♭4, one sustained note, on the cut |
| 29 | 1:10.0 / 1:10.625 | [PF] | C4, then F4 (the settle) |
| 29.3 | 1:11.25 | The Orb: `rewinding…` | **The Rewind:** E4 at 1:11.25, B♭3 at 1:11.875 |
| **30.1** | **1:12.5 (14:33.5)** | **Sc 27, the downbeat** | **Hard cut.** MM-09 takes over. |

The script prints 14:14 and 14:34, which are rounded. On the 96 grid from 13:21.0 they fall at 14:13.5 and 14:33.5. Conform the cue to the slate animatic by whole bars.

**Album edit:** bars 1–7 are identical. The stop falls on 0:17.5, 26A starts on bar 10 (0:22.5), the Rewind on 0:41.25, and the end on 0:42.5.

**Loop:** the picture cue has no loop, because the bible asks for an *alternate* bed. The bed, `mm08-leverage-bed-loop.wav`, is 240 frames long. Its cluster alternates F2 G♭2 C3 (bars 1–2) and G♭2 G2 D♭3 (bars 3–4), and it returns to the first on the seam.

## Measured (to picture, `e01-s26-the-falling-tile.cue.json`)

| Check | Result |
|---|---|
| Masters | Album −16.0 LUFS. Underscore −21.5 LUFS (META `underscore_lufs = −21.5`) at −5.1 dBTP. The stems sum to the underscore master to −170.8 dB. |
| Loudness arc | Short-term (the engine's meter, fixed): LEVERAGE runs −21.6 → −19.5 by bar 7. 26A runs −22 to −27. p95 is −19.6, with no warning. |
| V.O. windows (target −24 ± 2) | Bar 23: −24.5. Bar 28: −25.6. The album edit reads −24.6 and −25.2. |
| D6 (8.1 → 22.1) | −240 dBFS |
| Post window (25–26) | −78.4 dBFS peak, against a limit of −70. The hard stop inside it reads −240. |
| Exit (30.1) | −240 dBFS |
| Hits | All 12 markers within ±10 ms. The arrow steps read −5.3, −1.0 and −4.7 ms; the carve reads −1.3 and the Rewind +8.7 ms. |
| Harmony checks | Written third 0. F-major check OK (fix 1): 0 resonance windows, worst sieved A/F 0.073. Whole knee 0, knee completion 0. |
| Sub under the room SFX (fix 5d) | 26A: −34.8 and −30.9 dB under the total (limit −18); nothing below C3 |
| Spectrum | 2–6 kHz −20 dB. Centroid 255 Hz: LEVERAGE (low) is deliberately bottom-heavy, and nobody speaks under bars 1–7. |
| Balance | **51 · 36 · 0 · 13** (piano · orch · big band · chip), against a target of 30 · 50 · 0 · 20; batch 1 was 44 · 42 · 0 · 13. LEVERAGE by phrase: **27 · 56 · 0 · 17** and **21 · 66 · 0 · 13**; batch 1 was 20 · 64 · 0 · 17 and 3 · 82 · 0 · 15. **26A is felt-only by brief,** which lifts piano overall, and the brief's LEVERAGE chip is one soft tick. |
| LEVERAGE bed (`variants/`) | −22.0 LUFS-I underscore, loop seamless, verify −76.9 dB. Balance 27 · 56 · 0 · 17 (batch 1: 4 · 77 · 0 · 19). F-major OK. |

**Engine bug in batch 1 (fixed in the engine on 2026-09-26, fix 1; kept for the record).** The build printed the warning "underscore short-term p95 … > −17" on this cue. It is a false alarm. `engine/mix.py short_term_lufs` (and `analysis._k_power`) run the K-weighting filters along the channel axis instead of along time. On a 1 kHz sine it reads −17.3, where BS.1770 gives −20.0, and it is flat across frequency. On this bottom-heavy cue it reads about 5 dB hot. The corrected p95 is −19.8.

## What to audition (in order)

1. **0:17.5, the Cancel click.** Does the hard stop land as a blow, or like a playback glitch? Check it against picture. (Bible §7, item 1.)
2. **0:00–0:17.5.** Does it feel like a trap closing, with no tune? The thud must never suggest a heartbeat, and the pizz must never suggest a melody.
3. **0:15.0–0:17.5, Step Four on muted horns.** It should stay level with no riser. Does the missing step four (the silence) read?
4. **0:02.5,** with the NELEH freeze hit laid in. Is the key right? (SFX request 2 in §6.8.)
5. **0:55.0 and 1:07.5,** with a stock voice at about −16.5 LUFS-S. Does the lowercase V.O. sit on the single felt note?
6. **1:10.0–1:12.5, the settle and the Rewind.** Does it read as the Orb rewinding, rather than a tape effect? Does the cut at 1:12.5 feel like the exit, not an error? And does B♭3 hand over to MM-09's B♭m(add9)?
7. **Fix 1, 0:00–0:17.5, the new LEVERAGE balance.** The low grand clusters are 9 dB up, and the grand doubles Step Four's bass in bar 7. Is the leverage shifting a semitone now audible, still with no tune? Is it murky against the pizz and the thud? Do the arrow steps stay level, with no riser?
8. **Fix 1, the pizz notch** (cello and contrabass, ~111 Hz). Does the F pedal still sound woody, and does anything sound major? Check the bed's later passes too (`variants/mm08-leverage-bed-album`, 12.5 s and 23.75 s).

## Weaknesses and open points

- **The felt decays fast.** A single note under a V.O. line only holds its level for about 1.5 s, so the V.O. windows depend on where the line sits in the bar. Both windows assume the line is laid at the head of its shot.
- **"Sul pont" is faked** with EQ on the violin tremolo, because VSCO 2 CE has no sul-pont samples.
- **The Step Four horns** use VSCO's muted French horn, whose samples speak late. The track compensates with `latency_ms = 22`, and the onsets measure within 5 ms.
- **The Rewind is two plain quarter notes** on the sample-chip piano. If it reads as too small, the next thing to try is a 16th re-strike of each note, a "scan". It must not become a reverse swell.
- **The album edit's 2-bar silence** is a guess. On the album the stop should still land as a blow.
