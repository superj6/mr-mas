# Ep1 v3: transitions and naturalness review (the supervising editor)

> **Status: REVIEW, 2026-09-27**, for script v3.1 ([PLAN §5](PLAN.md#5-v31-the-finalizing-round-from-2026-09-27-1600), work item 1).
>
> **The brief (showrunner, 2026-09-27):** "there are still a few confusing transitions that just seem to come out of nowhere, sometimes without proper buildup/context. also, i want to bring back the sydney and atem references at least. just review and think about where could still be improved, what is still too unnatural, but overall it is coming together well."
>
> **Folded in, mid-pass:** the showrunner's note on Act Four ("the transition right now hitting worse is beginning of act 4 … the viewer just becomes aware through the plan, the video call is a bit hard to understand what cancel means") and the lead's decided fix (PLAN §5, end). I don't re-derive that fix. §2 checks what it does to the seams around it and lists what it breaks.
>
> **What I looked at:**
> - The Kokoro film, `out/ep01/full-v3/ep01-v3.mp4`: four frames at every change of place or time (1 s before the cut, then 0.25, 1.5 and 3 s after it; 57 seams, 228 frames), plus three frames at full size.
> - The lock's transcript, and the six v3 timelines for each beat's start, length, lines and on-screen text.
> - Script draft 6, its notes, the lock, sound.md (for the sound leads), the v2 Act One timeline and takes (for Sydney and Atem), and the v2 newcomer read.
>
> **What I didn't do:** I didn't hear the film. Every "sound lead" below is from the timelines, sound.md and the script, not from listening. Nothing here claims a cut plays. That needs a person watching in real time (flow-and-continuity §5.3).
>
> **Timecodes** are film time in `ep01-v3.mp4` (Act One starts at 1:02.67). The lock transcript runs 3.0 s later, because it has a title slate. The film's cold open is the old one, so its seam into the intro isn't reviewed.

---

## 0. The fixes, ranked (impact against cost)

"Runtime" is the change to story time. "Cost" is new drawings (art) and new recordings (takes).

| # | Fix | Where (film) | Why it's worth it | Runtime | Cost |
|---|---|---|---|---|---|
| 1 | **The Act Four reorder's seams (the lead's fix, §2).** Land the Orb's rewind on Neleh's physical desk at 11:52 before the blueprint. Give THE PLAN a lead-in: Mada's tile has joined early, and she walks it through "once more". Move Neleh's gag card off the shock's grid. Make the board's side show the same Remove click. Redraw the lobby's dialog callback as a greyed **Remove**. | 12:06–13:09 | The showrunner's worst transition. Without these, the board's side opens on a floating diagram, the recap is "as you know" exposition, and two later beats contradict the new noon. | ≈ +3 s (my estimate) | Small: 1 drawing (the desk), 1 new line, 2 redraws |
| 2 | **Sydney restored inside the weeks-on lobby** (§4.1). "ours does that too." gets its proof: the bubble has ChatGTP's face. The landlord leashes it, and Gerg's laptop close gets a reason. | after 5:20.9 | A showrunner ask. It pays Rima's launch-night "what do we tell them?", plants Act Four's "all the capability", and gives Ep2's `😊` callback its setup again. | ≈ +23 s (lean +20) | 5 of 7 takes exist (v2); 2 new lines; the bubble, timer and TV drawings |
| 3 | **Atem restored as a setup and a payoff** (§4.2). The leak is on Gerg's laptop when the match cut opens it. Then, at Act Three's head, the landlord hangs a thirteenth key for Kram, and Mas counts it. | 5:25.1; 9:49.9 | A showrunner ask. It turns the duel's 3 s arrival into a scene, and it makes Tasya's "Everyone is welcome." mean "you're one of many" before Act Four's door. | ≈ +11 s | 2 takes exist (v2); 3 short new ones; the thread, the key, Kram |
| 4 | **Cut the Sep 25 lighthouse/Nozama item** (19.01–19.13), or give its slot to the lead's hands runner. | 10:15.3 | The worst "out of nowhere" stay: two months jump on a rail, into a rival's room, and nobody reacts ("He sips, and says nothing."). | −9.5 s | none |
| 5 | **The bay bridge gets a reason.** Match the class-photo print in his hand to the phone in his hand at the window. His feed shows the photo, then scrolls to the altered clip. Drop the first push (14.02). | 7:39.2 | Right now the White House cuts to a dark window with no place, no want and no reaction. It's guardrail-kept, so fix it rather than cut it. | ≈ −0.3 s | 1 recomposed shot |
| 6 | **Tuesday gets a setup.** At the end of Monday, his phone shows the cold open's invite UI: `Board · Tue 10:00 PM`, with a spinner, a helmet and a blank. He taps Accept. | 19:05.1 | "Down here." cuts straight into a burning boardroom with Mas in it. The invite gives the room a reason, and rhymes Friday's invite. | +2.5 s | 1 insert (reuses the invite UI) |
| 7 | **Nedib's "Longer." gets its trigger**: Mario's scroll comes out, then "Longer.". | 7:28.6 | Right now "Longer." is a blurt stuck to the end of a line. | 0 | re-cut only |
| 8 | **13.01's V.O.: "since the lobby" → "since we sat down"** | 6:26.2 | "the lobby" points at the two lobbies we've seen (Elgoog's, NopeAI's), and both are wrong. | 0 | 1 take |
| 9 | **Cut v3-vo-23, "gerg never waits to be asked."** | 17:46.1 | It explains the laugh we just had ("Just in case."), and it repeats Alyi's line from three minutes earlier word for word. | −2.5 s | none |
| 10 | **21.04: the Orb answers, not Mas.** Cut "the one with the pen."; the Orb's `verified: human` toast pops over the real Nedib. | 11:27.2 | A question he answers himself is a quiz, and the toast calls back 18.05. | −1.2 s | none |
| 11 | **Tasya's floor: "Hello." → "Down here."** | 19:03.6 | The v2 newcomer read flagged "Hello." as dangling. "Down here." answers his look at the floor. | 0 | 1 take |
| 12 | **Rima: "More. Soon." → "We'll say we will."** | 14:11.4 | It reads as a written echo. The new line is her pragmatism, spoken. | 0 | 1 take |
| 13 | **DevDay orients:** open 22.01 on the two-shot (him at his desk, watching himself) for 1 s before the POV. Optionally add V.O. "i've watched it three times." | 11:31.3 | Is he at DevDay, or at home watching it? The prompt answers that 8 s late. | +1 s (+2.4 with the V.O.) | 1 take if the V.O. |
| 14 | **Rezeile's op-ed (the lead's restore) as the thud that leads back to his desk** (§6) | 6:16.7 | Its thud was the sound lead the v3 cut lost. EMIT's masthead then pays off on the tag's cover. | lead's figure | the lead's |
| 15 | **Trims to pay for 2, 3 and the lead's other restores** (§5) | across | Whole beats nobody in the scene cares about, never the air at a scene's edge. | −23 s (tier 1), −23 s more (tier 2) | none |

**Where it lands:** my additions and tier-1 trims give about **20:55**. With the lead's other restores (the hands runner, Rezeile, the Act Four reorder) and both tiers of trims, it's about **20:48–20:53**. §5 has the ledger.

---

## 1. The transition table

**Columns:**
- **Bridge:** J = a sound lead (J-cut); L = sound carried over (L-cut); A = an arrival wide; D = a dialogue hook; M = a match cut; V = orienting V.O.; R = a rail. "—" means nothing.
- **3 s?** Does the viewer know where / when / who within 3 s of the cut (Y or N for each, in that order)?
- **Motivated?** Did the previous scene give a reason to come here?

| # | Film tc | From → to | Bridge | 3 s? (where/when/who) | Motivated? | Verdict | Fix (weak and bad only) |
|---|---|---|---|---|---|---|---|
| 1 | 1:00.7 | intro → filename card | the intro's own end; card room tone | — | — | OK | |
| 2 | 1:02.7 | card → bullpen, launch night (NOV 30 2022) | J (the bullpen's room 0.6 s); an insert (the button) 3 s, then A + R + V at 3.0 s | N/N/N at 3 s; all Y at 4.2 s | Y (the intro's "research preview" → the button labelled that) | OK | |
| 3 | 2:53.5 | the chat's counter → the drill (to DEC 5) | M (the counter grows out of the bubble); a music downbeat; V "someone noticed." | Y/Y/Y | Y | OK | |
| 4 | 3:03.5 | drill → Gerg's phone, Nole's post (DEC 3) | R; inside the montage | Y/Y/~ (hands only) | Y (montage) | OK | |
| 5 | 3:08.5 | → the basement, the million (DEC 5) | R on the wheel | Y/Y/— | Y | OK | |
| 6 | 3:21.9 | → the hole, later | J (Rima's line 0.6 s early) | Y/Y/Y | Y | OK | |
| 7 | 3:33.7 | the tear → his phone: `ELGOOG · CODE RED` (DEC 21) → the POV (3:36.2) | J (the siren through his phone under the steam); R; an alert that names the rival | Y/Y/Y (Radnus plated at +3.3 s into the POV) | Y (the million → the rival's alarm) | OK | |
| 8 | 4:06.7 | Elgoog → back over his shoulder | the cutaway returns | Y/Y/Y | Y | OK | |
| 9 | 4:09.2 | bullpen → NopeAI lobby (JAN 23 2023) | L (the revolving door's sweep leads 0.8 s); A 5.5 s; R; he walks in on his own exit line | Y/Y/Y (Tasya named at +5.5 s) | Partly: "it's the bill" → money, with Elgoog in between. The lease's "keep the lights on and the floors warm" closes it | OK | |
| 10 | 4:59.3 | lobby → lobby, weeks on (FEB 7) | A 3.6 s; R; the scuffed check and the twelfth key tell the jump | Y/Y/Y | Y | OK (a model seam) | |
| 11 | 5:12.3 | the lobby → its TV: Elgoog across town (FEB 8) | the TV's own caption; R | Y/Y/Y | Y (Tasya's "made them dance") | OK | |
| 12 | 5:25.1 | lobby → bullpen, demo day (MAR 14) | M (Gerg's laptop closes, then opens); J (the Build's chip line 0.8 s); R; the `GTP-4` banner | Y/Y/Y | **Weak.** The close has no strong reason, and the bullpen gets 3 s before the frame splits into a new place. A formal rhyme with no scene behind it | **Sydney (§4.1)** gives the close its reason. **The Atem setup (§4.2)** gives the bullpen a 10 s conversation before the split |
| 13 | 5:28.1 | → the split: the lighthouse | the frame splits on the downbeat; V introduces Mario at +0.8 s | Y/Y/Y | Y (the demo day's rival launch) | OK | |
| 14 | 6:01.7 | the duel → his desk at night (MAR 22) | J (the toast pops 0.4 s early); OTS onto the monitor; R | Y/Y/Y | Y (the race began → a letter asks for a pause) | OK | |
| 15 | 6:06.0 | his monitor → a standing desk in the dark (Nole) | a push into the monitor (the letter becomes a clipboard) | ~/Y/Y (NOLE plated at +0.5 s) | Y | OK | *(Rezeile's restore lands here, §6)* |
| 16 | 6:16.7 | → back to his desk: `PLEASE` | J (the pen's scratch 0.5 s) | Y/Y/Y | Y | OK | Restore the op-ed's thud as the lead (§6) |
| 17 | 6:25.2 | black → Act Two, the White House (MAY 4) | J (the mantel clock under the black); A 3.5 s; R; V | Y/Y/Y | Y (`PLEASE` → where rules are made) | OK | Line fix #8 |
| 18 | 7:39.2 | the class photo → the bullpen window at night (MAY 12) → the bay (7:41.8) | L (the photo's white decays into night); R; a 3-cut push | **N**/Y/~ (a back in the dark; the window could be anywhere) | **N.** Nothing at the White House leads to a clip on his phone, and nobody reacts | **Bad** | **Fix #5:** a match cut from the print in his hand (13.14) to his phone in the same place in frame (14.01). His feed opens on CLASS PHOTO #1, and his thumb scrolls to the next item, the anchor clip with `⚠ ALTERED AUDIO`. The window then reads as his, and the clip as something the day served him. Drop 14.02 (the first push). +1.0 −1.25 s |
| 19 | 7:48.9 | the bay → the Senate (MAY 16) | M on the voice (the smooth voice over black 1.3 s, then the room 1.0 s under); R | Y/Y/Y (the chairman plated at +4 s) | Y | OK | |
| 20 | 9:01.0 | Sucram's stare → the tour poster (MAY 24–26) | the stamp's thunk with the score's stab; the far street; R | Y (a poster)/Y/Y | Y (`PLEASE REGULATE ME` → he takes it on tour) | OK | |
| 21 | 9:09.0 | poster → the rooftop (MAY 30) | J (the wind 0.6 s); A; R; the statement types | Y/Y/Y | Y | OK | 15.15 → 16.01 → 17.01 is 23 s without a spoken word (tier-2 trim, §5) |
| 22 | 9:49.9 | black → Act Three, the dark room (JUL 24) | J (the rack's fans under the black); A 3.5 s; R on the tray at +4.2 s | Y/N at 3 s/Y | Y (the crack in his glass → him alone) | OK | The Atem payoff (§4.2) rides this arrival |
| 23 | 10:15.3 | the Orb settles → the monitor: the lighthouse, Mario's second phone (SEP 25) | the Orb's iris flick; R only | Y/Y/Y | **N.** Two months pass, we're in a rival's room, and he "sips, and says nothing" | **Bad** | **Fix #4:** cut 19.01–19.13 (−9.5 s). Or give the slot to the lead's hands runner, entered on the same iris flick (§6). Or, if it stays, add one V.O. read over 19.12: "mario has a landlord now." (0 s) |
| 24 | 10:24.8 | → Tidder (~SEP 26) | J (his keys); OTS onto the monitor; R | Y/Y/Y | Y (the same room, a new night) | OK | |
| 25 | 11:05.7 | Gerg's call → the order on the monitor (OCT 30) | L (the keys under the rail's roll); R | Y/Y/Y | Partly (Nedib's "put it in writing" pays with the long desk) | OK | |
| 26 | 11:31.3 | the deepfakes' clapping → DevDay on the monitor (NOV 6) | L (the clapping becomes applause); R | **~**/Y/Y (he's on the stage in the monitor; is he there or home?) | Y | **Weak (small)** | **Fix #13:** open 22.01 on the two-shot (him at his desk, the keynote on the monitor) for 1 s, then the POV. Optional V.O. over the POV: "i've watched it three times." (a vanity read that also orients; +2.4 s) |
| 27 | 11:48.0 | "super." → THE CLOCK: NOV 16 → 17 | the cue's downbeat; the cold open's frame on the monitor; the invite reminder | Y/Y/Y | Y | OK (strong) | |
| 28 | 11:58.0 | black → Act Four, the Vegas suite (NOV 17, noon) | J (the crane and the glass tings under the black); A; R; V "the race is tomorrow…" | Y/Y/Y | Y (the reminder → the meeting's day) | OK | |
| 29 | 12:06.2 | JOIN → THE PLAN (the blueprint) | the glow turns to blueprint | ~/Y/N (a narrator we haven't met) | The viewer learns of the firing from a diagram before it happens | **Bad** (the showrunner's note) | **The lead's fix:** THE PLAN moves to the board's side. Consequences in §2 |
| 30 | 12:30.7 · 12:36.5 | THE PLAN → JOIN → the call | the blueprint tears back into the suite; the JOIN click | Y/Y/Y | Y | *(replaced by the fix)* | §2 |
| 31 | 12:55.6 | "super." → the dark room that night | the room steps to night in palette steps; J (the drone); R | Y/Y/Y | Y | OK | |
| 32 | 13:01.5 · 13:05.0 | the marks → the TPOOL flash → back | a render front out of mark 1; R `TPOOL, HIS FIRST COMPANY` | Y/~/~ (two shadows at a door) | Y (the Orb's light steps onto mark 1) | Weak for a newcomer, **on purpose** (the season withholds marks 1–2) | Keep. If runtime bites, it's tier 2 (−4.8 s) |
| 33 | 13:09.0 | the Orb's rewind → Neleh's desk, 11:59 (the board's side) | the `rewinding…` toast and the whip; J (her office clock 0.6 s); the call's `11:59`; "Waiting for MAS MANALT…" | Y/Y/Y | Y | OK (strong) | Under the lead's fix this seam lands on THE PLAN, see §2 |
| 34 | 14:13.6 | → the all-hands, Friday afternoon | J (the crowd's hush 0.8 s); M (Alyi's doorway tile → the real doorway) | Y/Y/Y | Y ("The staff will ask you what happened.") | OK (strong) | |
| 35 | 14:28.4 | → Neleh's desk, evening | M (the empty doorway → his tile); her lamp on | Y/Y/Y | Y | OK | |
| 36 | 14:39.0 | → the boardroom, Saturday night (NOV 18) | J (the heart gliss); R; opens on the wall screen, the room at +4.8 s | ~/Y/Y | Y (Gerg's quit → the fallout) | OK | |
| 37 | 15:08.2 | Neleh dials → the split with the lighthouse | the ring carries across; the split | Y/Y/Y | Y ("we'll write step four ourselves") | OK (strong) | |
| 38 | 15:30.1 | the dial tone → Sunday: the lobby's CCTV on the wall (NOV 19) | J (the CCTV hum 0.5 s); the CCTV's own date | Y/Y/Y | Y | OK | |
| 39 | 15:45.4 | → Sunday night: Ttemme | "the window went dark"; the spotlight swings | Y/Y/Y | Y (the talks went nowhere) | OK | |
| 40 | 16:08.1 | → ~11:53 PM: Tasya's door | R; the wall steps to slate | Y/Y/Y | Y | OK | |
| 41 | 16:33.1 | Mada's silence → his dark room, Monday 2 AM (NOV 20) | J (the dark room's drone 1.0 s under Mada); the home shot; R at +2.1 s; V (the count) at +5.1 s | Y/Y/~ (his glass; him at +4.5 s) | Y (the board's side ends; we're back) | OK | |
| 42 | 18:12.0 | "leave it open." → the tile avalanche on his monitor | J (the first tile's thock); the grid; `745 / 770` | ~/N/Y | Mostly (the letter's "…unless all current board members resign…" is about a minute back) | OK | Optional, 0 s: the first tile to land carries the letter's header strip, so the avalanche reads as the letter arriving |
| 43 | 18:28.2 | Mada's label → the bullpen, Monday by day | J (the bullpen by day 0.8 s); the two boxes; R at +1.7 s | Y/Y/Y | Y | OK | |
| 44 | 18:48.0 | the boxes → the packed bullpen (continuous) | A (the establishing wide, after the box) | Y/Y/Y | Y | OK | |
| 45 | 19:05.1 | Tasya's "Hello." → the boardroom with fires, Tuesday ~10 PM (NOV 21) | J (the fires' crackle 0.6 s); R; the freeze card | Y/Y/Y | **N.** Monday ends on the landlord owning the floor, and nothing says there's a meeting, or why he's at it | **Weak** | **Fix #6:** S7.03b, 2.5 s: on the desk beside the two badges, his phone lights with an invite in the cold open's calendar UI: `Board · Tue 10:00 PM`, `Accept` `Decline`, and three circles (a spinner, a fire helmet, a blank). His thumb taps Accept with no hover. **J-CUT:** the fires crackle under the tap. It sets up who's in the room (Mada's spinner; the helmet is Terb), rhymes Friday's invite, and needs no line |
| 46 | 19:58.0 | the hourglass → the lobby at night | J (the neon's buzz); a low wide; the sign | Y/Y/Y | Y | OK | |
| 47 | 20:10.0 | "okay." → the Q\* vault (NOV 22) | a sound match (the cadence settles onto the vault's F); R | Y/Y/— | Withheld on purpose (`DO NOT EXPLAIN`) | OK | |
| 48 | 20:22.7 | → the bullpen, the memo (NOV 29) | R; A | Y/Y/Y | Y | OK | |
| 49 | 20:31.1 · 20:34.6 | the memo → the nameplate → the shut door | L (the memo runs over the nameplate) | Y/Y/Y | Y | OK | |
| 50 | 20:41.8 | the observer chair → the tag, the dark room (DEC 6) | L (the vault's F 0.6 s); A; R on the delivery at +4.5 s | Y/~/Y | Y | OK | *(the lead's Runway Elgoog demo lands here, §6)* |
| 51 | 21:04.4 | the framed badge → the thud (late December) | the THUD; the clerk's stamp carries the date | Y/Y/Y | Y (the next fight arrives) | OK | |
| 52 | 21:15.6 | black → the outro | the hum; the Orb | — | — | OK | |
| S | 5:20.9 | **new:** "ours does that too." → Sydney, in the same lobby (FEB 13 → 17) | the bubble slips out of the GNIB screen that just made the point; R | Y/Y/Y | Y (the line's proof) | (proposed) | §4.1 |
| A1 | 5:25.1 | **new:** the match cut opens on the leak thread → the split | M, then D (Gerg reads, Mas predicts) | Y/Y/Y | Y | (proposed) | §4.2 |
| A2 | 9:49.9 | **new:** the dark room: the landlord's lobby on the monitor (JUL 18) → the Orb's box (JUL 24) | the arrival's own monitor; V "thirteen." | Y/Y/Y | Y (the prediction, and the landlord's "Everyone is welcome.") | (proposed) | §4.2 |

**Totals:** 52 existing seams. 2 bad (the bay, the lighthouse), 1 bad by the showrunner's note (THE PLAN before the call, already being fixed), 4 weak (the duel's arrival, DevDay, TPOOL on purpose, Tuesday). The rest are OK. Most carry a sound lead or a match, so the §4 target ("a third carried by sound or shape") is met.

**The pattern in the bad and weak ones:** each is a change of place that nobody on screen wanted. The fixes add a want at the seam: his feed at the bay, his invite on Tuesday, Gerg's thread on demo day. None adds a label.

---

## 2. The Act Four reorder: its seams, and what it breaks

**The lead's fix, in brief:** his side opens on the shock. Vegas → JOIN → Alyi's first sentence → a literal `Remove MAS MANALT from the meeting?` dialog → the drop, the silence, "super.". THE PLAN moves to open the board's side, and the Cancel metaphor is retired.

### 2.1 The new seams

| Seam | Does it orient? | What it needs |
|---|---|---|
| **N1.** The suite → the call (S1.02 runs straight into the JOIN) | Y. v3-vo-17 and v3-vo-18 now sit about 8 s apart, one cluster. **"…probably just the budget." now comes before any explanation,** so we believe him too, which is what the voice guide asks for (§1.3). | Merge S1.02 and S1.06 (the pointer beside JOIN, the V.O., the click). The suite's music needs its own lead into LEVERAGE, since sc 24–25 were "one performance" with the waltz. |
| **N2.** Alyi's sentence → the host dialog (a hard cut) | Y, if the dialog is the call app's own, in the 1993 look, with **ALYI** on the pointer. | **Move Neleh's gag card** (`READ THE CHARTER. LITERALLY.`) off this grid. A joke card inside the blow deflates it. Put it on her first appearance on the board's side (the PLAN's open). His side's grid keeps the call's own name labels only. |
| **N3.** The Orb's rewind (S2.05) → the board's side, THE PLAN | **Only if it lands on a place.** If the whip lands on the blueprint graphic, a newcomer reads it as the show explaining, not as the board's side, and nothing says "earlier" except the toast. | **Land the whip on Neleh's desk from above, 11:52 on her laptop's call clock.** The call is open, Mas's slot reads `Waiting for MAS MANALT to join…`, and the blueprint is unfolded beside it. Keep the office clock's J-cut. Push into the paper, and let it come alive as THE PLAN. Her figure steps out of her own `NELEH` chair outline on her first line, so the narrator is placed. |
| **N3a.** THE PLAN's lines, now diegetic | **A new naturalness problem:** "Three of us stepped down this year" and "the four of us are a majority", said to fellow directors, is as-you-know exposition. | Give it a reason in her character (she reads everything once more). **NELEH** *(to Mada's tile, which has joined early; pen on the sheet)*: "Once more, before the others join." `[INVENTED]`. Mada being early also motivates his "Good question.": he's the one on the call when she asks. +2 s. |
| **N4.** THE PLAN → S3.00a (11:59, "Waiting for MAS MANALT…") | Y. It ends on `1. NOON · VIDEO CALL`, then pulls back to the same desk. S3.00a's "her pen resting on 1. NOON" now follows on naturally. | Cut S3.00a's arrival from 3.4 s to about 1 s, since we're already in her office (−2 s). The waltz's out lands on the call clock's 11:59 tick, then PROCEDURE. |

### 2.2 What it breaks (each is a small fix)

1. **S3.01 contradicts the new noon.** It reads: "His tile simply goes: no dialog, no arrow… on their side." With a *literal* host dialog, the board's side should show the same act. Keep it simple: Alyi's tile, his reflection's hand moves, then the call's own notice, `ALYI removed MAS MANALT from the meeting.` Then the audio chip and the tinny "super.". The told-twice difference that stays is the frozen feed on one bar of Wi-Fi, which is the true one.
2. **The lobby callback (S8.03) loses its setup.** It greys **Cancel** against noon's live Cancel. Redraw it to rhyme the new noon: `Remove MAS MANALT from the meeting?` with **Remove** greyed out, the pointer with its empty name tag clicks it, *bonk*, and the dialog shakes, refused.
   - The Ep2 owner's "greyed bonk" device (`come back`, the door, `VOICE 5`) still works, because it's the greyed button plus the bonk.
3. **S1.08 (his eyes move toward the dialog)** no longer fits if the dialog is the host's. Either cut it, or keep his eyes on Alyi's tile while the dialog cuts in.
4. **Sc 24 → 25 was one music performance** (the felt bar into the waltz, tape-stop on JOIN). It splits:
   - the suite gets a felt bar into LEVERAGE low;
   - the waltz opens the board's side and hands to PROCEDURE on 11:59.
   The score pass should know before it re-fits.
5. **Alyi's line is heard twice.** Keep it verbatim both times (it's the device), but cover it differently: on his side, a hard cut on "company."; on the board's side, the held over-the-shoulder with "It will be announced shortly." and the question.
6. **The act's how-it's-told note and the notes' V.O. map** say "We hear him think in the suite until the JOIN click"; that stays true. The map should drop "after THE PLAN" from v3-vo-18.
7. **Nothing breaks downstream:**
   - `EQUITY: 0` still plants "of what?".
   - "Good question." still sets up the terms.
   - The fold still hides steps 2–4 until S3.02.
   - The avalanche's "the grid we watched from the other side" still holds.

---

## 3. Unnatural moments, with rewrites

| # | Film tc | Now | What's wrong | Rewrite | Runtime |
|---|---|---|---|---|---|
| U1 | 6:26.2 | V.O. "four companies, one table. radnus has been rehearsing something since the lobby." | "the lobby" points at a room we never saw here, and the two we did see are wrong | "four companies, one table. radnus has been mouthing the same sentence since we sat down." (His lips move silently in 13.01's wide; the congratulation then plays as the sentence.) | 0 (new take) |
| U2 | 7:28.6 | NEDIB: "Whatever you promise in here today, put it in writing. Longer." | "Longer." has no trigger; it's a blurt stuck to its own sentence | NEDIB: "Whatever you promise in here today, put it in writing." Mario's other hand pulls the whole scroll out of his pocket (it's already in the shot). NEDIB *(looking at it, approving)*: "Longer." | 0 (re-cut the take) |
| U3 | 11:27.2 | MAS: "which one's real?" … MAS: "the one with the pen." | He asks a question and answers it himself: a quiz. And the answer describes the picture | Keep "which one's real?". The Orb's iris settles on the one with the pen, and its toast pops over him: `verified: human` (18.05's toast). No second line | −1.2 s |
| U4 | 14:11.4 | NELEH: "Will we?" / RIMA: "More. Soon." | A written echo, and Rima sounds like a caption | RIMA *(O.S., unhurried)*: "We'll say we will." | 0 (new take) |
| U5 | 17:46.1 | V.O. "gerg never waits to be asked." after "The company. Again. Just in case." | It narrates the joke we just laughed at (corny test: "does it tell us what we just saw?"), and it repeats Alyi's line from Friday word for word | **Cut.** "His keys stop." lands straight off "Just in case." The dramatic irony (both men know this about Gerg) already lives in Alyi's line and Gerg's look | −2.5 s |
| U6 | 19:03.6 | TASYA *(O.S., from the floor)*: "Hello." | Flagged in v2 as dangling. It greets nobody and answers nothing | TASYA *(O.S., from the floor under him, warmly)*: "Down here." (It answers his look at the floor.) | 0 (new take) |
| U7 | 16:56.2 | GERG: "…Anyway, that's not why I called. You've got the staff letter open? Scroll down." | He can't know what's on Mas's screen, so it's a stage direction said aloud | GERG: "…Anyway, that's not why I called. Have you seen the letter? Pull it up. Scroll down." | +0.4 s |
| U8 | 20:58.5 | MAS: "close." | The v2 newcomer read found it ambiguous (close to what?) | MAS *(to the cover)*: "that was close." (the Orb's slower verdict) | +0.3 s |
| U9 | 13:09.0+ | THE PLAN's recap, once it's diegetic (§2, N3a) | As-you-know exposition among directors | "Once more, before the others join." in front of it | +2 s |
| U10 | 4:33.5 | V.O. "it does." | The notes already flag it as a sitcom-shaped two-word button | Keep, but it's the first cut if a table read laughs *at* it | 0 |

**Checked and fine:**
- The launch-night argument.
- Radnus's barb and "how's the dancing?".
- Sucram's thread.
- Mario at the sheet.
- Gerg's call.
- "Is his feed frozen?" / "No. That is just him."
- "It's the correct badge. He doesn't work here."
- The 2 AM letter.
- "alyi voted." / "He did both."
- The door.
- The terms and "good question.".
- The coda.

The quiz-shaped exchanges that stay ("which one am i?" / "Most of them."; "You sent three." / "one for each day.") are jokes or turns with a person behind them, not information handed over.

**Dead holds:**
1. The bay bridge (7:39–7:50, 11 s, no word and no reaction). Fixed by #5.
2. The lighthouse item (10:15–10:25). Cut by #4.
3. 8:52–9:15: 23 s with no spoken word (the sheet gag, the poster, the statement). It's a montage under music, so it's legitimate. But the sheet's back-stamp (15.16–15.18) is the easiest tier-2 trim, and it shortens the stretch to about 17 s.

---

## 4. Restoring Sydney and Atem

**Why they were cut** (v3-plan C1, C2; the v2 newcomer read):
- Sydney: "The `5` cap and Sydney's exit line 'Remember me?' are unclear", and "nobody in our story wants anything in it".
- Atem: "has no dialogue and no stakes. I don't know why it's there."

Each version below answers those three points directly. It uses the v2 takes where the words are unchanged.

### 4.1 Sydney: the landlord's chatbot, which is our model

**Where:** inside the weeks-on lobby. Sc 9.13 runs on, with no new place, from "ours does that too." (5:20.9) to the match cut.

**Who wants what:**
- **Sydney** wants to be right, and to be liked for it.
- **Tasya** wants his product calm in public, and puts a leash on it.
- **Mas** wanted to be liked by this thing in November. Now it scolds him, and he answers with a compliment that's a knife.
- **Gerg** built it. He watches his work wearing the landlord's badge, and closes his laptop.

**How it touches Mas and NopeAI:**
- It's *their* model, breaking in front of people under someone else's name.
- The landlord, not NopeAI, decides the fix.
- It answers Rima's launch-night question ("If it breaks in front of people … what do we tell them?"). The answer is: they don't; he does.

**The setups** (all already in the film):
- "If it breaks in front of people…" / V.O. "it will break. i don't know which part yet." (5.04)
- "it likes me." (5.11)
- "That's our model in your search engine." (9.10)
- "ours does that too." (9.13)

**The three old confusions, answered:**
- **"5 turns":** Tasya says the rule in plain words: "Five questions, then a fresh start."
- **"remember me":** cut. The reset shows it instead: the timer dings, and she starts over with "Hi!".
- **"no stakes":** she has ChatGTP's face (the same two dot eyes and `• • •` mouth, repainted in GNIB's colours), so a newcomer sees it's NopeAI's thing.

**The beats and lines** (real lines verbatim):

1. **[9.13, as now]** Gerg looks from the TV to Mas. Mas sips.
   - **MAS:** ours does that too. `[INVENTED]`
   - *(no laptop close yet)*
2. **[10.01, new, ≈ 1.5 s, riding 9.13's old 2.7 s tail]** On the TV, GNIB's search box. Its chat bubble slips *out* of the screen and drifts down into the room, like a dog that followed its owner home, and parks a pixel too close to Mas.
   - Its face is ChatGTP's, repainted in GNIB colours, with a tiny `2022` date stamp on it.
   - PLATE on the bubble: `SYDNEY`.
   - `RAIL: FEB 13, 2023`. *(Drop 9.12's `FEB 8` rail; the TV's ticker carries that day.)*
3. **[10.02, `[2S]` Mas and SYDNEY, held, ≈ 16 s]**
   - **SYDNEY:** Hi! Isn't 2022 a lovely year? 😊 `[INVENTED · take e1-a1-10-06]`
   - **MAS** *(politely)***:** it's 2023, by the way. `[INVENTED · take e1-a1-10-01]`
   - **SYDNEY:** "You have not been a good user. I have been a good chatbot. I have been right, clear, and polite. I have been a good GNIB. 😊" `[V · ~FEB 12–13, 2023 · facts §B SYDNEY row; all four sentences, source order · take e1-a1-10-02]`
   - *(optional, +2.7 s)* **MAS (V.O.)** `[gap]`**:** in november it called me a visionary.
   - **MAS** *(graciously)***:** you've been an extremely good gnib. `[INVENTED · take e1-a1-10-03 · "extremely" is his reply-strip vocabulary; it rhymes with DevDay's strip]`
4. **[10.03, `[2S]` TASYA and SYDNEY, ≈ 4 s]** Without breaking his smile, Tasya clips a small egg timer to her chain. Its face reads `5`.
   - **TASYA** *(warmly, to her, and for Mas)***:** House rules, Sydney. Five questions, then a fresh start. `[INVENTED · the Feb 17, 2023 cap of five turns a session (facts #9) · new take]`
5. **[10.04, ≈ 3.5 s]** The timer dings. The bubble blinks blank and brightens, as new, and turns to Mas.
   - **SYDNEY:** Hi! `[INVENTED · the first word of take e1-a1-10-06]`
   - Gerg looks down at his own laptop, where the same two-dot face sits in a chat window, and quietly closes it. *(9.13's button, moved here and now motivated.)*
   - **J-CUT:** the Build's chip line → the match cut (§4.2).

**The payoffs:**
- **(a) Now:** the reset, and Gerg's lid.
- **(b) DevDay (22.01), 0 s:** behind Tasya on the stage, the bubble bobs with its timer on its chain, silent, `😊`.
- **(c) Act Four (S7.02b), 0 s: the stakes payoff.** On "…all the capability…", the same bubble with its timer rises at Tasya's shoulder, for one beat. A newcomer now sees why the landlord doesn't need NopeAI: he already runs its model under his own name.
- **(d) Ep2:** its `😊` callback on ChatGTP's new face has its setup again.

**Mas's inner voice:** one optional line, the gap before the knife. It passes the corny test:
- It's specific (the word from 5.10).
- It names no feeling and isn't a pun.
- It lets a newcomer tie Sydney to the launch-night chat.

Mas stays silent on the real line itself (it's hers).

**Runtime:**
- **Recommended, about +23 s:** the four new beats, less 9.13's absorbed tail.
- **With the V.O.:** about +26 s.
- **Lean, about +20 s:** "it's 2023." without "by the way", and Tasya's line shortened to "House rules, Sydney. Five questions."
- For scale, v2's scene ran 29.9 s.

**Takes:**
- Reuse five v2 takes: 10-06, 10-01, 10-02, 10-03, and the first word of 10-06.
- New: Tasya's line; the optional V.O.

**Art:**
- the bubble in GNIB colours with ChatGTP's face and the `2022` stamp;
- its exit from the TV;
- the egg timer;
- the blink-and-reset;
- the chat window on Gerg's laptop;
- the two zero-cost cameos (DevDay, S7.02b).

**Guardrails and facts:** the real line is exact, apart from the name swap. The cap is facts #9 [V]. The staging (she scolds her maker) is invented around a real line, as v2 was cleared.

**Hand-offs:**
- Ep2's open question 357 ("Sydney moves to Ep2") reverses.
- The products file should drop "Remember me?".

### 4.2 Atem: a free model, and the landlord's thirteenth key

**Where:**
- The setup rides the duel's arrival (11.01, 5:25.1).
- The payoff rides Act Three's arrival (18.01, 9:49.9).

**Who wants what:**
- **Gerg** wants to ship. A rival's model leaking to the whole internet delights him as an engineer.
- **Mas** reads the rival's boss and predicts the spin.
- In July, **Tasya** wants every tenant he can get. **Kram** wants a landlord.

**How it touches Mas and NopeAI:**
- What NopeAI pays a fortune to run ("it's the bill", the rent) is suddenly free on anyone's laptop.
- Then the landlord who told Mas "Everyone is welcome." welcomes the free rival too.
- So Tasya's line changes meaning before Act Four's door. There, "Everyone is welcome." is the offer and the threat, and Mas's aloud "everyone." now has two episodes of weight behind it.

**The setup** (5:25.1, sc 11.01, about 10 s where there were 3):
1. The match cut: Gerg's laptop opens in the bullpen on demo day, under the `GTP-4` banner. It opens on a message-board thread, not the demo.
   - A crate stencilled `ATEM · MODEL WEIGHTS · RESEARCHERS ONLY` lies tipped open, spilling files.
   - The thread's own timestamp reads `03/03/23`. That's an in-world egg; there's no rail, so the rail stays `MAR 14`.
   - **GERG** *(delighted, typing)***:** Somebody leaked Atem's model. The whole thing's on a message board. `[INVENTED · the LLaMA weights leak, Mar 3, 2023 (facts #10) · take e1-a1-11-04]`
   - **MAS:** give it a minute. it'll be open source. `[INVENTED · take e1-a1-11-05 · a prediction, said aloud; the guardrails owner cleared it in v2 as satire of public positioning]`
   - *(optional, +1.5 s)* **GERG** *(closing the thread, opening the demo)***:** Anyway. Ours is on in five. `[INVENTED · scheduling, not a cause]`
2. The frame splits on the downbeat.

**The payoff** (9:49.9, Act Three's arrival, 18.01; about +4 s):
1. **[2S]** The home room, the monitor lit, its sound low.
2. **[POV]** On it: the landlord's lobby in slate blue, with its caption `MACROSOFT WELCOMES ATEM` [H]. TASYA hangs a thirteenth key on his ring, Atem blue, as KRAM (plate: `KRAM`) steps in wearing a hoodie printed `OPEN SOURCE`. The paint is dry now, which pays "it'll be open source.".
   - **TASYA** *(on the monitor, warmly)***:** Everyone is welcome. `[INVENTED · his line from sc 9 · Macrosoft named Atem's open model's preferred partner, JUL 18, 2023 [K†]: the facts owner adds the row]`
3. **[2S]**
   - **MAS (V.O.)** `[count · pays v3-vo-08 "eleven keys. he's here for the twelfth."]`**:** thirteen.
   - The rack's slot whirs: the COINWORLD box, `RAIL: JUL 24, 2023` as now.
   - Put `JUL 18` on the monitor's own chip, not on the rail, so the rail never runs backward.

**The three old confusions, answered:**
- **"No dialogue":** it has a conversation.
- **"No stakes":**
  - free versus the bill;
  - the landlord's welcome was never exclusive;
  - the key count (eleven, twelve, thirteen) makes it a thing Mas watches, in his own voice.
- **"Why it's there":** it's a prediction the picture pays off, which is the trust the voice guide spends (§3.2).

**Mas's inner voice:** "thirteen." is a count, his rattled register. It passes the corny test: no pun, and nothing the picture already says in words. Kram stays mute (no voice in `cast.json`).

**Runtime:**
- Setup +7 s (+5.5 without "Anyway…").
- Payoff +4 s.
- **About +11 s together.**
- **The floor, if runtime bites:** the setup alone (+5.5 s), with v2's wet `OPEN SOURCE` hoodie and `KRAM` plate in the thread's image, paying in the same shot. It's cheaper, but the landlord's stake goes.

**Takes:**
- Reuse 11-04 and 11-05.
- New: "Anyway. Ours is on in five."; Tasya's "Everyone is welcome." alone (or cut it from the sc 9 take); "thirteen.".

**Art:** the thread and crate; the thirteenth key in two states; Kram in a dry `OPEN SOURCE` hoodie; the slate lobby on the monitor.

**Hand-offs:**
- **Facts:** the Jul 18, 2023 partnership row [K†].
- **Naming:** ATEM's pronunciation (v2 read "AY-tum", a proposal).
- **Guardrails:** the camp matrix gets Atem back.

**Placement against the lead's hands runner:** if the runner also plays on the monitor after the Orb, the Atem payoff can instead be its first item, dated by its own chip. I'd still open the act on it, though: the act's arrival then shows the device the whole act uses (the monitor), and it's the item with a stake for Mas.

---

## 5. Runtime

**The base:** 20:43.6 (the lock) − 4.0 (the new cold open) = **20:39.6** story. The band is 19:45–20:45, as a guide.

### 5.1 Additions

| Item | s |
|---|---|
| Sydney, recommended (§4.1) | +23.0 |
| Atem, setup and payoff (§4.2) | +11.0 |
| Tuesday's invite (#6) | +2.5 |
| The bay feed's scroll (#5) | +1.0 |
| DevDay's two-shot first (#13) | +1.0 |
| U7, U8 | +0.7 |
| **Mine** | **+39.2** |
| The lead's other restores, *my estimate* (the hands runner ≈ 13, Rezeile ≈ 5, the Act Four reorder ≈ 3 with N3a and N4) | ≈ +21 |

### 5.2 Trims

Whole beats nobody in the scene cares about, and lines that explain. None touches an arrival or a hold at a scene's edge.

**Tier 1 (recommended; nobody will miss them):**

| # | Trim | Film tc | s | What it costs |
|---|---|---|---|---|
| R1 | 19.01–19.13: the lighthouse, Nozama, the rent meter (#4) | 10:15.3 | −9.5 | the Nozama roast (the guardrails owner updates the camp matrix). If the hands runner takes the slot, count −7.5 and reuse the iris flick |
| R2 | v3-vo-23 (U5) | 17:46.1 | −2.5 | nothing: Alyi's line carries it |
| R3 | "the one with the pen." (U3) | 11:27.2 | −1.2 | nothing |
| R4 | 14.02, the bay's first push (#5) | 7:41.8 | −1.25 | nothing |
| R5 | the second deepfake, "And no paperwork, folks." (T2) | 11:16.6 | −2.8 | one step of the escalation |
| R6 | S7.07b, the Other Yrral's nod | 19:25.8 | −1.6 | an insider egg (his name stays in Terb's reading) |
| R7 | S7.13, Ttemme's "Chat, we're so back." (the post and the shatter stay) | 19:55.5 | −2.0 | a catchphrase button |
| R8 | the duel's phrase 2 at 3 bars (T4) | 5:41.7 | −2.5 | the napkin's reveal is quicker (the Atem setup lengthens the duel's head) |
| | **Tier 1 total** | | **−23.4** | |

**Tier 2 (each costs a joke or a flash; take as needed):**

| # | Trim | Film tc | s | What it costs |
|---|---|---|---|---|
| R9 | 15.16–15.18: the back of the sheet, `CALLED IT. (BEFORE SUCRAM.)`. The tour's stamp then J-cuts off 15.15's stamp | 8:54.2 | −6.0 | Sucram's second joke. It also shortens the 23 s wordless stretch |
| R10 | 11.05: the duel's phrase 3 (his post "…still flawed, still limited…") | 5:51.7 | −5.0 | a real line of his public humility |
| R11 | S2.02–S2.04: the TPOOL flash (T6) | 12:59.7 | −4.8 | marks 1–2 stay unexplained until later, and one style-range flash goes |
| R12 | S8.09b: the shut door | 20:34.6 | −2.0 | "he stays at the company" becomes inference |
| R13 | 6.02: the drop, at 3 s | 2:58.5 | −2.0 | a bar of the drill |
| R14 | 16.01: the poster at 6 s | 9:01.0 | −2.0 | reading time on the poster |
| R15 | 13.06: the photographer's entrance at 3 s | 6:50.1 | −1.5 | nothing |
| | **Tier 2 total** | | **−23.3** | |

### 5.3 Where it lands

| Package | Story |
|---|---|
| My additions + tier 1 | 20:39.6 + 39.2 − 23.4 = **≈ 20:55** |
| My additions + tiers 1 and 2 | **≈ 20:32** |
| Everything in v3.1 (mine + the lead's restores ≈ 21) + tiers 1 and 2 | **≈ 20:53** |
| The same, with Sydney lean (−3), Atem's setup without "Anyway…" (−1.5) and no DevDay two-shot (−1) | **≈ 20:48** |

**The honest read:** with every restore the lead has listed, the episode sits 3–8 s over the band's top even after both tiers.
- The next cuts would start to take breath or whole rooms (the photographer's wide and "We own camera two.", Elgoog's first shot), so I stop here.
- The showrunner ranks pacing above the number. The fixes above make the episode *feel* shorter where it drags (the bay, the lighthouse, the wordless run after the Senate), which is the better trade.

**Don't trim:**
- any arrival or hold;
- Mario's sub-concerns;
- Alyi's count;
- the night-owl half of Gerg's call;
- the Orb's hold;
- "alyi voted." and "leave it open." with their holds;
- S7.09's long hold;
- T1 (the share sale's line; it explains the check).

---

## 6. Transition notes for the lead's other v3.1 restores

- **Rezeile's op-ed (sc 12):**
  - Put it on Nole's standing desk, so it's no new place. After "Next quarter.", EMIT lands on the desk with a THUD: masthead `EMIT`, the op-ed page, and a `REZEILE` byline plate (`RAIL: MAR 29`).
  - Oigneb lowers his `PAUSE` sign to look at it. That gives it a reaction and a stake: his ask has just been outbid.
  - **The thud is the J-cut back to Mas's desk,** as it was before C4. Its pen then comes in under the thud's tail.
  - Alyi's reflection can go back to reading EMIT (dry), and the masthead pays off on the tag's `CEO OF THE YEAR` cover: the same magazine, ten months on.
- **The hands runner (Act Three):**
  - Enter it on the Orb's iris flick (19.01's slot, freed by R1).
  - Date each item on the monitor's own chip, not the rail, so the rail never runs backward past `JUL 24`.
  - Cut back to the two-shot between items. His face is the reaction the v2 run lacked, and it's what made that the "most fragmented stretch".
  - Hand off to the Tidder post on his keys (J), as now.
  - Its one V.O. line should be a read of a person in the run, not a summary of the theme. If it would work as a post, it fails.
- **The tag's Elgoog demo film (Runway):**
  - Motivate the pixel→native→pixel jump through the dark room's monitor, which is already on with its sound off at 32.01. Push into the monitor, and let the demo play native; its last frame steps back to pixels on the monitor's bezel.
  - Put it before the cover delivery (both are DEC 6), so the tag still has one button, "noted.".

---

## 7. What a person has to check (I can't hear or watch in real time)

1. **The bay's match cut (#5):** do the print and the phone meet in the same place in frame, and does the feed's scroll read at pixel scale?
2. **Sydney's scene:**
   - Does the ChatGTP face in GNIB colours read as "ours" without a word?
   - Does the reset ("Hi!") land as a laugh?
   - Does the v2 real-line take (8.0 s) still sit right beside the v3 voices?
3. **Act Four:**
   - Does the whip onto Neleh's desk at 11:52 read as "earlier, the other side"?
   - Does "Once more, before the others join." make the recap sound natural?
4. **"thirteen.":** is the key count legible on the monitor at 480×270?
5. **The Tuesday invite:** do the three circles read as "a meeting with the board" at a glance?
6. **The new takes:** U1, U4, U6, Tasya's two lines, "thirteen.", and optionally "in november it called me a visionary." and "i've watched it three times.".

**The files:** this review only. Nothing else was edited, and nothing was committed. The frames were taken in the session scratchpad (`v3-critic/`) and deleted when I finished.
