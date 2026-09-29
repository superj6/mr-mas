# MR. MAS: rendering guide

How to re-create every file that git does not store. Videos, `node_modules/`, the Python environments, the third-party sample libraries and the caches are all gitignored ([.gitignore](../.gitignore)). Everything else is committed: code, docs, stills, contact sheets, QA JSON, and every audio master, stem and MIDI file. A fresh clone can therefore rebuild any video from committed inputs, and it only needs the sample libraries and the voice models to rebuild the audio itself.

- **Audited:** 2026-09-25, on the machine that made everything. Linux x86-64 (glibc), 14 cores, CPU only, Node 18.19.1 / npm 9.2.0, Python 3.12.3, Remotion 4.0.529, bundled ffmpeg n7.1.
- **Render policy:** 1080p (1920×1080) is the maximum. Don't render 4K and don't use `--scale` above 1. Previews use `--scale=0.5`.
- **What "verified" means here:** every script path below exists. Every composition id comes from running `npx remotion compositions` on its entry (§5 lists all of them). The cheap steps were actually run (§5). The long renders were not re-run for this audit, because the CPU was busy with other renders; their commands come from the scripts and the builders' notes and were checked against the code. CPU times are measured unless marked *est.*
- Pipeline background: [PIPELINE.md](PIPELINE.md). Overview: [README](../README.md). Published intro: https://www.youtube.com/watch?v=IHCn0QC1Zow

**Contents:** [Quick start](#quick-start-re-render-the-intro-in-one-go) · [1. Setup](#1-setup) · [2. Sample libraries](#2-sample-libraries) · [3. Recipes](#3-recipes) · [4. Known issues](#4-known-issues-and-gotchas) · [5. Verification log](#5-verification-log)

---

> **2026-09-26:** the legacy 4K intro files (`out/season/intro/intro-ep1-V1-4k.mp4` and `out/season/intro/picture/intro-ep1-4k-silent.mp4`) were deleted under the 1080p-max policy. The 4K steps below only run if those files exist, and `master.sh 4k` can re-render them if ever needed.

## Quick start: re-render the intro in one go

This goes from a fresh clone to `out/season/intro/intro-ep1-V1-1080p.mp4` … `-V4-1080p.mp4`, the four 30.000 s intros (picture plus final mix). The mixes are committed as `audio/intro-mix/intro-ep1-mix-V*.m4a`, so only the picture has to be rendered. It takes about 3 minutes plus the downloads, which end up as about 370 MB of `node_modules` and 220 MB of Chrome Headless Shell.

```bash
# 0. Clone anywhere and work from the repo root (the scripts find it through the .mrmas-root marker, §1.1).
cd <your clone>

# 1. Picture toolchain (Remotion + its own Chrome and ffmpeg)
(cd studio && npm ci && npx remotion browser ensure)

# 2. The silent 1080p picture master: 720 lossless PNGs -> x264 crf 12 -> self-check (720 frames, 24/1, yuv420p)
bash studio/src/dev/intro/tools/master.sh 1080 "$(mktemp -d)"
#    -> out/season/intro/picture/intro-ep1-1080p-silent.mp4   (about 1.5 min on 14 idle cores)

# 3. Mux the committed mixes onto it (stream copy, no re-encode; the same call as encode_mux.sh, 1080p only)
FFD=studio/node_modules/@remotion/compositor-linux-x64-gnu
for VN in V1:chipchamber V2:orchestralnoir V3:pixelswing V4:pianopixels; do
  V=${VN%%:*} N=${VN#*:}
  LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y \
    -i out/season/intro/picture/intro-ep1-1080p-silent.mp4 -i audio/intro-mix/intro-ep1-mix-$V-$N.m4a \
    -map 0:v:0 -map 1:a:0 -c copy \
    -metadata title="MR. MAS Ep1 intro ($V $N)" -metadata:s:a:0 language=eng \
    -movflags +faststart out/season/intro/intro-ep1-$V-1080p.mp4
done

# 4. Check: h264 1920x1080 720 frames + aac 48 kHz stereo, 30.000 s
LD_LIBRARY_PATH=$FFD $FFD/ffprobe -v error -show_entries stream=codec_name,width,height,nb_frames,sample_rate:format=duration \
  -of compact out/season/intro/intro-ep1-V1-1080p.mp4
```

- **V1 "Chip Chamber Jazz" is the primary mix.** V2–V4 are the alternates ([audio/intro-mix/README.md](../audio/intro-mix/README.md)).
- **`audio/intro-mix/scripts/run_all.sh`** now works on a 1080p-only machine. The 4K mux and its QA run only if a legacy 4K master exists. Step 3 above is the fast path when only the picture changed.
- **Rebuilding the sound too:** to re-create the score, SFX, voices and mix from source rather than use the committed masters, follow [§3.1](#31-the-final-intro) steps 4–8 in order, then step 3 above.
- **Is it the same intro?** For this commit, yes. `intro-events.json` re-exported from the current code is byte-identical to the committed one (md5 `f37ea409…`, the file the SFX and mix were built against), and no source the intro imports has changed since the masters were rendered.

---

## 1. Setup

### 1.1 Paths: clone anywhere

Since the 2026-09-29 reorg (phase 1, `docs/ORGANIZATION-PLAN.md` §4), no script hard-codes the repo's location. Each one finds the project root at run time: it walks up from its own folder, then from the working directory, to the empty marker file `.mrmas-root` at the repo root. Set `MRMAS_ROOT=<dir>` to override it, for example for a script copied or bundled outside the repo. The Blender path defaults to `~/Downloads/blender-4.5.3-linux-x64/blender`; set `BLENDER` to override it.

Two scripts also default their scratch folder to a session path under `/tmp/claude-1000/…`, and both create it if it's missing. `master.sh` takes a scratch folder as its second argument. `audio/intro-mix/scripts/verify.py` reads `MIX_TMP`.

Unless a `cd` is shown, commands below run from the repo root. Remotion commands run from `studio/`, so their output paths start with `../out/`.

### 1.2 Node and Remotion (all picture work)

```bash
node --version            # >= 18 (audited on 18.19.1)
cd studio
npm ci                    # package-lock.json is committed (lockfile v3); use npm install only if you change package.json
npx remotion browser ensure    # downloads Chrome Headless Shell into node_modules/.remotion/
npx remotion compositions src/dev/intro/entry.tsx     # smoke test: should list intro-ep1 (720 frames) and intro-raw-*
```

- **Remotion** is `@remotion/cli` 4.0.529 with React 19 and TypeScript 5.6 ([studio/package.json](../studio/package.json)). `npm run studio` opens the interactive studio on `src/index.ts`, which registers every composition. Each builder also has a small dev entry (`src/dev/<key>/entry.tsx`, `src/episodes/ep01/act4/<part>/entry.tsx`) that registers only its own compositions. Render from that entry: it bundles faster, and one broken file elsewhere can't break it.
- **Config** ([studio/remotion.config.ts](../studio/remotion.config.ts)): PNG frames, overwrite on, concurrency 4. The builders pass `--bundle-cache=false` every time, because parallel builders were sharing the cache.
- **Chrome system libraries.** If Chrome fails to launch on a minimal Linux, install the usual headless-Chrome libraries. On Debian/Ubuntu: `sudo apt install libnss3 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgbm1 libasound2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libpango-1.0-0 libcairo2` (`libasound2t64` on Ubuntu 24.04).
- **Linux x64 glibc only as written.** npm installs the platform's compositor package, and every script points at `@remotion/compositor-linux-x64-gnu`. On macOS or arm64 the ffmpeg path in the scripts would need changing.

### 1.3 The bundled ffmpeg (all encoding, muxing and MP3/AAC export)

The machine has **no system ffmpeg**. Every shell and Python script uses the ffmpeg that Remotion ships:

```
studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg     (and ffprobe)
```

- It is a shared build: `libavcodec.so` and the other libraries sit in the same folder. They load only if that folder is on `LD_LIBRARY_PATH`, so every script calls it as `LD_LIBRARY_PATH=$FFD $FFD/ffmpeg …`. From `studio/`, `npx remotion ffmpeg …` does the same thing for you.
- **Present:** `libx264`, `libx265`, `libvpx-vp9`, `libfdk_aac` and `aac`, `libmp3lame`, `libopus`, `pcm_s24le`; the `lavfi` input with `anullsrc` and `sine`; and the filters `scale`, `volume`, `loudnorm`, `amix`, `concat`, `atrim` and `pan`.
- **Missing:** most filters, including `afade`, `tile` and `select`. So `render_all.sh` fades with a `volume` expression, and the contact sheets are tiled with PIL.
- The npm package brings this ffmpeg, so `npm ci` (§1.2) is also a prerequisite for the audio scripts that write MP3 or M4A.

The recipes use these helpers:

```bash
FFD=$PWD/studio/node_modules/@remotion/compositor-linux-x64-gnu   # from the repo root
ff() { LD_LIBRARY_PATH="$FFD" "$FFD/ffmpeg" -hide_banner "$@"; }
fp() { LD_LIBRARY_PATH="$FFD" "$FFD/ffprobe" -hide_banner "$@"; }
```

### 1.4 Python environments (all audio)

Python 3.12 is required: the pins include numpy 2.5 and torch 2.14. Each audio stage has its own venv under `audio/`, frozen with `pip freeze` into `audio/requirements/<name>.txt`. Create only the ones you need:

```bash
cd <your clone>
for n in venv venv-theme venv-mix; do
  python3 -m venv audio/.$n
  audio/.$n/bin/pip install -r audio/requirements/$n.txt
done
# the two voice venvs pin torch==2.14.0+cpu, which lives on PyTorch's CPU index:
for n in venv-vocals venv-casting; do
  python3 -m venv audio/.$n
  audio/.$n/bin/pip install -r audio/requirements/$n.txt --extra-index-url https://download.pytorch.org/whl/cpu
done
```

| venv | Requirements | Key packages | Used by |
|---|---|---|---|
| `audio/.venv` | `venv.txt` | numpy, scipy, soundfile, pedalboard, tinysoundfont, pretty_midi | `intro-sfx/build_intro_sfx.py`, `intro-sfx/make_previews.py`, `sfx/scripts/build.py` + `layout.py`, `reel/build_all.py` + `reelbed.py`, `animatic/build_temp_track.py` |
| `audio/.venv-theme` | `venv-theme.txt` | the above + matplotlib, pyloudnorm, py7zr | `theme/build.py`, `analyze.py`, `stemtable.py`, `make_cues.py`, `proll.py`, `artifacts.py`; its py7zr also unpacks one sample archive (§2) |
| `audio/.venv-mix` | `venv-mix.txt` | numpy, scipy, soundfile, pyloudnorm, matplotlib, pedalboard, tinysoundfont | `intro-mix/scripts/*` (`run_all.sh` calls it), `mix/scripts/*` (the superseded sketch mix) |
| `audio/.venv-vocals` | `venv-vocals.txt` | kokoro 0.9.4, torch 2.14.0+cpu, misaki, spacy + `en_core_web_sm`, pyworld, librosa, pyloudnorm, pedalboard | `vocals/scripts/*`, `intro-vox/scripts/*` |
| `audio/.venv-casting` | `venv-casting.txt` | kokoro, torch 2.14.0+cpu, faster-whisper 1.2.1, jiwer, librosa, pyloudnorm, pedalboard | `voices/tools/cast.py` + `vcast.py`, `ep01/act4/dialogue/tools/*`, `studio/src/episodes/ep01/act4/animatic/tools/scratch_vo.py` |
| `audio/.venv-sfx` | `venv-sfx.txt` (empty) | — | nothing; the SFX scripts run on `audio/.venv`. Don't bother creating it. |

- **Voice models** download on first use into `~/.cache/huggingface`. To fetch them ahead of time, for instance before running the Act Four tools, which set `HF_HUB_OFFLINE=1`:
  ```bash
  audio/.venv-vocals/bin/hf download hexgrad/Kokoro-82M                 # ~330 MB, Apache-2.0; audited at revision f3ff3571791e39611d31c381e3a41a3af07b4987
  audio/.venv-casting/bin/hf download Systran/faster-whisper-small.en   # ASR used only for QA scoring; audited at d1d751a5f8271d482d14ca55d9e2deeebbae577f
  cat ~/.cache/huggingface/hub/models--hexgrad--Kokoro-82M/refs/main   # if this differs from the audited revision, voices may render differently
  ```
- **System `python3`**, outside any venv, is also used by a few tools:
  - With Pillow (`sudo apt install python3-pil`, plus `fonts-dejavu-core` for the labels): the intro still tools `studio/src/dev/intro/tools/contact_sheet.py` and `handoffs.py`, and the reel contact sheets (`stills.mjs --sheet`).
  - Standard library only: the pixel moments' `tools/scratch_audio.py` and the Act Four `lock.py`.
- **`fetch_samples.sh`** needs bash 4+, `python3` for URL quoting, `curl` 7.66+ (for `--parallel`), `sha256sum`, `tar` and `xz`, plus `7z`/`7za`/`7zr` or py7zr for the one `.7z` archive. py7zr is in `audio/.venv-theme`, so create that venv before running the fetch.

### 1.5 One-minute sanity check

```bash
(cd studio && npx remotion compositions src/dev/intro/entry.tsx | grep intro-ep1)
LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -encoders | grep -E 'libx264|libfdk_aac|libmp3lame'
audio/.venv/bin/python audio/sfx/scripts/build.py --help           # imports the whole SFX engine
audio/.venv/bin/python audio/reel/build_all.py --help
bash audio/samples/fetch_samples.sh --check                         # after §2
```

---

## 2. Sample libraries

The theme score, the SFX board and the reel beds play real instrument samples. All of them are free (CC0, CC BY 3.0 or permissive; credits in [audio/samples/LICENSES.md](../audio/samples/LICENSES.md)) but too big for git. [`audio/samples/fetch_samples.sh`](../audio/samples/fetch_samples.sh) rebuilds the folder exactly as the scripts expect it and checks every file against [`audio/samples/MANIFEST.sha256`](../audio/samples/MANIFEST.sha256), which holds the 1,740 sha256 sums of the files the committed audio was made from.

```bash
bash audio/samples/fetch_samples.sh                # everything: ~2.3 GB download, ~3.1 GB on disk
bash audio/samples/fetch_samples.sh theme-pack     # only the score / reel-bed libraries
bash audio/samples/fetch_samples.sh vsco2ce-sfx generaluser-gs   # only the SFX board's
bash audio/samples/fetch_samples.sh --dry-run      # list the URLs, download nothing
bash audio/samples/fetch_samples.sh --check        # verify an existing folder (no network; ~12 s)
```

The script is safe to re-run: files already on disk with the right hash are skipped. It downloads 8 files at a time (`--jobs N`) and exits non-zero if any file is missing or has the wrong checksum.

| Folder (under `audio/samples/`) | Files | Size | Source (pinned) | Read by |
|---|---|---|---|---|
| `generaluser-gs/` (`GeneralUser-GS.sf2`, `LICENSE.txt`) | 2 | 31 MB | [mrbumpy409/GeneralUser-GS](https://github.com/mrbumpy409/GeneralUser-GS) @ `97049183` (v2.0.3) | theme `engine/sampler.py` (`GU`), SFX `dsp.py` (`GUGS`) |
| `theme-pack/vsco2ce/` | 1,317 | 1.3 GB | [sgossner/VSCO-2-CE](https://github.com/sgossner/VSCO-2-CE) @ `44030090` | theme `engine/library.py`, `score/common.py`; `mix/scripts/rollcall.py` |
| `theme-pack/vcsl/` | 213 | 345 MB | [sgossner/VCSL](https://github.com/sgossner/VCSL) @ `c1ea7bcc` | theme `engine/library.py`, `score/common.py` |
| `theme-pack/SalamanderGrandPiano-SF2-V3+20200602/` | 2 | 1.2 GB | [FreePats](https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html) `…SF2-V3+20200602.tar.xz` (310 MB) | theme `engine/sampler.py` (`SALAMANDER`) |
| `theme-pack/UprightPianoKW-SF2-20220221/` | 4 | 56 MB | FreePats `UprightPianoKW-SF2-20220221.7z` (29 MB) | theme `engine/sampler.py` (`UPRIGHT_KW`), `reel/reelbed.py` (the felt pad) |
| `vsco2ce-sfx/` | 199 | 232 MB | VSCO-2-CE @ `44030090` (the 198 WAVs the SFX board uses, plus a licence copy) | SFX `dsp.py` (`VSCO`), `instruments.py` |
| `vsco2ce/` (`LICENSE`, `README.md`, `Readme.txt`) | 3 | <1 MB | VSCO-2-CE @ `44030090` | nothing: licence copies only |

- **Which recipe needs which:**

  | Recipe | Libraries |
  |---|---|
  | Score (`audio/theme`) and the old sketch mix (`audio/mix`) | `theme-pack` + `generaluser-gs` |
  | Reel beds (`audio/reel`) | `theme-pack/UprightPianoKW…` |
  | SFX board (`audio/sfx`) | `vsco2ce-sfx` + `generaluser-gs` |
  | intro-sfx, intro-vox, intro-mix, vocals, voices, the animatic temp track | none (they read the committed WAVs) |

- **Pinning.** GitHub files are fetched from `raw.githubusercontent.com/<repo>/<commit>/…`, so an upstream push can't change them. The FreePats archives have versioned file names. If a FreePats file is ever re-issued under the same name, the checksum step reports it.
- **Leftovers you don't need:** `vsco2ce/.git` and `vsco2ce-sfx/.git` (about 570 MB) are abandoned sparse clones from the first download attempt. The fetch script doesn't recreate them, and nothing reads them.
- **`theme-pack/LICENSES.md`** was the theme agent's own credits file. It is gitignored with the samples, so its table is now also in `audio/samples/LICENSES.md` (section "theme agent"). **Salamander Grand Piano is CC BY 3.0, so the credits must name Alexander Holm.**
- The Upright KW archive is `.7z`. The script uses `7z`, `7za` or `7zr` if one is installed, and otherwise the py7zr in `audio/.venv-theme` (or a system py7zr).

---

## 3. Recipes

### 3.0 Everything that is ignored, and how to get it back

| Ignored output | Recipe | Inputs it needs | CPU time | Status |
|---|---|---|---|---|
| `out/season/intro/intro-ep1-V{1,2,3,4}-1080p.mp4` | [Quick start](#quick-start-re-render-the-intro-in-one-go) / §3.1 | the silent master + committed `.m4a` mixes | seconds | ready |
| `out/season/intro/picture/intro-ep1-1080p-silent.mp4` | §3.1 step 2 | studio | ~1.5 min | ready |
| `out/season/intro/intro-ep1-V1-4k.mp4`, `out/season/intro/picture/intro-ep1-4k-silent.mp4` | not re-made (1080p policy) | — | — | retired |
| `out/season/intro/animatic/intro-animatic-silent.mp4`, `intro-animatic.mp4` | §3.2 | studio; committed `audio/animatic/temp-track.wav` | *est.* 1–3 min | ready |
| `out/season/intro/moments/{mcoldopen,meras,mdinner1,mdinner2,mfinale,mfinale-bars9-12,mrollcall}.mp4` + 6 `*-with-scratch-audio.mp4` | §3.3 | studio; committed scratch WAVs | *est.* 1–3 min each | ready |
| `out/lookdev/pixel/cast/*.mp4`, `out/lookdev/pixel/engine/*.mp4` | §3.4 | studio | *est.* < 1 min each | ready |
| `out/lookdev/structures/{pixeladv,puppet,satire,screen,shape}/scene.mp4` | §3.5 | studio | 40 s – 2.5 min each | ready |
| `out/lookdev/looks/title/title-*-motion.mp4` (9), `out/lookdev/looks/render/motion-*.mp4` (9), `out/lookdev/looks/env/env-motion-*.mp4` (5), `out/lookdev/looks/nole/*.mp4` (2), `out/lookdev/looks/anime/motion.mp4` | §3.6 | studio | 15 s – 7 min each; `nole-motion-soft` ~14 min | ready |
| `out/lookdev/looks/puppet/scene-v1.mp4`, `out/lookdev/looks/screen/scene-v{1,2,3}.mp4` | §3.6 | — | — | superseded iterations; not reproducible |
| `audio/reel/epNN.wav` (12 beds, ~50 MB each), `audio/reel/preview/epNN.mp4` | §3.8 | `audio/.venv` + `theme-pack/UprightPianoKW…` | 1–2 min each | ready |
| `out/season/reels/epNN.mp4` (12), `out/season/reels/season.mp4` | §3.8 | studio + the beds | ~4.5 min per episode (measured under load) | in progress (at 14:44 on the audit day, ep01–ep11 were rendered; ep12 and `season.mp4` were still rendering) |
| `out/season/reels/ep01-full-part{1,2}.mp4` (Ep1 full animatic) | §3.9 | studio (+ beds) | *est.* ~16 + 6 min | in progress; never rendered yet |
| `out/ep01/act4/assets/**/*.mp4` (Act Four asset tests) | §3.10 | studio | < 1 min each | in progress |
| Act Four animatic | §3.10 | — | — | in progress: no composition yet |
| `audio/samples/**` | §2 | network | download | ready |
| `node_modules/`, `audio/.venv*/` | §1 | network | minutes | ready |
| `audio/**/_work/`, `audio/**/tts_cache/`, `audio/**/cache/` | rebuilt automatically when missing | — | — | see §3.7 notes |
| `__pycache__/`, `*.pyc`, `*.log`, `*.tsbuildinfo`, `studio/.remotion/`, `studio/out/`, `**/tmp/` | not needed: bytecode, build logs and scratch are written again by whatever runs next | — | — | nothing to do |

Every audio master, stem and MIDI file is **committed**, so you never have to rebuild audio to rebuild a video. §3.1 and §3.7 cover rebuilding them anyway, for example after a score or script change.

### 3.1 The final intro

The intro has 30.000 s of picture (720 frames at 24 fps, 96 BPM) and four sound variations. Picture: `studio/src/intro/` (the edit, EDL `edl.ts`) mounts the six pixel moments of `studio/src/dev/m*/`. Sound: the score (`audio/theme`), SFX (`audio/intro-sfx`) and voices (`audio/intro-vox`) meet in the mix (`audio/intro-mix`). The audio is cued from `out/season/intro/picture/intro-events.json`, which is exported from the picture code. Reports: [out/season/intro/reports/](../out/season/intro/reports/); the audio READMEs are linked per step.

Run the steps in this order. Steps marked *(only after a change)* can be skipped on a clean rebuild, because their outputs are committed.

**1. Picture events** *(only after a picture change; it feeds the SFX build)*, under 5 s:
```bash
cd studio
S=$(mktemp -d)
npx esbuild src/dev/intro/tools/events.ts --bundle --platform=node --outfile=$S/events.cjs \
  --loader:.woff=empty --loader:.woff2=empty --loader:.css=empty
node $S/events.cjs ../out/season/intro/picture/intro-events.json          # "153 events"
```

**2. Silent picture master**, about 1.5 min ([master.sh](../studio/src/dev/intro/tools/master.sh)):
```bash
bash studio/src/dev/intro/tools/master.sh 1080 "$(mktemp -d)"
# = npx remotion render src/dev/intro/entry.tsx intro-ep1 <tmp> --sequence --image-format=png --scale=1 --concurrency=4
#   then ffmpeg libx264 -preset slow -crf 12 -pix_fmt yuv420p, bt709, flags=neighbor (exact 4:2:0 chroma on the 4x4 pixel grid),
#   then checks "h264,1920,1080,yuv420p,24/1,720" and deletes the PNGs.
# -> out/season/intro/picture/intro-ep1-1080p-silent.mp4
```
- Entry `studio/src/dev/intro/entry.tsx`. Compositions: `intro-ep1` (720 f), plus `intro-raw-{mcoldopen,meras,mdinner1,mdinner2,mrollcall,mfinale}`, which show one moment alone on the global clock for handoff review.
- **Don't** use `master.sh 4k` or `all`: those are legacy modes and break the render policy.

**3. Review stills** *(optional; the PNGs are committed)*. `master.sh` deletes its PNGs, so render a sequence yourself:
```bash
cd studio
SEQ=$(mktemp -d); RAW=$(mktemp -d)
npx remotion render src/dev/intro/entry.tsx intro-ep1 $SEQ --sequence --image-format=png --concurrency=4 --bundle-cache=false --log=error
npx remotion render src/dev/intro/entry.tsx intro-raw-mdinner1 $RAW --sequence --image-format=png --frames=340-359 --bundle-cache=false --log=error
python3 src/dev/intro/tools/contact_sheet.py $SEQ        # -> out/season/intro/picture/beats/ (48 beat stills + contact sheet)
python3 src/dev/intro/tools/handoffs.py $SEQ $RAW        # -> out/season/intro/picture/handoffs/ (cut frames, strips, overlap diff)
```

**4. Score** *(only after a score change)*: 4 × about 1 min, plus the analysis. It needs `.venv-theme` and the `theme-pack` + `generaluser-gs` samples. See [VARIATIONS.md](../audio/theme/VARIATIONS.md).
```bash
cd audio/theme
../.venv-theme/bin/python build.py V1 V2 V3 V4 motif   # theme-V*.wav/.mp3, stems/V*-*.wav, midi/, theme-motif-study.mp3
../.venv-theme/bin/python analyze.py V1 V2 V3 V4       # analysis/V*.json + .png
../.venv-theme/bin/python stemtable.py V1 V2 V3 V4     # analysis/V*_balance.json (run from audio/theme: it reads ./stems)
../.venv-theme/bin/python make_cues.py                 # cues.json
```
The VO duck is baked into the stems, and the mix does not duck again.

**5. Intro voices** *(only after a VO/chant change)*: needs `.venv-vocals` and the Kokoro model. See [audio/intro-vox/README.md](../audio/intro-vox/README.md).
```bash
cd audio/intro-vox/scripts
PY=../../.venv-vocals/bin/python
$PY build_vo.py && $PY build_chant.py && $PY build_pad.py && $PY assemble.py
$PY qa_harmony.py ../stems/intro-vox_pad.wav 634 686            # pitch-class check
```
The TTS cache (`_work/tts_cache/`, seeded from `audio/vocals/_work/`) is gitignored. From a fresh clone Kokoro therefore re-renders the 44 takes, and the result may differ slightly from the committed stems. With the cache present, the VO reproduces bit for bit.

**6. Intro SFX** (after step 1 or any SFX change), about 10 s:
```bash
audio/.venv/bin/python audio/intro-sfx/build_intro_sfx.py   # intro-sfx_stem.wav, intro-blip_stem.wav, extras, spotting.*, picture-sync.json, qa.json
audio/.venv/bin/python audio/intro-sfx/make_previews.py     # optional listening previews in preview/
```
It reads `out/season/intro/picture/intro-events.json` and the committed SFX board (`audio/sfx/wav/`), so no sample libraries are needed.

**7. Mix, encode and mux**, about 2 min. See [audio/intro-mix/README.md](../audio/intro-mix/README.md).

`scripts/run_all.sh` does all of this; the 4K lines are skipped when there's no 4K master. To run the steps by hand:
```bash
cd audio/intro-mix/scripts
PY=../../.venv-mix/bin/python
$PY analyze_inputs.py > /dev/null    # qa/inputs.json
$PY mix_intro.py                     # ../intro-ep1-mix-V*.wav, ../stems/V1/*, qa/mix_build.json   (--dry V1 = print checks only)
FFD=../../../studio/node_modules/@remotion/compositor-linux-x64-gnu
for VN in V1:chipchamber V2:orchestralnoir V3:pixelswing V4:pianopixels; do   # AAC-LC 256k, exactly as encode_mux.sh
  V=${VN%%:*} N=${VN#*:}
  LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -hide_banner -loglevel error -y -i ../intro-ep1-mix-$V-$N.wav \
    -c:a libfdk_aac -profile:a aac_low -b:a 256k -ar 48000 -ac 2 \
    -metadata title="MR. MAS Ep1 intro mix $V ($N)" -movflags +faststart -f mp4 ../intro-ep1-mix-$V-$N.m4a
done
cd -   # then run step 3 of the Quick start (the 1080p mux loop)
audio/.venv-mix/bin/python audio/intro-mix/scripts/sfx_balance.py   # qa/sfx_vs_music.json, qa/V1_loudness_timeline.png
```
- `verify.py` (A/V sync, loudness and the ding check → `qa/deliverables_qa.json`) also expects `out/season/intro/intro-ep1-V1-4k.mp4`, so it cannot run on a 1080p-only rebuild until it is patched (§4). The committed `deliverables_qa.json` documents the shipped files.
- `audio/intro-mix/scripts/run_all.sh` runs everything, including `verify.py`, in about 80 s.

**8. Outputs:** `out/season/intro/intro-ep1-V{1..4}-1080p.mp4`, each with 720 video frames, AAC 48 kHz stereo at −14 LUFS, and 30.000 s.

### 3.2 The intro stick-figure animatic (`out/season/intro/animatic/`)

This is the rough timing animatic with stick figures and boxes: 1280×720, 720 frames, from entry `studio/src/dev/animatic/entry.tsx` (`intro-animatic`). It predates the pixel intro.
```bash
cd studio
npx remotion render src/dev/animatic/entry.tsx intro-animatic ../out/season/intro/animatic/intro-animatic-silent.mp4 --concurrency=2 --bundle-cache=false --log=error
cd ..
# temp track (optional; temp-track.wav/.mp3 + temp-track_events.json are committed). Inputs: audio/sfx/wav/*, audio/vocals/vo/mas_coldopen_michael.wav
(cd audio/animatic && ../.venv/bin/python build_temp_track.py)
# mux (the original mux command was not recorded; this is the standard one used elsewhere)
ff -y -i out/season/intro/animatic/intro-animatic-silent.mp4 -i audio/animatic/temp-track.wav -map 0:v -map 1:a -c:v copy \
   -c:a aac -b:a 192k -shortest -movflags +faststart out/season/intro/animatic/intro-animatic.mp4
# stills (committed): node src/dev/animatic/stills.mjs <outdir> <prefix> f1 f2 …   (run from studio/)
```

### 3.3 The pixel intro moments and the roll call (`out/season/intro/moments/`)

Each moment is authored at 480×270 and scaled 4× nearest-neighbour. The review MP4s are rendered at `--scale=0.5` (960×540), except `mrollcall.mp4`, which was rendered at full 1080p. Composition frame 0 is the intro frame given below.

| Moment (intro frames) | Entry | Composition (frames) | Scratch audio (committed WAV) → how it was made |
|---|---|---|---|
| cold open (0–119) | `src/dev/mcoldopen/entry.tsx` | `mcoldopen` (120) | `mcoldopen-scratch-audio.wav` ← `python3 src/dev/mcoldopen/tools/scratch_audio.py <wav>` |
| eras 1993/2008/2014 (120–239) | `src/dev/meras/entry.tsx` | `meras` (120) | `meras-scratch-audio.wav` ← esbuild `src/dev/meras/audio/sketch.ts`, then `node <bundle> <wav>` |
| dinner 1 (225–359) | `src/dev/mdinner1/entry.tsx` | `mdinner1` (135) | `mdinner1-scratch-audio.wav` ← `python3 src/dev/mdinner1/tools/scratch_audio.py <wav>` |
| dinner 2 (345–479) | `src/dev/mdinner2/entry.tsx` | `mdinner2` (135) | `mdinner2-scratch-audio.wav` ← `python3 src/dev/mdinner2/tools/scratch_audio.py <wav>` |
| roll call "THE PLAYERS" (480–539) | `src/dev/mrollcall/entry.tsx` | `mrollcall` (60) | none |
| skyline, title, bookend (540–719) | `src/dev/mfinale/entry.tsx` | `mfinale` (180), `mfinale-bars9-12` (240, from f480) | `mfinale-scratch-audio.wav` = `audio/mfinale-mix.wav`, `audio/mfinale-bars9-12-mix.wav` ← esbuild `src/dev/mfinale/tools/audio.ts`, then `node <bundle> ../out/season/intro/moments/audio` |

```bash
cd studio
for m in mcoldopen meras mdinner1 mdinner2 mfinale; do
  npx remotion render src/dev/$m/entry.tsx $m ../out/season/intro/moments/$m.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
done
npx remotion render src/dev/mfinale/entry.tsx mfinale-bars9-12 ../out/season/intro/moments/mfinale-bars9-12.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
npx remotion render src/dev/mrollcall/entry.tsx mrollcall ../out/season/intro/moments/mrollcall.mp4 --concurrency=1 --bundle-cache=false --log=error

# "-with-scratch-audio" versions: stream-copy the picture, add the committed scratch WAV
M=../out/season/intro/moments
for m in mcoldopen meras mdinner1 mdinner2 mfinale; do
  ff -y -i $M/$m.mp4 -i $M/$m-scratch-audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest $M/$m-with-scratch-audio.mp4
done
ff -y -i $M/mfinale-bars9-12.mp4 -i $M/audio/mfinale-bars9-12-mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest \
   $M/mfinale-bars9-12-with-scratch-audio.mp4
```
- The scratch tracks are timing sketches, not the score. The final intro audio is §3.1.
- Key stills are committed. The still ids are listed in §5, for example `meras-key-2014` and `mfinale-key-title`, and the builders' notes are in `studio/notes/<moment>.md`.
- Every moment also has a Node preview that renders exact pixels in about a second, with no browser: `src/dev/<moment>/tools/preview.ts` (usage in its header).

### 3.4 Pixel cast and engine tests (`out/lookdev/pixel/cast/`, `out/lookdev/pixel/engine/`)

```bash
cd studio
npx remotion render src/dev/castmas/entry.tsx     castmas-motion          ../out/lookdev/pixel/cast/castmas-motion.mp4    --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
npx remotion render src/dev/castrivals/entry.tsx  castrivals-motion       ../out/lookdev/pixel/cast/castrivals-motion.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
npx remotion render src/dev/pixelengine/entry.tsx pixelengine-dissolve    ../out/lookdev/pixel/engine/dissolve.mp4        --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
npx remotion render src/dev/pixelengine/entry.tsx pixelengine-renderfront ../out/lookdev/pixel/engine/renderfront.mp4     --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
```
Each is 48 frames at 960×540. Notes: `studio/notes/{castmas,castrivals,pixelengine}.md`, [PIXEL_GUIDE.md](../studio/PIXEL_GUIDE.md).

### 3.5 Structure tests (`out/lookdev/structures/<key>/scene.mp4`)

These are the style bake-off. The same 5-second beat (120 frames) is staged in each candidate structure, rendered at `--scale=0.5` (960×540). Each folder's `REPORT.md` and key stills are committed.

```bash
cd studio
for k in pixeladv puppet satire screen shape; do
  npx remotion render src/dev/$k/entry.tsx $k-scene ../out/lookdev/structures/$k/scene.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
done
```
- Measured: `screen` about 40 s, `puppet` about 2–2.5 min on an idle machine.
- `comic-scene` (`src/dev/comic/entry.tsx`) and `anime-scene` (`src/dev/animescene/entry.tsx`) exist as compositions. Their `out/lookdev/structures/{comic,anime}/` folders are empty: those two tests only left stills, in `out/lookdev/looks/comic/` and `out/lookdev/looks/animescene/`. The loop above works for them too if you want a render. `collage` and `realism` have stills only, and no scene composition.

### 3.6 Title cards and other lookdev MP4s (`out/lookdev/looks/`)

These come from the style-spectrum phase, before the pixel look was chosen: 72-frame (3 s) motion tests at full 1080p with concurrency 2 ([ART_GUIDE.md](../studio/ART_GUIDE.md)).

```bash
cd studio
for s in anime cartoon dither engrave glyph noir pixel riso soft; do          # title cards
  npx remotion render src/dev/title/entry.tsx title-$s-motion ../out/lookdev/looks/title/title-$s-motion.mp4 --bundle-cache=false --log=error --concurrency=2
done
for s in dither engrave glyph noir paint pixel riso soft stipple; do          # tonal renderers
  npx remotion render src/dev/tonetest/entry.tsx tone-motion-$s ../out/lookdev/looks/render/motion-$s.mp4 --bundle-cache=false --log=error --concurrency=2
done
for s in glyph noir paint pixel soft; do                                      # environment + Orb
  npx remotion render src/dev/env/entry.tsx env-motion-$s ../out/lookdev/looks/env/env-motion-$s.mp4 --bundle-cache=false --log=error --concurrency=2
done
npx remotion render src/dev/nole/entry.tsx  nole-motion      ../out/lookdev/looks/nole/nole-motion.mp4      --bundle-cache=false --log=error --concurrency=2
npx remotion render src/dev/nole/entry.tsx  nole-motion-soft ../out/lookdev/looks/nole/nole-motion-soft.mp4 --bundle-cache=false --log=error --concurrency=2
npx remotion render src/dev/anime/entry.tsx anime-motion     ../out/lookdev/looks/anime/motion.mp4          --bundle-cache=false --log=error --concurrency=2
```

| Test | Measured time |
|---|---|
| Tonal renderers (`tone-motion-*`) | soft about 2 min 40 s, glyph 1 min 35 s, engrave 1 min 25 s, pixel 1 min, the rest under 1 min |
| Environment (`env-motion-*`) | paint 23 s, noir 21 s, pixel 15 s, glyph 27 s, **soft about 400 s** |
| `nole-motion` | 1 min 40 s |
| `nole-motion-soft` | about 14 min while other renders ran |

- More per-style Nole tests exist as compositions (`nole-motion-{dither,engrave,glyph,noir,paint,pixel,riso,stipple}`), but no MP4 of them is in `out/`.
- **Superseded iterations:** `out/lookdev/looks/puppet/scene-v1.mp4` and `out/lookdev/looks/screen/scene-v{1,2,3}.mp4` are earlier versions of `puppet-scene` and `screen-scene`. The code has moved on and there is no history to go back to, so re-rendering those ids gives the current §3.5 version.

### 3.7 Audio masters: theme, SFX, vocals, voice casting (all committed)

The WAV and MP3 masters, stems, MIDI and QA files are in git. Rebuild them only after changing their scripts. Each rebuild overwrites the committed files in place, so check `git diff --stat` afterwards.

| What | Folder | venv | Samples | Rebuild | Time |
|---|---|---|---|---|---|
| Theme score (4 variations + motif) | `audio/theme` | `.venv-theme` | theme-pack, generaluser-gs | §3.1 step 4 | ~1 min per variation |
| SFX board + voice blips (131 sounds, blip kits, intro layout, reels) | `audio/sfx` | `.venv` | vsco2ce-sfx, generaluser-gs | `audio/.venv/bin/python audio/sfx/scripts/build.py` (`--only PREFIX,…`, `--no-mp3`, `--no-qa`), then `audio/.venv/bin/python audio/sfx/scripts/layout.py` | ~2 min |
| Vocal pass (cold-open takes, lines, chant variants, harmony pads, intro layers) | `audio/vocals` | `.venv-vocals` | none (Kokoro) | the `scripts/*.py` sequence in [audio/vocals/README.md](../audio/vocals/README.md) § Re-render | *est.* minutes; faster with `_work/tts_cache/` |
| Voice casting (10 characters, candidates, reels) | `audio/voices` | `.venv-casting` | none (Kokoro + whisper for QA) | `audio/.venv-casting/bin/python audio/voices/tools/cast.py [slug …]`, then `… cast.py --finalize` ([CASTING.md](../audio/voices/CASTING.md)) | *est.* tens of minutes |
| Intro SFX / voices / mix | `audio/intro-*` | see §3.1 | none | §3.1 steps 5–7 | |
| Animatic temp track | `audio/animatic` | `.venv` | none | §3.2 | seconds |
| Intro sketch mix (superseded by `intro-mix`) | `audio/mix` | `.venv-mix` | theme-pack | `cd audio/mix && ../.venv-mix/bin/python scripts/render_music.py V1 V2 V3 V4 && ../.venv-mix/bin/python scripts/mix.py V1 V2 V3 V4 && ../.venv-mix/bin/python scripts/qa_plots.py V1 V2 V3 V4` ([LISTENING_GUIDE.md](../audio/LISTENING_GUIDE.md)) | ~80 s + 20 s per variation |

- **Caches, all gitignored and all rebuilt on demand:**
  - `audio/theme/cache/calib.json` holds the sample pitch calibration. It is re-measured on the first build, which makes that build slower.
  - `audio/mix/cache/` is regenerated by `mix.py`.
  - `audio/vocals/_work/tts_cache/` (about 71 MB) and `audio/intro-vox/_work/tts_cache/` (11 MB) hold the Kokoro renders. Without them the voices re-render, and may differ slightly from the committed files.
- **No human has auditioned any of the audio.** Every level was set by measurement (see the READMEs).

### 3.8 The season story reels (`out/season/reels/`, `audio/reel/`) (in progress)

These are data-driven stick-figure outline reels, one per episode: about 3 minutes each, at 1280×720. The writers edit `show/reel/epNN.json`. `studio/src/reel/sync.mjs` copies and lints the JSON into `studio/src/reel/data/`, and the generator in `studio/src/reel/` draws it. Compositions (entry `studio/src/dev/reel/entry.tsx`):

| Composition | Frames |
|---|---|
| `reel-ep01` … `reel-ep12` | 4,032–4,236 each |
| `reel-season` | 49,944 (all twelve back to back) |
| `reel-ep01-full-part1`, `reel-ep01-full-part2` | §3.9 |

Build the beds first, then the picture, because `render_all.sh` muxes a bed when it finds `audio/reel/epNN.wav`:
```bash
audio/.venv/bin/python audio/reel/build_all.py              # 12 beds, 3 at a time (~1.7 GB RAM each; --jobs 1 on a busy box), incremental
bash studio/src/dev/reel/render_all.sh                      # sync JSON -> bundle once -> render + mux each epNN -> sheets -> season.mp4
bash studio/src/dev/reel/render_all.sh ep03 ep07            # just these;  env: CONC=4  NO_SEASON=1  NO_SHEETS=1  REEL_OUT=…  REEL_AUDIO_DIR=…
audio/.venv/bin/python audio/reel/build_all.py --mux        # optional: audio/reel/preview/epNN.mp4 (picture copied + bed as AAC 192k)
```
- **Outputs:** `out/season/reels/epNN.mp4` (with a silent track when no bed exists, so the concat is clean), `out/season/reels/season.mp4` (stream-copy concat), `out/season/reels/sheets/reel-epNN-sheet.png` (committed; needs system `python3` + PIL).
- **Time.** Measured during the audit, on a loaded machine at `CONC=5`: about 4.5 min per episode for render, mux and sheet, so about 55 min for all twelve. A bed takes 1–2 min.
- The bed rebuild check hashes the reel JSON, `reelbed.py` and the size and mtime of two V1 theme files. A fresh clone has new mtimes, so every bed rebuilds once. That is harmless.
- **Status at the audit:** another agent was rendering the reels. At 14:44, `out/season/reels/ep01.mp4`–`ep11.mp4` and their sheets existed; ep12 and `season.mp4` were still to come. `ls out/season/reels/` shows the current state. While `render_all.sh` runs it keeps a bundle in `out/season/reels/.tmp/` (gitignored), which it deletes at the end.
- **Bed lookup gotcha:** `render_all.sh` picks the first of `audio/reel/<key>.*` and then `audio/reel/<key>[-_]*.*`. So if `ep01.wav` is missing but `ep01-full-part1.wav` exists, `ep01` is muxed with the full-animatic bed. Build the `epNN` beds first (the default `build_all.py` run does).

### 3.9 Ep1 full animatic (in progress)

This is the 1:1 full-episode animatic of Ep1, in two parts. It uses the reel generator and the reel schema.

| Part | Data | Composition | Frames |
|---|---|---|---|
| 1 | `show/reel/ep01-full-part1.json` (145 beats) | `reel-ep01-full-part1` | 14,784 = 10:16 |
| 2 | `show/reel/ep01-full-part2.json` (61 beats) | `reel-ep01-full-part2` | 5,544 = 3:51 |

Both compositions are verified to exist. Neither part has been rendered yet.
```bash
audio/.venv/bin/python audio/reel/build_all.py ep01-full-part1 ep01-full-part2 --jobs 1   # beds (~6 GB RAM for part 1)
NO_SEASON=1 bash studio/src/dev/reel/render_all.sh ep01-full-part1 ep01-full-part2       # -> out/season/reels/ep01-full-part{1,2}.mp4 (est. ~16 + 6 min)
```
`render_all.sh` accepts these keys because `studio/src/reel/data/ep01-full-part{1,2}.json` exist after the sync. `NO_SEASON=1` stops it from also rebuilding `season.mp4`, which only ever includes `epNN` files anyway.

### 3.10 Ep1 Act Four (in progress)

Act Four (scenes 24–31) was being built by other agents during this audit, so the files below were still changing. At audit time:
- `studio/src/episodes/ep01/act4/inserts/` had an entry that did not bundle yet (its `frames.ts` was missing).
- `medium/` and `board/` had no entry at all.

Re-run `npx remotion compositions <entry>` for the current ids.

- **Asset tests** (`out/ep01/act4/assets/`). Each part has its own entry under `studio/src/episodes/ep01/act4/<part>/entry.tsx`, and all render at `--scale=0.5 --concurrency=2`:

  | Output | Entry | Composition(s) |
  |---|---|---|
  | `cast/motion.mp4` | `cast` | `act4cast-motion` |
  | `kits/test-<name>.mp4` | `kits` | `kits-<name>` for plan, flash, call, hearts, tiles, props, extras (also `kits-flashtrace`) |
  | `rooms-a/rooms-a-motion.mp4` | `rooms-a` | `ep01a4-rooms-motion` |
  | `rooms-b/rb-motion-{bluedoor,landlord,lighthouse}.mp4` | `rooms-b` | `rb-motion-{bluedoor,landlord,lighthouse}` |

  ```bash
  cd studio
  npx remotion render src/episodes/ep01/act4/cast/entry.tsx act4cast-motion ../out/ep01/act4/assets/cast/motion.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
  for k in plan flash call hearts tiles props extras; do
    npx remotion render src/episodes/ep01/act4/kits/entry.tsx kits-$k ../out/ep01/act4/assets/kits/test-$k.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
  done
  npx remotion render src/episodes/ep01/act4/rooms-a/entry.tsx ep01a4-rooms-motion ../out/ep01/act4/assets/rooms-a/rooms-a-motion.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
  for k in bluedoor landlord lighthouse; do
    npx remotion render src/episodes/ep01/act4/rooms-b/entry.tsx rb-motion-$k ../out/ep01/act4/assets/rooms-b/rb-motion-$k.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
  done
  ```
- **Dialogue** (`audio/ep01/act4/dialogue/`: WAV/MP3 committed; recording was in progress during the audit):
  ```bash
  HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/record.py [line-id …]   # seeded: re-runs reproduce the takes
  # then final_cast.py, reel.py, make_doc.py in the same folder
  ```
  See `show/episodes/ep01/production/act4/dialogue.md`. Drop `HF_HUB_OFFLINE=1` the first time, or pre-fetch the models (§1.4).
- **Animatic (in progress).** The timing lock is `studio/src/episodes/ep01/act4/animatic/tools/lock.py` (standard library only). It writes `show/…/shots-locked.json` and `studio/src/episodes/ep01/act4/animatic/data.ts`. Scratch V.O. comes from `HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/scratch_vo.py`. **There is no animatic entry or composition yet**, so there is no render command. When one lands, it will follow the pattern `npx remotion render src/episodes/ep01/act4/<entry>.tsx <id> ../out/ep01/act4/animatic/<name>.mp4`.

---

## 4. Known issues and gotchas

1. **The 4K steps in the intro mix (fixed).** `encode_mux.sh` muxes a V1 4K file only if `out/season/intro/picture/intro-ep1-4k-silent.mp4` exists, and `verify.py` checks it only if present. Under the 1080p render policy neither is produced.
2. **`/tmp/claude-1000/…` scratch defaults** in a few scripts (§1.1). The repo path itself is no longer hard-coded.
3. **Linux x64 glibc only as written:** the scripts point at `compositor-linux-x64-gnu`.
4. **Transitive dependencies.** `studio/src/dev/{reel,animatic}/stills.mjs` import `@remotion/bundler` and `@remotion/renderer`, which only arrive through `@remotion/cli`. They resolve with npm's flat install, but they aren't in `package.json`.
5. **Voice rebuilds aren't bit-exact from a clean clone** (§3.7 caches), and Kokoro's `main` revision could move upstream (§1.4).
6. **Reel render temp bundle.** `render_all.sh` keeps a ~30 MB bundle in `out/season/reels/.tmp/` while it runs. `.tmp/` is gitignored.
7. **Stale bits in older docs:**
   - `studio/src/dev/intro/entry.tsx` and `studio/src/intro/intro.frame.tsx` still show direct `--scale=2` and `--crf` render commands. `master.sh` is the real path.
   - `audio/intro-mix/README.md` lists the 4K MP4 as a deliverable.
   - `audio/LISTENING_GUIDE.md` describes the superseded sketch mixes in `audio/mix/`.

---

## 5. Verification log

What this audit actually ran on 2026-09-25, all cheap and CPU-light:

- **`npx remotion compositions` on all 34 entries** (`src/index.ts`, the 28 `src/dev/*` entries and the 5 Act Four entries), niced. 33 bundled cleanly. The exception was `src/episodes/ep01/act4/inserts/entry.tsx`, which was being written at the time: its `./frames` didn't exist yet. Every id used above appears in the output. The video compositions (id, frames), with the full 1080p size unless noted:

  | Entry | Compositions |
  |---|---|
  | intro | `intro-ep1` 720; `intro-raw-{mcoldopen,meras,mdinner1,mdinner2,mrollcall,mfinale}` 720 |
  | animatic | `intro-animatic` 720 (1280×720) |
  | moments | `mcoldopen` 120 · `meras` 120 · `mdinner1` 135 · `mdinner2` 135 · `mrollcall` 60 · `mfinale` 180 · `mfinale-bars9-12` 240 |
  | pixel cast and engine | `castmas-motion` 48 · `castrivals-motion` 48 · `pixelengine-dissolve` 48 · `pixelengine-renderfront` 48 · `pixelengine-switches` 10 |
  | structures | `pixeladv-scene` · `puppet-scene` · `satire-scene` · `screen-scene` · `shape-scene` · `comic-scene` · `anime-scene`, 120 each; also `puppet-{close,f,tear}` |
  | lookdev | `title-{anime,cartoon,dither,engrave,glyph,noir,pixel,riso,soft}-motion` · `tone-motion-{dither,engrave,glyph,noir,paint,pixel,riso,soft,stipple}` · `env-motion-{glyph,noir,paint,pixel,soft}` · `nole-motion`, `nole-motion-<style>` · `anime-motion`, 72 each |
  | reels | `reel-ep01` … `reel-ep12` (4,032–4,236) · `reel-season` 49,944 · `reel-ep01-full-part1` 14,784 · `reel-ep01-full-part2` 5,544 (1280×720) |
  | Act Four | `act4cast-motion` · `kits-{plan,flash,flashtrace,call,hearts,tiles,props,extras}` · `ep01a4-rooms-motion` · `rb-motion-{bluedoor,landlord,lighthouse}` |

  The stills are listed by the same command, for example `npx remotion compositions src/dev/meras/entry.tsx`.
- **Intro events:** re-exported `intro-events.json` to a scratch folder with the §3.1 step 1 commands (1.2 s). The result was 153 events, byte-identical to the committed file (md5 `f37ea409b5e12dad7774ea78aaa6bc3a`). No file the intro imports was modified after the 10:09 silent master.
- **Sample libraries:** hashed all 1,740 files into `MANIFEST.sha256`, and `fetch_samples.sh --check` passes on the working folder.
  - Upstream: `git ls-remote` confirmed the VSCO-2-CE and VCSL heads. The GitHub API confirmed the GeneralUser-GS v2.0.3 commit and file size (32,319,396 B). HTTP HEAD requests confirmed both FreePats archive URLs (310,397,984 B and 28,832,466 B).
  - A 4-file fetch into a scratch folder, including a path with spaces and `#`, downloaded and verified. The full download was **not** run.
- **Toolchain:** the bundled ffmpeg's encoder, filter and device lists (§1.3); `npx remotion ffmpeg -version`; `npm ls --depth=0` against the lockfile (clean); `build.py --help` (SFX) and `build_all.py --help` (reels) import cleanly in `audio/.venv`; `audio/.venv-vocals` reports torch `2.14.0+cpu`; `python -m py7zr --help` works in `.venv-theme`.
- **Inputs:** every file the animatic temp track reads exists. Every video in the tree at audit time (76, before the season reels landed) was probed for size and frame count, and the tables above match them. For example, the moments are 960×540 except `mrollcall` (1920×1080), the lookdev tests are 1920×1080 with 72 frames, and the animatic and reels are 1280×720.
- **Paths:** the intro-mix Python scripts resolve every path from `mixlib.ROOT`, so the step 7 commands work from any directory.
- **Not run:** any long render, mix or TTS job.
