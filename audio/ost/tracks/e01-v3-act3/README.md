# E01 v3 · Act Three · the dark room (score)

**What this is (pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md); v3.2 refit 2026-09-28).** One cue, `e01-v3-act3`, rendered by the OST engine and laid on Act Three's own clock (0 = the segment's first frame). It's laid on the **final v3.2 lock** (`show/reel/ep01-v32/`, script draft 8.1; record in `lock-v32.md`). The output is `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**The mood (v3-plan §6):** intimate, quiet, a little lonely, but warm, not dread. The Water Line (MM-01) plays warm, in D-flat lydian and A-flat major; the Orb's verdict is the open fifth; THE CLOCK comes in only at the act-out. Warm colours away from F are authorised for Ep1 v3. Nothing sits below C3 anywhere, because of the dark room's drone (F1 + C2).

**The score's history:**
- It's the first-round score (commit 7d7a99f; the showrunner liked it).
- v3.1 added the thirteenth key (Tasya's Rhodes on the cut), the hands runner with **THE COPY**, and Neleh's paper with **Neleh's question** (C6 → D♭6).

**v3.2 (script draft 8.1, notes §3.3, §5).**
- **The V.O. is down to two lines here:** "i made it for everyone else." and "thrilled is too much…". Its felt windows went with the others:
  - the label now reads in a held D♭maj9;
  - after the runner, he lowers his hand himself, answered by one felt chord;
  - the paper's quote holds E♭ minor with no V.O.;
  - Gerg's keys run on after "When it compiles.".
- **The LEDs no longer stop at the post** (20.02 is cut). The record's pedal now carries the phone's ring into Gerg's call.
- **He switches the monitor off (v32-21.06): the turn.**
  - His felt takes the F from NEDIB's pen (the pen's third note) and holds it.
  - On the click, the monitor's quartet goes with the glass. The held F turns from B-flat major into his own D-flat major: the same note, his room.
  - The hall's applause takes the cut.
- **DevDay is live on stage (22.01): no score.** The hall's applause, the stage's own sound and his line play it dry (notes §5). It's a marked silence, digital zero. The felt comes back at home, on the phone.
- **The surge (v32-22.04).** After "super." the flat line F F F and the nudge G4 never settle. Then the Water Line thins to its pedal, a sul-tasto F3/C4, under the counter's chip notes: the LEDs step to red and his post pauses the sign-ups. THE CLOCK's first step is the next bar, on the same pedal.
- **The v3.1 audit's accent at film 11:48.1 is designed: the D♭maj9 for "which one's real?".** It was struck 0.05 s after the cut, unmarked, and read +15 dB. It's now marked, softer (velocity 0.13 → 0.10, a slower roll) and pre-lapped 0.25 s, so the step no longer sits on the cut.

**v3.3 polish (PLAN §6 X5, audit-v32 §5).** The +12 dB score step into 19.01 (the iris flick, film 10:11.88) is designed. It's A♭maj9 and the solo violin's E♭4 on the cut, out of the settle's decay: the turn from his room to the screen. It's now a cue mark, and `cues.json` lists it under `designed_hit`. The audio is unchanged: +12.8 dB over 400 ms on the Kokoro stem (−30.4 → −17.7 LUFS), +1.8 dB on the ElevenLabs one.
- Every marked silence and designed rest now enters digital zero through a 5 ms fade in the lay (`v3lay.py`, shared with Act Four). No stop is a one-sample drop.

## Files

| File | What |
|---|---|
| `track.py` | The score and the CLI. Its docstring is the second-by-second spotting map. |
| `render/music.wav` | The Kokoro-lock stem (git-ignored). |
| `render/music-el.wav` | The same score on the ElevenLabs-timed lock (git-ignored). |
| `cues.json`, `cues-el.json` | The cue sheet: every sync point, the sections with their measured levels, the marked silences, and the full measurement (loudness per section, digital-silence runs, holes, fragments, the engine's QA). |
| `render/_work/<variant>/` | The engine's own outputs: the underscore master, `.cue.json` (its QA), `.mid`, `-pianoroll.png`, `.lay.json`. Git-ignored. |
| `v3clock.py`, `v3lay.py`, `v3music.py` | The clock, the lay-and-measure code and the small composing helpers. They're identical copies of the ones in `../e01-v3-act4/`. |

## Re-run

From the repo root. The render is a heavy job, so it goes through `ops/heavy.sh`: two workers, in its own 8 GB scope, one heavy job at a time. It takes about 40 s per variant once it has a slot.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --render                # Kokoro lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --render --variant el   # ElevenLabs lock
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --dry [--variant el]       # light: build + note QA
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --assemble [--variant el]  # light: re-lay + measure
```

**Timing is parametric.** Every position is read from the timeline: the beat starts (cumulative `reelDur`, frame-rounded as `timeEpisode` does with head 0), the line spans and word times, the sounds and the on-screen texts. The grid is anchored so that THE CLOCK's bar 1 is beat 23.01's first frame.
- The default reads `show/reel/ep01-v32/ep01-v32-act3.json`.
- `--variant el` reads `show/reel/ep01-v32-el/ep01-v32-el-act3.json`.
- `--timeline PATH` reads any timeline with the same ids.
- `MRMAS_V3_LOCK=v31` (or `v3`) points the clock at an earlier lock. This score reads v3.2's beats (the switch, the surge), so it builds on v3.2 only. The v3.1 score is at commit 14c7ec1, the first round at 7d7a99f.

## The cue sheet

The times are the Kokoro lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–8.2 | **The home room; the thirteenth key on the monitor** (v31-18.00, v31-18.00b) | P01, warm: D♭ lydian · **the Water Line** · **Tasya's Rhodes** | the D♭ lydian bloom on the first frame (0.03); the Water Line from bar 1 (2.42), the chip square on its nudge only; **Tasya's Rhodes** (C E♭ G B♭) on the cut to the monitor (3.21), as he hangs the Atem-blue key | "Everyone is welcome." (the monitor): nothing starts inside it | the felt carries into the room |
| 8.2–30.4 | **The tray, the label, the Orb** (sc 18: the scan, `verified: human`, "you can stay.") | P01 · the Water Line; GLYPH grains; **the verdict** | A♭maj9, E♭13sus and a viola A♭ pad under the tray; **D♭maj9 held for the label** (12.42), the felt alone; G♭maj9(♯11) + bowed vibes as the lens finds him (14.92); grains F5 C6 D♭6 on the scan (19.71, one bar); **the verdict F5 → C6 on the toast** (21.24 / 21.86) over the felt's open fifth; the settle C4 → F4 after the chime (28.67 / 29.29): it fits | "i made it for everyone else." (one felt dyad, an inner move in a word gap); "thanks." and "you can stay." (nothing starts) | the chime (SFX, F) gets a beat to itself |
| 30.4–46.2 | **The iris, Sirrah, the hands runner** (19.01, v31-19.02, v31-19.03) | P01 · a solo violin line · **THE COPY** (chip) | **A♭maj9 and a solo violin E♭4 on the iris flick** (30.50, a designed hit), then D♭4 over Sirrah's letters; D♭maj9 under the runner; **his three gestures** on the felt (F F · F G · C F: 35.68 · 36.78 · 37.88), **THE COPY** a beat late on the chip, cut off on each whirr; **he lowers his hand himself**: one felt chord, E♭ A♭ D♭ (45.20) | "Every single person raised their hand." / "It's important for us to have a referee." (the record: a held B♭m9, nothing moves) | carries into the post |
| 46.2–49.6 | **The post** (20.01: the record typed) | P01, the record: dry | one held F4 over D♭maj7 and a sul-tasto D♭3/A♭3 pedal (46.51); nothing moves | the typed post (the record) | the pedal carries the ring into the call |
| 49.6–78.0 | **Gerg's call** (20.03–20.06; the edit) | P01, A♭ major · **Gerg's Build** (the v3 sample's A♭ colour, chip + felt) | A♭maj9 over the record's pedal (52.42), then one felt chord a bar (moved off Mas's lines); compile passes in the gaps and under Gerg's own lines (53.67 · 57.42 · 59.92 · 66.17 · 69.92 · 72.42); a last pass after "When it compiles." (76.79), his keys running on | Mas's lines (nothing starts); the edit (the record: a sul-tasto pedal, no chord, no Build) | the last pass stops on the paper's cut |
| 78.0–84.3 | **Neleh's paper** (v31-20.07–20.08) | P01 · **Neleh's question** | E♭m9 on the felt and a viola B♭3 pad under the quote (78.14); **C6 → D♭6**, one high harmonic, as he reads on and the Orb reads him (83.04) | — (no lines) | the D♭6 rings into the order |
| 84.3–105.9 | **The order** on the monitor (sc 21: NEDIB, the copies, "When the hell did I say that?", "which one's real?") | P01 held chords · **the verdict** again · **NEDIB's Fountain Pen** (bar 2) | G♭maj9(♯11) under the monitor, E♭m9 (92.06) and A♭13sus (94.65) in the line gaps; **D♭maj9 for "which one's real?"**, soft, pre-lapped 0.25 s (98.96); **the verdict** as the Orb's iris settles on the one with the pen (102.35); the Fountain Pen's C D F B♭ on the quartet, pp, as the real one signs (103.81) | every line (the real one dry: the pedal only) | the pen rings into the room |
| 105.9–107.9 | **He switches the monitor off** (v32-21.06) | the Water Line's held F · **the turn** | the felt takes the pen's F (F4, 105.06) and holds it; **on the click** (106.84) the quartet stops with the glass and the felt's D♭3 A♭3 come in under the same F: B♭ major → D♭ major | the clapping (SFX), growing into a hall | the hall's applause takes the cut; the felt lifts its pedal |
| 107.9–119.2 | **DevDay, live** (22.01: the stage, full frame) | — | — | "and today, you can build your own chatgtp.", "so, how's the partnership going?", "We love you guys." | **no score** (marked, digital zero from 108.82): the hall plays it dry |
| 119.2–127.4 | **Home: the phone; "super."** (22.02–22.03) | P01 · the Water Line | D♭maj9(♯11) on the felt (119.19); after "super.": the Water Line's flat line F F F and the nudge G4 (125.54) … **and the settle never comes** | "thrilled is too much…" (the felt alone); "super." (nothing) | the G4 decays into the surge |
| 127.4–132.4 | **The surge** (v32-22.04: the counter blurs, the LEDs step to red, he pauses the sign-ups) | the Water Line **thinned to its pedal** | an F3/C4 sul-tasto pedal bows in on the surge's downbeat (127.42) under the counter's chip notes (SFX, on F); nothing on the post or the grey-out | — (no lines) | THE CLOCK's first step is the next bar, on the same pedal |
| 132.4–139.9 | **The act-out** (sc 23: the reminder, the iris steps, NOV 16 → NOV 17) | **P04 THE CLOCK** (MM-14's step figure) | the F3/C4 pedal, one pizz step a beat on varied pitches + woodclick + an irregular chip tick; upper dyads F, G, A♭ one a bar (**the knee's rising step, the C never comes**); + low spiccato eighths (bar 2), + tremolo and the Ache G4/D♭5 at the peak (bar 3) | — | **DEAD STOP on bar 4's downbeat (139.92)**, tails cut |
| 139.9–142.4 | black (the crane and the tings pre-lap: SFX) | — | — | — | digital zero to the act's last frame (marked) |

**Nothing below C3** anywhere (the dark room's drone): asserted in the build.

## Measured

Measured on `render/music.wav` (the Kokoro v3.2 lock) and on the engine's own cue sheet. **Nothing was heard.**

- **Length:** 6,836,000 samples, 142.4167 s: the segment's 3,418 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness:** **−20.03 LUFS-I**, −3.15 dBTP; short-term p95 −17.67 (the underscore guide is −17), median −21.26, max −16.18.

  | Section | s | LUFS-I | ST p95 |
  |---|---|---|---|
  | A the home room: the Water Line warm, the Orb, the verdict, the settle | 0.0–30.4 | −19.1 | −17.1 |
  | B the monitor: the iris, Sirrah, the hands runner (THE COPY), his hand | 30.4–46.2 | −19.2 | −16.7 |
  | C the post (the record) | 46.2–49.6 | −20.0 | — |
  | C Gerg's call: A-flat, the Build in passes; the edit (pedal); his keys run on | 49.6–78.0 | −20.0 | −19.1 |
  | C' Neleh's paper: the quote, her question | 78.0–84.2 | −22.5 | −21.6 |
  | D the order on the monitor; the Orb picks; the pen | 84.2–105.9 | −21.6 | −20.2 |
  | the switch: the held F, the turn | 105.9–107.9 | −20.5 | — |
  | DevDay, live: no score (the hall's applause, the stage, his line) | 107.9–118.8 | −38.9 | −42.7 |
  | E home: the phone; "super." | 118.8–127.4 | −18.1 | −18.8 |
  | E' the surge: the pedal (the counter, the LEDs, the pause) | 127.4–132.4 | −25.5 | −24.7 |
  | F THE CLOCK (3 bars, a layer a bar) | 132.4–139.9 | −19.2 | −17.5 |

- **The two V.O. windows** (the felt alone; the bible's −24 ±2): −25.6 ("i made it for everyone else.") and −23.5 ("thrilled is too much…") LUFS.
- **Silence:** the only digital silences are the two marked ones, both digital zero:
  - DevDay, live (108.82 → 119.19): no score under the stage;
  - THE CLOCK's stop to the act's last frame (139.92 → 142.42).
  - No other hole of 0.3 s or more under −60 dBFS, no unmarked digital silence, and **no music run shorter than 2 s**.
- **Rule 12:** 0 written A-naturals over an F bass (every note boundary). **Spectral F-major check: OK** (2 F-bass windows over the limit, each explained by a partial of a written non-A note).
- **The knee:** 0 completions by pitch class; 0 whole.
- **No-third windows** (the two verdicts, the settle): A 0.005–0.006, A♭ 0.001–0.005 of F (limit 0.06).
- **Sub under the room drone:** −34.6 dB (limit −18); no notes below C3.
- **2–6 kHz band:** −20.1 dB (limit −15). **Balance** (piano · orch · big band · chip): 66 · 32 · 0 · 3.
- **Cut steps** (the v3.1 audit's method, the stem's level 0.5 s either side of every cut): all five steps of 12 dB or more sit on a cue mark or a marked silence (18.03 the Orb rises, 18.05 the verdict, 18.06 the felt note, 22.02 the re-entry after DevDay, 23.04 the dead stop). **The audit's 11:48.1 step** (the 21.04 cut) reads −1.1 dB, against +15 dB in the v3.1 film. The call's cut (20.04) reads +5.8 dB; before the pedal was carried into the call it read +31. The iris flick (19.01) is a designed hit (`designed_hit`).
- **Onsets:** every written sync point is on its frame. The soft entries that read outside ±10 ms are rolled felt chords, bowed or sustained entries and the Rhodes.

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v32-el/ep01-v32-el-act3.json` as it stood at 03:45 on 2026-09-28; re-run the one command if that lock changes):
- **Length:** 6,660,000 samples, 138.7500 s: its 3,330 frames exactly.
- **Loudness:** −20.02 LUFS-I, −3.15 dBTP; ST p95 −17.63.
- **The V.O. windows:** −24.5 and −23.4 LUFS.
- **Silence:** the two marked silences (DevDay 104.40 → 115.19; the stop 136.25 → 138.75) are digital zero. There are no other holes and no fragments.
- **Rule 12, the spectral F-major check, the knee and the no-third windows:** all OK.

## What a human must hear

1. **0–30 s.** Is the felt warm and close from the first frame? Does Tasya's Rhodes on the thirteenth key read as his colour, not a sting? Does the label read in the held chord? Do the grains under the scan read as the machine for one bar? Is the verdict a verdict?
2. **The hands runner (35–46 s).** THE COPY should be the machine copying him, a beat late and breaking off: a joke about the machine, never a cute sound effect. Does the chord as he lowers his hand land as his, with no V.O.?
3. **Neleh's question (83 s).** One harmonic, C6 → D♭6. A question, not a sting?
4. **Gerg's call.** Is the Build his keyboard in the next room, never a melody on his lines? Does the call's first chord come in over the pedal without an edit bump?
5. **"which one's real?" (99 s).** The softened D♭maj9 before the cut: a step you don't notice?
6. **The switch (105–108 s).** Does the held F turning from B-flat to D-flat read as him stopping watching? Does the hall's applause take the cut cleanly with no score under DevDay?
7. **The surge and THE CLOCK.** Does the pedal under the counter hold tension without a riser? Does THE CLOCK build by addition, and does the dead stop on the black land as an out?

## Where this departs from the brief or the script, and why

1. **The Water Line plays in full once, in the home room.** After that it plays only as held notes, the runner's fragments and the switch's held F. Its last flat line never settles: the surge thins it, and THE CLOCK takes the next bar. The script asks for one continuous performance edited on phrase boundaries; this is one continuous cue whose phrases sit where the picture has room for them.
2. **The verdict plays twice:** on `verified: human`, and when the Orb's iris picks the one with the pen. The bible gives Ep1 only the first. The second is the Orb acting again, and the script says the Orb picks the real one before Mas does. Drop it (two lines in `track.py`, section D) if once reads better.
3. **Colours the script doesn't name:**
   - NEDIB's Fountain Pen under the real signing (bible §2.11: his props get it, and the order is one of them).
   - Tasya's Rhodes chord on the thirteenth key (his first appearance). v3.2's DevDay has no score, so this is now his only chord in the act.
   - Gerg's Build under his call, in the v3 sample's A-flat (the bible's Build is his, and 2 AM pays it).
4. **The switch's turn is re-harmonisation, not a new motif.** The lock asks that "the Water Line holds its note under the switch". The held F is the pen's F, taken by his felt. On the click it stops being B-flat major's fifth and becomes D-flat major's third: the room, not the screen.
5. **THE CLOCK is quarters with a layer added each bar**, not the tone guide's subdivision per act-out. The script asks for "one step a beat", and the iris steps one circle a beat. v3.2's surge gives it its pedal a bar early.
6. **The stop is ON bar 4's downbeat,** the cut to black. The knee's rising step (F, G, A-flat) never gets its C. The black's 2.5 s is digital zero in the music stem; the SFX pre-lap of the crane and the tings carries it.
7. **THE COPY is the chip's own copy of his felt gesture, one per gesture, a beat late.** The runner is a held frame with three whirrs. The bible's COPY is a motif, so it's his line, copied and broken off, not a new tune.
