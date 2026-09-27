# e01-v3-act2 · Ep1 v3 Act Two "the regulate-me tour" (sc 13–17) · the music stem

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md), on the mood map of [v3-plan §6](../../../../show/episodes/ep01/production/stick/v3-plan.md) ("pomp and comedy"). **Nothing here has been listened to.** Every number is measured.

| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **204.750 s, 9,828,000 samples (4,914 frames × 2000), exact.** 48 kHz / 24-bit stereo, git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **197.208 s, 9,466,000 samples, exact.** |
| `cues.json`, `cues-el.json` | The cue sheets (windows, sync points, engine QA, note QA, loudness per sub-section, silences). |
| `track.py` | The source: five cue builders and the lay-in. Shared helpers: `../e01-v3-act1/v3lib.py` (the clock, gaps, thinning, render, lay-in, measurement). |

The clock, the levels and the parametric timing work as in [Act One's README](../e01-v3-act1/README.md): 0 is the act's first frame, every sync point comes from the timeline, and each cue is the engine's underscore master, dry of dialogue.

## What plays (the cue sheet)

Kokoro-lock seconds.

| s | Cue | Mood · palette | What plays, the hits, the thinning |
|---|---|---|---|
| 0 → 74.1 | `wh_pomp` | **Pomp and comedy.** P13, NEDIB's chamber colours (MM-19 family), **B♭ major**, straight | A light chamber processional **from the first frame**: dotted-rhythm quartet figures, a pizz march bass, a harp on every second bar, soft timpani and snare taps. Its dominant is F9sus4, never F major. **The felt under both of Mas's V.O. lines** (his head inside the world's pomp). Theme fragments only in the gaps (after Sirrah's card, before the tripods); **the pan along the row (13.07) gets the whole phrase**, its held C5 on his one look at the lens. **Both freeze cards hold their chord for their beat** (no attack). **On the door (13.11) NEDIB's Fountain Pen takes over:** the march stops, the quartet turns legato, and the straight-mute trumpet plays the flat line (B♭ × 4) under "i'll turn when he finishes the sentence."; the pen hovers (held chords) under his two lines; **its leap and pen-stroke turn sign the print (13.14)**, and the final B♭ is held under "it's a good photo." and rung out by the bridge. |
| 74.1 → 85.1 | — | **The bridge: a hush** | No score (script sc 14): the phone's clip, the water, the plink. Designed and marked. |
| 85.1 → 130.3 | `senate_a` | **Procedural comedy.** A lighter Under Oath (P02 court, MM-20 family): **D♭ major over the court's F** | A bowed F pedal under the clone's real opening line; then a deadpan pizzicato two-feel (low strings, a dry bassoon on the roots), brushed snare, a viola pad, and a straight-mute aside only in a gap. **A low-string pedal only under every real line** (the chairman's card, "…tasks, not jobs.", "i love my current job."). Sucram's card holds its beat. **It stops on the wallet (15.12)**, 3 ms. |
| 130.3 → 142.1 | — | designed stop | The wallet, the moth, the gasp, "Health insurance.", the stamps, "…i have no equity in nopeai.": the room's air only (script: "It stops once, on the wallet"). |
| 142.1 → 155.8 | `senate_b` | the same, back **on a new phrase after his line** | The two-feel under the senator's question; **PLEASE REGULATE ME** gets the mute's one rising line, which ends before Sucram's stamp. On the back of the sheet the harmony is left hanging (F7sus♭9) under his stare, and the tour's first stamp cuts it. |
| 155.8 → 163.8 | `run_roof` | **The run.** P07 THE RUN (MM-03 family), **A♭ major**, a straight 16th engine | In on the stamp's thunk: the Build's chip arpeggio, brushes, bass. **One layer and one knee stab per stamp**: the title's quartal C F B♭ E♭ on brass (+ a chip double) over a bass that moves A♭ → D♭ → B♭ → E♭ with the stamps. It thins under the quote strip and his post (the record plays dry: the layer holds). The engine stops on the cut. |
| 163.8 → 180.9 | `run_roof` | **Grand, then uneasy** | The last stab rings into a held pad: A♭maj9 with horns and a harp roll, **grand**, under the statement (dry, pad only); then **uneasy** at the sheet: D♭maj9(♯11) after "It doesn't say what it costs.", B♭m9 after "A short one.", and **C7sus(♭9) on "we'll read it."** (the knife), held into the register. |
| 180.5 → 195.1 | `upsell` | **The caper, the sale.** P06 THE JOB, MM-05's Upsell, **F dorian**, double-time swing | In on the register's roll: walking eighths, the chip GPU clock (12.5 %, nothing above E♭6), grand comping; Nesnej's card holds one chord for its beat; **the Upsell's cells, each a step higher** (vibes + straight mute), soft under Mario and **dry under Nesnej's real line**. **The close** (C G F, with the bari/trombone F–C fifth on the cut to his finger) **leaves the downbeat for the KA-CHING** (a timeline sound): the band rests in its beat. Phrase 3 climbs on, featured (+3.5 dB), and at the crack in the sky (17.11) **it drops out mid-climb** (3 ms), before its target lands. |
| 195.1 → 204.75 | — | **The act-out** | No score: the register's bell alone (a timeline sound), decaying, with the wind. Designed. |

**Variety across the act:** B♭-major pomp → a hush → deadpan D♭ procedure → an A♭ run → a grand pad that turns uneasy → an F-dorian caper → the bell alone.

## Measured

| Cue | LUFS-I | ST p95 | True peak | Engine QA |
|---|---|---|---|---|
| `wh_pomp` | −20.0 (the door and the print −18.7) | −17.8 | −3.2 | F-major OK, written third 0, knee 0 |
| `senate_a` | −21.0 (the pedal under the clone −24.3) | −18.5 | −3.2 | OK |
| `senate_b` | −21.0 | −19.4 | −4.3 | OK |
| `run_roof` | −19.0 (the RUN −17.4, p95 −16.3: featured; the pad −19 → −21.7) | −16.4 | −3.2 | OK |
| `upsell` | −19.0 (before the slot −21.3; phrase 3 −16.6: featured) | −16.6 | −4.3 | OK |
| **The whole stem** | **−20.0** | −17.4 | −3.15 | |

EL: the same within 0.3 LU per cue (whole −20.0 LUFS-I).

- **Length:** exact on both locks.
- **Digital silence:** only the three marked windows (the bridge 11.0 s; the wallet 11.8 s; the act-out 9.7 s). No unmarked digital silence; no hole below −60 dBFS for 0.3 s or more outside them; no fragment under 2 s.
- **OST checks (every cue, both locks):** written A♮ over an F bass 0 (the Fountain Pen's turn A4 sits over a B♭ bass); sieved F-major OK; the knee whole 0; knee completion 0.
- **Engine warnings left:** `run_roof` and `upsell` short-term p95 (−16.4, −16.6) over the −17 underscore guide: those are the RUN and the Upsell's phrase 3, the act's featured set-pieces (≈ −16 allowed). Marker misses of 15–60 ms are soft entries (the muted trumpet's first note on the door, bowed pedals).
- Render 1's `senate_b` read −14.6 dB in the 2–6 kHz band (the limit is −15); the Senate's straight mute now has a deeper 3 kHz dip and a high shelf.

## The ElevenLabs variant

`render/music-el.wav` comes from `show/reel/ep01-v3-el/ep01-v3-el-act2.json` with the same code. That lock is 7.5 s shorter (the White House −2.9 s, the Senate −4.0 s, the rooftop −0.5 s); every cue follows it, and it measures clean on every check above.

## Re-run

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --render [--el]         # all five cues (~45 s)
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --render upsell [--el]  # only some
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --assemble [--el]    # light: re-lay, measure, cues.json
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act2/track.py --dry [--el]         # light: scores + note QA
```

Cue names: `wh senate_a senate_b run_roof upsell`.

## Decide (one owner per sound)

**The timeline has four `synth:stab` sounds on the tour's stamps (16.01)**, the v2 bed's temp "knee stab". The score now plays the knee stab itself (brass + chip, tuned to each stamp's chord), which is the bible's split (P07: "a stab on each item" is the score's). **The sound stem should drop `synth:stab`**, or the mix mutes one of the two. If both play, they land on the same frames, and the v2 stab's A♭maj9 is consonant with the score's first stab but not a match for the later three. The KA-CHING and the register's bell (`ka_ching`, `synth:bell`) stay SFX, as the bible says.

## For an ear, in order

1. The pomp under the talk: light and straight, never Sousa or an anthem.
2. 13.07 (the pan): the theme's held note on his look: wry, not a button.
3. 13.11 (the door): the flat line on the straight mute under his V.O.: the president arriving and Mas not turning.
4. 13.14 (the print): the leap and the turn sign the photo, and the B♭ rings out into the hush.
5. The Senate: deadpan and light, never *Law & Order*; the pedal-only stretches under the real lines; the wallet's stop, and the re-entry after "…no equity".
6. The tour: momentum without "upbeat corporate"; one stab per stamp, never a rimshot.
7. The rooftop pad: grand, then uneasy on "we'll read it."
8. The Upsell's close into the KA-CHING: does the sale close on the bell? The drop-out at the crack: the climb that never lands.
