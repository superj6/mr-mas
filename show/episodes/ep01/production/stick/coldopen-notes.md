# Ep1 stick reel v2: the COLD OPEN (sc 1–4)

| | |
|---|---|
| **What this is** | The handoff for the cold open's chapter of the full Ep1 stick reel (`ep01-full-v2`). It covers the recorded lines, the stick timeline, the temp sound stem, a test render, and what the script leaves open for staging. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1" and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". It's fully programmatic: stock Kokoro voices (CASTING.md), no external APIs, and `.env` untouched. The lead's call on length is to build at the current length, let the showrunner mark what drags, and then cut. So this pass fixed clarity and naturalness only, and §6 proposes cuts without making any. |
| **Who, when** | The `ep1s-coldopen` pass, 2026-09-26 23:47 → 2026-09-27 01:35, in two sittings. The first planned the lines and recorded two rounds of takes. The session was then lost when the laptop froze under several passes at once. The second sitting resumed the third round of takes through `ops/heavy.sh`, built the timeline and the stem, rendered one test and wrote this file. **Then the `ep1s-coldopenfix` pass, 2026-09-27 03:00–03:30:** it fixed what the newcomer, insider and audit reads of `ep01-full-v2.mp4` found in the cold open (**§9**). |
| **State** | In `ep01-full-v2.manifest.json` since the assembly. **After the fix pass:** the chapter is still 724 frames and every beat keeps its length, so the manifest needs no change. The lead re-syncs and re-renders the cold open's segment (§9.5). **Nothing was committed.** The fix pass edited `script.md`'s cold open (sc 1–4) only, with the Edit tool. |
| **Honesty** | I can't watch or listen. Every number here comes from a tool. Every judgment about how a frame reads is from 12 stills. |

---

## 0. The short version

- **Fix pass, 2026-09-27 (§9).** The reads found one real problem in the cold open. The 1993 dialog was opaque: the newcomer "couldn't tell what was being OK'd", and in the stick reel Cancel wasn't even visibly greyed. The same read met Act One with no year until its first scene was over. The audit's hole list also had 3.7 s of near-silence around the freeze. **Three fixes, with no voiced line changed and no length change:**
  - the dialog now asks `Are you sure?`, and the stick reel strikes Cancel through;
  - the Orb's rewind toast counts the years back, catches on `2022` for a second, then slips past to 1993, so "too far" has a target and Act One's year is planted;
  - the freeze's hum is now in the band a laptop can play: the holes near the freeze went from 3.1 s to 1.0 s, and those left are the mixer's duck around "noted.".
  - The phone is also planted in sc 1's insert.
  - **No re-record:** no voiced line changed. **No cuts proposed:** neither read marked a drag in the cold open.
- **Runtime: 30.167 s** (724 frames at 24 fps), in 11 beats. By scene: sc 1 is 14.04 s, sc 2 is 5.63 s, sc 3 is 5.00 s and sc 4 is 5.50 s. The script prints 0:00–0:40, so the cold open plays about 9.8 s under its printed clock (§6).
- **Lines:** the script has 4 speaker blocks. They were recorded as **3 takes**, because the two MAS blocks in sc 1 are one real sentence and the script asks for "one sentence, one read". Together they hold **34 words** and 11.87 s of speech, which is 39 % of the runtime. The median line is **10 words** (the lines are 1, 10 and 23 words).
- **Longest conversation: 11.81 s**, from the PANEL HOST's question to the end of Mas's answer (2 turns, 33 words). The only other line, "noted.", answers a phone, not a person.
- **Gaps:** 0.65 s from the question to his answer (unhurried, as the script asks). Then 5.46 s from "forward." to "noted.", which the freeze, the invite and his read fill with picture. There are no overlaps, and the script writes none.
- **Pace fixed.** PANEL HOST went from **255 wpm** (the prep check) to **207 wpm**. The rate is still over the 150–170 turn guide, but articulation is **4.33 syllables a second**, inside its 4.2–4.8 guide (§2.2). Mas's answer moved from 173 to **167 wpm** at 3.92 syl/s (guide 3.6–4.2). QA: **0 problems, 0 flags.**
- **The test render** decodes cleanly: 724 of 724 frames, 0 errors, video and audio both 30.17 s. The mixer laid all 3 takes. It took **36 s of wall time** through `ops/heavy.sh`, at 1 job × concurrency 3 (§4).

---

## 1. Files

| What | Where |
|---|---|
| Line plan: `fastrec plan --seg coldopen`, then the say-markup, speeds, devices and flags set by hand (each row's `stick_note` says why) | `audio/ep01/coldopen/dialogue/lines-plan-v1.json` |
| Takes (1 a line, 2 for the two flagged lines). WAVs are git-ignored | `audio/ep01/coldopen/dialogue/fast-v1/` (`wav/`, `clean/`, `takes/`, `rows/`, `log/`, `qa/`, `reel/*-stringout.mp3`) |
| Lines JSON (durations, word timings, mouths, QA) | `audio/ep01/coldopen/dialogue/lines-fast-v1.json` |
| Timeline builder: the shot plan as data, with the take placement | `audio/reel/ep01-coldopen-v2/build_timeline.py` |
| **Timeline** (`"dialogueReel": true`, with `_measure` inside) | **`show/reel/ep01-full/ep01-coldopen-v2.json`** |
| Temp sound stem builder (§3.2) | `audio/reel/ep01-coldopen-v2/coldopen_bed.py` |
| Stem (git-ignored) and its QA | `audio/reel/ep01-coldopen-v2/coldopen-bed.wav`, `coldopen-bed-qa.json` |
| Test manifest, render, stills and contact sheet (**scratch, temporary**) | `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-coldopen/`: `coldopen-test.manifest.json`, `render/ep01-coldopen-v2-test.mp4` (+ `-chapters.json`, `-measure.json`), `frames/*.png`, `frames/contact.png`, `audio-measure.json`, `check.py`. The scratch studio mirror is `rt/` |
| Earlier takes (round 2), kept for comparison (scratch) | the same folder, `take-r2/` |
| **Fix pass (2026-09-27), scratch, temporary** | `scratchpad/ep1s-coldopenfix/`: `before/` (the v2 builder, stem builder, stem QA, timeline and this file as they were), `coldopen-fix-test.manifest.json`, `render/ep01-coldopen-v2fix-test.mp4` (+ sidecars, `render.log`), `frames/` (10 stills + `contact.png` + `check.json`), `frames-v2/` (the same check on the v2 test), `check.py`, `stemcheck.py`, and the studio mirror `rt/` |

---

## 2. The takes

### 2.1 What was recorded

| Id | Speaker (voice) | Text | Device | Speed | Span | wpm | syl/s | Takes | ASR |
|---|---|---|---|---|---|---|---|---|---|
| `e1-co-1-01` | PANEL HOST (`panel-host`) | Last one, Mas. What's the best part of the job? | `pa` (hall PA; dry read in `clean/`) | 0.94 | 2.90 s | 207 | 4.33 | 1 | recall 1.0 ("Mas" → "Moss", a name) |
| `e1-co-1-02` | MAS (`mas-manalt`) | "…i've gotten to be in the room when we sort of push the veil of ignorance back—and the frontier of discovery forward…" | dry | 0.85 | 8.26 s | 167 | 3.92 | 2 (s1 kept) | word-exact |
| `e1-co-2-01` | MAS (`mas-manalt`) | noted. | dry | 0.90 | 0.71 s | 84 | 2.82 | 2 (s1 kept) | word-exact |

- **One sentence, one take.** The script's sc 1 splits Mas's real line across two blocks (MCU / ECU / MCU) but asks for "the voice unbroken across both cuts: one sentence, one read". So `e1-co-1-02` is the joined text (the row's `joined_from` names both script blocks). The timeline cuts on its word timings (§3.1).
- **It lands.** The closing "…" is the record's trim mark, so the `say` ends on "forward." as a finished sentence, as the script asks.
- **The markup** is in `say`: a 0.6 s beat after "Last one, Mas." (the host turns the card), a comma and 0.3 s after "room", 0.35 s at the dash, and `gotten` as /ɡˈɑtən/. Kokoro's default /ɡˈɑtn/ was heard by ASR as "got to" in round 1.
- **Levels:** −16 LUFS each. True peak −4.1 to −3.5 dBTP. 48 kHz / 24-bit mono.

### 2.2 The pace fix and its limit

| Round | When | PANEL HOST | MAS answer | Run |
|---|---|---|---|---|
| prep check | 2026-09-26 23:1x | 255 wpm (speed at the band centre, no pause; 2.35 s span) | — | `prep-verify` |
| r1 | 23:49–23:51 | 221 wpm, 4.41 syl/s (0.97, 0.45 s pause) | 191 wpm, "got to" misheard (0.88, no pauses; from the row's `stick_note`) | 3 workers, load 34 at the end |
| r2 | about 23:54–23:58 | (kept r1) | 173 wpm, 4.17 syl/s; 1 QA flag (the 0.3 s pause opened while the voice still sounded) | 1 worker, **load 68 at the end** (the freeze that killed the session) |
| r3 (final) | 01:15:25–01:15:55 | **207 wpm, 4.33 syl/s** (0.94, 0.6 s beat) | **167 wpm, 3.92 syl/s** (0.85, comma before the pause) | `ops/heavy.sh`, 2 workers × 3 threads, **30.0 s wall**, load 11 → 15, 6 takes a minute |

- **Why PANEL HOST stays over its words-a-minute guide.** The line is 10 words and 10 syllables, all monosyllables. The turn guide (150–170 wpm) assumes normal word lengths. At an articulation rate inside its guide (4.33 syl/s against 4.2–4.8), 10 syllables take about 2.3 s, which already means about 200 wpm. The only ways to reach 170 wpm would be slowing below the voice's band floor (QA would flag the speed) or adding pauses that sound staged. I stopped at 0.94 speed with a 0.6 s beat, where the card turn motivates the pause. **An ear should confirm the warmth.** It is the series' first line.
- **Mas's answer at 167 wpm** is 12 wpm over his turn guide, with articulation inside it. It's one long real sentence with two phrase breaks. Speed 0.85 is already 0.03 under his band (0.88–0.95), and QA allows ±0.05, so a slower read would need a band change, not a re-read. I left it here.
- **QA** (`fastrec qa_generic`): 0 problems and 0 ear flags on the final three takes. `qa_v5.py` doesn't run on non-Act-Four ids, by design.

---

## 3. The timeline

### 3.1 Beats

Times are seconds on the chapter clock. `t` is the speech onset inside the beat, and `+` is the speech length.

| Beat | Start | Length | Frame | Style | Line |
|---|---|---|---|---|---|
| 1.01 | 0.00 | 4.250 | WIDE · the one wide: stage, banquet, the lit window | BASE | PANEL HOST @1.00 +2.90 |
| 1.02 | 4.25 | 5.583 | SINGLE · MCU Mas, answering; the window soft behind him | BASE | MAS @0.30 +8.26 (plays on across 1.03 and 1.04) |
| 1.03 | 9.83 | 1.542 | INSERT · the shared table from above: plink | BASE | (the answer continues) |
| 1.04 | 11.38 | 2.667 | SINGLE · MCU Mas, the sentence lands (same setup as 1.02) | BASE | (the answer ends at 12.81) |
| 2.01 | 14.04 | 0.625 | WIDE · the freeze (1 beat) | 2-TONE | — |
| 2.02 | 14.67 | 2.500 | INSERT · the phone: the invite (1 bar, held to read) | 2-TONE | — |
| 2.03 | 17.17 | 2.500 | SINGLE · MCU Mas: he reads it, looks up | 2-TONE | MAS "noted." @1.10 +0.71 |
| 3.01 | 19.67 | 2.000 | TWO-SHOT · Mas and the Orb: the iris steps, `rewinding…` + `2023` (fix pass) | BASE | — |
| 3.02 | 21.67 | 3.000 | WIDE · the room scrubs back (fx rewind); the year: `2023` 0–0.5, **`2022` 0.5–1.55 (the catch)**, then `2019` `2015` `2008` `2001` (0.40, 0.37, 0.35, 0.33 s: faster) | BASE | — |
| 4.01 | 24.67 | 4.000 | GFX · 1993: the dialog (`1993`, **`Are you sure?`**, `OK`, `Cancel` struck through in the stick reel) | 1-BIT | — |
| 4.02 | 28.67 | 1.500 | GFX · 1993: the toast `rewinding… too far` → SMASH TO the intro | 1-BIT | — |

**How the cuts sit on the answer.** The builder reads the take's word timings, so re-recording the line re-cuts the shots:
- **Cut to the ECU** at the end of "back" (4.25 + 0.30 + 5.28 = 9.83 s). This is the script's "cut in on the dash".
- **The plink** lands 0.10 s into the ECU, inside the read's own 0.44 s phrase break and 0.34 s before "and". The real sentence gets no hole, as the director's note in the script asks.
- **Back to the MCU** 10 ms before "discovery", so the sentence lands on his face. After "forward." the MCU holds 1.23 s: the lit window's phone clicks off, the applause swells, and the freeze cuts it mid-rise.

**Other staging choices:**
- **The host.** The host is a hand and a PA voice. It has **no figure in any frame**, because the stick figure would show the body the script forbids. The dialogue strip labels the line `PANEL HOST`.
- **Mas's name.** He is named in the strip once the host says "Mas" (1.905 s). The tent card `MAS MANALT · CEO, NOPEAI` reads for the whole plink insert.
- **The rail** `NOV 16, 2023 · SAN FRANCISCO` shows from 0.25 s to the cut (4.0 s on screen).
- **Places and times** in the margin: `COLD OPEN · APEC CEO Summit, San Francisco · main stage · Thu Nov 16, 2023 · day`, then the sub-sequences "the freeze" and "rewinding", then `F1.1 · a 1-bit dialog · 1993`.
- **Style moments in the margin:** the 2-TONE FREEZE (a full-room pass; "Mas never freezes"), BASE → 1-BIT in four held light steps, and F1.1 1-BIT as an era switch.
- **The freeze beat in the reel.** It uses style `2-TONE` with `fx: flash` (the freeze's pop), not `fx: freeze`. The reel's `freeze` fx would also freeze Mas and would pin a name card on the Orb. Neither is in the script.
- **Read times.** The invite `Board sync · Fri 12:00` + Accept/Decline gets the script's 1 bar (2.5 s; the text needs about 1.35 s). The 1993 toast gets 1.5 s (its read is 1.15 s, plus a beat for the joke).

### 3.2 The temp sound stem

The episode mixer lays takes and one bed per sequence, but no per-beat SFX. The cold open's sound carries its structure, so, like the tag, it gets a stem, and the manifest plays it as the chapter's single bed. The stem has these layers:
- **The hall:** room tone at −38 LUFS plus a made crowd murmur at −41. At the freeze it cuts to a hum ("never to silence"). v2 low-passed that hum at 220 Hz, at −46. **Since the fix pass it is band-passed 120–700 Hz, at −39** (§9.2).
- **The banquet's applause:** made claps through a window glass, at −29 LUFS. After "forward." it swells +6 dB and is cut by the freeze.
- **SFX:** the plink (a made glass tick over the board's `plop_water`), a slosh, the MM-14 "Freeze F4" (temp: the board's `piano_fired_F4`, "one dry upright-piano F4"), the phone's buzz (made), a thumb tap, three `orb_servo` iris steps, the toast's `glyph_blink`, and in 1993 the same blink through a 1-bit quantiser.
- **The rewind:** the hall and applause before the freeze, reversed, in four held steps of level and brightness to match the picture's light steps. v2 played it at a flat 2×. **Since the fix pass its speed follows the year counter:** 2× to the catch, 0.35× while `2022` holds (a groan), then 3× → 5× through the slip (§9.2).
- **MM-06's underscore** (movement I, the 1993 chip line) from 0.0 s at 3.01, at −26 LUFS, fading in over 0.3 s under the F4's decay. The intro's hard cut stops it.

The mixer ducks the whole stem −10 dB under the takes. The plink is inside Mas's take, so the stem sets it at a −4 dBFS peak to land near −14 dBFS after the duck (measured −13.8, §4).

---

## 4. The test render (what was measured)

Render command (§5.2): `episode.mjs <scratch manifest> --no-sync --jobs 1 --conc 3`, through `ops/heavy.sh`, from a scratch mirror of `studio/`. It rendered once, at 01:26 (r1). A second render was meant to check the shortened margin cues. It waited behind two other passes' heavy jobs (load 22), and I cancelled it rather than add load. The cue fit was checked instead with the renderer's own wrap rule (§4).

| | Measured (r1) |
|---|---|
| Plan | 1 chapter, 0:30.2 (724 frames), 1 bed, 3 takes |
| Wall | **36.2 s**: bundle 10.1, plan 0.3, render 24.2, mux 1.4. 50 s of reel a minute. Peak RSS 0.7 GB. Load 13.4 at the start |
| File | 2.7 MB, 1280×720. **724/724 frames decoded, 0 errors**; video 30.167 s, audio 30.166 s |
| Mix (the mixer's meter) | −18.64 LUFS, sample peak −6.6 dBFS, limiter not engaged, **0 digital silences ≥ 0.5 s**, 0 missing files |
| By region (pyloudnorm on the decoded AAC) | Host line −15.6 LUFS. Mas's answer −16.2. The first 0.5 s (hall, before the duck) −31.8 dBFS RMS. **The plink peaks at −13.8 dBFS against −40.8 dBFS RMS in the phrase break before it.** After "forward." −26.4 LUFS (the swell). sc 2 −19.7 (the F4 alone −24.4; "noted." −15.2). sc 3 −25.6. sc 4 −26.2. The quietest 0.25 s window is −51.5 dBFS RMS (the room floor, never black) |

**Stills I checked** at 0.1, 2.0, 7.0, 10.6, 12.5, 14.3, 16.5, 18.6, 21.0, 23.0, 26.5 and 29.8 s (`frames/contact.png`):
- **Text and labels.** The rail shows from 0.25 s. The name label reads "MAN IN THE ARMCHAIR" before the host says "Mas", and "MAS" after. The strip keeps Mas's line running, word by word, across the MCU → ECU → MCU cuts. The tent card and the invite are legible full frame. The 2-TONE palette is on sc 2's three beats. The `◀◀ REW` treatment shows on 3.02. The 1-BIT paper field shows with `1993`, `OK`, `Cancel`, and then the toast.
- **Margin.** r1 truncated several cues at their two-line limit, so the timeline now shortens every cue to 72 characters or fewer. **Not re-rendered.** Running `look.ts`'s `wrap()` rule in Python at the margin's 38 characters a line shows all 27 cue lines (with the bed label) fit in 2 lines, and every caption in 2–5 of its 8. The scratch mp4 still shows r1's longer cues.
- **What the stick picture can't show:** the hailstone's arc, the host's hand and card, the phone on the table, the jaw light's step, and the four light steps. Captions and cues carry them.
- **Stand-in limits.** The `stage` set's upstage "window" is a framed rectangle with a rising line. It reads more like a slide than a window onto a bay. The Orb keeps its cyan in the 2-TONE frame.

---

## 5. For the lead: putting it in `ep01-full-v2.manifest.json`

**Chapter** (first, after the reel's title slate; the intro chapter follows with its own sound):

```json
{"id": "coldopen", "label": "COLD OPEN", "sub": "sc 1-4 · fastrec takes", "from": "ep01-coldopen-v2", "acts": ["COLD OPEN"]}
```

**Bed** (it replaces the example manifest's three cold-open beds: the room pad, the MM-14 pad and the MM-06 source, which are all inside the stem now):

```json
{"chapter": "coldopen", "beat": "1.01", "cue": "MM-14 / MM-06", "label": "cold open stem: hall, plink, F4, rewind, MM-06",
 "src": "audio/reel/ep01-coldopen-v2/coldopen-bed.wav", "in": 0, "loop": "none", "lufs": null, "xfade": 0.05}
```

- **Keep `"lufs": null`.** The stem stays at its built level (−26.0 LUFS, un-ducked). With a number, the plink and the F4 get renormalised against the room.
- **The intro gates the bed off hard** (video edge 0.03 s), which is the script's SMASH TO. The stem runs 0.5 s past the chapter so a join never reads short.
- **After any change to `ep01-coldopen-v2.json`, rebuild the stem too.** It reads beat times and `sounds` from the JSON.
- The chapter's `known` list can stay empty: the timeline's cast marks THE ORB and PANEL HOST as known, and names Mas at the host's "Mas".

### 5.1 Blocker (the same one the tag notes report): `sync.mjs` reads only `show/reel/*.json`

**Resolved, 2026-09-27.** The reel README says `sync.mjs` now reads one level of subfolders, and the v2 assembly synced this timeline as `studio/src/reel/data/ep01-coldopen-v2.json`. What follows is the history.

`studio/src/reel/sync.mjs` listed `show/reel/` flat (line 141). A timeline in `show/reel/ep01-full/` isn't synced, so `from: "ep01-coldopen-v2"` fails with "timeline … not found". The reel code isn't mine to change. The options are to teach `sync.mjs` the subfolder, keep a flat copy or symlink in `show/reel/`, or render from a scratch mirror as this test did.

### 5.2 How to re-run (exact commands, from the repo root)

```sh
REPO=$PWD; PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
# 1. lines: only if the cold open's text changes (--prev keeps the ids); then re-apply the hand settings in each row's stick_note
HF_HUB_OFFLINE=1 $PY $T plan --seg coldopen --out <scratch>/co-plan.json --prev audio/ep01/coldopen/dialogue/lines-plan-v1.json
# 2. record (resumable: lines whose key is unchanged are skipped; flagged rows get 2 takes)
HF_HUB_OFFLINE=1 ops/heavy.sh $PY $T record --lines audio/ep01/coldopen/dialogue/lines-plan-v1.json \
  --out audio/ep01/coldopen/dialogue/fast-v1 --lines-out audio/ep01/coldopen/dialogue/lines-fast-v1.json --workers 2 --threads 3
# 3. timeline, then the stem (always both)
python3 audio/reel/ep01-coldopen-v2/build_timeline.py
$PY audio/reel/ep01-coldopen-v2/coldopen_bed.py
# 4. a segment test from a scratch mirror of studio/ (it leaves studio/src/reel/data alone). RT = a scratch folder
mkdir -p $RT/studio $RT/show/reel $RT/out; ln -sfn $PWD/audio $RT/audio
ln -sfn $PWD/studio/node_modules $RT/studio/node_modules; ln -sfn $PWD/studio/public $RT/studio/public
cp studio/package.json studio/remotion.config.ts studio/tsconfig.json $RT/studio/; cp -r studio/src $RT/studio/src
cp show/reel/ep01-full/ep01-coldopen-v2.json $RT/show/reel/
(cd $RT/studio && node src/reel/sync.mjs)
# the manifest = the chapter + bed of §5, with "titleCard": 0 (a copy: scratchpad/ep1s-coldopen/coldopen-test.manifest.json)
(cd $RT/studio && $REPO/ops/heavy.sh node src/reel/tools/episode.mjs <manifest> --no-sync --jobs 1 --conc 3 \
  --work <scratch>/work --out <scratch>/ep01-coldopen-v2-test.mp4)
```

---

## 6. Length (proposals only, nothing cut)

- **It plays 30.2 s against a printed 0:40.** The script's header estimated sc 1 at "≈ +2.5 s" over its 20 s. It plays 14.0 s, because nothing holds beyond the talk and the two picture events (the plink, and the phone clicking off). The printed scene clocks predate the scene-craft pass's cut of the 2.5 s window pan.
- **No cuts proposed.** There are no dead holds to take out. Every beat carries a line, a read or a style event. If the showrunner marks anything, the only soft spot is **3.01–3.02 (5.0 s, the rewind)**, which could lose about 1 s: the 2S to 1.5 s and the scrub to 2.5 s. The script sets it at 2 bars to sit on MM-06, though, so I kept that.
- **If anything, the risk is too fast, not too slow.** The **1-beat freeze wide** (2.01, 0.625 s) is short for a first-time viewer to register "two things stay in colour", and the 1.23 s hold after "forward." carries the phone-off and the swell. Watch both.

---

## 7. What the script leaves unclear for staging

1. **Resolved in the fix pass:** sc 1's `[ECU]` now shows the phone face-up and dark beside his glass. **The phone isn't planted in sc 1.** Sc 2 finds it "lying face-up on the shared table beside his glass". But sc 1's table has two glasses and a tent card, and the plink ECU is "the shared table from above" without it. Either show it dark in 1.03 (the reel's cue suggests this), or it appears only at the freeze.
2. **"The host's water mid-slosh" at the freeze.** The slosh happens at the plink (9.9 s), and the freeze comes 4.1 s later (14.0 s). A glass slopping over its rim has settled by then. Either the freeze catches a still-wobbling surface, or "mid-slosh" drops from the freeze list. The reel's caption says "mid-slosh" as written.
3. **Does the Orb freeze?** Sc 2 lists what freezes and says "two things stay in colour: Mas, and the phone". The Orb isn't named. Its iris steps in sc 3, so it's live again by then. The reel draws it in the frame, and the stick palette happens to keep its cyan.
4. **When does the freeze release?** Sc 3 is `[BASE → 1-BIT]` and the rewind shows "the ovation sits down, the host's water climbs back", so the world is live by 3.01. The reel releases on the cut to 3.01. The script doesn't say whether the release is a cut or a visible un-freeze.
5. **The jaw light.** It steps "from the invite's white to the calendar's pale blue" while the phone lies face-up on a side table and he looks up at the host. That's plausible from below, but the board artist should check the angle in the MCU.
6. **The sip.** "He sips" comes after the tap inside a 2.5 s MCU. "noted." ends at 1.81 s, which leaves 0.69 s. That's tight for a sip read. If it matters, the MCU grows by about half a beat.
7. **Mas's voice is dry; the host's is on the PA.** The script puts the host "through the hall's PA" and says nothing about Mas's mic, though the hall bed has "the faint room of a lapel mic". I kept Mas dry, since the camera is his POV and he is the close sound. An ear should confirm the two don't sound like different rooms.
8. **Sc 4's toast has no length** ("4 s + toast"). I used 1.5 s.
9. **The rail's length** isn't given. It holds through the wide (4.0 s on screen).

---

## 8. Needs a person

- **Listening to everything:** the host's warmth at 207 wpm, the plink's size against the voice, the made applause and murmur (they're synthetic), the F4 against MM-06's entry, and the 1-bit blink.
- **Watching** the 1-beat freeze and the 5.5 s of 1993.
- **The newcomer and insider reads** across the full episode reel. *(Done on `ep01-full-v2`; the cold open's findings and fixes are in §9.)*

---

## 9. The fix pass (2026-09-27): what the reads found, what changed, and why

**Brief.** Fix the cold open's clarity and naturalness problems that the reads of `out/ep01/reel/ep01-full-v2.mp4` found: newcomer confusions, outside-knowledge gaps that matter, blurted or unnatural lines, conversations cut too soon, and audit spots that hurt. **No length cuts** (the lead's call: the showrunner marks the drag first). The showrunner's standing note for this pass: "try not to cook/freeze my laptop". Every heavy step ran through `ops/heavy.sh`, one at a time, at 1 job × concurrency 3; the analysis ran single-threaded at `nice 19` / `ionice` idle. The load average stayed about 1–4 while I worked.

### 9.1 What the reads said about the cold open (ep 0:03.0–0:33.2)

| Source | Finding | Action |
|---|---|---|
| Newcomer §2, 0:28–0:33 | "A 1993 OK/Cancel box with 'rewinding… too far'. I couldn't tell what was being OK'd. It pays off later, but it's opaque at first sight." In the v2 stick frames, Cancel was drawn as a live pill beside OK, so the greyed-out joke wasn't visible at all | **Fixed:** the dialog asks `Are you sure?`, and the stick reel strikes Cancel through (§9.2) |
| Newcomer §2, 1:05–1:58 | Act One has no date until `NOV 30, 2022`, after its first scene; "only the 'rewinding' gag told me this was a year before the cold open" | **Helped from here:** the rewind's year counter catches on `2022`. Act One's rail is its owner's (§9.4) |
| Newcomer §1 (the retell) | The cold open read as written: the CEO of NopeAI, the frontier answer, `Board sync · Fri 12:00`, "noted.", the rewind that overshoots to 1993 | Kept |
| Insider §4 | Protect the real APEC quote into `Board sync · Fri 12:00` / "noted." (echoed at 12:44 and the tag), and the OK/Cancel bookend with the intro and 13:28 | Kept. The new dialog text uses neither the intro's words (`MAS MANALT` / `no equity.`) nor Act Four's (`MAS MANALT`) |
| Insider §1–3 | No cold-open drag, no telling, nothing written-not-spoken | — |
| Audit §3, §6, §4.2 | The panel's exchange and the invite are "complete and answered". The cold open → intro seam is fine. No cold-open question plays as a statement (the host's is a wh-question) | — |
| Assembler §4.3, group D | 5 holes under −42 dBFS, 3.7 s in all: three around the freeze, the invite and "noted." (the hum was at −46 LUFS and below 220 Hz), and two MM-06 rests in 1993 | **Fixed the freeze part** (§9.2). Kept the two 0.3 s rests in 1993 (§9.4) |

### 9.2 What changed

**`show/episodes/ep01/script.md`, cold open only** (the Edit tool, re-read first; each change has an italic *"Stick-reel fixes, 2026-09-27"* note beside it; another pass edited Act Three in the same minutes, and its edits are untouched):
- **sc 1 `[ECU]`:** "His phone lies face-up and dark beside his glass." The freeze's "Mas, and the phone" now lights something we've already seen (open item §7.1).
- **sc 2 `SOUND:`:** a note to keep the hum in the low mids, where a laptop speaker can play it.
- **sc 3:**
  - The `SCENE:` line gains "It aims for 2022, where the story starts, and overshoots."
  - A `SOUND:` line: the scrub drags to a groan on the catch and lurches on the slip.
  - The `[2S]` toast is now `rewinding…` · `2023` `[INVENTED]`.
  - The `[W]` counts back, **catches on `2022` for about a second**, then slips (`2019` · `2015` · `2008` · `2001`, faster and faster) into the white.
- **sc 4:**
  - The `SCENE:` line is updated.
  - The dialog reads **`Are you sure?`** `[INVENTED]` over `OK` and a greyed `Cancel`.
  - The note names `Continue?` as the room's alternative.

**Timeline** (`audio/reel/ep01-coldopen-v2/build_timeline.py` → `show/reel/ep01-full/ep01-coldopen-v2.json`):
- New constants: `TOAST`, `YEAR_CATCH = (0.50, 1.55)`, `SLIP`, `YEARS_302`, `ASK` and `CANCEL_OFF` (Cancel with U+0336 on every letter; the reel draws `UI:` items as pills and can't grey one).
- 1.03: the caption plants the phone. 3.01: `2023` joins the toast.
- 3.02: the toast plus the year items, and two `orb_servo`s (the catch at −24, the slip at −27).
- 4.01/4.02: `Are you sure?` and the struck Cancel.
- The captions and cues follow. Every cue fits the margin's 2 lines (the `wrap()` rule at 38 characters: 0 over).
- **Every beat keeps its length** (the `reelDur` lists are identical; 724 frames), so the episode clock and every later chapter are unchanged.

**Stem** (`audio/reel/ep01-coldopen-v2/coldopen_bed.py` → `coldopen-bed.wav` + `-qa.json`):
- **The freeze's hum:** `HUM_BAND = (120, 700)` Hz and `HUM_LUFS = −39`. It was low-passed at 220 Hz, at −46 LUFS.
  - **Why:** the board's `room_tone.wav` peaks at 40–45 Hz. The old hum's energy above 200 Hz sat 9.3 dB under its total, about −55 dBFS in the invite read. That's silence on a laptop speaker once the F4 has decayed (the F4 is −30 dB down by 2.8 s).
  - Now that band is at about −43 dBFS. The drop from the hall is still about 9 dB broadband (the stem's hall −31.9 → −41.0 dBFS RMS), so it still reads as a drop.
- **The rewind follows the counter.** The script reads the `2022` item's `at` / `until` from 3.02's `onscreen`. The speed is 2× to the catch, `CATCH_SPEED = 0.35` while it holds, then `SLIP_SPEED = (3, 5)` rising to the white. The speed is smoothed at 7 Hz, like a reel with inertia, so it doesn't click. It now uses 7.3 s of pre-freeze sound (it was 6).
  - The measured spectral centroid (the stem, MM-06 included) is 2,462 Hz before the catch, 1,710 Hz in it and 1,927 Hz in the slip.

**Why these three and not more:**
- **`Are you sure?`** is the one first-sight confusion the reads found inside the cold open. The question can only be answered OK, so it carries the season's rule ("he always takes the offer") on sight. It lands seconds after he accepts an invite without reading it.
  - It leaves the intro's and Act Four's dialog text alone, so the three dialogs build: the question, then his name on it (the intro, 5 s later), then the Cancel that works (13:28).
  - Its read is about 0.9 s inside the dialog's 4 s.
- **The counter** answers "too far — from what?" with a picture, not a line. It plants Act One's year without a rail and costs no time: it rides the scrub's 3 s.
  - The intro then plays the same years forward from 1993 (2008, 2014, 2015).
  - The hold on `2022` is 1.05 s: a 4-character read needs about 0.45 s, so it reads as a stop, not a flicker.
- **The hum** is the audit's "random pauses of silence" in this chapter (SHOWRUNNER-NOTES 13). The script already said "never to silence"; the v2 stem honoured that only on full-range speakers.

### 9.3 Measured (the fix pass's test render)

It rendered twice. r1 (28.8 s wall) had one 3-line cue truncated. **r2** is the one measured here. The command is in §9.5.

| | Measured (r2) |
|---|---|
| Wall | **27.8 s**: bundle 5.2, plan 0.2, render 20.9, mux 1.3. 65.1 s of reel a minute. Peak RSS 0.71 GB. Load average 0.8–2 at the time |
| File | 2.8 MB, 1280×720. **724/724 frames decoded, 0 errors.** Video 30.167 s, audio 30.187 s |
| Mix (the mixer's meter) | −18.67 LUFS, sample peak −6.6 dBFS, **0 digital silences ≥ 0.5 s**, 0 missing files |
| By region (pyloudnorm on the decoded AAC) | Whole −18.7. Host line −15.6. Mas's answer −16.2. sc 2 −19.7. sc 3 −25.5. sc 4 −26.2. Peak −6.4 dBFS. All the same as v2, except sc 3 (−25.6 in v2) |
| **Holes** (50 ms RMS of the louder channel under −42 dBFS for ≥ 0.3 s, chapter clock) | **v2 test: 5 runs, 3.72 s** (15.76 +0.56, 16.47 **+1.77**, 18.93 +0.76, 24.93 +0.32, 28.06 +0.31). **Fix: 4 runs, 1.64 s** (17.83 +0.41 and 18.94 +0.60, the duck either side of "noted."; then the same two 1993 rests) |
| Freeze + invite, 16.8–18.2 s | Median 50 ms RMS **−44.9 → −41.3 dBFS** broadband. Above 200 Hz (the stem): **−55 → −43 dBFS** |

**Ten stills** (`frames/contact.png`, at 10.6, 16.0, 17.6, 20.9, 21.95, 22.7, 23.5, 24.4, 26.5 and 29.8 s):
- The insert's caption names the phone.
- 3.01 shows `rewinding…` over `2023`. 3.02 shows `2023`, then `2022` at 22.7, `2019` at 23.5 and `2001` at 24.4.
- 1993 shows `1993` / `Are you sure?` / `OK` / a struck-through `Cancel`, all legible at 1280×720. 4.02 adds `rewinding… too far` in a second column.
- **One stand-in blemish:** the reel's own `◀◀ REW` label (`fx: rewind`, `Stage.tsx` `Rewind`, fading out over 80 % of the beat) sits over the `rewinding…` card for 3.02's first 1.5 s or so. The year card under it reads clearly. It's reel code, not mine (§9.4).

### 9.4 Not changed, and handoffs

- **No re-record.** No voiced line changed, so fastrec didn't run. The takes are those in §2.
- **No length change, and no cuts proposed.** Neither read marked a drag in the cold open, and §6 stands.
- **The two holes left around "noted."** are the mixer ducking the stem −10 dB (0.25 s pre-roll, 0.2 s ramp, 0.6 s release). The fix is the audit's F3, a per-bed duck setting in `mixer.mjs`, which belongs to the reel's owner.
  - **Coupling warning for whoever does F3:** if this bed gets `"duck": 0`, the stem plays 10 dB hotter under the talk. The plink, set to −4 dBFS peak so it lands near −14 after the duck (§3.2), and the tap (−26) would both need to come down about 10 dB in `SPEC`'s `sounds`. The hall would need a look too. Re-level before re-rendering.
- **The two 1993 rests** (0.32 and 0.31 s) are MM-06's own rests over the mixer's −50 LUFS floor. They're music, not a pause, so I kept them. If an ear disagrees, add a faint 1-bit hiss under sc 4, never a held tone (X3's no-flatline note).
- **For the reel's owner (optional):** skip the `◀◀ REW` label when a card occupies its spot (y 92–132, x 560–720).
- **For Act One's owner:** the counter now plants 2022, but the newcomer's note at 1:05–1:58 (no year on screen until after sc 5) is still Act One's `NOV 30, 2022` rail to move.
- **For the Act Four pixel pass:** nothing. The 1993 dialog's frame (a plain single rule, no icons) is unchanged, so "drawn exactly like the 1993 one" still holds; only the message line is new.
- **For facts:** the counter's years are the Orb's UI, not claims. `Are you sure?` is invented UI text and is tagged `[INVENTED]`.

### 9.5 How to re-run (exact commands; from the repo root unless marked)

```sh
REPO=$PWD; PY=audio/.venv-casting/bin/python
# timeline, then the stem (always both; the stem reads the JSON's beat times, sounds and the 3.02 '2022' item)
python3 audio/reel/ep01-coldopen-v2/build_timeline.py
OMP_NUM_THREADS=1 nice -n 19 $PY audio/reel/ep01-coldopen-v2/coldopen_bed.py
# a segment test from a scratch mirror, as in §5.2 (RT = a scratch folder; M = the test manifest of §5.2)
cp show/reel/ep01-full/ep01-coldopen-v2.json $RT/show/reel/ && (cd $RT/studio && node src/reel/sync.mjs)
(cd $RT/studio && $REPO/ops/heavy.sh node src/reel/tools/episode.mjs $M --no-sync --jobs 1 --conc 3 \
  --work <scratch>/work --out <scratch>/render/ep01-coldopen-v2fix-test.mp4)
# frames, stills and holes (single-threaded; the script is scratchpad/ep1s-coldopenfix/check.py and is short:
# PyAV decode, 50 ms RMS on a 10 ms hop, runs under -42 dBFS >= 0.3 s)
OMP_NUM_THREADS=1 nice -n 19 $PY <scratch>/check.py <scratch>/render/ep01-coldopen-v2fix-test.mp4 <scratch>/frames
```

**For the lead, into the episode:**
1. Run `node src/reel/sync.mjs` from `studio/`. It reads `show/reel/ep01-full/` and refreshes `data/ep01-coldopen-v2.json`.
2. Re-render with the usual `episode.mjs show/reel/ep01-full/ep01-full-v2.manifest.json …`. The cold open's segment re-renders because its data changed, and the mix is rebuilt because the stem changed. The manifest needs no edit.

### 9.6 Needs a person

- **Listening:**
  - Is the −39 LUFS hum a "low filtered hum", or too present?
  - Does the groan on the catch read as a tape dragging, and the lurch as a slip?
  - The servo on the catch.
- **Watching:**
  - Does the 1.05 s hold on `2022` read as "it tried to stop here", or just as a counter?
  - Does `Are you sure?` land as the joke, or does `Continue?` read better?
  - Does the strike read as "greyed out" in the stick reel?
- **A newcomer re-read** of the cold open in the next episode render.
