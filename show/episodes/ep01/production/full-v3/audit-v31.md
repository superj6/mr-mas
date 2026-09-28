# Ep1 v3.1: the final audit (`audit-v31`, 2026-09-28)

> **The film audited:** `out/ep01/full-v3/ep01-v31.mp4` (Kokoro, 21:51.7). **All timecodes are on that film's clock (m:ss.ss).** The ElevenLabs film runs about 7 s longer by the end, so its timecodes drift later.
>
> **The brief:** the showrunner's "make sure nothing feels too forced, too out of the blue (that is not intentional), and that sound transitions are happening properly", plus SHOWRUNNER-NOTES note 0 (agency, not narration; inner voice pruned to about 10–14 lines).
>
> **How it was done. Nobody watched or listened.**
> - **A and B are judged.** I looked at 875 frames sampled every 1.5 s, which covers every shot (4 fps frames were pulled for the scene changes), and read them against the timelines' beats, captions and lines and the film transcript (`assembly/transcript-v31.txt`).
> - **C is measured.** The film's audio was checked at every beat boundary in the six locks (221 boundaries, 209 of them picture cuts, 46 of them place changes) and at the 9 chapter seams.
>   - Per-segment mixes, room/SFX stems and score renders were measured on each segment's own clock. The film's audio matches its mixes to 0.02 ms and 0.02 dB, so the numbers hold for the film.
>   - The measures are:
>     - K-weighted loudness over 1.5 s and 0.4 s on each side of the cut;
>     - the floor (the quietest 50 ms window within ±1.5 s);
>     - the score's level either side;
>     - the band spectrum 0.3 s either side;
>     - second-difference click ratios at the cut, plus a scan of every 0.2 s block of every mix;
>     - where the room stem's spectrum turns (lead or trail);
>     - the first and last words either side.
>   - Every score stop or start that lands on a cut was checked against the cue sheets' windows, marks and designed silences.
>   - Scripts and the raw numbers are in the session scratchpad (`audit-v31/`: `measure.py`, `seams.py`, `holes.py`, `cuts-*.json`, `review.txt`). They're not kept in the repo.
>
> Nothing was edited or committed.

---

## 0. The ranked fix list

Ranked by how much each one pulls a viewer out.
- **Channel:** S script / V.O., P picture, M music, X mix/assembly.
- **Cost:**
  - **S** is an edit or mix with no new takes or art;
  - **M** needs new takes, a new cue edit or 1–3 new shots;
  - **L** is a new scene.

| # | Time | What | Why it's a problem | Ch. | Concrete fix | Cost |
|---|---|---|---|---|---|---|
| 1 | whole film (28 V.O. lines) | **The inner voice narrates.** 17 of the 28 V.O. lines tell us what the picture or the next line already shows, explain a joke, or plant a later payoff. The worst is the story's first line, **1:02.9** "gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first.", which lays out the next 50 s before they play. | Note 0: "a bunch of altman inner thoughts felt forced". When the narrator explains, the scene reads as written rather than lived, and the good lines lose their weight. | S | Keep the 11 lines in §A.1's keep list (8 firm, 3 optional). Cut 14, and convert 3 into picture or action: Mario's card, the raised hand, Neleh's byline. Re-time the holds that exist only to carry V.O. (v3-5.06b −4 s, 18.02 −2 s, v31-19.03 −3 s, v31-20.07 −2 s). | S |
| 2 | 9:57–12:22 (all of Act Three) | **Mas watches a monitor for an act.** 6 of its 7 scenes are a screen watched from his desk. His one self-started act, the **10:48.6** Tidder post, has no trigger, and nothing in the plot follows from it. The LEDs stopping at **10:52.0** is an ominous sign that never pays off. | Note 0: "not really showing him take any action, just existing through the moments". Of the whole film, this is where he's most carried along. | S/P | For v3.2, two moves from the record or small invented stakes:<br>• **The post comes from something.** The hands runner ends on `BILLS: 0` and his hand already up; he types to the room that asked him (his want to be noticed). Drop the LEDs-stop, or pay it off later.<br>• **Neleh's paper: cut the V.O.** Her byline names her board seat. Any act of his about the paper is a contested moment (he reportedly raised it with her), so the guardrails owner rules before it's written. If that's refused, the post above is Act Three's act. | M |
| 3 | 13:06–16:46 | **Mas is off screen for 3:40** (the board's side). He appears only as a CCTV figure at **15:46**. | The told-twice device is good, but for the longest stretch the lead isn't in his own story. The Sunday turn happens to him. | P/S | At 15:46 give him 3–4 s of his own: he clips the GUEST badge on, walks in, and posts "first and last time i ever wear one of these" (public record). **Then** cut to the board's CCTV shot, so their "we're no closer" follows from his move. | M |
| 4 | **21:41.58** | **The tag→outro seam jumps +20 dB in 100 ms** (−34 → −13 LUFS momentary; 400 ms windows +20.0 dB). The Ep2 hook, "a sound only" (the vault hum), gets 1.25 s alone and is then run over. | The biggest step at any seam in the film. The last creative beat of the story is stepped on. | X | Let the hum sound alone for 2.0 s: add 0.75 s to 33.05's black, or pre-roll the outro. Crossfade the hum under the outro's first 0.5 s. Start the outro's audio with a 150 ms fade and its first hit −6 dB. | S |
| 5 | 4:49.0 · 6:16.7 · 14:14.5 · 15:46.7/15:50.8 | **"As you know" lines.**<br>• Gerg tells Tasya his own product ("That's our model in your search engine. Are you really going after Elgoog with it?").<br>• Oigneb explains the letter to one of its signers ("We're asking every lab to pause for six months.").<br>• Neleh thanks Rima for what she agreed to.<br>• Neleh says what the phones and the ticker already show ("The staff want him back. The investors want him back." / "We've talked all day…"). | Each one is information passed to someone who already has it. The Sunday pair is the worst: the picture shows it, then she says it. | S | Rewrite each as something the speaker wants:<br>• Gerg: "Elgoog's going to hear about this from a *search box*."<br>• Oigneb: "You signed it. Now put the iron down."<br>• Neleh to Rima: "You'll be asked. Say the post."<br>• Sunday: cut her first line, and keep "We've talked all day about him coming back, and we're no closer." played on the phones. | M |
| 6 | 14:02.2 · 19:31.9 | **The "I'll read it once" device, twice.** Neleh reads the blog post aloud over a 14 s static screen ("Step two. I'll read it once before it goes up."), and Terb uses the same excuse ("Before this goes out, I'm reading it once."). | A contrivance to get a real quote heard. Using it twice exposes it. | S/P | Keep Terb's, since he's in a room with people. For the blog post: cut "I'll read it once…", let the text type itself on screen for 6 s with her lips reading, then "Any objections?". | S |
| 7 | 4:08.4 → 10:05.1 (and 5:38.6) | **The key count is a code a newcomer can't read.** "eleven keys. he's here for the twelfth." counts a key ring a few pixels wide. Six minutes later, "thirteen." pays it off over a monitor caption, and the Atem leak it rests on (**5:38.6**) is nobody's problem. | Out of the blue twice: the V.O. counts something we can't see, and its payoff needs a memory we don't have. | S/P | Cut both V.O. lines. If the Atem thread stays, show the ring **large** once (ECU as Tasya pockets the twelfth key at 4:45 "weeks on") and let v31-18.00b land on the key being hung, with no V.O. Otherwise cut v31-18.00b (6.2 s). | S |
| 8 | 9:52.1–9:56.6 | **The Act Two act-out reads as a man floating in a water tank** (a head and a ring inside the glass), not his reflection. | An unintended image, and it's the act break. The v3 newcomer read "in over his head" too. | P | Draw the reflection on the water's surface (face only, broken by the crack, no body, no ring), or cut 17.12 and end on the sky's crack and his look down. | M |
| 9 | 14:54.1 + 18:00.1 | **A duplicate tagline.** Alyi's "Gerg has never waited to be asked." and Mas's V.O. "gerg never waits to be asked." come 3 minutes apart. | It reads as the writer's motto for Gerg. The second one explains a beat the picture already plays (Gerg waiting for his word). | S | Cut the V.O. at 18:00.1. Gerg's held look and "keep building." carry it. | S |
| 10 | 1:56.3 (v3-5.06b) | **A 6.3 s hold on Alyi's reflection, with no reaction,** carrying "alyi asks that about everything we build. he means it every time." | A hold that exists for the V.O. The line explains a character trait. | S/P | Cut the V.O. and trim the hold to 2.0 s (his look at the button is enough). | S |
| 11 | 18:04.5 · 14:33.0 · 6:12.5 · 20:43.2 | **No dialogue leads a new place.** At the 37 room-to-room changes, one line leads (3:15.2, Rima) and none trails. Rooms always crossfade (0.5–1.0 s lead), but a line never pulls us into the next scene. | SHOWRUNNER note 2 ("no line leads a scene with sound"). The measurement says it's still true. | X | Pre-lap four hooks:<br>• Tasya's "Don't get up, Mas." 0.8 s under Gerg's tile (18:04.5);<br>• "Is this a coup?" 0.6 s over Neleh's brow (14:33.0);<br>• Nole's "Great sign." 0.5 s (6:12.5);<br>• the memo's first words 1.0 s over the vault (20:43.2). | S |
| 12 | 4:53.8 · 14:37.4 · 19:06.1 | **Real quotes spoken face to face, ellipses and all:**<br>• "…I want people to know that we made them dance…";<br>• "You can call it this way… I disagree with this.";<br>• "…We are below them, above them, around them." | A person talking becomes a person reciting. The v3 newcomer flagged the same three. | S | Frame each as a clip: a TV, a post, a mic with its own small-speaker chain. Or keep the words and give each a listener who reacts (Gerg for "dance"; the employee for "coup"). | M |
| 13 | 0:58.67 (card → Act One) | **The act-head score fade (1.0 s) softens the beat's own "HARD CUT on the downbeat".** Measured: −33 at the cut, −23 at +0.4 s, −17 at +0.7 s. | The fade was added to stop act-break jumps. Here the card before it is already quiet (−36.5), so the designed arrival now creeps in. | X | For card→Act One only, restore the downbeat (fade 30–50 ms). The jump is the design. | S |
| 14 | 5:08.62 | **A stale designed silence leaves a hole on the cut into Sydney.** The act1 cue sheet still reserves 0.1 s at 249.86 for "Gerg closes his laptop", but that moved to 10.04 in v3.1. With lobby2's 0.5 s fade-out and sydney's 0.3 s fade-in, the momentary level drops 16 dB (−20.4 → −36.2) on the cut, right after "ours does that too." | An accident of the move, not a choice. | M/X | Crossfade lobby2 into sydney over 0.4 s, and remove or relabel the silence. | S |
| 15 | 16:01.0 · 15:18.5 · 7:29.9 · 12:59.7 | **Smaller unintended blanks:**<br>• Ttemme replaces Rima with no reason given (16:01);<br>• "That is the company telling us." has no referent (15:18.5);<br>• the flame insert reads as a burning note (7:29.9);<br>• the two faint tally marks have had no setup since TPOOL was cut (12:59.7). | Each costs a newcomer a beat. | S/P | See §B.2. Each is a one-line or one-shot fix. | S–M |

**Counts:**
- **A, forced:** 25 items.
  - V.O.: 17 of 28 lines to cut or convert.
  - Dialogue and devices: 8 groups.
- **B, out of the blue:**
  - 14 unintended items;
  - 10 intended shocks, labelled;
  - Mas carried along in 19 places.
- **C, sound:** 221 boundaries and 9 seams measured.
  - **Problems:** 1 seam (tag→outro), 1 stale gap (5:08.6), 1 softened designed downbeat (0:58.7), and scarce dialogue J/L-cuts at place changes (1 of 37).
  - **Probably designed, to confirm:** 3 score steps on cuts with no cue mark (1:56.3, 11:48.1, 21:20.1) and 1 seam (cold open→intro).
  - **None found:** no room-tone holes, no accidental clicks, no clipped dialogue, and no score stop or start on a cut that the cue sheets don't account for.

---

## A. FORCED (judged; frames + transcript + timelines)

### A.1 The inner voice: every line, keep or cut

28 lines, 208 words. The target is 10–14 lines (note 0). **Keep 11** (8 firm, 3 optional); cut or convert 17.

| Time | Line | Verdict | Why |
|---|---|---|---|
| 1:02.9 | gerg wants to ship it. rima wants it quiet. alyi wants to know what it is first. | **CUT** | Narrates the next 50 s. The name plates and the argument do it. It's the story's first line, so it sets narrator mode. |
| 1:14.8 | she'll go for three. | CUT | Explains a sight gag before it happens. The third underline (2:03) plays better unannounced. |
| 1:37.4 | she's right. it will break. i don't know which part yet. | **KEEP** | A real gap: he thinks this and says "it's a preview." |
| 1:56.8 | alyi asks that about everything we build. he means it every time. | CUT | A character note carried by a hold with no reaction (fix #10). |
| 2:48.7 | i know. i still read it twice. | **KEEP** | His want, admitted once. The best line in Act One. |
| 2:55.1 | someone noticed. | CUT | The odometer says it. |
| 3:20.1 | mostly the bill. | **KEEP** | Three words that undo "it's the bill.": a real inner/outer gap. |
| 4:08.4 | eleven keys. he's here for the twelfth. | CUT | A code (fix #7). |
| 4:26.3 | it does. | KEEP (optional) | Vanity, in two words. It only works if the collar reads (B.2 #9). |
| 5:47.0 | mario used to sit where gerg sits. he left to build a careful one. | CONVERT | Exposition a newcomer needs. Put it on Mario's 2-TONE card (`MARIO / LEFT TO BUILD A CAREFUL ONE`), the show's own device, and free the V.O. |
| 6:37.1 | four companies, one table. radnus has been mouthing the same sentence since we sat down. | CUT | Half describes the wide; half sets up a gag 37 s later. Let Radnus's moving lips be seen, and let the line land cold at 7:14. |
| 7:26.2 | he's not wrong. | CUT | Filler before the real move, "how's the dancing?". |
| 7:32.6 | i'll turn when he finishes the sentence. | CUT | Explains the joke the picture makes: three heads turn, his doesn't. |
| 7:52.9 | her mouth is a beat late. the voice isn't hers. | CUT | Reads out the on-screen `⚠ ALTERED AUDIO` tag. "That voice was not mine." says it again 16 s later. |
| 10:05.1 | thirteen. | CUT | Fix #7. |
| 10:10.6 | my other company. it tells people from machines. | CUT | The label on screen says `PROOF YOU'RE HUMAN · SHIP TO: MAS MANALT, CO-FOUNDER`. Hold the label 0.5 s longer. |
| 10:23.9 | i made it for everyone else. | **KEEP** | He gets verified by his own device. The irony is his. |
| 10:46.2 | i've had mine up since may. | CONVERT | His hand is already up in the frame, so the raised hand **is** the line. Cut the V.O. and hold the hand. |
| 11:21.1 | gerg types louder when he's happy. he's been happy since november. | CUT | Explains a sound cue in order to plant the 2 AM keys stopping. The keys stop without it, on the Build's stop. |
| 11:27.7 | neleh's on our board. she quoted us. | CONVERT | A plot plant spoken to himself. Put `NELEH · NOPEAI BOARD` in the paper's byline, and make the beat his act (fix #2). |
| 12:05.2 | thrilled is too much. enthusiastic is a lot. | **KEEP** | Character, funny, and it chooses "super.". |
| 12:33.1 | gerg's not on it. alyi set it up. probably just the budget. | **KEEP** | The one wrong read before the blow. The best V.O. in the film. |
| 13:01.3 | i don't keep score. | **KEEP** | Caught by the picture (he's carving the mark). |
| 16:51.1 | four hundred and six. four hundred and seven. four hundred and six. | KEEP (optional) | Specific and vulnerable, but hard to read. If kept, show the count on the phone as he says it. |
| 17:01.9 | gerg. he'll say he's compiling. | CUT | Deflates Gerg's own line 3 s later, and is the fourth "compile". The call is the action. |
| 18:00.1 | gerg never waits to be asked. | CUT | Fix #9. |
| 21:09.8 | those are stills. | KEEP (optional) | The only thing telling a newcomer the demo was faked. Flat enough. |
| 21:17.3 | it looks calmer than me. | **KEEP** | The coda. |

### A.2 Dialogue and devices, ranked

1. **"As you know" lines** at 4:49.0, 6:16.7, 14:14.5 and 15:46.7/15:50.8: fix #5.
2. **The read-it-aloud device** at 14:02.2 and 19:31.9: fix #6.
3. **Real quotes recited face to face** at 4:53.8, 14:37.4 and 19:06.1: fix #12.
4. **Reference policy spoken as dialogue.**
   - **5:30.1** "House rules, Sydney. Five questions, then a fresh start." is Bing's turn limit, explained to a chatbot.
   - **6:44.7** Sirrah's "What can be, unburdened by what has been… trained." is a catchphrase that is nobody's problem. The card saves who she is, not why we're hearing it.
   - Fix: trim to one gesture each. Tasya clips the timer on and says only "House rules." For Sirrah, keep the blocks and cut the catchphrase, or make it the room's problem (Mario's finger goes up on "trained").
5. **The duplicate tagline** at 14:54.1 and 18:00.1: fix #9.
6. **THE PLAN (13:14.9–13:32.9)** is textbook "as you know": a board member explains the board to a board member. "Once more, before the others join." gives it a reason, and the blueprint is the clearest exposition in the film. **Keep it and trim one line:** "This board controls the company. Not the other way round." is a thesis statement.
7. **2:06.4** "Did anyone tell the rest of the board?" / "It's a research preview." is visibly a plant. It's acceptable because he answers it with his click, which is an act. Don't make it louder.
8. **8:54.6**, the clone's "Health insurance.", reads the card the insert just showed. The gallery's gasp is the joke. Low priority. It could go, or become the clone reading it *to* Mas.

**Holds with nothing new in them** (the v3 note "radio play with slides" still applies in places):
- 3:37–3:57, 8.04: a 19.8 s static wide in which the speakers are silhouettes;
- 14:00–14:13, the blog screen;
- 15:03–15:21, the boardroom wide.

8.04 needs one cut-in on the founders for "Someone else built that?" (cost M). The other two are fixed by #6 and #5.

---

## B. OUT OF THE BLUE (judged as a newcomer)

### B.1 Intended shocks (labelled; keep them)

| Time | Beat |
|---|---|
| 12:41–12:55 | **The firing:** Alyi's sentence, the Remove dialog, the silence. The designed shock, and it works on paper: no plan before it. |
| 8:02.8 | The voice runs on over black and finds the clone's mouth. |
| 13:06.4 | "rewinding…" whips to the board's side at 11:52 (the told-twice device). The clock makes it readable. |
| 16:24.6 | Tasya comes through a door in the boardroom wall to read Macrosoft's statement. Surreal on purpose. |
| 17:38.1 | "Alyi signed it." / "alyi voted." / "He did both.": the reversal. |
| 9:32.8 | Nesnej's register rolls in: a comic intrusion with its card. |
| 20:08–20:18 | The hourglass shatter (the Runway insert): a style leap. |
| 21:02.8 | ELGOOG's photoreal duck, then the stutter: a style leap that is also the joke. |
| 20:31.4 | The Q* vault, "DO NOT OPEN. DO NOT EXPLAIN.": a deliberate tease for later. |
| 21:30.3 | The Grey Lady's thud, then "noted.". |

### B.2 Unintended, ranked

1. **10:48.6, the Tidder post:** no trigger and no consequence, and the LEDs stop (10:52.0) for no reason we learn (fix #2).
2. **9:52.1, the act-out glass** reads as a man in a water tank (fix #8).
3. **4:08.4 / 10:05.1, the key count, and 5:38.6, the Atem leak.** Who Atem is, and why Mas should care, is never his problem beyond one prediction (fix #7).
4. **12:59.7, the carve "beside two faint ones".** The two earlier marks have had no setup since the TPOOL flash was cut, so the count reads as generic tally marks. "i don't keep score" still lands, but *what* he's counting doesn't. Fix: drop to one faint mark ("i don't keep score" still lands on the second carve), or plant the first mark earlier (Act One: the pen he pockets makes a first scratch on his desk). Don't label past departures: the YC one is contested (a guardrails call).
5. **16:01.0, Ttemme.** "We'd like a different one." is funny, but a newcomer never learns why Rima is out. Fix: leave it as a gag and accept the blank, unless a reason from the public record by Sunday night can be said in one line. No invented motive (guardrails).
6. **15:18.5, "That is the company telling us."** has no clear referent. It means the phones and the labels. Fix: Alyi nods at the buzzing row as he says it, or "Those are the company, telling us."
7. **13:13–13:35 and 12:15, the antagonists.** Mada and the Quiet Vote first appear as names 26 s before the firing. Neleh is planted only by the 11:27 V.O., which fix #1 converts. It's better than v3 but still thin. Fix: the byline in 20.07, and one frame of Mada on the 12:15 reminder with his face, not a spinner.
8. **7:29.9, the flame insert.** It reads as a burning note, not Radnus's collar. Fix: frame the collar and his face together, or cut the insert and let the flame sit on the two-shot.
9. **4:21.96, "collar #3".** Nothing tells us that collars mean ownership. Fix: at "That collar suits you." Tasya's key ring clinks against it once (picture and SFX), or cut "it does." with the collar gag.
10. **3:37–3:57, who's speaking in Elgoog's lobby** (silhouettes in a static wide). See A.2, the note on holds.
11. **5:08.6, Sydney.** The arrival works (the bubble leaves the GNIB TV, set up by 4:49), but the scold and the egg timer need the real story. Acceptable as comedy. Fix #5's trim helps.
12. **7:56.9–8:02.7, the lit-window stranger reposting,** then the hailstone. If this is the season's glyph thread, it's intended. A newcomer gets a stranger in a window with no one we know. Keep it at ≤ 4 s and don't add to it.
13. **11:33.1, Neleh's paper → Nedib's order.** No bridge; the monitor montage just advances. Minor.
14. **16:51.1, "four hundred and six…"** is hard to read without the count on screen (A.1).

### B.3 Mas's agency: where he acts, and where he's carried

**He acts** (keep all of these):
- 2:11.5 the click;
- 2:25 "let's see if anyone notices.";
- 4:07 he pockets the pen;
- 4:19–4:21 he steps onto the check (he takes the deal);
- 4:28.7 "and the rent?";
- 5:14.7 / 5:26.1 he corrects Sydney, then flatters it;
- 5:42.6 "give it a minute. it'll be open source.";
- 6:27–6:35 PLEASE / REG;
- 7:28.2 "how's the dancing?";
- 9:05.4 he slides PLEASE REGULATE ME to the dais;
- 10:27.3 "you can stay.";
- 10:48.6 the post and 10:59.5 the edit;
- 12:09.7 "super." chosen from three;
- 12:37 he clicks JOIN;
- 17:01.6 **he calls Gerg**;
- 17:12.8 "read me the letter.";
- 18:02.5 "keep building.";
- 18:16.6 / 18:20.3 "and the rent?" / "leave it open.";
- 19:17.2 he accepts Tuesday's invite;
- 19:22.0 he pulls the pin;
- 19:47.8 / 19:49.3 "we'll stand." / "gerg comes back too.";
- 19:55.8 "of what?";
- 20:44.8 the memo;
- 20:52 he unscrews the ALYI plate.

**He's carried** (19 places):
- the odometer (2:54);
- the code red, watched on his phone (3:28);
- the GNIB launch on TV (4:45);
- Mario's split, which he's not in (5:46);
- the pause letter, from his monitor (6:08);
- the White House, seated (6:36);
- the bay feed (7:50);
- the Senate's questions (8:36–9:05);
- the tour, which is a poster (9:11);
- the rooftop, reaching for a pen (9:16);
- Atem on the monitor (10:00);
- the hands runner (10:30);
- Neleh's paper (11:27);
- Nedib's order (11:33);
- DevDay on the monitor (11:55);
- the reminder (12:15);
- the firing (intended);
- the whole board's side (13:06–16:46);
- the avalanche (18:25), which is correct: guardrails say he doesn't orchestrate the revolt.

**The pattern:** Act Four has real agency now. **Acts Two and Three have almost none.** In neither does a scene follow from something he chose. The cheapest fixes that use the record:
- **Act Two:** make the tour **his** move. He posts the EU reversal himself on screen (9:14, "…no plans to leave", his own thumb) instead of a poster that stamps itself.
- **Act Three:** fix #2.
- **Act Four:** fix #3.

---

## C. SOUND TRANSITIONS (measured)

### C.1 The chapter seams (film audio)

| Seam | Film time | Step at the seam (100 ms / 400 ms) | Floor ±1.5 s | What happens | Verdict |
|---|---|---|---|---|---|
| film start | 0:00.00 | — | −72 dBFS at 0.03 s | The hall fades up out of silence under the 0.5 s black. The room leads the first cut by 0.75 s. | OK (designed) |
| cold open → intro | 0:26.67 | +2.0 / **−14.6 dB** | −56 | The rewind is loud (−14 LUFS momentary) up to −0.1 s. The last 90 ms is the black's tone. The intro's own head then sits at −35…−40 for 0.9 s before its first beat at +1.0 s. | **Designed dead cut, for an ear.** If it stalls, let the rewind's whirr trail 0.3 s into the cursor (an L-cut) so the lull is shorter. |
| intro → card | 0:56.67 | 0.3 / −7.9 | −45.5 | The intro fades out over 1.5 s to the card's −36.5 LUFS tone. | OK |
| card → Act One | 0:58.67 | 0.5 / +5.6 | −43 | The act head's 1.0 s score fade: −33 at the cut, −23 at +0.4 s, −17 at +0.7 s. | **Fix #13:** the beat asks for a hard cut on the downbeat. |
| Act One → Two | 6:36.13 | −0.3 / +3.1 | −42 | The THREAT tail decays across the 1.0 s black to −37; Act Two's room fades up over 0.5 s; the V.O. comes at +1.0 s. | OK |
| Act Two → Three | 9:57.38 | 0.0 / +4.8 | −51 (at −0.65 s, inside the black) | The bell's last partial, then the black at −45, then the rack's fans up over 0.6 s. | OK |
| Act Three → Four | 12:22.50 | +0.8 / +1.0 | −38 | The 2.5 s black carries the crane and glass pre-lap (−51 → −30 over 2 s) into S1.01. A textbook J-cut. | Good |
| Act Four → tag | 21:00.25 | +0.6 / −0.4 | −34 | The vault's F hum carries across (an L-cut). | Good |
| **tag → outro** | **21:41.58** | **+21.3 / +20.0 dB** | −36 | The hum alone for 1.25 s under the black, then the outro's first hit at −13 LUFS momentary. | **Fix #4.** The only real seam problem. |
| film end | 21:51.72 | — | — | The outro fades to digital zero over 0.6 s. | OK |

The act-break seams all step less than 1 dB at the seam (sound.md's goal). Every act-out black carries tone between −37 and −54 LUFS, and none is digital zero.

### C.2 Every cut: what was found

- **Room-tone continuity.**
  - No run of 0.1 s or more falls below −60 dBFS (50 ms windows, louder channel) anywhere except the film's last 0.16 s (the outro's fade). The film's first 0.1 s rises out of −72.
  - Below −50 there are only designed moments:
    - 8:02.9 (the 14.06 black, −55.6 for 0.15 s);
    - 12:20.3 (the Act Three dead stop, −54.6);
    - the one silence (−51);
    - the film's first 0.1 s.
  - At every one of the 221 boundaries the ±1.5 s floor is above −60, except the film's first cut.
- **Clicks and pops.** Two sample-discontinuity candidates were found and **both are designed SFX**: the post click at 10:53.63 (`post_click`, 20.03) and the call-end click at 15:44.32 (S4.08's `dialog_ok_click`, then the dial tone). The block scan of all six mixes found nothing else.
- **Dialogue clipped by a cut: none.** No take runs past its segment's end or starts before it. The two interruptions are designed (`cut: true`):
  - Mario's "hypothetically—" (15:35.2), which overlaps Adelina's "In plain English: no." by 0.8 s;
  - Neleh's "Has anyone read the char—" (18:33.4).
- **The score stopping or starting on a cut:**
  - 11 hard stops or starts land exactly on a cut, and **all are in the cue sheets as designed**:
    - 0:20.17 the rewind;
    - 4:21.96 the collar's pop;
    - 5:37.38 the ATEM sting;
    - 6:23.21 EMIT's THUD;
    - 8:04.08 senate_a;
    - 8:49.88 the wallet;
    - 9:11.45 run_roof;
    - 9:47.71 the crack;
    - 12:59.71 night, after D6;
    - 12:20.00 THE CLOCK's dead stop into the black;
    - 18:25.17 the avalanche.
  - A further 9 designed stops land inside shots: 7:51.43, 12:48.40, 13:08.82, 17:37.06, 18:39.33, 19:56.51, 20:15.59, 21:09.12 and 21:30.83.
  - There are 28 score jumps of 12 dB or more on a cut (the render's level, 0.5 s either side). 24 sit on a designed stop or start, or within 0.8 s of a cue mark. Four don't:
    - **1:56.25:** +14 dB into v3-5.06b (Alyi's reflection);
    - **11:48.08:** +15 dB from the Nedib monitor to the "which one's real?" two-shot;
    - **21:20.08:** +12 dB on the tag's scan two-shot (the verdict's mark follows 1.1 s later);
    - **1:21.67:** −13 dB (the Build's pass ends 0.8 s before the cut). This one is masked by Rima's line and is harmless.
  - The first three look like chord attacks on the cut. **For the composers:** confirm them, or soften the attack or pre-lap 0.25 s. **If fix #10 trims v3-5.06b, the 1:56.25 accent has to move with it.**
- **A stale gap:** 5:08.62, fix #14.
- **Spectral jumps.** The ten largest (9–27 dB mean band change) are all designed hits with a cue mark or a sound.md note:
  - 12:20.00 the black;
  - 9:47.71 the crack;
  - 12:46.50 the bright Remove dialog;
  - 0:20.17 the rewind;
  - 18:25.17 the avalanche;
  - 10:19.58 the scan;
  - 16:00.96 the spotlight accent;
  - 9:34.88 Nesnej's unfreeze;
  - 4:21.96 the pop;
  - 2:51.29 the counter.

  No accidental jump was found.
- **Loudness steps of 6 dB or more over 1.5 s.** There are 52. They are explained by a line starting or stopping at the cut, or by one of the designed stops and accents above. None is unexplained, apart from the three already listed (5:08.62, 1:56.25, 11:48.08).

### C.3 J- and L-cuts at place changes

There are 46 place changes. 37 go room to room; 9 go into or out of black or the GFX plan (the film's first cut included).

- **Rooms: all 37 crossfade.** In the stems, the new room leads by 0.5–1.0 s and the old trails by 0.05–1.0 s. The only near-hard room cut is the designed THUD (6:23.21, trail 0.05 s). The measured turning point of the room spectrum falls between −1.2 and +1.2 s of the cut, never exactly on it.
- **SFX that lead the cut:**
  - 12.01's toast (0.4 s);
  - 20.01's keys (0.5 s);
  - S4.01's hearts (0.5 s);
  - S6.01's thunk (0.4 s);
  - the crane pre-lap into Act Four;
  - the drone under S4.15 (1.0 s);
  - the Build's chip line into 11.01;
  - the vault hum as an L-cut into the tag.
- **Dialogue that leads the cut: 1** (3:15.2, Rima's "A million people, Mas. Is that a tear?" over the basement tile). The clone over black at 8:03 is a second, into a black.
- **Dialogue that trails the cut: 0.**
- **Entry and exit air.** At room-to-room changes the median from the cut to the first word is 2.25 s, and from the last word to the cut 2.88 s. There are no cold cuts onto a line except the designed ones: the told-twice 13:37.6 at 0.33 s, and the memo continuing over the nameplate at 20:51.5.
- **What it means:** the rooms do the J/L work, but a *voice* never pulls us into a new place. That's fix #11. The four chosen spots each have a hook line that plays better heard before it's seen.

### C.4 The one designed silence and the act-break fades

- **The silence (Remove click → buzz).**
  - It runs 12:48.40 → 12:53.47, 5.07 s.
  - The mix sits at −49 LUFS with the room tone only; the quietest 50 ms is −51 dBFS.
  - SFX and score are gated to zero, and nothing leaks.
  - It starts on the click, 0.48 s before the cut to S1.09.
  - The buzz returns +23.9 dB over 1.5 s at the S1.11 cut (+0.3 s).
  - The score stays out under "super." until the carve cut (12:59.71), where the night cue re-enters as designed.
  - **Clean.** The film's other 19 score stops and starts are score-only, with room air under them, so this is still the only total stop.
- **The act-break fades.**
  - Acts One, Two and Three fade their score up over 0.4–0.7 s. Act Four rides the crane pre-lap.
  - Every seam steps less than 1 dB in its 100 ms window.
  - The only cost is fix #13 (the card's downbeat).

### C.5 For an ear (the measurements can't settle these)

1. The cold open→intro lull (0:26.6–0:27.7): an arrival, or a stall?
2. The three unmarked score steps (1:56.25, 11:48.08, 21:20.08): a musical hit, or an edit step?
3. The Mario/Adelina overlap (15:42.5, 0.8 s): does it read as her taking the phone?
4. After fix #4: does the hum read as a hook before the Orb?

---

## For the v3.2 passes

- **agency-v32 (script):** fixes #1, #2, #3, #5, #6, #7, #9, #10 and #12, §A.1's keep list, and §B.3's pattern. The keep list is 11 lines and fits note 0's 10–14.
- **Sound (v3.2):** fixes #4, #11, #13 and #14, plus the composers' check in §C.2. If the v3.2 script moves beats, re-run this audit's measurements on the v3.2 film: `measure.py` takes the segment list and reads the locks, mixes, stems and score renders from their standard paths.
- **Picture:** fixes #3, #8 and #15 (the flame insert, the tally labels), and the 8.04 cut-in.
