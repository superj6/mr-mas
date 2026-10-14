# Episode 3 · assembly

The final film is `out/ep03/v1/ep03-v1.mp4` (git-ignored). [DELIVERY.md](../DELIVERY.md) is the handoff for watching it. Nine chapters join without padding or trimming: cold open, intro, filename card, four acts, tag and 15-second credits.

Run from the repository root, one heavy job per agent:

```sh
ASM_SCRATCH=/tmp/mrmas-ep03-assembly PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/assemble.py v1
ASM_SCRATCH=/tmp/mrmas-ep03-assembly PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/qa.py v1
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/seam_frames.py v1
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/delivery_check.py
PYTHONDONTWRITEBYTECODE=1 python3 show/episodes/ep03/production/v1/assembly/tools/watchlist.py --write
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/thumbnails.py
```

`v1-assembly.json` records actual input lengths, chapter starts and seam treatment. `v1-qa.json` measures the encoded film; `seam-frames-v1.json` compares chapter boundaries with source pictures. `delivery-checks.json` records the file hashes and fails the measurable delivery conditions if any fail. `transcript-film.txt` and `watchlist-film.md` use that same film clock. The thumbnail generator decodes exact film frames and records their frame numbers and film SHA-256.

[programmatic-pass/](programmatic-pass/README.md) preserves the earlier stock film and its metadata, before the date-rail correction. Its separate film, `out/ep03/v1/ep03-v1-programmatic.mp4`, is retained locally. The delivered `ep03-v1.mp4` uses the same stock cast and sound with corrected rails. The inherited `v1-el` directories identify the canonical route; they do not mean paid voices were recorded. Automatic review blocked both ElevenLabs attempts, including the retry after explicit user authorization; zero API requests and credits. The historical snapshot stays matched to its original film.

The encoder is H.264 High, 1920×1080, 24fps, CRF18 with libfdk_aac 256kb/s. The assembly refuses mismatched audio/picture lengths. Full-file decode, flash, loudness, true peak, sample alignment and codec-residual checks are measurements; no continuous watch or listening pass is claimed.
