# Showrunner notes: live file (read this first)

**Every agent working on MR. MAS reads this file at the start of its task.** It collects the showrunner's latest notes. It may be updated while a pass is running, and a newer note here takes precedence over an older brief. Last updated: 2026-09-26.

## Current notes, newest first

1. **Scenes to be felt, not points to be made (2026-09-26):** "also for the dialogue, one thing to point out that was part of issue earlier is each conversation was reduced to minimum lines to get a point across without feeling like real dialogue that helps the viewer feel the scene. let's make sure generally we are using generally good filmography and storywriting trends"
   - Dialogue isn't information transfer. It builds the scene's feeling: relationship, status, subtext, texture, rhythm, a small human detail.
   - A conversation earns its turn through several beats. Information arrives as a byproduct of people wanting things from each other.
   - Use standard, proven screenwriting and film grammar. See [tone-and-dialogue: Scene craft and film grammar](../bible/tone-and-dialogue.md).
2. **Fully programmatic first pass (2026-09-26, restated):** "as stated before, we want to first create a version fully programatically, then we can consider the outside layers as quality additions to replace components of what we can do in he first pass"
   - Outside layers (ElevenLabs voices, Runway video, other generators) are quality replacements for components of a finished programmatic pass. They're not used to build the first pass.
   - Plan their final routes on paper. Keys in `.env` are for later and don't get spent now.
   - Also: "we want to in the first episode preview the ability of your video creation versatility". See style-range §6.1a (being written).
3. **Stick figures first; ask for resources (2026-09-26):** "rather than stay stuck, if things can be done faster with more resources, you should always ask me. also, we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render"
   - Script, dialogue and flow are iterated in cheap stick-figure reels (real takes plus a temp bed) until the showrunner approves them. Pixel animatics and final picture come after.
   - Whenever work is slow or blocked, the lead asks the showrunner for the resource that would speed it up.
4. **Let conversations play out (2026-09-26, on Act Four v4):** "it is getting cloesr. however, a lot of the dialoge is unnatural and the cuts are still quite fast. a few time dialogue seems to randomly blurt out or cut off. it seems since v2 you didn't allow any conversation to play out for more than a few seconds which makes it hard to follow. i said to cut down empty time, but not to cut every dialogue into only a few words per character"
   - **Measured on v4:** 176 words of dialogue in 4:11; a median of 4 words per line; 21 of 45 lines three words or fewer; the longest conversation 10 s. The Ep1–3 scripts show the same pattern.
   - **What it means:**
     - Scenes are built on real conversations. People speak in complete thoughts, sometimes several sentences. Exchanges run as long as the scene needs, often 20–90 s.
     - Overlaps, cut-offs and one-word answers are rare seasoning, used when motivated, never the default.
     - Nobody blurts a line with no setup.
     - Cut empty time (dead holds, silence, redundant inserts), not the talk.
     - Cover conversations with shots that hold (two-shots, over-the-shoulders, singles cut on real turns), not a cut every line.
5. **Balance (2026-09-26):** "to be extra clear, you need to balance clarity with engaging/suspenseful storytelling with not dragging on unnecessary/inferrable info for people with more background knowledge"
   - Clear, suspenseful, never a lecture. Setups ride on action and jokes, and withholding for suspense is fine.
   - Tell each fact once, when it matters. Write on two levels, for newcomers and insiders.
   - Test with a newcomer read and an insider read. See [flow-and-continuity §5a](../bible/flow-and-continuity.md#5a-clear-to-a-newcomer-the-real-coherence-test).
6. **Newcomer clarity (2026-09-26):** "while this is being built upon a lot of references, it should still be clear the overarching storyline to someone with minimal familiarity with the real world events (which is how you know it's being told coherently)"
7. **Style range (2026-09-26):** "we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense." Also: "some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)". See `show/bible/style-range.md` (being written).
8. **Creative mandate (2026-09-26):** "try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow"
9. **Guidelines, not rules (2026-09-26):** "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"
10. **Flow (2026-09-26, on the Act Four v3 animatic):** too many cuts and pauses, hard to follow; "it can feel like it's moving fast but it should be fluid and coherent"; no random pauses of silence; the score must not play in half-second fragments. See [flow-and-continuity](../bible/flow-and-continuity.md).
11. **Adjacent figures and lore (2026-09-25):** Thiel, Palantir, Flock, Leopold "or similar", and AI/EA lore, only where natural. See [orbit-and-lore](../bible/orbit-and-lore.md).
12. **World threads (2026-09-25):** China, public sentiment, protests, jobs and energy are a menu, not a quota. See [world-stakes](../bible/world-stakes.md).
13. **Standing:**
   - Fluid thriller drama, never clunky.
   - No padding.
   - Shot variety; boxed talking heads only when the box exists in the story world.
   - Limited third person through Mas.
   - No on-screen "speculative" labels.
   - Ep1 never spoils the firing before it happens.
   - 1080p max.
   - Pixel art is the primary style.
   - Never clone real voices; no photoreal likenesses of real people.

## Production handoffs and hygiene (from the lead, not showrunner notes)

- **Keep files organized (showrunner, 2026-09-26):** "let's try to keep files organized, they are a bit all over the place."
  - New outputs go in the layout in `docs/ORGANIZATION-PLAN.md` once it's adopted. Until then, don't create new top-level output folders; put work beside its episode or area.
- **Documentation for a successor (showrunner, 2026-09-26):** "as far as documentation, we want to be sure that we are leaving appropriate detail where someone could pick up where we left off."
  - Every pass leaves a handoff note beside its work: what changed and why, where the files are, how to re-run it (exact commands), what was measured versus what still needs a human, and open issues.
  - `docs/STATUS.md` is the single "start here" file, refreshed at every milestone.
- **Scratch hygiene (2026-09-26):** work only inside your own named subfolder of the session scratchpad (for example `scratchpad/<your-pass>-<your-role>/`). Never delete, overwrite or "clean" files you didn't create there. Agents cleaning up wiped other agents' files twice on 2026-09-26.
- **Act Four v4 music (2026-09-26):** `audio/ost/tracks/e01-act4-v4/` has its own copy of the LEVERAGE section. It needs the fix MM-11 got in the OST follow-up: the cello pizz on its own track, notched at 110.5 Hz (−12 dB, Q 16), and the F pedal re-bowed every 2 bars (see `audio/ost/tracks/mm11-the-return/README.md`). After that it should pass the engine's F-major check. The retuned MM-11 violin also comes in about 2 dB lower through the reverb, and MM-11 compensates with +2 dB on its track.
