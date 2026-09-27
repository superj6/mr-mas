# Ep1 · Act Four v5 · Finishing status: score, sound, mix, facts, captions, extra art

| | |
|---|---|
| **What this is** | A plain-language status of the finishing work built alongside the pixel preview pass on 2026-09-27: what was made, what is already joined up, what the pixel preview's fix stage still has to wire in, how to re-run each piece, and what a person still has to hear or see. |
| **Why it happened now** | The showrunner, on Act Four's score, sound effects, mix, remaining art, facts checks and captions: "i don't understand why those would take so long or why they're not being integrated now". The lead ruled the v5 timing locked (the stick timeline `show/reel/ep01-act4-v5.json` and the takes `audio/ep01/act4/dialogue/lines-v5.json`), so all of it was built in parallel with the pixel preview. |
| **Watch this first** | `out/ep01/act4/animatic/act4-animatic-v5-finalmix.mp4`: the pixel preview's picture (1080p) with the final mix. `act4-stick-v5-finalmix.mp4` is the approved stick reel with the same mix. |
| **Honesty** | **Nobody has listened to or watched any of this.** Every number below was measured on the written files. The list of what needs ears and eyes is in §6. |
| **Who, when** | Written by the finishing-status pass (`a4fin-status`), 2026-09-27 03:13, from the five passes' own notes and a few light cross-checks of my own (§7). Nothing is committed. `docs/STATUS.md` is not updated here; the lead refreshes it. |

---

## 0. The short version

- **Sound is finished, measured and on picture.** The two composers' score, the sound effects and room tones, and the 101 takes are now one final mix. It's on both the stick reel and the pixel preview's picture, in sync to the sample.
  - It hits the loudness target exactly (−16.5 LUFS) with plenty of peak headroom.
  - The music plays continuously except at the six designed stops, and never in scraps under 2 s. The room tone never drops out except in the one designed silence after the Cancel click.
  - Dialogue sits a median 14.6 dB over the music.
- **Captions and audio description are ready** as sidecar files, on the act clock and the stick reel's clock. I rebuilt them today against the latest lock (02:06) and got byte-identical files.
- **The facts check is done.** Three small on-screen text fixes are needed: "judgement", Gerg's lowercase "i quit.", and the eulogy post's date. None is applied yet. Two items need a decision: re-recording Alyi's line, and a listen for Tasya's "IP rights".
- **Eight extra art assets are drawn** (24 stills, palette-clean), but **none is in the preview yet.** Wiring them in is the pixel fix stage's job (§3).
- **The pixel pass's own review film still plays the old stick mix.** Switching it to the final mix needs one offset change as well as the new path, or the sound runs 3 s off (§3.1).
- **Waiting on people:** a listen (§6) and five rulings (§4). *(The legal read of the one-line disclaimer is moot: since 2026-09-27 no disclaimer goes on screen, [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) note 3.)*

---

## 1. What is now joined up, and what isn't

| Piece | Built | Joined up now | Not joined up yet |
|---|---|---|---|
| **Score** (two composers) | Six continuous to-picture cues, from the OST's existing Ep1 material | In the final mix | — |
| **Sound effects and rooms** | 196 effects and 19 room beds spotted to the lock; 133 new board sounds | In the final mix | — |
| **Final mix** | The act mix, four stems, the score's tail into the tag, a cues file | Muxed onto the stick reel and onto the pixel **picture** film | The pixel pass's **review** film (`act4-animatic-v5.mp4`, with the margin and transcript), its renderer and its report still use the stick mix (§3.1) |
| **Facts** | 23 on-screen or spoken items checked against sources | The captions already spell "judgement" | Script, takes' text, stick timeline, pixel kits (§3.3) |
| **Captions and AD** | SDH captions (SRT and WebVTT), AD cues and the AD script, on two clocks | Sidecar files that match the lock | Not in any mp4. Load them in the player (§5.5) |
| **Disclaimer line** | A proposed one-liner, plus an alternate and five questions for legal | — | Not on screen (showrunner, 2026-09-27); on file in case the description needs a notice |
| **Extra art** | 8 assets, 24 stills, a sheet | — | Not in `shots5.ts`, not in any render (§3.2) |

---

## 2. Each piece in plain terms

### 2.1 The score (two composers)

- **What.** One continuous performance per stretch of the act, written to the exact frames of the lock and rendered from MM-07 to MM-11 (the Ep1 cues already written). Nothing new was invented outside the OST bible's palettes and motifs.
  - `s1-s4_noon`: the suite, THE PLAN and the call, up to the Cancel click
  - `s1-s4_third-mark`: that night, the felt re-entering after the silence
  - `s1-s4_procedure`: the board's side as one unbroken procedure, then the card
  - `s5-s8_s5-two-am`: one pedal under the 2 AM talk
  - `s5-s8_s6-avalanche`: the one full band, with a dead stop on Mada's label
  - `s5-s8_s7s8-the-return`: the violin, Tasya's floor, LEVERAGE, the lobby, and the vault's F into the tag
- **How it behaves under talk.** It thins in the notes themselves (melody out, pedal held), and the mix ducks it further. Measured: no melodic note starts inside a quoted real line without a listed reason, and no A natural over F (OST rule 12). The one F-major flag is inside the designed tape-stop.
- **Where it breaks the edit plan, on purpose.** The S1–S4 section of the score README lists nine places with reasons: for example, the chairs walk off on "stepped" because the picture does, and Tasya's floor takes all four steps.
- **Notes:** `audio/ost/tracks/e01-act4-v5/README.md` (one section per composer), plus the two cue sheets.

### 2.2 Sound effects and room tones (the SFX editor)

- **What.** Every effect and room bed, spotted frame by frame from the lock. The temp stand-ins from v4 are gone.
  - 199 effects are spotted, 4 of them optional, and 19 beds.
  - 133 new sounds were added to the board (`audio/sfx/scripts/sounds_4.py`). Every pitched one is tuned into F minor, including the speakerphone keys, which play Step Four's line (F4 E♭4 D♭4 C4).
- **Designed silences.** No sound on THE QUIET VOTE's exit, on the one blue heart, or on the silent posts. Mada's label gets the call UI's chip click, not a freeze hit, because the script says nothing freezes there.
- **Notes:** `sfx-v5.md` (a summary, beside this file) and `audio/ep01/act4/sfx-v5/README.md`.

### 2.3 The final mix (the re-recording mixer)

**Measured on the written files:**

| Check | Result |
|---|---|
| Loudness (target −16.5 LUFS) | **−16.50 LUFS** in the wav; −16.52 decoded from both mp4s |
| True peak (limit −1.0 dBTP) | **−3.20 dBTP**; the limiter never engaged |
| Stems | dialogue −15.3, music −26.2, effects −34.2, beds −38.1 LUFS; they sum back to the mix |
| Holes in the sound (under −42 dBFS for 0.3 s or more) | **1**: the designed silence after the Cancel click (3.6 s) |
| Sudden jumps (over 15 dB) | 59 on the louder channel, **none unexplained** (speech, line starts, the Cancel silence's edges, the felt's re-entry, the stamp) |
| Music | audible 95.6 % of the act, in 6 runs; **no fragment under 2 s**; 6 stops, all designed |
| Dialogue over music | median **14.6 dB**, lowest 11.4 dB (v4: 15.5 and 7.1) |
| Sync in both mp4s | 0 samples off at all 12 check points |

**The mixer's own decisions** (reasons in `mix-v5.md`):
- **Duck ramps.** The duck changes at no more than 60 dB/s going down and 20 dB/s coming up, so there are no one-frame steps.
- **Dialogue on top.** 16 lines went 0.6–4 dB deeper where the music crowded them, mostly short replies over S5's pedal and in S7.
- **Room tone.** The beds are 1.5 dB up overall and 2 dB more inside three designed rests (the dial tones, Mada's stop, the lobby). That removed three dips found on the first run.
- **Rooms for the voices.** Each voice gets a small early-reflection send from its room, more for voices on a speaker or off screen. On the split screen, Neleh leans slightly left and Mario and Adelina slightly right.
- **The Rewind's reverse swell (FX048) is on,** in the slot the S2 composer left for it. The OST bible gives reverse swells to the SFX. The three optional palette steps stay off, because the score's chords mark those words.
- **One effect sits close under speech, on purpose:** the "left the call" chime cuts off Neleh's "char—".

**Notes:** `mix-v5.md`, beside this file.

### 2.4 The facts check (the facts and access editor)

Everything Act Four puts on screen or in a voice was checked against primary posts, archived originals and at least two outlets. The results are in `show/episodes/ep01/facts.md`, section "Act Four v5 lock checks", items L1–L23.

| # | Finding | What it changes |
|---|---|---|
| 1 | The staff letter spells it **"judgement"** | Text in 4 files and the script. The word sounds the same, so the take stands |
| 2 | Gerg's quit post reads **"…i quit."** in lowercase (from the posted image) | Text in 2 files and the script. The fuller "…based on today's news, i quit." is now confirmed; restoring it is optional |
| 3 | Mas's eulogy post was **Nov 17, 9:05 PM PT** (Nov 18 is the UTC date) | The post card's timestamp. The S4.01 rail `NOV 18` dates the scene and stays |
| 4 | The letter's demand and threat are confirmed word for word | Tags only |
| 5 | Alyi's missing middle clause ("And I can understand why you chose this word, but") is confirmed | By the script's own rule it goes back in. That's a re-record of about +2.5 s, which moves the lock. **The lead decides when** |
| 6 | Tasya's "IP rights" rests only on a court filing quoting the podcast; a transcript from the time has "all the rights" | **On hold** until someone listens to the episode |
| 7 | The Q\* rail, "TWO STAFF REVOLTS", `EQUITY: 0` and every other post and quote | No change. `(REPORTED)` stays where it is; `(DISPUTED)` isn't needed as the Q\* rail reads now. *(2026-09-27: on-screen truth labels are retired, [guardrails §4](../../../../bible/guardrails.md#4-how-facts-appear-on-screen); the script drops `(REPORTED)`, and the preview's code still carries it.)* |

### 2.5 Captions, audio description, disclaimer

- **Captions:** 149 cues covering all 101 lines, with 57 speaker labels and 23 sound captions. They're plain SDH: Mas is in normal sentence case, and on-screen text isn't captioned. They come in two versions: the act clock (for the pixel preview) and +3 s (for the stick reel, which opens on a 3 s title card).
  - **Eight cues read faster than 20 characters a second**, because the takes themselves are fast (Tasya's statement is 27). Someone decides whether to edit those captions.
- **Audio description:** 58 short cues, 432 words, placed in the dialogue's gaps. It reads the silent posts and dates aloud. Two of its choices are flagged for a reviewer: it talks over the Cancel silence and over the stop on Mada's label.
- **Disclaimer (for legal):** "A parody. Events dramatized, scenes invented. No one depicted took part in or endorsed it." It fits on one row. For a standalone Act Four preview, hold it at least 5 s on the head title card. *(2026-09-27: not on screen, on a preview or anywhere else. If a notice is ever needed for publishing, it lives only in the platform's description field.)*
- **Notes:** `captions/README.md`, beside this file. The AD script a describer reads from is `captions/ep01-act4-v5.ad-script.md`.

### 2.6 Extra art (an additional pixel artist)

Eight lower-priority assets replace stand-ins that v5 inherits from v4's layouts:
- Neleh's pen and marker hand (S3.02, S4.14)
- the maintenance worker's screwdriver fist (S8.09)
- the observer chair with its `MACROSOFT · OBSERVER (NON-VOTING)` card (S8.10)
- the chapter card (S5.01)
- the lobby's stone desk top (S8.05)
- the lobby from low, with the carton of zeros (S8.01)
- an optional podcast boom (S7.02b)
- a pixel version of Tasya's room remap that moves the way the E1-P3 clip (option 1.D) does (S7.02b)

Measured: no off-palette colours in any still, and the new modules typecheck. **Not built:** the S7.06 look-around, which needs head turns in shared cast rigs that belong to someone else. **Notes:** `art-extra-v5.md`, beside this file. The stills are `out/ep01/act4/assets/v5/extra/sheet-native.png`.

---

## 3. What the pixel preview's fix stage still has to wire in

The pixel pass owns `studio/src/episodes/ep01/act4/animatic/**` and the art-v5 modules. Nobody else edited them, so these steps are theirs.

### 3.1 Play the final mix in its own films

- **Point the track at `out/ep01/act4/animatic/act4-mix-v5-final.wav` with an offset of 0.** The stick mix's offset is 72 frames (its 3 s title card).
- **Warning:** `render5.ts` takes the path from `$MIX` but the offset from `data-v5.ts` (`MIX.offsetFrames`, written by `lock_v5.py` from the lock's `summary.mix`). Setting only `MIX=` would seek 3 s into the final mix, so the sound would run 3 s ahead of the picture. Change both, for example by having `lock_v5.py` write the final mix with `offset_frames: 0`, or by adding an offset override to `render5.ts`. The Cancel comparison clip uses the same offset.
- **Empty `MIX_MISSING` in `frame5.ts`.** I checked the final effects sheet against its list. All six beats the temp mix lacked now have sound:
  - S3.00a: the call connecting, at 1545
  - S4.12: two door steps and the door's crack, at 6225, 6232 and 6240
  - S4.13 and S4.13e: the key-ring jangles, at 6283 and 6760
  - S6.04: the leave chime, at 9224
  - S7.01: three heart rises, at 9541, 9553 and 9565

  The one stick spot with no counterpart is the extra key tap at S4.12 +46 (act 6250): the door beat is carried by the steps and the crack.
- **Re-run `report_v5.py` on the final mix.** Its holes-and-jumps column currently measures the stick mix.
- **Alternatively,** keep rendering on the stick mix and run `mix_v5_final.py --mux-only` after every picture render. It muxes the final mix onto `act4-animatic-v5-picture.mp4` and re-checks sync, but it doesn't touch the review film with the margin.

### 3.2 Wire in the extra art

- **The hand-off list with one call per shot is `art-extra-v5.md` §1.**
- **The snippets there were written against `shots4.ts`,** because `shots5.ts` didn't exist yet. It does now (02:09). In `shots5.ts` the seven shots are one-line `R5(...)` reuses of v4's layouts:
  - S3.02 (line 411)
  - S4.14 (645)
  - S5.01 (649)
  - S7.02b (819)
  - S8.05 (895)
  - S8.09 (919)
  - S8.10 (921)

  S8.01 is its own layout (line 882), still a crop stand-in. Wiring means replacing each `R5` line with an `S5` layout that carries v4's body with the new call. `shots4.ts` stays untouched.
- **The S7.02b remap is an option,** not a replacement, until ruling R25 decides between the E1-P3 clip (1.D) and this pixel version. The E1-P3 clip lines up with the lock frame for frame (act frame = 9816 + p for p 0–436), so it splices in with no re-timing.
- **After wiring:** re-render. If the mixer's mux is still in use, run `mix_v5_final.py --mux-only`.

### 3.3 Apply the facts check's text fixes (none of them moves timing)

| Where | Change | Owner |
|---|---|---|
| `studio/src/shared/pixel/kits/staff-letter.ts` line 25 (the letter page on screen in S5.06) | judgment → **judgement** | pixel fix stage |
| `studio/src/shared/pixel/kits/post-card.ts` `gergQuit` | `…I quit.` → **`…i quit.`** (or the fuller `…based on today's news, i quit.`) | pixel fix stage |
| `studio/src/shared/pixel/kits/post-card.ts` `masEulogy` | `ts: 'NOV 18'` → **`'NOV 17'`** (or `'9:05 PM'`) | pixel fix stage |
| `show/episodes/ep01/script.md`: sc 27 (a5-27-P1) and sc 29 (a5-29-06 and its tag); tags of a5-29-07 and a5-29-09 | as rows 1–2, and facts §5.4 | script owner |
| `audio/ep01/act4/dialogue/lines-v5.json` a5-29-06 `text`, `spoken_as`, `tag` | judgment → judgement (**the audio stays**) | dialogue owner |
| `audio/reel/ep01-act4-v5/build_timeline.py` lines 269 and 398 | as rows 1–2 | stick timeline owner |

- **The generated files follow.** The old strings also sit in `show/reel/ep01-act4-v5.json` (3×), `shots-locked-v5.json` (6×) and `data-v5.ts` (the review film's transcript band). These are generated, so they change only by re-running `build_timeline.py`, then `lock_v5.py`.
- **That timeline is the whole team's clock.** Before and after, diff it to confirm only these strings changed and no frame moved. Then re-run `spot_v5.py` (the sheet should come out identical apart from its recorded lock hash) and the caption tool (no change expected).
- `art-v5/demos.ts` also draws these kits, so its stills pick up the fixes on their next render.

### 3.4 On the next watch of the pixel picture

- **Caption placement.** Captions sit at the bottom. Check that none covers a post or the letter page, and move any that do (a WebVTT `line:` setting, via `captions/tools/access_v5_src.json`).
- **The disclaimer's hold.** Once legal clears it, it goes on the head title card of each standalone preview. The pixel preview has no title card, and the stick reel's is 3 s, less than the 5 s suggested. *(Moot since 2026-09-27: no disclaimer on screen.)*

---

## 4. Decisions for the lead or the showrunner

1. **Alyi's restored clause (facts L9).** It's accurate and the script says to restore it, but it's a re-record of about +2.5 s in S3.07, which moves everything after it.
   - The knock-on chain: re-record, then rebuild the stick timeline, then re-lock, then re-spot and render the effects, then re-render both composers' cues (every later lay-in frame shifts), then re-mix, re-caption, and re-render the pixel picture.
   - Best done alongside any other re-lock, not on its own. The current trim is accurate in the meantime.
2. **Tasya's "IP rights" (facts L19).** Someone listens to *On with Kara Swisher*, "Microsoft CEO Satya Nadella on the OpenAI Debacle" (released Nov 21, 2023). If he says "all the rights", change a5-30-06 and re-record it.
3. **J1 or GLYPH on the Cancel click** (the comparison clip is `act4-v5-cancel-compare.mp4`). If J1 is chosen, its punch sound has to be spotted inside the designed silence, and the mix re-run.
4. **R25:** the E1-P3 clip (1.D) or the pixel remap for S7.02b. If it's 1.D, cut the podcast boom.
5. **The episode master's loudness.** The act is at −16.5 LUFS and the intro master at −14. The act has about 2 dB before its limiter would engage.
6. **Optional:** restore Gerg's fuller post; edit the eight fast captions; legal's five questions on the disclaimer (in `captions/README.md`).

---

## 5. How to re-run each piece

All paths are from `/home/jgon/project/art/mrmas`.

- **One heavy job at a time, through `ops/heavy.sh`,** started in the background with a log. Everything marked "light" runs in seconds.
- **Stop if free disk falls under 5 GB** (it's 9.3 GB now).

**After a re-lock, run in this order:**
1. The effects spotting.
2. Both composers' renders.
3. The mix.
4. The captions.
5. The pixel picture render, then `--mux-only` if the mixer's mux is in use.

The mix script stops by itself if a take, a cue's lay-in frame or the Cancel silence disagrees with the lock.

### 5.1 Effects (`audio/ep01/act4/sfx-v5/README.md`)

```bash
audio/.venv/bin/python audio/ep01/act4/sfx-v5/spot_v5.py            # light: rewrites sfx-v5.json from the lock
# only for the SFX editor's own stems and measurements (the mix reads the sheet directly): 25 s, about 2 GB
nohup ops/heavy.sh audio/.venv-mix/bin/python audio/ep01/act4/sfx-v5/render_v5.py > <log> 2>&1 &
```

If `sounds_4.py` changes, re-render only those board sounds: `build.py --only <ids> --no-qa`, as in the README. Without `--no-qa` it overwrites the board's spectrogram sheets.

### 5.2 Score (`audio/ost/tracks/e01-act4-v5/README.md`)

```bash
OST_WORKERS=2 nohup ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_render.py > <log> 2>&1 &   # ~3.5 min
audio/.venv-theme/bin/python audio/ost/tracks/e01-act4-v5/s1-s4_qa.py                                                   # light: QA, duck map, cue sheet
# then, one at a time, S5-S8 (run from inside audio/ost/tracks/e01-act4-v5/; ~1.5 min):
OST_WORKERS=2 nohup ../../../../ops/heavy.sh ../../../.venv-theme/bin/python s5-s8_render.py > <log> 2>&1 &
../../../.venv-theme/bin/python s5-s8_ducking.py && ../../../.venv-theme/bin/python s5-s8_qa.py && ../../../.venv-theme/bin/python s5-s8_cuesheet.py
```

### 5.3 Mix (`mix-v5.md`)

```bash
nohup ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py > <log> 2>&1 &   # 82 s, 2.95 GB peak, then the muxes (<2 min)
#   --no-mux    the mix only
#   --mux-only  re-mux onto a new pixel render (it waits until the picture file has stopped changing)
```

### 5.4 Captions and AD (`captions/README.md`)

```bash
python3 show/episodes/ep01/production/act4/captions/tools/build_access.py        # light (~1 s): act + reel clocks; --episode adds +12:31
```

Edit `captions/tools/access_v5_src.json` (Mas's casing, fixes, labels, sound captions, AD), never the generated files.

### 5.5 Watching with captions

In VLC or mpv, add the subtitle file by hand, or copy it beside the video under the video's own base name:
- `act4-animatic-v5-finalmix.mp4` with `ep01-act4-v5.en-sdh.act.srt`
- `act4-stick-v5-finalmix.mp4` with `ep01-act4-v5.en-sdh.reel.srt`

### 5.6 Extra art (`art-extra-v5.md` §5, from `studio/`)

```bash
npx esbuild src/episodes/ep01/act4/art-v5/extra/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
nice -n 15 node $S/sheet.cjs all ../out/ep01/act4/assets/v5/extra     # 24 stills, ~8 s
node $S/sheet.cjs strays                                              # palette check
```

---

## 6. What a person must still check by listening or watching

**Times are act time** (0:00 = act frame 0 = episode 12:31:00), which is also the time in `act4-animatic-v5-finalmix.mp4`. **In the stick reel, add 3 s.** The mix and SFX notes write episode time as MM:SS:FF. For example, their `13:12:13` is act 0:41.5.

| # | Where (act time) | What to judge |
|---|---|---|
| 1 | **0:41.5 → 0:49.1** | The Cancel click, 3.5 s of true silence, the room returning on the buzz with "super.", then the felt on the carve. Designed, not a dropout? |
| 2 | 1:02.4 → 1:03.0 | The Rewind's reverse swell (FX048) under the score's retrograde into the whip: the Orb rewinding, or clutter? |
| 3 | 4:58.6 → 6:00 and 6:38.8 → 7:54.7 | The 16 lines ducked deeper (worst: Terb's "…Ah." at 7:13.8; also the laptop's "super." at 1:23.5). Does the music breathe with the talk, or can you hear it dip? |
| 4 | S3 (~1:05 → 2:05); S5 (4:58.6 → 6:00) | The voices' room sends. Alyi and Rima through Neleh's laptop, Gerg on the monitor: small speakers in a room, or a filter? Do the voices smear? |
| 5 | 3:10.6 → 3:12.6 · 6:29.2 → 6:31.7 · 8:02.9 → 8:06.8 | The three rests with the room lifted (the dial tones, Mada's stop, the lobby): a held quiet, or a hole? |
| 6 | 3:12.5 → 3:40.5 | The split screen: is the slight left/right lean enough to tell the panes apart? |
| 7 | 6:15.0 → 6:30.7 | The avalanche (the one full band), Neleh's "Has anyone read the char—" cut by the leave chime (6:24.3), and the dead stop on Mada's label: a laugh, never a glitch? |
| 8 | 7:38.1 → 7:45.3 | The 7 s music stop from "of what?" through both "good question"s |
| 9 | whole act | The composers' own lists: nine S1–S4 checks and six S5–S8 checks in the score README (the waltz under Neleh's voice, pass one never villainous, the violin sincere, the GM Rhodes and choir not dated). Also the SFX editor's list: do the new foley and the crowd read as what they are? The new sounds are in `audio/sfx/mp3/` |
| 10 | whole act, with `.srt` loaded | Speaker labels, row breaks, the eight fast cues, and captions over posts or the letter page. Ideally a Deaf or hard-of-hearing reviewer |
| 11 | whole act | The AD script read aloud against the mix (does any cue crowd a line?), and its two flagged choices. Ideally a blind or low-vision reviewer |
| 12 | stills | The extra art's judgment calls (`art-extra-v5.md` §4): the chair's card above the seat, the mitten-ish fist, the modest low angle, the subtle remap |
| 13 | the podcast | "IP rights" or "all the rights" (§4.2) |

---

## 7. What I checked myself for this note, and loose ends I found

**Light cross-checks** (no renders, no audio decoding):
- **The captions still match the current lock.** They were built at 01:48, before the lock's last change at 02:06. I rebuilt them in scratch against the 02:06 lock: every output file is byte-identical, with 0 frame differences against the lock.
- **The captions' music notes match the real score.** The captions README worried that they described the temp bed. Measured against the final score:
  - `[waltz music]` at 0:06.3: the waltz after the stamp
  - `[music winds down]` at 0:31.2: the tape-stop onto JOIN
  - `[swing band music]` at 6:15.0: S6's band
  - `[music stops]` at 6:29.2 (on the frame) and at 7:38.7 (0.6 s after the stop at 7:38.1)

  That open issue can close once someone watches it.
- **Every non-music sound caption has its effect or bed in the final sheet.** Three sit a little off the hit, which is worth a small edit in `access_v5_src.json`:
  - `[a key turns in a lock]` starts 1.75 s before the key (6:02.0)
  - `[slot whirs]` is 0.6 s early
  - `[stamp thuds]` is 0.4 s late
- **The S5–S8 cue sheet has a stale note.** It says `freeze_hit_F owns the onset` at Mada's label, and the mix's cues file repeats it. What's actually laid is the call UI's chip click (`post_click--chip`, per the SFX ruling and script 4.1). The sound is right; the note is out of date.
- **The lock hash the mix recorded** (`080355bf28dd`) is the lock on disk now, and the pixel picture it muxed (02:27:35) hasn't been re-rendered since.

**Laptop:** this note's work was file reads, a few JSON checks and one ~1 s standard-library caption rebuild in scratch, all at low priority. No heavy job ran. Load was under 1 when I checked, and free disk is 9.3 GB. The finishing passes' own heavy work (the score renders and the mix) went through `ops/heavy.sh` one job at a time.

**Scratch** (this note's only, safe to delete): `scratchpad/a4fin-status/` (the caption rebuild copy). The other finishing passes list their own scratch in their notes.

---

## 8. Files

| Piece | Where |
|---|---|
| Final mix, stems, tail, cues | `out/ep01/act4/animatic/act4-mix-v5-final.wav`, `-dialogue/-music/-effects/-beds.flac`, `-tail-music.flac`, `.cues.json` |
| Films with the final mix | `out/ep01/act4/animatic/act4-animatic-v5-finalmix.mp4` (pixel picture), `act4-stick-v5-finalmix.mp4` (stick reel) |
| Mix code and notes | `studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py`; `mix-v5.md` |
| Score | `audio/ost/tracks/e01-act4-v5/` (README, cue sheets, duck maps, `render/` with stems) |
| Effects | `sfx-v5.json`, `sfx-v5.md`; `audio/ep01/act4/sfx-v5/`; `audio/sfx/scripts/sounds_4.py`; stems `out/ep01/act4/animatic/act4-sfx-v5.wav`, `act4-rooms-v5.wav` |
| Facts | `show/episodes/ep01/facts.md`, section "Act Four v5 lock checks" |
| Captions, AD, disclaimer | `captions/` beside this file (README, `.srt`/`.vtt` on both clocks, AD script, `qa-v5.json`, `tools/`) |
| Extra art | `art-extra-v5.md`; `studio/src/episodes/ep01/act4/art-v5/extra/`; `out/ep01/act4/assets/v5/extra/` |
| The pixel pass's own status | `report-v5.md`, `timing-v5.md`, `shotlist-v5.md`, `lipsync-v5.md` |
