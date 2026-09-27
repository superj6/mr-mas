# Ep1 v3: the script pass notes (`v3-script`, 2026-09-27)

> **Status: DONE, for the lead's review.** It covers script draft 6, the six beat plans, and these notes.
>
> **Nothing here was recorded, timed, heard or watched.**
> - Every length is planned from word counts, the sample's takes and the v2 timelines' measured beat lengths.
> - The v3 stick lock sets the frames.
> - Nothing was committed.

**The files:**
- **The script:** [show/episodes/ep01/script.md](../../script.md), draft 6. The revision log is at the top. Draft 5 is in git at `95ebc0e`, and its pass history is kept at the end of the file.
- **The beat plans** (the hand-off contract, [PLAN §2](PLAN.md#2-the-beat-plan-s1--s3-p1-p2-a1)): [beat-plan/](beat-plan/) `coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`.json. Every file passes `python -m json.tool`.
- **The builder:** [beat-plan/_build_beatplan.py](beat-plan/_build_beatplan.py). The beat plans are generated from its edit spec, and it checks the spec against the source timelines:
  - every source beat appears exactly once;
  - every dropped line exists;
  - the V.O. is placed in episode order.

  **To change a beat plan, edit the spec and re-run it; don't hand-edit the JSON.**

**To re-run** (it only reads the v2 timelines, and it writes only `beat-plan/*.json`):

```
python3 show/episodes/ep01/production/full-v3/beat-plan/_build_beatplan.py           # validate + runtime table + the V.O. list
python3 show/episodes/ep01/production/full-v3/beat-plan/_build_beatplan.py --write   # rewrite the six JSON files
```

**Beat-plan fields beyond PLAN §2** (all additive):
- **Lengths:** `src_s` (the v2 beat's `reelDur`) and `est_s` (the planned v3 length).
- **Source links:** `src_frame`; `cut_ref` (C1–C17).
- **Extra cut notes:** `lcut` (`over_s`); `vo_map` on a kept take that is now in the V.O. map; `moved_from` on a line that moved beats.
- **Line entries:**
  - dropped lines are listed as `keep: false`, with the text and the reason;
  - every V.O. entry has `kind`, `delivery`, `take` and, for predictions, `pays_off`.
- **Placement strings:**
  - `vo.at` is `start+S`, `after:<line id>+S` or `before:<line id>-S`;
  - a new line's `after` is a line id, or `start+S` when it opens the beat.
- **Badges:** side badges are listed under `onscreen.drop` as `side badge: …`, with `side_badge: removed`.

---

## 1. Runtime

### 1.1 Per segment (story time: the intro, the card and the outro are episode time)

| Segment | v2 story | Whole beats cut | Trimmed inside kept beats | Added (arrivals, holds, V.O., lines) | v3 estimate | Change |
|---|---|---|---|---|---|---|
| Cold open | 0:30.2 | −0.0 | −0.0 | +0.5 | 0:30.7 | +0.5 |
| Act One | 5:59.7 | −60.5 | −10.0 | +34.1 | 5:23.3 | −36.3 |
| Act Two | 3:39.8 | −7.2 | −20.8 | +10.8 | 3:22.6 | −17.2 |
| Act Three | 2:33.7 | −37.8 | −0.0 | +11.0 | 2:06.8 | −26.8 |
| Act Four | 8:38.5 | −24.0 | −8.5 | +34.7 | 8:40.6 | +2.1 |
| Tag | 0:40.6 | −7.0 | −1.3 | +1.5 | 0:33.9 | −6.7 |
| **Story** | **22:02.4** | **−2:16.5** | **−0:40.6** | **+1:32.6** | **20:37.9** | **−1:24.5** |

- **The episode runs about 21:20:** the story, plus the 30 s intro, the 2 s filename card (C17; it was 4 s) and the Orb outro (the outro pass sets its length, 6–15 s).
- **Against the target:**
  - The v3 target is about 20:10, and 19:45–20:45 is fine. **20:38 is inside the band, in its top half.**
  - The cuts match v3-plan §3 (≈ 2:57).
  - The reinvestment is larger than v3-plan §4's 1:05, because 24 V.O. lines can't all ride in the existing gaps. About 35 s of the additions are voice time.
- **Act Four comes out level (+2 s).** Its four cuts (C13–C16, −31 s) paid for its arrivals and holds, the sample's longer aftermaths, and seven voice lines.

### 1.2 How the estimates were made

- Each kept beat starts at its v2 `reelDur`.
- **A V.O. line adds its sample take's audible length** where one exists. A new line is estimated at about 2.4 words a second, the guide's 110–130 wpm, plus the gap its placement asks for.
- **Arrivals and holds** add what the beat plan says.
- **Where a line fits a hold that was already there,** nothing is added (for example, "it does." in 9.09).
- **Merged beats** count once, in the beat they fold into.
- **What the lock will move:**
  - the takes;
  - the J-cuts, which overlap sound and save picture;
  - the outro, which isn't counted.

### 1.3 If the lock runs long: optional trims, ranked by what they cost (≈ −24 s → about 20:14)

| # | Trim | Saves | Costs |
|---|---|---|---|
| T1 | S5.08: Gerg's "That'll be the share sale. Everybody's been waiting on that one." (the check reads itself: `PAY TO: NOPEAI STAFF` · `MEMO: STAFF SHARE SALE` · `VOID IF CEO MISSING`) | 2.3 s | a little of Gerg's chatter after "He did both." |
| T2 | 21.02: the second deepfake ("And no paperwork, folks. None at all.") | 2.8 s | one step of the escalation |
| T3 | 20.06: "Rima's going to wake up to forty emails about it." | 3.0 s | Rima's only mention between launch night and Act Four |
| T4 | 11.04: the duel's phrase 2 at 3 bars | 2.5 s | the napkin's reveal is quicker |
| T5 | 9.09: Tasya's lease speech to its first and last sentences (the insider read's note) | 6.0 s | "the floors warm", which sits over sc 6's red-hot GPUs |
| T6 | S2.02–S2.04: the TPOOL flash (the carve, "i don't keep score." and the Orb's count stay) | 4.8 s | marks 1–2 stay unexplained until a later episode (the flashback-map owner decides) |
| T7 | v3-vo-22 ("he's typing like it's launch night.") | 2.3 s | the reason he asks "what are you building?" |

**Not on the list, on purpose:**
- Mario's sub-concerns (v3-plan §3 protects them).
- Neleh's "He's been in the building for hours…" (the newcomer needed the return talks).
- Any arrival or hold, which is what note 1 asked for.

---

## 2. Mas's inner voice: the map

### 2.1 Counts

- **24 lines, 185 words, in seven rooms** (v3-plan's range is 15–25 lines, 200–300 words, in 4–6 clusters). The bends are in §2.4. Against v2's 3 lines and 9 words.
- **Kinds:**
  - reads: 4;
  - predictions: 3 (all paid, and the budget read is wrong);
  - warmth: 5;
  - gap: 6;
  - effort: 2 ("i'll turn when he finishes the sentence." and the reply strip);
  - count: 1;
  - caught: 3.
- **Caught by the picture or events:** 4 of 24, about 17%, under the guide's quarter: the three caught lines plus the budget read.
- **Takes needed:**
  - **the sample's 10 are reusable** (`audio/ep01/v3-sample/vo-v2/`, `v3s-01`–`v3s-11` except `v3s-07`);
  - **2 are v2 takes, kept unchanged** (`e1-a3-18-04`, `a5-26a-01`);
  - **12 need new takes:** v3-vo-08, 09, 10, 11, 12, 13, 15, 16, 17, 18, 22, 24. v3-vo-18 extends v3s-07, so re-record it whole.

### 2.2 Every line, where, and what it does

| Id | Line | Where (beat) | Room / cluster | Kind | Placed | What it does |
|---|---|---|---|---|---|---|
| v3-vo-01 | gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first. | 5.02 | 1 · launch night | read | start+1.2, over the held wide | introduces all three by what they want; the plates become names |
| v3-vo-02 | she'll go for three. | 5.03 | 1 | prediction | after Rima's "Twice." | paid at 5.07: her third underline |
| v3-vo-03 | she's right. it will break. i don't know which part yet. | 5.04 | 1 | gap | after "what do we tell them?", before "it's a preview." | the honest thought, then the public line |
| v3-vo-04 | alyi asks that about everything we build. he means it every time. | v3-5.06b (new) | 1 | warmth | held on Alyi in the glass | the trust Act Four breaks |
| v3-vo-05 | i know. i still read it twice. | 5.11 | 1 | gap | after "It called my variable names inspired." | he wants to be liked, and admits it only here |
| v3-vo-06 | someone noticed. | 6.01 | 1 (the drill) | read | start+1.2 | replaces v2's caught "nobody noticed." |
| v3-vo-07 | mostly the bill. | 7.01 | 1 (the bill) | gap | after "it's the bill.", held 1.8 s | plants "mostly." (S5.05) |
| v3-vo-08 | eleven keys. he's here for the twelfth. | 9.04 (the freeze) | 2 · the lobby | prediction | inside the full freeze, as he pockets the pen | who Tasya is to him; paid at 9.10 by a twelfth, beige key |
| v3-vo-09 | it does. | 9.09 | 2 | gap | in his hold after "That collar suits you." | vanity inside; business outside ("and the rent?") |
| v3-vo-10 | mario used to sit where gerg sits. he left to build a careful one. | 11.03 | 3 · the duel (an introduction) | warmth | start+0.8, before Mario's first line | who Mario is to him: ex-colleague, careful rival. The plate is his name |
| v3-vo-11 | four companies, one table. radnus has been rehearsing something since the lobby. | 13.01 | 4 · the White House | read | in the arrival | orients the room; Radnus's congratulation then sounds rehearsed |
| v3-vo-12 | he's not wrong. | 13.09 | 4 | gap | after Radnus's barb, before "how's the dancing?" | he concedes inside, then says the knife |
| v3-vo-13 | i'll turn when he finishes the sentence. | 13.11 | 4 | effort | as three heads turn to the president | the calm as a skill; the photo shows it |
| v3-vo-14 | i made it for everyone else. | 18.06 | 5 · the dark room | caught | kept take | the Orb fits the outline kept for years |
| v3-vo-15 | gerg types louder when he's happy. he's been happy since november. | 20.06 | 5 | warmth | after "When it compiles.", over his keys | plants 2 AM's "His keys stop." |
| v3-vo-16 | thrilled is too much. enthusiastic is a lot. | 22.02 | 5 | effort | over the reply strip, before the tap | "super." chosen from three: the effort shows once (mas-inner-voice §4.11). It makes noon's `[super] [super] [super]` read |
| v3-vo-17 | the race is tomorrow. the board wants noon today. | S1.01 | 6 · Vegas, noon | read | in the arrival | why Vegas; the board's ask, stated as logistics |
| v3-vo-18 | gerg's not on it. alyi set it up. probably just the budget. | S1.06 | 6 | gap (the one wrong read) | over JOIN, after THE PLAN | he notices, and explains it away; then silence through "super." |
| v3-vo-19 | i don't keep score. | S2.01 | 6 · that night | caught | kept take | the carve; the Orb counts |
| v3-vo-20 | four hundred and six. four hundred and seven. four hundred and six. | S5.03 | 7 · 2 AM | count | over the hearts | **the first inner words since the board's side: we're back with him.** He loses count |
| v3-vo-21 | gerg. he'll say he's compiling. | S5.09 | 7 | prediction | as the tile rings | paid by "Sorry, one sec. I've got a build compiling." |
| v3-vo-22 | he's typing like it's launch night. | S5.09-back | 7 | warmth | over the keys, before "what are you building?" | motivates the question; recalls v3-vo-15 |
| v3-vo-23 | gerg never waits to be asked. | S5.09-back | 7 | warmth | after "Just in case." | the bible's planted line; the board said it on Friday |
| v3-vo-24 | it looks calmer than me. | 32.03 | 8 · the tag (a coda line) | caught | as he holds up the cover | the picture shows them identical: the calm is something he does |

### 2.3 Where he's silent, on purpose

- **The cold open and the intro.**
- **The hearing (sc 15),** a government proceeding.
- **The tour (sc 16),** the EU threat and retreat, a real exchange. C7's "Mas's voice carrying the flip" is read as his own post.
- **The rooftop (sc 17):** the crack is bigger than a line.
- **The Tidder post and its edit (sc 20),** a credibility moment.
- **From the JOIN click through "super."** (S1.06 → S1.12).
- **The whole board's side** (S3–S4.15).
- **"alyi voted." / "He did both."** Another person's real act, and it hurts him.
- **Tasya's door and "leave it open.",** a contested real moment.
- **The return (sc 30):** Alyi's regret, Tasya's podcast line and the terms are all real acts or a real negotiation.
- **Over every other character's sincere beat:** Rima's question, Alyi's count, Mario's cost, Neleh's blank line, Gerg's look.

### 2.4 The corny test (mas-inner-voice §8), and the bends

- **Every line was read against the test's six questions:**
  1. Would it work as a post, a tagline or a fridge magnet?
  2. Does it tell us what we just saw?
  3. Does it name a feeling?
  4. Does it wink at the real events?
  5. Is it the third caught line in a row?
  6. Could a newcomer follow the scene better with it?

  **What the lines do:**
  - No line names a feeling; the closest are "happy" and "calmer", both said about something else.
  - The caught lines are spread across the episode, never two in a row.
  - Six lines tell a newcomer who someone is or why we're somewhere: 01, 08, 10, 11, 17, 20.
- **The lines that came closest to failing, and why they stayed:**
  - **"it does."** (v3-vo-09): a two-word button shape. It stays because it's his vanity against business, and it sits in a hold that is already his. Cut it if a table read hears a sitcom beat.
  - **"i'll turn when he finishes the sentence."** (v3-vo-13): risks explaining the photo. It stays because the photo then shows the choice, not the reason.
- **Rejected candidates** (so nobody tries them again):
  - "tasya doesn't invest. he moves in." (a fridge magnet)
  - "radnus says sorry when other people bump into him." (a post)
  - "he's scared. he's being nice about it." (explains Radnus's line)
  - "the sign's crooked." (a double meaning at a contested moment)
  - "noon on friday. i'll be in vegas." (weakens the act-out's silence and duplicates v3-vo-17)
  - "everyone packed. nobody went." (a feeling about the staff's real act)
  - "mario still sends me his drafts." (an invented private relationship)
  - "i keep things." (a confession, and a wink at the fallback)
- **Bends from the guide, noted:**
  1. **Words: 185 against 200–300.** The sample set a terse register, and every longer version tried failed the test. **If the lead wants more,** the strongest candidates are:
     - a third lobby line in the weeks-on wide (9.10), a read of Gerg rather than of Tasya;
     - a fuller tag cluster (32.07, the framed badge);
     - the rooftop's one warmth line about Mario, which sc 11 now carries.
  2. **Clusters: seven rooms, two with a single line** (the duel's introduction of Mario and the tag's coda), against "4–6 clusters of 3–6". **Launch night runs seven lines across sc 5–7,** one sequence in one room (five in the argument, two in the drill and the bill). v3-plan §5 asks for one line of his voice the first time we meet someone, and that is what the duel's single line is. The tag's line closes the episode inside his head.

---

## 3. The cuts (C1–C17), as applied

| # | Beats | Saved (story) | Decision |
|---|---|---|---|
| C1 | act1 10.01–10.04 (Sydney) | 29.9 s | **Applied. Fix:** her tick counted in the duel, so 9.13 now holds on Gerg's closed laptop and **match-cuts** into 11.01, where the same laptop opens at the GTP-4 demo, led by the Build. Ep2 takes Sydney's scene and real line. |
| C2 | act1 11.02 (Kram's crate) | 10.3 s | **Applied.** 11.01 is repurposed as the duel's arrival (+1.4 s); the `MAR 14, 2023` rail moves there. |
| C3 | act1 11.05, 11.06 at 2 bars each | 10.0 s | **Applied.** |
| C4 | act1 12.03 (the EMIT page) | 4.7 s | **Applied. Fix:** the cut back to his desk is led by the pen's scratch, and Alyi's reflection reads the pause letter on his phone (the public page, still dry, no score). |
| C5 | act1 6.03, 6.05, 6.07 | 8.4 s | **Applied.** `DEC 5, 2022` moves onto the legible million (6.06, +0.7 s). Nole's post (6.04) stays: Gerg hearts it and Rima un-hearts it, which is character business. |
| C6 | act1 9.02 → 9.01, 9.03 → 9.01, 9.05 → 9.04 | ≈ 5 s net | **Applied.** The check must be legible at lobby-wide scale (a new drawing, §7). |
| C7 | act2 16.01 + 16.05 → one poster | 12.0 s | **Applied.** "blackmail" and NOTERB go. The flip is carried by his own post; a V.O. would sit on a contested real moment. |
| C8 | act2 15.08, 15.09; the clone's "Are you nervous?"; 15.03 trimmed | 7.6 s | **Applied.** One clear exchange: the clone takes the chairman's card. |
| C9 | act2 17.01 | 4.0 s | **Applied.** NOTNIH signs unplated. |
| C10 | act3 19.02–19.10 | 28.5 s | **Applied,** with the `catching up: 7 weeks` toast. The "hopeless" fairness issue goes with it. Item 5 (Mario's second phone, Nozama) stays: it is Ep1's Misanthropic roast and the joke C14 relies on. |
| C11 | act3 21.06, 21.07; plus 21.01 | 9.3 s | **Applied and extended (judgement).** The lightning manifesto egg (21.01) is a reference nobody reacts to, so it goes too; Neleh's paper egg moves into 21.02's bezel. **Payoff fix:** Nedib's "Longer than that. I've got a big desk." and Mario's "How much longer?" (13.13) go, because both of their payoffs are cut. "Put it in writing. Longer." stays, answered by the order running off both ends of the desk in 21.02. |
| C12 | tag 32.06, 33.03; the eggs in 32.01; the prompt in 33.01 | 7.8 s | **Applied.** The flat glass moves into the "noted." frame (33.04). The drawer's pin pays off in its own scene (the extinguisher works because the pin is out). |
| C13 | act4 S4.04, S4.06 | 16.3 s − 3.3 s | **Applied, with a sliver.** "That is the company telling us." moves into the S4.02 wide after the first phone goes over the edge, so THE PLAN's "Not the other way round." still turns. |
| C14 | act4 S4.08's second call | 6.5 s | **Applied.** The `NOZAMA` caller ID and the rent meters' text go too. |
| C15 | act4 the statement's first sentence; S4.13c | 6.0 s | **Applied.** The second sentence is a new line id, v3-a4-0001; its words are the record's. |
| C16 | act4 S5.01 (the card); trims | 1.75 s + 1.0 s | **Applied.** "The two wordless holds" was ambiguous, so the trims are taken from S1.04 and S2.03, whose texts got shorter. **The door back is now sound:** the dark room's drone under Mada's held note, then the V.O. count. |
| C17 | the filename card, 4 s → 2 s | episode time | **Applied** in the script. The card is the manifest's, not a beat plan's. |

---

## 4. On-screen text: every change

- **Removed everywhere:**
  - the side badges (`HIS SIDE`, `THE BOARD'S SIDE`) on every Act Four beat, listed per beat in `act4.json`;
  - the `WHAT THEY DIDN'T KNOW` card;
  - the stick reel's scaffolding labels (`THE CHECK · JAMMED IN THE REVOLVING DOOR`, `COLLAR #3`).
- **Plates cut to names:**

  | Was | Now |
  |---|---|
  | `GERG MOCKBRAN · CO-FOUNDER` | `GERG MOCKBRAN` |
  | `RIMA TAMURI · CTO` | `RIMA TAMURI` |
  | `ALYI · CHIEF SCIENTIST` | `ALYI` |
  | `NOLE · EARLY FUNDER` | `NOLE` |
  | `MARIO · EX-NOPEAI · THE CAREFUL RIVAL` | `MARIO` |
  | `OIGNEB · AI PIONEER · CITATIONS: ↑` | `OIGNEB` |
  | `LAHTNEMULB · OPENED WITH A CLONE` | `LAHTNEMULB` |
  | `ADELINA · MARIO'S CO-FOUNDER` | `ADELINA` |
  | `TTEMME · RAN A STREAMING SITE` | `TTEMME` |

- **Gag plates trimmed:** `RADNUS · RUNS ELGOOG · POLITELY ON FIRE` → `RADNUS · POLITELY ON FIRE`; `NOLE · EARLY FUNDER · BUILDING HIS OWN` → `NOLE · BUILDING HIS OWN`.
- **Repeat plates cut:** `RIMA TAMURI · HIS CTO`, `MARIO · RUNS THE RIVAL LAB`, `TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS`, `NOTNIH · WORRIES FULL-TIME.`, `MISANTHROPIC · MARIO'S LAB` (the lighthouse's own sign replaces it), `NOTERB · ENFORCES THE RULEBOOK.`
- **Rails and labels:**
  - `RAIL: JAN 23, 2023 · ~$10B` → `RAIL: JAN 23, 2023`
  - `RAIL: OCT 30, 2023 · EO 14110` → `RAIL: OCT 30, 2023`
  - `RAIL: TPOOL, HIS FIRST COMPANY · TWO STAFF REVOLTS` → `RAIL: TPOOL, HIS FIRST COMPANY`
  - `RAIL: TESTIFIES HE HAS NO EQUITY`: cut (he says it)
  - `— COMPUTEX, MAY 29`: cut
  - `EQUITY: 0 (HE TOLD THE SENATE)` → `EQUITY: 0`
  - `MACROSOFT · ~$10B IN` → `MACROSOFT · BILLIONS IN`
  - the check's `~$10B` → `$ MULTIBILLION`
  - `NEWS ALERT` → `ELGOOG · CODE RED`
  - the arrow tag `ALYI / CO-FOUNDER` → `ALYI`
  - the nameplate `YRRAL (NOT THAT YRRAL)` → `THE OTHER YRRAL`
  - the tour strip's `…ON THE EU'S DRAFT AI RULES` → `…ON THE EU'S AI RULES`
  - the `catching up: 7 weeks` toast: cut
  - the tag's monitor eggs and `UI: Look at glass of water`: cut
  - the Q\* rail: gone (the Act Four v5 timeline had already dropped it; draft 6 matches)
- **Kept, as the show's style:**
  - the gag cards: TASYA, SIRRAH, NEDIB, SUCRAM, NESNEJ, THE ORB, NELEH, TERB;
  - the product plates: `CHATGTP · USERS: 0`, `CLOD 1 · SAME DAY`;
  - the date rails;
  - the world's own UI and signs (the tent card, `⚠ ALTERED AUDIO`, the call's notices, `MADA · LAST FIRER STANDING`).

---

## 5. Judgement calls

1. **Sc 13 keeps two gag cards,** Sirrah's and the president's, 45 s apart. Both are entrances, and a newcomer learns who each one is from them. That bends v3-plan §5's "at most one per scene".
2. **The equity line is now spoken:** "…i have no equity in nopeai." [P, facts L22], replacing the fact rail. It plays after Sucram's "That proves nothing. Partially.", so the critic's doubt never lands on the record, and the record has the last word. It plants Act Four's `EQUITY: 0`, which is why the blueprint drops `(HE TOLD THE SENATE)`.
3. **Tasya volunteers "don't worry about us" (S7.02)** instead of Mas asking an interviewer's question (the insider read). The real podcast line then answers him. Mas stays silent and looks down at the floor, and "Hello." still lands.
4. **Terb loses "so nobody's surprised"** (the insider read).
5. **"gerg's not on it."** joins the wrong read. The JOIN screen must show the invite's four attendee icons (S1.02, S1.06). This promotes the cold open's egg (no green circle) to story: he notices, explains it away, and is wrong. **It needs a new take.**
6. **The DevDay strip is the episode's one hover** (22.02); at noon (S1.11) the phone offers only `[super] [super] [super]`, and he taps at once. The contrast makes the noon "super." read as the word he already chose.
7. **Launch night now has music under the talk:** the Build in a major colour. v2 had none (v3-plan §6: warm, giddy).
8. **The lobby's music is THE JOB swing, not LEVERAGE** (v3-plan §6). LEVERAGE is saved for the noon call and the terms.
9. **Sc 12:** with the EMIT page gone, Alyi's reflection reads the pause letter. It still plays dry and implies no motive (the facts critic's 2026-09-26 reasoning holds).
10. **The Computex dateline is dropped.** The line was said on May 29; the show stages it at the May 30 table. That is a day's compression and claims no motive.
11. **Kept as small eggs, with no hold:** the `IOU: 20% COMPUTE` note (Ep2 pays it off) and Ttemme's `F` spam.
12. **The TPOOL rail keeps "HIS FIRST COMPANY".** It orients the flash as a place, and it isn't a truth label.
13. **Plates keep the name** at a principal's first appearance, as the sample did, because a pixel frame gives a newcomer no other way to learn a spelling.
14. **The camp matrix** (guardrails §2b, Ep1): cutting Sydney leaves Macrosoft's roast resting on the landlord (the key ring, "made them dance", "below them, above them, around them", the observer chair). Cutting the hands runner takes Sirrah's "two letters" out of the balance column. The balance pair (RUMPT's silhouette reposting the altered clip ↔ the NEDIB deepfakes) and Sirrah's blocks stay, so the balance holds. **The guardrails owner updates the matrix row.**
15. **The runtime lands at 20:38, not 20:10.** The voice is the showrunner's newest note, so the pass kept the voice and the arrivals, and listed trims (§1.3) instead of cutting further on paper.

---

## 6. Open questions (for the lead, the guardrails owner and the facts owner)

1. **v3-vo-18, "…probably just the budget."** It gives his inner state the moment before a contested real event. The sample already did this, and v3-plan §2.2 names the line. It claims only that he didn't expect it, which matches the public reporting that he was blindsided. **Guardrails owner:** confirm. Fallback: "gerg's not on it. alyi set it up." and silence.
2. **The White House cluster (v3-vo-11–13)** is inner voice at a government meeting. All three lines read invented beats (the seating, Radnus's barb, the door). **Guardrails owner:** confirm. Fallback: keep 11, cut 12 and 13.
3. **v3-vo-10, "he left to build a careful one."** It characterizes a real departure by its public, stated reason. Fallback: the first sentence alone.
4. **v3-vo-17, "the race is tomorrow."** Facts #46 has "the F1 weekend" [V]. **Facts owner:** confirm that the Grand Prix itself ran on Saturday, Nov 18, and add the row v3-plan §10 asked for.
5. **`$ MULTIBILLION` on the check:** the company's own word in the amount box. **Facts owner:** confirm it reads as the quote's word, not a figure.
6. **ALYI on the letter:** facts L4 already sources the signature [V]. v3-plan §10's request looks satisfied. **Facts owner:** confirm, so nobody adds a duplicate row.
7. **Sydney in Ep2:** the Ep2 script owner picks up her scene and real line (it went through the Act One fix passes: all four sentences, source order).
8. **Tasya's lead-in (v3-a4-0002)** frames a real podcast answer as volunteered. **Guardrails owner:** confirm.
9. **The word count** is under the guide's band (§2.4). **Lead:** keep it terse, or ask for the candidate lines?
10. **Inherited open questions still stand** (the numbered list in the script's history notes, §7): 23 (the invite's compression), 52 (Gerg's reading of the post), 55 (Sucram), 56 (Alyi's count), 57 (the reply prompt).

---

### 6a. The lead's rulings (2026-09-27, under the showrunner's "best judgement" and "a story, not a documentary")

1. **Keep "…probably just the budget."** It's an expectation, not a motive, and it matches the reporting that he was blindsided.
2. **Keep the White House cluster** (vo-11–13). They're reads of invented beats at a meeting, not a proceeding's substance.
3. **Keep "he left to build a careful one."** It's his public, stated reason, said with warmth.
4. **The race:** facts #46 [V] covers the F1 weekend. The Las Vegas Grand Prix ran on the night of Sat Nov 18, 2023, so "the race is tomorrow" holds on Friday. A note was added to row 46.
5. **`$ MULTIBILLION`** reads as the company's own word. Keep.
6. **ALYI on the letter:** satisfied by facts L4. No new row.
7. **Sydney → Ep2:** added to show/episodes/ep02/open-questions.md.
8. **Tasya's lead-in:** fine. It dramatizes, and it doesn't document.
9. **Keep the voice terse** (24 lines, 185 words). The band is a guide, and the corny test outranks it.

## 7. What needs a new drawing (for the art passes)

**P1a: cold open and Act One**
- **9.01:** the novelty check, legible at lobby-wide scale: `MACROSOFT · "multiyear, multibillion dollar"` and `$ MULTIBILLION` in the amount box.
- **9.04 → 9.10:** Tasya's key ring in two states: eleven keys, then twelve, with the twelfth in NopeAI beige (the button's colour).
- **9.13 → 11.01:** the match cut. Gerg's laptop closes in the lobby two-shot, then opens in the same place in frame in the bullpen, dressed as a demo stage with a hand-lettered `GTP-4` banner. The two lids' positions must match.
- **12.05:** Alyi's reflection in the glass holding a phone with the pause letter on it, instead of the EMIT page.
- **8.01:** the alert text `ELGOOG · CODE RED`. The plates' new text throughout.
- **v3-5.06b:** no new drawing. It reuses 5.05's glass setup with a slow blink loop.

**P1b: Acts Two, Three and the tag**
- **13.13:** Mario pulling the whole scroll out of his pocket (the existing unroll, carried to its end).
- **16.01:** the poster with two stamps (`CANCELLED`, `UN-CANCELLED`), the review-quote strip, his post, and `ADDED DUE TO POPULAR DEMAND`; no "blackmail" cuff.
- **19.11:** the lighthouse with its own `MISANTHROPIC` sign on the brick.
- **21.02:** the signing desk on the monitor, with an order that runs off both ends of a very big desk, and Neleh's paper egg in the bezel.
- **22.02:** his thumb hovering over the reply strip (a new pose), then tapping.
- **S1.01:** race-weekend dressing on the Strip below the suite: banners on the lamp posts and grandstands on the closed street circuit. Generic only: no real racing series' name, logo or livery (guardrails §5).
- **S1.02 / S1.06:** the JOIN screen with the invite's four attendee icons under `BOARD · VIDEO CALL · JOIN`, with none of them green.
- **S1.04:** `MACROSOFT · BILLIONS IN` on the key ring; `EQUITY: 0` alone.
- **S1.09:** the arrow's tag reads `ALYI`.
- **S2.03:** the rail text (it's the TPOOL rail, not art, but the lock needs it).
- **S4.02:** the first phone falling off the table's edge inside the boardroom wide (it moves from S4.06), and Alyi's reflection's mouth for his line in the wide.
- **S4.08:** the split without the rent-meter text or the `NOZAMA` caller ID.
- **S7.07b:** the nameplate `THE OTHER YRRAL`.
- **32.01:** the monitor dim, with no eggs on it.
- **33.04:** Mas in profile with his glass at his hand in the same frame, water line flat: a new composition, the glass insert folded in.

**No longer needed** (drawn or planned in v2):
- Sydney and her egg timer;
- Kram and the crate;
- the EMIT page and Rezeile's plate;
- the hands runner (Sirrah's lectern, the pinky promise, the forum room, Nole's referee);
- the lightning egg;
- the scroll pour;
- the tag's drawer;
- Mario's second call UI;
- S4.04's OTS and S4.06's two-shot;
- S4.13c (Ttemme's medium);
- the `WHAT THEY DIDN'T KNOW` card;
- the side badges.

**For sound (A2):**
- race-weekend practice laps, far off, under S1.01;
- the Build's chip line leading the 9.13 → 11.01 match cut;
- the pen's scratch leading 12.04;
- the dark room's drone under S4.15;
- Gerg's keys loud in 20.06 and at 2 AM, so "His keys stop." is heard as a change.

---

## 8. For the takes (S2, `v3-lock`)

- **V.O.: 12 new takes** (listed in §2.1). The delivery notes are in each V.O. entry in the beat plans: close, dry, unhurried, about 110–130 wpm, slower than his speech. The same stock voice as his speech (mas-inner-voice §9).
- **Five new or changed spoken lines:**
  - v3-a2-0001 (Mas, [P]): a new take.
  - v3-a4-0001 (Tasya, [V]): can probably be cut from the existing take `a5-27-45` (its second sentence) rather than re-read.
  - v3-a4-0003 (Tasya, [V/K]): the same, from `a5-30-06` without "Oh, we'd be fine.".
  - v3-a4-0004 (Terb): the same, from `a5-30-10` without "so nobody's surprised".
  - v3-a4-0002 (Tasya, invented): a new take.

  Whether an edited take sounds natural is the lock's call; nobody has listened.

## 9. The mood map, as written into the scene headings

| Sequence | Mood | Music call |
|---|---|---|
| Cold open | poised, curious | no score under the hall; the F4; MM-06 |
| Launch night (sc 5) | warm, giddy | **new:** the Build in major (brushes, Rhodes, chip), low under the talk |
| The drill (sc 6) | exhilarating | SET-PIECE SWING in major, turning on the tile |
| The bill (sc 7) | the heat | the swing's pedal; the siren |
| Elgoog (sc 8) | comic panic | pizzicato, the siren as a joke |
| The lobby (sc 9) | caper, charming | THE JOB swing (MM-05 family), not LEVERAGE |
| The duel (sc 11) | rivalry | MM-04 Lighthouse |
| The pause letter (sc 12) | a chill | MM-17 low; THREAT once |
| White House (sc 13) | pomp and comedy | MM-19 |
| The bridge (sc 14) | a hush | no score |
| Senate (sc 15) | procedural comedy | a lighter Under Oath |
| Tour (sc 16) | the run | THE RUN |
| Rooftop (sc 17) | grand, then uneasy | MM-03's pad → MM-05 → the bell alone |
| Act Three | intimate, quiet, a little lonely | the Water Line, warm; THE CLOCK at the act-out |
| Vegas, noon | suspense | felt → BLUEPRINT → LEVERAGE low → digital silence |
| That night | after the silence | DARK ROOM felt |
| The board's side | dry, procedural comedy | PROCEDURE, lighter |
| 2 AM | warm, loyal, funny | the Build and felt piano in major; ring-out on Gerg's look |
| The avalanche | the one full band | SET-PIECE SWING, dead stop |
| The return | triumph, one size too big | VICTORY LAP / THE RETURN |
| Coda | the vault's hum | F pedal, no motif under the memo |
| Tag | quiet, wry | MM-12 december |

The beat plans carry each mood on every kept beat (`music`), so the score pass can read any beat alone.
