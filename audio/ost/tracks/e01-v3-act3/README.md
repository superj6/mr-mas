# E01 v3 · Act Three · the dark room (score)

**What this is (pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md); v3.3 refit 2026-09-28).** One cue, `e01-v3-act3`, rendered by the OST engine and laid on Act Three's own clock (0 = the segment's first frame). It's laid on the **final v3.3 lock** (`show/reel/ep01-v33/` a756708, EL `ep01-v33-el/` a170aaa; record in `lock-v33.md`, notes `script-v33-notes.md`). The output is `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

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

**v3.3 (the refit; lock-v33.md, script-v33-notes.md).** The act is about 9 s shorter. Here's what changed in the score:
- **The Atem POV folds into the home room** (P5): the monitor plays in the background from the first frame. Tasya's Rhodes answers "Everyone is welcome." on the Water Line's next quarter, instead of landing on a cut.
- **The runner is the forum only** (S1 / P9). Sirrah's clip and the pinky promise are cut, and so are his gestures. What's left is his own hand going up before anyone's (the pixel pass: the second whirr − 8 f): F → G on the felt, with **THE COPY** a beat late on the chip, broken off before Remuhcs asks the room. The solo violin's E♭4 now resolves to D♭4 on the runner's cut.
- **The Tidder thread's title reads first** (20.01). The record's held F4 is struck on the typing as before.
- **His held face on page 30** (20.08, 2.4 s, no voice) gets Neleh's question alone: the D♭6 harmonic over the felt's decay. The viola pad leaves just after the harmonic lands. Thin, as asked.
- **The flat line after "super."** is the next three quarters, across the bar line. The nudge falls on the third's swung "and", just before the surge (22.04, now 4.5 s): F F F G, and the G hangs into the pedal.
- The reminder over NOTIFY ME (23.02) and THE CLOCK are unchanged.
- **Kept:** X5's designed hit, the 5 ms rest fades, the audit's 11:48.1 fix and DevDay's no-score silence.

**v3.3 polish (PLAN §6 X5, audit-v32 §5).** The +12 dB score step into 19.01 (the iris flick, film 10:11.88) is designed. It's A♭maj9 and the solo violin's E♭4 on the cut, out of the settle's decay: the turn from his room to the screen. It's now a cue mark, and `cues.json` lists it under `designed_hit`. The audio is unchanged. On v3.2 the step read +12.8 dB over 400 ms on the Kokoro stem (−30.4 → −17.7 LUFS); on the v3.3 stems it reads +4.8 dB (Kokoro) and +7.6 dB (ElevenLabs).
- **The order's G♭maj9 on the 21.02 cut** (v3.3) is marked and listed as a designed hit too. It comes out of his held face on page 30, which now has Neleh's harmonic alone, and reads +12.1 dB on the ElevenLabs cut.
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
- The default reads `show/reel/ep01-v33/ep01-v33-act3.json`.
- `--variant el` reads `show/reel/ep01-v33-el/ep01-v33-el-act3.json`.
- `--timeline PATH` reads any timeline with the same ids.
- `MRMAS_V3_LOCK=v32` points the clock at the v3.2 lock. The cues check for v3.3's merged and cut beats, so v3.2 still builds (dry-built for the cue-sheet mapping). `v31` and `v3` don't: the switch and the surge are v3.2 beats. The v3.1 score is at commit 14c7ec1, the first round at 7d7a99f.

## The cue sheet

The times are the Kokoro v3.3 lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–3.8 | **The home room, the monitor lit: the thirteenth key** (v31-18.00; v3.3 folds the Atem POV into it) | P01, warm: D♭ lydian · **the Water Line** · **Tasya's Rhodes** | the D♭ lydian bloom on the first frame (0.03); the Water Line from bar 1 (0.92), the chip square on its nudge only; **Tasya's Rhodes** (C E♭ G B♭) after "Everyone is welcome." (3.42), as he hangs the Atem-blue key on the monitor | "Everyone is welcome." (the monitor): nothing starts inside it | the felt carries into the slot |
| 3.8–26.0 | **The tray, the label, the Orb** (sc 18: the scan, `verified: human`, "you can stay.") | P01 · the Water Line; GLYPH grains; **the verdict** | A♭maj9, E♭13sus and a viola A♭ pad under the tray; **D♭maj9 held for the label** (8.42), the felt alone; G♭maj9(♯11) + bowed vibes as the lens finds him (10.92); grains F5 C6 D♭6 on the scan (15.33, one bar); **the verdict F5 → C6 on the toast** (16.86 / 17.49) over the felt's open fifth; the settle C4 → F4 after the chime (24.67 / 25.29): it fits | "i made it for everyone else." (one felt dyad, an inner move in a word gap); "thanks." and "you can stay." (nothing starts) | the chime (SFX, F) gets a beat to itself |
| 26.0–35.5 | **The iris, the hands runner** (19.01, v31-19.03; v3.3 cuts Sirrah's clip and the pinky promise) | P01 · a solo violin line · **THE COPY** (chip) | **A♭maj9 and a solo violin E♭4 on the iris flick** (26.08, a designed hit), resolving to D♭4 on the runner's cut; D♭maj9 under the runner; **his own hand goes up, before anyone's**: F → G on the felt (28.30), **THE COPY** a beat late on the chip, breaking off before Remuhcs asks the room; **he lowers his hand himself**: one felt chord, E♭ A♭ D♭ (34.50) | "Every single person raised their hand." / "It's important for us to have a referee." (the record: a held B♭m9, nothing moves) | carries into the post |
| 35.5–38.9 | **The post** (20.01: the record typed) | P01, the record: dry | one held F4 over D♭maj7 and a sul-tasto D♭3/A♭3 pedal (35.80); nothing moves | the typed post (the record) | the pedal carries the ring into the call |
| 38.9–68.3 | **Gerg's call** (20.03–20.06; the edit) | P01, A♭ major · **Gerg's Build** (the v3 sample's A♭ colour, chip + felt) | A♭maj9 over the record's pedal (40.92), then one felt chord a bar (moved off Mas's lines); compile passes in the gaps and under Gerg's own lines (42.17 · 44.67 · 47.17 · 49.67 · 55.92 · 59.67 · 62.17 · 65.92); a last pass after "When it compiles." (67.01), his keys running on | Mas's lines (nothing starts); the edit (the record: a sul-tasto pedal, no chord, no Build) | the last pass stops on the paper's cut |
| 68.3–75.8 | **Neleh's paper** (v31-20.07–20.08) | P01 · **Neleh's question** | E♭m9 on the felt and a viola B♭3 pad under the quote (68.43); **C6 → D♭6**, one high harmonic, as he reads on and the Orb reads him (73.33) | — (no lines) | the D♭6 rings into the order |
| 75.8–97.4 | **The order** on the monitor (sc 21: NEDIB, the copies, "When the hell did I say that?", "which one's real?") | P01 held chords · **the verdict** again · **NEDIB's Fountain Pen** (bar 2) | G♭maj9(♯11) under the monitor, E♭m9 (83.52) and A♭13sus (86.11) in the line gaps; **D♭maj9 for "which one's real?"**, soft, pre-lapped 0.25 s (90.42); **the verdict** as the Orb's iris settles on the one with the pen (93.81); the Fountain Pen's C D F B♭ on the quartet, pp, as the real one signs (95.31) | every line (the real one dry: the pedal only) | the pen rings into the room |
| 97.4–99.4 | **He switches the monitor off** (v32-21.06) | the Water Line's held F · **the turn** | the felt takes the pen's F (F4, 96.56) and holds it; **on the click** (98.30) the quartet stops with the glass and the felt's D♭3 A♭3 come in under the same F: B♭ major → D♭ major | the clapping (SFX), growing into a hall | the hall's applause takes the cut; the felt lifts its pedal |
| 99.4–110.7 | **DevDay, live** (22.01: the stage, full frame) | — | — | "and today, you can build your own chatgtp.", "so, how's the partnership going?", "We love you guys." | **no score** (marked, digital zero from 100.28): the hall plays it dry |
| 110.7–118.9 | **Home: the phone; "super."** (22.02–22.03) | P01 · the Water Line | D♭maj9(♯11) on the felt (110.69); after "super.": the Water Line's flat line F F F and the nudge G4 (117.17) … **and the settle never comes** | "thrilled is too much…" (the felt alone); "super." (nothing) | the G4 decays into the surge |
| 118.9–123.4 | **The surge** (v32-22.04: the counter blurs, the LEDs step to red, he pauses the sign-ups) | the Water Line **thinned to its pedal** | an F3/C4 sul-tasto pedal bows in on the surge's downbeat (118.92) under the counter's chip notes (SFX, on F); nothing on the post or the grey-out | — (no lines) | THE CLOCK's first step is the next bar, on the same pedal |
| 123.4–130.9 | **The act-out** (sc 23: the reminder, the iris steps, NOV 16 → NOV 17) | **P04 THE CLOCK** (MM-14's step figure) | the F3/C4 pedal, one pizz step a beat on varied pitches + woodclick + an irregular chip tick; upper dyads F, G, A♭ one a bar (**the knee's rising step, the C never comes**); + low spiccato eighths (bar 2), + tremolo and the Ache G4/D♭5 at the peak (bar 3) | — | **DEAD STOP on bar 4's downbeat (130.92)**, tails cut |
| 130.9–133.4 | black (the crane and the tings pre-lap: SFX) | — | — | — | digital zero to the act's last frame (marked) |

**Nothing below C3** anywhere (the dark room's drone): asserted in the build.

## Measured

Measured on `render/music.wav` (the Kokoro v3.2 lock) and on the engine's own cue sheet. **Nothing was heard.**

- **Length:** 6,404,000 samples, 133.4167 s: the segment's 3,202 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness:** **−20.01 LUFS-I**, −3.15 dBTP; short-term p95 −17.86 (the underscore guide is −17), median −21.10, max −16.48.

  | Section | s | LUFS-I | ST p95 |
  |---|---|---|---|
  | A the home room: the Water Line warm, the Orb, the verdict, the settle | 0.0–26.0 | −18.7 | −16.9 |
  | B the monitor: the iris, Sirrah, the hands runner (THE COPY), his hand | 26.0–35.5 | −18.3 | −17.4 |
  | C the post (the record) | 35.5–39.9 | −20.1 | −20.3 |
  | C Gerg's call: A-flat, the Build in passes; the edit (pedal); his keys run on | 39.9–68.3 | −19.9 | −18.4 |
  | C' Neleh's paper: the quote, her question | 68.3–75.7 | −22.7 | −21.8 |
  | D the order on the monitor; the Orb picks; the pen | 75.7–97.4 | −22.1 | −20.8 |
  | the switch: the held F, the turn | 97.4–99.4 | −19.5 | — |
  | DevDay, live: no score (the hall's applause, the stage, his line) | 99.4–110.3 | −42.4 | −45.7 |
  | E home: the phone; "super." | 110.3–118.9 | −18.3 | −18.9 |
  | E' the surge: the pedal (the counter, the LEDs, the pause) | 118.9–123.4 | −25.1 | −23.6 |
  | F THE CLOCK (3 bars, a layer a bar) | 123.4–130.9 | −19.6 | −17.9 |

- **The two V.O. windows** (the felt alone; the bible's −24 ±2): −26.0 ("i made it for everyone else.") and −23.3 ("thrilled is too much…") LUFS.
- **Silence:** the only digital silences are the two marked ones, both digital zero:
  - DevDay, live (100.28 → 110.69): no score under the stage;
  - THE CLOCK's stop to the act's last frame (130.92 → 133.42).
  - No other hole of 0.3 s or more under −60 dBFS, no unmarked digital silence, and **no music run shorter than 2 s**.
- **Rule 12:** 0 written A-naturals over an F bass (every note boundary). **Spectral F-major check: OK** (1 F-bass windows over the limit, each explained by a partial of a written non-A note).
- **The knee:** 0 completions by pitch class; 0 whole.
- **No-third windows** (the two verdicts, the settle): A 0.003–0.007, A♭ 0.001–0.007 of F (limit 0.06).
- **Sub under the room drone:** −35.0 dB (limit −18); no notes below C3.
- **2–6 kHz band:** −20.6 dB (limit −15). **Balance** (piano · orch · big band · chip): 68 · 29 · 0 · 3.
- **Cut steps** (the v3.1 audit's method, the stem's level 0.5 s either side of every cut): every step of 12 dB or more sits on a cue mark or a marked silence: 18.05 the verdict, 18.06 the felt note, v31-20.07 the paper's E♭m9, 22.02 the re-entry after DevDay, 23.04 the dead stop, and on the ElevenLabs stem 21.02, the order (a designed hit). The audit's 11:48.1 cut (21.04) and the call's cut (20.04) stay under 12 dB. The iris flick (19.01) reads +4.8 dB and is listed as a designed hit.
- **Onsets:** every written sync point is on its frame. The soft entries that read outside ±10 ms are rolled felt chords, bowed or sustained entries and the Rhodes.

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v33-el/ep01-v33-el-act3.json` as it stood at 07:11 on 2026-09-28; re-run the one command if that lock changes):
- **Length:** 6,228,000 samples, 129.7500 s: its 3,114 frames exactly.
- **Loudness:** −20.02 LUFS-I, −3.15 dBTP; ST p95 −17.72.
- **The V.O. windows:** −25.9 and −23.6 LUFS.
- **Silence:** the two marked silences (DevDay 95.90 → 106.69; the stop 127.25 → 129.75) are digital zero. There are no other holes and no fragments.
- **Rule 12, the spectral F-major check, the knee and the no-third windows:** all OK.

## What a human must hear

1. **0–26 s.** Is the felt warm and close from the first frame? Does Tasya's Rhodes on the thirteenth key read as his colour, not a sting? Does the label read in the held chord? Do the grains under the scan read as the machine for one bar? Is the verdict a verdict?
2. **The hands runner (28–35.5 s).** THE COPY should be the machine copying his raised hand, a beat late and breaking off: a joke about the machine, never a cute sound effect. Does the chord as he lowers his hand land as his, with no V.O.?
3. **Neleh's question and his face on page 30 (73–75.7 s).** One harmonic, C6 → D♭6, then only it over his held face. A question, not a sting?
4. **Gerg's call.** Is the Build his keyboard in the next room, never a melody on his lines? Does the call's first chord come in over the pedal without an edit bump?
5. **"which one's real?" (90 s).** The softened D♭maj9 before the cut: a step you don't notice?
6. **The switch (96–99 s).** Does the held F turning from B-flat to D-flat read as him stopping watching? Does the hall's applause take the cut cleanly with no score under DevDay?
7. **The surge and THE CLOCK.** Does the pedal under the counter hold tension without a riser? Does THE CLOCK build by addition, and does the dead stop on the black land as an out?

## Where this departs from the brief or the script, and why

1. **The Water Line plays in full once, in the home room.** After that it plays only as held notes, the runner's fragments and the switch's held F. Its last flat line never settles: the surge thins it, and THE CLOCK takes the next bar. The script asks for one continuous performance edited on phrase boundaries; this is one continuous cue whose phrases sit where the picture has room for them.
2. **The verdict plays twice:** on `verified: human`, and when the Orb's iris picks the one with the pen. The bible gives Ep1 only the first. The second is the Orb acting again, and the script says the Orb picks the real one before Mas does. Drop it (two lines in `track.py`, section D) if once reads better.
3. **Colours the script doesn't name:**
   - NEDIB's Fountain Pen under the real signing (bible §2.11: his props get it, and the order is one of them).
   - Tasya's Rhodes chord on the thirteenth key (his first appearance). DevDay has no score, so this is his only chord in the act.
   - Gerg's Build under his call, in the v3 sample's A-flat (the bible's Build is his, and 2 AM pays it).
4. **The switch's turn is re-harmonisation, not a new motif.** The lock asks that "the Water Line holds its note under the switch". The held F is the pen's F, taken by his felt. On the click it stops being B-flat major's fifth and becomes D-flat major's third: the room, not the screen.
5. **THE CLOCK is quarters with a layer added each bar**, not the tone guide's subdivision per act-out. The script asks for "one step a beat", and the iris steps one circle a beat. v3.2's surge gives it its pedal a bar early.
6. **The stop is ON bar 4's downbeat,** the cut to black. The knee's rising step (F, G, A-flat) never gets its C. The black's 2.5 s is digital zero in the music stem; the SFX pre-lap of the crane and the tings carries it.
7. **THE COPY is the chip's own copy of his felt gesture, one per gesture, a beat late.** The runner is a held frame with three whirrs. The bible's COPY is a motif, so it's his line, copied and broken off, not a new tune.
