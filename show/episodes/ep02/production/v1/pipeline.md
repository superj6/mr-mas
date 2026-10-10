# Ep2 v1: the production pipeline

> **Status: built and tested, 2026-10-08, by the Ep2 pipeline pass.** Every stage of Ep1's v3.5 pipeline has an Ep2 copy, pointed at Ep2's paths, with Ep1's specific tables and layers taken out. One thing is new: **the picture renders per scene**, with a content-hash cache, so a change to one scene's timing or art re-renders only that scene. That answers the showrunner's question: "why do we not have scripts to have each of the individual parts and make splicing/editing easier?"
>
> **Ep1 is untouched.** No file under Ep1's locked paths was edited. `ops/rebuild-act.sh` gained `--ep 2`; without it, its six dry runs are identical to before. The smoke test passes against its pre-change baseline, and the final film still matches `ops/reorg/ep01-final.sha1` (§9).
>
> **What was measured and what wasn't.** Every claim below is marked [M] (measured from files) or [J] (judged). Nothing was watched or listened to. The Ep2 beat plans arrived while this pass ran, with no takes yet, so the real locks, the score, the stems and the film are not built here. Each stage was run end to end on synthetic Ep2 data in scratch instead (§4, §5).

**Contents:** [0. The map](#0-the-map) · [1. Locks](#1-locks) · [2. The voices (EL route)](#2-the-voices-the-el-route) · [3. Picture](#3-picture) · [4. Per-scene editing and its proof](#4-per-scene-editing-and-its-proof) · [5. Score](#5-score) · [6. Sound and mix](#6-sound-and-mix) · [7. Assembly and the one-command rebuild](#7-assembly-and-the-one-command-rebuild) · [8. The intro, the card and the outro](#8-the-intro-the-card-and-the-outro) · [9. Ep1 is untouched](#9-ep1-is-untouched) · [10. Open issues and asks](#10-open-issues-and-asks) · [11. Files](#11-files)

**Read first:** [LEARNINGS.md](LEARNINGS.md) (R1, R9, R10 bind every step below), [proposal.md](proposal.md), [manifest.md](manifest.md) §0 and §9. Ep1's record of the same pipeline: [full-v3/pipeline.md](../../../ep01/production/full-v3/pipeline.md), [assembly.md](../../../ep01/production/full-v3/assembly.md) §Z.

---

## 0. The map

Every path is from the repo root. "From" names the Ep1 file the copy came from; Ep1's file is never edited.

| Stage | Tool (Ep2) | Reads | Writes | From (Ep1, locked) |
|---|---|---|---|---|
| Base lock | `audio/reel/ep02-v1/build_timeline.py` | `show/episodes/ep02/production/v1/beat-plan/<seg>.json`; takes under `audio/ep02/` | `show/reel/ep02-v1/ep02-v1-<seg>.json`, the manifest, the card's timeline | `audio/reel/ep01-v35/build_timeline.py` |
| Temp bed | `audio/reel/ep02-v1/bed.py` (+ `rooms.py`, new) | the base lock | `audio/reel/ep02-v1/<seg>-bed.wav` | `audio/reel/ep01-v35/bed.py` |
| Transcript | `audio/reel/ep02-v1/measure.py` | a lock + the stick reel's plan | `production/v1/lock-v1[-el]-transcript.txt` | `audio/reel/ep01-v35/measure.py` |
| EL takes | `audio/ep02/v1-el/tools/el_render.py` | a lock (or a beat plan), `audio/ep02/cast-el.json` | `audio/ep02/v1-el/ep02-v1/<seg>/lines-A.json` + WAVs | `audio/ep01/v3-el/tools/el_render.py`, `cast-el.json` |
| EL lock (the master) | `audio/ep02/v1-el/tools/el_lock.py` | the base lock + the EL takes | `show/reel/ep02-v1-el/ep02-v1-el-<seg>.json` + manifest | `audio/ep01/v3-el/tools/el_lock.py` |
| Takes + mouths | `production/v1/assembly/tools/el_takes.py` | the EL takes | `production/v1/assembly/el-v1/<seg>-takes.json` | `full-v3/assembly/tools/el_takes.py` |
| Pixel lock | `production/v1/assembly/tools/el_lock.sh` → `studio/src/episodes/ep02/pixel/tools/lock.py` | the EL lock + takes (+ the mix) | `studio/src/episodes/ep02/pixel/<seg>/data.ts`, `production/v1/lock/<seg>.json` | `full-v3/assembly/tools/el_lock.sh`, `pixel/tools/lock.py` |
| Scene modules | `studio/src/episodes/ep02/pixel/tools/scenes.py` (new) | the pixel lock | `<seg>/scenes/sc-<scene>.ts` stubs, `<seg>/shots.ts`'s imports | — |
| Picture | `studio/src/episodes/ep02/pixel/tools/{build.mjs,render.ts}` `scenes` | the pixel lock + the scene modules | `out/ep02/v1/scenes/<seg>/` (the cache), `out/ep02/v1/picture/<seg>.mp4` | `pixel/tools/{build.mjs,render.ts}` |
| Score | `audio/ost/tracks/e02-v1-<seg>/track.py` (stubs) + `e02-v1-common/` | the lock | `render/music[-el].wav`, `cues[-el].json` | `tracks/e01-v3-*/` helpers |
| Stems | `audio/reel/ep02-v1/stems.py` | the lock, the plans, the SFX board, the score's claims | `audio/reel/ep02-v1/stems/[el/]` | `audio/reel/ep01-v3/stems.py` |
| Mix | `audio/reel/ep02-v1/mix_episode.py` | the lock, takes, stems, score | `out/ep02/v1/mix/<seg>-mix.wav`, `outro-mix.wav` | `audio/reel/ep01-v3/mix_episode.py` |
| Scene review | `production/v1/assembly/tools/scene_cut.py` (new) | the scene cache + the act mix | `out/ep02/v1/review/scenes/<seg>-sc-<scene>.mp4` | — |
| Film | `production/v1/assembly/tools/{assemble,qa,seam_frames,flash_seg,intro_flashfix}.py` | the chapters | `out/ep02/v1/ep02-v1.mp4`, `production/v1/assembly/v1-{assembly,qa}.json`, the transcript | `full-v3/assembly/tools/` |
| One command | `ops/rebuild-act.sh --ep 2 <act> [--scene ID]` → `ops/rebuild-act-ep2.sh` | all of the above | | `ops/rebuild-act.sh` |

`PY=audio/.venv-casting/bin/python`, `TH=audio/.venv-theme/bin/python`, `A=show/episodes/ep02/production/v1/assembly`, `S` = your scratch folder. Every heavy step goes through `ops/heavy.sh`, one heavy job at a time (LEARNINGS R10).

---

## 1. Locks

### 1.1 The base lock (Kokoro timing)

```sh
python3 audio/reel/ep02-v1/build_timeline.py [seg ...]        # default: every segment that has a plan; plain python3
audio/.venv-casting/bin/python audio/reel/ep02-v1/bed.py       # the temp beds (heavy-ish: through ops/heavy.sh)
```

- **The plans are Ep1's schema** (full-v3/PLAN.md §2 and the v3.1–v3.5 fields). Ep2's are all `new` beats with `"source": null`: the copy accepts that (an empty source), and refuses a `keep`, `cut` or `merge` beat that names no source beat. A later Ep2 round's plan can name the previous Ep2 lock as its `source` and use the delta actions, as Ep1's rounds did.
- **Takes.** Every line needs a take (Ep1's rule: a line with no take is left out and listed as a deviation; the checks then fail). The copy reads takes from, in order: `--takes FILE`, a Kokoro round (`audio/ep02/v1/<seg>/lines-v1.json`), the voices pass's `lines-A*.json` anywhere under `audio/ep02/`, any other `lines*.json` there (never auditions or caches). The first file that has an id wins, and each timeline's `_source.takes_files` lists the files it used. So when the voices pass renders ElevenLabs takes straight away (the script pass's plan says so), the base lock is already EL-timed, and `el_lock.py` (§2) changes nothing but the record.
- **The per-beat tables are empty.** Ep1's builder carried about 40 tables of fixes keyed by Ep1 beat ids (`SOUND_DROP`, `ADD_TIME`, `GROW_AT`, ...). They are all present and empty here; an Ep2 lock pass adds its own entries, with the reason, as Ep1 did.
- **`scene` matters now.** Each plan beat's `scene` is carried into the lock beat as `passes.scene`, and the pixel lock makes its scenes from it (§3). The builder fails a check for a beat with no scene id.
- **The manifest** (`show/reel/ep02-v1/ep02-v1.manifest.json`, key `ep02-v1-stick`) has Ep2's chapters: the cold open, the Ep2 intro variant (`out/ep02/v1/intro/intro-ep2-V1-1080p.mp4` with `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav` at −3 dB), the card (`ep02-v1-card`, `ep1.1_her.wav`), the four acts, the tag and Ep2's outro (`out/ep02/v1/outro/outro-b-ep2.mp4`/`.wav` at −1 dB).
- **Tested [M]:** on a synthetic six-segment plan with no source and borrowed takes, in scratch: every beat built, the scenes carried, the checks clean, pacing and the manifest written. On the script pass's real plans (`--out` to scratch, 2026-10-08 21:32): all six parse (coldopen 13 beats, act1 62, ...); every line is reported missing its take, as it should be until the voices pass runs.

### 1.2 The EL-timed lock and the pixel lock

```sh
$PY audio/ep02/v1-el/tools/el_lock.py                         # all six + the manifest (the master: show/reel/ep02-v1-el/)
$PY audio/ep02/v1-el/tools/el_lock.py act3 --fixed 17.04      # one act; a beat whose length is reserved
$PY $A/tools/el_takes.py [seg ...]                            # the EL takes with mouth tracks -> $A/el-v1/<seg>-takes.json
bash $A/tools/el_lock.sh [seg ...]                            # the pixel lock of each segment on the EL timeline
python3 studio/src/episodes/ep02/pixel/tools/scenes.py <seg>  # a stub module for each new scene
```

- **One lock path (LEARNINGS R9).** Ep1 kept two pixel locks (the Kokoro one in `pixel/<seg>/data.ts`, the EL one in `assembly/el-vNN/`) and redirected the renderer's `./data` import at build time (`build_el.mjs`, `bundle_el.mjs`). Ep2's `el_lock.sh` writes the EL lock into the canonical files, `studio/src/episodes/ep02/pixel/<seg>/data.ts` and `production/v1/lock/<seg>.json`; there is nothing to redirect. `KOKORO=1 bash $A/tools/el_lock.sh` locks the base lock instead, for a picture pass that starts before the EL takes exist. Layout marks are anchors (words, sounds, texts), so a layout drawn on the Kokoro lock re-anchors itself on the EL one.
- **The `--fixed` trap is fixed** (voices-el.md §AE: `el_lock.py --lock v35 --fixed S7.13 act2` rebuilt all six segments, because `--fixed` took every word after it). The copy takes one beat id per `--fixed` (or a comma list), parses segment names anywhere on the line (`act1 --fixed 4A.02 act2` is two segments and one beat), and refuses a segment name as a beat. **[M]** `act1 --fixed S7.13 act2` → segments act1 act2, fixed [S7.13]; `act1 --fixed act2` → "--fixed takes beat ids, not segments".
- **A rebuild can't silently drop a line** (voices-el.md §AD: Act One's hand-placed V.O. went on a re-run). Before overwriting an EL timeline, the copy compares line ids; if the existing file has a line the new one doesn't, it stops and names it (`--force` rebuilds anyway, and the report says what went). **[M]** a hand-added line in a scratch EL timeline stopped the rebuild: "has line(s) the new one would drop: ['e2-vo-handplaced']". The rule that follows (R9): a line placed by hand belongs in the beat plan, so the base lock carries it.
- **The episode-in** of every segment is computed from the EL timelines (the cold open, then the 30 s intro and the 2 s card, then the acts), as Ep1's `el_lock.sh` did for v3.1 on.

---

## 2. The voices (the EL route)

```sh
HF_HUB_OFFLINE=1 $PY audio/ep02/v1-el/tools/el_render.py plan --lines show/reel/ep02-v1/ep02-v1-act1.json --sets A
HF_HUB_OFFLINE=1 $PY audio/ep02/v1-el/tools/el_render.py render --lines show/reel/ep02-v1/ep02-v1-act1.json \
    --out audio/ep02/v1-el/ep02-v1/act1 --sets A --dry-run                 # what it would send; writes nothing
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY audio/ep02/v1-el/tools/el_render.py render --lines show/reel/ep02-v1/ep02-v1-act1.json \
    --out audio/ep02/v1-el/ep02-v1/act1 --sets A --max-chars 6000 --retry-bad 1 --retry-pitch
```

- **The cast** is `audio/ep02/cast-el.json`, a copy of Ep1's (manifest.md §5: Ep1's picks carry over; each new role is auditioned and added with its reason). Changes from Ep1's file: its own `cache_dir` (`audio/ep02/v1-el/cache`), Ep1's cache listed as `cache_read` (only read: a request identical to one Ep1 already paid for is copied, not sent; nothing is written to Ep1's cache), and no `engine_from_lock` (MARIO stays on his Kokoro takes on every Ep2 lock). Library voices only; no cloning, no voice design, no "sounds like" (S6). The key is read inside `ellib.py` from `.env`, never printed.
- **The `--dry-run` trap is fixed.** Ep1's `render --dry-run` returned early for the rows not yet cached, then wrote `lines-<set>.json` with only the cached rows and saved `manifest.json`, so a dry run before a real one cut the segment's takes list. The copy's dry run writes nothing (no lines JSON, no manifest, no log, no folders) and prints each row it would send. **[M]** a scratch folder holding a `lines-A.json` and a `manifest.json`: after a dry run of three rows ("would send 116 chars"), both files are byte-identical.
- **Beat plans as input.** `el_render.py` reads a beat plan's own lines (Ep1's format), so the voices pass can render before the base lock exists.
- **Not copied** (Ep1-table-driven; a voices pass copies them with Ep2's tables when it needs them): `el_cut.py` (lines cut from another take: the plans' `cut_from`), `pron_check.py` (the forced-choice name checks), `el_intro.py` (§8).
- **The takes pass (2026-10-09)** copied `el_cut.py` (its table read from the plan's `_spec.py` CUT) and `pron_check.py` (Ep2's names), and added `el_qa.py` (every take measured, failures retaken, the report), `el_crowd.py` (the layered chant), `el_sung.py` (the sung line through the intro's singer), `el_mario.py` (MARIO on Kokoro through Ep1's fastrec, run, never edited) and `render_v1.sh`, the one command that records the episode. The record: [takes-qa.md](takes-qa.md).
- **The auditions** (the casting pass, 2026-10-09): `audio/ep02/v1-el/tools/el_audition.py`, Ep1's method with Ep2's roles, shortlists and scene neighbours. It renders through `el_render.render_take` on the episode's seeds, so each pick's auditioned lines are cached as its film takes. The picks are in `cast-el.json`, and the numbers and reasons are in [cast.md](cast.md) §3 and §8.

---

## 3. Picture

The Ep2 pixel pipeline is `studio/src/episodes/ep02/pixel/`: Ep1's frame, V.O. line, band, transitions, stand-ins, lip-sync, lock, renderer and builder, copied with no Ep1 art ([its README](../../../../../studio/src/episodes/ep02/pixel/README.md) has the commands). Its compositions register from `entry.tsx` as `ep02-pixel-<seg>` (+ `-review`, `-still`). Each of the six segments has a scaffold: `data.ts` is a 2 s placeholder lock (`lock.py --scaffold`, one stand-in shot that says no lock yet) and `shots.ts` imports no scenes, so each segment registers and renders before its lock exists. **[M]** `act1`'s scaffold builds, `check --allow-standins` passes, and `scenes` renders its 48 frames; `npx remotion compositions src/episodes/ep02/pixel/entry.tsx` lists all 24 compositions (the six segments, the card and the example, each with `-review` and `-still`).

What changed from Ep1, so a scene can be edited alone:
1. **Scenes in the lock.** `tools/lock.py` gives every shot `scene` (the beat's `passes.scene`; a beat without one inherits the scene before it) and `sceneS` (its scene's first frame), and the lock a `scenes` table: runs of shots with one scene id, tiling the act (checked). A scene that returns after another is a second run, `id~2`.
2. **One module per scene.** A segment's layouts are `<seg>/scenes/sc-<scene>.ts` (`defineScene({scene, layouts, assets?})`); `shots.ts` only imports them, in a block `tools/scenes.py` rewrites after a re-lock (adding a stub for each new scene, never touching a module that exists).
3. **A layout's `f` is the frame inside its scene** (Ep1 passed the act frame). Everything else the host draws for a scene (rails, burned subtitles, the next shot of a dissolve) is rebased the same way (`frame.ts sceneSeg`). So a scene draws the same pixels wherever it sits in the act, and a timing change in one scene doesn't change the next scene's pixels.
4. **`scenes`**, the per-scene render (`tools/render.ts`): each scene renders alone into a cache, `out/ep02/v1/scenes/<seg>/sc-<scene>-<key>.mp4`, and the act picture is their concat with no re-encode. The key hashes everything that can change the scene's pixels:

| Part | What it hashes |
|---|---|
| slice | the scene's shots from the lock (lines, mouths, words, texts, marks, spots, cast, framing), the rails and (if burned) the subtitles over it, all rebased to the scene's first frame; the next scene's first shot only when the scene's last shot dissolves into it |
| code | every source file the scene's layouts import, from the bundle's esbuild metafile (`build.mjs` writes `<bundle>.meta.json`): the scene module and its imports (rooms, cast, kits, the Ep1 helpers), plus the pipeline (render.ts and its imports). A layout written straight in `shots.ts` brings all of `shots.ts`'s imports, the lock excepted |
| assets | files a layout names (`assets`), an overlay's manifest and every layer it lists |
| glyph | the Remotion host's PNGs for the scene's GLYPH and browser frames (`GLYPH_DIR`) |
| enc | the encoder's arguments, the picture size, the segment options, the glyph mode, the cache's own version |

Other modes: `scenekeys` (each scene's key, cached or not, and which part changed since the last index), `scenecheck` (every act frame against the same frame drawn by its scene alone; exit 1 on any difference), `sceneprune` (delete cache entries the current and previous index don't name). `--only ID[,ID]` renders just those scenes and doesn't touch the act picture; `--force` renders even when cached; `--dry` prints what would render and why. A scene file's bytes are reproducible with `X264_THREADS=1`.

---

## 4. Per-scene editing and its proof

**The test bed** is `studio/src/episodes/ep02/pixel/example/` (not the show): three scenes (A: two shots and a rail that runs on into B; B: a V.O. line, then a shot that dissolves into C; C: one shot), 228 frames. **The test** is `bash studio/src/episodes/ep02/pixel/tools/scenetest.sh <scratch>`, which renders through `ops/heavy.sh`, changes one thing at a time, renders again, and puts every file back at the end. The run of 2026-10-08 [M]:

| Step | Change | Rendered | Cached | Notes |
|---|---|---|---|---|
| 1 | first render | A B C | — | `scenecheck`: 228 frames compared, 0 differ |
| 2 | scene A's art (one colour) | **A** | B C | `scenekeys`: A's `code` part changed; B and C "as the index" |
| 3 | A's art put back | — | A B C | A's first file was still in the cache |
| 4 | scene B's timing (ex-b1 2.5 → 3.0 s: C starts 12 frames later) | **B** | A C | C moved and stayed cached; `scenecheck` on the new lock: 240 frames, 0 differ |
| 4b | — | C, forced, into a second cache | — | the cached C (rendered at act frame 180) and the fresh C (at 192): **the same bytes** (md5 `d006214b…`) |
| 4c | scene A's timing (ex-a1 2.0 → 2.5 s) | **A B** | C | B too, correctly: A's rail runs on into B's first frames, and its tail over B moved |
| 5 | scene C's art | **B C** | A | B too, correctly: B's last shot dissolves into C's first frame |
| 6 | — | — | — | the act's H.264 stream = the three scene files' streams back to back (md5 `8a521a1f…` both): the concat is lossless |
| 7 | everything put back | — | A B C | the committed example; nothing rendered |

- **A negative control [M]:** a layout that draws on the act's clock (`sh.s + k` instead of `f`) fails `scenecheck` (60 of B's frames differ), so the check would catch the one way a layout can break scene independence.
- **End to end on Ep2's own chain [M]:** the synthetic base lock (§1.1) → `lock.py` → `scenes --dry`: its two scenes (4: 219 frames, 4A: 158) came from the plan's scene ids, and `scenecheck` passed (100 frames, 0 differ).
- **What it costs [M, J]:** a scene's key takes milliseconds (hashing about 50 small source files). In the recorded run each scene rendered in 1.3–7.0 s for 48–108 frames (8–28 s in an earlier run under heavier load from other projects), mostly ffmpeg's start-up at this size; an act should render at about Ep1's rate (15–21 ms a frame a worker), since the drawing is the same code [J]. The run's log: [assembly/scenetest-v1.txt](assembly/scenetest-v1.txt).
- **The workflow** for one changed scene: edit its module (or its beats in the plan), re-lock if the timing changed (a second), rebuild the renderer (a second), `scenes` (only the changed scenes render), then `scene_cut.py <seg> <scene>` for the scene with its sound, or `ops/rebuild-act.sh --ep 2 <act> --scene <id>` for all of it (§7).

---

## 5. Score

`audio/ost/tracks/e02-v1-common/` holds copies of Ep1's shared segment-score helpers, pointed at Ep2's locks: `v3lib.py` (composer X's: the clock, thinning under talk, cues on a grid, render, lay-in, measurement), `v3clock.py`, `v3music.py`, `v3lay.py` (composer Y's), `cueapi.py` (Act Four's frame- and seconds-style cue APIs, its own constants left out) and `check.py` (Ep1's `v35check.py`: every segment's stem against its lock). **Since the score review (2026-10-09)** `check.py` also checks the lock's content hash (each cue sheet's `lock_sha1`), S3's −42 dBFS / 0.3 s holes, fragments measured from the stem, and the per-line pocket (`pocket.py`: every take against the score as the mix ducks it, 1–4 kHz; an onset under +10 dB fails unless the cue sheet exempts it with a reason). The module names are Ep1's, so Ep1 cue code ports with one `sys.path` line.

Each segment has `audio/ost/tracks/e02-v1-<seg>/track.py`, a stub the score pass fills (`CUES`, manifest.md §6's E02-01 to E02-13; the outro's E02-14 is the outro's own, §8). The stub already does the plumbing: `--dry` prints the lock's music runs (each run of beats with one `music (v1): E02-NN ...` string, with its times) until there are cues; with cues it builds, renders (`--render`, through `ops/heavy.sh` with `OST_WORKERS=2`), lays them on the segment clock and writes `render/music[-el].wav` (the segment's exact length) and `cues[-el].json`, which names the timeline it was laid to (the stems and the mix use a score only on its own lock) and may list `claims_sfx` (timeline sounds the score plays instead).

```sh
$TH audio/ost/tracks/e02-v1-act1/track.py --dry --el                      # the runs on the EL lock
OST_WORKERS=2 bash ops/heavy.sh $TH audio/ost/tracks/e02-v1-act1/track.py --render --el
$TH audio/ost/tracks/e02-v1-common/check.py                               # the six stems against the EL lock
```

**[M]** the act1 stub on the synthetic lock prints its one run ("E02-02 THE SÉANCE"); `check.py` lists every segment as missing (no locks, no renders yet).

---

## 6. Sound and mix

`audio/reel/ep02-v1/stems.py` and `mix_episode.py` are Ep1's with every Ep1-specific layer removed (the v3.1/v3.2/v3.5 layers, the made rooms of Ep1's sets, the laps, the vault hum, Gerg's keys, THE ONE SILENCE, the set pieces, gain rows, score rides and curves, the cold open's +6 dB, Ep1's mood and hole tables). What stays is the machinery, driven by the lock:
- **Rooms from the lock:** one bed per run of a beat `room`, from `rooms.py` (new): each Ep2 room (the beat plans' 30 names) maps to SFX-board beds, the first candidate on the board, so a new bed from the SFX pass (`bed_lobby_day`, `bed_seance_candles`, ... manifest.md §7) replaces its stand-in with no code change. Rooms lead the cut 0.6 s (or the plan's J-cut), trail 0.4 s (or its L-cut), a black gets a faint room tone, quiet beds are lifted to the floor.
- **SFX from the lock's sounds:** SFX-board files or `synth:<kind>` (Ep1's v2 bed modules, imported read-only), at their written peaks, faded so none ends on a step; a plan J-cut that names a beat's own sound moves it earlier; a sound the score claims is left out.
- **Dialogue from the takes:** dual mono at −3 dB, device chains for call / monitor / laptop / phone / stage / stream / tv / podcast tags, **V.O. +2.0 dB** (`VO_GAIN_DB`), interrupted lines cut at their `dur`, EL takes levelled to their Kokoro counterparts where the lock carries one, and **MARIO's EQ** (+1.5 dB at 350 Hz, −1.5 dB at 2.2 kHz, −0.5 dB; voices-el.md §AB3) on a Kokoro take in the EL film.
- **The bed and the ducking:** rooms dip 2 dB under speech; the score ducks under speech (0.25 s pre, joined across gaps under 2.5 s, 0.2 s in, 0.6 s out) by a depth per E02 cue, a cue sheet's `duck_db` overriding it; −3 dB under a silent post; a fade-in at each act's head unless the cue sheet marks a designed hit or the act's score pre-lap already plays; the previous chapter's score ring-out laid under the next chapter's head, and (since the score review) the next chapter's score pre-lap (its cue sheet's `prelap`) laid under this chapter's tail, the card included; a score is used only on the lock whose content hash its cue sheet carries.
- **Loudness:** −16 LUFS integrated per segment, a look-ahead limiter at −1.5 dBFS and a true-peak check under −1.0 dBTP, the seams ramped from the previous chapter's gain, the dialogue guard (1.5 LU over the episode's median dialogue), the card at Act One's gain, `outro-mix.wav` (the tag's hum held 2 s under the outro's head, its first hit −6 dB).

```sh
$PY audio/reel/ep02-v1/mix_episode.py --all            # the EL film (default --variant el); re-runs itself through heavy.sh,
                                                       # rebuilds the stems first when any input changed
$PY audio/reel/ep02-v1/mix_episode.py act3 act4        # some segments (a changed act and the one after it)
```

**[M]** on the synthetic six-segment lock (scratch, `--variant kokoro`, no score): every segment −16.0 LUFS, true peak −2.85 to −3.0 dBTP, dialogue −16.0 LUFS (spread 0.02 LU), the episode −16.1 LUFS, the five story seams within 0.5 dB with sample jumps under 0.001, no holes, the card −37.7 LUFS; rooms resolved through their stand-ins where the new beds aren't on the board yet (e.g. `bridge: bed_lighthouse -41 + room_tone -42 (stand-in)`).

---

## 7. Assembly and the one-command rebuild

### 7.1 The film

**Built 2026-10-10 by the assembly pass:** `out/ep02/v1/ep02-v1.mp4`, 23:41.00, every QA check passing; the record, the chapters and the human checks are in [assembly.md](assembly.md).

```sh
ASM_SCRATCH=$S bash ops/heavy.sh $PY $A/tools/assemble.py v1 [--dry]   # -> out/ep02/v1/ep02-v1.mp4 + $A/v1-assembly.json
ASM_SCRATCH=$S bash ops/heavy.sh $PY $A/tools/qa.py v1                  # -> $A/v1-qa.json, $A/transcript-film.txt, the sheet
bash ops/heavy.sh $PY $A/tools/seam_frames.py v1                        # each chapter's edge frames against its source
```

- **The chapters:** the cold open, the Ep2 intro variant (§8), the card `ep1.1_her.wav` (`out/ep02/v1/picture/card.mp4`), the four acts (`out/ep02/v1/picture/<seg>.mp4`, the per-scene concat), the tag, Ep2's outro (credit `art · script · music · voices · edit: opus 5.5` / `prompt: jgon`). No hum hold between the tag and the outro: the tag cuts on the downbeat to the outro's black (assembly.md §3). Titles: Act One · the séance, Act Two · her, Act Three · leave them up, Act Four · as a guest, Tag · august (the proposal's names; the release pass checks them against LEARNINGS M1).
- **Unchanged from Ep1:** the picture decoded and concatenated frame for frame and encoded once (CRF 18, a keyframe on every chapter); the sound built sample-exact in numpy, each chapter exactly its picture's length (it refuses to pad or trim); **libfdk_aac** at 256 kb/s; the QA's **decoded-vs-source check** per chapter (a burst = more than 0.2 of full scale off the source); the **flash check streamed** (160 × 90 frames, never the whole film in memory: Ep1's first version held 10 GB and was killed), with Ep2's copy of `flashcheck.py`. `v1-kokoro` is a second variant (the base lock's mixes) for a check before the EL takes exist.
- `flash_seg.py <file.mp4>` measures one picture (limit 3 in any second); `scene_cut.py <seg> <scene>|--all` cuts a scene with its sound for review (§4).

### 7.2 `ops/rebuild-act.sh --ep 2`

`ops/rebuild-act.sh` (Ep1's, locked in behaviour) now passes `--ep N` to `ops/rebuild-act-epN.sh`, a per-episode copy (ORGANIZATION-PLAN §2: "copy it per episode"). **Without `--ep` (or with `--ep 1`) it runs exactly as before:** the arguments reach Ep1's code unchanged.

```sh
ops/rebuild-act.sh --ep 2 act3 --dry-run                  # every command, every input checked (exit 1 if any is missing)
ops/rebuild-act.sh --ep 2 act3                            # lock, score, mix, picture (per scene), mux, film
ops/rebuild-act.sh --ep 2 act3 --scene 15,17 --only picture   # just those scenes (forced), the act picture untouched
ops/rebuild-act.sh --ep 2 act3 --scene 15 --from picture  # the scene, then its review cut with sound (scenecut)
ops/rebuild-act.sh --ep 2 card --only picture             # the filename card
EP2_FIXED=22.04 ops/rebuild-act.sh --ep 2 act4 --only lock     # a beat with a reserved length
```

| Step | Ep2 |
|---|---|
| lock | the base lock of this act, its EL lock (`el_lock.py <act>`, `--fixed` from `EP2_FIXED`), its takes with mouths, the pixel lock of this act and every act after it (their episode-in moved), then `scenes.py` (stubs for new scenes) |
| score | `e02-v1-<act>/track.py --render --el`, `OST_WORKERS=2` |
| mix | the stems (one block), the mix of this act and the chapter after it, the pixel lock re-checked with the mix |
| picture | `build.mjs` + `check` (stand-ins fail unless `EP2_ALLOW_STANDINS=1`), the GLYPH frames from a Remotion bundle if the act has any, **`scenes`** (only changed scenes render; the act is their lossless concat), the flash check. With `--scene`: only those scenes, forced, no concat |
| mux | the act picture with its mix (`-c:v copy`, libfdk_aac) into `out/ep02/v1/picture-mux/<act>.mp4` |
| scenecut | with `--scene`: each scene with its sound, `out/ep02/v1/review/scenes/<act>-sc-<scene>.mp4` |
| film | `assemble.py v1`, `qa.py v1`, `seam_frames.py v1` |

**Ep1's trap is gone here:** Ep1's script had to stop at Act One's lock (hand-placed V.O. that `el_lock.py` drops, §AD); Ep2's lock step needs no stop, because every line is in the beat plan and `el_lock.py` refuses to drop one. **[M]** the Ep2 dry run of act1 lists every command; with today's state it reports 2 missing inputs (the EL lock and its manifest, which don't exist yet), as it should.

---

## 8. The intro, the card and the outro

### 8.1 How Ep1's intro is built (the inventory)

- **Picture:** `studio/src/intro/` (`edl.ts` tiles the 720 frames from six moments; `scenes.ts` wraps each moment's PixelScene with the QC pass; `IntroEp1.tsx` mounts them; `intro.frame.tsx` registers `intro-ep1`). The moments live in `studio/src/dev/`: `mcoldopen` (f0–119: the chart, the monitor, the typed line and the dot), `meras` (f120–224: 1993 in 1-bit, 2008–14 in 16 colours, the collars' pops), `mdinner1` (f225–344: the WOODROSE dinner, the CTRL keycap), `mdinner2` (f345–479), `mrollcall` (f480–539: the eight flashes), `mfinale` (f540–719: the skyline, the title and its subtitle, the bookend and the Orb's toast). Rendered with `bash studio/src/dev/intro/tools/master.sh 1080 <tmp>` (entry `studio/src/dev/intro/entry.tsx`) to `out/season/intro/picture/intro-ep1-1080p-silent.mp4`; the picture events for the SFX come from `studio/src/dev/intro/tools/events.ts` (docs/RENDERING.md §3.1). Ep1's film used the flash-fixed picture (frames 222 and 224 hold 221 and 223: the whip smear on 2s).
- **Sound:** the score is `audio/theme` (V1 "Chip Chamber Jazz" and three alternates, its VO duck baked into the stems), the SFX `audio/intro/sfx/build_intro_sfx.py` (cued from the picture events), the voices `audio/intro/vox/` (Mas's line, the chant, the PAD), the mix `audio/intro/mix/scripts/mix_intro.py` (music, sfx and dialogue buses, −14 LUFS). Ep1's EL film swapped only Mas's line for Jeremy's (`audio/ep01/v3-el/tools/el_intro.py`: the reads fitted to the Kokoro word onsets, the intro-vox chain, then `mix_intro.py`'s own build with the VO swapped) into `audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav`, played at −3 dB.
- **Every per-episode value is hard-coded to Ep1** in those moments (no slot parameter exists): the line `L1`/`L2` and the VO events (`mcoldopen/timeline.ts`), the chart's dot and label (`mcoldopen/screen.ts`), the keycap's hand-pixelled `CTRL` legend (`mdinner1/props.ts`), the subtitle `SUB` (`mfinale/title.ts`), the toast (`mfinale/bookend.ts`), Misanthropic's blank price tag (`mfinale/skyline.ts`, marked `[SLOT]`), the roll-call fills (`mrollcall/scene.ts`). SCRIPT §9.1 lists the hill, the CZAR lanyard, the desk tally and the coat hook as still to build: **they are not in the shipped intro.**

### 8.2 What Ep2's variant needs (show/episodes/ep02/intro-slot.md, with the proposal's round-2 and final-check changes)

| # | Item | Ep1 → Ep2 | Where | Picture / sound |
|---|---|---|---|---|
| 1 | Cold-open line | **Revised 2026-10-10 (§8.6): Ep1's "near the singularity; unclear which side.", unchanged; the typed quote stays the same in every episode (showrunner).** The first plan, built and turned down: "near the singularity; unclear which side." → **"her"** (VO about f24–33), then a pulsing typing indicator (three dots) for the rest of the phrase; the D♭ lands in the silence; the `you are here` marker slides on the silence | `mcoldopen/timeline.ts` (the line, the key taps, the VO events), `screen.ts` (the indicator is a new drawing; the dot x 0.50 → 0.55) | picture + the VO (Jeremy) + the key-tap SFX; the score's D♭ already falls inside f34–112 [J: check the V1 cue's D♭ frame] |
| 2 | Misanthropic's price tag | blank → `$4B + $2B` | `mfinale/skyline.ts` | picture; **to confirm against Ep1's final** (proposal D-58) |
| 2 | The hill, the CZAR lanyard `SIRRAH`, the desk tally `III`, three collars on the hook | not in the shipped intro | — | **not added** unless the intro pass builds those layers; the rule is "items 2–5 show only what Ep1 aired", and the intro never showed them |
| 3 | Title subtitle | `now in low-key research preview` → `back by popular demand` | `mfinale/title.ts` | picture (typed at 4 characters a frame: +16 margin) |
| 4 | Couch gag | the keycap `CTRL` → `ESC` (a new hand-pixelled legend) | `mdinner1/props.ts` | picture |
| 5 | Roll call | no change for Ep2 (RIMA NopeAI fill, THE WHALE, RUMPT a silhouette, the cursor alone) | — | — |
| — | The Orb's toast | `verified: human`, unchanged | — | — |

### 8.3 The plan for the Ep2 intro (built 2026-10-10 by the titles pass: §8.5)

**Item 1 is superseded by §8.6** (the line is Ep1's again): the steps below that concern "her", its key taps and the typing indicator describe the first build.

1. **Make the moments take an episode slot, Ep1's by default.** One `EpisodeSlot` object (the five items above, SCRIPT §8's columns) read by `mcoldopen`, `mdinner1` and `mfinale`, with Ep1's values as the default, and a second composition `intro-ep2` beside `intro-ep1` (an `intro-ep2.frame.tsx` or the dev entry). The moments are shared dev code, so the rule for shared code applies: **Ep1's intro must stay byte-identical**. Prove it by rendering `intro-ep1` to scratch and comparing it with `out/season/intro/picture/intro-ep1-1080p-silent.mp4` (`studio/src/episodes/ep02/pixel/tools/mp4cmp.mjs`: the stream md5 and sampled frames), and the events export with the committed `intro-events.json` (md5 `f37ea409…`). Never re-render into `out/season/intro/`. (A fork of the six moments into Ep2 is the fallback if the proof fails: thousands of lines, so a last resort.)
2. **Check every row against what Ep1 aired** (`full-v3/lock-v35-transcript.txt` and the final assembly) before rendering, as proposal D-58 asks: the `$4B + $2B` tag is the one still to confirm.
3. **Render the picture** to `out/ep02/v1/intro/intro-ep2-V1-1080p-raw.mp4` (`master.sh`'s settings, scratch PNGs), then apply the flash fix if the smear is unchanged: `$PY $A/tools/intro_flashfix.py out/ep02/v1/intro/intro-ep2-V1-1080p-raw.mp4 out/ep02/v1/intro/intro-ep2-V1-1080p.mp4` (Ep2's copy takes both paths and refuses to write into `out/season/`), then `flash_seg.py` on it (limit 3).
4. **The sound**, into `audio/intro/ep02/` only (manifest §0: never `audio/intro/mix/`): the picture events re-exported for Ep2 to scratch, the intro SFX rebuilt from them into `audio/intro/ep02/` (the key taps for three letters, the typing indicator's own sound if any), Jeremy's "her" (a copy of `el_intro.py` pointed at `audio/intro/ep02/`: one-syllable reads, lowercase delivery, fitted to f24–33), and the V1 mix with only the dialogue and SFX buses swapped (`mix_intro.py`'s build, imported read-only, as `el_intro.py` did) → `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav` (−14 LUFS, the manifest plays it at −3 dB).
5. The manifest (§1.1) already names both files, so the film picks them up.

### 8.4 The card and the outro

- **The card** is a segment of the Ep2 pixel pipeline, `studio/src/episodes/ep02/pixel/card/` (Ep1's card, re-typed for `ep1.1_her.wav`: 13 characters at 1 a frame, so the name lands on frame 16 as Ep1's did and the cursor keeps Ep1's blink, the cut on an off frame). **[M]** locked, `check` clean (1 layout, 0 stand-ins); stills of frames 10, 20 and 47 looked at: the name typing on, the cursor after it, and frame 47 with the cursor off (the cut lands on an off frame). Render: `ops/rebuild-act.sh --ep 2 card --only picture` → `out/ep02/v1/picture/card.mp4`; its sound is the mix's `card-mix.wav`.
- **The outro** is outro B (`studio/src/dev/outro/b/`, Ep1's, shared dev code), which keys every per-episode value in `timeline.ts` (`EPS`: the file name, the verdict, the score's verdict) and has the credit text in `CREDITS` (`art · script · music · voices · edit: opus 5.5`, `prompt: jgon`). Ep2's needs an `EPS` entry (`ep1.1_her.wav`, `viewer: verified: human`, no moth stinger: "no callback is booked for Ep2") and the E02-14 score (the knee whole in Ep2's colour: the wordless vocal pad takes the flat line and stops before the leap; celesta and chip finish it). The plan: an Ep2 copy under `studio/src/episodes/ep02/outro/` (or an `EPS[2]` entry plus an `outro-b-ep2` composition, with Ep1's `outro-b-ep1` proven unchanged as in §8.3 step 1), rendered to `out/ep02/v1/outro/outro-b-ep2.mp4` and its audio `outro-b-ep2.wav` (−16 LUFS), the names the manifest and `assemble.py` read.

---

### 8.5 Built: the intro variant and the outro (the titles pass, 2026-10-10)

The plan above, as built. Details, re-run commands and the human checks are in the folders' READMEs:
- [studio/src/episodes/ep02/intro/](../../../../../studio/src/episodes/ep02/intro/README.md) (the picture);
- [audio/ep02/intro/](../../../../../audio/ep02/intro/README.md) (the sound);
- [studio/src/episodes/ep02/outro/](../../../../../studio/src/episodes/ep02/outro/README.md) (the outro).

Nothing was watched or heard [R8].

| | Built | Measured [M] / judged [J] |
|---|---|---|
| **Intro picture** | **Revised in §8.6:** the line is Ep1's again, so "her" and the typing indicator are gone. §8.3 step 1 as planned. The moments take an `IntroSlot` (`src/intro/slot.ts`, Ep1's by default; `scenesFor(slot)`, `IntroCut`); Ep2's `EP2_SLOT` and `intro-ep2` live in `studio/src/episodes/ep02/intro/`. Shipped: "her" (typed f18-21), the typing indicator f38-111, the dot at 0.55, `back by popular demand`, the ESC keycap. **Not added:** `$4B + $2B`, because Ep1's final never aired it (§8.2's open check, done: 19.13's NOZAMA meter was cut, S4.08's meters went in C14, neither is in the v3.5 lock or its transcript), so the tag stays blank; nor the hill, lanyard, tally or hook (never in the shipped intro) | [M] `intro-ep1` re-rendered from the slot code: H.264 stream identical to the committed master (md5 `2ae91638…`); all 720 native frames hash the same from HEAD's and the new code; the events export byte-identical (`f37ea409…`). [M] Ep2: 720 f; the flash fix (`intro_flashfix.py`, whose repo root was one level short, fixed) takes the smear's 4 flashes/s to 1. [J] looked at 1080p: the cold open, the keycap, the subtitle, the bookend |
| **Intro sound** | **Revised in §8.6:** the master is now Ep1's aired intro master. The first build: `audio/ep02/intro/intro_ep2.py` (step 4). Jeremy's "her" (read h7: level 131 Hz, Mas's V.O. speed; f23.4-38.3) and the 3 key taps swapped into Ep1's delivered V1 master through its own gain curve. Written to `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav` (the manifest's path; the brief's `audio/ep02/intro/` holds the tool, the takes and the QA) | [M] builder and mix reproduce Ep1's stems and master to −138.5 dBFS; after f120 the master is Ep1's sample for sample; −13.83 LUFS-I, −1.3 dBTP |
| **Outro** | An Ep2 copy of outro B in `studio/src/episodes/ep02/outro/` (Ep1's `dev/outro/b` untouched). Page 1 is Ep1's plain week with `ep1.1_her.wav`, the credits `art · script · music · voices · edit: opus 5.5` / `prompt: jgon` and `viewer: verified: human`. Page 2 (4.1) is a second scan that leaves the voice cast (27 roles by library voice) and the tools. E02-14 is swung, the title's wordless vocal pad singing the flat line and stopping before the leap (`audio/vocal.py`, the intro's singer). **15.0 s** (cut on 6.4, +15 f of black), not 10.125: the cast needs its page. `build_timeline.py` picks the length up from the WAV | [M] every row clear of the Orb, P15 per row; page 1 read in order at 16 cps finishes 0.5 s before the turn; page 2 holds 5.5 s (a credits page, not readable in order); encode max error 7/255, contrast ≥ 5.9:1; 0 flashes; page 1 −15.32 LUFS (Ep1 −15.29), file −16.55, −3.15 dBTP, momentary max −11.0 |
| **Ep1 untouched** | — | [M] 953 files under `out/season/intro/`, `audio/intro/` (except `ep02/`), `audio/theme/` and `out/ep01/outro/` match their pre-pass sha1; `ops/reorg/smoke.sh` against a baseline taken before any change: **PASS** (tsc 20 errors as before, locks 12/12, score 6/6, dry runs 0 missing, film 31/31) |

**For the mix and assembly passes:** `mix_episode.py` makes `outro-mix.wav` from `out/ep02/v1/outro/outro-b-ep2.wav` (now 15.0 s). The transcript's outro row (`lock_report.py`) doesn't yet list the cast page.

### 8.6 Revised: Ep1's line in every intro (the showrunner, 2026-10-10)

> "i did not want the quote near the singularity unclear which side changed per intro"

The typed quote stays "near the singularity; unclear which side." in every episode. Ep2's intro now types, voices and posts Ep1's line exactly as Ep1 did. The first build's "her", its three key taps, Jeremy's read of it and the typing indicator are gone. The other spoiler-safe changes stay: the dot at 0.55, the ESC keycap and `back by popular demand`. The note is also on Ep3–Ep11's `intro-slot.md`, which had planned their own lines (Ep12's was already Ep1's).

| | Changed | Measured [M] / judged [J] |
|---|---|---|
| **Picture** | `studio/src/episodes/ep02/intro/slot.ts`: `EP2_SLOT.cold.line` is `EP1_SLOT.cold.line` (the default, the same object). `tools/events.ts` keeps Ep1's typing events while the line is Ep1's; `intro-ep2-events.json` re-exported (153 events, Ep1's order; 4 differ in text only: the dot's rest, the keycap twice, the subtitle). Re-rendered through `ops/heavy.sh` and flash-fixed | [M] 720 f, 24 fps, 1080p. Flashes: raw 4/s at f221 (the smear), fixed **1/s max, 0 red: pass**. Native frames against Ep1 (all 720): f0–29, f60–71 and f99–104 identical; f30–59, 72–98 and 105–117 differ only in the chart's `you are here` box (the 0.55 rest); then ESC (f232–253) and the subtitle and bookend (f640–718). [J] f20, f60 and f110 looked at full size: Ep1's typing and wide, the full line with the pointer on Post, the label a step right |
| **Sound** | `audio/ep02/intro/intro_ep2.py mix` now writes Ep1's aired intro master (`audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav`, Jeremy's read, as Ep1's EL film) to `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav`, the manifests' path; `mix --line her` rebuilds the retired one | [M] byte-identical to Ep1's aired master (sha1 `c7915e1a…`), so −240 dBFS difference over f0–18, f18–120 and f120–720; −13.99 LUFS-I, −1.3 dBTP. The review mux re-made |
| **Ep1 untouched** | no shared code changed (`studio/src/dev`, `src/intro`, `src/shared` clean against HEAD) | [M] 1,087 files under `out/season/intro/`, `audio/intro/` (except `ep02/`), `audio/theme/`, `out/ep01/outro/`, `studio/src/dev/outro/` and `studio/src/intro/` keep their sha1 through every render. `ops/reorg/smoke.sh` against a baseline taken with this change set aside: **PASS** (tsc 20 errors, the same list; locks 12/12; score 6/6; dry runs 0 missing; film 31/31; lines 0 missing) |

**For the assembly pass:** `out/ep02/v1/ep02-v1.mp4` (e2bce00) was assembled with the first build's intro; re-assemble to pick up this one. The intro's sound before f18 (to 1 LSB) and after f120 is unchanged, so the seams measured in `sound-audit.json` stand.

## 9. Ep1 is untouched

| Check | Result |
|---|---|
| No file under Ep1's locked paths changed | **[M]** `git status`: the only tracked files changed are `ops/rebuild-act.sh` (the `--ep` dispatch), `ops/README.md`, `README.md` (one sentence) and `.gitignore` (`audio/ep02/**/*.wav` ignored, as Ep1's takes are); everything else is new, under Ep2's paths |
| `ops/rebuild-act.sh <act> --dry-run`, the six acts, against the same six runs before the change | **[M]** identical (the timestamps aside); `--ep 1` the same. The one visible difference: a call with no act at all reports bash's usage error from line 40 instead of 28 |
| The studio typecheck (`tsc --noEmit`, through heavy.sh) | **[M]** the same 20 errors as before (all in `src/dev/`); none in the new Ep2 files |
| `ops/reorg/smoke.sh <out> <baseline>` (baseline taken before any change) | **[M]** see §9.1 |
| `sha1sum -c ops/reorg/ep01-final.sha1` (the film and its 30 chapter inputs) | **[M]** see §9.1 |

### 9.1 The final run

Run after every Ep2 file was in place (2026-10-08, about 22:00), `MRMAS_MAX_LOAD=24 bash ops/reorg/smoke.sh <out> <baseline>`, the baseline taken at 20:44 before any change [M]:

| Smoke step | Result |
|---|---|
| 1. tsc | 20 errors, the same list as the baseline (all in `src/dev/`) |
| 2. lock | Ep1's six EL v3.5 pixel locks re-derived: 0 failed checks, **12/12 outputs byte-identical** to the baseline's (the committed tag lock's known 2026-09-29 episode-in difference, f21d274, is the same before and after) |
| 3. score | `v35check.py`: 6/6 segments PASS |
| 4. rebuild | the six `rebuild-act.sh <act> --dry-run`: 0 missing; `assemble.py el-v35`: 30 inputs, 0 missing |
| 5. film | `ops/reorg/ep01-final.sha1`: **31 files checked, 0 differ** (`out/ep01/full-v3/ep01-v35.mp4` and every chapter input) |
| 6. lines | the Act Four dialogue lists: 227 and 541 paths, 0 missing |
| | **SMOKE: PASS** |

`sha1sum -c ops/reorg/ep01-final.sha1` run again on its own afterwards: all 31 match.

---

## 10. Open issues and asks

1. **Nothing has been watched or heard [R8].** The picture proof is measured (which scenes rendered, identical bytes and streams); the sound proof is measured on synthetic data (loudness, peaks, seams).
2. ~~**The real chain waits on the takes.** The base lock needs a take for every line; the voices pass renders them (§2), then §1.2, then the picture and the score.~~ Done: the takes ([takes-qa.md](takes-qa.md)) and the locks, §1.1–§1.2 ([lock-v1.md](lock-v1.md), 2026-10-09: 23:02.00 of story, 0 check failures, 20 scene stubs; after the lock QA, §3.5 there, 22:54.00).
3. ~~**The intro variant and the outro** are planned, not built (§8.3, §8.4).~~ Built, with Ep1's output proven unchanged (§8.5).
4. ~~**New SFX beds** (manifest §7) play through stand-ins until the SFX pass adds them to the board (`rooms.py` picks them up by name).~~ Done by the sound pass (2026-10-10): every manifest §7 bed and every lock sound is on the board (`audio/sfx/scripts/sounds_ep2.py`), the voice chains are the mix's, and the audit is measured: [sound-v1.md](sound-v1.md).
5. ~~**`el_cut.py` and `pron_check.py`** were not copied (Ep1 tables); the voices pass copies them with Ep2's.~~ Done by the takes pass (§2, [takes-qa.md](takes-qa.md)). `el_audition.py` was copied by the casting pass ([cast.md](cast.md) §8).
6. **The review frame** still renders per act; only the picture is per scene.
7. **Machine load:** other projects held the load at 16–18 during this pass, so `heavy.sh` waited (MAX_LOAD 16); the tiny test renders ran with `MRMAS_MAX_LOAD=24`. A full act render should wait for the default.
8. **Resource asks (R16, non-blocking):** none beyond the manifest's §10; a faster picture would come only from more cores (the drawing is CPU-bound and already parallel per scene).

**LEARNINGS rules checked:** R1 (copies only; Ep1 proven untouched, §9), R9 (one lock path; `--fixed`; no silent drops), R10 (every render and audio job through heavy.sh, one at a time; flash check streamed), R11 (keys never read outside `ellib.py`; keyscan before commit and push), R13 (this note and the folder READMEs), R14 (scratch only in this session's scratchpad), S7 (MARIO's EQ kept), S8 (libfdk_aac, decoded-vs-source), P15 (the flash check), P16 (the card, the intro variant's five items, the outro credit). Broken on purpose: none.

---

## 11. Files

**New (Ep2):**
- `studio/src/episodes/ep02/pixel/`: the pipeline (README.md, `frame.ts`, `spec.ts`, `types.ts`, `kit.ts`, `anchors.ts`, `lipsync.ts`, `text.ts`, `standin.ts`, `Host.tsx`, `frames.ts`, `entry.tsx`), `tools/` (`lock.py`, `scenes.py`, `render.ts`, `build.mjs`, `scenetest.sh`, `mp4cmp.mjs`, `flashcheck.py`, `mouths.py`), the six segment scaffolds, `card/`, `example/`
- `audio/reel/ep02-v1/`: `build_timeline.py`, `bed.py`, `measure.py`, `rooms.py`, `stems.py`, `mix_episode.py`, README.md
- `audio/ep02/`: `cast-el.json`, `v1-el/tools/` (`el_render.py`, `el_lock.py`, `ellib.py`, `elaudio.py`), README.md
- `audio/ost/tracks/e02-v1-common/` (`v3lib.py`, `v3clock.py`, `v3music.py`, `v3lay.py`, `cueapi.py`, `check.py`, README.md) and `e02-v1-<seg>/track.py` ×6
- `show/episodes/ep02/production/v1/`: this file, `assembly/tools/` (`el_takes.py`, `el_lock.sh`, `assemble.py`, `qa.py`, `flash_seg.py`, `seam_frames.py`, `intro_flashfix.py`, `scene_cut.py`), `lock/<seg>.json` (the scaffold locks until the first real lock)
- `ops/rebuild-act-ep2.sh`

**Changed (shared):** `ops/rebuild-act.sh` (the `--ep` dispatch only), `ops/README.md` (one paragraph), `README.md` (one sentence), `.gitignore` (one line).

**Generated, git-ignored:** `out/ep02/v1/` (the scene cache, the pictures, the mixes, the films), every WAV under `audio/ep02/`, the stems.
