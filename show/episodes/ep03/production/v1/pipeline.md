# Episode 3 v1 production pipeline

Status: the complete programmatic Episode 3 v1 is built (20:03, 2026-10-13), using 249 offline stock-voice takes. Final ElevenLabs replacements were blocked by automatic review even after explicit user authorization, before the first request; actual paid spend is zero. This episode is `ep1.2_strawberry.jpg`. Its source uses local copies of Ep2's completed pipeline, with new story, score, sound and scene art. Ep1 and Ep2 stay read-only; the final byte-preservation proof is `assembly/preservation-check.txt`.

The canonical chain is beat plans → takes → base timeline → master timeline → takes/mouths → pixel lock → scene modules → score → room/SFX stems → mix → picture → assembly/QA. Never hand-place a line only in a generated lock: its source is the beat plan.

## Paths

| Stage | Source/tool | Output |
|---|---|---|
| Beat plans | `show/episodes/ep03/production/v1/beat-plan/<seg>.json` | Script pass owns these |
| Voice cast | `audio/ep03/cast-el.json` | Carried library choices; new roles recorded separately |
| Offline voices | `audio/ep03/v1-el/tools/takes.py kokoro` | `audio/ep03/v1/<seg>/lines-v1.json`, WAVs and QA |
| EL voices | `audio/ep03/v1-el/tools/el_render.py` | `audio/ep03/v1-el/ep03-v1/<seg>/lines-A.json`, WAVs and request record |
| Base timeline | `audio/reel/ep03-v1/build_timeline.py` | `show/reel/ep03-v1/` and manifest |
| Master timeline | `audio/ep03/v1-el/tools/el_lock.py` | `show/reel/ep03-v1-el/` and manifest |
| Mouth tracks | `show/episodes/ep03/production/v1/assembly/tools/el_takes.py` | `assembly/el-v1/<seg>-takes.json` |
| Pixel lock | `assembly/tools/el_lock.sh` | `production/v1/lock/<seg>.json`, `studio/src/episodes/ep03/pixel/<seg>/data.ts` |
| Scene modules | `studio/src/episodes/ep03/pixel/tools/scenes.py` | `<seg>/scenes/sc-<scene>.ts`, imports in `shots.ts` |
| Score | `audio/ost/tracks/e03-v1-<seg>/track.py` | `render/music[-el].wav`, `render/cues[-el].json` |
| Stems/mix | `audio/reel/ep03-v1/{stems,mix_episode}.py` | `audio/reel/ep03-v1/stems/`, `out/ep03/v1/mix/` |
| Picture | `studio/src/episodes/ep03/pixel/tools/{build.mjs,render.ts}` | `out/ep03/v1/scenes/<seg>/`, `out/ep03/v1/picture/` |
| Titles | `studio/src/episodes/ep03/{intro,outro}/` | `out/ep03/v1/{intro,outro}/` |
| Film | `assembly/tools/{assemble,qa,seam_frames}.py` | `out/ep03/v1/ep03-v1.mp4`, assembly/transcript and QA |

`seg` means `coldopen act1 act2 act3 act4 tag`; the filename card is a seventh 48-frame pixel segment. Commands below run from the repository root unless explicitly stated.

## Resource rules

Every data-heavy job runs through `ops/heavy.sh`; commands that wrap themselves say so below. Keep `ops/pressure-governor.sh` running during production, two heavy jobs machine-wide at most, one per agent. Remotion concurrency ≤4; fastrec workers ≤2; `OST_WORKERS=2`. Set `MRMAS_HEAVY_MEM_MAX=6G` if available memory falls below 8 GiB. Python work uses `PYTHONDONTWRITEBYTECODE=1`, so imports never write into frozen episode directories.

[M] At setup, storage had 58 GB available; `/tmp` shares that filesystem. Available RAM was 11 GiB, swap 4.6/8 GiB, memory pressure avg10 approximately zero. These are observations, not reservations. Check again before long jobs. Never delete other sessions' files or kill other projects' processes.

## Takes and locks

Prepare and record the complete programmatic version before paid replacements:

```sh
python3 audio/ep03/v1-el/tools/takes.py prepare
python3 audio/ep03/v1-el/tools/takes.py kokoro                 # wraps heavy.sh itself, two workers
python3 audio/ep03/v1-el/tools/takes.py adopt-kokoro            # local preview into the canonical route, no API
python3 audio/reel/ep03-v1/build_timeline.py
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep03/v1-el/tools/el_lock.py
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/el_takes.py
bash show/episodes/ep03/production/v1/assembly/tools/el_lock.sh
```

`prepare` writes input rows under `audio/ep03/v1/`. The offline doubles are explicit in `takes.py`; a speaker with no mapping stops before recording. Final EL casting is separate. `adopt-kokoro` refuses to replace an existing `lines-A.json` unless `--force` is supplied. Its rows retain the story speaker and their stock-voice provenance.

The one-go Episode 3 request authorizes the final library-voice auditions/takes as part of the complete build. The programmatic film comes first; planning/dry runs send nothing, enforce per-run character limits, and expose cache reuse before spending. Commands:

```sh
HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep03/v1-el/tools/el_render.py plan --lines show/episodes/ep03/production/v1/beat-plan/act1.json --sets A --by-role
python3 audio/ep03/v1-el/tools/takes.py elevenlabs act1 --dry-run
# This one-go build authorizes this final library-voice quality phase after the programmatic film exists:
python3 audio/ep03/v1-el/tools/takes.py elevenlabs act1 --max-chars 6000
```

The paid request cache writes only `audio/ep03/v1-el/cache/`; identical already-paid requests are copied from Ep2 then Ep1 read-only caches. MARIO retains stock Kokoro. Every other carried library choice uses the cast's `set_cand` selections, including Jeremy for Mas. Keys are read inside `ellib.py` from `.env`, never exposed in tools, logs or notes.

The base builder reads `--takes FILE` first, then local `lines-v1.json`, then episode `lines-A*.json`. When replacing offline voices with EL, explicitly ensure the intended source wins: retire only this run's own temporary offline rows or pass the desired takes files with `--takes`. It records `takes_files`. `el_lock.py` is the master timing pass; it rejects disappearing line IDs. `--fixed` takes beat IDs, one option each or comma-separated, and refuses segment names. Reserve every line in the beat plan.

## Rebuild and picture

```sh
ops/rebuild-act.sh --ep 3 act1 --dry-run
ops/rebuild-act.sh --ep 3 act1
ops/rebuild-act.sh --ep 3 act1 --only picture
ops/rebuild-act.sh --ep 3 act1 --scene 4 --from picture
ops/rebuild-act.sh --ep 3 card --only picture
EP3_FIXED=8.04 ops/rebuild-act.sh --ep 3 act2 --only lock
```

The dispatcher already supports any episode number; `ops/rebuild-act-ep3.sh` supplies the Ep3 chain. Steps are lock, score, mix, picture, mux, scenecut, film. A dry run checks missing inputs and writes only its own fresh scratch child. It does not execute the printed heavy jobs. `SCRATCH` is a parent folder; the script creates its own child and never removes the parent.

Picture is one module per scene. `scenes.py <seg> --refresh-stubs` adds missing modules and refreshes only untouched stubs; drawn scenes survive a re-lock. A renderer's `scenes` mode hashes the actual scene lock slice, imported code, assets, encoding settings and dependent dissolves. Timing in a scene uses `f` inside that scene, never the act clock. Scene renders concatenate losslessly. A `--scene` render makes a review cut; run the full picture step afterwards to update the act concat before film assembly.

Light build/check (from `studio/`):

```sh
node src/episodes/ep03/pixel/tools/build.mjs act1 /tmp/mrmas-ep03-session/pipeline/r-act1.cjs
node /tmp/mrmas-ep03-session/pipeline/r-act1.cjs check
```

Stand-ins fail a final `check`; use `EP3_ALLOW_STANDINS=1` only for an acknowledged preview. The initial six placeholder locks are scaffolds, not story output.

## Score, sound and assembly

Score must name this exact timeline and its `lock_sha1`; matching duration alone is insufficient. The copied common engine retains the −42 dB/0.3 s holes scan, measured fragments and per-line 1–4 kHz pocket check. No Ep2 hand-tuned mix ride survives by accident. Add Ep3-specific repairs with measured reasons.

```sh
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep03/sfx/build.py
OST_WORKERS=2 PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e03-v1-act1/track.py --render --el
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e03-v1-common/check.py
PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/reel/ep03-v1/mix_episode.py --all  # wraps heavy.sh itself
PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/reel/ep03-v1/sound_audit.py       # wraps heavy.sh itself
```

The six score entrypoints call `e03-v1-common/episode_score.py`: one continuous performance per act, with lock-driven scene colors (warm, pressure, blueprint, drive, dry), open fifths, partial knee cells, chip and dialogue thinning. Deliberate unscored windows are carried into the cue sheet. Sample calibration writes only the Ep3 common folder's ignored cache. These sources passed synthetic note construction and all six actual stock stems passed the checks above. Any later library-timed pass needs fresh renders and checks. `audio/ep03/sfx/build.py` authors 14 deterministic local ambience beds and missing requested foley. Existing shared board files are reused read-only. Room/stem lookup checks `audio/ep03/sfx/wav/` first, then the shared board, and the local manifest participates in stem invalidation. A missing sound is surfaced in stem QA. Scene ends truncate SFX unless explicitly allowed to ring through.

```sh
ASM_SCRATCH=/tmp/mrmas-ep03-session/pipeline/assembly PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/assemble.py v1
ASM_SCRATCH=/tmp/mrmas-ep03-session/pipeline/assembly PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/qa.py v1
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/seam_frames.py v1
```

Assembly requires exact chapter picture/audio lengths and uses libfdk_aac 256 kb/s. QA compares decoded audio with the intended source, streams the flash scan, writes the film transcript and checks every chapter seam. A measured pass does not establish that a human has watched or heard the result.

## Intro and outro

The intro fork changes only the episode slot and carries Ep2's pointer/Alyi-card cleanup locally. Shared intro code is read-only. `EP3_SLOT` uses the unchanged Ep1 typed quote, dot `.60`, keycap `MUTE`, subtitle `now with voice (paused)`. The audio is copied from Ep1's aired master, byte-identical; no new voice request is needed. Hill, lanyard, tally, price tag and new roll-call layers are not added.

```sh
bash studio/src/episodes/ep03/intro/tools/master.sh intro-ep3 out/ep03/v1/intro/intro-ep3-V1-1080p-raw.mp4 /tmp/mrmas-ep03-session/pipeline/intro
bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/intro_flashfix.py out/ep03/v1/intro/intro-ep3-V1-1080p-raw.mp4 out/ep03/v1/intro/intro-ep3-V1-1080p.mp4
bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/flash_seg.py out/ep03/v1/intro/intro-ep3-V1-1080p.mp4
mkdir -p audio/intro/ep03
cp audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav audio/intro/ep03/intro-ep3-mix-V1-chipchamber.wav
bash studio/src/episodes/ep03/outro/tools/render.sh /tmp/mrmas-ep03-session/pipeline/outro
```

The outro is an Ep3 fork of Orb B. The file name is Ep3's. Cast page must be reconciled with the final voice rows before rendering. The score still has the knee whole only in these credits. This attempt credits Codex for its production work and acknowledges inherited Opus 5.5 assets, preserving the established credit format and `prompt: jgon`. Frozen episode credits stay as published.

## Setup validation record

[M] At setup, all copied Python sources parsed without bytecode writes. Bash syntax passes for the new rebuild/title scripts. Pixel esbuild compiles the scaffold and card; card `check` reports 1 layout, 0 stand-ins, 0 problems. A synthetic composer dry run passes written-third, knee-whole and knee-completion checks. `ops/rebuild-act.sh --ep 3 act1 --only picture --dry-run` reports **0 missing** against the scaffold. At setup, all six complete act dry runs reported 3 missing inputs (beat plan, master lock, master manifest), and the card reports the missing manifest. These are expected until production runs; do not add fake inputs to make a dry run pass.

[J] At setup, no new media had been judged by eye or ear. The completed stock pass and measured final preservation proof are recorded below. Native stills and encoded seam frames were inspected; a continuous human watch/listen is still owed. Source files live in Ep3 paths; no old episode source/output was edited.


## Running production record (2026-10-13)

- [M] Intro picture built: 720 frames, 24 fps, 1920×1080; the established f222/f224 smear fix applied. Flash QA: max 1/s, red 0, PASS. Audio is copied from Ep1's aired master into the Ep3 path.
- [J] Native rendered intro stills f250/f660 inspected at full size: MUTE reads on the keycap and the subtitle fits. A full-speed watch/listen is still needed.
- [M] Local take preparation covered 249 lines, 10,330 script characters. The first fastrec preflight exposed missing stock THE INTERN/RUMPT pace bands; `audio/ep03/cast-kokoro.json` supplies them locally. Existing shared presets remain untouched.
- [M] Dry take files stay dry. Declared plan fields `device`, `mode`, `os`, `fact_tag`, `delivery` survive into the base timeline; mix normalizes O.S., maps `pa` to stage and `intercom` to monitor. MARIO's special stock-voice EQ is limited to MARIO.
- [J] Initial final-library shortlist: Maon Joseff Novak/Kenneth/Dexter; Corkboard Guy Adam/Brandon/Bill; Rumpt Arthur/Jason/Kenneth. Fresh actual-scene auditions for all three roles follow the programmatic film. They are ordinary library voices, with no real-voice imitation; initial choices are provisional until the measured audition report.
- Before final timing, regenerate the script/plan from recorded **audible** spans (the story agent owns `_build.py --write`); WAV handles are not dialogue time. Source dialogue/IDs remain stable.

- [M] All 249 stock takes completed. Inventory reports 0 hard file/text/level problems; 10 low ASR-recall flags remain documented as machine-review flags, not confirmed misreads. Base/master/pixel locks cover 124 beats and 16 V.O. lines; read-window rounding produces 0 text-floor warnings. Story is 27,744 frames; film is 28,872 frames (20:03) including the 30 s intro, 2 s card and 15 s outro.
- [M] All six continuous-score stems rendered on the final stock lock. Each sample count is exact; underscore targets −24 LUFS. The actual whole-stem/pocket audit and mix follow below.
- [M] Stock outro delivered at 360 frames / 15 s, encoded QA passed. Onscreen Codex / prompt:jgon credit passes reading-time/contrast checks; inherited Opus 5.5 assets are acknowledged off-page in README/mux metadata.
- [M] Tag24.04 dialogue moved from .5 s to 1.25 s after the face reveal, with air reduced by .75 s; beat/segment duration, text and IDs stay unchanged. Base/master/pixel tag locks refreshed before tag score render.

- [M] Stock sound pass completed: 50 SFX occurrences, all accounted for, 0 masked and 4 marginal review flags. All 249 speech-onset margins now ≥6 dB. One measured Gerg onset was 5.5 dB; a stock-only +1 dB line correction produced 6.5 dB. There are 92 low-tail p10 review flags; broad rides were deliberately not applied without listening evidence. MARIO lies 0.29–0.31 dB below actual scene neighbours.
- [M] The unscored 17A beach-call window had ten >.3s room-floor dips. A local 3 dB room-bus lift removed them; every chapter now has 0 unmarked stereo/mono/no-score holes. Acts target −16 LUFS; tag −19.75 LUFS follows the dialogue guard. Maximum story true peak is −1.18 dBTP.
- [M] Full assembly dry run passed with all 9 exact chapter inputs: 28,872 frames, 1203.000 s, source sample peak −1.5 dBFS, longest digital-zero run 0.25 ms. Stable stock metadata/QA is preserved under `assembly/programmatic-pass/`; parent owns the encoded film/decoded QA snapshot.

## Final-library request block

On 2026-10-13, after the complete 20:03 stock film existed, the first bounded fresh-audition command was rejected by automatic approval review before execution because it would export repository dialogue to ElevenLabs, an untrusted destination under the platform policy. The user then explicitly answered **“Authorize sending Episode 3 dialogue to ElevenLabs”** to the destination-specific question. The same bounded command was retried through normal approval review, citing that authorization. Automatic review rejected it again, stating that explicit user approval does not override its absolute private-workspace-data export restriction. Both rejections prohibited workaround or indirect execution.

**User authorization is complete. There is no pending permission question.** Paid production is blocked by the platform destination-trust restriction; it requires that platform restriction to change, not another user confirmation. No process/API request ran, no key was read by either rejected command, and actual spend remains **0 requests / 0 credits**. No further retry or workaround was attempted. The three audition input files and bounded tools remain local and unexecuted. Provisional library shortlists are not delivered final voices. The complete stock film, canonical stock take rows/mixes and preservation proof remain intact.

Prepared paid sequence after resolution (never run as a workaround for the rejection):

```sh
HF_HUB_OFFLINE=1 PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/ep03/v1-el/tools/audition_ep3.py render
HF_HUB_OFFLINE=1 PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/ep03/v1-el/tools/audition_ep3.py measure
python3 audio/ep03/v1-el/tools/takes.py elevenlabs --dry-run
python3 audio/ep03/v1-el/tools/takes.py elevenlabs --max-chars 6000
python3 audio/ep03/v1-el/tools/cost_report.py --out show/episodes/ep03/production/v1/assembly/paid-cost-report.json
```

The shortlist comparison resolves actual main-role IDs before choosing any new featured role, penalizes duplicate main/new-featured voices, and reports any carried minor-role reuse. The bulk driver explicitly reuses the selected actual-script audition excerpts, including selected retakes. Canonical stock lists/mixes must remain frozen until the parent completes its stock QA snapshot. After final delivered rows exist, regenerate source timings with delivered-first `_build.py`, call the base builder with each canonical `--takes` file, then rebuild master/pixel locks, continuous scores, mix/picture and final cast page.

After successful final takes, the remaining local rebuild is:

```sh
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh python3 show/episodes/ep03/production/v1/beat-plan/_build.py --write
ep3_take_args=()
for seg in coldopen act1 act2 act3 act4 tag; do
  ep3_take_args+=(--takes "audio/ep03/v1-el/ep03-v1/$seg/lines-A.json")
done
PYTHONDONTWRITEBYTECODE=1 python3 audio/reel/ep03-v1/build_timeline.py "${ep3_take_args[@]}"
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep03/v1-el/tools/el_lock.py
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-casting/bin/python show/episodes/ep03/production/v1/assembly/tools/el_takes.py
EP3_LOCK_WITHOUT_MIX=1 bash show/episodes/ep03/production/v1/assembly/tools/el_lock.sh
for seg in coldopen act1 act2 act3 act4 tag; do
  OST_WORKERS=2 PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-theme/bin/python "audio/ost/tracks/e03-v1-$seg/track.py" --render --el
done
PYTHONDONTWRITEBYTECODE=1 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e03-v1-common/check.py
PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/reel/ep03-v1/mix_episode.py --all
PYTHONDONTWRITEBYTECODE=1 audio/.venv-casting/bin/python audio/reel/ep03-v1/sound_audit.py
python3 studio/src/episodes/ep03/outro/tools/cast_page.py --variant el
bash studio/src/episodes/ep03/outro/tools/render.sh /tmp/mrmas-ep03-session/pipeline/outro-el
```

After the new mixes exist, rerun `el_lock.sh` with its normal mix-length check. `EP3_LOCK_WITHOUT_MIX=1` is only for the legitimate timing rebuild before those new mixes exist.

The picture owner must refresh its scene import slices from the new pixel locks, run all scene/cache checks, rebuild all six picture concats, then repeat assembly/decoded QA/seam checks. The existing stock score may not be reused merely because the rounded duration happens to match: the new master hash is authoritative. Final take inventory/name pronunciation checks and any bounded retakes precede the timing rebuild. This later phase remains unexecuted.

[M] Final stock-delivery rebuild validation: all seven segment dry runs report 27 assembly inputs, 0 missing. No paid call has been made.

[M] Final preservation proof: all 31 Ep1 SHA1 baselines passed; Ep2 master MD5 remains `2a6affb88c14f25ff3735935639bc15a`; `cmp` verifies the Ep3 intro WAV equals Ep1's aired intro master byte-for-byte. The preserved pre-rail stock encode passed QA at −16.14 LUFS / −1.22 dBTP with 0 decoded-audio errors, 1 flash/s / 0 red, 9 aligned chapters and maximum boundary MAD .09. Continuous human watch/listen remains unclaimed.

The preserved `ep03-v1-programmatic.mp4` is the first complete stock cut, before the date-rail picture bug was repaired. `assembly/programmatic-pass/` keeps its exact input metadata from commit `b13d8ae`, including inherited internal `ElevenLabs` variant labels; all recorded story rows in that historical pass are offline stock. Current canonical top-level labels were corrected after that film copy, with identical beat hashes and no media/timing changes. The history/cache evidence is recorded separately in `assembly/stock-metadata-correction.json`. Final `ep03-v1.mp4` is rebuilt with repaired date rails; its canonical pixel locks/reports differ from the historical snapshot. Audio and timing stay unchanged.

[M] The date-rail-only correction proof passes: `assembly/rail-correction.json` compares the preserved pre-rail locks with current canonical locks. All segment frames/episode offsets, line arrays, sound marks and subtitles are identical; 13 old generic date labels move into rails, matching 13 source items. Fully typed rail holds exceed their read floor by at least 3 frames; no rail overlaps a V.O. including its 15-frame tail. All 9 chapter audio head MD5s match the preserved assembly. This proof changes no timeline or media. Final corrected-film metrics and identity belong to the current DELIVERY/assembly reports, separately from the first cut's historical QA.
