# Episode 3 intro audio

`intro-ep3-mix-V1-chipchamber.wav` is a byte-identical local copy of the aired Episode 1 master, `audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav`. The typed/spoken quotation stays `near the singularity; unclear which side.` No new intro TTS request was made. The episode manifest plays this copy at the established −3 dB gain.

Reproduce the derived, git-ignored copy from the repository root:

```sh
cp audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav audio/intro/ep03/intro-ep3-mix-V1-chipchamber.wav
cmp audio/intro/ep03/intro-ep3-mix-V1-chipchamber.wav audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav
```

`cmp` passed with exit 0 on 2026-10-13. The [preservation proof](../../../show/episodes/ep03/production/v1/assembly/preservation-check.txt) also records all 31 frozen Ep1 SHA1 checks and the unchanged Ep2 master MD5. The established voice/music are inherited assets, acknowledged in this Codex attempt's production credits; the 249 newly recorded story takes use offline Kokoro stock voices. Full commands and the separate blocked library-replacement phase are in [pipeline.md](../../../show/episodes/ep03/production/v1/pipeline.md).
