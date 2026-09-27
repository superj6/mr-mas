# Ep1 stick reel v2: ACT THREE (sc 18–23, "verified: human")

| | |
|---|---|
| **What this is** | The handoff for Act Three's chapter of the full Ep1 stick reel (`ep01-full-v2`): the recorded lines, the stick timeline, the act's temp sound stem, a test render, the measurements, and what the script leaves open for staging. |
| **Latest: the clarity pass (2026-09-27, 03:05 →)** | **Start at [§11](#11-clarity-pass-ep1s-act3fix-2026-09-27).** It fixed, in Act Three only, what the newcomer, insider and audit reads of `ep01-full-v2.mp4` found: attributions for the monitor items, three reworded lines, Tasya's laugh, and the crane pre-lap that stopped dead at the Act Four cut. The act is now **2:33.7** (3,688 frames, 22 lines). Sections 0–10 below are the first build; where §11 changed a number or a fact, the section carries a "(clarity pass: …)" pointer. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1" and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". Fully programmatic: stock Kokoro voices as cast in `audio/voices/CASTING.md` (no clones), no external APIs, `.env` untouched. The lead's call on length: build at the current length, the showrunner marks where it drags, then we cut. So this pass fixed clarity and naturalness only; the cuts in §9 are proposals, none made. And, 2026-09-27: "try not to cook/freeze my laptop": every recording and render here went through `ops/heavy.sh`, at 2 fastrec workers and 2 render jobs × 2 tabs. |
| **Who, when** | The `ep1s-act3` pass. First sitting 2026-09-26 ≈ 23:45 → 2026-09-27 01:11: the plan, the first takes (4 workers), a pace trial, the r2 re-reads and the timeline builder. That session died at 01:11, mid-merge, most likely in the overload that froze the laptop. Second sitting 01:13 → ≈ 01:40: the r2 rows checked and merged, the r3 re-reads, the staging fixes, the sound stem, the test renders and this file. |
| **State** | Ready for the lead to paste into `show/reel/ep01-full/ep01-full-v2.manifest.json` (§5.3). **Blocker shared with the other chapters:** `studio/src/reel/sync.mjs` copies only `show/reel/*.json`, so it doesn't see `show/reel/ep01-full/` (§10). Nothing committed. `show/episodes/ep01/script.md` was not edited. *(Clarity pass: the chapter and bed are already in the manifest, unchanged; sync now reads `show/reel/ep01-full/`, but the real `studio/src/reel/data/ep01-act3-v2.json` is the pre-fix copy until the lead re-syncs; the script's `## ACT THREE` was edited with the Edit tool, see §11.)* |
| **Honesty** | I can't watch or listen. Every number here is a tool's measurement (fastrec's QA, the builder, the stem's QA, the episode tool, PyAV). What I say about how frames read comes from stills; nothing about how anything sounds has been heard. |

---

## 0. The short version

*(Clarity pass numbers, which replace the ones below: **2:33.67** (3,688 frames), 41 beats, **22 lines, 147 words**, 46.1 s of speech (30 %), median 5.5 words a line, 7 of 22 lines ≤ 3 words; longest conversation unchanged (Gerg's call 25.9 s, 8 lines; NEDIB's signing 15.2 s); longest stretch with no voice **25.9 s** (sc 19 items 1–3, now carrying their attributions). Details in §11.)*

- **Runtime: 2:28.0** of reel for Act Three (3,552 frames at 24 fps), in 41 beats and 33 camera setups. The script prints 2:18 and estimates ≈ 2:49.5 as played; the reel plays ≈ 21.5 s under that estimate at recorded pace (§7).
- **21 voiced lines, 142 words**, 44.3 s of speech (30 % of the act). **Median 6 words a line**; 6 of the 21 lines are three words or fewer (Mas's replies to a witness that never speaks, by design: see the script's act header).
- **Longest conversation: Gerg's call (sc 20), 25.9 s, 8 lines**, with the edit insert (the call's one cut, a 4.2 s gap between lines) inside it. The longest run with every gap ≤ 2.5 s is NEDIB's signing (sc 21), 15.2 s, 4 lines.
- **Longest stretch with no voice: 24.5 s**, the first half of the monitor run (sc 19, items 1–3: the poster, the two-letters chyron, the pinky promise). It's carried by MM-01, the on-screen text and the SFX in the stem. It's the first place I'd look for drag (§9).
- **Takes:** 21 lines, one take each and two for the 7 lines that carry a scene. Re-read twice for pace (the r2 and r3 rounds, §3). The final QA shows 0 file problems and 7 flags for the ear.
- **Test render:** Act Three alone as an episode chapter, with the stem as its bed and the takes laid by the mixer. See §6 for what was measured.

---

## 1. Files

| What | Where |
|---|---|
| Line plan: `fastrec plan --seg act3`, then speeds, pauses, devices and flags set by hand. Each changed row carries a `recnote` and `notes` | `audio/ep01/act3/dialogue/lines-plan-v2.json` (21 rows; the typed post "Agi has been achieved internally" is on-screen text, not a voiced line, so it's left out) |
| Takes and QA | `audio/ep01/act3/dialogue/fast-v2/`: `wav/` (delivered), `takes/` (alternates), `clean/` (dry reads of the call and monitor lines), `rows/`, `log/`, `qa/fastrec-qa.json`, `qa/runs.jsonl`, `reel/sc18…sc22-fast-stringout.mp3`. The WAVs are git-ignored |
| Lines JSON with the measured takes (durations, word timings, mouths) | `audio/ep01/act3/dialogue/lines-fast-v2.json` |
| **Stick timeline** (`"dialogueReel": true`) | **`show/reel/ep01-full/ep01-act3-v2.json`**: 41 beats, 21 lines, 53 `sounds` |
| Timeline builder (the shot plan in `SPEC`, the gaps in `GAPS`, the SFX in `SOUNDS`) | `audio/reel/ep01-act3-v2/build_timeline.py`. It writes the JSON, `measure.json` and `transcript.md` (every beat and line as laid, with gaps) beside it |
| **Temp sound stem** (room, LED ticks, MM-01, a THE CLOCK temp, 53 SFX) | `audio/reel/ep01-act3-v2/act3_bed.py` → `act3-bed.wav` (149.0 s, git-ignored) + `act3-bed-qa.json` |
| Manifest part (chapter + bed), and the one-chapter test manifest | `audio/reel/ep01-act3-v2/manifest-part.json`, `audio/reel/ep01-act3-v2/test.manifest.json` |
| Test render + sidecars + contact sheet | `out/ep01/reel/segments/ep01-act3-v2-test.mp4` (+ `-chapters.json`, `-measure.json`, `-sheet.png`) |
| This note | `show/episodes/ep01/production/stick/act3-notes.md` |
| Scratch (temporary: the test manifest, the stills, the render work dir, a scratch copy of the studio used to render without touching `studio/src/reel/data/`) | `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-act3/` |

## 2. How to re-run it (from the repo root unless marked)

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
# 1. after a script change: a new draft plan, keeping the ids; then carry the say/speed/flag edits over by hand
HF_HUB_OFFLINE=1 $PY $T plan --seg act3 --out <scratch>/plan-now.json --prev audio/ep01/act3/dialogue/lines-plan-v2.json
# 2. record (resumable: lines with an unchanged key are skipped; Ctrl-C or kill stops cleanly; the same command resumes)
ops/heavy.sh env HF_HUB_OFFLINE=1 $PY $T record --lines audio/ep01/act3/dialogue/lines-plan-v2.json \
  --out audio/ep01/act3/dialogue/fast-v2 --lines-out audio/ep01/act3/dialogue/lines-fast-v2.json --prosody --workers 2
# 3. the timeline (+ measure.json, transcript.md), then the stem, which is timed from the timeline, so rebuild both together
python3 audio/reel/ep01-act3-v2/build_timeline.py
$PY audio/reel/ep01-act3-v2/act3_bed.py
# 4. a one-chapter test render (run from studio/, after the timeline is synced into studio/src/reel/data/: see §10)
ops/heavy.sh node src/reel/tools/episode.mjs <act3-test.manifest.json> --jobs 2 --conc 2 --work <scratch>/w --out <scratch>/act3.mp4
```

The test manifest is the manifest part (§5.3) as the only chapter and bed, with `"titleCard": 0`. I rendered it from a scratch copy of `studio/` (`src/` copied, `node_modules` and `public` symlinked, `audio/` symlinked beside it) with `--no-sync`, so the real `studio/src/reel/data/` was never written.

---

## 3. The takes

**Voices** (from `audio/voices/cast.json`, stock Kokoro and its blends, no clones): MAS `mas-manalt` (V.O. preset for the V.O. line), GERG `gerg-mockbran` (`am_puck`, on the call chain), NOLE, REMUHCS, NEDIB (the two DEEPFAKE NEDIBs use NEDIB's voice at a slightly faster speed), TASYA. Every speaker label resolved; `plan` printed "labels with no voice: none".

**Devices.** Gerg's five lines use `call` (the script's "(filter)"). REMUHCS, NOLE, NEDIB, the copies, TASYA and Mas's DevDay question use `monitor` (they play on his monitor). The V.O. line uses the V.O. preset at −18 LUFS.

**Runs** (`qa/runs.jsonl`; the load average is at the end of each run):

| Run | When | What | Workers | Wall | Rate | Load |
|---|---|---|---|---|---|---|
| r1 | 09-26 23:52 | all 21 lines, 27 takes | 4 | 194 s | 8.3 takes/min | 35 |
| pace trial (scratch) | 23:59 | 11 trial reads at other speeds | 4 | 298 s | 2.2 takes/min | 66 (the overload) |
| r2 | 09-27 01:08–01:11 | 6 re-reads + 4 ASR-only rows | 4 | interrupted before the merge (the session died); all 10 rows were on disk, and a dry key check at 01:15 found all 21 rows current | — | — |
| r3 | 01:17 | 3 re-reads (5 takes) | 2 | 22 s | 13.6 takes/min | 9 |
| r3b | 01:19 | 2 re-reads (3 takes) | 2 | 18 s | 10.0 takes/min | 12.5 |

**What was re-read, and why.**
- **r2 (for pace against the character guide):**
  - 18-02 (V.O.): speed 0.915 → 0.85. Articulation went from 4.84 to 4.23 syll/s (guide 3.4–4.0).
  - 19-02 (NOLE): 1.04 → 0.95, the lowest speed QA allows (the band floor less 0.05), plus a pause. 6.59 → 6.19 syll/s.
  - 20-03: 0.88.
  - 20-04, 20-07 (GERG): pauses between the sentences, at the band floor. First reads were 272 and 270 wpm.
  - 21-01 (NEDIB): a pause after "folks." and at the list commas. It was 223 wpm.
  - 21-03: a pause between its two sentences. It was 207 wpm.
- **r3 (turn pace far off the guide on a line of 4+ words; the PANEL-HOST-style rush the prep check found):**
  - 20-02 "Mas, did you just post on Tidder?": 257.7 → 238.6 wpm. The comma pause went 0.15 → 0.25 s, and the speed to 1.02.
  - 21-04 "When the hell did I say that?": 271 → 200 wpm, at speed 0.88, read as two whole reads 0.15 s apart (`{s0.15}` after "hell"). An opened pause cut into the voice there (Kokoro joined "hell did", dip −14.8 dB), so the split replaced it.
  - 20-08 "go to sleep, gerg.": 196.7 → 173.9 wpm, a 0.20 s pause at the comma, 2 takes.
  - 20-05: "Okay." as its own read (`{s0.20}`). The opened pause had cut into the voice there (dip −14.0 dB).

**Final takes** (`lines-fast-v2.json`; "speech s" is the voiced span, wpm and syll/s against the speaker's guide):

| id | speaker | words | speech s | wpm (guide) | syll/s (guide) | speed | takes |
|---|---|---|---|---|---|---|---|
| `e1-a3-18-01` | MAS | 1 | 0.69 | 87 (135–155) | 1.45 (3.6–4.2) | 0.915 | 1 |
| `e1-a3-18-02` | MAS (V.O.) | 6 | 2.13 | 169 (120–140) | 4.23 (3.4–4.0) | 0.85 | 1 |
| `e1-a3-18-03` | MAS | 3 | 0.97 | 186 (135–155) | 3.09 (3.6–4.2) | 0.915 | 2 |
| `e1-a3-19-01` | REMUHCS | 6 | 2.17 | 166 (145–165) | 4.61 (4.2–4.8) | 0.87 | 1 |
| `e1-a3-19-02` | NOLE | 8 | 2.25 | 213 (165–185) | 6.19 (4.8–5.6) | 0.95 | 1 |
| `e1-a3-20-02` | GERG | 7 | 1.76 | 239 (175–200) | 5.33 (5.0–5.8) | 1.02 | 1 |
| `e1-a3-20-03` | MAS | 3 | 1.22 | 148 (135–155) | 4.10 (3.6–4.2) | 0.88 | 2 |
| `e1-a3-20-04` | GERG | 17 | 4.19 | 243 (175–200) | 5.03 (5.0–5.8) | 1.02 | 1 |
| `e1-a3-20-05` | GERG | 13 | 3.99 | 196 (175–200) | 5.43 (5.0–5.8) | 1.06 | 1 |
| `e1-a3-20-06` | MAS | 4 | 1.14 | 210 (135–155) | 3.51 (3.6–4.2) | 0.915 | 2 |
| `e1-a3-20-07` | GERG | 13 | 3.58 | 218 (175–200) | 4.79 (5.0–5.8) | 1.02 | 1 |
| `e1-a3-20-08` | MAS | 4 | 1.38 | 174 (135–155) | 3.33 (3.6–4.2) | 0.915 | 2 |
| `e1-a3-20-09` | GERG | 3 | 0.81 | 222 (175–200) | 4.94 (5.0–5.8) | 1.06 | 2 |
| `e1-a3-21-01` | NEDIB | 22 | 6.85 | 193 (145–165) | 4.10 (4.2–4.8) | 0.93 | 1 |
| `e1-a3-21-02` | DEEPFAKE NEDIB | 6 | 2.24 | 161 (145–165) | 4.91 (4.2–4.8) | 0.97 | 1 |
| `e1-a3-21-03` | DEEPFAKE NEDIB #2 | 7 | 2.31 | 182 (145–165) | 4.46 (4.2–4.8) | 0.97 | 1 |
| `e1-a3-21-04` | NEDIB | 7 | 2.10 | 200 (145–165) | 3.59 (4.2–4.8) | 0.88 | 2 |
| `e1-a3-21-05` | MAS | 2 | 0.78 | 154 (135–155) | 2.56 (3.6–4.2) | 0.915 | 1 |
| `e1-a3-22-01` | MAS | 5 | 1.80 | 167 (135–155) | 4.44 (3.6–4.2) | 0.915 | 1 |
| `e1-a3-22-02` | TASYA | 4 | 1.17 | 205 (125–145) | 3.42 (3.8–4.4) | 0.92 | 1 |
| `e1-a3-22-03` | MAS | 1 | 0.73 | 82 (135–155) | 2.74 (3.6–4.2) | 0.915 | 2 |

**How to read the pace columns.** On lines of one to four short words the turn wpm is inflated by the monosyllables. Syllables a second is the better guide there, and on those lines it's at or under the guide. The Gerg lines still over 200 wpm sit inside his articulation guide. His guides are "quick" by design, and the call's feel is two fast-talking night owls.

**QA, final (0 problems, 7 flags for the ear):**
- 19-02 NOLE: 6.19 syll/s against 4.8–5.6. This is already at the lowest speed QA allows. A slower read needs a wider band in `cast.json` (not mine to change), or a different voice.
- 20-02: ASR heard "Moss … Twitter" for "Mas … Tidder". Both are names, so it's not a misread. But check that "Tidder" isn't heard as "Twitter".
- 20-02: final move −2.8 st. It's a rhetorical question from a man who already knows the answer, so a fall may be right.
- 20-05: ASR "40" for "forty" (the number spelling limit in `word_recall`).
- 20-06 "is that the build?": final move −4.8 st. **The script asks for a rise** (a yes/no question). Neither seed rose. If the ear agrees, try another seed or a comma-free re-read.
- 20-07: the 0.3 s pause after "running" was opened while the voice still sounded (dip −25.9 dB). It may click.
- 22-01 "so, how's the partnership going?": final move −4.4 st. A wh-question normally falls, so this is probably fine.

---

## 4. The timeline

**Method** (the Act Four v5 builder's rules):
- One beat per shot or held setup, staged from the script's shot markers. A setup that changes inside (the GLYPH frames, the forum's hands, the real NEDIB turning) is split into beats marked `cont`, which keep their `shotId`.
- Every line is laid from its take. A line's first word lands at the previous line's last word plus its gap in `GAPS`. The first line after picture takes its beat's lead-in.
- Posts, plates, chyrons and cards are timed for read: about 0.25 s plus 0.05 s a character after they land.
- No overlaps, because Act Three writes none.
- The monitor's people are tagged `(monitor)` and Gerg `(call)` in the strip.
- Mas, Gerg, Nole, Nedib, Tasya, Sirrah and Mario are `known` (set up in Acts One–Two, as Act Two's builder does). THE ORB is named by its card (18.03), REMUHCS by his plate (19.09), and the copies by the stat row (21.03).

**Gaps between lines** (last word to next first word; median 1.12 s across the act):
- Quick replies (0.3–0.6 s): in the call, 20-03 (0.45), 20-06 (0.55), 20-07 (0.30) and 20-09 (0.35); in the signing, 21-02 (0.35) and 21-03 (0.55).
- Loaded (0.8–1.5 s):
  - 20-04 at 1.10 s: the Orb's long look.
  - 20-08 at 0.90 s: care, said as permission.
  - 21-04 at 0.80 s: the real NEDIB turns first.
  - 22-02 at 1.00 s: Tasya's laugh, which the stick reel marks with a silent mouth.
  - 18-02 → 18-03 at 1.50 s: the Orb settling into the outline.
- The longer gaps are picture between lines: the monitor run, the post, the edit (4.2 s), the scroll and the phone.
- One gap grew, 19-01 → 19-02 at 1.14 s against a plan of 0.8 s, because the cut back to the room needs 0.7 s of lead.

**Scenes** (reel seconds; the script's printed clocks in brackets):

| sc | reel | script | Staging |
|---|---|---|---|
| 18 | 22.2 s | 28 s | the home room two-shot; the slot delivers the box; ECU label; the Orb rises (card); MCU scan → **GLYPH-MASKED** (0.5 s in the reel, 5 frames in the show) → the toast and "thanks."; the held two-shot for the V.O. and "you can stay." |
| 19 | 35.4 s | 30 s | 14 beats: POV items full-bleed only for must-read text, the hands runner in one held `2S·SCR` frame (`shotId 19.SCR`, 4 beats), the forum's hands going up on REMUHCS's line, NOLE's line in the room frame, the lighthouse and the second phone |
| 20 | 36.0 s | 25 s (+23 played) | the typed post (OTS), the LEDs stop (the act's one quiet beat, 1.6 s), the reply counter, then **the call held in one two-shot (`20.CALL`) with one cut, the edit** |
| 21 | 30.9 s | 30 s | the eggs; the signing desk held for NEDIB and his copies (`21.DESK`); the Orb picks the real one; the signing and the clap; the scroll pours; the glass stops it |
| 22 | 13.6 s | 15 s | DevDay on the monitor (the odometer, the question, "We love you guys."); the phone from above with the suggested replies; "super." |
| 23 | 10.0 s | 10 s | THE CLOCK's four bars, 2.5 s each: the cold open's frame, the reminder, the rail rolling to Friday, and black (the pre-lap under it) |

**Style moments** (noted in each beat's margin cues):
- GLYPH use 1 of 2 at 18.04g. The stick reel dissolves the whole frame; the show masks only the scan cone.
- THE CLOCK takes over from the Water Line on 23.01.
- The act-out cuts to black on a sound, not a sting.
- The acts' pixel style is BASE throughout; there are no drastic style leaps in Act Three.

**Stick stand-ins that differ from the script's picture:**
- **`2S·SCR` (the room frame with the monitor in it):**
  - The reel's figures always stand on the room's floor. The first test render put Sirrah, NEDIB and the forum under the monitor, where they read as standing in Mas's room.
  - These frames now show Mas and the Orb at the monitor's left edge, and only the monitor's in-world text on it: `[A] [I]` (the blocks), `PINKY PROMISE`, `BILLS: 0`, `DEEPFAKES OF ME: SEEN 2`.
  - The on-monitor people appear in the full-bleed POV beats.
- **Raised hands don't read.** The reel's `arms-up` pose draws the arms almost straight up, behind the head. In the stills the forum and Mas look armless, not hands-up. See §10 for the one-line fix in the shared figure code.
  - The forum still changes visibly: seated and hands down, then standing on the line.
  - The copies' clap uses `stand`.
- **21.07 (ECU the glass on the scroll)** shows Mas reaching (`point`), because an empty close-up read as a dead frame.

## 5. Sound

### 5.1 Why a stem

The episode mixer lays takes and one bed per sequence, but no per-beat SFX (reel README, "Not verified"). In this act, sound does the storytelling:
- 24 s of the monitor run have no voice;
- a ring motivates the call;
- the LEDs stopping mark the post;
- the clap L-cuts into DevDay's applause;
- the act-out is a clock that stops dead, then a pre-lap under black.

So `act3_bed.py` builds one temp stem from the timeline (the tag chapter does the same, with `tag_bed.py`).

### 5.2 What's in it (measured by `act3-bed-qa.json`)

- **Totals:** 149.0 s, **−25.4 LUFS** integrated, peak −8.6 dBFS, **no 0.5 s digital silence**.
- **room:** the SFX board's `server_hum` at −40 LUFS until the cut to black (145.5 s). The room cuts with the picture.
- **leds:** a very soft tick in straight eighths on MM-01's grid, 408 ticks in all. **Out from 20.02 to 20.06** (the post → back on the two-shot after the edit, as the script has the LEDs stop and resume). Out again under the black.
- **music:** the **MM-01 Water Line** underscore render, at −26 LUFS.
  - It enters at 0.5 s so that its bar lines land exactly on 23.01.
  - It plays bars 1–26, then the cue's loop (bars 3–26), then bars 3–7. It hands over on bar 8's downbeat, which is 23.01, with a 150 ms fade. Each loop jump rings out the previous pass's tail.
  - The script's thinning to one instrument under lines is approximated by the mixer's −10 dB duck.
- **clock:** a temp for **THE CLOCK** (MM-14, not rendered): a felt step figure, one step a beat, plus a soft tick. It plays 12 steps over sc 23's bars 1–3 and **stops dead on bar 4's downbeat** (the black), at −26 LUFS.
- **sfx:** 53 placements from the beats' `sounds`: SFX-board files (`orb_servo`, `orb_scan_sweep`, `glyph_blink`, `post_click`, `odometer_ratchet`, `tower_pop`, `paper_flutter`…) and made sounds. The made sounds are:
  - the slot's whir;
  - a two-note chip chime on F (F5 then C6, not a startup chord);
  - the phone ring (pre-lapped under the reply counter);
  - his keys, and Gerg's keys band-passed down the line for the whole call;
  - THE COPY's chip answer and failed copy, a beat late after each hand;
  - the lightning egg's crackle;
  - the copies' two-person clap running on into DevDay's applause (the L-cut);
  - the scroll's flutter, which stops when the glass lands;
  - the glass;
  - the crane's diesel grind and a dozen glass tings under the black (Act Four's opening, pre-lapped).

### 5.3 For the manifest (`audio/reel/ep01-act3-v2/manifest-part.json`)

```json
{"id": "act3", "label": "ACT THREE", "sub": "verified: human · sc 18-23 · v2 takes", "from": "ep01-act3-v2"}
{"chapter": "act3", "beat": "18.01", "cue": "MM-01", "label": "Act Three temp stem (room + MM-01 + THE CLOCK temp + SFX)",
 "src": "audio/reel/ep01-act3-v2/act3-bed.wav", "lufs": null, "loop": "none", "in": 0, "xfade": 0.3}
```

- **The chapter** has no `audio`, so the mixer lays the 21 takes itself.
- **The bed** replaces the example manifest's MM-01 and MM-14 beds for act3. The stem already stops the music dead at the black, so no `until` is needed.
- **Keep it in step with the timeline.** The stem is timed from the timeline JSON, so rebuild it whenever the JSON changes.
- **Act Four's own premix gates the bed off at the chapter boundary.** The stem's last 1 s isn't heard.

## 6. The test render (measured)

- **Command** (from the scratch studio copy, through `ops/heavy.sh`): `episode.mjs <test manifest> --no-sync --jobs 2 --conc 2`. The test manifest is saved as `audio/reel/ep01-act3-v2/test.manifest.json`.
- **Output:** `out/ep01/reel/segments/ep01-act3-v2-test.mp4`, with `-chapters.json`, `-measure.json` and `-sheet.png`.

| | Measured (third render, 01:33–01:35) |
|---|---|
| Length | **2:28.0**, 3,552 frames. 1280×720 H.264 plus AAC, 10.8 MB |
| Wall | 127.8 s: bundle 10.7 s, render 109.6 s (2 segments of 74 s, 2 jobs × 2 tabs), mux 6.8 s. That's 69.5 s of reel per minute, at a load average of 20–26 from other passes |
| Decode (PyAV) | 3,552 frames, **0 decode errors**. Video 148.000 s, audio 148.011 s |
| Mix (the mixer's own meter) | **All 21 takes laid**, 0 missing. −19.09 LUFS, peak −5.0 dBFS, **0 silences ≥ 0.5 s** |
| Mix (pyloudnorm on the decoded AAC) | −19.17 LUFS integrated, peak −5.02 dBFS. By scene: sc 18 −21.4 · sc 19 −21.8 · sc 20 −17.4 · sc 21 −17.6 · sc 22 −18.6 · sc 23 −26.5 (the clock and the black, no talk). No 0.5 s window under −70 dBFS |
| Stills | One at 60 % of every beat (41), on `-sheet.png` |

**What the stills show:**
- Every beat shows its frame marker, a scene slate at each scene start, legible rails and plates, the strip labels (`GERG (call)`, `NEDIB (monitor)`, `mas (v.o.)`) and the EP and act clocks.
- **The first render (01:21) found two staging problems:**
  - the people on the monitor stood on Mas's floor in the `2S·SCR` frames;
  - an empty frame at 21.07.

  Both are fixed in this version (§4). It also showed the `arms-up` limitation (§10). The second render started at 01:27; I stopped it while it was still queued, to restore the act-out's full bar.

## 7. Measurements (`audio/reel/ep01-act3-v2/measure.json`)

| | |
|---|---|
| Runtime | **2:28.0** (3,552 frames), against 2:18 printed and ≈ 2:49.5 estimated as played in the script's act header |
| Beats / setups | 41 / 33 |
| Lines / words | **21 / 142**; median **6** words a line; 6 of 21 are ≤ 3 words |
| Speech | 44.3 s, 30 % of the act |
| Longest conversation | **Gerg's call, 25.9 s, 8 lines** (20-02 → 20-09, with the 3.1 s edit insert inside it). With every gap ≤ 2.5 s: NEDIB's signing, 15.2 s, 4 lines |
| Longest stretch without a voice | 24.5 s (18-03 → 19-01: sc 19 items 1–3) |
| Gaps | median 1.12 s; quick replies 0.30–0.55 s; loaded 0.8–1.5 s |
| SFX placements | 53 (in the stem) |

For comparison, Act Four v4 was criticised at a median of 4 words a line and a longest conversation of 10 s (SHOWRUNNER-NOTES 7). Act Three is the act "with nobody in the room to talk to" (the script's header), so its talk is short by design outside the call.

## 8. What the script leaves unclear for staging

1. **Where the Orb lives vs the `[OTS]` "from behind the Orb" (19.12).**
   - The room plan puts the Orb in the wallpaper outline behind Mas, and says the camera stays on the room's open side, in front of the desk.
   - A shot from behind the Orb would put the camera at the back wall, facing out.
   - I staged it as a foreground silhouette at frame left, which cheats the Orb forward. The director or the POV owner should say which rule wins.
2. **How big the monitor is in `[2S·SCR]`.**
   - The room plan has a monitor on the desk at frame right.
   - The runner asks for it "big enough to follow" with Mas, the Orb and the monitor in one held frame.
   - The pixel layout needs a framing where a desk monitor can carry a lectern, a scroll and a room of hands at 480×270.
3. **GLYPH-MASKED is 5 frames (0.21 s).** The reel holds it for 0.5 s to be legible. The show's 5 frames may be too short to read the "tokens" as a face. That's worth a look in the pixel pass.
4. **Tasya's "hearty laugh first."**
   - No stock Kokoro take laughs. The reel leaves 1.0 s with a silent mouth.
   - It needs a non-verbal laugh source: a programmatic laugh SFX, or a recorded laugh from the same stock voice's family if one is added. Never a clone.
   - *(Clarity pass: done inside the take. Tasya's own stock voice reads "Ha ha ha! We love you guys.", and the gap before it is 0.45 s. See §11.3.)*
5. **"is that the build?" must rise.** Neither seed does (§3). The script's own note says the take must rise. *(Clarity pass: reworded to "how's the build?", a wh-question that falls naturally, so no rise is needed; §11.1 #7.)*
6. **REMUHCS's LOCK OPTION.** If the facts owner confirms his spoken question, he says it first and the plate goes back to his name. That adds a line and about 3 s to 19.09.
7. **"The Water Line holds its note"** in the LEDs beat (20.02). The temp underscore doesn't hold. The final cue should, or an edit of MM-01 should give it a held bar there.
8. **The act-out's bar 4.** It's held at the full 2.5 s here, black with the crane pre-lap. The script's §4 handoff says Act Four's sc 24 "already expects it". Act Four's premix also starts with its own crane, so the two must be matched when the episode is mixed; otherwise the crane is heard starting twice. *(Clarity pass: that was wrong. The audit measured in the episode MP4 that Act Four's premix has **no** crane, so this pre-lap stopped dead at the cut (audit-v2 #37). It's held out now (`PRELAP = False`); see §11.1 #12.)*
9. **Who hears the call.** "He thumbs it to speaker" is staged with `(call)` on Gerg's lines. The Orb's long look lands on "i'm editing it." (20-03) as written. With the 1.1 s gap before Gerg's reply, it reads as the look's beat.

## 9. Length: proposals only (nothing cut)

The showrunner marks the drag first; these are where I'd look, in order. *(Clarity pass: the numbers are updated in §11.5, with the insider read's two Act Three length notes added.)*
1. **sc 19 items 1–3 (24.5 s with no voice).**
   - Cut 19.03, the reflection (1.8 s).
   - Merge 19.04 into 19.06 (≈ 1.9 s).
   - Or drop ITEM 1, the poster: 19.02–19.03, ≈ 5.4 s. The tour was covered in sc 16.
2. **21.01, the eggs (2.3 s).** Both are zero-read eggs; they could ride on 21.02's first second.
3. **18.01 / 18.03 holds** (4.4 and 4.9 s). ≈ 1 s could come off each once the ear has heard the slot and the servo.
4. **The hands runner as a whole (≈ 20 s of 19.04–19.10).** It's the act's comedy runner, so cut it only if the showrunner marks it.

## 10. Open issues, for the lead

- *(Clarity pass: resolved. Since 2026-09-27 `sync.mjs` reads one level of subfolders; see the reel README.)* **`sync.mjs` doesn't read `show/reel/ep01-full/`.** It lists only `show/reel/*.json`, so `from: "ep01-act3-v2"` won't resolve in the real studio until the lead teaches sync to read the subfolder, or copies the chapter JSONs up a level. I rendered from a scratch copy of `studio/`, with the JSON placed in its `src/reel/data/`.
- **The `arms-up` pose hides the arms** (`studio/src/reel/Figure.tsx`, case `'arms-up'`: `ap(±dir, 148 ± wig)` puts the hands behind the head). Something like `ap(-dir, 125 + wig)` / `ap(dir, 125 - wig)` would give a readable V.
  - Not changed here: the file is shared reel code, and changing it changes other reels' frames (Act Four's byte-identity checks).
  - It affects every reel that raises hands.
- **The stem and the timeline are coupled.** Rebuild `act3-bed.wav` after any timeline change (§2).
- **For the ear:**
  - the 7 QA flags (§3);
  - the call chain on Gerg;
  - the `monitor` chain's level against the room;
  - the chime (it must not evoke a startup chime);
  - the LED ticks (they're meant to be barely there);
  - the temp CLOCK figure;
  - the crane and tings pre-lap.
- **Not heard, not watched:** everything above. The reads (newcomer and insider) of this chapter are still owed, along with the rest of the episode.
