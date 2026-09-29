# Ep1 v3.5: the combined final check (newcomer read, new seams, sound audit)

> **Status: DONE, 2026-09-28.** One pass over the finished film `out/ep01/full-v3/ep01-v35.mp4` (23:09.67), against [proposal-v35](proposal-v35.md), [PLAN §8](PLAN.md) and the seam table in [script-v35-notes §5](script-v35-notes.md).
>
> **Nobody watched or listened.** Every claim is tagged:
> - **[M] measured:** from the film's decoded audio, the stems, or the frames' timing.
> - **[J] judged:** a reading of frames and transcripts, which an eye or ear should confirm.
>
> Nothing was committed. The scratch frames are deleted.

## Verdict

**[J]** The episode reads as Mas's rise, his blow and his return.
- Every new or changed seam is caused, and nearly all of them carry a visible matched object.
- The new scenes carry the arc: 2018, the vision post, 2019, the tour, the war room and Alyi alone.
- The two style leaps (the tear macro, and CLOD in clay) sit inside the pixel world without looking pasted on.

**[M]** The audio passes on every global number:
- −16.08 LUFS integrated, −1.17 dBTP.
- No holes.
- The one silence is clean.
- Every level step over 15 dB falls on a designed hit, a line or a marked stop.
- MARIO's Kokoro voice sits within 0.6 dB of the ElevenLabs cast.

**There is one real defect.** Sydney's egg timer keeps ticking for about 43 s past its scene (6:49.6 → 7:32.4): through the window, the lamp and the whole vision post, under "someone gets to be in the room.", onto the cut into Atem, and two bars into it.
- It comes from a v3.1 SFX layer that ends "at 11.01", and v3.5 inserted two scenes before 11.01.
- The fix is audio only (S).
- **Once it's fixed, the film is ready to ship.**

## Must fix

| # | Film time | What's wrong | Fix | Cost |
|---|---|---|---|---|
| 1 | **6:49.6 → 7:32.4** (the window, the lamp, the vision post, a tick on 11.01's cut at 7:27.96, and two bars into Atem) | **[M]** About 60 egg-timer ticks past Sydney's scene, one every 0.625 s (96 BPM), peak −26 dBFS with a 2.9 kHz ring (the stems' own report: 6:44.11 → 7:32.37).<br>• In the 2–6 kHz band each tick stands 33–41 dB above the bed of the vision post, including under the V.O. at 7:21.<br>• In the 1–8 kHz band each tick comes within 3.8 dB of the whole mix's energy.<br>• A tick lands exactly on the cut at 7:27.96. It is the only undesigned click at a cut in the film (second difference 0.049 at +0.9 ms).<br>**[J]** It plays as a metronome under the team's peak and the vision post, and it masks the post's keys and the Publish click.<br>The seam table says the tick should *become* the marker's squeak at the window (seam 7). | **Cause:** `audio/reel/ep01-v3/stems.py`, the v3.1 layer (about lines 1163–1195) sets `cut = G1.s('11.01')` and carries the ticks 8 beats into the duel.<br>**The fix:**<br>• End the ticks at `v35-18.01` when that beat exists.<br>• Drop the carry into the duel, since the lid's match cut now lands on the window, not on 11.01.<br>• Optionally, move `marker_write_q` from +0.3 s to a J of −0.6 s, as seam 7 specifies.<br>**Then:** rebuild Act One's SFX stem, remix Act One, and re-run `assemble.py el-v35` and `qa.py el-v35` (assembly.md §Z, lines 100–102). No picture render. | S |

## Optional (ranked)

| # | Film time | What | Fix | Cost |
|---|---|---|---|---|
| 1 | 7:04.1, 7:06.6, 7:13.1, 7:16.6, 7:24.96 | **[M]** His keys and the Publish click sit 19–28 dB under the mix in 1–8 kHz, so the vision post types in silence. They're masked by the felt note that lands on each passage (and by the egg timer, until fix 1). | After fix 1, +10 dB on the keys and the click, or lead the felt note by 2 frames. | S |
| 2 | 4:35.25 and 4:40.5 | **[M]** 3 AM's felt F4 enters at −36 → −15.8 LUFS (0.4 s window). The 180 YEARS "bloom" enters at −36 → −14.4 in 0.1 s, at dialogue level. **[J]** This is the act's one hushed moment, the score README says "nothing attacks", and the bloom attacks. | About −6 dB on both, with a 0.4–0.6 s fade-in on the bloom (the score bus in the mix). | S |
| 3 | 18:27.5 → 18:33 (seams 29–30) | **[M]** The hearts' soft ticks are 26 dB under the mix. The L-cut from Alyi's phone to Mas's is carried by the score and the picture, not the ticks. | +12 dB on the ticks. | S |
| 4 | 14:57.6 → 14:59.3 | **[M]** War-room buzzes 2–7 sit 16–32 dB under Mas's V.O. and the pulse; only the first buzz (14:57.30, −9 dB) reads. **[J]** The picture stacks the calls, so this is texture, not a fault. | +6 dB on buzzes 2–7, or nudge them into the V.O.'s gaps. | S |
| 5 | 18:01.0 → 18:03.3 (the blank page) | **[M]** The page turns over at about 18:02.9 and reads blank from about 18:03.0. The score's chord swells from 18:01.0 and crests at 18:02.4. The paper SFX is 22 dB under the mix. **[J]** It plays as music anticipating the reveal. Tolerable, but the page lands on nothing. | Delay the chord about 0.8 s; +15 dB on `paper_curl`. | S |
| 6 | 8:05.46 (the rope) | **[M]** The snap SFX is on the picture's snap (k4) and audible in 1–8 kHz (−4.4 dB against the mix). The score's tag lands 0.73 s and 1.1 s later. **[J]** It reads as snap, beat, sting, which is a legitimate reaction sting. It's tighter if the tag's first attack moves about 0.35 s earlier. | Shift the waitlist cue's tag about −0.35 s. | S |
| 7 | 11:04 → 11:15 (the tour) | **[J]** No line or card names Europe, and NOTERB appears only as a post. A newcomer gets "threat, pushback, retreat" but not *whose* rules. | Add `EU` to NOTERB's card (e.g. `NOTERB · EU`). | M (one beat's frames) |
| 8 | 7:36 → 8:05, 11:23 → 11:42, 17:22 (MARIO) | **[M]** Level matched. **[J]** His presence band sits toward the bright end of the cast, most noticeable beside Sirrah (8:41) and Adelina (17:29) (numbers in §3.4). | Only if an ear finds him forward: −2 dB at 2–4 kHz more in `KOKORO_IN_EL_EQ`. | S |
| 9 | 15:23.4 → 15:27 (the plane) | **[M]** The plane room's "low roar" is no louder than the suite's room in 20–150 Hz (−44.5 against −42.6 dB), and the ringing phone before it is masked (−18 dB). **[J]** The plane reads through the picture and the score's held fifth. | +6 dB low end on the `plane` room. | S |
| 10 | 10:34.0 → 10:37 (2019) | **[M]** The "old box fan" measures the same as the hearing room it replaces (every band within 2 dB), and no marker squeak is on the SFX stem. The seam's lead is the score's 1 s swell, which works. | +6 dB on the fan, if the ear wants the room to change. | S |
| 11 | 7:55 → 8:05 (CLOD) | **[J]** The clay figure matches the pane's scale and lamp light, with no halo. It has no contact shadow on its plinth, which is the only thing that reads slightly pasted on. | A soft contact shadow in the overlay. | M |
| 12 | docs | SHOWRUNNER-NOTES (note 00000, "Also") still says JUN 2018 "moved to DevDay in Act Three". The agreed proposal (967170b, 6 min later) records the showrunner choosing Act One after 3 AM, which is what the film does. | Update the notes line. | S |

---

## 1. Newcomer read [J]

### Does it read as rise, blow and return?

**Yes.**
- **The rise:** launch, a million users, the bill, the landlord, the rivals, the vision post, the Senate, the tour, the statement and chips, the Orb, DevDay's 100M a week.
- **The blow:** the Friday call at 14:28.
- **The return:** in five days, on the landlord, the money and Gerg.

The acts each end on a clear turn: PLEASE REG, the $1T climb, the board-sync invite, and the observer chair.

### The five questions

- **Why they want AGI (JUN 2018, 4:40–5:15): clear.**
  - "Nobody taught it that. It played itself." gives the wonder.
  - "Something that can learn anything, Mas. What else would you build?" gives the reason.
  - "then a lot more computers." gives his practicality.
  - "Games now… After that… I don't know." shows they didn't know the road.
  - The rail, the glowing line and the counter match make it unmistakably a memory.
- **What Mas wants: clear enough.**
  - The vision post (7:03–7:24) holds its three passages long enough to read.
  - "someone gets to be in the room." (7:21) echoes the cold open's "in the room" (0:04). A first-time viewer may not connect them; the post's own text carries the want either way.
- **How he plays: clear.**
  - The bill becomes the landlord's check.
  - His own PLEASE REG sheet goes to the Senate.
  - "i have no equity", then 2019 shows why (EQUITY: 0).
  - The tour's threat and retreat.
  - The Orb.
  - After the blow: the war room's calls and the TERMS notepad.
- **Why the firing lands as a shock: clear.**
  - It comes straight after the peak (DevDay, "super.").
  - His V.O. expects a budget talk ("probably the budget. good. i'll ask for more compute.").
  - The cold open planted the same invite as routine.
  - The Remove dialog and the one silence sell it.
  - Neleh's blueprint then shows how his own 2019 structure made it possible ("CEO · EQUITY · VOTES: 0").
- **Why Alyi reverses: clear, and shown rather than said.**
  - His held face at the vote (16:24.4).
  - "Gerg has never waited to be asked." (17:02).
  - Tasya's statement over his reflection (18:15).
  - Alone with the packed bullpen and the users line (18:27–18:32).
  - "Alyi signed it." / "alyi voted." / "He did both." (19:16).
  - His own post: "I love everything we've built together… reunite the company." (20:15).
  - The hearts on his phone at 18:31 are tiny; the post does the work.

### Confusing or out of nowhere (film times)

1. **11:04–11:15, the tour's target.** Europe is never named: "comply" with what? And who is NOTERB? The gist lands (a threat, pushback, a retreat), the target doesn't. See optional #7.
2. **15:32–15:38, TPOOL.** No year, and the name is unexplained. It still reads as "this has happened to him before" because of the three marks and "i don't keep score.". That's partial by design, and fine.
3. **17:59–18:03, the blank page.** It is a small white sheet in a wide, so "they have no reason" may slip past. Neleh's empty "4. ____" at 18:24 partly covers it again.
4. **15:14, "—the tender's in trouble—".** Opaque chatter until "That's the share sale." at 19:26. It is harmless as overlap.
5. **20:38, Tasya's "We are below them, above them, around them."** A wall-TV clip that arrives without a setup (kept from v3.4).
6. **Nothing new is out of nowhere.** The old worst seam (into the tour and Nesnej) is now caused: the gavel becomes a stamp, the guest book's pen becomes the statement's pen, and the INVIDIA plants at 3:29 and 4:43 pay off at 11:43.

## 2. Transition check (new and changed seams)

- **Sound leads** were measured on the stems and the film.
- **Objects** were seen on 4 fps frames (24 fps at the rope).
- **"Natural"** is judged.

| Seam | Film | Caused? | Sound lead [M] | Matched object [seen] | Natural? [J] |
|---|---|---|---|---|---|
| Call → the first weeks | 3:41.79 | Yes: strangers posting | The first weeks' cue hits on the cut (−14 dBFS), pre-lapped only about 0.1 s, not 0.6 s | His phone → a stranger's phone | Yes |
| First weeks → Elgoog | 4:00.29 | Yes | The siren (kept) | The desk of phones, his lit red → `ELGOOG · CODE RED` | Yes |
| Elgoog → 3 AM | 4:30.74 | Yes | Marked no-score; the room carries it | The phone OTS → the laptop, `AT CAPACITY · 3:04 AM` | Yes |
| 3 AM → JUN 2018 | 4:40.25 / 4:42.05 | Yes: he remembers why | The score's bloom 1.55 s ahead of the 2018 picture, +21 dB in 0.1 s (optional #2) | `USERS:` → `PLAYED AGAINST ITSELF TODAY: 180 YEARS`, same place and size; then the glowing line | Yes, and the strongest new seam; the bloom is hard |
| 2018 → January lobby | 5:15.54 | Yes: "then a lot more computers." | The lobby's bass on the revolving door (score README) | The glowing line sweeps back while he walks out with his glass, and he enters the lobby on the same side of frame | Yes |
| Sydney → the window | 6:49.61 | Yes: Gerg, stung | **Wrong:** the egg timer ticks on through the scene (must fix #1); the marker squeak lands +0.3 s, not as a J | Gerg's lid closes → his hand with the marker | The picture yes; the sound no |
| The window → the vision post | 7:03.34 | Yes | The lamp's felt F4, then the title's A♭4; the keys are masked | Mas alone under the lamp → the blank editor | Yes |
| The vision post → Atem | 7:27.97 | Yes: a rival answers the same day | The Build's chip line leading; the lid (audible, −1.6 dB); a stray egg tick on the cut | His lid closes → Gerg's lid opens on the board | Yes |
| CLOD overlay | 7:55 | Yes: CLOD's line | "You're absolutely right!" | The pane's lamp comes on, revealing the clay figure on the plinth; scale and warm light match | Yes (optional #11) |
| Split → the waitlist | 8:05.30 | Yes: they're ahead | The snap SFX at k4 = 8:05.46, on the picture, audible in 1–8 kHz; the score's tag +0.73 s | The users line behind the TV | Yes (a reaction sting) |
| The waitlist → the pause letter | 8:08.30 | Yes | The toast pop | The wall TV → his monitor | Yes |
| That night → the Senate | 9:40.54 | Yes: the reminder, the sheet | The gavel and pizz downbeat on the cut, +20 dB (designed) | The sheet in his hand → the same sheet under his hand on the green table | Yes; the cleanest match in the act |
| The Senate → MAR 2019 | 10:34.83 | Yes: "no equity", and why | The score swells 1 s ahead, then hits on the glowing line; the fan isn't distinct (optional #10) | The hand with the wallet → the same hand setting a marker on the tray | Yes |
| 2019 → the hearing → the tour | 10:57.51 / 11:00.01 | Yes: the money arrives; he won't run the agency | The glowing line, the gavel, the stamps on the beat | The check under the door → the senator's blank pad → the gavel → the passport stamp | Yes |
| The tour → the statement | 11:16.97 | Yes: the same week | The stamps slow into pens | His pen on a guest book → his pen on the one sentence | Yes |
| The statement → the chips | 11:33–11:54 | Yes: the same day | The register's wheels, the KA-CHING | The signers' pens → purchase orders; `INVIDIA $1T` | Yes |
| The president's deepfake | 13:15–13:26 | Yes: the copy finishes his sentence | The copy's line, then "When the hell did I say that?" | The copy beside the real NEDIB → `DEEPFAKES OF ME: SEEN 1` → `verified: human` over the real one | Yes; reads as a laugh at fakes |
| The post → the war room | 14:57.03 | Yes: the phone won't stop | The pulse J about 0.5 s out of the silence (−39 → −24 dBFS from 14:56.5) | The calls stack on the same phone → the phone on the desk | Yes |
| The war room → the flight | 15:24.06 | Yes: he's chosen | The phone's buzz is masked (−18 dB); the score's held fifth is the "hum" | Notepad (`NEW COMPANY · MACROSOFT · BACK`) → notepad (`TERMS · 1. GERG`) | Yes |
| The flight → home | 15:27.06 | Yes | The dark room's drone leads 0.6 s | The pen writing → the pen carving | Yes |
| The marks → TPOOL → back | 15:32.60 / 15:38.60 | Yes: it has happened before | Tape hiss +11 dB (500–2k) over the dark room; the VHS tracking | Mark 3 → `TO THE BOARD`, twice → he walks out → the marks → the Orb's iris | Yes |
| The board's side: the held face | 16:24.4 → 16:25.6 | Yes | The procedure's pedal | Alyi's tile, full frame, for 1.2 s | Yes |
| Gerg's post → Saturday → Mario | 17:05.70 / 17:14.26 | Yes | The phones; the dial tones | The grid → the night boardroom → the split | Yes |
| The blank page | 18:02.9 | Yes: "why you fired him" | The chord about 1 s early; the paper is masked (optional #5) | The page is lifted and turned over, blank | Mostly |
| Tasya's statement → Neleh's look | 18:24.28 | Yes | A held note enters on the cut, +21 dB after the statement's 0.4 s tail (a designed sting) | Alyi's reflection → Neleh and `4. ____` | Yes |
| Neleh → Alyi alone | 18:27.28 | Yes: the company empties | The bullpen's night air | The blank line → the packed bullpen and the users line on the glass | Yes |
| Alyi alone → 2 AM | 18:32.28 | Yes | The hearts' ticks are masked (optional #3) | The hearts on his phone → the same post on Mas's phone | Yes, by picture |
| The tear macro | 3:28.0 → 3:32.5 | Yes: "Is that a tear?" "it's the bill." | The sizzle is audible (−3.3 dB in 1–8 kHz) and not harsh (−46 dB in 2–6 kHz against the score's −25 low-mid) | Pixel GPU → near-photoreal heatsink with the bead → the pixel tile | Yes |

## 3. Sound audit (on the film's decoded AAC)

### 3.1 Global [M]

| Measure | Result |
|---|---|
| Integrated loudness | −16.08 LUFS |
| True peak | −1.17 dBTP |
| Sample peak | −1.39 dBFS |
| Audio against picture | 7.97 ms longer |
| Decode errors | 0 |
| Holes (under −60 dBFS for 50 ms or more) | Only the film's first 80 ms and last 210 ms |
| Short dips | 37 dips of 0.8 s or less, down to −35…−40 LUFS, all in pauses between lines where the score rests and the room holds. None is a hole. |

### 3.2 Loudness at every cut [M]

263 beat boundaries and chapter joins, measured as the K-weighted level just before and just after each cut:

| Window | Median change | 90th percentile | Over 15 dB |
|---|---|---|---|
| 1.5 s | 3.0 dB | 10.5 dB | 15 |
| 0.4 s | 2.9 dB | 11.6 dB | 12 |
| 0.1 s | 1.6 dB | 7.7 dB | 8 |

The twelve 0.4 s steps over 15 dB:
- **Kept designs:**
  - 0:04.29, a line
  - 0:56.29, the act's head
  - 14:08.33, the act-out
  - 14:43.38, the buzz ending the silence
  - 19:18.58, "alyi voted."
  - 20:03.42, the avalanche
- **New v3.5 designed hits:**
  - 4:35.25, 3 AM's F4
  - 4:40.25, the bloom
  - 9:40.54, the gavel
  - 10:34.83, 2019
  - 18:24.29, Neleh's note
- **7:27.96, the Atem cut:** the cue plus the stray egg tick.

**None is an accident**, apart from the tick.

### 3.3 Clicks, jumps and the one silence [M]

**Clicks at cuts** (second difference within ±3 ms, 15× or more the local median, and at least 0.02): 11 found.
- **Ten are laid attacks:**
  - the first weeks' felt stabs on the cut (3:46.29, 3:51.79, 3:53.79)
  - the THUD (8:19.50)
  - the freeze hit (8:38.62)
  - the shutter (9:21.71)
  - the post click (12:33.71)
  - THE CLOCK (14:05.83)
  - the avalanche (20:03.42, 20:05.71)
- **One is the egg tick** at 7:27.96.

**Clicks across the whole film:** the strongest transients outside the cuts are ElevenLabs consonants inside words.
- Examples: "the board." at 10:49.35 (a second difference of 0.53 in the film, 0.82 in the dry take) and "…cease operating" at 11:08.9.
- They are in the takes, mid-word, not at any edit point. They are not defects by measurement; an ear should confirm those two.

**Level jumps over 15 dB at non-designed points** (adjacent 0.4 s windows anywhere, not on a word onset or a laid SFX): 18 clusters.
- **All 18 have a cause:** the kept marks, the designed hits above, the tag's thud, the outro's fade, and the Remove click into the silence.
- **The only new ones:**
  - 4:40.5, the bloom
  - 7:04.1, the vision post's title note
  - 10:34.75, 2019's hit
  - 18:24.3, Neleh's note

**The one silence:** the Remove click at 14:38.56 to the buzz at 14:43.58.
- It lasts 5.02 s at −49 LUFS (100 ms windows between −50.3 and −48.5): room tone at about −50 dBFS, with the score at digital zero.
- **The edges are clean:**
  - The click's own decay takes it from −14 to −50 in 50 ms.
  - The buzz steps −50 → −22.
  - Neither has a second-difference spike.
- **[J]** It reads as the room holding its breath, not a dropout: the picture holds on the grid and his still face.

### 3.4 The flagged items

**The rope snap (8:05.46).**
- **[M]** The picture's snap is at 8:05.46 (24 fps frames: the rope sags for 4 frames after the 8:05.29 cut, then snaps). The SFX lands on it and is audible in 1–8 kHz. The score's tag attacks at 8:06.20 (−18 dBFS) and peaks at 8:06.55 (−12).
- **[J]** It reads as a reaction sting, not a late one, because the snap itself is heard. Optional #6 tightens it.

**The blank page (18:02.9).**
- **[M]** The chord is a swell (−28 → −22 dBFS from 18:01.0 to 18:02.4), not an attack. The page reads blank from about 18:03.0. `paper_curl` is 22 dB under the mix.
- **[J]** It is music anticipating the reveal, and acceptable. Optional #5.

**MARIO (Kokoro) against the ElevenLabs cast** (sc 11, 13, 17 and S4.08): speech-only K-weighted loudness and the long-term spectrum of each line in the film.

| | MARIO (10 lines) | ElevenLabs lines in the same beats (22) |
|---|---|---|
| Loudness | −13.9 to −15.0 LUFS, mean −14.7 | −12.3 to −14.9, mean −14.1 |
| 1–3 kHz share | −9.5 to −10.5 dB | −6.5 to −18.5 dB, median about −11 |
| 3–6 kHz share | −13.6 to −18.5 dB | −10.7 to −22.4 dB |
| Centroid | 563–913 Hz | 392–1,169 Hz |

- **[M]** MARIO sits 0.6 dB under his neighbours on average. The mixer's `KOKORO_IN_EL_EQ` is visible: his 1–3 kHz share drops 1.3–2.0 dB from take to film, while the EL lines change by 0.5 dB or less.
- **[J]** He sits inside the cast's spread, about 1 dB toward its bright, forward end. The contrast is largest beside Sirrah (8:41–8:50: 1–3 kHz −18.3 against his −9.6) and Adelina (17:29: −15.4 against −10.2), which are darker voices. It is not a level problem, and it's unlikely to read as a different engine. Optional #8.

**The new sounds**, each measured as the SFX or room stem against the whole film in the same window:

| Film time | Sound | Measured [M] | Judged [J] |
|---|---|---|---|
| 3:29 | The sizzle | −3.3 dB in 1–8 kHz; lifts the 6–16 kHz band 17 dB over the shot before | Audible, fine |
| 14:57 | The war room's buzzes | Buzz 1 −9 dB (audible); 2–7 −16 to −32 dB, under the V.O. and pulse | Texture; optional #4 |
| 15:23 | The plane | The low end is not above the suite's room; the phone's buzz is masked | The score carries it; optional #9 |
| 15:32 | TPOOL's tape hiss | +11 dB (500–2k) over the dark room, and well under the score | Fine |
| 10:34 | The 2019 fan | Same as the hearing room in every band | Not distinct; optional #10 |

---

## Method (for a re-run)

- **Frames:**
  - One every 2 s over the whole film (696).
  - 4 fps windows at the 31 new or changed seams.
  - 2 fps inside the tear, CLOD, the deepfake and 49A.
  - 24 fps at the rope.
  - One full-resolution CLOD frame.
  - All through `ops/heavy.sh` with the bundled ffmpeg (`studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`, which has no `select` or `fps` filter, so `-r` was used).
- **Beat clock:** film times come from `show/reel/ep01-v35-el/*.json`. The summed `reelDur` matches the chapter lengths within 20 ms.
- **Audio:** the film's AAC decoded to 24-bit WAV, analysed in `audio/.venv-mix` (numpy, scipy, pyloudnorm):
  - K-weighting uses pyloudnorm's filters.
  - Second differences for clicks.
  - Band energies from Butterworth band-passes and Welch spectra.
- **Stems:** `audio/reel/ep01-v3/v35/el/`, the scores' `render/music-el.wav` and `out/ep01/full-v3/mix-v35-el/` were used only to attribute each measured event to its source.
- **Scratch:** the frames, the decoded WAV and the scripts were in the session scratchpad's `check/` folder and have been deleted.
