# e02-v1-act2 · Ep2 v1 Act Two "her" (sc 8–12) · the music stem

**The score pass, 2026-10-09.** Two cues, built as four renders and laid on the EL lock (the master, `show/reel/ep02-v1-el/ep02-v1-el-act2.json`: 6,696 frames, 279.00 s) with the `e02-v1-common` engine (composer X's `v3lib`):

| Render | Cue | Scenes |
|---|---|---|
| `e02-06-dark-room-spring` | E02-06 DARK ROOM, SPRING | 8 |
| `e02-07a-one-word-walk-on` | E02-07 ONE WORD: the walk-on, through the wall | 9 |
| `e02-07b-one-word-blueprint` | E02-07 ONE WORD: BLUEPRINT (THE PLAN) | 10 |
| `e02-07c-one-word-the-demo` | E02-07 ONE WORD: the demo, the pad, the Door and the stop | 11, 12 |

**Nothing here has been listened to.** Every number below is measured [M]. The musical calls are judged [J]. The "For an ear" list says what only a person can check.

**The brief:**
- **The cue list:** [manifest.md §6](../../../../show/episodes/ep02/production/v1/manifest.md#6-score-cues), E02-06 and E02-07.
- **The scenes and the mood map:** [proposal.md](../../../../show/episodes/ep02/production/v1/proposal.md) sc 8–12, "The feeling curve" and "The seams".
- **The script's MUSIC lines** (script-v1.md sc 8–12) and **the lock's music runs** (`track.py --dry --el`).
- **The notes from the earlier segments:** Act One ends on THE COPY's last F ringing into the black, so this act plays the Water Line whole: the copy first, the original after.

The mood map, in order:

| Scene | Mood |
|---|---|
| 8 | dry amusement, a small thrill, a quiet click of power |
| 9 | nervous fun |
| 10 | the explainer's lean-in |
| 11 | the episode's biggest laughs, then the coverage swinging away while Rima holds her mark |
| 12 | sudden quiet; a small dry win, closed; then, separately, a loss and a warmth that hurts |

## The render

| | |
|---|---|
| `render/music-el.wav` | **279.000 s, 13,392,000 samples (6,696 frames × 2,000), exact.** 48 kHz / 24-bit stereo, git-ignored |
| Level | −20.46 LUFS-I; true peak −3.15 dBTP; short-term p95 −17.17, max −14.71 |
| `check.py` (the v35check copy) | `act2 6696 f 279.000 s exact=True −20.46 LUFS-I −3.15 dBTP \| silence 0 holes 0 frag 0 \| 12 dB steps 0 unmarked 0 \| F-major True rule12 True knee 0/0 \| PASS` |
| Engine QA, every cue | F-major OK, written and spectral (worst A/F 0.26, 0.01, 0.14, 0.45). Rule 12 OK: no A-natural is written anywhere. Knee whole 0, completions 0. Every hit mark has an onset within 10 ms (2/2, 1/1, 1/1). Nothing sounds below C3 in the dark room: the sub under `room_drone` + `server_hum` reads −35.5 dB (sc 8) and −42.8 dB (sc 12) against a −18 limit. The one warning left is BLUEPRINT's short-term p95 (−15.6, over the −17 underscore guide), which is the featured explainer doing its job (P14: featured −16) |
| Music runs | **one run, 0 → 278.25.** It has two designed rests: the tape-stop's beat (140.40 → 140.70, 0.25 s of digital zero) and the act-out's stop (278.21 → 279.00). There is no unmarked digital silence, no hole under −60 dBFS and no fragment |
| `cues-el.json` | the cue sheet: each cue's sync marks and events; the designed rests and hits; `claims_sfx`; the sections (two with `duck_db`); the record on screen; the measurements and the engine QA. It names the timeline it was laid to |

The Kokoro lock (`show/reel/ep02-v1/`) was not rendered, because the film is the EL lock. There is no prelap file and no ring-out file (see "For the other passes").

## The tune: ONE WORD (one tune in three rooms)

The manifest asks for the demo's walk-on to be "one tune in three rooms", with the knee's step cell in it. The tune is original, in F dorian (F G A♭ B♭ C D E♭; never an A-natural), and swung, because people play it:

```
call    | F4 e  G4 e  A♭4 q   C5 e  B♭4 q(pushed)  A♭4 e | B♭4 q.  C5 (pushed, held: open)   + chip echo B♭5 C6
answer  | D5 e  C5 e  B♭4 q   A♭4 e B♭4 q(pushed)  G4 e  | F4 h (home)                       + chip echo G5 F5
harmony | Fm11 | B♭13 | A♭maj9(♯11) | Fm11 → C7sus(♭9)        bridge: D♭maj9(♯11) | B♭m9 | E♭9 | C7sus(♭9)
```

- The call climbs the knee's step cell (F G A♭) and its leap (A♭ → C), then holds the C open. The answer comes down through the dorian D to F.
- **The chip echo** after each phrase (the call's B♭ C, the answer's G F, an octave up) is the tune's own. It is what plays under the three-part "one wo-o-ord." (manifest E02-07; R2 moved THE COPY out of the demo).
- The three rooms are: **the walk-on through the wall** (sc 9), **the music box** (sc 10: the same notes, straightened into 3/4) and **the band on stage** (sc 11).
- CHATGTP's sung "one wo-o-ord." (the takes pass's setting) sings F G A♭ C, the head of the same tune, so the product sings the walk-on's first notes back to the house.
- **After ENDED, no fragment of the tune plays again.** "her" and Alyi's departure never share a frame or a cause (proposal, final check). The demo's pad carries only its harmony across the black. The phrase the act-out cuts is his own Water Line.

## What plays (the cue sheet)

EL seconds, on the segment's own clock (0 = Act Two's first frame). Chord changes that land on cuts pre-lap them by the latest beat or swung *and*, at least 0.15 s before the cut. They measure 0.16–0.50 s [M]. No change lands inside a V.O., a line of his, or a real post or headline on screen; each moves before or after it.

### E02-06 DARK ROOM, SPRING (0.0 → 44.6)

P01 DARK ROOM, swung. The grid's bar 1 is the act's first frame. Nothing sounds below C3, because the room has `room_drone` (F1 + C2) and `server_hum`.

| s | What plays | Why |
|---|---|---|
| 0.02 | **THE WATER LINE whole on the felt** (F F F G–F \| C F, swung), a rootless Fm9 in the left hand and its charleston. **The chip's 50 % square doubles the nudge only** (G4, 1.88). The sul-tasto cello and viola swell in (F3 + C4) over 2 s. This is a designed hit, so the mix keeps its attack | The seam's note from Act One: the copy finished his line into the black, and now the original plays, whole. "Arrive on the dark room with the monitor's glow already on his face" |
| 2.19 → 6.72 | (nothing moves) | The RULEBOOK's toast and his swipe are the SFX's: dry amusement, no hit |
| 4.79 | D♭maj9, on the line's swung push | MM-01's statement form: the push into the next colour |
| 7.92 | B♭m9, 0.17 s before the cut to the news site | The lineup |
| 8.58 → 10.05 | **the news site's own desk sting**, tiny, through the monitor's speaker (`futz('laptop')`): a snare's short roll into two brass stabs on B♭sus4 (no third), a glock ping. −19.1 LUFS-M | "Each show's tiny ducked media bed (a news-desk sting under the lineup)". The score plays the claimed `news_desk_sting` (the SFX board has none). It is in the show's own voice, not the score's comment |
| 10.38 → 13.28 | held | The headline is the news site's exact words ([H]): the record plays dry |
| 13.75 | **G♭maj7(♯11) held** (felt B♭3 F4 C5; cello G♭3, viola D♭4) | Between the headline and V.O. 4 ("the one after runs on ours."): his plan, own compute, in G-flat lydian. Nothing attacks under the words. The V.O. window measures **−23.4 LUFS** (the guide is −24 ± 2) |
| 20.63 | B♭m9, 0.38 s before the cut to the calendar | |
| 22.50 | **the Water Line again, a little cocky: the nudge twice** (F F G–F G–F), the chip on both nudges | OST §2.2, Ep2–3: "the nudge twice, a little cocky". The small thrill: his launch dragged onto Monday |
| 25.00 | **the settle on an open fifth** (F3 + C4: B♭ minor to F with no third). The felt's C4 lands on the downbeat, where `ui_drop_snap` puts the block on Monday; the settle's F4 lands on the cut to his face (25.63) | "He never takes a third at a cadence". The snap is the SFX's; the felt's C is the line's own fifth below |
| 26.30 → 28.14 | V.O. 5 sits inside the settle's ring (−26.9 LUFS) | "one day ahead is enough." Nothing attacks |
| 28.54 | **thin to the pedal**: the felt rests; the cello and viola hold F and C, 0.25 s before the call's cut | "Under the call the Water Line thins to its pedal". His one sentence of terms (31.48–36.42) plays over a held pedal (−23.6 LUFS) |
| 37.72 | **ONE chip note on CONFIRMED** (F5, the 50 % square; −20.5 LUFS-M). Designed hit | "One chip note on CONFIRMED": a quiet click of power. The score plays the claimed `ui_confirm_chip` (it is not on the board) |
| 38.13 | D♭maj9(♯11), 0.50 s before the cut, 0.4 s clear of CONFIRMED | The invite drops: the Monday square lit, the June invite under it |
| 41.88 | **the nudge alone** (G–F) on the felt, the chip on its G, after he accepts | His button: dry satisfaction |
| 43.0 → 44.6 | the D♭ rings out under the walk-on coming through the wall | The seam to sc 9 (J 1.0 s) |

### E02-07 ONE WORD (1/3): the walk-on, through the wall (43.0 → 94.85)

The stage band plays the walk-on, swung, warming up. **We hear it through the wings' wall:** two low-passes (about 700 Hz), the lows thinned, a boxy 210 Hz, mono, and a 27 ms slap off the corridor (`wall_post` on every stem). It is rendered at −24 LUFS and its 2–6 kHz band reads −46 dB, so it stays out of the voices entirely.

| s | What plays | Why |
|---|---|---|
| 43.0 | fades in under the invite (J 1.0 s): the intro (Fm11, C7sus) | "A stage manager's distant count and the demo's walk-on music warming up through a wall pre-lap (J 1.0 s)". The count is the room's (`bed_wings`) |
| 47.25 → 87.25 | **the tune: A A B A.** Walking upright, ride and foot hat, vibes comp, soft horns; the lead is an open trumpet with the chip in unison, the chip echo at each phrase end, and a brass tap at each phrase's end | Nervous fun: the show about to start, behind a wall, under quick talk. Rima, the engineer, Gerg and Mas play over it |
| 87.25 | the call's first bar, then **two bars of the dominant (C7sus) under the five hellos** | It leans into the next room |
| 94.45 → 94.85 | the wall fades out as the waltz arrives | |

### E02-07 ONE WORD (2/3): BLUEPRINT, THE PLAN (94.75 → 140.45)

P14 BLUEPRINT: **the chip music-box waltz, 3/4 on the 96 beat** (45-frame bars: 4 waltz bars = 3 picture bars). It is straight, with 0 ms of humanisation (THE PLAN is the record), in F dorian, quartal. The players are the chip box, celesta (an octave up: never F6, the SFX ding), harp, violin and viola pizzicato, a triangle bass and a chip two-note chord on beats 2 and 3. There is **no piano, no brass and no V.O.** This scene has no room bed, so the score is its whole bed.

| s | What plays | Why |
|---|---|---|
| 94.75 | **the waltz on its downbeat, 0.25 s before the cut**: the walk-on's head as a music box (F G A♭ \| C), a harp spread. Designed hit (−14.7 LUFS-M) | "The walk-on tune turns into THE PLAN's music-box waltz on the downbeat"; "the panel's last square becomes the grid's first cell, the waltz on its downbeat" |
| 97.03 → 100.96 | the box rests; the accompaniment softer under "Omni…" | −20 under the blueprint's lines (P14) |
| 101.63 / 102.25 | B♭ on BEFORE; A♭ (soft) on the relay drawn | **One note per label**. The diagram's section adds the drafting pizzicato (three clerks passing a note) |
| 108.19 / 109.75 | G (soft) on "fell out"; F on the `[laughter]` tag at the bottom of the grate | |
| 111.31 / 111.63 | B♭ on NOW, C on GTP-4o | One model: the pizzicato stops and a sul-tasto quartal pad holds instead |
| 117.25 | D C, the answer's head, in the gap | |
| 121.31 / 123.81 / 125.06 | **the three steps on the step cell: F, G, A♭**, each with a soft pencil tick (the stamps are the SFX's) | "The plan's steps are the line's steps" (P14) |
| 126.94 → 128.50 | B♭ A♭ B♭, then **C on the full sheet, the tiny stage** (the leap lands) | |
| 134.13 | **THE BREAK**: the answer starts under the empty bubble (D C B♭ \| A♭ B♭ G …) | "The break: the last 2 beats loop as the paper curls" |
| 137.88 | **its last two beats stick and loop** (B♭ G, the chip's chord on every beat, no bass): it never reaches F | The bubble blots out the tiny stage's lights |
| 139.22 → 140.40 | **a TAPE-STOP from the tear** (MM-07's curve), down to nothing | "A tape-stop into the demo cue at the tear" |
| 140.40 → 140.70 | **designed rest** (0.25 s of digital zero; the stems' faint room tone) | "The tear's light, a beat, before the stage" |

### E02-07 ONE WORD (3/3): the demo, the pad, the Door and the stop (140.71 → 278.21)

The demo is swung. Its beat grid is **locked to the sung line**: "one" of "one wo-o-ord." (175.295) is a beat, so the band plays in time under the three mouths.

| s | What plays | Why |
|---|---|---|
| 140.71 | **the push**: a swung *and*, 0.29 s before the cut to the stage. Vibes Fm11, the upright's F2, a brush slap, the ride's bell, a light brass tap. Designed hit (−13.9 LUFS-M) | The tear → the real stage lights; the walk-on's band, now on stage, close |
| 140.92 → 142.85 | **the chip lead (an octave up) with the violins an octave under**: the call's first bar | Rima takes her mark; the spot finds her (the swing is the SFX's) |
| 143.0 → 202.2 | **the light band under every line**: a two-feel upright, brushes (sweep, taps and foot hat on 2 and 4), vibes comp, softer under talk. The tune's form (A A B A …) keeps turning | "One continuous performance, ducking under every line". This is the show's own trio (chip, vibes, upright, pizzicato-hybrid), not a lounge trio |
| 155.92 → 158.1 | the lead: the answer, in the pocket after the GLYPH blink and the Orb's toast | |
| 173.42 → 178.42 | **the band holds a C pedal** (C7sus: the bass on C, the vibes held, no comping attack) under the engineer's ask and **the three-part "one wo-o-ord."** | The sung chord on "wo-" has an A3 in its low part. Over C it is a colour, never an A over F (rule 12) |
| 176.96, 177.17 | **the tune's own chip echo, B♭5 C6**, under the held "-ord", on the singing's beat | "The tune's own chip echo under the three-part harmony": the echo every call has had, not a copy of the voice |
| 178.42 | Fm11 (the resolution, after the laugh). No lead | **No phrase starts on a laugh.** Each crowd laugh leaves a 0.9 s window with no lead entry (168.11, 177.75, 195.91, 200.75): no button on a gag (OST rule 1) |
| 180.92 → 181.73 | the lead: the call's first three notes, then out for Rima | |
| 202.17 | **Rima's hold: the band thins to one held chord**, D♭maj9(♯11) (strings, bowed vibes, the bass's D♭), 0.16 s before her MCU | "The house is waiting on her, and she lets it". Nothing moves under "…and that's the demo." (−21.1 LUFS) |
| 207.80 | **ENDED: the rhythm stops; the pad** (Fm11: sul-tasto strings and the bowed vibes), 0.34 s before `ENDED` | "Thins to a pad at ENDED and holds it under the post". The "her" post (214.73–217.93) plays dry |
| 218.42, 223.42 | D♭maj9(♯11), then B♭m9: the pad moves once every two bars, between the blimp's steps, never on them | The coverage swinging away while Rima holds her mark (no hit on the blimp) |
| 238.84 | A♭maj9, 0.16 s before 12.01 | The house lights up full; her one breath; she walks off with the clicker. Her close is her own: warm |
| 244.67 | D♭maj9(♯11), 0.41 s before the front row | The empty seat. D-flat for the Door |
| 248.45 | **THE DOOR on non-vibrato flute, its first note missing**: D♭5, C5, then G4 held (its ♯4, no cadence), "through the door" (low-passed, panned to one side, room reverb only). Designed (−17.7 LUFS-M) | "The Door (Alyi's motif) with its first note missing, once, on the chrome's toast". The score plays the claimed `door_motif_note` |
| 251.67 → 252.67 | the pad holds across the beat of black; the Door's G rings into it | "Held across the beat of black into the afternoon (one sequence)" |
| 252.97 | **the felt's F4**: his room, within a bar of the home shot | OST rule 7 |
| 252.67 → 257.27 | **the news's tiny bed through his monitor**: spiccato eighths on A♭ E♭ D♭ F, a pizzicato bass, a timpani and glock, all through `futz('laptop')`, **cut when he minimises the window** | "The news's tiny ducked bed under the pad until he minimises it". The score plays the claimed `news_bed_tiny` |
| 257.80 | **the pedal** (F3 + C4, sul tasto), a beat after he minimises it | "The pad thins to its pedal under Alyi's post". The record plays dry through both posts and V.O. 6 (−24.7 LUFS-M at most; V.O. 6's window −25.3) |
| 276.33 → 278.00 | **his Water Line begins on his face**: F F G–F on the felt, the chip on the nudge | The hold on his face |
| **278.21** | **THE DESIGNED STOP, on the downbeat where the settle (C, then F) would land.** The mute takes every stem and tail to digital zero; then **designed rest** to 279.00 | "The cue stops mid-phrase on the downbeat". 278.21 is 2.0 s into the 2.79 s hold, leaving the black's 0.79 s for Act Three's THE CLOCK, whose first tick is a J 0.8 s under this black |

## The sync points (all read from the lock; the score re-lays itself)

| Lock event | s | What the score does |
|---|---|---|
| the act's first frame | 0.0 | the Water Line's first F (0.02, a designed hit) |
| `news_desk_sting` (8.02) | 8.58 | the monitor's sting (claimed) |
| the [H] headline (8.02, its window) | 10.38–13.28 | no change, no melody; G♭ waits until 13.75 |
| e2-vo-04, e2-vo-05 | 14.09, 26.30 | held chords struck before them; nothing attacks inside |
| the cut to 8.04 and V.O. 4's end | 21.0, 20.15 | statement 2 from the first bar after both (22.50), its settle before V.O. 5 |
| `ui_confirm_chip` (8.06) | 37.72 | the one chip note (claimed) |
| 8.07's `post_click` | 41.31 | the nudge on the next beat + 0.35 s |
| 10.01's cut | 95.0 | the waltz's downbeat is 0.25 s before it (94.75) |
| the plan's labels (10.02–10.06, from the on-screen items) | 101.7 … 128.5 | one note per label, snapped to the waltz's eighths |
| `paper_tear` (10.07) | 139.22 | the tape-stop's start |
| 11.01's cut | 141.0 | the push (latest swung *and* ≥ 0.15 s before, on the sung grid) |
| e2-a2-0030's word "one" | 175.295 | the demo's grid (a beat), the C pedal, the echo |
| `crowd_laugh_*` | 168.11, 177.75, 195.91, 200.75 | no phrase starts within 0.9 s |
| 11.09's cut | 202.33 | the hold (202.17) |
| `ENDED` (11.10) | 208.13 | the pad (207.80) |
| the "her" post, Alyi's two crops, his reply (kind `post`) | 214.73–217.93, 259.07–269.37, 265.65–276.20 | no change, no melody: the pad, then the pedal |
| 12.01, 12.02 | 239.0, 245.08 | A♭maj9, then D♭ (pre-lapped) |
| `door_motif_note` (12.03) | 248.45 | the Door (claimed) |
| 12.05's cut; `news_bed_tiny`; `ui_minimise` | 252.67; 252.67; 257.27 | the felt's F; the monitor's bed, cut on the minimise; the pedal a beat later |
| 12.08 (his face) | 276.21 | the stop at its start + 2.0 s, on the frame grid (278.208) |

**Re-timing [M]:** dry runs on two scratch copies of the lock, re-timed:
- copy (a): 8.02 +0.7 s, 8.06 +1.2, 9.04 −0.6, 10.05 +0.9, 11.07 +1.5, 12.05 +0.8;
- copy (b): 8.03 −0.5, 8.07 +0.8, 10.02 −0.7, 11.04 −0.9, 11.13 +1.2, 12.07 +1.1.

Both re-laid every mark to the moved events: CONFIRMED, the waltz's downbeat, the push, the pad's changes, the Door and the stop. Note QA stayed clean in all four cues (no written third, knee 0/0). On copy (b), the push pre-laps its cut by 0.58 s, because the demo's grid is locked to the sung line's beat (the latest swung *and* that clears 0.15 s).

## Measured

| Section | s | LUFS-I | True peak |
|---|---|---|---|
| E02-06 1 the arrival: the Water Line whole | 0 → 7.9 | −18.6 | −3.2 |
| E02-06 2 the lineup (the sting; the headline dry) | 7.9 → 13.8 | −20.3 | −3.2 |
| E02-06 3 V.O. 4: G-flat lydian held | 13.8 → 22.5 | −20.2 | −3.2 |
| E02-06 4 the calendar: the line cocky; the settle; V.O. 5 | 22.5 → 28.5 | −17.9 | −3.7 |
| E02-06 5 the call: the pedal; CONFIRMED | 28.5 → 38.1 | −23.6 | −11.8 |
| E02-06 6 the invite: D-flat; the nudge | 38.1 → 44.6 | −21.6 | −3.2 |
| E02-07 the walk-on through the wall | 42.3 → 94.9 | −23.9 / −24.3 | −4.0 |
| E02-07 BLUEPRINT: the word / the diagram / NOW / the steps / the tiny stage | 94.8 → 133.9 | −19.0 / −19.9 / −19.1 / −18.4 / −20.1 | ≤ −3.2 |
| E02-07 BLUEPRINT: the break and the tape-stop | 133.9 → 140.5 | −15.8 | −3.2 |
| E02-07 the demo A / B / C (the band under the lines) | 140.7 → 202.2 | −18.5 / −18.8 / −19.2 | ≤ −3.4 |
| E02-07 D Rima's hold and close | 202.2 → 207.8 | −21.1 | −8.1 |
| E02-07 E ENDED: the pad; the blimp | 207.8 → 238.8 | −22.4 | −10.4 |
| E02-07 F the house lights; the front row; the Door | 238.8 → 252.7 | −21.1 | −10.0 |
| E02-07 G the afternoon: the felt; the news bed; the pedal | 252.7 → 276.3 | −24.6 | −7.1 |
| E02-07 H his face: the Water Line; the stop | 276.3 → 278.2 | −20.4 | −10.1 |
| **whole stem** | 0 → 279.0 | **−20.46** | **−3.15** |

- **Engine masters (underscore):** E02-06 −20.0, the walk-on −24.0 (through a wall), BLUEPRINT −18.5 (featured), the demo −20.5.
- **Balance, piano · orch · big band · chip** (the engine's gated metric; rhythm excluded):
  - E02-06: 72 · 19 · 6 · 4
  - the walk-on: 0 · 48 · 37 · 15
  - BLUEPRINT: 0 · 30 · 0 · 70 (P14's guide is 0 · 50 · 0 · 50)
  - the demo: 16 · 66 · 2 · 16
- **Momentary peaks (LUFS-M)** [M]:
  - the head −13.9 (the felt's attack); the sting −18.5; CONFIRMED −20.3; the invite −15.1;
  - the walk-on −19.9;
  - the waltz's downbeat −14.7; the steps −16.0; the stuck loop −14.5;
  - the push −13.9; the sung bars −16.5;
  - the hold −19.4; the pad under the blimp −19.4; the Door −17.7;
  - the afternoon's felt and news bed −16.2; the pedal under the posts −24.7;
  - his line before the stop −17.7.
- **The V.O. windows** [M]: V.O. 4 −23.4 LUFS, V.O. 5 −26.9 (inside the settle's ring) and V.O. 6 −25.3 (the pedal). The engine's guide is −24 ± 2.
- **The dialogue pocket** [M]: the 2–6 kHz band reads −27.0 dB (E02-06), −46.1 (the walk-on), −18.9 (BLUEPRINT) and −19.5 (the demo). The guide is ≤ −15. The underscore masters also carry the engine's −2 dB pocket at 2.5 kHz.
- **The mix's duck:** E02-06 7 dB and E02-07 8 dB by mood. `cues-el.json` → `sections` asks for 5 dB over the walk-on (it is already behind a wall at −24) and 4 dB over BLUEPRINT (featured −16, −20 under her lines, and its line already thins under her voice).
- **The cut check** [M]: no step of 12 dB or more at any cut.
- **Mood shares by scored time** (277.9 s of 279) [J]:

  | Mood | Where | Share |
  |---|---|---|
  | comic, giddy, the explainer | the walk-on, BLUEPRINT, the band on stage | about 57 % |
  | warm, sincere, quiet | the dark room's Water Line; the hold, the pad, the Door; the afternoon | about 43 % |
  | suspense | none (the act's chill is carried by the pictures and the posts) | about 0 % |

  Suspense stays a minority (S2).

## Judgement calls (rules bent on purpose, one line each)

1. **No J 1.0 s pre-lap of the Water Line under act-out 1's black** (seam 9). The line starts on the act's first frame, as a designed hit, so it is whole in the stem whatever the mix lays. Act One's ring-out (THE COPY's last F) already carries the black.
2. **The demo's chip lead plays in three pockets only** (140.9, 155.9, 180.9). The talk is near continuous, and no phrase may start on a laugh. The band carries the tune's harmony under every line.
3. **The phrase the act-out cuts is his Water Line, not the demo tune.** The plan's "the cue stops mid-phrase" names no phrase. The tune after ENDED would tie "her" to Alyi's departure, which the final check forbids.
4. **The felt in sc 12** (the home shot's F, his line on his face) and **the strings under the dark room's V.O.** are not in the plan's music lines. They follow OST rule 7 (the felt within a bar of the home shot) and P01 (the V.O. sits inside the bed).
5. **The walk-on is source music heard through a wall**: rendered at −24, low-passed and mono, with a 5 dB duck. The plan says "heard through the wall, ducked".
6. **BLUEPRINT's first bar is the tune's head, not one note per label.** OMNI and `(o = omni)` fall inside it. It is the moment the walk-on becomes the music box, so the tune is heard as itself.
7. **The invite's D-flat lands 0.50 s before its cut**, not about 0.25, so that it sits 0.4 s clear of CONFIRMED's chip note.
8. **E02-06's felt attacks peak about −14 LUFS-M.** The faders ride the two statements −4.5 dB and the invite −3, but the engine's normalisation to −20 gives that back, because the statements carry the cue's level. Act One's head read −15.2 and its copy −14.7.
9. **E02-06's chip share is 4 %** by the gated metric. Its chip is the nudge on three notes and CONFIRMED's one note: sparse, short attacks, which the metric under-counts (Act One's note). The plan asks for exactly one chip note on CONFIRMED.
10. **BLUEPRINT's chip share is 70 %** (P14 guide 50). The music box is the lead and also plays the chords on 2 and 3, as MM-07's waltz does.

## For the other passes

- **Mix:**
  - **The head.** `designed_hit` at 0.02 (the Water Line's first F), so `mix_episode.py`'s head fade is 0.04 s, not 1.2 s. Act One's ring-out is laid under the first 2.5 s, as before.
  - **No prelap and no ring-out files.** Act Two ends on a designed stop, and Act Three's THE CLOCK is the re-entry (its first tick, J 0.8 s under the black).
  - **The duck.** `sections` → `duck_db` is 5 over the walk-on (43.0–94.75) and 4 over BLUEPRINT (94.75–140.45).
- **SFX:** the score claims four sounds the SFX board doesn't have (`claims_sfx`):
  - `8.02:news_desk_sting` (the monitor's sting);
  - `8.06:ui_confirm_chip` (the one chip note);
  - `12.03:door_motif_note` (the Door on flute);
  - `12.05:news_bed_tiny` (the monitor's bed, cut on `ui_minimise`).

  The stems drop them; `stems.py` reads `cues-el.json` here.

  The score leaves room for, and never doubles:
  - `ui_drop_snap` (it lands on the settle's downbeat: keep it dry and off A);
  - `palette_step_F` ×3 (11.02: the lead is out there);
  - `blimp_inflate_step` ×4 (the pad moves between them);
  - every `crowd_laugh_*`;
  - `stream_end_tone` (NEW; the pad's Fm11 lands 0.3 s before it: tune it to F or C).
- **Picture:** the stop at 278.208 assumes 12.08 is about 2.0 s on his face and then black (Act Three's J 0.8 s under "the midpoint's black"). If picture holds the face longer, the stop follows `B('12.08') + 2.0`. Change that one number in `cue_demo()`.
- **The engine (`e02-v1-common/v3lib.py`, not edited):** Act Two has no spoken real line. `mark_real()` reads the beat plan's tags as Act One does, and finds none. The record on screen is read from the lock's on-screen items: kind `post` (his "her", Alyi's two crops, his reply), any quoted text, and a `doc` in a beat whose plan `picture` marks [H] (the headline). See `record_windows()`.

## Re-run

```bash
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act2/track.py --dry --el          # the lock's runs, every mark, note QA
MRMAS_MAX_LOAD=40 OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act2/track.py --render --el
#   (--render darkroom | walkon | blueprint | demo: only those cues; then it re-lays and measures)
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-act2/track.py --assemble --el     # re-lay render/_work/el, measure
audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-common/check.py                   # the segment checks (PASS)
```

Render times through `heavy.sh` [M]:

| Cue | Time |
|---|---|
| the dark room | 11–33 s |
| the walk-on | 66 s |
| BLUEPRINT | 8–9 s |
| the demo | 81–162 s |

BLUEPRINT is rendered after the demo is built, because its tape-stop reaches zero 0.26 s before the demo's push. After any re-lock, re-render all four: every sync point comes from the lock (S5).

## For an ear, in order

1. **0–5 s:** the Water Line whole on the felt over the copy's tail: calm and sure, never a "sad piano". Is the chip audible on the nudge only?
2. **8.6–10 s:** the sting is the monitor's (small-speaker, tiny), not the score commenting on the lineup.
3. **22.5–28 s:** the cocky line (the nudge twice) is a small thrill, not a gag. The settle on the open fifth lands with the block on Monday.
4. **37.7 s:** one chip note is a quiet click of power.
5. **43–95 s:** the walk-on reads as a band behind a wall (muffled, alive), never a lounge cue or a stock corporate walk-on.
6. **94.75 s:** the tune becomes a music box on the downbeat, small and sweet, never a circus. The steps tick F G A♭ with the stamps; the stuck loop and the tape-stop are a stop, not a gag.
7. **140.7–202 s:** the band on stage is the show's own (chip, vibes, upright, brushes), never lounge. Nothing lands on a laugh. Under "one wo-o-ord." the band holds, and the echo under the held note sounds like the tune's, not a copy of the voice.
8. **202–239 s:** Rima's hold and close over one held chord; the pad under the post and the blimp is a held room, not a synth wash.
9. **248.5–252.7 s:** the Door is through a door; it rings into the black.
10. **252.7–257.3 s:** the news bed is the monitor's, and it stops on the minimise.
11. **276.3–278.2 s:** his line begins on his face and the cut on the downbeat lands as the midpoint, not as a glitch.

## Rules checked

[M] measured, [J] judged.
- **S1:** every cue names its motif and its mood (the cue sheet above) [J]. The show's own sound throughout:
  - the knee's cells: the Water Line's flat line and nudge; the tune's step cell and leap; the steps on F G A♭;
  - the chip in every cue (E02-06 4 %, the walk-on 15 %, BLUEPRINT 70 %, the demo 16 %);
  - the leitmotifs: the Water Line twice whole and once cut, the Door on flute, the tune's chip echo;
  - the hybrid orchestra (sul-tasto strings, pizzicato, harp, celesta, flute, brass accents) and the jazz colour (swing, a walking and two-feel upright, vibes, quartal and extended chords);
  - no third.

  No lounge: the band is vibes, upright and chip, not a piano trio. No generic pads: the sustained colours are played strings and bowed vibes [J; ears 5, 7, 8].
- **S2:** suspense is about 0 % of the scored time [J].
- **S3:** one run for the act. There are 0 holes, 0 fragments and 0 unmarked silences, and the two designed rests are marked with clear re-entries (the push; Act Three's tick). The music ducks and thins under lines rather than stopping [M].
- **S5:** every layer is anchored to the lock's events, and the re-timed locks re-lay [M].
- **S9:** laid to the lock's frames. The designed hits are marked: the Water Line's first F, CONFIRMED, the waltz's downbeat, the push and the Door. Soft entries: the strings' silent attacks, the pad, the walk-on's fade through the wall [M].
- **S11:** the story sounds keep their room: the snap, the stamps, the palette steps, the blimp's steps, the laughs [J].
- **OST rules:**
  - 1: no comic scoring. No phrase starts on a laugh; the band holds under the sung punchline and "It's free!"; the stop is the act-out [J/M].
  - 4: the knee is never whole [M].
  - 6: swung for people; THE PLAN straight [M].
  - 7: the felt within a bar of the dark room's home shot [M].
  - 10: the record plays dry under the posts and the headline; nothing attacks under the V.O. [M].
  - 11: the score plays only the four sounds it claims [M].
  - 12: no A-natural anywhere [M].
- **Guardrails:** "her" and Alyi's departure share no musical cause. No fragment of the demo tune plays after ENDED, and the cut phrase is his own line [J].
- **R10:** every render went through `heavy.sh` with `OST_WORKERS=2`, one at a time [M].
- **R1:** Ep1 untouched. Only `audio/ost/tracks/e02-v1-act2/` was written. Ep1's tracks and `e02-v1-common` were read, never edited.
- **R8:** nothing heard.
- **Broken on purpose:** the ten calls above.

**Resource ask (R16, non-blocking):** one human listen of the eleven points above, ears 5 and 7 most of all (the walk-on and the band on stage: the line between "the show's own swing" and lounge is an ear's call).
