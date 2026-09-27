# Ep1 stick animatic: Act Two (sc 13–17, "the regulate-me tour"), v2 notes

| | |
|---|---|
| **What this is** | The handoff for the Act Two chapter of the full Ep1 stick-figure reel: the takes, the timeline, the test render, what was measured and what the script leaves open. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1", and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". The lead's ruling on length: build the whole episode at its current length; the showrunner marks where it drags; then we cut. So this pass fixed clarity and naturalness only. Length cuts are **proposed** in §7, not made. |
| **Who, when** | The `ep1s-act2` pass, 2026-09-26 23:47 to 2026-09-27 about 01:45, in two sessions. The first session was cut off (the laptop froze while four segment recordings ran at once). The second resumed its takes and finished. |
| **Status** | The takes, the timeline and a test render are done. **Nothing was committed** (the lead commits). The chapter still needs the lead's manifest (§4.3) and an ear. |
| **Honesty** | I can't watch or listen. Every number here comes from a tool. Anything about how a line sounds or a frame reads is a judgment from numbers and stills. |

---

## 0. The short version

- **Runtime: 3:37.4 of reel for Act Two** (5,218 frames at 24 fps), with 39 voiced lines, 284 words and 96.2 s of speech (44 % of the act). Median 6 words a line, mean 7.3; 9 lines of three words or fewer.
- **Longest conversation: 40.5 s**, the Senate exchange from Sucram's "Don't mind me" to "Do you make a lot of money doing it?" (10 lines, 5 speakers, 93 words). Next is the White House from the photographer's wide to "it's a good photo" (36.9 s, 12 lines, 6 speakers).
- **Gaps between lines** (last word to next first word, inside a scene): median 0.9 s. 13 are 0.2–0.6 s (quick replies), 14 are 0.6–1.6 s (loaded or across a cut), 8 are over 1.6 s (picture business between lines), none under 0.2 s. No overlaps: the script writes none in Act Two.
- **It plays about 1:12 shorter than the script's own estimate** (the header puts Act Two at about 4:49.5 as played; printed 4:19). The talk is at recorded pace with natural gaps, so the difference is in the script's word-count estimate and its bar counts, not in rushed staging. See §5.
- **Pace.** Five lines ran far over their speaker's guide in the resumed takes. I slowed them to the band floor and re-read them, then took three further (§3). 12 QA flags are left for the ear, and none is a file problem.
- **The test render** (Act Two alone, 720p) decodes every frame with 0 errors, and its video and audio lengths match. The mixer laid all 39 takes at −17.4 LUFS with no silence of 0.5 s or more. The stills show every shot staged as planned (§6).

---

## 1. What was built, and where

| Piece | Path | Notes |
|---|---|---|
| Recording plan | `audio/ep01/act2/dialogue/lines-plan-v2.json` | 39 rows, written by `set_plan.py` from `fastrec plan --seg act2`. Each row's `plan_note` says what was set and why |
| Plan setter | `audio/reel/ep01-act2-v2/set_plan.py` | The `say` markup, speed, gap and flag for every line, with the revision history (r2–r5) in its docstring and notes. `--out F` writes a dry run |
| Takes | `audio/ep01/act2/dialogue/fast-v2/` (`wav/`, `takes/`, `rows/`, `log/`, `qa/`); `audio/ep01/act2/dialogue/lines-fast-v2.json` | 1 take a line, 2 for the 8 flagged lines. 48 kHz / 24-bit mono. The WAVs are git-ignored |
| Timeline builder | `audio/reel/ep01-act2-v2/build_timeline.py` | The shot plan (one beat per shot or held setup) as data, and the placement of each take |
| **Timeline** | **`show/reel/ep01-full/ep01-act2-v2.json`** | 56 beats (49 shots; 7 beats are a freeze-card or flash-print inside a shot), `"dialogueReel": true` |
| Report | `audio/reel/ep01-act2-v2/report.py` → `transcript-v2.txt`, `measure.json` (same folder) | The transcript on the act and printed episode clocks, and every measurement in §0 and §5, with Act Four's definitions so the numbers compare |
| Test render | `out/ep01/reel/segments/ep01-act2-v2-test.mp4` (+ `-chapters.json`, `-measure.json`, `-sheet.png`) | Act Two alone as an episode chapter, 720p, over the temp beds in §4.3. A preview for the lead and the showrunner; the full episode render replaces it |
| These notes | `show/episodes/ep01/production/stick/act2-notes.md` | |

`show/episodes/ep01/script.md` was **not edited**.

---

## 2. How to re-run it (exact commands, from the repo root unless marked)

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
S=<your scratch folder>

# 1. draft from the script, then set the plan (check "added/dropped/changed" is empty; if not, update SET in set_plan.py)
HF_HUB_OFFLINE=1 $PY $T plan --seg act2 --out $S/plan-draft.json
python3 audio/reel/ep01-act2-v2/set_plan.py $S/plan-draft.json        # -> audio/ep01/act2/dialogue/lines-plan-v2.json

# 2. record (resumable: finished lines with the same key are skipped). Always through ops/heavy.sh, 2 workers at most.
HF_HUB_OFFLINE=1 ops/heavy.sh $PY $T record --lines audio/ep01/act2/dialogue/lines-plan-v2.json \
  --out audio/ep01/act2/dialogue/fast-v2 --lines-out audio/ep01/act2/dialogue/lines-fast-v2.json --workers 2

# 3. timeline + measurements (a second or two each)
python3 audio/reel/ep01-act2-v2/build_timeline.py     # add --check to fail on any warning
python3 audio/reel/ep01-act2-v2/report.py

# 4. a test render of this chapter alone (see §6 for why it runs from a scratch mirror of studio/)
```

The test render ran from a scratch **mirror** of `studio/`: a copy of `studio/src`, `public/` and the config, with `node_modules`, `audio/` and `show/` symlinked. The reason is that `sync.mjs` reads only the top level of `show/reel/`, so it doesn't see `show/reel/ep01-full/`, and it rewrites `studio/src/reel/data/`, which other passes share. The timeline was copied into the mirror's `src/reel/data/`, and then (run from the mirror's `studio/`):

```sh
ops/heavy.sh node src/reel/tools/episode.mjs $S/act2-test.manifest.json --no-sync --jobs 2 --conc 2 \
  --work $S/work --out $S/render/ep01-act2-v2-test.mp4
```

The test manifest is the chapter entry and beds in §4.3 with `"titleCard": 0`. **For the full episode**, the lead either teaches `sync.mjs` to read `show/reel/ep01-full/*.json` or copies the chapter timelines up a level. Either way `from: "ep01-act2-v2"` is the key.

---

## 3. The recording

### 3.1 Runs

| Run | When | What | Measured |
|---|---|---|---|
| r1 | 09-26 23:54 | All 39 lines, 3 workers | Interrupted; 11 rows finished |
| r2 | 09-27 01:08 | 28 lines plus 10 ASR-only, 4 workers, after hand-slowing 13-02, 13-08 and 13-14 | Interrupted at 01:11 (it overlapped three other segments' recordings). 38 of 39 rows |
| r3 | 01:17–01:19 | 17-03 (missing) and 5 pace fixes; 18 rows' ASR | 6 lines, 9 takes, 66.1 s wall, 2 workers, load about 14 |
| r4 | 01:20–01:21 | 3 lines a step slower (13-11, 13-14, 13-17); 15-03 and 15-09 re-read | 5 lines, 8 takes, 66.0 s wall, 1 worker |
| r5 | 01:22–01:23 | 15-03 as three whole reads; 15-09's comma opened | 2 lines, 3 takes, 37 s wall, 1 worker |

Every run after r2 went through `ops/heavy.sh`, and its QA reported **0 problems**: format, loudness ±0.1 LU, true peak, handles, no digital black, speed inside the band ±0.05. The superseded takes of r3 and r4 are in the scratch folder (§9). The r2 hand edits and all later changes are folded into `set_plan.py`, so the plan rebuilds from the script.

### 3.2 Pace: the lines that were far off their guide

"Far off" means more than about 25 % over the speaker's words-a-minute guide on a line of 6 words or more (the prep check's example was PANEL HOST at 255 wpm against 150–170), or articulation (syllables a second) more than 10 % outside its guide. Short lines of monosyllables read high in wpm with normal articulation, so both numbers are given.

| Line | Speaker | Before (r2) | After | Change |
|---|---|---|---|---|
| 13-11 "They ask it the things…" | RADNUS | 240 wpm, 4.47 syll/s | **216 wpm, 4.15** | speed 0.97 → 0.87, the pause between sentences 0.3 → 0.5 s |
| 13-14 "Folks, I just want to say one thing." | NEDIB | 234, 4.21 | **230, 4.08** | 0.94 → 0.90. Left there: the script wants it to run on ("he walks in mid-sentence"), and slowing it didn't move the rate |
| 13-15 "Whatever you promise…" | NEDIB | 188, 5.43 | **175, 5.41** | 0.97 → 0.93, comma opened 0.2 s. Articulation is still fast; the pauses carry the change |
| 13-17 "Longer than that. I've got a big desk." | NEDIB | 212, 4.55 | **196, 4.48** | 0.97 → 0.94, pause 0.3 → 0.45 s |
| 15-06 "You may have had in mind…" [P✓] | LAHTNEMULB | 220, 4.87 | **202, 4.50** | 0.87 → 0.82, comma opened 0.35 s |
| 15-12 "You love it. Do you make a lot of money…" | A SENATOR | 249, 5.41 | **210, 4.79** | 0.85 → 0.80, pause 0.3 → 0.5 s |
| 17-06 "The more you buy, the more you save." [V] | NESNEJ | 253, 4.60 | **223, 4.35** | 1.02 → 0.97, comma opened 0.3 s |

What is still over its wpm guide is short lines, where the rate is monosyllables rather than rushing: 13-14 (230), 15-05 "Most of them." (231, 3 words), 15-15 (196), 13-18 "it's a good photo." (180). **These are the lines for an ear to judge first.**

### 3.3 Flags left for the ear (from `fast-v2/qa/fastrec-qa.json`)

| Line | Flag | Read |
|---|---|---|
| 15-09 "I am, a little." | ASR hears "I am a littles." on every seed and wording tried (r2, r4 ×2, r5 ×2) | A short burst after "little" (the envelope rises from −39 to −18 dB about 0.1 s after the word). The likeliest cause is how this voice releases "little". **Listen first.** If it's audible, trim the tail by hand or try another phrasing |
| 13-01, 13-07, 17-05, 17-06 | a pause opened while the voice still sounds (dips −15.9 to −27.9 dB) | Probably fine at these depths. 17-06's comma is the one to check |
| 13-03, 13-16, 15-04, 15-05 | articulation under the guide | Short lines (3–4 words) |
| 13-08 "We own camera two." | ASR "too" | Homophone |
| 15-03 "…One of forty-seven." / 15-07 "gtp-4…" | ASR "47" / "GTP4" | Number and name false misses (documented in fastrec's README) |

---

## 4. The timeline

### 4.1 How it's built

- **One beat per shot or held setup**, taken from the script's shot markers: `[W]` → wide, `[M]`/`[2S]`/`[OTS]` → medium, `[MCU]` → close, `[ECU]`/`[HIGH]` → insert. A freeze card or the ledger flash-print inside a shot is its own beat, marked `cont` with the shot's `shotId`.
- **Conversations are held.** The Mas/Radnus two-shot carries 4 lines (15 s in the script, 12.2 s here). The Radnus/Mario two-shot with Sirrah off screen, the OTS on Nedib, the Mas/Sucram two-shots, the OTS onto the dais and the Mas/Mario two-shot at the sheet each carry 2–4 lines.
- **Lines are placed from the takes.** A line's speech starts at the previous line's speech end plus the planned gap. The first line in a shot follows the shot's lead-in, or the planned gap if that is longer. Two gaps are set by the picture:
  - the clone's "Are you nervous?" waits 1.2 s for the card snatch;
  - the senator's "Is there anything…" waits 0.9 s for the second red light.
- **The clone's first line pre-laps over black** into sc 15 (written): it starts 0.35 s into the black, and the cut to his mouth lands on "seen".
- **Place and time** labels open each scene (`seq`), and each scene's rail is on screen from about 0.2 s. Cards, plates and rails are timed to read (about 0.25 s plus 0.05 s a character). Name reveals follow the script's cards and plates.
- **The margin** carries the music cue and style notes: the 2-TONE freeze cards, the flash as a white step, THE CLONE's proposed upscale filter, the one lens look, the LEDGER flash-print, and the reflected crack with its fallback.

### 4.2 Scene by scene

| Sc | Reel | Printed | Shots | What drives it |
|---|---|---|---|---|
| 13 White House | 67.8 s | 76 s (5:54–7:10) | 13 | Sirrah's lesson, the Mario two-shot, three tripods, the right-to-left pan to Mas's lens look, the Radnus exchange, Nedib's entrance with the flash card, the photo |
| 14 the bridge | 10.8 s | 10 s (4 bars) | 6 | Picture only, plus the clone's pre-lap over black |
| 15 Senate | 74.9 s | 113 s (7:20–9:13) | 18 | The clone and the chairman, Sucram's thread, the jobs promise and the card snatch, the hold, the agency and pay questions, the wallet, the sheet and the double stamp |
| 16 poster run | 20.0 s | 20 s (8 bars) | 5 | Four items and the cut-in on his smile, 2.5–5 s each. Nothing voiced (the script's rule) |
| 17 rooftop | 43.9 s | 40 s + about 16 s | 13 | Signers (10 s, phrase 1), the pen exchange, the register and Nesnej's card, the real line, KA-CHING and the ledger, the pen as a purchase order, the crack, the glass |

In the script's order I widened five picture moments so their business reads (clarity, not length; +2.8 s in all):
- the Photographer's wide lead-in, 0.55 → 0.8 s;
- the chairman and clone's look, mic and chairs, 2.2 → 3.0 s;
- the card snatch gap, 0.8 → 1.2 s;
- the wallet insert (card plus moth), 2.4 → 3.0 s;
- the register window, 1.9 → 2.2 s. The screen set types the figure in over about 0.7 s, so this leaves the whole figure up for the script's "about 1.5 s".

The 6-frame LEDGER flash-print is written as 0.5 s (12 frames): the reel schema clamps every beat to at least 0.5 s (`schema.ts`, `normBeat`), and the timeline says what renders.

### 4.3 For the lead's manifest (`show/reel/ep01-full/ep01-full-v2.manifest.json`)

The chapter entry, and the temp beds from the script's MUSIC and SOUND calls. MM-03 and MM-20 have no render, so they're programmatic pads. MM-19 and MM-05 use renders. **MM-05 has no `-underscore.wav`, only `-loop.wav`**, which the first session's draft had wrong.

```json
{"id": "act2", "label": "ACT TWO", "sub": "the regulate-me tour · sc 13-17 · v2 takes", "from": "ep01-act2-v2"}
```

```json
{"chapter": "act2", "beat": "13.01", "cue": "MM-19", "label": "MM-19 THE FOUNTAIN PEN (loop A, temp)", "src": "audio/ost/tracks/mm19-renamed-it/render/mm19-renamed-it-underscore.wav", "in": 0, "loop": [0, 20]},
{"chapter": "act2", "beat": "14.01", "pad": {"type": "room"}, "lufs": -42, "xfade": 1.0, "label": "room-tone stand-in (sc 14: no score)"},
{"chapter": "act2", "beat": "15.01", "cue": "MM-20", "pad": {"chords": ["Dbmaj9#11", "Gm7b5"], "bpm": 66, "barsPerChord": 2}, "xfade": 0.3, "stop": "hard"},
{"chapter": "act2", "beat": "15.12", "pad": {"type": "room"}, "lufs": -42, "xfade": 0.05, "stop": "hard", "label": "MM-20 stops on the wallet (room's air)"},
{"chapter": "act2", "beat": "15.14", "cue": "MM-20", "pad": {"chords": ["Gm7b5", "Dbmaj9#11"], "bpm": 66, "barsPerChord": 2}, "xfade": 0.05, "label": "MM-20 back on a new phrase (temp pad)"},
{"chapter": "act2", "beat": "16.01", "cue": "MM-03", "pad": {"chords": ["Abmaj9", "Db69#11"], "bpm": 100, "barsPerChord": 1}, "xfade": 0.2},
{"chapter": "act2", "beat": "17.01", "cue": "MM-03", "pad": {"chords": ["Abmaj9"], "bpm": 60, "barsPerChord": 8}, "lufs": -30, "xfade": 1.5, "label": "MM-03 rings out into a held pad (temp)"},
{"chapter": "act2", "beat": "17.03", "cue": "MM-05", "label": "MM-05 THE MORE YOU BUY (temp loop render)", "src": "audio/ost/tracks/mm05-the-more-you-buy/render/mm05-the-more-you-buy-loop.wav", "in": 0, "xfade": 0.3, "stop": "hard"},
{"chapter": "act2", "beat": "17.11", "pad": {"type": "room"}, "lufs": -40, "xfade": 0.05, "label": "score out: rooftop-wind stand-in (the bell is SFX, not in the stick mix)"}
```

The chapter has no premix, so the episode mixer lays the 39 takes itself and ducks the bed under them. `known` must include `mas`, `radnus`, `mario` and `tasya`: they're set up in Act One, and the timeline's cast marks them known too.

---

## 5. Measurements

From `audio/reel/ep01-act2-v2/measure.json` (the definitions are those of Act Four's `report.py`).

| | Act Two v2 |
|---|---|
| Runtime | **3:37.4** (217.4 s, 5,218 frames) |
| Lines / words | 39 / 284; median 6 words a line (Act Four v4 had 4), mean 7.3; 9 lines of ≤ 3 words |
| Speech | 96.2 s, 44 % of the act |
| Exchanges (no gap over 3 s) | 10; median 6.6 s; 6 with two or more speakers |
| **Longest conversation** | **40.5 s** (Senate, 15-03 → 15-12, 10 lines, 5 speakers). Then 36.9 s (White House, 13-07 → 13-18, 12 lines). With a 5 s threshold the White House runs 62.2 s (18 lines) |
| Gaps | median 0.9 s; 13 at 0.2–0.6, 14 at 0.6–1.6, 8 over 1.6, 0 under 0.2; 0 overlaps; 0 cut-off lines |
| Shots | 49 (56 beats); median 3.6 s, mean 4.4 s; 5 under 1.5 s (the bridge's bay and thumb pushes and its black, Sucram's stare, the act's final black) |
| Speech-free stretches ≥ 4 s | 0:24 (5.0 s, the pan) · 1:06 (11.7 s, the photo into the bridge) · 1:26 (4.6 s, the chairman's look into Sucram's card) · 2:11 (5.0 s, the wallet) · **2:24 (40.1 s: the sheet and stamps, the whole poster run, the signers)** · 3:22 (15.4 s, KA-CHING to black) |

**Against the script's clocks.** The script prints Act Two at 5:54–10:13 (4:19) and estimates it plays about 4:49.5 after its passes. The reel plays 3:37.4.
- Almost all of the difference is sc 15: 74.9 s against 113 s printed, and the script says it plays about +6 s on that.
- The words are all there (93 words in its main exchange alone). The recorded reads and 0.2–1.2 s gaps are simply faster than the printed clock allowed, and nothing in the staging is compressed below its written business.
- Sc 13, 14, 16 and 17 are within a few seconds of their printed lengths.

---

## 6. The test render

Act Two alone, as a one-chapter episode (`"titleCard": 0`, the beds of §4.3), at 1280×720 and 24 fps. It was rendered twice through `ops/heavy.sh` with `--jobs 2 --conc 2` (4 browser tabs in all). The first render found two fixes (the ledger beat's length and the register hold, §4.2). The second, 01:31–01:36, is the one kept.

| | Measured (second render) |
|---|---|
| File | `out/ep01/reel/segments/ep01-act2-v2-test.mp4`, 18.8 MB, 3:37.4 |
| Frames | 5,218 planned, 5,218 in the file (the tool's check), **5,218 decoded by PyAV with 0 errors** |
| A/V | video 217.417 s, audio 217.416 s |
| Wall | 204.7 s once the job got its slot (it waited about 1 min for the machine): bundle 15.7, render 182.9 (3 segments of 72.5 s, 2 at a time: 109 s, 111 s, 74 s), mix 5.9 alongside, mux 5.3. **63.7 s of reel per minute of wall**, load average about 15 |
| Mix (the mixer's meter) | −17.4 LUFS integrated, −4.2 dBFS sample peak; 39 takes and 9 beds laid; **0 missing, 0 silences ≥ 0.5 s** |
| Stills | One per shot at its midpoint: `-sheet.png` beside the file (49 tiles). Also checked at full size: 13.09, 14.06 and 17.09 (its middle and last frame) |

**What the stills show** (one reader's judgment):
- Every shot is staged as planned: the right figures, poses and labels, the cards and rails, the dialogue strip filling in word by word, and the scene, time and EP clock in the margin.
- The two-shots read as two people. The Mas/Radnus two-shot has Radnus leaning, the flame on his head and the speaking ring.
- The register window types the figure in, and it's complete by the middle of the 2.2 s hold.
- Two things to know for review:
  - The written blacks show the `void` set's navy grid (§8.8).
  - On the poster run the NOTERB plate is drawn as one more line of the poster card (the insert mode stacks every text), so it reads as poster text rather than a plate on a hand.

The first render (3:37.1, 5,211 frames, 0 decode errors, the same mix figures) is in scratch as `render-1/`.

---

## 7. Where it may drag: proposals only, nothing cut

The lead's call is that the showrunner watches first. These are what the numbers point at, for that viewing:

1. **2:24–3:04, 40 s with no speech:** the sheet's slide and double stamp (9.3 s), the poster run (20 s) and the signers (10 s). Each is a written set piece carried by text and score. In the stick reel they are text cards over temp pads, which will play flatter than the final picture. If it drags, the poster run's four items at 5 s could go to about 3.5 s (the stamps land on beats, so no text is lost), or phrase 1's signers could lose NOTNIH's plate hold.
2. **The bridge (sc 14, 10.8 s, no score, no voice in the stick mix).** Its designed sound, the anchor's too-smooth murmur, isn't laid (see §8.1), so here it plays over room tone alone. Judge it once the murmur exists, not before.
3. **The White House runs 62 s as one conversation** at a 5 s threshold. It's the act's strongest ensemble scene, and nothing in it reads as padding to me. Listed only because it's the longest stretch of talk.

---

## 8. What the script leaves unclear for staging

1. **Sc 14's sound.** The anchor's clip is "a too-smooth murmur with no words we can make out", and the scene then "MATCH CUT[s] on the smooth, AI-altered voice, still talking over black" into THE CLONE's real line.
   - It's unclear whether the murmur (a designed *female* anchor voice) is meant to become the clone's (male) voice across the black, or simply to stop.
   - Nothing in the cast registry voices the anchor, and the episode mixer lays no SFX, so the stick reel has room tone there.
   - Needs a sound decision: a murmur bed (for example a Kokoro read of neutral copy through fastrec's `tv` chain, low-passed until the words go), and how it hands over to the clone.
2. **Two senators, one voice.** 15-10/15-12 and 15-15 come from different lit microphones ("another microphone… at the frame's right edge"), but the cast has one A SENATOR voice. A newcomer will hear one senator. Either cast a second stock voice or accept one.
3. **"THE CLONE always at his left hand."** With the dais facing frame left, the chairman's left is downstage, toward the camera. The stick reel puts the clone screen right of the chairman in every shot, for consistency. The pixel layout needs to decide how "left hand" reads on a side-on dais.
4. **Nedib's OTS "from behind Mario's raised finger".** This works only because the row has turned round to the door (the row otherwise faces us). The reel draws Mario as a left foreground shoulder. The pixel pass should keep Mario turned in that shot.
5. **Sc 17 phrase 3 is written as 4 bars (10 s)**, but its business (the key, KA-CHING, a 6-frame ledger flash, the figure held about 1.5 s, the pen as a purchase order) plays in about 5.6 s here (0.9 + 0.5 + 2.2 + 2.0). MM-05's phrase map will need a re-fit to the picture, or the picture holds for the music. The composer's call.
6. **The blocks restacked `I A` "because Radnus knocked them".** This is never staged; the photo shows only the result. A newcomer won't know why. Either stage the knock (a beat in the pan) or let it be an egg.
7. **The mic-light eyelines.** "Mas's eyeline goes to [the red light]" is a pixel-scale cue, but a stick figure can't show an eyeline. The reel carries it in the caption only.
8. **Black (not a script gap; a reel limit).** The stick reel has no black frame. The two written blacks (the match cut into sc 15, and CUT TO BLACK at the act-out) use the `void` set, a dark navy grid floor, with "BLACK" in the frame label. That's fine for a flow review, but a viewer may read it as a set rather than a cut. If the reel gains a `black` set, beats 14.06 and 17.13 should use it.

---

## 9. Open, and what still needs a person

| Measured | Needs a person |
|---|---|
| Every take's format, loudness, peak, handles, speed band and ASR recall (0 problems) | Listening to any take, especially 15-09's "littles", 13-14's rate, the 17-06 comma, and the two NEDIB lines |
| The timeline's runtime, gaps, exchanges and speech share (§5) | Whether the White House and Senate exchanges *feel* like conversations, and whether the 40 s set-piece run drags |
| The test render's frame count, decode and mix levels (§6) | Watching the chapter; the bed levels and the duck |

- **Not done here, by design:** the full-episode manifest and render (the lead), a sync of `ep01-full/` timelines into `studio/src/reel/data/` (§2), and any edit to `script.md`.
- **For the lead: `ops/heavy.sh` was rewritten at 01:26:17 while my first test render ran inside it.** Bash reads a script as it runs, so after the render had finished the wrapper failed with `line 44: ho: command not found` (exit 127). The render itself had completed and verified. Anyone checking a heavy job's exit code around an edit to that file should read its log, not the code. The safe way to change a running script is to write a new file and `mv` it over the old one.
- **Scratch** (temporary; nothing is needed to re-run): `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-act2/`.
  - `plan-draft-0115.json`: the draft that matched the saved plan line for line.
  - `r3-keep/`, `r4-keep/`: the superseded takes.
  - `pace.py`, `pace-r4.txt`, `pace-r5.txt`: the pace table.
  - `record*.log`: the runs.
  - `mirror/`: the studio mirror.
  - `act2-test.manifest.json`, `work/` and `render/`: the test render.
  - `check_render.py`: the decode check and contact sheet.
