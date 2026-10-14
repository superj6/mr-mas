# Ep3 v1: delivery note (read before watching)

> **Episode 3, `ep1.2_strawberry.jpg`, is finished as an unpublished one-go Codex attempt: 20:03.00.** New dialogue uses local Kokoro stock presets; inherited intro/outro audio remains. The corrected film passes measured acceptance checks. No continuous human watch or listening pass is recorded. [M] means measured or checked against files; [J] means editorial judgement. Neither mark implies a human has watched or heard the film.

## What is delivered

- **The film:** `out/ep03/v1/ep03-v1.mp4`: **20:03.00**, 28,872 frames at 24 fps; story 19:16.00. 1080p24 H.264 with AAC 256 kb/s; **77,165,987 bytes**. MD5 `18b77189ea3abb6782672c8f98b76905`; full SHA-256 is in [delivery-checks.json](assembly/delivery-checks.json).
- **Read along:** [script-v1.md](script-v1.md) is generated from the source spec. The [final-clock transcript](assembly/transcript-film.txt) has 250 spoken/thought rows including the unchanged intro quote. [review-picture.md](review-picture.md) records the precise still-inspection scope and corrections.
- **Provenance:** [facts-v1.md](facts-v1.md) and [facts-story.md](facts-story.md) keep factual sources off screen. [review-source.md](review-source.md) records the writing/guardrail pass and its limits.
- **Rebuilds:** [pipeline.md](pipeline.md) documents the episode-local chain and per-scene cache; [assembly/README.md](assembly/README.md) gives final assembly and QA commands. New paid-voice requests/credits: **0 / 0**; this delivery keeps the completed local stock-voice cast.

Final chapter starts and the [exact-time watchlist](assembly/watchlist-film.md) were generated from `assembly/v1-assembly.json` plus the six matching pixel locks by `assembly/tools/watchlist.py`. The helper rejects mismatched chapter/lock lengths and offsets. Chapters: Cold open 00:00:00 · Intro 00:55:14 · filename 01:25:14 · Act One 01:27:14 · Act Two 06:32:00 · Act Three 11:09:04 · Act Four 15:18:02 · Tag 19:14:14 · Credits 19:48:00 (MM:SS:FF at 24 fps).

The user explicitly authorized the optional ElevenLabs pass. Automatic approval review still rejected the private-script export because the destination is classified as untrusted by platform policy. No paid request was sent and no new credits were spent. The completed local stock cast is the final voice pass for this attempt; no further permission question is pending.

## Measured on the delivered film

| Check | Result |
|---|---|
| Integrated loudness / true peak | **−16.14 LUFS / −1.22 dBTP**; within the delivery targets |
| Decode / flash | All **28,872 frames**, **0 errors**; maximum **1 flash/s**, **0 red flashes** |
| A/V / codec | All **9 chapter sample lags = 0**; **0 detected codec bursts**; AAC tail padding **8 ms** |
| Chapters / transcript | All **9 chapters match assembly**; **250 spoken/thought rows** match the lock inventory including the intro |
| Date rails | All **13 intended dates** are locked in the reserved band, included in the transcript and inspected on native encoded frames; complete-ink holds pass reading floors |
| Chapter-boundary picture comparison | All **18 samples** agree with their source pictures; maximum mean absolute pixel difference **0.09** |
| Measured acceptance | [delivery-checks.json](assembly/delivery-checks.json): **PASS**, no failed conditions |
| Frozen assets | [preservation-check.txt](assembly/preservation-check.txt): **31 Ep1 delivery hashes OK**; Ep2 film matches baseline MD5 `2a6affb88c14f25ff3735935639bc15a`; Ep3 intro WAV is byte-identical to the aired Ep1 master |

Full evidence is [v1-qa.json](assembly/v1-qa.json), [v1-assembly.json](assembly/v1-assembly.json) and [seam-frames-v1.json](assembly/seam-frames-v1.json). The largest encoded 200 ms RMS changes are **+16.9 dB at 19:14:14** into the tag and **+8.4 dB at 19:48:00** into the outro. These measure the contrast of the joins, not how they sound; both are flagged in the listening list.

## What this attempt chose

- [J] Rebuilt stale draft 3.6 around **next-token prediction and causal attention**, matching the season plan. `The keys on the desk` → `are` is the sole simplified example. Bars are explicitly illustrative; the shutter hides the band's answer-making rather than claiming to show a raw chain of thought. Thinking-time mechanics remain for Ep10.
- [J] Kept full exchanges where pressure changes: Gerg's handover, Rima's exit, Woodrose, financing, the quiet phone call and Nole on the terrace. Mas makes small concrete choices in every act. Sixteen lowercase thoughts stay practical rather than explaining a secret master plan.
- [J] Used the Woodrose memory to dramatize choosing to build together, with napkin, first task and Breakout. The conversation is invented; it does not supply a private historical reason or consume later dinner revelations. The delivered memory is 44.88 seconds, plus 5.42 seconds back at the present edge; recovered speech time was left recovered.
- [M/J] Matched Ep2's **empty podium and taut plain green balloon**. Shot 20.04 reuses the exact empty/taut podium plate for seven seconds with offscreen rolling/caster sound; visible lectern transport was not fully animated. No hill, slack string, `SO SCARY` lettering or occupant before the final reveal. Intro changes are only MUTE, `now with voice (paused)` and the .60 dot; the spoken/typed quote is unchanged.
- [J] Reduced one-use named cameos to unnamed background roles. Retained the explicit `RUMPT WINS` result as a taste call. Its display is month-only, with no claim that the result was called on election day.
- [M/J] Placed the documented **personal $1M contribution on December 13**, in Mas's own room before the December 20 announcement. Date, contributor and amount share one readable page. The later undated impossible terrace replays a symbolic check; the much larger investment pledge is a separate invented image. Neither is presented as buying a particular actual policy or access.
- [J] Moved restructuring news away from Rima's turbine exit, into later funding preparation separated by dinner and veto. Departure gets no invented cause. Rival writing has warmth and pushback; neither real departure nor real corporate decision is explained by the cartoon.
- [M/J] Used code-native pixel, early-web and paper styles, ordinary library voices, and carried approved assets. No real-person imitation or generated realistic performer. Current production credits say Codex / prompt: jgon; inherited Opus 5.5 assets are acknowledged in the episode-local README and metadata.

## Verification and its limits

| Scope | Current evidence | Limit |
|---|---|---|
| Source | [M] 1,983 dialogue/thought words, 249 lines, 124 beats and 16 thoughts; stable IDs and deterministic source generation. Delivered audible spans replace rate estimates. | [J] Text correctness does not establish acting, clarity or pace. |
| Picture | [M/J] Before encoding, all 124 actual-host story shot middles inspected in unscaled 1080p pages; contact sheets cover first/middle/last. Final corrected-film sheets cover all 124 middles at **480×270 per shot** between two reviewers. This writer inspected all 13 native final date-rail frames and native ledger/credits/cast; root inspected five complementary native closes. Earlier native encoded inspection covered 22 story frames plus credits/cast before the rail correction. | Acting and coverage remain procedural and limited. Encoded sheets are smaller samples, not native 1080p inspection of every encoded shot. Still samples do not test a gag's motion, continuity at speed or every frame. The story writer is one reviewer, not an uninformed newcomer. |
| Timing / takes | [M] All 249 local stock takes completed, with zero hard inventory/file/text/level problems. Ten stored ASR recall flags remain; exact line ranges are in the watchlist. Matching locks have zero read-floor warnings; final face appears before tag speech. | ASR flags are not confirmed bad readings; spelled-out numbers/homophones account for some differences. Speech naturalness remains unheard. |
| Facts / guardrails | [M/J] Primary event records, original essay wording and dated personal contribution checked; source review finds no written FIRM blocker. Fantasy hydra, pledge and terrace remain plainly invented staging. | No legal review. Tone and unintended causal inference still need a newcomer. |
| Outro | [M/J] Stock encode: 1080p24, 360 frames / 15 seconds; both pages inspected, reading floors/contrast/flash QA pass. Cast page matches the delivered local stock cast. | Cast page is deliberately pause-to-read. No listening judgement is claimed. |
| Final film | [M] Loudness, true peak, decode, flash, transcript, sample alignment, boundary pictures, final media identity and frozen-asset checks pass as reported above. All six per-scene rendering comparisons pass. | Passing these cannot establish that the show is enjoyable or the voices sound natural. |

The ten recognizer flags remain listening requests. No paid-voice completion, legal review, uninformed newcomer review or continuous watch/listen is claimed. Final review scopes and media identity are recorded in [review-picture.md](review-picture.md).

## First watch and listen

Watch the whole film once at speed. The [exact final-clock ranges](assembly/watchlist-film.md) include the ten recognizer-flagged lines with expected script and machine transcription side by side. Priorities are the handover's warmth, one short attention lesson, stadium business versus drag, Rima's agency, Woodrose as motive rather than exposition, the unscored phone call, the paper bridge, Shipmas reading time, the date/meaning of the personal check and the delayed podium reveal. Listen for complete turns, remote-device routes, repeated Rima phrasing, crowd realism, speech under score, and chapter/outro joins. Numeric audibility checks cannot hear any of these.

One specific coverage compromise: 22.04 holds on Gerg/customer while Mas gives two short advice lines offscreen, although the shooting caption originally planned him visible. Check that the established room and voice identify him clearly.

## Story choices still open to the showrunner

1. **Chronology and density.** The offscreen source dates the fruit cold open August 7; its picture deliberately leaves the date off. The first lab date is August 5. Later months move through publication, departures, regulation, funding, election and launches. [J] A newcomer may miss the small rewind or feel the calendar is driving the episode. Smallest fix: a picture/text orientation change before altering dialogue.
2. **Attention and the stadium.** The explanation is short and source-matched; “keys matters for are” is slightly awkward speech. The hidden band and correct strawberry answer are comedy, not a documented internal algorithm. [J] Check that the whole sequence teaches one idea without promising that o1 is simply a band doing letter arithmetic. The prompt/answer demonstration itself is an invented scene.
3. **Woodrose length and tenderness.** The memory was kept even after natural stock speech came in below the rough 60–70 second aspiration. [J] Recovered time was not padded with frozen faces. If it feels thin, revise the exchange for a real new turn rather than extending a hold.
4. **Money and the political ending.** The fictional pledge is an absurd unrolling list on a cushion, not a reconstructed contract; the actual reported ask is context rather than a legal verdict. The personal contribution document, symbolic replay and much larger investment sign must remain distinguishable. [J] A human may still infer a transaction from their proximity. Picture or score emphasis is the first place to reduce that inference; do not invent explanatory dialogue about actual motives.
5. **Political weight.** The veto and explicit election result, Nole scene and final Rumpt performer were kept as taste decisions. [J] Opposing institutions appear; no claim is made that screen seconds establish balance. Tone is a showrunner call within the current FIRM rules.
6. **The frozen-bay hook.** One pocket strawberry and whale-shaped shadow end the film without an explanation. [J] It is deliberately an impossible omen; check that it invites the next episode rather than feeling like an unrelated postcard.
7. **Podium transport coverage.** The seven-second 20.04 hold preserves the exact Ep2 plate while offscreen caster sound implies movement. [J] Check whether that is clear or feels like an inert insert. Drawing visible transport is an art change; it is not already present in the delivery.

## Requesting changes

Give a shot ID and the intended change, or a final-film timecode. A drawing/framing change can use the existing per-scene picture cache; a source-carried text changes the spec and lock; dialogue or timing changes require takes as needed and relock/score/mix for that act. The exact commands and dependencies are in [pipeline.md](pipeline.md). Every heavy step goes through `ops/heavy.sh`; later chapter clocks are regenerated if an act length changes.

No public upload is authorized or claimed by this delivery note. Episode 1 stays locked; Episode 2 remains the separate unwatched/unpublished v1.
