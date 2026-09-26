# MM-09 "The Board's Side" + MM-09x "What They Didn't Know"

Composer C; fix 1 by composer A · OST-BIBLE §5.C1 · palettes **P02 PROCEDURE** (the table; an exit from his POV) and **P08 OUTS KIT** (09x: REVERSAL) · to picture, Ep1 Act Four.

| | |
|---|---|
| **Picture** | `E01-S27a–h` (sc 27, pass one of THE BLIP, TOLD TWICE) and `E01-S28` (the card `WHAT THEY DIDN'T KNOW`) |
| **Bar 1** | **14:34.0**, sc 27's downbeat. MM-08's Rewind lands here; the first chord is B♭m(add9), as the handoff asks. |
| **Grid** | 96 BPM, 4/4, straight, **0 ms humanisation on every track** (the exit rule, §6.9 item 5). 1 bar = 2.5 s = 60 frames. |
| **Length** | 44 bars of sc 27 + the card (b45.1–b46.2) = 113.1 s, then the felt F4 rings on (file 114.9 s) |
| **Levels** | Underscore −20.0 LUFS-I (−4.36 dBTP); album −16.0 LUFS-I (a quiet cue, §6.5) |

Nobody has listened to this. Every judgement below is a measurement; §"Audition" says what an ear must decide.

## Fix 2b (2026-09-26): re-rendered on the retuned engine

The music is unchanged: no note, timing, EQ or level edit. This render only picks up the engine's fix-2b tuning of the solo violin, the horn stabs and the contrabass spiccato. It includes the parts and holds, and the fix-1 master MP3s are in `render/_pre-fix2b/`.

- **What moved by more than 10 cents:** six solo-violin notes. The C4-sample notes at 70.6, 73.4, 75.0 and 75.3 s sound **11.5 cents higher**; that sample's old automatic correction was 11 cents the wrong way. The C6-sample notes at 60.0 and 60.9 s sound 11.5 cents lower. The four horn stabs and the two spiccato notes (109.7–110 s) move 0–3.5 cents; the other violin notes 1–10 cents.
- **Measured:** masters −16.0 / −20.0 LUFS-I, −1.15 / −4.14 dBTP; p95 −17.6; balance 1 · 75 · 22 · 1 (as fix 1); 24 F-bass windows, written third 0, knee 0 / 0. The stems sum at −167.7 dB, and every part loop is seamless.
- **One new F-major flag, for the owner and for ears.** It is in one window, 74.99–75.61 s (b30.4), with sieved A/F 0.126, classed *resonance*. Rendered track by track, the A-band energy there is the **harp**: its F4 / B♭4 ring has peaks at 430–447 Hz, and the harp was not retuned. The window's F (the soft cello F2) holds only 6.3 % of the pitched energy, just over the check's 5 % judging floor, so a small shift in the retuned violin's energy tipped the window into judgement. No A is written; is anything major audible there?
- **Unchanged:** the b9.1 marker at 20.0 s still reads +10.7 ms.

## Fix 1 (2026-09-26): what changed

**The timing is untouched.** Nothing is re-timed to Act Four lock v3.

1. **Rule 12: no A♮ a third over any F.**
   - **The problem:** the viola whisper holds **A3** from b8.3 to b9.3 (18.75–21.3 s), and the spiccato pulse under it struck **F3** at 18.75, 19.69 and 21.25 s. That is a written F–A major third. (The B♭1 pedal already sat under the passage, so strictly F was not the bass, but the third was in the texture.)
   - **The fix:** for those two bars the pulse leaves out F. Cells `A8` and `B9` in `track.py` take the 11th (**E♭3**, a suspended colour) and a chromatic **E3** that falls to b9's E♭3 under the A. On b9.3, as the whisper reaches A♭3, the pulse takes **G♭3** (cell B's own pitch) instead of F3.
   - **What it keeps:** the whisper keeps its minor line cliché, B♭m → B♭m(maj7) → B♭m7 → B♭m6. So does the 3+3+2 accent shape, and the rule that the pitch always moves.
2. **The whole-cue scan found two more places.**
   - **The clarinet whisper in section c** used to end on **A3** (b22.2) over G♭maj7. Its tail and hall rang into the blank's lone F bass on b22.3: an A falling onto F. The whisper now **stops a step early**: B♭3 holds up to the blank, so the whisper's next step is missing too, like the procedure's.
   - **The blank's contrabass F1** is the solo-contrabass G♭1 sample played a semitone down. That sample has a body resonance, which the new F-major check reads at **111.3 Hz (an A2)** and marks FIXED in every blank (43.75, 60.0, 108.75 s; worst sieved A/F 0.156). The F1 notes, and only they, now play on `cb_f1`: the same contrabass with a narrow notch (Q 8, −10 dB at 111.3 Hz). F1's own partials, at 87 and 131 Hz, move less than 1.5 dB.
3. **Result:**
   - `written_third` **0**, and no A♮ sounds above any F anywhere in the cue, whatever the bass.
   - F-major check **OK**: 24 F-bass windows, 0 resonances. The two windows over 0.08 are the F bass's own 5th partial (*explained*).
   - Knee completion **0**.
4. **Re-rendered on the fixed engine.** The pizz and harp tuning changes the harp, the hearts and the clockwork slightly. The harp's soft layer now plays from its medium samples.
   - The parts again render with the engine's workers (the `workers=1` workaround is gone).
   - The old masters are kept as MP3 in `render/_pre-fix1/`.

## The idea

This is **their side, played straight**. The orchestra gives the board the dignity the bible asks for. A procedure keeps going, and its fourth step is always blank. Mas exists only as the public record, so he gets silence and never a motif.

- **No felt, no chip, no swing** until the card.
- **Step Four** (B♭m(add9) → A♭(add9) → G♭maj7 → *the F bass alone*) is the spine. It comes back five times, and the blank is the joke:
  - at b1–2 the blank step **is** the drop-out for his "super.";
  - in section c it is the F bass alone, three times;
  - at the sincere beat Neleh writes `?` into it;
  - at b43–44 ("Step four?" "Good question.") it is blank again.
- **09x is the door back.** A REVERSAL (C → F, bright, no third), then everything cuts. On the card's extra beat a **single felt F4** plays: his room comes back first.

It is the only cue in the batch with no chip and no piano until its last three seconds. That makes it deliberately unlike MM-08 and MM-10 on either side of it: "their side" should be audible as a change of instrument, not only of tune.

## Palette

| Role | Instruments (engine tracks) |
|---|---|
| The chorale (Step Four) | low strings sul tasto (`vc`, `cb`, `vla`, `vln2`, low-passed at 1.6 kHz), `bsn`; the top line on clarinet with a soft cup-muted horn (`hn` art `mute`) |
| The procedure goes on | a straight-eighth spiccato pulse (`vc` spic, 3+3+2 accents, pitches always moving), a B♭ pedal (`cb`), a falling chromatic viola whisper D♭4 → G3 |
| Characters | Neleh: `vln1` pizzicato clockwork. Mada: the spinner on harp harmonics (`harm`). Alyi: the Door on non-vibrato flute through a "door" insert (low-passed, reflections on the right only) over the GPU choir (GM choir + reed organ, ppp). Mario: marimba + harp (the Lighthouse), a quartet (`svln` lead, `vla`, `vc`, soft `cb`). Tasya: `rhodes` + low strings (the floor). The hourglass: pizzicato grains. |
| Accent | one straight-mute trumpet figure (b35, F4 → B♭4) |
| 09x | strings (spiccato bite + sustain), open horns, timpani, a harp roll, **one chip F6** (25 % pulse), **one felt F4** |

## Form (cue time · episode clock)

| Sec | Bars | Cue time | Ep clock | Music |
|---|---|---|---|---|
| **a** NOON | 1–12 | 0:00–0:30 | 14:34–15:04 | Step Four in half notes under "the call goes on" (muted horn and clarinet top, a contrabass pizz and a harp-harmonic dyad as the downbeat carrier). **b2.3: the blank step is the stop for "super."** From b3 the B♭ pedal and the spiccato pulse run under a chromatic viola whisper. Mada's spinner (b3–4, harp, C5–D♭5 in quarter-note triplets against the straight pulse). Out for Gerg's post (b5.3–6.3). At RIMA's card the pulse dips a beat (b8.1). Neleh's clockwork pizzicato on "For how long?" (b9) and on her raised brow (b10). Out for Alyi's real line (b11). **The Door** at the doorway (b12.1): flute through the door over the GPU choir, ending on its unresolved G4 over the NOV 18 rail. |
| **b** NOV 18 | 13–16 | 0:30–0:40 | 15:04–15:14 | The hearts: harp-led, **falling** F-minor-pentatonic streams, overlapping and denser toward the burial, over a D♭ bed (F pentatonic over D♭ = D♭maj9(13): the employees' warmth), with low violas doubling only the low notes (no tiptoe). They stop, and **one harp harmonic D♭6** (b15.1) plays for the blue heart. Out before his post (b15.4). |
| **c** boardroom | 17–26 | 0:40–1:05 | 15:14–15:39 | Step Four ×3: clarinet top (b17), muted horn + clarinet top with **the Door on Alyi's reflected lines** (b19.3), then a chromatic clarinet whisper that stops for the blank (b21). Each blank is the F bass alone. B♭ hold (b23, the reflection flicker gets no reaction). **The sincere beat (b24):** a solo line plays the three steps F4 E♭4 D♭4 in quarters over the quarter-note chorale. **On `?` (b25)** step four gets **Neleh's question**, C6 → D♭6, over the lone F bass. The D♭ is the Ache's ♭13: she asks the machine's question without knowing it. Out before the four dial tones (b26). |
| **d** LIGHTHOUSE | 27–32 | 1:05–1:20 | 15:39–15:54 | The Lighthouse (marimba + harp, the 3-note cell across 4/4, realigning every 3 bars) from the first ring, with a cello B♭ pedal. **The Addendum** (quartet) on "some thoughts" (b29), gaining a bar; **the click cuts the tail on b31.3** (C D♭ E♭ F, cut); the Lighthouse runs on, dimmed. **On "How much?" (b32.3) the tail lands**: G♭4 A♭4 → **D♭5 over G♭maj9**, a deceptive landing (sold, not resolved). |
| **e** NOV 19 camera | 33–34 | 1:20–1:25 | 15:54–15:59 | **Dry.** The G♭maj9's low end is the "sustain before"; a low B♭/F fifth enters on b34.4 as the "sustain after". |
| **f** TTEMME | 35–38 | 1:25–1:35 | 15:59–16:09 | A straight-mute trumpet accent on the spotlight (F4 → B♭4, the knee's fourth). The pulse returns: a new CEO, the same procedure. The card dips a beat (b36.1). **The hourglass** (b37.2–38.4): one pizzicato grain per beat, falling F5 D♭5 C5 B♭4 A♭4 G♭4 F4. |
| **g** 11:53 PM | 39–42 | 1:35–1:45 | 16:09–16:19 | Tasya's floor, **one held step**: A♭maj9 (b39.1) → **Cmaj9 on the wall's palette step** (b39.3), a chromatic mediant, strings with silent attacks. The Rhodes comps **on the beats** when she appears (b40.3–4), leaving the offbeats to the key ring. Out before her post (b41). A low B♭ pedal comes back at b42 as the pickup. |
| **h** Step four? | 43–44 | 1:45–1:50 | 16:19–16:24 | Step Four's three chords; **the fourth blank again** (the F bass alone, b44.3). |
| **09x** card | 45.1–46.2 | 1:50–1:53.1 | 16:24–16:27.1 | A C pickup (b44.4&), then the **REVERSAL on the downbeat**: F(add9) with no third, violins leaping C4 → F5 (+C6), horns, timpani, a harp roll, one chip F6. One stab, then air. A fader ride holds it at −13.7 LUFS-M with its forte timbre intact. **b46.1: everything cuts** (a 4 ms stem cut on every family but piano) and **a single felt F4** answers. It rings into MM-10 from b46.2. |

**The clock.** The script prints sc 27 as 111 s (44.4 bars). On the grid the pass is **44 bars**, so the card falls on **16:24.0** in this file, not the printed 16:25. Conform to the slate animatic by whole bars: repeat a section's hold bar (below) to move everything after it by 2.5 s.

## Dry windows (the record plays dry)

Each is a baked hard stop (every stem and its reverb to digital zero in 3 ms) that starts on the first word or the post's pop. Measured −240 dBFS inside all seven.

| Window | Bars | Cue time | What |
|---|---|---|---|
| "super." | b2.3–b3.1 | 0:03.75–0:05.0 | his voice on their laptop speaker (no music under) |
| Gerg's post [V] | b5.3–b6.3 | 0:11.25–0:13.75 | "…I quit." |
| Alyi [V] | b11.1–b12.1 | 0:25.0–0:27.5 | "You can call it this way" |
| Mas's post [V] | b15.4–b17.1 | 0:36.875–0:40.0 | "…sorta like reading your own eulogy…" |
| dial tones | b26.1–b27.1 | 1:02.5–1:05.0 | out before the four speakerphone tones (SFX) |
| Mas's post [V] | b33.2–b34.4 | 1:20.625–1:24.375 | "first and last time i ever wear one of these" |
| Tasya's post [V] | b41.1–b42.1 | 1:40.0–1:42.5 | "a new advanced AI research team", read aloud |

The post windows assume the pop falls where written. If the animatic moves a pop, move the stop with it; don't fade.

## Files (`render/`)

| File | What |
|---|---|
| `mm09-the-boards-side-underscore.wav/.mp3` | **the picture master**, stitched a–h + 09x, −20 LUFS-I |
| `mm09-the-boards-side-album.wav/.mp3` | album master, −16 LUFS-I |
| `stems/…-{strings,winds,brass,perc,piano,chip}.flac` | the stems, which sum to the underscore master (residual −167.7 dB). Piano and chip are 09x only. |
| `parts/…-e01-s27a-noon.wav` … `-e01-s27h-step-four.wav` | **each section on its own**, at the stitched level, with its own ring-out as the overlapping tail. Section e is dry and has no file; its low sustain opens part f. |
| `parts/…-e01-s28-what-they-didnt-know.wav` | **09x alone**: from the C pickup (b44.4&, 0.3125 s before the card) through the felt F4's ring |
| `parts/…-e01-s27{a,b,c,f,g,h}-hold-loop.wav` (+ `-loop-tail`, `-loop-x3-preview.mp3`) | **one hold bar per section** for the conform (seamless, 60 frames). d's hold is **3 bars** (`hold3`, 180 frames), because the Lighthouse cell realigns every 3 bars. |
| `parts/…-parts.json` | every part: bars, start frame, loudness, seam check, gain |

**Parts, measured.**
- **Sections:** −18.0 to −21.3 LUFS-I, true peak ≤ −4.1 dBTP. Each is level-matched to the stitched master (a null test against the master reads within 0.01 dB in level, −30 to −35 dB residual: the master bus compression). Fix 1: the hearts section reads −18.0, where it was −19.3. The harp now plays its soft notes from the medium layer (the engine's tuning fix), so its level and brightness need a listen.
- **09x alone:** −13.6 LUFS-M.
- **Holds:** −15.6 to −23.2 LUFS-I, all seams clean. The hearts hold is −15.6 (it was −17.2), for the same reason.
| `.mid`, `-pianoroll.png`, `.cue.json` | MIDI with markers; the piano roll with the dry windows shaded; the cue sheet (sections, markers, SFX slots, silence windows, QA) |

## Cue points (markers in the MIDI and the cue sheet; sharp carriers only)

b1.1 · b9.1 (Neleh's clockwork) · b13.3 (the hearts) · b27.1 (the Lighthouse on the ring) · b29.1 (the Addendum) · b32.3 ("How much?" landing) · b35.1 (the spotlight) · b37.2 (the hourglass) · b45.1 (REVERSAL) · b46.1 (the felt F4).

Soft entries have no sharp onset to QA, so they appear only in the form table above: the Door, the chorale heads, the sincere beat, the question, the floor. So do the stops: the click cut on b31.3 and the dry windows.

## Measured (final render)

| Check | Result |
|---|---|
| Underscore / album | −20.0 LUFS-I / −4.36 dBTP · −16.0 / −1.15 |
| Short-term (the engine's meter, fixed) | p95 **−17.7**, median −20.9, max −16.3 (limit p95 ≤ −17 ✓) |
| 09x REVERSAL | **−14.1 LUFS-M** in the stitched master; the 09x part alone reads −13.6 (target −14 ±1 ✓) |
| Dry windows / hard stops | all 7 at −240 dBFS ✓ |
| Written third (rule 12, every note boundary) | **0** ✓. A strict scan for any A♮ above any sounding F, whatever the bass, also reads 0. |
| F-major check (fix 5b) | **OK**. 24 F-bass windows. Two are over 0.08 sieved (0.106 and 0.163, at 43.75 and 108.75 s), and both are *explained* as the 5th partial of the written F2 and F1. There are 0 resonances; before fix 1 there were 3, the contrabass's 111 Hz. |
| No third (09x) | A 0.055, A♭ 0.002 of F ✓ |
| Spectrum | 2–6 kHz **−16.8 dB** ✓ (it was −15.0 on the old render) · centroid 470 Hz ✓ |
| Balance (a–h target 0 · 90 · 5 · 0) | energy **0 · 92 · 7 · 1** (the 1 % chip is 09x's F6). The theme method reads 1 · 75 · 22 · 1, because it counts the short muted-horn tops and the one trumpet figure at full level for their whole section. |
| Humanisation | 0 ms on every track ✓ |
| Motifs found | STEP_FOUR 12×, DOOR 2×, LIGHTHOUSE 10×, ADDENDUM 1×, NELEH_CLOCKWORK 1× · whole knee 0 ✓ |
| Hits | 9 of 10 markers within ±10 ms. b9.1 reads +10.7 ms, as before: a soft first pizzicato under the detector's ~±8 ms bias. The isolated-note probe reads 0 ms; the note was not moved. |

## Rulings I made (flag if you disagree)

1. **The tail "lands" deceptively.** §5.C1 d says "on 'How much?' the tail finally lands (sold)"; §2.8 reserves the Addendum's B♭ cadence for Ep12. The tail lands on **D♭5 over G♭maj9**: warm, settled, bought, and still not home.
2. **"A solo viola"** (the sincere beat) is played by the VSCO **solo-violin** samples on their low strings (F4–D♭4), low-passed at 3 kHz with a 350 Hz lift. The library has no solo viola. **Neleh's harmonic** is the solo violin at pp, flautando-style (slow attack, low-passed at 2.6 kHz); it still has sample vibrato.
3. **The Rhodes counts as colour** (§5.C1): its balance group is `fx`, so piano reads 0 in a–h.
4. **The card sits on the grid at 16:24.0** (see "The clock").
5. **The contrabass rests on the Addendum's F7sus4** (b30.3–31.3). Its F1's upper partials read as A♮ in the §6.9 F-major check, because the check can't credit a fundamental below 80 Hz.
6. **Fix 1: the pulse under the whisper's A3 leaves out F** (b8.3–b9.3). The alternative was to change the whisper, for example to A♭3, which breaks its chromatic line. I kept the line and moved the pulse, because the pulse's pitches always move anyway.

## What a human must audition (underscore master)

1. **0:03.75, the stop for "super."** Does the blank fourth step read as a procedure simply omitting him, or as a mistake?
2. **0:05–0:25, the pulse, pedal and whisper.** Scheming without villainy? Does anything read as a heartbeat? It shouldn't: the accents are 3+3+2 and the pitch always moves.
   - **Fix 1, 0:18.75–0:21.3:** the pulse plays E♭3, E3 and G♭3 where it had F3. Does the whisper still read as the minor line cliché? Is there no F-major colour, and does the pulse sound like the same procedure?
   - **Fix 1, the blanks** (0:43.75, 0:48.75, 0:53.75, 1:00.0, 1:48.75): with the contrabass F1 notched at 111 Hz, does the lone F still sound full and dark? Is the b22 whisper, now stopping on B♭3, still a whisper that *stops*?
3. **0:30–0:37, the hearts.** A warm pour, or "pizzicato tiptoe"? Is the lone harmonic at 0:35 enough for the blue heart? **Fix 1:** the harp now plays from its medium layer at a soft level, and the section measures 1.2 dB louder. Is it too bright or too forward?
4. **0:57.5–1:02.5, Neleh's sincere beat and her question.** Do we care about her? Is the solo line sincere and not "sad violin"? Is the harmonic heard as a question?
5. **1:05–1:20, Mario.** Anything Nintendo in the marimba and harp? Does the cut at **1:16.25** (b31.3) land with the SFX click? Does the G♭maj9 on "How much?" read as *sold*?
6. **1:50–1:53, 09x.** A reversal, not a fanfare? Then the cut to one felt F4 at **1:52.5**: does his room come back first? Check it against MM-10's downbeat at 1:53.125.

## Weaknesses (known)

- **The 2–6 kHz band** read −15.0 dB on the old render; the fixed engine measures −16.8 dB. If dialogue still fights sections c–d, take 1–2 dB off the strings stem around 3 kHz.
- **The solo "viola" and the harmonic are stand-ins** (solo-violin samples with vibrato). A real solo viola and a real harmonic would be better.
- **The GPU choir is General MIDI choir aahs**, ppp and low-passed: it may sound dated. It is barely above the flute (the Door is +11.6 dB over it).
- **The heart cascade is seeded-random within rules.** It measures as a rising, then stopping, pour, but its shape needs an ear.
- **Balance** reads 7 % big band by energy against a 5 % target.
- **The post windows are placed by estimate**; nothing has been conformed to the slate animatic.

## Handoffs

- **Composer D (MM-10):** the felt F4 lands on b46.1 = 1:52.5 cue time, and your b46.2 home shot starts under its ring. Our REVERSAL is in F: if the card carries a freeze hit, `freeze_hit_F`.
- **SFX owner:** §6.8 request 1 still stands: tune the four dial tones (b26, one per beat) to F4 E♭4 D♭4 C4, Step Four's line. The click (b31.3) is the cut point for the Addendum tail.
- **Engine owner:** the two bugs below were fixed in the engine on 2026-09-26 (fixes 1 and 3). They are kept here for the record.

### Engine bugs found in batch 1 (now fixed)

1. **`mix.short_term_lufs` K-weights across channels instead of along time.** It passes a (samples, 2) array to `scipy.signal.lfilter`, which filters along the last axis. Its short-term and momentary values read about 2–4 dB hot on this material (one 3 s window: −15.5 vs pyloudnorm −19.5). The same bug affects `lra`, the `short_term_stats` p95 QA and `analysis._k_power` (`balance_energy`). Integrated LUFS and the masters are correct. **Fix:** filter along axis 0, or per channel. `parts.py::kcurve` is a correct reference meter.
2. **Forking render workers after a build can deadlock.** A second `render_score` with forked workers, in the same process after `build()`, hung on a futex/pipe (the parent in futex wait, workers in pipe read), probably because threads from the reverb thread pool were alive at fork. The engine's fix 3 renders each track in its own forked child, with a timeout guard, and it doesn't fork while other threads are alive. The parts use the engine's workers again.
