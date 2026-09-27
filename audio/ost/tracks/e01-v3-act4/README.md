# E01 v3 · Act Four · the Blip, told twice (score)

**What this is (2026-09-27, pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md)).** Six cues, rendered by the OST engine and laid on Act Four's own clock (0 = the segment's first frame) into one stem: `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level (the avalanche at featured level) and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**Revised on the showrunner's note on the v3 film (2026-09-27):** "i didn't mean for you to overkill and make it sound goofy level hapy." SHOWRUNNER-NOTES note 2 now says variety means **changing intensity and texture, not genre**. The score stays a dry, prestige-drama score in the show's dark, modal home. Its other colours are quiet, warm, curious, cool and wry. A major colour is fleeting: an added 9th with no third. So:
- **2 AM** is warm but sparse: felt and a quiet pad; the Build a small soft figure that stops on his look; Tasya's door a quiet, slightly uneasy lift.
- **The avalanche** is a tense, building orchestral pulse, not the full band.
- **The return** is restrained irony: one understated, slightly too calm chord at the sign, then the vault's F.
- **The board's side** keeps its clockwork only where it's dry and quiet.
- **Noon and the night** are unchanged.

**The material.** The cues are Act Four v5's score (`../e01-act4-v5/`, read and imported read-only, never edited) and the v3 sample's 2 AM cue (`audio/reel/ep01-v3-sample/music/`, read-only). Both are copied here and re-spotted to the v3 lock, with v3's changes (the cuts C13–C16, the new V.O. in the suite, at JOIN and at 2 AM) and the revision above.

**The moods, in order:**
- suspense where it's earned (Vegas, noon);
- felt (that night);
- dry and procedural (the board's side);
- warm but sparse (2 AM);
- a tense, building pulse (the avalanche);
- restrained irony (Monday and the return);
- settling into the vault's F (the coda), handing off to the tag.

## Files

| File | What |
|---|---|
| `track.py` | The CLI: it renders the six cues, lays them, measures and writes the cue sheet. Its docstring is the map. |
| `cue_noon.py`, `cue_night.py`, `cue_board.py`, `cue_two_am.py`, `cue_avalanche.py`, `cue_return.py` | The six scores. Each docstring gives its spotting and its sources. |
| `a4common.py` | v5's two cue APIs (frames for S1–S4, seconds for S5–S8) on the v3 clock. |
| `v3clock.py`, `v3lay.py`, `v3music.py` | The clock, the lay-and-measure code and the small helpers. They're identical copies of the ones in `../e01-v3-act3/`. |
| `render/music.wav`, `render/music-ringout.wav` | The Kokoro-lock stem, and the vault pedal's release past the act's last frame (4.2 s). Both git-ignored. |
| `render/music-el.wav`, `render/music-el-ringout.wav` | The same score on the ElevenLabs-timed lock. |
| `cues.json`, `cues-el.json` | The cue sheet. It has every cue's window and lay-in, every sync point, the sections with their measured levels, the marked silences and rests, and the full measurement: loudness per cue and section, digital-silence runs, holes, fragments and each cue's engine QA. |
| `render/_work/<variant>/` | The engine's outputs per cue: the underscore master, `.cue.json` (its QA), `.mid`, `-pianoroll.png` and `.lay.json`. Git-ignored. |

## Re-run

From the repo root. The render is a heavy job, so it goes through `ops/heavy.sh` with two workers. All six cues take about 4–5 minutes once there's a slot.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render                  # Kokoro lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render --variant el     # ElevenLabs lock
... --render noon board        # only those cues (noon night board two_am avalanche return), then re-assemble
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --dry [--variant el]        # light: build + note QA
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --assemble [--variant el]   # light: re-lay + measure
```

**Timing is parametric.** Every sync point is read from the timeline:
- the beat starts (cumulative `reelDur`, frame-rounded as `timeEpisode` does with head 0);
- the line spans and word times;
- the sounds and the on-screen texts.

v5 took a few marks from its pixel lock (the glass nudge, the moth, the fold's curl, mark 1, mark 3, the hourglass flip and its last grain, the slate door, Cancel's greying). The v3 lock has no pixel marks yet, so these are v5's offsets from their beat. They hold because those beats have no lines, and the ElevenLabs builder leaves such beats frame for frame. Where a re-timed lock moves Mada's label, the avalanche's stop follows the label.

## The cue sheet

The times are the Kokoro lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–8.3 | **Vegas, noon: the suite** (S1.01–S1.02) | P01 · **the Water Line bar** (MM-07 sc 24) | an F3/C4 sul-tasto pedal bows in as air (0.04); the felt bar, swung (4.29), its **nudge G4 on his glass nudge** (6.17) with the chip square on that note only; the C4 hangs on D♭maj7: the settle never comes | "the race is tomorrow. the board wants noon today." sits inside the felt | the felt rings on under the blueprint's cut and the stamp (SFX, C) |
| 8.3–31.6 | **THE PLAN** (S1.03–S1.05) | **P14 BLUEPRINT** (MM-07): the chip music box, straight, 0 ms | the waltz walks the three chairs off on its F F F (10.00 · 10.62 · 11.25), then the empty chairs; the 4/4 returns (13.75); **one Blueprint note per label** (the four · NONPROFIT · "controls" · "company" · THE COMPANY · VOTES: 0 · CEO); one held quartal chord for "Good question." and the zeros (27.50), the moth's flutter; the harp draws the path, tick 1 on "1. NOON" (30.31) | Neleh's reading: the box alone, the pad, the roots, a pencil tick | — |
| 31.6–38.3 | **His one wrong read** (S1.06) | the Blueprint's **break** | the stuck G–A♭ loop from the fold's curl (31.56), thinned to the box, the triangle root and the pizz root under "gerg's not on it. alyi set it up. probably just the budget."; **the TAPE-STOP** starts after his last word (37.67) and **reaches zero on the JOIN click** (38.32) | the V.O. | the tape at zero; LEVERAGE's first eighth on the same frame |
| 38.3–47.7 | **The call** (S1.07–S1.09) | **P03 LEVERAGE** (MM-08), low (−3 dB) | pizz eighths on the F pedal, the muted-808 thud (uneven), a chip tick, low grand clusters; Neleh's clockwork on her card (39.25); his calm, one felt F4 (41.44); everything but the eighths drops under Alyi's silent mouth; the 1-bit F F F on the dialog (43.14); the cluster up a semitone and Mada's spinner on his eyes (44.04); **Step Four on the arrow's three steps** (45.29 · 46.09 · 46.89) | — (no words reach us) | **DEAD STOP on the Cancel click (47.69): D6**, every stem and tail to digital zero |
| 47.7–57.6 | the buzz; **"super."** (S1.10–S1.12) | — | — | — | **no score** (marked, digital zero): the suite's air holds "super." |
| 57.6–71.0 | **That night: the third mark** (S2) | P01 (MM-08 26A) | the felt's open fifth on the carve: the re-entry (57.63); the nudge G4 before "i don't keep score."; an F3/C4 pedal under the count and TPOOL (no Mas motif on the flash); the felt back on mark 3; the settle C4 → F4; **THE REWIND** (E4, B♭3 on the 16-bit sample-chip piano) | the V.O. (the G4 alone) | cut on the whip: the board's side lands on the same frame |
| 71.0–112.2 | **The board's side, noon** (S3.00a–S3.03) | **P02 PROCEDURE, lighter** (MM-09) | B♭m(add9) and harp harmonics on the whip; **Neleh's clockwork, once, dry and quiet**, under the 11:59 wait; the pedal (cello B♭2 + viola F3, an octave up) from the connect (73.44), the whisper stepping down diatonically in Alyi's gaps; one very quiet clockwork figure before the list; **Step Four on the pen's run** (94.91); the blank's F under the post; a tick under "Any objections?"; **the Post click on a tick** (112.22) | the firing (the pedal only); the post [V] (the F alone) | — |
| 112.2–161.0 | **Rima; the all-hands; the evening** (S3.04–S3.05) | P02, lighter | the pedal and a soft tick in the gaps (no pizz figures); the hush (the pedal alone) under Alyi's answer [V]; the spiccato pulse returns with Gerg's keycaps (151.12), breathing to its downbeats under the two lines | every line; the record dry | — |
| 161.0–190.5 | **NOV 18: the hearts, the boardroom, the sincere beat** (S4.01–S4.07) | P02 · **the Door + the GPU choir** · **Step Four** | a D♭ bed and the hearts' falling harp cascade (161.0); the blue heart (one harmonic); a pizz burst on each phone buzz; the tick under Neleh, its last beat the clack; **the Door's head** (A♭4 → D♭5) through the door as Alyi's line comes, the choir ppp under it (180.69); **the sincere beat**: the solo viola's F E♭ D♭ over Step Four (185.25) | Neleh's speeches (the tick only); Alyi's line (the choir) | **a designed rest for the four dial tones** (188.65–190.45: the release, room tone) |
| 190.5–212.1 | **The split: Mario** (S4.08) | P02 · **the Lighthouse** · **the Addendum** | the Lighthouse on the first ring (190.45), thinned to half notes under the talk; the Addendum on "some thoughts" (204.49); **"no." cuts its tail** (210.42) and nothing lands after it | the offer; the eleven pages | the B♭ pedal holds under the dial tone, out as the CCTV hum pre-laps |
| 212.1–250.2 | **Sunday: the lobby camera, Ttemme, the hourglass** (S4.09–S4.11) | P02 · **the hourglass** | one quiet clockwork figure on the camera (212.42), then a soft tick; the pulse on the spotlight (227.46; no trumpet accent); a held chord under the sealed folder's long beat; **one soft pizz grain a beat, falling**, from the flip (246.88) | the badge post; the offer (a tick) | — |
| 250.2–270.1 | **Tasya's door** (S4.12–S4.13e) | **Tasya's floor**, no thirds | A♭(add9) on the slate (silent attack, 250.17), C(maj7, add9) as the door opens (251.58), one quiet Rhodes chord as he appears (253.08, no third), E(add9) on the statement [V] (258.81: a colour, not a swell), home to A♭(add9) and one quiet Rhodes chord on the sign (267.17) | "Good evening…" (the floor settles 4 dB); the statement (the held chord) | — |
| 270.1–275.1 | **"Step four?"** (S4.14–S4.15) | P02 · **Mada's spinner** | the clockwork winds down (270.12) and **hangs on one held C over the blank's F** (270.96); the spinner under his silence (272.71) | "Step four?" | **the door back** (C16: no card): the F leaves before the dark room's drone J-cuts in; the C rings on into S5.02 and becomes the major seventh of his D-flat chord |
| 275.1–306.5 | **2 AM: the home shot, the hearts, the Orb, Gerg rings** (S5.02–S5.09) | **P01**, the F-minor home, sparse · **the Water Line** · **the Build, small** | the felt alone in the dark, F(add9) with no third (275.15), and a quiet sul-tasto pad; the Water Line over Fm9 and B♭m; the felt's count, very soft (280.16); the title's quartal stack over C for the Orb's look; a quartal chord on the ring (290.81) and a quiet pad under the call; **the Build as a small soft figure**: three short F-minor passes, a felt chord every other bar | "four hundred and six…" (inside the count); "the badge was a joke." / "mostly." (one chord); Mas's lines (nothing starts) | — |
| 306.5–341.2 | **The letter; ALYI; "He did both."; the check** (S5.06–S5.08) | P01 · the quiet pad (D♭3/A♭3, sul tasto) | the pad alone from the letter; **out on the scroll's stop at ALYI** (327.10: the chime, "Alyi signed it." and "alyi voted." in the room); **back on "He did both."** (331.24: the pad alone); the felt returns softly with the check (335.63, A♭ sus2) | the quoted lines: the pad only | the rest (327.10 → 331.24) is marked, digital zero |
| 341.2–368.6 | **The Build returns; the look; the door** (S5.09-back–S5.11) | the Build, small · **a quiet, uneasy lift** | four soft Build notes after "he's typing like it's launch night."; four under "The company. Again. Just in case."; the felt (D♭ add9, no third) and a soft A♭3/E♭4 pad under "gerg never waits to be asked."; **a pass cut dead on his look up** (350.63), the pad holding; **Tasya's door**: the landlord's mediants A♭ → C → E → A♭ with no thirds, and **one B♭ held through all four** (the 9th, then the ♭7, then the ♯11 over E: the unease, then home); two quiet Rhodes chords with no third (the door, "desk") | the V.O.s; "pack?" / "compiles."; Tasya's offer (the lift) | — |
| 368.6–374.1 | **"leave it open."** (S5.12) | P01 | nothing under the line; then the settle C4 → F4 over F(add9), no third (370.42) | "leave it open." | it rings out to the avalanche's first frame |
| 374.1–388.3 | **The avalanche** (S6) | **a tense, building pulse** (straight, orchestral: no band, no swing), featured | from S6.01's first frame on one 96 grid: low spiccato eighths on varied pitches over F as the tiles land, soft timpani on the downbeats, an irregular chip tick; the violas join, and a soft straight Build (bars 2–3); **Step Four** in low strings and muted horns on Alyi's tile, **the pulse holding one beat** as he resists; thin under Neleh's line; the board's F pedal ends silently on THE QUIET VOTE; violin tremolo on Mada's semitone (C–D♭), the violas into sixteenths; **the peak**: a dark tremolo cluster over F (F C G♭ D♭ E♭), a timpani roll, two low horns | Neleh's "Has anyone read the char—" (thin, no lead) | **DEAD STOP on MADA's label** (388.25); marked silence to the violin |
| 390.2–427.2 | **Monday: Alyi's regret; the landlord becomes the room** (S7.01–S7.03) | **STRAIGHT** → **Tasya's floor**, quiet | **the Door on the senza-vibrato solo violin, under the post only** (392.71); on the first heart its G3 holds and decays (398.61); the floor pre-laps under it (410.30); **"below", "above", "around"** (419.80 · 421.07 · 422.29) as open fifths with the added 9th, no thirds, silent attacks; one quiet Rhodes chord (no third) home under the rail (426.57) | the exchange (the decay); Tasya's lines (the floor) | — |
| 427.2–468.1 | **Tuesday night: the fires, Terb, the terms** (S7.05–S7.08) | **P03 LEVERAGE** | LEVERAGE fades in under Mada (428.12); the door bang inside it (429.38); thinned to its F pedal under Terb's reading and the terms (437.5), two soft cluster shifts in the gaps | Terb's reading [V]; the terms | **DEAD STOP on "of what?"** (460.07 → the stamp): Mada's pause, both "good question"s and the long hold play in the room (marked, digital zero) |
| 468.1–480.9 | **The stamp; Gerg's post; Ttemme's hourglass** (S7.09–S7.13) | the stamp's **C pedal** · **the Build restarts** | a low C pedal bows in on the stamp (468.12); **the Build restarts on Gerg's post**, four soft notes in F minor (468.77); one pizz grain on the last grain (472.21); the pedal rests on the sand (479.13) and stays at rest | the posts (the pedal alone) | — |
| 480.9–486.4 | **The lobby sign; the old dialog** (S8.01–S8.03) | **one understated statement** (restrained irony) | at the sign (480.95), one still chord, **a little too calm**: D♭(add9) with no third on low strings and one soft horn, no swell and no motion, until the old dialog pops over it; the 1993 flat line F5 · F4 · F5 under Cancel's greying (484.24); the bonk (the SFX's E3) | — | a designed rest on the lobby's neon F: the CU "silent like the first", nothing under "okay." (486.44–490.23) |
| 490.3–523.8 | **"okay."; the vault; the memo; the chair** (S8.05–S8.10) | P01 → **P05 (diegetic)**: **the vault's F** | the felt C4 → F4 over an open fifth after "okay." (490.27); **the vault's F**: a glass pedal F3/C4 matched to the hum's fan tones (492.04); **the Ache** (G4 + D♭5, pure beating tones) for the vault's own shot, cut with the picture (492.34–494.83) | Gerg and Mas; **the memo [V]** (the pedal alone) | **the act ends on the pedal**; its release is `render/music-ringout.wav` (4.2 s) |

## Measured

Measured on `render/music.wav` (the Kokoro lock) and on each cue's engine cue sheet, after the revision. **Nothing was heard.**

- **Length:** 25,142,000 samples, 523.7917 s: the segment's 12,571 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness, the whole act:** **-20.43 LUFS-I**, -3.15 dBTP; short-term p95 -17.49, median -21.19, max -14.36 (the avalanche's peak).
- **Per cue** (each cue's master is normalised by the engine to its target; the window is its span on the act clock):

| Cue | Window (s) | Target | LUFS-I (window) | ST p95 | Engine: rule 12 · spectral F-major · knee | Balance p·o·b·c |
|---|---|---|---|---|---|---|
| S1 noon (suite → PLAN → LEVERAGE → D6) | 0.00–47.69 | -20 | -20.0 | -17.41 | OK · one window (the tape-stop) · 0 | 12·48·0·40 |
| S2 that night | 57.62–71.04 | -22 | -22.36 | -20.6 | OK · OK · 0 | 89·9·0·3 |
| S3–S4 the board's side (lighter) | 71.04–278.15 | -21 | -20.91 | -17.97 | OK · OK · 0 | 0·100·0·0 |
| S5 2 AM (sparse) | 275.08–374.08 | -21 | -20.9 | -18.94 | OK · OK · 0 | 63·33·0·4 |
| S6 the avalanche (a building pulse, featured) | 374.08–388.25 | -17 | -17.02 | -14.81 | OK · OK · 0 | 0·70·28·1 |
| S7–S8 the return, the coda | 390.21–523.79 | -20 | -19.97 | -17.45 | OK · OK · 0 | 4·92·1·3 |

- **Silence:**
  - The four marked silences are digital zero in the stem:
    - D6, the Cancel click → the carve (47.69 → 57.61);
    - ALYI → "He did both." (327.10 → 331.24);
    - Mada's label → the violin (388.25 → 392.71);
    - "of what?" → the stamp (460.07 → 468.12).
  - There's no other digital silence.
  - Every hole of 0.3 s or more under −60 dBFS is one of those four, or the designed rest in the lobby (the CU and "okay.").
  - **No music run is shorter than 2 s.** The first revised render left a 2 s hole in Gerg's call between the sparse chords; a quiet pad under the call now closes it.
- **Rule 12** (a written A-natural over an F bass, every note boundary): 0 in all six cues. **The knee:** 0 completions by pitch class, 0 whole.
- **The spectral F-major check** passes in five cues. In the noon cue (unchanged) one window (37.81–38.42 s) sits **inside the designed tape-stop**: the chip partials sweep down through A as the tape slows. Act Four v5's S1 and the v3 sample show the same window.
- **The V.O. windows** (LUFS, the bible's −24 ±2):
  - "i don't keep score.": −28.0 (as in v5).
  - 2 AM: −21.3 (the count), −24.1, −25.9 and −23.8.
- **Nothing below C3** in the night, 2 AM and avalanche cues (the dark room's drone): asserted in the build.
- **2–6 kHz band:** −14.3 dB (the avalanche's tremolo peak) to −35.9 dB (the night); the underscore limit is −15.
- **Balance:** the big-band share the engine gives the avalanche (28 %) is its two low horns and the muted horns on Step Four. There are no trumpets, trombones, saxes or kit.
- **Onsets:** every sync point is written on its frame. The ones read outside ±10 ms are soft bowed or sustained entries, the GM Rhodes, and v5's muted horns on the arrow, as in v5.
- **Hot spots to hear:**
  - S1's path (1.9 s, −17.1);
  - the board's held C into the dark room with 2 AM's first felt chord (275.1–276.8, −15.9);
  - the avalanche's peak (−14.5 over its last 4.3 s, ridden −2.5 dB, at P11's peak level).
- **Render variance:** the sampler picks its samples per note, so a held note can land 2–3 dB apart between renders.

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
| a NOON: the call, the list, the post | 71.0–112.2 | -19.4 | -17.3 |
| b Rima | 112.2–135.6 | -23.6 | -22.4 |
| c the all-hands and the evening | 135.6–161.0 | -22.5 | -20.6 |
| d NOV 18 hearts | 161.0–165.8 | -18.2 | -17.7 |
| d the boardroom: the phones, the glass | 165.8–185.2 | -22.0 | -19.8 |
| d the sincere beat | 185.2–188.7 | -17.4 | — |
| rest: the dial tones | 188.7–190.4 | -27.4 | — |
| e the rival lab (the split) | 190.4–212.1 | -21.9 | -19.6 |
| f Sunday: the lobby camera | 212.1–227.5 | -22.9 | -21.0 |
| f Ttemme, the folder, the hourglass | 227.5–250.2 | -21.3 | -18.8 |
| g the door: Tasya's floor | 250.2–270.1 | -20.0 | -18.2 |
| h Step four? (the hang) | 270.1–275.1 | -19.1 | -18.3 |
| the held C into the dark room | 275.1–276.8 | -15.9 | — |
| S5 the dark room at 2 AM: the felt, the pad, the Water Line | 275.1–280.2 | -18.0 | -17.2 |
| S5 the count (the felt's pulse under the V.O.) | 280.2–285.5 | -21.6 | -21.1 |
| S5 the Orb exchange: one held chord | 285.5–290.7 | -21.9 | -20.9 |
| S5 Gerg's call: the felt, and the Build as a small soft figure | 290.7–306.5 | -21.7 | -20.0 |
| S5 the letter: the pad only | 306.5–327.1 | -21.0 | -19.5 |
| S5 the rest: ALYI -> "He did both." | 327.1–331.2 | — | — |
| S5 "He did both.": the pad alone | 331.2–335.3 | -22.4 | -22.1 |
| S5 the check: the felt returns | 335.3–341.2 | -18.1 | -21.5 |
| S5 the Build returns, small; the V.O.; the look (the held note) | 341.2–357.2 | -21.6 | -19.6 |
| S5 the door: a quiet, uneasy lift (Ab -> C -> E -> Ab, no thirds, the held Bb) | 357.2–368.6 | -21.9 | -19.8 |
| S5 "leave it open.": home (F, no third), the ring-out to the first tile | 368.6–374.1 | -18.4 | -18.8 |
| S6 bars 1-2: the pulse builds (the tiles) | 374.1–379.1 | -21.8 | -20.8 |
| S6 bar 3: Alyi's tile, Step Four, the held beat | 379.1–382.2 | -17.4 | — |
| S6 bar 4: Neleh's window (thin) | 382.2–384.0 | -16.9 | — |
| S6 bars 5-6: Mada, the peak -> the stop | 384.0–388.2 | -14.5 | -14.5 |
| S7 a the STRAIGHT violin, then its decay | 390.2–410.3 | -19.9 | -17.0 |
| S7 b Tasya's floor, quiet (pre-lap -> below/above/around -> home, no thirds) | 410.3–427.5 | -18.1 | -17.5 |
| S7 c1 LEVERAGE (fade-in -> the bang) | 427.5–437.5 | -18.5 | -17.5 |
| S7 c1 thinned to the F pedal | 437.5–460.1 | -18.4 | -17.0 |
| S7 STOP: "of what?" -> the stamp (the room) | 460.1–468.1 | -51.4 | — |
| S7 c2 the C pedal (the posts); the Build restarts | 468.1–479.1 | -19.9 | -18.9 |
| S7 d the sand's rest | 479.1–480.9 | -36.5 | — |
| S8 e the sign: one understated chord, a little too calm | 480.9–484.2 | -18.8 | — |
| S8 e the flat line | 484.2–486.4 | -22.8 | — |
| S8 designed rest: the lobby CU, "okay." | 486.4–490.3 | -45.2 | -51.4 |
| S8 the felt settle | 490.3–492.0 | -18.9 | — |
| S8 f the vault's F (the coda) | 492.0–523.8 | -25.9 | -25.4 |

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v3-el/ep01-v3-el-act4.json` as it stood at 13:19 on 2026-09-27; re-run the one command if that lock changes):
- **Length:** 26,050,000 samples, 542.7083 s: its 13,025 frames exactly.
- **Loudness:** -20.44 LUFS-I, -3.15 dBTP; ST p95 -17.53.
- **Silence:** the four marked silences are digital zero. There's no unmarked digital silence, no undesigned hole and no fragment.
- **Checks:** rule 12 and the knee pass in every cue, and so does the spectral F-major check.
- **2 AM's V.O. windows:** −22.0, −21.1, −27.9 and −23.9.

## What a human must hear

1. **0–8 s.** The suite's pedal under the V.O., then the felt bar with its nudge on his glass nudge: air and one gesture, not a drone effect.
2. **31.6–38.3 s.** The stuck G–A♭ loop under "gerg's not on it. alyi set it up. probably just the budget.", then the tape-stop reaching zero on JOIN. The plan failing under his wrong read, not a playback fault?
3. **47.7–57.6 s.** The click takes everything. Nothing plays under "super." Then the felt's fifth on the carve.
4. **71–275 s, the board's side.** Dry and quiet, never comic? The clockwork now plays only three times; if any of those reads as a comic pizzicato, cut it (`clock16` calls in `cue_board.py`).
   - **165.8–185 s:** the phones, the Door in the glass and Neleh's sincere beat.
   - **After "no.":** only the dial tone on the pedal.
5. **270–279 s.** The hang on "Step four?", with its C carried into the dark room. Does the room's first felt chord take it in?
6. **2 AM.**
   - Warm but sparse: the felt and the pad, never happy.
   - The Build small under Gerg: his keyboard, not a tune; it stops dead on his look.
   - Out on ALYI and back on "He did both.": designed, not a hole?
   - Tasya's door: quiet and a little uneasy (the held B♭ becomes a tritone over the E), never sweet.
7. **374–388 s.** The avalanche: drive and scale without a band, building with no riser. Does the dead stop on the label land, never a glitch?
8. **481–484 s.** The one still chord at the sign: restrained and a little too calm, never a fanfare. Does the old dialog read as the undercut?
9. **492 s to the end.** The Ache on the vault's own shot: dread, not a sting. The pedal under the memo, and the hand-off into the tag.

## Where this departs from the brief, the script or v5, and why

1. **The showrunner's correction wins over the first brief and the script's sc 29–30 music calls.**
   - No SET-PIECE SWING, and no "one full band" at the avalanche: it's a straight orchestral pulse.
   - No VICTORY LAP and no brass stab at the sign: it's one still chord.
   - No walking bass under the letter: the pad only.
   - Tasya's colours carry no thirds.
2. **The board's side is lighter than v5's** (v3-plan §6, "PROCEDURE, lighter"):
   - the pedals sit an octave up, with no contrabass under the talk;
   - the viola whisper plays only under the firing, and it steps down diatonically;
   - Step Four's inner voices are strings, with no bassoon.
   The Door, the choir, the sincere beat, the Lighthouse and the Addendum are v5's.
   **Revised:** the clockwork plays only three times (the wait, before the list, the lobby camera). The gap figures, the join-chime figure and the spotlight's muted-trumpet accent are gone, and the hourglass grains are softer.
3. **C13–C16 in the music.**
   - The Door's head and the choir move into the boardroom wide under Alyi's moved line.
   - "no." cuts the Addendum's tail, and nothing lands after it: v5's "How much?" landing went with C14.
   - The floor steps to E on the one-sentence statement (C15).
   - With no card (C16) there's no REVERSAL. Mada's held C rings into the dark room instead.
4. **2 AM is the v3 sample's cue rewritten sparse and modal.** It's in the F-minor home, with add9 colours that carry no third, where the sample's C cue was in D-flat lydian and A-flat major. The music comes back on "He did both." (the script's call), not at the check.
5. **The Build restarts on Gerg's post** (468.77) with four soft notes. OST-BIBLE §2.6 says the post restarts it.
6. **The Ache sits on the vault's own shot**, because v3 has no Q\* rail. P05 makes the vault's F the score's root.
7. **The act ends on the pedal, not a fade.** The script's L-cut carries the vault's F into the tag. Its natural release past the act's last frame is `render/music-ringout.wav`, for the mix to lay at the tag's first frame if the tag's own cue doesn't carry the pedal.
8. **Silence after Mada's label runs 4.45 s** (to the violin under Alyi's post). v3's S7.01 arrives 1.5 s longer than v5's, and the script puts the violin under the post only.
9. **The avalanche's grid starts on S6.01's first frame**, and the stop follows the label wherever the lock puts it.

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
