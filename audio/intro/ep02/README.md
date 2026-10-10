# audio/intro/ep02: Ep2's intro mix

`intro-ep2-mix-V1-chipchamber.wav` is the Ep2 intro variant's master. It is 30.000 s, 48 kHz, 24-bit, −13.83 LUFS-I and −1.3 dBTP, and the episode manifest plays it at −3 dB.

It is Ep1's delivered V1 master with two swaps:
- Jeremy's "her" for the Kokoro line;
- the three key taps of "her" for Ep1's 40 key taps and the shift+enter.

Everything from f120 on is Ep1's, sample for sample.

It is built by `audio/ep02/intro/intro_ep2.py mix`. That folder's README covers the read, the fit, the measurements and how to re-run it.

This folder holds only Ep2's output. Ep1's intro inputs and masters in `audio/intro/mix/`, `sfx/` and `vox/` are read, never written.
