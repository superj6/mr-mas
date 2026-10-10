# Ep2's intro sound (`intro_ep2.py`)

**Status (2026-10-10, the titles pass): built and measured.** Nobody has listened yet [R8].

**What it is:** the 30 s intro's sound for Ep2 (pipeline.md §8.3 step 4). It is Ep1's delivered V1 "chip chamber" master with only two things swapped in. Each swap goes through the delivered build's own faders and gain curve, the method Ep1's `audio/ep01/v3-el/tools/el_intro.py` used.
- **The VO:** Ep1's Kokoro line becomes Jeremy's **"her"**. It uses the same close-mic chain, room and −66 dBFS dark-room tone (f22–95).
- **The SFX:** Ep1's 40 key taps and the shift+enter become the 3 taps of "her" (f18, 19, 21). The typing indicator has no sound.

Everything from f120 on is Ep1's master sample for sample [M]. The score's D♭ (f60) lands in the silence after the word.

**The master:** `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav`. That is the path `show/reel/ep02-v1[-el]/*.manifest.json` plays at −3 dB, and it is committed like Ep1's intro masters. Nothing is written into `audio/intro/mix/`, `sfx/` or `vox/`, which are Ep1's locked inputs.

## The read

- **The voice:** Jeremy (`EwzF7Z2UMSib9JaKx0Kg`, Mas's library voice), `eleven_multilingual_v2`, stability 0.62, style 0.
- **The reads:** eight, `takes/h1`–`h8` (the MP3 and JSON are committed; 34 characters sent, 16 credits billed).
- **The pick: h7**, "her.", at speed 0.82, Mas's V.O. speed. Measured with WORLD, its pitch is the only level contour of the eight: 131 Hz in each quarter of the vowel. The direction asked for "one syllable, lowercase, unhurried", so a level read neither falls nor rises.
  - The others fall 127 → 92 Hz, rise at the end (h3 and h8 end at 149 and 136 Hz), or creak.
  - h4 was heard by ASR as "purr".
- **The fit:** the word starts on f23.4 (Ep1's line started f23.8). It is shortened 18 % in one Rubber Band pass and voiced to f38.3 at −40 dB, reverb included.
  - The spec's "about f24–33" would have meant 35 % shorter, which reads as hurried.
  - The typing indicator takes over at f38 (`studio/src/episodes/ep02/intro/slot.ts`).
- **The level:** the word's momentary (400 ms) maximum is −13.07 LUFS. That matches Ep1's EL line over "near the" (−12.97). A one-word line normalised the way Ep1's was (short-term maximum −16 over 3 s) would have come out about 8 dB hot.

## Measured [M]

| | |
|---|---|
| SFX builder reproduces the delivered Ep1 stem | −138.5 dBFS (the 24-bit LSB); every non-tap event unchanged; difference outside f17–90: none |
| Mix reproduces the delivered Ep1 master from its inputs | −138.5 dBFS |
| Limiter over f0–120 | idle (0.001 dB), so the swap equals a rebuild at Ep1's master gain |
| Difference from Ep1's master after f120 | none (−240 dBFS) |
| The master | −13.83 LUFS-I (Ep1 −14.0: less voice in the cold open), −1.3 dBTP |
| The cold open f0–120 | −21.8 LUFS (Ep1 −19.2); the word f22–36 −16.2; the silence f36–90 −28.5 |

## Re-run

From the repo root, in order:

```sh
PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/ep02/intro/intro_ep2.py render     # cached: sends nothing
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep02/intro/intro_ep2.py analyze
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-vocals/bin/python audio/ep02/intro/intro_ep2.py build --read h7
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv/bin/python audio/ep02/intro/intro_ep2.py sfx --scratch $S/sfx --events out/ep02/v1/intro/intro-ep2-events.json
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-mix/bin/python audio/ep02/intro/intro_ep2.py mix
```

**What each step writes:**
- `reads-analysis.json`, `vo-qa.json`, `sfx-qa.json`, `mix-qa.json`: committed.
- `intro-vox_vo-ep2.wav`, `intro-sfx_stem-ep2.wav`, `stems-V1/`, `takes/*.wav`: git-ignored.
- The ElevenLabs key stays inside `audio/ep02/v1-el/tools/ellib.py`. No voice is cloned.

## For a human

Listen for three things:
- whether a level "her" at 0.5 s sounds unhurried rather than flat;
- whether f38–111 reads as designed silence (the music stays ducked from Ep1's stems);
- whether the D♭ at f60 lands as the colour in that silence.
