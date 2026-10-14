# Ep3 v1: LEARNINGS and the delta from Episode 2

> Written 2026-10-13 for the one-go Episode 3 attempt. Read `docs/HANDOFF.md` and `show/production/SHOWRUNNER-NOTES.md` first. This file incorporates [Ep2's binding checklist](../../../ep02/production/v1/LEARNINGS.md) by reference; it does not duplicate its sixty-plus rules. The newest showrunner note wins. Rule IDs below are Ep2's IDs.

## What carries forward

The show is Mas's rise through his decisions: a thriller that happens to be funny. Every act needs a public or invented small-stakes choice from him, an obstacle, and a consequence. His inner voice gives the practical goal behind the move; it never fills in a disputed secret. Other leaders arrange things too. Conversations have a middle and room to land. Each insert has a cause, sound lead, matched object and present-day reaction. About 14–18 inner-voice lines, 45–90 seconds for one motive flashback, 20–30 seconds for one ML concept and 20–24 minutes of film are craft guides, never quotas.

The established naming registry, cast, pixel engine and score identity carry forward. Plan voices, score, room tone and effects with the picture. Check newcomer clarity and insider drag separately. Measurements cannot tell us whether a scene is moving or a joke is funny. Mark measured claims [M] and page/ear/eye judgements [J], and record what nobody heard or watched.

## Newer instructions that override older wording

| Source | Ep3 application | Test |
|---|---|---|
| SHOWRUNNER 00000D, Oct 11 | FIRM safety/legal rules stay firm. Everything classified as TASTE in current guardrails is a choice, never a review blocker. Do not turn every Ep2 checklist label into a new hard rule. | Reviewer identifies actual depicted conduct and exact FIRM rule, or labels its finding taste [J]. |
| SHOWRUNNER 00000C, Oct 10 | The intro types and voices `near the singularity; unclear which side.` unchanged. The garden quote is retired from the intro. | Compare the quote and audio route with Ep2 restored intro [M]. |
| HANDOFF §7.3 | Existing intro slots only: MUTE keycap, subtitle `now with voice (paused)`, dot x=.60. Hill/lanyard/tally/price-tag/roll-call additions require new shared code and regressions; they are not already available switches. | Inspect variant config and shared-code diff [M]. |
| HANDOFF §7.4–5 and Ep2 D-102 | August politics and the refiled suit already aired. The final podium is EMPTY, with a plain green chatbot bubble whose string snaps taut out of the frame. | Compare Ep2 script 23.07–23.08 and Ep3's first podium image [M/J]. |
| Season ML map, agreed Sep 29 | Ep3 explains next-token prediction and attention. Thinking-time depth belongs to Ep10. A model's launch behavior may be shown without a second explainer. | One mechanics explanation; no token-letter blindness or longer-thinking-always-better claim [M/J]. |
| Motives-and-the-race §5 / flashback map §2a | Gerg's full motive memory is THE WOODROSE, including a Breakout glimpse. His choice to build gets a scene, not just a dimming roster. | 60–70 s planned, want/obstacle/turn, sound and object seams [J until timed]. |
| HANDOFF §3 / memory one-go exception | Write full revised flow, decide, review and build it. Story calls and human ear/eye checks go in DELIVERY; no mid-run option gate. | Proposal decision log and delivery limitations [M]. |
| HANDOFF §4 | Keys are in `.env`; never read/print values. Ep1 is locked. Heavy work uses `ops/heavy.sh`, resource caps and governor. At most three agents; lead serializes heavy phases. | Staged keyscan, Ep1 SHA check, commands/logs [M]. |

## Episode-specific check before production

| Check | Draft 3.6 diagnosis | v1 requirement |
|---|---|---|
| W1 / W9: agency | Mas mostly asks for numbers and watches events. | A visible alternative and decision per act; do not claim he caused real resignations, votes or election results. |
| W5–8: voice | Five retrospective/caught V.O. lines, none a sustained practical objective. | Sixteen source-script thoughts, most planner lines; silence around departure reasons, testimony and contested claims. |
| W11: motive | Woodrose 31 s; no full motive scene. | Gerg chooses the uncertain build over the comfortable work; Mas makes starting practical. No new reasons for Alyi's later departure. |
| W22: ML | 48 s tokenization/thinking lecture plus stadium demonstration and Pro mechanics. | 25–30 s transformer/next-token/attention explanation, in response to a launch problem; product scenes dramatize use/cost. |
| W2 / W21: clarity | More than ten new names; current intro cannot reveal the garden post. | Reveal cause of fruit craze in cold open; plate only recurring partners; role-only background. |
| W12 / P3: seams | Mostly strong matches; time jumps can still feel like a calendar. | Causes connect the sequences; arrivals show people before talk, exits land on a reaction. |
| W15: payoffs | PLAN step 4 ceases to exist if wrong explainer is cut. | Retire that whole checklist deliberately, retain blank keycap/photo/bill/door/scroll/collar payoffs. |
| S1–4: sound | Too many draft stops and somber monitor scenes risk flat suspense. | Distinct cues in the show's knee/chip/jazz/no-third identity; warmth/caper/spectacle/quiet share the episode. |
| P5 / P7 / P9 | Most new props and rigs have not been built or seen. | Speaker readable; anatomy/support/contact shadows checked; text timing and palette changes measured later. |
| R6–9 | No timed Ep3 reel exists. | Source script → programmatic takes/reel → reviewed timing → pixel finish; all lines, including V.O., remain in rebuild source. |

## Predicted showrunner notes

| Likely note [J] | Prevention | Human check still owed |
|---|---|---|
| “Mas is watching again.” | His release choice, fundraising terms, build cadence and line entry drive the four acts. | Retell the causal chain without dates. |
| “Why do we get the R-count lesson and then the thinking lesson?” | One transformer explanation; stadium is a test with an observable outcome and a hidden process. | Whether newcomers follow without a second explanation. |
| “Why did Alyi leave?” | No inferred cause, vote/exit reenactment or V.O. about his reasons. Dimming chair is an absence, not a theory. | Whether neighboring scenes imply a reason accidentally. |
| “Everybody talks in punchlines.” | Keep and deepen Gerg/Mas, Rima/Mas, investor/Mas and Mario/Adelina two-handers. | Whole-turn voice naturalness and response timing. |
| “The intro changed the quote again.” | Use the restored quote unchanged; fruit cause lands before intro. | Intro handoff at speed. |
| “Who are these people?” | No named one-use Halo, Other Paul, Leiht or Sozeb introduction. | Newcomer name burden. |
| “Why is that balloon slack?” | First podium match is empty, taut and unlettered; the new location is an obvious broadcast/studio setting. | Memory match to Ep2 hook. |
| “You called it done without watching.” | Delivery distinguishes generated/measured/reviewed from unwatched/unheard. | Full film with a human eye and ear. |

## Pass handoff

Changed only this learning delta. No take, lock, picture, score, Ep1 or Ep2 asset was changed in this pass. The audit and proposal apply it. Re-check textual policy with `rg -n 'MAS.*V.O.|near the singularity|MUTE|thinking|attention' show/episodes/ep03/production/v1/`. Production QA belongs to later passes and must run through `ops/heavy.sh`.
