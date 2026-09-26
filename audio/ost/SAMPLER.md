# MR. MAS · OST batch 1 · Sampler and listening guide (fix pass 1 + fix 2b)

| | |
|---|---|
| **File** | [`ost-sampler.mp3`](ost-sampler.mp3) · 4:19.7 · 256 kbps · **−14.0 LUFS-I** · **−1.19 dBTP** (measured on the decoded MP3). Rebuilt in fix 2b (2026-09-26) from the re-rendered masters; same items, same cut points. |
| **What it is** | Twelve excerpts from the eleven batch-1 tracks, 13.5–28 s each. MM-11 gives two. They run in a dramatic order, with exactly 1.0 s of digital silence between items. |
| **How it was made** | Each item is cut from its track's **album master**, sample-exact, on a bar line, a section entry or the track's own stop.<br>**MM-10 and MM-11 now come from their album edits**, not the picture cues.<br>**Processing:**<ul><li>a 10 ms fade-in on every item;</li><li>a one-beat fade-out on the two items that end mid-phrase (1 and 2);</li><li>one gain for the whole reel (+0.63 dB, to −14.0 LUFS-I);</li><li>a look-ahead true-peak limiter at −1.3 dBTP. It shaves at most 0.78 dB, on 0.8 % of samples by more than 0.5 dB.</li></ul>Items keep the album's relative levels. Script: [`editor/make_sampler.py`](editor/make_sampler.py). |
| **Ears** | **Nobody has listened to any of it.** Every number here is a measurement, re-taken after fix pass 1 and again after fix 2b on the corrected engine. This guide is for the first human pass. |
| **Also** | [`index.json`](index.json): every cue with its files, status and open items.<br>[`editor/qa.json`](editor/qa.json) and [`editor/qa-loops.json`](editor/qa-loops.json): the editor's re-measure.<br>[`editor/CONFORM-ACT4.md`](editor/CONFORM-ACT4.md): the plan for conforming the to-picture cues once the Act Four lock is approved. |

**Contents:** [How to listen](#how-to-listen) · [Running order](#running-order) · [Item by item](#item-by-item) · [Five questions](#five-questions-for-the-whole-sampler) · [Fix 2b: what changed](#fix-2b-what-changed-2026-09-26) · [Fix pass 1: ear checks in the full files](#fix-pass-1-ear-checks-in-the-full-files) · [Still open](#still-open) · [What the measurements settle](#what-the-measurements-settle)

---

## How to listen

1. **Play it once, straight through,** at one comfortable level, and don't ride the volume. The level steps between items are the album's. MM-01, 02, 08, 09, 11 and 13 are quiet tracks, mastered at −16 LUFS-I, and the rest are at −14.
2. **Silence inside an item is designed:** a stop, a slot the SFX own, or D6. Only the 1 s gaps between items belong to the sampler.
3. **Then go back** to each item's **Listen for** line and answer it in one word: *yes*, *no* or *close*.
4. **Judge the music, not the timing to picture.** The to-picture cues are still cut to Act Four lock v2. They wait for the showrunner's review of the new lock (see [CONFORM-ACT4.md](editor/CONFORM-ACT4.md)).

---

## Running order

The order runs as a short album in three parts:
- **I · Who he is** (items 1–4)
- **II · Ep1 Act Four in picture order** (items 5–11)
- **Coda · the machine** (item 12)

| # | Time | Track | Tone | Where it goes in the show | Listen for |
|---|---|---|---|---|---|
| 1 | 0:00 | **MM-01 Water Line** | DARK ROOM: Mas alone, calm | Mas's theme: Ep1 sc 18 (10:13), then every episode's rooms, nights and V.O. | Calm, not sad? Recognisable after two bars? |
| 2 | 0:26 | **MM-06 Beeper, 1993 / Sample-Chip, 2008** | ERA TIERS: his past, as the machine heard it | The flashbacks: Ep1 sc 3–4 (1993, 0:30) | A memory, or a video game? |
| 3 | 0:47 | **MM-05 The More You Buy** | THE JOB: the pitch that always closes | Nesnej, deals, the upsell: Ep1 sc 17 (9:33) | Does the sale close on the empty downbeat? |
| 4 | 1:08 | **MM-19 Renamed It. / The Fountain Pen** | THE PODIUM: state pomp, one size too big | NEDIB, Ep1 sc 13 (5:54); RUMPT from Ep2 | Is the Rename deadpan, or cute? |
| 5 | 1:29 | **MM-07 How to Fire a CEO Who Owns Nothing.** | BLUEPRINT: the cheerful machine that breaks | THE PLAN: Ep1 sc 24–25, Act Four's opening; PLAN-SHORT and PLAN-MICRO in later episodes | The plan failing, or a playback fault? |
| 6 | 1:49 | **MM-08 The Falling Tile** | LEVERAGE → D6: a trap closing, no tune | Ep1 sc 26: the call, up to the Cancel click | Does the click land as a blow, or a glitch? |
| 7 | 2:09 | **MM-09 The Board's Side / What They Didn't Know** | PROCEDURE → the REVERSAL out | Ep1 sc 27–28: the board's pass and the card | A reversal, or a fanfare? |
| 8 | 2:29.9 | **MM-02 His Version** | KEYNOTE REEL: his flattering account | The D5 device. It is cut from Ep1 and debuts in Ep2 or Ep3; Ep12 plays it uncut | Parody by polish, or a sincere ad? |
| 9 | 2:49 | **MM-10 His Side / 745** (album edit) | SET-PIECE SWING: the avalanche | Ep1 sc 29b, with the episode's one full band | Does the new chorus 2 build, or repeat? |
| 10 | 3:17.9 | **MM-11 The Return** (album edit, a) | STRAIGHT: the one sad violin | Ep1 sc 30a, under Alyi's post | "The world's smallest violin"? |
| 11 | 3:32.4 | **MM-11 The Return** (album edit, d–e) | VICTORY LAP → DARK ROOM | Ep1 sc 30d–e: Gerg back, the sign, "okay." | Is the felt the right last word? |
| 12 | 3:59.4 | **MM-13 Outside Intended Scope** | GLYPH: the machine learning his tune | The Orb's scan and Q\* hits in Ep1; the L4 bed from Ep9 | Thrilling, or just loud? |

---

## Item by item

Times are sampler time. The source time is in brackets.

### 1 · 0:00 · MM-01 Water Line · DARK ROOM
- **Tone:** Mas alone at 2 a.m., calm and sure of himself. The felt upright leads, a trio plays in two, and the chip sounds only on the nudge.
- **Where:** his theme. It is first heard in Ep1 sc 18 (the dark room, 10:13), then in every episode's rooms, nights and V.O. In Act Four its felt carries 26A and his side at 2 a.m.
- **Listen for:** calm, not sad. Would you know this tune again after two bars?
- **Timeline:**
  - **0:00:** the felt alone.
  - **0:05:** the trio comes in.
  - **0:10–0:15** and **0:20–0:25:** the V.O. windows, where nothing moves.
  - **0:15:** statement 2. The violas now join the cellos' guide tones (fix 1: strings +2 dB, balance 61 · 27 · 3 · 8).

### 2 · 0:26 · MM-06 Beeper, 1993 / Sample-Chip, 2008 · ERA TIERS
- **Tone:** his past as the machine heard it: a 1-bit beeper in 1993, then a 16-bit memory of 2008.
- **Where:** the flashbacks, from Ep1 sc 3–4 (1993, 0:30). Its 1-bit flat line returns inside MM-08 and MM-11.
- **Listen for:** a memory, or a video game? Nothing may sound Nintendo.
- **Timeline:**
  - **0:26:** NESNEJ's Upsell on the beeper.
  - **0:36.0:** the empty slot. The SFX register clunks here, with no bell.
  - **0:36.6:** 2008. The trio through the 16-bit sample-chip.
  - **0:38.5:** young Mas plays his line.

### 3 · 0:47 · MM-05 The More You Buy · THE JOB
- **Tone:** a sales pitch that climbs a step every bar and always closes: double-time swing, vibes and a straight mute over a walking bass.
- **Where:** Nesnej, deals and the upsell. It runs into the register's KA-CHING in Ep1 sc 17 (the rooftop, 9:33).
- **Listen for:** does the sale close on the empty downbeat, or does it sound like a dropout?
- **Timeline:**
  - **0:47:** the walking bass lands on F. This downbeat read as an A before fix 1; the contrabass-pizz resonance is now notched.
  - **0:58.25:** the close.
  - **0:59.5:** the KA-CHING slot, where every stem rests.
  - **1:03.25:** the tag stalls on C7(♯9♭13).
  - **1:05.75:** the late slot.

### 4 · 1:08 · MM-19 Renamed It. / The Fountain Pen · THE PODIUM
- **Tone:** the state occasion, played straight and one size too big. The joke is the rename, which happens under a held note.
- **Where:** power. NEDIB's Fountain Pen plays in Ep1 sc 13 (the White House, 5:54); RUMPT's march and the Rename come from Ep2.
- **Listen for:** is the Rename deadpan, or cute?
- **Timeline:**
  - **1:10.5:** the missing downbeat.
  - **1:15.5:** only the pickup plays.
  - **1:18:** SUPER, the full march.
  - **1:19.25** and **1:24.25:** the Rename, twice.
  - **1:25.5:** the button.

### 5 · 1:29 · MM-07 How to Fire a CEO Who Owns Nothing. · BLUEPRINT
- **Tone:** THE PLAN, a small, precise, cheerful drafting machine. A chip music box, harp and pizzicato play it dead straight. It explains everything, then breaks.
- **Where:** Ep1 sc 24–25, Act Four's opening. PLAN-SHORT (30 s) and PLAN-MICRO (20 s) are now their own files, for every later episode's THE PLAN.
- **Listen for:** does the break read as the plan failing, or as a playback fault?
- **Timeline:**
  - **1:29:** harp eighths draw the path. The harp is retuned in fix 1.
  - **1:31.5:** three ticks.
  - **1:36.5:** the held chord.
  - **1:41.5:** THE BREAK.
  - **1:45.25:** the tape-stop.
  - **1:47.75:** zero on the JOIN click.

### 6 · 1:49 · MM-08 The Falling Tile · LEVERAGE → D6
- **Tone:** a trap closing without a tune. An F pedal, low grand clusters a semitone apart, a pitched sub-thud and a chip tick. Then the click takes every sound away.
- **Where:** Ep1 sc 26, the call, up to the Cancel click and the drop-out.
- **Listen for:** does the stop on the click land as a blow, or as a glitch? (§7 #1, the top audition item.)
- **Timeline:**
  - **1:49:** LEVERAGE. The low clusters are 9 dB up in fix 1.
  - **1:52.1:** Neleh's pizzicato.
  - **1:59:** the 1-bit flat line.
  - **2:04:** Step Four on muted horns.
  - **2:06.5:** THE CLICK.

### 7 · 2:09 · MM-09 The Board's Side / What They Didn't Know · PROCEDURE → OUTS
- **Tone:** the other side, played straight and with dignity: no felt piano, no chip, no swing. Then the card.
- **Where:** Ep1 sc 27–28: the board's pass, then the card WHAT THEY DIDN'T KNOW.
- **Listen for:** a reversal, or a fanfare?
- **Timeline:**
  - **2:09:** Tasya's floor.
  - **2:14:** dry for her post.
  - **2:19:** "Step four?".
  - **2:24:** the REVERSAL, with no third.
  - **2:26.5:** one felt F4. His room comes back first.

### 8 · 2:29.9 · MM-02 His Version · KEYNOTE REEL
- **Tone:** his flattering account. It is his own tune in D♭ major on the same piano, with everything human removed.
- **Where:** the D5 device. Draft 3.2 cut D5 from Ep1, so it debuts in Ep2 or Ep3, and Ep12 plays the reel uncut. It sits here in its old sc 29 place.
- **Listen for:** parody by polish, or a sincere ad? Compare it with item 1: is it the same tune?
- **Timeline:**
  - **2:29.9:** pass 3.
  - **2:39.9:** pass 4.
  - **2:47.7:** cut mid-note.

### 9 · 2:49 · MM-10 His Side / 745 (album edit) · SET-PIECE SWING
- **Tone:** his version of the five days. The company falls into his lap as a swung avalanche that stops dead on the one man who won't move.
- **Where:** Ep1 sc 29b, the avalanche, with the episode's one full band. **This excerpt is the album edit's new second chorus, which the picture doesn't have.**
- **Listen for:** chorus 2 is new writing. Does it add momentum, or just repeat?
- **Timeline:**
  - **2:49:** the board presses.
  - **2:57.75:** Step Four crushed again.
  - **2:59:** the Water Line twice, over the swung Build.
  - **3:09:** THE FULL BAND, three bars, level.
  - **3:16.5:** THE CARD. Everything stops dead.

### 10 · 3:17.9 · MM-11 The Return (album edit, a) · STRAIGHT
- **Tone:** the one sad violin of the season: the Door on a solo violin, senza vibrato, with nothing under it.
- **Where:** Ep1 sc 30a, under Alyi's regret post only. The v4 plan would let it decay on the first heart instead of stopping.
- **Listen for:** does it avoid "the world's smallest violin"?
- **Timeline:**
  - **3:18:** the Door, plain.
  - **3:25.5:** again.
  - **3:30.9:** stopped dead on the first heart.

### 11 · 3:32.4 · MM-11 The Return (album edit, d–e) · VICTORY LAP → DARK ROOM
- **Tone:** the other side's sounds hand him back his company. The win is played straight and one size too big, then undercut. His felt returns last.
- **Where:** Ep1 sc 30d–e: Gerg is back, the lobby sign, "okay."
- **Listen for:** is the felt the right last word, or one note too many?
- **Timeline:**
  - **3:32.4:** the Build restarts.
  - **3:38.6:** the sand's held beat.
  - **3:41.1:** THE ONE STAB, on the sign.
  - **3:46.1:** one chip note.
  - **3:48:** the flat line.
  - **3:49.9:** the rest for the bonk and "okay."
  - **3:51.1:** C4 → F4, ringing out.

### 12 · 3:59.4 · MM-13 Outside Intended Scope · GLYPH
- **Tone:** the machine learning the show's tune, politely.
- **Where:** Ep1's GLYPH hits (the Orb's scan, Q\*). The L1–L4 beds follow the dread curve; L4 is from Ep9.
- **Listen for:** thrilling, or just loud? Dread, or a screensaver?
- **Timeline:**
  - **3:59.4:** the runaway. The tokens play the knee's first seven notes, then keep climbing past the ending.
  - **4:16.9:** one glass D♭6. The sub is 9 dB lower in fix 1.
  - **4:19.4:** cut dead.

---

## Five questions for the whole sampler

1. **Different tones, not one track repeated?**
   - **By measurement, the set is as spread as batch 1.** Each album master reduces to 23 features, and the median distance between two tracks is 4.98 (it was 4.97).
   - **The closest pairs now:**
     - MM-10's album edit and the **locked main title** (2.72). Both have a swung blend with the chip near 27 %. A/B 2:49 against the title: the album edit must not sound like a second main title.
     - MM-05 and MM-10 (2.76). A/B 0:47 against 2:49.
     - MM-09 and MM-11 (2.86).
   - **Last batch's closest pair,** MM-06 and MM-13, has moved apart (2.46 → 3.96).
2. **The stop is the house device.** It lands as:
   - a missing beat (1:10.5);
   - a tape-stop (1:47.75);
   - a click into D6 (2:06.5);
   - a mid-note cut (2:47.7);
   - a band stopping dead (3:16.5);
   - a violin stopping on a heart (3:30.9);
   - a glass cut (4:19.4);
   - two rests for the bell (0:36, 0:59.5).

   Does each stop get its own laugh, or do they start to sound like one trick? The v4 Act Four plan already cuts the act to four stops.
3. **The chip: identity or toy?** Listen at:
   - 0:26 (the 1-bit beeper);
   - 1:29 (the music box);
   - 2:59 (the swung Build);
   - 3:46.1 (one note);
   - 3:59.4 (GLYPH).
4. **Big band as accents, not the engine.** The stabs are at 0:58.25, 1:18 and 3:41.1, and the one full band is at 3:09. Outside MM-19's march, does the brass ever take over?
5. **Nothing corny.** Note the time of anything that sounds like one of these:
   - a sitcom sting, a sad trombone or a "dun-dun";
   - a game, an ad or "inspirational corporate";
   - a heartbeat or a monitor beep;
   - a quote from another score.

---

## Fix 2b: what changed (2026-09-26)

**The fix.** The engine now corrects the sample sets that fix pass 1 measured but left uncorrected: the tuba, trumpet and horn staccatos, the contrabass spiccato, the viola and cello tremolos and the solo violin (`engine/README.md`, sample tuning, fix 2b). MM-11's LEVERAGE is fixed. **Five cues were re-rendered**, the ones where a correction moves an audible note by more than 10 cents: MM-09, MM-10, MM-11, MM-19 and `e01-s30a-the-door`. No cue was re-timed, and no other cue changed. The fix-1 masters are in each folder's `render/_pre-fix2b/`, as MP3, for A/B.

| What changed | In the sampler | In the full file | Listen for |
|---|---|---|---|
| **MM-19: the tuba and the trumpets in tune.** One tuba B♭1 take was 95 c flat, almost an A. The tuba E♭2 was 23 c sharp. The stab G3 was 23–31 c flat. | item 4: 1:08.0 (E♭2 and G3), 1:14.25 (B♭1), 1:20.5 (E♭2), 1:25.5 (a trumpet B 11 c sharp, now in tune) | `mm19-renamed-it/render/mm19-renamed-it-album.mp3` 45–90 s | Does the march sit in tune now? Is it still the same march? |
| **MM-19: the FEAR tremolo** (cello B♭2 43 c flat, viola G♭3 25 c flat) **and the Fountain Pen's violin** (10–20 c off) | not in the excerpt | the same file, 25–45 s (FEAR) and 13–17 s (the violin) | Is FEAR's tremolo now dark rather than sour? |
| **MM-10: the pressing tremolo.** The cello E3 was 33 c sharp and the B♭3 25 c sharp. | item 9: 3:09.0, under THE FULL BAND | `mm10-his-side-745/render/mm10-his-side-745-album.mp3` 83.1 s | Does the tremolo still press, now in tune? |
| **MM-11: the Door's violin.** The C4 sample is 23 c sharp, so the D♭4 and C4 were 22 and 17 c high. Now within 1 c. | item 10: 3:18–3:31 (the item is 0.4 dB quieter) | `mm11-the-return/render/mm11-the-return-album.mp3` 0.6–13.5 s; `e01-s30a-the-door` | Is the plain Door in tune now, and still plain? |
| **MM-11: LEVERAGE** (not in the sampler). The cello pizz is notched at 110.5 Hz, the F pedal is re-bowed every 2 bars (the held sample ran out 6.7 s in), and the section is ridden −1.5 dB. F-major is clean. | not in the excerpt; item 11 has the album edit's C pedal, re-bowed at 3:33.6 | the album edit 37.5–60.6 s; the picture underscore 33.75–47.5 s | Does LEVERAGE sound minor and still woody? Are the bow changes (every 5 s) inaudible? |
| **MM-11: the stab** (item 11, 3:41.1) | G5 −3.1 c, E♭5 +7 c | — | — |
| **MM-09: six solo-violin notes** (11.5 c) | not in the excerpt | `mm09-the-boards-side/render/…-album.mp3` 60–76 s | See Still open #10 |

## Fix pass 1: ear checks in the full files

Every fix below measures clean. What measurement can't tell is whether it *sounds* right. Paths are under `tracks/`, and times are in the file. The old sound of each master is kept as an MP3 in its folder's `render/_pre-fix1/`, for A/B.

| What changed | File and time | Listen for |
|---|---|---|
| **MM-09: the A3 over F3 is gone** (the pulse leaves F for two bars) | `mm09-the-boards-side/render/mm09-the-boards-side-album.mp3` 18.75–21.3 s | Any F-major colour left? Does the whisper still fall as a minor line? |
| **MM-09: the blanks' contrabass F1 notched at 111 Hz** | the same file, 43.75, 48.75, 53.75, 60.0 and 108.75 s | Do the lone-F blanks still sound full? |
| **MM-06: the knee no longer completes** (bar 7 re-strikes C5) | `mm06-beeper-1993-sample-chip-2008/render/mm06-beeper-1993-sample-chip-2008-album.mp3` 12.5–17.5 s (the C at 15.3 s) | Does the C sound stuck, as meant, rather than like the knee finishing or a V–I cadence? |
| **MM-05: the A2 pizz resonance notched** | `mm05-the-more-you-buy/render/mm05-the-more-you-buy-album.mp3` at 5.0, 10.6, 35.0, 50.0 and 65.0 s | Is the walking bass still woody on its F downbeats? |
| **MM-01: rebalanced** (strings +2 dB, violas added, Harmon +2 dB) | `mm01-water-line/render/mm01-water-line-album.mp3` 17.5–45 s | Do the strings stay distant rather than cushioning his feelings? Does the Harmon stay "the night", not a feature? |
| **MM-08: LEVERAGE clusters +9 dB, pizz notched** | `mm08-the-falling-tile/render/mm08-the-falling-tile-album.mp3` 0–17.5 s | Are the clusters murky against the pizz and the thud? Still no tune? |
| **MM-10: the album edit** (new chorus 2, three bars of band) | `mm10-his-side-745/render/mm10-his-side-745-album.mp3` 0–23.1 s (the intro's fragments and rests) and 53.1–83.1 s (chorus 2) | Do the intro's rests work on an album, or are they just gaps? From 23 to 90 s the avalanche holds one level (beat RMS −15 to −19 dB for 67 s) before the band: does it build, or plateau? |
| **MM-11: the album edit** | `mm11-the-return/render/mm11-the-return-album.mp3` whole (1:32.9) | Does it hold as one piece? Does LEVERAGE (37.5–60.6 s) sound minor (see [Still open](#still-open))? |
| **MM-13: sub 9 dB lower, tokens shelved** | `mm13-outside-intended-scope/render/mm13-outside-intended-scope-loop-x3-preview.mp3` | Is L1 now too empty? Are the tokens muffled? |
| **MM-13 variants** (30, 15 and 5 s, reduced, solo) | `mm13-outside-intended-scope/render/variants/` | The cut-downs end on the hook, as act-outs. Under a line, use the reduced or solo version. |
| **MM-19 variants** (cut-downs, NEDIB cuts, reduced, solo) | `mm19-renamed-it/render/variants/` | Solo piano: straight, or oom-pah? One trumpet: ceremony, or a bugle call? |
| **The retuned harp, clarinet and pizz** (every track that uses them) | MM-07 at 30–37.5 s; MM-09's hearts at 30–40 s (1.2 dB louder); `mm13-kit-glyph-hits-and-copy` H02 and H08 | The soft harp now plays from its medium layer at a soft level. Too bright? |
| **The MM-07 break** | `mm07-how-to-fire-a-ceo/render/e01-s25-the-plan-album.mp3` 42.5–48.75 s | The F-major check hears A energy here with nothing written: the tape-stop's glide and the viola pizz body. Does anything sound major? |

**Still-valid ear checks from batch 1** (nothing measurable changed):
- the waltz and its missing F (§7 #4): `e01-s25-the-plan` 12.5–20.6 s;
- parity (§7 #5): MM-19 0–20 s against 45–65 s;
- the sale with the bell (§7 #9): `mm05-the-more-you-buy/render/extras/mm05-the-more-you-buy-kaching-check.mp3`;
- THE COPY, a beat late (§7 #8): the kit, 65–87.5 s;
- Mario's quartet (§7 #7): MM-09 65–80 s;
- Neleh's beat: MM-09 57.5–62.5 s;
- 26A and THE REWIND: MM-08 22.5–42.5 s;
- the render front: MM-06 80–85 s;
- every V.O. window against a voice (§7 #12).

---

## Still open

| # | Item | What the measurement shows | What to do |
|---|---|---|---|
| 1 | ~~MM-11 LEVERAGE (c1): an A-range resonance~~ **Closed in fix 2b.** | Fix 1 found 8 (picture) and 10 (edit) resonance windows, worst sieved A/F 1.35 / 1.77. Two causes: the cello pizz's A♭2 / B♭2 skirt and body resonance (~111 Hz), and an F pedal that ran out 6.7 s in (a 6.5 s sample). Now: 0 resonance windows; worst 0.045 (picture) and 0.085, explained (edit). | Done: a narrow notch on the LEVERAGE cello pizz only (110.5 Hz, Q 16, −12 dB), the pedal re-bowed every 2 bars, LEVERAGE −1.5 dB. **Ears:** still woody? bow changes inaudible? (`mm11-the-return/README.md`) |
| 2 | ~~The uncorrected sample sets~~ **Corrected in fix 2b.** | All 305 samples of `tuba_stac`, `tpt_stac`, `hn_stac`, `cb_spic`, `vla_trem`, `vc_trem` and `svln` now carry a measured correction. The engine's verify: 901 renders, worst 3.5 c. The worst faults: tuba 95 c flat, cello tremolo 43 c (a wrong automatic correction), violin C4 23 c. Sections and gliding brass takes carry ±5–10 c of uncertainty. `vibes_hard` and `xylo` are not corrected (inharmonic bars). | Done; the five affected cues were re-rendered (above). **Ears:** MM-19's tuba and FEAR tremolo; the gliding trumpet takes (MM-19 45, 55, 70 s). |
| 3 | MM-13 L3 and kit H07: the F-major flag | Measured by the editor: the A band sits **18–24 dB under the A♭4 tokens**, spread from 426 to 460 Hz (the spectral skirt of 86 ms notes), and the F barely sounds. This is not an A. | Accepted. Ear check only. |
| 4 | MM-07 break (43.1–48.7 s): the F-major flag | The tape-stop glide (an audio process the note check can't see) and the viola pizz body. The F share is 6–23 %. | Accepted. Ear check (above). |
| 5 | MM-09 b9.1 onset | 20.0 s reads +10.7 ms, 0.7 ms over the 10 ms tolerance. It was there before the fix. | Accept, or nudge it at the conform. |
| 6 | The engine's classifier | It calls a skirt, a tape-stop glide and a pizz body all "resonance". The 2–6 kHz warning can't tell an act-out from a bed. | For the engine owner (Composer B's note, confirmed). |
| 7 | The MIDI export | Two same-pitch notes on one track collapse to the shorter one: MM-09's arco and pizz B♭1 at 5.0 s, and (fix 2b) MM-11's re-bowed F pedal, where the file-only re-run lists 44.375–44.725 s at 0.146. The editor's file-only F-major re-run misreads those spots. | For the engine owner. The cue-sheet checks are unaffected. |
| 8 | The MM-10 and MM-11 picture cue sheets | Their `album_wav` points at the album edit, which is on another timeline. | Mix from the underscore and the stems only. `index.json` says so. |
| 9 | MM-06 cut-downs | The 30 and 15 s cuts exist only as parts, with no cue sheets, and there is no 5 s cut (§6.4). | Low priority, for MM-06's composer. |
| 10 | **MM-09: one new F-major window** (fix 2b) | 74.99–75.61 s (b30.4): sieved A/F 0.126, classed *resonance*. Rendered track by track, it is the **harp's** F4 / B♭4 ring (peaks 430–447 Hz). The harp is unchanged; the soft cello F2 there holds only 6.3 % of the pitched energy, just over the check's 5 % floor, and the retuned violin's energy tipped the window into judgement. No A is written. | Ears first (anything major at 75 s?); if it is heard, it is MM-09's owner's call (a harp voicing or a notch). |
| 11 | **MM-19 b15.1 marker** (fix 2b) | 35.0 s reads −10.7 ms (tolerance 10). The retuned FEAR tremolo enters 7 ms ahead of the timpani (its humanised start, unchanged), and the detector now takes its attack. No note moved. | Accept, or nudge at the conform. |

---

## What the measurements settle

The editor re-measured every file on disk with [`editor/qa.py`](editor/qa.py) v2. It uses the engine's corrected meters and the fix-5 checks, and runs them on the files themselves, so you don't have to listen for any of this.

| Check | Result |
|---|---|
| **Masters** | All 82 masters are within 0.05 LU of target: the album and underscore masters of 42 cue sheets, counting cut-downs, variants and the two album edits. True peak is at least 0.15 dB under every ceiling. No sample is clipped, and all MP3s are valid. |
| **The meter fix** | The engine's corrected short-term meter and the editor's independent one agree to **0.000 LU on every master**. The cue sheets' p95 now equals the editor's. Underscore p95 is −17.6 to −21.3 (limit −17); featured is −14.1 to −15.5 (limit −13). |
| **The tuning fix** | The engine's verify rendered 894 notes, the worst 2.77 cents off. **Independent check on the renders:** the share of pitched energy within ±10 cents rose in:<ul><li>MM-07, 88 → 92.5 %;</li><li>MM-08, 56 → 65 %;</li><li>MM-09, 76 → 80 %;</li><li>the kit, 93.5 → 94.4 %.</li></ul>MM-02, which has no retuned samples, is identical: the control.<br>**Fix 2b:** verify rendered the 305 newly corrected samples 901 times, the worst 3.5 c. On the masters, MM-11's Door measures D♭4 +21.6 → +0.3 c and C4 +17.4 → −0.9 c. |
| **Rule 12, the third** | Written A♮ over an F bass: **0 everywhere**. That holds for the engine (every note boundary, pedal included) and for the editor's own sweep of the MIDI. MM-09 is closed. |
| **Rule 4, the knee** | Whole: 0. Completed by pitch class in any register, across phrases and loop seams: **0 everywhere**, engine and editor. MM-06 is closed. |
| **F-major, spectral** | **35 of 42 cue sheets pass** (fix 2b; fix 1: 34). MM-11 and its album edit are closed. The seven that flag are items 3, 4 and 10 above: two accepted families (MM-13, MM-07) and MM-09's new harp window (ears). |
| **Sub under the room SFX** | All 49 marked windows pass. The worst is −19.9 dB (the limit is −18). MM-13 is closed. |
| **Stems** | They sum to the underscore master at −115.7 to −122.5 dB, on all 19 cue sheets that carry stems. |
| **Loops** | All 26 loop files on disk are frame-aligned and seamless, parts included. |
| **Hits** | 274 of 277 markers land within tolerance. The three outside are MM-09's b9.1 (+10.7 ms), one held chord in MM-10's album edit (+13 ms on the album master only) and, since fix 2b, MM-19's b15.1 (−10.7 ms, item 11). |
| **Silence** | All 203 silence windows and hard stops are clean on their picture masters. |
| **V.O. windows** | All 9 read −22.7 to −25.6 LUFS, inside −24 ±2. |
| **Timing** | **No to-picture cue was re-timed.** Against each `_pre-fix1` master: the same length, 0.0 ms lag, markers within 2.7 ms, and the same sections and stop windows. |
| **Deliverables** | **Closed:** MM-10 and MM-11 album edits; MM-13 and MM-19 cut-downs, reduced and solo versions; MM-07 PLAN-SHORT and PLAN-MICRO as their own files. |
