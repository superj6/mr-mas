# MR. MAS: vocal pass (key: `vocals`)

> **Every voice here is a synthetic stock voice. Nothing is cloned.** The voices come from Kokoro-82M's
> built-in voicepacks (Apache-2.0), one designed blend of those stock voices, and WORLD-vocoder
> re-synthesis of them. No recording of any real person was used as a reference, input or target, and the
> parody characters get no attempt at a real person's accent or cadence. These are good enough for an
> animatic and temp mix. **For Mas's cold-open line, a human performer will very likely beat every take here.**

All files are 48 kHz / 24-bit WAV masters, each with a 256 kbps MP3 next to it. Every file is levelled to
**-14 LUFS-I with true peak at or below -1 dBTP**, except the audition reel (-16 LUFS). Each file is levelled on
its own, so set the relative balance in the mix. Frame numbers use the intro clock: 24 fps, 96 BPM, 15 frames
per beat, f0 = 0.000 s.

## Quick picks: start here

| Need | File | Why |
|---|---|---|
| Hear everything once | `reel/vocals_audition_reel.mp3` | 109 s: every main variant in the order of this README, 0.7 s apart |
| Hear it in context | `intro-layer/_preview_vocals-B_over_theme-V3-pixelswing.mp3` (plus V1, V2, V4) | Vocals over the theme agent's current renders, with a vocal colour matched to each theme |
| Cold-open VO | `vo/mas_coldopen_michael.wav` (then `_puck`) | Warmest of the male stock voices; 'side' stays level (114–126 Hz); 0.62 s pause |
| Title-hit vocal | `harmony/title-pad_HYBRID_jazz+chip_F9sus.wav` | Jazz quartal group with the 8-bit voice underneath: the "in-between" colour |
| Name-card stab | `harmony/stab_doo-bah_HYBRID_C.wav` on NOLE (f420) only | Use one stab, on the biggest hit. Stabs on every card turn it into big band |
| ALYI chant | `chant/feel-the-agi_stone-room_from-f280.wav` | Small group in a stone room, with the shout tuned into the D♭ hit |

The picks above come from measurements (timing, pitch contour, spectral peaks, click scans) and the
design brief. Nobody has listened to them yet, so audition the reel before locking anything.

## Colour variations (matched to the four theme directions)

The score is meant to sit between piano, orchestral and big band, leaning jazz, with the 8-bit hook as the
through-line. So the sung material comes in five colours. Stay in one colour per cue and mix colours across
the soundtrack.

| Colour | Title pad | Stab | Scat hook | Sits best with |
|---|---|---|---|---|
| **Piano / intimate**: 4 voices, "ooh→mm", soft bloom | `title-pad_piano-intimate_ooh_Fsus` | (use the jazz stab at -6 dB) | — | theme V4 *pianopixels* |
| **Orchestral**: chamber choir, 3 per part, open fifths, hall | `title-pad_orchestral-choir_open-fifth_F` | — | — | theme V2 *orchestralnoir* |
| **Jazz / big band**: close-harmony group, plate, straight tone | `title-pad_jazz-quartal_aah_F9sus` | `stab_doo-bah_jazz-group_{F,Db,Bb,C,C7}` | `scat_knee-hook_jazz-group_Fm` | theme V3 *pixelswing* |
| **8-bit**: vowel-vocoded pulse "voice"; chords as a 24 Hz arpeggio (one chord tone per film frame); 3-frame ping-pong echo | `title-pad_8bit-chip-voice_arp_F9sus` | `stab_doo-bah_8bit-chip_{…}` | `scat_knee-hook_8bit-chip_Fm` | theme V1 *chipchamber* |
| **HYBRID** (recommended in-between): the jazz or orchestral group with the chip voice tucked 11–16 dB under it | `title-pad_HYBRID_jazz+chip_F9sus`, `title-pad_HYBRID_orch+jazz+chip_F` | `stab_doo-bah_HYBRID_{…}` | `scat_knee-hook_HYBRID_Fm` | any; the default |

A suggested spread that stays off wall-to-wall big band:
- The cold open stays dry and close, beside the felt piano.
- The chant stays a sound-design moment, with no jazz.
- One HYBRID stab goes on NOLE's C hit only.
- The HYBRID pad goes on the title.
- The jazz scat is kept for later-episode buttons or the skyline, where the 8-bit hook already lives.

## 1. Cold-open VO: Mas, "near the singularity; unclear which side." (`vo/`)

| File | Voice | Notes |
|---|---|---|
| `mas_coldopen_michael` | Kokoro `am_michael` (stock) | **Primary.** Warm and low-key |
| `mas_coldopen_puck` | Kokoro `am_puck` (stock) | Lighter and younger; the most level 'side' (113–119 Hz) |
| `mas_coldopen_echo` | Kokoro `am_echo` (stock) | Deeper and darker; a little more "announcer" |
| `mas_coldopen_liam` | Kokoro `am_liam` (stock) | Brighter and a little more earnest; shortest pause (0.57 s) |
| `mas_coldopen_designed` | **Designed blend**: 0.5 `am_michael` + 0.3 `am_puck` + 0.2 `am_echo` (voice-embedding average, not a clone) | A "Mas" timbre that is none of the stock voices exactly |
| `placed/mas_coldopen_<take>_at-f0` | the same takes | 5.0 s files with the VO already at f24. Drop them at f0 |

**Sync.** File t=0 is the VO start at **f24**. Measured speech and word frames (all takes, ±1 frame):
- "near the singularity;" runs f24–f55…57.
- The pause is 0.57–0.65 s, from about f57 to f72. It is empty: the D♭ piano note goes in it.
- "unclear" starts at **f72**.
- "which" runs f81–86.
- **"side" starts at f86** and its vowel hangs to about f94–95.
- The release and room tail are gone by about f98 (3.1 s after VO in).

The per-word frames for every take are in `vo/mas_coldopen_word_timings.json`, a starting point for the
hand-keyed dot slide and lip-sync JSON.

**"side" left hanging.** Across the word, the F0 moves only −0.5 to −1.2 semitones. Raw Kokoro fell 5–10 st
into creak.

**How it was made**
1. Kokoro renders the whole line, so the rhythm comes from the model and the words are not stitched together.
   Phrase 1 and phrase 2 come from two renders at different model speeds (0.75–0.83 and 1.03–1.15), so each
   phrase is already near its window. The splice sits in the semicolon silence.
2. Phrase 2 is rendered as "…unclear which side, **and then**" and cut after "side". The continuation gives
   "side" a non-final contour with no fry. Then WORLD re-synthesis levels the F0 of "side" to the phrase's own
   pitch, with 85 % strength and a −0.2 st settle. The crossfade into the re-synthesized part is 15 ms, inside
   the unvoiced /s/.
3. Rubber Band (pedalboard `time_stretch`) fits each phrase to its frames with piecewise-constant stretch:
   phrase 1 0.91–1.04×, "unclear which" 0.88–0.97×, the "side" vowel 0.97–1.27×.
4. For close-mic softness, a WORLD whisper of the same take (aperiodic re-synthesis, 1.4–9 kHz band) goes
   underneath at −24 dB as breath.
5. The processing chain, in order:
   - HPF at 90 Hz
   - low shelf +1.5 dB at 170 Hz (proximity)
   - −2 dB at 3.2 kHz and −1.5 dB at 6.5 kHz
   - high shelf −2.5 dB at 8 kHz (soft, dark)
   - 2:1 compression (−22 dB threshold, 8/140 ms)
   - tanh saturation at 22 % mix
   - a 0.30 s synthetic "dark room" IR at 16 % wet
   - master to −14 LUFS / −1 dBTP

## 2. Short lines (`vo/`)

| File | Voice | Read |
|---|---|---|
| `nole_came-up-with-the-name_take1_fenrir` | `am_fenrir` (stock) | Stress on **"I"** (misaki `[I](+2)`); +0.8 st, formants +0.35 st, presence +2.5 dB, 3:1 comp, saturation |
| `nole_came-up-with-the-name_take2_fenrir` | `am_fenrir` (stock) | Faster and more exasperated ("!!"), +2 st, more drive |
| `nole_came-up-with-the-name_alt_adam` | `am_adam` (stock) | Alternate timbre. `am_adam` is one of Kokoro's weaker voices, so treat this take as a sketch |
| `mas_super_take1_<voice>` | the 5 Mas voices above | Dead flat and quick: WORLD pulls the F0 90 % of the way to its own median, with a −0.6 st settle. The pitch spans 1.1–1.9 st (p10–p90), where normal speech spans about 6–10 |
| `mas_super_take2_<voice>` | the 5 Mas voices | Flat but more human: 75 % pull, a hair slower, a −1 st final settle (spans 2.6–4.2 st) |
| `mas_super_take1_michael_videocall` | `am_michael` | Take 1 heard through a laptop call: 220 Hz–6.8 kHz band, 4:1 comp, a light MP3 codec pass (THE BLIP: his tile drops out, still unmuted) |

For the **tiny smile** in "super.", the formants are raised by about 3 % (+0.55 st) at unchanged pitch, which
is the acoustic signature of lip-spreading. The rest of the chain is the same as the cold open (with a dark
room).

## 3. "FEEL THE AGI" gang chant (`chant/`)

File t=0 is **f280** (11.667 s). That gives 5 frames of pre-roll for the eerie reverse swell. Measured onsets:
- "FEEL" f284.7 (target f285)
- "THE" f292.8 (target f292)
- "A" f300.3 (target f300, the D♭ hit)
- "G" at f303, which is smeared inside the group attack
- "I" at about f308, with the target at f307

| File | What |
|---|---|
| `feel-the-agi_stone-room_from-f280` | **Main.** 6-voice group in a 1.5 s stone room with hard early reflections |
| `feel-the-agi_cathedral_from-f280` | Bigger and eerier: a 3.6 s cathedral with a long tail (4.6 s file). Matches the server-cathedral picture |
| `feel-the-agi_dry_from-f280` | Near-dry (a vocal-booth IR) for the mixer's own reverb |
| `feel-the-agi_stone-room_STEM-whisper_from-f280`, `…STEM-shout…` | The main version split into whisper and shout stems (each levelled on its own) |
| `feel-the-agi_stone-room_untuned-alt_from-f280` | The shout is not tuned to the key: rougher and more "crowd" |

**The group.** Six stock voices, each with its own pan position:

| Voice | Accent |
|---|---|
| `am_michael` | American |
| `am_fenrir` | American |
| `bm_george` | British |
| `af_nicole` | American |
| `af_sarah` | American |
| `bf_emma` | British |

**Whisper.** Kokoro speaks "feel." and "thee." and WORLD re-synthesizes each word with no periodic
excitation, so each whisper is a real whisper of the same words:
- the timing is spread ±28 ms, like a real group
- two voices get a darker ghost for unease: dropped 7 semitones with the envelope moving too, at −7 dB
- a reversed room tail of the first whisper leads into "feel"

**Shout.** Each letter is its own word, "Ay!", "Gee!" and "Eye!":
- each singer is doubled
- each voice gets a constant pitch lift into shouting range, tuned loosely to the D♭ chord (men F3/A♭3, women F4/A♭4)
- formants go up 0.6–1.0 st
- EQ: −2.5 dB low shelf, +5 dB at 2.4 kHz, +2 dB at 4.2 kHz
- 5:1 fast compression, then heavy tanh drive
- the group spread is ±12 ms
- vowel onsets are aligned to the frames

## 4. Wordless close harmony (`harmony/`)

**Title-hit pads.** File t=0 is **f630**. The files are 4.0 s: the note blooms, holds, releases from about
1.6–1.9 s into the reverb, and the tail is faded out by 3.95 s (the intro ends at +3.75 s).

| Voicing | Notes | Third? |
|---|---|---|
| "So What" quartal stack over F: F9sus4 | F2 · C3 F3 B♭3 E♭4 · G4 | **none**, so the title's "no third" rule holds |
| Open fifth | F2 C3 F3 C4 F4 C5 | exactly the f630 F–C chord |
| Piano: F sus/add9 | F3 C4 G4 B♭4 | none |

- **Jazz:** 12 singers, 2 per part. "ah" morphs toward "oh". Sforzando-piano attack then a swell, straight tone
  with 11-cent vibrato arriving late, plate reverb.
- **Orchestral:** 18 singers, 3 per part. "ah→oh", 20-cent vibrato, hall reverb.
- **Piano:** 4 singers. "ooh→mm", slow 280 ms bloom, breathy.
- **8-bit:** two pulse "voices" (25 % and 12.5 % duty) arpeggiate the quartal stack at 24 Hz over a held
  50 %-duty chip bass on F2. All three are vowel-shaped by the "ah" envelope and bit-reduced to 8 bits.

**Name-card "doo-BAH" stabs.**
- **File t=0 is the hit minus 10 frames.** "doo" is a swung-eighth pickup at +5 frames, on the approach chord a
  half step below. "BAH" lands on the hit at +10 frames and falls away by −70 cents.
- Where to place them:
  - GERG `_F` (Fm9) at f230
  - ALYI `_Db` (D♭maj9) at f290. It collides with the chant, so skip it when the chant is used
  - MARIO `_Bb` (B♭m9) at f350
  - NOLE `_C` (C major triad, E natural, no 7th) at f410. The triad is safe over V4's Cmaj7 and V1/V3's
    altered C. `_C7` is a bluesier alternative that clashes with a Cmaj7 theme.

**Scat reading of the hook (bonus).**
- **File t=0 is the downbeat minus 6 frames.** One bar of the knee motif F F F F G A♭ C F in swung eighths
  (10+5 frames), sung "doo dn doo dn dee dah bee DAH".
- The voices:
  - lead
  - a parallel-fourth voice under it (the chiptune-style interval)
  - a minor **line cliché** (F–E–E♭–D) in the tenor
  - a walking bass
- It lands on the open F–C fifth (no third).

**How the singing works** (`scripts/sing.py`):
1. A Kokoro stock voice speaks the syllable ("ah.", "doo.", "bah." and so on).
2. WORLD analyses it: harvest F0, CheapTrick envelope, D4C aperiodicity.
3. The note is re-sung at the target pitch and length:
   - the onset consonant frames stay as spoken
   - the vowel is sustained by a slow random walk through its own steady frames, so no frozen loop
   - a new F0 line: a scoop into the note, delayed vibrato, 1/f jitter and drift, optional falls
   - small per-singer formant offsets (±3 %)
   - vowel morphs by interpolating the envelopes
4. The singers are placed with small timing, detune and pan spreads.
5. On the vocal bus:
   - HPF, a gentle 2.8/4.8 kHz dip, air shelf
   - 2:1 compression, light saturation
   - a synthetic plate, hall or room IR

The 8-bit voice is a band-limited (polyBLEP) pulse wave, filtered frame by frame by the same WORLD vowel
envelope, then reduced to 8 bits.

Measured tuning of the pads: spectral peaks fall within ±12 cents of the chord tones, apart from harmonics and
vibrato. No clicks were found in the human-voice files. The chip files show the pulse's steep edges, which is
their timbre and not a defect.

## 5. Intro layers and previews (`intro-layer/`, `reel/`)

- `intro-layer/intro_vocals_A_story_at-f0`: 30 s with the VO at f24, the chant at f280 and the HYBRID pad at f630. Drop it at f0.
- `intro-layer/intro_vocals_B_story+card-stabs_at-f0`: the same, plus HYBRID stabs on the F, B♭ and C cards (f240, f360, f420).
- `intro-layer/_preview_vocals-{A,B}_over_theme-V{1..4}-*`: **snapshots** over the theme agent's renders as they stood on 2026-09-25. The theme files belong to that agent; rerun `scripts/layout.py` after they change. Each theme gets its matched colour (see the colour table).
- `reel/vocals_audition_reel`: everything, in README order.

## Voices, models and licences

| Component | Use | Licence |
|---|---|---|
| **Kokoro-82M** v1.0 (`hexgrad/Kokoro-82M`) weights and stock voicepacks | All speech and syllable sources | **Apache-2.0**. Per its model card, trained on permissively licensed, public-domain and synthetic audio |
| `kokoro` 0.9.4 and `misaki` 0.9.4 (G2P) | Inference and phonemes | Apache-2.0 |
| espeak-ng (via `espeakng-loader` / `phonemizer-fork`) | Fallback phonemizer | GPL-3.0 (a tool; the audio it helps make is not a derivative) |
| spaCy 3.8 and `en_core_web_sm` 3.8 | Tokenizing for misaki | MIT |
| WORLD vocoder via `pyworld` 0.3.5 | Whisper, re-pitching and singing re-synthesis | Modified BSD / MIT |
| `pedalboard` 0.9.25 (includes the Rubber Band library) | Time-stretch, pitch, EQ and dynamics | GPL-3.0 (a tool; output unencumbered) |
| numpy, scipy, librosa 1.0, pyloudnorm, soxr, torch 2.14 CPU | DSP, analysis, loudness, resampling | BSD / ISC / MIT / LGPL-2.1 / BSD-3 |
| ffmpeg + libmp3lame (the Remotion bundle) | MP3 encode | LGPL |

**Stock voices used:**

| Where | Voices |
|---|---|
| Mas takes | `am_michael`, `am_puck`, `am_echo`, `am_liam` |
| Nole | `am_fenrir`, `am_adam` |
| Chant | `am_michael`, `am_fenrir`, `bm_george`, `af_nicole`, `af_sarah`, `bf_emma` |
| Singers | `af_heart`, `af_bella`, `bf_emma`, `af_nicole`, `af_sarah`, `bf_isabella`, `am_puck`, `am_michael`, `bm_fable`, `am_fenrir`, `bm_george`, `am_liam`, `am_onyx`, `am_echo`, `bm_lewis` |

The **designed** Mas voice is a weighted average of three stock embeddings. No reference audio of anyone was
used.

No SoundFonts or samples were used, and nothing was added to `audio/samples/`. The only download is the Kokoro
model (about 330 MB, in `~/.cache/huggingface`), plus pip packages in `audio/.venv-vocals`.

## Re-render

```bash
cd /home/jgon/project/art/mrmas/audio/intro/vocals
PY=../.venv-vocals/bin/python
$PY scripts/coldopen.py          # 5 cold-open takes + placed files + word_timings.json
$PY scripts/lines.py             # Nole x3, super. x11
$PY scripts/chant.py             # chant variants + stems
$PY scripts/harmony.py pads stabs scat   # or: stabs:C,C7
$PY scripts/layout.py            # intro layers, reel, theme previews
$PY scripts/remaster.py          # idempotent -14 LUFS / -1 dBTP check and fix
$PY scripts/check_vo.py; $PY scripts/check_harmony.py harmony/*.wav; $PY scripts/qa_clicks.py */*.wav
```

`_work/tts_cache/` (78 MB) caches the Kokoro renders so re-renders are fast. It is safe to delete.

## Known weaknesses and what would beat them

- **The Mas line lacks acting.** Kokoro's male voices are its weakest, and they carry a faint vocoder sheen that
  processing hides but does not remove. The line needs intention: an earnest non-performance with the
  semicolon breath taken on mic. A **human voice actor** (a closet and a good USB mic is fine) would likely
  beat every take. So would a text-designed voice (ElevenLabs Voice Design or similar, no cloning) used as a
  scratch.
- **The shout is not a real shout.** TTS has no vocal effort, so the "shout" is pitch, EQ and drive. 4–6
  friends recorded in a stairwell (the plan in `final.md`) would be far more convincing. The whisper is the
  stronger half.
- **The sung material is synthesis.** WORLD re-synthesis of spoken syllables tunes accurately and blends well in
  a group with reverb, but a solo line would sound synthetic. The scat's consonants are the least natural part.
  A **session vocal quartet** (one hour, reading the voicings in this README) or a licensed choir/vocal-group
  library would give a clear jump in quality.
- **Loudness.** Every file is levelled to −14 LUFS on its own, so the stabs and pads will need −6 to −12 dB in
  the mix.
