# Ep1 Act Four: the music conform plan (waiting for the lock)

| | |
|---|---|
| **Status** | A plan only. **No to-picture cue has been re-timed.** Every render on disk is still cut to Act Four **lock v2** (7:33.8). Fix pass 1 changed sound only: against each cue's `_pre-fix1` master, the onset lag is 0.0 ms, every marker lands within 2.7 ms (one analysis hop), and the sections and stop windows are the same. |
| **Trigger** | The showrunner approves an Act Four lock: **lock v3** (`shots-locked-v3.json`, 4:08.9), or the **v4** lock that [edit-plan-v4](../../../show/episodes/ep01/production/act4/edit-plan-v4.md) would produce (about 4:28). The Act Four pass owns the timing. Music follows its frames and never moves them. |
| **Owner** | The music editor runs this. Each composer re-renders their own cue, and the editor re-measures it. |

## How to conform

1. **Re-render every cue; don't cut stereo files.** The v3 temp mix cut the underscore WAVs into 33 pieces, and that is what played as fragments. Each cue gets one wrapper in a new folder, `audio/ost/tracks/e01-act4-v3/` (or `-v4/`). It follows the `e01-s26-the-falling-tile` pattern: it imports the batch-1 track through `importlib` and re-lays that track's sections to the lock's bar counts. The batch-1 folders stay as they are, as the library masters.
2. **Take the sync frames from the lock file,** `shots-locked-v3.json` (shots and `audio_cues`). Don't type them by hand. The act clock starts at episode 12:31:00, at 24 fps. Every hit must land within 10 ms of its frame.
3. **Thin under words instead of muting.** The dry-rule mutes baked into the batch-1 renders become `stem_auto` thinning. Melody, chip, brass and hits drop out, and a pedal holds under the words, ducked (flow-and-continuity §3; bible rule 10). Keep only the designed stops. On v3 those are the tape-stop onto the JOIN click, D6, the Build stopping when Gerg looks up, Mada's label and the violin's first heart. On v4 they are the Cancel click (D6), Gerg's glance, Mada's label and "Terms?".
4. **Ship stems with every cue,** so that mix_v4 can duck from the stems.
5. **Re-measure** with `editor/qa.py e01-act4`. The checks are:
   - loudness, peaks and the stem sum;
   - hits against the lock's frames;
   - written third and knee completion both 0;
   - the F-major check;
   - the sub under the room SFX windows: the dark room's `room_drone` and the vault's `server_hum`.

   Then build the act and measure it the way [edit-plan-v4 §5.8](../../../show/episodes/ep01/production/act4/edit-plan-v4.md) does.

**Before the conform starts: fix MM-11.** Its LEVERAGE section (c1) still carries the ~111 Hz cello-pizz body resonance that MM-08 notched (see [SAMPLER.md](../SAMPLER.md)). v3 never used c1, but v4 does, under the door bang.

## Per scene (lock v3 frames; the v4 sequence is in brackets)

| Sc | Lock v3 (act frames · length) | Cue and its current (lock v2) render | What changes |
|---|---|---|---|
| **24** [S1] | 0–90 · 3.75 s (6 beats) | MM-07 `e01-s25-the-plan` 0–5.0 s (2 bars) | The felt plays the Water Line's bar 1 at 6 beats, and the settle never comes. The Blueprint enters on the laptop glow's `[PF]` at f 90. |
| **25** [S1] | 90–510 · 17.5 s (7 bars) | `e01-s25-the-plan` 5.0–50.0 s (18 bars) | Re-lay it as 7 bars: WORD (1) → the waltz (3; the rest of the musical chairs falls as the three walk off) → the held chord (1) under "And the CEO owns—" / "Good question." (NELEH's "Step four." is cut) → PLAN (1; its three step ticks go, since steps 2–4 are folded) → BREAK and the tape-stop (1). **The tape-stop reaches zero on the JOIN click at f 510.** On v3 it stopped early, at f 495, and left a gap before the click. Align the alternates' 48.75 s on the click. |
| **26** [S1] | 510–933 · 17.6 s | MM-08 `e01-s26` 0–52.5 s (LEVERAGE 7 bars, then D6 and the silences) | LEVERAGE is one take from the connect (f 510) to the Cancel click at **f 690**: 3 bars, with Step Four one step a beat in the last bar and the 1-bit flat line under the dialog. **D6 runs 5 beats** from f 690 (it was 2½ bars). Then the room, "super." and F1.2's 6 beats. F1.2 stays silent on v3. On v4 the dark room's drone pedal is pre-lapped under the fallaway. |
| **26A** [S2] | 933–1128 · 8.1 s (13 beats) | `e01-s26` 52.5–72.5 s | The felt's open fifth on the carve (f 933), then one sustained note under the one V.O. line that is left (D4 and the wallet are cut). The 9:32 post moves to sc 27. **The Rewind lands on sc 27's downbeat at f 1128.** On v4, under the TPOOL insert, it thins to the pedal only. |
| **27** [S3–S4] | 1128–2810 · 70.1 s | MM-09 a–h, 0–110 s (44 bars) | **One performance, not seven pieces.** Each section changes on its rail or room: a (≈ 27.9 s) · b hearts (≈ 5.0) · c boardroom night (≈ 14.9) · d LIGHTHOUSE (≈ 6.7) · f TTEMME (≈ 5.0) · g 11:53 PM (≈ 4.4) · h "Step four?" (≈ 2.5). Section e goes, because the camera and its post are dry. New sync points: the candor card (now in pass one, f ≈ 1188), the 9:32 post, the eulogy post, "You can call it this way" and Tasya's line. BUKAJ, four lines and three cards are gone, so those holes go too. On v4, h slows and hangs on one held note under "Step four?" and Mada. |
| **28** [S4→S5] | 2810–2870 · 2.5 s (1 bar) | MM-09 09x, 110–115 s | **The REVERSAL on the card's downbeat at f 2810.** The extra beat is gone. **The felt F4 lands on the next downbeat and rings into sc 29** (v3 overran into sc 29 by 2.5 s). |
| **29** [S5–S6] | 2870–4362 · 62.2 s | MM-10 picture, 98.75 s (a 58.75 + avalanche 16 bars) | **Section a (≈ 42 s):** the felt under V.O. and "mostly."; the counter's clunk (745); THE BUILD, which stops dead when Gerg looks up. The quiet beat goes from 4 beats to 3. **Drop the empty D5 bar.** D5 is cut from Ep1, and the bar sits in the section at 5.6–15.6 s, with Rima's dry post. **The avalanche is 8 bars:** compile 2 · Step Four and ALYI RESISTS 2 · the Water Line 1 · the full band 2, then the dead stop on MADA's label (f ≈ 4302, taken from the label's frame). On v4 there is no Build cell on the counter, the Build first appears with Gerg's tile, and the avalanche is 5–6 bars (the composer's call). |
| **30a** [S7] | 4362–4461 · 4.1 s | `e01-s30a-the-door`, 10 s | The Door under Alyi's post. **It stops on the first heart's frame** (f ≈ 4461; take the frame from the lock). On v4 it holds its note and decays for about 2–3 s instead. Pick one of the four `stop-f*` files only if a whole re-render isn't possible. |
| **30b–e** [S7–S8] | 4461–5536 · 44.8 s | MM-11 picture, 80.4 s | **b, the floor:** starts after Tasya's line (f ≈ 4598) and runs one 10-beat wide (the landlord went from 8 bars to 1). **c:** unused on v3, since the calm-off plays in silence; on v4, c1 fades in under S7.05 and drops out on "Terms?". **The long hold goes from 1 bar to 2 beats.** **d:** the Build restarts after Gerg's post (f ≈ 5101). **e1:** the stab on the sign (**f 5311**). **e2:** one chip note, then the flat line, then the `[CU]`. **e3:** the felt cadence after "okay." (f ≈ 5520), ringing into sc 31. |
| **31** [S8 coda] | 5536–5973 · 18.2 s | no OST cue (MM-12 is batch 2) | The felt's F settles onto the vault's F hum (`server_hum` stands in). Mark a `server_hum` room window there, so the sub check runs. |
| **(D5)** | not in the lock | MM-02 `e01-s29-d5` | **Unused in Ep1.** Draft 3.2 cut D5, and its debut moves to Ep2 or Ep3. Keep the file and re-spot it there. |

## Deliverables at the conform

- One wrapper and one render per cue (or per v4 sequence), each carrying the picture version at its exact length and start frame, its stems and a cue sheet with the lock's sync points. Its META names the lock version.
- The editor's QA passes on every file, with a `qa.json` row for each.
- The re-cut act music, built from those renders by mix_v4 (the editor's): the ducks, the thin windows and the beds (edit-plan-v4 §5.3–5.4).
- A new animatic mux, built from the same WAV the EDL describes.
- For a human: listen to the act from start to finish, and first to the D6 aftermath (about 8 s with no music).
