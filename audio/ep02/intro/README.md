# Ep2's intro sound (`intro_ep2.py`)

**Status (2026-10-10, revised the same day): Ep1's line, Ep1's sound.** Nobody has listened yet [R8].

**The showrunner, 2026-10-10:** "i did not want the quote near the singularity unclear which side changed per intro". The typed quote stays "near the singularity; unclear which side." in every episode. Ep2's picture types and posts Ep1's line again (`studio/src/episodes/ep02/intro/slot.ts`), and its other changes (the dot at 0.55, the ESC keycap, the subtitle) make no sound.

**The master** is therefore Ep1's aired intro master, copied byte for byte: `audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav` (Ep1's EL film: Jeremy reads the line, and Jeremy voices Mas in Ep2) → `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav`, the path `show/reel/ep02-v1[-el]/*.manifest.json` plays at −3 dB. The D/M/E stems in `stems-V1/` (git-ignored) are Ep1's EL stems (`audio/ep01/v3-el/intro/stems-V1-el/`). Nothing is written into `audio/intro/mix/`, `sfx/` or `vox/`, which are Ep1's locked inputs.

## Measured [M] (`mix-qa.json`)

| | |
|---|---|
| The master vs Ep1's aired master | byte-identical (sha1 `c7915e1a0fbf5cf4b4a19afc7728f06bd41a06a4`); sample difference −240 dBFS (none) over f0–18, f18–120 and f120–720 |
| vs Ep1's Kokoro V1 master | the same outside the VO (−240 dBFS after f120; 1 LSB before f18); the VO differs over f22.9–101, as Ep1's two masters do |
| vs the retired "her" master | the same after f120; f18–120 replaced (peak difference −2.9 dBFS) |
| The master | −13.99 LUFS-I, −1.3 dBTP; the cold open f0–120 −19.21 LUFS (Ep1's) |
| The stems | sum to the master within −132.5 dBFS |

## Re-run

From the repo root:

```sh
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-mix/bin/python audio/ep02/intro/intro_ep2.py mix
```

## Retired: the first build's "her" (09e604c, turned down 2026-10-10)

The first build swapped two things into Ep1's delivered V1 "chip chamber" master, each through the delivered build's own faders and gain curve (the method of Ep1's `audio/ep01/v3-el/tools/el_intro.py`): Jeremy's **"her"** for the Kokoro line, and the 3 key taps of "her" (f18, 19, 21) for Ep1's 40 taps and the shift+enter. A typing indicator held the rest of the phrase in silence. Its takes and QA stay committed as the record (`takes/`, `reads-analysis.json`, `vo-qa.json`, `sfx-qa.json`); `mix --line her` rebuilds that master (it overwrites the production one, so only for comparison). The notes below are that build's.

### The read

- **The voice:** Jeremy (`EwzF7Z2UMSib9JaKx0Kg`, Mas's library voice), `eleven_multilingual_v2`, stability 0.62, style 0.
- **The reads:** eight, `takes/h1`–`h8` (the MP3 and JSON are committed; 34 characters sent, 16 credits billed).
- **The pick: h7**, "her.", at speed 0.82, Mas's V.O. speed. Measured with WORLD, its pitch is the only level contour of the eight: 131 Hz in each quarter of the vowel. The direction asked for "one syllable, lowercase, unhurried", so a level read neither falls nor rises.
  - The others fall 127 → 92 Hz, rise at the end (h3 and h8 end at 149 and 136 Hz), or creak.
  - h4 was heard by ASR as "purr".
- **The fit:** the word starts on f23.4 (Ep1's line started f23.8). It is shortened 18 % in one Rubber Band pass and voiced to f38.3 at −40 dB, reverb included.
  - The spec's "about f24–33" would have meant 35 % shorter, which reads as hurried.
  - The typing indicator takes over at f38 (`studio/src/episodes/ep02/intro/slot.ts`).
- **The level:** the word's momentary (400 ms) maximum is −13.07 LUFS. That matches Ep1's EL line over "near the" (−12.97). A one-word line normalised the way Ep1's was (short-term maximum −16 over 3 s) would have come out about 8 dB hot.

### Measured [M] (the first build)

| | |
|---|---|
| SFX builder reproduces the delivered Ep1 stem | −138.5 dBFS (the 24-bit LSB); every non-tap event unchanged; difference outside f17–90: none |
| Mix reproduces the delivered Ep1 master from its inputs | −138.5 dBFS |
| Limiter over f0–120 | idle (0.001 dB), so the swap equals a rebuild at Ep1's master gain |
| Difference from Ep1's master after f120 | none (−240 dBFS) |
| The master | −13.83 LUFS-I (Ep1 −14.0: less voice in the cold open), −1.3 dBTP |
| The cold open f0–120 | −21.8 LUFS (Ep1 −19.2); the word f22–36 −16.2; the silence f36–90 −28.5 |

### Re-run (the first build)

From the repo root, in order:

```sh
PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/ep02/intro/intro_ep2.py render     # cached: sends nothing
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep02/intro/intro_ep2.py analyze
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-vocals/bin/python audio/ep02/intro/intro_ep2.py build --read h7
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv/bin/python audio/ep02/intro/intro_ep2.py sfx --scratch $S/sfx --events out/ep02/v1/intro/intro-ep2-events.json
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-mix/bin/python audio/ep02/intro/intro_ep2.py mix --line her
```

**What each step writes:**
- `reads-analysis.json`, `vo-qa.json`, `sfx-qa.json`, `mix-qa.json`: committed.
- `intro-vox_vo-ep2.wav`, `intro-sfx_stem-ep2.wav`, `stems-V1/`, `takes/*.wav`: git-ignored.
- The ElevenLabs key stays inside `audio/ep02/v1-el/tools/ellib.py`. No voice is cloned.
