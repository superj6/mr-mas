# Ep1 stick v3 sample · the temp music stem

**What this is (2026-09-27).** One 48 kHz stereo WAV, `music.wav`, exactly **332.88 s** (15,978,240 samples). It runs on the sample's own clock: 0 is the sample's first frame, and the beat starts are frame-rounded exactly as `../mix.py` lays them. It's rendered at underscore level and dry of dialogue. The lead's mixer ducks it under speech, so nothing here ducks.

**Why.** The showrunner, 2026-09-27: "let's also make sure the soundtrack and general feeling has some variety, not everything needs to sound super suspenseful or else the suspense parts lose their pull". This is the v3 mood map's first temp ([v3-plan §2.4, §6](../../../../show/episodes/ep01/production/stick/v3-plan.md)):
- **A** is warm and giddy (A-flat major).
- **B** is suspense: Act Four v5's own material, re-fitted to the new timings.
- **C** is warm and loyal (D-flat lydian and A-flat major).

The warm colours (major or lydian away from F) are authorised for this sample by the brief. Everything else follows the OST bible. Rule 12 holds (no A natural over an F bass anywhere), the knee is never completed, and nothing on the §1.7 banned list is used.

**Nothing here has been listened to.** Every number below is measured.

## Files

| File | What |
|---|---|
| `music.wav` | The stem: 48 kHz, 24-bit, stereo, 332.88 s. It's git-ignored (`audio/reel/**/*.wav`); re-create it with the commands below. |
| `cues.json` | The cue sheet (schema `mrmas-reel-music/1`). It holds the four cues with start, end, what plays, the render and every sync point; one row per sub-section with its measured level; the marked silences (each checked to be digital zero); holes; and the clock notes. |
| `track.py` | The source. It has four cue builders (`cue_a`, `cue_b1`, `cue_b2`, `cue_c`), the render and the lay-in with its measurements. Its docstring is the second-by-second spotting map. |
| `_work/` | The four cue renders: `<cue>-underscore.wav`, `.cue.json` (the engine's QA), `.mid`, `-pianoroll.png` and `.lay.json`. Git-ignored. `--assemble` needs only these. |

## Re-run

From the repo root. The render is a heavy job, so it goes through `ops/heavy.sh` with two workers. On this laptop A takes about 55 s, B1 16 s, B2 5 s and C 25 s.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --render        # all four, then lays them in
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --render a c    # only some (a b1 b2 c)
audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --assemble   # light: re-lay _work/, measure, rewrite cues.json
audio/.venv-theme/bin/python audio/reel/ep01-v3-sample/music/track.py --dry        # light: build the scores, note-level QA, clock check
```

`--dry` prints `clock notes`: every place where the timeline disagrees with the brief's numbers. The sync points are read from `show/reel/trials/ep01-v3-sample.json` at build time, so a re-timed timeline re-spots everything on a re-run. The section edges are the brief's, as constants at the top of `track.py`.

## The map, with measured levels

The levels are LUFS-I measured on `music.wav` itself. The engine normalises each cue's master to its target:
- A, B1 and C to −20;
- B2 to −22, as v5 had it.

| s | What plays | LUFS-I |
|---|---|---|
| 0–2.5 | Slate: digital zero | — |
| **A · LAUNCH NIGHT** | **All of A** | **−20.1** (p95 −16.6, peaks −3.15 dBTP) |
| 2.52–71.96 | **The late-night trio**: Rhodes, felt, brushes and upright. **Gerg's Build in A-flat major** plays on the chip, in straight 16ths as compile passes: 4, 8 or 16 notes, in the gaps and under Gerg's own lines. The felt doubles each pass's first note, because Mas is with him. Under every V.O. the Rhodes gives way to a soft felt chord, the brushes only sweep and the bass holds its root. No chord or pass starts inside one of Mas's lines or right after a punchline. A D-flat-minor(add9) shades "And what if it wakes up?". | −21.0 |
| 71.96–74.46 | **The click**: the Build's 16-note pass ends on the bar, and one E-flat13sus chord is held. The dominant hangs, and nothing happens. | −21.2 |
| 74.46–89.46 | **Felt only**, under Alyi and Mas. D-flat maj9(♯11) is the deceptive IV. **Alyi's Door** head plays on the felt in the gaps of their exchange (A♭ D♭ \| C G). It ends on the ♯4 and never cadences. | −21.6 |
| 89.46–111.96 | **The chatbot**: the trio returns, with the Build lighter and doubled by violin pizzicato. | −21.0 |
| 111.96–134.88 | **The counter: SET-PIECE SWING in A-flat major**, on the cut frames. Ride, walking bass, the chip Build as the lead, violins in octaves and three brass accents:<br>• the lift at 111.96;<br>• the odometer grows at 114.46;<br>• **the clunk at 119.46 drops it a major third to E**;<br>• C major on the post at 124.46;<br>• **the push into the million on the swung and-of-4** (129.27), with the Build's "shipped" tag (E♭5 → A♭5), so the downbeat and the odometer's ratchet stay clear;<br>• one band hit on the cut to Rima (134.88).<br>The fall A♭ → E → C → A♭ is the landlord's cycle of major thirds, run backwards: the building he falls through is hers. | **−17.1** |
| 134.88–160.33 | A held A♭maj9 under "Low-key." / "Very low. Basement.". Then **the turn at 138.58**: it voice-leads into **the Ache**. The cello goes A♭2 → F2 and the violin E♭5 → D♭5, while C and G hold; glass doubles G4 + D♭5. It's the sample's first dark bar, under the red tile and the palette steps F, A♭ and C. From Rima's line only the F2/C3 pedal plays. On the tear the pedal lets go and the Ache rings once more; it's out by 160.25. | −21.5 |
| 160.33–162.83 | Slate: digital zero | — |
| **B · NOON, LAS VEGAS** | **B1** (162.83–208.98) | **−20.0** |
| 162.83–170.83 | The suite: an F3/C4 sul-tasto pedal bows in as air. Then v5's felt Water Line bar, with its nudge on his glass nudge (168.75). | −22.9 |
| 170.83–194.46 | **THE PLAN**, v5's score on v5's own frames + 164.82 s: the stamp, the waltz's three walk-offs (172.58), one Blueprint note per label, the held chord and the path. | −19.8 |
| 194.46–199.81 | **BREAK**: the stuck G–A♭ loop runs on, thinned to the box, the triangle and the root under "alyi set it up. probably just the budget.". **The tape-stop** starts after his last word (198.96) and reaches zero **on the JOIN click (199.81)**. | −19.0 |
| 199.81–208.98 | **LEVERAGE (low)**, v5's take on S1.07–S1.09's frames + 167.43 s. **Cancel at 208.98 is a dead stop, D6**: every stem and tail goes to digital zero. | −19.8 |
| 208.98–218.92 | No score: the room, the buzz and "super.". Digital zero. | — |
| 218.92–232.83 | **B2**: v5's S2 re-laid (MM-08 26A): the felt's open fifth on the carve, the nudge G4 before "i don't keep score.", the F/C pedal, mark 3, the settle and the Rewind. It rings out fast into the slate. | **−22.5** |
| 232.83–235.33 | Slate: digital zero | — |
| **C · 2 AM** | **All of C** | **−20.0** (p95 −17.7) |
| 235.40–240.41 | The felt alone: a D-flat lydian chord, then **the Water Line, warm** (F F F G F \| C F over D♭maj9(♯11) and B♭m9). The chip square plays on the nudge only. | −18.1 |
| 240.41–245.67 | **The count**: the felt's left hand ticks quarter notes on the hearts' tempo, on varied pitches. It starts before the first heart and ends after the last, so it's a pulse, not a note per heart. It moves E♭13sus → D♭ as he miscounts. | −18.9 |
| 245.67–250.92 | One held chord under "the badge was a joke." / "mostly.", then the Water Line's C4. | −22.4 |
| 250.92–267.46 | Gerg rings: A♭maj9. **The Build enters warm** (chip + felt) after the V.O. and plays passes under Gerg, resting under "it's two in the morning, gerg." | −17.6 |
| 267.46–290.30 | **The letter**: a D♭3/A♭3 sul-tasto pedal only; the record plays dry. It lets go on "Alyi signed it." and is **out by 290.2**. | −22.4 |
| 290.30–296.25 | **No score** ("alyi voted." / "He did both."). Digital zero. | — |
| 296.25–302.08 | The check: the felt returns softly (A♭(add9), then E♭13sus after the stamp). | −18.0 (one attack) |
| 302.08–316.00 | **The Build returns**: 4 notes with his keys, a rest under "what are you building?", then 8 under "The company. Again. Just in case.". The V.O. gets the felt and a soft A♭3/E♭4 pad, **the held note**. Then a 12-note pass is **cut dead on his look up at 309.42**, after 4 notes; the pad holds under "pack?" and "compiles.". | −21.3 |
| 316.00–327.38 | **Tasya's floor takes the held chord**: the pad's A♭3 and E♭4 are already hers, and the Rhodes plays on the beats. The floor moves under her: Cmaj9 (the viola's E♭ nudged to E), then Emaj9, then home to A♭maj9 on "desk" (325.49). The landlord owns the chord. | −21.4 |
| 327.38–332.88 | After "leave it open.", the felt takes her chord back **without its third** (E♭3 A♭3 B♭3), and the Water Line settles C4 → F4 over it: **A-flat 6/9 with no third**. It rings out to −100 dB by 332.8. | −19.3 |

The whole stem is −20.1 LUFS-I, −3.15 dBTP.

## Measured QA

- **Rule 12 (written A natural over an F bass):** 0, in all four cues, at every note boundary.
- **F-major check (sieved audio):**
  - OK in A, B2 and C.
  - In B1, two windows at the tape-stop (about 198.8 s, A/F 0.18) are flagged as unexplained A energy: the chip partials sweep down through A as the tape slows. v5's S1 had the same warning in the same place. The engine can't attribute a pitch-warp done in a post.
- **Knee completion by pitch class:** 0 in all four cues.
- **Marked silences:**
  - All five are digital zero in `music.wav`: the three slates, D6 (208.98 → 218.92) and the rest (290.30 → 296.25).
  - No other hole of 0.3 s or more below −60 dBFS anywhere in the scored stretches.
- **Ring-outs:**
  - A is at −86 dB by 160.0 and −135 dB by 160.25.
  - C's pedal is below −60 dB by 290.2.
  - B2 is below −67 dB at 232.7.
  - The end is at −100 dB at 332.8.
  - The only dead stop is Cancel.
- **Sync-point onsets within ±10 ms:**

  | Cue | Within ±10 ms |
  |---|---|
  | A | 21 of 28 |
  | B1 | 19 of 23 (v5: 20 of 23) |
  | B2 | 7 of 7 |
  | C | 14 of 18 |

  - The misses are soft entries.
  - In A, the humanised felt doubling leads the locked chip by about 20 ms.
  - In B1, v5's muted horns and bassoon on the arrow's steps are 50–60 ms off.
  - In C, the soft chord attacks miss.
  - Every note is written on its mark.
- **Short-term p95** (the underscore guide is −17):

  | Cue | p95 |
  |---|---|
  | A | **−16.6** |
  | B1 | −17.1 |
  | B2 | −20.4 |
  | C | −17.7 |

  A is over on purpose. Its loudest windows are all in the set-piece swing, which P11 treats as featured (−16), and the showrunner asked for exhilaration there. Take 0.75 dB off `macro` in `cue_a` to meet the guide exactly.
- **2–6 kHz band** (the limit is −15 dB):

  | Cue | 2–6 kHz |
  |---|---|
  | A | −18.8 |
  | B1 | −19.5 |
  | B2 | −36.2 |
  | C | −25.6 |

- **Sub band under the room SFX:** OK in every cue (A −18.7, B2 −33.7, C −34.5 dB). C and B2 keep everything at or above C3 under the dark room's drone.
- **Balance (piano · orch · big band · chip):**

  | Cue | Balance |
  |---|---|
  | A | 36 · 13 · 36 · 16 |
  | B1 | 11 · 49 · 0 · 40 |
  | B2 | 89 · 8 · 0 · 3 |
  | C | 77 · 19 · 0 · 4 |

  A's big-band share is the theme method counting three short brass stabs over their whole sections. By energy it's 2%.

## Where this departs from the brief, and why

1. **Cancel is at 208.98, not "about 209.4".** 208.98 is where the timeline and `mix.py` put the Cancel click (S1.09 + 2.4 s), and it's where the mixer starts the deliberate silence. A dead stop has to be on the click.
2. **JOIN is at 199.81, as the brief says, but the timeline's click sound isn't.** S1.06's `dialog_ok_click` is still at +1.25 s (197.00), carried over from v5, so the mix plays the click 2.8 s before the tape-stop lands. **Please move that sound to +4.07 s**, which puts it on 199.81 and matches the caption: "His finger over JOIN while he thinks it through. Then the click."
3. **The tape-stop is 0.85 s, not v5's 1.8 s.** It starts after the V.O.'s last word, so the pitch slump doesn't sit under his line. Before it, the stuck loop runs 5.4 s instead of v5's 2.5 s.
4. **B2 rings out, where v5 cut the Rewind on the whip into pass one.** The brief asks for a ring-out by 232.83, and pass one isn't in the sample.
5. **"mostly the bill." (153.40) gets the pedal alone,** as the brief asks. The bible's habit of one felt note before a V.O. is left out.
6. **The Build doesn't restart after "ask me when it compiles."** The caption says he types again. A 4-note restart right after the line would read as a button on the joke (OST-BIBLE rule 1), so the pad holds into the door instead. It's easy to add if wanted.
7. **Alyi's Door on the felt at launch night (A2) is a new placement.** OST-BIBLE §2.9 plants his motif first in the boardroom glass. Here Mas's felt holds his tune in the gaps, which is the warmth v3-plan §2.2 asks for. It's the OST owner's call whether to keep it.

## What a human must hear

1. **2.5–72 s:** is the trio and the Build warm and awake, and never busy? The chip should be a keyboard in the next room, not a melody on the lines. Any Nintendo-overworld feel is a fail.
2. **74.5–89.5 s:** the felt alone, and the Door in the gaps. Tender, or the sad-piano cliché?
3. **111.96–134.9 s:** does the swing in major exhilarate without turning "upbeat corporate"? Do the E and C drops read as falling through the building? The push and chip tag into the million should be a band shout, not a ta-da; drop the tag if it reads as a button.
4. **138.58 s:** does the turn into the Ache land *because* everything before was warm?
5. **194.5–199.8 s:** the stuck loop under his wrong read, then the tape-stop onto JOIN (check it against the corrected click). The plan failing, not a playback fault?
6. **235.3–251 s:** the Water Line warm, and the felt's count. A pulse, not a note per heart?
7. **289–296.3 s:** out on "Alyi signed it.", then 6 s of room. Designed, or a hole?
8. **309.42 s:** the Build cut dead on his look, with the pad holding. A ring-out, not a glitch.
9. **316–332.9 s:** does Tasya's floor sound warm and faintly ironic? And does the felt's A-flat 6/9 with no third read as open rather than final?

## Notes for the mix

- **The launch-night bed will be mostly inaudible under the mixer's duck.** `mix.py` ducks the music 10 dB under all speech, and talk is nearly continuous from 12.9 to 111. So the bed (−21) plays at about −31 for most of A1 and A3, and the warm colour may not read. If the showrunner can't hear the change of mood, try −6 dB for this sequence. The bed is already thinned in the notes.
- **The GM Rhodes can sound dated** (engine §22). It carries the launch-night trio and Tasya's floor.
- **v5's renders in `audio/ost/tracks/e01-act4-v5/` were read, not touched.** B1 and B2 are rebuilt from v5's score files, imported read-only, with their clocks re-mapped in `cue_b1` and `cue_b2`.
