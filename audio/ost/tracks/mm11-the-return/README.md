# MM-11 · The Return (E01-S30a–e, to picture)

Composer E, OST batch 1 (OST-BIBLE §5.E1); fix pass 1 by composer B, 2026-09-26; fix 2b (LEVERAGE and the retuned violin) by the engine owner, 2026-09-26. Nobody has listened to it; every level and check below was measured.

## Fix 2b (2026-09-26): LEVERAGE and the violin

**Timing is untouched** (lock v2, act 8295 at file 0; every section, marker, stop and dry window where it was). The fix-1 master MP3s are in `render/_pre-fix2b/` for A/B.

1. **LEVERAGE, rule 12 (the F-major check).**
   - **The problem:** the trace read A-range energy at 107–113 Hz over the F pedal: 8 resonance windows in picture, worst sieved A/F 1.35 (limit 0.08), and 10 in the album edit, worst 1.77. It came from the cello pizz, 94–99 % of it by rendering part by part: the plucked A♭2 (103.8 Hz) and B♭2 (116.5 Hz) either side of A2, plus the cello-pizz body resonance near 111 Hz (the peak MM-08 notched).
   - **A second cause: the F pedal ran out.** It was one held note of 13.9 s (23.3 s in the album edit), and the contrabass's soft F#1 sample it plays is 6.5 s long. So the F stopped about 6.7 s in: the last 7 s of the picture's LEVERAGE and 16 s of the album edit's had no F under the pizz. That is where the A/F ratios were worst (1.35 and 1.77: almost no F).
   - **The fix, in the manner of composer A's MM-08:**
     - LEVERAGE's cello pizz is now its own track, `vc_lev` (the palette's `vc`), with a **narrow notch on those notes only**: 110.5 Hz, −12 dB, Q 16. It is narrower than MM-08's (111.7 Hz, Q 10), because here the pizz line itself plays A♭2 and B♭2: their fundamentals move −2.7 and −3.4 dB (their 2nd partials 0.0), F2 −0.3, G♭2 −0.5, C3 −0.5. The floor's, the C pedal's and the sign's cello are untouched. (Q 24 still failed one album window.)
     - **The F pedal is re-bowed every 2 bars** (`held_pedal`): picture 39.38 and 44.38 s; album 43.12, 48.12, 53.12 and 58.12 s. Each stroke overlaps the next by its attack, a legato bow change with no gap. The same helper re-bows the album edit's 11.5 s C pedal at 68.12 s: its cello C (an 8.4 s sample) used to drop out for the last 4 s under the Build.
     - **LEVERAGE is ridden −1.5 dB** (`Score.macro`, inside its hard stops). The pedal now sounds all through, which put the section 1.5 dB over its fix-1 level and pulled the rest of the cue 0.7 dB down through the master's loudness target. The ride puts both back.
   - **Now:** F-major OK on both. Picture: 32 windows, 0 resonance, worst sieved A/F 0.045. Album edit: 51 windows, 0 resonance, worst 0.085 in one window at 37.5 s, which the check *explains* (the F2's own 5th partial; it passes). No A is written anywhere.
2. **The violin is retuned.** `senza.py` reads the VSCO files itself, so it never had a tuning correction. The engine's fix-2b measurement (`library.TUNING['svln']`) finds the C4 p sample **23 cents sharp**, so the Door's D♭4 and C4 sounded 22 and 17 cents high. `senza.py` now applies the table. Measured on the masters, the D♭4 went from +21.6 to +0.3 c, the C4 from +17.4 to −0.9 c, and the A♭3 and G3 from −2.0 / −1.9 to +1.0 / +1.1 c.
   - The retuned, near-pure senza tone sits at another point of the hall and room sends' frequency response: the dry level is identical, but the dry-plus-wet sum measured 2.0–2.2 dB lower. `svln_nv` is **+2 dB** (was −1) to put the phrase back at its fix-1 level.
   - `tracks/e01-s30a-the-door` uses the same `senza.py`, so it was re-rendered too.
3. **The stab's trumpets** play the corrected `tpt_stac` set (fix 2b): in picture the G5 moves +12.8 c and the E♭5 +7.0 c; in the album edit the G5 (another take) −3.1 c and the E♭5 +7.0 c.
4. **Levels, fix 1 → fix 2b** (the engine's meter on the underscore master): violin −20.7 → −21.0 LUFS; floor −19.3 → −19.5; LEVERAGE −20.5 → −20.1 (its first 6.7 s −1.4 dB, its last 7 s +2.4 dB: the pedal); C pedal −22.4 → −22.5; the Build −16.1 → −16.3. Album edit (on the decoded MP3): every section within 0.4 dB of fix 1, LEVERAGE −16.6 → −16.3.

## Fix pass 1 (2026-09-26): what changed

- **The album master is now an ALBUM EDIT** (`render/mm11-the-return-album.wav/.mp3`, 1:32.9, −16.0 LUFS-I). The picture version was half silence (the record plays dry), which is right under picture and wrong on an album. The edit is described below; its own cue sheet, MIDI and piano roll are `render/mm11-the-return-album-edit.*`.
- **The picture version is unchanged** and is still the **underscore master and the stems** (lock v2 timing, act 8295 at file 0; every note, stop and ride identical: checked note for note against batch 1). It was **not** re-timed to the Act Four lock v3; that pass owns timing.
- **The felt's ring is no longer chopped.** The editor's 1.0 s fade over the last second (81.375 → 82.375 s) is now written into the render (`Score.end_fade`), so a re-render keeps it. The file ends at −88 dBFS. The `_pre-editor/` WAVs are the editor's record of the chopped version.
- **Re-rendered on the fixed engine** (the corrected meter, the pizz and harp tuning, the new render pool, the QA checks 5a–5d). The pizz of LEVERAGE and the Build now play tuned samples. The batch-1 master MP3s are in `render/_pre-fix1/`.
- **How to rebuild:** `python track.py` renders the picture (underscore, stems, MIDI, cue sheet), then the album edit, then moves the edit's album master onto `mm11-the-return-album.wav` and writes both cue sheets. `--album-edit-only` re-renders the edit alone. **`build.py mm11-the-return` renders the picture score only**, and would put a picture-timed album master back (it prints a note saying so).

## The album edit (`mm11-the-return-album-edit`)

Every section, in picture order and from the same code (`track.py` writes both from one set of section functions and a second spot, `ALBUM`, in file frames). The dry windows become musical rests on the edit's own 96 grid (a 1-beat pickup; bar 1 = 0.625 s).

| Bars | Time (s) | What |
|---|---|---|
| 1–3 | 0.6–6.9 | **The Door**, plain: the solo violin's A♭3 D♭4 \| C4 G3, the open G held 4 beats and let go |
| 4–6 | 8.1–13.5 | **The Door again**, stopped dead on "the first heart" (5.375 s after its entry, as in picture), then 2.1 s of silence |
| 7–14 | 15.6–35.6 | **The floor at its full cycle**: A♭maj9 → Cmaj9 → Emaj9 → A♭maj9, 2 bars each (the picture has 3 compressed bars). Tasya's Rhodes on the beats for a bar, then in half notes; the home chord held. Stopped on its cut. |
| 15.4–25 | 37.5–60.6 | **LEVERAGE**, 9¼ bars from the door-bang upbeat (the picture has 5½): F pedal, pizz 3+3+2, the 150 Hz thud, the grand's semitone clusters, the chip tick. It drops out on a downbeat. |
| 25–26 | 60.6–63.1 | One bar of silence: the long hold |
| 26–30 | 63.1–75.0 | **The stamp's C pedal**, now running under the **Build compiling 8 → 12 → 16** (b27.3, b28.2, b29.1): the dominant under Gerg's return |
| 30.4–33 | 75.0–80.6 | The 4-sixteenth pickup; **the sign**: the one stab on A♭maj9, then **two bars** of the Build at full (the picture has one) |
| 33–35 | 80.6–85.6 | The band cuts to **one chip note**; the **1-bit flat line** F F F; the bonk's beat and one beat of rest |
| 35– | 85.6–92.9 | **The felt**: C4 → F4 on the swung and-of, an open fifth, ringing out (pedal to 92.6 s, a 1.5 s fade) |

- **Loudness:** −16.0 LUFS-I, −1.15 dBTP, as the batch-1 album master (a quiet track). The stab reads −10.3 LUFS-M on the album master.
- **Checks:** written third none; knee completion 0; DOOR ×2 and BUILD ×6 found; no third on the settle (A 0.013, A♭ 0.001); the F-major resonance flag of LEVERAGE (see below); 9 markers within ±6.3 ms. Balance 4 · 63 · 16 · 18.
- It has no underscore master and no stems: the picture version is the underscore master.

**Tone.** "His POV, and he has stopped narrating." The cue is a relay of **other people's sounds** handing him back his company:
- Alyi's violin;
- Tasya's Rhodes;
- the world's LEVERAGE;
- Gerg's chip Build;
- the band's one stab;
- the 1993 beeper.

His felt piano is withheld until the very end. **The first felt notes in the cue come after "okay."**: the return, literally (§1.4). The win is scored straight and one size too big, then undercut.

## Timing: follows the Ep1 Act Four timing lock v2

- **Lay it at act frame 8295** (18:16:15, shot 30.01 f0). Act frame F sits at (F − 8295)/24 s in this file.
- A 3-beat pickup puts the bar lines on the act's bar lines (bar 1 = act 8340).
- **The musical end is act 10200** (19:36:00, 31.01 f0).
- The source is `show/episodes/ep01/production/act4/shots-locked-v2.json`. The lock runs +2.5 s past the printed 17:59.9–19:16.8, and this cue follows the lock.
- **To re-conform,** edit `SPOT` in `track.py` (it is in act frames) and re-render. The music is written against those names.

## Form

| File s | Act | Picture | Music |
|---|---|---|---|
| 0.63–6.00 | 8310–8439 | 30.01, ALYI reads his regret post (spoken) | **STRAIGHT:** the Door (§2.9) on a solo violin, **senza vibrato** (see `senza.py`). It is an octave below the flute's Door, ending on the open G string, held. It **stops dead on the first heart** (act 8439): a hard stop with the tails cut. |
| 6.0–24.4 | | Hold 2 beats; the IOU flutters (9.17 s); the bullpen; **Tasya's real line** (12.71–23.75 s) | Dry. The palette steps are silent. |
| 24.38 | 8880 | The room is blue (the beat after "around them.") | **The floor:** Tasya's Rhodes on the beats (the key ring owns the offbeats), low strings with slow attacks, and celesta. A♭maj9 (24.38), Cmaj9 (25.63), Emaj9 (26.88) held, with nothing moving under "hi." or "Hello.". **Home to A♭maj9 at 30.63**, the beat after "Hello.": the landlord's last word. It stops on the boardroom cut (31.88). |
| 31.9–33.7 | | Mada, still | Silence |
| 33.75–47.50 | 9105–9435 | The door bang, Terb, the FULL FREEZE card (35.63), the pin, "Which room is on fire?" / "…Ah.", the calm-off | **LEVERAGE** (P03): an F pedal, straight pizz eighths on varied pitches (3+3+2), the "muted 808" as a pitched 150 Hz thud, low grand clusters shifting a semitone, a soft chip tick. It **runs on through the freeze** (Mas moves through it) and leaves the card's downbeat to the freeze hit. **It drops out on "Terms?"** (47.50). |
| 47.5–56.9 | | "Good question." ×2; **the long hold** | Silence |
| 56.88 | 9660 | The stamp (SFX, C) | **A low C pedal:** the dominant, leading on |
| 59.38–63.1 | 9720 | Gerg's post and the keycaps | Dry. The pedal leaves on the post's pop. |
| 63.13 | 9810 | [PF] Mas reading it | **The Build restarts** (8 sixteenths): chip, xylophone, wood, pizz. Joy. |
| 64.38–68.7 | 9840 | Ttemme's post (its read time) and the sand's held beat | Dry |
| 68.75 | 9945 | The sand falls | The Build's 4-sixteenth pickup |
| **69.38** | 9960 | The lobby sign: DAYS SINCE …: 0 | **One brass stab** (2 trumpets + 2 trombones, open, short) on A♭maj9, with timpani, a string chop and the Build at full. The chip takes the top line. |
| 71.88 | 10020 | The box of spare 0 plates | **The band cuts,** tails included, to **one chip note** (G5) |
| 73.75 | 10065 | The 1993 dialog; Cancel greys over 3 beats | The **1-bit flat line F F F**, uneven. The **bonk** (SFX, E3) on beat 4 (75.63) is the wrong note. |
| 75.6–78.7 | | The silent [CU]; "okay." (77.67–78.58) | Silence. His room line lands dry. |
| **78.75 / 79.17** | 10185 / 10195 | After "okay.", over his hands | **The felt:** C4, then F4 on the swung and-of-4. An open fifth (F3 C4 F4), no third. It sounds 5 frames before the cut, and **its decay L-cuts into 31.01**, where the Q* vault's F hum takes the root. |

## Palette and motifs

- **Motifs:**
  - the Door, from the STRAIGHT family;
  - Tasya's floor (§2.16);
  - the Build (§2.6), heard 8 → 4 → 16 as its compile passes;
  - the 1-bit flat line;
  - the Water Line's settle.
- **No full band.** The episode's one full band is MM-10's S3.
- **No F major and no sustained major chord at the win.** The A♭maj9 stab is short; the floor is the landlord's, not his.
- **No loop:** this is a to-picture cue.

## Measured (fix-2b render of the picture version)

| Check | Result |
|---|---|
| Underscore master | −20.0 LUFS-I, −3.15 dBTP |
| Album master | now the album edit (above) |
| Short-term (the engine's corrected meter and the editor's agree) | p95 −18.5 (limit −17); the album edit's underscore p95 −17.8 |
| Violin (−22 target) | −21.0 LUFS-I |
| Floor (−20) | −19.5 |
| LEVERAGE (−22) | −20.1 (a −1.5 dB ride; the F pedal now sounds all through) |
| C pedal | −22.5 |
| The Build (−18) | −16.3 (the restart, 63.1–64.4 s) |
| **The stab (−14 LUFS-M)** | **−13.3 LUFS-M** at fix 1, not re-measured (the master moved 0.2 dB). The sign bar has a −1.8 dB fader ride, the floor −0.8 dB and LEVERAGE −1.5 dB (`Score.macro`). |
| The felt settle (−22) | −20.9 |
| Hard stops and dry windows | 11/11 at −240 dBFS: the violin stop, Tasya's line, Gerg's and Ttemme's posts, the long hold, the bonk slot and [CU], "okay." (album edit: 4/4) |
| The file end | the felt faded over the last second; −88 dBFS at the end (was chopped at −30) |
| Markers vs onsets | 9 markers, worst 6.0 ms (album edit: 9, worst 6.3 ms) |
| Written third (every note boundary) | none |
| F-major, spectral | **OK** (fix 2b): 32 windows, 0 resonance, worst sieved A/F 0.045 (was 8 flagged, worst 1.35). Album edit: 51 windows, 0 resonance, worst 0.085, explained (the F2's 5th partial). See Fix 2b above. |
| No third on the settle | A 0.009, A♭ 0.001 |
| Whole knee · knee completion | 0 · 0 |
| Motifs | DOOR and BUILD found |
| Swing | The felt at +10.0 frames. Everything else is straight, as its palette says. |
| Stems | 7 families; sum at −169.1 dB |
| Spectrum | 2–6 kHz −20.0 dB, centroid 360 Hz (dark: low strings and LEVERAGE) |
| Balance | 3 · 68 · 10 · 19; album edit 3 · 66 · 14 · 17 (VICTORY LAP's 20 · 40 · 20 · 20 applies to e1 only) |

**The LEVERAGE flag (fix 1, now fixed in fix 2b).** The F-major trace found A-range energy at 106.9–112.8 Hz in the strings stem wherever the contrabass F2 pedal was the lowest note: worst sieved A/F 1.35, and 1.77 in the album edit's longer LEVERAGE. Nothing is written on A. It was the skirt of the plucked A♭2 and B♭2 either side of A2 plus the cello-pizz body resonance, over an F pedal that had run out. See Fix 2b for the notch and the re-bowed pedal. The editor's file-only cross-check (`editor/qa.py`) still lists one window, 44.375–44.725 s (A/F 0.146). That is the pedal's bow change: the MIDI file collapses the two overlapping F2 notes (the known MIDI-export limit), so the file-only run cuts a short window there. The engine's check, with the full notes, passes that spot.

## What to audition (with picture and the dialogue premix)

1. **0.6–6.0 s:** the STRAIGHT violin under a4-30-01. Sincere and plain, never "world's smallest violin"? Does the dead stop on the first heart get the laugh?
2. **24.4–31.9 s:** the floor as ironic beauty. Is it the landlord's chord, not a warm resolution? The home chord after "Hello." is the landlord's last word.
3. **33.8–47.5 s:** LEVERAGE running through the freeze card. Is the thud pitched and never a heartbeat or an 808 kit? Does the drop-out on "Terms?" read as the move?
4. **63.1 s and 68.8 s:** the Build restarting as joy; the pickup landing with the sand.
5. **69.4 s:** the one stab. Earned, and one size too big for a lobby sign? Then the cut to one chip note at 71.9 s.
6. **73.8–80 s:** F F F, the bonk slot, silence, then the felt after "okay." ringing into the Q* hum. Is it the right last word, or one too many?
7. **33.8–47.5 s (and the album edit's 37.5–60.6 s):** does LEVERAGE sound minor? (Fix 2b: it now measures clean.) Is the cello pizz still woody with its 110.5 Hz notch (A♭2 and B♭2 are 3 dB thinner at the fundamental)? Are the F pedal's bow changes inaudible (picture 39.4 and 44.4 s; album every 5 s from 43.1 s)? A/B against `render/_pre-fix2b/`.
8. **The album edit, whole:** does it play as a piece without the picture? In particular the Door's second, stopped statement (13.5 s) without the heart on screen, 23 s of LEVERAGE, and the C pedal under the Build (63–75 s).
9. **0.6–6.0 s, the retuned violin** (fix 2b): the D♭ and C are 22 and 17 cents lower than before. Does the Door now sit in tune against the SFX and the dialogue? A/B against `render/_pre-fix2b/`.

## Handoffs and open items

- **Composer D (MM-10) → here:** D stops dead on the MADA card (act 8175) and holds the room to 8295. The violin enters at 8310, in D♭.
- **Into sc 31 (MM-12, batch 2):** the felt F4's decay (≤ 1 beat) L-cuts into 31.01, whose `Q*` REPORTED rail types on at f0.
  - If "(REPORTED) never carries a Mas motif" is read strictly, cut the piano stem at act 10200. The settle still lands inside sc 30.
  - **Trim E1** (30.26 to 2 beats) would leave no beat after "okay.". If it's taken, drop the settle.
- **LEVERAGE:** §5.E1 suggests reusing MM-08's stems for c. Composer B's `mm08-leverage-bed` is the same palette (F pedal, pizz, 150 Hz thud, grand clusters) and can replace c1 by stems if literal reuse is wanted.
- **Requests to the SFX owner:**
  - the TERB card's freeze hit in **F**;
  - `rubber_stamp_C` on the stamp;
  - the **key-ring jangle** on an offbeat inside 30.07.
- **The editor's violin:** `tracks/e01-s30a-the-door`, with 4 pre-cut stops.
- **To the Act Four v4 pass (fix 2b):** `e01-act4-v4/s7s8_the_return.py` builds on `tracks()` and `build_cell()` from this file.
  - It now gets the retuned senza violin at +2 dB. At the same notes that nets out to the old level (see Fix 2b 2), and its held G3 is 3 c higher.
  - Its LEVERAGE is its own copy: the pizz on `vc` and no notch. To pass rule 12 the same way, route its LEVERAGE cello pizz to `T['vc_lev']` (notched by `LEV_NOTCH`), and keep its own pedal re-bows.

## Weaknesses

- **The floor has only 3 bars** after Tasya's line in the lock (the S2's 8 bars are mostly her real line, which plays dry). Its four chords move every 2 beats before "hi." and are compressed.
- **The violin is de-vibrato'd by DSP** (−11 to −16 dB of vibrato). The measurement is sound, but whether it sounds like a player has to be heard.
- **The balance is orchestra-heavy** for a VICTORY LAP, because most of the cue is other people's colours. The felt is withheld by design.
- **The album edit is 1:33 from about 41 s of picture music.** It stretches sections (the floor, LEVERAGE, the Build, the victory lap) rather than adding new material. The floor's 2-bar chords and LEVERAGE's 9 bars are the most likely to feel long.

## Engine note (batch 1, now fixed)

Batch 1 flagged that `engine/mix.short_term_lufs()` filtered across the two channels and read about 3.5 dB hot. Engine fix 1 (2026-09-26) corrected it; the p95 above is the engine's own reading.

**Music editor, 2026-09-25** (superseded by fix pass 1): the batch-1 masters and stems were given a 1.0 s raised-cosine fade (81.375 → 82.375 s) by hand, because the felt F4 was chopped at −30 dBFS by the file end. That fade is now part of the render; the editor's pre-fade originals stay in `render/_pre-editor/`.
