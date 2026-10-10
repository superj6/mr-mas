# audio/intro/ep02: Ep2's intro mix

`intro-ep2-mix-V1-chipchamber.wav` is the Ep2 intro variant's master. It is 30.000 s, 48 kHz, 24-bit, −13.99 LUFS-I and −1.3 dBTP, and the episode manifest plays it at −3 dB.

**It is Ep1's aired intro master, byte for byte** (`audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav`, sha1 `c7915e1a…`: Jeremy reads "near the singularity; unclear which side.", as in Ep1's EL film). The showrunner, 2026-10-10: the typed quote stays the same in every episode, so the cold open sounds as Ep1's. Ep2's other intro changes (the dot at 0.55, the ESC keycap, the subtitle) make no sound.

The first build (09e604c) swapped in Jeremy's "her" and its three key taps; it was turned down the same day and is replaced here.

It is built by `audio/ep02/intro/intro_ep2.py mix`. That folder's README has the measurements and how to re-run it.

This folder holds only Ep2's output. Ep1's intro inputs and masters in `audio/intro/mix/`, `sfx/` and `vox/` are read, never written.
