# fastrec: the fast dialogue recorder

**What it is.** A recorder for the stick-figure reels. It takes a lines JSON, reads **one natural-pace Kokoro take per line** (two or more only for lines you flag), runs the reads **in parallel worker processes**, **resumes** after an interruption, applies the **house trims and levels**, runs the **existing QA**, and writes a lines JSON with durations, word timings, mouth tracks and paths.

The stick reels exist to judge flow and dialogue (showrunner, 2026-09-26: *"we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render"*). One clean, intelligible take per line is enough for that. Choosing between takes is for the lines the showrunner or an audit flags.

Written 2026-09-26 by the `prep-fastrec` pass, from the design in the prep-stick survey (`needs.md` §4, which was in the session scratchpad). It lives here, beside the Act Four recorders it is built from, but nothing in it is specific to Act Four. It works for any episode or segment, and the lead may move it (see "Moving it").

Finished, tested and measured by the `prep-fastrec-r2` pass (2026-09-26, about 22:00–23:15). Version 1.2 adds a clean stop on Ctrl-C or `kill` (also for a run started in the background), workers that exit if the supervisor dies, and the names lexicon applied in any case. The audio method is unchanged. What was measured is under "Measured"; what that pass changed, and what is still open, is under "Handoff".

| File | What it is |
|---|---|
| `fastrec.py` | The CLI: `record`, `merge`, `qa`, `voices`, `plan` (and the internal `_worker`). |
| `house.py` | The per-take method: one whole read, pauses opened in room tone, own onset and decay, handles, loudness, device chains, file checks. A port of `../v5/record_v5.py`'s per-take functions, **bit-identical on the same line, speed and seed** (see "Parity"). |
| `selftest.sh` | The measurements under "Measured", re-runnable: 10-line speed, resume with a flag, stop and resume, no orphans. Writes only into a new folder under the scratch dir you give it. |
| `../../../../../voices/cast.json` (`audio/voices/cast.json`) | The cast registry: speaker label → voice slug, the casting-pass-2 presets, pace bands, a names lexicon. Every Ep1 speaker has a voice (CASTING.md §2, "Pass 2"). |

---

## How to run it

Run from the repo root, with the casting venv (it has Kokoro, faster-whisper, pedalboard, pyloudnorm and librosa):

```sh
PY=audio/.venv-casting/bin/python
T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py

# record every line of a lines JSON into a folder (4 workers, 1 take a line, ASR on)
HF_HUB_OFFLINE=1 $PY $T record --lines <lines.json> --out <out dir>

# only some lines; two takes for flagged ones
HF_HUB_OFFLINE=1 $PY $T record --lines <lines.json> --out <out dir> --ids a5-27-01 a5-29-20 --flag a5-29-20

# re-run the same command after a crash, Ctrl-C or kill: finished lines are skipped, and a line whose audio is done
# but whose ASR never ran gets only its ASR. Stopping (Ctrl-C, or kill <supervisor pid>) stops the workers, merges the
# finished rows into the lines JSON and exits 130; if the supervisor is killed outright, its workers exit on their own.
# force a re-read: --force all   or   --force <id> ...

$PY $T merge --lines <lines.json> --out <out dir>        # rows/ -> <out>/lines.json (record does this itself)
$PY $T qa --out <out dir>                                # the checks again (record does this itself)
$PY $T voices --labels <lines.json>                      # the registry, and any speaker with no voice
$PY $T plan --seg act2 --out <plan.json> [--prev <old plan.json>]   # a draft lines JSON from the Ep1 script

# the self-test (speed, resume + flag, stop + resume, no orphans) into a new folder under a scratch dir
bash audio/ep01/act4/dialogue/tools/fastrec/selftest.sh <scratch dir>
```

### Options that matter

| Option | Default | What it does |
|---|---|---|
| `--workers N` | 4 | Worker processes. Each loads Kokoro and the ASR model **once**. Lines are dealt out longest-first by word count, so shards finish together. |
| `--threads N` | (cores − 2) / workers, max 4 | Torch and ASR threads per worker (3 on this 14-core box with 4 workers). |
| `--takes N` | 1 | Seeds 1..N for every line. Kokoro's seed moves only the vocoder noise, so takes differ a little in texture, not in reading. |
| `--flag id …` / `--takes-flagged N` | 2 | Flagged lines get N takes. A row can also carry `"flag": true` or `"takes": N`. The pick: ASR word recall on non-name words, then no pause cut inside the voice, then the span nearest `est_s`, then UTMOS if on. Alternates go to `takes/<id>/` and are listed in `alt_takes`. |
| `--no-asr` | ASR on | Skips the only automatic misread check (faster-whisper `small.en`, int8). |
| `--asr-beam N` | 1 | Greedy decoding, the fast default. v5 used beam 5. |
| `--utmos` | off | UTMOS22 naturalness per take (`../v5/mos.py`). The audit round. |
| `--prosody` | off | pYIN F0 (`a4lib.analyse`) and a question's final move. Without it the pitch numbers come from a cheap YIN pass, marked `"f0_method": "YIN (fast)"`. |
| `--breaths` | off | The v5 placeholder inhales (audit §3.5 found them uniform and loud on the call chain). Without it a `{b0.5}` pause stays 0.5 s, with no inhale. |
| `--mp3` | off | Level-matched MP3s (`vcast.write_wav_mp3`). |
| `--skip-missing` | off | Records what has a voice and reports the rest. Without it a speaker with no voice stops the run (`NO VOICE: …`). There is never a silent fallback voice. |

---

## Input: a lines JSON

The row format of `audio/ep01/act4/dialogue/lines-v5.json`, so the v5 file itself is a valid input. **Only `id`, `speaker` and `text` are required.** When present, these are used:

| Key | Use |
|---|---|
| `say` or `spoken_as` | What Kokoro reads, with the v5 markup: `{0.35}` a total pause at that word boundary (opened in room tone inside the one read), `{b0.45}` the same with an inhale (with `--breaths`), `{s0.3}` two separate whole reads 0.3 s apart, `[Word](/ipa/)` a pronunciation, `[word](-1)` a stress demotion. Defaults to `text`. |
| `speed`, or `pace.intended.speed` | Kokoro speed. If absent: the centre of the speaker's band. |
| `device` | `call` / `monitor` (the call filter, `record_32.call_filter`), `laptop` (the laptop speaker, −22 LUFS), `pa` (a hall PA, new), `tv` (a TV speaker, new). The dry read goes to `clean/`. |
| `kind: "vo"` or a `(V.O.)` label | The V.O. preset and −18 LUFS. |
| `voice_slug`, `speaker_slug`, `speaker_label` | Voice lookup (see "Voices"). |
| `trail` (or an Act Four row's `interrupt`) | An interrupted line: read complete, delivered trailed (the v5 method: −8 dB from the cut-in, out over 150 ms). The complete read goes to `complete/`. |
| `derived_from`, `reused_from` | No new read. A reuse copies the source's new take. A derived line is the source's take through the laptop chain (record_v5's laptop "super."). The source must be in the same run. |
| `est_s`, `placement` or `gap_before_s`, `delivery`, `tag`, `shot`, `scene`, `on_camera`, `room`, `cue`, `pov`, `side` | Carried through to the output unchanged. |
| `bh` | 1 = an inhale before the first word (with `--breaths`). |

**Joined pairs** (Act Four's `a5-29-11`/`a5-29-12`, cut from one read in v5) are read as two separate reads by fastrec. The row says so (`joined_note`).

## Output

In `<out>/`:

| Path | What |
|---|---|
| `lines.json` | One row per line, in input order, with **every key of a lines-v5 row in lines-v5 order**, then extras (`clean`, `complete`, `interrupt`, `speaker_label`, `fast`), then `breaths`, `opened_pauses`, `alt_takes`. `status` is `"fast"`. What fast mode doesn't measure is `null` (the UTMOS fields without `--utmos`, `mp3` without `--mp3`, `final_move_st` without `--prosody`). |
| `wav/<id>.wav` | The delivered take: 48 kHz / 24-bit mono. |
| `clean/<id>.wav`, `complete/<id>.wav`, `takes/<id>/s2.wav` | Only when a device chain, a trail or extra takes were used. |
| `rows/<id>.json` | One row per line, written atomically the moment the line is done. This is what makes resuming work. `<id>.error.json` records a line that failed; the shard carries on. |
| `log/shard-<k>.log` | Per line: speaker, span, wpm, takes, wall time, and what ASR heard. |
| `qa/run.json` | Lines, takes, workers, wall time, **takes per minute**, per-line wall time. |
| `qa/fastrec-qa.json`, `reel/sc<N>-fast-stringout.mp3` | The generic QA (below) and a dialogue string-out per scene. |
| `qa/qa-v5.json`, `qa/qa_v5.log`, `reel/sc<N>-stringout.mp3` | `qa_v5.py`'s own output, when it runs. |
| `tmp/` | The job file, the ASR scratch WAV and `TMPDIR` for the workers. Safe to delete. |

Paths inside the rows are repo-relative when `--out` is inside the repo (as `lines-v5.json` writes them) and absolute when it isn't (a scratch run). Every consumer so far does `os.path.join(REPO, row["file"])`, which accepts both.

### Where outputs should go (org plan §2)

Takes are audio sources, so they belong under `audio/<area>/`. For the Ep1 segments: `audio/ep01/<seg>/dialogue/fast-v1/` (with the lines JSON as `audio/ep01/<seg>/dialogue/lines-fast-v1.json`, via `--lines-out`). The org plan's §2 table allows that without a new top-level folder. The dialogue WAVs are git-ignored (`audio/ep01/**/*.wav`).

---

## What it does to each line (the house method)

`house.py` is a port of `../v5/record_v5.py`'s per-take functions, with the same constants:

1. **One whole Kokoro read** at the line's speed (the plan's, or the centre of the speaker's band). No time-stretch, no carrier, no splice.
2. **Pauses opened inside the read** to their intended length, at the quietest 5 ms of Kokoro's own stop, with 8 ms crossfades. The gap is **room tone** (a pink-noise bed at −62 dBFS under the whole file), never digital black. Where Kokoro ran the words together, the cut is shaped as a decay and an onset, and the row flags it for the ear.
3. **Its own onset and decay kept:** at least 0.15 s before the first sound, decay to −60 dB re peak plus 0.10 s, and **0.35 s room-tone handles** at each end.
4. **Levels:** one static gain to **−16 LUFS** (V.O. −18, laptop −22), measured on the finished file with its bed; **true peak ≤ −1.5 dBTP** (the pipeline's limiter only on a peaky read).
5. **Device chain** after the level, when the row has one; the dry read is kept in `clean/`.
6. **Word timings** carried from Kokoro's tokens through every edit, and **mouth cues** (`a4lib.mouth_cues`) for on-camera and monitor lines.

### What fast mode drops, by default (all from v5)

Alternate seeds and speeds, text variants, the echo search, the dots/split/keep re-reads, the plain-read UTMOS pairing, the v4 comparisons, MP3s, the clean/nobreath/complete variants except where needed, and the placeholder inhales. Each one can come back with a flag (`--takes`, `--utmos`, `--mp3`, `--breaths`, `--prosody`).

### Parity

**Checked 2026-09-26, bit for bit:** four Act Four lines (a call line, a V.O. line, a line with an inhale and a 0.9 s opened pause, and a plain one) gave **identical audio** (maximum absolute sample difference 0.0) through `house.speech_multi` + `house.dress` and through `record_v5.speech_multi` + `record_v5.dress`, at the same speed and seed. The voice presets fastrec builds matched `record_32.voices_32()` on blend and chain for those speakers, and the call and laptop chains match `record_32.call_filter()` and `cast_a4.laptop_speaker()` (`house.check_parity_of_device_chains()` returns `[]`). The check script was `parity.py` in the pass's scratch folder; to re-run it, import both modules and compare `dress(...)["deliv"]` on any line.

Two guards were added, and neither changes a valid line: a pause marker before the first word or after the last is ignored, and a slice that could start before 0 is clamped.

---

## The QA it runs

1. **`qa_generic` (always).** The hard checks of `../v5/qa_v5.py`, applied to any lines JSON:
   - format 48 kHz / 24-bit mono; loudness within ±0.1 LU of the row's target; true peak ≤ −1.5 dBTP; 0 clipped samples;
   - no digital black (exact zeros ≥ 10 ms); room-tone handles ≥ 0.30 s at both ends; speech ≥ 0.12 s into the file;
   - a natural decay at the end (≥ 20 ms, except trailed lines); Kokoro speed inside the band ±0.05; mouth tracks well formed.

   And its ear flags: ASR missed a non-name word; a pause opened while the voice still sounds; articulation outside the speaker's guide; a question with no final lift (with `--prosody`). It writes `qa/fastrec-qa.json` and a dialogue string-out per scene.
2. **`qa_v5.py` itself, unchanged**, when every id is an Act Four v5 plan id (it reads `../v5/plan_lines.json`). `fastrec` points it at the new lines JSON with `V5_LINES` and `V5_QA_OUT`, so it never touches `lines-v5.json`. It adds per-character pace, pace stability in a scene, and the conversations' talk time against the plan. It is skipped when the run includes `a5-29-12` (its string-out code needs the v5 joined read). Without `--prosody`, its yes/no check flags every yes/no question with "no clear final lift (None st)": that means *not measured*, not *failed*.

---

## Voices

`audio/voices/cast.json` maps each **speaker label** (as the script writes it, `NEDIB`, `A SENATOR (O.S.)`, `LAHTNEMULB (THE CLONE)`, or a display name such as `MAS MANALT`) to a **voice slug**. The presets come from three places, in this order:

1. `cast.json` `voices`: the casting-pass-2 picks and the derived gloss voices (CASTING.md §2, "Pass 2").
2. The Act Four production presets: `cast_a4.RETURNING` plus `cast_a4.NEW_PICKS` (what `record_32.voices_32()` and `record_v5` use), including `mas-manalt-vo`.
3. The pass-1 picks in `audio/voices/tools/cast.py` with their rooms stripped, for NOLE, NESNEJ, RUMPT and THE INTERN.

`(O.S.)` in a label changes only the camera, not the voice; `(V.O.)` picks the `-vo` preset. Pace bands come from `../v5/lines_v5.BANDS`, then `cast.json` `bands`. A label with no voice or no band is an error. `fastrec voices` prints the whole registry.

## `plan`: a draft lines JSON from the script

`fastrec plan --seg coldopen|act1|act2|act3|act4|tag` parses the Ep1 script's speaker blocks (`**NAME** *(paren)*\` + text + backtick tag) into rows with stable ids (`e1-a2-15-03`). It sets:
- `say`: with the lexicon (`cast.json` `lexicon`) applied in any case, keeping the script's spelling (`gnib` becomes `[gnib](/ɡənˈɪb/)`), stage directions out, and `*(beat)*` turned into `{0.6}`;
- `delivery`: from the parentheticals;
- `device`: `monitor`, `pa` or `call` when the parenthetical says so (`call` for "on the call" or "phone", but not "on his/her phone"; check these by hand);
- `gap_before_s`: a placeholder, 0.7 s on a change of speaker and 0.35 s on the same speaker; `null` (follows picture) at a scene's first line;
- `est_s`: 0.4 s plus words ÷ 2.6.

With `--prev <old plan>` it keeps the ids of lines that still match (difflib ratio ≥ 0.6 in the same scene), and prints what was added, changed and dropped. **The plan is a draft:** the gaps, speeds and devices are placeholders for the stick-plan pass to set. Measured on the script at about 16:45 on 2026-09-26: cold open 4 lines, Act One 58, Act Two 41, Act Three 22, tag 2 (127 lines, 962 words), and Act Four 105. At 22:27, with the scene-craft pass still editing: cold open 4 (36 words), Act One 57 (542), Act Two 41 (312), Act Three 22 (159), tag 2 (2): 126 lines, 1,051 words, every label with a voice.

---

## Measured

Everything below is a measurement. Nothing was heard.

**The machine, and why the numbers are pessimistic.** 14 logical CPUs (an Intel Core Ultra 7 255U laptop part: 12 cores, only 2 of them performance cores), shared with other passes that were rendering (Remotion, Blender). The load average was **17–48 during every run below**, so every timing is for a busy machine. An idle machine should be faster, but that wasn't measured.

### Speed

**The 10-line Act Four test** (the pass's acceptance test). The lines were `a5-26a-01 a5-27-01 a5-27-02 a5-27-19 a5-27-31 a5-27-32 a5-29-20 a5-29-21 a5-29-22 a5-29-23`: 5 voices plus the Mas V.O., 2 lines on the call chain, 103 words and 36.5 s of voiced speech. Defaults: 4 workers × 3 threads, 1 take a line, ASR on.

| Run | Tool | Load (start → end) | Record phase | **Takes a minute** | Whole command, with QA |
|---|---|---|---|---|---|
| `prep-fastrec-r2` t10, 22:06 | 1.1 | 24 → 31 | 84.1 s | **7.1** | 103 s |
| `prep-fastrec-r2` `selftest.sh` step 1, 22:51 | 1.2 | 27 → 32 | 194.4 s | **3.1** | about 200 s |
| `prep-fastrec-r2` `selftest.sh` step 1, 23:01 | 1.2 | 17 → 24 | 126.2 s | **4.8** | about 150 s |
| `prep-fastrec` test10, 17:22 | 1.0 (one ASR call a line) | 14 → 18 | 98.0 s | 6.1 | 119 s |
| `prep-fastrec` t11, 18:06 | 1.1 | 49 → 38 | 146.1 s | 4.1 | 189 s |

- **The same 10 lines ran 2.3 times slower 45 minutes later at a similar load average** (Kokoro loads of 40–42 s against 14–17 s; ALYI's 7.85 s line took 48 s against 25 s). The load average is a coarse measure of what the other passes were doing, so read these numbers as a range: **3–7 takes a minute for this test on this shared machine.**
- In t10 each worker loaded Kokoro in 14–17 s (the four in parallel). Summed over the workers, reading (Kokoro plus the house method) took 134.5 s and ASR 69.2 s (5 packed calls for 11 items; 1 line was re-checked alone). Per line: median 17.9 s, max 45.1 s. The largest worker peaked at 2.27 GB RSS.
- **A bigger batch:** all 42 current lines of the 18 pass-2 voices (349 words, 107 s of voiced speech; CASTING.md §2 "Pass 2") in **564.6 s, 4.5 takes a minute**, at load 32–39. Summed over the workers: reading 1188.7 s, ASR 539.5 s (17 calls for 46 items). 0 file problems. Peak RSS 2.38 GB for the largest worker.
- **Lines, not takes, are what got faster.** The v5 recorder wrote 478 takes for 98 lines in about 70 min (about 6.8 takes a minute, but 4.9 takes a line, so about 1.4 lines a minute). fastrec reads 1 take a line, 4 at a time: 3.1–7.1 lines a minute on this busy machine, about 2–5 times the v5 rate in lines.
- **Where a take's time goes** (one line, one process, 3 threads, load about 30, cProfile): about 95 % is Kokoro's vocoder (iSTFTNet `conv1d`), 14.6–22.7 s for a 7–8 s line. The whole house method (the chain, opening pauses, the loudness loop, the measures, mouth cues, YIN, the file checks) took 0.6–1.9 s. `torch.set_flush_denormal(True)` changed neither the speed nor a single sample. So the only real levers are the number of workers and the number of takes; ASR is the next cost (about a third of the worker time), and `--no-asr` removes it.
- **Estimate for the rest of Ep1** (cold open, Acts One–Three, tag: 126 lines, 1,051 words at 22:27): **about 15–35 min wall** at 4 workers on this machine when it is as busy as it was here (0.8–1.9 s of wall a word across the three runs above: 1,051 words × 0.82–1.89 s), plus about 1 min for QA. Not measured on an idle machine.

### Resume, flags, stopping

- **Resume and a flag** (t10 again, with `--flag a5-29-20`): 9 lines skipped (same key), 1 re-read with 2 takes. `s2` was picked, `s1` went to `takes/a5-29-20/s1.wav` and `alt_takes`, and the two takes got separate ASR windows (a window never holds the same words twice). 178 s at load 42–45.
- **Stopping and resuming** (`selftest.sh` step 3; the same result in two runs, 22:34 and 23:05): SIGINT to the supervisor of a background run with 2 of 6 rows done. It exited 130 within 7 s, with 0 workers and no lock left, and `lines.json` held the 2 finished rows. The same command again reported "4 to record, 0 already done, 2 need ASR only", finished with exit 0, and gave 6 rows.
- **No orphans** (step 4, two runs): after a SIGKILL of the supervisor, its 2 workers were gone within 3 s.
- The first `selftest.sh` run (22:51) showed that steps 3 and 4 were signalling a shell subshell rather than the supervisor, which is a bug in the test script, not in the tool. The script was fixed (an array, not a function) and the 23:01 run passed all four steps.
- **Before 1.2**, a SIGINT sent to a run started as a background job was ignored: the shell starts background jobs with SIGINT ignored, and Python then installs no handler. The run went on to the end (measured 22:24–22:31). That is why 1.2 installs its own SIGINT and SIGTERM handlers.

### The takes

- **Same audio as v5.** On the 10 test lines the voiced span matched the v5 take within 0.02 s and the words-per-minute within 1, at the same speeds. The files are 0–0.43 s shorter, because fastrec adds no placeholder inhale before the first word by default (v5 did). The earlier bit-for-bit check is under "Parity".
- **QA on the 10 lines:** 0 problems. 6 ear flags: 3 pauses opened while the voice still sounds (after "Wow", "Mas" and "Yes"), and 3 articulation rates outside the guide (MAS V.O. "i don't keep... score." 2.41, MARIO 6.11, TASYA 5.13). `qa_v5.py` also ran unchanged, with exit 0 and the same flags, plus 1 "question lift not measured" (without `--prosody`).
- **ASR** heard every non-name word on all 10 lines (recall 1.0). "Mas" comes back as "Moss", which is a name and so is excluded.

## Not verified, and open issues

- **Nobody has listened.** ASR, loudness and the file checks prove a take is clean, level and intelligible. They don't prove it is natural, well timed or in character.
- **Speed on an idle machine** isn't measured. Every timing here was taken with the load average at 14–48 on 14 logical CPUs (other passes rendering).
- **Memory:** the largest worker peaked at 2.27–2.38 GB RSS (Kokoro plus ASR), so 4 workers need about 9–10 GB free.
- **ASR false misses on numbers.** `word_recall` spells 0–12 only, so "forty-seven" heard as "47" is flagged. Read the flag's text before re-reading a line.
- **Joined pairs** are read as two reads, not one.
- **The `pa` and `tv` chains are new** (the call and laptop chains are the v5 ones). They're conservative, but nobody has heard them.
- **`plan`'s gaps, devices and speeds are placeholders.** The stick-plan pass sets them.
- **Moving it.** The tool finds the repo from its own location (`../../../../..`). If the lead moves it (for example to `audio/voices/tools/` or `audio/dialogue/`), fix `TOOLS` and `REPO` at the top of `house.py` and `fastrec.py`. It imports `a4lib`, `lines_v5`, `mos`, `cast_a4`, `cast` and `vcast` read-only.

---

## Handoff (`prep-fastrec-r2`, 2026-09-26, about 22:00–23:15)

**What this pass found.** The `prep-fastrec` pass had built the tool, the house method, the cast registry and casting pass 2, but stopped before the last round of tests (its final edit to `fastrec.py`, the ASR packing guard, had never been run) and before filling "Measured". CASTING.md hadn't been updated with the pass-2 picks.

**What this pass changed.**
- `fastrec.py` 1.1 → **1.2**. A clean stop on Ctrl-C or `kill`, also for a background run (see "Measured"); workers that exit when the supervisor dies (`prctl(PR_SET_PDEATHSIG)`, Linux); a stopped run merges its finished rows; and `plan` applies the lexicon in any case, keeping the script's spelling. The audio method and the resume key (`KEY_VERSION`) are unchanged, so earlier takes still resume.
- `selftest.sh` (new): the measurements above, re-runnable into a scratch folder.
- `audio/voices/cast.json` `lexicon`: added CHATGTP ("chat-G-T-P", naming.md §9) and GNIB ("guh-NIB", proposed: naming.md §9 has no entry yet).
- `audio/voices/CASTING.md`: the pass-2 picks, measurements, auditions and open issues (§2, "Pass 2"), plus pointers in the header and §3.
- The README sections "How to run it", `plan`, "Measured", "Not verified" and this handoff.

**Verified (measured):** 10 Act Four lines at 3.1–7.1 takes a minute (three runs, load 17–32; `selftest.sh` passed all four steps at 23:01); resume, flag, stop and no-orphan behaviour; all 42 current lines of the 18 pass-2 voices read clean (0 file problems); every Ep1 speaker label resolves to a voice (at 22:27, and at 23:10 on the script as saved at 22:48).

**Not verified:** anything by ear; the speed on an idle machine; the whole-episode run.

**Next steps.**
1. After the scene-craft pass finishes: `fastrec plan --seg <seg> --out show/episodes/ep01/production/<seg>/lines-plan-v1.json` for each segment (with `--prev` from then on, so the ids hold). The stick-plan pass then sets the gaps, devices and speeds, and checks the draft's `call` devices by hand.
2. Record into `audio/ep01/<seg>/dialogue/fast-v1/`, with `--lines-out audio/ep01/<seg>/dialogue/lines-fast-v1.json` (org plan §2).
3. Give RUMPT, THE INTERN and THE ORB a pace band in `cast.json` before recording Ep2 or Ep3 lines for them.
4. Have the room lock GNIB's pronunciation (and add it to naming.md §9).

**Scratch** (temporary, not needed to re-run anything): the test runs, the profiler and the benchmark scripts are in the session scratchpad under `prep-fastrec-r2/`. `selftest.sh` re-makes the measurements.

