# Episode 3 voices

`cast-el.json` carries Ep2's stock/library cast choices, including Jeremy for Mas and Kokoro `am_liam` for MARIO. Ep2-specific per-line overrides are removed. The cache writes only `v1-el/cache/`; Ep2 and Ep1 paid caches are read-only fallbacks.

`v1-el/tools/takes.py prepare` writes input rows; `kokoro` records the local first pass through the read-only Ep1 fast recorder with two workers; `adopt-kokoro` places local rows into the canonical route without an API call. `elevenlabs --dry-run` sends nothing; an explicitly invoked `elevenlabs` render spends credits. Missing offline mappings fail, never silently substitute a voice. See the [production pipeline](../../show/episodes/ep03/production/v1/pipeline.md) for exact commands and all dependencies.

Keys remain in `.env`, read only inside `ellib.py`; do not print, inspect or record their values. No voice cloning, voice design or real-person imitation. The completed programmatic pass has249 stock takes. Paid production follows its preserved film; fresh scene-line auditions for Maon, Corkboard Guy and Rumpt use three documented ordinary library candidates each. `audition_ep3.py` records measured choices and the explicit unlistened limitation; `cost_report.py` totals actual provider credit headers, including retakes. Human ear checks remain in the delivery record.
