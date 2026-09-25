# The Knee (Main Title): four variations

> **LOCKED (showrunner, 2026-09-25): V1 "Chip Chamber Jazz" is the show's main title.** V2–V4 are kept as alternates, for example V4 for quieter episodes.

All four variations are the same 30.000 s cue: 720 frames at 24 fps and 96 BPM, with 15 frames per beat and 12 bars. They follow `show/intro/SCRIPT.md` **v2.1**. They are built from the same original material. What changes between them is orchestration, feel and balance.

**V1 "Chip Chamber Jazz" is the primary mix.** V2, V3 and V4 are alternates.

## Mix-stage rides (2026-09-25 review pass)

The scores and stems in this folder are **unchanged** by the review pass. The re-recording mix (`audio/intro-mix/scripts/mix_intro.py`) now builds its music bus from `stems/` and rides individual stems. These are the balance moves the sound supervisor asked for:

- **The Harmon line (bar 10) +6 dB.**
  - V1: with the piano −3 dB over f540–599.
  - V2: the Harmon rides through bar 11, with the strings −3 dB in bar 10.
  - V3: the trumpet's beats 1–2, with the piano −3 dB.

  It was 16–30 dB under the rest of the score at 500 Hz. It now sits 1–4 LU under the rest.
- **The trumpet rip (accent #5, f414–419) +6 dB,** with the strings (V1) or the piano (V3) −3 dB under it.
- **Under the vault klaxon (f345–359):** the strings −3 dB (V1, V2), or the chip −3 dB (V3, V4).
- **The music bus:** −2 dB under the ALYI "A-!" (f299.5–304.5), and +2 dB on the body of the f420 hit (f421–432), so f420 reads as the biggest hit.
- **V2 roll call (bar 9).** The brass stem is gated −15 dB between stabs 1–7, the chip is +4 dB on stabs 1–7, and stab 8's chip and timpani ring is choked −5 dB over f536–539.
  - Before: the stabs' hall tails masked the next attack, so stabs 2, 4 and 8 read 48–88 ms late, and the gap after stab 7 was 4.9 dB.
  - After: every stab speaks 0 to +21 ms after its cut, and every gap is at least 10.5 dB.
  - A score-side fix (the horns starting 1 frame early, with shorter releases) was tried and rejected. It left the hall tails in, and it put the on-beat stabs 27–42 ms ahead of their picture cuts.
- **The bookend (f690–704):** everything except `sub` and `fx` plays "inside his monitor": −4 LU, low-passed at 3.5 kHz, 30 % width.

If a variation is re-rendered, re-run `audio/intro-mix/scripts/run_all.sh`. The rides are frame-based and don't need re-measuring unless the arrangement moves.

## v2.1 changes (2026-09-25)

These changes rebuild all four scores to SCRIPT v2.1. They apply to the scripts in `score/`, the masters, the stems, `cues.json` and this file.

**Bar 9 is now THE PLAYERS roll call (f480–539) in every variation.**
- There are eight stabs on straight eighths. They sound at f480, 487.5, 495, 502.5, 510, 517.5, 525 and 532.5. The picture cuts on the floor of each of those, so it leads the music by half a frame.
- The top line is the knee, F5 F5 F5 F5 G5 A♭5 C6 F6.
- The harmony is Fm9 ×4 → D♭maj7(♯11) ×2 → C7(♯9♭13) → an open fifth F–C with no third. Stab 8 rings to f539.
- Each stab has the bass on it. The sub plays on stabs 1 and 8.
- The bar is stop-time: no ride and no sustained strings. The viola and cello line lands on F4 inside stab 1 and stops with it.
- Each variation orchestrates the stabs its own way:
  - **V1:** 2 trumpets and 2 trombones, open and short, doubled an octave up by the chip lead. The felt piano plays a rootless voicing underneath, with upright bass and kick.
  - **V2:** horns and trombones with the chip, which plays the top line at pitch while the horns double it an octave down. Pizzicato basses play, and the timpani plays on stabs 1 and 8.
  - **V3:** full-band shout kicks (3 trumpets, 3 trombones, 2 tenors) with the chip lead. The drummer kicks every stab, with a crash on stabs 1 and 8.
  - **V4:** piano right-hand clusters doubled by the chip, with the left hand and a triangle on the root.

**Removed:**
- the "music fired" mute (f495–509), the f510 slam, the bloom, the shimmer, the heart glissando and the f526 revswell;
- the `fired` stem. The engine no longer has a default mute window.

In the old mute window, bar 9 now measures −15 to −16 dBFS RMS, level with bars 8 and 10, so the groove runs straight into the skyline at f540.

**Open score notes from SCRIPT §3.1 and §9.2, now applied:**
- **The Harmon-muted trumpet** moves to bar 10, on its own stem (`harmon`). It plays C5 over f540–564, B♭4 on f565 and A♭4 over f570–584, then falls off D5 over f585–599, sampled with a real pitch fall.
  - V2's line runs on through bar 11 (straight there) and falls off B♭4 by f629.
  - V3 trades two-beat phrases: the trumpet plays beats 1–2, and the chip answers on beats 3–4, including the D fall.
  - V4's piano right hand plays the line in octaves.
  - There is no Harmon anywhere before f540. V1's bar-7 phrase and V2's dinner phrase are gone.
- **Brass is used only as accents.** The eight accents are:
  1. f195: a cup-muted stab through the sample-chip filter;
  2. to 4. f240, f300 and f360: trumpets and trombones only, with no saxes or tuba;
  5. f414–419: a trumpet-section rip up to C (sampled with a pitch rip), which replaces V1's timpani roll;
  6. f420: the only full shout, with saxes;
  7. the roll call;
  8. f630: the horn swell.

  V2's tuba and its sustained brass pads are cut, so V2's brass is horns and trombones only.
- **V2's lub-dub heartbeat is gone.** It was the triangle heartbeat in bars 1, 2, 9, 10 and 12, plus the chip pulse doubling the ostinato and the accelerating skyline pulses. There is now no pulse figure that could read as a heart monitor.
  - The chip is reduced to statements of the knee: the glints, the leap, the 1993 flat line, the bar-4 hook, the four card-bar Fs, the kink, the roll call, the plucks and the title F6.
  - V2 also gains its scripted colours:
    - celli and basses holding the cold-open fifth (instead of the sub), with a harp harmonic;
    - pizzicato walking bass;
    - low winds (bassoon and clarinet);
    - a harp roll on the hits;
    - pizzicato strings and harp on the bar-4 hook, with no kit.
- **No third where the script says none:**
  - The felt A♭2 at f60 is deleted, in every variation. The D♭ colour now ends at f71.
  - The title sub drops from C2 to F1 over 1.6 s. It used to start on A1.
  - Stab 8 and the title are open fifths or quartal.

  Measured chroma, as A / A♭ relative to F:
  - The title (f633–655) and stab 8 measure 0.006–0.06.
  - The cold open around the pause measures ≤ 0.02.
  - The only exception is V4, where the natural overtones of the held felt F1 read 0.08–0.14 in the cold open and at stab 8. Nothing written there has an A or an A♭.
- **One owner per sound.** The SFX now owns these, so the music no longer plays them:
  - the ding at f705 (removed from every `title()`);
  - the square-bass bonk at f150;
  - the music revswell at f105;
  - the brush roll and revswell at f228;
  - the celesta at f690;
  - V3's chip echo at f675.
- **Cold open:**
  - The chip glints at f30 and f45 are cut, and so are the violins over f58–113.
  - **The VO duck is baked into the stems.** Every stem except the sub drops −6 dB (strings −9 dB) over f23–91, with a 2-frame attack and a 6-frame release. The duck lifts inside the semicolon pause, and the f90 pluck sits at −3 dB.
- **1993:**
  - The piano's left hand plays Fm9 (F2 C3 A♭3 G4), pedalled to f164, and the sub holds under the dialog.
  - The straight off-beat sounds at f127.5. V3 swings it to f130.
  - The chip gains voices at f168–179: the arpeggio F–A♭–C–E♭–F, a second pulse voice and a triangle bass. V1 adds a brushed-snare swell, V2 a harp glissando with a string swell, V3 a brush fill and V4 a piano run.
- **2008–14:**
  - The 15-cent tape wow is removed. The sample-chip filter stays.
  - The boom-bap kicks are removed, leaving the kick on beats 1 and 3.
  - The chip doubles the hook an octave up.
  - A string swell now plays at f225–239. V3 plays a drum fill with a trumpet pickup there instead, and V4 a piano run.
- **Dinner:**
  - The bar-6 walk is fixed to D♭3 C3 A♭2 F2. The old A2 clashed with the klaxon.
  - A reed-organ (harmonium, GM 21) swells on D♭ over f285–299. In V4 it is a chip square.
  - Pizzicato plays at f355 on the swung off-beat. V3 plays a piano stab there and V4 a chip pluck.
  - Drum fills are added at f460–464.
  - V1 adds brush pickups at f282, f340 and f403.
  - Swung off-beats are locked: felt, grand, brushes and upright are humanised by 3 ms or less, and the felt-mechanics thump follows its note's lock. V4 was swinging at +9.5 frames; it is now on the scripted +10 grid.
- **Skyline:**
  - The f622 pluck sounds on the straight "and" at 622.5.
  - The bar-11 roll and arpeggio are straight 16ths on the grid (600, 603.75 … 622.5). Nothing now falls at 613.1 or 620.6.
  - A chip noise sweep joins the riser. It is one continuous LFSR voice with a stepped clock and no retriggered attacks. V2 leaves it out.
- **Title:**
  - The chip plays a straight-16th arpeggio F5–B♭5–E♭6–F6 over f630–641 into the sustained F6, over C6 and a triangle F3.
  - The violas are thinned by about 3–4 dB so the vocal PAD can sit on top.
  - The celesta plays alone at f660. In V4 this is a piano F6.
- **Chip throughout:** in V1, the dinner ostinato and the skyline chip are raised by about 4–5 dB. The chip is now at least 21 % of every section after f120.
- **V4 is piano, chip and sub only** (§9.2 item 7a):
  - The clarinet line and the title string pad are cut. The counter-line moves to a soft 50 % chip square.
  - The bass drum, cymbals and glock are cut.
  - The cold open is piano alone, with the low F1 and C2 under the pedal.
- **Engine:**
  - `SampleSet.render` now takes a `bend` argument, used for the rip, the falls and the scoops.
  - `Score` gains `stem_auto`, which applies per-stem gain rides. The VO duck uses it.
  - Latency is compensated for pizzicato, horn staccato and Harmon.
  - New tracks: `reed`, `snes_cup`, `snes_hn`, `snes_pizz`, `snes_harp`, `snes_cbpizz`, `snes_sax` and `noisesweep`.
  - Export deletes stale stems before it writes, which removed the old `V*-fired.wav` and V4's winds and strings.
- **Analysis:**
  - `analyze.py` measures the v2.1 cue list, including the eight roll-call stabs.
    - The onset is taken as the first audible rise on the sharpest carrier (808 click, timpani or chip double) before the section itself.
    - It also measures the Harmon onset and the no-third windows.
  - `stemtable.py` reports the balance as a time-weighted, K-weighted share with rhythm excluded. The legacy gated whole-stem figure is kept but over-weights short stems such as the Harmon and the roll-call brass.
- **The motif study** is rebuilt with no tape wow and with the C2→F1 sub.

## Shared material

**The knee** (F F F F G A♭ C F) is the identity. It appears as:
- the F5 pings and glints of the cold open;
- the leap on Post (f105–116);
- the 1-bit beeper's flat line (F F F, f120–135);
- the whole knee, swung, on the sample-chip band (bar 4);
- the four chip Fs across beats 2–3 of each card bar, which become E on C7alt (the kink);
- the kink G A♭ C at f465–475;
- **the eight roll-call stabs (bar 9)**;
- the slow knee on the skyline plucks (f540–622.5);
- the title F6.

**The fidelity tiers:**
- T0: the dark room;
- T1: 1993, 1-bit;
- T2: 2008–14, the band through a 16-bit sample-chip with BRR grit, Gaussian interpolation and echo, and no tape wow;
- T3: the dinner, full;
- T4: the roll call, then the skyline and the title.

**Harmony:**
- Bars 1–2 are an open fifth, with the ♭6 D♭ in the pause.
- **Fm(add9) at f120 is the first third.**
- Bar 4 goes D♭maj7 → Fm9 → C7(♭9).
- The cards are Fm11, D♭maj9(♯11), B♭m9 and C7(♯9♭13).
- The roll call goes Fm9 → D♭maj7(♯11) → C7(♯9♭13) → an open fifth.
- Bar 10 is the Fm line cliché.
- Bar 11 goes D♭ → C7.
- **The title at f630 is quartal:** C–F–B♭–E♭ over F, topped by G, with no A and no A♭.

**Shared cue behaviour:**
- **Hits:** f240, f300, f360, f420 and f630 are sample-accurate.
- **Roll call:** f480, 487.5, 495, 502.5, 510, 517.5, 525 and 532.5.
- **Plucks:** f540, 555, 570, 585, 600, 615 and 622.5.
- **SFX-owned:** the reverse swells into f120 and f540, the bonk at f150 and the ding at f705.
- **Loop:** the tail is gone by f719, and f0 starts from silence.

**Balance** is measured as a time-weighted, K-weighted loudness share, in the order piano · orchestral · big band · chip. The rhythm section (bass, kit and sub) is excluded. The Harmon counts as big band.

---

## V1: CHIP CHAMBER JAZZ (primary)
`theme-V1-chipchamber.wav/.mp3`

A felt upright piano carries the piece. It uses rootless jazz voicings, with a different swung comping cell under each name card.

- **Strings:**
  - a noir counter-line in violas and celli, in octaves, from f255 to the F4 inside stab 1;
  - a violin halo whose voices move G5→G5→A♭5→A♭5 and E♭5→F5→F5→E5;
  - a string swell into the dinner;
  - a tremolo riser on C–G;
  - the quartal title.
- **The chip lead** is on every statement of the knee. It keeps the swung flat-line ostinato through the dinner and doubles the roll-call stabs an octave up.
- **The trio:** piano, upright bass and brushes. The bass walks, layering GM finger bass with a contrabass pizz.
- **Brass** plays only at the eight accents.
- **The one horn melody** is the Harmon trumpet in bar 10.
- **The reed organ** swells under ALYI.

**Balance:**

| | Piano | Orchestral | Big band | Chip |
|---|---|---|---|---|
| Target | 35 | 30 | 10 | 25 |
| Measured | 34 | 28 | 11 | 27 |

- **Chip share per section** (rhythm excluded):

  | Cold open | 1993 | 2008 | Dinner | Roll call | Skyline | Title |
  |---|---|---|---|---|---|---|
  | 26 | 49 | 94 | 22 | 25 | 21 | 24 |

  The 2008 bar is the whole band through the chip filter.
- **The roll call:** big band 41 · chip 25 · piano 32.

## V2: ORCHESTRAL NOIR, CHIP HEART
`theme-V2-orchestralnoir.wav/.mp3`

The cinematic take, mostly in straight time with the same jazz harmony.

- **Who carries the harmony:** strings, low winds (bassoon and clarinet), harp and timpani. The Salamander grand recedes to colour.
- **Brass** is horns and trombones only, used as accents.
- **Pizzicato bass** walks through the dinner and the skyline.
- **The card hits** are orchestral tutti (strings sfz, horns, trombones, timpani, bass drum, low piano and sub), with a harp roll. The reed organ joins at f300. At f414–419, horns and low strings crescendo into the biggest hit at f420.
- **The chip "heart" is the knee itself:**
  - there is no pulse or lub-dub figure;
  - the chip plays the flat-line Fs in the card bars and the top line of the roll call;
  - it plays the skyline plucks an octave up, and the title F6.
- **The noir centre:** the Harmon trumpet over bars 10–11, lightly swung and then straight, over harp and low strings.

**Balance:**

| | Piano | Orchestral | Big band | Chip |
|---|---|---|---|---|
| Target | 25 | 45 | 5 | 25 |
| Measured | 24 | 43 | 10 | 23 |

Big band sits above its target because the longer Harmon line (the noir centre) and the roll-call horns count there.

## V3: PIXEL SWING
`theme-V3-pixelswing.wav/.mp3`

The most playful version: the chip leads over a small swing band.

- **Swing** starts in bar 3, where the 1993 hook swings (F f120, f130 and f135) over brushes.
- **The rhythm section:** the brushes switch to sticks at f240, and the walking bass runs through bars 4–10.
- **The chip sings the noir line** an octave up, with a harmony voice in bar 8 and a triangle wink.
- **The hits** are shout chords with a sax answer on the "and" of 2. Vibes double the comp.
- **The big band:**
  - f195 is a full-band shout through the chip filter;
  - f225 is a drum fill with a trumpet pickup;
  - f414 is a full-band rip with a snare fill;
  - the roll call is full-band shout kicks.
- **Bar 10:** the trumpet trades two-beat phrases with the chip.
- **Strings enter only at the skyline.** At the title the band shouts the quartal stack.

**Balance:**

| | Piano | Orchestral | Big band | Chip |
|---|---|---|---|---|
| Target | 30 | 15 | 15 | 40 |
| Measured | 33 | 14 | 18 | 35 |

Rhythm is about 17 % of the whole on top of that.

## V4: PIANO & PIXELS (intimate / minimal)
`theme-V4-pianopixels.wav/.mp3`

The quiet-episode intro: felt piano, chip and sub only. At the title, the vocal PAD (on its own bus) is the only other colour.

- **The cold open** is piano alone. The chip enters with the f90 pluck and takes the tune on the leap.
- **Card hits:** pedalled piano clusters, a chip chord and chip arpeggios, and a soft sub.
- **The left hand walks,** doubled by a soft triangle.
- **Chip voices:** a soft chip square sings the counter-line, and a chip "harmonium" swells under ALYI.
- **The roll call** is right-hand clusters doubled by the chip.
- **Bar 10:** the right hand takes the Harmon line in octaves, with a pianistic fall.
- **The title** is a piano quartal cluster with the chip and the sub.

**Balance:**

| | Piano | Orchestral | Big band | Chip |
|---|---|---|---|---|
| Measured | 58 | 0 | 0 | 42 |

---

## Deliverables
**Masters:** `theme-V*.wav`, 48 kHz / 24-bit.
- Integrated loudness is −14.0 LUFS (−14.01 to −14.03).
- True peak is −1.15 dBTP.
- Each file is exactly 1,440,000 samples, which is 30.000 s.
- The masters are music-only. **For the mix, trim the music bus to about −15.5 LUFS before VO, SFX and chant, and do not duck it again:** the VO duck is already in the stems.

**Previews:** `theme-V*.mp3`, LAME at 256 kb/s.

**Stems:** `stems/V<n>-<stem>.wav`.
- Stem names: piano, strings, brass, winds, **harmon**, bass, drums, perc, chip, sub, fx. **`fired` is retired.**
- V4 exports only piano, chip and sub.
- Stems are post-master-gain. Summing them reproduces the master with a residual of −109 dB (V4: −123 dB).

**Cues:** `cues.json` holds:
- the grid;
- the VO duck;
- the roll-call table (picture cut, music frame, top note, chord, bass, player);
- the eight brass accents;
- the SFX-owned sounds;
- the harmony map;
- 58 cue rows, each with its picture frame, music frame, owner and V1 carrying stems;
- per variation: file paths, LUFS and true peak, the no-third chroma windows, the bar-9 level and the measured onsets.

**Measured timing:**
- Measured on their sharpest carrier (808 click, timpani or chip double):
  - The card hits, the title and every roll-call stab land within 0–2 ms of their music frame.
  - The plucks land within 0–3 ms. The one exception is V2's f540, which reads +6 ms on the harp because the chip F6 from stab 8 runs into the pluck.
- Every listed cue is within ±25 ms, and nearly all are within ±15 ms.
- The widest are:
  - a felt-piano low D♭ at f60, +12 to +14 ms;
  - the pizzicato at f355, ±14 ms;
  - the start of the rip at f414, +13 ms.

The sections' own sample attacks (horns and trombones in the reverb of the previous stab) read within about ±20 ms; see `rollcall_section_onsets_ms`.

**MIDI:** `midi/theme-*.mid`, one track per instrument.

**Motif study:** `theme-motif-study.mp3`, 12.0 s. The knee head plays once per tier.

**Analysis:** `analysis/V*.json`, `analysis/V*_balance.json`, spectrograms in `analysis/V*.png`, and V1 piano rolls.

**Build:**
- Run `../.venv-theme/bin/python build.py V1 V2 V3 V4 motif`.
- Then run `analyze.py V1 V2 V3 V4`, `stemtable.py V1 V2 V3 V4` and `make_cues.py`.
- Each variation takes about 1 minute on the CPU.

## Sources and licenses (see `../samples/theme-pack/LICENSES.md`)
- **VSCO 2 CE (CC0):** strings, brass incl. harmon mute, clarinet, bassoon, timpani, cymbals, glock, harp, contrabass pizz.
- **VCSL (CC0):** vibraphone, tenor sax, hi-hat, cymbal swells.
- **Salamander Grand Piano (CC BY 3.0):** credit Alexander Holm.
- **Upright Piano KW (CC0):** the felt piano.
- **GeneralUser GS:** free for any music use. Used for the finger upright bass, brushes/jazz kit, reed organ, celesta and the sample-chip band layers.
- **Numpy-synthesized:** chip voices, the chip noise sweep, 808 sub, drone, brush sweeps and the shimmer.
- No voices, TTS or voice models are used.
- There is no bass clarinet in the pack. V2's D♭ at f60 is on bassoon as a stand-in.
