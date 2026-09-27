# Ep1 stick reel v2: the TAG (sc 32–33) and the OUTRO placeholder

| | |
|---|---|
| **What this is** | The handoff for the tag's chapter of the full Ep1 stick reel (`ep01-full-v2`). It covers the recorded lines, the stick timeline, the temp sound stem, a test render, and what the script leaves open for staging. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1" and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". Fully programmatic: stock Kokoro voices, no external APIs, `.env` untouched. The lead's call on length is to build at the current length, let the showrunner mark what drags, then cut. So this pass fixes clarity only, and the length cuts in §6 are proposals. |
| **Who, when** | The `ep1s-tag` pass, 2026-09-26 23:47 → 2026-09-27 01:25. It ran in two sittings: the first built everything and rendered one test; the second (after the session restart) reviewed the frames, made five clarity fixes (§3), re-rendered and wrote this file. |
| **State** | Ready for the lead to point `ep01-full-v2.manifest.json` at it (§5). **One blocker for the lead:** `sync.mjs` doesn't read `show/reel/ep01-full/` (§5.1). Nothing was committed. |
| **Honesty** | I can't watch or listen. Every number here is a measurement from a tool, and every judgment about how a frame reads comes from stills. |

---

## 1. Files

| What | Where |
|---|---|
| Line plan (`fastrec plan --seg tag`, then speeds and flags set by hand) | `audio/ep01/tag/dialogue/lines-plan-v1.json` |
| Takes (2 lines × 2 seeds) and QA | `audio/ep01/tag/dialogue/fast-v1/` (`wav/`, `takes/`, `qa/`, `log/`, `reel/sc32-/sc33-fast-stringout.mp3`). WAVs are git-ignored |
| Lines JSON with the measured takes | `audio/ep01/tag/dialogue/lines-fast-v1.json` |
| **Stick timeline** (the reel's `dialogueReel` format) | `show/reel/ep01-full/ep01-tag-v2.json`: 12 tag beats plus 1 outro beat |
| Timeline builder (it writes the JSON, and prints the beat table and the measures) | `audio/reel/ep01-tag-v2/build_timeline.py` |
| Temp sound stem (room, the MM-12 stand-in felt line, SFX, the thud, the button chord), built from the same JSON | `audio/reel/ep01-tag-v2/tag_bed.py` → `tag-bed.wav` (git-ignored) + `tag-bed-qa.json` |
| This note | `show/episodes/ep01/production/stick/tag-notes.md` |
| Test render, stills and contact sheet (**scratch, temporary**) | `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-tag/render/ep01-tag-v2-test-r2.mp4` (+ `-chapters.json`, `-measure.json`, `-sheet.png`); first render `ep01-tag-v2-test.mp4`; stills in `frames/` (r1) and `frames-r2/` |

---

## 2. What is on screen and heard

The script's tag: *"No conversation: a man alone with a witness that never speaks."* It has two voiced lines, both one-word buttons by Mas, and the picture does the rest. One beat per shot, in script order:

| Beat | Start (s) | Length (s) | Shot | What carries it |
|---|---|---|---|---|
| 32.01 | 0.00 | 5.25 | TWO-SHOT: the desk, three marks in the wood | Place and time label (Mas's dark room · December 2023 · night). The monitor eggs: `CUT LINE`, then the duck's `"What the quack!"` and `LATER: THE DEMO WASN'T REAL-TIME` (held 2.85 s for a read) |
| 32.02 | 5.25 | 3.75 | INSERT: the rack slot ejects the magazine | `RAIL: DEC 6, 2023` (drawn as the date chyron), `EMIT · YEAR-END ISSUE`, `CEO OF THE YEAR` |
| 32.03 | 9.00 | 2.50 | MEDIUM CLOSE: Mas and the cover side by side | The cover card |
| 32.04 | 11.50 | 4.00 | TWO-SHOT: the Orb's scan, twice | The cover card, then the toast over Mas at 1.0 s and the cover's toast at 2.85 s (a 0.6 s re-sweep plus "2 beats" at the temp's 96 BPM) |
| 32.05 | 15.50 | 2.33 | SINGLE, profile: Mas grades the cover | **"close."** at 0.70 s, with the cover card in frame |
| 32.06 | 17.83 | 3.25 | INSERT: the drawer | `CTRL`, then `DO NOT REMOVE` from 0.8 s; the hand shuts it at 2.75 s (a read plus one beat is his look) |
| 32.07 | 21.08 | 4.25 | WIDE: the back wall | He pins up `CEO OF THE YEAR`, then hangs the framed `GUEST` lanyard |
| 33.01 | 25.33 | 2.25 | WIDE: the thud | Scene label (the button · late December 2023); shake; the lit-UI band `Look at glass of water` on the thud frame (0.5 s); the felt line stops dead |
| 33.02 | 27.58 | 4.50 | HIGH: the front page | `THE GREY LADY`, then the clerk's stamp `COMPLAINT · THE GREY LADY v. MACROSOFT & NOPEAI · FILED DEC 27, 2023` (fully typed by about 1.6 s, then held about 2.9 s) |
| 33.03 | 32.08 | 1.75 | INSERT: the glass after the shake | A bracketed stand-in, `[ the glass · the water line: flat ]` |
| 33.04 | 33.83 | 3.29 | SINGLE, profile: the button | **"noted."** at 0.50 s; the chord with no third 0.3 s after the word; the Q\* vault's F hum swells in under it |
| 33.05 | 37.13 | 1.25 | BLACK on the hum | The hum rings on into the outro |
| OUT.01 | 38.38 | 12.00 | CARD: OUTRO PLACEHOLDER (pending) | `OUTRO · PENDING`, the filename, the credits and disclosure line, the one-line terms and the pointer, all taken from OUTRO-PROPOSALS §1.1. Temp pad for MM-15 |

**Style moments (in the margin cues):** the lit-UI band on the thud frame, which is the episode's second and last; the 2 px room shake, with the band held still; and the GLYPH-style sound hook, where the vault's F hum becomes the button chord's root. No filter pass or style leap belongs in the tag.

**Sound** (the stem, `tag_bed.py`):
- **Room:** server hum at −40 LUFS, lifted 4 dB from the thud, so the stretch after the music stops still has a room in it.
- **Felt line:** MM-12 has no render, so the stand-in is **MM-01 Water Line's piano stem** (Mas's dark-room line). It is placed so the file's bar-11 downbeat (25.0 s) lands on the thud, where it is cut in 8 ms. It sits at −27 LUFS, dipped 3 dB under the cover.
- **SFX:** tape start (the rack slot), two scan sweeps and two toast blinks, drawer open and shut, two taps for the pin and the frame.
- **Made in the script:** the thud (a newspaper dropped flat: body, slap and rustle, with the phone, keys and Orb hopping 45–95 ms later) and the button chord (felt F3 C4 F4 C5, no third).
- The episode mixer lays the two takes over the stem at −3 dB and ducks the stem 10 dB under them.

---

## 3. What this pass changed after looking at the first render (r1 → r2)

The r1 stills (`frames/`) showed five things a newcomer would misread. Each fix is marked `r2` in `build_timeline.py`:

1. **32.04:** two identical `verified: human` toasts and no cover in frame, so the second toast read as a repeat. The cover card now goes up first.
2. **32.05:** "close." was said to an empty frame. The cover card now stays in his hand, so the word answers the object.
3. **33.02:** the reel types an insert's items as one block of text, so the UI prompt read as **a line of newsprint above the masthead**. The prompt is left off the insert (a cue says the band stays up in the picture). The hold went from 4.25 s to 4.5 s so the 68-character stamp is readable after it finishes typing.
4. **33.03:** the glass insert drew as a **blank frame**, because the stick stage has no glass. It now has a bracketed stand-in line.
5. **OUT.01:** the Senate moth was placed as a figure, but a card beat draws no figures, so the margin claimed a moth that never appeared. The figure is removed; the stinger stays as a margin cue.

Net: the tag went from 38.125 s to 38.375 s (+0.25 s, all in the stamp's hold).

---

## 4. Measurements

### 4.1 The segment

| | Measured |
|---|---|
| **Runtime** | **Tag 38.375 s** (921 frames) + **outro placeholder 12.0 s** = **50.375 s** (1,209 frames). The script prints the tag at 45 s (22:07–22:52) and the credits at 43 s |
| Beats | 12 in the tag, 1 in the outro |
| **Lines / words** | **2 lines, 2 words**, both Mas ("close.", "noted."). **Median words per line: 1** |
| Talk time | 1.36 s of voiced speech in 38.4 s |
| **Longest conversation** | **None (0 s).** There is no exchange: two one-word buttons 17.5 s apart. This follows the script (*"a witness that never speaks"*); the three table reads kept it, so I didn't add talk |
| Quietest stretch | From the thud to "noted.": 8.5 s (25.83 → 34.33 s) with room tone and SFX only. RMS −37.6 dBFS from 26.5 to 33.8 s; the longest stretch under −50 dBFS RMS is 0.2 s |

### 4.2 The takes (fastrec 1.2, 2 workers, 2 seeds per line; both lines carry the tag, so both were flagged)

| Id | Line | File | Voiced span | Level | ASR | Pitch |
|---|---|---|---|---|---|---|
| `e1-tg-32-01` | close. | 1.76 s | 0.65 s | −16.0 LUFS, −3.75 dBTP | "close" (recall 1.0) | final move −0.4 st, slope −4.7 st/s (falling) |
| `e1-tg-33-01` | noted. | 1.805 s | 0.71 s | −16.0 LUFS, −3.54 dBTP | "Noted." (recall 1.0) | rises to about 155 Hz on "NO", falls to about 96–100 Hz on "-ted": about 7.5 st down (pYIN contour) |

- **Voice:** MAS → `mas-manalt` (Kokoro stock `am_michael`, the `a-michael-close` preset), speed 0.90, at the slow end of his 0.88–0.95 band because both lines are buttons. No clone.
- **QA:** 0 problems and 0 ear flags (`fast-v1/qa/fastrec-qa.json`). The record phase took 128 s wall at load about 30–34 (1.9 takes a minute; the model load dominates with only 2 lines).
- **Pace against the guide:** on a one-word line, words per minute (92 and 85, against the 135–155 turn guide) and articulation ("close." 1.54 syllables a second, against 3.6–4.2) don't mean anything. The lines are deliberately unhurried single words, so **I didn't re-record them.** (PANEL HOST's 255 wpm, from the prep check, is a cold-open line, not one of the tag's.)
- **About `noted.`'s "+0.3 st" final move in the QA file:** that number measures only the flat tail after the fall, and s1's pYIN also picked up a few 60 Hz room-tone frames. The contour shows the same ≈ 7.5 st fall in both seeds, and the two seeds are near-identical (waveform correlation 0.98). Seed s1 is used for both lines; s2 is in `takes/`.

### 4.3 The test render (r2)

| | Measured |
|---|---|
| Command | `episode.mjs` through `ops/heavy.sh`, `--jobs 2 --conc 2 --no-sync`, from a scratch mirror of `studio/` (§5.1) |
| Wall | **49 s** (bundle 10.3, render 36.9, mix 1.1, mux 1.3): 61.7 s of reel per minute. Peak RSS 0.7 GB. Load average 12.6 when the render began (the tool's own record) |
| File | 3.5 MB, 1280×720. **1,209 of 1,209 frames decode** (PyAV); video 50.375 s, audio 50.375 s |
| Mix (the mixer's meter, confirmed with pyloudnorm on the decoded AAC) | Whole −26.2 LUFS (pyloudnorm −26.3), sample peak −6.6 dBFS, limiter not engaged, 0 missing files, 0 silences ≥ 0.5 s. Tag −26.2 LUFS, outro −26.1 |
| Lines land where planned | "close." at 16.20 s: RMS −17.9 dBFS against −32.8 before it. "noted." at 34.33 s: −17.2 against −41.9 before it. Button chord −27.8; black −30.4 |
| Frames checked | One still per beat, plus two in the outro (`frames-r2/`, `-sheet.png`). All five r2 fixes appear as intended. Labels, the EP / TAG clocks, the SCRIPT clock, the rail chyron, the UI pill and the dialogue strip all read |

---

## 5. For the lead: putting it in `ep01-full-v2.manifest.json`

**Chapters** (Act Four, `ep01-act4-v5` with its own `mix.wav`, comes just before):

```json
{"id": "tag", "label": "TAG", "sub": "december · sc 32-33", "from": "ep01-tag-v2", "acts": ["TAG"]},
{"id": "outro", "label": "OUTRO", "sub": "placeholder: pending (5 proposals, 6.25-15 s)", "from": "ep01-tag-v2", "acts": ["CREDITS"]}
```

**Beds:**

```json
{"chapter": "tag", "beat": "32.01", "cue": "MM-12", "label": "MM-12 temp: tag stem (MM-01 felt, room, SFX, the thud, the button chord)",
 "src": "audio/reel/ep01-tag-v2/tag-bed.wav", "in": 0, "loop": "none", "lufs": null, "xfade": 0.5},
{"chapter": "outro", "cue": "MM-15", "pad": {"chords": ["F9sus4"], "bpm": 66, "barsPerChord": 4}, "xfade": 1.0, "stop": "fade"}
```

- `"lufs": null` keeps the stem at its built level (−29.1 LUFS). The mixer then only ducks it under the takes. Don't give it a number, or the room tone and the thud get renormalised.
- The stem runs 1 s past the tag's end, so the outro pad has material to crossfade from.
- **After any change to `ep01-tag-v2.json`, rebuild the stem too.** It reads the beat times from the JSON.

### 5.1 Blocker: `sync.mjs` reads only `show/reel/*.json`

`studio/src/reel/sync.mjs` lists `show/reel/` flat (`fs.readdirSync(SRC)`, line 141). The brief put this timeline in `show/reel/ep01-full/`, so **a normal sync won't find `ep01-tag-v2`**, and the manifest's `from` fails with "timeline show/reel/ep01-tag-v2.json not found". The reel code belongs to the Act Four v5 stick pass, so I didn't touch it. The options:
- teach `sync.mjs` to read `show/reel/ep01-full/*.json` as well;
- keep a flat copy or a symlink in `show/reel/`;
- or render from a scratch mirror, as this test did. The recipe is below.

### 5.2 How to re-run (exact commands, from the repo root)

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
# lines (only if the tag's text changes; --prev keeps the ids), then set speed 0.9 and "flag": true by hand as in v1
HF_HUB_OFFLINE=1 $PY $T plan --seg tag --out <scratch>/tag-plan.json --prev audio/ep01/tag/dialogue/lines-plan-v1.json
# record (resumable; finished lines are skipped)
ops/heavy.sh env HF_HUB_OFFLINE=1 $PY $T record --lines audio/ep01/tag/dialogue/lines-plan-v1.json \
  --out audio/ep01/tag/dialogue/fast-v1 --lines-out audio/ep01/tag/dialogue/lines-fast-v1.json --workers 2 --prosody
# timeline, then the stem (always both)
python3 audio/reel/ep01-tag-v2/build_timeline.py
$PY audio/reel/ep01-tag-v2/tag_bed.py

# a segment test from a scratch mirror of studio/ (it leaves studio/src/reel/data alone). S = your scratch folder
mkdir -p $S/rt/show/reel $S/rt/out $S/rt/studio/public/{audio,fonts,textures}
cp -r studio/src studio/package.json studio/tsconfig.json studio/remotion.config.ts $S/rt/studio/
ln -s $PWD/studio/node_modules $S/rt/studio/node_modules; ln -s $PWD/audio $S/rt/audio
rm -f $S/rt/studio/src/reel/data/*.json; cp show/reel/ep01-full/ep01-tag-v2.json $S/rt/show/reel/
cd $S/rt/studio && node src/reel/sync.mjs
nohup /home/jgon/project/art/mrmas/ops/heavy.sh node src/reel/tools/episode.mjs $S/tag-test.manifest.json \
  --no-sync --jobs 2 --conc 2 --work $S/work --out $S/tag-test.mp4 > $S/render.log 2>&1 &
```

The test manifest is the two chapters and two beds above, plus: `"kind": "episode-manifest", "key": "ep01-tag-v2-test", "episode": 1, "title": "ep1.0_research_preview.md", "dateSpan": "Dec 2023", "runtimeMin": 1, "titleCard": 0, "actCards": "margin", "actCardSec": 4, "known": ["mas", "orb"]`, and the reel README's default `mix` block.

---

## 6. Proposed length cuts (not made)

The tag already plays **6.6 s under** its printed 45 s. If the showrunner marks it as dragging:

| Where | Cut | Saves |
|---|---|---|
| 32.03 into 32.04 | Play the cover beside his face as the two-shot the scan runs over, not a separate medium close first | ≈ 2.5 s |
| 32.01 | Keep one monitor egg (the duck and its caption) and drop `CUT LINE` and the yard | ≈ 1.5 s |
| 33.05 | Black 1.25 → 0.75 s, if the outro's first frame is dark anyway | 0.5 s |
| OUT.01 | Whatever the chosen proposal runs (6.25–15 s against the 12 s placeholder) | 0–5.75 s |

---

## 7. What the script leaves unclear for staging

The script is `show/episodes/ep01/script.md`, "## TAG" and "### END CREDITS". I didn't edit it; each item below is for the writers.

1. **The drawer against the wall.** "He opens the desk drawer **to put the magazine away**", but the next shot "pins the cover to the wall". The reel keeps the cover in his hand, so the drawer shuts without it. A one-phrase fix would give the drawer another reason to open (for example, reaching for a tack), but that would add a second "pin" beside Terb's `DO NOT REMOVE` pin. It's a writer's call.
2. **"2 beats longer" for the cover's toast** assumes MM-12's tempo, and MM-12 has no render. The reel uses the MM-01 temp's 96 BPM (1.25 s). Re-time it when MM-12 lands.
3. **The monitor eggs have "zero read load"**, but they include a caption (`LATER: THE DEMO WASN'T REAL-TIME`) that only works if it is read. The reel gives it 2.85 s. Decide whether it is a read or wallpaper.
4. **The lit-UI band over the inserts.** The script lights `UI: Look at glass of water` on the thud and lists it after the HIGH shot. It doesn't say whether the band stays over the front page. The reel shows it on the thud and leaves it off the inserts (§3 item 3).
5. **The Orb at the back wall `[W]`** isn't placed; the reel keeps it at his shoulder. Also, the "three marks in the wood" in 32.01 only read for someone who remembers sc 18–23's count. The stick reel carries them in the caption only.
6. **The end credits.** The script still prints a 0:43 legal card with the moth stinger inside it. The showrunner's outro note (6–15 s, legal text off screen) supersedes that, so the reel has a 12 s placeholder. Where the ≤ 5 s moth stinger goes relative to the chosen proposal is open (OUTRO-PROPOSALS §1.3).
7. **Facts to confirm** (flags already in the script): that EMIT ran Mas as a cover, not only a list entry (fallback: the issue falls open to his page); and the defendants' order in the stamp (the landlord first, as the complaint's caption has it).

---

## 8. Measured versus needs a person, and open issues

| Measured here | Needs a person |
|---|---|
| Runtime, beat times, line placement, frame count, decode, loudness per chapter, the silence scan, ASR on both takes, pitch contours | **Listening:** whether "close." sounds amused and "noted." sounds unbothered; whether the thud lands; whether the button chord and the vault hum read as one sound |
| Five clarity fixes, checked in stills | **Watching:** whether the 8.5 s from the thud to "noted." (room and SFX only, by the script's design) plays as tension or as dead air. If it's dead air, the first fix is to tighten 33.03, then add a paper-settle SFX under the stamp |

- **The loudness step at the Act Four → tag join.** Act Four's own mix measures about −17 LUFS and the tag −26.2 LUFS, the same level as the other bed chapters. After the vault scene that is a 9 LU drop. It may be right for a dark room, but it needs an ear.
- **The temp music is borrowed.** The felt line is MM-01's piano stem standing in for MM-12, and the outro is a synth pad standing in for MM-15. Swap each in when its render lands. The MM-12 swap needs the stop re-aimed at the thud (`FELT_STOP_AT` in `tag_bed.py`).
- **The stick stage has no drawings** for the magazine, the drawer, the frame, the newspaper or the glass. Text cards and bracketed stand-ins carry them. That's fine for a flow review; the pixel pass owns the art.
