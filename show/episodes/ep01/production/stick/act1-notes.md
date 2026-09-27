# Ep1 stick reel v2: ACT ONE (sc 5–12)

| | |
|---|---|
| **What this is** | The handoff for Act One's chapter of the full Ep1 stick reel (`ep01-full-v2`). It covers the recorded lines, the stick timeline, the manifest part, a test render, the measurements, and what the script leaves open for staging. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1" and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". Fully programmatic: stock Kokoro voices (CASTING.md, no clones), no external APIs, `.env` untouched. The lead's call on length: build at the current length, let the showrunner mark what drags, then cut. So this pass fixed clarity and naturalness only; the length cuts in §7 are proposals, none made. |
| **Who, when** | The `ep1s-act1` pass. First sitting 2026-09-26 ≈ 23:45 → 2026-09-27 01:11 (plan, first takes at 4 workers, the builder); that session died mid-record at 01:11 (the showrunner: "try not to cook/freeze my laptop, i think that is what killed the session last"). Second sitting 01:13 → 01:50: pace retakes, the timeline, the test render and this file, every heavy step through `ops/heavy.sh` at 2 workers or 2 × 2 render tabs. **Then the `act1fix` pass, 2026-09-27 ≈ 03:00 → 03:45:** the fixes for the newcomer, insider and audit reads of `ep01-full-v2.mp4`, in **§9** (read that first). |
| **State** | **After the fix pass (§9):** the script's Act One, 20 re-read lines, the timeline and a new temp sound stem are done and test-rendered. The lead pastes `manifest-part.json` (now ONE bed, the stem) into `ep01-full-v2.manifest.json` in place of the eleven act1 beds (§9.4). The old sync blocker is gone: `sync.mjs` reads `show/reel/ep01-full/` since 2026-09-27 (studio README). Nothing committed. §§1–8 below describe the first build; where §9 differs, §9 wins. |
| **Honesty** | I can't watch or listen. Every number is a tool's measurement (fastrec QA, the builder, the episode tool, PyAV). Judgments about how frames read come from stills. |

---

## 1. Files

*(Fix pass: three new files, `audio/reel/ep01-act1-v2/act1_bed.py`, its output `act1-bed.wav` (git-ignored) and `act1-bed-qa.json`; see §9.3.)*

| What | Where |
|---|---|
| Line plan (`fastrec plan --seg act1`, then gaps, speeds, pauses, devices and flags set by script) | `audio/ep01/act1/dialogue/lines-plan-v1.json`, made by `audio/reel/ep01-act1-v2/set_plan.py` (its docstring and the `RETUNE` rounds say what was set and why) |
| Takes (56 lines, 65 takes) and QA | `audio/ep01/act1/dialogue/fast-v1/` (`wav/`, `takes/` alternates, `clean/` dry reads of the phone lines, `qa/fastrec-qa.json`, `log/`, `reel/sc5…sc12-fast-stringout.mp3`). WAVs are git-ignored |
| Lines JSON with the measured takes (durations, word timings, mouths) | `audio/ep01/act1/dialogue/lines-fast-v1.json` |
| Pace check against each character's guide | `audio/reel/ep01-act1-v2/pace_check.py` |
| **Stick timeline** (`"dialogueReel": true`) | `show/reel/ep01-full/ep01-act1-v2.json`: 59 beats (57 shots), 56 lines |
| Timeline builder (shot plan in `SPEC`, margin notes, real-event notes) | `audio/reel/ep01-act1-v2/build_timeline.py` → the JSON, plus `measure.json` and `transcript.md` (every line as laid, with gaps) beside it |
| Manifest part (chapter + 11 temp beds) | `audio/reel/ep01-act1-v2/manifest-part.json`, from `manifest_part.py` (`--test <file>` writes a one-chapter manifest) |
| This note | `show/episodes/ep01/production/stick/act1-notes.md` |
| Test render, sidecars, stills, contact sheet (**scratch, temporary**) | `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-act1/render/` (see §6) |

## 2. How to re-run (repo root unless marked)

*(Fix pass: the order is now plan → set_plan → record → build_timeline → **act1_bed.py** → manifest_part; the exact commands as run are in §9.5.)*

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
# 1. the draft plan from the script (after a script change add --prev audio/ep01/act1/dialogue/lines-plan-v1.json so ids hold)
HF_HUB_OFFLINE=1 $PY $T plan --seg act1 --out <scratch>/lines-plan-draft.json
python3 audio/reel/ep01-act1-v2/set_plan.py <scratch>/lines-plan-draft.json audio/ep01/act1/dialogue/lines-plan-v1.json
# 2. record (resumable: unchanged lines are skipped by key; Ctrl-C or kill stops cleanly and the same command resumes)
ops/heavy.sh env HF_HUB_OFFLINE=1 $PY $T record --lines audio/ep01/act1/dialogue/lines-plan-v1.json \
  --out audio/ep01/act1/dialogue/fast-v1 --lines-out audio/ep01/act1/dialogue/lines-fast-v1.json --workers 2 --threads 3
python3 audio/reel/ep01-act1-v2/pace_check.py            # far-off lines against the guides
# 3. the timeline, its measures and transcript; then the manifest part
python3 audio/reel/ep01-act1-v2/build_timeline.py
python3 audio/reel/ep01-act1-v2/manifest_part.py [--test <scratch>/act1-test.manifest.json]
# 4. a test render of Act One alone (run from studio/, or from a scratch copy of studio/ whose src/reel/data/ has the
#    timeline: sync.mjs doesn't read show/reel/ep01-full/, see 5.1)
../ops/heavy.sh node src/reel/tools/episode.mjs <scratch>/act1-test.manifest.json --no-sync --jobs 2 --conc 2 \
  --work <scratch>/work --out <scratch>/render/ep01-act1-v2-test.mp4
```

Recording is cheap now: a retake round of 4–16 lines took 44–90 s wall. The builder and the manifest part take under a second.

---

## 3. Measurements

### 3.1 The act

| | Measured |
|---|---|
| **Runtime** | **5:41.08** (8,186 frames at 24 fps). The script's own estimate after dialogue pass 5 was ≈ 6:11; its printed clock is 1:12–5:54 (4:42). So it plays ≈ 30 s under the script's estimate and ≈ 59 s over the printed clock |
| Beats / shots | 59 beats, 57 shots (two beats continue a shot: the held HIGH in sc 6, the lobby wide in sc 9) |
| Lines | **56 voiced lines**, 440 words (the builder's count; QA's tokeniser says 437). Gerg's Dec 5 post is on screen only (§4) |
| Words per line | **median 5**; 18 lines of 3 words or fewer; 13 lines of 10 or more |
| Speech | 142.0 s of voiced speech, 41.6 % of the act |
| Reply gaps inside conversations (gaps under 3 s, n = 42) | median **0.70 s**; 19 quick (≤ 0.6 s) and 23 longer (0.7–2.4 s): loaded replies ("it's a preview.", Alyi's dread, "you counted.") or written business (Rima's wait, Mas typing, the held beat before "and the rent?", Mario's look at the split line) |
| **Longest conversation** | **43.3 s**, 12 lines: the launch-night argument, "Okay, the build's green…" → "Your button." (beats 5.03–5.07, three setups and two cut-ins) |
| Other conversations over 20 s | Alyi's count + the chat, 31.4 s, 11 lines (5.09–5.11) · the terms, 22.7 s, 5 lines (9.09) · Sydney, 20.8 s, 5 lines (10.02–10.04) |
| Scenes (s) | sc 5 89.9 · sc 6 35.5 (14 bars = 35.0) · sc 7 9.8 · sc 8 34.5 · sc 9 71.8 · sc 10 26.3 · sc 11 45.9 (2 + 16 bars) · sc 12 27.4 |
| Longest stretches with no voiced word | 32.6 s: the duel's wordless phrases 3–4, then the letter's push (11.04 → 12.02) · 21.9 s: the drill's set piece between "nobody noticed." and "Low-key." · 19.8 s: the lanyards, the lock, the lobby, the check and the freeze card (8.05 → 9.06) · 13.7 s: the EMIT page to black · 10.1 s: the tear to Radnus. All are set pieces or inserts with text to read and a cue under them; see §7 |

Per speaker (voiced lines · words · speech · pace): Tasya 7 · 84 · 25.8 s · 196 wpm; Rima 8 · 83 · 25.8 s · 193; Gerg 10 · 77 · 22.7 s · 203; Mas 12 · 44 · 16.4 s · 161; Sydney 2 · 28 · 8.9 s · 189; Radnus 3 · 25 · 8.6 s · 174; Mario 2 · 22 · 7.4 s · 177; Alyi 3 · 20 · 7.7 s · 157; Nirb 2 · 16; Oigneb 1 · 13; ChatGTP 2 · 9; Egap 1 · 9; Nole 2 · 7; Clod 1 · 3.

### 3.2 The takes

- **56 lines, 65 takes** (9 lines with 2 seeds: the six that carry a scene, 5-06 "what do we tell them?", 5-13 Alyi's count, 7-01 "That's for them, isn't it?", 9-06 the terms, 10-02 Sydney, 11-01 the memo, plus 5-01, 9-02 and 9-04 for ASR). 48 kHz / 24-bit mono, −16 LUFS (V.O. −18).
- **QA: 0 problems, 14 ear flags** (`qa/fastrec-qa.json`):
  - ASR: 5-03 "forty" heard as "40" and 9-03 / 6-03 "long-term" / "Low-key" as two words (tokeniser misses, not misreads; 6-03 also hears a leading "A"); **9-02 "It's stuck." heard as "It's stocking."** (both seeds: Kokoro voices the final /k/ release, about 140 ms at −15 to −23 dB); **9-04 "Suits you." heard as "So do you."** (both seeds). Both short lines need an ear; fallbacks in §8.
  - Pause opened while the voice still sounds, at −25 to −28 dB (mild): 8-03 after "fine", 9-01 after "Mas", 9-06 after "servers".
  - Articulation outside the guide: Gerg 5-05, 5-18, 9-09 (6.1–6.3 syll/s against 5.0–5.8), Rima 5-08 (5.5 against 4.0–4.6), Tasya 9-06 (5.3 against 3.8–4.4), Nole 12-01 (3.7 against 4.8–5.6, a 5-word line whose wpm is over).
- **Pace against the guides** (`pace_check.py`: 6+ words and > 25 % past the guide, or articulation > 0.6 syll/s outside): the first takes had **14 lines far off** (Tasya's terms 236 wpm and his quote 255 against 125–145; Nirb 272; Rima's bargain 209–238; Oigneb 216). Three retake rounds (bottom-of-band speeds, the pauses a speaker takes at a full stop, split reads where QA found a cut inside the voice) brought it to **6**: Rima 5-06 205 wpm and 5-08 208 (+28–30 %), Tasya 9-06 216 (+49 %) and 9-10 201 (+38 %), Nirb 8-02 (inside its wpm guide; flagged only for slow articulation across its split reads), Nole 12-01 (above).
  - **Why not closer:** Kokoro can't reach these guides inside the casting bands (Tasya reads 5.3 syll/s at 0.85, the band floor minus 0.03). The reference I matched instead is **Act Four v5, which the showrunner approved**: its Tasya long lines ran 176–216 wpm (the 46-word statement 199), Gerg 144–219, Alyi 156–176. Act One's Tasya now runs 196 wpm overall, Rima 193, Gerg 203.
- **Recording runs** (all at load 13–16 on 14 threads): round 1 (first sitting, 56 lines at 4 workers, interrupted and resumed; not timed end to end); round 2, 16 lines / 21 takes in 90 s; round 3, 10 / 16 in 90 s; round 4, 4 / 7 in 44 s (2 workers × 3 threads, through `ops/heavy.sh`).

---

## 4. What was built, and the staging calls

The builder is a port of Act Four v5's (`audio/reel/ep01-act4-v5/build_timeline.py`). One beat per shot or held setup, read off the script's shot directions:

- **Who is in frame, the shot marker, who speaks.** Each beat names its frame (`TWO-SHOT · Mas and Gerg, desk to desk (held)`, `OTS · over Mas onto Rima`, `MCU·glass · Alyi's reflection`, `POV · his phone, full-bleed`, `SPLIT · phrase 2`…), its figures and the over-the-shoulder foreground. A speaker not in frame is tagged O.S. (Rima from the whiteboard, Gerg typing off frame, Mas's "…still a preview." on Rima's face).
- **Conversations are held.** Launch night plays in three held setups (the two-shot, 3 lines, 11.4 s; the over-the-shoulder on Rima, 6 lines, 24.5 s; the laptop over-the-shoulder, 5 lines, 14.2 s) and cuts only on the script's turns (Alyi's new voice, Rima's wait, the click, Mas's close shot). Sc 8's exchange holds one POV frame for 5 lines; the terms hold one two-shot for 5 lines; Sydney holds one two-shot for 3.
- **Lines from the real takes.** A line's onset is the previous line's speech end plus its planned gap (quick replies 0.3–0.6 s, loaded ones 0.7–1.6 s, typing 2.4 s); a line that follows picture takes the shot's lead-in. The cut lands a tail after the last word. No overlaps: the script writes none in Act One.
- **Place and time labels** open each sequence (the margin slate): the bullpen on launch night, the drill (Nov 30 → Dec 5), the hole, Elgoog on his phone, the NopeAI lobby (and "weeks on"), the split, the dark desk. The `RAIL:` dates are on screen where the script puts them.
- **On-screen text timed for read** (≈ 0.25 s + 0.05 s a character): plates ride first lines, posts and the check and the EMIT headline hold to read, the `1,000,000` wheel holds 1.4 s, the ticker's `≈ −$100B` holds 2.0 s.
- **Set pieces on the bar grid** (96 BPM): the drill is 14 bars (4 · 3 · 4 · 3) with the V.O. on phrase 1's bar 2; the duel is 2 + 16 bars.
- **Margin notes** carry sound and music per the script's `MUSIC:`/`SOUND:` calls, and the **style moments**: the proposed low-poly 3D cutaway of the drill (drastic tier, default BASE), Tasya's 2-TONE full freeze, the LEDGER flash-print on the ticker figure. A `REAL EVENT` note on 17 beats gives the record behind it (tags as in the script).
- **Sound in the reel:** the episode mixer lays each take and ducks a temp bed: room-tone stand-ins for the bullpen and lobby beds, the MM-08 underscore for LEVERAGE (stopping on the pop and coming back on the key ring), and labelled pads for MM-16, MM-04, MM-17 and MM-14 (no renders yet). The click, ratchet, pop, THUD and Sydney's tick are margin notes only.

**Choices the script left to me:**
1. **Gerg's Dec 5 post is not voiced.** It is written as a speaker block, `**GERG** *(post, source casing)*`, so `fastrec plan` drafted it as a line; the notation says posts are pop-ups, never speeches. It is on screen (6.07) and dropped from the plan (`set_plan.py DROP`).
2. **Sc 8's six lines use the phone's small-speaker chain** (`device: call`), because "the sound is the phone's own audio". The draft had set it on only two lines (their parentheticals mention a phone).
3. **Pauses and split reads.** Where the script's punctuation asks for a stop, the take has one; where QA found the pause cutting into the voice, the line is two whole reads 0.25–0.4 s apart (Gerg's "…green. / I'm shipping it.", Nirb's three questions, Mario's "Point one: / we must not…", Tasya's quote "I want people to know / that we made them dance."). The script asks for the quote as one finished sentence landing on "dance": if the ear hears two reads, drop the `{s0.25}` in `set_plan.py`.
4. Speech rewrites for the voice only (the text is unchanged): "v2" read "vee-two", "2023" read "twenty twenty-three", GNIB with the lexicon's /ɡənˈɪb/.

## 5. For the episode manifest

*(Superseded by §9.4: Act One now plays one bed, its stem. The eleven beds below are inside the stem.)*

`audio/reel/ep01-act1-v2/manifest-part.json` holds the chapter (`{"id": "act1", "from": "ep01-act1-v2", …}`, no `audio`, so the mixer lays the takes) and 11 beds anchored to Act One's beat ids. Paste the chapter between the card and Act Two and the beds into `"beds"`. Each bed runs until the next one, so the first bed (5.01, the bullpen room tone) ends the card's bed, and the last one (MM-14) carries `"until": {"chapter": "act2"}` so the sting stops at Act Two's first frame whatever Act Two's first bed is. (The one-chapter test manifest leaves the `until` out: there is no `act2` in it.)

### 5.1 The sync gap (for the lead)

`studio/src/reel/sync.mjs` copies only `show/reel/*.json` (flat) into `studio/src/reel/data/`, and it deletes any data file it didn't copy. So `show/reel/ep01-full/ep01-act1-v2.json` isn't seen by a normal run, and a chapter `from: "ep01-act1-v2"` finds nothing. Either teach `sync.mjs` to read `show/reel/ep01-full/` (the reel's owner), or copy the segment files flat. For the test I left the real `data/` alone: a scratch copy of `studio/` (its `src/` copied, `node_modules`, `public`, `audio` and `out` symlinked) with the timeline in its `src/reel/data/`. `src/reel/` and `src/dev/reel/` in that copy were identical to the repo's (`diff -rq`).

## 6. The test render

Rendered Act One alone with the episode tool (`--jobs 2 --conc 2`, 1280×720, through `ops/heavy.sh`), from a one-chapter manifest (`manifest_part.py --test`). Files in the scratch `render/` folder: `ep01-act1-v2-test-r2.mp4` (the current one) with `-chapters.json` and `-measure.json`, the first render `ep01-act1-v2-test.mp4`, `check_render.py` one level up, and `stills/` / `stills-r2/` (a still at every beat's midpoint plus five line onsets, `contact-sheet.png`, `check.json`).

| | Measured (r2) |
|---|---|
| Length | 5:41.083, **8,186 frames decoded, the planned count** (PyAV full decode, 0 errors); video 341.083 s, audio 341.083 s |
| Wall | 350.9 s (render 326.1 s, 4 segments of 85 s, 2 at a time; mux 14.4 s; the mix, 11.7 s, alongside): 58.3 s of reel a minute. The first render took 258.8 s (79.1 s a minute) on a quieter machine. Load 12–16 throughout |
| Mix | 56 takes laid, 0 missing, 11 beds, −18.1 LUFS integrated (the mixer; pyloudnorm on the decoded AAC: −18.19), sample peak −4.3 dBFS, limiter not engaged, **0 digital silences of 0.5 s or more** |
| Sync | every take's speech onset in the mix sits within 0.3 ms of its timeline onset (56 of 56) |
| File | 24.5 MB, H.264 + AAC 192k |

**Frames checked** (63 stills, one reader, at full size where it mattered): every beat shows its frame marker, the sequence slate (place, date), the EP and act clocks, the figures and their names, the speaker ring, the dialogue strip with O.S. tags, the rails, plates and posts, and the margin's cues and REAL EVENT notes. Two fixes after the first render, both confirmed in r2's stills:
1. **5.12, the counter:** six cards 0.3–0.4 s apart were each re-typed by the insert and never finished (the midpoint still read `CHATGT`). Now one line types the ticks in: `CHATGTP · USERS: 1 · 2 · 7 · 104 · 1,389…`.
2. **9.04, Tasya's card:** the stat, drawn as a separate sign, was clipped at the frame's left edge. It now rides inside the 2-TONE card: `TASYA · THE LANDLORD · MACROSOFT · KEYS: ONE PER TENANT`.

What still reads only through the caption or the margin (stick-reel limits, not bugs): Alyi's reflection (drawn as a standing figure), the POV of Mas's phone in sc 8 (the lobby set fills the frame), the check under Mas's feet, the scroll crossing the split, the pen and the tear. Rima's figure always stands under her own spotlight (her mark), including in 5.09 where she isn't speaking; the speaker is the ring.

Not done: nobody has watched it in motion or listened to it.

## 7. Length: candidates for the showrunner's marks (proposed, not made)

Measured, in the order I'd look first if the act drags. None is cut.

| Where | Now | Candidate | Saves |
|---|---|---|---|
| The duel's phrases 3–4 (11.05–11.06): the post, then the scroll across the split, with no voiced word | 20.0 s | 2 bars each; the post and the scroll are one gag apiece | ≈ 10 s |
| The delivery run (8.05 → 9.05): lanyards, lock, lobby wide, the check jams, the check insert, the freeze card, the pen | 19.8 s of picture | fold 9.02 into 9.01 (the check arrives in the same wide), and the pen into the freeze | ≈ 3–4 s |
| The drill's phrase 2 kitchen bar (6.03) | 2.5 s | the scroll can live inside 6.02's drop | ≈ 2.5 s |
| Tasya's terms (9-06) | 13.1 s, 47 words | the script's own weight: keep "as many as you like" (it sets up "that's a lot of servers.") and consider cutting "for as long as you like" | ≈ 1.5 s |
| Kram's pre-beat (11.01–11.02) | 5.9 s | the script says 2 bars (5.0 s) | ≈ 1 s |

## 8. Open, and what needs a person

- **Listen:** the whole act's flow, the gaps, Tasya's and Rima's pace (§3.2), the split reads (§4, choice 3), and the phone chain on sc 8.
- **Two short takes ASR misheard on both seeds:** 9-02 "It's stuck." (Kokoro's voiced /k/ release; fallback "It's jammed." is a script change) and 9-04 "Suits you." If they read wrong by ear, try another speed or a script alternative. "Suits you." matters most: it is the landlord's first look at the collar.
- **Stick-reel limits:** Alyi's reflection is drawn as a figure at the right wall (the stick set has no glass); the split deals its figures half left, half right; the check, the siren and the scroll are text and captions.
- **Script questions for the writers' room** (I edited nothing):
  1. Sc 6: Rima peers down "the hole in the floor" in phrase 3, but the floor tile only "pops up in front of Mas's desk" in phrase 4. I staged the hole as open from the drop, and the tile pop as its lid lifting. If the order is meant the other way, swap 6.08 and 6.09.
  2. Sc 6: Gerg's Dec 5 post is written as a speaker block (above). Writing it as a post line, like Nole's, stops the parser from voicing it.
  3. Sc 11: the pre-beat is "2 bars", but its business (Mas's look, the monitor, the crate, the wet hoodie, a plate) needs ≈ 5.9 s to read. I let it run.
  4. Sc 12: MM-14 "lands once, on the act-out's last shot, the pen", then "CUT TO BLACK on its tail": I gave the black 1.0 s. The sting's real length decides it.
  5. Sc 10: Sydney's real line is four sentences (8.0 s). It carries the scene and is kept whole, as dialogue pass 5 asked.
- **Temp music:** MM-16, MM-04, MM-17 and MM-14 are pads until the OST renders them; LEVERAGE is the MM-08 underscore (loop 0–17.5 s).

---

## 9. The fix pass (`act1fix`, 2026-09-27): what changed, and why

| | |
|---|---|
| **What** | Act One's fixes for the three reads of `out/ep01/reel/ep01-full-v2.mp4` (22:20): the newcomer / cold-viewer report, the insider notes, and the flow audit ([audit-v2.md](audit-v2.md)). The reads' timecodes are **episode** time in that file; Act One started at EP 1:05.2, so act time = EP − 65.2 s. |
| **The brief** | Clarity and naturalness only, not length (the lead: build at the current length, the showrunner marks the drag, then we cut; length proposals live in [length-v2.md](length-v2.md)). Fully programmatic, stock Kokoro voices, no external APIs. Act Four untouched. |
| **Who, when** | The `act1fix` pass, 2026-09-27 ≈ 03:00 → 03:45. Heavy steps through `ops/heavy.sh` (recording at 2 workers × 3 threads, the render at 2 jobs × 2 tabs); load average 2–6 on 14 threads throughout; free disk 8.3–9.3 GB. |
| **Result** | Act One is **5:59.67** (8,632 frames), **+18.6 s** on v2's 5:41.08, every second of it from a clarity or naturalness fix (§9.2). 59 lines (56 before: +3 new), 481 words. A new temp sound stem carries the room, the music and 98 SFX (§9.3). |
| **Honesty** | I can't watch or listen. The numbers are from the builder, fastrec's QA (ASR, pace, pYIN), the mixer's QA, PyAV and my level scripts. How frames read is my judgment from 79 stills of the test render. |

### 9.1 Every change, with the read that asked for it

Script edits are in `show/episodes/ep01/script.md` `## ACT ONE`, each marked "Act One fix pass (2026-09-27)" with its reason beside the line. Take changes are round 5 / 5b in `audio/reel/ep01-act1-v2/set_plan.py`. Timeline changes are marked "fix pass" in `build_timeline.py`.

| # | Where (v2 EP time) | Read | What was wrong | What changed | Where |
|---|---|---|---|---|---|
| 1 | 1:05–1:58, sc 5 | newcomer | No date until the scene was over | `RAIL: NOV 30, 2022` moved from the click to the opening wide (5.02) | script, timeline |
| 2 | 1:10, 6:40, sc 5 / 12 | newcomer | Alyi, seen only in the glass, read as a conscience figure (Act Four's vote can't survive that) | Script: "a real man in a real doorway, seen only in the glass"; after "Someone should." he walks out of the doorway, footsteps down the hall, the glass empty. Reel: label MAN IN THE DOORWAY (IN THE GLASS), frames say "in the doorway, seen in its glass", he leaves the frame at the end of his line; the pause before "let's see if anyone notices." 1.0 → 1.4 s (a picture-side `lx` gap, so the take's key held) | script, timeline, stem |
| 3 | 2:20, sc 5 | newcomer | `> is anyone there?` on screen while Rima says "Nobody asked one." | The typed line appears 0.8 s after her line, as `mas types: is anyone there?` (checked in the stills) | script note, timeline |
| 4 | 1:23, sc 5 | insider | Rima's bargain read as a memo | "Then let's treat it like one. One little post, no press. And a banner that says it makes things up." | script, take 5-04 |
| 5 | 1:33–1:50, sc 5; audit #4 | insider, audit | The breaks / works / wakes-up ladder too neat; her cost line rushed (5.53 syll/s against 4.0–4.6) | "Okay. Say it works. Say people actually use it. That's going to cost us a fortune." as split reads: **4.93 syll/s, 164 wpm** (was 5.53, 208). sc 7's "it's the bill." tag updated | script, take 5-08 |
| 6 | 1:48, sc 5; audit #5 | audit | "And if it wakes up?" heard as a statement | "And what if it wakes up?": Whisper now ends it with "?". Its pitch still falls (−5.2 st), but the question is in the words, which is what §4.2 of the audit asked first | script, take 5-10 |
| 7 | 3:12, sc 7 | both | "That's for them, isn't it?": the "that" was vague | "A million people, Mas. You're actually crying for them." (she names the tear; "it's the bill." corrects it) | script, take 7-01 |
| 8 | 3:36, sc 8; audit #11 | insider, audit | Three tidy sentences; Radnus and Tasya read at the same pace | "Search is fine. Totally fine. It's just a chat thing, people seem to like talking to it." and his three lines at speed 1.02–1.03 (band 0.91–0.99, QA allows +0.05). **Act One medians now: Radnus 4.67 syll/s, Tasya 3.61** (the audit measured 4.33 and 4.33) | script, takes 8-01/03/05 |
| 9 | 4:04, sc 9 | newcomer, insider | `KEYS: ONE PER TENANT` meant nothing; three Macrosoft labels in a row | The card is `TASYA / THE LANDLORD · RUNS MACROSOFT` (like `RADNUS · RUNS ELGOOG`) | script, timeline |
| 10 | 4:21, sc 9; audit #12 | newcomer, audit | "Suits you." had no visible referent; ASR heard "So do you." | "That collar suits you." (ASR now exact); a `COLLAR #3` card on the pop (9.08) and under his line (9.09), since the stick figure draws no collar | script, take 9-04, timeline |
| 11 | 4:13, sc 9 | insider | "It's stuck." reads only if the prop does | A `THE CHECK · JAMMED IN THE REVOLVING DOOR` card in the two-shot (9.06). The take is unchanged: ASR still hears "It's stocking." (§9.6) | timeline |
| 12 | 4:47, sc 9; audit #16 | newcomer, insider, audit | GNIB never called Macrosoft's search engine; Gerg's question heard as an accusation | TV caption `MACROSOFT UNVEILS THE NEW GNIB`; "That's our model in your search engine. Are you really going after Elgoog with it?" (Whisper "?") | script, take 9-09, timeline |
| 13 | 4:51, sc 9 | newcomer | Tasya's real line "plays like a clip, not a reply" | "Oh, yes." (invented, outside the quotation marks) before the real line, as its own read | script, take 9-10 |
| 14 | 4:58, sc 9 | newcomer | Whose demo, whose money | Ticker `ELGOOG'S DRAB DEMO GETS A TELESCOPE FACT WRONG`, figure `ELGOOG ≈ −$100B (≈7.7%, ONE DAY)` | script, timeline |
| 15 | 4:25–4:41, sc 9; audit #15 | audit | "Unhurried" terms read at 216 wpm | Each sentence its own whole read (`{sN}`): **terms 200 wpm / 4.78 syll/s** (Act Four v5's approved Tasya: 199 wpm), **the button 143 wpm / 3.90** (was 177 / 4.72) | take 9-06, 9-08 |
| 16 | 5:11, sc 10 | newcomer | "it's 2023, by the way" came before she had claimed anything | Sydney's first line, "Hi! Isn't 2022 a lovely year? 😊" (new id 10-06) | script, take |
| 17 | 5:27, sc 10 | newcomer | The `5` couldn't be placed | The egg timer reads `5 TURNS` | script, timeline |
| 18 | 5:31, sc 10; audit #17 | newcomer, audit | "Remember me?" heard as an order | "Will you remember me? 😊" (Whisper "?") | script, take 10-05 |
| 19 | 5:36, sc 11 | newcomer, insider nit | The Atem beat had no dialogue and no stakes; the joke is that it LEAKED | Stencil `ATEM · MODEL WEIGHTS · RESEARCHERS ONLY`; GERG (O.S.): "Somebody leaked Atem's model. The whole thing's on a message board." MAS: "give it a minute. it'll be open source." Then Kram's wet OPEN SOURCE hoodie and plate pay it on the same frame (new ids 11-04, 11-05). Kram still has no voice (none in `cast.json`) | script, takes, timeline |
| 20 | 5:54, 6:15, sc 11 | newcomer | `website: working` unexplained | The demo screen's caption: `NAPKIN → WEBSITE`, then `MEMO → WEBSITE` | script, timeline |
| 21 | 6:27–6:28, sc 12 | insider, newcomer | Oigneb's line an explainer; who he is | "It's not the font, Nole. We're asking every lab to pause for six months."; plate `OIGNEB · AI PIONEER · CITATIONS: ↑` | script, take 12-02, timeline |
| 22 | 6:33, sc 12 | newcomer | Who Rezeile is, what EMIT is | Plate `REZEILE · AI-RISK RESEARCHER · IN EMIT MAGAZINE` | script, timeline |
| 23 | 6:39, sc 12 | newcomer | `PLEASE` "typed on a screen": who wrote it? | 12.04 now shows Mas at his desk writing, with the card `his sheet: PLEASE`; script note: the shot shows his hand and pen, never the word alone (to whom stays withheld until the Senate) | script note, timeline |
| 24 | 3:00.7, sc 6; audit #9 | audit | "Low-key." 0.65 s into a new shot after 22 s with no voice | Lead 0.6 → 1.2 s | timeline |
| 25 | audit F1 (#2, #6, #10, #13, #18, #20) and #3, #14 | audit | No SFX: the squeak, click, ratchet, clunk, tsss, siren J-cut, door, pop, key ring, tick, THUD, pen were silent; cues stopped into bare room; the room ducked to near-silence between lines | The Act One temp stem (§9.3). Measured in §9.2 | `act1_bed.py`, `SOUNDS` in the builder |

Not changed, on purpose: the typewriter reveal speed and the per-bed duck (shared reel code, the reel owner's: audit F3); the Act One → Two seam (the manifest, the assembler's: audit #21); every drag note (length-v2's).

### 9.2 Measured

**The act** (`measure.json`, `transcript.md`): 5:59.67, 59 beats, 57 shots, 59 lines, 481 words, median 6 words a line (5 before), 16 lines of 3 words or fewer (18), speech 159.1 s (44 % of the act). Reply gaps in conversation: median 0.70 s. Conversations over 20 s: launch night 44.3 s (12 lines), Alyi's count and the chat 31.8 s, the founders 23.8 s, the terms 25.1 s, Sydney 24.3 s (now 6 lines). Scenes (s), before → after: sc 5 89.9 → 91.3 · sc 6 35.5 → 36.1 · sc 7 9.8 → 10.3 · sc 8 34.5 → 35.5 · sc 9 71.8 → 76.8 · sc 10 26.3 → 29.9 · sc 11 45.9 → 51.9 · sc 12 27.4 → 28.0.

**Where the +18.6 s came from:** the leak's two lines ≈ +6 s; Sydney's first line ≈ +3.5 s; Tasya's terms and button read slower ≈ +3 s; "Oh, yes." and Gerg's longer question ≈ +2.5 s; the collar line ≈ +0.7 s; Radnus's rewording ≈ +1 s; small holds (Alyi's exit +0.4, "Low-key." +0.6, Rima +0.5, Oigneb +0.6) ≈ +2 s.

**The takes** (`audio/ep01/act1/dialogue/fast-v1/`, `lines-fast-v1.json`): 17 lines re-read or new (20 takes) in 62 s wall, then 3 retakes (4 takes) in 16 s, with `--prosody` (pYIN). QA: **0 problems**, 13 ear flags (`qa/fastrec-qa.json`). Every changed line has ASR recall 1.0 (names aside: "Mas" → "Moss", "Nole" → "null", "Elgoog" → "Elgog"). Retake round 5b slowed three lines that read past their articulation guide: Rima 7-01 5.47 → 5.23 syll/s (her band floor −0.04 now; still +0.6 over), Mas 11-05 5.07 → 4.76, Gerg 9-09 6.23 → 6.13 (Gerg is quick by design). `pace_check.py`: 7 far off (6 before): 5-06, 5-10 (6 words: wpm only), 7-01, 8-02, **8-03 (Radnus, by design: +37 % on the 130–150 guide he shares with Tasya; 4.67 syll/s is inside the quick guide the audit proposes)**, 9-06 (Tasya's terms at Act Four's approved pace), 12-01.

**The stem** (`act1-bed-qa.json`): 359.72 s, −26.2 LUFS, peak −7.8 dBFS, 98 SFX, 0 digital silences.

**The test render** (`ep01-act1-v2-fix.mp4`, Act One alone, 1280×720, `--jobs 2 --conc 2`): **8,632 frames decoded = planned, 0 errors**; video 359.667 s, audio 359.666 s; −17.94 LUFS integrated (pyloudnorm on the decoded AAC), sample peak −4.64 dBFS, 0 digital silences of 0.5 s or more. 59 takes laid, 0 missing. Wall 198 s for the first render (109 s of reel a minute), 178.5 s for the re-render.

**Levels in the mix, before → after** (RMS in dBFS; `gaps.py`, on the mixer's `mix.wav`; before = the `ep1s-act1` pass's Act One test mix, same mixer settings):

| | Before | After |
|---|---|---|
| Gaps between lines, launch night (median of 21) | −48.9 | **−40.0** |
| Gaps, Tasya's terms (median of 4) | −48.9 | **−39.8** |
| Gaps, Elgoog on the phone / Sydney | −37.5 / −36.3 | −34.4 / −34.3 |
| The act's head, before the first line (6.9 s) | −42.6 | −38.1 |
| The pop (9.08): 0.5 s before / after | −37.4 / −32.2 (the music just stopped) | −21.8 / −29.2 (LEVERAGE, then the pop over the lobby) |
| The THUD (12.03): 0.5 s before / after | −32.6 / −42.1 (a cut to bare room) | −38.3 / −20.8 (the THUD lands) |
| After the THUD to the sheet's end | −41.4 | −34.6 (room + the pen) |
| Speech (median of 59 lines) | −18.5 | −18.5 |

The audit's scored scenes had gaps at −31 to −39; the room-only gaps are now at −40. The remaining ~1 dB is the mixer's duck (F3).

**Frames checked** (79 stills at every beat's midpoint plus 20 chosen frames, full size): the rail on the wide (5.02); Alyi gone from the frame after "Someone should." (5.09); the typed line only after "Nobody asked one." (5.10); TASYA · THE LANDLORD · RUNS MACROSOFT on the freeze card; the jammed-check card; COLLAR #3; the TV caption; the ELGOOG ticker and figure; "Hi! Isn't 2022 a lovely year?" in the strip over the 2022 stamp; 5 TURNS; the RESEARCHERS ONLY stencil before the lines and Kram's reveal and plate after Mas's; NAPKIN → WEBSITE; the Oigneb and Rezeile plates; Mas writing under `his sheet: PLEASE`. Stick-reel limits that remain: the crate isn't drawn (the stencil carries it), Alyi's reflection is a standing figure, the collar and the check are cards.

### 9.3 The temp sound stem (new)

`audio/reel/ep01-act1-v2/act1_bed.py` builds `act1-bed.wav` (48 kHz / 24-bit stereo, git-ignored, 104 MB) and `act1-bed-qa.json` from the timeline JSON, in the pattern of Act Three's `act3_bed.py`. Its docstring lists every layer; in short:
- **Room:** the bullpen (server_hum −37 LUFS + one buzzing tube), the basement under the hole (louder, duller), the NopeAI lobby (room_tone −37 + far steps on stone), the standing desk in the dark; cut at the black.
- **Music**, the cues that were the manifest's eleven beds, now inside the stem so the script's sounds can stop them: the MM-16 temp pad (to the phone's lock, ringing out 2.2 s); **LEVERAGE from `mm08-leverage-bed-loop.wav`** (MM-08's seamless 4-bar loop, which the MM-08 README offers for "Ep1 sc 9"; v2 used the underscore's 0–17.5 s loop, which re-attacked on a cut, audit #13) from the check to the pop, stopped on the pop's sample, back on the key ring through sc 10; MM-04 and MM-17 temp pads (MM-17 cut dead by the THUD); **MM-14 THREAT as a felt-piano Fm(b6) sting** on the pen's lift ringing over the black (v2 had a slow-swelling pad there). The pads are a numpy port of `mixer.mjs` `synthPad` (same chord table and envelope rule).
- **Sydney's tick** on LEVERAGE's 96 bpm grid, from the clip through the pre-beat to the duel's downbeat (29 ticks).
- **The siren** through a phone band from the tear's last puff (the J-cut) to the lock.
- **98 SFX** from `build_timeline.py` `SOUNDS` (SFX-board files in `audio/sfx/wav`, or `synth:` kinds made in the script): Gerg's keys, the squeak, the click (the 1993 `dialog_ok_click`), the counter, the ratchet and clunk, the ceiling, the phone buzz and hearts, the bedrock thud, the odometer's lock on the 1,000,000 (peak-aligned), the palette steps, the tsss, the slab, the steps, the door, the freeze hit and shutter, the pop (`collar_pop_F5`), the key ring, the TV, the tap-dance, the telescope servos, the LEDGER stamp, the laptop closing, the egg-timer clip, the crate, the paint drip, the shutters, the cheers, the scroll, the solder sparks, the THUD, the pen.
- **`ROOM_UNDUCK_DB = 8`:** the room layer is lifted under speech by the inverse of the mixer's duck envelope, so it dips about 2 dB under a line instead of 10 (audit #3, #14). **Set it to 0 when the reel owner adds a per-bed duck (audit F3)**, or the room will rise under the talk.
- Levels are measurement targets. Nobody has heard any of it.

### 9.4 For the episode manifest (the lead / assembler)

`audio/reel/ep01-act1-v2/manifest-part.json` now holds the chapter and **one bed**. In `show/reel/ep01-full/ep01-full-v2.manifest.json`, replace the eleven `"chapter": "act1"` beds with:

```json
{"chapter": "act1", "beat": "5.01", "cue": "MM-16 / LEVERAGE / MM-04 / MM-17 / MM-14", "label": "Act One temp stem (room + temp pads + LEVERAGE loop + SFX)", "src": "audio/reel/ep01-act1-v2/act1-bed.wav", "lufs": null, "loop": "none", "in": 0, "xfade": 0.3, "until": {"chapter": "act2"}}
```

- The chapter entry is unchanged except its `sub`. The timeline key is still `ep01-act1-v2` (`sync.mjs` reads `show/reel/ep01-full/`).
- Two seams stay yours: the card's 2 s still plays its room-tone stand-in (audit #2; the stem starts at 5.01, so the card → Act One join now drops from the intro into the card's −42 room for 2 s, then the bullpen), and audit #21's `"xfade": 0.05` on Act Two's 13.01 bed, so the MM-14 sting rings over the black instead of blurring into MM-19.
- Act One is 18.6 s longer: every later chapter's EP clock moves.

### 9.5 How to re-run what this pass ran (repo root unless marked)

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py; S=<your scratch folder>
HF_HUB_OFFLINE=1 $PY $T plan --seg act1 --prev audio/ep01/act1/dialogue/lines-plan-v1.json --out $S/lines-plan-draft.json
python3 audio/reel/ep01-act1-v2/set_plan.py $S/lines-plan-draft.json audio/ep01/act1/dialogue/lines-plan-v1.json
ops/heavy.sh env HF_HUB_OFFLINE=1 $PY $T record --lines audio/ep01/act1/dialogue/lines-plan-v1.json \
  --out audio/ep01/act1/dialogue/fast-v1 --lines-out audio/ep01/act1/dialogue/lines-fast-v1.json --workers 2 --threads 3 --prosody
python3 audio/reel/ep01-act1-v2/pace_check.py
python3 audio/reel/ep01-act1-v2/build_timeline.py          # -> show/reel/ep01-full/ep01-act1-v2.json, measure.json, transcript.md
nice -n 15 $PY audio/reel/ep01-act1-v2/act1_bed.py          # -> act1-bed.wav + act1-bed-qa.json (about 20 s); after EVERY timeline build
python3 audio/reel/ep01-act1-v2/manifest_part.py --test $S/act1-test.manifest.json
# a test render of Act One alone, from a scratch copy of studio/ so the shared studio/src/reel/data/ is left alone:
#   $S/w/studio/{src (copied), package.json, remotion.config.ts, tsconfig.json (copied), node_modules, public (symlinks)},
#   $S/w/audio and $S/w/show symlinked to the repo's, and the timeline copied into $S/w/studio/src/reel/data/
cd $S/w/studio && /home/jgon/project/art/mrmas/ops/heavy.sh node src/reel/tools/episode.mjs $S/act1-test.manifest.json \
  --no-sync --jobs 2 --conc 2 --work $S/work --out $S/render/ep01-act1-v2-fix.mp4
```

- `set_plan.py` round 5 notes the id handling: `fastrec plan` gave "That collar suits you." a new id (under its 0.6 match ratio), and `RENAME` puts it back to 9-04; Gerg's Dec 5 post came back as 6-05 and is dropped again.
- A take recorded before a plan change keeps its old `gap_before_s` in `lines-fast-v1.json` (fastrec skips it by key and doesn't refresh carried fields). So picture-side gap changes for unchanged takes go in the builder's `lx` (`gap`), as 5-16 and 10-01 do.
- Scratch (temporary, may not last): `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-act1fix/`: the render and its sidecars (`render/`), 79 stills and a contact sheet (`render/stills/`), `gaps.py` and the before/after JSON, `check_fix.py`, the record logs, and backups of every file this pass changed (`*.before-fix.*`).

### 9.6 Open, and what needs a person

- **Listen**, above all to: the stem as a whole (levels, the un-duck, the pads, LEVERAGE's stop on the pop, the THUD, the sting over the black); Tasya's terms as four whole reads (natural, or four separate breaths?); Radnus at 1.02–1.03 (quick, or clipped?); the new lines (Sydney's first, the leak, "Oh, yes.").
- **Questions:** all four fixed questions now carry the question in their words and Whisper punctuates them "?", but their pitch still falls (5-10 −5.2 st, 9-09 −3.3, 10-05 −4.1, 10-06 −1.6). An ear decides; the audit's last resort (a pitch glide on the last word) isn't built.
- **"It's stuck."** (9-02) is still heard as "It's stocking." by ASR on both seeds (Kokoro's voiced /k/ release); the card now shows what's stuck. Fallback, a script change: "It's jammed."
- **Rima 7-01** reads 5.23 syll/s at 0.86, the bottom of what QA allows. If it sounds rushed, a pause after "Mas," is the next lever.
- **Handoffs:** the naming owner: ATEM has no house pronunciation (naming.md §9); 11-04 reads it "AY-tum" (`/ˈAtəm/`), a proposal. The character-file owner: `show/characters/products-as-characters.md` still lists "Remember me? 😊". The facts owner: "Oh, yes." is invented outside the quotation marks; `ELGOOG ≈ −$100B` is the parent company's market value that day; "makes things up" is Rima's paraphrase of the launch's warning. The guardrails owner: Mas's "give it a minute. it'll be open source." satirises a public company's positioning after a real leak (the model stays unnamed). `open-questions.md` #72 still quotes Tasya's old card stat; the script now has `RUNS MACROSOFT`.
- **Length, proposed not made:** §7's candidates stand. This pass's own additions, if the showrunner's marks land on them: the leak's two lines (≈ 6 s) could go back to picture-only, with the stencil alone carrying the leak; Sydney's first line (≈ 3.5 s) could go if the stamp reads in pixel art.
