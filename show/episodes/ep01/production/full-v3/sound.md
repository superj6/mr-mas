# Ep1 v3: rooms, SFX and the final mix (`v3-sound`, 2026-09-27)

> **Status (v3.5 FINAL, v3.5b): the v3.5b EL lock is MIXED for the one film, ep01-v35.mp4 (§Y+, then §Y).** The v3.4 EL mixes and stems were deleted after the v3.5 film passed (`--lock v34 --variant el` rebuilds them); the v3.4 Kokoro mixes are kept.
>
> **Nothing here was heard.** Every number below is measured from the files. I also looked at envelope plots of the stems and mixes around the moments listed in §5. Whether a room sounds like its room, whether the keys read as Gerg, and whether any cut plays all need an ear.
>
> §W is the v3.3 polish round's tool changes, §V the v3.2 round, §0 the v3.1 round. §1–§8 are the v3 round: the method, which still holds, and the v3 lock's numbers.

## Y+. v3.5b: the final lock's additions, MIXED (the `finish` pass, 2026-09-29)

**On the v3.5b EL lock** (8893509; lock-v35.md §10): Act One 10,995 f, Act Two 4,968, Act Three 3,514, Act Four 11,953 (cold open and tag unchanged). Stems `audio/reel/ep01-v3/v35/el/`, mixes `out/ep01/full-v3/mix-v35-el/`, QA `mix-qa/v35/el/` (plus `voice-check.json` and `click-scan-score-mix.json`). Every score is the v3.5b render at the new length.

**Run a segment at a time** (memory pressure; the pressure governor pauses heavy jobs): `stems.py --lock v35 --variant el` through heavy.sh, then `mix_episode.py act1 card`, `act2`, `act3`, `act4`, `tag` (`--variant el --lock v35`), in that order. Each partial run takes the guard's reference and the previous chapter's gain from the last report.

**Changed in the tools:**
- **The egg timer (check-v35 must-fix 1):** on the v3.5 lock it stops at the window's cut (v35-18.01; the last tick 50 ms clear) and no longer carries into the duel: 8 ticks, 347.82–352.84 s in Act One (it had run on to 7:32 in the film).
- **Levels (check-v35 optional #1, #3, #4, #5):** the vision post's keys −33 → −23 dBFS and the Publish click −24 → −14; the war room's buzzes 2–7 −28.5 → −22.5 (the first stays −27); the hearts' ticks +12 dB (−28 / −25.5); the blank page's `paper_curl` −30 → −15.
- **3 AM's felt F4 and the 180 YEARS bloom (check-v35 #2, the lead: −3 dB at entry):** a mix-side score curve (`SCORE_CURVE_LOCK`): −3 dB from the felt note (218.96 s), the bloom faded in over 0.5 s from −9 dB at 12.03's cut, −3 dB to 2018's cut, back to 0 dB over its first second.
- **The new rooms:** `racks` (Act Two's cold aisle: the racks' fans close, their air; leads the cut 0.5 s, stops on the cut out) and `party` (Act Three's launch party: the staff's walla; leads with the cheer 0.4 s, drains into the dark room over 0.6 s).
- **The party's cheer J-cut** (0.4 s, `OWN_LEAD`); **20.01's keys pre-lap is not laid after the party** (`OWN_LEAD_NOT_AFTER`), so the laugh and the glass set down stay clear; the keys play where the timeline has them (1.48 s in).
- **From the timeline, laid as written:** the usage flash's `counter_roll` (with 12.01's toast popping 0.4 s early into it), the racks' tear, slides, latches and LEDs, the party's cheers and clinks, 20.01's glass set down, Act Four's buzzes, clack, marker uncap, 4. MARIO and its strike, and 17.07's bell at 16.2 s.

**Measured:**

| | EL v3.5b |
|---|---|
| Cold open · Act One · Act Two · Act Three · Act Four (LUFS-I) | −16.0 · −16.0 · −16.0 · −16.01 · −16.02 |
| Tag | −17.07 (the dialogue guard, −0.88 dB) |
| **Episode** (the story plus the card) | **−16.03 LUFS**, LRA 7.2 · dialogue spread 1.98 LU |
| Highest true peak (the mixes) | −1.23 dBTP (Act Four) |
| Unmarked holes (with the score) · missing lines · missing SFX | 0 · 0 · 0 |
| **X6**, the avalanche | −15.85 → −14.11 (+1.74 LU, 2.03 dB) |
| Set pieces over the talk: the odometer · the avalanche · the shatter | +2.48 · +2.37 · +2.42 LU |
| **The named lines** (speech band 300 Hz–4 kHz, the line over what's under it) | v35-vo-05 "now for the backlash." **26.7 dB** · v35-vo-06 "someone gets to be in the room…" **13.5 dB** · Neleh's v35-a4-0009 **12.9 dB** · "Then we'll write step four ourselves." **12.3 dB**: all voiced and clear |
| The outro | the hum held 2.0 s, first hit −6 dB, seam 12.5 dB (400 ms) |

**The click scan** at every boundary: the rooms have no flags (the racks' stop on the cut included); the SFX stems no truncations (the hearts' ticks' flags are the files' own fast decays); the score and mix flag only the designed moments (the thud, the freeze hits, the shutter, the post click, THE CLOCK's step, the war room's cluster).

**For an ear:** the new rooms and the party's walla (film 12:36–12:46); the racks (11:50–11:56); whether the louder keys, click, buzzes and hearts now sit right; 3 AM at −3 dB (4:35–4:42); Act One's 16 level rises over 15 dB not on a word or a laid SFX (mostly the first weeks' cuts on the pulse).

## Y. v3.5 FINAL: the EL lock, MIXED (the `finish` pass, 2026-09-28)

**Re-run:** `mix_episode.py --all --variant el` (the default lock is now `v35`; `--rebuild-stems` to force the stems). The film is EL only (PLAN §8, 11A); the Kokoro v3.5 variant was not mixed (its lock entry exists).

**The files:** stems `audio/reel/ep01-v3/v35/el/` (FLAC, with `tag-tail`); mixes `out/ep01/full-v3/mix-v35-el/` (with `outro-mix.wav`); QA and the report `audio/reel/ep01-v3/mix-qa/v35/el/` (plus `click-scan-score-mix.json`). The score is the v3.5 FINAL (b0a1c38): every `render/music-el.wav` names its v3.5 EL timeline and is used; Act Four's `music-el-ringout.wav` is laid at the tag's head.

**Frames (EL):** cold open 583 · Act One 10,947 · Act Two 4,848 · Act Three 3,274 · Act Four 11,873 · tag 798.

**Kept, unchanged:** VO_GAIN_DB 2.0; −16 LUFS; the set pieces and the X6 gain row (anchored by beat id, so re-anchored on the new clock by itself); room tone under every black (12.07, 17.13, 23.04); the one silence; the outro's hum hold; the dial-tone and LED fixes; the 20 ms SFX tails.

**New in the tools (`stems.py`, `mix_episode.py`):**
- **The `v35` lock** (default). Lock-only tables so older locks rebuild unchanged: `RECIPE_LOCK`, `ROOM_OVERRIDE_LOCK`, `TRAIL_AT_LOCK`, and `LEAD_AT_LOCK['v35']`.
- **MARIO (voices-el.md §AB3):** a line marked `engine: kokoro` in the EL variant gets +1.5 dB at 350 Hz (Q 1.0), −1.5 dB at 2.2 kHz (Q 0.9) and −0.5 dB before any device chain (`KOKORO_IN_EL_EQ`). Applied to all 10 (act1 3, act2 6, act4 1).
- **New rooms (`room_signal`):** `office-2018` (JUN 2018: the racks' fans, the desk towers' fans and mains hum, air; leads the cut 0.8 s under the thought's tail), `office-2019` (MAR 2019: an office by day and an old box fan), `plane` (the flight: the cabin's low roar, air, a faint whine; the phone's buzz L-cuts into it 0.5 s, it hands to the dark room 0.6 s), `tpool-2008` (TPOOL's room with a 2008 camcorder's tape hiss). 3 AM, the lamp, the vision post and Alyi alone play `bullpen-night`; the tour's phone inserts ride the run's street.
- **New sounds (`v35_layers`), each on the picture's own frames:**
  - **The tear macro** (7.02 k28–87): a flickering sizzle of tiny ticks and a thin hiss, gone with the steam at k88; two puffs (`steam_hiss`) at k30 and k75.
  - **The vision post:** his keys as the title (1.1 characters a frame) and each passage (5 a frame) type; **the Publish click at k12 (0.5 s into v35-19.04)**; the lid shutting at len−4.
  - **The waitlist's rope snap:** a cloth thwup and a brass hook's clink at **k4 of v35-22.01, where the picture snaps** (see "For an ear").
  - **The war room:** a buzz on each call's landing (7, on the lock's onscreen times plus the lawyer 6 f after NOR); Tasya's key ring through the call after "one minute."; the phone lighting again on the notepad (len−16).
  - **The flight:** the pen writing 1. GERG (k8, k17) and the scrawl (k30); the bump at k38 (a low thud, the cup, the coffee).
  - **The folder's blank page** (S4.10b k315–321): the page turned over (`paper_curl`).
  - **Alyi alone:** a soft tick on each heart (the picture's 18 frames), two carried 0.4 s into S5.03.
  - **ATOD's tinny arena** is built but left out: the act1 score claims it (its `arena` cue, "a game's loop, through the monitors").
  - **Already in the timeline and laid:** the tour's seven stamps (the score's knee stab sits on stamp 1 where the timeline has it, so the plan's 0.2 s gavel-to-stamp lead is not laid, as at 16.01 in v3.2), the gavels, the KA-CHING at 17.07 (the score rests for it), the siren whoop, the marker.

**Measured (the episode report):**

| | EL v3.5 |
|---|---|
| Cold open · Act One · Act Two · Act Three · Act Four (LUFS-I) | −16.0 · −16.0 · −16.0 · −16.02 · −16.01 |
| Tag | −17.03 (the dialogue guard, −0.88 dB) |
| Card | −35.91 |
| **Episode** (the story plus the card, 22:28.8) | **−16.03 LUFS**, LRA 7.2 |
| Highest true peak | −1.18 dBTP (Act Four) |
| Dialogue spread · reference | 1.98 LU · −14.59 |
| Unmarked holes (with the score / without) · missing lines · missing SFX | 0 / 0 · 0 · 0 |
| **X6**, the avalanche (S6.01 to S6.06's freeze hit) | −15.31 → −13.57 (+1.74 LU, 1.99 dB) |
| Set pieces over the talk: the odometer · the avalanche · the shatter | +2.48 · +2.22 · +2.39 LU |
| Seams (200 ms): card→act1 · act1→2 · act2→3 · act3→4 · act4→tag | +20.2 (designed) · 0.2 · 0.6 · 0.8 · 0.7 dB |
| The outro: hum held · first hit · seam (400 ms) | 2.0 s · −6 dB · 12.9 dB |

**The click scan** at every beat boundary, on the room, SFX, score and mix:
- **Room:** no flags, no cut-offs, in any segment.
- **SFX:** no truncations. The boundary flags are laid attacks on their cuts (the freeze hits, the collar pop, the thud, the shutter, the post click, the lid) and the cut-offs are samples' own decays (`dialog_ok_click`, `post_click`, Gerg's keys, `neon_ignite`, the vault's hum).
- **Score:** Act Three 23.01 (THE CLOCK's step on F, as v3.4) and Act Four 69.03 s (the war room's cluster moving on the cut to v35-41.05; masked in the mix).
- **Mix:** only designed moments: Act One's thud (v31-12.03), Act Two 13.03's freeze hit and 13.12's shutter, Act Three's post click and THE CLOCK.
- **Level jumps over 15 dB not at a word or a laid SFX:** Act One 18 (mostly the first weeks' cuts on the pulse, 3 AM and JUN 2018's entries), Act Two 1, Act Three 4, Act Four 8, the tag 1. For the ear.

**For an ear, first:**
1. **The rope snap vs the score's tag:** the picture snaps at k4 (0.17 s into v35-22.01, film 8:05.5) and the SFX is there; the score's tag lands at 0.9 s (read from the caption). 0.73 s apart: a reaction sting, or a late one.
2. **The blank page vs the score:** the picture turns the page at S4.10b k315–321 (Act Four 232.0 s, film 18:02.9); the score's "the page's back is blank" chord is at 231.125 s, about 1 s early.
3. **MARIO's EQ** (sc 11, 13, 17, S4.08): whether he sits with the EL voices.
4. **The new synthesized sounds:** the sizzle (film 3:29), the plane's cabin (15:23), the 2019 fan (10:34), TPOOL's hiss (15:32), the war room's buzzes (14:57).
5. **The avalanche** reads +2.22 LU over the talk (v3.4 +2.49), with X6 at +1.74 LU.

## X. v3.4: the lock (script draft 8.3), MIXED

**Re-run:** `mix_episode.py --all` (the default lock is v34), and the same with `--variant el`.

**The files:**
- Stems: `audio/reel/ep01-v3/v34/` (WAV) and `v34/el/` (FLAC).
- Mixes: `out/ep01/full-v3/mix-v34/` and `mix-v34-el/`.
- QA and the episode report: `audio/reel/ep01-v3/mix-qa/v34/<variant>/`.

**Frames:**

| | Cold open | Act One | Act Two | Act Three | Act Four | Tag |
|---|---|---|---|---|---|---|
| Kokoro | 640 | 8,101 | 4,349 | 3,007 | 12,187 | 798 |
| EL | 583 | 8,240 | 4,084 | 2,974 | 12,477 | 798 |

**What changed in the tools:**
- The `v34` lock entries.
- Act Three's 0.6 s lead under 17.13's black, kept for v3.4.
- **`TP_MAX` −1.0 → −1.05 dBTP**, a margin so no report reads "−1.0". Kokoro Act Three first measured −1.00; re-mastered alone, it's −1.15 at the same gain (+1.96 dB). Nothing else was over −1.05.

Everything else follows the v3.4 timelines by beat id:
- **The tag:** v31-32.01d is cut, so the demo film's claims, the room duck and return, the stutter clicks and the LED-off span are all skipped. Each was already guarded on that beat. The tag's stems are the dark room plus the vault's hum, L-cut from Act Four.
- **S4.02:** the new phones (`phone_buzz_step_1`, −26) are laid, under Y's pizz chord (his `designed_hit`).
- **Beats that are gone:** 14.03/14.05 and 21.03/21.04 take their sounds with them. 21.05's claps carry into the switch-off.
- **Kept from earlier rounds:**
  - the dial-tone fix (S4.08 ends 0.25 s after its beat, over 0.35 s);
  - the LED ticks off room cuts;
  - the 10 ms room fades;
  - the 20 ms SFX tails;
  - VO_GAIN_DB 2.0.

**The runs:**
- The first four segments were mixed first. The whole episode was mixed once Y's Acts Three and Four named v3.4 (39f26d3); the stems rebuilt for both variants on the new score hints.
- The first EL whole-episode run was killed by systemd-oomd during the premixes (machine-wide pressure, at 12:09; its stems had been written). The re-run, one job alone, finished.
- **By md5,** the whole-episode run leaves the cold open, Act One and Act Two byte-identical to the four-segment run, in both variants.
  - Only the tag changed: it now has Act Four's gain ramp at its head, and in EL, Y's EL ring-out.
  - The Kokoro outro changed with its tag. The EL outro is identical.
  - Both cold opens are also byte-identical to v3.3's.

**Measured (the episode report):**

| | Kokoro | EL |
|---|---|---|
| Cold open · Act One · Act Two · Act Three · Act Four (LUFS-I) | −16.0 · −16.0 · −16.0 · −16.02 · −16.01 | −16.0 · −16.0 · −16.0 · −16.02 · −16.01 |
| Tag | −17.28 (the dialogue guard, −1.24 dB) | −17.13 (guard −0.97) |
| Card | −36.42 | −36.23 |
| **Episode** (the story plus the card, 20:13.8 / 20:16.8) | **−16.03 LUFS**, LRA 6.9 | **−16.02 LUFS**, LRA 7.0 |
| Highest true peak | −1.06 dBTP (the tag) | −1.40 dBTP (the tag) |
| Dialogue spread · reference | 1.84 LU · −14.78 | 1.85 LU · −14.69 |
| Unmarked holes (with the score / without) · missing lines · missing SFX | 0 / 0 · 0 · 0 | 0 / 0 · 0 · 0 |
| **X6**, the avalanche (S6.01 to S6.06's freeze hit) | −15.90 → −14.23 (+1.66 LU, 1.84 dB) | −15.98 → −14.31 (+1.67 LU) |
| Set pieces over the talk: the avalanche · the shatter · the odometer | +2.50 · +2.23 · +2.40 LU | +2.49 · +2.38 · +2.50 LU |
| The night's re-entry (X3): first 100 ms · 400 ms over the room | +10.8 · +15.8 dB | +11.2 · +16.3 dB |
| Seams (200 ms either side): act1→2 · act2→3 · act3→4 · act4→tag | 0.3 · 1.8 · 0.4 · −0.8 dB | 0.9 · 0.7 · 1.4 · −0.5 dB |
| The outro: hum held · first hit · seam (400 ms) | 2.0 s · −6 dB · 11.3 dB | 2.0 s · −6 dB · 12.8 dB |

**The tag's head:**
- **The ring-out:** both tags now take Act Four's vault ring-out (`music-ringout.wav`, EL `music-el-ringout.wav`, Y's v3.4 renders, 4.2 s). It plays full from the tag's first sample and fades out, equal power, over 2.5 s from the tag score's entry at 0.60 s.
- **The gain:** it ramps from Act Four's gain over 2 s (+1.02 → +2.72 dB Kokoro, +1.06 → +2.80 EL).
- **At the seam:**
  - Act Four's last 200 ms read −26.4 dBFS. The tag's first 200 ms read −27.1 (Kokoro) and −26.9 (EL).
  - The sample jump across the seam is 0.006 / 0.0007.
- **In 0.5 s windows** (dBFS RMS), the head reads −27.7, −22.5, −28, −33, −34, −35, then −16.6 at 3.0 s, as 32.02 comes in. There's no demo and no duck now: the room, the score's entry and the ring-out's fade, then the arrival.
- **The tag's LRA is 19.4 / 19.0** (v3.3: 13.7). The tag is 9 s shorter, so its quiet end (about 4 s at −35 LUFS short-term, the hum after the thud) is a larger share of it.

**The click scan** at every beat boundary (room, SFX, score, mix; over 10× local; then a whole-stem cut-off sweep):
- **Room:** no flags, in any segment of either variant.
- **SFX:** no truncations. The non-onset boundary flags are all laid attacks on their cuts:
  - Act One: `freeze_hit_F` (9.04), `collar_pop_F5` (9.08), `synth:thud` (v31-12.03), and in EL the egg timer's tick on the match cut;
  - Act Two: `freeze_hit_F` (13.03, 17.04);
  - Act Three: `post_click` (20.03).
- **Score, two designed flags per variant:**
  - Act Two: the Senate pizzicato as the pedal lets go (15.10 / 15.07);
  - Act Three 23.01: THE CLOCK's step on F.
- **Act Four:** no flags at any boundary, in any stem.
- **The mix:** only those moments, plus 13.12's shutter. Its whole-stem sweep finds only Act Three's `dialog_ok_click--chip` decay (Kokoro 18.2 s).
- **Level jumps:** Act Four's QA lists a few rises over 15 dB that aren't at a word or an SFX (Kokoro 6, EL 8), for the ear. One sits on Y's cue marks (S5.04, the Orb's look; EL S5.03). S8.08's head has no mark.

**Disk:**
- After both passed, I deleted `mix-v33/`, `mix-v33-el/` and the v3.3 stems.
- The v3.3 assembly files and the cold open's picture lock (`lock/coldopen.json`) still name `mix-v33/coldopen-mix.wav`. `mix-v34/coldopen-mix.wav` is byte-identical to it (md5 `adf243dd…`; EL `6e2b6c50…`), so re-pointing changes no audio.

## W. v3.3: the polish round (PLAN.md §6, the X items) and the mix

### W.1 Re-run

```sh
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all                  # v3.3, Kokoro (the default lock now)
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --variant el     # v3.3, ElevenLabs
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --lock v32       # v3.2 (and v31, v3) still work
```

| What | v3.3 |
|---|---|
| Timelines | `show/reel/ep01-v33/ep01-v33-<seg>.json`, EL `show/reel/ep01-v33-el/ep01-v33-el-<seg>.json` |
| Stems | `audio/reel/ep01-v3/v33/` (WAV), `audio/reel/ep01-v3/v33/el/` (FLAC), with `tag-tail` |
| **Mixes** | **`out/ep01/full-v3/mix-v33/<seg>-mix.wav`**, `out/ep01/full-v3/mix-v33-el/`, each with `outro-mix.wav` |
| QA and the loudness report | `audio/reel/ep01-v3/mix-qa/v33/<variant>/` |

The lengths are the pictures' frames:

| | Cold open | Act One | Act Two | Act Three | Act Four | Tag |
|---|---|---|---|---|---|---|
| Kokoro | 640 | 7,934 | 4,573 | 3,202 | 12,138 | 1,016 |
| EL | 583 | 8,059 | 4,340 | 3,114 | 12,398 | 1,016 |

Every v3.3 score render names its v3.3 timeline and is used. The Kokoro mix was run twice on the final tools, and the WAVs are bit-identical (md5).

### W.2 Measured (both variants)

| | Kokoro | EL |
|---|---|---|
| Cold open · Act One · Act Two · Act Three · Act Four (LUFS-I) | −16.0 · −16.0 · −16.0 · −16.01 · −16.01 | −16.0 · −16.0 · −16.0 · −16.02 · −16.01 |
| Tag | −17.47 (the dialogue guard, as in v3.2) | −17.55 |
| Episode (the story plus the card) | −16.03 LUFS | −16.05 LUFS |
| Highest true peak | −1.05 dBTP (the tag) | −1.44 dBTP |
| Dialogue spread | 1.97 LU | 1.95 LU |
| Unmarked holes | 0 | 0 (1 without the score: 0.35 s at S2.01's head, which the night's fifth covers) |
| Missing lines, missing SFX | 0, 0 | 0, 0 |
| **X6**, the avalanche (S6.01 to S6.06's freeze hit) | −15.89 → −14.23 (+1.66 LU, 1.84 dB); set piece +2.49 LU over the talk | −15.95 → −14.27 (+1.67 LU); +2.49 LU |
| The shatter · the odometer | +2.27 · +2.43 LU | +2.36 · +2.33 LU |
| The outro | the hum held 2.0 s, first hit −6 dB; seam step 11.7 dB (400 ms) | 11.4 dB |

**X3, the night's re-entry** (composer Y's `designed_hit`: the fifth at Act Four 41.017 s, 0.400 s before the cut into S2.01; EL 42.308 s):

Composer Y re-rendered Act Four on both locks (3ce2bd7): the fifth now swells in over 200 ms and sits −6.5 dB. Only Act Four was re-mixed, on both variants. Every other mix and stem is bit-identical (md5).

"Over the room" is measured against the 400 ms before the fifth: the room after the post, −38.6 / −39.0 LUFS. Levels are K-weighted.

| | v3.2 mix | v3.3, first render (mix) | **v3.3, Y's re-render (mix)**, Kokoro / EL | Y's stem as rendered |
|---|---|---|---|---|
| First 100 ms over the room | — | — | **+10.9 / +11.2 dB** | −29.0 LUFS |
| First 400 ms over the room | +24.3 dB, on the cut | +21.5 / +21.7 dB | **+16.2 / +16.5 dB** (−22.4 / −22.5 LUFS) | −23.7 LUFS |
| Loudest 100 ms (the swell's top, about 0.1–0.3 s in) | — | — | +18.5 / +18.7 dB | −21.4 LUFS |
| Step at the cut (0.5 s either side) | — | −8.9 / −8.6 dB | −6.4 / −6.0 dB | −6.5 dB |

- **Act Four:** −16.01 LUFS on both, with the same gain as before (+1.05 / +1.06 dB) and 0 unmarked holes.
- **The re-entry:** no longer counted as an unexplained jump.
- **X6:** +1.66 / +1.67 LU, with the set pieces at +2.49 LU.
- **The act3 → act4 and act4 → tag seams:** unchanged.
- **The tag:** not re-mixed. Y's change is the night cue only (`cue_night.py`, and `NIGHT_ENTRY_DB` / `NIGHT_SWELL_S` in `a4common.py`). The vault's ring-out comes from the last cue.
- **The episode report:** updated, −16.03 / −16.05 LUFS.
- **The click scan** at Act Four's boundaries, after the re-mix, matches the earlier run:
  - the score and mix have no flags;
  - the room has the office tick at 98.435 s (Kokoro only), 10.1×;
  - the SFX stem has no truncations.
- No mix-side ride was added.

**The click scan** (the second difference over 10× the local 99th percentile, at every beat boundary, on the room, SFX, score and mix stems; then a whole-stem cut-off sweep):
- **Room stems: one flag in both variants.** It's Kokoro Act Four 98.435 s, 10.1×: the office clock's own tick (−47 dBFS), 23 ms before S3.01 → S3.02. Both beats are in the office, so it's not a room change. **No room change steps**, and there are no room cut-offs.
- **SFX stems: no truncations.** Every non-onset boundary flag is a laid sound's attack on its cut:
  - `freeze_hit_F`: Act One 9.04, and Act Two 13.03 and 17.04;
  - `collar_pop_F5` (9.08);
  - `synth:thud` (v31-12.03);
  - `post_click` (Act Three 20.03).

  Every cut-off is the sound's own decay inside its body: the UI clicks, the phone steps, the egg timer's 3 ms ticks, `neon_ignite` and `glyph_blink`.
- **Score, three flags, all designed:**
  - Act Two 15.10 (30×): the Senate cue's pizzicato on the cut, masked in the mix;
  - Act Three 23.01 (18×): THE CLOCK's "step on F", bar 1;
  - the tag 8.88 s (31×): the demo film "cuts out dead" on the first still.
- **The mix: the same moments and nothing else.**
  - The thud, the shutter (Act Two 13.12), the post click and THE CLOCK's step.
  - The whole-stem sweep finds only the `dialog_ok_click--chip` decay (Act One 186.9 s) and the tag's 8.88 s cut-out.
- The EL scan has the same kinds of flags at its own times. The office tick, the Senate pizzicato and THE CLOCK's step don't cross 10× there. Act Two 13.03's freeze hit does cross it in the EL mix (17×).

**Sound spots (the Act One picture pass):**
- **11.04's click:** `ADD_SOUND` lays 5.08's `dialog_ok_click` with its peak at frame 108.1, 6 frames before the cheer at 114.1.
- **9.13's `folder_close`:** `MOVE_SOUND` moves it to v31-10.04, with its peak on frame 56 (16 frames before the match).
- **The collar's clasp at 9.09 (new):** `CLASP`, a synthesized soft clink, peaks at −31 dBFS on k21, one frame before the stick's `key_ring_jangle_3` (−28).
- **S7.02b's TV line** is the take's own `tv` chain (fastrec's, both variants). The mix adds no second chain.
- **The Act Two → Three seam:** with the glass (17.12) cut, Act Three's rack room leads 0.6 s under 17.13's black, as the plan's J-cut says (`LEAD_AT_LOCK`).

### W.3 The tool changes (made before the lock, checked on v3.2)

| Item | Measured cause | Fix (stems.py / mix_episode.py) |
|---|---|---|
| **X1**, film 15:19.52 | Not `cloth_rustle`: that file ends at −92 dBFS. The cut is S4.08's `DIALTONE` (`dial_tone_speaker.wav`, a loop that ends at −11 dBFS), laid at 193.14 s in Act Four and cut off by its `dur` at 195.65 s. | **General:** every SFX passes through `tail_safe()`. If the last 2 ms of what is laid is above −60 dBFS, it gets a 20 ms cosine tail fade. **Here:** `SOUND_UNTIL` ends the dial tone on its own 0.35 s fade. |
| **X4**, film 12:54.50 | The rooms already crossfaded. The step was an LED tick laid exactly on the whip's cut (50.625 s = 162 × 0.3125) with an instant sine onset. | The ticks get a 1 ms attack, and none is laid within 40 ms of a room run's edge. **General:** every hard room cut's minimum fade is now 10 ms (the hall cut, the applause, the cursor cut, the end fade, the hum gate). |
| **X6**, film 18:00–18:14 | The avalanche's mean short-term loudness was −15.87 LUFS. | Adds `GAIN_ROWS` to the mix: S6.01 through S6.06's `freeze_hit_F`, +1.75 LU on music plus SFX (0.6 s ramp in, 0.3 s out, capped at 4 dB). On v3.2 it measured −15.87 → −14.20 (+1.67 LU, gain 1.84 dB). This is on top of the set piece's peak lift; the score's −2 dB ride is kept. |
| **X3's mix side**, film 12:45.29 | — | Waits on composer Y's refit. Once it lands, I will measure the night cue's re-entry in the mix. |
| **The click scan** (before the mixes) | — | `click_scan()` runs on every room and SFX stem. At each beat boundary it flags a second difference over 10× the local 99th percentile, as an onset, a cut-off or a step. It then sweeps the whole stem for cut-offs (a 12 dB drop in 5 ms from above −50 dBFS, at 10× local). SFX cut-offs are split into `truncation` (at a sample's laid end) and `in-sample` (the source file's own decay). Results go in `<seg>-stems-qa.json` → `click_scan`. |

The scan on v3.2, after the fixes (in scratch, then deleted):
- **Act Four:** room clean (no boundary flags, no cut-offs). SFX: no non-onset boundary flags, and no truncations. Four `in-sample` decays are over 10×, all the sample's own envelope:
  - 16.245 and 193.02: `dialog_ok_click`, a UI click whose file falls 20 dB in 5 ms at 75 ms;
  - 198.235: `post_click`, which falls 15.5 dB at 75 ms;
  - 471.02: `neon_ignite`, whose transient falls 31 dB at 5 ms.
- **The cold open:** clean.

## V. v3.2: the final lock

### V.1 Re-run

```sh
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all                  # v3.2, Kokoro (the default lock)
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --variant el     # v3.2, ElevenLabs
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --lock v31       # v3.1 still works
```

| What | v3.2 |
|---|---|
| Timelines | `show/reel/ep01-v32/ep01-v32-<seg>.json`, EL `show/reel/ep01-v32-el/ep01-v32-el-<seg>.json` |
| Stems | `audio/reel/ep01-v3/v32/` (WAV), `audio/reel/ep01-v3/v32/el/` (FLAC), including `tag-tail` (the hum past the tag's end) |
| **Mixes** | **`out/ep01/full-v3/mix-v32/<seg>-mix.wav`**, `out/ep01/full-v3/mix-v32-el/`, each with **`outro-mix.wav`** (§V.3) |
| QA and the loudness report | `audio/reel/ep01-v3/mix-qa/v32/<variant>/` |

The lengths are the pictures' frames: cold open 640, Act One 7,914, Act Two 4,633, Act Three 3,418, Act Four 12,203, tag 992.

As in v3.1, a score render counts only if its cue sheet names this lock's timeline and its length is within a frame. Until the v3.2 renders land, the v3.1 renders at the same paths are refused, and a mix run then says `score: not this lock`.

### V.2 What changed in the stems

**The lead's items:**
- **11.04, the click that ships GTP-4:** launch night's click (5.08's `dialog_ok_click`, −12 dBFS). Its peak lands 6 frames before the cheer, frame 108, where the picture clicks. It's anchored to the cheer, so EL follows its own timing.
- **The laptop's close** stays on 10.04's lid (16 frames before the end), moved from the timeline's 9.13.
- **15.15, onto the picture:** the cut to the HIGH is on "licenses" (k68). The slide now starts on the sheet's first step (the word +10 frames, k78), and the stamp's peak lands on the stamp (the word +42 frames, k110). They're anchored to the word, so EL follows its own timing.
- **21.02** keeps one deepfake pop (as v3.1).
- **The tour's stamp J-cut** (v3.2 moved it to 15.14, lead 0.5 s): **not applied.** The act2 score ends its Senate chord (senate_b, to 147.125 s) and lands its first knee stab exactly on 16.01's cut. The first stamp stays there with them; 0.5 s early it would flam against both. To have the J-cut, composer X would move the chord's end and the first stab 0.5 s earlier, and the stem follows with one entry.
- **11.04's click vs the score:** act1's sheet marks "HIS CLICK ships GTP-4" at 11.04 +1.0 s (297.625 s; EL 303.04), the downbeat before "Addendum." as the script's §5 has it. The final picture clicks at frame 108 (+4.5 s, 301.125 s), 6 frames before the cheer. The click follows the picture, so the score's chip bar comes about 3.5 s before it. **For the lead / composer X:** move the score's slot to the picture's frame, or accept the gap.

**The new beats:**

| Beat | Sound |
|---|---|
| **v32-7.03, his call** | • One ring through the phone's small speaker.<br>• The tap as he answers (the cut to his ear, 6 frames before "Mas.").<br>• The hang-up (the timeline's).<br>• If the score doesn't take it, the siren leads 8.01 by 0.8 s from the call's end.<br>Tasya's two lines take the phone chain. |
| **v32-S1.13, his post** | • His thumb on the glass up to the send pop.<br>• The suite steps down −2, −4, −7 dB with the picture's three palette steps to night.<br>• The dark room's drone leads S2.01 by 0.6 s under the last step. |
| **v32-21.06, the switch** | • The monitor's click-off (k21).<br>• The clapping grows through the black glass into a hall: low-passed at first, opening, −18 dB up to −26 dBFS peak, into 22.01's applause. |
| **22.01, DevDay live** | • **A new room, the DevDay hall:** a big crowd settling, with the hall's reflections. It leads the cut by 1.0 s.<br>• His stage line takes a PA chain with the hall answering (`stage`). |
| **v32-22.04, the sign-ups** | • The timeline's whirr, post and blink.<br>• **The rack's fans up a step** with each LED step: +2.5 dB at k23, +5 dB at k47, back down over 1.5 s after the beat.<br>• A grey-out tick as SIGN UP greys (k87). |
| **v32-S5.00, the lobby by day** | • **The NopeAI lobby by day** (room tone, far steps), leading 0.8 s under S4.08's dial tone with the revolving door's sweep.<br>• The lanyard slid across the stone, then its clip (k31).<br>• The timeline's shutter and post.<br>• **The CCTV hum comes in from his look up** (it leads S4.09 by 2.6 s) as the lobby fades out under the picture's step into the camera's grade. |
| **S5.11, the badge** | • A plastic card skidding across the wooden floor (it replaces the paper `folder_slide`).<br>• The timeline's tick on the chair leg and the set-down. |

20.02 (the LEDs stopping) is cut from the v3.2 story, so the LEDs simply run on.

**The tag's demo film is the score's now.** Composer X's v3.2 tag carries the film's own track: its bed, the stutter's clicks, the stills' slide-change clicks, and the chip blip at i213. So the stem drops its own versions whenever the sheet claims them (`demo-film`, `demo-blip`), and keeps only the room's duck and its four-step return.

The v3.1 tag mixes (`mix-v31/`, `mix-v31-el/`) were made before this claim existed, so they play both versions of the demo film at once. A `--lock v31` re-run of the tag would fix them.

### V.3 What changed in the mix

- **Designed hits keep their attack.** An act's head fade becomes 40 ms when the cue sheet marks a `designed_hit` in the first 1.2 s (the fix for audit #13). Composer X marks Act One's head downbeat at 0.0 s ("A1 THE DOWNBEAT … HARD CUT on the downbeat, out of the card"). Otherwise the 1.0–1.2 s fade stays.
- **The tag → outro seam** (audit-v31 #4). The tag's picture is fixed, so the hum is held under the outro instead: the stems build 2 s past the tag's last frame (`tag-tail`). The mix writes **`outro-mix.wav`**, a copy of the outro's audio (`out/ep01/outro/outro-b-v3.wav`), with:
  - the tag's hum held 2 s under its start, crossfading out;
  - a 150 ms fade-in;
  - **its first hit 6 dB down.**

  **For the assembler:** play `outro-mix.wav` in place of the outro's own audio, at the manifest's −1 dB as before. The hum is laid pre-compensated for that −1 dB, and nothing else needs changing.
- **Kept from v3.1:**
  - the set pieces lifted to +2.5 LU over the talk;
  - the act-break fades;
  - room tone under every black;
  - the laps' ride;
  - the one silence from the Remove click.

### V.4 Measured (both variants, on the final v3.2 renders)

| Segment | Kokoro s · LUFS-I · TP | EL s · LUFS-I · TP | Unmarked holes |
|---|---|---|---|
| cold open | 26.67 · −16.0 · −5.0 | 24.29 · −16.0 · −3.4 | 0 · 0 |
| Act One | 329.75 · −16.0 · −1.5 | 334.96 · −16.0 · −1.5 | 0 · 0 |
| Act Two | 193.04 · −16.0 · −1.5 | 183.25 · −16.0 · −1.6 | 0 · 0 |
| Act Three | 142.42 · −16.0 · −1.4 | 138.75 · −16.0 · −1.5 | 0 · 0 |
| Act Four | 508.46 · −16.0 · −1.5 | 521.63 · −16.0 · −1.5 | 0 · 0 |
| tag | 41.33 · **−17.2** (guard −1.1) · −1.7 | 41.33 · **−17.2** (guard −1.2) · −1.2 | 0 · 0 |
| **Episode** (story + card) | **1243.7 s · −16.03** · LRA 7.2 · dialogue spread 1.9 LU | **1246.2 s · −16.03** · LRA 7.8 · spread 2.0 LU | |

The holes are also 0 unmarked without the score.

**Seams:**

| Seam | Kokoro | EL | What it is |
|---|---|---|---|
| card → Act One | **+18.6 dB** | **+20.6 dB** | **the designed downbeat, restored** (audit #13) |
| Act One → Two | −0.5 | +0.6 | |
| Act Two → Three | +0.7 | −0.1 | |
| Act Three → Four | −0.1 | +0.3 | |
| Act Four → tag | +0.3 | +1.2 | |
| **tag → outro**, with `outro-mix.wav` at the manifest's −1 dB | **+11.9 dB** over 400 ms | +10.7 | was +20.0 in the v3.1 film |

**The tag → outro seam.** The tag's black (33.05) is only 1.25 s, so the audit's "2 s of hum alone" can't happen inside the tag. **For the assembler, if it's wanted:** hold 0.75 s of black before the outro, and play `tag-tail`'s hum under it. The hum is ready in the stems.

**Set pieces** (peak over the talk, Kokoro / EL):

| Set piece | Kokoro | EL |
|---|---|---|
| the odometer | +2.3 LU (no lift needed) | +2.5 |
| the avalanche | +2.5 | +2.5 |
| the shatter | +2.3 | +2.4 |

**The one silence:** 5.07 s at −48.8 LUFS.

**The V.O.** (the lead asked for it to sit with the dialogue). The composer's "V.O. windows" (−30.1 under "i don't keep score.", −20.9 under the count) measure **the score under the V.O.** against the bible's −24 ±2. They don't measure the voice.
- Every V.O. take is −18.0 LUFS, 2 dB under the spoken takes (−16), by the take pass's design.
- Measured in the finished mixes, the V.O. lines sit together, 1.7 LU (Kokoro) and 2.1 LU (EL) under the spoken median.
- "i don't keep score." reads −16.2 and the count −16.5 (Kokoro), in line with Act Four's other V.O. (−16.1 to −16.5).
- In the mix the score under them is ducked by the mood's depth (9 and 7 dB), so neither covers the voice.
- **To put the V.O. level with the spoken lines:** set `VO_GAIN_DB = 2.0` in mix_episode.py and re-run.

**Named moments:**

| Moment | dB against the bed, in band |
|---|---|
| the lap the Orb follows | −2.1 |
| the far lap | −5.8 |
| the egg timer | −3.2 |
| the Build's pre-lap | −3.2 |
| the pen | +7.8 |
| 20.06's keys | +0.4 |
| S5.09-back's keys | +4.0 |
| the first second of his look | no keys |
| the shatter | +22.3 |

The demo film's checks now read no SFX there, because the score carries the film's own track.

## 0. v3.1: the final lock

### 0.1 Re-run

```sh
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all                  # v3.1, Kokoro
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --variant el     # v3.1, ElevenLabs
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --lock v3        # the v3 lock, still works
```

**v3.1 is the default lock.** `--lock v3` keeps the v3 lock working. v3.1's outputs don't touch v3's:

| What | v3.1 | v3 |
|---|---|---|
| Timelines, Kokoro | `show/reel/ep01-v31/ep01-v31-<seg>.json` | `show/reel/ep01-v3/` |
| Timelines, EL | `show/reel/ep01-v31-el/ep01-v31-el-<seg>.json` | `show/reel/ep01-v3-el/` |
| Stems | `audio/reel/ep01-v3/v31/` (WAV), `audio/reel/ep01-v3/v31/el/` (FLAC) | `audio/reel/ep01-v3/`, `…/el/` |
| **Mixes** | **`out/ep01/full-v3/mix-v31/<seg>-mix.wav`**, `out/ep01/full-v3/mix-v31-el/` | `out/ep01/full-v3/mix/`, `mix-el/` |
| QA and the loudness report | `audio/reel/ep01-v3/mix-qa/v31/<variant>/` | `audio/reel/ep01-v3/mix-qa/<variant>/` |

**A score render is used only if it belongs to the lock.** The v3 and v3.1 renders share their paths (`audio/ost/tracks/e01-v3-<seg>/render/music.wav`, `music-el.wav`). So the mix reads the timeline the render's cue sheet names and checks that the length is within a frame.
- A render for the other lock is refused and reported (`score.not_this_lock` in the QA).
- **The Kokoro v3 renders have been replaced by v3.1 ones.** A `--lock v3` re-run now mixes with no score, and says so. **The v3 mixes already made (`out/ep01/full-v3/mix/`) were left as they are.**
- Checked in scratch: the v3 path builds and mixes, and it refused the v3.1 renders.

### 0.2 What changed in the stems

**The cold open (640 frames)** has no 1993 flashback, so it has no PC fan either.
- The rewind speeds up from the slip (k37) and brightens, with a tape whirr riding its speed.
- The collapse (k100–105) darkens it in three steps. It cuts dead on the cursor frame (k106), where the cold-open score lands its last swell and goes to zero.
- Only the black's faint tone sits under the last two frames.

**Act One:**
- **Sydney's egg timer ticks "in its tempo".** Its tempo is measured from the score's render (96 bpm), and it ticks from the clip (10.03) to the ding (10.04). It restarts ("reset to 5") under the lid's close, and carries the match cut two bars into 11.01, fading. Peak −23.
- **The Build's chip line** still leads 10.04 → 11.01, at the score's measured 95 bpm, and ends a 16th before the cut. The v3.1 score now opens 11.01 on the ATEM sting and boots the chip only at the split, so nothing doubles.
- 12.04's pen J-cut is dropped: EMIT's THUD (v31-12.03) now sits between Nole and the desk, and its own pen comes in under its tail.
- **The laptop's close moved from 9.13's tail onto the lid in v31-10.04** (the lead's note). Its loudest sample lands 16 frames before 10.04's end, where the shot pass shuts the lid ("half down, held 4 frames, then shut, held 16"). The egg timer ticks under it, then the Build's chip line leads the cut.

**Act Two:** 16.01's first stamp stays on the picture with the score's first stab. The plan's 15.16 J-cut would flam against it.

**Act Three:**
- The act opens on the rack's fans under the black (v31-18.00, 1.0 s).
- The hands runner's first item (v31-19.02) gets the monitor's murmur and a small audience laugh, through the monitor.
- **21.02's second deepfake pop is dropped:** one copy on screen now (the lead's note). The rule keeps one pop per deepfake line, so v3's two copies keep both.
- 20.01's keys lead by 0.5 s (v3.1's plan).

**Act Four:**

| Item | What was done |
|---|---|
| **The one silence** | Starts on the **Remove click** (v31-S1.08d +1.9 s) and runs to the buzz: 5.07 s |
| **The laps, audible but distant** | Hotter (peak −19, and −17 for the car the Orb follows in v31-S1.01b), with the distance in the sound: the top off, the Strip's walls answering late. The followed car goes behind a grandstand (10 dB down and duller) and comes back. |
| The JOIN ping (S1.02) | the board's join chime through the laptop, peak −24 |
| **The phones in a row** (S4.09) | four `phone_buzz_step` buzzes in a row, then one now and then, still buzzing |
| **The outgoing ring** (S5.09) | a ringback through the monitor instead of an incoming ring: "It rings out." |
| **2 AM** | v3.1 moved "gerg never waits to be asked." onto his look, and S5.09-back holds "where his keys stop". The keys stop on **the act4 score's own Build stop**, read from its cue sheet (332.99 s), after "Just in case." |
| **S7.13, Ttemme's stream** (runway.md §11.6; k = the beat's frames) | • k128–252: the boardroom goes out, and his mic's thin, compressed room comes in.<br>• A crush-to-clean sweep at k140, and another back at k238.<br>• Glass ticks at k155, 161 and 168.<br>• **The shatter, raised to −10 dBFS.**<br>• Shards at k174.<br>• Near silence for the held beat (k179–207).<br>• The sand slumping, pouring and settling (k208–229).<br>• The boardroom back at k252.<br>His line takes a light "through his stream" chain. |

**The tag: ELGOOG's demo film** (runway.md §7; i = the insert's frames, tag frame = i + 62):
- **Its own bright product-film bed:** E♭ major 9, with no A natural and no F bass. It's small from the monitor at first, then opens to full range at i22–26.
- A shimmer rises (i34–47), then the swell to the fill and a glow as the duck becomes real (i88).
- **The stutter** (i137–147): the bed is chopped in step, with a click on each dropped-frame hold. **It cuts out dead at i151.** Then come slide-change clicks on the three stills (i151, 159, 167).
- **The room ducks −10 dB under it, then comes back in four steps** (i199–208), with the LEDs from i202. A chip blip at i213.
- "What the quack!" plays full range (the film has opened up), with no monitor chain.

**Every act-out black** carries a faint room tone (−54 LUFS) and is never digital zero. That includes the 160 ms at Act Three's 23.04 that the mood analysis found.

**Left as it is: S7.06's order.** The caption's joke is "click, then freeze", but the lock puts `freeze_hit_F` at 0.25 s and the dry click at 2.8 s. The final Act Four picture draws its freeze on that hit (k6) and Terb's squeeze on the click (k67) (shots-act4.md). Moving the hit after the click would desync the drawn freeze, so the stems keep the lock's order.

### 0.3 What changed in the mix

**The set pieces rise +2–3 LU over the talk** (the mood analysis §4 #3):
- The score and the SFX (not the dialogue) are lifted in each window until its peak loudness is 2.5 LU over the segment's talk: the median 3 s loudness where lines cover most of the window. The lift caps at 6 dB (9 dB for a short hit).
- The odometer and the avalanche are measured on 3 s short-term loudness; the shatter on 400 ms momentary.

**The act breaks:**
- Each act's score fades in over 1.0–1.2 s at its head (Act One after the card, Act Two, Act Three, Act Four).
- The room leads under the black, as before.
- All five seams now step less than 1 dB. v3 had +20.3 and +21.1 dB at Acts Two and Three; the v3.1 score's first frame at Act One would have been +16.

**A score ride:** −4 dB under v31-S1.01b, so the practice lap the Orb follows has room.

**The v3.1 mood headings** (`music (v3.1): …`) are read for the duck depth: SYDNEY 8, ACT THREE 7, THE CLOCK 9, 2 AM 7.

### 0.4 Measured, Kokoro v3.1

| Segment | s | LUFS-I | True peak | LRA | Dialogue | Gain | Score under / between speech |
|---|---|---|---|---|---|---|---|
| cold open | 26.67 | −16.0 | −5.0 | 11.0 | −14.6 | +1.4 | — / −25.5 |
| Act One | 337.46 | −16.0 | −1.5 | 5.5 | −15.1 | +1.3 | −30.1 / −21.1 |
| Act Two | 201.25 | −16.0 | −1.5 | 6.0 | −15.4 | +0.8 | −30.7 / −21.8 |
| Act Three | 145.13 | −16.0 | −1.4 | 5.2 | −15.1 | +2.1 | −28.3 / −20.9 |
| Act Four | 517.75 | −16.0 | −1.5 | 7.0 | −15.2 | +1.0 | −30.4 / −21.8 |
| tag | 41.33 | −16.5 | −1.6 | 13.3 | −13.6 | +3.3, guard −0.5 | −32.0 / −23.1 |
| card | 2.0 | −36.2 | −23.2 | — | — | Act One's | — |
| **Episode** (story + card) | **1271.6** | **−16.02** | | 6.8 | spread **1.8 LU** | | |

**Unmarked holes: 0 in every segment, with the score and without it.** The marked ones are:
- the one silence (5.0 s);
- Act Three's black (0.65 s, room tone under it now);
- S7.13's held beat;
- the demo's stills.

**The seams** (last 200 ms against the next chapter's first 200 ms; sample jumps all under 0.006):

| Seam | Step |
|---|---|
| card → Act One | +0.4 dB |
| Act One → Act Two | +0.3 dB |
| Act Two → Act Three | +0.8 dB |
| Act Three → Act Four | +0.4 dB |
| Act Four → tag | +0.6 dB |

**The set pieces** (peak over the talk):

| Set piece | Before | After | Lift |
|---|---|---|---|
| the odometer | +1.9 LU | **+2.5** | 0.6 dB |
| the avalanche | +1.7 LU | **+2.5** | 0.85 dB |
| the shatter (400 ms) | −4.0 LU | **+2.3** | 6.5 dB |

**The one silence:** 5.07 s at −49.0 LUFS, loudest 50 ms window −47.2 dBFS. The score was already digital zero there.

**Named moments** (the SFX against the bed, in the sound's own band, where nobody speaks):

| Moment | dB |
|---|---|
| the lap the Orb follows | −2.1 |
| the far lap | −5.8 |
| the egg timer | −3.0 |
| the Build's pre-lap | −3.7 |
| the pen | +7.2 |
| 20.06's keys | +2.0 |
| S5.09-back's keys | +0.7 |
| the first second of his look | no keys |
| the shatter | +21.6 |
| the demo's bed, opened up | +6.2 over the ducked room and score |

### 0.5 For an ear (v3.1)

1. **The laps:** audible and distant, or now a foreground car?
2. **The egg timer** in the music box's tempo, and across the match cut into the Build's pre-lap. One clock, or two?
3. **The demo film:** does the stutter read as the film breaking (not the player buffering), and does the room's return in four steps land "those are stills."?
4. **S7.13:** the shatter at +2.3 LU. Big enough for the gag, and does the held beat's near silence feel like the gag's timing?
5. **The lifted set pieces:** a lift, or just louder?
6. **The act breaks' 1.0–1.2 s fade-ins:** does each still arrive, or does it now creep in?
7. **The cold open's cut on the cursor frame:** does the intro's first beat take over cleanly?

### 0.6 ElevenLabs v3.1

Mixed on all six v3.1 EL renders (`out/ep01/full-v3/mix-v31-el/`):
- every segment −16.0 LUFS, and the tag −16.6 after the guard;
- episode −16.03 LUFS, dialogue spread 1.81 LU;
- 0 unmarked holes.

The run's lowest available memory was 18 GB.

**The files:**

| What | Where |
|---|---|
| **The mixes** (Kokoro) | `out/ep01/full-v3/mix/<seg>-mix.wav` for `coldopen act1 act2 act3 act4 tag`, plus `card-mix.wav` (the 2 s filename card). 48 kHz / 24-bit stereo, each exactly its segment's frames × 2000 samples. Git-ignored. |
| **The mixes** (ElevenLabs) | `out/ep01/full-v3/mix-el/<seg>-mix.wav`, on the EL-timed timelines' own clock |
| The stems (Kokoro) | `audio/reel/ep01-v3/<seg>-room.wav`, `<seg>-sfx.wav` (48 kHz / 24-bit, git-ignored), `<seg>-stems-qa.json`, `stems-inputs.json` (the fingerprint) |
| The stems (EL) | `audio/reel/ep01-v3/el/<seg>-room.flac`, `-sfx.flac`. FLAC, lossless: the disk was at 2.7 GB free when they were first built, and FLAC is 3× (rooms) to 9× (SFX) smaller |
| The QA and the report | `audio/reel/ep01-v3/mix-qa/<variant>/<seg>-mix-qa.json`, **`loudness-report.json`** |
| The code | `audio/reel/ep01-v3/stems.py` (A2), `audio/reel/ep01-v3/mix_episode.py` (A3). Each docstring is the full spec. |

## 1. How to re-run

One command per variant, from the repo root:

```sh
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all                  # Kokoro
audio/.venv-casting/bin/python audio/reel/ep01-v3/mix_episode.py --all --variant el     # ElevenLabs
```

- **It runs itself through `ops/heavy.sh`** (`--no-heavy` skips that). It takes about 4–5 minutes per variant on this laptop, with the stems rebuilt when needed (about 1.5 min of that).
- **It rebuilds the stems only when an input changed.** The inputs are:
  - the six timelines;
  - the beat plans;
  - stems.py itself and the v2 stem modules it borrows from;
  - the SFX manifest;
  - **what the scores claim** (§2.3).

  A new score render, a new take or a re-timed lock is picked up by the same command.
- **Some segments only:** `mix_episode.py act3 tag [--variant el]`. The dialogue guard and the seam ramps then take the other segments' gains from the last full run's report.
- **Checks:** `--no-score` mixes without the scores, a check that the rooms and SFX alone leave no holes. `--rebuild-stems` forces the stems.
- **Where the scores are read from:**
  - Kokoro: `audio/ost/tracks/e01-v3-<seg>/render/music.wav`, with `cues.json` beside it or one level up.
  - EL: `render/music-el.wav` with `cues-el.json`. It also accepts `e01-v3-el-<seg>/render/music.wav` or `render/el/music.wav`.
  - A segment with no render mixes without a score and says `score MISSING`.

## 2. The layers

### 2.1 Rooms (the room stem)

**How it's built:**
- One bed per beat `room`, on one continuous clock for the card and Acts One to the tag (they play back to back). The cold open is built on its own, since the intro video follows it.
- **A new room leads the cut:** it rises (equal power) over the last 0.6 s of the outgoing shot, or over the plan's sound J-cut. The old room trails 0.4 s, or 0.2 s into a black.
- **J-cut leads, from the plans:**
  - 5.01 ← the card: 0.6 s
  - 9.01: 0.8 s (the lobby pre-lapped under his exit)
  - 11.01: 0.8 s
  - 13.01 and 18.01: under the act break's black (capped at the black's length)
  - 15.01: 1.0 s, under the clone's voice over black
  - 17.01: 0.6 s
  - S3.00a: 0.6 s
  - S3.06: 0.8 s
  - S4.09: 0.5 s
  - S5.02: 1.0 s
  - S7.01: 0.8 s
  - S7.05: 0.6 s
  - 32.01 ← Act Four: 0.6 s
- **L-cuts:** 13.14 (the room's air, 1.0 s) and the coda into the tag (0.6 s, the crossfade the script asks for).
- **Levels:** about −36 to −41 LUFS per recipe. Each is then lifted (up to 6 dB) until the 5th percentile of its 50 ms windows reaches −40 dBFS on the louder channel. Every room's level and lift is in its `-stems-qa.json`. Measured whole-stem levels: Kokoro room stems −35.2 (cold open) to −38.2 LUFS.
- **Rooms dip 2 dB under speech** in the mix (the sample's figure).

**Recipes:**

| Where | Room |
|---|---|
| Cold open | **the hall:** room tone −38 and a polite crowd −41, under the 0.5 s black.<br>**The banquet's applause** −29, swelling 6 dB after "forward", cut on the freeze.<br>**The freeze hum:** 120–700 Hz, −39, stepping 0/−4/−9/−16 dB with the rewind.<br>**The rewind:** reversed like tape, its speed following the Orb's counter.<br>**A 1993 PC's fan** under the flashback (new: without the score, v2 had a 5.5 s hole there).<br>These are coldopen_bed.py's recipes on the v3 clock. The hall and banquet carry 8 dB of the lock mixer's duck under the takes, baked into the stem, since they were built for it. |
| Act One | **the bullpen:** server hum −37 and one buzzing tube −49; duller and louder in the basement beats.<br>**The phone POV** (sc 8): the bullpen, plus Elgoog's lobby through his phone's speaker.<br>**The NopeAI lobby:** room tone and far steps on stone.<br>**The split:** the bullpen, plus the lighthouse's wind in the right pane.<br>**A standing desk in the dark.** |
| Act Two | **The White House:** HVAC, the mantel clock.<br>**The bullpen through glass.**<br>**The bay.**<br>**The Senate:** its air and a gallery that never settles.<br>**The rooftop wind.**<br>These are act2_bed.py's recipes, each with a steady air under it: their gusts and laps left lulls that read as holes.<br>The poster run (16.01) gets **a far street** (new; v2 had no room there). |
| Act Three and the tag | **The dark room:** the rack's fans −41 (low-passed), air −47, the drone −50, the cyan key's faint buzz, and **the LEDs ticking in straight eighths** (12 ms at 3.3 kHz, −39 dBFS peak).<br>The LEDs run at 96 bpm, phased so 23.01 falls on the grid, as in v2; the act3 score's bar lines sit on the same grid.<br>**The LEDs are out from 20.02 to 20.06** (the act's one quiet beat).<br>Act Three's room cuts at 23.04's black: the script's "CUT TO BLACK", where the lock's `room` said `dark`. |
| Act Four | **The suite:** its HVAC, the Strip far below, a diesel working on the circuit far off. Every piece stops on the Cancel click.<br>**Neleh's office:** a clock ticking once a second.<br>**The all-hands:** the crowd hushes −7 dB for the question, and the air stays.<br>The TPOOL flashback, the office at night, the boardroom, the split, the CCTV, the bullpen by day, the fires.<br>**The lobby at night:** the sign's neon on F from the moment it lights.<br>**The coda**, with **the vault's F hum** from S8.06, carried 1.5 s into the tag (the plan's L-cut).<br>**The dark room's drone** leads S5.02 by 1.0 s, under S4.15 (−36 LUFS on the lead, settling 10 dB into the bed). |
| The card | room tone −38, and the bullpen leading its last 0.6 s |

### 2.2 SFX (the SFX stem)

**Every beat `sound`**, at its written peak (the lock's makers: SFX-board files and the v2 modules' `synth:<kind>`).
- **Missing:** 0, in either variant.
- **J-cuts that name a beat's own sound** start lead_s before the cut:
  - 12.01's toast pop: 0.4 s
  - 12.04's pen: 0.5 s
  - 20.01's keys: 0.4 s
  - S4.01's heart gliss: 0.5 s
  - S6.01's first thock: 0.4 s
- **S4.07's four speakerphone tones** play Step Four's line, F4 E♭4 D♭4 C4, from the board's tuned keys. That's OST-BIBLE §6.8 request 1, which the act4 score's README says still stands.
- **Cold open:** the SFX keep the −10 dB the lock mixer gave the whole v2 stem under speech, so the plink sits where v2 put it.

**Added** (each listed in the stems QA's `added`, with the line that asks for it):

| Item | What was done | Measured (§5) |
|---|---|---|
| **Practice laps, far off, under S1.01** (notes §7) | Two made passes (an engine through its gears, a Doppler fall, the distance taking the top off), peaks −28 and −32 dBFS | −13.6 dB under the bed in their band (the score's felt bar is loud there): **probably faint** |
| **The Build's chip line leading 9.13 → 11.01** (notes §7) | The act1 score boots the Build on the cut: its first cell a fourth up, B♭, 16ths about 0.15 s apart, measured from the render, after 2 s of designed score silence for the laptop's close. So the pre-lap plays the cell's first four in F (F4 F4 G4 A♭4) at the same tempo and ends one 16th before the cut. The two should read as one line rising a fourth across the match cut. | +4.2 dB over the room in 300–3000 Hz; no score there |
| **The pen's scratch leading 12.04** (notes §7) | The scratch starts 0.5 s before the cut, with a first stroke under Nole's "quarter" | +16.2 dB over the bed in 3–9 kHz |
| **The dark room's drone under S4.15** (notes §7) | See §2.1 | visible in the plot: the room rises about 6 dB into S5.02 |
| **Gerg's keys loud in 20.06** (notes §7) | Typing down the call's line (350–3400 Hz) from where the beat's own `call_keys` ends, through 20.04 (−20 dBFS peak) and 20.05 (−22), **loud in 20.06 (−12, and −16 under the V.O.)**, on past the last line to the cut. Soft-saturated so they read at their peak. | +2.1 dB over the bed in 1–5 kHz, where the score's own chip Build plays |
| **Gerg's keys at 2 AM, so "His keys stop." is heard** (notes §7) | Through the monitor (250–5000 Hz):<br>• S5.09 from the click (−16);<br>• S5.06 sparse, none under his quotes or after "Scroll to the bottom." (−24);<br>• **S5.09-back typing hard (−10, −3 dB under his two thoughts)**, which **stops dead on the cut to his look (S5.09b)**, the same frame where the act4 score's Build "stops dead on his look up";<br>• one key on the cut out of S5.09b;<br>• faint keys on the small tile at the head of S5.11. | • S5.09-back: −1.9 dB against the score's Build in their band<br>• the first second of his look: no keys; the score's held pad at −45 dBFS in band |
| **The crane truck's grind and a dozen glass tings, pre-lapped under 23.04's black** (script) | The diesel grind rises under the black. The pass is loudest at S1.01 +0.5 s, and the glasses shiver across the cut. | the act3 score's sheet expects it ("the SFX pre-lap of the crane and the tings carries it") |
| **Elgoog's siren through his phone** (sc 7–8) | v2's layer on the v3 clock. **Dropped:** the act1 score plays it ("the siren's whine J-cuts in under the last puff (on his phone)") | — |
| **The anchor's too-smooth murmur** (sc 14) | v2's made formant voice through the phone, stopping for the clone's first word | — |
| **The call's waiting tone** (S3.00a J-cut) and **the all-hands hush** (S3.04b → S3.06 J-cut) | the board's ringback through a laptop band; `crowd_hush` 0.8 s before the cut | — |

### 2.3 What the scores claim (one owner per sound)

A sound the score may also play is left out of the SFX stem when the segment's cue sheet claims it. A claim is either:
- `"claims_sfx": ["<id>"]` at the top of the sheet; or
- a sync point, mark, row or cue in the sound's window that names it.

An entry that calls it "a timeline sound" or "the sound stem lays it" isn't a claim. The lead's two rulings apply whenever the segment has a score. **Dropped now:**

| Sound | Why |
|---|---|
| act2 `synth:stab` × 4 (the tour poster) | the lead's ruling; the score plays the knee stabs |
| tag `synth:button_chord` | the lead's ruling; the score plays the button with no third |
| act1's siren layer | the score: "the siren's whine … (on his phone)" |

**Kept:**
- **The cold open's freeze F4:** the score says "a timeline sound: the sound stem lays it".
- **Act Two's bell and KA-CHING:** "the bell decays alone".

**One consequence at 16.01:** the score's first stab lands on the cut. So the first stamp stays on the picture with it, instead of leading by 0.3 s (the plan's 15.18 J-cut), which would flam against the stab. The street's air leads the cut instead.

### 2.4 Dialogue, score and master (the mix)

**Dialogue:**
- Every take is laid at beatStart + t − in, dual mono at −3 dB. An interrupted line (`cut`) stops at its `dur`.
- **Small-speaker chains**, loudness-matched to the dry take and then −1 dB:
  - call: 300–3400 Hz, +3 dB at 1.7 kHz
  - monitor: 180–6500 Hz
  - laptop: 280–5500 Hz
  - phone (every line in sc 8's POV, room `phone`): 500–3400 Hz
- **How many lines take a chain:**
  - Act One: 6 phone
  - Act Three: 5 call, 6 monitor
  - Act Four: 1 laptop, 7 monitor, 1 call
- **EL:** every take (228 of 228) is levelled to its Kokoro counterpart's loudness, so the two mixes differ only in the voices.
- The EL takes' dry files are used, with the same chains, not the EL pass's device copies.

**The score:**
- Laid as delivered. **The cold open's MM-06 gets +6 dB** (the lead's ruling), onto the −20 LUFS reference.
- **Ducked under speech** with the lock mixer's envelope: 0.25 s before a line, joined across gaps under 2.5 s, 0.2 s in, 0.6 s out.
- **The duck depth follows the mood heading, smoothed over 1.5 s:**

  | Depth | Moods |
  |---|---|
  | 6 dB | launch night, "the Build thins" |
  | 7 dB | the dark room, 2 AM, the tag |
  | 8 dB | the odometer, Elgoog, the landlord, the White House, the tour, the avalanche, the return |
  | 9 dB | everything else |
  | 10 dB | the pause letter, the bridge, Vegas |

- A cue sheet's `duck_db` would override the mood depth for its window; none of the current sheets carries one.
- **−3 dB under a silent POST** when nobody speaks.
- **Act Four's Cancel click → buzz:** the score is gated to zero. It was already digital zero there: measured −inf before the gate.
- **The tag's head:** Act Four's score ends on a sounding pedal. Its release (`music-ringout.wav`, the act4 composer's hand-off) is laid at the tag's first sample and crossfades out (equal power, 2.5 s) from the tag score's first entry (0.60 s), as the lead asked.

**The master:**
- −16 LUFS integrated per segment.
- A look-ahead limiter (−1.5 dBFS ceiling) and a 4×-oversampled true-peak check under −1.0 dBTP.
- **The dialogue guard:** a segment whose dialogue would land more than 1.5 LU above the episode's median is turned down. Only the tag trips it (−1.08 dB, so it sits at −17.1 LUFS).
- **The seams:** each chapter's first 2 s ramp from the previous chapter's gain to its own, so a pedal, a room or a pre-lap crossing the seam doesn't step.
- **The card** takes Act One's gain.

## 3. The silences and stops

- **The one designed silence** runs from the Cancel click (S1.09 +2.4 s) to the phone's buzz (S1.11 +0.3 s): 3.69 s in both variants.
  - Every room goes out on the click (12 ms). Room tone only, at −50 LUFS. The rooms come back on the buzz (80 ms).
  - The click keeps its own first 60 ms, and then there's no SFX.
  - **Measured in the mix:** −48.9 LUFS, loudest 50 ms window −47.1 dBFS, in both variants.
- **Act-out blacks:** 12.07 (the bullpen cuts with the picture), 14.06 (the clone's voice over black), 17.13 (the bell's last partial) and 23.04.
  - At 23.04 THE CLOCK stops dead, the room goes out over 0.25 s, and then the crane pre-lap rises.
  - The only measured "hole" there is 0.6 s at the start of that black, and it's marked.
- **The cold open's white:** the rewind steps down to nothing at white, as in v2. With the score and the PC fan it measures no hole.

## 4. What was measured

**Loudness (the report):**

| Segment | s (Kokoro · EL) | LUFS-I | True peak | LRA | Dialogue LUFS | Gain | Score under / between speech (dBFS RMS) |
|---|---|---|---|---|---|---|---|
| cold open | 30.67 · 30.04 | −16.0 · −16.0 | −4.5 · −3.2 | 8.1 · 7.5 | −14.0 · −14.0 | +1.9 · +2.0 | (no score under its lines) / −22.8 |
| card | 2.0 | −36.1 · −36.0 | −23.9 | — | — | Act One's | — |
| Act One | 322.50 · 337.46 | −16.0 · −16.0 | −1.4 · −1.2 | 5.6 · 6.0 | −15.0 · −14.9 | +1.5 · +1.5 | −29.0 / −20.7 |
| Act Two | 204.75 · 197.21 | −16.0 · −16.0 | −2.0 · −1.7 | 7.0 · 8.5 | −15.3 · −15.1 | +0.9 · +1.1 | −30.5 / −21.8 |
| Act Three | 128.04 · 125.33 | −16.0 · −16.0 | −1.5 · −1.4 | 5.2 · 5.0 | −15.1 · −14.9 | +1.9 · +2.1 | −29.1 / −20.5 |
| Act Four | 523.79 · 542.71 | −16.0 · −16.0 | −1.6 · −1.5 | 7.1 · 7.0 | −15.1 · −15.1 | +1.1 · +1.1 | −30.3 / −21.8 |
| tag | 33.88 · 33.71 | **−17.1 · −17.0** | −1.5 · −1.4 | 11.5 · 11.7 | −13.5 · −13.4 | +3.3 · +3.7, guard −1.1 · −0.9 | −44.9 / −22.8 |
| **Episode** (story + card, back to back) | 1245.6 · 1268.5 | **−16.02 · −16.03** | | 6.6 · 6.8 | spread **1.75 · 1.68 LU** | | |

**Holes** (under −42 dBFS for 0.3 s or more, louder channel, 50 ms windows):
- **Unmarked holes: 0 in every segment, in both variants, with the score and without it.**
- The marked ones: the one silence, 23.04's black (0.6 s) and, in EL, 17.13 (0.3 s).
- The mono downmix, which reads decorrelated beds about 3 dB low (the v4 note), counts 0–9 per segment. They're in the QA.

**Level jumps over 15 dB** (between 50 ms windows):

| | Kokoro | EL |
|---|---|---|
| Count per segment | 4–58 | 7–73 |
| Most of them | rises onto a word, or falls | rises onto a word, or falls |
| Rises onto an SFX | 0–4 | 0–4 |
| Rises with no word or SFX near them | 1–8 | 1–15 |

The unexplained rises are listed by time in each QA (`rising_other`).

**Score runs:** Act Three's score is one run of 125.6 s. The cold open's "4 runs" are MM-06's own 1-bit rests.

**Seams** (the last 200 ms against the next chapter's first 200 ms; sample jumps all under 0.005):

| Seam | Step | What it is |
|---|---|---|
| card → Act One | +1.0 dB | the bullpen rising |
| Act Three → Act Four | +0.9 dB | the crane pre-lap, continuous |
| Act Four → tag | −1.1 dB (EL −0.2) | the pedal, continuous |
| **Act One → Act Two** | **+20.3 dB** | a black, then the act2 score (MM-19) and the White House on the first frame |
| **Act Two → Act Three** | **+21.1 dB** | a black, then the felt's D♭ bloom on the first frame |

The two +20 dB steps are the scores' designed act-break entries, not a mix fault, but they are hard. **They're for an ear.**

**Named moments** are in each QA's `checks`: the SFX against the bed (rooms and score) where nobody speaks, in the sound's own band, for 20.06, S5.09, S5.09-back, after the stop, the laps, the pre-lap and the pen. See §2.2 for the values.

## 5. What was looked at

**Envelope plots** of the room stem, the SFX stem, the score and the mix, with the cuts and the lines marked, for Kokoro and EL:
- 12.01 → the black;
- 9.13 → 11.01;
- 20.01 → 20.06;
- the act-out and 23.04;
- S1.01;
- the Cancel silence;
- S4.15 → S5.02;
- 2 AM (S5.09 → S5.11).

They're scratch files, not kept. **Nothing was listened to.**

## 6. Calls I made, and where I departed from the brief or the plans

1. **The keys stop on the cut to Gerg's look,** with the act4 score's Build. The alternative was stopping just after "gerg never waits to be asked."
   - The script puts "His keys stop." after that line, and then, in S5.09b, "the Build and his keys stop together". The plan's why says the line lands before the stop.
   - Stopping on the cut satisfies all three and matches the score frame for frame.
2. **Act Three's room cuts at 23.04's black** (the script's "CUT TO BLACK" and pre-lap), where the lock's `room` field says `dark`.
3. **The Build pre-lap matches the score's tempo** (100 bpm, measured) rather than the bible's 96. It's in F, where the score's boot is in B♭. If the composer would rather own it: `claims_sfx: ["build-prelap"]`.
4. **The first stamp at 16.01 stays on the picture** (§2.3).
5. **The dialogue guard (1.5 LU)** is my addition to "−16 LUFS each". The tag lands at −17.1 LUFS instead of −16 so that its voices don't sit 2.5 LU hotter than the acts'.
6. **The practice laps and the crane are in the SFX stem,** not the room stem. They're events, and that way the mix can measure them.
7. **Added layers the plans didn't list:** the far street (16.01), the PC fan (4.01–4.02), the office clock, the waiting tone, the hush, the anchor murmur and the neon. Each comes from a script SOUND line or a hole, and each is listed in `added`.
8. **The EL stems are FLAC,** for disk. The Kokoro stems stay WAV as briefed.

## 7. For an ear, in order

1. **The act breaks' first frames (Act Two, Act Three):** the score enters about 20 dB over the black. Designed, or a jolt?
2. **Gerg's keys (20.06, 2 AM):** loud enough to be Gerg, not so loud they compete with him? Then **the stop on his look:** is it heard as the change the V.O. planted?
3. **The Build's pre-lap into the match cut:** one rising line, or two passes that don't agree?
4. **The one silence:** does room tone at −49 LUFS read as the room holding its breath, or as a fault? (The script asked for digital silence; the brief says room tone.)
5. **The practice laps:** likely too faint under the score's felt bar (−13.6 dB in band). Raise the first pass's peak in stems.py (`lap`, −28 dBFS) if they're wanted audible.
6. **The LEDs' tick** (−39 dBFS peak, all through Act Three and the tag): texture, or nagging? And is its drop-out at 20.02 heard?
7. **The small-speaker chains** on sc 8, the call and the monitor lines. And EL against Kokoro at matched loudness.
8. **The tag at −17.1 LUFS,** after the guard. Is it level with the acts by ear?

## 8. Hand-offs

- **To the assembly (F):** play `<seg>-mix.wav` as each chapter's whole sound. The card has its own `card-mix.wav`. The intro and the outro keep their own masters.
- **To the composers:** a cue sheet can take a sound over (`claims_sfx`), set a duck depth (`duck_db` on a cue, row or section), or put the LED grid on its tempo (`led_grid: {bpm, t0}`). The next `mix_episode.py --all` picks it up.
