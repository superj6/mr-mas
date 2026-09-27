# Ep1 stick reel v3: the plan (closer to the characters, easier to follow, shorter)

> **Status: PLAN, 2026-09-27.** Nothing below has been applied yet, except the on-screen text removals in §1.4 and the outro credit. A short moving sample comes first (§8). The full v3 pass waits for the showrunner's look at that sample.

**The notes this answers** (showrunner, 2026-09-27, on the Ep1 stick v2 and the Act Four v5 pixel preview; also SHOWRUNNER-NOTES 1–4):
1. "it still is pretty quick on transitions and feels like your not fully pulled into a scene"
2. "we don't need to explicitly write out parody and some other clear pointers as is done in stick animation"
3. "outro should say by opus 5.5"
4. "don't make mas's unsound narration forced/corny. it is hard to tell attach to mas as there is little that tells about his thoughts throughout, everything still feels distance"
5. "some parts are hard a bit hard to follow and it feels too disconnected from the characters. let's also make sure the soundtrack and general feeling has some variety, not everything needs to sound super suspenseful or else the suspense parts lose their pull"
6. "i do also think it's getting a bit long. let's think about how ew could cut down as well"

**What it replaces:** the length packages P1–P3 in [ep01-stick-v2-for-review §6](ep01-stick-v2-for-review.md). P1 cut mostly air. Note 1 asks for more air at scene edges, so v3 cuts whole beats instead.

---

## 0. The short version

- **One diagnosis under all six notes: the episode keeps the audience outside.**
  - We watch Mas from outside, like everyone in the story does: 3 inner-voice lines in 22 minutes.
  - We enter rooms on inserts and labels, and we leave the instant the last word ends.
  - Reference drops that aren't anyone's problem ask the viewer to decode, which is where "hard to follow" comes from.
  - Almost everything is scored as suspense, so the suspense has nothing to stand out from.
- **The fix, in one line: replace pointers with a person.**
  - Mas's inner voice carries what the labels did (who someone is to him, what's at stake) and gives us his head.
  - Scenes get an arrival and an aftermath.
  - Beats that are only references get cut.
  - The music gets warm and light colours, so the dread lands.
- **Runtime:** cut about 3:00 of beats, reinvest about 1:05 in arrivals, aftermaths and his voice. **Story 22:02 → about 20:10** (the band is 20:15–21:15). The episode runs about 20:50 with the intro, the 2 s card and a short outro.

---

## 1. What's wrong, measured (Ep1 stick v2, 22:51)

Measured with `studio/src/reel/tools/pacing.py` and the timelines' cue lists.

### 1.1 Transitions (note 1)

| | Ep1 v2 |
|---|---|
| Talk scenes (8 s or longer) that cut away within 1.5 s of the last word | **13 of 30** (median aftermath 2.1 s) |
| Lines that start under the previous shot (a J-cut / pre-lap) | **0 of 226**. The stick-reel schema clamped `t` to 0 until 2026-09-27, so a sound-led scene change couldn't be written at all. |
| Lines that run over the next shot (an L-cut) | 6 of 226 |
| Stays in one place under 10 s | 25 of 53 (screens counted as part of the room they're watched from) |
| Place changes per minute | Act Three **5.2**; Act Four 2.6; Act One 2.0; Act Two 1.4 |

**Against the reference shows** ([pacing-comparison.md](../../../../_sources/research/pacing-comparison.md), measured):
- **Our shots aren't fast.** Our average shot is 5.1 s (median 3.4 s). Veep runs 3.2–4.3, Silicon Valley 3.1–3.5, The Social Network 2.9, House of Cards 4.4, Fleabag 4.5–5.5 and Better Call Saul 6.5–7.4.
- **Our scenes are short, and we keep leaving them.** We change place about every 25 s. The reference half-hours run about 50–75 s per scene heading, and House of Cards' measured average is 73 s.
- **So the fix is fewer, longer stays with real entrances and exits,** not slower cutting.

### 1.2 Distance from Mas (note 4)

- **242 of 1,788 words (14%) are his, in 57 lines, 3 of them inner voice:** "nobody noticed.", "i made it for everyone else.", "i don't keep score.".
- **Why:** the bible designed him that way. [pov-and-framing §3.1](../../../../bible/pov-and-framing.md#31-the-rule): "Mas never confesses; the audience infers." §5.4 capped V.O. at 5–8 lines and 60 words an episode, each line ≤ 10 words, never claiming a feeling. Every rule made sense alone. Together they make a lead nobody can get close to.

### 1.3 Hard to follow (note 5)

The newcomer read's confusions ([read-v2-newcomer.txt](read-v2-newcomer.txt) §2) are nearly all reference beats that aren't anyone's problem in the scene:
- the Atem weights leak
- Rezeile and EMIT
- the clone and the chairman
- "…cease operating…" on the poster
- Coinworld
- the "hopeless" quote
- "why Vegas"
- Ttemme's unanswered question
- the tag's "What the quack!", `CTRL`, the glass prompt and the Grey Lady

Where a character wants something, the newcomer followed.

### 1.4 Pointers on screen (note 2), done

Removed on 2026-09-27 from the timelines and the Act Four lock sources:
- **The disclaimer** after the intro. The card is now the filename alone, 2 s.
- **The parody/terms line** in the outro.
- **Hedge tags:** every `(REPORTED)`, the `~$10B*` asterisk, and `(HE LATER SAID: OUT OF CONTEXT)`.
- **The Q\* explainer rail.**

The docs are being updated to match. The Act Four pixel data picks this up at its next lock. **Still to go in v3:** the `HIS SIDE` / `THE BOARD'S SIDE` badges and the `WHAT THEY DIDN'T KNOW` card. In v3 the voice tells us whose side we're on: when we hear him, we're with him.

### 1.5 One colour of music (note 5)

**The cue sheet:**

| Stretch | Music now |
|---|---|
| Launch night | Nothing under the talk, then an F-minor pad for the odometer |
| The Macrosoft deal and the lobby | LEVERAGE (the chess ostinato), 115 s |
| The duel | The minor Lighthouse |
| Act Three | The Water Line |
| Act Four | Suspense palettes, until THE RETURN |

- **Light colours today** are the White House pomp, the tour's run, one THE JOB phrase and THE RETURN: about 3½ minutes of about 20.
- **By my reading of the cue sheet, roughly four-fifths of the scored time is minor-key suspense or somber.**
- **The OST bible makes that the default:** F minor as home, "never F major".

---

## 2. What v3 does

### 2.1 Arrive, stay, let it land (note 1)

- **Arrive.**
  - Most scene changes lead with sound: the new room's tone, or the first line, 0.5–1.5 s under the outgoing shot.
  - A new place opens on the room with its people in it (wide, or character-in-space), not on an insert or a label. It holds 2–4 s before the talk, longer at a chapter change.
- **Stay.**
  - A conversation keeps its room.
  - A cutaway under 10 s either carries new information someone reacts to, or goes.
- **Let it land.**
  - After the scene's turn or last line, hold 1.5–3 s on whoever it hit, with the room still breathing.
  - Big turns get 4–6 s.
  - Music or room tone can carry over the next picture (an L-cut).
- **Transitions vary with the story.**
  - Hard cuts for momentum and cross-cutting.
  - A sound bridge or a held exterior when time passes.
  - A match cut where two places rhyme.
- **The tool is fixed:** the reel schema now takes a negative `t` (down to −4 s) for a pre-lap.

### 2.2 A person instead of pointers: Mas's inner voice (notes 2, 4, 5)

The full guide is [mas-inner-voice.md](../../../../bible/mas-inner-voice.md). The short form:
- **Present tense, in the moment, to himself.** He is quicker inside than outside. The calm is something he does, and the voice is where we watch him do it.
- **What it carries:**
  - **His read of people:** what each one wants, what they'll do next. This is also how a newcomer learns who they are.
  - **His small stakes:** where to stand, when to speak, the button.
  - **His warmth:** Gerg, the years with Alyi.
  - **Now and then, the gap between the line he says and the thing he thinks.**
- **What it never does:**
  - puns
  - aphorisms
  - winks at the real-world news
  - narrating what the picture shows
  - "little did I know"
  - a motive at a contested real moment (guardrails §6 holds)
- **At the blow he goes silent.** We've been in his head all episode, so the silence is felt.
- **Density:** 15–25 lines, about 200–300 words, in 4–6 clusters of 3–6 lines in the rooms he's reading. None from the call through "super.", and none on the board's side, which is how we know we've left him. That's against 3 lines now; the Mr. Robot and Dexter pilots run 53 and 75 cues ([inner-voice research](../../../../_sources/research/inner-voice.md)).
- **Predictions that pay off:** two or three an episode. His reads are right, so the one he gets wrong ("alyi set it up. probably just the budget.", seconds before the call) hurts.

### 2.3 Cut the references, keep the people (notes 5, 6)

**The test for every beat:** whose problem is this in the scene? If nobody's, cut it, or give it to a character as a want or a line.

### 2.4 Tonal contrast (note 5)

A mood for each sequence, so suspense is a colour and not the wallpaper. **The OST gets a warm and light family:**
- major and Lydian colours away from F
- brushes, Rhodes, the chip Build in major
- swing for the capers
- a real triumph at the return

F-minor suspense is kept for the stretches that earn it (§6). This needs an OST-BIBLE note (§0 rules), which the lead will draft for the showrunner.

---

## 3. The cut list (about −3:00)

Seconds are measured from the v2 timelines unless marked ~ (proposed). "Keep" notes say what stays so the character beat survives.

| # | Where | Cut | Saves | Why |
|---|---|---|---|---|
| C1 | A1 sc 10 | **Sydney, whole scene → Ep2** (with its real line) | 26.3 s | The newcomer couldn't read "5 turns" or "remember me"; nobody in our story wants anything in it |
| C2 | A1 sc 11 | **Kram's crate** (the Atem weights leak) | 5.9 s | "No stakes, don't know why it's there." Atem stays on the intro poster |
| C3 | A1 sc 11 | **The duel's wordless phrases 3–4** at 2 bars each | 10.0 s | Held text that reads in under 2 s |
| C4 | A1 sc 12 | **The EMIT page** (Rezeile's "shut it all down") | ~4.7 s | The newcomer didn't know who or what. Nole's `BUILDING HIS OWN` plant stays |
| C5 | A1 sc 6 | **The drill:** the kitchen bar, the shaft phrase, Gerg's second post insert | ~8.4 s | Montage repeats; the size reads in half the time |
| C6 | A1 sc 9 | **Folds:** the check arrives inside the lobby wide; the pen goes into the freeze | ~6.0 s | No line lost |
| C7 | A2 sc 16 | **The tour poster** from 20 s to one held beat, about 8 s, with Mas's voice carrying the flip | ~12.0 s | "…cease operating…" didn't say where or why |
| C8 | A2 sc 15 | **The clone and the chairman,** simplified to one clear exchange | ~10.0 s | "I couldn't tell who is nervous." |
| C9 | A2 sc 17 | **NOTNIH's plate,** and phrase 1 tightened | ~6.0 s | Held text; Ep3 introduces him |
| C10 | A3 sc 19 | **The hands runner** (items 2–4) **and India** | 25.2 s | The most fragmented stretch in the episode (5.2 place changes a minute); references with no one reacting |
| C11 | A3 sc 21 | **The scroll pour and its inserts** | ~7.2 s | "that one." and the MARIO scroll were unclear |
| C12 | Tag | **"What the quack!" / the cut line, the `CTRL` drawer insert, the glass prompt;** one clear button instead of three | ~12 s | The newcomer couldn't read the last minute |
| C13 | A4 S4 | **The step-four volley** ("Step four will reveal itself." → "That is the company telling us.") | 16.3 s | S4.02 already says the board has nothing for Monday |
| C14 | A4 S4.08 | **Mario's second call** ("It's Nozama…" → "How much?") | 6.5 s | The joke's told at sc 19's second phone |
| C15 | A4 S4.13 | **The statement's first sentence** (the sign carries the welcome) | 4.8 s | — |
| C16 | A4 | **The `WHAT THEY DIDN'T KNOW` card**, and trims of the two wordless holds | ~3.8 s | A pointer; his voice returning does the job |
| C17 | throughout | **Filename card 4 s → 2 s** (the disclaimer's read time is gone) | 2.0 s (episode, not story) | Note 2 |

**Total ≈ −2:57 of story.** The Act Four cuts (C13–C16, −31 s) reopen the approved act. They mean a re-lock and a pixel re-render of the shots they touch. They're here because the act is 39% of the episode and note 6 is about the whole.

**Not cut, on purpose:**
- **Gerg's TV question and Tasya's night-work wink** (length-v2 #12, #13): they're character, the thing notes 4 and 5 ask for more of.
- **Act Three's holds:** they're breath.
- **Mario's full concerns at the White House:** his one full conversation.

## 4. The reinvestment (about +1:05)

| What | Where | Adds |
|---|---|---|
| **Arrivals:** 1–3 s of room before the first line at about 18 place changes; 4–6 s at the chapter changes (launch night, the White House, the dark room's first scene, Vegas, the board's side, 2 AM, Monday) | throughout | ~40 s |
| **Aftermaths:** the 13 short exits held to 1.5–3 s; the big turns to 4–6 s ("super.", "He did both.", "leave it open.", "good question.") | throughout | ~20 s |
| **Inner-voice time** the gaps can't hold (most lines ride in arrivals and aftermaths) | his scenes | ~5–10 s |
| J-cuts and L-cuts | throughout | 0 s |

**Runtime:** story 22:02.4 − 2:57 + 1:05 ≈ **20:10**. The episode is about 20:50 (with the 30 s intro, the 2 s card and a 6–10 s outro).

## 5. Closer to the characters, beyond Mas (note 5)

- **Every principal gets one moment that isn't a joke,** already the bible's rule ([pov-and-framing §3.8](../../../../bible/pov-and-framing.md#38-the-ensemble-gets-close-too)). In v3 it gets its time:
  - Gerg: 2 AM
  - Rima: launch night's "what do we tell them?"
  - Alyi: the six years and eleven months
  - Neleh: the blank line
  - Tasya: the door
- **Mas's voice about each person** (one line the first time we meet them) does the introduction a label or lower-third did, and tells us how he feels about them.
- **Name plates:**
  - Explanatory lower-thirds (for example `TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS`) shrink to the name.
  - The show's gag name cards stay where they're style (the Borderlands freeze), at most one per scene.

## 6. The mood map (note 5)

| Sequence | Mood | Music (temp for the stick; the OST owner renders) |
|---|---|---|
| Cold open | Poised, curious | as now |
| Launch night (sc 5) | **Warm, giddy, late-night garage band** | NEW: the Build in a major colour (brushes, Rhodes, chip), low under the talk |
| The odometer (sc 6) | **Exhilarating**, then heat at the bill | SET-PIECE SWING in major, turning on the tile |
| Elgoog's code red (sc 8) | Comic panic | Pizzicato, the siren as a joke |
| The landlord's deal (sc 9) | **Caper, charming** | THE JOB swing (MM-05 family), not LEVERAGE |
| The duel, the pause letter (sc 11–12) | Rivalry, then a chill | Lighthouse, then THREAT once |
| White House, Senate, tour (Act Two) | **Pomp and comedy** | MM-19, a lighter Under Oath, THE RUN |
| Dark room (Act Three) | **Intimate, quiet, a little lonely** | Water Line, warm; THE CLOCK only at the act-out |
| Vegas → the call → the night (Act Four) | **Suspense, then silence** | as now: this is what it's all saved for |
| The board's side | Dry, procedural comedy | PROCEDURE, lighter |
| 2 AM with Gerg | **Warm, loyal, funny** | The Build and felt piano, major |
| Monday and the return | **Triumph, one size too big** | VICTORY LAP / THE RETURN |
| Tag | Quiet, wry | Water Line |

---

## 7. The inner voice, sample lines (drafts for the sample, §8)

**Launch night (sc 5):**
- Over the bullpen wide, before anyone speaks: *"gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first."*
- Rima: "…what do we tell them?" Then, before his answer: *"she's right. it will break. i just don't know which part."* Aloud: "it's a preview."
- After "Your button.": *"alyi asks that about everything we build. he means it every time."*
- Gerg: "It likes everyone. It called my variable names inspired." Then: *"i know. i still read it twice."*
- The counter's first ticks: *"someone noticed."*
- "it's the bill." Then, held on him: *"mostly the bill."* This plants his one-word corrections, which surface aloud to the Orb in Act Four ("mostly.").

**Vegas, noon (S1):** *"the race is tomorrow. the board wants noon today."* Then nothing from the call on. He is silent inside for the whole blow, and "super." is the next thing we hear from him.

**2 AM (S5):**
- The phone's hearts: *"four hundred and six. four hundred and seven."*
- Gerg's tile rings: *"gerg. of course it's gerg."*
- After "The company. Again. Just in case.": *"gerg never waits to be asked."* (the bible's planted line)
- "alyi voted." / "He did both.": **nothing.** A held face and the room.

These are drafts. The guide's tests (§ "is it corny?") apply to each.

## 8. The sample, before the full pass

- **What:** about 4 minutes of stick reel. It runs launch night through the bill (sc 5–7), Vegas through the night (S1–S2), and 2 AM (S5). The three are chosen for three moods: warm, suspense and loyal.
- **Built with every v3 change:** arrivals and aftermaths, J/L cuts, the inner voice (recorded), the new temp music colours, and no pointers.
- **Built** by `audio/reel/ep01-v3-sample/build_timeline.py` (the timeline, with every edit and its reason in `_edits`), `mix.py` (takes, rooms leading the cuts, SFX, the one silence, the ducked score) and the composer's temp stem in `audio/reel/ep01-v3-sample/music/`. It's 5:33 because Vegas keeps THE PLAN's blueprint whole. No cold read yet: the showrunner sees it first.
- **Output:** `out/ep01/reel/ep01-v3-sample.mp4`.
- **Then the full pass** (§9), after the showrunner's notes on the sample.

## 9. The full v3 pass (after the sample)

1. **Script:** the cuts (§3), the inner-voice map across the episode (15–25 lines), the name-plate trims, and the fact rewrites (§10). Then the newcomer and insider table reads.
2. **Takes:** record the V.O. and any changed lines (fastrec, minutes).
3. **Timelines:** rebuild each segment with arrivals, aftermaths and J/L cuts. Act Four gets a new stick timeline, then a re-lock.
4. **Sound:** a new temp stem per act on the mood map. The OST owner renders the new warm/light cues (the Build in major, THE JOB swing for the lobby, SET-PIECE SWING major).
5. **Assemble** Ep1 stick v3, then measure and do the cold reads.
6. **Afterwards:** carry Act Four's changes into the pixel preview (re-lock and re-render the touched shots).

## 10. Facts to settle in the writing (hedge labels removed, 2026-09-27)

With the `(REPORTED)`-style labels gone, these Ep1 items would now read as flat fact. Each gets rewritten as a character's claim, trimmed to what's solid, or cut. (Found by the docs pass; Ep2–3 items are in its report and belong to those scripts.)

| Item | Where | Resolution in v3 |
|---|---|---|
| `~$10B` on the rail and Tasya's key ring (Macrosoft said only "multiyear, multibillion") | A1 sc 9; A4 S1.04 | Say "multibillion" (the verified words), or give the number to a character as a claim ("ten, they're saying") |
| `TWO STAFF REVOLTS` (the Tpool flashback's rail) | A4 S2.03 | Drop the count from the rail; the flash's two shadows at a door carry it, and Mas never touches marks 1–2 (pov-and-framing §3.7) |
| `ALYI` lit on the staff letter | A4 S5.06 | Add the sourced row to the facts file (widely reported; he later posted his regret) before lock |
| "…totally hopeless to compete with us…" without his "out of context" reply (a fairness issue) | A3 sc 19 | Cut with the hands runner (C10) |
| `EQUITY: 0` | A4 S1.04 | Keep "(HE TOLD THE SENATE)" or cut the plate: the joke is his own testimony, so it needs him |
| The Vegas race weekend (new, in the V.O. plan and the sample's picture) | A4 S1.01 | Add a facts row before use |

**Estimate:**
- **The sample:** half a day.
- **The full pass:** 1–2 days, mostly serial writing and sound work.
- **Rendering** is a small share, as before.
- **Laptop:** runs through `ops/heavy.sh`.
