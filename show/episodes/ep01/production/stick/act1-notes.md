# Ep1 stick reel v2: ACT ONE (sc 5–12)

| | |
|---|---|
| **What this is** | The handoff for Act One's chapter of the full Ep1 stick reel (`ep01-full-v2`). It covers the recorded lines, the stick timeline, the manifest part, a test render, the measurements, and what the script leaves open for staging. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1" and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". Fully programmatic: stock Kokoro voices (CASTING.md, no clones), no external APIs, `.env` untouched. The lead's call on length: build at the current length, let the showrunner mark what drags, then cut. So this pass fixed clarity and naturalness only; the length cuts in §7 are proposals, none made. |
| **Who, when** | The `ep1s-act1` pass. First sitting 2026-09-26 ≈ 23:45 → 2026-09-27 01:11 (plan, first takes at 4 workers, the builder); that session died mid-record at 01:11 (the showrunner: "try not to cook/freeze my laptop, i think that is what killed the session last"). Second sitting 01:13 → 01:50: pace retakes, the timeline, the test render and this file, every heavy step through `ops/heavy.sh` at 2 workers or 2 × 2 render tabs. |
| **State** | Ready for the lead to paste into `ep01-full-v2.manifest.json` (§5). **Same blocker as the tag's notes:** `studio/src/reel/sync.mjs` reads only `show/reel/*.json`, so it doesn't pick up `show/reel/ep01-full/` (§5.1). Nothing committed. `show/episodes/ep01/script.md` was not edited. |
| **Honesty** | I can't watch or listen. Every number is a tool's measurement (fastrec QA, the builder, the episode tool, PyAV). Judgments about how frames read come from stills. |

---

## 1. Files

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
