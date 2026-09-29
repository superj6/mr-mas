export const meta = {
  name: "mrmas-dialogue-v5",
  description: "Let conversations play out: diagnose v4 dialogue, update the dialogue guide, rewrite Act Four with real scenes, table-read critics, re-record at natural pace, recut with holding coverage, verify with newcomer/insider/dialogue reads; then the same dialogue pass on the Ep1-3 teleplays",
  phases: [
    { title: "Diagnose", detail: "dialogue diagnosis, craft reference, voice/delivery diagnosis" },
    { title: "Guide", detail: "rewrite the dialogue rules in tone-and-dialogue.md" },
    { title: "Write", detail: "Act Four draft 5.0, table-read critics, revise" },
    { title: "Build", detail: "record, board + lock, score + mix, render + report" },
    { title: "Verify", detail: "newcomer, insider, dialogue and flow reads; fix; fresh reads; close" },
    { title: "Teleplays", detail: "Ep1 Acts 1-3 + tag, Ep2, Ep3 dialogue pass, critics, fixes" },
  ],
}

const ROOT = "/home/jgon/project/art/mrmas"
const SCR = "/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad"
const FF = `${ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg (set LD_LIBRARY_PATH to that folder)`
const AUTH = `AUTHORIZATION. The showrunner (the user) watched Act Four v4 and said, verbatim:
> "it is getting cloesr. however, a lot of the dialoge is unnatural and the cuts are still quite fast. a few time dialogue seems to randomly blurt out or cut off. it seems since v2 you didn't allow any conversation to play out for more than a few seconds which makes it hard to follow. i said to cut down empty time, but not to cut every dialogue into only a few words per character"
LIVE NOTES: before anything else read ${ROOT}/show/production/SHOWRUNNER-NOTES.md (all current showrunner notes; newest win; it may be updated while you work) and ${ROOT}/show/bible/flow-and-continuity.md (guidance: sequences, holding coverage, continuous sound, newcomer and insider balance, and the new section 4 on letting conversations play out).
LEAD'S MEASUREMENTS OF v4: 45 lines, 176 words of dialogue in 4:11; median 4 words per line; 21 lines of three words or fewer; 5 lines cut off with a dash; 21 exchanges averaging 2 lines; the longest conversation 10 s; dialogue under 26% of the runtime. The Ep1 Acts 1-3, Ep2 and Ep3 teleplays show the same pattern (median 3 to 4 words per line, about half the lines three words or fewer). Cause: the post-v2 tightening pass cut talk instead of dead time, and tone-and-dialogue.md's rule 6 "Collide, don't volley" (overlaps, cut-offs, one quiet line) plus its checklist item demanding an overlap or cut-off in every scene pushed every exchange toward quips.
You are AUTHORIZED to edit the files your task names, record, render and measure. Do not ask questions and do not stop at a proposal. Nothing gets committed.
FIRM: the real guardrails in ${ROOT}/show/bible/guardrails.md; parody names only (show/bible/naming.md); real quotes stay verbatim with their tags; invented dialogue is marked [INVENTED] in scripts; never clone a real person's voice; no on-screen "speculative" labels; Ep1 never spoils the firing before it happens (Act Four is the firing's own act); limited third person through Mas (show/bible/pov-clarification.md), with Act Four's one signposted exit being the board's pass. Everything else is guidance: flow and entertainment first.
PROJECT: Act Four of Ep1 ("THE BLIP, told twice") is the "## ACT FOUR" section of ${ROOT}/show/episodes/ep01/script.md (now draft 4.2). Production: ${ROOT}/show/episodes/ep01/production/act4/ (edit-plan-v4.md, shotlist-v4.md, shots-locked-v4.json, timing-v4.md, report-v4.md, audit-v4.md, v4-for-review.md, dialogue.md, diagnosis-v3.md, the draft-2 appendix at the end of script.md). Code: ${ROOT}/studio/src/episodes/ep01/act4/animatic/ (shots4.ts, data-v4.ts, sound-v4.ts, tools/board_v4.py, lock_v4.py, mix_v4.py, report_v4.py, shotlist_v4.py, render.ts). v4 outputs: ${ROOT}/out/ep01/act4/animatic/act4-animatic-v4.mp4, act4-animatic-v4-picture.mp4, act4-mix-v4.wav, act4-mix-v4.cues.json. Takes: see dialogue.md (Kokoro-82M stock voices; lines.json). Music: ${ROOT}/audio/ost/ (engine read-only; v4 cues in audio/ost/tracks/e01-act4-v4/). Audio venvs under ${ROOT}/audio/.venv*. Bundled ffmpeg: ${FF}.
HYGIENE: work only in your own scratch subfolder ${SCR}/dlg5-<your-label>/ (create it); never delete or overwrite anything you did not create. Keep all v4 files untouched for comparison. Render 1080p max, --concurrency=6 at most. Disk is about 97 to 98 percent full (about 8 to 9 GB free): delete your own scratch; if free space falls under 5 GB, stop and report. ${ROOT}/show/episodes/ep01/script.md is shared: edit it ONLY with the Edit tool, re-reading before each edit, never by rewriting the whole file or with a shell script.
HONESTY: you cannot watch in real time or listen. Say what you measured and what a human must check. Never call a cut locked or complete on numbers alone.`

const NEWCOMER = (clip, tr, tag) => `You are a COLD VIEWER and a NEWCOMER. You have never heard of this show; do not read any script, plan, bible or source file. Inputs: the video ${clip} and the timed transcript ${tr} (it names a speaker only once the picture has).
NEWCOMER LENS: the show parodies real people and events (the Nov 2023 OpenAI board crisis). Set that knowledge aside completely; understand only what the show tells you, and flag every beat where you leaned on outside knowledge.
Method: with ${FF}, extract a frame every 0.5 s into ${SCR}/dlg5-${tag}/ and build numbered, timecoded contact sheets (about 24 per sheet) with system python3 and PIL; read them in order with the transcript. Then report: (1) your retell of the act using only what the show told you; (2) every confusion (timecode, what, why); (3) every place the dialogue felt unnatural, blurted with no setup, or was cut off so you lost the thought; (4) every place a conversation was cut too fast to follow; (5) an OUTSIDE-KNOWLEDGE LEDGER. Delete your frames. Do not edit files.`
const INSIDER = (clip, tr, tag) => `You are an INSIDER VIEWER who knows the real events and AI culture very well and has little patience. Do not read any script, plan, bible or source file. Inputs: the video ${clip} and the transcript ${tr}. Method: frames every 0.5 s into ${SCR}/dlg5-${tag}/ with ${FF}, timecoded contact sheets with system python3 and PIL, read in order with the transcript. Report: (1) every moment that drags, over-explains or repeats; (2) where telling too much kills suspense or a laugh; (3) where a conversation feels written rather than spoken (stiff, expository, quippy); (4) the moments that work on two levels and must be protected. Delete your frames. Do not edit files.`

phase("Diagnose")
const [dDiag, dCraft, dVoice] = await Promise.all([
  agent(`${AUTH}

YOU ARE THE DIALOGUE EDITOR (diagnosis). Read the Act Four draft 4.2 script section, shots-locked-v4.json (audio_cues and lines_gaps), the v4 timed transcript if present in production/act4 or rebuild one from the lock, v4-for-review.md, and the draft-2 appendix at the end of script.md (a longer earlier draft with more talk). Write ${ROOT}/show/episodes/ep01/production/act4/dialogue-diagnosis-v4.md:
1. For each sequence: what the scene is about, who talks to whom, every line with its word count, where a line blurts with no setup, where a thought is cut off, where the exchange stops before it resolves, where a quip replaces a real response.
2. The conversations this act should let play out (for example the board's call and deliberations, Mas and Gerg, Mas and Tasya's offer, the board's committee, Mas and Alyi, the return negotiation), with what each conversation must carry for a newcomer (the why of the firing as the board sees it, the failed return talks, the staff letter's threat, what Q* is) and a rough length.
3. Material from draft 2 worth restoring.
Return a 250-word summary.`, { label: "diagnose:dialogue", phase: "Diagnose" }),
  agent(`${AUTH}

YOU ARE A SCRIPT CONSULTANT (craft reference). Write ${ROOT}/show/_sources/research/dialogue-craft.md: how prestige thriller and satire shows write and stage conversations that feel natural and still move fast. Cover Succession (board and phone scenes), Mr. Robot, The Social Network (the deposition and the Winklevoss scenes), Silicon Valley (board scenes), Veep, Better Call Saul, The Big Short, Barry, Fleabag. For each: typical exchange lengths, line lengths, how overlaps and interruptions are used and how rarely, how exposition hides inside conflict, how scenes are covered (holds, walk-and-talks, two-shots, cutting on turns), and one or two short illustrative descriptions (do not quote long copyrighted passages; paraphrase and cite). End with 15 concrete rules for MR. MAS dialogue, including how to write natural speech (contractions, indirect answers, specific details, people talking past each other) and how to keep it brisk without clipping it. Return a 200-word summary.`, { label: "diagnose:craft", phase: "Diagnose" }),
  agent(`${AUTH}

YOU ARE THE DIALOGUE RECORDING SUPERVISOR (diagnosis). Read dialogue.md and lines.json, then analyze the v4 takes: which lines were time-compressed and by how much, speaking rate per character, pitch and energy variation (flat prosody), abrupt starts and ends (no breath or room before or after), gaps inside exchanges, and how lines were split or joined. Then run a small bake-off on 6 representative lines: (a) the current takes; (b) Kokoro at a natural pace with no time-stretching, whole sentences, punctuation shaped for prosody, per-line speed chosen by intent; (c) if disk allows (keep 5 GB free) and it installs cleanly into a venv, an automatic naturalness predictor (for example a UTMOS/SpeechMOS model) to score (a) versus (b). Do not install large new TTS models. Write ${ROOT}/show/episodes/ep01/production/act4/voice-diagnosis-v4.md with the findings and a recording method for v5 (per-character pace ranges as guides, how to shape text, how to add natural breaths and room, how to handle overlaps). Return a 200-word summary.`, { label: "diagnose:voice", phase: "Diagnose" }),
])

phase("Guide")
const guide = await agent(`${AUTH}

YOU OWN ${ROOT}/show/bible/tone-and-dialogue.md. Rewrite its dialogue rules so they produce natural conversations that play out (keep everything else in the guide). In particular: replace rule 6 "Collide, don't volley" and the checklist item that demands an overlap or cut-off with guidance where overlaps, cut-offs and one-liners are rare seasoning; add a rule that conversations run as long as the scene needs, with complete thoughts; add "cut empty time, not talk"; add "no blurts" (every line has a reason, to someone, now); keep the brisk delivery and subtext rules; keep the ban on clunky exposition but show how exposition hides inside conflict. Use these inputs:
DIALOGUE DIAGNOSIS: ${dDiag}
CRAFT REFERENCE (read ${ROOT}/show/_sources/research/dialogue-craft.md): ${dCraft}
Quote the showrunner's note at the top of the changed section. Write numbers only as guides. Return a 200-word summary of the new rules.`, { label: "guide:dialogue-rules", phase: "Guide" })

phase("Write")
const draft = await agent(`${AUTH}

YOU ARE THE HEAD WRITER. Rewrite the "## ACT FOUR" section of ${ROOT}/show/episodes/ep01/script.md as draft 5.0 so its conversations play out naturally, following the updated tone-and-dialogue.md and flow-and-continuity.md. Keep the act's structure where it works (the eight sequences, told twice: his side, the board's side, what they didn't know, the return, the coda), the must-understand list in v4-for-review.md section 4, the jokes and set-pieces that land (the insider's protected list in v4-for-review.md section 5), and every real quote verbatim with its tag. Build real scenes: let people speak in complete thoughts and answer each other; let the board's deliberation, Mas and Gerg, Tasya's offer, the committee, Mas and Alyi, and the return negotiation run as conversations of the length they need (many 20 to 60 s, some longer); fill the newcomer gaps through conversation and conflict rather than captions (why the board acted, as they see it and as reported; that the return talks failed; the staff letter's threat; what Q* is, if it stays). Cut visual clutter, redundant plates and dead holds to make room; keep overlaps and cut-offs rare and motivated; no blurts. Runtime is an outcome; expect the act to grow, and justify every minute by story. Mark invented lines [INVENTED]. Add "Act Four, draft 5.0 (the conversation pass): what changed" to the writer's notes next to the 4.x notes.
Inputs: DIALOGUE DIAGNOSIS: ${dDiag} | NEW RULES: ${guide} | VOICE NOTES: ${dVoice}
Return: a scene-by-scene summary with estimated lengths, total estimated runtime, the full list of lines (speaker, text, [V]/[INVENTED]), and what you cut.`, { label: "write:act4-draft5", phase: "Write" })

const TR = [
  { key: "naturalness", p: "DIALOGUE NATURALNESS (a script editor doing a table read in their head): go line by line through the Act Four draft 5.0 section. Flag every line no real person would say that way (stiff, written, over-articulate, quippy for its own sake, exposition dumped), every blurt with no setup, every cut-off that loses the thought, every exchange that ends before it resolves, and every place characters speak in the same voice. Give a rewrite for each." },
  { key: "newcomer", p: "NEWCOMER READER: set aside all knowledge of the real events. Read the Act Four draft 5.0 section as the audience would meet it (after reading the Cold Open and Acts One to Three for context). Retell what happens using only the page. List every beat that still leans on outside knowledge, and every conversation you could not follow, with the cheapest in-scene fix." },
  { key: "insider", p: "INSIDER READER: you know the real events well. Read the Act Four draft 5.0 section and flag every place it drags, over-explains, repeats, or talks where a look would do; every place a conversation runs past its turn; and the beats that work on two levels to protect. Keep in mind the showrunner wants conversations to play out: flag length only where it carries nothing." },
  { key: "facts", p: "FACTS AND GUARDRAILS: check every [V] line against its facts row (show/episodes/ep01/facts.md) and the research in show/_sources/research/, every reported claim for a tag, every invented line for guardrail risk (invented words in a real person's parody mouth must not read as a factual accusation; see guardrails.md), and every name against naming.md." },
]
const reads = await Promise.all(TR.map(t => agent(`${AUTH}

YOU ARE A TABLE-READ CRITIC. ${t.p} Do not edit files. Head writer's summary: ${draft}
Return a numbered list of findings with fixes, most important first.`, { label: `tableread:${t.key}`, phase: "Write" })))

const script5 = await agent(`${AUTH}

YOU ARE THE HEAD WRITER, revising. Apply these table-read findings to the Act Four draft 5.0 section (log what you decline, with a reason, in the draft 5.0 writer's note). Then write ${ROOT}/show/episodes/ep01/production/act4/edit-plan-v5.md: the sequences, each scene's conversation and how it should be covered (holding coverage: two-shots, over-the-shoulders, singles cut on real turns, slow moves; conversations are not cut per line), the must-understand list, the music plan (continuous per sequence; under conversation it thins and ducks), and the full line list with speakers, text, tags and intended delivery (intent, pace, pauses) for the recording.
NATURALNESS: ${reads[0]}
NEWCOMER: ${reads[1]}
INSIDER: ${reads[2]}
FACTS: ${reads[3]}
Return the final scene summary, estimated runtime, and the line count and word count.`, { label: "write:act4-final", phase: "Write" })

phase("Build")
const teleplayP = (async () => {
  phase("Teleplays")
  const EPS = [
    { key: "ep01", files: "the COLD OPEN, ACT ONE, ACT TWO, ACT THREE and TAG sections of show/episodes/ep01/script.md (Edit tool only; never touch ## ACT FOUR, the Act Four writer's notes or the appendix), plus show/episodes/ep01/open-questions.md" },
    { key: "ep02", files: "show/episodes/ep02/script.md and show/episodes/ep02/open-questions.md" },
    { key: "ep03", files: "show/episodes/ep03/script.md and show/episodes/ep03/open-questions.md" },
  ]
  const first = await Promise.all(EPS.map(e => agent(`${AUTH}

YOU ARE THE ${e.key.toUpperCase()} DIALOGUE WRITER. You own exactly: ${e.files}. Apply the same conversation pass Act Four just got: read the updated ${ROOT}/show/bible/tone-and-dialogue.md, ${ROOT}/show/_sources/research/dialogue-craft.md, and the Act Four draft 5.0 section of show/episodes/ep01/script.md as the model of the new voice. Rewrite dialogue scenes so conversations play out with complete thoughts and real back-and-forth, keeping every beat, fact, real quote (verbatim, tagged), joke that lands and the episode's structure; turn quip ladders into conversations; cut dead holds and redundant visual business to pay for talk; keep overlaps and cut-offs rare and motivated; no blurts. Update shot directions to holding coverage for conversations. Update the script's runtime notes (runtime is an outcome). Add a "Revision log (conversation pass)" at the end of the writer's notes.
Act Four summary for context: ${script5}
Return what changed per scene, the new line and word counts, and the estimated runtime.`, { label: `teleplay:${e.key}`, phase: "Teleplays" })))
  const crit = await Promise.all([
    agent(`${AUTH}

YOU ARE A DIALOGUE-NATURALNESS CRITIC for the Ep1 (cold open, Acts One to Three, tag), Ep2 and Ep3 scripts after their conversation pass. Flag stiff, written, over-articulate, quippy or expository lines, blurts, cut-offs that lose the thought, conversations that stop before they resolve, and same-voice characters. Give rewrites. Do not edit files. Group findings by episode. Writers' reports: ${first.join("\n---\n")}`, { label: "teleplay-critic:naturalness", phase: "Teleplays" }),
    agent(`${AUTH}

YOU ARE A NEWCOMER-AND-INSIDER CRITIC for the Ep1 (cold open, Acts One to Three, tag), Ep2 and Ep3 scripts after their conversation pass. First as a newcomer (set aside the real events): retell each episode from the page and list what leans on outside knowledge. Then as an insider: list what drags or over-explains, but remember the showrunner wants conversations to play out; flag length only where it carries nothing. Do not edit files. Group findings by episode.`, { label: "teleplay-critic:newcomer-insider", phase: "Teleplays" }),
    agent(`${AUTH}

YOU ARE THE FACTS AND GUARDRAILS CRITIC for the Ep1 (cold open, Acts One to Three, tag), Ep2 and Ep3 scripts after their conversation pass: every [V] line against facts.md and the research, reported claims tagged, invented lines checked against guardrails.md, names against naming.md. Do not edit files. Group findings by episode.`, { label: "teleplay-critic:facts", phase: "Teleplays" }),
  ])
  return await Promise.all(EPS.map((e, i) => agent(`${AUTH}

YOU ARE THE ${e.key.toUpperCase()} DIALOGUE WRITER (second pass). You own exactly: ${e.files}. Your first-pass report: ${first[i]}
Apply every finding for ${e.key} below (log declines with reasons in your revision log), then re-read your script end to end.
NATURALNESS: ${crit[0]}
NEWCOMER AND INSIDER: ${crit[1]}
FACTS: ${crit[2]}
Return what you fixed and the final line count, word count, median words per line, longest conversation, and estimated runtime.`, { label: `teleplay-fix:${e.key}`, phase: "Teleplays" })))
})()

const rec = await agent(`${AUTH}

YOU ARE THE DIALOGUE RECORDING SUPERVISOR. Record every line in edit-plan-v5.md's line list (new and changed lines; re-record kept lines too if the v5 method gives a clearly more natural read) with the method in voice-diagnosis-v4.md: Kokoro stock voices already cast per character in dialogue.md (never a cloned voice), natural pace, no time-stretching, whole sentences, text shaped for prosody, natural breaths and room at heads and tails. Write the takes and a lines-v5.json next to the existing takes (keep v4 untouched), with the same fields plus intended pace and measured wpm. Run the QA the dialogue pipeline already has (level, true peak, clipping, trims, cut-off ends), plus the naturalness predictor if the voice diagnosis set one up. Return a summary: lines, words, audible time, per-character wpm, flagged takes.
Plan summary: ${script5}`, { label: "build:record", phase: "Build" })

const board = await agent(`${AUTH}

YOU OWN the v5 picture: production/act4/{shotlist-v5.md, shots-v5.json, shots-locked-v5.json, timing-v5.md} and studio code {shots5.ts, data-v5.ts, tools/board_v5.py, tools/lock_v5.py, tools/shotlist_v5.py} (start from the v4 versions). Build the board from edit-plan-v5.md and lock it to the v5 takes (lines-v5.json): conversations covered with holding shots (two-shots and over-the-shoulders that carry several lines, singles cut on real turns, slow pixel-step moves instead of cuts where a scene builds); reply gaps by intent (quick replies about 0.2 to 0.6 s, loaded ones longer, overlaps only where written); no cut every line; text held for read time. Keep v4 renderable. Check stills at every cut at full size and 480x270 and fix any shot whose art does not serve its purpose. Write timing-v5.md with the shot-length distribution, the longest held conversation shots, words per line, and exchange lengths. Return a 250-word summary with runtime and those statistics.
Recording summary: ${rec}`, { label: "build:board-lock", phase: "Build" })

const sound = await agent(`${AUTH}

YOU OWN the v5 sound: a new folder ${ROOT}/audio/ost/tracks/e01-act4-v5/ (start from e01-act4-v4, including the MM-11 LEVERAGE notch fix noted in SHOWRUNNER-NOTES.md), studio tools/mix_v5.py and sound-v5.ts, and out/ep01/act4/animatic/act4-mix-v5.wav, act4-dialogue-premix-v5.wav, act4-mix-v5.cues.json. Build continuous cues per sequence to the v5 lock; under conversations the music thins (no melody, a pad or pedal) and ducks so the talk is easy to follow, and some conversations may play over room tone with only a low bed; the few deliberate stops land on story beats over room tone; beds per location are continuous. Mix dialogue clearly on top. Measure music runs and stops, holes under -42 dBFS of 0.3 s or more, abrupt level jumps, loudness and true peak, and fix whatever would sound like a mistake. Return a 200-word summary with the numbers.
Board summary: ${board}`, { label: "build:score-mix", phase: "Build" })

const render = await agent(`${AUTH}

YOU OWN rendering and the report: render out/ep01/act4/animatic/act4-animatic-v5.mp4 (editor margin plus transcript band) and act4-animatic-v5-picture.mp4 (picture only) with the v5 mix muxed, plus act4-v5-contact.png. Write tools/report_v5.py (from report_v4.py) reporting v3, v4 and v5 side by side: shots, mean and median shot length, shots under 1.5 s, words of dialogue, lines, median words per line, lines of three words or fewer, cut-off lines, exchanges and their lengths, the longest conversation, dialogue share of runtime, music runs and stops, holes, jumps, loudness; save report-v5.md. Write ${SCR}/dlg5-render/transcript-v5.txt (every line with start time and a speaker name only once the picture has named them; every on-screen text over 3 words). Pull frames from the encoded mp4 at several cuts to confirm picture and sync. Return the v3/v4/v5 table.
Board: ${board} | Sound: ${sound}`, { label: "build:render-report", phase: "Build" })

phase("Verify")
const V5 = `${ROOT}/out/ep01/act4/animatic/act4-animatic-v5-picture.mp4`, T5 = `${SCR}/dlg5-render/transcript-v5.txt`
const [n1, i1, d1] = await Promise.all([
  agent(NEWCOMER(V5, T5, "newcomer-a"), { label: "read:newcomer-a", phase: "Verify" }),
  agent(INSIDER(V5, T5, "insider-a"), { label: "read:insider-a", phase: "Verify" }),
  agent(`${AUTH}

YOU ARE THE DIALOGUE AND FLOW AUDITOR (do not edit files except your report). Using the v5 files, transcript-v5.txt, report-v5.md and the Act Four draft 5.0 script: (1) re-measure the dialogue statistics yourself; (2) go conversation by conversation and judge whether each plays out naturally (complete thoughts, real answers, no blurts, cut-offs rare and motivated, coverage that holds rather than cutting every line); (3) check the mix for anything that would sound like a mistake (holes, jumps, music fragments, music masking talk); (4) check the picture for cuts that come too fast for the conversation. Write production/act4/audit-v5.md with every spot that hurts, with timecode and fix. Render report: ${render}`, { label: "audit:dialogue-flow", phase: "Verify" }),
])

const fix = await agent(`${AUTH}

YOU ARE THE FINISHING EDITOR. You own every v5 file (script Act Four section via the Edit tool, lines-v5.json and takes, shots-v5.json, lock_v5.py, shots-locked-v5.json, data-v5.ts, sound-v5.ts, mix_v5.py, the e01-act4-v5 cues, the v5 renders and reports). Fix what the reads found: newcomer confusions and outside-knowledge gaps that matter, the insider's drag (while letting conversations play out), and every audit spot that hurts. Re-record any line that needs it, re-lock, re-mix, re-render, re-run report_v5.py and rewrite transcript-v5.txt.
NEWCOMER: ${n1}
INSIDER: ${i1}
AUDIT: ${d1}
Return what you changed and the updated v3/v4/v5 table.`, { label: "fix:v5", phase: "Verify" })

const [n2, i2] = await Promise.all([
  agent(NEWCOMER(V5, T5, "newcomer-b"), { label: "read:newcomer-b (fresh)", phase: "Verify" }),
  agent(INSIDER(V5, T5, "insider-b"), { label: "read:insider-b (fresh)", phase: "Verify" }),
])

const close = await agent(`${AUTH}

YOU ARE THE SUPERVISING EDITOR, closing. Compare the fresh reads to the must-understand list in edit-plan-v5.md. Make small remaining fixes (re-render and re-report if you do); describe real structural problems honestly rather than papering over them. Then write ${ROOT}/show/episodes/ep01/production/act4/v5-for-review.md for the showrunner in plain language: what changed from v4 and why (the conversation pass), the v3/v4/v5 numbers (including words, words per line and the longest conversation), the must-understand scorecard, the insiders' drag list and what was done, what a human must check by watching and listening (with timecodes), and open decisions. Return that file's content.
FIX REPORT: ${fix}
FRESH NEWCOMER: ${n2}
FRESH INSIDER: ${i2}`, { label: "close:v5", phase: "Verify" })

const teleplays = await teleplayP
return { close, teleplays }
