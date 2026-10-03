# MR. MAS: pipeline

This doc explains how the project is built: the code layout, the picture and sound pipelines, the AI-agent workflow that produced them, and the decisions made so far. It is written for a technical reader. The top-level [README](../README.md) has the overview. The step-by-step re-render guide is [RENDERING.md](RENDERING.md). The creative rules live in the writers' room, starting at [show/INDEX.md](../show/INDEX.md).

- **As of:** 2026-09-25, with a 2026-10-02 update. The sections marked **in progress** describe the state of 2026-09-25. **Since then, Episode 1 was finished, published and locked** (23:31.58, `out/ep01/full-v3/ep01-v35.mp4`; watch it from [EPISODES.md](../EPISODES.md)). Its v3 film pipeline, which superseded the Act Four animatic of §1.9, is documented beside it: [`show/episodes/ep01/production/full-v3/pipeline.md`](../show/episodes/ep01/production/full-v3/pipeline.md) (locks, the pixel renderer `studio/src/episodes/ep01/pixel/`, the score `audio/ost/tracks/e01-v3-<seg>/`, ElevenLabs voices `audio/ep01/v3-el/`, stems and mixes `audio/reel/ep01-v3/`) and [`assembly.md`](../show/episodes/ep01/production/full-v3/assembly.md) (the film, and `ops/rebuild-act.sh`). Heavy jobs go through `ops/heavy.sh` ([`ops/README.md`](../ops/README.md)). The folder layout was reorganized on 2026-09-29 ([ORGANIZATION-PLAN.md](ORGANIZATION-PLAN.md)).
- **Everything is made in code.** Pictures are drawn pixel by pixel in TypeScript and rendered with Remotion. Music, sound effects and voices are generated in Python. The pipeline uses no image-generation model and no recording of a real person's voice.
- **Machine:** one Linux laptop (Intel Core Ultra 7 255U, 14 threads, 30 GB RAM, no GPU) with Node 18.19.1 and Python 3.12. Every render runs on the CPU.
- **Render policy (showrunner, 2026-09-25):** 1080p (1920×1080) is the maximum. Previews use `--scale=0.5`.
- **Intro upload:** <https://www.youtube.com/watch?v=IHCn0QC1Zow>

**Contents:** [1. Architecture](#1-architecture) · [2. Audio](#2-audio) · [3. The agent workflow](#3-the-agent-workflow) · [4. Decisions log](#4-decisions-log) · [5. Guardrails summary](#5-guardrails-summary) · [6. Known issues](#6-known-issues) · [Appendix: rebuild order](#appendix-rebuild-order)

```
 show/ (Markdown + JSON)          studio/ (Remotion, TypeScript)                     audio/ (Python)
 ───────────────────────          ─────────────────────────────                      ───────────────
 intro/SCRIPT.md  ───────────────▶ six intro moments ─▶ src/intro (EDL + QC)
 (frames, cues, text)              (shared pixel engine)        │
                                                                ├─▶ silent master  (out/season/intro/picture/*.mp4)
                                                                └─▶ intro-events.json ─▶ intro/sfx (spotting) ─┐
 intro/SCRIPT.md §9 ───────────────────────────────────────────────▶ theme (score, stems) ──────────────────────┼─▶ intro-mix ─▶ mux ─▶ out/season/intro/intro-ep1-V*.mp4
                                                                     intro/vox (VO, chant, pad) ───────────────┘
 reel/epNN.json ─▶ src/reel (story-reel generator) ─▶ out/season/reels/epNN.mp4 ◀─ mux ◀─ audio/reel (temp bed from the same JSON)
 episodes/ep01/production/act4 ─▶ src/episodes/ep01/act4 (rooms, cast, kits, animatic)  ◀── audio/ep01/act4/dialogue
```

---

## 1. Architecture

### 1.1 Repo layout

```
mrmas/
├── show/                        writers' room (Markdown + JSON); start at INDEX.md
│   ├── bible/                   overview, naming, guardrails, style status, POV and framing
│   ├── characters/              one file per character (~80)
│   ├── episodes/epNN/           seven files per episode; ep01–ep03 also have script.md, ep01 has production/act4/
│   ├── intro/SCRIPT.md          the 30 s opening, frame by frame (the single source of truth for the intro)
│   ├── format/                  production estimates, content density, pacing model, FORMAT-DECISION
│   ├── reel/epNN.json           story-reel timelines (drive the reel picture and its audio bed)
│   ├── timeline/ gags/ world/   the fact spine, flashback map, running gags, locations and props
│   └── _sources/                research dossiers and design drafts (read-only history)
├── studio/                      Remotion 4 project (React 19, TypeScript)
│   ├── src/Root.tsx             registers every *.frame.tsx under src/
│   ├── src/dev/                 one dev entry per builder, plus Node-only tools
│   ├── src/shared/pixel/        the pixel engine: the show's look
│   ├── src/shared/tonal/ …      lookdev-era rigs and renderers (reference only)
│   ├── src/intro/               the integrated 30 s intro (EDL, QC)
│   ├── src/reel/                the story-reel generator
│   ├── src/episodes/ep01/act4/  Ep1 Act Four production modules
│   ├── src/styleframes/         *.frame.tsx files for lookdev, structure tests and intro moments
│   ├── notes/                   one note per builder, plus critiques and reports
│   └── ART_GUIDE.md · PIXEL_GUIDE.md · INTRO_PIXEL_BRIEF.md
├── audio/                       Python: score, SFX, voices, mixes; WAV/MP3 masters, stems, QA JSON
│   ├── requirements/            frozen pip lists, one per virtualenv
│   └── samples/                 LICENSES.md, fetch_samples.sh, MANIFEST.sha256; the libraries themselves are downloaded, not committed (§2.2)
├── out/                         renders: stills, contact sheets, reports, QA (videos are gitignored)
└── docs/                        PIPELINE.md (this file), RENDERING.md (the re-render guide)
```

**What's in git** (see [.gitignore](../.gitignore)): code, docs, stills, audio masters, stems and QA files are committed. Everything ignored can be rebuilt:

| Ignored | How to get it back |
|---|---|
| Videos (`*.mp4 *.mov *.webm *.mkv *.m4v *.avi`) | Re-render: [RENDERING.md](RENDERING.md) (§3.0 there lists every ignored video and its recipe); in this doc, §1.7, §1.8, §2.6 and the [appendix](#appendix-rebuild-order) |
| `node_modules/`, `studio/.remotion/`, `studio/out/` | `cd studio && npm ci && npx remotion browser ensure` |
| `.venv*/`, `__pycache__/` | Recreate from `audio/requirements/*.txt` (§2.1) |
| `audio/samples/*` except `LICENSES.md`, `fetch_samples.sh`, `MANIFEST.sha256` | `bash audio/samples/fetch_samples.sh` (pinned sources, every file checksummed; §2.2, [RENDERING §2](RENDERING.md#2-sample-libraries)) |
| `audio/**/cache/`, `audio/**/_work/`, `audio/**/tts_cache/`, `**/tmp/` | Regenerated on the next run (sample calibration, TTS cache, scratch) |
| `*.log` | Build logs; nothing reads them |
| `audio/reel/*.wav` (about 50 MB each), `audio/reel/preview/` | `audio/.venv/bin/python audio/reel/build_all.py` (add `--mux` for the previews) |

### 1.2 Toolchain

| Layer | Tool | Notes |
|---|---|---|
| Picture | Remotion 4.0.529, React 19.1, TypeScript 5.6 | [studio/package.json](../studio/package.json). Remotion ships Chrome Headless Shell and ffmpeg. [remotion.config.ts](../studio/remotion.config.ts): PNG frames, overwrite on, concurrency 4. |
| Encode | Remotion's bundled ffmpeg and ffprobe (`studio/node_modules/@remotion/compositor-linux-x64-gnu/`) | The master and mux shell scripts call these directly (with `LD_LIBRARY_PATH` set to that folder). |
| Node tools | esbuild (installed as a Remotion dependency) | Bundles `.ts` dev tools (the events export, previews, audits) to run in plain Node |
| Stills and QA | Python 3 + Pillow | Contact sheets and handoff strips |
| Audio | Python 3.12 virtualenvs | numpy, scipy, soundfile, pedalboard, pretty_midi, tinysoundfont, pyloudnorm, and Kokoro-82M on CPU-only torch 2.14.0 for voices (§2.1) |
| Fonts | `@fontsource/*` packages | Loaded in `src/shared/theme/fonts.ts`. The pixel faces are bitmap fonts drawn in code (`src/shared/pixel/font.ts`). |

### 1.3 How compositions are registered

- **One type.** A `FrameDef` is `{id, component, props?, width?, height?, fps?, durationInFrames?}` ([src/shared/frame-def.ts](../studio/src/shared/frame-def.ts)). If it has no duration, it's a still.
- **Auto-registration.** Every `*.frame.tsx` under `src/` exports `frames: FrameDef[]`. [src/Root.tsx](../studio/src/Root.tsx) collects them with webpack's `require.context('./', true, /\.frame\.tsx$/)` and passes them to `makeRoot` ([src/shared/makeRoot.tsx](../studio/src/shared/makeRoot.tsx)). `makeRoot` sorts them by id and emits a `<Composition>` or `<Still>` for each, at 1920×1080 and 24 fps by default. New work never edits Root.
- **Per-builder dev entries.** Each builder also gets its own entry (`src/dev/<key>/entry.tsx`, or `src/episodes/.../entry.tsx`). It registers only that builder's frames with `makeRoot(frames)`. An entry like this bundles much less than the full Root, and a broken file in one builder's folder can't block another builder's render. The Act Four modules export from `frames.ts`, not `*.frame.tsx`, so their own entries are the only way to reach them.

```sh
cd studio
npm ci
npx remotion studio src/index.ts                                   # every registered composition
npx remotion still  src/dev/<key>/entry.tsx <id> ../out/<path>.png --bundle-cache=false --log=error
npx remotion render src/dev/<key>/entry.tsx <id> ../out/<path>.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
npm run typecheck                                                  # tsc --noEmit
```

- **Faster iteration.** Bundle once with `npx remotion bundle <entry> --out-dir=<scratch>/bundle`, then pass the bundle folder in place of the entry. Pure pixel code can also be previewed in Node in seconds: `src/dev/pixelengine/tools/preview.ts`, and a `tools/preview.ts` for each Act Four builder. The builders diffed these previews against Remotion renders and found them pixel-identical.

### 1.4 The timing grid

- **Picture.** [src/shared/timing.ts](../studio/src/shared/timing.ts) runs at 24 fps and 96 BPM, which gives **15 frames per beat and 60 per bar**. The intro is 12 bars: 720 frames, or 30.0 s. `at(bar, beat)` converts bar.beat to a frame.
- **Audio.** [audio/theme/engine/core.py](../audio/theme/engine/core.py) mirrors the grid at 48 kHz. One frame is exactly 2,000 samples, so the intro is 1,440,000 samples.
- **Eighth notes.** A swung second eighth lands 10 frames after the beat. A straight one lands at +7.5 frames in the music; picture and SFX round that down to +7.
- **What sits on the grid.** Cuts, palette switches, set-pieces and dialogue holds all land on beats. The Act Four timing lock rounds every shot up to the next beat.
- **Why it matters.** Because the edit is counted in beats, re-voicing or re-scoring later changes mouths and levels, not the cut.

### 1.5 The pixel engine (`src/shared/pixel`)

[studio/PIXEL_GUIDE.md](../studio/PIXEL_GUIDE.md) is the binding spec. In short:

- **Canvas.** Everything is authored at a native **480×270** and output at 4× nearest-neighbour, which gives 1920×1080. `<PixelScene>` always uses the largest integer scale that fits. Adventure-game layout splits the frame into a room (480×203) and a verb/rail band (480×67, `UI_Y = 203`).
- **Framebuffer.** `Buf` is a `Uint32Array` of packed `0xRRGGBB`, and every value must come from the master palette.
  - The palette is 91 named colours in `palette.ts`, arranged as hand-ordered light ramps: night `N`, monitor cyan `C`, tungsten `W`, skin, and the ramps promoted in v1.1.
  - Because every pixel is a palette colour, the frame is effectively indexed. A style switch is therefore a per-colour lookup, not a filter.
  - `strayColors(fb)` catches hand-typed hexes.
- **Per-frame pipeline** (`compose.ts`, hosted by `PixelScene.tsx`):
  1. `new Buf(bg)`
  2. `draw(fb, f)`
  3. `palette`
  4. each `switch` spec, in order
  5. present at integer scale
  6. glyph layers
  7. the `after` UI layer, which is never switched

  `composeFrame()` runs the same pipeline without a DOM, for Node previews and contact sheets.
- **Determinism.** Randomness comes only from `hash(x, y, seed)` and ordered thresholds. No `Math.random` and no `Date`. Canvas work runs inside `delayRender`.

| Module | What it does |
|---|---|
| `px.ts` | `Buf`, rect/line/poly/ellipse, string-map sprites, `blit`, `shear`, `hash`, `bayer` |
| `palette.ts` | the master palette `PAL`, ramp families, `stepColor`, OKLab helpers, `SKIN_COLORS` |
| `palettes.ts` | the palette sets `BASE`, `2TONE_FREEZE`, `ONEBIT`, `EARLYWEB16`, `LEDGER`, `TERMINAL`, and the tools that build and remap them (`compilePalette`, `.with()` variants, `familyStep`, `lutRemap`, `applyPalette`) |
| `light.ts`, `figure.ts` | Rooms are painted as (material, level) into a `MatBuf` and lit by `resolve()`. Figures are lit in bands (key, back, rim) by `renderFigure()`. |
| `dither.ts`, `mask.ts` | ordered thresholds; coverage masks (cone, radial, image) whose soft edges resolve to clean dither seams |
| `glyph.ts`, `glyphDraw.ts` | GLYPH: the frame rebuilt as JetBrains Mono tokens chosen by measured density, with contour glyphs and bloom. `glyphDissolve` breaks a sprite into tokens that blow away, or fly home with `reverse`. |
| `transitions.ts` | the render front (a sweeping scanline that re-renders the frame in the next palette), dither fade, dither wipe |
| `sprite.ts` | holds, cycles, whole-pixel moves, shakes, springs, typewriter, blinks, pose sheets |
| `font.ts`, `ui.ts` | 7 px and 14 px pixel faces; dialogue box, portrait window, name plate, name card, 1-bit system alert |
| `freeze.ts` | the dinner's per-founder freeze prints (a threshold plus one 50% screen) and the founder name card |
| `compose.ts`, `PixelScene.tsx` | the pure pipeline and its Remotion host |
| `cast/` | character modules: 112×136 portraits, room sprites, mouth and lid swaps, speaking sets. The cast builders own them, and they are not exported from `index.ts`. |
| `rooms/` | Act Four rooms at 480×203: boardroom, lobby, vegas-suite and tpool-door (built on `setkit.ts`); bullpen, lighthouse and darkroom (built on `kit-b.ts`) |
| `kits/` | Act Four FX kits: blueprint (THE PLAN), call grid, avalanche, props; insert hands and Mas inserts (`inserts-*.ts`, in progress) |

**Switch rules** (binding, from the showrunner):
- **BASE is the show.** GLYPH is for dark foreshadowing only.
- **Every other set is rare and has one motivation:** 1-BIT for 1993, EARLY-WEB16 for 2008–14, LEDGER for money (about 6 frames at most), TERMINAL for the machine's point of view, and 2-TONE FREEZE for name cards. Mas never freezes.
- **A switch never redraws the art.** It remaps the same frame, so it can cut in or out on any frame.
- **Dither never touches skin or figures.**
- **Only four transitions exist:** the render front, the whip streak, the flash-print of a freeze, and the candle wipe.

**Animation conventions:**
- Hold drawings on 2s or longer. Swap drawings; don't tween them.
- Move in whole pixels only. Never rotate or scale a sprite: draw the new angle instead.
- Shake the room, never the UI.
- A light change is a palette step.
- Windows open in three held steps.

**Engine changes must stay additive,** because other builders render with it. In v1.1 the pixeladv core moved into `shared/pixel`. The old import paths are now one-line shims, and the approved structure-test stills re-render pixel-identically (checked by diff).

### 1.6 Lookdev-era code (reference only)

These modules come from before pixel art was chosen. They stay in the repo as part of the decision record (§4). The show itself does not use them.

- **`src/shared/tonal/`: the tonal rig.**
  - The format is in `types.ts`: a back-to-front list of flat planes `{d, tone 0–4, hue, line?, angle?, transform?, light?}` plus a hue table.
  - Reference rigs: `masTone.ts`, `noleTone.ts`, and `env/` (the dark room and THE ORB).
  - Vector renderers in `ToneSvg.tsx`: `paint | soft | noir | riso | engrave`. Raster renderers in `ToneCanvas.tsx`: `glyph | pixel | dither | stipple`.
  - Compositions `test-tone-styles`, `tone-hero-<style>` and `tone-motion-<style>` are in `src/dev/tonetest/`. See [studio/notes/render.md](../studio/notes/render.md).
- **`src/shared/{draw,fx,anime,comic,collage,realism,title,type,characters}` and `src/dev/<structure>/`**: the v1 outline kit and the structural test builds. Their outputs are in `out/lookdev/looks/` and `out/lookdev/structures/`.

### 1.7 The intro (`src/intro`)

The composition is **`intro-ep1`**: 1920×1080, 24 fps, 720 frames. It is assembled from six "moments". Each moment was a separate builder with its own clock, dev entry (`src/dev/<moment>/`) and notes (`studio/notes/<moment>.md`):

| Moment | On screen | Content | Style |
|---|---|---|---|
| `mcoldopen` | f0–119 | The dark room. Mas posts "near the singularity; unclear which side." Inside the Orb's scan beam, the room shows as an endless data-center cathedral. | BASE + masked GLYPH |
| `meras` | f120–224 | 1993 (a 1-bit alert dialog), then a render front up through 2008 and 2014 | 1-BIT → EARLY-WEB16 |
| `mdinner1` | f225–344 | THE WOODROSE founding dinner: the Gerg and Alyi cards | BASE + 2-TONE freeze prints |
| `mdinner2` | f345–479 | The vault, the Mario and Nole cards, and Mas moving the neon N: OPEN → NOPE | BASE + freeze prints |
| `mrollcall` | f480–539 | THE PLAYERS roll call: eight portrait windows cut on eighth notes | BASE; the last portrait is a GLYPH cursor |
| `mfinale` | f540–719 | The dusk skyline, the MR. MAS title, and the bookend | BASE + a 2-frame GLYPH iris |

**Integration files:**
- `edl.ts`: the edit decision list, the single source of cut frames.
  - Each edit has an `origin` (the moment's local frame 0), a `span` (what the moment can render) and `from`/`to` (what is on screen).
  - A load-time check throws unless the edits tile 0–719 exactly, with no gap or overlap.
- `scenes.ts`: the same `PixelScene` definitions the moments mount, each wrapped by `qc.ts`.
- `qc.ts`: runs on each moment's final native frame. It currently maps the banned `#FF6600` (a real brand's orange) to `#FF7F2A`.
- `IntroEp1.tsx`: one `<Sequence>` per edit. A nested negative-offset `Sequence` lets an edit start after its moment's origin without touching the moment's code.

**How the intro was checked:**
- **Handoffs:** stills and pixel diffs at every cut. The 345–359 overlap is pixel-identical on all 15 frames.
- **Mounting:** each moment renders the same inside the intro as in its own composition.
- **Photosensitivity:** an automated luminance audit found at most 2 flashes in any 24-frame window, against a limit of 3.

Details are in [studio/notes/intro.md](../studio/notes/intro.md) and [out/season/intro/reports/](../out/season/intro/reports/).

**Silent master:** `bash studio/src/dev/intro/tools/master.sh 1080` runs three steps:
1. Remotion renders a lossless PNG sequence.
2. The bundled ffmpeg encodes it: libx264 (preset slow), crf 12, yuv420p, bt709, with nearest-neighbour chroma (`flags=neighbor`).
   - Every art pixel is a 4×4 block on even coordinates, so 4:2:0 chroma subsampling is exact.
   - Remotion's own encoder smeared colour across pixel edges. At the same crf, its worst frame measured 29.7 dB PSNR against the lossless render; this encode measures 34.8 dB.
3. It verifies 720 frames, 24/1, the frame size and the pixel format, then deletes the PNGs.

The output is `out/season/intro/picture/intro-ep1-1080p-silent.mp4`. The script and the dev-entry comments still offer a 4K option from before the render policy; see [Known issues](#6-known-issues).

**Picture events:** `studio/src/dev/intro/tools/events.ts` imports each moment's own timeline constants and writes `out/season/intro/picture/intro-events.json`, so a retime inside a moment re-flows into the export. The file holds:
- the EDL and the four handoffs;
- the 48 beats;
- 153 events, each `{f, end?, type, moment, what, src, script?}`.

Audio cues come from this file, not from the script (§2.4).

```sh
cd studio
npx esbuild src/dev/intro/tools/events.ts --bundle --platform=node --outfile=<scratch>/events.cjs \
  --loader:.woff=empty --loader:.woff2=empty --loader:.css=empty
node <scratch>/events.cjs ../out/season/intro/picture/intro-events.json
python3 src/dev/intro/tools/contact_sheet.py <png-seq-dir>                   # 48 beat stills + contact sheet
python3 src/dev/intro/tools/handoffs.py <png-seq-dir> <intro-raw-mdinner1 frames 340-359>
```

The review compositions `intro-raw-<moment>` (in `src/dev/intro/review.tsx`) render each moment over its whole authored span on the global clock, so both sides of an overlap can be compared.

### 1.8 Story reels (`src/reel`): in progress

These are rough stick-figure previews of every episode, about 3 minutes each, generated from data. They were rendering when this was written: `out/season/reels/ep01.mp4`–`ep11.mp4` were done by 14:44 on 2026-09-25, and ep12 and `season.mp4` were still to come. The Ep1 full animatic (`reel-ep01-full-part1/2`) is registered but has not been rendered yet ([RENDERING §3.9](RENDERING.md#39-ep1-full-animatic-in-progress)).

- **Data.** `show/reel/epNN.json` is the writers' file. It holds beats with kind, act, set, style, shot, cast, pose, face, fx and `reelDur`. The schema and normaliser are in `src/reel/schema.ts`. `ep01-full-part1/2.json` are a 1:1 full-episode animatic.
- **Sync.** `node src/reel/sync.mjs [--watch]` copies and lints the JSON into `src/reel/data/`. A file that doesn't parse becomes an error card, so one bad save can't break the bundle.
- **Compositions.** `registry.ts` registers a `reel-epNN` for each file (1280×720, 24 fps, a 3 s title card, then the beats), plus `reel-season`. The staging lives in `Stage.tsx`, `Sets.tsx`, `Figure.tsx` and `look.ts`.
- **Render.** `bash studio/src/dev/reel/render_all.sh [ep03 ep07 …]` produces:
  - `out/season/reels/epNN.mp4`, muxed with the temp bed from `audio/reel/` if one exists, or with a silent track;
  - `out/season/reels/season.mp4`;
  - a contact sheet for each reel in `out/season/reels/sheets/`.

  It honours the `CONC`, `NO_SEASON` and `NO_SHEETS` environment variables.
- **Beds.** The temp music beds are described in §2.7.

### 1.9 Ep1 Act Four (`src/episodes/ep01/act4`): in progress

Act Four is "THE BLIP, TOLD TWICE": scenes 24–31, 118 shots, 10,416 frames (7:14). It is the proof piece that [FORMAT-DECISION §1](../show/format/FORMAT-DECISION.md) recommends building first.

| Stage | Files | Status |
|---|---|---|
| Shot list | [shotlist.md](../show/episodes/ep01/production/act4/history/shotlist.md) + `shots.json` | done (board 1, script draft 2) |
| Cast | `shared/pixel/cast/*`; `act4/cast/entry.tsx` | done ([prep-cast](../show/episodes/ep01/production/act4/_prep-reports/prep-cast.md)) |
| Rooms A / Rooms B | `shared/pixel/rooms/*`; `act4/rooms-a/`, `act4/rooms-b/` | done ([rooms-a.md](../show/episodes/ep01/production/act4/rooms-a.md), [rooms-b.md](../show/episodes/ep01/production/act4/rooms-b.md)) |
| FX kits | `shared/pixel/kits/*`; `act4/kits/` | done ([kits-fx.md](../show/episodes/ep01/production/act4/kits-fx.md)) |
| Dialogue | `audio/ep01/act4/dialogue/`: 50 lines, 43 voiced (78.9 s) | done for draft 2; draft 3's V.O. lines have scratch reads only |
| Timing lock | `act4/animatic/tools/lock.py` → `shots-locked.json` + `animatic/data.ts` | done |
| Medium plates, inserts | `act4/medium/`, `act4/inserts/` | **in progress** |
| Animatic | `act4/animatic/kit.ts` (the layout kit), `tools/scratch_vo.py` | **in progress**: no composition is registered yet |

```sh
cd studio
npx remotion still  src/episodes/ep01/act4/cast/entry.tsx act4cast-sheet-neleh ../out/ep01/act4/assets/cast/neleh.png --bundle-cache=false --log=error
npx remotion still  src/episodes/ep01/act4/rooms-a/entry.tsx ep01a4-rooms-<plate> ../out/ep01/act4/assets/rooms-a/<plate>.png --bundle-cache=false --log=error
npx remotion render src/episodes/ep01/act4/kits/entry.tsx kits-plan ../out/ep01/act4/assets/kits/<name>.mp4 --scale=0.5 --concurrency=2 --bundle-cache=false --log=error
python3 src/episodes/ep01/act4/animatic/tools/lock.py        # re-time the act from the recorded lines (stdlib only)
# in progress: the inserts entry names act4ins-motion / act4ins-cu-26 in its header, but it does not bundle yet
# (inserts/frames.ts had not landed at the time of writing). medium/ has no entry yet.
```

The full list of Act Four render commands and composition ids is in [RENDERING §3.10](RENDERING.md#310-ep1-act-four-in-progress).

### 1.10 How work is verified

- **Picture.**
  - `npm run typecheck`. Per the builder notes, the only existing errors are in the lookdev code under `src/dev/realism`.
  - `strayColors` for off-palette pixels, and the banned-colour QC in `src/intro/qc.ts`.
  - Automated flash audits (for example `act4/kits/tools/flashcheck.ts`).
  - Node previews diffed against Remotion renders.
  - ffprobe checks on every master: frame count, frame rate, size, pixel format.
- **Looking.** Agents render stills and read them back as images. The builder rule is at least three rounds of fixes. For MP4s, frames are pulled into contact sheets.
- **Audio.** Every build writes QA JSON: loudness (BS.1770), true peak, exact sample counts, onset timing against frames, the residual when stems are summed against the master, pitch-class checks, and for speech, the character error rate from a local speech recognizer.
- **Nothing has been auditioned by a human ear yet.** Every audio report says so.

---

## 2. Audio

### 2.1 Folders and environments

| Folder | What it holds | Venv | Rebuild |
|---|---|---|---|
| [audio/theme/](../audio/theme/VARIATIONS.md) | The main-title score: 4 variations, stems, MIDI, `cues.json`, analysis | `.venv-theme` | `cd audio/theme && ../.venv-theme/bin/python build.py V1 V2 V3 V4 motif`, then `analyze.py`, `stemtable.py`, `make_cues.py` (about 1 CPU-min per variation) |
| audio/sfx/ | The SFX board: 218 manifest entries (131 sounds with their flavours, plus 87 character voice blips) | `.venv` | `audio/.venv/bin/python audio/sfx/scripts/build.py [--only PREFIX,…]`, then `audio/sfx/scripts/layout.py` |
| [audio/intro/sfx/](../audio/intro/sfx/spotting.md) | The intro SFX stem, spotted to the built picture | `.venv` | `audio/.venv/bin/python audio/intro/sfx/build_intro_sfx.py` (about 10 s) |
| [audio/voices/](../audio/voices/CASTING.md) | Voice casting, pass 1 | `.venv-casting` | `audio/.venv-casting/bin/python audio/voices/tools/cast.py [slug …]`, then `cast.py --finalize` |
| [audio/intro/vocals/](../audio/intro/vocals/README.md) | The vocal pass: cold-open takes, chant, harmony pads and stabs | `.venv-vocals` | `scripts/coldopen.py`, `lines.py`, `chant.py`, `harmony.py` (see its README) |
| [audio/intro/vox/](../audio/intro/vox/README.md) | Intro VO, chant and pad stems, cut to SCRIPT v2.1 | `.venv-vocals` | `build_vo.py` → `build_chant.py` → `build_pad.py` → `assemble.py` |
| [audio/intro/mix/](../audio/intro/mix/README.md) | The final intro mixes, AAC encodes and muxes | `.venv-mix` | `audio/intro/mix/scripts/run_all.sh` (about 2 min; the legacy 4K lines are skipped when there's no 4K master) |
| [audio/reel/](../audio/reel/README.md) | Temp beds for the story reels | `.venv` | `audio/.venv/bin/python audio/reel/build_all.py [epNN …] [--force] [--mux]` |
| audio/ep01/act4/dialogue/ | Act Four dialogue | `.venv-casting` | `HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/record.py [ids …]`, then `final_cast.py`, `reel.py`, `make_doc.py` |
| audio/intro/animatic/, audio/intro/history/sketch-mix/ | The intro animatic temp track and the first sketch mixes (superseded by `audio/intro/mix`; see [LISTENING_GUIDE](../audio/intro/history/sketch-mix/LISTENING_GUIDE.md)) | `.venv`, `.venv-mix` | `build_temp_track.py`; `scripts/render_music.py`, then `mix.py` and `qa_plots.py` with `V1 V2 V3 V4` ([RENDERING §3.7](RENDERING.md#37-audio-masters-theme-sfx-vocals-voice-casting-all-committed)) |

**Virtualenvs.** Each environment is frozen in `audio/requirements/<name>.txt`:

| Venv | Key packages |
|---|---|
| `.venv` (`venv.txt`) | numpy, scipy, soundfile, pedalboard, pretty_midi, tinysoundfont |
| `.venv-theme` (`venv-theme.txt`) | the `.venv` set, plus matplotlib, pyloudnorm, py7zr |
| `.venv-mix` (`venv-mix.txt`) | the `.venv` set, plus matplotlib and pyloudnorm |
| `.venv-vocals` (`venv-vocals.txt`) | kokoro 0.9.4, misaki, **torch 2.14.0+cpu**, transformers, pyworld, librosa, soxr, pedalboard, pyloudnorm, spaCy + `en_core_web_sm` |
| `.venv-casting` (`venv-casting.txt`) | the vocals set without pyworld, plus faster-whisper, jiwer and matplotlib (for the intelligibility QA) |
| `.venv-sfx` (`venv-sfx.txt`) | empty and unused; the SFX board runs in `.venv` |

```sh
cd audio
for v in "" -theme -mix; do python3.12 -m venv .venv$v && .venv$v/bin/pip install -r requirements/venv${v}.txt; done
for v in -vocals -casting; do
  python3.12 -m venv .venv$v
  .venv$v/bin/pip install -r requirements/venv${v}.txt --extra-index-url https://download.pytorch.org/whl/cpu   # the +cpu torch build
done
```

- **Models.** The Kokoro-82M weights (`hexgrad/Kokoro-82M`) and the faster-whisper `small.en` model download from Hugging Face into `~/.cache/huggingface` on first use.
- The Act Four tools run with `HF_HUB_OFFLINE=1`, so fetch the models once first, with `hf download` ([RENDERING §1.4](RENDERING.md#14-python-environments-all-audio)) or a casting run that doesn't set it.

### 2.2 Sample libraries (downloaded, not committed)

The scripts expect these libraries at the paths below (about 3.1 GB on disk, a 2.3 GB download). `bash audio/samples/fetch_samples.sh` re-downloads them from pinned sources and checks every file against `audio/samples/MANIFEST.sha256` ([RENDERING §2](RENDERING.md#2-sample-libraries)). [audio/samples/LICENSES.md](../audio/samples/LICENSES.md) is the committed licence record. The theme agent's own credits table (`theme-pack/LICENSES.md`) sits inside the ignored folder, so it has been copied into that file as well.

| Path under `audio/samples/` | Source | Licence | Used by |
|---|---|---|---|
| `vsco2ce-sfx/` (paths mirror the repo) | VS Chamber Orchestra 2 CE, Versilian Studios: <https://github.com/sgossner/VSCO-2-CE> | CC0 1.0; the upright piano is by Simon Dalzell / Ivy Audio | SFX board (the intro SFX reuses the committed board WAVs and reads no samples) |
| `generaluser-gs/GeneralUser-GS.sf2` | GeneralUser GS v2.0.3, S. Christian Collins | free for any music use | SFX (celesta, vibes, blips); theme (upright bass, jazz kit, reed organ, celesta, sample-chip layers) |
| `theme-pack/vsco2ce/` | VSCO 2 CE (as above; the subset the theme uses) | CC0 1.0 | theme: strings, brass incl. the Harmon mute, winds, harp, timpani, percussion |
| `theme-pack/vcsl/` | Versilian Community Sample Library: <https://github.com/sgossner/VCSL> | CC0 1.0 | theme: vibraphone, tenor sax, hi-hat, tubular bells, cymbal swells |
| `theme-pack/SalamanderGrandPiano-SF2-V3+20200602/` | Salamander Grand Piano V3 by Alexander Holm, SF2 by FreePats: <https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html> | **CC BY 3.0: credit required** | theme: grand piano |
| `theme-pack/UprightPianoKW-SF2-20220221/` | Upright Piano KW, FreePats | CC0 per its bundled readme (credit anyway) | theme: the felt piano; the story-reel beds |

Suggested credit line: "Orchestral samples: VS Chamber Orchestra 2 Community Edition and VCSL by Versilian Studios (CC0). Upright piano by Simon Dalzell / Ivy Audio. Salamander Grand Piano by Alexander Holm (CC BY 3.0). Upright Piano KW by FreePats. GeneralUser GS SoundFont by S. Christian Collins."

### 2.3 The score: composition in code

The main title is called "The Knee". Its source is [audio/theme/score/](../audio/theme/score/), and its engine is `audio/theme/engine/`.

- **Written as Python on the frame grid.** `score/common.py` and `v1.py`–`v4.py` build note lists in frames, where bar *n* starts at 60·(*n*−1). The shared material:
  - the **knee motif**, F F F F G A♭ C F;
  - the four card-hit voicings at f240 / 300 / 360 / 420: Fm11, D♭maj9♯11, B♭m9 and C7♯9♭13;
  - the title chord, F9sus4, which has no third.

  MIDI is exported per instrument with pretty_midi. The audio is rendered directly; it is not a MIDI playback.
- **Feel** (`engine/render.py`).
  - Swung eighths sit at +10 frames.
  - Each track is humanised: timing σ = 6 ms (clipped at 2.5σ), velocity jitter of 4%, from a seeded RNG.
  - Hits marked `lock=True` stay exactly on the grid.
  - Each instrument's onset latency is compensated on every note.
- **Instruments.**
  - `engine/sampler.py` plays WAV multisamples (VSCO 2 CE, VCSL), with pitch auto-calibrated and cached in `cache/calib.json`, and renders SoundFonts through tinysoundfont.
  - `engine/chip.py` synthesises the 8-bit voices in numpy: band-limited pulse, a NES-style stepped triangle, LFSR noise, a 1-bit beeper, and an SNES-style BRR "sample chip" with echo.
  - `engine/synth.py` makes the 808 sub, drones, brush sweeps, reverse swells, shimmer, room tone and bells.
- **Mix and master** (`engine/mix.py`, `engine/export.py`).
  - Per-track EQ, sends to synthetic hall and room impulse responses, and stem buses.
  - The master is a glue compressor, make-up gain and a look-ahead true-peak limiter, computed as one gain curve and iterated until it reads **−14.0 LUFS integrated** under a **−1 dBTP** ceiling (measured −1.15).
  - Stems are taken after the master gain and sum back to the master within −109 dB.
  - The VO duck is baked into the stems, so the mixer must not duck again.
  - The mastering chain is the project's own numpy/scipy code, measured with pyloudnorm. pedalboard is used elsewhere: SFX, vocals and casting.
- **Outputs.**
  - `theme-V*.wav` and `.mp3`;
  - `stems/V<n>-<stem>.wav` (piano, strings, brass, winds, harmon, bass, drums, perc, chip, sub, fx);
  - `midi/`;
  - `cues.json`: 58 cue rows, each marked as owned by the music or the SFX;
  - `analysis/`: balance tables, spectrograms, piano rolls.

| Variation | Orchestration | Measured balance (piano · orchestra · big band · chip) |
|---|---|---|
| **V1 Chip Chamber Jazz** (locked main title) | felt piano, chamber strings, chip lead; brass only on the accents and the roll call | 34 · 28 · 11 · 27 |
| V2 Orchestral Noir | strings, horns, timpani, dark grand, chip | 24 · 43 · 10 · 23 |
| V3 Pixel Swing | piano-trio swing, chip lead, full-band shout kicks | 33 · 14 · 18 · 35 |
| V4 Piano & Pixels (quiet episodes) | felt piano, chip and sub only | 58 · 0 · 0 · 42 |

### 2.4 SFX, and how the picture drives the spotting

**The board** lives in `audio/sfx/scripts/`: `registry.py`, `sounds_1–3.py`, `instruments.py`, `dsp.py`, `blips.py`, `layout.py` and `build.py`.
- Sounds are procedural (numpy, scipy, pedalboard), with CC0 VSCO 2 CE layers and GeneralUser GS celesta and vibes.
- Most sounds have a default "hybrid" version plus chip and band flavours (files named `*--chip` and `*--band`). Pitched sounds are tuned into the score's key.
- `manifest.json` lists every file with its pitch, use, suggested frames and anchor.
- The character "voices" on the board are instrument babble blips, not speech.
- Banned: meme sounds, real operating-system sounds, and lifts from other franchises ([audio/sfx/LICENSES.md](../audio/sfx/LICENSES.md)).

**Intro spotting** (`audio/intro/sfx/build_intro_sfx.py`):
1. It starts from the frames in SCRIPT v2.1 §9.3, which are the contract.
2. If `out/season/intro/picture/intro-events.json` exists, `parse_picture_events()` maps events to cue keys by type, moment and text: `orb.scan`, `collar.pop1`, `post.click`, `dialog.ok` and so on. Those picture frames override the script frames. Typing is cued keystroke by keystroke from the cold open's own timeline.
3. Every delta from the script goes to `picture-sync.json`. The full list goes to `spotting.json` and `spotting.md`.
4. It renders:
   - `intro-sfx_stem.wav`, the main SFX bus;
   - `intro-blip_stem.wav`, the card blips and the Orb chime;
   - `intro-sfx_extras.wav`, items the script cuts, muted by default;
   - a script-frame version in `alt/`.
5. `qa.json` checks the length, the required silences (the roll call and the title), the cut-dead at f480, and each sound's level against the V1 score.

`audio/intro/mix/scripts/verify.py` then confirms that the SFX was built against the current events file, and measures each cue's audible start against its frame (102 of 103 within 20 ms).

**After a picture retime:** re-export the events (§1.7), rebuild the SFX (about 10 s), then re-run the mix (about 2 min).

### 2.5 Voices

- **Engine.** Kokoro-82M v1.0 stock voice packs (Apache-2.0) with misaki G2P.
- **House rules** ([CASTING.md §0](../audio/voices/CASTING.md)):
  - Never clone and never mimic. No recording of a real person is used as a reference, input or target.
  - No accents for anyone (guardrail X10).
  - No age or health coding in any voice.
  - Each line carries its fact tag.
- **Shaping.** Each character is a stock pack, or a weighted average of stock packs, with ordinary studio processing:
  - pitch shifts of ±2 semitones at most (±3 for THE INTERN);
  - EQ moves of 2.5 dB at most, and light compression and saturation;
  - room sound on a pre-delayed send;
  - Kokoro's speed nudged by up to ±15% to land in each character's pace band.

  Very short lines are rendered inside a neutral carrier phrase and cut out of it.
- **Briefs first.** Each casting brief is written for a human performer: pitch, pace, texture, attitude and an avoid list. The synthetic candidates aim at the brief. Pass 1 is 10 characters × 3 candidates × 3 lines, with reels and a manifest.
- **QA without ears.** Each line is checked for:
  - loudness (−16 LUFS), true peak, clipping, and head and tail silence;
  - median F0 and range (pYIN) and words per minute;
  - intelligibility: faster-whisper `small.en` transcribes it, and the character error rate is scored against the script.
- **In the intro.**
  - Mas's line uses `am_michael`. It is fitted to the picture: the "side" vowel is compressed so the voice ends by f91.
  - The "feel the AGI" chant uses six stock voices.
  - The title pad is WORLD (pyworld) re-synthesis on F3–B♭3–C4–E♭4.
  - TTS renders are cached in `_work/tts_cache/` (gitignored), so re-runs on the same machine are bit-exact.
- **Status.** Every voice is scratch. The reports recommend human performers for Mas's line, the chant and the pad.

### 2.6 Mix and deliverables (intro)

[audio/intro/mix/README.md](../audio/intro/mix/README.md) has the full bus plan and ride tables.

- **Buses.**
  - **Music:** the theme stems with frame-based rides, plus the vocal pad. The score is trimmed to −15.5 LUFS before anything else is added.
  - **SFX:** the main stem and the blip stem, at unity.
  - **Dialogue:** the VO (−4 dB, centred) and the chant.
- **Master.** The master gain feeds a linked look-ahead true-peak limiter (2 ms look-ahead, 50 ms release, ceiling −1.3 dBTP to leave room for AAC overshoot). The gain is iterated until the mix reads **−14.00 LUFS-I**. After AAC encoding: −14.03 LUFS and −1.09 dBTP or lower.
- **Stems.** The V1 music, SFX and dialogue stems sum to the mix (residual −132 dBFS).
- **Encode and mux.** `encode_mux.sh` encodes AAC-LC at 256 kb/s with Remotion's ffmpeg, then muxes it with the silent picture. The video is stream-copied, so it is bit-identical to the silent master.
- **QA.** `qa/deliverables_qa.json` covers loudness, peaks, lengths, the decoded-AAC checks, A/V sync at 13 frames, and every cue's onset.
- **Outputs.** `audio/intro/mix/intro-ep1-mix-V{1..4}-*.wav` and `.m4a`; `out/season/intro/intro-ep1-V{1..4}-1080p.mp4`.

### 2.7 Temp beds

- **Story reels** (`audio/reel/reelbed.py`): one bed per reel JSON, timed exactly like the reel picture (a 72-frame title card plus Σ `reelDur`, rounded to frames). It is built from the theme engine and the V1 stems:
  - a pad of felt piano and chip;
  - soft ticks on beat changes;
  - brass or chip stabs on set-pieces and cards;
  - a 1-bit beeper under flashbacks and a shimmer under GLYPH beats.

  Levels: the bed sits at −20 LUFS short-term and each accent at −14 LUFS momentary. The build is deterministic, and it rebuilds only when a content hash changes. Status: all 12 beds are built; muxing them into the reels is **in progress** (§1.8).
- **The intro animatic's temp track** (`audio/intro/animatic/`) and **the sketch mixes** (`audio/intro/history/sketch-mix/`) are earlier passes, kept for history. Parts of them predate SCRIPT v2.1.

---

## 3. The agent workflow

### 3.1 Who does what

- **The showrunner** is the human user. They give direction, answer at approval gates, and make the binding calls: the style pick, the main title, the names, the POV, the render policy.
- **Everything else is done by AI coding agents** (Claude Code sessions), launched in parallel by workflow scripts.
  - Each agent gets a role, a brief, the files it owns and the docs it must read.
  - Each returns a written report. The reports are kept: `out/lookdev/structures/*/REPORT.md`, `out/season/intro/reports/*.md`, `studio/notes/_report-*.md`, `show/episodes/ep01/production/act4/_prep-reports/`.
- **Agents can't hear, and they see only the images they render.** Picture work is checked by rendering stills and reading them back. Audio work is checked by measurement. That is why every audio deliverable is marked "not auditioned".

### 3.2 Patterns

| Pattern | Shape | Used for |
|---|---|---|
| **Research sweep** | Parallel researchers split by era or domain. Every claim carries a tag ([P] primary, [V] verified, [H] headline only, [K] known but not re-checked, [UNVERIFIED]). A critic pass then fact-checks and looks for gaps. | the real-event timeline, the cast |
| **Design panel** | Two or three agents draft competing versions of the same thing. A synthesizer scores them against a rubric and merges the best parts. | the show concept, the opening, the POV |
| **Adversarial critics** | Several critics read one draft through different lenses: comedy, grounding and fairness, pacing, tone, timing, audio, POV, intimacy. A reviser rules on every note and logs the conflicts. | the creative package, the intro script, table reads |
| **Builders with file ownership** | One agent per asset or moment. It edits only the files it owns, renders through its own dev entry, iterates render → look → fix at least three times, keeps code deterministic, and writes `studio/notes/<key>.md` (see the builder rules in [ART_GUIDE.md](../studio/ART_GUIDE.md)). | lookdev, structure tests, intro moments, Act Four assets |
| **Art direction and polish** | An art-director critic reviews every render against the approved key frame. Polish agents apply the fixes. | the pixel intro |
| **Integrator** | Owns the assembly (the EDL, QC, masters, the mix). It verifies every handoff and tables deviations for their owners instead of editing their files. | intro picture, intro mix |
| **Gate** | The showrunner approves before the next phase. The decision is written into the owning doc. | style, main title, intro v2.1, names, POV, render policy; format pending |

### 3.3 The runs so far

| # | Run | Pattern | What it produced | Where |
|---|---|---|---|---|
| 1 | **Research sweeps** | Research sweep + critic. Eras: pre-2019, 2019–23, 2024–Sep 2026. Plus a craft sweep (title design, pipeline, music, voice, parody law), a gaps critic, three "worldcast" sweeps (industry, US politics, international and culture), a worldcast critic, cast integration and a flashback architect. The 200-call web-search budget ran out, so later checks used direct page fetches. | Tagged dossiers; the master timeline; the cast | [show/_sources/research/](../show/_sources/research/) |
| 2 | **Creative package v1** | Design panel + critics. Three show drafts (Prestige, Absurd, Caper) were scored and merged by a head writer. Three opening drafts were scored by a title-sequence director. Three critics followed: comedy, grounding and fairness, pacing and build. | [plan-v1.md](../show/_sources/plan-v1.md), [final.md](../show/_sources/design/final.md). Approved by the showrunner. | [show/_sources/design/](../show/_sources/design/) |
| 3 | **Writers' room build-out** | Parallel writers + a coordinator consistency pass | The bible, ~80 character files, 12 episodes × 7 files, the timeline and flashback map, the gag tracker, the world files | [show/INDEX.md](../show/INDEX.md) (coordinator log at the end) |
| 4 | **Lookdev: style spectrum** | Builders. One shared tonal rig, 9 renderers, hero stills and 3 s motion tests; title, environment and cast rigs. | Tonal renderers (§1.6) | [studio/notes/render.md](../studio/notes/render.md), `out/lookdev/looks/` |
| 5 | **Structural style tests** | Builders, one per option: the 8 options in [style-status §5](../show/bible/style-status.md), plus a collage fallback. Five delivered a full package (pixeladv, puppet, satire, screen, shape), each staging the same 5 s Mas-and-Nole test beat ("I came up with the name!") with a key frame, extras and a report. Anime, comic, collage and realism have dev renders only. | Key frames, extras, reports | [out/lookdev/structures/](../out/lookdev/structures/) |
| 6 | **Pixel intro build** | Builders → art director → polish → integrator. The engine and two cast rigs came first. Then six moments ran in parallel, plus a roll-call build and review. Then an [art-director critique](../studio/notes/_pixel-critique.md), polish passes [A](../studio/notes/_pixel-polish-a.md) and [B](../studio/notes/_pixel-polish-b.md), [integration](../studio/notes/intro.md), and a [picture fix pass](../out/season/intro/reports/picFix.md). | `intro-ep1`, silent master, events export | `studio/notes/`, `out/lookdev/pixel/`, `out/season/intro/` |
| 7 | **Intro script** | Draft + critics → revise. v2.0 got audio, timing and tone reviews ([history/](../show/intro/history/)). The v2.1 edit removed spoilers and added the roll call. A checker pass followed. | [SCRIPT.md](../show/intro/SCRIPT.md) v2.1 | `show/intro/` |
| 8 | **Audio** | Builders, then integration and review. Theme, SFX board, vocals and voice casting ran in parallel, then a sketch mix. Then intro-vox, intro-sfx and intro-mix were rebuilt to v2.1 and to the built picture. A review pass (sound-supervisor and editor notes) led to the [audio fix pass](../out/season/intro/reports/audFix.md). | Masters, stems, mixes, muxes | `audio/`, [out/season/intro/reports/](../out/season/intro/reports/) |
| 9 | **Format planning** | Three analyses → a ruling. [production-estimates](../show/format/production-estimates.md) was measured from the agent transcripts. It was read alongside [content-density](../show/format/content-density.md) and [pacing-model](../show/format/pacing-model.md). | [FORMAT-DECISION.md](../show/format/FORMAT-DECISION.md) (proposed) | `show/format/` |
| 10 | **Episode development** | Draft + table read. Ep1 script draft 2 went through table read 1. Story reels were built for all 12 episodes. | [ep01/script.md](../show/episodes/ep01/script.md), `show/reel/*.json` | `show/episodes/`, `show/reel/` |
| 11 | **POV design** | Design panel + critics. Three proposals (the Confiding Narrator, the Player-Character, the Intimate Chamber Piece) were scored and synthesized. Act Four was redrafted as draft 3. Three critics (comedy; POV and unreliability; intimacy, framing and pacing) held a table read, which led to draft 3.1 and rule revisions. | [pov-and-framing.md](../show/bible/pov-and-framing.md), [pov-changes.md](../show/episodes/ep01/production/act4/pov-changes.md) | `show/bible/` |
| 12 | **Ep1 Act Four production** (**in progress**) | Shot list → prep builders (cast, dialogue, kits, rooms A, rooms B) → the editor's timing lock → medium plates, inserts and the animatic | §1.9 | `show/episodes/ep01/production/act4/`, `studio/src/episodes/ep01/act4/` |

### 3.4 Measured cost

These numbers come from [production-estimates.md](../show/format/production-estimates.md), which measured the agent transcripts of the intro runs. An **agent-hour** is one agent working for one hour; agent-hours add up across parallel agents.

| Measure | Value |
|---|---|
| Intro picture, marginal | **6.45 agent-h for 30.0 s**, or 12.9 agent-min per finished second |
| Intro, all-in (picture, animatic, audio, script) | **13.8 agent-h**, about 28 agent-h per minute; the densest content the show will have |
| Intro wall-clock | **about 2 h 20 min** with about 8 agents at once (average 7.9, peak 12). The six moments took 81 min of wall time. |
| One-time pixel platform (structure test, engine, 2 cast rigs) | 3.7 agent-h |
| Sunk exploration | style bake-off ≈ 13.7 agent-h · writers' room ≈ 12.5 agent-h |
| Where agent time goes | 55% authoring code-as-art · 16% shell and inspection · 13% render and preview · 6% looking at renders · 6% typecheck |
| Final render on this CPU at 1080p | **1.2–2.9 CPU-min per finished minute**; not the bottleneck |
| Rule of thumb for picture | agent-min ≈ **0.4 × seconds + 3.5 × visual events** (a visual event is a new drawing, pose, gag beat, effect or cut) |
| Cheapest and dearest content | portrait dialogue in existing rooms ≈ 1.3 agent-h per minute (inferred, not yet measured); set-pieces ≈ 10.5; a beat-synced montage with new portraits ≈ 24 |
| Unit costs | speaking character 12–20 agent-min · cameo sprite 3–6 · rich room ≈ 20 · era mini-set 4–8 |
| Context ceiling | 540–670k tokens on 5–10 s of dense content. That caps a task at about 10 s of set-piece or 30–60 s of dialogue. |
| Season projection, 12 × 22 min | ≈ 1,470 agent-h (926–2,223) · ≈ 184 wall-h at 8 agents. The likely calendar bottleneck is showrunner review, not machine time. |

### 3.5 What went wrong, and what changed because of it

- **Rework.** About 9% of the intro's agent time was superseded. Causes:
  - the v2.1 brief change cut an already-built per-episode slot;
  - two handoff fallback spans were built and then not used;
  - three audio agents failed twice at start.
- **Duplicate modules.** Two polish agents each built a shared freeze-and-card module in parallel. One was deleted, and both dinner moments moved onto the survivor (`freeze.ts`). Lesson: a brief must assign ownership of any shared module up front.
- **Picture moved under the sound.** The picture fix pass moved many event frames. The fix was structural: audio now cues from the exported `intro-events.json` and checks that it was built against the current file, instead of trusting the script.
- **Docs drift.** Notes written during parallel builds lag behind later fixes. The known cases are listed in [§6](#6-known-issues).
- **No ears.** Every level and every "pick" is a measurement. The mixes and voices need a human audition before lock.

---

## 4. Decisions log

| Area | Decision | When / by | Status | Source |
|---|---|---|---|---|
| Visual | v1 "scaling fidelity": cut-paper and ink outlines, with the world rendered in four era tiers (1-bit → 240p → cut-paper → HDR) | design pass | **Rejected** by the showrunner as too cartoony | [style-status §1](../show/bible/style-status.md) |
| Visual | Tonal filter spectrum: one tonal rig in 9 renderers (paint, soft, noir, riso, engrave, glyph, pixel, dither, stipple) | lookdev | Exploration; kept as reference | [ART_GUIDE](../studio/ART_GUIDE.md), [render.md](../studio/notes/render.md) |
| Visual | Structural tests: 8 base idioms (anime cel, paper puppet, latex satire, adventure-game pixel, screenlife, graphic-shape cinema, semi-real painterly, noir comic) | lookdev | Exploration | [style-status §5–6](../show/bible/style-status.md) |
| Visual | **Pixel art, adventure-game structure, as the primary look**: 480×270, 4× nearest-neighbour, indexed palettes, hand-built light ramps | 2026-09-25, showrunner | **Locked** | [style-status](../show/bible/style-status.md) (DECISION box), [INTRO_PIXEL_BRIEF](../studio/INTRO_PIXEL_BRIEF.md) |
| Visual | **GLYPH for dark foreshadowing only**, placed for tone and comic timing. The intro's whole GLYPH budget is the scan cone, the roll-call cursor and the iris. | 2026-09-25, showrunner | Locked | [PIXEL_GUIDE §2](../studio/PIXEL_GUIDE.md), [SCRIPT.md](../show/intro/SCRIPT.md) |
| Visual | **Sparing switches:** 1-BIT (1993), EARLY-WEB16 (2008–14), LEDGER (money), TERMINAL (machine POV), 2-TONE freeze (name cards). "Never corny": a switch is over before it reads as an effect. | 2026-09-25, showrunner | Locked | [PIXEL_GUIDE §2](../studio/PIXEL_GUIDE.md) |
| Visual | Video-generation inserts may be cut in for fluid or realistic shots, converted to pixel or glyph in code; never realistic likenesses of real people | 2026-09-25 | Allowed; not used yet | [style-status](../show/bible/style-status.md) |
| Intro | "THE CURVE: everything scales." SCRIPT.md is the single source of truth, frame by frame | v2.0 → v2.1 | Current | [SCRIPT.md](../show/intro/SCRIPT.md) |
| Intro | **v2.1, no spoilers:** Ep1's fired/rehired bar is cut and replaced by THE PLAYERS roll call (traits, not events). Per-episode changes show only what has already aired. | 2026-09-25, showrunner | Built | [INTRO_PIXEL_BRIEF, REVISION v2.1](../studio/INTRO_PIXEL_BRIEF.md) |
| Audio | A blend of piano, orchestral and big band, **brass as accents only**, with a jazz feel; 8-bit chip motifs throughout as the identity | 2026-09-25, showrunner | Locked | [style-status](../show/bible/style-status.md), [SCRIPT.md](../show/intro/SCRIPT.md) |
| Audio | **V1 "Chip Chamber Jazz" is the main title.** V2–V4 are alternates (V4 for quiet episodes). | 2026-09-25, showrunner | **Locked** | [VARIATIONS.md](../audio/theme/VARIATIONS.md) |
| Audio | Voices are synthetic stock voices, never cloned; human performers recommended for the principals | casting pass | Current (scratch) | [CASTING.md](../audio/voices/CASTING.md) |
| Naming | Parody names by reversal or anagram (MAS MANALT, NOLE, NOPE AI …). They come only from the registry, and real quotes carry silent name swaps logged in `facts.md`. | writers' room | Current | [naming.md](../show/bible/naming.md) |
| Naming | **RUMPT** (DLANOD J. RUMPT) for the Trump equivalent; PMURT and PRUMT rejected | 2026-09-25, showrunner | Locked | [naming.md](../show/bible/naming.md) |
| POV | **Limited third person, close on Mas.** The camera is free. Sparse lowercase V.O. (5–8 lines per episode) is never heard in the world. He is unreliable in tone, never in fact, and every distortion is caught on screen. Exits from his POV are signposted. | 2026-09-25, showrunner notes + POV run | Working rule (Act Four draft 3.1) | [pov-clarification.md](../show/bible/pov-clarification.md), [pov-and-framing.md](../show/bible/pov-and-framing.md) |
| Format | **12 × 22:00** (story time 20:45); Ep9 up to 26:00; every episode built to split into two 11s; fact freeze at Ep9's lock (about Oct 30) | 2026-09-25 | **Proposed**, pending gate G0 | [FORMAT-DECISION.md](../show/format/FORMAT-DECISION.md) |
| Render | **1080p max**; previews at `--scale=0.5` | 2026-09-25, showrunner | Locked | [ART_GUIDE](../studio/ART_GUIDE.md), [PIXEL_GUIDE](../studio/PIXEL_GUIDE.md) |

---

## 5. Guardrails summary

[show/bible/guardrails.md](../show/bible/guardrails.md) is binding. When a joke and a guardrail disagree, the guardrail wins.

- **Hard exclusions (X1–X12).** None of these appear, not even as a background egg:
  - private and family life;
  - sexuality as a joke;
  - health and age;
  - violence against real people;
  - deaths, suicides and wrongful-death suits;
  - war and casualties (the Pentagon arc is paperwork only: stamps, receipts, badges);
  - CSAM and sexualized deepfakes;
  - Epstein and anything that evokes him;
  - unadjudicated crimes and allegations;
  - protected traits and accents;
  - election results;
  - personal allegations about officials.
- **Fairness.** Satire is even-handed: every episode roasts at least three camps, and each party gets its turn.
- **Facts.**
  - The broad plot follows real, dated, verified events, each tagged in `facts.md`.
  - Real quotes are verbatim apart from the silent name swap.
  - Invented material must be obviously comedic.
  - Truth labels (`RECONSTRUCTED`, `HIS VERSION`, `(DISPUTED)`) stay legible in every style.
- **Legal hygiene.**
  - Parody names only; no real logos or UI. Brand colours are avoided (see the `#FF6600` QC in §1.7).
  - Caricature is stylized, never photoreal or deepfake.
  - Exaggerate props, poses and conduct, never bodies: no body-shaming and no ethnic caricature.
- **Voices.** No cloning, no mimicry, no accents, no age or health coding (§2.5).
- **Broadcast safety.**
  - At most 3 flashes in any 24-frame window, with an automated audit on every render.
  - Must-read text stays on screen for at least 0.25 s + 0.05 s per character.

---

## 6. Known issues

These are technical caveats for anyone rebuilding from a clone.

- **Paths (fixed 2026-09-29).** No script hard-codes the repo's location any more: each finds the root through the `.mrmas-root` marker (`MRMAS_ROOT` overrides it), so a clone works anywhere ([RENDERING §1.1](RENDERING.md#11-paths-clone-anywhere)). `master.sh` and `verify.py` still default their scratch folder to a session path under `/tmp/claude-1000/`; both create it if it's missing, `master.sh` takes a scratch folder as its second argument and `verify.py` reads `MIX_TMP`.
- **4K leftovers (fixed).** `master.sh` defaults to 1080p (`4k`/`all` remain only for legacy use). `encode_mux.sh` and `verify.py` handle a 4K file only if one exists. Under the render policy, don't render 4K.
- **Reel temp bundle.** `render_all.sh` keeps a bundle of about 30 MB in `out/season/reels/.tmp/` while it runs and deletes it at the end. `.tmp/` is gitignored.
- **Not auditioned.** No mix, stem, voice or bed has been listened to by a person yet.
- **Voice rebuilds may differ slightly.** The TTS cache is gitignored, so a fresh VO rebuild re-renders through Kokoro. The result may not match the committed stems bit for bit. None of this matters for a video re-render, because every voice stem and mix is committed.
- **Stale docs.**
  - [show/INDEX.md](../show/INDEX.md) still says the visual style is PENDING. The decision box in [style-status.md](../show/bible/style-status.md) is current; the rest of that page is kept as history.
  - The Deviations table in [studio/notes/intro.md](../studio/notes/intro.md) predates the [picture fix pass](../out/season/intro/reports/picFix.md).
  - The intro switch-plan table in [PIXEL_GUIDE §2](../studio/PIXEL_GUIDE.md) predates the v2.1 retimes. For current frames, use `intro-events.json`.
  - [LISTENING_GUIDE.md](../audio/intro/history/sketch-mix/LISTENING_GUIDE.md) describes the superseded sketch mixes.
- **Typecheck.** The existing errors are in the lookdev code under `src/dev/realism`, per the builder notes.
- **An empty environment.** `audio/requirements/venv-sfx.txt` is empty, and `.venv-sfx` is unused.

---

## Appendix: rebuild order

This appendix shows the dependency order at a glance. [RENDERING.md](RENDERING.md) has the full, verified steps.

A fresh clone already has every audio master, stem and QA file. What it lacks is the videos, the dependencies and the sample libraries. Steps marked *optional* are needed only after a source change.

| # | Step | Command | Output |
|---|---|---|---|
| 0 | Repo location | clone anywhere ([RENDERING §1.1](RENDERING.md#11-paths-clone-anywhere)) | every script finds the root through `.mrmas-root` |
| 1 | Studio dependencies | `cd studio && npm ci && npx remotion browser ensure` | `node_modules/` (includes Remotion's Chrome and ffmpeg) |
| 2 | Audio environments and samples (not needed for the intro video itself) | the venv loop in §2.1, then `bash audio/samples/fetch_samples.sh` | `audio/.venv*`, `audio/samples/` |
| 3 | Intro silent master | `bash studio/src/dev/intro/tools/master.sh 1080 "$(mktemp -d)"` | `out/season/intro/picture/intro-ep1-1080p-silent.mp4` |
| 4 | *optional:* picture events (after any picture change) | the esbuild + node commands in §1.7 | `out/season/intro/picture/intro-events.json` |
| 5 | *optional:* score (after a score change) | `cd audio/theme && ../.venv-theme/bin/python build.py V1 V2 V3 V4 motif` (+ analyze, stemtable, make_cues) | `audio/theme/theme-V*.wav`, `stems/`, `cues.json` |
| 6 | *optional:* intro voices | `audio/intro/vox/scripts`: `build_vo.py` → `build_chant.py` → `build_pad.py` → `assemble.py` (with `.venv-vocals`) | `audio/intro/vox/*.wav`, `stems/` |
| 7 | *optional:* intro SFX (after step 4) | `audio/.venv/bin/python audio/intro/sfx/build_intro_sfx.py` | `audio/intro/sfx/*.wav`, `spotting.*` |
| 8 | Intro muxed videos (and, after a sound change, the mixes) | the 1080p mux loop in [RENDERING's quick start](RENDERING.md#quick-start-re-render-the-intro-in-one-go) step 3; after a sound change, [RENDERING §3.1 step 7](RENDERING.md#31-the-final-intro) first. `run_all.sh` also works (the 4K steps are skipped without a 4K master). | `out/season/intro/intro-ep1-V{1..4}-1080p.mp4` |
| 9 | Story-reel beds | `audio/.venv/bin/python audio/reel/build_all.py` | `audio/reel/epNN.wav` |
| 10 | Story reels | `bash studio/src/dev/reel/render_all.sh` | `out/season/reels/epNN.mp4`, `season.mp4`, `sheets/` |
| 11 | Other previews (animatic, lookdev, structure tests, moments, Act Four assets) | [RENDERING §3.2–§3.6 and §3.10](RENDERING.md#3-recipes); also the `npx remotion still/render` lines in each dev entry's header comment and in `studio/notes/<key>.md` | `out/season/intro/animatic/`, `out/lookdev/looks/`, `out/lookdev/structures/`, `out/lookdev/pixel/`, `out/ep01/` |
