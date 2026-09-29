# MR. MAS Ep1 intro: final mix (key: `intro-mix`)

This is the re-recording mix of the 30.000 s Ep1 opening (SCRIPT v2.1 §9.6). V1 "Chip Chamber Jazz" is the primary mix. V2, V3 and V4 are alternates built with the same bus plan. Every file runs 30.000 s: 1,440,000 samples at 48 kHz, stereo. **None of these mixes has been listened to.** Every decision below comes from measurement, so audition before you lock.

## Deliverables

| File | What |
|---|---|
| `intro-ep1-mix-V1-chipchamber.wav` / `.m4a` | **Primary mix.** The WAV is 24-bit PCM. The M4A is AAC-LC at 256 kb/s. |
| `intro-ep1-mix-V2-orchestralnoir.wav` / `.m4a` | Alternate |
| `intro-ep1-mix-V3-pixelswing.wav` / `.m4a` | Alternate |
| `intro-ep1-mix-V4-pianopixels.wav` / `.m4a` | Alternate |
| `stems/V1/intro-ep1-V1-stem-{music,sfx,dialogue}.wav` | V1 mix stems. They are taken after the master gain and after the limiter, so music + sfx + dialogue equals the mix (residual −132 dBFS). |
| `../../out/season/intro/intro-ep1-V1-1080p.mp4`, `-V1-4k.mp4`, `-V2-1080p.mp4`, `-V3-1080p.mp4`, `-V4-1080p.mp4` | Picture masters with each mix muxed in. The video stream is copied (its packets are bit-identical to the silent masters), and the audio is the same AAC stream as the matching `.m4a`. |
| `qa/deliverables_qa.json` | Loudness, peaks, lengths, the decoded-AAC checks, the A/V sync checks for every file, the picture-sync check (`picture_sync`) and every cue's audible start against its frame (`sfx_onsets`) |
| `qa/mix_build.json` | Per-mix settings: music trim, stem and bus rides, vocal faders, VO gain and centring, the bookend perspective, master gain, limiter activity, and the review's balance checks re-measured (`checks`) |
| `qa/inputs.json` | Measurements of the input buses before mixing, including the probe that confirms the baked-in duck |
| `qa/sfx_vs_music.json`, `qa/V1_loudness_timeline.png` | Each SFX event's level against the music at that moment |

## Bus plan

| Stem | Contents | Level |
|---|---|---|
| **music** | `audio/theme/stems/V<n>-*.wav` (they sum to `theme-V<n>-*.wav` to −119 dB; V4 has only piano, chip and sub), each with its own gain rides, plus the wordless PAD (`intro-vox/stems/intro-vox_pad.wav`) | The score is trimmed to −15.5 LUFS-I (§9.6), measured on the unridden score, so the rides below are real level changes. The PAD sits 7 LU under the tutti over f632–686; in V4 it sits 5.5 LU under, because the PAD is V4's only other colour. |
| **sfx** | `intro-sfx/intro-sfx_stem.wav` + `intro-blip_stem.wav` | Unity gain. The SFX build already carries its −4 dB bus trim and this pass's cue levels. `intro-sfx_extras.wav` stays muted, because the script cuts it. |
| **dialogue** | `intro-vox/intro-vox_vo.wav` (Mas, am_michael) + the chant whisper and shout | **VO −4 dB**, balance-centred over f24–91. The whisper sits 4 LU under the music over f285–299, and the shout **2 LU** under it over f300–316. |

- **The VO duck is not applied again.** The score bakes the §9.6 duck into its stems:
  - every stem except the sub drops −6 dB and the strings −9 dB over f23–91;
  - the duck lifts over f57–71 for the pause;
  - the f90 pluck is ducked only −3 dB.

  The duck probe measures it: the same piano F5 plays 7.1 dB lower at f30 than at f15 in V1 (V2 7.5, V3 7.1, V4 5.9). The ramps are piecewise linear in gain (`score/common.py vo_duck`, 2-frame attack, 6-frame release). Rounder S-curves would be a change in the score.
- **The chant and PAD faders are set per variation** against that variation's own unridden music, within ±2 dB of the delivered stems. The values are in `qa/mix_build.json`.
- **Master chain:** a master gain feeds a linked look-ahead true-peak limiter (2 ms look-ahead, 50 ms release, ceiling −1.3 dBTP, which leaves room for AAC overshoot). The master gain is iterated until the mix reads −14.00 LUFS-I.

## 2026-09-25 review pass

The sound supervisor's P1–P3 notes and the editor's loudness notes. The tables live in `scripts/mix_intro.py`: `RIDES`, `BUS_RIDES`, `VO_DB` and `BOOKEND`. Each ride is full over its span, with linear-in-dB ramps outside it, so a hit on the next frame is untouched.

| Change | Where | Measured after (V1 unless noted) |
|---|---|---|
| VO −4 dB and centred (it read 0.7 dB heavy on the right) | dialogue | VO momentary max −15.4 (was −11.7), below the f120 drop (−14.2). It sits 12.1 LU over the ducked music, and every word scores SII 0.91–0.99. The key taps came down 4 dB with it in the SFX build. |
| Harmon +6 dB in bar 10; piano −3 dB (V1, V3) or strings −3 dB (V2) under it | music stems | Harmon vs the rest of the score: −0.9 / −4.2 / −4.1 LU (was −8 to −11). V2 runs through bar 11: −0.1 / −2.9 / +2.3 / −3.0. V3 (beats 1–2): +1.0. |
| Strings −3 dB under the vault klaxon, f345–359 (V3 and V4: the chip); the SFX build raises the klaxon and chimes +6 dB | music + sfx | Klaxon window, SFX vs music: −2.0 LU (was −9.1). V2 −2.2, V3 −3.8, V4 −3.5. |
| Trumpet rip f413–419 +6 dB with the strings −3 dB (V1), or with the piano −3 dB (V3); the SFX build takes the roar −3 dB | music + sfx | Rip vs the rest of the score −2.6 LU, and 3.9 LU over the SFX (was buried 6–12 dB under from 500 Hz to 4 kHz). |
| Music −2 dB under the ALYI "A-!" (f299.5–304.5); shout target 2 LU under (was 1) | bus + dialogue | "A" −2.4 LU vs the music (was −3.4). The limiter at f300 is now 1.45 dB (was 2.7). |
| f420 +2 dB on the hit's body (f421–432, after the transient) | bus | Momentary max: GERG −12.2, ALYI −11.1, MARIO −11.5, **NOLE −10.1**. f420 is now the biggest hit in all four variations. |
| Blips: GERG +3, MARIO +5 (echo −6 rel.), NOLE +4 (SFX build) | sfx | MARIO blips −8.1 LU vs the music (was −13.4), NOLE −7.5, GERG −6.1. |
| V2 roll call: brass gated −15 dB between stabs 1–7, chip +4 dB on stabs 1–7, stab-8 ring choked −5 dB | V2 stems | Every stab speaks 0 to +21 ms after its cut (picture leads). Gaps 10.5–23 dB (were 4.9–16). Stab-8 ring −14.9 vs downbeat −15.5 LUFS (was −11.9 vs −15.4). |
| Bookend f690–704: the title chord and PAD "inside his monitor" (−4 LU net, low-pass 3.5 kHz, 30 % width), back to full under the f705 ding | music (not `sub`, `fx`) | Music across the cut: −12.2 → −18.7 LUFS (was −17.7 → −18.1 dBFS, no audible change). The ding stays 12.1 LU over the bed. |

**Not changed, for the showrunner:**
- **The f690 cut.** It is option (b), the perspective change. Option (a), an 18 dB louder reverse swell, would be a score change.
- **V4's ding** sits 24 LU over V4's near-silent bookend (11–12 LU in V1–V3). Trim it 3 dB in V4 only if it jumps out on audition.
- **V3's stab-8 ring** (the crash) is 3.6 LU over its f540 downbeat. The review didn't flag it.
- **The voices are synthetic.** Book humans for the shout (4–6 people, about an hour) and for Mas's line, to `intro-vox/vo_word_timings.json`, ending by f91.
- **Nothing has been listened to.**

## Measured

| Mix | WAV LUFS-I | WAV dBTP | AAC LUFS-I | AAC dBTP | Master gain | Limiter peak GR (> 0.5 dB total) | LRA (ffmpeg) |
|---|---|---|---|---|---|---|---|
| V1 | −14.00 | −1.30 | −14.03 | −1.22 | +1.41 dB | 1.77 dB at f420.5 (314 ms) | 7.0 LU |
| V2 | −14.00 | −1.30 | −14.03 | −1.09 | +1.10 dB | 1.78 dB at f421.5 (295 ms) | 8.2 LU |
| V3 | −14.00 | −1.30 | −14.03 | −1.10 | +1.36 dB | 1.73 dB at f420.7 (297 ms) | 7.0 LU |
| V4 | −14.00 | −1.30 | −14.03 | −1.24 | +1.40 dB | 1.35 dB at f631.6 (249 ms) | 5.6 LU |

- **Meters.** Loudness is BS.1770-4 from `pyloudnorm`. An independent implementation with the standard's 48 kHz coefficients, `lufs_ref`, agrees to within 0.04 LU. `ffmpeg loudnorm` reads about 0.1 LU hotter, but it also misreads a reference step signal by 0.5 LU, so it is logged in the QA only as a note.
- **V1 balance (LUFS):**
  - over the VO line: VO −18.2, music −30.3, sfx −37.3;
  - whisper −18.6 against music −14.7;
  - shout −14.7 against music −13.6;
  - ding −20.6 over a −33.0 bed.
- **SFX against the music:** the median SFX event sits 9.7 LU under the music in V1 (10.2, 9.4 and 10.3 in V2–V4). Only the bonk, the G6 HUD chime, the ding and the Post click reach the music's level or go over it (V3 and V4 add the Orb servo). Those are the moments the SFX owns.
- **Stems:** music + sfx + dialogue equals the mix (residual −132.5 dBFS).

## A/V sync

- **Picture.** Muxed onto the silent masters of 10:09 (1080p) and 10:11 (4K). The SFX build read `out/season/intro/picture/intro-events.json` of 10:08 (md5 `f37ea409…`), and `verify.py` confirms that is the file on disk now.
- **Cues on picture.** All 42 picture-keyed cues sit on their picture frames. The typed line matches the picture keystroke for keystroke: f18–49 and f64–83, with shift+enter at f63.
- **Audible starts.** Each of the 103 main and blip cues starts within −1 to +20 ms of its frame, measured on its own file. The one exception is the rumble, which grows in by design (+40 ms).
- **Lengths.** Every MP4 has 720 video frames at 24 fps, both streams start at pts 0, and both last 30.000 s. The video packets are bit-identical to the silent masters (stream copy).
- **Encoder padding.** A decoder that ignores the edit list outputs 768 extra samples of AAC padding past 30.000 s, at −106 dBFS.
- **Alignment.** The decoded MP4 audio cross-correlates against the source WAV at a lag of 0 samples, both over the whole programme and locally at f24, 120, 225, 240, 300, 345, 360, 420, 480, 540, 630, 690, 705 and 719.
- **The ding.** It is placed at sample 1,410,000 (f705). Its onset measures −0.3 to +1.7 ms from f705 in the MP4 audio. The picture changes exactly at f705: the frame difference is 6.8 into f705 and 0.0 the frame before.

## Rebuild

```bash
audio/.venv/bin/python audio/intro-sfx/build_intro_sfx.py   # after any picture change (reads intro-events.json)
audio/intro-mix/scripts/run_all.sh                           # about 80 s: mixes, stems, AAC, muxes, QA
```

It uses `audio/.venv-mix` (read-only) and the bundled Remotion ffmpeg with libfdk_aac. The scripts are `mixlib.py`, `analyze_inputs.py`, `mix_intro.py`, `encode_mux.sh`, `sfx_balance.py` and `verify.py`. Re-run it after any change to the score, SFX, vox or picture. `python scripts/mix_intro.py --dry V1` prints the balance checks without writing anything.
