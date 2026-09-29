# e01-v3-act1 · Ep1 v3 Act One "research preview" (sc 5–12) · the music stem

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md), on the mood map of [v3-plan §6](../../../../show/episodes/ep01/production/stick/v3-plan.md). **Nothing here has been listened to.** Every number below is measured, and the "for an ear" list says what only a person can judge.

## v3.5 FINAL (current, 2026-09-28): the ElevenLabs-timed lock

**The final film is `show/reel/ep01-v35-el/` (the ElevenLabs cast, Mario on Kokoro).** `render/music-el.wav`: **456.125 s (10,947 frames), exact.** `v3lib.kokoro_path()` and `el_path()` now point at the v3.5 locks; `--el` is the film. The Kokoro v3.5 stem was not rendered. Act One grew by about 1:53 (the first weeks, 3 AM, JUN 2018, the window, the vision post, the waitlist). Five new cues are built only when the lock has their beats (`CUES_V35`), so the older locks still refit.

**The cue sheet (EL seconds):**

| s | Cue | What plays |
|---|---|---|
| 0 → 166.2 | `a_launch` | As v3.4 (launch night, M1, the odometer, the heat, the landlord's call), with three changes (listed under the table). |
| 165.5 → 184.1 | **`first_weeks` (new)** | **The first weeks: "our Facemash night", a rising, fun pulse.** |
| 183.7 → 212.9 | `code_red` | Unchanged, on his phone. **The whine now J-cuts in under his phone's siren whoop** (v35-10.08, the SFX's), not the hang-up. The lock stops it dead. |
| 212.9 → 219.1 | — | **3 AM, no score** (marked): the at-capacity page and the first read; the bullpen's fans. |
| 219.1 → 259.1 | **`dream` (new)** | **3 AM's one moved moment, then JUN 2018: warm awe, the dream.** |
| 225.7 → 255.6 | **`arena` (new, diegetic)** | ATOD's arena on the wall of monitors. |
| 258.7 → 328.6 | `lobby`, `floor`, `lobby2` | Unchanged. The lobby's bass walks in on the revolving door, which v3.5 plays at the end of 2018 (v35-13.06). |
| 327.9 → 353.3 | `sydney` | Unchanged. |
| 353.3 → 392.0 | **`window` (new)** | **The window (the team's peak), the lamp, and the vision post (quiet ambition).** |
| 391.6 → 430.4 | `atem`, `duel` | Unchanged; the rivals' surge. The duel now ends on the waitlist's cut: its held B♭m(add9) rings to the rope's snap. |
| 429.9 → 434.5 | **`waitlist` (new)** | Elgoog's waitlist: a smug little sting. |
| 434.2 → 456.1 | `pause`, `threat` | Unchanged: the THUD stops the chill, then no score until the THREAT on the pen's lift. |

**What changed in `a_launch`:**
- **The call hands off on the first weeks' match cut** (`call_out()`). The call used to hand off on the siren; the siren now comes after the montage.
- **The odometer's wait:** 5.12 is 2 s longer in v3.5 (USERS: 0, Gerg's three refreshes). The pulse plays alone through the wait, then the Build's 4 + 8 come in on the counter's first rolls. The render had a 2 s hole there before this fix.
- **One new rule:** a chord change that lands on a cut now pre-laps it by 0.25 s. The v3.5 grid had put one on 5.04's cut: +26 dB out of the last chord's decay.
- **A fader ride:** −1.2 dB on the odometer at the lay. Its p95 read −14.6 on this render, and the featured guide is −16.

**`first_weeks` in detail:**
- **The grid:** at 120 BPM, every one of the montage's cuts falls on a beat.
- **The rise:** each shot is one step up A♭ major (A♭, B♭m, Cm, then D♭, E♭, A♭). The chip's triangle pulse plays eighths on the root, with Gerg's Build in straight sixteenths on the chip (moved diatonically, its contour kept) and a felt stab on every cut.
- **The 808 joins a layer a shot:** the kick, then the hats, then the clap. The spiccato and the violins join at the top.
- **Nole's "scary good" is THE FLICKER:** the drums and the Build drop out, and the glass holds the Ache over F for the shot.
- **"how do i say sorry to my sister"** gets the felt's F4 on top: 3 AM's note, planted.
- **"7 × 8 = 54"** gets the Build's high note sagging a semitone (the wince).
- **The pull back** stops the drive on the cut. One hit rings into the whoop.

**`dream` in detail (3 AM, then JUN 2018):**
- **3 AM:** on his second read, one felt note, F4, held; the V.O. sits inside it, and nothing attacks. A sul-tasto viola takes the note's air after the V.O.
- **The glowing line (180 YEARS):** the same F blooms into D♭maj9(♯11), and the celesta draws the line.
- **2018, in the intro's post-2015 fidelity** (T3: acoustic with the chip; no tape or bitcrush): the Water Line's head on the felt at the wall of monitors, then a felt chord a bar through D♭ lydian (D♭maj9♯11, A♭/C, B♭m9, G♭maj9♯11), a sul-tasto pedal, and the Build soft in the gaps (Gerg coding).
- **After "What else would you build?":** the Door's head (A♭ D♭ | C G) in the gap, ending on its ♯4, held: no answer.
- **The side project:** the chip's flat line, F F F, rhyming with the launch click.
- **The sweep:** the celesta draws the line back down.

**`arena` in detail:** a small heroic F-minor loop (a spiccato ostinato, a horn call, snare rolls), laid through `era.futz('tv')` at −31 LUFS-I. It sits inside the dream's key and is softer under the talk.

**`window` in detail (the window, the lamp, the vision post):**
- **The window:** Gerg's marker plays the Build's A♭-major pass, climbing an octave at its end ("off the top of the glass"), over the felt's A♭maj9, which leads the cut from Sydney. A soft pulse follows. The exchange plays over a held D♭maj9, and the laugh gets the Build's "shipped" tag (E♭5 → A♭5). This is launch night's M1 colour: a small warm accent, not the trio.
- **The lamp:** one felt F4.
- **The vision post:** one held felt line over a sul-tasto D♭ pedal, a note for each thing he writes (A♭4 for the title; then C5, B♭4 and D♭5 for the three passages). The Ache sounds for a bar on "hopeful, and scary". Nothing attacks under "someone gets to be in the room.".
- **Publish:** the line steps to E♭, and the chip's Build line takes it up to A♭ and rings into the match cut. The Publish click is placed 0.5 s into 19.04, because the lock has no click sound.

**`waitlist` in detail:** on the rope's snap (0.9 s into v35-22.01, from the caption; the lock has no sound for it), the Build's tag on the chip and a pizz A♭, with the felt's A♭maj9 ringing under the pause letter's toast to the push.

**Measured:**
- **Levels:** −20.66 LUFS-I, −3.15 dBTP.
  - The first weeks: −19.0 (its shots rise from −22.3 to −17.0; the flicker −24.5).
  - The dream: −21.6 (3 AM −23.6).
  - The window: −21.0 (the window −19.7, the vision post −22.6).
  - The waitlist −20.9; the odometer (featured) −18.1, p95 −15.8.
- **Silence and gaps:** digital silence only in the three marked stops (3 AM, the pop, the THUD). No holes or fragments.
- **Engine checks:** F-major OK in every cue. The arena needed notches: its strings at 440/880/1760 Hz and its timpani at 111 Hz, where a spiccato and timpani resonance read as an A over the F. Rule 12 and the knee are 0.
- **Cut steps:** all six steps of 12 dB or more sit on a mark or designed hit. The designed hits are the downbeat, the first weeks' cuts, 3 AM's note and the window's pass (`cues-el.json` → `designed_hit`).

**Re-run:**
```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render --el
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/v35check.py      # the whole episode's checks (light)
```
The cue names are `a code_red lobby floor lobby2 duel pause threat sydney atem first_weeks dream arena window waitlist`.

**`v35check.py` (new, shared):** checks every segment's stem against the v3.5 lock and prints one table: the length, LUFS-I and true peak, unmarked silence, holes, fragments, the cut check (the audit's method, a K-weighted level 0.5 s either side of every cut), and the engines' F-major, rule-12 and knee results.

## v3.4 (superseded by v3.5, 2026-09-28): refit to the v3.4 lock

**The locks:** `show/reel/ep01-v34/` (the default) and `-el`. **`render/music.wav`: 337.542 s (8,101 frames); `render/music-el.wav`: 343.333 s (8,240 frames); both exact.**
- **The new and restored V.O.s play in the felt, with nothing attacking under them:**
  - 5.04 "…it goes out tonight anyway." (the felt under it; the pulse hasn't started yet);
  - 7.01 "mostly the bill. we can't buy that many…" (the heat's held strings only);
  - 11.03 Mario's V.O. (the duel thins as in round 1: no chip, Addendum or marimba under it; the felt holds).
- **One new rule:** a chord change that would land 0.1–0.35 s after a cut now pre-laps the cut by 0.1 s instead. The v3.4 grid had put one 0.08 s after the cut into 5.04 (+15 dB).
- **M1 and the act's `designed_hit` (t = 0)** are kept.
- **Measured:**
  - **Levels:** −20.5 LUFS-I on both locks.
  - **QA checks:** F-major OK, knee 0, written A♮ over F 0, no unmarked silence, holes or fragments.
  - **The cut check:** every score step of 12 dB or more on a cut is designed and marked.

## v3.3 (superseded by v3.4, 2026-09-28): refit to the final v3.3 lock

**The locks:** `show/reel/ep01-v33/ep01-v33-act1.json` (the default) and `show/reel/ep01-v33-el/` (`--el`). **`render/music.wav`: 330.583 s (7,934 frames); `render/music-el.wav`: 335.792 s (8,059 frames); both exact.**
- **M1** stays as below.
- **Timing:** 5.07 is longer (his silent face) and 9.09 is longer (the collar settled, then "it does.", which plays in the room's designed silence after the pop). Both follow the timeline.
- **6.06, the shorter post** (3.6 s): the violins land F5 alone into the cut to Rima.
- **Every rest fades to zero over 5 ms** (the lay-in's stops and fades, and the engine's mutes; audit-v32 X2).
- **Three fixes the v3.3 grid needed:**
  - The Build's felt double (F3) is gone wherever a pedalled chord would hold it. It had rung on as a bass under the chip's A♭ pulses, and the F-major check traced that as A energy.
  - The downbeat's low F lets go before the next pedal.
  - The Ache's colour now holds until his answer "still a preview." when that answer falls in the next bar. Otherwise a chord change lands 0.3 s after the cut to Alyi turning to him (+16 dB, the cut check).
- **Measured:**
  - **Levels:** −20.5 LUFS-I on both locks (launch night −20.0, featured odometer p95 −16.6 / −16.8).
  - **QA checks:** written A♮ over F 0, F-major OK, knee 0, no unmarked silence, holes or fragments.
  - **The cut check:** every score step of 12 dB or more on a cut is designed and marked.
  - **`designed_hit`:** t = 0 in `cues.json`, as before.

## v3.3 M1 (2026-09-28): launch night's one warm accent (in the cue definitions; the v3.3 refit follows its lock)

**The choice: the Build's pass in its A♭ major, not the Rhodes chord.** On "it likes me." (5.11), the felt arrives on A♭ major: Abmaj7, with its root, and the pulse and sub on A♭. That's for his line's bar and the next. Right after his line, the Build plays one 16-note pass in its A♭-major form. That's the colour it has at Gerg's call and at 2 AM, and the one the odometer takes up. It goes under Gerg's "It likes everyone…", on a rounder chip duty (50 %). Then the harmony returns to the E♭ dominant under the V.O. and into the counter.
- **Why the Build, not the Rhodes:** the Rhodes is Tasya's colour (her chord on "pen", the lobby) and the corny trio's instrument. The Build is the show's own sound and Gerg's work paying off. So the warmth lands as the click's payoff, the product answering, without importing a new colour.
- **What it isn't:** no trio, no new bed, no swing. It's one arrival of about 5 s on the same felt, pulse and chip, and nothing starts inside his line.
- **Where it lives:** it's built from beat 5.11 and his line, so it carries into the v3.3 refit.
- **Measured** (v3.2 locks, rendered): the accent's bars −19.95 LUFS (Kokoro) and −19.6 (EL), against the chat's −19.9. It's a colour change, not a level jump. On both locks: F-major OK, knee 0, written A♮ over F 0, the pass's onset within 10 ms of its mark, no unmarked cut step.

## v3.2 (superseded by v3.3, 2026-09-28): refit to the final lock, and the v3.1 audit's fixes

**The locks:** `show/reel/ep01-v32/ep01-v32-act1.json` (the default) and `show/reel/ep01-v32-el/ep01-v32-el-act1.json` (`--el`). **`render/music.wav`: 329.750 s (7,914 frames); `render/music-el.wav`: 334.958 s (8,039 frames); both exact.** The direction is unchanged: the first-round score, launch night in the show's own voice, the straight odometer, and the Sydney and Atem cues. Script draft 8.1's beats, and what the score does with them:

| Where | v3.2 | The score |
|---|---|---|
| **The act's downbeat** (5.01) | "HARD CUT on the downbeat, out of the card" | The felt's Fm9 over a low F, on the first frame. **`cues.json` marks it `designed_hit`** (t = 0.0), so the mix can exempt it from the act-head score fade (audit #13: fade it in over 30–50 ms at most). The sound pass owns the fade; this only marks the hit. |
| Launch night | The V.O.s are cut (5.02, v3-5.06b; the reflection is 2.5 s) | Parametric: the felt, the Build's passes, and (from the chat) the pulse. **The audit's 1:56.3 accent** was the felt re-striking under the cut V.O. 0.13 s after the cut into Alyi's reflection. It went with the V.O. The Build's felt double now lets go before the next pedalled chord can catch it: a caught F3 had rung on as the bass under the next chord (the EL render's F-major trace). |
| **His post over the million** (6.06, 4.6 s) | Its send pop is on F, on the wheel's last click | The band doesn't attack the pop; the SFX owns it. The drive runs on, and the violins climb F5 → A♭5 into the cut to Rima. The clunk bar's violin line now stops at the one-beat break; before, it had carried a B♮ over the million's A♭. |
| **The landlord's call** (v32-7.03, new) | "Mas." / "it's the bill. we're going to need more servers." / "I'll bring a pen." | The heat's F pedal and the glass shimmer hold under the call (the Ache's glass rings on from the tear). **On "pen", Tasya's Rhodes plays one soft chord** (G B♭ C E♭ over the F, no third), and the glass's D♭ falls to C. **The siren's whine J-cuts in just after the hang-up tick** (0.65 s before the alert); code red is otherwise unchanged. |
| The lobby | The freeze's V.O. is cut | The bass comes in on its first played pickup, so the lock → lobby stop is 0.34 s. With the shorter lock, the pickup had fallen before the lock. |
| **The key ring, weeks on** (v32-9.10k, new) | "The caper's new phrase comes in on the jangle" | Tasya's floor holds across the time cut and lets go on the ring's jangle; the swing's new phrase enters on that jangle (the walk's beat 3). |
| **Into Sydney** (audit #14; v3.1 film 5:08.6) | A −16 dB dip on the cut | The stale laptop-close silence is gone. Weeks on's last chord (Fm9: the Rhodes plus bowed vibes) rings 0.55 s past the cut, and Sydney's glass (D♭ lydian, which keeps the A♭, C and G) leads the cut (by 0.07 s on the Kokoro lock, 0.11 s on EL; at most 0.2 s, never inside "ours does that too."). **Measured (400 ms windows, score only):** −27.4, −27.7, −28.8, −25.9 dB across the cut (Kokoro), and −27.3 to −27.9 (EL). No dip. |
| **His click ships GTP-4** (11.04) | The picture clicks on 11.04's frame 108 (the pixel pass), after "Addendum." | **The Build's whole pass on the chip starts on the picture's click** (11.04 + 108 frames: 301.125 s; EL 306.583 s): launch night's click that did nothing, answered. Its first note is on the click and the rest follow the grid's 16ths, over the Addendum's turn, up to the chip's copy of Mario's tail. The click itself is the sound pass's (the stick has none), and `cues.json` lists its slot. (Fixed on the sound pass's report: the first v3.2 render put it on the bar line before "Addendum.", 3.5 s early.) |
| The pause letter | Nole's J-cut ("Great sign."), Oigneb's new line | Parametric. The THUD stops it, then no score until the THREAT (designed). |

**Real lines** now also come from the v3/v3.1/v3.2 takes files, from their source tag (`[P …]` public record, `[V …]` verbatim), because the new locks print no quotation marks. That's 22 ids (v3.1 had 19). For example, his Senate ask plays on the pedal alone.

**Measured.**
- **Kokoro v3.2:** the whole stem −20.5 LUFS-I, −3.15 dBTP.
  - launch night, the odometer and the call −20.0;
  - code red −22.0 (after the phone futz);
  - the lobby −20.0, the floor −21.7, weeks on −21.0;
  - Sydney −22.0, the Atem sting −19.2;
  - the duel −19.8, the pause −21.0;
  - THREAT −14.6 LUFS-M.
- **EL:** −20.5 overall, with the same per-cue levels to ±0.1.
- **Silence and holes:** digital silence only in the three marked stops (the lock, the pop, the THUD → the THREAT). There are no holes and no fragments.
- **QA checks:** written A♮ over F 0, F-major OK, knee 0, in every cue on both locks.
- **The cut check** (the audit's method: the render's level 0.5 s either side of every cut): every step of 12 dB or more sits on a designed stop or within 0.8 s of a cue mark.
  - 5.05's −12.7 dB is the Build's pass ending on the cut to Alyi, with the Ache's colour under her question. It's marked as designed.


## v3.1 (superseded by v3.2, 2026-09-27): refit to the v3.1 lock

**The lock:** `show/reel/ep01-v31/ep01-v31-act1.json` (the default now; the v3 lock plays with `--timeline show/reel/ep01-v3/ep01-v3-act1.json`). **`render/music.wav`: 337.458 s, 16,198,000 samples (8,099 frames), exact.** The same round-3 direction: the first-round score as the base, launch night in the show's own voice, the straight odometer. What the new lock changed, and what the score does:

| Where | v3.1 | The score |
|---|---|---|
| Launch night (5.01–5.11) | the board seed ("Did anyone tell the rest of the board?" / "It's a research preview.") in 5.07 | no new cue; kept light (the Build's passes and the felt stay clear of the lines). **The pulse and the sub now join at the chat (5.10):** for the first minute only the Build and the felt (the v3.1 music line, M §4 #2), in the show's voice (no trio) |
| The odometer | **6.04 (the post) is cut** (O1): the clunk to the million is 3.5 s | the clunk's bar, then the last second: B13sus with the spiccato, a tremolo swell, the Build climbing, **a one-beat break**, the push on the and-of-4 of the million's own grid; the million's downbeat is the ratchet's, and the pulse comes back on beat 2 |
| The bill → code red | the steam holds 1 s longer | the siren's whine J-cuts in 0.45 s after the hiss ends |
| **Sydney** (v31-10.01–10.04, new) | the lobby, after the laptop closes | **`sydney`**: uncanny and clingy, a glass-and-celesta music box (D♭ lydian, no third) whose chip echo follows a sixteenth late; the glass pad alone, turning to the Ache, under her real line; one last late echo on her reset "Hi!". −22.0 LUFS-I |
| **The Atem leak** (11.01, restored) | on the match cut into the bullpen | **`atem`**: a cool, brief sting on the cut (a low F–C on the piano with a sub, the chip's open fifth, the Ache on glass), −19.0; the duel's chip boot waits until Gerg's and Mas's lines are done |
| The duel | two phrases (11.05 and 11.06 cut) | the letter's downbeat on a bar line; trading bars through 11.04; the turn in its last two bars (the Addendum's longest tail, the chip copying it) |
| The pause letter | EMIT's page (v31-12.03) and its THUD | **the v3.1 music line:** "a chill, played straight: a cold pedal and Nole's stack, nothing walking; the THUD stops it". A low C/G♭ pedal, a slow low-piano tritone, the Launch stack in the gaps; **a dead stop on the THUD** (3 ms), then no score through the page, his desk and the reflection (designed) until the THREAT on the pen's lift |

**Real lines:** the v3.1 lock prints spoken lines without their quotation marks, so `v3lib.real_ids()` takes the record from the v3 lock and the v2 timelines, which quote them (19 ids). Sydney's "You have not been a good user…" and Tasya's "…we made them dance…" play dry.

**Measured (Kokoro v3.1):** the whole stem −20.6 LUFS-I, −3.15 dBTP. Launch night −21.4, the odometer −16.9 (featured), the heat −21.2; code red −22.0, the lobby −20.0, the floor −22.0, weeks on −21.0, Sydney −22.0, the Atem sting −19.0, the duel −19.9, the pause −21.0, THREAT −14.6 LUFS-M. Digital silence only in the four marked stops (the lock, the pop, the laptop's close into Sydney, the THUD → the THREAT); no hole below −60 dBFS outside them; no fragments. Written A♮ over F 0, F-major OK, knee 0, in every cue (the duel's low strings now carry the same ~110 Hz notch as the heat's cello).

**The EL variant:** `render/music-el.wav` from `show/reel/ep01-v31-el/ep01-v31-el-act1.json` (`--el`). The earlier v3-EL render is kept as `render/music-v3-el.wav` / `cues-v3-el.json`, superseded.


**Round 3 (2026-09-27, current).** The showrunner, on the v3 film: "i liked the initial ost that was presented ... i thought the beginning of most recent act1 was slightly corny sounding, but overall it was fine. we want to make sure we're keeping a unique sound, not toning down to overly generic". So this is the round-1 score, which the lead committed at `851243f`, with **one change: launch night's opening and the odometer**. The A♭ Rhodes, brushes and upright jazz trio is now the show's own voice: the felt, a soft chip pulse and sub, Gerg's Build in its F-minor home, and the knee's flat line and kink. The odometer's swing is now a straight driving figure. A round-2 "restrained" re-score (felt and pads everywhere) was withdrawn before delivery; its source is kept only in the session scratchpad.

| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **322.500 s, 15,480,000 samples (7,740 frames × 2000), exact.** 48 kHz / 24-bit stereo, git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **337.458 s, 16,198,000 samples (8,099 frames), exact.** |
| `cues.json`, `cues-el.json` | The cue sheets: every cue's window, what plays, its sync points, the engine's QA, the note-level checks, the loudness of every sub-section, the marked silences, holes and fragments. |
| `track.py` | The source: eight cue builders, the lay-in and the measurements. Its docstring is the spotting map. |
| `v3lib.py` | **Shared by all four of this composer's segments** (`../e01-v3-{coldopen,act2,tag}` import it): the timeline clock, gaps, thinning, render, lay-in, measurement. |
| `render/_work/`, `render/_work/el/` | The per-cue engine renders (Kokoro, EL) (underscore masters, cue sheets, MIDI, piano rolls). Git-ignored. `--assemble` needs only these. |

**The clock.** 0 is the act's first frame. Beat starts are the cumulative `reelDur` rounded to 24 fps frames exactly as `studio/src/reel/schema.ts` `timeEpisode` does (head 0, JS rounding); a line's first sound is its beat's start + `t` (negative for a J-cut), a sound is start + `at`. **Every sync point is read from the timeline**: beats, lines, word timings, sounds and the gaps between lines. There are no hard-coded seconds, so the same score re-renders to any variant of the lock with one command.

**Levels.** Each cue is the OST engine's underscore master (normalised per cue, −3 dBTP ceiling, the 2.5 kHz dialogue pocket), laid dry of dialogue. The mixer ducks it under speech.

## What plays (the cue sheet)

Kokoro-lock seconds. The EL lock's times are in `cues-el.json`.

| s | Cue | Mood · palette | What plays, the hits, the thinning |
|---|---|---|---|
| 0 → 108.3 | `a_launch` | **Warm and curious, in the show's voice.** P01 colours in the F-minor modal home (round 3) | The felt on each chord, two bars a chord (Fm9, D♭maj9♯11, B♭m9, E♭13sus4), with **a soft straight pulse on the root** (the chip's triangle: the rack LEDs' eighths) and a sub on each change. **Gerg's Build** (the bible's F-minor cell) on the chip, in straight-16th compile passes that `place_passes()` puts in the gaps and under Gerg's own lines, never inside a V.O., one of Mas's lines, or on the heels of any line. The felt carries every V.O. (the pulse rests). The Ache's colour (C, D♭, G over F) shades "And what if it wakes up?". E♭13sus hangs from "Your button." through **the click** (5.08); after it, **the knee's flat line** on the chip (F F F F, register and duty varied, the bible's rule): nothing happens yet. **Felt alone for Alyi and Mas** (5.09), with the Door's head in the gaps (A♭ D♭ \| C G, ending on the ♯4). The same bed for the chatbot. No Rhodes, no brushes, no upright. |
| 108.3 → 128.1 | `a_launch` | **Exciting, driven.** P11 energy, **straight** (round 3: no swing) | A driving figure on the cut frames. The triangle pulse runs in eighths (sixteenths from the clunk) with a sub on the ones; the Build is the chip lead; **the knee's kink** (G A♭ C, left hanging) plays as the odometer grows (6.01): the curve lifts. Then a felt ostinato, spiccato sixteenths from the clunk, the violins in octaves and brass accents, over the sample's mediant descent (A♭ → E → C → A♭, the landlord's cycle run backwards). **The CLUNK** (6.02) drops it a major third, with timpani and a sub. One brass hit on the post, then thin (6.04). **The push into the MILLION** on the and-of-4 with the Build's "shipped" tag, so the odometer's ratchet owns the downbeat (6.06). **One hit on the cut to Rima** (6.08). The grid is anchored on the clunk. |
| 128.1 → 149.6 | `a_launch` | **The heat.** The Ache over F | A held A♭maj9 under "Low-key." / "Very low. Basement.", then **the turn** (6.09): cello A♭→F, violin E♭→D♭, C and G held, glass on G + D♭ (the Ache), under the tile and the palette steps F, A♭, C. The F/C pedal only under the bill ("it's the bill." / "mostly the bill."). It lets go on the tear (7.02). |
| 148.5 → 184.9 | `code_red` | **Comic panic.** C minor, straight, **on his phone's small speaker** (`era.futz('phone')`) | The siren's whine J-cuts in under the last puff of steam. Straight pizzicato 16ths (varied pitches), pizz bass, timpani; **the siren as a joke**: when the tower rises (8.02) the orchestra wails its swoop (bowed strings and horns bending up a tritone and back). Serene Radnus gets a far-off two-tone on the flute in half notes. The crypt: a staccato tuba + bassoon ascent. Xylophone runs only in the gaps; everything else thins under every line. **The phone's lock (8.06) kills it dead**, 3 ms: a diegetic stop. |
| 185.3 → 206.5 | `lobby` | **Caper, charming.** P06 THE JOB (MM-05 family) in **F dorian**, swung. Not LEVERAGE | The bass walks in under the revolving door. The head on vibes + straight mute (bars 2–3). **The check jams on the swung and-of-4**: a push (bari F + trombone C + the head's C5). Tasya's Rhodes on the beats. In the freeze (9.04), the band keeps moving (Mas does) but thins, and the felt carries "eleven keys. he's here for the twelfth.". Under the partnership talk: bass, brushes, her Rhodes, one-beat vibes fills in the gaps. The head's tag as the check slides under the door, a last C7♯9 push, and **the band stops dead on the collar's pop** (a downbeat, 3 ms). |
| 206.5 → 214.6 | — | designed stop | The lobby's room only, under "That collar suits you." / "it does." / "and the rent?". |
| 214.6 → 236.7 | `floor` | **The landlord's colour** (OST-BIBLE §2.16) | **Tasya's floor**, the strings re-bowed with silent attacks: A♭maj9 → Cmaj9 → Emaj9 → A♭maj9, each move on one of her sentence breaks (read from the take's word timings), with one soft Rhodes chord per move. It holds under "that's a lot of servers." and "Everyone is welcome. Rent is due on the first.", then gives way under the key ring's jangles. |
| 236.4 → 260.5 | `lobby2` | **Weeks on.** THE JOB, light | The swing comes back on a new phrase from the jangle; the grid is placed so the two jangles land on the swung ands (the key ring owns the offbeats, the Rhodes the beats). Dry under her quote ("…we made them dance…"). One held chord while the TV plays Radnus's tap-dance. The last chord (Fm9) is held under "ours does that too." and is **out before Gerg closes his laptop**: his button is in the room. |
| 260.4 → 262.5 | — | designed rest | The laptop closes; the room; then the match cut. |
| 262.5 → 301.7 | `duel` | **Rivalry.** MM-04 Lighthouse, **B♭ minor**, straight | The laptop opens on the match cut and the chip boots (4 notes); a pizz pulse is the pre-beat. From the split, **Gerg's Build** (chip + woodclick, left pane) and **Mario's Addendum** (solo violin + quartet, right pane) trade bars over the Lighthouse's marimba and harp, one tempo; the Addendum gains a tail every time. The felt carries the V.O. ("mario used to sit where gerg sits."). **The quartet's held chord under Mas's post** (a real post: no motion). **The turn:** the Addendum's longest tail crosses the split, and on Gerg's photograph the chip plays Mario's tail (Gerg ships it). A held B♭m(add9) rings into the letter. |
| 301.2 → 316.5 | `pause` | **A chill.** MM-17 low: Nole's Launch, THE JOB colour | A low, swung F-minor-blues walk on C7alt that never resolves to F, brushes, a Rhodes comp; Nole's Launch stack (C F B♭ E♭) on muted horns in the gaps, **falling one note short** of its A♭. Nobody pauses, and neither does it. On the hard cut to his desk it thins to a low C + G♭ pedal and rings out before the reflection. |
| 316.5 → 320.5 | — | designed rest | **No score on the reflection** (Alyi in the glass; the pen's scratch only). |
| 320.5 → 322.5 | `threat` | **THREAT, once** (MM-14, P08) | On the pen's lift: tuba F1, trombones F2 + C3, horns C3 + G♭3, timpani F2, sub F1 (F–C–G♭, no third). Its tail rings into the black. |

**Variety across the act:** warm and curious (felt, chip) → a straight drive → the first dark bar → comic panic through a phone → a charming caper swing → the landlord's warm mediants → a lighter swing → rivalry → a cool, low chill → one THREAT. Suspense is only the heat and the out.

**Stops:** the phone's lock, the collar's pop, the reflection's rest. Each has room tone under it (the sound stem's) and a clear re-entry. **Pre-laps and handoffs:** the whine under the last puff; the lobby's bass under the revolving door; the floor under the jangles into the swing; the duel ringing into MM-17's push; the tear's Ache crossing the siren.

## Measured

| Cue | LUFS-I | ST p95 | True peak | Engine QA |
|---|---|---|---|---|
| `a_launch` | −20.0 (launch night −20.8, the click −24.6, the two-hander −23.1, the chatbot −21.1, **the odometer −16.6** with p95 −15.3: featured, the heat −22.1) | −16.1 | −3.15 | F-major OK, written third 0, knee whole 0, knee completion 0 (the flat line and the kink stay fragments) |
| `code_red` (after the phone) | −22.0 | −20.6 | −12.5 | OK |
| `lobby` | −20.0 | −18.6 | −6.4 | OK |
| `floor` | −22.0 | −21.2 | −10.5 | OK |
| `lobby2` | −21.0 | −19.2 | −9.3 | OK |
| `duel` | −20.0 | −18.0 | −5.3 | OK |
| `pause` | −21.0 | −19.4 | −7.0 | OK |
| `threat` | −18.3 (2 s) · **−14.6 LUFS-M** (the out's target −14 ±1) | — | −3.15 | OK |
| **The whole stem** | **−20.5** | −17.7 | −3.15 | |

The EL stem measures the same within 0.3 LU per cue (whole −20.45 LUFS-I; the odometer −16.6). The loudness of every sub-section is in `cues.json` → `measured.rows`.

- **Length:** exact to the sample on both locks.
- **Digital silence:** only the four marked stops (the lock → the pickup 0.30 s; the pop → the floor 8.06 s; the laptop → the match cut 2.11 s; the reflection 4.01 s). **No unmarked digital silence. No hole below −60 dBFS for 0.3 s or more outside them.**
- **Fragments:** none under 2 s except the THREAT, which is the designed out.
- **OST checks (every cue, both locks):** written A♮ over an F bass: 0; the engine's sieved F-major check: OK; the knee whole: 0; knee completion by pitch class: 0. (Render 1 of `a_launch` flagged one resonance, not a written note, at the turn: the cello's ~111 Hz body resonance under the F pedal. Both cellos now carry the same notch the pizz layers use, and the check passes.)
- **Onsets:** most marked hits are within ±10 ms; the misses (20–60 ms) are soft entries (bowed strings, the felt's rolled chords, the muted brass), as in the sample.
- **Engine warnings left:** `a_launch`'s short-term p95 (−16.1) is over the −17 underscore guide because of the odometer's drive, a featured set-piece (P11, up to −16).

## The ElevenLabs variant

`render/music-el.wav` is rendered from `show/reel/ep01-v3-el/ep01-v3-el-act1.json` with the same code. That lock is 14.96 s longer (launch night +12.5 s, the terms +3.5 s), and its 6.01 is 4.875 s, not 5.0. So **the odometer's grid is anchored on the clunk**: the clunk, the post and the million stay on their bars, and phrase 1's downbeat leads 6.01's cut by 0.125 s (the only clock note, in `cues-el.json`). Launch night's bar count follows the lock, and every pass, fill, felt chord and stop follows the new line timings. It measures clean on every check above.

## Planned for v3.1: Sydney and the Atem leak

The v3.1 script brings back Sydney (sc 10) and the Atem weights leak (sc 11's crate). `track.py` already has both cues. It builds them only when the lock contains their beats (any beat id `10.*`; the `11.*` beat whose on-screen text names ATEM), so the v3.1 lock refits with no edits. Both are tested against the v2 timeline, which has those beats: written third 0, knee 0.
- **`sydney`: uncanny and clingy.** A sweet glass-and-celesta music box in D♭ lydian (no third), whose chip echo follows it a sixteenth late, a pixel too close (THE COPY's device lent to another machine). Under her real line ("You have not been a good user…") only the glass pad plays, turning to the Ache over F. One last late echo plays as she leaves. Target −22 LUFS-I.
- **`atem`: a cool, brief sting** (P08 DREAD, under 2 s) on the crate's tip: a low F–C on the piano with a sub, the chip's open fifth F5 + C6 (no third), and the Ache on glass for a moment. Target −19.
- **When the v3.1 lock lands, check** that the designed silences around them still read as designed (they're laid in their beats' windows with 0.4–0.5 s fades), and re-spot the lobby's reprise if Sydney now follows it.

## Re-run

From the repo root. Rendering is a heavy job (OST engine), so it goes through `ops/heavy.sh` with two workers. All eight cues take about 1.5 min.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render            # all cues, then lays them in
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render --el       # the ElevenLabs lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render lobby duel # only some
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --assemble [--el]    # light: re-lay _work, measure, rewrite cues.json
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --dry [--el]         # light: build the scores, note-level QA
```

The cue names are `a code_red lobby floor lobby2 duel pause threat`. `--timeline PATH` (or `V3_TIMELINE=`) takes any other variant of the lock.

## Where this departs from the calls, and why

1. **Alyi's two-hander is felt alone, with his Door in the gaps**, where the script says "Rhodes alone under Alyi's two lines". This is the v3 sample's choice, kept because the brief says to reuse the sample's cues: it's Mas's instrument in his one exchange with Alyi.
2. **The terms get Tasya's floor, not silence.** The script allows "a low pad if the ear wants one". The floor is the bible's colour for her (§2.16 lists sc 9) and it plants Act Four's. The pop's stop is still a real 8 s rest before it.
3. **The duel is straight, with no kit**, so the chip's 16ths, the pizz 8ths and the marimba's quarters carry the rivalry. The Addendum is on the solo violin rather than the whole quartet leading.
4. **MM-17 in Ep1 has no fanfare** (OST-BIBLE §2.7: "No fanfare yet"). The Launch stack is stated low and muted, and it falls short.

## For an ear, in order

1. 0–68 s (round 3): the felt, the soft chip pulse and the Build under the talk: warm and curious in the show's voice, never lounge and never busy. The knee's flat line after the click: nothing happens. Any Nintendo feel is a fail.
2. 108–128 s (round 3): the straight drive: exciting, not cartoonish; the kink as the curve lifts; the E and C drops read as falling through the building.
3. 131.8 s: the turn into the Ache: does it land *because* everything before it was warm?
4. 148.5–184.9 s: code red through the phone: comic, the siren a joke (never a slide whistle), thin enough under the founders; the lock's dead stop reads as the phone, not a glitch.
5. 185–206.5 s: the lobby: charming, not LEVERAGE; Tasya's Rhodes reads as hers; the pop lands in silence.
6. 214.6–236.7 s: the floor under her terms: warm, faintly ironic.
7. 262.5–301.7 s: the duel: rivalry by structure; the chip copying Mario's tail on the photograph.
8. 301–322.5 s: the chill, the rest on the reflection, the THREAT: one chill, not "dun-dun-dunnn".

## Notes for the mix

- **Launch night will mostly play under the mixer's duck** (talk is nearly continuous from 10.5 to 107 s). If the warmth doesn't read, try −6 dB of duck for this stretch rather than −10 (the sample's note). The pulse already rests under every V.O.
- `code_red` is already on the phone's small-speaker chain (band-limited, mono); don't futz it again.
- The Freeze hits, the clunk, the ratchet, the pop, the jangles and the lock click are timeline sounds; the score leaves them their beats.
