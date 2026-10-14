# Episode 3 intro

Episode-local fork of Ep2's final intro. Shared moments are imported read-only. `slot.ts` sets `.60`, `MUTE`, `now with voice (paused)`; the typed quote is Ep1's unchanged. The local pointer and Alyi-card cleanup is carried over. No unbuilt intro layers were added.

Commands are in [pipeline.md](../../../../../show/episodes/ep03/production/v1/pipeline.md). `tools/master.sh intro-ep3 <raw.mp4> <scratch>` wraps its heavy stages; follow with the Ep3 assembly `intro_flashfix.py` and `flash_seg.py`, through heavy.sh. Audio is Ep1's aired master copied into `audio/intro/ep03/` byte-identically. Outputs only `out/ep03/v1/intro/` and this run's own scratch.

[M] Rendered 2026-10-13:720f,24fps,1920×1080; established smear fix applied; max1flash/s,red0,PASS. [J] Full-size f250/f660 stills inspected: MUTE cap and subtitle read. Full-speed watch/listen remains a human check. The aired intro audio is copied byte-identically from Ep1; frozen inputs remain untouched.
