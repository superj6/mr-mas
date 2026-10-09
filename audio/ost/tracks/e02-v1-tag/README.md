# e02-v1-tag · Ep2 v1 tag "august" (sc 23) · the music stem

**The score pass, 2026-10-09.** One render, laid on the EL lock (the master, `show/reel/ep02-v1-el/ep02-v1-el-tag.json`: 888 frames, 37.00 s) with the `e02-v1-common` engine (composer X's `v3lib`):

| Render | Cue | Scene |
|---|---|---|
| `e02-13-august` | E02-13 AUGUST: one continuous performance. THE RUN (P07) hands over to RUMPT's Podium in its FEAR colour (P13, MM-19's FEAR), with the cut to black on a downbeat | 23 |

**Nothing here has been listened to.** Every number below is measured [M]. The musical calls are judged [J]. The "For an ear" list says what only a person can check.

**The brief:**
- **The cue list:** [manifest.md §6](../../../../show/episodes/ep02/production/v1/manifest.md#6-score-cues), E02-13.
- **The scene and the mood map:** [proposal.md](../../../../show/episodes/ep02/production/v1/proposal.md) sc 23 (the final check's D-70: FEAR under the invented balloon only, the real Aug 21 words over THE RUN's thinned pedal), "The feeling curve" and "The seams" (seam 29: the dark room's drone, J 1.0; seam 30: cut on the downbeat to black).
- **The script's MUSIC line** (script-v1.md sc 23) and **the lock's music runs** (`track.py --dry --el`): the pedal under the suit's landing; THE RUN with a knee stab on each item; the Orb's F chime, then its verdict a beat later (F → C on vibes and glass); THE RUN thinning to its pedal under the lower third, with the neutral text blip carrying his words; FEAR under the balloon only; one held chord; out on the downbeat.
- **The notes from the earlier segments,** and what this pass did with each:
  - Act Four's `render/music-el-ringout.wav` (2.6 s: the flute's held G4, the Door's ♯4, and its D♭ fifth releasing) is laid at the tag's head by `mix_episode.py` and crossfaded out over 2.5 s from this score's entry. **The tag takes over that D♭.** Its first sound is the same D♭ fifth, bowed sul tasto and swelling in. The mix's −50 dB test puts the score's entry at **0.21 s**, and the felt's fifth comes a beat in.
  - The act-outs so far: THE COPY, a stop mid-phrase, DREAD, and the open ♯4 ring-out. **The tag's out is a fifth kind:** a held chord cut dead on the downbeat, on the cut to black.
  - The engine findings: the cello pizzicato's 109.9 Hz body is notched (with Act Three's 111.3 Hz and the A3/A4 notches). The brass staccatos get `latency_ms` 11. No `snes_*` track, no sample-chip upright and no `futz` are used, so findings 3–5 don't apply.
  - Renders run under `setsid` with stdin from `/dev/null`, through `heavy.sh`, one at a time.

The mood map:

| Beat | Mood | The score |
|---|---|---|
| 23.01–23.03 | the run's momentum; a laugh at the suit's calmer punctuation | THE RUN, dry and straight; the pages get no comment |
| 23.04 | satisfaction at the fact-check | the engine clears the chime; the verdict resolves the V to an open F |
| 23.05 | his business, in an election year (V.O. 14) | THE RUN under the V.O., inside the bed |
| 23.06–23.09 | a chill at the taut string, and on Mas's face | THE RUN's pedal under his words; FEAR under the balloon only; one held chord; the cut |

## The render

| | |
|---|---|
| `render/music-el.wav` | **37.000 s, 1,776,000 samples (888 frames × 2,000), exact.** 48 kHz / 24-bit stereo, git-ignored |
| Level | −19.95 LUFS-I; true peak −3.15 dBTP; short-term p95 −17.11, max −16.57 |
| `check.py` (the v35check copy) | `tag 888 f 37.000 s exact=True −19.95 LUFS-I −3.15 dBTP \| silence 0 holes 0 frag 0 \| 12 dB steps 0 unmarked 0 \| F-major True rule12 True knee 0/0 \| PASS` (all six segments PASS) |
| Engine QA | F-major OK, written and spectral (worst raw A/F 0.254, sieved 0.178: partials of written notes, under the 0.08 limit once sieved). Rule 12 OK: no A-natural is written anywhere. Knee whole 0, completions 0. Every hit mark has an onset within 10 ms (6/6, worst 5.5 ms). The verdict's no-third window: A 0.008, A♭ 0.0 (limit 0.06). The sub under the dark room's hum −20.4 dB (limit −18), from the kick. 2–6 kHz −20.8 dB (limit −15); centroid 547 Hz. The V.O. window −22.9 LUFS (P01's −24 ±2). No warnings |
| Music runs | **one:** 0.05 → 37.0 (the bowed fifth's first 50 ms hop is under −60 dBFS, while Act Four's ring-out is still sounding over the seam). No digital silence, no hole, no fragment |
| `cues-el.json` | the cue sheet: the window, every sync mark, the events, the chord changes against their cuts, the designed hits, the record on screen, the sections, the rides, the measurements and the engine QA. It names the timeline it was laid to (`mix_episode.py` and `stems.py` use a score only on its own lock) |

The Kokoro lock (`show/reel/ep02-v1/`) was not rendered, because the film is the EL lock. The tag's EL retime changed 0 beats, so the two locks are identical here: `track.py --render` without `--el` would make the same stem.

## What plays (the cue sheet)

EL seconds, on the segment's own clock (0 = the tag's first frame). **One grid:** 96 BPM, straight (the record and the machine), with **its bar line on the tag's last frame** (37.000), so the cut to black lands on a downbeat. Every other point is placed on that grid from the lock. Chord changes that land on cuts pre-lap them by the latest eighth at least 0.15 s before the cut, unless the record holds the screen up to the cut (then the change waits for it: calls 2 and 3). **The record on screen** (from the lock and the plan): the docket's caption `NOLE v. MANALT ET AL. · FEDERAL COURT` (facts A48; 2.20–4.58), his post `…and she 'A.I.'d' it…` (10.52–13.02) and the interview's lower third (24.28–27.43). **The V.O.:** e2-vo-14 "sixty elections this year." (20.46–22.36). **Nothing below C3** (his dark room's hum: `server_hum` F2 + F3 + C4, `room_drone` F1 + C2), except the timpani (call 5).

| s | What plays | Why |
|---|---|---|
| 0.00 | **THE RUN's pedal:** a D♭ fifth (cello D♭3, viola A♭3) bowed sul tasto, swelling in under Act Four's ring-out | "THE RUN holds its pedal under the suit's landing." The D♭ is the ring-out's own: the Door's fifth carried over the match cut, under his back as he sits |
| 0.75 | **the felt's open fifth D♭3 + A♭3**, ppp, a beat into the shot | The felt is Mas and his room (OST §0.3). It arrives as he sits, under the Door's fading G |
| 1.60 | `landing_thunk` (the SFX's): **the pedal holds**; nothing hits with it | The THUD is the SFX's. The thunk is tuned to C and F, which sit inside the D♭ fifth's colour |
| 2.20 → 4.58 | the docket's caption (the record): the pedal alone. −24.8 LUFS for the section, −20.5 LUFS-M at most | The record plays dry |
| **4.500** | **THE KNEE STAB, item 1** (the title's quartal C F B♭ E♭ on trumpets and trombones, a 12.5 % chip E♭5, the cello's pizzicato D♭3) and **THE RUN**, on the bar, 0.08 s before the cut to the pages: D♭maj9. Its engine: the felt ostinato in straight eighths (3+3+2), the cello's pizzicato bass on eighths 1, 4 and 7, **a dry sticks groove** (16th hats accented on the beats, a 3+3+2 kick on 1 and the and-of-2, the side-stick on 4), **the Build's chip arpeggio** (a 25 % pulse, the co-lead: eighths in its first bar, then 16ths), the pad sul tasto. **Designed hit.** −17.5 LUFS, −15.2 LUFS-M | "AUG 5: the suit is back." P07: "a stab on each item". The groove is never boom-bap and never four-on-the-floor; the 3+3+2 is LEVERAGE's grouping, so the montage drives without a backbeat |
| 4.85, 5.79, 6.73 | the pages lose their exclamation points (`page_turn` ×3): **nothing happens in the music** | "A laugh at the suit's calmer punctuation". It is the picture's laugh. No comic scoring (OST rule 1) |
| 7.000 | **F m9** (a chord a bar); the chip goes to 16ths | P07's loop (Fm9 – D♭maj9 – B♭m9 – C7sus): "growth is a new layer, never a key change" |
| 8.562 | **B♭ m9 (the iv)**, on an eighth, 0.35 s before the cut to the post | AUG 11 |
| 10.42 → 13.09 | **his post (the record): THE RUN thins.** The chip and the felt are out; the hats drop to 40 %, the pizzicato to 60 %; the pad holds; a −2.5 dB ride. −25.2 LUFS-M at most, 10.0 dB under THE RUN | P07: "Real items play dry, so the run's layer holds and its stab waits." OST rule 10: melody and hits out, a pedal holds, it ducks further. The candidate's false claim gets no comment |
| **13.094** | **THE KNEE STAB, item 2, waited:** on the first 16th after the post clears (13.017), 0.01 s after the cut to the Orb. **C7sus (the V)**, with the engine back. **Designed hit.** −13.9 LUFS-M (the tag's loudest moment, at 13.1) | "Its stab waits": it lands as the Orb floats off his shoulder to check |
| 14.500 | **xylophone and wood join** (a layer: the xylophone doubles the arpeggio's beats, the wood ticks the off-eighths), on the bar nearest the scan sweep (14.48) | "Xylophone and wood". The Orb scans the crowd face by face: the machine counting, straight |
| 17.233 | **the engine clears the Orb's F chime** (`orb_chime_F` + `ui_toast_pop` at 17.283, the SFX's): THE RUN stops 0.05 s before it; the C7sus pad holds through the toast | The chime is the SFX's. The stop is the score's one comic tool (OST rule 1), and the bed holds, so it is no hole |
| **17.938** | **THE VERDICT: F5** on soft vibes and a struck glass, 0.65 s after the chime (the eighth nearest a beat). The pad resolves C7sus → **the open fifth F** (F3 C4 G4, no third). **Designed hit** | "The Orb's F chime, then its verdict a beat later (F → C on vibes and glass)" (OST §2.4: never at the moment of its chime). The post's iv, the scan's V and the verdict's I form a cadence that lands on the machine's answer: the satisfaction |
| 18.562 | **C6**, a beat later, let ring. The no-third window (18.46–19.95) measures A 0.008, A♭ 0.0 | "No third, ever" |
| 19.500 | **THE RUN again**, F m9, on the bar, 0.42 s before the cut to Mas at the monitor; **the violins' pizzicato join** (the arpeggio an octave down: a layer) | Back to his business. The run restarts on a downbeat (call 8) |
| 20.46 → 22.36 | **V.O. 14 "sixty elections this year." inside the bed:** a −4.5 dB ride; the felt takes F where it had A♭; the xylophone rests; the chip is at 60 %. −22.9 LUFS in the window | "No sting or swell under V.O.; the V.O. sits inside the bed" (OST rule 10). Nothing starts on his words but the engine's own sixteenths |
| **22.625** | **THE KNEE STAB, item 3: F7sus, and THE RUN's stop**, on the beat, 0.25 s before the cut to the Aug 21 interview. **Designed hit** | "AUG 21". P07: "end on a stop" |
| 22.63 → 27.63 | **THE RUN's pedal: the open fifth F** (F3 + C4, sul tasto, no third) under the lower third (24.28–27.43). The neutral text blip (the SFX's) carries his words. **Nothing starts under the lower third.** −27.3 LUFS-M at most, 11.4 dB under THE RUN with Mas | "THE RUN thins to its pedal; the neutral text blip carries his words" (D-70). His real words about AI fakes of himself get no fear cue and no melody. The pedal is the room's own F, so the music recedes into his room |
| **27.625** | **RUMPT's Podium, FEAR** (MM-19's): the cup-muted trombone's Podium in E♭ minor at half-time, **on the beat, 0.12 s after the cut to the balloon**. The band waited for his words to clear (the lower third ends 27.425; OST §2.10: "the band waits for his real words"). Muted horns, pp (E♭m; C♭/E♭ under the B♭); **tremolo low strings** (cello E♭3, viola B♭3, pp → p). F a whole step down to RUMPT's E♭ minor. **Designed hit.** −20.5 LUFS, 3.5 dB under THE RUN | "RUMPT's Podium in its FEAR colour … under the balloon only" (D-70). It scores our invented, wordless business, never his words |
| 28.875 → 30.75 | the line: E♭3 (two beats) F3 \| G♭3 B♭3; **a timpani roll** on B♭2 from 30.75 into the arrival | The Podium (OST §2.10: the knee's leap renamed), in FEAR (§2.10, Ep2): "cup-muted trombones, muted horns, pp, E♭ minor, tremolo low strings, a timpani roll" |
| 32.000 | **the held E♭4** on the bar, as the balloon is tied (`knot_tie` 32.075); the roll's arrival; **one soft chip glint** (E♭5, decaying) | The gold, muted (MM-19's FEAR glint): the chip's one note in FEAR |
| 33.250 | **the hook: the Podium thins to ONE HELD CHORD**, on the beat, 0.17 s before the cut. E♭ minor: the muted horns, the trombone's held E♭, the cello sul tasto. The tremolo and the timpani are out. `string_taut` (33.72, the SFX's) sounds over it. −22.3 LUFS | "The Podium thins to one held chord" (23.08). The string's pull is the SFX's |
| 34.812 | **his felt F4**, on an eighth, 0.19 s before the cut to his face: the chord's ninth, and his home note inside the candidate's E♭ minor | Mas's face is the last image (R2). His own instrument enters within a bar of his shot (OST rule 7). The F against the G♭ is the chill |
| **37.000** | **THE OUT: the cut to black on the downbeat.** The tag's last frame is a bar line of the grid, and every voice stops dead there (a 5 ms fade, the tails cut) | "Out: cut on the downbeat to black." A fifth kind of out after THE COPY, the stop, DREAD and the ring-out. The outro starts on its own music (E02-14) |

**Layers, one per item (P07's growth):** the pedal (0); the felt ostinato, pizzicato, sticks, chip and stab (4.5); the xylophone and wood (14.5); the violins' pizzicato (19.5). The stop comes at 22.6.

**Mood shares, by scored time** [J]: momentum and comic drive (THE RUN, 15.8 s) 43 %; warm, satisfied and neutral (the two pedals and the verdict, 11.8 s) 32 %; the chill (FEAR and the held chord, 9.4 s) 25 %.

## The sync points (all read from the lock; the score re-lays itself)

| Lock event | s | What the score does |
|---|---|---|
| the lock's last frame | 37.000 | the grid's bar line: the cut on the downbeat |
| 23.01's start; Act Four's ring-out | 0.0 | the bowed D♭ fifth swells in; the felt's fifth on the first beat at least 0.5 s in (0.75) |
| `landing_thunk` (23.01) | 1.6 | the pedal holds |
| the docket's caption (23.01, the record) | 2.20–4.58 | the pedal alone |
| 23.02 (the pages) | 4.583 | THE RUN's first downbeat: the beat nearest 0.12 s before the cut (a bar line if within 0.2 s): 4.5 |
| 23.03 (the post's shot) | 8.917 | B♭m9 on the latest eighth at least 0.15 s before (8.562) |
| his post (23.03, the record) | 10.52–13.02 | THE RUN thins from 0.1 s before it; the stab waits for its end |
| 23.04 (the Orb) | 13.083 | the stab and C7sus on the first 16th at least 0.03 s after the post ends (13.094) |
| `orb_scan_sweep` (23.04) | 14.483 | the xylophone and wood layer on the beat nearest it (a bar line if within 0.15 s): 14.5 |
| `orb_chime_F` (23.04) | 17.283 | the engine stops 0.05 s before; the verdict on the eighth nearest a beat after (17.938), its C a beat later |
| 23.05 (Mas) | 19.917 | THE RUN again on the latest bar at least 0.15 s before the cut, if no more than 0.5 s before (else a beat, else an eighth): 19.5 |
| e2-vo-14 | 20.46–22.36 | the V.O. ride and the thinning |
| 23.06 (the interview) | 22.875 | the last stab and the stop on the latest eighth at least 0.15 s before (22.625) |
| the lower third (23.06, the record) | 24.28–27.43 | the pedal; FEAR waits for its end |
| 23.07 (the balloon) | 27.5 | FEAR: on the latest eighth at least 0.15 s before the cut if that is clear of the lower third, else the first eighth 0.05 s after it (27.625) |
| `knot_tie` (23.07) | 32.075 | the held E♭: the beat nearest it with room for the line (a bar line if within 0.35 s): 32.0 |
| 23.08 (the hook) | 33.417 | one held chord, on the latest eighth at least 0.15 s before (33.25) |
| 23.09 (his face) | 35.0 | his felt F4, on the latest eighth at least 0.15 s before (34.812) |

**Re-timing [M]:** dry builds on two scratch copies of the lock, re-timed:
- copy (a): 23.01 +0.6 s, 23.03 −0.5, 23.04 +0.9, 23.06 +0.4, 23.07 −0.6, 23.09 +0.5;
- copy (b): 23.02 +0.8, 23.05 +0.7, 23.07 +1.0, 23.08 +0.4, 23.09 −0.3.

Both re-laid every mark to the moved events, and note QA stayed clean (no written third, knee 0/0). The first builds exposed four rules that didn't survive a move, and they are now in the code:
- THE RUN's first downbeat fell a whole beat early (0.62–0.67 s); it is now the beat nearest 0.12 s before the cut.
- The verdict drifted to 0.84–0.88 s after the chime; it is now the eighth nearest a beat after it.
- The scan's layer collapsed onto the stab.
- The held E♭ landed a second after the knot; it is now the beat nearest it.

On the re-timed copies: THE RUN 0.04 s before its cut (a) and on it (b); the verdict 0.57 and 0.53 s after the chime; the held E♭ 0.16 and 0.24 s before the knot; FEAR pre-lapping its cut by 0.27 s where the lower third clears early (a), and waiting 0.27 s where it doesn't (b). On every lock the out is a bar line.

## Measured

| Section | s | LUFS-I | True peak | LUFS-M max |
|---|---|---|---|---|
| 1 the pedal under the suit's landing (the D♭ fifth; the docket's caption) | 0 → 4.5 | −24.8 | −11.3 | −20.5 |
| 2 THE RUN: the pages (D♭maj9, F m9) | 4.5 → 8.56 | −17.5 | −3.2 | −15.2 |
| 3 THE RUN: the post (B♭m9; thinned under the record) | 8.56 → 13.09 | −21.4 | −7.3 | −25.2 under the post |
| 4 THE RUN: the Orb's scan (C7sus; xylophone and wood) | 13.09 → 17.23 | −16.8 | −3.2 | −13.9 |
| 5 the chime and THE VERDICT (the open fifth F) | 17.23 → 19.5 | −19.4 | −10.6 | −17.7 |
| 6 THE RUN again: Mas at the monitor, the V.O. inside it (F m9) | 19.5 → 22.62 | −20.8 | −6.7 | −15.9 (the V.O. window −22.9 LUFS) |
| 7 THE RUN's pedal: the Aug 21 lower third (the open fifth F) | 22.62 → 27.62 | −26.6 | −3.6 (the stab's tail) | −27.3 under the lower third |
| 8 RUMPT's Podium, FEAR: the balloon | 27.62 → 33.25 | −20.5 | −9.7 | −18.7 |
| 9 one held chord: the taut string, his face; the cut on the downbeat | 33.25 → 37.0 | −22.3 | −13.0 | −20.7 |
| **the whole stem** | 0 → 37.0 | **−19.95** | **−3.15** | ST p95 −17.11 |

- **The thinning [M]:** under his post 10.0 dB under THE RUN's peak; under the lower third 11.4 dB under THE RUN with Mas; the held chord 2 dB under FEAR (OST §6.9: about 8 dB or more under a real line or post).
- **The balance [M]** (the engine's stemtable, piano · orch · big band · chip; rhythm and fx left out):
  - the whole cue: 22 · 18 · 28 · 32 (by energy 24 · 27 · 16 · 33);
  - THE RUN's sections: piano 27–33, orch 17–22, big band 0–25 (the method counts a stab's loudness for its whole section), chip 26–51. P07 asks 25 · 25 · 10 · 40, so the chip is the co-lead;
  - FEAR: 0 · 15 · 58 · 27 (the glint counted section-long).
- **The head seam [M]** (Act Four's ring-out laid the way `mix_episode.py` lays it): over 0–0.5 s the ring-out reads −22.6 dBFS RMS and the score −46.1, swelling; over 0.5–1.0 s the ring-out −26.4 and the score −24.6 (the felt's fifth); by 1.6–2.6 s the ring-out is −52 and the score −30.9. The two never fight: both are the same D♭ fifth.
- **The out [M]:** the last 10 ms peak at −19.4 dBFS, then a 5 ms fade to the last sample (0.0).
- **The record [M]** (note onsets inside the windows):
  - the docket's caption: only THE RUN's first downbeat, 0.08 s before its cut (call 2);
  - his post: only the soft hats (17) and the cello's pizzicato (4);
  - the lower third: nothing;
  - the V.O.: the engine's own pulse (felt, pizzicato, kit, chip, wood), softened; no new layer starts there.

## Judgement calls (rules bent on purpose, one line each)

1. **The grid hangs on the out.** The script's "cut on the downbeat to black" sets the bar line at the tag's last frame (37.000), and every other point is placed on that grid from the lock. The lock's own cuts (27.5, 35.0) are bar lines of a grid from 0, but that grid would put the out 0.8 bars past a downbeat.
2. **THE RUN's first downbeat (and stab 1) lands 0.08 s before its cut**, not about 0.25 s, and 0.08 s inside the docket caption's window. The grid makes 4.5 the bar, the caption has held its 2.4 s read under the pedal alone, and a case caption is a title, not a quote.
3. **The post's stab waits for the record, then lands 0.01 s after the cut to the Orb**, as a sixteenth push into beat 3, rather than pre-lapping the cut. The post holds the screen until 0.07 s before the cut, and P07 says "its stab waits".
4. **FEAR enters 0.12 s after its cut**, and its first E♭ lasts two beats instead of three. The lower third holds until 0.075 s before the cut, and the Podium's own grammar is to wait for his real words (OST §2.10). Its pickup B♭ is also dropped, because it would sound under his words and below C3.
5. **The timpani roll is on B♭2, below the dark room's C3 floor** (P01: nothing below C3 under the hum). B♭2 is a fourth over the hum's F2 and a fifth under its F3, so it doesn't beat against them. E♭2, MM-19's pitch, is a whole tone under F2 and would beat. The roll is pp and 1.25 s long, and the sub check passes (−20.4 dB against −18).
6. **The "tremolo low strings" are the cello's E♭3 and the viola's B♭3**, an octave over MM-19's E♭2 and B♭2. THE RUN's bass is the cello's pizzicato (D♭3–C4), with no double bass and no low brass, so THE RUN is light by necessity. That suits "xylophone and wood, pizzicato".
7. **THE RUN's pedal is the open fifth F, not B♭** (the V of E♭ minor). F is the room's own hum, and B♭ would sit below C3. F to E♭ minor is a whole step down into RUMPT's key.
8. **THE RUN returns 0.42 s before Mas's cut** (more than about 0.25), because it restarts on a bar line.
9. **Three knee stabs, one per dated item** (Aug 5, Aug 11, Aug 21). None lands on the pages (the laugh is the picture's), on the THUD (the SFX's), or on the verdict (the Orb's own motif is its item).
10. **Under the V.O., the felt's ostinato takes F where it had A♭, and the xylophone rests.** In render 2, the chip's short A♭4 sixteenths spread into the A band in a window where F carried only 6 % of the energy (sieved A/F 0.103, over the 0.08 limit).
11. **The felt's ostinato has its own track (`felt_ost`)**, with its body's A-ish resonances notched (−9 dB at 112 and 217.5 Hz, −5 at 428 Hz). In render 1 they read as A over the F m9 bass (sieved 0.157), and `felt_post` lifts 220 Hz by 2 dB.
12. **The head's felt fifth enters a beat in (0.75), not on the first frame.** In render 4, struck at 0.02, it was the pedal section's loudest moment, on top of the Door's held G.

## For the other passes

- **Mix (`mix_episode.py`):**
  - **The head.** The tag has no head fade (correct: no designed hit at its head). Act Four's ring-out crossfades out from the score's entry (0.21 s). Both are the same D♭ fifth.
  - **The designed hits** (`designed_hit`, keep their attack): the three knee stabs (4.500, 13.094, 22.625), the verdict's F5 (17.938) and FEAR's entry (27.625).
  - **The out.** The stem is cut dead at 37.000 (the last frame) on the cut to black: don't fade it early or extend it. The outro (E02-14) starts on its own music, and the stems already hold the dark room's hum 2 s under its head.
  - **The ducking.** No designed silences and no `claims_sfx`. The default duck (E02-13: 8 dB) applies only under the V.O., where the stem already rides itself 4.5 dB down. The lower third is not a `POST:` item, so the mix's −3 dB silent-post dip doesn't fire there: the stem thins itself (−11.4 dB).
- **SFX:** the score leaves room for, and never doubles:
  - `landing_thunk` (C and F, over the D♭ fifth: fine) and `orb_chime_F` (keep it F: the verdict follows it in F, a beat later);
  - `orb_scan_sweep`, `ui_toast_pop` ×2, `orb_servo`: no hits;
  - `page_turn` ×3, `blip_text_neutral`, `balloon_pump` ×3, `knot_tie` and `string_taut` are new (not on the board yet). None gets a hit. **`string_taut` sits over the held E♭-minor chord: untuned, or tuned to E♭ or B♭, never A.**
- **Picture:** no picture time is estimated in the code: every point is the lock's. Two optional notes:
  - If the four `human` labels are drawn one a beat apart from the scan sweep, they fall on THE RUN's beats (14.50, 15.13, 15.75, 16.38).
  - The knot is tied 0.075 s after the held E♭'s bar line (32.0).
- **The outro's composer (E02-14):** the tag ends on E♭ minor (E♭ G♭ B♭) with Mas's felt F4 on top, cut dead on the downbeat. The knee's F is already in the air.
- **The engine (`e02-v1-common/`, not edited):** two findings for the other segments:
  - **The felt upright's (KW) body resonances near 112, 217.5 and 428 Hz read as A energy over an F bass under a fast felt ostinato.** `felt_post`'s +2 dB at 220 Hz lifts them. Notch them on a copy of `felt` (call 11).
  - **Short chip sixteenths on A♭4 (about 0.1 s each) spread into the A band** when F carries only a few per cent of a window's energy. The sieve can't attribute that spread to the A♭, and it reads as a resonance. Keep F strong in such a window, or keep A♭4 out of a fast chip line over a weak F.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --dry --el          # the lock's runs, every mark, the changes, note QA
MRMAS_MAX_LOAD=40 OST_WORKERS=2 setsid bash ops/heavy.sh \
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --render --el < /dev/null
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --assemble --el     # re-lay render/_work/el, measure
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                   # the segment checks (PASS)
```

A render takes 13–21 s through `heavy.sh` [M], with other projects holding the load at 2–8. After any re-lock, re-render: every sync point comes from the lock (S5).

## For an ear, in order

1. **0–4.6 s:** the pedal takes over the Door's D♭ as the ring-out fades; the felt's fifth as he sits; the THUD lands on the pedal, not with it.
2. **4.5–8.9 s:** THE RUN has momentum: dry, light and the show's own (chip co-lead, felt, pizzicato, sticks). It is never boom-bap, upbeat corporate or a cartoon, and the pages' joke gets no comment.
3. **10.4–13.1 s:** under his post the run holds its breath (no melody), and the stab after it reads as the Orb setting off, not a rimshot.
4. **14.5–17.2 s:** the scan with xylophone and wood: the machine counting.
5. **17.2–19.5 s:** the chime, the stop, and the verdict a beat later over the open F: satisfaction, not a ding.
6. **19.5–22.6 s:** the V.O. sits inside the run; the last stab and the stop.
7. **22.6–27.5 s:** the pedal under his words is neutral and holds (no fear under his real words).
8. **27.6–33.3 s:** FEAR is hushed and chilly, not horror-movie; the band entering a beat after the cut reads as waiting; the roll and the held E♭ on the knot.
9. **33.3–37.0 s:** one held chord under the taut string and his face; the felt F4; the cut on the downbeat.

## Rules checked

[M] measured, [J] judged.
- **S1:** every cue names its motif and its mood (the cue sheet above) [J]. The show's own sound throughout:
  - the knee's cells: the knee stab (the title's quartal chord), the Build's arpeggio (the flat-line pair and the kink, rotated), the Podium (the knee's leap renamed), the verdict (the open fifth);
  - the chip: the Build's arpeggio as co-lead, the stab's double, the glass verdict (counted as chip), FEAR's one glint;
  - the leitmotifs: THE VERDICT, RUMPT's Podium in FEAR, the knee stab, the Build's engine, his felt;
  - the hybrid orchestra: pizzicato and sul-tasto strings, cup-muted trombone, muted horns, timpani, vibes, xylophone, wood;
  - the jazz colour: D♭maj9, F m9, B♭ m9, C7sus, F7sus, the quartal stab;
  - no third. No 808: LEVERAGE's only.

  No lounge cheer: the run is straight and dry. No generic pads: the sustained colours are bowed strings sul tasto and muted brass [J; ears 2, 8].
- **S2:** the chill is about a quarter of the scored time; momentum and warmth are the rest [J].
- **S3:** one continuous performance, 0.05 → 37.0: 0 holes, 0 fragments, 0 digital silence. It thins and ducks under the record and the V.O. rather than stopping; the engine's stop at the chime keeps the bed [M].
- **S4:** the act's sound leads: the D♭ fifth from Act Four's ring-out over the match cut; each change pre-laps its cut (0.17–0.42 s), except the three waits for the record (calls 2–4) [M].
- **S5:** every point is anchored to the lock, and the two re-timed locks re-lay [M].
- **S9:** laid to the lock's frames. The designed hits are marked (the three stabs, the verdict, FEAR's entry), and 6/6 hit marks have onsets within 10 ms. The soft entries: the bowed fifth (0.6 s attack), the pad's changes (0.2 s), FEAR's tremolo (pp → p), the held chord [M].
- **S11:** the story sounds keep their room: the THUD, the pages, the chime, the blip, the pumps, the knot, the string [J].
- **OST rules:**
  - 1: no comic scoring. Nothing lands on the pages, the false claim, the egg, "a little bit dangerous", the pumps or the string; the stops are the only tools [J/M].
  - 4: the knee is never whole, never completed [M].
  - 5: one grid [M].
  - 6: straight: the record and the machine [M].
  - 10: the record plays dry: nothing melodic under the caption, the post or the lower third, and no sting or swell under the V.O. [M].
  - 11: the score claims no sound [M].
  - 12: no A-natural anywhere [M].
- **Guardrails:** RUMPT's real words (the faithful Aug 21 crop) play over THE RUN's neutral pedal, never under the FEAR cue. FEAR scores only the invented, wordless balloon (D-70), and no motif comments on his words or his claim [J]. Nole's refiled suit plays under the pedal with no V.O. and no sting (W8) [J].
- **R10:** every render went through `heavy.sh` with `OST_WORKERS=2` and `MRMAS_MAX_LOAD=40`, one at a time (free memory 15 GB, so the default 8 G cap) [M].
- **R1:** Ep1 untouched. Only `audio/ost/tracks/e02-v1-tag/` was written. Ep1's tracks, `e02-v1-common`, `mm19-renamed-it` and Act Four's track were read, never edited.
- **R8:** nothing heard.
- **Broken on purpose:** the twelve calls above.

**Resource ask (R16, non-blocking):** one human listen of the nine points above, ears 2, 5 and 8 most of all. Whether THE RUN reads as the show's own and not corporate, whether the verdict lands as satisfaction, and whether FEAR is hushed and not horror-movie, are an ear's calls.
