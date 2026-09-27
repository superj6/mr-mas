# Ep1 · Act Four · Voice diagnosis of the v4 takes, and a recording method for v5

*Dialogue recording supervisor, 2026-09-26. Written for the showrunner's note on Act Four v4 (verbatim in [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) note 11): "a lot of the dialoge is unnatural … dialogue seems to randomly blurt out or cut off … i said to cut down empty time, but not to cut every dialogue into only a few words per character". Guidance followed: [flow-and-continuity §4](../../../../bible/flow-and-continuity.md#4-dialogue-rhythm).*

**Honesty.** I can't listen. Everything here was **measured** on the delivered WAVs, on `lines.json`, on the v4 lock (`shots-locked-v4.json`) and on the v4 mix (`act4-mix-v4.wav`, `act4-dialogue-premix-v4.wav`). The naturalness scores come from an automatic predictor (UTMOS22). It's a proxy trained on isolated read sentences, and it doesn't hear acting, timing between speakers or whether a voice fits a character. No v4 file was changed. The A/B files for the ear pass are listed in §6. **Nothing here is a verdict until a human has listened.**

---

## 0. Summary

1. **The main problem is fragments, not the voice.** The v4 cut has 45 voiced lines and 176 words. The median line is 4 words, and 21 lines are three words or fewer. There are 21 exchanges; 8 of them are a single line, and the longest runs 10 s. The recording pipeline built those fragments:
   - 16 takes were read after a throwaway lead-in ("Okay.", "Right. Okay.", "Mm.") that was then cut off.
   - 2 takes were read with a tail that was then cut away.
   - 5 lines are hard cut-offs that end with a 3 ms ramp and no tail.
   - 1 line is a two-word splice lifted out of another take.
   - 1 line had its first sentence cut out ("Nine seats.").
   - 15 sentence stops were set by pause edits to 0.10–0.33 s, which left runs of 0.01–0.18 s of digital silence inside 11 lines.
2. **Pace was solved to picture slots, not chosen by intent.** Each take's Kokoro speed was solved so its audible length matched the length the shot had been timed to. Across the 45 lines, the effective speed runs from **0.66 to 1.51**:
   - 13 lines ran 10% or more faster than the voice's own default pace, and 13 ran 10% or more slower.
   - 3 lines were also time-stretched shorter afterwards (×1.06–1.10).
   - One character's tempo swings from line to line: NELEH runs 3.6–6.1 syllables a second on her lines of three or more words.
   - In total, though, the takes are **not** faster than a plain read. The 45 files hold 60.3 s of audible speech, against 58.1 s for the same words read once at speed 1.0. **Re-recording at a natural pace won't fix the note by itself.** The script and the cut have to let people finish their thoughts.
3. **Starts and ends are bare.** Kokoro makes no breaths, and the finishing rules trimmed every take to 20 ms of head and 40 ms of tail. They also cut any breath or hiss tail, and set internal stops as digital black.
   - 37 of 45 files start within 25 ms of the first sound, and 40 end within 60 ms of the last.
   - In the mix, a line starts a median **12.4 dB** above the 0.3 s before it (16 lines jump more than 15 dB). It ends with a median 8.4 dB drop.
   - 6 lines open an exchange at most 0.5 s after a cut, following 6–19 s with no voice: "super.", "We'll share more soon.", "The bylaws allow it…", "One sec. Compiling—", "Has anyone read the char—" and ALYI's post. That's the measurable shape of "blurts out".
4. **The prosody problem is mostly short text.**
   - Pitch spread inside a line is about the same as a plain read of the same words (NELEH, ALYI, MARIO: F0 spread 3.0–5.4 st in both).
   - The flat lines are the fragments: 8 lines are under 2 st of spread, and every one of them has 1–8 words.
   - The slowed V.O. reads (speed 0.66–0.72) have about half the pitch range of the same words at 0.92 (9.0 vs 18.9 st on "the badge was a joke.").
   - Yes/no and echo questions barely lift or fall ("Is this a coup?" −0.2 st, "Share what?" −1.0, "When?" −1.0).
5. **The bake-off (6 lines, UTMOS22-strong, paired on the same words).** A **whole read at an intent-chosen speed, with no carrier, edits or stretch**, scored **3.80** on average, against **3.45** for the delivered takes. It scored higher or equal on all six lines, by +0.01 to +1.05. Across all 43 unprocessed v4 lines, a plain read beat the delivered take by 0.23 on average. The cost of each kind of processing, against a plain read of the same words:

   | Processing | UTMOS cost |
   |---|---|
   | Time-stretch (3 lines) | −1.07 |
   | The splice | −1.37 |
   | Kokoro speed of 1.15 or more (8 lines) | −0.51 |
   | Carrier cuts (16 lines) | −0.31 |
   | Pause edits (10 lines) | −0.26 |

   The 9 v4 takes made with none of these score the same as a plain read (+0.02), which suggests the predictor is responding to the processing and not to noise.
   - **Controlled tests:** a stretch of ×1.1 costs 0.79 on average (up to 1.45). Kokoro speeds from 0.8 to 1.1 cost about 0.1 or less on average; 1.2–1.5 costs 0.10–0.25.
   - **Where a sentence pause goes longer:** splitting a turn into separate reads costs 0.50. Opening the pause with room tone inside one whole read costs 0.13. Kokoro barely lengthens a pause for "..." (+0.03–0.05 s).
6. **The method for v5 (§4)**, step by step:
   1. Record whole turns, one read per turn, at a speed chosen by intent from a per-character band.
   2. Hold each character's pace steady within a scene.
   3. Never solve speed to fit a slot, never time-stretch, never cut a carrier.
   4. Open sentence pauses with room tone to lengths set by intent.
   5. Deliver every take with its own onset and decay, room-tone handles and, where a new thought starts, an inhale.
   6. Make interruptions rare, and record both lines complete.
   7. Let the picture fit the talk.

---

## 1. What was measured, and how

- **Lines:** the 45 voiced cues in `shots-locked-v4.json` `audio_cues` (the v4.2 lock), with their `lines.json` rows and the delivered WAVs in `audio/ep01/act4/dialogue/wav/`. The V.O. "gerg never waits to be asked." is recorded but isn't in the v4 cut.
- **Speaking rate:** syllables (vowel nuclei from misaki's own phonemes) ÷ the audible span.
  - The audible span is measured on 10 ms frames above −40 dB relative to the line's peak.
  - Articulation rate leaves out pauses of 0.1 s or more.
  - Words per minute are given too, but they mislead on 1–3 word lines.
- **Pitch:** pYIN at 16 kHz, 10 ms hop. The spread is the standard deviation (and 5–95 % range) in semitones around the line's median.
  - `am_michael` (Mas) and `am_adam` (MADA) are husky packs, so some octave errors are possible.
- **Loudness contrast:** the standard deviation of per-word RMS (dB) over Kokoro's word timings.
- **Onsets and ends:**
  - Head: time from the file start to the first frame at −40 dB. Tail: time from the last such frame to the file end.
  - Rise: −40 → −10 dB, on 5 ms frames. Decay: the reverse.
  - Digital silence: runs of exact zeros of 10 ms or more inside the audible span.
- **Exchanges:** consecutive lines less than 1.5 s apart, audible end to audible start. This reproduces the lead's 21 exchanges.
- **Mix context:** the louder channel of `act4-mix-v4.wav` in the 0.05–0.35 s before each line's audible start, against its first 0.25 s. The background is approximated as the mix minus the premix; it ignores the limiter, which reduces by at most 1.7 dB.
- **Naturalness predictor:** UTMOS22 "strong learner", the SpeechMOS port (tarepan/SpeechMOS v1.2.0, MIT-licensed weights from sarulab-speech/UTMOS22).
  - It was loaded through `torch.hub` into the scratch folder, with the existing `.venv-casting` torch (CPU) and a 10-line stand-in for torchaudio's `resample`. Nothing was installed into a project venv. The checkpoint was 392 MB, and free space stayed above 8 GB.
  - Every file was scored on **equal padding**: trimmed to −45 dB, then 0.15 s of silence each side. That way the v4 takes' 20/40 ms trims don't bias the score.
  - Scores are only compared on **the same words**. UTMOS rates short clips lower: clips under 0.8 s average 2.66 and clips of 1.5 s or more average 3.70, a correlation of 0.48 with length.

## 2. Findings

### 2.1 The talk is fragments, and the recording pipeline cut them

| Measure (v4) | Value |
|---|---|
| Voiced lines · words | 45 · 176 |
| Words per line | median 4; 21 lines of three words or fewer |
| Exchanges | 21. Mean 2.1 lines, median 3.4 s; the longest 9.96 s (sc 27, the phones: 5 lines, 23 words) |
| Single-line exchanges | 8 |
| Gaps inside exchanges | 24. Median 0.62 s, from −0.26 to 1.37 s; 6 overlaps |
| Time between exchanges | median 6.6 s; 13 of 21 exchanges start after 5 s or more with no voice |
| Dialogue share of the act | 60.2 s of audible speech in 251.5 s = **24 %** |

The gaps inside exchanges already sit in the ranges flow-and-continuity §4 gives: a quick reply 0.2–0.5 s, a considered one 0.6–1.2 s. The problem isn't the spacing between two lines. It's that exchanges stop after two.

**How the lines were split or joined.** `lines.json` `processing` for each take; the appendix has every line.

| Operation | Lines | What it does to the ear |
|---|---|---|
| **Context carrier, cut** ("Okay.", "Right. Okay.", "Anyway.", "Mm.", "It was a joke.", "Which room is on fire?", "Ah.") | 16 | The line is read as the second half of an utterance and cut at the quietest 5 ms frame with a 4 ms fade. Its first word starts mid-phrase, with no breath and no onset of its own, as if joined partway through |
| **Tail carrier, cut** (", everyone.", ". Fine.") | 2 | The final is kept "open", then guillotined 8 ms after the last word |
| **Hard cut-off** (read on into a continuation, cut at the closure; or cut inside the word after *n* phonemes) | 5 | Ends in 3 ms with no tail. "The investor gets—", "And the CEO owns—", "I've written up some thoughts—", "One sec. Compiling—", "Has anyone read the char—" |
| **Pause edits** (a sentence stop set to a target with digital silence) | 10 lines, 15 edits | Kokoro's own stops measured 0–0.07 s. They were set to 0.10–0.28 s (the memo's to 0.33 s) by inserting or removing exact zeros, which left runs of 0.01–0.18 s of digital black inside 11 lines (the splice's stop included). GERG's two stops are 0.10 s; MARIO's three are 0.14–0.16 s |
| **Splice** ("More. Soon." = two words lifted from "We'll share more soon.", 0.12 s stop) | 1 | UTMOS 3.01 against 4.38 for a plain read of the same words |
| **Words cut out of a finished take** (a4-25-10b: "Nine seats." removed at a pause edit) | 1 | The line starts at a join inside a read |
| **Reused files** (MADA's one "Good question." master twice; "super." re-used through the laptop chain) | 2 | By design (a canned answer; the same line heard on the far side of the call) |

### 2.2 Pace was solved to picture slots

The 3.2 pass solved each take's Kokoro speed so that its audible span matched `target_span_s`, the length the board was timed to. It then time-stretched the three takes that hit the speed clamp. The same routine sped some lines up and slowed others down.

- **Time-stretched** (Rubber Band R3, formants kept):

  | Line | Kokoro speed × stretch | Effective | UTMOS v4 · plain |
  |---|---|---|---|
  | `a4-29-03` "mostly." | 1.089 × 1.062 | 1.157 | 2.99 · 3.96 |
  | `a4-30-06` "…Ah." | 1.375 × 1.10 | 1.513 | 1.36 · 2.55 |
  | `a4-30-07` "Terms?" | 1.375 × 1.10 | 1.513 | 2.38 · 3.43 |

- **Effective speed (Kokoro speed × stretch) 1.10 or more** (13 lines). Kokoro's speed scales every duration evenly, pauses included. A person speeding up shortens pauses and unstressed syllables first. The lines:
  - `a4-27-09` 1.104, `a4-27-16` 1.122, `a4-30-03` 1.142, `a4-29-03` 1.157, `a4-29-06` 1.168
  - `a4-27-21` 1.183, `a4-27-23` 1.184, `a4-30-05` 1.192, `a4-27-05` 1.196, `a4-29-04` 1.210
  - `a4-27-15` 1.270, `a4-30-06` 1.513, `a4-30-07` 1.513
- **Kokoro speed 0.90 or less** (13 lines):
  - The V.O.: `a4-26a-vo1` 0.660 and `a4-29-vo2` 0.715.
  - Everyone else: `a4-29-05`, `a4-30-09` and `a4-30-12` 0.825; `a4-27-20` and `a4-30-02` 0.833; `a4-27-06` 0.854; `a4-27-04` and `a4-27-24` 0.855; `a4-29-08` 0.870; `a4-31-03` 0.879; `a4-27-14` 0.892.
- **The same character at different tempos.** Measured over every line; the syllable rate is for lines of three or more words that aren't cut off.

  | Character | Lines | Kokoro speed (min–max) | Syllables/s | F0 spread (median) |
  |---|---|---|---|---|
  | NELEH | 10 | 0.91–1.18 | 4.7 (3.6–6.1) | 2.6 st |
  | MAS (on camera) | 9 | 0.83–1.16 | 3.8 (3.6–4.0) | 2.8 st |
  | ALYI | 4 | 0.85–1.10 | 3.6 (2.9–4.2) | 3.6 st |
  | TASYA | 4 | 0.83–1.05 | 4.6 (4.0–5.2) | 3.4 st |
  | GERG | 3 | 1.03–1.21 | 4.7 (4.4–5.1) | 2.5 st |
  | TERB | 3 | 1.19–1.51 | 4.8 | 1.8 st |
  | MAS (V.O.) | 2 | 0.66–0.72 | 2.5 (2.3–2.8) | 2.7 st |
  | MARIO | 2 | 0.89–1.12 | 4.0 | 5.0 st |

  NELEH's "The company is calling us." (6.1 syllables/s, 227 wpm) comes 0.7 s after her "When?". Her "Three left this year…" earlier in the act runs at 3.6. One character swinging 70 % in tempo reads as edited, not as a person.
- **The V.O. was slowed by stretching syllables, not by phrasing.** At 0.66–0.72 its short words run at 2.3–2.8 syllables/s with no pauses. The same words at 0.92 have about twice the pitch range (see §2.3). Both are close to the voice's ceiling on UTMOS (4.32 against 4.33), so this one needs the ear, not the number.
- **In total the takes aren't fast.** 60.3 s audible, against 58.1 s for the same words read once at speed 1.0, or 55.2 s against 52.3 s without the cut-offs. The v2 note ("the dialogue feels slow") was answered by speeding lines up and chopping pauses to fit shorter shots. The v4 note is answered by longer talk and shots that hold, not by a different read speed.

### 2.3 Prosody

- **Pitch within a line is Kokoro's, and it's not especially flat.** The delivered and plain reads of the same words have nearly the same F0 spread: NELEH 3.04 and 3.04 st, MARIO 5.35 and 5.41, ALYI 3.24 and 3.20. Kokoro's melody is fixed by the text (and the speed). Change the text and you change the tune.
- **The flat ones are fragments.** 8 lines are under 2 st of spread: `a4-25-10b`, `a4-25-12`, `a4-27-23`, `a4-27-10`, `a4-27-15`, `a4-29-03`, `a4-30-03`, `a4-30-05`. Every one has 1–8 words, and several are single words or cut-offs. One or two words give the model no phrase to shape.
- **Loudness contrast between words is lower in the delivered takes** on 4 of the 5 comparable bake-off lines. The word-to-word spread is 0.9–2.0 dB, against 1.7–7.3 dB for the plain reads: NELEH 1.9/3.1, MARIO 1.6/2.0, GERG 2.0/7.3, V.O. 0.9/1.7 (ALYI 3.9/3.6 is the exception). The speed pushes and the carrier contexts both even out stress.
- **Slowing below about 0.85 flattens the tune.** "the badge was a joke." spans 9.0 st at 0.715, against 18.9 st at 0.92 (pYIN; octave errors possible, so the ear decides).
- **Questions.** Wh-questions fall, which is natural. The yes/no and echo questions barely move: "Is this a coup?" −0.2 st (flat or falling on all 11 takes tried in 3.2), "Share what?" −1.0, "When?" −1.0. Only "Step four?" (+1.7) and "Terms?" (+0.8) lift.
- **Nothing answers anything.** Every line is an isolated read, so no reply picks up the previous speaker's pitch or tempo. In a real exchange the second line is shaped by the first. With a stock TTS this can only be approximated: hold each character's pace steady, and let the writing carry the link.

### 2.4 Starts and ends

- **No breaths anywhere.** Kokoro produces none, and the 3.2 finishing rule cut any "flat noise tail (breath or vocoder hiss …)" 30 ms after the last audible frame.
- **Heads and tails:** 37 of 45 files start 25 ms or less before the first sound. 40 end 60 ms or less after the last sound, and the 5 cut-offs end with none. Rise times are 20 ms or less on 20 lines.
- **Digital black inside lines:** 15 runs in 11 lines. The mix beds fill them from outside, but the voice's own air stops dead mid-line.
- **The dialogue is dry.** `mix_v4.py` adds no room to any voice. The 3.2 doc's "rooms are mix sends" (ALYI's hall and the rest) wasn't implemented, so every line ends in the same dry stop whatever the room.
- **How lines enter the mix:**
  - The mix level rises a median 12.4 dB into a line: 16 lines rise more than 15 dB, and 3 more than 20 dB ("super." +24 after 19 s of no voice, "okay." +23 after 23 s, ALYI's post +20).
  - The level falls a median 8.4 dB within 0.35 s of the last word.
  - The music duck has a 40 ms look-ahead and a 60 ms attack, so the score dips at the same moment the voice hits.
- **Cold opens:** 6 lines start an exchange at most 0.5 s after a cut, following 6–19 s with no voice:

  | Line | Voiceless before (s) | After the cut (s) |
  |---|---|---|
  | "super." | 19.3 | 0.27 |
  | "We'll share more soon." | 8.9 | 0.45 |
  | "The bylaws allow it. Footnote three." | 13.0 | 0.31 |
  | "One sec. Compiling—" | 12.3 | 0.35 |
  | "Has anyone read the char—" | 9.4 | 0.32 |
  | ALYI's "I deeply regret…" | 6.5 | 0.36 |

  Picture, speaker and voice all arrive in the same third of a second, with no breath or room ahead of the word. Two of these lines are also cut off.

## 3. The bake-off

**Lines.** Six v4 lines, chosen to cover each failure:
- `a4-27-08` NELEH: two sentences with a pause edit.
- `a4-27-16` MARIO: four fragments, sped up, three pause edits.
- `a4-27-13` ALYI: a slow character, one sentence.
- `a4-30-07` TERB: the most compressed line (1.375 × 1.10).
- `a4-29-06` GERG: sped up, a carrier and two pause edits.
- `a4-29-vo2` MAS (V.O.): slowed to 0.715, with a carrier.

**Variants.** Each variant uses the same stock pack, the same dry chain and the same loudness as the delivered take. Three seeds each; Kokoro's seed moves only the vocoder noise.
- **(a)** The delivered take.
- **(b0)** The script's own punctuation read once, whole. The speed is chosen by intent (below), with no carrier, pause edit or stretch. The take keeps its own onset and decay: 0.12 s of head, and a tail to −60 dB + 0.1 s.
- **(b)** Text shaped for prosody. Sentence groups read separately and joined with a pause chosen by intent (0.30–0.40 s), and a misaki stress demotion on ALYI's line (`[company](-1)`, to push the stress onto "telling").
- **(b+)** (b), plus a synthetic inhale 0.10 s before the onset, a small dry-room reflection and 0.3 s room-tone handles.

**Speeds, from the direction:**

| Line | Direction | Speed |
|---|---|---|
| NELEH | precise, patient | 0.95 |
| MARIO | eager | 1.08 |
| ALYI | a weighty koan | 0.88 |
| TERB | brisk | 1.05 |
| GERG | sunny, quick | 1.08 |
| V.O. | told | 0.92 |

**Results** (UTMOS22 on equal padding; the (b0) and (b) columns average three seeds):

| Line | Speaker | v4 speed × stretch | (b0) speed | Span a / b0 / b (s) | Syllables/s a / b0 / b | **a** | **b0** | b | b+ | F0 spread a / b0 (st) | Word loudness spread a / b0 (dB) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `a4-27-08` | NELEH | 1.009 | 0.95 | 2.00 / 1.92 / 2.51 | 4.5 / 4.7 / 3.6 | 2.80 | **3.13** | 2.63 | 2.82 | 3.0 / 3.0 | 1.9 / 3.1 |
| `a4-27-16` | MARIO | 1.122 | 1.08 | 2.27 / 1.87 / 2.70 | 4.0 / 4.8 / 3.3 | 3.59 | **4.12** | 3.57 | 3.66 | 5.4 / 5.4 | 1.6 / 2.0 |
| `a4-27-13` | ALYI | 0.991 | 0.88 | 2.27 / 2.61 / 2.59 | 4.0 / 3.5 / 3.5 | 4.29 | **4.32** | 4.32 | 4.01 | 3.2 / 3.2 | 3.9 / 3.6 |
| `a4-30-07` | TERB | 1.375 × 1.10 | 1.05 | 0.53 / 0.70 / 0.70 | – | 2.38 | **3.43** | 3.43 | 3.50 | – / 5.3 | – |
| `a4-29-06` | GERG | 1.168 | 1.08 | 1.76 / 1.61 / 2.03 | 5.1 / 5.6 / 4.4 | 3.31 | **3.49** | 2.66 | 2.69 | 2.5 / 2.3 | 2.0 / 7.3 |
| `a4-29-vo2` | MAS (V.O.) | 0.715 | 0.92 | 1.81 / 1.41 / 1.41 | 2.8 / 3.5 / 3.5 | 4.32 | **4.33** | 4.33 | 4.25 | 2.7 / 4.6 | 0.9 / 1.7 |
| **Mean** | | | | | | **3.45** | **3.80** | 3.49 | 3.49 | | |

What it says:
- **(b0) beats or equals (a) on every line:** +0.34, +0.53, +0.03, +1.05, +0.18 and +0.01.
  - The largest gains are where v4 processed the most: the stretched "Terms?" (+1.05), and MARIO's sped-up line with its pause edits (+0.53).
  - ALYI's plain v4 take and the V.O. score the same either way. ALYI's is a plain whole read already. The V.O.'s cost is its halved pitch range, which UTMOS doesn't rate (§2.3).
- **Splitting a turn into separate reads (b) scored worse than one whole read**, by 0.50 on NELEH, 0.55 on MARIO and 0.83 on GERG, and no better than the v4 take. Each separately read sentence restarts its melody and gets its own final lengthening, so the turn no longer hangs together. The inhale and room in (b+) move the score by −0.3 to +0.2, within the predictor's noise, so they're for the ear.

**Why (b) lost: four ways to get a real sentence pause.** Run on the three multi-sentence lines, three seeds each, with room tone under all four versions. The cost is against W0:

| Way | Cost | NELEH / MARIO / GERG | What it does |
|---|---|---|---|
| W0: one whole read | – | 3.07 / 4.16 / 3.25 | Kokoro's own stop, about 0.04–0.1 s |
| W1: one whole read, "…" for the stop | −0.05 | 2.94 / 4.12 / 3.27 | Kokoro lengthens the stop by only 0.03–0.05 s |
| **W2: one whole read, the stop opened with room tone** (+0.22–0.30 s at the quietest point, 8 ms crossfades) | **−0.13** | 2.98 / 3.96 / 3.15 | A real 0.3–0.4 s pause, and the turn stays one performance |
| W3: sentence groups read separately | −0.50 | 2.68 / 3.59 / 2.71 | A real pause, but two performances |

**Pace sweep** (the (b0) text, seed 1, UTMOS change against speed 1.0, mean over the six lines, with the worst line in brackets):

| Speed | 0.7 | 0.8 | 0.9 | 1.0 | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 1.0 stretched ×1.1 | ×1.2 | ×1.3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Δ UTMOS | −0.11 (−0.46) | −0.11 (−0.61) | −0.04 (−0.25) | 0 | +0.04 (−0.01) | −0.17 (−0.61) | −0.10 (−0.55) | −0.21 (−0.30) | −0.25 (−0.55) | **−0.79 (−1.45)** | −0.87 (−1.37) | −0.86 (−1.57) |

- Within about 0.8–1.1, Kokoro's own speed control is safe on this measure.
- It falls away above 1.2, and on ALYI and the V.O. above 1.3. At 0.7, the V.O.'s plain read loses 0.46.
- The time-stretch is the one clearly damaging tool, even at ×1.1.

**All 45 v4 lines against a plain read of the same words** (speed 1.0, the same chain, no edits; cut-offs ended plainly). The 43 unprocessed lines average **3.31 against 3.53** (+0.23; the plain read is higher on 29, by 0.2 or more on 17, and lower by 0.2 or more on only 1).

| Group | Lines | v4 → plain |
|---|---|---|
| Time-stretched | 3 | 2.25 → 3.31 |
| The splice | 1 | 3.01 → 4.38 |
| Kokoro speed 1.15 or more | 8 | 2.90 → 3.41 |
| Carrier cut | 16 | 3.30 → 3.61 |
| Pause edits | 10 | 3.19 → 3.45 |
| Cut-offs | 5 | 3.07 → 3.33 |
| Kokoro speed 0.86 or less | 10 | 3.71 → 3.96 |
| **None of the above, speed 0.9–1.1** | **9** | **3.19 → 3.20** |

**The same exchange, both ways** (§6 has the files). The sc 27 phones exchange ("The bylaws allow it. Footnote three." / "Step four will reveal itself." / "When?" / "The company is calling us." / "That is the company telling us.") was rebuilt with the v5 method:
- **The words are unchanged**: this tests the recording method, not the writing.
- Whole reads at 0.95 (NELEH) and 0.88 (ALYI); NELEH's stop opened +0.28 s with room tone.
- Gaps set by intent: 0.55, 0.22, 0.95 (she looks down at the phone) and 0.45 s.
- Two inhales, a small room, and one synthetic room bed at −40 dBFS.

It runs **11.4 s against v4's 9.96 s for the same 23 words (+14 %)**. That's the order of time natural delivery adds back, taken from dead holds elsewhere.

## 4. The recording method for v5

These are guides, like everything in flow-and-continuity. The watching and listening experience decides.

### 4.1 The rules of the session

1. **Record the conversation, not the lines.** The unit is a **turn**: everything one person says before the other answers, often two or three sentences. Read each turn **once, whole** (Kokoro handles about 30–40 words in one pass). Split only at a real change of thought, and put a breath and a pause there (§4.4).
2. **Choose the speed from the intent, from the character's band (§4.2), and hold it.** One character keeps one speed within a scene, ±0.05, unless the scene changes their state (heat, shock, relief). Write the reason on the take.
3. **Never solve speed to fit a picture slot.** If the take is longer than the shot, the editor extends the shot or cuts dead time elsewhere. If a line must be shorter, the writer cuts words. The recordist doesn't squeeze.
4. **Never time-stretch dialogue.** It was the largest measured damage (−0.79 on average at ×1.1).
5. **Never cut a carrier off the front of a take, and never splice words out of another take** to make a line. If a line needs a different tune, change its text or punctuation and read it again.
6. **Keep Kokoro's speed within about 0.85–1.12.** Above 1.2 the predictor drops. Below about 0.85 short lines lose half their melody. To make someone slower, give them pauses between phrases, not longer syllables. That goes for the V.O. especially: make it "closer and slower" with the `vo-close` chain, −2 LU and 0.3–0.5 s phrase pauses, at speed 0.88–0.95.

### 4.2 Per-character pace guides

Starting points. The v4 columns show what was delivered. "Articulation" is syllables per second of talking, leaving out pauses of 0.1 s or more. "Turn wpm" is words per minute across a turn of two or more sentences with its pauses. People in ordinary conversation mostly articulate somewhere around 4–6 syllables a second. Much below 3.5 reads deliberate, and above about 6 reads rushed.

| Character | Brief (casting) | v4 Kokoro speed | v4 syllables/s | **v5 speed** | Articulation guide | Turn wpm guide |
|---|---|---|---|---|---|---|
| MAS (on camera) | the calmest in any room, never a drawl | 0.83–1.16 | 3.6–4.0 | **0.88–0.95** | 3.6–4.2 | 135–155 |
| MAS (V.O.) | closer, softer, a touch slower; told | 0.66–0.72 | 2.3–2.8 | **0.88–0.95**, slowness from phrase pauses | 3.4–4.0 | 120–140 |
| NELEH | precise, efficient; a clean stop before a citation | 0.91–1.18 | 3.6–6.1 | **0.92–1.00** | 4.2–4.8 | 150–170 |
| ALYI | weighty baritone; the weight in pitch, not length | 0.85–1.10 | 2.9–4.2 | **0.85–0.92** | 3.4–4.0 | 115–140 |
| TASYA | warm, measured; business words as mantras | 0.83–1.05 | 4.0–5.2 | **0.88–0.96** | 3.8–4.4 | 125–145 |
| RIMA TAMURI | composed broadcast polish | 0.855 | 3.6 | **0.90–0.98** | 4.0–4.6 | 140–160 |
| MADA | unhurried, canned; pauses stand in for sentences | 0.976 | 3.5 | **0.92–1.00** | 3.6–4.2 | 125–145 |
| ADELINA | brisk but unhurried; kind finality | 1.27 | 3.9 | **0.95–1.05** | 4.2–4.8 | 150–165 |
| TERB | brisk, procedural, unbothered | 1.19–1.51 | 4.8 | **0.98–1.06** | 4.4–5.0 | 165–185 |
| MARIO | earnest, eager; fast when the money comes up | 0.89–1.12 | 4.0 | **1.00–1.08** | 4.6–5.4 | 160–185 |
| TTEMME | streamer patter, affable | 1.03 | 3.2 | **1.00–1.08** | 4.4–5.2 | 155–175 |
| GERG | bright, quick, sunny; the fastest in the act | 1.03–1.21 | 4.4–5.1 | **1.02–1.10** | 5.0–5.8 | 175–200 |
| One-line voices (the employee, others) | natural | 1.20 | 4.9 | **0.95–1.05** | 4.2–5.0 | 150–170 |

Heat within a scene lifts a band by about 0.05; shock or grief lowers it by about 0.05. Kokoro reads one-word lines long (TERB's "Terms?" is 0.70 s at 1.05). Let them be that long.

### 4.3 Shaping the text

Kokoro's melody comes from the words and punctuation it's given, so the text is the performance.
- **Write the turn as it's said:** whole sentences, with contractions as people use them.
  - A comma gives a short phrase break. A full stop gives a fall and a short stop, which you then open (§4.4). A question mark on a wh-question falls, as it should.
  - Don't expect "…" or "—" to make a pause. Measured, they add 0.03–0.05 s.
  - Don't use "??" (3.2 tried it).
- **Place contrastive stress with misaki's markup.** `[word](-1)` demotes a word and `[word](-2)` removes its stress. `(+1)`/`(+2)` only promote words that have no stress (function words), so it's usually easier to demote the neighbour. Test: `That is the [company](-1) telling us.` The ear must confirm the stress moved to "telling".
- **Pronunciations** stay in `spoken_as` as now: `[gerg](/ɡˈɜɹɡ/)`, ALYI → 'AL-yee'.
- **Yes/no and echo questions.** Kokoro rarely lifts them, so try the options in this order:
  1. The writer rewords so the question carries in the words ("Is this a coup, or…?", "Share *what*, exactly?").
  2. Read two or three seeds and speeds within the band, and a comma variant.
  3. As a last resort, a gentle pitch bend on the final syllable only (+2 to +3 st over 150–250 ms, formants kept), flagged for the ear.

### 4.4 Pauses, breaths and room

**Sentence pauses inside a turn.** Kokoro's own stops are about 0.04–0.1 s, which is too short for a thought to land. Open them in the dialogue edit, inside the one whole read:
- **Room tone, not digital black.** Insert at the quietest 5 ms point of the existing gap, with 8 ms crossfades. The prototype is `open_pause()` in the scratch `pauses_test.py`.
- **Set the length by intent:**

  | Pause | Length |
  |---|---|
  | Between sentences of one thought | 0.25–0.45 s |
  | A beat, or a change of thought | 0.5–0.9 s |
  | A comic hold | as long as it plays |

- Never make two pauses in a row the same length.

**Breaths.** People inhale before they start a thought.
- **Where:**
  - before the first line of an exchange
  - before a turn that follows a second or more of silence
  - before any turn of three or more sentences
  - at a split inside a long speech
- **Not** before a quick reply (a gap under about 0.4 s: they're already breathed in), and not on every line. About one turn in three is a fair start.
- **Shape:** an inhale of 0.25–0.45 s, ending 0.05–0.15 s before the first word, about 25–35 dB under the line's peak.
- **Source:** for v5, a licensed library of generic breaths recorded by consenting performers, matched only broadly (a lower or higher register). Never a breath taken from, or matched to, a real person's recordings. The scratch `inhale()` (band-limited noise with a breath envelope) is only a placeholder for the ear test; it may sound like noise.

**Room, heads, tails and handles.**
- Deliver every take with its **own onset and decay**:
  - at least 0.12–0.15 s before the first sound
  - the natural tail down to −60 dB plus 0.1 s
  - no truncation of a breath or hiss tail
- Add **0.3–0.5 s room-tone handles** each side, so the editor crossfades on air.
- In the mix, give each location a small early reflection on the dialogue (a send, a few percent) so line ends decay into their room. The mix beds run under it, as v4 already does.
- A tooling note: in pedalboard's `Reverb`, `dry_level` 0.5 is unity (the JUCE engine doubles the dry and triples the wet). At `dry_level=1.0` a take comes out 6 dB hot and clips, which the scratch run first did.

### 4.5 Overlaps and cut-offs (rare, and motivated)

- **Tail overlaps** (a reply starting on the other's last syllable, 0.1–0.3 s) are ordinary conversation. Use them when the reply is eager, without marking them as interruptions.
- **An interruption is two complete lines.**
  - The interrupted speaker reads the whole sentence they meant to say, in one read, and the interrupter reads theirs.
  - Lay them on two tracks, with the interrupter coming in 0.2–0.6 s before the first line would have ended.
  - Under the interrupter, the interrupted voice trails: −6 to −10 dB, then out over 100–200 ms after one more syllable. People trail off; they don't stop in 3 ms.
  - Keep both words intelligible at the overlap.
- **A hard stop** (a click, a door, a dropped call) is the only place a line ends in a few milliseconds, and the sound that causes it covers the cut.
- **As a guide, a few interruptions per act** (flow §4). v4 had 6 overlaps and 5 cut-offs in 45 lines.

### 4.6 Placement, for the editor (so nothing blurts)

- **Gaps by intent:** a quick reply 0.2–0.5 s, a considered one 0.6–1.2 s, never uniform (flow §4). The most common gap between turns in ordinary conversation is around 0.2 s.
- **An exchange never opens in the same instant as its picture.** Pick one:
  - Let the shot land 0.5–1 s before the first word.
  - Pre-lap the breath and the first words under the previous shot (a J-cut).
  - Carry the voice in from off-screen over the room.
- Whoever speaks first after a silence gets a breath (§4.4).
- **Hold the talk on shots that hold** (two-shots, over-the-shoulders), and cut on real turns (flow §1–§2). The takes are now whole turns of 2–8 s, so a cut per line would be even more visible.
- **The mix:**
  - Pre-duck the score 150–300 ms ahead of a line, with a 150–250 ms attack, rather than v4's 40 ms look-ahead and 60 ms attack.
  - Release it over 400–800 ms.
  - Hold the duck across the short gaps inside an exchange. v4.1 already holds it across gaps under 2.5 s.

### 4.7 Choosing takes (QA for v5)

In this order:
1. **The ear.** A person listens to each exchange in context.
2. **Paired UTMOS against a plain whole read of the same words at speed 1.0.** Flag any delivered take more than 0.3 under its plain read. The absolute number isn't meaningful across lengths.
3. **ASR CER**, as now.
4. **Pace stability** per character per scene: speed spread 0.08 or less, articulation spread about 20 % or less.

**Hard checks** (these are the method, not taste):
- no time-stretch
- no carrier cut, no splice across takes
- no digital black inside a take
- heads of 0.12 s or more, natural tails, handles present

**Drop from the 3.2 QA:** span against a picture target, and "internal pauses ≤ 0.3 s".

**Tools.** In `audio/ep01/act4/dialogue/tools/`, retire these for dialogue, or keep them only for a designed effect:
- `a4pace.solve_speed` to targets, and `a4pace.compress`
- `a4lib.carrier_cut` and `a4pace.hard_tail_cut`
- `a4lib.set_pause` with zeros
- `a4pace.finish()`'s 20/40 ms trims and noise-tail truncation

The scratch prototypes are `render_nat()` and `natural_trim()` (`bakeoff.py`), `open_pause()` (`pauses_test.py`) and `dress()` (`bakeoff.py`: the inhale, room and handles).

### 4.8 What stays firm

- Stock Kokoro-82M packs only. No cloning, no reference audio of any real person, no mimicry ([guardrails](../../../../bible/guardrails.md)). Breaths come from a generic licensed library or synthesis, never from a real person.
- Real quotes are read verbatim with their tags.
- Invented lines keep their [INVENTED] tag in the script.
- The V.O. stays Mas's alone.

## 5. What a human has to check

1. **The six A/B pairs** (§6): does (b0) sound more like a person than (a) on each? Is TERB's unstretched "Terms?" better? Does the 0.92 V.O. still read "closer and slower" than his scenes (the POV owner's call, script ruling 7)?
2. **The exchange trio** (`ex27_*`): does the method version (`ex27_b_method.wav`) follow like a conversation? Is 11.4 s for those words too slow for NELEH, or right?
3. **The inhale placeholder and the small room** in `*__bplus.wav` and the trio: do they help, or read as noise? If noise, the v5 breaths need the licensed library before anyone judges the idea.
4. **The stress demotion:** does `[company](-1)` put the stress on "telling"?
5. **The questions** listed in §2.3: which ones need rewording rather than re-reading?
6. **The per-character bands (§4.2):** is each voice's pace right for the character?

## 6. Files

Scratch (session-only; these can be regenerated with the scripts):
`/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/dlg5-voice/`

- `listen/`: for the ear pass.
  - `<id>__a.wav`: the v4 take.
  - `<id>__b0.wav`: a whole read at intent speed.
  - `<id>__bplus.wav`: (b) with the inhale, room and handles.
  - The six lines are `a4-27-08`, `a4-27-16`, `a4-27-13`, `a4-30-07`, `a4-29-06` and `a4-29-vo2`.
  - `ex27_a_v4mix.wav`: the v4 mix at 86.9–98.4 s.
  - `ex27_a_v4dlg.wav`: the v4 dialogue premix there, over the demo bed.
  - `ex27_b_method.wav`: the same words, v5 method, the same bed.
  - `ex27.json`: the demo's placements.
- **Scripts:**
  - `analyze_v4.py`: the per-line measures and exchanges → `v4_lines.json`, `v4_exchanges.json`.
  - `mixctx.py`: mix context → `v4_mixctx.json`.
  - `bakeoff.py`: → `bakeoff.json`, `takes/`.
  - `sweep_and_score.py`: the pace sweep, the stretch test, the 45 plain reads and UTMOS → `scores.json`.
  - `pauses_test.py`: → `pauses.json`.
  - `rescore_bplus.py` and `exchange_demo.py`.
  - `mos.py`, `shim/`: the UTMOS loader.
- `takes/` (every bake-off variant and seed) and `pauses/` (the four pause methods, W0–W3) are kept.
- The UTMOS checkpoint and the sweep and plain-read renders were deleted after scoring, to free disk. `mos.py` fetches the checkpoint again in about 15 s.

## Appendix: every v4 line

"How it was made" is from `lines.json` `processing`. "Mix jump" is the mix level in the first 0.25 s of the line against the 0.3 s before it. "UTMOS plain" is the same words read once at speed 1.0 with the same chain and no edits; cut-offs are ended plainly, so compare those two with care.

| Line | Speaker | Text | Words | Kokoro speed × stretch | Syll/s | How it was made | Head / tail (ms) | Gap before (s) | Mix jump at onset (dB) | UTMOS v4 · plain |
|---|---|---|---|---|---|---|---|---|---|---|
| `a4-25-10b` | Neleh | Three left this year. Four of us vote. | 8 | 0.908 | 3.6 | 2 pause edits; v4 edit: "Nine seats." cut out of the a4-25-10 take | 20 / 45 | – | +11 | 3.13 · 3.56 |
| `a4-25-11` | Neleh | This board controls the company. | 5 | 0.913 | 4.6 | plain read | 25 / 55 | 0.62 | +16 | 3.56 · 3.61 |
| `a4-25-12` | Neleh | The investor gets— | 3 | 0.998 | 6.5 | carrier-cut (Okay.), cut-off (tail) | 20 / 0 | 3.42 | +8 | 2.99 · 3.20 |
| `a4-25-13` | Neleh | And the CEO owns— | 4 | 0.957 | 6.7 | cut-off (tail) | 15 / 0 | 0.55 | +16 | 3.09 · 3.34 |
| `a4-25-02` | Mada | Good question. | 2 | 0.976 | 3.5 | plain read | 20 / 60 | -0.13 | +1 | 2.37 · 2.57 |
| `a4-26-01` | Mas Manalt | super. | 1 | 1.067 | 3.4 | plain read | 25 / 65 | 19.27 | +24 | 3.64 · 3.45 |
| `a4-26a-vo1` | Mas (V.O.) | i don't keep score. | 4 | 0.660 | 2.3 | carrier-cut (Anyway.) | 25 / 60 | 2.66 | +15 | 4.11 · 4.22 |
| `a4-27-00` | Mas Manalt | super. | 1 | 1.067 | 3.3 | a4-26-01's take through the laptop-speaker chain | 20 / 50 | 11.32 | -1 | 3.09 · 3.45 (processed copy) |
| `a4-27-04` | Rima Tamuri | We'll share more soon. | 4 | 0.855 | 3.6 | plain read | 30 / 55 | 8.94 | +8 | 4.46 · 4.42 |
| `a4-27-23` | Neleh | Share what? | 2 | 1.184 | 3.4 | plain read (then the call filter) | 20 / 45 | -0.13 | +2 | 2.68 · 2.35 (processed copy) |
| `a4-27-24` | Rima Tamuri | More. Soon. | 2 | 0.855 | 2.4 | splice: two words lifted from a4-27-04, 0.12 s digital-silence stop | 20 / 50 | 0.66 | +16 | 3.01 · 4.38 |
| `a4-27-05` | Tiled Employee | Is this a coup? | 4 | 1.196 | 4.9 | carrier-cut (Right. Okay.) | 15 / 50 | 5.33 | +12 | 3.58 · 3.69 |
| `a4-27-06` | Alyi | "You can call it this way" | 6 | 0.854 | 2.9 | plain read | 40 / 60 | 0.89 | +16 | 4.30 · 4.25 |
| `a4-27-08` | Neleh | The bylaws allow it. Footnote three. | 6 | 1.009 | 4.5 | 1 pause edit | 25 / 60 | 12.97 | +10 | 2.80 · 3.09 |
| `a4-27-09` | Alyi | Step four will reveal itself. | 5 | 1.104 | 3.3 | carrier-cut (Okay.) | 20 / 50 | 0.54 | +14 | 3.87 · 4.12 |
| `a4-27-10` | Neleh | When? | 1 | 0.980 | 2.3 | carrier-cut (Okay.) | 20 / 55 | -0.06 | +16 | 2.63 · 2.44 |
| `a4-27-12` | Neleh | The company is calling us. | 5 | 0.982 | 6.1 | plain read | 20 / 55 | 0.74 | +9 | 3.23 · 3.42 |
| `a4-27-13` | Alyi | That is the company telling us. | 6 | 0.991 | 4.0 | plain read | 35 / 55 | 0.62 | +16 | 4.29 · 4.29 |
| `a4-27-14` | Mario | I've written up some thoughts— | 5 | 0.892 | 4.1 | cut-off (tail) | 25 / 0 | 4.67 | +11 | 3.71 · 3.87 |
| `a4-27-15` | Adelina | In plain English: no. | 4 | 1.270 | 3.9 | carrier-cut (Right. Okay.), 1 pause edit | 30 / 55 | -0.26 | +3 | 2.95 · 3.46 |
| `a4-27-16` | Mario | Hi. Yes. We're very worried. How much? | 7 | 1.122 | 4.0 | 3 pause edits | 25 / 50 | 1.37 | +15 | 3.59 · 4.05 |
| `a4-27-19` | Ttemme | Chat… for how long? | 4 | 1.027 | 3.2 | 1 pause edit | 5 / 50 | 7.59 | +7 | 2.21 · 2.22 |
| `a4-27-20` | Tasya | "a new advanced AI research team" | 6 | 0.833 | 4.6 | carrier-cut (Okay.), tail-carrier (, everyone.) | 30 / 50 | 6.01 | +4 | 3.03 · 3.44 |
| `a4-27-21` | Neleh | Step four? | 2 | 1.183 | 2.9 | carrier-cut (Okay.) | 10 / 40 | 0.85 | +15 | 2.80 · 3.19 |
| `a4-29-vo2` | Mas (V.O.) | the badge was a joke. | 5 | 0.715 | 2.8 | carrier-cut (Mm.) | 30 / 50 | 11.59 | +9 | 4.32 · 4.27 |
| `a4-29-03` | Mas Manalt | mostly. | 1 | 1.089 × 1.06 | 3.1 | carrier-cut (It was a joke.) | 20 / 50 | 0.93 | +14 | 2.99 · 3.96 |
| `a4-29-04` | Gerg Mockbran | One sec. Compiling— | 3 | 1.210 | 5.0 | cut-off (inside), 1 pause edit | 20 / 0 | 12.31 | +12 | 2.44 · 3.21 |
| `a4-29-05` | Mas Manalt | what are you building? | 4 | 0.825 | 3.7 | plain read | 25 / 45 | -0.12 | +0 | 3.76 · 3.94 |
| `a4-29-06` | Gerg Mockbran | The company. Again. Just in case. | 6 | 1.168 | 5.1 | carrier-cut (Okay.), 2 pause edits | 5 / 45 | 0.42 | +13 | 3.31 · 3.24 |
| `a4-29-07` | Tasya | Everyone is welcome. | 3 | 1.045 | 5.2 | carrier-cut (Right. Okay.) | 25 / 60 | 3.72 | +11 | 4.01 · 3.85 |
| `a4-29-08` | Mas Manalt | leave it open. | 3 | 0.870 | 3.6 | plain read | 25 / 50 | -0.08 | +4 | 4.18 · 4.09 |
| `a4-29-09` | Neleh | Has anyone read the char— | 5 | 0.980 | 5.8 | cut-off (inside) | 25 / 0 | 9.40 | +3 | 3.10 · 3.03 |
| `a4-30-01` | Alyi | "I deeply regret my participation in the board's actions." | 9 | 0.950 | 4.2 | 1 pause edit | 30 / 50 | 6.50 | +20 | 4.32 · 4.25 |
| `a4-30-02` | Tasya | "We are below them, above them, around them." | 8 | 0.833 | 4.0 | 2 pause edits | 25 / 50 | 4.68 | +6 | 2.91 · 3.17 |
| `a4-30-03` | Mas Manalt | hi. | 1 | 1.142 | 2.1 | plain read | 20 / 70 | 1.02 | +11 | 2.36 · 2.95 |
| `a4-30-04` | Tasya | Hello. | 1 | 0.980 | 3.3 | plain read | 25 / 60 | 0.04 | +2 | 1.81 · 1.58 |
| `a4-30-05` | Terb | Which room is on fire? | 5 | 1.192 | 4.8 | carrier-cut (Okay.) | 20 / 100 | 6.75 | +2 | 4.34 · 4.49 |
| `a4-30-06` | Terb | …Ah. | 1 | 1.375 × 1.10 | 2.4 | carrier-cut (Which room is on fire?) | 20 / 40 | 1.07 | +15 | 1.36 · 2.55 |
| `a4-30-07` | Terb | Terms? | 1 | 1.375 × 1.10 | 1.9 | carrier-cut (Ah.) | 50 / 110 | 0.72 | +16 | 2.38 · 3.43 |
| `a4-30-08` | Mada | Good question. | 2 | 0.976 | 3.5 | the same master file as a4-25-02 | 20 / 60 | 0.65 | +18 | 2.37 · 2.57 |
| `a4-30-09` | Mas Manalt | good question. | 2 | 0.825 | 3.0 | carrier-cut (Okay.) | 20 / 50 | 0.72 | +19 | 4.18 · 4.23 |
| `a4-30-12` | Mas Manalt | okay. | 1 | 0.825 | 3.5 | tail-carrier (. Fine.) | 25 / 50 | 22.59 | +23 | 3.02 · 3.28 |
| `a4-31-01` | Gerg Mockbran | What's in there? | 3 | 1.029 | 4.3 | plain read | 20 / 140 | 4.26 | +16 | 3.23 · 3.19 |
| `a4-31-02` | Mas Manalt | it's a preview. | 3 | 0.971 | 4.0 | plain read | 20 / 45 | 0.48 | +18 | 4.17 · 4.14 |
| `a4-31-03` | Mas Manalt | "i love and respect alyi… i harbor zero ill will towards him." | 12 | 0.879 | 3.7 | 1 pause edit | 20 / 50 | 4.18 | +13 | 4.29 · 4.27 |
