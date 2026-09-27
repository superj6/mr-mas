# e01-v3-act1 · Ep1 v3 Act One "research preview" (sc 5–12) · the music stem

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md), on the mood map of [v3-plan §6](../../../../show/episodes/ep01/production/stick/v3-plan.md). **Nothing here has been listened to.** Every number below is measured, and the "for an ear" list says what only a person can judge.

| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **322.500 s, 15,480,000 samples (7,740 frames × 2000), exact.** 48 kHz / 24-bit stereo, git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **337.458 s, 16,197,000 samples, exact.** |
| `cues.json`, `cues-el.json` | The cue sheets: every cue's window, what plays, its sync points, the engine's QA, the note-level checks, the loudness of every sub-section, the marked silences, holes and fragments. |
| `track.py` | The source: eight cue builders, the lay-in and the measurements. Its docstring is the spotting map. |
| `v3lib.py` | **Shared by all four of this composer's segments** (`../e01-v3-{coldopen,act2,tag}` import it): the timeline clock, gaps, thinning, render, lay-in, measurement. |
| `render/_work/`, `render/_work/el/` | The per-cue engine renders (Kokoro, EL) (underscore masters, cue sheets, MIDI, piano rolls). Git-ignored. `--assemble` needs only these. |

**The clock.** 0 is the act's first frame. Beat starts are the cumulative `reelDur` rounded to 24 fps frames exactly as `studio/src/reel/schema.ts` `timeEpisode` does (head 0, JS rounding); a line's first sound is its beat's start + `t` (negative for a J-cut), a sound is start + `at`. **Every sync point is read from the timeline**: beats, lines, word timings, sounds and the gaps between lines. There are no hard-coded seconds, so the same score re-renders to any variant of the lock with one command.

**Levels.** Each cue is the OST engine's underscore master (normalised per cue, −3 dBTP ceiling, the 2.5 kHz dialogue pocket), laid dry of dialogue. The mixer ducks it under speech.

## What plays (the cue sheet)

Kokoro-lock seconds. The EL lock's times are in `cues-el.json`.

| s | Cue | Mood · palette | What plays, the hits, the thinning |
|---|---|---|---|
| 0 → 108.3 | `a_launch` | **Warm, giddy.** P01 colours in **A♭ major** (the v3 sample's cue A, re-fitted) | The late-night trio: Rhodes, felt, brushes and upright. **Gerg's Build in A♭ major** on the chip, in straight-16th compile passes that `place_passes()` puts in the gaps and under Gerg's own lines, never inside a V.O., one of Mas's lines, or on the heels of any line. The felt carries every V.O. (the Rhodes gives way, the brushes only sweep, the bass holds its root). D♭m(add9) shades "And what if it wakes up?". E♭13sus hangs from "Your button." through **the click** (5.08), and nothing moves. **Felt alone for Alyi and Mas** (5.09), with the Door's head in the gaps (A♭ D♭ \| C G, ending on the ♯4). The trio returns for the chatbot, the Build doubled by violin pizz. |
| 108.3 → 128.1 | `a_launch` | **Exhilarating.** P11 SET-PIECE SWING **in A♭ major** | Ride, walking bass, the Build as the chip lead, violins in octaves, brass accents, on the cut frames: the lift (5.12); the odometer grows (6.01, A♭6/9); **the CLUNK** drops it a major third to E (6.02); C6/9 and one brass hit on the post, then thin (6.04); **the push into the MILLION** on the swung and-of-4 with the Build's "shipped" tag, so the odometer's ratchet owns the downbeat (6.06); **one band hit on the cut to Rima** (6.08). The grid is anchored on the clunk. |
| 128.1 → 149.6 | `a_launch` | **The heat.** The Ache over F | A held A♭maj9 under "Low-key." / "Very low. Basement.", then **the turn** (6.09): cello A♭→F, violin E♭→D♭, C and G held, glass on G + D♭ (the Ache), under the tile and the palette steps F, A♭, C. The F/C pedal only under the bill ("it's the bill." / "mostly the bill."). It lets go on the tear (7.02). |
| 148.5 → 184.9 | `code_red` | **Comic panic.** C minor, straight, **on his phone's small speaker** (`era.futz('phone')`) | The siren's whine J-cuts in under the last puff of steam. Straight pizzicato 16ths (varied pitches), pizz bass, timpani; **the siren as a joke**: when the tower rises (8.02) the orchestra wails its swoop (bowed strings and horns bending up a tritone and back). Serene Radnus gets a far-off two-tone on the flute in half notes. The crypt: a staccato tuba + bassoon ascent. Xylophone runs only in the gaps; everything else thins under every line. **The phone's lock (8.06) kills it dead**, 3 ms: a diegetic stop. |
| 185.3 → 206.5 | `lobby` | **Caper, charming.** P06 THE JOB (MM-05 family) in **F dorian**, swung. Not LEVERAGE | The bass walks in under the revolving door. The head on vibes + straight mute (bars 2–3). **The check jams on the swung and-of-4**: a push (bari F + trombone C + the head's C5). Tasya's Rhodes on the beats. In the freeze (9.04), the band keeps moving (Mas does) but thins, and the felt carries "eleven keys. he's here for the twelfth.". Under the partnership talk: bass, brushes, her Rhodes, one-beat vibes fills in the gaps. The head's tag as the check slides under the door, a last C7♯9 push, and **the band stops dead on the collar's pop** (a downbeat, 3 ms). |
| 206.5 → 214.6 | — | designed stop | The lobby's room only, under "That collar suits you." / "it does." / "and the rent?". |
| 214.6 → 236.7 | `floor` | **The landlord's colour** (OST-BIBLE §2.16) | **Tasya's floor**, the strings re-bowed with silent attacks: A♭maj9 → Cmaj9 → Emaj9 → A♭maj9, each move on one of her sentence breaks (read from the take's word timings), with one soft Rhodes chord per move. It holds under "that's a lot of servers." and "Everyone is welcome. Rent is due on the first.", then gives way under the key ring's jangles. |
| 236.4 → 260.5 | `lobby2` | **Weeks on.** THE JOB, light | The swing comes back on a new phrase from the jangle; the grid is placed so the two jangles land on the swung ands (the key ring owns the offbeats, the Rhodes the beats). Dry under her quote ("…we made them dance…"). One held chord while the TV plays Radnus's tap-dance. The last chord (Fm9) is held under "ours does that too." and is **out before Gerg closes his laptop**: his button is in the room. |
| 260.4 → 262.5 | — | designed rest | The laptop closes; the room; then the match cut. |
| 262.5 → 301.7 | `duel` | **Rivalry.** MM-04 Lighthouse, **B♭ minor**, straight | The laptop opens on the match cut and the chip boots (4 notes); a pizz pulse is the pre-beat. From the split, **Gerg's Build** (chip + woodclick, left pane) and **Mario's Addendum** (solo violin + quartet, right pane) trade bars over the Lighthouse's marimba and harp, one tempo; the Addendum gains a tail every time. The felt carries the V.O. ("mario used to sit where gerg sits."). **The quartet's held chord under Mas's post** (a real post: no motion). **The turn:** the Addendum's longest tail crosses the split, and on Gerg's photograph the chip plays Mario's tail (Gerg ships it). A held B♭m(add9) rings into the letter. |
| 301.2 → 316.5 | `pause` | **A chill.** MM-17 low: Nole's Launch, THE JOB colour | A low, swung F-minor-blues walk on C7alt that never resolves to F, brushes, a Rhodes comp; Nole's Launch stack (C F B♭ E♭) on muted horns in the gaps, **falling one note short** of its A♭. Nobody pauses, and neither does it. On the hard cut to his desk it thins to a low C + G♭ pedal and rings out before the reflection. |
| 316.5 → 320.5 | — | designed rest | **No score on the reflection** (Alyi in the glass; the pen's scratch only). |
| 320.5 → 322.5 | `threat` | **THREAT, once** (MM-14, P08) | On the pen's lift: tuba F1, trombones F2 + C3, horns C3 + G♭3, timpani F2, sub F1 (F–C–G♭, no third). Its tail rings into the black. |

**Variety across the act:** warm major trio → a major-key swing → the first dark bar → comic panic through a phone → a charming caper swing → the landlord's warm mediants → a lighter swing → rivalry → a cool, low chill → one THREAT. Suspense is only the heat and the out.

**Stops:** the phone's lock, the collar's pop, the reflection's rest. Each has room tone under it (the sound stem's) and a clear re-entry. **Pre-laps and handoffs:** the whine under the last puff; the lobby's bass under the revolving door; the floor under the jangles into the swing; the duel ringing into MM-17's push; the tear's Ache crossing the siren.

## Measured

| Cue | LUFS-I | ST p95 | True peak | Engine QA |
|---|---|---|---|---|
| `a_launch` | −20.05 (the swing −17.1 with p95 −15.3: featured) | −16.7 | −3.15 | F-major OK, written third 0, knee 0 |
| `code_red` (after the phone) | −22.0 | −20.6 | −12.5 | OK |
| `lobby` | −20.0 | −18.6 | −6.4 | OK |
| `floor` | −22.0 | −21.2 | −10.5 | OK |
| `lobby2` | −21.0 | −19.2 | −9.3 | OK |
| `duel` | −20.0 | −18.0 | −5.3 | OK |
| `pause` | −21.0 | −19.4 | −7.0 | OK |
| `threat` | −18.3 (2 s) · **−14.6 LUFS-M** (the out's target −14 ±1) | — | −3.15 | OK |
| **The whole stem** | **−20.5** | −18.0 | −3.15 | |

The EL stem measures the same within 0.3 LU per cue (whole −20.45 LUFS-I). The loudness of every sub-section is in `cues.json` → `measured.rows`.

- **Length:** exact to the sample on both locks.
- **Digital silence:** only the four marked stops (the lock → the pickup 0.30 s; the pop → the floor 8.06 s; the laptop → the match cut 2.11 s; the reflection 4.01 s). **No unmarked digital silence. No hole below −60 dBFS for 0.3 s or more outside them.**
- **Fragments:** none under 2 s except the THREAT, which is the designed out.
- **OST checks (every cue, both locks):** written A♮ over an F bass: 0; the engine's sieved F-major check: OK; the knee whole: 0; knee completion by pitch class: 0. (Render 1 of `a_launch` flagged one resonance, not a written note, at the turn: the cello's ~111 Hz body resonance under the F pedal. Both cellos now carry the same notch the pizz layers use, and the check passes.)
- **Onsets:** most marked hits are within ±10 ms; the misses (20–60 ms) are soft entries (bowed strings, the felt's rolled chords, the muted brass), as in the sample.
- **Engine warnings left:** `a_launch`'s short-term p95 (−16.6) is over the −17 underscore guide because of the odometer swing, a featured set-piece (P11, up to −16), as in the sample.

## The ElevenLabs variant

`render/music-el.wav` is rendered from `show/reel/ep01-v3-el/ep01-v3-el-act1.json` with the same code. That lock is 14.96 s longer (launch night +12.5 s, the terms +3.5 s), and its 6.01 is 4.875 s, not 5.0. So **the odometer's grid is anchored on the clunk**: the clunk, the post and the million stay on their bars, and phrase 1's downbeat leads 6.01's cut by 0.125 s (the only clock note, in `cues-el.json`). Launch night's bar count follows the lock, and every pass, fill, felt chord and stop follows the new line timings. It measures clean on every check above.

## Re-run

From the repo root. Rendering is a heavy job (OST engine), so it goes through `ops/heavy.sh` with two workers. All eight cues take about 1.5 min.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render            # all cues, then lays them in
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render --el       # the ElevenLabs lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --render lobby duel # only some
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --assemble [--el]    # light: re-lay _work, measure, rewrite cues.json
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act1/track.py --dry [--el]         # light: build the scores, note-level QA
```

The cue names are `a code_red lobby floor lobby2 duel pause threat`. `--timeline PATH` (or `V3_TIMELINE=`) takes any other variant of the lock.

## Where this departs from the calls, and why

1. **Alyi's two-hander is felt alone, with his Door in the gaps**, where the script says "Rhodes alone under Alyi's two lines". This is the v3 sample's choice, kept because the brief says to reuse the sample's cues: it's Mas's instrument in his one exchange with Alyi.
2. **The terms get Tasya's floor, not silence.** The script allows "a low pad if the ear wants one". The floor is the bible's colour for her (§2.16 lists sc 9) and it plants Act Four's. The pop's stop is still a real 8 s rest before it.
3. **The duel is straight, with no kit**, so the chip's 16ths, the pizz 8ths and the marimba's quarters carry the rivalry. The Addendum is on the solo violin rather than the whole quartet leading.
4. **MM-17 in Ep1 has no fanfare** (OST-BIBLE §2.7: "No fanfare yet"). The Launch stack is stated low and muted, and it falls short.

## For an ear, in order

1. 0–68 s: the trio and the Build under the talk: warm and awake, never busy, never a melody on the lines. Any Nintendo feel is a fail.
2. 108–128 s: the swing in major: exhilarating, not "upbeat corporate"; the E and C drops read as falling through the building.
3. 131.8 s: the turn into the Ache: does it land *because* everything before it was warm?
4. 148.5–184.9 s: code red through the phone: comic, the siren a joke (never a slide whistle), thin enough under the founders; the lock's dead stop reads as the phone, not a glitch.
5. 185–206.5 s: the lobby: charming, not LEVERAGE; Tasya's Rhodes reads as hers; the pop lands in silence.
6. 214.6–236.7 s: the floor under her terms: warm, faintly ironic.
7. 262.5–301.7 s: the duel: rivalry by structure; the chip copying Mario's tail on the photograph.
8. 301–322.5 s: the chill, the rest on the reflection, the THREAT: one chill, not "dun-dun-dunnn".

## Notes for the mix

- **Launch night will mostly play under the mixer's duck** (talk is nearly continuous from 10.5 to 107 s). If the warmth doesn't read, try −6 dB of duck for this stretch rather than −10 (the sample's note).
- `code_red` is already on the phone's small-speaker chain (band-limited, mono); don't futz it again.
- The Freeze hits, the clunk, the ratchet, the pop, the jangles and the lock click are timeline sounds; the score leaves them their beats.
