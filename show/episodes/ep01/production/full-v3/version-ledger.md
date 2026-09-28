# Ep1 version ledger: what we added and cut, v2 → v3.4, and the v3.5 proposal

> **Status: analysis, 2026-09-28.** This answers the showrunner's "i also want to go over what we've been adding and cutting each version so we make sure we're keeping the things we want". No other file was edited.
>
> **Both inputs changed while I worked**, and this ledger reads their latest state:
> - **SN** as of 13:07. The new notes are the president's deepfake, Alyi's reversal, and the tour and Nesnej.
> - **The v3.5 proposal (P35)** at its 13:09 revision, the scene-by-scene "full episode flow". It's mid-edit: Acts Two and Three follow the new notes, but Alyi's reversal and the runtime table don't yet. Its column may move again.
>
> **How to read it in 10 minutes:**
> - §0, the findings (1 minute);
> - §4, what to bring back and what P35 shouldn't cut (3 minutes);
> - §5, the keep list (2 minutes).
>
> §1–§3 are the reference tables behind them, one line per item.

**Sources and their short keys** (paths are relative to this folder unless marked):

| Key | File |
|---|---|
| SN | `show/production/SHOWRUNNER-NOTES.md` (cited by note number) |
| CAL | `show/bible/calibration.md` |
| V3P | `../stick/v3-plan.md` (the v2 → v3 plan, with cuts C1–C17) |
| S3, S31, S32, S33, S34 | `script-v3-notes.md`, `script-v31-notes.md` … `script-v34-notes.md` |
| L3, L31 … L34 | `lock.md`, `lock-v31.md` … `lock-v34.md` |
| T2, T3 … T34 | the stick transcript `../stick/transcript-v2.txt`; the lock transcripts `lock-transcript.txt`, `lock-v31-transcript.txt` …, which include on-screen text |
| F3 … F34 | the films' transcripts, `assembly/transcript.txt`, `assembly/transcript-v31.txt` … |
| N3, N32 | `read-v3-newcomer.md`, `read-v32-newcomer.md` |
| CR | `review-v3-critic.md` |
| M3, M32 | `mood-analysis.md`, `mood-analysis-v32.md` |
| A31, A32, A33 | `audit-v31.md`, `audit-v32.md`, `audit-v33.md` |
| PL | `PLAN.md` §5–§7 |
| P35 | `proposal-v35.md` |
| git | a commit hash |

**WHY tags:**
- **SHOWRUNNER**: a quoted note.
- **REVIEW**: which review asked for it.
- **LEAD**: my own call.

---

## 0. Findings at a glance

1. **v3.4 cut the deepfake he liked and kept the one he didn't want.**
   - We read "why does the senate have a deepfake along with biden" (SN 000) as "keep one", and kept the Senate's.
   - He has since said "i also liked the deepfake with the president. don't remove that." and "no i want only biden to have deepfake, not senate" (SN 00000).
   - P35 now swaps them: the president's fake is back (sc 35) and the Senate's clone is cut (sc 27).
   - **Unchecked:** the fake's old balance partner, RUMPT's repost, stays cut, and P35 doesn't mention the balance (S34 §3.2). This is for the guardrails owner.
2. **His newest asks are all missing from v3.4, as expected, since the notes (SN 0000, 00000) came after it.** P35 covers them:
   - motives, TPOOL, the 2018 and 2019 flashbacks, the first week, the scramble after the firing and faster exchanges;
   - the tour and Nesnej.

   **One ask isn't in P35 yet:** "it's also ont clear why alyi changed his mind".
3. **TPOOL was cut by us, not by him.** v3.1 cut it on reviewer notes: M3 §4 #11, N3 ("too fast"), CR R11. He later asked "why was the loopt flashback taken out". P35 rebuilds it.
4. **P35 conflicts with a showrunner note on placement.**
   - P35 puts the 2018 self-play night in Act One (sc 13, December 2022, after 3 AM).
   - SN 00000 moves it to DevDay and quotes him: "the flashback should not go right after the launch".
   - P35's earlier revision had it at DevDay, and the new one doesn't say why it moved. **Confirm with the showrunner.**
5. **P35 would cut three things earlier passes built or protected** (§4b):
   - Alyi's "Gerg has never waited to be asked." Since v3.2 it has been the only setup for Gerg waiting at 2 AM.
   - Neleh's look at the blank line, which is her one moment that isn't a joke.
   - "You already have an interim CEO." / "We'd like a different one.", which sets up v3.3's blank-page gag.
6. **The style range shrank.** v3.1–v3.3 had two Runway inserts. v3.4 has one, the hourglass, because the duck went, and P35 adds none. SN 9 asked: "we want to in the first episode preview the ability of your video creation versatility".
7. **Of what he said he liked, v3.4 has everything except the president's deepfake:**
   - the first-round score;
   - the Orb outro and its credit;
   - Mario's "used to sit where gerg sits";
   - Sydney and Atem.
8. **The biggest swings:**
   - the inner voice: 3 → 24 → 28 → 11 → 13 → 15 lines, and P35 has 18;
   - the duck: a card → cut → a Runway film → cut;
   - the deepfakes: three → one (the Senate's) → P35's one (the president's);
   - Mario's link to NopeAI: a plate → a V.O. → a plate → a V.O.;
   - "it does.": in, out, in.

---

## 1. Version by version (what reached the screen)

### v2 → v3 · the stick reel (22:51) → the first pixel film (21:26); story 22:02 → 20:44

The notes behind it are SN 1–4 (9-27). The plan is V3P; the changes are in S3 and the lock in L3.

| | Area | What | Why |
|---|---|---|---|
| ADDED | Whole film | Pixel picture replaces the stick figures, as a Kokoro film and an ElevenLabs film | SHOWRUNNER: "just do a full episode attempt with your best judgement" (L3) |
| ADDED | Whole film | Mas's inner voice goes from 3 lines to 24 (185 words) | SHOWRUNNER (SN 1): "it is hard to tell attach to mas as there is little that tells about his thoughts" |
| ADDED | Whole film | Room before the talk, held endings, the first J-cuts (the median exit goes from 2.1 s to 2.8 s) | SHOWRUNNER (SN 2): "pretty quick on transitions and feels like your not fully pulled into a scene" (L3 §2) |
| ADDED | Score | The first-round score, set to a mood map: warm launch night (an A♭ jazz trio), a swing odometer, a caper lobby, pomp, a warm 2 AM, the victory lap | SHOWRUNNER (SN 2): "not everything needs to sound super suspenseful" (M3 §0; git 851243f, 7d7a99f) |
| ADDED | Act Two, Senate | Mas says "…i have no equity in nopeai." aloud; it had been a rail | LEAD (S3 §5 #2) |
| ADDED | Act Four, the door | Tasya volunteers "Everyone's packed…", in place of Mas's interviewer's question | REVIEW: the insider read (S3 §5 #3) |
| ADDED | Outro | The Orb scans us, 10 s: "art · script · music · voices · edit: opus 5.5 / prompt: jgon" | SHOWRUNNER (SN 4): "i liked the orb outro. also it should say art, script, etc. …prompt jgon" |
| CUT | Card, labels | The disclaimer card, every (REPORTED), the asterisk, "(HE LATER SAID…)" and the Q* rail. The card is now the filename, 2 s | SHOWRUNNER (SN 3): "we don't need to explicitly write out parody and some other clear pointers" |
| CUT | Act One, lobby | Sydney's scene (planned for Ep2) | REVIEW: the v2 newcomer couldn't read "5 turns" or "remember me"; nobody in it wants anything (V3P C1) |
| CUT | Act One, bullpen | Kram's crate (the Atem leak) | REVIEW: the v2 newcomer: "no stakes" (V3P C2) |
| CUT | Act One, pause letter | The EMIT page (Rezeile's "shut it all down") | REVIEW: the v2 newcomer didn't know who or what (V3P C4) |
| CUT | Act Three, monitor | The hands runner (the VP's "two letters", the pinky promise, the forum, Nole's referee) and India's "hopeless" quote | REVIEW: the most fragmented stretch, and a fairness problem (V3P C10, §10) |
| CUT | Act Four | The step-four volley, Mario's Nozama call, the statement's first sentence, the side badges, the WHAT THEY DIDN'T KNOW card | SHOWRUNNER (SN 2): "i do also think it's getting a bit long", plus LEAD (V3P C13–C16) |
| CUT | Tag | The "What the quack!" card, the CTRL drawer, the glass prompt | REVIEW: the v2 newcomer couldn't read the last minute (V3P C12) |
| CUT | Smaller | The clone's "Are you nervous?", Notnih's plate, the scroll pour, the lightning egg, Gerg's million post, Nedib's "big desk" | REVIEW: the v2 newcomer, plus LEAD (V3P C5–C11) |
| CHANGED | Plates | Explanatory plates cut to names, e.g. `MARIO · EX-NOPEAI · THE CAREFUL RIVAL` → `MARIO` | LEAD: the voice carries who each person is (V3P §5; S3 §4) |
| CHANGED | Act One | "nobody noticed." → "someone noticed." | LEAD (S3 §2.2) |
| CHANGED | Act Four | TPOOL's rail loses "TWO STAFF REVOLTS · (REPORTED)" | SHOWRUNNER (SN 3), as above |

### v3 → v3.1 · film 21:26 → 21:52; story 20:44 → 21:10

The notes behind it are PL §5, the showrunner's notes on the v3 films.

| | Area | What | Why |
|---|---|---|---|
| ADDED | Act Four, opening | The shock comes first: Alyi's sentence on his side, a bright "Remove MAS MANALT from the meeting?" dialog, then the silence. THE PLAN moves to open the board's side, at Neleh's desk | SHOWRUNNER: "it should eel like a sudden shock… the video call is a bit hard to understand what cancel means" (PL §5) |
| ADDED | Act One, lobby | Sydney returns as the landlord's chatbot, with ChatGTP's face and an egg timer | SHOWRUNNER: "i want to bring back the syney and atem references at least" |
| ADDED | Acts One and Three | The Atem leak ("give it a minute. it'll be open source.") and its payoff, the landlord's thirteenth key | SHOWRUNNER: the same note |
| ADDED | Act Three | A short hands runner: the VP's chyron, the pinky promise, the forum's raised hands | LEAD (PL §5 item 2) |
| ADDED | Act One | Rezeile's op-ed lands on his desk, and the act-out reads PLEASE / REG | LEAD (PL §5), plus REVIEW: N3 ("Please what?") |
| ADDED | Act One, launch night | Rima: "Did anyone tell the rest of the board?" | REVIEW: N3 §6 ("plant the board and the candour problem early") |
| ADDED | Act Three | Neleh's paper on his monitor | REVIEW: N3 §3 #8 (the board are strangers when they strike) |
| ADDED | Act Four, Sunday | The reversal on screen: the STAFF and INVESTORS phones, the investors' ticker | REVIEW: N3 §3 #9 ("the biggest jump in the film") |
| ADDED | Act Four, 2 AM to Tuesday | His moves: he calls Gerg, "read me the letter.", "keep building.", "and the rent?", he accepts the invite, pulls the pin, "gerg comes back too." | REVIEW: N3 ("a charming but passive lead") (S31 §3.2) |
| ADDED | Tag; the return | Two Runway inserts: Elgoog's duck demo (near-photoreal, with "What the quack!") and the hourglass shatter | SHOWRUNNER: "you can also attempt the runway transition variations" (PL §5) |
| ADDED | Whole film | Six new V.O. lines, 28 in all ("her mouth is a beat late…", "thirteen.", "those are stills." …) | REVIEW: M3 §4 #5, CR and N3 wanted orienting lines |
| ADDED | Voices | The ElevenLabs Mas is recast (Jeremy) | SHOWRUNNER: "especially sam who sounds strangely russian" (git a4d9e42) |
| CUT | Cold open | The 1993 dialog. The rewind now collapses into the intro (26.7 s) | SHOWRUNNER (SN 2): "i think the cold open to intro is not very good transition" (git d00939d) |
| CUT | Act Four, that night | The TPOOL flash | REVIEW: M3 §4 #11, N3 12:57 ("too fast to register"), CR R11 (S31 §3.1) |
| CUT | Act Three | The lighthouse / Nozama item, the second Nedib deepfake, "the one with the pen." | REVIEW: CR #4 ("the worst 'out of nowhere' stay"), R5, U3 |
| CUT | Act Four | The V.O. lines "the race is tomorrow…" and "he's typing like it's launch night."; the Other Yrral's nod; the shut door | REVIEW: N3 12:01, CR R6/R12, M3 #12, plus the lead's brief (S31 §2.1) |
| CUT | Act One | Nole's Dec 3 post; Mas's "…still flawed, still limited…" post; Tasya's "upstairs at night" line; Sucram's back-stamp | LEAD: runtime trim O1 (L31 §1); REVIEW: N3 5:27 and 4:34, CR R9 |
| CUT | Act One | The "Push button" prompts burned into the picture | REVIEW: N3 ("a production bug") |
| CHANGED | Act Two, bay to Senate | The class photo match-cuts to his phone. The chairman's real "That voice was not mine." replaces the invented "Couldn't have said it better myself." | REVIEW: CR #18 (rated bad); N3 ("the single most confusing passage") |
| CHANGED | Act Four lines | "Hello." → "Down here."; "More. Soon." → "We'll say we will."; a clearer share-sale line; Ttemme gets a card | REVIEW: CR U4 and U6, N3 |
| CHANGED | Score | The first-round score is restored. The restrained re-score was committed and reverted within 33 minutes and never reached a film. Launch night's first minute is felt, chip and the Build, with no trio; the avalanche is 2 dB down | SHOWRUNNER (SN 2): "to be clear i liked the initial ost… beginning of most recent act1 was slgithly corny" (git 0206191 → c40a983, 9545c94; M3 §4 #2) |
| CHANGED | Act Four title | "the blip, told twice" → "five days, told twice" | REVIEW: N3 ("insider slang") |

### v3.1 → v3.2 · film 21:52 → 21:25; story 21:10 → 20:42

The notes behind it are SN 0 and 00, CAL and A31. The spine is in `agency-v32.md`.

| | Area | What | Why |
|---|---|---|---|
| ADDED | Act One | His moves: he posts the million himself, calls the landlord ("…we're going to need more servers." / "I'll bring a pen."), and GTP-4 ships on his click | SHOWRUNNER (SN 0): "if he is the main character he should be showing agency" (S32 §3.1) |
| ADDED | Act Two | He takes the seat nearest the teacher. At the Senate he proposes the agency in the record's words, and then comes "Would you come and run it?". He stamps his own tour dates | SHOWRUNNER (SN 0) (S32 §3.2) |
| ADDED | Act Three | He switches off the monitor; DevDay plays live on stage ("and today, you can build your own chatgtp."); he pauses sign-ups | SHOWRUNNER (SN 0), plus REVIEW: A31 #2 ("Mas watches a monitor for an act") |
| ADDED | Act Four | His goodbye post after the blow; the GUEST-badge walk-in, from his side, inside the board's side; the Macrosoft badge under the door | SHOWRUNNER (SN 0), plus REVIEW: A31 #3 (off screen for 3:40) |
| ADDED | Act One | The key ring shown large, with a beige NOPEAI key | REVIEW: A31 #7 |
| ADDED | Plates | One relation word at each first appearance: `GERG · CO-FOUNDER`, `MARIO · EX-NOPEAI`, `NELEH · NOPEAI BOARD` … | LEAD, from CAL §3, which followed SN 00: "make sure no previous advice was taken too extreme" |
| ADDED | Sound | Four lines now lead into new places | REVIEW: A31 #11 |
| CUT | Whole film | The V.O. goes from 28 lines to 11: the captions and the reads ("gerg wants to ship it…", "someone noticed.", "eleven keys…", "it does.", Mario's line, the three White House lines, "thirteen.", "my other company…", "those are stills." …) | SHOWRUNNER (SN 0): "a bunch of altman inner thoughts felt forced", plus REVIEW: A31 #1 |
| CUT | Acts One and Four | The "as you know" lines: Gerg's "That's our model in your search engine…", Oigneb's explanation, Neleh's thank-you, Sunday's first line | REVIEW: A31 #5 (each rewritten as a want) |
| CUT | Act Four | The blog post read aloud ("I'll read it once"); Alyi's "The staff will ask you what happened." | REVIEW: A31 #6; LEAD trim (S32 §10.6) |
| CUT | Act Three | The LEDs going dark, an omen with no payoff | REVIEW: A31 #2 |
| CHANGED | Act One | Gerg's "I'm shipping it." goes, so the launch is Mas's call | SHOWRUNNER (SN 0), plus REVIEW: N3 |
| CHANGED | Act Four | The board's side goes from 3:37 to 3:20, and his walk-in splits it | REVIEW: A31 #3; CAL §2 |
| CHANGED | Act Two out | The glass is redrawn as his face on the water. It still reads as a floating head | REVIEW: A31 #8 (A32 #7: only partly fixed) |
| CHANGED | Sound | The tag → outro jump drops from +20 to +13 dB; the card's downbeat is restored; the stale gap into Sydney is closed; Mas's V.O. goes up 2 dB | REVIEW: A31 #4, #13, #14. The +2 dB: reason not recorded (git d3a0047) |

### v3.2 → v3.3 · film 21:25 → 21:12; story 20:42 → 20:29

The notes behind it are PL §6: "a polish, not a rewrite".

| | Area | What | Why |
|---|---|---|---|
| ADDED | Acts One and Two | Two V.O. lines back: "it does." (the collar now arrives on Tasya's hand) and "he's not wrong." That makes 13 | REVIEW: A32 #1 (6:49 with no voice), M32 §4 #4 |
| ADDED | Act Three | A Tidder thread on his screen gives his post a reason | REVIEW: N32 #4, A31 B.2 #1 |
| ADDED | Act One | His silent face under "Did anyone tell the rest of the board?" | LEAD (PL §6 P1) |
| ADDED | Act Four | Rima's label steps back to CTO. Ttemme turns the page over, and its back is blank | REVIEW: N32 #7. No reason line, because the reported reason is unverified (S33 §3.2) |
| ADDED | Score, picture | Launch night's one warm accent (the Build in A♭ on "it likes me."); face lights on the close-ups that aren't jokes; the 406/407/406 counter on screen | REVIEW: M32 §4 #1 and #2; A31; N32 #8 |
| CUT | Act Three | The VP clip and the pinky promise. The forum's raised hands stay | REVIEW: N32 (where he checked out, #1); PL §6 S1 ("TV with no stake") |
| CUT | Act Two out | The glass. The act now ends on the chip-maker's line climbing off the frame, then his close-up | REVIEW: A31 #8, A32 #7, N3, N32 #1 (git f57bddb) |
| CUT | Act Four | "Down here."; Ttemme's "Okay."; the walk-in's second date | REVIEW: N32 #8, A31 B.2 #5, A32 |
| CUT | Act Three, opening | The Atem monitor shot, folded into the background; Kram's plate dropped | REVIEW: A32 #3, A33 §3 #1 |
| CHANGED | Act Four | The employee, not Tasya, says "Everyone's packed…". Tasya's "below, above, around" becomes a podcast clip on the TV, cut to the confirmed sentence | REVIEW: N3 and N32 ("who says it?"), A31 #12, A32 #10. LEAD on the dropped clause, which the facts file has on hold (S33 §3.4) |
| CHANGED | Picture | Two-part plates; the million post as his thumb and one line; the chip order in Mario's hand; the anchor drawn generic, not as the senator | REVIEW: A32 #2 and its smaller notes; LEAD on the hand and the anchor (S33 §3.1, §3.3) |
| CHANGED | Sound | Four v3.2 defects fixed (the lobby click, an unfaded stop, the night re-entry, the whip tick); the avalanche +1.66 LU | REVIEW: A32 #4–#6, M32 §4 #3 (A33 §2) |

### v3.3 → v3.4 · film 21:12 → 20:55; story 20:29 → 20:12

The notes behind it are SN 000 and PL §7.

| | Area | What | Why |
|---|---|---|---|
| CHANGED | Whole film | The V.O. becomes his plan, hinted, with no predictions (13 → 15 lines): "…it goes out tonight anyway.", "…we can't buy that many servers. someone can.", "gerg's not on it. probably the budget. good. i'll ask for more compute." | SHOWRUNNER (SN 000): "too much just predicting what someone is going to say next"; "mostly planning and directing things as he intends, with the exception he was not expecting the board"; "don't make anything too on the nose" |
| ADDED | Act One | Mario's line is back ("mario used to sit where gerg sits…"), and his plate goes back to `MARIO` | SHOWRUNNER (SN 000): "i also liked the previous clarification [that mario] used to be at [nopeai]" |
| ADDED | Acts Two and Three | "mine's half written." on "put it in writing"; "my other company. for when it gets harder to tell."; at DevDay, "a year ago, forty users and a nice thread." | SHOWRUNNER (SN 000) |
| ADDED | Act Four | "gerg walked out for me."; on his return, "they had four votes. i had the landlord. the money. gerg." over the firing's drawing | SHOWRUNNER (SN 000): "we want mas to look like the mastermind…" |
| ADDED | The EL film's intro | Jeremy re-reads Mas's intro line | SHOWRUNNER (SN 000): "in the intro mas's voice is not replaced" (git 1330aa4) |
| CUT | V.O. | "she'll go for three.", "he's not wrong.", "i made it for everyone else.", "gerg. he'll say he's compiling." | SHOWRUNNER (SN 000), on predictions; CAL §5 |
| CUT | Acts Two and Three | The May 12 altered clip and its repost; Nedib's deepfake ("When the hell did I say that?", "which one's real?") | SHOWRUNNER (SN 000): "why does the senate have a deepfake along with biden". **Misread:** he has since said "no i want only biden to have deepfake, not senate" (SN 00000) |
| CUT | Act Two | Sirrah's catchphrase | LEAD: it keeps the two parties even once both deepfakes are gone (S34 §3.2) |
| CUT | Tag | The duck demo (the Runway insert, with "What the quack!") | SHOWRUNNER (SN 000): "actually i changed my mind, the duck should just be cut". His first word was "make it land" (git 81f30df) |
| CUT | Act Four, Saturday | Alyi's "That is the company telling us." The phones light up instead | LEAD: the coordinator's reading of "don't make anything too on the nose" (L34 §3) |
| CHANGED | Score, sound | A refit: a settle before JOIN, a pizz chord for the phones, the knee's notes under the return's count. AAC encoder bursts were found and fixed | LEAD (git 39f26d3, fcab2a4) |

---

## 2. Swings: added then cut, or cut then restored

In the table, **in** means on screen and **—** means not. The v3.4 column is the current film.

| Item | v2 | v3 | v3.1 | v3.2 | v3.3 | **v3.4** | P35 | Where it stands |
|---|---|---|---|---|---|---|---|---|
| **TPOOL flash** | in | in, rail trimmed | cut | — | — | **—** | back, rebuilt (sc 43, about 7.5 s) | We cut it on reviewer notes; the showrunner asked "why was the loopt flashback taken out" (SN 0000) |
| **Sydney** | in | cut | back | in; her rule trimmed to "House rules, Sydney." | in | **in** | kept | His ask; steady since v3.1 |
| **The Atem leak and the 13th key** | in (a crate) | cut | back, with "thirteen." | in; the count's V.O. cut, the keys shown | payoff moved to the background | **in** | kept (sc 20, "now a response") | Steady |
| **Inner voice (lines)** | 3 | 24 | 28 | 11 | 13 | **15** | 18 | The target moved too: 15–25 (V3P) → 10–14 (SN 0) → 14–18 (CAL §5) |
| **"it does."** | — | in | in | cut | back | **in** | kept | Settled once the collar arrived on screen (S33 V1) |
| **"she'll go for three."** | — | in | in | in (kept against A31) | in | **cut** | — | Cut by SN 000 (no predictions) |
| **"i made it for everyone else."** | in | in | in | in (cut in draft 8, back in 8.1) | in | **cut** | — | Replaced by the planner's Orb line |
| **"he's not wrong."** | — | in | in | cut | back | **cut** | — | Act Two's one line is now "mine's half written." |
| **VP clip and pinky promise** | in | cut (with the whole runner) | back | in | cut | **—** | — | Only the forum's raised hands are left |
| **Deepfakes** | 3: the bay clip, the Senate's clone, Nedib ×2 | same | Nedib ×1; the chairman's real line | same | same; the anchor drawn generic | **1**, the Senate's: the wrong one | 1, the president's (sc 35); the Senate's cut (sc 27) | He liked the president's (SN 00000); the balance needs a check |
| **The tour and Nesnej** | the EU flip, with NOTERB and a "blackmail" stamp | poster only; "blackmail" and NOTERB cut (S3 C7) | poster | he stamps the dates | poster | **poster, then Nesnej at the rooftop** | rebuilt as his leverage game, with NOTERB's "blackmail" post; the signing; Nesnej planted in Act One (sc 29–30A) | "the worst transition is to the tour and jensen" (SN 00000) |
| **The duck** | a text card | cut | Runway film | film ("those are stills." cut) | film | **cut** | — | SN 000, after "make it land" |
| **The Act Two glass** (the crack runs into his reflection) | in | in | in | redrawn | cut (the line climbs off frame, then his close-up) | **—** | — | It read as "a man floating in a water tank" (A31 #8) |
| **Cancel on the call** | in | in | the Remove dialog | Remove | Remove | **Remove** | Remove | "hard to understand what cancel means" (PL §5) |
| **The 1993 dialog in the cold open** | in | in | cut | — | — | **—** | — (`HOW DO I WIN?` retired, choice 8) | SN 2; SN 0000: "i don't want flashback to 1993" |
| **Mario's link to NopeAI** | plate `EX-NOPEAI · THE CAREFUL RIVAL` | V.O. | V.O. | plate `MARIO · EX-NOPEAI` | plate | **V.O.**, plate `MARIO` | V.O., plus his "Point two" | SN 000 liked the V.O. |
| **Key count** | — | "eleven keys…" | adds "thirteen." | both cut; the ring shown large | 13th key in the background | **shown, not said** | same | The return's count ("i had the landlord") now pays off the landlord |
| **Score colour** | temp; about four-fifths minor-key suspense | first round, with a jazz trio at launch | first round restored, trio out; the re-score reverted, never in a film | same | adds the A♭ accent | **same, refit** | refit | SN 2: "i liked the initial ost"; not the trio, and not "overly generic" |
| **Gerg's "That's our model in your search engine…"** | in | in | in | cut (A31 #5) | — | **—** | back (choice 7) | Proposed restore |
| **"gerg never waits to be asked."** | Alyi says it | Alyi, plus Mas's V.O. | V.O. moved | V.O. cut; Alyi's line alone | Alyi | **Alyi** | Alyi's line cut (choice 6) | See §4b |
| **Tasya at the door** | "Hello." | "Hello." | "Down here." | "Down here." | cut | **—** | — | A look at the floor carries it |
| **Runway style leaps** | 0 | 0 | 2 | 2 | 2 | **1** (the hourglass) | 1 | The duck took one with it |
| **Runtime (episode)** | 22:51 | 21:26 | 21:52 | 21:25 | 21:12 | **20:55** | about 22:53 or more | From "getting a bit long" (9-27) to "it is ok to make a bit longer" (9-28) |

---

## 3. What the showrunner asked for or liked, and where each stands

### 3a. His notes

"P35" is the 13:09 revision.

| Note (quote · where) | v3.4 | P35 |
|---|---|---|
| **Liked:** "to be clear i liked the initial ost that was presented" (SN 2) | **Present.** The first round restored in v3.1, refit only since (M32 §3.5; PL §6 M2) | Kept; refit only |
| **Liked:** "i liked the orb outro. also it should say art, script, etc. created by opus 4.5, prompt jgon" (SN 4) | **Present.** Outro B, crediting Opus 5.5 (T34, 20:47) | Kept |
| **Liked:** "i also liked the previous clarification [that mario] used to be at [nopeai]" (SN 000) | **Present** (F34, 5:50) | Kept (sc 21) |
| **Liked:** "i think you did a good job on narrative and pacing overall" (PL §5, on v3) | The v3 spine is kept; conversations still play out (A33 §4) | — |
| "the beginning of most recent act1 was slgithly corny… not toning down to overly generic" (SN 2) | **Present.** No trio, the A♭ accent, no generic pad (M32 §3.5; A33 M1) | Kept |
| "we don't need to explicitly write out parody and some other clear pointers" (SN 3) | **Present.** The filename card and no `(REPORTED)` (A32 §2) | Kept |
| "don't make mas's unsound narration forced/corny… everything still feels distance" (SN 1) | **Present.** 15 lines, in every act | 18 lines |
| "i think the cold open to intro is not very good transition" (SN 2) | **Changed.** The 1993 dialog is gone; the seam is still marked "for an ear" (A33 §2) | Kept |
| "i want to bring back the syney and atem references at least" (PL §5) | **Present** (T34, 5:17–5:49) | Kept (sc 17, 20) |
| "sam who sounds strangely russian" (PL §5) | **Present.** Jeremy, including the intro | Kept |
| "it should eel like a sudden shock… hard to understand what cancel means" (PL §5) | **Present.** M32 calls it "the film's strongest moment now" | "Untouched" (sc 38–39) |
| "you can also attempt the runway transition variations" (PL §5) and "preview the ability of your video creation versatility" (SN 9) | **Changed.** One insert left, the hourglass | **Missing** a second leap (§4a, #4) |
| "if he is the main character he should be showing agency" (SN 0) | **Present.** Carried along 19 → 9 places (A32 §1) | Kept, plus the war room |
| "a random sequence of events" (SN 00) | Mostly fixed; N32 still calls Act Three "the most random-feeling stretch left" | Act Three is unchanged |
| "too much just predicting… rather than useful narration/insight" (SN 000) | **Present.** No predictions (S34 §3.4) | Kept |
| "we want mas to look like the mastermind…" (SN 000) | **Present, hinted:** the return's count | Deeper: his 2019 drawing and the war room's count |
| "don't make anything too on the nose" (SN 000) | **Present** (S34 §3.1; L34 §3) | Kept |
| "why does the senate have a deepfake along with biden" (SN 000) | **Misread.** We kept the Senate's fake and cut the president's | Swapped (see the next two rows) |
| **Liked:** "i also liked the deepfake with the president. don't remove that." (SN 00000) | **Missing.** Cut in v3.4 | **Yes:** restored as in v3.3, with "which one's real?" and the Orb's verdict (sc 35) |
| "no i want only biden to have deepfake, not senate" (SN 00000) | **Wrong way round:** the Senate's clone is the fake still in | **Yes.** The clone is cut, and "i get paid enough for health insurance." moves to Mas (sc 27). The balance isn't addressed |
| "it's also ont clear why alyi changed his mind" (SN 00000) | **Missing.** Only "alyi voted." / "He did both." and his regret post | **Not yet** (as of 13:09) |
| "the worst transition is to the tour and jensen. it comes out of nowhere and is not clear what it is" (SN 00000) | **As criticised:** the poster, then Nesnej's register at the rooftop | **Yes** (sc 29–30A; Nesnej planted in sc 8 and 13) |
| "the duck should just be cut" (SN 000) | **Done** | Kept out |
| "in the intro mas's voice is not replaced" (SN 000) | **Fixed** (git 1330aa4) | Kept |
| "for none of the people including mas it is never shown why they're doing that" (SN 0000) | **Missing** | **Yes:** sc 13, 19 and 28, and the others' first wants (sc 11, 14, 20, 21, 23) |
| "why was the loopt flashback taken out" (SN 0000) | **Missing** | **Yes** (sc 43) |
| "it's still not emphasized why mas was fired" (SN 0000) | **Thin:** Rima's question, Neleh's paper, the post | **Partly, by design.** The desk props and his 2019 board; the guardrails bar a stated reason (SN 000, "Still firm") |
| "i don't want flashback to 1993" (SN 0000) | Not in the film | **Yes**, retired (choice 8) |
| "key ai development steps… alphago, atari rl, dota, rubik's cube" (SN 0000) | **Missing** | **Partly.** Only ATOD (Dota) in Ep1; the rest go to the season's milestones |
| "at least one more related thing… mas's vision with openai" (SN 0000) | **Missing** | **Yes:** the vision post (sc 19) |
| "i would prefere having more to explore at the dinner later" (SN 00000) | Not in the film | **Yes:** the dinner saved for Ep3; 2019 in its place (sc 28) |
| "how can we show he is surprised and has to frantically figure out how to fix things post firing… social network" (SN 00000) | **Missing.** After "super." come a post and the carve | **Yes** (sc 40–42) |
| "dialogue back and forth could also be faster paced… tho it's not too bad now" (SN 00000) | Unchanged | **Yes:** the pace table |
| "show some rl or similar innovation where mas and alyi… talk" (SN 00000) | **Missing** | **Yes** (sc 13), but see the next row |
| "the flashback should not go right after the launch" (SN 00000: moved to DevDay) | n/a | **Conflict.** It's placed in Act One, December 2022, after 3 AM. An earlier P35 revision had it at DevDay; the move isn't explained. **Confirm** |
| "there is also not any showing of what chatgpt can do upon release… what mas feels about it" (SN 00000) | **Missing** | **Yes:** the first weeks and 3 AM (sc 10, 12) |
| "if anything we need more in act 1 and less post firing. it is ok to make a bit longer tho" (SN 00000) | n/a | **Mostly.** Act One +1:50; Act Four −14 s (8:28 → 8:14); the episode about 22:53. The runtime table predates the 13:09 changes to Acts Two and Three |

### 3b. Praised by a reviewer, or protected by a pass, then cut (flagged)

| Item | Praised or protected by | Cut when, and why | Flag |
|---|---|---|---|
| The TPOOL flash | CR row 32: "Keep" (weak on purpose) | v3.1 (M3 #11; N3) | **Restore.** The showrunner asked for it |
| "gerg's not on it. alyi set it up. probably just the budget." | A31: "The best V.O. in the film" | v3.4 rewrote it (the "alyi set it up" is gone) | Fine. It's still the one wrong read, and P35 pays it off ("the budget. i said the budget.") |
| "i made it for everyone else." | A31 KEEP ("The irony is his"); S32 §10.2 restored it | v3.4, the planner voice | Driven by the showrunner. Leave it cut |
| The rooftop act-out (the crack and the glass) | M3 §0: "lands as intended" | v3.3 (A31 #8, A32 #7; both newcomers were confused) | Leave it cut |
| "someone noticed." | N3's "most pulled in" #5 | v3.2 (A31: "The odometer says it") | Low. P35's 3 AM beat does the job |
| Gerg's TV question; Tasya's "upstairs at night" | V3P §3: "Not cut, on purpose… they're character" | v3.2 (A31 #5); v3.1 (N3 4:34) | P35 restores Gerg's. The wink can stay cut |
| The Nozama roast | S3 C10: "Ep1's Misanthropic roast" | v3.1 (CR #4) | Leave it cut. P35's "Point two" gives Mario a beat |
| The Cancel/OK call | N3's "most pulled in" #2 ("Real dread") | v3.1, at the showrunner's ask | No loss. The Remove version tested stronger (M32 §3.1; N32 #1) |
| Act Three's intimacy | M3 §0 | v3.2 made it busier: cuts a minute went 12.2 → 15.2 (M32 §3.6) | Watch. P35 leaves Act Three as it is |
| THE PLAN blueprint, whole | N3 #1 and N32 #3: "the clearest exposition in the film" | Still in. P35 cuts "Three of us stepped down this year." | Low. The blueprint's count carries it |

---

## 4. Cuts we may want back

### 4a. Ranked

| # | Item (cut in) | Reason | Recommendation |
|---|---|---|---|
| 1 | **The president's deepfake** (v3.4) | He said "i also liked the deepfake with the president. don't remove that." (SN 00000). It also pays off the Orb's "for when it gets harder to tell." | **Restore,** as in v3.3 (P35 sc 35). First have the guardrails owner re-check the balance: its old partner, RUMPT's repost, stays cut, and Sirrah's catchphrase was cut in v3.4 only to even things out (S34 §3.2) |
| 2 | **TPOOL** (v3.1) | The showrunner asked. It gives the two faint marks a meaning they've lacked since v3.1 (A31 B.2 #4; A32 §3 #7), and it makes the return's count a lesson learned | **Restore in a new form,** as P35 sc 43 option A |
| 3 | **The EU flip and Brussels' "blackmail"** (v3) | "the worst transition is to the tour and jensen… not clear what it is" (SN 00000). The poster gave nobody a stake | **Restore in a new form:** his leverage game, as P35 sc 29 |
| 4 | **A second style leap** (v3.4, with the duck) | SN 9 and SN 14 want the range shown "only where it makes sense"; Ep1 now has one leap | **Restore in a new form:** one leap with an owner inside a v3.5 memory (the 2018 arena on the monitors, say), if it passes CAL §7 |
| 5 | **Nole's Dec 3 post**, "CHATGTP is scary good…" (v3.1) | It was cut only for runtime (L31 O1). It's a real reaction from a key player the showrunner wants glimpsed (SN 0000) | **Restore in a new form,** as one card in P35's first-weeks montage (sc 10) |
| 6 | **Gerg's "That's our model in your search engine…"** (v3.2) | V3P protected it as character; A31 #5 called it "as you know"; P35 wants it for clarity | **Restore,** as P35 choice 7 proposes |
| 7 | **Kram's plate** (v3.3) | P35 gives Kram a want ("open, as a weapon"), and N32 found he's "nobody in Ep1" | **Leave it cut,** unless Kram gets a line or a beat. Then a two-part plate (CAL §3) |
| 8 | "i made it for everyone else.", "he's not wrong.", "she'll go for three.", "someone noticed." | Each lost to a line the showrunner asked for; the voice is already at 18 in P35, the top of CAL §5's band | **Leave them cut** |
| 9 | The duck, the May 12 clip, the VP clip and pinky promise, the Act Two glass, Cancel, the 1993 dialog, "Down here." | Each was cut at the showrunner's word, or after the same confusion in two or more reads | **Leave them cut** |

### 4b. Cuts P35 proposes that undo earlier work (reconsider before agreeing)

| P35 cut | What it costs | Recommendation |
|---|---|---|
| Alyi's "Gerg has never waited to be asked." (choice 6, sc 46) | Since v3.2 it's the only setup for Gerg waiting at 2 AM ("So. Do I tell everyone to pack?") (S32 §2.3). P35's earlier revision said to keep it, as the told-twice device | **Keep the line**, even if "Nobody asked him to go." goes |
| "Then we'll write step four ourselves." (sc 47) | It's trimmed −5.0 s, the whole of S4.07, which is Neleh looking at the blank line. That's her one moment that isn't a joke (V3P §5), and it was lit for it (M3 §4 #4; P18) | **Keep her look**; the line can go |
| "You already have an interim CEO." / "We'd like a different one." (sc 49) | It sets up v3.3's blank-page gag, and it's the only spoken sign that Rima is out (S33 §3.2) | **Keep it** |
| Shorter holds on Tuesday (sc 54) | CR §5 lists S7.09's long hold (the calm-off) under "Don't trim"; M3 counts the calm-off among what lands; S7.13 is a fixed 264-frame Runway insert | **Keep S7.09 and S7.13 at length** |

---

## 5. The keep list for the final pass

The elements that must survive v3.5:

- **The frame:**
  - the cold open ending on the rewind into the intro;
  - the 30 s intro;
  - the 2 s filename card;
  - the Orb outro, "…edit: opus 5.5 / prompt: jgon";
  - no disclaimers or hedge labels.
- **The sound:**
  - the first-round score's own sound, with the A♭ accent: no trio, no generic pads, and no wider re-score without his yes (CAL §6);
  - the one silence, from the Remove click to the buzz.
- **The voice's rules:**
  - silence from the call's first tile to "super.";
  - none at the testimony or at Neleh's paper;
  - no reason given for the firing;
  - nothing that has him rally the staff letter;
  - hinted, never "plan" words; at most one prediction;
  - Jeremy as the EL Mas, the intro included.
- **Act One:**
  - launch night whole, with "Did anyone tell the rest of the board?", "Six years and eleven months." and "i know. i still read it twice.";
  - his million post;
  - "…someone can." → the call → "I'll bring a pen.";
  - the check, the collar and "it does.", "and the rent?", the key ring;
  - "ours does that too."; Sydney; the Atem leak;
  - Mario's V.O., his memo and "Addendum.";
  - EMIT → PLEASE / REG.
- **Act Two:**
  - Mario's sub-concerns; "how's the dancing?"; "mine's half written.";
  - at the Senate: his proposal, "i love my current job.", the wallet, "i have no equity in nopeai.";
  - no fake voice at the Senate (SN 00000).
- **Act Three:**
  - the Orb; the raised hands; the Tidder thread → the post → the edit;
  - Neleh's paper as a held face;
  - **the president's deepfake**, "which one's real?" and the Orb's verdict: the one fake in the episode (SN 00000);
  - DevDay live; "super." chosen from three; the sign-up pause;
  - the invite with four names.
- **Act Four:**
  - the shock opening: the suite, the wrong read, Alyi's sentence, the Remove dialog;
  - THE PLAN on the board's side; "Is his feed frozen?" / "No. That is just him.";
  - **Alyi's "Gerg has never waited to be asked."**, **Neleh's look at the blank line**, **"We'd like a different one." → the blank page**;
  - the walk-in;
  - 2 AM: he calls, "read me the letter.", "alyi voted." / "He did both.", "keep building.";
  - the door: "and the rent?" / "leave it open.";
  - Tuesday: the invite, the pin, "we'll stand.", "gerg comes back too.", and "of what?" / "good question." with its hold;
  - the hourglass;
  - "they had four votes. i had the landlord. the money. gerg.".
- **The coda and tag:**
  - the Q* vault and "it's a preview.";
  - "zero ill will" over the nameplate;
  - the cover, "it looks calmer than me.", "that was close.";
  - the Grey Lady and "noted.";
  - no duck.
- **Every principal keeps one moment that isn't a joke** (SN 2; V3P §5):
  - Gerg's look at 2 AM;
  - Rima's "what do we tell them?";
  - Alyi's count;
  - Neleh's blank line;
  - Tasya's door.

**Still to add; this isn't a survivor:** Alyi's reversal, made clear. SN 00000 asks for its cause on screen and his own public words. P35 (13:09) doesn't have it yet.
