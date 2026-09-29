export const meta = {
  name: "mrmas-act4-v4-flow",
  description: "Act Four v4: rebuild the animatic for flow and coherence (sequences, fewer cuts, continuous music and room tone, natural dialogue spacing), gated by cold-viewer retell tests",
  phases: [
    { title: "Diagnose", detail: "newcomer and insider reads of v3, editor diagnosis, sound diagnosis" },
    { title: "Plan", detail: "supervising editor's v4 edit plan, adversarial critic, finalize" },
    { title: "Build", detail: "board + lock v4, continuous score + beds + mix, render + flow report" },
    { title: "Verify", detail: "newcomer + insider reads + flow audit, fix, fresh re-reads" },
  ],
}

const ROOT = "/home/jgon/project/art/mrmas"
const SCRATCH = "/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/act4v4"
const FF = `${ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg (run it with LD_LIBRARY_PATH set to that folder)`
const AUTH = `AUTHORIZATION. The showrunner (the user) watched the Act Four v3 animatic and said, verbatim:
> "is the v3 animatic supposed to be complete? the timings are still looking clunky, make sure you're really thinking it through and checking. there are two many cuts, pauses, its hard to follow what's happening, etc. it can feel like it's moving fast but it should be fluid and coherent, and there should be random pauses of silence. the ost should not be playing for just half a second at a time then stopping. it is just too jagged now"
(The lead reads "there should be random pauses of silence" as "there should NOT be random pauses of silence"; everything else in the note says so.)
Then, verbatim: "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"
Then, verbatim: "while this is being built upon a lot of references, it should still be clear the overarching storyline to someone with minimal familiarity with the real world events (which is how you know it's being told coherently)"
Then, verbatim: "to be extra clear, you need to balance clarity with engaging/suspenseful storytelling with not dragging on unnecessary/inferrable info for people with more background knowledge"
LIVE NOTES: before anything else, read ${ROOT}/show/production/SHOWRUNNER-NOTES.md. The showrunner may add notes while this pass runs; the newest notes there take precedence over this brief.
Earlier standing notes that still apply: "it should feel fluid and engaging like any good show, make people feel they are in a thriller drama"; "don't lengthen things out just for the sake of it"; "we don't need to have all scenes in the form of boxes for people talking, we can have more closeup or other angle zoom vareity shots"; "while we can hint to it we should not directly spoil the firing before the end" (Act Four IS the firing, so it may show it).
GUIDANCE: ${ROOT}/show/bible/flow-and-continuity.md (written 2026-09-26 from these notes; it replaces the rigid v3 rules that caused the problem: cut quotas, a new setup on every speaker change, no music under real lines, cuts on the beat grid, uniformly tiny line gaps). Read it first, fully. Every number in it, and in any brief below, is a guide for spotting problems, never a gate: the priority is always that the act is fluid, clear and entertaining to watch. Break any guideline when it plays better, and note why. Firm lines are only the real guardrails (show/bible/guardrails.md) and the showrunner's direct story calls.
You are AUTHORIZED to edit the files your task names, record, render and measure. Do not ask questions and do not stop at a proposal. Nothing gets committed.

PROJECT: MR. MAS, animated parody thriller (pixel art primary). Act Four of Ep1 is "THE BLIP, told twice" (the Nov 2023 firing and return of MAS MANALT, told from HIS SIDE, then THE BOARD'S SIDE). Its script is the "## ACT FOUR" section of ${ROOT}/show/episodes/ep01/script.md (draft 3.2). Production files: ${ROOT}/show/episodes/ep01/production/act4/ (shotlist-v3.md, shots-v3.json, shots-locked-v3.json, timing-v3.md, dialogue.md, framing-v3.md, chunks-v3.md, tighten-changes.md). Animatic code: ${ROOT}/studio/src/episodes/ep01/act4/animatic/ (Animatic.tsx, data-v3.ts, sound-v3.ts, tools/lock_v3.py, tools/mix_v3.py, tools/render.ts, tools/report_v3.py). v3 outputs: ${ROOT}/out/ep01/act4/animatic/ (act4-animatic-v3.mp4, act4-mix-v3.wav, act4-mix-v3.cues.json, act4-v3-contact.png). Dialogue takes: ${ROOT}/out/ep01/act4/dialogue/ and lines.json (see dialogue.md). OST: ${ROOT}/audio/ost/ (engine/README.md, tracks/, OST-BIBLE.md, SAMPLER.md). Audio venvs: ${ROOT}/audio/.venv-mix/bin/python (numpy, soundfile), others under audio/.venv*. Bundled ffmpeg: ${FF}.
LEAD'S MEASUREMENTS OF v3: 119 shots in 4:09 (average 2.09 s, median 1.88 s; 72 under 2 s, 48 under 1.5 s; sc 26 averages 1.60 s; six runs of 3+ shots under 1.6 s). Music: 33 fragments with no fades, many 0.6 to 2.5 s, each taken from a different place in its cue, 10 gaps for "dry" windows. Mix: 78 holes of 0.3 s or more under -42 dBFS totalling 70 s (28% of the act), 107 abrupt level jumps over 15 dB between 50 ms windows. Dialogue packed 0.125 s apart, then wordless stretches up to 19 s. The picture changes place and visual register (room, blueprint, call UI, card, post) almost every shot.
OWNERSHIP AND LIMITS: other passes are running. Do not edit audio/ost/engine/**, audio/ost/tracks/** except a NEW folder audio/ost/tracks/e01-act4-v4/ (create it), audio/theme/**, show/episodes/ep0[2-9]/**, show/episodes/ep1*/**, the non-Act-Four parts of ep01/script.md, or any bible file other than notes appended to flow-and-continuity.md. Render at 1080p max; use --concurrency=6 at most (the machine is shared). Disk is about 97 to 98 percent full: delete scratch frames and superseded renders you create; keep v3 outputs untouched for comparison. Scratch space: ${SCRATCH} (create it).
HONESTY RULE: you cannot watch video in real time or listen. Never claim something "flows", "reads" or "sounds" right from stills or numbers alone; say what you measured and what a human must still check.`

const COLD = (clip, transcript, tag) => `You are a COLD VIEWER and a NEWCOMER. You have never heard of this show, and you must not read any script, plan, bible or source file. Your only inputs are the video ${clip} and the timed transcript ${transcript}.
NEWCOMER LENS (critical): the show parodies real people and companies (for example the Nov 2023 OpenAI board crisis). You probably know that real history; a typical viewer may not. Set it aside completely. Understand only what the show itself puts on screen and in the dialogue. Whenever your understanding of a beat leans on outside knowledge (who someone is, why something matters, what a term means, what really happened), you must flag it, because that beat is not yet told by the show.
Method: with the bundled ffmpeg, extract one frame every 0.5 s and build numbered contact sheets (about 24 frames per sheet, each frame labelled with its timecode) under ${SCRATCH}/${tag}/ using system python3 with PIL. Read every sheet in order alongside the transcript. Then:
1. Retell what happens in this act, in order, in plain language, using ONLY what the show told you (who these people are to the main character, where they are, when, what each side wants, what happened and why).
2. List every moment you were confused or lost (timecode, what confused you: where are we, who is this, what just happened, why did it cut, text too fast to read).
3. List every moment that felt jagged from the pictures and transcript alone (cuts piling up, shots too short to register, sudden jumps between places or visual styles).
4. Say what you think the act's main story point is, and whether the overarching storyline would be clear to someone who knows nothing about the real events.
5. OUTSIDE-KNOWLEDGE LEDGER: list every beat where your understanding came from knowing the real history rather than from the show (timecode, what you filled in, what the show would need to show or say so a newcomer gets it).
Delete your frames and sheets when done. Do not edit any files.`

const INSIDER = (clip, transcript, tag) => `You are an INSIDER VIEWER: you know the real events this show parodies (the Nov 2023 OpenAI board crisis and the people around it) and AI culture very well. Do not read any script, plan, bible or source file. Your only inputs are the video ${clip} and the timed transcript ${transcript}.
Method: with the bundled ffmpeg, extract one frame every 0.5 s and build numbered contact sheets (about 24 frames per sheet, labelled with timecodes) under ${SCRATCH}/${tag}/ using system python3 with PIL. Read every sheet in order with the transcript. Then report, as a knowledgeable viewer with little patience:
1. Every moment that DRAGS, over-explains, repeats what the picture already showed, or spells out what you could infer (timecode, what is redundant, what could go or be folded into a joke or image).
2. Every moment where telling too much kills suspense or a laugh (the show should withhold and let you get there).
3. Every moment that works on two levels (the story for anyone, the reference for insiders) and should be protected.
4. Which references or easter eggs land for you, and any that feel forced or wrong.
Delete your frames and sheets when done. Do not edit any files.`

phase("Diagnose")
await agent(`${AUTH}\n\nSetup only: ${SCRATCH}/transcript-v3.txt was already written by an earlier run; check it exists and is complete (spot-check 5 items against the sources) and only rewrite it if it is missing or wrong. Its spec:  every voiced line and V.O. in the v3 animatic with its start timecode (seconds from the act's start) and speaker, and every on-screen text item longer than 3 words with its time on screen, derived from shots-locked-v3.json, lines.json and the cue sheet. Plain text, one item per line, in time order. Return the path and the number of items.`, { label: "setup:transcript-v3", phase: "Diagnose" })

const [coldV3, insV3, edDiag, sndDiag] = await Promise.all([
  agent(COLD(`${ROOT}/out/ep01/act4/animatic/act4-animatic-v3.mp4`, `${SCRATCH}/transcript-v3.txt`, "cold-v3"), { label: "cold:v3", phase: "Diagnose" }),
  agent(INSIDER(`${ROOT}/out/ep01/act4/animatic/act4-animatic-v3.mp4`, `${SCRATCH}/transcript-v3.txt`, "ins-v3"), { label: "insider:v3", phase: "Diagnose" }),
  agent(`${AUTH}

YOU ARE THE EDITOR (diagnosis; do not edit files except your report). Read flow-and-continuity.md, the Act Four script section, shotlist-v3.md, timing-v3.md and shots-locked-v3.json, and look at the v3 animatic by pulling frames at every cut (make strips under ${SCRATCH}/ed-diag/, delete after).
Write ${ROOT}/show/episodes/ep01/production/act4/diagnosis-v3.md with:
1. The act's MUST-UNDERSTAND list: the 8 to 12 story beats a first-time viewer who knows NOTHING about the real events must come away with, in order (what the audience must know at each point, not what is on screen). For each, note what the show currently relies on outside knowledge for (who Gerg, Alyi, Tasya, Mario, Ttemme and Terb are to Mas; why the board can fire him; what the letter, the tender offer and the return mean) and the cheapest in-show setup that would carry it (a line, a label, a picture, a prior beat, THE PLAN).
2. A sequence map of v3: where each sequence starts and ends, its place, time and question, and where v3 breaks the sequence (register jumps, stray inserts, cross-cuts).
3. Every jagged or confusing point with timecode and cause (cut too soon, text under read time, orientation missing, eyeline or screen-direction break, too many registers, a set-piece that loses its one idea).
4. Your proposed v4 sequence structure (5 to 8 sequences) and, for each, what could play as one longer shot, a camera move instead of cuts, or held coverage.
Return a 300-word summary.`, { label: "diagnose:editor", phase: "Diagnose" }),
  agent(`${AUTH}

YOU ARE THE SOUND SUPERVISOR (diagnosis; do not edit files except your report). Analyse ${ROOT}/out/ep01/act4/animatic/act4-mix-v3.wav, act4-dialogue-premix-v3.wav and act4-mix-v3.cues.json (music, dry, beds, sfx). Measure and map: every music start and stop and fragment length; every hole under -42 dBFS of 0.3 s or more and what caused it (music drop for a dry window, bed gap, stop device); every abrupt level jump; the dialogue gap distribution; which OST cues are used and how (which sections of which cue files). Read the OST bible's Act Four spotting table and the MM-07 to MM-11 cue sheets (read only).
Write ${ROOT}/show/episodes/ep01/production/act4/sound-diagnosis-v3.md with those findings and a v4 SOUND PLAN draft following flow-and-continuity.md sections 3 and 4: per proposed sequence, a continuous cue (which OST material, how it is rendered or edited to length, where it thins under real lines and posts, ducking), the few deliberate music stops the act really wants and why (the Cancel click drop-out is one), the ambience bed per location with crossfades, and the dialogue spacing approach. Return a 300-word summary.`, { label: "diagnose:sound", phase: "Diagnose" }),
])

phase("Plan")
const plan0 = await agent(`${AUTH}

YOU ARE THE SUPERVISING EDITOR. Write ${ROOT}/show/episodes/ep01/production/act4/edit-plan-v4.md: the v4 plan for a fluid, coherent Act Four.
Inputs: flow-and-continuity.md (binding), the Act Four script section, diagnosis-v3.md, sound-diagnosis-v3.md, and these reports.
COLD VIEWER ON v3 (a newcomer with no context): ${coldV3}
INSIDER VIEWER ON v3 (knows the real events; flags drag and over-telling): ${insV3}
Balance the two (flow-and-continuity.md section 5a): clear to the newcomer, suspenseful, and never dragging for the insider. Where they conflict, find a third way (a visual, a joke, a reaction).
EDITOR DIAGNOSIS: ${edDiag}
SOUND DIAGNOSIS: ${sndDiag}
The plan must contain:
1. The must-understand list (final).
2. Sequences (about 5 to 8, whatever the story wants): place, time, the audience's question, the turn, the orienting opening, the visual register, and the bridge into the next sequence. The told-twice structure plays as clear chapters.
3. Shot plan per sequence: each shot with its purpose, size, angle, move, and an approximate length chosen for comprehension and entertainment (the guide's typical lengths are a starting point, not a target). Say which v3 shots merge, lengthen, become a move, or are cut. Reuse existing art and rooms; any new composition must be buildable from existing assets in the animatic code.
4. Script changes, minimal and only for coherence, including every in-show setup a newcomer needs (flow-and-continuity.md section 5a): an orienting line, a label, a restored reaction, a clearer handoff between sides, a character introduced by what they are to Mas. References stay as texture; no beat may depend on knowing the real history. Any new or changed line must be listed exactly, in the script's voice and pace, and flagged as needing a take. Keep every real [V] line verbatim.
5. The sound plan (from the sound supervisor, refined): continuous cues, thinning and ducking under real lines, the deliberate stops, beds, and natural dialogue spacing.
6. The expected runtime as an outcome, with the reason for every added second (orientation, reaction, read time), and what was cut as padding.
Return a 300-word summary.`, { label: "plan:supervising-editor", phase: "Plan" })

const planCrit = await agent(`${AUTH}

YOU ARE AN ADVERSARIAL CRITIC (do not edit files). Read edit-plan-v4.md, flow-and-continuity.md, diagnosis-v3.md, sound-diagnosis-v3.md and the Act Four script. Attack the plan from three sides, as a viewer, not as a rule checker: (a) is it still jagged anywhere (planned cuts, very short shots, music changes, stops, register changes: use counts to find spots, then judge them); (b) is it now slow, padded or over-explained anywhere (a thriller must still move: name every shot, hold, label or line that carries nothing, repeats the picture, or tells an insider what they could infer); (c) will a first-time viewer who knows nothing about the real events follow it (walk the must-understand list against the planned picture and sound, beat by beat, and flag every beat that still leans on outside knowledge). Also check real lines stay verbatim and nothing new breaks the guardrails.
Supervising editor's summary: ${plan0}
Return a numbered list of concrete amendments, most important first.`, { label: "plan:critic", phase: "Plan" })

const plan = await agent(`${AUTH}

YOU ARE THE SUPERVISING EDITOR. Finalize edit-plan-v4.md by applying these amendments (log any you reject, with a reason, in a Critic log section). Then update the "## ACT FOUR" section of ${ROOT}/show/episodes/ep01/script.md to draft 4.0 to match the plan (only the Act Four section; add a short "Act Four, draft 4.0 (the flow pass): what changed" note in the writer's notes, next to the 3.x notes).
CRITIC: ${planCrit}
Return: the final plan summary (300 words), the exact list of new or changed lines needing takes, and the must-understand list.`, { label: "plan:finalize", phase: "Plan" })

phase("Build")
const board = await agent(`${AUTH}

YOU OWN: the picture side of v4. Files: ${ROOT}/show/episodes/ep01/production/act4/{shotlist-v4.md, shots-v4.json, shots-locked-v4.json, timing-v4.md}, ${ROOT}/studio/src/episodes/ep01/act4/animatic/{data-v4.ts and any new v4 layout or framing code}, tools/lock_v4.py, and dialogue takes for NEW or CHANGED lines only (record them with the same TTS voices and method dialogue.md documents; never clone a real voice; put them next to the existing takes and add them to lines.json with the same fields).
FINAL PLAN: ${plan}
1. Record any new or changed lines the plan lists, matching the existing takes' levels and pace.
2. Build shots-v4.json from edit-plan-v4.md, then write lock_v4.py (start from lock_v3.py, but replace its rigid rules with the plan: lines spaced by the plan's dialogue rhythm, cuts placed on story points rather than snapped to the beat grid, set-piece lengths from the plan, text held long enough to read). Where the plan's lengths feel wrong once assembled, adjust them for flow and say so. Produce shots-locked-v4.json and data-v4.ts, and make the animatic entry render v4 (keep v3 renderable).
3. Check the picture: render stills at every cut and a 480x270 contact sheet; fix any shot whose art does not match its purpose.
4. Write timing-v4.md: how the lock places things, the shot-length distribution, the very short shots with their reason, runtime by sequence.
Return a 250-word summary with the runtime and shot statistics.`, { label: "build:board-lock", phase: "Build" })

const sound = await agent(`${AUTH}

YOU OWN: the sound side of v4. Files: a NEW folder ${ROOT}/audio/ost/tracks/e01-act4-v4/ (the continuous to-picture cues for v4), ${ROOT}/studio/src/episodes/ep01/act4/animatic/tools/mix_v4.py, sound-v4.ts, and ${ROOT}/out/ep01/act4/animatic/act4-mix-v4.wav, act4-dialogue-premix-v4.wav, act4-mix-v4.cues.json.
FINAL PLAN: ${plan}
PICTURE LOCK REPORT: ${board}
1. Build the score as continuous performances, one per sequence (or spanning sequences where the plan says), to the exact lengths in shots-locked-v4.json. Prefer rendering each cue to picture with the OST engine from the existing cues' material (read their track.py and scores; the engine is read-only for you; if its API changed under you, adapt). If you must edit existing renders instead, cut on phrase boundaries with crossfades or ring-outs. Avoid short fragments unless they are designed stings on story beats. Under real lines, posts and cards the music usually thins to a pad or pedal and ducks rather than stopping. Keep the plan's deliberate stops, each over room tone and each with a clean re-entry.
2. Ambience: a continuous bed per location, crossfaded across changes; true digital silence only where designed (the drop-out after the Cancel click).
3. mix_v4.py: dialogue on top, music ducked (around -8 to -12 dB with short ramps, by ear-informed judgement), SFX from the board at their frames, loudness to the same targets as v3 (check mix_v3.py).
4. Measure the mix and write the numbers into the cues file: music starts, stops and fragment lengths; holes under -42 dBFS of 0.3 s or more with a cause for each; abrupt level jumps over 15 dB with a cause for each; the dialogue gap distribution; integrated loudness and true peak. Look at every unexplained item and fix the ones that would sound like mistakes.
Return a 250-word summary with those numbers and what needs human ears.`, { label: "build:score-mix", phase: "Build" })

const render = await agent(`${AUTH}

YOU OWN: rendering and the report. Render ${ROOT}/out/ep01/act4/animatic/act4-animatic-v4.mp4 (1080p, the v4 mix muxed in, --concurrency=6 at most) with tools/render.ts (adapt for v4 if needed), plus act4-v4-contact.png (one still per shot, like v3's). Write tools/report_v4.py (from report_v3.py) that reports the flow-and-continuity.md section 5 measurements side by side for v3 and v4 (as diagnostics, not pass/fail): shot count, average and median shot length, very short shots and runs of them, music starts and stops, the shortest music fragment, holes under -42 dBFS, abrupt level jumps, dialogue gaps, runtime by sequence. Save it as ${ROOT}/show/episodes/ep01/production/act4/report-v4.md. Also write ${SCRATCH}/transcript-v4.txt in the same format as transcript-v3.txt (every line with start time and speaker, every on-screen text over 3 words).
Board: ${board}
Sound: ${sound}
Pull frames from the ENCODED mp4 at several cuts to confirm picture and sync. Return a 200-word summary with the v3 vs v4 table.`, { label: "build:render-report", phase: "Build" })

phase("Verify")
const [cold1, ins1, audit1] = await Promise.all([
  agent(COLD(`${ROOT}/out/ep01/act4/animatic/act4-animatic-v4.mp4`, `${SCRATCH}/transcript-v4.txt`, "cold-v4a"), { label: "cold:v4-a", phase: "Verify" }),
  agent(INSIDER(`${ROOT}/out/ep01/act4/animatic/act4-animatic-v4.mp4`, `${SCRATCH}/transcript-v4.txt`, "ins-v4a"), { label: "insider:v4-a", phase: "Verify" }),
  agent(`${AUTH}

YOU ARE THE FLOW AUDITOR (do not edit files except your report). Review the v4 animatic, mix and report-v4.md against the guidance in flow-and-continuity.md sections 1 to 5, measuring the files yourself (recompute; do not trust the report). The question at every spot is whether it plays fluid, clear and entertaining, not whether a number is met: use the numbers to find spots, then judge each one. Also check the build followed edit-plan-v4.md where that helps. Write ${ROOT}/show/episodes/ep01/production/act4/audit-v4.md: every spot that hurts the watching experience, with timecode, why, and a fix; plus any departures from the guidance that help (keep those). Render report: ${render}
Return the list of spots that hurt, most important first.`, { label: "audit:flow-v4", phase: "Verify" }),
])

const fix = await agent(`${AUTH}

YOU ARE THE FINISHING EDITOR. You own every v4 file named above (shots-v4.json, lock_v4.py, shots-locked-v4.json, data-v4.ts, sound-v4.ts, mix_v4.py, the e01-act4-v4 cues, the v4 renders and reports) and the Act Four script section.
Must-understand list and plan: ${plan}
COLD VIEWER ON v4 (a newcomer): ${cold1}
INSIDER VIEWER ON v4 (drag and over-telling): ${ins1}
FLOW AUDIT: ${audit1}
Fix the points where the stranger's retell misses or garbles a must-understand beat, every item in their OUTSIDE-KNOWLEDGE LEDGER that a newcomer would miss, the confusion points that matter, the insider's drag and over-telling points (cut or fold them into images and jokes), and the audit's spots that hurt the watching experience. Balance clarity against suspense and pace; where the two viewers conflict, find a third way. Use judgement: if a fix would make something else worse, log it instead. Re-lock, re-mix, re-render the animatic and the contact sheet, re-run report_v4.py, and rewrite ${SCRATCH}/transcript-v4.txt. Return what you changed and the updated v3 vs v4 table.`, { label: "fix:v4", phase: "Verify" })

const [cold2, ins2] = await Promise.all([
  agent(COLD(`${ROOT}/out/ep01/act4/animatic/act4-animatic-v4.mp4`, `${SCRATCH}/transcript-v4.txt`, "cold-v4b"), { label: "cold:v4-b (fresh)", phase: "Verify" }),
  agent(INSIDER(`${ROOT}/out/ep01/act4/animatic/act4-animatic-v4.mp4`, `${SCRATCH}/transcript-v4.txt`, "ins-v4b"), { label: "insider:v4-b (fresh)", phase: "Verify" }),
])

const final = await agent(`${AUTH}

YOU ARE THE SUPERVISING EDITOR, closing the pass. Compare this fresh stranger's retell against the must-understand list and report honestly.
Must-understand list and plan: ${plan}
FIX REPORT: ${fix}
FRESH COLD VIEWER (newcomer): ${cold2}
FRESH INSIDER VIEWER: ${ins2}
Check especially the stranger's OUTSIDE-KNOWLEDGE LEDGER: the act must be clear to a newcomer. If small fixes remain (a text held too briefly, one confusing cut, a missing setup line or label), make them, re-render and re-run the report. If a real structural confusion remains, do not paper over it: describe it for the showrunner.
Then write ${ROOT}/show/episodes/ep01/production/act4/v4-for-review.md: what changed from v3 and why (in plain language for the showrunner), the v3 vs v4 numbers, the must-understand scorecard (which beats the two newcomers got, and which still leaned on outside knowledge), the insiders' drag list and what was done about it, what a human must still check by watching and listening, and open decisions. Return that file's content.`, { label: "close:v4", phase: "Verify" })

return { plan, board, sound, render, audit1, fix, final }
