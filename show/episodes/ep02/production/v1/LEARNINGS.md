# Ep2 v1: LEARNINGS, the binding checklist from Ep1

> **Status: BINDING for every Ep2 v1 pass, 2026-10-08.**
> - **The ask:** the showrunner wants all of Episode 2 made in one go, with no notes in between: "i want you to attempt making the entirety of episode 2 in one go now using all the learnings up to now".
> - **How it was made:** distilled from the showrunner's own words on Ep1 (SHOWRUNNER-NOTES and the memory files), and from what the Ep1 rounds measured, cut, restored and fixed late.
> - **What changed:** nothing outside this file.

**How to use it:**
- **Read order.** Read [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) first, then this file, before any Ep2 work. A newer showrunner note always beats a rule here.
- **[FIRM] rules are never broken.** They are a guardrail or a direct story call from the showrunner.
- **[GUIDE] rules are craft numbers and habits.** Break one when it plays better, and write one line saying why (SN 16; CAL §10). A number at the edge of its band means "look again", not "fail".
- **Every rule has a test.** A pass's handoff note lists the rules it checked, how each was checked ([M] measured or [J] judged), and any rule it broke on purpose.
- **Apply rules in proportion.** A showrunner note named a symptom in one place. Fix that kind of thing where it occurs, and don't swing the whole episode (CAL, "Reading a showrunner note").

**Source keys.** Paths are from the repo root. Ep1 production files are in `show/episodes/ep01/production/full-v3/`.

| Key | Source |
|---|---|
| SN *n* | `show/production/SHOWRUNNER-NOTES.md`, by note number (00000B is the newest) |
| MEM-QB · MEM-VD · MEM-AB · MEM-ML · MEM-NM · MEM-TE | The memory files: `mr-mas-quality-bar`, `-visual-direction`, `-agree-before-acting`, `-ml-concepts`, `-naming`, `-tools-env` |
| CAL · MIV · GR · OV · PF · FC · MR · SP · MLC | `show/bible/`: `calibration`, `mas-inner-voice`, `guardrails`, `overview`, `pov-and-framing`, `flow-and-continuity`, `motives-and-the-race`, `setups-and-payoffs`, `ml-concepts` |
| SFO · FM | `show/timeline/season-flashbacks-overview.md` · `show/timeline/flashback-map.md` |
| VL · P35 · C35 · A33 · N32 · PL · S35 | Ep1 full-v3: `version-ledger`, `proposal-v35`, `check-v35`, `audit-v33`, `read-v32-newcomer`, `PLAN`, `script-v35-notes` |
| SH1 · VEL · REL | Ep1 full-v3 `shots-act1.md` · `voices-el.md` · `show/episodes/ep01/release.md` |
| ORG | `docs/ORGANIZATION-PLAN.md` |
| git *hash* | A commit on main |
| EP2-O · EP2-S | `show/episodes/ep02/outline.md` · `script.md` (staff draft 5.4, 2026-09-26). Both were written before the planner voice, the motives round and the late Ep1 fixes |

---

## WRITING

### The spine

**W1. Mas's rise, driven by his moves.** [FIRM]
- **Rule:** in every act, Mas makes one to three decisions, each with a visible alternative, and each one causes the next scene.
  - Each decision comes from the public record or from invented small stakes.
  - Real events arrive as results of his moves, or as obstacles to them. They are never a calendar to march through.
- **Test:** the chain test. Retell each act in 8–14 sentences that start "So Mas…" or "Because of that…". Any link that only works as "and then" gets attached to a move or cut.
- **Source:** SN 0 ("if he is the main character he should be showing agency"); SN 00 ("a random sequence of events"); CAL §9 and its Diagnosis.

**W2. A story, not a documentary.** [FIRM]
- **Rule:** present real events as dramatized story.
  - Never on screen: disclaimers, asterisks, "(HE LATER SAID…)", or rails that tell the viewer what to think.
  - A `(REPORTED)`-type label may appear 0–2 times an episode, and only where the reference would otherwise be unreadable.
  - FM §0 rule 5 ("truth labels are mandatory") is **superseded** by GR §4.
- **Test:** count the on-screen labels. Grep the script and the cards for hedges.
- **Source:** SN 3; SN 00000 ("this is a show, not a documentary"); GR §4; MEM-QB.

**W3. Hint; never announce the climax.** [FIRM]
- **Rule:** nothing before a turn states its outcome: no flash-forward, countdown or rail. Clocks are allowed; verdicts are not.
- **In Ep2:** Alyi's departure and the white room are not stated, shown or teased before they play. That covers the cold open, the intro's Ep2 changes, chapter titles and marketing (M1).
- **Test:** list every frame and line before each turn that names its outcome. The list must be empty.
- **Source:** MEM-QB ("No episode announces its own climax"); PF §1.7.

**W4. Human, and fast when he's caught out.** [GUIDE]
- **Rule:** when Mas is blindsided, his face stays still while his actions, the cutting and the rhythm go frantic (the Social Network grammar).
  - The others get small human beats.
  - He is quietly moved at most once an episode, and the voice never names it.
- **In Ep2:** the voice objection and the exit-paper story are where he's caught out.
- **Test:** for each blindside, list the actions he takes and the human beats the others get.
- **Source:** SN 00000 ("how can we show he is surprised and has to frantically figure out how to fix things"); MIV §3.

### Mas's inner voice

**W5. The V.O. is his plan, not a forecast.** [FIRM]
- **Rule:** most lines give the higher-level goal behind the move on screen, as a small practical thought: a number, a name or a condition.
  - The line should read as ordinary the first time and as foresight on a rewatch.
  - Ep2's goals on the record: distribution (the phone deal), compute, a seat where the rules and the board get decided, the platform, the product's voice.
  - At most one prediction an episode of what someone will say or do next.
- **Late Ep1 fix:** v3.3's V.O. guessed the next five seconds ("she'll go for three.", "gerg. he'll say he's compiling."), and v3.4 rewrote it as his plan.
- **Test:** tag every V.O. line as plan, gap, wrong read, caught, memory or prediction. At least half are plan; at most one is a prediction.
- **Source:** SN 000 ("too much just predicting what someone is going to say next"); MIV §3–§4; CAL §5; VL §1 (v3.4 row).

**W6. Enough voice to attach to him.** [GUIDE]
- **Rule:** about 14–18 lines, in every act.
  - Cluster them, 3–6 in a room he's reading, then let him go quiet.
  - The gap between what he says aloud and what he thinks is the engine.
- **Context:** Ep1's v2 had 3 lines and read as "distance"; v3.1 had 28 and read as "forced"; the final had 18.
- **Test:** the V.O. count per act. An act with none needs a written reason.
- **Source:** SN 1; SN 0; CAL §5; MIV §7; N32 §2a (Act Two with no V.O. played "like a highlight reel").

**W7. Never on the nose.** [FIRM]
- **Banned in the V.O.:**
  - "plan", "planned", "long game", "all along", "step one", "that part i…", or any thesis
  - aphorisms, puns, winks at real events, life lessons
  - narrating the picture
  - a line that would work as a post
- **Also:** no character explains a scene's subtext.
- **Test:**
  1. Grep the V.O. for the banned words.
  2. Run MIV §8's corny questions on every line.
  3. The strip test: if the scene plays the same without the line, cut it or make it the plan.
- **Source:** SN 000, "Nuance" ("don't make anything too on the nose"); MIV §4, §8. In v3.4, Alyi's "That is the company telling us." was cut as on the nose (VL §1).

**W8. Silence at contested moments.** [FIRM]
- **Rule:** no V.O. at testimony or government proceedings, in scenes told from someone else's side, over another person's real act that hurts him, or at any contested moment. No invented motive at a contested moment, in any line.
- **Ep2's contested set.** Write it down before scripting, and have the guardrails owner confirm it:
  - why Alyi left
  - whether the "her" voice was meant to sound like anyone
  - what Mas knew about the exit papers' equity clause
  - Neleh's account of the firing (her words only, with the board's reply beside it)
  - the merits of Nole's suit
  - the sealed memo, which stays out
- **Test:** list every V.O. and dialogue line at those beats. None states a motive or an intent.
- **Source:** SN 000, "Still firm"; MIV §5–§6; CAL §10; GR §6 (Mas: "invented private intent").

**W9. A mastermind by foresight, never by a secret act.** [FIRM]
- **Rule:** his plans ride on public moves: calls, posts, seats, deals, terms, a door kept open.
  - No backroom where he flips votes, steers a departure or organizes anyone's letter.
  - The scheming shows through specifics and payoffs, never declarations.
- **Test:** for each Mas move, cite the record, or mark it as invented small stakes. None is a claimed secret at a contested moment.
- **Source:** SN 000, "The mastermind"; CAL §9; MIV §4 rule 14.

### Motives, flashbacks and turns

**W10. Show why everyone does it, with Mas foremost.** [FIRM]
- **Rule:** every principal with screen time shows one want, through one act. Mas's want is felt in every act.
  - **In Ep2:** Alyi's want is the one deepened (W11); Nole's and Mario's get at least a glimpse.
  - **From Ep2 on, the other leaders scheme too.** Mario, Tasya, Nole and the other leaders know more than they say, and each public move sets up the next one.
  - They show it in their own lines and arrangements. The V.O. stays Mas's alone.
- **Test:** a table of principal → want → the act that shows it → scene.
- **Source:** SN 0000 ("for none of the people including mas it is never shown why"); SN 000, "Season"; MR §1, §5; OV §6a.

**W11. One full motive flashback, plus micros.** [GUIDE]
- **Rule:** each episode gets one motive flashback of 45–90 s, shaped as want → obstacle → turn, for its featured player. Micros add texture.
  - **Ep2's is Alyi's 2022 bonfire** (F2.2). EP2-O runs it at 20 s, so it needs to grow.
  - The episode's flashbacks total about 60–150 s, and W22's concept counts toward that total.
  - FM §2a's 45–90 s length beats FM §0's older 60 s cap per flashback.
- **Test:** the flashback seconds, summed; the motive flashback's length and its three-part shape.
- **Source:** SN 0000; FM §0, §2a; P35, "The season, briefly"; MLC, Rules.

**W12. Every inserted scene feels natural.** [FIRM]
- **Rule:** every flashback, insert and change of place:
  - is caused by the beat before it;
  - is led in by sound;
  - carries a matched object in and out;
  - is followed by a reaction in the present.
- **Test:** the seam table, in S35 §5's format: cause · sound lead · matched object · reaction, for every seam.
- **Source:** MEM-QB, "Motives and flashbacks" ("make sure feels natural transition, not forced in"); SN 00000 (the tour "comes out of nowhere"); C35 §2.

**W13. The cause of a turn comes before the turn.** [FIRM]
- **Rule:** a reversal (someone changes sides, a group demands something, a rival answers) needs its visible cause in the beats just before it, not after.
- **Late Ep1 fixes:**
  - **The board's "bring him back":** it had no shown cause until the Saturday phones asked for his return.
  - **The pause letter:** it needed the flash of every chatbot's usage climbing just before it.
  - **Alyi's reversal:** it needed the company emptying, and then his own words.
- **Test:** for each turn, name the frame that causes it and its time. The cause comes first.
- **Source:** SN 00000A ("the transition to we've been planning to bring him back still makes no sense"; "right before the open letter, there should be another quick flash…"); SN 00000 ("it's also ont clear why alyi changed his mind"); git 71eca50, 633ad95.

**W14. Plant the "before" of every reversal.** [FIRM]
- **Rule:** if a later beat hurts because of a relationship, the relationship is on screen earlier.
- **Ep1:** Alyi was warm with Mas at the Sep 25 party, so his vote lands harder. The staff's affection is on screen before the letter.
- **In Ep2:** Alyi's absence must land as a loss. Call back to what Ep1 showed (the 2018 night, the party, "Six years and eleven months."); don't assume the audience remembers it.
- **Test:** for each reversal, name the earlier scene that shows the bond it breaks.
- **Source:** SN 00000A ("we should have alyi at the party as well to increase the surprise").

**W15. Setups and payoffs are complete.** [FIRM]
- **Rule:** a payoff keeps its setup line, and a numbered sequence says every one of its numbers.
- **Late Ep1 fixes:**
  - "Then we'll write step four ourselves." shipped without "There is no step four.".
  - "Step two" was never said until the last fix.
- **Test:**
  - Keep a setups-and-payoffs table in SP's format (EXPLAINED / PAID IN EP / HINTED / PLANTED / GAP).
  - Enumerate every count and sequence, with each item's line or picture.
  - Before any cut, check what the cut line set up.
- **Source:** SN 00000A ("waht happened to the playoff of step 4?"); SN 00000B ("we never say step 2 either", "we should've added there is no step 4"); SP.

**W16. Pay Ep1's open threads on schedule.** [FIRM]
- **Rule:** Ep2 answers the why that Ep1 withheld, with Neleh's podcast.
  - Her attributed words only, and the new board's reply beside them.
  - The Mar 8 review's two halves stay together.
  - The memo stays out.
- **Also:** carry Ep1's live threads: the IOU, the tally sign, the collars (three, with no new pop), the Orb's verdicts, and "being asked".
- **Test:** an understanding-threads table in P35's format. Each Ep1 thread shows where Ep2 closes it or carries it on.
- **Source:** P35, "The season, briefly"; SP §1, §5; EP2-O (Neleh's podcast restored).

### Scenes and dialogue

**W17. Scenes to be felt.** [GUIDE]
- **Rule:** build each scene as want, obstacle, turn and cost, across several beats, with texture and distinct voices. Information is a by-product.
  - Talk that moves Mas's story plays for 20–90 s, in complete thoughts.
  - "Tighten" means cutting dead time, never the talk.
- **Test:** for each talk scene, write "X wants Y from Z; W changes hands". Measure words per line (Act Four v4 failed at a median of 4) and the longest exchange.
- **Source:** SN 8; SN 11; CAL §2; FC §4.

**W18. Fast exchanges, unhurried Mas.** [GUIDE]
- **Rule:** set the pace per exchange. Overlaps are seasoning: one or two a scene at most, and motivated.

  | Pace | Gap before a reply |
  |---|---|
  | Quick | others 0.15–0.35 s; Mas 0.4–0.5 s |
  | Normal | 0.4–0.6 s |
  | Weighted | longer, only on turns |

- **Speaking rates:** most characters about 165–185 wpm; Mas about 140; his V.O. 110–130.
- **Test:** a tempo table per exchange, in S35 §6's format.
- **Source:** SN 00000 ("dialogue back and forth could also be faster paced"); P35, "Pace"; MEM-QB, "Pacing"; MIV §9.

**W19. No blurts.** [FIRM]
- **Rule:** every line has a reason to be said now, to this person.
- **Test:** before a line lands, the audience knows who is speaking to whom. The newcomer read's "who says it?" list is empty.
- **Source:** SN 11; FC §4; N32 §2c, §3 ("Everyone's packed": "I can't find who's speaking").

**W20. Real quotes as documents, not recitation.** [GUIDE]
- **Rule:** a real quote spoken face to face sounds transcribed. Deliver it in its own medium: a post as a pop-up in its own UI, a clip, a podcast on a TV, a letter.
  - Mas's own real words stay verbatim, and lowercase.
  - Never re-voice a real quote as a thought.
- **Test:** list every [P] and [V] line with its medium.
- **Source:** N32 §5; PL §6 S5 (Tasya's line became a TV clip); MIV §6; Ep2 open-questions #2.

### Clarity

**W21. Clear to a newcomer, never a lecture.** [FIRM]
- **Rule:**
  - Set up every load-bearing fact inside the show before it matters: a prop, a line said in conflict, or a plate. Tell it once.
  - Introduce people by what they are to Mas. A first-appearance plate is the name plus one relation word, two parts at most.
  - References are texture. A reference that takes screen time needs a stake, ideally Mas's move. An egg with no hold costs nothing.
  - A metaphor a newcomer can't decode is replaced by an image the film already owns. Ep1's glass and waterline, and the Cancel click, both failed two reads.
- **Test:**
  - The newcomer read lists what it couldn't place ("who or what is this?").
  - The insider read lists drag and over-telling.
  - Each fix names what carries it.
- **Source:** SN 12; SN 13; FC §5a; CAL §3–§4; A33 P14; MEM-QB, "Review the viewer's experience"; N32 §4.

**W22. One ML concept, inside a scene.** [FIRM]
- **Ep2's concept:** "learned, not programmed". A network is millions of knobs nudged by examples, so nobody wrote the winning move.
- **Where and how:** at the Email Séance, through AlphaGo's Move 37, in about 20–30 s.
  - Someone has a reason to explain it: Nole's fear.
  - A visual in the show's pixel language carries it.
  - It's technically right, and it gets a short accuracy review.
  - Mas's V.O. may say what it means for the race, never the mechanics.
- **Test:** the length; who explains it and why; the accuracy note.
- **Source:** SN 00000B; MEM-ML; MLC.

**W23. At most two explainers, far apart.** [GUIDE]
- **Rule:** Ep2 has two explainers: THE PLAN (`OMNI`, about 45 s, accurate, the plan failing is the joke) and W22's concept.
  - Put them in different acts.
  - Each rides on a scene's want.
  - If they crowd each other, shorten THE PLAN before the concept.
- **Test:** each explainer's seconds and act, and the time between them.
- **Source:** OV §7; MLC; SN 12 (clarity "with not dragging on unnecessary/inferrable info").

### Tone, fairness and facts

**W24. A fluid thriller that happens to be funny.** [GUIDE]
- **Rule:**
  - Nothing corny: no meme sounds, no gratuitous glitch, no winks that break the rhythm.
  - Every principal gets one moment that isn't a joke.
  - The world threads, the adjacent figures and lore, and the elevation ideas are menus, not quotas. DOT stays light, and THE CHINA CARD is capped at about 3 uses a season.
- **Test:** each principal's non-joke moment; a feeling curve, in P35's format, that varies.
- **Source:** MEM-QB; SN 2; SN 18; SN 19; VL §5.

**W25. Fairness.** [FIRM]
- **Rule:**
  - Roast at least three camps, Misanthropic included.
  - Include a political balance pair in the same episode. In Ep2 that's RUMPT's FEAR phase and the Orb's fact-check against the bipartisan roadmap.
  - Invented lines stay on AI, money, naming and credit.
  - Nothing from GR §1.
- **Test:** GR §8's pre-lock checklist, plus a political-balance section in the proposal, in P35's format.
- **Source:** GR §2, §8; P35, "Political balance".

**W26. Names and facts.** [FIRM]
- **Rule:**
  - Parody names only, from `show/bible/naming.md`. Add a new name there first. It's RUMPT, never PMURT.
  - Every factual line carries a tag.
  - No [K], [SINGLE] or [UNVERIFIED] item on a dated card.
  - Every "confirm before lock" item is verified before the lock.
- **Test:** grep the names against the registry; check that facts.md has a row for every factual line.
- **Source:** MEM-NM; GR §3, §5, §8; S35 §7.

**W27. Exclusions.** [FIRM]
- **Rule:** no family or private life, health, sexuality, or anything else in GR §1. In Ep2:
  - the actress in the "her" story is never drawn, voiced or named;
  - THE SLEEVE has no frailty cues and no reference to his death;
  - Alyi's bonfire is a company event.
- **Test:** check the script against GR §6's per-character list.
- **Source:** GR §1, §6; EP2-O, "Guardrails live in this episode".

---

## PICTURE

**P1. Pixel first, 1080p at most.** [FIRM]
- **Rule:** pixel art is the primary style, and 1080p is the maximum render. Previews at 0.5 scale are fine.
- **Source:** MEM-VD; MEM-QB, "Render policy".

**P2. Close enough to attach.** [GUIDE]
- **Rule:**
  - The frameless MCU is the default close shot.
  - Show the pair in a two-shot first, and cover the listener.
  - Mas stays in the left third.
  - Faces and hands fill about 55% or more of story time. Wides only establish.
  - Boxed talking heads appear only where the box exists in the story world.
- **Test:** the shot-log shares, against PF §4.7.4.
- **Source:** SN 20; MEM-VD, "Point of view and intimacy"; PF §4.3, §4.7.

**P3. Arrive and leave.** [GUIDE]
- **Rule:**
  - Open a new place on the room with its people in it, 2–4 s before the first line, and longer at a jump in time.
  - Stay while the scene plays, and let the turn land: hold 1.5–3 s, or 4–6 s for the biggest turns.
  - Leave on sound.
- **Test:** each scene's entry air and exit air. No talk scene cuts away within 1.5 s of its last word, unless it's a comic hard cut.
- **Source:** SN 2 ("feels like your not fully pulled into a scene"); FC §2a; CAL §1; MEM-QB ("scenes need arrival + aftermath").

**P4. Cut on story, not on a quota.** [GUIDE]
- **Rule:**
  - Think in sequences: one place, one time, one question, one turn.
  - No strobing runs of short shots outside a montage.
  - No held frame runs about 8 s with nothing changing in it.
- **Test:** the shot-length distribution, and every hold over 4 s with what changes inside it.
- **Source:** SN 17; FC §0–§2; CAL §1; PL §6 P12.

**P5. Eye-check every new shot at full size.** [FIRM]
- **Rule:** before and after render, look at every new or changed shot at native 1080p, at several moments in it. Check:
  - **Anatomy:** arms come from shoulders, with elbows and gripping hands, not flat bars.
  - **Feeling:** a face that should read warm reads warm. In Ep1, Alyi read cold at the party until it was redrawn.
  - **The frame:** crops, overlaps, and text that has time to be read.
- **Test:** the pass's "Looked at" list, with frame numbers and the fixes made after looking.
- **Source:** git 9e9d63f (the party: "real arms from each body…, Alyi turns to Mas and smiles on the toast"); SH1 §15 ("Fixes after looking"); C35 ("Nobody watched or listened").

**P6. No stray cursor.** [FIRM]
- **Rule:** no free mouse cursor is drawn in a room.
  - A pointer appears only on a screen inside the world, and it belongs to someone the scene shows.
  - It lands on its target a beat before the click, and lights it.
  - When Mas chooses, the choice is his phone's suggestion strip, never a cursor.
- **Ep2 risks:**
  - sc 14's point-and-click scene and its dialogue tree;
  - the planchette, drawn as a cursor in a brass rim, which must read as a planchette.
- **Test:** grep the shot specs for cursors and pointers, then check the frames.
- **Source:** git 9e7b4b1 (the launch's mouse cursor removed: "his finger on the bare button"); PF §1.6; FC's v4.2 notes ("A pointer's path is a sentence").

**P7. What a line points at is visible.** [FIRM]
- **Rule:** a prop that a line names, or a gag that needs a prop to arrive, reads at 1080p in the shot itself (not only in a crop), and it arrives at its moment.
- **Ep1:** "Is that a tear?" pointed at nothing visible; the collar read as hoodie trim.
- **Test:** for each line that refers to a visual, the frame and the visual's size.
- **Source:** N32 §3 (3:11, 4:28); PL §6 P3–P4; A33 (P3: "invisible at thumbnail size").

**P8. A person stays a person.** [FIRM]
- **Rule:** draw each character consistently. A motif rendering is set up so a newcomer reads the person, not an AI. Ep1's "ghost" Alyi in the glass made a reader ask whether he was an AI.
- **Ep2 risk:** Alyi is "seen only in doorways and reflections".
- **Test:** the newcomer read raises no "is X a person?".
- **Source:** N32 §2c #10 and §3.

**P9. The speaker is visible.** [FIRM]
- **Rule:** the speaker is in frame, mouth lit and lip-synced, or the voice is already established. A static wide never carries unidentified speakers.
- **Test:** the newcomer read's speaker confusions.
- **Source:** N32 §3 (14:37, 18:36); PL §6 P12, P17.

**P10. Light the faces that aren't jokes.** [GUIDE]
- **Rule:** on close-ups that aren't jokes, put a key or rim light one or two steps up, on the face only. Leave the room alone.
- **Source:** PL §6 P18.

**P11. Two tiers of style range.** [GUIDE]
- **Rule:**
  - **Tier 1 passes** are motivated: a device in the world, an emotional state, or how an event will be remembered.
  - **Tier 2 leaps** are rarer set pieces that show off range, each with an owner, a door into it and a story beat. Ep1 shipped three: the tear macro, CLOD in clay, and the hourglass.
  - Show range only where it makes sense. Never use clay just because clay is available.
- **Test:** a register strip listing each pass and leap with its owner, door and beat.
- **Source:** MEM-VD, "Style range, two tiers"; SN 9; SN 14; SN 15; CAL §7.

**P12. Leaps keep their contrast.** [FIRM]
- **Rule:** don't blend a leap into the pixel look: no matching grade, no pixel rim, no down-rezzing. Fix only character or acting issues.
- **Source:** MEM-VD, 2026-09-28 ("the contrast is part of the charm").

**P13. Programmatic filler first.** [FIRM]
- **Rule:** every hard-medium leap gets a programmatic filler that holds the final's timing, framing and meaning, so the generated version drops in as a layer swap.
  - Generators make Tier 2 leaps in their native look.
  - Pixel conversion is only for elements that sit inside a pixel shot.
- **Source:** MEM-VD ("Filler now, final later"; "Generators serve the leaps"); SN 9.

**P14. No real likeness, no generated people.** [FIRM]
- **Rule:**
  - No photoreal likeness of any real person.
  - Near-photoreal is only for objects, environments, machines and fictional characters.
  - No person, face or hand from a video model.
- **In Ep2:** nothing human near the AROS mammoth is near-photoreal.
- **Source:** GR §5, "Likeness"; MEM-VD; REL ("The near-photoreal inserts show objects only.").

**P15. Photosensitivity and read time.** [FIRM]
- **Rule:**
  - At most 3 flashes in any 24-frame window; every pop at 80% white or less.
  - Must-read text holds at least 0.25 s + 0.05 s per character; name cards at least 1.2 s.
- **Test:** a flash check on every render, run streamed (see R10).
- **Source:** GR §7; PL §5 (the intro's flash fix).

**P16. The frame around the acts.** [FIRM]
- **Rule:**
  1. **The cold open** hands off into the intro, and doesn't repeat the intro's imagery.
  2. **The 30 s intro** carries Ep2's changes, which reflect only events that have aired. In the ElevenLabs film, Mas's intro line is Jeremy's.
  3. **The card** is the filename alone, 2 s: `ep1.1_her.wav`.
  4. **The acts and the tag.**
  5. **The Orb outro (B):** "art · script · music · voices · edit: opus 5.5 / prompt: jgon". No disclaimer, terms line or pointer.
- **Source:** SN 2 ("the cold open to intro is not very good transition"); SN 3; SN 4; SN 000 ("in the intro mas's voice is not replaced"); MEM-QB, "The intro"; OV §8; VL §5.

**P17. No scaffolding in the picture.** [FIRM]
- **Rule:** the stick reel's scaffolding never reaches the picture: speaker strips, names over figures, bracketed stand-ins, "Push button" prompts.
- **Source:** SN 3; N32 §8 ("a production bug"); VL §1 (v3.1 row).

**P18. The V.O. finishes typing with the voice.** [GUIDE]
- **Rule:** the V.O. line finishes typing when the voice does. Ep1's host clipped the long planner lines.
  - It never shares the screen with a rail or a toast.
- **Source:** SH1 ("The V.O. typing"); MIV §9.

---

## SOUND

**S1. The show's own sound.** [FIRM]
- **Rule:** keep the sound's identity: the knee, the chip motifs as the show's stamp, the leitmotifs, the 808 and hybrid orchestra, the jazz colour (quartal harmony, light swing), and the colours with no third, on the 96 BPM grid. Match each scene's mood inside that sound.
- **Two failure modes:**
  - lounge or cartoon cheer, like Ep1 launch night's jazz trio;
  - toning everything down to generic piano and pads.
- **Fix the named cue.** Never re-score broadly on one remark.
- **Test:** for every cue, name its motif and its mood.
- **Source:** SN 2 (on the score: "i liked the initial ost… not toning down to overly generic"); CAL §6; MEM-VD, "Audio direction"; MEM-QB, "Score".

**S2. Mood variety.** [GUIDE]
- **Rule:** suspense is a minority. Use warm, giddy, comic, loyal and triumphant colours, so the suspense keeps its pull.
- **Test:** mood shares from the cue sheets. Ep1's v2 was about four-fifths minor-key suspense.
- **Source:** SN 2 ("not everything needs to sound super suspenseful"); CAL §6.

**S3. A continuous bed.** [FIRM]
- **Rule:**
  - Room tone is always on, one bed per location, crossfaded at changes.
  - Music is continuous per sequence. It ducks (−8 to −12 dB) and thins under real lines and posts, rather than stopping.
  - Deliberate stops are rare and marked, each with a clear re-entry.
  - No music fragment under about 2 s, unless it's a designed sting.
  - True silence only as a designed story beat.
- **Test:** count holes (under −42 dBFS for 0.3 s or more) and music fragments. Every level step over 15 dB has a named cause.
- **Source:** SN 17 ("the ost should not be playing for just half a second at a time"); FC §0, §3; A33 §2.

**S4. Sound leads.** [GUIDE]
- **Rule:** most scene changes lead with sound: a J-cut of 0.5–1.5 s on the new room or its first line. L-cuts let a turn land.
- **Test:** the seam table's sound-lead column, measured.
- **Source:** SN 2; FC §2a; C35 §2.

**S5. Re-anchor every layer after a timing change.** [FIRM]
- **Rule:** after any insert or move, check every SFX and score layer's start and end against the new lock, and scan the cuts for undesigned clicks.
- **Ep1:** an SFX layer keyed to an old beat id (Sydney's egg timer) ticked on for 43 s past its scene after two scenes were inserted before it.
- **Source:** C35, "Must fix" #1.

**S6. Library voices, never an imitation.** [FIRM]
- **Rule:** library voices only. Never clone or imitate a real voice, never prompt for "sounds like", and no laugh mimicry. In Ep2:
  - CHATGTP's "her" voice imitates no one;
  - RUMPT's voice-only phase is a cartoon register, not an impersonation.
- **Source:** GR §5, §6; SN 00000, "Voices"; MEM-QB ("Never clone real people's voices").

**S7. The cast carries over.** [FIRM]
- **Rule:** deliver one film with the ElevenLabs cast: Mas is Jeremy, Sirrah is Ida Freeist, AUHSOJ is Rick.
  - MARIO keeps his Kokoro voice, matched into the ElevenLabs room's level, room, chain and EQ.
  - Each new principal: audition 3–4 library voices, then pick by measurement and a written reason.
- **Test:** the cast table. MARIO sits within about 1 dB of his neighbours.
- **Source:** SN 00000, "Voices"; P35 choice 11A; PL §8; VEL §AA, §AB; C35 §3.4.

**S8. QA on the encoded file.** [GUIDE]
- **Rule:** match Ep1's numbers: about −16 LUFS integrated, true peak under −1 dBTP, 0 decode errors, 0 A/V lag.
  - Measure on the decoded, encoded film. Ep1's AAC bursts showed up only that way, and were fixed with libfdk_aac.
- **Source:** C35 §3.1; git fcab2a4; FC's v4 report notes.

**S9. Score rendered to the picture.** [GUIDE]
- **Rule:** lay the cues to the lock's frames; don't cut them from masters.
  - Mark designed hits on the cue sheet.
  - Hushed moments get soft entries: Ep1's 3 AM bloom jumped from −36 to −14 LUFS in 0.1 s.
- **Source:** FC's v4 sound notes; A33 (X3, X5); C35, optional #2.

**S10. Plan audio with the picture.** [FIRM]
- **Rule:** score, SFX and voice are in the proposal and the stick reel from the start. Animatics carry a temp score and effects.
- **Source:** MEM-QB ("Plan audio alongside visuals"); PL §1.

**S11. Story sounds are audible.** [GUIDE]
- **Rule:** small sounds that carry a beat (keys, a click, a paper turning) read in their band against the mix.
- **Source:** C35, optional #1, #3, #5.

---

## PROCESS

**R1. Ep1 is locked.** [FIRM]
- **Rule:** never modify Ep1's locked paths. Read them freely, and copy Ep1 tools into Ep2 locations rather than editing them.
- **Where Ep2 lives** (ORG §2, "Starting a new episode"):

  | What | Where |
  |---|---|
  | Production docs | `show/episodes/ep02/production/v1/` (with a PLAN.md and a README.md) |
  | Pixel code | `studio/src/episodes/ep02/pixel/` |
  | Renders and the film | `out/ep02/v1/` |
  | Takes | `audio/ep02/` |
  | Score | `audio/ost/tracks/e02-v1-<seg>/` |
  | Per-act rebuild script | a per-episode copy of `ops/rebuild-act.sh` |

- **Source:** SN 00000B ("we shouldn't make any changes to episode 1"); ORG §2.

**R2. The full flow is written before any build.** [FIRM]
- **Rule:** write the whole episode, scene by scene, in proposal-v35's format before anything is built.
  - **Each scene:** date, place, status and length; Mode; What happens and why; Feeling; Understanding (FULL / PARTIAL / WITHHELD, with where each is filled); Lines, with tags; Out (cause, sound, object); Pace.
  - **Then:** the feeling curve, the understanding threads, Mas's V.O. in order, the pace table, a keep-list check, the political balance, voices, choices with a recommendation, and runtime per act.
- **In this one-go run,** that document stands in for the showrunner's agreement. Build exactly it; any change goes back into it with a reason.
- **Source:** MEM-AB ("we need to agree on the flow of the full episode, what each scene and transition is, before the final pass"); PL §8; P35.

**R3. Decide the way the notes point.** [FIRM]
- **Where the showrunner would decide:**
  1. The newest note wins.
  2. CAL's middle ground beats any single older note.
  3. Keep what he said he liked.
  4. "Why is X there?" is a question, not a cut order: explain X, and keep it. The Ep1 deepfake he liked was cut on a question.
  5. "To be clear" means we overshot.
- **Record:** log each such call as a choice row with its source.
- **Source:** SN header; CAL, "Reading a showrunner note"; MEM-AB; VL §0 #1.

**R4. Add, don't trade.** [FIRM]
- **Rule:** a new scene never pays for its time by cutting another approved scene, or by trimming the setup act.
  - Length goes into the setup, and comes out after the turn.
  - About 22–23 min is fine. Runtime is an outcome, not a target.
- **Source:** SN 00000A ("i did not want to cut a scene, only add one"); SN 00000, "Length" ("why are you trimming elsewhere in the act?"); MEM-QB, "Where length goes"; CAL §8.

**R5. Fix the symptom, then check the scope; keep a ledger.** [FIRM]
- **Rule:** keep a version ledger in VL's format:
  - every add and cut, per version, each with a WHY tag (SHOWRUNNER / REVIEW / LEAD);
  - a swings table;
  - a keep list.
- **Nothing on the keep list is cut** without a recorded reason.
- **Source:** SN 00; CAL; VL.

**R6. Cheap first.** [FIRM]
- **Rule:** nail the script, the dialogue and the flow in a stick reel (real takes and a temp bed), with its reads, before any pixel animatic or final picture.
- **Source:** SN 10 ("we should've been iterating on cheaper stick figure runs"); MEM-QB, "Iterate cheap first".

**R7. Coherence is checked, never assumed.** [FIRM]
- **Before a cut is called done, run:**
  - a newcomer cold read in N32's format: the reader reads no script, retells the story, and separates what the show told from what they knew. AI readers flag every gap they fill from memory;
  - an insider read;
  - an editor's transition table;
  - a cross-channel mood analysis;
  - a sound audit;
  - P5's full-size eye pass.
- **Use a fresh reader each round,** and fix what they find.
- **Source:** MEM-QB, "Review the viewer's experience"; FC §5, §5a; N32; C35; FC's v4.2 notes ("A fresh read finds new gaps").

**R8. Honest claims.** [FIRM]
- **Rule:** nobody here watches in real time.
  - Tag every claim [M] measured or [J] judged.
  - Never call a cut "locked", "complete" or "working" on metrics alone.
  - List what a human must check.
- **Source:** PL §3; FC §5; C35 header.

**R9. One lock path.** [FIRM]
- **Rule:** build the delivered, ElevenLabs-timed lock as the master.
  - Keep every line, hand-placed V.O. included, in the spec the builder reads, so a rebuild can't drop it.
  - Mind the trap: `--fixed` swallows the segment names that follow it.
  - Make timing changes with a per-act rebuild.
- **Source:** VEL §AD, §AE; MEM-TE (`rebuild-act.sh`; `el_lock.py` drops hand-placed V.O.); P35 choice 11A.

**R10. Don't cook the laptop.** [FIRM]
- **Rule:**
  - Run every data-heavy command through `ops/heavy.sh`: renders, audio, frames, QA, typechecks.
  - Run one heavy job of your own at a time, and only one agent at a time during render and mix phases.
  - Caps: Remotion `--concurrency=4`, fastrec `--workers 2`, `OST_WORKERS=2`.
  - Process audio and frames in chunks. Ep1's flash check held about 10 GB and was killed.
  - Watch `/proc/pressure/memory`, not just free memory.
  - Run long jobs in the background and poll their logs.
  - Never kill another project's processes.
- **Source:** MEM-TE; the SN handoffs ("DON'T COOK THE LAPTOP"); SH1 (the streamed flash check).

**R11. Keys never leave `.env`.** [FIRM]
- **Rule:** never print, log or commit the values in `.env` or `.secrets/`.
  - Run `python3 ops/keyscan.py` (staged) before every commit, and `python3 ops/keyscan.py origin/main..HEAD` before every push. Both must report 0 hits.
  - Stage only your own files, and end each commit message with the attribution line.
- **Source:** the run's rules; PL §3; MEM-QB, "Commit cadence".

**R12. Commit and push after each step.** [GUIDE]
- **Rule:** commit after each step, and push (pushing is authorized). Rendered WAV, FLAC and MP3 files and the films stay git-ignored.
- **Source:** MEM-QB, "Commit cadence".

**R13. A handoff note beside every pass.** [FIRM]
- **Each note covers:** what changed and why, where the files are, the exact re-run commands, what was measured versus judged, open issues, and which LEARNINGS rules were checked or broken on purpose.
- **Also:** update the README of the folder you worked in. (`docs/STATUS.md` doesn't exist at present; the root README is the start-here file.)
- **Source:** the SN handoffs; MEM-QB, "Documentation for a successor"; ORG §2.

**R14. Keep files organized.** [FIRM]
- **Rule:**
  - Follow ORG's layout (R1). Create no new top-level folders.
  - Scratch goes only in your own subfolder of the session scratchpad.
  - Delete nothing you didn't create.
- **Source:** the SN handoffs; MEM-QB, "Keep files organized" and its scratch gotcha.

**R15. Finish in parallel once the timing locks.** [GUIDE]
- **Rule:** once the timing locks, start the score, SFX, mix, facts and captions alongside the picture, within R10's limits.
- **Estimates** come from measured stage times, never padded day-long blocks.
- **Source:** MEM-QB, "Parallelize finishing".

**R16. Name the resources.** [GUIDE]
- **Rule:** when a pass is slow or blocked, or quality could rise, write the resource that would help (compute, GPU, voices, video-model credits, human viewers) into the handoff as an ask.
- **In this no-feedback run:** don't block on the ask. Take the programmatic route, and list the ask.
- **Source:** SN 10; MEM-QB, "Ask for resources that speed things up".

**R17. Save by efficiency, never by cutting plans.** [GUIDE]
- **Rule:** spend fewer re-reads of long context, make no redundant re-renders, combine reviews, and write briefs that point to files instead of repeating them.
- **Source:** MEM-AB, "Usage awareness".

**R18. Workflow gotchas.** [FIRM]
- **Rule:**
  - A relayed side question doesn't cancel the requested edits.
  - Don't resume a workflow blindly past steps that already had side effects.
- **Source:** MEM-QB, the workflow gotchas.

---

## MARKETING

**M1. No spoilers anywhere outside the episode.** [FIRM]
- **Rule:** the title, thumbnail, description, chapter titles and the intro's changes use setup images and hooks only.
- **For Ep2,** setups like these are fine: the mammoth in the lobby, the séance, Nole's `YOU PROMISED!!!`, the demo stage before the blimp.
- **Never show or state:** Alyi's departure, the white room, or anything after the episode's turns.
- **Chapter titles:** flag any that hint at an outcome, and offer a plain alternative. Ep1 did this for "five days, told twice".
- **Source:** MEM-QB ("why are half your thumbnails basically spoilers"); REL.

**M2. Thumbnails.** [FIRM]
- **Rule:** make five spoiler-free options, and pick one with a reason.
  - No real person's likeness.
  - The point reads at thumbnail size. Ep1's tear was invisible there.
- **Source:** REL; GR §5, "Promo and merch"; A33 P3.

**M3. The title format.** [GUIDE]
- **Rule:** match Ep1's: `MR. MAS — Ep. 2: her.wav | an AI-made pixel parody of the AI race`.
- **Source:** REL.

**M4. The description.** [FIRM]
- **Rule:** the description carries:
  - a story hook with no outcome;
  - the credit: everything made by Claude Opus 5.5 working in Claude Code; direction and prompts by jgon (the credit name is the showrunner's open choice);
  - library voices, none cloned; near-photoreal inserts show objects only;
  - chapters from the assembly, each at least 10 s, with the 2 s card folded into the intro;
  - the open-source invite.
- **Any parody notice lives here only.**
- **Source:** REL; OV §8; SN 3; SN 4.

**M5. The showrunner publishes.** [FIRM]
- **Rule:** the release copy goes in `production/v1/release.md`, in Ep1's `release.md` format.
- **Publishing, uploads and `EPISODES.md` are the showrunner's.** The Drive is retired.
- **Source:** REL; PL §5 ("don't worry about the drive anymore").

---

## Predicted showrunner notes

These are the notes the showrunner would most likely give on a first cut, from the pattern of their Ep1 notes. Each draft risk below is in Ep2's existing outline and script (draft 5.4), which predate the Ep1 v3.4–v3.5 lessons.

| # | The likely note | The Ep1 pattern | Where Ep2's drafts invite it | Pre-empt with |
|---|---|---|---|---|
| 1 | "Mas feels distant again; I can't tell what he's planning." | SN 1; SN 000 | EP2-S §2: 4 V.O. lines, 18 words, none in Act Three, written as catches before the planner voice | W5–W7 |
| 2 | "He's just watching screens; where's his agency?" | SN 0; N32 on Act Three | The podcast circuit, the RULEBOOK, the fog replay and the phone deal all play on his monitor, or seen from outside the hedge | W1, with a move in every act |
| 3 | "It's not clear why Alyi left." | SN 00000: "it's also ont clear why alyi changed his mind" | The bonfire runs 20 s; Alyi appears only in reflections | W11 (the full motive flashback); W13; W8 (no invented reason); P8 |
| 4 | "This transition comes out of nowhere." | PL §5 (v3); SN 00000 (the tour) | RUMPT's podium hill opens Act One with no Mas and no cause; the C-plot inserts | W12, and the seam table |
| 5 | "Why are Nole, Mario and Tasya doing this?" | SN 0000 | The rivals react to events but don't scheme yet | W10, with OV §6a's scheming leaders |
| 6 | "Too many people I don't know." | N32 (the intro's names; reference drops) | About 20 new names: Ekiel, the Forecaster, Bukaj, Haras, Omis, Selbeep, the Humanist, Remuhcs, Isolep, Reneiw, Xel, Trawets… | W21 (cut whoever is nobody's problem); CAL §4 |
| 7 | "Where's the ML explanation?" or "that felt like a lecture" | SN 00000B; SN 12 | Neither draft has the concept yet; THE PLAN's 44 s blueprint sits in the same episode | W22, W23 |
| 8 | "This cue sounds corny" or "too generic" | SN 2 (score) | The séance organ, the "her" flirt, the mammoth's swing | S1, S2 |
| 9 | "This shot looks off" (stiff arms, a cold face, a cursor, a prop nobody can read) | The late Ep1 fixes | sc 14's point-and-click and dialogue tree; the cursor-shaped planchette; crowds (the séance staff, the demo audience, the bonfire) | P5–P9 |
| 10 | "Why did you cut X? I liked it." | SN 0000 (TPOOL); SN 00000 (the deepfake) | Any trim that pays for new material | R3–R5 (the ledger and keep list; questions aren't cut orders) |
| 11 | "The setup for that payoff is missing." | SN 00000A; SN 00000B (steps two and four) | The IOU's 20% compute; the DAYS SINCE sign; "they ask first in there." → Ep1's "never waited to be asked"; THE PLAN's numbered steps | W15, W16 |
| 12 | "Your thumbnail and chapters spoil it." | MEM-QB | The act titles "WHERE'S ALYI?" and "THE ONE DOOR" | M1, M2 |
