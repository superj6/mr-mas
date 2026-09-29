The VO stem and the vocal stem are finished, each exactly 30.000 s at 48 kHz, cut to SCRIPT v2.1. Drop every file at f0. All levels, timings and pitch checks are measured, but nobody has listened to anything yet, so audition the check preview before locking.

**Placements (24 fps)**

VO (Mas, `am_michael`), in two clips so the semicolon pause stays exact:
- **Clip 1, "near the singularity;":** f24.10 to f57.52 ("near" 24.10, "the" 31.33, "singularity" 35.07 to 57.52).
- **Pause, f58 to 71:** room tone only. Nothing in it is louder than −63 dBFS.
- **Clip 2, "unclear which side.":** "unclear" starts at 72.07 and "which" at 80.59. The "side" vowel runs 86.64 to 90.29, and the voice is gone at **f91.10**. Only the room tail runs past f91 (−40 dBFS by f92.6).
- **Fitting "side" by f91:** the vowel is squeezed to 0.58× of its length (the script asked for about 0.6), and "unclear which" is stretched only 0.92×. "side" stays level: it moves −1.0 semitone with no final fall, and the click scan found nothing.

Chant, "feel… the… A-G-I!" (six stock voices, no leader):
- **Whisper:** "feel…" at **f285** and "…the…" at **f295**. v2.1 moved "the" from the old f292 to the swung "and". The whisper is gone by f300.
- **Shout:** "A" at **f300.0**, "G" at **f303.75** and "I" at **f307.5**, locked straight 16ths. Measured onsets are f300.05, f303.74 and f307.58, with no voice ahead of the f300 frame. The shout is dry and ends by f317.8.
- **Shout pitch:** tuned loosely to A♭ (men) and D♭ (women) so it sits inside the D♭ hit. Tuning it to F put an A natural on top.
- **Dropped:** the vocal pass's reversed-whisper swell into f285 and its low "ghost" whisper. Both read as horror clichés, and the music's harmonium swell already owns f285 to 299.

Pad (rebuilt, because none of the six existing candidates had the scripted voicing or timing):
- Four voices on "oo": F3, B♭3, C4, E♭4. The chroma check shows no A and no A♭ above the measurement floor.
- It enters at **f630**, holds, starts releasing at **f686**, and is silent by **f704**.

**Loudness** (set for a −14 LUFS master with music around −15.5, per §9.6)

| Stem | Level | True peak |
|---|---|---|
| VO | −16.0 LUFS short-term max; −15.1 integrated over the line | −2.8 dBTP |
| Whisper | −21.0 LUFS over f285–299 | |
| Shout | −15.5 LUFS over f300–316 | |
| Chant (whole) | | −6.3 dBTP |
| Pad | −19.5 LUFS over f632–686 | −10.5 dBTP |

- Against the current V1 stems in the check preview, the VO sits about 15 LU over the ducked music. The whisper is about 4 LU under the music, the shout about 0.5 LU under, and the pad about 7 LU under the full band.
- The stems are summable and none is limited. The mixer only needs to apply the script's VO duck on the music.
- The pad should land about 1–2 dB over the violas, as the script asks. I estimated that from the full strings stem because the violas can't be separated. If the violas aren't thinned under the title, raise the pad about 1 dB.

**Files that still follow the old v2.0 timing** (their owners should know; I didn't edit them):
- `studio/notes/mdinner1.md` puts "the" at f292.
- `studio/notes/mfinale.md` has an "ooh" closing over f690–719; v2.1 has nothing sung after f704.
- The vocal pass's chant files, takes and intro layers, and the earlier mix sketch in `audio/intro/history/sketch-mix/timeline.json`.

**Files** (all in /home/jgon/project/art/mrmas/audio/intro/vox)
- `intro-vox_vo.wav` – the VO stem
- `intro-vox_vocals.wav` – the vocal stem (chant plus pad)
- `vo_word_timings.json` – word and sound frames for keying the typing and the dot
- `README.md` – placements, levels, what changed and how to re-render
- `stems/` – `intro-vox_chant.wav`, `intro-vox_chant-whisper.wav`, `intro-vox_chant-shout.wav`, `intro-vox_pad.wav`, `intro-vox_all_vo+vocals.wav`
- `previews/_check_intro-vox_over_V1.mp3` – a quick listen over V1 with no sound effects, not the mix
- `qa/qa.json` – all measurements
- `scripts/` – the build scripts; `build_vo.py` → `build_chant.py` → `build_pad.py` → `assemble.py` re-renders everything

Each WAV has an MP3 beside it. Temporary files are deleted; the folder is 76 MB, including an 11 MB speech cache so re-renders come out the same.