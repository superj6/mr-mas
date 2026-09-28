# Ep1 v3: the ElevenLabs voice pass (`v3-voices-el`, track A4, 2026-09-27)

> **Status: PHASE 7 DONE: THE INTRO LINE IN ELEVENLABS.** The EL films' 30 s intro now has Mas's line in his EL voice (Jeremy), fitted to the Kokoro frames, in `audio/intro-mix/intro-ep1-mix-V1-chipchamber-el.wav` (§Y, directly below). Every line of the v3.3 lock (commit a756708) has an EL take, and there is an EL-timed copy of it (`show/reel/ep01-v33-el/`, key `ep01-v33-el-stick`, §X). v3.2 is §W, v3.1 §V, the Mas recast §R, phase 2 (the v3 lock) §P1–§P9, and phase 1 (the casting and the sample) §1–§8. Where phase 2 describes Mas, it describes Giovanni.
>
> **Nobody has listened to any of this.** Every statement below is a measurement: duration, pace, pitch, silence at the head and tail, loudness, and what a speech recogniser heard. Whether a voice is natural, funny, or right for the character is still a call for an ear.
>
> **Showrunner, 2026-09-27:** "we can also try a pass using elevenlabs samples", and "i want you to just do a full episode attempt with your best judgement". After listening: "the elevenlabs voices are not as good as i hoped, especially sam who sounds strangely russian", then "i'll let you make your own review, judgements, and update to the full next version"

**Phase 2, in short** (with Giovanni as Mas):
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

## Y. Phase 7: the intro line (2026-09-28)

**The note:** the showrunner, "in the intro mas's voice is not replaced" (PLAN.md §7 D). The EL films' 30 s intro still played the Kokoro Mas (am_michael) for "near the singularity; unclear which side.".

**In short:**
- **The line is recorded with Jeremy** (`EwzF7Z2UMSib9JaKx0Kg`, eleven_multilingual_v2): 9 reads, **104 credits** (241 characters). The subscription went from 14,128 to 14,232 of 131,000.
- **It is fitted to the intro's frames.** Every word onset is within 0.6 frame of Kokoro's, clip 1 ends in f57, the pause f58–71 is room tone only, and the voice ends at f92.0 (Kokoro f92.8, measured the same way).
- **It has the intro VO's own treatment and level:** −16.0 LUFS short-term max, as Kokoro's.
- **It is mixed into the V1 master with only the VO swapped:** `audio/intro-mix/intro-ep1-mix-V1-chipchamber-el.wav`, beside the untouched Kokoro master.

### Y1. The reads, and the pick

- **The reads** are in `audio/ep01/v3-el/intro/takes/`, with `reads-analysis.json`. The settings are stability 0.65, similarity 0.75, style 0 and speaker boost: Mas's V.O. steadiness for the soft, close read. The reads were:
  - three whole-line reads at speed 0.95: w1, w2, w3;
  - four phrase-2 reads: p2a and p2b at 1.15, p2c and p2d at 1.2;
  - two phrase-2 reads written "Unclear which side..." at 1.2 (p2e, p2f), for a hanging final.
- **Why two phrase-2 reads per speed, and why separate phrases:** the Kokoro timing is very tight on phrase 2. "unclear which side" gets 0.79 s (f72.07–91.10), while every whole read ran 1.4–1.6 s there, which would need 0.5–0.6× compression. So, as the intro-vox build did with its two Kokoro renders, clip 1 and clip 2 come from separate reads. The pause between them is fixed by the picture and is room tone only, so the join isn't heard.
- **Phrase 1: w2.** It has the gentlest fit (1.11, 1.12, 1.00) and the narrowest pitch range (7.6 st).
- **Phrase 2: p2e**, levelled. The intro's "side" hangs: no final fall, no creak, and no rise.
  - Measured with pYIN, p2c, p2d and p2f all go into creak on "side" (70–77 Hz, about 9 st under the phrase), though the ASR hears them as statements.
  - The whole reads and p2e end with a 2–3 st rise instead, which the ASR punctuates as a question.
  - p2e is the creak-free read with the least compression (0.78, 0.87, 0.74). Its "side" is levelled by the intro-vox build's own method: WORLD, 92 % of the way to the phrase's median with a −0.25 st settle, the /s/ unvoiced, and a 15 ms crossfade inside the /s/. Raw 113 → 134 → 125 Hz becomes 116 → 117 → 116 Hz.
  - Measured on the stem, "side" sits −0.1 st against the phrase with no creak (Kokoro's: −0.7 st, no creak).
  - The ASR still writes "…which side?" for the EL stem; it writes no punctuation for Kokoro's. For an ear.

### Y2. The fit (`tools/el_intro.py build --p1 w2 --p2 p2e --level-side`)

**How it works:**
- Each clip is one variable-rate Rubber Band pass (pedalboard's `time_stretch` with a per-sample stretch array), piecewise-constant between the word anchors.
- The anchors: "near" and "unclear" at their acoustic onsets, as the Kokoro timings are; the others from the EL alignment.
- The targets are Kokoro's onsets, each kept within 0.4 frame by the least stretch. Clip 1 ends by f57.9, and the voice ends by f91.5.
- The onsets are then verified on the output, by cross-correlating the source's envelope (warped by the map) with the output's (±0.08 s).

| Word | Kokoro (frame) | **EL** | Difference (frames) |
|---|---|---|---|
| near | 24.10 | 23.92 | −0.18 |
| the | 31.33 | 30.99 | −0.34 |
| singularity | 35.07 | 34.55 | −0.52 |
| unclear | 72.07 | 72.19 | +0.12 |
| which | 80.59 | 81.11 | +0.52 |
| side | 84.24 | 84.82 | +0.58 |

- **The stretch** (out/in): clip 1 1.11 / 1.12 / 1.00; clip 2 0.78 / 0.87 / 0.74.
- **The edges:** clip 1 ends at f57.44. The pause f58–71 is room tone only: the voice's room tail is under −60 dBFS by f60 (−63.9 dBFS in f60), as Kokoro's is.
- **The voice end:** the last 5 ms within 30 dB of the peak is f92.0 (Kokoro f92.8); within 40 dB, f93.0 (Kokoro f93.6). The −60 dBFS span is f23.8–94.7 (Kokoro f24.1–94.9).
- **The picture is unchanged.** The typing and the dot keep their frames. The EL word timings are in `audio/ep01/v3-el/intro/vo_word_timings-el.json`.

### Y3. The treatment and the level

- **The chain is `build_vo.py`'s, verbatim**, through the intro-vox helpers (`ivlib`, imported read-only):
  - a WORLD breath layer at −24 dB;
  - HPF 90 Hz, a +1.5 dB shelf at 170 Hz, −2 dB at 3.2 kHz, −1.5 dB at 6.5 kHz, a −2.5 dB shelf at 8 kHz;
  - 2:1 compression and a light tanh;
  - the split-band de-esser (at most 0.78 dB here);
  - the 0.30 s dark-room IR at 14 % wet;
  - the −66 dBFS dark-room tone under f22–95.
- **The stem:** `audio/ep01/v3-el/intro/intro-vox_vo-el.wav`, 30.000 s, 48 kHz / 24-bit stereo, dropped at f0.

| | **EL** | Kokoro (`intro-vox_vo.wav`) |
|---|---|---|
| Short-term (3 s) max | **−16.0 LUFS** | −16.0 |
| Integrated, the whole stem | −15.39 | −15.39 |
| Integrated over the line (f24–92) | −14.95 | −14.96 |
| Momentary max | −12.76 | −12.96 |
| True peak | −2.2 dBTP | −2.8 |

### Y4. The intro master for the EL films

- **The file:** `audio/intro-mix/intro-ep1-mix-V1-chipchamber-el.wav`, beside the Kokoro master, which is untouched (and so is `mix_build.json`).
- **The same mix, with only the VO swapped** (`tools/el_intro.py mix`, running `audio/intro-mix/scripts/mix_intro.py`'s own `build('V1')`, imported):
  - **First, a reproduction check:** rebuilding V1 from its own inputs gives the delivered master to −138.5 dBFS, so the procedure is exact.
  - **Then the master:** the delivered master plus (the EL VO − the Kokoro VO), each through the mix's VO fader (−4 dB) and its L/R centring, times the delivered build's own gain curve (master gain +1.41 dB and the limiter).
  - The limiter is idle over the line (0.00 dB of reduction over f20–100), so this is the full rebuild at the delivered master gain.
  - **Every sample outside the VO stem's extent (f22–105) is the delivered master's** (to −138.5 dBFS, the 24-bit rounding).
  - A straight re-run of `build('V1')` with the EL VO re-iterates the master gain to 1.40 dB instead of 1.41, a 0.01 dB change over the whole programme, so it isn't used.
- **Measured:** −13.99 LUFS-I and −1.3 dBTP (the Kokoro master: −14.00, −1.3). The line over f24–92 is −18.13 LUFS, against the Kokoro master's −18.16.
- **The D/M/E stems** are in `audio/ep01/v3-el/intro/stems-V1-el/`; they sum to the master at −138.5 dBFS. The QA is in `audio/ep01/v3-el/intro/mix-V1-el.json`.

### Y5. Where it lives, for the assembly

- **The pointer:** `audio/ep01/v3-el/intro/intro-el.json` has the paths, md5s, gain and fit.
  - **The EL film's intro chapter plays `audio/intro-mix/intro-ep1-mix-V1-chipchamber-el.wav` at −3 dB**, exactly where the Kokoro film plays `intro-ep1-mix-V1-chipchamber.wav`.
  - The picture stays `out/intro/intro-ep1-V1-1080p-flashfix.mp4`.
- **`show/reel/ep01-v33-el/ep01-v33-el.manifest.json`** now plays the -el master at −3 dB. `el_lock.py` sets this on every EL manifest it builds.
- **The assembly's own `assembly/el-v33-assembly.json`** (the assembly pass's file, not edited here) still names the Kokoro master. Its intro entry's `audio` should become the -el path for the next EL film.

```sh
audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_intro.py render     # the reads (cached)
audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_intro.py analyze    # anchors, fits, WAV copies of the reads
bash ops/heavy.sh audio/.venv-vocals/bin/python audio/ep01/v3-el/tools/el_intro.py build --p1 w2 --p2 p2e --level-side
bash ops/heavy.sh audio/.venv-mix/bin/python audio/ep01/v3-el/tools/el_intro.py mix
```

---

## X. Phase 6: the v3.3 polish (2026-09-28)

**The brief:** script draft 8.2 (`script-v33-notes.md`, PLAN.md §6).
- The two restored V.O. lines, V1 "it does." (9.09) and V2 "he's not wrong." (13.09).
- The employee's new line, v33-a4-0001.
- Tasya's last sentence as a clip on the bullpen TV, v33-a4-0002.
- Then the EL-timed v3.3 lock, with no reel.

**In short:**
- **Characters:** 78 sent and **43 billed**. The subscription went from 14,085 to 14,128 of 131,000.
- **The EL-timed v3.3 story runs 20:29.6** (29,510 frames) against the Kokoro lock's 20:29.3 (29,503; +0.35 s).

### X1. The four lines

| Line | How | Measured |
|---|---|---|
| **v3-vo-09** "it does." (9.09) | **reused**: Jeremy's take from the recast (phase 3), −18 LUFS | 0.78 s (Kokoro 0.79) |
| **v3-vo-12** "he's not wrong." (13.09) | **reused**: Jeremy's take from the recast | 1.19 s (Kokoro 1.12) |
| **v33-a4-0001**, the employee: "Everyone's packed. Whatever happens to this place, Mas, don't worry about us." | **new read** in her EL voice, Avery (candidate A, speed 0.95; in the room, dry). The only paid line | 4.75 s audible (Kokoro 4.12); 162 Hz, in her 135–175 lane; −16.0 LUFS; true peak −1.85 dBTP; no clipped tail; ASR reads it back verbatim ("Moss" for Mas, as always) |
| **v33-a4-0002**, Tasya (TV): "…We are below them, above them, around them." | **cut** from her EL take v3-a4-0003 (words 10–17, the lock's own cut; `el_cut.py --lock v33`), then a copy of the house `tv_speaker()` chain (HPF 150 Hz, LPF 6.5 kHz, +2 dB at 1.2 kHz, 2.5:1), levelled to −16 LUFS, as `.tv.wav`. The "IP rights" sentence is dropped | 3.50 s (Kokoro 3.86); ASR "We are below them, above them, around them." |

- `elaudio.py` has the `tv` chain.
- `el_render.py` detects `device: tv` (fastrec's v3.3 rows).
- `el_cut.py` makes a device copy from the dry cut when the lock puts a cut on a device its source never had.
- Every other v3.3 line sends exactly what its earlier EL take sent (checked line by line), so nothing else was read. The v3.1 and v3.2 cuts are cut again from the EL takes.

### X2. The EL-timed v3.3 lock

- **The files:** `show/reel/ep01-v33-el/ep01-v33-el-<seg>.json` and `ep01-v33-el.manifest.json` (key `ep01-v33-el-stick`; the studio shows `reel-ep01-v33-el`).
- **The build:** `tools/el_lock.py --lock v33`, with the rules of §P3 and §V2.
- **J-cuts:** all six leads are kept (5.03 −0.5, 7.01 −0.6, 12.02 −0.5, S3.06 −0.6, S5.11 −0.8, S8.08 −1.0 s).
- **The Runway frames:** S7.13 264, 32.01 62, and v31-32.01d 233 from frame 62, counted with the renderer's rounding.
- **The lock builder's notes:**
  - **S7.02b keeps its 1.35 s hold** after "…around them.": the beat changes only by the take (5.71 → 5.35 s).
  - **Names carried across merged beats** follow the words through each beat's clock.
  - **The restored V.O.** plays Jeremy's takes.
  - Nothing failed to apply: no missing takes, no flags.

| Segment | Kokoro v3.3 (frames) | **EL-timed** | Frames | Change |
|---|---|---|---|---|
| Cold open | 0:26.7 (640) | **0:24.3** | **583** | −2.4 s |
| Act One | 5:30.6 (7,934) | **5:35.8** | **8,059** | +5.2 s |
| Act Two | 3:10.6 (4,573) | **3:00.8** | **4,340** | −9.7 s |
| Act Three | 2:13.4 (3,202) | **2:09.8** | **3,114** | −3.7 s |
| Act Four | 8:25.7 (12,138) | **8:36.6** | **12,398** | +10.9 s |
| Tag | 0:42.3 (1,016) | **0:42.3** | **1,016** | 0.0 s |
| **Story** | **20:29.3 (29,503)** | **20:29.6** | **29,510** | **+0.35 s** |

- **The beat moves:**
  - 9.09: "it does." at 3.05 s (Kokoro 2.75: the collar line before it is longer).
  - 13.09: "he's not wrong." at 9.83 s (Kokoro 12.47: Radnus's two EL takes are 2.4 s shorter). The gap before it is the lock's.
  - S7.02: +0.63 s, the employee's take.
- **The beds** are built (`tools/el_bed.py --lock v33`, the v3.3 lock's own `bed.py`, `audio/reel/ep01-v33-el/`; all sounds resolved). The card is the lock's own.
- **The manifest validates:** `--plan` gives 21:14.7 (30,593 frames), all 234 takes, 7 beds, and no warnings.
- **The reel,** when wanted (about 8 minutes of wall, about 0.7 GB):

```sh
bash ops/heavy.sh bash audio/ep01/v3-el/tools/render_v33.sh                     # the takes (free now: all cached)
audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_lock.py --lock v33
bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_bed.py --lock v33
audio/.venv-casting/bin/python audio/ep01/v3-el/tools/el_lock.py --lock v33 --beds audio/reel/ep01-v33-el/beds.json
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v33-el/ep01-v33-el.manifest.json --jobs 2 --conc 4
```

---

## W. Phase 5: the v3.2 lock (2026-09-28)

**The brief:**
- Render the v3.2 lines that need new EL takes (lock-v32.md §3: 8 new reads and 3 cuts), with the current cast and Mas as Jeremy.
- Build the EL-timed v3.2 variant the same way as before: every gap and J-cut lead kept, and the Runway frames reserved (S7.13 at 264; the tag's demo at 233 from frame 62).
- Give its manifest a distinct key, and skip the reel.
- The budget is 4,000 characters.

**In short:**
- **All 235 lines** have EL takes, for **347 characters sent (191 billed)**.
- **The subscription** went from 13,894 to 14,085 of 131,000.
- **The EL-timed v3.2 story runs 20:44.3 against the Kokoro lock's 20:41.7 (+2.6 s).**

### W1. The takes

`audio/ep01/v3-el/ep01-v32/<seg>/lines-A.json` + `wav/` and `wav-device/`, made by `tools/render_v32.sh` (the same method as §V).

- **The 8 new reads** were sent, with one retake: Tasya's one-word "Mas." came back low (88 → 94 Hz; Kokoro's read is flagged the same way).
- **The 3 new cuts** (v32-a1-0001 "Okay, the build's green.", v32-a1-0006 "House rules, Sydney.", v32-a2-0002 "Would you come and run it?") are cut from the EL takes of the same source lines, by `tools/el_cut.py --lock v32`. So are the eight v3.1 cuts the lock keeps. Nothing was sent for them.
- **Everything else** keeps its phase-2/3/4 EL take. The v3.2 texts that changed only in print were checked against the text as sent: every other line sends exactly what its earlier take sent.
- **The stage chain (new in v3.2):**
  - The DevDay lines play through the hall PA: v32-a3-0001 (read on it), and e1-a3-22-01 / -02 (re-staged in the lock, "the take stands").
  - `elaudio.py` now has a copy of the house `pa_speaker()` chain: HPF 160 Hz, LPF 8.5 kHz, +2 dB at 2.4 kHz, 10 % saturation, 3:1.
  - The three EL takes have `.stage.wav` device copies, and the timelines play those.
- **The call chain:** v32-a1-0002 and -0004 (Tasya) and v32-a4-0001 (Neleh) play their `.call.wav` copies.
  - v3.2's Kokoro rows mark a device in `device`, with `mode: on-mic`, so the device rule now reads both.
  - **A flag for the v3.1 variant:** four v3.1 takes of that kind (v31-a1-0004, v31-a4-0003, -0009, -0010) play dry in `show/reel/ep01-v31-el/`, where their Kokoro takes are on the call filter. v3.2 has them right. The v3.1 variant is left as delivered.

### W2. The EL-timed v3.2 lock

- **The files:** `show/reel/ep01-v32-el/ep01-v32-el-<seg>.json` and `ep01-v32-el.manifest.json` (key `ep01-v32-el-stick`; the studio shows `reel-ep01-v32-el`).
- **The build:** `tools/el_lock.py --lock v32`.
- **The J-cuts:** all six leads are kept (5.03 −0.5, 7.01 −0.6, 12.02 −0.5, S3.06 −0.6, S5.11 −0.8, S8.08 −1.0 s).
- **The Runway frames are reserved,** counted with the renderer's own rounding: S7.13 is 264 frames, 32.01 is 62, and the demo beat v31-32.01d is 233 from frame 62. Their line starts, sounds and captions are the lock's. No overlaps or overruns were flagged.

| Segment | Kokoro v3.2 lock | **EL-timed** | Change | Beats changed |
|---|---|---|---|---|
| Cold open | 0:26.7 | **0:24.3** | −2.4 s | 3 |
| Act One | 5:29.8 | **5:35.0** | +5.2 s | 24 |
| Act Two | 3:13.0 | **3:03.3** | −9.8 s | 22 |
| Act Three | 2:22.4 | **2:18.8** | −3.7 s | 12 |
| Act Four | 8:28.5 | **8:41.6** | +13.2 s | 45 |
| Tag | 0:41.3 | **0:41.3** | 0.0 s | 2 (+0.16 and −0.16) |
| **Story** | **20:41.7** | **20:44.3** | **+2.6 s** | 108 |

**The beds** are built (`tools/el_bed.py --lock v32`, the v3.2 lock's own `bed.py`; 228 MB in `audio/reel/ep01-v32-el/`, all sounds resolved). The card is the lock's own.

**The manifest validates:** `episode.mjs --plan` gives 21:29.3 (30,944 frames), all 235 takes and 7 beds, and no warnings.

**To render the reel** (about 8 minutes of wall and about 0.7 GB):

```sh
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v32-el/ep01-v32-el.manifest.json --jobs 2 --conc 4
```

---

## V. Phase 4: the v3.1 lock (2026-09-27)

**The brief:**
- Render every v3.1 line that has no EL take yet, with the current cast and Mas as Jeremy.
- Give ELGOOG'S DEMO a neutral library voice that no cast member uses.
- Build the EL-timed v3.1 variant the same way as before: every gap and J-cut lead kept, and the Runway frames' beats (S7.13 and the tag's demo beat) at their fixed lengths.
- Make its manifest, with a distinct key, and a stick reel.
- The budget is 8,000 characters.

**In short:**
- **All 251 lines** of the six v3.1 timelines have EL takes.
- **Only 53 calls were needed** (2,189 characters sent, **1,201 billed**). Everything else was reused from phases 1–3 or cut.
- **The subscription** went from 12,693 to 13,894 of 131,000.
- **The EL-timed v3.1 story runs 21:17.0 against the Kokoro lock's 21:09.6 (+7.4 s).**

### V1. The takes

`audio/ep01/v3-el/ep01-v31/<seg>/lines-A.json` + `wav/` (and `wav-device/`), in the fastrec format as before.

**Where each take comes from:**
- **Rendered (53 calls):**
  - the 29 new v3.1 reads;
  - the 8 restored v2 lines, including Sydney's three, the Atem line, Nole's referee, and Mas's three (in Jeremy's voice);
  - the lines whose performance changed in the lock;
  - the renderer's own retakes.
- **Reused:** a line whose voice, settings and text as sent are unchanged uses its earlier EL take. The take chosen for that same line comes first, retakes included, then the line's own first take.
- **Two deliberate shares:**
  - v31-a4-0012 ("and the rent?") is Act One's take, as the lock rules.
  - Mada's second "Good question." shares his first, as in phase 2: his canned sameness.
- **The eight lines the lock cuts from an existing take** are cut from the EL take of the same source line (`tools/el_cut.py`: the lock's own table and method), and nothing is sent. That keeps the lock's "same performance" rule:
  - Alyi's sentence is told twice;
  - Sydney's reset "Hi!";
  - the landlord's "Everyone is welcome." on the monitor;
  - Nedib's two halves.

  Each cut is at the house level (−16 LUFS), with the device copy cut the same way where the source had one.
- **Subtitle-only changes keep their take,** as the Kokoro lock kept its takes ("the take stands"). v3.1 dropped the quote marks around the staff letter's and the statements' quoted fragments, but kept the elision ("they're …unable"), and spelled the letter's "judgement".
  - A mid-line elision mark before a word is now print, not a pause.
  - "judgement" is sent as "judgment".
  - So a5-29-06, -07, -09 and e1-a1-9-10 play their v3 EL takes.
  - Only a5-27-07 (the removal post, which lost its leading "…") is a new read of the same words.
- **ELGOOG'S DEMO ("What the quack!"):** **Bella - Professional, Bright, Warm**, an ElevenLabs premade voice ("Standard American accent"), used by no cast member. Stability 0.45, style 0.2 for the surprise, speed 1.0. It is heard as "What the quack?" at 249 Hz. The monitor chain is the mix's.

**Measured on the new takes:**
- **The levels are as before.**
- **One pronunciation is watched:** "Gerg comes back too.", +3.0 for Mas and +2.2 for Terb.
- **For an ear:**
  - **Rima A's "We'll say we will."** (v31-a4-0003) came back in a creaky register on all four seeds (74–84 Hz, against her 170). pYIN agrees: 61–80 Hz.
  - Tasya's "Due on the first." is heard as "Do on", as Kokoro's was.
  - Mas's "neleh's on our board" is heard as "Nel is"; Mario's "Nell-eh" as "Nelier".
  - Tasya A's pitch still wanders: "House rules, Sydney…" is at 113 Hz.

### V2. The EL-timed v3.1 lock

- **The files:** `show/reel/ep01-v31-el/ep01-v31-el-<seg>.json` and `ep01-v31-el.manifest.json` (key `ep01-v31-el-stick`; the studio shows `reel-ep01-v31-el`).
- **The build:** `tools/el_lock.py --lock v31`, with the same rules as §P3.
- **Fixed beats** (`--fixed`, the v3.1 default):
  - S7.13 stays 264 frames, and v31-32.01d stays 233. 32.01 has no line, so it keeps its 62 frames and the demo still splices at tag frame 62.
  - In a fixed beat, every line keeps its start, because they're anchored to the Runway frames: "Chat, we're so back." at k134, "What the quack!" at i110, "those are stills." at i168. Its sounds and captions don't move either.
  - The takes fit: Ttemme's line is 1.42 s (Kokoro 1.31), the demo's 0.88 s (1.02) and Mas's 1.18 s (1.16). No overlaps or overruns were flagged.

| Segment | Kokoro v3.1 lock | **EL-timed** | Change | Beats changed |
|---|---|---|---|---|
| Cold open | 0:26.7 | **0:24.3** | −2.4 s | 3 |
| Act One | 5:37.5 | **5:45.4** | **+8.0 s** | 27 |
| Act Two | 3:21.3 | **3:13.5** | −7.7 s | 23 |
| Act Three | 2:25.1 | **2:23.2** | −2.0 s | 14 |
| Act Four | 8:37.7 | **8:49.2** | **+11.5 s** | 46 |
| Tag | 0:41.3 | **0:41.3** | 0.0 s | 2 (+0.16 and −0.16) |
| **Story** | **21:09.6** | **21:17.0** | **+7.4 s** | 115 |

**The beds:** `tools/el_bed.py --lock v31`, the v3.1 lock's own `bed.py` pointed at these timelines, into `audio/reel/ep01-v31-el/`.
- Act One to the tag are rebuilt, with all their sounds resolved and none missing. The card is the lock's own bed.
- The cold open splices the v3.1 lock's own cold-open bed, which matches the current Kokoro cold open, per beat to the EL times.

### V3. The reel

`out/ep01/reel/ep01-v31-el-stick.mp4`: 1280×720, 24 fps, H.264 + AAC. It runs **22:02.1**: the 3 s title slate, then the 21:59.1 episode, against the Kokoro v3.1 stick's 21:54.7 (+7.4 s). 109.1 MB, 477 s of wall.

**What was checked:**
- **Frames:** 31,730, the plan's count. The Runway beats render at exactly S7.13 = 264 frames, 32.01 = 62 and v31-32.01d = 233 (the renderer's own cumulative rounding).
- **Sound:** all 251 takes and 7 beds placed, with 0 missing and no warnings.
- **Loudness:** −16.7 LUFS with a −2.3 dBFS peak. The only digital silence of 0.5 s or more is the title slate.

| Chapter | Starts | Length | Mix, LUFS (Kokoro v3.1) | Peak, dBFS |
|---|---|---|---|---|
| cold open | 0:03.0 | 24.3 | −18.5 (−18.2) | −4.7 |
| intro (flash-fixed) | 0:27.3 | 30.0 | −17.1 (−16.9) | −4.3 |
| card | 0:57.3 | 2.0 | −37.9 (−37.9) | −27.1 |
| Act One | 0:59.3 | 5:45.4 | −16.8 (−16.7) | −3.4 |
| Act Two | 6:44.7 | 3:13.5 | −16.6 (−16.4) | −4.0 |
| Act Three | 9:58.2 | 2:23.2 | −17.4 (−17.2) | −4.1 |
| Act Four | 12:21.4 | 8:49.2 | −16.4 (−16.3) | −2.3 |
| tag | 21:10.6 | 0:41.3 | −21.7 (−21.7) | −4.7 |
| outro | 21:52.0 | 0:10.1 | −17.1 (−17.0) | −4.1 |

### V4. How to rebuild

```sh
PY=audio/.venv-casting/bin/python
# 1. the takes: el_render.py per segment (set A, dialogue -16 / V.O. -18, --reuse of every earlier EL render, --skip of the
#    lock's 8 cut ids), then el_cut.py (it must follow every render of the v3.1 segments). SEGS="act4" limits it;
#    EXTRA="--retake <id>" adds a listening note's retake.
bash ops/heavy.sh bash audio/ep01/v3-el/tools/render_v31.sh
# 2. the lock, the beds, the manifest, the reel
$PY audio/ep01/v3-el/tools/el_lock.py --lock v31
bash ops/heavy.sh $PY audio/ep01/v3-el/tools/el_bed.py --lock v31
$PY audio/ep01/v3-el/tools/el_lock.py --lock v31 --beds audio/reel/ep01-v31-el/beds.json
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v31-el/ep01-v31-el.manifest.json --jobs 2 --conc 4
```

---

## R. Phase 3: the Mas recast (2026-09-27)

**The brief** (the lead, after the showrunner's listen):
- Recast Mas with an American, neutral accent, and pick the winner by measurement: accent, the 105–125 Hz lane, a calm 110–140 wpm pace, and no clipped tails or artifacts.
- Make an audition file, so the showrunner can overrule the pick.
- Re-render all of Mas's lines with the winner and rebuild the EL-timed timelines, keeping every gap.
- Check the other principals' A voices for a strong non-American accent, and flag any without recasting them.
- The budget is 12,000 characters.

**In short:**
- **The pick: Jeremy - Warm, Trustworthy, Sincere** (shared Voice Library, high-quality; `EwzF7Z2UMSib9JaKx0Kg`), on `eleven_multilingual_v2`. He is now candidate C for Mas, and set A uses him (`set_cand` in `cast-el.json`).
- **The characters:** 4,994 sent and **2,849 billed**, against the 12,000 budget. The subscription went from 9,844 to 12,693 of 131,000.
- **The story:** the EL-timed lock now runs **20:46.6** against the Kokoro lock's 20:39.6 (+7.0 s). It was +22.8 s with Giovanni. §R4.
- **The other principals:** none shows a strong accent. Rima A (Mia) is the lowest, a mild flag for an ear. §R5.
- **The account:** two designed voices are saved to it, so `voice_slots_used` went from 0 to 2. Nothing was cloned.

### R1. Why a label isn't enough, and what was measured

**Labels don't tell you the accent.**
- Giovanni's library labels say `accent: american`, and his description starts "An American male voice".
- His own preview (the owner's recording) measures like any American voice.
- Only the speech ElevenLabs generates from him measures as accented. So every candidate was judged on its rendered lines, never on its label or preview.

**The accent measure** (`tools/mas_recast.py`):
- faster-whisper **small**, the multilingual model, which I downloaded for this (the house small.en can't detect language). Each take is run with the language left to detection, and I read p(en).
- Each voice gets two numbers: the mean of p(en) over its six takes, and its worst take.
- **What calibrates it:**
  - Kokoro's American stock voice (the lock's takes of the same lines): mean 0.985, worst 0.948.
  - **Giovanni, rendered on the same six lines and settings: mean 0.907, worst 0.740.** He is far under everyone else, the one voice the showrunner heard as accented.
- **Tried and not used:** the free-decode log-probability, and the forced log-probability per token of the exact text (§P4's check, here for accent). Neither separated Giovanni from the rest. They are recorded in `mas-recast.json`.

**The same six lines for every candidate:**
- spoken: "it's a preview.", "super.", "ask me when it compiles.";
- V.O.: "gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first.", "alyi set it up. probably just the budget.", "four hundred and six. four hundred and seven. four hundred and six.".
- They are sent in the house spellings (Gurg, Al-yee, Moss), with steady settings the same for everyone:
  - spoken: stability 0.6, style 0, speed 0.95;
  - V.O.: stability 0.65, speed 0.9;
  - both: similarity 0.75, speaker boost on.
- There were no automatic retakes, so the first takes are the measure.

**The candidates:**
- **Evan**, the existing B voice.
- **Five library voices**, from a free screen. The phase-1 pool, with its red-flag screen, filtered to male, `middle_aged`, conversational or educational and one credit per character, leaves 219 voices. The 40 whose descriptions best fit "soft-spoken, calm, measured, conversational, not narrator-polished" were measured on their previews for pitch and accent. The five in the lane with American, calm, conversational descriptions were rendered.
- **Two voice-design voices.** One call to `/v1/text-to-voice/design` (`eleven_multilingual_ttv_v2`), with the description *"American man in his late thirties, soft-spoken and measured, calm and warm, light baritone, plain neutral American accent, conversational, understated, slight smile in the voice."* and the six lines as its text. There was no reference audio. It returned three previews. The two with the highest p(en) were saved as account voices, so they could render with the same model and settings as the rest.
- **eleven_v3** on the best two.

### R2. The ranking

Lower is better. The score adds:
- accent: 1 point per 0.01 of mean p(en) under Kokoro's, and 1 per 0.05 of the worst take under 0.95;
- the lane: semitones outside 105–125 Hz;
- the V.O. pace: 1 point per 10 wpm outside 110–140;
- artifacts: 2 per clipped tail, 1 per line more than 4 st off the voice's own median, 2 if ASR recall is under 0.8.

"Speed for 125 wpm" is the V.O. speed setting that would bring each voice to the middle of the band. ElevenLabs honours 0.7–1.2.

| # | Audition | Voice (source) | Score | p(en) mean / worst (joined) | F0 | V.O. wpm | Spoken syll/s | Clipped tails | Speed for 125 wpm |
|---|---|---|---|---|---|---|---|---|---|
| **1** | **2** | **Jeremy - Warm, Trustworthy, Sincere** (library, HQ) | **2.5** | 0.976 / 0.900 (0.996) | **114.0** | **146** | **3.59** | 0 | **0.77** |
| 2 | 3 | Dennis - Warm, Calm, and Confident (library, HQ) | 6.7 | 0.980 / 0.936 (0.990) | 105.4 | 188 | 4.88 | 0 | 0.60 |
| 3 | 5 | Mike Belkowski (library, prof.) | 7.1 | 0.977 / 0.943 (0.995) | 114.0 | 201 | 5.06 | 0 | 0.56 |
| 4 | 1 | Evan - Calm, Grounded & Reflective (library, HQ; the B voice) | 7.3 | **0.987 / 0.965** (0.999) | 106.8 | 213 | 4.80 | 0 | 0.53 |
| 5 | 8 | mrmas-mas-design-2027-1 (voice design) | 8.3 | 0.975 / 0.933 (0.993) | 107.4 | 170 | 3.85 | **2** | 0.66 |
| 6 | 7 | mrmas-mas-design-2027-2 (voice design) | 8.4 | 0.985 / 0.951 (0.992) | 102.1 | 179 | 3.77 | **2** | 0.63 |
| 7 | 4 | Christian Rivera - Unperturbed, Informed (library, prof.) | 10.3 | 0.985 / 0.963 (0.993) | 107.7 | 233 | 3.88 | 0 | 0.48 |
| 8 | 6 | Brady J – Friendly, Casual, Warm (library, HQ) | 13.1 | 0.965 / 0.843 (0.994) | 104.0 | 228 | 4.76 | 0 | 0.49 |
| — | 2 on v3 | Jeremy, `eleven_v3` | 11.8 | 0.982 / 0.921 | 125.6 | 148 | 5.13 | **5 of 6** | — |
| — | 3 on v3 | Dennis, `eleven_v3` | 14.3 | 0.987 / 0.966 | 99.7 | 164 | 4.23 | **4 of 6** | — |
| ref | — | Giovanni (Mas A, heard as accented) | 12.3 | **0.907 / 0.740** (0.972) | 122.3 | 143 | 3.70 | 0 | — |
| ref | — | Kokoro (the lock's stock voice) | | 0.985 / 0.948 (0.994) | 114.6 | 168 | | | |

**Why Jeremy:**
- **Accent:** every candidate is far from Giovanni and within 0.01–0.02 of Kokoro's American takes. Evan measures the most American, and Jeremy's mean is 0.009 under Kokoro's. His worst take is "Super.", a one-word clip, which every voice scores lowest (Giovanni's was 0.80). Joined, his six lines score 0.996, above Kokoro's.
- **Pace decides it:**
  - Jeremy is the one candidate whose V.O. is near the band at steady settings: 146 wpm, where the others run 170–233.
  - Bringing any other voice into the band would take a speed of 0.48–0.66, below the 0.7 floor ElevenLabs honours.
  - His spoken lines are also the calmest, at 3.59 syllables a second.
- **The lane:** 114 Hz, the middle of 105–125.
- **Clean takes:** no clipped tails, no pitch outliers, and ASR recall 1.0.
- **Against the designed voices:** both clipped two tails out of six, and one sits under the lane.
- **eleven_v3 still isn't usable:** it clipped 4–5 of 6 tails, as in phase 1.

**The audition file:** `out/ep01/full-v3/voices/mas-recast.mp3` (4:43).
- A Kokoro slate (af_heart, a stock American voice) opens it, and another comes before each candidate: "candidate one" and so on. Each is followed by the six lines, with spoken takes at −16 LUFS and V.O. at −18.
- The order is 1 Evan, 2 Jeremy, 3 Dennis, 4 Christian Rivera, 5 Mike Belkowski, 6 Brady J, 7 and 8 the designed voices. Then candidates 2 and 3 on `eleven_v3`.
- The index (number, voice, id, source, settings, measurements, start time) is `audio/ep01/v3-el/mas-recast.json`. The takes are in `audio/ep01/v3-el/mas-recast/<candidate>/`.

### R3. The episode, with Jeremy

**How the settings were set:**
- Candidate C in `cast-el.json`: spoken as in the audition (stability 0.6, speed 0.95).
- **V.O. at speed 0.85,** not the audition's 0.9, to bring his 146 wpm into the band.
- The render is the §P8 command. Everything but Mas was already cached, so only his 75 lines were sent.
- Three retakes: "four hundred and six…" came back as "406. 406.", and two lines were pitch outliers.

**His pronunciation fixes:**
- **Giovanni's fixes now apply only to Giovanni.** "Guhrg", "Noded", "badj", the "…Guhrg" lead-in and "Which one am I." were fitted to his voice, so they moved to `respell_voices` under his voice id.
- **Jeremy renders from the house spellings** and passes every name check with no fix:
  - Gurg +1.8 to +4.6 on eight lines;
  - Macrosoft +3.2 (Kokoro's IPA take: −4.1);
  - badge +8.6;
  - Noted +4.7 and +4.1;
  - GTP-4 +10.7.

**Measured over all 75 lines:**

| | Jeremy (C) | Giovanni (A) | Kokoro |
|---|---|---|---|
| Median F0, spoken / V.O. | 110 / 109 Hz | 121 / 118 | 115 / 115 |
| V.O. pace, 24 lines | **141 wpm** | 130 | 168 |
| Spoken pace (median, lines of 5+ words) | 201 wpm | 186 | 186 |
| Voiced, spoken / V.O. | 71.9 / 78.7 s | 83.4 / 83.1 | 77.8 / 68.9 |
| p(en), his 8 longest spoken lines: mean (worst) | **0.995 (0.983)** | 0.959 (0.879) | 0.990 |
| Clipped tails | 0 | 0 | |

**Worth knowing:**
- **The V.O. runs 141 wpm,** 1 over the band's top. Speed 0.80 would bring it in: about 1,000 characters (the 24 V.O. lines are 988), and about +5 s on the story (78.7 s voiced × 0.85/0.80).
- **His spoken lines are quicker than Kokoro's** (201 against 186 wpm) but, per syllable, the calmest of the candidates.
- **Eight lines sit just outside 100–132 Hz:**
  - five low finals, at 94–99 Hz: "mostly the bill.", "which one's real?", "super.", "everyone." and "okay.";
  - three at 132–135 Hz: "how's the dancing?", "it's a good photo." and "and go to macrosoft.".
- **For an ear:** "That's a lot of desks." was heard as "dasks" (+0.9 over it: narrow). "Equity **in** NopeAI" is heard as "and", as Kokoro's take was.

### R4. The EL-timed lock, rebuilt

`tools/el_lock.py` was run on the new takes, exactly as in §P3: every gap and J-cut lead kept, beats changed only by the takes' lengths.

**The Kokoro lock has changed since phase 2.** The lock pass's d00939d cut the 1993 dialog from the cold open (12 beats → 10, 26.7 s), and 5201f60 retimed Act Two's White House rail. The EL copy follows them. The cut had already been applied by hand to `ep01-v3-el-coldopen.json` in d00939d, and the rebuild reproduces that edit beat for beat.

| Segment | Kokoro lock (now) | EL, Giovanni (phase 2) | **EL, Jeremy** | Jeremy vs Kokoro |
|---|---|---|---|---|
| Cold open | 0:26.7 | (0:30.0, before the cut) | **0:24.3** | −2.4 s |
| Act One | 5:22.5 | 5:37.5 | **5:33.7** | +11.2 s |
| Act Two | 3:24.7 | 3:17.2 | **3:15.9** | −8.8 s |
| Act Three | 2:08.0 | 2:05.3 | **2:04.1** | −4.0 s |
| Act Four | 8:43.8 | 9:02.7 | **8:54.6** | +10.8 s |
| Tag | 0:33.9 | 0:33.7 | **0:34.0** | +0.1 s |
| **Story** | **20:39.6** | 21:06.4 (with the old cold open) | **20:46.6** | **+7.0 s** |

- **Over Acts One to Four and the tag, Jeremy is 14.1 s shorter than Giovanni.** Mas's V.O. is now +9.8 s against Kokoro's (it was +14.2), and his spoken lines are −5.9 s.
- **The story is 1.6 s over the band's top** (19:45–20:45). It was 21.4 s over. The rest of the difference is Tasya A (+11.2 s) and Rima A (+8.6 s), as in §P3.

**The beds** were rebuilt as in §P6.
- **The lock's own cold-open bed predates the cut:** it is still 30.67 s, built at 12:44. So the splice now maps beats by their id against the timeline that bed was built from (62a7f8f, found in git by its length).
- **Beat 3.02 grew from 3.0 to 4.5 s** in the cut, and the moments that followed it in the stem (the 1993 flashback) were cut. So the stem fades over 0.4 s at its old end and holds 1.5 s of room tone at −50 LUFS. When the lock pass rebuilds its cold-open bed, `el_bed.py` will use it directly.

**The reel:** `out/ep01/reel/ep01-v3-el-stick.mp4`, re-rendered with the recast. It replaces the phase-2 file at the same path.
- **Length:** **21:31.8** (the title slate plus the 21:28.8 episode), 105.9 MB, 448 s of wall.
- **Checks:** 31,002 frames, the plan's count; the mixer placed all 228 takes and 7 beds, with 0 missing and no warnings; the whole mix is −16.8 LUFS with a −2.3 dBFS peak; the only digital silence of 0.5 s or more is the title slate.

| Chapter | Starts | Length | Mix, LUFS | Peak, dBFS |
|---|---|---|---|---|
| cold open | 0:03.0 | 24.3 | −18.2 | −4.7 |
| intro | 0:27.3 | 30.0 | −17.1 | −4.2 |
| card | 0:57.3 | 2.0 | −37.9 | −27.1 |
| Act One | 0:59.3 | 5:33.7 | −17.0 | −4.0 |
| Act Two | 6:33.0 | 3:16.0 | −16.7 | −4.3 |
| Act Three | 9:49.0 | 2:04.0 | −17.3 | −3.8 |
| Act Four | 11:53.0 | 8:54.6 | −16.4 | −2.3 |
| tag | 20:47.6 | 0:34.0 | −24.3 | −4.7 |
| outro | 21:21.6 | 0:10.1 | −17.1 | −4.1 |

### R5. The other principals' A voices

Each role's eight longest spoken lines are measured in the EL takes and in the Kokoro lock's takes of the same lines (`audio/ep01/v3-el/ep01/qa/accent-principals.json`). The difference is what matters: Giovanni sits 0.031 under his Kokoro lines.

| Role | A voice | p(en) EL: mean (worst) | Kokoro, same lines | Difference |
|---|---|---|---|---|
| Mas (reference) | Giovanni | 0.959 (0.879) | 0.990 | **−0.031** |
| Mas (the recast) | Jeremy | 0.995 (0.983) | 0.990 | +0.004 |
| Gerg | Marcus | 0.998 (0.996) | 0.991 | +0.007 |
| Alyi | Louis | 0.990 (0.980) | 0.987 | +0.003 |
| **Rima** | **Mia** | **0.984 (0.966)** | 0.997 | **−0.012** |
| Neleh | Alexandra | 0.994 (0.991) | 0.995 | −0.001 |
| Tasya | Tyler Kurk | 0.995 (0.991) | 0.990 | +0.005 |

- **No strong accent in the other principals.**
- **Rima A is the one mild flag:** 0.012 under her Kokoro lines, the only other voice under its counterpart by more than 0.001. Her worst take (0.966) is far from Giovanni's (0.879). She is worth a listen, and she isn't recast.
- **Rima B (Harper) is on file.** Switching her costs about 50 credits (§P9).

### R6. Files and how to redo it

**Files written in this phase:**
- `audio/ep01/v3-el/mas-recast.json` (the index, the measurements and the ranking) and `audio/ep01/v3-el/mas-recast/` (the takes and the design previews);
- `out/ep01/full-v3/voices/mas-recast.mp3`;
- `tools/mas_recast.py`.

**Files changed in this phase:**
- `cast-el.json`: candidate C, `set_cand`, and `respell_voices`;
- `tools/el_render.py`: per-voice fixes and `set_cand`;
- `tools/el_bed.py`: the splice by beat id;
- the Mas takes and `lines-A.json` in `audio/ep01/v3-el/ep01/<seg>/`;
- `show/reel/ep01-v3-el/`;
- `audio/reel/ep01-v3-el/`;
- `audio/ep01/v3-el/usage.json`, under phase 3.

```sh
PY=audio/.venv-casting/bin/python; M=audio/ep01/v3-el/tools/mas_recast.py
$PY $M screen --n 40                    # previews: free
$PY $M add <voice_id> ...               # into the index
$PY $M design --seed 2027               # 3 design previews of the six lines (about 242 credits)
$PY $M save 2027:2 2027:1               # save chosen previews as account voices
$PY $M render --max-chars 2600          # the six lines per candidate (--models eleven_v3 --only a b)
$PY $M accent; $PY $M rank; $PY $M audition
$PY $M principals                       # the accent check of the principals' A voices (free)
```

- **To go back to Giovanni, or to another candidate:** drop `set_cand`, or point it at another letter, then re-run §P8. Only Mas's lines would change.
- **To audition a candidate in the episode without switching:** use `--cand mas-manalt=B --label AmasB` (§P9).

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

> **Superseded by §R4:** the file at this path now has the recast Mas. The figures below are the phase-2 (Giovanni) render.

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
