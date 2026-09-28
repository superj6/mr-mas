# E01 v3 · Act Three · the dark room (score)

**What this is (2026-09-27, pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md)).** One cue, `e01-v3-act3`, rendered by the OST engine and laid on Act Three's own clock (0 = the segment's first frame): `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**The mood (v3-plan §6, script draft 6 sc 18–23):** intimate, quiet, a little lonely, but warm, not dread. The Water Line (MM-01) plays warm, in D-flat lydian and A-flat major; the Orb's verdict is the open fifth; THE CLOCK comes in only at the act-out. Warm colours away from F are authorised for Ep1 v3. Nothing sits below C3 anywhere, because of the dark room's drone (F1 + C2).

## Files

| File | What |
|---|---|
| `track.py` | The score and the CLI. Its docstring is the second-by-second spotting map. |
| `render/music.wav` | The Kokoro-lock stem (git-ignored). |
| `render/music-el.wav` | The same score on the ElevenLabs-timed lock (git-ignored). |
| `cues.json`, `cues-el.json` | The cue sheet: every sync point, the sections with their measured levels, the marked silence, and the full measurement (loudness per section, digital-silence runs, holes, fragments, the engine's QA). |
| `render/_work/<variant>/` | The engine's own outputs: the underscore master, `.cue.json` (its QA), `.mid`, `-pianoroll.png`, `.lay.json`. Git-ignored. |
| `v3clock.py`, `v3lay.py`, `v3music.py` | The clock, the lay-and-measure code and the small composing helpers. They're identical copies of the ones in `../e01-v3-act4/`. |

## Re-run

From the repo root. The render is a heavy job, so it goes through `ops/heavy.sh` with two workers; it takes about 80 s once it has a slot.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --render                # Kokoro lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --render --variant el   # ElevenLabs lock
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --dry [--variant el]       # light: build + note QA
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act3/track.py --assemble [--variant el]  # light: re-lay + measure
```

**Timing is parametric.** Every position is read from the timeline: the beat starts (cumulative `reelDur`, frame-rounded as `timeEpisode` does with head 0), the line spans and word times, the sounds and the on-screen texts. The grid is anchored so that THE CLOCK's bar 1 is beat 23.01's first frame. `--variant el` reads `show/reel/ep01-v3-el/ep01-v3-el-act3.json`, and `--timeline PATH` reads any timeline with the same ids.

## The cue sheet

The times are the Kokoro lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–25.3 | **The home room** (sc 18: the tray, the Orb rises, the scan, `verified: human`, "you can stay.") | P01, warm: D♭ lydian → A♭ · **the Water Line**; GLYPH grains; **the verdict** | the D♭ lydian bloom on the first frame (0.03); the Water Line from bar 1 (0.54), the chip square on its nudge only; G♭maj9(♯11) + bowed vibes as the lens finds him (10.54); grains F5 C6 D♭6 on the scan (14.13, one bar, 0 ms); **the verdict F5 → C6 on the toast** (15.66 / 16.28) over the felt's open fifth; the settle C4 → F4 after the chime (23.67 / 24.29): it fits | "i made it for everyone else." (one felt dyad, an inner move in a word gap); "thanks." and "you can stay." (nothing starts) | the chime (SFX, F) gets a beat to itself; the settle rings into the monitor |
| 25.3–34.8 | **The monitor: Mario, the second phone** (sc 19) | P01 · the Water Line again, **a solo violin line** under it | the statement on bar 1 of the cut (25.54): A♭maj9 → D♭maj9 (the settle lands on D♭'s third, warm), B♭m9, E♭13sus | — (no lines) | carries across the rent meter's tick |
| 34.8–39.8 | **The post** (sc 20.01–20.03: the record typed; the LEDs stop) | P01, the record: dry | one held F4 over D♭maj7 and a sul-tasto D♭3/A♭3 pedal (35.54); nothing moves when the LEDs stop (38.25), the act's one quiet beat | the typed post (the record) | the pedal carries into the ring |
| 39.8–75.8 | **Gerg's call** (sc 20.04–20.06; the edit) | P01, A♭ major · **Gerg's Build** (the v3 sample's A♭ colour, chip + felt) | one felt chord a bar (moved off Mas's lines); compile passes on the half-bars, in the gaps and under Gerg's own lines (41.79 · 44.29 · 48.04 · 50.54 · 56.79 · 59.29 · 63.04); a last pass after the V.O., his keys running on (74.45) | Mas's lines (nothing starts); the edit (the record: a sul-tasto A♭3/E♭4 pedal, no chord, no Build); "gerg types louder when he's happy…" (the felt alone) | the last pass carries into the order |
| 75.8–101.3 | **The order** on the monitor (sc 21: NEDIB, the copies, "When the hell did I say that?", "which one's real?") | P01 held chords · **the verdict** again · **NEDIB's Fountain Pen** (bar 2) | G♭maj9(♯11) under the monitor, E♭m9 and A♭13sus in line gaps; D♭maj9 under "which one's real?"; **the verdict** as the Orb's iris settles on the one with the pen (96.72); the Fountain Pen's C D F B♭ on the quartet, pp, as the real one signs (99.27) | every line (the real one dry: the pedal only) | the pen's B♭ rings into DevDay's applause |
| 101.3–118.0 | **DevDay** on the monitor; the phone's three words; "super." (sc 22) | P01, A♭ · **Tasya's Rhodes** (one chord) | A♭maj9 on the odometer's clunk; one Rhodes chord as Tasya walks on (103.04); D♭maj9(♯11) for the phone (109.82); after "super.": the Water Line's flat line F F F and the nudge G4 (116.17) … **and the settle never comes** | "We love you guys." (the record: an A♭ pedal only); "thrilled is too much…" (the felt alone); "super." (nothing) | THE CLOCK takes the settle's downbeat |
| 118.0–125.5 | **The act-out** (sc 23: the reminder, the iris steps, NOV 16 → NOV 17) | **P04 THE CLOCK** (MM-14's step figure) | an F3/C4 pedal, one pizz step a beat on varied pitches + woodclick + an irregular chip tick; upper dyads F, G, A♭ one a bar (**the knee's rising step, the C never comes**); + low spiccato eighths (bar 2), + tremolo and the Ache G4/D♭5 at the peak (bar 3) | — | **DEAD STOP on bar 4's downbeat (125.54)**, tails cut |
| 125.5–128.0 | black (the crane and the tings pre-lap: SFX) | — | — | — | digital zero to the act's last frame (marked) |

**Nothing below C3** anywhere (the dark room's drone): asserted in the build.

## Measured

Measured on `render/music.wav` (the Kokoro lock) and on the engine's own cue sheet. **Nothing was heard.**

- **Length:** 6,146,000 samples, 128.0417 s: the segment's 3,073 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness:** **−20.07 LUFS-I**, −3.15 dBTP; short-term p95 −17.78 (the underscore guide is −17), max −16.43.

  | Section | s | LUFS-I | ST p95 |
  |---|---|---|---|
  | A the home room, the Orb | 0–25.3 | −19.1 | −17.1 |
  | B the monitor | 25.3–34.8 | −18.2 | −17.1 |
  | C the post (the record) | 34.8–39.8 | −20.1 | −20.1 |
  | C Gerg's call | 39.8–75.8 | −20.2 | −18.6 |
  | D the order, the pen | 75.8–101.3 | −22.8 | −21.0 |
  | E DevDay, "super." | 101.3–118.0 | −20.1 | −18.7 |
  | F THE CLOCK | 118.0–125.5 | −19.8 | −17.9 |

- **The three V.O. windows** (the felt alone): −25.0, −22.5 and −22.5 LUFS against the bible's −24 ±2.
- **Silence:** the only digital silence is the marked one: THE CLOCK's stop to the act's last frame (125.54 → 128.04), digital zero. No other hole of 0.3 s or more under −60 dBFS, and **no music run shorter than 2 s** (one run, 0 → 125.54).
- **Rule 12:** 0 written A-naturals over an F bass (every note boundary). **Spectral F-major check: OK** (render 1 flagged the violin pizz body resonance near 430–450 Hz under THE CLOCK's F; the ticks and the spiccato are notched there now).
- **The knee:** 0 completions by pitch class; 0 whole.
- **No-third windows** (the two verdicts, the settle): A 0.005–0.017, A♭ 0.003–0.024 of F (limit 0.06).
- **Sub under the room drone:** −34.7 dB (limit −18); no notes below C3.
- **2–6 kHz band:** −20.2 dB (limit −15). **Balance** (piano · orch · big band · chip): 67 · 30 · 0 · 3 (P01's 55 · 25 · 5 · 15; the chip is two nudge doubles, the grains and the Build, all soft).
- **Onsets:** every written sync point is on its frame; two soft entries read outside ±10 ms: the G♭maj9 + bowed vibes (+25 ms) and the Fountain Pen's first bowed note (−57 ms).

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v3-el/ep01-v3-el-act3.json` as it stood at 13:19 on 2026-09-27; re-run the one command if that lock changes):
- **Length:** 6,016,000 samples, 125.3333 s: its 3,008 frames exactly.
- **Loudness:** −20.06 LUFS-I, −3.15 dBTP; ST p95 −18.17.
- **The V.O. windows:** −23.9, −23.5 and −22.3 LUFS.
- **Silence:** the one marked stop (122.83 → 125.33) is digital zero. There are no other holes and no fragments.
- **Rule 12, the spectral F-major check, the knee and the no-third windows:** all OK.

## What a human must hear

1. **0–25 s.** Is the felt warm and close from the first frame? Do the grains under the scan read as the machine for one bar, not a sting? Is the verdict a verdict?
2. **The second Water Line and the solo line under Mario.** Lonely, never the sad-piano cliché?
3. **Gerg's call.** Is the Build his keyboard in the next room, never a melody on his lines? The last pass runs on after "gerg types louder when he's happy." Warm, or a button? Drop it if it reads as a button.
4. **The Fountain Pen under the real signing.** A nod, not a joke?
5. **THE CLOCK.** Does it build by addition, with no riser? Does the dead stop on the black land as an out?

## Where this departs from the brief or the script, and why

1. **The Water Line plays twice in full** (sc 18 and sc 19), then only as held notes, and its last flat line never settles: THE CLOCK takes the downbeat. The script asks for one continuous performance edited on phrase boundaries; this is one continuous cue whose phrases sit where the picture has room for them.
2. **The verdict plays twice:** on `verified: human`, and when the Orb's iris picks the one with the pen. The bible gives Ep1 only the first. The second is the Orb acting again, and the script says the Orb picks the real one before Mas does. Drop it (two lines in `track.py`, section D) if once reads better.
3. **Three colours the script doesn't name:** NEDIB's Fountain Pen under the real signing (bible §2.11: his props get it, and the order is one of them); one Rhodes chord as Tasya walks on at DevDay (it plants his colour before Act Four); and Gerg's Build under his call, in the v3 sample's A-flat (the bible's Build is his, and this is where "gerg types louder when he's happy" plants 2 AM).
4. **THE CLOCK is quarters with a layer added each bar**, not the tone guide's subdivision per act-out. The script asks for "one step a beat", and the iris steps one circle a beat.
5. **The stop is ON bar 4's downbeat,** the cut to black. The knee's rising step (F, G, A-flat) never gets its C. The black's 2.5 s is digital zero in the music stem; the SFX pre-lap of the crane and the tings carries it.
