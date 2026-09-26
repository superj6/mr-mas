# MM-06 "Beeper, 1993 / Sample-Chip, 2008"

Composer C; fix 1 by composer A · OST-BIBLE §5.C2 · palette **P10 ERA TIERS** (T1 1-BIT, T2 EARLY-WEB16) + the render front · library suite.

| | |
|---|---|
| **Use** | Every 1993 part (Eps 1, 4, 7, 12, NESNEJ's included), the 2005–14 flashbacks (the 2008 keynote, the 2012 sale, TIDDER 2014) and the render-front transitions |
| **Grid** | 96 BPM, 4/4. Movement I straight (the machine doesn't swing yet); Movement II house swing (+10 frames, measured +10.1); machine lines straight (7.5 frames) |
| **Length** | 34 bars = 85.0 s (+ the BASE chord's ring, file 87.9 s) |
| **Levels** | Underscore −20.0 LUFS-I / −3.15 dBTP; album −14.0 / −1.15 |

Nobody has listened to this. Every judgement below is a measurement.

## Fix 1 (2026-09-26): what changed

- **Rule 4, the knee never completes.** Read by pitch class, the old line finished the knee late, twice:
  - b5–7: F F F F · G A♭ C · then bar 7's first note, **F5**, a fourth above the hanging C5, 2.2 s later;
  - b7–9: bar 7's F F F F · the kink up an octave · then bar 9's first arpeggio F4.
- **Now bar 7 opens on C5.** The kid re-strikes the C he left hanging, so the leap is still not taken. He then falls back to the flat line on F4 F4 F3: a fifth down, never a rising C → F. Bar 7 now holds three Fs, so the b7–9 run can't complete either.
  - Bar 7 was `r F5 F4 F4 F3 r r`; it is now `r C5 F4 F4 F3 r r`.
  - The engine's `knee_completion` now reads **0**, across the loop seam too, where it had read 2.
  - Every part that contains bar 7 inherits the change: Movement I and its lp7k alternate, and the 30 s cut-down.
- **Re-rendered on the fixed engine**, stems and parts included. The 16-bit pizzicato (`m16_pizz`) is re-tuned by the engine's pizz fix. The meter fix removes the false p95 warning.
- **Parts render with the engine's workers again.** The `workers=1` workaround for the old pool hang is gone (engine fix 3).
- The old masters are kept as MP3 in `render/_pre-fix1/`.

## The idea

This is **his past, as the machine heard it.** It is the chip's *memory* job (§1.9). The suite is two tiers of the same material, and a transition between them.

- **Movement I · 1993.** A kid pokes a 1-bit beeper. Two voices, on or off, no dynamics, mono and dry. Nothing in it swings, and the knee is never finished.
- **Movement II · 2005–14.** The band remembers the early web through the 16-bit sample-chip, exactly like the main title's 2008 bar. It is swung and cocky, in A♭-major colours and never in F major. Young Mas plays his line with **the nudge twice**; Gerg's Build **compiles** into a website.
- **The render front.** One chord upgrades itself: 1-bit → 16-bit → BASE.

It is the only cue in the batch that is almost all chip: 100 % in I, 91–93 % in II. Its sister cue MM-09 has no chip at all. That is the contrast the bible's pairing asks for.

## Palette

| Tier | Voices |
|---|---|
| **T1 · 1-BIT** | `bline` (the line) and `broot` (root blips): the engine's `chip.beeper` (50 % square, 22.254 kHz, 8-bit), fixed velocity, envelope on/off (no stepping, no decay), mono, no reverb. A gentle −3 dB shelf above 3 kHz takes the edge off, and a low-pass sits at 9 kHz. |
| **T2 · EARLY-WEB16** | Clean tracks rendered through `snes_post` (BRR grit, Gaussian roll-off, 144 ms FIR echo on the melodic voices, 12 kHz storage and a cup mute for the trumpet), all in the **chip** stem: the felt (`m16_felt`), the upright (`m16_bass`), brushes (`m16_brush`, `m16_jazz`, `m16_swish`), the lo-fi trumpet stab (`m16_tpt`), the chip lead (`m16_lead`, 50 % pulse with echo), **the Build** (`m16_build`, 25 % pulse, no echo, straight), 16-bit pizzicato and a 16-bit string pad. One **clean** element leaks in: a string swell before each section end (orch, 7–9 %). That is the present, and it foreshadows the render front. |
| **BASE** | Clean felt, strings sul tasto, clean upright: the render front's last tier |

## Form (cue time)

| Bars | Time | Section | Music |
|---|---|---|---|
| 1–4 | 0:00–0:10 | **I · the flat line** | Four Fs per bar in uneven registers (F4 F5 F4 F3), a new rhythm every bar. Under it the root channel walks the title's card roots **F – D♭ – B♭ – C** in octave-hopping 3+3+2 blips, never one pitch at an even rate. The flat line stays put while the world moves under it. **Loop.** |
| 5–8 | 0:10–0:20 | **I · the knee's cells** | The flat line, then **the kink G A♭ C left hanging** (b6, 0:12.5). In b7 the kid **re-strikes the C5** (0:15.3) and falls back to three Fs. Then the kink again, an octave up (b8, 0:17.5). The kid hasn't finished yet. The whole knee is never played, and by pitch class it never completes (both measured 0; fix 1). |
| 9–12 | 0:20–0:30 | **I · Fm9 arpeggios** | One hand-shape, 16ths up-down (F A♭ C E♭ G), over roots F – D♭ – B♭ – C. It sounds as Fm9, D♭maj9♯11, B♭m13 and the cadential Fm/C. **Loop.** |
| 13–16 | 0:30–0:40 | **I · NESNEJ, 1993** | **The Upsell**, straight, note for note (three cells, each a step higher), over a falling bass F – E♭ – D♭ – C; the close C5 G4 F4 lands at 0:38.75. **b17.1 (0:40.0) is the empty slot:** every stem rests (−161 dBFS). The SFX register "clunks with no bell". |
| 17 | 0:40–0:42.5 | **II · the band boots** | The band enters on beat 2 (0:40.625). **Every downbeat in Movement II is anticipated** on the swung and-of-4 of the bar before (a jazz push). So in the loop the push from b24 fills b17.1, while in the suite b17.1 stays the empty slot. |
| 18–24 | 0:42.5–1:00 | **II · young Mas** | A♭maj9 – D♭maj9 – Fm9 – E♭9sus4. The Water Line with **the nudge twice** (F F G-F G-F · C F) on the 16-bit felt, with the chip doubling only the nudges an octave up. A chip answer on the knee's cells (F F F G A♭ C, then B♭: never the whole knee). **One lo-fi trumpet stab** (b21.4&, 0:52.3). The line again with the chip an octave up (0:52.5); the nudge twice more (b24); **the clean string swell** into the push (0:59.8). **Loop b17–24 (the engine's loop file, 480 frames).** |
| 25–32 | 1:00–1:20 | **II · the dial-up era** | **Gerg's Build compiles** in 16-bit: 4, 8, 12, then 16 sixteenths (b25–28), straight 16ths over the swung band, doubled by 16-bit pizzicato on each group's head. A 16-bit pad is the napkin. The trumpet push goes into b29 (1:09.8, the site goes live), the ride comes in, and **the felt joins** (Mas is with him). The tag **"shipped"** (C5 F5, straight) with the band's last hit on an F–C–G open fifth ends it (b32.3, **1:18.75**). **Loop (part):** b25–32 with a push back into b25 instead of the tag. |
| 33–34 | 1:20–1:25 | **Render front** | One chord, **Fm(add9) = F2 C3 A♭3 C4 G4**: 1-bit (a 32nd-note arpeggio over an F2 channel, 1:20.0) → 16-bit (1:21.25) → **BASE** (clean felt, strings, upright, 1:22.5), ringing. The top is G4, under the SFX `render_front_sweep` (F4 → F6). |

## Files (`render/`)

| File | What |
|---|---|
| `…-underscore.wav/.mp3` | the picture master, −20 LUFS-I (Movement I sits about −22 in it, Movement II about −19) |
| `…-album.wav/.mp3` | the album master, −14 LUFS-I |
| `stems/…-{chip,strings,piano,bass}.flac` | They sum to the underscore master (residual −174 dB). Nearly everything is in **chip**; strings, piano and bass are the clean swell and the BASE tier. |
| `…-loop.wav`, `-loop-tail.wav`, `-loop-x3-preview.mp3` | **young Mas, b17–24**: 20.0 s = 480 frames, seam clean, verify −70.5 dB (the engine's expected lead-in signature; fix 1 re-render) |
| `parts/…-m1-1993.wav` · `-m1-1993-lp7k.wav` | Movement I (b1–b17.2, ending on the slot) at the underscore level, and **the under-dialogue alternate low-passed at 7 kHz** (P10) |
| `parts/…-m2-2008.wav` | Movement II, ending on "shipped" |
| `parts/…-render-front-fwd.wav` · `-render-front-back.wav` | the render front forwards (**the 5 s cut-down**) and **backwards** (BASE → 16-bit → 1-bit, "downgrading…", dead stop on the 1-bit) |
| `parts/…-m1-flat-line-loop.wav` · `-m1-arps-loop.wav` · `-m2-dial-up-loop.wav` | the other seamless loops: b1–4, b9–12, b25–32 (+ tails and ×3 previews) |
| `parts/…-m2-young-mas-reduced-loop.wav` · `-m2-young-mas-solo-loop.wav` | **variants** (§6.7): the 16-bit trio only; the 16-bit felt alone plus the chip on the nudges |
| `parts/…-cut30-1993.wav` · `-cut15-young-mas.wav` | **cut-downs**: 30 s = b5–16 + the slot (knee cells → arpeggios → NESNEJ); 15 s = young Mas b18–23 + an A♭maj9 button |
| `parts/…-m2-base-blend-{piano,bass,drums,brass}.flac` | **Movement II before the sample-chip** (clean felt, upright, brushes, trumpet), level-matched to the 16-bit master, so a mixer can blend BASE in (§5.C2). **Not in the master.** |
| `parts/…-parts.json`, `.mid`, `-pianoroll.png`, `.cue.json` | the parts table, MIDI, piano roll and cue sheet |

Featured level (P10): add **+4 dB to Movement I** and **+2 dB to Movement II**. Nothing else changes.

**Parts, measured** (fix 1 re-render: every part is within 0.03 LU of batch 1, all loops seamless).
- **Movement I** −21.7 LUFS-I. The lp7k alternate is within 0.02 dB of it: the 1-bit voices are already shelved above 3 kHz and low-passed at 9 kHz, so 7 kHz changes little. If dialogue fights it, a 2–4 kHz dip is the better tool.
- **Movement II** −18.9.
- **Render front:** forwards −20.4, backwards −19.6.
- **Loops:** −18.8 to −22.8, all seamless.
- **Cut-downs:** 30 s −21.4, 15 s −18.7.
- **True peak:** every part ≤ −3.15 dBTP (Movement II and the reduced loop are held there by a safety limiter; the stitched master has one too).

## Loop points

| Loop | Bars | Start | Length |
|---|---|---|---|
| I · flat line | 1–4 | 0:00.0 | 10.0 s / 240 fr |
| I · arpeggios | 9–12 | 0:20.0 | 10.0 s / 240 fr |
| **II · young Mas (engine loop)** | 17–24 | 0:40.0 | 20.0 s / 480 fr |
| II · dial-up (with push) | 25–32 | 1:00.0 | 20.0 s / 480 fr |

## Measured (final render)

| Check | Result |
|---|---|
| Underscore / album | −20.01 LUFS-I / −3.15 dBTP · −14.0 / −1.15 |
| Short-term (the engine's meter, fixed) | p95 **−17.6**, median −20.4 (limit ≤ −17 ✓) |
| Per movement (short-term) | I −21.4 to −23.6 (target −22 ✓) · II −17.2 to −20.8 (target −20; about 1 dB hot at the melody bars) |
| Balance | I **chip 100 %** ✓ · II **chip 91 / 93 %** (target about 90 ✓) · render front 35 · 8 · 0 · 57 |
| The empty slot | −161 dBFS ✓ |
| F-major / no third (the tag) | **OK** on the new check: no written A over an F bass; 5 windows are over 0.08 sieved (worst 0.122), all *explained*, as partials of written notes. The engine lists a repeated chip peak at 448 Hz (65.2, 75.2 and 76.45 s, in the dial-up era) as a fixed resonance, but those windows still pass. No third on the tag: A 0.004, A♭ 0.0 ✓ |
| Spectrum | 2–6 kHz −18.2 dB ✓ · centroid **437 Hz** (bible range 450–800: slightly dark, from the 1-bit root channel) |
| Motifs | KINK 12×, UPSELL 1×, BUILD 4× · whole knee **0** ✓ · knee completion by pitch class **0** ✓ (was 2) |
| Swing | the 16-bit band +10.0–10.1 frames ✓ · beeper and Build 7.5 (straight) ✓ |
| Hits | 12 of 12 within ±10 ms (−6.7 to +2.7) |
| Layer check (Movement II) | the Water Line on the felt is **+4.3 dB over the comping**; the chip double sits 6.8 dB under the melody; the Build leads the dial-up era over the comping |

## Rulings I made (flag if you disagree)

1. **The empty slot versus the downbeat.** §5.C2 puts NESNEJ's slot at the end of bars 13–16, which is Movement II's first downbeat. So Movement II **anticipates** its downbeats (pushes on the and-of-4): the suite keeps b17.1 empty, and the loop stays whole. The same device carries every Movement II section change.
2. **The flat line always has uneven registers.** The motif matcher therefore does not "find" FLAT_LINE (it wants four identical pitches); KINK, UPSELL and BUILD are matched note for note.
3. **"Young Mas" is a transformation** (the nudge twice, §2.2 Eps 2–3), so WATER_LINE is not matched literally.
4. **The dial-up era starts on A♭maj9, not Fm9**, so a single push chord serves both the young-Mas loop and the suite. The Build (F minor cells) sits on A♭maj9 as its 13, maj7 and root.
5. **The chip answer** in b20 plays F F F G A♭ C and turns away to B♭. It is knee cells, and never the whole knee.

## What a human must audition

1. **0:00–0:10, the 1-bit flat line.** Charmingly harsh or fatiguing? (Also hear `parts/…-m1-1993-lp7k` for dialogue.)
2. **0:12.5 and 0:17.5, the kink left hanging.** Does it read as "the kid hasn't finished", not as an error? **Fix 1:** at **0:15.3** the kid re-strikes the hanging C5, then drops to the flat line (F4 F4 F3). Does that sound stuck, as meant, and never like the knee finishing? It should also not sound like a V → I cadence.
3. **0:30–0:40.6, the 1-bit Upsell and the empty slot**, with the SFX register clunk laid in at 0:40.0. Does the missing bell land?
4. **0:40.6–1:00, the 16-bit trio.** A memory of 2008, or a video game / Nintendo overworld? Is "the nudge twice" charming or smug?
5. **1:00–1:18.75, the Build over the swung band.** Straight 16ths against swing: crisp or lurching? Does "shipped" end it?
6. **1:20–1:25, the render front.** One chord upgrading (no gap at 1:21.25 or 1:22.5) under the SFX sweep. Also hear the backwards part.

## Weaknesses (known)

- **The 16-bit tier is a filter on sampled instruments,** not a real SPC700 render. It may read as "lo-fi band" more than "2008 web". An ear should compare it with the main title's 2008 bar.
- **Movement I is two squares for 40 s.** Past 10–15 s it may fatigue, so library use should be ≤ 1–2 loop passes (§6.7).
- **The centroid is 437 Hz,** slightly under the 450–800 target: the 1-bit root channel carries a lot of low end.
- **Movement II runs about 1 dB over the P10 underscore level** at the melody bars (b18, b22).
- **The BASE-blend stems are clean renders of the same notes,** so they are phase-coherent with the 16-bit stem only approximately: the BRR path shifts the timing slightly. Blend by level, not by null.
- The render front's 1-bit tier is an arpeggiated chord (a 1-bit machine can't hold five notes), so it is "the same chord" in pitch content only.
