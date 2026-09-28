# Ep1 v3.1: the script pass notes (`v31-script`, 2026-09-27)

> **Status: DONE, for the lead's review.** It covers script draft 7, the six v3.1 beat plans, these notes, and eight rows added to facts.md.
>
> **Nothing here was recorded, timed, heard or watched.**
> - Every length is planned from word counts, the takes on file and the v3 lock's measured beat lengths.
> - The v3.1 lock sets the frames.
> - Nothing was committed.

**The files:**
- **The script:** [show/episodes/ep01/script.md](../../script.md), draft 7. Its revision log is at the top, above draft 6's. Draft 6 is at git `aed2e2f`.
- **The beat plans** ([PLAN §2](PLAN.md#2-the-beat-plan-s1--s3-p1-p2-a1) format), written against the **v3 lock** (`show/reel/ep01-v3/ep01-v3-<seg>.json`): [beat-plan-v31/](beat-plan-v31/) `coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`.json. All six pass `python -m json.tool`.
- **The builder:** [beat-plan-v31/_build_v31.py](beat-plan-v31/_build_v31.py). The JSON is generated from its spec. It checks the spec against the v3 lock: every v3 beat appears exactly once, every dropped line exists in its beat, every line or V.O. placement resolves. Restored v2 lines (Sydney, the Atem thread, the hands runner) are read from the v2 timelines, so their text and take paths come from the files. **To change a plan, edit the spec and re-run; don't hand-edit the JSON.**
- **The facts rows:** [facts.md, "v3.1 rows"](../../facts.md) (V1–V8, appended; nothing above them edited).
- **Draft 6's plans and notes** stay beside these as history: [beat-plan/](beat-plan/), [script-v3-notes.md](script-v3-notes.md).

**To re-run** (it only reads the v3 lock and two v2 timelines; it writes only `beat-plan-v31/*.json`):

```
python3 show/episodes/ep01/production/full-v3/beat-plan-v31/_build_v31.py           # validate + runtime + V.O. list + takes list
python3 show/episodes/ep01/production/full-v3/beat-plan-v31/_build_v31.py --write   # rewrite the six JSON files
```

**Beat-plan fields beyond PLAN §2** (additive; the v3 plans used most of them):
- `src_s` (the v3 lock's `reelDur`), `est_s` (the planned v3.1 length), `src_frame`.
- `moved` on a kept beat that plays in a new place (THE PLAN: `from` / `to`).
- `fix`: the finding each change answers. **N** = the newcomer read (by timecode or section), **C** = the critic (by table row or section), **U** = the critic's line fixes, **R** = the critic's trims, **M** = the mood analysis (§4 item), **B** = this pass's brief (items 1–10), **T** = draft 6's optional trims.
- Line entries: kept lines `keep: true/false` (dropped ones carry their text and the reason); kept v3 V.O. carries `"vo": true`; new lines carry `who/text/after/gap_s/delivery/take`, and `take` says whether it is new, cut from an existing take, or a reuse; restored v2 lines carry `"restored": true`, the take path and its length.
- `shot_note` (for the shot passes), `art` (on new beats: what must be drawn), `sounds` (for A2), `line_text_fix` (a text change where the take stands).
- Top-level `_about` states the three global rules: subtitles without quotation marks, every call grid names its speaker, no band prompt.

---

## 1. Runtime

### 1.1 Per segment (story time; the intro, the card and the outro are episode time)

| Segment | v3 lock | v3.1 estimate | Change | What moved it |
|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | 0.0 | unchanged |
| Act One | 5:22.5 | **5:38.0** | +15.5 | Sydney's four beats +27.0 (with 9.13's shorter tail, +24.4), the Atem thread +5.2, the board question +3.7, EMIT +4.4, the steam +1.0; the duel's phrases 3–4 −10.0, the lease −6.9, Radnus −1.8, the drill −2.7, phrase 2 −1.5 |
| Act Two | 3:24.7 | **3:19.6** | −5.1 | the bay's match cut and read +3.4, the chairman's real line +1.0, "Longer." +0.3; the back-stamp −4.0, the first push −1.25, the poster −3.0, the photographer −1.2, the agency question's air −0.6 |
| Act Three | 2:08.0 | **2:20.8** | +12.8 | the Atem payoff and arrival +6.0, the hands runner +13.0 (in the lighthouse's −7.5 slot), Neleh's paper +6.2, the Orb's line +1.0, DevDay's two-shot +1.0; Rima's emails −3.0, the second deepfake −2.9, "the one with the pen." −1.1 |
| Act Four | 8:43.8 | **8:32.3** | −11.5 | his side +3.3 (the suite's life, the dialog), the desk at 11:52 +4.6, the reversal +0.1 net, his 2 AM moves +3.4, the invite +2.6, the pin +1.5, his term +2.8; the TPOOL flash −3.5, the board's side trims −18.5, "Chat, we're so back." −2.1, the Other Yrral −1.6, the shut door −2.0, "he's typing like it's launch night." −2.4 |
| Tag | 0:33.9 | **0:40.7** | +6.8 | the Runway insert +8.6; the arrival and the back wall −2.0 |
| **Story** | **20:39.6** | **20:58.1** | **+18.5** | |

- **Against the target (story ≤ about 21:00): 20:58, under it by 2 s.** The episode runs about **21:40**: the story, the 30 s intro, the 2 s card and the Orb outro (10.1 s).
- **What paid for what:** the additions are ≈ +109 s (new beats, and kept beats that grew, not counting content folded in from merged beats). Whole beats cut are ≈ −31 s; trims inside kept beats are ≈ −59 s.
- **No arrival and no hold at a scene's edge was trimmed**, except the coda's S8.07 (−0.9 s), which the mood analysis asked for (§4 #12). The trims are whole beats, dropped lines, a speech's middle, and air inside continuous scenes.

### 1.2 The board's side (mood §4 #8)

- **v3:** 3:24 away from Mas. **With THE PLAN moved there and nothing trimmed:** 3:49.
- **v3.1: 3:37.1** (v31-S3.00p through S4.15). The pass trimmed ≈ 18.5 s inside it and added ≈ 7 s the brief requires (the desk at 11:52 with its reason for the recap, the reversal's two lines).
- **The trims:** S3.00a's arrival and its wondering beat (−4.8), the appointment grid's "For how long?" exchange (−4.1), Ttemme's echo of it (−1.4), the blog's tail (−1.5), the Mario call's arrival and Neleh's line (−2.1), the lobby camera's first sentence (net), Tasya's greeting (−1.0), Gerg's quit (−0.5), the boardroom wide (−0.5), the folder's read (−0.8).
- **Kept whole, as the mood analysis asks:** Alyi's all-hands answer, Neleh's blank line, the told-twice lines.
- It is 8 s over the analysis's "about 3:29". Taking more would cut into "Is his feed frozen?" / "No. That is just him." or Alyi's answer, and it stops here.

### 1.3 How the estimates were made

- Each kept beat starts at its v3 lock length.
- **New lines** are estimated at the takes' measured pace for that voice where a take exists, or about 2.4 words a second for Mas and 2.8–3.2 for the others, plus the gap the plan sets.
- **Lines cut from an existing take** use the take's word timings.
- **Restored v2 lines** use their v2 take lengths (in the plans as `take_dur_s`).
- **The Runway insert** uses the film's measured length (193 frames at 24 fps, 8.04 s, from `insert.py`), plus the push in and out.

### 1.4 If the lock runs long (ranked by what they cost)

| # | Trim | Saves | Costs |
|---|---|---|---|
| O1 | 6.04: Nole's Dec 3 post, whole (Gerg hearts it, Rima un-hearts it) | 3.8 s | the drill's one outside reaction; Nole's first appearance moves to 12.02 |
| O2 | 16.01: the tour poster to 3 s, the title and cities only (the EU strip, his post and the stamps go) | 2.0 s | the EU flip (the camp matrix's Gov-Intl item for Ep1) |
| O3 | v31-10.02: Sydney's opener, "Hi! Isn't 2022 a lovely year?" (her `2022` stamp sets up his correction) | 3.2 s | the cheery build before the scold |
| O4 | v31-S7.03b: Tuesday's invite | 2.6 s | the critic's #6: the fires' room loses its reason |
| O5 | v31-vo-07 "those are stills." | 0 s (it sits in the stills' hold) | the one read that tells a newcomer the demo was faked |

**Not on the list, on purpose:** any arrival or scene-edge hold; the told-twice lines; Mario's sub-concerns; the 2 AM call's night-owl half; "alyi voted." / "He did both." and their hold; the calm-off's long hold; the Orb's hold.

---

## 2. Mas's inner voice: the map

### 2.1 Counts

- **28 lines, 208 words** (v3: 24 lines, 185 words; the guide's range is 15–25 lines and 200–300 words).
- **Changes from v3:**
  - **new: 6** (v31-vo-02 to v31-vo-07);
  - **changed: 1** (v3-vo-11 → v31-vo-01, the critic's U1);
  - **cut: 2** (v3-vo-17 "the race is tomorrow…", brief item 1; v3-vo-22 "he's typing like it's launch night.", brief item 7);
  - **moved: 2** (v3-vo-18 folds into S1.02 with S1.06; v3-vo-23 moves onto Gerg's question, S5.09b).
- **Kinds:** reads 7 · predictions 3 · warmth 4 · gap 7 (one of them the wrong read) · effort 2 · count 2 · caught 3.
- **Caught by the picture or events:** 4 of 28 (14%), under the guide's quarter: the three caught lines plus the budget read.
- **Clusters:** launch night (7), the lobby (2), the duel (1), the White House (3), the bay (1), the dark room in Act Three (7), Vegas (1), that night (1), 2 AM (3), the tag (2).
- **Takes:** the 21 kept v3 lines have takes (`audio/ep01/v3/`); **7 need new takes** (§6).

### 2.2 Every line, in episode order

| # | Id | Line | Beat | Kind | What it does |
|---|---|---|---|---|---|
| 1 | v3-vo-01 | gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first. | 5.02 | read | introduces all three by what they want |
| 2 | v3-vo-02 | she'll go for three. | 5.03 | prediction | paid at 5.07 |
| 3 | v3-vo-03 | she's right. it will break. i don't know which part yet. | 5.04 | gap | the honest thought, then "it's a preview." |
| 4 | v3-vo-04 | alyi asks that about everything we build. he means it every time. | v3-5.06b | warmth | the trust Act Four breaks |
| 5 | v3-vo-05 | i know. i still read it twice. | 5.11 | gap | **his want, admitted once: to be liked** |
| 6 | v3-vo-06 | someone noticed. | 6.01 | read | pays "let's see if anyone notices." |
| 7 | v3-vo-07 | mostly the bill. | 7.01 | gap | plants "mostly." |
| 8 | v3-vo-08 | eleven keys. he's here for the twelfth. | 9.04 | prediction | paid at 9.10, and counted again in Act Three |
| 9 | v3-vo-09 | it does. | 9.09 | gap | vanity inside, business outside |
| 10 | v3-vo-10 | mario used to sit where gerg sits. he left to build a careful one. | 11.03 | warmth | introduces Mario, now on a clean shot of his lab |
| 11 | **v31-vo-01** | four companies, one table. radnus has been mouthing the same sentence since we sat down. | 13.01 | read | U1; Radnus's lips move, so the rehearsal is his |
| 12 | v3-vo-12 | he's not wrong. | 13.09 | gap | concedes inside, then the knife |
| 13 | v3-vo-13 | i'll turn when he finishes the sentence. | 13.11 | effort | the calm as a skill |
| 14 | **v31-vo-02** | her mouth is a beat late. the voice isn't hers. | 14.01 | read | orients the bay (mood §4 #5); rhymes with the chairman's "That voice was not mine." |
| 15 | **v31-vo-03** | thirteen. | v31-18.00b | count | pays the key count and "it'll be open source." |
| 16 | **v31-vo-04** | my other company. it tells people from machines. | 18.02 | read | who sent the box, and why it matters (N §3 #7) |
| 17 | v3-vo-14 | i made it for everyone else. | 18.06 | caught | now lands on the line before it |
| 18 | **v31-vo-05** | i've had mine up since may. | v31-19.03 | gap | **frames the hands runner with his stake: he asked first** |
| 19 | v3-vo-15 | gerg types louder when he's happy. he's been happy since november. | 20.06 | warmth | plants 2 AM, where the keys stop |
| 20 | **v31-vo-06** | neleh's on our board. she quoted us. | v31-20.07 | read | names and places the board member before Act Four (B3) |
| 21 | v3-vo-16 | thrilled is too much. enthusiastic is a lot. | 22.02 | effort | "super." chosen from three |
| 22 | v3-vo-18 | gerg's not on it. alyi set it up. probably just the budget. | S1.02 | gap | the one wrong read, now the only line before the blow |
| 23 | v3-vo-19 | i don't keep score. | S2.01 | caught | the carve |
| 24 | v3-vo-20 | four hundred and six. four hundred and seven. four hundred and six. | S5.03 | count | the first inner words since the board's side |
| 25 | v3-vo-21 | gerg. he'll say he's compiling. | S5.09 | prediction | now said as **he** calls Gerg |
| 26 | v3-vo-23 | gerg never waits to be asked. | S5.09b | warmth | **moved:** it sits on "Do I tell everyone to pack?", where Gerg, for once, waits for him |
| 27 | **v31-vo-07** | those are stills. | v31-32.01d | read | the one line over the Runway insert |
| 28 | v3-vo-24 | it looks calmer than me. | 32.03 | caught | the coda line |

### 2.3 The corny test (mas-inner-voice §8) on each new line

| Line | A post, tagline or magnet? | Tells us what we saw? | Names a feeling? | Winks at the news? | Helps a newcomer? | Verdict |
|---|---|---|---|---|---|---|
| four companies, one table. radnus has been mouthing the same sentence since we sat down. | no (a room read) | no: points at a tell the viewer can then see | no | no | yes (whose rehearsal) | keep |
| her mouth is a beat late. the voice isn't hers. | no | half: the lag is visible; "isn't hers" is the information a newcomer lacked | no | no: the clip is invented, the anchor unnamed | yes (the newcomer's most confusing passage) | keep |
| thirteen. | no | no: it is his count | no (the rhythm carries it) | no | yes (the key count's payoff) | keep |
| my other company. it tells people from machines. | no | no (the label says CO-FOUNDER; this says what it is for) | no | no | yes (N §3 #7) | keep; the closest line to "explaining", allowed as the one orienting line the brief asks for |
| i've had mine up since may. | could be misread as a brag; he would never post it, which is the point | no | no | no: a fact about him (the May hearing) | yes (it ties the runner to Act Two's ask) | keep |
| neleh's on our board. she quoted us. | no | no | no, and no opinion of the paper (§6: no feeling about her real act) | no | yes (B3) | keep |
| those are stills. | no | half: it names what the stutter shows | no | no | yes (a newcomer may not know the demo was faked) | keep; cuttable at 0 s |

**Rejected in this pass** (so nobody tries them again):
- "in november it called me a visionary." (Sydney): it passes, but his reply to Sydney is already the read (mood §4 #5 asks for his reaction or a line, not both). It costs 2.9 s.
- "it's a good paper." (aloud, to the Orb, with no toast): it implies he minds her paper, which is a feeling about a real person's real act (mas-inner-voice §6). Cut before it was written into the draft.
- "she likes mario's way better.": the same problem, as a thought.
- "they want us to stop. we just started." (the newcomer's suggestion at the pause letter): a fridge magnet.
- "i had mine up first.": a factual claim that isn't true (others asked earlier).
- "it's still a good duck.": it would work as a post.
- "the race is tomorrow. the board wants noon today." (v3): cut by the brief; the race is in the picture.

### 2.4 Where he is silent, on purpose (unchanged unless noted)

- the cold open and the intro;
- the hearing (sc 15), the tour (sc 16), the rooftop (sc 17);
- the Tidder post and its edit (sc 20);
- **Sydney's scene** (new): his spoken reply is the read;
- **the forum's real lines** (new): his line comes after them and is about himself;
- **Neleh's paper** (new): one fact, no opinion; the Orb reads him and nothing is said;
- from the JOIN click through "super."; the whole board's side;
- "alyi voted." / "He did both."; Tasya's door, "and the rent?" and "leave it open."; the whole return, including his term.

---

## 3. Every change, and why

### 3.1 Act Four's shock opening (brief item 1; the lead's design; PLAN §5)

| Where | Change | Why |
|---|---|---|
| S1.01 | v3-vo-17 cut; the arrival holds as ordinary life | B1 ("drop 'the race is tomorrow…'"); N 12:01; M §4 #1c (a floor for the calm) |
| v31-S1.01b (new) | Mas and the Orb at the window: a practice lap; the Orb's iris follows a car | the mood analysis's 10–15 s of suite life before the JOIN (the suite now runs 16.4 s to the click); the race is shown, not said |
| S1.02 ← S1.06 | the JOIN insert folds in with v3-vo-18 and the click | B1: one beat for the read and the click; C §2.1 N1 |
| S1.07 | Neleh's card and the Cancel dialog removed; the tiles' own name labels; Alyi's first sentence spoken (v31-a4-0001, cut from a5-27-01); on "company." his Wi-Fi drops and the tiles freeze | B1: the viewer learns it when he does; C §2.1 N2 (no gag card inside the blow); the told-twice difference that stays is the frozen feed |
| S1.08 | cut | C §2.2 #3: the dialog isn't on his screen |
| v31-S1.08d (new) | the host's dialog, full frame, bright, in the 1993 look: `Remove MAS MANALT from the meeting?` `[ Remove ]`; ALYI's pointer clicks on the downbeat into D6 | B1; M §4 #1a (hold it 1.5 s; the brightness spike into silence is the jolt) |
| S1.09 | the drop and the notice in silence; the Cancel overlay goes | B1 |
| S2.02 ← S2.04; S2.03 cut | the TPOOL flash goes; the Orb's light counts the three marks | M §4 #11; N 12:57 (too fast to place); R11 |
| S2.05 | the whip lands on Neleh's desk, earlier that day | C §2.1 N3; M §4 #6 |
| v31-S3.00p (new) | Neleh's desk at 11:52: Mada joined early; her card; "Once more, before the others join." (v31-a4-0002); the push into the paper | B1; C §2.1 N2, N3, N3a (the recap gets a reason); M §4 #6 (a door, not whiplash) |
| S1.03–S1.05 (moved) | THE PLAN opens the board's side as her document; `GERG / CHAIR`; her figure steps out of her own chair outline; Mada's "Good question." comes from his tile; it pulls back to her desk instead of tearing into the suite | B1; N 14:30 (the chair was never set up); C §2.1 N4 |
| S3.00a | the arrival ~0.3 s; the wondering beat 1 s; Alyi's take whole | C §2.1 N4; M §4 #8 |
| S3.01 | the same Remove from their side: `ALYI removed MAS MANALT from the meeting.` | C §2.2 #1 |
| S8.03 | the lobby's return gag re-rhymed: the Remove dialog, greyed | C §2.2 #2; M §4 #7 |

**Music (for the score pass):** the suite has one felt bar and then LEVERAGE low from the JOIN, thinned to its pedal under Alyi's sentence and back up for the dialog. **The waltz moves to the board's side**, entering under Neleh's pointer at underscore and handing to PROCEDURE on the 11:59 tick. Sc 24 → 25 is no longer one performance (C §2.2 #4).

### 3.2 Mas's want, and his moves (brief item 2)

**The want, made legible early and kept alive.** He never says it; it shows in what he does and what his voice notices.
- **To be noticed and liked** (the bible's "liked by every room"):
  - launch night: "let's see if anyone notices.", "it likes me.", "i know. i still read it twice.", "someone noticed.";
  - Sydney: the flatterer now scolds him, and he flatters it back;
  - the White House: the lens look;
  - the Senate: they ask him to run the agency, and the room gasps at his wallet;
  - the tour;
  - the runner: "i've had mine up since may.";
  - DevDay: "thrilled is too much.";
  - the tag: CEO of the Year, pinned beside the framed badge.
- **To win without being seen to play:**
  - the PLEASE sheet he starts in March and hands over in May (the act-out now reads `PLEASE` / `REG`);
  - "i'll turn when he finishes the sentence.";
  - the pin;
  - the calm-off.
- **Underneath, to be asked:**
  - the Senate asks him, and he declines;
  - at 2 AM **he asks** ("read me the letter.");
  - Gerg, who never waits to be asked, waits for his word;
  - the board asks him back.

The act intros in the script say this in one line each (Act One, Act Two), so every pass reads it.

**His visible choices in Act Four** (none is a motive at a contested moment: each is a small invented action, or his own words at an invented beat, and he is silent inside at the door and the terms):

| Beat | His move | New or changed lines |
|---|---|---|
| S5.09 | **He calls Gerg** (v3: Gerg called him). The prediction still pays | v31-a4-0007 (Gerg's line, cut from a5-29-05) |
| S5.09 | **He asks for something:** "read me the letter." It also motivates Gerg reading aloud (U7) | v31-a4-0008, v31-a4-0009 |
| S5.09b | **He answers Gerg's question with a decision:** "keep building." It is about Gerg's invented fallback and says nothing about where anyone goes. It replaces "ask me when it compiles." (sideways, and the fourth "compiles": N §4) | v31-a4-0011 |
| S5.11 | **What he says to Tasya:** "and the rent?" (Act One's take, the same three words), this time *before* stepping on anything; "Due on the first." | v31-a4-0012 (reuse), v31-a4-0013 |
| S5.12 | **The door kept open:** "leave it open." (unchanged, no V.O.) | none |
| v31-S7.03b | **He accepts the board's invite, looking at it** (on Friday he accepted without looking) | none |
| S7.06 | **He makes the new chair's tool work:** Terb's dry click first, then the pin, in the freeze | none |
| S7.07-cont | **His terms:** "we'll stand." (he gives up the seat) and "gerg comes back too." (his one term; Terb writes it in; Gerg's real post pays it) | v31-a4-0015, v31-a4-0016 |
| S7.07–S7.09 | **The calm-off:** he out-waits Mada (unchanged; the pin and the invite now frame it as his room) | none |

### 3.3 The board and the candour thread, seeded (brief item 3)

| Where | Change | Why |
|---|---|---|
| 5.07 | Rima: "Did anyone tell the rest of the board?" Gerg: "It's a research preview." Nobody else answers; he clicks | B3; N §3 #8. It is a question left open: nothing states who knew what. "the rest of" hints that people in the room sit on the board, which THE PLAN shows. **Guardrails question §6.1** |
| v31-20.07, v31-20.08 (new, sc 20A) | Neleh's real paper on his monitor: title, byline, "research preview" in its quotes, the p. 30 sentence; "neleh's on our board. she quoted us."; the Orb reads him | B3; N §3 #8 (the board as strangers when they strike). No feeling about her real act is voiced; facts #36's exclusions stand |
| 23.02 | the reminder's four circles show their names on hover: ALYI · NELEH · MADA · THE QUIET VOTE | B3: all four named before Act Four, by the invite itself |
| S3.03 | the blog post's "not consistently candid" now has a seed behind it, and the script says nothing more | B3 |

### 3.4 The reversal, shown (brief item 4)

| Where | Change | Why |
|---|---|---|
| S4.09 | Sunday: the phones set in a row (`STAFF · STAFF · INVESTORS · INVESTORS`), the ticker `INVESTORS PUSH TO BRING MANALT BACK` [H], and Neleh: "The staff want him back. The investors want him back." Then "We've talked all day about him coming back, and we're no closer." (cut from a5-27-35) | B4; N §3 #9 (the biggest jump in the film). After Mario's no (their own step four), the pressure lands on the table and she says it |
| S6.01 | the first tile of the avalanche carries `STAFF LETTER · TO THE BOARD` | B4; C §1 #42: the letter itself is Monday, so it lands on the board here |

### 3.5 Transitions and the newcomer's confusions (brief item 5)

| Critic's seam / newcomer | Was | Now |
|---|---|---|
| **C #18, the bay (bad)**; N 7:41 (the most confusing passage) | a dark window, no want, two fake-voice ideas stacked | 13.14 → 14.01 **match cut**: the print in his hand becomes his phone; the feed scrolls from CLASS PHOTO #1 to the altered clip; v31-vo-02; 14.02 cut; the chairman's real "That voice was not mine. The words were not mine." replaces the invented "Couldn't have said it better myself." (one fake-voice idea, stated by the record). Shot notes: the anchor plainly generic; the silhouette RUMPT's props only, no hair |
| **C #23, the lighthouse (bad)** | two months jump into a rival's room, nobody reacts | cut; the hands runner takes the slot, entered on the iris flick |
| **C #29, THE PLAN before the call (bad)** | the viewer learns from a diagram | §3.1 |
| **C #12, the duel's arrival (weak)** | a formal rhyme with no scene | Sydney gives the laptop's close its reason; the Atem thread gives the bullpen a conversation before the split |
| **C #26, DevDay (weak)** | home or on stage? | 22.01 opens on the two-shot for 1 s |
| **C #45, Tuesday (weak)** | a burning boardroom with no reason | v31-S7.03b: the invite on his phone by the two badges, Accept |
| **C #32, TPOOL (weak on purpose)** | kept in v3 | cut (M §4 #11) |
| N §3 #1, the Elgoog founders | unnamed silhouettes | plate `THE FOUNDERS · SUMMONED.` |
| N §3 #2, Mario | the V.O. fought three gags | 11.03's right pane held clean for his introduction; phrases 3–4 cut |
| N §3 #3 / #4, the pause letter and PLEASE | a room without our characters; "please what?" | EMIT lands on **his** desk on top of the letter; Alyi reads it in the glass; the sheet reads `PLEASE` / `REG` |
| **N §3 #6 and the Act Two act-out** | a teal bucket and a stock line | shot notes: the glass side-on at table height; the crack jagged and white, never a chart line |
| **N §3 #7, the Orb's arrival** | why an eyeball-scanner, from whom | v31-vo-04: "my other company. it tells people from machines."; the Atem payoff now opens the act on the monitor |
| **N §3 #10, Ttemme** | a name only; "did he get an answer?" | a 2-TONE card, `TTEMME / INTERIM CEO, TAKE TWO` · `CHAT: LIVE`; "Okay." played as the pointed non-answer (he holds Neleh's eye and takes the job; the folder stays sealed). Shear's real post (facts V7) is on file as an option, not shown |
| N 5:27–6:17, the overpacked stretch | tape gag, NAPKIN/MEMO → WEBSITE, a letter nobody we know is in | phrases 3–4 cut, the napkin caption dropped, the letter's scene lands on Mas's desk |
| **Call grids: speaker identification** (B5) | faces with no names | every grid lights and names its speaking tile (S1.07, S3.00a, S3.04, 20.04's video tile, S5.09); in the boardroom wide, an MCU·glass cutaway gives Alyi's line to Alyi (N 14:45); "Step four, Mada?" names its addressee (N 16:32) |
| N 3:21 | "You're actually crying for them." with no crying in the picture | "A million people, Mas. Is that a tear?" (the tear catches the light) |
| N 4:34 | Tasya's 15 s lease speech | half: the servers, the lights, the floors (v31-a1-0005) |
| N 10:34 | 30 s of off-screen Gerg | his video tile on the monitor; "Rima's going to wake up to forty emails about it." cut |
| N 17:35 | "share sale" unexplained | "That's the share sale. Everybody was about to get paid." |
| N 18:50 | who says "Everyone's packed"? | shot note: Tasya the only moving figure, facing Mas, mouth lit |
| N 19:04 | "Hello." to nobody | "Down here." (U6) |
| N 0:05 and §4 | real quotes read out with quote marks | subtitles drop the marks everywhere (the script's notation; each plan's `_about`) |
| N "chapters" | "the blip, told twice" is insider slang | the act's heading is now "FIVE DAYS, TOLD TWICE"; **the assembly's chapter name should follow** (the lead's file) |
| M §4 #13 | the bill's sting was 4 s | the steam holds 1 s longer |

### 3.6 The restorations (brief item 6), each as Mas's problem (mood §4 #5)

| Restored | Where | How it is his | Stakes and payoffs |
|---|---|---|---|
| **Sydney** | sc 10, four new beats after 9.13 | their own chatbot, in the landlord's colours, scolds him, and he flatters it back ("you've been an extremely good gnib.") | answers Rima's "what do we tell them?" (the landlord does); gives Gerg's laptop close its reason; the bubble on its chain rides behind Tasya at DevDay (0 s). Ep2's `😊` callback has its setup again, so **the Ep2 owner's "Sydney moves to Ep2" (open question) reverses** |
| **The Atem leak** | 11.01 (the setup) and v31-18.00b (the payoff) | he predicts it ("give it a minute. it'll be open source.") and counts the landlord's thirteenth key ("thirteen.") | free versus the bill; "Everyone is welcome." turns from a welcome into "you're one of many" before Act Four's door; KRAM appears (mute) |
| **The hands runner** | v31-19.02, v31-19.03 (≈ 13 s, one held room frame) | he copies the gestures for the Orb; his hand is already up; "i've had mine up since may." | Sirrah's two letters [H], the pinky promise [P], Remuhcs's forum and Nole's referee [V], `BILLS: 0` |
| **Rezeile's op-ed** | v31-12.03 | it lands on his desk, on top of the pause letter, and he writes his own ask between them; Alyi reads it in the glass | the thud leads the cut again; EMIT's masthead pays off on the tag's cover |

### 3.7 Line fixes (brief item 7)

| Critic | Applied as |
|---|---|
| U1 | v31-vo-01 ("mouthing the same sentence since we sat down"), and Radnus's lips move in 13.01 |
| U2 | "Longer." re-cut after the scroll comes out (v31-a2-0001, v31-a2-0002) |
| U3 | "the one with the pen." cut; the Orb's toast pops over the real Nedib |
| U4 | "We'll say we will." |
| U5 | **Not applied as written.** The brief keeps "gerg never waits to be asked." The line moves to S5.09b, after "So. Do I tell everyone to pack?", where it no longer explains the joke: it notices the exception. v3-vo-22 is cut instead |
| U6 | "Down here." |
| U7 | made moot by the restaging: Mas calls, and asks Gerg to read it |
| U8 | "that was close." |
| U9 | "Once more, before the others join." |
| U10 | "it does." kept |

### 3.8 The band prompt (brief item 8)

Dropped from 5.02, 5.03, 5.04, 5.07 and 5.08 (`UI: Push button`, `UI: Push research preview`), and from the tag's thud (the v3 lock's cue for "Look at glass of water"). The cursor and the button stay in the scene. The rails and the V.O. line are untouched.

### 3.9 The Runway insert (brief item 9)

- **v31-32.01d, ≈ 8.6 s, before the EMIT cover** (both are DEC 6; the rail moves to 32.01). The monitor lights on its own, the push goes native for ELGOOG's product film, and it steps back to pixels on the bezel.
- **The film's content and frames are the `v31-runway` pass's** (`insert.py`: the wordmark, the line drawing, the duck, the `LIVE` chip, the stutter, the stills).
- **"What the quack!" is restored as the demo's own sound** (v31-tg-0001, a stock product voice cast for the film, never a clone), on the smooth turn, before the stutter.
- **One V.O. line over the stills,** "those are stills.". No caption.

### 3.10 Runtime (brief item 10): §1.

### 3.11 Also changed

- **Real-line spellings from facts L1, L5 and L12:** "judgement" on the letter's page (the take stands); Gerg's post `…i quit.` in lowercase; the eulogy post card's Nov 17 timestamp (the rail stays Nov 18).
- **The act headings and intros** say each act's sequences and his want in one line, for the passes that read only the headings.
- **The launch-night and pause-letter music lines** now carry the mood analysis's calls (M §4 #2). The picture and mix fixes (face lights, set-piece loudness, warming launch night's room) appear only as shot notes, as the lead asked.

---

## 4. The new art needed, per segment (for the art and shot passes)

"Reuse" names the kit or room file where one exists (`studio/src/shared/pixel/`).

**Act One** (P1a)
- **Sydney (v31-10.01–10.04):**
  - the bubble: ChatGTP's two dot eyes and `• • •` mouth, repainted in GNIB's colours, a tiny `2022` date stamp, the `SYDNEY` plate;
  - its exit from the lobby TV;
  - the egg timer on her chain, its face `5` and its ding;
  - the blink-and-reset;
  - the same face in a chat window on Gerg's laptop (reuse `cast/chatgtp.ts`, `kits/chat-window.ts`, `rooms/lobby.ts`).
- **11.01:** the laptop screen as a message-board thread, with a crate stencilled `ATEM · MODEL WEIGHTS · RESEARCHERS ONLY` tipped open and a `03/03/23` stamp. Gerg on camera for his line.
- **v31-12.03:** EMIT open at the op-ed, flat on the printed pause letter on his desk: the headline, the `REZEILE` plate, the 2 px shake (reuse the masthead from `kits/emit-cover.ts`; `kits/pause-letter.ts`).
- **12.05:** Alyi's reflection holding a phone with the EMIT page.
- **12.06:** the sheet reading `PLEASE` / `REG` (`kits/please-sheet.ts`).
- **5.07:** Rima capping her marker (a pose).
- **Text only:** the `THE FOUNDERS · SUMMONED.` plate (8.04); `FEB 8 ·` in the TV's ticker (9.12).
- **Shot notes:**
  - no band text (5.02–5.08);
  - the tear's bright pixel (7.01);
  - the new collar reading as new (9.08);
  - Alyi's reflection as the speaker (5.09);
  - the right pane held clean (11.03);
  - no `NAPKIN → WEBSITE` caption (11.04);
  - face lights on Alyi in the glass (5.05, v3-5.06b, 12.05);
  - warming the room one step (5.02).

**Act Two** (P1b)
- **13.14 → 14.01:** the match cut (the print and the phone in the same place in frame), and the phone's feed: a `CLASS PHOTO #1` post with hearts, then the scroll to the existing clip (`rooms/bay-bridge.ts`, `KIT-NEWSCLIP`).
- **13.01:** Radnus's mouth moving silently in the wide.
- **17.12:** a new ECU of his glass side-on at table height on the rooftop table, with the sheet and the sky (it replaces the view from above).
- **Shot notes:**
  - the crack jagged and white (17.11);
  - the anchor plainly generic, and the silhouette RUMPT's props only (14.01, 14.03: check the current drawings for any hair colour; the newcomer saw "an orange-haired man");
  - the chairman speaking his new line (15.02).

**Act Three** (P1b)
- **v31-18.00:** the home room's two-shot with the monitor lit, small slate lobby on it.
- **v31-18.00b (the monitor):**
  - the landlord's lobby in slate blue with the caption `MACROSOFT WELCOMES ATEM` and a `JUL 18` chip;
  - Tasya's ring with a thirteenth key in Atem blue;
  - **KRAM, new cast:** a mute founder in a hoodie printed `OPEN SOURCE`, the paint dry, plate `KRAM` (guardrails §6: his family never; the soup and checks are the joke in later episodes).
- **v31-19.02:** Sirrah at a lectern with waist-high A and I blocks, and the news chyron (reuse `cast/sirrah.ts`, `kits/wh-props.ts`).
- **v31-19.03 (one held 2S·SCR frame):**
  - the monitor large: the `PINKY PROMISE` scroll with seven pinky-prints, one beige; the tiled forum room, hands down then up in one drawing, NOLE's hand highest, the `REMUHCS` plate, `BILLS: 0`;
  - Mas: two fingers up, pinky up, hand up, then lowered;
  - the Orb: a whirr, a rotation, a one-pixel rise.
  - Legibility at 2S·SCR scale is the shot pass's call; the Sirrah chyron has its own POV for that reason.
- **20.04 / 20.06:** Gerg's video tile in the monitor's corner (reuse 2 AM's tile, `kits/callgrid.ts`).
- **v31-20.07 (the paper):** the title page (`DECODING INTENTIONS`, the `NELEH` byline, the glowing-page icon, orbiting footnote numbers); p. 29 with `research preview` in its quotes; p. 30 with two small logos (NopeAI's, the lighthouse's) and the held sentence; the scrollbar's thumb shrinking.
- **21.02–21.04:** one copy of Nedib, not two; the stat `SEEN 1`; the Orb's toast over the real Nedib.
- **22.01:** the two-shot first (existing); the Sydney bubble on its chain behind Tasya on stage (tiny).
- **23.02:** the hover names on the four circles.
- **Shot notes:** face lights on 18.05 and 22.03.

**Act Four** (P1b / the Act Four shot pass)
- **v31-S1.01b:** the window two-shot over the circuit, a car's loop, the Orb's iris tracking (reuse `rooms/vegas-suite.ts`).
- **S1.02:** the JOIN screen (exists) and its ping.
- **S1.07:**
  - the call's own name labels on all five tiles;
  - no Neleh card, no Cancel dialog;
  - the Wi-Fi icon dropping to one bar and the four board tiles freezing on "company.".
- **v31-S1.08d:** the host dialog full frame, `Remove MAS MANALT from the meeting?` `[ Remove ]`, in the 1993 cream and bevel (reuse `kits/dialog-1993.ts`), with the `ALYI` pointer. Hold it 1.5 s; the click on a downbeat.
- **v31-S3.00p:**
  - Neleh's desk from above at `11:52`, Mada's early tile, the blueprint unfolded (reuse `rooms/neleh-desk.ts`, `kits/blueprint.ts`);
  - her card;
  - **a push into the paper that becomes the blueprint GFX** (a new transition).
- **S1.03:** `GERG / CHAIR`; her figure stepping out of her own chair outline.
- **S1.05:** a pull-back out of the linework to the desk (a new transition; the tear into the suite goes).
- **S3.01:** Alyi's reflection's hand, one click; the notice text.
- **S3.05:** the post text `…i quit.`
- **S4.02:** an MCU·glass cutaway of Alyi's reflection in the boardroom's dark window (a new composition).
- **S4.09:** the phones in a row in the foreground (from S4.02's phones), and a ticker strip under the CCTV tile.
- **S4.10:** Ttemme's 2-TONE card.
- **S5.09:** the call app's `GERG` contact and an outgoing ring state (`kits/callgrid.ts`).
- **S5.06:** the letter sliding over, with "judgement".
- **S6.01:** the first tile with the letter's header strip (`kits/staff-letter.ts`, `kits/avalanche.ts`).
- **v31-S7.03b:** the invite on his phone beside the two badges, `Board · Tue 10:00 PM`, with a spinner, a fire helmet and a blank (reuse `kits/phone-invite.ts`, `kits/macrosoft-badge.ts`).
- **S7.06:** Terb's dry squeeze (a pose, no spray).
- **S7.07-cont:** Terb writing on the sheet.
- **S8.03:** the Remove dialog with Remove greying out.
- **Cuts to un-draw:** S2.03 (TPOOL), S7.07b (the Other Yrral), S8.09b (the shut door).
- **Shot notes:** face lights on S3.04b, S3.07, S4.07, S4.15, S5.05, S5.07b, S5.09b, S7.08 (M §4 #4).

**Tag**
- **32.01:** the monitor lighting on its own.
- **v31-32.01d:** the Runway insert and its transitions (the `v31-runway` pass).
- **33.01–33.02:** no band text.

**No longer needed:**
- the old noon Cancel dialog on his grid and in the lobby;
- the TPOOL door (kept on file for the season);
- the Other Yrral's cutaway;
- the shut door;
- the second deepfake Nedib;
- the lighthouse's second phone and rent meter;
- the duel's crossing scroll and `MEMO → WEBSITE`.

**For sound (A2):**
- the egg timer's tick, its ding, and the tick carrying the match cut;
- the bubble's toast pop;
- EMIT's THUD (`synth:thud`);
- the JOIN ping;
- the Remove click into D6;
- Neleh's office clock under the whip;
- the phones buzzing in a row (S4.09);
- the outgoing ring at 2 AM;
- the invite's tap under the fires;
- the pinned extinguisher's dry click;
- the demo film's own bed and voice, stuttering with the picture, then silence on the stills.

**For the score (A1):**
- launch night's first minute on the Build and the felt only;
- the pause letter played straight;
- Sydney on the lobby's cue;
- the suite's felt bar, then LEVERAGE thinned under Alyi;
- the waltz on the board's side under Neleh's pointer at underscore;
- the tag ducking for the demo.
- The Act Four structure change is in §3.1.

---

## 5. Mas's want: where each piece is (a quick map for the table read)

| Act | What we see him want | What he does about it |
|---|---|---|
| One | to be noticed and liked | ships (the click, over an unanswered question); reads the chat's praise twice; asks the rent after stepping on the check; flatters the chatbot that scolds him; starts `PLEASE` / `REG` |
| Two | every room | doesn't turn for the president; hands the Senate his ask; shows the wallet; declines the agency |
| Three | credit, and his own witness | counts the landlord's keys; keeps the Orb; "i've had mine up since may."; posts, edits, calls; places the board member who quoted him; chooses "super." |
| Four | back in, on his terms | calls Gerg; asks; "keep building."; asks the rent first and keeps the door open; accepts the invite; makes the extinguisher work; gives up the seat; "gerg comes back too."; out-waits Mada |

---

## 6. For the takes: Kokoro (S2) and ElevenLabs (A4)

**Kokoro stays the primary film.** Its takes go into `audio/ep01/v3/<seg>/`, or into a v3.1 folder if the lock pass prefers one. **ElevenLabs re-renders the whole episode,** so every line below needs an EL take too. The lines marked "cut from" can be edited from the Kokoro take, but the v3 lock's precedent (lock.md §4.3) was to re-read whole, and that is the safer default.

### 6.1 Mas's V.O. (7 new): the V.O. preset, close and dry, speed 0.85–0.88

| Id | Line | Delivery |
|---|---|---|
| v31-vo-01 | four companies, one table. radnus has been mouthing the same sentence since we sat down. | amused, quiet; the second sentence a shade slower (replaces v3-vo-11) |
| v31-vo-02 | her mouth is a beat late. the voice isn't hers. | a professional's eye, plain, no alarm; the second sentence lower |
| v31-vo-03 | thirteen. | the key count again, level |
| v31-vo-04 | my other company. it tells people from machines. | plain, a little proud |
| v31-vo-05 | i've had mine up since may. | dry, very small vanity, to nobody |
| v31-vo-06 | neleh's on our board. she quoted us. | level, a little too level |
| v31-vo-07 | those are stills. | flat, almost admiring |

### 6.2 New or changed spoken lines (31)

| Seg | Id | Who | Line | Take |
|---|---|---|---|---|
| act1 | v31-a1-0001 | Rima (O.S.) | Did anyone tell the rest of the board? | new |
| act1 | v31-a1-0002 | Gerg | It's a research preview. | new (it could be cut from e1-a1-5-03, but that one ends on a comma) |
| act1 | v31-a1-0003 | Rima (O.S.) | A million people, Mas. Is that a tear? | new |
| act1 | v31-a1-0004 | Radnus | Search is fine. Totally fine. It's just a chat thing. | cut from e1-a1-8-03 |
| act1 | v31-a1-0005 | Tasya | Oh, we don't think of it as rent. You'll build everything on our servers. We'll keep the lights on and the floors warm. | new |
| act1 | v31-a1-0006 | Tasya | House rules, Sydney. Five questions, then a fresh start. | new |
| act1 | v31-a1-0007 | Sydney | Hi! | cut from e1-a1-10-06 (its first word) |
| act2 | v31-a2-0001 | Nedib | Whatever you promise in here today, put it in writing. | cut from e1-a2-13-15 |
| act2 | v31-a2-0002 | Nedib | Longer. | cut from e1-a2-13-15 |
| act2 | v31-a2-0003 | Lahtnemulb (the matte chairman) | That voice was not mine. The words were not mine. | new [P] |
| act3 | v31-a3-0001 | Tasya (monitor) | Everyone is welcome. | cut from e1-a1-9-08 |
| act3 | v31-a3-0002 | Gerg (call) | Okay. That's patched. | cut from e1-a3-20-05 |
| act4 | v31-a4-0001 | Alyi (call) | Mas. The board has decided that you will no longer lead the company. | cut from a5-27-01 (the board's side keeps the whole take) |
| act4 | v31-a4-0002 | Neleh | Once more, before the others join. | new |
| act4 | v31-a4-0003 | Rima (O.S.) | We'll say we will. | new |
| act4 | v31-a4-0004 | Neleh | The staff want him back. The investors want him back. | new |
| act4 | v31-a4-0005 | Neleh | We've talked all day about him coming back, and we're no closer. | cut from a5-27-35 |
| act4 | v31-a4-0006 | Neleh (O.S.) | Step four, Mada? | new |
| act4 | v31-a4-0007 | Gerg | Best time there is. Nobody else is pushing anything. | cut from a5-29-05 |
| act4 | v31-a4-0008 | Mas | read me the letter. | new |
| act4 | v31-a4-0009 | Gerg | Okay. Pull it up. | new |
| act4 | v31-a4-0010 | Gerg (monitor) | That's the share sale. Everybody was about to get paid. | new |
| act4 | v31-a4-0011 | Mas | keep building. | new |
| act4 | v31-a4-0012 | Mas | and the rent? | **reuse** e1-a1-9-05 (the same take as Act One, deliberately) |
| act4 | v31-a4-0013 | Tasya (O.S.) | Due on the first. | new |
| act4 | v31-a4-0014 | Tasya (O.S.) | Down here. | new |
| act4 | v31-a4-0015 | Mas | gerg comes back too. | new |
| act4 | v31-a4-0016 | Terb | Gerg comes back too. | new |
| act4 | v31-a4-0017 | Neleh | Mario, it's Neleh, from the NopeAI board. We'd like to offer you the job of CEO, and to discuss a merger. | new (replaces a5-27-30) |
| tag | v31-tg-0001 | ELGOOG'S DEMO (a new voice, `elgoog-demo`) | What the quack! | new [V]: **a new cast entry**, a stock bright product-film voice, never a clone or a sound-alike of anyone; for EL, a library voice cast the same way |
| tag | v31-tg-0002 | Mas | that was close. | new |

### 6.3 Restored v2 lines (8): Kokoro takes exist; EL needs them

| Id | Who | Line | Kokoro take |
|---|---|---|---|
| e1-a1-10-06 | Sydney | Hi! Isn't 2022 a lovely year? 😊 | `audio/ep01/act1/dialogue/fast-v1/wav/e1-a1-10-06.wav` |
| e1-a1-10-01 | Mas | it's 2023, by the way. | `…/e1-a1-10-01.wav` |
| e1-a1-10-02 | Sydney | "You have not been a good user. I have been a good chatbot. I have been right, clear, and polite. I have been a good GNIB. 😊" | `…/e1-a1-10-02.wav` [V] |
| e1-a1-10-03 | Mas | you've been an extremely good gnib. | `…/e1-a1-10-03.wav` |
| e1-a1-11-04 | Gerg | Somebody leaked Atem's model. The whole thing's on a message board. | `…/e1-a1-11-04.wav` (v2 tagged it O.S.; now on camera) |
| e1-a1-11-05 | Mas | give it a minute. it'll be open source. | `…/e1-a1-11-05.wav` |
| e1-a3-19-01 | Remuhcs (monitor) | "Every single person raised their hand." | `audio/ep01/act3/dialogue/fast-v2/wav/e1-a3-19-01.wav` [V] |
| e1-a3-19-02 | Nole (monitor) | "It's important for us to have a referee." | `…/e1-a3-19-02.wav` [V] |

- **The Kokoro v2 Mas takes** (10-01, 10-03, 11-05) were read before the v3 Mas voice settings (lock.md §3). **The lock pass decides** whether they sit with the v3 takes or need re-reads. EL re-renders them anyway.
- **Pronunciations:**
  - **ATEM** is proposed "AY-tum" (v2), for the naming owner to confirm (critic §4.2);
  - **KRAM** is mute;
  - **GNIB** is as v2's take reads it;
  - the rest are in the cast lexicon.

### 6.4 Lines no longer needed (drop from the takes' plans)

- v3-vo-17, v3-vo-22, v3-vo-11 (replaced).
- e1-a1-7-01, e1-a1-8-03 (replaced by its cut), e1-a1-9-06, e1-a2-13-15 (replaced by its cuts), e1-a2-15-02, e1-a3-20-05 (replaced by its cut), e1-a3-21-03, e1-a3-21-07.
- a5-27-10, a5-27-11, a5-27-17, a5-27-30, a5-27-35 (replaced by its cut), a5-27-43, a5-27-46, a5-29-05 (replaced by its cut), a5-29-15, a5-29-19, a5-30-07, a5-30-18.
- e1-tg-32-01.

---

## 7. Facts

**Added to facts.md ("v3.1 rows"):**
- **V1**, Jul 18, 2023: Llama 2 with Microsoft as preferred partner [V].
- **V2**, May 16, 2023: Blumenthal's "that voice was not mine, the words were not mine…" [P].
- **V3**, Sep 13, 2023: Altman at the AI Insight Forum; every hand raised [V].
- **V4**, Nov 18, 2023: investors push for his return [V].
- **V5**, Oct 2023: the CSET paper's p. 29–30 wording [P, read directly].
- **V6**, Dec 6–7, 2023: the Gemini demo built from stills and text prompts [V].
- **V7**, Nov 20, 2023: Shear's post, on file [P].
- **V8**: Toner's 2024 account, held; not quoted, shown or stated.

**For the facts owner:**
1. **V1's wording.** Both pages were read through search summaries; nothing is quoted on screen. Fetch them if a quote is ever added.
2. **V3's attendance.** Nothing in the runner says he wasn't in the room: the monitor shows the replay and his hand at home is already up. Confirm the staging reads that way.
3. **The eulogy post card's timestamp** (L12) and **the page's "judgement"** (L1) are applied in the script. The pixel kits (`kits/post-card.ts`, `kits/staff-letter.ts`) are the kit owners' to change.

---

## 8. Open questions (for the lead, the guardrails owner and the facts owner)

1. **Launch night's board question (5.07). Guardrails owner.**
   - The public account that the board learned of the launch from social media is Toner's, in May 2024 (facts V8), and §F keeps 2024 accounts off screen.
   - The show quotes and states nothing: an invented question goes unanswered, and Gerg deflects with the launch's own phrase.
   - The lead's brief asked for it. **Fallback:** cut the two lines (−3.7 s); the seed then rests on Neleh's paper and the invite's names.
2. **"gerg comes back too." (S7.07-cont). Guardrails owner.**
   - It invents a demand inside a real negotiation. It is consistent with the letter's demand (reinstate both) and with the outcome (his real post), and it implies no hidden motive.
   - **Fallback:** cut both lines (−2.8 s); Gerg's post still pays the calm-off.
3. **"keep building." and "and the rent?" at 2 AM.** Both are invented and small, and neither says where anyone goes. **The guardrails owner confirms** they read as moves, not motives, at a contested moment.
4. **Neleh's paper (sc 20A). Facts and guardrails owners.**
   - The paper is quoted verbatim from its own PDF (V5).
   - His V.O. states one fact, and nobody voices a feeling about it.
   - #36's exclusions stand.
5. **Shear's post (V7)** could answer "did he get an answer?" more literally. It would sit in the 2 AM flood (1:01 AM, before 2:06) at about +4 s. **Not added.** "Okay." is played as the pointed non-answer instead. **Lead's call.**
6. **The chapter name** "the blip, told twice" should become "five days, told twice" in the assembly's chapter list (the newcomer called "the blip" insider slang). **The lead's file.**
7. **The camp matrix (guardrails §2b, Ep1)**, for the guardrails owner to update:
   - **Gains back:** Atem (the leak and the thirteenth key) and Macrosoft's Sydney.
   - **Loses:** the Nozama roast (the lighthouse item). Misanthropic's roast rests on the duel's memo and "In plain English: no."
   - **Unchanged:** the balance pair (RUMPT's repost ↔ Nedib's deepfake), and Sirrah's "two letters" returns to the balance column.
8. **The Ep2 owner:** Sydney is back in Ep1, so Ep2's "Sydney moves to Ep2" entry reverses (critic §4.1).
9. **The Kokoro v2 takes** for the restored Mas lines (§6.3): re-read or keep. The lock pass's call.
10. **Inherited and still open:** 23 (the invite's compression), 52 (Gerg's reading of the post), 55 (Sucram), 56 (Alyi's count), 57 (the reply prompt).

---

## 9. What a person has to check (nobody here can watch or listen)

1. **The shock:**
   - Does Alyi's sentence reach a first-time viewer as the news, over the thinned LEVERAGE?
   - Does the bright hard cut to `Remove MAS MANALT from the meeting?` read at a glance, and land as a jolt rather than a gag?
2. **The rewind:** does the whip onto Neleh's desk at 11:52 read as "earlier, the other side"? Does "Once more, before the others join." make THE PLAN sound like her, not the show?
3. **The board question at launch night:** does it read as a light, practical beat, not a wink? (The mood analysis wants launch night warm.)
4. **Sydney:** does the ChatGTP face in GNIB colours read as "ours" without a word? Does the reset "Hi!" land as a laugh?
5. **The hands runner:** does one held 2S·SCR frame keep the pinky scroll and the forum legible? Does "i've had mine up since may." read as his small vanity, and not as a boast about the real hearing?
6. **Neleh's paper:** does "she quoted us." read as level, with no opinion?
7. **2 AM:** do "read me the letter.", "keep building." and "and the rent?" read as his moves? Does the moved "gerg never waits to be asked." land as the exception it notices?
8. **The Runway insert:** does the stutter into stills read as "that demo was faked" with only "those are stills."?
9. **The takes** in §6, and the restored v2 Mas takes beside the v3 Mas voice.
10. **The runtime:** 20:58 is an estimate; the lock measures it.
