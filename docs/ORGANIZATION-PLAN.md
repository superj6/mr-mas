# MR. MAS: organization plan

**Status: being executed (2026-09-29); see the execution status in §0.**
- Written 2026-09-26 by the `org-plan` pass (measured at 15:10) and reviewed by the `org-critic` pass (15:45, §10).
- Revised at about 16:50 by the `orgv2-planfix` pass, which was read-only for the project apart from this file. Its dry runs and tests ran on throwaway copies of the tree in its scratch folder.
- **Re-measured and re-tested at about 23:15 by `orgv2-planfix-r3`** (read-only too), on a copy of the tree as of 22:03. Every count below is from that run unless it says otherwise. What changed since 16:50 is in §0.1 and §10.6. The two findings that matter most:
  - **Seven tracked duplicate PNGs and five ignored media files were already deleted at 16:09, uncommitted.** Phase 0's `git add -A` would commit the seven. The lead confirms them first (§7.1 item 3, §9 item 4).
  - **Two phase 6 manifest rows named deleted WAVs,** so `apply` would have refused. They're gone from Appendix A.
- Other passes keep writing, so re-measure before each phase (§7.3 step 2, Appendix D).

**What the revision changed.** §10.5 maps each fix to the critic's findings, and §10.6 lists the 23:15 re-check.
- **The move tool (Appendix B, now v2) rewrites paths joined onto variables.** That covers `AUDIO`, `ROOT`, `HERE`, `$ROOT/out/...`, `f'{ROOT}/...'`, `j('intro-sfx/...')` and split `os.path.join` pieces, wherever it can work out what the variable holds. It lists the rest for a person (DEPTH, ESCAPES, COMPOSED, FRAGMENT).
- **The verified breakages are fixed, or the item is kept in place:**
  - The intro mix, SFX, verify, mux and preview scripts are now rewritten automatically (phase 4).
  - Eight of the nine `$ROOT/out/...` writers and readers are rewritten automatically (phase 3). The ninth follows a cwd-relative `ROOT`. It's a hand fix, together with the two Ep1 range scripts written since that use the same pattern (three `sed` lines, §4).
  - The v2/v3 Act Four modules that the v4 animatic imports, and the files `report_v4.py` builds from a version name, are **KEEP until the Act Four v5 pixel lock**.
  - `audio/ep01/act4/dialogue/retired/` stays in place, or moves only together with its rewritten tools (optional phase 2d).
  - The `intro-sfx/alt` row is dropped.
- **Verification commands are code blocks now, not table cells.** A fragment search (`orgmove.py frag` and an independent `fraggrep.sh`) backs up the whole-path grep.
- **Tested end to end on a throwaway copy,** first at 16:05 and again on the tree as of 22:03 (Appendix B.3):
  - Phases 2, 3, 4 (with phase 1 simulated for its three files), 5a, 5b and 6 (26 rows) were applied in that order and hand-fixed. Every `frag` passed with the ok-lists in §4.
  - After each phase, `plan` reported 0 files left to rewrite.
  - The studio typecheck after 5a and after 5b was identical to the baseline.
  - Apply, undo and `git reset --hard` restored the file list, sizes and folders included.
- **The lead's decisions** (commit and push each verified phase, `ops/workflows/`, the QA logs) are in §9.

**Why this exists.** The showrunner, 2026-09-26: *"also let's try to keep files organized, they are a bit all over the place"*, and *"as far as documentation, we want to be sure that we are leaving appropriate detail where someone could pick up where we left off"*.

**How to use it.**
- **Order:** run the phases in the order of §0.2, each with the procedure in §7, and only when no pass is running. Each phase is verified, committed and pushed on its own.
- **Until a phase has run:** follow §2 for anything new, and don't create new top-level output folders.
- **Afterwards:** this file stays the reference for where things live. Keep §3 (the tree) and §2 (the conventions) current, and mark each phase done in §0.

---

## 0. The plan on one screen

The counts come from the v2 tool's dry run at about 22:10, on a copy of the tree as of 22:03. The 16:45 counts are in Appendix C for comparison.

| Phase | What | Moves | Rewritten by the tool | Left for a person | Risk | When (§0.2) |
|---|---|---|---|---|---|---|
| **0** | Preconditions: commit the `.gitignore` fix (already in the tree) and the QA-log exception, put the workflow scripts in `ops/workflows/` after a secret scan, save the tools in `ops/`, take a checkpoint commit and push it, take a hard-link snapshot, record baselines | none | none | the secret scan | none | step 1 |
| **1** | Portability: replace the `/home/jgon/...` constants and depth- or cwd-relative roots in 81 code files with a root marker (`.mrmas-root`) | none | none (a hand edit) | about 90 code files | medium | step 4 |
| **2** | Low-risk tidy: `out/review-desk` becomes `out/review`, `out/jumps/prev` and `show/intro/_reviews` become `history/`, empty folders go. (The duplicates were already deleted at 16:09, uncommitted: §9 item 4.) | 3 | 5 files | 0 | low | step 2 |
| **2d** | *Optional:* `audio/ep01/act4/dialogue/retired/` becomes `history/`, together with its three draft-3.2 tools | 1 | 3 files (the tools' 7 join lines) | 10 lines of generated-doc prose | low | step 7, only if wanted |
| **3** | `out/` mirrors the show: `season/`, `ep01/`, `lookdev/`, `review/` | 14 | 132 files, including 8 of the nine `$ROOT/out/...` lines and every split join | 3 lines (the cwd-relative `OUT=$ROOT/out/range…` in `range/{p1,ep1-p1,ep1-p3}/tools/build.sh`), 4 reviewed false positives, and how act reels are rendered | medium | step 3 |
| **4** | Intro audio in one place: `audio/intro/`, with the old sketch mixes under `audio/intro/history/` | 7 | 35 files, including the intro mix's six stems, `OUT_DIR`, `verify.py`, `encode_mux.sh` and the outro prototypes' SFX reads | 3 DEPTH lines (phase 1 clears them), 4 code lines, 3 record labels, 2 JSON records, 1 docstring | medium | step 6 (after 1) |
| **5a** | Shipped studio code stops importing `src/dev/`: 5 files promoted to `src/shared/`, then the shim imports in 7 cast files and `room.ts` repointed | 5 | 119 files | 0 (14 reviewed records and comments) | medium; the compiler checks it | step 5 |
| **5b** | *Optional:* the intro moment code moves to `src/intro/moments/`, and the intro and reel entries move beside their code | 14 | 139 files | 2 composed labels (`events.ts:24-25`), plus records | medium to high | step 8 (after the Ep1 picture lock) |
| **6** | Act Four's older rounds (v1–v3 docs, data and renders) go to `history/` | 26 | 26 files | a re-audit; the KEEP list below | high until re-audited | step 9 (after the Act Four v5 pixel lock) |

**Execution status (2026-09-29, the `reorg-run` pass; Ep1 locked for good at `1105dee`; each phase verified with §7.5 block 1 and `ops/reorg/smoke.sh`, no renders or re-mixes, `ep01-v35.mp4` byte-identical throughout):**

| Phase | Status | Commit | Measured before it ran |
|---|---|---|---|
| 0 | **done** | `def7809` (+ `fce1fdf`, the leftover pass outputs; `68d3c3a`, the re-fingerprint after the Act Four fix) | — |
| 2 | **done** | see `git log -- ops/reorg/phase2` | 3 moves, 5 files, 0 manual; fraggrep 1 → 0 |
| 3 | **done** | see `git log -- ops/reorg/phase3` | 14 moves, 192 files, 7 FRAGMENT (the 3 `sed` hand fixes + the 4 reviewed false positives in §4); fraggrep 135 → 0. `studio/src/reel/data/` re-synced for the rewritten manifests, except three copies (`ep01-v35-act4`, `ep01-v35-el-act4`, `ep01-v35.manifest`) that the Act Four fix `f21d274` left stale against `show/reel/`: only their paths were mapped, since Ep1 is locked. **Open:** `cd studio && node src/reel/sync.mjs` refreshes them when the showrunner allows. |
| 1 | pending | | 114 code files hold `/home/jgon` |
| 5a | pending | | 5 moves, 120 files |
| 4 | pending | | 7 moves, 76 files, 3 DEPTH, 10 FRAGMENT |
| 6 | pending | | 24 moves (the v2 and v3 animatic MP4s are gone; their rows are dropped) |
| 2d, 5b | **open, not run** (optional, medium-high risk) | | |

**KEEP until the Act Four v5 pixel lock** (not moved to `history/`, not deleted):
- **The eight v2/v3 TS modules that the v4 animatic composer imports:** `animatic/{data-v2,data-v3,sound-v3,frame,shots,shots3,plan25,plan25v3}.ts`.
- **Their generators:** `tools/lock_v2.py` (writes `data-v2.ts`), `tools/lock_v3.py` (`data-v3.ts`) and `tools/mix_v3.py` (`sound-v3.ts`).
- **The files `report_v4.py` builds from a version name:** `shots-locked-v3.json`, `act4-mix-v3.cues.json` and `act4-mix-v3.wav`.

**KEEP in place:**
- **`audio/ep01/act4/dialogue/retired/`:** the draft-3.2 tools read and write it. Phase 2d is optional.
- **`audio/intro-sfx/alt/`:** every SFX build rewrites it. It travels with `intro-sfx` in phase 4.

**What stays put:**
- `show/`, apart from the `history/` renames.
- `show/production/SHOWRUNNER-NOTES.md`, the Remotion registration files and `studio/public/`.
- `audio/{theme,ost,sfx,voices,samples,requirements,reel}`, `audio/ep01/act4/dialogue/` and `out/ep01/act4/`.
- The new `ops/`.

The reasons are in §5.

### 0.1 What changed since the survey and the review

- **A checkpoint commit exists, and three commits followed it.**
  - At 15:00, `d7c5b40` ("Checkpoint: season revision, Act Four v4/v5 drafts, OST batch 1 + fixes, style range", 1,329 files) was committed **and pushed** to `origin/main` (GitHub `superj6/mr-mas`).
  - `HEAD` at 22:03 was `81a8eda` (18:13), after `890fc82` (the scene-craft pass) and `2207d70` (the elevation ideas).
  - The working tree then held 80 uncommitted changes: `git add -A --dry-run` would add 464 files and remove 7. None of the 464 is over 20 MB.
  - `.gitignore` excludes the OST renders, the dialogue WAVs (`audio/ep01/**/*.wav`), every `out/**/*.wav` and the review-desk media.
- **Most of the §6 "ask first" deletions were already made, at 16:09:37, in one sweep.** No approval for them is recorded in SHOWRUNNER-NOTES or in this plan.
  - **Tracked, so the deletions are uncommitted** (7 PNGs, 12.9M): `out/t.png`, `out/test-mas-looks.png`, `out/dev/render/tonetest.png`, `out/dev/nole/nole-tone-test.png`, `out/dev/shape/shape-extra-{mascu,switch}.png` and `out/dev/screen/screen-extra-lineup.png`. The kept copies are the ones §6.2 names. `studio/notes/nole.md:107` was updated to match.
  - **Ignored, so git can't restore them** (about 120M): the 4K intro pair (`docs/RENDERING.md` records this under the 1080p-max rule), both premix WAVs (`act4-dialogue-premix-v2.wav` and `-v3.wav`) and `out/dev/screen/scene-v1.mp4` and `scene-v2.mp4`.
  - **Still on disk:** `act4-mix-v3.wav` (KEEP) and both mfinale WAVs.
  - **Effects on this plan:** phase 0 must not commit the 7 PNG deletions until the lead has confirmed them (§7.1 item 3, §9 item 4). The two premix rows are dropped from `phase6.tsv`, and §6 marks each deleted item.
- **About 4.2 GB of media is on disk but not protected by git.** That's 2,336 ignored files at 15:10, not counting venvs, `node_modules`, samples and bundle caches. A bad move of an ignored file can't be undone from git, which is why phase 0 takes a snapshot.
- **The 144 MB WAV is now ignored, but the fix isn't committed.**
  - The rule `audio/reel/**/*.wav` was added to the working tree at 16:01 but isn't committed.
  - `git check-ignore -v audio/reel/ep01-act4-v5/mix.wav` confirms the rule applies.
  - Phase 0 commits it.
- **`audio/ep01/act4/dialogue/takes/` and `optional/` are live.** The v4 `lines.json` points into `takes/` 113 times and `optional/` 14 times, and all 227 of its paths resolve. `retired/` is live too, for the draft-3.2 tools (§4, phase 2d).
- **`audio/mix/` isn't purely stale.** `audio/intro-vox/scripts/assemble.py:82` falls back to `mix/music/theme-V1-chipchamber-rollcall.wav`. The v2 tool rewrites that `f'{AUDIO}/mix/...'` read.
- **In this harness, `rg -I` means `--no-filename`.** Tools built on `rg -n` must not pass `-I` (Appendix D).
- **Passes writing at about 22:40** (files changed in the last half hour):
  - The outro proposals: `studio/src/dev/outro/{a…e}/`, writing `out/lookdev/outro/` (SHOWRUNNER-NOTES note 5).
  - The fast dialogue recorder: `audio/ep01/act4/dialogue/tools/fastrec/`.
  - The Ep1 range prototypes: `studio/src/dev/range/ep1-p1…p3/`, writing `out/range/ep1/`.
  - Script passes on `show/episodes/ep0[1-3]/script.md`, and a studio typecheck.
  - Earlier (15:00–18:30): the Act Four v5 reel and the episode-reel tool (`studio/src/reel/`, `show/reel/`), and the docs pass (`docs/RENDERING.md`).
- **New since 16:05, and how each phase treats it:**
  - **`out/lookdev/` and `out/ep01/reel/` already exist.** The outro pass writes the first, and `studio/src/reel/tools/episode.mjs` writes the second. Both follow §2. No phase 3 destination exists yet, so `apply` won't refuse.
  - **`studio/src/reel/tools/episode.mjs:58`** writes `out/epNN/reel/<key>.mp4`, as §2 says. A manifest with no episode number goes to `out/season/reel/`, singular, while phase 3 makes `out/season/reels/`. The reel owner should change `'reel'` to `'reels'` in that branch. The tool lists the line as a FRAGMENT, a reviewed false positive (§4, phase 3).
  - **`out/range/ep1/`**, the Ep1 range renders. Row 3.9 carries it to `out/lookdev/range/ep1/`. `ep1-p2/tools/build.sh:17` (an absolute `OUT=`) is rewritten automatically. `ep1-p1/tools/build.sh:18` and `ep1-p3/tools/build.sh:10` (`OUT=$ROOT/out/range/ep1` after a cwd-relative `ROOT`) are hand fixes. If those inserts are adopted into the Ep1 cut, their final renders belong under `out/ep01/` (§2).
  - **The outro prototypes read the intro SFX sources and import intro moment code.** Phase 4 rewrites `outro/{b,d}/audio/mix.py` and `outro/b/tools/render.sh`. Phase 5b rewrites the outro scene imports. Phase 5a rewrites their `makeRoot` imports.
  - **`audio/ep01/act4/dialogue/tools/fastrec/fastrec.py`** joins `'reel'` onto its own `--out` folder. The phase 3 fragment scan lists three lines there, all false positives.
  - **Phase 1 grew from 61 to 81 code files** that contain `/home/jgon`: 16 in `studio/src/dev/outro/` and 4 in `studio/src/dev/range/ep1-*`.

### 0.2 Phase order for execution

**Rules:**
- Safest first: no-move steps and small renames before large ones, and anything that needs a later lock last.
- **No pass may be running** when a step starts (§7.1 item 1). No step needs a pass running: every check in §7.5 is run by the person doing the phase.
- Each step ends with verify (§7.5), then commit and push (the lead's decision, §9 item 1).
- Passes resume between steps once they've been told the new paths. Update any brief that names an old path.

| Step | Phase | Why here | Also wait for (passes touching the same paths at 22:40) |
|---|---|---|---|
| 1 | **0** | No moves. It makes every later step recoverable, and it commits the tools. The lead first confirms the 16:09 deletions (§9 item 4). | Every pass idle: the checkpoint commits their work, so it must be consistent |
| 2 | **2** | 3 renames, 5 files, no hand fixes | The docs pass (`docs/PIPELINE.md`), anything writing `out/jumps/` or `show/intro/` |
| 3 | **3** | The tool rewrites all but three one-line hand fixes (tested end to end) | The reel passes (`out/reel/`, `render_all.sh`, `episode.mjs`), the Ep1 range passes (`out/range/ep1/`), intro picture work (`out/intro/`) |
| 4 | **1** | No moves, but about 90 hand-edited files. Phase 4 needs it. | Any pass running one of the 81 tools (dialogue, OST, intro, outro, range) |
| 5 | **5a** | The compiler and the composition lists check it | Every studio pass: every `src/dev` entry imports `makeRoot`, and the outro and range passes add entries |
| 6 | **4** | Needs phase 1. A real intro remix verifies it. | Intro audio work, and the jumps, range and outro tools that read the intro SFX |
| 7 | 2d | Optional, only if the showrunner wants `retired/` renamed | Dialogue passes |
| 8 | 5b | Optional, after the Ep1 picture lock | Intro, picture and outro passes (the outro imports intro moment code) |
| 9 | 6 | After the Act Four v5 pixel lock and a re-audit | Act Four passes |

Steps 2 and 3 can swap with step 4. Phases 2 and 3 don't need phase 1 (the tool resolves the old `/home/jgon` constants). They go first because the tool does nearly all of their work.

---

## 1. Principles

1. **One obvious home for each kind of thing.**
   - Writing and production docs go in `show/`.
   - Picture code goes in `studio/`, and audio code, sources and masters in `audio/`.
   - Rendered deliverables go in `out/`, and project-wide engineering docs in `docs/`.
   - Project tools and workflow records go in `ops/`.
   - Nothing is duplicated across these, apart from generated copies that say so (`studio/src/reel/data/`).
2. **Outputs mirror the show's structure, not the workflow that made them.**
   - `out/season/` holds what spans the season: the intro and the story reels.
   - `out/epNN/actN/` holds an episode's or an act's work.
   - `out/lookdev/` holds style R&D, and `out/review/` holds the review desk.
3. **Production docs live with their episode.**
   - Act-level docs and data go in `show/episodes/epNN/production/actN/`, and season-level ones in `show/production/`.
   - Each handoff note sits beside the work it describes, as its README.md.
   - `docs/` holds only what spans the whole project: STATUS, PIPELINE, RENDERING and this plan.
4. **Versioned names only where versions matter.** Something the showrunner reviews in rounds carries `-vN`. Everything else has one current, unversioned name, and git keeps its past.
5. **Older rounds go to `history/` beside the current one.**
   - This happens once the round is superseded and no live tool reads it.
   - `history/` is the one convention. It replaces `prev/`, `retired/` and `_reviews/`.
   - An *alternate* that a live tool writes (such as `intro-sfx/alt/`) isn't an older round, and keeps its name.
6. **A README.md in every top-level folder and every work folder.** It says what lives there, which version is current, how it's made (exact commands), what was measured and what still needs a human, and the open issues.
7. **Paths in code are relative to the project root, which is found at run time.** Phase 1 does this. Code never contains `/home/jgon/...` or a path that only works from one depth or one working directory.
8. **Don't move things just to be tidy.** A move has to earn its reference rewrite. Where a folder is referenced by filesystem pattern, by a path baked into rendered media, by a name built at run time, or by more than about 50 files, it stays, and a README explains it (§5).

---

## 2. Conventions for new work (apply now, before any move)

**Where new outputs go:**

| Kind | Home | Example |
|---|---|---|
| An act's picture, animatic, stick-figure reel, builder previews | `out/epNN/actN/<stage>/` | `out/ep01/act4/animatic/act4-animatic-v5.mp4`, `out/ep01/act4/reel/ep01-act4-v5.mp4` |
| An episode-wide cut (full-length rough animatic) | `out/epNN/<stage>/` | `out/ep01/reel/ep01-full.mp4` |
| Season-wide deliverables | `out/season/<thing>/` | `out/season/intro/`, `out/season/reels/ep03.mp4` |
| Style R&D, prototypes, tests, generated-video trials | `out/lookdev/<study>/` | `out/lookdev/range/p5.mp4` |
| Web copies for the showrunner's review page | `out/review/` | `out/review/act4-v5.mp4` |
| Audio cut to one specific picture edit (mixes, premixes, cue lists) | beside that picture in `out/` | `out/ep01/act4/animatic/act4-mix-v5.wav` |
| Audio sources, takes, stems, masters and their code | `audio/<area>/` | `audio/ep01/act4/dialogue/`, `audio/ost/tracks/<id>/` |
| Code | `studio/` or `audio/`, never `out/` | |
| Project tools (the move tool, the fragment check) | `ops/` | `ops/orgmove.py` |
| Workflow scripts, as run (records) | `ops/workflows/` | `ops/workflows/mrmas-style-range-wf_a9e99d3f-04e.js` |
| Scratch work | the session scratchpad, in your own named subfolder | |
| An episode-wide production cut (the Ep1 v3 film is the model) | docs `show/episodes/epNN/production/<cut>/`, code `studio/src/episodes/epNN/pixel/`, renders `out/epNN/<cut>/`, the finished film `out/epNN/<cut>/epNN-vN.mp4` | `show/episodes/ep01/production/full-v3/`, `out/ep01/full-v3/ep01-v35.mp4` |
| An episode's dialogue, voices and takes | `audio/epNN/<round>/` (one folder per voice round, with its tools) | `audio/ep01/v3-el/` (the ElevenLabs cast, `tools/`, `ep01-v35/<seg>/`) |
| An episode's score, per segment | `audio/ost/tracks/eNN-<cut>-<seg>/` | `audio/ost/tracks/e01-v3-act1/` |
| An episode's stick timelines and manifests, per round | `show/reel/epNN-vN[-el]/` (synced into `studio/src/reel/data/`) | `show/reel/ep01-v35-el/` |
| An episode's temp beds, stems and mix code | `audio/reel/epNN-<cut>/` | `audio/reel/ep01-v3/` (`stems.py`, `mix_episode.py`) |
| A one-command rebuild of a changed act | `ops/` | `ops/rebuild-act.sh <act> [--dry-run]` |

**Rounds inside a production cut** (added 2026-09-29). The Ep1 v3 tools build their paths from the lock's version (`el-$LOCK`, `ep01-$LOCK-el`, `mix-$LOCK-el`, `e01-v3-<seg>`), so each round is a versioned sibling (`el-v31/` … `el-v35/`, `beat-plan-v31/` … `-v35/`, `lock-v31.md` …), not a `history/` folder. That follows principle 8: a name built at run time stays. Only the final round is current; `show/episodes/ep01/production/full-v3/version-ledger.md` says which is which. A later episode keeps one round folder per showrunner round in the same way, and names the current one in its README.

**Starting a new episode (Ep2 on):** make `show/episodes/epNN/production/<cut>/` with its PLAN.md and README.md, `studio/src/episodes/epNN/pixel/`, `out/epNN/<cut>/`, `audio/epNN/`, and `audio/ost/tracks/eNN-<cut>-<seg>/`, copying the Ep1 v3 tools rather than editing them (Ep1 is locked). `ops/rebuild-act.sh` is Ep1's; copy it per episode.

Until phases 2 and 3 run, put new lookdev in the existing sibling folder (`out/range/`, `out/jumps/`) rather than inventing a new one. After phase 3, use the table above.

**Names:**
- Folders and non-Python files use lowercase kebab-case. Python modules use snake_case.
- Episodes and acts are `epNN` and `actN`.
- Composition IDs keep their current scheme (`intro-ep1-V1`, `ep01-act4-animatic-v4`, `reel-ep01`). They're baked into render commands and outputs.

**Versions:**
- Use a `-vN` suffix (`_vN` in Python), and only for work that is reviewed in rounds.
- `-vN.M` is only for script drafts (`v2.1`).
- Uppercase `V1–V4` is reserved for the intro's four score variations, which are alternates, not versions.
- A new round gets a new suffix. The previous round's files go to `history/vN/` once nothing running reads them, *including names built at run time* (`f"shots-locked-{v}.json"`).
- Don't rename existing files to fit this. It applies to new files only.

**Words:**
- "Reel" means the story reel or a stick-figure dialogue reel. A new audition or demo compilation is `*-sampler` or `*-audition`, not `*-reel`.
- "Animatic" always sits under a folder that says whose animatic it is (`out/season/intro/animatic/`, `out/ep01/act4/animatic/`).

**Handoff notes:**
- Each pass updates or writes the README.md of the folder it worked in. It covers what changed and why, where the files are, how to re-run it (exact commands, run from the repo root unless the note says `(run from studio/)`), what was measured versus what needs a human, and open issues.
- `docs/STATUS.md` links to those READMEs.

**Paths in new code:**
- Use the root resolver (§4 phase 1) plus repo-relative strings, for example `os.path.join(REPO, 'out/ep01/act4/animatic')`.
- Write a path as one string, not as `join('out', 'ep01', ...)`, so a grep finds it.
- Don't build a folder or file name from a version or an ID if a fixed string will do. If you must, say so in a comment that names the folder, so a later move can find it.

---

## 3. Target tree (after phases 2–5a; 5b and 6 are marked)

```
mrmas/
├── README.md                    front page; points to docs/STATUS.md
├── EPISODES.md                  the published episodes and where to watch them (Ep1 on YouTube)
├── .mrmas-root                  NEW (phase 1): empty marker that every tool uses to find the project root
├── docs/
│   ├── README.md                NEW: index of the four docs below
│   ├── STATUS.md                NEW (docs pass): the single "start here", refreshed at every milestone
│   ├── PIPELINE.md              architecture and decisions (refresh after each phase)
│   ├── RENDERING.md             how to re-make everything (refresh after each phase)
│   └── ORGANIZATION-PLAN.md     this file: layout and conventions
├── ops/                         (phase 0)
│   ├── README.md                what is here; how to run a reorg phase (points to §7)
│   ├── heavy.sh pressure-governor.sh   run heavy jobs gently; pause them under memory pressure
│   ├── rebuild-act.sh           rebuild one Ep1 act end to end (--dry-run checks every path)
│   ├── orgmove.py               the move and rewrite tool (Appendix B)
│   ├── fraggrep.sh              the fragment check (Appendix B.2)
│   ├── keyscan.py               no API key value in a commit or a push
│   ├── reorg/                   per-phase manifests, ok-lists and frag output; smoke.sh; ep01-final.sha1
│   └── workflows/               ← .backups/*.js (25 workflow scripts, as run; records, never rewritten) + README.md
├── show/                        writers' room; layout unchanged
│   ├── INDEX.md  README.md
│   ├── bible/ characters/ format/ gags/ timeline/ world/ _sources/
│   ├── intro/                   SCRIPT.md (source of truth), cue-sheet, shot-table, spec, episode-slots
│   │   └── history/             ← _reviews/ (v2.0 backup and its three reviews)            [phase 2]
│   ├── reel/                    story-reel timelines (JSON), synced into studio/src/reel/data/
│   ├── production/              season level: SHOWRUNNER-NOTES.md (fixed path), plans, queues, candidates
│   └── episodes/epNN/           outline, beats, facts, flashbacks, gags, intro-slot, open-questions (+ script.md)
│       ├── release.md           (ep01) the release copy: title, description, chapters, thumbnail
│       └── production/actN/     the act's production docs + machine data (shots-*.json)
│           └── history/         superseded rounds (Act Four v1–v3, minus the KEEP files)   [phase 6]
│       └── production/full-v3/  (ep01) the v3 film, v3 → v3.5: PLAN, pipeline, version-ledger, lock-vNN.md, shots-<seg>.md,
│                                sound, voices-el, beat-plan-vNN/, lock/ (Kokoro locks), assembly/ (tools/ assemble.py …,
│                                el-vNN/ the EL locks, *-assembly.json and *-qa.json records)                  [fixed]
├── studio/                      Remotion 4 project; the working directory for every `npx remotion` command
│   ├── README.md                NEW
│   ├── src/
│   │   ├── Root.tsx  index.ts   registration (auto-registers every *.frame.tsx under src/)   [fixed]
│   │   ├── shared/              the engine: pixel/ (+ png.ts, rooms/room.ts, cast/orb.ts, kits/callart.ts),
│   │   │                        makeRoot.tsx, frame-def, timing, theme/fonts, lookdev rigs   [5a adds the promoted files]
│   │   ├── intro/               the shipped intro: edl, scenes, IntroEp1, qc, intro.frame.tsx
│   │   │   ├── moments/m*/      ← src/dev/{mcoldopen,meras,mdinner1,mdinner2,mrollcall,mfinale}   [5b, optional]
│   │   │   ├── entry.tsx review.tsx tools/   ← src/dev/intro/                                    [5b]
│   │   │   └── animatic/        ← src/dev/animatic/ (intro stick animatic entry)                  [5b]
│   │   ├── episodes/ep01/act4/  Act Four modules (animatic, board, cast, inserts, kits, medium, rooms-a/b);
│   │   │                        animatic/ keeps the v2/v3 modules the v4 composer imports       [KEEP to v5 pixel lock]
│   │   ├── episodes/ep01/pixel/ the Ep1 v3 pixel pipeline: <seg>/{shots,data,extras}.ts + art/, the host, and tools/
│   │   │                        (lock.py, build.mjs, render.ts); README.md                          [fixed; Ep1 locked]
│   │   ├── reel/                story-reel generator; data/ = generated copy of show/reel      [fixed]
│   │   │   ├── tools/           episode.mjs, mixer.mjs (the episode-reel tool, already here)
│   │   │   └── entry.tsx tools/ ← src/dev/reel/                                                  [5b]
│   │   ├── styleframes/         *.frame.tsx wrappers (auto-registered)                         [fixed]
│   │   └── dev/                 lookdev and R&D only: range/ (incl. ep1-p1…p3) jumps/ genvideo/ framing-v3/ outro/,
│   │                            lookdev keys, pixeladv (shims kept) … + README.md NEW explaining each folder
│   ├── tools/genvideo/          generated-video insert converter
│   ├── notes/                   builder notes (one per builder), _report-* and _pixel-* critiques
│   ├── public/                  staticFile() root; genvideo/<shot>/ committed, genvideo/_test/ ignored   [fixed]
│   ├── out/                     Remotion bundle cache (ignored)                                  [fixed]
│   └── ART_GUIDE.md PIXEL_GUIDE.md INTRO_PIXEL_BRIEF.md                                         [fixed]
├── audio/
│   ├── README.md                NEW: folder map, venv per folder, committed vs ignored
│   ├── requirements/ samples/   frozen venv lists; sample-library licences, fetch script, manifest   [fixed]
│   ├── theme/                   main-title score + the theme engine (the OST engine imports it)      [fixed]
│   ├── ost/                     OST engine, editor, tracks/<id>/, OST-BIBLE, indexes                 [fixed]
│   ├── sfx/                     the SFX board                                                        [fixed]
│   ├── voices/                  voice casting, pass 1 (per character)                               [fixed]
│   ├── intro/                   NEW (phase 4): audio made only for the intro
│   │   ├── mix/                 ← audio/intro-mix/  (final intro mixes, stems, QA, mux scripts)
│   │   ├── sfx/                 ← audio/intro-sfx/  (alt/ stays: the builder's script-contract spot)
│   │   ├── vox/                 ← audio/intro-vox/
│   │   ├── vocals/              ← audio/vocals/     (cold-open VO, chant, harmony, intro-layer, audition)
│   │   ├── animatic/            ← audio/animatic/   (the stick animatic's temp track)
│   │   └── history/sketch-mix/  ← audio/mix/ + audio/LISTENING_GUIDE.md (superseded sketch mixes)
│   ├── ep01/act4/dialogue/      Act Four dialogue: lines*.json, takes/, v5/ …; retired/ stays (2d optional)
│   ├── ep01/v3…v35/, v3-el/     the Ep1 v3 voices: Kokoro takes per round; v3-el/ = the ElevenLabs cast, tools/,
│   │                            ep01-vNN/<seg>/ takes per round, intro/ (Mas's EL intro line)              [fixed]
│   ├── ost/tracks/e01-v3-<seg>/ the Ep1 v3 score, one track per segment (v35check.py in e01-v3-act1/)       [fixed]
│   └── reel/                    temp beds for the story reels and the stick-figure reels             [fixed]
│       └── ep01-v3/, ep01-vNN[-el]/  the Ep1 v3 stems and mix code (stems.py, mix_episode.py), per-round beds, QA [fixed]
├── out/
│   ├── README.md                NEW: layout, committed vs ignored, where each recipe is
│   ├── season/
│   │   ├── intro/               ← out/intro/ (V1–V4 masters, picture/, qa/, reports/, review/)
│   │   │   ├── animatic/        ← out/animatic/
│   │   │   └── moments/         ← out/pixel/moments/ + out/pixel/{dinner,moments}-preview.png
│   │   └── reels/               ← out/reel/ (ep01–12, season.mp4, sheets/, index.md)
│   ├── ep01/reel/               [fixed, already here] full-episode reels from studio/src/reel/tools/episode.mjs
│   ├── ep01/act4/               [fixed] animatic/ (history/v2, history/v3 in phase 6, minus the KEEP files),
│   │                            assets/, dialogue/, reel/ (← out/reel/ep01-act4-v5*), history/framing-v3 (phase 6)
│   ├── ep01/full-v3/            [fixed; Ep1 locked] ep01-v35.mp4 (THE FINAL FILM; SHA-1 in ops/reorg/ep01-final.sha1),
│   │                            picture-el/ + mix-v35-el/ (its chapters), assembly-v35/, picture/ (Kokoro), inserts/,
│   │                            runway/, assets/, thumbnails/, voices/, sheets; earlier rounds' films ep01-v3…v34*
│   ├── ep01/outro/              [fixed] outro B, the film's last chapter
│   ├── lookdev/
│   │   ├── looks/               ← out/dev/        (first look-development round)
│   │   ├── structures/          ← out/structures/
│   │   ├── pixel/               ← out/pixel/      (cast/, engine/)
│   │   ├── range/               ← out/range/      (incl. ep1/, the Ep1 range prototypes)
│   │   ├── jumps/               ← out/jumps/      (history/ ← prev/, phase 2)
│   │   ├── genvideo/            ← out/genvideo/
│   │   ├── outro/               [already here] the outro proposals (studio/src/dev/outro/)
│   │   └── clod-3d/             [already here] the 3D clay CLOD test (the final insert is in out/ep01/full-v3/inserts/)
│   └── review/                  ← out/review-desk/ (index.html + web copies)
└── .backups/                    [fixed, ignored] the originals of ops/workflows/ + the show tarball; never rewritten
```

The top level of `out/` goes from 12 folders (at 22:03; the 2 stray PNGs were deleted at 16:09) down to 4, plus a README. Intro audio goes from 8 places to 2: `audio/theme/` and `audio/intro/` (with `audio/sfx/intro/` kept as the board's own intro render). "Animatic" and "reel" each become clear from the path.

---

## 4. Move map

Every row lists the references that change. The v2 tool (Appendix B) rewrites everything marked *auto*, and was dry-run at about 16:45 on a copy of the tree as of 16:05, and again at about 22:10 on a copy as of 22:03. Line numbers in the rows are from 16:05 unless a row says otherwise; the dry run prints the current ones. Rows marked **hand** need a person. The tool lists them in its MANUAL output, and §7.3 step 4 says how to clear them.

### Phase 1: portability (no moves)

This phase replaces hard-coded roots with a marker lookup. Afterwards the project runs from any path, which matters for a successor on another machine, and moved code keeps finding the root.

- **The marker:** an empty, committed file at `/.mrmas-root`. `MRMAS_ROOT=<dir>` overrides it.
- **Python** (paste once per file; don't import a shared module, because scripts run under seven different venvs). The file must import both `os` and `sys`; `build_temp_track.py`, for one, imports `os` but not `sys`:
  ```python
  def _repo():
      for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
          d = start
          while True:
              if os.path.exists(os.path.join(d, '.mrmas-root')):
                  return d
              if d == os.path.dirname(d):
                  break
              d = os.path.dirname(d)
      sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')
  REPO = os.environ.get('MRMAS_ROOT') or _repo()
  AUDIO = os.path.join(REPO, 'audio')          # derived roots are joins on REPO, never dirname chains
  ```
- **Node and TS tools:**
  - `const REPO = process.env.MRMAS_ROOT ?? repo();`, where `repo()` does the same lookup, starting from `path.dirname(fileURLToPath(import.meta.url))` or `__dirname`, then from `process.cwd()`.
  - The cwd fallback matters for tools that are esbuild-bundled into a scratch folder first, such as `tools/render4.ts`.
- **Bash** (tested: it prints the root, and exits 1 with the message when there is no marker):
  ```bash
  REPO=${MRMAS_ROOT:-$(d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd); while [ ! -e "$d/.mrmas-root" ]; do [ "$d" = / ] && { echo "MR. MAS: no .mrmas-root above ${BASH_SOURCE[0]}; set MRMAS_ROOT" >&2; exit 1; }; d=$(dirname "$d"); done; echo "$d")} || exit 1
  ```
- **The v2 tool understands these three forms.** It treats `_repo()`, `repo()` and a shell value containing `.mrmas-root` as the repo root, so its later dry runs resolve every join built on `REPO`.
- **Scope: the code files that contain `/home/jgon`:** 61 at 15:10 (the table), and 81 at 22:03. Some hold the constant in a comment rather than code; rewrite those comments too.

  | Folder | Files |
  |---|---|
  | `audio/animatic` | `build_temp_track.py` |
  | `audio/ep01/act4/dialogue/tools` | `a4lib.py`, `audition.py`, `cast_a4.py`, `final_cast.py`, `make_doc.py`, `make_doc_32.py`, `pace_32.py`, `plot_mouth.py`, `record.py`, `record_32.py`, `reel.py`, `reel_32.py`, `v5/parse_plan.py`, `v5/qa_v5.py`, `v5/record_v5.py` |
  | `audio/intro-mix` | `scripts/encode_mux.sh` |
  | `audio/intro-vox` | `scripts/assemble.py`, `scripts/ivlib.py` |
  | `audio/mix` | `scripts/{mix,qa_plots,render_music}.py` |
  | `audio/ost` | `editor/{distinct,fix_tails,make_sampler,qa}.py`, `engine/{export,sampler}.py` |
  | `audio/sfx` | `scripts/dsp.py` |
  | `audio/theme` | `engine/{export,sampler}.py` |
  | `audio/vocals` | `scripts/{layout,vlib}.py` |
  | `audio/voices` | `tools/{cast,vcast}.py` |
  | `studio/src/dev/framing-v3` | `plan_v3.py` |
  | `studio/src/dev/intro/tools` | `contact_sheet.py`, `handoffs.py`, `master.sh` |
  | `studio/src/dev/range` | `p1/tools/sheet.py`, `p3/tools/{render.sh,sheet.py,stills.sh}` |
  | `studio/src/dev/reel` | `render_all.sh`, `season_sheet.py` |
  | `studio/src/episodes/ep01/act4/animatic/tools` | `board_v4.py`, `lock.py`, `lock_v2.py`, `lock_v3.py`, `lock_v4.py`, `mix_v3.py`, `mix_v4.py`, `premix_v2.py`, `render.ts`, `render4.ts`, `report_v3.py`, `report_v4.py`, `scratch_vo.py`, `shotlist_v4.py` |
  | `studio/src/episodes/ep01/act4/board/tools` | `board_v2.py`, `board_v3.py` |

  New since 15:10 (20 files, measured at 22:03):
  - `studio/src/dev/outro/`: `a/audio/track.py`, `a/tools/{build,standin}.py`, `b/audio/{mix,track}.py`, `b/tools/{render.sh,sheets.py}`, `c/audio/{mix,track}.py`, `c/tools/{render.sh,sheets.py}`, `d/audio/{mix,track}.py`, `d/tools/build.py`, `e/tools/{mix,track}.py`.
  - `studio/src/dev/range/`: `ep1-p1/tools/voice.py`, `ep1-p2/blender/duck.py`, `ep1-p2/tools/{build.sh,sheet.py}` (`build.sh:17` is `OUT=/home/jgon/...`).
  - Passes keep adding more, so re-run the phase 1 grep in §7.5 (block 2) to find the current list.
- **Also in scope: depth- and cwd-relative roots that a move breaks or that the tool can't evaluate.** The first three are what the v2 tool's phase 4 dry run lists as DEPTH:
  - `audio/intro-sfx/build_intro_sfx.py:33`, `audio/intro-sfx/make_previews.py:16` and `audio/animatic/build_temp_track.py:28`, each `AUDIO = os.path.dirname(HERE)`.
  - Also convert `audio/intro-mix/scripts/mixlib.py:21` (`'..','..','..'`) and `verify.py:22`. The v2 tool would recompute their `..` parts, but the marker is clearer.
  - Convert `audio/intro-mix/scripts/run_all.sh:5` (`PY=../../.venv-mix/bin/python`, cwd-relative) to `PY=$REPO/audio/.venv-mix/bin/python`.
  - Also the three cwd-relative range roots that phase 3 can't evaluate: `studio/src/dev/range/p1/tools/build.sh:8` (`ROOT=$(cd ../ && pwd)`), `ep1-p1/tools/build.sh:17` (`ROOT=$(cd .. && pwd)`) and `ep1-p3/tools/build.sh:9`. If phase 3 ran first, their `OUT=` lines were already hand-fixed there.
  - These two resolve against their own folder and stay correct: `audio/intro-vox/scripts/ivlib.py:15` and `audio/vocals/scripts/vlib.py:21`.
- **Out of scope:** the other depth-relative files that don't move, such as `audio/ep01/.../v5/record_v5.py` (`../../../../../.venv-casting`), `audio/ost/build.py` and `audio/reel/ep01-act4-v5/build_timeline.py`. They keep working, and can be converted opportunistically.
- **Docs:**
  - `docs/RENDERING.md` §0 and §1.1 ("clone to this path, or symlink, or rewrite the constant in 29 files") becomes "clone anywhere".
  - Delete `audio/mix/timeline.json`'s `paths_relative_to` note or leave it as a record; nothing reads it.
- **Verify** (commands in §7.5, block 2):
  - No `/home/jgon` is left in code.
  - Every edited file passes `py_compile`, `bash -n` or `node --check`.
  - `orgmove.py plan phase4.tsv` reports `MANUAL DEPTH (0)`.
  - **Portability test in a second checkout:**
    - Run `git worktree add <scratch>/wt`.
    - Run a few converted, read-only tools there without `MRMAS_ROOT`, with the main checkout's venv by absolute path. Candidates: `studio/src/dev/reel/season_sheet.py --help` and the `REPO` line of `audio/ost/engine/export.py`.
    - Confirm they resolve `REPO` to the worktree. *(critic)* `sync.mjs` and `build.py --index` don't exercise phase 1.

### Phase 2: low-risk tidy (dry run: 3 moves, 5 files, 0 manual)

| # | Old | New | Why | References (all *auto*) | Risk |
|---|---|---|---|---|---|
| 2.1 | `out/review-desk/` | `out/review/` | "Review" is the home for web copies. Nothing else is called that. | `.gitignore:71-72` (the two media rules). `index.html` uses relative `src=`, so nothing to change. | low |
| 2.2 | `out/jumps/prev/` (with `prev/r1/` inside) | `out/jumps/history/` (`r1/` inside) | The `history/` convention | `studio/src/dev/jumps/proto2/tools/build.sh:3` (comment); `show/bible/style-jumps.md` (4 lines) | low |
| 2.4 | `show/intro/_reviews/` | `show/intro/history/` | The convention | `docs/PIPELINE.md` (1 link) and `show/intro/SCRIPT.md` (links; the link labels keep the old name, so fix them by hand) | low |
| 2.6 | Empty folders: `out/dev/{castrivals,mcoldopen}`, `out/structures/{anime,collage,comic,realism}`, `studio/public/{audio,fonts,textures}`, `studio/src/shared/type`, `studio/src/shared/realism/tex` | removed, with `rmdir` (it refuses a non-empty folder) | Noise | none. **Keep** `audio/reel/preview`, `out/ep01/act4/animatic/scratch-vo/takes` and `.secrets`, which scripts write into. | none |
| 2.7 | Exact duplicates (§6.2) | the second copy deleted | Noise | none. **Ask first** (§9 item 4). | none |

**Removed from phase 2** *(critic findings, verified again at 16:30)*:
- **2.3, `dialogue/retired/`, is now the optional phase 2d below.** The draft-3.2 tools read and write it. §6.1 keeps those tools as the record of how the v4 takes were made.
- **2.5, `audio/intro-sfx/alt/`, is dropped.** `build_intro_sfx.py:1381-1386` writes the script-contract stem and spotting JSON there on every build, so it's an alternate, not a superseded round. It moves with `intro-sfx` in phase 4 and keeps its name.

### Phase 2d (optional): `dialogue/retired/` together with its tools (dry run: 1 move, 3 files, 10 prose lines)

Run this only if the showrunner wants the rename. Otherwise `retired/` stays, and `audio/ep01/act4/dialogue/README.md` says why.

| # | Old | New | References |
|---|---|---|---|
| 2d.1 | `audio/ep01/act4/dialogue/retired/` (with `3.1/`, 49M) | `audio/ep01/act4/dialogue/history/` | *auto* (the v2 tool resolves `ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")`): `tools/make_doc_32.py:17` and `tools/pace_32.py:55` (read `history/3.1/lines.json`), and `tools/record_32.py:350,362,365,369` (write `history/`). **Hand**: the prose that these tools write into the dialogue doc, in `make_doc.py:139,179,183,353`, `make_doc_32.py:85,107,161,195` and `lines_a4.py:505,508`. Change `retired/` to `history/` there, or list the lines in the ok-list as records. |

The tools and the move go in **one commit**. Verify: `py_compile` on the three tools, `test -f audio/ep01/act4/dialogue/history/3.1/lines.json`, and `bash ops/fraggrep.sh 2d` lists only the reviewed prose.

### Phase 3: `out/` mirrors the show (dry run at 22:10: 14 moves, 132 files, 3 hand fixes, 4 reviewed false positives)

The rows run in this order. `out/ep01/` doesn't move. Every reference below is *auto* unless marked **hand**.

| # | Old | New | Why | Code and JSON references (Markdown: count only) | Risk |
|---|---|---|---|---|---|
| 3.0 | `out/reel/ep01-act4-v5.mp4`, `ep01-act4-v5-sheet.png` | `out/ep01/act4/reel/` | The v5 stick-figure reel is Act Four's work (§2), not a season reel | none (the running v5 pass rendered them at 15:16–15:17 through `render_all.sh`'s default output) | low |
| 3.1 | `out/intro/` | `out/season/intro/` | The intro is season-level (`show/intro/`) | `audio/intro-mix/scripts/encode_mux.sh:10,11` (`PIC=$ROOT/out/intro/picture`, `OUT=$ROOT/out/intro`: the final V1–V4 mux); `mix_intro.py:102` and `build_intro_sfx.py:17,43` (the split `'out', 'intro', 'picture'` joins); `verify.py:22,133,212,236`; `run_all.sh:8`; `studio/src/dev/intro/entry.tsx:2,4,5`; `studio/src/dev/intro/tools/{contact_sheet.py:15, events.ts:5, handoffs.py:16, master.sh:13}`; `studio/src/intro/intro.frame.tsx:4`. Plus 14 MD, including `README.md:13`. | **medium**: the intro audio builders read `intro-events.json` from here |
| 3.2 | `out/animatic/` | `out/season/intro/animatic/` | It's the *intro's* stick animatic, and the name was overloaded | `studio/src/dev/animatic/entry.tsx:2`; `studio/src/reel/Reel.tsx:147` (a label drawn into reel frames, so later renders show the new path); 2 MD | low |
| 3.3 | `out/pixel/moments/` | `out/season/intro/moments/` | The six intro moments | Lines 2–3 of the six moment entries; the three `scratch_audio.py`; `meras/audio/sketch.ts:13`; `src/shared/pixel/kits/callgrid.ts:2` (comment); `show/.../act4/shots.json:9343` (v1 data, a record); 15 MD | low |
| 3.4 | `out/pixel/dinner-preview.png`, `out/pixel/moments-preview.png` | `out/season/intro/moments/` | Intro moments | none | none |
| 3.5 | `out/pixel/` (the rest: `cast/`, `engine/`) | `out/lookdev/pixel/` | Engine and cast tests are lookdev | `studio/src/dev/castmas/entry.tsx:2,3`, `castrivals/entry.tsx:2,3`, `pixelengine/entry.tsx:2`; MD | low |
| 3.6 | `out/reel/` | `out/season/reels/` | The season story reels | `audio/reel/build_all.py:11,30,86,107` (`:30` is the split `'out', 'reel'` join that `--mux` reads); `studio/src/dev/reel/render_all.sh:2,3,4,10,17,97` (`:17` is `OUT=${REEL_OUT:-$ROOT/out/reel}`); `season_sheet.py:2,3,9,69` (`:9` is `f'{ROOT}/out/reel'`); `studio/src/styleframes/reel.frame.tsx:5`; `out/review/index.html:115`; 4 MD. **Hand:** how act reels are rendered (below). | **medium**: the default output and mux input |
| 3.7 | `out/dev/` | `out/lookdev/looks/` | "dev" is ambiguous, because `studio/src/dev` is code | `studio/src/dev/{_example,anime,env,nole,title}/entry.tsx:2`; `studio/src/dev/range/p1/anime/KeyTest.tsx:3`; 13 MD | low |
| 3.8 | `out/structures/` | `out/lookdev/structures/` | | `studio/src/dev/{pixeladv,satire}/entry.tsx:2`; `studio/tools/genvideo/test_genvideo.py:6,7,44,110,111,118,233` (**reads `satire/scene.mp4` as test input**); 21 MD | **medium**: test-bench input |
| 3.9 | `out/range/` (incl. `ep1/`) | `out/lookdev/range/` | | `studio/src/dev/range/p1/entry.tsx:2`, `p1/tools/build.sh:2`, `p2/tools/build.sh:13`, `p3/Clod.tsx:3`, `p3/entry.tsx:4,5`, `p4/entry.tsx:9`, `range/tools/reel.py:18,35`, `ep1-p2/tools/build.sh:17`; `show/bible/style-range.md`. **Hand** (3 lines, commands below): `studio/src/dev/range/p1/tools/build.sh:9` (`OUT=$ROOT/out/range`), `ep1-p1/tools/build.sh:18` and `ep1-p3/tools/build.sh:10` (`OUT=$ROOT/out/range/ep1`). Each follows a cwd-relative `ROOT=$(cd .. && pwd)` that the tool can't evaluate. | low |
| 3.10 | `out/jumps/` | `out/lookdev/jumps/` | | `studio/src/dev/jumps/proto1/entry.tsx:2,3`, `proto1/tools/build.sh:6-9,15`, `proto2/entry.tsx:2,3`, `proto2/tools/build.sh:3,6,13,41`, `proto3/entry.tsx:3-5`, `proto3/tools/build.sh:6,11`, `proto3/tools/sound.mjs:9,19`, `jumps/tools/reel.sh:11`; `show/bible/style-jumps.md` | low |
| 3.11 | `out/genvideo/` | `out/lookdev/genvideo/` | | `studio/src/dev/genvideo/entry.tsx:4`; `studio/tools/genvideo/keyframes.py:174,189,259,260`, `test_genvideo.py:2,34,112,114`; `show/production/GENAI-UPGRADE-PLAN.md`, `studio/tools/genvideo/README.md` | low |
| 3.12 | `out/t.png`, `out/test-mas-looks.png` | **already deleted** at 16:09, uncommitted (§9 item 4); not in the manifest | Byte-identical to `out/dev/example.png`, and unreferenced | none | none |

**Act reels.**
- `render_all.sh` writes every reel to `$OUT`, which is `out/season/reels/` after phase 3. Render act reels with an explicit output, from `studio/`: `REEL_OUT=$PWD/../out/ep01/act4/reel NO_SEASON=1 bash src/dev/reel/render_all.sh ep01-act4-v5`. With `REEL_OUT` set, the script skips the season sheet.
- Or add ID-based routing to `render_all.sh`, and send `ep[0-9][0-9]-act*` keys to `out/epNN/actN/reel/`.
- Tell the v5 pass before phase 3 runs, and update its brief.
- The newer episode-reel tool, `studio/src/reel/tools/episode.mjs`, already writes to `out/epNN/reel/<key>.mp4` and needs nothing from phase 3. Its README line 28 (`render_all.sh` "renders to `out/reel/`") is rewritten automatically.

**Hand fixes after `apply`** (tested on the 22:03 copy). Run from the repo root:
```bash
sed -i 's#^OUT=\$ROOT/out/range$#OUT=$ROOT/out/lookdev/range#' studio/src/dev/range/p1/tools/build.sh
sed -i 's#^OUT=\$ROOT/out/range/ep1$#OUT=$ROOT/out/lookdev/range/ep1#' studio/src/dev/range/ep1-p1/tools/build.sh studio/src/dev/range/ep1-p3/tools/build.sh
bash -n studio/src/dev/range/p1/tools/build.sh studio/src/dev/range/ep1-p1/tools/build.sh studio/src/dev/range/ep1-p3/tools/build.sh
```

**`phase3.ok.tsv`**, the four reviewed false positives (tab-separated; the text is the stripped line):
```
audio/ep01/act4/dialogue/tools/fastrec/fastrec.py	f"{rel(os.path.join(out, 'qa', 'qa-v5.json'))}, string-outs in {rel(os.path.join(out, 'reel'))}/")	joins 'reel' onto fastrec's own --out folder, not out/reel
audio/ep01/act4/dialogue/tools/fastrec/fastrec.py	os.makedirs(os.path.join(out, "reel"), exist_ok=True)	joins 'reel' onto fastrec's own --out folder, not out/reel
audio/ep01/act4/dialogue/tools/fastrec/fastrec.py	mp = os.path.join(out, "reel", f"sc{sc}-fast-stringout.mp3")	joins 'reel' onto fastrec's own --out folder, not out/reel
studio/src/reel/tools/episode.mjs	const OUT = path.resolve(opt.out ?? path.join(ROOT, 'out', Number.isFinite(epNo) ? `ep${String(epNo).padStart(2, '0')}` : 'season', 'reel', `${KEY}${opt.only ? '-' + String(opt.only).replace(/,/g, '+') : ''}.mp4`));	builds out/<epNN|season>/reel/<key>.mp4, not out/reel
```
If `fastrec.py` or `episode.mjs` has changed, copy the current line text from the dry run's FRAGMENT list instead, after checking that it's still a false positive.

**After phase 3:** none of `out/intro`, `out/reel`, … exist again (§7.5, block 1 check 9). `orgmove.py frag phase3.tsv phase3.ok.tsv` exits 0, and `bash ops/fraggrep.sh 3` prints nothing (tested at 22:03: 120 lines before, 0 after).

### Phase 4: intro audio in one place (dry run at 22:10: 7 moves, 35 files; needs phase 1 first)

| # | Old | New | Why | References | Risk |
|---|---|---|---|---|---|
| 4.1 | `audio/intro-mix/` | `audio/intro/mix/` | Intro audio was in 8 places | *auto*: `mixlib.py:1,21,23` (`OUT_DIR = os.path.join(AUDIO, 'intro-mix')` becomes `'intro/mix'`); `encode_mux.sh:9`; `audio/intro-sfx/make_previews.py:7` (doc). 10 MD. | medium |
| 4.2 | `audio/intro-sfx/` (with `alt/`) | `audio/intro/sfx/` | | *auto*: the intro mix's inputs, `mix_intro.py:164-169` (`j('intro-sfx/...')` becomes `j('intro/sfx/...')`), `analyze_inputs.py:12-13`, `sfx_balance.py:10`, `verify.py:132,156,161`; `build_intro_sfx.py:7,18` and `make_previews.py:1` (docs). **Hand:** `studio/src/dev/range/p2/tools/cue.py:101-102` (`AUDIO` is `argv[1]`) and `studio/src/dev/jumps/proto2/tools/mix.ts:69,85` (`root` is passed in by `build.sh`); change `intro-sfx/` to `intro/sfx/`. **Hand:** the stem labels that `build_intro_sfx.py:1422-1424` writes into its records. **Regenerated:** `spotting.json` and `alt/spotting_script-v2.1-frames.json` hold audio-relative paths that the next SFX build rewrites. 6 MD. | medium |
| 4.3 | `audio/intro-vox/` | `audio/intro/vox/` | | *auto*: `analyze_inputs.py:14-18`, `mix_intro.py:166-169`; `ivlib.py:15` (its own folder, stays correct). **Docs:** in `README.md:154`, `PY=../../.venv-vocals` becomes `../../../.venv-vocals`. 5 MD. | low |
| 4.4 | `audio/vocals/` | `audio/intro/vocals/` | It's all intro material (the cold-open VO, chant, harmony, intro layer), and it ends the `vocals` versus `voices` confusion | *auto*: `ivlib.py:3,8,19,24`, `build_chant.py:15`, `build_pad.py:8`; `make_previews.py:37` and `build_temp_track.py:30` (`os.path.join(AUDIO, 'vocals', 'vo', ...)` becomes `'intro/vocals/vo/...'`). **Docs:** in `audio/vocals/README.md:253`, `PY=../.venv-vocals` becomes `../../.venv-vocals`. 8 MD, including `show/intro/SCRIPT.md`. | medium |
| 4.5 | `audio/animatic/` | `audio/intro/animatic/` | The intro stick animatic's temp track | **Depth** (phase 1 clears it): `build_temp_track.py:28`. `docs/RENDERING.md` §3.2, `show/intro/SCRIPT.md:601`. | low |
| 4.6 | `audio/mix/` | `audio/intro/history/sketch-mix/` | The first intro sketch mixes, superseded by `intro-mix` | *auto*: `audio/intro-vox/scripts/assemble.py:82` (`f'{AUDIO}/mix/music/...'`, the fallback read). The label on `:84` is a record. Files that move into `history/` aren't rewritten (`mix.py`, `qa_plots.py`, `render_music.py`). 7 MD. | low |
| 4.7 | `audio/LISTENING_GUIDE.md` | `audio/intro/history/sketch-mix/LISTENING_GUIDE.md` | It describes only the sketch mixes | `docs/PIPELINE.md`, `docs/RENDERING.md` | none |

**One depth break the tool can't see:** `run_all.sh:5` (`PY=../../.venv-mix/bin/python`). It's relative to the script's folder after `cd "$(dirname "$0")"`, and would point at `audio/intro/.venv-mix` after the move. Phase 1 converts it to `$REPO/audio/.venv-mix/bin/python`. Check that line by hand before phase 4.

**Before phase 1, the tool lists three DEPTH lines** (`AUDIO = os.path.dirname(HERE)` in `build_intro_sfx.py:33`, `make_previews.py:16` and `build_temp_track.py:28`). Each points at `audio/intro` once its file moves.
- Tested on a copy: with those three lines converted to `AUDIO = os.path.join(REPO, 'audio')`, the dry run reports `DEPTH (0)`.
- After apply, every path constant in the moved scripts resolves to the right folder: `ROOT`, `AUDIO`, `OUT_DIR`, `SFXLIB`, `EVENTS_JSON`, `VO`.
- **Don't run phase 4 while its dry run lists a DEPTH line.**

**Hand fixes after `apply`** (tested on the 22:03 copy, after the phase 1 simulation). Run from the repo root:
```bash
sed -i "s#'intro-sfx/src/#'intro/sfx/src/#" studio/src/dev/range/p2/tools/cue.py              # :101-102, AUDIO is argv[1]
sed -i 's#${root}/intro-sfx/src/#${root}/intro/sfx/src/#' studio/src/dev/jumps/proto2/tools/mix.ts   # :69,85, root comes from build.sh
sed -i 's#"intro-sfx/\(intro-sfx_stem\|intro-sfx_extras\|intro-blip_stem\|alt/intro-sfx_stem_script-v2\.1-frames\)\.wav"#"intro/sfx/\1.wav"#g' \
  audio/intro/sfx/build_intro_sfx.py                                                           # the stem labels it writes into its records
python3 -m py_compile studio/src/dev/range/p2/tools/cue.py audio/intro/sfx/build_intro_sfx.py
```

**`phase4.ok.tsv`** (the two JSON files are rewritten by the next SFX build, which §7.5 block 2 runs):
```
audio/intro/sfx/spotting.json	*	SFX build record; the next build rewrites it
audio/intro/sfx/alt/spotting_script-v2.1-frames.json	*	SFX build record; the next build rewrites it
audio/intro/vox/scripts/ivlib.py	"""intro-vox shared helpers (dialogue / vocal editor pass for the 30.000 s Ep1 intro).	prose: the pass name
```

After that, `frag` exits 0. `bash ops/fraggrep.sh 4` still prints 6 lines, all prose: the `mix_intro.py` docstring (`:9,11,13` name `intro-sfx/…` and `intro-vox/…` relative to `audio/`; update them to `intro/sfx/…` and `intro/vox/…` if you like), `assemble.py:1`, and `ivlib.py:1,19` (the pass name). Tested at 22:03: 54 lines before, 6 after.

**New readers since 16:05, rewritten automatically:** `studio/src/dev/outro/b/audio/mix.py:34` (`os.path.join(ROOT, 'audio/intro-sfx/src')`), `outro/d/audio/mix.py:85,96` (`f'{ROOT}/audio/intro-sfx/src/...'`) and `studio/src/reel/examples/ep01-full-v1.manifest.json:17` (the intro mix a full-episode reel plays).

`audio/sfx/intro/` stays inside the SFX board, because `sfx/scripts/build.py` writes it. `audio/theme/` stays (§5).

### Phase 5a: shipped studio code stops importing `src/dev/` (dry run at 22:10: 5 moves, 119 files)

**Step 1: promote five files** with the §7.3 loop (table below). The tool rewrites every importer's relative path.

**Step 2, right after `apply`: repoint the shims.**
- Eight files outside `src/dev/` then import `src/dev/pixeladv/core/{px,palette,figure,light}`: `src/shared/pixel/cast/{alyi,bosses,gerg,kit,mario,mas,nole}.ts` and the just-moved `src/shared/pixel/rooms/room.ts`.
  - Four more, `src/shared/pixel/{px,palette,figure,light}.ts`, only name the old path in a "Promoted from" comment. Leave those.
- Those `core` modules are pure `export * from '../../../shared/pixel/<x>'` shims, so each import becomes `'../<x>'`. The shims stay in place for the lookdev code in `src/dev/`.
- Tested on the 22:03 copy (the typecheck was identical to the baseline afterwards). Run from the repo root:
  ```bash
  cd studio/src/shared/pixel && sed -i -E "s#from '\.\./\.\./\.\./dev/pixeladv/core/(px|palette|figure|light)'#from '../\1'#" \
    cast/{alyi,bosses,gerg,kit,mario,mas,nole}.ts rooms/room.ts && cd -
  ```

**The five files:**

| # | Old | New | Importers outside `src/dev/` |
|---|---|---|---|
| 5a.1 | `studio/src/dev/makeRoot.tsx` | `studio/src/shared/makeRoot.tsx` | `src/Root.tsx:2`; all 7 Act Four `entry.tsx` files; the dev entries (internal), including the five outro and three Ep1 range entries added since 16:05; `studio/src/reel/tools/episode.mjs:89` (a bundle input list) |
| 5a.2 | `studio/src/dev/pixeladv/tools/png.ts` | `studio/src/shared/pixel/png.ts` | 10 `src/episodes/ep01/act4/**/tools/*.ts` (for example `kits/tools/preview.ts:6`, `kits/tools/bpcheck.ts:2`) |
| 5a.3 | `studio/src/dev/pixeladv/art/room.ts` | `studio/src/shared/pixel/rooms/room.ts` | `src/episodes/ep01/act4/animatic/backs.ts`, `rooms-a/plates.ts` |
| 5a.4 | `studio/src/dev/mcoldopen/orb.ts` | `studio/src/shared/pixel/cast/orb.ts` | `src/shared/pixel/kits/inserts-mas.ts:172`, `src/episodes/ep01/act4/rooms-b/scenes.ts:15` |
| 5a.5 | `studio/src/dev/mfinale/callart.ts` | `studio/src/shared/pixel/kits/callart.ts` | `src/episodes/ep01/act4/cast/sheet.ts:29` |

**What the dry run leaves:**
- **COMPOSED, 2 lines:** `studio/src/dev/intro/tools/events.ts:24-25` build `` `studio/src/dev/${m}/...` `` from a moment name, so they can't name `makeRoot.tsx`. Put them in the ok-list.
- **Records, 12 lines:** the provenance strings in `board_v2.py` and `lock_v2.py`, 3 comments (`mfinale/title.ts:3`, and `outro/c/tools/png.ts:2` and `range/p2/tools/png.ts:2`, which say they copy `pixeladv/tools/png.ts`), and the v1/v2 shot JSON. Leave them, and list them in `phase5a.ok.tsv` from the dry run's output.

**The invariant afterwards:** `git grep -nE "from '(\.\./)+dev/" -- studio/src ':!studio/src/dev/**'` lists only `src/intro/scenes.ts:8-16` and the 14 styleframe wrappers (tested at 22:03, after step 2).
- Phase 5b repoints `scenes.ts` and the 6 intro-moment wrappers.
- The other 8 wrappers stay, as the documented lookdev pattern: `castmas`, `castrivals`, `pixeladv`, `pixelengine`, `satire` and `jumps/proto1–3`.

**Registration doesn't change.** No `*.frame.tsx` moves, so the composition lists must match the baseline exactly (§7.5).

### Phase 5b (optional): intro code beside the intro (dry run at 22:10: 14 moves, 139 files)

| # | Old | New |
|---|---|---|
| 5b.1–6 | `studio/src/dev/{mcoldopen,meras,mdinner1,mdinner2,mrollcall,mfinale}/` | `studio/src/intro/moments/<same name>/`. Keep the names: the `m` prefix appears to mean "moment", matching `out/.../moments/mcoldopen-*.png` and `studio/notes/mcoldopen.md`. Confirm that, and document it in `src/intro/README.md`. |
| 5b.7–9 | `studio/src/dev/intro/{entry.tsx,review.tsx,tools/}` | `studio/src/intro/{entry.tsx,review.tsx,tools/}` |
| 5b.10 | `studio/src/dev/animatic/` | `studio/src/intro/animatic/` |
| 5b.11–14 | `studio/src/dev/reel/entry.tsx`; `render_all.sh`, `season_sheet.py`, `stills.mjs` | `studio/src/reel/entry.tsx`; `studio/src/reel/tools/` |

**References that change** (*auto* unless marked):
- The imports in `src/intro/scenes.ts:8-16`, the 6 moment styleframe wrappers, and the Act Four imports (none left if 5a ran).
- The header comments in `src/shared/pixel/{cast,kits,rooms}`.
- Every render command naming `src/dev/m*/entry.tsx`, `src/dev/intro/entry.tsx` or `src/dev/reel/*`. That covers `docs/RENDERING.md`, 12 files in `studio/notes/` and `show/intro/SCRIPT.md`.
- `audio/intro-sfx/build_intro_sfx.py:142,145`. The SFX builder reads the moments' own source (`os.path.join(PROJ, "studio", "src", "dev", "mcoldopen", "timeline.ts")`); the tool rewrites it to `"studio/src/intro/moments/mcoldopen/timeline.ts"`.
- `studio/src/dev/reel/render_all.sh:99` (`$STUDIO/src/dev/reel/season_sheet.py`), `stills.mjs:29` and `animatic/stills.mjs:6`.
- New since 16:05: `studio/src/reel/tools/episode.mjs:90,100` (it bundles `src/dev/reel/entry.tsx`), and the outro prototypes' imports of intro moment code (`studio/src/dev/outro/{a,b,c,d,e}/`).
- **Hand:** `studio/src/dev/intro/tools/events.ts:24-25` build the `src` labels of `intro-events.json` as `` `studio/src/dev/${m}/...` ``. Change them to `` `studio/src/intro/moments/${m}/...` ``, then re-export the events (§7.5 check 13). Tested on the 22:03 copy, after `apply`, from the repo root:
  ```bash
  sed -i 's#`studio/src/dev/\${m}/#`studio/src/intro/moments/${m}/#' studio/src/intro/tools/events.ts
  ```
  That clears both COMPOSED lines, and the studio typecheck stays identical to the baseline.
- **Records, 13 lines after the hand fix:** the moment labels in `build_intro_sfx.py:113-116` and in `picture-sync.json`, the v2 shot JSON, and the provenance strings in `lock_v2.py` and `board_v2.py`. List them in `phase5b.ok.tsv`, or refresh the SFX ones with the next SFX build. `bash ops/fraggrep.sh 5b` then prints 7 lines, all of them these records (119 before).

**Git's rename detection** shows the seven small `entry.tsx` files as `D` + `A` pairs after apply, because their few lines all change. That's expected (tested). Check that each `A` is the `D`'s manifest destination.

**Risk:** medium to high. The composition IDs don't change, but every intro render command does. Do it only when no intro or picture pass is running, and prefer to wait until after the Ep1 picture lock.

### Phase 6: Act Four history (only after the Act Four v5 pixel lock; dry run at 22:10: 26 moves, 26 files)

| # | Old | New | Notes |
|---|---|---|---|
| 6.1 | `show/episodes/ep01/production/act4/{shotlist.md, shots.json, shots-locked.json}` (v1) | `…/act4/history/` | Read only by `lock.py` and `board_v2.py`, and the comments in `kits/plan.ts:2` and `animatic/plan25.ts:7` |
| 6.2 | `…/act4/{shotlist-v2.md, shots-v2.json, shots-locked-v2.json, chunks-v2.md, timing-v2.md}` | `…/act4/history/` | `shots-locked-v2.json` and `timing-v2.md` are **the lock that the album cues mm10 and mm11 are timed to**. They're cited in `audio/ost/tracks/mm10-his-side-745/track.py:500` (the description string, written into its `.cue.json`), `mm11-the-return/track.py:31` and both READMEs. `mm07/track.py:39` cites `chunks-v2.md`. `studio/src/dev/framing-v3/plan_v3.py:179,201` **loads** `shots-locked-v2.json`. `lock_v2.py` (KEEP) reads `shots-v2.json`; the tool rewrites its path. |
| 6.3 | `…/act4/{shotlist-v3.md, shots-v3.json, chunks-v3.md, timing-v3.md, diagnosis-v3.md, sound-diagnosis-v3.md, framing-v3.json, framing-v3.md}` | `…/act4/history/` | **`shots-locked-v3.json` is KEEP until the Act Four v5 pixel lock.** `report_v4.py:137` builds its name as `f"shots-locked-{v}.json"`, and the v2 tool reports that line as COMPOSED. `lock_v3.py` (KEEP) reads `shots-v3.json`, and the tool rewrites that path. |
| 6.4 | `out/ep01/act4/animatic/{act4-animatic-v2.mp4, act4-dialogue-premix-v2.cues.json, act4-v2-contact.png, layout-v2.json, lock-raw.json, scratch-vo/}` | `out/ep01/act4/animatic/history/v2/` | `scratch-vo/` is also named in `audio/ep01/act4/dialogue/tools/lines_a4.py:515` and `make_doc.py:518` (draft-3 tools). `act4-dialogue-premix-v2.wav` was deleted at 16:09, so it's not in the manifest. |
| 6.5 | `out/ep01/act4/animatic/{act4-animatic-v3.mp4, act4-v3-contact.png, layout-v3.json}` | `…/animatic/history/v3/` | Cited in `show/bible/flow-and-continuity.md` (the showrunner's v3 notes) and `show/episodes/ep01/script.md`. **`act4-mix-v3.wav` and `act4-mix-v3.cues.json` are KEEP until the Act Four v5 pixel lock:** `report_v4.py:138,144` loads them as `f"act4-mix-{v}..."`. `act4-dialogue-premix-v3.wav` was deleted at 16:09, so it's not in the manifest. |
| 6.6 | `out/ep01/act4/framing-v3/` | `out/ep01/act4/history/framing-v3/` | 2 MD |
| 6.7 | Retired Act Four code | **KEEP until the Act Four v5 pixel lock**; then re-derive what can go | **KEEP:** the eight TS modules `animatic/{data-v2,data-v3,sound-v3,frame,shots,shots3,plan25,plan25v3}.ts` and their generators `tools/{lock_v2,lock_v3,mix_v3}.py`. The v4 composer imports five of the modules directly: `shots4.ts:66-71` imports `shots`, `shots3`, `data-v3` and `data-v2`; `frame4.ts:24` and `Animatic.tsx:9` import `frame`; `lay.ts:29` imports `data-v2`; `frames.ts:9` imports `data-v3`. Style-jump prototype 1 (`studio/src/dev/jumps/proto1/lockv2.ts:13-15`) imports `data-v2` and `shots`. The other three come in through those. **Candidates at the v5 pixel lock**, deleted only if the showrunner agrees (§9 items 4–5): `tools/{lock,premix_v2,report_v3}.py`, `tools/render.ts`, `board/tools/{board_v2,board_v3,board_v3_md}.py` and `studio/src/dev/framing-v3/`. Re-derive the list from the import graph first (`tsc` after a trial delete on a branch). Unregister the v3 compositions in `animatic/frames.ts` only if the showrunner agrees v3 needn't be re-renderable; its MP4 is kept either way. |

**At the v5 pixel lock, before phase 6:** re-run the dry run, and read every COMPOSED and FRAGMENT line. At 16:45, and again at 22:10, there was 1 COMPOSED: `report_v4.py:137`, whose `shots-locked-` prefix also matches the moved `shots-locked.json` and `-v2.json`. It's harmless, because `load_cut` is only called with `"v3"` and `"v4"`; put it in the ok-list. There were also 34 FRAGMENT lines (33 with the 26-row manifest), mostly provenance strings in `board_v3.py`. With the old 28-row manifest, the 22:10 dry run warned `neither … nor … exists (deleted?)` for the two premix WAVs, and `apply` would have stopped at `missing source`.

**Leave for the Act Four lead to sort:** the unversioned docs from the v1/v2 era that tools still read. `dialogue.md` is read by `make_doc.py`, `pov-changes.md` by `lines_a4.py` and `board_v2.py`, and `tighten-changes.md` by `lines_a4_32.py` and `board_v3.py`. The others are `cast.md`, `kits-fx.md`, `rooms-a.md`, `rooms-b.md` and `_prep-reports/`.

**Considered and rejected:** a `data/` subfolder for Act Four's machine JSON. More than 20 tools read it by path, and once `history/` exists only two current JSON files remain. The gain isn't worth the risk.

---

## 5. What does not move, and why

| Keep | Why |
|---|---|
| `show/production/SHOWRUNNER-NOTES.md` | Every workflow brief reads this exact path first, and the workflow scripts hard-code it |
| `studio/src/Root.tsx`, `studio/src/index.ts`, `studio/package.json` scripts, and the rule that `*.frame.tsx` files live under `studio/src/` | `Root.tsx:6` auto-registers every `*.frame.tsx` under `src/` (31 today). Moving one out, or renaming it, removes compositions **with no error**. |
| `studio/src/reel/data/`, `studio/src/reel/sync.mjs`, `show/reel/` | `registry.ts` loads `require.context('./data')`, and `sync.mjs:13` resolves `../../../show/reel` by depth |
| `studio/public/` (including `genvideo/<shot>/`) and `studio/src/dev/range/p3/public/` | They are Remotion's `staticFile()` roots. `GenVideo.tsx` resolves committed inserts by these paths, and p3 renders need `--public-dir=src/dev/range/p3/public`. |
| `studio/node_modules`, `studio/out` (bundle cache), `studio/.remotion` | Tooling. Regenerable and ignored. |
| The name `studio/src/dev/` | 103 code files and every render command name it. Phases 5a and 5b take the shipped code out of it; the name then honestly means lookdev and R&D. |
| `studio/notes/` and the three `studio/*.md` guides | Code headers name them (43 and 46 files). Low value in moving. |
| Python tools inside `studio/src/episodes/ep01/act4/*/tools/` | They are active, depth-relative and read across five trees. Revisit after the Act Four lock. |
| The Act Four v2/v3 modules and generators, and `report_v4.py`'s three v3 inputs (§0, §4 phase 6) | The v4 animatic imports the modules, and `report_v4.py` builds the file names from a version. **KEEP until the Act Four v5 pixel lock.** |
| `audio/.venv*` | A venv hard-codes its own absolute path (the `bin/` shebangs and `pyvenv.cfg`). Moving one means re-creating it from `audio/requirements/`. |
| `audio/samples/`, `audio/requirements/` | `fetch_samples.sh` and `MANIFEST.sha256` expect `audio/samples/`, and the engines load libraries from it |
| `audio/theme/` | The OST engine imports the theme engine by path (`audio/ost/engine/{__init__,core,motifs,sampler}.py`), and the intro mix and vocals read its masters |
| `audio/ost/` and every `tracks/<id>/` name | `build.py`, `index.json`, `ost-index.json`, the cue JSON, `lock-v4.0.json` and the 138K OST-BIBLE name the track folders. `build.py` skips `_`-prefixed folders. The duplicate `mm13` ID and the mixed album and to-picture IDs are documented, not renamed. |
| `audio/sfx/` | 13 code files across the tree read the board |
| `audio/ep01/act4/dialogue/` (`takes/`, `optional/`, `clean/`, `fallback/`, `wav/`, `mp3/`, `v5/`, **`retired/`**) | `lines.json` holds 227 paths into these folders and `lines-v5.json` holds 541, and the mixers read them. `retired/` is read and written by the draft-3.2 tools (phase 2d is optional). |
| `audio/intro-sfx/alt/` (inside `audio/intro/sfx/` after phase 4) | `build_intro_sfx.py:1381-1386` writes the script-contract stem and its spotting JSON there on every build. It's an alternate, not an older round. |
| `audio/voices/`, `audio/reel/` | Dialogue tools (`a4lib.py`, `cast_a4.py`) read the casting. The reel beds carry a `.gitignore` rule and are referenced by `studio/src/reel/schema.ts`. |
| The `show/` content folders | About 2,450 relative Markdown links; `_sources/` is cited from 86 files |
| `out/ep01/act4/` | Already mirrors the show |
| `ops/` and `ops/workflows/` | Tools and records. The move tool never rewrites them (`SKIP`); translate an old workflow's paths with the §4 tables before re-running it. |
| Records: `.backups/`, git history, `*.log`, the QA and cue JSON under `out/` and `*/qa/`, contact sheets, the HTML review pages, rendered MP4s | They record what was true when they were made. The move tool skips them (the `SKIP` list in Appendix B). Use the §4 tables to translate old paths. |
| `.env`, `.secrets/` | Secrets |

**Workflow scripts:**
- A re-run of an old workflow writes to old paths. Few scripts are exposed to phases 2–5:
  - The style-jumps script mentions `out/jumps` 9 times, and the style-range script mentions `out/range` 7 times.
  - `out/intro`, `out/dev`, `out/structures`, the four intro-audio folders and `src/dev/makeRoot` get one or two mentions each.
- After phase 0, the scripts live in `ops/workflows/` as records.
- To re-run one after a reorg phase, copy it and run `orgmove.py`'s rewrite on the copy: put the copy outside `ops/`, run `plan`, and apply the diff by hand.
- The lead keeps the live templates, if any, outside the repo. Note where in `ops/workflows/README.md`.

---

## 6. Stale generations: archive or delete

"Archive" here means moving the files to `history/` beside the current version. Nothing is deleted without the showrunner's OK (§9 item 4 is still waiting). All sizes were measured at 15:10.

**Already deleted at 16:09:37** (found at 22:03; no approval is recorded): the two premix WAVs, `out/dev/screen/scene-v1.mp4` and `scene-v2.mp4`, the 4K intro pair, and the seven duplicate PNGs in §6.2. Each row says so. The tracked PNGs can still be restored from git (`git checkout HEAD -- <path>`). The ignored files can only be regenerated: the premixes with `premix_v2.py` and `mix_v3.py`, the 4K pair with `master.sh 4k` and `encode_mux.sh`.

### 6.1 Older rounds

| Item | Size | Superseded by | Still read by | Recommendation |
|---|---|---|---|---|
| Act Four v2 renders: `act4-animatic-v2.mp4` (34.1M), `act4-dialogue-premix-v2.wav` (62.3M), contact sheet, layout, cues | 97.3M | v4, with v5 in progress | `lock_v2.py` and `premix_v2.py`; `timing-v2.md` | Phase 6: `history/v2/`. **Keep** the MP4 and contact sheet for comparison. The 62M premix WAV: **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). |
| Act Four v3 renders: `act4-animatic-v3.mp4` (24.6M), `act4-mix-v3.wav` (68.4M), `act4-dialogue-premix-v3.wav` (34.2M), contact sheet, layout, cues | 128.0M | v4 | `mix_v3.py` and `report_v3.py`; the showrunner's v3 flow notes; **`report_v4.py`**, which loads `act4-mix-v3.wav` and its cues | Phase 6: `history/v3/`, **except `act4-mix-v3.wav` and `.cues.json`, which are KEEP in place until the Act Four v5 pixel lock**. **Keep** the MP4 (the showrunner's notes refer to it). The premix WAV (34.2M): **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). |
| `lock-raw.json` (the v1 lock) and `scratch-vo/` | 2.2M | v4 | the retired tools; draft-3 dialogue tools | Phase 6, `history/v2/`; keep |
| Act Four docs and data v1–v3 (17 files) | about 2.9M | v4, v5 | retired tools; OST mm07, mm10 and mm11 provenance; `plan_v3.py`; `report_v4.py` (`shots-locked-v3.json`) | Phase 6, `act4/history/`, except `shots-locked-v3.json` (KEEP); keep all |
| Act Four code v2/v3 | about 0.7M | v4 | **the v4 composer** (`shots4.ts`, `frame4.ts`, `Animatic.tsx`, `lay.ts`, `frames.ts`) and style-jump prototype 1 | **KEEP** the eight modules and their three generators until the Act Four v5 pixel lock. Then re-derive the deletable Python tools and `dev/framing-v3/` (§4, 6.7), and **ask first**. Recoverable from git `d7c5b40`. |
| `audio/ep01/act4/dialogue/retired/` (with `3.1/`) | 49M | the v4 `lines.json` | the draft-3.2 tools `make_doc_32.py:17`, `pace_32.py:55` and `record_32.py:350-369` | **Keep in place.** Phase 2d renames it to `history/` only together with those tools. Delete only if the showrunner asks. |
| Dialogue draft-3.x tools (`*_32.py`, `record.py`, `reel.py`, `make_doc.py`, `lines_a4.py`) | about 0.2M | `tools/v5/` | themselves | Keep. They document how the v4 takes were made. |
| `out/jumps/prev/` (round 2, 12.1M) and `prev/r1/` (round 1, 10.8M) | 22.9M | round 3 | `proto2/tools/build.sh:3`, `style-jumps.md` | Phase 2: `history/`; keep |
| `out/dev/nole/`: `tone-test-v1…v7`, `big-paint-v1/v3/v4`, `big-noir-v3`, `expressions-v1/v2`, `lineup-v1` | about 31M | `tone-test-v8` | nothing | Keep in place (lookdev record). `history/` is optional. |
| `out/dev/screen/scene-v1.mp4`, `scene-v2.mp4` | 4.8M | `scene-v3.mp4` | nothing | **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). |
| `out/intro/intro-ep1-V1-4k.mp4` | 9.7M | the 1080p V1 | `verify.py:22` (runs only if the file exists), RENDERING ("legacy"), `review/mr-mas-opening.html:155` | **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). `docs/RENDERING.md` records it under the 1080p-max rule. `verify.py:22` and `encode_mux.sh:29` check for the file first, so nothing breaks. Retiring `master.sh`'s `4k`/`all` modes is still open. |
| `out/intro/picture/intro-ep1-4k-silent.mp4` | 8.8M | the 1080p silent master | `encode_mux.sh:29`, `master.sh 4k` | **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). |
| `audio/mix/` (the intro sketch mixes V1–V4, `music/` rollcall themes, QA) + `LISTENING_GUIDE.md` | 78M | `audio/intro-mix/` | the `assemble.py:82` fallback | Phase 4: `audio/intro/history/sketch-mix/`; keep |
| `audio/intro-sfx/alt/` (the script-v2.1-frame stem) | 8.4M | — (an alternate) | **`build_intro_sfx.py:1381-1386` writes it on every build** | **Not stale.** It moves with `intro-sfx` in phase 4 and keeps its name. |
| `show/intro/_reviews/` (the v2.0 backup and three reviews) | 152K | `SCRIPT.md` v2.1 | `PIPELINE.md`, `SCRIPT.md` | Phase 2: `history/`; keep |
| Older OST to-picture cues: `e01-s26-the-falling-tile` (lock v3), `e01-s29-d5` and `e01-s30a-the-door` (lock v2) | 75.9M | `e01-act4-v4` | the OST index, SAMPLER, OST-BIBLE | **Don't move** (track IDs are referenced). The OST owner marks their status in the index and bible. |
| `mm07-how-to-fire-a-ceo/render/e01-s25-*` (the lock-v2 era) and `render/alt/` | part of 221M | | SAMPLER.md | Leave. It's the OST owner's call. |

**Not stale, despite appearances:**
- `out/pixel/moments/_cut/` (0.6M) holds cut *content*, not an older version.
- `out/range/p2-alt.mp4` (9.7M) is an alternative take.
- `audio/animatic/` (9.0M) is the only record of the stick-animatic stage.
- `audio/ep01/act4/dialogue/{takes,optional,auditions}` are read by the v4 `lines.json`, or are the Act Four casting record.

### 6.2 Duplicates and caches

| Item | Size | Recommendation |
|---|---|---|
| `out/t.png` and `out/test-mas-looks.png` (= `out/dev/example.png`, md5 `ad174d60…`) | 4.0M | **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). |
| `out/dev/tonetest.png` = `out/dev/render/tonetest.png` | 2.4M | `out/dev/render/tonetest.png`: **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). The root copy, which `studio/notes/render.md:24` writes, is kept. `render.md:30` still says "(also `out/dev/render/tonetest.png`)"; drop that clause. |
| `out/dev/nole/nole-tone-test.png` = `tone-test-v8.png` | 2.4M | `nole-tone-test.png`: **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). `tone-test-v8.png` is kept, and `studio/notes/nole.md:107` now names it. |
| `out/dev/shape/shape-extra-{mascu,switch}.png` = `out/structures/shape/extra-*.png`; `out/dev/screen/screen-extra-lineup.png` = `out/structures/screen/extra-lineup.png` | about 3.9M | The three `out/dev/` copies: **Deleted at 16:09** (uncommitted; §0.1, §9 item 4). The `structures/` copies are kept (their REPORT.md links them). `shape-extra-lineup.png` is **not** a duplicate (md5 `2d201863…` against `3d9650df…`), and is still there. |
| `out/pixel/moments/audio/mfinale-mix.wav` = `out/pixel/moments/mfinale-scratch-audio.wav` | 1.4M | Both still on disk. Keep the one RENDERING names, **ask first**. `RENDERING.md:337` names both, so edit that line whichever you delete. |
| `out/review-desk/` web copies (after phase 2, `out/review/`) | 34M | Keep. It's the showrunner's review page. There's no script, so write one line in its README on how the copies were encoded. |
| `studio/out/genvideo-bundles/` | 68M | A cache and safe to clear (`keyframes.py` rebuilds it), but low value |

**What was recovered, and what is left:** about 133M was freed at 16:09:
- 96.5M of premix WAVs (`act4-mix-v3.wav`, 68.4M, is KEEP while `report_v4.py` needs it).
- 18.5M from the 4K pair and 4.8M from the screen versions.
- 12.9M of duplicate PNGs.
- Still waiting for the showrunner: the 1.4M mfinale WAV duplicate, and the retired Act Four code at the v5 pixel lock.

The big disk users are the venvs (5.1G), the sample libraries (3.1G) and the OST renders (2.2G), and all of those are live.

---

## 7. Execution procedure

### 7.1 Preconditions (all of them, every phase)

1. **No pass is running.**
   - Ask the lead, or check the session's agents.
   - Also, this prints nothing:
     ```bash
     find /home/jgon/project/art/mrmas \( -name .git -o -name node_modules -o -name '.venv*' -o -name __pycache__ \) -prune -o -type f -mmin -10 -print | head
     ```
   - Don't use `-newermt '-10 minutes'`. In this harness `find` is `bfs`, which rejects that timestamp ("Invalid timestamp") on stderr and prints nothing on stdout, so the check falsely passes. The prunes matter too: numba caches inside the venvs change during unrelated work.
   - **Free disk:** `df -h /home/jgon/project/art` needs a margin for the verification renders and a worktree (about 1.6G of tracked files). At 16:02 the disk was 99% full, with 5.9G free.
2. **Phase 0 is done** (once; §9 has the decisions):
   1. **`.gitignore`:**
      - Commit the `audio/reel/**/*.wav` line that is already in the working tree.
      - Add `!audio/ep01/act4/dialogue/qa/*.log` below the `*.log` rule. The lead decided this. The 8 recording logs (124K) can't be regenerated.
      - Check both with `git check-ignore -v audio/reel/ep01-act4-v5/mix.wav audio/ep01/act4/dialogue/qa/record.log`. The first must be ignored, the second not.
   2. **`ops/workflows/`**, after a secret scan (the lead decided this):
      - The pattern half of the scan was run read-only at about 16:10, and again at about 23:10: 0 credential-shaped strings in the 25 scripts (1,546 lines, unchanged). The only hits were the words "token", "API keys" and "secrets" in prose.
      - The value half compares the scripts against the real secrets without printing them. The lead runs it. It's the only step here that reads `.env`.
      ```bash
      python3 - <<'EOF'
      import glob, os
      vals = [l.split('=', 1)[1].strip().strip('"\'') for l in open('.env') if '=' in l and not l.lstrip().startswith('#')]
      for f in glob.glob('.secrets/*'):
          if os.path.isfile(f):
              vals += [l.strip() for l in open(f, errors='ignore')]
      vals = [v for v in vals if len(v) >= 8]
      hits = [(f, i) for f in sorted(glob.glob('.backups/*.js')) for i, ln in enumerate(open(f, errors='ignore'), 1) if any(v in ln for v in vals)]
      print(len(vals), 'secret values checked;', len(hits), 'lines contain one:', hits)   # file:line only, never a value
      EOF
      mkdir -p ops/workflows && cp -p .backups/*.js ops/workflows/     # the tarball stays in .backups/ (ignored)
      ```
      - Then write `ops/workflows/README.md`: these are the scripts as they ran; they are records; `orgmove.py` never rewrites them; translate their paths with §4 before re-running one.
   3. **The tools:** save Appendix B as `ops/orgmove.py` and Appendix B.2 as `ops/fraggrep.sh`, and write `ops/README.md`.
   4. **A size guard before the commit.** Nothing new over 20 MB goes in (at 22:03 it printed nothing for the 464 files `git add -A` would add):
      ```bash
      git add -A --dry-run | sed -n "s/^add '\(.*\)'$/\1/p" | while read -r f; do [ -f "$f" ] && [ "$(stat -c %s "$f")" -gt 20000000 ] && echo "TOO BIG: $f"; done
      ```
3. **A clean checkpoint commit, pushed** (the lead decided this, §9 item 1):
   - **Before the first checkpoint, check what `git add -A` would remove:** `git add -A --dry-run | grep '^remove'`. At 22:03 it listed the seven duplicate PNGs deleted at 16:09 (§0.1). Commit those removals only once the lead has confirmed them (§9 item 4). Otherwise restore them first with `git checkout HEAD -- <path> …`.
   - `git add -A && git commit -m "Checkpoint before reorg phase N"`, then `git status --short` is empty. Push it.
   - Work on a branch: `git switch -c reorg/phase-N`. After §7.5 passes, merge to `main` and push.
4. **A hard-link snapshot of the ignored media**, which git can't restore:
   ```bash
   SNAP=/home/jgon/project/art/mrmas-premove-$(date +%Y%m%d-%H%M)
   cp -al /home/jgon/project/art/mrmas "$SNAP"      # seconds; hard links use almost no space
   ```
   - The snapshot survives any `mv` or `rm` in the project.
   - The move tool writes rewritten files through a temp file and `os.replace`, so their old content also stays in the snapshot.
   - An in-place edit (truncating a file with `open(f, 'w')`) shows through into the snapshot. The §7.5 checks do such edits: the SFX rebuild, `sync.mjs` and `build.py --index` rewrite files in place.
   - So for phases 3 and 4, also make a real copy of the ignored media under the manifest's sources (745 MiB for phase 3 at 15:40, which fits):
     ```bash
     grep -v '^#' phaseN.tsv | cut -f1 | xargs git ls-files -oi --exclude-standard -- | rsync -a --files-from=- . <scratch>/media-phaseN/
     ```
   - Remove the snapshot afterwards with `rm -rf "$SNAP"`. Removing links never touches the originals.
5. **Baselines are recorded** (§7.2) into the session scratchpad, in your own subfolder.

### 7.2 Baseline capture (before a phase; repeat after it and diff)

```bash
B=<scratchpad>/<your-pass>/baseline-phaseN-before; mkdir -p "$B"; cd /home/jgon/project/art/mrmas
# 1. every file with its size (deps, caches and samples pruned)
find . \( -path ./.git -o -name node_modules -o -name '.venv*' -o -path ./audio/samples -o -path ./studio/out -o -name __pycache__ \) -prune \
  -o -type f -printf '%s\t%p\n' | sort -k2 > "$B/files.tsv"
# 2. what each Remotion root registers (run from studio/)
(cd studio && for e in src/index.ts $(git ls-files '*entry.tsx'); do echo "== $e"; npx remotion compositions "$e" --log=error 2>&1; done) > "$B/compositions.txt"
# 3. probe stills, one per area (md5 compared after; Remotion stills are deterministic here)
(cd studio && P="--bundle-cache=false --log=error" &&
  npx remotion still src/index.ts intro-ep1 "$B/intro.png" --frame=225 $P &&
  npx remotion still src/dev/mcoldopen/entry.tsx mcoldopen "$B/moment.png" --frame=100 $P &&
  npx remotion still src/episodes/ep01/act4/animatic/entry.tsx ep01-act4-animatic-v4-still "$B/act4.png" --props='{"offset": 3000, "version": 4}' $P &&
  npx remotion still src/index.ts reel-ep01 "$B/reel.png" --frame=240 $P &&
  npx remotion still src/dev/range/p1/entry.tsx range-p1-keytest "$B/range.png" $P &&
  npx remotion still src/index.ts jump-proto-1 "$B/jump.png" --frame=48 $P &&
  npx remotion still src/index.ts satire-key "$B/lookdev.png" $P)
md5sum "$B"/*.png > "$B/stills.md5"
# 4. typecheck (record the baseline error list; the after-list must be identical)
(cd studio && npm run -s typecheck) > "$B/tsc.txt" 2>&1; echo "exit $?" >> "$B/tsc.txt"
# 5. OST engine regression tests and the published index (compare the count with this baseline, not a fixed number)
(cd audio/ost && ../.venv-theme/bin/python -m unittest discover -s engine/tests) > "$B/ost-tests.txt" 2>&1
cp audio/ost/ost-index.json audio/ost/index.json "$B/"
# 6. every take path in the dialogue line lists resolves (227 in lines.json, 541 in lines-v5.json at 15:10)
python3 - > "$B/dialogue-paths.txt" <<'EOF'
import json, os, re
for f in ['audio/ep01/act4/dialogue/lines.json', 'audio/ep01/act4/dialogue/lines-v5.json']:
    miss, tot = [], 0
    def walk(o):
        global tot
        if isinstance(o, dict): [walk(v) for v in o.values()]
        elif isinstance(o, list): [walk(v) for v in o]
        elif isinstance(o, str) and re.match(r'^(audio|out|show|studio)/.*\.(wav|mp3|json|flac)$', o):
            tot += 1; os.path.exists(o) or miss.append(o)
    walk(json.load(open(f))); print(f, 'paths', tot, 'missing', len(miss), miss[:5])
EOF
# 7. the dry run and the fragment check as they stand before the phase
MRMAS_ROOT=$PWD python3 ops/orgmove.py plan "$B/../phaseN.tsv" > "$B/plan.txt"
bash ops/fraggrep.sh N > "$B/fraggrep.txt"
```

After phase 5b, the moment's probe path becomes `src/intro/moments/mcoldopen/entry.tsx`. Map the probe list through the manifest.

### 7.3 The per-phase loop

1. **Write the manifest.** Copy the phase's rows from Appendix A into `<scratchpad>/<pass>/phaseN.tsv`.
   - The rows are `old<TAB>new`, repo-relative and in the order given.
   - No row's source may be something an earlier row in the same manifest created. Chained renames go in a second manifest, applied after the first.
2. **Dry run.** Run `MRMAS_ROOT=/home/jgon/project/art/mrmas python3 ops/orgmove.py plan phaseN.tsv > phaseN.plan.txt`. It takes about 35 s on an idle machine, and a few minutes while renders run.
   - A `# WARNING: neither … nor … exists` line means a row's source was deleted. Drop the row; `apply` would stop at it.
   - Read the whole diff. Pay particular attention to the lines the variable-join rewrite changed (`os.path.join(...)`, `$VAR/...`, `f'{VAR}/...'`).
   - Check the counts against §0. A large difference means someone added references since 22:03, so read those.
   - Read the four MANUAL lists at the end:
     - **DEPTH** must be empty before `apply` (for phase 4, run phase 1 first).
     - **ESCAPES** must be empty.
     - Each **COMPOSED** and **FRAGMENT** line is either fixed after the apply (step 4) or goes in the ok-list with a reason.
   - The expected lines are in §4 and Appendix C.
3. **Apply.** Run `MRMAS_ROOT=/home/jgon/project/art/mrmas python3 ops/orgmove.py apply phaseN.tsv`.
   - Always set `MRMAS_ROOT`, for `undo` too. The tool refuses a root with no `.git`.
   - It rewrites text first, then moves.
   - It uses `git mv` when the source has tracked files, which carries ignored and untracked files along. It uses a plain rename when the source has none.
   - It writes `phaseN.done.tsv`, the undo log, beside the manifest.
4. **Hand fixes.** Fix the MANUAL lines, and the §4 "hand" and "docs" items.
   - Put each reviewed false positive or record in `phaseN.ok.tsv`, as `file<TAB>the stripped line text<TAB>reason`. A JSON file takes the text `*`. Paths may be old or new.
   - Then run `MRMAS_ROOT=… python3 ops/orgmove.py frag phaseN.tsv phaseN.ok.tsv`. It must exit 0: 0 files still to rewrite, and no unreviewed MANUAL line.
   - A re-run after `apply` prints "already moved" for each row and lists only leftovers.
5. **Verify** (§7.5). Fix any failure, or roll back (§7.6).
6. **Commit** on the branch: `git commit -m "Reorg phase N: <summary>"`.
   - `git status` must show `R` (renames) and `M` entries only.
   - A `D` with no matching `A` at its manifest destination means the tool lost a file. Small files whose lines all changed show up as `D` + `A` pairs; phase 5b shows seven, the `entry.tsx` files.
   - Merge to `main` and push (the lead's decision).
7. **Update the docs.**
   - Skim PIPELINE and RENDERING. Their paths are rewritten, but read the prose.
   - Update the READMEs of the folders that moved, `docs/STATUS.md` and this plan's §0 (mark the phase done).
   - Keep `phaseN.tsv`, `phaseN.ok.tsv` and the `frag` output beside the phase commit's message or in `ops/` (for example `ops/reorg/phaseN/`), so a successor can see what was reviewed.
   - The lead updates the hygiene note in SHOWRUNNER-NOTES by hand. The tool never edits that file.
8. **Clean up.** Remove the snapshot, and any parent folders left empty (`find out audio -type d -empty -print`; review the list, then `rmdir`).

### 7.4 Reference-rewrite rules (what the tool does and doesn't do)

**Rewritten automatically:**
- **Path strings:** `old/...` becomes `new/...` wherever the old path starts at a boundary. A boundary is the start of a line, whitespace, a quote, `(`, `[`, `=`, `:`, `,`, `../` or `mrmas/`. So the repo-relative form, the studio-cwd form (`../out/...`) and the absolute form (`/home/jgon/project/art/mrmas/out/...`) are all caught.
- **The studio-cwd form of studio paths:** `src/dev/...` for `studio/src/dev/...`.
- **Markdown links, and TS/JS relative imports:**
  - Each is resolved from the file's *old* location and mapped through the manifest.
  - It is then re-relativized from the file's *new* location.
  - The link text is left alone.
  - Links out of a moved folder get fixed too, and extension-less imports resolve to `.ts`, `.tsx` or `index.ts`.
  - A link where neither end moved is left untouched.
- **New in v2: paths joined onto a variable whose value the tool can work out.**
  - **Python:** `os.path.join(BASE, 'a', 'b/c')`, `BASE / 'a'`, `BASE + '/a'`, `f'{BASE}/a/b'`, and joiners such as `j = lambda *p: os.path.join(AUDIO, *p)` or `P = lambda *a: os.path.join(REPO, *a)`.
  - **Shell:** `$BASE/a/b` and `${BASE}/a/b`, also inside `${X:-$BASE/a/b}`.
  - **TS/JS:** `path.join(BASE, 'a')`, `path.resolve(BASE, 'a')`, `` `${BASE}/a` `` and `BASE + '/a'`.
  - **How it traces `BASE`:** through assignments, `from sibling import *` and named imports, `sys.path` inserts, `__file__`, `$0`/`BASH_SOURCE`, `import.meta.url`/`__dirname`, the old `/home/jgon/project/art/mrmas` constant, and the phase 1 marker lookup.
  - **What it rewrites:** it evaluates the base at the file's old and new locations and maps the joined path through the manifest. The string parts become one repo-style string: `'out', 'intro', 'picture', 'x.json'` becomes `'out/season/intro/picture/x.json'`.
  - **`..` parts:** a base that follows its file (`HERE`) gets its `..` parts recomputed. For example, in phase 4, `mixlib.py:21`'s `'..', '..', '..'` becomes `'../../../..'`.
  - **Where the literal pass stays out:** a string that the variable pass has resolved is protected, so a relative string isn't wrongly treated as repo-relative.

**Listed for a person (the MANUAL lists), never rewritten:**
- **DEPTH:** a variable that points elsewhere once its file moves, such as `AUDIO = os.path.dirname(HERE)`, or `HERE` in a file that moves alone. Phase 1 removes these.
- **ESCAPES:** a joined path whose new target lies outside its base variable (none in phases 2–6).
- **COMPOSED:** a name built at run time beside a moved file, or under a moved folder's parent. Examples: `f"act4-mix-{v}.wav"`, `f"shots-locked-{v}.json"`, `` `studio/src/dev/${m}/timeline.ts` ``.
- **FRAGMENT:** any other code or JSON line that still names a moved path by a fragment. Examples: `'intro-sfx/src/x.wav'` joined onto an argv or parameter base (`cue.py`, `mix.ts`), `$ROOT/out/range` after a cwd-relative `ROOT`, audio-relative labels in records, `"'out', 'intro'"` pairs.
  - Plain-word leaves (`alt`, `mix`, `retired`, `mcoldopen`) count only where they're used as a path: after `$VAR/` or `}/`, as a join argument, after `/ ` (pathlib), or at the start of a quoted path (`'retired/3.1'`).
  - A path with a different parent (`render/alt`) doesn't count.
  - A hit that goes on through a subfolder the old path doesn't have doesn't count. For example, `${root}/intro/sfx/x.wav` isn't `out/intro`, because `out/intro/sfx` doesn't exist.
  - JSON files are summarized, one line per file.

**Never touched:**
- `.git`, `.backups/`, `ops/`, `.env`, `.secrets/`, `node_modules`, the venvs, `audio/samples/` and `studio/out/`.
- `studio/src/reel/data/`, which is generated; re-run `node src/reel/sync.mjs` instead.
- Everything under `history/` and `_reviews/`, including files whose *new* home is under `history/` (the sketch-mix scripts in phase 4).
- `*.cues.json`, `*/qa/*.json`, the JSON under `out/`, `*.log`, `show/production/SHOWRUNNER-NOTES.md` and this plan.
- Binary files.
- Only tracked and untracked-but-not-ignored text files are scanned (`git ls-files -co --exclude-standard`).

### 7.5 Verification (after every phase; each check must pass)

The checks are listed here; the commands are in the two blocks below. Don't copy a command out of a table cell.

| # | Check | Pass when |
|---|---|---|
| 1 | Nothing is lost | Same number of files as `files.tsv`, and every non-text file sits at its manifest destination with the same size (block 1, step 1) |
| 2 | No whole old path is left | The whole-path grep prints nothing for any manifest row, outside the §7.4 "never touched" list (block 1, step 2) |
| 3 | No fragment is left (the tool) | The tool's fragment check, run with the phase's ok-list, exits 0 (block 1, step 3) |
| 4 | No fragment is left (independent) | The independent fragment grep prints only lines already reviewed in the ok-list (block 1, step 4) |
| 5 | Static checks | The typecheck error list equals the baseline, and every edited `.py`, `.sh` and `.mjs` compiles (block 1, step 5) |
| 6 | Registration is unchanged | The `compositions.txt` diff is empty (in 5b, map the entry paths) |
| 7 | Pictures are unchanged | The 7 probe stills are md5-identical. Exception: `reel-ep01` after phase 3, if the probe frame shows the `Reel.tsx:147` label; inspect it. |
| 8 | Reel smoke test | 48 frames rendered, and `out/reel` wasn't recreated (block 1, step 8) |
| 9 | No stale writers | None of the manifest's old paths exists again after the smoke tests (block 1, step 9) |
| 10 | OST | The test count and result equal the baseline; `ost-index.json` changed only in rewritten path strings |
| 11 | Dialogue | The §7.2 step 6 script reports 0 missing for both line lists |
| 12 | Intro audio (phase 4) | The SFX rebuild writes `picture-sync.json` with `"present": true`; the intro mix rebuilds; `verify.py` passes; nothing recreates `audio/intro-mix/` (block 2) |
| 13 | Intro picture (phase 5b) | `master.sh 1080` succeeds (720 frames, self-check), and the re-exported `intro-events.json` differs from the committed one only in the `src` labels |
| 14 | Portability (phase 1) | No `/home/jgon` in code, the phase 4 dry run shows `DEPTH (0)`, and the worktree test resolves `REPO` to the worktree (block 2) |

**Block 1, every phase.** Run it from the repo root, with `B` set to the baseline folder and `N` to the phase. The manifest and the ok-list sit beside `B`:
```bash
cd /home/jgon/project/art/mrmas; export MRMAS_ROOT=$PWD; M=$B/../phaseN.tsv; OK=$B/../phaseN.ok.tsv
# 1. nothing lost (run before any render-based check, which adds files)
find . \( -path ./.git -o -name node_modules -o -name '.venv*' -o -path ./audio/samples -o -path ./studio/out -o -name __pycache__ \) -prune \
  -o -type f -printf '%s\t%p\n' | sort -k2 > "$B/../files-after.tsv"
python3 - "$B/files.tsv" "$B/../files-after.tsv" "$M" <<'EOF'
import os, sys
sys.path.insert(0, 'ops')
from orgmove import load, mapper, TEXT
def tsv(p):
    return {path: int(size) for size, path in (ln.rstrip('\n').split('\t', 1) for ln in open(p))}
before, after, m = tsv(sys.argv[1]), tsv(sys.argv[2]), mapper(load(sys.argv[3]))
bad = [p for p, s in before.items() if os.path.splitext(p)[1] not in TEXT and after.get('./' + m(p[2:])) != s]
print(f'files {len(before)} -> {len(after)}; binaries missing or resized: {len(bad)}', bad[:10])
sys.exit(1 if bad or len(before) != len(after) else 0)
EOF
# 2. no whole old path is left: one grep per manifest row (catches $ROOT/old, ${ROOT}/old and f'{ROOT}/old' too)
for OLD in $(grep -v '^#' "$M" | cut -f1); do
  git grep -nP "(?:(?:^|[\s\"'\`(\[=:,]|\.\./|mrmas/)|(?:\\\$\w+|\\\$?\{\w+\})/)$(printf '%s' "$OLD" | sed 's/[.]/\\./g')(?=[/\s\"'\`),\]}:;.]|$)" \
    -- . ':!docs/ORGANIZATION-PLAN.md' ':!.backups' ':!ops/**' ':!**/history/**' ':!out/**/*.json' ':!**/*.cues.json' \
         ':!**/qa/*.json' ':!**/*.log' ':!show/production/SHOWRUNNER-NOTES.md' ':!studio/src/reel/data/**'
done
# 3. no fragment is left, by the tool (exit 0 required)
python3 ops/orgmove.py frag "$M" "$OK"; echo "frag exit $?"
# 4. no fragment is left, independently of the tool (every line printed must already be in the ok-list)
bash ops/fraggrep.sh N
# 5. static checks on what the phase changed
(cd studio && npm run -s typecheck) > "$B/../tsc-after.txt" 2>&1; echo "exit $?" >> "$B/../tsc-after.txt"; diff "$B/tsc.txt" "$B/../tsc-after.txt"
for f in $(git diff --name-only --diff-filter=RAM -M HEAD); do case $f in
  *.py) python3 -m py_compile "$f" ;; *.sh) bash -n "$f" ;; *.mjs) node --check "$f" ;; esac || echo "FAIL $f"; done
# 6, 7, 10, 11: re-run §7.2 steps 2, 3, 5 and 6 with B set to "$B/../after" (map the probe paths in 5b), then compare
A=$B/../after
diff "$B/compositions.txt" "$A/compositions.txt"
diff <(cd "$B" && md5sum *.png) <(cd "$A" && md5sum *.png)
diff <(tail -3 "$B/ost-tests.txt") <(tail -3 "$A/ost-tests.txt"); git diff --stat -- audio/ost/ost-index.json
diff "$B/dialogue-paths.txt" "$A/dialogue-paths.txt"
# 8. reel smoke test (renders from studio/; 48 frames, about 10 s to count)
(cd studio && node src/reel/sync.mjs --quiet && npx remotion render src/index.ts reel-ep01 "$B/../reel-smoke.mp4" --frames=0-47 --concurrency=2 --bundle-cache=false --log=error)
FFD=studio/node_modules/@remotion/compositor-linux-x64-gnu
LD_LIBRARY_PATH=$FFD $FFD/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$B/../reel-smoke.mp4"   # 48
test ! -e out/reel && echo "out/reel not recreated"
# 9. no stale writers: prints nothing
for d in $(grep -v '^#' "$M" | cut -f1); do test -e "$d" && echo "RECREATED $d"; done
```

In a table cell, the step 2 grep has to escape its `|`. PCRE then reads `\|` as a literal pipe, so the check passes with 0 hits while 11 exist (tested on `out/reel`). That's why it's only in this block.

The step 2 pathspecs leave out the §7.4 "never touched" list. Without them, the grep printed 7 lines after phase 3, all records in `out/lookdev/genvideo/tests/*.json` that the tool rightly doesn't rewrite.

Tested on the throwaway copy of the tree as of 22:03:
- The step 2 grep found 41 lines for `out/reel` before phase 3 (86 for `out/intro`). After all of phases 2–6 it found 0 for every row of every manifest.
- Step 3 exits 1 while a hand-fix line is left, and 0 once it's fixed and the ok-list holds the reviewed lines.
- `fraggrep.sh` found 1, 120, 54, 35 and 119 lines before phases 2, 3, 4, 5a and 5b. After each one alone it found 0, 0, 6, 7 and 7. Every line left was prose or a record (§4 lists them), apart from one 5a false positive: `build_intro_sfx.py:142` reads `mcoldopen/timeline.ts`, which 5a doesn't move.
- At 16:45 the same counts were 1, 110, 49, 34 and 116 before, and 0, 0, 8, 6 and 9 after.

**Block 2, phase-specific:**
```bash
# phase 1: no machine path left in code; the phase 4 dry run is DEPTH-free
git grep -n /home/jgon -- '*.py' '*.ts' '*.tsx' '*.mjs' '*.sh' ':!ops/**'
MRMAS_ROOT=$PWD python3 ops/orgmove.py plan <scratch>/phase4.tsv | grep '^# MANUAL DEPTH'      # must say (0)
git worktree add <scratch>/wt && (cd <scratch>/wt && env -u MRMAS_ROOT python3 - audio/animatic/build_temp_track.py <<'EOF'
import ast, os, sys                                   # runs only the resolver and the REPO line; prints the worktree path
f = sys.argv[1]; g = {'__file__': os.path.abspath(f), 'os': os, 'sys': sys}
for st in ast.parse(open(f).read()).body:
    if (isinstance(st, ast.FunctionDef) and st.name == '_repo') or \
            (isinstance(st, ast.Assign) and any(getattr(t, 'id', '') == 'REPO' for t in st.targets)):
        exec(compile(ast.Module([st], []), f, 'exec'), g)
print(f, '->', g.get('REPO'))
EOF
)
git worktree remove <scratch>/wt
# phase 4: rebuild the SFX spot, remix, verify (the ignored media copy from §7.1 item 4 is the fallback)
audio/.venv/bin/python audio/intro/sfx/build_intro_sfx.py && grep -m1 '"present"' audio/intro/sfx/picture-sync.json   # "present": true
(cd audio/intro/mix/scripts && bash run_all.sh) && test ! -e audio/intro-mix && echo "no stale intro-mix"
# phase 5b: the intro master and the event export
bash studio/src/intro/tools/master.sh 1080 "$(mktemp -d)"
```

`run_all.sh` runs the intro QA (`verify.py`) last, after the mixes, the mux and the SFX balance. If its order changes, run `verify.py` on its own at the end. The portability probe works for any converted Python file whose resolver sits at module level; repeat it for a shell and a Node tool by running one read-only command of each from the worktree.

### 7.6 Rollback

- **Before the phase commit:**
  1. Run `MRMAS_ROOT=… python3 ops/orgmove.py undo phaseN.done.tsv`. It moves every folder back, ignored files included.
  2. Run `git reset --hard <checkpoint>`, which restores the rewritten text. **Never** run `git clean`, because it would delete untracked work.
  3. Compare the file list with `files.tsv`.
  - Tested on a copy after phase 4: the file list and every size were identical to the list before the apply (5,740 files).
  - Tested again at 23:05 on the 22:03 copy after phase 3: the list of files **and folders**, with sizes, was identical (6,592 entries). Since then, `undo` removes the parent folders that `apply` created once they're empty (such as `out/season/`), and a second `undo` is a no-op ("already undone").
- **After the commit, before the push:** the same two steps. First `undo`, then `git reset --hard <checkpoint>`.
- **After the push** (tested by the critic):
  1. Run `MRMAS_ROOT=… python3 ops/orgmove.py undo phaseN.done.tsv`, which puts the folders and ignored media back.
  2. Run `git reset --hard <checkpoint>`, which restores the text and the index.
  3. Run `git reset --soft <pushed phase commit>`, which moves the branch back to the pushed tip and keeps the checkpoint's tree staged.
  4. Run `git commit -m "Revert reorg phase N"`, then push. The tree equals the checkpoint, and history stays linear, with no force-push.
  - This assumes no other commit landed after the phase commit. If one did, use `git revert <phase commit>` after step 1 instead, and resolve by hand.
- **Last resort for ignored media:** copy it back from `$SNAP` or from the real copy (`rsync -a`, restricted to the manifest paths).

---

## 8. README outlines and handoff gaps

**Top-level READMEs to write.** Each is one screen, with links out.

| File | Contents |
|---|---|
| `docs/README.md` | The four docs and when to read each. `STATUS.md` comes first. |
| `ops/README.md` | `orgmove.py` and `fraggrep.sh` (what they do, how to run a phase: §7), and `workflows/` (records of what ran; never rewritten). |
| `studio/README.md` | Run every `npx remotion` command from `studio/`. How `Root.tsx` registers (`*.frame.tsx` anywhere under `src/`) and why the other entries exist (a builder's own compositions only). What each `src/` folder is: `shared` is the engine, `intro`, `episodes`, `reel` and `styleframes` are shipped, `dev` is lookdev and R&D. `tools/`, `notes/`, `public/` (staticFile, with the `--public-dir` special case), the `out/` cache, and the three guides. |
| `audio/README.md` | The folder map in §3, which venv each folder uses (`audio/requirements/*.txt`), what's committed versus ignored (the renders, takes and beds are ignored and regenerable), how masters are levelled, and where each recipe is in RENDERING. |
| `out/README.md` | `season/`, `epNN/`, `lookdev/`, `review/`, and the `history/` convention. Stills, sheets, reports and JSON are committed; MP4 and WAV are ignored, with the recipe for each in RENDERING §3. The rules for new outputs are in §2. |
| `studio/src/dev/README.md` | Each subfolder in one line, as one of: lookdev dead end, R&D prototype, engine origin (with the pixeladv shims), or shipped (until 5b). The lookdev key pattern: `dev/<key>/` code plus a `styleframes/<key>.frame.tsx` wrapper. |

**Work folders with no handoff note yet.** Carried over from the survey, and still true at 15:10:
- `audio/ep01/act4/dialogue/` (1,184 files, 387M). Its README should say why `retired/` keeps its name.
- `audio/sfx/`, `audio/theme/` (only `VARIATIONS.md`), `audio/mix/` and `audio/animatic/` (these two become history in phase 4). `audio/intro-sfx/`'s README should say that `alt/` is written by every build.
- `audio/ost/`: the OST-BIBLE serves; add a short README that says which of `index.json` and `ost-index.json` is which.
- `studio/src/episodes/ep01/act4/`, which should list the KEEP modules and why, and `studio/src/dev/{range,jumps}`, whose docs are in `show/bible/style-*.md`.
- `out/range/`, `out/jumps/`, `out/review-desk/`.
- `show/production/`, and `show/episodes/ep01/production/act4/`, which needs a "current = v4 lock, v5 in progress; reading order" index.
- New since 16:05: `studio/src/dev/outro/a/`, `studio/src/dev/range/ep1-p1…p3/` and `audio/ep01/act4/dialogue/tools/fastrec/` have READMEs. `studio/src/dev/outro/{b,c,d,e}/` didn't at 22:03, while that pass was still running.

**Stale docs:** `docs/PIPELINE.md` dates from 09-25 14:47, `docs/RENDERING.md` was last edited at 16:09 on 09-26, and `docs/STATUS.md` still didn't exist at 22:03. Those belong to the docs pass. Phases 2–5 rewrite the paths in them, but not the prose.

---

## 9. Decisions (the showrunner's words, the lead's calls, and what is still waiting)

The showrunner, 2026-09-26: *"also let's try to keep files organized, they are a bit all over the place"*; *"we want to be sure that we are leaving appropriate detail where someone could pick up where we left off"*; *"yes, you can make a checkpoint before reorganizing. we should also generally start committing after each next step prototype of something"*; *"yes you should push"*.

1. **Commits: decided.** The lead's call is to commit and push each verified phase.
   - A checkpoint commit before each phase, pushed (§7.1 item 3).
   - Each phase on a branch. After §7.5 passes, merge to `main` and push.
   - Beyond the reorg, commit after each next-step prototype (the showrunner's words above).
2. **`.backups/`: decided.** The lead's call is to commit the 25 workflow scripts into a tracked `ops/workflows/`, after a secret scan.
   - The pattern half of the scan is done: 0 credential-shaped strings. The lead runs the value half (§7.1 item 2.2).
   - The show tarball stays in `.backups/`, ignored.
3. **Dialogue recording logs: decided.** The lead's call is to commit the 8 `audio/ep01/act4/dialogue/qa/*.log` through a `.gitignore` exception (`!audio/ep01/act4/dialogue/qa/*.log`). At 22:03 the exception wasn't in `.gitignore` yet, so `record.log` was still ignored. Phase 0 adds it (§7.1 item 2.1).
4. **Deletions: still waiting for the showrunner.** The lead's call is that nothing in §6 marked "ask first" is deleted until the showrunner agrees.
   - **But most of the list was already deleted at 16:09:37, uncommitted** (found at 22:03, §0.1). No approval is recorded here or in SHOWRUNNER-NOTES:
     - the seven duplicate PNGs and the two `out/` stray copies among them (12.9M, tracked, restorable from git);
     - the two premix WAVs (96.5M) and the 4K intro pair (18.5M, which the 1080p-max rule covers), both ignored;
     - `out/dev/screen` v1/v2 (4.8M, ignored).
   - **The lead's next step:** ask the showrunner to confirm those deletions before phase 0's checkpoint commits the seven PNG removals (§7.1 item 3). If the answer is no, restore the PNGs with `git checkout HEAD -- <path> …`, and regenerate the WAVs only if someone needs them (§6.1).
   - **Still to ask:** the 1.4M mfinale WAV duplicate, and the retired Act Four code after the v5 pixel lock and a re-derived list.
5. **Retiring v3: still waiting for the showrunner.** After the Act Four v5 pixel lock, may the v2/v3 Act Four compositions stop being re-renderable? Their MP4s stay. Until then, the modules, their generators and `report_v4.py`'s inputs are KEEP.
6. **Timing (open, for the lead):**
   - §0.2 recommends phase 1 after phases 2 and 3, and before 5a and 4.
   - Phase 5b after the Ep1 picture lock, or never. Phase 2d only if wanted.
7. **Adoption (open, for the lead):** once phase 0 has run, update the hygiene note in SHOWRUNNER-NOTES ("New outputs go in the layout in docs/ORGANIZATION-PLAN.md once it's adopted") to say it applies now, and point it at §2.

---

## Appendix A: phase manifests (TSV; tabs between the two columns)

```
# phase2.tsv
out/review-desk	out/review
out/jumps/prev	out/jumps/history
show/intro/_reviews	show/intro/history

# phase2-dialogue.tsv  (optional phase 2d; only in one commit with its three tools)
audio/ep01/act4/dialogue/retired	audio/ep01/act4/dialogue/history

# phase3.tsv  (order matters)
out/intro	out/season/intro
out/animatic	out/season/intro/animatic
out/pixel/moments	out/season/intro/moments
out/pixel/dinner-preview.png	out/season/intro/moments/dinner-preview.png
out/pixel/moments-preview.png	out/season/intro/moments/moments-preview.png
out/pixel	out/lookdev/pixel
out/reel/ep01-act4-v5.mp4	out/ep01/act4/reel/ep01-act4-v5.mp4
out/reel/ep01-act4-v5-sheet.png	out/ep01/act4/reel/ep01-act4-v5-sheet.png
out/reel	out/season/reels
out/dev	out/lookdev/looks
out/structures	out/lookdev/structures
out/range	out/lookdev/range
out/jumps	out/lookdev/jumps
out/genvideo	out/lookdev/genvideo

# phase4.tsv  (after phase 1)
audio/intro-mix	audio/intro/mix
audio/intro-sfx	audio/intro/sfx
audio/intro-vox	audio/intro/vox
audio/vocals	audio/intro/vocals
audio/animatic	audio/intro/animatic
audio/mix	audio/intro/history/sketch-mix
audio/LISTENING_GUIDE.md	audio/intro/history/sketch-mix/LISTENING_GUIDE.md

# phase5a.tsv  (after the shim repoint, step 1)
studio/src/dev/makeRoot.tsx	studio/src/shared/makeRoot.tsx
studio/src/dev/pixeladv/tools/png.ts	studio/src/shared/pixel/png.ts
studio/src/dev/pixeladv/art/room.ts	studio/src/shared/pixel/rooms/room.ts
studio/src/dev/mcoldopen/orb.ts	studio/src/shared/pixel/cast/orb.ts
studio/src/dev/mfinale/callart.ts	studio/src/shared/pixel/kits/callart.ts

# phase5b.tsv  (optional)
studio/src/dev/mcoldopen	studio/src/intro/moments/mcoldopen
studio/src/dev/meras	studio/src/intro/moments/meras
studio/src/dev/mdinner1	studio/src/intro/moments/mdinner1
studio/src/dev/mdinner2	studio/src/intro/moments/mdinner2
studio/src/dev/mrollcall	studio/src/intro/moments/mrollcall
studio/src/dev/mfinale	studio/src/intro/moments/mfinale
studio/src/dev/intro/entry.tsx	studio/src/intro/entry.tsx
studio/src/dev/intro/review.tsx	studio/src/intro/review.tsx
studio/src/dev/intro/tools	studio/src/intro/tools
studio/src/dev/animatic	studio/src/intro/animatic
studio/src/dev/reel/entry.tsx	studio/src/reel/entry.tsx
studio/src/dev/reel/render_all.sh	studio/src/reel/tools/render_all.sh
studio/src/dev/reel/season_sheet.py	studio/src/reel/tools/season_sheet.py
studio/src/dev/reel/stills.mjs	studio/src/reel/tools/stills.mjs

# phase6.tsv  (after the Act Four v5 pixel lock and a re-audit; 26 rows: the KEEP files and the two premix WAVs deleted at 16:09 are left out)
show/episodes/ep01/production/act4/shotlist.md	show/episodes/ep01/production/act4/history/shotlist.md
show/episodes/ep01/production/act4/shots.json	show/episodes/ep01/production/act4/history/shots.json
show/episodes/ep01/production/act4/shots-locked.json	show/episodes/ep01/production/act4/history/shots-locked.json
show/episodes/ep01/production/act4/shotlist-v2.md	show/episodes/ep01/production/act4/history/shotlist-v2.md
show/episodes/ep01/production/act4/shots-v2.json	show/episodes/ep01/production/act4/history/shots-v2.json
show/episodes/ep01/production/act4/shots-locked-v2.json	show/episodes/ep01/production/act4/history/shots-locked-v2.json
show/episodes/ep01/production/act4/chunks-v2.md	show/episodes/ep01/production/act4/history/chunks-v2.md
show/episodes/ep01/production/act4/timing-v2.md	show/episodes/ep01/production/act4/history/timing-v2.md
show/episodes/ep01/production/act4/shotlist-v3.md	show/episodes/ep01/production/act4/history/shotlist-v3.md
show/episodes/ep01/production/act4/shots-v3.json	show/episodes/ep01/production/act4/history/shots-v3.json
show/episodes/ep01/production/act4/chunks-v3.md	show/episodes/ep01/production/act4/history/chunks-v3.md
show/episodes/ep01/production/act4/timing-v3.md	show/episodes/ep01/production/act4/history/timing-v3.md
show/episodes/ep01/production/act4/diagnosis-v3.md	show/episodes/ep01/production/act4/history/diagnosis-v3.md
show/episodes/ep01/production/act4/sound-diagnosis-v3.md	show/episodes/ep01/production/act4/history/sound-diagnosis-v3.md
show/episodes/ep01/production/act4/framing-v3.json	show/episodes/ep01/production/act4/history/framing-v3.json
show/episodes/ep01/production/act4/framing-v3.md	show/episodes/ep01/production/act4/history/framing-v3.md
out/ep01/act4/animatic/act4-animatic-v2.mp4	out/ep01/act4/animatic/history/v2/act4-animatic-v2.mp4
out/ep01/act4/animatic/act4-dialogue-premix-v2.cues.json	out/ep01/act4/animatic/history/v2/act4-dialogue-premix-v2.cues.json
out/ep01/act4/animatic/act4-v2-contact.png	out/ep01/act4/animatic/history/v2/act4-v2-contact.png
out/ep01/act4/animatic/layout-v2.json	out/ep01/act4/animatic/history/v2/layout-v2.json
out/ep01/act4/animatic/lock-raw.json	out/ep01/act4/animatic/history/v2/lock-raw.json
out/ep01/act4/animatic/scratch-vo	out/ep01/act4/animatic/history/v2/scratch-vo
out/ep01/act4/animatic/act4-animatic-v3.mp4	out/ep01/act4/animatic/history/v3/act4-animatic-v3.mp4
out/ep01/act4/animatic/act4-v3-contact.png	out/ep01/act4/animatic/history/v3/act4-v3-contact.png
out/ep01/act4/animatic/layout-v3.json	out/ep01/act4/animatic/history/v3/layout-v3.json
out/ep01/act4/framing-v3	out/ep01/act4/history/framing-v3
```

KEEP, and so not in `phase6.tsv`: `show/episodes/ep01/production/act4/shots-locked-v3.json`, `out/ep01/act4/animatic/act4-mix-v3.wav` and `out/ep01/act4/animatic/act4-mix-v3.cues.json`.

Deleted at 16:09, and so not in `phase6.tsv` either: `out/ep01/act4/animatic/act4-dialogue-premix-v2.wav` and `-v3.wav`. Their `.cues.json` (v2) stays in the manifest. If either WAV is regenerated before phase 6, add its row back.

**Every manifest here was checked against the tree at 22:03** with the tool's `plan`: no row warned. Before a phase, re-run `plan`; a `# WARNING: neither … nor … exists` line means a source was deleted, so drop that row.

## Appendix B: `ops/orgmove.py` v2 (the move and rewrite tool)

Save it as `ops/orgmove.py` in phase 0 and commit it. Run it with `MRMAS_ROOT` set to the project root. It needs Python 3.8 or newer, and was tested with 3.12.

**What changed from the critic's version**, each tested (Appendix B.3):
1. **Variable-joined paths are rewritten** (§7.4). That covers the intro mix's inputs, `OUT_DIR`, `verify.py`, `encode_mux.sh`, every `$ROOT/out/...` writer, the split `'out', 'intro'` joins and the dialogue tools' `"retired"` joins.
2. **The MANUAL scan is now a fragment scan of the text after the rewrite,** in four lists: DEPTH, ESCAPES, COMPOSED and FRAGMENT. It covers what nothing could rewrite, including names built from a version and roots taken from argv.
3. **A `frag` command** exits 1 while anything is unrewritten or unreviewed. It takes an ok-list (`file<TAB>text<TAB>reason`).
4. **`SKIP`** now covers `ops/` and any file whose new home is under `history/`.
5. Kept from the critic's version: `SKIP` covers this plan; `plan` re-runs after `apply` list the leftovers; `plan`, `apply` and `undo` refuse a root with no `.git`.
6. **Added at 18:03 and 23:05** (the re-checks):
   - `plan` prints `# WARNING: neither … nor … exists (deleted?)` for a row whose source and destination are both missing, instead of reporting it as already moved. That's how the two deleted premix WAVs in `phase6.tsv` were found.
   - `undo` removes the parent folders that `apply` created once they're empty, and skips a row that is already undone, so it can be re-run. `os.removedirs` only ever removes empty folders.

```python
#!/usr/bin/env python3
"""orgmove.py v2: move folders by a manifest and rewrite the references to them (docs/ORGANIZATION-PLAN.md §7).

  MRMAS_ROOT=<repo> python3 orgmove.py plan  phaseN.tsv [phaseN.ok.tsv]  # dry run: diff, then the MANUAL lists
  MRMAS_ROOT=<repo> python3 orgmove.py apply phaseN.tsv                  # rewrite, move, write phaseN.done.tsv
  MRMAS_ROOT=<repo> python3 orgmove.py frag  phaseN.tsv [phaseN.ok.tsv]  # check: exit 1 if anything is unreviewed
  MRMAS_ROOT=<repo> python3 orgmove.py undo  phaseN.done.tsv

Manifest: one "old<TAB>new" per line, repo-relative, '#' comments. git mv when the source holds tracked files
(ignored and untracked files travel with the directory), plain os.rename otherwise. The destination must not exist.

Rewritten automatically (text files only, never the SKIP list, never a file whose new home is under history/):
  1. whole path strings: old/... -> new/... at a boundary (repo-relative, ../ studio-cwd and absolute forms);
  2. Markdown links and TS/JS relative imports, resolved from the file's old location, re-relativized from its new one;
  3. paths joined onto a variable whose value can be worked out statically:
       Python  os.path.join(BASE, 'a', 'b/c'), BASE / 'a', f'{BASE}/a/b', j('a/b') with j = lambda *p: join(BASE, *p)
       shell   $BASE/a/b and ${BASE}/a/b, also inside ${X:-$BASE/a/b}
       TS/JS   path.join(BASE, 'a'), path.resolve(BASE, 'a'), `${BASE}/a`, BASE + '/a'
     BASE is traced through assignments, sibling-module imports (from mixlib import *), sys.path inserts, __file__,
     $0/BASH_SOURCE, import.meta.url, the old /home/jgon/project/art/mrmas constant and the phase 1 .mrmas-root lookup.
     It is evaluated at the file's old and new locations; the joined path is mapped through the manifest and the string
     parts are replaced by one repo-style string. '..' parts are recomputed for code that moves to a new depth.
Listed for a person, never rewritten (the MANUAL lists):
  DEPTH     a variable that points somewhere else once its file moves (dirname chains, a file moved alone)
  ESCAPES   a joined path whose new target leaves its base variable
  COMPOSED  a name built at run time beside a moved file: join(OUT, f"act4-mix-{v}.wav")
  FRAGMENT  any other code or data line that still names a moved path by a fragment: 'intro-sfx/x', "'out', 'intro'",
            join(ROOT, "retired"), $ROOT/out/range with an unknown ROOT, shots-locked-{v}
A reviewed false positive goes in phaseN.ok.tsv as "file<TAB>stripped line text<TAB>reason"; it is then not reported.
"""
import ast, bisect, difflib, os, re, subprocess, sys

ROOT = os.environ.get('MRMAS_ROOT') or os.getcwd()
ABS = sorted({os.path.realpath(ROOT).rstrip('/'), '/home/jgon/project/art/mrmas'}, key=len, reverse=True)
TEXT = {'.py', '.ts', '.tsx', '.mjs', '.js', '.cjs', '.sh', '.json', '.md', '.html', '.txt', '.toml', '.cfg', ''}
CODE = ('.py', '.sh', '.ts', '.tsx', '.mjs', '.js', '.cjs')
SKIP = re.compile(r'^(\.git/|\.backups/|ops/|\.env|\.secrets/|.*node_modules/|.*\.venv[^/]*/|audio/samples/'
                  r'|studio/out/|.*/history/|.*/_reviews/|.*\.cues\.json$|.*/qa/.*\.json$|out/.*\.json$|.*\.log$'
                  r'|show/production/SHOWRUNNER-NOTES\.md$|docs/ORGANIZATION-PLAN\.md$|studio/package-lock\.json$'
                  r'|studio/src/reel/data/)')
B = r'(?:^|(?<=[\s"\'`(\[=:,])|(?<=\.\./)|(?<=mrmas/))'
TOP = ('audio/', 'out/', 'show/', 'studio/', 'docs/', 'src/', 'ops/')
GENERIC = {'intro', 'reel', 'reels', 'dev', 'pixel', 'range', 'jumps', 'genvideo', 'animatic', 'mix', 'vocals', 'alt',
           'prev', 'moments', 'tools', 'data', 'src', 'out', 'audio', 'show', 'studio', 'entry.tsx',
           'review.tsx', 'stills.mjs', 'scripts', 'sfx', 'vox', 'history', 'season', 'lookdev', 'looks', 'review'}


def git(*a):
    return subprocess.run(['git', *a], cwd=ROOT, capture_output=True, text=True)


def exists(p):
    return os.path.lexists(os.path.join(ROOT, p))


def load(path):
    rows = []
    for ln in open(path):
        ln = ln.rstrip('\n')
        if ln and not ln.startswith('#'):
            old, new = ln.split('\t')[:2]
            rows.append((old.strip('/'), new.strip('/')))
    return rows


def mapper(rows):
    rows = sorted(rows, key=lambda r: -len(r[0]))            # longest old prefix wins
    def m(p):
        if p is None:
            return None
        p = os.path.normpath(p) if p else ''
        p = '' if p == '.' else p
        for old, new in rows:
            if p == old or p.startswith(old + '/'):
                return new + p[len(old):]
        return p
    return m


def aliases(rows):
    """old -> new, plus the studio-cwd form (src/... for studio/src/...) that render commands use."""
    a = {}
    for old, new in rows:
        a[old] = new
        if old.startswith('studio/') and new.startswith('studio/'):
            a[old[7:]] = new[7:]
    return a


def rows_old(al):                                            # the manifest's own old paths (not the src/ aliases)
    return {k for k in al if not (k.startswith('src/') and 'studio/' + k in al)}


def literal(rows):
    keys = sorted(aliases(rows), key=len, reverse=True)      # longest first, single pass: no chained rewrites
    return re.compile(B + '(?:' + '|'.join(map(re.escape, keys)) + r')(?=[/\s"\'`),\]:;.]|$)', re.M)


# ---------------------------------------------------------------- repo-relative path arithmetic ('' is the root)
def absrel(p):
    for a in ABS:
        if p in (a, a + '/'):
            return ''
        if p.startswith(a + '/'):
            return pj('', p[len(a) + 1:])
    return None


def pj(base, *parts):
    if base is None:
        return None
    segs = base.split('/') if base else []
    for part in parts:
        if part is None:
            return None
        if part.startswith('/'):
            r = absrel(part)
            if r is None:
                return None
            segs = r.split('/') if r else []
            continue
        for s in part.split('/'):
            if s in ('', '.'):
                continue
            if s == '..':
                if not segs:
                    return None
                segs.pop()
            else:
                segs.append(s)
    return '/'.join(segs)


def dirn(p):
    if p is None or p == '':
        return None
    return p.rsplit('/', 1)[0] if '/' in p else ''


def relp(target, base):
    r = os.path.relpath('/' + target, '/' + base)
    return '.' if r == '.' else r


class Ctx:
    def __init__(self, rows):
        self.rows, self.m = rows, mapper(rows)
        done = [(o, n) for o, n in rows if not exists(o) and exists(n)]
        self.inv = mapper([(n, o) for o, n in done])
        self.files = {}                                       # path -> analyzed file (also used for imports)

    def locs(self, f):                                        # (old location, new location) of a file as it is now
        o = self.inv(f)
        return (o, f) if o != f else (f, self.m(f))

    def site(self, bo, bn, comps, here):
        """A path joined onto a base known at the old (bo) and new (bn) location. -> (status, target, new text)."""
        old_full = pj(bo, *comps)
        if old_full is None or bn is None:
            return ('none', None, None)
        target = self.m(old_full)
        intended = bn if here else self.m(bo)                 # a file-relative base follows its file; a root does not
        if pj(intended, *comps) == target:
            return ('ok', target, None)
        r = relp(target, intended)
        dotdot = any(s == '..' for c in comps for s in c.split('/'))
        if r.startswith('..') and not dotdot and not here:
            return ('escape', target, r)
        return ('edit', target, r)

    def value_after(self, bo, bn, comps, here):               # a joined value once this tool's own edits are made
        st = self.site(bo, bn, comps, here)
        ok = here or bn == self.m(bo)
        return self.m(pj(bo, *comps)) if st[0] in ('ok', 'edit') and ok else pj(bn, *comps)

    def composed(self, d, prefix):                            # moved files in folder d whose name starts with prefix
        if d is None or not prefix:
            return []
        return [o for o, _ in self.rows if dirn(o) == d and o.rsplit('/', 1)[-1].startswith(prefix)]


class Src:
    """One code file: base-variable analysis -> edits, protected spans and MANUAL findings."""
    def __init__(self, cx, f, text):
        self.cx, self.f, self.text = cx, f, text
        self.old, self.new = cx.locs(f)
        self.lines = text.split('\n')
        self.starts = [0]
        for ln in self.lines:
            self.starts.append(self.starts[-1] + len(ln) + 1)
        self.edits, self.protect, self.findings = [], [], []
        self.env, self.broken = {}, set()

    def here(self, pair):
        return pair[0] == dirn(self.old) and pair[1] == dirn(self.new)

    def note(self, kind, line, msg):
        self.findings.append((kind, self.f, line, self.lines[line - 1].strip(), msg))

    def depth(self, name, pair, refs, line):
        vo, vn = pair
        if vo is None or self.here(pair) or vn == self.cx.m(vo):
            self.broken.discard(name)
            return
        self.broken.add(name)
        if not any(r in self.broken for r in refs):
            self.note('DEPTH', line, f'{name} is {vo or "the repo root"} now but {vn if vn is not None else "outside the repo"}'
                                     f' after the move; make it {self.cx.m(vo) or "the repo root"} (phase 1 REPO)')

    def site_edit(self, a, b, pair, comps, quote, line, suffix='', lead='', prefix=''):
        st = self.cx.site(pair[0], pair[1], comps, self.here(pair))
        if st[0] == 'none':
            return
        self.protect.append((a, b))
        if st[0] == 'edit':
            self.edits.append((a, b, prefix + quote + lead + st[2] + suffix + quote))
        elif st[0] == 'escape':
            self.note('ESCAPES', line, f'now {st[1]}, which is outside this base ({st[2]}); rewrite the base')


# ---------------------------------------------------------------- Python
IDENT = {'os.path.abspath', 'abspath', 'os.path.realpath', 'realpath', 'os.path.normpath', 'normpath', 'str',
         'os.fspath', 'Path', 'pathlib.Path', 'PurePath', 'PosixPath'}
DIRN = {'os.path.dirname', 'dirname', 'osp.dirname', 'path.dirname'}
JOIN = {'os.path.join', 'path.join', 'join', 'osp.join', 'posixpath.join'}
ENVGET = {'os.environ.get', 'os.getenv', 'environ.get', 'getenv'}


def dotted(n):
    if isinstance(n, ast.Name):
        return n.id
    if isinstance(n, ast.Attribute):
        d = dotted(n.value)
        return d and d + '.' + n.attr
    return None


def sconst(n):
    return isinstance(n, ast.Constant) and isinstance(n.value, str)


class Py(Src):
    def __init__(self, cx, f, text):
        super().__init__(cx, f, text)
        self.search = [dirn(f)]
        self.tree = ast.parse(text)
        deferred = []
        self.block(self.tree.body, self.env, deferred)
        while deferred:
            fn, env = deferred.pop(0), dict(self.env)
            if isinstance(fn, (ast.FunctionDef, ast.AsyncFunctionDef)):
                a = fn.args
                for x in a.posonlyargs + a.args + a.kwonlyargs + [a.vararg, a.kwarg]:
                    if x is not None:
                        env[x.arg] = None
            self.block(fn.body, env, deferred)

    def off(self, line, col):                                 # ast columns are UTF-8 byte offsets
        s = self.lines[line - 1].encode('utf-8', 'surrogateescape')[:col].decode('utf-8', 'surrogateescape')
        return self.starts[line - 1] + len(s)

    def path(self, n, env):
        v = self.ev(n, env)
        return v if v and v[0] == 'p' else None

    def ev(self, n, env):
        """-> ('p', old, new) a repo path, ('j', pair) a joiner, ('m', env) a module, or None."""
        if sconst(n):                                         # the literal pass rewrites an absolute constant
            r = absrel(n.value) if n.value.startswith('/') else None
            return ('p', r, self.cx.m(r)) if r is not None else None
        if isinstance(n, ast.Name):
            return ('p', self.old, self.new) if n.id == '__file__' else env.get(n.id)
        if isinstance(n, ast.Attribute):
            if n.attr == 'parent':
                v = self.path(n.value, env)
                return v and ('p', dirn(v[1]), dirn(v[2]))
            v = self.ev(n.value, env)
            return v[1].get(n.attr) if v and v[0] == 'm' else None
        if isinstance(n, ast.Subscript) and isinstance(n.value, ast.Attribute) and n.value.attr == 'parents' \
                and isinstance(n.slice, ast.Constant) and isinstance(n.slice.value, int):
            v = self.path(n.value.value, env)
            if v:
                vo, vn = v[1], v[2]
                for _ in range(n.slice.value + 1):
                    vo, vn = dirn(vo), dirn(vn)
                return ('p', vo, vn)
            return None
        if isinstance(n, ast.BoolOp) and isinstance(n.op, ast.Or):
            for v in n.values:
                if isinstance(v, ast.Call) and dotted(v.func) in ENVGET and len(v.args) < 2:
                    continue                                  # os.environ.get('MRMAS_ROOT') or ...: an override hook
                if isinstance(v, ast.Subscript) and dotted(v.value) == 'os.environ':
                    continue
                r = self.ev(v, env)
                if r:
                    return r
            return None
        if isinstance(n, ast.JoinedStr):
            return self.fstr(n, env, record=False)
        if isinstance(n, (ast.Call, ast.BinOp)):
            jp = self.joinparts(n, env)
            if jp:
                base, args = jp
                if base and all(sconst(a) for a in args):
                    comps = [a.value.lstrip('/') if isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) else a.value
                             for a in args]
                    return ('p', pj(base[0], *comps), self.cx.value_after(base[0], base[1], comps, self.here(base)))
                return None
        if isinstance(n, ast.Call):
            d = dotted(n.func)
            if d == '_repo':
                return ('p', '', '')
            if d in ENVGET:
                return self.ev(n.args[1], env) if len(n.args) > 1 else None
            if d in DIRN and n.args:
                v = self.path(n.args[0], env)
                return v and ('p', dirn(v[1]), dirn(v[2]))
            if d in IDENT and len(n.args) == 1:
                return self.ev(n.args[0], env)
            if isinstance(n.func, ast.Attribute) and n.func.attr in ('resolve', 'absolute') and not n.args:
                return self.ev(n.func.value, env)
        return None

    def joinparts(self, n, env):
        """join-like node -> (base value, argument nodes after the base), else None."""
        if isinstance(n, ast.Call):
            d = dotted(n.func)
            if d in JOIN and n.args:
                b = self.path(n.args[0], env)
                return (b[1:], n.args[1:]) if b else None
            v = env.get(d) if d else None
            if v and v[0] == 'j':
                return (v[1], n.args)
            if isinstance(n.func, ast.Attribute) and n.func.attr == 'joinpath':
                b = self.path(n.func.value, env)
                return (b[1:], n.args) if b else None
        if isinstance(n, ast.BinOp) and isinstance(n.op, (ast.Div, ast.Add)):
            chain, x = [], n
            while isinstance(x, ast.BinOp) and isinstance(x.op, type(n.op)):
                chain.insert(0, x.right)
                x = x.left
            b = self.path(x, env)
            if not b:
                return None
            if isinstance(n.op, ast.Add):                     # BASE + '/a/b' (string concatenation)
                if not (chain and sconst(chain[0]) and chain[0].value.startswith('/')):
                    return None
            return (b[1:], chain)
        return None

    def rec_join(self, n, env):
        jp = self.joinparts(n, env)
        if not jp:
            return
        base, args = jp
        comps = []
        for a in args:
            if not sconst(a):
                break
            comps.append(a)
        line = n.lineno
        if comps:
            vals = [c.value.lstrip('/') if isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) else c.value
                    for c in comps]
            a0, b0 = self.off(comps[0].lineno, comps[0].col_offset), self.off(comps[-1].end_lineno, comps[-1].end_col_offset)
            seg = self.text[a0:self.off(comps[0].end_lineno, comps[0].end_col_offset)]
            mo = re.match(r'([rRuU]?)(\'\'\'|"""|\'|")', seg)
            q = mo.group(2) if mo else "'"
            lead = '/' if isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) else ''
            suffix = '/' if comps[-1].value.endswith('/') else ''
            self.site_edit(a0, b0, base, vals, q, line, suffix, lead, mo.group(1) if mo else '')
        rest = args[len(comps):]
        if rest:
            d = pj(base[0], *[c.value for c in comps])
            x = rest[0]
            pre = None
            if isinstance(x, ast.JoinedStr) and x.values and sconst(x.values[0]):
                pre = x.values[0].value
            elif isinstance(x, ast.BinOp) and isinstance(x.op, ast.Add) and sconst(x.left):
                pre = x.left.value
            if pre:
                if '/' in pre:
                    d, pre = pj(d, pre.rsplit('/', 1)[0]), pre.rsplit('/', 1)[1]
                for o in self.cx.composed(d, pre):
                    self.note('COMPOSED', line, f'a name built at run time in {d} can be {o}, which this phase moves')

    def fstr(self, n, env, record=True):
        v = n.values
        if not (len(v) >= 2 and isinstance(v[0], ast.FormattedValue) and sconst(v[1]) and v[1].value.startswith('/')):
            return None
        base = self.path(v[0].value, env)
        if not base:
            return None
        base = base[1:]
        mo = re.match(r'/([\w.@+,=~-]+(?:/[\w.@+,=~-]+)*)?(/?)', v[1].value)
        segs = mo.group(1).split('/') if mo.group(1) else []
        whole = mo.end() == len(v[1].value)
        partial = segs.pop() if whole and len(v) > 2 and not mo.group(2) and segs else None
        if not record:
            if len(v) == 2 and whole:
                return ('p', pj(base[0], *segs), self.cx.value_after(base[0], base[1], ['/'.join(segs)], self.here(base)))
            return None
        if segs:
            a, b = self.off(n.lineno, n.col_offset), self.off(n.end_lineno, n.end_col_offset)
            vsrc = ast.get_source_segment(self.text, v[0].value) or ''
            pat = re.compile(r'\{\s*' + re.escape(vsrc) + r'\s*(?:![rsa])?(?::[^}]*)?\}/(' + re.escape('/'.join(segs))
                             + r')(?=[/{\'"]|$)')
            hit = pat.search(self.text, a, b)
            if hit:
                self.site_edit(hit.start(1), hit.end(1), base, ['/'.join(segs)], '', n.lineno)
        if partial:
            for o in self.cx.composed(pj(base[0], *segs), partial):
                self.note('COMPOSED', n.lineno, f'a name built at run time can be {o}, which this phase moves')

    def module(self, name):
        for d in self.search:
            p = pj(d, name + '.py') if d is not None else None
            if p and os.path.isfile(os.path.join(ROOT, p)) and p != self.f:
                if p not in self.cx.files:
                    self.cx.files[p] = None                   # guard against import cycles
                    try:
                        self.cx.files[p] = Py(self.cx, p, open(os.path.join(ROOT, p), encoding='utf-8',
                                                               errors='surrogateescape').read())
                    except (SyntaxError, ValueError):
                        pass
                mod = self.cx.files[p]
                return mod.env if isinstance(mod, Py) else None
        return None

    def scan(self, node, env):
        inner = set()
        for n in ast.walk(node):
            if id(n) in inner:
                continue
            if isinstance(n, ast.BinOp):
                x = n.left
                while isinstance(x, ast.BinOp) and isinstance(x.op, type(n.op)):
                    inner.add(id(x))
                    x = x.left
            if isinstance(n, (ast.Call, ast.BinOp)):
                self.rec_join(n, env)
            if isinstance(n, ast.JoinedStr):
                self.fstr(n, env)
            if isinstance(n, ast.Call) and dotted(n.func) in ('sys.path.insert', 'sys.path.append') and n.args:
                p = self.path(n.args[-1], env)
                if p:
                    self.search.append(p[1] if exists(p[1] or '.') else self.cx.m(p[1]))

    def assign(self, st, env):
        if isinstance(st, (ast.Import, ast.ImportFrom)):
            for a in st.names:
                if isinstance(st, ast.ImportFrom):
                    mod = self.module(st.module) if st.level == 0 and st.module and '.' not in st.module else None
                    if a.name == '*':
                        env.update({k: v for k, v in (mod or {}).items() if not k.startswith('_')})
                    else:
                        env[a.asname or a.name] = (mod or {}).get(a.name)
                elif '.' not in a.name:
                    mod = self.module(a.name)
                    env[a.asname or a.name] = ('m', mod) if mod is not None else None
            return
        targets, value = [], None
        if isinstance(st, ast.Assign):
            targets, value = st.targets, st.value
        elif isinstance(st, ast.AnnAssign):
            targets, value = [st.target], st.value
        elif isinstance(st, (ast.AugAssign, ast.For, ast.AsyncFor)):
            targets = [st.target]
        elif isinstance(st, (ast.With, ast.AsyncWith)):
            targets = [i.optional_vars for i in st.items if i.optional_vars is not None]
        for t in targets:
            if isinstance(t, ast.Name) and value is not None:
                v = None
                if isinstance(value, ast.Lambda) and value.args.vararg and isinstance(value.body, ast.Call) \
                        and dotted(value.body.func) in JOIN and value.body.args:
                    b = self.path(value.body.args[0], env)
                    v = ('j', (b[1], b[2])) if b else None
                else:
                    v = self.ev(value, env)
                    if v and v[0] == 'p':
                        refs = {x.id for x in ast.walk(value) if isinstance(x, ast.Name) and x.id != '__file__'}
                        self.depth(t.id, (v[1], v[2]), refs, st.lineno)
                env[t.id] = v
            else:
                for x in ast.walk(t):
                    if isinstance(x, ast.Name):
                        env[x.id] = None

    def block(self, stmts, env, deferred):
        for st in stmts:
            if isinstance(st, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                if isinstance(st, ast.FunctionDef) and st.args.vararg and len(st.body) == 1 \
                        and isinstance(st.body[0], ast.Return) and isinstance(st.body[0].value, ast.Call) \
                        and dotted(st.body[0].value.func) in JOIN and st.body[0].value.args:
                    b = self.path(st.body[0].value.args[0], env)  # def j(*p): return os.path.join(BASE, *p)
                    env[st.name] = ('j', (b[1], b[2])) if b else None
                else:
                    env[st.name] = None
                deferred.append(st)
                continue
            heads = {ast.If: ['test'], ast.While: ['test'], ast.For: ['iter'], ast.AsyncFor: ['iter'],
                     ast.With: ['items'], ast.AsyncWith: ['items'], ast.Try: []}
            kind = next((k for k in heads if isinstance(st, k)), None)
            if kind is None:
                self.scan(st, env)
            else:
                for h in heads[kind]:
                    x = getattr(st, h)
                    for y in (x if isinstance(x, list) else [x]):
                        self.scan(y, env)
            self.assign(st, env)
            for blk in ('body', 'orelse', 'finalbody'):
                if kind is not None and hasattr(st, blk):
                    self.block(getattr(st, blk), env, deferred)
            for h in getattr(st, 'handlers', []) if kind is ast.Try else []:
                self.block(h.body, env, deferred)


# ---------------------------------------------------------------- shell
SH_SET = re.compile(r'^\s*(?:export\s+|local\s+|readonly\s+|declare\s+(?:-\w+\s+)?)?([A-Za-z_]\w*)=(.*?)\s*(?:\s#.*)?$')
SH_USE = re.compile(r'\$(?:\{([A-Za-z_]\w*)\}|([A-Za-z_]\w*))(/[\w.@+,=~/-]*)')
SH_HERE = r'\$\(\s*dirname\s+"?\$(?:\{BASH_SOURCE(?:\[0\])?\}|BASH_SOURCE|0|\{0\})"?\s*\)'


class Sh(Src):
    def __init__(self, cx, f, text):
        super().__init__(cx, f, text)
        for i, ln in enumerate(self.lines, 1):
            if ln.lstrip().startswith('#'):
                continue
            self.uses(ln, i)
            mo = SH_SET.match(ln)
            if mo:
                name, rhs = mo.group(1), mo.group(2)
                vo = self.val(rhs, 0)
                vn = self.val(rhs, 1)
                refs = set(re.findall(r'\$\{?([A-Za-z_]\w*)', rhs)) - {'BASH_SOURCE', 'MRMAS_ROOT'}
                plain = re.fullmatch(r'"?(?:\$\{\w+:-)?"?\$\{?(\w+)\}?(/[\w.@+,=~/-]*)?"?\}?"?', rhs)
                if vo is not None and plain and plain.group(1) in self.env and self.env[plain.group(1)]:
                    b = self.env[plain.group(1)]              # X=$BASE/a/b: the site edit makes it right
                    vn = self.cx.value_after(b[0], b[1], [(plain.group(2) or '').lstrip('/')], self.here(b))
                self.depth(name, (vo, vn), refs, i)
                self.env[name] = (vo, vn) if vo is not None else None

    def val(self, v, k):
        v = v.strip()
        if '.mrmas-root' in v or re.fullmatch(r'"?\$\(\s*git\s+rev-parse\s+--show-toplevel\s*\)"?', v):
            return ''
        mo = re.fullmatch(r'"?\$\{[A-Za-z_]\w*:?-(.*)\}"?', v)
        if mo:
            return self.val(mo.group(1), k)
        loc = (self.old, self.new)[k]
        mo = re.fullmatch(r'"?\$\(\s*cd\s+"?(.*?)"?\s*&&\s*pwd\s*\)"?', v)
        if mo:
            inner = mo.group(1)
            h = re.fullmatch(r'"?' + SH_HERE + r'"?(/[^"\s]*)?', inner)
            if h:
                return pj(dirn(loc), (h.group(1) or '').lstrip('/'))
            return self.val(inner, k) if inner.startswith(('$', '"$', '/')) else None
        h = re.fullmatch(r'"?' + SH_HERE + r'"?(/[^"\s]*)?"?', v)
        if h:
            return pj(dirn(loc), (h.group(1) or '').lstrip('/'))
        mo = re.fullmatch(r'"?\$(?:\{(\w+)\}|(\w+))(/[\w.@+,=~/-]*)?"?', v)
        if mo:
            b = self.env.get(mo.group(1) or mo.group(2))
            return pj(b[k], (mo.group(3) or '').lstrip('/')) if b else None
        mo = re.fullmatch(r'"?(/[\w.@+,=~/-]*)"?', v)
        r = absrel(mo.group(1)) if mo else None
        return self.cx.m(r) if k and r is not None else r

    def uses(self, ln, i):
        a = self.starts[i - 1]
        for mo in SH_USE.finditer(ln):
            b = self.env.get(mo.group(1) or mo.group(2))
            if not b:
                continue
            tail = mo.group(3)[1:]
            rest = ln[mo.end(3):mo.end(3) + 1]
            segs = [s for s in tail.split('/')]
            if rest in ('$', '{', '*', '?', '[') and segs and not tail.endswith('/'):
                segs.pop()                                    # "$MIX/intro-ep1-mix-$V.wav": drop the partial name
            path = '/'.join(s for s in segs if s)
            if not path:
                continue
            s0 = a + mo.start(3) + 1
            self.site_edit(s0, s0 + len(path), b, [path], '', i)


# ---------------------------------------------------------------- TS / JS
JS_SET = re.compile(r'^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(.+?);?\s*(?://.*)?$')
JS_STR = r'(?:\'[^\'\n]*\'|"[^"\n]*")'
JS_JOIN = re.compile(r'path\.(?:join|resolve)\(\s*([A-Za-z_$][\w$]*)\s*((?:,\s*' + JS_STR + r')+)')
JS_TPL = re.compile(r'\$\{\s*([A-Za-z_$][\w$]*)\s*\}(/[\w.@+,=~/-]*)')
JS_PLUS = re.compile(r'\b([A-Za-z_$][\w$]*)\s*\+\s*([\'"])(/[\w.@+,=~/-]*)\2')
JS_HERE = re.compile(r'path\.dirname\(\s*(?:url\.)?fileURLToPath\(\s*import\.meta\.url\s*\)\s*\)|__dirname')


class Js(Src):
    def __init__(self, cx, f, text):
        super().__init__(cx, f, text)
        for i, ln in enumerate(self.lines, 1):
            if ln.lstrip().startswith(('//', '*', '/*')):
                continue
            self.uses(ln, i)
            mo = JS_SET.match(ln)
            if mo:
                name, rhs = mo.group(1), mo.group(2).strip()
                vo, vn = self.val(rhs, 0), self.val(rhs, 1)
                refs = set(re.findall(r'[A-Za-z_$][\w$]*', rhs)) & set(self.env)
                self.depth(name, (vo, vn), refs, i)
                self.env[name] = (vo, vn) if vo is not None else None

    def val(self, e, k):
        mo = re.fullmatch(r'process\.env\.\w+\s*(?:\?\?|\|\|)\s*(.+)', e)
        if mo:
            return self.val(mo.group(1).strip(), k)
        if JS_HERE.fullmatch(e):
            return dirn((self.old, self.new)[k])
        if re.fullmatch(r'_?repo\(\)', e):                     # the phase 1 marker lookup
            return ''
        mo = JS_JOIN.fullmatch(e[:-1]) if e.endswith(')') else None
        if mo and self.env.get(mo.group(1)):
            b, comps = self.env[mo.group(1)], [x[1:-1] for x in re.findall(JS_STR, mo.group(2))]
            return pj(b[0], *comps) if k == 0 else self.cx.value_after(b[0], b[1], comps, self.here(b))
        mo = re.fullmatch(r'`\$\{\s*([A-Za-z_$][\w$]*)\s*\}(/[\w.@+,=~/-]*)`', e) or \
            re.fullmatch(r'([A-Za-z_$][\w$]*)\s*\+\s*[\'"](/[\w.@+,=~/-]*)[\'"]', e)
        if mo and self.env.get(mo.group(1)):
            b, comps = self.env[mo.group(1)], [mo.group(2).lstrip('/')]
            return pj(b[0], *comps) if k == 0 else self.cx.value_after(b[0], b[1], comps, self.here(b))
        mo = re.fullmatch(r'[\'"`](/[\w.@+,=~/-]*)[\'"`]', e)
        r = absrel(mo.group(1)) if mo else None
        return self.cx.m(r) if k and r is not None else r

    def uses(self, ln, i):
        a = self.starts[i - 1]
        for mo in JS_JOIN.finditer(ln):
            b = self.env.get(mo.group(1))
            if b:
                strs = [x for x in re.finditer(JS_STR, mo.group(2))]
                comps = [x.group(0)[1:-1] for x in strs]
                s0, s1 = a + mo.start(2) + strs[0].start(), a + mo.start(2) + strs[-1].end()
                self.site_edit(s0, s1, b, comps, strs[0].group(0)[0], i)
        for rx in (JS_TPL, JS_PLUS):
            for mo in rx.finditer(ln):
                b = self.env.get(mo.group(1))
                if not b:
                    continue
                g = 3 if rx is JS_PLUS else 2
                tail = mo.group(g)[1:]
                segs = tail.split('/')
                if rx is JS_TPL and ln[mo.end(g):mo.end(g) + 2] == '${' and segs and not tail.endswith('/'):
                    segs.pop()
                path = '/'.join(s for s in segs if s)
                if path:
                    s0 = a + mo.start(g) + 1
                    self.site_edit(s0, s0 + len(path), b, [path], '', i)


# ---------------------------------------------------------------- fragments (run on the text after the rewrite)
def frag_patterns(rows):
    """(tag, kind, regex) per fragment of every old path; group 1..n marks the fragment itself."""
    E = r'(?=[/\'"`\s,;:)}\]]|$)'
    J = r'(?:join|resolve|joinpath)\((?:[^()\n]|\([^()\n]*\))*?,[ \t]*[\'"]'
    out = []
    for old in aliases(rows):
        c = old.split('/')
        for i in range(len(c)):
            tag, tail = old + ('\t' + c[i - 1] if i else ''), re.escape('/'.join(c[i:]))
            if i < len(c) - 1:                                # two or more parts: 'intro-sfx/x', dev/mcoldopen/orb.ts
                rx = r'(?:[\'"`/}]|^|\s)(' + tail + ')' + E
            elif re.search(r'[-_.]', c[-1]):                   # a leaf with punctuation: 'intro-sfx', "_reviews"
                rx = r'[\'"`/}](' + tail + ')' + E
            else:                                             # a plain word (alt, mix, retired, mcoldopen): only as a path
                rx = (r'(?:\}|\$\w+|\$\{\w+\})/(' + tail + ')' + E                 # $ROOT/reel, {AUDIO}/mix
                      + '|' + J + '(' + tail + r')(?:[\'"][ \t]*[,)]|/)'           # join(X, 'alt'), join(X, 'mix/a')
                      + r'|[\w)\'"\]][ \t]*/[ \t]*[\'"](' + tail + r')[\'"]')        # ROOT / 'mix'
                if c[-1] not in GENERIC:
                    rx += r'|[\'"`](' + tail + r')/'                  # 'retired/3.1', "mcoldopen/timeline.ts"
            out.append((tag, 'FRAGMENT', re.compile(rx, re.M)))
        for a, b in zip(c, c[1:]):                            # 'out', 'intro' and 'out' / 'intro'
            out.append((old, 'FRAGMENT', re.compile(r'[\'"](' + re.escape(a) + r')[\'"][ \t]*[,/][ \t]*[\'"]'
                                                    + re.escape(b) + r'[\'"]')))
        mo = re.match(r'^(.+?[-_])v\d+(?:\.\d+)?(?:\.\w+)*$', c[-1])
        if mo:                                                # f"shots-locked-{v}.json", `act4-mix-${v}.wav`
            out.append((old, 'COMPOSED', re.compile(r'[\'"`/](' + re.escape(mo.group(1)) + r')(?:\{|\$\{|[\'"`]\s*\+)')))
        if len(c) > 1:                                        # `studio/src/dev/${m}/timeline.ts`, f'{OUT}/{name}'
            par = re.escape('/'.join(c[:-1]))
            out.append((old, 'COMPOSED', re.compile(r'(?:[\'"`/}]|^|\s)(' + par + r')/(?:\$\{|\{[A-Za-z_]|[\'"`]\s*\+)', re.M)))
    return out


IMPORT_LINE = re.compile(r'^\s*(?:import|export)\b.*\bfrom\s*[\'"]|\brequire\(\s*[\'"]|^\s*import\s*[\'"]')


def fragments(f, text, protect, pats, keys, al):
    hits = []
    starts = [0]
    for ln in text.split('\n'):
        starts.append(starts[-1] + len(ln) + 1)
    lines = text.split('\n')
    for tag, kind, rx in pats:
        old, _, parent = tag.partition('\t')
        for mo in rx.finditer(text):
            g = next(i for i in range(1, (rx.groups or 0) + 1) if mo.group(i) is not None) if rx.groups else 0
            s, e = mo.span(g)
            if any(a <= s < b for a, b in protect):
                continue
            ln = bisect.bisect_right(starts, s) - 1
            line = lines[ln]
            if f.endswith(('.ts', '.tsx', '.mjs', '.js', '.cjs')) and IMPORT_LINE.search(line):
                continue
            a, b = s, e                                       # the whole token around the fragment
            while a > 0 and re.match(r'[\w.@+,=~/-]', text[a - 1]):
                a -= 1
            while b < len(text) and re.match(r'[\w.@+,=~/-]', text[b]):
                b += 1
            tok = text[a:b]
            var = a > 0 and text[a - 1] in '}$'
            if tok.startswith('/') and not var:
                if absrel(tok) is None:
                    continue                                  # /dev/null, /tmp/...: not a repo path
                tok = absrel(tok)
            while tok.startswith('../'):
                tok = tok[3:]
            if kind == 'FRAGMENT' and not var and tok.startswith(TOP) and not any(tok == k or tok.startswith(k + '/') for k in keys):
                continue                                      # a whole path to somewhere else that shares a name
            before = text[a:s].rstrip('/').rsplit('/', 1)[-1] if text[a:s].endswith('/') else None
            if parent and before and before not in ('.', '..', parent):
                continue                                      # render/alt is not intro-sfx/alt
            segs = [x for x in text[e + 1:b].split('/') if x] if text[e:e + 1] == '/' else []
            real = [('studio/' + x if x.startswith('src/') and x not in rows_old(al) else x) for x in (old, al[old])]
            if kind == 'FRAGMENT' and len(segs) >= 2 and not any(os.path.isdir(os.path.join(ROOT, r, segs[0])) for r in real):
                continue                                      # 'intro/sfx/x.wav' goes through no folder of out/intro
            hits.append((ln + 1, old, line.strip(), kind))
    return sorted(set(hits))


# ---------------------------------------------------------------- the rewrite of one file
LINK = re.compile(r'(\]\()([^)\s#]+)([^)]*\))')                          # [text](target "title")
IMPORT = re.compile(r'''((?:from|import|require\()\s*['"])(\.{1,2}/[^'"]+)(['"])''')


def candidates(cx):
    out = git('ls-files', '-co', '--exclude-standard').stdout.split('\n')
    return [f for f in out if f and os.path.splitext(f)[1] in TEXT and not SKIP.match(f)
            and not SKIP.match(cx.m(f)) and os.path.isfile(os.path.join(ROOT, f))]


def apply_edits(text, edits, protect):
    edits = sorted(set(edits))
    keep, last = [], -1
    for s, e, new in edits:
        if s >= last:
            keep.append((s, e, new))
            last = e
    def shift(p):
        return p + sum(len(n) - (e - s) for s, e, n in keep if e <= p)
    out, pos = [], 0
    for s, e, new in keep:
        out.append(text[pos:s])
        out.append(new)
        pos = e
    out.append(text[pos:])
    return ''.join(out), [(shift(a), shift(b)) for a, b in protect]


def rewrite(cx, f, text, rows, lit, al):
    newf = cx.m(f)
    src = None
    ext = os.path.splitext(f)[1]
    if ext in CODE:
        try:
            src = cx.files.get(f) or (Py if ext == '.py' else Sh if ext == '.sh' else Js)(cx, f, text)
            cx.files[f] = src
        except (SyntaxError, ValueError) as err:
            src = None
            print(f'# note: {f} does not parse ({err.__class__.__name__}); only the literal pass and the fragment scan ran')
    edits = list(src.edits) if src else []
    protect = list(src.protect) if src else []
    for mo in lit.finditer(text):                             # 1. literal path strings, one pass
        if not any(a < mo.end() and mo.start() < b for a, b in protect):
            edits.append((mo.start(), mo.end(), al[mo.group(0)]))
    text, protect = apply_edits(text, edits, protect)
    def rel(mo):                                              # 2. relative links and imports
        tgt = mo.group(2)
        if re.match(r'^[a-z]+:', tgt) or tgt.startswith('/'):
            return mo.group(0)
        abs_old = os.path.normpath(os.path.join(os.path.dirname(f), tgt))
        if abs_old.startswith('..'):
            return mo.group(0)
        ext2 = ''                                             # an import names 'x' for x.ts / x.tsx / x/index.ts
        if mo.re is IMPORT:
            ext2 = next((e for e in ('', '.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx')
                         if os.path.isfile(os.path.join(ROOT, abs_old + e))), '')
        new_abs = cx.m(abs_old + ext2)
        new_abs = new_abs[:len(new_abs) - len(ext2)] if ext2 else new_abs
        if new_abs == abs_old and newf == f:
            return mo.group(0)                                # neither end moved: leave the text alone
        r = os.path.relpath(new_abs, os.path.dirname(newf) or '.')
        if tgt.endswith('/'):
            r += '/'
        if mo.re is IMPORT and not r.startswith('.'):
            r = './' + r
        return mo.group(1) + r + mo.group(3)
    mid = text
    if f.endswith('.md'):
        text = LINK.sub(rel, text)
    if f.endswith(('.ts', '.tsx', '.mjs', '.js', '.cjs')):
        text = IMPORT.sub(rel, text)
    return text, mid, protect, (src.findings if src else [])


def analyse(cx, rows, allow):
    lit, al, pats, keys = literal(rows), aliases(rows), frag_patterns(rows), list(aliases(rows))
    edits, manual, reviewed = {}, [], 0
    for f in candidates(cx):
        src = open(os.path.join(ROOT, f), encoding='utf-8', errors='surrogateescape').read()
        dst, mid, protect, found = rewrite(cx, f, src, rows, lit, al)
        if dst != src:
            edits[f] = (src, dst)
        items = list(found)
        if f.endswith(CODE):
            items += [(kind, f, ln, text, ('names ' if kind == 'FRAGMENT' else 'can build a name in the folder of ') + old)
                      for ln, old, text, kind in fragments(f, mid, protect, pats, keys, al)]
        elif f.endswith('.json'):                             # data: one line per file, allow-listed as "file<TAB>*"
            hits = fragments(f, mid, protect, pats, keys, al)
            if hits:
                olds = sorted({o for _, o, _, _ in hits})
                items.append(('FRAGMENT', f, hits[0][0], '*', f'{len(hits)} data lines name {", ".join(olds)} '
                              f'(a build record or relative path; regenerate it or fix it by hand)'))
        merged = {}
        for it in items:                                      # one line per file:line, naming every old path it hits
            k = (it[0], it[1], it[2])
            merged[k] = it if k not in merged else it[:4] + (merged[k][4] + ', ' + it[4].split(' ')[-1],)
        for it in merged.values():
            key = {(p, it[3]) for p in (f, cx.m(f), cx.inv(f))}
            if key & allow:
                reviewed += 1
            else:
                manual.append(it)
    return edits, manual, reviewed


def main(cmd, manifest, allow_file=None):
    rows = load(manifest)
    assert os.path.isdir(os.path.join(ROOT, '.git')), f'ROOT={ROOT} is not the project root; set MRMAS_ROOT'
    if cmd == 'undo':
        for old, new in reversed(rows):
            if exists(old) and not exists(new):
                print('already undone', old)
                continue
            os.makedirs(os.path.dirname(os.path.join(ROOT, old)) or ROOT, exist_ok=True)
            os.rename(os.path.join(ROOT, new), os.path.join(ROOT, old))
            print('undo', new, '->', old)
            try:                                              # drop the parents apply created, if now empty
                os.removedirs(os.path.dirname(os.path.join(ROOT, new)))
            except OSError:
                pass                                          # stops at the first non-empty parent
        print('now restore text: git reset --hard <pre-phase commit>')
        return 0
    cx = Ctx(rows)
    for old, new in rows:
        if cmd == 'apply':
            assert os.path.exists(os.path.join(ROOT, old)), f'missing source {old}'
            assert not os.path.exists(os.path.join(ROOT, new)), f'destination exists {new}'
        elif not exists(old):
            print(f'# note: {old} is already moved; this lists only leftovers' if exists(new) else
                  f'# WARNING: neither {old} nor {new} exists (deleted?); drop the row, apply will refuse')
        elif exists(new):
            print(f'# WARNING: destination exists {new}; apply will refuse')
    allow = set()
    if allow_file and os.path.exists(allow_file):
        for ln in open(allow_file):
            if ln.strip() and not ln.startswith('#') and '\t' in ln:
                p, t = ln.rstrip('\n').split('\t')[:2]
                allow.add((p, t.strip()))
    edits, manual, reviewed = analyse(cx, rows, allow)
    if cmd == 'plan':
        for f, (src, dst) in edits.items():
            sys.stdout.writelines(difflib.unified_diff(src.splitlines(True), dst.splitlines(True),
                                                       'a/' + f, 'b/' + cx.m(f), n=0))
    print(f'# {len(rows)} moves, {len(edits)} files rewritten')
    for kind in ('DEPTH', 'ESCAPES', 'COMPOSED', 'FRAGMENT'):
        items = [x for x in manual if x[0] == kind]
        print(f'# MANUAL {kind} ({len(items)}):')
        for _, f, ln, text, msg in sorted(set(items)):
            print(f'{f}:{ln}: {text[:160]}    <- {msg}')
    print(f'# reviewed (in {allow_file or "no ok-list"}): {reviewed}')
    if cmd == 'frag':
        return 1 if manual or edits else 0
    if cmd != 'apply':
        return 0
    for f, (_, dst) in edits.items():                         # rewrite in place first (new inode), then move
        p = os.path.join(ROOT, f)
        tmp = p + '.orgmove-tmp'
        with open(tmp, 'w', encoding='utf-8', errors='surrogateescape') as fh:
            fh.write(dst)
        os.chmod(tmp, os.stat(p).st_mode)
        os.replace(tmp, p)
    done = open(manifest.replace('.tsv', '') + '.done.tsv', 'w', buffering=1)   # line-buffered undo log
    for old, new in rows:
        os.makedirs(os.path.dirname(os.path.join(ROOT, new)) or ROOT, exist_ok=True)
        tracked = git('ls-files', '--', old).stdout.strip()
        if tracked:
            r = git('mv', old, new)
            assert r.returncode == 0, r.stderr
        else:
            os.rename(os.path.join(ROOT, old), os.path.join(ROOT, new))
        done.write(f'{old}\t{new}\n')
        print('moved', old, '->', new, '(git mv)' if tracked else '(mv)')
    git('add', '-u', '--', *[cx.m(f) for f in edits], *[n for _, n in rows])   # stage edits + renames (tracked only)
    return 0


if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:4]))
```

**Known limits:**
- **Link labels:** the text of `` [`_reviews/x.md`](history/x.md) `` keeps the old name. Review the diff.
- **Git's rename detection:** it can show a small file whose content changed as `D` + `A`.
- **Nested sources:** a row whose source sits inside an earlier row's destination is refused by the pre-check ("missing source"). Split it into a second manifest.
- **Static evaluation only:**
  - A base taken from `argv`, a function parameter or the cwd (`ROOT=$(cd ../ && pwd)`) is unknown. Lines that join a moved fragment onto one land in FRAGMENT.
  - A variable reassigned inside a branch is traced in source order, not by control flow.
- **It doesn't follow values across languages.** `build.sh` passing `"$ROOT/audio"` to `mix.ts` is invisible to it, and lands in FRAGMENT.
- **It doesn't track the working directory.** A relative path after `cd "$(dirname "$0")"` (`run_all.sh:5`) isn't checked. Phase 1 removes these.

## Appendix B.2: `ops/fraggrep.sh` (the independent fragment check)

Save it as `ops/fraggrep.sh` in phase 0. It uses only `git grep`, so it checks the tool rather than repeating it.

```bash
# fraggrep.sh: the fragment check, independent of orgmove.py (docs/ORGANIZATION-PLAN.md §7.5). From the repo root:
#   bash ops/fraggrep.sh 2|2d|3|4|5a|5b
# Prints every code line that still names an old folder by a fragment. Each line must be fixed or be a reviewed record.
D='["'"'"'`/{}$ ]'                                   # what may come before a fragment: a quote, /, {, }, $ or a space
case "$1" in
  2)  F='review-desk|jumps/prev|_reviews|["'"'"']jumps["'"'"'] *, *["'"'"']prev' ;;
  2d) F='dialogue/retired|["'"'"']retired["'"'"']|["'"'"']retired/' ;;
  3)  F='out/(intro|animatic|pixel|reel|dev|structures|range|jumps|genvideo)([/"'"'"'` ,;:)}]|$)|["'"'"']out["'"'"'] *[,/] *["'"'"'](intro|animatic|pixel|reel|dev|structures|range|jumps|genvideo)["'"'"']' ;;
  4)  F='intro-(mix|sfx|vox)([/"'"'"'` ,;:)}]|$)|LISTENING_GUIDE|audio/(vocals|animatic|mix)([/"'"'"'` ,;:)}]|$)|["'"'"']audio["'"'"'] *[,/] *["'"'"'](vocals|animatic|mix)["'"'"']|(AUDIO|audio)[}]?[^a-z]{1,4}(vocals|animatic|mix)["'"'"'/]' ;;
  5a) F='dev/(makeRoot|pixeladv/tools/png|pixeladv/art/room|mcoldopen/orb|mfinale/callart)|["'"'"']dev["'"'"'] *, *["'"'"'](makeRoot|mcoldopen|mfinale|pixeladv)' ;;
  5b) F='dev/(mcoldopen|meras|mdinner1|mdinner2|mrollcall|mfinale|intro|animatic|reel)([/"'"'"'` ,;:)}]|$)|["'"'"']dev["'"'"'] *, *["'"'"'](mcoldopen|meras|mdinner[12]|mrollcall|mfinale|intro|animatic|reel)["'"'"']|src/dev/\$\{' ;;
  *)  echo "usage: bash fraggrep.sh 2|2d|3|4|5a|5b"; exit 2 ;;
esac
git grep -nE "(^|$D)($F)" -- '*.py' '*.sh' '*.ts' '*.tsx' '*.mjs' '*.js' '*.cjs' \
  ':!**/history/**' ':!docs/ORGANIZATION-PLAN.md' ':!ops/**' | cut -c1-200
```

## Appendix B.3: how v2 was tested (orgv2-planfix, 16:05–16:50; orgv2-planfix-r3, 22:03–23:15)

- **The copy:** a throwaway copy of the tree as of about 16:05. It holds the 1,319 tracked and untracked text files the tool scans, and empty placeholders for the 4,421 binaries and ignored media, so that moves carry them. It was committed to a fresh git repo. `.env` and `.secrets/` were left out.
- **The sequence:**
  1. Phase 2 was applied and re-planned (0 files, 0 MANUAL), and `frag` exited 0.
  2. Phase 3 was applied. The re-plan showed 0 files and 1 FRAGMENT (`range/p1/tools/build.sh:9`). After the hand fix, `frag` exited 0. `git status` showed only `R` and `M`, and every rewritten `.py` and `.sh` compiled.
  3. Phase 1 was simulated for the three DEPTH files: the marker, plus `AUDIO = os.path.join(REPO, 'audio')`.
  4. Phase 4 was planned (DEPTH 0) and applied. The re-plan showed 0 files.
  5. An AST probe executed the moved scripts' path assignments. `mixlib` gave `ROOT=.`, `AUDIO=audio` and `OUT_DIR=audio/intro/mix`. `build_intro_sfx` gave `SFXLIB=audio/sfx`, `SRC=audio/intro/sfx/src` and `EVENTS_JSON=out/season/intro/picture/intro-events.json`. `build_temp_track` gave `VO=audio/intro/vocals/vo/...`. `encode_mux.sh` gave `MIX=…/audio/intro/mix` and `PIC=…/out/season/intro/picture`.
  6. The four phase 4 code lines were hand-fixed and three items went in the ok-list; then `frag` exited 0.
  7. Phases 5a and 5b were applied and re-planned (0 files each).
- **Undo:** in a second copy, phases 2 and 3 were applied and committed, then phase 4 was applied. `undo` followed by `git reset --hard` gave a file list and sizes identical to those before phase 4 (5,740 files). The §7.5 block 1 step 1 script passed on the same pair.
- **Synthetic test:**
  - A small repo covered each language's marker resolver, joiners, `f'{REPO}/...'`, `${X:-$REPO/...}`, `path.join(REPO, 'out', 'reel')` and `path.resolve(HERE, '../../audio/intro-sfx')`.
  - Every form was rewritten correctly, including recomputed `..` parts.
  - An argv-based join was listed as FRAGMENT.
- **Not tested here:** the typecheck, the renders and the real intro remix (the copy has no `node_modules`, venvs or media). §7.5 runs those on the real tree.

**The re-check at 22:03–23:15 (`orgv2-planfix-r3`)**, on a new copy of the tree as of 22:03 (1,465 text files and 4,527 placeholders, 52 MB), made the same way:
1. **Dry runs** of every manifest: the counts in §0 and Appendix C. Only `phase6.tsv` warned (the two deleted premix WAVs), so it's now 26 rows.
2. **End to end,** in this order, with `frag` and `fraggrep.sh` after each:
   - Phase 2: `frag` exited 0 with no ok-list.
   - Phase 3, then the three `sed` hand fixes and `phase3.ok.tsv` (§4): `frag` exited 0. Every rewritten `.py`, `.sh` and `.mjs` compiled. `git status` showed only `R` and `M`.
   - Phase 1, simulated for the three DEPTH files (the marker, the §4 resolver and `import sys`), then phase 4: `DEPTH (0)`. After the hand fixes and `phase4.ok.tsv`, `frag` exited 0. An AST probe resolved `OUT_DIR=audio/intro/mix`, `SRC=audio/intro/sfx/src`, `EVENTS_JSON=out/season/intro/picture/intro-events.json`, `VO=audio/intro/vocals/vo/...` and `PICTURE=out/season/reels` (`audio/reel/build_all.py`). `encode_mux.sh` gave `MIX=$ROOT/audio/intro/mix` and `PIC=$ROOT/out/season/intro/picture`.
   - Phase 5a, then the shim `sed`: the studio typecheck, run with the real `node_modules` linked in, gave the same 11 lines as the baseline (all pre-existing `Buffer` errors in `src/dev/realism/bake/bake.ts`, exit 2).
   - Phase 5b, then the `events.ts` `sed`: the typecheck was identical again. Only the 8 lookdev wrappers still import `src/dev/`.
   - Phase 6 (26 rows): 26 moves, 26 files, 1 COMPOSED (`report_v4.py:137`, harmless). No `D` entries in `git status`.
   - The §7.5 step 2 grep (with the new pathspecs) then found 0 lines for every row of every manifest.
3. **Undo** of phase 3 on a second copy: identical files and folders (§7.6).
4. **Tool changes,** each tested there: the `plan` warning for deleted rows (from an earlier re-check at 18:03, `orgv2-planfix-r2`, which didn't update this file; it also ran the 5a/5b typecheck test, with the same result), and the `undo` clean-up.

## Appendix C: what the v2 dry run found (about 22:10, on the 22:03 copy; 16:45 in brackets)

| Phase | Moves | Files rewritten | DEPTH | ESCAPES | COMPOSED | FRAGMENT | What the MANUAL lines are |
|---|---|---|---|---|---|---|---|
| 2 | 3 | 5 (5) | 0 | 0 | 0 | 0 | — |
| 2d | 1 | 3 (3) | 0 | 0 | 0 | 10 (10) | Prose written into the dialogue doc (`make_doc*.py`, `lines_a4.py`) |
| 3 | 14 | 132 (123) | 0 | 0 | 0 | 7 (1) | Hand: `range/p1/tools/build.sh:9`, `range/ep1-p1/tools/build.sh:18`, `range/ep1-p3/tools/build.sh:10`. False positives: `fastrec.py` ×3 (its own `--out`), `reel/tools/episode.mjs:58` (it builds `out/epNN/reel/` or `out/season/reel/`) |
| 4 | 7 | 35 (29) | 3 | 0 | 0 | 10 (10) | DEPTH: the three `AUDIO = os.path.dirname(HERE)` (phase 1 clears them). FRAGMENT: `cue.py:101-102`, `mix.ts:69,85`, `build_intro_sfx.py:1422-1424`, `spotting.json`, `alt/spotting_script-v2.1-frames.json`, the `ivlib.py:1` docstring |
| 5a | 5 | 119 (101) | 0 | 0 | 2 | 12 (11) | `events.ts:24-25` (a false positive here); provenance records in `board_v2.py` and `lock_v2.py`; 3 comments; v1/v2 shot JSON |
| 5b | 14 | 139 (129) | 0 | 0 | 2 | 14 (14) | `events.ts:24-25` (real: labels); SFX labels `build_intro_sfx.py:113-116`; `picture-sync.json`; provenance records; a comment in `mcoldopen.frame.tsx:3` |
| 6 | 26 (28) | 26 (27) | 0 | 0 | 1 | 33 (34) | `report_v4.py:137` (harmless once `-v3` is kept); mostly `board_v3.py` provenance. The 28-row manifest also warned about the two deleted premix WAVs. |

**Where the growth since 16:45 comes from:** the outro prototypes (`studio/src/dev/outro/`, phases 4, 5a and 5b), the Ep1 range prototypes (`studio/src/dev/range/ep1-p*`, phases 3 and 5a), the episode-reel tool and its README and example manifest (`studio/src/reel/`, phases 3, 4, 5a and 5b), and two new show docs (`show/bible/ai-media-range.md` and `show/production/OUTRO-PROPOSALS.md`).

Compared with the critic's 15:40 run of the v1 tool, phase 3 went from 119 files with 14 MANUAL lines to 123 files with 1, and phase 4 from 25 files with 40 MANUAL lines to 29 files with 13.
- Most of the rest is gone because the tool now rewrites those lines.
- The `audio/mix/` sketch scripts aren't reported, because files moving into `history/` are skipped.

**What the rewrites look like** (phase 3, from the diff):
- `EVENTS = os.path.join(ROOT, 'out', 'intro', 'picture', 'intro-events.json')` becomes `os.path.join(ROOT, 'out/season/intro/picture/intro-events.json')`.
- `OUT=${REEL_OUT:-$ROOT/out/reel}` becomes `OUT=${REEL_OUT:-$ROOT/out/season/reels}`.
- `OUT = f'{ROOT}/out/reel'` becomes `f'{ROOT}/out/season/reels'`.
- `verify.py:22`'s `'..', '..', '..', 'out', 'intro', 'intro-ep1-V1-4k.mp4'` becomes `'../../../out/season/intro/intro-ep1-V1-4k.mp4'`.
- `PIC=$ROOT/out/intro/picture` becomes `PIC=$ROOT/out/season/intro/picture`.

**The earlier notes:**
- **Phase 3:** most of the changes in code files are render commands in header comments (`// npx remotion still src/dev/<key>/entry.tsx … ../out/<old>/…`). Output constants that write are rewritten: `sound.mjs:19` (`path.join(ROOT, 'out/jumps')`), `test_genvideo.py:34` (`gv.ROOT / 'out/genvideo/tests'`) and `proto1/tools/build.sh:15` (`OUT=../out/jumps`).
- **Phase 5a:** of its 101 files, 22 are Act Four and 6 are `src/shared/pixel`; the rest are dev entries importing `makeRoot`. The typical change is `import {makeRoot} from '../../../../dev/makeRoot'` becoming `'../../../../shared/makeRoot'`.
- **Phase 5b:** the moved moments' own imports gain one `../`, and the `src/intro/scenes.ts` imports become `'./moments/mcoldopen/scene'`.
- **Phase 6:** the rewrites include the moved docs' outgoing links, the OST mm10 and mm11 README, the `track.py` and `.cue.json` provenance, the dialogue `lines_a4.py:515` and `make_doc.py:518`, and `plan_v3.py`/`templates.ts`, `edit-plan-v4.md`, `pov-changes.md`, `tighten-changes.md` and `script.md`.

## Appendix D: re-measuring before acting

- **The fastest re-measure is `ops/orgmove.py plan <phase>.tsv`.** It lists every rewrite and every MANUAL line against the tree as it is now, in about 35 s a phase. `bash ops/fraggrep.sh <phase>` is the second opinion.
- **Survey scripts:** `tree.py` (per-folder counts and sizes) and `refmap.py` (references per candidate folder) live in the session scratchpad under `org-survey/`, which doesn't persist.
  - Their method is simple enough to redo: walk the tree, pruning `node_modules`, `.venv*`, `audio/samples`, `__pycache__`, `cache`, `_work`, `tts_cache`, `.git` and `studio/out`.
  - Then grep each old path with the §7.4 boundary regex.
- **ripgrep in this harness:**
  - `rg` is a shell function that wraps the Claude binary. From Python, call `subprocess.run(['rg', ...], executable='<claude binary>')`, with the binary found in the function body (`type rg`).
  - **Don't pass `-I`.** In ripgrep it means `--no-filename`.
  - Pass an absolute search root, and use `--with-filename` when you need file:line.
- **Ignored media not protected by git:** `git ls-files --others --ignored --exclude-standard` lists it: 2,336 files and about 4.2 GB at 15:10, not counting deps, samples and caches.
- **A throwaway copy for a dry run of `apply`** (how Appendix B.3 was made): copy the text files from `git ls-files -co --exclude-standard`, add empty placeholders for the binaries and the ignored media, leave out `.env` and `.secrets/`, then `git init` and commit. It takes about 30 MB and a minute.
  - To typecheck the copy, link the real `studio/node_modules` into it (`tsc --noEmit` writes nothing) and add `studio/node_modules` to the copy's `.git/info/exclude`. Otherwise git lists the link as an untracked file and the tool tries to read it.
  - Use a second copy for undo tests, so a failed test can't leave the first copy half-moved.

---

## 10. Critic review (2026-09-26, about 15:45)

Written by the `org-critic` pass. The pass was read-only for the project apart from this file, and didn't read `.env`. It checked the plan against the tree as it stood at about 15:40:
- It re-ran the embedded tool in `plan` mode for phases 2–5b.
- It grepped for reference forms the tool can't see.
- It tested the tool (plan, apply, undo) and the rollback steps on throwaway repos in its scratch folder.

§10.1–10.4 are kept as the record of that review. §10.5 says how each finding was resolved.

### 10.1 Verdict (15:45)

**Not ready to execute as written.**
- **Phase 0 is ready:** the `.gitignore` fix for `audio/reel/**/*.wav` (the 144M `mix.wav` is confirmed unignored), the checkpoint and the snapshot.
- **Phase 2 is ready for rows 2.1, 2.2, 2.4 and 2.6.** Use the corrected tool. Row 2.3 needs three tool fixes first; drop row 2.5.
- **Phase 3 is ready** once the nine new MANUAL lines are fixed and the v5 pass has been told where its reels will go.
- **Phase 4 isn't ready** until its roughly 25 audio-relative references are in the manifest's hand-fix list and verified by a real intro remix.
- **Phase 6 needs re-auditing** at v5 lock.

Phases 1 and 5a were only spot-checked. Their counts reproduce: 61 files contain `/home/jgon`; 7 cast shims; 14 wrapper imports.

### 10.2 The top 10 issues, most severe first

1. **The tool rewrote this plan.**
   - This file is untracked and not ignored, so every phase rewrote it: dry runs gave 6, 119, 26, 102 and 130 files, each the plan's count plus one.
   - The phase 3 dry run turned the §4 "Old" column and the Appendix A manifests into new paths (`out/intro` → `out/season/intro` in both columns), and mis-mapped `out/pixel/{dinner,moments}-preview.png` to `out/lookdev/pixel/`.
   - That would have destroyed the old-to-new table that §5 tells people to use for translating old paths.
   - **Fixed** in Appendix B (`SKIP`).
2. **Phase 4 missed the intro mix's own inputs and output.** `os.path.join(AUDIO, 'intro-sfx/...')` and similar forms were neither rewritten nor listed:
   - `mix_intro.py:164-169` (the six stems) and `mixlib.py:23` (`OUT_DIR`).
   - `analyze_inputs.py:12-18`, `sfx_balance.py:10` and `verify.py:132,156,161`.
   - `encode_mux.sh:9`, `make_previews.py:37`, `build_temp_track.py:30` and `range/p2/tools/cue.py:101-102`.
   - After phase 4 as written, the intro can't be remixed, and `mixlib` recreates `audio/intro-mix/`.
   - **Listed** in §4. The corrected tool now reports them.
3. **Phase 3 missed nine `$ROOT/out/...` writers and readers**, and Appendix C claimed one of them was rewritten automatically.
   - `encode_mux.sh:10,11` (the intro's final V1–V4 mux), `render_all.sh:17` (the reel default output) and `season_sheet.py:9`.
   - Jumps: `proto2/tools/build.sh:13`, `proto3/tools/build.sh:11` and `jumps/tools/reel.sh:11`. Range: `p1/tools/build.sh:9` and `p2/tools/build.sh:13`.
   - Phase 5b has the same gap at `render_all.sh:99` (`$STUDIO/src/dev/reel/season_sheet.py`).
   - **Listed** in §4. Appendix C is corrected, and the tool now reports these.
4. **Phase 6 would break the current v4 animatic and a live report.**
   - The "retired" TS modules in 6.7 are imported by the v4 composer (`shots4.ts:66-71`, `frame4.ts:24`, `Animatic.tsx:9`, `lay.ts:29`, `frames.ts:9`) and by style-jump prototype 1 (`lockv2.ts:13-15`). The other three are imported transitively, so none of the eight can be deleted.
   - `report_v4.py:137-148` loads `shots-locked-v3.json`, `act4-mix-v3.cues.json` and `act4-mix-v3.wav` through `f"...-{v}..."`, names no grep can find. That affects 6.3, 6.5 and the §6.1 "delete the v3 WAVs" recommendation.
   - **Corrected** in 6.3, 6.5, 6.7 and §6.1.
5. **Two phase 2 "none" references are wrong.**
   - `dialogue/retired/` is read by `make_doc_32.py:17` and `pace_32.py:55`, and written by `record_32.py:350-369`. §6.1 keeps those tools on purpose.
   - `intro-sfx/alt/` is rewritten on every SFX build (`build_intro_sfx.py:1381-1386`), so it isn't an older round. The phase 4 verification's SFX rebuild would recreate it.
   - **Corrected** in 2.3 and 2.5.
6. **The verification couldn't see the misses.**
   - The §7.5 grep sat in a table with `\|` escapes. Copied raw, it matched 0 lines where 11 existed.
   - Its boundary set was the tool's own, so it couldn't see issue 3 either.
   - The "re-run `plan`, expect 0 files" step failed: `plan` asserted that the sources exist.
   - The reel smoke test never runs `render_all.sh`, so "no stale writers" didn't cover the default output.
   - **Fixed:** the grep is a tested code block that also catches `$VAR/` forms and `}` endings, and `plan` re-runs list the leftovers.
7. **The post-push rollback didn't work.**
   - `git checkout <checkpoint> -- <old and new paths>` aborts on the new paths ("pathspec did not match") and restores nothing (tested).
   - **Replaced** in §7.6 with undo, `reset --hard <checkpoint>`, `reset --soft <pushed>` and a commit. Tested: the tree equals the checkpoint, and the ignored media is back.
8. **Missing from the move map: the live Act Four v5 stick-figure reel.**
   - `out/reel/ep01-act4-v5.mp4` and its sheet were rendered at 15:16–15:17, after the 15:10 measure.
   - Phase 3 would have filed them with the season reels, against §2.
   - **Added** two Appendix A rows, moving them to `out/ep01/act4/reel/`.
   - **Still open:** `render_all.sh` needs ID-based routing, or `REEL_OUT`, so the next v5 render doesn't land in `out/season/reels/`. The v5 pass must be told.
   - `audio/reel/ep01-act4-v5/mix.wav` is audio cut to one picture edit. By §2 it belongs beside that picture; leave it until the v5 pass is done.
9. **The deletion tables had errors.**
   - `shape-extra-lineup.png` isn't a duplicate (different md5).
   - The wrong `tonetest.png` copy was marked for deletion: the root copy is the render target in `studio/notes/render.md:24`.
   - Deleting the 4K V1 master alone gets undone by `encode_mux.sh:29`, which re-muxes it from `picture/intro-ep1-4k-silent.mp4` (8.8M, not listed).
   - `nole-tone-test.png` and both mfinale WAVs are named in the docs.
   - The recoverable total is about 134M, not 195M.
   - **Corrected** in §6.
10. **The preconditions could pass falsely.**
    - `find -newermt '-10 minutes'` errors in this harness's `bfs`, which prints nothing on stdout, so the "no pass running" check read as idle. Replaced with `-mmin -10` and prunes.
    - There was no free-disk check, with the disk at 99% (6.1G free).
    - `apply` and `undo` were shown without `MRMAS_ROOT`, so the old tool fell back to the cwd; the corrected tool refuses a non-repo root.
    - The hard-link snapshot is aliased by the in-place writes of the verification steps. For phase 3, a real copy of the 745 MiB of ignored media is now suggested.

### 10.3 Smaller notes (15:45)

- **Phase 1 portability test:** `sync.mjs` resolves by depth and has no `/home/jgon`, so it doesn't exercise phase 1. `build.py --index` needs `.venv-theme` and `audio/samples`, which a fresh worktree lacks. Pick probes that are among the 61 converted files, run with the main checkout's venv by absolute path.
- **The OST test count:** `engine/tests` has 49 `def test` methods, against the "43 tests" in §7.2 and §7.5. Compare against the recorded baseline, not a fixed number.
- **The phase 6 manifest** is a brace template, not TSV. Expand it to one row per file before the §7.3 loop.
- **The phase 1 Bash resolver** echoes `/` when there's no marker. Make it exit with a message, as the Python version does.
- **The §5 workflow templates:** "the live workflow templates" have no location in the repo; only `.backups/` holds copies. Say where the lead keeps them.
- **Is the target layout findable in a minute?** Mostly yes, once the §8 READMEs and `docs/STATUS.md` exist. Until 5b runs, the shipped intro code still sits in `studio/src/dev/`, so `studio/src/dev/README.md` is the one README that matters most.

### 10.4 How the critic checked (15:40)

The critic saved Appendix B as `<scratch>/orgmove.py`, copied the Appendix A blocks into `phaseN.tsv` files, and ran `plan`. With the v1 tool:

| Phase | Files rewritten | MANUAL lines |
|---|---|---|
| 2 | 5 | 1 |
| 3 (with the 2 new rows) | 119 | 14 |
| 4 | 25 | 40 |
| 5a | 101 | 5 |
| 5b | 129 | 9 |

The v2 results are in Appendix C.

### 10.5 Resolution (orgv2-planfix, about 16:50)

| # | Critic finding | Resolution | Evidence |
|---|---|---|---|
| 1 | The tool rewrote this plan | Kept the `SKIP`, and added `ops/` and files moving into `history/` | Dry runs no longer count this file |
| 2 | Phase 4 missed the intro mix's inputs and output | The tool now rewrites them all (`mix_intro.py:164-169`, `mixlib.py:23`, `analyze_inputs.py:12-18`, `sfx_balance.py:10`, `verify.py:22,132,156,161`, `encode_mux.sh:9`, `make_previews.py:37`, `build_temp_track.py:30`, `assemble.py:82`). The 4 lines with an argv or parameter base (`cue.py:101-102`, `mix.ts:69,85`) are listed for a person. | Phase 4 applied on the copy; the AST probe resolved every constant (Appendix B.3) |
| 3 | Phase 3 missed nine `$ROOT/out/...` lines | Rewritten automatically: `encode_mux.sh:10,11`, `render_all.sh:17`, `season_sheet.py:9`, the three jumps scripts, `range/p2/tools/build.sh:13`. `range/p1/tools/build.sh:9` (a cwd-relative `ROOT`) is the one line listed for a person. The 5b gap `render_all.sh:99` is rewritten too. | `bash ops/fraggrep.sh 3`: 110 lines before, 0 after |
| 4 | Phase 6 would break the v4 animatic and `report_v4.py` | The eight modules, their three generators and `report_v4.py`'s three v3 inputs are **KEEP until the Act Four v5 pixel lock**, not retired. `phase6.tsv` is expanded to 28 rows without them. The tool now flags composed names (COMPOSED). | The phase 6 dry run lists `report_v4.py:137,138,144` with the full list, and only a harmless `:137` without the KEEP files |
| 5 | `dialogue/retired` is live; `intro-sfx/alt` is rewritten every build | `retired/` stays; it moves only in the optional phase 2d, together with its tools, which the tool now rewrites automatically. The `intro-sfx/alt` row is dropped. | Phase 2d dry run: 7 join lines rewritten, 10 prose lines listed |
| 6 | The verification couldn't see the misses | The commands sit in code blocks, none in table cells. Two fragment checks were added: the tool's `frag`, and the independent `fraggrep.sh`, which searches fragments such as `intro-sfx`, `'out', 'intro'`, `$ROOT/out/...` and `src/dev/${…}`. | The before and after counts in §7.5 |
| 7 | The post-push rollback | Kept. The before-commit undo was re-tested with the v2 tool. | Identical file list (Appendix B.3) |
| 8 | The v5 reel | Rows kept. The exact `REEL_OUT` command for act reels is in §4. Telling the v5 pass is in §0.2 step 3. | — |
| 9 | The deletion tables | Kept, and aligned with the KEEP list (134M recoverable; `act4-mix-v3.wav` kept) | — |
| 10 | Preconditions | Kept. Added a size guard, the value half of the secret scan, and a real media copy for phases 3 and 4. | — |
| 10.3 | Smaller notes | The Bash resolver exits (tested). The OST count is compared with the baseline. `phase6.tsv` is expanded. The portability probes are converted files. The workflow scripts live in `ops/workflows/`. | — |

### 10.6 Re-check against the tree at 22:03 (`orgv2-planfix-r3`, about 23:15)

The 16:50 revision was checked again, item by item, against the critic's findings and against what other passes had changed since 16:05. The tests are in Appendix B.3.

**The critic's findings still hold as resolved:**
- **The variable-built paths in the intro mix, SFX, verify, mux and preview scripts** are rewritten automatically in phases 3 and 4. The AST probe resolved every constant after the moves.
- **The `$ROOT/out/...` writers** in `encode_mux.sh`, `render_all.sh`, `season_sheet.py`, the jumps and range build scripts and `range/tools/reel.py` are rewritten automatically. The cwd-relative ones are hand fixes: 1 at 16:45, 3 now.
- **The KEEP list.** Every import behind it was re-read at 22:03: `shots4.ts:66-71`, `frame4.ts:24`, `Animatic.tsx:9`, `lay.ts:29`, `frames.ts:9`, `lockv2.ts:13-15`, and `report_v4.py:137,138,144`.
- **`dialogue/retired/`** is still read by `make_doc_32.py:17` and `pace_32.py:55`, and written by `record_32.py`. No new tool reads it.
- **`intro-sfx/alt/`** is still written by `build_intro_sfx.py:1381-1386`. There's no row for it.
- **The verification commands** are code blocks only. No table cell holds a command.
- **The fragment searches** (`orgmove.py frag` and `fraggrep.sh`) cover `intro-sfx`, `'out', 'intro'`, `$ROOT/out/...` and `src/dev/${…}`.

**New since 16:05, and fixed in this file:**

| # | Finding | Fix |
|---|---|---|
| 1 | Seven tracked duplicate PNGs and five ignored media files were deleted at 16:09, uncommitted. Phase 0's `git add -A` would commit the seven. | §0.1, §6 and §9 item 4 record it. §7.1 item 3 first lists what `git add -A` would remove (a code line there), and the lead confirms. |
| 2 | `phase6.tsv` named the two deleted premix WAVs, so `apply` would stop at `missing source`. | The rows are dropped (26 rows). `plan` now warns about such rows. |
| 3 | Two new Ep1 range scripts write `OUT=$ROOT/out/range/ep1` after a cwd-relative `ROOT`. | Phase 3 hand fixes, as tested `sed` lines. Phase 1 lists their roots. |
| 4 | Four new phase 3 FRAGMENT lines are false positives (`fastrec.py` ×3, `episode.mjs:58`). | `phase3.ok.tsv` is given verbatim in §4. |
| 5 | The episode-reel tool writes season reels to `out/season/reel/`; phase 3 makes `out/season/reels/`. | §0.1 asks the reel owner for a one-word change. |
| 6 | Phase 1 grew from 61 to 81 files, and its resolver needs `import sys`. | §4 phase 1 lists the new files and the import. |
| 7 | The §7.5 whole-path grep printed 7 record lines (JSON under `out/`) after phase 3. | Its pathspecs now leave out the §7.4 "never touched" list. |
| 8 | `undo` left empty parent folders behind (`out/season/`). | `undo` removes them if empty and is re-runnable (Appendix B, item 6). |
| 9 | The 5a shim repoint had no command, and the 5a invariant used `rg`, which is a wrapper function in this harness. | A tested `sed` line, run after `apply`, and a `git grep` invariant. |
| 10 | Phases 4 and 5b had no ready-made hand-fix commands. | Tested `sed` lines for both are in §4, with phase 4's ok-list verbatim. |

---

## Verification (v2) (`orgv2-verify`, 2026-09-27, about 02:09–03:05)

Written by the `orgv2-verify` pass. It was read-only for the project apart from this section, didn't read `.env`, and ran nothing through `.secrets/`. One side effect on the real tree is recorded under issue 5.

**The copy.** A throwaway copy of the tree as of 02:09 (`HEAD` `9b407e1` plus the working tree), made the Appendix D way and deleted afterwards:
- 1,767 tracked and untracked text files and 130 small ignored text files (the QA logs, `.backups/*.js`, caches) were copied. The 18 audio inputs that `mix_intro.py --dry V1` and the OST loudness test read were copied for real. So were `audio/sfx/` and `audio/intro-sfx/` (788 files), for a real SFX rebuild.
- The other 5,288 binaries and ignored media became empty placeholders, so moves carry them and check 1 counts them (7,228 files in the §7.2 list).
- `studio/node_modules`, the seven venvs and the sample libraries were symlinks, used read-only. From 02:35 `node_modules` was a folder of per-package symlinks with its own empty `.cache/` (issue 5).
- 531 MB, committed to a fresh git repo. Appendix B and B.2 were extracted from this file. Their md5 matches the copy `orgv2-planfix-r3` tested.

**The run.** Phases in the §0.2 order (0, 2, 3, 1 simulated, 5a, 4, 2d, 5b, 6), each applied with `apply`, then hand-fixed with the §4 `sed` lines and ok-lists. §7.5 block 1 steps 1–5 and 9 ran after each one, and then the phase was committed in the copy. Heavy steps went through `ops/heavy.sh`, one at a time:
- the typecheck;
- `npx remotion compositions -q` on seven entries, one per area: `src/index.ts` (intro, reels, jumps, lookdev), the `mcoldopen` moment, the intro entry, the reel entry, the Act Four animatic, range p1 and outro B;
- the OST tests and `build.py --index`;
- `mix_intro.py --dry V1`;
- the SFX rebuild.

### Per-phase verdicts

| Phase | Verdict | Evidence (on the copy) |
|---|---|---|
| **0** | **PASS, with the corrections in issue 7** | The QA-log exception works: `record.log` is no longer ignored and the 8 logs are added. `audio/reel/**/*.wav` is ignored. 25 scripts were copied into `ops/workflows/`. The pattern half of the secret scan found 0 credential-shaped strings (1,546 lines; the real `.backups/*.js`, read-only). The size guard (real tree, on a copy of the index) printed nothing for the 809 files `git add -A` would add. **`git add -A` would remove 10 files**, all outro stills and QA frames under `out/lookdev/outro/{a,b,c,d}/`, deleted after `9b407e1` (02:04). The value half of the scan wasn't run; it reads `.env`, so the lead runs it. |
| **2** | **PASS** | 3 moves, 5 files, 0 MANUAL. `frag` exited 0 with no ok-list, `fraggrep.sh 2` went from 1 line to 0, and the whole-path grep printed 0 lines. Files 7,228 → 7,228. Git showed 33 `R` and 5 `M`. The eleven 2.6 folders were checked in the real tree: all exist and are empty. 2.7 is moot (issue 7). |
| **3** | **PASS, with issue 2** | 14 moves, 139 files (132 at 22:03). The new references are in `captions/tools/build_access.py`, `range/ep1-p3/tools/sound.py`, `show/reel/ep01-full/ep01-full-v2.manifest.json` and four docs; all were rewritten. The 3 FRAGMENT lines are the three hand fixes. The `sed` lines match by content (`ep1-p3/tools/build.sh` is `:12` now). After them and `phase3.ok.tsv`: `frag` exited 0, fraggrep went from 122 lines to 0, and the grep printed 0 lines. Git showed 618 `R` and 129 `M`, and every changed `.py`, `.sh` and `.mjs` compiles. The typecheck was identical to the baseline (11 `Buffer` errors, exit 2). The compositions were identical (7 entries, 255 IDs). The probes resolve: `build_all.py` `PICTURE=out/season/reels`, `render_all.sh` `OUT=${REEL_OUT:-$ROOT/out/season/reels}`, `encode_mux.sh` `PIC`/`OUT` under `out/season/intro`, and `EVENTS`/`EVENTS_JSON` at `out/season/intro/picture/intro-events.json`, which exists. `sync.mjs` changed the generated reel data only in the intro `src`. `episode.mjs --plan` puts the intro chapter at `out/season/intro/intro-ep1-V1-1080p.mp4`. |
| **1** | **PASS for what was simulated** (it's a hand edit) | **Scope is now 89 code files.** The 8 new since 22:03 are `audio/ep01/act4/sfx-v5/{qa_board,render_v5,spot_v5}.py`, `audio/ost/tracks/e01-act4-v5/s1-s4_render.py`, `studio/src/dev/outro/e/entry.tsx` and `animatic/tools/{lock_v5.py,lock_v5_mixcheck.py,render5.ts}`. 16 files were converted with the §4 resolvers: the 3 DEPTH files, `mixlib.py`, `verify.py:22`, `run_all.sh`, `encode_mux.sh`, the OST and theme `sampler.py`/`export.py`, `dsp.py` and the 4 OST editor tools. All compile. Then the phase 4 dry run showed `DEPTH (0)`. In a `git worktree`, the block 2 Python probe resolved `REPO` to the worktree. The Bash resolver did too, run from the root, from `/` and from `audio/`, but see issue 3. The Node resolver has no code in §4, so it wasn't tested. |
| **5a** | **PASS** | 5 moves, 119 files, 2 COMPOSED and 12 FRAGMENT, as §4 says. With a 14-row ok-list, `frag` exited 0. After the shim `sed`, the invariant lists only `src/intro/scenes.ts` and the 14 wrappers. fraggrep went from 36 lines to 8: the 7 known ones, plus one new comment, `art-v5/j1/entry.tsx:5` ("no src/dev/makeRoot import"). The typecheck and the compositions were identical. |
| **4** | **PASS, with issues 2 and 4** | 7 moves, 39 files (35 at 22:03). DEPTH was 0 after the phase 1 simulation. After the three hand fixes and `phase4.ok.tsv`, `frag` exited 0. fraggrep went from 56 lines to 8: the 6 prose lines in §4, plus `audio/samples/fetch_samples.sh:17,20`. The whole-path grep printed 1 line (issue 4). The probes resolve: `OUT_DIR=audio/intro/mix`, `SRC=audio/intro/sfx/src`, `SFXLIB=audio/sfx`, `VO=audio/intro/vocals/vo/…`, `encode_mux.sh` `MIX=$ROOT/audio/intro/mix`, `run_all.sh` `PY=$REPO/audio/.venv-mix/bin/python`, `assemble.py:82` → `intro/history/sketch-mix/music/…`, and both full-episode manifests → `audio/intro/mix/…`. **`mix_intro.py --dry V1` exited 0, and its measurements were byte-identical before and after the move.** **The SFX rebuild** (`audio/.venv/bin/python audio/intro/sfx/build_intro_sfx.py`, real inputs) exited 0 and wrote `"present": true`. Neither `audio/intro-sfx` nor `audio/intro-mix` was recreated. Every stem came out bit-identical: git showed only `spotting.json` and `alt/spotting_script-v2.1-frames.json` changed, and only in their path labels. After that, the ok-list needs only the `ivlib.py` row. |
| **2d** | **PASS** | 1 move, 3 files (the 7 join lines), 10 FRAGMENT. With them in the ok-list, `frag` exited 0. fraggrep went from 8 lines to 2: `lines_a4.py:505,508`, which are `"files": ["retired/…"]` lists rather than prose, so edit them to `history/`. The three tools compile, `history/3.1/lines.json` is there, and `lines.json` (227 paths) and `lines-v5.json` (541) have 0 missing. |
| **5b** | **PASS** | 14 moves, 132 files (after 5a). The `events.ts` `sed` clears both COMPOSED lines. The 14 FRAGMENT lines are the 13 records plus `J1Preview.tsx:7`, a comment naming `./entry.tsx`, which is a false positive. With them in the ok-list, `frag` exited 0. fraggrep went from 119 lines to 7. Git showed 7 `D` + 7 `A` pairs, each `A` at its `D`'s manifest destination (checked by script). Only the 8 lookdev wrappers still import `src/dev/`. The typecheck was identical, and so were the compositions with the entry paths mapped. **The events export** (esbuild + node) gave 153 events. Before 5b it was byte-identical to the committed `intro-events.json`. After 5b, only `src` differed, and every change was `studio/src/dev/<m>/` → `studio/src/intro/moments/<m>/`. `master.sh 1080` wasn't run (a full render). |
| **6** | **PASS** | 26 moves, 26 files, 1 COMPOSED (`report_v4.py:137`) and 33 FRAGMENT, as §4 says. With a 34-row ok-list, `frag` exited 0. Git showed 24 `R` and 26 `M`, and no `D`. The three KEEP files are in place. `lock_v3.py` reads `history/shots-v3.json`, `plan_v3.py` loads `history/shots-locked-v2.json`, and `report_v4.py`'s `load_cut("v3")` still finds `shots-locked-v3.json` and `act4-mix-v3.*`. |
| **All, at the end** | **PASS, apart from issues 2 and 4** | The whole-path grep over all 70 manifest rows printed 1 line (`fetch_samples.sh:17`). The typecheck and the compositions (255 IDs) were identical to the baseline. OST: 49 tests passed, the same as after the phase 1 simulation. `build.py --index` gave rows identical to the pre-phase-4 build (35 tracks; the committed `ost-index.json` has 24 and is stale, which has nothing to do with the reorg). `mix --dry V1` was identical. The dialogue paths had 0 missing. `sync.mjs` and `episode.mjs --plan` resolve every chapter. |
| **Undo and rollback** | **PASS** | On a second copy: apply phase 3, commit, `undo`, `git reset --hard` gave files **and folders** identical (7,952 entries). A second `undo` printed "already undone". The post-push sequence (§7.6: undo, `reset --hard`, `reset --soft`, a revert commit) left a tree identical to the checkpoint and a clean status. |

**Not tested here:** the 7 probe stills (md5), the 48-frame reel smoke render, a full `run_all.sh` (the mux and `verify.py` need the real picture masters), `master.sh 1080`, the phase 1 conversion of all 89 files, and the value half of the secret scan. §7.5 runs them on the real tree.

### Issues still to fix (most important first)

1. **Check 6 can't fail as written.** `npx remotion compositions <entry> --log=error` prints no IDs (tested: exit 0, empty output), so the §7.2 step 2 file is empty and its diff always passes. Use `-q`, which prints the IDs (this pass's baseline was 255 IDs over 7 entries):
   ```bash
   (cd studio && for e in src/index.ts $(git ls-files '*entry.tsx'); do echo "== $e"; npx remotion compositions "$e" -q 2>&1; done) > "$B/compositions.txt"
   ```
   There are 52 tracked entries, so that's 52 bundles. Run it through `ops/heavy.sh`, or probe one entry per area as this pass did.
2. **The tool rewrites `<old>.<ext>` as if it were `<old>`.** The literal lookahead accepts `.`, so a file named like a moved folder plus an extension is rewritten. Three lines now, all comments or records:
   - Phase 4: in `studio/src/dev/outro/b/entry.tsx:108` and `outro/d/entry.tsx:12`, the outro's own `audio/mix.py` becomes `audio/intro/history/sketch-mix.py`.
   - Phase 3: in `show/_sources/plan-v1.md:461`, `out/intro.mp4` becomes `out/season/intro.mp4`.
   - Fix those lines back by hand after `apply`, or change the tool's lookahead so a `.` counts only before whitespace, a quote or the end. To find such lines before a phase, for each row:
   ```bash
   git grep -nP "(?:^|(?<=[\s\"'\`(\[=:,]))$(printf '%s' "$OLD" | sed 's/[.]/\\./g')\.[A-Za-z]"
   ```
3. **The §4 Bash resolver can hang for ever.** If its inner `cd` fails, `d` is empty, `dirname ""` gives `.`, and the loop never reaches `/`.
   - That happens if the line is pasted after a script's own `cd "$(dirname "$0")"`, and the script is started by a relative path from another folder. `run_all.sh:4` is that `cd`, and §4 says to convert line 5. Tested: it hung until `timeout 5` killed it.
   - Put the `REPO=` line before any `cd`, and make it fail instead of looping, for example `d=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) || exit 1` in front of the loop, and `[ "$d" = / ] || [ "$d" = . ]` as the stop test.
   - With the line before the `cd`, it resolved correctly from every cwd tried.
4. **`audio/samples/fetch_samples.sh:17,20` isn't rewritten, so check 2 fails after phase 4.** The file is tracked, but the tool's `SKIP` covers `audio/samples/`, and its comments name `audio/mix` (`:17`) and `intro-sfx, intro-vox, intro-mix, vocals` (`:20`). The `r3` copy had no `audio/samples/`, so it didn't see them. Edit the two comments by hand in phase 4, or add `':!audio/samples/**'` to the step 2 pathspecs and list the lines as records.
5. **`--bundle-cache=false` deletes the shared webpack cache.** It isn't just "no cache": Remotion prints "🧹 Cache disabled but found. Deleting..." and removes `studio/node_modules/.cache/webpack/remotion-production-4.0.529/`, whoever made it.
   - §7.2 and §7.5 use the flag, which is acceptable only because no pass may be running.
   - `render_all.sh:51` and `episode.mjs:100` also pass it on every reel render, so concurrent passes delete each other's cache.
   - **Side effect of this verification:** its phase 3 compositions run, at about 02:26–02:31, deleted that real cache three times through the copy's `node_modules` symlink, before the copy got its own `.cache/`. The cache is regenerable and ignored; no source or media changed. The next bundle was cold; another pass rebuilt the cache at 02:49.
   - A copy for Remotion checks needs its own `node_modules/.cache` (a folder of per-package symlinks plus an empty `.cache/`), not a symlink to the real `node_modules`.
6. **The heavy commands don't use `ops/heavy.sh`.** SHOWRUNNER-NOTES (09-27) says every heavy command goes through it, but the §7.2 and §7.5 commands don't: the renders and stills, the typecheck, the OST tests, the SFX rebuild, `run_all.sh` and `master.sh`. Prefix them, and keep `--concurrency` at 4 or less.
7. **The tree has changed since 22:03**, so §0.1, §6, §7.1 and §9 need updating:
   - **The seven duplicate PNG deletions are no longer uncommitted.** `8c76d3f` (09-26 23:45) committed them, and it's on `origin/main`. `HEAD` no longer has the files, so `git checkout HEAD -- <path>` (§6) can't restore them. Use `git checkout eaad42a -- <path> …`; all seven are in `eaad42a`. §9 item 4's question to the showrunner stands, but it's now about an undo, not a gate on phase 0.
   - The `audio/reel/**/*.wav` rule was committed in `eaad42a` (22:54).
   - `ops/` already exists and is tracked (`heavy.sh` and `README.md`, `9b407e1`). Phase 0 adds to its README instead of writing a new one, and §3's tree should list `heavy.sh`.
   - `git add -A` would now add 809 files and remove 10, all outro stills. The outro pass is presumably re-rendering them; ask before the checkpoint.
   - Phase 1 is 89 files.
   - `episode.mjs:58` still writes `out/season/reel/` (singular).
8. **Unconverted `/home/jgon` constants make copies unsafe to run in.** Until phase 1 has run, 79 or more code files in any copy or worktree still point at the real project. For example, `encode_mux.sh`'s `ROOT` writes the real `out/intro/`, and the OST `sampler.py` `CACHE` writes the real `audio/ost/cache`. Appendix D should say to run nothing from a copy that still holds the constant, or to convert it first, as this pass did for the 16 files it ran.
9. **Small corrections:**
   - Appendix A's `# phase5a.tsv (after the shim repoint, step 1)` contradicts §4, where the shim repoint is step 2, after `apply`.
   - `git check-ignore -v` prints the QA log too, with its `!` rule, even though the log isn't ignored. Use `git check-ignore -q audio/ep01/act4/dialogue/qa/record.log || echo "not ignored"`.
   - The 5a and 5b ok-lists now have 14 rows each; the new ones are `art-v5/j1/entry.tsx:5` (5a fraggrep) and `J1Preview.tsx:7` (5b).

**Throwaway files:** the copies and the `node_modules` shim were deleted after this section was written. The ok-lists and logs used are in `scratchpad/orgv2-verify/v2/{man,res}/`, which doesn't persist. The older `orgv2-verify/{manifests,tools,x}/`, left by an earlier run, weren't touched.
