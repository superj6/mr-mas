# E01 v3 · Act Three · the dark room (score)

**What this is (2026-09-27, pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md)).** One cue, `e01-v3-act3`, rendered by the OST engine and laid on Act Three's own clock (0 = the segment's first frame) on the **final v3.1 lock** (`show/reel/ep01-v31/`, script draft 7): `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**The mood (v3-plan §6, script draft 6 sc 18–23):** intimate, quiet, a little lonely, but warm, not dread. The Water Line (MM-01) plays warm, in D-flat lydian and A-flat major; the Orb's verdict is the open fifth; THE CLOCK comes in only at the act-out. Warm colours away from F are authorised for Ep1 v3. Nothing sits below C3 anywhere, because of the dark room's drone (F1 + C2).

**v3.1.** This is the first-round score (commit 7d7a99f; the showrunner liked it), refit to the v3.1 lock. The new beats:
- **The thirteenth key** (the Atem payoff, v31-18.00b): Tasya's Rhodes chord on the cut to the monitor, his colour arriving with him, over the Water Line's first statement. "Everyone is welcome." and "thirteen." sit inside the felt.
- **The hands runner** (v31-19.02–19.03): a held A♭maj9 and a solo violin E♭4 → D♭4 over Sirrah's two letters. Then, for each of his three gestures, the felt plays a fragment of his line (F F, F G, C F) and **THE COPY** answers on the chip a beat late, cut off on the Orb's whirr. The bible gives Ep1's COPY to the runner. The monitor's lines play dry (a held B♭m9), and the felt is alone under "i've had mine up since may."
- **Neleh's paper** (v31-20.07–20.08): E♭ minor (felt, with a viola B♭ pad) under "neleh's on our board. she quoted us.", then **Neleh's question** as the page holds: one high harmonic, C6 → D♭6 (OST-BIBLE §2.16).

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

**Timing is parametric.** Every position is read from the timeline: the beat starts (cumulative `reelDur`, frame-rounded as `timeEpisode` does with head 0), the line spans and word times, the sounds and the on-screen texts. The grid is anchored so that THE CLOCK's bar 1 is beat 23.01's first frame.
- The default reads `show/reel/ep01-v31/ep01-v31-act3.json`.
- `--variant el` reads `show/reel/ep01-v31-el/ep01-v31-el-act3.json`.
- `MRMAS_V3_LOCK=v3` points the clock at the first v3 lock (`show/reel/ep01-v3/`). The v3.1 score reads v3.1's new beats, so that lock no longer builds; the first round is at commit 7d7a99f.
- `--timeline PATH` reads any timeline with the same ids.

## The cue sheet

The times are the Kokoro lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–9.5 | **The home room; the thirteenth key on the monitor** (v31-18.00, v31-18.00b) | P01, warm: D♭ lydian · **the Water Line** · **Tasya's Rhodes** | the D♭ lydian bloom on the first frame (0.03); the Water Line from bar 1 (2.62), the chip square on its nudge only; **Tasya's Rhodes** (C E♭ G B♭) on the cut to the monitor (3.25), as he hangs the Atem-blue key | "Everyone is welcome." (the monitor) and "thirteen." (the V.O.): nothing starts inside them; A♭maj9 is struck just before the V.O. | the felt carries into the room |
| 9.5–33.4 | **The tray, the label, the Orb** (sc 18: the scan, `verified: human`, "you can stay.") | P01 · the Water Line; GLYPH grains; **the verdict** | E♭13sus and a viola A♭ pad under the tray and the label; D♭maj9 for "my other company…" (12.83); G♭maj9(♯11) + bowed vibes as the lens finds him (17.62); grains F5 C6 D♭6 on the scan (22.21, one bar); **the verdict F5 → C6 on the toast** (23.74 / 24.36) over the felt's open fifth; the settle C4 → F4 after the chime (31.38 / 32.00): it fits | the V.O.s (the felt alone, a soft inner move in a word gap); "thanks." and "you can stay." (nothing starts) | the chime (SFX, F) gets a beat to itself |
| 33.4–51.3 | **The iris, Sirrah, the hands runner** (19.01, v31-19.02, v31-19.03) | P01 · a solo violin line · **THE COPY** (chip) | A♭maj9 and a solo violin E♭4 → D♭4 over the iris and Sirrah's letters; D♭maj9 under the runner; **his three gestures** on the felt (F F · F G · C F: 38.68 · 39.78 · 40.88), **THE COPY** a beat late on the chip, cut off on each whirr | "Every single person raised their hand." / "It's important for us to have a referee." (the record: a held B♭m9, nothing moves); "i've had mine up since may." (the felt alone) | carries into the post |
| 51.3–56.3 | **The post** (20.01–20.02: the record typed; the LEDs stop) | P01, the record: dry | one held F4 over D♭maj7 and a sul-tasto D♭3/A♭3 pedal (51.55); nothing moves when the LEDs stop (54.67), the act's one quiet beat | the typed post (the record) | the pedal carries into the ring |
| 56.3–89.5 | **Gerg's call** (20.03–20.06; the edit) | P01, A♭ major · **Gerg's Build** (the v3 sample's A♭ colour, chip + felt) | one felt chord a bar (moved off Mas's lines); compile passes in the gaps and under Gerg's own lines (58.88 · 63.88 · 66.38 · 72.62 · 76.38 · 78.88 · 82.62); a last pass after the V.O. (88.25), his keys running on | Mas's lines (nothing starts); the edit (the record: a sul-tasto pedal, no chord, no Build); "gerg types louder when he's happy…" (the felt alone) | the last pass stops on the paper's cut |
| 89.5–95.8 | **Neleh's paper** (v31-20.07–20.08) | P01 · **Neleh's question** | E♭m9 on the felt and a viola B♭3 pad (89.64); **C6 → D♭6**, one high harmonic, as he reads on and the Orb reads him (94.54) | "neleh's on our board. she quoted us." (the felt alone) | the D♭6 rings into the order |
| 95.8–117.4 | **The order** on the monitor (sc 21: NEDIB, the copies, "When the hell did I say that?", "which one's real?") | P01 held chords · **the verdict** again · **NEDIB's Fountain Pen** (bar 2) | G♭maj9(♯11) under the monitor, E♭m9 (103.56) and A♭13sus (106.15) in the line gaps; D♭maj9 under "which one's real?"; **the verdict** as the Orb's iris settles on the one with the pen (113.85); the Fountain Pen's C D F B♭ on the quartet, pp, as the real one signs (115.36) | every line (the real one dry: the pedal only) | the pen's B♭ rings into DevDay's applause |
| 117.4–135.1 | **DevDay** on the monitor; the phone's three words; "super." (sc 22) | P01, A♭ · **Tasya's Rhodes** (his second chord) | A♭maj9 on the odometer's clunk; one Rhodes chord as Tasya walks on (120.12); D♭maj9(♯11) for the phone (126.90); after "super.": the Water Line's flat line F F F and the nudge G4 (133.25) … **and the settle never comes** | "We love you guys." (the record: an A♭ pedal only); "thrilled is too much…" (the felt alone); "super." (nothing) | THE CLOCK takes the settle's downbeat |
| 135.1–142.6 | **The act-out** (sc 23: the reminder, the iris steps, NOV 16 → NOV 17) | **P04 THE CLOCK** (MM-14's step figure) | an F3/C4 pedal, one pizz step a beat on varied pitches + woodclick + an irregular chip tick; upper dyads F, G, A♭ one a bar (**the knee's rising step, the C never comes**); + low spiccato eighths (bar 2), + tremolo and the Ache G4/D♭5 at the peak (bar 3) | — | **DEAD STOP on bar 4's downbeat (142.62)**, tails cut |
| 142.6–145.1 | black (the crane and the tings pre-lap: SFX) | — | — | — | digital zero to the act's last frame (marked) |

**Nothing below C3** anywhere (the dark room's drone): asserted in the build.

## Measured

Measured on `render/music.wav` (the Kokoro v3.1 lock) and on the engine's own cue sheet. **Nothing was heard.**

- **Length:** 6,966,000 samples, 145.1250 s: the segment's 3,483 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness:** **−20.03 LUFS-I**, −3.15 dBTP; short-term p95 −17.58 (the underscore guide is −17), median −21.13, max −15.71.

  | Section | s | LUFS-I | ST p95 |
  |---|---|---|---|
  | A the home room, the key, the Orb | 0–33.4 | −19.2 | −17.0 |
  | B the monitor, the hands runner | 33.4–51.3 | −19.4 | −16.5 |
  | C the post (the record) | 51.3–56.3 | −20.4 | −20.7 |
  | C Gerg's call | 56.3–89.5 | −19.6 | −17.5 |
  | C′ Neleh's paper | 89.5–95.8 | −22.2 | −21.4 |
  | D the order, the pen | 95.8–117.4 | −22.1 | −20.5 |
  | E DevDay, "super." | 117.4–135.1 | −20.4 | −18.7 |
  | F THE CLOCK | 135.1–142.6 | −19.8 | −18.0 |

- **The seven V.O. windows** (the felt alone; the bible's −24 ±2): −25.3 ("thirteen."), −23.4, −23.9, −23.2, −22.6, −25.3 (Neleh's paper) and −22.7 LUFS.
- **Silence:** the only digital silence is the marked one: THE CLOCK's stop to the act's last frame (142.62 → 145.12), digital zero. No other hole of 0.3 s or more under −60 dBFS, and **no music run shorter than 2 s** (one run, 0 → 142.62).
- **Rule 12:** 0 written A-naturals over an F bass (every note boundary). **Spectral F-major check: OK** (the one F-bass window over the limit, under THE CLOCK, is explained by the cello F3's fifth partial).
- **The knee:** 0 completions by pitch class; 0 whole.
- **No-third windows** (the two verdicts, the settle): A 0.005–0.009, A♭ 0.002–0.009 of F (limit 0.06).
- **Sub under the room drone:** −34.5 dB (limit −18); no notes below C3.
- **2–6 kHz band:** −22.0 dB (limit −15). **Balance** (piano · orch · big band · chip): 68 · 29 · 0 · 3.
- **Onsets:** every written sync point is on its frame. Five soft entries read outside ±10 ms (−53 to +44 ms):
  - two rolled felt chords (−11 ms);
  - the G♭maj9 + bowed vibes;
  - the Fountain Pen's first bowed note;
  - the DevDay Rhodes.

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v31-el/ep01-v31-el-act3.json` as it stood at 19:15 on 2026-09-27; re-run the one command if that lock changes):
- **Length:** 6,872,000 samples, 143.1667 s: its 3,436 frames exactly.
- **Loudness:** −20.02 LUFS-I, −3.15 dBTP; ST p95 −17.57.
- **The V.O. windows:** −25.1, −24.3, −24.8, −23.7, −23.1, −25.6 and −23.6 LUFS.
- **Silence:** the one marked stop (140.67 → 143.17) is digital zero. There are no other holes and no fragments.
- **Rule 12, the spectral F-major check, the knee and the no-third windows:** all OK.

## What a human must hear

1. **0–33 s.** Is the felt warm and close from the first frame? Does Tasya's Rhodes on the thirteenth key read as his colour, not a sting? Do the grains under the scan read as the machine for one bar? Is the verdict a verdict?
2. **The hands runner (38–42 s).** THE COPY should be the machine copying him, a beat late and breaking off. Is it a joke about the machine, never a cute sound effect?
3. **Neleh's question (94.5 s).** One harmonic, C6 → D♭6. A question, not a sting?
4. **Gerg's call.** Is the Build his keyboard in the next room, never a melody on his lines? The last pass runs on after "gerg types louder when he's happy." Warm, or a button? Drop it if it reads as a button.
5. **The Fountain Pen under the real signing.** A nod, not a joke?
6. **THE CLOCK.** Does it build by addition, with no riser? Does the dead stop on the black land as an out?

## Where this departs from the brief or the script, and why

1. **The Water Line plays in full once, in the home room.** After that it plays only as held notes and the runner's fragments, and its last flat line never settles: THE CLOCK takes the downbeat. v3.1's hands runner takes sc 19's second statement. The script asks for one continuous performance edited on phrase boundaries; this is one continuous cue whose phrases sit where the picture has room for them.
2. **The verdict plays twice:** on `verified: human`, and when the Orb's iris picks the one with the pen. The bible gives Ep1 only the first. The second is the Orb acting again, and the script says the Orb picks the real one before Mas does. Drop it (two lines in `track.py`, section D) if once reads better.
3. **Colours the script doesn't name:**
   - NEDIB's Fountain Pen under the real signing (bible §2.11: his props get it, and the order is one of them).
   - Tasya's Rhodes chord twice: on the thirteenth key (v3.1: his first appearance) and as he walks on at DevDay. It plants his colour before Act Four.
   - Gerg's Build under his call, in the v3 sample's A-flat (the bible's Build is his, and this is where "gerg types louder when he's happy" plants 2 AM).
4. **THE CLOCK is quarters with a layer added each bar**, not the tone guide's subdivision per act-out. The script asks for "one step a beat", and the iris steps one circle a beat.
5. **The stop is ON bar 4's downbeat,** the cut to black. The knee's rising step (F, G, A-flat) never gets its C. The black's 2.5 s is digital zero in the music stem; the SFX pre-lap of the crane and the tings carries it.
6. **THE COPY is the chip's own copy of his felt gesture, one per gesture, a beat late.** The runner is a held frame with three whirrs (v3.1). The bible's COPY is a motif, so it's his line, copied and broken off, not a new tune.
