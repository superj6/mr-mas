# Flow and continuity (guidelines, 2026-09-26)

> **Showrunner, on the Act Four v3 animatic:** "the timings are still looking clunky, make sure you're really thinking it through and checking. there are two many cuts, pauses, its hard to follow what's happening, etc. it can feel like it's moving fast but it should be fluid and coherent, and there should [not] be random pauses of silence. the ost should not be playing for just half a second at a time then stopping. it is just too jagged now"
>
> **Showrunner, 2026-09-26:** "while this is being built upon a lot of references, it should still be clear the overarching storyline to someone with minimal familiarity with the real world events (which is how you know it's being told coherently)"
>
> **Showrunner, 2026-09-26:** "to be extra clear, you need to balance clarity with engaging/suspenseful storytelling with not dragging on unnecessary/inferrable info for people with more background knowledge"
>
> **Showrunner, 2026-09-26:** "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"

**How to use this file (and every craft rule in the bible).**
- Everything here is **guidance**. Every number is a reference point for finding problems, never a pass/fail gate.
- The test is always: **is it fluid, is it clear, is it entertaining?** Break a guideline, here or anywhere else in the bible, whenever breaking it plays better, and note why in a line.
- **What stays firm:** the real guardrails ([guardrails](guardrails.md): legal, likeness, never cloning voices, private people, parody names) and the showrunner's own direct story calls (for example, no spoiling the firing in Ep1, and no on-screen "speculative" labels). Even those are applied with judgement about what actually reads on screen.

This file replaces older craft rules that were written as hard rules; the list is in [§7](#7-what-this-replaces). When a metric and the watching experience disagree, the watching experience wins.

**Related:** [pov-and-framing](pov-and-framing.md) · [tone-and-dialogue](tone-and-dialogue.md) · [pacing-model](../format/pacing-model.md) · [OST bible](../../audio/ost/OST-BIBLE.md)

---

## 0. What went wrong in v3 (measured on `out/ep01/act4/animatic/act4-animatic-v3.mp4`)

| Measure | v3 | What it felt like |
|---|---|---|
| Shots | 119 in 4:09. Average shot 2.09 s, median 1.88 s. 72 shots under 2 s; 48 under 1.5 s | Too many cuts to follow |
| Runs of 3+ shots under 1.6 s | 6 | Strobing, especially sc 26 (average 1.60 s) |
| Music | 33 fragments, some 0.6–2.5 s, each taken from a different place in its cue, with no fades. 10 gaps for "dry" windows | "Playing for half a second then stopping" |
| Near-silence (under −42 dBFS) | 78 holes of 0.3 s or more, totalling 70 s (28% of the act) | "Random pauses of silence" |
| Abrupt level jumps (over 15 dB between 50 ms windows) | 107 | Jagged |
| Dialogue | Lines packed 0.125 s apart, then wordless stretches of up to 19 s | Rushed talk, then holes |
| Places and visual styles | Suite, blueprint, call UI, dark room, boardroom, lobby, office floor, quote cards and posts, often changing every shot | Hard to tell where and when we are |

**Cause.** A set of rigid rules was each satisfied, and together they made the act incoherent:
- no 6 s without a voice
- a new setup on every change of speaker
- no 3 shots of one size in a row
- no music under real lines, posts or cards, with 1 bar clear on each side
- cuts on the beat grid
- uniformly tiny gaps between lines

The lesson isn't "write better rules". It's to judge the cut the way a viewer experiences it.

## 1. Think in sequences, not shots

- **Structure.** An act usually plays as a handful of **sequences** (Act Four lands around 5–8). Each has:
  - one place
  - one time
  - one question the audience is holding
  - one turn
- **Orient the audience.** A sequence usually opens by showing **where, when and who**, with an establishing or wide shot held long enough to take in, or a clear bridge from the last sequence.
  - The date rail and the HIS SIDE / THE BOARD'S SIDE rule usually label enough.
  - Stacking a card, a rail and a caption at once overloads the frame.
- **Stay in one visual register for a while.** Room, screen, blueprint and card are different worlds. Staying in one while the sequence stays there keeps it followable.
  - Move between them with a motivated bridge (a push into the screen, a match cut, a sound pre-lap). A string of mixed inserts is what lost viewers in v3.
- **The told-twice device reads best as clear chapters.** HIS SIDE as one stretch, then THE BOARD'S SIDE as one stretch.
  - Cross-cutting between sides works when it's a deliberate, signposted match (the same moment seen from both) that the audience can follow.

## 2. Cutting

- **Cut on story, not on a quota.** Good reasons to cut:
  - new information arrives
  - a reaction matters more than the speaker
  - the geography needs re-establishing

  A two-shot or over-the-shoulder can carry a whole exchange when the relationship is the point. A slow push-in is often better than a cut.
- **Typical lengths, as a starting point only:**

  | Kind of shot | Typical length |
  |---|---|
  | Dialogue coverage | 3–5 s |
  | Reactions | 1.5–2.5 s |
  | Establishing shots | 2.5–4 s |
  | Inserts carrying text | Long enough to read comfortably. About 0.25 s + 0.05 s per character is a floor to sanity-check against; be generous for story text |
  | Montage (the avalanche, the drill) | 1–2.5 s. Works best under continuous music, with one clear visual idea |

- **Very short shots** (under about 1 s) are for impact: a flash-print, a smash. Used a lot, they strobe.
- **A run of very short shots** outside a montage is the usual sign of over-cutting. Check it by watching.
- **Keep screen direction and eyelines consistent** within a sequence, unless breaking them is the point.
- **Variety in shot size comes naturally from cutting on story.** Two or three shots of the same size in a row are fine in a steady conversation.

## 3. Sound: a continuous bed

- **Room tone and ambience keep running.** Each location has a bed under every shot in it, crossfaded (roughly 0.5–2 s) across sequence changes.
  - True digital silence is a rare, designed story beat. In Act Four that's the drop-out after the Cancel click.
  - Accidental holes read as mistakes.
- **Music plays as continuous performances.** A sequence's cue usually plays as one continuous piece:
  - It's rendered to the sequence's length, or edited on phrase boundaries with crossfades or ring-outs. Hard cuts between unrelated sections are what made v3 feel jagged.
  - It can run through several shots and several lines.
  - It **ducks** under dialogue (around −8 to −12 dB with a short ramp) rather than stopping.
- **Under real lines, posts and quote cards,** the music usually **thins** rather than stopping: melody and hits drop out, a sustained pad or bass pedal holds, and it ducks further.
  - "Plays dry" now means: no comic scoring, no stinger or rimshot, no melody on the line.
- **Deliberate music stops are punctuation.** They work because they're rare; a few per act feels right.
  - Each lands on a story beat, with room tone underneath.
  - Each wants a clear re-entry (a new phrase, a pre-lap), not a half-second blip.
- **Very short music fragments** (a second or two) sound like mistakes, unless they're a designed sting on a story beat.
- **Transitions between cues:** a crossfade on a downbeat, a ring-out, or a pre-lap of the next cue under the outgoing picture.

## 4. Dialogue rhythm

> **Showrunner, 2026-09-26 (on Act Four v4):** "a lot of the dialoge is unnatural ... dialogue seems to randomly blurt out or cut off. it seems since v2 you didn't allow any conversation to play out for more than a few seconds which makes it hard to follow. i said to cut down empty time, but not to cut every dialogue into only a few words per character"

- **Conversations play out.** A scene built on people talking lets them talk:
  - complete thoughts, sometimes two or three sentences from one person
  - real back-and-forth, with exchanges running as long as the scene needs (often 20–90 s)
  - the camera holding on them while it happens
- **Cut empty time, not talk.** Tightening means dead holds, silence, redundant inserts and repeated information. It never means shrinking every line to a few words.
- **Overlaps, cut-offs and one-word answers are seasoning.** Use them when the moment is heated or someone genuinely interrupts; a few per act.
- **No blurts.** Every line has a reason to be said now, to this person, and the audience knows who is talking to whom before it lands.

- **Keep the delivery brisk,** using the paces in tone-and-dialogue as a guide, and **space it like people talk:**
  - quick replies about 0.2–0.5 s apart
  - a considered or loaded reply about 0.6–1.2 s
  - overlaps where the scene is heated or someone interrupts
  - never mechanically uniform
- **Long wordless stretches** work when the picture is clearly telling the story under music (a montage, a set-piece), or in a designed quiet beat. Unmotivated ones read as holes.
- **Voice-over** sits inside the sound bed, not in a hole.

## 5. Coherence is checked, not assumed

Before calling a cut ready for the showrunner, check it these ways. They're tools for judgement, not gates.

1. **Cold-viewer retells, as a newcomer and as an insider (§5a).**
   - Someone who hasn't read the script, and who sets aside what they know of the real events, watches the cut (frames with a timed transcript) and retells what happened.
   - Compare the retell with the act's **must-understand list**, and look hard at where they got lost.
   - Fix the confusions that matter and flag the rest for the showrunner.
2. **Flow measurements on the final mix,** to find spots to go and watch:
   - music starts and stops, and the shortest fragments
   - silent holes (under about −42 dBFS for 0.3 s or more)
   - abrupt level jumps
   - the distribution of shot lengths, and runs of very short shots

   A number that looks off isn't automatically wrong. Watch that spot and decide.
3. **A real-time watch.**
   - An agent that can't play video in real time says so and flags the cut for a human ear-and-eye pass.
   - The report never claims a cut "reads" or "flows" from stills alone.
   - It never calls a cut "locked" or "complete" on numbers alone.

## 5a. Clear to a newcomer (the real coherence test)

The show is dense with references, and they should reward people who know the real events. **The story can't depend on them.** Someone who has never followed AI news should be able to follow each episode and the season:
- who Mas is and what he wants
- who is against him and why
- what just happened, and what it cost

**How to write for it:**
- **Every load-bearing fact is set up inside the show.** If a beat only lands because you know the real history (who Gerg is to Mas, why the board can fire him, what a tender offer is), the show must establish it first, cheaply: a line, a label, a picture, a prior scene. THE PLAN blueprints exist for exactly this.
- **References are texture, not structure.** Easter eggs, real quotes, parody names and dates add a layer for insiders. Nobody should need them to follow the plot, and missing one should never cost the thread.
- **Introduce people by what they are to Mas** (his co-founder, the board member who wants him out, the landlord), not by what their real counterpart is famous for. Distinct silhouettes and on-screen names help the first time.
- **Keep the through-line visible.** Each act knows its question, and each episode knows its turn, in terms of Mas's story, not of the news.

**Balance: clear, suspenseful, never a lecture.** Clarity is one of three goals, held together with suspense and an insider's patience:
- **Clear doesn't mean explained.** Setups ride on action, conflict and jokes: a label on a prop, a line said in anger, a THE PLAN diagram, a character's reaction. Never a stop-and-explain.
- **Withholding is allowed.** Suspense depends on the audience not knowing everything yet.
  - A question the show *deliberately raises and later answers* isn't a gap.
  - A gap is something the show *assumes you already know*.
- **Tell each fact once,** at the moment it matters, in the fewest frames. Don't repeat what the picture already shows, and don't spell out what context makes inferable.
- **Write on two levels.** The same beat does the story job for a newcomer and pays off the reference for an insider (dramatic irony, a real quote, an egg).
  - If a setup would bore an insider, fold it into a joke, an image or a character beat that insiders enjoy on another level.
- **Only the throughline has to be clear.** A newcomer must follow the overarching story. Minor references can stay opaque to them, as long as missing them never costs the thread.

**How to test it: two cold reads, fixed together.**
- A **newcomer** read marks every point that leaned on outside knowledge.
- An **insider** read (someone who knows the real events and AI culture well) marks every point that dragged, over-explained, repeated itself or told what the audience could infer, and every spot where telling too much killed suspense.
- When the two conflict, look for a third way (a visual, a joke, a reaction) rather than picking one side.

**The newcomer read.** The cold-viewer retell (§5) is done as a **newcomer**. The reviewer:
- sets aside everything they know about the real people and companies
- retells only what the show itself told them
- marks every point where their understanding leaned on outside knowledge

Those points are the gaps to fix. An AI reviewer that knows the real story has to be especially careful here: it tends to fill gaps from memory without noticing.

## 6. Runtime

Runtime is an outcome. Coherence may add time back: orientation shots, held reactions and continuous music often need a few more seconds. That isn't padding. Padding is time that carries no information, feeling, orientation or fun.

## 7. What this replaces

These were written as hard rules. They're replaced by the guidance on the right, and like everything here, that guidance gives way to what plays best.

| Where | Old rule | Now |
|---|---|---|
| [pov-and-framing §4.7](pov-and-framing.md), rules 1–2 | No more than 2 consecutive shots of one size; every change of speaker changes the setup | §2: cut on story; size variety comes naturally |
| [tone-and-dialogue](tone-and-dialogue.md): "It plays dry" (the real-lines rule) and the §9 music rows | No music under a real line or a quote card | §3: the music thins and ducks; no comic scoring on the line |
| [OST-BIBLE](../../audio/ost/OST-BIBLE.md): the rule list (no music under real lines, 1 bar clear around cards) and the Act Four spotting tables | Music stops for real lines, posts and cards | §3 |
| [pacing-model](../format/pacing-model.md) and the Act Four v3 lock rules | No stretch over 6 s without a voice; lines 3–7 frames apart; cuts on the beat grid; joke-rate floors and dead-air caps as gates | §2 and §4. The model's numbers stay as guides for spotting problems |
| Every other numeric cap or quota in the bible or production docs (beat budgets, per-episode caps, read-time lints, style-switch and jump budgets, insert caps) | Hard limits | Guides. Go over or under when it plays better, and say why |
| Memory and briefs: "holds 1 s at most" | — | §4: holds serve comprehension |

---

## Notes from the Act Four v4 sound pass (2026-09-26)

These are measured on `out/ep01/act4/animatic/act4-mix-v4.wav`, not heard. They are practical notes for the next mix, not new rules.

- **Render the score to the picture, don't cut it from masters.** Re-laying the batch-1 cues' own notes to the lock's frames gave 8 music runs where v3 had 23 (median 21 s, none under 2.5 s) and 7 music-off windows, every one designed. A time-scale was needed once, the avalanche, at under 1 %.
- **Thin in the composition as well as in the mix.** Leave melodic onsets out of the render under a real line or post, keep the pedal, then duck. A stem ride alone still lets a pulse's attacks through.
- **A room at −38 to −40 dBFS is enough to end the holes.** With one bed per location, the only hole left was D6 (was 78 holes, 70 s). Bursty synthetic beds read about 1–2 dB under their RMS target in 50 ms windows, so set them 1 dB hot.
- **Most remaining ">15 dB jumps" are speech against its floor.** Words after a pause, over a floor about 20 dB down, account for 29 of the 38 left. That is natural, so read the jump count by cause, not as a total.
- **Watch the seams inside a re-laid phrase.** Moving a whole bar can bring its own empty half with it (MM-10's A1 ended on the ride alone), and the music-bus step list finds those.

## Notes from the Act Four v4 render and report pass (2026-09-26)

Measured, not watched or heard. These are practical notes for the next report, not rules.

- **Say which level measure a number uses.** The lead's v3 figures (78 holes, 70 s, 107 jumps) come from the **mono downmix**, (L + R) / 2, in 50 ms windows with no floor on the jumps. `mix_v4.py` measures the **louder channel** and ignores jumps below −60 dBFS, which gives v3 58 holes, 54 s and 86 jumps. `report_v4.py` reports both.
  - The mono downmix reads decorrelated stereo beds about 3 dB low. So a bed set to −40 dBFS per channel can register as a hole in mono, as the v4 lobby rest before "okay." does (0.45 s at −43).
- **Check sync on the encoded file, not the renderer.** `report_v4.py` cross-correlates the mp4's decoded audio with the mix (v4: 0 samples at four points). It also finds each cut in the decoded picture (v4: 77 of 81 on the lock's frame, the rest explained).
  - A cut the detector can't see is worth a look. On v4, S6.05 → S6.06 carries the same framing across the cut.
- **Hard splices inside the score are their own measure.** v3 had 20 places where a piece began where the last ended but from elsewhere in its cue, with no crossfade. v4 has none. The runs-and-stops count alone doesn't show them, because the music never goes quiet at a splice.

## Notes from the Act Four v4.1 finishing pass (2026-09-26)

Taken from the newcomer read, the insider read and the flow audit of v4.0, and measured on `act4-mix-v4.wav` and stills of the v4.1 render. Nothing here was watched or heard. They're practical notes, not new rules.

- **A silent post shouldn't pull the whole mix down.** Thin the melody under it, but hold the rest of the score at its level (in v4.1: a −3 dB duck, and +2 dB on the held families inside the thin). v4.0 dipped the mix 7–14 dB under every silent post and swelled back between them, which is its own kind of "jagged". v4.1 measures 0.5–2.6 dB, apart from the blog post's 6 dB, kept as a hush under the board's public reason.
- **When the two reads pull apart, look for the in-world version of the fact.** The call's own "You've been removed from the meeting.", a call's "left the call" notices, a plate that says what someone is to Mas. Or move the fact to just after the question it answers: the Q\* rail now follows "it's a preview." as a sting.
- **A label that tells the joke before it lands is over-telling**, even when it's funny on its own: `+1 FIRING` before the tally, `ANSWERS GIVEN: 0` before "Good question.", `CHAIRS BOARDS ON FIRE` before "Which room is on fire?".
- **A dead stop needs a cause the audience can see.** Gerg's glance was a few pixels, so its stop read as a drop-out. Show the cause big (v4.1 cuts in on it), or ring out instead of stopping (v4.1 does both).
- **A long line can cross a cut** to land its second half on a picture (the memo's "i harbor zero ill will towards him." over the nameplate coming off).
- **Keep shot IDs when cutting shots**, so the reads' notes still point at the right places. Carry old frame numbers onto the new lock with a warp (the cues' `w()`) rather than re-typing them.

## Notes from the Act Four v4.2 closing pass (2026-09-26)

Taken from a fresh newcomer read and a fresh insider read of v4.1, and measured on `act4-mix-v4.wav` and stills of the v4.2 render. Nothing here was watched or heard. They're practical notes, not new rules.

- **A fresh read finds new gaps.** The v4.1 fixes closed what the v4.0 newcomer had marked. A new newcomer then got lost in places the first one had passed: they read the Cancel click as OK, and asked of "Everyone is welcome." "welcome where?". Re-test with someone who hasn't read earlier cuts; a re-read by the same reviewer mostly confirms its own fixes.
- **A pointer's path is a sentence.** The noon arrow passed beside OK on its way to Cancel, and a still-by-still viewer read the click as OK. Land the pointer on its target a beat before the click, and light the target (a hover ring in the clicker's colour). Then the button is readable in any frame, not only on the click frame.
- **Carry a prop to answer "where".** Tasya's sign, taped to the slate door in pass two, tells whose door it is and whom it was for. So "Everyone is welcome." widens the offer without a new word, and it is a callback for the insider.
- **Say what someone is to Mas at the moment it hurts.** A second line on a tag (`ALYI` over `CO-FOUNDER`, the blueprint's name-and-role grammar) at the click did what a plate 43 s later couldn't.
- **Cutting a shot can cut its music.** A cue written against a shot's window (the Door over S3.08's doorway) collapses onto the cut when the shot goes. The warp stacks it, or it lands melody on the next post. Remove or move it in the cue.
- **Re-rendering a cue shifts its levels a little.** Removing 2.7 s from the S3/S4 cue moved the level of nearby shots by up to ±1 dB. A re-render of the old version reproduced it exactly, so the engine is deterministic and the shift is real. After a cue edit, re-check the post-level table (report §4b).
- **Review chrome teaches too.** The margin's transcript band named NELEH, MADA and ADELINA before the picture did, and both reads learned the names from it. Chrome follows the same "named once shown" rule as the transcript.
