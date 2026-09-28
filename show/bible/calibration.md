# Calibration: the nuance ledger

> **Binding guidance, 2026-09-28.** Showrunner: "make sure no previous advice was taken too extreme." This ledger sets the middle of each swing and overrides any older single note or rule ([SHOWRUNNER-NOTES](../production/SHOWRUNNER-NOTES.md) 00); only the guardrails and direct story calls stay firm (§10).

## Reading a showrunner note

- **A note names a symptom in one place.** "the beginning of most recent act1 was slgithly corny" meant one cue. We re-scored everything (`0206191`), and hours later heard "not toning down to overly generic". Fix the named spot, and keep what was "overall… fine".
- **Find the cause.** "everything still feels distance" came mostly from a passive lead; we answered with 28 V.O. lines.
- **Check scope before a broad change:** state your reading, or ask. A "to be clear" means we overshot.
- **Opposing notes are both true.** "Cut down empty time" plus "let conversations play out" means: cut the dead air, keep the exchange.

## The ledger

### 1. Pacing and cutting
- **Asked:** "fluid and coherent" (9-26); "pretty quick on transitions… not fully pulled into a scene" (9-27).
- **Too jagged:** the Act Four animatic v3 (2.1 s shots, 33 music fragments, 78 silent holes). **Too static:** v3's "radio play with slides" (30 s of desk under off-screen Gerg).
- **v3.1:** 5.6 s shots, 19.2 s median stay, 3.2 s exit air. Air enough; the scenes are short.
- **Target:** add scene, not air. Edges 1–3 s; 4–6 s for an act's biggest turn or two; comic buttons cut hard. Every hold changes, and we know who's talking. *This:* Gerg's tile while he talks. *Not that:* a desk under a voice.
- **Check:** pacing.py; every hold over 4 s and what changes in it.

### 2. Conversation against empty time
- **Asked:** "cut down empty time, but not to cut every dialogue into only a few words per character" (9-26).
- **Too clipped:** Act Four v4 (median 4 words a line; longest exchange 10 s). **Too spread:** from v5 on, Act Four runs ≈ 8:38, 41% of the story.
- **v3.1:** talk plays; 3:37 of it without Mas.
- **Target:** talk that moves Mas's story runs as long as its turn (20–90 s); talk away from him earns time only by changing his situation. Cut recap and procedure, never an exchange's middle. *This:* 2 AM with Gerg, ending on his decision. *Not that:* the step-four volley restating S4.02.
- **Check:** "X wants Y from Z; W changes hands"; minutes away from Mas per act.

### 3. Clarity, labels and pointers
- **Asked:** "we don't need to explicitly write out parody and some other clear pointers"; "we can use reported and similar sparingly if not clear what referencing" (9-27).
- **Too pointed:** stick v2 (a disclaimer, `(REPORTED)` everywhere, four-part plates). **Too bare:** v3 cut every label, even `ALYI / CO-FOUNDER`, which v4.2's reads found worked; the newcomer lost the Elgoog founders and Ttemme.
- **v3.1:** plates partly back; four V.O. lines working as captions.
- **Target:** the world (prop, sign, UI) → a line said in conflict → a first-appearance plate (name, plus one relation word if it matters now) → a `(REPORTED)`-type label, 0–2 an episode, only where otherwise unreadable. Never disclaimers, asterisks, "(HE LATER SAID…)" or V.O. captions.
- **Check:** the newcomer's "who/what is this?" list; each fix names its carrier.

### 4. Reference density
- **Asked:** confusion came from "reference drops that aren't any character's problem" (measured); then "bring back the syney and atem references at least" (9-27).
- **Too loose:** v2 (the Atem crate, EMIT, India). **Too cut:** v3 dropped them.
- **v3.1:** four restored with stakes; most still arrive on a screen he watches.
- **Target:** attach, don't cut. Eggs with no hold are free; a reference that takes screen time needs a stake, ideally his move. *This:* the Atem leak he predicts and counts in keys. *Not that:* a crate nobody reacts to.
- **Check:** whose problem is it, and what does it change?

### 5. Mas's inner voice
- **Asked:** "everything still feels distance" (9-27); "a bunch of altman inner thoughts felt forced" (9-28).
- **Too few:** v2, 3 lines. **Too many:** v3 24, v3.1 28, including captions ("those are stills.") and explanations ("i'll turn when he finishes the sentence.").
- **Also asked (9-28, on v3.3):** "too much just predicting what someone is going to say next, rather than useful narration/insight into what he's thinking/planning"; "mas [should] look like he is mostly planning and directing things as he intends, with the exception he was not expecting the board"; then "we want mas to look like the mastermind who has higher foresight and planning than others usually" (SHOWRUNNER-NOTES 000).
- **Too reactive:** v3.3, whose lines were mostly reads and predictions of the next five seconds ("she'll go for three.", "gerg. he'll say he's compiling.").
- **Target (supersedes the 10–14 above, 2026-09-28):** about **14–18 lines** (fewer, better ones beat the full count), and most of them **his plan**: the higher-level goal behind the move on screen (ship first; compute through a landlord until he can build his own; be in the room where the rules get written; the platform; proof of personhood), hinting that each move sets up the next. After the blow the voice plans the comeback, and his return pays off the foresight. Keep the gap between thought and speech, the one wrong read (he plans right into the Friday call), the count under pressure and a few caught lines. **Predictions: at most one an episode.** A thought an action could show still becomes the action.
  - **Hinted, not declared** (9-28: "don't make anything too on the nose"): a small practical thought that reads as ordinary once and as foresight on a rewatch. No "plan" words, no thesis; at a payoff, a count, one dry word or nothing.
  - *This:* "mostly the bill. we can't buy that many servers. someone can." → he calls the landlord.
  - *Not that:* "she'll go for three." (the next five seconds), or "that part i planned." (the thesis, on the nose).
- **Still firm:** silence from the call's first tile to "super."; nothing at the Senate testimony; no motive about the firing's reasons; no line that has him rally, count on or organize the staff letter; the sealed memo stays out; no aphorisms, puns, winks, taglines or narrating the picture.
- **Check:** strip each line; if only information is lost, put it in the world; if it says what someone will do next, make it his goal or cut it.

### 6. Music mood
- **Asked:** "not everything needs to sound super suspenseful"; "goofy level hapy"; "keeping a unique sound, not toning down to overly generic" (9-27).
- **Too dark:** v2 (about four-fifths minor suspense). **Too goofy:** v3's launch-night jazz trio; swing or trio under half of Act One. **Too generic:** the restrained re-score after v3 (reverted).
- **v3.1:** first-round score restored; launch night in felt, chip pulse and the Build. On target.
- **Target:** every cue recognisably ours (the knee's cells, chip, a leitmotif, hybrid orchestra and 808, no third), the mood changing colour inside it. Suspense a minority; swing and trio accents. Fix the named cue, not the score.
- **Check:** mood shares from the cue sheets; "which motif?" per cue; the showrunner's yes before any wider re-score.

### 7. Style leaps
- **Asked:** "show off throughout… but not in a forced manner either, only where it makes sense" (9-26).
- **Too little:** v3, pixel and era switches only. **Too much:** the Ep1 slate on paper (~15 looks, 8 register changes in 23 min): a showreel.
- **v3.1:** two owned Runway inserts (Elgoog's demo, the hourglass). Modest, and fine.
- **Target:** one or two leaps and a few passes, each with an owner, a door and a story beat. *This:* the rival's product film in near-photoreal, exposed as stills. *Not that:* clay because clay is available.
- **Check:** the register strip; the animatic cut both ways.

### 8. Runtime
- **Asked:** "no padding"; runtime is "an outcome" (9-25); "getting a bit long" (9-27).
- **Too long:** stick v2 ran 22:51. **Wrong cuts:** v3 paid with references and approved scenes.
- **v3.1:** 21:51.7.
- **Target:** about 20–22 min. Cut off-spine beats, then recap, then time away from Mas that doesn't change his situation; never a spine scene's arrival or a conversation's middle.
- **Check:** each trim names the spine link it spares.

### 9. Agency
- **Asked:** "if he is the main character he should be showing agency" (9-28).
- **Too passive:** v2–v3, "carried from event to event" (newcomer): Act Three watches a monitor, others win Act Four, an 8-word cap kept him terse. **Too active (the risk):** a claimed secret act at a contested moment: orchestrating the staff letter, a backroom where he flips votes, a motive for the firing. *(2026-09-28, SHOWRUNNER-NOTES 000: "plans in V.O." is no longer a risk; it's the target. He's a mastermind by foresight and arrangement: his voice shows the plan behind his public moves, never a secret act the record doesn't hold.)*
- **v3.1:** late Act Four moves (calling Gerg, "keep building.", "gerg comes back too.") and the PLEASE sheet; Acts Two and Three still witness.
- **Target:** every act, one to three decisions with a visible alternative, from the public record or invented small stakes, each causing the next scene. Brief in reply; full sentences when he asks, decides or sets terms. His inner voice gives the plan behind the move; we never hear why at a contested moment (§10). **Other principals scheme too** in later episodes: see [overview §6a](overview.md#6a-everyone-schemes-later-episodes).
- **Check:** the chain test.

### 10. Rules against guidelines
- **Asked:** "no hard cutoffs for rules… the practical flow and user entertainment is always priority" (9-26).
- **Too rigid:** the Act Four v3 lock rules. **Mis-scoped:** bands as quotas (V.O. to 24 of 15–25, then 28); "never a motive at a contested moment" widened to "surface blank, no hover before a choice" at every real event (pov-and-framing §3.1, §3.7); "a rhyme is never a cause", about claims, read as no cause and effect in the story.
- **Target:** firm are the guardrails as scoped and direct story calls; the rest guides, and a number at a band's edge means look again. In Ep1, "contested" is the firing's reasons, who wrote the staff letter, testimony credibility and the memo, not his public acts.
- **Check:** for every "can't", quote the rule's scope.

## Diagnosis: "a random sequence of events"

**Causes:** (1) **The outline is the calendar:** each scene opens on a date rail and stages the next real event; R13's "but / therefore, never and then" reached the cuts, not the outline. (2) **Reference beats with no causal link:** the pause letter, the bay clip, the hands runner, the order and DevDay arrive on his screen and change nothing he does. (3) **A passive lead:** "to be noticed and liked" is a want to receive; others win Act Four. (4) Over-scoped guardrails (§10).

**The fix: a spine driven by his moves.** His move → its public consequence → the next problem → his next move; real events arrive as results or obstacles. Ep1:
1. He ships over Rima's doubt → a million users → the bill.
2. He steps onto the landlord's check → the landlord owns the floor.
3. The rival's alarm and the pause letter → he writes his own ask (PLEASE REG—).
4. He takes it to Washington, declines to run the agency, shows he owns nothing → the face of the rules → the top.
5. At the top he accepts the board's invite without looking → the call.
6. Fired, he moves (posts, calls Gerg, answers Tasya, leaves the door open, sets one term) → the return.

**A mastermind by foresight, not a declared schemer** *(updated 2026-09-28, SHOWRUNNER-NOTES 000; "no plan or reason in V.O." is superseded)*: his inner voice now gives the plan behind each public move and hints at the longer game, and his return pays it off. Still no backroom where he flips votes or writes the letter, no motive for the firing, no wink, no villain's speech. His moves stay small, public and polite.

**The chain test:** retell each act in 8–14 sentences starting "So Mas…" or "Because of that…". A link that only works as "and then" is a chronicle beat: attach it to a move or cut it. Without the date rails, cause should still force the order.

**Overrides until updated:** mas-inner-voice §3, §4, §7 (updated 2026-09-28 to the planner voice); guardrails §4 (labels rare, not retired); pov-and-framing §3.1, §3.7 (blank surface only at contested moments); style-range §6.1a (the slate is a menu).
