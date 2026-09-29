All four mixes and the five MP4s are built. Every mix measures −14.0 LUFS integrated and stays under −1 dBTP, including after AAC encoding, and all files are exactly 30.000 s. The ding lands at 29.375 s (f705) within 4 ms. Nobody has listened to any of it yet: every check is a measurement, so the mixes need an audition before lock.

**Loudness per mix** (a second, independent loudness meter agrees within 0.04 LU)

| Mix | WAV LUFS-I | WAV dBTP | AAC/MP4 LUFS-I | AAC/MP4 dBTP | Largest limiter cut |
|---|---|---|---|---|---|
| V1 (primary) | −14.00 | −1.30 | −14.03 | −1.19 | 2.7 dB, f300.5–303 |
| V2 | −14.02 | −1.30 | −14.05 | −1.13 | 1.5 dB, f301.5–303 |
| V3 | −14.00 | −1.30 | −14.03 | −1.22 | 2.6 dB, f300–303 |
| V4 | −14.00 | −1.30 | −14.02 | −1.23 | 2.6 dB, f300–303 |

The limiter only works hard for about 2 frames at f300, where the Alyi hit and the shouted "A-!" land together. That spot is worth a listen for pumping.

**Sync and duration check** (all five MP4s)
- **Duration:** 720 video frames at 24 fps, both streams start at 0 and last 30.000 s, and the audio is exactly 1,440,000 samples. A player that ignores the MP4's trim information will play 768 samples of encoder padding past 30 s, at −104 dBFS.
- **Video:** the video is copied, not re-encoded; it is identical to the silent masters.
- **Alignment:** the audio in each MP4 lines up with its WAV mix to the sample, across the whole 30 s and at 13 check frames (f24, 120, 225, 240, 300, 345, 360, 420, 480, 540, 630, 705, 719).
- **The ding:** the SFX stem places it at 29.375 s (f705). In the MP4 audio it starts at 29.3747–29.3787 s, and the picture changes exactly on frame 705.

**Mix decisions**
- **VO duck:** I did not add a second one. The score team built the duck into the music stems (−6 dB, strings −9 dB, over f23–91), and I confirmed it: the same piano note plays about 7 dB lower at f30 than at f15. The vox README tells the mixer to apply the duck; doing so as well would have ducked twice. Under the line the VO sits at −14.5 LUFS against −30.6 for the music. The duck's ramps are straight lines, not S-curves; smoother curves would be a change in the score's own code.
- **Levels:** the music is trimmed to −15.5 LUFS before anything else is added. SFX and VO go in at the levels their teams delivered. The alternate SFX layer (extras) stays muted, as the script requires.
- **Chant and pad:** placed per variation against that variation's music, moving each by no more than ±2 dB. The whisper sits 4 dB under the music, the shout 1 dB under, and the pad 7 dB under the full band (5.5 dB in V4, where it is the only other colour).
- **SFX:** the typical effect sits about 12 dB under the music. Only the bonk at f150, the cold-open Orb servo and scan, and the ding with its Post click at f705 reach the music's level or go over it; those are the moments the script gives to the SFX.
- **Stem grouping:** dialogue is the VO plus the chant, because it has words; the wordless pad goes in the music stem. Together the three stems add back up to the mix exactly.

Everything rebuilds with `/home/jgon/project/art/mrmas/audio/intro/mix/scripts/run_all.sh` (about 80 s). Temporary files are deleted; the mix folder is 62 MB.

Files are in `/home/jgon/project/art/mrmas/`:
- out/season/intro/intro-ep1-V1-1080p.mp4
- out/season/intro/intro-ep1-V1-4k.mp4
- out/season/intro/intro-ep1-V2-1080p.mp4
- out/season/intro/intro-ep1-V3-1080p.mp4
- out/season/intro/intro-ep1-V4-1080p.mp4
- audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav and .m4a
- audio/intro/mix/intro-ep1-mix-V2-orchestralnoir.wav and .m4a
- audio/intro/mix/intro-ep1-mix-V3-pixelswing.wav and .m4a
- audio/intro/mix/intro-ep1-mix-V4-pianopixels.wav and .m4a
- audio/intro/mix/stems/V1/ (intro-ep1-V1-stem-music.wav, -stem-sfx.wav, -stem-dialogue.wav)
- audio/intro/mix/qa/ (deliverables_qa.json, mix_build.json, inputs.json, sfx_vs_music.json, V1_loudness_timeline.png)
- audio/intro/mix/scripts/ (build scripts)
- audio/intro/mix/README.md