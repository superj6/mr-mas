# Episode 3 outro B

Episode-local fork of Ep2's Orb B, preserving the two-page scan and established credit format. This attempt credits Codex and acknowledges inherited Opus 5.5 assets. File name is `ep1.2_strawberry.jpg`. Shared score engine, intro singer and SFX source are read-only.

`bash studio/src/episodes/ep03/outro/tools/render.sh /tmp/mrmas-ep03-session/pipeline/outro` runs the full chain with heavy stages wrapped. Reconcile actual rows first: `python3 studio/src/episodes/ep03/outro/tools/cast_page.py --variant kokoro` for the programmatic pass or `--variant el` for final library voices. It reads only take metadata and writes this episode's cast arrays. See [pipeline.md](../../../../../show/episodes/ep03/production/v1/pipeline.md).

Page 1 keeps `art · script · music · voices · edit: codex` / `prompt: jgon`. Prior assets were created by Opus 5.5; their attribution is retained here and in the mux metadata. Putting that attribution in the second chip would make the page 125 characters long, requiring 7.8125 seconds at 16 characters/second before any reveal delay, beyond its established 7.5-second timing. The outro is not lengthened to accommodate it.

The stock-pass MP4 is rendered at 1920×1080, 24fps, 360 frames / 15.000s. Both encoded key pages were inspected. Readability QA passes: page 1 finishes 20 frames before the page turn at 16 characters/second, no overlaps, minimum encoded contrast 5.9. Flash QA reports zero flashes. Page 2 remains the established pause-to-read cast page. See [review-picture.md](../../../../../show/episodes/ep03/production/v1/review-picture.md).

The delivered cast page matches the local stock take metadata. Any future voice replacement must reconcile the page and rerender it if the cast changes. No continuous watch or listening judgement is claimed by the still review.
