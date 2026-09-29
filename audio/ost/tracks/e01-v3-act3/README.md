# E01 v3 · Act Three · the dark room (score)

**What this is (pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md); v3.4 refit 2026-09-28).** One cue, `e01-v3-act3`, rendered by the OST engine and laid on Act Three's own clock (0 = the segment's first frame). It's laid on the **final v3.4 lock** (`show/reel/ep01-v34/` 4309e86, EL `ep01-v34-el/` 93f0431; record in `lock-v34.md`, notes `script-v34-notes.md`). The output is `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**The mood (v3-plan §6):** intimate, quiet, a little lonely, but warm, not dread. The Water Line (MM-01) plays warm, in D-flat lydian and A-flat major; the Orb's verdict is the open fifth; THE CLOCK comes in only at the act-out. Warm colours away from F are authorised for Ep1 v3. Nothing sits below C3 anywhere, because of the dark room's drone (F1 + C2).

**v3.5 FINAL (2026-09-28; the current stem).** The final film is the ElevenLabs-timed v3.5 lock, `show/reel/ep01-v35-el/` (lock-v35.md, script-v35-notes.md). `v3clock.py` now defaults to v3.5 (`MRMAS_V3_LOCK=v34` …). `render/music-el.wav` is 136.417 s (3,274 frames), exact.
- **The president's deepfake is restored (21.03-21.04): "a laugh with a chill."** v3.3's "which one's real?" (the D♭maj9 pre-lapped 0.25 s) and the Orb's second verdict come back. The verdict now lands on the last of **two** iris flicks (v3.5 cut the third).
  - **The laugh:** on the copy's pop (21.02's `tower_pop`), the felt strikes F4 and the chip copies it a sixteenth late and a hair flat. That's THE COPY's device, the echo too close, once, before the copy speaks.
  - **The chill:** under the copy's words ("And then the computers regulate themselves.") the glass holds the Ache (G4 + D♭5) over the G♭ pedal. It lets go under the real one's "When the hell did I say that?", which is the record: dry, the pedal only.
- **Kept:**
  - the designed hits (19.01, 21.02);
  - the 5 ms rest fades;
  - the switch's turn, DevDay unscored, the surge;
  - THE CLOCK to its dead stop.
- **Measured:**
  - **Levels:** −20.03 LUFS-I, −3.15 dBTP; the order and the deepfake section −21.3.
  - **Engine checks:** rule 12 and the spectral F-major OK; the knee 0.
  - **Silence and gaps:** no unmarked silence, hole or fragment.
  - **Cut steps:** all six steps of 12 dB or more sit on a mark or a designed hit.
- **Re-run:** `OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --render --variant el`. The Kokoro v3.5 stem was not rendered: the film is ElevenLabs.

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

**v3.4 (the refit; lock-v34.md, script-v34-notes.md).** The act is about 8 s shorter:
- **18.02, the Orb's V.O.** ("my other company. for when it gets harder to tell."): the label's D♭maj9 is struck 0.4 s before it and holds under it, with one soft inner move in a word gap (v3.1's window). The Water Line's third bar (A♭maj9) and the hanging E♭13sus give way to it when the V.O. comes first.
- **18.06's V.O. is cut:** the one felt dyad now sounds as the Orb drifts to his shoulder.
- **21.03 and 21.04, the deepfakes, are cut.** "which one's real?" and the second verdict go with them (so the verdict plays once, and the audit's 11:48.1 chord is gone). The order is its G♭maj9 (a designed hit on the cut) over the G♭/D♭ pedal, under NEDIB's one line, into the pen.
- **22.01, DevDay:** his V.O. ("a year ago, forty users and a nice thread.") sits over the hall's applause. DevDay stays unscored (the hall plays it dry), so the V.O. has the room, not the felt.
- The bloom now gets at least 0.8 s before the Water Line's first bar (the new bar grid had put it 0.26 s after the first frame).
- **Kept:** the designed hits (19.01, 21.02), the 5 ms rest fades, the switch's turn, the surge and THE CLOCK.

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
- The default reads `show/reel/ep01-v34/ep01-v34-act3.json`.
- `--variant el` reads `show/reel/ep01-v34-el/ep01-v34-el-act3.json`.
- `--timeline PATH` reads any timeline with the same ids.
- `MRMAS_V3_LOCK=v33` or `v32` points the clock at an earlier lock. The cues check for the merged and cut beats, so those still build (dry-built for the cue-sheet mapping). `v31` and `v3` don't: the switch and the surge are v3.2 beats. The v3.1 score is at commit 14c7ec1, the first round at 7d7a99f.

## The cue sheet

The times are the Kokoro v3.4 lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–3.8 | **The home room, the monitor lit: the thirteenth key** (v31-18.00; v3.3 folds the Atem POV into it) | P01, warm: D♭ lydian · **the Water Line** · **Tasya's Rhodes** | the D♭ lydian bloom on the first frame (0.03); the Water Line from bar 1 (2.79), the chip square on its nudge only; **Tasya's Rhodes** (C E♭ G B♭) after "Everyone is welcome." (3.42), as he hangs the Atem-blue key on the monitor | "Everyone is welcome." (the monitor): nothing starts inside it | the felt carries into the slot |
| 3.8–25.9 | **The tray, the label, the Orb** (sc 18: the scan, `verified: human`, "you can stay.") | P01 · the Water Line; GLYPH grains; **the verdict** | the Water Line's second bar under the tray; **D♭maj9 for the label and the Orb's V.O.** ("my other company. for when it gets harder to tell.", 7.21: struck before the V.O., which sits inside it, with one soft inner move); G♭maj9(♯11) + bowed vibes as the lens finds him (12.79); grains F5 C6 D♭6 on the scan (16.71, one bar); **the verdict F5 → C6 on the toast** (18.24 / 18.86) over the felt's open fifth; the settle C4 → F4 after the chime (24.04 / 24.67): it fits | the label's V.O. (the felt alone); "thanks." and "you can stay." (nothing starts; one felt dyad as the Orb drifts to his shoulder) | the chime (SFX, F) gets a beat to itself |
| 25.9–35.4 | **The iris, the hands runner** (19.01, v31-19.03; v3.3 cuts Sirrah's clip and the pinky promise) | P01 · a solo violin line · **THE COPY** (chip) | **A♭maj9 and a solo violin E♭4 on the iris flick** (25.95, a designed hit), resolving to D♭4 on the runner's cut; D♭maj9 under the runner; **his own hand goes up, before anyone's**: F → G on the felt (28.13), **THE COPY** a beat late on the chip, breaking off before Remuhcs asks the room; **he lowers his hand himself**: one felt chord, E♭ A♭ D♭ (34.34) | "Every single person raised their hand." / "It's important for us to have a referee." (the record: a held B♭m9, nothing moves) | carries into the post |
| 35.4–38.8 | **The post** (20.01: the record typed) | P01, the record: dry | one held F4 over D♭maj7 and a sul-tasto D♭3/A♭3 pedal (35.67); nothing moves | the typed post (the record) | the pedal carries the ring into the call |
| 38.8–68.1 | **Gerg's call** (20.03–20.06; the edit) | P01, A♭ major · **Gerg's Build** (the v3 sample's A♭ colour, chip + felt) | A♭maj9 over the record's pedal (40.29), then one felt chord a bar (moved off Mas's lines); compile passes in the gaps and under Gerg's own lines (41.54 · 44.04 · 47.79 · 50.29 · 56.54 · 60.29 · 62.79); a last pass after "When it compiles." (66.85), his keys running on | Mas's lines (nothing starts); the edit (the record: a sul-tasto pedal, no chord, no Build) | the last pass stops on the paper's cut |
| 68.1–75.7 | **Neleh's paper** (v31-20.07–20.08) | P01 · **Neleh's question** | E♭m9 on the felt and a viola B♭3 pad under the quote (68.27); **C6 → D♭6**, one high harmonic, as he reads on and the Orb reads him (73.17) | — (no lines) | the D♭6 rings into the order |
| 75.7–85.9 | **The order** on the monitor (21.02: NEDIB's one line; v3.4 cuts the deepfakes, 21.03–21.04) | P01 held chords · **NEDIB's Fountain Pen** (bar 2) | **G♭maj9(♯11) on the cut** (75.63, a designed hit) over a G♭/D♭ pedal, held under his line; the Fountain Pen's C D F B♭ on the quartet, pp, as he signs (83.81) | his line (the pedal only) | the pen rings into the room |
| 85.9–87.9 | **He switches the monitor off** (v32-21.06) | the Water Line's held F · **the turn** | the felt takes the pen's F (F4, 85.06) and holds it; **on the click** (86.80) the quartet stops with the glass and the felt's D♭3 A♭3 come in under the same F: B♭ major → D♭ major | the clapping (SFX), growing into a hall | the hall's applause takes the cut; the felt lifts its pedal |
| 87.9–102.6 | **DevDay, live** (22.01: the stage, full frame) | — | — | his V.O. over the applause ("a year ago, forty users and a nice thread.", v3.4) and the stage's lines: "and today, you can build your own chatgtp.", "so, how's the partnership going?", "We love you guys." | **no score** (marked, digital zero from 88.78): the hall plays it dry |
| 102.6–110.8 | **Home: the phone; "super."** (22.02–22.03) | P01 · the Water Line | D♭maj9(♯11) on the felt (102.61); after "super.": the Water Line's flat line F F F and the nudge G4 (109.04) … **and the settle never comes** | "thrilled is too much…" (the felt alone); "super." (nothing) | the G4 decays into the surge |
| 110.8–115.3 | **The surge** (v32-22.04: the counter blurs, the LEDs step to red, he pauses the sign-ups) | the Water Line **thinned to its pedal** | an F3/C4 sul-tasto pedal bows in on the surge's downbeat (110.79) under the counter's chip notes (SFX, on F); nothing on the post or the grey-out | — (no lines) | THE CLOCK's first step is the next bar, on the same pedal |
| 115.3–122.8 | **The act-out** (sc 23: the reminder, the iris steps, NOV 16 → NOV 17) | **P04 THE CLOCK** (MM-14's step figure) | the F3/C4 pedal, one pizz step a beat on varied pitches + woodclick + an irregular chip tick; upper dyads F, G, A♭ one a bar (**the knee's rising step, the C never comes**); + low spiccato eighths (bar 2), + tremolo and the Ache G4/D♭5 at the peak (bar 3) | — | **DEAD STOP on bar 4's downbeat (122.79)**, tails cut |
| 122.8–125.3 | black (the crane and the tings pre-lap: SFX) | — | — | — | digital zero to the act's last frame (marked) |

**Nothing below C3** anywhere (the dark room's drone): asserted in the build.

## Measured

Measured on `render/music.wav` (the Kokoro v3.2 lock) and on the engine's own cue sheet. **Nothing was heard.**

- **Length:** 6,014,000 samples, 125.2917 s: the segment's 3,007 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness:** **−20.01 LUFS-I**, −3.15 dBTP; short-term p95 −18.09 (the underscore guide is −17), median −20.84, max −16.22.

  | Section | s | LUFS-I | ST p95 |
  |---|---|---|---|
  | A the home room: the Water Line warm, the Orb, the verdict, the settle | 0.0–25.9 | −18.7 | −16.9 |
  | B the monitor: the iris, Sirrah, the hands runner (THE COPY), his hand | 25.9–35.4 | −18.5 | −17.6 |
  | C the post (the record) | 35.4–39.8 | −20.4 | −20.6 |
  | C Gerg's call: A-flat, the Build in passes; the edit (pedal); his keys run on | 39.8–68.2 | −20.0 | −18.9 |
  | C' Neleh's paper: the quote, her question | 68.2–75.6 | −22.9 | −22.0 |
  | D the order on the monitor; the Orb picks; the pen | 75.6–85.9 | −23.2 | −21.7 |
  | the switch: the held F, the turn | 85.9–87.9 | −20.4 | — |
  | DevDay, live: no score (the hall's applause, the stage, his line) | 87.9–102.2 | −39.5 | −43.3 |
  | E home: the phone; "super." | 102.2–110.8 | −18.3 | −19.1 |
  | E' the surge: the pedal (the counter, the LEDs, the pause) | 110.8–115.3 | −25.5 | −23.9 |
  | F THE CLOCK (3 bars, a layer a bar) | 115.3–122.8 | −19.8 | −18.2 |

- **The two V.O. windows** (the felt alone; the bible's −24 ±2): −23.1 (the Orb's label, "my other company. for when it gets harder to tell.") and −23.3 ("thrilled is too much…") LUFS.
- **Silence:** the only digital silences are the two marked ones, both digital zero:
  - DevDay, live (88.78 → 102.61): no score under the stage;
  - THE CLOCK's stop to the act's last frame (122.79 → 125.29).
  - No other hole of 0.3 s or more under −60 dBFS, no unmarked digital silence, and **no music run shorter than 2 s**.
- **Rule 12:** 0 written A-naturals over an F bass (every note boundary). **Spectral F-major check: OK** (4 F-bass windows over the limit, each explained by a partial of a written non-A note).
- **The knee:** 0 completions by pitch class; 0 whole.
- **No-third windows** (the two verdicts, the settle): A 0.007–0.007, A♭ 0.001–0.002 of F (limit 0.06).
- **Sub under the room drone:** −34.9 dB (limit −18); no notes below C3.
- **2–6 kHz band:** −21.7 dB (limit −15). **Balance** (piano · orch · big band · chip): 68 · 29 · 0 · 3.
- **Cut steps** (the v3.1 audit's method, the stem's level 0.5 s either side of every cut): every step of 12 dB or more sits on a cue mark or a marked silence: 18.02 the label's chord and the Orb's V.O., 18.05 the verdict, 18.06 the felt dyad, 22.02 the re-entry after DevDay, 23.04 the dead stop. The iris flick (19.01) and the order (21.02) are listed as designed hits.
- **Onsets:** every written sync point is on its frame. The soft entries that read outside ±10 ms are rolled felt chords, bowed or sustained entries and the Rhodes.

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v34-el/ep01-v34-el-act3.json` as it stood at 11:15 on 2026-09-28; re-run the one command if that lock changes):
- **Length:** 5,948,000 samples, 123.9167 s: its 2,974 frames exactly.
- **Loudness:** −20.00 LUFS-I, −3.15 dBTP; ST p95 −17.84.
- **The V.O. windows:** −23.8 and −23.5 LUFS.
- **Silence:** the two marked silences (DevDay 86.32 → 100.86; the stop 121.42 → 123.92) are digital zero. There are no other holes and no fragments.
- **Rule 12, the spectral F-major check, the knee and the no-third windows:** all OK.

## What a human must hear

1. **0–26 s.** Is the felt warm and close from the first frame? Does Tasya's Rhodes on the thirteenth key read as his colour, not a sting? Does the label's chord hold the Orb's V.O. without crowding it? Do the grains under the scan read as the machine for one bar? Is the verdict a verdict?
2. **The hands runner (28–35.4 s).** THE COPY should be the machine copying his raised hand, a beat late and breaking off: a joke about the machine, never a cute sound effect. Does the chord as he lowers his hand land as his, with no V.O.?
3. **Neleh's question and his face on page 30 (73–75.7 s).** One harmonic, C6 → D♭6, then only it over his held face. A question, not a sting?
4. **Gerg's call.** Is the Build his keyboard in the next room, never a melody on his lines? Does the call's first chord come in over the pedal without an edit bump?
5. **The order (75.6 s).** The G♭maj9 on the cut, out of the harmonic alone: a designed arrival, not a bump?
6. **The switch (85–88 s).** Does the held F turning from B-flat to D-flat read as him stopping watching? Does the hall's applause take the cut cleanly, and does his DevDay V.O. sit well with no score under it?
7. **The surge and THE CLOCK.** Does the pedal under the counter hold tension without a riser? Does THE CLOCK build by addition, and does the dead stop on the black land as an out?

## Where this departs from the brief or the script, and why

1. **The Water Line plays in full once, in the home room.** After that it plays only as held notes, the runner's fragments and the switch's held F. Its last flat line never settles: the surge thins it, and THE CLOCK takes the next bar. The script asks for one continuous performance edited on phrase boundaries; this is one continuous cue whose phrases sit where the picture has room for them.
2. **The verdict plays once,** on `verified: human` (v3.4 cuts the deepfakes and the Orb's second pick with them), as the bible gives Ep1.
3. **Colours the script doesn't name:**
   - NEDIB's Fountain Pen under the real signing (bible §2.11: his props get it, and the order is one of them).
   - Tasya's Rhodes chord on the thirteenth key (his first appearance). DevDay has no score, so this is his only chord in the act.
   - Gerg's Build under his call, in the v3 sample's A-flat (the bible's Build is his, and 2 AM pays it).
4. **The switch's turn is re-harmonisation, not a new motif.** The lock asks that "the Water Line holds its note under the switch". The held F is the pen's F, taken by his felt. On the click it stops being B-flat major's fifth and becomes D-flat major's third: the room, not the screen.
5. **THE CLOCK is quarters with a layer added each bar**, not the tone guide's subdivision per act-out. The script asks for "one step a beat", and the iris steps one circle a beat. v3.2's surge gives it its pedal a bar early.
6. **The stop is ON bar 4's downbeat,** the cut to black. The knee's rising step (F, G, A-flat) never gets its C. The black's 2.5 s is digital zero in the music stem; the SFX pre-lap of the crane and the tings carries it.
7. **THE COPY is the chip's own copy of his felt gesture, a beat late.** Since v3.3 the runner has one gesture, his own hand going up first. The bible's COPY is a motif, so it's his line, copied and broken off, not a new tune.
