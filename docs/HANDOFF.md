# MR. MAS: handoff for the next agent

> **Continuation update, 2026-10-13:** Episode 3 now has a complete unpublished Codex first cut, **20:03.00**, at `out/ep03/v1/ep03-v1.mp4`. Read its [DELIVERY.md](../show/episodes/ep03/production/v1/DELIVERY.md), [watchlist](../show/episodes/ep03/production/v1/assembly/watchlist-film.md) and [production README](../show/episodes/ep03/production/v1/README.md) before changing it. New dialogue uses local Kokoro stock voices. The user explicitly authorized sending Ep3 dialogue to ElevenLabs, but automatic approval review still rejected it under the platform's restriction on private text sent to an untrusted destination; **0 requests / 0 credits**. No further user confirmation is pending. Do not retry or route around this restriction; a future paid pass requires the platform's destination-trust restriction to change. Episode 1 remains locked and Episode 2 remains unchanged. Episodes 4–12 are still drafts. The original kickoff and Ep3 findings below describe the starting state and build brief; they do not mean Ep3 is still unbuilt.

> **Written 2026-10-13, after Episode 2 v1 was finished.** This is for an agent (Claude Code, Codex or anything else) picking up the show with no memory of earlier sessions. It covers:
> - what's done;
> - what "continue" means;
> - how the showrunner works;
> - the rules that never bend;
> - what to read, in order;
> - how Episode 2 was made, as the template for Episode 3;
> - the traps already found.
>
> It points to the files that hold the detail rather than repeating them. Where this file and a newer showrunner note disagree, the note wins.

**Contents:** [0. Kickoff prompt](#0-a-kickoff-prompt-to-paste) · [1. Where things stand](#1-where-things-stand) · [2. What "continue" means](#2-what-continue-means) · [3. How the showrunner works](#3-how-the-showrunner-works) · [4. Rules that never bend](#4-rules-that-never-bend) · [5. Read order](#5-read-order) · [6. How Ep2 was made](#6-how-ep2-was-made-the-template) · [7. Starting Ep3](#7-starting-episode-3) · [8. The machine and the tools](#8-the-machine-and-the-tools) · [9. Traps already found](#9-traps-already-found) · [10. Waiting on the showrunner](#10-waiting-on-the-showrunner) · [11. Map](#11-map)

---

## 0. A kickoff prompt to paste

Give the new agent this, plus one of the three lines at the end:

```text
You're continuing MR. MAS, an animated pixel-art parody thriller about the AI race, built entirely in code,
in /home/jgon/project/art/mrmas (git: github.com/superj6/mr-mas, branch main). Read docs/HANDOFF.md first
and follow it: it says what's done, what's next, the rules that never bend, and the order to read things in.
Episode 1 is published and locked: never change anything of it. Episode 2 v1 is finished but not published.
This laptop has frozen under memory pressure before: every heavy job goes through ops/heavy.sh.

<one of:>
A) Make Episode 3 in one go, entirely on your own judgement, the way Ep2 v1 was made (HANDOFF §6-7).
B) Start Episode 3: write the LEARNINGS check, the AUDIT and the scene-by-scene proposal, then stop for my agreement.
C) Here are my notes from watching Episode 2: ... (fix them per scene; HANDOFF §2.1).
```

---

## 1. Where things stand

| | State | Where |
|---|---|---|
| **Episode 1** `ep1.0_research_preview.md` | **Published 2026-09-29 and LOCKED.** 23:31.58. https://youtu.be/fXcFKn-pL1I. The showrunner: "also to be clear we shouldn't make any changes to episode 1" | master `out/ep01/full-v3/ep01-v35.mp4` (git-ignored); proof it's unchanged: `sha1sum -c ops/reorg/ep01-final.sha1` → 31 OK; production record `show/episodes/ep01/production/full-v3/` |
| **Episode 2** `ep1.1_her.wav` | **v1 finished 2026-10-11 and not published.** 23:31.00, md5 `2a6affb88c14f25ff3735935639bc15a`, assembled at commit 0136292. **No human has watched or heard it.** Release copy, chapters and five thumbnails are ready. Publishing and `EPISODES.md` are the showrunner's | master `out/ep02/v1/ep02-v1.mp4` (git-ignored); read [DELIVERY.md](../show/episodes/ep02/production/v1/DELIVERY.md) first; release copy [release.md](../show/episodes/ep02/release.md); production record `show/episodes/ep02/production/v1/` |
| **Episodes 3–12** | **Drafted, not built.** Each folder has an outline, beats, flashbacks, facts, gags, an intro slot and open questions. Ep3 also has a full teleplay (draft 3.6, 2026-09-26), which predates most of the lessons (§7.2) | `show/episodes/epNN/`; status table in [show/INDEX.md](../show/INDEX.md) (dated 2026-09-25) |
| **Shared assets** | Done: the 30 s opening, the theme (four variations; V1 "Chip Chamber Jazz" airs), the OST engine, about 300 SFX and beds, the ElevenLabs cast, the pixel engine, cast rigs, rooms and kits, outro B | [README.md](../README.md) "How it's made"; [PIPELINE.md](PIPELINE.md) |
| **Extra** | The main title as one page of solo-piano sheet music (LilyPond source, PDF, PNG). LilyPond isn't installed: install 2.24 to re-engrave | `audio/theme/sheet/` |

The last commits are `553e9b0` (Ep2's records) and `2343898` (the sheet music). Nothing is running: no workflow, no agent, no render. Other `claude` and `codex` processes on the machine belong to the showrunner's other sessions and projects. **Never kill them.**

---

## 2. What "continue" means

### 2.1 Episode 2's watch-through (likely first)

The showrunner will watch Ep2 and may send notes. [DELIVERY.md](../show/episodes/ep02/production/v1/DELIVERY.md) lists what to check by timecode, the nine story notes left for them, and **"How to request changes"**. In short:
- **Picture only** (a drawing, a framing, a colour): edit the scene's module under `studio/src/episodes/ep02/pixel/<act>/scenes/`, then:
  1. `ops/rebuild-act.sh --ep 2 <act> --scene <id> --from picture`
  2. `--only picture`
  3. `--only film`
- **On-screen text the lock carries:** a text-only relock first (`_spec.py` → `_build.py --write` → `--only lock`).
- **A line or a timing change:** re-lock the act with `ops/rebuild-act.sh --ep 2 <act>`. New words need an ElevenLabs take, which costs credits. Later chapters move.
- **Shot ids and film times** are in `shots-<act>.md` and `assembly/transcript-film.txt`.

**After any change:**
- Re-assemble the film (assemble, qa, seam_frames).
- Update the md5, the size and the commit in DELIVERY.md and release.md.
- Re-check Ep1 (31 OK).

Treat a "why is X there?" as a question, not a cut order (§3).

### 2.2 Episode 3, then the rest

The plan is to publish Ep2 after the watch-through, then make Ep3 ([README](../README.md) "Where things stand"). §6 is how Ep2 was made; §7 is what's specific to Ep3. Eps 10–12 are extrapolated past Sep 2026; Ep10's dated anchors must be re-verified the week they happen ([INDEX](../show/INDEX.md), still-open item 4).

---

## 3. How the showrunner works

The showrunner (credited "prompt: jgon") directs; agents build. Use they/them. Their notes, verbatim and dated, are in [SHOWRUNNER-NOTES.md](../show/production/SHOWRUNNER-NOTES.md), newest first.

**When to ask and when to act:**
- **Default: agree before acting** (from 2026-09-28). Turn notes into a written proposal: what changes, draft lines, placement, transitions, runtime, and A/B choices with a recommendation. Then wait for explicit agreement before any agent scripts, records, locks or renders. For an episode's final pass, the agreement is on the **full flow, scene by scene**.
- **Exception: a "one go" build** (2026-10-10/11). When asked to make a whole episode "in one go", don't ask and don't present options. The showrunner: "you are supposed to still finish entirely on your judgement".
  - Fix what's cheap and clearly better.
  - Put story-level judgement calls and every ear/eye check in the delivery note (`DELIVERY.md`) for the watch-through.
- **Run fixes in parallel, by act ownership.** A sequential fix plan drew "why 3-4 hours for these??".
- **"Why is X there?" is a question.** Explain X and offer options. A deepfake the showrunner liked was once cut on a question.
- **Read notes in proportion.**
  - A note names a symptom in one place: fix that kind of thing, and don't swing the whole episode.
  - "To be clear" means we overshot.
  - The balanced targets are in [calibration.md](../show/bible/calibration.md).
- **Guidelines, not hard rules.** Craft numbers are guides. Break one when it plays better, and say why. Only the FIRM rules (§4) never bend.
- **Ask for resources** when work is slow or quality could rise: compute, human viewers, voices, video-model credits. In a one-go run, list the ask and don't block on it.
- **Be honest about what was checked.**
  - Tag claims [M] measured or [J] judged.
  - Nothing here watches in real time: never call a cut "done" on metrics alone, and list what a human must check.
- **Usage.** The showrunner is on a weekly plan limit. Save by efficiency, never by cutting plans:
  - fewer status turns that re-read long context;
  - no redundant re-renders;
  - combined reviews;
  - briefs that point to files.
- **Don't leave agents idle.** If asked what's running, say exactly what is running and what has finished.

**The creative brief, condensed.** Each item has its source, and the binding version is [Ep2's LEARNINGS.md](../show/episodes/ep02/production/v1/LEARNINGS.md).
- **Story:**
  - A fluid thriller that happens to be funny, about **Mas's rise, driven by his moves**. It's a story, not a documentary: no disclaimers or hedge labels on screen.
  - **Mas is the hinted mastermind.**
    - His lowercase V.O. is his plan: the higher-level goal, read as ordinary first time and as foresight on a rewatch. About 14–18 lines.
    - Never on the nose: no "plan", "long game" or "all along".
  - The rival leaders scheme too.
- **Scenes:**
  - Scenes play as want → obstacle → turn → cost, with **arrival and aftermath**, sound-led transitions (J/L cuts) and a matched object.
  - Conversations play out (20–90 s).
  - Every turn's cause comes before it.
  - Nothing corny.
- **Season:**
  - **One ML concept per episode at most**, inside a scene, never a lecture. The map is [ml-concepts.md](../show/bible/ml-concepts.md).
  - One motive flashback (45–90 s) per episode, plus micros.
  - Clear to a newcomer, with no drag for insiders.
- **Look and sound:**
  - Pixel art first.
  - Style leaps keep their contrast (no grade-matching).
  - The score keeps its own identity: the knee motif, chip, jazz colour, no-third chords, 96 BPM. Fix only a named cue.
- **The intro's typed quote never changes:** "near the singularity; unclear which side." in every episode, picture and sound. Per-episode changes touch only the other slot items (§7.3).
- **Spoiler-free marketing:** titles, thumbnails, descriptions and chapter titles use setups and hooks only.
- **Outro:** outro B (the Orb's scan). Credits read "art · script · music · voices · edit: opus 5.5", then "prompt: jgon". 1080p maximum.

---

## 4. Rules that never bend

**Safety and legal (FIRM).** This is the top of [guardrails.md](../show/bible/guardrails.md); everything else there is TASTE, the showrunner's to bend, and a reviewer raises taste only as a note, never as a blocker.
- **No depicting or referencing real attacks or deaths** (X4, X5, X6).
  - Never the Jul 13, 2024 Butler shooting or the Apr 2026 attack on Altman's home.
  - Ordinary rally gestures, RUMPT's fist included, are fine.
- **Voices:** no cloned or imitated voices. Library voices only; never "sounds like", never laugh mimicry.
- **Likeness:**
  - No photoreal or near-photoreal likeness of a real person.
  - **No person, face or hand from a video model.** Generated video shows objects, animals and places only.
- **Facts:** no allegations shown as fact.
- **Content:** nothing sexual involving real people, and no protected-trait humor.
- **No invented motive at a contested moment.** Above all, nothing may supply a reason why Alyi left NopeAI, in any episode.
- **Names:**
  - Parody names only, from [naming.md](../show/bible/naming.md). Add new ones there first.
  - Trump is RUMPT, never PMURT.

**Keys and git:**
- API keys live in `.env` at the repo root (`ELEVEN_LABS_API_KEY`, `RUNWAY_API_KEY`). `.secrets/` is empty. **Never print, log or commit a value.** The EL tools read the key inside `ellib.py`.
- **Before every commit:** `python3 ops/keyscan.py` (scans the staged files). **Before every push:** `python3 ops/keyscan.py origin/main..HEAD`. Both must report 0 hits.
- **Committing:**
  - Stage only your own files; never `git add -A`.
  - End every message with the attribution line your harness gives you (this project's commits end with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`).
  - Committing after each pass and pushing to main are authorized (2026-09-26). Videos and rendered WAV/FLAC/MP3 stay git-ignored.

**Ep1 is locked.** Never modify:
- `show/episodes/ep01/`, `studio/src/episodes/ep01/`, `out/ep01/`
- `show/reel/ep01*`, `audio/reel/ep01*`, `audio/ep01/`, `audio/ost/tracks/e01-*`
- `out/season/intro/`, `audio/intro/mix/`

Read them freely, and copy tools out of them. Shared code (`studio/src/shared/`, `studio/src/intro/`, `studio/src/dev/`, `audio/theme/`) may change only if Ep1's outputs stay byte-identical, proven:
- with `ops/reorg/smoke.sh <out> <baseline>` (the baseline taken before your change);
- with `sha1sum -c ops/reorg/ep01-final.sha1`;
- for the intro, with `studio/src/episodes/ep02/pixel/tools/mp4cmp.mjs` (see [Ep2 pipeline.md](../show/episodes/ep02/production/v1/pipeline.md) §8.5).

Once Ep2 is published, treat it the same way.

**Don't cook the laptop** (14 threads, 30 GB RAM; systemd-oomd has killed the whole terminal five times):
- **Every data-heavy command goes through `ops/heavy.sh`:** renders, voice recording, score builds, stems, mixes, Blender, frame or audio analysis, QA, big encodes, typechecks.
- It allows 2 heavy jobs machine-wide, waits for headroom and caps each job's memory. When free memory is under about 8 GB, set `MRMAS_HEAVY_MEM_MAX=6G`.
- Run long jobs in the background and poll their logs.
- Keep `ops/pressure-governor.sh &` running during heavy phases.
- **Caps:** Remotion `--concurrency=4`, fastrec `--workers 2`, `OST_WORKERS=2`.
- Process audio and frames in chunks. Watch `/proc/pressure/memory`, not just free memory.
- **At most about 3 agents at once**, and one heavy job per agent.
- Never kill another project's processes.

**Files:**
- New work goes where [ORGANIZATION-PLAN.md](ORGANIZATION-PLAN.md) §2 says ("Starting a new episode"). No new top-level folders.
- Scratch goes only in your own named subfolder of your session scratchpad. Delete nothing you didn't create.
- Every pass leaves a handoff note (what changed and why, where, exact re-run commands, [M] vs [J], open issues) and updates its folder's README.

---

## 5. Read order

About two hours, and worth it. Paths are from the repo root.

1. `show/production/SHOWRUNNER-NOTES.md`: the showrunner's notes, newest first. Every agent reads this first.
2. `show/episodes/ep02/production/v1/LEARNINGS.md`: **the binding checklist**, distilled from every Ep1 note. Each rule is tagged FIRM or GUIDE, with a test and a source. It's written for Ep2, but every rule is general. Its "Predicted showrunner notes" table is worth re-doing for Ep3.
3. The bible, `show/bible/`, in this order:
   1. `guardrails.md` (top section);
   2. `calibration.md`;
   3. `mas-inner-voice.md`;
   4. `pov-and-framing.md`;
   5. `flow-and-continuity.md`;
   6. `tone-and-dialogue.md`;
   7. `ml-concepts.md`;
   8. `motives-and-the-race.md`;
   9. `setups-and-payoffs.md`;
   10. `style-range.md`;
   11. `naming.md`.
4. **Ep2 as built** (the latest standard and the continuity Ep3 inherits): `show/episodes/ep02/production/v1/`.
   - `DELIVERY.md`;
   - `proposal.md` (the scene-by-scene flow format the showrunner agrees to);
   - `AUDIT.md` (how an old draft was checked against the lessons);
   - `manifest.md` §9 (build order and checks);
   - `pipeline.md` (every tool and command);
   - `fixes-v1.md` (what the reviews found);
   - `assembly.md`;
   - `assembly/transcript-film.txt` (what actually aired, line by line).
5. **Episode 3's folder,** `show/episodes/ep03/`.
   - `script.md`: start at its §16, "where it stands";
   - then `outline.md`, `open-questions.md`, `intro-slot.md` and `facts.md`.
   - The script wins over the companion files, which still describe draft 3.1 in places.
6. **Tooling:** `ops/README.md`, `docs/RENDERING.md`, and [ORGANIZATION-PLAN.md](ORGANIZATION-PLAN.md) §2–§3.

**The memory files.** A Claude Code session started in this repo also loads the earlier sessions' memory: the index is `~/.claude/projects/-home-jgon-project-art-mrmas/memory/MEMORY.md`, with seven short files beside it. Another agent should read those files too: they hold the showrunner's preferences in their own words.

---

## 6. How Ep2 was made: the template

The showrunner asked for "the entirety of episode 2 in one go now using all the learnings up to now". It ran from 2026-10-08 17:00 to 2026-10-11 06:00, **about 61 hours**, as a lead agent dispatching one pass at a time to sub-agents, with picture and score running per act side by side. Each row is a commit on main; `git show <hash>` has the detail.

| # | Pass | Commit(s) | What it made |
|---|---|---|---|
| 1 | LEARNINGS | 509ae14 | The binding checklist from Ep1's notes, with the predicted showrunner notes |
| 2 | AUDIT | 2bb2122 | The old draft (5.4) checked against the lessons: conflicts and fixes, open questions with defaults, the keep list, facts to re-verify |
| 3 | PROPOSAL + MANIFEST, 3 review rounds | 755cadd → 1328c40 (about 3 h) | The full flow scene by scene (proposal.md, which in one-go mode stands in for the showrunner's agreement), and the production manifest: sets, cast, props, leaps, voices, cues, room tone, SFX, build order |
| 4 | SCRIPT, BEAT PLAN, CAST + review | a2ac833, fea4146 (about 2 h) | `script-v1.md`; beat plans in Ep1's JSON schema (`production/v1/beat-plan/<seg>.json`, with each beat's `scene`); the voice cast |
| 5 | PIPELINE | 63e5405 | Ep1's tools copied for Ep2, plus the per-scene picture render with a content-hash cache; `ops/rebuild-act.sh --ep 2` |
| 6 | ART, 2 passes | e682a20, a5336ed | 43 new assets, 120 stills looked at, the ISS cube in Blender |
| 7 | CASTING | 5db5039, 1f58e66 | Every new role auditioned among library voices and picked by measurement (2,394 EL credits) |
| 8 | TAKES | d6e3cf0 | Every line recorded, ASR-verified, retaken where it failed (3,999 EL credits) |
| 9 | LOCK + LOCK QA | 241e91f, 3518595 | The base, EL-master and pixel locks; 22:54 of story; scene stubs |
| 10 | SCORE per act, then review | e93b4ca … 3c19f0b (about 1 h an act) | E02-01 … E02-13 laid on the lock, `check.py` PASS |
| 11 | PICTURE per act, each with a review and fix pass | 945698d … ceeac57 (2–4 h an act) | Every scene drawn, rendered and looked at full size; 13–24 review findings an act |
| 12 | TITLES | 09e604c, eb8f57f | The Ep2 intro variant (slot code; Ep1 proven byte-identical) and the outro |
| 13 | SOUND | 495db18 (about 4 h) | 170 new sounds and beds, the stems, the mix, the measured audit |
| 14 | ASSEMBLY | e2bce00 (20 min) | The film plus QA |
| 15 | Episode review → FIXES per act, in parallel | afcc7ea … eb6ddbe | 2–14 findings an act; relocks where needed; the facts pull pass (every on-screen quote checked at its source) |
| 16 | Re-assembly, verify round, final fixes, cleanup, final assembly | f89f33e … fb0efde | Second and third review rounds, smaller each time |
| 17 | RELEASE COPY + DELIVERY | fb810a0, bf56bf2, 553e9b0 | The title, description, chapters, five spoiler-free thumbnails, and the delivery note |

**What made it work:**
- **The proposal was written in full before anything was built.** It reviewed itself three times (blockers and majors applied), and every later change went back into it with a reason (decisions D-1 to D-102).
- **One lock path.** The ElevenLabs-timed lock is the master. Every line, including any hand-placed V.O., lives in the beat plan, so a rebuild can't drop it.
- **Per-scene rendering.** A fix re-renders one scene in 25 s to 5 min, and the act is a lossless concat of the scenes.
- **Every pass looked at its frames at full 1080p** and had a fresh reviewer.
- **The delivery note** lists every human check by timecode, since nobody watched it in motion.

**Use the same order for Ep3.** Write Ep3's own LEARNINGS only as a short delta on Ep2's (the notes since 2026-10-08, §7.2), not a rewrite.

---

## 7. Starting Episode 3

`ep1.2_strawberry.jpg`, Aug 5 → Dec 2024: the strawberry tease, the hidden thinking (o1), the founders leaving, the $157B round, the election, and THE PODIUM turning.

### 7.1 Set up the paths: copy Ep2's tools, don't edit them

Follow [ORGANIZATION-PLAN.md](ORGANIZATION-PLAN.md) §2 with Ep3's names:

| What | Where |
|---|---|
| Production docs | `show/episodes/ep03/production/v1/` |
| Pixel code | `studio/src/episodes/ep03/pixel/` |
| Renders and the film | `out/ep03/v1/` |
| Takes | `audio/ep03/` |
| Score | `audio/ost/tracks/e03-v1-<seg>/` |
| Rebuild script | `ops/rebuild-act-ep3.sh`, with `--ep 3` dispatch in `ops/rebuild-act.sh` |

**Copy from Ep2, not Ep1.** Ep2's copies already have:
- the per-scene render;
- the `el_lock.py` fixes (`--fixed` takes beat ids only, and it refuses to drop a line);
- the `el_render.py --dry-run` fix (a dry run writes nothing);
- the score checks (`lock_sha1`, holes, line pockets).

The tools live in:
- `studio/src/episodes/ep02/pixel/tools/`
- `audio/reel/ep02-v1/`
- `audio/ep02/v1-el/tools/`
- `audio/ost/tracks/e02-v1-common/`
- `show/episodes/ep02/production/v1/assembly/tools/`
- `ops/rebuild-act-ep2.sh`

[Ep2 pipeline.md](../show/episodes/ep02/production/v1/pipeline.md) §0 maps every tool; §11 lists the files.

**Leave Ep2's files alone.** Watch-through fixes may still need them.

**Point the copies at Ep3:**
- `audio/ep03/cast-el.json`, copied from Ep2's, with its own `cache_dir` and Ep1's and Ep2's caches as `cache_read`;
- the manifest's chapters;
- the card `ep1.2_strawberry.jpg`;
- an `IntroSlot` for Ep3 (§7.3);
- an outro `EPS` entry (Ep2's is in `studio/src/episodes/ep02/outro/`).

**Prove it before building:** `ops/rebuild-act.sh --ep 3 <act> --dry-run` and the Ep1 check. `ops/rebuild-act.sh --ep 2 ... --dry-run` should also still pass.

### 7.2 Ep3's draft is stale: audit it first

The teleplay (`script.md` draft 3.6, 2026-09-26) and its companion files were written **before**:
- **Agency** (SN 0): Mas acts in every act.
- **The planner V.O. and the mastermind, never on the nose** (SN 000). The draft's V.O. map has about five lines, written as catches.
- **Motives and flashbacks** (SN 0000): one 45–90 s motive flashback per episode.
- **Human and fast** (SN 00000).
- **Ep1's final content** (SN 00000A/B).
- **The ML concept map** (SN 00000B).
- **The intro quote rule** (00000C).
- **The FIRM/TASTE split** (00000D).
- **Ep2 as built.** The proposal's decisions changed a lot from the Ep2 outline that Ep3's draft assumes.

The draft's voice notes, "designed from a text description" and "RUMPT's final voice is a human actor", are superseded: the show uses the ElevenLabs library cast (LEARNINGS S7). Write an AUDIT in [Ep2's AUDIT.md](../show/episodes/ep02/production/v1/AUDIT.md) format before the proposal.

### 7.3 Known Ep3 questions

Decide these in one-go mode, or put them to the showrunner in the proposal otherwise.

1. **The ML concept.** The agreed map gives Ep3 **next-word prediction plus attention**: "It is ours. We published it." (the transformer paper), shown as a sentence completing word by word, with attention lines and a bar chart of candidate next words. The draft's THE PLAN (sc 7, about 48 s) instead explains tokens ("why it can't count the R's") and thinking before answering, and Ep10 owns "thinking time".
   - Reconcile them: one concept in depth.
   - The R's gag can ride as the hook, since tokens are the unit next-word prediction works in.
   - Keep o1's thinking to what the story needs.
2. **Ep2's podium hook as built:** [open-questions.md](../show/episodes/ep03/open-questions.md) item 20 (the second #20, added 2026-10-11).
   - Ep2 ends in a studio. Nobody is behind the podium. The balloon is a plain green speech bubble with dot eyes and no `SO SCARY` lettering, and its string snaps taut, straight up.
   - Ep3's draft still has a slack string and a gold-cuff hand behind the podium.
   - Reconcile before the lock, under the narrowed X4: no hill-top raised-fist staging that could recall Jul 13, 2024.
3. **The intro slot is smaller than `intro-slot.md` assumes.** The shipped intro can only change these per episode (`studio/src/intro/slot.ts`):
   - the `you are here` dot's rest;
   - the keycap legend (Ep1 `CTRL`, Ep2 `ESC`; Ep3's plan is `MUTE`);
   - the subtitle (Ep2's `back by popular demand`; Ep3's plan is `now with voice (paused)`).
   
   The typed quote never changes. The hill, the CZAR lanyard, the desk tally, the coat hook and Misanthropic's price tag were **never built** into the intro (Ep2 pipeline.md §8.1–§8.2), and the roll call isn't a slot yet. Adding any of them is new shared intro code. Ep1's intro must then be proven byte-identical, and Ep2's re-checked.
4. **The Ep2/Ep3 boundary** (open-questions #1). Ep2's tag already played August: the `AUG 5` rail and the suit landing, RUMPT's Aug 11 post, and the Aug 21 broadcast. Ep3 opens on Aug 5–7 (Gerg's sabbatical, the strawberry). Check Ep2's `transcript-film.txt` for anything Ep3 would repeat or contradict.
5. **Continuity carried from Ep2 as aired:**
   - **Alyi:** he left, and the white ISS cube is his. Ep3 may show him only in a doorway shadow or flashback, with no reason for leaving, ever.
   - **Collars:** three, with no pop in Ep2.
   - **THE ORB:** its verdicts.
   - **The lobby:** the DAYS SINCE sign, the February flyers and the complaint used as a side table.
   - **Politics:** REMUHCS's roadmap lectern with `0 BILLS`.
   - **Characters:** Neleh's podcast, Ekiel, the Forecaster and Haras.
   - **Not established:** Gerg's sabbatical was never set up in Ep2.
   
   The setups-and-payoffs table in Ep2's proposal (§"Setups, payoffs and every numbered sequence") lists what Ep2 planted.
6. **The election card** (open-questions #3). X11 is now TASTE, so it's the showrunner's call, not a blocker. In one-go mode, keep the card and note it in DELIVERY.md.
7. **The draft's runtime** is about 22:06 of story. Both earlier episodes landed at 23:31 with the intro and the outro. Runtime is an outcome, not a target. Add to the setup acts; don't trade one scene for another.
8. **Name load.** The draft carries many new names: Lunchmas, Maon, Auhsoj, Leiht, Halo, the Other Paul, Skcas, Sozeb… Ep2's delivery note flagged its own ten new names as a likely note. Introduce people by what they are to Mas, and drop names that nobody deals with twice.

---

## 8. The machine and the tools

**Environment:**

| | |
|---|---|
| Python environments | `audio/.venv-casting/bin/python` (voices, locks, mix: `$PY` in the Ep2 docs) · `audio/.venv-theme/bin/python` (score: `$TH`) · plain `python3` for `build_timeline.py` and the scene tools |
| Remotion | Run from `studio/`: `npx remotion ...`, always through `ops/heavy.sh` with `--concurrency=4` |
| ffmpeg | Use the Remotion bundle: `studio/node_modules/@remotion/compositor-linux-x64-gnu/` (set `LD_LIBRARY_PATH` to it). It has no `xstack` or `select` filters. The assembly uses libfdk_aac |
| Blender 4.5.3 | `~/Downloads/blender-4.5.3-linux-x64/blender`. EEVEE runs on the iGPU; Cycles is CPU only. Ep2's ISS lot: `studio/src/episodes/ep02/pixel/art/iss/iss_scene.py`, `act4/tools/iss22.py` |
| Runway (video model) | `studio/src/dev/genvideo/runway/gen.py`; Ep2's mammoth: `studio/src/episodes/ep02/pixel/coldopen/tools/aros_insert.py`. Objects and animals only (§4) |
| ElevenLabs | `audio/ep02/v1-el/tools/el_render.py`; run with `HF_HUB_OFFLINE=1`. Always `--dry-run` first: it prints what it would send and costs nothing. Ep2 spent about 6,400 credits on casting and takes, plus re-records |

**Checks:**

| Check | Command |
|---|---|
| Ep1 unchanged | `sha1sum -c ops/reorg/ep01-final.sha1` → 31 OK |
| Ep1 smoke test | `ops/reorg/smoke.sh <out> <baseline>` |
| Ep2 unchanged | md5 of `out/ep02/v1/ep02-v1.mp4` = `2a6affb88c14f25ff3735935639bc15a`. There is no Ep2 sha1 file yet; write one, like Ep1's, when Ep2 is published |
| Film QA targets | −16 LUFS integrated (±0.5), true peak under −1 dBTP on the encoded film, 0 decode errors, 0 A/V lag, at most 3 flashes in any second (run streamed), must-read text held at least 0.25 s + 0.05 s per character |

---

## 9. Traps already found

1. **`ops/keyscan.py <path>` doesn't scan that path:** it scanned 0 files. Use no argument (the staged files) or a range (`origin/main..HEAD`).
2. **Parallel agents and git.** When fixers ran in parallel, one agent's unstaged edits stopped another's `git pull --rebase`. Each agent stages and commits only its own files; the lead orders the commits. The re-assembled film's commit, md5 and size must then be updated in DELIVERY.md and release.md.
3. **A borrowed pose can need a missing prop.** The Forecaster "asleep" used the room rig's chair pose with no chair, so he sat on air until the final eye check. Check every pose for what holds it up (a seat, a rail, the floor) and for contact shadows.
4. **Reviewers blocked on taste.** RUMPT's podium was raised as an X4 blocker, which led to the FIRM/TASTE split. Judge what a frame actually shows.
5. **The intro variant changed the typed quote** ("her" and a typing indicator), and the showrunner rejected it. Only the other slot items change.
6. **One-go mode means no questions.** Listing leftover review notes as if asking which to fix drew "finish entirely on your judgement".
7. **A score belongs to one lock.** After any relock, re-lay the act's score; its cue sheet's `lock_sha1` must match. The tag must hold its score's last bar line: Ep2's tag is 888 frames, and a 38 s tag failed the check.
8. **Timing changes ripple.** Re-anchor every SFX and score layer after any insert (Ep1's egg timer ticked for 43 s past its scene). Every later chapter moves too, and `rebuild-act` re-derives them.
9. **Untracked render by-products:**
   - `out/ep02/v1/picture/*.render.json`
   - `out/ep02/v1/picture/*.srt`
   - `out/ep02/v1/scenes/`
   
   They aren't git-ignored. Don't commit them; whether to ignore them is still open.
10. **Never resume a workflow blindly** past steps that had side effects. Open every sub-agent brief with the actual instructions; a relayed side question doesn't cancel them.
11. **Mid-run notes.** The intro-quote note arrived halfway through Ep2. Add it to SHOWRUNNER-NOTES.md at once, so later passes see it, then fix what it touches.

---

## 10. Waiting on the showrunner

None of these block Ep3. The details are in [DELIVERY.md](../show/episodes/ep02/production/v1/DELIVERY.md).
- **The watch-through itself,** with the ear and eye list by timecode.
- **Ep2 story calls:**
  1. 12.05's `OMNI` beside Alyi's departure (smallest fix: drop the word);
  2. the name load;
  3. Act Two's second explainer;
  4. three stacked winks;
  5. the political pair's weights;
  6. Alyi's empty seat;
  7. 22.07's ISS plate (needs a Blender pass);
  8. about 60 lines under the audibility floor;
  9. the garden cut and the shortened V.O. 6.
- **Release choices** in [release.md](../show/episodes/ep02/release.md): keep the outro's voice-cast page, and how to name tools.
- **Ep1's live YouTube description** needs the Salamander Grand Piano credit (CC BY 3.0). Only the showrunner can add it; nothing in the repo changes.
- **Publishing Ep2** and filling in `EPISODES.md`.

---

## 11. Map

| Need | Look in |
|---|---|
| What the show is | [README.md](../README.md), `show/bible/overview.md`, `show/INDEX.md` |
| The showrunner's words | `show/production/SHOWRUNNER-NOTES.md`; the memory files (§5) |
| The rules as a checklist | `show/episodes/ep02/production/v1/LEARNINGS.md` |
| Guardrails | `show/bible/guardrails.md` (FIRM/TASTE at the top) |
| Names | `show/bible/naming.md` |
| Real events and dates | `show/timeline/master-timeline.md`, each episode's `facts.md` |
| Flashbacks across the season | `show/timeline/flashback-map.md`, `show/timeline/season-flashbacks-overview.md` |
| Running gags | `show/gags/recurring-gags.md` |
| The intro | `show/intro/`, `studio/src/intro/` (`slot.ts`), `studio/src/dev/m*/` (the moments), Ep2's variant in `studio/src/episodes/ep02/intro/` |
| The latest production, end to end | `show/episodes/ep02/production/v1/` (`pipeline.md` first) |
| Ep1's production (the original model) | `show/episodes/ep01/production/full-v3/` (`PLAN.md`, `pipeline.md`, `version-ledger.md`, `assembly.md`) |
| How to re-create every output | `docs/RENDERING.md` |
| Where files go | `docs/ORGANIZATION-PLAN.md` §2–§3 |
| The machine's safety tools | `ops/README.md` |
