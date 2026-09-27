# Ep1 stick reel v2: length, where it may drag, and what to cut (proposals only)

| | |
|---|---|
| **What this is** | The editor's length report on the full Ep1 stick reel, `out/ep01/reel/ep01-full-v2.mp4`. It has the measured length against the format's frame (§1), where the reel may drag, with timecodes (§2), a ranked cut list with the seconds each cut saves and what it costs the story (§3), and three cumulative packages of about −1, −2 and −3 minutes (§4). |
| **Why** | The lead's call on length: build the full episode at its current length, let the showrunner watch it and mark where it drags, then cut. This file is the menu for that watch. The rules it follows: SHOWRUNNER-NOTES 11 ("i said to cut down empty time, but not to cut every dialogue into only a few words per character"), 12 (don't drag on inferable information) and 13 (clear to a newcomer), and the script's own rule for length cuts: whole beats, never words from lines. |
| **Who, when** | The `ep1s-length` pass, 2026-09-27, about 02:30 → 03:00. |
| **State** | Report only. **Nothing is cut.** No file other than this one was written in the repo. `script.md` was not touched. Nothing was committed (the lead commits). |
| **Honesty** | I can't watch or listen. Every second here comes from the reel's own timelines (beat lengths, line onsets, word timings) and the assembly's measurements. Every "cost" is a reading of the script, the segment notes and the registry, not a viewing. **Where the reel drags is the showrunner's mark to make.** §2 only says where the numbers point. |

---

## 0. The short version

- **The reel is shorter than the brief assumed.** It measures **21:33.5 of story** (cold open through tag). With the intro, the card and the 12 s outro placeholder it's **22:17.5**, without the 3 s reviewer slate.
  - The "about 25 minutes" figure was the script's estimate from word counts at the voice guide's paces: story ≈ 24:55 after dialogue pass 5, and ≈ 26:10 with the 43 s credits placeholder.
  - The recorded takes play **3:21.5 shorter** than that estimate (§1.2).
- **Against the frame.** The format (FORMAT-DECISION §1) sets **22:00 runtime and 20:45 of story, ±0:30**, so the story band is 20:15–21:15.
  - The story is **18.5 s over the band's top and 48.5 s over its centre.**
  - The runtime is 17.5 s over 22:00, which is inside ±0:30.
- **What that means for the packages:**
  - **−1 min (P1)** brings the story to **≈ 20:36**, inside the band and 9 s under its centre. It cuts no protected beat, touches no Act Four frame and moves nothing to another episode. It is almost all empty time and told-twice items.
  - **−2 min (P2)** gives ≈ 19:31 and **−3 min (P3)** ≈ 18:34. Both land under the band's floor (by 44 s and 1:41).
  - P2 and P3 only make sense if the showrunner's marks ask for that much, if the room rules for a shorter pilot, or if a later layer plays slower than these stock takes. The script's guide-pace model is the high end: at those paces the same words run ≈ 3:20 longer (§1.3).
- **The packages are cumulative** (P2 contains P1, and P3 contains P2).

  | | Now | P1 (≈ −1:00) | P2 (≈ −2:00) | P3 (≈ −3:00) |
  |---|---|---|---|---|
  | Cut | — | **−57.9 s** | **−2:02.3** | **−2:59.9** |
  | Story | 21:33.5 | 20:35.6 | 19:31.2 | 18:33.6 |
  | Episode (no slate) | 22:17.5 | 21:19.6 | 20:15.2 | 19:17.6 |
  | Touches Act Four | no | no | yes (4 cuts) | yes (6 cuts) |

- **Act Four is the part the showrunner has already watched and approved** ("the script dialogue and pacing is looking much better"). Its pixel preview is locked to it shot for shot (timing-v5 §0).
  - So Act Four cuts come last, and each one costs a re-lock, a re-mix and a pixel re-render.
  - Without Act Four, the cold open to Act Three and the tag can give about −2:00 before they reach the never-cut list and the fairness floor (§4.4). **A −3:00 package has to take about 50 s from Act Four.**
- **Where the numbers point for drag** (§2):
  - **the 40 s without a voice at 9:10–9:50** (the Senate's stamp, the poster run and the signers);
  - **the 33 s at 5:53–6:25** (the duel);
  - **pass one at 13:55–17:41**, the opposite signal: the episode's densest talk, all from the board's side;
  - **the 45 s after Act Four's last line, 21:23–22:08**, where two endings play back to back.
  - The set pieces play as text cards over temp pads in this reel, so they will read flatter here than in the final picture.

---

## 1. The length, measured

### 1.1 Against the frame

The format's frame, from `show/format/FORMAT-DECISION.md` §1:
- **Runtime:** 22:00 (±0:30).
- **Story:** 20:45 (±0:30), "timed by the slate animatic".
- **Fixed overhead:** 1:15, made of the intro (0:30), the card (0:02) and the credits (0:43).

| | Measured (this reel) | Frame | Over |
|---|---|---|---|
| Story (cold open → tag) | **21:33.5** (1,293.5 s) | 20:45, band 20:15–21:15 | +48.5 s on the centre, **+18.5 s on the top** |
| Episode without the slate (story + intro 30 s + card 2 s + outro 12 s) | **22:17.5** | 22:00, band 21:30–22:30 | +17.5 s, inside the band |

- **The overhead has changed.** The showrunner's outro note replaces the 43 s credits with an outro of 6–15 s, so the overhead is now about 0:38–0:47 (0:44 with the reel's 12 s placeholder), not 1:15.
  - A story at the band's centre (20:45) then runs 21:23–21:32, which sits at or under the runtime band's floor (21:30).
  - **The two bands no longer agree.** This report measures against the story band, because the format says the slate decides the story (open issue 1, §7).

### 1.2 Why the reel is shorter than the script's estimate

| Segment | Script (printed clock) | Script estimate, dialogue pass 5 | **Reel** | Reel − estimate |
|---|---|---|---|---|
| Cold open | 0:40 | ≈ 0:44.5 | **0:30.2** | −14.3 s |
| Act One | 4:42 | ≈ 6:11 | **5:41.1** | −29.9 s |
| Act Two | 4:19 | ≈ 4:49.5 | **3:37.4** | −1:12.1 |
| Act Three | 2:18 | ≈ 2:49.5 | **2:28.0** | −21.5 s |
| Act Four | 9:36 (12:31–22:07) | 9:36 on its v5 model, ≈ 8:40 on 5.0's | **8:38.5** | −57.5 s (−1.5 s on 5.0's) |
| Tag | 0:45 | 0:45 | **0:38.4** | −6.6 s |
| **Story** | ≈ 22:20 | **≈ 24:55** | **21:33.5** | **−3:21.5** |

- **The stock takes run faster than the voice guide.** The segment passes slowed the worst to the bottom of their bands, and Kokoro still couldn't reach the guide:
  - Act One's Tasya reads at 196 wpm against a guide of 125–145, and his 47-word lease at 216 wpm.
  - Rima reads at 193 wpm and Gerg at 203 (act1-notes §3.2).
  - The Act Four audit found Tasya over his band on four of six lines (audit-v5-stick §3.1).
- **The printed clocks were generous** where a scene is talk:
  - The Senate plays 74.9 s against 113 s printed, "with the words all there" (act2-notes §5).
  - The cold open's sc 1 plays 14.0 s against 20 s.
- **The staging isn't compressed.** The segment passes kept every written beat, held every text for its read time (0.25 s + 0.05 s a character), and laid the set pieces on their written bar counts.

### 1.3 What could still move it

**Longer.** These add up to about +10 to +20 s of story if all are taken (estimates, not measured):
- Sc 17's phrase 3 is written as 4 bars (10 s) but plays 5.6 s. If the picture holds for MM-05, that's +4.4 s (act2-notes §8.5).
- REMUHCS's lock option adds his spoken question, +3 s (act3-notes §8.6).
- The slower retakes the notes ask for:
  - Tasya's lease at guide pace would be ≈ +6 s by itself.
  - The Act Four audit's gap fixes add ≈ +2–4 s, for example "Is his feed frozen?" from 1.5 s to 2.5–3 s.
- **A later voice layer** read at the guide's paces is the big unknown. The reel holds **565 s of speech** (43.7% of the story), so **every 10% slower talk adds ≈ 57 s.** The script's guide-pace model (24:55) is the ceiling of that case.
- **Outside the story:** the card grows 2 → 4 s if the read-time proposal is taken (assemble-v2-notes §6.1).

**Shorter:**
- **Outside the story:** the chosen outro runs 6.25–15 s against the 12 s placeholder.

---

## 2. Where it may drag (timecodes on the episode clock of `ep01-full-v2.mp4`)

**How to read this.**
- Times are the reel's episode clock, the `EP` clock in the margin. Act Four's act clock is the episode clock minus 12:51.67.
- "No voice" means no voiced word from any line's first word to the last. On-screen text and music may still play.
- A stretch is a place to look, not a verdict.

### 2.1 The places the numbers point to, ranked

| # | When | What plays | The measure | Cuts in §3 that touch it |
|---|---|---|---|---|
| D1 | **9:10.2–9:50.3** | The Senate's sheet and double stamp (15.15–15.18), the whole poster run (sc 16), and the signers (17.01) | **40.1 s with no voice**, the longest in the story: three set pieces in a row, carried by text cards over a temp pad (MM-03 isn't rendered) | #3, #7, #11: −10.5 s, leaving 29.6 s |
| D2 | **5:52.9–6:25.5** | The duel's wordless phrases 3–4 (the post, the scroll across the split), then the pause letter's push | **32.6 s with no voice.** Sc 11 has 8.8 s of talk in 45.9 s (19%). MM-04 isn't rendered | #1: −10 s, leaving 22.6 s |
| D3 | **13:54.7–17:41.0** (pass one, 3:46) | The Blip from the board's side. Mas appears only on their screens | The opposite signal: **the densest talk in the episode**, 38.8–40.6 s of talk in each of minutes 14–16 and 446 words. It's 17.5% of the story, where the POV guide says 12%. The script calls its weight a showrunner ruling. The Act Four insider read found its drag notes in this half, and called the second half (from ≈ 17:46) tight. **But the showrunner has watched Act Four v5 and approved its pacing** | #15, #16, #20, #21, #22 (P2/P3) |
| D4 | **21:23.0–22:08.5** | Act Four's coda images (the nameplate, the shut door, the observer chair: 9.7 s after the memo), straight into the tag | **45.5 s with two words** ("close.", "noted."). Two endings back to back: Act Four's resolution, then a wordless tag | #6: −4.5 s |
| D5 | **10:08.3–10:37.7** | KA-CHING → the crack → the glass → black → the Orb's box, across the Act Two → Three break | 29.4 s with no voice, and 9 s of it is a rooftop-wind stand-in because the bell and SFX aren't laid. **More a sound gap than a length one** (assemble-v2-notes §7.1) | #4: −1 s |
| D6 | **10:44.3–11:08.8** | Run A on the monitor, items 1–3: India on the reused tour poster, the two-letters chyron, the pinky | 24.5 s with no voice. Item 1 retells sc 16's tour 70 s later | #2, #4: ≈ −7.3 s |
| D7 | **2:38.8–3:00.7** | The odometer drill (an S2 set piece, new art in the final) | 21.9 s with no voice. In the stick it's a ladder of text cards | #5: −2.5 s |
| D8 | **3:49.6–4:09.4** | The lanyards → the NopeAI lobby → the check → the freeze card → the pen | 19.8 s with no voice across two scenes | #5: −3.5 s |
| D9 | **12:40.4–12:59.1** | "super." → THE CLOCK's four bars → Las Vegas → the blueprint, across the Act Three → Four break | 18.7 s with no voice. Designed, and Act Four's side of it is approved | none proposed |
| D10 | **1:03.2–1:12.1** | The card and sc 5's first two shots, on bare room tone right after the intro's final hit | Only 8.9 s, but it's the first thing after the title, and the loudness drops 25.6 LU. The assembly flagged it as a possible "random pause" (SHOWRUNNER-NOTES 17). Mostly a sound fix | #8: −1.4 s |
| D11 | **19:16.3–19:30.5** and **20:34.2–20:46.4** | Act Four: the dead stop with Alyi's silent post; the calm-off's long hold with two record posts | 14.3 s and 12.2 s. These are the two wordless stretches the Act Four audit asked a watch to check | #14: −2 s |
| D12 | **6:32.5–6:50.0** | Act One's act-out (the EMIT page, the sheet, Alyi's reflection, black) into Act Two's open | 17.4 s. Designed, with a T (a tension beat) on the act-out | none proposed |

**Two things in this reel make it feel slower than the final will. Weigh them before marking.**
1. **The set pieces are placeholders.** D1, D2, D5, D6 and D7 play as stick figures and text cards over temp pads. The final picture spends its new art on them, so the reel under-sells them.
2. **The mixer ducks the room tone.** It pulls every bed down 10 dB under speech, including the room-tone stand-ins. So in the room-tone scenes (sc 5, sc 9, sc 14), the pauses between close lines fall to about −48 to −51 dBFS: 52 of the reel's 86 holes (assemble-v2-notes §4.3, §7.1).
   - A real room doesn't do that, and the pauses will feel longer than they are.
   - Launch night (sc 5) has 36 of those holes, and the worst sits inside the laptop exchange at 2:21.6–2:24.0.

### 2.2 Talk per minute (all 222 voiced lines, from the timelines)

```
min  0  11.9 s  #####                 cold open (the intro starts at 0:33)
min  1  36.0 s  ##################    launch night
min  2  22.4 s  ###########           the chat, the drill
min  3  22.4 s  ###########           the bill, code red
min  4  29.7 s  ##############        Tasya's lobby
min  5  25.4 s  ############          Sydney, the duel's start
min  6  12.8 s  ######                the duel's end, the pause letter, act-out
min  7  33.4 s  #################     White House
min  8  38.4 s  ###################   Senate
min  9  12.9 s  ######                the stamp, the tour, the signers  (D1)
min 10   8.6 s  ####                  KA-CHING, the Orb, run A           (D5, D6)
min 11  22.5 s  ###########           TIDDER and Gerg's call
min 12  18.9 s  #########             the EO, DevDay, THE CLOCK, Vegas
min 13  19.3 s  #########             THE PLAN, the call, 26A
min 14  40.3 s  ####################  pass one: noon, the post, Rima    (D3)
min 15  40.6 s  ####################  the all-hands, the boardroom      (D3)
min 16  38.8 s  ###################   the rival lab, the lobby, Ttemme  (D3)
min 17  28.0 s  ##############        the statement, the card, 2 AM
min 18  41.8 s  #####################  Gerg at 2 AM, Tasya at the door
min 19  22.3 s  ###########           the avalanche, Alyi's regret, Tasya
min 20  25.2 s  #############         Terb's terms, the lobby sign
min 21  13.1 s  ######                the vault, the memo, the tag  (D4)
min 22   0.7 s                        "noted."
```

### 2.3 Scene map (for marking while watching)

| Scene | Starts | Length | Talk | Words | | Scene | Starts | Length | Talk | Words |
|---|---|---|---|---|---|---|---|---|---|---|
| CO 1 APEC | 0:03.0 | 14.0 | 79% | 32 | | 18 the Orb | 10:23.7 | 22.2 | 17% | 10 |
| CO 2 freeze | 0:17.0 | 5.6 | 13% | 1 | | 19 run A | 10:45.8 | 35.4 | 12% | 14 |
| CO 3–4 rewind, 1993 | 0:22.7 | 10.5 | 0% | 0 | | 20 TIDDER, Gerg's call | 11:21.2 | 36.0 | 50% | 64 |
| INTRO + card | 0:33.2 | 32.0 | — | — | | 21 the EO | 11:57.2 | 30.9 | 46% | 44 |
| 5 launch night | 1:05.2 | 89.9 | 64% | 177 | | 22 DevDay | 12:28.1 | 13.6 | 27% | 10 |
| 6 the drill | 2:35.1 | 35.5 | 8% | 6 | | 23 THE CLOCK | 12:41.7 | 10.0 | 0% | 0 |
| 7 the bill | 3:10.6 | 9.8 | 39% | 12 | | S1 noon, THE PLAN, the call | 12:51.7 | 49.1 | 31% | 52 |
| 8 code red | 3:20.4 | 34.5 | 49% | 50 | | S2 26A, that night | 13:40.8 | 13.9 | 14% | 4 |
| 9 the landlord | 3:54.9 | 71.8 | 43% | 102 | | S3 Friday, board side | 13:54.7 | 88.2 | 67% | 177 |
| 10 Sydney | 5:06.7 | 26.3 | 57% | 45 | | S4 the weekend | 15:22.8 | 138.1 | 62% | 269 |
| 11 the duel | 5:33.0 | 45.9 | 19% | 25 | | card + S5 2 AM | 17:41.0 | 85.7 | 61% | 165 |
| 12 act-out 1 | 6:18.9 | 27.4 | 23% | 20 | | S6 the avalanche | 19:06.7 | 15.6 | 8% | 5 |
| 13 White House | 6:46.3 | 67.8 | 59% | 118 | | S7 Monday, Tuesday | 19:22.3 | 86.5 | 47% | 122 |
| 14 the bridge | 7:54.1 | 10.7 | 42% | 11 | | S8 the lobby and after | 20:48.9 | 41.2 | 32% | 42 |
| 15 Senate | 8:04.8 | 74.9 | 53% | 114 | | 32 tag | 21:30.1 | 25.3 | 3% | 1 |
| 16 poster run | 9:19.8 | 20.0 | 0% | 0 | | 33 button | 21:55.5 | 13.0 | 5% | 1 |
| 17 rooftop | 9:39.8 | 43.9 | 27% | 41 | | outro placeholder | 22:08.5 | 12.0 | — | — |

---

## 3. The ranked cut list

**Ranking.** Cost first (story cost, then production), then seconds saved.
- **Cost levels:**
  - **Low:** no line lost, or only a told-twice item; nothing downstream depends on it.
  - **Low–med:** a joke, a setup or a record item goes, and nothing later needs it.
  - **Medium:** a callback weakens, a character or camp leaves the pilot, or another episode's owner has to act.
  - **High:** a runner, a newcomer fix or several record items go.
- **"+ re-lock"** marks an Act Four cut. The pixel preview is cut to the stick timeline shot for shot and plays on its mix (timing-v5 §0). So an Act Four cut means rebuilding the stick timeline and `mix.wav`, re-running the timing lock and re-rendering the pixel shots it touches, and it needs the showrunner's second look at an act they've already approved.
- **Saves:**
  - **measured:** a whole beat or line as it sits in the reel.
  - **proposed:** a compression amount suggested by a segment pass or by me.
- **Source:**
  - "script #n" is the whole-beat cut list in the script's scene-craft revision log (also open-questions item 2).
  - "A4 #n" is Act Four's 5.1 list (edit-plan-v5 §6).
  - "notes" are the segment handoffs.
  - "this pass" is mine.

| # | Cut | Where | Saves | What it costs the story | Cost | Source | In |
|---|---|---|---|---|---|---|---|
| 1 | **The duel's phrases 3–4 at 2 bars each**, not 4 | 5:58.9–6:18.9 (11.05, 11.06) | **10.0 s** proposed | No line. The real "…still flawed, still limited…" post and the scroll crossing the split (the turn a newcomer retells: the careful memo shipped as a product) get 5 s each, and both read in under 2 s. MM-04 (not rendered yet) plays 12 bars, not 16 | Low | act1-notes §7 | P1 |
| 2 | **Run A's ITEM 1: India on the reused tour poster** | 10:47.8–10:53.2 (19.02–19.03) | **5.4 s** measured | A record item [V], "…totally hopeless to compete with us…" with `(HE LATER SAID: OUT OF CONTEXT)`, and the Orb's reflected look at the correction. It's the tour told a second time, 70 s after sc 16. Run A goes from 12 to 10 bars | Low–med (a record item: the showrunner's call) | script #2; act3-notes §9 | P1 |
| 3 | **The poster run's ITEM 2: NOTERB's "blackmail" stamp** | 9:24.8–9:29.8 (16.02) | **5.0 s** measured | A record item [H] and NOTERB's plate. naming.md lists him as first appearing in Ep1 (Eps 1, 2, 4, 5, 6, 8), and Ep2's script doesn't have him yet, so the registry's first episode moves and a later episode introduces him. The EU's own stamps still carry Gov-Intl for the fairness floor. MM-03 goes 8 → 6 bars | Low–med | script #1 | P1 |
| 4 | **Act Three's holds and merges** | 18.01 (10:23.7) and 18.03 (10:30.5) −1 s each; 19.04 folded into 19.06 (10:53.2); 21.01's two eggs ride 21.02's first second (11:57.2) | **6.2 s** proposed | No line; the eggs stay zero-read. The Act Three stem is timed from the timeline, so it's rebuilt with it | Low | act3-notes §9 | P1 |
| 5 | **Act One's folds:** the check arrives inside the lobby wide (9.02 into 9.01); the pen goes into the freeze (9.05 into 9.04); the drill's kitchen bar (6.03) | 3:58.3, 4:07.6, 2:45.1 | **6.0 s** proposed (−3.5, −2.5) | No line. Keep the pen visible in the freeze: it's a plant for the tag's drawer. The drill goes 14 → 13 bars (MM-16 isn't rendered) | Low | act1-notes §7 | P1 |
| 6 | **The tag's trims:** 32.03 folded into 32.04 (the cover beside his face in the scan's two-shot); one monitor egg; the last black 1.25 → 0.75 s | 21:39.1, 21:30.1, 22:07.3 | **4.5 s** proposed | No line. **Drop the duck, not `CUT LINE`:** the cut line is planted for Ep2 and Ep4 (open question 21). tag-notes §6 proposed keeping the duck | Low | tag-notes §6 | P1 |
| 7 | **The poster run's items 1 and 3 at 3.5 s**, not 5 | 9:19.8, 9:29.8 (16.01, 16.03) | **3.0 s** proposed | No text lost, because the stamps land on beats; the knee stabs move | Low | act2-notes §7 | P1 |
| 8 | **Two small picture trims:** the bullpen wide (5.02) −1.4 s; the scroll pouring out (21.05–21.07) −1.5 s | 1:07.2; 12:20.9–12:28.1 | **2.9 s** proposed | No line. 5.02 also shortens D10's room tone after the intro; keep enough of the wide to set up the home room | Low | this pass | P1 |
| 9 | **The cold open's rewind** | 0:22.7–0:27.7 (3.01–3.02) | **1.0 s** proposed | No line. Two bars on MM-06 become 1.6 | Low | coldopen-notes §6 | P1 |
| 10 | **The laptop flattery:** Mas typing `is anyone there?` and "Brilliant! You're clearly a visionary." | 2:21.6–2:26.8 (inside 5.10) | **4.5 s** measured (the 2.4 s typing gap, the line and its tail) | A joke, and CHATGTP's first flattery of Mas himself (the season's Ep4 seed). "it likes me." (protected) then answers "What a great question!", which is a weaker cue. It also removes the mix's worst room-tone hole (2:21.6–2:24.0). **Keep "What a great question!":** Radnus calls it back at 7:26, and Ep2 runs it as ChatGTP's line | Low–med | script #5 | P1 |
| 11 | **NOTNIH's plate and signature** at the signing table | inside 9:39.8–9:49.8 (17.01) | **2.5 s** (the script's 1 bar; the reel draws phrase 1 as one 10 s beat) | Ep3 recalls his plate, so Ep3 would need its own. MM-03's held pad re-fits | Low–med | script #6 | P1 |
| 12 | **Gerg's question at the TV** ("That's our model in there. You're going after Elgoog with it?") | 4:48.0–4:51.6 (9.10) | **3.6 s** measured | Tasya's real "…we made them dance…" lands with nothing asking for it, and Gerg's point that the landlord's search runs on NopeAI's model goes | Low–med | script #9 | P1 |
| 13 | **The last sentence of Tasya's lease** ("You keep doing whatever it is you do upstairs at night.") | 4:35.0–4:38.4 (9.09) | **3.3 s** measured (word timings) | A whole sentence inside a protected answer: the one words-inside-a-line trim on the script's list. The landlord's knowing wink at Mas's nights goes. The insider read listed Tasya's terms as "long, but earns it" | Low–med | script #10 | P1 |
| 14 | **Act Four's two wordless holds** trimmed ≈ 1 s each | 19:16.6 (S6.06), 20:34.8 (S7.09) | **2.0 s** proposed | No line. Both hold posts for their read time, so there's little to take | Low + re-lock | audit-v5-stick §1 | P2 |
| 15 | **Mario's second call** ("It's Nozama…" to "How much?") | 16:24.7–16:32.2 (in S4.08) | **6.5 s** measured | The joke is already told at 11:15, in sc 19's second phone, which Ep3's rent meters need, so that one stays. The `ELGOOG · UP TO $2B` plate goes, and the insider "will mind" | Low–med + re-lock | A4 #1 | P2 |
| 16 | **The statement's first sentence** ("We look forward to getting to know Ttemme…") | 17:18.7–17:23.5 (S4.13) | **4.8 s** measured (word timings; the list estimated −8 s) | The record's own joke: welcoming the new CEO in the sentence before hiring the old one. The sign carries the welcome. It trims a real line, which then takes an ellipsis | Low–med + re-lock | A4 #2 | P2 |
| 17 | **Sc 11's pre-beat: Kram's crate** | 5:33.0–5:38.9 (11.01–11.02) | **5.9 s** measured | Atem leaves the pilot's story, and the fairness floor loses a camp. Kram stays only on the intro's cage-match poster. The `MODEL WEIGHTS` egg and the duel's two-bar count-in go | Medium | script #7 | P2 |
| 18 | **Sc 10 moved whole to Ep2 (Sydney)** | 5:06.7–5:33.0 | **26.3 s** measured | Sydney (a real Feb 2023 event) and her real line, restored in full in dialogue pass 5, leave the pilot, along with "you've been an extremely good gnib." and the landlord leashing his chatbot. Act Four needs none of it. Ep2's `😊` callback would become her introduction, so **the Ep2 owner has to take it** | Medium (cross-episode) | script #3 | P2 |
| 18a | *Instead of 18:* **Sydney's setup and Tasya's house rule** ("it's 2023, by the way."; "Keep it short, Sydney. House rules.") | 5:11.4–5:13.5; 5:26.0–5:30.3 | **6.8 s** measured | Her real line lands with no date dispute to answer, and the `5` timer carries the leash alone | Low–med | script #8 | — |
| 19 | **Mario's concerns at the White House** (from Sirrah's question to "sub-concerns") | 6:55.9–7:06.3 (13.05) | **10.4 s** measured | Ep3's one season callback, "Adelina, that's a sub-concern." (open question 51), lands cold. Mario loses the one place he talks in full to someone who answers (the naturalness read's keep), and Sirrah loses "Just one?" | Medium (cross-episode) | script #4 | P2 |
| 20 | **Rima's "What should I tell them?" pair**, with Alyi's setup line | 14:44.9–14:53.3 (S3.04) | **8.5 s** measured | Undoes a table-read fix for newcomers: who knows what, and who has to say it. "We'll share more soon." still plays | Medium–high + re-lock | A4 #3 | P2 |
| 21 | **The step-four volley** ("Step four will reveal itself." → "That is the company telling us.") | 15:42.9–15:59.1 (S4.04, S4.06) | **16.3 s** measured | Alyi's register on the weekend (the company will tell us), and Neleh throwing "more soon" back at him. S4.02 has already said the board has nothing to tell Monday, and "Then we'll write step four ourselves." still turns the scene. **Not on the Act Four writer's list:** that owner decides | Medium + re-lock | this pass | P3 |
| 22 | **The rest of the rival-lab call:** the offer, "Eleven pages…", "In plain English: no." | 16:04.1–16:24.7 (S4.08, after #15) | **21.5 s** measured | The (REPORTED) merger offer, the payoff of Mario's careful-memo runner, and Adelina's one line. The board's hunt for a step four then rests on Ttemme alone | Medium–high + re-lock | A4 #4 | P3 |
| 23 | **The hands runner** (run A's items 2–4) | 10:53.2–11:14.9 (19.04–19.10, after #4) | **19.8 s** measured | Act Three's comedy runner and four record items: Sirrah's two-letters chyron [H], the pinky promise [P], and REMUHCS's and NOLE's lines [V]. It's where "everyone in power wants to be regulated" plays out before the EO. Nole is then left in Acts One–Three only in sc 6 and sc 12 | High | act3-notes §9 | P3 |

**Considered and not listed.** Each of these costs more than it saves:
- **Sc 14, the bridge (10.7 s):** RUMPT's repost is half of the fairness floor's balance pair with the clone.
- **Sc 12's standing desk (10.1 s):** Nole's `BUILDING HIS OWN` plate is zAI's only plant.
- **Sc 8's phone insert and lock (5 s):** they say the scene is on his phone, and hand his walk into sc 9.
- **THE CLOCK's first bar (2.5 s):** part of the act-out's T.
- **The Senate's stamp (15.15–15.18):** the Senate is on the never-cut list.
- **Act Four's hourglass (S7.13):** it carries Ttemme's real post and his exit line.

---

## 4. The three packages (cumulative)

### 4.1 P1: about −1:00. Empty time and told-twice items; nothing protected; Act Four untouched

**Cuts #1–#13, −57.9 s.** Story **20:35.6**, which is inside the band, 9.4 s under its centre. Episode 21:19.6.

- **What it keeps:**
  - every never-cut beat;
  - every relationship beat before Act Four;
  - every Act Four frame;
  - every newcomer setup the table reads added.
- **What it costs:**
  - two record items (India, NOTERB's stamp);
  - three small jokes or setups ("visionary", Gerg's TV question, Tasya's last sentence);
  - NOTNIH's plate, so Ep3 needs its own;
  - NOTERB's first appearance moves (a naming.md edit and a later introduction).
- **Talk.** Of the 57.9 s, 11.4 s is talk (#10, #12, #13) and 46.5 s is picture. That's in line with SHOWRUNNER-NOTES 11: cut empty time, not talk.
- **Music.** It re-fits four cues. MM-03, MM-04 and MM-16 aren't rendered yet, and run A's MM-01 is a temp stem, so **re-fitting is cheap now and expensive after the OST renders them.**
- **The drag map after P1:**
  - D1 goes from 40.1 s to 29.6 s;
  - D2 from 32.6 s to 22.6 s;
  - D6 from 24.5 s to about 17 s;
  - D4 from 45.5 s to about 41 s.

### 4.2 P2: about −2:00. P1, plus the script's own whole-beat cuts and the first three of Act Four's

**P1 plus #14–#20, −2:02.3.** Story **19:31.2** (43.8 s under the band's floor). Episode 20:15.2.

- **What it adds to P1's costs:**
  - Sydney moves to Ep2 (the Ep2 owner);
  - Atem leaves the pilot (a fairness-floor camp);
  - Ep3's "sub-concern" callback needs a new plant;
  - one newcomer fix in pass one is undone (#20).
- **In Act Four,** four cuts (#14–#16, #20; −21.8 s) mean a re-lock, a re-mix and a pixel re-render of S3, S4, S6 and S7, plus the showrunner's second look.
- **Pass one** goes from 3:46.3 to 3:26.5.
- **An Act-Four-free alternative, P2-alt (−2:00.3):** P1 + #17 + #18 + #19 + #23 (the hands runner). It never touches the approved act, but it pays with Act Three's comedy runner and its four record items (High) in place of Act Four's four smaller cuts.

### 4.3 P3: about −3:00. P2, plus pass one's weight and Act Three's runner

**P2 plus #21–#23, −2:59.9.** Story **18:33.6** (1:41.4 under the band's floor). Episode 19:17.6.

- **Pass one** comes down to ≈ 2:49, which answers the script's open question of whether the exit still weighs too much against his side.
- **Act Three** comes down to ≈ 1:55: the Orb, run A without its runner, Gerg's call, the EO, DevDay and THE CLOCK.
- **What it adds:**
  - the rival-lab call and the payoff of Mario's runner;
  - Alyi's weekend register;
  - the hands runner and its record items.
- **It only makes sense** if the showrunner wants a shorter pilot than the format allows, or if a slower voice layer puts the story back near 24–25 minutes.

### 4.4 The packages by segment

| Segment | Now | P1 | P2 | P3 |
|---|---|---|---|---|
| Cold open | 0:30.2 | 0:29.2 | 0:29.2 | 0:29.2 |
| Act One | 5:41.1 | 5:12.3 | 4:40.1 | 4:40.1 |
| Act Two | 3:37.4 | 3:26.9 | 3:16.5 | 3:16.5 |
| Act Three | 2:28.0 | 2:14.9 | 2:14.9 | 1:55.1 |
| Act Four | 8:38.5 | 8:38.5 | 8:16.7 | 7:38.9 |
| Tag | 0:38.4 | 0:33.9 | 0:33.9 | 0:33.9 |
| **Story** | **21:33.5** | **20:35.6** | **19:31.2** | **18:33.6** |

**The limit without Act Four.** Using everything on this list except Act Four (P1 + #17, #18, #19, #23), the cold open to Act Three and the tag give −2:00.3. After that, the next cuts hit the never-cut list or the fairness floor:
- the button, Alyi's count, the class photo, the Senate, the sheet and KA-CHING, the Orb, Gerg's call, the tag's button;
- the bridge's balance pair, zAI's plate.

So **any −3:00 package takes about 50 s or more from Act Four.**

---

## 5. How a package would be applied (for the pass that makes the cuts)

1. **The script first.**
   - Cuts in the cold open, Acts One–Three and the tag are edited in `show/episodes/ep01/script.md` with the Edit tool, re-reading the file first.
   - **Never edit its `## ACT FOUR` section:** Act Four's cuts (#14–#16, #20–#22) go to the Act Four owner, who edits it and its edit plan.
2. **The timelines.**
   - Each segment's builder and set plan, re-run the way its notes' §2 says: `audio/reel/ep01-<seg>-v2/`, and act2's `set_plan.py`.
   - Nothing needs re-recording, since every cut is a whole line or picture. The one exception is #16, where Tasya's statement needs its first sentence removed from the take, or a new take of the second sentence alone.
3. **The stems.** The cold open, Act Three and tag stems are timed from their timelines, so rebuild each stem with its timeline (coldopen-notes §5.2, act3-notes §2, tag-notes §5.2).
4. **The music.** MM-03, MM-04 and MM-16 get re-fitted to the new bar counts before they're rendered (the OST owner).
5. **The render.**
   - Run `node src/reel/tools/episode.mjs ../show/reel/ep01-full/ep01-full-v2.manifest.json` through `ops/heavy.sh`, in the background (assemble-v2-notes §2).
   - Only the changed chapters re-render (cached by content). About 14 min from cold at `--jobs 2 --conc 2`.
6. **Act Four,** if a package touches it:
   - `audio/reel/ep01-act4-v5/build_timeline.py`, then `bed.py` for `mix.wav`;
   - then the timing lock (`studio/src/episodes/ep01/act4/animatic/tools/lock_v5.py`) and the lipsync;
   - then the pixel renders of the sequences touched;
   - then the showrunner's second look.
7. **The other owners:**
   - Ep2's owner for #18, and for NOTERB's first appearance (#3);
   - Ep3's owner for #11 and #19;
   - `show/bible/naming.md` for NOTERB's first-episode field (#3);
   - the fairness floor for #17.

---

## 6. How these numbers were made

**Sources:**
- the five v2 segment timelines in `show/reel/ep01-full/` and `show/reel/ep01-act4-v5.json`, which give each beat's `reelDur`, each line's `t` and `dur` inside its beat, and word timings;
- the chapter starts in `out/ep01/reel/ep01-full-v2-chapters.json`;
- the assembly's measurements in `out/ep01/reel/ep01-full-v2-dialogue.json`, `-levels.json` and assemble-v2-notes §4;
- the transcript, [transcript-v2.txt](transcript-v2.txt).

**Method:**
- **Episode time** = the chapter start + the sum of the earlier beats' `reelDur` + the line's `t`.
- **"No voice"** runs from one line's last word to the next line's first, across every chapter. Act Four's lines are included (the assembly's §4.2 list left them out, because its mixer doesn't lay them), which is why D9 and D11 appear here and not there.
- **"Measured" savings** are the beat's or line's span, plus its gap to the next line.
- **Word-level cuts** (#13, #16) use the take's word timings.

Nothing was decoded, rendered or played: this is arithmetic on JSON, a few seconds of CPU. The two scripts are in the session scratch (`scratchpad/ep1s-length/density.py`, `lines.py`), which may not last, so here's the core of `density.py` for a re-run from the repo root:

```python
import json
R = 'show/reel/'
segs = [('coldopen', R+'ep01-full/ep01-coldopen-v2.json', 3.0), ('act1', R+'ep01-full/ep01-act1-v2.json', 65.167),
        ('act2', R+'ep01-full/ep01-act2-v2.json', 406.25), ('act3', R+'ep01-full/ep01-act3-v2.json', 623.667),
        ('act4', R+'ep01-act4-v5.json', 771.667), ('tag', R+'ep01-full/ep01-tag-v2.json', 1290.125)]  # starts: -chapters.json
tc = lambda s: '%d:%05.2f' % (s // 60, s % 60)
speech = []
for name, f, st in segs:
    t = 0
    for b in json.load(open(f))['beats']:
        if b.get('act') == 'CREDITS':
            t += b['reelDur']; continue
        print(f"{tc(st+t)} {b['reelDur']:6.2f} {b['id']:>10} {b.get('frame','')[:50]}")   # the beat map
        for l in b.get('lines', []):
            speech.append((st+t+l['t'], st+t+l['t']+l['dur'], l['who'], l['text']))
        t += b['reelDur']
prev = 3.0
for a, e, who, text in sorted(speech) + [(1328.5, 1328.5, '', 'END')]:
    if a - prev >= 12: print(f'no voice {tc(prev)} -> {tc(a)} {a-prev:5.1f} s, then {who}: {text[:40]}')
    prev = max(prev, e)
```

---

## 7. Measured, needs a person, and open issues

| Measured here | Needs a person |
|---|---|
| The story and episode lengths against the frame (§1); every stretch without a voice; talk per minute; every scene's length, talk share and words (§2) | **Watching the reel and marking the drag.** This report only says where the numbers point |
| The seconds each cut saves, from the timelines and word timings (§3) | Whether each cut's cost is worth it: that's the showrunner's call, and for #2, #3 and #16 it's a record item |
| The package totals and the resulting act lengths (§4) | The newcomer and insider reads after any cut: does the story still hold for someone who doesn't know the week? |

**Open issues:**
1. **Which band governs, now that the outro is short?** The format's 22:00 assumed 43 s of credits. With a 6–15 s outro, a 20:45 story runs 21:23–21:32. The format owner should restate the frame, either as a story band alone or as a runtime band with the new overhead. This report measures against the story band.
2. **The voice layer decides the final length more than any cut here.** At the stock takes' pace, P1 is enough. If a later layer reads at the guide's paces, the story grows by up to ≈ 3:20 (§1.3), and P2 or P3 comes back into play. Time one real scene with the candidate layer (sc 9's lease, or pass one's S4) before choosing a package bigger than P1.
3. **Fix the room-tone duck before judging the talk scenes' pace** (§2.1, and assemble-v2-notes §7.1 item 1). Otherwise sc 5 and sc 9 may be marked for drag that is really the mix.
4. **Act Four's approval stands** unless the showrunner reopens it. P2 and P3 reopen it, and P2-alt doesn't.
5. **A correction to tag-notes §6:** if one of the tag's monitor eggs goes, drop the duck and keep `CUT LINE`, which is planted for Ep2 and Ep4 (open question 21).
6. **Scratch:** `scratchpad/ep1s-length/` (the two scripts and their line listings). Nothing is needed from it to act on this report.
