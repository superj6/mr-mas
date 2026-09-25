I rebuilt the SFX stem and all four mixes against the fixed picture, then re-muxed all five MP4s onto the new silent masters. All mixes hit −14.00 LUFS and every sound lands on its picture frame. Nothing has been listened to; every decision comes from measurement, so the mixes need an audition before lock.

**Picture check.** `intro-events.json` did change (exported 10:08). The new silent masters are from 10:09 (1080p) and 10:11 (4K), each 720 frames, 30.000 s, rendered after the last source edit. I rebuilt the SFX against that events file, and it and both masters were still unchanged when I finished.

**SFX changes** (`audio/intro-sfx/build_intro_sfx.py`)
- **Following the new picture:**
  - collar pops at f190/205;
  - flame ignition at f290 (read from the scene code, since `events.ts` still said f296);
  - HUD chimes at f348/351/354;
  - the N lifts at f456 and clunks at f464;
  - neon ignite and buzz from f465;
  - the typing sounds at f18–49 and f64–83, read keystroke by keystroke from the cold open's timeline file;
  - the room-tone level following the new shot list.
- **Nothing sounds during the marshmallow gag,** because the fire now stays frozen.
- **Orb toast chime** (C7) at f692, since the picture restored the "verified: human" toast.
- **Levels:** klaxon and HUD chimes +6 dB; rocket roar −3 dB under the trumpet rip; name-card blips +3 to +5 dB, with Mario's echo blips now 6 dB under their blip instead of 10; the three pickup sounds +8 dB; key taps −4 dB to follow the voice.
- **Keycap popcorn** is now one pop per launch in the picture, replacing the library loop that didn't match.
- **The swell into f540** starts at f532, so the RUMPT flash is silent.
- **Moved to the muted extras layer:** the four skyline gag sounds (siren, drip, ka-ching, plop) and the three inaudible picture-only layers (live fire twice, live keycaps).

**Mix changes** (`audio/intro-mix/scripts/mix_intro.py`, music now built from the theme stems)
- Mas's voice −4 dB and centred.
- Muted trumpet (bar 10) +6 dB, with piano or strings −3 dB under it.
- Strings (or chip) −3 dB under the klaxon; the rip +6 dB with strings −3 dB.
- Music −2 dB under the "A-!" shout, and the shout placed 1 dB lower. f420 gets +2 dB after its attack, so it is now the loudest card hit in every version.
- **V2 roll call:** brass gated between stabs, chip +4 dB, stab 8's ring shortened. I tried a fix in the V2 score first; it made the on-beat stabs sound 27–42 ms before their cuts, so I reverted it. `score/v2.py` is untouched.
- **f690 reveal:** the sound review's recommended option. From f690 to f704 the title chord and vocal pad play "inside his monitor": −4 dB, duller and narrower. They return to full size under the ding.
- `verify.py` now also checks that the SFX was built against the current events file, and measures when each sound actually starts.

**Final loudness**

| Mix | WAV loudness | WAV peak | AAC loudness | AAC peak | Most limiting | Loudness range |
|---|---|---|---|---|---|---|
| V1 | −14.00 LUFS | −1.30 dBTP | −14.03 LUFS | −1.22 dBTP | 1.77 dB at f420 (was 2.7 at f300) | 7.0 LU |
| V2 | −14.00 | −1.30 | −14.03 | −1.09 | 1.78 dB | 8.2 LU |
| V3 | −14.00 | −1.30 | −14.03 | −1.10 | 1.73 dB | 7.0 LU |
| V4 | −14.00 | −1.30 | −14.03 | −1.24 | 1.35 dB | 5.6 LU |

- **Loudest moment of each hit in V1:** voice −15.4 (was −11.7), f120 drop −14.2, Gerg −12.2, Alyi −11.1, Mario −11.5, Nole −10.1, title −9.4. So the voice is now under the drop, and f420 is the biggest hit.
- **Balance against the music:** the voice sits 12.1 LU over it, the klaxon −2.0 LU (was −9.1), Mario's blips −8.1 LU (was −13.4). The muted trumpet sits 1–4 LU under the rest of the score.
- **V2 roll call:** every stab now sounds 0 to +21 ms after its cut (the picture leads, as scripted), and every gap between stabs is at least 10.5 dB.

**Sync check**
- All 42 picture-keyed sounds sit on their picture frames, and the typing matches the picture keystroke for keystroke.
- 102 of the 103 sounds start within 20 ms of their frame. The rumble takes 40 ms because it fades in by design.
- All five MP4s have the video copied bit-for-bit from the silent masters and 720 frames. The audio is at lag 0 against the mix files, both overall and at every cut checked.
- The ding lands −0.3 to +1.7 ms from f705, the frame where the picture changes.

**Left for the showrunner**
- The f690 option: I used the perspective change; the alternative is a much louder reverse swell, which would mean re-rendering the score.
- V4's ding sits 24 LU over its near-silent ending; trim it 3 dB only if it jumps out.
- V3's last roll-call stab rings 3.6 LU louder than the f540 downbeat; the reviews didn't flag it, so I left it.
- The shout and Mas's line are still synthetic voices; the sound review recommends recording people.

The READMEs in `audio/intro-mix/`, `audio/intro-vox/` and `audio/theme/VARIATIONS.md`, plus the generated `audio/intro-sfx/spotting.md`, are updated to match.

Files are in `/home/jgon/project/art/mrmas/`:
- `out/intro/intro-ep1-V1-1080p.mp4`
- `out/intro/intro-ep1-V1-4k.mp4`
- `out/intro/intro-ep1-V2-1080p.mp4`
- `out/intro/intro-ep1-V3-1080p.mp4`
- `out/intro/intro-ep1-V4-1080p.mp4`
- `audio/intro-mix/intro-ep1-mix-V{1..4}-*.wav` / `.m4a`
- `audio/intro-mix/stems/V1/`
- `audio/intro-mix/qa/deliverables_qa.json`
- `audio/intro-mix/qa/mix_build.json`
- `audio/intro-sfx/intro-sfx_stem.wav`
- `audio/intro-sfx/intro-blip_stem.wav`
- `audio/intro-sfx/intro-sfx_extras.wav`
- `audio/intro-sfx/spotting.json`
- `audio/intro-sfx/spotting.md`
- `audio/intro-sfx/picture-sync.json`