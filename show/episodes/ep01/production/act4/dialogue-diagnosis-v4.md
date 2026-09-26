# Ep1 · Act Four · Dialogue diagnosis (v4.2)

| | |
|---|---|
| **Role** | Dialogue editor (diagnosis only). No script, lock, take or cue was changed. |
| **Note being answered** | Showrunner, on v4: "it is getting cloesr. however, a lot of the dialoge is unnatural and the cuts are still quite fast. a few time dialogue seems to randomly blurt out or cut off. it seems since v2 you didn't allow any conversation to play out for more than a few seconds which makes it hard to follow. i said to cut down empty time, but not to cut every dialogue into only a few words per character" |
| **Read** | `SHOWRUNNER-NOTES.md`; `bible/flow-and-continuity.md` (§4, §5a); `script.md` `## ACT FOUR` (draft 4.2) and the draft-2 appendix; `shots-locked-v4.json` (`audio_cues`, `lines_gaps`, `posts`); the v4.2 timed transcript (`scratchpad/act4v4/close/transcript-v4.txt`); `v4-for-review.md`; `edit-plan-v4.md` §1–2; `dialogue.md`; `audio/ep01/act4/dialogue/lines.json` and `retired/3.1/lines.json`; `bible/tone-and-dialogue.md` R5–R11; `bible/guardrails.md`; `facts.md`; the character files; `_sources/research/mid.md` §3. |
| **Status** | **Measured, not heard.** I can't listen to the takes or watch in real time. Everything below comes from the lock, the transcript and the take metadata. What a human ear must check is in §6. |

**Flags used in the line tables**

| Flag | Meaning |
|---|---|
| **B** | Blurt. The line has no setup, or the audience doesn't know who is speaking or to whom. |
| **C** | Cut off. The thought stops on a dash. |
| **O** | Overlap. The reply starts before the line ends. |
| **Q** | A quip stands where a response should be. |
| **U** | The exchange stops before it resolves. |
| **✓** | Works as written. |

---

## 0. The short version

**The lead's numbers check out on the lock:**
- 45 voiced lines, 176 words, 64.4 s of speech in 4:11.5 (25.6%).
- Median 4 words a line; 21 lines of three words or fewer.
- 5 lines end on a dash; 21 exchanges; the longest is 10.0 s (the committee, S4).

**What else I measured:**

| Measure | v4.2 | What it means |
|---|---|---|
| Lines interrupted or interrupting | **12 of 45** (5 dash cut-offs + 7 scripted overlaps) | The flow guide now asks for "a few per act" |
| Wordless stretch between exchanges | median **6.6 s**, max **22.5 s** (20 stretches) | Talk arrives in 1–4 s bursts between long stretches of text and music. That is the "blurt" |
| On-screen text vs speech | about **480 words** of text in 64 items (rails, plates, labels, stamps, cards, toasts), plus **7 silent posts**, against **176 spoken words** | The act is told in writing. The things a newcomer lost are all text or nothing |
| Pace of the takes | all reads **136 → 175 wpm** from 3.1 to 3.2 (dialogue.md §1). Terb 242 wpm on his 3+-word lines, the employee 296, Rima 214 | These reads were solved to fit spans the picture had already been cut to. Rima's bible says "never rushed" and Alyi's says "slow, sparse, weighty" |
| Internal pauses | capped at 0.3 s; Mario's four full stops are 0.12–0.16 s; cut-offs have no tail at all | "Hi. Yes. We're very worried. How much?" is four sentences in 2.4 s |
| Who talks to Mas | nobody on the board, ever. His longest exchange is 13 words with Gerg | The protagonist has no conversation in his own act |
| Invented lines | about 35 of 45 | Real lines are mostly silent posts. Nearly all the talk is written for the show, and it's written as aphorisms |

**Draft 2 had the same shape.** Its voiced lines were 43, 167 words, median 4, and 20 of them three words or fewer. v2 felt different because its gaps were longer (a 7:34 cut with 42 s and 21 s holes). So the fix is to write conversations. Restoring draft 2 won't do it. Draft 2 has a handful of turns worth bringing back (§3). The richer source is the record itself: the fuller versions of quotes the act already trims (§3b).

**Causes I can point to in the documents:**
1. **The craft rules.** R8 "Collide, don't volley" tests for "at least one overlap, cut-off or wrong-source answer", and the per-scene checklist (tone-and-dialogue §7) asks it of every scene. R5 says "one button, not three". R6/R7 say "give it to the picture".
   - The worked examples in the bible are this act's own lines. R6 cuts the Rima exchange ("I'll hold it together." / "For how long?") down to three quips.
2. **The insider read's over-telling cuts removed connective tissue** along with the repeats. Examples:
   - "Nine seats."
   - "The company will tell us."
   - "Chat. I'm the CEO now."
   - "gerg never waits to be asked."
3. **The house rule that posts are never speeches.** Seven story beats play silently, including the board's only public reason.
4. **The 3.2 retake fitted the voices to the picture,** instead of cutting the picture to the voices (pace, pauses, tails).
5. **4.1's choice that "Nobody on the call is heard".** The firing, the act's central conversation, has no words.

---

## 1. Sequence by sequence

Times are act time from the v4.2 transcript. "w" is words.

### S1 · Noon, Las Vegas: the plan and the call (0:00–0:38.5)

**About:** the board's how-to (who holds the power, and that the CEO owns nothing), then the call that removes him.

**Who talks to whom:**
- NELEH's blueprint figure talks to the audience (the show's voice). She isn't seen or named until the call card at 0:23.
- MADA's unseen voice cuts in on her.
- On the call, nobody speaks.
- MAS speaks into a mic he doesn't know is live, through a smart reply.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 0:06.3 | NELEH (unseen) → audience | Three left this year. Four of us vote. | 8 | **B**: the act's first voice has no face or name; "us" is whom? (newcomer: "with effort") |
| 0:09.1 | NELEH → audience | This board controls the company. | 5 | ✓ |
| 0:14.3 | NELEH → audience | The investor gets— | 3 | **C**: the stamp `VOTES: 0` finishes it |
| 0:15.6 | NELEH → audience | And the CEO owns— | 4 | **C**: Mada cuts in |
| 0:16.4 | MADA (unseen) → Neleh | Good question. | 2 | **O** −0.17 s · **B**: a man we haven't met · **Q**: the stamp `EQUITY: 0` gives the answer |
| 0:36.5 | MAS → the call | super. | 1 | Designed. It lands after **19.2 s** without a voice |

**Problems:**
- The blueprint is the only talk in this chapter, and it's a monologue by an off-screen board member. Two of its four sentences never finish, and a third voice interrupts. That's two cut-offs back to back in the first 17 s. It's fun once, and here it sets the act's rhythm.
- The firing has no line. From JOIN to "super." there are 19 s of picture, music and the designed silence. Nobody tells Mas anything, so "super." answers a dialog box, not being fired. It lands as the phone gag, not as a man's reply to news.

### S2 · That night (0:38.5–0:52.8)

**About:** he counts, and it has happened before. **Who:** Mas's V.O. to the audience; the Orb looks.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 0:39.8 | MAS (V.O.) | i don't keep score. | 4 | ✓ (a designed solitary beat) |

**Problems:** none as dialogue. Note that Gerg quit for him that same night (the board sees his post in S3), and nobody calls.

### S3 · Friday, the board's side (0:52.8–1:19.5)

**About:** the four run their steps and hit the first cracks.

**Who:**
- Mas's tinny voice reaches the board, unheard.
- RIMA speaks from a spotlight to no clear listener (Neleh is O.S. "through the call").
- An employee questions ALYI, and Alyi answers the staff.
- The board never speaks among themselves in this chapter: the pen ticks the steps, and three posts arrive silent.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 0:52.8 | MAS (laptop) → board | super. | 1 | ✓ (the told-twice echo) |
| 1:02.3 | RIMA → ? | We'll share more soon. | 4 | **B**: a new face in a new place, first words, 8.8 s after the last voice, answering nobody |
| 1:03.3 | NELEH (O.S.) → Rima | Share what? | 2 | **O** −0.25 s |
| 1:04.6 | RIMA → Neleh | More. Soon. | 2 | **Q** · **U**: 3.2 s in all. Who appointed her, what she'll tell the staff, what she's refusing: only the plate says any of it |
| 1:10.8 | EMPLOYEE → Alyi | Is this a coup? | 4 | Acceptable: the match cut gives the place. But it's a stranger's question read at 296 wpm |
| 1:12.4 | ALYI → staff | "You can call it this way" | 6 | **U**: the real answer continues "…I disagree with this. This was the board doing its duty to the mission of the nonprofit…" (§3b). The cut keeps the half that sounds like a confession and drops the board's why. Also a fairness flag: without "I disagree with this", Alyi appears to accept "coup" |

**Problems:**
- The board's only stated reason, the blog post, is silent (3.25 s, pedal only).
- Gerg's resignation is silent.
- Mas's shares joke is silent.
- The board, who just fired their CEO, never says a word to one another.

### S4 · The weekend, the boardroom (1:19.5–2:09.1)

**About:** the siege, and the hunt for step four: the phones, the rival lab, a new interim CEO, Mas at HQ as a guest, Macrosoft's door.

**Who:**
- NELEH and ALYI talk (the committee).
- MARIO and ADELINA answer the board, and the board, who dialled, says nothing.
- MARIO takes a call from NOZAMA.
- TTEMME talks to his stream's chat.
- TASYA reads his post to the board.
- NELEH asks the room one question.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 1:27.5 | NELEH → room | The bylaws allow it. Footnote three. | 6 | **B**: answers a question nobody asked (newcomer: "allow what?"), after **12.9 s** without a voice |
| 1:30.0 | ALYI → Neleh | Step four will reveal itself. | 5 | **Q**: a koan, not an answer to her line |
| 1:32.1 | NELEH → Alyi | When? | 1 | **O** −0.17 s |
| 1:33.3 | NELEH → Alyi | The company is calling us. | 5 | ✓ (the setup) |
| 1:35.2 | ALYI → Neleh | That is the company telling us. | 6 | ✓ the best turn in the act · **U**: nobody answers it. Neleh's face, then the speakerphone dials "on its own", so the next action has no decision behind it either |
| 1:42.1 | MARIO → board | I've written up some thoughts— | 5 | **C**: Adelina takes the phone. The board's offer is never voiced; the plate carries it |
| 1:43.1 | ADELINA → board | In plain English: no. | 4 | **O** −0.29 s · **B**: she's unnamed (the transcript calls her "A WOMAN IN MARIO'S OFFICE") |
| 1:45.8 | MARIO → Nozama | Hi. Yes. We're very worried. How much? | 7 | **B** for a newcomer: to whom, and why? (scorecard #8: "lost on Mario's second call") |
| 1:55.6 | TTEMME → his chat | Chat… for how long? | 4 | **B**: a new man in a new job, whose first words go to an unseen audience. Nobody hired him on screen; nobody mentions Rima |
| 2:02.9 | TASYA → board | "a new advanced AI research team" | 6 | ✓ as a read post |
| 2:05.7 | NELEH (O.S.) → Mada | Step four? | 2 | ✓ designed; Mada's silence answers |

**Problems:**
- Five exchanges of 1–5 lines in 50 s.
- **The failed return talks aren't dramatised.** They exist only as the rail `NOV 19 · RETURN TALKS AT HQ` and the silent badge post, and the newcomer inferred that they failed.
- **Nobody in the world asks why he was fired,** not even the man the board hires to run the company.
- The board's whole reaction to Macrosoft taking Mas is two words.

### S5 · His side, 2 AM (2:09.1–2:45.2)

**About:** what they didn't know: the staff, Alyi's signature, the money, Gerg, the door.

**Who:** Mas's V.O. to the audience; Mas to the Orb; GERG and MAS over the monitor; TASYA (O.S., through a door) to Mas.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 2:18.0 | MAS (V.O.) | the badge was a joke. | 5 | After 11.5 s without a voice |
| 2:20.7 | MAS → the Orb | mostly. | 1 | **B**: said aloud, answering a thought that nobody, the Orb included, heard |
| 2:33.7 | GERG → Mas | One sec. Compiling— | 3 | **B**: a tile opens mid-typing, with no ring and no hello · **C**: Mas cuts in. It lands after **12.2 s** of silent reading (the letter and the check) |
| 2:34.5 | MAS → Gerg | what are you building? | 4 | **O** −0.17 s |
| 2:36.3 | GERG → Mas | The company. Again. Just in case. | 6 | ✓ · **U**: Mas never answers. The glance, then the cut |
| 2:41.8 | TASYA (O.S.) → Mas | Everyone is welcome. | 3 | **B**: a voice through a door that has just appeared |
| 2:42.9 | MAS → Tasya | leave it open. | 3 | **O** −0.17 s, "at once, on the tail" · **Q** · **U**: the answer to the offer that decides the act, played as a reflex |

**Problems:**
- The act's biggest reveals (745 of 770 staff, the demand, Alyi's name, the payout void without Mas) are 11 s of silent pages.
- The one Mas–Gerg conversation is 4.5 s and 13 words.
- The Macrosoft offer is 6 words.
- The letter's threat (quit and follow him to Macrosoft), which is what gives the door its teeth, isn't said anywhere (review §7.8).

### S6 · The avalanche (2:45.2–3:00.8)

**About:** the staff push the board out. **Who:** NELEH's tile, to the call.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 2:53.4 | NELEH → the call | Has anyone read the char— | 5 | **C**, designed: her tile is pushed out. Right in a montage under the full band. Its only problem is that it's the act's fifth dash |

### S7 · The return (3:00.8–3:41.6)

**About:** Alyi recants, the landlord owns the floor, and a fixer brokers terms: Mas is CEO again.

**Who:**
- ALYI reads his post aloud from a doorway, at Mas.
- TASYA proclaims to the room, and trades greetings with MAS.
- TERB speaks to the room, then puts "Terms?" to MAS and MADA.
- MADA answers Terb; MAS echoes Mada.

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 3:01.1 | ALYI → Mas | "I deeply regret my participation in the board's actions." | 9 | ✓ real · **U**: trimmed to the first sentence (the rest is in §3b). Mas answers with three silent hearts; the two men never speak |
| 3:09.6 | TASYA → room | "We are below them, above them, around them." | 8 | **B**: a proclamation with no question. Its real context, the answer to "what if NopeAI disappeared?", is missing |
| 3:13.3 | MAS → Tasya | hi. | 1 | ✓ as a gag |
| 3:13.8 | TASYA → Mas | Hello. | 1 | **O** −0.04 s · **Q**: the gag stands in for any exchange about what Macrosoft now is to NopeAI |
| 3:21.2 | TERB → room | Which room is on fire? | 5 | ✓ |
| 3:23.5 | TERB | …Ah. | 1 | ✓ (read at ×1.375, then compressed ×1.10) |
| 3:24.6 | TERB → Mas, Mada | Terms? | 1 | **Q**: the negotiation is one word (×1.375, ×1.10) |
| 3:25.8 | MADA → Terb | Good question. | 2 | **Q** |
| 3:27.4 | MAS → Mada | good question. | 2 | **U**: the deal ends here. A stamped term sheet with line 1 legible, then two silent posts |

**Problems:**
- The climax, the deal that brings him back, is 5 lines, 11 words and 7.3 s.
- The new board is never named. THE OTHER YRRAL was cut; newcomers don't know Mada keeps his seat, or what Mas gives up (a board seat; a review).
- After "good question." come **22.5 s without a voice** (the term sheet, Gerg's post, Ttemme's post, the hourglass, the sign, the box, the dialog, the close-up) until "okay.". It's the act's longest wordless stretch, and it sits right after its shortest negotiation.

### S8 · The lobby, and after (3:41.6–4:11.5)

**About:** nobody can cancel him now; the cost; the hook. **Who:** MAS to no one ("okay."); GERG and MAS at the vault; MAS to no one (the memo).

| t | Speaker → to | Line | w | Flags |
|---|---|---|---|---|
| 3:51.0 | MAS | okay. | 1 | ✓ the bookend |
| 3:55.8 | GERG → Mas | What's in there? | 3 | ✓ |
| 3:57.0 | MAS → Gerg | it's a preview. | 3 | ✓ · **U**: Gerg reads a sticky note and walks. What Q\* is arrives as a rail, which a newcomer found meaningless |
| 4:02.2 | MAS (memo) → no one | "i love and respect alyi… i harbor zero ill will towards him." | 12 | Trimmed; the middle clause is cut (§3b). He reads it at his desk to nobody |

### 1.1 The pattern, in one list

**Blurts (14).** Most of them come after 6–13 s without a voice:
- the unseen blueprint voice
- the unseen "Good question."
- Rima
- the coup question
- "The bylaws allow it."
- "Step four will reveal itself."
- Adelina
- Mario's second call
- Ttemme
- "mostly."
- Gerg's first line
- Tasya's door
- "below, above, around"
- the memo

**Cut-offs (5).** Designed ones worth keeping: "And the CEO owns—" and "Has anyone read the char—". Those that leave a thought unfinished for no reason inside the scene: "The investor gets—", "I've written up some thoughts—" and "One sec. Compiling—".

**Exchanges that stop before they resolve (11):**
- Rima
- the all-hands
- the committee
- the Mario call
- Ttemme
- Tasya's door on the board's side
- Gerg
- the offer
- Alyi
- the negotiation
- the vault

**Quips where a response belongs (9):**
- "Good question." on the blueprint
- "More. Soon."
- "Step four will reveal itself."
- "When?"
- "mostly."
- "leave it open."
- "Hello."
- "Terms?"
- "Good question." / "good question."

**Unnatural phrasing.** Nobody uses a name, greets anyone, or picks up what the other just said. Six catchphrases carry the talk: "Footnote three.", "Good question.", "More. Soon.", "One sec. Compiling", "In plain English", "Everyone is welcome.". Because in-world people never tell each other anything, the plates and rails tell the audience instead.

---

## 2. The conversations this act should let play out

**How they work.** Each one:
- replaces a burst, and absorbs the silent text that currently carries its facts
- is shot with holding coverage: a two-shot or over-the-shoulder that carries the exchange, and singles cut on real turns
- speaks in complete thoughts, with the character's own cadence (the bibles: Neleh precise and footnoted; Alyi slow and weighty; Mada minimal, pauses for sentences; Gerg quick, literal, mid-thought; Tasya warm mantras; Terb brisk and procedural; Mas soft, measured, lowercase)
- keeps the seasoning: one designed interruption per conversation at most

**Lengths are rough.** Sketch lines are illustrations of register for the writer, marked `[INVENTED · sketch]`. They aren't script, and each needs the writer's and the guardrails owner's pass. Real lines keep their words and need the facts status given.

### C1 · The board's call, from their side (opens pass one) · ~20–30 s

**Where it goes.** Keep his side of noon silent: the drop-out D6 is a designed beat. The Orb's `rewinding…` then lands a minute earlier than it does now, at 11:59 on Neleh's desk, and pass one opens with the call as the board lived it. The four are waiting for his tile. It connects on one bar of Wi-Fi. Alyi tells him, and Neleh adds that the announcement is going out shortly. His frozen tile says nothing. Alyi clicks Cancel. His tile drops, and they are already on step 2 when his tinny "super." comes through and nobody looks up.

| | |
|---|---|
| **Wants** | The board wants it done cleanly and fast |
| **The turn** | The click |
| **Must carry (newcomer)** | This call is the vote; what the four are to him (Alyi his co-founder, the tag already says so); that the news goes public at once (the blog post is step 2) |
| **Insider layer** | The frozen feed. On his side the four "froze" because his Wi-Fi did; on theirs, they spoke to a frozen tile. Draft 2's "Alyi's mouth moves, but no sound reaches Mas's tile" is the hinge |
| **Record** | Gerg's Nov 17 joint-timeline post gives the public account of the call: he was told he was being fired and that the news was going out very soon. **Fetch it and log it before use.** I'm working from memory of that post's wording |
| **Guardrails** | Only the public account. No reason beyond the blog post's words, no memo, and no reaction from Mas (his tile is frozen, so none is needed). |
| **Coverage** | Neleh's MCU with the laptop grid over her shoulder; Alyi's tile as a single on his lines; the grid wide for the click |
| **Pays for it** | The `rewinding…` badge flip and S3.01 stay. Nothing silent here, so it's net +20–30 s |

**Option A, if the showrunner prefers the words on his side:** Alyi's two sentences play into the suite before the dialog pops (+10–15 s). But D6 then follows speech, not silence.

### C2 · The board's Friday: after the call · ~45–60 s (plus the all-hands, ~15–20 s)

**Where it goes.** The call stays open with the four of them. At Neleh's desk, the steps.

**The beats:**
1. The post. Someone reads its sentence aloud before posting; it's the board's own public text, voiced once. The 3.25 s silent insert goes.
2. Rima is brought onto the call and asked to serve.
3. Gerg's post lands. They removed him as chair and expected him to stay.
4. A doorway match cut takes us to the all-hands.

| | |
|---|---|
| **Wants** | Neleh wants procedure to hold. Alyi wants it to be right. Rima wants to not be their instrument |
| **The turn** | Gerg quits, and the staff call it a coup |
| **Must carry (newcomer)** | **Why he was fired, as the board sees it:** he wasn't candid with them, and the board's duty is to the mission, not the company. That's the review's open decision 1, answered in their words and in Alyi's real answer at the all-hands. Also: the plan's steps; Rima's appointment and her distance (which sets up her post); Gerg quitting unasked |
| **Insider layer** | "More. Soon." gets its setup; the verbatim post and the all-hands quote; THE QUIET VOTE never unmutes |
| **Record** | The blog post's full sentence; Alyi's all-hands answer in full; "…based on today's news, i quit." (all §3b, to fetch) |
| **Guardrails** | The only characterisation of Mas is the post's wording. No new reason, no allegation, no memo. Invented lines stay on procedure, the charter and the staff |
| **Coverage** | The call grid is a box the world has (allowed), cut with Neleh's MCU and OTS. The all-hands from the back of the crowd, then Alyi in the doorway, holding through his answer and one more question from the floor |

Sketch, Rima's appointment. It restores draft 2's "For how long?" and gives "We'll share more soon." a question to answer:
- NELEH: Rima, the board would like you to serve as CEO while we search. `[INVENTED · sketch]`
- RIMA *(pleasant)*: For how long? `[INVENTED · draft 2]`
- NELEH: Until the search is done.
- ALYI: The staff will ask what happened.
- RIMA: We'll share more soon.
- NELEH: Share what?
- RIMA *(exactly the same)*: More. Soon.

### C3 · The committee, Saturday night · ~45–60 s (including the Mario call, ~15–20 s)

**Where it goes.** The boardroom, the phones walking.

**The beats:**
1. Neleh's case: the bylaws, footnote three, the charter.
2. Alyi's wavering, the draft-2 run in full: "Step four will reveal itself." / "When?" / "The company will tell us." / *(the phones)* / "The company is calling us." / "That is the company telling us."
3. Mada's silence gets a question put to him directly.
4. The pressure named once: investors and staff want him back by a deadline, and it passes.
5. **A decision:** Neleh dials the rival lab. It replaces the speakerphone "dialling on its own".
6. On the split, the board **voices the offer** (the CEO job, and a merger). Mario gets to start his thoughts in a full sentence before Adelina takes the phone.

| | |
|---|---|
| **Wants** | Neleh wants the mission kept; Alyi wants the company kept; the phones want Mas back |
| **The turn** | "That is the company telling us.", then the call they make instead of answering it |
| **Must carry (newcomer)** | The staff and investors are demanding his return; the board refuses and looks for its own step four; the rival's "no" |
| **Insider layer** | Mario's roast; the full meters; the second phone |
| **Record** | The offer to Mario `[V as reported; deposition confirmed]`; the Saturday deadline (reported: the board "agreed in principle" to bring him back, then a ~5 pm deadline passed) |
| **Guardrails** | The deadline is reported, so keep its `(REPORTED)` label on screen, or leave it to a phone's caller ID rather than a line. Neleh principled, never a villain |
| **Coverage** | The held wide, Neleh's OTS onto Alyi's reflection, the Neleh/Mada two-shot, singles on the turns; the split for the call |

**Mario's second call.** For a newcomer, one extra line on Mario's side could say it's an investor calling. The Nozama caller ID does it for insiders. Or trim it (review §7.3).

### C4 · Sunday: the talks fail, the board hires Ttemme · ~35–50 s (plus the door, ~10–15 s)

**Where it goes.** The lobby camera on the wall screen: Mas is at HQ as a guest.

**The beats:**
1. The board watches him and talks about the talks. They've been at it all day, and they won't resign (reported).
2. They bring in TTEMME. His own public account is that before he took the job he "checked on the reasoning behind the change". So he asks.
3. Neleh hands him a sealed folder: the reasoning stays withheld, as it does in the record. He reads it, and he takes the job.
4. His button, "Chat… for how long?", now has a reason: he has taken a job on a reason he can't share, with a board under siege.
5. At 11:53 PM, Tasya's door and sign. The board's reaction gets one real exchange before "Step four?" and Mada's silence. They've hired both men, and Neleh says so.

| | |
|---|---|
| **Wants** | The board wants a CEO who isn't Mas; Ttemme wants to know what he's walking into |
| **The turn** | The door with Mas's name on the sign |
| **Must carry (newcomer)** | The return talks failed; why there's a second interim CEO; what happened to Rima (the board replaces her); that Macrosoft just hired Mas and Gerg |
| **Insider layer** | The hourglass; the F's; "not over safety" |
| **Record** | Ttemme, Nov 20: "Before I took the job, I checked on the reasoning behind the change. The board did *not* remove Mas over any specific disagreement on safety…" [V, facts #152, optional]. It can land as his post on Monday, or be heard over the hourglass |
| **Guardrails** | The folder stays sealed, like the memo (X9). Nobody states a reason. The board's refusal to resign is reported, so it needs its label or has to come from the letter's own words (C5) |

### C5 · Mas and Gerg, 2 AM · ~40–55 s (plus the Orb, ~6–8 s)

**Where it goes.** Before Gerg calls, Mas and the Orb speak aloud: draft 2's "the hearts were sincere." [HOLD] "mostly." (§3). Then Gerg's tile **rings** and Mas answers. Gerg has the letter open and **reads it to him** as the page scrolls. The record is heard, and it isn't a Mas tell:
- the count
- the insult line
- the demand
- the threat that they'll all follow him to Macrosoft
- Alyi's name

The check arrives while Gerg explains the share sale in one literal sentence. Then "what are you building?" / "The company. Again. Just in case.", and Gerg asks the one real question, whether they're taking the door. Mas doesn't answer. The glance.

| | |
|---|---|
| **Wants** | Gerg wants to know where they're going; Mas wants to keep every option |
| **The turn** | Alyi's signature ("He did both.") |
| **Must carry (newcomer)** | 745 of 770 staff; their demand; **their threat to quit and follow him to Macrosoft** (review §7.8); Alyi voted to fire him and then signed; the staff's payout depends on Mas; Gerg quit for him and is already rebuilding |
| **Insider layer** | The odometer clunk; EVIRHT; "just in case" |
| **Record** | The letter's insult line [V] and demand; its threat that Macrosoft "assured us there are positions for all NopeAI employees" (mid.md paraphrase; **fetch the exact words**). I believe the letter also says the board replaced the interim CEO within two days and told leadership that letting the company be destroyed "would be consistent with the mission". **That is from memory: verify before any use.** If confirmed, it carries the failed talks, Rima's replacement and the board's why, in the record's own words |
| **Guardrails** | The letter is heard only as exact words, with ellipses. Mas's lines state facts or ask, and never a motive |
| **Coverage** | OTS onto the monitor holds the exchange; Gerg's tile full on the letter; Mas MCU on "alyi voted."; the glance as the cut-in |

Sketch (Gerg's lines are cheerful, literal and mid-thought):
- GERG *(typing)*: One sec. Compiling. …Okay. Have you seen the letter? `[INVENTED · sketch]`
- MAS: i've seen the hearts.
- GERG: Seven hundred and forty-five. Out of seven-seventy. *(reads the demand and the threat, exact words)*
- GERG: Alyi signed it.
- MAS: alyi voted.
- GERG: He did both.

### C6 · Mas and Tasya's offer · ~25–40 s

**Where it goes.** The door rises. Tasya's "Everyone is welcome." (planted in sc 9) opens a real offer:
- a new team for Mas and Gerg
- anyone who follows
- their pay kept (the public promises, paraphrased; THE MATCHER's real line is available as a post)

Mas's answer is **considered**. Restore draft 2's look (the door, Gerg's tile, the hearts still coming) before "leave it open.", instead of the overlap. Tasya's hedge is the laugh: he'd be just as happy with NopeAI's new leadership (the real Nov 19 line, §3b).

| | |
|---|---|
| **Wants** | Tasya wants the people, whoever leads them; Mas wants the offer without having to take it |
| **The turn** | "leave it open." |
| **Must carry (newcomer)** | Macrosoft will take everyone, so the staff's threat is real, and that's Mas's leverage; Macrosoft wins either way |
| **Guardrails** | Never state Mas's intent. His lines ask ("and if i go back?") or grant ("leave it open."). No accent humour, and nothing about Monaco |
| **Coverage** | The dark room two-shot with the door; Mas MCU not turning; rack to the door |

### C7 · Mas and Alyi, Monday · ~20–30 s

**Where it goes.** The deliberate box, held longer:
1. Alyi reads his **whole** regret post (§3b).
2. Mas's three hearts cross the gap.
3. Then one spoken exchange across it. Alyi's line is his, weighty. Mas's is soft and about the company, never his feelings (R11: at a real event his surface stays blank).
4. The door stays shut behind Alyi, with his nameplate still on (draft 2), which sets up the nameplate coming off in S8.

| | |
|---|---|
| **Must carry (newcomer)** | Alyi fired him, then signed against his own vote, and now publicly regrets it; Mas forgives in public, and the forgiveness is ambiguous |
| **Guardrails** | No mental-health reading of Alyi, and no memo contents. Mas's words at a real event invent no intent |

### C8 · Tasya, the floor · ~15–20 s

"below them, above them, around them" gets its question. Mas asks what happens to Macrosoft if NopeAI doesn't make it. Tasya answers in the line's own context from the podcast ("we have all the IP rights and all the capability… We are below them, above them, around them." [V/K], fetch the exact words). Then "hi." / "Hello." plays as the gag it is. **Carries:** whatever happens, the landlord wins.

### C9 · The return negotiation, Tuesday night · ~40–60 s

**Where it goes.** Terb's entrance and the fires stay. Then Terb actually runs it, brisk and procedural. He lays out the terms:
- Mas back as CEO
- a new board of three: Terb as chair, THE OTHER YRRAL (mute, one shot, draft 2's seating), and Mada, who stays
- Mas and Gerg off the board
- an outside review

Mas asks the question that turns the catchphrase: what the review is into. Terb looks at Mada, and Mada takes his time: "Good question." / "good question." That leaves the why as a question the show deliberately raises (withheld on purpose) instead of a gap. The deal's real announcement can be read at the button, and the term-sheet insert goes.

| | |
|---|---|
| **Wants** | Terb wants it signed tonight; Mada wants his seat; Mas wants back in without giving up anything he can name |
| **The turn** | The echo |
| **Must carry (newcomer)** | He's CEO again; who's on the new board and that Mada is the firer who stays; what he gives up; that the reason was never settled |
| **Record** | The Nov 21 announcement: "…an agreement in principle for Mas Manalt to return to NopeAI as CEO with a new initial board of Terb (Chair), [THE OTHER YRRAL], and Mada." [mid.md; fetch]. The review is reported (later the WilmerHale review, [V] Mar 2024), so facts must settle how it's worded in Ep1 |
| **Guardrails** | THE OTHER YRRAL has no dialogue. Terms only as public; no allegation in the review's subject |
| **Coverage** | The boardroom wide holds the entrance; the calm-off two-shot holds the negotiation; OTS on Terb for the terms; singles on "you stay." and the echo |

Sketch:
- TERB: Terms. One: you come back as CEO. `[INVENTED · sketch]`
- MAS: and the board?
- TERB: Three seats. Me in the chair. *(THE OTHER YRRAL nods, mute.)* And Mada.
- MAS *(to Mada)*: you stay.
- MADA *(a pause)*: I stay.
- TERB: You and Gerg don't sit on it. And there's an outside review of the whole week.
- MAS: a review of what?
- *(Terb looks at Mada. Mada takes his time.)*
- MADA: Good question.
- MAS *(one beat late)*: good question.

### C10 · The vault, and the memo · ~15–25 s

Gerg doesn't walk away on "it's a preview.". He pushes once, engineer-literal, with what the staff reportedly wrote to the board about: a model that did math it hadn't been taught. Mas deflects again, and Gerg reads the sticky note (`DO NOT EXPLAIN`). The joke stays and the newcomer gets two words of what Q\* is, so the rail can shorten or go.

The memo can be read to a listener (the bullpen), in its full sentence (§3b).

**Guardrails:** the Q\* material is reported (Reuters and The Information), so keep the `(REPORTED)` label on screen.

### 2.1 Runtime

**Runtime is an outcome, but there is room.** The script header's target is 22:00, with story 20:45 ±0:30. The printed story is ≈ 17:12 (≈ 16:52 as played), so the episode has about **3:30–4:00** of headroom. Draft 2's act printed 7:14.

| Seq | v4.2 | Proposed talk | Rough length |
|---|---|---|---|
| S1 | 38.5 s | unchanged (option A +10–15) | 38–52 s |
| S2 | 14.3 s | unchanged | 14 s |
| S3 | 26.7 s | C1 + C2 | 75–105 s |
| S4 | 49.6 s | C3 + C4 | 95–125 s |
| S5 | 36.1 s | the Orb + C5 + C6 | 70–100 s |
| S6 | 15.6 s | unchanged | 16 s |
| S7 | 40.8 s | C7 + C8 + C9 | 75–105 s |
| S8 | 29.9 s | C10, the lobby's triple folded (−2 to −3 s) | 30–40 s |
| **Act** | **4:11.5** | | **≈ 6:50–9:20 as listed. Aim for about 6:30–7:00: take the low end of every range, and cut any conversation beat that doesn't carry one of the must-carry items** |

**Where the time comes back from:**
- The silent inserts that the talk absorbs: the blog post, the letter page, the term sheet, Mario's long plate, the `RETURN TALKS` rail and the Q\* rail.
- The 22.5 s wordless run after the negotiation.
- The lobby's three beats (review §7.5).

**POV check.** Pass one would grow from 1:17 to about 2:50–3:50, around 14–18% of the episode, well past the pov-and-framing guide (≤ 12%). Take the low end of C1–C4, and keep his side's chapters growing with them, so the exit stays the exception.

### 2.2 Keep as seasoning (about one a sequence)

- "And the CEO owns—" / "Good question.", but give Mada's blueprint figure a face or a drawn plate before he speaks.
- "super.", twice.
- Adelina taking the phone, **after** Mario finishes his first sentence.
- "Has anyone read the char—" in the montage.
- "Step four?" and Mada's silence.
- "good question." one beat late.
- "okay."

Everything else plays as full turns.

---

## 3. Draft 2 material worth restoring

Take IDs are the recorded scratch takes. They'll need re-reading at a natural pace anyway (§6).

| # | Draft 2 | Where it goes now | Why | Take |
|---|---|---|---|---|
| 1 | Banner `THE BOARD'S DUTY: THE MISSION. NOT THE INVESTORS.` (THE PLAN) | Say it rather than print it: in C2 and in Alyi's real all-hands answer | The board's why, the newcomer's #1 gap; it also sets up "That is the company telling us." and "Has anyone read the char—" | — |
| 2 | RIMA "I'll hold it together." / NELEH "For how long?" / RIMA "We'll share more soon." | C2, as an appointment | A real follow-up question; it plants her short tenure (the newcomer asked "what happened to Rima?") | `retired/a4-27-02`, `a4-27-03` |
| 3 | ALYI "The company will tell us." | C3, between "When?" and the phones | Makes "That is the company telling us." a callback inside the conversation, not a koan | `retired/a4-27-11` |
| 4 | MARIO "I've written up some thoughts." (a full stop), with "His finger rises." | C3 | Lets him finish a thought before Adelina's "no" | `retired/3.1/wav/a4-27-14` |
| 5 | `ADELINA / IN PLAIN ENGLISH:` · `TRANSLATES DOOM INTO REVENUE` | C3, as a plate at least | She's an unnamed stranger in v4 | — |
| 6 | TTEMME "Chat. I'm the CEO now." then the hourglass | C4, only if Ttemme's exchange with the board isn't written | Gives "for how long?" a referent | `retired/a4-27-18` |
| 7 | "Behind him, through the door, is a desk for every employee, already labelled." | S4's door (board side) | Shows the threat, that everyone can go, before the letter says it | — |
| 8 | MAS *(to the Orb, aloud)* "the hearts were sincere." [HOLD] "mostly." | S5, replacing V.O. D3 + "mostly." | A spoken two-beat exchange about what we just watched him do, instead of a one-word reply to an unheard thought. Cost: the act keeps one V.O. (D2) | `retired/a4-29-02` (draft 2's on-mic read); `mostly.` `a4-29-03` |
| 9 | GERG "One sec. Compiling." (a full stop) | C5 | Gerg finishes; Mas waits | `retired/3.1/wav/a4-29-04` |
| 10 | "Mas looks at the blue door. Then at Gerg's tile. Then at the feed, where the hearts are still coming." | C6, before "leave it open." | The answer becomes considered, not a reflex overlap | — |
| 11 | The new board takes its seats: TERB, THE OTHER YRRAL (mute), MADA | C9 | The terms, shown and said | — |
| 12 | Q\* rail: "STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED 'Q\*'" | C10, if the talk doesn't carry it | "Breakthrough" is the two words the newcomer lacked | — |
| 13 | The conference-room door shut, "with its nameplate still on" | C7 / S8 | Alyi still works there (the newcomer asked "had Alyi left, or gone home?") | — |
| 14 | Sc 26: "Alyi's mouth moves, but no sound reaches Mas's tile." | S1, as the hinge for C1 | His side sees a mouth move; their side hears the words | — |
| 15 | *(3.1)* MAS (V.O.) "the meeting ended early." | S2, optional | A dry, complete thought on the firing. It was cut for a music-phrase reason, not a story one | `retired/a4-26a-vo2` |

**Don't restore:**
- "Step four." / "Good question." on THE PLAN (it spoils the fold).
- Mada's "Good question." ending pass one (his silence is better, and the line is rationed).
- The typed `…` dialogue boxes.
- `RAIL: +1 FIRING`.

### 3b. The fuller record (the richer source)

These are the fuller versions of lines the act already uses or its research already holds. Each one is a complete thought, and each is safer than invented talk because it's the record. **Every row needs the facts owner's re-fetch and log before lock.** Items marked *memory* are my recollection, not yet in the repo.

| Line (parody names substituted) | Date | Status | Conversation |
|---|---|---|---|
| ALYI: "You can call it this way… I disagree with this. This was the board doing its duty to the mission of the nonprofit…" | Nov 17 | mid.md §3; facts logs only the first clause | C2 |
| Blog post: "…not consistently candid in his communications with the board, hindering its ability to exercise its responsibilities. The board no longer has confidence in his ability to continue leading NopeAI." | Nov 17 | mid.md; facts #139 logs the clause | C2 |
| GERG's joint timeline (the call's public account: told he was being fired, and that the news was going out very soon) | Nov 17 | facts #141 has its first line; the account is *memory* | C1 |
| TASYA: "We look forward to getting to know Ttemme and NopeAI's new leadership team." | Nov 19–20 | mid.md | C6 |
| The letter: Macrosoft "assured us there are positions for all NopeAI employees" (the threat) | Nov 20 | mid.md paraphrase | C5 |
| The letter: the interim CEO replaced within two days; letting the company be destroyed "would be consistent with the mission" | Nov 20 | *memory*. The reported Toner version is [reported NYT/WSJ], and Neleh's character file allows it only `(REPORTED)` | C5, only in the letter's own words, never as Neleh's voiced line without a guardrails ruling |
| TTEMME: "Before I took the job, I checked on the reasoning behind the change. The board did *not* remove Mas over any specific disagreement on safety…" | Nov 20 | mid.md; facts #152 [V] | C4 |
| ALYI: "I deeply regret my participation in the board's actions. I never intended to harm NopeAI. I love everything we've built together and I will do everything I can to reunite the company." | Nov 20 | mid.md; facts logs the first sentence | C7 |
| TASYA: "…we have all the IP rights and all the capability… We are below them, above them, around them." | Nov 20 | mid.md; [V/K] | C8 |
| THE MATCHER: "…you have a role at MACROSOFT that matches your compensation" | Nov 21 | facts #153 [V] (the character is cut) | C6, as a post |
| The deal: "…an agreement in principle for Mas Manalt to return to NopeAI as CEO with a new initial board of Terb (Chair), [THE OTHER YRRAL], and Mada." | Nov 21 | mid.md | C9 |
| MAS: "i love nopeai, and everything i've done over the past few days has been in service of keeping this team and its mission together. when i decided to join msft on sun evening, it was clear that was the best path for me and the team…" | Nov 21 | mid.md, ID-decoded | S7, optional: his side in his own public words, with no invented intent |
| MAS memo: "I love and respect Alyi, I think he's a guiding light of the field and a gem of a human being. I harbor zero ill will towards him." | Nov 29 | mid.md; facts #156 has the ellipsis | S8 |

---

## 4. Guardrails for the rewrite

- **Only the board's public wording characterises the firing** ("not consistently candid…", "no longer has confidence…", "duty to the mission"). No new reason, no allegation, no memo (X9); a reasoning folder stays sealed.
- **Reported items keep a `(REPORTED)` label on screen,** or stay in props. That covers the Saturday deadline, the board resisting resignation, the review and Q\*.
- **Invented lines** stay on AI, money, the company and procedure. They never invent intent at a real event, and they're marked `[INVENTED]` in the script, never in quotation marks.
- **Mas** never states a motive: he asks, grants, deflects or states the public. Lowercase.
- **Alyi:** no mental-health reading. **Neleh:** principled, never a villain. **Tasya:** no accent humour, no Monaco. **THE OTHER YRRAL:** mute.
- **Parody names only** (naming.md): NopeAI, Macrosoft, Misanthropic, Nozama, Elgoog, EVIRHT, TTEMME, TERB, TASYA, THE MATCHER, THE OTHER YRRAL.
- **POV.** The board's conversations belong in pass one, the signposted exit. Everything else plays with Mas in the room or on his monitor.
- **No new real person's voice is cloned.** New lines need new scratch reads from the same stock packs.

## 5. For the bible owner (not changed here)

The same shape shows up across Ep1–3 (the lead's measure). The rules that push toward it are:
- tone-and-dialogue R8's test and its per-scene checklist item (§7, "at least one overlap, cut-off…")
- R5's "one button, not three"
- R6's worked example, which is this act's Rima exchange cut down to quips

flow-and-continuity §4 already says the opposite. Those rules and their examples should be brought into line with it.

## 6. What a human must check (I can't listen or watch)

1. **Whether the v4 takes sound unnatural in themselves.** They were sped up to fit the picture (175 wpm average), with ≤ 0.3 s internal pauses and no tails on cut-offs. The worst candidates are:
   - "Hi. Yes. We're very worried. How much?" (stops of 0.12–0.16 s)
   - "…Ah." and "Terms?" (×1.375, then compressed ×1.10)
   - Adelina's "no" (×1.27)
   - "Is this a coup?" (296 wpm)
   - Rima (214 wpm)
2. **Whether the rewritten conversations hold a thriller pace** at 40–60 s once they're voiced, and whether the coverage holds them without the act feeling slower.
3. **Whether pass one's growth unbalances the telling** (§2.1).
4. **Whether C1 option B's frozen-feed irony reads, or confuses the "super." match.**
5. **A fresh newcomer and a fresh insider on the rebuilt cut.** Test the five gaps in review §4: the why, Mario's second call, the failed talks, the letter's threat, and Q\*.

Nothing here is locked or finished. It's a diagnosis and a plan for the writer.
