# MR. MAS: intro VO and vocal stems (key: `intro-vox`)

The dialogue and vocal stems for the final 30.000 s Ep1 opening, cut to **SCRIPT v2.1** (`show/intro/SCRIPT.md`,
§3.2, §3.5b, §3.9–3.10, §4 D1–D3, D5, D11, §9.6). Where this folder and `audio/vocals/` disagree, this folder
follows v2.1 and supersedes `audio/vocals/` **for the intro**. The vocal pass remains the source library.

- **Every file is 30.000 s: 1,440,000 samples at 48 kHz, stereo, 24-bit PCM WAV.** Drop each one at **f0**. A 256 kbps MP3 sits next to each WAV for listening.
- **Clock:** 24 fps, f0 = 0.000 s, 96 BPM, 15 frames per beat. Frame numbers below are intro frames. `f303.75` means three quarters of the way through frame 303.
- **Default decisions (the showrunner may change them):** Mas's voice is the `am_michael` take, trimmed to end by f91. One vocal set serves V1–V4, because §3.1 says the VO, chant and PAD are the same in every variation. V1 "Chip Chamber Jazz" was the music used for level checks.
- **All voices are synthetic Kokoro-82M stock voices (Apache-2.0).** Nothing is cloned, and no real person's audio went in as reference, input or target. Nobody does an accent for a joke ([guardrails X10, §5](../../show/bible/guardrails.md)). Mas is the only voiced character. RUMPT is never voiced, and the intro has no political voice.

## Deliverables

| File | Bus (§9.6) | What | Placement (frames) | Level |
|---|---|---|---|---|
| **`intro-vox_vo.wav`** | `vo` | Mas: *"near the singularity; unclear which side."* | clip 1 **f24–57**, pause f58–71, clip 2 **f72–91** (voice ends f91.1; only the room tail runs past it) | **−16.0 LUFS short-term max**; −15.1 LUFS integrated over the line; −13.0 LUFS momentary max; −2.8 dBTP |
| **`intro-vox_vocals.wav`** | `chant` + `pad` | The vocal stem: the chant and the PAD summed, at the levels below | f284–318 and f630–704 | −19.3 LUFS-I (whole file); −6.3 dBTP |
| `stems/intro-vox_chant.wav` | `chant` | The ALYI gang chant (whisper + shout) | f284.3–317.8 | whisper −21.0 / shout −15.5 LUFS (windows below); −15.0 momentary max; −6.3 dBTP |
| `stems/intro-vox_chant-whisper.wav` | `chant` | *"feel… the…"* alone | f284.3–300.0 | −21.0 LUFS-I over f285–299 |
| `stems/intro-vox_chant-shout.wav` | `chant` | *"A-G-I!"* alone | f299.9–317.8 | −15.5 LUFS-I over f300–316 |
| `stems/intro-vox_pad.wav` | `pad` | Wordless close-harmony "oo", F3–B♭3–C4–E♭4 | f630–704 | −19.5 LUFS-I over f632–686; −18.6 momentary max; −10.5 dBTP |
| `stems/intro-vox_all_vo+vocals.wav` | — | Reference only: all of the above summed | f24–704 | — |
| `vo_word_timings.json` | — | Word and phoneme frames of the final VO, used to key the typing and the dot | — | — |
| `previews/_check_intro-vox_over_V1.mp3` | — | **A listening check, not the mix.** The vox over the current V1 stems at −15.5 LUFS with the §9.6 duck, and no SFX | — | — |
| `qa/qa.json` | — | Every measurement on this page, plus frame-by-frame levels | — | — |

The stems are **summable**: the chant and the PAD never overlap, and the VO touches neither. Each stem is already
set to its mix level (below), so start the faders at 0 dB.

## Placements

### 1. VO (SCRIPT §3.2, D1–D3)

| Word | In → out (frame) | Notes |
|---|---|---|
| near | **24.10** → 31.33 | Starts on the /n/ murmur. "near" runs f24–25 as scripted |
| the | 31.33 → 35.07 | |
| singularity | 35.07 → **57.52** | Clip 1 ends inside f57 |
| *(pause)* | f58–71 | **Room tone only.** The clip-1 room tail is under −60 dBFS by f60, and after that only the −66 dBFS dark-room tone plays. The D♭2 goes here |
| unclear | **72.07** → 80.59 | Clip 2 is anchored at the glottal onset of "un", not at Kokoro's word boundary (about 60 ms earlier) |
| which | 80.59 → 84.24 | |
| side | 84.24 → **91.10** | /tʃ/+/s/ at 84.24, **vowel 86.64–90.29**, /d/ closure 90.29–91.10. Room tail: −36 dBFS in f91, −40 in f92, under −60 by f95 |

- **The fit to f91.** The vocal pass's michael take hung "side" to f94–95. This edit keeps the same Kokoro renders (speeds 0.825 and 1.125) and the same "unclear which" read, then fits phrase 2:
  - "unclear which" is stretched 0.92× (gentler than the vocal pass's 0.88×, because the anchor moved to the real onset).
  - The /tʃ s/ frication is compressed 0.61× with Rubber Band.
  - The "side" vowel is compressed **0.58× overall**: 0.70× on its consonant-vowel and vowel-consonant transitions, 0.55× in the middle. §3.2 asks for about 0.6.
  - The /d/ closure is compressed 0.85×.
  - The vowel is retimed in the WORLD parameter domain, in the same pass that levels its pitch. It is therefore vocoded once, not vocoded and then phase-vocoded.
  - The splice is a 15 ms equal-power crossfade inside the /s/.
  - The click scan found nothing.
- **"side" is left hanging.** The phrase's own pitch is 125 Hz. "side" moves 125 → 118 Hz (−1.0 st) with no final fall and no creak, and it sits 0.3 st under the phrase. No breath follows.
- **The semicolon pause is exact.** The VO is edited as two clips (starting f24 and f72), so the pause is empty.
- **The sound is dry-ish, close and soft.** The chain, in order:
  - a WORLD breath layer at −24 dB
  - HPF 90 Hz, a +1.5 dB proximity shelf at 170 Hz, a soft top (−2 dB at 3.2 kHz, −1.5 dB at 6.5 kHz, a −2.5 dB shelf at 8 kHz)
  - 2:1 compression and light tanh saturation
  - a split-band de-esser, 4.8–10 kHz (it takes out at most 0.3 dB: the soft top already tames the sibilants)
  - **a 0.30 s dull "dark room" IR at 14 % wet**
  - a −66 dBFS dark-room tone under f22–95, so both clips sit in one room
- **The typing and the dot.** Key them to `vo_word_timings.json`. The typing runs 6 frames ahead on phrase 1 and 8 ahead on phrase 2 (D4). The dot climbs on the "side" vowel, f86.6–89, and exits at f89. The f90 pluck lands on the /d/ closure, which is why §3.2 ducks the pluck 3 dB.
- **Mixing.** Apply the §9.6 VO duck on the music (every stem except the sub −6 dB, strings −9 dB, over f23–91, 2-frame attack, 6-frame release, lifted over f58–71). In the check preview the VO then sits about 15 LU over the ducked music.

### 2. CHANT, "feel… the… A-G-I!" (SCRIPT §3.5b, D5)

| Event | Target (v2.1) | Measured | Delivery |
|---|---|---|---|
| whisper *"feel…"* | **f285** (5.4) | onset f284.98 (the /f/ leads from f284.3) | 6 voices whispered close-mic and panned wide (spread across ±0.95), with per-voice formant offsets (the "detuned" layers) |
| whisper *"…the…"* | **f295**, the swung "and" | onset f294.6, peak f295.2; out by **f300.0** | Shortened so it clears the hit |
| shout *"A-!"* | **f300.00**, the D♭ hit | vowel onset f300.05; first energy f299.88 | The same 6 voices at full voice, each doubled |
| shout *"G-!"* | **f303.75** (inside frame 303) | vowel onset f303.74 | Straight 16ths inside the swing, locked |
| shout *"I!"* | **f307.50** (inside frame 307) | vowel onset f307.58; tail gone by f317.8 | Held about 0.4 s |

- **Voices.** Kokoro stock voices: `am_michael`, `af_nicole`, `am_fenrir`, `af_sarah`, `bm_george`, `bf_emma`. No voice leads: every singer is normalised to the same level, and each double sits at −3 dB. The group spread is −4 to +14 ms, so nobody lands ahead of the picture's f300 pop. There is no BLIP for Alyi, because the congregation is his voice.
- **Room.** The whisper is close: a booth IR at 14 % wet plus a sliver (7 %) of the stone room. **The shout is dry**: a booth IR at 10 % wet. The room freezes at f300, so the shout leaves no tail.
- **Pitch.**
  - The shout is tuned loosely into the D♭maj9(♯11) hit: men on A♭3, women on D♭4, with ±35 cents of scatter. The per-voice median pitches land mostly on A♭, D♭, G and C.
  - I did not tune it to F. F's 5th harmonic is A natural, and it read out strongest over the chord.
  - WORLD keeps 45 % of each spoken contour, so it is still a shout and not a sung note.
- **Changes from `audio/vocals/chant/` (the v2.0 cue, "THE" at f292):**
  - "THE" moves to f295 (v2.1).
  - G and I move onto the exact straight-16th grid.
  - Two effects are dropped: the reversed-whisper pre-swell from f280 and the sub-octave "ghost" whisper. They are horror-trailer tropes, and the harmonium swell owns f285–299.
- **Levels.**
  - Whisper: −21.0 LUFS-I over f285–299, about 4 LU under the V1 music there. It is rich in high frequencies, so it reads over the harmonium and the walking bass.
  - Shout: −15.5 LUFS-I over f300–316, about 0.5–1 LU under the band's D♭ hit.
  - `flame_whoomph` at f290 goes under the whisper, low-passed at 2 kHz and 4 dB down, as §3.5b says.

### 3. PAD, the wordless close harmony under the title (SCRIPT §3.9–3.10, D11)

| Event | Frame | Notes |
|---|---|---|
| enters | **f630.0**, the final hit | A 100 ms bloom, so the brass and piano own the transient |
| holds | f632–685 | Straight tone. An 8-cent vibrato arrives after about 0.9 s. A slight swell (+1 dB) toward f680 |
| releases | **f686 → f704** | The voices reach silence at f700 and the plate tail is faded out by f704. Nothing plays after f704 (the ding and the bookend are clear) |

- **Voicing.** Four voices on **"oo": F3 · B♭3 · C4 · E♭4, with no A and no A♭.** The chroma check (a 3-bins-per-semitone CQT over f634–686) gives:
  - B♭ 0 dB, C −0.6, F −2.5, E♭ −3.5
  - A −26.8 and A♭ −26.4, both at the measurement's floor
  - D and G at about −21 (harmonics; both are allowed colours over this chord)
- **Build.**
  - The two low parts are sung by `am_puck`, `am_michael` and `bm_fable`, and the two high parts by `bf_isabella`, `af_nicole` and `af_sarah`, through the vocal pass's WORLD singer (`sing.py`).
  - Each part is double-tracked at −6 dB, ±4 cents, for blend.
  - A narrow −3 dB dip at 880 Hz trims F3's 5th harmonic (A5), which sits right on the "oo" second formant.
  - Plate reverb at 20 %. No chip layer: the score's F6 pulse carries the chip there.
- **Why it is rebuilt.** None of the six candidates in `audio/vocals/harmony/` has this voicing ("aah" F9sus stacks, an open fifth, an F sus/add9 "ooh" and chip hybrids). All six are also 4.0 s files that release at +1.6–1.9 s, not at f686.
- **Level.** −19.5 LUFS-I over f632–686, about 7 LU under the V1 tutti and about 4.5 dB under the whole string section. That should put it about 1–2 dB over the violas it doubles. If the violas are *not* thinned over f630–704 (the script's other option), bring the PAD up about 1 dB.

## Loudness plan and mix notes

- **The targets** assume the full mix is mastered to −14 LUFS-I / −1 dBTP, with the music bus at about −15.5 LUFS (§9.6).

  | Stem | Target |
  |---|---|
  | VO | −16 LUFS short-term (dialogue) |
  | whisper | −21 LUFS over its window |
  | shout | −15.5 LUFS over its window |
  | PAD | −19.5 LUFS over its window |

- **Measured in the check preview** (current V1 stems at −15.5 LUFS-I, §9.6 duck applied):

  | Window | Vox | Music |
  |---|---|---|
  | VO | −15.0 | −29.8 (ducked) |
  | whisper | −21.0 | −17.0 |
  | shout | −15.5 | −15.1 |
  | PAD | −19.5 | −12.2 (strings −14.9) |

  The preview measures −15.2 LUFS-I with no SFX.
- **Headroom.** True peaks are −2.8 dBTP (VO), −6.3 (chant) and −10.5 (PAD). Nothing in these stems is limited.
- **What the final mix does with them (2026-09-25 review pass, `audio/intro-mix/scripts/mix_intro.py`).** The stems here are unchanged. The mix takes the VO **−4 dB** and balance-centres it: it read as the loudest thing in the programme after the title, and 0.7 dB heavy on the right. It still sits 10–16 LU over the ducked music, depending on the variation. The mix places the shout **2 LU under** the music over f300–316 (this page's target is 1 LU), so the f420 hit reads as the biggest, and it dips the music −2 dB under the "A-!" so "A" is no longer the weakest letter. Don't re-level these stems to compensate.
- **Timing.** Every listed onset is placed sample-exact on the intro clock. "A-G-I!" is locked straight: it is not humanised and not swung.

## Files that still disagree with v2.1 (not edited here; flagged for their owners)

- `studio/notes/mdinner1.md` puts the whispered "THE" at f292. v2.1 has it at **f295**.
- `audio/vocals/README.md` and `audio/vocals/chant/*_from-f280` also have THE at f292 and G/I a frame off. They add a reverse pre-swell and a ghost whisper.
- `audio/vocals/vo/*` and `vo/placed/*`: every take runs to f94–95. The `am_michael` take here supersedes them for the intro.
- `audio/vocals/intro-layer/*` is the v2.0 layout. Layer B's card stabs are not scripted.
- `audio/mix/timeline.json` and `intro-sketch-V*.wav` (the earlier sketches) use the v2.0 VO, the v2.0 chant and a 4 s HYBRID/orchestral pad.
- `studio/notes/mfinale.md` has an "ooh F/C closing" over f690–719. In v2.1 the PAD releases over f686–704 and nothing is sung after it.

## Known weaknesses

- **The Mas line is a stock TTS voice.** It is timed and shaped, but not acted. A human performer in a cartoon register would beat it under the same rules: soft, close, no stressed word, "side" left hanging, done by f91. The timing sheet and this edit's frames are the brief for that session.
- **The shout is pitch, EQ and drive, not vocal effort.** 4–6 people shouting "A! G! I!" in a stairwell, then cut to these frames, would be far more convincing. The whisper is the stronger half.
- **The PAD is WORLD re-synthesis.** In a group with plate it blends, but a session quartet reading F3–B♭3–C4–E♭4 on "oo" for one hour would be a clear jump in quality.
- **Nobody has listened yet.** All picks and checks are measurements: timing, pitch, loudness, click scans and spectrograms. Audition `previews/_check_intro-vox_over_V1.mp3` before locking.

## Re-render

```bash
cd /home/jgon/project/art/mrmas/audio/intro-vox/scripts
PY=../../.venv-vocals/bin/python
$PY build_vo.py      # VO: fit, chain, level        -> _build/vo_stem.wav, _build/vo_meta.json
$PY build_chant.py   # whisper + shout layers        -> _build/chant_*_raw.wav
$PY build_pad.py     # F3-Bb3-C4-Eb4 "oo" pad         -> _build/pad_raw.wav
$PY assemble.py      # levels, 30 s stems, QA, word timings, check preview
$PY qa_harmony.py ../stems/intro-vox_pad.wav 634 686   # pitch-class check
```

- **Scripts.** `ivlib.py` holds the shared helpers: the 30 s timeline, sliding BS.1770 momentary and short-term loudness, the de-esser, room tone and the render cache. The four build scripts import the vocal pass's code from `audio/vocals/scripts/` (`vlib`, `coldopen`, `chant`, `sing`, `harmony`) **read-only** and never write into `audio/vocals/`.
- **Cache.** `_work/tts_cache/` (11 MB) holds the 44 Kokoro renders these stems use. They are copied on first use from the vocal pass's cache, so the takes match the vocal pass bit for bit. A cache miss renders with Kokoro (model in `~/.cache/huggingface`). With the cache in place, a re-run reproduces the VO bit for bit and the vocals to within 1e-4 (−80 dBFS).
- **Intermediates.** `_build/` holds only the metadata JSON between runs. Its WAV intermediates are deleted after assembly.
- **Tools and licences:** Kokoro-82M and its stock voicepacks (Apache-2.0), `pyworld` (WORLD, modified BSD), `pedalboard` / Rubber Band (GPL-3.0 tools; the output is unencumbered), numpy/scipy/pyloudnorm/soxr/librosa (BSD/MIT/ISC), and ffmpeg + libmp3lame from the Remotion bundle (LGPL).
