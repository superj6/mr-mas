# Episode 3 local sound board

`build.py` deterministically generates 14 location beds and requested foley absent from the shared sound board. It reuses existing shared WAVs read-only, never replaces them. Local assets live under `wav/` (git-ignored); `manifest.json` records every generated file/hash and shared reuse.

Rebuild from the root: `PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep03/sfx/build.py`. Stem/room lookup checks these files before `audio/sfx/wav/`; the local manifest invalidates Ep3 stems. No generated dialogue, cloned voice or external media request. Programmatic sounds are measured, not evidence of a human listen.

At source setup the builder has not yet run. The production pipeline record will carry measured completion and issues.
