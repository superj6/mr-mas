All four scores are rebuilt to SCRIPT v2.1. Masters, stems, MIDI, `cues.json`, the analysis files and `VARIATIONS.md` (with a "v2.1 changes" section) are regenerated, plus the motif study. Every master is −14.0 LUFS (−14.01 to −14.03) and −1.15 dBTP, exactly 1,440,000 samples, with no clicks. The stems sum back to the master within −109 dB (V4 −123 dB). I checked the result by measurement, spectrograms and piano rolls only; nothing was auditioned by ear.

**Decisions to confirm**
- **Ding at f705 and bonk at f150 are no longer in the music.** SCRIPT §3.9 / §9.2 give both to the SFX, so the music plays nothing new at f705 and f150. `cues.json` still lists both frames, marked as SFX-owned. If you wanted the ding kept in the theme, say so.
- **The VO duck is baked into the stems** (every stem except the sub −6 dB, strings −9 dB, over f23–91, lifted in the f57–71 pause, −3 dB on the f90 pluck). The mix team must not duck the music again; trim the music bus to about −15.5 LUFS before VO, SFX and chant.
- **Two straight off-beats moved half a frame**: the 1993 beeper to f127.5 and the last skyline pluck to f622.5, per the script's "+7.5 in the music" rule. The cue frames stay f127 and f622. V3 swings the beeper to f130 as scripted.

**What changed**

*Bar 9 roll call (f480–539), all variations*
- Eight stabs at 480, 487.5, 495, 502.5, 510, 517.5, 525, 532.5. Top line F5 F5 F5 F5 G5 A♭5 C6 F6.
- Harmony: Fm9 ×4, then D♭maj7(♯11) ×2, then C7(♯9♭13), then an open fifth F–C with no third on stab 8.
- Stop-time: bass on every stab, sub F1 on stabs 1 and 8, stab 8 rings to f539. The viola/cello F4 sounds inside stab 1 and stops with it.
- The "music fired" mute, the f510 slam, the bloom, the hearts material and the `fired` stem are all removed. The old mute window now measures −15 to −16 dBFS, level with bars 8 and 10, and the groove runs straight into f540.
- Orchestration per variation:
  - **V1:** 2 trumpets and 2 trombones, chip lead an octave up, felt piano voicing underneath, upright bass and kick.
  - **V2:** horns and trombones with the chip, pizzicato basses, timpani on stabs 1 and 8.
  - **V3:** full-band shout kicks with the chip lead.
  - **V4:** piano right-hand clusters doubled by the chip.

*Other open score notes from §3.1 / §9.2*
- **Harmon trumpet:** moved to bar 10 on its own `harmon` stem (C5, B♭4, A♭4, then a sampled fall off D5). V2's line runs through bar 11; V3 trades two-beat phrases with the chip; V4's piano right hand plays it in octaves. No Harmon anywhere before f540.
- **Brass only at the eight accents:**
  - f195: a cup-muted stab.
  - f240, f300, f360: trumpets and trombones only.
  - f414–419: a new trumpet rip up to C.
  - f420: the only full shout, with saxes.
  - f480–532.5: the roll call.
  - f630: the horn swell.

  V2's tuba and sustained brass pads are cut.
- **V2 heartbeat figure removed** everywhere. V2's chip now plays only the knee statements, and V2 gains its scripted cellos/basses cold-open fifth, pizzicato walking bass, low winds and harp.
- **No thirds where scripted:** the A♭2 at f60 is deleted in every variation, the D♭ ends at f71, and the title sub now drops C2 to F1. Measured A/A♭ against F is 0.006–0.06 at the title and stab 8, and ≤ 0.02 in the cold-open windows. The one exception is V4, where the natural overtones of its held low felt F1 read up to 0.14; nothing written there has an A or A♭.
- **The rest of the §9.2 list:**
  - glints at f30/f45 and the cold-open violins cut;
  - 1993: piano Fm9 left hand to f164, and chip voices added at f168–179;
  - 2008: tape wow and the extra kicks removed, strings swell at f225;
  - dinner: bar-6 walk fixed to D♭3 C3 A♭2 F2, reed organ at f285, pizzicato at f355, drum fills added;
  - bar 11 rolls and arpeggios put on the 16th grid;
  - title chip arpeggio F5–B♭5–E♭6–F6 added, celesta at f690 cut;
  - V4 is now piano, chip and sub only (clarinet and title string pad cut).

**Balance** (piano · orchestra · big band · chip, rhythm excluded, time-weighted)
- **V1 (primary):** 34 · 28 · 11 · 27 against a target of 35 · 30 · 10 · 25. Chip is at least 21% in every section after f120.
- **V2:** 24 · 43 · 10 · 23 against 25 · 45 · 5 · 25. Big band is above target because the longer Harmon line and the roll-call horns count there.
- **V3:** 33 · 14 · 18 · 35 against 30 · 15 · 15 · 40.
- **V4:** 58 · 0 · 0 · 42.

The old gated whole-stem share over-weighted short stems like the Harmon and the roll-call brass, so I changed the metric; the legacy numbers are still in `analysis/V*_balance.json`.

**Measured cue timing** (ms from the music frame, first audible rise on the sharpest carrying stem)

| Music frame | V1 | V2 | V3 | V4 |
|---|---|---|---|---|
| 0 / 15 (piano) | +4 / −1 | +4 / −2 | +4 / −2 | +4 / −7 |
| 60 D♭ (piano) | +12 | +14 | +1 | 0 |
| 90 pluck | +2 | +6 | 0 | 0 |
| 105 / 108 / 112 / 116 (chip) | 0 / 1 / 2 / 2 | 0 / 1 / 2 / 1 | 0 / 1 / 2 / 2 | 0 / 1 / 4 / 1 |
| 120 drop | +2 | +1 | +2 | +1 |
| 127.5 (V3: 130) / 135 / 165 / 172 | 0 / 0 / 0 / 1 | 0 / 0 / 0 / 0 | 0 / 1 / 0 / 1 | 0 / 0 / 0 / 1 |
| 180 / 195 | +4 / +2 | 0 / +2 | +1 / +6 | +6 / +1 |
| **240 / 300 / 360 / 420** | 0 / 1 / 0 / 0 | 0 / 1 / 1 / 1 | 0 / 1 / 0 / 0 | 1 / 1 / 0 / 0 |
| 355 pizz | −14 | +13 | −3 | +1 |
| 414 rip start | +13 | – | +13 | – |
| 465 / 470 / 475 | ≤ 2 | ≤ 1 | ≤ 1 | ≤ 1 |
| **Roll call 480 … 532.5** (chip double) | 0–2 | 0–1 | 0–2 | 0 |
| Roll call, section itself | −15…+14 | −24…+20 | −7…+21 | −1…+11 |
| 540 / 555 / 570 / 585 | 0 / 1 / 0 / 0 | +6 (harp) / 0 / 0 / 0 | 1 / 0 / 0 / 3 | 1 / 0 / 1 / 0 |
| 600 / 615 / 622.5 | 0 / 0 / 1 | 0 / 0 / 0 | 1 / 1 / 2 | 1 / 1 / 1 |
| Harmon onset at f540 | +6 | +6 | +6 | – |
| **630 title** | 0 | 0 | 0 | 0 |
| 660 celesta (V4 piano) | +1 | +1 | +2 | −3 |
| 690 drone (a fade-in, not a hit) | +9 | +9 | +9 | +9 |

All notes are placed on the grid exactly. The "section itself" row shows the brass and horn samples' own slower attacks, blurred by the previous stab's reverb.

**Also worth knowing**
- The pack has no bass clarinet, so V2's D♭ at f60 is on bassoon.
- The mix team's `audio/mix/music/*-rollcall.wav` and the animatic temp track are still built on the old bar 9, and they belong to other teams.
- A backup of the v2.0 sources is at `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/backup_v20/`.

**Files** (all in `/home/jgon/project/art/mrmas/audio/theme/`)
- Masters: `theme-V1-chipchamber`, `theme-V2-orchestralnoir`, `theme-V3-pixelswing`, `theme-V4-pianopixels` (each `.wav` and `.mp3`)
- `theme-motif-study.mp3`
- `stems/V1-*`, `stems/V2-*`, `stems/V3-*` (piano, strings, brass, winds, harmon, bass, drums, perc, chip, sub, fx); `stems/V4-piano`, `stems/V4-chip`, `stems/V4-sub`
- `midi/theme-*.mid`
- `cues.json`
- `VARIATIONS.md`
- `analysis/V*.json`, `analysis/V*_balance.json`, `analysis/V*.png`, `analysis/V1_roll_*.png`
- Score scripts: `score/common.py`, `score/v1.py`, `score/v2.py`, `score/v3.py`, `score/v4.py`, `score/motif.py`
- Engine: `engine/render.py`, `engine/sampler.py`, `engine/export.py`
- Tools: `build.py`, `analyze.py`, `stemtable.py`, `make_cues.py`, `proll.py`