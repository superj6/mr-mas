# Ep1 · Act Four · Flow audit of v4

| | |
|---|---|
| **Who** | The flow auditor, 2026-09-26. |
| **What** | A review of `out/ep01/act4/animatic/act4-animatic-v4.mp4`, its mix `act4-mix-v4.wav` and [report-v4](report-v4.md), against [flow-and-continuity](../../../../bible/flow-and-continuity.md) §1–5. The build is also checked against [edit-plan-v4](edit-plan-v4.md) where that helps. I read the live [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) first, and nothing there is newer than the brief. |
| **Honesty** | **I haven't watched this in real time or listened to it, and I can't.** Every finding below comes from numbers I measured myself and from stills I pulled from the encoded mp4. Where I write "likely plays as…", that's a prediction for a human to confirm or overrule. Nothing here says the act flows, reads or sounds right. |
| **The test** | At every spot the question was whether the act plays fluid, clear and entertaining, not whether a number was met. I used the numbers to find spots, then judged each one from the stills and the timeline. |

**How I measured (independent of `report_v4.py`).**
- **Mix buses.** I ran a scratch copy of `mix_v4.py` up to the final sum (no project writes) and dumped the levels of the mix, dialogue, music (before and after the duck), SFX and beds. The rebuilt mix matches the written `act4-mix-v4.wav` to 1.2 × 10⁻⁷, so the per-bus numbers describe the file that was muxed.
- **Levels.** 50 ms windows, on the louder channel unless marked "mono".
- **Sync.** I decoded the mp4's AAC and cross-correlated it with the mix at 0:15, 1:40, 2:50 and 4:10: the lag is 0 samples each time.
- **Picture.** All 6,453 frames decoded from the mp4, with the show frame cropped back to its native 480 × 270. From those: cut detection, per-shot motion, and the first, middle and last frame of every shot, all looked at.
- **Timecodes** are episode TC (act clock = TC − 12:31:00).

---

## 0. Short version

v4 fixes what the showrunner named in v3, and I reproduced those numbers:
- 82 shots, median 2.83 s
- five continuous music renders with no splices
- the accidental holes gone
- replies spaced like talk

What still hurts is mostly **level**, not cutting. The score now stays on, but the mix ducks it 10–16 dB under every **silent** post and card, and it swells back in the gaps. So the act pumps in and out every few seconds through the board's side. And the reveal chapter (S5) plays as the quietest, stillest 44 s of the act.

That's likely to read as a new version of "jagged" and "pauses of silence", even though no single number is a hole.

The picture problems are specific and fixable:
- a count the audience can't see (S2)
- a stop that lands on a glance too small to read (S5.09)
- a speaker who can't be found (S7.02)
- duplicate faces in the avalanche (S6)
- a payoff drawn too small (S7.13)

## 1. The report's numbers, re-measured

| Measure | report-v4 | Mine | Note |
|---|---|---|---|
| Shots · mean · median | 82 · 3.28 · 2.83 s | same | |
| Under 1.5 s | 4 | 4 (S1.08, S6.05, S7.03, S7.12) | |
| Runs of 3+ under 2 s | 1 (S6.02–S6.05) | 1. At a 2.1 s threshold, also S4.14–S5.01 and S7.03–S7.05 | S7.03–S7.05 is a real spot (§2, #4) |
| Cuts on the planned frame | 77 of 81 | 77 of 81 | S2.02 → S2.03 → S2.04 and S6.05 → S6.06 join near-identical frames: in the picture they aren't cuts |
| Music runs (before the duck) | 8, shortest 4.75 s | 8, shortest 4.75 s | |
| Music runs **as heard** (after the duck, over −50 dBFS) | — | 9: the violin → Rhodes hand-off drops out for 0.35 s at 15:53:14, under Tasya's line | Over −45 dBFS: 14 runs, with pieces of 0.20–2.55 s inside S1.03 and S7.01 |
| Holes under −42 dBFS for 0.3 s+ | 2 mono, 1 louder channel | same (13:04:05 3.45 s; 16:38:13 0.45 s) | |
| Jumps over 15 dB | 62 mono, 38 louder | 62 mono, 37 louder | |
| Audio sync on the mp4 | 0 samples | 0 samples | |

The report is accurate on what it measures. What it doesn't measure is how the level moves between shots. That's where most of the remaining trouble is (§2, #1).

---

## 2. Spots that hurt, most important first

### 1. The score pumps and the mix sags under every silent post (S3–S4 worst; the whole act)

**Where.** Nine windows of on-screen text with no voice:
- S3.03 13:32:08 · S3.05 13:40:18 · S3.09 13:51:01 · S4.01 13:56:13 · S4.09 14:27:01
- S5.03 14:51:02 · S5.06 15:00:07
- S7.11 16:20:06 · S7.13 16:24:18

**Measured.** `mix_v4.py` treats an unvoiced post as a record item. It ducks the music −10 dB and thins the melodic families −15 dB, exactly as it does under a voice. With no voice to replace it, the whole mix drops.

| Post | Mix: shot before / post / shot after (dBFS) | Music as heard: before / post / after |
|---|---|---|
| S3.03 blog post | −21.3 / **−35.2** / −23.1 | −21.5 / **−37.7** / −30.8 |
| S3.05 Gerg's post | −23.1 / **−32.4** / −23.8 | −30.8 / −34.8 / −28.1 |
| S3.09 his 9:32 post | −23.3 / **−30.6** / −29.0 | −23.6 / −31.8 / −30.3 |
| S4.09 lobby post | −23.7 / **−32.0** / −23.9 | −30.2 / −33.1 / −24.1 |
| S7.11 Gerg returns | −23.6 / **−30.7** / −23.7 | −23.7 / −32.8 / −24.0 |
| S7.13 Ttemme | −23.7 / **−31.8** / −22.0 | −24.0 / −34.0 / −23.1 |

- **The swing.** Second by second through S3 (13:31–13:51), the heard music reads −23, −25, −37, −38, −38, −33, −32, −29, −31, −23, −34, −35, −36, −24, −29, −30, −35, −35, −23, −24. That's a 10–15 dB swing every 2–4 s.
- **Across the act.** 22 dip-and-return cycles of 8 dB or more, and 20 one-second sags of 10 dB or more under their surroundings, all outside the designed stops.
- **Under the lines.** The same duck sits the music 20–27 dB under some voiced lines, well past the plan's ≥15 dB target:
  - THE PLAN's read, 23–24 dB
  - Alyi's post, 25.8
  - Tasya's "below…" line, 22.1
  - the whole coda, 26–27.5

  So the score vanishes under a line and comes back after it.

**Why it hurts.** The showrunner's note was "the ost should not be playing for just half a second at a time then stopping… too jagged".
- v4 no longer stops, but it breathes in and out at the same cadence the posts arrive.
- On laptop speakers, a post at −31 to −35 dBFS between shots at −21 to −24 will likely play as the room going quiet, which is the "random pause" feeling again.
- **The worst case is S3.03.** The picture is frozen for 3.6 s while the mix sits at −35. And this is the board's public reason, "not consistently candid" (must-understand #5).

**Fix** (`mix_v4.py`: the `KEYS` built from `LOCK["posts"]` and the record texts, and `duck_curve`):
- **Under unvoiced text:** keep the thin (no melody, hits or comic scoring on the words; that's what "plays dry" means now), but set the duck to about 0 to −3 dB, not −10.
  - Optionally lift the held families (strings, bass, pads, piano) about +2 to +3 dB inside the thin window, to replace the energy the melody took away.
- **Hold the duck across gaps up to about 2.5 s** in S3–S4, where items arrive every 3–4 s, so the score doesn't surge for one second between them. The current hold is 1.2 s.
- **Where the cue is already thinned to a pedal** (S5, S7.01–S7.02, S8's coda), duck voiced lines about −6 to −8 dB, not −10 or more.
- **What to aim for, as a guide:** the one-second mix level stays within about 6 dB across a post, and the heard music within about 6 dB from shot to shot through S3–S4.
- **Check by ear.** Some of the hush under a real quote may be wanted. Keep it where it plays as tension, and say so.

### 2. The reveal chapter (S5, 14:46:14–15:30:20) is the quietest and stillest 44 s of the act

**Measured.** In S5's wordless stretches the mix's median is **−32.9 dBFS**, against:
- S4 −25.4
- S3 −29.3
- S7 −26.9
- S6 −17.9

So it sits about 7.5 dB under the board's side and 15 dB under the avalanche that follows it. The S5 cue is laid at −8 dB against its master (`CUE_TABLE`, 3302–4300), where the other cues sit at −1 to −1.5. On top of that come the post duck (#1) and the thin.

**The letter, S5.06 (15:00:07, 10.25 s).**
- **Sound.** The mix sits at −34.5 median, and the music as heard at −37.
- **Picture.** Only the counter and the typing move.
- **The reveal is spoiled.** `ALYI (REPORTED)` is already legible at the bottom of the page from the shot's first frame (f3584), 9 s before the scroll "stops on" it (edit-plan §3 S5.06 builds the reveal on that stop).

**Why it hurts.** This is where the tide turns: the staff, Alyi, the money, Gerg, the open door.
- The showrunner wants a thriller. Instead, the act's biggest reveals come in text, in near-silence, at the lowest energy of the act.
- It's likely to play as a lull or as homework (edit-plan §8, check 7), and the insider read will likely call it a drag.
- The avalanche's +15 dB contrast is earned, but 44 s is a long run-up at a hush.

**Fix.**
- **Level:** raise the S5 cue to about −3 to −4 dB, and apply #1's un-duck under the letter, the check and Rima's post.
- **Composition** (a new render in `audio/ost/tracks/e01-act4-v4/`, the composer's call):
  - Give the dark-room pedal a pulse or tremolo that enters with the counter's roll and tightens up to the launch-night *clunk*. That keeps the plan's rule of no 2 s cell of Gerg's motif on the counter.
  - Let the pulse hold, a notch lower, under the check.
- **Picture:** lay the page out so `ALYI (REPORTED)` sits below the fold until the scroll brings it up. The shot's length is justified by its reads (the header, the insult's 4.0 s floor, the demand's 2.3 s), so don't cut much. Make it play with sound, not by trimming.

### 3. Stop 2 lands on a glance too small to see, then leaves 3.5 s of room tone (S5.09–S5.10, 15:20:17–15:24:05)

**Measured.**
- **The silence.** From Gerg's last line to the V.O. "gerg never waits to be asked.", the mix sits under −33 dBFS for 3.5 s (median −39.2, room only). That's the longest near-silence in the act apart from D6.
- **The glance.** The stop is keyed to it (S5.09 +5.12 s). But in the over-the-shoulder, Gerg's head is about 25 px wide in the 480-px frame, low in the monitor behind Mas's shoulder, so the look up into his camera is a few-pixel change. The plan asked for "Gerg's tile large".
- **The contrast.** The stop falls inside S5's hush (#2), so the music drops from about −34 to nothing.

**Why it hurts.** A dead stop works as punctuation only if the audience sees what it punctuates. Here the cause is barely visible and the level change is small, so this is the stop most likely to read as a random pause of silence.

**Fix.**
- **Show the cause.** Cut in for the glance: a 2× crop of Gerg's tile (the plan's own blueprint-detail method), about 1–1.5 s, or a tighter over-the-shoulder, so the stop has a visible reason.
- **Shorten the room-only stretch** to about 1.5–2 s. Bring the keys back, and the pedal under S5.10, about a second sooner, rather than waiting for D8.
- **If the watch still hears a hole,** make stop 2 a ring-out: the Build drops out and the pedal holds. That keeps the dead stops for Cancel, Mada's label and "Terms?", three for the act, which the guide calls about right.

### 4. The Macrosoft-floor beat is muddled: no findable speaker, then a fleeting "hi." / "Hello." and a jump (S7.02–S7.05, 15:52:10–16:03:04)

**Seen.**
- **S7.02 (5.75 s).** Tasya's big line, "We are below them, above them, around them.", plays over a crowded wide of about 15 standing employees.
  - Tasya is seated behind the desk row near centre. Mas is the small cyan figure seated at centre-right. Neither stands out.
  - The plan asked for Mas small at his end desk (left) and Tasya mid-floor.
- **S7.03 (1.25 s, "hi.").**
- **S7.04 (1.75 s).** The overhead of the floor, with "Hello." overlapping. It reads as abstract blue tiles with a brown wedge and a dark curve, not as shoes and a floor.
- **S7.05 (2 s).** A jump to Nov 21 at 10 PM.

**Measured.** Three shots of 1.25–2 s in a row. The violin → Rhodes hand-off drops the heard music under −50 dBFS for 0.35 s at 15:53:14, inside Tasya's line.

**Why it hurts.**
- **The payoff.** This is the payoff of must-understand #9 and #10: Macrosoft's door is open to everyone, and the staff are packed to follow him. A newcomer has to find the speaker of the line that turns the office slate. Missing him costs the "Macrosoft is taking the company" thread.
- **The exchange.** "hi." / "Hello." is a quiet two-level joke (Mas meeting the landlord). It goes by in about a second, then the time jump lands before it settles.

**Fix.**
- **Restage S7.02:** Tasya standing in the aisle in the foreground (or the right third), the only figure facing camera, the slate spreading out from his feet on "below / above / around". Mas at his end desk, left third, as planned. If that can't be drawn cheaply, cut to Tasya's MCU for the line.
- **Replace S7.03 + S7.04** with one held two-shot, about 2.5 s: Mas eyes down, Tasya's shoes and legs entering at the frame's edge on the slate. "hi." / "Hello." play in it, then the crackle pre-laps into S7.05.
- **Overlap the Rhodes pad** under the violin's decay, so the heard music doesn't drop out under the line.

### 5. The Orb's count can't be seen, so TPOOL floats (S2.02–S2.04, 13:15:20–13:22:14)

**Seen.**
- S2.02 (1.75 s) and S2.04 (1.5 s) are the same 2S. In it, the Orb is about 15 px across, and the marks it "counts" are a few pixels on the desk under Mas's hands. The iris stepping onto mark 1, 2, 3 isn't legible.
- The cuts S2.02 → S2.03 and S2.03 → S2.04 join near-identical frames, so S2 plays as:

  | Stretch | Length | What plays |
  |---|---|---|
  | S2.01 | 4 s | the carve |
  | S2.02–S2.04 | 6.75 s | one held wide with a flashback in the middle |
  | S2.05 | 2.5 s | the Orb |

- The render front is meant to sweep "out of the mark", but the mark isn't visible where it starts.

**Why it hurts.** Must-understand #4 ("it has happened before, and he counts") now rests on S2.01's carve and the rail `2005–08 · TPOOL, HIS FIRST COMPANY` alone. The two shadows behind a frosted door don't say "pushed out" without the count tying the old marks to them.

**Fix.**
- Make S2.02 and S2.04 an overhead ECU of the three marks (S2.01's desk drawing), with the Orb's cyan eye-light as a spot that steps from mark to mark.
- The front sweeps out of the lit mark 1 (S2.03), and the light lands on 2, then on 3, which is his thumb (S2.04).
- Keep the 3.5 s flashback and the invisible cut back to the desk.

### 6. The act opens with the score stopping twice in its first 10 seconds (S1.02–S1.03, 12:34:02–12:41:15)

**Measured.**
- **12:34:02–12:35:18.** The felt falls from about −25 to −40 dBFS under the nudge (S1.02), and the mix sags 12 dB.
- **12:35:18.** The music cuts out for 0.20 s at the blueprint's cut.
- **12:36:00.** WORD slams in 25 dB up (−42 → −16.7).
- **12:41:00–12:41:14.** "The musical-chairs rest" takes the music out for 0.55 s **inside** Neleh's line "This board controls the company." (the line runs 12:40:03–12:41:23), during the tilt.
  - The plan put this rest on the three chairs walking off (S1.03 +1.50 s). It landed 3.75 s later, under a voice, where it can't play as the gag.

**Why it hurts.** This is the first thing the showrunner hears after a note about music that plays in fragments and stops. The hush-then-slam into WORD is a defensible sting. A 0.55 s dropout under a line, one that isn't tied to a picture beat, reads as a stumble.

**Fix.**
- Let the felt ring through the S1.02 → S1.03 cut into WORD: crossfade it, with no 0.20 s drop.
- Move the rest into the 0.54 s gap between Neleh's two lines (frames 206–219), on the box drawing round the six (`box` mark, frame 208): the chairs are taken, and the music stops. Or drop the rest.

### 7. The avalanche shows two of each board member (S6.03, S6.04, S6.06; 15:36:20–15:46:10)

**Seen.**
- The [POV·half] beats are drawn as a large tile laid over the locked grid, and each member's own grid tile stays visible beside it:
  - **S6.03:** a big Alyi, plus the grid's `ALYI` tile at left (f4461).
  - **S6.04:** a big Neleh, plus her grid tile's shelves.
  - **S6.06:** a big `MADA · LAST FIRER STANDING` tile, plus the grid's `MADA` tile and green sweater, bottom left (f4636).
- S6.05 → S6.06 isn't a visible cut (the report's flag). The big Mada tile then appears mid-shot.

**Why it hurts.** The montage's one idea per beat is "each of them is pushed out". Two copies of the same face on screen ask the viewer which one is being pushed. On the last beat there are two Madas when the joke is that only one is left.

**Fix.**
- When a member's tile is enlarged, blank their grid tile into the stack, or cut to a true 2× crop of their own grid tile, not an overlay.
- Merge S6.05 and S6.06 into one shot (the invisible cut plays fine), then cut in 2× on Mada's own tile for the label flip.

### 8. The hourglass payoff is drawn too small, over 5.5 s of mostly empty frame (S7.13, 16:24:18–16:30:06)

**Seen.** The hourglass is about 10 px wide, in the middle of a dark overhead that's more than 80% empty table. The glass shattering and the sand holding its shape are too small to read. The plan's build note asked for "the hourglass overhead at insert scale" (§3, S7).

**Measured.** The mix sits at −31.8 median (the post duck, #1), and there's the sand's designed 0.45 s rest.

**Why it hurts.** It's the payoff of S4.11's flip and the button on the return, right before the lobby, and it currently plays as a quiet, near-empty hold. The insider read will likely call it drag.

**Fix.**
- Draw the hourglass at insert scale, about a third of the frame's height, with Ttemme's post top-left.
- Trim to about 4.5 s if the shatter reads sooner.
- Apply #1's un-duck.

### 9. Stand-in labels show in the picture: `post-ui` on six post cards

**Seen.** The tag `post-ui` is printed in the corner of the post card in S3.05, S3.09, S4.09, S7.01, S7.11 and S7.13. The plan says stand-ins are "never a label", and the v3 cold viewer "read the labels as noise".

**Fix.** Take the tag out of the post card's chrome. It's the same card component everywhere.

### 10. A flat black box covers Rima for the whole of her one close-up (S3.04, 13:36:02, 4.67 s)

**Seen.** A flat black box covers her lower torso and the chair front (the report's flag). The shot is otherwise frozen apart from her mouth, so the eye goes to the box.

**Fix.**
- Draw the laptop lid (a rim light, a logo) or the chair's arms, or reframe to lose it.
- Low priority for flow, but it's the introduction of a character.

### 11. The told-twice "super." sits only 7 dB over the pizzicato (S3.01, 13:25:15)

**Measured.** Dialogue −22 against music −29, the lowest dialogue-over-music margin in the act. That's by design ("the tiny voice under the procedure going on is the joke"), and the call's caption types `super.` on screen.

**Why it matters.** It's the hinge that tells the audience "same moment, other side".

**Check, don't change yet.** If the ear loses the word, thin the pizzicato for its 0.7 s instead of ducking harder.

---

## 3. What the build did differently from the guidance or the plan, and helps (keep)

- **Held shots that aren't cuts.**
  - S2.02 → S2.03 → S2.04 and S6.05 → S6.06 join identical frames, so each plays as one continuous shot. That's fewer cuts and more fluid.
  - Keep them as single shots, and update the shot list to say so, once #5 and #7 are fixed.
- **Five continuous to-picture renders, no splices, one bed per room.** This ended v3's holes. The only near-silences left are D6 and designed stops. Keep it.
- **Four stops and a few rests, each on a story beat.**
  - D6 (3.45 s of true digital silence, over a frozen still face with `+1 FIRING` typing) and the "Terms?" hold (5.7 s of fires and lines) are designed and earned.
  - Keep both, and have a human confirm that D6 doesn't read as a playback dropout. Stop 2 is the exception (#3).
- **Dialogue spacing.**
  - Reply gaps run from −0.29 to 1.29 s, median 0.50 s, with seven scripted overlaps.
  - They follow the performance, not a grid. This is what §4 asked for.
- **Jumps.** Most remaining jumps over 15 dB are words against a room about 20 dB down. That's natural, and there's nothing to fix.
- **The lobby coda (S8.01–S8.05).** 5 cuts in about 11.5 s, the most in any 10 s of v4. Each is its own gag under VICTORY LAP, so it's a coda, not over-cutting.
- **Runtime.** It grew by 20 s. From the stills, the added time is orientation and held reads, not padding, apart from S7.13 (#8).

## 4. Process: the §5 checks can't yet be run as planned

- **The timed transcript isn't fit for the newcomer read.**
  - It names speakers before the show has identified them: `NELEH:` at 0:06, `MADA: Good question.` at 0:16, though Neleh's card and Mada's tile come at about 0:24. edit-plan §8, check 13, asked for "VOICE ON THE BLUEPRINT" until a name is put on screen.
  - It also leaves out load-bearing on-screen text:
    - `+1 FIRING`
    - `VOTES: 0`
    - `GUEST`
    - `ALYI (REPORTED)`
    - the S3.03 blog quote
    - the letter's insult and its demand, `"…unless all current board members resign…"`

    That's because of two filters in `transcript()` (`report_v4.py`): the more-than-three-words cutoff, and a rule that skips every on-screen text of kind `post` on the assumption that each post is also a line. S3.03's quote and the letter's two quotes aren't lines.
- **The picture-only file predates the mix.** `act4-animatic-v4-picture-dlgguide.mp4` was written at 03:42 and the v4 mix at 05:18, so it can't carry the v4 mix. The cold reads need a picture-only (show-frame crop) render with the v4 mix muxed in.
- **The transcripts are gone.** The files the report points to (`scratchpad/act4v4/transcript-v3.txt` and `transcript-v4.txt`) no longer exist: the whole `act4v4` scratch folder was removed while this audit was running. My own scratch went with it, so I redid the measurements in a separate folder, and have deleted that too.

## 5. What a human still has to check (in real time, with sound)

1. **The whole act, once, with no notes.** Does the level ride under the posts (#1) feel like breathing or like dropouts? Does S5 (#2) play as tension or as a lull?
2. **The four stops, and D6's 7.65 s music-free span** (13:04:04–13:11:19).
3. **The newcomer and insider reads (§5a)**, with the transcript and file fixed as in §4.
4. **Everything in edit-plan §8** not covered here: judder on the whole-pixel moves, the S4.08 split's legibility in its 240-px panes, the mouths.
