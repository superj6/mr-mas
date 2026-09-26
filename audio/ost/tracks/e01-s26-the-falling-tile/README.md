# E01-S26 + S26A · The Falling Tile (to picture)

This is the to-picture cut of **MM-08**. The full notes are in [`../mm08-the-falling-tile/README.md`](../mm08-the-falling-tile/README.md): palette, motifs, the complete form, measurements, what to audition and known weaknesses. The composition itself lives in `../mm08-the-falling-tile/track.py`, and this folder's `track.py` renders it with `form='picture'`.

- **Length:** 29 bars at 96 BPM, 72.5 s (1740 frames). Bar 1.1 is 13:21.0, when the grid connects.
- **Sync points** (cue time, with picture clock in brackets):

  | Point | Cue time |
  |---|---|
  | NELEH card (beat 1 rests for the freeze hit) | 0:02.5 |
  | Arrow steps | 0:15.0, 0:15.625, 0:16.25 |
  | **HARD STOP, the Cancel click (D6)** | **0:17.5 (13:38.5)** |
  | 26A | 0:52.5 (14:13.5) |
  | First V.O. window | 0:55.0–0:57.5 |
  | Post, dry | 1:00.0–1:05.0 |
  | Second V.O. window | 1:07.5–1:10.0 |
  | Rewind | 1:11.25 |
  | **Hard cut into sc 27** | **1:12.5 (14:33.5)** |

- **Files** (in `render/`):
  - the underscore master at **−21.5 LUFS**: LEVERAGE (low) runs −22 rising to −20 by bar 7; 26A sits at −24 to −27;
  - the album master at −16;
  - stems for piano, strings, winds, brass, drums, perc and chip, which sum to the underscore master;
  - MIDI, a piano roll and the cue sheet. Silence windows, V.O. windows and SFX slots are in the cue sheet.
- **Silence:** the hard stops are baked in, at −240 dBFS from 8.1 to 22.1, over the post, and after 30.1. **Do not rebuild them in the mix.** Bible §6.6 still asks the mix to mute every bus during D6.
- **Mix handoff:** the tile's `glyph_dissolve` in phrase 3 falls inside D6 (bible §6.8, request 4). The score leaves it alone.

## Fix 1 (2026-09-26)

Re-rendered from the MM-08 composition on the fixed engine, with stems. **The timing is unchanged**: nothing is re-timed to Act Four lock v3. Details are in [MM-08's README](../mm08-the-falling-tile/README.md#fix-1-2026-09-26-what-changed).
- **LEVERAGE piano up.** The low grand clusters are +9 dB, and the grand doubles Step Four's bass in bar 7 (P03 asks for 30 · 50 · 0 · 20).
- **The cello and contrabass pizz are notched at ~111 Hz.** A sample body resonance there read as A2 over the F pedal in the new F-major check.
- **META `room_sfx`** covers 26A, for the engine's sub check.
- The old masters are kept as MP3 in `render/_pre-fix1/`.
