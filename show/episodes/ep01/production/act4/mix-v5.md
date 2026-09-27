# Ep1 · Act Four · v5 final mix (the re-recording mixer's pass)

| | |
|---|---|
| **What** | Act Four v5 mixed from its final parts: the 101 v5 takes, the two composers' six to-picture cues, the SFX editor's 196 effects and 19 room beds. Dialogue sits on top, the music ducks under it with short ramps, and the one designed silence follows the Cancel click. |
| **Listen / watch** | `out/ep01/act4/animatic/act4-stick-v5-finalmix.mp4` (the approved stick reel, 720p, with this mix from its frame 72) and `act4-animatic-v5-finalmix.mp4` (the pixel preview picture, 1080p, muxed onto its 02:27:35 render) |
| **Mix and stems** | `out/ep01/act4/animatic/act4-mix-v5-final.wav` (48 kHz stereo 24-bit, exactly 12443 frames, act frame 0 = sample 0) · stems `act4-mix-v5-final-{dialogue,music,effects,beds}.flac` (24-bit FLAC; they sum to the mix) · `act4-mix-v5-final-tail-music.flac` (the score's 98-frame ring past the act's end, for the tag) |
| **Cues file** | `out/ep01/act4/animatic/act4-mix-v5-final.cues.json`: every take, cue, effect and bed as laid, every mixer decision, the duck actually applied (one value per frame), all the measurements below, and the mux checks |
| **Code** | `studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py` (a new file; nothing of the pixel pass's was edited) |
| **Who, when** | The re-recording mixer, 2026-09-27, alongside the pixel preview pass. Nothing committed. **Nothing heard:** every number is measured on the written files. What only ears can judge is listed at the end. |

## How to re-run

```bash
cd /home/jgon/project/art/mrmas
# the mix, the stems, the measurements and both muxes (measured: 82 s for the mix, peak memory 2.95 GB; the muxes under 2 min)
nohup ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py > <log> 2>&1 &
# the mix only
... mix_v5_final.py --no-mux
# re-mux only, e.g. after the pixel pass re-renders act4-animatic-v5-picture.mp4 (the mix is untouched)
... mix_v5_final.py --mux-only
```

- It is one heavy job at a time: one core (BLAS threads pinned to 1), nice 15 under `ops/heavy.sh`. This pass ran it under `ulimit -v 10000000` as a memory guard.
- The pixel picture is muxed only if it exists, hasn't changed in the last 3 minutes, no process has it open, its size is stable over 5 s, and it has 12443 frames. Otherwise the cues file says why it was skipped.
- **Re-run order after a re-lock:**
  1. `audio/ep01/act4/sfx-v5/spot_v5.py`
  2. The composers' renders (their README has the commands).
  3. This script.

  The script stops if a take, a cue's lay-in frame or D6 disagrees with the lock or the timeline.

## What it reads

| Input | Used for |
|---|---|
| `show/reel/ep01-act4-v5.json` (the approved stick timeline) + `shots-locked-v5.json` (lock sha1 `080355bf28dd`) | The clock. Each take's file goes on `realStart − 751 s + t − in`, the stick mix's, the lock's and both composers' arithmetic. All 101 file starts agree with the lock within 6 ms. The onset frames agree too, except the two the lock notes itself (`a5-27-18`, `a5-27-46`, 0.008 f across a frame line). |
| `audio/ep01/act4/dialogue/lines-v5.json` | The 101 takes (−16 LUFS, V.O. −18, the laptop's "super." −22). Call, monitor and laptop voices carry their speaker chain in the take. |
| `audio/ost/tracks/e01-act4-v5/render/stems/*` + `s1-s4_duckmap.json`, `s5-s8_ducking-map.json`, both cue sheets | The six cues at 0 dB on their lay-in frames: 0, 1166, 1500 (S1–S4), 6985, 9001, 9376 (S5–S8). Each composer's duck map applies to its own files. |
| `show/episodes/ep01/production/act4/sfx-v5.json` | 196 effects laid (the sheet's 195 non-optional cues, plus FX048, see below) and 19 beds. The sheet was spotted against the 01:49 lock (`3873036ea98e`). A scratch re-spot against the current 02:06 lock gave a sheet identical in all 199 cues and 19 beds, so it holds. |

## What the mix does (the mixer's decisions)

**Dialogue**
- Every take is at unity on both channels. That is `mix_v4.py`'s reference, and the SFX sheet's gains assume it.
- **Room early reflections are a send.** The takes say "DRY: the room's early reflection is a mix send". There are ten small synthetic rooms (taps, a short diffuse tail, 150 Hz–6 kHz), from the dead dark room (−28 dB) to the lobby and the all-hands (−19 dB).
  - Voices on a device (Alyi and Rima on Neleh's laptop, Gerg on the monitor, Neleh's tile in S6) get +7 dB of their listening room: a small speaker in a room excites it more.
  - O.S. voices get +4 dB of room and sit 1 dB lower.
  - The V.O. is dry.
- **The split (S4.08)** leans Neleh 0.25 left and Mario and Adelina 0.25 right, as their two beds do.

**Music**
- The six cues come from stems at 0 dB. Under S1–S4's three silent posts, the held families (strings, piano, synth) lift +2 dB, as the S1–S4 map asks.
- **Duck:** each composer's own curve.
  - **The mixer slew-limits both curves.** Falls are held to 60 dB/s and begun early, so each depth is still reached on time. Rises are held to 20 dB/s, so the S5–S8 map's one-frame steps (for example −6.5 → −3 dB at 8090) become short ramps.
  - Measured on the applied curve: steepest fall 60.0 dB/s, steepest rise 20.2 dB/s. The duck at mid-line has a median of −8.2 dB, and the deepest is −13.5 dB.
- **Top-up (dialogue clearly on top).** Under a line whose dialogue-over-music measured under 12 dB (10 dB for the V.O.), the duck goes deeper by the shortfall, capped at 4 dB and skipped under 0.5 dB. It pre-ducks 0.25 s ahead and holds across gaps under 2.5 s. This touched 16 lines, by 0.6–4 dB, mostly short replies over S5's pedal and S7:
  - `a5-27-05` "super." (laptop) −3.5
  - `a5-29-10` −2.4
  - `a5-30-01` −2.3
  - `a5-30-05` −2.8
  - `a5-30-07` −2.0
  - `a5-30-09` "…Ah." −4.0 (the cap)
  - `a5-30-11` −3.7
  - nine more under 2 dB (the full list is in the cues file)

**Effects**
- The sheet is rendered by its own conventions.
- The `device` cues get the mixer's speaker chains: 4th-order band edges plus a speaker peak.
  - laptop: 280 Hz–6.5 kHz, +3 dB at 1.2 kHz
  - monitor: 200 Hz–6 kHz, +2 dB at 1.5 kHz
  - CCTV: 180 Hz–3.8 kHz, mono, +2.5 dB at 1.8 kHz
  - No saturation: its harmonics of an F-tuned cue would land on A.
- **FX048 is turned on:** the Rewind's reversed `tape_spinup`, ending on the whip (1497 → 1512).
  - The S2 composer left a one-beat slot for "the SFX's reverse swell" at 1485.
  - The SFX editor had left it optional "in case the score owns it".
  - OST-BIBLE §6.8 ("one owner per sound") gives `reverse_swell_*` and `tape_*` to the SFX; the score's Rewind is a retrograde in notes. So it was nobody's, and now it is the SFX's.
- The other three optional cues (the palette steps on below / above / around) stay off, because MM-11's chords mark those words.

**Beds**
- The sheet's 19 beds sit at their RMS targets.
- **The bus is +1.5 dB.** The act's master gain is −2.3 dB, because v5 is far denser in speech than v4, whose master gain was +0.5. That had left the rooms near −40.5 dBFS, the bottom of edit-plan §5's "about −38 to −40". They now read −37.4 to −39.3 per sequence.
- **+2 dB inside three designed music-off windows**, with 0.5 s ramps, back at level by each re-entry: the dial-tone rest, Mada's dead stop, and the lobby rest. There a decorrelated stereo bed alone read about 3 dB low in the mono downmix and dipped under −42 dBFS. After D6 and under "of what?", the trim alone keeps the floor above −41, so those two windows aren't lifted.

**D6**
- Act frames 997 → 1086: every bus is digital zero except the Cancel click's own first 0.25 s.
- The suite's room comes back on the phone's buzz and carries "super." alone. No score plays until S2's felt enters on 1178.

**Master**
- One gain (−2.31 dB) takes the mix to −16.5 LUFS integrated, the act mixes' target since v3 and v4.
- A linked, 4× oversampled look-ahead limiter sits at −1.3 dBTP (the intro pipeline's ceiling). It never engaged.
- The same gain curve is applied to every stem, so the stems sum to the mix.

## Measured (on the written files)

**Loudness and peaks**

| | |
|---|---|
| Integrated | **−16.50 LUFS** (target −16.5) |
| True peak | **−3.20 dBTP** (limit −1.0); sample peak −3.21 dBFS; limiter reduction 0 dB |
| LRA · short-term max · momentary max | 9.7 LU · −14.1 LUFS · −11.4 LUFS |
| Stems (integrated) | dialogue −15.34 · music −26.21 · effects −34.22 · beds −38.14 LUFS |
| Stems summed against the mix | residual −132.5 dB (24-bit quantisation) |
| After AAC (decoded from the mp4s) | stick −16.52 LUFS, −3.18 dBTP · pixel −16.52 LUFS, −3.25 dBTP |
| Sync in the mp4s | 0 samples of lag at all 12 check points in each file (2 s windows, correlation 1.0) |

**By sequence** (integrated LUFS; share of the sequence with music on; room median, dBFS)

| S1 | S2 | S3 | S4 | card | S5 | S6 | S7 | S8 |
|---|---|---|---|---|---|---|---|---|
| −17.7 · 81 % · −38.8 | −22.4 · 100 % · −39.0 | −15.7 · 100 % · −38.9 | −16.3 · 100 % · −38.5 | −17.9 · 100 % · −39.3 | −16.1 · 100 % · −39.3 | −17.6 · 91 % · −39.3 | −17.0 · 91 % · −37.4 | −17.9 · 91 % · −38.9 |

S2 is quiet by design: the V.O. inside the felt.

**Holes** (the whole mix under −42 dBFS for 0.3 s or more, 50 ms windows)
- **Louder channel: 1 · mono downmix: 1.** Both are D6 (act 999.6 → 1086, 3.6 s, digital zero), which is designed.
- Run 1 of this pass had three more in mono (0.35 s after Mada's stop, 1.95 s and 0.3 s in the lobby rest). The bed trim and the rest rides removed them.

**Abrupt level jumps** (over 15 dB between neighbouring 50 ms windows; all of them explained)
- **Louder channel** (floor −60 dBFS): 59 jumps, 0 unexplained.
  - 42 are speech inside a line (a word after a pause, over a floor about 20 dB down: natural).
  - 13 are line onsets and ends.
  - 2 are D6's edges.
  - 1 is music: S2's felt fifth, re-entering after D6.
  - 1 is an effect: the term sheet's stamp.
- **Mono downmix** (no floor): 142 jumps, 0 unexplained, with the same causes.

**Music runs and stops** (the music stem as mixed, on above −60 dBFS)
- **6 runs:** 39.6, 143.3, 196.8, 66.5, 17.8 and 31.8 s. Music is audible 95.6 % of the act, with **0 fragments under 2 s**.
- **6 stops, every one designed:**
  1. The act's first 2.0 s: the suite and the truck, until the felt at 49.
  2. **D6** and the room after it: 997 → 1177, 7.5 s.
  3. The dial-tone rest: 4615 → 4620, 0.2 s.
  4. **Mada's label:** 9342 → 9400, 2.4 s.
  5. **"of what?":** 10996 → 11167, 7.15 s.
  6. The lobby rest: 11594 → 11681, 3.6 s.
- Gerg's ring-out (8500) and the sand's 0.49 s rest never drop the music under −60, because the pedal holds.
- 22 steps over 10 dB on the music bus: 21 at a named marker or stop, 1 at a note's attack in the avalanche.

**Dialogue against music and effects**
- **Dialogue over music** (50 ms windows, over the line's speech): median **14.6 dB**, p10 **12.0 dB**, minimum **11.4 dB** (`a5-30-09` "…Ah.", at the top-up's 4 dB cap). That covers the 97 lines with music under them; 4 lines play with no score: "super." in the suite, both "good question."s and "okay.". v4 measured a median of 15.5 dB and a minimum of 7.1.
- **Effects against sounding speech:** 25 effects land on speech. The closest is FX153 `call_leave` at 3.5 dB under Neleh's "char—". That one is designed: the chime is what cuts her off, the act's one cut-off by the world. The next closest is 10.6 dB under (the EQUITY stamp on "question", as scripted). Three more land in gaps inside a line with no speech under the hit: the shavings in the V.O.'s pause, the 745 ratchet, and the spray between Terb's sentences.

**D6**
- **3.458 s of digital zero** after the click's own 0.25 s (click peak −7.3 dBFS).
- The room comes back on the buzz at −37.3 dBFS median. The music peak is −49 dBFS from 1086 until the felt enters at 1178.

**The score's SFX slots against the sheet**
- Of the composers' slots, all but 7 find their effect within 2 frames.
- The 7:
  - the Rewind's swell (now FX048, placed 1497 → 1512)
  - the folder (the sheet's `folder_slide` sits 9 frames earlier)
  - the card (no effect, by design)
  - the Orb's servo (3.8 frames)
  - the avalanche's single tile landings (the sheet groups them as ten and then hundreds)
  - the vault hum (6 frames early, entering with its bed)
- None is a sync fault; the list is in the cues file.

## What needs ears (nobody has listened)

1. **The 16 topped-up lines**, especially S5 (`a5-29-01` … `a5-29-19`) and S7 (`a5-30-01` … `a5-30-18`). Does the deeper duck breathe with the talk, or can you hear the pedal dip?
2. **The room sends.** Do the voices sound as if they're in the suite, the office, the boardroom and the lobby, or does the send smear them? The device voices (Alyi and Rima on Neleh's laptop, Gerg on the monitor): small speakers in a room, or a filter?
3. **FX048,** the Rewind's reverse swell under the score's E4 → B♭3 retrograde into the whip (13:33:09–13:34:00): the Orb rewinding, or clutter?
4. **D6** (13:12:13): the click, 3.5 s of nothing, then the room on the buzz and "super.".
5. **The three rests with the room lifted 2 dB** (from 15:41:15, 19:00:05 and 20:33:22): a held quiet, or a hole?
6. **The split** (S4.08, 15:43:11–16:11:12): is the ±0.25 lean enough to tell the panes apart, without pulling the voices off centre?
7. **The avalanche** (18:46:01–19:01:16): Neleh's "Has anyone read the char—" over the band, and the leave chime cutting her off.
8. **The composers' and the SFX editor's own lists** still stand. See `audio/ost/tracks/e01-act4-v5/README.md` (the nine S1–S4 checks and the six S5–S8 checks) and `audio/ep01/act4/sfx-v5/README.md`.

## Open issues and notes for a successor

- **The pixel preview may be re-rendered.** This mux used the picture rendered at 02:27:35 (sha1 `1a8ccb571536`). If the pixel pass renders again, run `--mux-only`.
- **The pixel pass's own files still use the stick mix** (`shots-locked-v5.json` `summary.mix`, `render5.ts`, `report_v5.py`), and this pass didn't touch them. To play the final mix in their renders, point the track at `act4-mix-v5-final.wav` with an offset of 0 (the stick mix's offset is 72).
- **Episode assembly:**
  - The act starts with the suite's room at level on frame 0 (the stick mux pre-laps it over the title card's last 0.75 s).
  - The score's ring past frame 12443 is in the tail file.
  - The act mixes are at −16.5 LUFS; the intro master is at −14. The episode master's target is still to be decided.
- **Headroom:** the true peak is −3.2 dBTP, so the limiter never worked. A louder episode master has about 2 dB before it would.
- The dial tones already follow the OST's request: the SFX editor tuned the speakerphone keys to F4 E♭4 D♭4 C4.
- **Scratch** (this pass's own, safe to delete):
  - `scratchpad/a4fin-mixer/`: the run logs
  - `spot_v5_scratchcopy.py` and its re-spotted sheet, the lock-drift check above
