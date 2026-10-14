# Episode 3 v1 · assembled first cut

The delivered film is `out/ep03/v1/ep03-v1.mp4`: **20:03.00**, 28,872 frames at 24fps, 1920×1080 H.264 / AAC 256kb/s, 77,165,987 bytes. MD5: `18b77189ea3abb6782672c8f98b76905`. SHA-256: `035db43212610f5a7f4e029d73cc54b61dbe248fdc1c6b4b1b60cd58f3985d7f`.

This is an unpublished Codex attempt using 249 local Kokoro stock dialogue takes and inherited title audio. The user explicitly authorized the planned ElevenLabs transfer, but automatic approval review rejected it again under the platform's private-data destination restriction. Neither attempt executed: zero requests and zero credits. No further confirmation or workaround is pending.

## Production record

- `6c7b2e1`: stale-draft audit, learnings check and factual anchors.
- `d2005fd`: revised script, 124-shot source plan, actual-take locks and complete picture source.
- `dac2664`: native portrait, physical prop, paper-reading and delayed-reveal fixes after full-size still review.
- `b13d8ae`: audio/ops sources and the stock-pass QA snapshot. The earlier film is retained as `ep03-v1-programmatic.mp4`; its snapshot remains matched to that pre-rail picture.
- Final pass: fixed explicit `kind: rail` conversion, rebuilt affected scenes, reassembled and repeated encoded-film QA. Thirteen dates now use the reserved rail band and transcript. [rail-correction.json](assembly/rail-correction.json) proves unchanged timing, dialogue, sound marks, subtitles and audio inputs.

## Verification

[delivery-checks.json](assembly/delivery-checks.json) passes: all frames decode, nine chapter clocks match, 250 transcript lines, thirteen source-matched date rails, zero measured chapter audio lag or codec bursts, −16.14 LUFS and −1.22dBTP. Decoded AAC adds 8ms of padding. Full-film flash scan peaks at one flash per second, with zero red flashes. Boundary picture differences stay at or below 0.09/255 after encoding. [scene-consistency.json](assembly/scene-consistency.json) compares 1,360 sampled frames across all 25 scene clocks with zero differences.

All six score audits pass. The sound audit accounts for all 50 effects with none masked and all 249 line onsets above its floor. Four marginal effects, 92 soft-tail percentile flags and ten ASR-recall flags remain listening checks, not confirmed faults. [preservation-check.txt](assembly/preservation-check.txt) records all 31 Episode 1 checks, the unchanged Episode 2 master and byte-identical copied intro audio. [typescript-baseline.txt](assembly/typescript-baseline.txt) records 20 existing development-tool errors and no Episode 3 errors; the delivered scene bundles compile and render successfully.

The two reviewers inspected all 124 source shot middles at native size before encoding, then inspected decoded film contact sheets and selected native frames. Dedicated encoded rail samples verify the short date windows. [review-picture.md](review-picture.md) records the exact scope. No continuous human watch, listening pass, newcomer screening or legal review is claimed.

Use [DELIVERY.md](DELIVERY.md) and the [final-clock watchlist](assembly/watchlist-film.md) for review. [Assembly README](assembly/README.md) has the exact rerun commands and generated evidence; [pipeline.md](pipeline.md) covers act/scene dependencies. [Release copy](../../release.md), chapters and three spoiler-free thumbnail options are prepared. Publication remains the showrunner's decision.
