# E01 · Act Four v4 · the continuous to-picture cues

**v4.2 (the closing pass, 2026-09-26).** Lock v4.2: 77 shots, 6036 frames (S3.08 and S5.10 cut, S8.07 +0.5 s, S8.10
+1 s; `show/episodes/ep01/production/act4/edit-plan-v4.md` §11). Re-rendered: `s3s4`, `s5s6`, `s7s8` (`s1` and `s1s2`
sit before the first change and are unchanged). What changed in the music:
- `s3s4_boards_side`: the Door over the GPU choir after Alyi's line is gone with S3.08 (the doorway it played over is
  cut; the cut now lands in the 9:32 post's thin window, where the B-flat pedal and the viola whisper carry it).
- `s5s6_his_side`: no note changes; S5.10's cut shortens the ring-out pedal between Gerg's glance and the door by 1.5 s.
- `s7s8_the_return`: LEVERAGE gets MM-11's fix 2b (the SHOWRUNNER-NOTES handoff): its cello pizz plays on `vc_lev`
  (MM-11's track, notched 110.5 Hz, −12 dB, Q 16) and its F pedal is `mm11.held_pedal`, re-bowed every 2 bars. The
  violin already came through `mm11.tracks()` at its fix-2b +2 dB. The vault's drone runs to the new act end.
Heard by nobody.

**v4.1 (the finishing pass, 2026-09-26).** Re-rendered for lock v4.1 (79 shots, 6066 frames; the picture changes are in
`show/episodes/ep01/production/act4/edit-plan-v4.md` §10). `lock-v4.0.json` is the v4.0 lock, kept as a snapshot and never
edited: every frame number still written in these scripts is a v4.0 frame, and `common.w()` carries it onto the current
lock (piecewise-linear between the shot starts and ends, story marks and line edges both locks share). What changed in
the music:
- `s1_plan`: the musical-chairs rest is gone (it fell inside Neleh's line); the felt rings through the blueprint's cut
  into WORD; the path onward sits two beats earlier with S1.04's trim, still on the grid. Act 0-525.
- `s1s2_falling_tile`: LEVERAGE is 3.5 bars (the speaker-view pin is cut, so its quiet window is gone); every event is
  anchored to the lock. Act 525-1254.
- `s3s4_boards_side`: warped onto the new lock, each pulse group moved as one piece with its shot; the clockwork sits on
  "Share what?"; with S4.05 cut, the third Step Four's blank is the drop-out into Neleh's sincere beat. Act 1254-3159.
- `s5s6_his_side`: stop 2 is a ring-out (the Build stops on Gerg's glance, the pedal holds into the avalanche); a soft
  upright-bass pulse on the pedal's F and C enters with the letter's counter, tightens to the clunk and walks under the
  check. The avalanche is unchanged. Act 3159-4336.
- `s7s8_the_return`: Tasya's pad pre-laps under the violin's decay from the establishing wide; the bloom and home are
  guarded to the new lengths; the 8-note Build "while he reads" went with S7.12. Act 4398-6066.
Heard by nobody. The engine's own QA warnings (marker onsets, the tape-stop's A sweep in `s1_plan` at about 20.6 s) are
the same kinds as v4.0's.


Five renders, one per sequence or chapter, made for **lock v4** (`show/episodes/ep01/production/act4/shots-locked-v4.json`)
by the OST engine from the batch-1 material. Each file's t = 0 is an act frame; every sync point is a lock frame (a shot
start, a story mark, a line or a word), so picture and score share one clock. The engine and the batch-1 tracks are
imported read-only: their helpers, cells, motifs and track settings are reused, and the material is re-laid to v4's
lengths. Nothing here was listened to. The numbers below are measured, and what they can't tell is listed at the end.

| Cue (`render/<id>-underscore.wav`, stems in `render/stems/`) | Act frames | From | What it is |
|---|---|---|---|
| `e01-act4-v4-s1-the-plan` | 0 → 555 | MM-07, notes re-laid (k = 1) | the felt bar, WORD on the stamp, the waltz (the three walk off on its F F F), **the musical-chairs rest** (1 beat), the labels (C on `VOTES: 0`), the held chord under "Good question.", the path, the break; the tape-stop reaches zero **on** the JOIN click |
| `e01-act4-v4-s1s2-the-falling-tile` | 555 → 1298 | MM-08 cells and voices, re-written to 4 bars | LEVERAGE as one take from JOIN to Cancel (Step Four on the arrow's steps), **D6**, then 26A: the felt fifth on the carve, the nudge under the V.O., a low F/C pedal under the count and TPOOL (no Mas motif under the REPORTED rail), the felt back on mark 3, the settle, the Rewind cut on S3's downbeat |
| `e01-act4-v4-s3s4-the-boards-side` | 1298 → 3302 | MM-09 helpers by section; 09x's own notes | pass one as **one procedure that never stops**: it thins under every record item (the pulse and the melodies leave, the B-flat pedal or the section's chord holds); rests for the four dial tones; h's clockwork slows and **hangs** on one held C over the blank's F; 09x REVERSAL on the card; the felt F4 on the home shot |
| `e01-act4-v4-s5s6-his-side-745` | 3302 → 4628 | new DARK ROOM pedal + MM-10's avalanche notes | S5: one F/C pedal (low strings sul tasto) under the record; the felt C4 for "the badge was a joke."; the Build with Gerg (4, then 8); **stop 2** on the glance; the pedal back under D8. S6: MM-10's own avalanche as five phrase-statements at **96.9 BPM** (k = 0.9905, the act's only time-scale, under 1 %), **stop 3** dead on MADA's label |
| `e01-act4-v4-s7s8-the-return` | 4690 → 6453 | MM-11 sections re-spotted + the STRAIGHT violin | the violin **holds and decays** on the first heart into Tasya's floor, a pad with one chord on each of "below / above / around", then the bloom; LEVERAGE fades in under Mada so the bang lands inside it; **stop 4** on "Terms?"; the stamp's C pedal (it holds under both posts); the Build; its one rest on the sand; VICTORY LAP; one chip note; F F F as one tenuto phrase; the lobby CU's quiet; the felt settle onto the vault's F (a TEMP drone until MM-12) |

**Render:** `OST_WORKERS=3 ../../../.venv-theme/bin/python render_all.py [name]` (about 8 minutes for all five; it does not
touch `ost-index.json`), or `python <cue>.py`. **Mix:** `audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v4.py`.

## Where the cues depart from edit-plan-v4 §5, and why

- **THE PLAN's WORD** is two notes on the stamp, so the waltz can start on the first walk-off: the three leave on its
  F F F, and the C never comes (the rest). Step Four's first statement ("THESE FOUR VOTE") is left out of THE PLAN: v4 has
  no picture moment for it, and Step Four is stated on the arrow's steps and again at S3's downbeat.
- **The Build restarts on S7.12**, where Mas reads, not on the keycaps at S7.11: Gerg's post lands 8 frames after the
  keycaps, so a restart there would be thinned at once. MM-11 itself restarts the Build on that shot.
- **The laptop "super."** (S3.01) sits about 7 dB clear of the pulse. The plan said 4.8 dB. It's the joke either way.
- **Two tiny designed gaps in S1** are counted as design: the blueprint's cut takes the felt 0.25 s before the stamp,
  and the musical-chairs rest (0.6 s) sits under "This board controls the company."

## Engine QA, flagged for a listen (none is a written third)

- `s1-the-plan`, 21.9–22.5 s: the tape-stop sweeps every pitch down through A. That is the design.
- `s3s4-the-boards-side`, about 78 s (h's hang): one window at sieved A/F 0.11 (the limit is 0.08), a string resonance
  near 428 Hz.
- The pizz body resonance at about 111 Hz (A2) and its octave (222.7 Hz) are notched, as MM-08 and MM-09 did: on the
  avalanche's upright and contrabass pizz, and on THE PLAN's viola pizz.
- The V.O. window under "the badge was a joke." reads −16 LUFS in the cue's own scale (the whole cue is normalised with
  the avalanche). In the mix it sits under the line after the cue's −8 dB level and the −6 dB V.O. duck.

## What a human must hear (the cues can't be judged from numbers)

1. The 8 s after the Cancel click: 3.3 s of digital silence, the suite, "super.", the fallaway, then the carve's felt.
2. Pass one as one procedure: does the pulse leaving for each post read as thinning, or does it nag?
3. The joins: the violin's decay into the pad; the pad into LEVERAGE; the pickup into the sign; the felt into the vault.
4. The avalanche at 96.9 BPM, in five whole statements: does it still erupt?
5. The TEMP-SYNTH beds (the Strip, TPOOL, the offices, the crowd, the lighthouse, the bullpen, the fires): air, or hiss?
