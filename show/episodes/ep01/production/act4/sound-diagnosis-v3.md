# Ep1 · Act Four · Sound diagnosis of v3, and a v4 sound plan (draft)

| | |
|---|---|
| **Who** | The sound supervisor, 2026-09-26. Diagnosis only: no mix, cue, render or production file was changed. |
| **Why** | The showrunner on the v3 animatic: "…there should [not] be random pauses of silence. the ost should not be playing for just half a second at a time then stopping. it is just too jagged now." Guidance: [flow-and-continuity](../../../../bible/flow-and-continuity.md) §3 (a continuous bed) and §4 (dialogue rhythm). |
| **Measured** | `out/ep01/act4/animatic/act4-animatic-v3.mp4` (its audio track, as heard), `act4-mix-v3.wav`, `act4-dialogue-premix-v3.wav`, `act4-mix-v3.cues.json` (the EDL: 33 music segments, 16 dry windows, 223 SFX, 16 beds), `shots-locked-v3.json`, and the cue sheets (`audio/ost/tracks/*/render/*.cue.json`). Read only: OST-BIBLE §0, §1.6, §4.1, §5.A1–§5.E1 and §6.6. |
| **Ears** | **Nobody has listened to this for this report.** I can't play audio or video in real time. Every statement below is a measurement, or a reading of code and cue sheets. Where I say something is likely to *sound* a certain way, it's an inference that a human must check (§12). |
| **Numbers** | Every number here, and in the plan, is a guide for finding problems, never a gate (flow-and-continuity, "How to use this file"). |

**Timecodes** are episode TC `MM:SS:FF` at 24 fps, as in timing-v3 (act frame 0 = 12:31:00). **Method:** RMS of the mono sum `(L+R)/2` in 50 ms windows. A **hole** is a run of 0.3 s or more under −42 dBFS. A **jump** is a step of more than 15 dB between neighbouring windows. **Music is audible** where the music bus is over −50 dBFS, with gaps under 150 ms merged. The buses were rebuilt by re-running `mix_v3.py` into scratch with its outputs redirected. The rebuild matches `act4-mix-v3.wav` bit for bit. This is the lead's method: on the disk WAV it gives the lead's 78 holes, 70.45 s and 107 jumps.

---

## 1. First, which mix the showrunner heard

The mp4 and the WAV on disk are **not the same mix.**

| File | Written | What it holds |
|---|---|---|
| `act4-mix-v3.cues.json`, `sound-v3.ts` | 2026-09-25 23:44 | The EDL: 223 SFX |
| `act4-animatic-v3.mp4` | 23:52 | That 23:44 mix, muxed. **This is what the showrunner watched.** |
| `mix_v3.py` | 2026-09-26 00:06 | Gained the "SUPERVISING DIRECTOR's review" block: 23 more SFX (far-off keys under the letter card, his lobby steps, phone buzzes under the 9:32 post, the glass cracks, the step-2 tick) |
| `act4-mix-v3.wav`, `act4-dialogue-premix-v3.wav` | 00:07 | The re-run with those 23 SFX. That run didn't rewrite `cues.json` or `sound-v3.ts`, so both still describe the 23:44 mix. |

- Where the 23 new SFX sit, the mp4's audio differs from a pre-review rebuild by −81 to −89 dBFS, which is AAC coding noise. It differs from the disk WAV by −46 to −52 dBFS. So the mp4 carries the pre-review mix.
- **This report measures the mix as heard** (the mp4, via the bit-exact pre-review rebuild). The disk WAV's figures are given beside it.
- The review SFX changed little: they cut the hole time by 5.2 s (75.7 → 70.5 s) but split some holes (71 → 78), and added one jump.
- **For v4:** measure the file that gets muxed, and write the EDL in the same run as the audio.

## 2. The numbers

| Measure | v3 as heard (mp4) | Disk WAV | Guide for v4 (flow-and-continuity) |
|---|---|---|---|
| Near-silent holes (≥ 0.3 s under −42 dBFS) | **71 holes, 75.7 s (30.4% of 4:08.9)** | 78 holes, 70.5 s (28.3%) | Only designed ones: D6, plus a few on story beats |
| Time the whole mix is under −42 / −45 dBFS (50 ms windows) | 33.4% / 24.9% | 32.7% / 24.1% | — |
| Abrupt jumps (> 15 dB in 50 ms) | **106**: 71 up, 35 down | 107 | Few, and on purpose |
| Digital silences | 2: D6 (3.04 s, designed), and **F1.2 (≈ 1.0 s at 13:07:03, not designed)** | same | 1 (D6) |
| Music EDL | 33 segments from 6 cue files. 22 butt joins at 3 ms: **19 jump to another place in the cue (one goes backwards 10 s)**, 1 is the designed Rewind handoff, 2 are continuous. 10 gaps. **No fade-ins; 4 fade-outs of 6–12 f** | same | One continuous performance per sequence, edited on phrases with crossfades |
| Audible music runs | **23 runs; median 2.0 s; 12 of them ≤ 2.0 s; 4 under 0.5 s** (0.10, 0.25, 0.35, 0.40 s) | same | A few long runs. A 1–2 s fragment only as a designed sting |
| Music audible | 46.9% of the act (116 s). By scene: 24 100% · 25 82% · 26 43% · 26A 99% · 27 55% · 28 100% · 29 38% · 30 32% · 31 7% | same | Continuous through each sequence except the deliberate stops |
| Longest stretches with no music | 18.9 s (15:47:04, the calm-off to Gerg's post) · 16.9 s (16:23:00, Q\* and the memo) · 15.5 s (14:46:20, the letter card to Gerg's tile) · 11.3 s (13:20:12, the candor card to Gerg's post) · 10.1 s (12:59:18, D6 to 26A) · 8.5 s (15:04:06, the quiet beat to the avalanche) | same | One long, deliberate one (the drop-out's aftermath) |
| Music under lines | 24 of 46 lines have music under them, ducked only **3 dB**. Dialogue over music: median 10.8 dB; 7 lines under 9 dB, including NELEH's "Nine seats. Three left this year. Four of us vote." at **7.4 dB** | same | Ducked 8–12 dB and thinned; about 15 dB or more under words |
| Lines on a near-silent floor | 22 of 46 lines have no music under them. 20 sit on a bed at −43 to −51 dBFS, about 26–34 dB under the voice; the two at the vault (31.02) have no bed at all | same | Every line sits in a bed |
| Beds | 16 beds, measured **−43 to −50 dBFS** in the mix. **One generic `room_tone` file serves 5 locations.** The all-hands murmur measures −50 and the fires −48 | same | Per location, audible, crossfaded |
| Dialogue gaps (45) | 7 overlaps · **9 at 0.08–0.29 s** · 8 at 0.5–0.8 s · 5 at 1.2–3 s · 6 at 3–6 s · 5 at 6–12 s · **5 over 12 s** (up to 19.3 s) | same | Replies 0.2–0.5 s, loaded ones 0.6–1.2 s, overlaps where heated, never uniform |

**A what-if (a measurement, not a listen).** I added a steady, gently filtered noise floor to the heard mix and kept D6 muted:

| Floor | Holes | Jumps |
|---|---|---|
| none (v3 as heard) | 71 | 106 |
| −40 dBFS | 1 (D6) | 51 |
| −38 dBFS | 1 (D6) | 41 |
| −34 dBFS | 1 (D6) | 18 |

So an audible floor removes almost every hole and more than half the jumps. What's left is the music's own hard starts and stops, and SFX transients. A noise floor isn't the fix: real beds and a continuous, thinned cue are (§9).

## 3. Why it's jagged: six causes, stacked

1. **The cues were written for a 7½-minute act; the v3 cut is 4:09.**
   - The finished to-picture cues follow the OST-BIBLE §4.1 spotting on draft 3.1's clocks.
   - v3 fitted them by cutting whole bars out of the stereo masters:

     | Cue | Cue length | v3 picture | Used |
     |---|---|---|---|
     | MM-07 | 50.0 s | 21.3 s (sc 24–25) | 20.6 s in 6 pieces |
     | MM-08 (`e01-s26…`) | 72.5 s | 25.7 s (sc 26 + 26A) | 15.6 s in 6 pieces |
     | MM-09 | 115 s | 72.6 s (sc 27–28) | 71.3 s in 8 pieces |
     | MM-10 | 98.75 s | 62.2 s | 29.3 s in 7 pieces |
     | MM-11 + the violin | 81.9 + 10 s | 48.9 s | 27.1 s in 6 pieces |

   - Each set-piece became a string of 0.6–5 s excerpts: sc 26's LEVERAGE was four pieces in 7.5 s, and the avalanche was 2 + 2 + 1 + 2 bars from four phrases.
2. **The edit rules made every join audible.**
   - Joins fell on bar lines with a 3 ms de-click and no crossfade (OST §6.6 rule 1: "tone changes on the downbeat, not by crossfade").
   - 19 of the 22 butt joins jump in the source: from 1.25 s to 17.5 s forward, and once 10 s back (THE PLAN's held chord → "PLAN: the path", 12:47:06).
   - A 3 ms butt between unrelated bars is a new attack, a changed texture and a lost reverb tail. That's the "half a second then stopping" the showrunner heard.
3. **The dry rule was applied twice, in two different places.**
   - The mix muted music in 16 dry windows. Overlaps merged, that's **93.4 s of the 248.9 s act (38%)**, with 6 f ramps.
   - The renders also carry their own **baked mutes** (−90 dBFS on every stem), placed on draft 3.1's clock. v3 laid MM-09 a from 0 without conforming it, so its mutes landed 2–3.5 s from their events:
     - "super."'s mute plays over the 27.03 table tick.
     - Gerg's-post mute plays over RIMA's "More. Soon." and her plate.
     - Alyi's-line mute plays over the 9:32 post.
   - Result: the NOON section's 27.9 s of EDL is heard for **6.1 s**, in pieces of 0.1, 1.55, 1.6 and 1.2 s (13:31:18–13:46:12).
4. **The floor under the dry moments is effectively silence.**
   - The beds are placed at −28 to −32 dB on −14 LUFS loops and then normalised −1.38 dB, so they measure −43 to −50 dBFS, about 27–33 dB under the lines.
   - After music at −15 to −25 dBFS, a drop to −48 is heard as a stop. Those are the 71 holes: all but D6 have a bed running under them, too quiet to carry.
   - The same neutral `room_tone` stands in for the Vegas suite, the board's rooms, the boardroom, the lighthouse and the bullpen, so places don't sound different.
   - Two spans have no bed at all: F1.2, where 1.9 s includes about 1.0 s of true digital silence five seconds after D6, and 31.01–31.02, where Gerg and Mas stand in the bullpen with only the vault's hum.
5. **Where music does play under words, it barely moves.**
   - A 3 dB duck (OST §6.6 rule 7) under featured cues puts NELEH's load-bearing exposition only 7–9 dB over the chip waltz.
   - Everywhere else the music is off. v3 had two settings, full or nothing, and nothing in between.
6. **The dialogue was chained mechanically.**
   - Replies sat 3–7 f apart by rule (in-exchange median 0.125 s), with the loaded beats at 0.54–0.79 s.
   - Between exchanges, the record items ran up to 19 s, with the music muted. The talk comes in bursts and the gaps are holes: the "rushed talk, then holes" of flow-and-continuity §0.

## 4. The music map

### 4.1 Every EDL segment (the 33 pieces), and how each joins the next

"Heard" is the part of the segment that is actually audible after the dry mutes, the 3 dB duck and the render's own baked mutes. "Jump" is where the next piece starts in the source compared with where this one stopped.

| # | In → out (ep TC) | Len | Cue file | Source s | Cue section(s) | Heard | Into next |
|---|---|---|---|---|---|---|---|
| 1 | 12:31:00–12:34:18 | 3.75 s | `e01-s25-the-plan` | 0.00–3.75 | E01-S24 the suite | 3.75 s | butt, jump +1.25 s |
| 2 | 12:34:18–12:37:06 | 2.50 s | `e01-s25-the-plan` | 5.00–7.50 | WORD | 1.30 s | butt, jump +5.00 s |
| 3 | 12:37:06–12:44:18 | 7.50 s | `e01-s25-the-plan` | 12.50–20.00 | DIAGRAM: the chip waltz | 7.50 s | butt, jump +17.50 s |
| 4 | 12:44:18–12:47:06 | 2.50 s | `e01-s25-the-plan` | 37.50–40.00 | the held chord ("Good question.") | 2.50 s | butt, jump −10.00 s |
| 5 | 12:47:06–12:49:18 | 2.50 s | `e01-s25-the-plan` | 30.00–32.50 | PLAN: the path | 2.50 s | butt, jump +15.62 s |
| 6 | 12:49:18–12:51:15 | 1.88 s | `e01-s25-the-plan` | 48.12–50.00 | BREAK: the stuck loop | 0.61 s | gap 0.62 s |
| 7 | 12:52:06–12:56:00 | 3.75 s | `e01-s26-the-falling-tile` | 0.00–3.75 | 26 P1 call connects | 3.75 s | butt, jump +6.25 s |
| 8 | 12:56:00–12:57:06 | 1.25 s | `e01-s26-the-falling-tile` | 10.00–11.25 | 26 P2 dialog, eyes, arrow | 1.25 s | butt, jump +1.25 s |
| 9 | 12:57:06–12:57:21 | 0.62 s | `e01-s26-the-falling-tile` | 12.50–13.12 | 26 P2 dialog, eyes, arrow | 0.62 s | butt, jump +1.88 s |
| 10 | 12:57:21–12:59:18 | 1.88 s | `e01-s26-the-falling-tile` | 15.00–16.88 | 26 P2 dialog, eyes, arrow | 1.88 s | gap 10.12 s |
| 11 | 13:09:21–13:13:15 | 3.75 s | `e01-s26-the-falling-tile` | 52.50–56.25 | 26A carve + V.O. 1 | 3.75 s | butt, jump +11.88 s |
| 12 | 13:13:15–13:18:00 | 4.38 s | `e01-s26-the-falling-tile` | 68.12–72.50 | 26A wallet, V.O. 2, the Rewind | 4.28 s | butt, jump −72.50 s (next cue) |
| 13 | 13:18:00–13:45:21 | 27.88 s | `mm09-the-boards-side` | 0.00–27.88 | a NOON | 6.11 s | butt, jump +2.12 s |
| 14 | 13:45:21–13:50:21 | 5.00 s | `mm09-the-boards-side` | 30.00–35.00 | b NOV 18 hearts | 1.45 s | butt, jump +5.00 s |
| 15 | 13:50:21–14:05:18 | 14.88 s | `mm09-the-boards-side` | 40.00–54.88 | c boardroom night | 14.88 s | butt, jump +10.12 s |
| 16 | 14:05:18–14:12:11 | 6.71 s | `mm09-the-boards-side` | 65.00–71.71 | d LIGHTHOUSE | 6.71 s | gap 3.75 s |
| 17 | 14:16:05–14:21:05 | 5.00 s | `mm09-the-boards-side` | 85.00–90.00 | f TTEMME | 5.00 s | butt, jump +5.00 s |
| 18 | 14:21:05–14:25:14 | 4.38 s | `mm09-the-boards-side` | 95.00–99.38 | g 11:53 PM | 2.01 s | butt, jump +5.62 s |
| 19 | 14:25:14–14:28:02 | 2.50 s | `mm09-the-boards-side` | 105.00–107.50 | h Step four? | 2.50 s | butt, jump +2.50 s |
| 20 | 14:28:02–14:33:02 | 5.00 s | `mm09-the-boards-side` | 110.00–115.00 | 09x REVERSAL | 3.95 s | gap 6.88 s; 12 f fade-out |
| 21 | 14:39:23–14:44:09 | 4.42 s | `mm10-his-side-745` | 15.62–20.04 | V.O. + mostly. | 1.51 s | butt, jump +0.58 s; 6 f fade-out |
| 22 | 14:44:09–14:46:21 | 2.50 s | `mm10-his-side-745` | 20.62–23.12 | the counter | 1.85 s | gap 12.50 s |
| 23 | 14:59:09–15:04:06 | 4.88 s | `mm10-his-side-745` | 43.25–48.12 | Gerg compiling | 1.89 s | gap 8.50 s |
| 24 | 15:12:18–15:17:18 | 5.00 s | `mm10-his-side-745` | 58.75–63.75 | the compile | 4.70 s | butt, jump +7.50 s |
| 25 | 15:17:18–15:22:18 | 5.00 s | `mm10-his-side-745` | 71.25–76.25 | step four | 5.00 s | butt, jump +2.50 s |
| 26 | 15:22:18–15:25:06 | 2.50 s | `mm10-his-side-745` | 78.75–81.25 | the Water Line augmented | 2.50 s | butt, jump +7.50 s |
| 27 | 15:25:06–15:30:06 | 5.00 s | `mm10-his-side-745` | 88.75–93.75 | the full band → the card | 5.00 s | gap 2.50 s |
| 28 | 15:32:18–15:36:21 | 4.12 s | `e01-s30a-the-door` | 0.00–4.12 | the Door | 4.02 s | gap 5.71 s |
| 29 | 15:42:14–15:47:05 | 4.62 s | `mm11-the-return` | 24.38–29.00 | b THE FLOOR | 4.48 s | gap 16.33 s; 10 f fade-out |
| 30 | 16:03:13–16:12:07 | 8.75 s | `mm11-the-return` | 60.62–69.38 | d GERG RETURNS | 1.90 s | butt, continuous |
| 31 | 16:12:07–16:14:19 | 2.50 s | `mm11-the-return` | 69.38–71.88 | e1 the sign | 2.50 s | butt, continuous |
| 32 | 16:14:19–16:19:19 | 5.00 s | `mm11-the-return` | 71.88–76.88 | e2 one chip note | 2.20 s | gap 1.21 s |
| 33 | 16:21:00–16:23:03 | 2.12 s | `mm11-the-return` | 78.75–80.88 | e3 the felt settle | 2.02 s | end; 8 f fade-out |

**Two alignment faults inside the EDL (both measured):**
- **The PLAN's tape-stop lands 1.25 s early** (segment 6). It was placed so that the cue's *end* (50.0 s) falls on the JOIN click. The cue's tape-stop reaches zero *on the click* at 48.75 s (b18.3: the cue sheet, and `render/alt/README.txt`). The music stops 2 beats before the click, 1.24 s of the render's post-click mute plays, and then the click lands out of silence: holes 1–2 and jump 2 in the appendices.
- **The blueprint opens on the render's own mute** (segment 2). The WORD segment starts at 5.0 s, and 5.003–6.247 s is baked to −90 dBFS in the render (the "settle never comes" cut). The blueprint's first 1.24 s play on the suite bed alone, then the score and the title stamp enter together: **+28 dB at 12:36:00**.

### 4.2 Every audible music run (starts and stops as heard)

| # | Starts | Length | Shots | Peak dBFS | EDL segment(s) | What ends it |
|---|---|---|---|---|---|---|
| 1 | 12:31:00 | 3.75 s | 24.01–24.02 | −19 | MM-07 sc 24 felt | segment ends (3 ms butt) into the WORD segment, whose first 1.24 s are a mute baked into the render |
| 2 | 12:35:22 | 14.40 s | 25.01–25.04 | −14 | MM-07 WORD → MM-07 the waltz → MM-07 the held chord → MM-07 PLAN: the path → MM-07 BREAK: the tape-stop | the tape-stop reaches zero 1.25 s before the JOIN click (the segment was aligned on the cue's end, 50.0 s, not on its click, 48.75 s); 1.24 s of the render's post-click mute plays before the click |
| 3 | 12:52:06 | 7.50 s | 26.01–26.06 | −15 | MM-08 LEVERAGE (the connect) → MM-08 the 1-bit dialog → MM-08 the eyes strip → MM-08 the arrow: Step Four | the Cancel click (D6 hard stop), as designed |
| 4 | 13:09:20 | 10.65 s | 26.10–27.01 | −20 | MM-08 26A: the carve → MM-08 26A: the Rewind → MM-09 a NOON | dry mute 1 bar before the candor card (13:20:12) |
| 5 | 13:31:18 | 0.10 s | 27.06–27.06 | −44 | MM-09 a NOON | dry mute: Gerg's post (dry around the post) |
| 6 | 13:33:22 | 1.55 s | 27.07–27.08 | −26 | MM-09 a NOON | dry mute: real line a4-27-06 (dry) |
| 7 | 13:38:00 | 1.60 s | 27.08–27.09 | −22 | MM-09 a NOON | dry mute: his 9:32 post (dry) |
| 8 | 13:45:12 | 1.20 s | 27.11–27.12 | −23 | MM-09 a NOON → MM-09 b the hearts | dry mute: his eulogy post (dry around the post) |
| 9 | 13:50:06 | 22.20 s | 27.12b–27.23 | −21 | MM-09 b the hearts → MM-09 c boardroom night → MM-09 d the lighthouse | dry mute: NOV 19 · the lobby camera + his post (dry) |
| 10 | 14:16:04 | 6.95 s | 27.24–27.29 | −22 | MM-09 f Ttemme → MM-09 g 11:53 PM | dry mute: real line a4-27-20 (dry) |
| 11 | 14:25:10 | 6.55 s | 27.29–29.01 | −17 | MM-09 g 11:53 PM → MM-09 h Step four? → MM-09x REVERSAL | the 09x felt F4 decays; the segment fades out at 14:33:02 and nothing follows for 6.9 s |
| 12 | 14:39:22 | 1.50 s | 29.03–29.04 | −29 | MM-10 a felt (the lanyard → "mostly.") | mute baked into the render for "mostly." (lands dry), then the segment's 6 f fade |
| 13 | 14:45:00 | 1.85 s | 29.06–29.06 | −22 | MM-10 a the counter | dry mute: the letter card · (REPORTED) · the check (dry) |
| 14 | 15:02:08 | 1.90 s | 29.12–29.12 | −26 | MM-10 a the Build (Gerg) | dry mute: the quiet beat · the D8 line · 'Everyone is welcome.' (no music, R16) |
| 15 | 15:12:18 | 17.50 s | 29.18–29.29 | −13 | MM-10 b1 the compile → MM-10 b2 Step Four → MM-10 b3 the Water Line → MM-10 b4 the full band | the dead stop on MADA's label, as designed; 2.5 s to the violin |
| 16 | 15:32:20 | 4.05 s | 30.01–30.01 | −26 | the violin (S30a) | the scripted stop on the first heart (3 ms); 5.71 s until the floor |
| 17 | 15:42:15 | 4.50 s | 30.03–30.06b | −20 | MM-11 b the floor | dry mute: the calm-off plays in silence under its own chaos |
| 18 | 16:06:00 | 1.30 s | 30.16–30.17 | −18 | MM-11 d the Build restarts | mute baked into the render for Ttemme's post and the sand's beat (4.37 s) |
| 19 | 16:11:15 | 4.30 s | 30.18–30.20 | −16 | MM-11 d the Build restarts → MM-11 e1 the stab → MM-11 e2 the flat line | the band cuts to one chip note (composed), then the flat line |
| 20 | 16:16:15 | 0.35 s | 30.21–30.21 | −24 | MM-11 e2 the flat line | the flat line: each F is a short chip note with nothing under it |
| 21 | 16:17:07 | 0.40 s | 30.21–30.21 | −25 | MM-11 e2 the flat line | the flat line (as above) |
| 22 | 16:17:21 | 0.25 s | 30.21–30.21 | −24 | MM-11 e2 the flat line | the flat line (as above), then the bonk |
| 23 | 16:21:00 | 2.00 s | 30.23–31.01 | −21 | MM-11 e3 the cadence | segment ends; no music for the last 16.9 s (the vault, the memo, the chair) |

### 4.3 Which OST material was used, and what was ready but unused

| Cue file | Length | Used (pieces) | Sections used (source seconds within the section) | Prepared for conforming, not used by v3 |
|---|---|---|---|---|
| `mm07-how-to-fire-a-ceo/render/e01-s25-the-plan` (MM-07) | 50.0 s | 20.6 s (6) | sc 24 felt 0–3.75 of 5 · WORD 0–2.5 of 7.5 (1.24 s of it the baked mute) · the waltz, all 7.5 · the held chord 0–2.5 of 5 · PLAN 0–2.5 of 7.5 (played *after* the held chord) · BREAK 5.6–7.5 of 7.5 | Stems (6 families) · `mm07-…-loop.wav` (12.5 s, seamless) · three tape-stop alternates from b16.1 (`render/alt/`), each reaching zero on the click at 48.75 s · THESE FOUR VOTE (b8) and the label bars (b9–10) |
| `e01-s26-the-falling-tile` (MM-08, to picture) | 72.5 s | 15.6 s (6) | P1 "call connects" 0–3.75 of 10 · P2 as three slivers (0–1.25, 2.5–3.12, 5.0–6.88 of 7.5) · 26A carve 0–3.75 of 7.5 · 26A Rewind 3.1–7.5 of 7.5 | Stems (7) · `mm08-the-falling-tile/render/variants/mm08-leverage-bed-loop.wav`: 10 s, seamless, written "for conform extensions and for LEVERAGE reuse (sc 9, sc 30)" |
| `mm09-the-boards-side` (MM-09 + 09x) | 115.0 s | 71.3 s (8) | a 0–27.9 of 30 (6.2 s baked-silent) · b 0–5 of 10 · c 0–14.9 of 25 · d 0–6.7 of 15 · f 0–5 of 10 · g 0–4.4 of 10 · h 0–2.5 of 5 · 09x all · e skipped | Stems (6) · **per-section part files** a–h and 28, each with a 1-bar overlapping tail (`render/parts/`) · **hold loops** for a, b, c, d (3 bars), f, g and h: measured continuous, −22 to −27 dBFS RMS, no dropouts. They are the conform bridges v3 needed. |
| `mm10-his-side-745` (MM-10) | 98.75 s | 29.3 s (7) | a "V.O. + mostly." 0–4.4 of 5 · a counter, all · a Gerg 2.6–7.5 of 7.5 (3.0 s baked-silent) · b1 0–5 of 10 · b2 2.5–7.5 of 10 · b3 0–2.5 of 10 · b4 0–5 of 10 | Stems (8) · the track's own switches (`CARD_BAR`, `BUILD_STOP`) for re-conforming |
| `e01-s30a-the-door` (the STRAIGHT violin) | 10.0 s | 4.1 s (1) | the Door, cut at the first heart with the mix's 3 ms fade | Four pre-rendered stops (`…-stop-f8427/8439/8451/8466.wav`) |
| `mm11-the-return` (MM-11) | 81.9 s | 23.0 s (5) | b floor 0–4.6 of 7.5 · d 1.25–10 of 10 (6.9 s baked-silent) · e1, all · e2 0–5 of 6.9 (1.25 s baked-silent) · e3, all | Stems (7) · **c1 LEVERAGE, from the door bang to "Terms?" and dropping out on it, and c2, the long hold into the stamp's C pedal, were never used**: v3 muted the whole stretch (15:47:05–16:03:13) as "the calm-off plays in silence" |
| `mm01-water-line` (library, DARK ROOM) | 75 s | — | — | A 60 s seamless loop plus 5, 15 and 30 s cuts (no stems in `render/`) |

## 5. Holes (every one is in Appendix A)

| Cause (the first cause found in the window) | Holes | Seconds |
|---|---|---|
| **The mix's dry-window mutes** | 58 | 57.0 |
| **Mutes baked into the renders** (MM-07 BREAK; MM-10 a "mostly." and "what are you building?"; MM-11 d Gerg's and Ttemme's posts; MM-11 e2 the bonk and the [CU]) | 6 | 10.0 |
| Music tails decaying onto the floor (09x's felt F4, the violin's lead-in, the flat line) | 5 | 5.1 |
| D6, designed | 1 | 3.0 |
| The gap between cues (tape-stop → LEVERAGE) | 1 | 0.55 |
| **Total** | **71** | **75.65** |

**Every hole except D6 had a bed running, measured at −43 to −53 dBFS.** The problem is level and character, not a missing file.

The dry windows that produced the most hole time:

| Dry window | Holes | Seconds | What it did |
|---|---|---|---|
| The calm-off "in silence under its own chaos" (15:47:05, 16.3 s) | 11 | 9.0 | Muted from the door bang to Gerg's post, so Terb's lines, the freeze and both "good question"s sat on fire crackle at −48 |
| The letter card · (REPORTED) · the check (14:46:21, 12.5 s) | 10 | 8.6 | Room tone only under a quote card, a list and a check: 16 s with no music, counting the counter's end |
| The hearts (14:32:11, 7.5 s) | 11 | 5.6 | The eight `post_click` ticks, one a beat, over −44 dBFS: **a rhythmic on-off, 11 holes of 0.3–0.95 s** |
| "super." + F1.2 (13:04:18) | 3 | 5.4 | The drop-out's aftermath, and F1.2's accidental digital second |
| His 9:32 post · the eulogy post · the lobby camera | 3 | 11.8 | One hole each, of 3.1–4.9 s |
| The candor card ± 1 bar, Rima (13:20:12) | 5 | 6.9 | 8.75 s of mute around a 3.75 s card |
| The memo "and after: none" (16:29:13) | 7 | 4.65 | The act ends on 10 s of bullpen tone at −48 |

## 6. Abrupt jumps (every one is in Appendix B)

| Class | Jumps | What it means |
|---|---|---|
| A line's edge on the near-silent floor | 47 | Speech onsets and ends over −43 to −51 dBFS. A normal dialogue edge only measures this large because the floor is so low. |
| An SFX edge on the floor | 25 | For example the door BANG at −4 dB: +32 dB at 15:49:00 |
| Music in (segment start, dry release) | 12 | For example LEVERAGE +33 dB at 12:52:06, and the avalanche +23 dB at 15:12:18 |
| Music back after a baked mute | 8 | For example the WORD +28 dB at 12:36:00, the Build +22 dB at 16:06:00 and +28 dB at 16:11:15, and the flat line's three blips at 16:16:15, 16:17:07 and 16:17:21 |
| Music out (segment end, dry mute, baked mute) | 5 | For example the lighthouse −20 dB at 14:12:10, and the MADA label −23 dB at 15:30:06 (designed) |
| D6, designed (the cut, the click's decay, the return) | 5 | — |
| F1.2's bed gap | 4 | −∞ at 13:06:03 |

Classes are assigned automatically from the events at each edge, so a few are ambiguous (an SFX and a music edge on the same frame).

By scene: 25: 2 · 26: 12 · 26A: 1 · 27: 27 · 29: 20 · **30: 34** · 31: 10. The floor what-if (§2) shows that most of the first two classes go once the floor is audible. The music classes need the continuous cue.

## 7. Dialogue rhythm

- **From the lock** (46 voiced lines, 45 gaps): 7 overlaps · 6 at 0–0.2 s · 3 at 0.2–0.5 s · 8 at 0.5–1.2 s · 5 at 1.2–3 s · 6 at 3–6 s · 5 at 6–12 s · 5 over 12 s.
  - The distribution is **bimodal**: 16 gaps of 0.3 s or less and 16 of 3 s or more.
  - The loaded replies were given the same 2–7 f as the quick ones: "More. Soon." 0.17 s, "You can call it this way" 0.29 s, "That is the company telling us." 0.08 s, Mada's "Good question." after "Terms?" 0.08 s.
- **From the premix audio** (the speech itself; pauses under 0.2 s merged): 41 speech runs, with gaps from 0.25 s to 19.45 s.
- **The five longest stretches with no audible voice** (from the mix's own measurement), mostly over muted music:
  - 19.5 s (16:00:22, the long hold → Gerg's post → Ttemme's post → the lobby → "okay.")
  - 18.2 s (12:46:17, THE PLAN's path → JOIN → the call → D6 → "super.")
  - 16.4 s (14:43:06, "mostly." → the counter → the letter card → the list → the check → Gerg)
  - 14.4 s (13:37:07, Alyi → the 9:32 post → the CEO box → the hearts → the committee)
  - 13.5 s (14:26:12, "Step four?" → the card → the home shot → the hearts → the V.O.)
- **The V.O. sits in holes in two places:** "gerg never waits to be asked." and TASYA's "Everyone is welcome." have no music and a −43/−44 dBFS bed.

## 8. The beds as measured

| Bed (EDL label) | File, gain | In → out | Median in the mix |
|---|---|---|---|
| the suite: room tone | `room_tone` −28 | 12:31:00 → 12:59:18 | −47.8 |
| the suite: the room comes back with the phone | `room_tone` −28 | 13:02:21 → 13:06:03 | −47.8 |
| the dark room: sub drone (pre-laps under F1.2's grain) | `room_drone` −30 | 13:08:00 → 13:18:00 | −43.3 (with air) |
| the dark room: air | `room_tone` −32 | 13:09:21 → 13:18:00 | −42.9 (with drone) |
| the board's rooms: air | `room_tone` −30 | 13:18:00 → 13:33:22 | −49.9 |
| the all-hands crowd | TEMP-SYNTH murmur −24 | 13:33:22 → 13:39:15 | −49.7 |
| the boardroom / the lighthouse: air | `room_tone` −30 | 13:38:02 → 14:12:11 | −49.6 |
| the lobby camera: CCTV hum | `neon_buzz` −28 | 14:12:11 → 14:16:05 | −45.3 |
| the boardroom: air | `room_tone` −30 | 14:16:05 → 14:28:02 | −49.7 |
| the dark room: sub drone + air | `room_drone` −32, `room_tone` −30 | 14:30:14 → 15:32:18 | −44.3 |
| the bullpen: room tone | `room_tone` −28 | 15:32:18 → 15:47:05 | −47.8 |
| the boardroom: air + the cartoon fires | `room_tone` −30, TEMP-SYNTH crackle −22 | 15:47:05 → 16:12:07 | −48.5 |
| the lobby: the sign's buzz | `neon_buzz` −30 | 16:12:07 → 16:21:16 | −47.3 |
| the bullpen: room tone | `room_tone` −28 | 16:29:13 → 16:39:21 | −47.9 |

Gaps with no bed:
- 12:59:18 (3.15 s): D6, designed.
- **13:06:02 (1.9 s): F1.2.** Only the render-front sweep plays; about 1.0 s is true digital silence.
- 14:28:01 (2.55 s): the card and the home shot, where 09x plays.
- **16:21:15 (7.9 s): 31.01–31.02.** The vault's `server_hum` (SFX bus) stands in, but the bullpen has no air under Gerg and Mas.

---

## 9. v4 SOUND PLAN (draft)

**The shape, in one line.** Each sequence gets one continuous piece of music and one continuous room. The music thins and ducks under words, posts and cards instead of stopping. It stops for real only four times, each on a story beat with the room still audible under it. D6 stays the act's only digital silence.

**What stays firm:**
- The guardrails.
- The showrunner's story calls: the firing is shown here, it's the act's subject, and there's no on-screen "speculative" label.
- The designed D6.

The spotting rules of OST-BIBLE §0 rule 10 and §1.6 (no music under real lines and cards, 1 bar clear) are replaced by flow-and-continuity §3, as its §7 says. Everything else below is a proposal with a reason. Where it departs from a script or table-read ruling, it says so and gives a fallback (§9.9).

**Sequences.** The v4 edit defines the sequences. I've used the story's own seams, and v3's clock is given only so the spans can be found. If the editor merges two of them (2 + 3, or 5 + 6), the cue boundaries don't move, because they sit on the same story beats.

| # | Sequence (v3 span) | Place · time · the question the audience holds | Cue (one performance) | Room bed | Music stops |
|---|---|---|---|---|---|
| 1 | **The suite and THE PLAN** · sc 24–25 (12:31:00–12:52:06, 21 s) | The Vegas suite, noon; THE PLAN is his laptop's glow. *Who can fire a CEO who owns nothing?* | MM-07: the felt → the Blueprint → the waltz → the tape-stop onto JOIN | The suite (continues under the blueprint) | The waltz's musical-chairs rest (inside the cue) |
| 2 | **The call** · sc 26 (12:52:06–13:09:21, 17.6 s) | The same suite, on the call. *What are they doing to him?* | MM-08 LEVERAGE, from the connect to the click | The suite → **D6** → the suite returns → F1.2's TPOOL room | **Stop 1: the Cancel click (D6)** |
| 3 | **That night, his desk** · 26A (13:09:21–13:18:00, 8.1 s) | His dark room. *What does it cost him (he says nothing)?* | MM-08 26A: a felt line → the Rewind | The dark room | — |
| 4 | **THE BOARD'S SIDE** · sc 27 + card 28 (13:18:00–14:30:14, 72.6 s) | Their rooms, noon Nov 17 → 11:53 PM Nov 19. *What did the board actually do, and why can't they finish?* | MM-09 a → h → 09x, in order; a section change on each rail | Neleh's office → the all-hands → the boardroom → the lighthouse → the lobby camera → the boardroom | — (the procedure goes on) |
| 5 | **HIS SIDE** · 29.01–29.17 (14:30:14–15:12:18, 42.2 s) | His dark room, Nov 20. *What does he do while it collapses?* | MM-10 a as a continuous DARK ROOM pedal, with the felt and the Build over it | The dark room | **Stop 2: Gerg looks up** |
| 6 | **The avalanche** · 29.18–29.30 (15:12:18–15:32:18, 20 s) | His monitor. *The staff choose him.* | MM-10 b, 8 bars, one take | The dark room (the monitor's world) | **Stop 3: MADA's label** |
| 7 | **The return** · sc 30 (15:32:18–16:21:16, 49 s): 7a bullpen · 7b boardroom · 7c lobby | Back in the building, Nov 20–21. *He's back: what did it cost, and who owns him now?* | The violin → MM-11 b floor → c1 LEVERAGE → c2 hold → d Build → e stab, flat line, cadence | The bullpen → the boardroom with fires → the lobby at night | **Stop 4: "Terms?" → the long hold** |
| 8 | **Q\* and the memo** · sc 31 (16:21:16–16:39:21, 18 s) | The bullpen, Nov 22 → 29. *What's in the vault?* | The vault's F hum becomes the root (MM-12's, B2), a pedal into the tag | The bullpen, with the vault's hum | — |

### 9.1 Sequence by sequence

**1 · The suite and THE PLAN** (MM-07)
- **Cue.** One performance of MM-07, in order: the felt Water Line bar (the settle never comes) → WORD → the waltz, 4 waltz bars in 3 picture bars, with its dead stop on b7.1 as the joke → Step Four → the held chord under "Good question." → BREAK → the tape-stop, reaching zero **exactly on the JOIN click**.
- **Length.**
  - The cue is 18 bars and v3's picture is 7, so this needs a **re-render at the v4 bar count**, not six excerpts. The PLAN-SHORT and PLAN-MICRO forms exist, but they have no waltz.
  - Interim, if the re-render isn't ready: take the source in order only, join on bar lines where the harmony matches with 1-beat equal-power crossfades, and **never go backwards** (v3's held chord → PLAN did).
  - Cover the render's baked 1.24 s mute at 5.0 s with the suite bed and a pre-lapped Blueprint pad, so the stamp doesn't come out of silence.
  - Take the break from `render/alt/…tapestop-b17-*-underscore-from-b16.wav` (it starts at b16.1 = 42.5 s), aligned so that **48.75 s = the click**. v3 aligned 50.0 s and stopped 1.25 s early.
- **Thins.**
  - NELEH's read is the act's load-bearing setup: who votes, who owns nothing. Duck **−10 to −12 dB** under her words (v3: −3 dB, which left her 7.4–8.6 dB over the waltz).
  - Let the waltz's melodic events (the three chairs walking off, the C6) land in her pauses and on the drawings.
  - "Good question." sits on the held chord, pp, as written.
- **Bed.** The suite continues under THE PLAN at about −6 dB: the blueprint is his laptop's glow, and the tear goes "straight back into the suite".
- **Handoff to 2.** LEVERAGE's first eighth lands on the click, or within a beat of it. v3 left 0.62 s with no music.

**2 · The call** (MM-08 LEVERAGE, then the drop-out)
- **Cue.** LEVERAGE low, as one take from the connect to the click: the pulse, the card's dip, the 1-bit F F F on the dialog, the cluster up a semitone on the eyes, and Step Four in quarters on the arrow. Then **b8.1, a hard stop on the Cancel click (D6)**.
- **Length.**
  - Re-render MM-08's bars 1–7 at the v4 call's bar count. `mm08-the-falling-tile` is parametric: `leverage(bars=…)`, `compose(form='picture')`.
  - Interim: `variants/mm08-leverage-bed-loop.wav` (10 s, seamless) from the connect, then a 1-beat crossfade on a bar line into `e01-s26-the-falling-tile` at 10.0 s (b5, the 1-bit dialog) through 17.5 s. Place it so that 17.5 s (b8.1) is the click frame. That's two pieces and one crossfade, over the same F pedal, instead of v3's four slivers.
- **Thins.** Nobody on the call is heard, so nothing needs to thin.
- **After the stop.** The phone's buzz brings **the suite back at an audible level**. "super." lands in that air, with no score, which is the drop-out's aftermath and a story beat. Then F1.2's render front crosses (1 s) into the **TPOOL room** (§9.3). There's no score under F1.2: it's (REPORTED), never a Mas motif, and C39's intent stands. The dark room's drone pre-laps 2 beats under the grain.
  - This is the act's one long music-free span (about 10 s at v3's lengths). It works only if the rooms are audible and eventful: the buzz, the tap, "super.", the sweep, the frosted glass. It's the first thing to check by ear (§12).

**3 · That night, his desk** (MM-08 26A)
- **Cue.** The felt's open fifth enters on the grain→desk, as the music's re-entry after D6 (a new phrase, not a blip). One sustained note under "i don't keep score." (v3 measured 21.9 dB of clearance: fine). Then the Rewind: the felt retrograded through the sample chip, landing on sc 27's downbeat.
- **Length.**
  - Re-render 26A without the bars for the post that v3 moved to sc 27 (b24–25).
  - Interim: 52.5–56.25 s → a 1-beat crossfade → about 68.1–72.5 s. Both sides are single sustained felt notes, and a crossfade replaces v3's 3 ms butt.
- **Bed.** The dark room, audible (§9.3). Under the whip, the dark room's tail rings 0.5 s into the board's call: the whip's air pass covers the cut.

**4 · THE BOARD'S SIDE** (MM-09, a → h → 09x)
- **Cue.** One continuous performance, straight: no piano, chip or swing until 09x.
  - Its section changes land on the downbeats of the rails and room changes: NOON, NOV 18, the boardroom at night, the lighthouse, NOV 19, 11:53 PM. The music tells a newcomer "new day, new room" without another card.
  - That's more useful to them than v3's mix of rails and silences, and it costs an insider nothing.
- **Length.**
  - Re-render MM-09 at the v4 section lengths. `SECTIONS` and `MUTES_BARS` are module-level in `mm09-the-boards-side/track.py`; point `MUTES_BARS` at nothing and write the thinning as `stem_auto` (below).
  - Interim, and v3 already had the pieces for it:
    - Lay each **part file** (`render/parts/…-e01-s27a-noon.wav` … `…-s27h-step-four.wav`, `…-s28-what-they-didnt-know.wav`) from its first bar at its section's first frame, using the 1-bar overlapping tails for the section crossfades.
    - Where a part's baked mute falls under a v4 line or post, or the picture outruns the part, lay that section's **hold loop** (`…-hold-loop.wav`: continuous, −22 to −27 dBFS) over it with 1-beat crossfades.
    - Section e (the lobby camera) has no hold loop: use d's `hold3` or f's.
- **Thins** (the pulse, melody, harp and brass out; the section's pedal or hold bar at about −12 dB; strings sul tasto only):
  - under the candor card
  - under Gerg's "…I quit."
  - under ALYI's "You can call it this way"
  - under the 9:32 post and the eulogy post
  - under the lobby camera and its post
  - under TASYA's "a new advanced AI research team"

  The card needs no bar clear on each side: it gets the pedal, and nothing moves.
- **"super." through their laptop.** The procedure goes on, 9 dB down, which is the joke. v3 already did this.
- **Duck** −8 to −10 dB under the invented lines (NELEH, RIMA, ALYI's reflection, MARIO, ADELINA, TTEMME). Neleh's clockwork pizzicato stays where it's written, on her lines: it's her colour, not comic scoring.
- **Stops.** None. The phone clacks, the throne's click cutting the Addendum's tail and the four dial tones are the SFX's (MM-09 c is "out before the four dial tones": keep that 1-beat rest inside the cue).
- **Out.** 09x REVERSAL on the card's downbeat. Its felt F4 **rings into sequence 5's pedal**: v3 let it decay and then left 6.9 s with no music.

**5 · HIS SIDE** (MM-10 a)
- **Cue.** The DARK ROOM as a continuous low pedal: an F/C open fifth, low strings sul tasto, over the room drone, which is itself tuned F1 + C2. Over it:
  - The felt line surfaces for "the badge was a joke." and holds, not moving, for "mostly.".
  - The Build's first cell (chip) runs on the counter, stopping on the clunk.
  - The Build's 4 notes, then 8, run under Gerg's tile.
- **Length.**
  - Re-render MM-10 a at the v4 length. As rendered it is mostly silence by design: it's muted at 8.1–15.6 s, 23.1–40.6 s and 48.1–58.7 s. Keep only the one stop, `BUILD_STOP='quiet'`, and no other mutes.
  - Interim: raise the dark room's `room_drone` and air to audible (it's the score's root) and lay MM-10's felt and Build pieces in place with 1-beat fades.
  - `mm01-water-line`'s 60 s loop is a felt option for "the badge was a joke." only. It has no stems, so it can't be thinned under the record.
- **Thins** (the pedal only, no melody and no motif; (REPORTED) material never carries a Mas motif, and a pedal isn't one):
  - under RIMA's post and the eight hearted ticks (**the ticks keep their rhythm on top of the pedal, not over an empty floor**)
  - under the letter card, the signature list and ALYI (REPORTED)
  - under the Orb's chime and the check
- **Stop 2.** When Gerg glances up, **the Build stops dead** (§9.2).
- **Re-entry.** The pedal comes back under "gerg never waits to be asked.", so the V.O. sits inside the bed. It holds under the door's three steps, TASYA's "Everyone is welcome." and "leave it open.". Then the avalanche erupts on the first tile's downbeat.
  - This departs from R16 ("no music" under the D8 line and "Everyone is welcome."). The fallback is §9.9.

**6 · The avalanche** (MM-10 b)
- **Cue.** One 8-bar performance, 2 · 2 · 2 · 2, so each phrase arrives whole:
  - the Build compiling (4 → 8 → 12 → 16 notes)
  - Step Four displaced, holding 1 beat as Alyi resists
  - the Water Line augmented, with the QUIET VOTE's layer dropping out silently
  - the one full band, ≤ 2 bars, then a **dead stop on MADA's label**

  v3 took 2 + 2 + 1 + 2 bars from four different places, so phrase 2 entered mid-phrase (+20 dB at 15:17:18) and phrase 3 was 1 bar.
- **Length.** Re-render at 8 bars with `CARD_BAR` on the v4 label frame. There's no good interim from the 16-bar render: its phrases are 4 bars each.
- **Thins.** "Has anyone read the char—" is in the cue's composed 1-bar window: duck −10 dB there (v3: 7.9 dB clear).
- **Stop 3.** On the label (§9.2).

**7 · The return** (the violin, then MM-11 b–e)
- **7a, the bullpen.**
  - The STRAIGHT violin under ALYI's post stops dead on the first heart, as scripted. Use the pre-rendered stop nearest the v4 heart (`…-door-stop-f*.wav`), or re-run `e01-s30a-the-door` with `STOPS` set to the v4 frame.
  - The HOLD 1 BEAT is bullpen room, and audible.
  - Then **Tasya's Rhodes floor** enters: its first chord (A♭maj9) arrives as a sustained pad under the end of her real line (no comping, the palette steps silent), and it blooms after the line (A♭maj9 → Cmaj9 → Emaj9 → A♭maj9).
  - "hi." and "Hello." sit on its decay. v3 left 5.7 s with no music between the violin and the floor, with Tasya's line on −47 dBFS.
- **7b, the boardroom.**
  - **MM-11 c1 LEVERAGE** plays from the door bang through Terb's lines, ducked −8 dB. It's already rendered and was never used.
  - **Stop 4: it drops out on "Terms?"** (§9.2).
  - The long hold plays in the room.
  - **c2's low C pedal enters under the stamp's C.**
  - Gerg's post: **the Build restarts on the keycaps** and thins under the post's read (wood and pizz, the chip lead out), opening up on Mas's [PF].
  - Ttemme's post: the Build thins again (the chip lead out). **The sand's held beat is the only rest (1 beat)**, and the Build resumes as the sand falls.
  - v3 had a 4.1 s mute here, plus a 1.2 s one on Gerg's post.
  - **Length:** re-render MM-11 c–d at v4 lengths, with the post mutes written as thinning. Interim: MM-11 31.875–59.4 s (c1 + c2) edited on bar lines to the door bang, "Terms?" and the stamp. For d, bridge its post mutes with the `mm08` LEVERAGE bed at −14 dB, or lay the Build cell again.
- **7c, the lobby.**
  - The brass stab on the sign's ignition (VICTORY LAP) → one chip note on the box of 0 plates.
  - **The 1993 flat line F F F as one phrase.** Sustain each F into the next (tenuto), or hold a chip F pedal under them, so the three notes don't read as three 0.3 s blips (v3: 16:16:15, 16:17:07, 16:17:21).
  - The bonk (SFX) on beat 4 → the [CU]'s 2 beats in the lobby's neon buzz, a callback to D6's [CU], but with the room audible, so it's a quiet and not a stop → "okay." (nothing moves under it) → the felt cadence C4 → F4 after it.

**8 · Q\* and the memo** (the vault's hum → MM-12)
- **Cue.** The vault's F hum is the room's sound and becomes the score's root (GLYPH, diegetic).
  - It stays as a **pedal through the whole sequence**: Gerg and Mas at the vault, the memo, the screws and the chair.
  - It thins under the memo (a real line) to the hum alone, ducked, with no motif.
  - It carries into the tag's dark room. MM-12 is B2's and isn't rendered yet, so `server_hum` stands in, as in v3.
- **Bed.** The bullpen by day under all of it, including 31.01–31.02 (missing in v3).
- The act no longer ends on 10 s of −48 dBFS room tone.

### 9.2 The deliberate music stops

Four is about right for a 4-minute act. Each lands on a story beat, keeps the room audible under it (except D6), and re-enters with a new phrase.

| # | Where | Why it earns a stop | Under it | Re-entry |
|---|---|---|---|---|
| 1 | **The Cancel click (D6)** | The blow. It lands harder because the music before it has been one continuous trap. In v3 it was one stop among 23. | **Digital silence, every bus, about 5 beats** (v3: 3.04 s). The act's only one. | The phone's buzz brings the suite back. The music returns after the aftermath, on 26A's felt fifth. |
| 2 | **Gerg looks up** (the quiet beat, 3 beats) | His real face, and the silence the avalanche erupts out of | The dark room and Gerg's keys | The pedal under the D8 V.O., then the avalanche's downbeat. v3 was music-free for 8.5 s here; about 2 s is enough. |
| 3 | **MADA's label** | The stat is the joke; the band stopping dead is the punchline | The dark room's air through the label's hold | A new colour for a new sequence: the violin under ALYI's post |
| 4 | **"Terms?"** → the long hold | The episode's one long hold. The chaos behind two still men is the scene. | The room: fires, the extinguisher, keycaps, a key ring | c2's C pedal under the stamp, then the Build. v3 was music-free for 16.3 s from the fires' first shot; this is about 4–5 s. |

- **Rests inside a cue that keeps going** (these aren't stops):
  - the waltz's musical-chairs stop (b7.1, about 1 beat)
  - the violin's stop on the first heart, with its 1-beat hold (the floor follows)
  - "out before the four dial tones"
  - the sand's held beat
  - the [CU] before "okay." (2 beats of lobby buzz)
- **Everything else v3 stopped for becomes thinning, a crossfade or a pre-lap.** That's the 16 dry windows, the baked mutes that land in picture, and the EDL gaps other than the stops' own.

### 9.3 Room beds per location

**Levels, as a guide:**
- Beds about **−38 to −42 dBFS RMS in the mix**, about 20–24 dB under the lines. v3 was −43 to −50, 27–33 dB under.
- With a thinned cue on top, the floor under a record item lands about **−32 to −36 dBFS**.
- The beds must be real ambience with movement, not static noise. Whether −38 reads as "air" or as "hiss" on laptop speakers is an ear call (§12).

**Crossfades:**
- 0.5–2 s at location changes, with the new room pre-lapping under the old one's last half-second on a time jump.
- A hard cut only for D6 (in and out), and where a whip's air pass carries the change.

| Location | Shots (v3) | Bed (build from) | Guide level | In / out |
|---|---|---|---|---|
| The Vegas suite, noon | 24–26.09 | HVAC and the Strip far below: a traffic and crowd wash, the race weekend's far engine drone; the crane truck's pass (SFX). TEMP from `room_tone` plus a low-passed crowd/traffic synth; the board has no Strip bed yet (a *(build)* item). | −38; −44 under THE PLAN | Pre-lap 1 bar under sc 23's black (the script's handoff). Hard out on D6; hard back on the phone's buzz. 1 s crossfade on F1.2's render front. |
| F1.2 · TPOOL, 2005–08 (REPORTED) | 26.10 | A frosted-glass office: HVAC and muffled voices behind the glass, through the engine's `era` EARLY-WEB16 colour. New TEMP. | −42 | In on the render front (1 s); out under the grain (2 beats) into the dark room |
| His dark room | 26A, 29.01–29.30 (and the tag) | `room_drone` (F1 + C2), air, and the server rack's fans (`server_hum` low); the Orb's servo is SFX | −38 to −40 (v3 −43/−44) | Under the whip, 0.5 s into the board's call. In sc 29, from 09x's felt F4. 0.5 s crossfade to the bullpen after MADA's label. |
| Neleh's office, noon (the board's call) | 27.01–27.06 | A home office: HVAC, a laptop fan; the call's speaker hiss on [SCR] shots | −40 | In under the whip; 0.5 s into the all-hands |
| The all-hands, bullpen | 27.07–27.09 | Crowd murmur (the TEMP murmur exists; raise it from −50 to about −36). It hushes for "Is this a coup?" and stirs after Alyi's line. | −36 | 0.5 s crossfades |
| Neleh's desk that night, and the board's grid on Nov 18 | 27.10–27.12b | The same office at night: quieter HVAC; the other phones buzzing off picture (the disk WAV already has them) | −42 | 1 s crossfade into the boardroom |
| The boardroom at night | 27.13–27.20, 27.25–27.31; sc 30 from 30.07 | HVAC and the city through glass (no sirens). Sc 30 adds the fires' crackle (raise it from −48 to about −36) and the extinguisher. | −38 to −40 | 1 s crossfades on the rails (NOV 19, 11:53); pre-lap the crackle 1 s under sc 30's rail |
| The lighthouse | 27.21–27.23 | Wind, far surf, the lamp's slow motor. New TEMP: it gives the place an identity a newcomer can hear. | −38 | The speakerphone's ring carries over the cut (scripted); the bed crossfades in 0.5 s; 1 s out into the lobby camera |
| The lobby, on camera | 27.24 | CCTV hum (`neon_buzz` as a stand-in), big-lobby air, his steps (TEMP steps exist in the disk WAV) | −40 | 1 s in and out |
| The bullpen by day | 30.01–30.06b; 31.01–31.05 | Low office murmur, a few keyboards, packing rustle (boxes, coats), HVAC. Audible under the violin's hold. | −38 to −40 | 0.5 s in after MADA's label; continuous through Tasya's remap; 1 s out into the boardroom |
| The lobby at night | 30.19–30.23 | The sign's neon buzz on F (`neon_buzz`) and a big dark room's air. It carries the [CU] alone. | −40 | Pre-lap 0.5 s under the hourglass shatter's tail; 1 s out into the vault |
| The Q\* vault | 31.01–31.02 | `server_hum` on F at −18 as SFX, swelling on "it's a preview." (as in v3), over the bullpen bed | hum as is; bullpen −40 | Into the tag's dark room |

### 9.4 Ducking and thinning (for mix_v4)

- **Mix the music from stems, not from the stereo master.** Every cue ships stems that sum to the master (residual −160 dB or better), so thinning is a gain move per family:
  - **Thin** = chip, brass, winds, perc/harp and drums fade out over about 1 beat before the word or pop, and come back after the line on the next beat or downbeat.
  - Strings, bass and the piano/pad hold at about −6 dB, and the duck applies on top.
  - This needs renders **without baked mutes**: an engine mute zeroes every stem, so a stem mix can't thin across a baked mute. Hence the re-renders in §9.7.
- **Duck** from the dialogue bus, look-ahead about 40 ms so the duck is down before the first consonant:
  - about −8 dB under invented lines
  - about −10 to −12 dB under load-bearing setup lines (THE PLAN's read) and under record items
  - attack about 60 ms, release 400–600 ms
  - **hold the duck through gaps shorter than about 1.2 s**, so quick exchanges don't pump
- **Target, as a guide:** dialogue about 15 dB or more over the music while words play. v3's median was 10.8 dB, with 7 lines under 9 dB.
- **The laptop "super.":** the pizzicato keeps its −9 dB duck under it (4.8 dB clear, by design: the tiny voice under the procedure going on is the joke).

### 9.5 Dialogue spacing

- **Pace from the performance, not a default.**
  - Quick replies about 0.2–0.5 s (5–12 f).
  - Loaded or considered replies about 0.6–1.2 s (15–29 f).
  - Keep the 7 scripted overlaps.
  - Hold the duck and the bed through all of it, so a gap is room and music, never a hole.
- **Long wordless stretches** stay: they're the set-pieces and the record. They now play over the continuous cue and room, which is what makes them picture-under-music rather than holes. No lines are added.

| Exchange (v3 shot) | v3 gap | v4 guide | Why |
|---|---|---|---|
| NELEH's blueprint read, clause to clause (25.02–25.02d) | 0.54 · 0.17 · 0.58 s | About 0.3–0.6 s, on the drawings | Each clause lands on its drawing; brisk but readable. It's the act's exposition. |
| "And the CEO owns—" / MADA "Good question." (25.02d) | overlap 4 f | Keep | The cut-off is the joke |
| RIMA "We'll share more soon." / NELEH "Share what?" (27.05) | overlap 6 f | Keep | She interrupts |
| "Share what?" → RIMA "More. Soon." (27.05c) | 0.17 s | **0.5–0.7 s** | The identical non-answer is the joke; give it a pleasant, unhurried beat |
| EMPLOYEE "Is this a coup?" → ALYI "You can call it this way" (27.08) | 0.29 s | **0.6–0.9 s** | The act's first admission, on the record; a considered beat (the cut to the doorway carries it) |
| "The bylaws allow it. Footnote three." → ALYI "Step four will reveal itself." (27.14) | 0.29 s | 0.3–0.5 s | A quick volley |
| ALYI → NELEH "When?" (27.14) | overlap 4 f | Keep | Heated |
| "The company is calling us." → ALYI "That is the company telling us." (27.17) | 0.08 s | **0.4–0.6 s** | A loaded answer from a reflection (then the flicker) |
| MARIO "…some thoughts—" / ADELINA "In plain English: no." (27.22b) | overlap 7 f | Keep | She takes the phone |
| ADELINA → MARIO "Hi. Yes. We're very worried. How much?" (27.23) | 0.21 s | 0.4–0.6 s | The click, the throne and the second ring need a clear moment |
| TASYA's post → NELEH (O.S.) "Step four?" (27.30) | 0.54 s | 0.6–0.9 s | The blank line; loaded |
| "the badge was a joke." → "mostly." (29.05) | 0.71 s | 0.7–1.0 s | The one true word, said aloud |
| GERG "One sec. Compiling—" / MAS "what are you building?" (29.11b) | overlap 4 f | Keep | Talking over the keys |
| MAS → GERG "The company. Again. Just in case." (29.12) | 0.17 s | 0.3–0.4 s | Gerg answers without stopping typing |
| D8 V.O. → TASYA "Everyone is welcome." (29.16) | 0.625 s | 0.6–1.0 s | Scripted: at least a beat after the line |
| TASYA / MAS "leave it open." (29.17) | overlap 4 f | Keep | On the tail of "welcome" |
| MAS "hi." / TASYA "Hello." (30.06b) | overlap 1 f | Keep | — |
| TERB "Which room is on fire?" → "…Ah." (30.11b) | 0.79 s | Keep, about 0.8–1.0 s | The look-around is the gag |
| TERB "Terms?" → MADA "Good question." (30.13) | 0.08 s | **0.4–0.6 s** | Mada is perfectly still; he takes his time |
| MADA → MAS "good question." (30.14) | 0.625 s | Keep (one beat late, scripted) | — |
| GERG "What's in there?" → MAS "it's a preview." (31.02) | 0.17 s | 0.25–0.4 s | "Already past": quick is right, just not clipped |

### 9.6 Handoffs between cues

| From → to | v3 | v4 |
|---|---|---|
| MM-07 → MM-08 (JOIN → the connect) | The tape-stop stopped 1.25 s early; 0.62 s with no music | The tape-stop reaches zero on the click; LEVERAGE on the click or the next beat |
| MM-08 → D6 → the room → 26A | Correct stop; ~1 s of accidental digital silence in F1.2 | The same stop; rooms audible; the felt pre-laps the grain |
| 26A → MM-09 (the Rewind) | A butt on sc 27's downbeat (designed) | Keep; the dark room's tail runs 0.5 s under the whip |
| MM-09 → 09x → MM-10 a | 09x's felt F4 decayed into 6.9 s with no music | The F4 rings into sequence 5's pedal |
| MM-10 a → the quiet beat → MM-10 b | The Build stopped, then 8.5 s with no music | The Build stops (stop 2); the pedal returns under the V.O.; the swing on the first tile |
| MM-10 b → the violin | A dead stop, then 2.5 s at −46 | A dead stop (stop 3) with audible dark-room air; a crossfade to the bullpen; the violin |
| The violin → the floor | 5.7 s with no music; Tasya's line on −47 | The floor's first chord as a pad under the end of her line |
| The floor → LEVERAGE (c1) | The floor faded, then 16.3 s muted | c1 in on the door bang, out on "Terms?" (stop 4), then c2 |
| MM-11 e → sequence 8 | The cadence, then 16.9 s with no music to the act's end | The cadence settles onto the vault's F hum (the same root) as a pedal |

### 9.7 How to build it

- **Re-render the cues at v4 lengths** into the new folder `audio/ost/tracks/e01-act4-v4/` (per the brief; the engine and batch-1 tracks are untouched).
  - Use one small wrapper per cue on the pattern `e01-s26-the-falling-tile` already uses: it imports `mm08-the-falling-tile/track.py` through `importlib` and renders a to-picture form.
  - Each wrapper re-lays the sections to the v4 bar counts and **replaces the dry-rule mutes with `stem_auto` thinning**, keeping the designed stops.
  - From my reading of the code, the switches exist: MM-09 `SECTIONS`/`MUTES_BARS`; MM-10 `CARD_BAR`/`BUILD_STOP`; MM-08 `leverage(bars=…)` and `compose(form=…)`; MM-11 `SPOT`; the door `STOPS`. **I haven't run any of them.**
  - Wrappers: `s1-plan` (MM-07) · `s2-leverage` (MM-08, bars 1–7, b8.1 on the click) · `s3-26a` (MM-08) · `s4-boards-side` (MM-09 + 09x) · `s5-his-side` (MM-10 a) · `s6-avalanche` (MM-10 b, 8 bars) · `s7-return` (the door + MM-11 b–e) · `s8-vault` (a stand-in until MM-12).
- **mix_v4** (the editor's):
  - Mix from stems per sequence, with the sidechain duck and the thin windows from the lock's lines, posts and cards.
  - Beds per location with the crossfades above.
  - D6 as the only all-bus mute.
  - The EDL and the margin labels written in the same run as the WAV, and the mp4 muxed from that WAV.
- **Interim, if the re-renders aren't ready** (the existing files, per sequence, as above):
  - The source in order.
  - Joins on bar lines with 1-beat equal-power crossfades, not 3 ms butts, except the designed stops.
  - MM-09's parts and hold loops; the MM-08 LEVERAGE bed loop; MM-07's tape-stop alternates, aligned on 48.75 s; MM-11 c1–c2; the violin stop files.
  - Wherever a baked mute would fall under a v4 line or post, cover it with a hold loop or the room pedal.

### 9.8 Measure v4 the same way (as spotting tools)

Measure on the audio extracted from the v4 mp4:
- holes (≥ 0.3 s under −42 dBFS)
- jumps (> 15 dB in 50 ms)
- every music start and stop, and each run's length
- dialogue over music per line
- bed level per location
- digital silences (expect exactly one)

Then go and watch every flagged spot and decide. A number that looks off isn't automatically wrong (flow-and-continuity §5).

### 9.9 Where this departs from a script or table-read call

| Call | Where | This plan | Fallback if the writer or showrunner keeps the call |
|---|---|---|---|
| "no music under 'super.'" (sc 26) | 26.09 | Kept: it's the drop-out's aftermath, in audible suite air | — |
| F1.2 silent (C39) | 26.10 | No score kept; a TPOOL room bed added, so it isn't digital silence | — |
| "no music" under the D8 line and "Everyone is welcome." (R16) | 29.16–29.17 | A pedal only, no melody, under the V.O. and the door | Music-free, over an audible dark-room bed (about −38) with the door's steps. The avalanche still erupts on the first tile. |
| "the calm-off plays in silence" (v3's reading) | 30.07–30.15 | MM-11 as composed: LEVERAGE to "Terms?", then the hold in the room | — (this is the cue sheet's own spotting) |
| "MUSIC: none (the record)" under the memo | 31.03 | No score motif; the vault's diegetic F hum as the pedal, thinned | The hum ends before the memo; the memo sits on the bullpen bed alone |
| OST-BIBLE §0 rule 10 and §1.6 (dry under real lines; 1 bar clear around cards) | the act | Replaced by thinning (flow-and-continuity §3 and §7) | — |

## 10. What this plan is for, in story terms

The sound carries some of the clarity the showrunner's newest notes ask for, without explaining anything:
- **The told-twice device is audible.** HIS SIDE is the felt, the chip and the swing; THE BOARD'S SIDE is the orchestra, straight. With each side a continuous performance, a newcomer can hear which account they're in. In v3, the board's pass was heard as 55% music in fragments, so the difference barely registered.
- **Places sound different:** the Strip, the frosted glass, the dark room's hum, the lighthouse's wind, the lobby's neon. That's orientation without another rail.
- **Suspense.** LEVERAGE runs unbroken into the click, and the Build into Gerg's glance, so the stops land as blows.
- **Nothing is told twice.** There are no stingers and no comic scoring on the record. Insiders get the dramatic irony from the procedure going on under "super.", the machine's root under the memo, and the brass stab one size too big for a sign.

## 11. Open items

- The v4 lock's sequence lengths decide the bar counts. Every re-render waits on them.
- The TEMP beds (the Strip, TPOOL, the lighthouse) are *(build)* items for the SFX board. Synth stand-ins, marked TEMP-SYNTH, will do for the animatic.
- MM-12 (B2) doesn't exist yet. Sequence 8's pedal is `server_hum` until it does.

## 12. What a human must check by ear (in order)

1. **The drop-out and its aftermath:** the click → about 3 s of digital silence → the buzz → "super." → F1.2 → the felt. Does it land as the act's blow, or as a hole? If it's a hole, the felt can pre-lap from after "super." (never under it).
2. **The bed levels** on laptop speakers and on headphones: do −38 to −42 dBFS beds read as rooms, or as hiss or noise?
3. **THE PLAN's read under the waltz:** at a −10 to −12 dB duck, is every word of the setup clear, and is the waltz still the joke?
4. **The four stops.** Do they land as punctuation, and are they few enough?
5. **The thinning under the record** (the candor card, the letter card, the posts). Does a held pedal keep them sober, with no comic scoring? Would silence play better anywhere?
6. **Every crossfade seam** in any interim edit.
7. **The dialogue spacing changes** in §9.5, in context, at speed.

---

## Appendix A · Every hole in the mix as heard (71)

"Music" is the loudest music-bus window in the hole: "off" means muted. "Bed" is the median bed level.

| # | Ep TC | Length | Shots | Mix median | Music | Bed median | Cause |
|---|---|---|---|---|---|---|---|
| 1 | 12:50:18 | 0.85 s | 25.04–25.05 | −47.9 | off | −48 | mute baked into the render (MM-07 · BREAK: the tape-stop onto the JOIN click) |
| 2 | 12:51:16 | 0.55 s | 25.05–25.05 | −47.9 | off | −48 | no music spotted (EDL gap between cues) |
| 3 | 12:59:20 | 3.00 s | 26.06b–26.07 | −∞ | off | none | D6, the designed drop-out (every bus muted) |
| 4 | 13:03:09 | 1.50 s | 26.08–26.09 | −47.7 | off | −48 | dry-window mute: 'super.' + F1.2 (F1.2 silent, C39) |
| 5 | 13:05:10 | 0.90 s | 26.09–26.10 | −49.4 | off | −49 | dry-window mute: 'super.' + F1.2 (F1.2 silent, C39) |
| 6 | 13:06:21 | 2.95 s | 26.10–26.10 | −47.7 | off | −48 | dry-window mute: 'super.' + F1.2 (F1.2 silent, C39) |
| 7 | 13:20:12 | 0.35 s | 27.02–27.02 | −49.5 | off | −50 | dry-window mute: the candor card, 1 bar each side |
| 8 | 13:21:03 | 0.75 s | 27.02–27.03 | −50.1 | off | −50 | dry-window mute: the candor card, 1 bar each side |
| 9 | 13:21:22 | 0.40 s | 27.03–27.03 | −49.4 | off | −49 | dry-window mute: the candor card, 1 bar each side |
| 10 | 13:23:03 | 3.65 s | 27.04–27.05 | −49.7 | off | −50 | dry-window mute: Rima: dry under the line; the candor card, 1 bar each side |
| 11 | 13:29:18 | 1.75 s | 27.05c–27.06 | −49.8 | off | −50 | dry-window mute: Rima: dry under the line |
| 12 | 13:31:21 | 0.75 s | 27.06–27.06 | −49.3 | off | −50 | dry-window mute: Gerg's post (dry around the post) |
| 13 | 13:33:15 | 0.30 s | 27.06–27.06 | −52.6 | −50 | −53 | dry-window mute: Gerg's post (dry around the post) |
| 14 | 13:37:07 | 0.70 s | 27.08–27.08 | −49.5 | −52 | −52 | dry-window mute: real line a4-27-06 (dry) |
| 15 | 13:40:02 | 4.85 s | 27.10–27.11 | −49.6 | off | −50 | dry-window mute: his 9:32 post (dry) |
| 16 | 13:45:00 | 0.55 s | 27.11–27.11 | −49.0 | −49 | −49 | music tail only (-49 dBFS): MM-09 a · NOON: Neleh's clockwork pizzicato |
| 17 | 13:47:03 | 3.10 s | 27.12–27.12 | −49.4 | off | −50 | dry-window mute: his eulogy post (dry around the post) |
| 18 | 14:12:09 | 3.85 s | 27.23–27.25 | −45.3 | −45 | −45 | dry-window mute: NOV 19 · the lobby camera + his post (dry) |
| 19 | 14:31:18 | 0.70 s | 29.01–29.01 | −44.8 | −46 | −46 | music tail only (-46 dBFS): MM-09x · OUTS: REVERSAL → the felt F4 into sc 29 |
| 20 | 14:32:13 | 0.50 s | 29.02–29.02 | −46.7 | off | −47 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 21 | 14:33:04 | 0.50 s | 29.02–29.02 | −45.2 | off | −45 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 22 | 14:33:19 | 0.50 s | 29.02–29.02 | −44.3 | off | −44 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 23 | 14:34:10 | 0.50 s | 29.02–29.02 | −44.0 | off | −44 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 24 | 14:35:01 | 0.50 s | 29.02–29.02 | −44.0 | off | −44 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 25 | 14:35:16 | 0.50 s | 29.02–29.02 | −43.7 | off | −44 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 26 | 14:36:10 | 0.35 s | 29.02–29.02 | −43.1 | off | −43 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 27 | 14:36:22 | 0.50 s | 29.02–29.02 | −43.3 | off | −43 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 28 | 14:37:12 | 0.30 s | 29.03–29.03 | −43.5 | off | −44 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 29 | 14:38:00 | 0.45 s | 29.03–29.03 | −43.2 | off | −43 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 30 | 14:39:00 | 0.95 s | 29.03–29.03 | −44.3 | off | −44 | dry-window mute: the hearts: the ticks are the rhythm (dry) |
| 31 | 14:41:19 | 0.80 s | 29.04–29.05 | −46.0 | −59 | −46 | music tail only (-59 dBFS): MM-10 a · DARK ROOM felt (the lanyard → 'mostly.') |
| 32 | 14:43:06 | 1.75 s | 29.05–29.06 | −44.3 | −89 | −44 | mute baked into the render (MM-10 a · DARK ROOM felt (the lanyard → 'mostly.'), MM-10 a · the counter: a Build cell → the clunk (745)) |
| 33 | 14:47:02 | 0.35 s | 29.07–29.07 | −43.6 | off | −43 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 34 | 14:47:12 | 0.30 s | 29.07–29.07 | −43.5 | off | −44 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 35 | 14:48:00 | 0.45 s | 29.07–29.07 | −43.2 | off | −43 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 36 | 14:48:12 | 4.00 s | 29.07–29.07 | −44.9 | off | −45 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 37 | 14:53:03 | 1.20 s | 29.08–29.08 | −44.8 | off | −45 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 38 | 14:54:15 | 0.35 s | 29.09–29.09 | −44.0 | off | −44 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 39 | 14:55:07 | 0.30 s | 29.09–29.09 | −44.4 | off | −44 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 40 | 14:57:03 | 0.30 s | 29.10–29.10 | −43.5 | off | −44 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 41 | 14:58:00 | 0.45 s | 29.10–29.10 | −43.1 | off | −43 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 42 | 14:58:12 | 0.85 s | 29.10–29.10 | −44.1 | off | −44 | dry-window mute: the letter card · (REPORTED) · the check (dry) |
| 43 | 15:04:16 | 0.80 s | 29.13–29.14 | −44.2 | off | −44 | dry-window mute: the quiet beat · the D8 line · 'Everyone is welcome.' (no music, R16) |
| 44 | 15:08:18 | 0.45 s | 29.16–29.16 | −44.2 | off | −44 | dry-window mute: the quiet beat · the D8 line · 'Everyone is welcome.' (no music, R16) |
| 45 | 15:11:13 | 1.20 s | 29.17–29.17 | −46.0 | off | −46 | dry-window mute: the quiet beat · the D8 line · 'Everyone is welcome.' (no music, R16) |
| 46 | 15:30:06 | 2.65 s | 29.30–30.01 | −45.7 | −45 | −46 | music tail only (-45 dBFS): E01-S30a · STRAIGHT: one violin under the post (stops dead on the first heart) |
| 47 | 15:39:01 | 0.60 s | 30.03–30.03 | −47.1 | off | −47 | dry-window mute: real line a4-30-02 (dry) |
| 48 | 15:42:08 | 0.40 s | 30.03–30.03 | −47.5 | −44 | −48 | dry-window mute: real line a4-30-02 (dry) |
| 49 | 15:48:03 | 0.85 s | 30.07–30.07 | −44.2 | off | −49 | dry-window mute: the calm-off plays in silence under its own chaos |
| 50 | 15:49:08 | 0.55 s | 30.08–30.08 | −48.3 | off | −49 | dry-window mute: the calm-off plays in silence under its own chaos |
| 51 | 15:50:00 | 0.30 s | 30.08–30.08 | −48.3 | off | −49 | dry-window mute: the calm-off plays in silence under its own chaos |
| 52 | 15:51:08 | 0.80 s | 30.09–30.09 | −47.8 | off | −49 | dry-window mute: the calm-off plays in silence under its own chaos |
| 53 | 15:52:07 | 1.35 s | 30.09–30.10 | −48.3 | off | −48 | dry-window mute: the calm-off plays in silence under its own chaos |
| 54 | 15:53:18 | 0.45 s | 30.10–30.11a | −48.1 | off | −48 | dry-window mute: the calm-off plays in silence under its own chaos |
| 55 | 15:55:10 | 0.95 s | 30.11a–30.11b | −48.3 | off | −49 | dry-window mute: the calm-off plays in silence under its own chaos |
| 56 | 15:56:16 | 0.75 s | 30.11b–30.12 | −48.2 | off | −48 | dry-window mute: the calm-off plays in silence under its own chaos |
| 57 | 15:59:04 | 0.70 s | 30.13–30.14 | −47.9 | off | −48 | dry-window mute: the calm-off plays in silence under its own chaos |
| 58 | 16:00:21 | 1.45 s | 30.14–30.15 | −48.5 | off | −48 | dry-window mute: the calm-off plays in silence under its own chaos |
| 59 | 16:02:18 | 0.85 s | 30.15–30.16 | −49.0 | off | −49 | dry-window mute: the calm-off plays in silence under its own chaos |
| 60 | 16:04:19 | 1.20 s | 30.16–30.16 | −48.6 | off | −49 | mute baked into the render (MM-11 d · GERG RETURNS: the Build restarts (VICTORY LAP)) |
| 61 | 16:07:13 | 4.10 s | 30.18–30.18 | −48.4 | off | −48 | mute baked into the render (MM-11 d · GERG RETURNS: the Build restarts (VICTORY LAP)) |
| 62 | 16:16:02 | 0.55 s | 30.21–30.21 | −47.2 | −60 | −47 | mute baked into the render (MM-11 e2 · one chip note; the 1993 flat line; the [CU]) |
| 63 | 16:16:21 | 0.40 s | 30.21–30.21 | −46.0 | −44 | −47 | music tail only (-44 dBFS): MM-11 e2 · one chip note; the 1993 flat line; the [CU] |
| 64 | 16:18:09 | 1.55 s | 30.21–30.23 | −47.3 | −77 | −47 | mute baked into the render (MM-11 e2 · one chip note; the 1993 flat line; the [CU]) |
| 65 | 16:29:10 | 0.70 s | 31.02–31.03 | −48.4 | off | −49 | dry-window mute: real line a4-31-03 (dry); the memo (the record) and after: none |
| 66 | 16:31:22 | 0.50 s | 31.03–31.03 | −47.5 | off | −48 | dry-window mute: real line a4-31-03 (dry); the memo (the record) and after: none |
| 67 | 16:35:01 | 0.50 s | 31.04–31.04 | −46.4 | off | −48 | dry-window mute: the memo (the record) and after: none |
| 68 | 16:35:16 | 0.50 s | 31.04–31.04 | −47.2 | off | −48 | dry-window mute: the memo (the record) and after: none |
| 69 | 16:36:07 | 0.50 s | 31.04–31.04 | −47.3 | off | −48 | dry-window mute: the memo (the record) and after: none |
| 70 | 16:36:22 | 0.35 s | 31.04–31.04 | −47.5 | off | −48 | dry-window mute: the memo (the record) and after: none |
| 71 | 16:38:03 | 1.60 s | 31.05–31.05 | −48.0 | off | −48 | dry-window mute: the memo (the record) and after: none |

## Appendix B · Every abrupt jump in the mix as heard (106)

"Event at the edge" lists what the EDL has on that frame.

| # | Ep TC | Shot | Step | From → to (dBFS) | Class | Event at the edge |
|---|---|---|---|---|---|---|
| 1 | 12:36:00 | 25.01 | +28.1 dB | −40 → −12 | music in (after a baked mute) | the title stamp |
| 2 | 12:51:14 | 25.05 | +19.4 dB | −46 → −27 | SFX edge on the floor | out: MM-07 · BREAK: the tape-stop onto the J |
| 3 | 12:52:06 | 26.01 | +33.0 dB | −48 → −15 | music in | in: MM-08 · LEVERAGE low (the call connects); the call connects |
| 4 | 12:59:20 | 26.06b | −25.3 dB | −36 → −62 | D6 (designed) | D6 edge |
| 5 | 12:59:21 | 26.06b | −23.9 dB | −62 → −86 | D6 (designed) |  |
| 6 | 12:59:22 | 26.06b | −24.7 dB | −86 → −110 | D6 (designed) |  |
| 7 | 13:00:00 | 26.06b | −89.6 dB | −110 → −∞ | D6 (designed) |  |
| 8 | 13:02:20 | 26.07 | +∞ dB | −∞ → −31 | D6 (designed) | D6 edge; bed edge: the suite: the room comes back wit |
| 9 | 13:04:21 | 26.09 | +20.2 dB | −47 → −26 | line edge on the floor | line a4-26-01 |
| 10 | 13:05:10 | 26.09 | −15.3 dB | −28 → −43 | line edge on the floor |  |
| 11 | 13:06:02 | 26.09 | −15.2 dB | −61 → −76 | F1.2 bed gap | bed edge: the suite: the room comes back wit |
| 12 | 13:06:03 | 26.10 | −∞ dB | −76 → −∞ | F1.2 bed gap | bed edge: the suite: the room comes back wit |
| 13 | 13:06:08 | 26.10 | +∞ dB | −∞ → −36 | F1.2 bed gap |  |
| 14 | 13:08:00 | 26.10 | +21.4 dB | −83 → −62 | F1.2 bed gap | bed edge: the dark room: sub drone (pre-laps |
| 15 | 13:11:13 | 26A.01 | −16.7 dB | −15 → −32 | line edge on the floor |  |
| 16 | 13:21:21 | 27.03 | +22.7 dB | −51 → −28 | SFX edge on the floor |  |
| 17 | 13:21:22 | 27.03 | −21.3 dB | −28 → −50 | SFX edge on the floor |  |
| 18 | 13:23:00 | 27.04 | +20.7 dB | −50 → −29 | SFX edge on the floor | the card lands (soft) |
| 19 | 13:26:19 | 27.05 | +21.7 dB | −50 → −28 | music in | dry edge: Rima: dry under the line |
| 20 | 13:26:20 | 27.05 | −20.1 dB | −28 → −49 | music out | dry edge: Rima: dry under the line |
| 21 | 13:27:02 | 27.05 | +25.9 dB | −50 → −24 | line edge on the floor | line a4-27-04 |
| 22 | 13:28:13 | 27.05b | −15.0 dB | −19 → −34 | line edge on the floor |  |
| 23 | 13:28:21 | 27.05b | +30.0 dB | −50 → −20 | line edge on the floor | line a4-27-24 |
| 24 | 13:29:04 | 27.05c | −24.6 dB | −26 → −50 | music out | dry edge: the candor card, 1 bar each side |
| 25 | 13:29:06 | 27.05c | +23.3 dB | −50 → −27 | music in | dry edge: the candor card, 1 bar each side |
| 26 | 13:29:18 | 27.05c | −18.6 dB | −28 → −47 | line edge on the floor |  |
| 27 | 13:31:12 | 27.06 | +23.7 dB | −50 → −27 | music in | dry edge: Rima: dry under the line; toast: GERG has left |
| 28 | 13:31:13 | 27.06 | −15.1 dB | −27 → −42 | SFX edge on the floor |  |
| 29 | 13:33:21 | 27.06 | +16.0 dB | −64 → −48 | music in | dry edge: Gerg's post (dry around the post); bed edge: the board's rooms: air |
| 30 | 13:34:19 | 27.07 | −16.0 dB | −15 → −31 | line edge on the floor |  |
| 31 | 13:35:15 | 27.08 | +23.7 dB | −43 → −19 | line edge on the floor | line a4-27-06 |
| 32 | 13:36:10 | 27.08 | −16.2 dB | −16 → −32 | line edge on the floor |  |
| 33 | 13:36:12 | 27.08 | −15.7 dB | −32 → −48 | line edge on the floor |  |
| 34 | 13:36:13 | 27.08 | +28.8 dB | −48 → −19 | line edge on the floor |  |
| 35 | 13:44:22 | 27.11 | +15.9 dB | −50 → −34 | SFX edge on the floor |  |
| 36 | 14:09:06 | 27.22b | +15.4 dB | −32 → −16 | line edge on the floor |  |
| 37 | 14:10:03 | 27.23 | +16.5 dB | −30 → −14 | SFX edge on the floor | the rent meters whir |
| 38 | 14:10:15 | 27.23 | +17.4 dB | −32 → −14 | line edge on the floor |  |
| 39 | 14:12:10 | 27.23 | −19.8 dB | −45 → −65 | music out | out: MM-09 d · THE LIGHTHOUSE (Mario's quart; dry edge: NOV 19 · the lobby camera + his po |
| 40 | 14:23:07 | 27.29 | +26.0 dB | −46 → −20 | line edge on the floor | line a4-27-20 |
| 41 | 14:24:03 | 27.29 | +16.9 dB | −39 → −22 | line edge on the floor |  |
| 42 | 14:25:06 | 27.29 | −25.3 dB | −24 → −49 | line edge on the floor |  |
| 43 | 14:32:10 | 29.01 | +15.7 dB | −46 → −30 | music in | dry edge: the hearts: the ticks are the rhyt |
| 44 | 14:33:01 | 29.02 | +15.9 dB | −46 → −30 | SFX edge on the floor | out: MM-09x · OUTS: REVERSAL → the felt F4 i |
| 45 | 14:33:16 | 29.02 | +15.2 dB | −45 → −30 | SFX edge on the floor |  |
| 46 | 14:41:16 | 29.04 | +15.3 dB | −47 → −32 | line edge on the floor |  |
| 47 | 14:42:14 | 29.05 | +16.2 dB | −48 → −32 | line edge on the floor | line a4-29-03 |
| 48 | 14:43:00 | 29.05 | −17.3 dB | −16 → −33 | line edge on the floor |  |
| 49 | 14:45:00 | 29.06 | +22.5 dB | −45 → −22 | music in (after a baked mute) |  |
| 50 | 14:57:12 | 29.10 | +18.5 dB | −41 → −23 | SFX edge on the floor | VOID IF CEO MISSING |
| 51 | 14:59:15 | 29.11a | +26.1 dB | −43 → −17 | SFX edge on the floor | line a4-29-04 |
| 52 | 15:00:00 | 29.11a | −16.2 dB | −18 → −34 | line edge on the floor |  |
| 53 | 15:00:03 | 29.11a | +19.1 dB | −44 → −25 | SFX edge on the floor |  |
| 54 | 15:02:02 | 29.12 | +23.3 dB | −45 → −22 | line edge on the floor | line a4-29-06 |
| 55 | 15:08:12 | 29.16 | −23.6 dB | −19 → −43 | line edge on the floor |  |
| 56 | 15:11:03 | 29.17 | −15.5 dB | −16 → −32 | line edge on the floor |  |
| 57 | 15:12:18 | 29.18 | +22.9 dB | −46 → −23 | music in | in: MM-10 b1 · SWING: the compile (the first; dry edge: the quiet beat · the D8 line · 'Ev |
| 58 | 15:14:10 | 29.19 | +15.2 dB | −42 → −27 | SFX edge on the floor |  |
| 59 | 15:15:00 | 29.19 | −15.5 dB | −27 → −42 | SFX edge on the floor |  |
| 60 | 15:17:02 | 29.21 | +16.2 dB | −38 → −22 | music in (after a baked mute) |  |
| 61 | 15:17:18 | 29.22 | +20.4 dB | −38 → −18 | music in | out: MM-10 b1 · SWING: the compile (the firs; in: MM-10 b2 · Step Four; ALYI RESISTS |
| 62 | 15:30:06 | 29.30 | −22.9 dB | −21 → −44 | music out | out: MM-10 b4 · THE FULL BAND → dead stop on |
| 63 | 15:33:01 | 30.01 | +22.2 dB | −38 → −16 | line edge on the floor | line a4-30-01 |
| 64 | 15:34:08 | 30.01 | +16.3 dB | −33 → −16 | line edge on the floor |  |
| 65 | 15:34:10 | 30.01 | −15.1 dB | −15 → −30 | line edge on the floor |  |
| 66 | 15:35:20 | 30.01 | −16.2 dB | −19 → −35 | line edge on the floor |  |
| 67 | 15:39:15 | 30.03 | +22.2 dB | −46 → −24 | music in | dry edge: real line a4-30-02 (dry); line a4-30-02 |
| 68 | 15:40:16 | 30.03 | −20.6 dB | −27 → −48 | line edge on the floor |  |
| 69 | 15:40:19 | 30.03 | +18.9 dB | −48 → −29 | SFX edge on the floor |  |
| 70 | 15:41:12 | 30.03 | −20.0 dB | −22 → −42 | line edge on the floor |  |
| 71 | 15:41:15 | 30.03 | +22.2 dB | −49 → −27 | SFX edge on the floor |  |
| 72 | 15:47:04 | 30.06b | +26.8 dB | −62 → −35 | music in | out: MM-11 b · THE FLOOR (Tasya's Rhodes, af; dry edge: the calm-off plays in silence unde |
| 73 | 15:49:00 | 30.07 | +32.3 dB | −44 → −12 | SFX edge on the floor | the door BANGS; the whip's air pass |
| 74 | 15:49:21 | 30.08 | +24.7 dB | −51 → −26 | SFX edge on the floor |  |
| 75 | 15:50:07 | 30.08 | +27.8 dB | −50 → −22 | SFX edge on the floor |  |
| 76 | 15:52:03 | 30.09 | +19.1 dB | −50 → −31 | SFX edge on the floor |  |
| 77 | 15:54:04 | 30.11a | +27.2 dB | −50 → −23 | line edge on the floor | line a4-30-05 |
| 78 | 15:55:02 | 30.11a | +17.6 dB | −35 → −17 | line edge on the floor |  |
| 79 | 15:56:09 | 30.11b | +30.6 dB | −48 → −17 | line edge on the floor | line a4-30-06 |
| 80 | 15:56:15 | 30.11b | −17.0 dB | −18 → −35 | line edge on the floor |  |
| 81 | 15:58:08 | 30.13 | +23.6 dB | −45 → −22 | line edge on the floor | line a4-30-08 |
| 82 | 15:59:04 | 30.13 | −18.2 dB | −27 → −45 | line edge on the floor |  |
| 83 | 15:59:21 | 30.14 | +20.0 dB | −51 → −31 | line edge on the floor | line a4-30-09 |
| 84 | 16:02:08 | 30.15 | +29.2 dB | −50 → −20 | SFX edge on the floor |  |
| 85 | 16:03:14 | 30.16 | +19.9 dB | −50 → −30 | music in | in: MM-11 d · GERG RETURNS: the Build restar; dry edge: the calm-off plays in silence unde |
| 86 | 16:06:00 | 30.16 | +22.4 dB | −50 → −28 | music in (after a baked mute) |  |
| 87 | 16:07:07 | 30.18 | −18.8 dB | −25 → −44 | music out (baked mute) |  |
| 88 | 16:11:15 | 30.18 | +28.4 dB | −50 → −22 | music in (after a baked mute) |  |
| 89 | 16:16:15 | 30.21 | +20.9 dB | −47 → −26 | music in (after a baked mute) |  |
| 90 | 16:17:07 | 30.21 | +23.0 dB | −48 → −25 | music in (after a baked mute) |  |
| 91 | 16:17:21 | 30.21 | +22.1 dB | −47 → −25 | music in (after a baked mute) |  |
| 92 | 16:18:04 | 30.21 | +27.3 dB | −47 → −19 | SFX edge on the floor |  |
| 93 | 16:19:22 | 30.23 | +15.6 dB | −48 → −32 | SFX edge on the floor |  |
| 94 | 16:20:08 | 30.23 | +18.3 dB | −48 → −30 | line edge on the floor | line a4-30-12 |
| 95 | 16:20:21 | 30.23 | −26.8 dB | −20 → −46 | line edge on the floor |  |
| 96 | 16:21:00 | 30.23 | +21.1 dB | −47 → −26 | music in | in: MM-11 e3 · after 'okay.': the felt caden |
| 97 | 16:26:13 | 31.02 | +16.9 dB | −35 → −18 | line edge on the floor | line a4-31-01 |
| 98 | 16:27:14 | 31.02 | +19.1 dB | −34 → −15 | line edge on the floor | line a4-31-02 |
| 99 | 16:30:03 | 31.03 | +28.6 dB | −46 → −18 | line edge on the floor |  |
| 100 | 16:31:04 | 31.03 | +16.1 dB | −32 → −16 | line edge on the floor |  |
| 101 | 16:31:07 | 31.03 | −17.7 dB | −17 → −35 | line edge on the floor |  |
| 102 | 16:32:10 | 31.03 | +24.3 dB | −45 → −21 | line edge on the floor |  |
| 103 | 16:33:12 | 31.03 | −21.2 dB | −27 → −48 | line edge on the floor |  |
| 104 | 16:33:13 | 31.03 | +32.0 dB | −48 → −16 | line edge on the floor |  |
| 105 | 16:37:16 | 31.05 | +19.2 dB | −47 → −28 | SFX edge on the floor |  |
| 106 | 16:37:20 | 31.05 | +16.5 dB | −45 → −29 | SFX edge on the floor |  |

## Appendix C · How to reproduce

- **Rebuild the buses.** Copy `mix_v3.py` to scratch and redirect `OUT` and the `sound-v3.ts` path. Save the four buses (dialogue, music, SFX, beds) after normalisation, plus the dry and duck gains, as arrays.
  - Full script: the result is identical to `act4-mix-v3.wav` (maximum difference 0.0).
  - With the "SUPERVISING DIRECTOR's review" block removed: the result matches the mp4's audio to within AAC noise, and reproduces `cues.json`'s measurements exactly.
- **Measure** as in the header, with numpy and soundfile (`audio/.venv-mix`).
- **Attribute** each hole and jump from the EDL (`music`, `dry`, `beds`, `sfx`), the lock's lines, and each cue's `silence_windows`.
- **The what-if floor** is a one-pole-filtered noise at a fixed RMS, added outside D6.
- The scripts (`recon_pre.py`, `recon_full.py`, `analyse.py`) and their JSON results are in this session's scratch (`act4v4/sound/`), which isn't permanent. The rebuilt arrays and WAVs were deleted, to save disk.
