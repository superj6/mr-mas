# Ep2 v1: the sound (rooms, SFX, voices, the score in the mix) and its audit

> **Status: the sound pass, 2026-10-10, by the sound designer and mixer.** Every segment of `ep1.1_her.wav` is mixed on the EL lock (the master, LEARNINGS R9), the lock the picture was drawn on (every segment's frame count is the lock's: coldopen 1,320, act1 8,736, act2 6,696, act3 7,680, act4 7,656, tag 888 [M]).
>
> - **Made:** 170 new SFX-board files (145 sounds and 25 loops: every manifest §7 bed and every sound the lock names that the board lacked), the ENGINEER's laugh take, cast.md §4's voice chains, the crosscut call, the chant under the exchange, and the audit tool that measured all of it.
> - **The mix:** every story segment at **−16.0 LUFS** integrated (−16.00 to −16.01), true peak **−1.15 to −1.84 dBTP**, the episode −16.0 LUFS; dialogue −13.7 to −15.0 LUFS in the cold open and the acts (the tag's one V.O. line −12.5); MARIO 0.3 dB under his neighbours; **0 holes** (the mono downmix included only since the fixes pass: see below); every 15 dB jump with a named cause; every lock sound laid at its frame, claimed by the score, or (S5) cut at its scene's end; **0 of 316 laid sounds masked** in their own band (12 marginal, §8.1); **0 lines under the score's +10 dB pocket floor**.
> - **Corrected by the fixes pass (2026-10-10, [fixes-v1.md](fixes-v1.md) Act One rows 3 and 12).** The "0 holes" below had counted the louder channel only: the mono downmix had 10 unmarked holes in XEL's studio (act1, 248.75–296.75 s) and 2 in the empty lot (act4), the two beds' decorrelated stereo cancelling in mono. Both beds are now mostly mono-coherent and laid 2 and 1.5 dB higher, the mix QA counts the mono holes, and every segment has **0 unmarked holes in either measure** [M]. Act One now sits 1 LU over the target (**−15.0 LUFS**) so its lines (−14.0) match the other acts', and the tag's V.O. is 1 dB down on its bus: the dialogue spread is **0.83 LU** (was 2.49), the episode −15.74 LUFS. §7 and §8.4 carry the new numbers.
> - **Nobody has listened (R8).** Every number here is measured [M] unless it says judged [J]. "Audible" below means measured over the rest of the mix in the sound's own band, not heard. §9 is the list for an ear.

**Contents:** [1. What the pass made](#1-what-the-pass-made) · [2. Rooms](#2-rooms) · [3. SFX](#3-sfx) · [4. Levels: the audit's rides](#4-levels-the-audits-rides) · [5. Voices](#5-voices) · [6. The score in the mix](#6-the-score-in-the-mix) · [7. Loudness and seams](#7-loudness-and-seams) · [8. The audit](#8-the-audit) · [9. For an ear](#9-for-an-ear) · [10. How to rebuild](#10-how-to-rebuild) · [11. Files](#11-files) · [12. LEARNINGS rules checked](#12-learnings-rules-checked) · [13. Open issues and asks](#13-open-issues-and-asks)

---

## 1. What the pass made

| What | Where | Notes |
|---|---|---|
| The new board sounds and beds | `audio/sfx/scripts/sounds_ep2.py`, built by `build_ep2.py` into `audio/sfx/wav/` (git-ignored, like the board's masters), rows in `audio/sfx/manifest-ep2.json` | 170 entries: 145 sounds (the lock's 130 missing names, the per-occurrence variants the picture needs, the phone taps) and 25 loops (22 room beds, the beacon's motor, the umbrella's rain, the lab's room tone). The board's own house rules: F minor, **no A anywhere** (the horns are open fifths and fourths; the falls step through F minor instead of sliding through A), generic UI, no voices: every crowd is synthesized (glottal pulses through vowel formants, shaped noise). Ep1's `manifest.json`, `board.json` and every Ep1 file are untouched (md5 before and after) [M]. Spectrogram sheets `audio/sfx/qa/spectro_ep2_01-08.png`; every sound back to back for an ear: `audio/sfx/reel/reel_ep2.mp3` (+ `reel_ep2_index.json`) |
| The ENGINEER's laugh (9.03) | `audio/ep02/v1-el/sound/` | lock-v1.md §6's timed request: his own library voice (Ryan - Articulate, cand A) through `el_render.py`, 31 characters. ASR hears "Ha, ha, ha, ha, ha, ha, ha", 140 Hz (his lane 125–160), 3.67 s [M]. No laugh mimicry (S6): it is his voice laughing, written as "Heh. Ha, ha-ha... heh. Heh-heh." |
| The stems | `audio/reel/ep02-v1/stems.py`, `rooms.py`, `crosscut.py` (new) | the rooms on §7's beds; the swaps; the take laid as a sound and its duck; the room overrides; the crosscut's rooms; the sounds the pass adds; the audit's rides; **S5: every sound cut at its scene's end** |
| The mix | `audio/reel/ep02-v1/mix_episode.py` | cast.md §4's chains (ghost, far, os, offmic, chant, the podcast TV, the frame-aware call, the demo house's PA, the VOICE previews' monitor); the previous act's ring-out kept apart from this act's head fade and rides; Act Two's act-in softened (S9); three score dips under featured phone sounds (S11) |
| The audit | `audio/reel/ep02-v1/sound_audit.py` (new) → `mix-qa/el/sound-audit.json`; `sfx-rides.json` | every SFX against the rest of the mix in its own band, every line's 1–4 kHz onset against everything, every voice's level, every unplaced jump by cause, loud moments, the seams around the intro and the outro |

---

## 2. Rooms

One bed per run of beats with one room, always on (S3): a new room leads its cut by 0.6 s (or the plan's J), the old one trails 0.4 s, a black gets a faint room tone at −54 LUFS, and a quiet bed is lifted (up to 6 dB) until its 50 ms windows clear −40 dBFS. **Every room plays its first-choice recipe; no stand-in is left** [M, the stems' QA].

| Room (scenes) | Bed(s), LUFS on the stem | New |
|---|---|---|
| lobby_day (1, 13) | `bed_lobby_day` −37: the racks' hum on F, big-lobby air, a low murmur and a laptop or two, the LED votives ticking on eighths | ✓ |
| seance (4) | `bed_boardroom_night` −40 + `bed_seance_candles` −42: flames fluttering and ticking over the night boardroom | ✓ |
| allhands (F2.3), boardroom_day (4A, 4B, 18) | Ep1's `bed_allhands` −36, `bed_boardroom_day` −39 | |
| podcast_studio (6) | `bed_podcast_studio` −42: padded, a low HVAC, the gear's hum on F, a chair now and then; never true silence (no score here: the room is the joke) | ✓ |
| cathedral (7), basement (7) | `server_hum` −37 + `room_tone` −44; `bed_basement` −38 (a boiler, pipes ticking, the racks through the slab) | ✓ |
| darkroom (8, 12, 20, 23) | Ep1's dark room: `server_hum` −42 + `room_tone` −46 + `room_drone` −50 | |
| wings (9, 11.03, 11.11–12) | `bed_wings` −40: work lights on F, cable hum, road cases, the house through the masking | ✓ |
| demo_house (11); demo_house_empty (12.01–12.03, a stems override) | `bed_demo_house` −36 (an attentive house, seats, a cough); `bed_demo_house_empty` −38 (the house lights' hum on F, seats tipping up) | ✓ |
| open_floor (14), office_evening (15), office_2023 (15.14) | `bed_office_day` −38 + `server_hum` −50 (manifest §7's `drip_clack` is a 0.6 s one-shot, not a loop: the chillers are the racks' hum); `bed_office_evening` −40/−41 | |
| party (15, F2.2), fire_night (15, F2.2b), stairwell (15.19) | `bed_party_crowd` −34 (a bright murmur, glasses, laughs), `bed_fire_night` −36 (a bonfire, wind in trees), `bed_stairwell` −42 (concrete, a far door, a hard echo) | ✓ |
| bridge (17.01–02); bridge_stalled (17.03–17.16, a stems override); bridge_night (17.14); bridge_rain (17.17–21) | `bed_bridge_traffic` −35 (right to left, tyres, joints, wind off the water); `bed_bridge_stalled` −37 (a line of idling engines); `bed_bridge_night` −40 (sparse traffic, a foghorn on F + C, far); `bed_bridge_traffic` −41 + `bed_rain` −36 (moving again, rain on his umbrella) | ✓ |
| lighthouse, split_lighthouse (18) | `bed_lighthouse` −39 + `beacon_motor` −49; the split: the boardroom left, the lighthouse right | motor ✓ |
| lobby_watchparty (19.01–06), lobby_cheering (Gerg's shots of 19.09–10), campus (19.07–10, 19.15) | `bed_lobby_watchparty` −36; `bed_lobby_cheer` −34 (the room on its feet: cheers in waves, clapping); `bed_campus_outdoor` −36 (an outdoor crowd, a big PA far off, no words) | ✓ |
| era_2008 (F2.1), garden (19.16–20), split_zai (20.01–04) | `bed_camcorder_2008` −38 (a hall through a camcorder's mic: auto-gain, hiss, a motor whine on F); `bed_garden` −40 (small birds, a far fountain); `bed_campus_outdoor` −40 left + `bed_zai_warehouse` −41 right | ✓ |
| lobby_morning (20.05–09), empty_lot (22) | `bed_lobby_morning` −38 (a broom, a far coffee machine, tape peeling); `bed_empty_lot_wind` −42 (a faint high wind, nothing else: the designed stop plays in it) | ✓ |
| card | `room_tone` −38 (Ep1's card level) | |

**The crosscut call (19.09–19.10).** The picture cuts on the speakers (`sc-19.ts`: Gerg 3–4 frames before his lines, Mas 6 before his). `crosscut.py` turns that rule into time spans from the lock's lines, so it re-anchors on any re-lock; under Gerg's shots his own room, the cheering lobby, crossfades in (40 ms, equal power) over the campus, and out again on the cut back to Mas [M: 9 spans].

---

## 3. SFX

| Segment | Sounds in the lock | Laid | of which swapped | Claimed by the score | Added | Missing | Cut at its scene's end |
|---|---|---|---|---|---|---|---|
| coldopen | 20 | 20 | 3 | 0 | 0 | 0 | 0 |
| act1 | 70 | 69 | 1 | 1 | 0 | 0 | 0 |
| act2 | 63 | 59 | 6 | 4 | 0 | 0 | 1 |
| act3 | 78 | 76 | 4 | 2 | 1 | 0 | 0 |
| act4 | 78 | 77 | 12 | 1 | 0 | 0 | 1 |
| tag | 15 | 15 | 0 | 0 | 0 | 0 | 0 |
| **episode** | **324** | **316** | **26** | **8** | **1** | **0** | **2** |

- **Every lock sound at its frame.** The stems lay each sound at its beat's start plus its `at` on the EL lock, the lock the picture was drawn on; the picture anchors its events to the same sounds (`['snd', name, n]` marks in the scene modules), so a sound and its picture move together [M: the lock, pixel lock and picture frame counts agree]. The lock has not changed since the score was laid (each cue sheet's `lock_sha1` matches; `stems.score_files` refuses a stale one) [M].
- **Claimed by the score (8, left out):** 4.22 `knob_tick_grain` (its pizzicato grains), 8.02 `news_desk_sting`, 8.06 `ui_confirm_chip`, 12.03 `door_motif_note`, 12.05 `news_bed_tiny`, 14.07 `chair_hum_choir`, 17.21 `dread_sting`, 20.02 `nole_fanfare_short` (the cue sheets' `claims_sfx`).
- **Swapped (26 laid instances), where the picture needs a different sound than the lock's name** (`stems.SOUND_SWAP`, each with its reason): every typing beat is on a phone (`sc-12.ts`, `sc-11.ts`, `sc-15.ts`, `sc-17.ts`, `sc-19.ts`: "his thumb types", "the phone held from below"), so the lock's keyboard `key_tap_soft_*` and `typing_soft` become thumb taps on glass (`phone_key_tap_1–6`, `phone_type_burst`, `phone_type_furious` for Nole's "types furiously"); the mammoth's first step breaks the bezel; the second and third THUDs come closer (`hand_truck_step_mid`, `_near`); the four greying pins step down G5 F5 E♭5 D♭5 (the score puts its own chip note a step above each); the gate's second swing shuts; the footsteps on the lighthouse's bound drafts crunch paper; the gravel steps cycle three variants.
- **Added (1):** 15.07, the party still chanting under the exchange ("the only one not chanting"): the chant's own composite again, low-passed at 1.8 kHz, from 15.07's first frame (`stems.ADD`). The three lines over it keep onset margins of +12.6 to +15.8 dB against everything [M, §8.2].
- **Cut at its scene's end (S5, 60 ms fade): 2.** 9.06's `drafting_ink_stroke` would have run 0.84 s into the blueprint; 20.13's `pin_fall` 1.55 s into the white (the hard cut to white takes the sound with it). Nothing else runs past its scene [M]. A sound may still lead its scene (a J): the beacon's motor leads Act Four by 1.2 s under Act Three's black, as 17.21's plan J asks (`cuts_from_plans` now reads a J on a chapter's last beat that names the next chapter's first sound), rising over 0.25 s.
- **The ENGINEER's laugh** (9.03) is laid from 0.242 s for 3.74 s (it stops before Gerg's "laugh."), 9 dB down under Gerg's line with 80 ms ramps (`SOUND_DUCK`), as the lock's note asks.
- **No step at a sound's start:** a board loop laid as a sound (it starts mid-waveform) fades in over 20 ms (`HEAD_FADE_S`); a one-shot keeps its attack. (A first version faded any sound whose first 2 ms sounded, which softened every click's attack; the audit's direct check on the final mix found it, and the rides were re-derived after the fix.) The first mix had a 0.157 sample jump at the Act Three → Act Four seam (the beacon's motor starting at full level on Act Four's first sample, made loud by a ride); with the J and the fade the seam's jump is 0.01 [M].
- **Clicks at cuts** (the stems' second-difference scan): act1 room at 86.736 s (10.0x, -35.8 → -37.8 dBFS); act4 sfx at 295.009 s (76.1x, -33.0 → -31.7 dBFS); act4 sfx at 299.019 s (643.7x, -33.5 → -32.6 dBFS). Each is the onset of a chip sound sitting on a beat boundary (22.03's band arpeggio, a pulse wave's edge by design) or a 2 dB room crossfade at the edge of the scan's ratio, not a cut-off [M].

---

## 4. Levels: the audit's rides

**The finding.** The lock writes each sound's level as a peak (`gain`, −16 to −34 dBFS), set for the stick reel's temp bed. Against the delivered score and the new beds, the first mix at the lock's gains measured **102 of the 316 laid sounds under rooms and score in their own band where they sound, and 36 more within 3 dB** (the body measure below, before any ride: the phone taps, the buzzes, the UI pops, the stamps, the knocks, the lamps). A level is a mixing decision, so the pass rides each sound up rather than editing the lock.

**The measure** (`sound_audit.py`, the mix's own buses). A sound is heard if **its attack pops** (its loudest 2 ms in one of its own octave-wide bands at least +6 dB over the local mix's mean power around it) **or its body sits over the bed** (in 10 ms frames where it sounds, at least +6 dB over rooms and score in its best own band; +2 dB for a texture: the candles, the motor, the rain, the printer, the crowds). Its "own" bands are those within 10 dB of its loudest. The dialogue is left out of the masker on purpose: a sound under a line is meant to sit under it, and the pocket check (§8.2) guards the line.

**The rides** (`sfx-rides.json`, read by `stems.py`): for each (segment, beat, lock name), the smaller lift that meets either test, applied as one offset to every occurrence in the beat, so a beat's own steps keep their order (three knocks, each louder; the walk-away's three fading steps). Capped at +18 dB (+14 for a texture) and a laid peak of −12 dBFS; never under the lock's own gain; a change under 1 dB is ignored, so the loop settles. Re-derived over five audit passes, the last two after the head-fade fix (§3), which brought 37 rides down and 20 of them to nothing: a click with its attack back needs no lift.

85 rides over the episode's 316 laid sounds (one ride covers every occurrence of its name in its beat); median +5.2 dB. By size: 0–3 dB: 29, 3–6 dB: 23, 6–9 dB: 14, 9–12 dB: 9, 12–15 dB: 10, 15–19 dB: 0. **The fixes pass (2026-10-10)** raised two rides by 1.5 dB, Act Four's gravel steps in the empty lot (22.02: +4.0 → +5.5; 22.09: +12.1 → +13.6): the lot's wind, made mostly mono-coherent and laid 1.5 dB higher against its mono holes (§8.4), had left the 2nd and 3rd steps 0.1–0.3 dB under the +6 dB attack; the counts and the median are unchanged [M].

The largest (all in `sfx-rides.json` with their readings):

| Segment | Beat | Sound (laid as) | Ride | First reading at the lock's gain |
|---|---|---|---|---|
| act4 | 22.05 | `lab_room_tone` | +14.0 dB | -17.6 dB in 60-250 Hz |
| act4 | 19.14 | `pin_grey_tick` | +13.6 dB | -13.4 dB in 250-1000 Hz |
| act2 | 8.01 | `ui_toast_pop` | +13.4 dB | -7.4 dB in 1000-2000 Hz |
| act4 | 22.05 | `paper_drop_floor` | +13.4 dB | -14.7 dB in 1000-2000 Hz |
| act4 | 22.09 | `footstep_gravel` (`footstep_gravel_2`) | +13.6 dB (was +12.1: the fixes pass) | +0.6 dB in 60-250 Hz |
| act1 | 7.02 | `box_set` | +12.0 dB | -10.9 dB in 60-250 Hz |
| act2 | 11.01 | `spotlight_swing` | +12.0 dB | -6.2 dB in 60-250 Hz |
| act2 | 11.07 | `spotlight_swing` | +12.0 dB | -8.9 dB in 60-250 Hz |
| act3 | 15.18 | `door_close_soft` | +12.0 dB | -11.3 dB in 60-250 Hz |
| act3 | 17.07 | `phone_buzz_step_1` | +12.0 dB | -14.9 dB in 250-1000 Hz |
| act3 | 15.04 | `ui_toast_pop` | +10.0 dB | -6.1 dB in 250-1000 Hz |
| act3 | 17.08 | `phone_buzz_step_2` | +10.0 dB | -10.5 dB in 250-1000 Hz |
| act3 | 17.08 | `phone_buzz_step_3` | +10.0 dB | -13.4 dB in 250-1000 Hz |
| act3 | 17.08 | `phone_buzz_step_4` | +10.0 dB | -9.1 dB in 250-1000 Hz |
| act4 | 20.04 | `phone_buzz_muffled` | +9.7 dB | -10.4 dB in 60-250 Hz |
| act3 | 14.02 | `ui_verb_select` | +9.6 dB | -5.0 dB in 1000-2000 Hz |

**Hand rulings** (`stems.SOUND_GAIN`, no ride on top): the beacon's motor at −21 dBFS peak: it leads Act Four under a black, where a texture should be heard soft; the audit's ride toward +2 dB over the quartet had reached +14 dB and stepped at the seam.

**The score makes room** (`mix_episode.SCORE_RIDE`, S11, each a dip with 0.6 s ramps): 11.11 −4 dB under h · e · r (the ECU on his thumb); 12.07 −3 dB under his post typed and posted; 17.07–17.08 −3 dB under "His phone won't stop". The dialogue is untouched.

---

## 5. Voices

Every take at its line's time, dual mono at −3 dB; the V.O. +2.0 dB (`VO_GAIN_DB`: the V.O. takes are −18 LUFS, the spoken −16); MARIO's Kokoro takes through voices-el §AB3's EQ (+1.5 dB at 350 Hz, −1.5 dB at 2.2 kHz, −0.5 dB). Each treated line is loudness-matched to its dry take, then trimmed by its chain's offset.

| Tag (cast.md §4) | Lines | The chain [M settings; J intent] |
|---|---|---|
| `ghost` | 4 (GHOST-NOLE, sc 4) | the take a little darker (6.5 kHz), a short dark reverb (RT 0.75 s, low-passed 2.6 kHz, −7 dB) and a chip doubler 25 ms late (8 kHz sample-and-hold, 5 bits, 400–3,500 Hz, −15 dB); −1 dB |
| `far` | 1 (ALYI, 15.03, Ep1's own take) | down a corridor: 280 Hz–3 kHz, reflections at 19/37/61 ms, a 1.3 s tail at −3 dB over a dry at −4; −6 dB |
| `os` | 13 | off screen in the same room: 6.5 kHz off-axis and the room's first reflections (11–53 ms); −2 dB. Over a black or the blueprint (Rima's six lines in sc 10, "as if running her keynote in her head") the line stays dry and level |
| `offmic` | 2 (the ENGINEER, 11.15) | close and dry after the headset comes off: 8.5 kHz, −2 dB, **never the PA** |
| `chant` | 1 (the CROWD, 15.06) | el_crowd.py's composite (−19 LUFS) in the party room: reflections and a short tail at −11 dB |
| `podcast` | 2 (NELEH, 18.03–04) | the boardroom TV's podcast player: 150 Hz–7.5 kHz, +2 dB at 2.8 kHz, then the boardroom's reflections (9–43 ms) |
| `tv` | 1 (the REPORTER, 13.05) | the lobby TV: 200 Hz–6 kHz, then the lobby's reflections |
| `phone` | 1 (Mas's recorded voice on Tasya's phone, 7.01) | 500 Hz–3.4 kHz, the basement's close reflections |
| `call` | 7 | dry while the speaker is in frame, the phone's band (300 Hz–3.4 kHz) only where he isn't (cast.md §4), crossfaded over 30 ms at the picture's cuts. Sc 19's crosscut cuts on the speakers, so Gerg's lines play dry over his own cheering lobby, and three of them (e2-a4-0024, -0026, -0033) go into the phone for their last 0.1 s, where the picture has already cut to Mas [M: `crosscut.py`'s spans]. 8.06 and 17.09 hold on Mas, the far end never heard: dry |
| the PA (`ROOM_DEVICE`) | 14 (every line in the demo house: RIMA, the ENGINEER, CHATGTP, the sung line) | the house PA in a hall (110 Hz–9 kHz, +2.5 dB at 2.8 kHz, the hall's reflections at 37–230 ms) |
| the monitor (`LINE_DEVICE`) | 5 (9.06: VOICE 1–4 and CHATGTP's "Hey.") | the wings' monitor speaker (180 Hz–6.5 kHz) and its desk's reflections |
| `V.O.` | 14 | dry and close, +2 dB |

Each line's loudness as laid, after its chain and the segment's master gain [M]:

| Tag | Lines | Median LUFS | Range |
|---|---|---|---|
| (dry) | 126 | -14.9 | -15.2 to -13.5 |
| V.O. | 14 | -13.8 | -14.9 to -12.3 |
| os | 13 | -15.8 | -16.9 to -13.9 |
| call | 7 | -13.8 | -14.1 to -13.5 |
| ghost | 4 | -15.9 | -15.9 to -15.9 |
| offmic | 2 | -15.9 | -15.9 to -15.9 |
| podcast | 2 | -14.8 | -14.8 to -14.8 |
| phone | 1 | -15.9 | -15.9 to -15.9 |
| sung | 1 | -14.9 | -14.9 to -14.9 |
| tv | 1 | -14.5 | -14.5 to -14.5 |
| far | 1 | -19.5 | -19.5 to -19.5 |
| chant | 1 | -16.5 | -16.5 to -16.5 |

---

## 6. The score in the mix

- **Every segment's score is used, on its own lock** (each cue sheet's timeline and `lock_sha1` match the EL lock) [M].
- **The pre-laps are read** (the score review's finding, fixed in `score_bus()` and measured here): Act One's 1.0 s under the card's tail; Act Three's 0.792 s (THE CLOCK's first tick 0.625 s before the act) under Act Two's black; Act Four's 1.2 s (the quartet's first pizzicato) under Act Three's black. Each is laid at its score's head gain, ending on the chapter's last sample, and that act's head fade is off [M: each segment's mix QA `score.next_prelap` and `head_fade_why`]. **The ring-outs** (Act One's into Act Two's head, Act Four's into the tag's) are laid full and crossfaded out over 2.5 s from the next score's entry; since this pass they are kept apart from the next act's head fade and rides, so a continuous layer never steps at the seam.
- **Ducking:** the score under every line by its cue's depth (7–9 dB, `DUCK_BY_MOOD`), 0.25 s ahead, joined across gaps under 2.5 s, 0.2 s in, 0.6 s out; −3 dB under a silent post. The rooms dip 2 dB under speech. The SFX are not ducked.
- **Designed silences** are the cue sheets' (4B's read, XEL's studio, THE PLAN's tear, the midpoint act-out, the Jun 19 post and the white, the flap's stop): the room tone runs under each, so **0 holes** (§8.4).
- **Act Two's head (S9).** The Water Line's first F is a designed hit on the act's first frame (its attack kept: no fade), but it came out of Act One's black at −12 dBFS (100 ms RMS) from −32: the jump LEARNINGS S9 names (Ep1's 3 AM bloom). `SCORE_RIDE` takes its first second down 7 dB, back by 1.6 s [J]: still a hit, 12.5 dB over the black instead of 19.

---

## 7. Loudness and seams

After the fixes pass (2026-10-10; `mix_episode.py --all`, `loudness-report.json`) [M]. **Holes** are now counted on both the louder channel and the mono downmix; the sound pass's table had reported the louder channel only (act1's mono downmix then had 10 unmarked holes in XEL's studio, act4's 2 in the empty lot: the beds' decorrelated stereo cancelling in mono). Act One's integrated loudness is 1 LU over the target (`SEG_TRIM_LU`), the tag's dialogue bus −1 dB (`DLG_SEG_DB`): fixes-v1.md, Act One row 12.

| Segment | LUFS-I | True peak | LRA | Dialogue LUFS | Master gain | Holes, louder channel (unmarked) | Holes, mono downmix (unmarked) |
|---|---|---|---|---|---|---|---|
| coldopen | -16.0 | -1.84 dBTP | 5.5 | -14.18 | +2.23 dB | 0 (0) | 0 (0) |
| card | -21.17 | -8.23 dBTP | None | None | +2.12 dB | 0 (0) | 0 (0) |
| act1 | **-15.0** (+1 LU, `SEG_TRIM_LU`) | -1.37 dBTP | 6.2 | **-14.01** (was -15.01) | +2.12 dB | 0 (0) | 0 (0) (was 10 (10)) |
| act2 | -16.01 | -1.37 dBTP | 7.0 | -14.29 | +2.11 dB | 0 (0) | 0 (0) |
| act3 | -16.01 | -1.2 dBTP | 6.9 | -13.65 | +2.53 dB | 0 (0) | 0 (0) |
| act4 | -16.0 | -1.48 dBTP | 8.5 | -13.94 | +2.21 dB | 0 (0) | 0 (0) (was 2 (2)) |
| tag | -16.0 | -1.42 dBTP | 7.9 | **-13.46** (was -12.52; bus -1 dB) | +3.74 dB | 0 (0) | 0 (0) |
| **the episode** (story chapters and the card back to back) | **-15.74** | | 7.0 | spread **0.83 LU** (was 2.49) | | | |

| Seam | Last 200 ms | First 200 ms | Step | Sample jump |
|---|---|---|---|---|
| card -> act1 | -18.1 dBFS | -17.3 dBFS | +0.8 dB | 0.0056 |
| act1 -> act2 | -31.1 dBFS | -18.7 dBFS | +12.4 dB | 0.0018 |
| act2 -> act3 | -29.1 dBFS | -21.7 dBFS | +7.3 dB | 0.0009 |
| act3 -> act4 | -22.5 dBFS | -25.0 dBFS | -2.5 dB | 0.01 |
| act4 -> tag | -19.8 dBFS | -19.7 dBFS | +0.2 dB | 0.0039 |
| coldopen -> intro-ep2-mix-V1-chipchamber (as the assembly plays it) | -16.0 dBFS | -30.8 dBFS | -14.8 dB | |
| intro-ep2-mix-V1-chipchamber -> card (as the assembly plays it) | -44.6 dBFS | -37.0 dBFS | +7.6 dB (was +6.6: the card plays at Act One's gain, 1 dB up since the fixes pass) | |
| tag -> outro (as the assembly plays it) | -22.4 dBFS | -21.3 dBFS | +1.1 dB | |

**Reading the seams.** The mixer's own seam is clean by construction: each chapter's first 2 s ramp from the previous chapter's master gain, so the gain at the joint never steps (every `seam_head` in the mix QA starts at the previous segment's gain) and the sample jumps are tiny (the table's last column, all ≤ 0.01). The 200 ms level steps above are the **material** on each side of an act break: card → Act One +0.8 dB and Act Four → tag +0.2 dB are continuous; **Act One → Act Two (+12.5 dB)** is the act-out black against the Water Line's act-in hit (§6, softened by 7 dB); **Act Two → Act Three (+7.3)** is the midpoint's designed stop against THE CLOCK running; **Act Three → Act Four (−2.5)** is the DREAD ringing into the black against the quartet's pre-lap and the beacon rising under it. Around the intro, which plays its own master: cold open → intro −14.8 dB (the knee's fourth note on the smash, into the intro's quiet open; Ep1 aired −11.3 at the same seam), intro → card +6.6 dB (Ep1 +6.9), tag → outro +1.2 dB (the tag's hum held 2 s under the outro's head, its first hit −6 dB) [M]. The task's "within 1 dB" holds for the mixer's seams (the gain, the sample jumps, every continuous layer) and for two of the five story seams' material; the other three are act-ins after a black, each designed by the score and listed for an ear (§9).

---

## 8. The audit

`sound_audit.py`, on the final mix. The JSON is `audio/reel/ep02-v1/mix-qa/el/sound-audit.json`; each segment's mix QA is beside it. **Re-run after the fixes pass (2026-10-10, [fixes-v1.md](fixes-v1.md)) [M]:** the same counts in every table below (317 laid, 0 masked, the same 12 marginal; Act Four's two gravel steps that the lot's louder wind had pushed to marginal are back over the line after their +1.5 dB rides, §4); every line's onset margin against everything unchanged (Act One's lift is on its master, so voice and bed rose together) except the tag's V.O., 1 dB lower with its bus; the lock balanced in every segment; 0 unplaced jumps; MARIO −0.32 dB.

### 8.1 Every SFX where the picture needs it

| Segment | Laid | Heard (attack or body) | Marginal | Masked |
|---|---|---|---|---|
| coldopen | 20 | 20 | 0 | 0 |
| act1 | 69 | 66 | 3 | 0 |
| act2 | 59 | 56 | 3 | 0 |
| act3 | 77 | 73 | 4 | 0 |
| act4 | 77 | 75 | 2 | 0 |
| tag | 15 | 15 | 0 | 0 |

Not yet over the line (each a judgement for an ear, §9; the reason is the measured cause):

| Segment | Beat | Sound | At (s) | Attack over the local mix | Body over the bed | Ride | Verdict |
|---|---|---|---|---|---|---|---|
| act1 | 7.01 | `dollhouse_slide` | 316.00 | +4.3 dB | -5.0 dB (250-1000 Hz) | +4.3 | marginal |
| act1 | 7.01 | `light_bank_click` | 316.80 | +2.8 dB | -0.5 dB (250-1000 Hz) | +7.0 | marginal (under a line) |
| act1 | 7.05 | `alert_bonk` | 349.60 | +5.9 dB | +3.0 dB (60-250 Hz) | +1.5 | marginal |
| act2 | 11.01 | `spotlight_swing` | 141.60 | -2.8 dB | +5.8 dB (60-250 Hz) | +12.0 | marginal |
| act2 | 11.07 | `spotlight_swing` | 196.72 | +1.3 dB | +3.1 dB (60-250 Hz) | +12.0 | marginal |
| act2 | 11.16 | `crowd_hush` | 236.40 | +5.2 dB | -0.8 dB (1000-2000 Hz) | +6.1 | marginal |
| act3 | 15.18 | `door_close_soft` | 183.41 | +1.5 dB | +0.7 dB (60-250 Hz) | +12.0 | marginal |
| act3 | 17.07 | `phone_buzz_step_1` | 230.48 | +3.4 dB | +0.1 dB (250-1000 Hz) | +12.0 | marginal |
| act3 | 17.08 | `phone_buzz_step_3` | 234.81 | +2.2 dB | -0.4 dB (250-1000 Hz) | +10.0 | marginal |
| act3 | 17.08 | `phone_buzz_step_4` | 236.51 | +5.7 dB | +3.8 dB (250-1000 Hz) | +10.0 | marginal |
| act4 | 18.01 | `footstep_drafts_2` | 3.17 | +1.5 dB | -3.9 dB (60-250 Hz) | +9.0 | marginal |
| act4 | 22.05 | `lab_room_tone` | 303.58 | +2.7 dB | -3.6 dB (60-250 Hz) | +14.0 | marginal |

### 8.2 Every line's pocket

**The score's pocket** (`audio/ost/tracks/e02-v1-common/pocket.py`, the score review's check, each take against the score exactly as the mix ducks it, 1–4 kHz, the first 0.6 s from the first word; floor +10 dB):

| Segment | Lines | With score under them | Onset p10 | Onset min | Before the duck, p10 | Flagged (< +10 dB) |
|---|---|---|---|---|---|---|
| coldopen | 6 | 6 | 15.8 | 15.3 | 8.2 | 0 |
| act1 | 59 | 46 | 13.4 | 10.9 | 5.3 | 0 |
| act2 | 41 | 41 | 14.0 | 11.4 | 6.1 | 0 |
| act3 | 28 | 28 | 12.0 | 11.2 | 4.6 | 0 |
| act4 | 38 | 38 | 15.1 | 12.4 | 6.1 | 0 |
| tag | 1 | 1 | 10.9 (was 11.9: the fixes pass's −1 dB on its bus) | 10.9 | 2.9 | 0 |

**Against everything** (`sound_audit.py`: the same onset against rooms + SFX + score as laid, after the rides):

| Segment | Lines | Lowest onset margin | Median | The three lowest |
|---|---|---|---|---|
| coldopen | 6 | +14.6 dB | +21.2 dB | e2-co-0006 (gerg, 1.08: +14.6); e2-co-0001 (selbeep, 1.02: +16.9); e2-co-0002 (gerg, 1.03: +17.1) |
| act1 | 59 | +13.0 dB | +24.9 dB | e2-a1-0026 (ghost-nole, 4.25: +13.0); e2-a1-0053 (humanist, 7.06: +13.0); e2-a1-0031 (terb, 4A.01: +13.5) |
| act2 | 41 | +12.3 dB | +20.4 dB | e2-a2-0020 (rima, 10.04: +12.3); e2-a2-0009 (rima, 9.04: +12.4); e2-a2-0018 (rima, 10.02: +12.5) |
| act3 | 28 | +8.7 dB | +17.7 dB | e2-a3-0009 (alyi, 15.06: +8.7); e2-a3-0010 (crowd, 15.06: +10.5); e2-a3-0008 (alyi, 15.03: +12.3) |
| act4 | 38 | +8.6 dB | +18.9 dB | e2-a4-0028 (gerg, 19.10: +8.6); e2-a4-0025 (mas, 19.09: +10.5); e2-a4-0024 (gerg, 19.09: +12.8) |
| tag | 1 | +11.9 dB | +11.9 dB | e2-vo-14 (mas, 23.05: +11.9; +12.9 before the fixes pass's −1 dB on its bus) |

### 8.3 Voices' levels

Per speaker, lines in the room (dry, O.S., call, off mic), LUFS as laid [M]:

| Speaker | Lines | Median | Range |
|---|---|---|---|
| mas | 28 | -14.16 | -16.88 to -13.47 |
| gerg | 15 | -13.78 | -16.88 to -13.77 |
| nole | 15 | -14.88 | -14.88 to -13.78 |
| rima | 13 | -13.89 | -14.89 to -13.89 |
| engineer | 9 | -14.89 | -15.89 to -13.89 |
| chatgtp | 7 | -14.89 | -14.89 to -14.89 |
| terb | 7 | -13.78 | -14.88 to -13.78 |
| xel | 7 | -14.88 | -14.88 to -14.88 |
| mario | 6 | -14.09 | -14.18 to -14.04 |
| staffer | 5 | -13.78 | -16.88 to -13.47 |
| alyi | 4 | -13.47 | -13.8 to -13.47 |
| forecaster | 4 | -13.47 | -13.47 to -13.47 |
| haras | 4 | -13.78 | -13.78 to -13.78 |
| selbeep | 4 | -13.77 | -15.77 to -13.77 |
| tasya | 4 | -14.88 | -16.88 to -14.88 |
| ekiel | 3 | -13.78 | -13.78 to -13.47 |
| humanist | 3 | -14.88 | -14.88 to -14.88 |
| bukaj | 2 | -13.47 | -13.47 to -13.47 |
| driver | 2 | -13.47 | -13.47 to -13.47 |
| radnus | 1 | -13.78 | -13.78 to -13.78 |
| staffer2 | 1 | -13.47 | -13.47 to -13.47 |
| voice1 | 1 | -14.89 | -14.89 to -14.89 |
| voice2 | 1 | -14.89 | -14.89 to -14.89 |
| voice3 | 1 | -14.89 | -14.89 to -14.89 |
| voice4 | 1 | -14.89 | -14.89 to -14.89 |

**MARIO** (S7): median -14.09 LUFS against -13.78 for Ekiel, Terb and Mas in sc 18: **-0.31 dB** (the rule: within about 1 dB). The spread between speakers comes from the segments' master gains, not from the takes, which are all −16 LUFS. (This table is the sound pass's: Act One's lines then sat about 1.1 dB under the others, because its wall-to-wall talk took the −16 LUFS; since the fixes pass Act One sits at −15.0 LUFS and its dialogue at −14.0, so its speakers' medians are about 1 dB higher than listed here.)

### 8.4 Holes, jumps, loud moments

- **Holes** (under −42 dBFS for 0.3 s or more, with and without the score): **corrected by the fixes pass (2026-10-10).** The sound pass reported 0 for "the louder channel and the mono downmix", but its count (`unmarked_holes`) was the louder channel's only: the mix QA's own `holes_mono_downmix` listed **10 unmarked** in XEL's studio (act1 248.75–296.75 s, beats 6.03–6.07, between the lines; film 05:35–06:24) and **2** in the empty lot (act4 282.5 and 312.35 s, 22.01 and 22.08), measured on the decoded film down to −45.6 dBFS (50 ms, mono). The cause: `bed_podcast_studio` and `bed_empty_lot_wind` were decorrelated stereo at −42, which cancels about 3 dB in mono and dips further in 50 ms windows. The fix: both beds mostly mono-coherent at the same channel power (`sounds_ep2.py _narrow`: correlation 0.85; the wind 0.75 high, 0.9 low; the studio's hum 0.008 → 0.012; the wind's gust floor 0.3 → 0.4), laid at −40 and −40.5 (`rooms.py`). Now **0 unmarked holes in every segment, on the louder channel and in the mono downmix** (`unmarked_holes_mono`, a new count in each mix QA and the loudness report) [M]; XEL's studio's quietest 50 ms in mono is −42.6 dBFS and no 0.3 s span stays under −42 (its quietest 0.3 s peaks at −38.8); the lot's −40.5 and −38.0 [M]. Every black has its faint room tone; every designed silence has its room.
- **Jumps over 15 dB** between 50 ms windows: the mix QA puts most on a word or an SFX onset; every one it couldn't place is named here by the bus that rose and its cause [M]:

| Segment | At (s) | The bus that rose | Cause |
|---|---|---|---|
| coldopen | 47.30 | score | named: the score's own entry in 6 the out: the knee's flat line on dry piano, F2 -> F3 -> F4 -> F5, over the resolved F pe |
| act1 | 229.25 | dlg | named: a word after a pause inside e2-vo-03 |
| act1 | 234.75 | score | marked: the re-entry after a designed silence (4B: none under the read (V.O. 3, 227.00-232.72): the boardroom's room tone; PROCEDURE has ) |
| act1 | 251.20 | dlg | named: a word after a pause inside e2-a1-0035 |
| act1 | 256.15 | dlg | named: a word after a pause inside e2-a1-0035 |
| act1 | 258.00 | dlg | named: a word after a pause inside e2-a1-0035 |
| act1 | 264.10 | dlg | named: a word after a pause inside e2-a1-0036 |
| act1 | 290.00 | dlg | named: a word after a pause inside e2-a1-0043 |
| act1 | 299.50 | dlg | named: a word after a pause inside e2-a1-0043 |
| act1 | 311.35 | dlg | named: the first breath or word of e2-a1-0046 |
| act1 | 315.80 | score | marked: the re-entry after a designed silence (6: no score in XEL's studio (the padded room tone is the joke; the mic's hops and the coun) |
| act2 | 94.75 | score | marked: a designed hit (DESIGNED HIT: THE PLAN's waltz on its downbeat, 0.25 s before the cut: the walk-on's tune,) |
| act2 | 97.85 | score | named: the score's own entry in e02-07b-one-word-blueprint: the word: the head as a music box (F G A-flat C); under "Omni. |
| act2 | 101.00 | score | named: the score's own entry in e02-07b-one-word-blueprint: the word: the head as a music box (F G A-flat C); under "Omni. |
| act2 | 109.75 | score | named: the score's own entry in e02-07b-one-word-blueprint: the diagram: BEFORE (the relay's pizzicato), the grate, [laugh |
| act2 | 140.70 | score | marked: the re-entry after a designed silence (the tear's light, a beat (10.07 -> 11.01): THE PLAN's tape-stop reaches nothing a quarter ) |
| act2 | 278.35 | score | named: the score's own entry in e02-07c-one-word-the-demo: H his face: the Water Line begins; THE STOP on the downbeat |
| act3 | 283.40 | dlg | named: the first breath or word of e2-a3-0022 |
| act4 | 0.20 | score | marked: a designed hit (DESIGNED HIT: the muted 808's first thud on the lighthouse's first bar line (the quartet a) |
| act4 | 2.70 | score | named: the score's own entry in e02-11-leverage-quartet: A1 the black's pre-lap; the lighthouse (B-flat): the eighths, the |
| act4 | 5.20 | score | named: the score's own entry in e02-11-leverage-quartet: A1 the black's pre-lap; the lighthouse (B-flat): the eighths, the |
| act4 | 21.90 | dlg | named: a word after a pause inside e2-a4-0002 |
| act4 | 32.70 | score | named: the score's own entry in e02-11-leverage-quartet: C1 the split, the lanyards; Terb (F: the eighths, the 808, the dy |
| act4 | 112.50 | dlg | named: a word after a pause inside e2-a4-0019 |
| act4 | 283.00 | score | marked: the re-entry after a designed silence (the quartet has ended as the complaint left the lobby (the cello's last pizzicato on the () |
| act4 | 313.00 | score | marked: the re-entry after a designed silence (THE DESIGNED STOP (22.06): the flap swings shut on its spring in room tone only; Mas at th) |

- **Loud moments** (momentary loudness over −10 LUFS-M, 6 LU over the target): 12 moments, every one carried by the dialogue (a line's emphatic word: the takes' own dynamics), the loudest -8.6 LUFS-M (act2 85.4 s, act3 2.6 s, act3 10.9 s, act3 119.6 s, act3 207.6 s, act3 212.0 s, act3 221.0 s, act3 223.2 s, act3 240.8 s, act3 260.8 s, act4 44.9 s, act4 216.5 s). No SFX or score moment passes -10 LUFS-M.

---

## 9. For an ear

Nobody has listened. In the order a listener should take them:

1. **The synthesized crowds** [J]: the demo house's three laughs (11.04, 11.05, 11.07) and its small one (11.08), the lobby's cheer and the stream's roar (19.04–05), the lobby's laugh (19.06), the party bed's laughs, the 2008 camcorder's applause (19.13), the cheering lobby under Gerg's shots. They are glottal pulses through vowel formants, no recording of anyone. Do they read as people (warm, a house, never a sitcom track)? If not: the recorded-crowd ask in §13.
2. **The ENGINEER's laugh** (9.03): nervous and his own; under Gerg's "Careful. The new one can hear you laugh." by 9 dB.
3. **GHOST-NOLE's chain** (sc 4): a ghost, still Nole; the chip doubler a hair late. And the cow's moo (4.13): low and ghostly, not a cartoon.
4. **Alyi's "Six years and eleven months."** (15.03, far): down a corridor at −19.5 LUFS, and still understood? Its onset is +11.9 dB over the score and +12.3 over everything [M].
5. **The demo house's PA** on every line in sc 11, against the off-mic pair at 11.15: does the contrast read, and is Rima's "and that's the demo." (11.09) close enough?
6. **The crosscut call** (19.09–19.10): both sides dry (the picture cuts on the speakers), Gerg's cheering lobby under his shots. Does it read as a phone call? If not, band-pass the far end under each cut's first frames (`crosscut.CROSS` holds the cut points). The cheering costs Gerg's weighted last question ("You ever miss being up there?") its margin: +8.6 dB against everything (+12.4 or more against the score alone); if it's lost, dip `bed_lobby_cheer` under it.
7. **The act-ins:** Act One → Act Two (the Water Line's hit, 7 dB softened), Act Two → Act Three (THE CLOCK's tick under the black), Act Three → Act Four (the motor and the pizzicato under the black, the 808's first thud). And the cold open's smash into the intro (−14.8 dB, 3.5 dB more than Ep1's).
8. **The biggest rides** (§4): the lab's room tone through the slot, the pins greying, the UI pops, the spotlight's swings, the buzzes on the bridge, the gravel walking away; and the 12 marginal sounds of §8.1. Is any of them now too present, or still lost? Each is one number in `sfx-rides.json`.
9. **The chant under 15.07**: the party still chanting under Alyi and Mas, low and far.
10. **The phone taps** (crisp glass ticks with a haptic thud): do they read as a phone, not a keyboard? The car horns as open fifths: do they read as horns? The thunder on F, the foghorn on F + C.
11. **The tag's V.O.** sits 1.6 LU over the median dialogue (the tag is mostly music, so its −16 LUFS lifts its one line; the guard's edge is 1.5).
12. **The designed stop** (22.06): the flap's spring in the lot's wind only, then the felt's return.
13. The beds' realism at their levels: the bridge (synthesized traffic), the séance's candles, the studio's padded silence, the garden.

---

## 10. How to rebuild

```sh
PY=audio/.venv-casting/bin/python; TH=audio/.venv-theme/bin/python
# the board's Ep2 sounds (new files only; refuses an Ep1 id), its sheets and the reel
(cd audio/sfx/scripts && MRMAS_MAX_LOAD=40 bash ../../../ops/heavy.sh ../../.venv-theme/bin/python build_ep2.py --reel)
# the ENGINEER's laugh (cached: a re-run sends nothing)
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY audio/ep02/v1-el/tools/el_render.py render --lines audio/ep02/v1-el/sound/laugh-lines.json --out audio/ep02/v1-el/sound --sets A
# the stems and the mix (re-runs itself through heavy.sh; rebuilds the stems when any input changed: the lock, the plans,
# the board's Ep2 manifest and files, the rides, crosscut.py)
MRMAS_MAX_LOAD=40 $PY audio/reel/ep02-v1/mix_episode.py --all
# the audit (--rides: one more step of the rides; then mix again)
MRMAS_MAX_LOAD=40 $PY audio/reel/ep02-v1/sound_audit.py [--rides]
bash ops/heavy.sh $TH audio/ost/tracks/e02-v1-common/pocket.py --all
```

A re-lock: the stems and the rooms follow the lock alone; the swaps, ducks, overrides and rides are keyed by beat id and lock name, so they follow their beats; `crosscut.py` keys its cuts by line id. After any timing change, run the mix and the audit (S5): the audit's lock account says if any sound is missing, and the stems' QA lists every sound cut at its scene's end.

---

## 11. Files

**New:** `audio/sfx/scripts/sounds_ep2.py`, `build_ep2.py`; `audio/sfx/manifest-ep2.json`; `audio/sfx/qa/spectro_ep2_01-08.png/.txt`; `audio/sfx/reel/reel_ep2.mp3`, `reel_ep2_index.json`; `audio/ep02/v1-el/sound/` (`laugh-lines.json`, `lines-A.json`, `manifest.json`); `audio/reel/ep02-v1/crosscut.py`, `sound_audit.py`, `sfx-rides.json`; `audio/reel/ep02-v1/stems/el/*-stems-qa.json`, `stems-inputs.json`; `audio/reel/ep02-v1/mix-qa/el/*.json` (each segment's mix QA, `loudness-report.json`, `outro-mix-qa.json`, `sound-audit.json`); this file.
**Changed:** `audio/reel/ep02-v1/stems.py`, `mix_episode.py`, `rooms.py`, `README.md`; `audio/ep02/README.md`; `audio/sfx/LICENSES.md` (one paragraph); `pipeline.md` §10 item 4.
**Generated, git-ignored:** `audio/sfx/wav/<the 170 ids>.wav`; the stems (`audio/reel/ep02-v1/stems/el/*.flac`); the mixes `out/ep02/v1/mix/{coldopen,card,act1,act2,act3,act4,tag,outro}-mix.wav`; the laugh's WAV.
**Untouched:** every Ep1 path; `audio/sfx/manifest.json`, `board.json` and every Ep1 board file (md5); the score's renders and cue sheets; the lock.

---

## 12. LEARNINGS rules checked

- **S1** [J]: the SFX sit in the show's key (F minor, no A: §1) and its colours (chip ticks on UI, the knee's F under the THUDs and the lamps); nothing corny (no meme sounds, no sitcom laugh). The score's identity is the score's; the mix only ducks it and makes room.
- **S3** [M]: room tone always on (every room on its first-choice bed, a black under room tone), 0 holes, the music continuous (the pre-laps and ring-outs laid), every 15 dB jump named.
- **S4** [M]: the rooms lead their cuts (0.6 s or the plan's J), the beacon leads Act Four, the pre-laps lead three chapters.
- **S5** [M]: every layer laid on the final lock; nothing runs past its scene (2 cut, listed); the click scan at every cut.
- **S6** [M]: the laugh is the ENGINEER's own library voice; every crowd is synthesized, no voice of anyone.
- **S7** [M]: MARIO's EQ; MARIO 0.3 dB under his neighbours in sc 18.
- **S8** [M]: −16 LUFS integrated per segment, true peak under −1 dBTP. The decoded-encode check is the assembly's.
- **S9** [M, J]: Act Two's act-in hit softened; the act-ins listed for an ear.
- **S11** [M]: every story sound measured in its band where it sounds; the rides and the score's three dips.
- **R1** [M]: no Ep1 path touched; the board's `manifest.json` and `board.json` byte-identical (md5 before and after) and no Ep1 board file rewritten (`build_ep2.py` refuses an Ep1 id); no shared code changed (the board's `build.py` is imported, not edited); `sha1sum -c ops/reorg/ep01-final.sha1` after the pass: 31 files, 0 differ. **R8**: "audible" here is measured, never heard. **R10**: every heavy step through `ops/heavy.sh`, one at a time. **R11**: keyscan before commit and push. **R13**: this note and the folders' READMEs. **R14**: scratch only in this session's scratchpad.
- **Broken on purpose:** none. **At the edge:** three act-in seams over 1 dB (designed, §7); the tag's V.O. 1.6 LU over the median (§9 #11).

---

## 13. Open issues and asks

1. **For the assembly:** the manifest's outro chapter says `dur: 10.125`, and the titles pass's outro is 15.0 s; `outro-mix.wav` is built from the outro's own WAV (whatever its length). The decoded-encode check (S8) and the A/V lag are the assembly's.
2. **The intro's open** (cold open → intro, −14.8 dB) is the intro master's level, not this mix's; Ep1 aired −11.3.
3. **Resource asks (R16, non-blocking):** a recorded crowd library (laughs, cheers, applause, licensed for use) would replace the synthesized crowds if the ear finds them thin; one human listener for §9.
