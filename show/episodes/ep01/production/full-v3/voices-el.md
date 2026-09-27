# Ep1 v3: the ElevenLabs voice pass (`v3-voices-el`, track A4, 2026-09-27)

> **Status: PHASE 2 DONE, for the lead's A/B.** Every line of the final v3 lock (commit 62a7f8f) is rendered in ElevenLabs set A. There is an ElevenLabs-timed copy of the lock and a full stick reel of it: `out/ep01/reel/ep01-v3-el-stick.mp4`. Phase 1 (the casting and the sample) is §1–§8, below the phase-2 part.
>
> **Nobody has listened to any of this.** Every statement below is a measurement: duration, pace, pitch, silence at the head and tail, loudness, and what a speech recogniser heard. Whether a voice is natural, funny, or right for the character is still a call for an ear.
>
> **Showrunner, 2026-09-27:** "we can also try a pass using elevenlabs samples", and "i want you to just do a full episode attempt with your best judgement"

**Phase 2, in short:**
- **All 228 lines** of the six v3 timelines are rendered with each role's **A voice**. Of those, 83 takes are the sample's and auditions' takes reused, with nothing sent. No new B takes were rendered, and the phase-1 B takes are kept.
- **Characters:** 7,878 sent and **4,322 billed**, against the 20,000 budget. The subscription went from 5,522 to 9,844 of 131,000.
- **The EL-timed lock runs 21:06.4 against the Kokoro lock's 20:43.6 (+22.8 s).** Most of that is Mas A's inner voice (+14.2 s over 24 lines), Tasya A (+11.2 s) and Rima A (+8.6 s). §P3.
- **The reel** (21:51.6 with the title slate) uses the lock pass's own beds, rebuilt to the new beat times. §P6.
- **Pronunciation:** Macrosoft, badge, Manalt and Gerg (in Mas's voice), plus "Noted." and GTP-4, are fixed. Each was checked with a forced-choice recogniser test that is calibrated on control reads. §P4.
- **For an ear:** §P7.

**Phase 1, in short:**
- **The cast:** all 29 speaking roles in Ep1 have library voices, and the 3 derived voices (the clone and the two deepfakes) come from their base voices by processing. Each of the six principals has two candidates: set A and set B.
- **The sample:** the 69 lines of the lead's v3 sample, each rendered in both sets. They come with fastrec-format lines JSON and retimed copies of the sample timeline.
- **Auditions:** five candidates each for the principals, and one line for each of the 23 other roles.
- **Characters:** 10,054 sent and **5,522 billed**, against the 25,000 budget. The subscription went from 0 to 5,522 of 131,000.
- **Model:** `eleven_multilingual_v2` for everyone. I tested `eleven_v3` and didn't use it (§6).
- **Decisions for you:** listed in §8.

---

## Phase 2: the whole episode in set A (2026-09-27)

The lead's brief: render every v3 line with each role's A voice, make an ElevenLabs-timed copy of the lock, and render its stick reel. The showrunner hasn't picked A or B, and the lead's default is A.

**The hard rules held:**
- Only the library voices in `cast-el.json` were used, each role's candidate A. Nothing was cloned, designed or uploaded, and `voice_slots_used` stayed 0.
- The key was read inside `ellib.py` only. Every output and scratch file was scanned for it before hand-off, with no matches.
- The heavy steps (the render with its ASR, the beds, the reel) ran through `ops/heavy.sh`.
- Nothing was committed, and no file of another track was edited. The Kokoro lock in `show/reel/ep01-v3/` and the lock pass's `bed.py` are read, never written. `bed.py` is imported by `tools/el_bed.py`.

### P1. The files

| What | Where |
|---|---|
| **The takes** (all 228 lines, set A) | `audio/ep01/v3-el/ep01/<seg>/lines-A.json` (the fastrec format, as in phase 1) with `wav/`. The 44 call and monitor takes also have `wav-device/` copies (the house call filter printed in). The EL-timed lock plays them on the 38 lines the Kokoro lock printed through that chain. Each segment's `manifest.json` has every request, and `log/render.log` has every retake and why |
| **The EL-timed lock** | `show/reel/ep01-v3-el/ep01-v3-el-{coldopen,act1,act2,act3,act4,tag}.json` |
| **Its manifest** (key `ep01-v3-el-stick`; the studio shows it as `reel-ep01-v3-el`) | `show/reel/ep01-v3-el/ep01-v3-el.manifest.json` |
| **The reel** | `out/ep01/reel/ep01-v3-el-stick.mp4` (+ `-chapters.json`, `-measure.json`); work files in `studio/out/reel-work/ep01-v3-el-stick/` |
| The beds | `audio/reel/ep01-v3-el/<seg>-bed.wav` + `-bed-qa.json`, and `beds.json` (git-ignored WAVs) |
| Measurements | `audio/ep01/v3-el/ep01/qa/`: `qa-rollup.json` (every take), `names-<seg>.json` (the name check), `probes/` (the pronunciation probes). Also `audio/ep01/v3-el/ep01/el-lock-report.json` (every beat's change) |
| The spend | `audio/ep01/v3-el/usage.json`, under `phases` |
| Tools (new or changed) | `tools/el_render.py` (changed), and new: `tools/el_lock.py`, `tools/el_bed.py`, `tools/pron_check.py`, `tools/usage_phase.py` |

**How the takes were made:**
- `eleven_multilingual_v2`, with each role's phase-1 settings (Mas's V.O. at stability 0.60, speed 0.82).
- Dry, 48 kHz / 24-bit mono, with 0.35 s room-tone handles.
- Word timings come from the with-timestamps endpoint. They agree with faster-whisper's word starts to a median of 0.09 s per take (worst 0.47 s).

**Levels:**
- **Dialogue is at −16 LUFS integrated,** as briefed (−16.0 to −16.6).
- **The 24 V.O. takes are at −18,** not −16. That is the Kokoro lock's own V.O. level: its 22 v3 V.O. takes sit at −18.0, and its dialogue at −16.0. At −16 the EL inner voice would play 2 dB hotter than the Kokoro one in the A/B. My phase-1 note warned that the louder voice tends to win.
- **To make the V.O. −16 too:** re-run step 1 of §P8 without `--vo-lufs -18`. It's a free re-dress, with no API calls.

### P2. Characters spent

| Run | Calls | Characters sent | Billed |
|---|---|---|---|
| Cold open (3 lines) | 3 | 128 | 70 |
| Act One (60) | 29 | 1,155 | 631 |
| Act Two (39) | 39 | 1,367 | 750 |
| Act Three (22) | 23 | 852 | 468 |
| Act Four (101) | 87 | 3,732 | 2,052 |
| Tag (3) | 3 | 36 | 19 |
| Pronunciation probes (7 lines, including 2 control reads) | 22 | 608 | 332 |
| **Phase 2** | **206** | **7,878** | **4,322** |

- **The segment runs include every retake:** 17 for a clipped tail or a bad ASR read (8 kept), 21 for pitch outliers (16 kept), 2 asked for, the re-renders after the pronunciation fixes, and the two cut-off lines, which were read whole (184 characters).
- **83 takes were reused** from the sample and the auditions, where the voice, settings and text as sent were identical. Nothing was sent for those.
- **The subscription** went from 5,522 to 9,844 of 131,000, exactly the billed total. That leaves 121,156 this cycle.
- **All phases so far:** 17,932 characters sent and 9,844 billed.

### P3. Lengths against the Kokoro lock

Story time (the lock's frames; the intro, card and outro are unchanged):

| Segment | Kokoro lock | **EL-timed** | Change | Beats changed |
|---|---|---|---|---|
| Cold open | 0:30.7 | **0:30.0** | −0.6 s | 3 |
| Act One | 5:22.5 | **5:37.5** | **+15.0 s** | 23 |
| Act Two | 3:24.7 | **3:17.2** | −7.6 s | 22 |
| Act Three | 2:08.0 | **2:05.3** | −2.7 s | 10 |
| Act Four | 8:43.8 | **9:02.7** | **+18.9 s** | 46 |
| Tag | 0:33.9 | **0:33.7** | −0.2 s | 3 |
| **Story** | **20:43.6** | **21:06.4** | **+22.8 s** | 107 of 228 |

**How the timing was carried over** (`tools/el_lock.py`):
- **Gaps:** every gap the lock chose is kept, between lines, before a beat's first line and after its last.
- **J-cuts and L-cuts:** every J-cut lead is kept (5.03 −0.5 s, 7.01 −0.6 s), and every L-cut keeps its overrun into the next shot.
- **Beat lengths** change only by what their takes gained or lost. Beats without lines are unchanged, frame for frame.
- **Timed items** move through one clock per beat. That covers the onscreen text, name reveals, sounds, a figure's entrance or exit, and a mouth's speak window. They stay put before the first line and are anchored to the matching word inside a line, so a name revealed on a word lands on that word in the new take. They move with the gaps between lines, and by the beat's own change after its last line. In a J-cut beat the cut itself (0.0) stays put.
- **The two lines cut off by the world** (a5-27-31, Mario's "…hypothetically—"; a5-29-24, Neleh's "…the char—"): the lock's `cut` doesn't mean dropped. These play in the Kokoro lock, recorded whole (the house method). They are read whole here too (`say_full` in `cast-el.json`). Their `dur` is the cut word's end in the EL take, plus the lock's own trail after that word.
- **Call and monitor lines:** the 38 lines the Kokoro lock printed through the call chain play their EL device copy. Every other take plays dry, as in the lock.

**Where the time goes,** summed over each role's takes:

| Role (set A) | Lines | Change |
|---|---|---|
| Mas, V.O. | 24 | **+14.2 s** |
| Tasya | 15 | **+11.2 s** |
| Rima | 12 | +8.6 s |
| Mas, talk | 51 | +5.5 s |
| Terb | 5 | +3.7 s |
| Sirrah | 3 | +2.0 s |
| Radnus | 6 | −4.0 s |
| Neleh | 24 | −3.5 s |
| Nedib | 4 | −3.4 s |
| A senator | 3 | −2.6 s |
| Alyi | 13 | −2.4 s |

- **The biggest beats:**
  - 5.04 +7.4 s: Rima's three lines +3.9, and the V.O. "she's right. it will break…" 3.2 → 6.6 s;
  - S8.08 +4.4 s: Mas's "I love and respect alyi…" 9.4 → 13.8 s;
  - 9.09 +3.4 s: Tasya's speech +3.6;
  - S4.13 +3.0 s: Tasya's statement 9.1 → 11.6 s;
  - S7.07 +2.7 s: Terb's reading.
- **The shortest:** 8.04 −3.0 s (Radnus and Nirb), 13.09 −2.8 s (Radnus), 21.02 −2.1 s (Nedib and the deepfakes).
- **Against the target:** 21:06.4 is 21.4 s over the band's top (19:45–20:45). The lever is the same one §7 named. Mas A's V.O. runs 130 wpm against Kokoro's 168, with 83.1 s voiced against 68.9 s. Raising its speed from 0.82 toward 0.88, or taking the lock's trims T2–T7, would bring it back. Neither is done here: the brief says don't change holds.

### P4. Pronunciation: the fixes and how they were checked

**The check** (`tools/pron_check.py`):
- **Why not the plain read:** a plain ASR read can't settle a parody name. faster-whisper writes "Microsoft" for "Macrosoft" whatever it hears, and it did so for Kokoro's IPA-driven take too.
- **What it does instead:** for each take it scores the intended transcript and its competitors, as log P(text | audio), through CTranslate2's forced alignment (the per-token probabilities). It reports the margin of the intended text over the best competitor.
- **It is calibrated on control reads:**
  - Kokoro's take read from the house IPA /ˈmækɹəsˌɔft/ scores −4.4 against "Microsoft". That is the recogniser's prior for the common word.
  - A control read of "And go to Microsoft." (Mas's A voice, 20 characters) scores −16.3.
  - Kokoro's "badge" scores +4.7, and a "batch" control −6.1.
- **The fix mechanisms,** all in `cast-el.json`. The lines JSON keeps the script's text; only the text as sent changes:
  - `respell` for everyone;
  - `respell_roles` for one voice;
  - `respell_lines` for one take;
  - `say_lines` for the same words with other punctuation;
  - `say_full` for a cut-off line read whole.

| Word | The fix | Scope | Margin before | **After** | Kokoro lock's take |
|---|---|---|---|---|---|
| **Macrosoft** | "Mack-roh-soft" | everyone (3 lines) | −7.7 (the plain spelling), −5.9 ("Macro-soft") | **+1.05** (Mas), **+0.44** (Gerg), **+1.75** (Tasya); the plain ASR now writes "Macrosoft" | −4.4, −7.7, −8.4 |
| **badge** | "badj" | a5-29-01 only (Mas) | −0.03 (the sample take, heard "batch"); −0.40 (a new seed) | **+3.05**, heard "badge" | +4.7 |
| badge / badges (the other three) | none needed | | | +9.7 (Alyi), +4.8 (Neleh), +10.1 (Nirb, "badges") | +10.1, +8.0, +9.2 |
| **Manalt** | "Man-alt" (naming.md "MAN-alt") | everyone (3 lines) | −1.78, heard "Menalt" | **+1.13** in the probe; +7.0, +4.9, +6.4 in the line check | +6.9, +4.7, +5.7 |
| **Gerg** in Mas's voice | "Guhrg" | Mas (Giovanni) only | Mas A's "Gurg" is heard as "**Kirk**": −13.4 ("Go to sleep, Gurg."), −2.9, −6.2 | **+2.0, +1.9, +3.1, +3.9**, heard "Gurg"; +0.3 and +0.9 on two lines (best competitor "Greg") | +2.1 to +4.5 |
| | "…Guhrg" (a soft lead-in) | v3-vo-23 only | "Guhrg" on three seeds −6.2, −11.2, −5.5; with a comma −1.2 | **+1.87** (plain ASR: "Gorog") | +2.1 |
| | a new seed | v3-vo-21 | −4.5 ("Kirk") | −0.13 against "Greg" (plain ASR: "Gourg"; "Kirk" is out) | +4.2 |
| **Noted.** | "Noded." (the American flap) | Mas only (2 lines) | "Note it." on three seeds: −0.4, −1.7, −1.3 | **+1.89, +3.23**, heard "Noted." | +4.9, +5.0 |
| **GTP-4** | "G-T-P four" | everyone (1 line) | (new) | **+9.5** over "GPT-4" | +9.8 |

**What else was tried and measured:**
- For Gerg in Mas's voice: "Ghurg", "Gurrg" and "Gerg" were all still heard as "Kirk" (−10.8, −8.4, −16.5).
- Other speakers' "Gurg" was fine and kept: Rima +5.1, Neleh +2.9, Tasya +1.1, Terb +2.8. Alyi's is +0.2 (heard "Gorg").

**One delivery fix:**
- Mas's "which one am i?" (e1-a2-15-04) came back as a sharp rise on both takes, 226 and 257 Hz. pYIN agrees, 107 → 289 Hz. His brief asks for level or falling finals.
- It's now sent as "Which one am I." and measures 126 Hz.

### P5. What was measured on the takes

- **Levels:** dialogue −16.0 to −16.6 LUFS, V.O. −18.0. True peak ≤ −1.51 dBTP, no clipped samples, no digital black.
- **Head and tail:** 0.35–0.50 s of room tone before the first sound, and 0.35–0.88 s after the last.
- **ASR recall:** every take reads at 0.8 or better except two.
  - Tasya's "We own camera two." was heard "too" on both takes.
  - Terb's "…Ah." was heard "uh".
- **Clipped tails:** six takes still end while sounding, because both of their takes did.
  - Neleh A: a5-27-11, -16, -37, -40 and -46.
  - Terb: a5-30-14.
  - The house 4 ms edge fade is on each. Neleh A's voice cuts its tails often: 7 of her first takes did (12 takes in all).

**The principals (set A), against the Kokoro takes the lock used:**

| Role | Lines | Median F0, EL (Kokoro) | Spread across lines | wpm, EL (Kokoro) | Voiced, EL (Kokoro) |
|---|---|---|---|---|---|
| Mas, talk | 51 | 121 Hz (115) | 103–173 | 186 (186) | 83.4 s (77.8) |
| **Mas, V.O.** | 24 | 118 (115) | 111–137 | **130 (168)** | **83.1 (68.9)** |
| Neleh | 24 | 200 (163) | 183–249 | 235 (221) | 73.5 (76.7) |
| **Tasya** | 15 | 138 (146) | **98–203** | 153 (176) | 72.2 (61.0) |
| Gerg | 28 | 143 (128) | 122–224 | 213 (210) | 72.0 (72.8) |
| Rima | 12 | 167 (212) | 147–181 | 146 (185) | 39.8 (31.2) |
| Alyi | 13 | 90 (86) | 83–101 | 190 (156) | 37.9 (40.2) |

- **Mas's inner voice** is the guide's "slower than he talks": 130 wpm against his talk's 186, at the top of the 110–130 band. The time goes into the pauses between sentences.
- **Tasya A (Tyler Kurk) is the least consistent voice in the cast.**
  - Six of his 15 takes came back more than 4 st off his typical pitch (94–220 Hz). The pitch retakes pulled three of them in.
  - Still out: "That collar suits you." (112 Hz), "We love you guys." (109 Hz), "Don't get up, Mas…" (203 Hz, two takes alike) and "Hello." (98 Hz; the retake was 238).
  - His lane is 130–150.
- **Some supporting voices run well over their pace bands:** Nedib 258 wpm (145–165), the senator 240 (145–160), Radnus 224 (130–150), Nirb 282 (150–170). They make the shortest beats: 8.04 (Nirb and Radnus, −3.0 s), 13.09 (Radnus, −2.8 s) and 21.02 (Nedib and his deepfakes, −2.1 s).

### P6. The reel

`out/ep01/reel/ep01-v3-el-stick.mp4`: 1280×720, 24 fps, H.264 + AAC. It runs **21:51.6**: the 3 s title slate, then the 21:48.6 episode, against the final Kokoro stick's 21:28.8 (+22.8 s). 107.0 MB. It was rendered with `node src/reel/tools/episode.mjs <manifest> --jobs 2 --conc 4` through `ops/heavy.sh`: 22 segments in 492 s of wall (render 452 s, mix 19 s alongside, mux 32 s).

**The sound:** the lock pass's own recipe, rebuilt to the new beat times (`tools/el_bed.py`). The lock's beds are timed to the Kokoro takes, so they no longer line up.
- **Acts One to Four and the tag** use the lock's `bed.py` `build()`, imported and pointed at the EL timelines. That gives the rooms leading each cut, all 253 of the beats' sounds at their new times (0 missing), the pads per mood run, and the Cancel-to-buzz silence. Their loudness is within 0.25 LU of the lock's beds.
- **The card** keeps the lock's own bed.
- **The cold open's sound** is the v2 stem (hall, SFX and music in one file), and `bed.py` has no room or pad recipe for its stage. So the lock's cold-open bed is spliced per beat instead:
  - each beat's stretch of the stem is laid at its new start, with 60 ms crossfades;
  - the splices fall in the hall under the host's question (1.01, −0.46 s) and Mas's answer (1.02, −0.38 s), and in "Noted." (2.03, +0.21 s);
  - the freeze, the rewind and the Orb are the stem unchanged, 0.63–0.83 s earlier.
- **The mixer's settings are the Kokoro manifest's:** takes at −3 dB, beds ducked 10 dB under speech.

| Chapter | Starts | Length | Kokoro stick | Mix, LUFS (Kokoro) | Peak, dBFS |
|---|---|---|---|---|---|
| title slate | 0:00.0 | 3.0 | 3.0 | (silence) | |
| cold open | 0:03.0 | 30.0 | 30.7 | −18.9 (−18.7) | −4.7 |
| intro | 0:33.0 | 30.0 | 30.0 | −17.1 (−16.9) | −4.3 |
| card | 1:03.0 | 2.0 | 2.0 | −38.0 (−37.9) | −26.8 |
| Act One | 1:05.0 | 5:37.5 | 5:22.5 | −17.0 (−16.9) | −4.3 |
| Act Two | 6:42.5 | 3:17.2 | 3:24.8 | −16.7 (−16.5) | −4.5 |
| Act Three | 9:59.7 | 2:05.3 | 2:08.0 | −17.3 (−17.1) | −4.5 |
| Act Four | 12:05.0 | 9:02.7 | 8:43.8 | −16.5 (−16.4) | −2.5 |
| tag | 21:07.8 | 0:33.7 | 0:33.9 | −25.1 (−24.5) | −4.5 |
| outro | 21:41.5 | 0:10.1 | 0:10.1 | −17.1 (−17.0) | −3.9 |

**What was checked:**
- **Picture:** 31,478 video frames, the plan's count. Video and audio are both 1311.58 s.
- **Sound:** the mixer placed all 228 takes and 7 beds, with 0 missing files and no warnings. Every story chapter plays only ElevenLabs takes: 3, 60, 39, 22, 101 and 3.
- **Loudness:** the whole mix is −16.8 LUFS (the Kokoro stick's −16.7) with a −2.55 dBFS sample peak. The peak is in Act Four, where overlapping lines and L-cuts stack. The only digital silence of 0.5 s or more is the title slate.
- **The Kokoro reel's chapter levels** are from its lock.md §6 (the final lock). The EL chapters sit 0.1–0.6 LU under them.
- **Not heard or watched:** the cuts, the takes, the beds' levels and the splices.

### P7. For an ear first

1. **Mas A's inner voice:**
   - Is 130 wpm, with long pauses between sentences, the right "unhurried"? Or is it slow enough to cost the episode its 21 s? (§P3)
   - Check v3-vo-03 (5.04) and a5-31-04 (S8.08) first.
2. **Gerg's name in Mas's voice:**
   - "Guhrg" measures right on six lines.
   - Listen to v3-vo-23 (the "…Guhrg" lead-in, which the plain ASR writes "Gorog"), v3-vo-21 ("Gourg"), v3-vo-18 and a5-29-04 (their best competitor is "Greg").
3. **Tasya A's pitch** jumps between lines (§P5): "That collar suits you.", "We love you guys.", "Don't get up, Mas…", "Hello.". Tasya B (Eric) held 147–151 Hz in the sample. Its switch costs about 850 characters (§P9).
4. **Neleh A's clipped tails** (§P5): five takes.
5. **"Macrosoft" as "Mack-roh-soft"** and "badge" as "badj" measure right. Whether they sound natural is for an ear: a5-29-08, a5-29-09, v3-a4-0001 and a5-29-01.
6. **Small reads:**
   - "equity **in** NopeAI" was heard as "and" (v3-a2-0001; Kokoro's take too);
   - Mario's "Nell-eh" was heard as "Nelier" (a5-27-31);
   - Tasya's "camera two" was heard as "too".
7. **The supporting voices' pace** in Act Two (Nedib, the senator, Radnus) is well over their bands.
8. **The cold-open splices** (§P6): three joins in the hall.

### P8. How to rebuild

From the repo root. Every step resumes; only changed lines cost characters.

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
REUSE="audio/ep01/v3-el/sample audio/ep01/v3-el/auditions audio/ep01/v3-el/auditions/principals"
# 1. the takes (set A; dialogue -16, V.O. -18 LUFS; reuses identical takes; retakes on a bad read, a clipped tail or pitch)
for s in coldopen act1 act2 act3 act4 tag; do
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --lines show/reel/ep01-v3/ep01-v3-$s.json --out audio/ep01/v3-el/ep01/$s \
      --sets A --target-lufs -16 --vo-lufs -18 --reuse $REUSE --max-chars 6000 --retry-bad 1 --retry-pitch; done
# 2. the name check (no API calls), and a probe when a word needs a fix (the probe's pick is then free in step 1)
for s in coldopen act1 act2 act3 act4 tag; do HF_HUB_OFFLINE=1 $PY audio/ep01/v3-el/tools/pron_check.py lines \
    --lines audio/ep01/v3-el/ep01/$s/lines-A.json --timeline show/reel/ep01-v3/ep01-v3-$s.json --out audio/ep01/v3-el/ep01/qa/names-$s.json; done
# 3. the EL-timed lock, its beds, the manifest, the reel
$PY audio/ep01/v3-el/tools/el_lock.py
bash ops/heavy.sh $PY audio/ep01/v3-el/tools/el_bed.py
$PY audio/ep01/v3-el/tools/el_lock.py --beds audio/reel/ep01-v3-el/beds.json
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v3-el/ep01-v3-el.manifest.json --jobs 2 --conc 4
```

- **If the Kokoro lock is re-run:** repeat step 1 (only new or changed lines are sent) and step 3.
- **A listening note on a line** (one new take; it keeps the better-measured one): add `--retake <id>` to step 1 for that segment.

### P9. Switching a role to its B voice later

`--cand ROLE=B` renders that role with its B candidate and everyone else with A. The A takes come back from the cache for free. `--label` names the lines file, and `--tag` gives the variant its own timeline keys: the studio copies `show/reel/*/` into one flat folder, so the keys must differ. Mas is the example:

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
REUSE="audio/ep01/v3-el/sample audio/ep01/v3-el/auditions audio/ep01/v3-el/auditions/principals"
# 0. the cost first (no API calls): what isn't cached or reusable yet
for s in coldopen act1 act2 act3 act4 tag; do HF_HUB_OFFLINE=1 $PY $T plan --lines show/reel/ep01-v3/ep01-v3-$s.json \
    --sets A --cand mas-manalt=B --reuse $REUSE --by-role; done
# 1. render
for s in coldopen act1 act2 act3 act4 tag; do
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --lines show/reel/ep01-v3/ep01-v3-$s.json --out audio/ep01/v3-el/ep01/$s \
      --sets A --cand mas-manalt=B --label AmasB --target-lufs -16 --vo-lufs -18 --reuse $REUSE --max-chars 3000 \
      --retry-bad 1 --retry-pitch; done
# 2. the name check on lines-AmasB.json (step 2 of §P8)
# 3. its own lock, beds, manifest (key ep01-v3-el-masB-stick) and reel
$PY audio/ep01/v3-el/tools/el_lock.py --set AmasB --tag -masB
bash ops/heavy.sh $PY audio/ep01/v3-el/tools/el_bed.py --tag -masB
$PY audio/ep01/v3-el/tools/el_lock.py --set AmasB --tag -masB --beds audio/reel/ep01-v3-el-masB/beds.json
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v3-el-masB/ep01-v3-el-masB.manifest.json --jobs 2 --conc 4
```

- **Several roles at once:** `--cand mas-manalt=B,tasya=B`.
- **The cost,** from step 0 as things stand. The sample's B takes are already free:

| Role to B | Characters to send | Credits (× 0.55) | With retakes (about +25 %, as this phase) |
|---|---|---|---|
| Mas (Evan) | 1,534 | about 845 | about 1,050 |
| Neleh (Victoria) | 1,090 | about 600 | about 750 |
| Tasya (Eric) | 852 | about 470 | about 590 |
| Gerg (Ryan) | 481 | about 265 | about 330 |
| Alyi (Brent) | 429 | about 235 | about 295 |
| Rima (Harper) | 70 | about 40 | about 50 |
| **All six** | **4,456** | **about 2,450** | **about 3,100** |

- **Re-check the fixes after a switch.** `respell_roles` and `respell_lines` are keyed by role and line, not by voice, so Mas's "Guhrg" and "Noded" would also go to Evan. Run step 2, and drop the entry if the plain spelling reads better in the new voice.

---

## 1. How the hard rules were kept

- **Nothing was cloned or designed:**
  - Every voice is an ElevenLabs premade voice or a shared Voice Library voice, called by `voice_id` straight from text-to-speech.
  - Nothing called instant cloning, professional cloning, voice design (text-to-voice) or speech-to-speech.
  - No audio of anyone was uploaded or used as a reference.
  - `voice_slots_used` was 0 before and after, so nothing was added to the account's voices.
- **No voice was chosen for sounding like anyone.** The screen ([tools/cast_el.py](../../../../../audio/ep01/v3-el/tools/cast_el.py)) removed voices before ranking. It pulled 2,111 American-English library voices and dropped 933 of them. A voice was dropped if its name or description:
  - names or evokes a real person, a celebrity, an impression, a parody or a soundalike (246);
  - mentions a real assistant product or its voice names;
  - mentions any accent other than General American, or an ethnicity (278);
  - has an age, health or banned register: raspy, gravelly, elderly, ASMR, whisper, breathy, seductive, cartoon or child (424, with the descriptive labels another 103);
  - costs more than one credit per character (224).

  The counts are flags, and one voice can carry several.
- **Picks came from the house briefs only:** [CASTING.md](../../../../../audio/voices/CASTING.md), the Act Four briefs in `cast_a4.py`, the character files and [mas-inner-voice §9](../../../../bible/mas-inner-voice.md). They were compared against the briefs' pitch lanes and pace bands, never against any real voice.
- **House rules 3 and 4 carry over:**
  - no accent play;
  - no age or health coding (NEDIB is a middle-aged, rasp-free voice at speed 1.0, never slowed);
  - real `[V]` quotes are voiced by the character's generic voice, as in Kokoro.
- **The key** is read from `.env` inside [tools/ellib.py](../../../../../audio/ep01/v3-el/tools/ellib.py). It is never printed, logged or written, and never on a command line. Before hand-off, every output and scratch file was scanned for the key value, and there were no matches.

## 2. The cast

The full record is [audio/ep01/v3-el/cast-el.json](../../../../../audio/ep01/v3-el/cast-el.json). For every candidate it holds the role, `voice_id`, library name, source, why it fits, settings, model, the library's own labels and description, and what it measured.

**Settings:** similarity 0.75 and speaker boost on for everyone. `spd` is the v2 speed setting.

### 2.1 The principals (A and B)

| Role | Set | Library voice (source) | Stability / style / speed | Sample median F0 (lane) | Why, in a line |
|---|---|---|---|---|---|
| **MAS** | A | Giovanni - Tranquil, Clever and Educated (shared, professional) | 0.55 / 0 / 0.86; **V.O. 0.60 / 0 / 0.82** | 120 Hz talk, 122 V.O. (105–125) | In the audition it was the only read that paused between the V.O.'s sentences, with the narrowest range (3–9 st). In the sample its V.O. runs 131 wpm, near the brief's 110–130. |
| | B | Evan - Calm, Grounded & Reflective (shared, high-quality) | 0.55 / 0 / 0.84; V.O. 0.60 / 0 / 0.78 | 107 / 114 Hz | A warm, lower, grounded voice. It had the cleanest ASR in the audition, but it's quicker: its V.O. runs 186 wpm in the sample. |
| **GERG** | A | Marcus - Bright, Upbeat and Clear (shared, HQ) | 0.40 / 0.15 / 1.00 | 143 Hz (125–160) | The fastest articulation in the audition (6.3 syll/s) and bright; 3 st above Mas A in the sample. |
| | B | Ryan - Clear, Fast and Conversational (shared, prof.) | 0.40 / 0.15 / 1.10 | 123 Hz | Quick and conversational, nearer the Kokoro Gerg's register. |
| **ALYI** | A | Louis - Deep, Profound and Thoughtful (shared, prof.) | 0.60 / 0 / 0.78 | 88 Hz (80–105) | Low, with the longest comma pause of the five (0.93 s). |
| | B | Brent (shared, prof.) | 0.60 / 0 / 0.82 | 101 Hz | The slowest (136 wpm) and lowest in the audition. Its range is wide (16 st). |
| **RIMA** | A | Mia - Clear, Smooth, Professional (shared, prof.) | 0.55 / 0.05 / 0.92 | 170 Hz (160–200) | The slowest articulation (3.7 syll/s) with a controlled range, sitting 3.6 st under Neleh A. |
| | B | Harper - Confident, Clear and Cool (shared, HQ) | 0.55 / 0.05 / 0.88 | 186 Hz | The brighter option, 1.9 st over Neleh B. Hope measured well too, but sat within 0.5 st of both Neleh picks. |
| **NELEH** | A | Alexandra - Confident, Clear and Steady (shared, prof.) | 0.55 / 0 / 0.95 | 209 Hz (165–200) | The evenest read of the five (range 5.5 st on the sample): "precise, even". |
| | B | Victoria - Intake Professional (shared, prof.) | 0.55 / 0 / 1.00 | 175 Hz | "Highly articulate and composed ... patient". |
| **TASYA** | A | Tyler Kurk - Smooth, Pleasant and Clear (shared, HQ) | 0.50 / 0.10 / 0.90 | 159 Hz (130–150), but 116 and 202 on his two lines | The only audition read inside his pace band (133 wpm), with even phrase gaps. |
| | B | Eric - Smooth, Trustworthy (**premade**) | 0.50 / 0.10 / 0.80 | 149 Hz | A warm tenor at 147–151 Hz on both lines. |

### 2.2 Everyone else (one voice each; set A and set B both use it)

Pitch is measured on the role's audition line (`auditions/`); MADA and CHATGTP are measured in the sample.

| Role | Library voice (source) | Speed | F0 measured (lane) | Why |
|---|---|---|---|---|
| MADA | Alex - Smooth, Balanced and Clear (prof.) | 0.90, stability 0.7 | 105 (115–130) | A neutral American voice; high stability for the canned sameness |
| CHATGTP | Maya - The Upbeat Creator (prof.) | 1.08, style 0.25 | 238–281 (200–250) | Bright and crisp, 4 st over Rima B. A creator's voice, no assistant product's |
| MARIO | Caleb - Youthful, Quirky and Clear (prof., labelled "anxious") | 1.00 | 128 (115–150) | One of the six "anxious" voices in the library; clear |
| TTEMME | Sean - Expressive and Conversational (HQ) | 1.00 | 129 (122–160) | Casual, warm, relatable; the headset is a mix chain |
| TERB | Ethan - Calm, Optimistic and Clear (prof.) | 1.05 | 109 (95–115) | A brisk, level, narrow preview (5.8 st) |
| RADNUS | Dylan Malc - Calm & Educational (prof.) | 0.90 | 135 (110–135) | "A warm, soft-spoken voice ... gentle, sincere" |
| ADELINA | Gracy - Clear, Articulate and Steady (prof.) | 1.00 | 223 (175–215) | Warm, friendly, steady |
| TILED EMPLOYEE | Avery - Healthcare & Clinical Education (prof.) | 0.95 | 169 (135–175) | Calm and clear; 2.6 st under Neleh A. It **replaced** Kai, which measured 202 Hz and 348 wpm |
| NEDIB | Johnny - Friendly, Optimistic and Warm (HQ) | 1.00 | 126 (105–130) | Warm and conversational, middle-aged, no rasp. House rule 4 |
| DEEPFAKE NEDIB, #2 | Nedib's voice, stability 0.85, the house **gloss** (#2 +0.7 st) | — | 133, 123 | A process on our generic voice, as in Kokoro |
| SYDNEY | Layla (prof.) | 0.90, style 0.15 | 296 (185–235) | "Naturally soft ... calm, friendly"; the sheen is a mix chain |
| SUCRAM | Mark - Natural Conversations (HQ) | 1.12 | 115 (105–130) | Casual and natural, sped up for the point-by-point pace |
| SIRRAH | Marie - Professional & Warm (prof.) | 0.95 | 230 (170–205) | Articulate, crisp, patient |
| NOLE | Ryan - Confident and Bold (prof.) | 1.05, stability 0.35, style 0.2 | 95 (110–140) | The widest preview range (15.9 st), for the bursts |
| LAHTNEMULB | Will – Grounded Narrator (HQ) | 0.92 | 98 (100–125) | Formal, steady, clear |
| LAHTNEMULB (THE CLONE) | his voice, stability 0.85, gloss, **+2 st** (as Kokoro's audit-v2 #26) | — | 127 | The two men sit 4.5 st apart |
| A SENATOR | Clara – Corporate & Training Trusted Professional (HQ) | 0.95 | 167 (160–205) | Calm, clear, courteous |
| PHOTOGRAPHER | Christina - Natural and Conversational (HQ) | 1.08 | 185 (any) | "A friendly, real vibe" |
| NIRB | Arlo – Engaging Real-World Storyteller (HQ) | 1.05 | 157 (125–150) | Bright and youthful. It **replaced** Ryan - Explainer, which measured 108 Hz, 1.3 st from Egap |
| EGAP | Declan - Serious & Straightforward (prof.) | 0.90 | 101 (95–120) | Low, serious, level |
| OIGNEB | CJ - Articulate & Educational (HQ) | 0.92 | 113 (110–130) | "A calm and articulate teacherly voice" |
| REMUHCS | Marc Laurent - Confident and Engaging (HQ) | 0.95 | 119 (110–135) | Warm, clear host; the monitor chain comes later |
| PANEL HOST | River - Relaxed, Neutral, Informative (**premade**, gender "neutral") | 1.00 | 165 (145–175) | Never gendered, per the brief |
| NESNEJ | Bryan - Polished, Measured and Engaging (HQ) | 1.05, style 0.2 | 107 (120–150) | Warm, confident, "natural charisma"; the arena is a send |
| CLOD | Alex - Friendly & Professional (prof., "gender-fluid") | 1.00 | 198 (150–180) | Warm and approachable; 2 st over Mario, who dictates to it |

**Sources:**
- "prof." is a shared professional voice clone that the voice's owner made of their own voice; "HQ" is a shared high-quality instant voice, also the owner's own.
- **No two roles share a voice.**
- **Names:** the lines keep the script's spelling, but the text sent to the voice uses the house lexicon's respellings, listed in `respell` in `cast-el.json`:
  - Mas /mɑs/ is sent as "Moss", Gerg /ɡɜɹɡ/ as "Gurg" and Alyi /ˈælji/ as "Al-yee";
  - NopeAI as "Nope A.I.", v2 as "V two", and Nole as "Knoll";
  - GNIB, CHATGTP, Yrral, Ttemme, Tasya and Neleh have entries ready for the full episode.
- **Mas's lowercase lines** are sent in sentence case, so the voice reads them as speech.

## 3. Characters spent

| Run | Calls | Characters sent | Billed (the `character-cost` header) |
|---|---|---|---|
| Model probes (v3, v2, text-to-dialogue) | 3 | 65 | 35 |
| Principals' audition (5 × 6 roles, 7 lines) | 35 | 2,395 | 1,315 |
| `eleven_v3` comparison (6 lines) | 6 | 294 | 162 |
| **The sample, sets A and B**, with 22 retakes | 156 | 5,956 | 3,272 |
| Supporting auditions (24 lines; 1 retake, 2 voice swaps, 1 respelling) | 28 | 1,344 | 738 |
| **Total** | **228** | **10,054** | **5,522** |

- **The rate:** this account was billed about 55 credits per 100 characters sent on `eleven_multilingual_v2`. The subscription's own count agrees: 5,522.
- **The log:** [usage.json](../../../../../audio/ep01/v3-el/usage.json) has the subscription before and after, and every run.

## 4. The sample: files and how to A/B it

All paths below are under `audio/ep01/v3-el/`. The WAVs and the cache are git-ignored; the JSON is tracked.

| File | What |
|---|---|
| `sample/lines-A.json`, `sample/lines-B.json` | **The lines JSON, one per set** (69 rows each) in the fastrec format: `id`, `text`, `spoken_as`, `file`, `duration_s`, `pace.audible_in_s` / `audible_out_s`, `words` [{w, t0, t1}], `qa` and `voice`, plus `el` {voice, model, settings, seed, request key} and `kokoro_ref` (the Kokoro take it replaces, with its numbers) |
| `sample/wav/<id>__<role>-<A\|B>.wav` | The takes: 48 kHz / 24-bit mono, **−18 LUFS integrated**, true peak ≤ −1.5 dBTP, dry, with a 0.35 s room-tone handle each side and a −62 dBFS room-tone bed (the fastrec file shape) |
| `sample/wav-device/*.call.wav` | **Gerg's 11 call lines in sc 29**, through a copy of the house call filter, because the Kokoro takes printed that chain in. `file_device` in the lines JSON points to them; `file` stays dry |
| `sample/ep01-v3-sample-el-A.json`, `-B.json` | **Retimed copies** of the lead's `show/reel/trials/ep01-v3-sample.json` with the EL takes swapped in. The gaps between lines are kept, and timed items move with their line. The original is untouched. Made by `tools/retime.py` |
| `auditions/principals/lines-{A..E}.json` + `wav/` | The five-candidate audition of each principal (7 lines). This is the file to listen to when choosing A or B, or neither |
| `auditions/lines-A.json` + `wav/` | One Ep1 line for each of the 23 other roles, including the three derived voices |
| `cast-el.json`, `usage.json`, `casting/` | The cast; the spend; the screen's shortlist and the preview measurements |

**Word timings:**
- They come from ElevenLabs' with-timestamps alignment and are clamped to the audible span.
- Against faster-whisper's word starts, the median disagreement is 0.09 s per take (worst 0.35 s).
- The `words` array has one entry per written word. "Low-key" is one word, as in Kokoro.

**Level-match before judging:**
- The brief asked for −18 LUFS per take, and the EL takes are there.
- The Kokoro sample's dialogue takes are at −16 LUFS; its V.O. is at −18.
- Played as they are, Kokoro's dialogue is 2 dB louder, and the louder voice tends to win an A/B. Add +2 dB to the EL dialogue rows, the ones with `kind: "dialogue"`, or take 2 dB off Kokoro's.

**Same timeline or retimed:**
- **Swapped into the sample at Kokoro's times,** the lines would overlap:
  - Set A: 8 lines run into the next line (2 of them by 0.05 s or less), and 4 run past their beat's end. The worst is V.O. `v3s-02`, which runs 2.5 s into "it's a preview.".
  - Set B: 4 overlaps, 1 of them marginal.
- **The retimed copies** keep every gap. Set A runs **348.0 s** against Kokoro's 332.9 s (+15.1 s); set B runs **327.8 s** (−5.1 s).

## 5. What the measurements say

### 5.1 Per role

Voiced time is the sum of the audible spans. The wpm figure is the median over lines of five or more words; shorter lines are too short to measure pace.

| Set | Role | Lines | Median F0, EL (Kokoro) | F0 spread across lines | Median range per line | wpm, EL (Kokoro) | Voiced time, EL (Kokoro) |
|---|---|---|---|---|---|---|---|
| A | Mas, talk | 17 | 120 Hz (113) | 103–139 | 9.9 st | 197 (208) | 19.4 s (20.4) |
| A | **Mas, V.O.** | 12 | 122 (117) | 110–137 | 11.6 | **131 (172)** | **42.4 (32.5)** |
| A | Gerg | 19 | 143 (127) | 123–179 | 14.0 | 204 (200) | 50.4 (51.8) |
| A | Rima | 8 | 170 (208) | 163–177 | 9.8 | 146 (174) | 33.9 (27.0) |
| A | Neleh | 5 | 209 (162) | 194–232 | 5.5 | 243 (225) | 12.6 (13.7) |
| A | Alyi | 3 | 88 (87) | 86–102 | 13.7 | 194 (183) | 7.8 (7.8) |
| A | Tasya | 2 | 159 (148) | **116–202** | 13.2 | 159 (200) | 8.7 (6.9) |
| B | Mas, talk | 17 | 107 (113) | 94–129 | 10.0 | 222 (208) | 17.5 (20.4) |
| B | Mas, V.O. | 12 | 114 (117) | 94–134 | 13.1 | 186 (172) | 30.8 (32.5) |
| B | Gerg | 19 | 123 (127) | 105–174 | 12.6 | 228 (200) | 47.4 (51.8) |
| B | Rima | 8 | 186 (208) | 169–215 | 8.9 | 145 (174) | 30.4 (27.0) |
| B | Neleh | 5 | 175 (162) | 172–192 | 9.4 | 202 (225) | 14.4 (13.7) |
| B | Alyi | 3 | 101 (87) | **69**–107 | 13.9 | 192 (183) | 8.4 (7.8) |
| B | Tasya | 2 | 149 (148) | 147–151 | 11.7 | 224 (200) | 6.2 (6.9) |
| both | Chatgtp / Mada | 2 / 1 | 259 (253) / 105 (117) | | | | 3.1 (2.9) / 0.8 (0.9) |

**What the table shows:**
- **Mas's inner voice (set A) is the biggest difference from Kokoro.**
  - It runs 131 wpm, against Kokoro's 172 and his talk's 197. That is the guide's "slower than he talks to people", one point over the top of its 110–130 wpm band.
  - The time goes into pauses between his sentences (up to 0.94 s in `v3s-01`), not into slow words (3.6 syll/s).
  - That is +10 s of voice over 12 lines. Set B's inner voice is quicker than Kokoro's.
- **Rima A and B are slower than Kokoro** (about 145 wpm against 174). That's her brief's "never rushed" (135–150), and it adds about 3–7 s.
- **Gerg:**
  - Set A matches Kokoro's pace (204 against 200 wpm) and sits higher and brighter (143 Hz).
  - Set B is faster (228 wpm) and at Kokoro's pitch.
- **Neleh and Rima swap pitch order against Kokoro.**
  - In set A, Rima (170 Hz) sits under Neleh (209 Hz); in Kokoro, Rima was the higher (208 against 162).
  - The separation holds: 3.6 st in set A, 1.1 st in set B, where timbre has to carry it.
- **Silence at the head and tail:**
  - Every take has 0.35–0.50 s of room tone before the first sound: the handle plus the voice's own onset.
  - Each has 0.35–0.86 s after the last sound.
  - No take starts or ends in digital silence.
- **The files are clean:**
  - every take is at −18.0 LUFS (−18.4 to −18.0);
  - true peak ≤ −1.50 dBTP;
  - no clipped samples.

### 5.2 Retakes the renderer made on its own

These all come from measurement, and the renderer keeps the better-measured take of each pair. 22 sample takes were re-sent:
- **The audio stopped while still sounding (5):** the last 20 ms above −45 dB.
- **ASR recall was under 0.8 (5):** for example, "It's the pill." became "It's the bill."
- **Pitch outliers (11):** a take more than 4 st off the role's typical pitch and outside its lane. For example, Mas's "leave it open." first came back at 257 Hz and the retake measured 123 Hz; Rima B's "Nobody asked one." went from 367 Hz to 169 Hz.
- **One retake I asked for** (`a5-29-03`, set B).

The supporting auditions had 4 more calls: 1 retake, 2 voice swaps and 1 respelling.

### 5.3 Worth an ear first (the measurements can't settle these)

1. **"Macrosoft" (`a5-29-08`, `a5-29-09`):** the recogniser writes "Microsoft" for all four EL takes, and for the Kokoro takes too. That points at the recogniser's prior, but only an ear can confirm the parody name comes through.
2. **"the badge was a joke." (`a5-29-01`):** A was heard as "batch" and B as "band"; Kokoro's take was heard as "badge". It may be under-articulated.
3. **Gerg's name in Mas's voice (`v3s-10`, set A):** heard as "Kirk never waits to be asked." The Kokoro takes were heard as "Jurg" and "Jerg".
4. **Tasya A (Tyler Kurk)** measured 202 Hz on "Don't get up, Mas…" but 116 Hz on "Yes. You first…". Two takes of the first line both came back at about 202 Hz, and the same voice measured 136 Hz on that line in the audition, with "Mahs". His pitch is inconsistent between lines, so listen to both.
5. **Alyi B (Brent), "Someone should." (`e1-a1-5-15`):** 69 Hz, and both takes are the same. That may be creak.
6. **Gerg B, "Sorry, one sec…" (`a5-29-03`):** the only take left whose raw audio stops while still sounding (−26 dB, 10 ms before the end, on "compiling"). Both retakes were heard as "I've got **to** build compiling", so the first take was kept.
7. **Small word changes the recogniser heard:**
   - "not the other way **round**" came back as "**around**" (Neleh, both sets);
   - "That's **going to** cost us" as "**gonna**" (Rima B);
   - "alyi **asks**" as "**asked**" (Mas A, `v3s-03`).

   If the voice really said them, each is a free re-dress away from a `--retake`.
8. **Supporting voices outside their lanes on one line:** NOLE at 95 Hz and NESNEJ at 107 Hz sit under their lanes, and SIRRAH at 230, SYDNEY at 296 and CLOD at 198 sit above theirs. MARIO (128), NEDIB (126) and RADNUS (135) are all within 1 st of each other, and they share sc 13, so timbre has to separate them. SYDNEY's "2022" was heard as "2020 to".
9. **"Mr. Manalt"** has no house pronunciation, and the recogniser heard "Menalt" and "Minolt". Add one to `respell` once the room settles it.

## 6. Model: why `eleven_multilingual_v2`, not `eleven_v3`

The account can use `eleven_v3`, the most expressive model. I tested it on six of the same lines, with Mas A and Gerg A at the same speeds as the v2 takes.

| | `eleven_v3` | `eleven_multilingual_v2` |
|---|---|---|
| Takes whose audio stopped while still sounding | 3 of 6 | 0 of 6 |
| Mas V.O. `v3s-02`, voiced | 4.0 s (164 wpm) | 6.6 s (101 wpm) |
| Mas "it's a preview." / "leave it open." | 0.66 s / 0.60 s | 0.87 s / 0.93 s |
| Gerg `e1-a1-5-03` | 183 wpm | 230 wpm |
| Speed control | not tested: at the same setting it ran faster than v2 for Mas and slower for Gerg | honoured, 0.7–1.2 |
| Word timings against ASR, median per take | 0.04 s | 0.09 s (both usable) |

**The result:** v3 ran the wrong way for both briefs. It made Mas faster and Gerg slower, and half its takes stopped while still sounding. ElevenLabs' own guidance is that v3 is less stable on short prompts, and most of our lines are short single lines.

**Where v3 could still help:** its text-to-dialogue endpoint renders a whole exchange in context. One probe returned per-speaker time segments, so it could be split into per-line takes. That's the scene-level rendering CASTING.md §6 recommends. It would need its own test, and a render key per exchange rather than per line.

## 7. The whole episode, later (after the script lock)

> **Done in phase 2** (§P1–§P9 above). The commands there supersede the sketch below: they add `--target-lufs -16 --vo-lufs -18`, `--reuse`, the name check and the EL-timed lock builder.

**The tool:** [tools/el_render.py](../../../../../audio/ep01/v3-el/tools/el_render.py). It reads any lines file:
- a stick or reel timeline, such as `show/reel/ep01-v3/ep01-v3-<seg>.json`;
- a fastrec lines JSON, such as `audio/ep01/v3/<seg>/lines.json`;
- or a beat plan (rows with their own text).

**Resuming:**
- Every request is cached by its key: voice, model, settings, text as sent, and seed (from the line id and the voice). The cache is `audio/ep01/v3-el/cache/`, and it's git-ignored.
- **A line whose key hasn't changed is never sent again.** Only new or changed lines cost characters.
- `--max-chars` stops a run before it overspends.
- A changed dressing only re-dresses locally (`--redress`, free).

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
# 1. check coverage and cost (no API calls): every speaker must resolve to a role
for s in coldopen act1 act2 act3 act4 tag; do HF_HUB_OFFLINE=1 $PY $T plan --lines show/reel/ep01-v3/ep01-v3-$s.json --sets A; done
# 2. render one set, segment by segment (resumable; re-run after any script change)
for s in coldopen act1 act2 act3 act4 tag; do
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --lines show/reel/ep01-v3/ep01-v3-$s.json \
      --out audio/ep01/v3-el/$s --sets A --max-chars 6000 --retry-bad 1 --retry-pitch; done
# 3. a listening note on a line: one new take, keep the better-measured one
HF_HUB_OFFLINE=1 $PY $T render --lines show/reel/ep01-v3/ep01-v3-act4.json --out audio/ep01/v3-el/act4 --sets A --retake a5-29-01
# 4. a retimed copy of the lock for the EL mix (gaps kept; the lock itself is untouched)
$PY audio/ep01/v3-el/tools/retime.py --timeline show/reel/ep01-v3/ep01-v3-act4.json \
    --lines audio/ep01/v3-el/act4/lines-A.json --out audio/ep01/v3-el/act4/ep01-v3-act4-el-A.json
```

**Coverage and cost, checked on the lock as saved at 12:19 (no API calls):**
- All six segments resolve: 226 rows, every speaker cast. I added the lock's short ids (`host`, `clone`, `senator`, `deepfake`, `deepfake-2`) to `labels`.
- One set is **9,418 characters sent, about 5,200 credits** at today's rate. Both sets are about 10,400 credits, and about 11,500 with the 10 % of retakes the sample needed.
- The account has 125,478 credits left this cycle.
- Unchanged sample lines are reused for free wherever the lock keeps their id and text.

**What the full render should also do:**
1. **Pick the set per principal first.** Set A for Mas, then set B for Rima, is fine: sets are just the candidate letter per role.
2. **Keep the dressing dry.** Rooms, the headset (TTEMME), the monitor (REMUHCS), the PA (PANEL HOST) and SYDNEY's sheen belong to the mix, as in Kokoro. Only the call lines get a printed device copy, and the dry file stays the default.
3. **Level-match EL dialogue to −16 LUFS** in the mix if the Kokoro mix stays at −16. Or ask for `target_lufs` in `cast-el.json` to change, which is a free re-dress.
4. **Expect longer V.O. with Mas A.** The sample's 12 V.O. lines run +10 s against Kokoro. Across the lock's V.O. lines that's roughly +20 to +25 s, which the lock has to absorb or the V.O. speed (0.82) has to come up.

## 8. To decide

1. **Mas: A (Giovanni) or B (Evan), or neither.**
   - A measures closest to the V.O. brief: 131 wpm, pauses between thoughts, a narrow range.
   - B is warmer and lower, but its V.O. is quicker than Kokoro's.
   - The five-way audition is in `auditions/principals/`.
2. **Gerg, Alyi, Rima, Neleh, Tasya: A or B each.** Tasya A's pitch jumps between his two lines (item 4 in §5.3).
3. **"Macrosoft" and "badge":** these need an ear. If either is wrong, use a respelling or a `--retake`.
4. **Level:** match the EL dialogue to the Kokoro −16 LUFS for the A/B, or leave all takes at −18 as briefed.
5. **Timeline:** judge the A/B on the retimed copies (`sample/ep01-v3-sample-el-A.json`, `-B.json`), or at Kokoro's positions with the overlaps listed in §4.
6. **Later, optional:** whether to test v3 text-to-dialogue on one scene (a few hundred characters) before the full render.

---

**Files written by this pass** (nothing else was touched; nothing was committed):
- `audio/ep01/v3-el/`:
  - `cast-el.json` and `usage.json`;
  - `tools/` (`ellib.py`, `elaudio.py`, `el_render.py`, `retime.py`, `cast_el.py`; phase 2 adds `el_lock.py`, `el_bed.py`, `pron_check.py` and `usage_phase.py`);
  - `sample/`, `auditions/` and `casting/`;
  - phase 2: `ep01/` (the takes per segment, `qa/` and `el-lock-report.json`);
  - `cache/` (git-ignored).
- Phase 2: `show/reel/ep01-v3-el/` (the EL-timed lock and its manifest), `audio/reel/ep01-v3-el/` (the beds; the WAVs are git-ignored) and `out/ep01/reel/ep01-v3-el-stick.*` (the reel). Running the reel also let `studio/src/reel/sync.mjs` copy the new timelines into `studio/src/reel/data/`, as every reel render does.
- `show/episodes/ep01/production/full-v3/voices-el.md` (this file).
- Scratch went to the session scratchpad under `v3-voices-el/`: the full 2,111-voice pool, the preview MP3s, and the audition and v3 test renders.
