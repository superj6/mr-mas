# Ep1 stick reel v2: the TAG (sc 32–33) and the OUTRO placeholder

| | |
|---|---|
| **What this is** | The handoff for the tag's chapter of the full Ep1 stick reel (`ep01-full-v2`). It covers the recorded lines, the stick timeline, the temp sound stem, the test renders, and what the script leaves open for staging. |
| **Why** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1" and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". Fully programmatic: stock Kokoro voices, no external APIs, `.env` untouched. The lead's call on length is to build at the current length, let the showrunner mark what drags, then cut. So these passes fix clarity only, and the length cuts in §6 are proposals. |
| **Who, when** | Built by the `ep1s-tag` pass, 2026-09-26 23:47 → 2026-09-27 01:25 (r1, r2: §3). Revised by the **`ep1s-tagfix` pass**, 2026-09-27 03:00 → 03:30 (r3: §3a), from the three reads of `ep01-full-v2.mp4`: the newcomer (cold-viewer) report, the insider notes and the flow audit (`audit-v2.md`). |
| **State** | **r3 is live in `show/reel/ep01-full/ep01-tag-v2.json`, and its stem `tag-bed.wav` is rebuilt to match.** The full manifest needs no change to pick it up (`sync.mjs` now reads the subfolder, so r2's blocker is gone). One optional manifest setting for the lead is in §5. The script's TAG and END CREDITS carry the r3 edits (§3a). No line changed, so nothing was re-recorded. Nothing was committed. |
| **Honesty** | I can't watch or listen. Every number here is a measurement from a tool, and every judgment about how a frame reads comes from stills. |

---

## 1. Files

| What | Where |
|---|---|
| Line plan (`fastrec plan --seg tag`, then speeds and flags set by hand) | `audio/ep01/tag/dialogue/lines-plan-v1.json` (unchanged in r3) |
| Takes (2 lines × 2 seeds) and QA | `audio/ep01/tag/dialogue/fast-v1/` (`wav/`, `takes/`, `qa/`, `log/`, `reel/sc32-/sc33-fast-stringout.mp3`). WAVs are git-ignored. Unchanged in r3 |
| Lines JSON with the measured takes | `audio/ep01/tag/dialogue/lines-fast-v1.json` (unchanged in r3) |
| **Stick timeline** (the reel's `dialogueReel` format) | `show/reel/ep01-full/ep01-tag-v2.json`: 12 tag beats plus 1 outro beat. `_source.revision` says r3 |
| Timeline builder (it writes the JSON, and prints the beat table and the measures). Every r3 change is commented `r3:` | `audio/reel/ep01-tag-v2/build_timeline.py` |
| Temp sound stem (the vault's F pedal, room, the MM-12 stand-in felt line, SFX, the thud, the button chord), built from the same JSON | `audio/reel/ep01-tag-v2/tag_bed.py` → `tag-bed.wav` (git-ignored) + `tag-bed-qa.json` |
| This note | `show/episodes/ep01/production/stick/tag-notes.md` |
| **r3 test render (scratch, temporary)** | `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-tagfix/render/ep01-tag-v2-test-r3.mp4` (+ `-chapters.json`, `-measure.json`, `-sheet.png`); stills in `../frames-r3/`; the test manifest `../tag-test.manifest.json`; the seam simulation `../seam_sim.py`; the r2 files as they were before r3 in `../pre-r3/` (builder, bed script, JSON, QA, this note, and `tag-bed-r2.wav` rebuilt from them) |
| r1/r2 renders (scratch, the first pass's) | `…/scratchpad/ep1s-tag/render/` |

---

## 2. What is on screen and heard (r3)

The script's tag: *"No conversation: a man alone with a witness that never speaks."* It has two voiced lines, both one-word buttons by Mas, and the picture does the rest. One beat per shot, in script order. **Bold** marks what r3 changed.

| Beat | Start (s) | Length (s) | Shot | What carries it |
|---|---|---|---|---|
| 32.01 | 0.00 | 5.25 | TWO-SHOT: the desk, three marks in the wood | Place and time label (Mas's dark room · December 2023 · night). The monitor eggs: `CUT LINE`, then **`ELGOOG DEMO: "What the quack!"`** and `LATER: THE DEMO WASN'T REAL-TIME` (3.4 s for the two) |
| 32.02 | 5.25 | 3.75 | INSERT: the rack slot ejects the magazine | `RAIL: DEC 6, 2023` (drawn as the date chyron), `EMIT · YEAR-END ISSUE`, `CEO OF THE YEAR` |
| 32.03 | 9.00 | 2.50 | MEDIUM CLOSE: Mas and the cover side by side | The cover card |
| 32.04 | 11.50 | 4.00 | TWO-SHOT: the Orb's scan, twice | The cover card; `verified: human` over Mas at 1.0 s; **`re-scanning the cover…` from 1.2 s**, replaced at 2.85 s by the cover's own `verified: human` |
| 32.05 | 15.50 | 2.33 | SINGLE, profile: Mas grades the cover | **"close."** at 0.70 s, with the cover card in frame |
| 32.06 | 17.83 | **4.25** | INSERT: the drawer | **`[ a CTRL keycap · Macrosoft's pen · Terb's extinguisher pin ]`** at 0.3 s, then `DO NOT REMOVE` at 2.5 s, held for its read plus one beat; the hand shuts it at 3.75 s |
| 32.07 | 22.08 | 4.25 | WIDE: the back wall | He pins up `CEO OF THE YEAR`, then hangs the framed `GUEST` lanyard |
| 33.01 | 26.33 | 2.25 | WIDE: the thud | Scene label (the button · late December 2023); shake; the lit-UI band `Look at glass of water` on the thud frame; the felt line stops dead |
| 33.02 | 28.58 | **4.75** | HIGH: the front page | **`[ a newspaper, front page up ]`**, `THE GREY LADY`, then the clerk's stamp **`COMPLAINT · THE GREY LADY v. MACROSOFT & NOPEAI · COPYRIGHT · FILED DEC 27, 2023`** (typed by about 2.0 s, then held 2.7 s). **The page settles twice** (`paper_curl` at 0.3 and 2.9 s) |
| 33.03 | 33.33 | **2.75** | INSERT: the glass after the shake | **`Look at glass of water`** (the band's prompt, typed as the insert's first line), then **`[ the water line: flat. Not a ripple. ]`** |
| 33.04 | 36.08 | 3.29 | SINGLE, profile: the button | **"noted."** at 0.50 s; the chord with no third 0.3 s after the word; **the vault's own F hum** (`vault_hum_F`) swells in under it |
| 33.05 | 39.37 | 1.25 | BLACK on the hum | The hum rings on into the outro |
| OUT.01 | 40.62 | 12.00 | CARD: OUTRO PLACEHOLDER (pending) | `OUTRO · PENDING`, the filename, **the credits and disclosure line in OUTRO-PROPOSALS §1.1's current words**, the one-line terms and the pointer. Temp pad for MM-15 |

**Style moments (in the margin cues):** the lit-UI band on the thud frame, which is the episode's second and last; the 2 px room shake, with the band held still; and the GLYPH-style sound hook, where the vault's F hum becomes the button chord's root. No filter pass or style leap belongs in the tag.

**Sound** (the stem, `tag_bed.py`):
- **Pedal (r3):** the Q\* vault's F hum (`vault_hum_F`), which Act Four lays from S8.06 "to the act's last frame; the tag picks it up" (`audio/ep01/act4/sfx-v5/spot_v5.py`). It is at −31 LUFS from the stem's first sample, holds until the felt enters (1.83 s), then fades out under it over 3 s (equal power). The level is matched to Act Four's `mix.wav` in the hum's F2 band, 6–2 s before its end (−33.3 dBFS RMS, 80–95 Hz).
- **Room:** server hum at −40 LUFS, **at level from the first sample** (r2 faded it in over 0.6 s), lifted 4 dB from the thud, so the stretch after the music stops still has a room in it.
- **Felt line:** MM-12 has no render, so the stand-in is **MM-01 Water Line's piano stem** (Mas's dark-room line). It is placed so the file's bar-11 downbeat (25.0 s) lands on the thud, where it is cut in 8 ms. It sits at −27 LUFS, dipped 3 dB under the cover. Because r3's drawer runs 1 s longer, the felt now enters at 1.83 s (r2: 0.83 s); the pedal covers the gap.
- **SFX:** tape start (the rack slot), two scan sweeps and two toast blinks, drawer open and shut, two taps for the pin and the frame, **two paper settles under the stamp (r3)**.
- **Made in the script:** the thud (a newspaper dropped flat: body, slap and rustle, with the phone, keys and Orb hopping 45–95 ms later) and the button chord (felt F3 C4 F4 C5, no third).
- The episode mixer lays the two takes over the stem at −3 dB and ducks the stem 10 dB under them.

---

## 3. What the first pass changed after its first render (r1 → r2)

The r1 stills (`…/ep1s-tag/frames/`) showed five things a newcomer would misread. Each fix is marked `r2` in `build_timeline.py`:

1. **32.04:** two identical `verified: human` toasts and no cover in frame, so the second toast read as a repeat. The cover card now goes up first.
2. **32.05:** "close." was said to an empty frame. The cover card now stays in his hand, so the word answers the object.
3. **33.02:** the reel types an insert's items as one block of text, so the UI prompt read as **a line of newsprint above the masthead**. The prompt is left off the insert. The hold went from 4.25 s to 4.5 s so the stamp is readable after it finishes typing.
4. **33.03:** the glass insert drew as a **blank frame**, because the stick stage has no glass. It now has a bracketed stand-in line.
5. **OUT.01:** the Senate moth was placed as a figure, but a card beat draws no figures. The figure is removed; the stinger stays as a margin cue.

Net: 38.125 s → 38.375 s.

## 3a. What the tag-fix pass changed, and why (r2 → r3, 2026-09-27)

**Source notes.** The three reads of `ep01-full-v2.mp4` (22:20). The newcomer read the tag as the episode's "least readable beat": it ends on hooks (the Grey Lady, the glass, the demo) that need outside knowledge. The insider found the last image "a cipher unless the glass was planted visibly earlier". The flow audit's tag items were #38 (the Act Four → tag join dips to near-black) and #39 (the 8.5 s from the thud to "noted." is room tone only).

**Rules this pass kept:** clarity and naturalness only, and no length cuts (§6 lists them as proposals). No new talk, since the tag is "a witness that never speaks" and every table read kept it that way. Parody names only. Nothing inside `## ACT FOUR` was touched.

| # | Where (v2 EP clock) | The read that found it | The fix (reel, and script where it matters for the pixel build) | Time |
|---|---|---|---|---|
| 1 | 32.01 (21:32) | Newcomer: "What the quack!" and `LATER: THE DEMO WASN'T REAL-TIME`, "I don't know whose demo" | **Reel:** the card reads `ELGOOG DEMO: "What the quack!"` (Elgoog is known from Act One). The script already sets the duck on an ELGOOG desk, which the stick stage can't draw. **Script:** the `ELGOOG` wordmark must read at a glance. (`INIMEG` is the canonical model name but isn't used: it would be a new name for a newcomer at 22 minutes) | 0 s |
| 2 | 32.04–32.05 (21:46) | Newcomer: "close.", "I don't know close to what"; listed among the unnatural lines as "ambiguous" | **Reel and script:** the Orb's re-sweep over the cover gets its own toast, `re-scanning…` (the reel says `re-scanning the cover…`, because its cards stack instead of floating over each face), before the cover's late `verified: human`. "close." now answers a near miss, the cover only just passing as human, which matches the take's delivery note ("a verdict on a likeness, graded one notch short"). **The line and take stay:** Kokoro's G2P reads `close.` as /klˈOs/, the adjective (checked with misaki: `klˈOs.`), so it isn't heard as the verb | 0 s |
| 3 | 32.06 (21:49) | Newcomer: "a CTRL · DO NOT REMOVE insert. Unclear." | **Reel:** a bracketed stand-in names the three objects the stick stage can't draw, and where each came from: `[ a CTRL keycap · Macrosoft's pen · Terb's extinguisher pin ]`. Then the tag's own `DO NOT REMOVE` lands last and holds for its read plus one beat (his look). **Script:** each object must read as where it came from (the pen in the check's MACROSOFT blue, the pin with its ring and seal) | **+1.0 s** |
| 4 | 33.02 (21:58) | Newcomer: "The Grey Lady's complaint: I don't know who she is or what the complaint is about. It's the final hook and I couldn't read it." | **Reel:** `[ a newspaper, front page up ]` before the masthead (the stick stage draws every dark-room insert as a screen). **Reel and script:** the stamp gains the suit's subject, `COPYRIGHT` (the docket's nature of suit; the facts owner confirms before lock). **Script:** the masthead sits over a front page's columns, so she reads as a newspaper first. The detail (her pages in the training data) stays for her later episodes, per her character file. **Sound:** two paper settles under the stamp's hold (audit #39) | **+0.25 s** |
| 5 | 33.01–33.03 (21:55) | Newcomer: "a 'Look at glass of water' prompt and a flat water line. Unclear." Insider: "the final image is a cipher" | **Reel:** the prompt comes back on the glass insert as its first line, so "Look at glass of water" and the look are one gesture (in r2 the front page sat between them for 4.5 s). The stand-in now says what the drawing shows: `[ the water line: flat. Not a ripple. ]`. That gives the newcomer "unshaken" and the insider the ripple. **Script:** the ECU says "not a ripple, where everything else on the desk hopped", and a note lists the glass's plants (sc 1, sc 17, sc 29) | **+1.0 s** |
| 6 | the join, 21:30.1 | Audit #38: about 0.5 s at −54 to −62 dBFS, where the script wants MM-12 to "pick up sc 31's F pedal from the vault" | **Stem:** the vault's F hum at level from the first sample (−31 LUFS, matched to Act Four's end), the room at level from the first sample, and the hum handed to the felt line. Measured in a simulation of the mixer's rules (§4.4): 50 ms windows under −50 dBFS go from 11 to 5, and all 5 are now **before** the join (Act Four's own premix fading out) | 0 s |
| 7 | 33.04 | (fidelity, found while fixing #6) | The hum under the button chord is now the vault's own loop, `vault_hum_F`, not `room_drone` (F1 + C2), because the script's hook is "the Q\* vault's F hum from sc 31", heard, not seen. The level is −31 LUFS, so the button's window stays within 1 LU of r2 | 0 s |
| 8 | OUT.01 | (upkeep) OUTRO-PROPOSALS §1.1 was revised after r2 | The card's credit and disclosure line uses §1.1's current words: `voices: synthetic, designed from text · none cloned · AI tools: used throughout, listed in the notice`. The margin now says there are five mock-ups (7.5–11.9 s as built), with none chosen | 0 s |

**Net: the tag goes from 38.375 s to 40.625 s (+2.25 s, all of it the read time of the stand-ins and the stamp).** It still plays 4.4 s under its printed 45 s. The outro placeholder stays at 12 s.

**Script edits** (`show/episodes/ep01/script.md`, made with the Edit tool after re-reading; the TAG and END CREDITS only). Each is marked "Tag-fix":
- the TAG header note: one line naming this pass and pointing here;
- sc 32, the duck egg: the legible `ELGOOG` wordmark;
- sc 32, the Orb's scan: the `re-scanning…` toast;
- sc 32, the drawer: the objects read as where they came from;
- sc 33, the front page: the columns, `COPYRIGHT` in the stamp (tagged for the facts owner), and the paper settles;
- sc 33, the glass: "not a ripple, where everything else on the desk hopped", with the plants listed;
- END CREDITS: marked superseded pending a choice, pointing to OUTRO-PROPOSALS. The music and stinger lines are kept.

**What r3 didn't change, on purpose:**
- **The two lines.** Both are buttons the picture sets up. #2 fixes what "close." answers without touching the word.
- **The framed `GUEST` lanyard** (32.07). The newcomer didn't flag it, and the insider lists it among the moments to protect. In the stick reel the two cards stack, so `GUEST` can look as if it's on the cover (the insider read it that way). The script has it in a frame beside the cover.
- **"Three marks in the wood"** (32.01): carried in the caption only. Adding a card would put a third read on the busiest shot.
- **Length.** The insider's "CEO OF THE YEAR three times… two is enough" is a cut, so it's in §6.

---

## 4. Measurements

### 4.1 The segment

| | r2 | **r3** |
|---|---|---|
| **Runtime** | tag 38.375 s + outro 12.0 s = 50.375 s (1,209 frames) | **tag 40.625 s (975 frames) + outro 12.0 s = 52.625 s (1,263 frames)**. The script prints the tag at 45 s (22:07–22:52) |
| Beats | 12 + 1 | 12 + 1 |
| **Lines / words** | 2 lines, 2 words (Mas: "close.", "noted.") | the same. **Median words per line: 1** |
| Talk time | 1.36 s | 1.36 s |
| **Longest conversation** | none (0 s) | **none (0 s)**, by the script's design: two one-word buttons, now 19.7 s apart |
| From the thud to "noted." | 8.5 s, RMS −37.6 dBFS, room and SFX only | **9.75 s** (26.83 → 36.58 s), RMS −38.2 dBFS, −35.9 LUFS, now carrying three reads (the front page, the prompt and the glass) and two paper settles. The longest run under −50 dBFS anywhere in the tag (50 ms windows): **0 s** |

### 4.2 The takes (unchanged from r2)

fastrec 1.2, 2 workers, 2 seeds per line; both lines carry the tag, so both were flagged.

| Id | Line | File | Voiced span | Level | ASR | Pitch |
|---|---|---|---|---|---|---|
| `e1-tg-32-01` | close. | 1.76 s | 0.65 s | −16.0 LUFS, −3.75 dBTP | "close" (recall 1.0) | final move −0.4 st, slope −4.7 st/s (falling) |
| `e1-tg-33-01` | noted. | 1.805 s | 0.71 s | −16.0 LUFS, −3.54 dBTP | "Noted." (recall 1.0) | rises to about 155 Hz on "NO", falls to about 96–100 Hz on "-ted": about 7.5 st down (pYIN contour) |

- **Voice:** MAS → `mas-manalt` (Kokoro stock `am_michael`, the `a-michael-close` preset), speed 0.90. No clone.
- **Pronunciation check (r3):** misaki (Kokoro's G2P, American) phonemises `close.` as `klˈOs.`, the adjective, which is the reading the scene wants. `noted.` is `nˈOTᵻd.`.
- **Why no re-record:** no line's text changed. On a one-word line, words per minute and articulation rate don't mean anything (the first pass's §4.2 has the numbers).

### 4.3 The r3 test render

| | Measured |
|---|---|
| Command | `episode.mjs` through `ops/heavy.sh`, `--jobs 1 --conc 2 --no-sync`, from a scratch mirror of `studio/` (§5.2) |
| Wall | **63.3 s** (bundle 9.4, render 52.3, mix 0.8, mux 1.1). Peak RSS 0.71 GB; 89 % of one core on average (`/usr/bin/time`). The load average was 4.2 when it started |
| File | 3.9 MB, 1280×720. **1,263 of 1,263 frames decode** (PyAV, one thread); decoded audio 52.63 s |
| Mix (the mixer's meter, confirmed with pyloudnorm on the decoded AAC) | Whole −26.0 LUFS (pyloudnorm −26.1), sample peak −6.6 dBFS, limiter not engaged, 0 missing files, 0 silences ≥ 0.5 s. Tag −26.0 LUFS, outro −26.2 |
| Lines land where planned | "close." at 16.20 s: RMS −17.6 dBFS against −39.6 in the second before it. "noted." at 36.58 s: −17.1 against −39.4. The button to the tag's end −21.4 LUFS; the black −29.8 dBFS RMS |
| The stem's head (the join) | In the render: −30.8 dBFS RMS over 0–50 ms, −29.7 over 0–0.5 s (the segment test has no Act Four before it, so its gate doesn't apply; §4.4 has the join) |
| The paper settles | In the 1.5–8 kHz band, the two settles peak 8.6 dB and 4.3 dB above the quiet stretch between them (−34.9 and −39.2 dBFS against −43.5). Whether they're audible over the room needs an ear |
| Frames checked | 15 stills (`frames-r3/`, `-sheet.png`), at least one for every beat and two for each fix. All eight fixes appear as intended: the duck's attribution; the re-scan card and its replacement; the drawer's stand-in, then the tag; the newspaper stand-in, masthead and full stamp; the prompt and the glass; the outro card's new line, which fits (the card shrinks to fit, and every line is legible in the still) |

### 4.4 The Act Four → tag join (simulated, not rendered)

A segment test can't show the join, and a full-episode render is the assembler's job. So `scratchpad/ep1s-tagfix/seam_sim.py` rebuilds it from the mixer's rules:
- Act Four's `mix.wav` (from 3.000 s), cut at the chapter's end with a 10 ms fade;
- the bed gated for 0.5 s after an own-sound chapter (`episode.ts`: `edge: 0.5`);
- the bed's sine fade-in over [anchor − xfade/2, anchor + xfade/2], with nothing before the stem's in-point.

The −50 LUFS floor is left out. The results, as 50 ms RMS windows from −0.75 s to +1.0 s:

| Stem, bed xfade | Windows under −50 dBFS | Where | Level at +0.10 / +0.25 / +0.50 s |
|---|---|---|---|
| r2, 0.5 (reproduces audit #38) | 11 | −0.20 … +0.30 s | −73 / −53 / −42 |
| **r3, 0.5 (the manifest as it is)** | **5** | −0.20 … 0.00 s, all Act Four's side | −42 / −34 / −29 |
| r3, 0.05 | 5 | the same | −41 / −34 / −29 |

- **What's left is Act Four's own premix fading out:** its last 0.3 s run from −49 to −64 dBFS. Act Four is reused unchanged, and nothing on the tag's side can fill it, because the mixer skips a bed's samples before its in-point.
- The r2 file used in the table is `pre-r3/tag-bed-r2.wav`, rebuilt from the r2 scripts; its QA matches r2's to the decimal (−29.1 LUFS).

---

## 5. For the lead: the manifest

**Nothing is required.** `ep01-full-v2.manifest.json` already points at `ep01-tag-v2` (`show/reel/ep01-full/`), and `sync.mjs` now reads that subfolder, so r2's blocker is gone. The tag chapter plays 2.25 s longer, so the outro starts 2.25 s later. The stem is rebuilt to r3's beat times.

**Optional, for the bed entry:**
- update the label to name the pedal: `"MM-12 temp: tag stem (the vault's F pedal, MM-01 felt, room, SFX, the thud, the button chord)"`;
- set `"xfade": 0.05`, as audit F4 proposes. It's measured as worth only 1–2 dB in the first 50 ms (§4.4), so it's harmless but small.

The rest stands as before:

```json
{"chapter": "tag", "beat": "32.01", "cue": "MM-12", "label": "MM-12 temp: tag stem (the vault's F pedal, MM-01 felt, room, SFX, the thud, the button chord)",
 "src": "audio/reel/ep01-tag-v2/tag-bed.wav", "in": 0, "loop": "none", "lufs": null, "xfade": 0.05},
{"chapter": "outro", "cue": "MM-15", "pad": {"chords": ["F9sus4"], "bpm": 66, "barsPerChord": 4}, "xfade": 1.0, "stop": "fade"}
```

- `"lufs": null` keeps the stem at its built level (−28.8 LUFS in r3). The mixer then only ducks it under the takes. Don't give it a number, or the room tone and the thud get renormalised.
- The outro chapter's `sub` in the manifest still says "5 proposals, 6.25-15 s". As built they run 7.5–11.9 s (OUTRO-PROPOSALS §7a); the test manifest uses the new wording.
- **After any change to `ep01-tag-v2.json`, rebuild the stem too.** It reads the beat times from the JSON.

**For the reel owner (shared code, not changed here):** the rest of the join's dip is the 0.5 s gate edge after an own-sound chapter (`studio/src/reel/episode.ts`, the `gates.push` line: `edge: ch.kind === 'video' ? 0.03 : 0.5`). A per-chapter `edge` in the manifest, or a shorter edge when the next bed is a stem that starts at level, would shrink it further. Act Four's premix fading to −64 dBFS in its last 0.3 s is Act Four's own tail.

### 5.2 How to re-run (exact commands, from the repo root)

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
# lines: only if the tag's text changes (--prev keeps the ids); then set speed 0.9 and "flag": true by hand as in v1
HF_HUB_OFFLINE=1 $PY $T plan --seg tag --out <scratch>/tag-plan.json --prev audio/ep01/tag/dialogue/lines-plan-v1.json
ops/heavy.sh env HF_HUB_OFFLINE=1 $PY $T record --lines audio/ep01/tag/dialogue/lines-plan-v1.json \
  --out audio/ep01/tag/dialogue/fast-v1 --lines-out audio/ep01/tag/dialogue/lines-fast-v1.json --workers 2 --prosody
# timeline, then the stem (always both; a few seconds each)
nice -n 19 python3 audio/reel/ep01-tag-v2/build_timeline.py
nice -n 19 $PY audio/reel/ep01-tag-v2/tag_bed.py

# a segment test from a scratch mirror of studio/ (it leaves studio/src/reel/data alone). S = your own scratch folder
mkdir -p $S/rt/show/reel $S/rt/out $S/rt/studio $S/render
cp -r studio/src studio/package.json studio/tsconfig.json studio/remotion.config.ts studio/public $S/rt/studio/
ln -sfn $PWD/studio/node_modules $S/rt/studio/node_modules; ln -sfn $PWD/audio $S/rt/audio
rm -f $S/rt/studio/src/reel/data/*.json; cp show/reel/ep01-full/ep01-tag-v2.json $S/rt/show/reel/
(cd $S/rt/studio && node src/reel/sync.mjs)
cd $S/rt/studio && nohup /home/jgon/project/art/mrmas/ops/heavy.sh node src/reel/tools/episode.mjs $S/tag-test.manifest.json \
  --no-sync --jobs 1 --conc 2 --work $S/work --out $S/render/ep01-tag-v2-test.mp4 > $S/render/render.log 2>&1 &
# the join simulation (needs the r2 stem only for the comparison row)
$PY <scratch>/ep1s-tagfix/seam_sim.py <r2 stem.wav> audio/reel/ep01-tag-v2/tag-bed.wav
```

The test manifest is the two chapters and two beds above, plus: `"kind": "episode-manifest", "key": "ep01-tag-v2-test-r3", "episode": 1, "title": "ep1.0_research_preview.md", "dateSpan": "Dec 2023", "runtimeMin": 1, "titleCard": 0, "actCards": "margin", "actCardSec": 4, "known": ["mas", "orb"]`, and the reel README's default `mix` block. A copy is in `scratchpad/ep1s-tagfix/tag-test.manifest.json`.

---

## 6. Proposed length cuts (not made)

The tag plays **4.4 s under** its printed 45 s. If the showrunner marks it as dragging:

| Where | Cut | Saves |
|---|---|---|
| 32.03 into 32.04 | Play the cover beside his face as the two-shot the scan runs over, not a separate medium close first. This is also the insider's note ("CEO OF THE YEAR three times… two is enough") | ≈ 2.5 s |
| 32.01 | Keep one monitor egg. **Correction from length-v2 §6 and its #6:** drop the duck and keep `CUT LINE`, which is planted for Ep2 and Ep4 (open question 21). r3's `ELGOOG DEMO` attribution goes with the duck | ≈ 1.5 s |
| 33.05 | Black 1.25 → 0.75 s, if the outro's first frame is dark anyway | 0.5 s |
| r3's stand-ins (32.06, 33.03) | In the pixel build, the drawn objects and the drawn glass do the stand-ins' work. Return the two inserts to their r2 holds (3.25 s, 1.75 s) **only after** a newcomer read of the pixel frames says the drawer and the glass read without words | up to 2.0 s |
| OUT.01 | Whichever proposal is chosen (7.5–11.9 s as built, against the 12 s placeholder) | 0.1–4.5 s |

---

## 7. What the script leaves open for staging

The script is `show/episodes/ep01/script.md`, "## TAG" and "### END CREDITS".

1. **The drawer against the wall.** "He opens the desk drawer **to put the magazine away**", but the next shot "pins the cover to the wall". The reel keeps the cover in his hand, so the drawer shuts without it. A one-phrase fix would give the drawer another reason to open (for example, reaching for a tack), but that would add a second "pin" beside Terb's `DO NOT REMOVE` pin. It's a writer's call; r3 didn't change it.
2. **"2 beats longer" for the cover's toast** assumes MM-12's tempo, and MM-12 has no render. The reel uses the MM-01 temp's 96 BPM (1.25 s). Re-time it when MM-12 lands. The r3 `re-scanning…` toast fills those beats.
3. **The monitor eggs have "zero read load"**, but the duck's caption only works if it is read. The reel gives the two cards 3.4 s. r3 settles whose demo it is; whether the egg stays at all is §6's call.
4. **The lit-UI band over the inserts.** Settled in r3: the band lights on the thud and its prompt comes back on the glass. The script's note says the band keeps the prompt lit into the glass insert. Whether it also stays up over the front page is still open for the pixel pass; in the stick reel that read as newsprint (r1).
5. **The Orb at the back wall `[W]`** isn't placed; the reel keeps it at his shoulder. The "three marks in the wood" in 32.01 only read for someone who remembers the count from sc 18–23; the stick reel carries them in the caption only.
6. **The end credits.** Now marked superseded in the script (r3). Where the ≤ 5 s moth stinger goes relative to the chosen proposal is open (OUTRO-PROPOSALS §1.3).
7. **Facts to confirm.** That EMIT ran Mas as a cover, not only a list entry (fallback: the issue falls open to his page). The defendants' order in the stamp (the landlord first, as the complaint's caption has it). **New in r3:** `COPYRIGHT` as the suit's subject on the stamp (the docket's nature of suit is copyright). It's tagged in the script for the facts owner.

---

## 8. Measured versus needs a person, and open issues

| Measured here | Needs a person |
|---|---|
| Runtime, beat times, line placement, frame count and decode, loudness per chapter, the silence scan, the join in simulation, the paper settles in the high band, ASR and pitch on both takes (r2), the G2P reading of "close." | **Listening:** whether "close." sounds amused and "noted." unbothered; whether the thud lands; whether the vault hum reads as the same sound at the tag's head and under the button chord; whether the paper settles are audible over the room |
| Eight fixes checked in 15 stills | **Watching:** whether the stand-ins read as stand-ins rather than in-world text; whether the 9.75 s from the thud to "noted." now plays as a read and a look rather than dead air |

- **The loudness step at the Act Four → tag join.** Act Four's mix measures about −30 LUFS in its last 6–2 s before its own fade. The stem opens at about −30 dBFS RMS, and the tag measures −26.0 LUFS overall, the same as the other bed chapters. The near-black dip is shrunk (§4.4), but the step needs an ear.
- **The temp music is borrowed.** The felt line is MM-01's piano stem standing in for MM-12, and the outro is a synth pad standing in for MM-15. Swap each in when its render lands. The MM-12 swap needs the stop re-aimed at the thud (`FELT_STOP_AT` in `tag_bed.py`), and the pedal's hand-off (`PEDAL_FADE`) re-set to MM-12's own entry.
- **The stick stage has no drawings** for the magazine, the drawer, the frame, the newspaper or the glass. Text cards and bracketed stand-ins carry them; that's fine for a flow review, and the pixel pass owns the art. The r3 stand-ins exist because of that, and §6 says when they can go.
- **Not in this pass's reach, but touching the tag:** the newcomer couldn't tell whether Mas joined Macrosoft. Act Four's S7.01 lays the `GUEST` lanyard and the `MACROSOFT` badge side by side, and the stick reel renders them as one card, `GUEST · MACROSOFT`. The tag's framed `GUEST` is the NopeAI lobby badge. That's a note for Act Four's owner.
