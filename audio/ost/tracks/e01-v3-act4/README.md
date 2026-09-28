# E01 v3 · Act Four · the Blip, told twice (score)

**What this is (2026-09-27, pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md)).** Seven cues, rendered by the OST engine and laid on Act Four's own clock (0 = the segment's first frame) on the **final v3.1 lock** (`show/reel/ep01-v31/`, script draft 7) into one stem: `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level (the avalanche at featured level) and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**The first round, restored.** The lead relayed the showrunner: "i liked the initial ost that was presented… we want to make sure we're keeping a unique sound, not toning down to overly generic". So this is the first-round score (commit 7d7a99f), restored after a restrained revision was withdrawn, with one change: **the avalanche's peak is about 2 dB down**. The last two phrases are ridden −2 dB and the cue's target goes −16 → −17, because the engine normalises each cue to its target. Phrases 3–4 read −16.9 / −16.8 LUFS, against −14.9 / −15.1 before. The rest is kept:
- the Build stops dead on Gerg's look at 2 AM;
- the VICTORY LAP stays (the bible's "one size too big", one wrong element: the old dialog undercuts it);
- the board's side keeps its clockwork.

**v3.1: the refit.** The first-round material is re-spotted to the final lock, and the new beats are scored in the same voices:
- **His side opens on the shock** (`cue_noon.py`, rewritten):
  - 10–15 s of the suite's ordinary life: the sul-tasto pedal, and his felt Water Line bar with its nudge on his glass. "gerg's not on it…" sits inside it.
  - JOIN: LEVERAGE, low, from the click.
  - Alyi's sentence: LEVERAGE thins to its pedal, a soft downbeat and a grand cluster.
  - The bright hard cut to the Remove dialog: the 1-bit F F F, the cluster up a semitone, and Step Four on the pointer.
  - **DEAD STOP on the Remove click (D6).** No score through the buzz and "super.": the one silence.
- **THE PLAN moves to the board's side** (`cue_plan.py`, new):
  - Neleh's desk at 11:52: her office clock first (SFX), then her clockwork on her card and a sul-tasto pad under "Once more, before the others join."
  - Then the Blueprint as before: the waltz's walk-offs, one note per label, the held chord for "Good question.", the moth, the path and the stuck loop.
  - The tape-stop now reaches zero on **the 11:59 tick**, where PROCEDURE's first chord takes over.
- **The Sunday reversal** (`cue_board.py` f): the phones picked up and set in a row (STAFF · STAFF · INVESTORS · INVESTORS) get one dry cello pizz each, in pairs. Her clockwork then plays only in the gaps between "The staff want him back…" and "…we're no closer."
- **Tuesday's invite:** one felt F4 on his Accept tap: his move, over Tasya's floor.
- **The pin:** LEVERAGE skips the pizz eighth nearest the extinguisher pin's click, so the click has its beat to itself.
- **S7.13, Ttemme's hourglass** (264 frames, full-v3/runway.md §11), in the show's voice:
  - the stamp's C pedal under his stream;
  - **THE TURN on the chat's "we're so back"** (k167): the pedal steps up to E♭ and Gerg's Build comes in;
  - **the shatter** (k173): a dead stop. The sand stands, and the music holds its breath with it (marked digital zero, to k208);
  - **the slump** (k208): the E♭ pedal back, swelling, and the Build compiling through the pour;
  - the timpani from the boardroom (k252) into the sign's VICTORY LAP.

**The material.** The cues are Act Four v5's score (`../e01-act4-v5/`, read and imported read-only, never edited) and the v3 sample's 2 AM cue (`audio/reel/ep01-v3-sample/music/`, read-only). Both are copied here and re-spotted to the v3 lock, with v3's changes:
- the cuts C13–C16;
- the new V.O. (the suite, JOIN, 2 AM);
- a **lighter PROCEDURE** for the board's side;
- the script's sc 29 calls for 2 AM;
- a **bigger VICTORY LAP** at the sign.

**The moods, in order (v3-plan §6):**
- suspense where it's earned (Vegas, noon: the shock first);
- felt (that night);
- the plan, dry, on her desk (the Blueprint);
- dry procedural comedy (the board's side);
- warm, loyal and funny (2 AM);
- the one full band (the avalanche);
- a triumph one size too big (Monday and the return);
- settling into the vault's F (the coda), handing off to the tag.

## Files

| File | What |
|---|---|
| `track.py` | The CLI: it renders the seven cues, lays them, measures and writes the cue sheet. Its docstring is the map. |
| `cue_noon.py`, `cue_night.py`, `cue_plan.py`, `cue_board.py`, `cue_two_am.py`, `cue_avalanche.py`, `cue_return.py` | The seven scores. Each docstring gives its spotting and its sources. |
| `a4common.py` | v5's two cue APIs (frames for S1–S4, seconds for S5–S8) on the v3 clock. |
| `v3clock.py`, `v3lay.py`, `v3music.py` | The clock, the lay-and-measure code and the small helpers. They're identical copies of the ones in `../e01-v3-act3/`. |
| `render/music.wav`, `render/music-ringout.wav` | The Kokoro-lock stem, and the vault pedal's release past the act's last frame (4.2 s). Both git-ignored. |
| `render/music-el.wav`, `render/music-el-ringout.wav` | The same score on the ElevenLabs-timed lock. |
| `cues.json`, `cues-el.json` | The cue sheet. It has every cue's window and lay-in, every sync point, the sections with their measured levels, the marked silences and rests, and the full measurement: loudness per cue and section, digital-silence runs, holes, fragments and each cue's engine QA. |
| `render/_work/<variant>/` | The engine's outputs per cue: the underscore master, `.cue.json` (its QA), `.mid`, `-pianoroll.png` and `.lay.json`. Git-ignored. |

## Re-run

From the repo root. The render is a heavy job, so it goes through `ops/heavy.sh` with two workers. All seven cues take about 4–5 minutes once there's a slot.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render                  # Kokoro lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render --variant el     # ElevenLabs lock
... --render noon board        # only those cues (noon night plan board two_am avalanche return), then re-assemble
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --dry [--variant el]        # light: build + note QA
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --assemble [--variant el]   # light: re-lay + measure
```

**Timing is parametric.** Every sync point is read from the timeline:
- the beat starts (cumulative `reelDur`, frame-rounded as `timeEpisode` does with head 0);
- the line spans and word times;
- the sounds and the on-screen texts.

The default reads `show/reel/ep01-v31/ep01-v31-act4.json`, and `--variant el` reads `show/reel/ep01-v31-el/ep01-v31-el-act4.json`. `--timeline PATH` reads any timeline with the same ids. `MRMAS_V3_LOCK=v3` points the clock at the first v3 lock (`show/reel/ep01-v3/`). The v3.1 cues read v3.1's new beats, so that lock no longer builds; the first round is at commit 7d7a99f.

A few marks aren't in the timeline:
- **v5's pixel-lock offsets from their beat:** the glass nudge, the moth, the fold's curl, mark 3, the hourglass flip, the slate door and Cancel's greying. These beats have no lines, and the ElevenLabs builder leaves such beats frame for frame, so the offsets hold.
- **S7.13's key frames** (k128 the stream, k167 the turn, k173 the shatter, k208 the slump, k252 the boardroom) are frames from S7.13's first frame, per runway.md §11.

Where a re-timed lock moves Mada's label, the avalanche's stop follows the label.

## The cue sheet

The times are the Kokoro lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–16.2 | **Vegas, noon: the suite's ordinary life** (S1.01–S1.02) | P01 · **the Water Line bar** (MM-07 sc 24) | an F3/C4 sul-tasto pedal bows in as air (0.04); the felt bar, swung (7.96), its **nudge G4 on his glass nudge** (9.83) with the chip square on that note only; the C4 hangs on D♭maj7 (10.46): the settle never comes | "gerg's not on it. alyi set it up. probably just the budget." sits inside the felt | the pedal holds to the JOIN click |
| 16.2–25.9 | **The call; the Remove dialog** (S1.07, v31-S1.08d) | **P03 LEVERAGE** (MM-08), low (−3 dB) | LEVERAGE's first eighth on the JOIN click (16.17); **thinned to its pedal** under Alyi's sentence (18.82: a soft downbeat and a grand cluster); his calm, one felt F4 (23.32); **the bright hard cut**: the 1-bit F F F on the dialog, the cluster up a semitone (24.17); **Step Four on Alyi's pointer** (24.03 · 24.65 · 25.28) | "Mas. The board has decided…" | **DEAD STOP on the Remove click (25.90): D6**, every stem and tail to digital zero |
| 25.9–37.2 | his tile falls; the buzz; **"super."** (S1.09–S1.12) | — | — | — | **no score** (marked, digital zero): the suite's air holds "super." |
| 37.2–46.4 | **That night: the third mark** (S2) | P01 (MM-08 26A) | the felt's open fifth on the carve: the re-entry (37.21); the nudge G4 before "i don't keep score." (38.46); an F3/C4 pedal under the count (41.07); the felt back on mark 3 (42.83); the settle C4 → F4; **THE REWIND** (E4, B♭3, 45.17) | the V.O. (the G4 alone) | the whip lands on Neleh's desk |
| 46.4–75.1 | **THE PLAN at Neleh's desk, 11:52** (v31-S3.00p, S1.03–S1.05) | Neleh's clockwork · **P14 BLUEPRINT** (MM-07): the chip music box, straight, 0 ms | her office clock first (SFX; a designed rest, 46.32–47.02); **her clockwork on her card** (46.93) and a sul-tasto pad; the waltz walks the three chairs off on its F F F (52.79 · 53.42 · 54.04), then the empty chairs; the 4/4 returns (56.54); **one Blueprint note per label** (the four · NONPROFIT · "controls" · "company" · THE COMPANY · VOTES: 0 · CEO); one held chord for "Good question." (70.29); the moth's flutter (71.50); the harp draws the path, tick 1 on "1. NOON" (73.10); **the stuck G–A♭ loop** on the fold (74.35); **the tape-stop** (74.65) reaches zero **on the 11:59 tick** (75.08) | "Once more, before the others join." (the pad); Neleh's reading (the box alone, the roots, a pencil tick) | PROCEDURE's first chord on the same frame |
| 75.1–110.8 | **The board's side, 11:59** (S3.00a–S3.03) | **P02 PROCEDURE, lighter** (MM-09) | B♭m(add9) and harp harmonics on the tick; Neleh's clockwork under the wait (75.40); the pedal (cello B♭2 + viola F3, an octave up) from the connect (75.30), the whisper stepping down in Alyi's gaps; the clockwork creeping back under the tinny "super." (91.37); **Step Four on the list** (94.49 · 95.12 · 95.74); the blank's F (96.37); a tick under "Any objections?" (107.63); **the Post click on a tick** (110.75) | the firing (the pedal only); the post [V] (the F alone) | — |
| 110.8–155.4 | **Rima; the all-hands; the evening** (S3.04–S3.07) | P02, lighter | one soft pizz figure after her join chime (111.24); the pedal alone under the all-hands (130.46); the spiccato pulse returns with Gerg's keycaps (145.79) | every line; the record dry | — |
| 155.4–184.2 | **NOV 18: the hearts, the boardroom, the sincere beat** (S4.01–S4.07) | P02 · **the Door + the GPU choir** · **Step Four** | a D♭ bed and the hearts' falling harp cascade (155.38); the blue heart (159.67); a pizz burst on each phone buzz (160.45 · 168.50); **the Door's head** (A♭4 → D♭5) through the door (174.87), the choir ppp under Alyi's line; the clack (175.37); **the sincere beat**: the solo viola's F E♭ D♭ over Step Four (179.04) | Neleh's speeches (the tick only); Alyi's line (the choir) | **a designed rest for the four dial tones** (182.14–184.44) |
| 184.2–202.8 | **The split: Mario** (S4.08) | P02 · **the Lighthouse** · **the Addendum** | the Lighthouse on the first ring (184.24), thinned under the talk; the Addendum on "some thoughts" (195.20); **"no." cuts its tail** (201.14) and nothing lands after it | the offer; the eleven pages | the pedal holds under the dial tone |
| 202.8–218.5 | **Sunday: the reversal** (S4.09: the phones in a row, the ticker, the lobby camera) | P02 | **one dry cello pizz per phone** (B♭ B♭ F F: STAFF STAFF INVESTORS INVESTORS, 202.96); her clockwork only in the gaps (207.45); the pedal; a soft tick | "The staff want him back…", "…we're no closer.", the badge lines (the pedal and the tick) | — |
| 218.5–239.3 | **Ttemme, the folder, the hourglass** (S4.10–S4.11) | P02 · **the hourglass** | the straight-mute accent F4 → B♭4 and the pulse on the spotlight (218.46); a held chord under the sealed folder's long beat (234.36); **one pizz grain a beat, falling**, from the flip (237.38) | the offer (a tick) | — |
| 239.3–258.2 | **Tasya's door** (S4.12–S4.13e) | **Tasya's floor** (the landlord's mediants) + his Rhodes | A♭maj9 on the slate (silent attack, 239.29), Cmaj9 as the door opens (240.71), the Rhodes on the beats as he appears (242.21; the jangle owns the offbeats), **Emaj9 on the statement [V]** (246.94: a colour, not a swell), home to A♭maj9 and one Rhodes chord on the sign (255.29) | "You'll want to hear our statement." (the floor settles); the statement (the held chord) | — |
| 258.2–263.5 | **"Step four, Mada?"** (S4.14–S4.15) | P02 · **Mada's spinner** | the clockwork winds down (258.25) and **hangs on one held C over the blank's F** (259.08); the spinner under his silence (261.17) | "Step four, Mada?" | **the door back:** the F leaves before the dark room's drone J-cuts in; the C rings on into S5.02 and becomes the major seventh of his D-flat chord |
| 263.5–294.0 | **2 AM: the home shot, the hearts, the Orb, Gerg rings** (S5.02–S5.05) | **P01 warm** (D♭ lydian / A♭) · **the Water Line** · **the Build** | the felt alone in the dark (263.61); the Water Line, warm (264.24); the felt's count, quarters on the hearts' tempo on varied pitches (268.62); one held chord for the Orb's look (273.93); A♭maj9 on the ring (279.23); **the Build (chip + felt) in compile passes** (282.37 · 286.74 · 289.24 · 291.74) | "four hundred and six…" (inside the count); "the badge was a joke." / "mostly." (one chord); Mas's lines (nothing starts) | — |
| 294.0–328.6 | **The letter; ALYI; "He did both."; the check** (S5.06–S5.08) | P01 · a sul-tasto D♭3/A♭3 pedal + **a soft walking pulse** | the pedal and the walk from the letter (296.74); **out on the scroll's stop at ALYI** (314.56); **back on "He did both."** (318.70: the pedal alone); the felt returns softly with the check (323.09) | the quoted lines: only the pedal and the walk | the rest (314.56 → 318.70) is marked, digital zero |
| 328.6–357.2 | **The Build returns; the look; the door** (S5.09-back–S5.11) | the Build · **Tasya's floor** | the Build with his keys (328.77); 8 under "The company. Again. Just in case." (330.65); the felt and a soft pad under "gerg never waits to be asked."; **a pass cut dead on his look up** (332.99 → 334.04), the pad holding; the floor's silent steps A♭ → C → E → A♭ (342.06 · 347.67 · 349.21 · 351.53); **one soft Rhodes chord on the door, a second on "desk"** | the V.O.s; "pack?" / "compiles."; Tasya's offer (the floor) | — |
| 357.2–362.7 | **"leave it open."** (S5.12) | P01 | nothing under the line; then the felt takes the landlord's chord back **without its third** (E♭3 A♭3 B♭3) and settles C4 → F4 over it (359.00) | "leave it open." | it rings out to the avalanche's first frame |
| 362.7–376.8 | **The avalanche** (S6) | **P11 SET-PIECE SWING** (MM-10 b): **the one full band**, featured, its peak ~2 dB down | MM-10's own bars at exactly 96 BPM: the compile (362.67), the Build at 16 (365.17) and the brass kick, Step Four's G-flat (367.67), **Alyi resists one beat** (368.92), Neleh's window (370.88), the board's bowed F pedal (371.73) ending silently on THE QUIET VOTE (373.54), the Water Line augmented (372.67), **the full band on C7(♯9♭13)** (375.17) | Neleh's "Has anyone read the char—" (a window with no lead) | **DEAD STOP on MADA's label** (376.83; the swung "and" of beat 3, bar 6); marked silence to the violin |
| 378.8–417.6 | **Monday: Alyi's regret; the landlord becomes the room; Tuesday's invite** (S7.01–S7.03b) | **STRAIGHT** → **Tasya's floor** | **the Door on the senza-vibrato solo violin, under the post only** (380.97); on the first heart its G3 holds and decays (386.12); the floor pre-laps under it (397.68); a chord on each of **"below", "above", "around"** (407.18 · 408.44 · 409.67); the Rhodes bloom (410.81); home to A♭maj9 under the rail (414.11); **one felt F4 on his Accept** (416.53) | the exchange (the decay); Tasya's lines (the floor, silent attacks) | — |
| 417.6–454.0 | **Tuesday night: the fires, Terb, the terms** (S7.05–S7.08) | **P03 LEVERAGE** | LEVERAGE fades in under Mada (418.25); the door bang inside it (419.50); the pin's click gets its eighth to itself; thinned to its F pedal under Terb's reading and the terms (429.13) | Terb's reading [V]; the terms | **DEAD STOP on "of what?"** (454.01 → the stamp): Mada's pause, both "good question"s and the long hold play in the room (marked, digital zero) |
| 462.1–477.8 | **The stamp; Gerg's post; Ttemme's hourglass** (S7.09–S7.13, 264 frames) | the stamp's **C pedal** · **the Build** | a low C pedal bows in on the stamp (462.08); **Gerg's Build restarts on his post** (462.73, soft, A-flat, F4–C5 under the keycaps); one pizz grain on the last grain (466.17); the pedal under his stream; **THE TURN on "we're so back"** (472.83: the pedal up to E♭, the Build comes in); **the shatter** (473.08): a dead stop, the sand stands; **the slump** (474.54): the E♭ pedal swells back and the Build compiles through the pour; the timpani rolls from the boardroom (476.38) | the posts (the pedal alone) | **the held beat** (473.08 → 474.54) is marked digital zero |
| 477.8–483.3 | **The lobby sign; the old dialog** (S8.01–S8.03) | **P09 VICTORY LAP**, one size too big | **the brass stab on the sign** (477.78) and a bar and a half of A-flat major: strings tutti, horns, a timpani roll, the Build at full, the top line E♭5 → A♭5 → C6 on violins and chip (478.72); **one chip note hangs** (480.28: the undercut); the 1993 flat line F5 · F4 · F5 under the Remove dialog (481.08); the bonk (the SFX's E3) | — | a designed rest on the lobby's neon F: the CU "silent like the first", nothing under "okay." (483.28–487.17) |
| 487.1–517.8 | **"okay."; the vault; the memo; the chair** (S8.05–S8.10) | P01 → **P05 (diegetic)**: **the vault's F** | the felt C4 → F4 over an open fifth after "okay." (487.11); **the vault's F**: a glass pedal F3/C4 matched to the hum's fan tones (488.88); **the Ache** (G4 + D♭5, pure beating tones) for the vault's own shot, cut with the picture (489.18–491.67) | Gerg and Mas; **the memo [V]** (the pedal alone) | **the act ends on the pedal**; its release is `render/music-ringout.wav` (4.2 s) |

## Measured

Measured on `render/music.wav` (the Kokoro lock) and on each cue's engine cue sheet. **Nothing was heard.**

- **Length:** 25,142,000 samples, 523.7917 s: the segment's 12,571 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness, the whole act:** **-20.27 LUFS-I**, -3.15 dBTP; short-term p95 -17.34, median -20.95, max -14.05 (the VICTORY LAP).
- **Per cue** (each cue's master is normalised by the engine to its target; the window is its span on the act clock):

| Cue | Window (s) | Target | LUFS-I (window) | ST p95 | Engine: rule 12 · spectral F-major · knee | Balance p·o·b·c |
|---|---|---|---|---|---|---|
| S1 noon (suite → PLAN → LEVERAGE → D6) | 0.00–47.69 | -20 | -20.0 | -17.41 | OK · one window (the tape-stop) · 0 | 12·48·0·40 |
| S2 that night | 57.62–71.04 | -22 | -22.36 | -20.6 | OK · OK · 0 | 89·9·0·3 |
| S3–S4 the board's side (lighter) | 71.04–278.15 | -21 | -20.95 | -17.97 | OK · OK · 0 | 0·79·21·0 |
| S5 2 AM | 275.08–374.08 | -20 | -19.89 | -18.1 | OK · OK · 0 | 73·23·0·4 |
| S6 the avalanche (featured; v3.1: the peak ~2 dB down) | 374.08–388.25 | -17 | -16.91 | -15.16 | OK · OK · 0 | 18·42·18·22 |
| S7–S8 the return, the coda | 390.21–523.79 | -20 | -19.98 | -17.2 | OK · OK · 0 | 4·86·2·8 |

- **Silence:**
  - The four marked silences are digital zero in the stem:
    - D6, the Cancel click → the carve (47.69 → 57.61);
    - ALYI → "He did both." (327.10 → 331.24);
    - Mada's label → the violin (388.25 → 392.71);
    - "of what?" → the stamp (460.07 → 468.12).
  - There's no other digital silence.
  - Every hole of 0.3 s or more under −60 dBFS is one of those four, or the designed rest in the lobby (the CU and "okay.", 486.75 → 490.25).
  - **No music run is shorter than 2 s.**
- **Rule 12** (a written A-natural over an F bass, every note boundary): 0 in all six cues. **The knee:** 0 completions by pitch class, 0 whole.
- **The spectral F-major check** passes in five cues. In the noon cue one window (37.81–38.42 s, A/F 0.81) sits **inside the designed tape-stop**: the chip partials sweep down through A as the tape slows. Act Four v5's S1 and the v3 sample show the same window (the engine can't attribute a pitch-warp done in a post).
- **The V.O. windows** (LUFS, the bible's −24 ±2):
  - "i don't keep score.": −28.0 (v5: −27.8; the cue is almost all felt).
  - 2 AM: −21.1 (the count: the V.O. sits inside the felt's pulse), −25.7, −24.5 and −22.9.
- **Sub under the room drone** (the dark room, the vault): nothing below C3 in the night and 2 AM cues.
- **2–6 kHz band:** −16.3 dB (the avalanche) to −35.9 dB (the night); the limit is −15.
- **Onsets:** every sync point is written on its frame. The ones read outside ±10 ms are soft bowed or sustained entries, the GM Rhodes, and v5's muted horns on the arrow (+15 to +52 ms), as in v5.
- **Hot spots to hear** (sections louder than −17.5 LUFS-I or with ST p95 over −17, apart from the featured avalanche):
  - S1's path (1.9 s, −17.1);
  - the board's held C into the dark room together with 2 AM's first felt chord (275.1–276.8, −16.9);
  - the VICTORY LAP (−14.3 over 3.3 s, ridden at −3.5 dB, at the stab/outs level).
- **Render variance:** the sampler picks its samples per note, so a held note can land 2–3 dB apart between renders. The ElevenLabs render's hang on "Step four?" reads −16.9 LUFS against the Kokoro render's −18.9, with the same notes.

**Every section:**

| Section | s | LUFS-I | ST p95 |
|---|---|---|---|
| S1 the suite: the pedal, the felt Water Line bar | 0.0–8.2 | -23.1 | -20.7 |
| S1 WORD + the waltz (3/4) | 8.2–13.8 | -19.7 | -18.7 |
| S1 the labels (4/4 Blueprint, thinned under the reading) | 13.8–27.5 | -20.0 | -19.1 |
| S1 "Good question.": the held chord | 27.5–29.7 | -21.2 | — |
| S1 the path | 29.7–31.6 | -17.1 | — |
| S1 BREAK (stuck, thin under the V.O.) + the tape-stop into JOIN | 31.6–38.3 | -19.4 | -17.8 |
| S1 LEVERAGE (low), one take | 38.3–47.7 | -20.1 | -19.3 |
| S2 26A: the carve and the V.O. | 57.6–61.5 | -18.8 | -18.7 |
| S2 the count and TPOOL: the pedal | 61.5–67.6 | -29.3 | -28.3 |
| S2 mark 3, the settle, the Rewind | 67.6–71.0 | -21.0 | — |
| a NOON: the call, the list, the post | 71.0–112.2 | -19.5 | -17.1 |
| b Rima | 112.2–135.6 | -23.5 | -20.6 |
| c the all-hands and the evening | 135.6–161.0 | -22.9 | -21.0 |
| d NOV 18 hearts | 161.0–165.8 | -18.6 | -18.1 |
| d the boardroom: the phones, the glass | 165.8–185.2 | -22.4 | -20.1 |
| d the sincere beat | 185.2–188.7 | -17.8 | — |
| rest: the dial tones | 188.7–190.4 | -27.8 | — |
| e the rival lab (the split) | 190.4–212.1 | -22.3 | -20.0 |
| f Sunday: the lobby camera | 212.1–227.5 | -22.3 | -19.1 |
| f Ttemme, the folder, the hourglass | 227.5–250.2 | -20.8 | -18.3 |
| g the door: Tasya's floor | 250.2–270.1 | -19.8 | -17.6 |
| h Step four? (the hang) | 270.1–275.1 | -18.9 | -18.3 |
| the held C into the dark room | 275.1–276.8 | -16.8 | — |
| S5 the dark room at 2 AM: the felt, the Water Line warm | 275.1–280.2 | -18.8 | -18.3 |
| S5 the count (the felt's pulse under the V.O.) | 280.2–285.5 | -21.4 | -20.6 |
| S5 the Orb exchange: one held chord | 285.5–290.7 | -21.5 | -20.5 |
| S5 Gerg's call: the Build in A-flat major (chip + felt) | 290.7–306.5 | -18.3 | -16.9 |
| S5 the letter: the pedal and the pulse | 306.5–327.1 | -20.5 | -19.3 |
| S5 the rest: ALYI -> "He did both." | 327.1–331.2 | — | — |
| S5 "He did both.": the pedal alone | 331.2–335.3 | -22.6 | -22.3 |
| S5 the check: the felt returns | 335.3–341.2 | -17.7 | -21.2 |
| S5 the Build returns; the V.O.; the look (the held note) | 341.2–357.2 | -20.3 | -17.7 |
| S5 the door: Tasya's floor (Ab -> C -> E -> Ab), two Rhodes chords | 357.2–368.6 | -20.7 | -19.6 |
| S5 "leave it open.": warm, open (no third), the ring-out to the first tile | 368.6–374.1 | -18.9 | -18.2 |
| S6 phrase 1: the compile (A1, A4) | 374.1–379.1 | -17.4 | -16.6 |
| S6 phrase 2: Step Four, Alyi, Neleh (A6-A7) | 379.1–384.1 | -16.9 | -15.9 |
| S6 phrase 3: the Water Line, the quiet vote (A9) | 384.1–386.6 | -16.9 | — |
| S6 phrase 4: the full band (A13) -> the stop | 386.6–388.2 | -16.8 | — |
| S7 a the STRAIGHT violin, then its decay | 390.2–410.3 | -20.6 | -17.7 |
| S7 b Tasya's floor (pre-lap -> below/above/around -> bloom -> home) | 410.3–427.5 | -17.7 | -17.0 |
| S7 c1 LEVERAGE (fade-in -> the bang) | 427.5–437.5 | -19.3 | -18.2 |
| S7 c1 thinned to the F pedal | 437.5–460.1 | -19.1 | -17.7 |
| S7 STOP: "of what?" -> the stamp (the room) | 460.1–468.1 | -52.1 | — |
| S7 c2 the C pedal (the posts); the Build restarts | 468.1–479.1 | -20.3 | -19.1 |
| S7 d the sand's rest + the pickup | 479.1–480.9 | -19.4 | — |
| S8 e VICTORY LAP, one size too big + one chip note | 480.9–484.2 | -14.3 | — |
| S8 e the flat line | 484.2–486.4 | -23.7 | — |
| S8 designed rest: the lobby CU, "okay." | 486.4–490.3 | -45.9 | -52.1 |
| S8 the felt settle | 490.3–492.0 | -19.6 | — |
| S8 f the vault's F (the coda) | 492.0–523.8 | -26.6 | -26.1 |

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v3-el/ep01-v3-el-act4.json` as it stood at 13:19 on 2026-09-27; re-run the one command if that lock changes):
- **Length:** 26,050,000 samples, 542.7083 s: its 13,025 frames exactly.
- **Loudness:** -20.21 LUFS-I, -3.15 dBTP; ST p95 -17.37.
- **Silence:** the four marked silences are digital zero. There's no unmarked digital silence, no undesigned hole and no fragment.
- **Checks:** rule 12 and the knee pass in every cue, and so does the spectral F-major check (the tape-stop window doesn't trip on this timing).
- **The avalanche:** Mada's label lands 0.29 s before the swung "and" (`label_on_swing: false`), and the stop follows it.


## What a human must hear

1. **0–8 s.** The suite's pedal under the V.O., then the felt bar with its nudge on his glass nudge: air and one gesture, not a drone effect.
2. **31.6–38.3 s.** The stuck G–A♭ loop under "gerg's not on it. alyi set it up. probably just the budget.", then the tape-stop reaching zero on JOIN. The plan failing under his wrong read, not a playback fault?
3. **47.7–57.6 s.** The click takes everything. Nothing plays under "super." Then the felt's fifth on the carve.
4. **71–275 s, the board's side, lighter.** Do the clockwork between lines and the pedal an octave up read as dry comedy, and dignified, never a nag?
   - **165.8–185 s:** the phones, the Door in the glass and Neleh's sincere beat.
   - **After "no.":** only the dial tone on the pedal.
5. **270–279 s.** The hang on "Step four?", with its C carried into the dark room. Does the room's first felt chord make the C its major seventh?
6. **2 AM.**
   - The walking pulse under the letter: a walk, never a heartbeat.
   - Out on ALYI and back on "He did both.": designed, not a hole?
   - The Build cut dead on his look.
   - Two Rhodes chords at the door.
   - The open A-flat 6/9 ringing into the first tile.
7. **374–388 s.** The avalanche out of the ring-out with no pickup, and the dead stop on the label: the laugh, never a glitch.
8. **481–484 s.** VICTORY LAP one size too big for a lobby sign, then the old dialog undercutting it. A laugh from scale, not a fanfare gag?
9. **492 s to the end.** The Ache on the vault's own shot: dread, not a sting. The pedal under the memo, and the hand-off into the tag.

## Where this departs from the brief, the script or v5, and why

1. **The board's side is lighter than v5's** (v3-plan §6, "PROCEDURE, lighter"):
   - the pedals sit an octave up, with no contrabass under the talk;
   - the viola whisper plays only under the firing, and it steps down diatonically;
   - Neleh's clockwork is the connective tissue between lines;
   - Step Four's inner voices are strings, with no bassoon.
   The Door, the choir, the sincere beat, the Lighthouse and the Addendum are v5's.
2. **C13–C16 in the music.**
   - The Door's head and the choir move into the boardroom wide under Alyi's moved line.
   - "no." cuts the Addendum's tail, and nothing lands after it: v5's "How much?" landing went with C14.
   - The floor steps to E on the one-sentence statement (C15).
   - With no card (C16) there's no REVERSAL. Mada's held C rings into the dark room instead, where the felt's first chord makes it a major seventh.
3. **2 AM follows script draft 6 where it differs from the v3 sample.**
   - There's a walking pulse under the letter.
   - The music comes back on "He did both.", not at the check.
   - Tasya's Rhodes gives two chords (the door, "desk") instead of playing on the beats.
   - The Build returns after the new "he's typing like it's launch night.".
4. **The Build restarts on Gerg's post** at 468.77. OST-BIBLE §2.6 says the post restarts it; v5 kept it for the pickup only.
5. **VICTORY LAP is bigger than v5's single stab.** It's a bar and a half of A-flat major on strings, horns, a timpani roll and a chip-doubled top line, for a lobby sign, then undercut by the old dialog. That's the plan's "one size too big". The script's "a brass stab on the sign" is its downbeat. It's ridden −3.5 dB and reads −14.3 LUFS-I over its 3.3 s, the OUTS/stab level.
6. **The Ache sits on the vault's own shot**, because v3 has no Q\* rail. P05 makes the vault's F the score's root.
7. **The act ends on the pedal, not a fade.** The script's L-cut carries the vault's F into the tag. Its natural release past the act's last frame is `render/music-ringout.wav`, for the mix to lay at the tag's first frame if the tag's own cue doesn't carry the pedal.
8. **Silence after Mada's label runs 4.45 s** (to the violin under Alyi's post). v3's S7.01 arrives 1.5 s longer than v5's, and the script puts the violin under the post only.
9. **The avalanche is laid at exactly 96 BPM from S6.01.**
   - On the Kokoro lock the label falls on the swung "and" of beat 3, bar 6, as in v5.
   - On the ElevenLabs lock it comes 0.29 s earlier. The stop follows the label, so the full band plays 2.2 beats instead of 2⅔ (flagged `label_on_swing: false` in `cues-el.json`).

## Hand-offs

- **To the mix (A3):**
  - Lay `render/music.wav` at 0 dB from Act Four's first frame and duck it under the dialogue (−8 to −12 dB; the V.O. windows less).
  - The marked silences are digital zero in the stem:
    - D6, the Cancel click → the carve. The mix mutes every bus from the click to the buzz.
    - ALYI → "He did both."
    - Mada's label → the violin.
    - "of what?" → the stamp.
  - `render/music-ringout.wav` is the vault pedal's release (4.2 s from −19 dBFS peak). Lay it at the tag's first frame if the tag's cue doesn't start on the same F pedal.
- **To the tag's composer:** the act ends on a glass F3/C4 pedal, the vault's F, at about −27 LUFS, still sounding at the last sample. The tag's MM-12 can pick it up as its root.
- **To the SFX pass (A2):** the score is tuned to the bible's SFX pitches:
  - the stamps on C;
  - the Orb's chime and the vault's hum on F;
  - the bonk on E3;
  - the keycaps at F5–C7, with the Build kept at F4–C5 under them.
  OST-BIBLE §6.8's request 1 (tune the four DTMF tones to F4 E♭4 D♭4 C4) still stands; the score rests there.
- **The pixel pass:** v5's pixel-lock offsets are used for the few marks the timeline doesn't carry (see Re-run). If the v3 shots move the glass nudge, the moth, the fold's curl, mark 1, mark 3, the hourglass flip, the slate door or Cancel's greying, change the offset in the cue module; the docstrings name them.
