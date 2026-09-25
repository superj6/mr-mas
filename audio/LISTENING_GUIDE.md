# MR. MAS intro: listening guide (audio sketch, 2026-09-25)

Four 30.000 s mixes of the full intro. Each has the score, every SFX on its frame, Mas's cold-open line, the "feel the AGI" chant and a choir under the title hit. Nobody has listened to them yet. They were balanced by measurement (loudness, speech-band SNR, spectrograms), so they need your ears.

**Files** (`audio/mix/`): `intro-sketch-V1…V4.wav` are the masters (48 kHz / 24-bit). The `.mp3` files are 256 kbps previews. Use the WAVs for picture sync, because some MP3 players add about 23 ms of encoder delay.

All four measure **−14.0 LUFS integrated and −1.2 dBTP**. The MP3s peak at −1.0 dBTP or lower.

## The four files

| File | Score | Choir under the title | SFX colour | Listen for |
|---|---|---|---|---|
| **V1 Chip Chamber Jazz** (start here) | Felt piano, chamber strings, chip lead; brass only on the four cards and the roll call | Hybrid: orchestral + jazz group, 8-bit voice underneath | Default (hybrid) | Whether this is the right middle between piano, orchestra and big band. Is the chip lead clearly on top in the roll call? |
| **V2 Orchestral Noir** | Strings, horns, timpani, dark grand; the chip is a heartbeat | Chamber choir, open fifth | Default, plus the orchestral stamp; chant in the **cathedral** room | Most cinematic. Is there enough 8-bit in it? Does the long chant tail wash into the vault shot? The skyline is the quietest of the four |
| **V3 Pixel Swing** | Piano trio swing, chip lead, sax/horn stabs | Jazz quartal group + chip voice | Jazz plucks, vibes ka-ching and ding | The most jazz. Treat it as the upper limit: if this already feels like "big band all the way through", stay with V1 |
| **V4 Piano & Pixels** | Felt piano + chip, no brass at all | Intimate 4-voice "ooh" | 8-bit tower plucks | The quiet-episode alternative. Does it sound muffled? It has the loudest chant relative to the music (about 3.7 dB of limiting at 0:12.5) |

## Where to listen (the same in every file)

| Time | Frame | Moment |
|---|---|---|
| 0:01.0–4.0 | f24–98 | **VO** "near the singularity; unclear which side." Check that every word is clear, that the D♭ piano note speaks in the semicolon pause (0:02.5), and that "side" hangs rather than falls |
| 0:04.0–5.0 | f97–119 | Orb servo, scan "shhk", Post click, knee run |
| 0:05.0 | f120 | Drop into 1993 (1-bit). Wrong-note bonk at 0:06.25, OK click at 0:06.9 |
| 0:07.0–10.0 | f168–239 | Render-front sweep, tape start, collar pops, keyboard roll into the dinner |
| 0:10.0 / 12.5 / 15.0 / 17.5 | f240/300/360/420 | The four card hits (Fm, D♭, B♭m, C). Listen for the camera shutter on each freeze |
| 0:11.9–12.8 | f285–307 | Whispered "FEEL… THE…", then the shouted **A-G-I!** on the D♭ hit |
| 0:14.4–15.0 | f345–360 | Klaxon, cut dead on the MARIO hit |
| 0:18.1 | f435 | Stamp, tuned to C |
| **0:20.0–22.5** | **f480–539** | **New: THE PLAYERS roll call** (see below) |
| 0:22.5–26.2 | f540–629 | Skyline plucks F F F F G A♭ C with tower pops, siren, ka-ching, plop |
| 0:26.25 | f630 | Title hit (open fifth, no third) with the choir blooming under it |
| 0:28.75 / 29.4 | f690 / f705 | Pull-back whoosh; post-notification ding; silent by f719 so the loop is clean |

**Balance** is about the same in all four:

| Section | Loudness |
|---|---|
| Cold open, with the VO | about −17 LUFS |
| 1993 drop | about −19 LUFS |
| Dinner | about −13.5 LUFS |
| Roll call | about −13.3 LUFS |
| Title | about −11 LUFS (V4 about −12) |

The VO sits at −16.5 LUFS during the line in all four files. On every word it is at least 10 dB above the bed in the speech band (1–4 kHz). The weakest word is "unclear" in V4.

## What is different from the theme and SFX files you may have heard

- **Bar 9 follows brief v2.1, not the old "music fired / rehired" beat.** The theme and SFX agents rendered before v2.1, so the mix pass re-rendered the theme. It used their score and engine unchanged, with only bar 9 replaced.
  - **Portraits 1–7:** one stab per eighth note, playing the knee F F F F G A♭ C. The chip lead doubles each stab. Under them the bass goes F · · · D♭ B♭ C, a quiet recap of the dinner card roots.
  - **Portrait 8** (the unnamed GLYPH cursor) is deliberately almost empty: a lone chip F6 and a glyph blink.
  - **Orchestration of the roll call by variation:**
    - V1: small brass section
    - V2: horns and trombones
    - V3: big band with saxes
    - V4: felt piano, no brass
  - **This bar was written by the mix pass, not the composer, so it needs sign-off.** Music-only versions are in `mix/music/theme-*-rollcall.{wav,mp3}`, with MIDI in `mix/music/midi/`.
- **SFX removed with the old bar 9:**
  - shockwave
  - odometer
  - fired piano
  - room tone
  - glyph dissolve
  - hourglass
  - heart glissando

  The neon buzz now cuts on the f480 hard cut.
- **Vocal pieces left out on purpose:**
  - The "doo-BAH" card stabs are out. Their C-chord G clashes with the A♭ in the score's altered C hit, and the stab is the corniest-sounding piece on the board.
  - The scat is out.
  - The Nole and "super." lines are out, because they aren't in the intro.
- **Mix moves:**
  - The VO is de-essed.
  - Music and beds duck about 3 dB under the VO and get a 5 dB dip in the speech band while he talks.
  - The music ducks 4 dB under the whisper.
  - SFX low end is filtered off the card hits so the score's timpani and 808 carry the boom.
  - Sounds that double something the score already plays sit 3–6 dB lower: reverse swells, tower plucks, the ding, and the bonk.

## What is placeholder

- **Mas's VO** is Kokoro-82M stock voice `am_michael` (Apache-2.0). The timing is right, but there is no acting in it. **No real voice was cloned or imitated.**
- **The chant** is TTS: a real whisper, but a "shout" built from pitch and distortion.
- **The choir** is TTS syllables re-sung with a vocoder. It works as a pad under the hit, but would not hold up as a solo.
- **The score** uses free sample libraries and code-generated reverbs. The roll-call bar is a mix-pass placeholder arrangement.
- **Most foley is synthesized:** paper, flame, rocket, debris, keyboard, tape.
- **Missing:** the 2014 crowd "ohh" (the brief plans it as a recording; nobody made one).
- **Taste risks.** These are tucked low and should be the first to cut if anything feels jokey:
  - the 1993 bonk
  - klaxon
  - siren whoop
  - ka-ching
  - water plop
  - tower pops

## What would upgrade it most (in order)

1. **A human voice actor for Mas.** Even a closet and a good USB mic, following the delivery notes in final.md §3, would very likely beat every synthetic take. For a better scratch, use a text-designed voice such as ElevenLabs Voice Design: description only, never cloning, and check its TV/film terms.
2. **A composer or arranger pass with live players, working from the MIDI:**
   - felt-upright pianist
   - upright bass
   - brushes drummer
   - four horns plus a harmon-mute trumpet for the card stabs and the roll call

   This is the biggest jump in realism. The current weak spots are the sampled brass sections and the SoundFont bass and brushes.
3. **Real voices for the group moments:**
   - 4–6 people in a stairwell for "feel the AGI"
   - a one-hour session vocal quartet for the title pad (the voicings are in `vocals/README.md`)
4. **Better instruments in the same code pipeline.** pedalboard can host VST3 instruments.
   - Free: Spitfire LABS, Pianobook felt pianos, VSCO 2 Pro.
   - Paid: Pianoteq, a chamber-strings library, a session-horns library, a jazz brushes kit, an upright-bass library.
5. **Recorded foley.** A half-day session, or a licensed library (Pro Sound Effects, BOOM, Soundly), for:
   - mechanical keyboard
   - cassette deck
   - SLR shutter
   - rubber stamp
   - paper
   - tableware
   - crowd "ohh"
6. **Real rooms and a real mixer.** Swap the generated reverbs for real impulse responses (OpenAIR, CC BY), and get a final pass by a mix engineer on calibrated monitors.
7. **Optional: an ElevenLabs Music temp** from the composition plan in final.md §4, for comparison only. It is not copyrightable, and the terms need checking.

## Rebuild

```bash
cd /home/jgon/project/art/mrmas/audio/mix
../.venv-mix/bin/python scripts/render_music.py V1 V2 V3 V4   # about 80 s each: roll-call re-render of the theme
../.venv-mix/bin/python scripts/mix.py V1 V2 V3 V4            # about 20 s each: mix, master, timeline.json, QA
../.venv-mix/bin/python scripts/qa_plots.py V1 V2 V3 V4       # QA sheets in mix/qa/
```

`mix/timeline.json` lists every event per variation: frame, start frame, time, file, gain, fades, cuts, filters and SFX flavour. It also records the ducking automation and the master chain, so the Remotion edit can rebuild the balance.

## Credits and licences

- Salamander Grand Piano by Alexander Holm (**CC BY 3.0: credit required**).
- VS Chamber Orchestra 2 CE and VCSL by Versilian Studios (CC0).
- Upright Piano by Simon Dalzell / Ivy Audio.
- Upright Piano KW by FreePats.
- GeneralUser GS by S. Christian Collins.
- Voices: Kokoro-82M stock voicepacks (Apache-2.0).

No new downloads were made for the mix.
