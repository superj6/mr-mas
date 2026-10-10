# MR. MAS SFX board — licenses

- **Procedural sounds** (everything synthesized in `scripts/*.py` with numpy/scipy/pedalboard): original work made for MR. MAS; no third-party audio.
- **Sampled layers**: VS Chamber Orchestra 2: Community Edition (Versilian Studios) — **CC0 1.0**. Upright Piano by Simon Dalzell / Ivy Audio (redistribution granted by Versilian Studios). Files in `../samples/vsco2ce-sfx/`.
- **SoundFont layers** (celesta, vibraphone): GeneralUser GS v2.0.3 by S. Christian Collins — free for any music use, private or commercial (`../samples/generaluser-gs/LICENSE.txt`).
- **Voices**: none. The character "voices" are instrument/synth babble blips; no speech, no TTS model, no recording of any person, no voice cloning.
- **Banned-list check**: no meme sounds, no real OS sounds (the 1993 alert is an original wooden 'bonk' on E, not any system beep), no franchise lifts.

- **Ep2 v1 (2026-10-10)**: `scripts/sounds_ep2.py` (built by `scripts/build_ep2.py` into `wav/` as new files, listed in `manifest-ep2.json`; `manifest.json` and every Ep1 file untouched): procedural like the rest, with the same sampled layers (the harp in `string_taut`, VSCO 2 CE, CC0). Every crowd (laughs, cheers, applause, coughs, the murmurs) is synthesized: glottal pulses through vowel formants and shaped noise, no recording of any person, no TTS, no words. The ENGINEER's laugh (9.03) is not on the board: it is a take in his own library voice (`audio/ep02/v1-el/sound/`).
